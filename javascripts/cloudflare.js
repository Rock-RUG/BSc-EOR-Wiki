// v48 patch base: user-uploaded /mnt/data/cloudflare.js sha256=5b8b53c690744036641d510cab96bc60b8326e83085bebe647cd327bfb4986c3
// fixes: page_action tombstones, event-file canonical projection, anonymous guest daily limit.
// mkdocs-hot-d1-worker.js
// Cloudflare Worker for MkDocs page views, popularity, favourites, and comments.
// Uses existing D1 binding: DB
// Existing views tables are preserved: pages, page_views_daily

const POPULAR_WEIGHTS = {
  favorite: 8,
  comment: 5,
  mastery: 4,
  ai_quiz: 3,
  reaction: 3,
  map_open: 2,
  views: 0.15,
};

const USER_DAILY_XP_CAP = 50;
const USER_DAILY_XP_BASE_CAP = 50;
const USER_DAILY_XP_CAP_PER_LEVEL = 5;
const ACCOUNT_JSON_ACTIVITY_EVENT_MAX = 10000;
const USER_RANKING_PROJECTION_VERSION = "xp-ledger-v3";
const WORKER_BUILD = "2026-06-07-avatar-r2-binding-36";

const USER_ACTIVITY_RULES = {
  // Core reading and saved-page habits
  active_day: { xp: 4, dailyCap: 4, category: "Reading" },
  view: { xp: 0.15, dailyCap: 6, category: "Reading" },
  saved_page_action: { xp: 1, dailyCap: 3, category: "Saved pages" },
  saved_page_visit: { xp: 1.5, dailyCap: 6, category: "Saved pages" },

  // Core learning journey
  mastery: { xp: 1, dailyCap: 10, category: "Learning" },
  ai_quiz: { xp: 8, dailyCap: 40, category: "Learning" },
  guided_study_start: { xp: 1, dailyCap: 3, category: "Learning" },
  map_open: { xp: 1, dailyCap: 2, category: "Learning" },
  prerequisite_readiness_open: { xp: 0.3, dailyCap: 1.5, category: "Learning" },
  course_diagnostics_open: { xp: 0.3, dailyCap: 1.2, category: "Learning" },

  // Discovery and navigation
  course_search: { xp: 0.2, dailyCap: 1, category: "Learning" },
  concept_finder_open: { xp: 0.3, dailyCap: 1.2, category: "Learning" },
  random_browse_start: { xp: 0.5, dailyCap: 2, category: "Learning" },
  search_suggestion: { xp: 0.2, dailyCap: 1, category: "Learning" },
  sort_use: { xp: 0.05, dailyCap: 0.5, category: "Learning" },
  panel_open: { xp: 0.2, dailyCap: 1, category: "Learning" },

  // Community actions
  comment: { xp: 8, dailyCap: 32, category: "Community" },
  reply: { xp: 5, dailyCap: 25, category: "Community" },
  reaction_given: { xp: 0.5, dailyCap: 5, category: "Community" },
  reaction_received: { xp: 1, dailyCap: 10, category: "Community" },
  mention_given: { xp: 0.5, dailyCap: 3, category: "Community" },
  mention_received: { xp: 1, dailyCap: 5, category: "Community" },
  comment_edit: { xp: 0.2, dailyCap: 1, category: "Community" },
  report: { xp: 1, dailyCap: 3, category: "Community" },
  bug_report: { xp: 4, dailyCap: 12, category: "Community" },

  // Account / connection actions
  account_tab_open: { xp: 0.05, dailyCap: 0.5, category: "Account" },
  notification_read: { xp: 1, dailyCap: 3, category: "Account" },
  avatar_upload: { xp: 5, dailyCap: 5, category: "Account" },
  intro_update: { xp: 3, dailyCap: 3, category: "Account" },
  privacy_update: { xp: 3, dailyCap: 3, category: "Account", oneTime: true },
  sync_device_connected: { xp: 2, dailyCap: 4, category: "Account" },
  connection_request: { xp: 1, dailyCap: 3, category: "Connections" },
  connection_added: { xp: 5, dailyCap: 10, category: "Connections" },
};

const STATE_GATED_ACTIVITY_METRICS = new Set([
  "saved_page_visit",
  "map_open",
  "concept_finder_open",
  "search_suggestion",
  "sort_use",
  "course_search",
  "random_browse_start",
  "guided_study_start",
  "course_diagnostics_open",
  "prerequisite_readiness_open",
  "panel_open",
]);

const CONCEPT_REPEAT_DISCOUNTS = {
  view: 0.20,
  panel_open: 0.25,
  map_open: 0.25,
  course_search: 0.50,
  concept_finder_open: 0.50,
  random_browse_start: 0.50,
  guided_study_start: 0.50,
  course_diagnostics_open: 0.50,
  prerequisite_readiness_open: 0.50,
  mastery: 0.30,
  ai_quiz: 0.40,
  saved_page_action: 0.25,
  comment: 0.50,
  reply: 0.50,
  reaction_given: 0.50,
  reaction_received: 0.50,
  connection_request: 0.25,
  connection_added: 0.25,
  avatar_upload: 0.25,
  intro_update: 0.25,
  report: 0.50,
  bug_report: 0.50,
};

const CONCEPT_REPEAT_GROUPS = {
  comment: "comment_reply",
  reply: "comment_reply",
  reaction_given: "reaction_report",
  reaction_received: "reaction_report",
  report: "reaction_report",
  bug_report: "reaction_report",
};

const USER_ACTIVITY_WEIGHTS = Object.fromEntries(
  Object.entries(USER_ACTIVITY_RULES).map(([metric, rule]) => [metric, Number(rule && rule.xp || 0)])
);

const USER_LEVEL_THRESHOLDS = [0, 50, 140, 300, 600, 1100, 1900, 3200, 5200, 8000];
const PROFILE_CHANGE_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

function sqlStringLiteral(value) {
  return `'${String(value || "").replace(/'/g, "''")}'`;
}

function userActivityScoreSqlExpr(prefix = "") {
  const p = prefix ? `${prefix}.` : "";
  const cases = Object.entries(USER_ACTIVITY_WEIGHTS).map(([metric, weight]) => {
    const w = Number(weight || 0);
    return `WHEN ${sqlStringLiteral(metric)} THEN COALESCE(${p}count,0) * ${Number.isFinite(w) ? w : 0}`;
  }).join(" ");
  return `(CASE ${p}metric ${cases} ELSE 0 END)`;
}

function scoreForActivityMetric(metric, count, fallbackScore = 0) {
  const m = activityMetric(metric) || String(metric || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  const c = Math.max(0, Number(count || 0));
  if (Object.prototype.hasOwnProperty.call(USER_ACTIVITY_WEIGHTS, m)) {
    return roundScore(c * Number(USER_ACTIVITY_WEIGHTS[m] || 0));
  }
  return 0;
}

function isCurrentUserActivityMetric(metric) {
  return !!activityMetric(metric);
}

const EVENT_TO_METRIC = {
  mastery_submit: "mastery",
  mastery: "mastery",
  ai_quiz_attempt: "ai_quiz",
  ai_quiz: "ai_quiz",
  quiz_attempt: "ai_quiz",
  map_open: "map_open",
  map: "map_open",
  guided_study_start: "guided_study_start",
  start_guided_study: "guided_study_start",
  random_route_start: "guided_study_start",
  course_diagnostics_open: "course_diagnostics_open",
  prerequisite_readiness_open: "prerequisite_readiness_open",
  bug_report: "bug_report",
  ai_bug_report: "bug_report",
  report_bug: "bug_report",
};

const EXCLUDE_EXACT = new Set([
  "index.html",
  "about.html",
  "how-it-works.html",
  "random.html",
  "custom-random.html",
  "trending.html",
  "search.html",
  "contributors.html",
  "sitemap.xml",
  "sitemap.xml.gz",
  "404.html",
  "debug.html",
]);

const EXCLUDE_SUBSTR = [
  "debug",
  "assets/",
  "/assets/",
  "sitemap",
  "404",
];

let schemaReady = false;
let schemaPromise = null;

export default {
  async fetch(req, env, ctx) {
    try {
      if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req, env) });
      if (!env.DB) return json({ ok: false, error: "D1 binding DB not found." }, 500, req, env);

      await ensureSchema(env.DB);

      const url = new URL(req.url);
      const path = url.pathname.replace(/\/+$/g, "") || "/";

      if (path === "/track" && req.method === "POST") return handleTrack(req, env);
      if (path === "/event" && req.method === "POST") return handleEvent(req, env);
      if (path === "/activity" && req.method === "POST") return handleActivityEvent(req, env);
      if (path === "/hot" && req.method === "GET") return handleHot(req, env, url);
      if (path === "/page-state" && req.method === "GET") return handlePageState(req, env, url);
      if (path === "/favorite/toggle" && req.method === "POST") return handleFavoriteToggle(req, env);
      if (path === "/identity" && req.method === "GET") return handleGetIdentity(req, env, url);
      if (path === "/identity" && req.method === "POST") return handleSetIdentity(req, env);
      if (path === "/identity/unlink" && req.method === "POST") return handleUnlinkIdentity(req, env);
      if (path === "/identity/delete-account" && req.method === "POST") return handleDeleteIdentityAccount(req, env);
      if (path === "/identity/devices" && req.method === "GET") return handleGetDevices(req, env, url);
      if (path === "/identity/device-name" && req.method === "POST") return handleSetDeviceName(req, env);
      if (path === "/identity/device-disconnect" && req.method === "POST") return handleDisconnectDevice(req, env);
      if (path === "/identity/sync-code" && req.method === "POST") return handleCreateSyncCode(req, env);
      if (path === "/identity/sync-claim" && req.method === "POST") return handleClaimSyncCode(req, env);
      if (path === "/identity/recovery-code" && req.method === "POST") return handleCreateRecoveryCode(req, env);
      if (path === "/identity/recovery-claim" && req.method === "POST") return handleClaimRecoveryCode(req, env);
      if (path === "/identity/import-local" && req.method === "POST") return handleImportLocalActivity(req, env);
      if (path === "/identity/activity" && req.method === "GET") return handleGetAccountActivity(req, env, url);
      if (path === "/identity/xp" && req.method === "GET") return handleGetIdentityXp(req, env, url);
      if (path === "/identity/level-up-rewards" && req.method === "POST") return handleApplyLevelUpRewards(req, env);
      if (path === "/identity/mastery" && req.method === "GET") return handleGetAccountMastery(req, env, url);
      if (path === "/identity/mastery" && req.method === "POST") return handleSetAccountMastery(req, env);
      if (path === "/identity/mastery-json-sync" && req.method === "GET") return handleGetMasteryJsonSnapshot(req, env, url);
      if (path === "/identity/mastery-json-sync" && req.method === "POST") return handlePostMasteryJsonSnapshotChunk(req, env);
      if (path === "/identity/account-file-sync" && req.method === "GET") return handleGetAccountEventFile(req, env, url);
      if (path === "/identity/account-file-sync" && req.method === "POST") return handlePostAccountEventFile(req, env, ctx);
      if (path === "/identity/account-event" && req.method === "POST") return handleAppendAccountEvent(req, env, ctx);
      if (path === "/identity/shop-state" && req.method === "GET") return handleGetAccountShopState(req, env, url);
      if (path === "/identity/shop-purchase" && req.method === "POST") return handlePostAccountShopPurchase(req, env);
      if (path === "/identity/json-sync" && req.method === "GET") return handleGetAccountJsonSnapshot(req, env, url);
      if (path === "/identity/json-sync" && req.method === "POST") return handlePostAccountJsonSnapshotChunk(req, env);
      if (path === "/identity/avatar" && req.method === "POST") return handleUploadAvatar(req, env);
      if (path === "/identity/avatar-frame" && req.method === "POST") return handleSetAvatarFrame(req, env);
      if (path === "/identity/privacy" && req.method === "GET") return handleGetPrivacy(req, env, url);
      if (path === "/identity/privacy" && req.method === "POST") return handleSetPrivacy(req, env);
      if (path === "/connections" && req.method === "GET") return handleGetConnections(req, env, url);
      if (path === "/connections/request" && req.method === "POST") return handleConnectionRequest(req, env);
      if (path === "/connections/respond" && req.method === "POST") return handleConnectionRespond(req, env);
      if (path === "/connections/remove" && req.method === "POST") return handleConnectionRemove(req, env);
      if ((path === "/readiness" || path === "/readiness/average") && req.method === "GET") return handleGetReadiness(req, env, url);
      if (path === "/readiness" && req.method === "POST") return handleSetReadiness(req, env);
      if ((path === "/concept-score/average" || path === "/concept-score") && req.method === "GET") return handleGetConceptScoreAverage(req, env, url);
      if (path === "/concept-score" && req.method === "POST") return handleSetConceptScore(req, env);
      if (path === "/profile" && req.method === "GET") return handlePublicProfile(req, env, url);
      if (path === "/page-action/toggle" && req.method === "POST") return handlePageActionToggle(req, env);
      if (path === "/page-edit/source" && req.method === "GET") return handlePageEditSource(req, env, url);
      if (path === "/page-edit/submit" && req.method === "POST") return handlePageEditSubmit(req, env);
      if (path === "/page-edit/admin" && req.method === "GET") return handlePageEditAdmin(req, env, url);
      if (path === "/page-edit/status" && req.method === "POST") return handlePageEditStatus(req, env);
      if (path === "/page-edit/admin-download" && req.method === "GET") return handlePageEditAdminDownload(req, env, url);
      if (url.pathname.startsWith("/avatar/") && req.method === "GET") return handleServeAvatar(req, env, url);
      if (path === "/comments" && req.method === "GET") return handleGetComments(req, env, url);
      if (path === "/comments" && req.method === "POST") return handleAddComment(req, env);
      if (path === "/comments/delete" && req.method === "POST") return handleDeleteComment(req, env);
      if (path === "/comments/edit" && req.method === "POST") return handleEditComment(req, env);
      if (path === "/comments/report" && req.method === "POST") return handleReportComment(req, env);
      if (path === "/comments/admin" && req.method === "GET") return handleCommentsAdmin(req, env, url);
      if (path === "/comments/report-status" && req.method === "POST") return handleCommentReportStatus(req, env);
      if (path === "/notifications" && req.method === "GET") return handleNotifications(req, env, url);
      if (path === "/notifications/seen" && req.method === "POST") return handleNotificationsSeen(req, env);
      if (path === "/shop/dynamic-prices" && req.method === "GET") return handleGetShopDynamicPrices(req, env, url);
      if (path === "/xp-voucher/activate" && req.method === "POST") return handleActivateXpCapBoostVoucher(req, env);
      if (path === "/xp-voucher/admin-grant" && req.method === "POST") return handleAdminGrantXpCapBoostVoucher(req, env);
      if (path === "/admin/report-decision" && req.method === "POST") return handleAdminReportDecision(req, env);
      if (path === "/admin/purge-demo-accounts" && req.method === "POST") return handleAdminPurgeDemoAccounts(req, env);
      if (path === "/comment-reaction" && req.method === "POST") return handleCommentReaction(req, env);
      if (path === "/comment-reactions" && req.method === "GET") return handleCommentReactionsList(req, env, url);

      // --- v2 cloud-authoritative XP / currency / rankings / shop ---
      if (path === "/v2/event" && req.method === "POST") return handleV2Event(req, env);
      if (path === "/v2/state" && req.method === "GET") return handleV2State(req, env, url);
      if (path === "/v2/rankings" && req.method === "GET") return handleV2Rankings(req, env, url);
      if (path === "/v2/shop/purchase" && req.method === "POST") return handleV2ShopPurchase(req, env);
      if (path === "/v2/shop/equip" && req.method === "POST") return handleV2ShopEquip(req, env);
      if (path === "/v2/profile" && req.method === "GET") return handleV2Profile(req, env, url);
      if (path === "/v2/privacy" && req.method === "POST") return handleV2SetPrivacy(req, env);
      if (path === "/v2/import" && req.method === "POST") return handleV2Import(req, env);

      return json({
        ok: true,
        service: "mkdocs-hot-d1",
        build: WORKER_BUILD,
        avatarStorage: !!r2Bucket(env),
        endpoints: ["/track", "/event", "/activity", "/hot", "/page-state", "/favorite/toggle", "/identity", "/identity/unlink", "/identity/delete-account", "/identity/devices", "/identity/device-name", "/identity/device-disconnect", "/identity/sync-code", "/identity/sync-claim", "/identity/recovery-code", "/identity/recovery-claim", "/identity/import-local", "/identity/activity", "/identity/xp", "/identity/level-up-rewards", "/identity/mastery", "/identity/mastery-json-sync", "/identity/json-sync", "/identity/account-file-sync", "/identity/account-event", "/identity/shop-state", "/identity/shop-purchase", "/identity/avatar", "/identity/avatar-frame", "/identity/privacy", "/connections", "/connections/request", "/connections/respond", "/connections/remove", "/readiness", "/concept-score", "/concept-score/average", "/profile", "/page-action/toggle", "/page-edit/source", "/page-edit/submit", "/page-edit/admin", "/page-edit/status", "/page-edit/admin-download", "/avatar/<key>", "/comments", "/comments/delete", "/comments/edit", "/comments/report", "/comments/admin", "/comments/report-status", "/notifications", "/notifications/seen", "/xp-voucher/activate", "/xp-voucher/admin-grant", "/admin/report-decision", "/admin/purge-demo-accounts", "/comment-reaction", "/comment-reactions"],
      }, 200, req, env);
    } catch (err) {
      return json({ ok: false, error: String(err && err.message ? err.message : err) }, 500, req, env);
    }
  },
};

async function ensureSchema(db) {
  if (schemaReady) return;
  if (schemaPromise) return schemaPromise;

  const statements = [
    `CREATE TABLE IF NOT EXISTS pages (
      path TEXT PRIMARY KEY,
      title TEXT,
      total_views INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS page_views_daily (
      day TEXT NOT NULL,
      path TEXT NOT NULL,
      views INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(day, path)
    )`,
    `CREATE TABLE IF NOT EXISTS engagement_totals (
      path TEXT NOT NULL,
      metric TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(path, metric)
    )`,
    `CREATE TABLE IF NOT EXISTS engagement_daily (
      day TEXT NOT NULL,
      path TEXT NOT NULL,
      metric TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(day, path, metric)
    )`,
    `CREATE TABLE IF NOT EXISTS favorites (
      visitor_hash TEXT NOT NULL,
      path TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      account_key TEXT,
      PRIMARY KEY(visitor_hash, path)
    )`,
    `CREATE TABLE IF NOT EXISTS comment_identities (
      visitor_hash TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_key TEXT NOT NULL UNIQUE,
      avatar TEXT,
      is_public INTEGER NOT NULL DEFAULT 0,
      bio TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      name_changed_at INTEGER NOT NULL DEFAULT 0,
      avatar_changed_at INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE INDEX IF NOT EXISTS idx_comment_identities_name ON comment_identities(name_key)`,
    `CREATE TABLE IF NOT EXISTS account_device_links (
      visitor_hash TEXT PRIMARY KEY,
      name_key TEXT NOT NULL,
      linked_at INTEGER NOT NULL,
      device_name TEXT,
      last_seen INTEGER NOT NULL DEFAULT 0,
      revoked_at INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_device_links_name ON account_device_links(name_key)`,
    `CREATE TABLE IF NOT EXISTS account_privacy_settings (
      account_key TEXT PRIMARY KEY,
      profile_public INTEGER NOT NULL DEFAULT 0,
      visits_public INTEGER NOT NULL DEFAULT 0,
      actions_public INTEGER NOT NULL DEFAULT 0,
      comments_public INTEGER NOT NULL DEFAULT 0,
      readiness_public INTEGER NOT NULL DEFAULT 0,
      ranking_public INTEGER NOT NULL DEFAULT 0,
      profile_visibility TEXT NOT NULL DEFAULT 'private',
      visits_visibility TEXT NOT NULL DEFAULT 'private',
      actions_visibility TEXT NOT NULL DEFAULT 'private',
      comments_visibility TEXT NOT NULL DEFAULT 'private',
      readiness_visibility TEXT NOT NULL DEFAULT 'private',
      ranking_visibility TEXT NOT NULL DEFAULT 'private',
      updated_at INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS account_profile_rewards (
      account_key TEXT PRIMARY KEY,
      selected_frame TEXT NOT NULL DEFAULT 'level-1',
      highest_level_seen INTEGER NOT NULL DEFAULT 1,
      last_level_up_at INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS account_readiness (
      account_key TEXT NOT NULL,
      path TEXT NOT NULL,
      title TEXT,
      readiness REAL NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, path)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_readiness_path ON account_readiness(path)`,
    `CREATE INDEX IF NOT EXISTS idx_account_readiness_account ON account_readiness(account_key, updated_at)`,
    `CREATE TABLE IF NOT EXISTS account_mastery (
      account_key TEXT NOT NULL,
      path TEXT NOT NULL,
      title TEXT,
      data_json TEXT,
      m INTEGER,
      view_count INTEGER NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      last_reviewed INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, path)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_mastery_account ON account_mastery(account_key, updated_at)`,
    `CREATE TABLE IF NOT EXISTS account_ai_quiz_sessions (
      account_key TEXT NOT NULL,
      path TEXT NOT NULL,
      result_id TEXT NOT NULL,
      title TEXT,
      session_json TEXT,
      completed_at INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, path, result_id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_ai_quiz_sessions_account ON account_ai_quiz_sessions(account_key, completed_at)`,
    `CREATE TABLE IF NOT EXISTS account_mastery_json_snapshot_chunks (
      account_key TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, chunk_index)
    )`,
    `CREATE TABLE IF NOT EXISTS account_mastery_json_upload_chunks (
      account_key TEXT NOT NULL,
      sync_id TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, sync_id, chunk_index)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_mastery_json_upload_chunks_account ON account_mastery_json_upload_chunks(account_key, created_at)`,
    `CREATE TABLE IF NOT EXISTS account_json_snapshot_chunks (
      account_key TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, chunk_index)
    )`,
    `CREATE TABLE IF NOT EXISTS account_json_upload_chunks (
      account_key TEXT NOT NULL,
      sync_id TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, sync_id, chunk_index)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_json_upload_chunks_account ON account_json_upload_chunks(account_key, created_at)`,
    `CREATE TABLE IF NOT EXISTS account_event_file_snapshot_chunks (
      account_key TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, chunk_index)
    )`,
    `CREATE TABLE IF NOT EXISTS account_event_file_snapshot_versions (
      account_key TEXT NOT NULL,
      snapshot_id TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, snapshot_id, chunk_index)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_event_file_snapshot_versions_active ON account_event_file_snapshot_versions(account_key, active, updated_at)`,
    `CREATE TABLE IF NOT EXISTS account_event_file_snapshot_meta (
      account_key TEXT PRIMARY KEY,
      snapshot_id TEXT NOT NULL DEFAULT '',
      chunk_count INTEGER NOT NULL DEFAULT 0,
      expected_chunk_count INTEGER NOT NULL DEFAULT 0,
      stats_json TEXT NOT NULL DEFAULT '{}',
      fingerprint_json TEXT NOT NULL DEFAULT '{}',
      event_count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      versioned INTEGER NOT NULL DEFAULT 0,
      incomplete INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS account_event_file_upload_chunks (
      account_key TEXT NOT NULL,
      sync_id TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, sync_id, chunk_index)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_event_file_upload_chunks_account ON account_event_file_upload_chunks(account_key, created_at)`,
    `CREATE TABLE IF NOT EXISTS account_event_file_append_events (
      account_key TEXT NOT NULL,
      event_id TEXT NOT NULL,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, event_id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_event_file_append_events_account ON account_event_file_append_events(account_key, created_at)`,
    `CREATE TABLE IF NOT EXISTS account_concept_scores (
      account_key TEXT NOT NULL,
      path TEXT NOT NULL,
      title TEXT,
      score_type TEXT NOT NULL,
      score REAL NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, path, score_type)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_concept_scores_path ON account_concept_scores(path, score_type)`,
    `CREATE INDEX IF NOT EXISTS idx_account_concept_scores_account ON account_concept_scores(account_key, updated_at)`,
    `CREATE TABLE IF NOT EXISTS account_notification_state (
      account_key TEXT PRIMARY KEY,
      seen_at INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS account_custom_notifications (
      id TEXT PRIMARY KEY,
      account_key TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT,
      message TEXT,
      source TEXT,
      source_id TEXT,
      created_at INTEGER NOT NULL,
      data_json TEXT
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_custom_notifications_account ON account_custom_notifications(account_key, created_at)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_account_custom_notifications_unique ON account_custom_notifications(account_key, type, source, source_id)`,
    `CREATE TABLE IF NOT EXISTS admin_report_decisions (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      fingerprint TEXT NOT NULL,
      report_id TEXT,
      decision TEXT NOT NULL,
      reporter_account_key TEXT,
      rewarded_account_key TEXT,
      created_at INTEGER NOT NULL,
      created_by TEXT,
      data_json TEXT
    )`,
    `CREATE INDEX IF NOT EXISTS idx_admin_report_decisions_kind_fingerprint ON admin_report_decisions(kind, fingerprint, decision, created_at)`,
    `CREATE TABLE IF NOT EXISTS page_edit_submissions (
      id TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      title TEXT,
      source_path TEXT,
      source_url TEXT,
      submitter_hash TEXT NOT NULL,
      submitter_account_key TEXT,
      submitter_name TEXT,
      original_md TEXT,
      proposed_md TEXT NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      reviewed_at INTEGER NOT NULL DEFAULT 0,
      reviewed_by TEXT
    )`,
    `CREATE INDEX IF NOT EXISTS idx_page_edit_submissions_path ON page_edit_submissions(path, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_page_edit_submissions_status ON page_edit_submissions(status, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_page_edit_submissions_submitter ON page_edit_submissions(submitter_account_key, created_at)`,
    `CREATE TABLE IF NOT EXISTS xp_cap_boost_vouchers (
      id TEXT PRIMARY KEY,
      account_key TEXT NOT NULL,
      source TEXT NOT NULL,
      source_id TEXT NOT NULL,
      reason TEXT,
      multiplier REAL NOT NULL DEFAULT 2,
      day TEXT,
      created_at INTEGER NOT NULL,
      activated_at INTEGER NOT NULL DEFAULT 0,
      expires_at INTEGER NOT NULL DEFAULT 0,
      created_by TEXT
    )`,
    `CREATE INDEX IF NOT EXISTS idx_xp_cap_boost_vouchers_account ON xp_cap_boost_vouchers(account_key, created_at)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_cap_boost_vouchers_source ON xp_cap_boost_vouchers(account_key, source, source_id)`,
    `CREATE TABLE IF NOT EXISTS study_connections (
      requester_key TEXT NOT NULL,
      target_key TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY(requester_key, target_key)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_study_connections_target ON study_connections(target_key, status, updated_at)`,
    `CREATE INDEX IF NOT EXISTS idx_study_connections_requester ON study_connections(requester_key, status, updated_at)`,
    `CREATE TABLE IF NOT EXISTS comment_mentions (
      comment_id TEXT NOT NULL,
      path TEXT NOT NULL,
      mentioned_key TEXT NOT NULL,
      actor_key TEXT,
      actor_hash TEXT,
      created_at INTEGER NOT NULL,
      PRIMARY KEY(comment_id, mentioned_key)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_comment_mentions_target ON comment_mentions(mentioned_key, created_at)`,
    `CREATE TABLE IF NOT EXISTS identity_sync_codes (
      code_hash TEXT PRIMARY KEY,
      name_key TEXT NOT NULL,
      source_visitor_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      used_at INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE INDEX IF NOT EXISTS idx_identity_sync_codes_name ON identity_sync_codes(name_key, expires_at)`,
    `CREATE TABLE IF NOT EXISTS identity_recovery_codes (
      name_key TEXT PRIMARY KEY,
      code_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS page_actions (
      account_key TEXT NOT NULL,
      path TEXT NOT NULL,
      action TEXT NOT NULL,
      title TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY(account_key, path, action)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_page_actions_account ON page_actions(account_key, action, updated_at)`,
    `CREATE INDEX IF NOT EXISTS idx_page_actions_path ON page_actions(path, action)`,
    `CREATE TABLE IF NOT EXISTS account_page_visits (
      account_key TEXT NOT NULL,
      path TEXT NOT NULL,
      title TEXT,
      visit_count INTEGER NOT NULL DEFAULT 0,
      first_visited INTEGER NOT NULL,
      last_visited INTEGER NOT NULL,
      PRIMARY KEY(account_key, path)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_page_visits_account ON account_page_visits(account_key, last_visited)`,
    `CREATE TABLE IF NOT EXISTS user_activity_daily (
      day TEXT NOT NULL,
      account_key TEXT NOT NULL,
      metric TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      score REAL NOT NULL DEFAULT 0,
      PRIMARY KEY(day, account_key, metric)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_user_activity_daily_metric ON user_activity_daily(day, metric)`,
    `CREATE TABLE IF NOT EXISTS user_activity_totals (
      account_key TEXT NOT NULL,
      metric TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      score REAL NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, metric)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_user_activity_totals_account ON user_activity_totals(account_key)`,
    `CREATE TABLE IF NOT EXISTS user_activity_events (
      id TEXT PRIMARY KEY,
      account_key TEXT NOT NULL,
      metric TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      score REAL NOT NULL DEFAULT 0,
      path TEXT,
      title TEXT,
      details_json TEXT,
      created_at INTEGER NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_user_activity_events_account ON user_activity_events(account_key, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_user_activity_events_metric ON user_activity_events(metric, created_at)`,
    `CREATE TABLE IF NOT EXISTS user_ranking_projection (
      account_key TEXT PRIMARY KEY,
      total_score REAL NOT NULL DEFAULT 0,
      daily_json TEXT NOT NULL DEFAULT '{}',
      equipped_json TEXT NOT NULL DEFAULT '{}',
      source TEXT,
      updated_at INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE INDEX IF NOT EXISTS idx_user_ranking_projection_total ON user_ranking_projection(total_score)`,
    // The leaderboard "Total XP" must equal the number the user's own client shows
    // in their account panel. The server's recomputation (user_ranking_projection)
    // drifts from the client's events-only xpFromFile by a small amount (subtle
    // daily-cap/boost ordering), and several recompute paths overwrite total_score,
    // so it could never be pinned. This table holds the client-reported total,
    // written ONLY on sync and PREFERRED on read, so every viewer sees one number
    // per user that matches that user's panel.
    `CREATE TABLE IF NOT EXISTS account_client_ranking_total (
      account_key TEXT PRIMARY KEY,
      total_score REAL NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS shop_item_demand (
      item_id TEXT PRIMARY KEY,
      demand REAL NOT NULL DEFAULT 0,
      updated_day TEXT NOT NULL DEFAULT ''
    )`,
    `CREATE TABLE IF NOT EXISTS shop_account_item_counts (
      account_key TEXT NOT NULL,
      item_id TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (account_key, item_id)
    )`,
    `CREATE TABLE IF NOT EXISTS user_activity_action_state (
      account_key TEXT NOT NULL,
      metric TEXT NOT NULL,
      state_key TEXT NOT NULL,
      first_seen_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      last_day TEXT,
      details_json TEXT,
      PRIMARY KEY(account_key, metric, state_key)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_user_activity_action_state_account ON user_activity_action_state(account_key, last_seen_at)`,
    `CREATE TABLE IF NOT EXISTS user_activity_action_state_daily (
      day TEXT NOT NULL,
      account_key TEXT NOT NULL,
      metric TEXT NOT NULL,
      state_key TEXT NOT NULL,
      first_seen_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      details_json TEXT,
      PRIMARY KEY(day, account_key, metric, state_key)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_user_activity_action_state_daily_metric ON user_activity_action_state_daily(day, metric)`,
    `CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      parent_id TEXT,
      name TEXT NOT NULL,
      text TEXT NOT NULL,
      ts INTEGER NOT NULL,
      deleted_at INTEGER NOT NULL DEFAULT 0,
      deleted_by TEXT,
      visitor_hash TEXT,
      account_key TEXT,
      edited_at INTEGER NOT NULL DEFAULT 0,
      is_anonymous INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE INDEX IF NOT EXISTS idx_comments_path_ts ON comments(path, ts)`,
    `CREATE TABLE IF NOT EXISTS comment_reactions (
      comment_id TEXT NOT NULL,
      visitor_hash TEXT NOT NULL,
      reaction TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY(comment_id, visitor_hash, reaction)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment ON comment_reactions(comment_id)`,
    `CREATE TABLE IF NOT EXISTS comment_reports (
      id TEXT PRIMARY KEY,
      comment_id TEXT NOT NULL,
      path TEXT NOT NULL,
      reporter_hash TEXT NOT NULL,
      reason TEXT,
      snapshot_name TEXT,
      snapshot_text TEXT,
      snapshot_ts INTEGER,
      created_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      status_updated_at INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE INDEX IF NOT EXISTS idx_comment_reports_comment ON comment_reports(comment_id, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_comment_reports_status ON comment_reports(status, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_comment_reports_path ON comment_reports(path, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_engagement_daily_metric_day ON engagement_daily(metric, day)`,
    `CREATE INDEX IF NOT EXISTS idx_engagement_totals_metric ON engagement_totals(metric)`,
  ];

  schemaPromise = (async () => {
    for (const sql of statements) await db.prepare(sql).run();

    // Existing installations may already have a comments table without these
    // moderation columns. D1/SQLite raises a duplicate-column error if they
    // already exist, so these migrations are intentionally best-effort.
    const optionalMigrations = [
      `ALTER TABLE comments ADD COLUMN deleted_at INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE comments ADD COLUMN deleted_by TEXT`,
      `ALTER TABLE comments ADD COLUMN visitor_hash TEXT`,
      `ALTER TABLE comments ADD COLUMN account_key TEXT`,
      `ALTER TABLE comments ADD COLUMN edited_at INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE comments ADD COLUMN is_anonymous INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE favorites ADD COLUMN account_key TEXT`,
      `ALTER TABLE comment_identities ADD COLUMN is_public INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE comment_identities ADD COLUMN bio TEXT`,
      `ALTER TABLE comment_identities ADD COLUMN name_changed_at INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE comment_identities ADD COLUMN avatar_changed_at INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE account_device_links ADD COLUMN device_name TEXT`,
      `ALTER TABLE account_device_links ADD COLUMN last_seen INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE account_device_links ADD COLUMN revoked_at INTEGER NOT NULL DEFAULT 0`,
      `CREATE TABLE IF NOT EXISTS account_privacy_settings (
        account_key TEXT PRIMARY KEY,
        profile_public INTEGER NOT NULL DEFAULT 0,
        visits_public INTEGER NOT NULL DEFAULT 0,
        actions_public INTEGER NOT NULL DEFAULT 0,
        comments_public INTEGER NOT NULL DEFAULT 0,
        readiness_public INTEGER NOT NULL DEFAULT 0,
        ranking_public INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS account_ai_quiz_sessions (
        account_key TEXT NOT NULL,
        path TEXT NOT NULL,
        result_id TEXT NOT NULL,
        title TEXT,
        session_json TEXT,
        completed_at INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(account_key, path, result_id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_account_ai_quiz_sessions_account ON account_ai_quiz_sessions(account_key, completed_at)`,
      `CREATE TABLE IF NOT EXISTS account_mastery_json_snapshot_chunks (
        account_key TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        chunk_count INTEGER NOT NULL DEFAULT 1,
        data_json TEXT NOT NULL,
        updated_at INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(account_key, chunk_index)
      )`,
      `CREATE TABLE IF NOT EXISTS account_mastery_json_upload_chunks (
        account_key TEXT NOT NULL,
        sync_id TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        chunk_count INTEGER NOT NULL DEFAULT 1,
        data_json TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(account_key, sync_id, chunk_index)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_account_mastery_json_upload_chunks_account ON account_mastery_json_upload_chunks(account_key, created_at)`,
      `CREATE TABLE IF NOT EXISTS account_json_snapshot_chunks (
        account_key TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        chunk_count INTEGER NOT NULL DEFAULT 1,
        data_json TEXT NOT NULL,
        updated_at INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(account_key, chunk_index)
      )`,
      `CREATE TABLE IF NOT EXISTS account_json_upload_chunks (
        account_key TEXT NOT NULL,
        sync_id TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        chunk_count INTEGER NOT NULL DEFAULT 1,
        data_json TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(account_key, sync_id, chunk_index)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_account_json_upload_chunks_account ON account_json_upload_chunks(account_key, created_at)`,
    `CREATE TABLE IF NOT EXISTS account_event_file_snapshot_chunks (
      account_key TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, chunk_index)
    )`,
    `CREATE TABLE IF NOT EXISTS account_event_file_snapshot_versions (
      account_key TEXT NOT NULL,
      snapshot_id TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, snapshot_id, chunk_index)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_event_file_snapshot_versions_active ON account_event_file_snapshot_versions(account_key, active, updated_at)`,
    `CREATE TABLE IF NOT EXISTS account_event_file_snapshot_meta (
      account_key TEXT PRIMARY KEY,
      snapshot_id TEXT NOT NULL DEFAULT '',
      chunk_count INTEGER NOT NULL DEFAULT 0,
      expected_chunk_count INTEGER NOT NULL DEFAULT 0,
      stats_json TEXT NOT NULL DEFAULT '{}',
      fingerprint_json TEXT NOT NULL DEFAULT '{}',
      event_count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      versioned INTEGER NOT NULL DEFAULT 0,
      incomplete INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS account_event_file_upload_chunks (
      account_key TEXT NOT NULL,
      sync_id TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 1,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, sync_id, chunk_index)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_event_file_upload_chunks_account ON account_event_file_upload_chunks(account_key, created_at)`,
    `CREATE TABLE IF NOT EXISTS account_event_file_append_events (
      account_key TEXT NOT NULL,
      event_id TEXT NOT NULL,
      data_json TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(account_key, event_id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_account_event_file_append_events_account ON account_event_file_append_events(account_key, created_at)`,
      `CREATE TABLE IF NOT EXISTS account_profile_rewards (
        account_key TEXT PRIMARY KEY,
        selected_frame TEXT NOT NULL DEFAULT 'level-1',
        highest_level_seen INTEGER NOT NULL DEFAULT 1,
        last_level_up_at INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS account_readiness (
        account_key TEXT NOT NULL,
        path TEXT NOT NULL,
        title TEXT,
        readiness REAL NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(account_key, path)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_account_readiness_path ON account_readiness(path)`,
      `CREATE INDEX IF NOT EXISTS idx_account_readiness_account ON account_readiness(account_key, updated_at)`,
      `CREATE TABLE IF NOT EXISTS account_concept_scores (
        account_key TEXT NOT NULL,
        path TEXT NOT NULL,
        title TEXT,
        score_type TEXT NOT NULL,
        score REAL NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(account_key, path, score_type)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_account_concept_scores_path ON account_concept_scores(path, score_type)`,
      `CREATE INDEX IF NOT EXISTS idx_account_concept_scores_account ON account_concept_scores(account_key, updated_at)`,

      `ALTER TABLE account_privacy_settings ADD COLUMN profile_visibility TEXT NOT NULL DEFAULT 'private'`,
      `ALTER TABLE account_privacy_settings ADD COLUMN visits_visibility TEXT NOT NULL DEFAULT 'private'`,
      `ALTER TABLE account_privacy_settings ADD COLUMN actions_visibility TEXT NOT NULL DEFAULT 'private'`,
      `ALTER TABLE account_privacy_settings ADD COLUMN comments_visibility TEXT NOT NULL DEFAULT 'private'`,
      `ALTER TABLE account_privacy_settings ADD COLUMN readiness_visibility TEXT NOT NULL DEFAULT 'private'`,
      `ALTER TABLE account_privacy_settings ADD COLUMN ranking_visibility TEXT NOT NULL DEFAULT 'private'`,
      `CREATE TABLE IF NOT EXISTS study_connections (
        requester_key TEXT NOT NULL,
        target_key TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY(requester_key, target_key)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_study_connections_target ON study_connections(target_key, status, updated_at)`,
      `CREATE INDEX IF NOT EXISTS idx_study_connections_requester ON study_connections(requester_key, status, updated_at)`,
      `CREATE TABLE IF NOT EXISTS comment_mentions (
        comment_id TEXT NOT NULL,
        path TEXT NOT NULL,
        mentioned_key TEXT NOT NULL,
        actor_key TEXT,
        actor_hash TEXT,
        created_at INTEGER NOT NULL,
        PRIMARY KEY(comment_id, mentioned_key)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_comment_mentions_target ON comment_mentions(mentioned_key, created_at)`,
      `CREATE INDEX IF NOT EXISTS idx_comments_visitor ON comments(visitor_hash)`,
      `CREATE TABLE IF NOT EXISTS comment_identities (
        visitor_hash TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_key TEXT NOT NULL UNIQUE,
        avatar TEXT,
        is_public INTEGER NOT NULL DEFAULT 0,
        bio TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        name_changed_at INTEGER NOT NULL DEFAULT 0,
        avatar_changed_at INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE INDEX IF NOT EXISTS idx_comment_identities_name ON comment_identities(name_key)`,
      `ALTER TABLE comment_reports ADD COLUMN status TEXT NOT NULL DEFAULT 'open'`,
      `ALTER TABLE comment_reports ADD COLUMN status_updated_at INTEGER NOT NULL DEFAULT 0`,
      `CREATE INDEX IF NOT EXISTS idx_comment_reports_comment ON comment_reports(comment_id, created_at)`,
      `CREATE INDEX IF NOT EXISTS idx_comment_reports_status ON comment_reports(status, created_at)`,
      `CREATE INDEX IF NOT EXISTS idx_comment_reports_path ON comment_reports(path, created_at)`,
      `CREATE TABLE IF NOT EXISTS xp_cap_boost_vouchers (
        id TEXT PRIMARY KEY,
        account_key TEXT NOT NULL,
        source TEXT NOT NULL,
        source_id TEXT NOT NULL,
        reason TEXT,
        multiplier REAL NOT NULL DEFAULT 2,
        day TEXT,
        created_at INTEGER NOT NULL,
        activated_at INTEGER NOT NULL DEFAULT 0,
        expires_at INTEGER NOT NULL DEFAULT 0,
        created_by TEXT
      )`,
      `CREATE INDEX IF NOT EXISTS idx_xp_cap_boost_vouchers_account ON xp_cap_boost_vouchers(account_key, created_at)`,
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_cap_boost_vouchers_source ON xp_cap_boost_vouchers(account_key, source, source_id)`,
      `CREATE TABLE IF NOT EXISTS user_activity_events (
        id TEXT PRIMARY KEY,
        account_key TEXT NOT NULL,
        metric TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 1,
        score REAL NOT NULL DEFAULT 0,
        path TEXT,
        title TEXT,
        details_json TEXT,
        created_at INTEGER NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_user_activity_events_account ON user_activity_events(account_key, created_at)`,
      `CREATE INDEX IF NOT EXISTS idx_user_activity_events_metric ON user_activity_events(metric, created_at)`,
    ];
    for (const sql of optionalMigrations) {
      try { await db.prepare(sql).run(); } catch (_) {}
    }

    schemaReady = true;
  })();
  return schemaPromise;
}

function normaliseCorsOrigin(value) {
  try {
    const u = new URL(String(value || "").trim());
    const host = String(u.hostname || "").replace(/\.+$/g, "").toLowerCase();
    const port = u.port ? `:${u.port}` : "";
    return `${u.protocol}//${host}${port}`;
  } catch (_) {
    return String(value || "").trim().replace(/\.+$/g, "").toLowerCase();
  }
}

function configuredOrigin(req, env) {
  const origin = req.headers.get("Origin") || "";
  const configured = String(env.ALLOWED_ORIGINS || "").trim();
  if (!configured) return "*";
  const allowed = configured.split(",").map(s => s.trim()).filter(Boolean);
  if (allowed.includes("*")) return "*";
  if (origin && allowed.includes(origin)) return origin;
  const originNorm = normaliseCorsOrigin(origin);
  if (originNorm) {
    const matched = allowed.find((x) => normaliseCorsOrigin(x) === originNorm);
    if (matched) return origin;
  }
  return allowed[0] || "*";
}

function corsHeaders(req, env) {
  return {
    "Access-Control-Allow-Origin": configuredOrigin(req, env),
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key, Authorization, Accept, Cache-Control, Pragma",
    "Access-Control-Max-Age": "86400",
  };
}

function json(obj, status = 200, req, env) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Cache-Control": "no-store",
      ...corsHeaders(req, env),
    },
  });
}


function adminSecret(env) {
  return String(
    env.COMMENTS_ADMIN_KEY ||
    env.HOT_ADMIN_KEY ||
    env.AIQ_ADMIN_KEY ||
    env.REPORT_ADMIN_KEY ||
    env.ADMIN_KEY ||
    ""
  ).trim();
}

function adminKeyFromRequest(req, body) {
  const h = req.headers.get("X-Admin-Key") || req.headers.get("Authorization") || "";
  const headerKey = h.replace(/^Bearer\s+/i, "").trim();
  return String((body && (body.adminKey || body.key || body.token)) || headerKey || "").trim();
}

function isValidAdminKey(req, env, body) {
  const secret = adminSecret(env);
  const key = adminKeyFromRequest(req, body);
  if (!secret || !key) return false;
  return key === secret;
}

function adminUnauthorized(req, env) {
  return json({ ok: false, error: "Unauthorized admin action" }, 401, req, env);
}

const DEMO_CELEBRITY_ACCOUNT_TOKENS = new Set([
  "euler", "leonhardeuler", "leonhard_euler", "leonhard-euler",
  "rolle", "michelrolle", "michel_rolle", "michel-rolle",
  "newton", "isaacnewton", "isaac_newton", "isaac-newton",
  "gauss", "carlgauss", "carlfriedrichgauss", "carl_friedrich_gauss",
  "riemann", "bernhardriemann", "bernhard_riemann",
  "cauchy", "augustincauchy", "augustin_cauchy",
  "weierstrass", "karlweierstrass", "karl_weierstrass",
  "lagrange", "fourier", "laplace", "leibniz", "bernoulli", "cantor",
  "hilbert", "noether", "emmy_noether", "emmy-noether", "emmynoether",
  "fermat", "taylor", "maclaurin", "jacobi", "abel", "galois",
  "poincare", "kolmogorov", "markov", "chebyshev",
  "hardy", "ramanujan", "descartes", "archimedes", "euclid", "pythagoras",
  "pascal", "bayes", "poisson", "stokes", "green", "frobenius", "jordan",
  "banach", "bessel", "legendre", "dirichlet", "mobius", "moebius"
]);

function demoAccountToken(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function isDemoCelebrityAccountName(name, accountKey) {
  const a = demoAccountToken(name);
  const b = demoAccountToken(accountKey);
  if (a && DEMO_CELEBRITY_ACCOUNT_TOKENS.has(a)) return true;
  if (b && DEMO_CELEBRITY_ACCOUNT_TOKENS.has(b)) return true;
  return false;
}

function sqlPlaceholders(list) {
  return (Array.isArray(list) ? list : []).map(() => "?").join(",");
}

async function findDemoCelebrityAccounts(db) {
  const rows = await db.prepare(`SELECT visitor_hash, name_key, name FROM comment_identities`).all().catch(() => ({ results: [] }));
  const out = [];
  const seen = new Set();
  for (const row of (rows.results || [])) {
    const key = String(row && row.name_key || "").trim();
    const name = String(row && row.name || "").trim();
    const hash = String(row && row.visitor_hash || "").trim();
    if (!key || !isDemoCelebrityAccountName(name, key)) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ accountKey: key, name, visitorHash: hash });
  }
  return out;
}

async function deleteWhereIn(db, table, column, values) {
  const vals = (Array.isArray(values) ? values : []).map((x) => String(x || "").trim()).filter(Boolean);
  if (!vals.length) return 0;
  const res = await db.prepare(`DELETE FROM ${table} WHERE ${column} IN (${sqlPlaceholders(vals)})`).bind(...vals).run().catch(() => null);
  return res && res.meta ? Number(res.meta.changes || 0) : 0;
}

async function handleAdminPurgeDemoAccounts(req, env) {
  const body = await readJson(req, 8192);
  if (!isValidAdminKey(req, env, body)) return adminUnauthorized(req, env);
  const accounts = await findDemoCelebrityAccounts(env.DB);
  const accountKeys = accounts.map((x) => x.accountKey).filter(Boolean);
  const visitorHashes = accounts.map((x) => x.visitorHash).filter(Boolean);
  if (body && (body.dryRun === true || body.preview === true || body.confirm === false)) {
    return json({ ok: true, dryRun: true, matched: accounts.length, accounts }, 200, req, env);
  }
  if (!accountKeys.length && !visitorHashes.length) return json({ ok: true, matched: 0, deleted: {}, accounts: [] }, 200, req, env);
  const deleted = {};
  const byAccount = [
    ["account_device_links", "name_key"],
    ["account_privacy_settings", "account_key"],
    ["account_profile_rewards", "account_key"],
    ["account_readiness", "account_key"],
    ["account_mastery", "account_key"],
    ["account_ai_quiz_sessions", "account_key"],
    ["account_mastery_json_snapshot_chunks", "account_key"],
    ["account_mastery_json_upload_chunks", "account_key"],
    ["account_json_snapshot_chunks", "account_key"],
    ["account_json_upload_chunks", "account_key"],
    ["account_event_file_snapshot_chunks", "account_key"],
    ["account_event_file_snapshot_versions", "account_key"],
    ["account_event_file_snapshot_meta", "account_key"],
    ["account_event_file_upload_chunks", "account_key"],
    ["account_concept_scores", "account_key"],
    ["account_notification_state", "account_key"],
    ["account_custom_notifications", "account_key"],
    ["xp_cap_boost_vouchers", "account_key"],
    ["page_actions", "account_key"],
    ["account_page_visits", "account_key"],
    ["user_activity_daily", "account_key"],
    ["user_activity_totals", "account_key"],
    ["user_activity_events", "account_key"],
    ["user_activity_action_state", "account_key"],
    ["user_activity_action_state_daily", "account_key"],
    ["favorites", "account_key"],
    ["identity_sync_codes", "name_key"],
    ["identity_recovery_codes", "name_key"]
  ];
  for (const [table, column] of byAccount) deleted[`${table}.${column}`] = await deleteWhereIn(env.DB, table, column, accountKeys);
  deleted["comments.account_key"] = await deleteWhereIn(env.DB, "comments", "account_key", accountKeys);
  deleted["comments.visitor_hash"] = await deleteWhereIn(env.DB, "comments", "visitor_hash", visitorHashes);
  deleted["comment_reactions.visitor_hash"] = await deleteWhereIn(env.DB, "comment_reactions", "visitor_hash", visitorHashes);
  deleted["comment_reports.reporter_hash"] = await deleteWhereIn(env.DB, "comment_reports", "reporter_hash", visitorHashes);
  deleted["favorites.visitor_hash"] = await deleteWhereIn(env.DB, "favorites", "visitor_hash", visitorHashes);
  deleted["identity_sync_codes.source_visitor_hash"] = await deleteWhereIn(env.DB, "identity_sync_codes", "source_visitor_hash", visitorHashes);
  deleted["comment_mentions.actor_hash"] = await deleteWhereIn(env.DB, "comment_mentions", "actor_hash", visitorHashes);
  deleted["comment_identities.name_key"] = await deleteWhereIn(env.DB, "comment_identities", "name_key", accountKeys);
  deleted["comment_identities.visitor_hash"] = await deleteWhereIn(env.DB, "comment_identities", "visitor_hash", visitorHashes);
  deleted["comment_mentions.mentioned_key"] = await deleteWhereIn(env.DB, "comment_mentions", "mentioned_key", accountKeys);
  deleted["comment_mentions.actor_key"] = await deleteWhereIn(env.DB, "comment_mentions", "actor_key", accountKeys);
  deleted["study_connections.requester_key"] = await deleteWhereIn(env.DB, "study_connections", "requester_key", accountKeys);
  deleted["study_connections.target_key"] = await deleteWhereIn(env.DB, "study_connections", "target_key", accountKeys);
  deleted["admin_report_decisions.reporter_account_key"] = await deleteWhereIn(env.DB, "admin_report_decisions", "reporter_account_key", accountKeys);
  deleted["admin_report_decisions.rewarded_account_key"] = await deleteWhereIn(env.DB, "admin_report_decisions", "rewarded_account_key", accountKeys);
  return json({ ok: true, matched: accounts.length, accounts, deleted }, 200, req, env);
}

async function readJson(req, maxBytes = 8192) {
  const text = await req.text();
  if (text.length > maxBytes) throw new Error("Request body is too large.");
  if (!text.trim()) return {};
  return JSON.parse(text);
}

function clampInt(v, min, max, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function normalizePath(p) {
  let s = String(p || "").trim();
  try {
    if (/^https?:\/\//i.test(s)) s = new URL(s).pathname;
  } catch (_) {}
  s = s.split("#")[0].split("?")[0].replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/g, "");
  if (s.length > 420) s = s.slice(0, 420);
  return s;
}

function looksLikePathTitle(t) {
  const s = String(t || "").trim();
  if (!s) return false;
  if (/^https?:\/\//i.test(s)) return true;
  if (/\.html(?:[#?].*)?$/i.test(s) && (s.includes("/") || s.includes("\\"))) return true;
  if (/^[A-Za-z0-9._~%-]+(?:\/[A-Za-z0-9._~%-]+)+\.html$/i.test(s)) return true;
  return false;
}

function titleFromPath(fallbackPath = "") {
  const base = String(fallbackPath || "").split("#")[0].split("?")[0].split("/").pop() || "";
  return base.replace(/\.html$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()).trim() || String(fallbackPath || "");
}

function cleanTitle(title, fallbackPath = "") {
  let t = String(title || "").replace(/¶/g, "").replace(/\s+/g, " ").trim();
  t = t.replace(/\s+-\s+BSc EOR Wiki\s*$/i, "").replace(/\s*¶+\s*$/g, "").trim();
  if (looksLikePathTitle(t)) t = "";
  if (!t && fallbackPath) t = titleFromPath(fallbackPath);
  if (t.length > 180) t = t.slice(0, 180);
  return t;
}

function isConceptPath(rawPath) {
  const path = normalizePath(rawPath);
  if (!path) return false;
  const low = path.toLowerCase();
  if (low.includes("://")) return false;
  if (!low.endsWith(".html")) return false;
  if (low === "index.html" || low.endsWith("/index.html")) return false;
  if (EXCLUDE_EXACT.has(low)) return false;
  if (low.startsWith("about/") || low.startsWith("how-it-works/") || low.startsWith("contributors/")) return false;
  for (const s of EXCLUDE_SUBSTR) if (low.includes(s)) return false;
  if (low.includes("random") || low.includes("trending") || low.includes("search") || low.includes("find")) return false;
  return true;
}

function normaliseImportedConceptPath(rawPath) {
  let p = normalizePath(rawPath || "");
  if (!p) return "";
  if (/\.md$/i.test(p)) p = p.replace(/\.md$/i, ".html");
  // Older local-only records sometimes stored a MkDocs source id without the
  // generated .html suffix.  The canonical XP tables require .html paths, so
  // repair these before the concept-path gate.
  if (!/\.html$/i.test(p) && p.includes("/")) p += ".html";
  return normalizePath(p);
}

function dayUTCFromTimestamp(ts) {
  const n = Number(ts || 0);
  const d = new Date(Number.isFinite(n) && n > 0 ? n : Date.now());
  return d.toISOString().slice(0, 10);
}

function todayUTC() {
  return dayUTCFromTimestamp(Date.now());
}

function periodFromUrl(url) {
  const raw = String(url.searchParams.get("period") || "7d").toLowerCase();
  if (raw === "24h") return "today";
  if (["today", "7d", "30d", "all"].includes(raw)) return raw;
  return "7d";
}

function periodStart(period) {
  const today = todayUTC();
  if (period === "today") return today;
  const days = period === "30d" ? 29 : 6;
  return new Date(Date.now() - days * 86400 * 1000).toISOString().slice(0, 10);
}

async function sha(input) {
  const data = new TextEncoder().encode(String(input || ""));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

function normalizeVisitorId(input) {
  const s = String(input || "").trim();
  return /^[a-zA-Z0-9_-]{6,100}$/.test(s) ? s : "anon";
}

async function visitorHash(input) {
  return sha(normalizeVisitorId(input));
}

function canonicalMetric(metric) {
  const m = String(metric || "").trim().toLowerCase();
  if (m === "likes" || m === "popular" || m === "popularity") return "popular";
  if (m === "lively" || m === "liveliness" || m === "lively_score" || m === "buzz" || m === "buzzing" || m === "busy") return "lively";
  if (m === "saved" || m === "saves" || m === "saved_pages" || m === "most_saved") return "saved_pages";
  if (m === "users" || m === "user" || m === "active_users" || m === "activity") return "users";
  if (m === "comments") return "comment";
  if (m === "view") return "views";
  if (m === "favourite" || m === "favourites" || m === "favorite" || m === "favorites" || m === "favorite_page" || m === "fav" || m === "study" || m === "study_later" || m === "review" || m === "review_later") return "saved_page_action";
  if (m === "saved_page" || m === "saved_page_action" || m === "save_page" || m === "page_saved") return "saved_page_action";
  if (m === "saved_page_visit" || m === "revisit_saved_page" || m === "visit_saved_page") return "saved_page_visit";
  if (m === "ai" || m === "aiquiz" || m === "ai_quiz_attempt") return "ai_quiz";
  if (m === "mastery_submit") return "mastery";
  if (m === "map" || m === "map_open") return "map_open";
  if (m === "concept_finder" || m === "concept_finder_open" || m === "finder") return "concept_finder_open";
  if (m === "random_browse" || m === "random_browse_start" || m === "start_random") return "random_browse_start";
  if (m === "guided_study" || m === "guided_study_start" || m === "start_guided_study" || m === "random_route_start" || m === "start_random_route") return "guided_study_start";
  if (m === "course_diagnostics" || m === "course_diagnostics_open" || m === "diagnostics_open" || m === "view_course_diagnostics") return "course_diagnostics_open";
  if (m === "prerequisite_readiness" || m === "prerequisite_readiness_open" || m === "readiness_open" || m === "view_prerequisite_readiness") return "prerequisite_readiness_open";
  if (m === "search_suggestion" || m === "suggestion" || m === "suggestion_use") return "search_suggestion";
  if (m === "sort" || m === "filter" || m === "sort_filter" || m === "sorting" || m === "filtering" || m === "sort_use") return "sort_use";
  if (["views", "popular", "lively", "saved_pages", "users", "saved_page_action", "saved_page_visit", "comment", "reaction", "mastery", "ai_quiz", "map_open", "concept_finder_open", "random_browse_start", "guided_study_start", "course_diagnostics_open", "prerequisite_readiness_open", "course_search", "search_suggestion", "sort_use"].includes(m)) return m;
  return "";
}

function exactArray() {
  return Array.from(EXCLUDE_EXACT).map(x => x.toLowerCase());
}

function placeholders(n) {
  return new Array(n).fill("?").join(", ");
}

function conceptSql(alias) {
  const p = `${alias}.path`;
  const exactPH = placeholders(EXCLUDE_EXACT.size);
  return `
    LOWER(${p}) LIKE '%.html'
    AND LOWER(${p}) NOT LIKE '%/index.html'
    AND LOWER(${p}) NOT IN (${exactPH})
    AND LOWER(${p}) NOT LIKE 'about/%'
    AND LOWER(${p}) NOT LIKE 'how-it-works/%'
    AND LOWER(${p}) NOT LIKE 'contributors/%'
    AND LOWER(${p}) NOT LIKE '%random%'
    AND LOWER(${p}) NOT LIKE '%trending%'
    AND LOWER(${p}) NOT LIKE '%search%'
    AND LOWER(${p}) NOT LIKE '%find%'
  `;
}

async function touchPage(db, path, title, now) {
  await db.prepare(`
    INSERT INTO pages (path, title, total_views, updated_at)
    VALUES (?, ?, 0, ?)
    ON CONFLICT(path) DO UPDATE SET
      title = CASE
        WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title
        ELSE pages.title
      END,
      updated_at = excluded.updated_at
  `).bind(path, title, now).run();
}

async function bumpEngagement(db, metric, path, title, delta = 1) {
  metric = canonicalMetric(metric);
  if (!metric || metric === "popular" || metric === "views" || !path) return;
  if (!isConceptPath(path)) return;
  const now = Date.now();
  const day = todayUTC();
  await touchPage(db, path, title, now);
  await db.prepare(`
    INSERT INTO engagement_totals (path, metric, count, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(path, metric) DO UPDATE SET
      count = engagement_totals.count + excluded.count,
      updated_at = excluded.updated_at
  `).bind(path, metric, Number(delta || 0), now).run();
  await db.prepare(`
    UPDATE engagement_totals
    SET count = MAX(0, count)
    WHERE path = ? AND metric = ?
  `).bind(path, metric).run();

  await db.prepare(`
    INSERT INTO engagement_daily (day, path, metric, count)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(day, path, metric) DO UPDATE SET
      count = engagement_daily.count + excluded.count
  `).bind(day, path, metric, Number(delta || 0)).run();
  await db.prepare(`
    UPDATE engagement_daily
    SET count = MAX(0, count)
    WHERE day = ? AND path = ? AND metric = ?
  `).bind(day, path, metric).run();
}



function cleanDeviceName(s) {
  let name = String(s || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (name.length > 80) name = name.slice(0, 80).trim();
  return name || "This device";
}

function inferDeviceName(req) {
  try {
    const ua = String((req && req.headers && req.headers.get("user-agent")) || "").toLowerCase();
    if (ua.includes("iphone")) return "iPhone";
    if (ua.includes("ipad")) return "iPad";
    if (ua.includes("android") && ua.includes("mobile")) return "Android phone";
    if (ua.includes("android")) return "Android tablet";
    if (ua.includes("windows")) return "Windows device";
    if (ua.includes("macintosh") || ua.includes("mac os")) return "Mac";
    if (ua.includes("linux")) return "Linux device";
  } catch (_) {}
  return "This device";
}

async function touchDeviceLink(db, visitorHashValue, accountKey, req, deviceName) {
  const vh = String(visitorHashValue || "").trim();
  const key = String(accountKey || "").trim();
  if (!vh || !key) return;
  const now = Date.now();
  const requested = String(deviceName || "").trim();
  const fallbackName = cleanDeviceName(requested || inferDeviceName(req));

  await db.prepare(`
    INSERT INTO account_device_links (visitor_hash, name_key, linked_at, device_name, last_seen, revoked_at)
    VALUES (?, ?, ?, ?, ?, 0)
    ON CONFLICT(visitor_hash) DO UPDATE SET
      name_key = excluded.name_key,
      device_name = CASE
        WHEN ? IS NOT NULL AND ? != '' THEN excluded.device_name
        WHEN account_device_links.device_name IS NOT NULL AND account_device_links.device_name != '' THEN account_device_links.device_name
        ELSE excluded.device_name
      END,
      last_seen = excluded.last_seen,
      revoked_at = 0
  `).bind(vh, key, now, fallbackName, now, requested, requested).run();
}

function publicFlag(value) {
  return value === true || value === 1 || value === "1" || String(value || "").toLowerCase() === "true";
}

function userLevel(totalScore) {
  const xp = Math.max(0, Number(totalScore || 0));
  let level = 1;
  for (let i = 0; i < USER_LEVEL_THRESHOLDS.length; i++) {
    if (xp >= USER_LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return Math.max(1, Math.min(10, level));
}

function userDailyXpCapForTotal(totalScore) {
  const level = userLevel(totalScore || 0);
  return USER_DAILY_XP_BASE_CAP + Math.max(0, level - 1) * USER_DAILY_XP_CAP_PER_LEVEL;
}


function roundScore(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 10) / 10;
}

function endOfUtcDayMs(ts) {
  const d = dayUTCFromTimestamp(ts || Date.now());
  return (Date.parse(`${d}T00:00:00Z`) || Date.now()) + 86400 * 1000 - 1000;
}

function capBoostMultiplierForDay(opts, day) {
  const d = String(day || todayUTC()).slice(0, 10);
  const boosts = opts && opts.capBoostDays;
  let v = 1;
  try {
    if (boosts instanceof Map) v = Number(boosts.get(d) || 1);
    else if (boosts && typeof boosts === "object") v = Number(boosts[d] || 1);
  } catch (_) { v = 1; }
  return Number.isFinite(v) && v > 1 ? v : 1;
}

function effectiveUserDailyCapForDay(day, opts, totalBeforeDay = 0) {
  return userDailyXpCapForTotal(totalBeforeDay) * capBoostMultiplierForDay(opts, day);
}

function effectiveActivityDailyCapForDay(metric, day, opts) {
  const base = activityDailyCap(metric);
  if (!Number.isFinite(base)) return base;
  return base * capBoostMultiplierForDay(opts, day);
}

function xpBoostMultiplierForTimestamp(opts, ts) {
  const when = Number(ts || 0) || 0;
  const rows = Array.isArray(opts && opts.xpBoostIntervals) ? opts.xpBoostIntervals : [];
  let multiplier = 1;
  for (const row of rows) {
    const start = Number(row && row.start || row && row.startedAt || 0) || 0;
    const end = Number(row && row.end || row && row.expiresAt || 0) || 0;
    const m = Number(row && row.multiplier || row && row.xpMultiplier || 1) || 1;
    if (start && end && when >= start && when <= end && m > multiplier) multiplier = m;
  }
  return multiplier > 1 ? multiplier : 1;
}

function accountFileShopBoostDef(itemId) {
  const id = String(itemId || "").trim();
  if (id === "xp_double_1d") return { durationDays: 1, xpMultiplier: 2, dailyCapMultiplier: 1 };
  if (id === "xp_double_7d") return { durationDays: 7, xpMultiplier: 2, dailyCapMultiplier: 1 };
  if (id === "xp_double_30d") return { durationDays: 30, xpMultiplier: 2, dailyCapMultiplier: 1 };
  if (id === "xp_cap_double_1d") return { durationDays: 1, xpMultiplier: 1, dailyCapMultiplier: 2 };
  return null;
}

function accountFileShopBoostOptions(file, period) {
  const p = String(period || "all");
  const startDay = p === "all" ? "0000-01-01" : periodStart(p);
  const endDay = p === "today" ? startDay : "9999-12-31";
  const xpBoostIntervals = [];
  const capBoostDays = new Map();
  const events = Array.isArray(file && file.eventLog) ? file.eventLog : [];
  for (const ev of events) {
    const metric = String(ev && (ev.metric || ev.type) || "").toLowerCase();
    if (metric !== "shop_purchase" && metric !== "shop_gift_received") continue;
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const itemId = String(d.itemId || d.item_id || ev.itemId || ev.productId || "").trim();
    const def = accountFileShopBoostDef(itemId);
    if (!def) continue;
    const start = normaliseTimestamp(ev.ts || ev.createdAt || ev.created_at || 0) || 0;
    const duration = Math.max(0, Number(def.durationDays || 0) || 0) * 86400000;
    const end = start && duration ? start + duration : 0;
    if (!start || !end) continue;
    if (Number(def.xpMultiplier || 1) > 1) xpBoostIntervals.push({ start, end, multiplier: Number(def.xpMultiplier || 1) || 1, itemId });
    if (Number(def.dailyCapMultiplier || 1) > 1) {
      // Existing server cap boosts are day-granular, so mirror that behaviour for
      // shop cap boosters while preserving all-day/week/month ranking recovery.
      let cursor = dayUTCFromTimestamp(start);
      const last = dayUTCFromTimestamp(Math.max(start, end - 1));
      for (let guard = 0; guard < 40 && cursor <= last; guard += 1) {
        if ((p === "all" || (cursor >= startDay && cursor <= endDay))) {
          capBoostDays.set(cursor, Math.max(Number(capBoostDays.get(cursor) || 1), Number(def.dailyCapMultiplier || 1) || 1));
        }
        const next = Date.parse(cursor + "T00:00:00Z") + 86400000;
        cursor = dayUTCFromTimestamp(next);
      }
    }
  }
  return { xpBoostIntervals, capBoostDays };
}

function mergeCapBoostDayMaps(a, b) {
  const out = new Map();
  const add = (src) => {
    try {
      if (src instanceof Map) src.forEach((v, k) => { const d = String(k || "").slice(0, 10); if (d) out.set(d, Math.max(Number(out.get(d) || 1), Number(v || 1) || 1)); });
      else if (src && typeof src === "object") Object.entries(src).forEach(([k, v]) => { const d = String(k || "").slice(0, 10); if (d) out.set(d, Math.max(Number(out.get(d) || 1), Number(v || 1) || 1)); });
    } catch (_) {}
  };
  add(a); add(b);
  return out;
}

async function getCapBoostDaysForAccount(db, accountKey, opts = {}) {
  const key = String(accountKey || "").trim();
  if (!key) return new Map();
  const period = String(opts.period || "all");
  let where = "account_key = ? AND COALESCE(activated_at,0) > 0";
  const binds = [key];
  if (period !== "all") {
    const startDay = periodStart(period);
    const startMs = Date.parse(`${startDay}T00:00:00Z`) || 0;
    where += " AND COALESCE(expires_at,0) >= ?";
    binds.push(startMs);
    if (period === "today") {
      where += " AND day = ?";
      binds.push(todayUTC());
    }
  }
  const rows = await db.prepare(`
    SELECT COALESCE(day, substr(datetime(activated_at / 1000, 'unixepoch'), 1, 10)) AS day, MAX(COALESCE(multiplier,2)) AS multiplier
    FROM xp_cap_boost_vouchers
    WHERE ${where}
    GROUP BY day
  `).bind(...binds).all().catch(() => ({ results: [] }));
  const out = new Map();
  for (const r of (rows.results || [])) {
    const d = String(r.day || "").slice(0, 10);
    const m = Number(r.multiplier || 1);
    if (d && Number.isFinite(m) && m > 1) out.set(d, m);
  }
  return out;
}

async function getActiveCapBoostForToday(db, accountKey) {
  const key = String(accountKey || "").trim();
  if (!key) return { active: false, multiplier: 1, expiresAt: 0, day: todayUTC() };
  const now = Date.now();
  const day = todayUTC();
  const row = await db.prepare(`
    SELECT MAX(COALESCE(multiplier,2)) AS multiplier, MAX(COALESCE(expires_at,0)) AS expires_at
    FROM xp_cap_boost_vouchers
    WHERE account_key = ? AND day = ? AND COALESCE(activated_at,0) > 0 AND COALESCE(expires_at,0) >= ?
  `).bind(key, day, now).first().catch(() => null);
  const m = Number(row && row.multiplier || 1);
  return { active: Number.isFinite(m) && m > 1, multiplier: Number.isFinite(m) && m > 1 ? m : 1, expiresAt: Number(row && row.expires_at || 0), day };
}

function safeVoucherIdPart(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "unknown";
}

async function accountKeyFromVisitorHash(db, visitorHashValue) {
  const vh = String(visitorHashValue || "").trim();
  if (!vh) return "";
  const row = await db.prepare(`
    SELECT COALESCE(dl.name_key, ci.name_key, '') AS account_key
    FROM (SELECT ? AS visitor_hash) v
    LEFT JOIN account_device_links dl ON dl.visitor_hash = v.visitor_hash AND COALESCE(dl.revoked_at,0)=0
    LEFT JOIN comment_identities ci ON ci.visitor_hash = v.visitor_hash
    LIMIT 1
  `).bind(vh).first().catch(() => null);
  return identityNameKey(row && row.account_key || "");
}

async function grantXpCapBoostVoucher(db, accountKey, source, sourceId, reason, createdBy) {
  const key = identityNameKey(accountKey || "");
  const src = safeVoucherIdPart(source || "manual");
  const sid = safeVoucherIdPart(sourceId || `${Date.now()}`);
  if (!key) return { ok: false, error: "Missing reporter account." };
  const now = Date.now();
  const id = `capboost:${src}:${sid}:${key}`.slice(0, 240);
  const cleanReason = String(reason || "Daily XP cap boost reward").replace(/\u0000/g, "").replace(/\s+/g, " ").trim().slice(0, 300);
  await db.prepare(`
    INSERT OR IGNORE INTO xp_cap_boost_vouchers (id, account_key, source, source_id, reason, multiplier, day, created_at, activated_at, expires_at, created_by)
    VALUES (?, ?, ?, ?, ?, 2, '', ?, 0, 0, ?)
  `).bind(id, key, src, sid, cleanReason, now, String(createdBy || "admin").slice(0, 120)).run();
  const row = await db.prepare(`SELECT * FROM xp_cap_boost_vouchers WHERE id = ?`).bind(id).first().catch(() => null);
  return { ok: true, voucher: row, duplicate: !!(row && Number(row.created_at || 0) !== now) };
}

async function activateXpCapBoostVoucher(db, accountKey, voucherId) {
  const key = identityNameKey(accountKey || "");
  const id = String(voucherId || "").trim();
  if (!key || !id) return { ok: false, error: "Missing voucher." };
  const now = Date.now();
  const day = todayUTC();
  const expiresAt = endOfUtcDayMs(now);
  const row = await db.prepare(`SELECT * FROM xp_cap_boost_vouchers WHERE id = ? AND account_key = ?`).bind(id, key).first().catch(() => null);
  if (!row) return { ok: false, error: "Voucher not found." };
  if (Number(row.activated_at || 0) > 0) return { ok: true, alreadyActive: true, voucher: row };
  await db.prepare(`UPDATE xp_cap_boost_vouchers SET activated_at = ?, day = ?, expires_at = ? WHERE id = ? AND account_key = ? AND COALESCE(activated_at,0)=0`).bind(now, day, expiresAt, id, key).run();
  const fresh = await db.prepare(`SELECT * FROM xp_cap_boost_vouchers WHERE id = ? AND account_key = ?`).bind(id, key).first().catch(() => row);
  return { ok: true, activated: true, voucher: fresh, day, expiresAt };
}

function voucherNotificationFromRow(row) {
  const activatedAt = Number(row && row.activated_at || 0);
  const expiresAt = Number(row && row.expires_at || 0);
  const data = (() => {
    try { return row && row.report_data_json ? JSON.parse(row.report_data_json) : {}; } catch (_) { return {}; }
  })();
  const source = String(row && row.source || "");
  const pageTitle = String(data.pageTitle || data.title || "").trim();
  return {
    type: "xp_cap_boost_voucher",
    reaction: "",
    createdAt: Number(row && row.created_at || 0),
    path: String(data.path || ""),
    title: pageTitle || "Daily XP cap boost voucher",
    commentId: String(data.commentId || ""),
    replyId: "",
    commentText: "",
    replyText: "",
    actorName: "Wiki Keeper",
    actorAvatar: "🤖",
    actorAvatarFrame: "level-10",
    actorPublic: true,
    actorAccountKey: "",
    notificationTitle: "Daily XP Cap Boost voucher",
    notificationMessage: String(row && row.reason || ""),
    notificationSource: source,
    notificationSourceId: String(row && row.source_id || ""),
    voucherId: String(row && row.id || ""),
    voucherMultiplier: Number(row && row.multiplier || 2),
    voucherActivatedAt: activatedAt,
    voucherExpiresAt: expiresAt,
    voucherActive: activatedAt > 0 && (!expiresAt || expiresAt >= Date.now()),
    voucherUsed: activatedAt > 0,
    voucherSource: source,
  };
}

function activityRule(metric) {
  const m = activityMetric(metric) || String(metric || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return Object.prototype.hasOwnProperty.call(USER_ACTIVITY_RULES, m) ? USER_ACTIVITY_RULES[m] : null;
}

function activityXp(metric) {
  const rule = activityRule(metric);
  return Number(rule && rule.xp || 0);
}

function activityDailyCap(metric) {
  const rule = activityRule(metric);
  const cap = Number(rule && rule.dailyCap);
  return Number.isFinite(cap) && cap >= 0 ? cap : Infinity;
}

function activityCategory(metric) {
  const rule = activityRule(metric);
  return String(rule && rule.category || "Activity");
}

function activityOneTime(metric) {
  const rule = activityRule(metric);
  return !!(rule && rule.oneTime);
}

function repeatDiscountForMetric(metric) {
  const m = activityMetric(metric);
  if (!m || !Object.prototype.hasOwnProperty.call(CONCEPT_REPEAT_DISCOUNTS, m)) return 1;
  const pct = Number(CONCEPT_REPEAT_DISCOUNTS[m]);
  return Number.isFinite(pct) && pct > 0 && pct <= 1 ? pct : 1;
}

function repeatDiscountPercentForMetric(metric) {
  const d = repeatDiscountForMetric(metric);
  return d < 0.999999 ? Math.round(d * 100) : null;
}

function repeatGroupForMetric(metric) {
  const m = activityMetric(metric);
  if (!m || repeatDiscountForMetric(m) >= 0.999999) return "";
  return CONCEPT_REPEAT_GROUPS[m] || m;
}

function conceptRepeatKey(path) {
  const p = normalizePath(path || "");
  return p && isConceptPath(p) ? p : "";
}

function connectionRepeatOtherKey(details) {
  const d = details && typeof details === "object" ? details : {};
  const raw = d.other || d.target || d.targetKey || d.requesterKey || d.requester || d.accountKey || d.name || "";
  return identityNameKey(raw);
}

function eventRepeatKey(metric, path, details) {
  const m = activityMetric(metric);
  if (m === "connection_added" || m === "connection_request") {
    const other = connectionRepeatOtherKey(details);
    return other ? `connection:${other}` : "";
  }
  if (m === "avatar_upload" || m === "intro_update") return `account:${m}`;
  return conceptRepeatKey(path);
}

function truthyDetailsFlag(value) {
  return value === true || value === 1 || value === "1" || String(value || "").toLowerCase() === "true";
}

function aiQuizCompletionSignal(rawMetric, bodyOrDetails) {
  const raw = String(rawMetric || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  const data = bodyOrDetails && typeof bodyOrDetails === "object" ? bodyOrDetails : {};
  const details = data.details && typeof data.details === "object" ? data.details : data;
  const sourceRaw = String(details.source || data.source || "").toLowerCase();
  const source = sourceRaw.replace(/[\s-]+/g, "_");
  const eventName = String(details.eventName || data.eventName || data.type || data.event || "").toLowerCase().replace(/[\s-]+/g, "_");
  const visibleTextLooksReal = (text) => {
    const t = String(text || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!t) return false;
    const hasScore = /\b\d+\s*\/\s*\d+\s*(?:correct|right|answered|score)?\b/.test(t) ||
      /\b(?:score|correct)\s*[:：]?\s*\d+\s*\/\s*\d+\b/.test(t);
    const hasLevel = /(?:suggested|recommended)\s+(?:mastery\s+)?level\b/.test(t) ||
      /(?:suggested|recommended)\s+mastery\b/.test(t) ||
      /\bmastery\s+level\b/.test(t) ||
      /\blevel\s*[:：]?\s*(?:unknown|unclear|clear|mastered|[0-3])\b/.test(t);
    const hasResultAction = /\baccept\s+(?:level|mastery)\b/.test(t) ||
      /\btry\s+again\b/.test(t) || /\bretake\b/.test(t) ||
      /quiz\s+session\s+has\s+been\s+saved/.test(t) ||
      /save\s+(?:this\s+)?(?:suggested|recommended)/.test(t);
    const hasQuestionTrace = /\bq\s*1\s*[:.]/.test(t) && /\bq\s*2\s*[:.]/.test(t) && /\bq\s*3\s*[:.]/.test(t) &&
      /\b(correct|wrong|incorrect|not\s+quite)\b/.test(t);
    return !!(hasScore && hasLevel && (hasResultAction || hasQuestionTrace || /\b(aiq|mcq|quiz|concept\s+check)\b/.test(t)));
  };

  const text = details.textSignature || details.text_signature || details.resultText || details.result_text || "";
  const visibleTextIsRealResult = visibleTextLooksReal(text);
  const strongResultId = String(
    details.resultId || details.result_id || details.sessionId || details.session_id ||
    details.quizSessionId || details.quiz_session_id || details.completionId || details.completion_id || ""
  ).trim();
  const numericScore = Number(details.score != null ? details.score : details.correct != null ? details.correct : details.correct_count);
  const numericTotal = Number(details.total != null ? details.total : details.totalQuestions != null ? details.totalQuestions : details.total_questions);
  const hasNumericResult = Number.isFinite(numericScore) && Number.isFinite(numericTotal) && numericTotal > 0 && numericScore >= 0;
  const produced = details.resultProduced === true || details.completed === true || details.finished === true || details.canonicalSessionImport === true;

  // The old broad DOM detector and generic completion-event listener are no
  // longer trusted as historical evidence. Real completions must be either a
  // canonical session import, a current explicit result payload with a stable id,
  // or an unmistakable visible AIQ result card text.
  if (source === "ai_quiz_result_visible" || source === "ai_quiz_result_action_visible") {
    return visibleTextIsRealResult;
  }

  const blocker = /(attempt|start|started|open|opened|begin|launch|loading|pending|cancel|cancelled|canceled|accept|accepted|reject|rejected)/;
  if (blocker.test(raw) || blocker.test(eventName) || blocker.test(source)) return false;

  const trustedSource = source === "ai_mcq_session_import" ||
    source === "ai_mcq_render_result" ||
    source === "explicit_api" ||
    source === "ai_mcq_explicit_result_card";
  if (trustedSource) return !!(strongResultId || (produced && hasNumericResult));

  // Historical generic event records are only kept if they carry a strong result
  // identity plus a numeric result, or if their captured visible text is a real
  // result card. This removes the old "AI mastery check" false positives without
  // deleting canonical imported sessions.
  if (source === "ai_quiz_completion_event" || /ai.*completion.*event/.test(source)) {
    return !!((strongResultId && (hasNumericResult || produced)) || visibleTextIsRealResult);
  }

  const detectorVersion = Number(details && details.detectionVersion || 0);
  if (detectorVersion && !strongResultId && !visibleTextIsRealResult) return false;
  if (produced && (strongResultId || hasNumericResult || visibleTextIsRealResult)) return true;
  return false;
}

function activityHashString(value) {
  const src = String(value || "").slice(0, 1200);
  let h = 2166136261;
  for (let i = 0; i < src.length; i += 1) {
    h ^= src.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

function aiQuizActivityIdentity(details, path, createdAt) {
  const d = details && typeof details === "object" ? details : {};
  const p = normalizePath(path || d.path || d.conceptPath || d.concept_id || d.conceptId || "") || "site";
  const when = normaliseTimestamp(createdAt || d.completedAt || d.completed_at || d.eventClientTs || 0) || Date.now();
  const day = dayUTCFromTimestamp(when);
  const strong = String(
    d.resultId || d.result_id || d.sessionId || d.session_id || d.quizSessionId || d.quiz_session_id ||
    d.completionId || d.completion_id || d.signature || d.resultSignature || d.result_signature || ""
  ).trim();
  if (strong) return { key: `strong:${p}:${strong.slice(0, 220)}`, stateKey: `ai-quiz:${p}:${strong.slice(0, 220)}`, day, path: p };

  const textSig = String(d.textSignature || d.text_signature || d.resultText || d.result_text || d.feedbackText || d.feedback_text || "").trim();
  if (textSig) {
    const h = activityHashString(textSig);
    // Legacy visible-result events may fire more than once while the same modal
    // is open, but the same concept can legitimately be quizzed again later.  A
    // short time bucket removes observer duplicates without collapsing a whole
    // day of real repeated quizzes into one action.
    const bucket = Math.floor(when / (5 * 60 * 1000));
    return { key: `text:${p}:${day}:${h}:${bucket}`, stateKey: `ai-quiz-result:${p}:${h}:${bucket}`, day, path: p };
  }

  // Last-resort protection for older generic observers.  It intentionally uses a
  // day-level key so a visible result panel cannot add XP every few seconds.
  const source = String(d.source || d.eventName || d.type || "generic-result").toLowerCase().replace(/[^a-z0-9_:-]+/g, "-").slice(0, 80);
  return { key: `fallback:${p}:${day}:${source || "result"}`, stateKey: `ai-quiz-fallback:${p}:${source || "result"}`, day, path: p };
}

function aiQuizActivityDedupeKey(row, details, path, createdAt) {
  return aiQuizActivityIdentity(details, path || row && row.path || "", createdAt || row && row.created_at || 0).key;
}

function aiQuizActivityStateKey(details, path, createdAt) {
  return normaliseActionStateKey(aiQuizActivityIdentity(details, path, createdAt).stateKey, `ai-quiz:${path || "site"}`);
}

function mapOpenSignal(rawMetric, bodyOrDetails) {
  const data = bodyOrDetails && typeof bodyOrDetails === "object" ? bodyOrDetails : {};
  const details = data.details && typeof data.details === "object" ? data.details : data;
  const raw = String(rawMetric || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  const source = String(details.source || data.source || "").toLowerCase().replace(/[\s-]+/g, "_");
  const eventNameRaw = String(details.eventName || data.eventName || data.type || data.event || "").toLowerCase();
  const eventName = eventNameRaw.replace(/[\s-]+/g, "_");
  const panel = String(details.panel || data.panel || "").toLowerCase();
  const version = Number(details.mapSignalVersion || data.mapSignalVersion || 0);
  const stateVersion = Number(details.actionStateVersion || data.actionStateVersion || 0);
  const triggerKind = String(details.triggerKind || data.triggerKind || "").toLowerCase();
  const localMapCardConfirmed = details.localMapCardConfirmed === true || data.localMapCardConfirmed === true;

  if (panel === "account" || panel === "profile" || panel === "level" || panel === "comments") return false;
  if (/account|profile|level|comment|notification|connection|privacy/.test(source + " " + eventName + " " + triggerKind)) return false;
  if (stateVersion >= 7 && (details.mapConfirmed === true || details.learningMapConfirmed === true || details.conceptMapConfirmed === true)) return true;
  if (/observer|dom|insert|initial|boot|render|panel_visible|map_panel_visible/.test(source + " " + eventName + " " + triggerKind)) return false;

  // Explicit site events are the safest historical source.  These are fired by
  // the map opener itself, not by a generic DOM observer.
  if (/^(mk:)?(learning_map_opened|concept_map_opened|map_opened)$/.test(eventName)) return true;
  if (/^(mk:)?(learning-map-opened|concept-map-opened|map-opened)$/.test(eventNameRaw)) return true;

  // Since v2 the front-end sends mapSignalVersion plus a trigger kind/text.
  // Older generic map-click + mapConfirmed events are ambiguous and are not used
  // for recomputation, which removes the false "map opened today" rows caused by
  // hidden map widgets or H1 DOM insertion.
  if (version >= 4 && localMapCardConfirmed && (details.mapConfirmed === true || details.learningMapConfirmed === true || details.conceptMapConfirmed === true)) return true;
  if (version >= 2 && (details.mapConfirmed === true || details.learningMapConfirmed === true || details.conceptMapConfirmed === true)) {
    if (/explicit|button|labelled|h1-map|local-map|map|card/.test(triggerKind) || /learning|concept|map/.test(source + " " + eventName)) return true;
  }
  if (version >= 2 && /^(map_click|learning_map_click|concept_map_click)$/.test(source)) return true;
  if (version >= 2 && /^(mk:)?(map_open|map)$/.test(raw) && /learning|concept|map/.test(source + " " + eventName + " " + triggerKind)) return true;
  return false;
}

function panelOpenSignal(rawMetric, bodyOrDetails) {
  const data = bodyOrDetails && typeof bodyOrDetails === "object" ? bodyOrDetails : {};
  const details = data.details && typeof data.details === "object" ? data.details : data;
  const panel = String(details.panel || data.panel || "").toLowerCase().replace(/[\s-]+/g, "_");
  const source = String(details.source || data.source || "").toLowerCase();
  const eventName = String(details.eventName || data.eventName || data.type || data.event || "").toLowerCase();
  const mobile = details.mobile === true || data.mobile === true || Number(details.viewportWidth || data.viewportWidth || 9999) <= 900;
  if (panel === "account" || panel === "profile" || panel === "level" || panel === "comments") return false;
  if (/account|profile|level|comment|notification|connection|privacy/.test(source + " " + eventName + " " + panel)) return false;
  // XP is only for the explicit mobile Learning Path panel. On desktop this
  // panel is normally already visible, so simply having it on screen must not
  // create XP.
  if (!mobile) return false;
  if (/learning_path|learningpath|path_panel|lp_panel/.test(panel + " " + source + " " + eventName)) return true;
  return false;
}

function normaliseActionStateKey(value, fallback = "global") {
  const raw = String(value || fallback || "global").trim().toLowerCase();
  const cleaned = raw
    .replace(/^https?:\/\/[^/]+/i, "")
    .split("#")[0]
    .split("?")[0]
    .replace(/[^a-z0-9._:/-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");
  return (cleaned || String(fallback || "global")).slice(0, 220);
}

function actionStateDetails(bodyOrDetails) {
  const data = bodyOrDetails && typeof bodyOrDetails === "object" ? bodyOrDetails : {};
  return data.details && typeof data.details === "object" ? data.details : data;
}

function shouldGateActivityState(metric, bodyOrDetails) {
  const m = activityMetric(metric);
  if (!m || !STATE_GATED_ACTIVITY_METRICS.has(m)) return false;
  const details = actionStateDetails(bodyOrDetails);
  return Number(details.actionStateVersion || 0) >= 7 || details.actionStateMetric || details.actionStateKey;
}

function actionStateKeyForMetric(metric, bodyOrDetails, path) {
  const m = activityMetric(metric) || String(metric || "").toLowerCase();
  const details = actionStateDetails(bodyOrDetails);
  if (details.actionStateKey) return normaliseActionStateKey(details.actionStateKey, `${m}:global`);
  if (m === "map_open") return normaliseActionStateKey(`learning-map:${path || details.path || "site"}`, "learning-map:site");
  if (m === "concept_finder_open") return "concept-finder:page-open";
  if (m === "search_suggestion") return normaliseActionStateKey(`search-suggestion:${details.href || details.landedPath || details.triggerText || "unknown"}`, "search-suggestion:unknown");
  if (m === "saved_page_visit") return normaliseActionStateKey(`saved-page-visit:${path || details.path || "unknown"}`, "saved-page-visit:unknown");
  if (m === "sort_use") return normaliseActionStateKey(`sort-filter:${details.controlKey || details.controlKind || "control"}:${details.value || details.metric || details.period || details.triggerText || path || "unknown"}`, "sort-filter:unknown");
  if (m === "course_search") return normaliseActionStateKey(`course-search:${details.querySample || details.query || details.queryLength || details.href || "unknown"}`, "course-search:unknown");
  if (m === "random_browse_start") return normaliseActionStateKey(`random-browse:${path || details.path || "concept-finder"}`, "random-browse:concept-finder");
  if (m === "guided_study_start") return normaliseActionStateKey(`guided-study:${path || details.path || details.route || "site"}`, "guided-study:site");
  if (m === "course_diagnostics_open") return normaliseActionStateKey(`course-diagnostics:${path || details.path || details.course || "site"}`, "course-diagnostics:site");
  if (m === "prerequisite_readiness_open") return normaliseActionStateKey(`prerequisite-readiness:${path || details.path || "site"}`, "prerequisite-readiness:site");
  if (m === "panel_open") return normaliseActionStateKey(`panel:${details.panel || path || "learning_path"}`, "panel:learning_path");
  return normaliseActionStateKey(`${m}:${path || "global"}`, `${m}:global`);
}

async function claimDailyActivityActionState(db, accountKey, metric, stateKey, day, ts, details) {
  const key = String(accountKey || "").trim();
  const m = activityMetric(metric);
  const sk = normaliseActionStateKey(stateKey, `${m || "activity"}:global`);
  const d = String(day || todayUTC()).slice(0, 10);
  const when = normaliseTimestamp(ts || 0) || Date.now();
  if (!key || !m || !sk) return { claimed: false, reason: "missing_state_key" };

  const existingEver = await db.prepare(`
    SELECT first_seen_at, last_seen_at, last_day
    FROM user_activity_action_state
    WHERE account_key = ? AND metric = ? AND state_key = ?
  `).bind(key, m, sk).first().catch(() => null);

  const detailsJson = safeDetailsJson(Object.assign({}, details || {}, { actionStateKey: sk, actionStateDay: d }));
  const inserted = await db.prepare(`
    INSERT OR IGNORE INTO user_activity_action_state_daily (day, account_key, metric, state_key, first_seen_at, last_seen_at, details_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(d, key, m, sk, when, when, detailsJson).run().catch(() => null);
  const claimed = !!(inserted && inserted.meta && Number(inserted.meta.changes || 0) > 0);

  if (!claimed) {
    await db.prepare(`
      UPDATE user_activity_action_state_daily
      SET last_seen_at = ?, details_json = ?
      WHERE day = ? AND account_key = ? AND metric = ? AND state_key = ?
    `).bind(when, detailsJson, d, key, m, sk).run().catch(() => {});
    return { claimed: false, reason: "action_state_already_active_today", stateKey: sk, day: d, hadEver: !!existingEver };
  }

  await db.prepare(`
    INSERT INTO user_activity_action_state (account_key, metric, state_key, first_seen_at, last_seen_at, last_day, details_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_key, metric, state_key) DO UPDATE SET
      last_seen_at = excluded.last_seen_at,
      last_day = excluded.last_day,
      details_json = excluded.details_json
  `).bind(key, m, sk, existingEver ? Number(existingEver.first_seen_at || when) : when, when, d, detailsJson).run().catch(() => {});

  return { claimed: true, reason: "action_state_activated", stateKey: sk, day: d, hadEver: !!existingEver };
}

function effectiveDailyMetricScore(metric, count) {
  const c = Math.max(0, Number(count || 0));
  const raw = c * activityXp(metric);
  return Math.min(raw, activityDailyCap(metric));
}

function calculateXpFromEventRows(rows, opts = {}) {
  const input = Array.isArray(rows) ? rows.slice() : [];
  input.sort((a, b) => Number(a && a.created_at || 0) - Number(b && b.created_at || 0) || String(a && a.id || "").localeCompare(String(b && b.id || "")));

  const repeatSeen = new Set();
  const oneTimeSeen = new Set();
  const aiQuizSeen = new Set();
  const localReplaySeen = new Set();
  const masteryStateByConcept = new Map();
  const eventsByDay = new Map();
  const explicitActiveDays = new Set();
  const scoredEvents = [];

  const addEntry = (entry) => {
    const day = String(entry.day || todayUTC());
    if (!eventsByDay.has(day)) eventsByDay.set(day, []);
    eventsByDay.get(day).push(entry);
  };

  for (const row of input) {
    const rawMetric = String(row && row.metric || "");
    const m = activityMetric(rawMetric);
    if (!m) continue;
    const details = eventDetailsFromRow(row);
    const createdAt = normaliseTimestamp(row && row.created_at || 0) || Date.now();
    const day = dayUTCFromTimestamp(createdAt);
    const path = normalizePath(row && row.path || "");
    const title = cleanTitle(row && row.title || "", path || "");
    if (m === "ai_quiz") {
      if (!aiQuizCompletionSignal(rawMetric, details)) continue;
      const aiKey = aiQuizActivityDedupeKey(row, details, path, createdAt);
      if (aiKey && aiQuizSeen.has(aiKey)) continue;
      if (aiKey) aiQuizSeen.add(aiKey);
    }
    if (m === "view" || m === "mastery" || m === "saved_page_action") {
      const semantic = m === "mastery"
        ? String(details.mastery != null ? details.mastery : details.m != null ? details.m : details.level != null ? details.level : "")
        : m === "saved_page_action"
          ? String(details.action || details.savedAction || "")
          : String(details.visitId || details.visit_id || "");
      const bucket = m === "view" ? Math.floor(Number(createdAt || 0) / 5000) : Number(createdAt || 0);
      const replayKey = `${m}:${path}:${bucket}:${semantic}`;
      if (localReplaySeen.has(replayKey)) continue;
      localReplaySeen.add(replayKey);

      // Mastery XP is awarded for a state transition, not merely for writing the
      // same state again.  The first known rating for a concept counts once; a
      // later change to another state counts as a repeated mastery action and is
      // therefore scored through the normal 30% repeat rule.  This applies to
      // direct widget clicks, manager edits, AI-quiz acceptance, and recovered
      // local history because all of them now enter the same event stream.
      if (m === "mastery" && path) {
        const n = Number(semantic);
        if ([0, 1, 2, 3].includes(n)) {
          const prev = masteryStateByConcept.has(path) ? masteryStateByConcept.get(path) : null;
          if (prev != null && Number(prev) === n && !truthyDetailsFlag(details.forceCount || details.force_count)) {
            continue;
          }
          masteryStateByConcept.set(path, n);
        }
      }
    }
    if (m === "map_open" && !mapOpenSignal(rawMetric, details)) continue;
    if (m === "panel_open" && !panelOpenSignal(rawMetric, details)) continue;

    let count = m === "ai_quiz" ? 1 : Math.max(0, Number(row && row.count || 0));
    if (!count) continue;
    if (activityOneTime(m)) {
      if (oneTimeSeen.has(m)) continue;
      oneTimeSeen.add(m);
      count = 1;
    }
    const xpMultiplier = xpBoostMultiplierForTimestamp(opts, createdAt);
    const baseXp = activityXp(m) * xpMultiplier;
    const repeatDiscount = repeatDiscountForMetric(m);
    const repeatGroup = repeatGroupForMetric(m);
    const conceptKey = repeatGroup ? eventRepeatKey(m, path, details) : "";
    const forceRepeat = repeatGroup && conceptKey && truthyDetailsFlag(details.forceRepeat || details.force_repeat || details.repeatOnly || details.repeat_only);
    let firstUnits = count;
    let repeatUnits = 0;
    let repeatApplied = false;

    if (conceptKey && repeatDiscount < 0.999999) {
      const seenKey = `${repeatGroup}:${conceptKey}`;
      if (forceRepeat || repeatSeen.has(seenKey)) {
        firstUnits = 0;
        repeatUnits = count;
        repeatSeen.add(seenKey);
      } else {
        firstUnits = Math.min(1, count);
        repeatUnits = Math.max(0, count - firstUnits);
        repeatSeen.add(seenKey);
      }
      repeatApplied = repeatUnits > 0 || firstUnits === 0;
    }

    const rawScore = baseXp * count;
    const repeatAdjustedScore = baseXp * (firstUnits + repeatUnits * repeatDiscount);
    const entry = {
      id: String(row && row.id || ""),
      metric: m,
      day,
      count,
      path,
      title,
      details,
      createdAt,
      xpPerCount: baseXp,
      xpMultiplier,
      rawScore,
      repeatAdjustedScore,
      repeatDiscount,
      repeatPercent: repeatDiscountPercentForMetric(m),
      repeatApplied,
      firstUnits,
      repeatUnits,
      scoreBeforeDailyCap: repeatAdjustedScore,
      score: 0,
      isSynthetic: false,
    };
    if (m === "active_day") explicitActiveDays.add(day);
    addEntry(entry);
    scoredEvents.push(entry);
  }

  // Active-day XP is derived from the canonical event stream so historical XP can
  // be recomputed without trusting the old daily aggregate table.
  for (const day of Array.from(eventsByDay.keys())) {
    if (explicitActiveDays.has(day)) continue;
    const syntheticCreatedAt = Date.parse(`${day}T00:00:00Z`) || Date.now();
    const syntheticXpMultiplier = xpBoostMultiplierForTimestamp(opts, syntheticCreatedAt);
    const syntheticActiveDayXp = activityXp("active_day") * syntheticXpMultiplier;
    addEntry({
      id: `active_day:${day}`,
      metric: "active_day",
      day,
      count: 1,
      path: "",
      title: "",
      details: { source: "derived_from_user_activity_events" },
      createdAt: syntheticCreatedAt,
      xpPerCount: syntheticActiveDayXp,
      xpMultiplier: syntheticXpMultiplier,
      rawScore: syntheticActiveDayXp,
      repeatAdjustedScore: syntheticActiveDayXp,
      repeatDiscount: 1,
      repeatPercent: null,
      repeatApplied: false,
      firstUnits: 1,
      repeatUnits: 0,
      scoreBeforeDailyCap: syntheticActiveDayXp,
      score: 0,
      isSynthetic: true,
    });
  }

  const byMetric = new Map();
  let totalScore = 0;
  let totalRawScore = 0;
  let totalRepeatAdjustedScore = 0;
  let totalBeforeDailyCap = 0;
  let anyMetricCapApplied = false;
  let anyDailyCapApplied = false;
  let anyRepeatDiscountApplied = false;
  const dailySummary = [];

  for (const [day, entries] of Array.from(eventsByDay.entries()).sort((a,b) => String(a[0]).localeCompare(String(b[0])))) {
    const byMetricDay = new Map();
    for (const x of entries) {
      if (!byMetricDay.has(x.metric)) byMetricDay.set(x.metric, []);
      byMetricDay.get(x.metric).push(x);
    }

    let dayRaw = 0;
    let dayRepeatAdjusted = 0;
    let dayBeforeDailyCap = 0;
    let dayCount = 0;

    for (const [metric, metricEntries] of byMetricDay.entries()) {
      const metricAdjusted = metricEntries.reduce((sum, x) => sum + Number(x.repeatAdjustedScore || 0), 0);
      const metricCap = effectiveActivityDailyCapForDay(metric, day, opts);
      const metricFactor = Number.isFinite(metricCap) && metricCap >= 0 && metricAdjusted > metricCap && metricAdjusted > 0 ? metricCap / metricAdjusted : 1;
      if (metricFactor < 0.999999) anyMetricCapApplied = true;
      for (const x of metricEntries) {
        x.scoreBeforeDailyCap = Number(x.repeatAdjustedScore || 0) * metricFactor;
        x.metricDailyCap = Number.isFinite(metricCap) ? metricCap : null;
        x.metricCapApplied = metricFactor < 0.999999;
        x.metricFactor = metricFactor;
        dayRaw += Number(x.rawScore || 0);
        dayRepeatAdjusted += Number(x.repeatAdjustedScore || 0);
        dayBeforeDailyCap += Number(x.scoreBeforeDailyCap || 0);
        dayCount += Number(x.count || 0);
      }
    }

    const userDailyCap = effectiveUserDailyCapForDay(day, opts, totalScore);
    const dayFactor = dayBeforeDailyCap > userDailyCap && dayBeforeDailyCap > 0 ? userDailyCap / dayBeforeDailyCap : 1;
    if (dayFactor < 0.999999) anyDailyCapApplied = true;
    const dayScore = dayBeforeDailyCap * dayFactor;
    totalRawScore += dayRaw;
    totalRepeatAdjustedScore += dayRepeatAdjusted;
    totalBeforeDailyCap += dayBeforeDailyCap;
    totalScore += dayScore;

    dailySummary.push({
      day,
      count: roundScore(dayCount),
      rawScore: roundScore(dayRaw),
      repeatAdjustedScore: roundScore(dayRepeatAdjusted),
      scoreBeforeDailyCap: roundScore(dayBeforeDailyCap),
      score: roundScore(dayScore),
      dailyCap: userDailyCap,
      dailyCapMultiplier: capBoostMultiplierForDay(opts, day),
      dailyCapApplied: dayFactor < 0.999999,
      dailyCapReached: dayBeforeDailyCap >= userDailyCap,
    });

    for (const x of entries) {
      const finalScore = Number(x.scoreBeforeDailyCap || 0) * dayFactor;
      x.score = finalScore;
      if (x.repeatApplied) anyRepeatDiscountApplied = true;
      const meta = activityMetricMeta(x.metric);
      let agg = byMetric.get(x.metric);
      if (!agg) {
        agg = {
          metric: x.metric,
          label: meta.label,
          description: meta.description,
          category: meta.category,
          count: 0,
          xpPerCount: meta.weight,
          dailyCap: meta.dailyCap,
          globalDailyCap: USER_DAILY_XP_CAP,
          repeatPercent: meta.repeatPercent,
          rawScore: 0,
          repeatAdjustedScore: 0,
          scoreBeforeDailyCap: 0,
          score: 0,
          metricCapApplied: false,
          dailyCapApplied: false,
          repeatDiscountApplied: false,
          updatedAt: 0,
          dailyDetails: [],
        };
        byMetric.set(x.metric, agg);
      }
      agg.count += Number(x.count || 0);
      agg.rawScore += Number(x.rawScore || 0);
      agg.repeatAdjustedScore += Number(x.repeatAdjustedScore || 0);
      agg.scoreBeforeDailyCap += Number(x.scoreBeforeDailyCap || 0);
      agg.score += finalScore;
      agg.metricCapApplied = !!(agg.metricCapApplied || x.metricCapApplied);
      agg.dailyCapApplied = !!(agg.dailyCapApplied || dayFactor < 0.999999);
      agg.repeatDiscountApplied = !!(agg.repeatDiscountApplied || x.repeatApplied);
      agg.updatedAt = Math.max(Number(agg.updatedAt || 0), Number(x.createdAt || 0));
      agg.dailyDetails.push({
        day,
        count: roundScore(x.count),
        rawScore: roundScore(x.rawScore),
        repeatAdjustedScore: roundScore(x.repeatAdjustedScore),
        scoreBeforeDailyCap: roundScore(x.scoreBeforeDailyCap),
        dayTotalBeforeDailyCap: roundScore(dayBeforeDailyCap),
        dayFactor: Number(dayFactor.toFixed(6)),
        repeatPercent: x.repeatPercent,
        repeatApplied: !!x.repeatApplied,
        metricCapApplied: !!x.metricCapApplied,
        globalDailyCap: userDailyCap,
        dailyCapMultiplier: capBoostMultiplierForDay(opts, day),
        score: roundScore(finalScore),
      });
    }
  }

  const breakdown = Array.from(byMetric.values()).map((r) => Object.assign({}, r, {
    count: roundScore(r.count),
    rawScore: roundScore(r.rawScore),
    repeatAdjustedScore: roundScore(r.repeatAdjustedScore),
    scoreBeforeDailyCap: roundScore(r.scoreBeforeDailyCap),
    score: roundScore(r.score),
  })).filter((r) => isCurrentUserActivityMetric(r.metric) && (r.count !== 0 || r.score !== 0))
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0) || String(a.label || a.metric).localeCompare(String(b.label || b.metric)));

  const events = scoredEvents.slice().sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)).map((x) => {
    const meta = activityMetricMeta(x.metric);
    return {
      id: x.id,
      metric: x.metric,
      label: meta.label,
      description: meta.description,
      category: meta.category,
      count: roundScore(x.count),
      xpPerCount: meta.weight,
      repeatPercent: x.repeatPercent,
      repeatApplied: !!x.repeatApplied,
      rawScore: roundScore(x.rawScore),
      repeatAdjustedScore: roundScore(x.repeatAdjustedScore),
      scoreBeforeDailyCap: roundScore(x.scoreBeforeDailyCap),
      score: roundScore(x.score),
      path: x.path,
      title: x.title,
      details: x.details,
      createdAt: x.createdAt,
    };
  });

  return {
    totalScore: roundScore(totalScore),
    totalRawScore: roundScore(totalRawScore),
    totalRepeatAdjustedScore: roundScore(totalRepeatAdjustedScore),
    totalBeforeDailyCap: roundScore(totalBeforeDailyCap),
    dailyCap: userDailyXpCapForTotal(totalScore || 0),
    metricCapApplied: anyMetricCapApplied,
    dailyCapApplied: anyDailyCapApplied,
    repeatDiscountApplied: anyRepeatDiscountApplied,
    sourceEvents: true,
    dailySummary: dailySummary.sort((a, b) => String(b.day || "").localeCompare(String(a.day || ""))),
    breakdown,
    events,
  };
}

function calculateXpFromDailyRows(rows) {
  const byDay = new Map();
  for (const row of (Array.isArray(rows) ? rows : [])) {
    const m = activityMetric(row && row.metric || "");
    if (!m) continue;
    const count = Math.max(0, Number(row && row.count || 0));
    if (!count) continue;
    const day = String(row && row.day || "legacy");
    if (!byDay.has(day)) byDay.set(day, []);
    const xpPerCount = activityXp(m);
    const rawScore = count * xpPerCount;
    const metricDailyCap = activityDailyCap(m);
    const scoreBeforeDailyCap = Math.min(rawScore, metricDailyCap);
    byDay.get(day).push({ metric: m, count, xpPerCount, rawScore, scoreBeforeDailyCap, metricDailyCap });
  }

  const byMetric = new Map();
  let totalScore = 0;
  let totalRawScore = 0;
  let totalBeforeDailyCap = 0;
  let anyMetricCapApplied = false;
  let anyDailyCapApplied = false;
  const dailySummary = [];

  for (const [day, entries] of Array.from(byDay.entries()).sort((a,b) => String(a[0]).localeCompare(String(b[0])))) {
    const dayRaw = entries.reduce((sum, x) => sum + Number(x.rawScore || 0), 0);
    const dayBeforeDailyCap = entries.reduce((sum, x) => sum + Number(x.scoreBeforeDailyCap || 0), 0);
    const userDailyCap = userDailyXpCapForTotal(totalScore);
    const dayFactor = dayBeforeDailyCap > userDailyCap && dayBeforeDailyCap > 0 ? userDailyCap / dayBeforeDailyCap : 1;
    if (dayFactor < 1) anyDailyCapApplied = true;
    totalRawScore += dayRaw;
    totalBeforeDailyCap += dayBeforeDailyCap;
    const dayScore = dayBeforeDailyCap * dayFactor;
    dailySummary.push({
      day,
      count: entries.reduce((sum, x) => sum + Number(x.count || 0), 0),
      rawScore: roundScore(dayRaw),
      scoreBeforeDailyCap: roundScore(dayBeforeDailyCap),
      score: roundScore(dayScore),
      dailyCap: userDailyCap,
      dailyCapApplied: dayFactor < 1,
      dailyCapReached: dayBeforeDailyCap >= userDailyCap,
    });

    for (const x of entries) {
      const score = Number(x.scoreBeforeDailyCap || 0) * dayFactor;
      totalScore += score;
      if (x.rawScore > x.scoreBeforeDailyCap) anyMetricCapApplied = true;
      let agg = byMetric.get(x.metric);
      if (!agg) {
        agg = {
          metric: x.metric,
          count: 0,
          xpPerCount: x.xpPerCount,
          dailyCap: Number.isFinite(x.metricDailyCap) ? x.metricDailyCap : null,
          globalDailyCap: USER_DAILY_XP_CAP,
          rawScore: 0,
          scoreBeforeDailyCap: 0,
          score: 0,
          metricCapApplied: false,
          dailyCapApplied: false,
          dailyDetails: [],
        };
        byMetric.set(x.metric, agg);
      }
      agg.count += x.count;
      agg.rawScore += x.rawScore;
      agg.scoreBeforeDailyCap += x.scoreBeforeDailyCap;
      agg.score += score;
      if (!Array.isArray(agg.dailyDetails)) agg.dailyDetails = [];
      agg.dailyDetails.push({
        day,
        count: x.count,
        rawScore: roundScore(x.rawScore),
        scoreBeforeDailyCap: roundScore(x.scoreBeforeDailyCap),
        dayTotalBeforeDailyCap: roundScore(dayBeforeDailyCap),
        dayFactor: Number(dayFactor.toFixed(6)),
        globalDailyCap: USER_DAILY_XP_CAP,
        score: roundScore(score),
      });
      if (x.rawScore > x.scoreBeforeDailyCap) agg.metricCapApplied = true;
      if (dayFactor < 1) agg.dailyCapApplied = true;
    }
  }

  const breakdown = Array.from(byMetric.values()).map((r) => {
    const meta = activityMetricMeta(r.metric);
    return Object.assign({}, r, {
      label: meta.label,
      description: meta.description,
      category: meta.category,
      xpPerCount: meta.weight,
      rawScore: roundScore(r.rawScore),
      scoreBeforeDailyCap: roundScore(r.scoreBeforeDailyCap),
      score: roundScore(r.score),
    });
  }).filter((r) => isCurrentUserActivityMetric(r.metric) && (r.count !== 0 || r.score !== 0))
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0) || String(a.label || a.metric).localeCompare(String(b.label || b.metric)));

  return {
    totalScore: roundScore(totalScore),
    totalRawScore: roundScore(totalRawScore),
    totalBeforeDailyCap: roundScore(totalBeforeDailyCap),
    dailyCap: userDailyXpCapForTotal(totalScore || 0),
    metricCapApplied: anyMetricCapApplied,
    dailyCapApplied: anyDailyCapApplied,
    dailySummary: dailySummary.sort((a, b) => String(b.day || "").localeCompare(String(a.day || ""))),
    breakdown,
  };
}

function calculateXpFromTotalsRowsUncapped(rows) {
  const breakdown = (Array.isArray(rows) ? rows : []).map((r) => {
    const meta = activityMetricMeta(r.metric || "");
    const count = Number(r.count || 0);
    const score = scoreForActivityMetric(r.metric || "", count, r.score || 0);
    return {
      metric: meta.metric || String(r.metric || ""),
      label: meta.label,
      description: meta.description,
      category: meta.category,
      count,
      xpPerCount: meta.weight,
      dailyCap: meta.dailyCap,
      globalDailyCap: USER_DAILY_XP_CAP,
      rawScore: score,
      scoreBeforeDailyCap: score,
      score,
      legacyUncapped: true,
      updatedAt: Number(r.updated_at || 0),
    };
  }).filter((r) => isCurrentUserActivityMetric(r.metric) && (r.score !== 0 || r.count !== 0));
  const totalScore = roundScore(breakdown.reduce((sum, r) => sum + Number(r.score || 0), 0));
  return {
    totalScore,
    totalRawScore: roundScore(breakdown.reduce((sum, r) => sum + Number(r.rawScore || 0), 0)),
    totalBeforeDailyCap: roundScore(breakdown.reduce((sum, r) => sum + Number(r.scoreBeforeDailyCap || 0), 0)),
    dailyCap: userDailyXpCapForTotal(totalScore),
    metricCapApplied: false,
    dailyCapApplied: false,
    legacyUncapped: true,
    dailySummary: [],
    breakdown: breakdown.sort((a, b) => Number(b.score || 0) - Number(a.score || 0) || Number(b.updatedAt || 0) - Number(a.updatedAt || 0) || String(a.label || a.metric).localeCompare(String(b.label || b.metric))),
  };
}

function mergeXpCalculations(primary, legacy) {
  const a = primary || calculateXpFromDailyRows([]);
  const b = legacy || null;
  if (!b || !Array.isArray(b.breakdown) || !b.breakdown.length) return a;

  const byMetric = new Map();
  const addRows = (rows) => {
    for (const row of (Array.isArray(rows) ? rows : [])) {
      const m = activityMetric(row && row.metric || "");
      if (!m) continue;
      const meta = activityMetricMeta(m);
      let out = byMetric.get(m);
      if (!out) {
        out = {
          metric: m,
          label: meta.label,
          description: meta.description,
          category: meta.category,
          count: 0,
          xpPerCount: meta.weight,
          dailyCap: meta.dailyCap,
          globalDailyCap: USER_DAILY_XP_CAP,
          rawScore: 0,
          scoreBeforeDailyCap: 0,
          score: 0,
          metricCapApplied: false,
          dailyCapApplied: false,
          legacyUncapped: false,
          updatedAt: 0,
          dailyDetails: [],
        };
        byMetric.set(m, out);
      }
      out.count += Number(row.count || 0);
      out.rawScore += Number(row.rawScore != null ? row.rawScore : row.score || 0);
      out.scoreBeforeDailyCap += Number(row.scoreBeforeDailyCap != null ? row.scoreBeforeDailyCap : row.score || 0);
      out.score += Number(row.score || 0);
      out.metricCapApplied = !!(out.metricCapApplied || row.metricCapApplied);
      out.dailyCapApplied = !!(out.dailyCapApplied || row.dailyCapApplied);
      out.legacyUncapped = !!(out.legacyUncapped || row.legacyUncapped);
      out.updatedAt = Math.max(Number(out.updatedAt || 0), Number(row.updatedAt || 0));
      if (Array.isArray(row.dailyDetails) && row.dailyDetails.length) {
        if (!Array.isArray(out.dailyDetails)) out.dailyDetails = [];
        out.dailyDetails.push(...row.dailyDetails);
      }
    }
  };

  addRows(a.breakdown || []);
  addRows(b.breakdown || []);

  const breakdown = Array.from(byMetric.values()).map((r) => Object.assign({}, r, {
    rawScore: roundScore(r.rawScore),
    scoreBeforeDailyCap: roundScore(r.scoreBeforeDailyCap),
    score: roundScore(r.score),
  })).filter((r) => isCurrentUserActivityMetric(r.metric) && (r.count !== 0 || r.score !== 0))
    .sort((x, y) => Number(y.score || 0) - Number(x.score || 0) || String(x.label || x.metric).localeCompare(String(y.label || y.metric)));

  const totalScore = roundScore(Number(a.totalScore || 0) + Number(b.totalScore || 0));
  return {
    totalScore,
    totalRawScore: roundScore(Number(a.totalRawScore || 0) + Number(b.totalRawScore || 0)),
    totalBeforeDailyCap: roundScore(Number(a.totalBeforeDailyCap || 0) + Number(b.totalBeforeDailyCap || 0)),
    dailyCap: userDailyXpCapForTotal(totalScore),
    metricCapApplied: !!(a.metricCapApplied || b.metricCapApplied),
    dailyCapApplied: !!(a.dailyCapApplied || b.dailyCapApplied),
    legacyUncapped: !!(a.legacyUncapped || b.legacyUncapped),
    totalsReconciled: true,
    dailySummary: (Array.isArray(a.dailySummary) ? a.dailySummary : []).concat(Array.isArray(b.dailySummary) ? b.dailySummary : []),
    breakdown,
  };
}

async function getAccountEventFileXpCalculation(db, accountKey, opts = {}) {
  const key = String(accountKey || "").trim();
  if (!key) return null;
  let snap = null;
  try { snap = await readOrSeedAccountEventFileSnapshot(db, key); } catch (_) { snap = null; }
  const file = snap && snap.file ? normaliseAccountEventFile(snap.file) : normaliseAccountEventFile({ eventLog: [] });
  const eventFileEventCount = Array.isArray(file.eventLog) ? file.eventLog.length : 0;
  if (!eventFileEventCount) return null;

  const period = String(opts.period || "all");
  let startMs = 0;
  let endMs = Infinity;
  if (period !== "all") {
    const startDay = periodStart(period);
    startMs = Date.parse(`${startDay}T00:00:00Z`) || 0;
    if (period === "today") endMs = startMs + 86400 * 1000;
  }

  const xpRows = [];
  for (const ev of (file.eventLog || [])) {
    const row = accountEventFileEventToXpRow(ev, key);
    if (!row) continue;
    const ts = Number(row.created_at || 0);
    if (period !== "all" && (ts < startMs || ts >= endMs)) continue;
    xpRows.push(row);
  }
  const legacyCapBoostDays = await getCapBoostDaysForAccount(db, key, { period });
  const shopBoosts = accountFileShopBoostOptions(file, period);
  const capBoostDays = mergeCapBoostDayMaps(legacyCapBoostDays, shopBoosts.capBoostDays);
  const calc = applyAccountFileCompactBaseline(calculateXpFromEventRows(xpRows, { capBoostDays, xpBoostIntervals: shopBoosts.xpBoostIntervals, source: "account-event-file" }), file, period);
  return Object.assign({}, calc, {
    sourceEvents: true,
    source: "Cloud account event file",
    consistency: "XP is recomputed from the account event file. The same file is merged by every logged-in device and is used by /identity/xp and the user ranking.",
    eventFileEventCount,
    sourceRowCount: xpRows.length,
    eventFileStats: accountEventFileDerivedStats(file),
    eventFileUpdatedAt: snap && snap.updatedAt || 0,
    equippedCosmetics: shopEquippedCosmeticsFromAccountFile(file),
  });
}

async function getAccountXpCalculation(db, accountKey, opts = {}) {
  const key = String(accountKey || "").trim();
  if (!key) return calculateXpFromEventRows([]);
  const period = String(opts.period || "all");

  // The account event file is now the canonical account-sync source of truth.
  // It is the only object that every logged-in device downloads, merges and
  // uploads.  Prefer it for the Level panel and leaderboard; the old canonical
  // tables remain as a legacy/backfill fallback only when no account file exists.
  const fileCalc = await getAccountEventFileXpCalculation(db, key, { period }).catch(() => null);
  if (fileCalc && Number(fileCalc.eventFileEventCount || 0) > 0) return fileCalc;

  let where = "account_key = ?";
  const binds = [key];
  if (period !== "all") {
    const startDay = periodStart(period);
    const startMs = Date.parse(`${startDay}T00:00:00Z`) || 0;
    where += " AND created_at >= ?";
    binds.push(startMs);
    if (period === "today") {
      where += " AND created_at < ?";
      binds.push(startMs + 86400 * 1000);
    }
  }

  const events = await db.prepare(`
    SELECT id, metric, count, score, path, title, details_json, created_at
    FROM user_activity_events
    WHERE ${where}
    ORDER BY created_at ASC
  `).bind(...binds).all().catch(() => ({ results: [] }));

  const eventRows = events.results || [];
  if (eventRows.length || period !== "all") {
    const capBoostDays = await getCapBoostDaysForAccount(db, key, { period });
    return calculateXpFromEventRows(eventRows, { capBoostDays });
  }

  // Legacy fallback: very old accounts may only have aggregate totals and no
  // event stream. Never merge this with event-based XP, because that would double-count.
  const totals = await db.prepare(`
    SELECT metric, count, ${userActivityScoreSqlExpr("")} AS score, updated_at
    FROM user_activity_totals
    WHERE account_key = ?
  `).bind(key).all().catch(() => ({ results: [] }));
  const totalRows = totals.results || [];
  return totalRows.length ? calculateXpFromTotalsRowsUncapped(totalRows) : calculateXpFromEventRows([]);
}

async function getAllUserXpCalculations(db, period) {
  const p = String(period || "all");
  let where = "1=1";
  const binds = [];
  if (p !== "all") {
    const startDay = periodStart(p);
    const startMs = Date.parse(`${startDay}T00:00:00Z`) || 0;
    where = "created_at >= ?";
    binds.push(startMs);
    if (p === "today") {
      where += " AND created_at < ?";
      binds.push(startMs + 86400 * 1000);
    }
  }
  const rows = await db.prepare(`
    SELECT account_key, id, metric, count, score, path, title, details_json, created_at
    FROM user_activity_events
    WHERE ${where}
    ORDER BY account_key, created_at ASC
  `).bind(...binds).all().catch(() => ({ results: [] }));

  const byAccount = new Map();
  for (const r of (rows.results || [])) {
    const key = String(r.account_key || "");
    if (!key) continue;
    if (!byAccount.has(key)) byAccount.set(key, []);
    byAccount.get(key).push(r);
  }
  const out = new Map();
  for (const [key, accountRows] of byAccount.entries()) {
    const capBoostDays = await getCapBoostDaysForAccount(db, key, { period: p });
    out.set(key, calculateXpFromEventRows(accountRows, { capBoostDays }));
  }

  // Legacy fallback: include totals-only old accounts in all-time ranking, but
  // never use totals for accounts that already have canonical events.
  if (p === "all") {
    const totals = await db.prepare(`
      SELECT account_key, metric, count, ${userActivityScoreSqlExpr("")} AS score, updated_at
      FROM user_activity_totals
    `).all().catch(() => ({ results: [] }));
    const legacyByAccount = new Map();
    for (const r of (totals.results || [])) {
      const key = String(r.account_key || "");
      if (!key || out.has(key)) continue;
      if (!legacyByAccount.has(key)) legacyByAccount.set(key, []);
      legacyByAccount.get(key).push(r);
    }
    for (const [key, totalRows] of legacyByAccount.entries()) out.set(key, calculateXpFromTotalsRowsUncapped(totalRows));
  }

  // New local-file-first accounts may have already uploaded a cloud account
  // event file, while the canonical user_activity_events table is still empty
  // for that account.  Use the account event file as a ranking fallback so the
  // public leaderboard does not show only the current browser's locally patched
  // user row.
  const fileFallback = await getAllAccountEventFileXpCalculations(db, p, out).catch(() => new Map());
  for (const [key, calc] of fileFallback.entries()) {
    if (!key || !calc) continue;
    // Ranking must use the same source as /identity/xp.  If an account event file
    // exists, it wins over legacy aggregate rows and older canonical rows, which
    // prevents the leaderboard from showing a different XP total than the profile.
    out.set(key, calc);
  }

  return out;
}

function dailyScoreMapFromSummary(rows) {
  const out = new Map();
  for (const row of (Array.isArray(rows) ? rows : [])) {
    const day = String(row && row.day || "").slice(0, 10);
    if (!day) continue;
    const score = Number(row && row.score || 0);
    if (!Number.isFinite(score) || score <= 0) continue;
    out.set(day, roundScore(Math.max(Number(out.get(day) || 0), score)));
  }
  return out;
}

function mergeDailyScoreFloor(target, rows) {
  const map = target instanceof Map ? target : new Map();
  for (const row of (Array.isArray(rows) ? rows : [])) {
    const day = String(row && row.day || "").slice(0, 10);
    if (!day) continue;
    const score = Number(row && row.score || 0);
    if (!Number.isFinite(score) || score <= 0) continue;
    map.set(day, roundScore(Math.max(Number(map.get(day) || 0), score)));
  }
  return map;
}

function userRankingPeriodScoreFromDailyScores(dailyScores, period) {
  const p = String(period || "all");
  if (!(dailyScores instanceof Map) || !dailyScores.size || p === "all") return 0;
  const start = periodStart(p);
  const end = todayUTC();
  let total = 0;
  for (const [day, score] of dailyScores.entries()) {
    const d = String(day || "").slice(0, 10);
    if (!d || d < start || d > end) continue;
    total += Number(score || 0);
  }
  return roundScore(total);
}

function userRankingProjectionFromCalc(calc, source) {
  const c = calc && typeof calc === "object" ? calc : calculateXpFromEventRows([]);
  return {
    totalScore: roundScore(c.totalScore || 0),
    dailyScores: dailyScoreMapFromSummary(c.dailySummary || []),
    equippedCosmetics: c.equippedCosmetics || {},
    source: source || c.source || "",
    calc: c,
  };
}

function userRankingDailyObject(dailyScores) {
  const out = {};
  if (dailyScores instanceof Map) {
    for (const [day, score] of dailyScores.entries()) {
      const d = String(day || "").slice(0, 10);
      const n = Number(score || 0);
      if (d && Number.isFinite(n) && n > 0) out[d] = roundScore(n);
    }
  }
  return out;
}

function userRankingDailyMapFromStored(value) {
  const map = new Map();
  const obj = typeof value === "string" ? parseJsonObjectSafe(value) : (value && typeof value === "object" ? value : {});
  Object.entries(obj || {}).forEach(([day, score]) => {
    const d = String(day || "").slice(0, 10);
    const n = Number(score || 0);
    if (d && Number.isFinite(n) && n > 0) map.set(d, roundScore(n));
  });
  return map;
}

function userRankingProjectionFromFile(file, calc) {
  const projection = userRankingProjectionFromCalc(calc, "Cloud account event file projection");
  projection.equippedCosmetics = shopEquippedCosmeticsFromAccountFile(file);
  projection.eventFileEventCount = (file && file.eventLog || []).length;
  projection.sourceRowCount = Array.isArray(calc && calc.sourceRows) ? calc.sourceRows.length : 0;
  projection.eventFileStats = accountEventFileDerivedStats(file);
  return projection;
}

async function writeUserRankingProjection(db, accountKey, projection, updatedAt) {
  const key = identityNameKey(accountKey || "");
  if (!key || !projection) return;
  const dailyJson = JSON.stringify(userRankingDailyObject(projection.dailyScores)).slice(0, 30000);
  const equippedJson = JSON.stringify(projection.equippedCosmetics && typeof projection.equippedCosmetics === "object" ? projection.equippedCosmetics : {}).slice(0, 8000);
  const source = `${USER_RANKING_PROJECTION_VERSION}:${String(projection.source || "").slice(0, 100)}`;
  await db.prepare(`
    INSERT INTO user_ranking_projection (account_key, total_score, daily_json, equipped_json, source, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_key) DO UPDATE SET
      total_score = excluded.total_score,
      daily_json = excluded.daily_json,
      equipped_json = excluded.equipped_json,
      source = excluded.source,
      updated_at = excluded.updated_at
  `).bind(key, roundScore(projection.totalScore || 0), dailyJson, equippedJson, source, Number(updatedAt || Date.now()) || Date.now()).run().catch(() => {});
}

async function updateUserRankingProjectionFromCalc(db, accountKey, calc, source) {
  await writeUserRankingProjection(db, accountKey, userRankingProjectionFromCalc(calc, source || "Canonical XP projection"), Date.now());
}

async function updateUserRankingProjectionFromFile(db, accountKey, file) {
  const key = identityNameKey(accountKey || "");
  const f = normaliseAccountEventFile(file || {});
  if (!key || !f) return;
  const xpRows = [];
  for (const ev of (f.eventLog || [])) {
    const row = accountEventFileEventToXpRow(ev, key);
    if (row) xpRows.push(row);
  }
  const legacyCapBoostDays = await getCapBoostDaysForAccount(db, key, { period: "all" });
  const shopBoosts = accountFileShopBoostOptions(f, "all");
  const capBoostDays = mergeCapBoostDayMaps(legacyCapBoostDays, shopBoosts.capBoostDays);
  let calc = calculateXpFromEventRows(xpRows, {
    capBoostDays,
    xpBoostIntervals: shopBoosts.xpBoostIntervals,
    source: "account-event-file-ranking-projection"
  });
  calc.sourceRows = xpRows;
  calc = applyAccountFileCompactBaseline(calc, f, "all");
  const projection = userRankingProjectionFromFile(f, calc);
  await writeUserRankingProjection(db, key, projection, f.updatedAt || Date.now());
  return projection;
}

async function getSqlUserRankingFallback(db, period) {
  const out = new Map();
  const rows = await db.prepare(`
    SELECT account_key, id, metric, count, path, title, details_json, created_at
    FROM user_activity_events
    WHERE account_key IS NOT NULL AND account_key != ''
    ORDER BY account_key, created_at ASC
  `).all().catch(() => ({ results: [] }));
  const byAccount = new Map();
  for (const r of (rows.results || [])) {
    const key = String(r && r.account_key || "").trim();
    if (!key) continue;
    if (!byAccount.has(key)) byAccount.set(key, []);
    byAccount.get(key).push(r);
  }
  for (const [key, accountRows] of byAccount.entries()) {
    const capBoostDays = await getCapBoostDaysForAccount(db, key, { period: "all" });
    const calc = calculateXpFromEventRows(accountRows, { capBoostDays, source: "canonical-user-activity-events-ranking-fallback" });
    if (Number(calc.totalScore || 0) <= 0) continue;
    out.set(key, {
      totalScore: roundScore(calc.totalScore || 0),
      dailyScores: dailyScoreMapFromSummary(calc.dailySummary || []),
      equippedCosmetics: {},
      source: `${USER_RANKING_PROJECTION_VERSION}:canonical user_activity_events fallback`,
      sqlUpdatedAt: accountRows.reduce((mx, r) => Math.max(mx, Number(r && r.created_at || 0) || 0), 0),
    });
  }
  return out;
}

// Among an account's active snapshot chunk rows (possibly from >1 duplicate-active
// snapshot), keep only the single best snapshot_id's chunks so the bulk leaderboard
// reads never assemble a mixed/corrupt file. Mirrors resolveActiveAccountSnapshot.
function pickBestSnapshotChunks(chunks) {
  const list = Array.isArray(chunks) ? chunks : [];
  const bySnap = new Map();
  for (const r of list) {
    const sid = String(r && r.snapshot_id == null ? "" : r.snapshot_id);
    if (!bySnap.has(sid)) bySnap.set(sid, []);
    bySnap.get(sid).push(r);
  }
  if (bySnap.size <= 1) return list;
  let best = null;
  for (const [, rowsForSnap] of bySnap.entries()) {
    const chunkCount = Math.max(0, ...rowsForSnap.map((r) => Number(r.chunk_count || 0) || 0));
    const have = new Set(rowsForSnap.map((r) => Number(r.chunk_index)));
    const cand = { rows: rowsForSnap, chunkCount, complete: !!chunkCount && have.size >= chunkCount, updatedAt: Math.max(0, ...rowsForSnap.map((r) => Number(r.updated_at || 0) || 0)) };
    if (!best) { best = cand; continue; }
    if (cand.complete !== best.complete) { if (cand.complete) best = cand; continue; }
    if (cand.chunkCount !== best.chunkCount) { if (cand.chunkCount > best.chunkCount) best = cand; continue; }
    if (cand.updatedAt > best.updatedAt) best = cand;
  }
  return best ? best.rows : list;
}

async function getAllAccountEventFiles(db) {
  const versionRows = await db.prepare(`
    SELECT account_key, snapshot_id, chunk_index, chunk_count, data_json, updated_at
    FROM account_event_file_snapshot_versions
    WHERE active = 1
    ORDER BY account_key, snapshot_id, chunk_index ASC
  `).all().catch(() => ({ results: [] }));
  const versionList = Array.isArray(versionRows && versionRows.results) ? versionRows.results : [];
  const versionedAccounts = new Set(versionList.map((r) => String(r && r.account_key || "").trim()).filter(Boolean));
  const legacyRows = await db.prepare(`
    SELECT account_key, '' AS snapshot_id, chunk_index, chunk_count, data_json, updated_at
    FROM account_event_file_snapshot_chunks
    ORDER BY account_key, chunk_index ASC
  `).all().catch(() => ({ results: [] }));
  const rows = versionList.concat((Array.isArray(legacyRows && legacyRows.results) ? legacyRows.results : []).filter((r) => !versionedAccounts.has(String(r && r.account_key || "").trim())));
  const grouped = new Map();
  for (const r of rows) {
    const key = String(r.account_key || "").trim();
    if (!key) continue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(r);
  }

  const out = new Map();
  for (const [key, rawChunks] of grouped.entries()) {
    const chunks = pickBestSnapshotChunks(rawChunks);
    const maxCount = Math.max(...chunks.map((r) => Math.max(0, Number(r.chunk_count || 0) || 0)));
    if (!maxCount || chunks.length < maxCount) continue;
    let text = "";
    let ok = true;
    for (let i = 0; i < maxCount; i += 1) {
      const row = chunks.find((r) => Number(r.chunk_index) === i);
      if (!row) { ok = false; break; }
      text += String(row.data_json || "");
    }
    if (!ok || !text) continue;
    try {
      out.set(key, {
        file: normaliseAccountEventFile(JSON.parse(text)),
        updatedAt: Math.max(...chunks.map((r) => Number(r.updated_at || 0) || 0)),
      });
    } catch (_) {}
  }
  return out;
}

// Persist the total the user's own client computed (events-only xpFromFile), so
// the leaderboard "Total XP" equals their account panel. Written on sync only.
async function writeClientRankingTotal(db, accountKey, totalScore) {
  const key = identityNameKey(accountKey || "");
  const n = Number(totalScore);
  if (!key || !Number.isFinite(n) || n < 0) return;
  await db.prepare(`
    INSERT INTO account_client_ranking_total (account_key, total_score, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(account_key) DO UPDATE SET
      total_score = excluded.total_score,
      updated_at = excluded.updated_at
  `).bind(key, roundScore(n), Date.now()).run().catch(() => {});
}

async function getClientRankingTotals(db) {
  const map = new Map();
  const rows = await db.prepare(`SELECT account_key, total_score FROM account_client_ranking_total WHERE total_score > 0`).all().catch(() => ({ results: [] }));
  for (const r of (rows.results || [])) {
    const key = String(r && r.account_key || "").trim();
    if (key) map.set(key, roundScore(r && r.total_score || 0));
  }
  return map;
}

async function getAllUserXpRankingProjections(db, period, options) {
  const opts = options && typeof options === "object" ? options : {};
  const out = new Map();
  const rows = await db.prepare(`
    SELECT account_key, total_score, daily_json, equipped_json, source, updated_at
    FROM user_ranking_projection
    WHERE total_score > 0 AND source LIKE ?
  `).bind(`${USER_RANKING_PROJECTION_VERSION}:%`).all().catch(() => ({ results: [] }));
  for (const r of (rows.results || [])) {
    const key = String(r && r.account_key || "").trim();
    if (!key) continue;
    out.set(key, {
      totalScore: roundScore(r && r.total_score || 0),
      dailyScores: userRankingDailyMapFromStored(r && r.daily_json || "{}"),
      equippedCosmetics: parseJsonObjectSafe(r && r.equipped_json || "{}"),
      source: String(r && r.source || "stored projection"),
      updatedAt: Number(r && r.updated_at || 0) || 0,
    });
  }

  if (!opts.skipSqlFallback) {
    const fallback = await getSqlUserRankingFallback(db, period || "all").catch(() => new Map());
    for (const [key, row] of fallback.entries()) {
      if (!key || !row) continue;
      if (!out.has(key)) out.set(key, row);
    }
  }

  // PREFER the client-reported total for the displayed "Total XP" so it matches
  // each user's own account panel. The per-period daily breakdown (dailyScores)
  // is left as the server projection; only the all-time total is overridden.
  const clientTotals = await getClientRankingTotals(db).catch(() => new Map());
  for (const [key, total] of clientTotals.entries()) {
    if (out.has(key)) out.get(key).totalScore = total;
    else out.set(key, { totalScore: total, dailyScores: new Map(), equippedCosmetics: {}, source: "client-reported total", updatedAt: Date.now() });
  }

  return out;
}

function isAccountScoreBaselineFileEvent(ev) {
  const e = ev && typeof ev === "object" ? ev : {};
  const d = e.details && typeof e.details === "object" ? e.details : {};
  const metric = String(e.metric || d.metric || e.type || "").trim().toLowerCase();
  return metric === "account_score_baseline" || metric === "account_currency_baseline" || e.type === "account_score_baseline";
}

function accountScoreBaselineFileXp(ev) {
  const e = ev && typeof ev === "object" ? ev : {};
  const d = e.details && typeof e.details === "object" ? e.details : {};
  const raw = d.xpDelta != null ? d.xpDelta : (d.scoreDelta != null ? d.scoreDelta : (d.totalScoreDelta != null ? d.totalScoreDelta : (e.score != null ? e.score : 0)));
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function accountScoreBaselineFileSourceCount(ev) {
  const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
  const n = Number(d.sourceEventCount || d.canonicalEventCount || 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function accountScoreBaselineFileCompactCount(ev) {
  const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
  const n = Number(d.compactEventCount || d.cachedEventCount || 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function accountScoreBaselineFileApplies(ev, nonBaselineEventCount) {
  if (!isAccountScoreBaselineFileEvent(ev)) return false;
  const sourceCount = accountScoreBaselineFileSourceCount(ev);
  const count = Math.max(0, Number(nonBaselineEventCount || 0) || 0);
  // Mirror the client (track-views.js accountScoreBaselineApplies): a compact
  // baseline must keep preserving the dropped events' XP/EORbits even after new
  // activity accumulates, and is only redundant once the full ORIGINAL ledger has
  // genuinely been recovered. The previous compactCount+buffer heuristic dropped
  // it as soon as new activity arrived, which made the server-side XP for a
  // compacted account collapse (and disagree with the device's own value).
  if (sourceCount && count >= Math.max(0, sourceCount - 1)) return false;
  return true;
}

function accountScoreBaselineFileCanonicalScore(ev) {
  const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
  const raw = d.canonicalTotalScore != null ? d.canonicalTotalScore
    : (d.totalScore != null ? d.totalScore
    : (d.v2TotalScore != null ? d.v2TotalScore : null));
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// VALIDATED IDEMPOTENT CONTRIBUTION (not an additive sum, and not a blind floor).
// The old code SUMMED every baseline delta, so each multi-device sync re-added a
// device's XP (runaway inflation). A naive "max canonicalTotalScore floor" then
// faithfully honored a STALE/POISONED absolute written during the additive era
// (e.g. a baseline claiming canonicalTotalScore 4473 when the real ledger is ~730),
// pinning the account far too high. A legitimate compact baseline preserves only
// the XP of events dropped from a LOCAL cache: canonical ≈ compactScore + xpDelta,
// and the events still present already include the non-dropped portion, so a valid
// canonical must lie within [eventsTotal, eventsTotal + xpDelta]; a valid dropped
// delta cannot exceed the full total. We therefore validate each baseline against
// the events-computed total and take the single largest VALID contribution. Any
// baseline outside the plausible band is ignored, so events stay authoritative.
function accountFileCompactBaselineContribution(file, eventsTotal) {
  const events = Array.isArray(file && file.eventLog) ? file.eventLog : [];
  const nonBaselineCount = events.filter((ev) => !isAccountScoreBaselineFileEvent(ev)).length;
  const base = Math.max(0, Number(eventsTotal || 0));
  let best = 0;
  for (const ev of events) {
    if (!accountScoreBaselineFileApplies(ev, nonBaselineCount)) continue;
    const xpDelta = Math.max(0, accountScoreBaselineFileXp(ev));
    const canonical = accountScoreBaselineFileCanonicalScore(ev);
    const canonicalContribution = (canonical > base && canonical <= base + xpDelta + 1) ? (canonical - base) : 0;
    const deltaContribution = (xpDelta > 0 && xpDelta <= base + 1) ? xpDelta : 0;
    const contribution = Math.max(canonicalContribution, deltaContribution);
    if (contribution > best) best = contribution;
  }
  return roundScore(Math.max(0, best));
}

function accountFileCompactBaselineScore(file, period) {
  // Lenient truthiness only ("does any baseline preserve XP?", used so a file with
  // just a baseline + cosmetics is not dropped). The DISPLAYED value uses the
  // validated contribution in applyAccountFileCompactBaseline.
  if (String(period || "all") !== "all") return 0;
  const events = Array.isArray(file && file.eventLog) ? file.eventLog : [];
  const nonBaselineCount = events.filter((ev) => !isAccountScoreBaselineFileEvent(ev)).length;
  let best = 0;
  for (const ev of events) {
    if (!accountScoreBaselineFileApplies(ev, nonBaselineCount)) continue;
    best = Math.max(best, accountScoreBaselineFileCanonicalScore(ev), Math.max(0, accountScoreBaselineFileXp(ev)));
  }
  return roundScore(best);
}

function accountFileScoreState(file) {
  return file && file.scoreState && typeof file.scoreState === "object" && !Array.isArray(file.scoreState) ? file.scoreState : null;
}

function accountFileScoreStateTotal(file) {
  const st = accountFileScoreState(file);
  if (!st) return 0;
  const raw = st.totalScore != null ? st.totalScore : (st.totalXp != null ? st.totalXp : (st.score != null ? st.score : 0));
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? roundScore(n) : 0;
}

function accountFileScoreStateUpdatedAt(file) {
  const st = accountFileScoreState(file);
  const n = Number(st && (st.updatedAt || st.lastFullRebuildAt || st.cachedAt || st.lastSyncedAt) || file && file.updatedAt || 0);
  return Number.isFinite(n) && n > 0 ? n : Date.now();
}

function cleanAccountFileScoreStateDailyBucket(row, day) {
  const src = row && typeof row === "object" && !Array.isArray(row) ? row : {};
  const d = String(src.day || day || "").slice(0, 10);
  const score = Number(src.score != null ? src.score : (src.total != null ? src.total : 0));
  return {
    day: d,
    score: Number.isFinite(score) ? roundScore(score) : 0,
    rawScore: roundScore(src.rawScore || 0),
    scoreBeforeDailyCap: roundScore(src.scoreBeforeDailyCap || 0),
    count: roundScore(src.count || 0),
    currencyEarned: roundScore(src.currencyEarned != null ? src.currencyEarned : src.currency || 0),
    currencySpent: roundScore(src.currencySpent || 0),
    currencyCredited: roundScore(src.currencyCredited || 0)
  };
}

function accountFileScoreStateDailyRows(file) {
  const st = accountFileScoreState(file);
  if (!st) return [];
  const byDay = new Map();
  const add = (day, row) => {
    const clean = cleanAccountFileScoreStateDailyBucket(row, day);
    if (!clean.day) return;
    byDay.set(clean.day, clean);
  };
  if (st.dailyBuckets && typeof st.dailyBuckets === "object" && !Array.isArray(st.dailyBuckets)) {
    Object.entries(st.dailyBuckets).forEach(([day, row]) => add(day, row));
  }
  if (Array.isArray(st.dailySummary)) st.dailySummary.forEach((row) => add(row && row.day, row));
  return Array.from(byDay.values()).sort((a, b) => String(a.day).localeCompare(String(b.day)));
}

async function gunzipBase64Text(value) {
  const raw = String(value || "");
  if (!raw) return "";
  let binary = "";
  try { binary = atob(raw); } catch (_) { return ""; }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  if (typeof DecompressionStream !== "function") return "";
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return await new Response(stream).text();
}

function addAccountFileScorePatch(calc, amount, patch) {
  const delta = roundScore(Number(amount || 0));
  if (!delta) return calc;
  const meta = patch && typeof patch === "object" ? patch : {};
  const out = Object.assign({}, calc || {});
  out.totalScore = roundScore(Number(out.totalScore || 0) + delta);
  out.totalRawScore = roundScore(Number(out.totalRawScore || 0) + delta);
  out.totalRepeatAdjustedScore = roundScore(Number(out.totalRepeatAdjustedScore || 0) + delta);
  out.totalBeforeDailyCap = roundScore(Number(out.totalBeforeDailyCap || 0) + delta);
  out.dailyCap = userDailyXpCapForTotal(out.totalScore || 0);
  if (meta.key) out[meta.key] = delta;
  out.breakdown = (Array.isArray(out.breakdown) ? out.breakdown : []).concat([{
    metric: meta.metric || "account_score_baseline",
    label: meta.label || "Compact cache baseline",
    description: meta.description || "XP preserved from compacted account history.",
    category: "Account",
    count: 1,
    xpPerCount: 0,
    dailyCap: null,
    globalDailyCap: USER_DAILY_XP_CAP,
    repeatPercent: null,
    rawScore: delta,
    repeatAdjustedScore: delta,
    scoreBeforeDailyCap: delta,
    score: delta,
    metricCapApplied: false,
    dailyCapApplied: false,
    repeatDiscountApplied: false,
    updatedAt: Number(meta.updatedAt || Date.now()),
    dailyDetails: []
  }]);
  return out;
}

function applyAccountFileCompactBaseline(calc, file, period) {
  // EVENTS ARE THE SINGLE SOURCE OF TRUTH. Compact baselines are now ignored for
  // the authoritative cloud score. An additive-era baseline's canonicalTotalScore
  // AND xpDelta were inflated together (internally consistent), so no validation
  // could distinguish it from a legitimate one — it kept poisoning the account
  // (e.g. 4473 / 1384 when the real ledger is ~730). The cloud retains the full
  // event union, so recomputing from events alone gives the correct, consistent,
  // poison-proof value for every device. (The client xpFromFile matches this.)
  void file; void period;
  return calc;
}

function accountEventFileEventToXpRow(ev, accountKey) {
  if (!ev || typeof ev !== "object") return null;
  const metric = activityMetric(ev.metric || "");
  if (!metric || !USER_ACTIVITY_RULES[metric]) return null;
  const ts = normaliseTimestamp(ev.ts || ev.createdAt || ev.created_at || 0) || Date.now();
  const path = normalizePath(ev.path || "");
  const details = Object.assign({}, ev.details && typeof ev.details === "object" ? ev.details : {});
  if (ev.action && details.action == null) details.action = String(ev.action || "");
  if (typeof ev.active === "boolean" && details.active == null) details.active = ev.active;
  if (ev.value != null && details.value == null) details.value = ev.value;
  if (metric === "mastery" && details.mastery == null && details.m == null && details.level == null && ev.value != null) details.mastery = ev.value;
  if (metric === "ai_quiz") {
    if (details.completed == null) details.completed = true;
    if (details.resultProduced == null) details.resultProduced = true;
    if (details.resultId == null && ev.id) details.resultId = String(ev.id);
    if (details.completedAt == null) details.completedAt = ts;
  }
  return {
    id: String(ev.id || `file:${accountKey}:${metric}:${path}:${ts}`).slice(0, 220),
    account_key: accountKey,
    metric,
    // In the rewritten sync model, the event file itself is the source of truth.
    // A page_action_set is therefore the XP event for saving/unsaving state; older
    // direct canonical rows are ignored when an account event file exists.
    count: Math.max(0, Number(ev.count || 1) || 1),
    score: null,
    path,
    title: cleanTitle(ev.title || details.title || "", path),
    details_json: JSON.stringify(details).slice(0, 30000),
    created_at: ts
  };
}

function shopEquippedCosmeticsFromAccountFile(file) {
  const owned = new Set();
  const equipped = {};
  const events = Array.isArray(file && file.eventLog) ? file.eventLog.slice() : [];
  events.sort((a,b) => Number(a && a.ts || 0) - Number(b && b.ts || 0));
  for (const ev of events) {
    const metric = String(ev && (ev.metric || ev.type) || "");
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const itemId = String(d.itemId || d.item_id || ev.itemId || "").trim();
    if (!itemId) continue;
    if (metric === "shop_purchase" || metric === "shop_gift_received") owned.add(itemId);
    if (metric === "shop_refund" || metric === "shop_revoke") owned.delete(itemId);
    if (metric === "shop_equip") {
      const slot = String(d.slot || ev.slot || "").trim();
      if (slot) equipped[slot] = itemId;
    }
  }
  Object.keys(equipped).forEach((slot) => { if (!owned.has(equipped[slot])) delete equipped[slot]; });
  return equipped;
}

// --- Dynamic shop pricing (global demand) ----------------------------------
// Gentle market model: each global purchase adds ~8% to an item's price, the
// accumulated demand decays ~10% per idle day, and the multiplier is capped at
// 2x. The original price stays the floor (the client never charges below it
// except for the daily discount). Demand is aggregated dedup-safely from the
// per-account event files at sync time: we remember how many of each item every
// account has purchased, so re-syncing the same file never double counts.
const SHOP_DEMAND_PER_PURCHASE = 0.08;
const SHOP_DEMAND_DECAY_PER_DAY = 0.9;
const SHOP_DEMAND_MAX_MULTIPLIER = 2;

function shopPurchaseCountsFromEventFile(file) {
  const counts = {};
  const events = Array.isArray(file && file.eventLog) ? file.eventLog : [];
  for (const ev of events) {
    const metric = String(ev && (ev.metric || ev.type) || "");
    if (metric !== "shop_purchase") continue;
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const itemId = String(d.itemId || d.item_id || ev.itemId || "").trim();
    if (!itemId) continue;
    counts[itemId] = (counts[itemId] || 0) + 1;
  }
  return counts;
}

function shopDemandDayDiff(fromDay, toDay) {
  const a = Date.parse(String(fromDay || "") + "T00:00:00Z");
  const b = Date.parse(String(toDay || "") + "T00:00:00Z");
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.max(0, Math.round((b - a) / 86400000));
}

function decayShopDemand(demand, updatedDay, today) {
  const d = Math.max(0, Number(demand) || 0);
  if (!d) return 0;
  const days = shopDemandDayDiff(updatedDay, today);
  return days > 0 ? d * Math.pow(SHOP_DEMAND_DECAY_PER_DAY, days) : d;
}

function shopMultiplierFromDemand(demand) {
  const m = 1 + SHOP_DEMAND_PER_PURCHASE * Math.max(0, Number(demand) || 0);
  return Math.min(SHOP_DEMAND_MAX_MULTIPLIER, Math.max(1, m));
}

async function updateShopDemandForAccount(db, accountKey, file) {
  try {
    if (!db || !accountKey || !file) return;
    const counts = shopPurchaseCountsFromEventFile(file);
    const today = dayUTCFromTimestamp(Date.now());
    const prevRows = await db.prepare(`SELECT item_id, count FROM shop_account_item_counts WHERE account_key = ?`).bind(accountKey).all().catch(() => ({ results: [] }));
    const prev = new Map((prevRows.results || []).map((r) => [String(r.item_id), Number(r.count) || 0]));
    const itemIds = new Set([...Object.keys(counts), ...prev.keys()]);
    for (const itemId of itemIds) {
      const count = Number(counts[itemId] || 0);
      const before = prev.get(itemId) || 0;
      const delta = count - before;
      if (delta > 0) {
        const dRow = await db.prepare(`SELECT demand, updated_day FROM shop_item_demand WHERE item_id = ?`).bind(itemId).first().catch(() => null);
        const decayed = dRow ? decayShopDemand(dRow.demand, String(dRow.updated_day || ""), today) : 0;
        await db.prepare(`
          INSERT INTO shop_item_demand (item_id, demand, updated_day) VALUES (?, ?, ?)
          ON CONFLICT(item_id) DO UPDATE SET demand = excluded.demand, updated_day = excluded.updated_day
        `).bind(itemId, decayed + delta, today).run().catch(() => {});
      }
      if (count !== before) {
        await db.prepare(`
          INSERT INTO shop_account_item_counts (account_key, item_id, count) VALUES (?, ?, ?)
          ON CONFLICT(account_key, item_id) DO UPDATE SET count = excluded.count
        `).bind(accountKey, itemId, count).run().catch(() => {});
      }
    }
  } catch (_) {}
}

async function handleGetShopDynamicPrices(req, env, url) {
  const today = dayUTCFromTimestamp(Date.now());
  const out = {};
  try {
    const rows = await env.DB.prepare(`SELECT item_id, demand, updated_day FROM shop_item_demand`).all().catch(() => ({ results: [] }));
    for (const r of (rows.results || [])) {
      const itemId = String(r && r.item_id || "").trim();
      if (!itemId) continue;
      const demand = decayShopDemand(r.demand, String(r.updated_day || ""), today);
      const mult = shopMultiplierFromDemand(demand);
      if (mult > 1.0000001) out[itemId] = Math.round(mult * 1000) / 1000;
    }
  } catch (_) {}
  return json({ ok: true, day: today, multipliers: out }, 200, req, env);
}

async function getAllAccountEventFileXpCalculations(db, period, existingMap) {
  const versionRows = await db.prepare(`
    SELECT account_key, snapshot_id, chunk_index, chunk_count, data_json, updated_at
    FROM account_event_file_snapshot_versions
    WHERE active = 1
    ORDER BY account_key, snapshot_id, chunk_index ASC
  `).all().catch(() => ({ results: [] }));
  const versionList = Array.isArray(versionRows && versionRows.results) ? versionRows.results : [];
  const versionedAccounts = new Set(versionList.map((r) => String(r && r.account_key || "").trim()).filter(Boolean));
  const legacyRows = await db.prepare(`
    SELECT account_key, '' AS snapshot_id, chunk_index, chunk_count, data_json, updated_at
    FROM account_event_file_snapshot_chunks
    ORDER BY account_key, chunk_index ASC
  `).all().catch(() => ({ results: [] }));
  const rows = versionList.concat((Array.isArray(legacyRows && legacyRows.results) ? legacyRows.results : []).filter((r) => !versionedAccounts.has(String(r && r.account_key || "").trim())));
  const grouped = new Map();
  for (const r of rows) {
    const key = String(r.account_key || "").trim();
    if (!key) continue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(r);
  }
  const p = String(period || "all");
  let startMs = 0;
  let endMs = Infinity;
  if (p !== "all") {
    const startDay = periodStart(p);
    startMs = Date.parse(`${startDay}T00:00:00Z`) || 0;
    if (p === "today") endMs = startMs + 86400 * 1000;
  }

  const out = new Map();
  for (const [key, rawChunks] of grouped.entries()) {
    const chunks = pickBestSnapshotChunks(rawChunks);
    const maxCount = Math.max(...chunks.map((r) => Math.max(0, Number(r.chunk_count || 0) || 0)));
    if (!maxCount || chunks.length < maxCount) continue;
    let text = "";
    let ok = true;
    for (let i = 0; i < maxCount; i += 1) {
      const row = chunks.find((r) => Number(r.chunk_index) === i);
      if (!row) { ok = false; break; }
      text += String(row.data_json || "");
    }
    if (!ok || !text) continue;
    let file = null;
    try { file = normaliseAccountEventFile(JSON.parse(text)); } catch (_) { continue; }
    const xpRows = [];
    for (const ev of (file.eventLog || [])) {
      const row = accountEventFileEventToXpRow(ev, key);
      if (!row) continue;
      const ts = Number(row.created_at || 0);
      if (p !== "all" && (ts < startMs || ts >= endMs)) continue;
      xpRows.push(row);
    }
    const equippedCosmetics = shopEquippedCosmeticsFromAccountFile(file);
    const hasEquippedCosmetics = equippedCosmetics && typeof equippedCosmetics === "object" && Object.keys(equippedCosmetics).length > 0;
    const baselineScore = accountFileCompactBaselineScore(file, p);
    if (!xpRows.length && !baselineScore) {
      // A cosmetic equip can be the only new event in the account file.  In that
      // case we must still overlay the public visual state on top of the existing
      // ranking calculation instead of dropping the file as "no XP data".
      const existing = existingMap && typeof existingMap.get === "function" ? existingMap.get(key) : null;
      if (hasEquippedCosmetics && existing) {
        out.set(key, Object.assign({}, existing, {
          sourceEvents: true,
          source: existing.source || "Cloud account event file cosmetics overlay",
          eventFileEventCount: (file.eventLog || []).length,
          sourceRowCount: 0,
          eventFileStats: accountEventFileDerivedStats(file),
          equippedCosmetics
        }));
      }
      continue;
    }
    const legacyCapBoostDays = await getCapBoostDaysForAccount(db, key, { period: p });
    const shopBoosts = accountFileShopBoostOptions(file, p);
    const capBoostDays = mergeCapBoostDayMaps(legacyCapBoostDays, shopBoosts.capBoostDays);
    const calc = applyAccountFileCompactBaseline(calculateXpFromEventRows(xpRows, { capBoostDays, xpBoostIntervals: shopBoosts.xpBoostIntervals, source: "account-event-file-ranking" }), file, p);
    out.set(key, Object.assign({}, calc, { sourceEvents: true, source: "Cloud account event file", eventFileEventCount: (file.eventLog || []).length, sourceRowCount: xpRows.length, eventFileStats: accountEventFileDerivedStats(file), equippedCosmetics }));
  }
  return out;
}

function userLevelThresholdsForClient() {
  return USER_LEVEL_THRESHOLDS.map((total, idx) => ({
    level: idx + 1,
    total: Number(total || 0),
    delta: idx === 0 ? 0 : Number(total || 0) - Number(USER_LEVEL_THRESHOLDS[idx - 1] || 0),
  }));
}

function userLevelProgress(totalScore) {
  const total = Math.max(0, Number(totalScore || 0));
  const level = userLevel(total);
  const maxLevel = USER_LEVEL_THRESHOLDS.length;
  const levelStart = Number(USER_LEVEL_THRESHOLDS[level - 1] || 0);
  const nextLevel = level < maxLevel ? level + 1 : null;
  const nextLevelStart = nextLevel ? Number(USER_LEVEL_THRESHOLDS[nextLevel - 1] || 0) : null;
  const intoLevel = Math.max(0, total - levelStart);
  const levelSpan = nextLevelStart == null ? 0 : Math.max(1, nextLevelStart - levelStart);
  const toNext = nextLevelStart == null ? 0 : Math.max(0, nextLevelStart - total);
  const progressPct = nextLevelStart == null ? 100 : Math.max(0, Math.min(100, Math.round((intoLevel / levelSpan) * 1000) / 10));
  return { level, maxLevel, levelStart, nextLevel, nextLevelStart, intoLevel: roundScore(intoLevel), levelSpan, toNext: roundScore(toNext), progressPct };
}

const AVATAR_FRAME_DEFS = [
  { id: "level-1", level: 1, label: "Clean Ring" },
  { id: "level-2", level: 2, label: "Bronze Studs" },
  { id: "level-3", level: 3, label: "Silver Compass" },
  { id: "level-4", level: 4, label: "Golden Beads" },
  { id: "level-5", level: 5, label: "Emerald Laurel" },
  { id: "level-6", level: 6, label: "Sapphire Crystal" },
  { id: "level-7", level: 7, label: "Amethyst Stars" },
  { id: "level-8", level: 8, label: "Ruby Flame" },
  { id: "level-9", level: 9, label: "Aurora Wings" },
  { id: "level-10", level: 10, label: "Royal Crown" },
];

function avatarFrameId(value) {
  const raw = String(value || "").trim().toLowerCase().replace(/_/g, "-");
  const m = raw.match(/^(?:level-|lv-?|frame-?)(10|[1-9])$/) || raw.match(/^(10|[1-9])$/);
  if (!m) return "level-1";
  const lvl = Math.max(1, Math.min(10, Number(m[1]) || 1));
  return `level-${lvl}`;
}

function avatarFrameLevel(frameId) {
  const id = avatarFrameId(frameId);
  const m = id.match(/(10|[1-9])$/);
  return Math.max(1, Math.min(10, Number(m && m[1] || 1)));
}

function avatarFrameForLevel(level) {
  const lvl = Math.max(1, Math.min(10, Math.floor(Number(level || 1))));
  return `level-${lvl}`;
}

function avatarFramesForClient(level) {
  const currentLevel = Math.max(1, Math.min(10, Math.floor(Number(level || 1))));
  return AVATAR_FRAME_DEFS.map((f) => Object.assign({}, f, { unlocked: f.level <= currentLevel }));
}


function customNotificationFromRow(row) {
  const data = (() => {
    try { return row && row.data_json ? JSON.parse(row.data_json) : {}; } catch (_) { return {}; }
  })();
  return {
    type: String(row && row.type || "custom_notification"),
    reaction: "",
    createdAt: Number(row && row.created_at || 0),
    path: String(data.path || ""),
    title: String(data.pageTitle || data.title || row && row.title || ""),
    commentId: String(data.commentId || ""),
    replyId: "",
    commentText: String(data.commentText || ""),
    replyText: "",
    actorName: "Wiki Keeper",
    actorAvatar: "🤖",
    actorAvatarFrame: "level-10",
    actorPublic: true,
    actorAccountKey: "",
    notificationTitle: String(row && row.title || ""),
    notificationMessage: String(row && row.message || ""),
    notificationSource: String(row && row.source || ""),
    notificationSourceId: String(row && row.source_id || ""),
  };
}

async function addAccountCustomNotification(db, accountKey, type, title, message, source, sourceId, data) {
  const key = identityNameKey(accountKey || "");
  if (!key) return { ok: false, error: "Missing notification account." };
  const t = String(type || "custom_notification").replace(/[^a-z0-9_:-]+/gi, "_").slice(0, 80) || "custom_notification";
  const src = safeVoucherIdPart(source || "admin");
  const sid = safeVoucherIdPart(sourceId || `${Date.now()}`);
  const id = `note:${t}:${src}:${sid}:${key}`.slice(0, 240);
  const cleanTitle = String(title || "Notification").replace(/\u0000/g, "").replace(/\s+/g, " ").trim().slice(0, 160);
  const cleanMessage = String(message || "").replace(/\u0000/g, "").replace(/\s+/g, " ").trim().slice(0, 600);
  const dataJson = JSON.stringify(data && typeof data === "object" ? data : {}).slice(0, 2000);
  const now = Date.now();
  await db.prepare(`
    INSERT OR IGNORE INTO account_custom_notifications (id, account_key, type, title, message, source, source_id, created_at, data_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(id, key, t, cleanTitle, cleanMessage, src, sid, now, dataJson).run();
  const row = await db.prepare(`SELECT * FROM account_custom_notifications WHERE id = ?`).bind(id).first().catch(() => null);
  return { ok: true, notification: row, duplicate: !!(row && Number(row.created_at || 0) !== now) };
}

function reportFingerprint(kind, values) {
  const k = safeVoucherIdPart(kind || "report");
  const v = values && typeof values === "object" ? values : {};
  if (k === "ai_test_bug_report") {
    const qid = String(v.questionId || v.question_id || "").trim();
    if (qid) return `aiq:${safeVoucherIdPart(qid)}`;
    const composite = [v.conceptId || v.concept_id || "", v.pagePath || v.page_path || "", v.question || ""].join("::");
    return `aiq:${safeVoucherIdPart(composite)}`;
  }
  if (k === "malicious_comment_report") {
    const cid = String(v.commentId || v.comment_id || "").trim();
    if (cid) return `comment:${safeVoucherIdPart(cid)}`;
  }
  return `${k}:${safeVoucherIdPart(v.fingerprint || v.reportId || v.id || Date.now())}`;
}

async function getAccountProfileRewards(db, accountKey, currentLevel) {
  const key = String(accountKey || "").trim();
  const level = Math.max(1, Math.min(10, Math.floor(Number(currentLevel || 1))));
  if (!key) return { avatarFrame: avatarFrameForLevel(level), selectedFrame: avatarFrameForLevel(level), unlockedFrames: avatarFramesForClient(level), highestLevelSeen: level, lastLevelUpAt: 0 };

  const now = Date.now();
  let row = await db.prepare(`SELECT selected_frame, COALESCE(highest_level_seen,1) AS highest_level_seen, COALESCE(last_level_up_at,0) AS last_level_up_at FROM account_profile_rewards WHERE account_key = ?`).bind(key).first().catch(() => null);
  if (!row) {
    const frame = avatarFrameForLevel(level);
    if (level > 1) {
      await applyAccountLevelUpRewards(db, key, 1, level).catch(() => {});
      row = await db.prepare(`SELECT selected_frame, COALESCE(highest_level_seen,1) AS highest_level_seen, COALESCE(last_level_up_at,0) AS last_level_up_at FROM account_profile_rewards WHERE account_key = ?`).bind(key).first().catch(() => null);
    }
    if (!row) {
      await db.prepare(`INSERT OR IGNORE INTO account_profile_rewards (account_key, selected_frame, highest_level_seen, last_level_up_at, updated_at) VALUES (?, ?, ?, 0, ?)`).bind(key, frame, level, now).run().catch(() => {});
      row = { selected_frame: frame, highest_level_seen: level, last_level_up_at: 0 };
    }
  }

  const highestLevelSeen = Math.max(level, Number(row.highest_level_seen || 1));
  let selected = avatarFrameId(row.selected_frame || avatarFrameForLevel(highestLevelSeen));
  if (avatarFrameLevel(selected) > highestLevelSeen) selected = avatarFrameForLevel(highestLevelSeen);
  return {
    avatarFrame: selected,
    selectedFrame: selected,
    unlockedFrames: avatarFramesForClient(highestLevelSeen),
    highestLevelSeen,
    lastLevelUpAt: Number(row.last_level_up_at || 0),
  };
}

async function markAccountLevelSeen(db, accountKey, level) {
  const key = String(accountKey || "").trim();
  const lvl = Math.max(1, Math.min(10, Math.floor(Number(level || 1))));
  if (!key) return;
  const now = Date.now();
  const defaultFrame = avatarFrameForLevel(lvl);
  await db.prepare(`
    INSERT INTO account_profile_rewards (account_key, selected_frame, highest_level_seen, last_level_up_at, updated_at)
    VALUES (?, ?, ?, 0, ?)
    ON CONFLICT(account_key) DO UPDATE SET
      highest_level_seen = CASE WHEN excluded.highest_level_seen > account_profile_rewards.highest_level_seen THEN excluded.highest_level_seen ELSE account_profile_rewards.highest_level_seen END,
      updated_at = excluded.updated_at
  `).bind(key, defaultFrame, lvl, now).run().catch(() => {});
}

async function applyAccountLevelUpRewards(db, accountKey, oldLevel, newLevel) {
  const key = String(accountKey || "").trim();
  const from = Math.max(1, Math.min(10, Math.floor(Number(oldLevel || 1))));
  const to = Math.max(1, Math.min(10, Math.floor(Number(newLevel || 1))));
  if (!key || to <= from) return false;
  const now = Date.now();
  await db.prepare(`UPDATE comment_identities SET name_changed_at = 0, avatar_changed_at = 0, updated_at = ? WHERE name_key = ?`).bind(now, key).run().catch(() => {});
  await db.prepare(`
    INSERT INTO account_profile_rewards (account_key, selected_frame, highest_level_seen, last_level_up_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(account_key) DO UPDATE SET
      highest_level_seen = CASE WHEN excluded.highest_level_seen > account_profile_rewards.highest_level_seen THEN excluded.highest_level_seen ELSE account_profile_rewards.highest_level_seen END,
      last_level_up_at = excluded.last_level_up_at,
      updated_at = excluded.updated_at
  `).bind(key, avatarFrameForLevel(to), to, now, now).run().catch(() => {});
  return true;
}

async function syncAccountLevelRewardsFromXp(db, accountKey, level) {
  const key = String(accountKey || "").trim();
  const lvl = Math.max(1, Math.min(10, Math.floor(Number(level || 1))));
  if (!key) return;
  const row = await db.prepare(`SELECT COALESCE(highest_level_seen,0) AS highest_level_seen, COALESCE(last_level_up_at,0) AS last_level_up_at FROM account_profile_rewards WHERE account_key = ?`).bind(key).first().catch(() => null);
  if (!row) {
    if (lvl > 1) await applyAccountLevelUpRewards(db, key, 1, lvl);
    else await markAccountLevelSeen(db, key, lvl);
    return;
  }
  const seen = Math.max(1, Math.floor(Number(row.highest_level_seen || 1)));
  const lastLevelUpAt = Number(row.last_level_up_at || 0);
  if (lvl > seen) await applyAccountLevelUpRewards(db, key, seen, lvl);
  else if (lvl > 1 && seen >= lvl && !lastLevelUpAt) {
    // Repair rows created by an older avatar-frame build: the level was marked as
    // seen, but the level-up reward that clears profile cooldowns was not applied.
    await applyAccountLevelUpRewards(db, key, Math.max(1, lvl - 1), lvl);
  }
}

function activityMetricMeta(metric) {
  const m = activityMetric(metric) || String(metric || "").trim().toLowerCase();
  const labels = {
    view: ["Visit a concept page", "When a concept page is opened in any way."],
    active_day: ["Active day", "When the site is opened on a new day. Awarded once per day."],
    mastery: ["Set a mastery rating", "When a new or changed concept mastery state is saved."],
    ai_quiz: ["Complete an AI quiz", "When an AI quiz result is produced. Starting or opening a test does not count."],
    guided_study_start: ["Start Guided Study", "When Guided Study is started from the tab bar random route or from Start guided study inside a map."],
    map_open: ["Open the learning map", "When the concept map is opened from the Learning Path panel."],
    prerequisite_readiness_open: ["View Prerequisite readiness", "When Prerequisite readiness is opened or viewed on a concept page."],
    course_diagnostics_open: ["View Course diagnostics", "When Course diagnostics is opened or viewed."],
    course_search: ["Use course search", "When a search is made from the course search bar."],
    concept_finder_open: ["Open Concept Finder", "When the Concept Finder page is opened from the tab bar, search, or a direct page visit."],
    random_browse_start: ["Start random browsing", "When random browsing is started inside Concept Finder."],
    search_suggestion: ["Use a search suggestion", "When a suggested search result is used."],
    sort_use: ["Open a rankings category", "When any category or time range inside Rankings is opened."],
    panel_open: ["Open a learning path panel", "When the Learning Path panel is opened on mobile."],
    saved_page_action: ["Save a page", "When a page first enters Favourites, Study later, or Review later."],
    saved_page_visit: ["Revisit a saved page", "When a previously saved page is opened."],
    comment: ["Write a comment", "When a top-level comment is posted."],
    reply: ["Write a reply", "When a reply is posted."],
    reaction_given: ["Give a reaction", "When a comment reaction is given."],
    reaction_received: ["Receive a reaction", "When another user reacts to your comment."],
    mention_given: ["Mention another user", "When another existing user is mentioned."],
    mention_received: ["Receive a mention", "When another user mentions you."],
    comment_edit: ["Edit a comment", "When a comment is edited."],
    report: ["Report a comment", "When a comment report is submitted."],
    bug_report: ["Submit a bug report", "When a bug or AI issue is reported."],
    account_tab_open: ["Open an account tab", "When a tab inside the account panel is opened."],
    notification_read: ["Read new notifications", "When unread notifications are opened and marked as seen."],
    avatar_upload: ["Upload an avatar", "When a profile avatar is uploaded."],
    intro_update: ["Add an intro", "When a profile intro is added or updated."],
    privacy_update: ["Adjust privacy settings", "When privacy settings are adjusted."],
    sync_device_connected: ["Connect a synced device", "When a device joins the account."],
    connection_request: ["Send a connection request", "When a study connection request is sent."],
    connection_added: ["Add a study connection", "When a study connection is accepted. Both users receive the reward."],
  };
  const pair = labels[m] || [m.replace(/_/g, " ").replace(/\b\w/g, (x) => x.toUpperCase()), "Tracked by the Hot Worker."];
  return {
    metric: m,
    label: pair[0],
    description: pair[1],
    weight: Number(USER_ACTIVITY_WEIGHTS[m] || 0),
    dailyCap: Number.isFinite(activityDailyCap(m)) ? activityDailyCap(m) : null,
    globalDailyCap: USER_DAILY_XP_CAP,
    category: activityCategory(m),
    repeatPercent: repeatDiscountPercentForMetric(m),
    oneTime: activityOneTime(m),
  };
}

function xpRulesForClient(capMultiplier = 1) {
  const mult = Number.isFinite(Number(capMultiplier)) && Number(capMultiplier) > 1 ? Number(capMultiplier) : 1;
  return Object.keys(USER_ACTIVITY_WEIGHTS).map((metric) => {
    const meta = activityMetricMeta(metric);
    const baseCap = meta.dailyCap;
    return {
      metric,
      label: meta.label,
      description: meta.description,
      xpPerCount: meta.weight,
      dailyCap: Number.isFinite(baseCap) ? baseCap * mult : baseCap,
      baseDailyCap: baseCap,
      globalDailyCap: USER_DAILY_XP_CAP * mult,
      baseGlobalDailyCap: USER_DAILY_XP_CAP,
      capMultiplier: mult,
      category: meta.category,
      repeatPercent: meta.repeatPercent,
      oneTime: !!meta.oneTime,
    };
  });
}

function eventDetailsFromRow(row) {
  try { return JSON.parse(row && row.details_json || "{}"); } catch (_) { return {}; }
}

async function resolveAccount(db, visitorId, req) {
  const vh = await visitorHash(visitorId || "");
  if (!vh) return { visitorHash: "", accountKey: "", identity: null };

  const link = await db.prepare(`SELECT visitor_hash, name_key, COALESCE(device_name,'') AS device_name, COALESCE(last_seen,0) AS last_seen, COALESCE(revoked_at,0) AS revoked_at FROM account_device_links WHERE visitor_hash = ?`).bind(vh).first().catch(() => null);
  if (link && Number(link.revoked_at || 0) > 0) {
    return { visitorHash: vh, accountKey: "", identity: null, revoked: true };
  }

  let row = null;
  if (link && link.name_key) {
    row = await db.prepare(`
      SELECT i.visitor_hash, i.name, i.name_key, i.avatar, COALESCE(i.is_public,0) AS is_public, i.bio, i.created_at, i.updated_at, COALESCE(i.name_changed_at,0) AS name_changed_at, COALESCE(i.avatar_changed_at,0) AS avatar_changed_at
      FROM comment_identities i
      WHERE i.name_key = ?
    `).bind(link.name_key).first();
    if (row && req) {
      try { await db.prepare(`UPDATE account_device_links SET last_seen = ? WHERE visitor_hash = ? AND COALESCE(revoked_at,0) = 0`).bind(Date.now(), vh).run(); } catch (_) {}
    }
  }

  if (!row && !link) {
    row = await db.prepare(`SELECT visitor_hash, name, name_key, avatar, COALESCE(is_public,0) AS is_public, bio, created_at, updated_at, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE visitor_hash = ?`).bind(vh).first();
    if (row && row.name_key) {
      try { await touchDeviceLink(db, vh, row.name_key, req, ""); } catch (_) {}
    }
  }
  return { visitorHash: vh, accountKey: row && row.name_key ? String(row.name_key) : "", identity: row || null };
}

async function renameAccountKeyEverywhere(db, oldKey, newKey) {
  if (!oldKey || !newKey || oldKey === newKey) return;
  const updates = [
    [`UPDATE account_device_links SET name_key = ? WHERE name_key = ?`, newKey, oldKey],
    [`UPDATE page_actions SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_page_visits SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE user_activity_daily SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE user_activity_totals SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE user_activity_events SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE comments SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE favorites SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_privacy_settings SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE xp_cap_boost_vouchers SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_readiness SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_mastery SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_ai_quiz_sessions SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_mastery_json_snapshot_chunks SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_mastery_json_upload_chunks SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_json_snapshot_chunks SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_json_upload_chunks SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_event_file_snapshot_chunks SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_event_file_snapshot_versions SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_event_file_snapshot_meta SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
    [`UPDATE account_event_file_upload_chunks SET account_key = ? WHERE account_key = ?`, newKey, oldKey],
  ];
  for (const [sql, a, b] of updates) {
    try { await db.prepare(sql).bind(a, b).run(); } catch (_) {}
  }
}

function activityMetric(metric) {
  const m0 = String(metric || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  const aliases = {
    view_page: "view",
    page_view: "view",
    view_seed: "view",
    search: "course_search",
    course_search_submit: "course_search",
    top_search: "course_search",
    search_result_open: "course_search",
    concept_finder: "concept_finder_open",
    concept_finder_open: "concept_finder_open",
    concept_finder_jump: "concept_finder_open",
    finder_open: "concept_finder_open",
    random_browse: "random_browse_start",
    random_browse_start: "random_browse_start",
    start_random: "random_browse_start",
    random_start: "random_browse_start",
    guided_study: "guided_study_start",
    guided_study_start: "guided_study_start",
    start_guided_study: "guided_study_start",
    random_route: "guided_study_start",
    random_route_start: "guided_study_start",
    start_random_route: "guided_study_start",
    course_diagnostics: "course_diagnostics_open",
    course_diagnostics_open: "course_diagnostics_open",
    diagnostics_open: "course_diagnostics_open",
    view_course_diagnostics: "course_diagnostics_open",
    prerequisite_readiness: "prerequisite_readiness_open",
    prerequisite_readiness_open: "prerequisite_readiness_open",
    readiness: "prerequisite_readiness_open",
    readiness_set: "prerequisite_readiness_open",
    readiness_open: "prerequisite_readiness_open",
    view_prerequisite_readiness: "prerequisite_readiness_open",
    suggestion: "search_suggestion",
    suggestion_use: "search_suggestion",
    sort: "sort_use",
    filter: "sort_use",
    sorting: "sort_use",
    filtering: "sort_use",
    sort_filter: "sort_use",
    sorting_filtering: "sort_use",
    panel: "panel_open",
    open_panel: "panel_open",
    tab_open: "account_tab_open",
    ai_quiz_attempt: "ai_quiz",
    ai_quiz_seed: "ai_quiz",
    ai_bug_report: "bug_report",
    report_bug: "bug_report",
    comment_report: "report",
    favorite_page: "saved_page_action",
    favorite: "saved_page_action",
    favorites: "saved_page_action",
    favourite: "saved_page_action",
    favourites: "saved_page_action",
    fav: "saved_page_action",
    saved_page: "saved_page_action",
    save_page: "saved_page_action",
    page_saved: "saved_page_action",
    saved_page_action_seed: "saved_page_action",
    study: "saved_page_action",
    study_later: "saved_page_action",
    review: "saved_page_action",
    review_later: "saved_page_action",
    revisit_saved_page: "saved_page_visit",
    visit_saved_page: "saved_page_visit",
    mastery_seed: "mastery",
    connection_request_send: "connection_request",
    connection_requested: "connection_request",
    connection_accept: "connection_added",
    connection_accepted: "connection_added",
    device_connect: "sync_device_connected",
    sync_claim: "sync_device_connected",
  };
  const m = aliases[m0] || m0;
  return Object.prototype.hasOwnProperty.call(USER_ACTIVITY_WEIGHTS, m) ? m : "";
}

function safeDetailsJson(details) {
  try {
    const s = JSON.stringify(details && typeof details === "object" ? details : {});
    return s.length > 2000 ? s.slice(0, 2000) : s;
  } catch (_) {
    return "{}";
  }
}

async function bumpAccountActivity(db, accountKey, metric, amount = 1, opts = {}) {
  const key = String(accountKey || "").trim();
  if (!key) return;
  const m = activityMetric(metric);
  if (!m) return;
  if (m === "ai_quiz" && !aiQuizCompletionSignal(metric, opts.details || opts)) return;
  if (m === "map_open" && !mapOpenSignal(metric, opts.details || opts)) return;
  if (m === "panel_open" && !panelOpenSignal(metric, opts.details || opts)) return;
  let levelBefore = 1;
  try {
    const beforeCalc = await getAccountXpCalculation(db, key, { period: "all" });
    levelBefore = userLevel(beforeCalc.totalScore || 0);
  } catch (_) {}
  const now = Date.now();
  const eventTs = normaliseTimestamp(opts.ts || opts.createdAt || opts.created_at || 0) || now;
  const day = dayUTCFromTimestamp(eventTs);
  const path = normalizePath(opts.path || "");
  const title = cleanTitle(opts.title || "", opts.path || "");
  let detailsForInsert = opts.details && typeof opts.details === "object" ? Object.assign({}, opts.details) : {};
  if (m === "ai_quiz") {
    const stateKey = aiQuizActivityStateKey(detailsForInsert, path, eventTs);
    const claim = await claimDailyActivityActionState(db, key, m, stateKey, day, eventTs, detailsForInsert);
    if (!claim.claimed) return;
    detailsForInsert = Object.assign({}, detailsForInsert, {
      serverActionStateKey: claim.stateKey,
      serverActionStateDay: claim.day,
      serverActionStateHadEver: !!claim.hadEver,
      serverDedupeVersion: 3,
    });
  }
  const count = m === "ai_quiz" ? 1 : Math.max(1, Number(amount || 1));
  const score = Math.round(activityXp(m) * count * 100) / 100;

  try {
    const eventId = (crypto.randomUUID ? crypto.randomUUID() : `${now}-${Math.random().toString(36).slice(2)}`);
    await db.prepare(`
      INSERT INTO user_activity_events (id, account_key, metric, count, score, path, title, details_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(eventId, key, m, count, score, path, title, safeDetailsJson(detailsForInsert), eventTs).run();
  } catch (_) {}

  // one active-day credit per UTC day; historical imports use the event day
  try {
    const active = await db.prepare(`INSERT OR IGNORE INTO user_activity_daily (day, account_key, metric, count, score) VALUES (?, ?, 'active_day', 1, ?)`).bind(day, key, activityXp("active_day")).run();
    if (active && active.meta && Number(active.meta.changes || 0) > 0) {
      await db.prepare(`INSERT INTO user_activity_totals (account_key, metric, count, score, updated_at) VALUES (?, 'active_day', 1, ?, ?) ON CONFLICT(account_key, metric) DO UPDATE SET count = count + 1, score = score + excluded.score, updated_at = excluded.updated_at`).bind(key, activityXp("active_day"), now).run();
    }
  } catch (_) {}

  await db.prepare(`
    INSERT INTO user_activity_daily (day, account_key, metric, count, score)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(day, account_key, metric) DO UPDATE SET
      count = user_activity_daily.count + excluded.count,
      score = user_activity_daily.score + excluded.score
  `).bind(day, key, m, count, score).run();
  await db.prepare(`
    INSERT INTO user_activity_totals (account_key, metric, count, score, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(account_key, metric) DO UPDATE SET
      count = user_activity_totals.count + excluded.count,
      score = user_activity_totals.score + excluded.score,
      updated_at = excluded.updated_at
  `).bind(key, m, count, score, now).run();

  try {
    const afterCalc = await getAccountXpCalculation(db, key, { period: "all" });
    const levelAfter = userLevel(afterCalc.totalScore || 0);
    await updateUserRankingProjectionFromCalc(db, key, afterCalc, "Canonical XP projection").catch(() => {});
    if (levelAfter > levelBefore) await applyAccountLevelUpRewards(db, key, levelBefore, levelAfter);
    else await markAccountLevelSeen(db, key, levelAfter);
  } catch (_) {}
}


async function bumpUserActivity(db, visitorId, metric, amount = 1, opts = {}) {
  const acc = await resolveAccount(db, visitorId || "");
  const accountKey = acc.accountKey;
  if (!accountKey) return;
  await bumpAccountActivity(db, accountKey, metric, amount, opts);
}

async function handleActivityEvent(req, env) {
  const body = await readJson(req, 8192);
  const metric = activityMetric(body.metric || body.action || "");
  if (!metric) return json({ ok: false, error: "Unknown activity metric." }, 400, req, env);
  let details = body.details && typeof body.details === "object" ? Object.assign({}, body.details) : {};
  const path = normalizePath(body.path || details.path || details.conceptId || details.concept_id || "");
  const title = cleanTitle(body.title || details.title || details.conceptTitle || details.concept_title || "", path);
  const amount = Math.max(1, Math.floor(Number(body.amount || body.count || 1) || 1));
  const ts = normaliseTimestamp(body.ts || body.createdAt || body.created_at || details.completedAt || details.completed_at || details.eventClientTs || 0) || Date.now();

  // Discovery/navigation actions should represent a transition, not an endless
  // stream of duplicate DOM/submit signals.  This also protects course search
  // because course-search.js and the generic XP detector may both see the same
  // submit.  The server, not the UI, now owns the final dedupe decision.
  if (STATE_GATED_ACTIVITY_METRICS.has(metric)) {
    const acc = await resolveAccount(env.DB, body.visitorId || "", req);
    if (!acc.accountKey) return json({ ok: true, metric, ignored: true, reason: "no_account" }, 200, req, env);
    const rawStateKey = body.actionStateKey || details.actionStateKey || details.stateKey || actionStateKeyForMetric(metric, { details }, path);
    const stateKey = normaliseActionStateKey(rawStateKey, `${metric}:unknown`);
    const claim = await claimDailyActivityActionState(env.DB, acc.accountKey, metric, stateKey, dayUTCFromTimestamp(ts), ts, details);
    if (!claim.claimed) {
      return json({ ok: true, metric, ignored: true, reason: claim.reason || "action_state_not_claimed", stateActivated: false, stateKey: claim.stateKey, day: claim.day }, 200, req, env);
    }
    details = Object.assign({}, details, {
      serverActionStateKey: claim.stateKey,
      serverActionStateDay: claim.day,
      serverActionStateHadEver: !!claim.hadEver,
      serverDedupeVersion: 4,
    });
    await bumpAccountActivity(env.DB, acc.accountKey, metric, amount, { path, title, ts, details });
    return json({ ok: true, metric, count: metric === "ai_quiz" ? 1 : amount, stateActivated: true, stateKey: claim.stateKey, day: claim.day }, 200, req, env);
  }

  await bumpUserActivity(env.DB, body.visitorId || "", metric, amount, { path, title, ts, details });
  return json({ ok: true, metric, count: metric === "ai_quiz" ? 1 : amount }, 200, req, env);
}

async function handleTrack(req, env) {
  const body = await readJson(req, 8192);
  const path = normalizePath(body.path || body.url || "");
  if (!path) return json({ ok: false, error: "Missing path" }, 400, req, env);
  const title = cleanTitle(body.title || "", path);
  const visitorId = body.visitorId || body.visitor_id || "";
  const now = normaliseTimestamp(body.ts || body.createdAt || body.created_at || 0) || Date.now();
  const day = dayUTCFromTimestamp(now);

  if (!isConceptPath(path)) {
    return json({ ok: true, ignored: true, reason: "not_concept_path", path }, 200, req, env);
  }

  await touchPage(env.DB, path, title, now);
  await env.DB.prepare(`
    UPDATE pages
    SET total_views = COALESCE(total_views, 0) + 1,
        updated_at = ?
    WHERE path = ?
  `).bind(now, path).run();
  await env.DB.prepare(`
    INSERT INTO page_views_daily (day, path, views)
    VALUES (?, ?, 1)
    ON CONFLICT(day, path) DO UPDATE SET views = page_views_daily.views + 1
  `).bind(day, path).run();

  // Account-facing event XP and history.  This is the canonical source used by
  // the Level & XP panel, rankings and public profile.  Older code only updated
  // popularity views, which meant saved-page revisits had no way to become XP.
  let accountVisit = false;
  let savedPageVisit = null;
  try {
    await bumpUserActivity(env.DB, visitorId, "view", 1, {
      path,
      title,
      ts: now,
      details: { source: "page_view", trackVersion: 3 },
    });
    accountVisit = true;
  } catch (_) {}
  try { await recordAccountVisit(env.DB, visitorId, path, title); } catch (_) {}
  try { savedPageVisit = await recordSavedPageVisitActivity(env.DB, visitorId, path, title, now); } catch (err) { savedPageVisit = { recorded: false, error: String(err && err.message || err) }; }

  return json({ ok: true, path, title, tracked: true, accountVisit, savedPageVisit }, 200, req, env);
}

async function handleEvent(req, env) {
  const body = await readJson(req, 8192);
  const type = String(body.type || body.event || body.metric || body.action || "").trim().toLowerCase();
  const metric = activityMetric(EVENT_TO_METRIC[type] || type || "");
  if (!metric) return json({ ok: false, error: "Unknown event type." }, 400, req, env);
  const path = normalizePath(body.path || body.href || body.url || "");
  const title = cleanTitle(body.title || body.conceptTitle || body.concept_title || "", path);
  const visitorId = body.visitorId || body.visitor_id || "";
  const ts = normaliseTimestamp(body.ts || body.createdAt || body.created_at || body.completedAt || body.completed_at || 0) || Date.now();
  const details = Object.assign({}, body.details && typeof body.details === "object" ? body.details : {}, {
    source: body.source || type || "event",
    eventType: type,
    eventEndpointVersion: 2,
  });
  try {
    await bumpUserActivity(env.DB, visitorId, metric, Math.max(1, Math.floor(Number(body.amount || body.count || 1) || 1)), { path, title, ts, details });
  } catch (_) {}
  try {
    if (isConceptPath(path) && ["mastery", "ai_quiz", "map_open"].includes(metric)) {
      await bumpEngagement(env.DB, metric, path, title, 1);
    }
  } catch (_) {}
  return json({ ok: true, metric, path, count: metric === "ai_quiz" ? 1 : Math.max(1, Math.floor(Number(body.amount || body.count || 1) || 1)) }, 200, req, env);
}

async function recordAccountVisit(db, visitorId, path, title) {
  const acc = await resolveAccount(db, visitorId || "");
  if (!acc.accountKey || !path) return;
  const now = Date.now();
  await db.prepare(`
    INSERT INTO account_page_visits (account_key, path, title, visit_count, first_visited, last_visited)
    VALUES (?, ?, ?, 1, ?, ?)
    ON CONFLICT(account_key, path) DO UPDATE SET
      title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_page_visits.title END,
      visit_count = account_page_visits.visit_count + 1,
      last_visited = excluded.last_visited
  `).bind(acc.accountKey, path, cleanTitle(title, path), now, now).run();
}

function actionLabel(action) {
  const a = String(action || "").toLowerCase();
  if (a === "favorite") return "Favourite";
  if (a === "study_later") return "Study later";
  if (a === "review_later") return "Review later";
  return a || "action";
}

async function accountKeyForAction(db, visitorId) {
  const acc = await resolveAccount(db, visitorId || "");
  if (acc.accountKey) return { accountKey: acc.accountKey, visitorHash: acc.visitorHash, account: acc };
  return { accountKey: acc.visitorHash || await visitorHash(visitorId || ""), visitorHash: acc.visitorHash, account: acc };
}

async function hotUsers(req, env, period, limit, offset) {
  const [projections, identities, frameRows] = await Promise.all([
    getAllUserXpRankingProjections(env.DB, period),
    env.DB.prepare(`
      SELECT i.name_key AS account_key, i.name, i.avatar, i.bio,
        COALESCE(ps.profile_visibility, CASE WHEN COALESCE(ps.profile_public, i.is_public, 0)=1 THEN 'public' ELSE 'private' END) AS profile_visibility,
        COALESCE(ps.ranking_visibility, CASE WHEN COALESCE(ps.ranking_public, i.is_public, 0)=1 THEN 'public' ELSE 'public' END) AS ranking_visibility
      FROM comment_identities i
      LEFT JOIN account_privacy_settings ps ON ps.account_key = i.name_key
    `).all().catch(() => env.DB.prepare(`
      SELECT i.name_key AS account_key, i.name, i.avatar, i.bio,
        CASE WHEN COALESCE(i.is_public, 0)=1 THEN 'public' ELSE 'private' END AS profile_visibility,
        'public' AS ranking_visibility
      FROM comment_identities i
    `).all().catch(() => ({ results: [] }))),
    env.DB.prepare(`
      SELECT account_key, selected_frame
      FROM account_profile_rewards
    `).all().catch(() => ({ results: [] })),
  ]);

  const identityMap = new Map();
  for (const r of (identities.results || [])) {
    const key = String(r && r.account_key || "").trim();
    if (!key || isDemoCelebrityAccountName(r && r.name, key)) continue;
    identityMap.set(key, r);
  }

  const frameMap = new Map();
  for (const r of (frameRows && Array.isArray(frameRows.results) ? frameRows.results : [])) {
    const key = String(r && r.account_key || "").trim();
    if (!key) continue;
    frameMap.set(key, avatarFrameId(r && r.selected_frame || "level-1"));
  }

  // Build the ranking from cloud XP calculations, then decorate with profile
  // rows when they exist.  Starting from comment_identities dropped accounts
  // that had synced XP but no profile row yet, making the active-user ranking
  // look empty even though the cloud account-event files were present.
  const accountKeys = new Set();
  for (const key of projections.keys()) accountKeys.add(String(key || "").trim());

  const itemsAll = Array.from(accountKeys).filter(Boolean).map((key) => {
    const r = identityMap.get(key) || { account_key: key, name: "" };
    const projection = projections.get(key) || userRankingProjectionFromCalc(calculateXpFromEventRows([]));
    const equippedCosmetics = Object.assign({}, projection.equippedCosmetics || {});
    const total = roundScore(projection.totalScore || 0);
    const score = period === "all" ? total : userRankingPeriodScoreFromDailyScores(projection.dailyScores, period);
    const level = userLevel(total);
    const profileVisible = String(r.profile_visibility || "private") === "public";
    const bio = profileVisible ? cleanProfileBio(r.bio || "") : "";
    const avatarFrame = avatarFrameId(frameMap.get(key) || avatarFrameForLevel(level));
    const fallbackName = `User ${key.slice(0, 6)}`;
    const name = cleanDeviceName(r.name || fallbackName);
    return { kind: "user", path: `user:${key}`, accountKey: key, name, title: name, avatar: publicAvatarForClient(req, r.avatar || ""), avatarFrame, selectedAvatarFrame: avatarFrame, bio, intro: bio, profileIntro: bio, equippedCosmetics, rankingEffect: equippedCosmetics.ranking_effect || "", profileFrameEffect: equippedCosmetics.profile_frame || "", profileBackground: equippedCosmetics.profile_background || "", count: score, score, periodScore: score, totalScore: total, totalXp: total, level, source: projection.source || "" };
  }).filter((x) => Number(x.score || 0) > 0)
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0) || Number(b.totalScore || 0) - Number(a.totalScore || 0) || String(a.name || "").localeCompare(String(b.name || "")));

  const items = itemsAll.slice(offset, offset + limit);
  return json({ ok: true, metric: "users", period_used: period, period, items, total: itemsAll.length, dailyCap: USER_DAILY_XP_BASE_CAP, rules: xpRulesForClient(), projection: "all_time_daily_summary_v1" }, 200, req, env);
}



async function subtractActivityAggregatesForEvents(db, rows) {
  const list = Array.isArray(rows) ? rows : [];
  if (!list.length) return;
  const groups = new Map();
  for (const row of list) {
    const key = String(row && row.account_key || "").trim();
    const metric = activityMetric(row && row.metric || "");
    if (!key || !metric) continue;
    const count = Math.max(0, Number(row && row.count || 0));
    if (!count) continue;
    const createdAt = normaliseTimestamp(row && row.created_at || 0) || Date.now();
    const day = dayUTCFromTimestamp(createdAt);
    const score = Math.max(0, Number(row && row.score != null ? row.score : activityXp(metric) * count));
    const gkey = `${key}\t${day}\t${metric}`;
    const g = groups.get(gkey) || { accountKey: key, day, metric, count: 0, score: 0 };
    g.count += count;
    g.score += score;
    groups.set(gkey, g);
  }
  const now = Date.now();
  for (const g of groups.values()) {
    await db.prepare(`
      UPDATE user_activity_daily
      SET count = MAX(0, count - ?),
          score = MAX(0, score - ?)
      WHERE day = ? AND account_key = ? AND metric = ?
    `).bind(g.count, g.score, g.day, g.accountKey, g.metric).run().catch(() => {});
    await db.prepare(`DELETE FROM user_activity_daily WHERE day = ? AND account_key = ? AND metric = ? AND count <= 0 AND score <= 0`).bind(g.day, g.accountKey, g.metric).run().catch(() => {});

    await db.prepare(`
      UPDATE user_activity_totals
      SET count = MAX(0, count - ?),
          score = MAX(0, score - ?),
          updated_at = ?
      WHERE account_key = ? AND metric = ?
    `).bind(g.count, g.score, now, g.accountKey, g.metric).run().catch(() => {});
    await db.prepare(`DELETE FROM user_activity_totals WHERE account_key = ? AND metric = ? AND count <= 0 AND score <= 0`).bind(g.accountKey, g.metric).run().catch(() => {});
  }
}

async function deleteActivityEventsByIds(db, ids) {
  const cleanIds = Array.from(new Set((Array.isArray(ids) ? ids : []).map((x) => String(x || "").trim()).filter(Boolean)));
  if (!cleanIds.length) return { deleted: 0, count: 0, score: 0, events: [] };
  const events = [];
  for (let i = 0; i < cleanIds.length; i += 80) {
    const chunk = cleanIds.slice(i, i + 80);
    const ph = chunk.map(() => "?").join(",");
    const rows = await db.prepare(`SELECT id, account_key, metric, count, score, created_at FROM user_activity_events WHERE id IN (${ph})`).bind(...chunk).all().catch(() => ({ results: [] }));
    events.push(...(rows.results || []));
  }
  for (let i = 0; i < cleanIds.length; i += 80) {
    const chunk = cleanIds.slice(i, i + 80);
    const ph = chunk.map(() => "?").join(",");
    await db.prepare(`DELETE FROM user_activity_events WHERE id IN (${ph})`).bind(...chunk).run().catch(() => {});
  }
  await subtractActivityAggregatesForEvents(db, events);
  return {
    deleted: events.length,
    count: events.reduce((sum, r) => sum + Math.max(0, Number(r.count || 0)), 0),
    score: roundScore(events.reduce((sum, r) => sum + Math.max(0, Number(r.score != null ? r.score : activityXp(r.metric) * Number(r.count || 0))), 0)),
    events,
  };
}

async function findActivityEventIds(db, whereSql, binds = [], orderSql = "created_at ASC", limit = 500) {
  const lim = Math.max(1, Math.min(500, Math.floor(Number(limit || 500))));
  const rows = await db.prepare(`SELECT id FROM user_activity_events WHERE ${whereSql} ORDER BY ${orderSql} LIMIT ${lim}`).bind(...binds).all().catch(() => ({ results: [] }));
  return (rows.results || []).map((r) => String(r.id || "")).filter(Boolean);
}

async function deleteActivityEventsWhere(db, whereSql, binds = [], orderSql = "created_at ASC", limit = 500) {
  const ids = await findActivityEventIds(db, whereSql, binds, orderSql, limit);
  return deleteActivityEventsByIds(db, ids);
}

function jsonLikeNeedle(prop, value) {
  return `%"${String(prop || "").replace(/[%_]/g, "")}":"${String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"%`;
}

async function rememberActivityActionState(db, accountKey, metric, stateKey, details = {}, ts = 0) {
  const key = String(accountKey || "").trim();
  const m = activityMetric(metric);
  const sk = String(stateKey || "").trim().slice(0, 240);
  if (!key || !m || !sk) return { hadEver: false, stateKey: sk };
  const when = normaliseTimestamp(ts || 0) || Date.now();
  const existing = await db.prepare(`SELECT first_seen_at FROM user_activity_action_state WHERE account_key = ? AND metric = ? AND state_key = ?`).bind(key, m, sk).first().catch(() => null);
  const detailsJson = safeDetailsJson(details || {});
  await db.prepare(`
    INSERT INTO user_activity_action_state (account_key, metric, state_key, first_seen_at, last_seen_at, last_day, details_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_key, metric, state_key) DO UPDATE SET
      last_seen_at = excluded.last_seen_at,
      last_day = excluded.last_day,
      details_json = excluded.details_json
  `).bind(key, m, sk, existing ? Number(existing.first_seen_at || when) : when, when, dayUTCFromTimestamp(when), detailsJson).run().catch(() => {});
  return { hadEver: !!existing, stateKey: sk };
}

async function refundConnectionActivityForAccount(db, accountKey, otherKey, status) {
  const key = String(accountKey || "").trim();
  const other = identityNameKey(otherKey || "");
  if (!key || !other) return { refunded: false, deleted: 0, score: 0 };
  const needles = [jsonLikeNeedle("other", other), jsonLikeNeedle("target", other), jsonLikeNeedle("targetKey", other), jsonLikeNeedle("requesterKey", other)];
  const whereParts = needles.map(() => "details_json LIKE ?").join(" OR ");
  const metrics = String(status || "") === "pending" ? ["connection_request"] : ["connection_added", "connection_request"];
  const metricPh = metrics.map(() => "?").join(",");
  const result = await deleteActivityEventsWhere(
    db,
    `account_key = ? AND metric IN (${metricPh}) AND (${whereParts})`,
    [key, ...metrics, ...needles],
    "created_at ASC",
    100
  );
  return { refunded: result.deleted > 0, deleted: result.deleted, score: result.score, metrics };
}

async function refundDeletedCommentTreeXp(db, deletedRows, rootCommentId, deletingAccountKey) {
  const rows = Array.isArray(deletedRows) ? deletedRows : [];
  const rootId = String(rootCommentId || "").trim();
  const eventIds = [];
  const deletedCommentIds = [];

  for (const row of rows) {
    const id = String(row && row.id || "").trim();
    const path = normalizePath(row && row.path || "");
    const parentId = String(row && row.parent_id || "").trim();
    const metric = parentId ? "reply" : "comment";
    const accountKey = String(row && row.account_key || "").trim();
    const ts = normaliseTimestamp(row && row.ts || 0) || 0;
    if (!id || !path) continue;
    deletedCommentIds.push(id);

    if (accountKey) {
      const exact = await findActivityEventIds(
        db,
        `account_key = ? AND metric = ? AND path = ? AND details_json LIKE ?`,
        [accountKey, metric, path, jsonLikeNeedle("commentId", id)],
        "created_at ASC",
        5
      );
      if (exact.length) {
        eventIds.push(...exact);
      } else if (ts) {
        const parentNeedle = parentId ? jsonLikeNeedle("parentId", parentId) : '%"parentId":""%';
        const fallback = await findActivityEventIds(
          db,
          `account_key = ? AND metric = ? AND path = ? AND created_at BETWEEN ? AND ? AND details_json LIKE ?`,
          [accountKey, metric, path, ts - 10 * 60 * 1000, ts + 10 * 60 * 1000, parentNeedle],
          `ABS(created_at - ${Math.floor(ts)}) ASC`,
          1
        );
        eventIds.push(...fallback);
      }

      // Mentions are attached to the deleted text.  Future events carry the
      // commentId, so they can be refunded without any time limit.
      eventIds.push(...await findActivityEventIds(
        db,
        `metric IN ('mention_given','mention_received') AND details_json LIKE ?`,
        [jsonLikeNeedle("commentId", id)],
        "created_at ASC",
        50
      ));
    }
  }

  if (rootId) {
    const root = rows.find((r) => String(r && r.id || "") === rootId) || null;
    const rootOwner = String(root && root.account_key || "").trim();
    if (rootOwner) {
      // If the selected comment/reply itself is removed, the owner's incoming
      // interaction XP for that selected item is removed.  Reaction-received XP
      // on other users' child replies is intentionally kept.
      eventIds.push(...await findActivityEventIds(
        db,
        `account_key = ? AND metric = 'reaction_received' AND details_json LIKE ?`,
        [rootOwner, jsonLikeNeedle("commentId", rootId)],
        "created_at ASC",
        200
      ));
    }
  }

  const result = await deleteActivityEventsByIds(db, eventIds);
  return Object.assign({}, result, { deletedCommentIds });
}

async function refundCurrentDaySavedPageXpForPath(db, accountKey, path) {
  const key = String(accountKey || "").trim();
  const p = normalizePath(path || "");
  if (!key || !p) return { refunded: false, count: 0, score: 0 };

  const day = todayUTC();
  const startMs = Date.parse(`${day}T00:00:00Z`) || 0;
  const endMs = startMs + 86400 * 1000;

  // Save a page is now treated as a saved-state transition, not as three
  // independent rewards.  XP is refunded only when the page leaves all saved
  // lists on the same UTC day on which that saved-state XP was created.
  const rows = await db.prepare(`
    SELECT id, metric, count, score, created_at
    FROM user_activity_events
    WHERE account_key = ?
      AND path = ?
      AND created_at >= ?
      AND created_at < ?
      AND metric IN ('saved_page_action', 'favorite', 'study_later', 'review_later')
    ORDER BY created_at ASC
  `).bind(key, p, startMs, endMs).all().catch(() => ({ results: [] }));

  const eventRows = Array.isArray(rows && rows.results) ? rows.results : [];
  const ids = eventRows.map((r) => String(r && r.id || "")).filter(Boolean);
  if (!ids.length) return { refunded: false, count: 0, score: 0, day };

  const score = Math.round(eventRows.reduce((sum, r) => sum + Math.max(0, Number(r && r.score || 0)), 0) * 100) / 100;
  const result = await deleteActivityEventsByIds(db, ids);
  return Object.assign({}, result, {
    refunded: Number(result && result.deleted || 0) > 0,
    count: Number(result && result.deleted || 0),
    score,
    day,
    metric: "saved_page_action",
    scope: "saved_page_state",
  });
}

async function refundCurrentDayPageActionXp(db, accountKey, action, path) {
  // Backward-compatible wrapper kept for older call sites.  The action is no
  // longer used to decide the refund, because the merged XP rule rewards the
  // page entering Saved pages, not a specific saved-list label.
  return refundCurrentDaySavedPageXpForPath(db, accountKey, path);
}

async function recordSavedPageVisitActivity(db, visitorId, path, title, ts) {
  const p = normalizePath(path || "");
  if (!p || !isConceptPath(p)) return { recorded: false, reason: "not_concept_path" };
  const acc = await resolveAccount(db, visitorId || "");
  const key = acc.accountKey;
  if (!key) return { recorded: false, reason: "no_linked_account" };

  const activeRows = await db.prepare(`
    SELECT action FROM page_actions
    WHERE account_key = ? AND path = ? AND action IN ('favorite', 'study_later', 'review_later')
  `).bind(key, p).all().catch(() => ({ results: [] }));
  const activeActions = (activeRows && Array.isArray(activeRows.results) ? activeRows.results : [])
    .map((r) => String(r && r.action || "")).filter(Boolean);

  let hadSavedHistory = activeActions.length > 0;
  if (!hadSavedHistory) {
    const history = await db.prepare(`
      SELECT 1 AS ok FROM user_activity_events
      WHERE account_key = ?
        AND path = ?
        AND metric IN ('saved_page_action', 'favorite', 'study_later', 'review_later')
      LIMIT 1
    `).bind(key, p).first().catch(() => null);
    hadSavedHistory = !!history;
  }
  if (!hadSavedHistory) return { recorded: false, reason: "page_not_saved_before" };

  const when = normaliseTimestamp(ts || 0) || Date.now();
  const details = {
    source: "page_view_saved_page",
    activeActions,
    savedPageVisitVersion: 11,
  };
  const stateKey = actionStateKeyForMetric("saved_page_visit", { details }, p);
  const claim = await claimDailyActivityActionState(db, key, "saved_page_visit", stateKey, dayUTCFromTimestamp(when), when, details);
  if (!claim.claimed) return { recorded: false, reason: claim.reason, stateKey: claim.stateKey, day: claim.day };

  await bumpAccountActivity(db, key, "saved_page_visit", 1, {
    path: p,
    title,
    ts: when,
    details: Object.assign({}, details, { serverActionStateKey: claim.stateKey, serverActionStateDay: claim.day, serverActionStateHadEver: !!claim.hadEver })
  });
  return { recorded: true, stateKey: claim.stateKey, day: claim.day, hadEver: !!claim.hadEver };
}

async function handleHot(req, env, url) {
  let metric = canonicalMetric(url.searchParams.get("metric") || "views");
  if (!metric) metric = "views";
  const period = periodFromUrl(url);
  const limit = clampInt(url.searchParams.get("limit"), 1, 100, 10);
  const offset = clampInt(url.searchParams.get("offset"), 0, 100000, 0);

  if (metric === "views") return hotViews(req, env, period, limit, offset);
  if (metric === "users") return hotUsers(req, env, period, limit, offset);
  if (metric === "popular") return hotPopular(req, env, period, limit, offset);
  if (metric === "lively") return hotLively(req, env, period, limit, offset);
  if (metric === "saved_pages") return hotSavedPages(req, env, period, limit, offset);
  if (metric === "comment") return hotComments(req, env, period, limit, offset);
  return hotEngagement(req, env, metric, period, limit, offset);
}

async function hotViews(req, env, period, limit, offset) {
  const ex = exactArray();
  const filterP = conceptSql("p");
  const filterD = conceptSql("d");

  if (period === "all") {
    const totalRow = await env.DB.prepare(`SELECT COUNT(*) AS c FROM pages p WHERE ${filterP}`).bind(...ex).first();
    const rows = await env.DB.prepare(`
      SELECT p.path, p.title, p.total_views AS count
      FROM pages p
      WHERE ${filterP}
      ORDER BY p.total_views DESC, p.updated_at DESC
      LIMIT ? OFFSET ?
    `).bind(...ex, limit, offset).all();
    return json({ ok: true, metric: "views", period_used: period, period, items: rows.results || [], total: totalRow?.c || 0 }, 200, req, env);
  }

  const dayParam = periodStart(period);
  const op = period === "today" ? "=" : ">=";
  const totalRow = await env.DB.prepare(`
    SELECT COUNT(*) AS c FROM (
      SELECT d.path
      FROM page_views_daily d
      WHERE d.day ${op} ? AND ${filterD}
      GROUP BY d.path
    )
  `).bind(dayParam, ...ex).first();

  const rows = await env.DB.prepare(`
    SELECT d.path AS path, COALESCE(p.title, d.path) AS title, SUM(d.views) AS count
    FROM page_views_daily d
    LEFT JOIN pages p ON p.path = d.path
    WHERE d.day ${op} ? AND ${filterD}
    GROUP BY d.path
    ORDER BY count DESC
    LIMIT ? OFFSET ?
  `).bind(dayParam, ...ex, limit, offset).all();

  return json({ ok: true, metric: "views", period_used: period, period, items: rows.results || [], total: totalRow?.c || 0 }, 200, req, env);
}

async function hotEngagement(req, env, metric, period, limit, offset) {
  const ex = exactArray();
  const filterE = conceptSql("e");

  if (period === "all") {
    const totalRow = await env.DB.prepare(`
      SELECT COUNT(*) AS c
      FROM engagement_totals e
      WHERE e.metric = ? AND ${filterE} AND e.count > 0
    `).bind(metric, ...ex).first();

    const rows = await env.DB.prepare(`
      SELECT e.path, COALESCE(p.title, e.path) AS title, e.count AS count
      FROM engagement_totals e
      LEFT JOIN pages p ON p.path = e.path
      WHERE e.metric = ? AND ${filterE} AND e.count > 0
      ORDER BY e.count DESC, e.updated_at DESC
      LIMIT ? OFFSET ?
    `).bind(metric, ...ex, limit, offset).all();

    return json({ ok: true, metric: metric === "comment" ? "comments" : metric, period_used: period, period, items: rows.results || [], total: totalRow?.c || 0 }, 200, req, env);
  }

  const dayParam = periodStart(period);
  const op = period === "today" ? "=" : ">=";
  const totalRow = await env.DB.prepare(`
    SELECT COUNT(*) AS c FROM (
      SELECT e.path
      FROM engagement_daily e
      WHERE e.metric = ? AND e.day ${op} ? AND ${filterE}
      GROUP BY e.path
      HAVING SUM(e.count) > 0
    )
  `).bind(metric, dayParam, ...ex).first();

  const rows = await env.DB.prepare(`
    SELECT e.path, COALESCE(p.title, e.path) AS title, SUM(e.count) AS count
    FROM engagement_daily e
    LEFT JOIN pages p ON p.path = e.path
    WHERE e.metric = ? AND e.day ${op} ? AND ${filterE}
    GROUP BY e.path
    HAVING count > 0
    ORDER BY count DESC
    LIMIT ? OFFSET ?
  `).bind(metric, dayParam, ...ex, limit, offset).all();

  return json({ ok: true, metric: metric === "comment" ? "comments" : metric, period_used: period, period, items: rows.results || [], total: totalRow?.c || 0 }, 200, req, env);
}


async function hotComments(req, env, period, limit, offset) {
  const ex = exactArray();
  const filterC = conceptSql("c");

  let timeWhere = "";
  let binds = [];
  if (period !== "all") {
    const startMs = Date.parse(periodStart(period) + "T00:00:00.000Z") || 0;
    timeWhere = "AND c.ts >= ?";
    binds.push(startMs);
  }

  const totalRow = await env.DB.prepare(`
    SELECT COUNT(*) AS c FROM (
      SELECT c.path
      FROM comments c
      WHERE COALESCE(c.deleted_at, 0) = 0
        ${timeWhere}
        AND ${filterC}
      GROUP BY c.path
    )
  `).bind(...binds, ...ex).first();

  const rows = await env.DB.prepare(`
    SELECT c.path, COALESCE(p.title, c.path) AS title, COUNT(*) AS count
    FROM comments c
    LEFT JOIN pages p ON p.path = c.path
    WHERE COALESCE(c.deleted_at, 0) = 0
      ${timeWhere}
      AND ${filterC}
    GROUP BY c.path
    HAVING count > 0
    ORDER BY count DESC, MAX(c.ts) DESC
    LIMIT ? OFFSET ?
  `).bind(...binds, ...ex, limit, offset).all();

  return json({ ok: true, metric: "comments", period_used: period, period, items: rows.results || [], total: totalRow?.c || 0 }, 200, req, env);
}


async function collectReactionMap(env, period) {
  const ex = exactArray();
  const filterE = conceptSql("e");
  const map = new Map();

  if (period === "all") {
    const rows = await env.DB.prepare(`
      SELECT e.path, COALESCE(p.title, e.path) AS title, e.count AS count, e.updated_at
      FROM engagement_totals e
      LEFT JOIN pages p ON p.path = e.path
      WHERE e.metric = 'reaction' AND ${filterE} AND e.count > 0
    `).bind(...ex).all();
    for (const r of rows.results || []) map.set(r.path, { path: r.path, title: r.title || r.path, count: Number(r.count || 0), updatedAt: Number(r.updated_at || 0) });
    return map;
  }

  const dayParam = periodStart(period);
  const op = period === "today" ? "=" : ">=";
  const rows = await env.DB.prepare(`
    SELECT e.path, COALESCE(p.title, e.path) AS title, SUM(e.count) AS count, MAX(e.day) AS day
    FROM engagement_daily e
    LEFT JOIN pages p ON p.path = e.path
    WHERE e.metric = 'reaction' AND e.day ${op} ? AND ${filterE}
    GROUP BY e.path
    HAVING count > 0
  `).bind(dayParam, ...ex).all();
  for (const r of rows.results || []) map.set(r.path, { path: r.path, title: r.title || r.path, count: Number(r.count || 0), updatedAt: Date.parse(String(r.day || dayParam) + "T00:00:00.000Z") || 0 });
  return map;
}

async function hotLively(req, env, period, limit, offset) {
  const [comments, reactions] = await Promise.all([
    collectCommentMap(env, period),
    collectReactionMap(env, period),
  ]);
  const paths = new Set([...comments.keys(), ...reactions.keys()]);
  const items = [];
  for (const p of paths) {
    const c = comments.get(p);
    const r = reactions.get(p);
    const commentCount = Number(c && c.count || 0);
    const reactionCount = Number(r && r.count || 0);
    const score = commentCount + reactionCount;
    if (score <= 0) continue;
    items.push({
      path: p,
      title: (c && c.title) || (r && r.title) || p,
      count: score,
      score,
      components: { comments: commentCount, reactions: reactionCount },
      updatedAt: Math.max(Number(c && c.updatedAt || 0), Number(r && r.updatedAt || 0)),
    });
  }
  items.sort((a, b) => Number(b.score || 0) - Number(a.score || 0) || Number(b.updatedAt || 0) - Number(a.updatedAt || 0) || String(a.title || a.path).localeCompare(String(b.title || b.path)));
  return json({ ok: true, metric: "lively", period_used: period, period, items: items.slice(offset, offset + limit), total: items.length }, 200, req, env);
}

async function hotSavedPages(req, env, period, limit, offset) {
  const ex = exactArray();
  const filterA = conceptSql("a");
  const actions = ["favorite", "study_later", "review_later"];

  let timeWhere = "";
  let binds = [];
  if (period !== "all") {
    const startMs = Date.parse(periodStart(period) + "T00:00:00.000Z") || 0;
    timeWhere = "AND COALESCE(a.created_at, a.updated_at, 0) >= ?";
    binds.push(startMs);
  }

  const actionPh = actions.map(() => "?").join(",");
  const totalRow = await env.DB.prepare(`
    SELECT COUNT(*) AS c FROM (
      SELECT a.path
      FROM page_actions a
      WHERE a.action IN (${actionPh})
        ${timeWhere}
        AND ${filterA}
      GROUP BY a.path
      HAVING COUNT(*) > 0
    )
  `).bind(...actions, ...binds, ...ex).first();

  const rows = await env.DB.prepare(`
    SELECT a.path, COALESCE(MAX(p.title), MAX(NULLIF(a.title, '')), a.path) AS title, COUNT(*) AS count, MAX(a.updated_at) AS updated_at
    FROM page_actions a
    LEFT JOIN pages p ON p.path = a.path
    WHERE a.action IN (${actionPh})
      ${timeWhere}
      AND ${filterA}
    GROUP BY a.path
    HAVING count > 0
    ORDER BY count DESC, updated_at DESC
    LIMIT ? OFFSET ?
  `).bind(...actions, ...binds, ...ex, limit, offset).all();

  return json({ ok: true, metric: "saved_pages", period_used: period, period, items: rows.results || [], total: totalRow?.c || 0 }, 200, req, env);
}

async function collectViewsMap(env, period) {
  const ex = exactArray();
  const map = new Map();
  if (period === "all") {
    const rows = await env.DB.prepare(`
      SELECT p.path, p.title, p.total_views AS count, p.updated_at
      FROM pages p
      WHERE ${conceptSql("p")} AND p.total_views > 0
    `).bind(...ex).all();
    for (const r of rows.results || []) map.set(r.path, { path: r.path, title: r.title || r.path, count: Number(r.count || 0), updatedAt: Number(r.updated_at || 0) });
    return map;
  }
  const dayParam = periodStart(period);
  const op = period === "today" ? "=" : ">=";
  const rows = await env.DB.prepare(`
    SELECT d.path, COALESCE(p.title, d.path) AS title, SUM(d.views) AS count, MAX(p.updated_at) AS updated_at
    FROM page_views_daily d
    LEFT JOIN pages p ON p.path = d.path
    WHERE d.day ${op} ? AND ${conceptSql("d")}
    GROUP BY d.path
    HAVING count > 0
  `).bind(dayParam, ...ex).all();
  for (const r of rows.results || []) map.set(r.path, { path: r.path, title: r.title || r.path, count: Number(r.count || 0), updatedAt: Number(r.updated_at || 0) });
  return map;
}

async function collectEngagementMaps(env, period) {
  const ex = exactArray();
  const maps = {};
  for (const m of ["favorite", "comment", "reaction", "mastery", "ai_quiz", "map_open"]) maps[m] = new Map();

  if (period === "all") {
    const rows = await env.DB.prepare(`
      SELECT e.path, e.metric, COALESCE(p.title, e.path) AS title, e.count, e.updated_at
      FROM engagement_totals e
      LEFT JOIN pages p ON p.path = e.path
      WHERE ${conceptSql("e")} AND e.metric != 'comment' AND e.count > 0
    `).bind(...ex).all();
    for (const r of rows.results || []) {
      if (!maps[r.metric]) continue;
      maps[r.metric].set(r.path, { path: r.path, title: r.title || r.path, count: Number(r.count || 0), updatedAt: Number(r.updated_at || 0) });
    }
    maps.comment = await collectCommentMap(env, period);
    return maps;
  }

  const dayParam = periodStart(period);
  const op = period === "today" ? "=" : ">=";
  const rows = await env.DB.prepare(`
    SELECT e.path, e.metric, COALESCE(p.title, e.path) AS title, SUM(e.count) AS count, MAX(p.updated_at) AS updated_at
    FROM engagement_daily e
    LEFT JOIN pages p ON p.path = e.path
    WHERE e.day ${op} ? AND e.metric != 'comment' AND ${conceptSql("e")}
    GROUP BY e.path, e.metric
    HAVING count > 0
  `).bind(dayParam, ...ex).all();
  for (const r of rows.results || []) {
    if (!maps[r.metric]) continue;
    maps[r.metric].set(r.path, { path: r.path, title: r.title || r.path, count: Number(r.count || 0), updatedAt: Number(r.updated_at || 0) });
  }
  maps.comment = await collectCommentMap(env, period);
  return maps;
}

async function collectCommentMap(env, period) {
  const ex = exactArray();
  const map = new Map();
  let timeWhere = "";
  let binds = [];
  if (period !== "all") {
    const startMs = Date.parse(periodStart(period) + "T00:00:00.000Z") || 0;
    timeWhere = "AND c.ts >= ?";
    binds.push(startMs);
  }

  const rows = await env.DB.prepare(`
    SELECT c.path, COALESCE(p.title, c.path) AS title, COUNT(*) AS count, MAX(c.ts) AS updated_at
    FROM comments c
    LEFT JOIN pages p ON p.path = c.path
    WHERE COALESCE(c.deleted_at, 0) = 0
      ${timeWhere}
      AND ${conceptSql("c")}
    GROUP BY c.path
    HAVING count > 0
  `).bind(...binds, ...ex).all();

  for (const r of rows.results || []) {
    map.set(r.path, { path: r.path, title: r.title || r.path, count: Number(r.count || 0), updatedAt: Number(r.updated_at || 0) });
  }
  return map;
}

async function hotPopular(req, env, period, limit, offset) {
  const views = await collectViewsMap(env, period);
  const maps = await collectEngagementMaps(env, period);
  maps.views = views;

  const paths = new Set();
  for (const m of Object.keys(POPULAR_WEIGHTS)) for (const p of (maps[m] || new Map()).keys()) paths.add(p);

  const items = [];
  for (const p of paths) {
    let score = 0;
    let title = p;
    let updatedAt = 0;
    const components = {};
    for (const [metric, weight] of Object.entries(POPULAR_WEIGHTS)) {
      const item = maps[metric] && maps[metric].get(p);
      const count = Number(item && item.count || 0);
      components[metric] = count;
      score += count * weight;
      if (item && item.title) title = item.title;
      if (item && item.updatedAt) updatedAt = Math.max(updatedAt, Number(item.updatedAt || 0));
    }
    score = Math.round(score * 10) / 10;
    if (score > 0) items.push({ path: p, title, count: score, score, components, updatedAt });
  }

  items.sort((a, b) => Number(b.score || 0) - Number(a.score || 0) || Number(b.updatedAt || 0) - Number(a.updatedAt || 0) || String(a.title || a.path).localeCompare(String(b.title || b.path)));
  return json({ ok: true, metric: "popular", period_used: period, period, items: items.slice(offset, offset + limit), total: items.length }, 200, req, env);
}

async function handlePageState(req, env, url) {
  const path = normalizePath(url.searchParams.get("path") || "");
  if (!path) return json({ ok: false, error: "Missing path" }, 400, req, env);
  const visitorId = url.searchParams.get("visitorId") || "";
  const ak = await accountKeyForAction(env.DB, visitorId);
  const vh = ak.visitorHash;
  const accountKey = ak.accountKey;

  const actionsRows = await env.DB.prepare(`SELECT action FROM page_actions WHERE account_key = ? AND path = ?`).bind(accountKey, path).all();
  const actions = {};
  for (const r of actionsRows.results || []) actions[String(r.action || "")] = true;

  // Backward-compatible old favourites
  let oldFav = null;
  if (vh) oldFav = await env.DB.prepare(`SELECT 1 AS ok FROM favorites WHERE visitor_hash = ? AND path = ?`).bind(vh, path).first();
  if (oldFav) actions.favorite = true;

  const fav = !!actions.favorite;
  const favCount = await env.DB.prepare(`SELECT COUNT(*) AS c FROM page_actions WHERE path = ? AND action = 'favorite'`).bind(path).first();
  const commentCount = await env.DB.prepare(`SELECT COUNT(*) AS c FROM comments WHERE path = ? AND COALESCE(deleted_at, 0) = 0`).bind(path).first();
  return json({ ok: true, path, favorite: fav, favoriteCount: Number(favCount?.c || 0), actions, commentCount: Number(commentCount?.c || 0) }, 200, req, env);
}

async function handleFavoriteToggle(req, env) {
  // backward-compatible wrapper around the new multi-action endpoint
  return handlePageActionToggle(req, env, "favorite");
}

async function handlePageActionToggle(req, env, forcedAction) {
  const body = await readJson(req);
  const path = normalizePath(body.path);
  if (!path) return json({ ok: false, error: "Missing path" }, 400, req, env);
  if (!isConceptPath(path)) return json({ ok: true, ignored: true }, 200, req, env);

  const title = cleanTitle(body.title, path);
  const allowed = new Set(["favorite", "study_later", "review_later"]);
  const action = forcedAction || String(body.action || "favorite").trim().toLowerCase();
  if (!allowed.has(action)) return json({ ok: false, error: "Unknown page action" }, 400, req, env);

  const ak = await accountKeyForAction(env.DB, body.visitorId || "");
  const accountKey = ak.accountKey;
  const vh = ak.visitorHash;

  const beforeRows = await env.DB.prepare(`
    SELECT action
    FROM page_actions
    WHERE account_key = ?
      AND path = ?
      AND action IN ('favorite', 'study_later', 'review_later')
  `).bind(accountKey, path).all().catch(() => ({ results: [] }));
  const activeBefore = new Set((beforeRows.results || []).map((r) => String(r && r.action || "")).filter(Boolean));
  const existing = activeBefore.has(action);
  const hadAnySavedBefore = activeBefore.size > 0;

  let active;
  let xpRefund = null;
  let xpRecorded = false;
  let xpSkipped = "";

  if (existing) {
    await env.DB.prepare(`DELETE FROM page_actions WHERE account_key = ? AND path = ? AND action = ?`).bind(accountKey, path, action).run();
    active = false;
    if (action === "favorite" && vh) await env.DB.prepare(`DELETE FROM favorites WHERE visitor_hash = ? AND path = ?`).bind(vh, path).run().catch?.(() => {});

    const remainingRows = await env.DB.prepare(`
      SELECT action
      FROM page_actions
      WHERE account_key = ?
        AND path = ?
        AND action IN ('favorite', 'study_later', 'review_later')
    `).bind(accountKey, path).all().catch(() => ({ results: [] }));
    const remaining = (remainingRows.results || []).map((r) => String(r && r.action || "")).filter(Boolean);

    if (!remaining.length) {
      xpRefund = await refundCurrentDaySavedPageXpForPath(env.DB, accountKey, path);
    } else {
      xpRefund = { refunded: false, reason: "page_still_saved_elsewhere", remainingActions: remaining };
    }
  } else {
    await env.DB.prepare(`INSERT OR REPLACE INTO page_actions (account_key, path, action, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`).bind(accountKey, path, action, title, Date.now(), Date.now()).run();
    active = true;

    if (!hadAnySavedBefore) {
      await bumpUserActivity(env.DB, body.visitorId || "", "saved_page_action", 1, {
        path,
        title,
        details: { action, savedAction: action, savedState: "entered", source: "page_action_toggle" },
      });
      xpRecorded = true;
    } else {
      xpSkipped = "page_already_saved";
    }

    if (action === "favorite") {
      await bumpEngagement(env.DB, "favorite", path, title, 1);
      if (vh) {
        try { await env.DB.prepare(`INSERT OR IGNORE INTO favorites (visitor_hash, path, created_at, account_key) VALUES (?, ?, ?, ?)`).bind(vh, path, Date.now(), accountKey).run(); } catch (_) {}
      }
    }
  }
  const actionEventTs = Date.now();
  const eventFilePatch = await appendAccountEventFileEvents(env.DB, accountKey, {
    id: `page_action:${accountKey}:${path}:${action}:${active ? "on" : "off"}:${actionEventTs}`,
    type: "page_action_set",
    metric: "saved_page_action",
    ts: actionEventTs,
    createdAt: actionEventTs,
    updatedAt: actionEventTs,
    deviceId: "cloud-page-action",
    deviceName: "Cloud page action",
    visitorId: body.visitorId || "",
    accountKey,
    path,
    title,
    action,
    active: !!active,
    details: { source: "page_action_toggle", action, active: !!active, savedState: active ? "active" : "inactive" }
  }).catch((err) => ({ ok: false, error: String(err && err.message || err) }));
  const favCount = await env.DB.prepare(`SELECT COUNT(*) AS c FROM page_actions WHERE path = ? AND action = 'favorite'`).bind(path).first();
  const actionRows = await env.DB.prepare(`SELECT action FROM page_actions WHERE account_key = ? AND path = ?`).bind(accountKey, path).all();
  const actions = {};
  for (const r of actionRows.results || []) actions[String(r.action || "")] = true;
  return json({ ok: true, action, active, favorite: !!actions.favorite, favoriteCount: Number(favCount?.c || 0), actions, xpRefund, xpRecorded, xpSkipped, eventFilePatch }, 200, req, env);
}

function cleanName(s) {
  let name = String(s || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim();
  if (!name) name = "Anonymous";
  if (name.length > 40) name = name.slice(0, 40);
  return name;
}

function cleanProfileName(s) {
  let name = String(s || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim();
  if (name.length > 40) name = name.slice(0, 40);
  return name;
}

function cleanProfileBio(s) {
  let bio = String(s || "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim();
  if (bio.length > 140) bio = bio.slice(0, 140);
  return bio;
}

function identityNameKey(name) {
  return cleanProfileName(name).toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function cleanAvatar(s) {
  // This value can be one of two forms:
  // 1) a short emoji / initials string entered by the user;
  // 2) an internal R2 object reference: r2:comment-avatars/...
  // Do not truncate R2 references to 32 chars. The frontend decides whether to
  // render it as text or an image URL after publicAvatarForClient().
  let avatar = String(s || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim();
  if (avatar.startsWith("r2:")) return avatar.slice(0, 700);
  if (/^https?:\/\//i.test(avatar)) return ""; // never trust user-supplied external avatar URLs
  if (avatar.length > 32) avatar = avatar.slice(0, 32);
  return avatar;
}

function r2Bucket(env) {
  return env.AVATARS || env.AVATAR_BUCKET || env.COMMENT_AVATARS || env.R2_AVATARS || null;
}

function isR2Avatar(value) {
  return String(value || "").startsWith("r2:");
}

function r2KeyFromAvatar(value) {
  const key = String(value || "").replace(/^r2:/, "");
  if (!key || key.includes("..") || key.startsWith("/") || !key.startsWith("comment-avatars/")) return "";
  return key;
}

function avatarKeyPublicPath(key) {
  return String(key || "").split("/").map((part) => encodeURIComponent(part)).join("/");
}

function publicAvatarForClient(req, value) {
  const av = cleanAvatar(value || "");
  const key = r2KeyFromAvatar(av);
  if (!key) return av;
  try {
    return new URL(`/avatar/${avatarKeyPublicPath(key)}`, req.url).toString();
  } catch (_) {
    return "";
  }
}



function visibilityValue(value, fallback) {
  const raw = String(value == null ? "" : value).trim().toLowerCase().replace(/_/g, "-");
  if (raw === "public") return "public";
  if (raw === "connections" || raw === "connection" || raw === "friends" || raw === "friend" || raw === "study-connections") return "connections";
  if (raw === "private" || raw === "only-me" || raw === "me") return "private";
  if (value === true || value === 1 || value === "1") return "public";
  if (value === false || value === 0 || value === "0") return "private";
  return fallback || "private";
}

function visibilityIsPublic(v) {
  return visibilityValue(v) === "public";
}

function visibilityIsShared(v) {
  return visibilityValue(v) === "public" || visibilityValue(v) === "connections";
}

function privacyFromRow(row, fallbackPublic) {
  const base = publicFlag(fallbackPublic) ? "public" : "private";
  const has = row && typeof row === "object";

  // Accept both D1 row names (profile_visibility / profile_public)
  // and client payload names (profileVisibility / profilePublic).
  // The previous version only understood D1 snake_case fields, so a freshly
  // submitted client payload such as { profileVisibility: "public" } was
  // normalised back to Private before being saved.
  const pick = (visDbKey, boolDbKey, visClientKey, boolClientKey) => {
    if (has && row[visDbKey] != null && String(row[visDbKey] || "").trim()) {
      return visibilityValue(row[visDbKey], base);
    }
    if (has && row[visClientKey] != null && String(row[visClientKey] || "").trim()) {
      return visibilityValue(row[visClientKey], base);
    }
    if (has && row[boolDbKey] != null) return publicFlag(row[boolDbKey]) ? "public" : "private";
    if (has && row[boolClientKey] != null) return publicFlag(row[boolClientKey]) ? "public" : "private";
    return base;
  };
  const out = {
    profileVisibility: pick("profile_visibility", "profile_public", "profileVisibility", "profilePublic"),
    visitsVisibility: pick("visits_visibility", "visits_public", "visitsVisibility", "visitsPublic"),
    actionsVisibility: pick("actions_visibility", "actions_public", "actionsVisibility", "actionsPublic"),
    commentsVisibility: pick("comments_visibility", "comments_public", "commentsVisibility", "commentsPublic"),
    readinessVisibility: pick("readiness_visibility", "readiness_public", "readinessVisibility", "readinessPublic"),
    rankingVisibility: pick("ranking_visibility", "ranking_public", "rankingVisibility", "rankingPublic"),
  };
  out.profilePublic = out.profileVisibility === "public";
  out.visitsPublic = out.visitsVisibility === "public";
  out.actionsPublic = out.actionsVisibility === "public";
  out.commentsPublic = out.commentsVisibility === "public";
  out.readinessPublic = out.readinessVisibility === "public";
  out.rankingPublic = out.rankingVisibility === "public";
  return out;
}

function privacyForClient(privacy) {
  const p = privacyFromRow(privacy, false);
  return {
    profileVisibility: p.profileVisibility,
    visitsVisibility: p.visitsVisibility,
    actionsVisibility: p.actionsVisibility,
    commentsVisibility: p.commentsVisibility,
    readinessVisibility: p.readinessVisibility,
    rankingVisibility: p.rankingVisibility,
    profilePublic: p.profilePublic,
    visitsPublic: p.visitsPublic,
    actionsPublic: p.actionsPublic,
    commentsPublic: p.commentsPublic,
    readinessPublic: p.readinessPublic,
    rankingPublic: p.rankingPublic,
  };
}

function allPrivacyValue(v) {
  const level = visibilityValue(v === true ? "public" : v === false ? "private" : v, publicFlag(v) ? "public" : "private");
  const b = level === "public";
  return {
    profileVisibility: level, visitsVisibility: level, actionsVisibility: level, commentsVisibility: level, readinessVisibility: level, rankingVisibility: level,
    profilePublic: b, visitsPublic: b, actionsPublic: b, commentsPublic: b, readinessPublic: b, rankingPublic: b,
  };
}

function privacyFromBody(body, fallback) {
  const src = body && body.privacy && typeof body.privacy === "object" ? body.privacy : body || {};
  if (src.allPublic != null) return allPrivacyValue("public");
  if (src.allConnections != null) return allPrivacyValue("connections");
  if (src.allPrivate != null && publicFlag(src.allPrivate)) return allPrivacyValue("private");
  const curr = privacyForClient(fallback || {});
  const read = (visClient, boolClient, visDb, boolDb, currVis) => {
    if (src[visClient] != null) return visibilityValue(src[visClient], currVis);
    if (src[visDb] != null) return visibilityValue(src[visDb], currVis);
    if (src[boolClient] != null) return publicFlag(src[boolClient]) ? "public" : "private";
    if (src[boolDb] != null) return publicFlag(src[boolDb]) ? "public" : "private";
    return currVis;
  };
  const out = {
    profileVisibility: read("profileVisibility", "profilePublic", "profile_visibility", "profile_public", curr.profileVisibility),
    visitsVisibility: read("visitsVisibility", "visitsPublic", "visits_visibility", "visits_public", curr.visitsVisibility),
    actionsVisibility: read("actionsVisibility", "actionsPublic", "actions_visibility", "actions_public", curr.actionsVisibility),
    commentsVisibility: read("commentsVisibility", "commentsPublic", "comments_visibility", "comments_public", curr.commentsVisibility),
    readinessVisibility: read("readinessVisibility", "readinessPublic", "readiness_visibility", "readiness_public", curr.readinessVisibility),
    rankingVisibility: read("rankingVisibility", "rankingPublic", "ranking_visibility", "ranking_public", curr.rankingVisibility),
  };
  return privacyForClient(out);
}

async function getPrivacySettings(db, accountKey, identityRow) {
  if (!accountKey) return allPrivacyValue("private");
  const row = await db.prepare(`SELECT profile_public, visits_public, actions_public, comments_public, readiness_public, ranking_public, profile_visibility, visits_visibility, actions_visibility, comments_visibility, readiness_visibility, ranking_visibility, updated_at FROM account_privacy_settings WHERE account_key = ?`).bind(accountKey).first().catch(() => null);
  return privacyFromRow(row, identityRow && identityRow.is_public);
}

async function setPrivacySettings(db, accountKey, privacy) {
  if (!accountKey) return privacyForClient(null);
  const p = privacyForClient(privacy);
  const now = Date.now();
  await db.prepare(`
    INSERT INTO account_privacy_settings (account_key, profile_public, visits_public, actions_public, comments_public, readiness_public, ranking_public, profile_visibility, visits_visibility, actions_visibility, comments_visibility, readiness_visibility, ranking_visibility, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_key) DO UPDATE SET
      profile_public = excluded.profile_public,
      visits_public = excluded.visits_public,
      actions_public = excluded.actions_public,
      comments_public = excluded.comments_public,
      readiness_public = excluded.readiness_public,
      ranking_public = excluded.ranking_public,
      profile_visibility = excluded.profile_visibility,
      visits_visibility = excluded.visits_visibility,
      actions_visibility = excluded.actions_visibility,
      comments_visibility = excluded.comments_visibility,
      readiness_visibility = excluded.readiness_visibility,
      ranking_visibility = excluded.ranking_visibility,
      updated_at = excluded.updated_at
  `).bind(accountKey, p.profilePublic ? 1 : 0, p.visitsPublic ? 1 : 0, p.actionsPublic ? 1 : 0, p.commentsPublic ? 1 : 0, p.readinessPublic ? 1 : 0, p.rankingPublic ? 1 : 0, p.profileVisibility, p.visitsVisibility, p.actionsVisibility, p.commentsVisibility, p.readinessVisibility, p.rankingVisibility, now).run();
  await db.prepare(`UPDATE comment_identities SET is_public = ?, updated_at = ? WHERE name_key = ?`).bind(p.profilePublic ? 1 : 0, now, accountKey).run().catch(() => {});
  return p;
}

async function areConnected(db, a, b) {
  const aa = identityNameKey(a || "");
  const bb = identityNameKey(b || "");
  if (!aa || !bb || aa === bb) return false;
  const row = await db.prepare(`SELECT 1 AS ok FROM study_connections WHERE status = 'accepted' AND ((requester_key = ? AND target_key = ?) OR (requester_key = ? AND target_key = ?)) LIMIT 1`).bind(aa, bb, bb, aa).first().catch(() => null);
  return !!row;
}

async function canViewVisibility(db, viewerKey, targetKey, visibility) {
  const v = visibilityValue(visibility);
  if (!targetKey) return false;
  if (v === "public") return true;
  if (viewerKey && viewerKey === targetKey) return true;
  if (v === "connections") return !!(viewerKey && await areConnected(db, viewerKey, targetKey));
  return false;
}

async function identityPayload(db, row, req) {
  if (!row) return null;
  const base = identityClientRow(row, req);
  const privacy = await getPrivacySettings(db, base.accountKey, row);
  base.isPublic = !!privacy.profilePublic;
  base.privacy = privacyForClient(privacy);
  try {
    const xpCalc = await getAccountXpCalculation(db, base.accountKey, { period: "all" });
    const level = userLevel(xpCalc.totalScore || 0);
    await syncAccountLevelRewardsFromXp(db, base.accountKey, level);
    const rewards = await getAccountProfileRewards(db, base.accountKey, level);
    base.level = level;
    base.avatarFrame = rewards.avatarFrame;
    base.unlockedAvatarFrames = rewards.unlockedFrames;
    base.highestLevelSeen = rewards.highestLevelSeen;
  } catch (_) {
    base.avatarFrame = "level-1";
    base.unlockedAvatarFrames = avatarFramesForClient(1);
  }
  return base;
}

function identityClientRow(row, req) {
  if (!row) return null;
  return {
    name: cleanProfileName(row.name || ""),
    avatar: publicAvatarForClient(req, row.avatar || ""),
    bio: cleanProfileBio(row.bio || row.description || row.intro || ""),
    isPublic: !!Number(row.is_public || row.isPublic || 0),
    accountKey: String(row.name_key || row.accountKey || ""),
    nameChangedAt: Number(row.name_changed_at || row.nameChangedAt || 0),
    avatarChangedAt: Number(row.avatar_changed_at || row.avatarChangedAt || 0),
    nameCooldownUntil: Number(row.name_changed_at || row.nameChangedAt || 0) ? Number(row.name_changed_at || row.nameChangedAt || 0) + PROFILE_CHANGE_COOLDOWN_MS : 0,
    avatarCooldownUntil: Number(row.avatar_changed_at || row.avatarChangedAt || 0) ? Number(row.avatar_changed_at || row.avatarChangedAt || 0) + PROFILE_CHANGE_COOLDOWN_MS : 0,
    cooldownDays: 7,
    updatedAt: Number(row.updated_at || row.updatedAt || 0),
  };
}

function profileCooldownError(kind, until) {
  const safeUntil = Math.max(0, Number(until || 0));
  const date = safeUntil ? new Date(safeUntil).toISOString() : "";
  const label = kind === "avatar" ? "avatar" : "username";
  return {
    ok: false,
    status: 429,
    error: `You can change your ${label} only once every 7 days. Try again after ${date}.`,
    cooldown: { kind: label, until: safeUntil, untilIso: date, days: 7 }
  };
}

function identityRawAvatarForCompare(value) {
  return cleanAvatar(value || "");
}

async function claimIdentity(db, visitorId, rawName, rawAvatar, options = {}) {
  const vh = await visitorHash(visitorId || "");
  if (!vh) return { ok: false, status: 400, error: "Missing visitor id" };
  const name = cleanProfileName(rawName);
  if (!name) return { ok: false, status: 400, error: "Please choose a username first." };
  const key = identityNameKey(name);
  if (!key || key.length < 2) return { ok: false, status: 400, error: "Username is too short." };

  const current = await resolveAccount(db, visitorId || "");
  const currentKey = current.accountKey || "";
  const reserved = await db.prepare(`SELECT visitor_hash, name_key, name, avatar, COALESCE(is_public,0) AS is_public, bio, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE name_key = ?`).bind(key).first();
  if (reserved && String(reserved.visitor_hash || "") !== vh && currentKey !== key) {
    return { ok: false, status: 409, error: "This username is already used. Use the sync code from that account to connect this device." };
  }

  const now = Date.now();
  let avatar = cleanAvatar(rawAvatar || "");
  let isPublic = options.isPublic == null ? (current.identity ? Number(current.identity.is_public || 0) : 0) : (publicFlag(options.isPublic) ? 1 : 0);
  const hasBioOption = !!(options && Object.prototype.hasOwnProperty.call(options, "bio"));
  const oldIdentity = current.identity || null;
  const oldName = cleanProfileName(oldIdentity && oldIdentity.name || "");
  let oldAvatar = identityRawAvatarForCompare(oldIdentity && oldIdentity.avatar || "");
  if (options.keepAvatar) {
    const old = oldIdentity || await db.prepare(`SELECT avatar, bio FROM comment_identities WHERE visitor_hash = ?`).bind(vh).first();
    avatar = cleanAvatar(old && old.avatar || avatar || "");
    oldAvatar = identityRawAvatarForCompare(old && old.avatar || oldAvatar || "");
  }
  const previousBio = cleanProfileBio((oldIdentity && oldIdentity.bio) || (reserved && reserved.bio) || "");
  const bio = hasBioOption ? cleanProfileBio(options.bio || "") : previousBio;

  const hasExistingIdentity = !!(oldIdentity && currentKey);
  const nameChanged = hasExistingIdentity && (currentKey !== key || oldName !== name);
  const avatarChanged = hasExistingIdentity && !options.keepAvatar && (identityRawAvatarForCompare(avatar) !== oldAvatar);
  const lastNameChange = Number(oldIdentity && oldIdentity.name_changed_at || 0);
  const lastAvatarChange = Number(oldIdentity && oldIdentity.avatar_changed_at || 0);
  if (nameChanged && lastNameChange && now < lastNameChange + PROFILE_CHANGE_COOLDOWN_MS) {
    return profileCooldownError("username", lastNameChange + PROFILE_CHANGE_COOLDOWN_MS);
  }
  if (avatarChanged && lastAvatarChange && now < lastAvatarChange + PROFILE_CHANGE_COOLDOWN_MS) {
    return profileCooldownError("avatar", lastAvatarChange + PROFILE_CHANGE_COOLDOWN_MS);
  }

  const nextNameChangedAt = nameChanged ? now : (hasExistingIdentity ? lastNameChange : now);
  const nextAvatarChangedAt = avatarChanged ? now : (hasExistingIdentity ? lastAvatarChange : (avatar ? now : 0));

  if (currentKey && currentKey !== key) {
    const conflict = await db.prepare(`SELECT visitor_hash FROM comment_identities WHERE name_key = ?`).bind(key).first();
    if (conflict) return { ok: false, status: 409, error: "This username is already used." };
    await db.prepare(`UPDATE comment_identities SET name = ?, name_key = ?, avatar = ?, is_public = ?, bio = ?, updated_at = ?, name_changed_at = ?, avatar_changed_at = ? WHERE name_key = ?`).bind(name, key, avatar, isPublic, bio, now, nextNameChangedAt, nextAvatarChangedAt, currentKey).run();
    await renameAccountKeyEverywhere(db, currentKey, key);
  } else if (reserved) {
    await db.prepare(`UPDATE comment_identities SET name = ?, avatar = ?, is_public = ?, bio = ?, updated_at = ?, name_changed_at = ?, avatar_changed_at = ? WHERE name_key = ?`).bind(name, avatar, isPublic, bio, now, nextNameChangedAt, nextAvatarChangedAt, key).run();
  } else {
    await db.prepare(`
      INSERT INTO comment_identities (visitor_hash, name, name_key, avatar, is_public, bio, created_at, updated_at, name_changed_at, avatar_changed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(visitor_hash) DO UPDATE SET
        name = excluded.name,
        name_key = excluded.name_key,
        avatar = excluded.avatar,
        is_public = excluded.is_public,
        bio = excluded.bio,
        updated_at = excluded.updated_at,
        name_changed_at = CASE WHEN COALESCE(comment_identities.name_key,'') != excluded.name_key OR COALESCE(comment_identities.name,'') != excluded.name THEN excluded.name_changed_at ELSE COALESCE(comment_identities.name_changed_at, excluded.name_changed_at) END,
        avatar_changed_at = CASE WHEN COALESCE(comment_identities.avatar,'') != excluded.avatar THEN excluded.avatar_changed_at ELSE COALESCE(comment_identities.avatar_changed_at, excluded.avatar_changed_at) END
    `).bind(vh, name, key, avatar, isPublic, bio, now, now, nextNameChangedAt, nextAvatarChangedAt).run();
  }
  await touchDeviceLink(db, vh, key, null, options.deviceName || "");
  try { await db.prepare(`UPDATE comments SET account_key = ? WHERE visitor_hash = ? AND (account_key IS NULL OR account_key = '')`).bind(key, vh).run(); } catch (_) {}
  try { await db.prepare(`UPDATE favorites SET account_key = ? WHERE visitor_hash = ? AND (account_key IS NULL OR account_key = '')`).bind(key, vh).run(); } catch (_) {}
  const row = await db.prepare(`SELECT visitor_hash, name, name_key, avatar, COALESCE(is_public,0) AS is_public, bio, updated_at, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE name_key = ?`).bind(key).first();
  return { ok: true, visitorHash: vh, accountKey: key, created: !hasExistingIdentity && !reserved, changed: !!(nameChanged || avatarChanged), profile: {
    name: row.name,
    avatar: row.avatar || "",
    bio: cleanProfileBio(row.bio || ""),
    isPublic: !!Number(row.is_public || 0),
    accountKey: key,
    updatedAt: Number(row.updated_at || now),
    nameChangedAt: Number(row.name_changed_at || 0),
    avatarChangedAt: Number(row.avatar_changed_at || 0),
    nameCooldownUntil: Number(row.name_changed_at || 0) ? Number(row.name_changed_at || 0) + PROFILE_CHANGE_COOLDOWN_MS : 0,
    avatarCooldownUntil: Number(row.avatar_changed_at || 0) ? Number(row.avatar_changed_at || 0) + PROFILE_CHANGE_COOLDOWN_MS : 0,
    cooldownDays: 7,
  } };
}

function cleanText(s) {
  let text = String(s || "").replace(/\u0000/g, "").trim();
  if (text.length > 1200) text = text.slice(0, 1200);
  return text;
}

function cleanReportReason(s) {
  let text = String(s || "").replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
  if (text.length > 600) text = text.slice(0, 600);
  return text;
}

function adminKeyBodyFromUrl(url) {
  return {
    adminKey: url.searchParams.get("adminKey") || url.searchParams.get("key") || url.searchParams.get("token") || "",
  };
}

async function handleGetIdentity(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  return json({ ok: true, profile: await identityPayload(env.DB, acc.identity, req), nameAvailable: true }, 200, req, env);
}

async function handleSetIdentity(req, env) {
  const body = await readJson(req, 4096);
  const hasBioBody = Object.prototype.hasOwnProperty.call(body || {}, "bio") || Object.prototype.hasOwnProperty.call(body || {}, "description") || Object.prototype.hasOwnProperty.call(body || {}, "intro");
  const beforeAcc = await resolveAccount(env.DB, body.visitorId || "", req).catch(() => ({ identity: null, accountKey: "" }));
  const beforeBio = cleanProfileBio(beforeAcc && beforeAcc.identity && beforeAcc.identity.bio || "");
  const nextBio = hasBioBody ? cleanProfileBio(body.bio || body.description || body.intro || "") : "";
  const result = await claimIdentity(env.DB, body.visitorId || "", body.name || "", body.avatar || "", Object.assign({ keepAvatar: !!body.keepAvatar, isPublic: body.isPublic, deviceName: body.deviceName || "" }, hasBioBody ? { bio: nextBio } : {}));
  if (!result.ok) return json({ ok: false, error: result.error || "Could not save username" }, result.status || 400, req, env);
  let privacy = null;
  if (body.privacy && typeof body.privacy === "object") {
    privacy = await setPrivacySettings(env.DB, result.accountKey, privacyFromBody(body.privacy, body.privacy));
  } else if (body.isPublic != null) {
    privacy = await setPrivacySettings(env.DB, result.accountKey, allPrivacyValue(body.isPublic));
  }
  const row = await env.DB.prepare(`SELECT name, name_key, avatar, COALESCE(is_public,0) AS is_public, bio, updated_at, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE name_key = ?`).bind(result.accountKey).first();
  const profile = await identityPayload(env.DB, row, req);
  if (privacy) {
    profile.privacy = privacy;
    await bumpAccountActivity(env.DB, result.accountKey, "privacy_update", 1, { details: { source: "identity_profile_save" } });
  }
  if (hasBioBody && nextBio && nextBio !== beforeBio) {
    await bumpAccountActivity(env.DB, result.accountKey, "intro_update", 1, { details: { hadIntroBefore: !!beforeBio, introLength: nextBio.length, forceRepeat: !!beforeBio } });
  }
  return json({ ok: true, profile }, 200, req, env);
}


async function handleUnlinkIdentity(req, env) {
  const body = await readJson(req, 1024);
  const vh = await visitorHash(body.visitorId || "");
  if (!vh) return json({ ok: false, error: "Missing visitor id" }, 400, req, env);
  // This signs out only this browser/device from the cloud account. It does not
  // delete the cloud account, comments, saved pages, readiness, or mastery.
  try { await env.DB.prepare(`UPDATE account_device_links SET revoked_at = ?, last_seen = COALESCE(NULLIF(last_seen,0), linked_at) WHERE visitor_hash = ?`).bind(Date.now(), vh).run(); } catch (_) {}
  return json({ ok: true, unlinked: true }, 200, req, env);
}

async function handleDeleteIdentityAccount(req, env) {
  const body = await readJson(req, 2048);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  const key = acc.accountKey || "";
  if (!key || !acc.identity) return json({ ok: false, error: "No cloud account is connected to this browser." }, 400, req, env);

  const now = Date.now();
  const deletedName = "Deleted account";
  const devices = await env.DB.prepare(`SELECT visitor_hash FROM account_device_links WHERE name_key = ?`).bind(key).all().catch(() => ({ results: [] }));
  const deviceHashes = (devices.results || []).map(r => String(r.visitor_hash || "")).filter(Boolean);
  if (acc.visitorHash && !deviceHashes.includes(acc.visitorHash)) deviceHashes.push(acc.visitorHash);

  // Keep comments and reactions, but detach and anonymise the visible author.
  try { await env.DB.prepare(`UPDATE comments SET name = ?, account_key = '' WHERE account_key = ?`).bind(deletedName, key).run(); } catch (_) {}
  for (const vh of deviceHashes) {
    try { await env.DB.prepare(`UPDATE comments SET name = ?, account_key = '' WHERE visitor_hash = ?`).bind(deletedName, vh).run(); } catch (_) {}
  }

  // Remove synced account data. Emoji reactions are intentionally not deleted,
  // because their counts belong to the comments they reacted to.
  const deleteByAccount = [
    `DELETE FROM page_actions WHERE account_key = ?`,
    `DELETE FROM account_page_visits WHERE account_key = ?`,
    `DELETE FROM account_readiness WHERE account_key = ?`,
    `DELETE FROM account_mastery WHERE account_key = ?`,
    `DELETE FROM account_ai_quiz_sessions WHERE account_key = ?`,
    `DELETE FROM account_mastery_json_snapshot_chunks WHERE account_key = ?`,
    `DELETE FROM account_mastery_json_upload_chunks WHERE account_key = ?`,
    `DELETE FROM account_json_snapshot_chunks WHERE account_key = ?`,
    `DELETE FROM account_json_upload_chunks WHERE account_key = ?`,
    `DELETE FROM account_event_file_snapshot_chunks WHERE account_key = ?`,
    `DELETE FROM account_event_file_snapshot_versions WHERE account_key = ?`,
    `DELETE FROM account_event_file_snapshot_meta WHERE account_key = ?`,
    `DELETE FROM account_event_file_upload_chunks WHERE account_key = ?`,
    `DELETE FROM user_activity_daily WHERE account_key = ?`,
    `DELETE FROM user_activity_totals WHERE account_key = ?`,
    `DELETE FROM user_activity_events WHERE account_key = ?`,
    `DELETE FROM account_privacy_settings WHERE account_key = ?`,
    `DELETE FROM xp_cap_boost_vouchers WHERE account_key = ?`,
    `DELETE FROM favorites WHERE account_key = ?`,
    `DELETE FROM identity_sync_codes WHERE name_key = ?`,
    `DELETE FROM comment_mentions WHERE mentioned_key = ? OR actor_key = ?`,
    `DELETE FROM study_connections WHERE requester_key = ? OR target_key = ?`,
  ];
  for (const sql of deleteByAccount) {
    try {
      const paramCount = (sql.match(/\?/g) || []).length;
      await env.DB.prepare(sql).bind(...new Array(paramCount).fill(key)).run();
    } catch (_) {}
  }

  let oldAvatar = "";
  try {
    const old = await env.DB.prepare(`SELECT avatar FROM comment_identities WHERE name_key = ?`).bind(key).first();
    oldAvatar = old && old.avatar ? String(old.avatar) : "";
  } catch (_) {}
  try { await env.DB.prepare(`DELETE FROM account_device_links WHERE name_key = ?`).bind(key).run(); } catch (_) {}
  try { await env.DB.prepare(`DELETE FROM comment_identities WHERE name_key = ?`).bind(key).run(); } catch (_) {}

  const bucket = r2Bucket(env);
  const oldKey = r2KeyFromAvatar(oldAvatar);
  if (bucket && oldKey) { try { await bucket.delete(oldKey); } catch (_) {} }

  return json({ ok: true, deleted: true, accountKey: key, deletedAt: now }, 200, req, env);
}



function connectionRowForClient(row, req, side) {
  const otherKey = String(row.other_key || "");
  const otherName = cleanName(row.other_name || otherKey || "");
  return {
    requesterKey: String(row.requester_key || ""),
    targetKey: String(row.target_key || ""),
    status: String(row.status || "pending"),
    createdAt: Number(row.created_at || 0),
    updatedAt: Number(row.updated_at || 0),
    direction: side || String(row.direction || ""),
    otherAccountKey: otherKey,
    otherName,
    otherAvatar: publicAvatarForClient(req, row.other_avatar || ""),
  };
}

async function handleGetConnections(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Save or connect a username first." }, 400, req, env);
  const key = acc.accountKey;
  const incoming = await env.DB.prepare(`
    SELECT sc.*, i.name AS other_name, i.avatar AS other_avatar, sc.requester_key AS other_key
    FROM study_connections sc
    LEFT JOIN comment_identities i ON i.name_key = sc.requester_key
    WHERE sc.target_key = ? AND sc.status = 'pending'
    ORDER BY sc.created_at DESC
  `).bind(key).all();
  const outgoing = await env.DB.prepare(`
    SELECT sc.*, i.name AS other_name, i.avatar AS other_avatar, sc.target_key AS other_key
    FROM study_connections sc
    LEFT JOIN comment_identities i ON i.name_key = sc.target_key
    WHERE sc.requester_key = ? AND sc.status = 'pending'
    ORDER BY sc.created_at DESC
  `).bind(key).all();
  const accepted = await env.DB.prepare(`
    SELECT sc.*,
      CASE WHEN sc.requester_key = ? THEN sc.target_key ELSE sc.requester_key END AS other_key,
      i.name AS other_name, i.avatar AS other_avatar
    FROM study_connections sc
    LEFT JOIN comment_identities i ON i.name_key = CASE WHEN sc.requester_key = ? THEN sc.target_key ELSE sc.requester_key END
    WHERE (sc.requester_key = ? OR sc.target_key = ?) AND sc.status = 'accepted'
    ORDER BY sc.updated_at DESC
  `).bind(key, key, key, key).all();
  return json({ ok: true, accountKey: key, incoming: (incoming.results || []).map(r => connectionRowForClient(r, req, "incoming")), outgoing: (outgoing.results || []).map(r => connectionRowForClient(r, req, "outgoing")), connections: (accepted.results || []).map(r => connectionRowForClient(r, req, "accepted")) }, 200, req, env);
}

async function handleConnectionRequest(req, env) {
  const body = await readJson(req, 2048);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Save or connect a username first." }, 400, req, env);
  const targetName = cleanProfileName(body.targetName || body.name || body.target || "");
  const targetKey = identityNameKey(targetName);
  if (!targetKey) return json({ ok: false, error: "Enter a username to connect with." }, 400, req, env);
  if (targetKey === acc.accountKey) return json({ ok: false, error: "You cannot connect with yourself." }, 400, req, env);
  const target = await env.DB.prepare(`SELECT name_key FROM comment_identities WHERE name_key = ?`).bind(targetKey).first();
  if (!target) return json({ ok: false, error: "No user with that username was found." }, 404, req, env);
  const reverse = await env.DB.prepare(`SELECT status FROM study_connections WHERE requester_key = ? AND target_key = ?`).bind(targetKey, acc.accountKey).first();
  const now = Date.now();
  if (reverse && reverse.status === "pending") {
    await env.DB.prepare(`UPDATE study_connections SET status = 'accepted', updated_at = ? WHERE requester_key = ? AND target_key = ?`).bind(now, targetKey, acc.accountKey).run();
    const myState = await rememberActivityActionState(env.DB, acc.accountKey, "connection_added", `connection:${targetKey}`, { other: targetKey }, now);
    const targetState = await rememberActivityActionState(env.DB, targetKey, "connection_added", `connection:${acc.accountKey}`, { other: acc.accountKey }, now);
    await bumpAccountActivity(env.DB, acc.accountKey, "connection_added", 1, { details: { other: targetKey, acceptedExistingRequest: true, forceRepeat: !!myState.hadEver } });
    await bumpAccountActivity(env.DB, targetKey, "connection_added", 1, { details: { other: acc.accountKey, acceptedExistingRequest: true, forceRepeat: !!targetState.hadEver } });
    return json({ ok: true, status: "accepted", acceptedExistingRequest: true }, 200, req, env);
  }
  if (reverse && reverse.status === "accepted") return json({ ok: true, status: "accepted", alreadyConnected: true }, 200, req, env);
  await env.DB.prepare(`INSERT INTO study_connections (requester_key, target_key, status, created_at, updated_at) VALUES (?, ?, 'pending', ?, ?) ON CONFLICT(requester_key, target_key) DO UPDATE SET status = CASE WHEN study_connections.status='accepted' THEN 'accepted' ELSE 'pending' END, updated_at = excluded.updated_at`).bind(acc.accountKey, targetKey, now, now).run();
  const reqState = await rememberActivityActionState(env.DB, acc.accountKey, "connection_request", `connection:${targetKey}`, { target: targetKey }, now);
  await bumpAccountActivity(env.DB, acc.accountKey, "connection_request", 1, { details: { target: targetKey, other: targetKey, forceRepeat: !!reqState.hadEver } });
  return json({ ok: true, status: "pending" }, 200, req, env);
}

async function handleConnectionRespond(req, env) {
  const body = await readJson(req, 2048);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Save or connect a username first." }, 400, req, env);
  const requesterKey = identityNameKey(body.requesterKey || body.requesterName || body.name || "");
  const action = String(body.action || "").toLowerCase();
  if (!requesterKey || !["accept", "decline"].includes(action)) return json({ ok: false, error: "Invalid connection response." }, 400, req, env);
  const row = await env.DB.prepare(`SELECT requester_key, target_key, status FROM study_connections WHERE requester_key = ? AND target_key = ? AND status = 'pending'`).bind(requesterKey, acc.accountKey).first();
  if (!row) return json({ ok: false, error: "Connection request not found." }, 404, req, env);
  const now = Date.now();
  if (action === "accept") {
    await env.DB.prepare(`UPDATE study_connections SET status = 'accepted', updated_at = ? WHERE requester_key = ? AND target_key = ?`).bind(now, requesterKey, acc.accountKey).run();
    const myState = await rememberActivityActionState(env.DB, acc.accountKey, "connection_added", `connection:${requesterKey}`, { other: requesterKey }, now);
    const requesterState = await rememberActivityActionState(env.DB, requesterKey, "connection_added", `connection:${acc.accountKey}`, { other: acc.accountKey }, now);
    await bumpAccountActivity(env.DB, acc.accountKey, "connection_added", 1, { details: { other: requesterKey, acceptedBy: acc.accountKey, forceRepeat: !!myState.hadEver } });
    await bumpAccountActivity(env.DB, requesterKey, "connection_added", 1, { details: { other: acc.accountKey, acceptedBy: acc.accountKey, forceRepeat: !!requesterState.hadEver } });
    return json({ ok: true, status: "accepted" }, 200, req, env);
  }
  await env.DB.prepare(`DELETE FROM study_connections WHERE requester_key = ? AND target_key = ?`).bind(requesterKey, acc.accountKey).run();
  return json({ ok: true, status: "declined" }, 200, req, env);
}

async function handleConnectionRemove(req, env) {
  const body = await readJson(req, 2048);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Save or connect a username first." }, 400, req, env);
  const otherKey = identityNameKey(body.accountKey || body.name || body.otherName || "");
  if (!otherKey) return json({ ok: false, error: "Missing user." }, 400, req, env);

  const row = await env.DB.prepare(`
    SELECT requester_key, target_key, status
    FROM study_connections
    WHERE (requester_key = ? AND target_key = ?) OR (requester_key = ? AND target_key = ?)
    LIMIT 1
  `).bind(acc.accountKey, otherKey, otherKey, acc.accountKey).first().catch(() => null);

  await env.DB.prepare(`DELETE FROM study_connections WHERE (requester_key = ? AND target_key = ?) OR (requester_key = ? AND target_key = ?)`).bind(acc.accountKey, otherKey, otherKey, acc.accountKey).run();

  let xpRefund = { refunded: false, deleted: 0, score: 0 };
  if (row && String(row.status || "") === "accepted") {
    xpRefund = await refundConnectionActivityForAccount(env.DB, acc.accountKey, otherKey, "accepted").catch((err) => ({ refunded: false, deleted: 0, score: 0, error: String(err && err.message || err || "refund_failed") }));
  } else if (row && String(row.status || "") === "pending" && String(row.requester_key || "") === String(acc.accountKey || "")) {
    xpRefund = await refundConnectionActivityForAccount(env.DB, acc.accountKey, otherKey, "pending").catch((err) => ({ refunded: false, deleted: 0, score: 0, error: String(err && err.message || err || "refund_failed") }));
  }

  return json({ ok: true, removed: !!row, status: row ? String(row.status || "") : "", xpRefund }, 200, req, env);
}


async function handleGetPrivacy(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Save or connect a username first." }, 400, req, env);
  const privacy = await getPrivacySettings(env.DB, acc.accountKey, acc.identity);
  return json({ ok: true, privacy: privacyForClient(privacy), profile: await identityPayload(env.DB, acc.identity, req) }, 200, req, env);
}

async function handleSetPrivacy(req, env) {
  const body = await readJson(req, 4096);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Save or connect a username first." }, 400, req, env);
  const current = await getPrivacySettings(env.DB, acc.accountKey, acc.identity);
  const privacy = await setPrivacySettings(env.DB, acc.accountKey, privacyFromBody(body.privacy || body, current));
  await bumpAccountActivity(env.DB, acc.accountKey, "privacy_update", 1, { details: { source: "privacy_settings" } });
  const row = await env.DB.prepare(`SELECT name, name_key, avatar, COALESCE(is_public,0) AS is_public, bio, updated_at, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE name_key = ?`).bind(acc.accountKey).first();
  return json({ ok: true, privacy: privacyForClient(privacy), profile: await identityPayload(env.DB, row, req) }, 200, req, env);
}

function cleanReadiness(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n <= 1 && n >= 0) return Math.round(n * 1000) / 10;
  return Math.max(0, Math.min(100, Math.round(n * 10) / 10));
}

async function handleSetReadiness(req, env) {
  const body = await readJson(req, 4096);
  const path = normalizePath(body.path || body.conceptPath || "");
  if (!path || !isConceptPath(path)) return json({ ok: false, error: "Missing concept path." }, 400, req, env);
  const readiness = cleanReadiness(body.readiness != null ? body.readiness : (body.percent != null ? body.percent : body.score));
  if (readiness == null) return json({ ok: false, error: "Missing readiness percentage." }, 400, req, env);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Save or connect a username before syncing readiness." }, 400, req, env);
  const title = cleanTitle(body.title || "", path);
  const now = Date.now();
  await touchPage(env.DB, path, title, now);
  await env.DB.prepare(`
    INSERT INTO account_readiness (account_key, path, title, readiness, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(account_key, path) DO UPDATE SET
      title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_readiness.title END,
      readiness = excluded.readiness,
      updated_at = excluded.updated_at
  `).bind(acc.accountKey, path, title, readiness, now).run();
  return handleGetReadiness(req, env, new URL(`${new URL(req.url).origin}/readiness?path=${encodeURIComponent(path)}&visitorId=${encodeURIComponent(body.visitorId || "")}`));
}

async function handleGetReadiness(req, env, url) {
  const path = normalizePath(url.searchParams.get("path") || url.searchParams.get("conceptPath") || "");
  if (!path || !isConceptPath(path)) return json({ ok: false, error: "Missing concept path." }, 400, req, env);
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  const avgRow = await env.DB.prepare(`
    SELECT AVG(r.readiness) AS avg_readiness, COUNT(*) AS c
    FROM account_readiness r
    JOIN account_privacy_settings ps ON ps.account_key = r.account_key
    WHERE r.path = ? AND COALESCE(ps.readiness_visibility, CASE WHEN COALESCE(ps.readiness_public,0)=1 THEN 'public' ELSE 'private' END) = 'public'
  `).bind(path).first();
  let myRow = null;
  if (acc.accountKey) {
    myRow = await env.DB.prepare(`SELECT readiness, updated_at FROM account_readiness WHERE account_key = ? AND path = ?`).bind(acc.accountKey, path).first();
  }
  const average = avgRow && avgRow.avg_readiness != null ? Math.round(Number(avgRow.avg_readiness) * 10) / 10 : null;
  const mine = myRow && myRow.readiness != null ? Math.round(Number(myRow.readiness) * 10) / 10 : null;
  return json({ ok: true, path, average, count: Number(avgRow && avgRow.c || 0), myReadiness: mine, difference: average != null && mine != null ? Math.round((mine - average) * 10) / 10 : null, updatedAt: Number(myRow && myRow.updated_at || 0) }, 200, req, env);
}

function cleanConceptScoreType(value) {
  const s = String(value || "").trim().toLowerCase();
  if (s === "mastery" || s === "mastery_readiness" || s === "mastery-readiness") return "mastery";
  if (s === "prereq" || s === "prerequisite" || s === "prerequisite_readiness" || s === "prerequisite-readiness") return "prereq";
  return "";
}

async function handleSetConceptScore(req, env) {
  const body = await readJson(req, 20000);
  const path = normalizePath(body.path || body.conceptPath || "");
  if (!path || !isConceptPath(path)) return json({ ok: false, error: "Missing concept path." }, 400, req, env);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username before syncing concept scores." }, 400, req, env);
  const title = cleanTitle(body.title || "", path);
  const now = Date.now();
  await touchPage(env.DB, path, title, now);

  const entries = [];
  if (body.scores && typeof body.scores === "object") {
    for (const [k, v] of Object.entries(body.scores)) {
      const type = cleanConceptScoreType(k);
      const score = cleanReadiness(v);
      if (type && score != null) entries.push([type, score]);
    }
  } else {
    const type = cleanConceptScoreType(body.type || body.scoreType);
    const score = cleanReadiness(body.score != null ? body.score : body.value);
    if (type && score != null) entries.push([type, score]);
  }
  if (!entries.length) return json({ ok: false, error: "Missing concept score." }, 400, req, env);

  for (const [type, score] of entries) {
    await env.DB.prepare(`
      INSERT INTO account_concept_scores (account_key, path, title, score_type, score, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(account_key, path, score_type) DO UPDATE SET
        title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_concept_scores.title END,
        score = excluded.score,
        updated_at = excluded.updated_at
    `).bind(acc.accountKey, path, title, type, score, now).run();
  }
  return json({ ok: true, path, saved: entries.map(([type, score]) => ({ type, score })) }, 200, req, env);
}

async function handleGetConceptScoreAverage(req, env, url) {
  const path = normalizePath(url.searchParams.get("path") || url.searchParams.get("conceptPath") || "");
  if (!path || !isConceptPath(path)) return json({ ok: false, error: "Missing concept path." }, 400, req, env);
  const type = cleanConceptScoreType(url.searchParams.get("type") || url.searchParams.get("scoreType") || "mastery");
  if (!type) return json({ ok: false, error: "Invalid score type." }, 400, req, env);
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  const avgRow = await env.DB.prepare(`
    SELECT AVG(s.score) AS avg_score, COUNT(*) AS c
    FROM account_concept_scores s
    JOIN account_privacy_settings ps ON ps.account_key = s.account_key
    WHERE s.path = ?
      AND s.score_type = ?
      AND COALESCE(ps.readiness_visibility, CASE WHEN COALESCE(ps.readiness_public,0)=1 THEN 'public' ELSE 'private' END) = 'public'
  `).bind(path, type).first();
  let myRow = null;
  if (acc.accountKey) {
    myRow = await env.DB.prepare(`SELECT score, updated_at FROM account_concept_scores WHERE account_key = ? AND path = ? AND score_type = ?`).bind(acc.accountKey, path, type).first();
  }
  const average = avgRow && avgRow.avg_score != null ? Math.round(Number(avgRow.avg_score) * 10) / 10 : null;
  const mine = myRow && myRow.score != null ? Math.round(Number(myRow.score) * 10) / 10 : null;
  return json({ ok: true, path, type, average, count: Number(avgRow && avgRow.c || 0), myScore: mine, updatedAt: Number(myRow && myRow.updated_at || 0) }, 200, req, env);
}

function makeSyncCode() {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let out = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

function makeRecoveryCode() {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out.replace(/(.{4})/g, "$1-").replace(/-$/g, "");
}

function cleanRecoveryCode(value) {
  return String(value || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

async function recoveryCodeHash(accountKey, code) {
  return sha(`${identityNameKey(accountKey)}:recovery:${cleanRecoveryCode(code)}`);
}

async function handleCreateRecoveryCode(req, env) {
  const body = await readJson(req, 1024);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey || !acc.identity) return json({ ok: false, error: "Save a username before creating a recovery code." }, 400, req, env);
  const customCode = cleanRecoveryCode(body.code || body.customCode || body.custom_code || "");
  if (customCode && (customCode.length < 8 || customCode.length > 64)) return json({ ok: false, error: "Recovery code must contain 8 to 64 letters or numbers." }, 400, req, env);
  const code = customCode || makeRecoveryCode();
  const hash = await recoveryCodeHash(acc.accountKey, code);
  const now = Date.now();
  await env.DB.prepare(`
    INSERT INTO identity_recovery_codes (name_key, code_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(name_key) DO UPDATE SET
      code_hash = excluded.code_hash,
      updated_at = excluded.updated_at
  `).bind(acc.accountKey, hash, now, now).run();
  try { await touchDeviceLink(env.DB, acc.visitorHash, acc.accountKey, req, body.deviceName || ""); } catch (_) {}
  return json({ ok: true, name: acc.identity.name, code, createdAt: now, message: "Save this recovery code. It replaces the old recovery code and is shown only now." }, 200, req, env);
}

async function handleClaimRecoveryCode(req, env) {
  const body = await readJson(req, 1024);
  const name = cleanProfileName(body.name || "");
  const code = cleanRecoveryCode(body.code || "");
  if (!name || !code) return json({ ok: false, error: "Enter the username and recovery code." }, 400, req, env);
  const key = identityNameKey(name);
  const row = await env.DB.prepare(`SELECT code_hash FROM identity_recovery_codes WHERE name_key = ?`).bind(key).first().catch(() => null);
  if (!row || !row.code_hash) return json({ ok: false, error: "No recovery code is set for this account." }, 401, req, env);
  const hash = await recoveryCodeHash(key, code);
  if (String(row.code_hash || "") !== hash) return json({ ok: false, error: "This recovery code is invalid." }, 401, req, env);
  const vh = await visitorHash(body.visitorId || "");
  await touchDeviceLink(env.DB, vh, key, req, body.deviceName || "");
  try { await env.DB.prepare(`UPDATE comments SET account_key = ? WHERE visitor_hash = ? AND (account_key IS NULL OR account_key = '')`).bind(key, vh).run(); } catch (_) {}
  try { await env.DB.prepare(`UPDATE favorites SET account_key = ? WHERE visitor_hash = ? AND (account_key IS NULL OR account_key = '')`).bind(key, vh).run(); } catch (_) {}
  await bumpAccountActivity(env.DB, key, "sync_device_connected", 1, { details: { visitorHash: vh, method: "recovery_code" } });
  const ident = await env.DB.prepare(`SELECT name, name_key, avatar, COALESCE(is_public,0) AS is_public, bio, updated_at, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE name_key = ?`).bind(key).first();
  return json({ ok: true, profile: await identityPayload(env.DB, ident, req) }, 200, req, env);
}

async function handleGetDevices(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  try { await touchDeviceLink(env.DB, acc.visitorHash, acc.accountKey, req, url.searchParams.get("deviceName") || ""); } catch (_) {}
  const rows = await env.DB.prepare(`
    SELECT visitor_hash, COALESCE(device_name,'This device') AS device_name, linked_at, COALESCE(last_seen,0) AS last_seen, COALESCE(revoked_at,0) AS revoked_at
    FROM account_device_links
    WHERE name_key = ?
    ORDER BY COALESCE(revoked_at,0) ASC, COALESCE(last_seen, linked_at) DESC
    LIMIT 100
  `).bind(acc.accountKey).all();
  return json({ ok: true, currentVisitorHash: acc.visitorHash, devices: (rows.results || []).map(r => ({
    visitorHash: String(r.visitor_hash || ""),
    deviceName: cleanDeviceName(r.device_name || "This device"),
    linkedAt: Number(r.linked_at || 0),
    lastSeen: Number(r.last_seen || r.linked_at || 0),
    revokedAt: Number(r.revoked_at || 0),
    current: String(r.visitor_hash || "") === acc.visitorHash,
  })) }, 200, req, env);
}

async function handleSetDeviceName(req, env) {
  const body = await readJson(req, 2048);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const nm = cleanDeviceName(body.deviceName || body.name || "");
  await env.DB.prepare(`UPDATE account_device_links SET device_name = ?, last_seen = ?, revoked_at = 0 WHERE visitor_hash = ? AND name_key = ?`).bind(nm, Date.now(), acc.visitorHash, acc.accountKey).run();
  return json({ ok: true, deviceName: nm }, 200, req, env);
}

async function handleDisconnectDevice(req, env) {
  const body = await readJson(req, 2048);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const target = String(body.targetVisitorHash || body.visitorHashToDisconnect || body.deviceVisitorHash || "").trim();
  if (!target) return json({ ok: false, error: "Missing device id." }, 400, req, env);
  if (target === acc.visitorHash) return json({ ok: false, error: "Use Remove this account from this browser to disconnect the current device." }, 400, req, env);
  const row = await env.DB.prepare(`SELECT visitor_hash FROM account_device_links WHERE visitor_hash = ? AND name_key = ?`).bind(target, acc.accountKey).first();
  if (!row) return json({ ok: false, error: "Device not found on this account." }, 404, req, env);
  await env.DB.prepare(`UPDATE account_device_links SET revoked_at = ?, last_seen = COALESCE(NULLIF(last_seen,0), linked_at) WHERE visitor_hash = ? AND name_key = ?`).bind(Date.now(), target, acc.accountKey).run();
  return json({ ok: true }, 200, req, env);
}

async function handleCreateSyncCode(req, env) {
  const body = await readJson(req, 1024);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey || !acc.identity) return json({ ok: false, error: "Save a username before generating a sync code." }, 400, req, env);
  const code = makeSyncCode();
  const codeHash = await sha(`${acc.accountKey}:${code}`);
  const now = Date.now();
  const expiresAt = now + 10 * 60 * 1000;
  await env.DB.prepare(`DELETE FROM identity_sync_codes WHERE expires_at < ? OR source_visitor_hash = ?`).bind(now, acc.visitorHash).run();
  await env.DB.prepare(`INSERT INTO identity_sync_codes (code_hash, name_key, source_visitor_hash, created_at, expires_at, used_at) VALUES (?, ?, ?, ?, ?, 0)`).bind(codeHash, acc.accountKey, acc.visitorHash, now, expiresAt).run();
  return json({ ok: true, name: acc.identity.name, code, expiresAt }, 200, req, env);
}

async function handleClaimSyncCode(req, env) {
  const body = await readJson(req, 1024);
  const name = cleanProfileName(body.name || "");
  const code = String(body.code || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (!name || !code) return json({ ok: false, error: "Enter the username and sync code." }, 400, req, env);
  const key = identityNameKey(name);
  const codeHash = await sha(`${key}:${code}`);
  const now = Date.now();
  const row = await env.DB.prepare(`SELECT code_hash, name_key, expires_at, used_at FROM identity_sync_codes WHERE code_hash = ? AND name_key = ?`).bind(codeHash, key).first();
  if (!row || Number(row.expires_at || 0) < now || Number(row.used_at || 0) > 0) return json({ ok: false, error: "This sync code is invalid or has expired." }, 401, req, env);
  const vh = await visitorHash(body.visitorId || "");
  await touchDeviceLink(env.DB, vh, key, req, body.deviceName || "");
  try { await env.DB.prepare(`UPDATE comments SET account_key = ? WHERE visitor_hash = ? AND (account_key IS NULL OR account_key = '')`).bind(key, vh).run(); } catch (_) {}
  try { await env.DB.prepare(`UPDATE favorites SET account_key = ? WHERE visitor_hash = ? AND (account_key IS NULL OR account_key = '')`).bind(key, vh).run(); } catch (_) {}
  await env.DB.prepare(`UPDATE identity_sync_codes SET used_at = ? WHERE code_hash = ?`).bind(now, codeHash).run();
  await bumpAccountActivity(env.DB, key, "sync_device_connected", 1, { details: { visitorHash: vh } });
  const ident = await env.DB.prepare(`SELECT name, name_key, avatar, COALESCE(is_public,0) AS is_public, bio, updated_at, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE name_key = ?`).bind(key).first();
  return json({ ok: true, profile: await identityPayload(env.DB, ident, req) }, 200, req, env);
}


async function handlePublicProfile(req, env, url) {
  const name = cleanProfileName(url.searchParams.get("name") || "");
  const accountParam = String(url.searchParams.get("account") || "").replace(/^user:/i, "").trim();
  // Rankings rows carry the stable account key. Prefer it over display name so
  // profile opening does not break after case/spacing/display-name differences.
  const key = identityNameKey(accountParam || name || "");
  if (!key) return json({ ok: false, error: "Missing profile name" }, 400, req, env);
  const viewer = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "");
  const viewerKey = viewer.accountKey || "";
  const ident = await env.DB.prepare(`SELECT name, name_key, avatar, COALESCE(is_public,0) AS is_public, bio, updated_at, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE name_key = ?`).bind(key).first();
  if (!ident) return json({ ok: false, error: "This profile is unavailable." }, 404, req, env);
  const privacy = await getPrivacySettings(env.DB, key, ident);
  const may = {
    profile: await canViewVisibility(env.DB, viewerKey, key, privacy.profileVisibility),
    visits: await canViewVisibility(env.DB, viewerKey, key, privacy.visitsVisibility),
    actions: await canViewVisibility(env.DB, viewerKey, key, privacy.actionsVisibility),
    comments: await canViewVisibility(env.DB, viewerKey, key, privacy.commentsVisibility),
    readiness: await canViewVisibility(env.DB, viewerKey, key, privacy.readinessVisibility),
    ranking: await canViewVisibility(env.DB, viewerKey, key, privacy.rankingVisibility),
  };
  const anyVisible = may.profile || may.visits || may.actions || may.comments || may.readiness || may.ranking;
  if (!anyVisible) return json({ ok: false, error: "This profile is private." }, 403, req, env);
  const xpCalc = await getAccountXpCalculation(env.DB, key, { period: "all" });
  const totalScore = Number(xpCalc.totalScore || 0);
  // Keep the leaderboard projection for this account fresh too: viewing a public
  // profile recomputes its authoritative XP, so persist it here so the rankings
  // list stops showing an older, lower value than the profile itself.
  if (Number(xpCalc.eventFileEventCount || 0) > 0) {
    try { await updateUserRankingProjectionFromCalc(env.DB, key, xpCalc, "public-profile refresh"); } catch (_) {}
  }
  const totals = { results: Array.isArray(xpCalc.breakdown) ? xpCalc.breakdown : [] };
  const visits = may.visits ? await env.DB.prepare(`SELECT path, title, visit_count, first_visited, last_visited FROM account_page_visits WHERE account_key = ? ORDER BY last_visited DESC LIMIT 30`).bind(key).all() : { results: [] };
  const actions = may.actions ? await env.DB.prepare(`SELECT path, title, action, created_at, updated_at FROM page_actions WHERE account_key = ? ORDER BY updated_at DESC LIMIT 40`).bind(key).all() : { results: [] };
  const comments = may.comments ? await env.DB.prepare(`SELECT c.id, c.path, COALESCE(p.title,c.path) AS title, c.text, c.ts, c.edited_at FROM comments c LEFT JOIN pages p ON p.path = c.path WHERE c.account_key = ? AND COALESCE(c.deleted_at,0)=0 ORDER BY c.ts DESC LIMIT 30`).bind(key).all() : { results: [] };
  const readiness = may.readiness ? await env.DB.prepare(`SELECT r.path, COALESCE(p.title, r.title, r.path) AS title, r.readiness, r.updated_at FROM account_readiness r LEFT JOIN pages p ON p.path = r.path WHERE r.account_key = ? ORDER BY r.updated_at DESC LIMIT 40`).bind(key).all() : { results: [] };
  const profile = await identityPayload(env.DB, ident, req);
  profile.privacy = privacyForClient(privacy);
  profile.equippedCosmetics = xpCalc.equippedCosmetics || {};
  return json({ ok: true, profile: may.profile ? profile : { name: "Anonymous", avatar: "", accountKey: key }, viewerIsConnection: viewerKey ? await areConnected(env.DB, viewerKey, key) : false, visibility: may, level: userLevel(totalScore), totalScore: roundScore(totalScore), dailyCap: userDailyXpCapForTotal(totalScore || 0), equippedCosmetics: xpCalc.equippedCosmetics || {}, totals: may.ranking ? (totals.results || []) : [], visits: visits.results || [], actions: actions.results || [], comments: comments.results || [], readiness: readiness.results || [] }, 200, req, env);
}


function importedHistoryTs(item) {
  if (!item || typeof item !== "object") return 0;
  return normaliseTimestamp(item.ts || item.time || item.at || item.date || item.createdAt || item.created_at || 0);
}

function importedHistoryKind(item) {
  const kind = String(item && (item.kind || item.type || item.event || item.action) || "").toLowerCase().trim();
  if (kind === "view" || kind === "visit" || kind === "seen") return "view";
  return "mastery";
}

function importedHistoryMastery(item) {
  const raw = item && (item.m != null ? item.m : item.level != null ? item.level : item.mastery);
  const n = Number(raw);
  return [0, 1, 2, 3].includes(n) ? n : null;
}

async function insertImportedUserActivityEvent(db, accountKey, metric, path, title, ts, details) {
  const key = String(accountKey || "").trim();
  const m = activityMetric(metric);
  const p = normaliseImportedConceptPath(path || details && (details.conceptId || details.path) || "");
  const when = normaliseTimestamp(ts || details && (details.ts || details.createdAt || details.created_at) || 0) || Date.now();
  if (!key || !m) return false;
  if (["view", "mastery", "saved_page_action", "saved_page_visit", "ai_quiz"].includes(m) && !isConceptPath(p)) return false;
  if (m === "ai_quiz") return insertCanonicalAiQuizImportEvent(db, key, p, title, when, details || {});
  const d = details && typeof details === "object" ? Object.assign({}, details) : {};
  d.localHistoryImport = true;
  d.importVersion = 6;
  const semantic = m === "mastery" ? String(d.mastery != null ? d.mastery : d.m != null ? d.m : "")
    : m === "saved_page_action" ? String(d.action || d.savedAction || "")
    : String(d.visitId || d.visit_id || "");
  const bucket = m === "view" ? Math.floor(Number(when || 0) / 5000) : Number(when || 0);
  const eventId = `local-${m}-${activityHashString([key, p, bucket, semantic, d.source || ""].join("::"))}`;
  const count = 1;
  const score = Math.round(activityXp(m) * 100) / 100;
  try {
    await db.prepare(`
      INSERT OR IGNORE INTO user_activity_events (id, account_key, metric, count, score, path, title, details_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(eventId, key, m, count, score, p, cleanTitle(title || "", p), safeDetailsJson(d), when).run();
    return true;
  } catch (_) {
    return false;
  }
}

function localMasteryHistoryEventsFromImportEntry(entry, data, path, fallbackTitle) {
  const title = cleanTitle((entry && entry.title) || (data && data.title) || fallbackTitle || "", path);
  const history = Array.isArray(data && data.history) ? data.history
    : Array.isArray(data && data.reviewHistory) ? data.reviewHistory
    : Array.isArray(data && data.masteryHistory) ? data.masteryHistory
    : [];
  const out = [];
  let hasView = false;
  let hasMastery = false;
  let sawMasteryState = false;
  let lastMasteryState = null;
  const sortedHistory = history.slice().sort((a, b) => importedHistoryTs(a) - importedHistoryTs(b));
  for (const item of sortedHistory) {
    if (!item || typeof item !== "object") continue;
    const ts = importedHistoryTs(item);
    if (!ts) continue;
    const kind = importedHistoryKind(item);
    if (kind === "view") {
      hasView = true;
      out.push({ metric: "view", path, title, ts, details: { source: item.source || "mastery-history-view", visitId: item.visitId || item.visit_id || "", historyKind: "view" } });
      continue;
    }
    const mm = importedHistoryMastery(item);
    if (mm == null) continue;
    const isCreate = !sawMasteryState;
    const isChange = sawMasteryState && Number(lastMasteryState) !== Number(mm);
    hasMastery = true;
    if (isCreate || isChange) {
      out.push({ metric: "mastery", path, title, ts, details: {
        source: item.source || "mastery-history-rating",
        mastery: mm,
        oldMastery: sawMasteryState ? lastMasteryState : null,
        historyKind: "mastery",
        changeKind: isCreate ? "create" : "change",
        forceRepeat: !isCreate,
        repeatOnly: !isCreate
      } });
    }
    sawMasteryState = true;
    lastMasteryState = mm;
  }
  if (!hasView) {
    const lv = normaliseTimestamp(data && (data.lastViewed || data.lastSeen || data.viewedAt) || 0);
    if (lv) out.push({ metric: "view", path, title, ts: lv, details: { source: "mastery-last-viewed-fallback", historyKind: "view", fallback: true } });
  }
  if (!hasMastery) {
    const explicitUnrated = data && (data.unrated === true || String(data.state || "").toLowerCase() === "unrated");
    const mm = explicitUnrated ? null : importedHistoryMastery(data || {});
    const lr = Math.max(
      normaliseTimestamp(data && (data.lastReviewed || data.last_reviewed) || 0),
      normaliseTimestamp(data && (data.updatedAt || data.updated_at || data.ts) || 0)
    );
    if (mm != null && lr) out.push({ metric: "mastery", path, title, ts: lr, details: { source: "mastery-last-reviewed-fallback", mastery: mm, oldMastery: null, historyKind: "mastery", changeKind: "create", fallback: true } });
  }
  return out;
}

function parseJsonObjectSafe(text) {
  try {
    const obj = text ? JSON.parse(String(text)) : {};
    return obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
  } catch (_) { return {}; }
}

function masteryDataHasRating(data) {
  if (!data || typeof data !== "object") return false;
  if (data.unrated === true || String(data.state || "").toLowerCase() === "unrated") return false;
  return [0, 1, 2, 3].includes(Number(data.m));
}

function masteryDataRatingAt(data) {
  if (!masteryDataHasRating(data)) return 0;
  let t = Math.max(
    normaliseTimestamp(data.lastReviewed || 0),
    normaliseTimestamp(data.last_reviewed || 0)
  );
  const hist = Array.isArray(data.history) ? data.history
    : Array.isArray(data.reviewHistory) ? data.reviewHistory
    : Array.isArray(data.masteryHistory) ? data.masteryHistory
    : [];
  for (const h of hist) {
    if (!h || typeof h !== "object") continue;
    const kind = String(h.kind || h.type || h.event || h.action || "mastery").toLowerCase().trim();
    if (kind && kind !== "mastery" && kind !== "rating" && kind !== "rate") continue;
    const lv = h.m != null ? h.m : h.level != null ? h.level : h.mastery;
    if (![0, 1, 2, 3].includes(Number(lv))) continue;
    t = Math.max(t, normaliseTimestamp(h.ts || h.time || h.at || h.date || h.createdAt || h.created_at || 0));
  }
  return t || normaliseTimestamp(data.updatedAt || data.updated_at || data.ts || 0);
}

function masteryDataActivityAt(data) {
  if (!data || typeof data !== "object") return 0;
  return Math.max(
    masteryDataRatingAt(data),
    normaliseTimestamp(data.updatedAt || data.updated_at || data.ts || 0),
    normaliseTimestamp(data.lastViewed || data.lastSeen || data.viewedAt || 0)
  );
}

function masteryDataHistoryArray(data) {
  if (!data || typeof data !== "object") return [];
  if (Array.isArray(data.history)) return data.history;
  if (Array.isArray(data.reviewHistory)) return data.reviewHistory;
  if (Array.isArray(data.masteryHistory)) return data.masteryHistory;
  return [];
}

function masteryDataHistoryKey(h) {
  const kind = String(h && (h.kind || h.type || h.event || h.action) || "mastery").toLowerCase().trim() || "mastery";
  const lv = h && (h.m != null ? h.m : h.level != null ? h.level : h.mastery != null ? h.mastery : "");
  const ts = normaliseTimestamp(h && (h.ts || h.time || h.at || h.date || h.createdAt || h.created_at) || 0);
  const src = String(h && h.source || "").slice(0, 80);
  return [kind, ts, lv, src].join("::");
}

function mergeMasteryDataHistory(a, b) {
  const map = new Map();
  const add = (h) => {
    if (!h || typeof h !== "object") return;
    const k = masteryDataHistoryKey(h);
    if (!k || k === "mastery::0::::") return;
    map.set(k, Object.assign({}, map.get(k) || {}, h));
  };
  masteryDataHistoryArray(a).forEach(add);
  masteryDataHistoryArray(b).forEach(add);
  return Array.from(map.values()).sort((x, y) => normaliseTimestamp(x.ts || x.time || x.at || x.date || x.createdAt || x.created_at || 0) - normaliseTimestamp(y.ts || y.time || y.at || y.date || y.createdAt || y.created_at || 0)).slice(-1000);
}

function mergeMasteryDataForCloud(existingData, incomingData, row) {
  const old = existingData && typeof existingData === "object" ? existingData : {};
  const inc = incomingData && typeof incomingData === "object" ? incomingData : {};
  const oldRated = masteryDataHasRating(old) || (row && row.m != null && [0,1,2,3].includes(Number(row.m)));
  const incRated = masteryDataHasRating(inc);
  if (oldRated && old.m == null && row && row.m != null) old.m = Number(row.m);
  if (row && row.last_reviewed && !old.lastReviewed) old.lastReviewed = Number(row.last_reviewed || 0);
  if (row && row.view_count && old.viewCount == null) old.viewCount = Number(row.view_count || 0);
  if (row && row.review_count && old.reviewCount == null) old.reviewCount = Number(row.review_count || 0);
  const oldRatingAt = masteryDataRatingAt(old);
  const incRatingAt = masteryDataRatingAt(inc);
  const merged = Object.assign({}, old, inc);
  if (oldRated && (!incRated || oldRatingAt > incRatingAt)) {
    merged.m = Number(old.m);
    if (old.lastReviewed || old.last_reviewed || oldRatingAt) merged.lastReviewed = old.lastReviewed || old.last_reviewed || oldRatingAt;
  } else if (incRated) {
    merged.m = Number(inc.m);
    if (inc.lastReviewed || inc.last_reviewed || incRatingAt) merged.lastReviewed = inc.lastReviewed || inc.last_reviewed || incRatingAt;
  } else {
    delete merged.m;
    merged.unrated = true;
  }
  const oldView = Math.max(Number(old.viewCount) || 0, Number(old.views) || 0, Number(row && row.view_count || 0));
  const incView = Math.max(Number(inc.viewCount) || 0, Number(inc.views) || 0);
  if (Math.max(oldView, incView)) merged.viewCount = Math.max(oldView, incView);
  const oldReview = Math.max(Number(old.reviewCount) || 0, Number(row && row.review_count || 0));
  const incReview = Number(inc.reviewCount) || 0;
  if (Math.max(oldReview, incReview)) merged.reviewCount = Math.max(oldReview, incReview);
  const oldViewed = Math.max(normaliseTimestamp(old.lastViewed || old.lastSeen || old.viewedAt || 0), 0);
  const incViewed = Math.max(normaliseTimestamp(inc.lastViewed || inc.lastSeen || inc.viewedAt || 0), 0);
  if (Math.max(oldViewed, incViewed)) merged.lastViewed = Math.max(oldViewed, incViewed);
  const hist = mergeMasteryDataHistory(old, inc);
  if (hist.length) merged.history = hist;
  merged.updatedAt = Math.max(masteryDataActivityAt(old), masteryDataActivityAt(inc), Number(row && row.updated_at || 0), Date.now());
  return merged;
}

function safeMasteryDataJson(data) {
  const src = data && typeof data === "object" ? data : {};
  try {
    const txt = JSON.stringify(src);
    if (txt.length <= 240000) return txt;
    const clone = Object.assign({}, src);
    if (Array.isArray(clone.history)) clone.history = clone.history.slice(-500);
    if (Array.isArray(clone.reviewHistory)) clone.reviewHistory = clone.reviewHistory.slice(-500);
    if (Array.isArray(clone.masteryHistory)) clone.masteryHistory = clone.masteryHistory.slice(-500);
    const txt2 = JSON.stringify(clone);
    if (txt2.length <= 240000) return txt2;
    const slim = {
      title: clone.title || "",
      m: clone.m,
      viewCount: clone.viewCount || clone.views || 0,
      reviewCount: clone.reviewCount || 0,
      lastReviewed: clone.lastReviewed || clone.last_reviewed || 0,
      lastViewed: clone.lastViewed || clone.lastSeen || clone.viewedAt || 0,
      updatedAt: clone.updatedAt || clone.updated_at || Date.now(),
      history: Array.isArray(clone.history) ? clone.history.slice(-120) : []
    };
    return JSON.stringify(slim);
  } catch (_) { return "{}"; }
}

async function handleImportLocalActivity(req, env) {
  const body = await readJson(req, 4000000);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const now = Date.now();
  const incomingEvents = Array.isArray(body.events) ? body.events.slice(0, 1000) : [];
  let importedEvents = 0;
  for (const ev of incomingEvents) {
    const metric = activityMetric(ev && (ev.metric || ev.type || ev.action) || "");
    if (!metric) continue;
    const details = ev && ev.details && typeof ev.details === "object" ? Object.assign({}, ev.details) : {};
    details.syncedLearningHistory = true;
    const path = normaliseImportedConceptPath(ev && (ev.path || details.path || details.conceptId) || "");
    if (["view", "mastery", "saved_page_action", "saved_page_visit", "ai_quiz"].includes(metric) && !isConceptPath(path)) continue;
    const ts = normaliseTimestamp(ev && (ev.createdAt || ev.created_at || ev.ts || ev.updatedAt) || 0) || now;
    const rawId = String(ev && (ev.id || ev.eventId || ev.event_id) || "").replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 180);
    const id = rawId || `sync-event-${activityHashString([acc.accountKey, metric, path, ts, ev && ev.title || ""].join("::"))}`;
    const count = Math.max(1, Number(ev && ev.count || 1) || 1);
    const score = Number(ev && ev.score != null ? ev.score : activityXp(metric) * count) || 0;
    try {
      const result = await env.DB.prepare(`
        INSERT OR IGNORE INTO user_activity_events (id, account_key, metric, count, score, path, title, details_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(id, acc.accountKey, metric, count, score, path, cleanTitle(ev && ev.title || "", path), safeDetailsJson(details), ts).run();
      if (result && result.meta && Number(result.meta.changes || 0) > 0) importedEvents += 1;
    } catch (_) {}
  }
  if (body.eventsOnly === true || body.events_only === true) {
    return json({ ok: true, importedEvents, receivedEvents: incomingEvents.length }, 200, req, env);
  }
  const visits = Array.isArray(body.visits) ? body.visits.slice(0, 120) : [];
  const actions = Array.isArray(body.actions) ? body.actions.slice(0, 200) : [];
  let importedVisits = 0;
  let importedActions = 0;
  for (const v of visits) {
    const path = normalizePath(v && v.path);
    if (!isConceptPath(path)) continue;
    const t = cleanTitle(v && v.title, path);
    const ts = Math.max(0, Number(v && v.ts || now));
    await env.DB.prepare(`
      INSERT INTO account_page_visits (account_key, path, title, visit_count, first_visited, last_visited)
      VALUES (?, ?, ?, 1, ?, ?)
      ON CONFLICT(account_key, path) DO UPDATE SET
        title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_page_visits.title END,
        last_visited = MAX(account_page_visits.last_visited, excluded.last_visited)
    `).bind(acc.accountKey, path, t, ts || now, ts || now).run();
    await insertImportedUserActivityEvent(env.DB, acc.accountKey, "view", path, t, ts || now, { source: "local-track-views-import", historyKind: "view", fallback: true });
    importedVisits += 1;
  }
  const allowed = new Set(["favorite", "study_later", "review_later"]);
  for (const a of actions) {
    const path = normalizePath(a && a.path);
    const action = String(a && a.action || "").toLowerCase();
    if (!isConceptPath(path) || !allowed.has(action)) continue;
    const t = cleanTitle(a && a.title, path);
    const ts = Math.max(0, Number(a && a.ts || now));
    await env.DB.prepare(`INSERT OR IGNORE INTO page_actions (account_key, path, action, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`).bind(acc.accountKey, path, action, t, ts || now, ts || now).run();
    await insertImportedUserActivityEvent(env.DB, acc.accountKey, "saved_page_action", path, t, ts || now, { source: "local-page-action-import", action, savedAction: action });
    importedActions += 1;
  }
  const readiness = Array.isArray(body.readiness) ? body.readiness.slice(0, 800) : [];
  let importedReadiness = 0;
  for (const r of readiness) {
    const path = normalizePath(r && r.path);
    if (!isConceptPath(path)) continue;
    const val = cleanReadiness(r && (r.readiness != null ? r.readiness : (r.percent != null ? r.percent : r.score)));
    if (val == null) continue;
    const t = cleanTitle(r && r.title, path);
    const ts = Math.max(0, Number(r && (r.updatedAt || r.updated_at || r.ts) || now));
    await env.DB.prepare(`
      INSERT INTO account_readiness (account_key, path, title, readiness, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(account_key, path) DO UPDATE SET
        title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_readiness.title END,
        readiness = CASE WHEN excluded.updated_at >= account_readiness.updated_at THEN excluded.readiness ELSE account_readiness.readiness END,
        updated_at = MAX(account_readiness.updated_at, excluded.updated_at)
    `).bind(acc.accountKey, path, t, val, ts || now).run();
    importedReadiness += 1;
  }

  const masteryEntries = normaliseMasteryImport(body.mastery);
  let importedMastery = 0;
  for (const entry of masteryEntries.slice(0, 2000)) {
    const path = normaliseImportedConceptPath(entry.path || entry.id || entry.conceptId || entry.concept_id || "");
    if (!isConceptPath(path)) continue;
    const data = entry.data && typeof entry.data === "object" ? Object.assign({}, entry.data) : Object.assign({}, entry);
    const t = cleanTitle(entry.title || data.title || "", path);
    const explicitUnrated = data.unrated === true || String(data.state || "").toLowerCase() === "unrated";
    const hasRating = !explicitUnrated && Number.isFinite(Number(data.m));
    const m = hasRating ? Math.max(0, Math.min(3, Math.floor(Number(data.m)))) : null;
    const vc = Math.max(0, Math.floor(Number(data.viewCount || data.views || 0) || 0));
    const rc = Math.max(0, Math.floor(Number(data.reviewCount || data.rated || 0) || 0));
    const lr = normaliseTimestamp(data.lastReviewed || data.last_reviewed || 0);
    const lv = normaliseTimestamp(data.lastViewed || data.last_seen || data.lastSeen || 0);
    const explicitTs = Math.max(
      normaliseTimestamp(data.updatedAt || data.updated_at || 0),
      normaliseTimestamp(entry.updatedAt || entry.updated_at || entry.ts || 0),
      lr || 0,
      lv || 0
    );
    const ts = explicitTs || now;
    data.updatedAt = Math.max(normaliseTimestamp(data.updatedAt || data.updated_at || 0), ts);
    const oldMastery = await env.DB.prepare(`
      SELECT m, updated_at, data_json, view_count, review_count, last_reviewed
      FROM account_mastery
      WHERE account_key = ? AND path = ?
    `).bind(acc.accountKey, path).first().catch(() => null);
    const oldHasRating = oldMastery && oldMastery.m != null && Number.isFinite(Number(oldMastery.m));
    const oldM = oldHasRating ? Math.max(0, Math.min(3, Math.floor(Number(oldMastery.m)))) : null;
    const oldUpdated = Number(oldMastery && oldMastery.updated_at || 0) || 0;
    const shouldAwardMasteryXp = !!(hasRating && ts >= oldUpdated && (!oldHasRating || oldM !== m));
    const existingData = parseJsonObjectSafe(oldMastery && oldMastery.data_json || "{}");
    const mergedData = mergeMasteryDataForCloud(existingData, data, oldMastery || null);
    const storeHasRating = masteryDataHasRating(mergedData);
    const mStore = storeHasRating ? Math.max(0, Math.min(3, Math.floor(Number(mergedData.m)))) : null;
    const lrStore = Math.max(lr || 0, normaliseTimestamp(mergedData.lastReviewed || mergedData.last_reviewed || 0));
    const tsStore = Math.max(ts || 0, masteryDataActivityAt(mergedData), oldUpdated || 0);
    let jsonText = safeMasteryDataJson(mergedData);
    await env.DB.prepare(`
      INSERT INTO account_mastery (account_key, path, title, data_json, m, view_count, review_count, last_reviewed, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(account_key, path) DO UPDATE SET
        title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_mastery.title END,
        data_json = CASE
          WHEN excluded.updated_at >= account_mastery.updated_at THEN excluded.data_json
          WHEN account_mastery.data_json IS NULL OR account_mastery.data_json = '' THEN excluded.data_json
          ELSE account_mastery.data_json
        END,
        m = CASE
          WHEN excluded.m IS NOT NULL AND excluded.updated_at >= account_mastery.updated_at THEN excluded.m
          ELSE account_mastery.m
        END,
        view_count = MAX(account_mastery.view_count, excluded.view_count),
        review_count = MAX(account_mastery.review_count, excluded.review_count),
        last_reviewed = MAX(account_mastery.last_reviewed, excluded.last_reviewed),
        updated_at = MAX(account_mastery.updated_at, excluded.updated_at)
    `).bind(acc.accountKey, path, t, jsonText, mStore, Math.max(vc, Number(mergedData.viewCount || mergedData.views || 0) || 0), Math.max(rc, Number(mergedData.reviewCount || 0) || 0), lrStore || 0, tsStore || Date.now()).run();
    const recoveredEvents = localMasteryHistoryEventsFromImportEntry(entry, mergedData, path, t);
    for (const ev of recoveredEvents) {
      await insertImportedUserActivityEvent(env.DB, acc.accountKey, ev.metric, ev.path, ev.title || t, ev.ts, ev.details || {});
    }
    if (shouldAwardMasteryXp && !recoveredEvents.some((ev) => ev.metric === "mastery" && Math.abs(Number(ev.ts || 0) - Number(ts || 0)) < 5000)) {
      await bumpEngagement(env.DB, "mastery", path, t, 1);
      await bumpAccountActivity(env.DB, acc.accountKey, "mastery", 1, { path, title: t, ts, details: { source: "mastery_sync", mastery: m } });
    }
    importedMastery += 1;
  }

  const quizEntries = normaliseAiQuizImport(body.quizSessions || body.aiQuizSessions || body.ai_quiz_sessions);
  let importedAiQuiz = 0;
  for (const entry of quizEntries.slice(0, 3000)) {
    const session = entry.session && typeof entry.session === "object" ? entry.session : entry;
    const path = normaliseImportedConceptPath(session.concept_id || session.conceptId || entry.path || session.path || "");
    if (!isConceptPath(path)) continue;
    const questions = Array.isArray(session.questions) ? session.questions : [];
    if (!questions.length) continue;
    const completedAt = Math.max(
      normaliseTimestamp(session.completed_at || session.completedAt || session.result_at || session.resultAt || session.updatedAt || session.ts || 0),
      normaliseTimestamp(entry.ts || entry.completedAt || entry.completed_at || 0)
    );
    const looksCompleted = !!(session.completed_at || session.completedAt || session.result_id || session.resultId || session.suggested_mastery != null || session.suggestedMastery != null || session.completed === true || session.finished === true || session.correct_count != null || session.correct != null || entry.ts);
    if (!looksCompleted) continue;
    const eventTs = aiQuizStableTimestampForCloud(session, path, completedAt || entry.ts || entry.completedAt || entry.completed_at || 0);
    const t = cleanTitle(session.concept_title || session.conceptTitle || session.title || entry.title || "", path);
    const explicitRid = String(session.result_id || session.resultId || "").trim();
    const generatedRid = aiQuizSessionResultId(session, path, eventTs);
    const resultId = (/^(aiq|local-aiq|snap-aiq)-/i.test(explicitRid) ? generatedRid : (explicitRid || generatedRid)).trim();
    const correct = Math.max(0, Number(session.correct_count != null ? session.correct_count : session.correct || 0) || 0);
    const total = Math.max(questions.length, Number(session.total || session.total_questions || 0) || 0);
    const details = {
      source: "ai-mcq-session-import",
      resultId,
      sessionId: String(session.ts || eventTs),
      conceptId: path,
      score: correct,
      correct,
      total,
      suggestedMastery: session.suggested_mastery != null ? Number(session.suggested_mastery) : (session.suggestedMastery != null ? Number(session.suggestedMastery) : null),
      completedAt: eventTs,
      completed: true,
      resultProduced: true,
      importVersion: 4,
    };
    await upsertAccountAiQuizSession(env.DB, acc.accountKey, path, t, resultId, cleanSessionForAiQuizCloud(session, path, resultId, eventTs, correct, total), eventTs);
    await insertCanonicalAiQuizImportEvent(env.DB, acc.accountKey, path, t, eventTs, details);
    importedAiQuiz += 1;
  }

  return json({ ok: true, importedVisits, importedActions, importedReadiness, importedMastery, importedAiQuiz, importedEvents }, 200, req, env);
}

function cleanSessionForAiQuizCloud(session, path, resultId, completedAt, correct, total) {
  const src = session && typeof session === "object" ? Object.assign({}, session) : {};
  src.concept_id = normaliseImportedConceptPath(src.concept_id || src.conceptId || path || "");
  src.result_id = String(src.result_id || src.resultId || resultId || "").trim();
  src.completed_at = normaliseTimestamp(src.completed_at || src.completedAt || completedAt || 0) || Date.now();
  if (correct != null && src.correct_count == null) src.correct_count = Number(correct) || 0;
  if (total != null && src.total == null) src.total = Number(total) || 0;
  src.completed = true;
  src.resultProduced = true;
  return src;
}

function safeAiQuizSessionJson(session) {
  try {
    const src = session && typeof session === "object" ? session : {};
    const clone = JSON.parse(JSON.stringify(src));
    const txt = JSON.stringify(clone);
    if (txt.length <= 180000) return txt;
    if (Array.isArray(clone.questions)) clone.questions = clone.questions.slice(-80);
    const txt2 = JSON.stringify(clone);
    if (txt2.length <= 180000) return txt2;
    return JSON.stringify({
      concept_id: clone.concept_id || clone.conceptId || "",
      result_id: clone.result_id || clone.resultId || "",
      completed_at: clone.completed_at || clone.completedAt || Date.now(),
      correct_count: clone.correct_count != null ? clone.correct_count : clone.correct,
      total: clone.total || clone.total_questions || (Array.isArray(clone.questions) ? clone.questions.length : 0),
      suggested_mastery: clone.suggested_mastery != null ? clone.suggested_mastery : clone.suggestedMastery,
      questions: Array.isArray(clone.questions) ? clone.questions.slice(-30) : []
    });
  } catch (_) {
    try { return JSON.stringify(session || {}); } catch (_) { return "{}"; }
  }
}

async function upsertAccountAiQuizSession(db, accountKey, path, title, resultId, session, completedAt) {
  const key = String(accountKey || "").trim();
  const p = normaliseImportedConceptPath(path || "");
  const rid = String(resultId || "").trim();
  if (!key || !isConceptPath(p) || !rid) return false;
  const ts = normaliseTimestamp(completedAt || 0) || Date.now();
  const t = cleanTitle(title || (session && (session.concept_title || session.conceptTitle || session.title)) || "", p);
  const jsonText = safeAiQuizSessionJson(Object.assign({}, session && typeof session === "object" ? session : {}, {
    concept_id: p,
    result_id: rid,
    completed_at: ts,
  }));
  try {
    await db.prepare(`
      INSERT INTO account_ai_quiz_sessions (account_key, path, result_id, title, session_json, completed_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(account_key, path, result_id) DO UPDATE SET
        title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_ai_quiz_sessions.title END,
        session_json = CASE
          WHEN excluded.completed_at >= account_ai_quiz_sessions.completed_at THEN excluded.session_json
          WHEN account_ai_quiz_sessions.session_json IS NULL OR account_ai_quiz_sessions.session_json = '' THEN excluded.session_json
          ELSE account_ai_quiz_sessions.session_json
        END,
        completed_at = MAX(account_ai_quiz_sessions.completed_at, excluded.completed_at),
        updated_at = MAX(account_ai_quiz_sessions.updated_at, excluded.updated_at)
    `).bind(key, p, rid, t, jsonText, ts, Date.now()).run();
    return true;
  } catch (_) {
    return false;
  }
}

function aiQuizSessionClientRow(row) {
  let session = {};
  try { session = row && row.session_json ? JSON.parse(row.session_json) : {}; } catch (_) { session = {}; }
  const path = normaliseImportedConceptPath(row && row.path || session.concept_id || session.conceptId || "");
  const resultId = String(row && row.result_id || session.result_id || session.resultId || "").trim();
  const completedAt = normaliseTimestamp(row && row.completed_at || session.completed_at || session.completedAt || 0) || 0;
  if (path) session.concept_id = session.concept_id || path;
  if (resultId) session.result_id = session.result_id || resultId;
  if (completedAt) session.completed_at = session.completed_at || completedAt;
  return {
    path,
    title: row && row.title || session.concept_title || session.conceptTitle || session.title || path,
    resultId,
    ts: completedAt,
    completedAt,
    session,
  };
}

async function insertCanonicalAiQuizImportEvent(db, accountKey, path, title, eventTs, details) {
  const key = String(accountKey || "").trim();
  const p = normaliseImportedConceptPath(path || details && (details.conceptId || details.path) || "");
  if (!key || !isConceptPath(p)) return false;
  if (!aiQuizCompletionSignal("ai_quiz", details || {})) return false;
  const d = details && typeof details === "object" ? Object.assign({}, details) : {};
  const resultId = String(d.resultId || d.result_id || d.sessionId || d.session_id || activityHashString(JSON.stringify(d))).trim();
  const ts = normaliseTimestamp(eventTs || d.completedAt || d.completed_at || 0) || Date.now();
  const eventId = `aiq-import-${activityHashString([key, p, resultId].join("::"))}`;
  const count = 1;
  const score = Math.round(activityXp("ai_quiz") * 100) / 100;
  d.serverDedupeVersion = 4;
  d.canonicalSessionImport = true;
  try {
    await db.prepare(`
      INSERT OR IGNORE INTO user_activity_events (id, account_key, metric, count, score, path, title, details_json, created_at)
      VALUES (?, ?, 'ai_quiz', ?, ?, ?, ?, ?, ?)
    `).bind(eventId, key, count, score, p, cleanTitle(title || "", p), safeDetailsJson(d), ts).run();
    return true;
  } catch (_) {
    return false;
  }
}

function normaliseAiQuizImport(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.filter(Boolean);
  if (typeof input === "object") {
    const out = [];
    for (const [path, value] of Object.entries(input)) {
      if (Array.isArray(value)) {
        for (const session of value) out.push({ path, session });
      } else if (value && typeof value === "object") {
        out.push(Object.assign({ path }, value));
      }
    }
    return out;
  }
  return [];
}

function aiQuizQuestionSignatureForCloud(session) {
  const s = session && typeof session === "object" ? session : {};
  const qs = Array.isArray(s.questions) ? s.questions : [];
  return qs.map((q) => {
    const qq = q && typeof q === "object" ? q : {};
    return [
      qq.qid || qq.id || qq.question_id || qq.question || qq.prompt || qq.text || "",
      qq.selected_index != null ? qq.selected_index : qq.selectedIndex != null ? qq.selectedIndex : qq.answer_index != null ? qq.answer_index : "",
      qq.correct === true ? 1 : qq.correct === false ? 0 : "",
      qq.correct_index != null ? qq.correct_index : qq.correctIndex != null ? qq.correctIndex : ""
    ].join(":");
  }).join("|");
}

function aiQuizSessionSemanticKeyForCloud(session, path) {
  const s = session && typeof session === "object" ? session : {};
  const p = normaliseImportedConceptPath(s.concept_id || s.conceptId || s.path || path || "");
  const qs = aiQuizQuestionSignatureForCloud(s);
  const raw = [
    p,
    qs || String(s.textSignature || s.text_signature || s.resultText || s.result_text || s.summary || "").slice(0, 500),
    s.correct_count != null ? s.correct_count : s.correct != null ? s.correct : "",
    s.total != null ? s.total : s.total_questions != null ? s.total_questions : "",
    s.suggested_mastery != null ? s.suggested_mastery : s.suggestedMastery != null ? s.suggestedMastery : ""
  ].join("::");
  return `aiq-sem-${activityHashString(raw)}`;
}

function aiQuizStableTimestampForCloud(session, path, fallback) {
  const s = session && typeof session === "object" ? session : {};
  const direct = normaliseTimestamp(s.completed_at || s.completedAt || s.result_at || s.resultAt || s.updatedAt || s.updated_at || s.finishedAt || s.finished_at || fallback || s.ts || s.started_at || s.startedAt || 0);
  if (direct) return direct;
  const n = parseInt(activityHashString(aiQuizSessionSemanticKeyForCloud(s, path)), 36);
  return 1704067200000 + (Number.isFinite(n) ? (n % (366 * 24 * 60 * 60 * 1000)) : 0);
}

function aiQuizSessionResultId(session, path, completedAt) {
  const s = session && typeof session === "object" ? session : {};
  const raw = [
    normaliseImportedConceptPath(s.concept_id || s.conceptId || path || ""),
    s.ts || s.started_at || s.startedAt || "",
    s.completed_at || s.completedAt || completedAt || "",
    aiQuizSessionSemanticKeyForCloud(s, path)
  ].join("::");
  return `aiq-${activityHashString(raw)}`;
}

function normaliseTimestamp(value) {
  if (value == null || value === "") return 0;
  if (typeof value === "number" && Number.isFinite(value)) return value > 1e12 ? Math.floor(value) : Math.floor(value);
  const n = Number(value);
  if (Number.isFinite(n) && n > 0) return Math.floor(n);
  const d = Date.parse(String(value || ""));
  return Number.isFinite(d) ? d : 0;
}

function normaliseMasteryImport(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.filter(Boolean);
  if (typeof input === "object") {
    return Object.entries(input).map(([path, data]) => ({ path, data }));
  }
  return [];
}

function masteryClientRow(row) {
  let data = {};
  try { data = row && row.data_json ? JSON.parse(row.data_json) : {}; } catch (_) { data = {}; }
  const path = String(row && row.path || "");
  const rowUpdated = Number(row && row.updated_at || 0);
  const rowMasteryAt = Number(row && row.last_reviewed || 0) || Number(data && (data.updatedAt || data.updated_at || data.lastReviewed || data.last_reviewed) || 0) || rowUpdated;
  if (path && typeof data === "object") {
    data.title = data.title || row.title || "";
    if (row.m != null && data.m == null) data.m = Number(row.m);
    if (data.viewCount == null) data.viewCount = Number(row.view_count || 0);
    if (data.reviewCount == null) data.reviewCount = Number(row.review_count || 0);
    if (row.last_reviewed && !data.lastReviewed) data.lastReviewed = Number(row.last_reviewed || 0);
    if (!data.updatedAt && rowMasteryAt) data.updatedAt = rowMasteryAt;
    data.cloudUpdatedAt = rowUpdated;
  }
  return { path, title: row.title || data.title || path, data, updatedAt: rowMasteryAt || rowUpdated, cloudUpdatedAt: rowUpdated };
}


function snapshotTextChunks(text, size) {
  const s = String(text || "{}");
  const n = Math.max(20000, Math.min(120000, Number(size || 80000) || 80000));
  const out = [];
  for (let i = 0; i < s.length; i += n) out.push(s.slice(i, i + n));
  return out.length ? out : ["{}"];
}

function cleanSnapshotSyncId(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || `sync_${Date.now()}`;
}

function parseMasterySnapshotObject(value) {
  const obj = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    mastery: obj.mastery && typeof obj.mastery === "object" && !Array.isArray(obj.mastery) ? obj.mastery : {},
    quizSessions: obj.quizSessions && typeof obj.quizSessions === "object" && !Array.isArray(obj.quizSessions)
      ? obj.quizSessions
      : obj.aiQuizSessions && typeof obj.aiQuizSessions === "object" && !Array.isArray(obj.aiQuizSessions)
        ? obj.aiQuizSessions
        : {},
    updatedAt: normaliseTimestamp(obj.updatedAt || obj.updated_at || 0) || 0,
  };
}

function normaliseSnapshotMasteryMap(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const out = {};
  for (const [rawPath, rawRec] of Object.entries(src)) {
    if (!rawRec || typeof rawRec !== "object" || Array.isArray(rawRec)) continue;
    const path = normaliseImportedConceptPath(rawRec.path || rawRec.concept_id || rawRec.conceptId || rawPath || "");
    if (!isConceptPath(path)) continue;
    const rec = Object.assign({}, rawRec);
    rec.path = path;
    if (!rec.updatedAt) rec.updatedAt = masteryDataActivityAt(rec) || Date.now();
    out[path] = rec;
  }
  return out;
}

function snapshotQuizSessionTimestamp(session) {
  const s = session && typeof session === "object" ? session : {};
  return normaliseTimestamp(s.completed_at || s.completedAt || s.result_at || s.resultAt || s.updatedAt || s.updated_at || s.finishedAt || s.finished_at || s.ts || s.started_at || s.startedAt || 0) || 0;
}

function snapshotQuizResultId(session, path, ts) {
  const s = session && typeof session === "object" ? session : {};
  const explicit = String(s.result_id || s.resultId || s.completionId || s.completion_id || "").trim();
  if (explicit && !/^(aiq|local-aiq|snap-aiq)-/i.test(explicit)) return explicit;
  const raw = [
    normaliseImportedConceptPath(path || s.concept_id || s.conceptId || ""),
    s.ts || s.started_at || s.startedAt || "",
    s.completed_at || s.completedAt || ts || "",
    aiQuizSessionSemanticKeyForCloud(s, path)
  ].join("::");
  return `snap-aiq-${activityHashString(raw)}`;
}

function normaliseSnapshotQuizMap(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const out = {};
  const add = (rawPath, rawSession) => {
    if (!rawSession || typeof rawSession !== "object" || Array.isArray(rawSession)) return;
    const path = normaliseImportedConceptPath(rawSession.concept_id || rawSession.conceptId || rawSession.path || rawPath || "");
    if (!isConceptPath(path)) return;
    const session = Object.assign({}, rawSession);
    const ts = aiQuizStableTimestampForCloud(session, path, snapshotQuizSessionTimestamp(session));
    const resultId = snapshotQuizResultId(session, path, ts);
    session.concept_id = path;
    session.result_id = resultId;
    if (!session.completed_at) session.completed_at = ts;
    if (!out[path]) out[path] = [];
    out[path].push(session);
  };
  for (const [rawPath, value] of Object.entries(src)) {
    if (Array.isArray(value)) value.forEach((session) => add(rawPath, session));
    else add(rawPath, value);
  }
  for (const path of Object.keys(out)) {
    const map = new Map();
    for (const session of out[path]) {
      const ts = aiQuizStableTimestampForCloud(session, path, snapshotQuizSessionTimestamp(session));
      const rid = snapshotQuizResultId(session, path, ts);
      const sem = aiQuizSessionSemanticKeyForCloud(session, path);
      const key = sem || rid;
      const old = map.get(key);
      if (!old || ts >= aiQuizStableTimestampForCloud(old, path, snapshotQuizSessionTimestamp(old))) map.set(key, session);
    }
    out[path] = Array.from(map.values()).sort((a, b) => aiQuizStableTimestampForCloud(a, path, snapshotQuizSessionTimestamp(a)) - aiQuizStableTimestampForCloud(b, path, snapshotQuizSessionTimestamp(b))).slice(-120);
  }
  return out;
}

function mergeMasterySnapshotMaps(a, b) {
  const oldMap = normaliseSnapshotMasteryMap(a);
  const incMap = normaliseSnapshotMasteryMap(b);
  const out = Object.assign({}, oldMap);
  for (const path of Object.keys(incMap)) {
    out[path] = mergeMasteryDataForCloud(out[path] || {}, incMap[path] || {}, null);
  }
  return out;
}

function mergeQuizSnapshotMaps(a, b) {
  const oldMap = normaliseSnapshotQuizMap(a);
  const incMap = normaliseSnapshotQuizMap(b);
  const out = Object.assign({}, oldMap);
  for (const [path, arr] of Object.entries(incMap)) {
    const map = new Map();
    for (const session of [].concat(out[path] || [], arr || [])) {
      if (!session || typeof session !== "object") continue;
      const ts = aiQuizStableTimestampForCloud(session, path, snapshotQuizSessionTimestamp(session));
      const rid = snapshotQuizResultId(session, path, ts);
      const sem = aiQuizSessionSemanticKeyForCloud(session, path);
      const key = sem || rid;
      const old = map.get(key);
      if (!old || ts >= aiQuizStableTimestampForCloud(old, path, snapshotQuizSessionTimestamp(old))) map.set(key, session);
    }
    out[path] = Array.from(map.values()).sort((a, b) => aiQuizStableTimestampForCloud(a, path, snapshotQuizSessionTimestamp(a)) - aiQuizStableTimestampForCloud(b, path, snapshotQuizSessionTimestamp(b))).slice(-120);
  }
  return out;
}

function mergeMasterySnapshots(existing, incoming) {
  const a = parseMasterySnapshotObject(existing);
  const b = parseMasterySnapshotObject(incoming);
  return {
    type: "account_mastery_json_snapshot",
    version: 2,
    updatedAt: Date.now(),
    mastery: mergeMasterySnapshotMaps(a.mastery, b.mastery),
    quizSessions: mergeQuizSnapshotMaps(a.quizSessions, b.quizSessions),
  };
}

async function readAccountMasteryJsonSnapshot(db, accountKey) {
  const rows = await db.prepare(`
    SELECT chunk_index, chunk_count, data_json, updated_at
    FROM account_mastery_json_snapshot_chunks
    WHERE account_key = ?
    ORDER BY chunk_index ASC
  `).bind(accountKey).all().catch(() => ({ results: [] }));
  const list = rows.results || [];
  if (!list.length) return { snapshot: { type: "account_mastery_json_snapshot", version: 2, updatedAt: 0, mastery: {}, quizSessions: {} }, updatedAt: 0, chunkCount: 0 };
  const chunkCount = Math.max(...list.map((r) => Number(r.chunk_count || 0) || 0));
  if (!chunkCount || list.length < chunkCount) return { snapshot: { type: "account_mastery_json_snapshot", version: 2, updatedAt: 0, mastery: {}, quizSessions: {} }, updatedAt: 0, chunkCount: list.length, incomplete: true };
  let text = "";
  for (let i = 0; i < chunkCount; i += 1) {
    const row = list.find((r) => Number(r.chunk_index) === i);
    if (!row) return { snapshot: { type: "account_mastery_json_snapshot", version: 2, updatedAt: 0, mastery: {}, quizSessions: {} }, updatedAt: 0, chunkCount: list.length, incomplete: true };
    text += String(row.data_json || "");
  }
  try {
    return { snapshot: parseMasterySnapshotObject(JSON.parse(text || "{}")), updatedAt: Math.max(...list.map((r) => Number(r.updated_at || 0) || 0)), chunkCount };
  } catch (_) {
    return { snapshot: { type: "account_mastery_json_snapshot", version: 2, updatedAt: 0, mastery: {}, quizSessions: {} }, updatedAt: 0, chunkCount, parseError: true };
  }
}

async function writeAccountMasteryJsonSnapshot(db, accountKey, snapshot) {
  const clean = parseMasterySnapshotObject(snapshot);
  const payload = { type: "account_mastery_json_snapshot", version: 2, updatedAt: Date.now(), mastery: clean.mastery, quizSessions: clean.quizSessions };
  const text = JSON.stringify(payload);
  const chunks = snapshotTextChunks(text, 90000);
  const now = Date.now();
  const statements = [db.prepare(`DELETE FROM account_mastery_json_snapshot_chunks WHERE account_key = ?`).bind(accountKey)];
  for (let i = 0; i < chunks.length; i += 1) {
    statements.push(db.prepare(`
      INSERT INTO account_mastery_json_snapshot_chunks (account_key, chunk_index, chunk_count, data_json, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(accountKey, i, chunks.length, chunks[i], now));
  }
  if (typeof db.batch === "function") await db.batch(statements);
  else { for (const stmt of statements) await stmt.run(); }
  return { snapshot: payload, updatedAt: now, chunkCount: chunks.length };
}

async function handleGetMasteryJsonSnapshot(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const snap = await readAccountMasteryJsonSnapshot(env.DB, acc.accountKey);
  return json({ ok: true, accountKey: acc.accountKey, snapshot: Object.assign({ type: "account_mastery_json_snapshot", version: 2 }, snap.snapshot || {}), updatedAt: snap.updatedAt || 0, chunkCount: snap.chunkCount || 0, incomplete: !!snap.incomplete }, 200, req, env);
}

async function handlePostMasteryJsonSnapshotChunk(req, env) {
  const body = await readJson(req, 160000);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const syncId = cleanSnapshotSyncId(body.syncId || body.sync_id || "");
  const chunkIndex = Math.max(0, Math.floor(Number(body.chunkIndex || body.chunk_index || 0) || 0));
  const chunkCount = Math.max(1, Math.min(200, Math.floor(Number(body.chunkCount || body.chunk_count || 1) || 1)));
  const chunk = String(body.chunk || body.data || "");
  if (chunkIndex >= chunkCount) return json({ ok: false, error: "Invalid snapshot chunk index." }, 400, req, env);
  if (chunk.length > 130000) return json({ ok: false, error: "Snapshot chunk is too large." }, 413, req, env);
  const now = Date.now();
  await env.DB.prepare(`DELETE FROM account_mastery_json_upload_chunks WHERE account_key = ? AND created_at < ?`).bind(acc.accountKey, now - 30 * 60 * 1000).run().catch(() => {});
  await env.DB.prepare(`
    INSERT INTO account_mastery_json_upload_chunks (account_key, sync_id, chunk_index, chunk_count, data_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_key, sync_id, chunk_index) DO UPDATE SET
      chunk_count = excluded.chunk_count,
      data_json = excluded.data_json,
      created_at = excluded.created_at
  `).bind(acc.accountKey, syncId, chunkIndex, chunkCount, chunk, now).run();
  const rows = await env.DB.prepare(`
    SELECT chunk_index, chunk_count, data_json
    FROM account_mastery_json_upload_chunks
    WHERE account_key = ? AND sync_id = ?
    ORDER BY chunk_index ASC
  `).bind(acc.accountKey, syncId).all();
  const list = rows.results || [];
  if (list.length < chunkCount) return json({ ok: true, partial: true, received: list.length, chunkCount }, 200, req, env);
  let text = "";
  for (let i = 0; i < chunkCount; i += 1) {
    const row = list.find((r) => Number(r.chunk_index) === i);
    if (!row) return json({ ok: true, partial: true, received: list.length, chunkCount }, 200, req, env);
    text += String(row.data_json || "");
  }
  let incoming = {};
  try { incoming = JSON.parse(text || "{}"); } catch (_) { return json({ ok: false, error: "Invalid mastery JSON snapshot." }, 400, req, env); }
  const existing = await readAccountMasteryJsonSnapshot(env.DB, acc.accountKey);
  const merged = mergeMasterySnapshots(existing.snapshot || {}, incoming || {});
  const written = await writeAccountMasteryJsonSnapshot(env.DB, acc.accountKey, merged);
  await env.DB.prepare(`DELETE FROM account_mastery_json_upload_chunks WHERE account_key = ? AND sync_id = ?`).bind(acc.accountKey, syncId).run().catch(() => {});
  return json({ ok: true, partial: false, received: list.length, chunkCount, accountKey: acc.accountKey, snapshot: written.snapshot, updatedAt: written.updatedAt, snapshotChunkCount: written.chunkCount }, 200, req, env);
}


function emptyAccountJsonSnapshot() {
  return { type: "account_json_snapshot", version: 1, updatedAt: 0, activityEventMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX, learningHistoryMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX, stores: {} };
}

function parseAccountJsonSnapshotObject(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const stores = src.stores && typeof src.stores === "object" && !Array.isArray(src.stores) ? src.stores : {};
  return { type: "account_json_snapshot", version: 1, updatedAt: normaliseTimestamp(src.updatedAt || src.updated_at || 0), activityEventMax: Math.max(0, Number(src.activityEventMax || src.learningHistoryMax || 0) || 0), learningHistoryMax: Math.max(0, Number(src.learningHistoryMax || src.activityEventMax || 0) || 0), stores };
}

function accountJsonArray(value) {
  return Array.isArray(value) ? value.filter((x) => x && typeof x === "object") : [];
}

function accountJsonTimeOf(item, keys) {
  const it = item && typeof item === "object" ? item : {};
  for (const k of keys || ["updatedAt", "updated_at", "ts", "createdAt", "created_at"]) {
    const t = normaliseTimestamp(it[k] || 0);
    if (t) return t;
  }
  return 0;
}

function accountJsonMergeArrayByKey(localArr, cloudArr, opts = {}) {
  const keyFn = typeof opts.keyFn === "function" ? opts.keyFn : (x) => String(x && x[opts.key || "id"] || "");
  const timeKeys = opts.timeKeys || ["updatedAt", "updated_at", "ts", "createdAt", "created_at"];
  const max = Math.max(20, Math.min(ACCOUNT_JSON_ACTIVITY_EVENT_MAX, Number(opts.max || 1000) || 1000));
  const map = new Map();
  for (const item of [].concat(accountJsonArray(localArr), accountJsonArray(cloudArr))) {
    const id = keyFn(item);
    if (!id) continue;
    const rec = Object.assign({}, item);
    const old = map.get(id);
    if (!old || accountJsonTimeOf(rec, timeKeys) >= accountJsonTimeOf(old, timeKeys)) map.set(id, Object.assign({}, old || {}, rec));
  }
  return Array.from(map.values()).sort((a, b) => accountJsonTimeOf(b, timeKeys) - accountJsonTimeOf(a, timeKeys)).slice(0, max);
}

function accountJsonMergeActions(localArr, cloudArr) {
  return accountJsonMergeArrayByKey(localArr, cloudArr, {
    max: 1200,
    timeKeys: ["updatedAt", "updated_at", "ts", "createdAt", "created_at"],
    keyFn: (x) => `${String(x && x.path || "")}::${String(x && x.action || "")}`
  });
}

function accountJsonNormaliseMasteryMap(value, opts = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const strict = !!(opts && opts.strict);
  const out = {};
  for (const [rawPath, rec] of Object.entries(value)) {
    const data = rec && typeof rec === "object" && !Array.isArray(rec) ? Object.assign({}, rec) : {};
    const p = normaliseImportedConceptPath(data.path || data.conceptId || data.concept_id || rawPath || "");
    // The account JSON snapshot should preserve all page-like Mastery Manager
    // rows, even if a path is excluded from canonical XP tables.  Otherwise one
    // local mastery row can be uploaded, rejected by the snapshot normaliser,
    // and the UI will forever show local/cloud as off by one.
    if (strict && !isConceptPath(p)) continue;
    const hasMasteryPayload = masteryDataHasRating(data) || Array.isArray(data.history) || Array.isArray(data.reviewHistory) || Array.isArray(data.masteryHistory) || data.lastReviewed || data.last_reviewed || data.updatedAt || data.updated_at;
    // Account JSON snapshots are the lossless cross-device store.  Keep orphaned
    // Mastery Manager rows here even when the underlying concept page has later
    // been renamed or removed from the current wiki build.  Canonical XP import
    // below still uses strict=true, so deleted/non-concept paths cannot pollute
    // the XP tables.
    if (!p || (!/\.html$/i.test(p) && !hasMasteryPayload)) continue;
    delete data.path;
    out[p] = data;
  }
  return out;
}

function accountJsonNormaliseQuizMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out = {};
  const add = (path, session) => {
    if (!session || typeof session !== "object" || Array.isArray(session)) return;
    const p = normaliseImportedConceptPath(session.concept_id || session.conceptId || session.path || path || "");
    if (!isConceptPath(p)) return;
    const ts = aiQuizStableTimestampForCloud(session, p, session.completed_at || session.completedAt || session.result_at || session.resultAt || session.updatedAt || session.ts || 0);
    const explicitRid = String(session.result_id || session.resultId || "").trim();
    const generatedRid = aiQuizSessionResultId(session, p, ts);
    const rid = (/^(aiq|local-aiq|snap-aiq)-/i.test(explicitRid) ? generatedRid : (explicitRid || generatedRid)).trim();
    if (!rid) return;
    const s = Object.assign({}, session, { concept_id: p, result_id: rid, completed_at: ts });
    if (!Array.isArray(out[p])) out[p] = [];
    out[p].push(s);
  };
  for (const [path, val] of Object.entries(value)) {
    if (Array.isArray(val)) val.forEach((x) => add(path, x));
    else add(path, val);
  }
  for (const path of Object.keys(out)) {
    const map = new Map();
    for (const s of out[path]) {
      const ts = aiQuizStableTimestampForCloud(s, path, s.completed_at || s.completedAt || s.updatedAt || s.ts || 0);
      const rid = String(s.result_id || s.resultId || aiQuizSessionResultId(s, path, ts)).trim();
      const sem = aiQuizSessionSemanticKeyForCloud(s, path);
      const key = sem || rid;
      const old = map.get(key);
      if (!old || ts >= aiQuizStableTimestampForCloud(old, path, old.completed_at || old.completedAt || old.updatedAt || old.ts || 0)) map.set(key, s);
    }
    out[path] = Array.from(map.values()).sort((a, b) => aiQuizStableTimestampForCloud(a, path, a.completed_at || a.completedAt || a.updatedAt || a.ts || 0) - aiQuizStableTimestampForCloud(b, path, b.completed_at || b.completedAt || b.updatedAt || b.ts || 0)).slice(-160);
  }
  return out;
}

function accountJsonMergeLocalStorageSnapshot(existing, incoming) {
  const normalise = (value) => {
    const src = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const rawKeys = src.keys && typeof src.keys === "object" && !Array.isArray(src.keys) ? src.keys : src;
    const keys = {};
    for (const [rawKey, rawRec] of Object.entries(rawKeys || {})) {
      const key = String(rawKey || "").trim().slice(0, 220);
      if (!key || key === "version" || key === "updatedAt") continue;
      const rec = rawRec && typeof rawRec === "object" && !Array.isArray(rawRec) ? rawRec : { value: String(rawRec == null ? "" : rawRec) };
      const updatedAt = normaliseTimestamp(rec.updatedAt || rec.updated_at || rec.ts || 0) || 1;
      if (rec.deleted) {
        keys[key] = { deleted: true, updatedAt };
        continue;
      }
      const valueText = String(rec.value == null ? "" : rec.value);
      if (valueText.length > 180000) continue;
      keys[key] = { value: valueText, updatedAt, deleted: false };
    }
    return keys;
  };
  const oldKeys = normalise(existing);
  const incKeys = normalise(incoming);
  const merged = Object.assign({}, oldKeys);
  for (const [key, rec] of Object.entries(incKeys)) {
    const old = merged[key];
    if (!old || Number(rec.updatedAt || 0) >= Number(old.updatedAt || 0)) merged[key] = rec;
  }
  const sorted = Object.entries(merged).sort((a, b) => Number(b[1] && b[1].updatedAt || 0) - Number(a[1] && a[1].updatedAt || 0));
  const keys = {};
  let total = 0;
  for (const [key, rec] of sorted.slice(0, 800)) {
    const bytes = rec && rec.deleted ? 64 : String(rec && rec.value || "").length;
    if (total + bytes > 900000) continue;
    keys[key] = rec;
    total += bytes;
  }
  return { version: 1, updatedAt: Date.now(), keys };
}

function accountJsonMergeGenericStore(existing, incoming) {
  if (Array.isArray(existing) || Array.isArray(incoming)) {
    return accountJsonMergeArrayByKey(Array.isArray(existing) ? existing : [], Array.isArray(incoming) ? incoming : [], {
      keyFn: (x) => String(x && (x.id || x.path || x.key || x.name) || ""),
      timeKeys: ["updatedAt", "updated_at", "ts", "createdAt", "created_at"],
      max: 2000,
    });
  }
  if (existing && typeof existing === "object" && incoming && typeof incoming === "object" && !Array.isArray(existing) && !Array.isArray(incoming)) {
    const out = Object.assign({}, existing);
    for (const [key, val] of Object.entries(incoming)) out[key] = val;
    return out;
  }
  return incoming !== undefined ? incoming : existing;
}

function accountJsonMergeStores(existingStores, incomingStores) {
  const oldStores = existingStores && typeof existingStores === "object" && !Array.isArray(existingStores) ? existingStores : {};
  const incStores = incomingStores && typeof incomingStores === "object" && !Array.isArray(incomingStores) ? incomingStores : {};
  const out = Object.assign({}, oldStores);
  const known = new Set(["visits", "pageActions", "favorites", "comments", "commentReports", "readiness", "activityEvents", "mastery", "quizSessions", "localStorage"]);
  out.visits = accountJsonMergeArrayByKey(oldStores.visits, incStores.visits, { key: "path", timeKeys: ["lastVisited", "last_visited", "ts", "updatedAt"], max: 1000 });
  out.pageActions = accountJsonMergeActions(oldStores.pageActions, incStores.pageActions);
  out.favorites = accountJsonMergeArrayByKey(oldStores.favorites, incStores.favorites, { key: "path", timeKeys: ["updatedAt", "ts", "createdAt"], max: 1000 });
  out.comments = accountJsonMergeArrayByKey(oldStores.comments, incStores.comments, { key: "id", timeKeys: ["editedAt", "edited_at", "deletedAt", "deleted_at", "ts", "createdAt"], max: 1000 });
  out.commentReports = accountJsonMergeArrayByKey(oldStores.commentReports, incStores.commentReports, { keyFn: (x) => String(x && (x.reportId || x.report_id || x.id || x.commentId || x.comment_id) || ""), timeKeys: ["ts", "createdAt", "updatedAt"], max: 1000 });
  out.readiness = accountJsonMergeArrayByKey(oldStores.readiness, incStores.readiness, { key: "path", timeKeys: ["updatedAt", "updated_at", "ts"], max: 2000 });
  out.activityEvents = accountJsonMergeArrayByKey(oldStores.activityEvents, incStores.activityEvents, { keyFn: (x) => {
    const d = x && x.details && typeof x.details === "object" ? x.details : {};
    const strong = String(d.resultId || d.result_id || d.sessionId || d.session_id || x.id || "").trim();
    if (strong) return `${String(x && x.metric || "")}::${String(x && x.path || "")}::${strong}`;
    return `${String(x && x.metric || "")}::${String(x && x.path || "")}::${accountJsonTimeOf(x, ["ts", "createdAt", "created_at"])}::${String(x && x.title || "")}`;
  }, timeKeys: ["createdAt", "created_at", "ts", "updatedAt"], max: ACCOUNT_JSON_ACTIVITY_EVENT_MAX });
  out.mastery = mergeMasterySnapshotMaps(accountJsonNormaliseMasteryMap(oldStores.mastery), accountJsonNormaliseMasteryMap(incStores.mastery));
  out.quizSessions = mergeQuizSnapshotMaps(accountJsonNormaliseQuizMap(oldStores.quizSessions), accountJsonNormaliseQuizMap(incStores.quizSessions));
  out.localStorage = accountJsonMergeLocalStorageSnapshot(oldStores.localStorage, incStores.localStorage);
  for (const key of new Set([].concat(Object.keys(oldStores), Object.keys(incStores)))) {
    if (known.has(key)) continue;
    out[key] = accountJsonMergeGenericStore(oldStores[key], incStores[key]);
  }
  return out;
}

function accountJsonSnapshotStats(snapshot) {
  const snap = parseAccountJsonSnapshotObject(snapshot);
  const stores = snap.stores || {};
  const countValue = (id, value) => {
    if (id === "mastery" && value && typeof value === "object" && !Array.isArray(value)) return Object.keys(accountJsonNormaliseMasteryMap(value)).length;
    if (id === "quizSessions" && value && typeof value === "object" && !Array.isArray(value)) return Object.values(accountJsonNormaliseQuizMap(value)).reduce((n, arr) => n + (Array.isArray(arr) ? arr.length : 0), 0);
    if (id === "localStorage" && value && typeof value === "object" && !Array.isArray(value)) {
      const keys = value.keys && typeof value.keys === "object" && !Array.isArray(value.keys) ? value.keys : value;
      return Object.keys(keys || {}).filter((k) => !["version", "updatedAt", "updated_at"].includes(k)).length;
    }
    if (Array.isArray(value)) return value.length;
    if (value && typeof value === "object") return Object.keys(value).length;
    return 0;
  };
  const storesOut = {};
  let total = 0;
  for (const [id, value] of Object.entries(stores)) {
    const n = countValue(id, value);
    storesOut[id] = n;
    total += n;
  }
  return { total, stores: storesOut };
}

function accountJsonPositiveDelta(before, after) {
  const b = before && before.stores || {};
  const a = after && after.stores || {};
  const stores = {};
  let total = 0;
  for (const key of new Set([].concat(Object.keys(b), Object.keys(a)))) {
    const d = Math.max(0, Number(a[key] || 0) - Number(b[key] || 0));
    if (d) stores[key] = d;
    total += d;
  }
  return { total, stores };
}

async function buildAccountJsonSnapshotFromCanonical(db, accountKey) {
  const stores = {};
  const visits = await db.prepare(`SELECT path, title, visit_count, first_visited, last_visited FROM account_page_visits WHERE account_key = ? ORDER BY last_visited DESC LIMIT 1000`).bind(accountKey).all().catch(() => ({ results: [] }));
  stores.visits = (visits.results || []).map((r) => ({ path: r.path, title: r.title || r.path, visitCount: Number(r.visit_count || 0), firstVisited: Number(r.first_visited || 0), lastVisited: Number(r.last_visited || 0), ts: Number(r.last_visited || 0) }));
  const actions = await db.prepare(`SELECT path, action, title, created_at, updated_at FROM page_actions WHERE account_key = ? ORDER BY updated_at DESC LIMIT 1200`).bind(accountKey).all().catch(() => ({ results: [] }));
  stores.pageActions = (actions.results || []).map((r) => ({ path: r.path, action: r.action, title: r.title || r.path, createdAt: Number(r.created_at || 0), updatedAt: Number(r.updated_at || 0), ts: Number(r.updated_at || r.created_at || 0) }));
  stores.favorites = stores.pageActions.filter((x) => x.action === "favorite").map((x) => ({ path: x.path, title: x.title, ts: x.ts, updatedAt: x.updatedAt }));
  const readiness = await db.prepare(`SELECT path, title, readiness, updated_at FROM account_readiness WHERE account_key = ? ORDER BY updated_at DESC LIMIT 2000`).bind(accountKey).all().catch(() => ({ results: [] }));
  stores.readiness = (readiness.results || []).map((r) => ({ path: r.path, title: r.title || r.path, readiness: Number(r.readiness || 0), updatedAt: Number(r.updated_at || 0), ts: Number(r.updated_at || 0) }));
  const masteryRows = await db.prepare(`SELECT path, title, data_json, m, view_count, review_count, last_reviewed, updated_at FROM account_mastery WHERE account_key = ? ORDER BY updated_at DESC LIMIT 10000`).bind(accountKey).all().catch(() => ({ results: [] }));
  const mastery = {};
  for (const row of masteryRows.results || []) {
    const client = masteryClientRow(row);
    if (client.path) mastery[client.path] = Object.assign({}, client.data || {}, { title: client.title || client.path, cloudUpdatedAt: client.cloudUpdatedAt || client.updatedAt || 0 });
  }
  stores.mastery = mastery;
  const quizRows = await db.prepare(`SELECT path, title, result_id, session_json, completed_at, updated_at FROM account_ai_quiz_sessions WHERE account_key = ? ORDER BY completed_at DESC LIMIT 10000`).bind(accountKey).all().catch(() => ({ results: [] }));
  const quizSessions = {};
  for (const row of quizRows.results || []) {
    const client = aiQuizSessionClientRow(row);
    if (!client.path || !client.session) continue;
    if (!Array.isArray(quizSessions[client.path])) quizSessions[client.path] = [];
    quizSessions[client.path].push(client.session);
  }
  stores.quizSessions = quizSessions;
  const events = await db.prepare(`SELECT id, metric, count, score, path, title, details_json, created_at FROM user_activity_events WHERE account_key = ? ORDER BY created_at DESC LIMIT ${ACCOUNT_JSON_ACTIVITY_EVENT_MAX}`).bind(accountKey).all().catch(() => ({ results: [] }));
  stores.activityEvents = (events.results || []).map((r) => ({ id: r.id, metric: r.metric, count: Number(r.count || 1), score: Number(r.score || 0), path: r.path || "", title: r.title || "", details: parseJsonObjectSafe(r.details_json || "{}"), createdAt: Number(r.created_at || 0), ts: Number(r.created_at || 0) }));
  const comments = await db.prepare(`SELECT id, path, parent_id, name, text, ts, deleted_at, edited_at, is_anonymous FROM comments WHERE account_key = ? ORDER BY ts DESC LIMIT 1000`).bind(accountKey).all().catch(() => ({ results: [] }));
  stores.comments = (comments.results || []).map((r) => ({ id: r.id, path: r.path, parentId: r.parent_id || "", name: r.name || "", text: r.text || "", ts: Number(r.ts || 0), deleted: Number(r.deleted_at || 0) > 0, deletedAt: Number(r.deleted_at || 0), editedAt: Number(r.edited_at || 0), anonymous: Number(r.is_anonymous || 0) > 0 }));
  const masterySnap = await readAccountMasteryJsonSnapshot(db, accountKey).catch(() => null);
  if (masterySnap && masterySnap.snapshot) {
    stores.mastery = mergeMasterySnapshotMaps(stores.mastery, masterySnap.snapshot.mastery || {});
    stores.quizSessions = mergeQuizSnapshotMaps(stores.quizSessions, masterySnap.snapshot.quizSessions || {});
  }
  stores.mastery = accountJsonNormaliseMasteryMap(stores.mastery);
  stores.quizSessions = accountJsonNormaliseQuizMap(stores.quizSessions);
  return { type: "account_json_snapshot", version: 1, updatedAt: Date.now(), stores };
}

async function readAccountJsonSnapshot(db, accountKey) {
  const rows = await db.prepare(`
    SELECT chunk_index, chunk_count, data_json, updated_at
    FROM account_json_snapshot_chunks
    WHERE account_key = ?
    ORDER BY chunk_index ASC
  `).bind(accountKey).all().catch(() => ({ results: [] }));
  const list = rows.results || [];
  if (!list.length) return { snapshot: await buildAccountJsonSnapshotFromCanonical(db, accountKey), updatedAt: 0, chunkCount: 0, seeded: true };
  const chunkCount = Math.max(...list.map((r) => Number(r.chunk_count || 0) || 0));
  if (!chunkCount || list.length < chunkCount) return { snapshot: await buildAccountJsonSnapshotFromCanonical(db, accountKey), updatedAt: 0, chunkCount: list.length, incomplete: true, seeded: true };
  let text = "";
  for (let i = 0; i < chunkCount; i += 1) {
    const row = list.find((r) => Number(r.chunk_index) === i);
    if (!row) return { snapshot: await buildAccountJsonSnapshotFromCanonical(db, accountKey), updatedAt: 0, chunkCount: list.length, incomplete: true, seeded: true };
    text += String(row.data_json || "");
  }
  try {
    const parsed = parseAccountJsonSnapshotObject(JSON.parse(text || "{}"));
    const canonical = await buildAccountJsonSnapshotFromCanonical(db, accountKey).catch(() => null);
    const mergedStores = accountJsonMergeStores(parsed.stores || {}, canonical && canonical.stores || {});
    return { snapshot: { type: "account_json_snapshot", version: 1, updatedAt: Math.max(parsed.updatedAt || 0, canonical && canonical.updatedAt || 0), stores: mergedStores }, updatedAt: Math.max(...list.map((r) => Number(r.updated_at || 0) || 0)), chunkCount };
  } catch (_) {
    return { snapshot: await buildAccountJsonSnapshotFromCanonical(db, accountKey), updatedAt: 0, chunkCount, parseError: true, seeded: true };
  }
}

async function writeAccountJsonSnapshot(db, accountKey, snapshot) {
  const clean = parseAccountJsonSnapshotObject(snapshot);
  const payload = { type: "account_json_snapshot", version: 1, updatedAt: Date.now(), activityEventMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX, learningHistoryMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX, stores: clean.stores || {} };
  const text = JSON.stringify(payload);
  const chunks = snapshotTextChunks(text, 90000);
  const now = Date.now();
  const statements = [db.prepare(`DELETE FROM account_json_snapshot_chunks WHERE account_key = ?`).bind(accountKey)];
  for (let i = 0; i < chunks.length; i += 1) {
    statements.push(db.prepare(`
      INSERT INTO account_json_snapshot_chunks (account_key, chunk_index, chunk_count, data_json, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(accountKey, i, chunks.length, chunks[i], now));
  }
  if (typeof db.batch === "function") await db.batch(statements);
  else { for (const stmt of statements) await stmt.run(); }
  return { snapshot: payload, updatedAt: now, chunkCount: chunks.length };
}

async function importAccountJsonSnapshotToCanonical(db, accountKey, snapshot) {
  const snap = parseAccountJsonSnapshotObject(snapshot);
  const stores = snap.stores || {};
  let importedVisits = 0, importedActions = 0, importedReadiness = 0, importedMastery = 0, importedAiQuiz = 0, importedEvents = 0;
  const now = Date.now();
  for (const v of accountJsonArray(stores.visits).slice(0, 1000)) {
    const path = normaliseImportedConceptPath(v.path || "");
    if (!isConceptPath(path)) continue;
    const t = cleanTitle(v.title || "", path);
    const first = normaliseTimestamp(v.firstVisited || v.first_visited || v.createdAt || v.ts || 0) || now;
    const last = normaliseTimestamp(v.lastVisited || v.last_visited || v.updatedAt || v.ts || 0) || first;
    await db.prepare(`
      INSERT INTO account_page_visits (account_key, path, title, visit_count, first_visited, last_visited)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(account_key, path) DO UPDATE SET
        title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_page_visits.title END,
        visit_count = MAX(account_page_visits.visit_count, excluded.visit_count),
        first_visited = MIN(account_page_visits.first_visited, excluded.first_visited),
        last_visited = MAX(account_page_visits.last_visited, excluded.last_visited)
    `).bind(accountKey, path, t, Math.max(1, Number(v.visitCount || v.visit_count || 1) || 1), first, last).run().catch(() => {});
    importedVisits += 1;
  }
  for (const a of accountJsonArray(stores.pageActions).slice(0, 1200)) {
    const path = normaliseImportedConceptPath(a.path || "");
    const action = String(a.action || "").toLowerCase().trim();
    if (!isConceptPath(path) || !["favorite", "study_later", "review_later"].includes(action)) continue;
    const t = cleanTitle(a.title || "", path);
    const ts = normaliseTimestamp(a.updatedAt || a.updated_at || a.ts || a.createdAt || 0) || now;
    await db.prepare(`INSERT OR IGNORE INTO page_actions (account_key, path, action, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`).bind(accountKey, path, action, t, normaliseTimestamp(a.createdAt || a.created_at || 0) || ts, ts).run().catch(() => {});
    importedActions += 1;
  }
  for (const r of accountJsonArray(stores.readiness).slice(0, 2000)) {
    const path = normaliseImportedConceptPath(r.path || "");
    if (!isConceptPath(path)) continue;
    const val = cleanReadiness(r.readiness != null ? r.readiness : (r.percent != null ? r.percent : r.score));
    if (val == null) continue;
    const t = cleanTitle(r.title || "", path);
    const ts = normaliseTimestamp(r.updatedAt || r.updated_at || r.ts || 0) || now;
    await db.prepare(`
      INSERT INTO account_readiness (account_key, path, title, readiness, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(account_key, path) DO UPDATE SET
        title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_readiness.title END,
        readiness = CASE WHEN excluded.updated_at >= account_readiness.updated_at THEN excluded.readiness ELSE account_readiness.readiness END,
        updated_at = MAX(account_readiness.updated_at, excluded.updated_at)
    `).bind(accountKey, path, t, val, ts).run().catch(() => {});
    importedReadiness += 1;
  }
  for (const [path, data] of Object.entries(accountJsonNormaliseMasteryMap(stores.mastery, { strict: true })).slice(0, 10000)) {
    const t = cleanTitle(data.title || "", path);
    const oldMastery = await db.prepare(`SELECT m, updated_at, data_json, view_count, review_count, last_reviewed FROM account_mastery WHERE account_key = ? AND path = ?`).bind(accountKey, path).first().catch(() => null);
    const mergedData = mergeMasteryDataForCloud(parseJsonObjectSafe(oldMastery && oldMastery.data_json || "{}"), data, oldMastery || null);
    const storeHasRating = masteryDataHasRating(mergedData);
    const mStore = storeHasRating ? Math.max(0, Math.min(3, Math.floor(Number(mergedData.m)))) : null;
    const lrStore = Math.max(normaliseTimestamp(mergedData.lastReviewed || mergedData.last_reviewed || 0), Number(oldMastery && oldMastery.last_reviewed || 0));
    const tsStore = Math.max(masteryDataActivityAt(mergedData), Number(oldMastery && oldMastery.updated_at || 0), now);
    await db.prepare(`
      INSERT INTO account_mastery (account_key, path, title, data_json, m, view_count, review_count, last_reviewed, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(account_key, path) DO UPDATE SET
        title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_mastery.title END,
        data_json = excluded.data_json,
        m = CASE WHEN excluded.m IS NOT NULL THEN excluded.m ELSE account_mastery.m END,
        view_count = MAX(account_mastery.view_count, excluded.view_count),
        review_count = MAX(account_mastery.review_count, excluded.review_count),
        last_reviewed = MAX(account_mastery.last_reviewed, excluded.last_reviewed),
        updated_at = MAX(account_mastery.updated_at, excluded.updated_at)
    `).bind(accountKey, path, t, safeMasteryDataJson(mergedData), mStore, Number(mergedData.viewCount || mergedData.views || 0) || 0, Number(mergedData.reviewCount || 0) || 0, lrStore || 0, tsStore).run().catch(() => {});
    importedMastery += 1;
  }
  const quizMap = accountJsonNormaliseQuizMap(stores.quizSessions);
  for (const [path, arr] of Object.entries(quizMap)) {
    for (const session of (Array.isArray(arr) ? arr : []).slice(-160)) {
      const ts = aiQuizStableTimestampForCloud(session, path, session.completed_at || session.completedAt || session.updatedAt || session.ts || 0);
      const explicitRid = String(session.result_id || session.resultId || "").trim();
      const generatedRid = aiQuizSessionResultId(session, path, ts);
      const rid = (/^(aiq|local-aiq|snap-aiq)-/i.test(explicitRid) ? generatedRid : (explicitRid || generatedRid)).trim();
      const questions = Array.isArray(session.questions) ? session.questions : [];
      const correct = Math.max(0, Number(session.correct_count != null ? session.correct_count : session.correct || 0) || 0);
      const total = Math.max(questions.length, Number(session.total || session.total_questions || 0) || 0);
      await upsertAccountAiQuizSession(db, accountKey, path, session.concept_title || session.conceptTitle || session.title || path, rid, cleanSessionForAiQuizCloud(session, path, rid, ts, correct, total), ts);
      importedAiQuiz += 1;
    }
  }
  for (const ev of accountJsonArray(stores.activityEvents).slice(0, ACCOUNT_JSON_ACTIVITY_EVENT_MAX)) {
    const metric = activityMetric(ev.metric || ev.type || "");
    if (!metric) continue;
    const path = normaliseImportedConceptPath(ev.path || (ev.details && (ev.details.path || ev.details.conceptId)) || "");
    if (["view", "mastery", "saved_page_action", "saved_page_visit", "ai_quiz"].includes(metric) && !isConceptPath(path)) continue;
    const ts = normaliseTimestamp(ev.createdAt || ev.created_at || ev.ts || ev.updatedAt || 0) || now;
    const rawId = String(ev.id || "").replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 180);
    const id = rawId || `json-event-${activityHashString([accountKey, metric, path, ts, ev.title || ""].join("::"))}`;
    const details = ev.details && typeof ev.details === "object" ? Object.assign({}, ev.details) : {};
    details.accountJsonImport = true;
    try {
      await db.prepare(`
        INSERT OR IGNORE INTO user_activity_events (id, account_key, metric, count, score, path, title, details_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(id, accountKey, metric, Math.max(1, Number(ev.count || 1) || 1), Number(ev.score != null ? ev.score : activityXp(metric)) || 0, path, cleanTitle(ev.title || "", path), safeDetailsJson(details), ts).run();
      importedEvents += 1;
    } catch (_) {}
  }
  return { importedVisits, importedActions, importedReadiness, importedMastery, importedAiQuiz, importedEvents };
}


async function readStoredAccountJsonSnapshotChunkRows(db, accountKey) {
  const rows = await db.prepare(`
    SELECT chunk_index, chunk_count, data_json, updated_at
    FROM account_json_snapshot_chunks
    WHERE account_key = ?
    ORDER BY chunk_index ASC
  `).bind(accountKey).all().catch(() => ({ results: [] }));
  return rows.results || [];
}

function accountJsonStoredChunksComplete(list) {
  const rows = Array.isArray(list) ? list : [];
  if (!rows.length) return false;
  const count = Math.max(...rows.map((r) => Number(r.chunk_count || 0) || 0));
  if (!count || rows.length < count) return false;
  for (let i = 0; i < count; i += 1) {
    if (!rows.find((r) => Number(r.chunk_index) === i)) return false;
  }
  return true;
}

async function readStoredAccountJsonSnapshotOnly(db, accountKey) {
  const list = await readStoredAccountJsonSnapshotChunkRows(db, accountKey);
  if (!accountJsonStoredChunksComplete(list)) {
    return { snapshot: await buildAccountJsonSnapshotFromCanonical(db, accountKey), updatedAt: 0, chunkCount: list.length, seeded: true };
  }
  const chunkCount = Math.max(...list.map((r) => Number(r.chunk_count || 0) || 0));
  let text = "";
  for (let i = 0; i < chunkCount; i += 1) {
    const row = list.find((r) => Number(r.chunk_index) === i);
    if (!row) return { snapshot: await buildAccountJsonSnapshotFromCanonical(db, accountKey), updatedAt: 0, chunkCount: list.length, seeded: true };
    text += String(row.data_json || "");
  }
  try {
    const parsed = parseAccountJsonSnapshotObject(JSON.parse(text || "{}"));
    return { snapshot: parsed, updatedAt: Math.max(...list.map((r) => Number(r.updated_at || 0) || 0)), chunkCount };
  } catch (_) {
    return { snapshot: await buildAccountJsonSnapshotFromCanonical(db, accountKey), updatedAt: 0, chunkCount, parseError: true, seeded: true };
  }
}

async function accountJsonCanonicalActivityEventCount(db, accountKey) {
  const row = await db.prepare(`
    SELECT COUNT(*) AS n
    FROM user_activity_events
    WHERE account_key = ?
  `).bind(accountKey).first().catch(() => null);
  return Math.min(ACCOUNT_JSON_ACTIVITY_EVENT_MAX, Math.max(0, Number(row && row.n || 0) || 0));
}

function accountJsonSnapshotOmitActivityEvents(snapshot) {
  const src = snapshot && typeof snapshot === "object" ? snapshot : emptyAccountJsonSnapshot();
  const stores = src.stores && typeof src.stores === "object" && !Array.isArray(src.stores) ? src.stores : {};
  return Object.assign({}, src, {
    stores: Object.assign({}, stores, { activityEvents: [] }),
    activityEventsOmitted: true,
    activityEventMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX,
    learningHistoryMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX,
  });
}

function accountJsonTransientChunkRowsForSnapshot(snapshot, size) {
  const text = JSON.stringify(snapshot || emptyAccountJsonSnapshot());
  const chunks = snapshotTextChunks(text, size || 45000);
  const now = Date.now();
  return chunks.map((chunk, i) => ({ chunk_index: i, chunk_count: chunks.length, data_json: chunk, updated_at: now }));
}

function accountJsonSnapshotFromRows(list) {
  const rows = Array.isArray(list) ? list : [];
  const chunkCount = rows.length ? Math.max(...rows.map((r) => Number(r.chunk_count || 0) || 0)) : 0;
  let text = "";
  for (let i = 0; i < chunkCount; i += 1) {
    const row = rows.find((r) => Number(r.chunk_index) === i);
    if (!row) return { snapshot: emptyAccountJsonSnapshot(), stats: { total: 0, stores: {} }, parseError: true, chunkCount };
    text += String(row.data_json || "");
  }
  try {
    const snapshot = JSON.parse(text || "{}");
    return { snapshot, stats: accountJsonSnapshotStats(snapshot), chunkCount };
  } catch (_) {
    return { snapshot: emptyAccountJsonSnapshot(), stats: { total: 0, stores: {} }, parseError: true, chunkCount };
  }
}

async function ensureStoredAccountJsonSnapshotChunks(db, accountKey) {
  let list = await readStoredAccountJsonSnapshotChunkRows(db, accountKey);
  let complete = accountJsonStoredChunksComplete(list);
  let hasOversizedOldChunks = complete && list.some((r) => String(r.data_json || "").length > 52000);
  let parsed = complete ? accountJsonSnapshotFromRows(list) : { stats: { total: 0, stores: {} }, parseError: true };
  const canonicalActivityCount = await accountJsonCanonicalActivityEventCount(db, accountKey);
  const storedActivityCount = Math.max(0, Number(parsed && parsed.stats && parsed.stats.stores && parsed.stats.stores.activityEvents || 0));
  const snapshotCap = Number(parsed && parsed.snapshot && (parsed.snapshot.activityEventMax || parsed.snapshot.learningHistoryMax) || 0);
  // Older deployed Workers wrote complete snapshots capped at 1500 or 5000.  A
  // complete old snapshot would otherwise be trusted forever, so the client
  // would keep seeing exactly 5000 cloud learning-history rows.  Rebuild from
  // canonical activity events whenever the stored snapshot is below the current
  // cap and canonical has more events available.
  const capUpgradeNeeded = complete && !parsed.parseError && (snapshotCap < ACCOUNT_JSON_ACTIVITY_EVENT_MAX || storedActivityCount < Math.min(canonicalActivityCount, ACCOUNT_JSON_ACTIVITY_EVENT_MAX));
  if (!complete || hasOversizedOldChunks || capUpgradeNeeded || parsed.parseError) {
    const base = complete && !parsed.parseError ? parsed : { snapshot: await buildAccountJsonSnapshotFromCanonical(db, accountKey) };
    const canonical = await buildAccountJsonSnapshotFromCanonical(db, accountKey);
    const mergedStores = accountJsonMergeStores(base.snapshot && base.snapshot.stores || {}, canonical.stores || {});
    await writeAccountJsonSnapshot(db, accountKey, { type: "account_json_snapshot", version: 1, updatedAt: Date.now(), stores: mergedStores, activityEventMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX, learningHistoryMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX });
    list = await readStoredAccountJsonSnapshotChunkRows(db, accountKey);
    parsed = accountJsonSnapshotFromRows(list);
  }
  const chunkCount = list.length ? Math.max(...list.map((r) => Number(r.chunk_count || 0) || 0)) : 0;
  const updatedAt = list.length ? Math.max(...list.map((r) => Number(r.updated_at || 0) || 0)) : 0;
  return { rows: list, chunkCount, updatedAt, stats: parsed.stats || { total: 0, stores: {} }, activityEventMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX };
}

async function handleGetAccountJsonSnapshot(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const wantsChunked = url.searchParams.get("chunked") === "1" || url.searchParams.get("chunked") === "true" || url.searchParams.has("chunkIndex") || url.searchParams.has("chunk_index") || url.searchParams.has("meta");
  const omitActivityEvents = url.searchParams.get("omitActivityEvents") === "1" || url.searchParams.get("withoutActivityEvents") === "1" || url.searchParams.get("omit_activity_events") === "1";
  if (wantsChunked) {
    const stored = await ensureStoredAccountJsonSnapshotChunks(env.DB, acc.accountKey);
    let rows = stored.rows || [];
    let count = Math.max(0, Number(stored.chunkCount || 0) || 0);
    let updatedAt = stored.updatedAt || 0;
    if (omitActivityEvents) {
      const parsed = accountJsonSnapshotFromRows(rows);
      const smallSnapshot = accountJsonSnapshotOmitActivityEvents(parsed.snapshot || emptyAccountJsonSnapshot());
      rows = accountJsonTransientChunkRowsForSnapshot(smallSnapshot, 45000);
      count = rows.length;
      updatedAt = Date.now();
    }
    if (url.searchParams.has("meta") || !url.searchParams.has("chunkIndex") && !url.searchParams.has("chunk_index")) {
      return json({ ok: true, chunked: true, accountKey: acc.accountKey, chunkCount: count, updatedAt, activityEventMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX, learningHistoryMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX, activityEventsOmitted: !!omitActivityEvents, stats: stored.stats || { total: 0, stores: {} } }, 200, req, env);
    }
    const idx = Math.max(0, Math.floor(Number(url.searchParams.get("chunkIndex") || url.searchParams.get("chunk_index") || 0) || 0));
    const row = rows.find((r) => Number(r.chunk_index) === idx);
    if (!row || idx >= count) return json({ ok: false, error: "Cloud snapshot chunk was not found.", chunkIndex: idx, chunkCount: count }, 404, req, env);
    return json({ ok: true, chunked: true, accountKey: acc.accountKey, chunkIndex: idx, chunkCount: count, chunk: String(row.data_json || ""), updatedAt: Number(row.updated_at || updatedAt || 0), activityEventsOmitted: !!omitActivityEvents }, 200, req, env);
  }
  const snap = await readAccountJsonSnapshot(env.DB, acc.accountKey);
  return json({ ok: true, accountKey: acc.accountKey, snapshot: snap.snapshot || emptyAccountJsonSnapshot(), stats: accountJsonSnapshotStats(snap.snapshot || emptyAccountJsonSnapshot()), updatedAt: snap.updatedAt || 0, chunkCount: snap.chunkCount || 0, seeded: !!snap.seeded, incomplete: !!snap.incomplete }, 200, req, env);
}

async function handlePostAccountJsonSnapshotChunk(req, env) {
  const body = await readJson(req, 900000);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const syncId = cleanSnapshotSyncId(body.syncId || body.sync_id || "");
  const chunkIndex = Math.max(0, Math.floor(Number(body.chunkIndex || body.chunk_index || 0) || 0));
  const chunkCount = Math.max(1, Math.min(250, Math.floor(Number(body.chunkCount || body.chunk_count || 1) || 1)));
  const chunk = String(body.chunk || body.data || "");
  if (chunkIndex >= chunkCount) return json({ ok: false, error: "Invalid account JSON snapshot chunk index." }, 400, req, env);
  if (chunk.length > 700000) return json({ ok: false, error: "Account JSON snapshot chunk is too large." }, 413, req, env);
  const now = Date.now();
  await env.DB.prepare(`DELETE FROM account_json_upload_chunks WHERE account_key = ? AND created_at < ?`).bind(acc.accountKey, now - 30 * 60 * 1000).run().catch(() => {});
  await env.DB.prepare(`
    INSERT INTO account_json_upload_chunks (account_key, sync_id, chunk_index, chunk_count, data_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_key, sync_id, chunk_index) DO UPDATE SET
      chunk_count = excluded.chunk_count,
      data_json = excluded.data_json,
      created_at = excluded.created_at
  `).bind(acc.accountKey, syncId, chunkIndex, chunkCount, chunk, now).run();
  const rows = await env.DB.prepare(`SELECT chunk_index, chunk_count, data_json FROM account_json_upload_chunks WHERE account_key = ? AND sync_id = ? ORDER BY chunk_index ASC`).bind(acc.accountKey, syncId).all();
  const list = rows.results || [];
  if (list.length < chunkCount) return json({ ok: true, partial: true, received: list.length, chunkCount }, 200, req, env);
  let text = "";
  for (let i = 0; i < chunkCount; i += 1) {
    const row = list.find((r) => Number(r.chunk_index) === i);
    if (!row) return json({ ok: true, partial: true, received: list.length, chunkCount }, 200, req, env);
    text += String(row.data_json || "");
  }
  let incoming = {};
  try { incoming = JSON.parse(text || "{}"); } catch (_) { return json({ ok: false, error: "Invalid account JSON snapshot." }, 400, req, env); }
  const existing = await readStoredAccountJsonSnapshotOnly(env.DB, acc.accountKey);
  const beforeStats = accountJsonSnapshotStats(existing.snapshot || emptyAccountJsonSnapshot());
  const incomingStats = accountJsonSnapshotStats(incoming || emptyAccountJsonSnapshot());
  const mergedStores = accountJsonMergeStores(existing.snapshot && existing.snapshot.stores || {}, parseAccountJsonSnapshotObject(incoming).stores || {});
  const merged = { type: "account_json_snapshot", version: 1, updatedAt: Date.now(), activityEventMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX, learningHistoryMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX, stores: mergedStores };
  const written = await writeAccountJsonSnapshot(env.DB, acc.accountKey, merged);
  const deferCanonical = body.deferCanonical === true || body.defer_canonical === true || body.fast === true;
  const canonicalImported = deferCanonical ? { deferred: true } : await importAccountJsonSnapshotToCanonical(env.DB, acc.accountKey, written.snapshot).catch(() => ({}));
  await env.DB.prepare(`DELETE FROM account_json_upload_chunks WHERE account_key = ? AND sync_id = ?`).bind(acc.accountKey, syncId).run().catch(() => {});
  const afterStats = accountJsonSnapshotStats(written.snapshot || emptyAccountJsonSnapshot());
  const shouldReturnSnapshot = body.returnSnapshot !== false && body.return_snapshot !== false && body.summaryOnly !== true && body.summary_only !== true;
  const payload = { ok: true, partial: false, received: list.length, chunkCount, accountKey: acc.accountKey, stats: afterStats, summary: { before: beforeStats, incoming: incomingStats, after: afterStats, uploaded: accountJsonPositiveDelta(beforeStats, afterStats), canonicalImported }, canonicalDeferred: deferCanonical, updatedAt: written.updatedAt, snapshotChunkCount: written.chunkCount };
  if (shouldReturnSnapshot) payload.snapshot = written.snapshot;
  return json(payload, 200, req, env);
}


// Two events are the SAME logical action when their stable content matches. The
// client used to mint a RANDOM id for any id-less (legacy/old-format) event, so the
// same event got a different id on every device and the id-based dedup could never
// collapse the copies — they piled up across devices ("duplicate-add" that inflated
// the cloud event count). Collapsing by content here removes the already-stored
// divergent-id copies and keeps a single deterministic survivor, so the snapshot
// (and the events-only XP/EORbits + leaderboard derived from it) stop double-counting.
function accountEventContentSignature(ev) {
  if (!ev || typeof ev !== "object") return "";
  const d = ev.details && typeof ev.details === "object" && !Array.isArray(ev.details) ? ev.details : {};
  const value = ev.value !== undefined && ev.value !== null ? ev.value : "";
  const active = ev.active === false ? "0" : (ev.active === true ? "1" : "");
  return [
    ev.type || "", ev.metric || "", ev.path || "", ev.action || "", active, value,
    Math.floor(Number(ev.ts || ev.createdAt || ev.created_at || 0) || 0),
    d.resultId || d.result_id || "", d.sessionId || d.session_id || "",
    d.commentId || d.comment_id || "", d.notificationId || d.notification_id || ""
  ].join("|#~#|");
}
function pickRepresentativeAccountEvent(a, b) {
  const ca = Math.max(0, Number(a.count || 1) || 0);
  const cb = Math.max(0, Number(b.count || 1) || 0);
  if (cb > ca) return b;
  if (ca > cb) return a;
  const ua = Number(a.updatedAt || a.ts || 0);
  const ub = Number(b.updatedAt || b.ts || 0);
  if (ub > ua) return b;
  if (ua > ub) return a;
  return String(a.id || "") <= String(b.id || "") ? a : b;
}
function collapseAccountEventContentDuplicates(events) {
  const list = Array.isArray(events) ? events : [];
  const bySig = new Map();
  const passthrough = [];
  for (const ev of list) {
    if (!ev) continue;
    if (isAccountScoreBaselineFileEvent(ev)) { passthrough.push(ev); continue; }
    const sig = accountEventContentSignature(ev);
    if (!sig) { passthrough.push(ev); continue; }
    const prev = bySig.get(sig);
    bySig.set(sig, prev ? pickRepresentativeAccountEvent(prev, ev) : ev);
  }
  return passthrough.concat(Array.from(bySig.values()));
}
// XP-EXACT shrink (MUST stay identical to the client's aggregateBrowsingEvents in
// track-views.js). Collapse repeated same-UTC-day browsing/UI events for the same
// (metric, path, action) into one event with summed count. Events are scored by count
// with the same per-count repeat-discount + daily cap, so XP/EORbits are unchanged.
// State-bearing events are never touched. Deterministic id => device and cloud converge.
function aggregateAccountBrowsingEvents(events) {
  const AGG_TYPES = { page_visit: 1, activity: 1 };
  const out = [];
  const groups = new Map();
  for (const ev of (Array.isArray(events) ? events : [])) {
    if (!ev || typeof ev !== "object") { continue; }
    const d = ev.details && typeof ev.details === "object" ? ev.details : {};
    const explicit = d.stateKey || d.actionStateKey || d.clientDedupeKey || d.resultId || d.result_id || d.sessionId || d.session_id || d.commentId || d.comment_id || d.notificationId || d.notification_id;
    if (!AGG_TYPES[String(ev.type || "")] || explicit || ev.value !== undefined || ev.active !== undefined) { out.push(ev); continue; }
    const day = Math.floor((Number(ev.ts || ev.createdAt || 0) || 0) / 86400000);
    const metric = String(ev.metric || "");
    const path = String(ev.path || "");
    const action = String(ev.action || "");
    const key = day + "|" + metric + "|" + path + "|" + action;
    const cnt = Math.max(1, Number(ev.count || 1) || 1);
    const g = groups.get(key);
    if (!g) {
      groups.set(key, Object.assign({}, ev, { id: ("agg_" + day + "_" + metric + "_" + path + "_" + action).replace(/[^a-zA-Z0-9_.:-]/g, "_").slice(0, 220), count: cnt }));
    } else {
      g.count += cnt;
      const ts = Number(ev.ts || 0);
      if (ts && ts < (Number(g.ts || 0) || Infinity)) { g.ts = ev.ts; g.createdAt = ev.createdAt || ev.ts; }
    }
  }
  for (const g of groups.values()) out.push(g);
  return out;
}
function normaliseAccountEventFile(input) {
  const src = input && typeof input === "object" ? input : {};
  const rawEvents = Array.isArray(src.eventLog) ? src.eventLog : [];
  const map = new Map();
  for (const raw of rawEvents) {
    if (!raw || typeof raw !== "object") continue;
    const ts = Math.max(0, Math.floor(Number(raw.ts || raw.createdAt || raw.created_at || 0) || 0)) || Date.now();
    const metric = String(raw.metric || "activity").trim().slice(0, 80);
    const type = String(raw.type || "activity").trim().slice(0, 80);
    const path = normalizePath(raw.path || raw.conceptId || raw.concept_id || "");
    const action = String(raw.action || "").trim().slice(0, 80);
    const id = String(raw.id || `evt_${metric}_${path}_${action}_${ts}_${activityHashString(JSON.stringify(raw).slice(0, 500))}`).slice(0, 220);
    let details = {};
    if (raw.details && typeof raw.details === "object" && !Array.isArray(raw.details)) {
      try { details = JSON.parse(JSON.stringify(raw.details)); } catch (_) { details = {}; }
    }
    const ev = {
      id,
      type,
      metric,
      count: Math.max(0, Number(raw.count || (details && details.count) || 1) || 1),
      score: Number.isFinite(Number(raw.score)) ? Number(raw.score) : undefined,
      ts,
      createdAt: Math.max(0, Math.floor(Number(raw.createdAt || raw.created_at || ts) || ts)),
      updatedAt: Math.max(0, Math.floor(Number(raw.updatedAt || raw.updated_at || ts) || ts)),
      deviceId: String(raw.deviceId || raw.device_id || "").slice(0, 120),
      deviceName: String(raw.deviceName || raw.device_name || "").slice(0, 120),
      visitorId: String(raw.visitorId || raw.visitor_id || "").slice(0, 160),
      accountKey: String(raw.accountKey || raw.account_key || "").slice(0, 180),
      path,
      title: cleanTitle(raw.title || details.title || path || "", path),
      action,
      active: typeof raw.active === "boolean" ? raw.active : (typeof details.active === "boolean" ? details.active : undefined),
      value: raw.value !== undefined ? raw.value : details.value,
      oldValue: raw.oldValue !== undefined ? raw.oldValue : details.oldValue,
      details,
    };
    const old = map.get(id);
    if (!old || Number(ev.updatedAt || ev.ts || 0) >= Number(old.updatedAt || old.ts || 0)) map.set(id, ev);
  }
  const eventLog = collapseAccountEventContentDuplicates(aggregateAccountBrowsingEvents(Array.from(map.values()))).sort((a, b) => (Number(a.ts || 0) - Number(b.ts || 0)) || String(a.id || "").localeCompare(String(b.id || ""))).slice(-50000);
  const now = Date.now();
  let scoreState = null;
  if (src.scoreState && typeof src.scoreState === "object" && !Array.isArray(src.scoreState)) {
    try { scoreState = JSON.parse(JSON.stringify(src.scoreState)); } catch (_) { scoreState = null; }
  }
  const out = {
    schema: "mk-account-data-file",
    version: 1,
    createdAt: Math.max(0, Math.floor(Number(src.createdAt || now) || now)),
    updatedAt: Math.max(0, Math.floor(Number(src.updatedAt || now) || now)),
    deviceId: String(src.deviceId || "").slice(0, 120),
    deviceName: String(src.deviceName || "").slice(0, 120),
    eventLog,
  };
  if (scoreState) out.scoreState = scoreState;
  return out;
}

function mergeAccountEventFiles(a, b) {
  const fa = normaliseAccountEventFile(a || {});
  const fb = normaliseAccountEventFile(b || {});
  const map = new Map();
  for (const ev of [].concat(fa.eventLog || [], fb.eventLog || [])) {
    const id = String(ev && ev.id || "");
    if (!id) continue;
    const old = map.get(id);
    if (!old || Number(ev.updatedAt || ev.ts || 0) >= Number(old.updatedAt || old.ts || 0)) map.set(id, ev);
  }
  const scoreA = accountFileScoreStateTotal(fa);
  const scoreB = accountFileScoreStateTotal(fb);
  const stateA = accountFileScoreState(fa);
  const stateB = accountFileScoreState(fb);
  const updatedA = accountFileScoreStateUpdatedAt(fa);
  const updatedB = accountFileScoreStateUpdatedAt(fb);
  const scoreState = scoreB > scoreA + 0.000001
    ? stateB
    : (scoreA > scoreB + 0.000001 ? stateA : (updatedB >= updatedA ? (stateB || stateA) : (stateA || stateB)));
  return normaliseAccountEventFile({
    createdAt: Math.min(Number(fa.createdAt || Date.now()), Number(fb.createdAt || Date.now())),
    updatedAt: Date.now(),
    eventLog: Array.from(map.values()),
    scoreState,
  });
}

function isSeedAccountEventFileEvent(ev) {
  const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
  const src = String(d.source || "").toLowerCase();
  const metric = String(ev && ev.metric || "").toLowerCase();
  return metric.indexOf("_seed") >= 0 || src.indexOf("account-json-") >= 0 || src.indexOf("seed") >= 0;
}

function shouldReplaceAccountPageActionEvent(oldEv, ev) {
  if (!oldEv) return true;
  const nextSeed = isSeedAccountEventFileEvent(ev);
  const oldSeed = isSeedAccountEventFileEvent(oldEv);
  if (oldSeed && !nextSeed) return true;
  if (!oldSeed && nextSeed) return false;
  return Number(ev && (ev.ts || ev.updatedAt || ev.updated_at) || 0) >= Number(oldEv && (oldEv.ts || oldEv.updatedAt || oldEv.updated_at) || 0);
}

function accountEventFileHashText(text) {
  let h = 2166136261;
  const s = String(text || "");
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

function accountEventFileScoreStateFingerprintText(file) {
  const st = accountFileScoreState(file) || {};
  const daily = new Map();
  const addDay = (day, row) => {
    const r = cleanAccountFileScoreStateDailyBucket(row, day);
    if (!r.day) return;
    if (Math.abs(r.score) < 0.000001 && Math.abs(r.rawScore) < 0.000001 && Math.abs(r.scoreBeforeDailyCap) < 0.000001 && Math.abs(r.currencyEarned) < 0.000001 && Math.abs(r.currencySpent) < 0.000001 && Math.abs(r.currencyCredited) < 0.000001 && Math.abs(r.count) < 0.000001) return;
    daily.set(r.day, [r.day, r.count, r.rawScore, r.scoreBeforeDailyCap, r.score, r.currencyEarned, r.currencySpent, r.currencyCredited].join(":"));
  };
  if (st.dailyBuckets && typeof st.dailyBuckets === "object" && !Array.isArray(st.dailyBuckets)) Object.entries(st.dailyBuckets).forEach(([d, row]) => addDay(d, row));
  if (Array.isArray(st.dailySummary)) st.dailySummary.forEach((row) => addDay(row && row.day, row));
  return [
    "score-state-v1",
    accountFileScoreStateTotal(file),
    roundScore(st.totalRawScore || 0),
    roundScore(st.totalRepeatAdjustedScore || 0),
    roundScore(st.totalBeforeDailyCap || 0),
    roundScore(st.totalCurrencyEarned != null ? st.totalCurrencyEarned : st.currencyEarned || 0),
    roundScore(st.currencyCredited || 0),
    roundScore(st.currencySpent || 0),
    roundScore(st.currencyBalance != null ? st.currencyBalance : st.eorbits || 0),
    Array.from(daily.keys()).sort().map((d) => daily.get(d)).join(";")
  ].join("|");
}

function accountEventFileFingerprint(file, opts) {
  const f = (opts && opts.normalised && file && typeof file === "object" && Array.isArray(file.eventLog)) ? file : normaliseAccountEventFile(file || {});
  const rows = (f.eventLog || []).map((ev) => {
    const e = ev && typeof ev === "object" ? ev : {};
    const d = e.details && typeof e.details === "object" && !Array.isArray(e.details) ? e.details : {};
    // CONTENT identity (no raw id, no updatedAt) — must match the client's
    // eventIdentityForFingerprint so a content-equal device and the cloud produce the
    // same fingerprint/eventCount and the status check can read "synced".
    return [
      e.type || "",
      e.metric || "",
      e.path || "",
      e.action || "",
      e.active === false ? "0" : (e.active === true ? "1" : ""),
      e.value != null ? String(e.value) : "",
      Math.floor(Number(e.ts || e.createdAt || e.created_at || 0) || 0),
      d.resultId || d.result_id || "",
      d.sessionId || d.session_id || "",
      d.commentId || d.comment_id || "",
      d.notificationId || d.notification_id || ""
    ].map((x) => String(x == null ? "" : x).replace(/[|\n\r]/g, " ")).join("|");
  }).sort();
  const eventText = rows.join("\n");
  const scoreStateText = accountEventFileScoreStateFingerprintText(f);
  return {
    algorithm: "fnv1a-event-ledger-score-state-v3-content",
    eventCount: rows.length,
    hash: accountEventFileHashText(eventText + "\n--score-state--\n" + scoreStateText),
    eventHash: accountEventFileHashText(eventText),
    scoreStateHash: accountEventFileHashText(scoreStateText)
  };
}

function accountEventFileDerivedStats(file, opts) {
  const f = (opts && opts.normalised && file && typeof file === "object" && Array.isArray(file.eventLog)) ? file : normaliseAccountEventFile(file || {});
  const visits = new Set();
  const actions = new Map();
  const mastery = new Map();
  const quiz = new Set();
  const readiness = new Set();
  const comments = new Set();
  let xpEvents = 0;
  for (const ev of f.eventLog || []) {
    const metric = String(ev.metric || "");
    if (USER_ACTIVITY_RULES[metric]) xpEvents += 1;
    const path = normalizePath(ev.path || "");
    if ((ev.type === "page_visit" || metric === "view") && path) visits.add(path);
    if (ev.type === "page_action_set" && path && ev.action) {
      const key = `${path}::${ev.action}`;
      const old = actions.get(key);
      if (shouldReplaceAccountPageActionEvent(old, ev)) actions.set(key, ev);
    }
    if ((ev.type === "mastery_set" || metric === "mastery") && path) {
      const old = mastery.get(path);
      if (!old || Number(ev.ts || 0) >= Number(old.ts || 0)) mastery.set(path, ev);
    }
    if ((ev.type === "ai_quiz_complete" || metric === "ai_quiz")) quiz.add(String(ev.details && (ev.details.resultId || ev.details.result_id || ev.details.sessionId || ev.details.session_id) || ev.id || ""));
    if ((ev.type === "readiness_set" || ev.type === "readiness_view" || metric === "prerequisite_readiness_open") && path) readiness.add(path);
    if (["comment", "reply", "comment_edit", "report"].includes(metric) || /^comment_/.test(String(ev.type || ""))) comments.add(String(ev.details && (ev.details.commentId || ev.details.comment_id || ev.details.id) || ev.id || ""));
  }
  const activeActions = Array.from(actions.values()).filter((ev) => ev && ev.active !== false);
  const stores = {
    eventLog: f.eventLog.length,
    activityEvents: xpEvents,
    visits: visits.size,
    pageActions: activeActions.length,
    favorites: activeActions.filter((ev) => ev.action === "favorite").length,
    mastery: Array.from(mastery.values()).filter((ev) => {
      const val = ev.value != null ? Number(ev.value) : Number(ev.details && (ev.details.level != null ? ev.details.level : ev.details.mastery));
      return [0, 1, 2, 3].includes(val);
    }).length,
    quizSessions: Array.from(quiz).filter(Boolean).length,
    readiness: readiness.size,
    comments: Array.from(comments).filter(Boolean).length,
    localStorage: 0,
  };
  return { total: Object.values(stores).reduce((s, n) => s + Number(n || 0), 0), stores };
}


function accountEventTypeForMetric(metric) {
  const m = String(metric || "").trim();
  if (m === "view") return "page_visit";
  if (m === "active_day") return "wiki_open";
  if (m === "saved_page_action" || m === "saved_page_visit") return "page_action_event";
  if (m === "mastery") return "mastery_set";
  if (m === "ai_quiz") return "ai_quiz_complete";
  if (m === "comment" || m === "reply" || m === "comment_edit" || m === "report") return "comment_event";
  return "activity";
}

function accountEventSeedId(prefix, parts) {
  const raw = (Array.isArray(parts) ? parts : [parts]).map((x) => String(x == null ? "" : x)).join("::");
  return `${String(prefix || "seed").replace(/[^a-zA-Z0-9_.:-]/g, "_")}_${activityHashString(raw)}`.slice(0, 220);
}

function accountEventFileFromAccountJsonSnapshot(snapshot, accountKey) {
  const snap = parseAccountJsonSnapshotObject(snapshot || emptyAccountJsonSnapshot());
  const stores = snap.stores && typeof snap.stores === "object" && !Array.isArray(snap.stores) ? snap.stores : {};
  const key = identityNameKey(accountKey || "");
  const events = [];
  const seen = new Set();
  const now = Date.now();
  const hasCanonicalActivityEvents = accountJsonArray(stores.activityEvents).length > 0;
  const add = (seedPrefix, ev) => {
    const src = ev && typeof ev === "object" ? ev : {};
    const metric = String(src.metric || "activity").trim().slice(0, 80) || "activity";
    const type = String(src.type || accountEventTypeForMetric(metric)).trim().slice(0, 80) || "activity";
    const path = normalizePath(src.path || src.conceptId || src.concept_id || "");
    const details = src.details && typeof src.details === "object" && !Array.isArray(src.details) ? src.details : {};
    const ts = normaliseTimestamp(src.ts || src.createdAt || src.created_at || src.completedAt || src.completed_at || src.updatedAt || src.updated_at || details.completedAt || details.completed_at || details.ts || 0) || now;
    const id = String(src.id || accountEventSeedId(seedPrefix || type || metric, [key, type, metric, path, src.action || details.action || "", ts, JSON.stringify(details).slice(0, 700)])).slice(0, 220);
    if (!id || seen.has(id)) return;
    seen.add(id);
    events.push({
      id,
      type,
      metric,
      count: Math.max(1, Number(src.count || details.count || 1) || 1),
      score: Number(src.score || details.score || 0) || 0,
      ts,
      createdAt: normaliseTimestamp(src.createdAt || src.created_at || ts) || ts,
      updatedAt: normaliseTimestamp(src.updatedAt || src.updated_at || ts) || ts,
      deviceId: String(src.deviceId || src.device_id || "cloud-account").slice(0, 120),
      deviceName: String(src.deviceName || src.device_name || "Cloud account").slice(0, 120),
      visitorId: String(src.visitorId || src.visitor_id || "").slice(0, 160),
      accountKey: key,
      path,
      title: cleanTitle(src.title || details.title || path || "", path),
      action: String(src.action || details.action || "").trim().slice(0, 80),
      active: typeof src.active === "boolean" ? src.active : (typeof details.active === "boolean" ? details.active : undefined),
      value: src.value !== undefined ? src.value : details.value,
      oldValue: src.oldValue !== undefined ? src.oldValue : details.oldValue,
      details: Object.assign({ source: "account-json-seed" }, details),
    });
  };

  for (const row of accountJsonArray(stores.activityEvents).slice(0, ACCOUNT_JSON_ACTIVITY_EVENT_MAX)) {
    const r = row && typeof row === "object" ? row : {};
    const metric = activityMetric(r.metric || r.type || "") || String(r.metric || r.type || "activity").trim().toLowerCase().replace(/[\s-]+/g, "_") || "activity";
    const details = r.details && typeof r.details === "object" && !Array.isArray(r.details) ? r.details : {};
    const ts = normaliseTimestamp(r.ts || r.createdAt || r.created_at || details.ts || details.completedAt || details.completed_at || 0) || now;
    add("canonical-activity", {
      id: r.id ? `canonical:${String(r.id).slice(0, 190)}` : "",
      type: r.type || accountEventTypeForMetric(metric),
      metric,
      count: r.count,
      score: r.score,
      ts,
      createdAt: ts,
      updatedAt: normaliseTimestamp(r.updatedAt || r.updated_at || ts) || ts,
      path: r.path || details.path || "",
      title: r.title || details.title || "",
      action: r.action || details.action || "",
      active: typeof r.active === "boolean" ? r.active : (typeof details.active === "boolean" ? details.active : undefined),
      value: r.value !== undefined ? r.value : details.value,
      oldValue: r.oldValue !== undefined ? r.oldValue : details.oldValue,
      details: Object.assign({}, details, { canonicalEventId: r.id || "", importedCount: Math.max(1, Number(r.count || 1) || 1), importedScore: Number(r.score || 0) || 0 }),
    });
  }

  for (const v of accountJsonArray(stores.visits).slice(0, 5000)) {
    const path = normaliseImportedConceptPath(v.path || "");
    if (!isConceptPath(path)) continue;
    const ts = normaliseTimestamp(v.lastVisited || v.last_visited || v.updatedAt || v.updated_at || v.ts || v.createdAt || v.created_at || 0) || now;
    add("seed-view", { type: "page_visit", metric: hasCanonicalActivityEvents ? "view_seed" : "view", path, title: v.title || path, ts, createdAt: normaliseTimestamp(v.firstVisited || v.first_visited || v.createdAt || v.created_at || ts) || ts, updatedAt: ts, details: { source: "account-json-visits", visitCount: Math.max(1, Number(v.visitCount || v.visit_count || 1) || 1) } });
  }

  for (const a of accountJsonArray(stores.pageActions).slice(0, 5000)) {
    const path = normaliseImportedConceptPath(a.path || "");
    const action = String(a.action || "").trim().toLowerCase();
    if (!isConceptPath(path) || !action) continue;
    const ts = normaliseTimestamp(a.updatedAt || a.updated_at || a.ts || a.createdAt || a.created_at || 0) || now;
    add("seed-action", { type: "page_action_set", metric: hasCanonicalActivityEvents ? "saved_page_action_seed" : "saved_page_action", path, title: a.title || path, action, active: a.active !== false && a.deleted !== true, ts, createdAt: normaliseTimestamp(a.createdAt || a.created_at || ts) || ts, updatedAt: ts, details: { source: "account-json-page-actions", action, active: a.active !== false && a.deleted !== true } });
  }

  for (const f of accountJsonArray(stores.favorites).slice(0, 3000)) {
    const path = normaliseImportedConceptPath(f.path || "");
    if (!isConceptPath(path)) continue;
    const ts = normaliseTimestamp(f.updatedAt || f.updated_at || f.ts || f.createdAt || f.created_at || 0) || now;
    add("seed-favorite", { type: "page_action_set", metric: hasCanonicalActivityEvents ? "saved_page_action_seed" : "saved_page_action", path, title: f.title || path, action: "favorite", active: f.active !== false && f.deleted !== true, ts, createdAt: normaliseTimestamp(f.createdAt || f.created_at || ts) || ts, updatedAt: ts, details: { source: "account-json-favorites", action: "favorite", active: f.active !== false && f.deleted !== true } });
  }

  for (const r of accountJsonArray(stores.readiness).slice(0, 5000)) {
    const path = normaliseImportedConceptPath(r.path || "");
    if (!isConceptPath(path)) continue;
    const ts = normaliseTimestamp(r.updatedAt || r.updated_at || r.ts || 0) || now;
    const readiness = Number(r.readiness != null ? r.readiness : (r.percent != null ? r.percent : r.score));
    add("seed-readiness", { type: "readiness_set", metric: "readiness", path, title: r.title || path, value: Number.isFinite(readiness) ? readiness : 0, ts, updatedAt: ts, details: { source: "account-json-readiness", readiness: Number.isFinite(readiness) ? readiness : 0 } });
  }

  for (const [path, data] of Object.entries(accountJsonNormaliseMasteryMap(stores.mastery)).slice(0, 10000)) {
    const p = normaliseImportedConceptPath(path || "");
    if (!isConceptPath(p)) continue;
    const d = data && typeof data === "object" ? data : {};
    const m = Number(d.m != null ? d.m : (d.mastery != null ? d.mastery : d.level));
    const ts = normaliseTimestamp(d.updatedAt || d.updated_at || d.cloudUpdatedAt || d.lastReviewed || d.last_reviewed || d.ts || 0) || now;
    add("seed-mastery", { type: "mastery_set", metric: hasCanonicalActivityEvents ? "mastery_seed" : "mastery", path: p, title: d.title || p, value: [0, 1, 2, 3].includes(m) ? m : null, ts, updatedAt: ts, details: Object.assign({}, d, { source: "account-json-mastery", mastery: [0, 1, 2, 3].includes(m) ? m : null }) });
  }

  const quizMap = accountJsonNormaliseQuizMap(stores.quizSessions);
  for (const [path, sessions] of Object.entries(quizMap).slice(0, 10000)) {
    const p = normaliseImportedConceptPath(path || "");
    if (!isConceptPath(p) || !Array.isArray(sessions)) continue;
    for (const session of sessions.slice(-200)) {
      const s = session && typeof session === "object" ? session : {};
      const rid = String(s.result_id || s.resultId || s.session_id || s.sessionId || accountEventSeedId("quiz-result", [key, p, JSON.stringify(s).slice(0, 800)])).slice(0, 160);
      const ts = normaliseTimestamp(s.completed_at || s.completedAt || s.result_at || s.resultAt || s.updatedAt || s.updated_at || s.ts || 0) || now;
      add("seed-aiq", { id: `seed:aiq:${activityHashString(`${key}:${p}:${rid}`)}`, type: "ai_quiz_complete", metric: hasCanonicalActivityEvents ? "ai_quiz_seed" : "ai_quiz", path: p, title: s.concept_title || s.conceptTitle || s.title || p, ts, createdAt: ts, updatedAt: ts, details: { source: "account-json-quiz-sessions", resultId: rid, sessionId: String(s.ts || rid || ""), completedAt: ts, completed: true, resultProduced: true, session: s } });
    }
  }

  for (const c of accountJsonArray(stores.comments).slice(0, 3000)) {
    const path = normaliseImportedConceptPath(c.path || "");
    const id = String(c.id || c.commentId || c.comment_id || "").trim();
    if (!id) continue;
    const metric = hasCanonicalActivityEvents ? (c.parentId || c.parent_id ? "reply_seed" : "comment_seed") : (c.parentId || c.parent_id ? "reply" : "comment");
    const ts = normaliseTimestamp(c.ts || c.createdAt || c.created_at || c.updatedAt || c.updated_at || 0) || now;
    add("seed-comment", { id: `seed:comment:${activityHashString(`${key}:${id}`)}`, type: "comment_event", metric, path, title: c.title || path || "", ts, createdAt: ts, updatedAt: normaliseTimestamp(c.editedAt || c.edited_at || c.updatedAt || c.updated_at || ts) || ts, details: { source: "account-json-comments", commentId: id, parentId: c.parentId || c.parent_id || "", deleted: !!c.deleted } });
  }

  return normaliseAccountEventFile({
    schema: "mk-account-data-file",
    version: 1,
    createdAt: Math.min(now, ...events.map((ev) => Number(ev.createdAt || ev.ts || now)).filter(Boolean)),
    updatedAt: Math.max(now, ...events.map((ev) => Number(ev.updatedAt || ev.ts || 0)).filter(Boolean)),
    deviceId: "cloud-account",
    deviceName: "Cloud account",
    eventLog: events,
  });
}

async function readOrSeedAccountEventFileSnapshot(db, accountKey) {
  const existing = await readAccountEventFileSnapshot(db, accountKey);
  const existingStats = accountEventFileDerivedStats(existing.file);
  if (existingStats.total > 0 || (existing.file && Array.isArray(existing.file.eventLog) && existing.file.eventLog.length > 0)) {
    return Object.assign({}, existing, { stats: existingStats, seededFromCanonical: false });
  }

  const accountJson = await readAccountJsonSnapshot(db, accountKey).catch(() => null);
  const seedFile = accountJson && accountJson.snapshot ? accountEventFileFromAccountJsonSnapshot(accountJson.snapshot, accountKey) : normaliseAccountEventFile({ eventLog: [] });
  const seedStats = accountEventFileDerivedStats(seedFile);
  if (seedStats.total <= 0 && !(seedFile.eventLog || []).length) {
    return Object.assign({}, existing, { stats: existingStats, seededFromCanonical: false });
  }

  const written = await writeAccountEventFileSnapshot(db, accountKey, seedFile);
  return Object.assign({}, written, {
    seededFromCanonical: true,
    seedSource: accountJson && accountJson.seeded ? "canonical" : "account-json",
    sourceUpdatedAt: accountJson && accountJson.updatedAt || 0,
    sourceChunkCount: accountJson && accountJson.chunkCount || 0,
    stats: accountEventFileDerivedStats(written.file),
  });
}

// Resolve the SINGLE canonical active snapshot for an account and repair any
// duplicate-active rows. A past write race could leave more than one snapshot_id
// flagged active=1; every read then did `WHERE active=1` and either interleaved
// chunks from different snapshots (corrupt JSON) or picked one arbitrarily, so the
// cloud read bounced between snapshots (e.g. 3097 vs 4473) and a chunked download
// returned a mixed, unusable file — which is why a diff-append could never make the
// missing events "land". We pick the most complete (then largest, then newest)
// active snapshot and deactivate the rest, so reads are deterministic and the
// duplicate self-heals.
async function resolveActiveAccountSnapshot(db, accountKey) {
  const key = identityNameKey(accountKey || "");
  if (!key) return null;
  const rows = await db.prepare(`
    SELECT snapshot_id, chunk_index, chunk_count, updated_at
    FROM account_event_file_snapshot_versions
    WHERE account_key = ? AND active = 1
  `).bind(key).all().catch(() => ({ results: [] }));
  const list = Array.isArray(rows && rows.results) ? rows.results : [];
  if (!list.length) return null;
  const bySnap = new Map();
  for (const r of list) {
    const sid = String(r.snapshot_id || "");
    if (!sid) continue;
    let g = bySnap.get(sid);
    if (!g) { g = { snapshotId: sid, chunkCount: 0, updatedAt: 0, have: new Set() }; bySnap.set(sid, g); }
    g.chunkCount = Math.max(g.chunkCount, Number(r.chunk_count || 0) || 0);
    g.updatedAt = Math.max(g.updatedAt, Number(r.updated_at || 0) || 0);
    g.have.add(Number(r.chunk_index || 0));
  }
  const groups = Array.from(bySnap.values()).map((g) => Object.assign(g, { complete: !!g.chunkCount && g.have.size >= g.chunkCount }));
  groups.sort((a, b) => {
    if (a.complete !== b.complete) return a.complete ? -1 : 1;   // complete first
    if (a.chunkCount !== b.chunkCount) return b.chunkCount - a.chunkCount; // most data
    if (a.updatedAt !== b.updatedAt) return b.updatedAt - a.updatedAt;     // newest
    return String(b.snapshotId).localeCompare(String(a.snapshotId));
  });
  const chosen = groups[0];
  if (groups.length > 1) {
    await db.prepare(`UPDATE account_event_file_snapshot_versions SET active = 0 WHERE account_key = ? AND active = 1 AND snapshot_id != ?`).bind(key, chosen.snapshotId).run().catch(() => {});
  }
  return chosen;
}

async function readAccountEventFileSnapshot(db, accountKey) {
  const accKey = identityNameKey(accountKey || "");
  // Prefer the new versioned snapshot table.  It makes cloud writes effectively
  // two-phase: a failed mobile upload/response can no longer leave the active
  // cloud account file half-deleted.  Fall back to the legacy table so existing
  // accounts still work before their next successful sync.
  const chosen = await resolveActiveAccountSnapshot(db, accKey);
  if (chosen) {
    // Read ONLY the chosen snapshot's chunks, never a mix of active snapshots.
    const versionRows = await db.prepare(`
      SELECT chunk_index, chunk_count, data_json, updated_at
      FROM account_event_file_snapshot_versions
      WHERE account_key = ? AND snapshot_id = ?
      ORDER BY chunk_index ASC
    `).bind(accKey, chosen.snapshotId).all().catch(() => null);
    const versionList = versionRows && Array.isArray(versionRows.results) ? versionRows.results : [];
    const chunkCount = Math.max(0, ...versionList.map((r) => Number(r.chunk_count || 0) || 0));
    const have = new Set(versionList.map((r) => Number(r.chunk_index)));
    if (!chunkCount || have.size < chunkCount) {
      return {
        file: normaliseAccountEventFile({ eventLog: [] }),
        updatedAt: Math.max(0, ...versionList.map((r) => Number(r.updated_at || 0) || 0)),
        chunkCount: versionList.length,
        expectedChunkCount: chunkCount,
        incomplete: true,
        versioned: true,
        snapshotId: chosen.snapshotId
      };
    }
    let text = "";
    for (let i = 0; i < chunkCount; i += 1) {
      const row = versionList.find((r) => Number(r.chunk_index) === i);
      if (!row) {
        return {
          file: normaliseAccountEventFile({ eventLog: [] }),
          updatedAt: Math.max(0, ...versionList.map((r) => Number(r.updated_at || 0) || 0)),
          chunkCount: versionList.length,
          expectedChunkCount: chunkCount,
          incomplete: true,
          versioned: true,
          snapshotId: chosen.snapshotId
        };
      }
      text += String(row.data_json || "");
    }
    try {
      return {
        file: normaliseAccountEventFile(JSON.parse(text || "{}")),
        updatedAt: Math.max(...versionList.map((r) => Number(r.updated_at || 0) || 0)),
        chunkCount,
        snapshotId: chosen.snapshotId,
        versioned: true
      };
    } catch (_) {
      return {
        file: normaliseAccountEventFile({ eventLog: [] }),
        updatedAt: Math.max(0, ...versionList.map((r) => Number(r.updated_at || 0) || 0)),
        chunkCount,
        parseError: true,
        versioned: true,
        snapshotId: chosen.snapshotId
      };
    }
  }

  const rows = await db.prepare(`
    SELECT chunk_index, chunk_count, data_json, updated_at
    FROM account_event_file_snapshot_chunks
    WHERE account_key = ?
    ORDER BY chunk_index ASC
  `).bind(accountKey).all().catch(() => ({ results: [] }));
  const list = rows.results || [];
  if (!list.length) return { file: normaliseAccountEventFile({ eventLog: [] }), updatedAt: 0, chunkCount: 0, versioned: false };
  const chunkCount = Math.max(...list.map((r) => Number(r.chunk_count || 0) || 0));
  if (!chunkCount || list.length < chunkCount) return { file: normaliseAccountEventFile({ eventLog: [] }), updatedAt: Math.max(0, ...list.map((r) => Number(r.updated_at || 0) || 0)), chunkCount: list.length, expectedChunkCount: chunkCount, incomplete: true, versioned: false };
  let text = "";
  for (let i = 0; i < chunkCount; i += 1) {
    const row = list.find((r) => Number(r.chunk_index) === i);
    if (!row) return { file: normaliseAccountEventFile({ eventLog: [] }), updatedAt: Math.max(0, ...list.map((r) => Number(r.updated_at || 0) || 0)), chunkCount: list.length, expectedChunkCount: chunkCount, incomplete: true, versioned: false };
    text += String(row.data_json || "");
  }
  try {
    return { file: normaliseAccountEventFile(JSON.parse(text || "{}")), updatedAt: Math.max(...list.map((r) => Number(r.updated_at || 0) || 0)), chunkCount, versioned: false };
  } catch (_) {
    return { file: normaliseAccountEventFile({ eventLog: [] }), updatedAt: Math.max(0, ...list.map((r) => Number(r.updated_at || 0) || 0)), chunkCount, parseError: true, versioned: false };
  }
}

// Store an uploaded account-file body as the new ACTIVE snapshot WITHOUT parsing
// or merging it in the request.  The account-file-sync client uploads the full
// local+cloud union, so the text is already the authoritative file.  This keeps
// the upload request to a few D1 writes (no multi-MB parse/normalise/stringify),
// so it returns fast and never exceeds the Worker's CPU/memory limits no matter
// how large the account is — the heavy stats/fingerprint/projection run in the
// background via ctx.waitUntil.
async function storeAccountEventFileSnapshotFromText(db, accountKey, text) {
  const key = identityNameKey(accountKey || "");
  if (!key) throw new Error("missing account");
  const now = Date.now();
  const snapshotId = `snap-${now}-${Math.random().toString(36).slice(2, 10)}`;
  const chunks = snapshotTextChunks(String(text == null ? "{}" : text), 90000);
  const insertStatements = [];
  for (let i = 0; i < chunks.length; i += 1) {
    insertStatements.push(db.prepare(`
      INSERT INTO account_event_file_snapshot_versions (account_key, snapshot_id, chunk_index, chunk_count, data_json, updated_at, active)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `).bind(key, snapshotId, i, chunks.length, chunks[i], now));
  }
  const chunkCount = chunks.length;
  try {
    if (typeof db.batch === "function") await db.batch(insertStatements);
    else { for (const stmt of insertStatements) await stmt.run(); }
    const row = await db.prepare(`SELECT COUNT(*) AS n FROM account_event_file_snapshot_versions WHERE account_key = ? AND snapshot_id = ?`).bind(key, snapshotId).first().catch(() => null);
    if (Number(row && row.n || 0) !== chunkCount) throw new Error("Staged account snapshot chunk count mismatch.");
    const activate = [
      db.prepare(`UPDATE account_event_file_snapshot_versions SET active = 0 WHERE account_key = ? AND active = 1`).bind(key),
      db.prepare(`UPDATE account_event_file_snapshot_versions SET active = 1 WHERE account_key = ? AND snapshot_id = ?`).bind(key, snapshotId),
      // STORAGE: delete only INACTIVE snapshots older than a SHORT grace window.
      // The 458MB blow-up came from 7-DAY retention; a 10-minute window keeps the
      // table at a few MB yet does NOT delete the snapshot a client is mid-download
      // of (deleting it instantly caused "Cloud account file changed while
      // downloading"). The active snapshot is always kept.
      db.prepare(`DELETE FROM account_event_file_snapshot_versions WHERE account_key = ? AND active = 0 AND snapshot_id != ? AND updated_at < ?`).bind(key, snapshotId, now - 10 * 60 * 1000)
    ];
    if (typeof db.batch === "function") await db.batch(activate);
    else { for (const stmt of activate) await stmt.run(); }
    return { snapshotId, chunkCount, updatedAt: now };
  } catch (err) {
    await db.prepare(`DELETE FROM account_event_file_snapshot_versions WHERE account_key = ? AND snapshot_id = ?`).bind(key, snapshotId).run().catch(() => {});
    throw err;
  }
}

async function writeAccountEventFileSnapshot(db, accountKey, file, opts) {
  const key = identityNameKey(accountKey || "");
  const options = opts && typeof opts === "object" ? opts : {};
  // MEMORY-CRITICAL: large account files (multi-MB / tens of thousands of
  // events) are common.  The previous implementation re-read the active
  // snapshot, re-merged, JSON.stringified, re-read AGAIN and computed TWO
  // fingerprints inside a 4x retry loop, holding 6+ copies of the full parsed
  // file alive simultaneously.  For a ~4MB file that blows past the Worker's
  // 128MB memory limit and Cloudflare returns 503 — which made every upload for
  // a big account fail.  Callers (handlePostAccountEventFile /
  // appendAccountEventFileEvents) already merge the incoming file with the
  // active snapshot before calling this, so the input is the authoritative
  // union.  We therefore stage + atomically activate it in a SINGLE pass with at
  // most one parsed copy in flight.  Concurrent writes from a second device are
  // rare and self-heal on the next sync (the client always re-downloads and
  // re-merges in the verify step), so the heavy re-merge loop is not worth a
  // hard memory ceiling that makes sync impossible.
  const clean = options.preNormalised && file && typeof file === "object" ? file : normaliseAccountEventFile(file || {});
  clean.updatedAt = Date.now();
  const now = Date.now();
  const snapshotId = `snap-${now}-${Math.random().toString(36).slice(2, 10)}`;

  let chunks = snapshotTextChunks(JSON.stringify(clean), 90000);
  const insertStatements = [];
  for (let i = 0; i < chunks.length; i += 1) {
    insertStatements.push(db.prepare(`
      INSERT INTO account_event_file_snapshot_versions (account_key, snapshot_id, chunk_index, chunk_count, data_json, updated_at, active)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `).bind(key, snapshotId, i, chunks.length, chunks[i], now));
  }
  const chunkCount = chunks.length;
  chunks = null; // release the chunk array before the heavier stat/fingerprint passes
  try {
    if (typeof db.batch === "function") await db.batch(insertStatements);
    else { for (const stmt of insertStatements) await stmt.run(); }
    const row = await db.prepare(`
      SELECT COUNT(*) AS n
      FROM account_event_file_snapshot_versions
      WHERE account_key = ? AND snapshot_id = ?
    `).bind(key, snapshotId).first().catch(() => null);
    if (Number(row && row.n || 0) !== chunkCount) throw new Error("Staged account snapshot chunk count mismatch.");

    const activate = [
      db.prepare(`UPDATE account_event_file_snapshot_versions SET active = 0 WHERE account_key = ? AND active = 1`).bind(key),
      db.prepare(`UPDATE account_event_file_snapshot_versions SET active = 1 WHERE account_key = ? AND snapshot_id = ?`).bind(key, snapshotId),
      // STORAGE: delete only INACTIVE snapshots older than a SHORT grace window.
      // The 458MB blow-up came from 7-DAY retention; a 10-minute window keeps the
      // table at a few MB yet does NOT delete the snapshot a client is mid-download
      // of (deleting it instantly caused "Cloud account file changed while
      // downloading"). The active snapshot is always kept.
      db.prepare(`DELETE FROM account_event_file_snapshot_versions WHERE account_key = ? AND active = 0 AND snapshot_id != ? AND updated_at < ?`).bind(key, snapshotId, now - 10 * 60 * 1000)
    ];
    if (typeof db.batch === "function") await db.batch(activate);
    else { for (const stmt of activate) await stmt.run(); }
    // `clean` is already normalised, so compute stats/fingerprint without another
    // full normalise pass (each normalise deep-clones every event's details).
    const stats = accountEventFileDerivedStats(clean, { normalised: true });
    const fingerprint = accountEventFileFingerprint(clean, { normalised: true });
    await writeAccountEventFileStoredMeta(db, key, { snapshotId, chunkCount, expectedChunkCount: chunkCount, stats, fingerprint, eventCount: fingerprint.eventCount || 0, updatedAt: now, versioned: true, incomplete: false });
    return { file: clean, updatedAt: now, chunkCount, stats, fingerprint, snapshotId, versioned: true };
  } catch (err) {
    await db.prepare(`DELETE FROM account_event_file_snapshot_versions WHERE account_key = ? AND snapshot_id = ?`).bind(key, snapshotId).run().catch(() => {});
    throw err;
  }
}


async function readAccountEventFileStoredMeta(db, accountKey) {
  const key = identityNameKey(accountKey || "");
  if (!key) return null;
  const row = await db.prepare(`
    SELECT snapshot_id, chunk_count, expected_chunk_count, stats_json, fingerprint_json, event_count, updated_at, versioned, incomplete
    FROM account_event_file_snapshot_meta
    WHERE account_key = ?
    LIMIT 1
  `).bind(key).first().catch(() => null);
  if (!row) return null;
  let stats = null;
  let fingerprint = null;
  try { stats = JSON.parse(String(row.stats_json || "{}")); } catch (_) { stats = null; }
  try { fingerprint = JSON.parse(String(row.fingerprint_json || "{}")); } catch (_) { fingerprint = null; }
  return {
    snapshotId: String(row.snapshot_id || ""),
    chunkCount: Math.max(0, Number(row.chunk_count || 0) || 0),
    expectedChunkCount: Math.max(0, Number(row.expected_chunk_count || row.chunk_count || 0) || 0),
    stats: stats && typeof stats === "object" ? stats : null,
    fingerprint: fingerprint && typeof fingerprint === "object" ? fingerprint : null,
    eventCount: Math.max(0, Number(row.event_count || fingerprint && fingerprint.eventCount || stats && stats.stores && stats.stores.eventLog || 0) || 0),
    updatedAt: Math.max(0, Number(row.updated_at || 0) || 0),
    versioned: Number(row.versioned || 0) === 1,
    incomplete: Number(row.incomplete || 0) === 1
  };
}

async function writeAccountEventFileStoredMeta(db, accountKey, meta) {
  const key = identityNameKey(accountKey || "");
  const m = meta && typeof meta === "object" ? meta : {};
  if (!key) return null;
  const stats = m.stats && typeof m.stats === "object" ? m.stats : { total: 0, stores: {} };
  const fingerprint = m.fingerprint && typeof m.fingerprint === "object" ? m.fingerprint : { algorithm: "fnv1a-event-ledger-v1", eventCount: Math.max(0, Number(stats && stats.stores && stats.stores.eventLog || 0)), hash: "" };
  const eventCount = Math.max(0, Number(m.eventCount || fingerprint.eventCount || stats && stats.stores && stats.stores.eventLog || 0) || 0);
  await db.prepare(`
    INSERT INTO account_event_file_snapshot_meta (account_key, snapshot_id, chunk_count, expected_chunk_count, stats_json, fingerprint_json, event_count, updated_at, versioned, incomplete)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_key) DO UPDATE SET
      snapshot_id = excluded.snapshot_id,
      chunk_count = excluded.chunk_count,
      expected_chunk_count = excluded.expected_chunk_count,
      stats_json = excluded.stats_json,
      fingerprint_json = excluded.fingerprint_json,
      event_count = excluded.event_count,
      updated_at = excluded.updated_at,
      versioned = excluded.versioned,
      incomplete = excluded.incomplete
  `).bind(
    key,
    String(m.snapshotId || m.snapshot_id || ""),
    Math.max(0, Number(m.chunkCount || m.chunk_count || 0) || 0),
    Math.max(0, Number(m.expectedChunkCount || m.expected_chunk_count || m.chunkCount || m.chunk_count || 0) || 0),
    JSON.stringify(stats).slice(0, 8000),
    JSON.stringify(fingerprint).slice(0, 2000),
    eventCount,
    Math.max(0, Number(m.updatedAt || m.updated_at || Date.now()) || Date.now()),
    m.versioned ? 1 : 0,
    m.incomplete ? 1 : 0
  ).run().catch(() => null);
  return { stats, fingerprint, eventCount };
}

async function readAccountEventFileSnapshotMeta(db, accountKey) {
  const key = identityNameKey(accountKey || "");
  if (!key) return { chunkCount: 0, expectedChunkCount: 0, updatedAt: 0, versioned: false, empty: true };
  const stored = await readAccountEventFileStoredMeta(db, key).catch(() => null);

  const withStored = (base) => {
    const out = Object.assign({}, base || {});
    const activeSnapshotId = String(out.snapshotId || "").trim();
    const storedSnapshotId = String(stored && stored.snapshotId || "").trim();
    const snapshotMatches = !activeSnapshotId || (storedSnapshotId && storedSnapshotId === activeSnapshotId) || (!out.versioned && !storedSnapshotId);
    const timeMatches = !out.updatedAt || !stored || !stored.updatedAt || out.updatedAt === stored.updatedAt || (snapshotMatches && stored.updatedAt >= out.updatedAt);
    if (stored && snapshotMatches && timeMatches) {
      if (stored.stats) out.stats = stored.stats;
      if (stored.fingerprint) out.fingerprint = stored.fingerprint;
      if (stored.eventCount) out.eventCount = stored.eventCount;
      out.storedMeta = true;
    }
    return out;
  };

  // Pin to the single canonical active snapshot (repairs duplicate-active rows) so
  // the reported snapshotId / chunkCount / event count are stable across reads.
  const chosenMeta = await resolveActiveAccountSnapshot(db, key);
  if (chosenMeta) {
    const versionRows = await db.prepare(`
      SELECT chunk_index, chunk_count, updated_at
      FROM account_event_file_snapshot_versions
      WHERE account_key = ? AND snapshot_id = ?
      ORDER BY chunk_index ASC
    `).bind(key, chosenMeta.snapshotId).all().catch(() => null);
    const versionList = versionRows && Array.isArray(versionRows.results) ? versionRows.results : [];
    const chunkCount = Math.max(0, ...versionList.map((r) => Number(r.chunk_count || 0) || 0));
    const updatedAt = Math.max(0, ...versionList.map((r) => Number(r.updated_at || 0) || 0));
    const have = new Set(versionList.map((r) => Number(r.chunk_index || 0)));
    const complete = !!chunkCount && have.size >= chunkCount;
    return withStored({
      chunkCount: complete ? chunkCount : versionList.length,
      expectedChunkCount: chunkCount || versionList.length,
      updatedAt,
      snapshotId: chosenMeta.snapshotId,
      versioned: true,
      incomplete: !complete,
      empty: false
    });
  }

  const legacyRows = await db.prepare(`
    SELECT chunk_index, chunk_count, updated_at
    FROM account_event_file_snapshot_chunks
    WHERE account_key = ?
    ORDER BY chunk_index ASC
  `).bind(key).all().catch(() => null);
  const legacyList = legacyRows && Array.isArray(legacyRows.results) ? legacyRows.results : [];
  if (legacyList.length) {
    const chunkCount = Math.max(...legacyList.map((r) => Number(r.chunk_count || 0) || 0));
    const updatedAt = Math.max(0, ...legacyList.map((r) => Number(r.updated_at || 0) || 0));
    const have = new Set(legacyList.map((r) => Number(r.chunk_index || 0)));
    const complete = !!chunkCount && have.size >= chunkCount;
    return withStored({
      chunkCount: complete ? chunkCount : legacyList.length,
      expectedChunkCount: chunkCount || legacyList.length,
      updatedAt,
      snapshotId: "",
      versioned: false,
      incomplete: !complete,
      empty: false
    });
  }

  if (stored && (stored.stats || stored.fingerprint || stored.eventCount)) {
    return withStored({ chunkCount: stored.chunkCount || 0, expectedChunkCount: stored.expectedChunkCount || stored.chunkCount || 0, updatedAt: stored.updatedAt || 0, snapshotId: stored.snapshotId || "", versioned: !!stored.versioned, incomplete: !!stored.incomplete, empty: false });
  }
  return { chunkCount: 0, expectedChunkCount: 0, updatedAt: 0, snapshotId: "", versioned: false, incomplete: false, empty: true };
}

async function readAccountEventFileSnapshotChunkRow(db, accountKey, chunkIndex, snapshotId = "") {
  const key = identityNameKey(accountKey || "");
  const idx = Math.max(0, Math.floor(Number(chunkIndex || 0) || 0));
  const sid = String(snapshotId || "").trim();
  if (!key) return null;

  let row = null;
  if (sid) {
    row = await db.prepare(`
      SELECT chunk_index, chunk_count, data_json, updated_at, snapshot_id
      FROM account_event_file_snapshot_versions
      WHERE account_key = ? AND snapshot_id = ? AND chunk_index = ?
      LIMIT 1
    `).bind(key, sid, idx).first().catch(() => null);
    if (row) return Object.assign({}, row, { versioned: true });
  }

  // Pin to the SINGLE canonical active snapshot (and repair duplicate-active rows)
  // so a chunked download never mixes chunks from two different active snapshots.
  const chosen = await resolveActiveAccountSnapshot(db, key);
  if (chosen) {
    row = await db.prepare(`
      SELECT chunk_index, chunk_count, data_json, updated_at, snapshot_id
      FROM account_event_file_snapshot_versions
      WHERE account_key = ? AND snapshot_id = ? AND chunk_index = ?
      LIMIT 1
    `).bind(key, chosen.snapshotId, idx).first().catch(() => null);
    if (row) return Object.assign({}, row, { versioned: true });
  }

  row = await db.prepare(`
    SELECT chunk_index, chunk_count, data_json, updated_at
    FROM account_event_file_snapshot_chunks
    WHERE account_key = ? AND chunk_index = ?
    LIMIT 1
  `).bind(key, idx).first().catch(() => null);
  if (row) return Object.assign({}, row, { snapshot_id: "", versioned: false });

  return null;
}


function accountScoreBaselineFileCurrency(ev) {
  const e = ev && typeof ev === "object" ? ev : {};
  const d = e.details && typeof e.details === "object" ? e.details : {};
  const raw = d.currencyDelta != null ? d.currencyDelta : (d.eorbitsDelta != null ? d.eorbitsDelta : (d.balanceDelta != null ? d.balanceDelta : (e.value != null ? e.value : 0)));
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function accountScoreBaselineFileCanonicalCurrency(ev) {
  const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
  const raw = d.canonicalCurrencyBalance != null ? d.canonicalCurrencyBalance
    : (d.currencyBalance != null ? d.currencyBalance
    : (d.eorbits != null ? d.eorbits : null));
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// Validated, idempotent EORbits contribution (see accountFileCompactBaselineContribution
// for XP). The old code summed every baseline's currencyDelta (re-added a device's
// EORbits on every multi-device sync) and a naive max-floor honored poisoned
// absolutes. We validate each baseline against the events-computed balance and take
// the single largest VALID contribution; anything outside the plausible band is
// ignored.
function accountFileCompactBaselineCurrencyContribution(file, balanceBase) {
  const events = Array.isArray(file && file.eventLog) ? file.eventLog : [];
  const nonBaselineCount = events.filter((ev) => !isAccountScoreBaselineFileEvent(ev)).length;
  const base = Math.max(0, Number(balanceBase || 0));
  let best = 0;
  for (const ev of events) {
    if (!accountScoreBaselineFileApplies(ev, nonBaselineCount)) continue;
    const delta = Math.max(0, accountScoreBaselineFileCurrency(ev));
    const canonical = accountScoreBaselineFileCanonicalCurrency(ev);
    const canonicalContribution = (canonical > base && canonical <= base + delta + 1) ? (canonical - base) : 0;
    const deltaContribution = (delta > 0 && delta <= base + 1) ? delta : 0;
    const contribution = Math.max(canonicalContribution, deltaContribution);
    if (contribution > best) best = contribution;
  }
  return roundScore(Math.max(0, best));
}

function accountEventFileCurrencyCost(ev) {
  const e = ev && typeof ev === "object" ? ev : {};
  const d = e.details && typeof e.details === "object" ? e.details : {};
  const metric = String(e.metric || d.metric || e.type || "").trim();
  const raw = d.cost != null ? d.cost : (d.price != null ? d.price : (d.amount != null ? d.amount : (e.value != null ? e.value : 0)));
  const amount = Math.max(0, Number(raw) || 0);
  if (!amount) return 0;
  if (/^(shop_purchase|shop_gift_sent|shop_spend|eorbits_spend)$/i.test(metric)) return amount;
  return 0;
}

function accountEventFileCurrencyCredit(ev) {
  const e = ev && typeof ev === "object" ? ev : {};
  const d = e.details && typeof e.details === "object" ? e.details : {};
  const metric = String(e.metric || d.metric || e.type || "").trim();
  const raw = d.credit != null ? d.credit : (d.refund != null ? d.refund : (d.amount != null ? d.amount : (e.value != null ? e.value : 0)));
  const amount = Math.max(0, Number(raw) || 0);
  if (!amount) return 0;
  if (/^(shop_refund|eorbits_credit|currency_adjustment|shop_gift_received)$/i.test(metric)) return amount;
  return 0;
}

function accountEventFileCurrencyRepeatKey(metric, path, details, ev) {
  const m = activityMetric(metric || "");
  const d = details && typeof details === "object" ? details : {};
  const p = normalizePath(path || d.path || "");
  if (m === "ai_quiz") return aiQuizActivityStateKey(d, p, ev && (ev.ts || ev.createdAt || ev.created_at));
  if (m === "mastery") return `mastery:${p}:${d.mastery != null ? d.mastery : d.m != null ? d.m : d.level != null ? d.level : ev && ev.value != null ? ev.value : ""}`;
  if (m === "saved_page_action") return `saved:${p}:${d.action || ev && ev.action || ""}`;
  if (m === "view") return `view:${p}`;
  const groupKey = eventRepeatKey(m, p, d);
  return groupKey ? `${m}:${groupKey}` : `${m}:${p || "site"}`;
}

function accountEventFileCurrencySummary(file) {
  const f = normaliseAccountEventFile(file || {});
  const events = (f.eventLog || []).slice().sort((a, b) => Number(a && a.ts || 0) - Number(b && b.ts || 0) || String(a && a.id || "").localeCompare(String(b && b.id || "")));
  let currencyEarned = 0;
  let currencySpent = 0;
  let currencyCredited = 0;
  const seen = new Set();
  const oneTime = new Set();
  const explicitActiveDays = new Set();
  const firstActivityTsByDay = new Map();

  for (const ev of events) {
    if (!ev || isAccountScoreBaselineFileEvent(ev)) continue;
    const metric = activityMetric(ev.metric || "");
    const ts = normaliseTimestamp(ev.ts || ev.createdAt || ev.created_at || 0) || Date.now();
    const day = dayUTCFromTimestamp(ts);
    currencySpent += accountEventFileCurrencyCost(ev);
    currencyCredited += accountEventFileCurrencyCredit(ev);
    if (metric === "active_day") { explicitActiveDays.add(day); continue; }
    if (metric && USER_ACTIVITY_RULES[metric] && !/^(shop_|eorbits_|currency_)/i.test(metric)) {
      const prev = firstActivityTsByDay.get(day);
      if (!prev || ts < prev) firstActivityTsByDay.set(day, ts);
    }
  }

  const earningEvents = events.filter((ev) => {
    if (!ev || isAccountScoreBaselineFileEvent(ev)) return false;
    const metric = activityMetric(ev.metric || "");
    return !!(metric && USER_ACTIVITY_RULES[metric]);
  });
  firstActivityTsByDay.forEach((ts, day) => {
    if (explicitActiveDays.has(day)) return;
    earningEvents.push({ id: `active_day:synthetic:${day}`, metric: "active_day", type: "wiki_open", count: 1, ts, createdAt: ts, updatedAt: ts, details: { source: "cloud-currency-derived-active-day", day } });
  });
  earningEvents.sort((a, b) => Number(a && a.ts || 0) - Number(b && b.ts || 0) || String(a && a.id || "").localeCompare(String(b && b.id || "")));

  for (const ev of earningEvents) {
    const metric = activityMetric(ev.metric || "");
    const rule = metric && USER_ACTIVITY_RULES[metric];
    if (!rule) continue;
    if (rule.oneTime && oneTime.has(metric)) continue;
    const count = Math.max(0, Number(ev.count || 1) || 1);
    if (!count) continue;
    if (rule.oneTime) oneTime.add(metric);
    const details = ev.details && typeof ev.details === "object" ? ev.details : {};
    const repeat = Number(CONCEPT_REPEAT_DISCOUNTS[metric] || 1) || 1;
    let firstUnits = count;
    let repeatUnits = 0;
    if (repeat < 0.999999) {
      const key = accountEventFileCurrencyRepeatKey(metric, ev.path || "", details, ev);
      const forceRepeat = details.forceRepeat || details.force_repeat || details.repeatOnly || details.repeat_only;
      if (forceRepeat || seen.has(key)) {
        firstUnits = 0;
        repeatUnits = count;
      } else {
        firstUnits = Math.min(1, count);
        repeatUnits = Math.max(0, count - firstUnits);
      }
      seen.add(key);
    }
    currencyEarned += Math.max(0, Number(rule.xp || 0) * (firstUnits + repeatUnits * repeat));
  }

  // EORbits are events-only (see applyAccountFileCompactBaseline). The scoreState
  // snapshot is NOT used as a floor any more: it is a second additive-era poison
  // vector (it cached an inflated currencyBalance), so flooring against it brought
  // the 14400 / 5000 inflation straight back. The event ledger is authoritative.
  const computedSpent = roundScore(currencySpent);
  const computedCredited = roundScore(currencyCredited);
  const computedEarned = roundScore(currencyEarned);
  const balance = roundScore(Math.max(0, computedEarned + computedCredited - computedSpent));
  return {
    currencyEarned: computedEarned,
    currencySpent: computedSpent,
    currencyCredited: computedCredited,
    currencyBalance: balance,
    eorbits: balance
  };
}

function accountFileShopState(file) {
  const f = normaliseAccountEventFile(file || {});
  const owned = new Set();
  const equipped = {};
  const shopEvents = [];
  const events = (f.eventLog || []).slice().sort((a, b) => Number(a && a.ts || 0) - Number(b && b.ts || 0) || String(a && a.id || "").localeCompare(String(b && b.id || "")));
  for (const ev of events) {
    if (!ev || typeof ev !== "object") continue;
    const metric = String(ev.metric || ev.type || "").toLowerCase();
    const d = ev.details && typeof ev.details === "object" ? ev.details : {};
    const itemId = String(d.itemId || d.item_id || ev.itemId || "").trim();
    if (/^(shop_|eorbits_|currency_)/.test(metric)) shopEvents.push(ev);
    if (!itemId) continue;
    if (metric === "shop_purchase" || metric === "shop_gift_received") owned.add(itemId);
    if (metric === "shop_refund" || metric === "shop_revoke") owned.delete(itemId);
    if (metric === "shop_equip") {
      const slot = String(d.slot || ev.slot || "").trim();
      if (slot) equipped[slot] = itemId;
    }
  }
  Object.keys(equipped).forEach((slot) => { if (!owned.has(equipped[slot]) && equipped[slot] !== "default") delete equipped[slot]; });
  const currency = accountEventFileCurrencySummary(f);
  return {
    ownedIds: Array.from(owned.values()).sort(),
    owned: Object.fromEntries(Array.from(owned.values()).sort().map((id) => [id, true])),
    equipped,
    activeBoosts: accountFileShopBoostOptions(f, "all"),
    score: currency,
    currencyBalance: currency.currencyBalance,
    events: shopEvents.slice(-700),
    eventCount: shopEvents.length,
    updatedAt: f.updatedAt || Date.now()
  };
}

function accountEventFileHasShopItem(file, itemId) {
  const id = String(itemId || "").trim();
  if (!id) return false;
  const state = accountFileShopState(file || {});
  return !!(state.owned && state.owned[id]);
}

async function trustedAccountTotalXpForV2State(db, accountKey, file, existing) {
  const key = identityNameKey(accountKey || "");
  if (!key) return { totalXp: 0, source: "missing_account" };

  const client = await db.prepare(`
    SELECT total_score FROM account_client_ranking_total WHERE account_key = ?
  `).bind(key).first().catch(() => null);
  const clientTotal = roundScore(client && client.total_score || 0);
  if (clientTotal > 0) return { totalXp: clientTotal, source: "client_ranking_total" };

  const projection = await db.prepare(`
    SELECT total_score FROM user_ranking_projection
    WHERE account_key = ? AND total_score > 0 AND source LIKE ?
  `).bind(key, `${USER_RANKING_PROJECTION_VERSION}:%`).first().catch(() => null);
  const projectionTotal = roundScore(projection && projection.total_score || 0);
  if (projectionTotal > 0) return { totalXp: projectionTotal, source: "ranking_projection" };

  if (file) {
    const rebuilt = await updateUserRankingProjectionFromFile(db, key, file).catch(() => null);
    const rebuiltTotal = roundScore(rebuilt && rebuilt.totalScore || 0);
    if (rebuiltTotal > 0) return { totalXp: rebuiltTotal, source: "rebuilt_ranking_projection" };
  }

  const existingTotal = roundScore(existing && existing.total_xp || 0);
  return { totalXp: existingTotal > 0 ? existingTotal : 0, source: existingTotal > 0 ? "existing_xp_state_v2" : "none" };
}

async function materializeV2ShopStateFromAccountFile(db, accountKey, file) {
  const key = identityNameKey(accountKey || "");
  if (!key || !file) return null;
  await ensureV2Schema(db).catch(() => null);
  const f = normaliseAccountEventFile(file || {});
  const currency = accountEventFileCurrencySummary(f);
  const shopState = accountFileShopState(f);
  const existing = await db.prepare(`SELECT total_xp, level FROM xp_state_v2 WHERE account_key = ?`).bind(key).first().catch(() => null);
  const trustedTotal = await trustedAccountTotalXpForV2State(db, key, f, existing);
  const totalXp = roundScore(trustedTotal && trustedTotal.totalXp || 0);
  const now = Date.now();
  await db.prepare(`
    INSERT INTO xp_state_v2 (account_key, total_xp, level, currency_earned, currency_spent, currency_credited, currency_balance, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_key) DO UPDATE SET
      total_xp=CASE WHEN excluded.total_xp > 0 THEN excluded.total_xp ELSE xp_state_v2.total_xp END,
      level=CASE WHEN excluded.total_xp > 0 THEN excluded.level ELSE xp_state_v2.level END,
      currency_earned=excluded.currency_earned,
      currency_spent=excluded.currency_spent,
      currency_credited=excluded.currency_credited,
      currency_balance=excluded.currency_balance,
      updated_at=excluded.updated_at
  `).bind(
    key,
    totalXp,
    userLevel(totalXp),
    roundScore(currency.currencyEarned || 0),
    roundScore(currency.currencySpent || 0),
    roundScore(currency.currencyCredited || 0),
    roundScore(currency.currencyBalance || 0),
    now
  ).run().catch(() => null);

  await db.prepare(`DELETE FROM shop_v2 WHERE account_key = ?`).bind(key).run().catch(() => null);
  const ownedIds = Array.isArray(shopState.ownedIds) ? shopState.ownedIds : Object.keys(shopState.owned || {});
  const equipped = shopState.equipped && typeof shopState.equipped === "object" ? shopState.equipped : {};
  const slotByItem = {};
  Object.keys(equipped).forEach((slot) => {
    const itemId = String(equipped[slot] || "");
    if (itemId && itemId !== "default") slotByItem[itemId] = slot;
  });
  const rows = Array.from(new Set(ownedIds.concat(Object.keys(slotByItem)))).filter(Boolean).slice(0, 500);
  if (rows.length) {
    const batch = rows.map((itemId) => db.prepare(`
      INSERT INTO shop_v2 (account_key, item_id, owned, equipped_slot, acquired_at)
      VALUES (?, ?, 1, ?, ?)
      ON CONFLICT(account_key, item_id) DO UPDATE SET
        owned=1,
        equipped_slot=excluded.equipped_slot,
        acquired_at=CASE WHEN shop_v2.acquired_at > 0 THEN shop_v2.acquired_at ELSE excluded.acquired_at END
    `).bind(key, itemId, slotByItem[itemId] || "", now));
    try { await db.batch(batch); } catch (_) {
      for (const stmt of batch) { try { await stmt.run(); } catch (__) {} }
    }
  }
  return { ok: true, accountKey: key, score: currency, shopState, totalXp, totalXpSource: trustedTotal && trustedTotal.source || "", updatedAt: now };
}

function cleanClientAccountEvents(input, accountKey, limit = 100) {
  const key = identityNameKey(accountKey || "");
  const rows = (Array.isArray(input) ? input : [input]).filter((x) => x && typeof x === "object").slice(0, Math.max(1, Math.min(200, Number(limit || 100))));
  const file = normaliseAccountEventFile({ eventLog: rows.map((ev) => Object.assign({}, ev, { accountKey: key })) });
  return (file.eventLog || []).map((ev) => Object.assign({}, ev, { accountKey: key }));
}

async function handleAppendAccountEvent(req, env, ctx) {
  let body = {};
  try { body = await req.json(); } catch (_) { body = {}; }
  const acc = await resolveAccount(env.DB, body.visitorId || body.visitor_id || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const requested = identityNameKey(body.accountKey || body.account_key || "");
  if (requested && requested !== acc.accountKey) return json({ ok: false, error: "Account mismatch." }, 403, req, env);
  const events = cleanClientAccountEvents(body.events || body.event || [], acc.accountKey, 200);
  const materialize = body.materialize === true || String(body.materialize || "").toLowerCase() === "true" || String(body.materialize || "") === "1";
  if (!events.length && !materialize) return json({ ok: false, error: "No events to append." }, 400, req, env);

  // DIFF-APPEND UPLOAD finalizer. A device on a flaky network cannot reliably
  // re-upload the whole multi-MB merged file, so it instead stages only the few
  // events the cloud is missing (cheap fast-append batches) and then calls this
  // materialize step ONCE. We fold the entire staged append-log into the active
  // snapshot synchronously here, server-side, so the client's verify step sees the
  // complete cloud file. The single heavy snapshot write happens on the Worker, not
  // over the client's connection.
  if (materialize) {
    if (events.length) await appendAccountEventFileEventsFast(env.DB, acc.accountKey, events).catch(() => null);
    const result = await materializeAccountEventAppendLog(env.DB, acc.accountKey).catch((err) => ({ ok: false, error: String(err && err.message || err) }));
    const snap = await readOrSeedAccountEventFileSnapshot(env.DB, acc.accountKey).catch(() => null);
    const file = snap && snap.file ? snap.file : null;
    // Refresh the leaderboard / day-board projection now that the snapshot is whole
    // (the per-batch projection was skipped via deferMaterialize). Without this, a
    // diff-append sync would update the cloud file but leave the rankings stale.
    if (file) { try { await updateUserRankingProjectionFromFile(env.DB, acc.accountKey, file); } catch (_) {} }
    if (file) { try { await materializeV2ShopStateFromAccountFile(env.DB, acc.accountKey, file); } catch (_) {} }
    // Pin the leaderboard "Total XP" here too. The full-file upload sets it, but the
    // diff-append/materialize path (and a converged sync that skips upload) did not, so
    // the board froze at the last full-upload value while the panel moved on.
    { const crt = Number(body.clientRankingTotal != null ? body.clientRankingTotal : body.client_ranking_total); if (Number.isFinite(crt) && crt >= 0) await writeClientRankingTotal(env.DB, acc.accountKey, crt).catch(() => {}); }
    return json({
      ok: true, accountKey: acc.accountKey, materialized: !!(result && result.ok !== false),
      accepted: events.length, acceptedIds: events.map((ev) => ev.id),
      stats: (result && result.stats) || (file ? accountEventFileDerivedStats(file) : { total: 0, stores: {} }),
      fingerprint: file ? accountEventFileFingerprint(file) : null,
      updatedAt: (result && result.updatedAt) || (snap && snap.updatedAt) || Date.now(),
      shopState: file ? accountFileShopState(file) : null,
      score: file ? accountEventFileCurrencySummary(file) : null
    }, 200, req, env);
  }
  const fastAppend = body.fastAppend === true || body.deferSnapshot === true || body.appendOnly === true || String(body.fastAppend || body.deferSnapshot || body.appendOnly || "").toLowerCase() === "true" || String(body.fastAppend || body.deferSnapshot || body.appendOnly || "") === "1";
  // The diff-append sync stages MANY batches and then materializes once. It sets
  // deferMaterialize so each batch is a pure cheap insert. The old code kicked off a
  // full ~1MB merge+project+materialize on EVERY batch (ctx.waitUntil); 30 of those
  // hammered D1 and made each subsequent batch time out (~32s) → sync stuck at the
  // diff. With deferMaterialize the per-batch request stays tiny and fast.
  const deferMaterialize = body.deferMaterialize === true || String(body.deferMaterialize || "").toLowerCase() === "true" || String(body.deferMaterialize || "") === "1";
  if (fastAppend) {
    const appended = await appendAccountEventFileEventsFast(env.DB, acc.accountKey, events);
    const canWaitUntil = !!(ctx && typeof ctx.waitUntil === "function");
    if (!deferMaterialize) {
      const projectionTask = projectAccountEventFileToCanonical(env.DB, acc.accountKey, { eventLog: events }).catch((err) => ({ ok: false, error: String(err && err.message || err) }));
      const materializeTask = materializeAccountEventAppendLog(env.DB, acc.accountKey, { wait: false }).catch((err) => ({ ok: false, error: String(err && err.message || err) }));
      if (canWaitUntil) {
        ctx.waitUntil(projectionTask);
        ctx.waitUntil(materializeTask);
      } else {
        await projectionTask.catch(() => null);
        materializeTask.catch(() => null);
      }
    }
    return json({ ok: true, accountKey: acc.accountKey, accepted: events.length, acceptedIds: events.map((ev) => ev.id), appendOnly: true, snapshotDeferred: true, materializeDeferred: canWaitUntil && !deferMaterialize, stats: { total: events.length, stores: { eventLog: events.length } }, updatedAt: appended.updatedAt }, 200, req, env);
  }
  const patch = await appendAccountEventFileEvents(env.DB, acc.accountKey, events);
  const snap = await readOrSeedAccountEventFileSnapshot(env.DB, acc.accountKey).catch(() => null);
  const file = snap && snap.file ? snap.file : null;
  if (file) { try { await materializeV2ShopStateFromAccountFile(env.DB, acc.accountKey, file); } catch (_) {} }
  const shopState = file ? accountFileShopState(file) : null;
  const currency = file ? accountEventFileCurrencySummary(file) : null;
  return json({ ok: true, accountKey: acc.accountKey, accepted: events.length, acceptedIds: events.map((ev) => ev.id), stats: patch.stats, updatedAt: patch.updatedAt, projected: patch.projected, shopState, score: currency }, 200, req, env);
}

async function handleGetAccountShopState(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const latest = await readAccountEventFileSnapshotWithAppendLog(env.DB, acc.accountKey);
  const materialized = await materializeV2ShopStateFromAccountFile(env.DB, acc.accountKey, latest.file).catch(() => null);
  return json({ ok: true, accountKey: acc.accountKey, shopState: accountFileShopState(latest.file), score: materialized && materialized.score || accountEventFileCurrencySummary(latest.file), v2ShopStateMaterialized: !!(materialized && materialized.ok), stats: accountEventFileDerivedStats(latest.file), updatedAt: latest.updatedAt || 0, snapshotId: latest.snapshotId || "", pendingAppendEvents: latest.pendingAppendEvents || 0 }, 200, req, env);
}

async function readAccountEventFileSnapshotWithAppendLog(db, accountKey) {
  const snap = await readOrSeedAccountEventFileSnapshot(db, accountKey);
  const pending = await readAccountEventFileAppendEvents(db, accountKey, 1000).catch(() => []);
  const file = pending.length ? mergeAccountEventFiles(snap.file, { eventLog: pending }) : snap.file;
  const pendingUpdatedAt = pending.reduce((mx, ev) => Math.max(mx, normaliseTimestamp(ev && (ev.updatedAt || ev.updated_at || ev.ts || ev.createdAt || ev.created_at) || 0) || 0), 0);
  return {
    file,
    snapshotId: snap.snapshotId || "",
    snapshotUpdatedAt: snap.updatedAt || 0,
    updatedAt: Math.max(Number(snap.updatedAt || 0) || 0, pendingUpdatedAt),
    pendingAppendEvents: pending.length
  };
}

async function readCloudShopPurchaseState(db, accountKey, itemId) {
  const key = identityNameKey(accountKey || "");
  const id = String(itemId || "").trim();
  if (!key) return { ok: false, error: "missing_account", source: "missing_account" };
  await ensureV2Schema(db).catch(() => null);
  const row = await db.prepare(`SELECT total_xp, level, currency_earned, currency_spent, currency_credited, currency_balance, updated_at FROM xp_state_v2 WHERE account_key = ?`).bind(key).first().catch(() => null);
  if (row && Number(row.updated_at || 0) > 0) {
    const ownedRow = id ? await db.prepare(`SELECT owned FROM shop_v2 WHERE account_key = ? AND item_id = ?`).bind(key, id).first().catch(() => null) : null;
    const currency = {
      currencyEarned: roundScore(row.currency_earned || 0),
      currencySpent: roundScore(row.currency_spent || 0),
      currencyCredited: roundScore(row.currency_credited || 0),
      currencyBalance: roundScore(row.currency_balance || 0),
      eorbits: roundScore(row.currency_balance || 0)
    };
    return {
      source: "xp_state_v2",
      fast: true,
      hasItem: !!(ownedRow && Number(ownedRow.owned || 0) > 0),
      currency,
      serverBalance: Number(currency.currencyBalance || 0),
      updatedAt: Number(row.updated_at || 0) || Date.now(),
      totalXp: roundScore(row.total_xp || 0),
      level: Number(row.level || userLevel(row.total_xp || 0))
    };
  }
  return {
    ok: false,
    error: "cloud_shop_state_not_ready",
    source: "xp_state_v2_missing",
    fast: true,
    hasItem: false,
    currency: { currencyBalance: 0, eorbits: 0, currencyEarned: 0, currencySpent: 0, currencyCredited: 0 },
    serverBalance: 0,
    updatedAt: 0
  };
}

async function applyShopPurchaseToV2State(db, accountKey, ev, itemId, price, consumable, beforeState) {
  const key = identityNameKey(accountKey || "");
  if (!key || !ev || !ev.id) return null;
  await ensureV2Schema(db).catch(() => null);
  const ins = await v2InsertEvents(db, key, [{
    id: ev.id,
    metric: "shop_purchase",
    ts: ev.ts || ev.createdAt || Date.now(),
    value: price,
    details: ev.details || { itemId, price, cost: price, consumable: !!consumable }
  }], { limit: 1 }).catch(() => ({ accepted: 0 }));
  const accepted = Number(ins && ins.accepted || 0) > 0;
  const now = Date.now();
  const existing = await db.prepare(`SELECT * FROM xp_state_v2 WHERE account_key = ?`).bind(key).first().catch(() => null);
  const beforeBalance = Number(beforeState && beforeState.serverBalance != null ? beforeState.serverBalance : existing && existing.currency_balance || 0) || 0;
  const beforeSpent = Number(existing && existing.currency_spent || beforeState && beforeState.currency && beforeState.currency.currencySpent || 0) || 0;
  const beforeEarned = Number(existing && existing.currency_earned || beforeState && beforeState.currency && beforeState.currency.currencyEarned || 0) || 0;
  const beforeCredited = Number(existing && existing.currency_credited || beforeState && beforeState.currency && beforeState.currency.currencyCredited || 0) || 0;
  const totalXp = Number(existing && existing.total_xp || beforeState && beforeState.totalXp || 0) || 0;
  const nextSpent = roundScore(beforeSpent + (accepted ? price : 0));
  const nextBalance = roundScore(Math.max(0, beforeBalance - (accepted ? price : 0)));
  await db.prepare(`
    INSERT INTO xp_state_v2 (account_key, total_xp, level, currency_earned, currency_spent, currency_credited, currency_balance, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_key) DO UPDATE SET
      total_xp=excluded.total_xp,
      level=excluded.level,
      currency_earned=excluded.currency_earned,
      currency_spent=excluded.currency_spent,
      currency_credited=excluded.currency_credited,
      currency_balance=excluded.currency_balance,
      updated_at=excluded.updated_at
  `).bind(key, roundScore(totalXp), userLevel(totalXp), roundScore(beforeEarned), nextSpent, roundScore(beforeCredited), nextBalance, now).run().catch(() => null);
  if (!consumable && itemId) {
    await db.prepare(`
      INSERT INTO shop_v2 (account_key, item_id, owned, equipped_slot, acquired_at)
      VALUES (?, ?, 1, '', ?)
      ON CONFLICT(account_key, item_id) DO UPDATE SET owned=1, acquired_at=CASE WHEN shop_v2.acquired_at > 0 THEN shop_v2.acquired_at ELSE excluded.acquired_at END
    `).bind(key, String(itemId || "").slice(0, 120), now).run().catch(() => null);
  }
  return {
    accepted,
    score: {
      currencyEarned: roundScore(beforeEarned),
      currencySpent: nextSpent,
      currencyCredited: roundScore(beforeCredited),
      currencyBalance: nextBalance,
      eorbits: nextBalance
    }
  };
}

async function ensureAccountShopPurchaseLockTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS account_shop_purchase_locks (
      account_key TEXT PRIMARY KEY,
      lock_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )
  `).run();
}

async function acquireAccountShopPurchaseLock(db, accountKey) {
  const key = identityNameKey(accountKey || "");
  if (!key) return null;
  await ensureAccountShopPurchaseLockTable(db).catch(() => null);
  const now = Date.now();
  await db.prepare(`DELETE FROM account_shop_purchase_locks WHERE expires_at < ? OR created_at < ? OR expires_at > ?`).bind(now, now - 60000, now + 300000).run().catch(() => null);
  const lockId = `lock-${now}-${Math.random().toString(36).slice(2, 10)}`;
  const expiresAt = now + 45000;
  const res = await db.prepare(`
    INSERT OR IGNORE INTO account_shop_purchase_locks (account_key, lock_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).bind(key, lockId, expiresAt, now).run().catch(() => null);
  const changed = Number(res && res.meta && res.meta.changes || res && res.changes || 0);
  if (changed > 0) return { accountKey: key, lockId, expiresAt };
  return null;
}

async function acquireAccountShopPurchaseLockWithWait(db, accountKey, waitMs) {
  const deadline = Date.now() + Math.max(0, Number(waitMs || 0) || 0);
  for (;;) {
    const lock = await acquireAccountShopPurchaseLock(db, accountKey);
    if (lock) return lock;
    if (Date.now() >= deadline) return null;
    await new Promise((r) => setTimeout(r, 350));
  }
}

async function releaseAccountShopPurchaseLock(db, lock) {
  if (!lock || !lock.accountKey || !lock.lockId) return;
  await db.prepare(`DELETE FROM account_shop_purchase_locks WHERE account_key = ? AND lock_id = ?`).bind(lock.accountKey, lock.lockId).run().catch(() => null);
}

// Snapshot write lock. Shares the same per-account lock row as shop purchases so
// that materialize, shop purchase and any other snapshot write are mutually
// exclusive. This is what stops concurrent materializes (one per fast-append
// batch + the final one) from racing — each used to read the append-log, write a
// NEW active snapshot and clear the log, so the active snapshot flipped between
// writers and events were lost (the cloud count bounced 3097/4473 and the diff
// never landed).
async function ensureAccountSnapshotLockTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS account_snapshot_write_locks (
      account_key TEXT PRIMARY KEY,
      lock_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )
  `).run();
}

// Snapshot write lock uses its OWN table — it must NOT share the shop-purchase
// lock row, otherwise a sync/materialize holding the lock (60s TTL) blocks shop
// purchases ("Unlock failed"). Snapshot writes serialize among themselves; shop
// purchases serialize among themselves; the two no longer cross-block.
async function acquireAccountSnapshotLock(db, accountKey, ttlMs) {
  const key = identityNameKey(accountKey || "");
  if (!key) return null;
  await ensureAccountSnapshotLockTable(db).catch(() => null);
  const now = Date.now();
  await db.prepare(`DELETE FROM account_snapshot_write_locks WHERE expires_at < ?`).bind(now).run().catch(() => null);
  const lockId = `snap-${now}-${Math.random().toString(36).slice(2, 10)}`;
  const expiresAt = now + (Number(ttlMs) || 60000);
  const res = await db.prepare(`
    INSERT OR IGNORE INTO account_snapshot_write_locks (account_key, lock_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).bind(key, lockId, expiresAt, now).run().catch(() => null);
  const changed = Number(res && res.meta && res.meta.changes || res && res.changes || 0);
  return changed > 0 ? { accountKey: key, lockId, expiresAt } : null;
}

async function releaseAccountSnapshotLock(db, lock) {
  if (!lock || !lock.accountKey || !lock.lockId) return;
  await db.prepare(`DELETE FROM account_snapshot_write_locks WHERE account_key = ? AND lock_id = ?`).bind(lock.accountKey, lock.lockId).run().catch(() => null);
}

async function acquireAccountSnapshotLockWithWait(db, accountKey, ttlMs, waitMs) {
  const deadline = Date.now() + (Number(waitMs) || 25000);
  for (;;) {
    const lock = await acquireAccountSnapshotLock(db, accountKey, ttlMs);
    if (lock) return lock;
    if (Date.now() >= deadline) return null;
    await new Promise((r) => setTimeout(r, 400));
  }
}

async function handlePostAccountShopPurchase(req, env) {
  let body = {};
  try { body = await req.json(); } catch (_) { body = {}; }
  const acc = await resolveAccount(env.DB, body.visitorId || body.visitor_id || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const requested = identityNameKey(body.accountKey || body.account_key || "");
  if (requested && requested !== acc.accountKey) return json({ ok: false, error: "Account mismatch." }, 403, req, env);
  const itemId = String(body.itemId || body.item_id || body.productId || "").trim().slice(0, 120);
  if (!itemId) return json({ ok: false, error: "missing_item" }, 400, req, env);
  const price = Math.max(0, Number(body.price != null ? body.price : body.cost != null ? body.cost : body.amount) || 0);
  if (!Number.isFinite(price) || price < 0 || price > 100000) return json({ ok: false, error: "invalid_price" }, 400, req, env);
  const consumable = body.consumable === true || body.consumable === 1 || body.consumable === "1" || String(body.consumable || "").toLowerCase() === "true";

  const lock = await acquireAccountShopPurchaseLockWithWait(env.DB, acc.accountKey, 12000);
  if (!lock) return json({ ok: false, error: "purchase_busy", retryable: true, serverChecked: true, message: "Another purchase is still finishing. Please try again in a moment." }, 503, req, env);

  try {
    const clientBalanceRaw = Number(body.clientBalance != null ? body.clientBalance : body.client_balance);
    const clientBalance = Number.isFinite(clientBalanceRaw) && clientBalanceRaw > 0 ? Math.min(clientBalanceRaw, 1e9) : 0;
    const now = Date.now();
    const rawEvent = body.event && typeof body.event === "object" ? body.event : {};
    const eventId = String(rawEvent.id || (consumable ? `shop_purchase:${acc.accountKey}:${itemId}:${now}:${Math.random().toString(36).slice(2, 8)}` : `shop_purchase:${acc.accountKey}:${itemId}`)).slice(0, 220);
    const cleanEvents = cleanClientAccountEvents(Object.assign({}, rawEvent, {
      id: eventId,
      type: "shop_purchase",
      metric: "shop_purchase",
      ts: normaliseTimestamp(rawEvent.ts || rawEvent.createdAt || rawEvent.created_at || now) || now,
      createdAt: normaliseTimestamp(rawEvent.createdAt || rawEvent.created_at || rawEvent.ts || now) || now,
      updatedAt: now,
      value: price,
      accountKey: acc.accountKey,
      visitorId: String(body.visitorId || body.visitor_id || rawEvent.visitorId || "").slice(0, 160),
      deviceName: String(body.deviceName || body.device_name || rawEvent.deviceName || "").slice(0, 120),
      details: Object.assign({}, rawEvent.details && typeof rawEvent.details === "object" ? rawEvent.details : {}, {
        metric: "shop_purchase",
        itemId,
        cost: price,
        price,
        amount: price,
        value: price,
        basePrice: body.basePrice,
        dynamicPrice: body.dynamicPrice,
        discountPercent: body.discountPercent,
        priceMultiplier: body.priceMultiplier,
        currency: "EORbits",
        serverConfirmed: true,
        cloudConfirmed: true,
        source: rawEvent.details && rawEvent.details.source || body.source || "shop"
      })
    }), acc.accountKey, 1);
    const ev = cleanEvents[0];

    const before = await readCloudShopPurchaseState(env.DB, acc.accountKey, itemId);
    if (!before || before.ok === false) {
      return json({ ok: false, error: before && before.error || "cloud_shop_state_not_ready", serverChecked: true, retryable: true, accountKey: acc.accountKey, itemId, price, balance: 0, message: "Cloud shop balance is not materialized yet. Sync the account once, then try the purchase again.", stateSource: before && before.source || "missing" }, 409, req, env);
    }
    if (!consumable && before && before.hasItem) {
      const shopState = before.file ? accountFileShopState(before.file) : { ownedIds: [itemId], owned: { [itemId]: true }, equipped: {}, score: before.currency, currencyBalance: before.serverBalance, events: [], eventCount: 0, updatedAt: before.updatedAt || Date.now() };
      return json({ ok: true, alreadyOwned: true, serverChecked: true, accountKey: acc.accountKey, itemId, shopState, score: before.currency, updatedAt: before.updatedAt || 0, stateSource: before.source }, 200, req, env);
    }
    const currency = before && before.currency ? before.currency : { currencyBalance: 0, eorbits: 0 };
    const serverBalance = Number(before && before.serverBalance || currency && currency.currencyBalance || 0);
    if (serverBalance + 1e-9 < price) {
      return json({ ok: false, error: "insufficient_funds", serverChecked: true, accountKey: acc.accountKey, itemId, balance: serverBalance, clientBalance, price, missing: Math.max(0, price - serverBalance), score: currency, stateSource: before && before.source || "" }, 409, req, env);
    }
    await appendAccountEventFileEventsFast(env.DB, acc.accountKey, [ev]).catch(() => null);
    const v2Applied = await applyShopPurchaseToV2State(env.DB, acc.accountKey, ev, itemId, price, consumable, before).catch(() => null);
    const afterScore = v2Applied && v2Applied.score ? v2Applied.score : Object.assign({}, currency, { currencyBalance: roundScore(Math.max(0, serverBalance - price)), eorbits: roundScore(Math.max(0, serverBalance - price)) });
    const afterFile = before && before.file ? mergeAccountEventFiles(before.file, { eventLog: [ev] }) : null;
    const afterShopState = afterFile ? accountFileShopState(afterFile) : {
      ownedIds: consumable ? [] : [itemId],
      owned: consumable ? {} : { [itemId]: true },
      equipped: {},
      score: afterScore,
      currencyBalance: afterScore.currencyBalance,
      events: [ev],
      eventCount: 1,
      updatedAt: Date.now()
    };
    if (!Array.isArray(afterShopState.events) || !afterShopState.events.some((row) => row && row.id === ev.id)) afterShopState.events = [ev].concat(Array.isArray(afterShopState.events) ? afterShopState.events : []).slice(-700);
    afterShopState.score = afterScore;
    afterShopState.currencyBalance = afterScore.currencyBalance;
    return json({ ok: true, purchased: true, serverChecked: true, accountKey: acc.accountKey, itemId, price, event: ev, updatedAt: Date.now(), shopState: afterShopState, score: afterScore, stateSource: before && before.source || "", v2Accepted: !!(v2Applied && v2Applied.accepted) }, 200, req, env);
  } finally {
    await releaseAccountShopPurchaseLock(env.DB, lock);
  }
}

async function handleGetAccountEventFile(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);

  // Mobile Safari can fail a large single JSON response with the opaque error
  // "Load failed".  The frontend fetches the stored snapshot chunks one by one.
  // Important: a chunk request must be a direct D1 row read, not a full snapshot
  // read+parse.  The old implementation reconstructed the complete account file
  // for every chunk, so a 45-chunk download did 45 large reads/parses and could
  // randomly die around the middle of Step 2.
  const rawChunkIndex = url.searchParams.get("chunkIndex") ?? url.searchParams.get("chunk_index") ?? url.searchParams.get("chunk");
  if (rawChunkIndex !== null && rawChunkIndex !== "") {
    const chunkIndex = Math.max(0, Math.floor(Number(rawChunkIndex || 0) || 0));
    const requestedSnapshotId = String(url.searchParams.get("snapshotId") || url.searchParams.get("snapshot_id") || "").trim();
    let row = await readAccountEventFileSnapshotChunkRow(env.DB, acc.accountKey, chunkIndex, requestedSnapshotId);
    if (!row) {
      // First-time or legacy accounts may not have an event-file snapshot yet.
      // Seed once, then retry the direct chunk lookup.  Do not seed on every
      // chunk when the rows already exist.
      const seeded = await readOrSeedAccountEventFileSnapshot(env.DB, acc.accountKey);
      if (seeded.incomplete || seeded.parseError) {
        return json({ ok: false, accountKey: acc.accountKey, error: "Cloud account event file is incomplete. Please sync again from the PC or another device that still has the full file.", incomplete: !!seeded.incomplete, parseError: !!seeded.parseError, chunkCount: seeded.chunkCount || 0, expectedChunkCount: seeded.expectedChunkCount || seeded.chunkCount || 0 }, 409, req, env);
      }
      row = await readAccountEventFileSnapshotChunkRow(env.DB, acc.accountKey, chunkIndex, requestedSnapshotId);
    }
    if (!row) return json({ ok: false, accountKey: acc.accountKey, error: "Account event file chunk not found.", chunkIndex }, 404, req, env);
    return json({
      ok: true,
      accountKey: acc.accountKey,
      chunkIndex: Number(row.chunk_index || 0),
      chunkCount: Number(row.chunk_count || 0),
      chunk: String(row.data_json || ""),
      updatedAt: Number(row.updated_at || 0) || 0,
      byteLength: String(row.data_json || "").length,
      snapshotId: String(row.snapshot_id || ""),
      versioned: !!row.versioned
    }, 200, req, env);
  }

  const statsOnly = String(url.searchParams.get("statsOnly") || url.searchParams.get("statusOnly") || "").toLowerCase();
  const countOnly = url.searchParams.get("countOnly") === "1" || url.searchParams.get("countOnly") === "true" || url.searchParams.get("display") === "1";
  const wantsFastMeta = url.searchParams.get("meta") === "1" || url.searchParams.get("meta") === "true" || (statsOnly === "1" && (url.searchParams.get("chunked") === "1" || url.searchParams.get("chunked") === "true"));
  if (wantsFastMeta) {
    let meta = await readAccountEventFileSnapshotMeta(env.DB, acc.accountKey);
    if (!countOnly && meta.empty) {
      // Full sync/preflight paths may seed old canonical data once. Display-only
      // panel reads must stay metadata-only and must not reconstruct snapshots.
      await readOrSeedAccountEventFileSnapshot(env.DB, acc.accountKey).catch(() => null);
      meta = await readAccountEventFileSnapshotMeta(env.DB, acc.accountKey);
    }
    if (!countOnly && !meta.empty && !meta.storedMeta) {
      // Full sync/preflight paths can repair missing metadata. Display-only
      // count reads return cached metadata only, so opening the account panel is cheap.
      const snap = await readOrSeedAccountEventFileSnapshot(env.DB, acc.accountKey).catch(() => null);
      if (snap && snap.file && !snap.incomplete && !snap.parseError) {
        const statsForMeta = snap.stats || accountEventFileDerivedStats(snap.file);
        const fingerprintForMeta = snap.fingerprint || accountEventFileFingerprint(snap.file);
        await writeAccountEventFileStoredMeta(env.DB, acc.accountKey, { snapshotId: snap.snapshotId || meta.snapshotId || "", chunkCount: snap.chunkCount || meta.chunkCount || 0, expectedChunkCount: snap.expectedChunkCount || snap.chunkCount || meta.expectedChunkCount || meta.chunkCount || 0, stats: statsForMeta, fingerprint: fingerprintForMeta, eventCount: fingerprintForMeta.eventCount || 0, updatedAt: snap.updatedAt || meta.updatedAt || Date.now(), versioned: !!snap.versioned, incomplete: false });
        meta = Object.assign({}, meta, { stats: statsForMeta, fingerprint: fingerprintForMeta, eventCount: fingerprintForMeta.eventCount || 0, storedMeta: true });
      }
    }
    const stats = meta.stats && typeof meta.stats === "object" ? meta.stats : { total: 0, stores: { eventLog: Math.max(0, Number(meta.eventCount || 0) || 0) } };
    const fingerprint = meta.fingerprint && typeof meta.fingerprint === "object" ? meta.fingerprint : { algorithm: "fnv1a-event-ledger-v1", eventCount: Math.max(0, Number(meta.eventCount || stats && stats.stores && stats.stores.eventLog || 0) || 0), hash: "" };
    return json({
      ok: true,
      accountKey: acc.accountKey,
      stats,
      fingerprint,
      eventCount: fingerprint.eventCount || Math.max(0, Number(stats && stats.stores && stats.stores.eventLog || 0) || 0),
      fastMeta: true,
      chunked: true,
      storedMeta: !!meta.storedMeta,
      eventCountKnown: !!(meta.storedMeta || meta.eventCount || (meta.stats && meta.stats.stores && meta.stats.stores.eventLog)),
      metadataOnly: true,
      countOnly: !!countOnly,
      chunkCount: meta.chunkCount || 0,
      expectedChunkCount: meta.expectedChunkCount || meta.chunkCount || 0,
      updatedAt: meta.updatedAt || 0,
      incomplete: !!meta.incomplete,
      versioned: !!meta.versioned,
      snapshotId: meta.snapshotId || ""
    }, 200, req, env);
  }

  const snap = await readOrSeedAccountEventFileSnapshot(env.DB, acc.accountKey);
  const stats = snap.stats || accountEventFileDerivedStats(snap.file);
  const fingerprint = accountEventFileFingerprint(snap.file);
  const omitFile = statsOnly === "1" || statsOnly === "true" || statsOnly === "yes";
  const payload = { ok: true, accountKey: acc.accountKey, stats, fingerprint, eventCount: fingerprint.eventCount || 0, updatedAt: snap.updatedAt || 0, chunkCount: snap.chunkCount || 0, expectedChunkCount: snap.expectedChunkCount || snap.chunkCount || 0, incomplete: !!snap.incomplete, parseError: !!snap.parseError, versioned: !!snap.versioned, snapshotId: snap.snapshotId || "", seededFromCanonical: !!snap.seededFromCanonical, seedSource: snap.seedSource || "", sourceUpdatedAt: snap.sourceUpdatedAt || 0, sourceChunkCount: snap.sourceChunkCount || 0 };
  if (!omitFile) payload.file = snap.file;
  return json(payload, 200, req, env);
}

async function appendAccountEventFileEvents(db, accountKey, events) {
  const key = identityNameKey(accountKey || "");
  const list = (Array.isArray(events) ? events : [events]).filter((x) => x && typeof x === "object");
  if (!key || !list.length) return { ok: false, error: "missing_account_or_events" };
  const snap = await readOrSeedAccountEventFileSnapshot(db, key);
  const merged = mergeAccountEventFiles(snap.file, { eventLog: list });
  const written = await writeAccountEventFileSnapshot(db, key, merged, { preNormalised: true });
  await updateUserRankingProjectionFromFile(db, key, written.file).catch(() => {});
  await materializeV2ShopStateFromAccountFile(db, key, written.file).catch(() => {});
  const projected = await projectAccountEventFileToCanonical(db, key, written.file).catch((err) => ({ ok: false, error: String(err && err.message || err) }));
  return { ok: true, stats: written.stats || accountEventFileDerivedStats(written.file), updatedAt: written.updatedAt, projected };
}

async function appendAccountEventFileEventsFast(db, accountKey, events) {
  const key = identityNameKey(accountKey || "");
  const list = (Array.isArray(events) ? events : [events]).filter((x) => x && typeof x === "object" && x.id).slice(0, 200);
  if (!key || !list.length) return { ok: false, error: "missing_account_or_events", updatedAt: Date.now() };
  const now = Date.now();
  const statements = list.map((ev) => db.prepare(`
    INSERT INTO account_event_file_append_events (account_key, event_id, data_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(account_key, event_id) DO UPDATE SET
      data_json = excluded.data_json,
      updated_at = excluded.updated_at
  `).bind(
    key,
    String(ev.id || "").slice(0, 220),
    JSON.stringify(Object.assign({}, ev, { accountKey: key })).slice(0, 120000),
    normaliseTimestamp(ev.createdAt || ev.created_at || ev.ts || now) || now,
    normaliseTimestamp(ev.updatedAt || ev.updated_at || ev.ts || now) || now
  ));
  if (typeof db.batch === "function") await db.batch(statements);
  else { for (const stmt of statements) await stmt.run(); }
  return { ok: true, appended: list.length, updatedAt: now };
}

async function readAccountEventFileAppendEvents(db, accountKey, limit = 5000) {
  const key = identityNameKey(accountKey || "");
  if (!key) return [];
  const rows = await db.prepare(`
    SELECT event_id, data_json, created_at, updated_at
    FROM account_event_file_append_events
    WHERE account_key = ?
    ORDER BY created_at ASC, event_id ASC
    LIMIT ?
  `).bind(key, Math.max(1, Math.min(50000, Number(limit || 5000) || 5000))).all().catch(() => ({ results: [] }));
  const out = [];
  for (const row of rows.results || []) {
    try {
      const ev = JSON.parse(String(row.data_json || "{}"));
      if (ev && typeof ev === "object" && ev.id) out.push(Object.assign({}, ev, { accountKey: key }));
    } catch (_) {}
  }
  return out;
}

async function clearAccountEventFileAppendEvents(db, accountKey, events) {
  const key = identityNameKey(accountKey || "");
  const ids = (Array.isArray(events) ? events : []).map((ev) => String(ev && ev.id || "")).filter(Boolean);
  if (!key || !ids.length) return;
  for (let i = 0; i < ids.length; i += 80) {
    const part = ids.slice(i, i + 80);
    const placeholders = part.map(() => "?").join(",");
    await db.prepare(`DELETE FROM account_event_file_append_events WHERE account_key = ? AND event_id IN (${placeholders})`).bind(key, ...part).run().catch(() => null);
  }
}

async function materializeAccountEventAppendLog(db, accountKey, opts) {
  const key = identityNameKey(accountKey || "");
  if (!key) return { ok: false, error: "missing_account" };
  const options = opts && typeof opts === "object" ? opts : {};
  // Serialize: only one materialize/snapshot write per account at a time.
  const lock = options.wait === false
    ? await acquireAccountSnapshotLock(db, key, 60000)
    : await acquireAccountSnapshotLockWithWait(db, key, 60000, Number(options.waitMs || 30000));
  if (!lock) {
    // Another writer holds the lock. Best-effort background callers skip; the
    // explicit finalize waits, so it normally gets the lock.
    return { ok: true, materialized: 0, locked: true, skipped: true };
  }
  try {
    // Fold in a BOUNDED batch. Writing the whole snapshot is CPU-heavy and a large
    // account (~6k+ events) can exceed the Worker CPU limit and 503 — which takes the
    // Worker down for ALL requests. Capping the events folded per call keeps each
    // snapshot write bounded; the client/finalize calls this repeatedly so the
    // append-log still drains over multiple calls.
    const allEvents = await readAccountEventFileAppendEvents(db, key, 50000);
    if (!allEvents.length) return { ok: true, materialized: 0, skipped: true };
    const FOLD_BATCH = 500;
    // Hard ceiling so a snapshot WRITE never exceeds the Worker CPU limit (a large
    // write 503s and takes the whole Worker down — writing ~4778 succeeds, ~6800 503s).
    // When the snapshot is already near the ceiling we leave the staged events in the
    // append-log (they are low-value browsing and do not change XP).
    const SAFE_SNAPSHOT_MAX = 5400;
    const snap = await readOrSeedAccountEventFileSnapshot(db, key);
    const snapCount = (snap.file && Array.isArray(snap.file.eventLog)) ? snap.file.eventLog.length : 0;
    const room = SAFE_SNAPSHOT_MAX - snapCount;
    if (room <= 0) return { ok: true, materialized: 0, skipped: true, snapshotFull: true, snapshotCount: snapCount, remaining: allEvents.length };
    const events = allEvents.slice(0, Math.min(FOLD_BATCH, room));
    const merged = mergeAccountEventFiles(snap.file, { eventLog: events });
    const written = await writeAccountEventFileSnapshot(db, key, merged);
    await materializeV2ShopStateFromAccountFile(db, key, written.file).catch(() => {});
    await clearAccountEventFileAppendEvents(db, key, events);
    return { ok: true, materialized: events.length, remaining: Math.max(0, allEvents.length - events.length), stats: written.stats || accountEventFileDerivedStats(written.file), updatedAt: written.updatedAt };
  } finally {
    await releaseAccountSnapshotLock(db, lock);
  }
}

async function projectAccountEventFileToCanonical(db, accountKey, file) {
  const key = identityNameKey(accountKey || "");
  if (!key) return { ok: false, error: "missing_account", importedEvents: 0, pageActions: 0, visits: 0, mastery: 0 };
  const f = normaliseAccountEventFile(file || {});
  const latestActions = new Map();
  const visits = new Map();
  const mastery = new Map();
  const xpRows = [];

  for (const ev of (f.eventLog || [])) {
    const path = normalizePath(ev && ev.path || "");
    const ts = normaliseTimestamp(ev && (ev.ts || ev.updatedAt || ev.updated_at || ev.createdAt || ev.created_at) || 0) || Date.now();
    const title = cleanTitle(ev && ev.title || "", path);
    const metric = activityMetric(ev && ev.metric || "");
    const type = String(ev && ev.type || "");

    if (type === "page_action_set" && path && ev.action && isConceptPath(path)) {
      const action = String(ev.action || "").trim().toLowerCase().slice(0, 80);
      const akey = `${path}::${action}`;
      const old = latestActions.get(akey);
      if (shouldReplaceAccountPageActionEvent(old, ev)) latestActions.set(akey, Object.assign({}, ev, { path, action, title, ts }));
    }

    if ((type === "page_visit" || metric === "view") && path && isConceptPath(path)) {
      const old = visits.get(path) || { path, title: title || path, count: 0, first: ts, last: 0 };
      old.title = title || old.title || path;
      old.count += Math.max(1, Number(ev.count || 1) || 1);
      old.first = Math.min(Number(old.first || ts), ts);
      old.last = Math.max(Number(old.last || 0), ts);
      visits.set(path, old);
    }

    if ((type === "mastery_set" || metric === "mastery") && path && isConceptPath(path)) {
      const d = ev.details && typeof ev.details === "object" ? ev.details : {};
      const raw = ev.value !== undefined ? ev.value : (d.m !== undefined ? d.m : (d.mastery !== undefined ? d.mastery : d.level));
      const val = Number(raw);
      const old = mastery.get(path);
      if ((!old || ts >= Number(old.ts || 0)) && [0, 1, 2, 3].includes(val)) {
        mastery.set(path, { path, title: title || path, m: val, ts, ev });
      }
    }

    const row = accountEventFileEventToXpRow(ev, key);
    if (row) xpRows.push(row);
  }

  let importedEvents = 0;
  for (const row of xpRows.slice(-ACCOUNT_JSON_ACTIVITY_EVENT_MAX)) {
    try {
      const count = Math.max(0, Number(row.count || 0));
      const score = count > 0 ? scoreForActivityMetric(row.metric, count, 0) : 0;
      const res = await db.prepare(`
        INSERT OR IGNORE INTO user_activity_events (id, account_key, metric, count, score, path, title, details_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        String(row.id || "").slice(0, 220),
        key,
        activityMetric(row.metric || ""),
        count,
        score,
        normalizePath(row.path || ""),
        cleanTitle(row.title || "", row.path || ""),
        String(row.details_json || "{}").slice(0, 30000),
        normaliseTimestamp(row.created_at || 0) || Date.now()
      ).run().catch(() => null);
      if (res && res.meta && Number(res.meta.changes || 0) > 0) importedEvents += 1;
    } catch (_) {}
  }

  let pageActions = 0;
  for (const ev of latestActions.values()) {
    try {
      const active = ev.active !== false;
      if (!active) {
        const res = await db.prepare(`DELETE FROM page_actions WHERE account_key = ? AND path = ? AND action = ?`).bind(key, ev.path, ev.action).run().catch(() => null);
        if (res && res.meta) pageActions += Number(res.meta.changes || 0);
      } else {
        const createdAt = normaliseTimestamp(ev.createdAt || ev.created_at || ev.ts || 0) || ev.ts || Date.now();
        const updatedAt = normaliseTimestamp(ev.updatedAt || ev.updated_at || ev.ts || 0) || ev.ts || Date.now();
        const res = await db.prepare(`
          INSERT INTO page_actions (account_key, path, action, title, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(account_key, path, action) DO UPDATE SET
            title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE page_actions.title END,
            updated_at = CASE WHEN excluded.updated_at >= page_actions.updated_at THEN excluded.updated_at ELSE page_actions.updated_at END
        `).bind(key, ev.path, ev.action, cleanTitle(ev.title || "", ev.path), createdAt, updatedAt).run().catch(() => null);
        if (res && res.meta) pageActions += Number(res.meta.changes || 0);
      }
    } catch (_) {}
  }

  let visitRows = 0;
  for (const v of visits.values()) {
    try {
      const res = await db.prepare(`
        INSERT INTO account_page_visits (account_key, path, title, visit_count, first_visited, last_visited)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(account_key, path) DO UPDATE SET
          title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_page_visits.title END,
          visit_count = CASE WHEN excluded.visit_count >= account_page_visits.visit_count THEN excluded.visit_count ELSE account_page_visits.visit_count END,
          first_visited = MIN(account_page_visits.first_visited, excluded.first_visited),
          last_visited = MAX(account_page_visits.last_visited, excluded.last_visited)
      `).bind(key, v.path, cleanTitle(v.title || "", v.path), Math.max(1, Number(v.count || 1) || 1), Number(v.first || v.last || Date.now()), Number(v.last || v.first || Date.now())).run().catch(() => null);
      if (res && res.meta) visitRows += Number(res.meta.changes || 0);
    } catch (_) {}
  }

  let masteryRows = 0;
  for (const m of mastery.values()) {
    try {
      const data = Object.assign({}, m.ev && m.ev.details && typeof m.ev.details === "object" ? m.ev.details : {}, { m: m.m, mastery: m.m, path: m.path, title: m.title, source: "account-event-file-projection" });
      const res = await db.prepare(`
        INSERT INTO account_mastery (account_key, path, title, data_json, m, review_count, last_reviewed, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, ?, ?)
        ON CONFLICT(account_key, path) DO UPDATE SET
          title = CASE WHEN excluded.title IS NOT NULL AND excluded.title != '' THEN excluded.title ELSE account_mastery.title END,
          data_json = excluded.data_json,
          m = excluded.m,
          review_count = CASE WHEN excluded.updated_at > account_mastery.updated_at THEN account_mastery.review_count + 1 ELSE account_mastery.review_count END,
          last_reviewed = CASE WHEN excluded.last_reviewed >= account_mastery.last_reviewed THEN excluded.last_reviewed ELSE account_mastery.last_reviewed END,
          updated_at = CASE WHEN excluded.updated_at >= account_mastery.updated_at THEN excluded.updated_at ELSE account_mastery.updated_at END
      `).bind(key, m.path, cleanTitle(m.title || "", m.path), JSON.stringify(data).slice(0, 30000), m.m, m.ts, m.ts).run().catch(() => null);
      if (res && res.meta) masteryRows += Number(res.meta.changes || 0);
    } catch (_) {}
  }

  try {
    const calc = await getAccountXpCalculation(db, key, { period: "all" });
    await syncAccountLevelRewardsFromXp(db, key, userLevel(calc.totalScore || 0));
  } catch (_) {}

  return { ok: true, importedEvents, consideredEvents: xpRows.length, pageActions, visits: visitRows, mastery: masteryRows };
}

async function handlePostAccountEventFile(req, env, ctx) {
  const url = new URL(req.url);
  const rawChunkUpload = url.searchParams.get("rawChunk") === "1" || /^text\/plain\b/i.test(req.headers.get("content-type") || "");
  let body = {};
  if (rawChunkUpload) {
    body = {
      visitorId: url.searchParams.get("visitorId") || "",
      accountKey: url.searchParams.get("accountKey") || "",
      deviceName: url.searchParams.get("deviceName") || "",
      syncId: url.searchParams.get("syncId") || url.searchParams.get("sync_id") || "",
      chunkIndex: url.searchParams.get("chunkIndex") || url.searchParams.get("chunk_index") || 0,
      chunkCount: url.searchParams.get("chunkCount") || url.searchParams.get("chunk_count") || 1,
      uploadEncoding: url.searchParams.get("uploadEncoding") || url.searchParams.get("encoding") || "",
      responseMode: url.searchParams.get("responseMode") || "",
      omitFile: url.searchParams.get("omitFile") || "",
      deferProjection: url.searchParams.get("deferProjection") || "",
      skipProjection: url.searchParams.get("skipProjection") || "",
      omitProjection: url.searchParams.get("omitProjection") || "",
      chunk: await req.text()
    };
  } else {
    body = await readJson(req, 900000);
  }
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const syncId = cleanSnapshotSyncId(body.syncId || body.sync_id || "");
  const chunkIndex = Math.max(0, Math.floor(Number(body.chunkIndex || body.chunk_index || 0) || 0));
  const chunkCount = Math.max(1, Math.min(500, Math.floor(Number(body.chunkCount || body.chunk_count || 1) || 1)));
  const uploadEncoding = String(body.uploadEncoding || body.encoding || "").trim().toLowerCase();
  const chunk = String(body.chunk || body.data || "");
  if (chunkIndex >= chunkCount) return json({ ok: false, error: "Invalid account event file chunk index." }, 400, req, env);
  if (chunk.length > 700000) return json({ ok: false, error: "Account event file chunk is too large." }, 413, req, env);
  const now = Date.now();
  await env.DB.prepare(`DELETE FROM account_event_file_upload_chunks WHERE account_key = ? AND created_at < ?`).bind(acc.accountKey, now - 30 * 60 * 1000).run().catch(() => {});
  await env.DB.prepare(`
    INSERT INTO account_event_file_upload_chunks (account_key, sync_id, chunk_index, chunk_count, data_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_key, sync_id, chunk_index) DO UPDATE SET
      chunk_count = excluded.chunk_count,
      data_json = excluded.data_json,
      created_at = excluded.created_at
  `).bind(acc.accountKey, syncId, chunkIndex, chunkCount, chunk, now).run();
  if (chunkIndex < chunkCount - 1) {
    return json({ ok: true, partial: true, received: chunkIndex + 1, chunkCount, missing: [] }, 200, req, env);
  }
  const rows = await env.DB.prepare(`SELECT chunk_index, chunk_count, data_json FROM account_event_file_upload_chunks WHERE account_key = ? AND sync_id = ? ORDER BY chunk_index ASC`).bind(acc.accountKey, syncId).all();
  const list = rows.results || [];
  const receivedIndexes = new Set(list.map((r) => Math.floor(Number(r && r.chunk_index))).filter((idx) => Number.isFinite(idx) && idx >= 0 && idx < chunkCount));
  const missingIndexes = [];
  for (let i = 0; i < chunkCount; i += 1) {
    if (!receivedIndexes.has(i)) missingIndexes.push(i);
  }
  if (missingIndexes.length) return json({ ok: true, partial: true, received: list.length, chunkCount, missing: missingIndexes.slice(0, 120) }, 200, req, env);
  let text = "";
  for (let i = 0; i < chunkCount; i += 1) {
    const row = list.find((r) => Number(r.chunk_index) === i);
    if (!row) return json({ ok: true, partial: true, received: list.length, chunkCount, missing: [i] }, 200, req, env);
    text += String(row.data_json || "");
  }
  if (uploadEncoding === "gzip-base64") {
    text = await gunzipBase64Text(text);
    if (!text) return json({ ok: false, error: "Invalid compressed account event file." }, 400, req, env);
  }
  // STORE-AND-DEFER (works for any file size): the account-file-sync client
  // uploads the FULL local+cloud union, so we store the uploaded text directly
  // as the new ACTIVE snapshot and run ALL heavy work (parse, stats, fingerprint,
  // ranking, canonical projection, shop demand) in the BACKGROUND.  The request
  // itself only does a handful of D1 writes, so it returns fast and can never
  // time out / exceed the Worker's CPU+memory limits on a big account — which was
  // the real cause of the Step 4 "Failed to fetch".
  const trimmedHead = String(text || "").slice(0, 1).trim();
  if (!text || (trimmedHead !== "{" && trimmedHead !== "[")) {
    return json({ ok: false, error: "Invalid account event file." }, 400, req, env);
  }
  const canWaitUntil = !!(ctx && typeof ctx.waitUntil === "function");
  const existingMeta = await readAccountEventFileSnapshotMeta(env.DB, acc.accountKey).catch(() => null);
  const beforeStats = (existingMeta && existingMeta.stats) || { total: 0, stores: {} };
  const deferProjection = body.deferProjection === true || body.skipProjection === true || body.omitProjection === true || String(body.deferProjection || body.skipProjection || body.omitProjection || "").toLowerCase() === "true";

  let stored;
  try {
    stored = await storeAccountEventFileSnapshotFromText(env.DB, acc.accountKey, text);
  } catch (err) {
    return json({ ok: false, error: "Could not store account event file: " + String(err && err.message || err) }, 500, req, env);
  }
  // Pin the client-reported events-only total (what the user's panel shows) as the
  // authoritative leaderboard "Total XP". Done in the FOREGROUND so it is reliable
  // even if the background heavy task is cut short on a large account.
  {
    const clientTotal = Number(body.clientRankingTotal != null ? body.clientRankingTotal : body.client_ranking_total);
    if (Number.isFinite(clientTotal) && clientTotal >= 0) {
      await writeClientRankingTotal(env.DB, acc.accountKey, clientTotal).catch(() => {});
    }
  }
  // Clear this account's staging chunks INCLUDING orphans left by earlier failed
  // attempts, so account_event_file_upload_chunks stops growing without bound.
  await env.DB.prepare(`DELETE FROM account_event_file_upload_chunks WHERE account_key = ?`).bind(acc.accountKey).run().catch(() => {});

  const heavyTask = (async () => {
    let file;
    try { file = normaliseAccountEventFile(JSON.parse(text || "{}")); } catch (_) { return; }
    const stats = accountEventFileDerivedStats(file, { normalised: true });
    const fingerprint = accountEventFileFingerprint(file, { normalised: true });
    await writeAccountEventFileStoredMeta(env.DB, acc.accountKey, { snapshotId: stored.snapshotId, chunkCount: stored.chunkCount, expectedChunkCount: stored.chunkCount, stats, fingerprint, eventCount: fingerprint.eventCount || 0, updatedAt: stored.updatedAt, versioned: true, incomplete: false }).catch(() => {});
    try { await materializeV2ShopStateFromAccountFile(env.DB, acc.accountKey, file); } catch (_) {}
    // Refresh the leaderboard / public-profile projection BEFORE the lower-value
    // shop-demand and canonical work, so on a very large account the ranking XP
    // still updates even if the background budget runs out partway through.
    try { await updateUserRankingProjectionFromFile(env.DB, acc.accountKey, file); } catch (_) {}
    try { await updateShopDemandForAccount(env.DB, acc.accountKey, file); } catch (_) {}
    if (!deferProjection) { try { await projectAccountEventFileToCanonical(env.DB, acc.accountKey, file); } catch (_) {} }
  })().catch(() => {});
  if (canWaitUntil) ctx.waitUntil(heavyTask);

  const includeFile = body.returnFile === true || body.includeFile === true || String(body.responseMode || "").toLowerCase() === "full";
  const provisionalFingerprint = (existingMeta && existingMeta.fingerprint) || { algorithm: "fnv1a-event-ledger-score-state-v2", eventCount: existingMeta && existingMeta.eventCount || 0, hash: "" };
  const response = {
    ok: true,
    partial: false,
    received: list.length,
    chunkCount,
    accountKey: acc.accountKey,
    stats: beforeStats,
    fingerprint: provisionalFingerprint,
    summary: { before: beforeStats, canonicalImported: { ok: true, deferred: true }, projectionDeferred: true, processedInBackground: true },
    canonicalImported: { ok: true, deferred: true, reason: "deferred_background_processing" },
    projectionDeferred: true,
    processedInBackground: true,
    updatedAt: stored.updatedAt,
    snapshotChunkCount: stored.chunkCount,
    snapshotId: stored.snapshotId,
    versioned: true
  };
  if (includeFile) {
    try { response.file = normaliseAccountEventFile(JSON.parse(text || "{}")); } catch (_) {}
  }
  return json(response, 200, req, env);
}

async function handleGetAccountMastery(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const rows = await env.DB.prepare(`
    SELECT path, title, data_json, m, view_count, review_count, last_reviewed, updated_at
    FROM account_mastery
    WHERE account_key = ?
    ORDER BY updated_at DESC
    LIMIT 2000
  `).bind(acc.accountKey).all();
  const quizRows = await env.DB.prepare(`
    SELECT path, title, result_id, session_json, completed_at, updated_at
    FROM account_ai_quiz_sessions
    WHERE account_key = ?
    ORDER BY completed_at DESC
    LIMIT 3000
  `).bind(acc.accountKey).all().catch(() => ({ results: [] }));
  return json({ ok: true, accountKey: acc.accountKey, mastery: (rows.results || []).map(masteryClientRow), quizSessions: (quizRows.results || []).map(aiQuizSessionClientRow) }, 200, req, env);
}

async function handleSetAccountMastery(req, env) {
  const body = await readJson(req, 4000000);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const fakeReq = new Request(req.url, { method: "POST", body: JSON.stringify({ visitorId: body.visitorId, mastery: body.mastery || body.items || body }), headers: { "Content-Type": "application/json" } });
  return handleImportLocalActivity(fakeReq, env);
}


async function handleApplyLevelUpRewards(req, env) {
  const body = await readJson(req, 4096);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);

  const key = acc.accountKey;
  const requestedLevel = Math.max(1, Math.min(10, Math.floor(Number(body.level || body.newLevel || 1))));
  const xpCalc = await getAccountXpCalculation(env.DB, key, { period: "all" });
  const progress = userLevelProgress(roundScore(xpCalc.totalScore || 0));
  const currentLevel = Math.max(1, Math.min(10, Math.floor(Number(progress.level || 1))));

  const row = await env.DB.prepare(`SELECT COALESCE(highest_level_seen,0) AS highest_level_seen, COALESCE(last_level_up_at,0) AS last_level_up_at FROM account_profile_rewards WHERE account_key = ?`).bind(key).first().catch(() => null);
  const seen = Math.max(1, Math.floor(Number(row && row.highest_level_seen || 1)));
  const lastLevelUpAt = Number(row && row.last_level_up_at || 0);
  let applied = false;

  if (currentLevel > seen) {
    applied = await applyAccountLevelUpRewards(env.DB, key, seen, currentLevel);
  } else if (currentLevel >= requestedLevel && requestedLevel > 1 && !lastLevelUpAt) {
    // One-time repair for the first avatar-frame build, which could mark a level
    // as seen without clearing the username/avatar cooldown fields.
    applied = await applyAccountLevelUpRewards(env.DB, key, Math.max(1, requestedLevel - 1), currentLevel);
  } else {
    await syncAccountLevelRewardsFromXp(env.DB, key, currentLevel);
  }

  const fresh = await env.DB.prepare(`SELECT visitor_hash, name, name_key, avatar, COALESCE(is_public,0) AS is_public, bio, updated_at, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE name_key = ?`).bind(key).first().catch(() => acc.identity);
  return json({ ok: true, applied: !!applied, level: currentLevel, profile: await identityPayload(env.DB, fresh || acc.identity, req) }, 200, req, env);
}

async function handleGetIdentityXp(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const key = acc.accountKey;
  const limit = clampInt(url.searchParams.get("limit"), 1, 500, 200);

  const activeCapBoost = await getActiveCapBoostForToday(env.DB, key);
  const xpCalc = await getAccountXpCalculation(env.DB, key, { period: "all" });
  const breakdown = (xpCalc.breakdown || []).map((r) => Object.assign({}, r, {
    updatedAt: Number(r.updatedAt || 0),
  }));

  const totalScore = roundScore(xpCalc.totalScore || 0);
  const progress = userLevelProgress(totalScore);
  await syncAccountLevelRewardsFromXp(env.DB, key, progress.level);
  const frameState = await getAccountProfileRewards(env.DB, key, progress.level);

  // Self-heal the stored ranking projection used by the rankings list
  // (/hot metric=users) and public profiles. Account-file sync now defers the
  // ranking projection to a background task that can lag or, on a very large
  // account, not finish — leaving the leaderboard/profile XP lower than this
  // (authoritative, freshly recomputed) panel. Refresh it from the same
  // calculation so they converge whenever the owner opens their XP panel.
  if (Number(xpCalc.eventFileEventCount || 0) > 0) {
    try { await updateUserRankingProjectionFromCalc(env.DB, key, xpCalc, "identity-xp panel refresh"); } catch (_) {}
  }

  const todayRow = (Array.isArray(xpCalc.dailySummary) ? xpCalc.dailySummary : []).find((d) => String(d && d.day || "") === todayUTC()) || null;
  const activeCapMultiplier = Math.max(Number(activeCapBoost.multiplier || 1) || 1, Number(todayRow && todayRow.dailyCapMultiplier || 1) || 1);
  const effectiveDailyCap = Math.max(userDailyXpCapForTotal(totalScore) * activeCapMultiplier, Number(todayRow && todayRow.dailyCap || 0) || 0);

  const events = (Array.isArray(xpCalc.events) ? xpCalc.events : []).slice(0, limit).map((ev) => ({
    metric: ev.metric,
    label: ev.label,
    description: ev.description,
    category: ev.category,
    count: ev.count,
    xpPerCount: ev.xpPerCount,
    repeatPercent: ev.repeatPercent,
    repeatApplied: !!ev.repeatApplied,
    rawScore: ev.rawScore,
    repeatAdjustedScore: ev.repeatAdjustedScore,
    scoreBeforeDailyCap: ev.scoreBeforeDailyCap,
    score: ev.score,
    path: normalizePath(ev.path || ""),
    title: cleanTitle(ev.title || "", ev.path || ""),
    details: ev.details || {},
    createdAt: Number(ev.createdAt || 0),
  }));

  return json({
    ok: true,
    accountKey: key,
    name: acc.identity ? cleanProfileName(acc.identity.name || "") : key,
    source: xpCalc.source || "Hot Worker canonical capped XP",
    consistency: xpCalc.consistency || "Canonical XP comes from user_activity_events. Repeat discounts, activity daily caps and the total daily XP cap are reapplied from the event history. The same calculation is used by Trending, public profiles, My Account and the level badge. The older totals table is used only for totals-only legacy accounts.",
    totalScore,
    totalXp: totalScore,
    score: totalScore,
    level: progress.level,
    maxLevel: progress.maxLevel,
    levelStart: progress.levelStart,
    nextLevel: progress.nextLevel,
    nextLevelStart: progress.nextLevelStart,
    intoLevel: progress.intoLevel,
    levelSpan: progress.levelSpan,
    toNext: progress.toNext,
    progressPct: progress.progressPct,
    thresholds: userLevelThresholdsForClient(),
    levelThresholds: userLevelThresholdsForClient(),
    avatarFrame: frameState.avatarFrame,
    selectedAvatarFrame: frameState.selectedFrame,
    unlockedAvatarFrames: frameState.unlockedFrames,
    highestLevelSeen: frameState.highestLevelSeen,
    lastLevelUpAt: frameState.lastLevelUpAt,
    rules: xpRulesForClient(activeCapMultiplier),
    weights: Object.assign({}, USER_ACTIVITY_WEIGHTS),
    dailyCap: effectiveDailyCap,
    baseDailyCap: userDailyXpCapForTotal(totalScore),
    activeCapBoost: Object.assign({}, activeCapBoost, { active: activeCapBoost.active || activeCapMultiplier > 1, multiplier: activeCapMultiplier }),
    rawScore: xpCalc.totalRawScore,
    scoreBeforeDailyCap: xpCalc.totalBeforeDailyCap,
    metricCapApplied: !!xpCalc.metricCapApplied,
    dailyCapApplied: !!xpCalc.dailyCapApplied,
    legacyUncapped: !!xpCalc.legacyUncapped,
    totalsReconciled: !!xpCalc.totalsReconciled,
    sourceEvents: !!xpCalc.sourceEvents,
    repeatDiscountApplied: !!xpCalc.repeatDiscountApplied,
    totalRepeatAdjustedScore: xpCalc.totalRepeatAdjustedScore,
    todayDay: todayUTC(),
    todayXp: todayRow || null,
    dailySummary: Array.isArray(xpCalc.dailySummary) ? xpCalc.dailySummary : [],
    breakdown,
    events,
    calculationVersion: "identity-xp-v7-server-canonical-single-source",
    sourceRowCount: Array.isArray(xpCalc.events) ? xpCalc.events.length : 0,
  }, 200, req, env);
}

async function accountJsonCountTable(db, sql, bindValue) {
  try {
    const row = await db.prepare(sql).bind(bindValue).first();
    return Math.max(0, Number(row && (row.n || row.count || row.c) || 0) || 0);
  } catch (_) {
    return 0;
  }
}

async function handleGetAccountActivity(req, env, url) {
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const key = acc.accountKey;
  const eventsOnly = url.searchParams.get("eventsOnly") === "1" || url.searchParams.get("events_only") === "1";
  const light = url.searchParams.get("light") === "1" || url.searchParams.get("summary") === "1";
  const compactEvents = url.searchParams.get("compact") === "1" || url.searchParams.get("compactEvents") === "1";
  const eventLimit = Math.max(50, Math.min(1000, Math.floor(Number(url.searchParams.get("limit") || 500) || 500)));
  const eventOffset = Math.max(0, Math.floor(Number(url.searchParams.get("offset") || 0) || 0));
  const useCursor = url.searchParams.get("cursor") === "1" || url.searchParams.has("cursorTs") || url.searchParams.has("cursorId");
  const cursorTs = Math.max(0, Math.floor(Number(url.searchParams.get("cursorTs") || 0) || 0));
  const cursorId = String(url.searchParams.get("cursorId") || "").trim();

  const eventTotal = await accountJsonCountTable(env.DB, `SELECT COUNT(*) AS n FROM user_activity_events WHERE account_key = ?`, key);

  if (eventsOnly) {
    let events;
    if (useCursor && cursorTs > 0) {
      events = await env.DB.prepare(`
        SELECT id, metric, count, ${userActivityScoreSqlExpr("")} AS score, path, title, details_json, created_at
        FROM user_activity_events
        WHERE account_key = ? AND (created_at < ? OR (created_at = ? AND id < ?))
        ORDER BY created_at DESC, id DESC
        LIMIT ?
      `).bind(key, cursorTs, cursorTs, cursorId, eventLimit).all().catch(() => ({ results: [] }));
    } else if (useCursor) {
      events = await env.DB.prepare(`
        SELECT id, metric, count, ${userActivityScoreSqlExpr("")} AS score, path, title, details_json, created_at
        FROM user_activity_events
        WHERE account_key = ?
        ORDER BY created_at DESC, id DESC
        LIMIT ?
      `).bind(key, eventLimit).all().catch(() => ({ results: [] }));
    } else {
      events = await env.DB.prepare(`
        SELECT id, metric, count, ${userActivityScoreSqlExpr("")} AS score, path, title, details_json, created_at
        FROM user_activity_events
        WHERE account_key = ?
        ORDER BY created_at DESC, id DESC
        LIMIT ? OFFSET ?
      `).bind(key, eventLimit, eventOffset).all().catch(() => ({ results: [] }));
    }
    const rows = events.results || [];
    const last = rows.length ? rows[rows.length - 1] : null;
    const nextCursor = last ? { ts: Number(last.created_at || 0), id: String(last.id || "") } : null;
    const done = useCursor ? rows.length < eventLimit : (eventOffset + rows.length >= eventTotal || rows.length < eventLimit);
    return json({
      ok: true,
      accountKey: key,
      eventsOnly: true,
      cursor: !!useCursor,
      eventTotal,
      limit: eventLimit,
      offset: eventOffset,
      nextOffset: eventOffset + rows.length,
      nextCursor,
      done,
      events: rows.map(r => ({
        id: r.id || "",
        metric: r.metric,
        count: Number(r.count || 0),
        score: scoreForActivityMetric(r.metric || "", Number(r.count || 0), r.score || 0),
        path: r.path || "",
        title: cleanTitle(r.title || "", r.path || "").slice(0, 96),
        details: compactEvents ? {} : parseJsonObjectSafe(r.details_json || "{}"),
        ts: Number(r.created_at || 0),
        createdAt: Number(r.created_at || 0)
      })),
    }, 200, req, env);
  }

  const visits = await env.DB.prepare(`
    SELECT v.path, COALESCE(p.title, v.title, v.path) AS title, v.visit_count, v.first_visited, v.last_visited
    FROM account_page_visits v
    LEFT JOIN pages p ON p.path = v.path
    WHERE v.account_key = ?
    ORDER BY v.last_visited DESC
    LIMIT 1000
  `).bind(key).all();
  const actions = await env.DB.prepare(`
    SELECT a.path, COALESCE(p.title, a.title, a.path) AS title, a.action, a.created_at, a.updated_at
    FROM page_actions a
    LEFT JOIN pages p ON p.path = a.path
    WHERE a.account_key = ?
    ORDER BY a.updated_at DESC
    LIMIT 1200
  `).bind(key).all();
  const comments = await env.DB.prepare(`
    SELECT c.id, c.path, c.parent_id, COALESCE(p.title, c.path) AS title, c.text, c.ts, c.edited_at, c.deleted_at
    FROM comments c
    LEFT JOIN pages p ON p.path = c.path
    WHERE c.account_key = ?
    ORDER BY c.ts DESC
    LIMIT 1000
  `).bind(key).all();
  const readiness = await env.DB.prepare(`
    SELECT r.path, COALESCE(p.title, r.title, r.path) AS title, r.readiness, r.updated_at
    FROM account_readiness r
    LEFT JOIN pages p ON p.path = r.path
    WHERE r.account_key = ?
    ORDER BY r.updated_at DESC
    LIMIT 2000
  `).bind(key).all();
  const mastery = await env.DB.prepare(`
    SELECT path, title, data_json, m, view_count, review_count, last_reviewed, updated_at
    FROM account_mastery
    WHERE account_key = ?
    ORDER BY updated_at DESC
    LIMIT 2000
  `).bind(key).all();
  const quizSessions = await env.DB.prepare(`
    SELECT path, title, result_id, session_json, completed_at, updated_at
    FROM account_ai_quiz_sessions
    WHERE account_key = ?
    ORDER BY completed_at DESC
    LIMIT 3000
  `).bind(key).all().catch(() => ({ results: [] }));

  const stats = { total: 0, stores: {} };
  stats.stores.visits = await accountJsonCountTable(env.DB, `SELECT COUNT(*) AS n FROM account_page_visits WHERE account_key = ?`, key);
  stats.stores.pageActions = await accountJsonCountTable(env.DB, `SELECT COUNT(*) AS n FROM page_actions WHERE account_key = ?`, key);
  stats.stores.comments = await accountJsonCountTable(env.DB, `SELECT COUNT(*) AS n FROM comments WHERE account_key = ?`, key);
  stats.stores.readiness = await accountJsonCountTable(env.DB, `SELECT COUNT(*) AS n FROM account_readiness WHERE account_key = ?`, key);
  stats.stores.mastery = await accountJsonCountTable(env.DB, `SELECT COUNT(*) AS n FROM account_mastery WHERE account_key = ?`, key);
  stats.stores.quizSessions = await accountJsonCountTable(env.DB, `SELECT COUNT(*) AS n FROM account_ai_quiz_sessions WHERE account_key = ?`, key);
  stats.stores.activityEvents = Math.min(ACCOUNT_JSON_ACTIVITY_EVENT_MAX, eventTotal);
  stats.total = Object.values(stats.stores).reduce((a, b) => a + Math.max(0, Number(b || 0) || 0), 0);

  const payload = {
    ok: true,
    accountKey: key,
    light: !!light,
    eventTotal: Math.min(ACCOUNT_JSON_ACTIVITY_EVENT_MAX, eventTotal),
    activityEventMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX,
    learningHistoryMax: ACCOUNT_JSON_ACTIVITY_EVENT_MAX,
    stats,
    visits: (visits.results || []).map(r => ({ path: r.path, title: r.title, ts: Number(r.last_visited || 0), visitCount: Number(r.visit_count || 0), firstVisited: Number(r.first_visited || 0), lastVisited: Number(r.last_visited || 0) })),
    actions: (actions.results || []).map(r => ({ path: r.path, title: r.title, action: r.action, ts: Number(r.updated_at || r.created_at || 0), createdAt: Number(r.created_at || 0), updatedAt: Number(r.updated_at || 0) })),
    comments: (comments.results || []).map(r => ({ id: r.id, path: r.path, parentId: r.parent_id || "", title: r.title, text: r.text || "", ts: Number(r.ts || 0), editedAt: Number(r.edited_at || 0), deletedAt: Number(r.deleted_at || 0), deleted: Number(r.deleted_at || 0) > 0, cloud: true })),
    readiness: (readiness.results || []).map(r => ({ path: r.path, title: r.title, readiness: Number(r.readiness || 0), ts: Number(r.updated_at || 0), updatedAt: Number(r.updated_at || 0) })),
    mastery: (mastery.results || []).map(masteryClientRow),
    quizSessions: (quizSessions.results || []).map(aiQuizSessionClientRow),
  };
  if (!light) {
    const events = await env.DB.prepare(`
      SELECT id, metric, count, ${userActivityScoreSqlExpr("")} AS score, path, title, details_json, created_at
      FROM user_activity_events
      WHERE account_key = ?
      ORDER BY created_at DESC
      LIMIT ${ACCOUNT_JSON_ACTIVITY_EVENT_MAX}
    `).bind(key).all().catch(() => ({ results: [] }));
    payload.events = (events.results || []).map(r => ({ id: r.id || "", metric: r.metric, count: Number(r.count || 0), score: scoreForActivityMetric(r.metric || "", Number(r.count || 0), r.score || 0), path: r.path || "", title: r.title || "", details: parseJsonObjectSafe(r.details_json || "{}"), ts: Number(r.created_at || 0), createdAt: Number(r.created_at || 0) }));
  } else {
    payload.events = [];
  }
  return json(payload, 200, req, env);
}

async function handleSetAvatarFrame(req, env) {
  const body = await readJson(req, 4096);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);

  const requested = avatarFrameId(body.frame || body.avatarFrame || body.selectedFrame || "level-1");
  const totalScore = (await getAccountXpCalculation(env.DB, acc.accountKey, { period: "all" })).totalScore || 0;
  const level = userLevel(totalScore);
  await syncAccountLevelRewardsFromXp(env.DB, acc.accountKey, level);
  const frameState = await getAccountProfileRewards(env.DB, acc.accountKey, level);
  // The picker already disables locked frames. Saving should not fail because of a
  // stale server-side level snapshot immediately after local XP changes or a
  // compact-sync refresh. Treat the requested frame as the user's selected frame
  // and raise highest_level_seen to at least that frame's level.
  const unlockedLevel = Math.max(level, Number(frameState.highestLevelSeen || level), avatarFrameLevel(requested));

  const now = Date.now();
  await env.DB.prepare(`
    INSERT INTO account_profile_rewards (account_key, selected_frame, highest_level_seen, last_level_up_at, updated_at)
    VALUES (?, ?, ?, 0, ?)
    ON CONFLICT(account_key) DO UPDATE SET
      selected_frame = excluded.selected_frame,
      highest_level_seen = CASE WHEN excluded.highest_level_seen > account_profile_rewards.highest_level_seen THEN excluded.highest_level_seen ELSE account_profile_rewards.highest_level_seen END,
      updated_at = excluded.updated_at
  `).bind(acc.accountKey, requested, unlockedLevel, now).run();

  const row = await env.DB.prepare(`SELECT name, name_key, avatar, COALESCE(is_public,0) AS is_public, bio, updated_at, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE name_key = ?`).bind(acc.accountKey).first();
  return json({ ok: true, profile: await identityPayload(env.DB, row || acc.identity, req), level, highestLevelSeen: unlockedLevel, avatarFrame: requested, unlockedAvatarFrames: avatarFramesForClient(unlockedLevel) }, 200, req, env);
}

async function handleUploadAvatar(req, env) {
  const bucket = r2Bucket(env);
  if (!bucket) {
    return json({ ok: false, error: "Avatar storage is not configured. Add an R2 binding named AVATARS to the hot Worker." }, 501, req, env);
  }

  const form = await req.formData().catch(() => null);
  if (!form) return json({ ok: false, error: "Invalid upload form." }, 400, req, env);

  const visitorId = String(form.get("visitorId") || "");
  const name = cleanProfileName(form.get("name") || "");
  const file = form.get("avatar");
  const vh = await visitorHash(visitorId || "");
  if (!vh) return json({ ok: false, error: "Missing visitor id" }, 400, req, env);

  const accForAvatar = await resolveAccount(env.DB, visitorId || "");
  let current = accForAvatar.identity ? { name: accForAvatar.identity.name, avatar: accForAvatar.identity.avatar, name_key: accForAvatar.accountKey, avatar_changed_at: Number(accForAvatar.identity.avatar_changed_at || 0) } : null;
  if (!current) {
    if (!name) return json({ ok: false, error: "Please choose and save a username before uploading an avatar." }, 400, req, env);
    const claimed = await claimIdentity(env.DB, visitorId, name, "");
    if (!claimed.ok) return json({ ok: false, error: claimed.error || "Could not save username" }, claimed.status || 400, req, env);
    current = { name: claimed.profile.name, avatar: "", name_key: claimed.accountKey || "", avatar_changed_at: 0 };
  } else if (name && name !== current.name) {
    const claimed = await claimIdentity(env.DB, visitorId, name, "", { keepAvatar: true });
    if (!claimed.ok) return json({ ok: false, error: claimed.error || "Could not save username" }, claimed.status || 400, req, env);
    current = { name: claimed.profile.name, avatar: current.avatar || "", name_key: claimed.accountKey || current.name_key || "", avatar_changed_at: Number(current.avatar_changed_at || 0) };
  }

  if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
    return json({ ok: false, error: "Please choose an image file." }, 400, req, env);
  }

  const size = Number(file.size || 0);
  const maxBytes = 1024 * 1024;
  if (!size || size > maxBytes) return json({ ok: false, error: "Avatar image must be 1 MB or smaller." }, 413, req, env);

  const type = String(file.type || "").toLowerCase();
  const extByType = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const ext = extByType[type];
  if (!ext) return json({ ok: false, error: "Avatar must be a JPG, PNG, WebP, or GIF image." }, 415, req, env);

  const now = Date.now();
  const lastAvatarChange = Number(current && current.avatar_changed_at || 0);
  if (lastAvatarChange && now < lastAvatarChange + PROFILE_CHANGE_COOLDOWN_MS) {
    return json(profileCooldownError("avatar", lastAvatarChange + PROFILE_CHANGE_COOLDOWN_MS), 429, req, env);
  }
  const key = `comment-avatars/${vh}/${now}.${ext}`;
  try {
    await bucket.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: type, cacheControl: "public, max-age=31536000, immutable" },
      customMetadata: { visitor: vh, uploadedAt: String(now) },
    });
  } catch (err) {
    return json({ ok: false, error: "Avatar storage failed. Please check the hot Worker R2 binding.", detail: String(err && err.message ? err.message : err) }, 502, req, env);
  }

  const oldKey = r2KeyFromAvatar(current && current.avatar || "");
  const finalAccountKey = (await resolveAccount(env.DB, visitorId || "")).accountKey || (current && current.name_key) || "";
  if (!finalAccountKey) {
    try { await bucket.delete(key); } catch (_) {}
    return json({ ok: false, error: "Could not attach this avatar to your account. Please refresh and sign in again." }, 409, req, env);
  }
  await env.DB.prepare(`UPDATE comment_identities SET avatar = ?, updated_at = ?, avatar_changed_at = ? WHERE name_key = ?`).bind(`r2:${key}`, now, now, finalAccountKey).run();
  if (oldKey && oldKey !== key) {
    try { await bucket.delete(oldKey); } catch (_) {}
  }

  const row = await env.DB.prepare(`SELECT name, name_key, avatar, COALESCE(is_public,0) AS is_public, bio, updated_at, COALESCE(name_changed_at,0) AS name_changed_at, COALESCE(avatar_changed_at,0) AS avatar_changed_at FROM comment_identities WHERE name_key = ?`).bind(finalAccountKey).first();
  if (!row) {
    try { await bucket.delete(key); } catch (_) {}
    return json({ ok: false, error: "Avatar uploaded, but the profile row could not be refreshed. Please try again." }, 409, req, env);
  }
  await bumpAccountActivity(env.DB, finalAccountKey, "avatar_upload", 1, { details: { hadAvatarBefore: !!oldKey, forceRepeat: !!oldKey } });
  return json({ ok: true, profile: await identityPayload(env.DB, row, req) }, 200, req, env);
}

async function handleServeAvatar(req, env, url) {
  const bucket = r2Bucket(env);
  if (!bucket) return new Response("Avatar storage is not configured", { status: 501, headers: corsHeaders(req, env) });
  let key = "";
  try { key = decodeURIComponent(url.pathname.replace(/^\/avatar\//, "")); } catch (_) { key = ""; }
  key = r2KeyFromAvatar(`r2:${key}`);
  if (!key) return new Response("Invalid avatar key", { status: 400, headers: corsHeaders(req, env) });
  const obj = await bucket.get(key);
  if (!obj) return new Response("Not found", { status: 404, headers: corsHeaders(req, env) });
  const headers = new Headers(corsHeaders(req, env));
  const contentType = (obj.httpMetadata && obj.httpMetadata.contentType) || "application/octet-stream";
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", obj.httpEtag || "");
  return new Response(obj.body, { status: 200, headers });
}

function cleanCommentAdminRow(row) {
  return {
    id: String(row.id || ""),
    path: String(row.path || ""),
    title: cleanTitle(row.title || "", row.path || ""),
    parentId: row.parent_id ? String(row.parent_id) : "",
    name: cleanName(row.name || ""),
    avatar: cleanAvatar(row.avatar || ""),
    text: cleanText(row.text || ""),
    ts: Number(row.ts || 0),
    editedAt: Number(row.edited_at || 0),
    deletedAt: Number(row.deleted_at || 0),
    deletedBy: String(row.deleted_by || ""),
    reportCount: Number(row.report_count || 0),
    reactions: {
      like: Number(row.like_count || 0),
      heart: Number(row.heart_count || 0),
      laugh: Number(row.laugh_count || 0),
    },
  };
}

function cleanCommentReportRow(row, req) {
  const reporterPublic = !!Number(row && row.reporter_is_public || 0) && !!cleanName(row && row.reporter_name || "");
  const authorPublic = !!Number(row && row.comment_author_is_public || 0) && !!cleanName(row && row.comment_author_name || "");
  return {
    id: String(row.id || ""),
    commentId: String(row.comment_id || ""),
    path: String(row.path || ""),
    title: cleanTitle(row.title || "", row.path || ""),
    reason: cleanReportReason(row.reason || ""),
    reporterName: reporterPublic ? cleanName(row.reporter_name || "") : "Anonymous",
    reporterAvatar: reporterPublic ? publicAvatarForClient(req || { url: "https://hot.eor-wiki.workers.dev" }, row.reporter_avatar || "") : "",
    reporterPublic,
    reporterAccountKey: reporterPublic ? String(row.reporter_account_key || "") : "",
    snapshotName: authorPublic ? cleanName(row.comment_author_name || row.snapshot_name || row.current_name || "") : "Anonymous",
    snapshotText: cleanText(row.snapshot_text || row.current_text || ""),
    snapshotTs: Number(row.snapshot_ts || 0),
    currentName: authorPublic ? cleanName(row.comment_author_name || row.current_name || row.snapshot_name || "") : "Anonymous",
    currentText: cleanText(row.current_text || row.snapshot_text || ""),
    commentAuthorPublic: authorPublic,
    commentAuthorAvatar: authorPublic ? publicAvatarForClient(req || { url: "https://hot.eor-wiki.workers.dev" }, row.comment_author_avatar || "") : "",
    commentDeletedAt: Number(row.comment_deleted_at || 0),
    commentEditedAt: Number(row.comment_edited_at || 0),
    createdAt: Number(row.created_at || 0),
    status: String(row.status || "open"),
    statusUpdatedAt: Number(row.status_updated_at || 0),
  };
}

function cleanCommentForClient(c, currentVisitorHash = "", req) {
  const ownerHash = String(c.visitor_hash || "");
  return {
    id: String(c.id || ""),
    path: String(c.path || ""),
    parentId: c.parent_id ? String(c.parent_id) : "",
    name: cleanName(c.name),
    avatar: publicAvatarForClient(req || { url: "https://hot.eor-wiki.workers.dev" }, c.avatar || ""),
    avatarFrame: avatarFrameId(c.avatar_frame || c.avatarFrame || "level-1"),
    profilePublic: !!Number(c.is_public || 0),
    accountKey: String(c.account_key || ""),
    anonymous: !!Number(c.is_anonymous || c.anonymous || 0),
    text: cleanText(c.text),
    ts: Number(c.ts || 0),
    editedAt: Number(c.edited_at || c.editedAt || 0),
    isOwner: !!(currentVisitorHash && ownerHash && currentVisitorHash === ownerHash),
    reactions: {
      like: Math.max(0, Number(c.like_count || 0)),
      heart: Math.max(0, Number(c.heart_count || 0)),
      laugh: Math.max(0, Number(c.laugh_count || 0)),
    },
  };
}


function cleanPageEditText(value, maxLen) {
  const s = String(value == null ? "" : value);
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function pageEditClientRow(row) {
  return {
    id: String(row && row.id || ""),
    path: normalizePath(row && row.path || ""),
    title: cleanTitle(row && row.title || "", row && row.path || ""),
    sourcePath: String(row && row.source_path || "").slice(0, 500),
    sourceUrl: String(row && row.source_url || "").slice(0, 1200),
    submitterName: cleanName(row && row.submitter_name || "Anonymous"),
    submitterAccountKey: String(row && row.submitter_account_key || "").slice(0, 180),
    originalMd: String(row && row.original_md || ""),
    proposedMd: String(row && row.proposed_md || ""),
    note: String(row && row.note || ""),
    status: String(row && row.status || "open"),
    createdAt: Number(row && row.created_at || 0),
    updatedAt: Number(row && row.updated_at || 0),
    reviewedAt: Number(row && row.reviewed_at || 0),
    reviewedBy: String(row && row.reviewed_by || ""),
  };
}


function pageEditGithubSourceInfo(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    let owner = "", repo = "", branch = "", filePath = "", rawUrl = "";
    if (/raw\.githubusercontent\.com$/i.test(u.hostname)) {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length < 4) return null;
      owner = parts[0];
      repo = parts[1];
      branch = parts[2];
      filePath = parts.slice(3).join("/");
      rawUrl = u.toString();
    } else if (/github\.com$/i.test(u.hostname)) {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length < 5) return null;
      owner = parts[0];
      repo = parts[1];
      const mode = parts[2];
      if (!["edit", "blob", "raw"].includes(mode)) return null;
      branch = parts[3];
      filePath = parts.slice(4).join("/");
      rawUrl = `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${filePath.split("/").map(encodeURIComponent).join("/")}`;
    } else {
      return null;
    }
    if (!owner || !repo || !branch || !filePath || !/\.mdx?$/i.test(filePath)) return null;
    return { owner, repo, branch, filePath, rawUrl, sourcePath: filePath };
  } catch (_) {
    return null;
  }
}

function pageEditGithubToken(env) {
  return String(
    env.GITHUB_TOKEN ||
    env.GITHUB_PAT ||
    env.GH_TOKEN ||
    env.DOCS_GITHUB_TOKEN ||
    ""
  ).trim();
}

function pageEditTruthy(value) {
  return /^(1|true|yes|on)$/i.test(String(value || "").trim());
}

function pageEditEnvSourceConfig(env) {
  // Project default:
  // public generated site: Rock-RUG/BSc-EOR-Wiki
  // private Markdown source: Rock-RUG/BSc-EOR-Wiki-dev
  // mkdocs.yml sets docs_dir: docs.
  //
  // Important: old PAGE_EDIT_SOURCE_* variables may still exist in the Worker
  // dashboard from earlier experiments.  Those stale variables are a common
  // cause of reading months-old files or the public repo instead of the private
  // source repo.  Therefore the project defaults are authoritative unless the
  // admin explicitly opts into overrides with PAGE_EDIT_ALLOW_SOURCE_OVERRIDE=1.
  const allowOverride = pageEditTruthy(env.PAGE_EDIT_ALLOW_SOURCE_OVERRIDE || env.PAGE_EDIT_ALLOW_ENV_SOURCE_OVERRIDE);
  const owner = allowOverride
    ? String(env.PAGE_EDIT_SOURCE_OWNER || env.PAGE_EDIT_GITHUB_OWNER || env.DOCS_SOURCE_OWNER || "Rock-RUG").trim()
    : "Rock-RUG";
  const repo = allowOverride
    ? String(env.PAGE_EDIT_SOURCE_REPO || env.PAGE_EDIT_GITHUB_REPO || env.DOCS_SOURCE_REPO || "BSc-EOR-Wiki-dev").trim()
    : "BSc-EOR-Wiki-dev";
  const branch = (allowOverride
    ? String(env.PAGE_EDIT_SOURCE_BRANCH || env.PAGE_EDIT_GITHUB_BRANCH || env.DOCS_SOURCE_BRANCH || "main").trim()
    : "main") || "main";
  const root = (allowOverride
    ? String(env.PAGE_EDIT_SOURCE_ROOT || env.PAGE_EDIT_SOURCE_DIR || env.DOCS_SOURCE_ROOT || "docs").trim()
    : "docs").replace(/^\/+|\/+$/g, "");
  if (!owner || !repo) return null;
  return { owner, repo, branch, root, allowOverride };
}

function pageEditCleanPagePathForSource(pagePath) {
  let rel = normalizePath(pagePath || "");
  try { rel = decodeURIComponent(rel); } catch (_) {}
  rel = String(rel || "")
    .replace(/\\/g, "/")
    .replace(/#.*$/g, "")
    .replace(/\?.*$/g, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/g, "");

  // Defensive cleanup for URLs accidentally passed as paths.
  try {
    if (/^https?:\/\//i.test(rel)) {
      const u = new URL(rel);
      rel = normalizePath(u.pathname || "").replace(/^\/+/, "").replace(/\/+$/g, "");
    }
  } catch (_) {}

  // If a deployment path or repo name was included, strip it.  The private repo
  // stores paths relative to docs/.
  const knownPrefixes = [
    "BSc-EOR-Wiki/",
    "BSc-EOR-Wiki-dev/",
    "site/",
    "docs/",
  ];
  let changed = true;
  while (changed) {
    changed = false;
    for (const prefix of knownPrefixes) {
      if (rel.toLowerCase().startsWith(prefix.toLowerCase())) {
        rel = rel.slice(prefix.length).replace(/^\/+/, "");
        changed = true;
      }
    }
  }
  return rel;
}

function pageEditUniqueList(list) {
  const out = [];
  const seen = new Set();
  for (const raw of Array.isArray(list) ? list : []) {
    const v = String(raw || "").replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/{2,}/g, "/");
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function pageEditCandidateMdPathsFromPagePath(pagePath, root) {
  const prefix = String(root || "").replace(/^\/+|\/+$/g, "");
  const rel0 = pageEditCleanPagePathForSource(pagePath);
  if (!rel0) return [];

  const candidates = [];
  const pushUnderRoot = (rel) => {
    const clean = String(rel || "").replace(/^\/+/, "").replace(/\/{2,}/g, "/");
    if (!clean) return;
    if (prefix && clean.toLowerCase().startsWith((prefix + "/").toLowerCase())) candidates.push(clean);
    else candidates.push(prefix ? `${prefix}/${clean}` : clean);
  };

  const rel = rel0.replace(/\/+$/g, "");
  if (/\.mdx?$/i.test(rel)) {
    pushUnderRoot(rel);
  } else if (/\/index\.html?$/i.test(rel)) {
    const baseDir = rel.replace(/\/index\.html?$/i, "");
    pushUnderRoot(`${baseDir}/index.md`);
    pushUnderRoot(`${baseDir}.md`);
    pushUnderRoot(`${baseDir}/index.mdx`);
    pushUnderRoot(`${baseDir}.mdx`);
  } else if (/\.html?$/i.test(rel)) {
    const base = rel.replace(/\.html?$/i, "");
    pushUnderRoot(`${base}.md`);
    pushUnderRoot(`${base}.mdx`);
    pushUnderRoot(`${base}/index.md`);
    pushUnderRoot(`${base}/index.mdx`);
  } else {
    pushUnderRoot(`${rel}.md`);
    pushUnderRoot(`${rel}.mdx`);
    pushUnderRoot(`${rel}/index.md`);
    pushUnderRoot(`${rel}/index.mdx`);
  }

  return pageEditUniqueList(candidates);
}

function pageEditMdPathFromPagePath(pagePath, root) {
  const first = pageEditCandidateMdPathsFromPagePath(pagePath, root)[0] || "";
  return first;
}

function pageEditPrivateSourceInfoFromEnv(env, pagePath) {
  const cfg = pageEditEnvSourceConfig(env);
  if (!cfg) return null;
  const candidatePaths = pageEditCandidateMdPathsFromPagePath(pagePath, cfg.root);
  if (!candidatePaths.length) return null;
  const filePath = candidatePaths[0];
  const rawUrl = `https://raw.githubusercontent.com/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/${encodeURIComponent(cfg.branch)}/${filePath.split("/").map(encodeURIComponent).join("/")}`;
  return {
    owner: cfg.owner,
    repo: cfg.repo,
    branch: cfg.branch,
    filePath,
    candidatePaths,
    rawUrl,
    sourcePath: filePath,
    privateEnv: true,
    allowOverride: !!cfg.allowOverride,
  };
}

async function pageEditFetchText(url, headers) {
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: Object.assign({
      "User-Agent": "BSc-EOR-Wiki-page-edit-source",
      "Accept": "text/plain, text/markdown, */*",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
    }, headers || {}),
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const text = await res.text().catch(() => null);
  if (typeof text !== "string") return null;
  return text.length > 1200000 ? text.slice(0, 1200000) : text;
}

function pageEditRawUrlForInfo(info, filePath) {
  return `https://raw.githubusercontent.com/${encodeURIComponent(info.owner)}/${encodeURIComponent(info.repo)}/${encodeURIComponent(info.branch)}/${String(filePath || info.filePath || "").split("/").map(encodeURIComponent).join("/")}`;
}


function pageEditGithubAuthHeader(token) {
  const t = String(token || "").trim();
  if (!t) return {};
  // Fine-grained PATs officially use Bearer. Classic PATs also work with Bearer
  // on GitHub's REST API in practice, and this keeps the code path consistent.
  return { "Authorization": `Bearer ${t}` };
}

async function pageEditGithubJson(env, apiUrl) {
  const token = pageEditGithubToken(env);
  const started = Date.now();
  const row = { url: apiUrl, status: 0, ok: false, message: "", elapsedMs: 0 };
  const res = await fetch(apiUrl, {
    method: "GET",
    cache: "no-store",
    headers: Object.assign({
      "User-Agent": "BSc-EOR-Wiki-page-edit-source",
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
    }, pageEditGithubAuthHeader(token)),
  }).catch((err) => {
    row.message = String(err && err.message ? err.message : err || "fetch failed");
    return null;
  });
  row.elapsedMs = Date.now() - started;
  if (!res) return { row, data: null };
  row.status = Number(res.status || 0);
  const data = await res.json().catch(() => null);
  row.ok = !!res.ok;
  row.message = data && data.message ? String(data.message) : (res.ok ? "OK" : `GitHub status ${res.status}`);
  return { row, data };
}

async function pageEditSourceDiagnostics(info, env, candidatePaths) {
  const token = pageEditGithubToken(env);
  const out = {
    hasToken: !!token,
    owner: info && info.owner || "",
    repo: info && info.repo || "",
    branch: info && info.branch || "",
    candidatePaths: Array.isArray(candidatePaths) ? candidatePaths.slice(0, 12) : [],
    repoCheck: null,
    branchCheck: null,
    directoryChecks: [],
    likelyCause: "",
  };
  if (!info || !info.owner || !info.repo) return out;
  const owner = encodeURIComponent(info.owner);
  const repo = encodeURIComponent(info.repo);
  const branch = encodeURIComponent(info.branch || "main");
  const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const repoRes = await pageEditGithubJson(env, repoUrl);
  out.repoCheck = repoRes.row;
  if (!token) {
    out.likelyCause = "Worker has no GITHUB_TOKEN/GITHUB_PAT secret. Private GitHub source cannot be read.";
    return out;
  }
  if (!repoRes.row.ok) {
    if (repoRes.row.status === 404) out.likelyCause = "GitHub returned 404 for the private source repository. For private repos, this usually means the token is missing access to Rock-RUG/BSc-EOR-Wiki-dev, or the fine-grained token is pending organization approval.";
    else if (repoRes.row.status === 401 || repoRes.row.status === 403) out.likelyCause = "GitHub rejected the token. Check token expiration, organization approval, and Contents: Read-only permission.";
    else out.likelyCause = `GitHub repository check failed with status ${repoRes.row.status || "unknown"}.`;
    return out;
  }
  const branchUrl = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`;
  const branchRes = await pageEditGithubJson(env, branchUrl);
  out.branchCheck = branchRes.row;
  if (!branchRes.row.ok) {
    out.likelyCause = `Repository is accessible, but branch '${info.branch || "main"}' could not be read. Check the Worker source branch setting.`;
    return out;
  }
  const dirs = [];
  for (const fp of out.candidatePaths) {
    const parts = String(fp || "").split("/").filter(Boolean);
    if (parts.length > 1) dirs.push(parts.slice(0, -1).join("/"));
  }
  const uniqueDirs = pageEditUniqueList(dirs).slice(0, 4);
  for (const dir of uniqueDirs) {
    const dirUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dir.split("/").map(encodeURIComponent).join("/")}?ref=${branch}`;
    const dirRes = await pageEditGithubJson(env, dirUrl);
    out.directoryChecks.push({ path: dir, status: dirRes.row.status, ok: dirRes.row.ok, message: dirRes.row.message });
  }
  const anyDirOk = out.directoryChecks.some((x) => x && x.ok);
  out.likelyCause = anyDirOk
    ? "Repository and parent directory are accessible, but none of the candidate Markdown filenames exists. This is a page-path to source-path mapping issue."
    : "Repository and branch are accessible, but the mapped source directory was not found. This is likely a path prefix/root mapping issue.";
  return out;
}

async function pageEditFetchGithubSourcePath(info, env, filePath, debugList) {
  const token = pageEditGithubToken(env);
  const fp = String(filePath || info.filePath || "").replace(/^\/+/, "");
  if (!fp || !/\.mdx?$/i.test(fp)) return null;

  const debugRow = {
    filePath: fp,
    triedApi: false,
    triedRaw: false,
    status: 0,
    method: "",
    ok: false,
    error: "",
  };
  const pushDebug = () => {
    try { if (Array.isArray(debugList)) debugList.push(Object.assign({}, debugRow)); } catch (_) {}
  };

  if (token) {
    const apiUrl = `https://api.github.com/repos/${encodeURIComponent(info.owner)}/${encodeURIComponent(info.repo)}/contents/${fp.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(info.branch)}`;
    debugRow.triedApi = true;

    // First ask GitHub for JSON rather than raw.  This gives clearer status
    // information and avoids browser/raw cache confusion.  Fine-grained PATs for
    // private repositories should work here as long as Contents: read is granted.
    const jsonRes = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
      headers: Object.assign({
        "User-Agent": "BSc-EOR-Wiki-page-edit-source",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
      }, pageEditGithubAuthHeader(token)),
    }).catch((err) => {
      debugRow.error = String(err && err.message ? err.message : err || "fetch failed");
      return null;
    });

    if (jsonRes) debugRow.status = Number(jsonRes.status || 0);
    if (jsonRes && jsonRes.ok) {
      const data = await jsonRes.json().catch(() => null);
      if (data && typeof data.content === "string") {
        let text = "";
        try {
          // Cloudflare Workers support atob.  GitHub base64 content contains line breaks.
          text = decodeURIComponent(escape(atob(String(data.content || "").replace(/\s+/g, ""))));
        } catch (_) {
          try { text = atob(String(data.content || "").replace(/\s+/g, "")); } catch (_) { text = ""; }
        }
        if (text) {
          debugRow.ok = true;
          debugRow.method = "github-api-json";
          pushDebug();
          return {
            text: text.slice(0, 1200000),
            method: "github-api-json",
            filePath: fp,
            sourcePath: fp,
            sha: data.sha || "",
            size: data.size || 0,
          };
        }
        debugRow.error = "GitHub JSON response did not contain decodable file content.";
      } else {
        debugRow.error = data && data.message ? String(data.message) : "GitHub JSON response did not contain file content.";
      }
    } else if (jsonRes) {
      const data = await jsonRes.json().catch(() => null);
      debugRow.error = data && data.message ? String(data.message) : `GitHub API status ${jsonRes.status}`;
    }

    // A 401/403 definitely means token/config trouble.  GitHub may also return
    // 404 for private repositories when the token has no access, so keep the
    // status in debug instead of pretending it is a browser-only issue.
    if (jsonRes && (jsonRes.status === 401 || jsonRes.status === 403)) {
      pushDebug();
      return { authError: true, status: jsonRes.status, filePath: fp, debug: debugRow };
    }

    // Fallback raw accept through the API.  Some GitHub deployments behave more
    // reliably with the raw media type than JSON+base64.
    const rawApiRes = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
      headers: Object.assign({
        "User-Agent": "BSc-EOR-Wiki-page-edit-source",
        "Accept": "application/vnd.github.raw",
        "X-GitHub-Api-Version": "2022-11-28",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
      }, pageEditGithubAuthHeader(token)),
    }).catch(() => null);
    if (rawApiRes) {
      debugRow.status = Number(rawApiRes.status || debugRow.status || 0);
      if (rawApiRes.ok) {
        const text = await rawApiRes.text().catch(() => null);
        if (typeof text === "string" && text) {
          debugRow.ok = true;
          debugRow.method = "github-api-raw";
          pushDebug();
          return {
            text: text.slice(0, 1200000),
            method: "github-api-raw",
            filePath: fp,
            sourcePath: fp,
          };
        }
      }
    }
    pushDebug();
    if (rawApiRes && (rawApiRes.status === 401 || rawApiRes.status === 403)) {
      return { authError: true, status: rawApiRes.status, filePath: fp, debug: debugRow };
    }
  } else {
    debugRow.error = "No GitHub token configured on Worker.";
  }

  // Public raw fallback only helps for public repos.  It is deliberately last,
  // and the front-end no longer silently prefers stale public raw content over a
  // failed private-source lookup.
  const rawUrl = pageEditRawUrlForInfo(info, fp);
  debugRow.triedRaw = true;
  const publicText = await pageEditFetchText(rawUrl + (rawUrl.includes("?") ? "&" : "?") + "_=" + Date.now());
  if (typeof publicText === "string") {
    debugRow.ok = true;
    debugRow.method = "github-raw-worker";
    pushDebug();
    return { text: publicText, method: "github-raw-worker", filePath: fp, sourcePath: fp };
  }
  pushDebug();
  return null;
}

async function pageEditFetchGithubSource(info, env, debugList) {
  const candidatePaths = pageEditUniqueList([
    ...(Array.isArray(info.candidatePaths) ? info.candidatePaths : []),
    info.filePath,
  ]);
  let lastAuthError = null;
  for (const fp of candidatePaths) {
    const loaded = await pageEditFetchGithubSourcePath(info, env, fp, debugList);
    if (loaded && loaded.authError) {
      lastAuthError = loaded;
      continue;
    }
    if (loaded && typeof loaded.text === "string") return loaded;
  }
  if (lastAuthError) return lastAuthError;
  return null;
}

async function handlePageEditSource(req, env, url) {
  const editUrl = String(url.searchParams.get("editUrl") || url.searchParams.get("sourceUrl") || url.searchParams.get("url") || "").trim();
  const pagePath = normalizePath(url.searchParams.get("path") || "");
  if (pagePath && !isConceptPath(pagePath)) return json({ ok: false, error: "Page edit source is only available on concept pages." }, 400, req, env);

  // Preferred setup for a public built site + private Markdown source repo:
  // configure PAGE_EDIT_SOURCE_OWNER / PAGE_EDIT_SOURCE_REPO / PAGE_EDIT_SOURCE_BRANCH
  // / PAGE_EDIT_SOURCE_ROOT on the Worker. Then the browser only sends the public
  // page path, and the private repository name/token never has to appear in page JS.
  const privateInfo = pagePath ? pageEditPrivateSourceInfoFromEnv(env, pagePath) : null;
  const linkedInfo = pageEditGithubSourceInfo(editUrl);
  const info = privateInfo || linkedInfo;
  if (!info) return json({ ok: false, error: "No Markdown source mapping was found for this page. Configure PAGE_EDIT_SOURCE_OWNER and PAGE_EDIT_SOURCE_REPO on the Worker, or expose a supported GitHub edit/source link." }, 400, req, env);

  const debug = /^(1|true|yes)$/i.test(String(url.searchParams.get("debug") || url.searchParams.get("_debug") || ""));
  const debugList = [];
  const loaded = await pageEditFetchGithubSource(info, env, debugList);
  if (!loaded || typeof loaded.text !== "string") {
    const hasToken = !!pageEditGithubToken(env);
    const envConfigured = !!privateInfo;
    const statusSet = Array.from(new Set(debugList.map((x) => Number(x && x.status) || 0).filter(Boolean)));
    const pathList = debugList.map((x) => String(x && x.filePath || "")).filter(Boolean);
    const diagnostics = await pageEditSourceDiagnostics(info, env, pathList.length ? pathList : (info.candidatePaths || []));
    const err = diagnostics && diagnostics.likelyCause
      ? diagnostics.likelyCause
      : (envConfigured
        ? (hasToken
          ? `Private source Markdown could not be read. GitHub statuses: ${statusSet.length ? statusSet.join(", ") : "none"}. This usually means the token cannot access the private repo, the branch is not up to date, or the mapped .md path does not exist.`
          : "Private source Markdown mapping is configured, but the Worker has no GitHub token. Set GITHUB_TOKEN or GITHUB_PAT.")
        : (hasToken ? "GitHub source could not be read with the configured token." : "GitHub source could not be read. If the docs repository is private, configure GITHUB_TOKEN or GITHUB_PAT on the Worker."));
    return json({
      ok: false,
      error: err,
      hasToken,
      privateSourceConfigured: !!privateInfo,
      sourceOwner: info.owner || "",
      sourceRepo: info.repo || "",
      branch: info.branch || "",
      sourceRoot: privateInfo ? pageEditEnvSourceConfig(env).root : "",
      pagePath,
      triedSourcePaths: pathList,
      githubStatuses: statusSet,
      diagnostics,
      debug: debug ? debugList : undefined,
    }, 502, req, env);
  }
  return json({
    ok: true,
    text: loaded.text,
    // Do not expose the private repo raw URL/owner/repo back to the browser when
    // env mapping is used. The user only needs the source path for admin review.
    sourceUrl: info.privateEnv ? "" : (loaded.rawUrl || info.rawUrl),
    sourcePath: loaded.sourcePath || loaded.filePath || info.sourcePath,
    owner: info.privateEnv ? "" : info.owner,
    repo: info.privateEnv ? "" : info.repo,
    branch: info.privateEnv ? "" : info.branch,
    method: info.privateEnv ? `private-source:${loaded.method}` : loaded.method,
    sha: loaded.sha || "",
    size: loaded.size || 0,
    triedSourcePaths: info.privateEnv ? (info.candidatePaths || []) : undefined,
    debug: debug ? debugList : undefined,
  }, 200, req, env);
}

async function handlePageEditSubmit(req, env) {
  const body = await readJson(req, 1800000);
  const path = normalizePath(body.path || body.conceptPath || "");
  if (!isConceptPath(path)) return json({ ok: false, error: "Page edit submissions are only available on concept pages." }, 400, req, env);
  const proposed = cleanPageEditText(body.proposedMd || body.proposed_md || body.markdown || body.md || "", 900000);
  if (!proposed.trim()) return json({ ok: false, error: "Missing proposed Markdown." }, 400, req, env);
  const original = cleanPageEditText(body.originalMd || body.original_md || "", 900000);
  const note = cleanPageEditText(body.note || body.message || body.reason || "", 4000);
  const sourcePath = cleanPageEditText(body.sourcePath || body.source_path || "", 600);
  const sourceUrl = cleanPageEditText(body.sourceUrl || body.source_url || "", 1200);
  const visitorId = body.visitorId || body.visitor_id || "";
  const submitter = await visitorHash(visitorId || `${Date.now()}-${Math.random()}`);
  let accountKey = String(body.accountKey || body.account_key || "").trim().slice(0, 180);
  if (!accountKey && visitorId) accountKey = await accountKeyForAction(env.DB, visitorId).catch(() => "");
  const name = cleanName(body.name || body.submitterName || body.submitter_name || "Anonymous").slice(0, 80) || "Anonymous";
  const now = Date.now();
  const id = crypto.randomUUID ? crypto.randomUUID() : `edit-${now}-${Math.random().toString(36).slice(2)}`;
  await env.DB.prepare(`
    INSERT INTO page_edit_submissions
      (id, path, title, source_path, source_url, submitter_hash, submitter_account_key, submitter_name, original_md, proposed_md, note, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)
  `).bind(id, path, cleanTitle(body.title || "", path), sourcePath, sourceUrl, submitter, accountKey, name, original, proposed, note, now, now).run();
  try { await bumpUserActivity(env.DB, visitorId || "", "bug_report", 1, { path, title: cleanTitle(body.title || "", path), details: { source: "page_edit_submission", submissionId: id } }); } catch (_) {}
  return json({ ok: true, submission: { id, path, status: "open", createdAt: now } }, 200, req, env);
}

async function handlePageEditAdmin(req, env, url) {
  const authBody = adminKeyBodyFromUrl(url);
  if (!isValidAdminKey(req, env, authBody)) return adminUnauthorized(req, env);
  const statusRaw = String(url.searchParams.get("status") || "open").toLowerCase();
  const status = ["open", "reviewed", "accepted", "rejected"].includes(statusRaw) ? statusRaw : "";
  const path = normalizePath(url.searchParams.get("path") || "");
  const limit = clampInt(url.searchParams.get("limit"), 1, 200, 80);
  const offset = clampInt(url.searchParams.get("offset"), 0, 100000, 0);
  const where = [];
  const binds = [];
  if (status) { where.push("status = ?"); binds.push(status); }
  if (path) { where.push("path = ?"); binds.push(path); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const totalRow = await env.DB.prepare(`SELECT COUNT(*) AS c FROM page_edit_submissions ${whereSql}`).bind(...binds).first();
  const rows = await env.DB.prepare(`
    SELECT * FROM page_edit_submissions
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).bind(...binds, limit, offset).all();
  return json({ ok: true, submissions: (rows.results || []).map(pageEditClientRow), total: Number(totalRow && totalRow.c || 0) }, 200, req, env);
}

async function handlePageEditStatus(req, env) {
  const body = await readJson(req, 4096);
  if (!isValidAdminKey(req, env, body)) return adminUnauthorized(req, env);
  const id = String(body.id || body.submissionId || "").trim();
  const status = String(body.status || "").toLowerCase();
  if (!id || !["open", "reviewed", "accepted", "rejected"].includes(status)) return json({ ok: false, error: "Missing submission id or invalid status." }, 400, req, env);
  const now = Date.now();
  await env.DB.prepare(`UPDATE page_edit_submissions SET status = ?, updated_at = ?, reviewed_at = ?, reviewed_by = ? WHERE id = ?`).bind(status, now, status === "open" ? 0 : now, "admin", id).run();
  return json({ ok: true, id, status, updatedAt: now }, 200, req, env);
}

function crc32Table() {
  if (globalThis.__mkPageEditCrc32Table) return globalThis.__mkPageEditCrc32Table;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c >>> 0;
  }
  globalThis.__mkPageEditCrc32Table = table;
  return table;
}

function crc32(bytes) {
  const table = crc32Table();
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i += 1) c = table[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function u16(n) { return [n & 255, (n >>> 8) & 255]; }
function u32(n) { return [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]; }

function safeZipName(value, fallback) {
  let s = String(value || fallback || "file").replace(/^\/+/, "").replace(/\\/g, "/").replace(/\.\./g, "_").replace(/[<>:"|?*\x00-\x1f]/g, "_");
  if (!s.trim()) s = String(fallback || "file");
  return s.slice(0, 180);
}

function buildZip(files) {
  const enc = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  const push = (arr) => { const u = arr instanceof Uint8Array ? arr : Uint8Array.from(arr); chunks.push(u); offset += u.length; return u; };
  for (const file of files) {
    const nameBytes = enc.encode(file.name);
    const dataBytes = enc.encode(String(file.content || ""));
    const crc = crc32(dataBytes);
    const localOffset = offset;
    push([0x50,0x4b,0x03,0x04, ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(crc), ...u32(dataBytes.length), ...u32(dataBytes.length), ...u16(nameBytes.length), ...u16(0)]);
    push(nameBytes); push(dataBytes);
    central.push({ nameBytes, crc, size: dataBytes.length, offset: localOffset });
  }
  const centralStart = offset;
  for (const file of central) {
    push([0x50,0x4b,0x01,0x02, ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(file.crc), ...u32(file.size), ...u32(file.size), ...u16(file.nameBytes.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(file.offset)]);
    push(file.nameBytes);
  }
  const centralSize = offset - centralStart;
  push([0x50,0x4b,0x05,0x06, ...u16(0), ...u16(0), ...u16(central.length), ...u16(central.length), ...u32(centralSize), ...u32(centralStart), ...u16(0)]);
  const out = new Uint8Array(offset);
  let pos = 0;
  for (const c of chunks) { out.set(c, pos); pos += c.length; }
  return out;
}

async function handlePageEditAdminDownload(req, env, url) {
  const authBody = adminKeyBodyFromUrl(url);
  if (!isValidAdminKey(req, env, authBody)) return adminUnauthorized(req, env);
  const statusRaw = String(url.searchParams.get("status") || "open").toLowerCase();
  const status = ["open", "reviewed", "accepted", "rejected"].includes(statusRaw) ? statusRaw : "";
  const path = normalizePath(url.searchParams.get("path") || "");
  const where = [];
  const binds = [];
  if (status) { where.push("status = ?"); binds.push(status); }
  if (path) { where.push("path = ?"); binds.push(path); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const rows = await env.DB.prepare(`SELECT * FROM page_edit_submissions ${whereSql} ORDER BY created_at DESC LIMIT 500`).bind(...binds).all();
  const submissions = (rows.results || []).map(pageEditClientRow);
  const files = [];
  files.push({ name: "manifest.json", content: JSON.stringify(submissions.map((x) => ({ id: x.id, path: x.path, title: x.title, sourcePath: x.sourcePath, submitterName: x.submitterName, status: x.status, createdAt: x.createdAt, note: x.note })), null, 2) });
  submissions.forEach((sub, idx) => {
    const base = safeZipName(`${String(idx + 1).padStart(3, "0")}-${sub.sourcePath || sub.path || sub.id}`, `submission-${idx + 1}.md`).replace(/\.html$/i, ".md");
    const folder = base.replace(/\.md$/i, "");
    files.push({ name: `${folder}/proposed.md`, content: sub.proposedMd || "" });
    if (sub.originalMd) files.push({ name: `${folder}/original.md`, content: sub.originalMd || "" });
    files.push({ name: `${folder}/note.txt`, content: `Title: ${sub.title}\nPath: ${sub.path}\nSource: ${sub.sourcePath}\nSubmitter: ${sub.submitterName}\nStatus: ${sub.status}\nCreated: ${new Date(sub.createdAt || 0).toISOString()}\n\n${sub.note || ""}\n` });
  });
  const zip = buildZip(files);
  return new Response(zip, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="page-edit-submissions-${status || "all"}.zip"`,
      "Cache-Control": "no-store",
      ...corsHeaders(req, env),
    }
  });
}

async function handleGetComments(req, env, url) {
  const path = normalizePath(url.searchParams.get("path") || "");
  if (!path) return json({ ok: false, error: "Missing path" }, 400, req, env);
  const currentVisitorHash = await visitorHash(url.searchParams.get("visitorId") || "");

  const rows = await env.DB.prepare(`
    SELECT
      c.id, c.path, c.parent_id,
      CASE WHEN COALESCE(c.is_anonymous,0) = 1 THEN 'Anonymous' ELSE COALESCE(i.name, c.name) END AS name,
      CASE WHEN COALESCE(c.is_anonymous,0) = 1 THEN '' ELSE COALESCE(i.avatar, '') END AS avatar,
      CASE WHEN COALESCE(c.is_anonymous,0) = 1 THEN 0 ELSE COALESCE(i.is_public,0) END AS is_public,
      CASE WHEN COALESCE(c.is_anonymous,0) = 1 THEN '' ELSE COALESCE(c.account_key, i.name_key, '') END AS account_key,
      CASE WHEN COALESCE(c.is_anonymous,0) = 1 THEN 'level-1' ELSE COALESCE(fr.selected_frame, 'level-1') END AS avatar_frame,
      COALESCE(c.is_anonymous,0) AS is_anonymous,
      c.text, c.ts, c.visitor_hash, c.edited_at,
      SUM(CASE WHEN r.reaction = 'like' THEN 1 ELSE 0 END) AS like_count,
      SUM(CASE WHEN r.reaction = 'heart' THEN 1 ELSE 0 END) AS heart_count,
      SUM(CASE WHEN r.reaction = 'laugh' THEN 1 ELSE 0 END) AS laugh_count
    FROM comments c
    LEFT JOIN comment_reactions r ON r.comment_id = c.id
    LEFT JOIN account_device_links dl ON dl.visitor_hash = c.visitor_hash
    LEFT JOIN comment_identities i ON i.name_key = COALESCE(c.account_key, dl.name_key)
    LEFT JOIN account_profile_rewards fr ON fr.account_key = COALESCE(c.account_key, dl.name_key, i.name_key)
    WHERE c.path = ? AND COALESCE(c.deleted_at, 0) = 0
    GROUP BY c.id
    ORDER BY c.ts ASC
  `).bind(path).all();

  return json({ ok: true, path, comments: (rows.results || []).map((row) => cleanCommentForClient(row, currentVisitorHash, req)) }, 200, req, env);
}


function extractMentionNames(text) {
  const raw = String(text || "");
  const out = [];
  const seen = new Set();
  const re = /(^|[^\w])@([A-Za-z0-9][A-Za-z0-9_.\- ]{1,38}[A-Za-z0-9])/g;
  let m;
  while ((m = re.exec(raw))) {
    const nm = cleanProfileName(m[2] || "");
    const key = identityNameKey(nm);
    if (key && !seen.has(key)) { seen.add(key); out.push({ name: nm, key }); }
  }
  return out.slice(0, 10);
}

async function saveCommentMentions(db, commentId, path, text, actorKey, actorHash) {
  const mentions = extractMentionNames(text);
  if (!mentions.length) return 0;
  let n = 0;
  const now = Date.now();
  for (const m of mentions) {
    if (!m.key || m.key === actorKey) continue;
    const exists = await db.prepare(`SELECT name_key FROM comment_identities WHERE name_key = ?`).bind(m.key).first().catch(() => null);
    if (!exists) continue;
    await db.prepare(`INSERT OR IGNORE INTO comment_mentions (comment_id, path, mentioned_key, actor_key, actor_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)`).bind(commentId, path, m.key, actorKey || "", actorHash || "", now).run().catch(() => {});
    n += 1;
  }
  return n;
}

function anonymousCommentDayStartUtc(ts) {
  const d = new Date(Number(ts || Date.now()) || Date.now());
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function anonymousCommentLimitMessage() {
  return "Anonymous visitors can post one comment per day. Leave a name to create a light account and comment normally.";
}

async function anonymousCommentCountToday(db, visitorHashValue, ts) {
  const vh = String(visitorHashValue || "");
  if (!vh) return 0;
  const start = anonymousCommentDayStartUtc(ts);
  const row = await db.prepare(`
    SELECT COUNT(*) AS c
    FROM comments
    WHERE visitor_hash = ?
      AND COALESCE(is_anonymous, 0) = 1
      AND COALESCE(deleted_at, 0) = 0
      AND ts >= ?
  `).bind(vh, start).first().catch(() => null);
  return Math.max(0, Number(row && row.c || 0) || 0);
}

async function handleAddComment(req, env) {
  const body = await readJson(req, 4096);
  const path = normalizePath(body.path);
  if (!path) return json({ ok: false, error: "Missing path" }, 400, req, env);
  if (!isConceptPath(path)) return json({ ok: true, ignored: true }, 200, req, env);

  const title = cleanTitle(body.title, path);
  const text = cleanText(body.text);
  if (!text) return json({ ok: false, error: "Comment is empty" }, 400, req, env);

  const anonymous = body.anonymous === true || body.anonymous === 1 || String(body.anonymous || "").toLowerCase() === "true" || body.asAnonymous === true;
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const parentIdRaw = String(body.parentId || "").trim().slice(0, 80);
  let parentId = parentIdRaw || null;
  if (parentId) {
    const parent = await env.DB.prepare(`SELECT 1 AS ok FROM comments WHERE id = ? AND path = ? AND COALESCE(deleted_at, 0) = 0`).bind(parentId, path).first();
    if (!parent) parentId = null;
  }

  const ts = Date.now();
  await touchPage(env.DB, path, title, ts);

  if (anonymous) {
    const vh = await visitorHash(body.visitorId || "");
    const usedToday = await anonymousCommentCountToday(env.DB, vh || "", ts);
    if (usedToday >= 1) {
      return json({ ok: false, code: "anonymous_daily_limit", error: anonymousCommentLimitMessage(), limit: 1, usedToday }, 429, req, env);
    }
    await env.DB.prepare(`
      INSERT INTO comments (id, path, parent_id, name, text, ts, visitor_hash, account_key, is_anonymous)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).bind(id, path, parentId, "Anonymous", text, ts, vh || "", "").run();

    // Anonymous comments still count as page discussion, but they are not tied
    // to the account activity feed and do not award account XP.
    await bumpEngagement(env.DB, "comment", path, title, 1);

    return json({
      ok: true,
      anonymous: true,
      profile: null,
      comment: cleanCommentForClient({ id, path, parent_id: parentId, name: "Anonymous", avatar: "", avatar_frame: "level-1", is_public: 0, account_key: "", is_anonymous: 1, text, ts, visitor_hash: vh || "", like_count: 0, heart_count: 0, laugh_count: 0 }, vh || "", req)
    }, 200, req, env);
  }

  const requestedName = cleanProfileName(body.name || "");
  const requestedKey = identityNameKey(requestedName);
  const existingAccount = await resolveAccount(env.DB, body.visitorId || "", req).catch(() => null);
  let identity = null;
  if (existingAccount && existingAccount.identity && existingAccount.accountKey && (!requestedKey || requestedKey === existingAccount.accountKey)) {
    const row = existingAccount.identity;
    identity = {
      ok: true,
      created: false,
      visitorHash: existingAccount.visitorHash || await visitorHash(body.visitorId || ""),
      accountKey: existingAccount.accountKey,
      profile: {
        name: cleanProfileName(row.name || requestedName),
        avatar: cleanAvatar(row.avatar || ""),
        isPublic: !!Number(row.is_public || 0),
        updatedAt: Number(row.updated_at || Date.now()),
        avatarFrame: "level-1"
      }
    };
    try {
      const rewards = await getAccountProfileRewards(env.DB, existingAccount.accountKey, 1);
      identity.profile.avatarFrame = avatarFrameId(rewards && rewards.avatarFrame || "level-1");
    } catch (_) {}
  } else {
    identity = await claimIdentity(env.DB, body.visitorId || "", body.name || "", body.avatar || "", { keepAvatar: !!body.keepAvatar, isPublic: body.isPublic, deviceName: body.deviceName || "" });
  }
  if (!identity.ok) return json({ ok: false, error: identity.error || "Could not save username" }, identity.status || 400, req, env);
  const name = identity.profile.name;
  const avatar = identity.profile.avatar;

  const vh = identity.visitorHash;
  const accountKey = identity.accountKey || identityNameKey(name);
  await env.DB.prepare(`
    INSERT INTO comments (id, path, parent_id, name, text, ts, visitor_hash, account_key, is_anonymous)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
  `).bind(id, path, parentId, name, text, ts, vh, accountKey).run();
  const mentionCount = await saveCommentMentions(env.DB, id, path, text, accountKey, vh);
  await bumpEngagement(env.DB, "comment", path, title, 1);
  await bumpUserActivity(env.DB, body.visitorId || "", parentId ? "reply" : "comment", 1, { path, title, ts, details: { commentId: id, parentId: parentId || "", commentKind: parentId ? "reply" : "comment" } });
  if (mentionCount > 0) await bumpUserActivity(env.DB, body.visitorId || "", "mention_given", mentionCount, { path, title, details: { commentId: id } });
  for (const m of extractMentionNames(text)) {
    if (m.key && m.key !== accountKey) await bumpAccountActivity(env.DB, m.key, "mention_received", 1, { path, title, details: { commentId: id, from: accountKey || "" } });
  }

  return json({ ok: true, profile: { name: identity.profile.name, avatar: publicAvatarForClient(req, identity.profile.avatar || ""), avatarFrame: identity.profile.avatarFrame || "level-1", accountKey, isPublic: !!identity.profile.isPublic, updatedAt: identity.profile.updatedAt }, comment: cleanCommentForClient({ id, parent_id: parentId, name, avatar, avatar_frame: identity.profile.avatarFrame || "level-1", is_public: identity.profile.isPublic ? 1 : 0, account_key: accountKey, is_anonymous: 0, text, ts, visitor_hash: vh, like_count: 0, heart_count: 0, laugh_count: 0 }, vh, req) }, 200, req, env);
}

async function handleEditComment(req, env) {
  const body = await readJson(req, 4096);
  const path = normalizePath(body.path);
  const commentId = String(body.commentId || body.id || "").trim();
  const text = cleanText(body.text);
  if (!path || !commentId) return json({ ok: false, error: "Missing path or commentId" }, 400, req, env);
  if (!text) return json({ ok: false, error: "Comment is empty" }, 400, req, env);

  const requestedVisitorHash = await visitorHash(body.visitorId || "");
  const requestedAccount = await resolveAccount(env.DB, body.visitorId || "");
  const adminOk = isValidAdminKey(req, env, body);

  const comment = await env.DB.prepare(`
    SELECT id, path, parent_id, name, text, ts, visitor_hash, account_key, edited_at
    FROM comments
    WHERE id = ? AND path = ? AND COALESCE(deleted_at, 0) = 0
  `).bind(commentId, path).first();
  if (!comment) return json({ ok: false, error: "Comment not found" }, 404, req, env);

  const ownerOk = !!((comment.account_key && requestedAccount.accountKey && String(comment.account_key) === String(requestedAccount.accountKey)) || (comment.visitor_hash && requestedVisitorHash && String(comment.visitor_hash) === String(requestedVisitorHash)));
  if (!adminOk && !ownerOk) return adminUnauthorized(req, env);

  const now = Date.now();
  await env.DB.prepare(`
    UPDATE comments
    SET text = ?, edited_at = ?
    WHERE id = ? AND path = ? AND COALESCE(deleted_at, 0) = 0
  `).bind(text, now, commentId, path).run();

  return json({
    ok: true,
    editedBy: adminOk ? "admin" : "owner",
    comment: cleanCommentForClient(Object.assign({}, comment, { text, edited_at: now }), requestedVisitorHash, req),
  }, 200, req, env);
}


async function handleDeleteComment(req, env) {
  const body = await readJson(req, 2048);
  const path = normalizePath(body.path);
  const commentId = String(body.commentId || body.id || "").trim();
  if (!path || !commentId) return json({ ok: false, error: "Missing path or commentId" }, 400, req, env);

  const requestedVisitorHash = await visitorHash(body.visitorId || "");
  const requestedAccount = await resolveAccount(env.DB, body.visitorId || "");
  const adminOk = isValidAdminKey(req, env, body);

  const comment = await env.DB.prepare(`
    SELECT id, path, visitor_hash, account_key
    FROM comments
    WHERE id = ? AND path = ? AND COALESCE(deleted_at, 0) = 0
  `).bind(commentId, path).first();
  if (!comment) return json({ ok: false, error: "Comment not found" }, 404, req, env);

  const ownerOk = !!((comment.account_key && requestedAccount.accountKey && String(comment.account_key) === String(requestedAccount.accountKey)) || (comment.visitor_hash && requestedVisitorHash && String(comment.visitor_hash) === String(requestedVisitorHash)));
  if (!adminOk && !ownerOk) return adminUnauthorized(req, env);

  const treeRows = await env.DB.prepare(`
    WITH RECURSIVE tree(id) AS (
      SELECT id FROM comments WHERE id = ? AND path = ?
      UNION ALL
      SELECT c.id FROM comments c JOIN tree t ON c.parent_id = t.id WHERE c.path = ?
    )
    SELECT id, path, parent_id, visitor_hash, account_key, ts
    FROM comments
    WHERE path = ? AND COALESCE(deleted_at, 0) = 0 AND id IN (SELECT id FROM tree)
  `).bind(commentId, path, path, path).all().catch(() => ({ results: [] }));
  const rowsToDelete = treeRows.results || [];
  const deletedCount = rowsToDelete.length;

  const xpRefund = await refundDeletedCommentTreeXp(env.DB, rowsToDelete, commentId, requestedAccount.accountKey || "").catch((err) => ({ deleted: 0, score: 0, error: String(err && err.message || err || "refund_failed") }));

  const now = Date.now();
  await env.DB.prepare(`
    WITH RECURSIVE tree(id) AS (
      SELECT id FROM comments WHERE id = ? AND path = ?
      UNION ALL
      SELECT c.id FROM comments c JOIN tree t ON c.parent_id = t.id WHERE c.path = ?
    )
    UPDATE comments
    SET deleted_at = ?, deleted_by = ?
    WHERE path = ? AND COALESCE(deleted_at, 0) = 0 AND id IN (SELECT id FROM tree)
  `).bind(commentId, path, path, now, adminOk ? "admin" : "owner", path).run();

  return json({ ok: true, deleted: deletedCount, deletedBy: adminOk ? "admin" : "owner", xpRefund }, 200, req, env);
}


async function handleReportComment(req, env) {
  const body = await readJson(req, 4096);
  const path = normalizePath(body.path);
  const commentId = String(body.commentId || body.id || "").trim();
  if (!path || !commentId) return json({ ok: false, error: "Missing path or commentId" }, 400, req, env);

  const comment = await env.DB.prepare(`
    SELECT id, path, parent_id, name, text, ts, edited_at, deleted_at
    FROM comments
    WHERE id = ? AND path = ? AND COALESCE(deleted_at, 0) = 0
  `).bind(commentId, path).first();
  if (!comment) return json({ ok: false, error: "Comment not found" }, 404, req, env);

  const reporter = await visitorHash(body.visitorId || "");
  const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000;
  const duplicate = await env.DB.prepare(`
    SELECT id, created_at, status
    FROM comment_reports
    WHERE comment_id = ? AND reporter_hash = ? AND created_at >= ?
    ORDER BY created_at DESC
    LIMIT 1
  `).bind(commentId, reporter, twelveHoursAgo).first();
  if (duplicate) {
    return json({ ok: true, duplicate: true, report: { id: duplicate.id, createdAt: Number(duplicate.created_at || 0), status: duplicate.status || "open" } }, 200, req, env);
  }

  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const now = Date.now();
  const reason = cleanReportReason(body.reason || body.note || "");
  await env.DB.prepare(`
    INSERT INTO comment_reports (id, comment_id, path, reporter_hash, reason, snapshot_name, snapshot_text, snapshot_ts, created_at, status, status_updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?)
  `).bind(id, commentId, path, reporter, reason, cleanName(comment.name), cleanText(comment.text), Number(comment.ts || 0), now, now).run();

  await bumpUserActivity(env.DB, body.visitorId || "", "report", 1, { path, title: "", details: { commentId } });
  return json({ ok: true, report: { id, commentId, path, reason, createdAt: now, status: "open" } }, 200, req, env);
}

async function handleCommentsAdmin(req, env, url) {
  const authBody = adminKeyBodyFromUrl(url);
  if (!isValidAdminKey(req, env, authBody)) return adminUnauthorized(req, env);

  const view = String(url.searchParams.get("view") || "comments").toLowerCase();
  const limit = clampInt(url.searchParams.get("limit"), 1, 200, 80);
  const offset = clampInt(url.searchParams.get("offset"), 0, 100000, 0);
  const status = String(url.searchParams.get("status") || "").toLowerCase();
  const path = normalizePath(url.searchParams.get("path") || "");

  if (view === "reports") {
    const where = [];
    const binds = [];
    if (status && ["open", "reviewed", "dismissed"].includes(status)) { where.push("COALESCE(r.status, 'open') = ?"); binds.push(status); }
    if (path) { where.push("r.path = ?"); binds.push(path); }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const totalRow = await env.DB.prepare(`SELECT COUNT(*) AS c FROM comment_reports r ${whereSql}`).bind(...binds).first();
    const rows = await env.DB.prepare(`
      SELECT
        r.id, r.comment_id, r.path, r.reason, r.snapshot_name, r.snapshot_text, r.snapshot_ts,
        r.created_at, r.status, r.status_updated_at,
        p.title AS title,
        COALESCE(ai.name, c.name) AS current_name,
        COALESCE(ai.name, c.name) AS comment_author_name,
        COALESCE(ai.avatar, '') AS comment_author_avatar,
        COALESCE(ai.is_public, 0) AS comment_author_is_public,
        c.text AS current_text, c.deleted_at AS comment_deleted_at, c.edited_at AS comment_edited_at,
        COALESCE(ri.name, '') AS reporter_name,
        COALESCE(ri.avatar, '') AS reporter_avatar,
        COALESCE(ri.is_public, 0) AS reporter_is_public,
        COALESCE(ri.name_key, rdl.name_key, '') AS reporter_account_key
      FROM comment_reports r
      LEFT JOIN pages p ON p.path = r.path
      LEFT JOIN comments c ON c.id = r.comment_id
      LEFT JOIN account_device_links adl ON adl.visitor_hash = c.visitor_hash
      LEFT JOIN comment_identities ai ON ai.name_key = COALESCE(c.account_key, adl.name_key)
      LEFT JOIN account_device_links rdl ON rdl.visitor_hash = r.reporter_hash
      LEFT JOIN comment_identities riv ON riv.visitor_hash = r.reporter_hash
      LEFT JOIN comment_identities ri ON ri.name_key = COALESCE(rdl.name_key, riv.name_key)
      ${whereSql}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...binds, limit, offset).all();
    return json({ ok: true, view: "reports", reports: (rows.results || []).map((row) => cleanCommentReportRow(row, req)), total: Number(totalRow?.c || 0) }, 200, req, env);
  }

  const where = [];
  const binds = [];
  if (path) { where.push("c.path = ?"); binds.push(path); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const totalRow = await env.DB.prepare(`SELECT COUNT(*) AS c FROM comments c ${whereSql}`).bind(...binds).first();
  const rows = await env.DB.prepare(`
    SELECT
      c.id, c.path, c.parent_id, COALESCE(i.name, c.name) AS name, COALESCE(i.avatar, '') AS avatar, c.text, c.ts, c.edited_at, c.deleted_at, c.deleted_by,
      p.title AS title,
      SUM(CASE WHEN cr.reaction = 'like' THEN 1 ELSE 0 END) AS like_count,
      SUM(CASE WHEN cr.reaction = 'heart' THEN 1 ELSE 0 END) AS heart_count,
      SUM(CASE WHEN cr.reaction = 'laugh' THEN 1 ELSE 0 END) AS laugh_count,
      COUNT(DISTINCT rr.id) AS report_count
    FROM comments c
    LEFT JOIN pages p ON p.path = c.path
    LEFT JOIN comment_reactions cr ON cr.comment_id = c.id
    LEFT JOIN comment_reports rr ON rr.comment_id = c.id
    LEFT JOIN account_device_links dl ON dl.visitor_hash = c.visitor_hash
    LEFT JOIN comment_identities i ON i.name_key = COALESCE(c.account_key, dl.name_key)
    ${whereSql}
    GROUP BY c.id
    ORDER BY c.ts DESC
    LIMIT ? OFFSET ?
  `).bind(...binds, limit, offset).all();
  return json({ ok: true, view: "comments", comments: (rows.results || []).map(cleanCommentAdminRow), total: Number(totalRow?.c || 0) }, 200, req, env);
}

async function handleCommentReportStatus(req, env) {
  const body = await readJson(req, 4096);
  if (!isValidAdminKey(req, env, body)) return adminUnauthorized(req, env);
  const reportId = String(body.reportId || body.id || "").trim();
  const status = String(body.status || "reviewed").toLowerCase().trim();
  if (!reportId || !["open", "reviewed", "dismissed"].includes(status)) {
    return json({ ok: false, error: "Invalid report status request" }, 400, req, env);
  }
  const now = Date.now();
  await env.DB.prepare(`UPDATE comment_reports SET status = ?, status_updated_at = ? WHERE id = ?`).bind(status, now, reportId).run();

  const report = await env.DB.prepare(`
    SELECT r.id, r.comment_id, r.path, r.snapshot_text, r.reporter_hash, COALESCE(dl.name_key, ci.name_key, '') AS reporter_account_key
    FROM comment_reports r
    LEFT JOIN account_device_links dl ON dl.visitor_hash = r.reporter_hash AND COALESCE(dl.revoked_at,0)=0
    LEFT JOIN comment_identities ci ON ci.visitor_hash = r.reporter_hash
    WHERE r.id = ?
    LIMIT 1
  `).bind(reportId).first().catch(() => null);
  const reporterKey = identityNameKey(report && report.reporter_account_key || "");
  const commentId = String(report && report.comment_id || "");
  const data = { path: String(report && report.path || ""), commentId, commentText: String(report && report.snapshot_text || "") };
  let voucher = null;
  let notification = null;

  if (status === "dismissed") {
    if (reporterKey) {
      notification = await addAccountCustomNotification(
        env.DB,
        reporterKey,
        "malicious_comment_report_ignored",
        "Comment report reviewed",
        "Thank you for reporting this comment. After review, it was not confirmed as malicious.",
        "malicious_comment_report",
        `${reportId}:ignored`,
        data
      );
    }
    return json({ ok: true, reportId, status, statusUpdatedAt: now, reporterAccountKey: reporterKey, notification }, 200, req, env);
  }

  const rewardReporter = body.rewardReporter === true || body.reward === true || String(body.rewardReporter || body.reward || "").toLowerCase() === "true";
  if (rewardReporter && status === "reviewed" && commentId) {
    const first = await env.DB.prepare(`
      SELECT r.id, COALESCE(dl.name_key, ci.name_key, '') AS reporter_account_key
      FROM comment_reports r
      LEFT JOIN account_device_links dl ON dl.visitor_hash = r.reporter_hash AND COALESCE(dl.revoked_at,0)=0
      LEFT JOIN comment_identities ci ON ci.visitor_hash = r.reporter_hash
      WHERE r.comment_id = ?
      ORDER BY r.created_at ASC
      LIMIT 1
    `).bind(commentId).first().catch(() => null);
    const firstKey = identityNameKey(first && first.reporter_account_key || reporterKey || "");

    const result = await handleAdminReportDecision(new Request(req.url, {
      method: "POST",
      headers: req.headers,
      body: JSON.stringify({
        adminKey: adminKeyFromRequest(req, body),
        kind: "malicious_comment_report",
        decision: "confirm",
        reportId,
        commentId,
        reporterAccountKey: reporterKey,
        firstReporterAccountKey: firstKey,
        firstReportId: first && first.id || reportId,
        path: data.path,
        commentText: data.commentText,
      }),
    }), env);
    const payload = await result.json().catch(() => ({}));
    return json(Object.assign({ ok: true, reportId, status, statusUpdatedAt: now }, payload || {}), result.status, req, env);
  }

  return json({ ok: true, reportId, status, statusUpdatedAt: now, voucher }, 200, req, env);
}

async function handleAdminGrantXpCapBoostVoucher(req, env) {
  const body = await readJson(req, 4096);
  if (!isValidAdminKey(req, env, body)) return adminUnauthorized(req, env);
  let accountKey = identityNameKey(body.accountKey || body.reporterAccountKey || body.name || "");
  if (!accountKey && body.reporterVisitorId) {
    const vh = await visitorHash(body.reporterVisitorId || "");
    accountKey = await accountKeyFromVisitorHash(env.DB, vh);
  }
  if (!accountKey && body.reporterHash) accountKey = await accountKeyFromVisitorHash(env.DB, body.reporterHash);
  if (!accountKey) return json({ ok: false, error: "Could not resolve the reporter account for this reward." }, 400, req, env);
  const source = String(body.source || "admin_reward").trim() || "admin_reward";
  const sourceId = String(body.sourceId || body.reportId || body.id || `${Date.now()}`).trim();
  const reason = String(body.reason || "Confirmed useful report. Activate this voucher to double today's XP caps.").trim();
  const voucher = await grantXpCapBoostVoucher(env.DB, accountKey, source, sourceId, reason, "admin");
  return json(Object.assign({ ok: !!(voucher && voucher.ok), accountKey }, voucher || {}), voucher && voucher.ok ? 200 : 400, req, env);
}


async function resolveReporterAccountKeyFromBody(env, body, prefix) {
  const p = String(prefix || "");
  let accountKey = identityNameKey(body[p + "AccountKey"] || body[p + "ReporterAccountKey"] || body[p + "Name"] || "");
  const visitorId = body[p + "VisitorId"] || body[p + "ReporterVisitorId"] || "";
  const reporterHash = body[p + "Hash"] || body[p + "ReporterHash"] || "";
  if (!accountKey && visitorId) {
    const vh = await visitorHash(visitorId || "");
    accountKey = await accountKeyFromVisitorHash(env.DB, vh);
  }
  if (!accountKey && reporterHash) accountKey = await accountKeyFromVisitorHash(env.DB, reporterHash);
  return identityNameKey(accountKey || "");
}

async function handleAdminReportDecision(req, env) {
  const body = await readJson(req, 8192);
  if (!isValidAdminKey(req, env, body)) return adminUnauthorized(req, env);

  const now = Date.now();
  const kind = safeVoucherIdPart(body.kind || body.source || "ai_test_bug_report");
  const decisionRaw = String(body.decision || body.status || "").toLowerCase().trim();
  const decision = /confirm|review|reward/.test(decisionRaw) ? "confirmed" : /ignore|dismiss|reject/.test(decisionRaw) ? "ignored" : "";
  if (!decision || !["ai_test_bug_report", "malicious_comment_report"].includes(kind)) {
    return json({ ok: false, error: "Invalid report decision request." }, 400, req, env);
  }

  const reportId = String(body.reportId || body.id || "").trim() || `report:${now}`;
  // Some AI question reports are submitted before the reporter has connected a
  // profile/device.  The admin decision should still be recorded; in that case
  // we simply skip the user notification and voucher delivery.
  const currentReporterKey = await resolveReporterAccountKeyFromBody(env, body, "reporter");

  const fingerprint = safeVoucherIdPart(body.fingerprint || reportFingerprint(kind, body));
  const sourceId = fingerprint;
  const data = {
    path: body.path || body.pagePath || "",
    pageTitle: body.pageTitle || body.conceptTitle || body.title || "",
    questionId: body.questionId || body.question_id || "",
    commentId: body.commentId || body.comment_id || "",
    commentText: body.commentText || body.snapshotText || "",
  };

  if (decision === "ignored") {
    await env.DB.prepare(`
      INSERT OR IGNORE INTO admin_report_decisions (id, kind, fingerprint, report_id, decision, reporter_account_key, rewarded_account_key, created_at, created_by, data_json)
      VALUES (?, ?, ?, ?, 'ignored', ?, '', ?, 'admin', ?)
    `).bind(`decision:${kind}:${safeVoucherIdPart(reportId)}:ignored`.slice(0, 240), kind, fingerprint, reportId, currentReporterKey, now, JSON.stringify(data).slice(0, 2000)).run();

    const title = kind === "ai_test_bug_report" ? "AI question report reviewed" : "Comment report reviewed";
    const message = kind === "ai_test_bug_report"
      ? "Thank you for reporting this AI question. After review, no clear bug was found in this item."
      : "Thank you for reporting this comment. After review, it was not confirmed as malicious.";
    const note = currentReporterKey
      ? await addAccountCustomNotification(env.DB, currentReporterKey, `${kind}_ignored`, title, message, kind, `${reportId}:ignored`, data)
      : null;
    return json({ ok: true, decision: "ignored", reportId, reporterAccountKey: currentReporterKey, notification: note, notificationSkipped: !currentReporterKey }, 200, req, env);
  }

  let firstReporterKey = await resolveReporterAccountKeyFromBody(env, body, "firstReporter");
  const firstReportId = String(body.firstReportId || "").trim() || reportId;
  if (!firstReporterKey) firstReporterKey = currentReporterKey;

  const existing = await env.DB.prepare(`
    SELECT * FROM admin_report_decisions
    WHERE kind = ? AND fingerprint = ? AND decision = 'confirmed'
    ORDER BY created_at ASC
    LIMIT 1
  `).bind(kind, fingerprint).first().catch(() => null);

  if (existing) {
    const winnerKey = identityNameKey(existing.rewarded_account_key || "");
    if (currentReporterKey && (!winnerKey || currentReporterKey !== winnerKey)) {
      const title = kind === "ai_test_bug_report" ? "AI question report reviewed" : "Comment report reviewed";
      const message = winnerKey
        ? (kind === "ai_test_bug_report"
          ? "Thank you for reporting this AI question. The bug was confirmed, but another reporter submitted it first and received the voucher."
          : "Thank you for reporting this comment. It was confirmed, but another reporter submitted it first and received the voucher.")
        : (kind === "ai_test_bug_report"
          ? "Thank you for reporting this AI question. The bug was confirmed, but the earliest report came from an unconnected device, so no voucher could be issued."
          : "Thank you for reporting this comment. It was confirmed, but the earliest report came from an unconnected device, so no voucher could be issued.");
      const note = await addAccountCustomNotification(env.DB, currentReporterKey, `${kind}_duplicate_confirmed`, title, message, kind, `${reportId}:duplicate-confirmed`, data);
      return json({ ok: true, decision: "confirmed", duplicate: true, firstAlreadyRewarded: !!winnerKey, rewardedAccountKey: winnerKey, reporterAccountKey: currentReporterKey, notification: note, voucherSkipped: !winnerKey }, 200, req, env);
    }
    return json({ ok: true, decision: "confirmed", duplicate: true, firstAlreadyRewarded: !!winnerKey, rewardedAccountKey: winnerKey, reporterAccountKey: currentReporterKey, notificationSkipped: !currentReporterKey, voucherSkipped: !winnerKey }, 200, req, env);
  }

  await env.DB.prepare(`
    INSERT OR IGNORE INTO admin_report_decisions (id, kind, fingerprint, report_id, decision, reporter_account_key, rewarded_account_key, created_at, created_by, data_json)
    VALUES (?, ?, ?, ?, 'confirmed', ?, ?, ?, 'admin', ?)
  `).bind(`decision:${kind}:${fingerprint}:confirmed`.slice(0, 240), kind, fingerprint, firstReportId, currentReporterKey, firstReporterKey, now, JSON.stringify(data).slice(0, 2000)).run();

  const winner = await env.DB.prepare(`
    SELECT * FROM admin_report_decisions
    WHERE kind = ? AND fingerprint = ? AND decision = 'confirmed'
    ORDER BY created_at ASC
    LIMIT 1
  `).bind(kind, fingerprint).first().catch(() => null);
  const rewardedKey = identityNameKey(winner && winner.rewarded_account_key || firstReporterKey);

  let voucher = null;
  if (rewardedKey) {
    const reason = kind === "ai_test_bug_report"
      ? "Thank you for reporting this AI question. The bug was confirmed, and you received a voucher that doubles today's XP caps when activated."
      : "Thank you for reporting this comment. It was confirmed as malicious, and you received a voucher that doubles today's XP caps when activated.";
    voucher = await grantXpCapBoostVoucher(env.DB, rewardedKey, kind, sourceId, reason, "admin-report-decision");
  }

  let notification = null;
  if (currentReporterKey && currentReporterKey !== rewardedKey) {
    const title = kind === "ai_test_bug_report" ? "AI question report reviewed" : "Comment report reviewed";
    const message = kind === "ai_test_bug_report"
      ? "Thank you for reporting this AI question. The bug was confirmed, but another reporter submitted it first and received the voucher."
      : "Thank you for reporting this comment. It was confirmed, but another reporter submitted it first and received the voucher.";
    notification = await addAccountCustomNotification(env.DB, currentReporterKey, `${kind}_duplicate_confirmed`, title, message, kind, `${reportId}:duplicate-confirmed`, data);
  }

  return json({ ok: true, decision: "confirmed", reportId, fingerprint, reporterAccountKey: currentReporterKey, rewardedAccountKey: rewardedKey, voucher, notification, notificationSkipped: !currentReporterKey || !rewardedKey }, 200, req, env);
}

async function handleActivateXpCapBoostVoucher(req, env) {
  const body = await readJson(req, 2048);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const result = await activateXpCapBoostVoucher(env.DB, acc.accountKey, body.voucherId || body.id || "");
  return json(result, result && result.ok ? 200 : 400, req, env);
}


function cleanNotificationActor(row, req) {
  const isPublic = !!Number(row && row.actor_is_public || 0) && !!cleanName(row && row.actor_name || "");
  return {
    name: isPublic ? cleanName(row.actor_name || "") : "Anonymous",
    avatar: isPublic ? publicAvatarForClient(req, row.actor_avatar || "") : "",
    profilePublic: isPublic,
    accountKey: isPublic ? String(row.actor_account_key || "") : "",
  };
}

function cleanNotificationRow(row, req) {
  const actor = cleanNotificationActor(row, req);
  return {
    type: String(row.kind || ""),
    reaction: String(row.reaction || ""),
    createdAt: Number(row.created_at || 0),
    path: String(row.path || ""),
    title: cleanTitle(row.title || "", row.path || ""),
    commentId: String(row.comment_id || ""),
    replyId: String(row.reply_id || ""),
    commentText: cleanText(row.target_text || ""),
    replyText: cleanText(row.reply_text || ""),
    actorName: actor.name,
    actorAvatar: actor.avatar,
    actorPublic: actor.profilePublic,
    actorAccountKey: actor.accountKey,
  };
}

async function handleNotifications(req, env, url) {
  const limit = clampInt(url.searchParams.get("limit"), 1, 100, 60);
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  const visitor = acc.visitorHash || "";
  const accountKey = acc.accountKey || "";
  if (!visitor && !accountKey) return json({ ok: true, notifications: [], total: 0 }, 200, req, env);

  let seenAt = 0;
  if (accountKey) {
    const seenRow = await env.DB.prepare(`SELECT COALESCE(seen_at,0) AS seen_at FROM account_notification_state WHERE account_key = ?`).bind(accountKey).first().catch(() => null);
    seenAt = Number(seenRow && seenRow.seen_at || 0) || 0;
  }

  const ownCond = accountKey ? "(c.account_key = ? OR c.visitor_hash = ?)" : "c.visitor_hash = ?";
  const ownBinds = accountKey ? [accountKey, visitor] : [visitor];
  const actorNotOwnReaction = accountKey
    ? "AND cr.visitor_hash != ? AND COALESCE(dl.name_key, iv.name_key, '') != ?"
    : "AND cr.visitor_hash != ?";
  const actorNotOwnReply = accountKey
    ? "AND rc.visitor_hash != ? AND COALESCE(rc.account_key, dl.name_key, iv.name_key, '') != ?"
    : "AND rc.visitor_hash != ?";

  const reactionBinds = [...ownBinds, visitor];
  if (accountKey) reactionBinds.push(accountKey);
  reactionBinds.push(Math.min(120, Math.max(limit * 2, limit)));

  const replyBinds = [...ownBinds, visitor];
  if (accountKey) replyBinds.push(accountKey);
  replyBinds.push(Math.min(120, Math.max(limit * 2, limit)));

  const reactionRows = await env.DB.prepare(`
    SELECT
      'reaction' AS kind,
      cr.reaction AS reaction,
      cr.created_at AS created_at,
      c.id AS comment_id,
      '' AS reply_id,
      c.path AS path,
      p.title AS title,
      c.text AS target_text,
      '' AS reply_text,
      COALESCE(i.name, '') AS actor_name,
      COALESCE(i.avatar, '') AS actor_avatar,
      COALESCE(i.is_public, 0) AS actor_is_public,
      COALESCE(i.name_key, dl.name_key, '') AS actor_account_key
    FROM comments c
    JOIN comment_reactions cr ON cr.comment_id = c.id
    LEFT JOIN pages p ON p.path = c.path
    LEFT JOIN account_device_links dl ON dl.visitor_hash = cr.visitor_hash
    LEFT JOIN comment_identities iv ON iv.visitor_hash = cr.visitor_hash
    LEFT JOIN comment_identities i ON i.name_key = COALESCE(dl.name_key, iv.name_key)
    WHERE ${ownCond}
      AND COALESCE(c.deleted_at, 0) = 0
      ${actorNotOwnReaction}
    ORDER BY cr.created_at DESC
    LIMIT ?
  `).bind(...reactionBinds).all();

  const replyRows = await env.DB.prepare(`
    SELECT
      'reply' AS kind,
      '' AS reaction,
      rc.ts AS created_at,
      c.id AS comment_id,
      rc.id AS reply_id,
      c.path AS path,
      p.title AS title,
      c.text AS target_text,
      rc.text AS reply_text,
      COALESCE(i.name, rc.name, '') AS actor_name,
      COALESCE(i.avatar, '') AS actor_avatar,
      COALESCE(i.is_public, 0) AS actor_is_public,
      COALESCE(i.name_key, dl.name_key, '') AS actor_account_key
    FROM comments c
    JOIN comments rc ON rc.parent_id = c.id AND rc.path = c.path
    LEFT JOIN pages p ON p.path = c.path
    LEFT JOIN account_device_links dl ON dl.visitor_hash = rc.visitor_hash
    LEFT JOIN comment_identities iv ON iv.visitor_hash = rc.visitor_hash
    LEFT JOIN comment_identities i ON i.name_key = COALESCE(rc.account_key, dl.name_key, iv.name_key)
    WHERE ${ownCond}
      AND COALESCE(c.deleted_at, 0) = 0
      AND COALESCE(rc.deleted_at, 0) = 0
      ${actorNotOwnReply}
    ORDER BY rc.ts DESC
    LIMIT ?
  `).bind(...replyBinds).all();

  let mentionRows = { results: [] };
  let incomingRows = { results: [] };
  let acceptedRows = { results: [] };
  let voucherRows = { results: [] };
  let customRows = { results: [] };
  if (accountKey) {
    mentionRows = await env.DB.prepare(`
      SELECT
        'mention' AS kind,
        '' AS reaction,
        cm.created_at AS created_at,
        c.id AS comment_id,
        '' AS reply_id,
        cm.path AS path,
        p.title AS title,
        '' AS target_text,
        c.text AS reply_text,
        COALESCE(i.name, c.name, '') AS actor_name,
        COALESCE(i.avatar, '') AS actor_avatar,
        COALESCE(i.is_public, 0) AS actor_is_public,
        COALESCE(i.name_key, cm.actor_key, '') AS actor_account_key
      FROM comment_mentions cm
      JOIN comments c ON c.id = cm.comment_id
      LEFT JOIN pages p ON p.path = cm.path
      LEFT JOIN comment_identities i ON i.name_key = cm.actor_key
      WHERE cm.mentioned_key = ? AND COALESCE(c.deleted_at,0)=0 AND COALESCE(cm.actor_key,'') != ?
      ORDER BY cm.created_at DESC
      LIMIT ?
    `).bind(accountKey, accountKey, Math.min(120, Math.max(limit * 2, limit))).all();

    incomingRows = await env.DB.prepare(`
      SELECT 'connection_request' AS kind, sc.created_at AS created_at, COALESCE(i.name,'') AS actor_name, COALESCE(i.avatar,'') AS actor_avatar, 1 AS actor_is_public, sc.requester_key AS actor_account_key
      FROM study_connections sc
      LEFT JOIN comment_identities i ON i.name_key = sc.requester_key
      WHERE sc.target_key = ? AND sc.status = 'pending'
      ORDER BY sc.created_at DESC
      LIMIT ?
    `).bind(accountKey, limit).all();

    acceptedRows = await env.DB.prepare(`
      SELECT 'connection_accepted' AS kind, sc.updated_at AS created_at, COALESCE(i.name,'') AS actor_name, COALESCE(i.avatar,'') AS actor_avatar, 1 AS actor_is_public, sc.target_key AS actor_account_key
      FROM study_connections sc
      LEFT JOIN comment_identities i ON i.name_key = sc.target_key
      WHERE sc.requester_key = ? AND sc.status = 'accepted'
      ORDER BY sc.updated_at DESC
      LIMIT ?
    `).bind(accountKey, limit).all();

    voucherRows = await env.DB.prepare(`
      SELECT
        v.id, v.account_key, v.source, v.source_id, v.reason, v.multiplier, v.day, v.created_at, v.activated_at, v.expires_at, v.created_by,
        ard.data_json AS report_data_json
      FROM xp_cap_boost_vouchers v
      LEFT JOIN admin_report_decisions ard
        ON ard.kind = v.source
       AND ard.fingerprint = v.source_id
       AND ard.decision = 'confirmed'
      WHERE v.account_key = ? AND (COALESCE(v.activated_at,0)=0 OR COALESCE(v.expires_at,0) >= ?)
      GROUP BY v.id
      ORDER BY v.created_at DESC
      LIMIT ?
    `).bind(accountKey, Date.now(), limit).all().catch(() => ({ results: [] }));

    customRows = await env.DB.prepare(`
      SELECT id, account_key, type, title, message, source, source_id, created_at, data_json
      FROM account_custom_notifications
      WHERE account_key = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).bind(accountKey, limit).all().catch(() => ({ results: [] }));
  }

  const connectionNotification = (r) => ({
    type: String(r.kind || ""),
    reaction: "",
    createdAt: Number(r.created_at || 0),
    path: "",
    title: "",
    commentId: "",
    replyId: "",
    commentText: "",
    replyText: "",
    actorName: cleanName(r.actor_name || "") || "Anonymous",
    actorAvatar: publicAvatarForClient(req, r.actor_avatar || ""),
    actorPublic: true,
    actorAccountKey: String(r.actor_account_key || ""),
  });

  const merged = []
    .concat((reactionRows.results || []).map((r) => cleanNotificationRow(r, req)))
    .concat((replyRows.results || []).map((r) => cleanNotificationRow(r, req)))
    .concat((mentionRows.results || []).map((r) => cleanNotificationRow(r, req)))
    .concat((incomingRows.results || []).map(connectionNotification))
    .concat((acceptedRows.results || []).map(connectionNotification))
    .concat((voucherRows.results || []).map(voucherNotificationFromRow))
    .concat((customRows.results || []).map(customNotificationFromRow))
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
    .slice(0, limit);

  return json({ ok: true, notifications: merged, total: merged.length, seenAt }, 200, req, env);
}

async function accountHasUnreadNotifications(db, accountKey, visitorHash, seenAt) {
  const key = String(accountKey || "").trim();
  const visitor = String(visitorHash || "").trim();
  const since = Math.max(0, Number(seenAt || 0));
  if (!key && !visitor) return false;

  const ownCond = key ? "(c.account_key = ? OR c.visitor_hash = ?)" : "c.visitor_hash = ?";
  const ownBinds = key ? [key, visitor] : [visitor];
  const actorNotOwnReaction = key
    ? "AND cr.visitor_hash != ? AND COALESCE(dl.name_key, iv.name_key, '') != ?"
    : "AND cr.visitor_hash != ?";
  const actorNotOwnReply = key
    ? "AND rc.visitor_hash != ? AND COALESCE(rc.account_key, dl.name_key, iv.name_key, '') != ?"
    : "AND rc.visitor_hash != ?";

  const reactionBinds = [...ownBinds, visitor];
  if (key) reactionBinds.push(key);
  reactionBinds.push(since);

  const replyBinds = [...ownBinds, visitor];
  if (key) replyBinds.push(key);
  replyBinds.push(since);

  const checks = await Promise.all([
    db.prepare(`
      SELECT 1 AS ok
      FROM comments c
      JOIN comment_reactions cr ON cr.comment_id = c.id
      LEFT JOIN account_device_links dl ON dl.visitor_hash = cr.visitor_hash
      LEFT JOIN comment_identities iv ON iv.visitor_hash = cr.visitor_hash
      WHERE ${ownCond}
        AND COALESCE(c.deleted_at, 0) = 0
        ${actorNotOwnReaction}
        AND COALESCE(cr.created_at,0) > ?
      LIMIT 1
    `).bind(...reactionBinds).first().catch(() => null),
    db.prepare(`
      SELECT 1 AS ok
      FROM comments c
      JOIN comments rc ON rc.parent_id = c.id AND rc.path = c.path
      LEFT JOIN account_device_links dl ON dl.visitor_hash = rc.visitor_hash
      LEFT JOIN comment_identities iv ON iv.visitor_hash = rc.visitor_hash
      WHERE ${ownCond}
        AND COALESCE(c.deleted_at, 0) = 0
        AND COALESCE(rc.deleted_at, 0) = 0
        ${actorNotOwnReply}
        AND COALESCE(rc.ts,0) > ?
      LIMIT 1
    `).bind(...replyBinds).first().catch(() => null),
    key ? db.prepare(`SELECT 1 AS ok FROM comment_mentions cm JOIN comments c ON c.id = cm.comment_id WHERE cm.mentioned_key = ? AND COALESCE(c.deleted_at,0)=0 AND COALESCE(cm.actor_key,'') != ? AND COALESCE(cm.created_at,0) > ? LIMIT 1`).bind(key, key, since).first().catch(() => null) : Promise.resolve(null),
    key ? db.prepare(`SELECT 1 AS ok FROM study_connections sc WHERE sc.target_key = ? AND sc.status = 'pending' AND COALESCE(sc.created_at,0) > ? LIMIT 1`).bind(key, since).first().catch(() => null) : Promise.resolve(null),
    key ? db.prepare(`SELECT 1 AS ok FROM study_connections sc WHERE sc.requester_key = ? AND sc.status = 'accepted' AND COALESCE(sc.updated_at,0) > ? LIMIT 1`).bind(key, since).first().catch(() => null) : Promise.resolve(null),
    key ? db.prepare(`SELECT 1 AS ok FROM xp_cap_boost_vouchers WHERE account_key = ? AND COALESCE(created_at,0) > ? AND COALESCE(activated_at,0)=0 LIMIT 1`).bind(key, since).first().catch(() => null) : Promise.resolve(null),
  ]);
  return checks.some((r) => !!(r && r.ok));
}

async function handleNotificationsSeen(req, env) {
  const body = await readJson(req, 2048);
  const acc = await resolveAccount(env.DB, body.visitorId || "", req);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const now = Date.now();
  const proposed = Number(body.seenAt || body.seen_at || now) || now;
  const seenAt = Math.max(0, Math.min(Math.max(proposed, now), now + 60000));
  const oldRow = await env.DB.prepare(`SELECT COALESCE(seen_at,0) AS seen_at FROM account_notification_state WHERE account_key = ?`).bind(acc.accountKey).first().catch(() => null);
  const oldSeenAt = Number(oldRow && oldRow.seen_at || 0) || 0;
  const hadUnread = await accountHasUnreadNotifications(env.DB, acc.accountKey, acc.visitorHash, oldSeenAt).catch(() => false);

  await env.DB.prepare(`
    INSERT INTO account_notification_state (account_key, seen_at, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(account_key) DO UPDATE SET
      seen_at = CASE WHEN excluded.seen_at > account_notification_state.seen_at THEN excluded.seen_at ELSE account_notification_state.seen_at END,
      updated_at = excluded.updated_at
  `).bind(acc.accountKey, seenAt, now).run();
  const row = await env.DB.prepare(`SELECT COALESCE(seen_at,0) AS seen_at FROM account_notification_state WHERE account_key = ?`).bind(acc.accountKey).first().catch(() => null);
  if (hadUnread) await bumpAccountActivity(env.DB, acc.accountKey, "notification_read", 1, { details: { source: "notifications_seen" } });
  return json({ ok: true, seenAt: Number(row && row.seen_at || seenAt) || seenAt, xpAwarded: !!hadUnread }, 200, req, env);
}

function cleanReactionUser(row, req) {
  const isPublic = !!Number(row && row.is_public || 0) && !!cleanName(row && row.name || "");
  return {
    name: isPublic ? cleanName(row.name) : "Anonymous",
    avatar: isPublic ? publicAvatarForClient(req, row.avatar || "") : "",
    avatarFrame: isPublic ? avatarFrameId(row.avatar_frame || "level-1") : "level-1",
    profilePublic: isPublic,
    accountKey: isPublic ? String(row.account_key || "") : "",
    reaction: String(row.reaction || ""),
    createdAt: Number(row.created_at || 0),
  };
}

async function handleCommentReactionsList(req, env, url) {
  const path = normalizePath(url.searchParams.get("path") || "");
  const commentId = String(url.searchParams.get("commentId") || "").trim();
  const reaction = String(url.searchParams.get("reaction") || "").trim().toLowerCase();
  if (!path || !commentId || !["like", "heart", "laugh"].includes(reaction)) {
    return json({ ok: false, error: "Invalid reaction list request" }, 400, req, env);
  }

  const comment = await env.DB.prepare(`SELECT id, path, visitor_hash FROM comments WHERE id = ? AND path = ? AND COALESCE(deleted_at, 0) = 0`).bind(commentId, path).first();
  if (!comment) return json({ ok: false, error: "Comment not found" }, 404, req, env);

  const currentVisitorHash = await visitorHash(url.searchParams.get("visitorId") || "");
  const adminKey = url.searchParams.get("key") || "";
  const isOwner = !!(currentVisitorHash && comment.visitor_hash && currentVisitorHash === comment.visitor_hash);
  const isAdmin = isValidAdminKey(req, env, { key: adminKey });
  if (!isOwner && !isAdmin) return json({ ok: false, error: "Only the comment owner can view who reacted." }, 403, req, env);

  const rows = await env.DB.prepare(`
    SELECT
      cr.reaction, cr.created_at, cr.visitor_hash,
      COALESCE(i.name, '') AS name,
      COALESCE(i.avatar, '') AS avatar,
      COALESCE(i.is_public, 0) AS is_public,
      COALESCE(i.name_key, dl.name_key, '') AS account_key,
      COALESCE(fr.selected_frame, 'level-1') AS avatar_frame
    FROM comment_reactions cr
    LEFT JOIN account_device_links dl ON dl.visitor_hash = cr.visitor_hash
    LEFT JOIN comment_identities iv ON iv.visitor_hash = cr.visitor_hash
    LEFT JOIN comment_identities i ON i.name_key = COALESCE(dl.name_key, iv.name_key)
    LEFT JOIN account_profile_rewards fr ON fr.account_key = COALESCE(dl.name_key, iv.name_key, i.name_key)
    WHERE cr.comment_id = ? AND cr.reaction = ? AND cr.visitor_hash != ?
    ORDER BY cr.created_at DESC
  `).bind(commentId, reaction, String(comment.visitor_hash || "")).all();

  const users = [];
  const seen = new Set();
  for (const row of (rows.results || [])) {
    const isPublic = !!Number(row.is_public || 0) && !!cleanName(row.name || "");
    const publicKey = isPublic && row.account_key ? `a:${row.account_key}` : "";
    const key = publicKey || `v:${row.visitor_hash || Math.random()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    users.push(cleanReactionUser(row, req));
  }

  return json({ ok: true, commentId, reaction, users }, 200, req, env);
}

async function handleCommentReaction(req, env) {
  const body = await readJson(req, 2048);
  const path = normalizePath(body.path);
  const commentId = String(body.commentId || "").trim();
  const reaction = String(body.reaction || "").trim().toLowerCase();
  if (!path || !commentId || !["like", "heart", "laugh"].includes(reaction)) return json({ ok: false, error: "Invalid reaction request" }, 400, req, env);

  const comment = await env.DB.prepare(`SELECT id, path, visitor_hash FROM comments WHERE id = ? AND path = ? AND COALESCE(deleted_at, 0) = 0`).bind(commentId, path).first();
  if (!comment) return json({ ok: false, error: "Comment not found" }, 404, req, env);

  const vh = await visitorHash(body.visitorId || "");
  if (vh && comment.visitor_hash && vh === comment.visitor_hash) {
    return json({ ok: false, error: "You cannot react to your own comment.", ownComment: true }, 403, req, env);
  }

  const existing = await env.DB.prepare(`SELECT 1 AS ok FROM comment_reactions WHERE comment_id = ? AND visitor_hash = ? AND reaction = ?`).bind(commentId, vh, reaction).first();
  let active;
  if (existing) {
    await env.DB.prepare(`DELETE FROM comment_reactions WHERE comment_id = ? AND visitor_hash = ? AND reaction = ?`).bind(commentId, vh, reaction).run();
    await bumpEngagement(env.DB, "reaction", path, path, -1);
    active = false;
  } else {
    await env.DB.prepare(`INSERT OR IGNORE INTO comment_reactions (comment_id, visitor_hash, reaction, created_at) VALUES (?, ?, ?, ?)`).bind(commentId, vh, reaction, Date.now()).run();
    await bumpEngagement(env.DB, "reaction", path, path, 1);
    await bumpUserActivity(env.DB, body.visitorId || "", "reaction_given", 1, { path, title: path, details: { commentId, reaction } });
    try {
      const owner = await env.DB.prepare(`SELECT account_key FROM comments WHERE id = ?`).bind(commentId).first();
      if (owner && owner.account_key) {
        const day = todayUTC();
        const now = Date.now();
        await bumpAccountActivity(env.DB, owner.account_key, "reaction_received", 1, { path, title: path, details: { commentId, reaction, fromVisitorHash: vh || "" } });
      }
    } catch (_) {}
    active = true;
  }
  return json({ ok: true, active }, 200, req, env);
}

/* =========================================================================
 * v2: cloud-authoritative XP / currency / rankings / shop
 *
 * Single source of truth.  The client only sends tiny append-only events and
 * displays what the server returns.  There is exactly ONE engine that turns an
 * account's event log into XP, level, the spendable EORbits balance, rankings,
 * and shop ownership.  No client-side XP math, no file merge, no sync loop.
 *
 * Tables (XP/currency/ranking/shop only; identity/pages/comments untouched):
 *   xp_events_v2  append-only event log, idempotent by (account_key, event_id)
 *   xp_state_v2   materialized totals per account (cheap reads)
 *   xp_daily_v2   per-day capped XP per account (period rankings)
 *   shop_v2       owned + equipped items per account
 * Privacy reuses the existing comment_identities.is_public column.
 * ========================================================================= */

let v2SchemaReady = false;
async function ensureV2Schema(db) {
  if (v2SchemaReady) return;
  const stmts = [
    `CREATE TABLE IF NOT EXISTS xp_events_v2 (
       account_key TEXT NOT NULL,
       event_id TEXT NOT NULL,
       metric TEXT NOT NULL,
       path TEXT DEFAULT '',
       title TEXT DEFAULT '',
       count REAL DEFAULT 1,
       value REAL DEFAULT 0,
       ts INTEGER NOT NULL,
       day TEXT NOT NULL,
       details_json TEXT DEFAULT '{}',
       created_at INTEGER NOT NULL,
       PRIMARY KEY (account_key, event_id)
     )`,
    `CREATE INDEX IF NOT EXISTS idx_xp_events_v2_acct ON xp_events_v2 (account_key, ts)`,
    `CREATE TABLE IF NOT EXISTS xp_state_v2 (
       account_key TEXT PRIMARY KEY,
       total_xp REAL DEFAULT 0,
       level INTEGER DEFAULT 1,
       currency_earned REAL DEFAULT 0,
       currency_spent REAL DEFAULT 0,
       currency_credited REAL DEFAULT 0,
       currency_balance REAL DEFAULT 0,
       updated_at INTEGER DEFAULT 0
     )`,
    `CREATE TABLE IF NOT EXISTS xp_daily_v2 (
       account_key TEXT NOT NULL,
       day TEXT NOT NULL,
       xp REAL DEFAULT 0,
       PRIMARY KEY (account_key, day)
     )`,
    `CREATE INDEX IF NOT EXISTS idx_xp_daily_v2_day ON xp_daily_v2 (day)`,
    `CREATE TABLE IF NOT EXISTS shop_v2 (
       account_key TEXT NOT NULL,
       item_id TEXT NOT NULL,
       owned INTEGER DEFAULT 1,
       equipped_slot TEXT DEFAULT '',
       acquired_at INTEGER DEFAULT 0,
       PRIMARY KEY (account_key, item_id)
     )`,
  ];
  for (const s of stmts) { try { await db.prepare(s).run(); } catch (_) {} }
  v2SchemaReady = true;
}

// Shop / currency metric semantics (the only non-earning events).
const V2_SPEND_METRICS = new Set(["shop_purchase", "shop_spend", "eorbits_spend", "shop_gift_sent"]);
const V2_CREDIT_METRICS = new Set(["shop_refund", "eorbits_credit", "currency_adjustment", "shop_gift_received"]);

function v2EventValue(ev) {
  const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
  const raw = [ev && ev.value, d.price, d.cost, d.amount, d.currencyDelta, d.eorbitsDelta]
    .find((x) => x != null && Number.isFinite(Number(x)));
  return Math.max(0, Number(raw || 0) || 0);
}

function v2ItemId(ev) {
  const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
  return String(d.itemId || d.item_id || (ev && ev.itemId) || "").trim().slice(0, 120);
}

function v2SafeDetailsJson(details) {
  try {
    const src = details && typeof details === "object" ? details : {};
    const full = JSON.stringify(src);
    if (full.length <= 20000) return full;
    const compact = Object.assign({}, src);
    if (Array.isArray(compact.dailySummary)) compact.dailySummary = compact.dailySummary.slice(-90);
    if (Array.isArray(compact.dailySummary) && JSON.stringify(compact).length > 20000) delete compact.dailySummary;
    compact.truncatedForStorage = true;
    const out = JSON.stringify(compact);
    return out.length <= 20000 ? out : JSON.stringify({
      source: compact.source || "",
      v2ImportTotalScore: !!compact.v2ImportTotalScore,
      totalScore: compact.totalScore,
      totalXp: compact.totalXp,
      currencyBalance: compact.currencyBalance,
      currencyEarned: compact.currencyEarned,
      sourceEventCount: compact.sourceEventCount,
      truncatedForStorage: true,
    });
  } catch (_) {
    return "{}";
  }
}

function v2BaselineNumber(source, keys) {
  const src = source && typeof source === "object" ? source : {};
  for (const key of keys) {
    if (src[key] == null) continue;
    const n = Number(src[key]);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function v2IsAccountScoreBaselineEvent(ev) {
  const e = ev && typeof ev === "object" ? ev : {};
  const d = e.details && typeof e.details === "object" ? e.details : {};
  const metric = String(e.metric || d.metric || e.type || "").trim().toLowerCase();
  return metric === "account_score_baseline" || metric === "account_currency_baseline";
}

function v2AccountScoreBaselineApplies(ev, nonBaselineEventCount) {
  if (!v2IsAccountScoreBaselineEvent(ev)) return false;
  const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
  if (d.v2ImportTotalScore === true || String(d.source || "") === "v2-local-score-snapshot") return true;
  const sourceCount = Number(d.sourceEventCount || d.canonicalEventCount || 0);
  const count = Math.max(0, Number(nonBaselineEventCount || 0) || 0);
  if (Number.isFinite(sourceCount) && sourceCount > 0 && count >= Math.max(0, sourceCount - 1)) return false;
  return true;
}

function v2BaselineInfo(input) {
  const rows = Array.isArray(input) ? input : [];
  const nonBaselineEventCount = rows.filter((ev) => !v2IsAccountScoreBaselineEvent(ev)).length;
  const out = { xpDelta: 0, currencyDelta: 0, xpFloor: 0, currencyFloor: 0, day: "" };
  for (const ev of rows) {
    if (!v2AccountScoreBaselineApplies(ev, nonBaselineEventCount)) continue;
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const xpDelta = v2BaselineNumber(d, ["xpDelta", "scoreDelta", "totalScoreDelta"]);
    const currencyDelta = v2BaselineNumber(d, ["currencyDelta", "eorbitsDelta", "balanceDelta"]);
    const xpFloor = v2BaselineNumber(d, ["totalScore", "totalXp", "score", "canonicalTotalScore", "v2TotalScore"]);
    const currencyFloor = v2BaselineNumber(d, ["currencyBalance", "eorbits", "canonicalCurrencyBalance", "v2CurrencyBalance"]);
    out.xpDelta += Number.isFinite(xpDelta) ? xpDelta : 0;
    out.currencyDelta += Number.isFinite(currencyDelta) ? currencyDelta : 0;
    if (Number.isFinite(xpFloor) && xpFloor > out.xpFloor) out.xpFloor = xpFloor;
    if (Number.isFinite(currencyFloor) && currencyFloor > out.currencyFloor) out.currencyFloor = currencyFloor;
    if (!out.day) out.day = dayUTCFromTimestamp(ev && ev.ts || Date.now());
  }
  out.xpDelta = roundScore(out.xpDelta);
  out.currencyDelta = roundScore(out.currencyDelta);
  out.xpFloor = roundScore(out.xpFloor);
  out.currencyFloor = roundScore(out.currencyFloor);
  return out;
}

function v2BaselineSnapshotFromEvents(events) {
  const rows = Array.isArray(events) ? events : [];
  let best = null;
  for (const evRaw of rows) {
    const ev = evRaw && typeof evRaw === "object" ? evRaw : {};
    const details = ev.details && typeof ev.details === "object" ? ev.details : eventDetailsFromRow(ev);
    if (!v2IsAccountScoreBaselineEvent(Object.assign({}, ev, { details }))) continue;
    const total = v2BaselineNumber(details, ["totalScore", "totalXp", "score", "canonicalTotalScore", "v2TotalScore"]);
    const xpDelta = v2BaselineNumber(details, ["xpDelta", "scoreDelta", "totalScoreDelta"]);
    const currencyBalance = v2BaselineNumber(details, ["currencyBalance", "eorbits", "canonicalCurrencyBalance", "v2CurrencyBalance"]);
    const currencyEarned = v2BaselineNumber(details, ["currencyEarned", "totalCurrencyEarned"]);
    const usableTotal = total > 0 ? total : xpDelta;
    if (!(usableTotal > 0)) continue;
    const ts = Number(normaliseTimestamp(ev.ts || ev.createdAt || ev.created_at || ev.created_at || Date.now()) || Date.now());
    const dailyRows = [];
    const daily = Array.isArray(details.dailySummary) ? details.dailySummary : [];
    for (const row of daily) {
      const r = row && typeof row === "object" ? row : {};
      const day = String(r.day || "").slice(0, 10);
      const xp = Number(r.score != null ? r.score : (r.total != null ? r.total : r.xp));
      if (day && Number.isFinite(xp) && xp > 0) dailyRows.push({ day, xp: roundScore(xp) });
    }
    const snap = {
      totalXp: roundScore(usableTotal),
      currencyEarned: roundScore(Math.max(currencyEarned || 0, usableTotal)),
      currencyBalance: roundScore(Math.max(currencyBalance || 0, usableTotal)),
      ts,
      day: dayUTCFromTimestamp(ts),
      dailyRows,
    };
    if (!best || snap.totalXp > best.totalXp || (snap.totalXp === best.totalXp && snap.ts > best.ts)) best = snap;
  }
  return best;
}

async function v2StatePayloadFromMaterialized(db, accountKey, fallbackState = null) {
  const key = String(accountKey || "").trim();
  const row = await db.prepare(`SELECT * FROM xp_state_v2 WHERE account_key = ?`).bind(key).first().catch(() => null);
  const total = roundScore(row && row.total_xp != null ? row.total_xp : (fallbackState && fallbackState.totalXp || 0));
  const shopRes = await db.prepare(`SELECT item_id, owned, equipped_slot FROM shop_v2 WHERE account_key = ?`).bind(key).all().catch(() => null);
  const owned = [];
  const equipped = {};
  for (const s of (shopRes && shopRes.results) || []) {
    if (Number(s.owned || 0) > 0) owned.push(s.item_id);
    if (s.equipped_slot) equipped[s.equipped_slot] = s.item_id;
  }
  const dailyRes = await db.prepare(`SELECT day, xp FROM xp_daily_v2 WHERE account_key = ? ORDER BY day DESC LIMIT 90`).bind(key).all().catch(() => null);
  const currentCap = userDailyXpCapForTotal(total);
  const dailySummary = ((dailyRes && dailyRes.results) || []).slice().reverse().map((d) => {
    const score = roundScore(d.xp || 0);
    return {
      day: String(d.day || ""),
      count: score > 0 ? 1 : 0,
      rawScore: score,
      scoreBeforeDailyCap: score,
      score,
      currencyEarned: score,
      currency: score,
      dailyCap: currentCap,
      dailyCapReached: currentCap > 0 && score >= currentCap - 0.05,
      dailyCapApplied: currentCap > 0 && score >= currentCap - 0.05,
      metrics: {},
      currencyMetrics: {},
    };
  });
  const countRow = await db.prepare(`SELECT COUNT(*) AS n FROM xp_events_v2 WHERE account_key = ?`).bind(key).first().catch(() => null);
  return v2StatePayload({
    totalXp: total,
    level: Number(row && row.level || userLevel(total)),
    levelProgress: userLevelProgress(total),
    currencyEarned: roundScore(row && row.currency_earned || total),
    currencySpent: roundScore(row && row.currency_spent || 0),
    currencyCredited: roundScore(row && row.currency_credited || 0),
    currencyBalance: roundScore(row && row.currency_balance || total),
    owned: owned.sort(),
    equipped,
  }, { dailySummary, eventCount: Number(countRow && countRow.n || fallbackState && fallbackState.eventCount || 0), updatedAt: Number(row && row.updated_at || Date.now()) });
}

async function v2PersistBaselineSnapshot(db, accountKey, events) {
  const key = String(accountKey || "").trim();
  const snap = v2BaselineSnapshotFromEvents(events);
  if (!key || !snap || !(snap.totalXp > 0)) return null;
  const existing = await db.prepare(`SELECT * FROM xp_state_v2 WHERE account_key = ?`).bind(key).first().catch(() => null);
  const total = roundScore(Math.max(Number(existing && existing.total_xp || 0), snap.totalXp));
  const earned = roundScore(Math.max(Number(existing && existing.currency_earned || 0), snap.currencyEarned || total, total));
  const balance = roundScore(Math.max(Number(existing && existing.currency_balance || 0), snap.currencyBalance || earned));
  const spent = roundScore(Number(existing && existing.currency_spent || 0));
  const credited = roundScore(Number(existing && existing.currency_credited || 0));
  const now = Date.now();
  await db.prepare(
    `INSERT INTO xp_state_v2 (account_key, total_xp, level, currency_earned, currency_spent, currency_credited, currency_balance, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(account_key) DO UPDATE SET
       total_xp=CASE WHEN excluded.total_xp > xp_state_v2.total_xp THEN excluded.total_xp ELSE xp_state_v2.total_xp END,
       level=CASE WHEN excluded.level > xp_state_v2.level THEN excluded.level ELSE xp_state_v2.level END,
       currency_earned=CASE WHEN excluded.currency_earned > xp_state_v2.currency_earned THEN excluded.currency_earned ELSE xp_state_v2.currency_earned END,
       currency_spent=CASE WHEN excluded.currency_spent > xp_state_v2.currency_spent THEN excluded.currency_spent ELSE xp_state_v2.currency_spent END,
       currency_credited=CASE WHEN excluded.currency_credited > xp_state_v2.currency_credited THEN excluded.currency_credited ELSE xp_state_v2.currency_credited END,
       currency_balance=CASE WHEN excluded.currency_balance > xp_state_v2.currency_balance THEN excluded.currency_balance ELSE xp_state_v2.currency_balance END,
       updated_at=excluded.updated_at`
  ).bind(key, total, userLevel(total), earned, spent, credited, balance, now).run().catch(() => null);
  let rows = snap.dailyRows && snap.dailyRows.length ? snap.dailyRows : [{ day: snap.day || todayUTC(), xp: total }];
  rows = rows.filter((r) => r && r.day && Number(r.xp || 0) > 0).slice(-180);
  for (const r of rows) {
    await db.prepare(
      `INSERT INTO xp_daily_v2 (account_key, day, xp) VALUES (?, ?, ?)
       ON CONFLICT(account_key, day) DO UPDATE SET xp=CASE WHEN excluded.xp > xp_daily_v2.xp THEN excluded.xp ELSE xp_daily_v2.xp END`
    ).bind(key, r.day, roundScore(r.xp)).run().catch(() => null);
  }
  return v2StatePayloadFromMaterialized(db, key, { totalXp: total });
}

/**
 * THE engine.  Folds an account's event rows into XP / currency / shop state.
 * rows: [{ event_id, metric, path, title, count, value, ts, details }]
 * Mirrors the legacy cap + repeat-discount semantics, but EORbits earned is
 * tied 1:1 to capped XP so there is a single, drift-free number ("just
 * addition"): balance = xp_earned + credits - spends.
 */
function computeAccountV2(rows) {
  const input = (Array.isArray(rows) ? rows.slice() : []).map((r) => ({
    id: String(r.event_id || r.id || ""),
    metric: String(r.metric || ""),
    path: normalizePath(r.path || ""),
    title: cleanTitle(r.title || "", r.path || ""),
    count: r.count,
    value: r,
    ts: Number(normaliseTimestamp(r.ts || r.created_at || 0) || 0),
    details: r.details && typeof r.details === "object" ? r.details : eventDetailsFromRow(r),
  }));
  input.sort((a, b) => a.ts - b.ts || String(a.id).localeCompare(String(b.id)));
  const baseline = v2BaselineInfo(input);

  // --- currency spends/credits + shop ownership (separate from XP) ---
  let currencySpent = 0;
  let currencyCredited = 0;
  const owned = new Set();
  const equipped = {};
  for (const ev of input) {
    const m = String(ev.metric || "").toLowerCase();
    const itemId = v2ItemId(ev);
    const value = v2EventValue(ev.value);
    if (V2_SPEND_METRICS.has(m)) currencySpent += value;
    if (V2_CREDIT_METRICS.has(m)) currencyCredited += value;
    if (!itemId) continue;
    if (m === "shop_purchase" || m === "shop_gift_received") owned.add(itemId);
    if (m === "shop_refund" || m === "shop_revoke") owned.delete(itemId);
    if (m === "shop_equip") {
      const slot = String((ev.details && (ev.details.slot || ev.details.slotId)) || "").trim();
      if (slot) equipped[slot] = itemId;
    }
  }
  Object.keys(equipped).forEach((slot) => {
    if (equipped[slot] !== "default" && !owned.has(equipped[slot])) delete equipped[slot];
  });

  // --- XP fold (per metric daily cap, then overall daily cap) ---
  const repeatSeen = new Set();
  const oneTimeSeen = new Set();
  const aiQuizSeen = new Set();
  const replaySeen = new Set();
  const masteryByConcept = new Map();
  const eventsByDay = new Map();
  const explicitActiveDays = new Set();

  for (const ev of input) {
    const rawMetric = ev.metric;
    const m = activityMetric(rawMetric);
    if (!m) continue; // shop/currency/unknown metrics earn no XP
    const details = ev.details;
    const createdAt = ev.ts || Date.now();
    const day = dayUTCFromTimestamp(createdAt);
    const path = ev.path;

    if (m === "ai_quiz") {
      if (!aiQuizCompletionSignal(rawMetric, details)) continue;
      const aiKey = aiQuizActivityDedupeKey({ id: ev.id, created_at: createdAt }, details, path, createdAt);
      if (aiKey && aiQuizSeen.has(aiKey)) continue;
      if (aiKey) aiQuizSeen.add(aiKey);
    }
    if (m === "view" || m === "mastery" || m === "saved_page_action") {
      const semantic = m === "mastery"
        ? String(details.mastery != null ? details.mastery : details.m != null ? details.m : details.level != null ? details.level : "")
        : m === "saved_page_action"
          ? String(details.action || details.savedAction || "")
          : String(details.visitId || details.visit_id || "");
      const bucket = m === "view" ? Math.floor(Number(createdAt || 0) / 5000) : Number(createdAt || 0);
      const replayKey = `${m}:${path}:${bucket}:${semantic}`;
      if (replaySeen.has(replayKey)) continue;
      replaySeen.add(replayKey);
      if (m === "mastery" && path) {
        const n = Number(semantic);
        if ([0, 1, 2, 3].includes(n)) {
          const prev = masteryByConcept.has(path) ? masteryByConcept.get(path) : null;
          if (prev != null && Number(prev) === n && !truthyDetailsFlag(details.forceCount || details.force_count)) continue;
          masteryByConcept.set(path, n);
        }
      }
    }
    if (m === "map_open" && !mapOpenSignal(rawMetric, details)) continue;
    if (m === "panel_open" && !panelOpenSignal(rawMetric, details)) continue;

    let count = m === "ai_quiz" ? 1 : Math.max(0, Number(ev.count == null ? 1 : ev.count) || 0);
    if (!count) continue;
    if (activityOneTime(m)) {
      if (oneTimeSeen.has(m)) continue;
      oneTimeSeen.add(m);
      count = 1;
    }

    const baseXp = activityXp(m);
    const repeatDiscount = repeatDiscountForMetric(m);
    const repeatGroup = repeatGroupForMetric(m);
    const conceptKey = repeatGroup ? eventRepeatKey(m, path, details) : "";
    const forceRepeat = repeatGroup && conceptKey && truthyDetailsFlag(details.forceRepeat || details.force_repeat || details.repeatOnly || details.repeat_only);
    let firstUnits = count;
    let repeatUnits = 0;
    if (conceptKey && repeatDiscount < 0.999999) {
      const seenKey = `${repeatGroup}:${conceptKey}`;
      if (forceRepeat || repeatSeen.has(seenKey)) { firstUnits = 0; repeatUnits = count; }
      else { firstUnits = Math.min(1, count); repeatUnits = Math.max(0, count - firstUnits); }
      repeatSeen.add(seenKey);
    }
    const adjusted = baseXp * (firstUnits + repeatUnits * repeatDiscount);

    if (m === "active_day") explicitActiveDays.add(day);
    if (!eventsByDay.has(day)) eventsByDay.set(day, []);
    eventsByDay.get(day).push({ metric: m, adjusted });
  }

  // Synthetic active_day for any day with earning activity but no explicit one.
  for (const day of Array.from(eventsByDay.keys())) {
    if (explicitActiveDays.has(day)) continue;
    eventsByDay.get(day).push({ metric: "active_day", adjusted: activityXp("active_day") });
  }

  let totalXp = 0;
  const perDay = {};
  for (const day of Array.from(eventsByDay.keys()).sort()) {
    const entries = eventsByDay.get(day);
    const byMetric = new Map();
    for (const x of entries) byMetric.set(x.metric, (byMetric.get(x.metric) || 0) + x.adjusted);
    let dayBeforeOverall = 0;
    for (const [metric, sum] of byMetric.entries()) {
      const rule = USER_ACTIVITY_RULES[metric];
      const cap = rule && Number.isFinite(rule.dailyCap) ? rule.dailyCap : Infinity;
      dayBeforeOverall += sum > cap ? cap : sum;
    }
    const overallCap = userDailyXpCapForTotal(totalXp);
    const dayScore = dayBeforeOverall > overallCap ? overallCap : dayBeforeOverall;
    perDay[day] = roundScore(dayScore);
    totalXp += dayScore;
  }
  const activityTotalXp = roundScore(totalXp);
  const baselineDailyXp = Math.max(0, baseline.xpDelta) + Math.max(0, Number(baseline.xpFloor || 0) - (activityTotalXp + Math.max(0, baseline.xpDelta)));
  totalXp = roundScore(Math.max(activityTotalXp + baseline.xpDelta, baseline.xpFloor || 0));
  if (baselineDailyXp > 0) {
    const day = baseline.day || todayUTC();
    perDay[day] = roundScore((Number(perDay[day] || 0) || 0) + baselineDailyXp);
  }

  const currencyEarned = roundScore(Math.max(totalXp, activityTotalXp + baseline.currencyDelta, baseline.currencyFloor || 0)); // EORbits earned == XP earned unless a legacy baseline preserved more.
  const currencyBalance = roundScore(Math.max(0, currencyEarned + roundScore(currencyCredited) - roundScore(currencySpent), baseline.currencyFloor || 0));
  const progress = userLevelProgress(totalXp);

  return {
    totalXp,
    level: progress.level,
    levelProgress: progress,
    perDay,
    currencyEarned,
    currencySpent: roundScore(currencySpent),
    currencyCredited: roundScore(currencyCredited),
    currencyBalance,
    owned: Array.from(owned.values()).sort(),
    equipped,
    eventCount: input.length,
  };
}

async function readV2Events(db, accountKey) {
  const res = await db.prepare(
    `SELECT event_id, metric, path, title, count, value, ts, details_json FROM xp_events_v2 WHERE account_key = ? ORDER BY ts ASC`
  ).bind(accountKey).all().catch(() => null);
  return (res && res.results) ? res.results : [];
}

// Recompute the account from its event log and persist materialized state.
async function recomputeAndPersistV2(db, accountKey) {
  const rows = await readV2Events(db, accountKey);
  const state = computeAccountV2(rows);
  const now = Date.now();
  await db.prepare(
    `INSERT INTO xp_state_v2 (account_key, total_xp, level, currency_earned, currency_spent, currency_credited, currency_balance, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(account_key) DO UPDATE SET total_xp=excluded.total_xp, level=excluded.level,
       currency_earned=excluded.currency_earned, currency_spent=excluded.currency_spent,
       currency_credited=excluded.currency_credited, currency_balance=excluded.currency_balance,
       updated_at=excluded.updated_at`
  ).bind(accountKey, state.totalXp, state.level, state.currencyEarned, state.currencySpent, state.currencyCredited, state.currencyBalance, now).run().catch(() => null);

  await db.prepare(`DELETE FROM xp_daily_v2 WHERE account_key = ?`).bind(accountKey).run().catch(() => null);
  const dayRows = Object.keys(state.perDay).filter((d) => Number(state.perDay[d] || 0) > 0);
  if (dayRows.length) {
    const batch = dayRows.map((d) => db.prepare(`INSERT INTO xp_daily_v2 (account_key, day, xp) VALUES (?, ?, ?)`).bind(accountKey, d, state.perDay[d]));
    try { await db.batch(batch); } catch (_) {
      for (const st of batch) { try { await st.run(); } catch (__) {} }
    }
  }

  await db.prepare(`DELETE FROM shop_v2 WHERE account_key = ?`).bind(accountKey).run().catch(() => null);
  if (state.owned.length || Object.keys(state.equipped).length) {
    const slotByItem = {};
    Object.keys(state.equipped).forEach((slot) => { slotByItem[state.equipped[slot]] = slot; });
    const items = new Set([...state.owned, ...Object.values(state.equipped)]);
    const batch = Array.from(items).filter(Boolean).map((id) =>
      db.prepare(`INSERT INTO shop_v2 (account_key, item_id, owned, equipped_slot, acquired_at) VALUES (?, ?, ?, ?, ?)`)
        .bind(accountKey, id, state.owned.includes(id) ? 1 : 0, slotByItem[id] || "", now));
    try { await db.batch(batch); } catch (_) {
      for (const st of batch) { try { await st.run(); } catch (__) {} }
    }
  }
  return state;
}

// Normalize one incoming client event into a row we can store.
function v2NormalizeIncomingEvent(raw, accountKey, now) {
  if (!raw || typeof raw !== "object") return null;
  const metric = String(raw.metric || raw.type || "").trim().toLowerCase().slice(0, 64);
  if (!metric) return null;
  const ts = Number(normaliseTimestamp(raw.ts || raw.createdAt || raw.created_at || now) || now);
  const details = raw.details && typeof raw.details === "object" ? raw.details : {};
  let eventId = String(raw.id || raw.event_id || "").trim().slice(0, 220);
  if (!eventId) eventId = `${metric}:${ts}:${Math.random().toString(36).slice(2, 10)}`;
  return {
    event_id: eventId,
    metric,
    path: normalizePath(raw.path || "").slice(0, 300),
    title: cleanTitle(raw.title || "", raw.path || "").slice(0, 300),
    count: Math.max(0, Number(raw.count == null ? 1 : raw.count) || 0),
    value: v2EventValue({ value: raw.value, details }),
    ts,
    day: dayUTCFromTimestamp(ts),
    details_json: v2SafeDetailsJson(details),
    created_at: now,
  };
}

async function v2InsertEvents(db, accountKey, events, opts = {}) {
  const now = Date.now();
  const limit = Math.max(1, Math.min(5000, Math.floor(Number(opts.limit || 200) || 200)));
  const rows = (Array.isArray(events) ? events : [events])
    .map((e) => v2NormalizeIncomingEvent(e, accountKey, now))
    .filter(Boolean)
    .slice(0, limit);
  let accepted = 0;
  for (const r of rows) {
    const res = await db.prepare(
      `INSERT OR IGNORE INTO xp_events_v2 (account_key, event_id, metric, path, title, count, value, ts, day, details_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(accountKey, r.event_id, r.metric, r.path, r.title, r.count, r.value, r.ts, r.day, r.details_json, r.created_at).run().catch(() => null);
    accepted += Number(res && res.meta && res.meta.changes || 0);
  }
  return { accepted, count: rows.length };
}

function v2DailySummaryFromPerDay(perDay, totalXp) {
  const source = perDay && typeof perDay === "object" ? perDay : {};
  const currentCap = userDailyXpCapForTotal(totalXp || 0);
  return Object.keys(source)
    .sort()
    .slice(-90)
    .map((day) => {
      const score = roundScore(source[day] || 0);
      return {
        day,
        count: score > 0 ? 1 : 0,
        rawScore: score,
        scoreBeforeDailyCap: score,
        score,
        currencyEarned: score,
        currency: score,
        dailyCap: currentCap,
        dailyCapReached: currentCap > 0 && score >= currentCap - 0.05,
        dailyCapApplied: currentCap > 0 && score >= currentCap - 0.05,
        metrics: {},
        currencyMetrics: {},
      };
    });
}

function v2StatePayload(state, extras = {}) {
  const totalXp = roundScore(state.totalXp || 0);
  const dailySummary = Array.isArray(extras.dailySummary) ? extras.dailySummary : v2DailySummaryFromPerDay(state.perDay, totalXp);
  const today = todayUTC();
  const todayXp = dailySummary.find((row) => String(row && row.day || "") === today) || {
    day: today,
    count: 0,
    rawScore: 0,
    scoreBeforeDailyCap: 0,
    score: 0,
    currencyEarned: 0,
    currency: 0,
    dailyCap: userDailyXpCapForTotal(totalXp),
    metrics: {},
    currencyMetrics: {},
  };
  const progress = state.levelProgress || userLevelProgress(totalXp);
  const thresholds = userLevelThresholdsForClient();
  return {
    totalXp,
    totalScore: totalXp,
    score: totalXp,
    level: state.level || progress.level,
    levelProgress: progress,
    levelThresholds: thresholds,
    thresholds,
    maxLevel: thresholds.length,
    dailyCap: userDailyXpCapForTotal(totalXp),
    todayDay: today,
    todayXp,
    dailySummary,
    breakdown: [],
    rules: xpRulesForClient(),
    currencyName: "EORbits",
    currencySingular: "EORbit",
    currencyEarned: roundScore(state.currencyEarned || totalXp),
    totalCurrencyEarned: roundScore(state.currencyEarned || totalXp),
    currencyCredited: roundScore(state.currencyCredited || 0),
    currencySpent: roundScore(state.currencySpent || 0),
    currencyBalance: roundScore(state.currencyBalance || 0),
    eorbits: roundScore(state.currencyBalance || 0),
    owned: Array.isArray(state.owned) ? state.owned : [],
    equipped: state.equipped && typeof state.equipped === "object" ? state.equipped : {},
    eventCount: Number(extras.eventCount != null ? extras.eventCount : state.eventCount || 0) || 0,
    updatedAt: Number(extras.updatedAt || Date.now()) || Date.now(),
    isCompleteXp: true,
    sourceEvents: true,
    source: "Cloud XP v2 canonical state",
  };
}

function v2EventFromLegacyAccountFileEvent(ev, index) {
  if (!ev || typeof ev !== "object") return null;
  const metric = String(ev.metric || ev.type || "").trim().toLowerCase();
  if (!metric) return null;
  const details = ev.details && typeof ev.details === "object" ? ev.details : {};
  if (v2IsAccountScoreBaselineEvent({ metric, type: ev.type, details })) {
    return {
      id: String(ev.id || `${metric}:${ev.ts || ev.createdAt || index}`),
      metric,
      ts: Number(normaliseTimestamp(ev.ts || ev.createdAt || ev.created_at || Date.now()) || Date.now()),
      count: 1,
      path: ev.path || details.path || "",
      title: ev.title || details.title || "Account score baseline",
      value: ev.value != null ? ev.value : details.value,
      details,
    };
  }
  if (!activityMetric(metric) && !V2_SPEND_METRICS.has(metric) && !V2_CREDIT_METRICS.has(metric) && metric !== "shop_equip" && metric !== "shop_revoke") return null;
  return {
    id: String(ev.id || `${metric}:${ev.ts || ev.createdAt || index}`),
    metric,
    ts: Number(normaliseTimestamp(ev.ts || ev.createdAt || ev.created_at || Date.now()) || Date.now()),
    count: ev.count == null ? 1 : Number(ev.count),
    path: ev.path || details.path || details.conceptId || "",
    title: ev.title || details.title || "",
    value: ev.value != null ? ev.value : details.value,
    details,
  };
}

async function seedV2FromLegacyAccountFile(db, accountKey) {
  const key = String(accountKey || "").trim();
  if (!key) return { seeded: false, accepted: 0, received: 0 };
  const existing = await db.prepare(`SELECT COUNT(*) AS n FROM xp_events_v2 WHERE account_key = ?`).bind(key).first().catch(() => null);
  if (Number(existing && existing.n || 0) > 0) return { seeded: false, accepted: 0, received: Number(existing && existing.n || 0) };
  const snap = await readOrSeedAccountEventFileSnapshot(db, key).catch(() => null);
  const file = snap && snap.file ? normaliseAccountEventFile(snap.file) : normaliseAccountEventFile({ eventLog: [] });
  const events = (Array.isArray(file.eventLog) ? file.eventLog : [])
    .map((ev, index) => v2EventFromLegacyAccountFileEvent(ev, index))
    .filter(Boolean);
  if (!events.length) return { seeded: false, accepted: 0, received: 0 };
  let accepted = 0;
  let received = 0;
  for (let i = 0; i < events.length; i += 5000) {
    const ins = await v2InsertEvents(db, key, events.slice(i, i + 5000), { limit: 5000 });
    accepted += Number(ins.accepted || 0);
    received += Number(ins.count || 0);
  }
  return { seeded: true, accepted, received, legacyEventCount: events.length };
}

async function handleV2Event(req, env) {
  await ensureV2Schema(env.DB);
  let body = {};
  try { body = await req.json(); } catch (_) { body = {}; }
  const acc = await resolveAccount(env.DB, body.visitorId || body.visitor_id || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const events = body.events || body.event || [];
  const ins = await v2InsertEvents(env.DB, acc.accountKey, events);
  const state = await recomputeAndPersistV2(env.DB, acc.accountKey);
  return json({ ok: true, accountKey: acc.accountKey, accepted: ins.accepted, received: ins.count, state: v2StatePayload(state) }, 200, req, env);
}

async function handleV2State(req, env, url) {
  await ensureV2Schema(env.DB);
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const forceRecompute = /^(1|true|yes)$/i.test(String(url.searchParams.get("recompute") || ""));
  // Materialized read; recompute if no state row exists yet.
  let row = await env.DB.prepare(`SELECT * FROM xp_state_v2 WHERE account_key = ?`).bind(acc.accountKey).first().catch(() => null);
  const existingCount = await env.DB.prepare(`SELECT COUNT(*) AS n FROM xp_events_v2 WHERE account_key = ?`).bind(acc.accountKey).first().catch(() => null);
  const eventCount = Number(existingCount && existingCount.n || 0) || 0;
  if (!row) {
    if (eventCount <= 0) await seedV2FromLegacyAccountFile(env.DB, acc.accountKey).catch(() => null);
    const state = await recomputeAndPersistV2(env.DB, acc.accountKey);
    return json({ ok: true, accountKey: acc.accountKey, state: v2StatePayload(state, { eventCount: state.eventCount }) }, 200, req, env);
  }
  if (forceRecompute || Number(row.total_xp || 0) <= 0) {
    const baselineRows = await env.DB.prepare(
      `SELECT event_id, metric, path, title, count, value, ts, details_json FROM xp_events_v2 WHERE account_key = ? AND metric IN ('account_score_baseline','account_currency_baseline') ORDER BY ts DESC LIMIT 20`
    ).bind(acc.accountKey).all().catch(() => null);
    const baselineState = await v2PersistBaselineSnapshot(env.DB, acc.accountKey, (baselineRows && baselineRows.results) || []).catch(() => null);
    if (baselineState && Number(baselineState.totalXp || baselineState.totalScore || baselineState.score || 0) > 0) {
      return json({ ok: true, accountKey: acc.accountKey, recomputed: false, baselineApplied: true, state: baselineState }, 200, req, env);
    }
    if (eventCount <= 0) {
      const seeded = await seedV2FromLegacyAccountFile(env.DB, acc.accountKey).catch(() => null);
      if (seeded && Number(seeded.accepted || 0) > 0) {
        const state = await recomputeAndPersistV2(env.DB, acc.accountKey);
        return json({ ok: true, accountKey: acc.accountKey, state: v2StatePayload(state, { eventCount: state.eventCount }) }, 200, req, env);
      }
    } else {
      const state = await recomputeAndPersistV2(env.DB, acc.accountKey);
      return json({ ok: true, accountKey: acc.accountKey, recomputed: true, state: v2StatePayload(state, { eventCount: state.eventCount }) }, 200, req, env);
    }
  }
  const shopRes = await env.DB.prepare(`SELECT item_id, owned, equipped_slot FROM shop_v2 WHERE account_key = ?`).bind(acc.accountKey).all().catch(() => null);
  const owned = [];
  const equipped = {};
  for (const s of (shopRes && shopRes.results) || []) {
    if (Number(s.owned || 0) > 0) owned.push(s.item_id);
    if (s.equipped_slot) equipped[s.equipped_slot] = s.item_id;
  }
  const total = Number(row.total_xp || 0);
  const dailyRes = await env.DB.prepare(
    `SELECT day, xp FROM xp_daily_v2 WHERE account_key = ? ORDER BY day DESC LIMIT 90`
  ).bind(acc.accountKey).all().catch(() => null);
  const currentCap = userDailyXpCapForTotal(total);
  const dailySummary = ((dailyRes && dailyRes.results) || []).slice().reverse().map((d) => {
    const score = roundScore(d.xp || 0);
    return {
      day: String(d.day || ""),
      count: score > 0 ? 1 : 0,
      rawScore: score,
      scoreBeforeDailyCap: score,
      score,
      currencyEarned: score,
      currency: score,
      dailyCap: currentCap,
      dailyCapReached: currentCap > 0 && score >= currentCap - 0.05,
      dailyCapApplied: currentCap > 0 && score >= currentCap - 0.05,
      metrics: {},
      currencyMetrics: {},
    };
  });
  return json({
    ok: true, accountKey: acc.accountKey,
    state: v2StatePayload({
      totalXp: roundScore(total),
      level: Number(row.level || userLevel(total)),
      levelProgress: userLevelProgress(total),
      currencyEarned: roundScore(row.currency_earned || 0),
      currencySpent: roundScore(row.currency_spent || 0),
      currencyCredited: roundScore(row.currency_credited || 0),
      currencyBalance: roundScore(row.currency_balance || 0),
      owned: owned.sort(),
      equipped,
    }, { dailySummary, eventCount, updatedAt: Number(row.updated_at || Date.now()) }),
  }, 200, req, env);
}

function v2RankingWindowStart(period) {
  const p = String(period || "").toLowerCase();
  if (p === "all") return null;
  if (p === "daily" || p === "today") return todayUTC();
  const days = (p === "monthly" || p === "30d") ? 29 : 6; // weekly/7d default
  return new Date(Date.now() - days * 86400 * 1000).toISOString().slice(0, 10);
}

function v2RankingPeriodParam(period) {
  const p = String(period || "").toLowerCase();
  if (p === "daily" || p === "today") return "daily";
  if (p === "weekly" || p === "7d") return "weekly";
  if (p === "monthly" || p === "30d") return "monthly";
  return "all";
}

function v2LegacyRankingPeriod(period) {
  const p = v2RankingPeriodParam(period);
  if (p === "daily") return "today";
  if (p === "monthly") return "30d";
  if (p === "weekly") return "7d";
  return "all";
}

async function getLegacyAggregateRankingScores(db, period, start) {
  const out = new Map();
  let res = null;
  try {
    if (String(period || "") === "all") {
      res = await db.prepare(`
        SELECT account_key, SUM(score) AS score
        FROM user_activity_totals
        WHERE account_key IS NOT NULL AND account_key != ''
        GROUP BY account_key
        HAVING SUM(score) > 0
      `).all();
    } else if (start) {
      res = await db.prepare(`
        SELECT account_key, SUM(score) AS score
        FROM user_activity_daily
        WHERE day >= ? AND account_key IS NOT NULL AND account_key != ''
        GROUP BY account_key
        HAVING SUM(score) > 0
      `).bind(start).all();
    }
  } catch (_) {
    res = null;
  }
  for (const r of ((res && res.results) || [])) {
    const key = String(r && r.account_key || "").trim();
    const score = roundScore(r && r.score || 0);
    if (key && score > 0) out.set(key, score);
  }
  return out;
}

async function handleV2Rankings(req, env, url) {
  await ensureV2Schema(env.DB);
  const period = v2RankingPeriodParam(url.searchParams.get("period") || "all");
  const limit = clampInt(url.searchParams.get("limit"), 1, 100, 50);
  const offset = clampInt(url.searchParams.get("offset"), 0, 100000, 0);
  const start = v2RankingWindowStart(period);
  const acc = await resolveAccount(env.DB, url.searchParams.get("visitorId") || "", req).catch(() => ({ accountKey: "" }));

  // Sum capped daily XP over the window per account (all-time uses materialized total).
  let scoreRes = null;
  try {
    if (start == null) {
      scoreRes = await env.DB.prepare(`SELECT account_key, total_xp AS score FROM xp_state_v2 WHERE total_xp > 0`).all();
    } else {
      scoreRes = await env.DB.prepare(`SELECT account_key, SUM(xp) AS score FROM xp_daily_v2 WHERE day >= ? GROUP BY account_key HAVING SUM(xp) > 0`).bind(start).all();
    }
  } catch (_) {
    scoreRes = null;
  }
  const scoreMap = new Map();
  for (const r of ((scoreRes && scoreRes.results) || [])) {
    const key = String(r.account_key || "").trim();
    if (!key) continue;
    scoreMap.set(key, { accountKey: key, score: roundScore(r.score || 0), source: "xp_state_v2" });
  }

  // Migration bridge: older cloud accounts may only have the account-event-file
  // projection populated.  Merge that server-side projection into /v2/rankings
  // until every account has been materialized into xp_*_v2.  This prevents the
  // public leaderboard from looking empty during the v2 rollout.
  const legacyPeriod = v2LegacyRankingPeriod(period);
  const legacyProjections = await getAllUserXpRankingProjections(env.DB, legacyPeriod, { skipSqlFallback: true }).catch(() => new Map());
  for (const [keyRaw, projection] of legacyProjections.entries()) {
    const key = String(keyRaw || "").trim();
    if (!key || !projection) continue;
    const total = roundScore(projection.totalScore || 0);
    const score = legacyPeriod === "all" ? total : userRankingPeriodScoreFromDailyScores(projection.dailyScores, legacyPeriod);
    if (score <= 0) continue;
    const old = scoreMap.get(key);
    if (start == null || !old || score > Number(old.score || 0)) {
      scoreMap.set(key, {
        accountKey: key,
        score: roundScore(score),
        totalScore: total,
        level: userLevel(total),
        equippedCosmetics: projection.equippedCosmetics || {},
        source: projection.source || "legacy_projection_bridge",
      });
    }
  }
  const legacyAggregateScores = await getLegacyAggregateRankingScores(env.DB, period, start).catch(() => new Map());
  for (const [key, score] of legacyAggregateScores.entries()) {
    if (!scoreMap.has(key)) {
      scoreMap.set(key, { accountKey: key, score, totalScore: score, level: userLevel(score), equippedCosmetics: {}, source: "legacy aggregate ranking fallback" });
    }
  }
  const scores = Array.from(scoreMap.values());

  // Attach identity + public flag + true level; rank only public accounts, but
  // always tell the caller their own rank even when private.
  const keys = scores.map((s) => s.accountKey);
  const idMap = new Map();
  const levelMap = new Map();
  const totalMap = new Map();
  if (keys.length) {
    const res = await env.DB.prepare(
      `SELECT name_key, name, avatar, bio, COALESCE(is_public,0) AS is_public FROM comment_identities WHERE name_key IN (${sqlPlaceholders(keys)})`
    ).bind(...keys).all().catch(() => null);
    for (const r of (res && res.results) || []) idMap.set(String(r.name_key), r);
    const lv = await env.DB.prepare(
      `SELECT account_key, total_xp, level FROM xp_state_v2 WHERE account_key IN (${sqlPlaceholders(keys)})`
    ).bind(...keys).all().catch(() => null);
    for (const r of (lv && lv.results) || []) {
      totalMap.set(String(r.account_key), roundScore(r.total_xp || 0));
      levelMap.set(String(r.account_key), Number(r.level || userLevel(r.total_xp || 0)));
    }
  }
  for (const [keyRaw, projection] of legacyProjections.entries()) {
    const key = String(keyRaw || "").trim();
    const total = roundScore(projection && projection.totalScore || 0);
    if (key && total > 0) {
      totalMap.set(key, total);
      levelMap.set(key, userLevel(total));
    }
  }
  for (const s of scores) {
    if (s.totalScore != null) totalMap.set(s.accountKey, roundScore(s.totalScore || 0));
    if (s.level != null) levelMap.set(s.accountKey, Number(s.level || 1));
  }
  // Leaderboard visibility is governed by the ranking setting, which DEFAULTS TO
  // PUBLIC (matching the existing privacy model).  Only accounts that explicitly
  // set their ranking to private / connections-only are hidden -- so a public user
  // never wrongly disappears from the leaderboard.
  const rankHidden = new Set();
  if (keys.length) {
    const pv = await env.DB.prepare(
      `SELECT account_key, COALESCE(ranking_visibility,'') AS rv, ranking_public FROM account_privacy_settings WHERE account_key IN (${sqlPlaceholders(keys)})`
    ).bind(...keys).all().catch(() => null);
    for (const r of (pv && pv.results) || []) {
      const rv = String(r.rv || "").toLowerCase();
      const explicitlyPrivate = rv === "private" || rv === "connections" || (!rv && r.ranking_public != null && Number(r.ranking_public) === 0);
      if (explicitlyPrivate) rankHidden.add(String(r.account_key));
    }
  }
  const ranked = scores
    .map((s) => ({ ...s, identity: idMap.get(s.accountKey) || null }))
    .filter((s) => !rankHidden.has(s.accountKey))
    .sort((a, b) => b.score - a.score || String((a.identity && a.identity.name) || "").localeCompare(String((b.identity && b.identity.name) || "")));

  const entries = ranked.slice(offset, offset + limit).map((s, i) => {
    const identity = s.identity || {};
    const fallbackName = `User ${String(s.accountKey || "").slice(0, 6)}`;
    const total = totalMap.has(s.accountKey)
      ? Number(totalMap.get(s.accountKey) || 0)
      : Math.max(Number(s.totalScore || 0), Number(s.score || 0));
    const equippedCosmetics = s.equippedCosmetics && typeof s.equippedCosmetics === "object" ? s.equippedCosmetics : {};
    return {
      rank: offset + i + 1,
      accountKey: s.accountKey,
      name: identity.name || fallbackName,
      title: identity.name || fallbackName,
      avatar: publicAvatarForClient(req, identity.avatar || ""),
      bio: identity.bio || "",
      level: Math.max(Number(levelMap.get(s.accountKey) || 0) || 0, userLevel(total)),
      score: s.score,
      xp: s.score,
      periodScore: s.score,
      totalScore: total,
      totalXp: total,
      equippedCosmetics,
      rankingEffect: equippedCosmetics.ranking_effect || "",
      source: s.source || "",
    };
  });

  let me = null;
  if (acc.accountKey) {
    const mine = scores.find((s) => s.accountKey === acc.accountKey);
    const myScore = mine ? mine.score : 0;
    const myRank = ranked.findIndex((s) => s.accountKey === acc.accountKey);
    me = { accountKey: acc.accountKey, score: myScore, xp: myScore, rank: myRank >= 0 ? myRank + 1 : null, ranked: myRank >= 0 };
  }

  return json({ ok: true, period, count: ranked.length, total: ranked.length, offset, limit, entries, me }, 200, req, env);
}

async function handleV2Profile(req, env, url) {
  await ensureV2Schema(env.DB);
  const account = identityNameKey(url.searchParams.get("account") || url.searchParams.get("accountKey") || "");
  if (!account) return json({ ok: false, error: "missing_account" }, 400, req, env);
  const id = await env.DB.prepare(
    `SELECT name, name_key, avatar, bio, COALESCE(is_public,0) AS is_public, COALESCE(created_at,0) AS created_at FROM comment_identities WHERE name_key = ?`
  ).bind(account).first().catch(() => null);
  if (!id) return json({ ok: false, error: "not_found" }, 404, req, env);
  if (!publicFlag(id.is_public)) return json({ ok: true, private: true, accountKey: account, name: id.name || "Learner" }, 200, req, env);
  let st = await env.DB.prepare(`SELECT total_xp, level, currency_balance FROM xp_state_v2 WHERE account_key = ?`).bind(account).first().catch(() => null);
  if (!st || Number(st.total_xp || 0) <= 0) {
    await seedV2FromLegacyAccountFile(env.DB, account).catch(() => null);
    await recomputeAndPersistV2(env.DB, account).catch(() => null);
    st = await env.DB.prepare(`SELECT total_xp, level, currency_balance FROM xp_state_v2 WHERE account_key = ?`).bind(account).first().catch(() => st);
  }
  let total = Number(st && st.total_xp || 0);
  if (!total) {
    const legacy = await getAccountXpCalculation(env.DB, account, { period: "all" }).catch(() => null);
    total = Number(legacy && legacy.totalScore || 0);
  }
  return json({
    ok: true, private: false, accountKey: account,
    name: id.name || "Learner", avatar: id.avatar || "", bio: id.bio || "",
    createdAt: Number(id.created_at || 0),
    totalXp: roundScore(total), level: Number(st && st.level || userLevel(total)),
    levelProgress: userLevelProgress(total),
  }, 200, req, env);
}

async function handleV2SetPrivacy(req, env) {
  await ensureV2Schema(env.DB);
  let body = {};
  try { body = await req.json(); } catch (_) { body = {}; }
  const acc = await resolveAccount(env.DB, body.visitorId || body.visitor_id || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const isPublic = publicFlag(body.isPublic != null ? body.isPublic : body.public) ? 1 : 0;
  await env.DB.prepare(`UPDATE comment_identities SET is_public = ?, updated_at = ? WHERE name_key = ?`).bind(isPublic, Date.now(), acc.accountKey).run().catch(() => null);
  return json({ ok: true, accountKey: acc.accountKey, isPublic: !!isPublic }, 200, req, env);
}

async function handleV2ShopPurchase(req, env) {
  await ensureV2Schema(env.DB);
  let body = {};
  try { body = await req.json(); } catch (_) { body = {}; }
  const acc = await resolveAccount(env.DB, body.visitorId || body.visitor_id || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const itemId = String(body.itemId || body.item_id || "").trim().slice(0, 120);
  if (!itemId) return json({ ok: false, error: "missing_item" }, 400, req, env);
  const price = Math.max(0, Number(body.price != null ? body.price : body.cost) || 0);
  if (!Number.isFinite(price) || price > 100000) return json({ ok: false, error: "invalid_price" }, 400, req, env);
  const consumable = body.consumable === true || body.consumable === 1 || String(body.consumable || "").toLowerCase() === "true";

  const lock = await acquireAccountShopPurchaseLockWithWait(env.DB, acc.accountKey, 12000);
  if (!lock) return json({ ok: false, error: "purchase_busy", retryable: true, message: "Another purchase is still finishing. Please try again in a moment." }, 503, req, env);
  try {
    const before = await readCloudShopPurchaseState(env.DB, acc.accountKey, itemId);
    if (!before || before.ok === false) {
      return json({ ok: false, error: before && before.error || "cloud_shop_state_not_ready", retryable: true, accountKey: acc.accountKey, itemId, balance: 0, price, message: "Cloud shop balance is not materialized yet. Sync the account once, then try the purchase again.", stateSource: before && before.source || "missing" }, 409, req, env);
    }
    if (!consumable && before.hasItem) {
      return json({ ok: true, alreadyOwned: true, accountKey: acc.accountKey, itemId, state: v2StatePayload({
        totalXp: before.totalXp || 0,
        level: before.level || userLevel(before.totalXp || 0),
        currencyEarned: before.currency.currencyEarned || 0,
        currencySpent: before.currency.currencySpent || 0,
        currencyCredited: before.currency.currencyCredited || 0,
        currencyBalance: before.currency.currencyBalance || 0,
        owned: [itemId],
        equipped: {}
      }, { updatedAt: before.updatedAt || Date.now() }) }, 200, req, env);
    }
    if (before.serverBalance + 1e-9 < price) {
      return json({ ok: false, error: "insufficient_funds", accountKey: acc.accountKey, itemId, balance: before.serverBalance, price, missing: roundScore(price - before.serverBalance), score: before.currency, stateSource: before.source }, 409, req, env);
    }
    const now = Date.now();
    const eventId = consumable ? `shop_purchase:${acc.accountKey}:${itemId}:${now}:${Math.random().toString(36).slice(2, 8)}` : `shop_purchase:${acc.accountKey}:${itemId}`;
    const ev = {
      id: eventId, metric: "shop_purchase", ts: now, value: price,
      details: { itemId, price, cost: price, consumable: !!consumable },
    };
    const applied = await applyShopPurchaseToV2State(env.DB, acc.accountKey, ev, itemId, price, consumable, before).catch(() => null);
    const score = applied && applied.score ? applied.score : Object.assign({}, before.currency, { currencyBalance: roundScore(Math.max(0, before.serverBalance - price)), eorbits: roundScore(Math.max(0, before.serverBalance - price)) });
    return json({ ok: true, purchased: true, accountKey: acc.accountKey, itemId, price, event: ev, score, state: v2StatePayload({
      totalXp: before.totalXp || 0,
      level: before.level || userLevel(before.totalXp || 0),
      currencyEarned: score.currencyEarned || 0,
      currencySpent: score.currencySpent || 0,
      currencyCredited: score.currencyCredited || 0,
      currencyBalance: score.currencyBalance || 0,
      owned: consumable ? [] : [itemId],
      equipped: {}
    }, { updatedAt: Date.now() }), stateSource: before.source, v2Accepted: !!(applied && applied.accepted) }, 200, req, env);
  } finally {
    await releaseAccountShopPurchaseLock(env.DB, lock);
  }
}

async function handleV2ShopEquip(req, env) {
  await ensureV2Schema(env.DB);
  let body = {};
  try { body = await req.json(); } catch (_) { body = {}; }
  const acc = await resolveAccount(env.DB, body.visitorId || body.visitor_id || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const itemId = String(body.itemId || body.item_id || "").trim().slice(0, 120);
  const slot = String(body.slot || "").trim().slice(0, 64);
  if (!slot) return json({ ok: false, error: "missing_slot" }, 400, req, env);
  const now = Date.now();
  await v2InsertEvents(env.DB, acc.accountKey, [{
    id: `shop_equip:${slot}:${now}:${Math.random().toString(36).slice(2, 8)}`,
    metric: "shop_equip", ts: now, details: { itemId: itemId || "default", slot },
  }]);
  const state = await recomputeAndPersistV2(env.DB, acc.accountKey);
  return json({ ok: true, accountKey: acc.accountKey, slot, itemId: itemId || "default", state: v2StatePayload(state) }, 200, req, env);
}

// One-time seed: ingest events recovered from the user's local data.  Idempotent
// because every event carries a stable id (re-imports never double-count).
async function handleV2Import(req, env) {
  await ensureV2Schema(env.DB);
  let body = {};
  try { body = await req.json(); } catch (_) { body = {}; }
  const acc = await resolveAccount(env.DB, body.visitorId || body.visitor_id || "", req);
  if (acc.revoked) return json({ ok: false, revoked: true, error: "This device has been disconnected from the account." }, 401, req, env);
  if (!acc.accountKey) return json({ ok: false, error: "Connect or save a username first." }, 400, req, env);
  const events = Array.isArray(body.events) ? body.events : [];
  const ins = await v2InsertEvents(env.DB, acc.accountKey, events, { limit: Math.max(1, Math.min(5000, Number(body.limit || events.length || 5000) || 5000)) });
  const baselineState = await v2PersistBaselineSnapshot(env.DB, acc.accountKey, events).catch(() => null);
  if (body.recompute === false) {
    const countRow = await env.DB.prepare(`SELECT COUNT(*) AS n FROM xp_events_v2 WHERE account_key = ?`).bind(acc.accountKey).first().catch(() => null);
    return json({
      ok: true,
      accountKey: acc.accountKey,
      imported: ins.accepted,
      received: ins.count,
      recomputed: false,
      eventCount: Number(countRow && countRow.n || 0) || 0,
      state: body.returnState && baselineState ? baselineState : undefined,
    }, 200, req, env);
  }
  const state = await recomputeAndPersistV2(env.DB, acc.accountKey);
  return json({ ok: true, accountKey: acc.accountKey, imported: ins.accepted, received: ins.count, recomputed: true, state: v2StatePayload(state, { eventCount: state.eventCount }) }, 200, req, env);
}
