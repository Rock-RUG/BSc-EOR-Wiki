// docs/javascripts/track-views.js
// Account data rewrite v4: local event-ledger first, cloud as merged event file, explicit progress/failure reporting.
// This file intentionally replaces the old mixed localStorage/queue/cloud-state tracker.
(function () {
  "use strict";

  const API_BASE = String(window.MKDOCS_HOT_API_BASE || "https://hot.eor-wiki.workers.dev").replace(/\/+$/g, "");
  const LOCAL_FILE_KEY = "mk_account_data_file_v1";
  const LOCAL_FILE_BACKUP_KEY = "mk_account_data_file_backup_v1";
  const LOCAL_SYNC_SUMMARY_KEY = "mk_account_data_sync_summary_v1";
  const LOCAL_SCORE_STATE_KEY = "mk_account_score_state_v1";
  const LOCAL_PENDING_EVENTS_KEY = "mk_account_pending_events_v1";
  const LOCAL_CLOUD_EVENT_QUEUE_KEY = "mk_account_cloud_event_upload_queue_v1";
  const ACCOUNT_SYNC_LAST_RESULT_KEY = "mk_account_sync_last_result_v2";
  const ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY = "mk_account_json_sync_last_summary_v1";
  const ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY = "mk_account_sync_confirmed_cloud_v1";
  const VISITOR_ID_KEY = "mk_hot_visitor_id_v1";
  const DEVICE_ID_KEY = "mk_account_device_id_v1";
  const DEVICE_NAME_KEY = "mk_hot_device_name_v1";
  const PROFILE_KEY = "mk_comment_profile_v1";
  const LEGACY_VISITS_KEY = "mk_hot_local_visits_v1";
  const LEGACY_PAGE_ACTIONS_KEY = "mk_hot_local_page_actions_v1";
  const LEGACY_FAVORITES_KEY = "mk_hot_local_favorites_v1";
  const LEGACY_MASTERY_KEY = "concept_mastery_v1";
  const LEGACY_READINESS_KEY = "mk_hot_local_readiness_v1";
  const LEGACY_AIQ_KEY = "concept_quiz_sessions_v1";
  const LEGACY_ACCOUNT_IMPORT_KEY = "mk_account_data_legacy_import_v2";
  const LEGACY_MASTERY_IMPORT_KEY = "mk_account_data_legacy_mastery_import_v1";
  const DAILY_OPEN_KEY = "mk_account_daily_open_recorded_v1";
  const PENDING_XP_ACTIVITY_QUEUE_KEY = "mk_xp_pending_activity_queue_v1";
  const ADMIN_SHOP_PREVIEW_KEY = "mk_shop_admin_preview_overrides_v1";
  const SHOP_PAGE_TRIAL_KEY = "mk_shop_page_trial_v2";
  const SHOP_RUNTIME_TRIAL_KEY = "mk_shop_runtime_trials_v55";
  const SHOP_TRIAL_USE_KEY = "mk_shop_trial_uses_v55";
  const SHOP_TRIAL_SKIP_PRELOAD_KEY = "mk_shop_trial_skip_preload_until_v1";
  const SHOP_INVENTORY_LIGHT_CACHE_KEY = "mk_shop_inventory_light_cache_v1";
  const SHOP_TRIAL_DURATION_MS = 2 * 60 * 1000;
  const SHOP_TRIAL_VERSION = "v59";
  const SHOP_PAGE_TRIAL_ACTIVATION_GRACE_MS = 15000; // legacy page-scoped records only
  const AUTO_SYNC_INTERVAL_KEY = "mk_account_auto_sync_interval_ms_v1";
  const AUTO_SYNC_INTERVAL_DEFAULT_MS = 15 * 60 * 1000;
  // Phones/tablets pay the most for each background sync (network round-trips plus
  // full-ledger serialise/parse/hash). When the user has not chosen an interval,
  // default these power-sensitive clients to a longer gap to cut heat and battery.
  const AUTO_SYNC_INTERVAL_MOBILE_DEFAULT_MS = 30 * 60 * 1000;
  const AUTO_SYNC_INTERVAL_MIN_MS = 10 * 60 * 1000;
  const AUTO_SYNC_INTERVAL_MAX_MS = 60 * 60 * 1000;
  const MAX_EVENT_LOG = 50000;
  const SNAPSHOT_CHUNK_SIZE = 90000;
  const LEARNING_CURRENCY_NAME = "EORbits";
  const LEARNING_CURRENCY_SINGULAR = "EORbit";
  const SHOP_CATALOG = {
    local_map_3d: {
      id: "local_map_3d",
      title: "3D Local Map",
      shortTitle: "3D map",
      category: "Map effects",
      price: 500,
      currency: LEARNING_CURRENCY_NAME,
      description: "Rotatable 3D view for local concept maps. The normal 2D map stays free.",
      giftable: true,
      cosmetic: true,
      slot: "map_effect"
    },
    local_map_animations: {
      id: "local_map_animations",
      title: "Local Map Animations",
      shortTitle: "Map animations",
      category: "Map effects",
      price: 220,
      currency: LEARNING_CURRENCY_NAME,
      description: "Animated hover, long-press and tap highlights for local concept maps. Without this, the map keeps static highlights only.",
      giftable: true,
      cosmetic: true,
      slot: "map_animation"
    },
    mastery_fx: {
      id: "mastery_fx",
      title: "Mastery Rating Effects",
      shortTitle: "Mastery effects",
      category: "Visual effects",
      price: 0,
      free: true,
      currency: LEARNING_CURRENCY_NAME,
      description: "Built-in mastery rating animation. This is no longer a shop unlock.",
      giftable: false,
      cosmetic: false,
      slot: ""
    },
    mastery_effect_mastered_gold: {
      id: "mastery_effect_mastered_gold",
      title: "Mastered Gold Effect",
      shortTitle: "Gold mastered",
      category: "Mastery effects",
      price: 200,
      currency: LEARNING_CURRENCY_NAME,
      description: "Gold title, badge and line glow for Mastered ratings.",
      giftable: true,
      cosmetic: true,
      slot: "mastery_effect_mastered"
    },
    mastery_effect_clear_silver: {
      id: "mastery_effect_clear_silver",
      title: "Clear Silver Effect",
      shortTitle: "Silver clear",
      category: "Mastery effects",
      price: 100,
      currency: LEARNING_CURRENCY_NAME,
      description: "Silver title, badge and line glow for Clear ratings.",
      giftable: true,
      cosmetic: true,
      slot: "mastery_effect_clear"
    },
    header_font_serif: {
      id: "header_font_serif",
      title: "Serif Header Font",
      shortTitle: "Serif header",
      category: "Header fonts",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "Give the header navigation a more academic serif style.",
      giftable: true,
      cosmetic: true,
      slot: "header_font"
    },
    header_font_rounded: {
      id: "header_font_rounded",
      title: "Rounded Header Font",
      shortTitle: "Rounded header",
      category: "Header fonts",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "A softer rounded header style for a friendlier interface.",
      giftable: true,
      cosmetic: true,
      slot: "header_font"
    },
    header_font_geometric: {
      id: "header_font_geometric",
      title: "Geometric Header Font",
      shortTitle: "Geometric header",
      category: "Header fonts",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "Clean geometric lettering for a crisp modern header.",
      giftable: true,
      cosmetic: true,
      slot: "header_font"
    },
    header_font_humanist: {
      id: "header_font_humanist",
      title: "Humanist Header Font",
      shortTitle: "Humanist header",
      category: "Header fonts",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "Readable humanist shapes for a calm, balanced header.",
      giftable: true,
      cosmetic: true,
      slot: "header_font"
    },
    header_font_editorial: {
      id: "header_font_editorial",
      title: "Editorial Header Font",
      shortTitle: "Editorial header",
      category: "Header fonts",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "A sharper editorial serif style for stronger page titles and menus.",
      giftable: true,
      cosmetic: true,
      slot: "header_font"
    },
    header_font_slab: {
      id: "header_font_slab",
      title: "Slab Header Font",
      shortTitle: "Slab header",
      category: "Header fonts",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "A sturdy slab-serif style for a more confident header.",
      giftable: true,
      cosmetic: true,
      slot: "header_font"
    },
    header_font_condensed: {
      id: "header_font_condensed",
      title: "Condensed Header Font",
      shortTitle: "Condensed header",
      category: "Header fonts",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "Narrower header lettering that keeps long menu labels tidy.",
      giftable: true,
      cosmetic: true,
      slot: "header_font"
    },
    header_font_mono: {
      id: "header_font_mono",
      title: "Mono Header Font",
      shortTitle: "Mono header",
      category: "Header fonts",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "A clean monospace header style for a technical look.",
      giftable: true,
      cosmetic: true,
      slot: "header_font"
    },
    header_font_elegant: {
      id: "header_font_elegant",
      title: "Elegant Header Font",
      shortTitle: "Elegant header",
      category: "Header fonts",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "A soft bookish serif style for a quieter academic header.",
      giftable: true,
      cosmetic: true,
      slot: "header_font"
    },
    header_font_playful: {
      id: "header_font_playful",
      title: "Playful Header Font",
      shortTitle: "Playful header",
      category: "Header fonts",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "A warmer playful style for a lighter interface mood.",
      giftable: true,
      cosmetic: true,
      slot: "header_font"
    },
    body_font_serif: {
      id: "body_font_serif",
      title: "Serif Body Font",
      shortTitle: "Serif body",
      category: "Body fonts",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Apply the academic serif style to body text, sidebars and non-header interface areas.",
      giftable: true,
      cosmetic: true,
      slot: "body_font"
    },
    body_font_rounded: {
      id: "body_font_rounded",
      title: "Rounded Body Font",
      shortTitle: "Rounded body",
      category: "Body fonts",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Apply the softer rounded style to body text, sidebars and non-header interface areas.",
      giftable: true,
      cosmetic: true,
      slot: "body_font"
    },
    body_font_geometric: {
      id: "body_font_geometric",
      title: "Geometric Body Font",
      shortTitle: "Geometric body",
      category: "Body fonts",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Apply clean geometric lettering to body text, sidebars and non-header interface areas.",
      giftable: true,
      cosmetic: true,
      slot: "body_font"
    },
    body_font_humanist: {
      id: "body_font_humanist",
      title: "Humanist Body Font",
      shortTitle: "Humanist body",
      category: "Body fonts",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Apply readable humanist shapes to body text, sidebars and non-header interface areas.",
      giftable: true,
      cosmetic: true,
      slot: "body_font"
    },
    body_font_editorial: {
      id: "body_font_editorial",
      title: "Editorial Body Font",
      shortTitle: "Editorial body",
      category: "Body fonts",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Apply the sharper editorial serif style to body text, sidebars and non-header interface areas.",
      giftable: true,
      cosmetic: true,
      slot: "body_font"
    },
    body_font_slab: {
      id: "body_font_slab",
      title: "Slab Body Font",
      shortTitle: "Slab body",
      category: "Body fonts",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Apply a sturdy slab-serif style to body text, sidebars and non-header interface areas.",
      giftable: true,
      cosmetic: true,
      slot: "body_font"
    },
    body_font_condensed: {
      id: "body_font_condensed",
      title: "Condensed Body Font",
      shortTitle: "Condensed body",
      category: "Body fonts",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Apply narrower lettering to body text, sidebars and non-header interface areas.",
      giftable: true,
      cosmetic: true,
      slot: "body_font"
    },
    body_font_mono: {
      id: "body_font_mono",
      title: "Mono Body Font",
      shortTitle: "Mono body",
      category: "Body fonts",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Apply a clean monospace style to body text, sidebars and non-header interface areas.",
      giftable: true,
      cosmetic: true,
      slot: "body_font"
    },
    body_font_elegant: {
      id: "body_font_elegant",
      title: "Elegant Body Font",
      shortTitle: "Elegant body",
      category: "Body fonts",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Apply a softer bookish serif style to body text, sidebars and non-header interface areas.",
      giftable: true,
      cosmetic: true,
      slot: "body_font"
    },
    body_font_playful: {
      id: "body_font_playful",
      title: "Playful Body Font",
      shortTitle: "Playful body",
      category: "Body fonts",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Apply a warmer playful style to body text, sidebars and non-header interface areas.",
      giftable: true,
      cosmetic: true,
      slot: "body_font"
    },
    comment_highlight_soft: {
      id: "comment_highlight_soft",
      title: "Soft Comment Highlight",
      shortTitle: "Comment highlight",
      category: "Comment effects",
      price: 140,
      currency: LEARNING_CURRENCY_NAME,
      description: "A warmer accent border for your own comments and replies.",
      cosmetic: true,
      slot: "comment_effect"
    },
    finder_token_spark: {
      id: "finder_token_spark",
      title: "Token Spark Animation",
      shortTitle: "Token spark",
      category: "Finder effects",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "A light animation when tokens are added or arranged in Concept Finder.",
      cosmetic: true,
      slot: "finder_effect"
    },
    finder_result_pulse: {
      id: "finder_result_pulse",
      title: "Result Pulse",
      shortTitle: "Result pulse",
      category: "Finder effects",
      price: 160,
      currency: LEARNING_CURRENCY_NAME,
      description: "A subtle pulse when new search or finder results appear.",
      cosmetic: true,
      slot: "finder_effect"
    },
    profile_frame_glow: {
      id: "profile_frame_glow",
      title: "Profile Glow Frame",
      shortTitle: "Profile glow",
      category: "Profile styles",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "A soft golden edge around your public profile header.",
      cosmetic: true,
      slot: "profile_frame"
    },
    profile_frame_neon: {
      id: "profile_frame_neon",
      title: "Neon Profile Frame",
      shortTitle: "Neon frame",
      category: "Profile styles",
      price: 220,
      currency: LEARNING_CURRENCY_NAME,
      description: "A teal and violet profile frame for a more visible public card.",
      cosmetic: true,
      slot: "profile_frame"
    },
    profile_bg_stars: {
      id: "profile_bg_stars",
      title: "Starfield Profile Background",
      shortTitle: "Starfield profile",
      category: "Profile styles",
      price: 260,
      currency: LEARNING_CURRENCY_NAME,
      description: "A subtle starfield background for your public profile.",
      cosmetic: true,
      slot: "profile_background"
    },
    profile_bg_blush: {
      id: "profile_bg_blush",
      title: "Blush Profile Background",
      shortTitle: "Blush profile",
      category: "Profile styles",
      price: 240,
      currency: LEARNING_CURRENCY_NAME,
      description: "A soft pink profile background for a warmer style.",
      cosmetic: true,
      slot: "profile_background"
    },
    profile_bg_custom: {
      id: "profile_bg_custom",
      title: "Custom Profile Background",
      shortTitle: "Custom profile bg",
      category: "Profile styles",
      price: 450,
      currency: LEARNING_CURRENCY_NAME,
      description: "Unlock custom public profile background support. Upload controls can be connected later.",
      cosmetic: true,
      slot: "profile_background"
    },
    ranking_row_gold: {
      id: "ranking_row_gold",
      title: "Golden Ranking Row",
      shortTitle: "Gold ranking",
      category: "Ranking effects",
      price: 260,
      currency: LEARNING_CURRENCY_NAME,
      description: "A static golden accent for your Rankings row, visible to everyone who can see the leaderboard.",
      cosmetic: true,
      slot: "ranking_effect"
    },
    ranking_row_pastel_red: {
      id: "ranking_row_pastel_red",
      title: "Pastel Red Ranking Row",
      shortTitle: "Pastel red row",
      category: "Ranking effects",
      price: 220,
      currency: LEARNING_CURRENCY_NAME,
      description: "A static pastel red accent for your Rankings row, visible to everyone who can see the leaderboard.",
      cosmetic: true,
      slot: "ranking_effect"
    },
    ranking_row_pastel_blue: {
      id: "ranking_row_pastel_blue",
      title: "Pastel Blue Ranking Row",
      shortTitle: "Pastel blue row",
      category: "Ranking effects",
      price: 220,
      currency: LEARNING_CURRENCY_NAME,
      description: "A static pastel blue accent for your Rankings row, visible to everyone who can see the leaderboard.",
      cosmetic: true,
      slot: "ranking_effect"
    },
    ranking_row_pastel_purple: {
      id: "ranking_row_pastel_purple",
      title: "Pastel Purple Ranking Row",
      shortTitle: "Pastel purple row",
      category: "Ranking effects",
      price: 220,
      currency: LEARNING_CURRENCY_NAME,
      description: "A static pastel purple accent for your Rankings row, visible to everyone who can see the leaderboard.",
      cosmetic: true,
      slot: "ranking_effect"
    },
    ranking_row_pastel_green: {
      id: "ranking_row_pastel_green",
      title: "Pastel Green Ranking Row",
      shortTitle: "Pastel green row",
      category: "Ranking effects",
      price: 220,
      currency: LEARNING_CURRENCY_NAME,
      description: "A static pastel green accent for your Rankings row, visible to everyone who can see the leaderboard.",
      cosmetic: true,
      slot: "ranking_effect"
    },
    ranking_row_pastel_peach: {
      id: "ranking_row_pastel_peach",
      title: "Pastel Peach Ranking Row",
      shortTitle: "Pastel peach row",
      category: "Ranking effects",
      price: 220,
      currency: LEARNING_CURRENCY_NAME,
      description: "A static pastel peach accent for your Rankings row, visible to everyone who can see the leaderboard.",
      cosmetic: true,
      slot: "ranking_effect"
    },
    xp_double_1d: {
      id: "xp_double_1d",
      title: "1-day XP Double Boost",
      shortTitle: "2× XP, 1 day",
      category: "Progress boosts",
      price: 60,
      currency: LEARNING_CURRENCY_NAME,
      description: "Double counted XP for 24 hours. EORbits are not doubled.",
      consumable: true,
      durationHours: 24,
      durationDays: 1,
      xpMultiplier: 2
    },
    xp_double_7d: {
      id: "xp_double_7d",
      title: "1-week XP Double Boost",
      shortTitle: "2× XP, 1 week",
      category: "Progress boosts",
      price: 250,
      currency: LEARNING_CURRENCY_NAME,
      description: "Double counted XP for 7 days. Useful during revision weeks.",
      consumable: true,
      durationHours: 168,
      durationDays: 7,
      xpMultiplier: 2
    },
    xp_double_30d: {
      id: "xp_double_30d",
      title: "1-month XP Double Boost",
      shortTitle: "2× XP, 1 month",
      category: "Progress boosts",
      price: 800,
      currency: LEARNING_CURRENCY_NAME,
      description: "Double counted XP for 30 days. Best for a long study block.",
      consumable: true,
      durationHours: 720,
      durationDays: 30,
      xpMultiplier: 2
    },
    xp_cap_double_1d: {
      id: "xp_cap_double_1d",
      title: "1-day XP Cap Doubler",
      shortTitle: "160 XP cap, 1 day",
      category: "Progress boosts",
      price: 100,
      currency: LEARNING_CURRENCY_NAME,
      description: "Double today’s level-based XP cap for 24 hours.",
      consumable: true,
      durationHours: 24,
      durationDays: 1,
      dailyCapMultiplier: 2
    },
    ui_theme_light_sky: {
      id: "ui_theme_light_sky",
      title: "Day Theme · Morning Sky",
      shortTitle: "Morning Sky",
      category: "Interface themes",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Clear blue comfort for a fresh study morning.",
      giftable: true,
      cosmetic: true,
      slot: "interface_theme_light"
    },
    ui_theme_light_sage: {
      id: "ui_theme_light_sage",
      title: "Day Theme · Sage Garden",
      shortTitle: "Sage Garden",
      category: "Interface themes",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Soft green calm for steady focus.",
      giftable: true,
      cosmetic: true,
      slot: "interface_theme_light"
    },
    ui_theme_light_peach_grad: {
      id: "ui_theme_light_peach_grad",
      title: "Day Theme · Peach Horizon",
      shortTitle: "Peach Horizon",
      category: "Interface themes",
      price: 240,
      currency: LEARNING_CURRENCY_NAME,
      description: "Warm peach light for a gentle horizon feel.",
      giftable: true,
      cosmetic: true,
      slot: "interface_theme_light"
    },
    ui_theme_light_lavender_grad: {
      id: "ui_theme_light_lavender_grad",
      title: "Day Theme · Lavender Mist",
      shortTitle: "Lavender Mist",
      category: "Interface themes",
      price: 240,
      currency: LEARNING_CURRENCY_NAME,
      description: "Gentle lavender mist for a softer reading space.",
      giftable: true,
      cosmetic: true,
      slot: "interface_theme_light"
    },
    ui_theme_dark_midnight: {
      id: "ui_theme_dark_midnight",
      title: "Night Theme · Midnight Ink",
      shortTitle: "Midnight Ink",
      category: "Interface themes",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Deep navy ink for focused late study.",
      giftable: true,
      cosmetic: true,
      slot: "interface_theme_dark"
    },
    ui_theme_dark_evergreen: {
      id: "ui_theme_dark_evergreen",
      title: "Night Theme · Pine Shadow",
      shortTitle: "Pine Shadow",
      category: "Interface themes",
      price: 180,
      currency: LEARNING_CURRENCY_NAME,
      description: "Quiet pine shadow for a calm night interface.",
      giftable: true,
      cosmetic: true,
      slot: "interface_theme_dark"
    },
    ui_theme_dark_aurora_grad: {
      id: "ui_theme_dark_aurora_grad",
      title: "Night Theme · Aurora Veil",
      shortTitle: "Aurora Veil",
      category: "Interface themes",
      price: 260,
      currency: LEARNING_CURRENCY_NAME,
      description: "Teal aurora light for a livelier night interface.",
      giftable: true,
      cosmetic: true,
      slot: "interface_theme_dark"
    },
    ui_theme_dark_plum_grad: {
      id: "ui_theme_dark_plum_grad",
      title: "Night Theme · Plum Twilight",
      shortTitle: "Plum Twilight",
      category: "Interface themes",
      price: 260,
      currency: LEARNING_CURRENCY_NAME,
      description: "Muted plum twilight for a softer night mode.",
      giftable: true,
      cosmetic: true,
      slot: "interface_theme_dark"
    },
    ui_theme_sunlit_gold: {
      id: "ui_theme_sunlit_gold",
      title: "Day Theme · Sunlit Gold",
      shortTitle: "Sunlit Gold",
      category: "Interface themes",
      price: 260,
      currency: LEARNING_CURRENCY_NAME,
      description: "Sunlit gold warmth for a brighter study space.",
      giftable: true,
      cosmetic: true,
      slot: "interface_theme_light"
    },
    ui_theme_lantern_gold: {
      id: "ui_theme_lantern_gold",
      title: "Night Theme · Lantern Gold",
      shortTitle: "Lantern Gold",
      category: "Interface themes",
      price: 260,
      currency: LEARNING_CURRENCY_NAME,
      description: "Warm amber light for a lantern-like night mode.",
      giftable: true,
      cosmetic: true,
      slot: "interface_theme_dark"
    },
    page_pattern_soft_grid: {
      id: "page_pattern_soft_grid",
      title: "Page Pattern · Soft Grid",
      shortTitle: "Soft grid",
      category: "Page background patterns",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "Adds a very light grid layer over the current page background colour.",
      giftable: true,
      cosmetic: true,
      slot: "page_pattern"
    },
    page_pattern_diagonal: {
      id: "page_pattern_diagonal",
      title: "Page Pattern · Diagonal Lines",
      shortTitle: "Diagonal lines",
      category: "Page background patterns",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "Adds a soft diagonal texture over the current page background colour.",
      giftable: true,
      cosmetic: true,
      slot: "page_pattern"
    },
    page_pattern_dots: {
      id: "page_pattern_dots",
      title: "Page Pattern · Tiny Dots",
      shortTitle: "Tiny dots",
      category: "Page background patterns",
      price: 120,
      currency: LEARNING_CURRENCY_NAME,
      description: "Adds tiny paper-like dots over the current page background colour.",
      giftable: true,
      cosmetic: true,
      slot: "page_pattern"
    },
    page_pattern_notebook: {
      id: "page_pattern_notebook",
      title: "Page Pattern · Notebook",
      shortTitle: "Notebook",
      category: "Page background patterns",
      price: 150,
      currency: LEARNING_CURRENCY_NAME,
      description: "Adds subtle notebook lines over the current page background colour.",
      giftable: true,
      cosmetic: true,
      slot: "page_pattern"
    }
  };
  // v79: old split header/search/page-background shop skins are retired,
  // and page background patterns are removed from the shop as a category.
  // Keeping page_pattern in the retired slot list also prevents stale old
  // purchases, equips, and trials from re-applying deprecated textures.
  const RETIRED_VISUAL_SHOP_SLOTS = new Set([
    "header_skin",
    "search_box_effect",
    "page_effect",
    "dropdown_skin",
    "page_pattern"
  ]);
  const RETIRED_VISUAL_SHOP_ATTRS = [
    "data-mk-header-skin",
    "data-mk-search-box-effect",
    "data-mk-page-effect",
    "data-mk-dropdown-skin",
    "data-mk-page-pattern"
  ];
  function isRetiredVisualShopItem(itemId, item) {
    const id = clampText(itemId || "", 120).trim();
    const it = item || SHOP_CATALOG[id] || null;
    const slot = it && it.slot ? String(it.slot) : "";
    return RETIRED_VISUAL_SHOP_SLOTS.has(slot)
      || /^theme_/.test(id)
      || /^header_skin_/.test(id)
      || /^header_search_/.test(id)
      || /^page_bg_/.test(id)
      || /^page_pattern_/.test(id)
      || /^dropdown_/.test(id);
  }
  function clearRetiredVisualShopAttributes() {
    try {
      const root = document.documentElement;
      RETIRED_VISUAL_SHOP_ATTRS.forEach((attr) => root.removeAttribute(attr));
    } catch (_) {}
  }

  function interfaceThemeMode(itemId) {
    const id = clampText(itemId || "", 120).trim();
    if (!id) return "";
    if (id === "ui_theme_sunlit_gold" || /^ui_theme_light_/.test(id)) return "light";
    if (id === "ui_theme_lantern_gold" || /^ui_theme_dark_/.test(id)) return "dark";
    return "";
  }

  function normaliseShopSlot(slot, itemId, item) {
    const raw = clampText(slot || "", 80).trim();
    const id = clampText(itemId || (item && item.id) || "", 120).trim();
    const mode = interfaceThemeMode(id);
    if (mode === "light") return "interface_theme_light";
    if (mode === "dark") return "interface_theme_dark";
    if (raw === "interface_theme_light" || raw === "interface_theme_dark") return raw;
    return raw || (item && item.slot) || "cosmetic";
  }

  function shopCatalogDisplayRank(item, fallbackIndex) {
    const it = item || {};
    const cat = String(it.category || "");
    const id = String(it.id || "");
    if (cat === "Interface themes") {
      const lightOrder = {
        ui_theme_light_sky: 0,
        ui_theme_light_sage: 1,
        ui_theme_light_peach_grad: 2,
        ui_theme_light_lavender_grad: 3,
        ui_theme_sunlit_gold: 4
      };
      const darkOrder = {
        ui_theme_dark_midnight: 0,
        ui_theme_dark_evergreen: 1,
        ui_theme_dark_aurora_grad: 2,
        ui_theme_dark_plum_grad: 3,
        ui_theme_lantern_gold: 4
      };
      if (Object.prototype.hasOwnProperty.call(lightOrder, id)) return 1000 + lightOrder[id];
      if (Object.prototype.hasOwnProperty.call(darkOrder, id)) return 1100 + darkOrder[id];
    }
    if (cat === "Header fonts" || cat === "Body fonts") {
      const fontOrder = {
        serif: 0,
        rounded: 1,
        geometric: 2,
        humanist: 3,
        editorial: 4,
        slab: 5,
        condensed: 6,
        mono: 7,
        elegant: 8,
        playful: 9
      };
      const key = id.replace(/^(header|body)_font_/, "");
      const offset = cat === "Header fonts" ? 2000 : 2100;
      if (Object.prototype.hasOwnProperty.call(fontOrder, key)) return offset + fontOrder[key];
    }
    return 100000 + (Number(fallbackIndex) || 0);
  }

  // ---------------------------------------------------------------------------
  // Shop pricing: daily discounts (promotion) + dynamic demand multiplier hook.
  //
  // The daily discount set is fully deterministic from the UTC date, so every
  // device computes the SAME promotion for a given day without any server
  // round-trip ("对所有用户统一"). A seeded PRNG shuffles the eligible catalog,
  // selects three items, then assigns three random discounts from 50/40/30/20/10.
  //
  // The dynamic multiplier (>= 1) is a separate layer: the more an item is
  // bought the higher it climbs, and it decays back toward 1 when idle, but it
  // can never push the price below the original (the original price is the
  // floor). Only a discount may take the price below the original. Global demand
  // lives on the Worker, so shopDynamicPriceMultiplier() reads a multiplier map
  // that the Worker can populate; until then it returns 1 (no change).
  // ---------------------------------------------------------------------------
  const DAILY_DISCOUNT_PERCENTS = [50, 40, 30, 20, 10];
  const DAILY_DISCOUNT_ITEM_COUNT = 3;

  function utcDayString(ts) {
    const d = ts ? new Date(Number(ts)) : new Date();
    return Number.isFinite(d.getTime()) ? d.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  }

  function hashStringToSeed(str) {
    let h = 2166136261 >>> 0;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededRandom(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function dailyDiscountEligibleItems() {
    return Object.values(SHOP_CATALOG)
      .filter((it) => it && !it.free && Number(it.price || 0) > 0 && !isRetiredVisualShopItem(it.id, it))
      .map((it) => Object.assign({}, it))
      .sort((a, b) => String(a.id || "").localeCompare(String(b.id || "")));
  }

  function computeDailyDiscounts(dayStr) {
    const day = dayStr || utcDayString();
    const pool = dailyDiscountEligibleItems();
    const rng = seededRandom(hashStringToSeed("mk-shop-discount:" + day));
    // Deterministic Fisher-Yates shuffle so all devices agree on the same day.
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    const count = Math.min(DAILY_DISCOUNT_ITEM_COUNT, DAILY_DISCOUNT_PERCENTS.length, pool.length);
    const picks = pool.slice(0, count);
    const percents = DAILY_DISCOUNT_PERCENTS.slice();
    // Shuffle the five possible discount levels as well, then take three.
    // This gives three discounted items per day and three discount values chosen
    // from 50/40/30/20/10 without always using the largest three.
    for (let i = percents.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = percents[i];
      percents[i] = percents[j];
      percents[j] = tmp;
    }
    const map = {};
    const items = picks.map((it, idx) => {
      const percent = percents[idx] || DAILY_DISCOUNT_PERCENTS[idx] || 10;
      map[it.id] = percent;
      return { itemId: it.id, percent };
    });
    return { day, map, items };
  }

  let __dailyDiscountCache = null;
  function dailyDiscounts() {
    const day = utcDayString();
    if (!__dailyDiscountCache || __dailyDiscountCache.day !== day) {
      __dailyDiscountCache = computeDailyDiscounts(day);
    }
    return __dailyDiscountCache;
  }

  // Worker-populated demand multipliers (itemId -> multiplier >= 1). Loaded from
  // a local cache at startup so prices are warm/offline-stable, then refreshed
  // from the Worker's /shop/dynamic-prices endpoint. Missing entries mean no
  // change (×1), so if the Worker is unreachable the original price is charged.
  const SHOP_DYNAMIC_PRICE_CACHE_KEY = "mk_shop_dynamic_prices_v1";
  const __shopDynamicMultipliers = Object.create(null);
  function applyShopDynamicMultipliers(map) {
    Object.keys(__shopDynamicMultipliers).forEach((k) => { delete __shopDynamicMultipliers[k]; });
    if (map && typeof map === "object") {
      Object.keys(map).forEach((k) => {
        const m = Number(map[k]);
        if (Number.isFinite(m) && m > 1.0000001) __shopDynamicMultipliers[k] = m;
      });
    }
  }
  function setShopDynamicMultipliers(map) {
    try {
      applyShopDynamicMultipliers(map);
      localStorage.setItem(SHOP_DYNAMIC_PRICE_CACHE_KEY, JSON.stringify({ ts: Date.now(), map: map && typeof map === "object" ? map : {} }));
    } catch (_) {}
  }
  function loadShopDynamicMultipliersFromCache() {
    try {
      const raw = localStorage.getItem(SHOP_DYNAMIC_PRICE_CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.map && typeof parsed.map === "object") applyShopDynamicMultipliers(parsed.map);
    } catch (_) {}
  }
  loadShopDynamicMultipliersFromCache();
  function shopDynamicPriceMultiplier(itemId) {
    const m = Number(__shopDynamicMultipliers[String(itemId || "")]);
    return Number.isFinite(m) && m > 1 ? m : 1;
  }

  function shopItemEffectivePrice(itemId) {
    const id = clampText(itemId || "", 120).trim();
    const item = SHOP_CATALOG[id];
    if (!item) return null;
    const base = Math.max(0, Number(item.price || 0) || 0);
    const mult = shopDynamicPriceMultiplier(id);
    // Original price is the floor for the dynamic layer: it can climb but never
    // drop below the original (only a discount may go lower).
    const dynamic = Math.max(base, Math.round(base * mult));
    const percent = Number(dailyDiscounts().map[id] || 0) || 0;
    const final = percent > 0 ? Math.max(0, Math.round(dynamic * (1 - percent / 100))) : dynamic;
    return { base, dynamic, discountPercent: percent, discounted: percent > 0, multiplier: mult, final };
  }

  function visibleShopCatalogItems() {
    const discounts = dailyDiscounts();
    return Object.values(SHOP_CATALOG)
      .filter((x) => !isRetiredVisualShopItem(x && x.id, x))
      .map((x, i) => Object.assign({ __mkCatalogIndex: i }, x))
      .sort((a, b) => shopCatalogDisplayRank(a, a.__mkCatalogIndex) - shopCatalogDisplayRank(b, b.__mkCatalogIndex))
      .map((x) => {
        const y = Object.assign({}, x);
        delete y.__mkCatalogIndex;
        const pricing = shopItemEffectivePrice(y.id);
        if (pricing) {
          y.basePrice = pricing.base;
          y.dynamicPrice = pricing.dynamic;
          y.effectivePrice = pricing.final;
          y.discountPercent = pricing.discountPercent;
          y.priceMultiplier = pricing.multiplier;
        }
        if (discounts.map[y.id]) y.dailyDiscountPercent = discounts.map[y.id];
        return y;
      });
  }

  function isMobilePowerSensitiveClient() {
    try {
      return !!(window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse), (max-width: 768px)").matches);
    } catch (_) { return false; }
  }

  function readShopInventoryLightCache() {
    try {
      const raw = localStorage.getItem(SHOP_INVENTORY_LIGHT_CACHE_KEY);
      const inv = raw ? JSON.parse(raw) : null;
      if (!inv || typeof inv !== "object") return null;
      const equipped = inv.equipped && typeof inv.equipped === "object" && !Array.isArray(inv.equipped) ? inv.equipped : {};
      const owned = inv.owned && typeof inv.owned === "object" && !Array.isArray(inv.owned) ? inv.owned : {};
      return Object.assign({ owned: {}, ownedIds: [], equipped: {}, purchases: [], gifts: [], consumables: [], activeBoosts: {}, activeTrials: [], trialUsesToday: [], catalog: visibleShopCatalogItems() }, inv, {
        owned,
        ownedIds: Array.isArray(inv.ownedIds) ? inv.ownedIds.slice(0, 400) : Object.keys(owned).sort(),
        equipped,
        catalog: visibleShopCatalogItems()
      });
    } catch (_) { return null; }
  }

  function writeShopInventoryLightCache(inv) {
    try {
      const src = inv && typeof inv === "object" ? inv : null;
      if (!src) return false;
      const owned = src.owned && typeof src.owned === "object" && !Array.isArray(src.owned) ? src.owned : {};
      const equipped = src.equipped && typeof src.equipped === "object" && !Array.isArray(src.equipped) ? src.equipped : {};
      const clean = {
        schema: "mk-shop-inventory-light-cache",
        updatedAt: Date.now(),
        owned,
        ownedIds: Array.isArray(src.ownedIds) ? src.ownedIds.slice(0, 400) : Object.keys(owned).sort(),
        equipped,
        activeBoosts: src.activeBoosts && typeof src.activeBoosts === "object" ? src.activeBoosts : {},
        activeTrials: Array.isArray(src.activeTrials) ? src.activeTrials.slice(0, 80) : []
      };
      localStorage.setItem(SHOP_INVENTORY_LIGHT_CACHE_KEY, JSON.stringify(clean));
      return true;
    } catch (_) { return false; }
  }

  function shopInventoryForCosmetics() {
    const cached = readShopInventoryLightCache();
    if (cached) return cached;
    if (isMobilePowerSensitiveClient()) return { owned: {}, ownedIds: [], equipped: {}, activeBoosts: {}, activeTrials: [], catalog: visibleShopCatalogItems() };
    try { return shopInventoryFromFile(readFile()); } catch (_) { return { owned: {}, ownedIds: [], equipped: {}, activeBoosts: {}, activeTrials: [], catalog: visibleShopCatalogItems() }; }
  }


  // Material for MkDocs usually stores the active palette scheme on <body>,
  // while shop cosmetic attributes live on <html>.  Mirror the scheme onto
  // <html> so mode-gated interface bundles can be matched reliably on desktop,
  // mobile, first paint, and after the light/dark toggle changes.
  function syncMaterialColorSchemeToRoot() {
    try {
      const root = document.documentElement;
      const body = document.body || null;
      const scheme = clampText(
        (body && body.getAttribute && body.getAttribute("data-md-color-scheme"))
          || (root && root.getAttribute && root.getAttribute("data-md-color-scheme"))
          || "default",
        40
      ).trim() || "default";
      root.setAttribute("data-mk-color-scheme", scheme);
      return scheme;
    } catch (_) { return ""; }
  }

  function bindMaterialColorSchemeBridgeOnce() {
    if (window.__mkMaterialColorSchemeBridgeBound) return;
    window.__mkMaterialColorSchemeBridgeBound = true;
    let observer = null;
    let observedBody = null;
    const observeBodyIfReady = () => {
      try {
        if (!observer || !document.body || observedBody === document.body) return;
        observer.observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
        observedBody = document.body;
      } catch (_) {}
    };
    const sync = () => {
      try { observeBodyIfReady(); } catch (_) {}
      try { syncMaterialColorSchemeToRoot(); } catch (_) {}
      try { applyEquippedCosmetics(shopInventoryForCosmetics()); } catch (_) {}
    };
    try { syncMaterialColorSchemeToRoot(); } catch (_) {}
    try {
      observer = new MutationObserver(() => sync());
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
      observeBodyIfReady();
      window.__mkMaterialColorSchemeBridgeObserver = observer;
    } catch (_) {}
    try { document.addEventListener("DOMContentLoaded", sync, { once: true }); } catch (_) {}
    try { window.addEventListener("storage", sync, { passive: true }); } catch (_) {}
    [0, 80, 260, 900].forEach((delay) => {
      try { window.setTimeout(sync, delay); } catch (_) {}
    });
  }

  const SHOP_ITEM_ALIASES = {
    concept_finder_tools: [],
    knowledge_masking: [],
    guided_routes: [],
    course_diagnostics: [],
    logic_operators: [],
    self_test_mode: [],
    ai_mastery_checks: []
  };
  const FUNCTIONAL_ITEMS_NOW_FREE = new Set(["knowledge_masking", "guided_routes", "course_diagnostics", "logic_operators", "self_test_mode", "ai_mastery_checks", "concept_finder_tools"]);


  const XP_RULES = {
    active_day: { xp: 4, dailyCap: 4, category: "Reading" },
    view: { xp: 0.15, dailyCap: 6, category: "Reading", repeat: 0.20 },
    saved_page_action: { xp: 1, dailyCap: 3, category: "Saved pages", repeat: 0.25 },
    saved_page_visit: { xp: 1.5, dailyCap: 6, category: "Saved pages" },
    mastery: { xp: 1, dailyCap: 10, category: "Learning", repeat: 0.30 },
    ai_quiz: { xp: 8, dailyCap: 40, category: "Learning", repeat: 0.40 },
    guided_study_start: { xp: 1, dailyCap: 3, category: "Learning", repeat: 0.50 },
    map_open: { xp: 1, dailyCap: 2, category: "Learning", repeat: 0.25 },
    prerequisite_readiness_open: { xp: 0.3, dailyCap: 1.5, category: "Learning", repeat: 0.50 },
    course_diagnostics_open: { xp: 0.3, dailyCap: 1.2, category: "Learning", repeat: 0.50 },
    course_search: { xp: 0.2, dailyCap: 1, category: "Learning", repeat: 0.50 },
    concept_finder_open: { xp: 0.3, dailyCap: 1.2, category: "Learning", repeat: 0.50 },
    random_browse_start: { xp: 0.5, dailyCap: 2, category: "Learning", repeat: 0.50 },
    search_suggestion: { xp: 0.2, dailyCap: 1, category: "Learning" },
    sort_use: { xp: 0.05, dailyCap: 0.5, category: "Learning" },
    panel_open: { xp: 0.2, dailyCap: 1, category: "Learning", repeat: 0.25 },
    comment: { xp: 8, dailyCap: 32, category: "Community", repeat: 0.50 },
    reply: { xp: 5, dailyCap: 25, category: "Community", repeat: 0.50 },
    reaction_given: { xp: 0.5, dailyCap: 5, category: "Community", repeat: 0.50 },
    reaction_received: { xp: 1, dailyCap: 10, category: "Community" },
    mention_given: { xp: 0.5, dailyCap: 3, category: "Community" },
    mention_received: { xp: 1, dailyCap: 5, category: "Community" },
    comment_edit: { xp: 0.2, dailyCap: 1, category: "Community" },
    report: { xp: 1, dailyCap: 3, category: "Community", repeat: 0.50 },
    bug_report: { xp: 4, dailyCap: 12, category: "Community", repeat: 0.50 },
    account_tab_open: { xp: 0.05, dailyCap: 0.5, category: "Account" },
    notification_read: { xp: 1, dailyCap: 3, category: "Account" },
    avatar_upload: { xp: 5, dailyCap: 5, category: "Account", repeat: 0.25 },
    intro_update: { xp: 3, dailyCap: 3, category: "Account", repeat: 0.25 },
    privacy_update: { xp: 3, dailyCap: 3, category: "Account", oneTime: true },
    sync_device_connected: { xp: 2, dailyCap: 4, category: "Account" },
    connection_request: { xp: 1, dailyCap: 3, category: "Connections", repeat: 0.25 },
    connection_added: { xp: 5, dailyCap: 10, category: "Connections", repeat: 0.25 }
  };


  const ACCOUNT_SCORE_STATE_VERSION = 2;
  const ACCOUNT_SCORE_STATE_MAX_DAYS = 120;
  const ACCOUNT_SCORE_STATE_MAX_APPLIED_DAYS = 14;
  const ACCOUNT_SCORE_STATE_MAX_SEEN_PER_METRIC = 6500;
  const ACCOUNT_XP_LIGHT_CACHE_SCHEMA_VERSION = 6;
  const ACCOUNT_XP_LIGHT_CACHE_KEY_PREFIX = "mk_account_xp_light_cache_v1:";
  const ACCOUNT_XP_LIGHT_CACHE_LATEST_KEY = "mk_account_xp_light_cache_latest_v1";

  function now() { return Date.now(); }
  function clampText(value, max) { return String(value == null ? "" : value).slice(0, max || 500); }
  function dayKey(ts) {
    const d = new Date(Number(ts || Date.now()) || Date.now());
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  }
  function uid(prefix) {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === "function") return `${prefix || "id"}_${window.crypto.randomUUID()}`;
    } catch (_) {}
    return `${prefix || "id"}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
  }
  function fastStringHash(text) {
    const s = String(text || "");
    let h = 2166136261;
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }
  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const obj = JSON.parse(raw);
      return obj == null ? fallback : obj;
    } catch (_) { return fallback; }
  }
  // Version counter for the inputs of deriveState (the account file + the pending
  // events queue). Bumped on every successful write so the current-state memo can
  // invalidate in O(1) without re-reading or re-parsing the whole ledger.
  let __mkAccountDataVersion = 0;
  function bumpAccountDataVersion() { __mkAccountDataVersion = (__mkAccountDataVersion + 1) >>> 0; }
  function writeJson(key, value) {
    try {
      const text = JSON.stringify(value);
      localStorage.setItem(key, text);
      // Mobile Safari may accept setItem under pressure and then leave the old
      // value behind after a quota/storage eviction edge case.  Verify the write
      // so mastery and quiz XP do not look saved only until the next refresh.
      const ok = localStorage.getItem(key) === text;
      if (ok && (key === LOCAL_FILE_KEY || key === LOCAL_PENDING_EVENTS_KEY)) bumpAccountDataVersion();
      return ok;
    } catch (_) { return false; }
  }
  function localStorageApproxBytes() {
    let total = 0;
    try {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i) || "";
        const value = localStorage.getItem(key) || "";
        total += (key.length + value.length) * 2;
      }
    } catch (_) {}
    return total;
  }

  function removeLocalStorageKey(key) {
    try { if (key) localStorage.removeItem(key); } catch (_) {}
  }

  function reclaimAccountStorageSpace(reason, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const aggressive = !!options.aggressive;
    const exact = [
      LOCAL_FILE_BACKUP_KEY,
      ACCOUNT_SYNC_LAST_RESULT_KEY,
      ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY,
      "mk_account_json_sync_last_result_v1",
      "mk_account_xp_cache_v1",
      "mk_search_suggestion_cache_v1",
      "mk_search_history_v1",
      "mk_account_xp_complete_cache_v1",
      "mk_account_mastery_json_snapshot_fingerprint_v1",
      "mk_ai_quiz_session_sync_fingerprint_v1"
    ];
    const legacyMirrors = [
      LEGACY_VISITS_KEY,
      LEGACY_PAGE_ACTIONS_KEY,
      LEGACY_FAVORITES_KEY,
      LEGACY_READINESS_KEY,
      LEGACY_AIQ_KEY
    ];
    const aggressiveKeys = legacyMirrors.concat([
      LEGACY_MASTERY_KEY,
      PENDING_XP_ACTIVITY_QUEUE_KEY,
      SHOP_TRIAL_SKIP_PRELOAD_KEY
    ]);
    const prefixes = [
      "mk_search_history",
      "mk_search_suggest",
      "mk_hot_cache",
      "mk_account_xp_cache",
      "mk_account_xp_complete_cache",
      "mk_ai_quiz_xp_seen",
      "mk_account_sync_last_summary",
      "mk_account_debug",
      "mk_sync_debug",
      "mk_hot_api_get_cache",
      "__mk_views30d_cache"
    ];
    exact.forEach(removeLocalStorageKey);
    if (aggressive) aggressiveKeys.forEach(removeLocalStorageKey);
    try {
      for (let i = localStorage.length - 1; i >= 0; i -= 1) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key === LOCAL_FILE_KEY || key === PROFILE_KEY || key === VISITOR_ID_KEY || key === DEVICE_ID_KEY || key === DEVICE_NAME_KEY) continue;
        if (!aggressive && key === LEGACY_MASTERY_KEY) continue;
        if (prefixes.some((prefix) => key.indexOf(prefix) === 0)) removeLocalStorageKey(key);
      }
    } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("mk-account-storage-compacted", { detail: { reason: reason || "storage-pressure", aggressive, approxBytes: localStorageApproxBytes() } })); } catch (_) {}
  }

  function isAccountScoreBaselineEvent(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const d = e.details && typeof e.details === "object" ? e.details : {};
    const metric = String(e.metric || d.metric || e.type || "").trim().toLowerCase();
    return metric === "account_score_baseline" || metric === "account_currency_baseline" || e.type === "account_score_baseline";
  }
  function accountScoreBaselineXp(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const d = e.details && typeof e.details === "object" ? e.details : {};
    const raw = d.xpDelta != null ? d.xpDelta : (d.scoreDelta != null ? d.scoreDelta : (d.totalScoreDelta != null ? d.totalScoreDelta : (e.score != null ? e.score : 0)));
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  function accountScoreBaselineCurrency(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const d = e.details && typeof e.details === "object" ? e.details : {};
    const raw = d.currencyDelta != null ? d.currencyDelta : (d.eorbitsDelta != null ? d.eorbitsDelta : (d.balanceDelta != null ? d.balanceDelta : (e.value != null ? e.value : 0)));
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  // Absolute full-history snapshots stored on the baseline (for the FLOOR model,
  // matching the Worker). Summing per-device deltas double-counted XP/EORbits and
  // made the local panel read far higher than the events-only cloud value.
  function accountScoreBaselineCanonicalXp(ev) {
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const raw = d.canonicalTotalScore != null ? d.canonicalTotalScore : (d.totalScore != null ? d.totalScore : null);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  function accountScoreBaselineCanonicalCurrency(ev) {
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const raw = d.canonicalCurrencyBalance != null ? d.canonicalCurrencyBalance : (d.currencyBalance != null ? d.currencyBalance : (d.eorbits != null ? d.eorbits : null));
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  function accountScoreBaselineSourceEventCount(ev) {
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const n = Number(d.sourceEventCount || d.canonicalEventCount || 0);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  function accountScoreBaselineCompactEventCount(ev) {
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const n = Number(d.compactEventCount || d.cachedEventCount || 0);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  function accountScoreBaselineApplies(ev, nonBaselineEventCount) {
    if (!isAccountScoreBaselineEvent(ev)) return false;
    const sourceCount = accountScoreBaselineSourceEventCount(ev);
    const count = Math.max(0, Number(nonBaselineEventCount || 0) || 0);
    // A compact baseline preserves the XP/EORbits of events that were dropped from
    // a compact local cache. It must keep applying while those old events are still
    // absent — including after the user records new activity. It is redundant only
    // once a later sync has recovered (nearly) the full ORIGINAL ledger, which is
    // the only safe condition for dropping it.
    //
    // The previous `count > compactCount + buffer` heuristic dropped the baseline
    // as soon as enough NEW activity accumulated, even though new events never
    // recover the old dropped ones. On storage-constrained devices that made XP
    // and (especially uncapped) EORbits collapse after a bit of activity. Only the
    // genuine full-recovery guard below is kept.
    if (sourceCount && count >= Math.max(0, sourceCount - 1)) return false;
    return true;
  }
  function withoutAccountScoreBaselineEvents(events) {
    return (Array.isArray(events) ? events : []).filter((ev) => !isAccountScoreBaselineEvent(ev));
  }

  function eventBucketForStorage(ev) {
    const metric = String(ev && ev.metric || "").toLowerCase();
    const type = String(ev && ev.type || "").toLowerCase();
    if (isAccountScoreBaselineEvent(ev)) return "baseline";
    if (type === "mastery_set" || metric === "mastery") return "mastery";
    if (type === "ai_quiz_complete" || metric === "ai_quiz") return "ai_quiz";
    if (type === "page_action_set" || metric === "saved_page_action") return "page_action";
    if (type.indexOf("shop_") === 0 || metric.indexOf("shop_") === 0 || metric.indexOf("currency") >= 0 || metric.indexOf("eorbit") >= 0) return "shop";
    if (type === "wiki_open" || metric === "active_day") return "active_day";
    if (type === "page_visit" || metric === "view" || metric === "saved_page_visit") return "view";
    if (type.indexOf("readiness") >= 0 || metric === "prerequisite_readiness_open") return "readiness";
    if (["comment", "reply", "comment_edit", "report"].includes(metric) || type.indexOf("comment") >= 0) return "comment";
    return "other";
  }

  function compactEventLogForStorage(events, mode) {
    const input = (Array.isArray(events) ? events : []).map(normaliseEvent).filter(Boolean);
    const byId = new Map();
    input.forEach((ev) => {
      const old = byId.get(ev.id);
      if (!old || Number(ev.updatedAt || ev.ts || 0) >= Number(old.updatedAt || old.ts || 0)) byId.set(ev.id, ev);
    });
    const all = Array.from(byId.values()).sort((a, b) => Number(a.ts || 0) - Number(b.ts || 0));
    const capsByMode = {
      standard: { total: 22000, baseline: 50, view: 6500, active_day: 900, mastery: 7000, ai_quiz: 3500, page_action: 5000, readiness: 2500, comment: 2500, shop: 5000, other: 3500 },
      mobile: { total: 12000, baseline: 50, view: 2500, active_day: 500, mastery: 4000, ai_quiz: 2200, page_action: 3000, readiness: 1200, comment: 1200, shop: 3000, other: 1500 },
      critical: { total: 5500, baseline: 50, view: 900, active_day: 370, mastery: 1800, ai_quiz: 1000, page_action: 1500, readiness: 500, comment: 500, shop: 1500, other: 600 },
      lean: { total: 2600, baseline: 50, view: 360, active_day: 220, mastery: 900, ai_quiz: 450, page_action: 700, readiness: 260, comment: 220, shop: 900, other: 260 },
      tiny: { total: 1200, baseline: 50, view: 160, active_day: 120, mastery: 420, ai_quiz: 180, page_action: 360, readiness: 120, comment: 100, shop: 520, other: 120 },
      emergency: { total: 520, baseline: 50, view: 60, active_day: 60, mastery: 180, ai_quiz: 70, page_action: 180, readiness: 50, comment: 40, shop: 260, other: 60 }
    };
    const caps = capsByMode[mode] || capsByMode.standard;
    const pinned = new Map();

    // Never lose the current mastery rating for a concept, the current saved/
    // unsaved state, or shop/account transactions.  These are the records whose
    // disappearance is most visible after a refresh.
    const latestMastery = new Map();
    const latestAction = new Map();
    all.forEach((ev) => {
      const bucket = eventBucketForStorage(ev);
      const t = Number(ev.updatedAt || ev.ts || 0) || 0;
      if (bucket === "mastery" && normalisePath(ev.path || "") && shouldUseMasteryEvent(ev)) {
        const key = normalisePath(ev.path || "");
        const old = latestMastery.get(key);
        if (!old || t >= Number(old.updatedAt || old.ts || 0)) latestMastery.set(key, ev);
      } else if (bucket === "page_action" && normalisePath(ev.path || "")) {
        const key = `${normalisePath(ev.path || "")}::${ev.action || ev.details && ev.details.action || ""}`;
        const old = latestAction.get(key);
        if (!old || shouldReplacePageActionEvent({ updatedAt: old.updatedAt || old.ts, ts: old.ts, seed: isSeedPageActionEvent(old) }, ev, t)) latestAction.set(key, ev);
      } else if (bucket === "shop" || bucket === "baseline") {
        pinned.set(ev.id, ev);
      }
    });
    latestMastery.forEach((ev) => pinned.set(ev.id, ev));
    latestAction.forEach((ev) => pinned.set(ev.id, ev));

    const byBucket = new Map();
    all.forEach((ev) => {
      if (pinned.has(ev.id)) return;
      const bucket = eventBucketForStorage(ev);
      if (!byBucket.has(bucket)) byBucket.set(bucket, []);
      byBucket.get(bucket).push(ev);
    });
    const selected = new Map(pinned);
    Object.entries(caps).forEach(([bucket, cap]) => {
      if (bucket === "total") return;
      const list = byBucket.get(bucket) || [];
      list.sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0));
      list.slice(0, Math.max(0, Number(cap) || 0)).forEach((ev) => selected.set(ev.id, ev));
    });

    let out = Array.from(selected.values());
    if (out.length > caps.total) {
      out.sort((a, b) => {
        const ba = eventBucketForStorage(a);
        const bb = eventBucketForStorage(b);
        const weight = { baseline: 120, shop: 100, mastery: 95, page_action: 90, ai_quiz: 85, readiness: 65, comment: 55, active_day: 40, other: 35, view: 20 };
        return (Number(weight[bb] || 0) - Number(weight[ba] || 0)) || (Number(b.ts || 0) - Number(a.ts || 0));
      });
      out = out.slice(0, caps.total);
    }
    return out.sort((a, b) => (Number(a.ts || 0) - Number(b.ts || 0)) || String(a.id || "").localeCompare(String(b.id || "")));
  }

  let __mkCompactFullScoreSig = "";
  let __mkCompactFullScoreVal = null;
  function compactFileForStorage(file, mode) {
    const clean = normaliseFile(file || readFile());
    const compactMode = mode || "standard";
    // v81: compact caches must not change the visible account economy.  When a
    // device cannot keep the full history locally, old activity events can be
    // dropped from the cache, but the score/EORbits earned by the dropped
    // history must remain as a compact baseline.  The baseline is syncable only
    // while the full dropped history is absent; if a later merge recovers the
    // complete event ledger, the baseline is ignored and removed from the merge.
    const allEvents = clean.eventLog || [];
    const sourceEvents = withoutAccountScoreBaselineEvents(allEvents);
    // CRITICAL: the "full" economy reference must include any baseline already in
    // the file, so re-compacting an already-compacted cache never discards the
    // XP/EORbits a previous baseline preserved. Computing fullScore from the
    // baseline-stripped events would make currency drift down on every repeated
    // storage-pressure compaction.
    const priorSourceCount = allEvents.reduce((mx, ev) => isAccountScoreBaselineEvent(ev) ? Math.max(mx, accountScoreBaselineSourceEventCount(ev)) : mx, 0);
    // persistFileForSync / writeFile retry compaction across up to 6 modes with the
    // SAME input file. The full-history XP score is identical every time, so
    // memoise it by a cheap signature to avoid recomputing xpFromFile (an O(n)
    // ledger pass) once per mode on every storage-pressure write.
    const lastEv = allEvents.length ? allEvents[allEvents.length - 1] : null;
    const sourceSig = allEvents.length + "|" + sourceEvents.length + "|" + (lastEv ? `${lastEv.id || ""}:${lastEv.updatedAt || lastEv.ts || ""}` : "");
    let fullScore;
    if (sourceSig && sourceSig === __mkCompactFullScoreSig && __mkCompactFullScoreVal) {
      fullScore = __mkCompactFullScoreVal;
    } else {
      fullScore = xpFromFile(clean);
      __mkCompactFullScoreSig = sourceSig;
      __mkCompactFullScoreVal = fullScore;
    }
    const compactedEvents = compactEventLogForStorage(sourceEvents, compactMode);
    const compactFile = Object.assign({}, clean, { eventLog: compactedEvents });
    const compactScore = xpFromFile(compactFile);
    const xpDelta = round(Number(fullScore.totalScore || 0) - Number(compactScore.totalScore || 0));
    const currencyDelta = round(Number(fullScore.currencyBalance || fullScore.eorbits || 0) - Number(compactScore.currencyBalance || compactScore.eorbits || 0));
    const outEvents = compactedEvents.slice();
    if (Math.abs(xpDelta) > 0.000001 || Math.abs(currencyDelta) > 0.000001) {
      const newestTs = sourceEvents.reduce((mx, ev) => Math.max(mx, Number(ev && (ev.updatedAt || ev.ts || 0)) || 0), 0) || now();
      const baselineId = `account_score_baseline:${accountKey() || getVisitorId()}:${compactMode}:${fastStringHash([sourceEvents.length, fullScore.totalScore, fullScore.currencyBalance, compactScore.totalScore, compactScore.currencyBalance].join("|"))}`;
      const baseline = normaliseEvent({
        id: baselineId,
        type: "account_score_baseline",
        metric: "account_score_baseline",
        score: xpDelta,
        value: currencyDelta,
        ts: newestTs,
        createdAt: newestTs,
        updatedAt: newestTs,
        title: "Compact account cache baseline",
        details: {
          source: "compact-local-cache-baseline",
          localOnly: true,
          compactMode,
          xpDelta,
          currencyDelta,
          eorbitsDelta: currencyDelta,
          canonicalTotalScore: Number(fullScore.totalScore || 0),
          compactTotalScore: Number(compactScore.totalScore || 0),
          canonicalCurrencyBalance: Number(fullScore.currencyBalance || fullScore.eorbits || 0),
          compactCurrencyBalance: Number(compactScore.currencyBalance || compactScore.eorbits || 0),
          // Carry the ORIGINAL full event count forward so the recovery guard only
          // drops this baseline once the full original ledger is genuinely back,
          // not once the (already reduced) current ledger is matched.
          sourceEventCount: Math.max(sourceEvents.length, priorSourceCount),
          compactEventCount: compactedEvents.length
        }
      });
      if (baseline) outEvents.push(baseline);
    }
    clean.eventLog = outEvents;
    clean.updatedAt = now();
    return normaliseFile(clean);
  }

  function compactForStorage(reason) {
    reclaimAccountStorageSpace(reason || "manual-compact");
    let file = readFile();
    const attempts = ["standard", "mobile", "critical", "lean", "tiny", "emergency"];
    for (const mode of attempts) {
      const compacted = compactFileForStorage(file, mode);
      if (writeJson(LOCAL_FILE_KEY, compacted)) {
        try { applyLegacyMirrors(compacted); } catch (_) {}
        return { ok: true, mode, stats: statsForFile(compacted), approxBytes: localStorageApproxBytes() };
      }
      file = compacted;
      reclaimAccountStorageSpace(`${reason || "manual-compact"}:${mode}`);
    }
    try { window.dispatchEvent(new CustomEvent("mk-storage-write-problem", { detail: { key: LOCAL_FILE_KEY, source: "account-compact", reason: reason || "manual-compact" } })); } catch (_) {}
    return { ok: false, stats: statsForFile(file), approxBytes: localStorageApproxBytes() };
  }

  function syncStatsTotal(stats) {
    try { return Math.max(0, Number(stats && stats.total || 0) || 0); } catch (_) { return 0; }
  }
  function syncStatsMax(a, b) {
    const aa = a && typeof a === "object" ? a : null;
    const bb = b && typeof b === "object" ? b : null;
    if (!aa) return bb;
    if (!bb) return aa;
    const out = { total: Math.max(syncStatsTotal(aa), syncStatsTotal(bb)), stores: {} };
    const keys = new Set(Object.keys(aa.stores || {}).concat(Object.keys(bb.stores || {})));
    keys.forEach((key) => { out.stores[key] = Math.max(0, Number(aa.stores && aa.stores[key] || 0) || 0, Number(bb.stores && bb.stores[key] || 0) || 0); });
    return out;
  }
  function readConfirmedCloudRecord() {
    const candidates = [];
    const push = (x) => { if (x && typeof x === "object") candidates.push(x); };
    try { push(readJson(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY, null)); } catch (_) {}
    try {
      const raw = sessionStorage.getItem(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY);
      if (raw) push(JSON.parse(raw));
    } catch (_) {}
    if (!candidates.length) return null;
    const currentAk = String(accountKey() || "").trim().toLowerCase();
    candidates.sort((a, b) => syncStatsTotal(b && b.cloudStats) - syncStatsTotal(a && a.cloudStats) || Number(b && (b.finishedAt || b.updatedAt) || 0) - Number(a && (a.finishedAt || a.updatedAt) || 0));
    for (const c of candidates) {
      const key = String(c && c.accountKey || "").trim().toLowerCase();
      if (!currentAk || !key || key === currentAk) return c;
    }
    return null;
  }
  function confirmedCloudSummaryFallback(errorText) {
    const rec = readConfirmedCloudRecord();
    if (!rec || !rec.cloudStats) return null;
    const ts = Number(rec.finishedAt || rec.updatedAt || 0) || Date.now();
    return {
      ok: true,
      schema: "mk-account-confirmed-cloud-summary",
      cloudDisplayOnly: true,
      staleCloudStatus: true,
      cloudStatusError: errorText || "Could not refresh cloud status.",
      accountKey: rec.accountKey || accountKey(),
      deviceName: getDeviceName(),
      uploaded: { total: 0, stores: {} },
      downloaded: { total: 0, stores: {} },
      afterLocal: statsForFile(readFile()),
      server: { after: rec.cloudStats, reportedAfter: rec.rawServer || rec.cloudStats, displayOnly: true, stale: true, updatedAt: ts },
      updatedAt: ts,
      finishedAt: 0,
      statusReason: "cached-cloud-status-fallback"
    };
  }

  function compactSyncSummaryForFile(summary) {
    const s = summary && typeof summary === "object" ? summary : null;
    if (!s) return null;
    return {
      ok: s.ok !== false,
      schema: s.schema || "mk-account-data-sync-summary",
      accountKey: s.accountKey || accountKey(),
      deviceName: s.deviceName || getDeviceName(),
      uploaded: s.uploaded && typeof s.uploaded === "object" ? s.uploaded : { total: 0, stores: {} },
      downloaded: s.downloaded && typeof s.downloaded === "object" ? s.downloaded : { total: 0, stores: {} },
      beforeLocal: s.beforeLocal && typeof s.beforeLocal === "object" ? s.beforeLocal : null,
      beforeCloud: s.beforeCloud && typeof s.beforeCloud === "object" ? s.beforeCloud : null,
      afterLocal: s.afterLocal && typeof s.afterLocal === "object" ? s.afterLocal : null,
      afterCanonical: s.afterCanonical && typeof s.afterCanonical === "object" ? s.afterCanonical : null,
      localCompactedCache: !!s.localCompactedCache,
      compactMode: s.compactMode || "",
      server: s.server && typeof s.server === "object" ? {
        after: s.server.after && typeof s.server.after === "object" ? s.server.after : null,
        reportedAfter: s.server.reportedAfter && typeof s.server.reportedAfter === "object" ? s.server.reportedAfter : null,
        verifiedAfter: s.server.verifiedAfter && typeof s.server.verifiedAfter === "object" ? s.server.verifiedAfter : null,
        statsAgree: !!s.server.statsAgree,
        localCloudExact: s.server.localCloudExact === true,
        cloudCanonicalExact: s.server.cloudCanonicalExact === true,
        localCompactedCache: !!s.server.localCompactedCache,
        localFingerprint: s.server.localFingerprint && typeof s.server.localFingerprint === "object" ? s.server.localFingerprint : null,
        canonicalFingerprint: s.server.canonicalFingerprint && typeof s.server.canonicalFingerprint === "object" ? s.server.canonicalFingerprint : null,
        cloudFingerprint: s.server.cloudFingerprint && typeof s.server.cloudFingerprint === "object" ? s.server.cloudFingerprint : null,
        difference: s.server.difference && typeof s.server.difference === "object" ? s.server.difference : null,
        canonicalDifference: s.server.canonicalDifference && typeof s.server.canonicalDifference === "object" ? s.server.canonicalDifference : null,
        updatedAt: Number(s.server.updatedAt || 0) || 0,
        seededFromCanonical: !!s.server.seededFromCanonical,
        seedSource: s.server.seedSource || ""
      } : null,
      lastProgress: s.lastProgress && typeof s.lastProgress === "object" ? s.lastProgress : null,
      failureStep: s.failureStep && typeof s.failureStep === "object" ? s.failureStep : null,
      error: s.error || "",
      xp: s.xp && typeof s.xp === "object" ? {
        totalScore: Number(s.xp.totalScore || s.xp.totalXp || s.xp.score || 0) || 0,
        totalXp: Number(s.xp.totalXp || s.xp.totalScore || s.xp.score || 0) || 0,
        score: Number(s.xp.score || s.xp.totalScore || s.xp.totalXp || 0) || 0,
        currencyBalance: Number(s.xp.currencyBalance != null ? s.xp.currencyBalance : s.xp.eorbits || 0) || 0,
        eorbits: Number(s.xp.eorbits != null ? s.xp.eorbits : s.xp.currencyBalance || 0) || 0,
        totalCurrencyEarned: Number(s.xp.totalCurrencyEarned || s.xp.currencyEarned || 0) || 0,
        currencyEarned: Number(s.xp.currencyEarned || s.xp.totalCurrencyEarned || 0) || 0,
        currencyCredited: Number(s.xp.currencyCredited || 0) || 0,
        currencySpent: Number(s.xp.currencySpent || 0) || 0
      } : null,
      updatedAt: Number(s.updatedAt || Date.now()) || Date.now(),
      finishedAt: Number(s.finishedAt || s.updatedAt || Date.now()) || Date.now(),
      elapsedMs: Number(s.elapsedMs || 0) || 0
    };
  }
  function writeSyncSummaryEverywhere(summary) {
    const s = summary && typeof summary === "object" ? summary : null;
    if (!s) return false;
    try { writeJson(LOCAL_SYNC_SUMMARY_KEY, s); } catch (_) {}
    try { writeJson(ACCOUNT_SYNC_LAST_RESULT_KEY, s); } catch (_) {}
    try { writeJson(ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY, s); } catch (_) {}
    try { sessionStorage.setItem(LOCAL_SYNC_SUMMARY_KEY, JSON.stringify(s)); } catch (_) {}
    try { sessionStorage.setItem(ACCOUNT_SYNC_LAST_RESULT_KEY, JSON.stringify(s)); } catch (_) {}
    try {
      if (s.xp && typeof s.xp === "object") writeScoreStateSidecar(scoreStateFromXp(s.xp, { source: "sync-summary-cache", lastFullRebuildAt: s.finishedAt || s.updatedAt || Date.now(), updatedAt: s.finishedAt || s.updatedAt || Date.now() }));
      const file = readFile();
      file.syncSummary = compactSyncSummaryForFile(s);
      if (s.xp && typeof s.xp === "object") file.scoreState = scoreStateFromXp(s.xp, { source: "sync-summary-cache", lastFullRebuildAt: s.finishedAt || s.updatedAt || Date.now(), updatedAt: s.finishedAt || s.updatedAt || Date.now() });
      writeFile(file, { source: "sync-summary-cache", skipMirrors: true });
    } catch (_) {}
    if (s.ok === false) return true;
    try {
      const cloudStatsRaw = s.server && s.server.after && typeof s.server.after === "object" ? s.server.after : (s.afterCanonical && typeof s.afterCanonical === "object" ? s.afterCanonical : (s.afterLocal && typeof s.afterLocal === "object" ? s.afterLocal : null));
      const existing = readConfirmedCloudRecord();
      const existingKey = String(existing && existing.accountKey || "").trim().toLowerCase();
      const currentKey = String(s.accountKey || accountKey() || "").trim().toLowerCase();
      const existingStats = existing && (!existingKey || !currentKey || existingKey === currentKey) ? existing.cloudStats : null;
      const cloudStats = syncStatsMax(cloudStatsRaw, existingStats);
      if (cloudStats && syncStatsTotal(cloudStats) > 0) {
        const rec = {
          ok: true,
          accountKey: s.accountKey || accountKey(),
          cloudStats,
          afterLocal: s.afterLocal || cloudStats,
          rawServer: s.server && (s.server.reportedAfter || s.server.after || s.server.stats) || cloudStatsRaw || null,
          source: s.schema || "mk-account-data-sync-summary",
          displayOnly: !!(s.cloudDisplayOnly || s.server && s.server.displayOnly),
          stale: !!(s.staleCloudStatus || s.server && s.server.stale),
          deviceName: s.deviceName || getDeviceName(),
          updatedAt: Math.max(Number(existing && (existing.finishedAt || existing.updatedAt) || 0) || 0, Number(s.finishedAt || s.updatedAt || Date.now()) || Date.now()),
          finishedAt: Math.max(Number(existing && (existing.finishedAt || existing.updatedAt) || 0) || 0, Number(s.finishedAt || s.updatedAt || Date.now()) || Date.now())
        };
        try { localStorage.setItem(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY, JSON.stringify(rec)); } catch (_) {}
        try { sessionStorage.setItem(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY, JSON.stringify(rec)); } catch (_) {}
      }
    } catch (_) {}
    return true;
  }
  function getVisitorId() {
    try {
      let id = localStorage.getItem(VISITOR_ID_KEY);
      if (!id) {
        id = `v_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
        localStorage.setItem(VISITOR_ID_KEY, id);
      }
      return id;
    } catch (_) { return "anon"; }
  }
  function getDeviceId() {
    try {
      let id = localStorage.getItem(DEVICE_ID_KEY);
      if (!id) { id = uid("dev"); localStorage.setItem(DEVICE_ID_KEY, id); }
      return id;
    } catch (_) { return "device"; }
  }
  function getDeviceName() {
    try { return clampText(localStorage.getItem(DEVICE_NAME_KEY) || "", 80) || "This device"; } catch (_) { return "This device"; }
  }
  function readProfile() {
    const p = readJson(PROFILE_KEY, {}) || {};
    return p && typeof p === "object" ? p : {};
  }
  function accountKey() {
    const p = readProfile();
    return clampText(p.accountKey || p.account_key || p.nameKey || p.name_key || "", 160).trim();
  }

  function getSiteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link = document.querySelector('link[href*="assets/stylesheets/main"]') || document.querySelector('link[href*="assets/stylesheets"]');
    const attr = script ? script.getAttribute("src") : (link ? link.getAttribute("href") : null);
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);
    const p = assetUrl.pathname;
    const idx = p.indexOf("/assets/");
    if (idx >= 0) return assetUrl.origin + p.slice(0, idx + 1);
    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }
  function relPathFromSiteRoot(absPathname) {
    let p = String(absPathname || window.location.pathname || "");
    try {
      const siteRoot = new URL(getSiteRootUrl());
      const rootPath = siteRoot.pathname.endsWith("/") ? siteRoot.pathname : `${siteRoot.pathname}/`;
      if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
    } catch (_) {}
    return p.replace(/^\/+/, "").split("#")[0].split("?")[0];
  }
  function currentPath() { return relPathFromSiteRoot(window.location.pathname); }
  function isConceptRelPath(relPath) {
    const p = String(relPath || "").replace(/^\/+/, "");
    const low = p.toLowerCase();
    if (!low || !low.endsWith(".html")) return false;
    if (low === "index.html" || low.endsWith("/index.html")) return false;
    const bad = ["assets/", "search", "find", "sitemap", "404", "random", "trending", "contributors"];
    if (bad.some((x) => low.includes(x))) return false;
    if (low.startsWith("about/") || low === "about.html" || low.startsWith("how-it-works/") || low === "how-it-works.html" || low.includes("about-this-wiki")) return false;
    return true;
  }
  function cleanPageTitleText(t) {
    return String(t || "").replace(/¶/g, "").replace(/\s+-\s+BSc EOR Wiki\s*$/i, "").replace(/\s*¶+\s*$/g, "").replace(/\s+/g, " ").trim();
  }
  function titleLooksLikePath(t) {
    const s = String(t || "").trim();
    return /^https?:\/\//i.test(s) || (/\.html(?:[#?].*)?$/i.test(s) && s.includes("/"));
  }
  function titleFromH1() {
    const h1 = document.querySelector("article.md-content__inner h1") || document.querySelector(".md-content h1") || document.querySelector("h1");
    if (!h1) return "";
    const clone = h1.cloneNode(true);
    clone.querySelectorAll("button, svg, .mk-fav-h1-btn, .mk-trending-h1-hot, .lp-h1-map, .lp-h1-gps, .lp-h1-tool-btn").forEach((n) => { try { n.remove(); } catch (_) {} });
    return cleanPageTitleText(clone.textContent || "");
  }
  function currentTitle() {
    const h1Title = titleFromH1();
    if (h1Title && !titleLooksLikePath(h1Title)) return h1Title;
    const docTitle = cleanPageTitleText(document.title || "");
    if (docTitle && !titleLooksLikePath(docTitle)) return docTitle;
    return "";
  }

  function emptyFile() {
    const t = now();
    return {
      schema: "mk-account-data-file",
      version: 1,
      createdAt: t,
      updatedAt: t,
      accountKey: accountKey(),
      deviceId: getDeviceId(),
      deviceName: getDeviceName(),
      eventLog: [],
      scoreState: emptyScoreState({ source: "empty-account-file" })
    };
  }

  function readScoreStateSidecar() {
    try {
      const st = readJson(LOCAL_SCORE_STATE_KEY, null);
      if (!st || typeof st !== "object" || Array.isArray(st)) return null;
      const currentKey = String(accountKey() || "").trim().toLowerCase();
      const stateKey = String(st.accountKey || "").trim().toLowerCase();
      if (currentKey && stateKey && currentKey !== stateKey) return null;
      return normaliseScoreState(st);
    } catch (_) { return null; }
  }

  function writeScoreStateSidecar(scoreState) {
    try {
      const st = normaliseScoreState(scoreState || emptyScoreState({ source: "sidecar-empty" }));
      writeJson(LOCAL_SCORE_STATE_KEY, st);
      const score = scoreStateToXp(st, null);
      writeAccountXpLightCache(score);
      return st;
    } catch (_) { return null; }
  }

  function readPendingEvents() {
    try {
      const rows = readJson(LOCAL_PENDING_EVENTS_KEY, []);
      if (!Array.isArray(rows)) return [];
      const map = new Map();
      rows.forEach((row) => {
        const ev = normaliseEvent(row);
        if (!ev) return;
        const old = map.get(ev.id);
        if (!old || Number(ev.updatedAt || ev.ts || 0) >= Number(old.updatedAt || old.ts || 0)) map.set(ev.id, ev);
      });
      return Array.from(map.values()).sort((a, b) => (Number(a.ts || 0) - Number(b.ts || 0)) || String(a.id || "").localeCompare(String(b.id || ""))).slice(-5000);
    } catch (_) { return []; }
  }

  function pendingEventCount() {
    try { return readPendingEvents().length; } catch (_) { return 0; }
  }

  function writePendingEvents(events) {
    try {
      const rows = (Array.isArray(events) ? events : []).map(normaliseEvent).filter(Boolean).slice(-5000);
      return writeJson(LOCAL_PENDING_EVENTS_KEY, rows);
    } catch (_) { return false; }
  }

  function clearPendingEvents() {
    try { localStorage.removeItem(LOCAL_PENDING_EVENTS_KEY); bumpAccountDataVersion(); } catch (_) {}
  }

  function appendPendingEvent(ev) {
    const clean = normaliseEvent(ev);
    if (!clean) return false;
    const rows = readPendingEvents();
    const map = new Map(rows.map((row) => [row.id, row]));
    const old = map.get(clean.id);
    if (!old || Number(clean.updatedAt || clean.ts || 0) >= Number(old.updatedAt || old.ts || 0)) map.set(clean.id, clean);
    return writePendingEvents(Array.from(map.values()));
  }


  function scoreStateTotalValue(scoreState) {
    try {
      const st = scoreState && typeof scoreState === "object" ? scoreState : {};
      return Math.max(
        Number(st.totalScore != null ? st.totalScore : (st.totalXp != null ? st.totalXp : st.score)) || 0,
        Number(st.currencyBalance != null ? st.currencyBalance : st.eorbits) || 0,
        Number(st.totalCurrencyEarned != null ? st.totalCurrencyEarned : st.currencyEarned) || 0
      );
    } catch (_) { return 0; }
  }

  function scoreStateAppliedEventCount(scoreState) {
    try {
      const src = scoreState && scoreState.appliedEventIds && typeof scoreState.appliedEventIds === "object" ? scoreState.appliedEventIds : {};
      return Object.values(src).reduce((sum, row) => sum + (row && typeof row === "object" ? Object.keys(row).length : 0), 0);
    } catch (_) { return 0; }
  }

  function scoreStateHistoryRichness(scoreState) {
    try {
      const st = scoreState && typeof scoreState === "object" && !Array.isArray(scoreState) ? scoreState : {};
      let dailyRows = 0;
      let richDailyRows = 0;
      const seenDays = new Set();
      const addDay = (day, row) => {
        const d = String(day || row && row.day || "").slice(0, 10);
        if (!d || seenDays.has(d)) return;
        seenDays.add(d);
        const r = row && typeof row === "object" && !Array.isArray(row) ? row : {};
        const value = Math.abs(Number(r.score != null ? r.score : r.total || 0) || 0) + Math.abs(Number(r.rawScore || 0) || 0) + Math.abs(Number(r.currencyEarned != null ? r.currencyEarned : r.currency || 0) || 0) + Math.abs(Number(r.count || 0) || 0);
        dailyRows += 1;
        if (value > 0.000001) richDailyRows += 1;
      };
      if (st.dailyBuckets && typeof st.dailyBuckets === "object" && !Array.isArray(st.dailyBuckets)) Object.entries(st.dailyBuckets).forEach(([d, row]) => addDay(d, row));
      if (Array.isArray(st.dailySummary)) st.dailySummary.forEach((row) => addDay(row && row.day, row));
      let breakdownRows = 0;
      const br = st.breakdown && typeof st.breakdown === "object" && !Array.isArray(st.breakdown) ? st.breakdown : {};
      Object.values(br).forEach((row) => {
        const r = row && typeof row === "object" ? row : {};
        const value = Math.abs(Number(r.score || 0) || 0) + Math.abs(Number(r.rawScore || 0) || 0) + Math.abs(Number(r.currencyEarned != null ? r.currencyEarned : r.currency || 0) || 0) + Math.abs(Number(r.count || 0) || 0);
        if (value > 0.000001) breakdownRows += 1;
      });
      const applied = scoreStateAppliedEventCount(st);
      const boosts = Array.isArray(st.activeBoosts) ? st.activeBoosts.length : 0;
      return richDailyRows * 8 + dailyRows * 2 + breakdownRows * 6 + Math.min(40, Math.floor(applied / 20)) + boosts;
    } catch (_) { return 0; }
  }

  function scoreStateNeedsHistoryRepair(scoreState, rawFile) {
    try {
      const st = scoreState && typeof scoreState === "object" ? scoreState : null;
      if (!st) return true;
      const events = Array.isArray(rawFile && rawFile.eventLog) ? rawFile.eventLog : [];
      const usefulEventCount = events.filter((ev) => ev && !isAccountScoreBaselineEvent(ev)).length;
      const value = scoreStateTotalValue(st);
      if (usefulEventCount < 8 && value < 10) return false;
      const richness = scoreStateHistoryRichness(st);
      if (value > 0.000001 && richness < 8) return true;
      const br = st.breakdown && typeof st.breakdown === "object" && !Array.isArray(st.breakdown) ? st.breakdown : {};
      const hasBreakdown = Object.values(br).some((row) => {
        const r = row && typeof row === "object" ? row : {};
        return Math.abs(Number(r.score || 0) || 0) + Math.abs(Number(r.rawScore || 0) || 0) + Math.abs(Number(r.currencyEarned != null ? r.currencyEarned : r.currency || 0) || 0) + Math.abs(Number(r.count || 0) || 0) > 0.000001;
      });
      if (usefulEventCount >= 25 && value > 0.000001 && !hasBreakdown) return true;
      const detailRows = Object.values(br).reduce((sum, row) => sum + (Array.isArray(row && row.dailyDetails) ? row.dailyDetails.length : 0), 0);
      if (usefulEventCount >= 25 && hasBreakdown && detailRows === 0) return true;
      return false;
    } catch (_) { return false; }
  }

  function scoreStateLooksIncrementalOnly(scoreState) {
    try {
      const st = scoreState && typeof scoreState === "object" ? scoreState : {};
      const source = String(st.source || "").toLowerCase();
      if (source.includes("lightweight-event-empty") || source.startsWith("record-light:")) return true;
      if (source.includes("incremental-local-event") && !Number(st.lastFullRebuildAt || 0)) return true;
      return false;
    } catch (_) { return false; }
  }

  function scoreStateLooksUnseeded(scoreState, rawFile) {
    try {
      const st = scoreState && typeof scoreState === "object" ? normaliseScoreState(scoreState) : null;
      if (!st) return true;
      const eventCount = Array.isArray(rawFile && rawFile.eventLog) ? rawFile.eventLog.length : 0;
      if (scoreStateNeedsHistoryRepair(st, rawFile)) return true;
      if (eventCount < 25) return false;
      const appliedCount = scoreStateAppliedEventCount(st);
      const value = scoreStateTotalValue(st);
      if (scoreStateLooksIncrementalOnly(st) && appliedCount <= 25 && value < 25) return true;
      if (!Number(st.lastFullRebuildAt || 0) && appliedCount > 0 && appliedCount < Math.max(8, Math.floor(eventCount * 0.03)) && value < 25) return true;
      return false;
    } catch (_) { return false; }
  }

  function bestScoreStateCandidate(candidates) {
    let best = null;
    (Array.isArray(candidates) ? candidates : []).forEach((candidate) => {
      if (!candidate || typeof candidate !== "object") return;
      const st = normaliseScoreState(candidate);
      const currentScore = Number(best && best.totalScore || 0) || 0;
      const nextScore = Number(st.totalScore || 0) || 0;
      const currentCurrency = Number(best && best.currencyBalance || 0) || 0;
      const nextCurrency = Number(st.currencyBalance || 0) || 0;
      const currentRichness = scoreStateHistoryRichness(best);
      const nextRichness = scoreStateHistoryRichness(st);
      const currentAt = Number(best && best.updatedAt || 0) || 0;
      const nextAt = Number(st.updatedAt || 0) || 0;
      if (!best) { best = st; return; }
      const nextMuchRicher = nextRichness > currentRichness + 20 && nextScore >= currentScore - 1.000001 && nextCurrency >= currentCurrency - 5.000001;
      const currentMuchRicher = currentRichness > nextRichness + 20 && currentScore >= nextScore - 1.000001 && currentCurrency >= nextCurrency - 5.000001;
      if (currentMuchRicher) return;
      if (nextMuchRicher
        || nextScore > currentScore + 1.000001
        || (Math.abs(nextScore - currentScore) <= 1.000001 && nextCurrency > currentCurrency + 5.000001)
        || (Math.abs(nextScore - currentScore) <= 1.000001 && Math.abs(nextCurrency - currentCurrency) <= 5.000001 && nextRichness > currentRichness + 1)
        || (Math.abs(nextScore - currentScore) <= 0.000001 && Math.abs(nextCurrency - currentCurrency) <= 0.000001 && Math.abs(nextRichness - currentRichness) <= 1 && nextAt > currentAt)) best = st;
    });
    return best;
  }

  function storedSyncSummaryScoreStateCandidates() {
    const keys = [LOCAL_SYNC_SUMMARY_KEY, ACCOUNT_SYNC_LAST_RESULT_KEY, ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY];
    const out = [];
    const addFrom = (obj, source) => {
      try {
        const row = obj && typeof obj === "object" ? obj : null;
        if (!row) return;
        const xp = row.xp && typeof row.xp === "object" ? row.xp : (row.score && typeof row.score === "object" ? row.score : null);
        if (xp) out.push(scoreStateFromXp(xp, { source, updatedAt: row.finishedAt || row.updatedAt || xp.cachedAt || Date.now(), lastFullRebuildAt: row.finishedAt || row.updatedAt || xp.lastSyncedAt || 0 }));
      } catch (_) {}
    };
    keys.forEach((key) => {
      try { addFrom(readJson(key, null), `${key}:localStorage`); } catch (_) {}
      try {
        const raw = sessionStorage.getItem(key);
        if (raw) addFrom(JSON.parse(raw), `${key}:sessionStorage`);
      } catch (_) {}
    });
    return out;
  }

  function persistScoreStateToRawFile(rawFile, scoreState, reason) {
    try {
      if (!rawFile || typeof rawFile !== "object") return false;
      const f = Object.assign({}, rawFile, {
        scoreState: normaliseScoreState(scoreState),
        updatedAt: Number(rawFile.updatedAt || Date.now()) || Date.now()
      });
      if (f.syncSummary && typeof f.syncSummary === "object" && !Array.isArray(f.syncSummary)) {
        f.syncSummary = Object.assign({}, f.syncSummary, { xp: scoreStateToXp(f.scoreState, f), updatedAt: Date.now(), scoreStateSource: reason || "score-state-migration" });
      }
      return writeJson(LOCAL_FILE_KEY, f);
    } catch (_) { return false; }
  }

  function migrateScoreStateIfNeeded(reason, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    try {
      const raw = readJson(LOCAL_FILE_KEY, null);
      const rawFile = raw && typeof raw === "object" ? raw : null;
      const eventCount = Array.isArray(rawFile && rawFile.eventLog) ? rawFile.eventLog.length : 0;
      const sidecar = readScoreStateSidecar();
      const fileState = rawFile && rawFile.scoreState && typeof rawFile.scoreState === "object" ? normaliseScoreState(rawFile.scoreState) : null;
      const summaryState = rawFile ? scoreStateFromSyncSummary(rawFile) : null;
      const storedSummary = bestScoreStateCandidate(storedSyncSummaryScoreStateCandidates());
      let bestSnapshot = bestScoreStateCandidate([fileState, summaryState, storedSummary, sidecar]);
      const sidecarValue = scoreStateTotalValue(sidecar);
      const bestValue = scoreStateTotalValue(bestSnapshot);
      const sidecarBad = scoreStateLooksUnseeded(sidecar, rawFile || {});
      const fileStateBad = scoreStateLooksUnseeded(fileState, rawFile || {});
      const needsSnapshotRestore = !!(bestSnapshot && (!sidecar || sidecarBad || bestValue > sidecarValue + 0.000001));
      let chosen = null;
      if (needsSnapshotRestore) chosen = bestSnapshot;
      const needsLedgerRebuild = !!(options.allowLedgerRebuild && rawFile && eventCount > 0 && (!chosen || scoreStateLooksUnseeded(chosen, rawFile) || fileStateBad || sidecarBad));
      if (needsLedgerRebuild) {
        try {
          const rebuilt = rebuildScoreStateFromFile(rawFile, { source: reason || "score-state-one-time-ledger-migration" });
          if (!chosen || Number(rebuilt.totalScore || 0) > Number(chosen.totalScore || 0) + 0.000001 || scoreStateLooksUnseeded(chosen, rawFile)) chosen = rebuilt;
        } catch (_) {}
      }
      if (!chosen) return sidecar || fileState || summaryState || storedSummary || null;
      chosen = normaliseScoreState(Object.assign({}, chosen, { source: chosen.source || reason || "score-state-migration", updatedAt: Date.now() }));
      writeScoreStateSidecar(chosen);
      persistScoreStateToRawFile(rawFile, chosen, reason || "score-state-migration");
      clearAccountXpMemo();
      try { publishScoreStateChange(chosen, reason || "score-state-migration", null); } catch (_) {}
      return chosen;
    } catch (_) { return null; }
  }

  function scheduleScoreStateMigration(reason, delay) {
    try {
      if (window.__mkScoreStateMigrationTimer) window.clearTimeout(window.__mkScoreStateMigrationTimer);
      window.__mkScoreStateMigrationTimer = window.setTimeout(() => {
        window.__mkScoreStateMigrationTimer = 0;
        const run = () => { try { migrateScoreStateIfNeeded(reason || "score-state-background-migration", { allowLedgerRebuild: false }); } catch (_) {} };
        try {
          if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(run, { timeout: 4500 });
          else window.setTimeout(run, 800);
        } catch (_) { run(); }
      }, Math.max(0, Number(delay == null ? 1200 : delay) || 0));
    } catch (_) {}
  }

  function mergePendingEventsIntoFile(file, pending, scoreState) {
    const base = normaliseFile(file || emptyFile());
    const map = new Map((base.eventLog || []).map((ev) => [ev.id, ev]));
    (Array.isArray(pending) ? pending : []).forEach((row) => {
      const ev = normaliseEvent(row);
      if (!ev) return;
      const old = map.get(ev.id);
      if (!old || Number(ev.updatedAt || ev.ts || 0) >= Number(old.updatedAt || old.ts || 0)) map.set(ev.id, ev);
    });
    const st = scoreState || readScoreStateSidecar() || bestScoreStateForFile(base, { allowCompute: false }) || emptyScoreState({ source: "pending-merge-empty" });
    return normaliseFile(Object.assign({}, base, { eventLog: Array.from(map.values()), scoreState: st }));
  }

  function flushPendingEventsToFile(reason, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const pending = readPendingEvents();
    const sidecar = readScoreStateSidecar();
    if (!pending.length && !sidecar) return { ok: true, flushed: 0, skipped: true, file: readFile() };
    const raw = readJson(LOCAL_FILE_KEY, null);
    let base = raw && typeof raw === "object" ? raw : emptyFile();
    let scoreState = sidecar || bestScoreStateForFile(base, { allowCompute: false }) || null;
    if ((options.allowRebuild || scoreStateLooksUnseeded(scoreState, base)) && scoreStateLooksUnseeded(scoreState, base)) {
      scoreState = migrateScoreStateIfNeeded(reason || "pending-flush-score-state-migration", { allowLedgerRebuild: !!options.allowRebuild }) || scoreState;
    }
    if (!scoreState && options.allowRebuild) scoreState = rebuildScoreStateFromFile(base, { source: reason || "pending-flush-rebuild" });
    if (!scoreState) scoreState = emptyScoreState({ source: "pending-flush-empty" });
    if (!sidecar && pending.length) pending.forEach((ev) => { scoreState = applyEventToScoreState(scoreState, ev, { source: reason || "pending-flush-apply" }); });
    const merged = mergePendingEventsIntoFile(base, pending, scoreState);
    const saved = writeFile(merged, { source: reason || "pending-events-flush", skipMirrors: !!options.skipMirrors });
    const savedIds = new Set((saved.eventLog || []).map((ev) => String(ev.id || "")));
    const allPresent = pending.every((ev) => savedIds.has(String(ev && ev.id || "")));
    if (allPresent) clearPendingEvents();
    if (saved && saved.scoreState) writeScoreStateSidecar(saved.scoreState);
    return { ok: true, flushed: pending.length, cleared: allPresent, file: saved };
  }

  function updateFastLegacyMirrorForEvent(ev) {
    try {
      const e = normaliseEvent(ev);
      if (!e) return;
      const metric = String(e.metric || e.type || "").toLowerCase();
      if ((metric === "mastery" || e.type === "mastery_set") && e.path && shouldUseMasteryEvent(e)) {
        const val = masteryEventLevel(e);
        const rated = val != null;
        const map = readLegacyMasteryMap();
        const old = map[e.path] && typeof map[e.path] === "object" ? map[e.path] : {};
        const hist = Array.isArray(old.history) ? old.history.slice(-40) : [];
        hist.push({ kind: "mastery", m: val, ts: Number(e.ts || Date.now()) || Date.now(), source: e.details && e.details.source || e.type || e.metric });
        map[e.path] = Object.assign({}, old, {
          path: e.path,
          title: e.title || old.title || e.path,
          m: rated ? val : null,
          mastery: rated ? val : null,
          level: rated ? val : null,
          state: rated ? "rated" : "unrated",
          unrated: !rated,
          lastReviewed: rated ? Number(e.ts || Date.now()) || Date.now() : 0,
          updatedAt: Number(e.updatedAt || e.ts || Date.now()) || Date.now(),
          history: hist.slice(-50),
          sourceEventId: e.id
        });
        try { localStorage.setItem(LEGACY_MASTERY_KEY, JSON.stringify(map)); } catch (_) {}
      }
    } catch (_) {}
  }

  function shouldUseLightweightEventWrite(ev, options) {
    const e = ev && typeof ev === "object" ? ev : {};
    const opts = options && typeof options === "object" ? options : {};
    if (opts.forceFullWrite || opts.important || opts.fullSync) return false;
    const metric = String(e.metric || "").toLowerCase();
    const type = String(e.type || "").toLowerCase();
    if (/^(shop_|eorbits_|currency_|profile_|account_|identity_)/i.test(metric) || /^(shop_|profile_|account_|identity_)/i.test(type)) return false;
    if (metric === "saved_page_action" || type === "page_action_set") return false;
    if (isShopCurrencyEvent(e)) return false;
    return !!(XP_RULES[metric] || type === "page_visit" || type === "wiki_open" || type === "mastery_set" || type === "ai_quiz_complete");
  }

  function recordEventLightweight(ev, type) {
    const clean = normaliseEvent(ev);
    if (!clean) return { ok: false, error: "invalid-event" };
    // Low-heat path: ordinary page opens/views/searches must not parse the full
    // account event file. Use the sidecar or recent sync summary, then append only
    // the small pending-event row. Full reconciliation happens during manual sync.
    let st = readScoreStateSidecar();
    if (!st || scoreStateLooksIncrementalOnly(st)) {
      st = bestScoreStateCandidate([
        bestScoreStateCandidate(storedSyncSummaryScoreStateCandidates()),
        st
      ]) || emptyScoreState({ source: "lightweight-event-empty" });
    }
    st = applyEventToScoreState(st, clean, { source: `record-light:${type || clean.type || clean.metric || "event"}` });
    const wroteScore = !!writeScoreStateSidecar(st);
    const wrotePending = appendPendingEvent(clean);
    if (!wrotePending) return { ok: false, error: "pending-event-write-failed" };
    updateFastLegacyMirrorForEvent(clean);
    try { window.dispatchEvent(new CustomEvent("mk-account-data-changed", { detail: { source: `record-light:${type || clean.type}`, pending: true, stats: { stores: { pendingEvents: pendingEventCount() } } } })); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("mk-local-activity-change", { detail: { type: "account-data", source: `record-light:${type || clean.type}`, pending: true } })); } catch (_) {}
    return { ok: true, event: clean, scoreState: st, wroteScore, wrotePending };
  }
  function normaliseEvent(ev) {
    if (!ev || typeof ev !== "object") return null;
    const ts = Number(ev.ts || ev.createdAt || ev.created_at || 0) || now();
    const metric = clampText(ev.metric || metricForType(ev.type || ev.eventType || "activity"), 80).trim();
    const type = clampText(ev.type || typeForMetric(metric), 80).trim();
    const path = normalisePath(ev.path || ev.conceptId || ev.concept_id || "");
    const action = clampText(ev.action || (ev.details && ev.details.action) || "", 80).trim();
    const id = clampText(ev.id || eventStableId({ type, metric, path, action, ts, details: ev.details || {}, deviceId: ev.deviceId || getDeviceId() }), 220);
    const details = ev.details && typeof ev.details === "object" && !Array.isArray(ev.details) ? ev.details : {};
    const count = Math.max(0, Number(ev.count != null ? ev.count : (details.count != null ? details.count : 1)) || 1);
    const scoreValue = ev.score != null ? Number(ev.score) : undefined;
    return {
      id,
      type,
      metric,
      count,
      score: Number.isFinite(scoreValue) ? scoreValue : undefined,
      ts,
      createdAt: Number(ev.createdAt || ev.created_at || ts) || ts,
      updatedAt: Number(ev.updatedAt || ev.updated_at || ts) || ts,
      deviceId: clampText(ev.deviceId || getDeviceId(), 120),
      deviceName: clampText(ev.deviceName || getDeviceName(), 120),
      visitorId: clampText(ev.visitorId || getVisitorId(), 160),
      accountKey: clampText(ev.accountKey || ev.account_key || accountKey(), 180),
      path,
      title: cleanPageTitleText(ev.title || details.title || path || ""),
      action,
      active: typeof ev.active === "boolean" ? ev.active : (typeof details.active === "boolean" ? details.active : undefined),
      value: ev.value !== undefined ? ev.value : details.value,
      oldValue: ev.oldValue !== undefined ? ev.oldValue : details.oldValue,
      details: sanitiseDetails(details)
    };
  }
  function normalisePath(path) { return String(path || "").replace(/^\/+/, "").split("#")[0].split("?")[0].trim(); }
  function sanitiseDetailsValue(value, depth, key) {
    if (value == null) return undefined;
    if (typeof value === "string") {
      const max = /^(text|html|markdown|resultText|result_text|explanation|feedback|content|body)$/i.test(String(key || "")) ? 420 : 260;
      return value.slice(0, max);
    }
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (depth >= 2) {
      try { return JSON.stringify(value).slice(0, 420); } catch (_) { return String(value).slice(0, 260); }
    }
    if (Array.isArray(value)) {
      const maxItems = /questions|answers|history|items|events/i.test(String(key || "")) ? 8 : 12;
      return value.slice(0, maxItems).map((item) => sanitiseDetailsValue(item, depth + 1, key)).filter((item) => item !== undefined);
    }
    if (typeof value === "object") {
      const out = {};
      const entries = Object.entries(value).slice(0, 36);
      for (const [childKey, childValue] of entries) {
        if (/^(rawHtml|html|pageHtml|dom|element|node|stack|trace|screenshot|image|audio|blob|file|response|prompt|fullPrompt)$/i.test(childKey)) continue;
        const v = sanitiseDetailsValue(childValue, depth + 1, childKey);
        if (v !== undefined) out[childKey] = v;
      }
      return out;
    }
    return String(value).slice(0, 260);
  }
  function sanitiseDetails(details) {
    const out = {};
    for (const [k, v] of Object.entries(details || {}).slice(0, 60)) {
      if (v == null) continue;
      if (/^(rawHtml|html|pageHtml|dom|element|node|stack|trace|screenshot|image|audio|blob|file|response|prompt|fullPrompt)$/i.test(k)) continue;
      const clean = sanitiseDetailsValue(v, 0, k);
      if (clean !== undefined) out[k] = clean;
    }
    return out;
  }
  function eventStableId(seed) {
    const s = seed && typeof seed === "object" ? seed : {};
    const d = s.details && typeof s.details === "object" ? s.details : {};
    const strong = d.resultId || d.result_id || d.commentId || d.comment_id || d.sessionId || d.session_id || d.notificationId || d.notification_id;
    if (strong) return `evt_${s.type || s.metric}_${s.path || "global"}_${strong}`.replace(/[^a-zA-Z0-9_.:-]/g, "_").slice(0, 220);
    // The id-less fallback MUST be deterministic and identical on every device.
    // It used to return uid("evt") (a random UUID), so the same id-less event
    // (legacy/old-format rows that reach here without an id) got a DIFFERENT id on
    // every device and every re-normalisation. The id-based dedup could then never
    // collapse the copies, so the same event piled up across phone + laptop +
    // re-sync — the "duplicate-add" that inflated the cloud event count. Deriving
    // the id from the event's own content makes the same event resolve to the same
    // id everywhere, so dedup collapses the copies instead of stacking them.
    const value = s.value !== undefined && s.value !== null ? s.value : (d.value !== undefined && d.value !== null ? d.value : "");
    const sig = [s.type || "", s.metric || "", s.path || "", s.action || "", s.ts || "", value].join("|");
    return `evt_${s.type || s.metric || "activity"}_${fastStringHash(sig)}`.replace(/[^a-zA-Z0-9_.:-]/g, "_").slice(0, 220);
  }
  // Two events are the SAME logical action when their stable content matches. Used
  // to collapse already-stored duplicate copies that were minted with divergent
  // random ids BEFORE the deterministic eventStableId above existed. ms-precision
  // timestamps make it effectively impossible for two genuinely-distinct user
  // actions to share a signature; synthetic-ts events (e.g. one active_day per day)
  // SHOULD collapse to one, which is also correct.
  function eventContentSignature(ev) {
    if (!ev || typeof ev !== "object") return "";
    const d = ev.details && typeof ev.details === "object" && !Array.isArray(ev.details) ? ev.details : {};
    const value = ev.value !== undefined && ev.value !== null ? ev.value : "";
    const active = ev.active === false ? "0" : (ev.active === true ? "1" : "");
    // Field set MUST match eventIdentityForFingerprint (minus id); strong keys keep
    // distinct keyed events (quiz results, comments) from collapsing together.
    return [
      ev.type || "", ev.metric || "", ev.path || "", ev.action || "", active, value,
      Math.floor(Number(ev.ts || ev.createdAt || ev.created_at || 0) || 0),
      d.resultId || d.result_id || "", d.sessionId || d.session_id || "",
      d.commentId || d.comment_id || "", d.notificationId || d.notification_id || ""
    ].join("|#~#|");
  }
  function pickRepresentativeEvent(a, b) {
    const ca = Math.max(0, Number(a.count || 1) || 0);
    const cb = Math.max(0, Number(b.count || 1) || 0);
    if (cb > ca) return b;
    if (ca > cb) return a;
    const ua = Number(a.updatedAt || a.ts || 0);
    const ub = Number(b.updatedAt || b.ts || 0);
    if (ub > ua) return b;
    if (ua > ub) return a;
    // Deterministic tie-break so every device keeps the SAME survivor and converges.
    return String(a.id || "") <= String(b.id || "") ? a : b;
  }
  function collapseContentDuplicateEvents(events) {
    const list = Array.isArray(events) ? events : [];
    const bySig = new Map();
    const passthrough = [];
    for (const ev of list) {
      if (!ev) continue;
      // Baselines carry additive deltas and are reconciled by separate floor logic;
      // never collapse them by content.
      if (isAccountScoreBaselineEvent(ev)) { passthrough.push(ev); continue; }
      const sig = eventContentSignature(ev);
      if (!sig) { passthrough.push(ev); continue; }
      const prev = bySig.get(sig);
      bySig.set(sig, prev ? pickRepresentativeEvent(prev, ev) : ev);
    }
    return passthrough.concat(Array.from(bySig.values()));
  }
  function typeForMetric(metric) {
    const m = String(metric || "");
    if (m === "view") return "page_visit";
    if (m === "active_day") return "wiki_open";
    if (m === "saved_page_action" || m === "saved_page_visit") return "page_action_event";
    if (m === "mastery") return "mastery_set";
    if (m === "ai_quiz") return "ai_quiz_complete";
    return "activity";
  }
  function metricForType(type) {
    const t = String(type || "");
    if (t === "page_visit") return "view";
    if (t === "wiki_open") return "active_day";
    if (t === "page_action_set") return "saved_page_action";
    if (t === "mastery_set") return "mastery";
    if (t === "ai_quiz_complete") return "ai_quiz";
    return "activity";
  }

  function validMasteryLevelValue(value) {
    const n = Number(value);
    return [0, 1, 2, 3].includes(n) ? n : null;
  }
  function masteryEventRawValue(ev) {
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    if (ev && ev.value !== undefined) return ev.value;
    if (d.value !== undefined) return d.value;
    if (d.level !== undefined) return d.level;
    if (d.mastery !== undefined) return d.mastery;
    return undefined;
  }
  function isExplicitMasteryClearEvent(ev) {
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const source = String(d.source || ev && ev.source || "").toLowerCase();
    return !!(
      d.clear === true ||
      d.deleted === true ||
      d.changeKind === "clear" ||
      d.change_kind === "clear" ||
      source === "mastery-manager-clear" ||
      source === "mastery-clear" ||
      source === "manager-clear"
    );
  }
  function isViewOnlyMasteryNoise(ev) {
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const kind = String(d.kind || d.type || d.event || d.action || "").toLowerCase().trim();
    const source = String(d.source || "").toLowerCase();
    const raw = masteryEventRawValue(ev);
    return !!(
      (kind === "view" || kind === "visit" || kind === "seen" || source.indexOf("page-load") >= 0) &&
      raw === undefined &&
      !isExplicitMasteryClearEvent(ev)
    );
  }
  function masteryEventLevel(ev) {
    const raw = masteryEventRawValue(ev);
    if (raw === null || raw === "") return null;
    return validMasteryLevelValue(raw);
  }
  function shouldUseMasteryEvent(ev) {
    if (!ev || String(ev.type || "") !== "mastery_set") return false;
    if (isViewOnlyMasteryNoise(ev)) return false;
    if (masteryEventLevel(ev) != null) return true;
    return isExplicitMasteryClearEvent(ev);
  }
  function isSeedPageActionEvent(ev) {
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    const src = String(d.source || "").toLowerCase();
    const metric = String(ev && ev.metric || "").toLowerCase();
    return metric.indexOf("_seed") >= 0 || src.indexOf("account-json-") >= 0 || src.indexOf("seed") >= 0;
  }
  function shouldReplacePageActionEvent(oldRow, ev, ts) {
    if (!oldRow) return true;
    const nextSeed = isSeedPageActionEvent(ev);
    const oldSeed = !!oldRow.seed;
    // Seed rows are reconstructed from older canonical snapshots and may be
    // stamped at sync time.  A real local save/unsave event is stronger than a
    // seed row even when the seed timestamp is newer.
    if (oldSeed && !nextSeed) return true;
    if (!oldSeed && nextSeed) return false;
    return Number(ts || 0) >= Number(oldRow.updatedAt || oldRow.ts || 0);
  }

  let __mkAccountXpMemoKey = "";
  let __mkAccountXpMemoScore = null;
  let __mkAccountXpMemoTimer = 0;

  function xpCacheKeyForFile(file) {
    try {
      const f = file && typeof file === "object" ? file : {};
      const events = Array.isArray(f.eventLog) ? f.eventLog : [];
      const last = events.length ? events[events.length - 1] || {} : {};
      const mid = events.length > 3 ? events[Math.floor(events.length / 2)] || {} : {};
      return [
        f.accountKey || accountKey() || "",
        Number(f.updatedAt || 0) || 0,
        events.length,
        String(last.id || ""),
        Number(last.updatedAt || last.ts || 0) || 0,
        String(mid.id || ""),
        Number(mid.updatedAt || mid.ts || 0) || 0
      ].join("|");
    } catch (_) {
      return String(Date.now());
    }
  }

  function clearAccountXpMemo() {
    __mkAccountXpMemoKey = "";
    __mkAccountXpMemoScore = null;
  }

  function xpCachedFromFile(file, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    if (!options.force && !file) {
      let sidecar = readScoreStateSidecar();
      try {
        const raw = readJson(LOCAL_FILE_KEY, null);
        if (scoreStateLooksUnseeded(sidecar, raw || {})) {
          sidecar = migrateScoreStateIfNeeded("xp-cache-score-state-migration", { allowLedgerRebuild: true }) || sidecar;
        }
      } catch (_) {}
      if (sidecar) {
        try { sidecar = normaliseScoreState(ensureScoreStateBoostsFromFile(sidecar, raw || null)); } catch (_) {}
        const score = scoreStateToXp(sidecar, raw || null);
        __mkAccountXpMemoKey = "score-sidecar:" + (sidecar.updatedAt || Date.now());
        __mkAccountXpMemoScore = score;
        writeAccountXpLightCache(score);
        return score;
      }
    }
    const f = file || readFile();
    if (!options.force) {
      const st = bestScoreStateForFile(f, { allowCompute: false });
      if (st) {
        const score = scoreStateToXp(st, f);
        __mkAccountXpMemoKey = "score-state:" + (st.updatedAt || f.updatedAt || Date.now());
        __mkAccountXpMemoScore = score;
        writeAccountXpLightCache(score);
        return score;
      }
    }
    const key = xpCacheKeyForFile(f);
    if (!options.force && __mkAccountXpMemoScore && __mkAccountXpMemoKey === key) return __mkAccountXpMemoScore;
    const score = xpFromFile(f);
    const refreshed = rebuildScoreStateFromFile(f, { xp: score, source: options.force ? "xp-fresh-rebuild" : "xp-cache-rebuild" });
    __mkAccountXpMemoKey = key;
    __mkAccountXpMemoScore = scoreStateToXp(refreshed, f);
    writeAccountXpLightCache(__mkAccountXpMemoScore);
    return __mkAccountXpMemoScore;
  }

  function accountXpUiIsBusy() {
    try {
      return !!document.querySelector(".mk-local-activity-modal,.mk-local-mini-modal,.mk-mastery-widget.is-rating-animating,.mk-mastery-widget.is-submitting");
    } catch (_) { return false; }
  }

  function xpCachedNoCompute() {
    try {
      if (__mkAccountXpMemoScore) return __mkAccountXpMemoScore;
      const sidecar = readScoreStateSidecar();
      const raw = readJson(LOCAL_FILE_KEY, null);
      if (sidecar && !scoreStateLooksUnseeded(sidecar, raw || {})) {
        try { sidecar = normaliseScoreState(ensureScoreStateBoostsFromFile(sidecar, raw || null)); } catch (_) {}
        return scoreStateToXp(sidecar, raw || null);
      }
      const st = bestScoreStateCandidate([bestScoreStateForFile(raw, { allowCompute: false }), scoreStateFromSyncSummary(raw || {}), bestScoreStateCandidate(storedSyncSummaryScoreStateCandidates()), sidecar]);
      if (scoreStateLooksUnseeded(st, raw || {})) scheduleScoreStateMigration("xp-snapshot-background-migration", 80);
      return st ? scoreStateToXp(st, raw) : null;
    } catch (_) { return null; }
  }

  function scheduleAccountXpMemoPublish(reason, event, delay) {
    try { if (__mkAccountXpMemoTimer) window.clearTimeout(__mkAccountXpMemoTimer); } catch (_) {}
    const wait = Math.max(0, Number(delay == null ? 1200 : delay) || 0);
    const runLater = (extraDelay) => {
      __mkAccountXpMemoTimer = window.setTimeout(runTask, Math.max(250, Number(extraDelay || wait) || wait));
    };
    const runTask = () => {
      __mkAccountXpMemoTimer = 0;
      const run = () => {
        try {
          // If the user is opening the Account panel, the Level modal, or the
          // mastery rating animation is running, postpone the heavy full-ledger
          // XP scan.  requestIdleCallback is not enough here: the scan still runs
          // on the main thread and causes a visible click delay on large files.
          if (accountXpUiIsBusy()) {
            runLater(1800);
            return;
          }
          const f = readFile();
          const score = scoreStateToXp(bestScoreStateForFile(f, { allowCompute: false }) || emptyScoreState(), f);
          __mkAccountXpMemoScore = score;
          writeAccountXpLightCache(score);
          window.dispatchEvent(new CustomEvent("mk-account-xp-change", { detail: { score, source: reason || "account-xp-deferred", event } }));
        } catch (_) {}
      };
      try {
        if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(run, { timeout: 3500 });
        else window.setTimeout(run, 1200);
      } catch (_) { try { window.setTimeout(run, 1200); } catch (__) { run(); } }
    };
    runLater(wait);
  }

  function readFile() {
    const src = readJson(LOCAL_FILE_KEY, null);
    const file = src && typeof src === "object" ? src : emptyFile();
    const events = Array.isArray(file.eventLog) ? file.eventLog.map(normaliseEvent).filter(Boolean) : [];
    const seen = new Map();
    for (const ev of events) {
      const old = seen.get(ev.id);
      if (!old || Number(ev.updatedAt || ev.ts || 0) >= Number(old.updatedAt || old.ts || 0)) seen.set(ev.id, ev);
    }
    for (const ev of readPendingEvents()) {
      const old = seen.get(ev.id);
      if (!old || Number(ev.updatedAt || ev.ts || 0) >= Number(old.updatedAt || old.ts || 0)) seen.set(ev.id, ev);
    }
    // Aggregate browsing events on READ too, not just on write. Otherwise the stored
    // file keeps the raw un-aggregated events and every readFile()/sync/display
    // re-inflates the device count (the panel was stuck at 4974 while the cloud was the
    // aggregated 3666). This is the same XP-exact count-collapse used in normaliseFile.
    const mergedEvents = aggregateBrowsingEvents(Array.from(seen.values())).sort((a, b) => (Number(a.ts || 0) - Number(b.ts || 0)) || String(a.id || "").localeCompare(String(b.id || ""))).slice(-MAX_EVENT_LOG);
    const sidecar = readScoreStateSidecar();
    const rawBestState = bestScoreStateCandidate([
      scoreStateLooksUnseeded(sidecar, file) ? null : sidecar,
      bestScoreStateForFile(file, { allowCompute: false }),
      scoreStateFromSyncSummary(file || {}),
      bestScoreStateCandidate(storedSyncSummaryScoreStateCandidates())
    ]);
    if (scoreStateLooksUnseeded(sidecar, file) || scoreStateLooksUnseeded(rawBestState, file)) scheduleScoreStateMigration("read-file-background-score-state-migration", 300);
    return Object.assign(emptyFile(), file, {
      schema: "mk-account-data-file",
      version: 1,
      deviceId: getDeviceId(),
      deviceName: getDeviceName(),
      eventLog: mergedEvents,
      scoreState: rawBestState || emptyScoreState({ source: "read-file-empty-score-state" }),
      syncSummary: file && typeof file.syncSummary === "object" && !Array.isArray(file.syncSummary) ? file.syncSummary : null,
      updatedAt: Number(file.updatedAt || 0) || now()
    });
  }
  function writeFile(file, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    let clean = normaliseFile(file);
    clean.scoreState = bestScoreStateForFile(clean, { allowCompute: false }) || emptyScoreState({ source: "write-file-empty-score-state" });
    clean.updatedAt = now();
    clearAccountXpMemo();
    let compactMode = "exact";
    let persisted = writeJson(LOCAL_FILE_KEY, clean);
    let storagePressure = !persisted;
    if (!persisted) {
      reclaimAccountStorageSpace(options.source || "account-write", { aggressive: true });
      persisted = writeJson(LOCAL_FILE_KEY, clean);
    }
    if (!persisted) {
      const modes = ["standard", "mobile", "critical", "lean", "tiny", "emergency"];
      for (const mode of modes) {
        clean = compactFileForStorage(clean, mode);
        compactMode = mode;
        reclaimAccountStorageSpace(`${options.source || "account-write"}:${mode}`, { aggressive: mode === "lean" || mode === "tiny" || mode === "emergency" });
        persisted = writeJson(LOCAL_FILE_KEY, clean);
        if (persisted) break;
      }
    }
    if (!persisted) {
      try { window.dispatchEvent(new CustomEvent("mk-storage-write-problem", { detail: { key: LOCAL_FILE_KEY, source: options.source || "account-write", stats: statsForFile(clean), approxBytes: localStorageApproxBytes() } })); } catch (_) {}
    }
    storagePressure = storagePressure || compactMode !== "exact";
    if (!(options.skipMirrors || storagePressure)) applyLegacyMirrors(clean);
    else if (storagePressure) reclaimAccountStorageSpace(`${options.source || "account-write"}:skip-legacy-mirrors`, { aggressive: true });
    try {
      const invForCache = shopInventoryFromFile(clean);
      writeShopInventoryLightCache(invForCache);
      applyEquippedCosmetics(invForCache);
    } catch (_) {}
    try {
      const score = scoreStateToXp(clean.scoreState, clean);
      __mkAccountXpMemoKey = "score-state:" + (clean.scoreState && clean.scoreState.updatedAt || clean.updatedAt || Date.now());
      __mkAccountXpMemoScore = score;
      writeAccountXpLightCache(score);
      try { writeJson(LOCAL_SCORE_STATE_KEY, clean.scoreState); } catch (_) {}
    } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("mk-account-data-changed", { detail: { source: options.source || "write", stats: statsForFile(clean), persisted, compactMode, exact: compactMode === "exact" } })); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("mk-local-activity-change", { detail: { type: "account-data", source: options.source || "write", persisted, compactMode, exact: compactMode === "exact" } })); } catch (_) {}
    return clean;
  }
  // XP-EXACT shrink. Collapse repeated same-UTC-day browsing/UI events (type
  // page_visit or activity) for the same (metric, path, action) into ONE event with
  // summed `count`. The XP engine scores by `count` with the same per-count
  // repeat-discount and daily cap (xpFromFile lines ~5345-5388, dayKey is UTC), so N
  // events and one count=N event earn identical XP and EORbits. State-bearing events
  // (mastery, saved pages, shop, anything carrying an explicit state/result/session key
  // or a value/active field) are NEVER aggregated. The id is deterministic so the
  // device and cloud converge to the same aggregated set. This is what keeps a heavily
  // used account small enough for the Worker to sync/write (the cause of the 503s and of
  // new XP not landing). dayKey() is UTC, so Math.floor(ts/86400000) shares its boundary.
  function aggregateBrowsingEvents(events) {
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
  function normaliseFile(file) {
    const f = file && typeof file === "object" ? file : emptyFile();
    const events = Array.isArray(f.eventLog) ? f.eventLog.map(normaliseEvent).filter(Boolean) : [];
    const map = new Map();
    for (const ev of events) {
      const old = map.get(ev.id);
      if (!old || Number(ev.updatedAt || ev.ts || 0) >= Number(old.updatedAt || old.ts || 0)) map.set(ev.id, ev);
    }
    return {
      schema: "mk-account-data-file",
      version: 1,
      createdAt: Number(f.createdAt || 0) || now(),
      updatedAt: Number(f.updatedAt || 0) || now(),
      accountKey: accountKey(),
      deviceId: getDeviceId(),
      deviceName: getDeviceName(),
      eventLog: collapseContentDuplicateEvents(aggregateBrowsingEvents(Array.from(map.values()))).sort((a, b) => (Number(a.ts || 0) - Number(b.ts || 0)) || String(a.id || "").localeCompare(String(b.id || ""))).slice(-MAX_EVENT_LOG),
      scoreState: bestScoreStateForFile(f, { allowCompute: false }) || emptyScoreState({ source: "normalise-file-empty-score-state" }),
      syncSummary: f && typeof f.syncSummary === "object" && !Array.isArray(f.syncSummary) ? f.syncSummary : null
    };
  }
  function mergeFiles(localFile, cloudFile) {
    const a = normaliseFile(localFile || emptyFile());
    const b = normaliseFile(cloudFile || emptyFile());
    const map = new Map();
    const baselines = [];
    for (const ev of [].concat(a.eventLog || [], b.eventLog || [])) {
      const clean = normaliseEvent(ev);
      if (!clean) continue;
      if (isAccountScoreBaselineEvent(clean)) {
        baselines.push(clean);
        continue;
      }
      const old = map.get(clean.id);
      if (!old || Number(clean.updatedAt || clean.ts || 0) >= Number(old.updatedAt || old.ts || 0)) map.set(clean.id, clean);
    }
    const nonBaselineCount = map.size;
    for (const ev of baselines) {
      if (!accountScoreBaselineApplies(ev, nonBaselineCount)) continue;
      const old = map.get(ev.id);
      if (!old || Number(ev.updatedAt || ev.ts || 0) >= Number(old.updatedAt || old.ts || 0)) map.set(ev.id, ev);
    }
    const localState = bestScoreStateForFile(a, { allowCompute: false });
    const cloudState = bestScoreStateForFile(b, { allowCompute: false });
    const chosenState = !localState ? cloudState : (!cloudState ? localState : (Number(cloudState.updatedAt || 0) >= Number(localState.updatedAt || 0) ? cloudState : localState));
    return normaliseFile({ createdAt: Math.min(Number(a.createdAt || now()), Number(b.createdAt || now())), eventLog: Array.from(map.values()), scoreState: chosenState || emptyScoreState({ source: "merge-empty-score-state" }) });
  }

  function shouldAutoSyncAfterEvent(ev) {
    const metric = String(ev && ev.metric || "").toLowerCase();
    const type = String(ev && ev.type || "").toLowerCase();
    // Only real learning/account-value mutations should schedule a cloud merge.
    // Page opens, views, searches, focus/online events and cosmetic refreshes stay local
    // until a later learning action or a manual Sync.
    if (metric === "mastery" || type === "mastery_set") return true;
    if (metric === "ai_quiz" || type === "ai_quiz_complete") return true;
    if (metric === "shop_purchase" || type === "shop_purchase") return true;
    if (metric === "shop_equip" || type === "shop_equip") return true;
    if (metric === "shop_refund" || metric === "shop_revoke" || type === "shop_refund" || type === "shop_revoke") return true;
    if (metric === "shop_gift_received" || metric === "shop_gift_sent") return true;
    if (metric === "shop_spend" || metric === "eorbits_spend" || metric === "eorbits_credit") return true;
    return false;
  }

  function scheduleAutoSyncForEvent(ev) {
    if (!shouldAutoSyncAfterEvent(ev)) return false;
    scheduleAutoSync(String(ev && (ev.metric || ev.type) || "learning-action"));
    return true;
  }

  function recordEvent(type, detail, opts) {
    const d = detail && typeof detail === "object" ? detail : {};
    const options = opts && typeof opts === "object" ? opts : {};
    const ts = Number(options.ts || d.ts || d.createdAt || d.created_at || 0) || now();
    const metric = clampText(options.metric || d.metric || metricForType(type), 80);
    const path = normalisePath(options.path || d.path || d.conceptId || d.concept_id || (isConceptRelPath(currentPath()) ? currentPath() : ""));
    const title = cleanPageTitleText(options.title || d.title || (path && path === currentPath() ? currentTitle() : path));
    const ev = normaliseEvent({
      id: options.id || d.id,
      type,
      metric,
      count: Math.max(0, Number(options.count != null ? options.count : (d.count != null ? d.count : (d.details && d.details.count != null ? d.details.count : 1))) || 1),
      score: Number.isFinite(Number(options.score != null ? options.score : d.score)) ? Number(options.score != null ? options.score : d.score) : undefined,
      ts,
      createdAt: ts,
      updatedAt: ts,
      deviceId: getDeviceId(),
      deviceName: getDeviceName(),
      visitorId: getVisitorId(),
      accountKey: accountKey(),
      path,
      title,
      action: options.action || d.action,
      active: typeof options.active === "boolean" ? options.active : (typeof d.active === "boolean" ? d.active : undefined),
      value: options.value !== undefined ? options.value : d.value,
      oldValue: options.oldValue !== undefined ? options.oldValue : d.oldValue,
      details: Object.assign({}, d.details && typeof d.details === "object" ? d.details : {}, d, { source: d.source || options.source || type })
    });
    if (shouldUseLightweightEventWrite(ev, options)) {
      const quick = recordEventLightweight(ev, type);
      if (quick && quick.ok) {
        scheduleAutoSyncForEvent(ev);
        if (!options.noCloudUpload) queueCloudEventUpload(ev, { reason: metric || type });
        if (XP_RULES[metric] || isShopCurrencyEvent(ev) || isAccountScoreBaselineEvent(ev)) {
          publishScoreStateChange(quick.scoreState, "local-event-score-state", ev);
        }
        return ev;
      }
    }
    const file = readFile();
    file.eventLog.push(ev);
    file.scoreState = applyEventToScoreState(bestScoreStateForFile(file, { allowCompute: false }) || readScoreStateSidecar() || emptyScoreState(), ev, { source: `record:${type}` });
    const saved = writeFile(file, { source: `record:${type}` });
    scheduleAutoSyncForEvent(ev);
    if (!options.noCloudUpload) queueCloudEventUpload(ev, { reason: metric || type });
    if (XP_RULES[metric] || isShopCurrencyEvent(ev) || isAccountScoreBaselineEvent(ev)) {
      // The normal path is now O(1): update the stored score state immediately and
      // publish that snapshot.  The expensive full-ledger rebuild is reserved for
      // sync/repair, not for clicks or mastery animations.
      publishScoreStateChange(saved && saved.scoreState || file.scoreState, "local-event-score-state", ev);
    }
    return ev;
  }
  function recordActivity(metric, detail, opts) {
    const m = clampText(metric, 80).trim();
    if (!m) return Promise.resolve({ ok: false, error: "empty metric" });
    const d = detail && typeof detail === "object" ? detail : {};
    const options = opts && typeof opts === "object" ? opts : {};
    const throttleMs = Math.max(0, Number(options.throttleMs == null ? d.throttleMs || 0 : options.throttleMs) || 0);
    if (throttleMs > 0) {
      const scope = clampText(options.scope || d.scope || d.path || currentPath() || "global", 220);
      const key = `mk_account_activity_last_v1:${m}:${scope}`;
      try {
        const last = Number(sessionStorage.getItem(key) || "0");
        if (Date.now() - last < throttleMs) return Promise.resolve({ ok: true, ignored: true, localThrottle: true });
        sessionStorage.setItem(key, String(Date.now()));
      } catch (_) {}
    }
    const ev = recordEvent(typeForMetric(m), d, Object.assign({}, options, { metric: m }));
    return Promise.resolve({ ok: true, localFirst: true, event: ev });
  }
  function recordPageAction(path, title, action, active, opts) {
    const p = normalisePath(path);
    const a = clampText(action, 80).trim();
    if (!p || !a) return null;
    return recordEvent("page_action_set", { path: p, title, action: a, active: !!active, details: { active: !!active, action: a } }, Object.assign({}, opts || {}, { metric: "saved_page_action", path: p, title, action: a, active: !!active, forceFullWrite: true }));
  }
  function recordMastery(path, level, detail, opts) {
    const p = normalisePath(path || detail && (detail.path || detail.conceptId || detail.concept_id));
    if (!p) return null;
    const d = detail && typeof detail === "object" ? detail : {};
    const options = opts && typeof opts === "object" ? opts : {};
    const explicitClear = !!(d.clear === true || d.changeKind === "clear" || d.change_kind === "clear" || options.clear === true);
    const detailLevel = d.level !== undefined ? d.level : (d.mastery !== undefined ? d.mastery : (d.m !== undefined ? d.m : undefined));
    const nextLevel = level !== undefined && level !== null ? level : detailLevel;
    const kind = String(d.kind || d.type || d.event || d.action || "").toLowerCase().trim();
    // ConceptMastery.bumpView emits conceptMasteryChanged with kind="view".
    // Older account-sync code converted that view-only notification into a
    // mastery_set with undefined value, and that newer unrated event then erased
    // the real rating on every page open.  Only real rating/clear events belong
    // in the account event file.
    if ((kind === "view" || kind === "visit" || kind === "seen") && nextLevel == null && !explicitClear) return null;
    if (nextLevel == null && !explicitClear) return null;
    const oldLevel = d.oldLevel != null ? d.oldLevel : d.oldMastery;
    const ts = Math.max(1, Number(options.ts || d.ts || d.updatedAt || d.updated_at || d.lastReviewed || Date.now()) || Date.now());
    const detailOut = Object.assign({}, d, { path: p, value: explicitClear ? null : nextLevel, oldValue: oldLevel, mastery: explicitClear ? null : nextLevel, level: explicitClear ? null : nextLevel, m: explicitClear ? null : nextLevel });
    if (explicitClear) detailOut.clear = true;
    const eventId = options.id || `evt_mastery_${fastStringHash([p, ts, explicitClear ? "clear" : nextLevel, oldLevel != null ? oldLevel : "", d.source || options.source || ""].join("|"))}`;
    return recordEvent("mastery_set", detailOut, Object.assign({}, options, { id: eventId, metric: "mastery", path: p, value: explicitClear ? null : nextLevel, oldValue: oldLevel, ts }));
  }
  function recordAiQuiz(path, detail, opts) {
    const d = detail && typeof detail === "object" ? detail : {};
    const p = normalisePath(path || d.path || d.conceptId || d.concept_id || currentPath());
    return recordEvent("ai_quiz_complete", Object.assign({}, d, { path: p, completed: true }), Object.assign({}, opts || {}, { metric: "ai_quiz", path: p }));
  }

  function drainPendingXpActivityQueue(reason) {
    let queue = [];
    try {
      const raw = localStorage.getItem(PENDING_XP_ACTIVITY_QUEUE_KEY);
      queue = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(queue) || !queue.length) return { ok: true, empty: true };
      localStorage.removeItem(PENDING_XP_ACTIVITY_QUEUE_KEY);
    } catch (_) { return { ok: false, error: "pending queue unreadable" }; }
    let imported = 0;
    const keep = [];
    queue.slice(-300).forEach((item) => {
      try {
        if (!item || typeof item !== "object") return;
        const metric = clampText(item.metric || "", 80).trim();
        if (!metric || !XP_RULES[metric]) return;
        const details = item.details && typeof item.details === "object" ? item.details : {};
        const opts = item.opts && typeof item.opts === "object" ? item.opts : {};
        const ts = Math.max(1, Number(item.queuedAt || item.ts || details.ts || Date.now()) || Date.now());
        recordActivity(metric, Object.assign({}, details, { source: details.source || item.source || reason || "pending-xp-import" }), Object.assign({}, opts, {
          id: item.id || opts.id || `pending_${metric}_${ts}_${fastStringHash(JSON.stringify(details).slice(0, 900))}`,
          ts,
          throttleMs: 0,
          scope: opts.scope || `pending:${metric}:${ts}`
        }));
        imported += 1;
      } catch (_) {
        keep.push(item);
      }
    });
    if (keep.length) { try { localStorage.setItem(PENDING_XP_ACTIVITY_QUEUE_KEY, JSON.stringify(keep.slice(-100))); } catch (_) {} }
    return { ok: true, imported, remaining: keep.length };
  }

  function deriveState(file) {
    const events = (file ? normaliseFile(file) : readFile()).eventLog || [];
    const visits = new Map();
    const pageActions = new Map();
    const mastery = new Map();
    const readiness = new Map();
    const quiz = new Map();
    const comments = new Map();

    for (const ev of events) {
      const t = Number(ev.ts || 0) || 0;
      const p = normalisePath(ev.path || "");
      const m = String(ev.metric || "");
      const type = String(ev.type || "");
      if ((type === "page_visit" || m === "view") && p) {
        const old = visits.get(p) || { path: p, title: ev.title || p, firstVisited: t, lastVisited: 0, visitCount: 0, visits: [] };
        old.title = ev.title || old.title || p;
        old.firstVisited = Math.min(Number(old.firstVisited || t), t || Number(old.firstVisited || t));
        old.lastVisited = Math.max(Number(old.lastVisited || 0), t);
        const inc = Math.max(1, Number(ev.count || 1) || 1);
        old.visitCount += inc;
        old.visits.push({ ts: t, id: ev.id, title: ev.title || old.title, count: inc });
        visits.set(p, old);
      }
      if (type === "page_action_set" && p && ev.action) {
        const key = `${p}::${ev.action}`;
        const old = pageActions.get(key);
        if (shouldReplacePageActionEvent(old, ev, t)) {
          pageActions.set(key, { path: p, title: ev.title || p, action: ev.action, active: ev.active !== false, deleted: ev.active === false, ts: t, updatedAt: t, id: ev.id, seed: isSeedPageActionEvent(ev) });
        }
      }
      if (type === "mastery_set" && p && shouldUseMasteryEvent(ev)) {
        const old = mastery.get(p);
        if (!old || t >= Number(old.updatedAt || old.ts || 0)) {
          const val = masteryEventLevel(ev);
          const rated = val != null;
          mastery.set(p, { path: p, title: ev.title || p, m: rated ? val : null, state: rated ? "rated" : "unrated", unrated: !rated, lastReviewed: rated ? t : 0, updatedAt: t, history: masteryHistoryForPath(events, p), sourceEventId: ev.id });
        }
      }
      if ((type === "readiness_set" || type === "readiness_view" || m === "prerequisite_readiness_open") && p) {
        const old = readiness.get(p);
        if (!old || t >= Number(old.updatedAt || 0)) readiness.set(p, { path: p, title: ev.title || p, readiness: Number(ev.value || ev.details && ev.details.readiness || 0) || 0, updatedAt: t, ts: t });
      }
      if (type === "ai_quiz_complete" || m === "ai_quiz") {
        const resultId = String((ev.details && (ev.details.resultId || ev.details.result_id || ev.details.sessionId || ev.details.session_id)) || ev.id || "");
        const key = `${p || "global"}::${resultId}`;
        const old = quiz.get(key);
        if (!old || t >= Number(old.ts || 0)) quiz.set(key, { path: p, title: ev.title || p, resultId, ts: t, completedAt: t, event: ev });
      }
      if (["comment", "reply", "comment_edit", "report"].includes(m) || /^comment_/.test(type)) {
        const id = String(ev.details && (ev.details.commentId || ev.details.comment_id || ev.details.id) || ev.id || "");
        if (id) comments.set(id, { id, path: p, title: ev.title || p, metric: m, ts: t, event: ev });
      }
    }

    const activeActions = Array.from(pageActions.values()).filter((x) => x && x.active !== false && !x.deleted).sort((a,b) => Number(b.updatedAt || b.ts || 0) - Number(a.updatedAt || a.ts || 0));
    return {
      visits: Array.from(visits.values()).sort((a,b) => Number(b.lastVisited || 0) - Number(a.lastVisited || 0)),
      pageActions: Array.from(pageActions.values()).sort((a,b) => Number(b.updatedAt || b.ts || 0) - Number(a.updatedAt || a.ts || 0)),
      activePageActions: activeActions,
      favorites: activeActions.filter((x) => x.action === "favorite"),
      mastery: Object.fromEntries(Array.from(mastery.values()).map((r) => [r.path, masteryRecordForLegacy(r, events)])),
      readiness: Array.from(readiness.values()).sort((a,b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0)),
      quizSessions: quizSessionsForLegacy(Array.from(quiz.values())),
      quizList: Array.from(quiz.values()).sort((a,b) => Number(b.ts || 0) - Number(a.ts || 0)),
      comments: Array.from(comments.values()).sort((a,b) => Number(b.ts || 0) - Number(a.ts || 0)),
      events
    };
  }
  function masteryHistoryForPath(events, path) {
    return (events || []).filter((ev) => {
      if (normalisePath(ev.path) !== path) return false;
      if (ev.type === "page_visit" || ev.metric === "view") return true;
      return ev.type === "mastery_set" && shouldUseMasteryEvent(ev);
    }).map((ev) => {
      if (ev.type === "page_visit" || ev.metric === "view") return { kind: "view", ts: Number(ev.ts || 0), source: ev.type || ev.metric };
      const val = masteryEventLevel(ev);
      return { kind: "mastery", m: val, ts: Number(ev.ts || 0), source: ev.details && ev.details.source || ev.type || ev.metric };
    }).filter((x) => x.ts).slice(-120);
  }
  function masteryRecordForLegacy(row, events) {
    const hist = masteryHistoryForPath(events, row.path);
    const reviews = hist.filter((h) => h.kind === "mastery" && [0,1,2,3].includes(Number(h.m)));
    const views = hist.filter((h) => h.kind === "view");
    const counts = { full: 0, know: 0, fuzzy: 0, dont: 0 };
    reviews.forEach((h) => { if (h.m === 3) counts.full += 1; else if (h.m === 2) counts.know += 1; else if (h.m === 1) counts.fuzzy += 1; else if (h.m === 0) counts.dont += 1; });
    return {
      title: row.title || row.path,
      m: row.m,
      state: row.unrated ? "unrated" : "rated",
      unrated: !!row.unrated,
      visited: true,
      lastViewed: views.reduce((mx, h) => Math.max(mx, Number(h.ts || 0)), 0),
      lastReviewed: row.lastReviewed || 0,
      updatedAt: row.updatedAt || row.lastReviewed || 0,
      viewCount: Math.max(views.length, reviews.length ? 1 : 0),
      visitCount: Math.max(views.length, reviews.length ? 1 : 0),
      reviewCount: reviews.length,
      counts,
      history: hist
    };
  }
  function quizSessionsForLegacy(list) {
    const out = {};
    for (const item of list || []) {
      const p = item.path || "";
      if (!p) continue;
      if (!Array.isArray(out[p])) out[p] = [];
      const ev = item.event || {};
      const d = ev.details || {};
      out[p].push(Object.assign({
        result_id: item.resultId,
        resultId: item.resultId,
        ts: item.ts,
        completed_at: item.completedAt,
        completedAt: item.completedAt,
        concept_id: p,
        concept_title: item.title || p,
        completed: true
      }, d.session && typeof d.session === "object" ? d.session : {}, d));
    }
    return out;
  }
  function legacyRecordLevel(rec) {
    if (!rec || typeof rec !== "object") return null;
    if (rec.unrated === true || String(rec.state || "").toLowerCase() === "unrated") return null;
    const raw = rec.m != null ? rec.m : rec.level != null ? rec.level : rec.mastery;
    const n = Number(raw);
    return [0, 1, 2, 3].includes(n) ? n : null;
  }
  function legacyRecordHistory(rec) {
    if (!rec || typeof rec !== "object") return [];
    const h = Array.isArray(rec.history) ? rec.history : Array.isArray(rec.reviewHistory) ? rec.reviewHistory : Array.isArray(rec.masteryHistory) ? rec.masteryHistory : [];
    return h.filter((x) => x && typeof x === "object");
  }
  function legacyHistoryTime(item) {
    const n = Number(item && (item.ts || item.time || item.at || item.date || item.createdAt || item.created_at));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  function legacyHistoryKind(item) {
    const k = String(item && (item.kind || item.type || item.event || item.action) || "").toLowerCase().trim();
    if (k === "view" || k === "visit" || k === "seen") return "view";
    return "mastery";
  }
  function readLegacyMasteryMap() {
    try {
      const raw = localStorage.getItem(LEGACY_MASTERY_KEY) || "";
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (_) { return {}; }
  }
  function hasUsefulLegacyMasteryMap(map) {
    try {
      return Object.values(map || {}).some((rec) => {
        if (!rec || typeof rec !== "object") return false;
        if (legacyRecordLevel(rec) != null) return true;
        if ((Array.isArray(rec.history) || Array.isArray(rec.reviewHistory) || Array.isArray(rec.masteryHistory)) && legacyRecordHistory(rec).length) return true;
        return !!(Number(rec.lastReviewed || 0) || Number(rec.lastViewed || rec.lastSeen || 0));
      });
    } catch (_) { return false; }
  }
  function existingEventKeysForLegacyImport(events) {
    const set = new Set();
    (Array.isArray(events) ? events : []).forEach((ev) => {
      const p = normalisePath(ev && ev.path || "");
      const t = Number(ev && (ev.ts || ev.createdAt || ev.created_at) || 0) || 0;
      const metric = String(ev && ev.metric || metricForType(ev && ev.type || "") || "");
      if (!p || !t) return;
      if (metric === "view" || ev.type === "page_visit") set.add(`view:${p}:${Math.floor(t / 5000)}`);
      if ((metric === "mastery" || ev.type === "mastery_set") && shouldUseMasteryEvent(ev)) {
        const n = masteryEventLevel(ev);
        set.add(`mastery:${p}:${t}:${n != null ? n : "clear"}`);
      }
    });
    return set;
  }
  function legacyMasteryEventsFromLocalStorage() {
    const map = readLegacyMasteryMap();
    if (!hasUsefulLegacyMasteryMap(map)) return [];
    const out = [];
    const pushEvent = (ev) => { const clean = normaliseEvent(ev); if (clean) out.push(clean); };
    Object.entries(map || {}).forEach(([rawPath, rec]) => {
      const data = rec && typeof rec === "object" ? rec : {};
      const p = normalisePath(rawPath || data.path || data.conceptId || data.concept_id || "");
      if (!p) return;
      const title = cleanPageTitleText(data.title || p);
      const history = legacyRecordHistory(data);
      let hasMasteryHist = false;
      let hasViewHist = false;
      history.forEach((item) => {
        const ts = legacyHistoryTime(item);
        if (!ts) return;
        const kind = legacyHistoryKind(item);
        if (kind === "view") {
          hasViewHist = true;
          const visitId = String(item.visitId || item.visit_id || "");
          pushEvent({
            id: `legacy_view_${fastStringHash([p, Math.floor(ts / 5000), visitId].join("|"))}`,
            type: "page_visit", metric: "view", path: p, title, ts, createdAt: ts, updatedAt: ts,
            details: { source: item.source || "legacy-mastery-history-view", visitId }
          });
          return;
        }
        const n = Number(item.m != null ? item.m : item.level != null ? item.level : item.mastery);
        if (![0,1,2,3].includes(n)) return;
        hasMasteryHist = true;
        pushEvent({
          id: `legacy_mastery_${fastStringHash([p, ts, n, item.source || ""].join("|"))}`,
          type: "mastery_set", metric: "mastery", path: p, title, ts, createdAt: ts, updatedAt: ts,
          value: n,
          details: { source: item.source || "legacy-mastery-history-rating", mastery: n, level: n }
        });
      });
      const level = legacyRecordLevel(data);
      const reviewedAt = Number(data.lastReviewed || data.updatedAt || data.updated_at || data.ts || 0) || 0;
      if (!hasMasteryHist && level != null && reviewedAt) {
        pushEvent({
          id: `legacy_mastery_${fastStringHash([p, reviewedAt, level, "fallback"].join("|"))}`,
          type: "mastery_set", metric: "mastery", path: p, title, ts: reviewedAt, createdAt: reviewedAt, updatedAt: reviewedAt,
          value: level,
          details: { source: "legacy-mastery-record", mastery: level, level }
        });
      }
      const viewedAt = Number(data.lastViewed || data.lastSeen || 0) || 0;
      if (!hasViewHist && viewedAt) {
        pushEvent({
          id: `legacy_view_${fastStringHash([p, Math.floor(viewedAt / 5000), "fallback"].join("|"))}`,
          type: "page_visit", metric: "view", path: p, title, ts: viewedAt, createdAt: viewedAt, updatedAt: viewedAt,
          details: { source: "legacy-mastery-record-view" }
        });
      }
    });
    return out;
  }
  function readLegacyArray(key) {
    try {
      const raw = localStorage.getItem(key) || "";
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  }

  function readLegacyObject(key) {
    try {
      const raw = localStorage.getItem(key) || "";
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (_) { return {}; }
  }

  function legacyTimestamp(row, keys) {
    for (const key of keys || []) {
      const n = Number(row && row[key]);
      if (Number.isFinite(n) && n > 0) return n;
    }
    return 0;
  }

  function legacyAccountEventsFromLocalStorage() {
    const out = [];
    const push = (ev) => { const clean = normaliseEvent(ev); if (clean) out.push(clean); };

    readLegacyArray(LEGACY_VISITS_KEY).slice(-5000).forEach((v) => {
      const p = normalisePath(v && v.path || "");
      if (!p) return;
      const ts = legacyTimestamp(v, ["lastVisited", "last_visited", "ts", "updatedAt", "updated_at", "createdAt", "created_at"]) || now();
      const count = Math.max(1, Number(v && (v.visitCount || v.visit_count || v.count) || 1) || 1);
      push({
        id: `legacy_visit_${fastStringHash([p, Math.floor(ts / 5000), count].join("|"))}`,
        type: "page_visit", metric: "view", path: p, title: v.title || p, count, ts, createdAt: legacyTimestamp(v, ["firstVisited", "first_visited", "createdAt", "created_at"]) || ts, updatedAt: ts,
        details: { source: "legacy-local-visits", count }
      });
    });

    const addAction = (row, fallbackAction) => {
      const p = normalisePath(row && row.path || "");
      const action = String((row && row.action) || fallbackAction || "favorite").trim().toLowerCase();
      if (!p || !action) return;
      const active = row && row.active === false ? false : !(row && row.deleted === true);
      const ts = legacyTimestamp(row, ["updatedAt", "updated_at", "ts", "createdAt", "created_at"]) || now();
      push({
        id: `legacy_action_${fastStringHash([p, action, active ? 1 : 0, ts].join("|"))}`,
        type: "page_action_set", metric: "saved_page_action", path: p, title: row.title || p, action, active, ts, createdAt: legacyTimestamp(row, ["createdAt", "created_at"]) || ts, updatedAt: ts,
        details: { source: "legacy-page-actions", action, active }
      });
    };
    readLegacyArray(LEGACY_PAGE_ACTIONS_KEY).slice(-5000).forEach((row) => addAction(row, row && row.action));
    readLegacyArray(LEGACY_FAVORITES_KEY).slice(-3000).forEach((row) => addAction(row, "favorite"));

    readLegacyArray(LEGACY_READINESS_KEY).slice(-5000).forEach((r) => {
      const p = normalisePath(r && r.path || "");
      if (!p) return;
      const ts = legacyTimestamp(r, ["updatedAt", "updated_at", "ts", "createdAt", "created_at"]) || now();
      const readiness = Number(r && (r.readiness != null ? r.readiness : (r.percent != null ? r.percent : r.score)));
      push({
        id: `legacy_readiness_${fastStringHash([p, ts, readiness].join("|"))}`,
        type: "readiness_set", metric: "prerequisite_readiness_open", path: p, title: r.title || p, value: Number.isFinite(readiness) ? readiness : 0, ts, createdAt: ts, updatedAt: ts,
        details: { source: "legacy-readiness", readiness: Number.isFinite(readiness) ? readiness : 0 }
      });
    });

    const quizMap = readLegacyObject(LEGACY_AIQ_KEY);
    Object.entries(quizMap || {}).forEach(([rawPath, sessions]) => {
      const p = normalisePath(rawPath || "");
      if (!p || !Array.isArray(sessions)) return;
      sessions.slice(-200).forEach((session) => {
        const s = session && typeof session === "object" ? session : {};
        const ts = legacyTimestamp(s, ["completedAt", "completed_at", "resultAt", "result_at", "updatedAt", "updated_at", "ts"]) || now();
        const rid = String(s.result_id || s.resultId || s.session_id || s.sessionId || fastStringHash(JSON.stringify(s).slice(0, 900))).slice(0, 160);
        push({
          id: `legacy_aiq_${fastStringHash([p, rid].join("|"))}`,
          type: "ai_quiz_complete", metric: "ai_quiz", path: p, title: s.concept_title || s.conceptTitle || s.title || p, ts, createdAt: ts, updatedAt: ts,
          details: { source: "legacy-ai-quiz-sessions", resultId: rid, completedAt: ts, completed: true, resultProduced: true, session: s }
        });
      });
    });

    return out.concat(legacyMasteryEventsFromLocalStorage());
  }

  function semanticEventKeyForImport(ev) {
    const p = normalisePath(ev && ev.path || "");
    const t = Number(ev && (ev.ts || ev.createdAt || ev.created_at) || 0) || 0;
    const metric = String(ev && ev.metric || metricForType(ev && ev.type || "") || "");
    const d = ev && ev.details && typeof ev.details === "object" ? ev.details : {};
    if (!metric) return "";
    if (metric === "view" || ev.type === "page_visit") return `view:${p}:${Math.floor(t / 5000)}`;
    if ((metric === "mastery" || ev.type === "mastery_set") && shouldUseMasteryEvent(ev)) return `mastery:${p}:${t}:${masteryEventLevel(ev) != null ? masteryEventLevel(ev) : "clear"}`;
    if (ev.type === "page_action_set") return `action:${p}:${ev.action || d.action || ""}:${t}:${ev.active === false ? 0 : 1}`;
    if (metric === "ai_quiz") return `aiq:${p}:${d.resultId || d.result_id || d.sessionId || d.session_id || ev.id || t}`;
    if (String(ev.type || "").indexOf("readiness") >= 0 || metric === "prerequisite_readiness_open") return `readiness:${p}:${t}`;
    return `${metric}:${p}:${t}:${ev.id || ""}`;
  }

  function importLegacyAccountFileOnce(reason) {
    try {
      if (/^boot/i.test(String(reason || ""))) {
        try { if (localStorage.getItem(LEGACY_ACCOUNT_IMPORT_KEY)) return { ok: true, imported: 0, skipped: true, reason: "already-imported" }; } catch (_) {}
      }
      const legacyEvents = legacyAccountEventsFromLocalStorage();
      if (!legacyEvents.length) return { ok: true, imported: 0, empty: true };
      const file = readFile();
      const existing = new Set((file.eventLog || []).map(semanticEventKeyForImport).filter(Boolean));
      const toAdd = [];
      for (const ev of legacyEvents) {
        const key = semanticEventKeyForImport(ev);
        if (key && existing.has(key)) continue;
        if (key) existing.add(key);
        toAdd.push(ev);
      }
      if (!toAdd.length) {
        try { localStorage.setItem(LEGACY_ACCOUNT_IMPORT_KEY, String(Date.now())); } catch (_) {}
        return { ok: true, imported: 0, deduped: true };
      }
      file.eventLog = (file.eventLog || []).concat(toAdd);
      writeFile(file, { source: reason || "legacy-account-import" });
      try { localStorage.setItem(LEGACY_ACCOUNT_IMPORT_KEY, String(Date.now())); } catch (_) {}
      return { ok: true, imported: toAdd.length };
    } catch (err) {
      return { ok: false, error: String(err && err.message || err) };
    }
  }

  function importLegacyMasteryIntoAccountFileOnce(reason) {
    try {
      if (/^boot/i.test(String(reason || ""))) {
        try { if (localStorage.getItem(LEGACY_MASTERY_IMPORT_KEY)) return { ok: true, imported: 0, skipped: true, reason: "already-imported" }; } catch (_) {}
      }
      const legacyEvents = legacyMasteryEventsFromLocalStorage();
      if (!legacyEvents.length) return { ok: true, imported: 0, empty: true };
      const file = readFile();
      const existing = existingEventKeysForLegacyImport(file.eventLog || []);
      const toAdd = [];
      for (const ev of legacyEvents) {
        const p = normalisePath(ev.path || "");
        const t = Number(ev.ts || 0) || 0;
        if (!p || !t) continue;
        let key = "";
        if (ev.metric === "view" || ev.type === "page_visit") key = `view:${p}:${Math.floor(t / 5000)}`;
        else if ((ev.metric === "mastery" || ev.type === "mastery_set") && shouldUseMasteryEvent(ev)) {
          const n = masteryEventLevel(ev);
          key = `mastery:${p}:${t}:${n != null ? n : "clear"}`;
        }
        if (key && existing.has(key)) continue;
        if (key) existing.add(key);
        toAdd.push(ev);
      }
      if (!toAdd.length) {
        try { localStorage.setItem(LEGACY_MASTERY_IMPORT_KEY, String(Date.now())); } catch (_) {}
        return { ok: true, imported: 0, deduped: true };
      }
      file.eventLog = (file.eventLog || []).concat(toAdd);
      writeFile(file, { source: reason || "legacy-mastery-import" });
      try { localStorage.setItem(LEGACY_MASTERY_IMPORT_KEY, String(Date.now())); } catch (_) {}
      return { ok: true, imported: toAdd.length };
    } catch (err) {
      return { ok: false, error: String(err && err.message || err) };
    }
  }

  function importLegacyStoresOnce(reason) {
    const out = { ok: true, imported: 0, parts: {} };
    try {
      const account = importLegacyAccountFileOnce(reason || "legacy-stores-import");
      out.parts.account = account;
      out.imported += Number(account && account.imported || 0);
      if (account && account.ok === false) out.ok = false;
    } catch (err) {
      out.ok = false;
      out.parts.account = { ok: false, error: String(err && err.message || err) };
    }
    try {
      const mastery = importLegacyMasteryIntoAccountFileOnce(reason || "legacy-stores-import");
      out.parts.mastery = mastery;
      out.imported += Number(mastery && mastery.imported || 0);
      if (mastery && mastery.ok === false) out.ok = false;
    } catch (err) {
      out.ok = false;
      out.parts.mastery = { ok: false, error: String(err && err.message || err) };
    }
    out.empty = !out.imported;
    return out;
  }

  function applyLegacyMirrors(file) {
    const state = deriveState(file || readFile());
    try { localStorage.setItem(LEGACY_VISITS_KEY, JSON.stringify(state.visits.map((x) => ({ path: x.path, title: x.title, ts: x.lastVisited, lastVisited: x.lastVisited, visitCount: x.visitCount })).slice(0, 5000))); } catch (_) {}
    try { localStorage.setItem(LEGACY_PAGE_ACTIONS_KEY, JSON.stringify(state.activePageActions.map((x) => ({ path: x.path, title: x.title, action: x.action, ts: x.ts, updatedAt: x.updatedAt })).slice(0, 5000))); } catch (_) {}
    try { localStorage.setItem(LEGACY_FAVORITES_KEY, JSON.stringify(state.favorites.map((x) => ({ path: x.path, title: x.title, ts: x.ts, updatedAt: x.updatedAt })).slice(0, 5000))); } catch (_) {}
    try {
      const hasMasterySignal = (state.events || []).some((ev) => ev && (ev.type === "mastery_set" || ev.metric === "mastery"));
      const nextMastery = state.mastery || {};
      const nextCount = Object.keys(nextMastery).length;
      const existingMastery = readLegacyMasteryMap();
      if (hasMasterySignal || nextCount > 0 || !hasUsefulLegacyMasteryMap(existingMastery)) {
        localStorage.setItem(LEGACY_MASTERY_KEY, JSON.stringify(nextMastery));
      }
    } catch (_) {}
    try { localStorage.setItem(LEGACY_AIQ_KEY, JSON.stringify(state.quizSessions || {})); } catch (_) {}
    try { localStorage.setItem(LEGACY_READINESS_KEY, JSON.stringify((state.readiness || []).slice(0, 5000))); } catch (_) {}
  }

  // Deriving the full account state from the event ledger is the single most
  // expensive read on this account (it scans the whole eventLog and, for each
  // mastery concept, rebuilds its history). The account panel asks for it several
  // times per render (visits + saved + comments tabs, exact stats, etc.). Memoise
  // the current local file's derived state by a cheap content signature so a burst
  // of reads or a tab switch with no change reuses one pass instead of N passes.
  let __mkCurrentStateMemoVer = -1;
  let __mkCurrentStateMemo = null;
  function deriveCurrentState() {
    if (__mkCurrentStateMemo && __mkCurrentStateMemoVer === __mkAccountDataVersion) return __mkCurrentStateMemo;
    const st = deriveState(readFile());
    __mkCurrentStateMemoVer = __mkAccountDataVersion;
    __mkCurrentStateMemo = st;
    return st;
  }
  function invalidateCurrentStateMemo() { __mkCurrentStateMemoVer = -1; __mkCurrentStateMemo = null; }
  try {
    window.addEventListener("storage", (e) => {
      if (!e) return;
      if (e.key == null || e.key === LOCAL_FILE_KEY || e.key === LOCAL_PENDING_EVENTS_KEY) { bumpAccountDataVersion(); invalidateCurrentStateMemo(); }
    });
  } catch (_) {}
  function statsFromState(st) {
    const stores = {
      eventLog: st.events.length,
      activityEvents: st.events.filter((e) => XP_RULES[e.metric]).length,
      visits: st.visits.length,
      pageActions: st.activePageActions.length,
      favorites: st.favorites.length,
      mastery: Object.keys(st.mastery || {}).filter((k) => st.mastery[k] && st.mastery[k].unrated !== true && [0,1,2,3].includes(Number(st.mastery[k].m))).length,
      quizSessions: st.quizList.length,
      readiness: st.readiness.length,
      comments: st.comments.length,
      localStorage: 0
    };
    return { total: Object.values(stores).reduce((a,b) => a + Number(b || 0), 0), stores };
  }
  function statsForFile(file) {
    return statsFromState(deriveState(file || readFile()));
  }
  function statsForCurrentLocalFile() {
    return statsFromState(deriveCurrentState());
  }
  function positiveDelta(before, after) {
    const b = before && before.stores || {};
    const a = after && after.stores || {};
    const stores = {};
    let total = 0;
    for (const k of new Set([].concat(Object.keys(b), Object.keys(a)))) {
      const d = Math.max(0, Number(a[k] || 0) - Number(b[k] || 0));
      if (d) stores[k] = d;
      total += d;
    }
    return { total, stores };
  }
  function statsEquivalentForAccountSync(a, b) {
    const aa = a && a.stores || {};
    const bb = b && b.stores || {};
    const keys = ["eventLog", "activityEvents", "visits", "pageActions", "favorites", "readiness", "mastery", "quizSessions", "comments", "localStorage"];
    return keys.every((key) => Number(aa[key] || 0) === Number(bb[key] || 0));
  }

  function eventIdentityForFingerprint(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const details = e.details && typeof e.details === "object" && !Array.isArray(e.details) ? e.details : {};
    // CONTENT identity (no raw id, no updatedAt). The same logical action carries
    // divergent random ids across devices for legacy/old-format rows, and a touched
    // copy can differ only in updatedAt; keying the fingerprint on either made a
    // content-equal device never match the cloud. Aligning this with
    // eventContentSignature lets fingerprintsEqual converge.
    const core = [
      e.type || "",
      e.metric || "",
      e.path || "",
      e.action || "",
      e.active === false ? "0" : (e.active === true ? "1" : ""),
      e.value != null ? String(e.value) : "",
      Math.floor(Number(e.ts || e.createdAt || e.created_at || 0) || 0),
      details.resultId || details.result_id || "",
      details.sessionId || details.session_id || "",
      details.commentId || details.comment_id || "",
      details.notificationId || details.notification_id || ""
    ].map((x) => String(x == null ? "" : x).replace(/[|\n\r]/g, " ")).join("|");
    return core;
  }

  function scoreStateFingerprintText(scoreState) {
    const st = scoreState && typeof scoreState === "object" && !Array.isArray(scoreState) ? scoreState : {};
    const daily = new Map();
    const addDay = (day, row) => {
      const d = String(day || row && row.day || "").slice(0, 10);
      if (!d) return;
      const r = row && typeof row === "object" && !Array.isArray(row) ? row : {};
      const score = round(r.score != null ? r.score : r.total);
      const rawScore = round(r.rawScore);
      const beforeCap = round(r.scoreBeforeDailyCap);
      const currencyEarned = round(r.currencyEarned != null ? r.currencyEarned : r.currency);
      const currencySpent = round(r.currencySpent);
      const currencyCredited = round(r.currencyCredited);
      const count = round(r.count);
      if (Math.abs(score) < 0.000001 && Math.abs(rawScore) < 0.000001 && Math.abs(beforeCap) < 0.000001 && Math.abs(currencyEarned) < 0.000001 && Math.abs(currencySpent) < 0.000001 && Math.abs(currencyCredited) < 0.000001 && Math.abs(count) < 0.000001) return;
      daily.set(d, [d, count, rawScore, beforeCap, score, currencyEarned, currencySpent, currencyCredited].join(":"));
    };
    if (st.dailyBuckets && typeof st.dailyBuckets === "object" && !Array.isArray(st.dailyBuckets)) {
      Object.entries(st.dailyBuckets).forEach(([d, row]) => addDay(d, row));
    }
    if (Array.isArray(st.dailySummary)) st.dailySummary.forEach((row) => addDay(row && row.day, row));
    const dailyText = Array.from(daily.keys()).sort().map((d) => daily.get(d)).join(";");
    return [
      "score-state-v1",
      round(st.totalScore != null ? st.totalScore : (st.totalXp != null ? st.totalXp : st.score)),
      round(st.totalRawScore),
      round(st.totalRepeatAdjustedScore),
      round(st.totalBeforeDailyCap),
      round(st.totalCurrencyEarned != null ? st.totalCurrencyEarned : st.currencyEarned),
      round(st.currencyCredited),
      round(st.currencySpent),
      round(st.currencyBalance != null ? st.currencyBalance : st.eorbits),
      dailyText
    ].join("|");
  }

  function fnvHashText(text) {
    let h = 2166136261;
    const s = String(text || "");
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function fileFingerprint(file) {
    const f = normaliseFile(file || emptyFile());
    const rows = (f.eventLog || []).map(eventIdentityForFingerprint).sort();
    const eventText = rows.join("\n");
    const scoreStateText = scoreStateFingerprintText(f.scoreState);
    const hash = fnvHashText(eventText + "\n--score-state--\n" + scoreStateText);
    return {
      algorithm: "fnv1a-event-ledger-score-state-v3-content",
      eventCount: rows.length,
      hash,
      eventHash: fnvHashText(eventText),
      scoreStateHash: fnvHashText(scoreStateText),
      stats: statsForFile(f)
    };
  }

  function fingerprintsCompatibleForStrictCompare(a, b) {
    const aa = String(a && a.algorithm || "");
    const bb = String(b && b.algorithm || "");
    return !aa || !bb || aa === bb;
  }

  function fingerprintsEqual(a, b) {
    if (!a || !b || Number(a.eventCount || 0) !== Number(b.eventCount || 0)) return false;
    if (fingerprintsCompatibleForStrictCompare(a, b)) return String(a.hash || "") === String(b.hash || "");
    if (a.eventHash && b.eventHash) return String(a.eventHash || "") === String(b.eventHash || "");
    return false;
  }

  function fileDifference(localFile, cloudFile) {
    const local = normaliseFile(localFile || emptyFile());
    const cloud = normaliseFile(cloudFile || emptyFile());
    // Compare by CONTENT signature, not raw id. Legacy/old-format events carry
    // divergent random ids for the SAME action across devices, so an id-based diff
    // reported them as "different" forever: the device uploads them, the server
    // collapses them by content into the existing cloud copy, the cloud count never
    // grows, and the device still sees them missing → endless "Needs sync". Keying
    // on content makes a content-equal device count as fully synced.
    const lset = new Set(withoutAccountScoreBaselineEvents(local.eventLog || []).map(eventContentSignature).filter(Boolean));
    const cset = new Set(withoutAccountScoreBaselineEvents(cloud.eventLog || []).map(eventContentSignature).filter(Boolean));
    let cloudOnly = 0;
    let localOnly = 0;
    cset.forEach((sig) => { if (!lset.has(sig)) cloudOnly += 1; });
    lset.forEach((sig) => { if (!cset.has(sig)) localOnly += 1; });
    return { localOnly, cloudOnly, localEvents: lset.size, cloudEvents: cset.size };
  }

  function eventsMissingFromCloud(localFile, cloudFile) {
    const local = normaliseFile(localFile || emptyFile());
    const cloud = normaliseFile(cloudFile || emptyFile());
    // Content-based, matching fileDifference: a local event is only "missing" when
    // the cloud has no event with the SAME content. This stops re-uploading legacy
    // copies that the server would just collapse away (which never converged).
    const cloudSigs = new Set(withoutAccountScoreBaselineEvents(cloud.eventLog || []).map(eventContentSignature).filter(Boolean));
    const out = [];
    const seen = new Set();
    for (const ev of withoutAccountScoreBaselineEvents(local.eventLog || [])) {
      const clean = normaliseEvent(ev);
      const sig = clean && eventContentSignature(clean);
      if (!sig || cloudSigs.has(sig) || seen.has(sig)) continue;
      seen.add(sig);
      out.push(clean);
    }
    return out.sort((a, b) => (Number(a.ts || 0) - Number(b.ts || 0)) || String(a.id || "").localeCompare(String(b.id || "")));
  }


  function shopItemIdFromEvent(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const d = e.details && typeof e.details === "object" ? e.details : {};
    return clampText(d.itemId || d.item_id || d.productId || d.product_id || e.itemId || e.productId || "", 120).trim();
  }

  function timestampMsFromEventValue(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return 0;
    // Be defensive about restored / imported rows. Local events normally store
    // milliseconds, but some compact summaries can carry seconds or microseconds.
    if (n > 1e14) return Math.floor(n / 1000);
    if (n < 1e11) return Math.floor(n * 1000);
    return Math.floor(n);
  }

  function shopBoostStartFromEvent(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const d = e.details && typeof e.details === "object" ? e.details : {};
    const candidates = [e.ts, e.createdAt, e.created_at, d.startedAt, d.started_at, d.start, d.activatedAt, d.activated_at, d.createdAt, d.created_at];
    for (const value of candidates) {
      const t = timestampMsFromEventValue(value);
      if (t) return t;
    }
    return Date.now();
  }

  function shopBoostDurationMs(item) {
    const it = item && typeof item === "object" ? item : {};
    const hours = Number(it.durationHours || it.duration_hours || 0);
    if (Number.isFinite(hours) && hours > 0) return Math.max(1, hours) * 3600000;
    const days = Number(it.durationDays || it.duration_days || 0);
    if (Number.isFinite(days) && days > 0) return Math.max(0, days) * 86400000;
    return 0;
  }

  function cleanShopBoostRow(row) {
    try {
      const r = row && typeof row === "object" ? row : {};
      const itemId = clampText(r.itemId || r.item_id || r.id || "", 120).trim();
      const startedAt = Number(r.startedAt || r.start || r.ts || 0) || 0;
      const expiresAt = Number(r.expiresAt || r.end || r.until || 0) || 0;
      const xpMultiplier = Math.max(1, Number(r.xpMultiplier || r.multiplier || 1) || 1);
      const dailyCapMultiplier = Math.max(1, Number(r.dailyCapMultiplier || r.capMultiplier || 1) || 1);
      if (!itemId || !startedAt || !expiresAt || expiresAt <= startedAt) return null;
      return { itemId, title: clampText(r.title || (SHOP_CATALOG[itemId] && SHOP_CATALOG[itemId].title) || itemId, 160), startedAt, expiresAt, xpMultiplier, dailyCapMultiplier };
    } catch (_) { return null; }
  }

  function cleanShopBoostRows(input) {
    const rows = [];
    try {
      if (Array.isArray(input)) input.forEach((row) => { const clean = cleanShopBoostRow(row); if (clean) rows.push(clean); });
      else if (input && typeof input === "object") {
        if (Array.isArray(input.active)) input.active.forEach((row) => { const clean = cleanShopBoostRow(row); if (clean) rows.push(clean); });
        else if (Array.isArray(input.rows)) input.rows.forEach((row) => { const clean = cleanShopBoostRow(row); if (clean) rows.push(clean); });
      }
    } catch (_) {}
    const byKey = new Map();
    rows.forEach((row) => {
      const key = `${row.itemId}:${row.startedAt}:${row.expiresAt}`;
      const old = byKey.get(key);
      if (!old || Number(row.updatedAt || 0) > Number(old.updatedAt || 0)) byKey.set(key, row);
    });
    return Array.from(byKey.values()).sort((a, b) => Number(a.startedAt || 0) - Number(b.startedAt || 0)).slice(-30);
  }

  function boostRowsFromShopEvents(events) {
    const rows = [];
    try {
      (Array.isArray(events) ? events : []).forEach((ev) => {
        const metric = String(ev && (ev.metric || ev.type) || "").toLowerCase();
        if (metric !== "shop_purchase" && metric !== "shop_gift_received") return;
        const itemId = shopItemIdFromEvent(ev);
        const item = SHOP_CATALOG[itemId] || null;
        if (!item || !item.consumable) return;
        const start = shopBoostStartFromEvent(ev);
        const duration = shopBoostDurationMs(item);
        if (!duration) return;
        rows.push({ itemId, title: item.title || itemId, startedAt: start, expiresAt: start + duration, xpMultiplier: Number(item.xpMultiplier || 1) || 1, dailyCapMultiplier: Number(item.dailyCapMultiplier || 1) || 1 });
      });
    } catch (_) {}
    return cleanShopBoostRows(rows);
  }

  function mergeActiveBoostRows(a, b) {
    return cleanShopBoostRows([].concat(cleanShopBoostRows(a), cleanShopBoostRows(b)));
  }

  function ensureScoreStateBoostsFromFile(state, file) {
    try {
      if (!state || typeof state !== "object") return state;
      const fromEvents = boostRowsFromShopEvents(file && file.eventLog);
      if (!fromEvents.length) return state;
      state.activeBoosts = mergeActiveBoostRows(state.activeBoosts, fromEvents);
      const today = dayKey(Date.now());
      const active = activeScoreStateBoosts(state, Date.now());
      if (Number(active.dailyCapMultiplier || 1) > 1 || Number(active.xpMultiplier || 1) > 1) {
        if (!state.dailyBuckets || typeof state.dailyBuckets !== "object") state.dailyBuckets = {};
        const current = cleanScoreStateDailyBucket(state.dailyBuckets[today] || { day: today }, today);
        const baseCap = accountDailyXpCapForTotal(state.totalScore || 0);
        current.baseDailyCap = Math.max(Number(current.baseDailyCap || 0) || 0, baseCap);
        current.dailyCapMultiplier = Math.max(Number(current.dailyCapMultiplier || 1) || 1, Number(active.dailyCapMultiplier || 1) || 1);
        current.xpMultiplier = Math.max(Number(current.xpMultiplier || 1) || 1, Number(active.xpMultiplier || 1) || 1);
        current.dailyCap = Math.max(Number(current.dailyCap || 0) || 0, baseCap * current.dailyCapMultiplier);
        state.dailyBuckets[today] = current;
      }
    } catch (_) {}
    return state;
  }

  function activeShopBoostsForEvents(events, atTs) {
    const ts = Number(atTs || Date.now()) || Date.now();
    const rows = Array.isArray(events) ? events : [];
    let xpMultiplier = 1;
    let dailyCapMultiplier = 1;
    const active = [];
    rows.forEach((ev) => {
      const metric = String(ev && (ev.metric || ev.type) || "").toLowerCase();
      if (metric !== "shop_purchase" && metric !== "shop_gift_received") return;
      const itemId = shopItemIdFromEvent(ev);
      const item = SHOP_CATALOG[itemId] || null;
      if (!item || !item.consumable) return;
      const start = shopBoostStartFromEvent(ev);
      const duration = shopBoostDurationMs(item);
      const end = duration ? start + duration : 0;
      if (!start || !end || ts < start || ts > end) return;
      const row = { itemId, title: item.title || itemId, startedAt: start, expiresAt: end, xpMultiplier: Number(item.xpMultiplier || 1) || 1, dailyCapMultiplier: Number(item.dailyCapMultiplier || 1) || 1 };
      active.push(row);
      xpMultiplier = Math.max(xpMultiplier, row.xpMultiplier || 1);
      dailyCapMultiplier = Math.max(dailyCapMultiplier, row.dailyCapMultiplier || 1);
    });
    return { active, xpMultiplier, dailyCapMultiplier, xpBoostActive: xpMultiplier > 1.000001, capBoostActive: dailyCapMultiplier > 1.000001 };
  }

  function shopInventoryFromFile(file) {
    const f = file ? normaliseFile(file) : readFile();
    const owned = {};
    const purchases = [];
    const gifts = [];
    const consumables = [];
    const events = Array.isArray(f.eventLog) ? f.eventLog.slice().sort((a, b) => Number(a.ts || 0) - Number(b.ts || 0)) : [];
    events.forEach((ev) => {
      const metric = String(ev && (ev.metric || ev.type) || "").toLowerCase();
      const itemId = shopItemIdFromEvent(ev);
      if (!itemId) return;
      const d = ev.details && typeof ev.details === "object" ? ev.details : {};
      if (metric === "shop_purchase" || metric === "shop_gift_received") {
        const item = SHOP_CATALOG[itemId] || null;
        if (!item || isRetiredVisualShopItem(itemId, item)) return;
        const acquired = shopBoostStartFromEvent(ev);
        const row = {
          itemId,
          title: d.itemTitle || d.title || item.title || itemId,
          acquiredAt: acquired,
          source: metric,
          eventId: ev.id || "",
          consumable: !!item.consumable,
          expiresAt: item.consumable && shopBoostDurationMs(item) > 0 ? acquired + shopBoostDurationMs(item) : 0
        };
        if (item.consumable) consumables.push(row);
        else owned[itemId] = row;
        if (metric === "shop_purchase") purchases.push(row);
        else gifts.push(row);
      }
      if (metric === "shop_refund" || metric === "shop_revoke") {
        delete owned[itemId];
      }
    });
    const equipped = {};
    events.forEach((ev) => {
      const metric = String(ev && (ev.metric || ev.type) || "").toLowerCase();
      if (metric !== "shop_equip") return;
      const itemId = shopItemIdFromEvent(ev);
      const d = ev.details && typeof ev.details === "object" ? ev.details : {};
      const item = SHOP_CATALOG[itemId] || null;
      const slot = normaliseShopSlot(d.slot || (item && item.slot) || d.category || "cosmetic", itemId, item);
      if (!itemId || !slot) return;
      if (RETIRED_VISUAL_SHOP_SLOTS.has(slot) || isRetiredVisualShopItem(itemId, item)) { delete equipped[slot]; return; }
      if (itemId === "default" || d.clear === true) delete equipped[slot];
      else if (owned[itemId]) equipped[slot] = itemId;
    });
    return {
      owned,
      ownedIds: Object.keys(owned).sort(),
      equipped,
      purchases,
      gifts,
      consumables,
      activeBoosts: activeShopBoostsForEvents(events, Date.now()),
      activeTrials: activeShopTrialItems(f),
      trialUsesToday: [],
      catalog: visibleShopCatalogItems()
    };
  }

  function shopRelatedItemIds(itemId) {
    const id = clampText(itemId || "", 120).trim();
    const set = new Set(id ? [id] : []);
    try {
      const aliases = SHOP_ITEM_ALIASES && SHOP_ITEM_ALIASES[id];
      if (Array.isArray(aliases)) aliases.forEach((alias) => { if (alias) set.add(String(alias)); });
      Object.keys(SHOP_ITEM_ALIASES || {}).forEach((legacy) => {
        const arr = SHOP_ITEM_ALIASES[legacy];
        if (Array.isArray(arr) && arr.includes(id)) set.add(String(legacy));
      });
    } catch (_) {}
    return Array.from(set);
  }

  function hasShopItem(itemId, file) {
    const ids = shopRelatedItemIds(itemId);
    if (!ids.length) return false;
    if (ids.some((id) => FUNCTIONAL_ITEMS_NOW_FREE.has(id))) return true;
    const inv = shopInventoryFromFile(file || readFile());
    return ids.some((id) => !!(inv.owned && inv.owned[id]));
  }

  function hasShopItemAccess(itemId, file) {
    const ids = shopRelatedItemIds(itemId);
    if (!ids.length) return false;
    if (hasShopItem(itemId, file)) return true;
    const inv = shopInventoryFromFile(file || readFile());
    const active = Array.isArray(inv.activeTrials) ? inv.activeTrials : [];
    return active.some((row) => row && !row.muted && ids.includes(String(row.itemId || "")));
  }

  const shopPurchaseInFlight = new Map();

  async function buyShopItem(itemId, opts) {
    const id = clampText(itemId || "", 120).trim();
    const item = SHOP_CATALOG[id];
    if (!item) return { ok: false, error: "unknown_item", itemId: id };
    const file = readFile();
    if (!item.consumable && hasShopItem(id, file)) return { ok: true, alreadyOwned: true, item: Object.assign({}, item), inventory: shopInventoryFromFile(file), score: scoreStateToXp(bestScoreStateForFile(file, { allowCompute: false }) || emptyScoreState(), file) };
    const score = scoreStateToXp(bestScoreStateForFile(file, { allowCompute: false }) || emptyScoreState(), file);
    const balance = Number(score && (score.currencyBalance != null ? score.currencyBalance : score.eorbits) || 0);
    const pricing = shopItemEffectivePrice(id) || { base: Math.max(0, Number(item.price || 0) || 0), dynamic: Math.max(0, Number(item.price || 0) || 0), discountPercent: 0, multiplier: 1, final: Math.max(0, Number(item.price || 0) || 0) };
    // Charge the effective price: dynamic demand layer (floored at the original
    // price) with the daily discount applied on top.
    const price = Math.max(0, Number(pricing.final || 0) || 0);
    // Logged-in accounts use a server-side final check before the local purchase
    // event is committed.  Do this BEFORE rejecting on the local balance: another
    // device may have already earned currency and uploaded it, while this device
    // has not pulled that event yet.
    if (accountKey() && !(opts && opts.localOnly)) {
      const pendingKey = `${accountKey()}:${id}`;
      if (shopPurchaseInFlight.has(pendingKey)) return shopPurchaseInFlight.get(pendingKey);
      const pending = purchaseShopItemViaCloud(id, item, pricing, opts || {}).finally(() => {
        try { shopPurchaseInFlight.delete(pendingKey); } catch (_) {}
      });
      shopPurchaseInFlight.set(pendingKey, pending);
      try {
        const cloud = await pending;
        if (cloud && cloud.ok !== false) return cloud;
        if (cloud && (cloud.error === "insufficient_funds" || cloud.error === "already_owned" || cloud.alreadyOwned || cloud.serverChecked)) return cloud;
        return Object.assign({ ok: false, error: "cloud_purchase_failed", serverChecked: true, item: Object.assign({}, item), price, balance, score }, cloud || {});
      } catch (err) {
        return { ok: false, error: "cloud_purchase_failed", serverChecked: true, message: String(err && err.message || err || "Cloud purchase failed"), item: Object.assign({}, item), price, balance, score };
      }
    }

    if (balance + 1e-9 < price) {
      return { ok: false, error: "insufficient_funds", item: Object.assign({}, item), balance, price, missing: Math.max(0, price - balance), score };
    }

    const ts = now();
    const ev = recordEvent("shop_purchase", {
      metric: "shop_purchase",
      itemId: id,
      itemTitle: item.title,
      category: item.category,
      cost: price,
      price,
      amount: price,
      value: price,
      basePrice: pricing.base,
      dynamicPrice: pricing.dynamic,
      discountPercent: pricing.discountPercent,
      priceMultiplier: pricing.multiplier,
      currency: LEARNING_CURRENCY_NAME,
      giftable: !!item.giftable,
      source: opts && opts.source || "shop"
    }, {
      metric: "shop_purchase",
      id: item.consumable ? `shop_purchase:${accountKey() || getVisitorId()}:${id}:${ts}:${Math.random().toString(36).slice(2,8)}` : `shop_purchase:${accountKey() || getVisitorId()}:${id}`,
      ts,
      value: price,
      source: opts && opts.source || "shop"
    });
    let equipResult = null;
    if (!item.consumable && item.slot && !(opts && opts.noAutoEquip)) {
      try {
        equipResult = await equipShopItem(id, { source: opts && opts.source || "shop", slot: item.slot, autoEquipAfterPurchase: true });
      } catch (_) { equipResult = null; }
    }
    const fresh = scoreStateToXp(bestScoreStateForFile(readFile(), { allowCompute: false }) || emptyScoreState(), readFile());
    try {
      if (accountKey()) scheduleAutoSync(item.consumable ? "shop-activation" : "shop-purchase");
    } catch (_) {}
    return { ok: true, purchased: true, event: ev, item: Object.assign({}, item), inventory: shopInventoryFromFile(readFile()), score: fresh, autoEquipped: !!(equipResult && equipResult.ok !== false), equipResult };
  }

  function equipShopItem(itemId, opts) {
    const id = clampText(itemId || "", 120).trim();
    const item = SHOP_CATALOG[id];
    if (!item) return Promise.resolve({ ok: false, error: "unknown_item", itemId: id });
    if (item.consumable) return Promise.resolve({ ok: false, error: "not_equippable", item: Object.assign({}, item) });
    if (!hasShopItem(id)) return Promise.resolve({ ok: false, error: "not_owned", item: Object.assign({}, item) });
    const slot = normaliseShopSlot((opts && opts.slot) || item.slot || "cosmetic", id, item);
    try { endActiveShopTrialsForSlot(slot, id); } catch (_) {}
    const ts = now();
    const ev = recordEvent("shop_equip", {
      metric: "shop_equip",
      itemId: id,
      itemTitle: item.title,
      category: item.category,
      slot,
      currency: LEARNING_CURRENCY_NAME,
      source: opts && opts.source || "shop"
    }, {
      metric: "shop_equip",
      id: `shop_equip:${accountKey() || getVisitorId()}:${slot}:${id}`,
      ts,
      source: opts && opts.source || "shop"
    });
    const inv = shopInventoryFromFile(readFile());
    applyEquippedCosmetics(inv);
    try { window.dispatchEvent(new CustomEvent("mk-shop-inventory-change", { detail: { itemId: id, slot, source: opts && opts.source || "shop" } })); } catch (_) {}
    return Promise.resolve({ ok: true, equipped: true, event: ev, item: Object.assign({}, item), inventory: inv, score: scoreStateToXp(bestScoreStateForFile(readFile(), { allowCompute: false }) || emptyScoreState(), readFile()) });
  }

  function clearShopSlot(slot, opts) {
    const sl = clampText(slot || "cosmetic", 80).trim() || "cosmetic";
    const ts = now();
    const ev = recordEvent("shop_equip", {
      metric: "shop_equip",
      itemId: "default",
      itemTitle: "Default",
      slot: sl,
      clear: true,
      source: opts && opts.source || "shop"
    }, {
      metric: "shop_equip",
      id: `shop_equip:${accountKey() || getVisitorId()}:${sl}:default`,
      ts,
      source: opts && opts.source || "shop"
    });
    const inv = shopInventoryFromFile(readFile());
    applyEquippedCosmetics(inv);
    try { window.dispatchEvent(new CustomEvent("mk-shop-inventory-change", { detail: { itemId: "default", slot: sl, clear: true, source: opts && opts.source || "shop" } })); } catch (_) {}
    return Promise.resolve({ ok: true, cleared: true, event: ev, inventory: inv, score: scoreStateToXp(bestScoreStateForFile(readFile(), { allowCompute: false }) || emptyScoreState(), readFile()) });
  }

  function ensureShopCosmeticStylesOnce() {
    const STYLE_ID = "mk-shop-cosmetic-style-v2-ranking-static-pastels";
    if (document.getElementById(STYLE_ID)) return;
    try {
      const old = document.getElementById("mk-shop-cosmetic-style-v1");
      if (old && old.parentNode) old.parentNode.removeChild(old);
    } catch (_) {}
    const st = document.createElement("style");
    st.id = STYLE_ID;
    st.textContent = `
      html[data-mk-header-skin="header_skin_aurora"]{
        --mk-header-panel-bg:linear-gradient(135deg,#172554 0%,#155e75 46%,#0f766e 100%);
        --mk-header-panel-bg-glass:linear-gradient(135deg,rgba(23,37,84,.78) 0%,rgba(21,94,117,.72) 46%,rgba(15,118,110,.70) 100%);
        --mk-header-panel-border:rgba(103,232,249,.28);
        --mk-header-panel-shadow:0 18px 52px rgba(15,23,42,.36), inset 0 0 0 1px rgba(255,255,255,.045);
      }
      html[data-mk-header-skin="header_skin_sunset"]{
        --mk-header-panel-bg:linear-gradient(135deg,#7c2d12 0%,#be123c 54%,#d97706 100%);
        --mk-header-panel-bg-glass:linear-gradient(135deg,rgba(124,45,18,.78) 0%,rgba(190,18,60,.72) 54%,rgba(217,119,6,.70) 100%);
        --mk-header-panel-border:rgba(253,186,116,.34);
        --mk-header-panel-shadow:0 18px 52px rgba(69,26,3,.34), inset 0 0 0 1px rgba(255,255,255,.045);
      }
      html[data-mk-header-skin="header_skin_midnight"]{
        --mk-header-panel-bg:linear-gradient(135deg,#020617 0%,#111827 56%,#1e3a8a 100%);
        --mk-header-panel-bg-glass:linear-gradient(135deg,rgba(2,6,23,.84) 0%,rgba(17,24,39,.76) 56%,rgba(30,58,138,.72) 100%);
        --mk-header-panel-border:rgba(147,197,253,.25);
        --mk-header-panel-shadow:0 18px 52px rgba(2,6,23,.52), inset 0 0 0 1px rgba(255,255,255,.04);
      }
      html[data-mk-header-skin="header_skin_aurora"] .md-header,
      html[data-mk-header-skin="header_skin_aurora"] .md-tabs{ background:linear-gradient(90deg,#172554,#0f766e,#6d28d9) !important; }
      html[data-mk-header-skin="header_skin_sunset"] .md-header,
      html[data-mk-header-skin="header_skin_sunset"] .md-tabs{ background:linear-gradient(90deg,#7c2d12,#be123c,#f59e0b) !important; }
      html[data-mk-header-skin="header_skin_midnight"] .md-header,
      html[data-mk-header-skin="header_skin_midnight"] .md-tabs{ background:linear-gradient(90deg,#020617,#111827,#1e3a8a) !important; }
      html[data-mk-header-skin] .mk-random-tabs-menu,
      html[data-mk-header-skin] .mk-header-dropdown,
      html[data-mk-header-skin] .mk-rt-panel,
      html[data-mk-header-skin] #rf-year-course-popover-v4,
      html[data-mk-header-skin] [data-md-component="tabs"] .md-tabs__link + *{
        background:var(--mk-header-panel-bg) !important;
        border-color:var(--mk-header-panel-border) !important;
        color:rgba(255,255,255,.88) !important;
        box-shadow:var(--mk-header-panel-shadow) !important;
      }
      html[data-mk-header-skin] .mk-rt-panel a.mk-rt-panel-item,
      html[data-mk-header-skin] .mk-rt-panel button.mk-rt-panel-item,
      html[data-mk-header-skin] .mk-rt-panel .mk-rt-group summary,
      html[data-mk-header-skin] #rf-year-course-popover-v4 a{ color:rgba(255,255,255,.80) !important; }
      html[data-mk-header-skin] .mk-rt-panel a.mk-rt-panel-item:hover,
      html[data-mk-header-skin] .mk-rt-panel a.mk-rt-panel-item:focus-visible,
      html[data-mk-header-skin] .mk-rt-panel button.mk-rt-panel-item:hover,
      html[data-mk-header-skin] .mk-rt-panel button.mk-rt-panel-item:focus-visible,
      html[data-mk-header-skin] #rf-year-course-popover-v4 a:hover,
      html[data-mk-header-skin] #rf-year-course-popover-v4 a:focus{ color:#fff !important; background:rgba(255,255,255,.08) !important; }
      html[data-mk-header-skin] .mk-rt-panel .mk-rt-sep{ background:rgba(255,255,255,.20) !important; }
      .md-tab-dropdown-panel.md-random-dropdown-panel,
      #random-dropdown-panel.md-random-dropdown-panel,
      #year-dropdown-panel.md-random-dropdown-panel{
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-dropdown-skin="dropdown_glass"] .md-tab-dropdown-panel.md-random-dropdown-panel,
      html[data-mk-dropdown-skin="dropdown_glass"] #random-dropdown-panel.md-random-dropdown-panel,
      html[data-mk-dropdown-skin="dropdown_glass"] #year-dropdown-panel.md-random-dropdown-panel{
        backdrop-filter:blur(8px) saturate(1.04) !important;
        -webkit-backdrop-filter:blur(8px) saturate(1.04) !important;
        background:var(--mk-header-panel-bg-glass, color-mix(in srgb,var(--md-default-bg-color) 86%,transparent)) !important;
        border-color:color-mix(in srgb,var(--md-default-fg-color) 18%,transparent) !important;
      }

      /* v72: bundled interface themes.
         Each bundle is mode-specific: light bundles paint only default mode,
         dark bundles paint only slate mode. Page backgrounds are deliberately
         single-colour or one continuous linear gradient, with no radial layers,
         grids, or repeated texture. */
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"],
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"]{
        --mk-theme-header-fg:rgba(255,255,255,.96);
        --mk-theme-panel-fg:rgba(255,255,255,.88);
      }
      /* v80: gold interface themes requested from the shop.
         These two are intentionally exact-id themes instead of ui_theme_light_ /
         ui_theme_dark_ prefix themes, so they do not inherit the wider bundle
         rules that recolour text, side panels, comment cards, or other UI. */
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"]{
        /* Drive accent/primary off the gold palette so site-wide hover colours
           (sidebar links, content links, header dropdown items) match the theme
           instead of falling back to the default green/teal accent. */
        --md-primary-fg-color:#9f720e;
        --md-accent-fg-color:#8a5d00;
        --mk-theme-link-color:#8a5d00;
        --mk-theme-link-hover-color:#6f4b00;
        --mk-gold-theme-header-bg:linear-gradient(90deg,#6f4b00 0%,#9f720e 42%,#d2a22f 100%);
        --mk-gold-theme-dropdown-bg:linear-gradient(135deg,#7f5900 0%,#a87500 56%,#d6a322 100%);
        --mk-gold-theme-dropdown-border:rgba(255,236,179,.38);
        --mk-gold-theme-dropdown-shadow:0 18px 48px rgba(159,114,14,.18);
        --mk-gold-theme-page-bg:#fbf1de;
        --mk-theme-page-bg:var(--mk-gold-theme-page-bg);
        --mk-theme-sidebar-bg:#fbf1de;
        --mk-theme-sidebar-card-bg:rgba(255,247,232,.82);
        --mk-theme-sidebar-card-bg-hover:rgba(255,240,207,.95);
        --mk-theme-sidebar-border:rgba(159,114,14,.20);
        --mk-theme-comment-bg:rgba(255,247,232,.80);
        --mk-theme-comment-card-bg:rgba(255,250,240,.92);
        --mk-theme-comment-field-bg:rgba(255,252,245,.96);
        --mk-theme-comment-border:rgba(159,114,14,.18);
        --mk-theme-surface-shadow:0 14px 34px rgba(159,114,14,.09);
      }
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"]{
        --md-primary-fg-color:#7a5600;
        --md-accent-fg-color:#f1c653;
        --mk-theme-link-color:#f1c653;
        --mk-theme-link-hover-color:#ffe08a;
        --mk-gold-theme-header-bg:linear-gradient(90deg,#4a3200 0%,#7a5600 52%,#9f7300 100%);
        --mk-gold-theme-dropdown-bg:linear-gradient(135deg,#2a2112 0%,#5c4100 55%,#8b6508 100%);
        --mk-gold-theme-dropdown-border:rgba(255,212,92,.24);
        --mk-gold-theme-dropdown-shadow:0 18px 54px rgba(74,50,0,.34);
        --mk-gold-theme-page-bg:#1f180d;
        --mk-theme-page-bg:var(--mk-gold-theme-page-bg);
        --mk-theme-sidebar-bg:#1f180d;
        --mk-theme-sidebar-card-bg:rgba(42,33,18,.82);
        --mk-theme-sidebar-card-bg-hover:rgba(74,50,0,.78);
        --mk-theme-sidebar-border:rgba(255,212,92,.18);
        --mk-theme-comment-bg:rgba(31,24,13,.82);
        --mk-theme-comment-card-bg:rgba(42,33,18,.92);
        --mk-theme-comment-field-bg:rgba(26,20,10,.96);
        --mk-theme-comment-border:rgba(255,212,92,.16);
        --mk-theme-surface-shadow:0 18px 42px rgba(0,0,0,.40);
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-header,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-tabs,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-header,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-tabs{
        background:var(--mk-gold-theme-header-bg) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-random-tabs-menu,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-header-dropdown,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-rt-panel,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #rf-year-course-popover-v4,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] [data-md-component="tabs"] .md-tabs__link + *,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-tab-dropdown-panel.md-random-dropdown-panel,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #random-dropdown-panel.md-random-dropdown-panel,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #year-dropdown-panel.md-random-dropdown-panel,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-random-tabs-menu,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-header-dropdown,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-rt-panel,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #rf-year-course-popover-v4,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] [data-md-component="tabs"] .md-tabs__link + *,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-tab-dropdown-panel.md-random-dropdown-panel,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #random-dropdown-panel.md-random-dropdown-panel,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #year-dropdown-panel.md-random-dropdown-panel{
        background:var(--mk-gold-theme-dropdown-bg) !important;
        border-color:var(--mk-gold-theme-dropdown-border) !important;
        box-shadow:var(--mk-gold-theme-dropdown-shadow) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] body,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-container,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-main,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-main__inner,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] body,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-container,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-main,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-main__inner{
        background:var(--mk-gold-theme-page-bg) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar__scrollwrap,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar__inner,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-nav,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-nav__list,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-nav__title,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar__scrollwrap,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar__inner,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-nav,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-nav__list,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-nav__title{
        background:var(--mk-theme-sidebar-bg, var(--mk-gold-theme-page-bg)) !important;
        background-image:none !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-content,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-content__inner,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-content,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-content__inner{
        background:transparent !important;
      }

      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #current-course-bar,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-sidebar-sortdock,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-mobile-unified-sidebar-surface,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-mobile-unified-sidebar-surface .msb-unified-head,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-mobile-unified-sidebar-surface .md-nav,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-mobile-unified-sidebar-surface .md-nav__list,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-sidebar-drawer-ghost-floor,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #current-course-bar,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-sidebar-sortdock,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-mobile-unified-sidebar-surface,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-mobile-unified-sidebar-surface .msb-unified-head,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-mobile-unified-sidebar-surface .md-nav,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-mobile-unified-sidebar-surface .md-nav__list,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-sidebar-drawer-ghost-floor,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap{
        background:var(--mk-theme-sidebar-bg, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
        background-image:none !important;
      }

      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-header,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-tabs,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-header,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-tabs{
        color:var(--mk-theme-header-fg) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-header .md-header__title,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-header .md-header__button,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-header .md-icon,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-tabs__link,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-header .md-header__title,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-header .md-header__button,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-header .md-icon,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-tabs__link{
        color:var(--mk-theme-header-fg) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-random-tabs-menu,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-header-dropdown,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-rt-panel,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #rf-year-course-popover-v4,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] [data-md-component="tabs"] .md-tabs__link + *,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-random-tabs-menu,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-header-dropdown,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-rt-panel,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #rf-year-course-popover-v4,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] [data-md-component="tabs"] .md-tabs__link + *{
        background:var(--mk-theme-header-panel-bg, var(--mk-header-panel-bg, var(--md-primary-fg-color))) !important;
        border-color:var(--mk-theme-header-panel-border, rgba(255,255,255,.20)) !important;
        color:var(--mk-theme-panel-fg) !important;
        box-shadow:var(--mk-theme-header-panel-shadow, 0 18px 52px rgba(15,23,42,.24)) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-rt-panel a.mk-rt-panel-item,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-rt-panel button.mk-rt-panel-item,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-rt-panel .mk-rt-group summary,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #rf-year-course-popover-v4 a,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-rt-panel a.mk-rt-panel-item,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-rt-panel button.mk-rt-panel-item,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-rt-panel .mk-rt-group summary,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #rf-year-course-popover-v4 a{
        color:var(--mk-theme-panel-fg) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-rt-panel a.mk-rt-panel-item:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-rt-panel a.mk-rt-panel-item:focus-visible,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-rt-panel button.mk-rt-panel-item:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-rt-panel button.mk-rt-panel-item:focus-visible,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #rf-year-course-popover-v4 a:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #rf-year-course-popover-v4 a:focus,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-rt-panel a.mk-rt-panel-item:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-rt-panel a.mk-rt-panel-item:focus-visible,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-rt-panel button.mk-rt-panel-item:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-rt-panel button.mk-rt-panel-item:focus-visible,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #rf-year-course-popover-v4 a:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #rf-year-course-popover-v4 a:focus{
        color:#fff !important;
        background:rgba(255,255,255,.08) !important;
      }
      html[data-mk-interface-theme^="ui_theme_light_"] .md-typeset a:not(.md-button):not(.headerlink),
      html[data-mk-interface-theme^="ui_theme_dark_"] .md-typeset a:not(.md-button):not(.headerlink),
      html[data-mk-interface-theme="ui_theme_sunlit_gold"] .md-typeset a:not(.md-button):not(.headerlink),
      html[data-mk-interface-theme="ui_theme_lantern_gold"] .md-typeset a:not(.md-button):not(.headerlink),
      html[data-mk-interface-theme^="ui_theme_light_"] .mk-local-activity-body a:not(.mk-comment-small-btn):not(.mk-comment-primary-btn),
      html[data-mk-interface-theme^="ui_theme_dark_"] .mk-local-activity-body a:not(.mk-comment-small-btn):not(.mk-comment-primary-btn),
      html[data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-local-activity-body a:not(.mk-comment-small-btn):not(.mk-comment-primary-btn),
      html[data-mk-interface-theme="ui_theme_lantern_gold"] .mk-local-activity-body a:not(.mk-comment-small-btn):not(.mk-comment-primary-btn){
        color:var(--mk-theme-link-color, var(--md-accent-fg-color)) !important;
        text-decoration-color:color-mix(in srgb,var(--mk-theme-link-color, var(--md-accent-fg-color)) 58%,transparent) !important;
        text-underline-offset:.14em !important;
      }
      html[data-mk-interface-theme^="ui_theme_light_"] .md-typeset a:not(.md-button):not(.headerlink):hover,
      html[data-mk-interface-theme^="ui_theme_dark_"] .md-typeset a:not(.md-button):not(.headerlink):hover,
      html[data-mk-interface-theme="ui_theme_sunlit_gold"] .md-typeset a:not(.md-button):not(.headerlink):hover,
      html[data-mk-interface-theme="ui_theme_lantern_gold"] .md-typeset a:not(.md-button):not(.headerlink):hover,
      html[data-mk-interface-theme^="ui_theme_light_"] .mk-local-activity-body a:not(.mk-comment-small-btn):not(.mk-comment-primary-btn):hover,
      html[data-mk-interface-theme^="ui_theme_dark_"] .mk-local-activity-body a:not(.mk-comment-small-btn):not(.mk-comment-primary-btn):hover,
      html[data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-local-activity-body a:not(.mk-comment-small-btn):not(.mk-comment-primary-btn):hover,
      html[data-mk-interface-theme="ui_theme_lantern_gold"] .mk-local-activity-body a:not(.mk-comment-small-btn):not(.mk-comment-primary-btn):hover{
        color:var(--mk-theme-link-hover-color, var(--mk-theme-link-color, var(--md-accent-fg-color))) !important;
        text-decoration-thickness:.08em !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_light_sky"]{
        --md-primary-fg-color:#2f74c0;
        --md-accent-fg-color:#2563eb;
        --mk-theme-link-color:#1d5fb8;
        --mk-theme-link-hover-color:#164a91;
        --mk-theme-header-bg:#2f74c0;
        --mk-theme-header-panel-bg:#285f9d;
        --mk-theme-header-panel-border:rgba(219,234,254,.36);
        --mk-theme-header-panel-shadow:0 18px 48px rgba(37,99,235,.20);
        --mk-theme-page-bg:#f5f9ff;
        --mk-theme-sidebar-bg:#fafdff;
        --mk-theme-sidebar-card-bg:#ffffff;
        --mk-theme-sidebar-card-bg-hover:#e8f3ff;
        --mk-theme-sidebar-border:rgba(47,116,192,.18);
        --mk-theme-comment-bg:rgba(248,251,255,.78);
        --mk-theme-comment-card-bg:rgba(255,255,255,.90);
        --mk-theme-comment-field-bg:rgba(255,255,255,.96);
        --mk-theme-comment-border:rgba(47,116,192,.17);
        --mk-theme-surface-shadow:0 14px 34px rgba(37,99,235,.075);
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_light_sage"]{
        --md-primary-fg-color:#4f7f67;
        --md-accent-fg-color:#3f7f5f;
        --mk-theme-link-color:#357358;
        --mk-theme-link-hover-color:#285b45;
        --mk-theme-header-bg:#4f7f67;
        --mk-theme-header-panel-bg:#426c56;
        --mk-theme-header-panel-border:rgba(220,252,231,.34);
        --mk-theme-header-panel-shadow:0 18px 48px rgba(34,85,58,.18);
        --mk-theme-page-bg:#f5f8f2;
        --mk-theme-sidebar-bg:#f9fbf6;
        --mk-theme-sidebar-card-bg:#fffffa;
        --mk-theme-sidebar-card-bg-hover:#e7f3e7;
        --mk-theme-sidebar-border:rgba(79,127,103,.18);
        --mk-theme-comment-bg:rgba(248,251,245,.78);
        --mk-theme-comment-card-bg:rgba(255,255,250,.90);
        --mk-theme-comment-field-bg:rgba(255,255,252,.96);
        --mk-theme-comment-border:rgba(79,127,103,.17);
        --mk-theme-surface-shadow:0 14px 34px rgba(34,85,58,.075);
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_light_peach_grad"]{
        --md-primary-fg-color:#d97757;
        --md-accent-fg-color:#db6b45;
        --mk-theme-link-color:#b9563a;
        --mk-theme-link-hover-color:#8f3f2c;
        --mk-theme-header-bg:linear-gradient(90deg,#c65d55 0%,#d97757 52%,#e6a15f 100%);
        --mk-theme-header-panel-bg:linear-gradient(135deg,#b7524f 0%,#d97757 56%,#dc9854 100%);
        --mk-theme-header-panel-border:rgba(254,215,170,.38);
        --mk-theme-header-panel-shadow:0 18px 48px rgba(194,92,72,.18);
        --mk-theme-page-bg:#fff5ef;
        --mk-theme-sidebar-bg:#fff5ef;
        --mk-theme-sticky-floor:#fff5ef;
        --mk-theme-sidebar-card-bg:#fffffa;
        --mk-theme-sidebar-card-bg-hover:#ffedde;
        --mk-theme-sidebar-border:rgba(217,119,87,.19);
        --mk-theme-comment-bg:rgba(255,248,241,.78);
        --mk-theme-comment-card-bg:rgba(255,253,250,.90);
        --mk-theme-comment-field-bg:rgba(255,255,252,.96);
        --mk-theme-comment-border:rgba(217,119,87,.18);
        --mk-theme-surface-shadow:0 14px 34px rgba(194,92,72,.075);
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_light_lavender_grad"]{
        --md-primary-fg-color:#7b6fbd;
        --md-accent-fg-color:#7468c4;
        --mk-theme-link-color:#6857b5;
        --mk-theme-link-hover-color:#514397;
        --mk-theme-header-bg:linear-gradient(90deg,#6f63b8 0%,#8675c9 50%,#9f8ed6 100%);
        --mk-theme-header-panel-bg:linear-gradient(135deg,#655bad 0%,#8372c4 55%,#9583cf 100%);
        --mk-theme-header-panel-border:rgba(221,214,254,.40);
        --mk-theme-header-panel-shadow:0 18px 48px rgba(109,90,190,.18);
        --mk-theme-page-bg:#f8f5ff;
        --mk-theme-sidebar-bg:#f8f5ff;
        --mk-theme-sticky-floor:#f8f5ff;
        --mk-theme-sidebar-card-bg:#ffffff;
        --mk-theme-sidebar-card-bg-hover:#f1ebff;
        --mk-theme-sidebar-border:rgba(123,111,189,.19);
        --mk-theme-comment-bg:rgba(251,249,255,.78);
        --mk-theme-comment-card-bg:rgba(255,255,255,.90);
        --mk-theme-comment-field-bg:rgba(255,255,255,.96);
        --mk-theme-comment-border:rgba(123,111,189,.18);
        --mk-theme-surface-shadow:0 14px 34px rgba(109,90,190,.075);
      }
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_midnight"]{
        --md-primary-fg-color:#17213a;
        --md-accent-fg-color:#93c5fd;
        --mk-theme-link-color:#9ccfff;
        --mk-theme-link-hover-color:#c4e3ff;
        --mk-theme-header-bg:#17213a;
        --mk-theme-header-panel-bg:#111a2f;
        --mk-theme-header-panel-border:rgba(147,197,253,.20);
        --mk-theme-header-panel-shadow:0 18px 54px rgba(2,6,23,.46);
        --mk-theme-page-bg:#0b1020;
        --mk-theme-sidebar-bg:#0c1222;
        --mk-theme-sidebar-card-bg:#151f35;
        --mk-theme-sidebar-card-bg-hover:#1e2d4a;
        --mk-theme-sidebar-border:rgba(147,197,253,.18);
        --mk-theme-comment-bg:rgba(13,19,35,.80);
        --mk-theme-comment-card-bg:rgba(18,27,47,.92);
        --mk-theme-comment-field-bg:rgba(12,18,32,.96);
        --mk-theme-comment-border:rgba(147,197,253,.16);
        --mk-theme-surface-shadow:0 18px 42px rgba(2,6,23,.30);
      }
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_evergreen"]{
        --md-primary-fg-color:#14332e;
        --md-accent-fg-color:#6ee7b7;
        --mk-theme-link-color:#86efc6;
        --mk-theme-link-hover-color:#bbf7dc;
        --mk-theme-header-bg:#14332e;
        --mk-theme-header-panel-bg:#102a26;
        --mk-theme-header-panel-border:rgba(110,231,183,.18);
        --mk-theme-header-panel-shadow:0 18px 54px rgba(2,44,34,.40);
        --mk-theme-page-bg:#081612;
        --mk-theme-sidebar-bg:#081813;
        --mk-theme-sidebar-card-bg:#102b26;
        --mk-theme-sidebar-card-bg-hover:#183e36;
        --mk-theme-sidebar-border:rgba(110,231,183,.16);
        --mk-theme-comment-bg:rgba(8,23,19,.80);
        --mk-theme-comment-card-bg:rgba(14,37,32,.92);
        --mk-theme-comment-field-bg:rgba(7,20,17,.96);
        --mk-theme-comment-border:rgba(110,231,183,.15);
        --mk-theme-surface-shadow:0 18px 42px rgba(2,44,34,.27);
      }
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_aurora_grad"]{
        --md-primary-fg-color:#155e75;
        --md-accent-fg-color:#67e8f9;
        --mk-theme-link-color:#79efff;
        --mk-theme-link-hover-color:#b8f7ff;
        --mk-theme-header-bg:linear-gradient(90deg,#0f2743 0%,#155e75 48%,#0f766e 100%);
        --mk-theme-header-panel-bg:linear-gradient(135deg,#0b2138 0%,#144e63 50%,#115e59 100%);
        --mk-theme-header-panel-border:rgba(103,232,249,.22);
        --mk-theme-header-panel-shadow:0 18px 54px rgba(8,47,73,.42);
        --mk-theme-page-bg:linear-gradient(135deg,#06111f 0%,#081d2b 50%,#071a1c 100%);
        --mk-theme-sidebar-bg:#071822;
        --mk-theme-sidebar-card-bg:#0d303c;
        --mk-theme-sidebar-card-bg-hover:#124854;
        --mk-theme-sidebar-border:rgba(103,232,249,.16);
        --mk-theme-comment-bg:rgba(7,23,32,.80);
        --mk-theme-comment-card-bg:rgba(11,39,52,.92);
        --mk-theme-comment-field-bg:rgba(6,20,31,.96);
        --mk-theme-comment-border:rgba(103,232,249,.15);
        --mk-theme-surface-shadow:0 18px 42px rgba(8,47,73,.28);
      }
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_plum_grad"]{
        --md-primary-fg-color:#4c1d5f;
        --md-accent-fg-color:#d8b4fe;
        --mk-theme-link-color:#e1c4ff;
        --mk-theme-link-hover-color:#f0ddff;
        --mk-theme-header-bg:linear-gradient(90deg,#2e1a47 0%,#4c1d5f 52%,#5b275f 100%);
        --mk-theme-header-panel-bg:linear-gradient(135deg,#241333 0%,#412052 54%,#4e234d 100%);
        --mk-theme-header-panel-border:rgba(216,180,254,.22);
        --mk-theme-header-panel-shadow:0 18px 54px rgba(46,16,101,.38);
        --mk-theme-page-bg:linear-gradient(135deg,#10091b 0%,#171024 52%,#1a0f1d 100%);
        --mk-theme-sidebar-bg:#160d21;
        --mk-theme-sidebar-card-bg:#27193a;
        --mk-theme-sidebar-card-bg-hover:#39234e;
        --mk-theme-sidebar-border:rgba(216,180,254,.16);
        --mk-theme-comment-bg:rgba(22,13,32,.80);
        --mk-theme-comment-card-bg:rgba(35,23,52,.92);
        --mk-theme-comment-field-bg:rgba(18,10,28,.96);
        --mk-theme-comment-border:rgba(216,180,254,.15);
        --mk-theme-surface-shadow:0 18px 42px rgba(46,16,101,.28);
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-header,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-tabs,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-header,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-tabs{
        background:var(--mk-theme-header-bg, var(--md-primary-fg-color)) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] body,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-container,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-main,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-main__inner,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] body,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-container,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-main,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-main__inner{
        background:var(--mk-theme-page-bg, var(--md-default-bg-color)) !important;
        background-attachment:fixed !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-content,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-content__inner,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-content,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-content__inner{
        background:transparent !important;
      }

      /* v73: the interface theme also recolours the sidebar controls and comments.
         Keep the empty sidebar floor on the page theme background, while the actual
         buttons/groups remain clean card surfaces. */
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary{
        --msb-card-bg:var(--mk-theme-sidebar-card-bg, color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%));
        --msb-card-bg-hover:var(--mk-theme-sidebar-card-bg-hover, color-mix(in srgb, var(--md-default-bg-color) 90%, var(--md-accent-fg-color) 10%));
        --msb-card-border:var(--mk-theme-sidebar-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent));
        --msb-card-border-strong:color-mix(in srgb, var(--md-accent-fg-color) 28%, var(--mk-theme-sidebar-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent)));
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-sidebar__scrollwrap,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-sidebar__inner,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav__list,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #current-course-bar,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-sidebar-sortdock,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-mobile-unified-sidebar-surface,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-mobile-unified-sidebar-surface .msb-unified-head,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-mobile-unified-sidebar-surface .md-nav,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-mobile-unified-sidebar-surface .md-nav__list,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-sidebar-drawer-ghost-floor,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-sidebar__scrollwrap,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-sidebar__inner,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__list,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-sidebar-sortdock,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-mobile-unified-sidebar-surface,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-mobile-unified-sidebar-surface .msb-unified-head,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-mobile-unified-sidebar-surface .md-nav,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-mobile-unified-sidebar-surface .md-nav__list,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-sidebar-drawer-ghost-floor,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap{
        background:var(--mk-theme-sidebar-bg, var(--mk-active-page-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
        background-image:none !important;
        background-size:auto !important;
        background-position:0 0 !important;
        background-repeat:no-repeat !important;
        background-attachment:fixed !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #current-course-bar .ccb-course-trigger,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #current-course-bar .ccb-menu,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-sidebar-sortdock .msb-sortdock__btn,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #current-course-bar .ccb-course-trigger,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #current-course-bar .ccb-menu,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-sidebar-sortdock .msb-sortdock__btn,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-course-trigger,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-menu,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-sidebar-sortdock .msb-sortdock__btn,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #current-course-bar .ccb-course-trigger,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #current-course-bar .ccb-menu,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-sidebar-sortdock .msb-sortdock__btn,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]{
        background:var(--mk-theme-sidebar-card-bg, var(--msb-card-bg, var(--md-default-bg-color))) !important;
        border-color:var(--mk-theme-sidebar-border, var(--msb-card-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent))) !important;
        box-shadow:none !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #current-course-bar .ccb-course-trigger:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #current-course-bar .ccb-course-trigger:focus-visible,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #current-course-bar[data-course-menu-open="1"] .ccb-course-trigger,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #current-course-bar .ccb-menu-item:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #current-course-bar .ccb-menu-item:focus-visible,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-sidebar-sortdock .msb-sortdock__btn:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] #mk-sidebar-sortdock .msb-sortdock__btn:focus-visible,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #current-course-bar .ccb-course-trigger:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #current-course-bar .ccb-course-trigger:focus-visible,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #current-course-bar[data-course-menu-open="1"] .ccb-course-trigger,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #current-course-bar .ccb-menu-item:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #current-course-bar .ccb-menu-item:focus-visible,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-sidebar-sortdock .msb-sortdock__btn:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #mk-sidebar-sortdock .msb-sortdock__btn:focus-visible,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-course-trigger:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-course-trigger:focus-visible,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar[data-course-menu-open="1"] .ccb-course-trigger,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-menu-item:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-menu-item:focus-visible,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-sidebar-sortdock .msb-sortdock__btn:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-sidebar-sortdock .msb-sortdock__btn:focus-visible,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #current-course-bar .ccb-course-trigger:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #current-course-bar .ccb-course-trigger:focus-visible,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #current-course-bar[data-course-menu-open="1"] .ccb-course-trigger,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #current-course-bar .ccb-menu-item:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #current-course-bar .ccb-menu-item:focus-visible,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-sidebar-sortdock .msb-sortdock__btn:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #mk-sidebar-sortdock .msb-sortdock__btn:focus-visible{
        background:var(--mk-theme-sidebar-card-bg-hover, var(--msb-card-bg-hover, color-mix(in srgb, var(--md-default-bg-color) 90%, var(--md-accent-fg-color) 10%))) !important;
        border-color:var(--msb-card-border-strong, var(--mk-theme-sidebar-border, color-mix(in srgb, var(--md-accent-fg-color) 24%, transparent))) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-page-comments,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-page-comments{
        border-top-color:var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 13%, transparent)) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comment-form,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comment-card,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comments-root,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comment-form,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comment-card,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comments-root{
        background:var(--mk-theme-comment-card-bg, color-mix(in srgb, var(--md-default-bg-color) 96%, var(--md-primary-fg-color) 4%)) !important;
        border-color:var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 13%, transparent)) !important;
        box-shadow:var(--mk-theme-surface-shadow, none) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comment-form-profile,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comment-form input,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comment-form textarea,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comments-empty,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comments-loading,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comment-form-profile,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comment-form input,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comment-form textarea,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comments-empty,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comments-loading{
        background:var(--mk-theme-comment-field-bg, var(--md-default-bg-color)) !important;
        border-color:var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 13%, transparent)) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comment-primary-btn,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comment-small-btn,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .mk-comment-reaction,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comment-primary-btn,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comment-small-btn,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .mk-comment-reaction{
        background:var(--mk-theme-comment-bg, color-mix(in srgb, var(--md-default-fg-color) 5%, transparent)) !important;
        border-color:var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 16%, transparent)) !important;
      }
      /* v82: the gold themes are exact-id (not ui_theme_light_/dark_ prefixes), so
         the comment-area surfaces above skipped them and the comment box, profile
         chip and textarea stayed default white. Mirror those rules for gold. */
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-page-comments,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-page-comments{
        border-top-color:var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 13%, transparent)) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comment-form,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comment-card,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comments-root,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comment-form,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comment-card,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comments-root{
        background:var(--mk-theme-comment-card-bg, color-mix(in srgb, var(--md-default-bg-color) 96%, var(--md-primary-fg-color) 4%)) !important;
        border-color:var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 13%, transparent)) !important;
        box-shadow:var(--mk-theme-surface-shadow, none) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comment-form-profile,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comment-form input,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comment-form textarea,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comments-empty,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comments-loading,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comment-form-profile,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comment-form input,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comment-form textarea,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comments-empty,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comments-loading{
        background:var(--mk-theme-comment-field-bg, var(--md-default-bg-color)) !important;
        border-color:var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 13%, transparent)) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comment-primary-btn,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comment-small-btn,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .mk-comment-reaction,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comment-primary-btn,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comment-small-btn,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .mk-comment-reaction{
        background:var(--mk-theme-comment-bg, color-mix(in srgb, var(--md-default-fg-color) 5%, transparent)) !important;
        border-color:var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 16%, transparent)) !important;
      }

      /* v81: the Concept Finder hero and the course index cards follow the
         active interface theme.  Without this the Find page keeps its hard-coded
         blue gradient and the course index keeps a pure-white card, both of which
         clash with every shop interface theme.  The hero reuses the themed header
         panel gradient (gold themes expose it as --mk-gold-theme-dropdown-bg); the
         course cards reuse the themed sidebar-card surface. */
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .search-hero,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .search-hero,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .search-hero,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .search-hero{
        background:var(--mk-theme-header-panel-bg, var(--mk-gold-theme-dropdown-bg, var(--mk-theme-header-bg, var(--mk-gold-theme-header-bg, var(--md-primary-fg-color))))) !important;
        border-color:var(--mk-theme-header-panel-border, var(--mk-gold-theme-dropdown-border, rgba(255,255,255,.20))) !important;
        box-shadow:var(--mk-theme-header-panel-shadow, var(--mk-gold-theme-dropdown-shadow, none)) !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .course-block,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .course-nav__row,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .course-block,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .course-nav__row,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .course-block,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .course-nav__row,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .course-block,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .course-nav__row{
        background:var(--mk-theme-sidebar-card-bg, color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%)) !important;
        border-color:var(--mk-theme-sidebar-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent)) !important;
        box-shadow:var(--mk-theme-surface-shadow, none) !important;
      }

      /* v79: optional page pattern layer.
         Keep this as normal background painting, not a pseudo-element and not
         a z-index overlay.  The previous implementation used background-image
         with a colour fallback as the second layer; when the active page theme
         was a solid colour, that made the whole declaration invalid, so the
         pattern silently disappeared.  Use the background shorthand instead:
         the last layer can be either a colour or a gradient. */
      html[data-mk-page-pattern]{
        --mk-active-page-bg:var(--mk-theme-page-bg, var(--md-default-bg-color));
        --mk-pattern-line:rgba(69,82,104,.155);
        --mk-pattern-dot:rgba(69,82,104,.175);
        --mk-pattern-margin:rgba(239,104,104,.155);
        --mk-page-pattern-image:none;
        --mk-page-pattern-size:auto;
        --mk-page-pattern-position:0 0;
        --mk-page-pattern-repeat:repeat;
      }
      html[data-mk-color-scheme="slate"][data-mk-page-pattern]{
        --mk-pattern-line:rgba(226,232,240,.155);
        --mk-pattern-dot:rgba(226,232,240,.18);
        --mk-pattern-margin:rgba(248,113,113,.15);
      }
      html[data-mk-page-pattern="page_pattern_soft_grid"]{
        --mk-page-pattern-image:linear-gradient(var(--mk-pattern-line) 1px, transparent 1px), linear-gradient(90deg, var(--mk-pattern-line) 1px, transparent 1px);
        --mk-page-pattern-size:30px 30px,30px 30px;
        --mk-page-pattern-position:0 0,0 0;
        --mk-page-pattern-repeat:repeat,repeat;
      }
      html[data-mk-page-pattern="page_pattern_diagonal"]{
        --mk-page-pattern-image:repeating-linear-gradient(135deg, transparent 0 18px, var(--mk-pattern-line) 18px 19px, transparent 19px 36px);
        --mk-page-pattern-size:36px 36px;
        --mk-page-pattern-position:0 0;
        --mk-page-pattern-repeat:repeat;
      }
      html[data-mk-page-pattern="page_pattern_dots"]{
        --mk-page-pattern-image:radial-gradient(circle, var(--mk-pattern-dot) 0 1.05px, transparent 1.35px);
        --mk-page-pattern-size:22px 22px;
        --mk-page-pattern-position:0 0;
        --mk-page-pattern-repeat:repeat;
      }
      html[data-mk-page-pattern="page_pattern_notebook"]{
        --mk-page-pattern-image:linear-gradient(90deg, transparent 0 42px, var(--mk-pattern-margin) 42px 43px, transparent 43px), repeating-linear-gradient(0deg, transparent 0 27px, var(--mk-pattern-line) 27px 28px);
        --mk-page-pattern-size:100% 100%,100% 28px;
        --mk-page-pattern-position:0 0,0 0;
        --mk-page-pattern-repeat:no-repeat,repeat;
      }
      html[data-mk-page-pattern],
      html[data-mk-page-pattern] body{
        min-height:100vh !important;
        background:var(--mk-page-pattern-image), var(--mk-active-page-bg, var(--md-default-bg-color)) !important;
        background-size:var(--mk-page-pattern-size), auto !important;
        background-position:var(--mk-page-pattern-position), 0 0 !important;
        background-repeat:var(--mk-page-pattern-repeat), no-repeat !important;
        background-attachment:fixed,fixed !important;
      }
      html[data-mk-page-pattern] .md-container,
      html[data-mk-page-pattern] .md-main,
      html[data-mk-page-pattern] .md-main__inner,
      html[data-mk-page-pattern] .md-content,
      html[data-mk-page-pattern] .md-content__inner{
        background:transparent !important;
      }
      /* v80: when an interface theme is active, its page-background selector is
         more specific than the generic pattern selector.  Repeat the pattern
         rule at matching specificity so the theme supplies the colour layer and
         the pattern remains visible above it, without using z-index overlays. */
      html[data-mk-page-pattern][data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"],
      html[data-mk-page-pattern][data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] body,
      html[data-mk-page-pattern][data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"],
      html[data-mk-page-pattern][data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] body{
        background:var(--mk-page-pattern-image), var(--mk-active-page-bg, var(--md-default-bg-color)) !important;
        background-size:var(--mk-page-pattern-size), auto !important;
        background-position:var(--mk-page-pattern-position), 0 0 !important;
        background-repeat:var(--mk-page-pattern-repeat), no-repeat !important;
        background-attachment:fixed,fixed !important;
      }
      html[data-mk-page-pattern][data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-container,
      html[data-mk-page-pattern][data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-main,
      html[data-mk-page-pattern][data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-main__inner,
      html[data-mk-page-pattern][data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-content,
      html[data-mk-page-pattern][data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-content__inner,
      html[data-mk-page-pattern][data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-container,
      html[data-mk-page-pattern][data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-main,
      html[data-mk-page-pattern][data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-main__inner,
      html[data-mk-page-pattern][data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-content,
      html[data-mk-page-pattern][data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-content__inner{
        background:transparent !important;
      }
      html[data-mk-page-pattern] .md-sidebar--primary,
      html[data-mk-page-pattern] .md-sidebar--primary .md-sidebar__scrollwrap,
      html[data-mk-page-pattern] .md-sidebar--primary .md-sidebar__inner,
      html[data-mk-page-pattern] .md-sidebar--primary .md-nav,
      html[data-mk-page-pattern] .md-sidebar--primary .md-nav__list,
      html[data-mk-page-pattern] #current-course-bar,
      html[data-mk-page-pattern] #mk-sidebar-sortdock,
      html[data-mk-page-pattern] #mk-mobile-unified-sidebar-surface,
      html[data-mk-page-pattern] #mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,
      html[data-mk-page-pattern] #mk-mobile-unified-sidebar-surface .msb-unified-head,
      html[data-mk-page-pattern] #mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,
      html[data-mk-page-pattern] #mk-mobile-unified-sidebar-surface .md-nav,
      html[data-mk-page-pattern] #mk-mobile-unified-sidebar-surface .md-nav__list,
      html[data-mk-page-pattern] #mk-sidebar-drawer-ghost-floor,
      html[data-mk-page-pattern] #mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap{
        background:var(--mk-page-pattern-image), var(--mk-active-page-bg, var(--md-default-bg-color)) !important;
        background-size:var(--mk-page-pattern-size), auto !important;
        background-position:var(--mk-page-pattern-position), 0 0 !important;
        background-repeat:var(--mk-page-pattern-repeat), no-repeat !important;
        background-attachment:fixed, fixed !important;
      }
      html[data-mk-page-pattern] #current-course-bar .ccb-course-trigger,
      html[data-mk-page-pattern] #current-course-bar .ccb-menu,
      html[data-mk-page-pattern] #mk-sidebar-sortdock .msb-sortdock__btn,
      html[data-mk-page-pattern] .md-sidebar--primary .md-nav__item[data-msb-group-kind]{
        background:var(--mk-theme-sidebar-card-bg, color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-primary-fg-color) 6%)) !important;
      }
      html[data-mk-page-pattern] .md-header,
      html[data-mk-page-pattern] .md-tabs{
        z-index:20 !important;
      }
      html[data-mk-page-pattern] .mk-random-tabs-menu,
      html[data-mk-page-pattern] .mk-header-dropdown,
      html[data-mk-page-pattern] .mk-rt-panel,
      html[data-mk-page-pattern] #rf-year-course-popover-v4,
      html[data-mk-page-pattern] .md-tab-dropdown-panel,
      html[data-mk-page-pattern] #random-dropdown-panel,
      html[data-mk-page-pattern] #year-dropdown-panel{
        z-index:2147483000 !important;
      }


      /* v81: seamless interface-theme sidebars.
         Only the document root/body should paint the page background.  Every
         MkDocs layout wrapper and both sidebars stay transparent, so gradients
         do not restart inside sidebar boxes and no vertical/background seams are
         created.  Sidebar controls may still use their own small button surface,
         but the large sidebar floors and nav group containers blend into the
         page. */
      html[data-mk-interface-theme^="ui_theme_"]{
        --mk-seamless-page-bg:var(--mk-theme-page-bg, var(--mk-gold-theme-page-bg, var(--md-default-bg-color)));
      }
      html[data-mk-interface-theme^="ui_theme_"],
      html[data-mk-interface-theme^="ui_theme_"] body{
        min-height:100vh !important;
        background:var(--mk-seamless-page-bg) !important;
        background-attachment:fixed !important;
        background-repeat:no-repeat !important;
        background-size:cover !important;
      }
      html[data-mk-interface-theme^="ui_theme_"] .md-container,
      html[data-mk-interface-theme^="ui_theme_"] .md-main,
      html[data-mk-interface-theme^="ui_theme_"] .md-main__inner,
      html[data-mk-interface-theme^="ui_theme_"] .md-content,
      html[data-mk-interface-theme^="ui_theme_"] .md-content__inner,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar__scrollwrap,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar__inner,
      html[data-mk-interface-theme^="ui_theme_"] .md-nav,
      html[data-mk-interface-theme^="ui_theme_"] .md-nav__list,
      html[data-mk-interface-theme^="ui_theme_"] .md-nav__title,
      html[data-mk-interface-theme^="ui_theme_"] #current-course-bar,
      html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-sortdock,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .msb-unified-head,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .md-nav,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .md-nav__list,
      html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-drawer-ghost-floor,
      html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap{
        background:transparent !important;
        background-image:none !important;
        box-shadow:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary::before,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary::after,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary::before,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary::after,
      html[data-mk-interface-theme^="ui_theme_"] #current-course-bar::before,
      html[data-mk-interface-theme^="ui_theme_"] #current-course-bar::after,
      html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-sortdock::before,
      html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-sortdock::after,
      html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-drawer-ghost-floor::before,
      html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-drawer-ghost-floor::after{
        content:none !important;
        display:none !important;
        background:none !important;
        box-shadow:none !important;
      }
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within{
        background:transparent !important;
        background-image:none !important;
        border-color:transparent !important;
        box-shadow:none !important;
      }
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary .md-sidebar__scrollwrap,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary .md-sidebar__inner,
      html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback,
      html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback .md-sidebar__scrollwrap,
      html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback .md-sidebar__inner{
        border:0 !important;
        outline:0 !important;
        box-shadow:none !important;
      }



      /* v82: same seamless rules repeated at the mode-specific specificity used
         by the earlier theme rules.  This is required because all of these rules
         are !important; later order alone is not enough when the old selectors
         are more specific. */
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"],
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] body,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"],
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] body,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"],
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] body,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"],
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] body{
        min-height:100vh !important;
        background:var(--mk-theme-page-bg, var(--mk-gold-theme-page-bg, var(--md-default-bg-color))) !important;
        background-attachment:fixed !important;
        background-repeat:no-repeat !important;
        background-size:cover !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] :is(.md-container,.md-main,.md-main__inner,.md-content,.md-content__inner,.md-sidebar,.md-sidebar--primary,.md-sidebar--secondary,.md-sidebar__scrollwrap,.md-sidebar__inner,.md-nav,.md-nav__list,.md-nav__title,#current-course-bar,#mk-sidebar-sortdock,#mk-mobile-unified-sidebar-surface,#mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,#mk-mobile-unified-sidebar-surface .msb-unified-head,#mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,#mk-mobile-unified-sidebar-surface .md-nav,#mk-mobile-unified-sidebar-surface .md-nav__list,#mk-sidebar-drawer-ghost-floor,#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap),
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] :is(.md-container,.md-main,.md-main__inner,.md-content,.md-content__inner,.md-sidebar,.md-sidebar--primary,.md-sidebar--secondary,.md-sidebar__scrollwrap,.md-sidebar__inner,.md-nav,.md-nav__list,.md-nav__title,#current-course-bar,#mk-sidebar-sortdock,#mk-mobile-unified-sidebar-surface,#mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,#mk-mobile-unified-sidebar-surface .msb-unified-head,#mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,#mk-mobile-unified-sidebar-surface .md-nav,#mk-mobile-unified-sidebar-surface .md-nav__list,#mk-sidebar-drawer-ghost-floor,#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap),
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] :is(.md-container,.md-main,.md-main__inner,.md-content,.md-content__inner,.md-sidebar,.md-sidebar--primary,.md-sidebar--secondary,.md-sidebar__scrollwrap,.md-sidebar__inner,.md-nav,.md-nav__list,.md-nav__title,#current-course-bar,#mk-sidebar-sortdock,#mk-mobile-unified-sidebar-surface,#mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,#mk-mobile-unified-sidebar-surface .msb-unified-head,#mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,#mk-mobile-unified-sidebar-surface .md-nav,#mk-mobile-unified-sidebar-surface .md-nav__list,#mk-sidebar-drawer-ghost-floor,#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap),
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] :is(.md-container,.md-main,.md-main__inner,.md-content,.md-content__inner,.md-sidebar,.md-sidebar--primary,.md-sidebar--secondary,.md-sidebar__scrollwrap,.md-sidebar__inner,.md-nav,.md-nav__list,.md-nav__title,#current-course-bar,#mk-sidebar-sortdock,#mk-mobile-unified-sidebar-surface,#mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,#mk-mobile-unified-sidebar-surface .msb-unified-head,#mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,#mk-mobile-unified-sidebar-surface .md-nav,#mk-mobile-unified-sidebar-surface .md-nav__list,#mk-sidebar-drawer-ghost-floor,#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap){
        background:transparent !important;
        background-image:none !important;
        box-shadow:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within{
        background:transparent !important;
        background-image:none !important;
        border-color:transparent !important;
        box-shadow:none !important;
      }
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] :is(.md-sidebar--primary,.md-sidebar--secondary,#current-course-bar,#mk-sidebar-sortdock,#mk-sidebar-drawer-ghost-floor)::before,
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] :is(.md-sidebar--primary,.md-sidebar--secondary,#current-course-bar,#mk-sidebar-sortdock,#mk-sidebar-drawer-ghost-floor)::after,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] :is(.md-sidebar--primary,.md-sidebar--secondary,#current-course-bar,#mk-sidebar-sortdock,#mk-sidebar-drawer-ghost-floor)::before,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] :is(.md-sidebar--primary,.md-sidebar--secondary,#current-course-bar,#mk-sidebar-sortdock,#mk-sidebar-drawer-ghost-floor)::after,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] :is(.md-sidebar--primary,.md-sidebar--secondary,#current-course-bar,#mk-sidebar-sortdock,#mk-sidebar-drawer-ghost-floor)::before,
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] :is(.md-sidebar--primary,.md-sidebar--secondary,#current-course-bar,#mk-sidebar-sortdock,#mk-sidebar-drawer-ghost-floor)::after,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] :is(.md-sidebar--primary,.md-sidebar--secondary,#current-course-bar,#mk-sidebar-sortdock,#mk-sidebar-drawer-ghost-floor)::before,
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] :is(.md-sidebar--primary,.md-sidebar--secondary,#current-course-bar,#mk-sidebar-sortdock,#mk-sidebar-drawer-ghost-floor)::after{
        content:none !important;
        display:none !important;
        background:none !important;
        box-shadow:none !important;
      }


      /* v83: theme sidebar surface cleanup.
         The sticky course bar and Sort by dock must hide scrolling items, but
         they must not look like extra panels.  Paint them with the exact page
         background, keep only the real controls/cards as containers, and restore
         the top fade below Sort by.  Also neutralise a mode mismatch such as a
         light shop theme still selected while Material is switched to slate. */
      html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_light_"],
      html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_sunlit_gold"],
      html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_dark_"],
      html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_lantern_gold"]{
        --mk-theme-page-bg:var(--md-default-bg-color) !important;
        --mk-gold-theme-page-bg:var(--md-default-bg-color) !important;
        --mk-seamless-page-bg:var(--md-default-bg-color) !important;
        --mk-theme-sidebar-bg:var(--md-default-bg-color) !important;
        --mk-theme-sidebar-card-bg:color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%) !important;
        --mk-theme-sidebar-card-bg-hover:color-mix(in srgb, var(--md-default-bg-color) 90%, var(--md-accent-fg-color) 10%) !important;
        --mk-theme-sidebar-border:color-mix(in srgb, var(--md-default-fg-color) 12%, transparent) !important;
      }
      html.mk-sidebar-sort-ready[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary,
      html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary,
      html.mk-sidebar-sort-ready[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary,
      html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary,
      html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary,
      html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary,
      html.mk-sidebar-sort-ready[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary,
      html.mk-sidebar-sort-ready[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary{
        --msb-sidebar-page-bg:var(--mk-theme-page-bg, var(--md-default-bg-color)) !important;
        --msb-sidebar-page-background:var(--mk-theme-page-bg, var(--md-default-bg-color)) !important;
        --msb-sidebar-page-bg-size:cover !important;
        --msb-sidebar-page-bg-position:0 0 !important;
        --msb-sidebar-page-bg-repeat:no-repeat !important;
        --msb-sidebar-page-bg-attachment:fixed !important;
        --msb-sidebar-fade-h:1.24rem !important;
        --msb-card-bg:var(--mk-theme-sidebar-card-bg, color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%)) !important;
        --msb-card-bg-hover:var(--mk-theme-sidebar-card-bg-hover, color-mix(in srgb, var(--md-default-bg-color) 90%, var(--md-accent-fg-color) 10%)) !important;
        --msb-card-border:var(--mk-theme-sidebar-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent)) !important;
      }
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-sidebar__scrollwrap,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-sidebar__inner,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav__list,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary .md-sidebar__scrollwrap,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary .md-sidebar__inner{
        background:transparent !important;
        background-image:none !important;
        box-shadow:none !important;
        outline:0 !important;
      }
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #current-course-bar,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #mk-sidebar-sortdock,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #current-course-bar,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock{
        background:var(--msb-sidebar-page-background, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
        background-size:var(--msb-sidebar-page-bg-size, cover) !important;
        background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
        background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
        background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
        border:0 !important;
        outline:0 !important;
        box-shadow:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        overflow:visible !important;
      }
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #current-course-bar::before,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #current-course-bar::after,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #current-course-bar::before,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #current-course-bar::after{
        content:none !important;
        display:none !important;
        background:none !important;
        box-shadow:none !important;
      }
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #mk-sidebar-sortdock::before,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock::before{
        content:"" !important;
        display:block !important;
        position:absolute !important;
        left:0 !important;
        right:0 !important;
        top:calc(-1 * var(--msb-sortdock-gap-cover, 10px)) !important;
        height:var(--msb-sortdock-gap-cover, 10px) !important;
        background:var(--msb-sidebar-page-background, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
        background-size:var(--msb-sidebar-page-bg-size, cover) !important;
        background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
        background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
        background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
        pointer-events:none !important;
        z-index:0 !important;
        box-shadow:none !important;
      }
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #mk-sidebar-sortdock::after,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .msb-unified-head::after{
        content:"" !important;
        display:block !important;
        position:absolute !important;
        left:0 !important;
        right:0 !important;
        bottom:calc(-1 * var(--msb-sidebar-fade-h, 1.24rem)) !important;
        height:var(--msb-sidebar-fade-h, 1.24rem) !important;
        background:var(--msb-sidebar-page-background, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
        background-size:var(--msb-sidebar-page-bg-size, cover) !important;
        background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
        background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
        background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
        -webkit-mask-image:linear-gradient(to bottom, #000 0%, rgba(0,0,0,.72) 46%, transparent 100%) !important;
        mask-image:linear-gradient(to bottom, #000 0%, rgba(0,0,0,.72) 46%, transparent 100%) !important;
        pointer-events:none !important;
        z-index:2 !important;
        box-shadow:none !important;
      }
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #current-course-bar .ccb-course-trigger,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #current-course-bar .ccb-menu,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #mk-sidebar-sortdock .msb-sortdock__btn,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #current-course-bar .ccb-course-trigger,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #current-course-bar .ccb-menu,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock .msb-sortdock__btn{
        background:var(--msb-card-bg, var(--mk-theme-sidebar-card-bg, color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%))) !important;
        background-image:none !important;
        border-color:var(--msb-card-border, var(--mk-theme-sidebar-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent))) !important;
        box-shadow:none !important;
        outline:0 !important;
      }
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind],
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind]:hover,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind]:focus-within{
        background:var(--msb-card-bg, var(--mk-theme-sidebar-card-bg, color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%))) !important;
        background-image:none !important;
        border-color:var(--msb-card-border, var(--mk-theme-sidebar-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent))) !important;
        box-shadow:none !important;
      }
      html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #mk-sidebar-sortdock .msb-sortdock__box,
      html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock .msb-sortdock__box{
        background:transparent !important;
        background-image:none !important;
        border:0 !important;
        box-shadow:none !important;
      }

      html[data-mk-header-font="header_font_serif"]{ --mk-header-font-family:Georgia,'Times New Roman',serif; }
      html[data-mk-body-font="body_font_serif"]{ --mk-body-font-family:Georgia,'Times New Roman',serif; }
      html[data-mk-header-font="header_font_rounded"]{ --mk-header-font-family:'Arial Rounded MT Bold','Nunito','Trebuchet MS',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_rounded"]{ --mk-body-font-family:'Arial Rounded MT Bold','Nunito','Trebuchet MS',system-ui,sans-serif; }
      html[data-mk-header-font="header_font_geometric"]{ --mk-header-font-family:Avenir Next,Montserrat,Futura,'Century Gothic','Segoe UI',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_geometric"]{ --mk-body-font-family:Avenir Next,Montserrat,Futura,'Century Gothic','Segoe UI',system-ui,sans-serif; }
      html[data-mk-header-font="header_font_humanist"]{ --mk-header-font-family:Optima,Candara,'Segoe UI',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_humanist"]{ --mk-body-font-family:Optima,Candara,'Segoe UI',system-ui,sans-serif; }
      html[data-mk-header-font="header_font_editorial"]{ --mk-header-font-family:Baskerville,'Libre Baskerville','Times New Roman',Georgia,serif; }
      html[data-mk-body-font="body_font_editorial"]{ --mk-body-font-family:Baskerville,'Libre Baskerville','Times New Roman',Georgia,serif; }
      html[data-mk-header-font="header_font_slab"]{ --mk-header-font-family:Rockwell,'Roboto Slab','Courier New',Georgia,serif; }
      html[data-mk-body-font="body_font_slab"]{ --mk-body-font-family:Rockwell,'Roboto Slab','Courier New',Georgia,serif; }
      html[data-mk-header-font="header_font_condensed"]{ --mk-header-font-family:'Arial Narrow','Roboto Condensed','Segoe UI Condensed','Helvetica Neue',Arial,sans-serif; }
      html[data-mk-body-font="body_font_condensed"]{ --mk-body-font-family:'Arial Narrow','Roboto Condensed','Segoe UI Condensed','Helvetica Neue',Arial,sans-serif; }
      html[data-mk-header-font="header_font_mono"]{ --mk-header-font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace; }
      html[data-mk-body-font="body_font_mono"]{ --mk-body-font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace; }
      html[data-mk-header-font="header_font_elegant"]{ --mk-header-font-family:Palatino,'Palatino Linotype','Book Antiqua',Georgia,serif; }
      html[data-mk-body-font="body_font_elegant"]{ --mk-body-font-family:Palatino,'Palatino Linotype','Book Antiqua',Georgia,serif; }
      html[data-mk-header-font="header_font_playful"]{ --mk-header-font-family:'Trebuchet MS','Comic Sans MS','Segoe Print',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_playful"]{ --mk-body-font-family:'Trebuchet MS','Comic Sans MS','Segoe Print',system-ui,sans-serif; }
      html[data-mk-header-font^="header_font_"] :where(.md-header,.md-header *,.md-tabs,.md-tabs *,.mk-random-tabs-menu,.mk-random-tabs-menu *,.mk-header-dropdown,.mk-header-dropdown *,.mk-rt-menu,.mk-rt-menu *,.mk-rt-trigger,.mk-rt-trigger *,.mk-rt-panel,.mk-rt-panel *,#random-dropdown-panel,#random-dropdown-panel *,#year-dropdown-panel,#year-dropdown-panel *,#rf-year-course-popover-v4,#rf-year-course-popover-v4 *,article.md-content__inner h1,article.md-content__inner h1 *,article.md-content__inner h2,article.md-content__inner h2 *,.md-search,.md-search *,input.md-search__input){ font-family:var(--mk-header-font-family) !important; }
      html[data-mk-header-font^="header_font_"] .md-search__input::placeholder{ font-family:var(--mk-header-font-family) !important; }
      html[data-mk-body-font^="body_font_"] body :where(.md-main,.md-main *,.md-content,.md-content *,.md-sidebar,.md-sidebar *,#current-course-bar,#current-course-bar *,#mk-sidebar-sortdock,#mk-sidebar-sortdock *,#mk-mobile-unified-sidebar-surface,#mk-mobile-unified-sidebar-surface *,#comments,#comments *,.mk-page-comments,.mk-page-comments *,.mk-local-activity-modal,.mk-local-activity-modal *,.mk-account-panel,.mk-account-panel *):not(:where(.md-header,.md-header *,.md-tabs,.md-tabs *,h1,h1 *,h2,h2 *,h3,h3 *,h4,h4 *,h5,h5 *,h6,h6 *,code,code *,pre,pre *,kbd,kbd *,samp,samp *,.arithmatex,.arithmatex *,.MathJax,.MathJax *,.katex,.katex *,.katex-display,.katex-display *,mjx-container,mjx-container *,[class^="mjx-"],[class*=" mjx-"])){ font-family:var(--mk-body-font-family) !important; }
      html[data-mk-page-effect],
      html[data-mk-page-effect] body{ min-height:100%; background-attachment:fixed !important; }
      html[data-mk-page-effect] .md-main,
      html[data-mk-page-effect] .md-main__inner,
      html[data-mk-page-effect] .md-content,
      html[data-mk-page-effect] .md-content__inner{ background:transparent !important; }
      html[data-mk-page-effect] .md-sidebar,
      html[data-mk-page-effect] .md-sidebar__scrollwrap,
      html[data-mk-page-effect] .md-nav,
      html[data-mk-page-effect] .md-nav__title,
      html[data-mk-page-effect] .md-nav__list,
      html[data-mk-page-effect] .md-nav__item,
      html[data-mk-page-effect] .md-nav--primary,
      html[data-mk-page-effect] .md-nav--secondary,
      html[data-mk-page-effect] .md-sidebar .md-tabs,
      html[data-mk-page-effect] .lp-course-sidebar,
      html[data-mk-page-effect] .mk-course-sidebar,
      html[data-mk-page-effect] .mk-sidebar-card,
      html[data-mk-page-effect] .mk-course-filter,
      html[data-mk-page-effect] .mk-course-list-panel,
      html[data-mk-page-effect] .md-sidebar [class*="course"],
      html[data-mk-page-effect] .md-sidebar [class*="sidebar"]{ background:transparent !important; }
      html[data-mk-page-effect] .md-sidebar__scrollwrap,
      html[data-mk-page-effect] .md-sidebar .md-nav{ box-shadow:none !important; }
      html[data-mk-page-effect] article.md-content__inner{ position:relative; border-radius:22px; }
      /* v56: each page background is mode-specific.  Light effects do not
         paint dark mode, and dark effects do not paint light mode. */
      html:not([data-md-color-scheme="slate"])[data-mk-page-effect="page_bg_morning_mist"] body{
        background-image:radial-gradient(circle at 12% 10%,rgba(125,211,252,.10),transparent 32vw),radial-gradient(circle at 88% 18%,rgba(253,224,71,.06),transparent 30vw),repeating-linear-gradient(0deg,rgba(15,23,42,.014) 0 1px,transparent 1px 6px),linear-gradient(135deg,#fbfdff 0%,#f8fbff 100%) !important;
        background-size:auto,auto,8px 8px,auto !important;
      }
      html:not([data-md-color-scheme="slate"])[data-mk-page-effect="page_bg_warm_paper"] body{
        background-image:radial-gradient(circle at 18% 16%,rgba(251,191,36,.075),transparent 32vw),repeating-linear-gradient(90deg,rgba(120,113,108,.018) 0 1px,transparent 1px 7px),repeating-linear-gradient(0deg,rgba(120,113,108,.014) 0 1px,transparent 1px 9px),linear-gradient(135deg,#fffdf6,#fbfaf4) !important;
        background-size:auto,10px 10px,12px 12px,auto !important;
      }
      html:not([data-md-color-scheme="slate"])[data-mk-page-effect="page_bg_lavender_grid"] body{
        background-image:linear-gradient(rgba(79,70,229,.050) 1px,transparent 1px),linear-gradient(90deg,rgba(79,70,229,.050) 1px,transparent 1px),radial-gradient(circle at 86% 12%,rgba(216,180,254,.105),transparent 30vw),linear-gradient(135deg,#fdfcff,#fafaff) !important;
        background-size:28px 28px,28px 28px,auto,auto !important;
      }
      html[data-md-color-scheme="slate"][data-mk-page-effect="page_bg_deep_focus"] body{
        background-image:linear-gradient(rgba(56,189,248,.052) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.048) 1px,transparent 1px),radial-gradient(circle at 14% 12%,rgba(14,165,233,.12),transparent 34vw),radial-gradient(circle at 86% 18%,rgba(45,212,191,.08),transparent 32vw),linear-gradient(135deg,#020617,#0f172a) !important;
        background-size:34px 34px,34px 34px,auto,auto,auto !important;
      }
      html[data-md-color-scheme="slate"][data-mk-page-effect="page_bg_profile_aura"] body{
        background-image:radial-gradient(circle at 13% 18%,rgba(250,204,21,.20),transparent 2px),radial-gradient(circle at 82% 24%,rgba(147,197,253,.22),transparent 1.6px),radial-gradient(circle at 55% 72%,rgba(168,85,247,.13),transparent 2px),radial-gradient(circle at 20% 8%,rgba(59,130,246,.16),transparent 36vw),linear-gradient(135deg,#0a1020,#111827 62%,#10172a) !important;
        background-size:auto,auto,auto,auto,auto !important;
      }
      html[data-mk-comment-effect="comment_highlight_soft"] .mk-comment-card,
      html[data-mk-comment-effect="comment_highlight_soft"] .mk-comment-thread{ box-shadow:inset 3px 0 0 rgba(245,200,75,.45) !important; }
      html[data-mk-finder-effect="finder_token_spark"] #find-builder .fb-tokenwrap,
      html[data-mk-finder-effect="finder_token_spark"] #find-builder .fb-tokenbtn,
      html[data-mk-finder-effect="finder_token_spark"] #find-builder .fb-chip{ position:relative !important; overflow:visible !important; }
      html[data-mk-finder-effect="finder_token_spark"] #find-builder .fb-tokenbtn::after,
      html[data-mk-finder-effect="finder_token_spark"] #find-builder .fb-chip::after{
        content:"✦"; position:absolute; right:-5px; top:-9px; font-size:12px; line-height:1; color:#facc15; text-shadow:0 0 10px rgba(250,204,21,.65); opacity:.88; pointer-events:none; animation:mk-eorbit-token-sparkle 1.65s ease-in-out infinite;
      }
      html[data-mk-finder-effect="finder_token_spark"] #find-builder .fb-tokenbtn,
      html[data-mk-finder-effect="finder_token_spark"] #find-builder .fb-chip{ animation:mk-eorbit-token-pop 1.9s ease-in-out infinite; }
      html[data-mk-finder-effect="finder_result_pulse"] #search-results,
      html[data-mk-finder-effect="finder_result_pulse"] #search-results .csr-list,
      html[data-mk-finder-effect="finder_result_pulse"] #search-results .csr-cols,
      html[data-mk-finder-effect="finder_result_pulse"] .md-search-result__item,
      html[data-mk-finder-effect="finder_result_pulse"] .md-search-result__link{ animation:mk-eorbit-result-pulse 1.4s ease-out infinite; }
      @keyframes mk-eorbit-token-pop{ 0%,100%{ transform:scale(1); filter:brightness(1); } 50%{ transform:scale(1.018); filter:brightness(1.10); } }
      @keyframes mk-eorbit-token-sparkle{ 0%,100%{ opacity:.25; transform:translateY(2px) scale(.75) rotate(0deg); } 45%{ opacity:1; transform:translateY(-2px) scale(1.1) rotate(18deg); } }
      html[data-mk-search-box-effect] .md-search,
      html[data-mk-search-box-effect] .md-search__inner,
      html[data-mk-search-box-effect] .md-search__form{ position:relative !important; }
      html[data-mk-search-box-effect] .md-search__form{
        border-radius:24px !important;
        overflow:hidden !important;
        border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 42%,transparent) !important;
        box-shadow:0 0 0 1px rgba(255,255,255,.06),0 14px 42px rgba(15,23,42,.18) !important;
      }
      html[data-mk-search-box-effect] .md-search__form,
      html[data-mk-search-box-effect] .md-search__input,
      html[data-mk-search-box-effect] .md-search__icon{
        background-clip:padding-box !important;
      }
      html[data-mk-search-box-effect] .md-search__input{ font-weight:750 !important; letter-spacing:.01em !important; }
      html[data-mk-search-box-effect] .md-search__form::before{
        content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:0;
        background:linear-gradient(135deg,rgba(255,255,255,.20),transparent 48%,rgba(255,255,255,.10));
      }
      html[data-mk-search-box-effect] .md-search__icon,
      html[data-mk-search-box-effect] .md-search__input{ position:relative !important; z-index:1 !important; }
      html[data-mk-search-box-effect] .md-search[data-md-state="active"] .md-search__form,
      html[data-mk-search-box-effect] .md-search__inner .md-search__form{
        outline:2px solid color-mix(in srgb,var(--md-accent-fg-color) 38%,transparent) !important;
        outline-offset:2px !important;
      }
      html[data-mk-search-box-effect] .md-search__output,
      html[data-mk-search-box-effect] .md-search-result,
      html[data-mk-search-box-effect] .md-search__scrollwrap{
        border-radius:20px !important;
        overflow:hidden !important;
      }
      html[data-mk-search-box-effect] .md-search__output{
        margin-top:.42rem !important;
        border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 22%,transparent) !important;
        box-shadow:0 22px 70px rgba(15,23,42,.22) !important;
        backdrop-filter:blur(18px) saturate(1.12) !important;
        -webkit-backdrop-filter:blur(18px) saturate(1.12) !important;
      }
      html[data-mk-search-box-effect] .md-search-result__meta,
      html[data-mk-search-box-effect] .md-search-result__item,
      html[data-mk-search-box-effect] .md-search-result__link{ border-color:color-mix(in srgb,var(--md-default-fg-color) 9%,transparent) !important; }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__form{ box-shadow:0 0 0 2px rgba(234,179,8,.52),0 0 34px rgba(234,179,8,.36),0 14px 42px rgba(15,23,42,.20) !important; background-image:linear-gradient(135deg,rgba(254,243,199,.38),rgba(255,255,255,.08)),radial-gradient(circle at 92% 28%,rgba(250,204,21,.55),transparent 12px) !important; }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__form::after{ content:"✦  ✧  ✦"; position:absolute; right:12px; top:50%; transform:translateY(-50%); font-size:13px; letter-spacing:3px; color:#facc15; text-shadow:0 0 8px rgba(250,204,21,.75),0 0 18px rgba(250,204,21,.42); pointer-events:none; animation:mk-eorbit-search-sparkle 1.25s ease-in-out infinite; }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__output,
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__scrollwrap{ background:linear-gradient(135deg,color-mix(in srgb,var(--md-default-bg-color) 88%,#fef3c7 12%),color-mix(in srgb,var(--md-default-bg-color) 94%,#ffffff 6%)) !important; }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_sparkle"] .md-search__output,
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_sparkle"] .md-search__scrollwrap{ background:linear-gradient(135deg,rgba(17,24,39,.96),rgba(30,41,59,.96)) !important; }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__form{ box-shadow:0 0 0 2px rgba(244,114,182,.46),0 0 32px rgba(244,114,182,.30),0 14px 42px rgba(15,23,42,.20) !important; border-radius:28px !important; background-image:linear-gradient(135deg,rgba(253,242,248,.36),rgba(238,242,255,.18)),radial-gradient(circle at 90% 28%,rgba(244,114,182,.42),transparent 14px) !important; }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__form::after{ content:"🌸"; position:absolute; right:13px; top:50%; transform:translateY(-50%); font-size:18px; line-height:1; filter:drop-shadow(0 0 9px rgba(244,114,182,.42)); pointer-events:none; animation:mk-eorbit-blossom-sway 2.4s ease-in-out infinite; }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__form::before{ background:linear-gradient(135deg,rgba(255,255,255,.24),transparent 48%,rgba(244,114,182,.12)) !important; }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__output,
      html[data-mk-search-box-effect="header_search_flower"] .md-search__scrollwrap{ background:linear-gradient(135deg,color-mix(in srgb,var(--md-default-bg-color) 88%,#fdf2f8 12%),color-mix(in srgb,var(--md-default-bg-color) 92%,#eef2ff 8%)) !important; }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_flower"] .md-search__output,
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_flower"] .md-search__scrollwrap{ background:linear-gradient(135deg,rgba(30,41,59,.96),rgba(49,46,129,.90)) !important; }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__form{ border-radius:999px !important; border-color:rgba(251,146,60,.72) !important; box-shadow:0 0 0 2px rgba(251,146,60,.38),0 0 34px rgba(249,115,22,.28),0 12px 38px rgba(15,23,42,.18) !important; background-image:linear-gradient(135deg,rgba(251,146,60,.28),rgba(250,204,21,.18)),radial-gradient(circle at 91% 50%,rgba(251,191,36,.72),transparent 15px) !important; }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__form::after{ content:"★"; position:absolute; right:16px; top:50%; width:24px; height:24px; border-radius:50%; transform:translateY(-50%); display:grid; place-items:center; font-size:12px; color:#7c2d12; background:radial-gradient(circle,#facc15 0 48%,#f97316 51% 100%); box-shadow:0 0 0 2px rgba(124,45,18,.20),0 0 16px rgba(249,115,22,.55); pointer-events:none; animation:mk-eorbit-dragon-ball 2.8s ease-in-out infinite; }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__output,
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__scrollwrap{ background:linear-gradient(135deg,color-mix(in srgb,var(--md-default-bg-color) 82%,#ffedd5 18%),color-mix(in srgb,var(--md-default-bg-color) 90%,#fef3c7 10%)) !important; }
      @keyframes mk-eorbit-search-sparkle{ 0%,100%{ opacity:.40; transform:translateY(-50%) scale(.92); } 50%{ opacity:1; transform:translateY(-50%) scale(1.08); } }
      @keyframes mk-eorbit-blossom-sway{ 0%,100%{ transform:translateY(-50%) rotate(-8deg) scale(.96); } 50%{ transform:translateY(-58%) rotate(8deg) scale(1.08); } }
      @keyframes mk-eorbit-dragon-ball{ 0%,100%{ transform:translateY(-50%) rotate(-8deg) scale(.96); } 50%{ transform:translateY(-50%) rotate(12deg) scale(1.06); } }
      html[data-mk-dropdown-skin="dropdown_glass"] .md-tab-dropdown-panel.md-random-dropdown-panel,
      html[data-mk-dropdown-skin="dropdown_glass"] #random-dropdown-panel.md-random-dropdown-panel,
      html[data-mk-dropdown-skin="dropdown_glass"] #year-dropdown-panel.md-random-dropdown-panel,
      html[data-mk-dropdown-skin="dropdown_glass"] .mk-random-tabs-menu,
      html[data-mk-dropdown-skin="dropdown_glass"] .mk-header-dropdown,
      html[data-mk-dropdown-skin="dropdown_glass"] .mk-rt-panel,
      html[data-mk-dropdown-skin="dropdown_glass"] #rf-year-course-popover-v4{
        backdrop-filter:blur(5px) saturate(1.04) !important;
        -webkit-backdrop-filter:blur(5px) saturate(1.04) !important;
        background:var(--mk-header-panel-bg-glass-v58, color-mix(in srgb,var(--md-default-bg-color) 58%,transparent)) !important;
        border:1px solid rgba(255,255,255,.24) !important;
        box-shadow:0 18px 54px rgba(15,23,42,.20) !important;
        backface-visibility:hidden !important;
        isolation:isolate !important;
      }
      html[data-mk-dropdown-skin="dropdown_glass"] #rf-year-course-popover-v4.rf-year-course-popover-open-v4,
      html[data-mk-dropdown-skin="dropdown_glass"] .mk-rt-panel.mk-rt-open,
      html[data-mk-dropdown-skin="dropdown_glass"] #year-dropdown-panel.mk-rt-open,
      html[data-mk-dropdown-skin="dropdown_glass"] #random-dropdown-panel.mk-rt-open{
        opacity:1 !important;
        visibility:visible !important;
        pointer-events:auto !important;
        overflow:visible !important;
        z-index:2147483000 !important;
      }
      html[data-mk-dropdown-skin="dropdown_cute"] .md-tabs__item .md-tabs__link + *,
      html[data-mk-dropdown-skin="dropdown_cute"] .mk-random-tabs-menu,
      html[data-mk-dropdown-skin="dropdown_cute"] .mk-header-dropdown,
      html[data-mk-dropdown-skin="dropdown_cute"] .mk-rt-panel,
      html[data-mk-dropdown-skin="dropdown_cute"] #rf-year-course-popover-v4{
        border-radius:24px !important;
        overflow:hidden !important;
        border-width:1px !important;
        box-shadow:0 18px 50px rgba(15,23,42,.22) !important;
      }
      html[data-mk-dropdown-skin="dropdown_cute"] .mk-rt-panel a.mk-rt-panel-item,
      html[data-mk-dropdown-skin="dropdown_cute"] .mk-rt-panel button.mk-rt-panel-item,
      html[data-mk-dropdown-skin="dropdown_cute"] #rf-year-course-popover-v4 a{ border-radius:14px !important; margin:2px 6px !important; width:auto !important; }
      html[data-mk-profile-frame="profile_frame_glow"] .mk-public-profile-modal .mk-public-profile-preview,
      html[data-mk-profile-frame="profile_frame_glow"] .mk-public-profile-preview{ border-color:rgba(234,179,8,.58) !important; box-shadow:0 0 0 2px rgba(234,179,8,.34),0 0 34px rgba(234,179,8,.20), inset 0 0 24px rgba(234,179,8,.06) !important; }
      html[data-mk-profile-frame="profile_frame_neon"] .mk-public-profile-modal .mk-public-profile-preview,
      html[data-mk-profile-frame="profile_frame_neon"] .mk-public-profile-preview{ border-color:rgba(20,184,166,.68) !important; box-shadow:0 0 0 2px rgba(20,184,166,.42),0 0 30px rgba(124,58,237,.26), inset 0 0 24px rgba(20,184,166,.07) !important; }
      html[data-mk-profile-background="profile_bg_stars"] .mk-public-profile-modal .mk-local-activity-panel{ background:radial-gradient(circle at 13% 18%,rgba(250,204,21,.22),transparent 2px),radial-gradient(circle at 82% 24%,rgba(147,197,253,.22),transparent 1.6px),radial-gradient(circle at 55% 72%,rgba(168,85,247,.12),transparent 2px),linear-gradient(135deg,color-mix(in srgb,var(--md-default-bg-color) 86%,#0f172a 14%),color-mix(in srgb,var(--md-default-bg-color) 88%,#1d4ed8 12%),var(--md-default-bg-color) 76%) !important; }
      html[data-mk-profile-background="profile_bg_blush"] .mk-public-profile-modal .mk-local-activity-panel{ background:linear-gradient(135deg,color-mix(in srgb,var(--md-default-bg-color) 80%,#f472b6 20%),color-mix(in srgb,var(--md-default-bg-color) 88%,#fbbf24 12%),var(--md-default-bg-color) 76%) !important; }
      html[data-mk-profile-background="profile_bg_custom"] .mk-public-profile-modal .mk-local-activity-panel{ background:linear-gradient(135deg,color-mix(in srgb,var(--md-default-bg-color) 82%,#3b82f6 18%),color-mix(in srgb,var(--md-default-bg-color) 82%,#d946ef 18%),var(--md-default-bg-color) 76%) !important; }
      html[data-mk-profile-background] .mk-public-profile-modal .mk-local-activity-body{ background:transparent !important; }
      html[data-mk-profile-background] .mk-public-profile-modal .mk-public-profile-preview,
      html[data-mk-profile-background] .mk-public-profile-modal .mk-public-profile-section{ background:color-mix(in srgb,var(--md-default-bg-color) 74%,transparent) !important; backdrop-filter:blur(10px) saturate(1.05); -webkit-backdrop-filter:blur(10px) saturate(1.05); }
      html[data-mk-ranking-effect="ranking_row_gold"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_gold"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_gold"]{
        --mk-ranking-bg-strong:rgba(250,204,21,.16);
        --mk-ranking-bg-soft:rgba(254,240,138,.075);
        --mk-ranking-border:rgba(250,204,21,.30);
        --mk-ranking-line-1:#fef3c7;
        --mk-ranking-line-2:#f6c453;
        --mk-ranking-line-3:#fff7d6;
      }
      html[data-mk-ranking-effect="ranking_row_pastel_red"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_pastel_red"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_pastel_red"]{
        --mk-ranking-bg-strong:rgba(252,165,165,.18);
        --mk-ranking-bg-soft:rgba(254,202,202,.085);
        --mk-ranking-border:rgba(248,113,113,.28);
        --mk-ranking-line-1:#ffe4e6;
        --mk-ranking-line-2:#fca5a5;
        --mk-ranking-line-3:#fff1f2;
      }
      html[data-mk-ranking-effect="ranking_row_pastel_blue"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_pastel_blue"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_pastel_blue"]{
        --mk-ranking-bg-strong:rgba(147,197,253,.18);
        --mk-ranking-bg-soft:rgba(191,219,254,.085);
        --mk-ranking-border:rgba(96,165,250,.27);
        --mk-ranking-line-1:#dbeafe;
        --mk-ranking-line-2:#93c5fd;
        --mk-ranking-line-3:#eff6ff;
      }
      html[data-mk-ranking-effect="ranking_row_pastel_purple"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_pastel_purple"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_pastel_purple"]{
        --mk-ranking-bg-strong:rgba(196,181,253,.18);
        --mk-ranking-bg-soft:rgba(221,214,254,.085);
        --mk-ranking-border:rgba(167,139,250,.27);
        --mk-ranking-line-1:#ede9fe;
        --mk-ranking-line-2:#c4b5fd;
        --mk-ranking-line-3:#f5f3ff;
      }
      html[data-mk-ranking-effect="ranking_row_pastel_green"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_pastel_green"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_pastel_green"]{
        --mk-ranking-bg-strong:rgba(134,239,172,.18);
        --mk-ranking-bg-soft:rgba(187,247,208,.085);
        --mk-ranking-border:rgba(74,222,128,.25);
        --mk-ranking-line-1:#dcfce7;
        --mk-ranking-line-2:#86efac;
        --mk-ranking-line-3:#f0fdf4;
      }
      html[data-mk-ranking-effect="ranking_row_pastel_peach"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_pastel_peach"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]{
        --mk-ranking-bg-strong:rgba(253,186,116,.17);
        --mk-ranking-bg-soft:rgba(254,215,170,.085);
        --mk-ranking-border:rgba(251,146,60,.25);
        --mk-ranking-line-1:#ffedd5;
        --mk-ranking-line-2:#fdba74;
        --mk-ranking-line-3:#fff7ed;
      }
      html[data-mk-ranking-effect="ranking_row_gold"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_gold"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_gold"],
      html[data-mk-ranking-effect="ranking_row_pastel_red"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_pastel_red"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_pastel_red"],
      html[data-mk-ranking-effect="ranking_row_pastel_blue"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_pastel_blue"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_pastel_blue"],
      html[data-mk-ranking-effect="ranking_row_pastel_purple"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_pastel_purple"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_pastel_purple"],
      html[data-mk-ranking-effect="ranking_row_pastel_green"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_pastel_green"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_pastel_green"],
      html[data-mk-ranking-effect="ranking_row_pastel_peach"] .mk-trending-current-user,
      html[data-mk-ranking-effect="ranking_row_pastel_peach"] [data-current-user="true"],
      .trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]{
        position:relative !important;
        border-radius:16px !important;
        overflow:visible !important;
        background:linear-gradient(90deg,var(--mk-ranking-bg-strong),var(--mk-ranking-bg-soft) 44%,transparent 84%) !important;
        box-shadow:inset 0 0 0 1px var(--mk-ranking-border),0 10px 24px rgba(15,23,42,.075) !important;
      }
      html[data-mk-ranking-effect="ranking_row_gold"] .mk-trending-current-user::before,
      html[data-mk-ranking-effect="ranking_row_gold"] [data-current-user="true"]::before,
      .trending-user-item[data-ranking-effect="ranking_row_gold"]::before,
      html[data-mk-ranking-effect="ranking_row_pastel_red"] .mk-trending-current-user::before,
      html[data-mk-ranking-effect="ranking_row_pastel_red"] [data-current-user="true"]::before,
      .trending-user-item[data-ranking-effect="ranking_row_pastel_red"]::before,
      html[data-mk-ranking-effect="ranking_row_pastel_blue"] .mk-trending-current-user::before,
      html[data-mk-ranking-effect="ranking_row_pastel_blue"] [data-current-user="true"]::before,
      .trending-user-item[data-ranking-effect="ranking_row_pastel_blue"]::before,
      html[data-mk-ranking-effect="ranking_row_pastel_purple"] .mk-trending-current-user::before,
      html[data-mk-ranking-effect="ranking_row_pastel_purple"] [data-current-user="true"]::before,
      .trending-user-item[data-ranking-effect="ranking_row_pastel_purple"]::before,
      html[data-mk-ranking-effect="ranking_row_pastel_green"] .mk-trending-current-user::before,
      html[data-mk-ranking-effect="ranking_row_pastel_green"] [data-current-user="true"]::before,
      .trending-user-item[data-ranking-effect="ranking_row_pastel_green"]::before,
      html[data-mk-ranking-effect="ranking_row_pastel_peach"] .mk-trending-current-user::before,
      html[data-mk-ranking-effect="ranking_row_pastel_peach"] [data-current-user="true"]::before,
      .trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]::before{
        content:"";
        position:absolute;
        left:0;
        top:13%;
        bottom:13%;
        width:5px;
        border-radius:999px;
        background:linear-gradient(var(--mk-ranking-line-1),var(--mk-ranking-line-2),var(--mk-ranking-line-3));
        pointer-events:none;
      }
      html[data-mk-ranking-effect="ranking_row_gold"] .mk-trending-current-user::after,
      html[data-mk-ranking-effect="ranking_row_gold"] [data-current-user="true"]::after,
      .trending-user-item[data-ranking-effect="ranking_row_gold"]::after,
      html[data-mk-ranking-effect="ranking_row_pastel_red"] .mk-trending-current-user::after,
      html[data-mk-ranking-effect="ranking_row_pastel_red"] [data-current-user="true"]::after,
      .trending-user-item[data-ranking-effect="ranking_row_pastel_red"]::after,
      html[data-mk-ranking-effect="ranking_row_pastel_blue"] .mk-trending-current-user::after,
      html[data-mk-ranking-effect="ranking_row_pastel_blue"] [data-current-user="true"]::after,
      .trending-user-item[data-ranking-effect="ranking_row_pastel_blue"]::after,
      html[data-mk-ranking-effect="ranking_row_pastel_purple"] .mk-trending-current-user::after,
      html[data-mk-ranking-effect="ranking_row_pastel_purple"] [data-current-user="true"]::after,
      .trending-user-item[data-ranking-effect="ranking_row_pastel_purple"]::after,
      html[data-mk-ranking-effect="ranking_row_pastel_green"] .mk-trending-current-user::after,
      html[data-mk-ranking-effect="ranking_row_pastel_green"] [data-current-user="true"]::after,
      .trending-user-item[data-ranking-effect="ranking_row_pastel_green"]::after,
      html[data-mk-ranking-effect="ranking_row_pastel_peach"] .mk-trending-current-user::after,
      html[data-mk-ranking-effect="ranking_row_pastel_peach"] [data-current-user="true"]::after,
      .trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]::after{
        content:none !important;
        display:none !important;
      }
      .trending-user-item + .trending-user-item{ border-top:0 !important; }
      .trending-block[data-metric="users"] .trending-user-item{ align-items:center !important; }
      .trending-block[data-metric="users"] .trending-user-item .trending-rank{
        align-self:center !important;
        justify-self:center !important;
        transform:translate(4px, 2px) !important;
      }
      @keyframes mk-eorbit-result-pulse{ 0%,100%{ box-shadow:0 0 0 0 rgba(245,200,75,.12); } 50%{ box-shadow:0 0 0 9px rgba(245,200,75,.18); } }
      @keyframes mk-eorbit-ranking-pulse{ 0%,100%{ background:rgba(20,184,166,.025); box-shadow:inset 0 0 0 1px rgba(20,184,166,.08); } 50%{ background:rgba(20,184,166,.075); box-shadow:inset 0 0 0 1px rgba(20,184,166,.18),0 0 18px rgba(20,184,166,.12); } }
      @keyframes mk-eorbit-ranking-line-pulse{ 0%,100%{ opacity:.42; transform:scaleY(.86); } 50%{ opacity:1; transform:scaleY(1); } }
    `;
    document.head.appendChild(st);
  }


  function interfaceThemeMatchesCurrentScheme(itemId) {
    try {
      const id = clampText(itemId || "", 120).trim();
      if (!id) return false;
      const scheme = syncMaterialColorSchemeToRoot() || "default";
      const mode = interfaceThemeMode(id);
      if (mode === "light") return scheme === "default";
      if (mode === "dark") return scheme === "slate";
      return true;
    } catch (_) { return true; }
  }

  function activeInterfaceThemeItemIdForScheme(inv, scheme) {
    try {
      const inventory = inv || shopInventoryFromFile(readFile());
      const eq = inventory && inventory.equipped || {};
      const slot = scheme === "slate" ? "interface_theme_dark" : "interface_theme_light";
      const trialId = trialItemForSlot(slot);
      const itemId = trialId || eq[slot] || "";
      if (!itemId || !SHOP_CATALOG[itemId] || isRetiredVisualShopItem(itemId, SHOP_CATALOG[itemId])) return "";
      if (!interfaceThemeMatchesCurrentScheme(itemId)) return "";
      if (trialId) return itemId;
      if (inventory.owned && inventory.owned[itemId]) return itemId;
      return "";
    } catch (_) { return ""; }
  }

  function applyEquippedCosmetics(inventory) {
    try {
      const scheme = syncMaterialColorSchemeToRoot() || "default";
      ensureShopCosmeticStylesOnce();
      clearRetiredVisualShopAttributes();
      const inv = inventory || shopInventoryForCosmetics();
      const eq = inv && inv.equipped || {};
      const root = document.documentElement;

      const lightTheme = trialItemForSlot("interface_theme_light") || eq.interface_theme_light || "";
      const darkTheme = trialItemForSlot("interface_theme_dark") || eq.interface_theme_dark || "";
      if (lightTheme && SHOP_CATALOG[lightTheme] && !isRetiredVisualShopItem(lightTheme, SHOP_CATALOG[lightTheme])) root.setAttribute("data-mk-interface-theme-light", lightTheme);
      else root.removeAttribute("data-mk-interface-theme-light");
      if (darkTheme && SHOP_CATALOG[darkTheme] && !isRetiredVisualShopItem(darkTheme, SHOP_CATALOG[darkTheme])) root.setAttribute("data-mk-interface-theme-dark", darkTheme);
      else root.removeAttribute("data-mk-interface-theme-dark");

      const activeInterfaceTheme = activeInterfaceThemeItemIdForScheme(inv, scheme);
      if (activeInterfaceTheme) root.setAttribute("data-mk-interface-theme", activeInterfaceTheme);
      else root.removeAttribute("data-mk-interface-theme");

      const slots = { header_font:"data-mk-header-font", body_font:"data-mk-body-font", comment_effect:"data-mk-comment-effect", finder_effect:"data-mk-finder-effect", profile_frame:"data-mk-profile-frame", profile_background:"data-mk-profile-background", ranking_effect:"data-mk-ranking-effect", map_effect:"data-mk-map-effect", map_animation:"data-mk-map-animation", mastery_effect_mastered:"data-mk-mastery-effect-mastered", mastery_effect_clear:"data-mk-mastery-effect-clear" };
      Object.keys(slots).forEach((slot) => {
        const attr = slots[slot];
        const trialId = trialItemForSlot(slot);
        const itemId = trialId || eq[slot] || "";
        const valid = itemId
          && SHOP_CATALOG[itemId]
          && !isRetiredVisualShopItem(itemId, SHOP_CATALOG[itemId])
          && (trialId || (inv.owned && inv.owned[itemId]));
        if (valid) root.setAttribute(attr, itemId);
        else root.removeAttribute(attr);
      });
    } catch (_) {}
  }

  function currencyCostFromEvent(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const d = e.details && typeof e.details === "object" ? e.details : {};
    const metric = String(e.metric || d.metric || e.type || "").trim();
    const raw = d.cost != null ? d.cost : (d.price != null ? d.price : (d.amount != null ? d.amount : (e.value != null ? e.value : 0)));
    const amount = Math.max(0, Number(raw) || 0);
    if (!amount) return 0;
    if (/^(shop_purchase|shop_gift_sent|shop_spend|eorbits_spend)$/i.test(metric)) return amount;
    return 0;
  }
  function currencyCreditFromEvent(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const d = e.details && typeof e.details === "object" ? e.details : {};
    const metric = String(e.metric || d.metric || e.type || "").trim();
    const raw = d.credit != null ? d.credit : (d.refund != null ? d.refund : (d.amount != null ? d.amount : (e.value != null ? e.value : 0)));
    const amount = Math.max(0, Number(raw) || 0);
    if (!amount) return 0;
    if (/^(shop_refund|eorbits_credit|currency_adjustment|shop_gift_received)$/i.test(metric)) return amount;
    return 0;
  }
  function isShopCurrencyEvent(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const d = e.details && typeof e.details === "object" ? e.details : {};
    const metric = String(e.metric || d.metric || e.type || "").trim();
    return isAccountScoreBaselineEvent(ev) || /^(shop_purchase|shop_gift_sent|shop_spend|eorbits_spend|shop_refund|eorbits_credit|currency_adjustment|shop_gift_received)$/i.test(metric);
  }

  function readSyncedCloudScoreSnapshot() {
    try {
      const sc = JSON.parse(localStorage.getItem("mk_account_synced_cloud_fp_v1") || "null");
      if (!sc || typeof sc !== "object") return null;
      return {
        eventCount: Number(sc.eventCount || 0) || 0,
        totalScore: Number(sc.totalScore || 0) || 0,
        currencyBalance: Number(sc.currencyBalance || 0) || 0,
        at: Number(sc.at || 0) || 0
      };
    } catch (_) { return null; }
  }

  function rememberSyncedCloudScore(score, opts) {
    const s = score && typeof score === "object" ? score : null;
    if (!s) return;
    const options = opts && typeof opts === "object" ? opts : {};
    try {
      const prev = readSyncedCloudScoreSnapshot() || {};
      const rawScore = Number(s.totalScore != null ? s.totalScore : (s.totalXp != null ? s.totalXp : s.score));
      const rawCurrency = Number(s.currencyBalance != null ? s.currencyBalance : s.eorbits);
      const hasScore = Number.isFinite(rawScore) && rawScore >= 0;
      const hasCurrency = Number.isFinite(rawCurrency) && rawCurrency >= 0;
      localStorage.setItem("mk_account_synced_cloud_fp_v1", JSON.stringify({
        eventCount: Number.isFinite(Number(options.eventCount)) ? Math.max(0, Number(options.eventCount) || 0) : (Number(prev.eventCount || 0) || 0),
        totalScore: hasScore ? Math.max(rawScore, Number(prev.totalScore || 0) || 0) : (Number(prev.totalScore || 0) || 0),
        currencyBalance: hasCurrency
          ? (options.currencyAuthoritative ? rawCurrency : Math.max(rawCurrency, Number(prev.currencyBalance || 0) || 0))
          : (Number(prev.currencyBalance || 0) || 0),
        at: Date.now()
      }));
    } catch (_) {}
  }

  function xpFromFile(file) {
    const normalised = file ? normaliseFile(file) : readFile();
    const fullEvents = (normalised.eventLog || [])
      .filter((ev) => ev && typeof ev === "object")
      .sort((a,b) => Number(a.ts || 0) - Number(b.ts || 0));
    const nonBaselineEvents = fullEvents.filter((ev) => !isAccountScoreBaselineEvent(ev));
    const baselineEvents = fullEvents.filter((ev) => isAccountScoreBaselineEvent(ev) && accountScoreBaselineApplies(ev, nonBaselineEvents.length));
    // FLOOR, not additive sum (matches the Worker). Highest absolute preserved
    // total wins; legacy delta-only baselines contribute their largest SINGLE
    // delta, never a sum. The actual baselineScore/baselineCurrency contribution is
    // derived from the floored totals below.
    const baselineFloorScore = baselineEvents.reduce((mx, ev) => Math.max(mx, accountScoreBaselineCanonicalXp(ev)), 0);
    const baselineLegacyDeltaScore = baselineEvents.reduce((mx, ev) => accountScoreBaselineCanonicalXp(ev) ? mx : Math.max(mx, Math.max(0, accountScoreBaselineXp(ev))), 0);
    const baselineFloorCurrency = baselineEvents.reduce((mx, ev) => Math.max(mx, accountScoreBaselineCanonicalCurrency(ev)), 0);
    const baselineLegacyDeltaCurrency = baselineEvents.reduce((mx, ev) => accountScoreBaselineCanonicalCurrency(ev) ? mx : Math.max(mx, Math.max(0, accountScoreBaselineCurrency(ev))), 0);

    // Older / compacted account files can miss the explicit "Open the wiki"
    // event even when the user clearly had activity that day. Match the server
    // projection by deriving one active_day row per activity day before scoring.
    const explicitActiveDays = new Set();
    const firstActivityTsByDay = new Map();
    nonBaselineEvents.forEach((ev) => {
      const metric = String(ev && ev.metric || "").trim();
      const ts = Number(ev && (ev.ts || ev.createdAt) || 0) || Date.now();
      const day = dayKey(ts);
      if (!day) return;
      if (metric === "active_day") { explicitActiveDays.add(day); return; }
      if (!XP_RULES[metric] || isShopCurrencyEvent(ev)) return;
      const prev = firstActivityTsByDay.get(day);
      if (!prev || ts < prev) firstActivityTsByDay.set(day, ts);
    });
    const syntheticActiveDayEvents = [];
    firstActivityTsByDay.forEach((ts, day) => {
      if (explicitActiveDays.has(day)) return;
      const safeTs = Number(ts || 0) || Date.parse(`${day}T00:00:00Z`) || Date.now();
      const ev = normaliseEvent({
        id: `active_day:synthetic:${day}`,
        type: "wiki_open",
        metric: "active_day",
        count: 1,
        ts: safeTs,
        createdAt: safeTs,
        updatedAt: safeTs,
        title: "Wiki opened",
        details: { day, source: "derived_from_local_activity_events" }
      });
      if (ev) syntheticActiveDayEvents.push(ev);
    });
    const events = nonBaselineEvents.concat(syntheticActiveDayEvents).filter((ev) => XP_RULES[ev.metric]).sort((a, b) => Number(a.ts || 0) - Number(b.ts || 0));
    const daily = new Map();
    const breakdownMap = new Map();
    const scoredEvents = [];
    const globalSeenState = new Set();
    const globalRepeatSeen = new Set();
    const today = dayKey(Date.now());
    let cumulativeScore = 0;

    for (const ev of events) {
      const rule = XP_RULES[ev.metric];
      const day = dayKey(ev.ts);
      const boost = activeShopBoostsForEvents(fullEvents, Number(ev.ts || 0) || Date.now());
      const baseDailyCap = accountDailyXpCapForTotal(cumulativeScore);
      const effectiveDailyCap = baseDailyCap * Math.max(1, Number(boost.dailyCapMultiplier || 1) || 1);
      const row = daily.get(day) || { day, total: 0, count: 0, rawScore: 0, repeatAdjustedScore: 0, scoreBeforeDailyCap: 0, currencyEarned: 0, byMetric: {}, byMetricCurrency: {}, seen: new Map(), oneTime: new Set(), dailyCap: effectiveDailyCap, baseDailyCap, dailyCapApplied: false, xpMultiplier: 1, dailyCapMultiplier: 1 };
      row.baseDailyCap = Math.max(Number(row.baseDailyCap || 50), baseDailyCap);
      row.dailyCap = Math.max(Number(row.dailyCap || 50), effectiveDailyCap);
      row.xpMultiplier = Math.max(Number(row.xpMultiplier || 1), Number(boost.xpMultiplier || 1) || 1);
      row.dailyCapMultiplier = Math.max(Number(row.dailyCapMultiplier || 1), Number(boost.dailyCapMultiplier || 1) || 1);
      if (rule.oneTime && globalSeenState.has(ev.metric)) continue;
      const stateKey = stateKeyForXp(ev);
      const seenKey = `${ev.metric}::${stateKey}`;
      const forceRepeat = !!(ev.details && (ev.details.forceRepeat || ev.details.force_repeat || ev.details.repeatOnly || ev.details.repeat_only));
      const repeated = globalRepeatSeen.has(seenKey) || forceRepeat;
      row.seen.set(seenKey, true);
      if (rule.oneTime) globalSeenState.add(ev.metric);

      const units = Math.max(0, Number(ev.count || 1) || 1);
      if (!units) { daily.set(day, row); continue; }
      const baseXpRaw = Number(rule.xp || 0);
      const xpMultiplier = Math.max(1, Number(boost.xpMultiplier || 1) || 1);
      const baseXp = baseXpRaw * xpMultiplier;
      const repeatPercent = Number(rule.repeat || 1);
      let firstUnits = units;
      let repeatUnits = 0;
      if (repeatPercent < 0.999999) {
        if (repeated) {
          firstUnits = 0;
          repeatUnits = units;
        } else {
          firstUnits = Math.min(1, units);
          repeatUnits = Math.max(0, units - firstUnits);
        }
        globalRepeatSeen.add(seenKey);
      }
      const raw = baseXp * units;
      const adjusted = baseXp * firstUnits + baseXp * repeatPercent * repeatUnits;
      const currencyAdjusted = baseXpRaw * firstUnits + baseXpRaw * repeatPercent * repeatUnits;
      const currencyEarned = Math.max(0, currencyAdjusted);
      const repeatFactor = raw > 0 ? adjusted / raw : (repeated ? repeatPercent : 1);
      const repeatApplied = repeatUnits > 0 || (firstUnits <= 0 && units > 0 && repeatPercent < 0.999999);
      const metricBefore = Number(row.byMetric[ev.metric] || 0);
      const metricRuleCap = Number(rule.dailyCap || Infinity);
      const effectiveMetricCap = Number.isFinite(metricRuleCap) ? metricRuleCap * xpMultiplier : Infinity;
      const metricRoom = Math.max(0, effectiveMetricCap - metricBefore);
      const metricScore = Math.min(adjusted, metricRoom);
      const globalRoom = Math.max(0, Number(row.dailyCap || 50) - Number(row.total || 0));
      const score = Math.max(0, Math.min(metricScore, globalRoom));
      const metricCapApplied = metricScore + 1e-9 < adjusted;
      const dailyCapApplied = score + 1e-9 < metricScore;

      if (score <= 0 && adjusted <= 0 && currencyEarned <= 0) { daily.set(day, row); continue; }

      row.count += units;
      row.rawScore += raw;
      row.repeatAdjustedScore += adjusted;
      row.scoreBeforeDailyCap += metricScore;
      row.currencyEarned += currencyEarned;
      row.byMetric[ev.metric] = metricBefore + score;
      row.byMetricCurrency[ev.metric] = Number(row.byMetricCurrency[ev.metric] || 0) + currencyEarned;
      row.total += score;
      cumulativeScore += score;
      row.dailyCapApplied = !!(row.dailyCapApplied || dailyCapApplied || row.total >= Number(row.dailyCap || 50) - 0.000001);
      daily.set(day, row);

      const br = breakdownMap.get(ev.metric) || {
        metric: ev.metric,
        label: labelForMetric(ev.metric),
        category: rule.category || "Activity",
        count: 0,
        score: 0,
        rawScore: 0,
        repeatAdjustedScore: 0,
        scoreBeforeDailyCap: 0,
        currencyEarned: 0,
        currency: 0,
        xpPerCount: Number(rule.xp || 0),
        dailyCap: rule.dailyCap,
        globalDailyCap: Number(row.dailyCap || 50),
        xpMultiplier: xpMultiplier,
        dailyCapMultiplier: Number(boost.dailyCapMultiplier || 1) || 1,
        repeatPercent: Math.round(Number(rule.repeat || 1) * 100),
        repeatDiscountApplied: false,
        metricCapApplied: false,
        dailyCapApplied: false,
        updatedAt: 0,
        dailyDetails: []
      };
      br.count += units;
      br.rawScore += raw;
      br.repeatAdjustedScore += adjusted;
      br.scoreBeforeDailyCap += metricScore;
      br.currencyEarned += currencyEarned;
      br.currency += currencyEarned;
      br.score += score;
      br.repeatDiscountApplied = !!(br.repeatDiscountApplied || repeatApplied);
      br.metricCapApplied = !!(br.metricCapApplied || metricCapApplied);
      br.dailyCapApplied = !!(br.dailyCapApplied || dailyCapApplied);
      br.globalDailyCap = Math.max(Number(br.globalDailyCap || 50), Number(row.dailyCap || 50));
      br.xpMultiplier = Math.max(Number(br.xpMultiplier || 1), xpMultiplier);
      br.dailyCapMultiplier = Math.max(Number(br.dailyCapMultiplier || 1), Number(boost.dailyCapMultiplier || 1) || 1);
      br.updatedAt = Math.max(Number(br.updatedAt || 0), Number(ev.ts || 0));
      br.dailyDetails.push({
        day,
        count: round(units),
        rawScore: round(raw),
        repeatAdjustedScore: round(adjusted),
        scoreBeforeDailyCap: round(metricScore),
        score: round(score),
        currencyEarned: round(currencyEarned),
        currency: round(currencyEarned),
        repeatApplied: !!repeatApplied,
        repeatPercent: Math.round(repeatFactor * 100),
        metricCapApplied,
        dailyCapApplied,
        xpMultiplier: round(xpMultiplier),
        dailyCap: round(row.dailyCap || 50),
        dayFactor: metricScore > 0 ? round(score / metricScore) : 1,
        path: ev.path || "",
        title: ev.title || "",
        createdAt: ev.ts,
      });
      breakdownMap.set(ev.metric, br);

      if (score > 0 || currencyEarned > 0) {
        scoredEvents.push({ metric: ev.metric, label: labelForMetric(ev.metric), category: rule.category || "Activity", count: round(units), score: round(score), currencyEarned: round(currencyEarned), currency: round(currencyEarned), rawScore: round(raw), repeatAdjustedScore: round(adjusted), scoreBeforeDailyCap: round(metricScore), repeatApplied, metricCapApplied, dailyCapApplied, xpMultiplier: round(xpMultiplier), dailyCap: round(row.dailyCap || 50), path: ev.path, title: ev.title, createdAt: ev.ts, details: ev.details || {} });
      }
    }
    const activityTotalScore = round(Array.from(daily.values()).reduce((s, d) => s + Number(d.total || 0), 0));
    const activityCurrencyEarned = round(Array.from(daily.values()).reduce((s, d) => s + Number(d.currencyEarned || 0), 0));
    // EVENTS-ONLY (matches the Worker, which ignores baseline entirely). The old
    // "floor = max(activity, baselineCanonical)" RESURRECTED poisoned additive-era
    // absolutes baked into the cloud file's baseline events: a device whose file
    // carried a 1120-XP / 8000-EORbit canonical baseline inflated its panel far
    // above the events-only leaderboard, while a device without that baseline
    // showed the correct ~730. Pure events-only is deterministic given the same
    // events, so the panel == this device's leaderboard entry, always.
    // Apply the compact-cache baseline as an IDEMPOTENT FLOOR (max, never a sum).
    // On a storage-tight device the XP/EORbits-earning events are dropped from the
    // local cache and preserved as a single localOnly baseline carrying the canonical
    // totals. Without this, the panel recomputes a LOSSY events-only total right after
    // sync (e.g. 624 XP / 0 EORbits) while the cloud and boards correctly show 703/380.
    // `baselineEvents` is already gated by accountScoreBaselineApplies (the recovery
    // guard), so the floor is active ONLY while the baseline's source events are
    // genuinely absent: a full-ledger device gets pure events-only (panel == board),
    // and a compact device gets back the preserved canonical. max() not sum() => no
    // additive re-inflation across devices/merges.
    // The compact-cache baseline CURRENCY proved unreliable on a storage-tight device
    // (it bounced 0 / 800 / correct). The last-synced CLOUD value is the single source
    // of truth, so floor with it (max never reduces a correct local value; a full-ledger
    // device's events-only already equals it). XP keeps its baseline floor (stable 746).
    let syncedCloudScore = 0;
    let syncedCloudCurrency = 0;
    try {
      const sc = readSyncedCloudScoreSnapshot();
      if (sc) { syncedCloudScore = Number(sc.totalScore || 0) || 0; syncedCloudCurrency = Number(sc.currencyBalance || 0) || 0; }
    } catch (_) {}
    const totalScore = round(Math.max(activityTotalScore + baselineLegacyDeltaScore, baselineFloorScore, syncedCloudScore));
    const totalCurrencyEarned = round(activityCurrencyEarned);
    // Derived baseline contribution (for the breakdown row) so the local panel
    // matches the events-only/floor value the cloud and leaderboard show.
    const currencySpent = round(fullEvents.reduce((sum, ev) => sum + currencyCostFromEvent(ev), 0));
    const currencyCredited = round(fullEvents.reduce((sum, ev) => sum + currencyCreditFromEvent(ev), 0));
    const activityCurrencyBalance = Math.max(0, totalCurrencyEarned + currencyCredited - currencySpent);
    // Floor the BALANCE (not earned) with the compact-cache baseline's canonical
    // balance, idempotently. baselineFloorCurrency already holds the canonical
    // currencyBalance, so on a compact device the EORbits shown == the cloud/board
    // value instead of dropping to 0 when the earning events were compacted away.
    // EORbits = max(events-only balance, the authoritative synced-cloud balance). Do
    // NOT add the legacy/baseline currency deltas — those inflated it (e.g. 347 + 489
    // legacy delta = 836). The synced-cloud value is the single source of truth.
    const currencyBalance = round(Math.max(activityCurrencyBalance, syncedCloudCurrency));
    void baselineFloorCurrency; void baselineLegacyDeltaCurrency;
    const baselineScore = round(Math.max(0, totalScore - activityTotalScore));
    const baselineCurrency = round(Math.max(0, currencyBalance - activityCurrencyBalance));
    const progress = levelProgress(totalScore);
    const dailySummary = Array.from(daily.values()).map((d) => ({
      day: d.day,
      count: round(d.count),
      rawScore: round(d.rawScore),
      repeatAdjustedScore: round(d.repeatAdjustedScore),
      scoreBeforeDailyCap: round(d.scoreBeforeDailyCap),
      score: round(d.total),
      currencyEarned: round(d.currencyEarned),
      currency: round(d.currencyEarned),
      dailyCap: round(d.dailyCap || 50),
      baseDailyCap: round(d.baseDailyCap || accountDailyXpCapForTotal(0)),
      xpMultiplier: round(d.xpMultiplier || 1),
      dailyCapMultiplier: round(d.dailyCapMultiplier || 1),
      dailyCapApplied: !!d.dailyCapApplied,
      dailyCapReached: Number(d.total || 0) >= Number(d.dailyCap || 50) - 0.000001,
      metrics: Object.fromEntries(Object.entries(d.byMetric || {}).map(([k, v]) => [k, round(v)])),
      currencyMetrics: Object.fromEntries(Object.entries(d.byMetricCurrency || {}).map(([k, v]) => [k, round(v)]))
    })).sort((a,b) => String(b.day).localeCompare(String(a.day)));
    const activeNowBoost = activeShopBoostsForEvents(fullEvents, Date.now());
    const todayBaseCap = accountDailyXpCapForTotal(totalScore);
    const todayEffectiveCap = todayBaseCap * Math.max(1, Number(activeNowBoost.dailyCapMultiplier || 1) || 1);
    let todayXp = dailySummary.find((d) => d.day === today) || { day: today, count: 0, rawScore: 0, repeatAdjustedScore: 0, scoreBeforeDailyCap: 0, score: 0, currencyEarned: 0, currency: 0, dailyCap: todayEffectiveCap, baseDailyCap: todayBaseCap, xpMultiplier: activeNowBoost.xpMultiplier || 1, dailyCapMultiplier: activeNowBoost.dailyCapMultiplier || 1, metrics: {}, currencyMetrics: {} };
    todayXp = Object.assign({}, todayXp, {
      baseDailyCap: Math.max(Number(todayXp.baseDailyCap || 0) || 0, todayBaseCap),
      dailyCap: Math.max(Number(todayXp.dailyCap || 0) || 0, todayEffectiveCap),
      xpMultiplier: Math.max(Number(todayXp.xpMultiplier || 1) || 1, Number(activeNowBoost.xpMultiplier || 1) || 1),
      dailyCapMultiplier: Math.max(Number(todayXp.dailyCapMultiplier || 1) || 1, Number(activeNowBoost.dailyCapMultiplier || 1) || 1)
    });
    const todayIndex = dailySummary.findIndex((d) => d.day === today);
    if (todayIndex >= 0) dailySummary[todayIndex] = todayXp; else dailySummary.unshift(todayXp);
    if (baselineScore || baselineCurrency) {
      breakdownMap.set("account_score_baseline", {
        metric: "account_score_baseline",
        label: "Compact cache baseline",
        category: "Account",
        count: baselineEvents.length,
        score: round(baselineScore),
        rawScore: round(baselineScore),
        repeatAdjustedScore: round(baselineScore),
        scoreBeforeDailyCap: round(baselineScore),
        currencyEarned: round(baselineCurrency),
        currency: round(baselineCurrency),
        xpPerCount: 0,
        dailyCap: null,
        globalDailyCap: accountDailyXpCapForTotal(totalScore),
        repeatPercent: 100,
        repeatDiscountApplied: false,
        metricCapApplied: false,
        dailyCapApplied: false,
        updatedAt: baselineEvents.reduce((mx, ev) => Math.max(mx, Number(ev.updatedAt || ev.ts || 0) || 0), 0),
        dailyDetails: []
      });
    }
    return Object.assign({
      ok: true,
      source: "Local event-ledger XP",
      consistency: "XP and EORbits are recomputed from the local account event file. The cloud stores the same merged event file and never overwrites newer local events.",
      totalScore,
      totalXp: totalScore,
      score: totalScore,
      currencyName: LEARNING_CURRENCY_NAME,
      currencySingular: LEARNING_CURRENCY_SINGULAR,
      totalCurrencyEarned,
      currencyEarned: totalCurrencyEarned,
      currencyCredited,
      currencySpent,
      currencyBalance,
      eorbits: currencyBalance,
      shopInventory: shopInventoryFromFile(normalised),
      ownedShopItems: shopInventoryFromFile(normalised).ownedIds,
      dailySummary,
      todayDay: today,
      todayXp,
      breakdown: Array.from(breakdownMap.values()).map((r) => Object.assign({}, r, {
        score: round(r.score),
        rawScore: round(r.rawScore),
        repeatAdjustedScore: round(r.repeatAdjustedScore),
        scoreBeforeDailyCap: round(r.scoreBeforeDailyCap),
        currencyEarned: round(r.currencyEarned),
        currency: round(r.currency || r.currencyEarned),
      })).sort((a,b) => Number(b.score || 0) - Number(a.score || 0)),
      events: scoredEvents.slice(-500).reverse(),
      rules: xpRuleList(),
      dailyCap: Math.max(todayBaseCap, todayXp.dailyCap || 0, ...Array.from(daily.values()).map((d) => Number(d.dailyCap || 50) || 50)),
      baseDailyCap: todayBaseCap,
      activeBoosts: activeNowBoost,
      calculationVersion: "local-event-ledger-v4-eorbits-boosts",
      sourceRowCount: events.length,
      sourceEvents: true,
      isCompleteXp: true,
    }, progress);
  }

  function stateKeyForXp(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const d = e.details && typeof e.details === "object" ? e.details : {};
    const metric = String(e.metric || d.metric || "").trim();
    const path = normalisePath(e.path || d.path || d.conceptId || d.concept_id || "");
    const explicit = d.stateKey || d.actionStateKey || d.clientDedupeKey || d.resultId || d.result_id || d.commentId || d.comment_id || d.sessionId || d.session_id || d.notificationId || d.notification_id;
    if (explicit) return String(explicit).slice(0, 220);

    // The XP table promises repeat rewards.  Therefore the repeat key must be
    // the real learning object, not just the action name.  The old fallback used
    // ev.action before ev.path, so saving page A and page B as "favorite" were
    // treated as repeats of the same action.  That made several visible actions
    // look as if they gave no XP.
    if (metric === "saved_page_action") return `${String(e.action || d.action || "saved")}:${path || "global"}`.slice(0, 220);
    if (metric === "saved_page_visit" || metric === "view" || metric === "mastery" || metric === "ai_quiz") return (path || String(e.title || d.title || metric || "global")).slice(0, 220);
    if (metric === "map_open" || metric === "guided_study_start" || metric === "course_diagnostics_open" || metric === "prerequisite_readiness_open" || metric === "concept_finder_open" || metric === "random_browse_start" || metric === "panel_open") {
      return (path || String(d.panel || d.route || d.triggerKind || d.source || metric || "global")).slice(0, 220);
    }
    if (metric === "course_search") return String(d.query || d.querySample || d.search || d.course || path || "course-search").slice(0, 220);
    if (metric === "search_suggestion") return String(d.href || path || d.querySample || d.triggerText || "search-suggestion").slice(0, 220);
    if (metric === "sort_use") return String(d.controlKey || d.value || d.metric || d.period || d.triggerText || "sort-filter").slice(0, 220);
    if (metric === "reaction_given" || metric === "reaction_received" || metric === "mention_given" || metric === "mention_received" || metric === "comment" || metric === "reply" || metric === "comment_edit" || metric === "report" || metric === "bug_report") {
      return String(d.commentId || d.comment_id || d.reportId || d.report_id || e.id || path || metric || "community").slice(0, 220);
    }
    if (metric === "avatar_upload" || metric === "intro_update" || metric === "connection_request" || metric === "connection_added") return String(d.targetKey || d.targetName || d.requesterKey || d.avatarMode || metric || "account").slice(0, 220);
    return String(e.action || path || metric || "global").slice(0, 220);
  }
  function labelForMetric(metric) {
    const labels = {
      active_day: "Open the wiki", view: "Visit a concept page", saved_page_action: "Save or unsave a page", saved_page_visit: "Visit a saved page", mastery: "Update mastery", ai_quiz: "Complete an AI quiz", guided_study_start: "Start guided study", map_open: "Open map", prerequisite_readiness_open: "View prerequisite readiness", course_diagnostics_open: "View course diagnostics", course_search: "Use course search", concept_finder_open: "Open Concept Finder", random_browse_start: "Start random browsing", search_suggestion: "Use search suggestion", sort_use: "Use sorting/filtering", panel_open: "Open learning path panel", comment: "Leave a comment", reply: "Reply to a comment", reaction_given: "React to a comment", reaction_received: "Receive a reaction", mention_given: "Mention someone", mention_received: "Receive mention", comment_edit: "Edit comment", report: "Report content", bug_report: "Submit AI quiz bug report", account_tab_open: "Open account page", notification_read: "Read notification", avatar_upload: "Upload avatar", intro_update: "Update intro", privacy_update: "Update privacy", sync_device_connected: "Connect device", connection_request: "Invite connection", connection_added: "Add connection"
    };
    return labels[metric] || metric;
  }
  function descriptionForMetric(metric) {
    const descriptions = {
      active_day: "A day with at least one recorded learning activity.",
      view: "When a concept page is opened in any way.",
      saved_page_action: "When a page first enters Favourites, Study later, or Review later.",
      saved_page_visit: "When a previously saved page is opened.",
      mastery: "When a new or changed concept mastery state is saved.",
      ai_quiz: "When an AI quiz result is produced. Starting or opening a test does not count.",
      guided_study_start: "When a guided study path is started.",
      map_open: "When the concept map is opened from the Learning Path panel.",
      prerequisite_readiness_open: "When the prerequisite readiness panel is opened.",
      course_diagnostics_open: "When the course diagnostics panel is opened.",
      course_search: "When the course search tool is used.",
      concept_finder_open: "When Concept Finder is opened.",
      random_browse_start: "When random browsing is started.",
      search_suggestion: "When a search suggestion is used.",
      sort_use: "When a sorting or filtering control is used.",
      panel_open: "When a learning path or account panel is opened.",
      comment: "When a new comment is posted.",
      reply: "When a reply is posted.",
      reaction_given: "When a reaction is given to a comment.",
      reaction_received: "When another user reacts to your comment.",
      mention_given: "When another user is mentioned.",
      mention_received: "When you are mentioned by another user.",
      comment_edit: "When an existing comment is edited.",
      report: "When a comment or item is reported.",
      bug_report: "When an AI quiz issue is reported.",
      account_tab_open: "When the account page is opened.",
      notification_read: "When a notification is marked as read.",
      avatar_upload: "When an avatar image is uploaded.",
      intro_update: "When the profile intro is updated.",
      privacy_update: "When privacy settings are changed.",
      sync_device_connected: "When another device is connected to this account.",
      connection_request: "When a study connection request is sent.",
      connection_added: "When a study connection is accepted."
    };
    return descriptions[metric] || "Tracked by the account event ledger.";
  }
  function xpRuleList() {
    return Object.entries(XP_RULES).map(([metric, rule]) => ({
      metric,
      label: labelForMetric(metric),
      description: descriptionForMetric(metric),
      category: rule.category || "Activity",
      xpPerCount: Number(rule.xp || 0),
      weight: Number(rule.xp || 0),
      dailyCap: rule.dailyCap,
      repeatPercent: Math.round(Number(rule.repeat || 1) * 100),
      oneTime: !!rule.oneTime,
      globalDailyCap: accountDailyXpCapForTotal(0)
    }));
  }
  function round(n) { return Math.round(Number(n || 0) * 100) / 100; }
  function levelProgress(totalScore) {
    const thresholds = [0, 50, 140, 300, 600, 1100, 1900, 3200, 5200, 8000];
    let level = 1;
    for (let i = 0; i < thresholds.length; i += 1) if (totalScore >= thresholds[i]) level = i + 1;
    const maxLevel = thresholds.length;
    const levelStart = thresholds[level - 1] || 0;
    const nextLevel = level < maxLevel ? level + 1 : null;
    const nextLevelStart = nextLevel ? thresholds[nextLevel - 1] : null;
    const levelSpan = nextLevelStart == null ? 0 : Math.max(1, nextLevelStart - levelStart);
    const intoLevel = Math.max(0, totalScore - levelStart);
    const toNext = nextLevelStart == null ? 0 : Math.max(0, nextLevelStart - totalScore);
    const progressPct = nextLevelStart == null ? 100 : Math.max(0, Math.min(100, round((intoLevel / levelSpan) * 100)));
    const levelThresholds = thresholds.map((xp, i) => ({ level: i + 1, xp }));
    return { level, maxLevel, nextLevel, levelStart, nextLevelStart, intoLevel, levelSpan, toNext, progressPct, thresholds: levelThresholds, levelThresholds };
  }

  function accountDailyXpCapForTotal(totalScore) {
    const lvl = Math.max(1, Math.floor(Number(levelProgress(totalScore || 0).level) || 1));
    return 50 + (lvl - 1) * 5;
  }

  function accountDailyXpCapForScore(scoreObj) {
    return accountDailyXpCapForTotal(scoreObj && (scoreObj.totalScore != null ? scoreObj.totalScore : scoreObj.totalXp));
  }

  function cleanScoreStateMetricMap(obj) {
    const out = {};
    const src = obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
    Object.entries(src).slice(0, 120).forEach(([k, v]) => {
      const key = clampText(k, 80).trim();
      const n = Number(v || 0);
      if (key && Number.isFinite(n) && Math.abs(n) > 0.000001) out[key] = round(n);
    });
    return out;
  }

  function cleanScoreStateDailyBucket(row, day) {
    const src = row && typeof row === "object" && !Array.isArray(row) ? row : {};
    const d = String(src.day || day || "").slice(0, 10);
    return {
      day: d,
      count: round(src.count || 0),
      rawScore: round(src.rawScore || 0),
      repeatAdjustedScore: round(src.repeatAdjustedScore || 0),
      scoreBeforeDailyCap: round(src.scoreBeforeDailyCap || 0),
      score: round(src.score || src.total || 0),
      currencyEarned: round(src.currencyEarned || src.currency || 0),
      currency: round(src.currency || src.currencyEarned || 0),
      currencySpent: round(src.currencySpent || 0),
      currencyCredited: round(src.currencyCredited || 0),
      dailyCap: round(src.dailyCap || accountDailyXpCapForTotal(0)),
      baseDailyCap: round(src.baseDailyCap || accountDailyXpCapForTotal(0)),
      xpMultiplier: round(src.xpMultiplier || 1),
      dailyCapMultiplier: round(src.dailyCapMultiplier || 1),
      dailyCapApplied: !!src.dailyCapApplied,
      dailyCapReached: !!src.dailyCapReached,
      metrics: cleanScoreStateMetricMap(src.metrics || src.byMetric),
      currencyMetrics: cleanScoreStateMetricMap(src.currencyMetrics || src.byMetricCurrency)
    };
  }

  function scoreStateProgressFields(totalScore) {
    const p = levelProgress(totalScore || 0);
    return {
      level: p.level,
      maxLevel: p.maxLevel,
      nextLevel: p.nextLevel,
      levelStart: p.levelStart,
      nextLevelStart: p.nextLevelStart,
      intoLevel: round(p.intoLevel),
      levelSpan: p.levelSpan,
      toNext: round(p.toNext),
      progressPct: round(p.progressPct),
      thresholds: p.thresholds,
      levelThresholds: p.levelThresholds
    };
  }

  function normaliseScoreState(input, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
    const today = dayKey(options.now || Date.now());
    const totalScore = round(src.totalScore != null ? src.totalScore : (src.totalXp != null ? src.totalXp : src.score));
    const totalCurrencyEarned = round(src.totalCurrencyEarned != null ? src.totalCurrencyEarned : (src.currencyEarned != null ? src.currencyEarned : 0));
    const currencyCredited = round(src.currencyCredited || 0);
    const currencySpent = round(src.currencySpent || 0);
    const currencyBalance = round(src.currencyBalance != null ? src.currencyBalance : (src.eorbits != null ? src.eorbits : Math.max(0, totalCurrencyEarned + currencyCredited - currencySpent)));
    const rawDaily = Array.isArray(src.dailySummary) ? src.dailySummary : [];
    const dailyBuckets = {};
    if (src.dailyBuckets && typeof src.dailyBuckets === "object" && !Array.isArray(src.dailyBuckets)) {
      Object.entries(src.dailyBuckets).forEach(([d, row]) => {
        const day = String(d || row && row.day || "").slice(0, 10);
        if (day) dailyBuckets[day] = cleanScoreStateDailyBucket(row, day);
      });
    }
    rawDaily.forEach((row) => {
      const day = String(row && row.day || "").slice(0, 10);
      if (day && !dailyBuckets[day]) dailyBuckets[day] = cleanScoreStateDailyBucket(row, day);
    });
    if (src.today && typeof src.today === "object") {
      const td = String(src.today.day || src.today.date || today).slice(0, 10);
      dailyBuckets[td] = cleanScoreStateDailyBucket(Object.assign({}, dailyBuckets[td] || {}, src.today, { day: td }), td);
    }
    const days = Object.keys(dailyBuckets).sort().slice(-ACCOUNT_SCORE_STATE_MAX_DAYS);
    const keptDailyBuckets = {};
    days.forEach((d) => { keptDailyBuckets[d] = dailyBuckets[d]; });
    if (!keptDailyBuckets[today]) keptDailyBuckets[today] = cleanScoreStateDailyBucket({ day: today, dailyCap: accountDailyXpCapForTotal(totalScore) }, today);

    const appliedEventIds = {};
    const rawApplied = src.appliedEventIds && typeof src.appliedEventIds === "object" && !Array.isArray(src.appliedEventIds) ? src.appliedEventIds : {};
    Object.keys(rawApplied).sort().slice(-ACCOUNT_SCORE_STATE_MAX_APPLIED_DAYS).forEach((d) => {
      const bucket = rawApplied[d];
      const out = {};
      if (bucket && typeof bucket === "object") Object.keys(bucket).slice(-1200).forEach((id) => { if (id) out[String(id).slice(0, 220)] = 1; });
      if (Object.keys(out).length) appliedEventIds[String(d).slice(0, 10)] = out;
    });

    const seenKeys = {};
    const rawSeen = src.seenKeys && typeof src.seenKeys === "object" && !Array.isArray(src.seenKeys) ? src.seenKeys : {};
    Object.entries(rawSeen).slice(0, 80).forEach(([metric, map]) => {
      const m = clampText(metric, 80).trim();
      if (!m || !map || typeof map !== "object") return;
      const out = {};
      Object.keys(map).slice(-ACCOUNT_SCORE_STATE_MAX_SEEN_PER_METRIC).forEach((key) => { if (key) out[String(key).slice(0, 80)] = 1; });
      if (Object.keys(out).length) seenKeys[m] = out;
    });

    const breakdown = {};
    const rawBreakdown = src.breakdown && typeof src.breakdown === "object" && !Array.isArray(src.breakdown) ? src.breakdown : {};
    Object.entries(rawBreakdown).slice(0, 120).forEach(([metric, row]) => {
      const m = clampText(metric, 80).trim();
      const r = row && typeof row === "object" ? row : {};
      if (!m) return;
      breakdown[m] = {
        metric: m,
        label: r.label || labelForMetric(m),
        category: r.category || (XP_RULES[m] && XP_RULES[m].category) || "Activity",
        count: round(r.count || 0),
        score: round(r.score || 0),
        rawScore: round(r.rawScore || 0),
        repeatAdjustedScore: round(r.repeatAdjustedScore || 0),
        scoreBeforeDailyCap: round(r.scoreBeforeDailyCap || 0),
        currencyEarned: round(r.currencyEarned || r.currency || 0),
        currency: round(r.currency || r.currencyEarned || 0),
        xpPerCount: Number(r.xpPerCount != null ? r.xpPerCount : (XP_RULES[m] && XP_RULES[m].xp || 0)) || 0,
        dailyCap: r.dailyCap == null ? (XP_RULES[m] && XP_RULES[m].dailyCap) : r.dailyCap,
        globalDailyCap: round(r.globalDailyCap || accountDailyXpCapForTotal(totalScore)),
        repeatPercent: r.repeatPercent == null ? Math.round(Number(XP_RULES[m] && XP_RULES[m].repeat || 1) * 100) : r.repeatPercent,
        repeatDiscountApplied: !!r.repeatDiscountApplied,
        metricCapApplied: !!r.metricCapApplied,
        dailyCapApplied: !!r.dailyCapApplied,
        updatedAt: Number(r.updatedAt || 0) || 0,
        dailyDetails: Array.isArray(r.dailyDetails) ? r.dailyDetails.slice(-80) : []
      };
    });

    const progress = scoreStateProgressFields(totalScore);
    return Object.assign({
      schema: "mk-account-score-state",
      version: ACCOUNT_SCORE_STATE_VERSION,
      calculationVersion: src.calculationVersion || "score-state-v2-incremental",
      source: src.source || "account-score-state",
      accountKey: clampText(src.accountKey || accountKey(), 180),
      deviceId: src.deviceId || getDeviceId(),
      updatedAt: Number(src.updatedAt || Date.now()) || Date.now(),
      lastEventAt: Number(src.lastEventAt || 0) || 0,
      lastFullRebuildAt: Number(src.lastFullRebuildAt || 0) || 0,
      lastClosedDay: String(src.lastClosedDay || "").slice(0, 10),
      todayDay: today,
      totalScore,
      totalXp: totalScore,
      score: totalScore,
      totalRawScore: round(src.totalRawScore || totalScore),
      totalRepeatAdjustedScore: round(src.totalRepeatAdjustedScore || totalScore),
      totalBeforeDailyCap: round(src.totalBeforeDailyCap || totalScore),
      totalCurrencyEarned,
      currencyEarned: totalCurrencyEarned,
      currencyCredited,
      currencySpent,
      currencyBalance,
      eorbits: currencyBalance,
      dailyBuckets: keptDailyBuckets,
      appliedEventIds,
      seenKeys,
      breakdown,
      activeBoosts: cleanShopBoostRows(src.activeBoosts)
    }, progress);
  }

  function emptyScoreState(seed) {
    const today = dayKey(Date.now());
    return normaliseScoreState(Object.assign({
      accountKey: accountKey(),
      todayDay: today,
      dailyBuckets: { [today]: { day: today, dailyCap: accountDailyXpCapForTotal(0), baseDailyCap: accountDailyXpCapForTotal(0) } },
      updatedAt: Date.now(),
      source: "empty-score-state"
    }, seed || {}));
  }

  function scoreStateDailySummary(state) {
    const st = normaliseScoreState(state || {});
    return Object.values(st.dailyBuckets || {}).map((r) => cleanScoreStateDailyBucket(r, r.day)).sort((a, b) => String(b.day || "").localeCompare(String(a.day || "")));
  }

  function hydrateScoreStateBreakdownDailyDetails(st, row) {
    const r = Object.assign({}, row || {});
    const metric = String(r.metric || "").trim();
    if (!metric) return r;
    const details = Array.isArray(r.dailyDetails) ? r.dailyDetails.slice() : [];
    const seenDays = new Set(details.map((d) => String(d && d.day || "")).filter(Boolean));
    Object.values(st && st.dailyBuckets || {}).forEach((bucket) => {
      const clean = cleanScoreStateDailyBucket(bucket, bucket && bucket.day);
      const day = String(clean.day || "");
      if (!day || seenDays.has(day)) return;
      const score = Number(clean.metrics && clean.metrics[metric] || 0) || 0;
      const coins = Number(clean.currencyMetrics && clean.currencyMetrics[metric] || 0) || 0;
      if (!score && !coins) return;
      details.push({
        day,
        count: 0,
        rawScore: score,
        repeatAdjustedScore: score,
        scoreBeforeDailyCap: score,
        score,
        currencyEarned: coins,
        currency: coins,
        summaryRecovered: true
      });
      seenDays.add(day);
    });
    r.dailyDetails = details.sort((a, b) => String(a.day || "").localeCompare(String(b.day || ""))).slice(-120);
    return r;
  }

  function scoreStateBreakdownArray(state) {
    const st = normaliseScoreState(state || {});
    return Object.values(st.breakdown || {}).map((row) => {
      const r = hydrateScoreStateBreakdownDailyDetails(st, row);
      return Object.assign({}, r, {
        score: round(r.score),
        rawScore: round(r.rawScore),
        repeatAdjustedScore: round(r.repeatAdjustedScore),
        scoreBeforeDailyCap: round(r.scoreBeforeDailyCap),
        currencyEarned: round(r.currencyEarned || r.currency),
        currency: round(r.currency || r.currencyEarned)
      });
    }).sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
  }

  function scoreStateToXp(state, file) {
    const st = normaliseScoreState(state || {});
    const syncedCloud = readSyncedCloudScoreSnapshot();
    const displayTotalScore = round(Math.max(st.totalScore, Number(syncedCloud && syncedCloud.totalScore || 0) || 0));
    const displayCurrencyBalance = round(Math.max(st.currencyBalance, Number(syncedCloud && syncedCloud.currencyBalance || 0) || 0));
    const dailySummary = scoreStateDailySummary(st);
    const today = dayKey(Date.now());
    const activeBoost = activeScoreStateBoosts(st, Date.now());
    const baseTodayCap = accountDailyXpCapForTotal(displayTotalScore);
    const boostedTodayCap = baseTodayCap * Math.max(1, Number(activeBoost.dailyCapMultiplier || 1) || 1);
    let todayXp = dailySummary.find((d) => d.day === today) || cleanScoreStateDailyBucket({ day: today, dailyCap: boostedTodayCap, baseDailyCap: baseTodayCap, dailyCapMultiplier: activeBoost.dailyCapMultiplier || 1, xpMultiplier: activeBoost.xpMultiplier || 1 }, today);
    todayXp = Object.assign({}, todayXp, {
      baseDailyCap: Math.max(Number(todayXp.baseDailyCap || 0) || 0, baseTodayCap),
      dailyCap: Math.max(Number(todayXp.dailyCap || 0) || 0, boostedTodayCap),
      dailyCapMultiplier: Math.max(Number(todayXp.dailyCapMultiplier || 1) || 1, Number(activeBoost.dailyCapMultiplier || 1) || 1),
      xpMultiplier: Math.max(Number(todayXp.xpMultiplier || 1) || 1, Number(activeBoost.xpMultiplier || 1) || 1)
    });
    const idx = dailySummary.findIndex((d) => d.day === today);
    if (idx >= 0) dailySummary[idx] = todayXp; else dailySummary.unshift(todayXp);
    const progress = scoreStateProgressFields(displayTotalScore);
    return Object.assign({
      ok: true,
      source: "Local account score state",
      consistency: "XP and EORbits are read from the current account score state. Historical events are kept for sync and repair, but the Account UI does not rescan them.",
      totalScore: displayTotalScore,
      totalXp: displayTotalScore,
      score: displayTotalScore,
      currencyName: LEARNING_CURRENCY_NAME,
      currencySingular: LEARNING_CURRENCY_SINGULAR,
      totalCurrencyEarned: st.totalCurrencyEarned,
      currencyEarned: st.totalCurrencyEarned,
      currencyCredited: st.currencyCredited,
      currencySpent: st.currencySpent,
      currencyBalance: displayCurrencyBalance,
      eorbits: displayCurrencyBalance,
      dailySummary,
      todayDay: today,
      todayXp,
      breakdown: scoreStateBreakdownArray(st),
      events: [],
      rules: xpRuleList(),
      dailyCap: Math.max(baseTodayCap, todayXp.dailyCap || 0),
      baseDailyCap: baseTodayCap,
      activeBoosts: activeBoost,
      calculationVersion: st.calculationVersion || "score-state-v2-incremental",
      sourceRowCount: 0,
      sourceEvents: true,
      isCompleteXp: true,
      scoreState: true,
      cachedAt: Number(st.updatedAt || Date.now()) || Date.now(),
      lastSyncedAt: Number(st.lastFullRebuildAt || st.updatedAt || Date.now()) || Date.now(),
      accountKey: st.accountKey || accountKey()
    }, progress);
  }

  function scoreStateFromXp(xp, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const src = xp && typeof xp === "object" ? xp : {};
    const dailyBuckets = {};
    (Array.isArray(src.dailySummary) ? src.dailySummary : []).forEach((row) => {
      const day = String(row && row.day || "").slice(0, 10);
      if (day) dailyBuckets[day] = cleanScoreStateDailyBucket(row, day);
    });
    if (src.todayXp && typeof src.todayXp === "object") {
      const d = String(src.todayXp.day || src.todayDay || dayKey(Date.now())).slice(0, 10);
      dailyBuckets[d] = cleanScoreStateDailyBucket(Object.assign({}, dailyBuckets[d] || {}, src.todayXp, { day: d }), d);
    }
    const breakdown = {};
    (Array.isArray(src.breakdown) ? src.breakdown : []).forEach((row) => {
      const metric = clampText(row && row.metric || "", 80).trim();
      if (metric) breakdown[metric] = row;
    });
    return normaliseScoreState({
      source: options.source || src.source || "xp-score-state-snapshot",
      accountKey: src.accountKey || accountKey(),
      totalScore: src.totalScore != null ? src.totalScore : (src.totalXp != null ? src.totalXp : src.score),
      totalXp: src.totalXp != null ? src.totalXp : src.totalScore,
      totalRawScore: src.totalRawScore,
      totalRepeatAdjustedScore: src.totalRepeatAdjustedScore,
      totalBeforeDailyCap: src.totalBeforeDailyCap != null ? src.totalBeforeDailyCap : src.scoreBeforeDailyCap,
      totalCurrencyEarned: src.totalCurrencyEarned != null ? src.totalCurrencyEarned : src.currencyEarned,
      currencyEarned: src.currencyEarned,
      currencyCredited: src.currencyCredited,
      currencySpent: src.currencySpent,
      currencyBalance: src.currencyBalance != null ? src.currencyBalance : src.eorbits,
      eorbits: src.eorbits,
      dailyBuckets,
      breakdown,
      updatedAt: Number(options.updatedAt || src.updatedAt || src.cachedAt || Date.now()) || Date.now(),
      lastFullRebuildAt: Number(options.lastFullRebuildAt || src.lastFullRebuildAt || src.cachedAt || 0) || 0,
      calculationVersion: options.calculationVersion || src.calculationVersion || "score-state-from-xp"
    });
  }

  function addScoreStateSeenKey(state, metric, key) {
    const m = clampText(metric, 80).trim();
    if (!m || !key) return;
    if (!state.seenKeys || typeof state.seenKeys !== "object") state.seenKeys = {};
    if (!state.seenKeys[m]) state.seenKeys[m] = {};
    const hash = fastStringHash(`${m}|${String(key).slice(0, 240)}`);
    state.seenKeys[m][hash] = 1;
    const keys = Object.keys(state.seenKeys[m]);
    if (keys.length > ACCOUNT_SCORE_STATE_MAX_SEEN_PER_METRIC) {
      keys.slice(0, keys.length - ACCOUNT_SCORE_STATE_MAX_SEEN_PER_METRIC).forEach((k) => { delete state.seenKeys[m][k]; });
    }
  }

  function scoreStateHasSeenKey(state, metric, key) {
    const m = clampText(metric, 80).trim();
    if (!m || !key || !state || !state.seenKeys || !state.seenKeys[m]) return false;
    const hash = fastStringHash(`${m}|${String(key).slice(0, 240)}`);
    return !!state.seenKeys[m][hash];
  }

  function addScoreStateAppliedEvent(state, ev) {
    const id = String(ev && ev.id || "").slice(0, 220);
    if (!id) return;
    const day = dayKey(ev && ev.ts || Date.now());
    if (!state.appliedEventIds || typeof state.appliedEventIds !== "object") state.appliedEventIds = {};
    if (!state.appliedEventIds[day]) state.appliedEventIds[day] = {};
    state.appliedEventIds[day][id] = 1;
    const days = Object.keys(state.appliedEventIds).sort();
    if (days.length > ACCOUNT_SCORE_STATE_MAX_APPLIED_DAYS) days.slice(0, days.length - ACCOUNT_SCORE_STATE_MAX_APPLIED_DAYS).forEach((d) => { delete state.appliedEventIds[d]; });
  }

  function scoreStateHasAppliedEvent(state, ev) {
    const id = String(ev && ev.id || "").slice(0, 220);
    if (!id || !state || !state.appliedEventIds) return false;
    const day = dayKey(ev && ev.ts || Date.now());
    return !!(state.appliedEventIds[day] && state.appliedEventIds[day][id]);
  }

  function activeScoreStateBoosts(state, atTs) {
    const st = state && typeof state === "object" ? state : {};
    const ts = Number(atTs || Date.now()) || Date.now();
    const active = [];
    let xpMultiplier = 1;
    let dailyCapMultiplier = 1;
    (Array.isArray(st.activeBoosts) ? st.activeBoosts : []).forEach((row) => {
      const start = Number(row && row.startedAt || 0) || 0;
      const end = Number(row && row.expiresAt || 0) || 0;
      if (!start || !end || ts < start || ts > end) return;
      active.push(row);
      xpMultiplier = Math.max(xpMultiplier, Number(row.xpMultiplier || 1) || 1);
      dailyCapMultiplier = Math.max(dailyCapMultiplier, Number(row.dailyCapMultiplier || 1) || 1);
    });
    return { active, xpMultiplier, dailyCapMultiplier, xpBoostActive: xpMultiplier > 1.000001, capBoostActive: dailyCapMultiplier > 1.000001 };
  }

  function maybeAddBoostFromShopEventToScoreState(state, ev) {
    try {
      const metric = String(ev && (ev.metric || ev.type) || "").toLowerCase();
      if (metric !== "shop_purchase" && metric !== "shop_gift_received") return;
      const itemId = shopItemIdFromEvent(ev);
      const item = SHOP_CATALOG[itemId] || null;
      if (!item || !item.consumable) return;
      const start = shopBoostStartFromEvent(ev);
      const duration = shopBoostDurationMs(item);
      if (!duration) return;
      if (!Array.isArray(state.activeBoosts)) state.activeBoosts = [];
      const xpMultiplier = Number(item.xpMultiplier || 1) || 1;
      const dailyCapMultiplier = Number(item.dailyCapMultiplier || 1) || 1;
      state.activeBoosts.push({ itemId, title: item.title || itemId, startedAt: start, expiresAt: start + duration, xpMultiplier, dailyCapMultiplier });
      state.activeBoosts = state.activeBoosts.filter((row) => Number(row && row.expiresAt || 0) > Date.now() - 86400000).slice(-30);
      const today = dayKey(Date.now());
      if (!state.dailyBuckets || typeof state.dailyBuckets !== "object") state.dailyBuckets = {};
      const current = cleanScoreStateDailyBucket(state.dailyBuckets[today] || { day: today }, today);
      const baseCap = accountDailyXpCapForTotal(state.totalScore || 0);
      current.baseDailyCap = Math.max(Number(current.baseDailyCap || 0) || 0, baseCap);
      current.dailyCapMultiplier = Math.max(Number(current.dailyCapMultiplier || 1) || 1, dailyCapMultiplier);
      current.xpMultiplier = Math.max(Number(current.xpMultiplier || 1) || 1, xpMultiplier);
      current.dailyCap = Math.max(Number(current.dailyCap || 0) || 0, baseCap * current.dailyCapMultiplier);
      state.dailyBuckets[today] = current;
    } catch (_) {}
  }

  function applyEventToScoreState(inputState, event, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const ev = normaliseEvent(event);
    let st = normaliseScoreState(inputState || emptyScoreState());
    if (!ev) return st;
    if (scoreStateHasAppliedEvent(st, ev)) {
      // A boost purchase may have been recorded before the active-boost snapshot
      // existed, or it may have been restored from a compact sync summary. Do
      // not charge the purchase twice, but do restore the active cap/XP booster.
      if (isShopCurrencyEvent(ev)) {
        maybeAddBoostFromShopEventToScoreState(st, ev);
        st = normaliseScoreState(st);
      }
      return st;
    }
    const day = dayKey(ev.ts || Date.now());
    if (!st.dailyBuckets) st.dailyBuckets = {};
    if (!st.dailyBuckets[day]) st.dailyBuckets[day] = cleanScoreStateDailyBucket({ day, dailyCap: accountDailyXpCapForTotal(st.totalScore), baseDailyCap: accountDailyXpCapForTotal(st.totalScore) }, day);
    const bucket = st.dailyBuckets[day];
    let xpDelta = 0;
    let rawDelta = 0;
    let repeatAdjustedDelta = 0;
    let beforeDailyCapDelta = 0;
    let currencyEarnedDelta = 0;
    let currencySpentDelta = 0;
    let currencyCreditedDelta = 0;
    let repeatApplied = false;
    let metricCapApplied = false;
    let dailyCapApplied = false;
    const metric = ev.metric;

    if (isAccountScoreBaselineEvent(ev)) {
      xpDelta = round(accountScoreBaselineXp(ev));
      currencyEarnedDelta = round(Math.max(0, accountScoreBaselineCurrency(ev)));
      rawDelta = xpDelta;
      repeatAdjustedDelta = xpDelta;
      beforeDailyCapDelta = xpDelta;
    } else if (isShopCurrencyEvent(ev)) {
      currencySpentDelta = round(currencyCostFromEvent(ev));
      currencyCreditedDelta = round(currencyCreditFromEvent(ev));
      maybeAddBoostFromShopEventToScoreState(st, ev);
    }

    const rule = XP_RULES[metric];
    if (rule) {
      const units = Math.max(0, Number(ev.count || 1) || 1);
      const boost = activeScoreStateBoosts(st, Number(ev.ts || Date.now()) || Date.now());
      const xpMultiplier = Math.max(1, Number(boost.xpMultiplier || 1) || 1);
      const dailyCapMultiplier = Math.max(1, Number(boost.dailyCapMultiplier || 1) || 1);
      const baseDailyCap = accountDailyXpCapForTotal(st.totalScore || 0);
      const effectiveDailyCap = baseDailyCap * dailyCapMultiplier;
      bucket.baseDailyCap = Math.max(Number(bucket.baseDailyCap || 0) || 0, baseDailyCap);
      bucket.dailyCap = Math.max(Number(bucket.dailyCap || 0) || 0, effectiveDailyCap);
      bucket.xpMultiplier = Math.max(Number(bucket.xpMultiplier || 1) || 1, xpMultiplier);
      bucket.dailyCapMultiplier = Math.max(Number(bucket.dailyCapMultiplier || 1) || 1, dailyCapMultiplier);
      const baseXpRaw = Number(rule.xp || 0);
      const baseXp = baseXpRaw * xpMultiplier;
      const repeatPercent = Number(rule.repeat || 1);
      const stateKey = stateKeyForXp(ev);
      const repeated = !!(repeatPercent < 0.999999 && scoreStateHasSeenKey(st, metric, stateKey));
      let firstUnits = units;
      let repeatUnits = 0;
      if (repeatPercent < 0.999999) {
        if (repeated) {
          firstUnits = 0;
          repeatUnits = units;
        } else {
          firstUnits = Math.min(1, units);
          repeatUnits = Math.max(0, units - firstUnits);
        }
        addScoreStateSeenKey(st, metric, stateKey);
      }
      rawDelta = round(rawDelta + baseXp * units);
      repeatAdjustedDelta = round(repeatAdjustedDelta + baseXp * firstUnits + baseXp * repeatPercent * repeatUnits);
      const currencyAdjusted = baseXpRaw * firstUnits + baseXpRaw * repeatPercent * repeatUnits;
      currencyEarnedDelta = round(currencyEarnedDelta + Math.max(0, currencyAdjusted));
      const metricBefore = Number(bucket.metrics && bucket.metrics[metric] || 0) || 0;
      const metricRuleCap = Number(rule.dailyCap || Infinity);
      const effectiveMetricCap = Number.isFinite(metricRuleCap) ? metricRuleCap * xpMultiplier : Infinity;
      const metricRoom = Math.max(0, effectiveMetricCap - metricBefore);
      const metricScore = Math.min(repeatAdjustedDelta, metricRoom);
      const globalRoom = Math.max(0, Number(bucket.dailyCap || 50) - Number(bucket.score || 0));
      xpDelta = round(xpDelta + Math.max(0, Math.min(metricScore, globalRoom)));
      beforeDailyCapDelta = round(beforeDailyCapDelta + metricScore);
      repeatApplied = repeatUnits > 0 || (firstUnits <= 0 && units > 0 && repeatPercent < 0.999999);
      metricCapApplied = metricScore + 1e-9 < repeatAdjustedDelta;
      dailyCapApplied = xpDelta + 1e-9 < metricScore;
    }

    st.totalScore = round(st.totalScore + xpDelta);
    st.totalXp = st.totalScore;
    st.score = st.totalScore;
    st.totalRawScore = round((st.totalRawScore || 0) + rawDelta);
    st.totalRepeatAdjustedScore = round((st.totalRepeatAdjustedScore || 0) + repeatAdjustedDelta);
    st.totalBeforeDailyCap = round((st.totalBeforeDailyCap || 0) + beforeDailyCapDelta);
    st.totalCurrencyEarned = round((st.totalCurrencyEarned || 0) + currencyEarnedDelta);
    st.currencyEarned = st.totalCurrencyEarned;
    st.currencySpent = round((st.currencySpent || 0) + currencySpentDelta);
    st.currencyCredited = round((st.currencyCredited || 0) + currencyCreditedDelta);
    st.currencyBalance = round(Math.max(0, st.totalCurrencyEarned + st.currencyCredited - st.currencySpent));
    st.eorbits = st.currencyBalance;

    bucket.count = round((bucket.count || 0) + (XP_RULES[metric] ? Math.max(0, Number(ev.count || 1) || 1) : 0));
    bucket.rawScore = round((bucket.rawScore || 0) + rawDelta);
    bucket.repeatAdjustedScore = round((bucket.repeatAdjustedScore || 0) + repeatAdjustedDelta);
    bucket.scoreBeforeDailyCap = round((bucket.scoreBeforeDailyCap || 0) + beforeDailyCapDelta);
    bucket.score = round((bucket.score || 0) + xpDelta);
    bucket.currencyEarned = round((bucket.currencyEarned || 0) + currencyEarnedDelta);
    bucket.currency = bucket.currencyEarned;
    bucket.currencySpent = round((bucket.currencySpent || 0) + currencySpentDelta);
    bucket.currencyCredited = round((bucket.currencyCredited || 0) + currencyCreditedDelta);
    bucket.dailyCapApplied = !!(bucket.dailyCapApplied || dailyCapApplied || bucket.score >= Number(bucket.dailyCap || 50) - 0.000001);
    bucket.dailyCapReached = !!(bucket.dailyCapReached || bucket.score >= Number(bucket.dailyCap || 50) - 0.000001);
    if (!bucket.metrics) bucket.metrics = {};
    if (!bucket.currencyMetrics) bucket.currencyMetrics = {};
    if (metric && (xpDelta || XP_RULES[metric])) bucket.metrics[metric] = round((bucket.metrics[metric] || 0) + xpDelta);
    if (metric && currencyEarnedDelta) bucket.currencyMetrics[metric] = round((bucket.currencyMetrics[metric] || 0) + currencyEarnedDelta);
    st.dailyBuckets[day] = bucket;

    if (metric && (XP_RULES[metric] || isShopCurrencyEvent(ev) || isAccountScoreBaselineEvent(ev))) {
      if (!st.breakdown) st.breakdown = {};
      const old = st.breakdown[metric] || {};
      const rule = XP_RULES[metric] || {};
      const oldDailyDetails = Array.isArray(old.dailyDetails) ? old.dailyDetails.slice(-79) : [];
      const detailUnits = XP_RULES[metric] ? Math.max(0, Number(ev.count || 1) || 1) : 1;
      const eventDailyDetail = {
        day,
        count: round(detailUnits),
        rawScore: round(rawDelta),
        repeatAdjustedScore: round(repeatAdjustedDelta),
        scoreBeforeDailyCap: round(beforeDailyCapDelta),
        score: round(xpDelta),
        currencyEarned: round(currencyEarnedDelta),
        currency: round(currencyEarnedDelta),
        repeatApplied: !!repeatApplied,
        repeatPercent: repeatApplied ? Math.round(Number(rule.repeat || 1) * 100) : 100,
        metricCapApplied: !!metricCapApplied,
        dailyCapApplied: !!dailyCapApplied,
        xpMultiplier: Number(bucket.xpMultiplier || 1) || 1,
        dailyCapMultiplier: Number(bucket.dailyCapMultiplier || 1) || 1,
        dailyCap: round(bucket.dailyCap || accountDailyXpCapForTotal(st.totalScore)),
        dayFactor: beforeDailyCapDelta > 0 ? round(xpDelta / beforeDailyCapDelta) : 1,
        path: ev.path || "",
        title: ev.title || "",
        createdAt: Number(ev.ts || ev.createdAt || Date.now()) || Date.now()
      };
      st.breakdown[metric] = Object.assign({}, old, {
        metric,
        label: old.label || labelForMetric(metric),
        category: old.category || rule.category || (isShopCurrencyEvent(ev) ? "Shop" : "Activity"),
        count: round((old.count || 0) + (XP_RULES[metric] ? Math.max(0, Number(ev.count || 1) || 1) : 1)),
        score: round((old.score || 0) + xpDelta),
        rawScore: round((old.rawScore || 0) + rawDelta),
        repeatAdjustedScore: round((old.repeatAdjustedScore || 0) + repeatAdjustedDelta),
        scoreBeforeDailyCap: round((old.scoreBeforeDailyCap || 0) + beforeDailyCapDelta),
        currencyEarned: round((old.currencyEarned || old.currency || 0) + currencyEarnedDelta),
        currency: round((old.currency || old.currencyEarned || 0) + currencyEarnedDelta),
        xpPerCount: Number(rule.xp || old.xpPerCount || 0) || 0,
        dailyCap: rule.dailyCap != null ? rule.dailyCap : old.dailyCap,
        globalDailyCap: round(bucket.dailyCap || accountDailyXpCapForTotal(st.totalScore)),
        repeatPercent: old.repeatPercent == null ? Math.round(Number(rule.repeat || 1) * 100) : old.repeatPercent,
        repeatDiscountApplied: !!(old.repeatDiscountApplied || repeatApplied),
        metricCapApplied: !!(old.metricCapApplied || metricCapApplied),
        dailyCapApplied: !!(old.dailyCapApplied || dailyCapApplied),
        updatedAt: Math.max(Number(old.updatedAt || 0), Number(ev.updatedAt || ev.ts || 0) || 0),
        dailyDetails: oldDailyDetails.concat([eventDailyDetail]).slice(-80)
      });
    }

    addScoreStateAppliedEvent(st, ev);
    const progress = scoreStateProgressFields(st.totalScore);
    Object.assign(st, progress, { updatedAt: Date.now(), lastEventAt: Math.max(Number(st.lastEventAt || 0), Number(ev.updatedAt || ev.ts || Date.now()) || Date.now()), source: options.source || "incremental-local-event" });
    return normaliseScoreState(st);
  }

  function attachSeenKeysToScoreStateFromFile(state, file) {
    const st = normaliseScoreState(state || emptyScoreState());
    const events = Array.isArray(file && file.eventLog) ? file.eventLog.slice().sort((a, b) => Number(a.ts || 0) - Number(b.ts || 0)) : [];
    events.forEach((ev) => {
      if (!ev || isAccountScoreBaselineEvent(ev)) return;
      const metric = ev.metric;
      const rule = XP_RULES[metric];
      if (!rule) return;
      if (Number(rule.repeat || 1) < 0.999999 || rule.oneTime) addScoreStateSeenKey(st, metric, stateKeyForXp(ev));
      addScoreStateAppliedEvent(st, ev);
    });
    return normaliseScoreState(st);
  }

  function rebuildScoreStateFromFile(file, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const xp = options.xp && typeof options.xp === "object" ? options.xp : xpFromFile(file || readFile());
    let st = scoreStateFromXp(xp, { source: options.source || "full-ledger-score-rebuild", lastFullRebuildAt: Date.now(), updatedAt: Date.now(), calculationVersion: xp.calculationVersion || "full-ledger-score-rebuild" });
    st = attachSeenKeysToScoreStateFromFile(st, file || readFile());
    st.lastFullRebuildAt = Date.now();
    st.updatedAt = Date.now();
    return normaliseScoreState(st);
  }

  function scoreStateFromSyncSummary(file) {
    try {
      const s = file && file.syncSummary && typeof file.syncSummary === "object" ? file.syncSummary : null;
      if (s && s.xp && typeof s.xp === "object") return scoreStateFromXp(s.xp, { source: "sync-summary-xp" });
    } catch (_) {}
    return null;
  }

  function bestScoreStateForFile(file, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const f = file && typeof file === "object" ? file : null;
    const fileState = f && f.scoreState && typeof f.scoreState === "object" ? normaliseScoreState(f.scoreState) : null;
    const fromSummary = scoreStateFromSyncSummary(f || {});
    let chosen = bestScoreStateCandidate([fileState, fromSummary]);
    if (chosen) chosen = normaliseScoreState(ensureScoreStateBoostsFromFile(chosen, f));
    if (options.allowCompute && (!chosen || scoreStateLooksUnseeded(chosen, f || {}))) return rebuildScoreStateFromFile(f || readFile(), { source: options.source || "score-state-migration" });
    return chosen || null;
  }

  function fileWithScoreState(file, scoreState) {
    const f = file && typeof file === "object" ? Object.assign({}, file) : emptyFile();
    f.scoreState = normaliseScoreState(scoreState || bestScoreStateForFile(f) || emptyScoreState());
    f.updatedAt = Number(f.updatedAt || Date.now()) || Date.now();
    return f;
  }

  function refreshScoreStateOnFile(file, source) {
    const f = file && typeof file === "object" ? Object.assign({}, file) : readFile();
    const xp = xpFromFile(f);
    f.scoreState = rebuildScoreStateFromFile(f, { xp, source: source || "sync-score-state-refresh" });
    f.syncSummary = f.syncSummary && typeof f.syncSummary === "object" ? Object.assign({}, f.syncSummary, { xp: scoreStateToXp(f.scoreState, f) }) : f.syncSummary;
    f.updatedAt = Date.now();
    return f;
  }

  function writeAccountXpLightCache(score) {
    try {
      const x = score && typeof score === "object" ? score : null;
      if (!x) return;
      const profile = readProfile();
      const byKey = String(x.accountKey || profile.accountKey || "").trim().toLowerCase();
      const byName = String(profile.name || x.name || "").trim().toLowerCase();
      const nowTs = Date.now();
      const light = JSON.stringify({
        cachedAt: nowTs,
        schemaVersion: ACCOUNT_XP_LIGHT_CACHE_SCHEMA_VERSION,
        accountKey: byKey || x.accountKey || "",
        name: profile.name || x.name || "",
        score: {
          totalScore: Number(x.totalScore || x.totalXp || x.score || 0) || 0,
          totalXp: Number(x.totalXp || x.totalScore || x.score || 0) || 0,
          level: Number(x.level || 1) || 1,
          thresholds: x.thresholds || x.levelThresholds || [],
          progressPct: x.progressPct == null ? null : Number(x.progressPct),
          intoLevel: x.intoLevel == null ? null : Number(x.intoLevel),
          levelSpan: x.levelSpan == null ? null : Number(x.levelSpan),
          nextLevel: x.nextLevel == null ? null : Number(x.nextLevel),
          dailyCap: x.dailyCap == null ? null : Number(x.dailyCap),
          totalCurrencyEarned: x.totalCurrencyEarned == null ? null : Number(x.totalCurrencyEarned),
          currencyEarned: x.currencyEarned == null ? null : Number(x.currencyEarned),
          currencyCredited: Number(x.currencyCredited || 0) || 0,
          currencySpent: Number(x.currencySpent || 0) || 0,
          currencyBalance: x.currencyBalance == null ? (x.eorbits == null ? null : Number(x.eorbits)) : Number(x.currencyBalance),
          eorbits: x.eorbits == null ? (x.currencyBalance == null ? null : Number(x.currencyBalance)) : Number(x.eorbits),
          accountKey: byKey || x.accountKey || "",
          name: profile.name || x.name || "",
          cachedAt: nowTs,
          lastSyncedAt: Number(x.lastSyncedAt || x.cachedAt || nowTs),
          isCompleteXp: true,
          sourceEvents: true,
          lightCache: true
        }
      });
      const keys = new Set([ACCOUNT_XP_LIGHT_CACHE_LATEST_KEY]);
      if (byKey) keys.add(ACCOUNT_XP_LIGHT_CACHE_KEY_PREFIX + byKey);
      if (byName) keys.add(ACCOUNT_XP_LIGHT_CACHE_KEY_PREFIX + byName);
      keys.forEach((key) => { try { localStorage.setItem(key, light); } catch (_) {} });
    } catch (_) {}
  }

  function publishScoreStateChange(scoreState, source, event) {
    try {
      const score = scoreStateToXp(scoreState || (readFile().scoreState), readFile());
      __mkAccountXpMemoKey = "score-state:" + (score.cachedAt || Date.now());
      __mkAccountXpMemoScore = score;
      writeAccountXpLightCache(score);
      window.dispatchEvent(new CustomEvent("mk-account-xp-change", { detail: { score, source: source || "score-state", event } }));
      window.dispatchEvent(new CustomEvent("mk-local-activity-change", { detail: { type: "account-xp", score, source: source || "score-state" } }));
    } catch (_) {}
  }

  function isShopAdminTrialUser() {
    try {
      const p = readProfile();
      const nm = String(p.name || p.displayName || p.username || "").trim().toLowerCase();
      const key = String(p.accountKey || p.account_key || p.nameKey || p.name_key || "").trim().toLowerCase();
      const role = String(p.role || p.accountRole || p.userRole || "").trim().toLowerCase();
      if (key === "rock" || key === "rock-rug" || nm === "rock" || nm === "rock-rug") return true;
      if (role === "admin" || role === "owner" || role === "maintainer") return true;
    } catch (_) {}
    try {
      const token = String(localStorage.getItem("ai_mqc_report_admin_token_v1") || localStorage.getItem("mk_hot_admin_token_v1") || "").trim();
      if (/^rock$/i.test(token) || /^admin[:_-]?rock$/i.test(token)) return true;
    } catch (_) {}
    return false;
  }

  function readAdminShopPreviewOverrides() {
    // v44: admin no longer has persistent / unlimited shop previews.
    // Clear the old local override key so previously saved admin previews do
    // not keep visual effects enabled by default after this update.
    try { localStorage.removeItem(ADMIN_SHOP_PREVIEW_KEY); } catch (_) {}
    return {};
  }

  function writeAdminShopPreviewOverrides(obj) {
    // v44: keep this as a no-op for backward compatibility with older UI code,
    // but never store admin preview overrides again.
    try { localStorage.removeItem(ADMIN_SHOP_PREVIEW_KEY); } catch (_) {}
  }

  function setAdminShopPreviewOverride(itemId, active) {
    // v44: unlimited admin preview toggles are disabled. Admins use the same
    // click-to-preview, page-scoped trial flow as every other user.
    try { localStorage.removeItem(ADMIN_SHOP_PREVIEW_KEY); } catch (_) {}
  }

  function adminShopPreviewOverrideRows() {
    // v44: no persistent admin preview rows.
    try { localStorage.removeItem(ADMIN_SHOP_PREVIEW_KEY); } catch (_) {}
    return [];
  }

  function currentTrialLocationKey() {
    try {
      const u = new URL(window.location.href || "", document.baseURI || window.location.href || "");
      u.hash = "";
      return u.href;
    } catch (_) { return String(window.location.href || "").split("#")[0]; }
  }

  function currentTrialPathKey() {
    try { return currentPath(); } catch (_) { return ""; }
  }

  function readPageShopTrialRecord() {
    try {
      const raw = sessionStorage.getItem(SHOP_PAGE_TRIAL_KEY);
      const rec = raw ? JSON.parse(raw) : null;
      return rec && typeof rec === "object" && !Array.isArray(rec) ? rec : null;
    } catch (_) { return null; }
  }

  function writePageShopTrialRecord(rec) {
    try {
      if (!rec) sessionStorage.removeItem(SHOP_PAGE_TRIAL_KEY);
      else sessionStorage.setItem(SHOP_PAGE_TRIAL_KEY, JSON.stringify(rec));
    } catch (_) {}
  }

  function markShopTrialNavigationPreview(ms) {
    const until = Date.now() + Math.max(3000, Number(ms || 9000) || 9000);
    try { sessionStorage.setItem(SHOP_TRIAL_SKIP_PRELOAD_KEY, String(until)); } catch (_) {}
    try { window.__mkShopTrialSkipPreloadUntil = until; } catch (_) {}
  }

  function clearPageShopTrialRecord(reason) {
    const rec = readPageShopTrialRecord();
    if (!rec) return;
    writePageShopTrialRecord(null);
    try { window.dispatchEvent(new CustomEvent("mk-shop-trial-change", { detail: { ended: true, reason: reason || "page-trial-clear", itemId: rec.itemId || "" } })); } catch (_) {}
  }

  function normaliseTrialHref(value) {
    try {
      const u = new URL(String(value || ""), document.baseURI || window.location.href || "");
      u.hash = "";
      return u.href;
    } catch (_) { return String(value || "").split("#")[0]; }
  }

  function activePageShopTrialRows() {
    const rec = readPageShopTrialRecord();
    if (!rec || !rec.itemId || !SHOP_CATALOG[rec.itemId]) return [];
    const item = SHOP_CATALOG[rec.itemId];
    const nowTs = Date.now();
    const startedAt = Number(rec.startedAt || rec.ts || 0) || 0;
    const targetHref = normaliseTrialHref(rec.targetHref || rec.href || "");
    const currentHref = currentTrialLocationKey();
    const targetPath = clampText(rec.targetPath || "", 260).trim();
    const currentPathKey = currentTrialPathKey();
    const pending = !!rec.pending && startedAt && nowTs - startedAt <= SHOP_PAGE_TRIAL_ACTIVATION_GRACE_MS;
    const hrefMatches = !!targetHref && targetHref === currentHref;
    const pathMatches = !!targetPath && targetPath === currentPathKey;
    const anyConceptMatches = !!rec.targetAnyConcept && isConceptRelPath(currentPathKey);
    const samePageMatches = !targetHref && !targetPath && !rec.targetAnyConcept && String(rec.pageKey || "") === currentHref;
    const activeHere = hrefMatches || pathMatches || anyConceptMatches || samePageMatches || pending;
    if (!activeHere) {
      clearPageShopTrialRecord("left-preview-page");
      return [];
    }
    if (pending && (hrefMatches || pathMatches || anyConceptMatches || samePageMatches)) {
      rec.pending = false;
      rec.activatedAt = nowTs;
      rec.pageKey = currentHref;
      if (anyConceptMatches) rec.targetPath = currentPathKey;
      writePageShopTrialRecord(rec);
    }
    return [{
      itemId: rec.itemId,
      ts: startedAt || nowTs,
      day: rec.day || dayKey(startedAt || nowTs),
      expiresAt: 0,
      admin: !!rec.admin,
      pageScoped: true,
      targetHref: targetHref || currentHref,
      eventId: rec.eventId || "page-scoped-trial:" + rec.itemId
    }];
  }

  function isClickInsidePageTrialTarget(rec, target) {
    try {
      const t = target && target.nodeType === 1 ? target : (target && target.parentElement ? target.parentElement : null);
      if (!t || !t.closest) return false;
      const item = rec && rec.itemId ? SHOP_CATALOG[rec.itemId] : null;
      const slot = String((rec && rec.slot) || (item && item.slot) || "");
      if (slot === "search_box_effect") return !!t.closest('.md-search,.md-search__inner,[data-md-component="search"],.md-search-result,.md-search__form');
      if (slot === "dropdown_skin" || slot === "header_skin" || slot === "header_font" || slot === "interface_theme" || slot === "interface_theme_light" || slot === "interface_theme_dark") return !!t.closest('.md-header,.md-tabs,.md-tabs__list,.md-tabs__link,.md-nav,.md-sidebar,#current-course-bar,#mk-sidebar-sortdock,#comments,.mk-page-comments,.mk-random-tabs-menu,.mk-rt-menu,.mk-rt-trigger,.mk-rt-panel,#rf-year-course-popover-v4,.md-tab-dropdown-panel.md-random-dropdown-panel,#random-dropdown-panel,#year-dropdown-panel');
      if (slot === "body_font") return !!t.closest('.md-main,.md-content,.md-sidebar,#current-course-bar,#mk-sidebar-sortdock,#mk-mobile-unified-sidebar-surface,#comments,.mk-page-comments,.mk-local-activity-modal') && !t.closest('.md-header,.md-tabs,.arithmatex,.MathJax,.katex,mjx-container');
      if (slot === "page_pattern") return !!t.closest('body,.md-container,.md-main,.md-content,.md-sidebar,#comments,.mk-page-comments');
      if (slot === "comment_effect") return !!t.closest('#comments,.mk-comments,.mk-comment-panel,.mk-comment-card,.mk-comment-composer,.mk-comment-form,.mk-comment-emoji-picker,.mk-comment-emoji-btn');
      if (slot === "map_effect" || slot === "map_animation") return !!t.closest('.lp-map-modal,.lp-map-shell,.lp-h1-map,.mw-h1-map,.mk-local-map,.mk-concept-map,[data-lp-open-map]');
      if (slot === "profile_frame" || slot === "profile_background") {
        if (t.closest('.mk-local-activity-close')) return false;
        return !!t.closest('.mk-public-profile-modal,.mk-public-profile-preview,.mk-comment-person.is-public-profile,.mk-trending-user,.mk-trending-row,.mk-trending-current-user,[data-public-profile],[data-profile-name]');
      }
      if (slot === "ranking_effect") return !!t.closest('.mk-trending,.mk-trending-card,.mk-ranking,.mk-ranking-list,.trending-unified,.trending-block,.trending-list,.trending-user-item,.trending-grid,.trending-metric-switch,#trending-app');
      if (slot === "finder_effect") return !!t.closest('.mk-random,.mk-finder,.mk-custom-random,.mk-random-card,.mk-find-builder');
      if (slot === "mastery_effect" || slot.indexOf("mastery_effect_") === 0) return !!t.closest('#mw-mastery,#mw-mastery-compact,.mw-pill,.mw-row,.mw-head,.mw-title,.mw-manage,.mw-hide,.mw-ready-chip,.mw-recap-chip,.mw-widget,.mw-modal,.mk-mastery,.mk-mastery-widget,.mk-course-mastery,article.md-content__inner h1.lp-h1-row,.mw-title-badge');
      return false;
    } catch (_) { return false; }
  }

  function bindPageShopTrialExitClearOnce() {
    if (window.__mkShopPageTrialExitClearBound) return;
    window.__mkShopPageTrialExitClearBound = true;
    const clearForNavigation = (ev) => {
      try {
        const rec = readPageShopTrialRecord();
        if (!rec) return;
        const t = ev && ev.target;
        const a = t && t.closest ? t.closest('a[href]') : null;
        if (isClickInsidePageTrialTarget(rec, t)) return;
        if (a) {
          const href = normaliseTrialHref(a.href || a.getAttribute('href') || '');
          const target = normaliseTrialHref(rec.targetHref || rec.href || '');
          if (href && target && href === target && !!rec.pending) return;
        }
        clearPageShopTrialRecord("user-left-preview");
      } catch (_) {}
    };
    try { document.addEventListener("click", clearForNavigation, true); } catch (_) {}
    try { window.addEventListener("popstate", () => clearPageShopTrialRecord("history-change"), { passive: true }); } catch (_) {}
    // Do not clear on pagehide.  A Try action intentionally navigates once to
    // the preview page; some browsers / MkDocs instant navigation fire pagehide
    // during that transition and were clearing the preview immediately.  The
    // record is instead cleared by the next click outside the preview area or
    // by activePageShopTrialRows() when a later page no longer matches.
  }

  function shopTrialOwnerKey() {
    return clampText(accountKey() || getVisitorId() || "anon", 180).trim() || "anon";
  }

  function readRuntimeShopTrialsRaw() {
    try {
      const raw = localStorage.getItem(SHOP_RUNTIME_TRIAL_KEY) || sessionStorage.getItem(SHOP_RUNTIME_TRIAL_KEY) || "[]";
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (_) { return []; }
  }

  function writeRuntimeShopTrialsRaw(rows) {
    const clean = Array.isArray(rows) ? rows.slice(-200) : [];
    try { localStorage.setItem(SHOP_RUNTIME_TRIAL_KEY, JSON.stringify(clean)); } catch (_) {}
    try { sessionStorage.setItem(SHOP_RUNTIME_TRIAL_KEY, JSON.stringify(clean)); } catch (_) {}
    return clean;
  }

  function runtimeShopTrialRows(atTs) {
    const nowTs = Number(atTs || Date.now()) || Date.now();
    const owner = shopTrialOwnerKey();
    const rows = readRuntimeShopTrialsRaw();
    let changed = false;
    const active = [];
    const keep = [];
    rows.forEach((raw) => {
      const row = raw && typeof raw === "object" ? raw : {};
      const itemId = clampText(row.itemId || "", 120).trim();
      const expiresAt = Number(row.expiresAt || 0) || 0;
      const rowOwner = clampText(row.owner || row.accountKey || row.visitorId || "", 180).trim();
      const item = SHOP_CATALOG[itemId] || null;
      if (!item || !item.cosmetic || item.consumable || !expiresAt) { changed = true; return; }
      if (expiresAt <= nowTs) { changed = true; return; }
      keep.push(row);
      if (rowOwner && rowOwner !== owner) return;
      active.push({
        itemId,
        ts: Number(row.ts || row.startedAt || 0) || nowTs,
        day: clampText(row.day || dayKey(Number(row.ts || row.startedAt || nowTs) || nowTs), 20).trim(),
        expiresAt,
        admin: !!row.admin,
        muted: !!row.muted,
        version: clampText(row.version || row.trialVersion || SHOP_TRIAL_VERSION, 30).trim(),
        runtime: true,
        eventId: row.eventId || `runtime-shop-trial:${owner}:${itemId}`
      });
    });
    if (changed || keep.length !== rows.length) writeRuntimeShopTrialsRaw(keep);
    return active;
  }

  function upsertRuntimeShopTrial(itemId, detail) {
    const id = clampText(itemId || "", 120).trim();
    const item = SHOP_CATALOG[id] || null;
    if (!item || !item.cosmetic || item.consumable) return null;
    const d = detail && typeof detail === "object" ? detail : {};
    const owner = shopTrialOwnerKey();
    const startedAt = Number(d.startedAt || d.ts || Date.now()) || Date.now();
    const expiresAt = Number(d.expiresAt || (startedAt + SHOP_TRIAL_DURATION_MS)) || (startedAt + SHOP_TRIAL_DURATION_MS);
    const slot = normaliseShopSlot(item.slot || "cosmetic", id, item);
    const row = {
      itemId: id,
      itemTitle: item.title || id,
      category: item.category || "",
      slot,
      owner,
      accountKey: accountKey(),
      visitorId: getVisitorId(),
      ts: startedAt,
      startedAt,
      expiresAt,
      activatedAt: Number(d.activatedAt || d.activeAt || 0) || 0,
      day: clampText(d.day || dayKey(startedAt), 20).trim(),
      admin: !!d.admin,
      muted: !!d.muted,
      version: SHOP_TRIAL_VERSION,
      trialVersion: SHOP_TRIAL_VERSION,
      eventId: d.eventId || `runtime-shop-trial:${owner}:${id}:${startedAt}`
    };
    const rows = readRuntimeShopTrialsRaw().filter((x) => {
      const r = x && typeof x === "object" ? x : {};
      const sameOwner = clampText(r.owner || r.accountKey || r.visitorId || "", 180).trim() === owner;
      const rid = clampText(r.itemId || "", 120).trim();
      const rItem = SHOP_CATALOG[rid] || {};
      const rSlot = normaliseShopSlot(r.slot || rItem.slot || "", rid, rItem);
      return !(sameOwner && (rid === id || (rSlot && rSlot === slot)));
    });
    rows.push(row);
    writeRuntimeShopTrialsRaw(rows);
    return row;
  }

  function stopRuntimeShopTrial(itemId) {
    const id = clampText(itemId || "", 120).trim();
    const owner = shopTrialOwnerKey();
    const rows = readRuntimeShopTrialsRaw().filter((x) => {
      const r = x && typeof x === "object" ? x : {};
      const sameOwner = clampText(r.owner || r.accountKey || r.visitorId || "", 180).trim() === owner;
      return !(sameOwner && String(r.itemId || "") === id);
    });
    writeRuntimeShopTrialsRaw(rows);
  }

  function stopRuntimeShopTrialsForSlot(slot, exceptItemId) {
    const wanted = clampText(slot || "", 80).trim();
    const keepId = clampText(exceptItemId || "", 120).trim();
    if (!wanted) return [];
    const owner = shopTrialOwnerKey();
    const removed = [];
    const next = [];
    const tsNow = Date.now();
    readRuntimeShopTrialsRaw().forEach((x) => {
      const r = x && typeof x === "object" ? x : {};
      const sameOwner = clampText(r.owner || r.accountKey || r.visitorId || "", 180).trim() === owner;
      const itemId = clampText(r.itemId || "", 120).trim();
      const item = SHOP_CATALOG[itemId] || {};
      const rSlot = normaliseShopSlot(r.slot || item.slot || "", itemId, item);
      const active = Number(r.expiresAt || 0) > tsNow;
      if (sameOwner && active && itemId && itemId !== keepId && rSlot === wanted) {
        removed.push(itemId);
        return;
      }
      next.push(r);
    });
    if (removed.length) writeRuntimeShopTrialsRaw(next);
    return removed;
  }

  function setRuntimeShopTrialMuted(itemId, muted) {
    const id = clampText(itemId || "", 120).trim();
    const owner = shopTrialOwnerKey();
    const nowTs = Date.now();
    const targetItem = SHOP_CATALOG[id] || {};
    const targetSlot = normaliseShopSlot(targetItem.slot || "", id, targetItem);
    let found = false;
    if (!muted && targetSlot) {
      try { stopRuntimeShopTrialsForSlot(targetSlot, id); } catch (_) {}
    }
    const rows = readRuntimeShopTrialsRaw().map((x) => {
      const r = x && typeof x === "object" ? Object.assign({}, x) : {};
      const sameOwner = clampText(r.owner || r.accountKey || r.visitorId || "", 180).trim() === owner;
      const expiresAt = Number(r.expiresAt || 0) || 0;
      if (!sameOwner || expiresAt <= nowTs) return r;
      const rid = String(r.itemId || "");
      const rItem = SHOP_CATALOG[rid] || {};
      const rSlot = normaliseShopSlot(rItem.slot || "", rid, rItem);
      if (!muted && targetSlot && rid !== id && rSlot === targetSlot) {
        r.muted = true;
        r.mutedAt = nowTs;
      }
      if (rid === id) {
        r.muted = !!muted;
        r.mutedAt = muted ? nowTs : 0;
        if (!muted) r.activatedAt = nowTs;
        found = true;
      }
      return r;
    });
    if (found) writeRuntimeShopTrialsRaw(rows);
    return found;
  }

  function readRuntimeTrialUses() {
    try {
      const obj = JSON.parse(localStorage.getItem(SHOP_TRIAL_USE_KEY) || "{}");
      return obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
    } catch (_) { return {}; }
  }

  function writeRuntimeTrialUses(obj) {
    try { localStorage.setItem(SHOP_TRIAL_USE_KEY, JSON.stringify(obj && typeof obj === "object" ? obj : {})); } catch (_) {}
  }

  function runtimeTrialUseKey(itemId, day) {
    return `${shopTrialOwnerKey()}::${clampText(day || dayKey(Date.now()), 20)}::${clampText(itemId || "", 120)}::${SHOP_TRIAL_VERSION}`;
  }

  function markRuntimeShopTrialUse(itemId, day, admin) {
    if (admin) return;
    const id = clampText(itemId || "", 120).trim();
    if (!id) return;
    const uses = readRuntimeTrialUses();
    uses[runtimeTrialUseKey(id, day)] = Date.now();
    // Keep the use ledger small and recent. It is only a local backup for the
    // once-per-day rule; the account event log remains the canonical source.
    const keys = Object.keys(uses);
    if (keys.length > 800) {
      keys.sort((a, b) => Number(uses[b] || 0) - Number(uses[a] || 0)).slice(800).forEach((k) => { delete uses[k]; });
    }
    writeRuntimeTrialUses(uses);
  }

  function hasRuntimeShopTrialUseToday(itemId) {
    const id = clampText(itemId || "", 120).trim();
    if (!id) return false;
    const uses = readRuntimeTrialUses();
    return !!uses[runtimeTrialUseKey(id, dayKey(Date.now()))];
  }

  function shopTrialEventsFromFile(file) {
    const f = file ? normaliseFile(file) : readFile();
    const rows = Array.isArray(f.eventLog) ? f.eventLog : [];
    return rows
      .filter((ev) => String(ev && (ev.metric || ev.type) || "").toLowerCase() === "shop_trial")
      .map((ev) => {
        const d = ev.details && typeof ev.details === "object" ? ev.details : {};
        const itemId = clampText(d.itemId || d.item_id || ev.itemId || "", 120).trim();
        const ts = Number(ev.ts || ev.createdAt || d.startedAt || 0) || 0;
        const day = clampText(d.day || dayKey(ts || Date.now()), 20).trim();
        const expiresAt = Number(d.expiresAt || ev.expiresAt || 0) || 0;
        const admin = !!(d.admin || ev.admin);
        const version = clampText(d.trialVersion || d.version || ev.trialVersion || "", 30).trim();
        return { itemId, ts, day, expiresAt, admin, version, eventId: ev.id || "" };
      })
      .filter((row) => row.itemId && SHOP_CATALOG[row.itemId]);
  }

  function activeShopTrialItems(file) {
    const f = file ? normaliseFile(file) : readFile();
    const tsNow = Date.now();
    const byItem = new Map();
    const events = Array.isArray(f.eventLog) ? f.eventLog.slice().sort((a, b) => Number(a && a.ts || 0) - Number(b && b.ts || 0)) : [];
    const touch = (itemId) => {
      const id = clampText(itemId || "", 120).trim();
      if (!id || !SHOP_CATALOG[id]) return null;
      if (!byItem.has(id)) byItem.set(id, { itemId: id, trials: [], endTs: 0, endEventId: "" });
      return byItem.get(id);
    };
    events.forEach((ev) => {
      const metric = String(ev && (ev.metric || ev.type) || "").toLowerCase();
      if (metric !== "shop_trial" && metric !== "shop_trial_end") return;
      const d = ev.details && typeof ev.details === "object" ? ev.details : {};
      const itemId = clampText(d.itemId || d.item_id || ev.itemId || "", 120).trim();
      const row = touch(itemId);
      if (!row) return;
      const ts = Number(ev.ts || ev.createdAt || d.startedAt || d.endedAt || 0) || 0;
      if (metric === "shop_trial_end") {
        if (ts >= Number(row.endTs || 0)) { row.endTs = ts; row.endEventId = ev.id || ""; }
        return;
      }
      const day = clampText(d.day || dayKey(ts || Date.now()), 20).trim();
      const expiresAt = Number(d.expiresAt || ev.expiresAt || 0) || 0;
      const admin = !!(d.admin || ev.admin);
      const version = clampText(d.trialVersion || d.version || ev.trialVersion || "", 30).trim();
      row.trials.push({ itemId, ts, day, expiresAt, admin, version, muted: !!(d.muted || ev.muted), ended: false, eventId: ev.id || "" });
    });
    // v51: trials are timed account-level previews again.  The old page-scoped
    // session preview caused instant-navigation / preload flashes and cleared
    // itself as soon as the preview page settled.  Ignore that legacy record.
    const active = [];
    byItem.forEach((row) => {
      const endTs = Number(row.endTs || 0) || 0;
      const candidates = row.trials
        .filter((t) => Number(t.ts || 0) >= endTs)
        .filter((t) => Number(t.expiresAt || 0) > tsNow)
        .sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0));
      if (candidates.length) active.push(candidates[0]);
    });
    try { runtimeShopTrialRows(tsNow).forEach((row) => active.push(row)); } catch (_) {}
    const trialRankTs = (row) => Math.max(Number(row && row.activatedAt || 0) || 0, Number(row && row.ts || 0) || 0);
    const best = new Map();
    active.forEach((row) => {
      if (!row || !row.itemId) return;
      const old = best.get(row.itemId);
      if (!old || trialRankTs(row) >= trialRankTs(old)) best.set(row.itemId, row);
    });
    const rows = Array.from(best.values()).sort((a, b) => trialRankTs(b) - trialRankTs(a));
    const liveSlots = new Set();
    return rows.map((row) => {
      const item = SHOP_CATALOG[row && row.itemId];
      const slot = item ? normaliseShopSlot(item.slot || "", row && row.itemId, item) : "";
      if (!slot || row.muted) return row;
      if (liveSlots.has(slot)) return Object.assign({}, row, { muted: true, shadowMuted: true });
      liveSlots.add(slot);
      return row;
    });
  }

  function hasUsedShopTrialToday(itemId, file) {
    const id = clampText(itemId || "", 120).trim();
    if (!id) return false;
    const today = dayKey(Date.now());
    if (shopTrialEventsFromFile(file || readFile()).some((row) => row.itemId === id && row.day === today && !row.admin && row.version === SHOP_TRIAL_VERSION)) return true;
    return hasRuntimeShopTrialUseToday(id);
  }

  function trialItemForSlot(slot) {
    const wanted = clampText(slot || "", 80).trim();
    const active = activeShopTrialItems(readFile());
    for (const row of active) {
      const item = SHOP_CATALOG[row.itemId];
      if (item && normaliseShopSlot(item.slot || "", row.itemId, item) === wanted && !row.muted) return row.itemId;
    }
    return "";
  }

  function endActiveShopTrialsForSlot(slot, exceptItemId) {
    const wanted = clampText(slot || "", 80).trim();
    const keep = clampText(exceptItemId || "", 120).trim();
    if (!wanted) return [];
    try { stopRuntimeShopTrialsForSlot(wanted, keep); } catch (_) {}
    const ended = [];
    activeShopTrialItems(readFile()).forEach((row) => {
      const item = SHOP_CATALOG[row.itemId];
      if (!item || normaliseShopSlot(item.slot || "", row.itemId, item) !== wanted) return;
      if (keep && String(row.itemId) === keep) return;
      const ts = Date.now();
      const ev = recordEvent("shop_trial_end", {
        metric: "shop_trial_end",
        itemId: row.itemId,
        itemTitle: item.title,
        category: item.category,
        slot: wanted,
        endedAt: ts,
        source: "shop_trial_slot_switch"
      }, {
        metric: "shop_trial_end",
        id: `shop_trial_end:${accountKey() || getVisitorId()}:${row.itemId}:${ts}:slot`,
        ts,
        source: "shop_trial_slot_switch"
      });
      ended.push(ev);
    });
    return ended;
  }

  function startShopTrial(itemId, opts) {
    const id = String(itemId || "").trim();
    const item = SHOP_CATALOG[id];
    if (!item || !item.cosmetic || item.consumable) return { ok: false, error: "not_trialable" };
    const options = opts && typeof opts === "object" ? opts : {};
    const admin = !!isShopAdminTrialUser();
    const startedAt = Date.now();
    const today = dayKey(startedAt);
    const slot = normaliseShopSlot(item.slot || "cosmetic", id, item);

    // Keep one timed trial event per item per account per day, except Rock/admin
    // accounts.  Multiple different items may be active at the same time; when
    // two active items share one visual slot, the most recently started one wins
    // for that slot while the other timer continues independently.
    if (!admin && hasUsedShopTrialToday(id, readFile())) {
      return { ok: false, error: "trial_used_today", item: Object.assign({}, item) };
    }

    try { clearPageShopTrialRecord("legacy-preview-replaced-by-timed-trial"); } catch (_) {}
    try { endActiveShopTrialsForSlot(slot, id); } catch (_) {}

    const expiresAt = startedAt + SHOP_TRIAL_DURATION_MS;
    try {
      const owner = shopTrialOwnerKey();
      const rows = readRuntimeShopTrialsRaw().map((x) => {
        const r = x && typeof x === "object" ? Object.assign({}, x) : {};
        const sameOwner = clampText(r.owner || r.accountKey || r.visitorId || "", 180).trim() === owner;
        const rid = String(r.itemId || "");
        const rItem = SHOP_CATALOG[rid] || {};
        const rSlot = normaliseShopSlot(rItem.slot || "", rid, rItem);
        const stillActive = Number(r.expiresAt || 0) > startedAt;
        if (sameOwner && stillActive && rSlot && rSlot === slot && rid !== id) {
          r.muted = true;
          r.mutedAt = startedAt;
        }
        return r;
      });
      writeRuntimeShopTrialsRaw(rows);
    } catch (_) {}
    const runtimeRow = upsertRuntimeShopTrial(id, { startedAt, expiresAt, day: today, admin, muted: false, activatedAt: startedAt });
    markRuntimeShopTrialUse(id, today, admin);
    const ev = recordEvent("shop_trial", {
      metric: "shop_trial",
      itemId: id,
      itemTitle: item.title,
      category: item.category,
      slot,
      day: today,
      startedAt,
      expiresAt,
      durationMs: SHOP_TRIAL_DURATION_MS,
      trialVersion: SHOP_TRIAL_VERSION,
      admin,
      source: options.source || "shop_trial_timed"
    }, {
      metric: "shop_trial",
      id: `shop_trial:${accountKey() || getVisitorId()}:${id}:${admin ? startedAt : today}${admin ? ":admin" : ""}`,
      ts: startedAt,
      source: options.source || "shop_trial_timed"
    });

    try { upsertRuntimeShopTrial(id, Object.assign({}, runtimeRow || {}, { startedAt, expiresAt, day: today, admin, muted: false, activatedAt: startedAt, eventId: ev && ev.id || "" })); } catch (_) {}
    try { applyEquippedCosmetics(shopInventoryForCosmetics()); } catch (_) {}
    try {
      window.setTimeout(() => {
        try { applyEquippedCosmetics(shopInventoryForCosmetics()); } catch (_) {}
        try { window.dispatchEvent(new CustomEvent("mk-shop-trial-change", { detail: { itemId: id, expired: true, expiresAt } })); } catch (__) {}
      }, Math.max(1000, SHOP_TRIAL_DURATION_MS + 80));
    } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("mk-shop-trial-change", { detail: { itemId: id, expiresAt, admin, durationMs: SHOP_TRIAL_DURATION_MS, event: ev } })); } catch (_) {}
    return { ok: true, item: Object.assign({}, item), expiresAt, admin, durationMs: SHOP_TRIAL_DURATION_MS, event: ev };
  }

  function setShopTrialMuted(itemId, muted) {
    const id = String(itemId || "").trim();
    const item = SHOP_CATALOG[id];
    if (!item || !item.cosmetic || item.consumable) return { ok: false, error: "not_trialable" };
    const active = activeShopTrialItems(readFile()).filter((row) => String(row && row.itemId || "") === id);
    const row = active.sort((a, b) => Number(b.expiresAt || 0) - Number(a.expiresAt || 0))[0] || null;
    if (!row || Number(row.expiresAt || 0) <= Date.now()) return { ok: false, error: "no_active_trial" };
    const ok = setRuntimeShopTrialMuted(id, !!muted);
    if (!ok) {
      try { upsertRuntimeShopTrial(id, { startedAt: row.ts || Date.now(), expiresAt: row.expiresAt, day: row.day || dayKey(Date.now()), admin: !!row.admin, muted: !!muted, eventId: row.eventId || "" }); } catch (_) {}
    }
    try { applyEquippedCosmetics(shopInventoryForCosmetics()); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("mk-shop-trial-change", { detail: { itemId: id, muted: !!muted, expiresAt: row.expiresAt } })); } catch (_) {}
    return { ok: true, item: Object.assign({}, item), muted: !!muted, expiresAt: row.expiresAt };
  }

  function stopShopTrial(itemId) {
    const id = String(itemId || "").trim();
    const item = SHOP_CATALOG[id];
    if (!item || !item.cosmetic || item.consumable) return { ok: false, error: "not_trialable" };
    const ts = Date.now();
    try { stopRuntimeShopTrial(id); } catch (_) {}
    recordEvent("shop_trial_end", {
      metric: "shop_trial_end",
      itemId: id,
      itemTitle: item.title,
      category: item.category,
      slot: item.slot || "cosmetic",
      endedAt: ts,
      source: "shop_trial_manual_off"
    }, {
      metric: "shop_trial_end",
      id: `shop_trial_end:${accountKey() || getVisitorId()}:${id}:${ts}:manual`,
      ts,
      source: "shop_trial_manual_off"
    });
    try { clearPageShopTrialRecord("manual-preview-off"); } catch (_) {}
    try { applyEquippedCosmetics(shopInventoryForCosmetics()); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("mk-shop-trial-change", { detail: { itemId: id, ended: true } })); } catch (_) {}
    return { ok: true, item: Object.assign({}, item) };
  }


  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(ms || 0))));
  }
  function isRetryableFetchFailure(result) {
    if (!result || result.ok !== false) return false;
    if (result.timeout) return true;
    const msg = String(result.error || "").toLowerCase();
    if (/load failed|failed to fetch|network request failed|networkerror|internet connection|cancelled|canceled/.test(msg)) return true;
    const status = Number(result.status || 0);
    return status === 408 || status === 425 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
  }
  async function fetchJson(url, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const timeoutMs = Math.max(10000, Number(options.timeoutMs || 120000));
    const attempts = Math.max(1, Math.min(4, Math.floor(Number(options.attempts || 1) || 1)));
    const backoffMs = Math.max(120, Math.min(2500, Number(options.retryDelayMs || 450)));
    const fetchOptions = Object.assign({}, options);
    delete fetchOptions.timeoutMs;
    delete fetchOptions.attempts;
    delete fetchOptions.retryDelayMs;
    let last = null;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const baseOptions = {
          cache: attempt === 1 ? "no-store" : "no-cache",
          signal: controller.signal,
          headers: Object.assign({ Accept: "application/json" }, fetchOptions.headers || {})
        };
        const res = await fetch(url, Object.assign(baseOptions, fetchOptions));
        const text = await res.text().catch(() => "");
        let data = null;
        if (text) { try { data = JSON.parse(text); } catch (_) { data = null; } }
        if (!res.ok) {
          const msg = data && data.error ? data.error : (text ? text.slice(0, 180) : `HTTP ${res.status}`);
          last = Object.assign({ ok: false, error: `${msg} (${res.status})`, status: res.status, attempt }, data && typeof data === "object" ? data : {});
        } else {
          return data || { ok: false, error: `Empty response from server (${res.status})`, status: res.status, attempt };
        }
      } catch (err) {
        const timeout = err && err.name === "AbortError";
        last = {
          ok: false,
          error: timeout ? `Request timed out after ${Math.round(timeoutMs / 1000)}s` : (err && err.message || "Network request failed"),
          timeout,
          networkError: true,
          errorName: err && err.name || "",
          attempt
        };
      } finally { clearTimeout(timer); }
      if (attempt >= attempts || !isRetryableFetchFailure(last)) break;
      await delay(backoffMs * attempt);
    }
    if (last && typeof last === "object") {
      last.url = String(url || "");
      last.method = String((fetchOptions && fetchOptions.method) || "GET").toUpperCase();
      last.contentType = String(fetchOptions && fetchOptions.headers && (fetchOptions.headers["Content-Type"] || fetchOptions.headers["content-type"]) || "");
      last.attempts = attempts;
      last.timeoutMs = timeoutMs;
      last.online = typeof navigator !== "undefined" && "onLine" in navigator ? !!navigator.onLine : null;
    }
    return last || { ok: false, error: "Network request failed", url: String(url || "") };
  }

  function compactDiagnosticValue(value, maxLen) {
    const s = String(value == null ? "" : value);
    const n = Math.max(20, Number(maxLen || 160) || 160);
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  function purchaseFailureLine(label, value) {
    const v = value == null || value === "" ? "n/a" : value;
    return `${label}: ${v}`;
  }

  async function buildCloudPurchaseFailure(res, context) {
    const r = res && typeof res === "object" ? res : { ok: false, error: String(res || "unknown") };
    const c = context && typeof context === "object" ? context : {};
    let health = null;
    try {
      health = await fetchJson(`${API_BASE}/health?shopDiag=1&t=${Date.now()}`, {
        method: "GET",
        timeoutMs: 12000,
        attempts: 1,
        retryDelayMs: 300
      });
    } catch (err) {
      health = { ok: false, error: String(err && err.message || err || "health check failed") };
    }
    const healthOk = !!(health && health.ok !== false);
    const healthText = healthOk
      ? `ok${health.build ? `, build ${health.build}` : ""}`
      : `failed (${compactDiagnosticValue(health && health.error || "unknown", 180)})`;
    const lines = [
      "Cloud purchase diagnostic",
      purchaseFailureLine("Stage", c.stage || "purchase POST"),
      purchaseFailureLine("API", `${API_BASE}/identity/shop-purchase`),
      purchaseFailureLine("Item", c.itemId || ""),
      purchaseFailureLine("Price", c.price),
      purchaseFailureLine("POST error", compactDiagnosticValue(r.error || r.message || "unknown", 220)),
      purchaseFailureLine("HTTP status", r.status || ""),
      purchaseFailureLine("Network error", r.networkError === true ? "yes" : (r.networkError === false ? "no" : "unknown")),
      purchaseFailureLine("Timeout", r.timeout ? "yes" : "no"),
      purchaseFailureLine("Attempt", `${r.attempt || "?"}/${r.attempts || "?"}`),
      purchaseFailureLine("Request method", r.method || "POST"),
      purchaseFailureLine("Content-Type", r.contentType || "text/plain"),
      purchaseFailureLine("Browser online", r.online === null || r.online === undefined ? "unknown" : (r.online ? "yes" : "no")),
      purchaseFailureLine("Health check", healthText)
    ];
    const message = lines.join("\n");
    try { console.warn("[shop purchase failed]", { purchase: r, health, context: c }); } catch (_) {}
    try {
      localStorage.setItem("mk_shop_purchase_last_failure_v1", JSON.stringify({
        at: Date.now(),
        apiBase: API_BASE,
        context: c,
        purchase: r,
        health
      }).slice(0, 12000));
    } catch (_) {}
    return {
      ok: false,
      error: "cloud_purchase_failed",
      serverChecked: false,
      retryable: true,
      message,
      diagnostic: { purchase: r, health, context: c },
      healthOk,
      workerBuild: health && health.build || ""
    };
  }

  function readCloudEventUploadQueue() {
    try {
      const rows = readJson(LOCAL_CLOUD_EVENT_QUEUE_KEY, []);
      return (Array.isArray(rows) ? rows : []).filter((x) => x && typeof x === "object" && x.id);
    } catch (_) { return []; }
  }

  function writeCloudEventUploadQueue(rows) {
    const clean = (Array.isArray(rows) ? rows : []).filter((x) => x && typeof x === "object" && x.id).slice(-500);
    try {
      if (!clean.length) localStorage.removeItem(LOCAL_CLOUD_EVENT_QUEUE_KEY);
      else localStorage.setItem(LOCAL_CLOUD_EVENT_QUEUE_KEY, JSON.stringify(clean));
      return true;
    } catch (_) { return false; }
  }

  function eventShouldUploadImmediately(ev) {
    const e = ev && typeof ev === "object" ? ev : {};
    const metric = String(e.metric || e.type || "").trim();
    if (!metric) return false;
    if (XP_RULES[metric]) return true;
    if (isShopCurrencyEvent(e)) return true;
    if (/^(shop_|eorbits_|currency_)/i.test(metric)) return true;
    return false;
  }

  function queueCloudEventUpload(ev, opts) {
    const e = ev && typeof ev === "object" ? ev : null;
    if (!e || !e.id || !accountKey() || !eventShouldUploadImmediately(e)) return false;
    const d = e.details && typeof e.details === "object" ? e.details : {};
    if (d.cloudConfirmed || d.serverConfirmed || d.noCloudUpload) return false;
    const rows = readCloudEventUploadQueue();
    const id = String(e.id || "");
    const filtered = rows.filter((x) => String(x && x.id || "") !== id);
    filtered.push(Object.assign({}, e, {
      accountKey: accountKey(),
      queuedAt: Date.now(),
      uploadReason: String(opts && opts.reason || e.metric || e.type || "event")
    }));
    writeCloudEventUploadQueue(filtered);
    scheduleCloudEventUploadFlush(opts && opts.delayMs);
    return true;
  }

  let cloudEventUploadTimer = 0;
  let cloudEventUploadPromise = null;

  function scheduleCloudEventUploadFlush(delayMs) {
    if (!accountKey()) return false;
    if (cloudEventUploadTimer) return true;
    const delay = Math.max(400, Math.min(12000, Number(delayMs == null ? 1800 : delayMs) || 1800));
    cloudEventUploadTimer = window.setTimeout(() => {
      cloudEventUploadTimer = 0;
      flushCloudEventUploadQueue({ reason: "scheduled-event-upload" }).catch(() => {});
    }, delay);
    return true;
  }

  function markCloudEventsUploaded(ids) {
    const set = new Set((Array.isArray(ids) ? ids : []).map((x) => String(x || "")).filter(Boolean));
    if (!set.size) return;
    writeCloudEventUploadQueue(readCloudEventUploadQueue().filter((x) => !set.has(String(x && x.id || ""))));
  }

  function applyCloudShopState(state) {
    const st = state && typeof state === "object" ? state : null;
    if (!st) return false;
    if (st.score) rememberSyncedCloudScore(st.score, { currencyAuthoritative: true });
    const events = Array.isArray(st.events) ? st.events : [];
    let changed = false;
    if (events.length) {
      try {
        const merged = mergeFiles(readFile(), { eventLog: events });
        const rebuilt = rebuildScoreStateFromFile(merged, { source: "cloud-shop-state" });
        const saved = writeFile(fileWithScoreState(merged, rebuilt), { source: "cloud-shop-state", skipMirrors: false });
        if (saved && saved.scoreState) {
          writeScoreStateSidecar(saved.scoreState);
          publishScoreStateChange(saved.scoreState, "cloud-shop-state", null);
        }
        changed = true;
      } catch (_) {}
    }
    try {
      const inv = shopInventoryFromFile(readFile());
      writeShopInventoryLightCache(inv);
      applyEquippedCosmetics(inv);
      window.dispatchEvent(new CustomEvent("mk-shop-inventory-change", { detail: { source: "cloud-shop-state", shopState: st } }));
    } catch (_) {}
    return changed;
  }

  function applyCloudEventUploadResult(res) {
    try {
      if (res && res.shopState) applyCloudShopState(res.shopState);
      if (res && res.score) rememberSyncedCloudScore(res.score, { currencyAuthoritative: true });
      if (res && res.scoreState && typeof res.scoreState === "object") {
        writeScoreStateSidecar(res.scoreState);
        publishScoreStateChange(res.scoreState, "cloud-event-upload", null);
      }
    } catch (_) {}
  }

  async function flushCloudEventUploadQueue(opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    if (cloudEventUploadPromise && !options.force) return cloudEventUploadPromise;
    if (!accountKey()) return { ok: false, error: "missing_account" };
    const run = async () => {
      const rows = readCloudEventUploadQueue();
      if (!rows.length) return { ok: true, uploaded: 0, skipped: true };
      const batchSize = isMobilePowerSensitiveClient() ? 20 : 60;
      const batch = rows.slice(0, batchSize);
      const res = await fetchJson(`${API_BASE}/identity/account-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: getVisitorId(),
          accountKey: accountKey(),
          deviceName: getDeviceName(),
          reason: options.reason || "event-upload",
          responseMode: "summary",
          events: batch
        }),
        timeoutMs: options.timeoutMs || (isMobilePowerSensitiveClient() ? 45000 : 60000),
        attempts: options.attempts || 2,
        retryDelayMs: 700
      });
      if (res && res.ok !== false) {
        const acceptedIds = Array.isArray(res.acceptedIds) && res.acceptedIds.length ? res.acceptedIds : batch.map((x) => x && x.id);
        markCloudEventsUploaded(acceptedIds);
        applyCloudEventUploadResult(res);
        if (readCloudEventUploadQueue().length) scheduleCloudEventUploadFlush(300);
        return Object.assign({ uploaded: acceptedIds.length }, res);
      }
      scheduleCloudEventUploadFlush(isRetryableFetchFailure(res) ? 10000 : 30000);
      return res || { ok: false, error: "event_upload_failed" };
    };
    cloudEventUploadPromise = run().finally(() => { cloudEventUploadPromise = null; });
    return cloudEventUploadPromise;
  }

  async function syncShopStateNow(opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const ak = accountKey();
    if (!ak) return { ok: false, error: "missing_account" };
    const res = await fetchJson(`${API_BASE}/identity/shop-state?visitorId=${encodeURIComponent(getVisitorId())}&accountKey=${encodeURIComponent(ak)}&deviceName=${encodeURIComponent(getDeviceName())}&t=${Date.now()}`, {
      timeoutMs: options.timeoutMs || 30000,
      attempts: options.attempts || 2,
      retryDelayMs: 500
    });
    if (res && res.ok !== false && res.shopState) applyCloudShopState(res.shopState);
    return res;
  }

  let shopStateSyncTimer = 0;
  function requestShopStateSync(reason) {
    if (!accountKey()) return false;
    if (shopStateSyncTimer) return true;
    shopStateSyncTimer = window.setTimeout(() => {
      shopStateSyncTimer = 0;
      syncShopStateNow({ reason: reason || "shop-state" }).catch(() => {});
    }, 250);
    return true;
  }

  function localShopPurchaseEvent(id, item, pricing, ts, opts, flags) {
    const price = Math.max(0, Number(pricing && pricing.final || item && item.price || 0) || 0);
    return normaliseEvent({
      id: item && item.consumable ? `shop_purchase:${accountKey() || getVisitorId()}:${id}:${ts}:${Math.random().toString(36).slice(2,8)}` : `shop_purchase:${accountKey() || getVisitorId()}:${id}`,
      type: "shop_purchase",
      metric: "shop_purchase",
      count: 1,
      ts,
      createdAt: ts,
      updatedAt: ts,
      deviceId: getDeviceId(),
      deviceName: getDeviceName(),
      visitorId: getVisitorId(),
      accountKey: accountKey(),
      value: price,
      details: Object.assign({
        metric: "shop_purchase",
        itemId: id,
        itemTitle: item && item.title || id,
        category: item && item.category || "",
        cost: price,
        price,
        amount: price,
        value: price,
        basePrice: pricing && pricing.base,
        dynamicPrice: pricing && pricing.dynamic,
        discountPercent: pricing && pricing.discountPercent,
        priceMultiplier: pricing && pricing.multiplier,
        currency: LEARNING_CURRENCY_NAME,
        giftable: !!(item && item.giftable),
        source: opts && opts.source || "shop"
      }, flags && typeof flags === "object" ? flags : {})
    });
  }

  async function purchaseShopItemViaCloud(id, item, pricing, opts) {
    await flushCloudEventUploadQueue({ reason: "shop-purchase-preflight", force: true, timeoutMs: 45000, attempts: 2 }).catch(() => null);
    const ts = now();
    const ev = localShopPurchaseEvent(id, item, pricing, ts, opts || {}, { serverFirst: true });
    const price = Math.max(0, Number(pricing && pricing.final || item && item.price || 0) || 0);
    // Sent only as diagnostics/back-compat. The Worker is cloud-authoritative:
    // it checks the latest cloud ledger and ignores this value for affordability.
    let clientBalance = 0;
    try {
      const cs = xpFromFile(readFile());
      clientBalance = Math.max(0, Number(cs && (cs.currencyBalance != null ? cs.currencyBalance : cs.eorbits) || 0) || 0);
    } catch (_) { clientBalance = 0; }
    const requestBody = {
      visitorId: getVisitorId(),
      accountKey: accountKey(),
      deviceName: getDeviceName(),
      itemId: id,
      price,
      basePrice: pricing && pricing.base,
      dynamicPrice: pricing && pricing.dynamic,
      discountPercent: pricing && pricing.discountPercent,
      priceMultiplier: pricing && pricing.multiplier,
      consumable: !!(item && item.consumable),
      clientBalance,
      source: opts && opts.source || "shop"
    };
    const postPurchase = (path, timeoutMs, attempts, retryDelayMs) => fetchJson(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(requestBody),
      timeoutMs,
      attempts,
      retryDelayMs
    });
    let res = await postPurchase("/identity/shop-purchase", isMobilePowerSensitiveClient() ? 60000 : 45000, 2, 700);
    if (res && res.ok === false && res.error === "purchase_busy" && res.retryable) {
      await delay(1800);
      res = await postPurchase("/identity/shop-purchase", isMobilePowerSensitiveClient() ? 70000 : 55000, 2, 1000);
    }
    const identityNetworkFailed = res && res.ok === false && (res.networkError || /failed to fetch|load failed|network request failed|request timed out/i.test(String(res.error || "")));
    if (identityNetworkFailed) {
      const fallback = await postPurchase("/v2/shop/purchase", isMobilePowerSensitiveClient() ? 60000 : 45000, 2, 900);
      if (fallback && fallback.ok !== false) {
        res = Object.assign({ fallbackPath: "/v2/shop/purchase", shopState: fallback.shopState || null }, fallback);
      } else if (fallback && fallback.ok === false && !fallback.networkError) {
        res = Object.assign({ fallbackPath: "/v2/shop/purchase" }, fallback);
      } else if (fallback && fallback.ok === false) {
        res = Object.assign({ fallbackPath: "/v2/shop/purchase", identityFailure: res }, fallback);
      }
    }
    if (!res || res.ok === false) {
      const failed = Object.assign({ ok: false, item: Object.assign({}, item), price }, res || {});
      if (failed.networkError || /failed to fetch|load failed|network request failed|request timed out/i.test(String(failed.error || ""))) {
        return buildCloudPurchaseFailure(failed, {
          stage: failed.timeout ? "purchase POST timeout" : "purchase POST fetch",
          itemId: id,
          itemTitle: item && item.title || id,
          price,
          accountKey: accountKey(),
          visitorId: getVisitorId()
        });
      }
      failed.serverChecked = true;
      return failed;
    }
    if (res.score || res.state) rememberSyncedCloudScore(res.score || res.state, { currencyAuthoritative: true });
    if (res.shopState) applyCloudShopState(res.shopState);
    if (res.alreadyOwned) {
      const inv = shopInventoryFromFile(readFile());
      return { ok: true, alreadyOwned: true, serverChecked: true, item: Object.assign({}, item), inventory: inv, score: scoreStateToXp(bestScoreStateForFile(readFile(), { allowCompute: false }) || emptyScoreState(), readFile()), cloud: res };
    }
    const serverEv = normaliseEvent(Object.assign({}, ev, res.event && typeof res.event === "object" ? res.event : {}, {
      details: Object.assign({}, ev.details || {}, res.event && res.event.details && typeof res.event.details === "object" ? res.event.details : {}, { cloudConfirmed: true, serverConfirmed: true })
    })) || ev;
    recordEvent("shop_purchase", Object.assign({}, serverEv.details || {}, {
      metric: "shop_purchase",
      itemId: id,
      itemTitle: item && item.title || id,
      category: item && item.category || "",
      cost: price,
      price,
      amount: price,
      value: price,
      currency: LEARNING_CURRENCY_NAME,
      source: opts && opts.source || "shop"
    }), {
      metric: "shop_purchase",
      id: serverEv.id || ev.id,
      ts: Number(serverEv.ts || ev.ts || Date.now()),
      value: price,
      source: opts && opts.source || "shop",
      noCloudUpload: true
    });
    markCloudEventsUploaded([serverEv.id || ev.id]);
    let equipResult = null;
    if (!(item && item.consumable) && item && item.slot && !(opts && opts.noAutoEquip)) {
      try {
        equipResult = await equipShopItem(id, { source: opts && opts.source || "shop", slot: item.slot, autoEquipAfterPurchase: true });
      } catch (_) { equipResult = null; }
    }
    const freshFile = readFile();
    const fresh = scoreStateToXp(bestScoreStateForFile(freshFile, { allowCompute: false }) || emptyScoreState(), freshFile);
    const inv = shopInventoryFromFile(freshFile);
    writeShopInventoryLightCache(inv);
    try { window.dispatchEvent(new CustomEvent("mk-shop-inventory-change", { detail: { itemId: id, source: opts && opts.source || "shop", serverChecked: true, autoEquipped: !!(equipResult && equipResult.ok !== false) } })); } catch (_) {}
    return { ok: true, purchased: true, serverChecked: true, event: serverEv, item: Object.assign({}, item), inventory: inv, score: fresh, cloud: res, autoEquipped: !!(equipResult && equipResult.ok !== false), equipResult };
  }

  function chunksOf(text, size) {
    const s = String(text || "");
    const out = [];
    for (let i = 0; i < s.length; i += size) out.push(s.slice(i, i + size));
    return out.length ? out : [""];
  }
  // Split an ARRAY into batches of `size` ELEMENTS. The diff-append upload used
  // the string chunker above on the missing-events ARRAY, so String(array) made
  // "[object Object],[object Object],..." and each "batch" was a 120-CHARACTER
  // substring rather than 120 events. The server then saw a string (not event
  // objects) and replied "No events to append.", which aborted Step 4 of every
  // sync. That is why no device ever uploaded its diff and cloud/devices stayed
  // divergent with wrong XP/EORbits.
  function chunkArray(arr, size) {
    const a = Array.isArray(arr) ? arr : [];
    const n = Math.max(1, Math.floor(Number(size) || 1));
    const out = [];
    for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n));
    return out;
  }
  let syncPromise = null;

  function cachedLocalStatsForDisplay() {
    const empty = { total: 0, stores: {} };
    // Prefer the ACTUAL current local file. The cached sync-summary afterLocal kept the
    // panel's DEVICE count frozen at an old, larger value even after resetToCloud / a
    // cloud-adopt shrank the real file (the user saw "DEVICE 4974" while the file was
    // 2309). The account is now small (browsing events are aggregated), so reading the
    // real stats here is cheap and keeps the panel honest instead of showing stale cache.
    // Use the live readFile() directly (NOT statsForCurrentLocalFile, which goes through
    // a memoised deriveCurrentState that stayed frozen at the old 4974 while readFile()
    // already returns the aggregated 2309).
    try {
      const live = statsForFile(readFile());
      const liveCount = Number(live && (live.total || (live.stores && live.stores.eventLog) || 0)) || 0;
      if (liveCount > 0) return live;
    } catch (_) {}
    const currentAk = String(accountKey() || "").trim().toLowerCase();
    // Pick the MOST RECENT summary's afterLocal, NOT the max across history. Taking
    // the max froze the device count at the largest value ever seen, so after the
    // device adopts a smaller cloud (cloud-authoritative, discarding local-only old
    // rows) the panel kept showing the old inflated count forever.
    let best = null;
    let bestAt = -1;
    const consider = (summary) => {
      if (!summary || typeof summary !== "object") return;
      const key = String(summary.accountKey || "").trim().toLowerCase();
      if (currentAk && key && key !== currentAk) return;
      const stats = summary.afterLocal;
      if (!stats || typeof stats !== "object") return;
      const at = Number(summary.finishedAt || summary.updatedAt || 0) || 0;
      if (at >= bestAt) { bestAt = at; best = stats; }
    };
    try { consider(readJson(LOCAL_SYNC_SUMMARY_KEY, null)); } catch (_) {}
    try { const raw = localStorage.getItem(ACCOUNT_SYNC_LAST_RESULT_KEY) || sessionStorage.getItem(ACCOUNT_SYNC_LAST_RESULT_KEY); consider(raw ? JSON.parse(raw) : null); } catch (_) {}
    try { const raw = localStorage.getItem(ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY) || sessionStorage.getItem(ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY); consider(raw ? JSON.parse(raw) : null); } catch (_) {}
    try { const raw = localStorage.getItem(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY) || sessionStorage.getItem(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY); consider(raw ? JSON.parse(raw) : null); } catch (_) {}
    return best || empty;
  }

  async function refreshCloudStatus(options) {
    const opts = options && typeof options === "object" ? options : {};
    const ak = accountKey();
    if (!ak) return { ok: false, error: "Connect or save a username first." };
    const lightStatus = !!(opts.lightStatus || opts.cloudCountOnly || opts.countOnly || opts.displayOnly);
    const localFile = lightStatus ? null : readFile();
    const localStats = lightStatus ? cachedLocalStatsForDisplay() : statsForFile(localFile);
    const localFingerprint = lightStatus ? null : fileFingerprint(localFile);
    const params = {
      visitorId: getVisitorId(),
      accountKey: ak,
      deviceName: getDeviceName(),
      statsOnly: "1",
      verify: lightStatus ? "0" : "1",
      t: Date.now(),
      r: Math.random().toString(36).slice(2)
    };
    if (lightStatus) {
      params.chunked = "1";
      params.meta = "1";
      params.countOnly = "1";
    }
    const url = `${API_BASE}/identity/account-file-sync?${Object.keys(params).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join("&")}`;
    const res = await fetchJson(url, { timeoutMs: Math.max(10000, Number(opts.timeoutMs || (lightStatus ? 30000 : 60000))), attempts: Math.max(1, Number(opts.attempts || (lightStatus ? 1 : 2)) || 1), retryDelayMs: 650 });
    if (!res || res.ok === false) {
      const err = res && res.error || "Could not read cloud account status.";
      const cachedSummary = confirmedCloudSummaryFallback(err);
      return { ok: false, error: err, cachedSummary, localStats, localFingerprint };
    }
    const serverAccountKey = String(res.accountKey || "").trim();
    if (serverAccountKey && ak && serverAccountKey.toLowerCase() !== String(ak).toLowerCase()) {
      return { ok: false, error: `This device is linked to ${serverAccountKey}, but the local profile says ${ak}.`, localStats, localFingerprint };
    }
    const cloudStats = res.stats && typeof res.stats === "object" ? res.stats : { total: 0, stores: {} };
    const cloudFingerprint = res.fingerprint && typeof res.fingerprint === "object" ? res.fingerprint : { eventCount: Math.max(0, Number(res.eventCount || cloudStats && cloudStats.stores && cloudStats.stores.eventLog || 0)), hash: "" };
    // The light status endpoint cannot download the cloud file, so it can only
    // compare the client's content fingerprint with the server's. Their full hashes
    // legitimately differ (the score-state fingerprint text format differs between
    // client and server), so rely on the CONTENT event identity instead: equal
    // content eventHash, or — once both sides compute the same content-based count —
    // equal eventCount, means this device is in sync with the cloud (it adopted it).
    const cloudEv = Number(cloudFingerprint && cloudFingerprint.eventCount || 0);
    const localEv = Number(localFingerprint && localFingerprint.eventCount || 0);
    const contentEventHashMatch = !!(localFingerprint && cloudFingerprint && localFingerprint.eventHash && cloudFingerprint.eventHash && String(localFingerprint.eventHash) === String(cloudFingerprint.eventHash));
    const contentCountMatch = cloudEv > 0 && localEv === cloudEv;
    // "Has the cloud changed since this device adopted it?" — robust even when the
    // device keeps only a compact subset locally (local count < cloud count).
    let syncedToCloud = false;
    try {
      const adopted = JSON.parse(localStorage.getItem("mk_account_synced_cloud_fp_v1") || "null");
      syncedToCloud = !!(adopted && cloudEv > 0 && Number(adopted.eventCount || -1) === cloudEv);
    } catch (_) {}
    const exact = !lightStatus && (fingerprintsEqual(localFingerprint, cloudFingerprint) || contentEventHashMatch || contentCountMatch || syncedToCloud);
    const summary = {
      ok: true,
      schema: exact ? "mk-account-data-sync-summary" : "mk-account-cloud-display-summary",
      cloudDisplayOnly: lightStatus || !exact,
      cloudCountOnly: lightStatus,
      deviceName: getDeviceName(),
      accountKey: ak,
      uploaded: { total: 0, stores: {} },
      downloaded: { total: 0, stores: {} },
      afterLocal: localStats,
      server: {
        after: cloudStats,
        reportedAfter: cloudStats,
        verifiedAfter: cloudStats,
        displayOnly: lightStatus || !exact,
        statsOnly: true,
        metadataOnly: lightStatus,
        localCloudExact: exact,
        localFingerprint,
        cloudFingerprint,
        difference: {
          localOnly: exact ? 0 : null,
          cloudOnly: exact ? 0 : null,
          localEvents: localFingerprint ? (localFingerprint.eventCount || 0) : Math.max(0, Number(localStats && localStats.stores && localStats.stores.eventLog || 0)),
          cloudEvents: cloudFingerprint.eventCount || 0
        },
        updatedAt: res.updatedAt || Date.now(),
        chunkCount: res.chunkCount || 0,
        seededFromCanonical: !!res.seededFromCanonical,
        seedSource: res.seedSource || ""
      },
      updatedAt: Date.now(),
      finishedAt: exact ? Date.now() : 0,
      statusReason: opts.reason || "cloud-status-refresh"
    };
    if (exact || opts.writeDisplaySummary) writeSyncSummaryEverywhere(summary);
    return { ok: true, exact, summary, localStats, cloudStats, localFingerprint, cloudFingerprint, raw: res };
  }

  function persistFileForSync(file, source, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const intended = normaliseFile(file || emptyFile());
    const intendedFp = fileFingerprint(intended);

    // First try an exact local save without allowing writeFile() to compact the
    // data behind our back. On some mobile browsers, the full cloud+local event
    // union is larger than the available localStorage budget. In that case the
    // cloud file can still remain canonical, but the device must keep a compact
    // cache instead of failing the whole sync at Step 3.
    intended.updatedAt = now();
    reclaimAccountStorageSpace(source || "sync-exact-save", { aggressive: true });
    if (writeJson(LOCAL_FILE_KEY, intended)) {
      try { if (!(options && options.skipMirrors)) applyLegacyMirrors(intended); } catch (_) {}
      try { applyEquippedCosmetics(shopInventoryFromFile(intended)); } catch (_) {}
      const persisted = readFile();
      const persistedFp = fileFingerprint(persisted);
      if (fingerprintsEqual(intendedFp, persistedFp)) {
        try { window.dispatchEvent(new CustomEvent("mk-account-data-changed", { detail: { source: source || "sync-exact-save", stats: statsForFile(persisted), persisted: true, exact: true } })); } catch (_) {}
        try { window.dispatchEvent(new CustomEvent("mk-local-activity-change", { detail: { type: "account-data", source: source || "sync-exact-save", persisted: true, exact: true } })); } catch (_) {}
        return { ok: true, exact: true, file: persisted, intended, diff: { localOnly: 0, cloudOnly: 0 }, compactMode: "exact" };
      }
    }

    const beforeCompact = readFile();
    const beforeDiff = fileDifference(beforeCompact, intended);
    if (!options.allowCompacted) {
      throw new Error(`Local account file could not be saved completely. Missing after save: ${beforeDiff.cloudOnly}; extra after save: ${beforeDiff.localOnly}. This is usually a browser storage/quota problem.`);
    }

    let compacted = intended;
    const modes = options.compactModes || ["standard", "mobile", "critical", "lean", "tiny", "emergency"];
    for (const mode of modes) {
      compacted = compactFileForStorage(intended, mode);
      reclaimAccountStorageSpace(`${source || "sync-compact-save"}:${mode}`, { aggressive: mode === "lean" || mode === "tiny" || mode === "emergency" });
      if (writeJson(LOCAL_FILE_KEY, compacted)) {
        try { if (!(options && options.skipMirrors)) { if (mode === "standard" || mode === "mobile") applyLegacyMirrors(compacted); else reclaimAccountStorageSpace(`${source || "sync-compact-save"}:skip-legacy-mirrors`, { aggressive: true }); } } catch (_) {}
        try { applyEquippedCosmetics(shopInventoryFromFile(compacted)); } catch (_) {}
        const persisted = readFile();
        const persistedFp = fileFingerprint(persisted);
        const diff = fileDifference(persisted, intended);
        try {
          window.dispatchEvent(new CustomEvent("mk-account-data-changed", { detail: {
            source: source || "sync-compact-save",
            stats: statsForFile(persisted),
            persisted: true,
            exact: false,
            compactMode: mode,
            missingAfterSave: diff.cloudOnly,
            extraAfterSave: diff.localOnly,
            intendedEventCount: intendedFp.eventCount,
            persistedEventCount: persistedFp.eventCount
          } }));
        } catch (_) {}
        try { window.dispatchEvent(new CustomEvent("mk-local-activity-change", { detail: { type: "account-data", source: source || "sync-compact-save", persisted: true, exact: false, compactMode: mode } })); } catch (_) {}
        return { ok: true, exact: false, file: persisted, intended, diff, compactMode: mode, intendedFingerprint: intendedFp, persistedFingerprint: persistedFp };
      }
    }

    try { window.dispatchEvent(new CustomEvent("mk-storage-write-problem", { detail: { key: LOCAL_FILE_KEY, source: source || "sync-compact-save", stats: statsForFile(compacted), approxBytes: localStorageApproxBytes() } })); } catch (_) {}
    throw new Error(`Local account file could not be saved even after compacting. This is a browser storage/quota problem.`);
  }

  function persistFileExactly(file, source) {
    const result = persistFileForSync(file, source || "persist-exact", { allowCompacted: false });
    return result.file;
  }

  async function syncNow(opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    if (syncPromise && !options.force) return syncPromise;
    const startedAt = now();
    const ak = accountKey();
    const onProgress = typeof options.onProgress === "function" ? options.onProgress : null;
    const PROGRESS_TOTAL = 7;
    let lastProgress = { step: 0, total: PROGRESS_TOTAL, label: "Not started", extra: "", at: startedAt, elapsedMs: 0 };
    const progressHistory = [];
    const report = (step, label, extra, meta) => {
      const rawStep = Number(step || 1);
      const nextStep = Math.max(lastProgress.step || 0, Math.max(1, Math.min(PROGRESS_TOTAL, rawStep)));
      const item = Object.assign({}, meta && typeof meta === "object" ? meta : {}, {
        step: nextStep,
        total: PROGRESS_TOTAL,
        label: String(label || "Syncing account data"),
        extra: extra ? String(extra) : "",
        at: Date.now(),
        elapsedMs: Date.now() - startedAt
      });
      item.text = `Step ${item.step}/${item.total} · ${item.label}${item.extra ? ` · ${item.extra}` : ""}`;
      lastProgress = item;
      progressHistory.push(item);
      if (progressHistory.length > 30) progressHistory.splice(0, progressHistory.length - 30);
      try { window.dispatchEvent(new CustomEvent("mk-account-sync-progress", { detail: item })); } catch (_) {}
      if (onProgress) {
        try { onProgress(Object.assign({}, item, { history: progressHistory.slice(-12) })); } catch (_) {}
      }
      return item;
    };
    if (!ak) return { ok: false, error: "Connect or save a username first." };
    try { flushPendingEventsToFile("before-sync-preflight", { skipMirrors: true }); } catch (_) {}
    if (!options.force && options.preflight !== false) {
      try {
        const status = await refreshCloudStatus({ reason: options.reason || "auto-preflight", timeoutMs: Math.max(15000, Number(options.timeoutMs || 45000) || 45000), writeDisplaySummary: true });
        if (status && status.ok && status.exact && status.summary) {
          const skipped = Object.assign({ ok: true, skippedFullSync: true, syncedAt: status.summary.finishedAt || Date.now() }, status.summary);
          try { window.dispatchEvent(new CustomEvent("mk-account-sync-complete", { detail: skipped })); } catch (_) {}
          return skipped;
        }
      } catch (_) {}
    }

    syncPromise = (async () => {
      report(1, "Preparing local account file", getDeviceName());
      const legacyImport = importLegacyStoresOnce("before-sync");
      if (legacyImport && legacyImport.ok === false) throw new Error("Legacy account data import failed before sync.");
      drainPendingXpActivityQueue("before-sync");
      flushPendingEventsToFile("before-sync", { allowRebuild: true });
      let beforeLocal = statsForFile(readFile());
      let beforeCloud = { total: 0, stores: {} };
      let lastUpload = null;
      let lastDownload = null;
      let finalCloudFile = null;
      let finalLocalFile = null;
      let finalDiff = null;
      let finalCloudFingerprint = null;
      let finalLocalSaveInfo = null;
      let finalLocalWasCompacted = false;
      let syncCanonicalFile = null;
      let pendingUploadFingerprint = null;
      let pendingUploadStats = null;
      let pendingUploadFile = null;

      function accountFileSyncUrl(params) {
        const q = Object.assign({
          visitorId: getVisitorId(),
          accountKey: ak,
          deviceName: getDeviceName(),
          verify: "1",
          t: Date.now(),
          r: Math.random().toString(36).slice(2)
        }, params || {});
        return `${API_BASE}/identity/account-file-sync?${Object.keys(q).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`).join("&")}`;
      }

      function validateDownloadedAccountFileResponse(res, label, step, sourceMeta) {
        if (!res || res.ok === false) throw new Error(res && res.error || "Could not download cloud account file.");
        const serverAccountKey = String(res.accountKey || "").trim();
        if (serverAccountKey && ak && serverAccountKey.toLowerCase() !== String(ak).toLowerCase()) {
          throw new Error(`This device is linked to ${serverAccountKey}, but the local profile says ${ak}. Please reconnect the account before syncing.`);
        }
        const cloudFile = res.file && typeof res.file === "object" ? res.file : emptyFile();
        const stats = res.stats && typeof res.stats === "object" ? res.stats : statsForFile(cloudFile);
        // Always recompute the cloud fingerprint locally (content-based). The server
        // fingerprint is id-based and a different algorithm, so trusting it would make
        // a content-equal device look "different" and never converge.
        const fp = fileFingerprint(cloudFile);
        report(step || 2, `${label || "Downloaded cloud account file"} done`, `${Number(stats.stores && stats.stores.eventLog || fp.eventCount || 0)} cloud events`, Object.assign({}, sourceMeta || {}, { cloudStats: stats, eventCount: fp.eventCount, fingerprint: fp }));
        return Object.assign({}, res, { file: cloudFile, stats, fingerprint: fp });
      }

      async function downloadCloudInChunks(label, step, meta, originalError) {
        const extra = originalError ? `chunk fallback after ${String(originalError).slice(0, 80)}` : "chunk fallback";
        report(step || 2, label || "Downloading cloud account file", extra, Object.assign({}, meta || {}, { chunkedDownload: true }));
        const status = await fetchJson(accountFileSyncUrl({ statsOnly: "1", chunked: "1", meta: "1" }), { timeoutMs: 60000, attempts: 3, retryDelayMs: 550 });
        if (!status || status.ok === false) throw new Error(status && status.error || `Could not read cloud account file status after ${originalError || "download failure"}.`);
        const serverAccountKey = String(status.accountKey || "").trim();
        if (serverAccountKey && ak && serverAccountKey.toLowerCase() !== String(ak).toLowerCase()) {
          throw new Error(`This device is linked to ${serverAccountKey}, but the local profile says ${ak}. Please reconnect the account before syncing.`);
        }
        if (status.incomplete) {
          throw new Error(status.error || `Cloud account file is incomplete on the server. Expected ${Number(status.expectedChunkCount || 0) || "?"} chunks, found ${Number(status.chunkCount || 0) || 0}.`);
        }
        const chunkCount = Math.max(0, Math.floor(Number(status.chunkCount || status.sourceChunkCount || 0) || 0));
        if (!chunkCount) {
          return validateDownloadedAccountFileResponse(Object.assign({}, status, { file: emptyFile() }), label, step, { chunkedDownload: true, emptyCloudFile: true });
        }
        let text = "";
        const requestedSnapshotId = String(status.snapshotId || "").trim();
        const chunkSnapshotIds = new Set();
        async function fetchCloudChunk(index) {
          let lastChunkError = null;
          const maxPasses = Math.max(4, Math.min(10, Number(opts.chunkPasses || 7) || 7));
          for (let pass = 1; pass <= maxPasses; pass += 1) {
            report(step || 2, label || "Downloading cloud account file", `chunk ${index + 1}/${chunkCount}${pass > 1 ? ` · retry ${pass}/${maxPasses}` : ""}`, Object.assign({}, meta || {}, { chunkedDownload: true, chunkIndex: index + 1, chunkCount, chunkRetry: pass, snapshotId: requestedSnapshotId || undefined }));
            const part = await fetchJson(accountFileSyncUrl(Object.assign({ chunkIndex: index, chunked: "1", chunkAttempt: pass }, requestedSnapshotId ? { snapshotId: requestedSnapshotId } : {})), { timeoutMs: 90000, attempts: 2, retryDelayMs: 750 });
            if (part && part.ok !== false) {
              const returnedIndex = Number(part.chunkIndex || 0);
              if (returnedIndex !== index) {
                lastChunkError = `Cloud account file chunk order mismatch at ${index + 1}/${chunkCount}.`;
              } else if (part.chunk === undefined && part.data === undefined) {
                lastChunkError = "chunked endpoint unsupported";
                break;
              } else {
                const sid = String(part.snapshotId || "").trim();
                if (requestedSnapshotId && sid && sid !== requestedSnapshotId) {
                  lastChunkError = "Cloud account file changed while downloading; retrying the pinned snapshot.";
                } else {
                  if (sid) chunkSnapshotIds.add(sid);
                  return String(part.chunk || part.data || "");
                }
              }
            } else {
              lastChunkError = part && part.error || `Could not download cloud account file chunk ${index + 1}/${chunkCount}.`;
              const status = Number(part && part.status || 0);
              if (status === 401 || status === 403 || status === 404 || status === 409) break;
            }
            await delay(Math.min(8000, 450 * pass + Math.random() * 350));
          }
          throw new Error(String(lastChunkError || `Could not download cloud account file chunk ${index + 1}/${chunkCount}.`));
        }
        for (let i = 0; i < chunkCount; i += 1) {
          text += await fetchCloudChunk(i);
        }
        if (chunkSnapshotIds.size > 1) throw new Error("Cloud account file changed while downloading. Please try Sync again.");
        let parsed = null;
        try { parsed = JSON.parse(text || "{}"); } catch (err) { throw new Error(`Downloaded cloud account file chunks could not be parsed: ${err && err.message || err}`); }
        const cloudFile = normaliseFile(parsed || emptyFile());
        // Content-based fingerprint from the actual downloaded chunks; never trust the
        // server's (id-based) status fingerprint for the convergence decision.
        let fp = fileFingerprint(cloudFile);
        const localFp = fileFingerprint(cloudFile);
        let recoveredFingerprintMismatch = false;
        if (fp && fp.hash && localFp.hash && fp.hash !== localFp.hash && fingerprintsCompatibleForStrictCompare(fp, localFp)) {
          // The status endpoint is metadata-only and can occasionally return a
          // stale stored fingerprint while the pinned snapshot chunks are already
          // the newer source of truth.  A single-snapshot, parseable chunk set is
          // safer than failing sync and leaving the device unable to repair its
          // local scoreState.  Keep the local fingerprint derived from the actual
          // downloaded chunks and let the merged upload refresh server metadata.
          recoveredFingerprintMismatch = true;
          fp = Object.assign({}, localFp, { recoveredFromStaleServerFingerprint: true, serverFingerprintHash: fp.hash || "", serverScoreStateHash: fp.scoreStateHash || "" });
        }
        const statusStats = status.stats && typeof status.stats === "object" ? status.stats : null;
        const statusEventCount = Number(statusStats && statusStats.stores && statusStats.stores.eventLog || 0) || 0;
        const stats = status.fastMeta || !statusEventCount ? statsForFile(cloudFile) : statusStats;
        return validateDownloadedAccountFileResponse(Object.assign({}, status, { file: cloudFile, stats, fingerprint: fp, chunkedDownload: true, recoveredFingerprintMismatch, originalDownloadError: String(originalError || "") }), label, step, { chunkedDownload: true, chunkCount, recoveredFingerprintMismatch });
      }

      async function downloadCloud(label, step, meta) {
        // Mobile Safari is unreliable with large JSON account snapshots.  Avoid
        // the large full-file response during sync and always read the canonical
        // cloud file through the small status + chunk endpoints.  This keeps
        // Step 2/5/6 stable and avoids any overlay/z-index/UI side effects.
        const extra = meta && meta.extra ? String(meta.extra) : "chunked fresh server read";
        report(step || 2, label || "Downloading cloud account file", extra, Object.assign({}, meta || {}, { chunkedDownload: true, directChunked: true }));
        // The active cloud snapshot can be replaced by another device (or a
        // background materialise) while this device is mid-download, which made
        // the chunk loop fail with "changed while downloading". Instead of failing
        // the whole sync, re-read the fresh status (re-pinning the NEW active
        // snapshot) and download again a few times. After convergence this almost
        // never triggers, but it lets a stuck device get past Step 2.
        const maxRepins = 5;
        let lastRepinErr = null;
        for (let attempt = 1; attempt <= maxRepins; attempt += 1) {
        try {
          return await downloadCloudInChunks(label, step, Object.assign({}, meta || {}, attempt > 1 ? { repin: attempt } : {}), attempt > 1 ? `re-pinning cloud snapshot (attempt ${attempt}/${maxRepins})` : "direct chunked download");
        } catch (chunkErr) {
          const msg = String(chunkErr && chunkErr.message || chunkErr || "");
          // Do not respond to a mid-download chunk failure by requesting the
          // whole multi-megabyte JSON file.  That was making a stressed Worker do
          // even more work and often converted one flaky chunk into a full Step 2
          // failure.  Only use the old full-file fallback when the chunk endpoint
          // itself appears unavailable.
          if (/chunked endpoint unsupported|unsupported chunked|not implemented/i.test(msg)) {
            const res = await fetchJson(accountFileSyncUrl(), { timeoutMs: 120000, attempts: 2, retryDelayMs: 650 });
            if (!res || res.ok === false) throw new Error(msg || res && res.error || "Could not download cloud account file.");
            return validateDownloadedAccountFileResponse(res, label, step, { fallbackFullDownload: true, chunkedDownloadError: msg });
          }
          if (/changed while downloading/i.test(msg) && attempt < maxRepins) {
            lastRepinErr = chunkErr;
            report(step || 2, label || "Downloading cloud account file", `cloud snapshot changed; re-pinning (attempt ${attempt + 1}/${maxRepins})`, Object.assign({}, meta || {}, { chunkedDownload: true, repin: attempt + 1 }));
            await delay(Math.min(6000, 700 * attempt + Math.random() * 500));
            continue;
          }
          throw new Error(msg || "Could not download cloud account file chunks.");
        }
        }
        throw lastRepinErr || new Error("Could not download cloud account file chunks.");
      }

      async function uploadFile(fileToUpload, label, step, meta) {
        const cleanFile = normaliseFile(fileToUpload || readFile());
        const payloadText = JSON.stringify(cleanFile);
        const uploadChunkSize = isMobilePowerSensitiveClient() ? Math.min(SNAPSHOT_CHUNK_SIZE, 60000) : SNAPSHOT_CHUNK_SIZE;
        const payloadChunks = chunksOf(payloadText, uploadChunkSize);
        const payloadSyncId = uid("sync_exact");
        const fp = fileFingerprint(cleanFile);
        const uploadStats = statsForFile(cleanFile);
        // The events-only total this device shows in its account panel. The Worker
        // pins this as the authoritative leaderboard "Total XP" so the board equals
        // the panel for every viewer (sidesteps subtle server/client cap drift).
        let clientRankingTotal = null;
        try { clientRankingTotal = Math.round(Number(xpFromFile(cleanFile).totalScore || 0) * 10) / 10; } catch (_) { clientRankingTotal = null; }
        const deferProjection = fp.eventCount > 2200 || !!(meta && meta.localCompacted);
        pendingUploadFingerprint = fp;
        pendingUploadStats = uploadStats;
        pendingUploadFile = cleanFile;
        let result = null;
        const missingChunkIndexes = (res) => {
          const fromServer = Array.isArray(res && res.missing) ? res.missing : null;
          const raw = fromServer && fromServer.length ? fromServer : (res && res.partial ? payloadChunks.map((_, idx) => idx) : []);
          const seen = new Set();
          return raw
            .map((idx) => Math.floor(Number(idx)))
            .filter((idx) => Number.isFinite(idx) && idx >= 0 && idx < payloadChunks.length && !seen.has(idx) && seen.add(idx));
        };
        const uploadChunk = async (i, passLabel) => {
          const maxChunkPasses = isMobilePowerSensitiveClient() ? 7 : 5;
          let last = null;
          for (let pass = 1; pass <= maxChunkPasses; pass += 1) {
            const retryText = pass > 1 ? `network retry ${pass}/${maxChunkPasses}` : "";
            const parts = [passLabel, retryText].filter(Boolean);
            const extra = `chunk ${i + 1}/${payloadChunks.length}${parts.length ? " · " + parts.join(" · ") : ""}`;
            report(step || 4, label || "Uploading merged account file", extra, Object.assign({}, meta || {}, { chunkIndex: i + 1, chunkCount: payloadChunks.length, bytes: payloadText.length, eventCount: fp.eventCount, fingerprint: fp, retryPass: pass, retryLimit: maxChunkPasses }));
            const res = await fetchJson(`${API_BASE}/identity/account-file-sync`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                visitorId: getVisitorId(),
                accountKey: ak,
                deviceName: getDeviceName(),
                syncId: payloadSyncId,
                chunkIndex: i,
                chunkCount: payloadChunks.length,
                clientFingerprint: fp,
                clientRankingTotal: clientRankingTotal,
                responseMode: "summary",
                omitFile: true,
                deferProjection,
                skipProjection: deferProjection,
                chunk: payloadChunks[i]
              }),
              timeoutMs: isMobilePowerSensitiveClient() ? 300000 : 240000,
              attempts: isMobilePowerSensitiveClient() ? 2 : 2,
              retryDelayMs: 900
            });
            if (res && res.ok !== false) {
              report(step || 4, "Server accepted upload chunk", extra, Object.assign({}, meta || {}, { chunkIndex: i + 1, chunkCount: payloadChunks.length, bytes: payloadText.length, eventCount: fp.eventCount, fingerprint: res.fingerprint || fp, partial: !!res.partial, missing: Array.isArray(res.missing) ? res.missing : undefined, retryPass: pass }));
              return res;
            }
            last = res || { ok: false, error: "Cloud upload failed." };
            if (!isRetryableFetchFailure(last) || pass >= maxChunkPasses) break;
            await delay(Math.min(12000, 900 * pass + Math.random() * 600));
          }
          throw new Error(last && last.error || `Cloud upload failed at chunk ${i + 1}/${payloadChunks.length}.`);
        };
        for (let i = 0; i < payloadChunks.length; i += 1) {
          result = await uploadChunk(i, "");
        }
        for (let pass = 1; result && result.partial && pass <= 2; pass += 1) {
          const missing = missingChunkIndexes(result);
          if (!missing.length) break;
          report(step || 4, label || "Uploading merged account file", `resending ${missing.length} missing chunk${missing.length === 1 ? "" : "s"} · pass ${pass}/2`, Object.assign({}, meta || {}, { chunkCount: payloadChunks.length, missing, bytes: payloadText.length, eventCount: fp.eventCount, fingerprint: fp }));
          for (const idx of missing) {
            result = await uploadChunk(idx, `retry ${pass}/2`);
          }
        }
        if (result && result.partial) throw new Error("Cloud upload stayed partial after retrying missing chunks.");
        return result || { ok: true, file: cleanFile, stats: uploadStats, fingerprint: fp, projectionDeferred: deferProjection };
      }

      async function appendMissingEventsToCloud(sourceFile, cloudFile, label, step, meta) {
        const cleanSource = normaliseFile(sourceFile || emptyFile());
        const missing = eventsMissingFromCloud(cleanSource, cloudFile || emptyFile());
        if (!missing.length) return null;
        const batchSize = isMobilePowerSensitiveClient() ? 60 : 120;
        const batches = chunkArray(missing, batchSize);
        const fp = fileFingerprint(cleanSource);
        let acceptedTotal = 0;
        report(step || 4, label || "Uploading missing account events", `${missing.length} events · ${batches.length} append batch${batches.length === 1 ? "" : "es"}`, Object.assign({}, meta || {}, { diffAppend: true, missingEvents: missing.length, batchCount: batches.length, eventCount: fp.eventCount, fingerprint: fp }));
        for (let i = 0; i < batches.length; i += 1) {
          const batch = batches[i];
          report(step || 4, label || "Uploading missing account events", `batch ${i + 1}/${batches.length} · ${batch.length} events`, Object.assign({}, meta || {}, { diffAppend: true, batchIndex: i + 1, batchCount: batches.length, batchSize: batch.length, missingEvents: missing.length, eventCount: fp.eventCount, fingerprint: fp }));
          const res = await fetchJson(`${API_BASE}/identity/account-event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              visitorId: getVisitorId(),
              accountKey: ak,
              deviceName: getDeviceName(),
              reason: "sync-diff-append",
              responseMode: "summary",
              fastAppend: true,
              appendOnly: true,
              deferMaterialize: true,
              events: batch
            }),
            timeoutMs: isMobilePowerSensitiveClient() ? 90000 : 75000,
            attempts: 3,
            retryDelayMs: 800
          });
          if (!res || res.ok === false) throw new Error(res && res.error || `Cloud diff append failed at batch ${i + 1}/${batches.length}.`);
          const acceptedIds = Array.isArray(res.acceptedIds) && res.acceptedIds.length ? res.acceptedIds : batch.map((x) => x && x.id);
          acceptedTotal += acceptedIds.length;
          markCloudEventsUploaded(acceptedIds);
          applyCloudEventUploadResult(res);
        }
        report(step || 4, "Finalising missing account events", `${acceptedTotal}/${missing.length} accepted`, Object.assign({}, meta || {}, { diffAppend: true, materialize: true, accepted: acceptedTotal, missingEvents: missing.length, eventCount: fp.eventCount, fingerprint: fp }));
        const materialized = await fetchJson(`${API_BASE}/identity/account-event`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: getVisitorId(),
            accountKey: ak,
            deviceName: getDeviceName(),
            reason: "sync-diff-append-materialize",
            responseMode: "summary",
            materialize: true,
            events: []
          }),
          timeoutMs: isMobilePowerSensitiveClient() ? 180000 : 150000,
          attempts: 3,
          retryDelayMs: 1000
        });
        if (!materialized || materialized.ok === false) {
          // The events are already staged in the server append-log (accepted above).
          // A transient failure on the heavy materialize finalize (e.g. "Failed to
          // fetch" when the snapshot fold is slow) must NOT abort the whole sync.
          // Fall through to Step 5 Verify / Step 6 Repair, which re-read the cloud and
          // reconcile — the append + materialize are idempotent, so a retry or a later
          // server-side fold completes it. With the content-based diff, content-equal
          // events already in the cloud verify as converged regardless of this fold.
          report(step || 4, "Missing events staged; finalize deferred", `${acceptedTotal}/${missing.length} staged · ${String(materialized && materialized.error || "finalize failed").slice(0, 80)}`, Object.assign({}, meta || {}, { diffAppend: true, materializeDeferred: true, accepted: acceptedTotal, missingEvents: missing.length }));
          return Object.assign({}, materialized || {}, { ok: true, file: cleanSource, stats: statsForFile(cleanSource), fingerprint: fp, diffAppend: true, accepted: acceptedTotal, missingEvents: missing.length, batches: batches.length, materializeDeferred: true });
        }
        applyCloudEventUploadResult(materialized);
        report(step || 4, "Missing account events uploaded", `${acceptedTotal}/${missing.length} accepted`, Object.assign({}, meta || {}, { diffAppend: true, accepted: acceptedTotal, missingEvents: missing.length, eventCount: fp.eventCount, fingerprint: materialized.fingerprint || fp }));
        return Object.assign({}, materialized, { ok: true, file: cleanSource, stats: statsForFile(cleanSource), fingerprint: fp, diffAppend: true, accepted: acceptedTotal, missingEvents: missing.length, batches: batches.length });
      }

      // Step 2. Always start from a fresh cloud read.
      lastDownload = await downloadCloud("Downloading cloud account file", 2);
      const firstCloudFile = lastDownload.file && typeof lastDownload.file === "object" ? lastDownload.file : emptyFile();
      beforeCloud = lastDownload.stats && typeof lastDownload.stats === "object" ? lastDownload.stats : statsForFile(firstCloudFile);

      // Step 3. Merge local and cloud into an in-memory canonical account file.
      // Mobile browsers may not be able to keep the complete history in
      // localStorage, so exact local persistence is best-effort: if it does not
      // fit, keep a compact local cache but still upload the full canonical file
      // to the cloud.
      report(3, "Merging local and cloud account files", `${Number(beforeLocal.stores && beforeLocal.stores.eventLog || 0)} local events + ${Number(beforeCloud.stores && beforeCloud.stores.eventLog || 0)} cloud events`);
      syncCanonicalFile = mergeFiles(readFile(), firstCloudFile);
      syncCanonicalFile = refreshScoreStateOnFile(syncCanonicalFile, "sync-merged-score-state-refresh");
      finalLocalSaveInfo = persistFileForSync(syncCanonicalFile, "sync-merged-before-upload", { allowCompacted: true });
      finalLocalFile = finalLocalSaveInfo.file;
      finalLocalWasCompacted = finalLocalWasCompacted || !finalLocalSaveInfo.exact;
      let persistedStats = statsForFile(finalLocalFile);
      if (finalLocalSaveInfo.exact) {
        report(3, "Merged file saved on this device", `${Number(persistedStats.stores && persistedStats.stores.eventLog || 0)} local events`, { eventCount: fileFingerprint(finalLocalFile).eventCount, localCompacted: false });
      } else {
        report(3, "Merged file saved as compact mobile cache", `${Number(persistedStats.stores && persistedStats.stores.eventLog || 0)} kept locally · ${Number(finalLocalSaveInfo.diff && finalLocalSaveInfo.diff.cloudOnly || 0)} older cloud events left cloud-only`, { eventCount: fileFingerprint(finalLocalFile).eventCount, localCompacted: true, compactMode: finalLocalSaveInfo.compactMode, difference: finalLocalSaveInfo.diff });
      }

      // Step 4. Upload only when this device has events the cloud does not yet
      // contain.  A download-only device should not re-upload the same large
      // cloud file just to prove equality; that was the common path behind the
      // repeated final-chunk failures on secondary devices.
      const firstCloudFp = fileFingerprint(firstCloudFile);
      const canonicalBeforeUploadFp = fileFingerprint(syncCanonicalFile);
      if (fingerprintsEqual(canonicalBeforeUploadFp, firstCloudFp)) {
        report(4, "Cloud already contains the merged account file", `${canonicalBeforeUploadFp.eventCount} events · upload skipped`, { eventCount: canonicalBeforeUploadFp.eventCount, fingerprint: canonicalBeforeUploadFp, uploadSkipped: true, localCompacted: finalLocalWasCompacted });
        lastUpload = { ok: true, skipped: true, file: firstCloudFile, stats: beforeCloud, fingerprint: firstCloudFp, projectionDeferred: false };
      } else {
        const uploadDiff = fileDifference(syncCanonicalFile, firstCloudFile);
        const missingEvents = eventsMissingFromCloud(syncCanonicalFile, firstCloudFile);
        if (uploadDiff.cloudOnly === 0 && missingEvents.length) {
          lastUpload = await appendMissingEventsToCloud(syncCanonicalFile, firstCloudFile, "Uploading missing account events", 4, { localCompacted: finalLocalWasCompacted, difference: uploadDiff });
        } else {
          lastUpload = await uploadFile(syncCanonicalFile, "Uploading merged account file", 4, { localCompacted: finalLocalWasCompacted, difference: uploadDiff });
        }
      }
      // Always refresh the leaderboard "Total XP" from the current account total — even
      // when the upload was skipped because the device already converged. Otherwise the
      // board freezes at the last full-upload value (board stuck at 746 while the panel
      // was 811). Lightweight: events:[] just pins the client total server-side.
      try {
        const rankTotal = Math.round(Number(xpFromFile(syncCanonicalFile).totalScore || 0) * 10) / 10;
        if (Number.isFinite(rankTotal) && rankTotal >= 0) {
          await fetchJson(`${API_BASE}/identity/account-event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visitorId: getVisitorId(), accountKey: ak, deviceName: getDeviceName(), reason: "sync-ranking-refresh", materialize: true, events: [], clientRankingTotal: rankTotal }),
            timeoutMs: 45000, attempts: 2, retryDelayMs: 700
          }).catch(() => null);
        }
      } catch (_) {}
      const uploadedCloudFile = lastUpload && lastUpload.file && typeof lastUpload.file === "object" ? lastUpload.file : syncCanonicalFile;
      syncCanonicalFile = mergeFiles(syncCanonicalFile, uploadedCloudFile);
      syncCanonicalFile = fileWithScoreState(syncCanonicalFile, bestScoreStateForFile(syncCanonicalFile, { allowCompute: false }) || bestScoreStateForFile(uploadedCloudFile, { allowCompute: false }));
      finalLocalSaveInfo = persistFileForSync(syncCanonicalFile, "sync-after-upload-response", { allowCompacted: true });
      finalLocalFile = finalLocalSaveInfo.file;
      finalLocalWasCompacted = finalLocalWasCompacted || !finalLocalSaveInfo.exact;

      // Step 5. Re-read the server.  The upload response alone is never trusted.
      const verify = await downloadCloud("Verifying cloud account file", 5, { extra: "after upload" });
      finalCloudFile = verify.file && typeof verify.file === "object" ? verify.file : uploadedCloudFile;
      finalCloudFingerprint = verify.fingerprint || fileFingerprint(finalCloudFile);
      syncCanonicalFile = mergeFiles(syncCanonicalFile, finalCloudFile);

      // Step 6. Final reconciliation.  Compare the full in-memory canonical file
      // with the cloud. The compact local cache is allowed to be smaller, but the
      // cloud must contain the complete canonical event union.
      for (let repair = 1; repair <= 3; repair += 1) {
        finalLocalSaveInfo = persistFileForSync(syncCanonicalFile, `sync-final-union-${repair}`, { allowCompacted: true });
        finalLocalFile = finalLocalSaveInfo.file;
        finalLocalWasCompacted = finalLocalWasCompacted || !finalLocalSaveInfo.exact;
        const canonicalFp = fileFingerprint(syncCanonicalFile);
        const cloudFp = fileFingerprint(finalCloudFile || emptyFile());
        finalDiff = fileDifference(syncCanonicalFile, finalCloudFile || emptyFile());
        if (fingerprintsEqual(canonicalFp, cloudFp)) {
          report(6, "Cloud file contains the complete account file", `${canonicalFp.eventCount} events${finalLocalWasCompacted ? " · compact local cache" : ""}`, { difference: finalDiff, eventCount: canonicalFp.eventCount, localCompacted: finalLocalWasCompacted, localEventCount: fileFingerprint(finalLocalFile).eventCount });
          finalCloudFingerprint = cloudFp;
          break;
        }

        report(6, "Repairing cloud account file", `canonical-only ${finalDiff.localOnly}, cloud-only ${finalDiff.cloudOnly}, pass ${repair}/3`, { difference: finalDiff, eventCount: canonicalFp.eventCount, localCompacted: finalLocalWasCompacted });
        const repairMissingEvents = eventsMissingFromCloud(syncCanonicalFile, finalCloudFile || emptyFile());
        if (finalDiff.cloudOnly === 0 && repairMissingEvents.length) {
          lastUpload = await appendMissingEventsToCloud(syncCanonicalFile, finalCloudFile || emptyFile(), "Uploading missing repaired events", 6, { repairPass: repair, localCompacted: finalLocalWasCompacted, difference: finalDiff });
        } else {
          lastUpload = await uploadFile(syncCanonicalFile, "Uploading final repaired account file", 6, { repairPass: repair, localCompacted: finalLocalWasCompacted, difference: finalDiff });
        }
        const repairCloud = lastUpload && lastUpload.file && typeof lastUpload.file === "object" ? lastUpload.file : finalCloudFile;
        syncCanonicalFile = mergeFiles(syncCanonicalFile, repairCloud);
        const check = await downloadCloud("Checking repaired cloud account file", 6, { extra: `repair pass ${repair}/3` });
        finalCloudFile = check.file && typeof check.file === "object" ? check.file : repairCloud;
        finalCloudFingerprint = check.fingerprint || fileFingerprint(finalCloudFile);
        syncCanonicalFile = mergeFiles(syncCanonicalFile, finalCloudFile);
      }

      // CLOUD IS AUTHORITATIVE. Adopt the verified cloud file as this device's
      // canonical and DISCARD any local-only old/legacy rows that never made it to
      // the cloud (these are exactly the stale "old data / old format" events that
      // caused the endless "Needs sync / N different" and the device count staying
      // above the cloud). Genuinely-new activity is uploaded separately through the
      // incremental event queue BEFORE this point and is therefore already in the
      // cloud file, so it survives the adopt. Steps 4–6 already pushed the local diff
      // up; whatever the cloud still does not have after that, we drop on purpose.
      if (finalCloudFile && Array.isArray(finalCloudFile.eventLog)) {
        syncCanonicalFile = refreshScoreStateOnFile(normaliseFile(finalCloudFile), "sync-adopt-cloud-authoritative");
        finalCloudFile = fileWithScoreState(finalCloudFile, bestScoreStateForFile(syncCanonicalFile, { allowCompute: false }));
      } else {
        syncCanonicalFile = refreshScoreStateOnFile(syncCanonicalFile || mergeFiles(finalLocalFile || readFile(), emptyFile()), "sync-final-score-state-refresh");
      }
      if (finalCloudFile) finalCloudFile = fileWithScoreState(finalCloudFile, bestScoreStateForFile(syncCanonicalFile, { allowCompute: false }));
      finalLocalSaveInfo = persistFileForSync(syncCanonicalFile, "sync-final-local-save", { allowCompacted: true });
      finalLocalFile = finalLocalSaveInfo.file;
      finalLocalWasCompacted = finalLocalWasCompacted || !finalLocalSaveInfo.exact;
      const finalLocalFp = fileFingerprint(finalLocalFile);
      const finalCanonicalFp = fileFingerprint(syncCanonicalFile || finalLocalFile);
      const finalCloudFp = fileFingerprint(finalCloudFile || emptyFile());
      finalDiff = fileDifference(syncCanonicalFile || finalLocalFile, finalCloudFile || emptyFile());
      if (!fingerprintsEqual(finalCanonicalFp, finalCloudFp)) {
        report(7, "Final cloud equality check failed", `canonical-only ${finalDiff.localOnly}, cloud-only ${finalDiff.cloudOnly}`, { difference: finalDiff, eventCount: finalCanonicalFp.eventCount, localCompacted: finalLocalWasCompacted });
        throw new Error(`Sync did not finish aligned. Canonical-only events: ${finalDiff.localOnly}; cloud-only events: ${finalDiff.cloudOnly}. Last cloud events: ${finalCloudFp.eventCount}; canonical events: ${finalCanonicalFp.eventCount}.`);
      }

      const finalStats = statsForFile(finalLocalFile);
      const canonicalStats = statsForFile(syncCanonicalFile || finalLocalFile);
      const cloudStats = finalCloudFile ? statsForFile(finalCloudFile) : canonicalStats;
      const compactLocalDiff = fileDifference(finalLocalFile || emptyFile(), finalCloudFile || emptyFile());
      const xp = scoreStateToXp(bestScoreStateForFile(syncCanonicalFile || finalLocalFile, { allowCompute: false }) || rebuildScoreStateFromFile(syncCanonicalFile || finalLocalFile, { source: "sync-final-xp-fallback" }), syncCanonicalFile || finalLocalFile);
      report(7, "Finalising XP and sync status", `${finalCanonicalFp.eventCount} cloud events · ${finalLocalFp.eventCount} local cache events · ${xp.totalScore} XP`, { eventCount: finalCanonicalFp.eventCount, localStats: finalStats, cloudStats, localCompacted: finalLocalWasCompacted, localCacheDifference: compactLocalDiff });
      const summary = {
        ok: true,
        schema: "mk-account-data-sync-summary",
        deviceName: getDeviceName(),
        accountKey: ak,
        uploaded: positiveDelta(beforeCloud, canonicalStats),
        downloaded: positiveDelta(beforeLocal, finalStats),
        beforeLocal,
        beforeCloud,
        afterLocal: finalStats,
        afterCanonical: canonicalStats,
        localCompactedCache: finalLocalWasCompacted,
        compactMode: finalLocalSaveInfo && finalLocalSaveInfo.compactMode || (finalLocalWasCompacted ? "compact" : "exact"),
        server: {
          after: cloudStats,
          reportedAfter: lastUpload && lastUpload.stats || cloudStats,
          verifiedAfter: cloudStats,
          statsAgree: statsEquivalentForAccountSync(cloudStats, canonicalStats),
          localCloudExact: !finalLocalWasCompacted && fingerprintsEqual(finalLocalFp, finalCloudFp),
          cloudCanonicalExact: true,
          localCompactedCache: finalLocalWasCompacted,
          localFingerprint: finalLocalFp,
          canonicalFingerprint: finalCanonicalFp,
          cloudFingerprint: finalCloudFp,
          difference: finalLocalWasCompacted ? compactLocalDiff : { localOnly: 0, cloudOnly: 0, localEvents: finalLocalFp.eventCount, cloudEvents: finalCloudFp.eventCount },
          canonicalDifference: { localOnly: 0, cloudOnly: 0, canonicalEvents: finalCanonicalFp.eventCount, cloudEvents: finalCloudFp.eventCount },
          updatedAt: lastUpload && lastUpload.updatedAt || Date.now(),
          seededFromCanonical: !!(lastDownload && lastDownload.seededFromCanonical || lastUpload && lastUpload.seededFromCanonical),
          seedSource: (lastDownload && lastDownload.seedSource) || (lastUpload && lastUpload.seedSource) || ""
        },
        xp,
        lastProgress,
        progressHistory: progressHistory.slice(-16),
        updatedAt: Date.now(),
        finishedAt: Date.now(),
        elapsedMs: Date.now() - startedAt
      };
      writeSyncSummaryEverywhere(summary);
      // Remember the cloud we just adopted. A storage-tight device keeps only a
      // compact subset locally, so "local count == cloud count" can never be the
      // synced signal. Instead, the status check is "has the cloud changed since we
      // adopted it" — i.e. the live cloud event count equals the count we synced to.
      try {
        // Store the cloud-authoritative XP and EORbits alongside the count. On a
        // storage-tight device the compact-cache baseline can hold a stale/0/inflated
        // currency (we saw 0 → 800 → 347 bouncing); the cloud is the single source of
        // truth, so the compact device displays THIS value instead of the flaky baseline.
        let cloudXpForStore = null;
        try { cloudXpForStore = xpFromFile(finalCloudFile || syncCanonicalFile); } catch (_) { cloudXpForStore = null; }
        // The downloaded cloud SNAPSHOT can still be missing currency-earning events
        // that are staged in the append-log (not yet folded), so xpFromFile() of it can
        // read 0/low. Never let that clobber a known-good stored value down to 0 — take
        // the MAX with what we already stored (resetToCloud / an earlier complete sync).
        let prevSynced = null;
        try { prevSynced = JSON.parse(localStorage.getItem("mk_account_synced_cloud_fp_v1") || "null"); } catch (_) {}
        const computedScore = cloudXpForStore ? Number(cloudXpForStore.totalScore || 0) || 0 : 0;
        const computedCurrency = cloudXpForStore ? Number(cloudXpForStore.currencyBalance != null ? cloudXpForStore.currencyBalance : cloudXpForStore.eorbits || 0) || 0 : 0;
        const cloudEventCount = Number(finalCloudFp && finalCloudFp.eventCount || 0) || 0;
        const prevEventCount = Number(prevSynced && prevSynced.eventCount || 0) || 0;
        const currencyLooksAuthoritative = cloudXpForStore && (cloudEventCount >= prevEventCount || computedCurrency > 0);
        localStorage.setItem("mk_account_synced_cloud_fp_v1", JSON.stringify({
          eventCount: cloudEventCount,
          totalScore: Math.max(computedScore, Number(prevSynced && prevSynced.totalScore || 0) || 0),
          currencyBalance: currencyLooksAuthoritative ? computedCurrency : (Number(prevSynced && prevSynced.currencyBalance || 0) || 0),
          at: Date.now()
        }));
      } catch (_) {}
      // Publish the CLOUD-authoritative score LAST so the panel shows the same value
      // the leaderboard shows (and that reopening the panel recomputes), instead of a
      // lossy compact-cache recompute. This is the fix for "after sync XP/EORbits drop
      // to 642 / 0 but reopening the panel restores 703 / 380": the compact write was
      // publishing the reduced score; we overwrite it here with the full cloud score.
      try {
        const cloudScoreState = bestScoreStateForFile(finalCloudFile || syncCanonicalFile, { allowCompute: true })
          || rebuildScoreStateFromFile(finalCloudFile || syncCanonicalFile, { source: "sync-final-cloud-score" });
        if (cloudScoreState) publishScoreStateChange(cloudScoreState, "sync-final-cloud-authoritative-score", null);
      } catch (_) {}
      try { clearPendingEvents(); } catch (_) {}
      try { window.dispatchEvent(new CustomEvent("mk-account-sync-complete", { detail: summary })); } catch (_) {}
      return Object.assign({ ok: true, accountJsonSummary: summary, accountDataSummary: summary, importedOk: true, accountJsonOk: true, syncedAt: summary.finishedAt }, summary);
    })().catch(async (err) => {
      // A network failure during the last upload chunk can still mean that the
      // Worker committed the snapshot but the browser missed the response. Before
      // persisting a scary failed status, do one small stats-only cloud read. A
      // compact local cache is allowed to be smaller than the cloud, so compare
      // the cloud with the in-memory canonical upload fingerprint as well as the
      // current local cache fingerprint.
      try {
        const rescue = await refreshCloudStatus({ reason: "sync-failure-rescue", timeoutMs: 45000 });
        const cloudFp = rescue && rescue.cloudFingerprint ? rescue.cloudFingerprint : rescue && rescue.raw && rescue.raw.fingerprint;
        const committedUpload = pendingUploadFingerprint && cloudFp && fingerprintsEqual(pendingUploadFingerprint, cloudFp);
        if (rescue && rescue.ok && (rescue.exact || committedUpload) && (rescue.summary || committedUpload)) {
          const localFile = readFile();
          const localStats = statsForFile(localFile);
          const localFp = fileFingerprint(localFile);
          const canonicalFile = pendingUploadFile || localFile;
          const canonicalFp = pendingUploadFingerprint || localFp;
          const canonicalStats = pendingUploadStats || statsForFile(canonicalFile);
          const cloudStats = rescue.cloudStats || canonicalStats;
          const compacted = !fingerprintsEqual(localFp, canonicalFp);
          const compactDiff = compacted ? fileDifference(localFile, canonicalFile) : { localOnly: 0, cloudOnly: 0, localEvents: localFp.eventCount, cloudEvents: canonicalFp.eventCount };
          const baseSummary = rescue.summary || {};
          const recovered = Object.assign({}, baseSummary, {
            ok: true,
            schema: "mk-account-data-sync-summary",
            accountKey: ak,
            deviceName: getDeviceName(),
            recoveredFromNetworkFailure: true,
            recoveredAfterCommittedUpload: !!committedUpload,
            recoveredError: err && err.message || "Account sync request failed after the server may have committed the upload.",
            uploaded: positiveDelta(beforeCloud, canonicalStats),
            downloaded: positiveDelta(beforeLocal, localStats),
            beforeLocal,
            beforeCloud,
            afterLocal: localStats,
            afterCanonical: canonicalStats,
            localCompactedCache: compacted,
            compactMode: compacted ? "compact" : "exact",
            server: {
              after: cloudStats,
              reportedAfter: cloudStats,
              verifiedAfter: cloudStats,
              statsAgree: statsEquivalentForAccountSync(cloudStats, canonicalStats),
              localCloudExact: !compacted && fingerprintsEqual(localFp, cloudFp),
              cloudCanonicalExact: committedUpload || rescue.exact,
              localCompactedCache: compacted,
              localFingerprint: localFp,
              canonicalFingerprint: canonicalFp,
              cloudFingerprint: cloudFp || canonicalFp,
              difference: compacted ? compactDiff : { localOnly: 0, cloudOnly: 0, localEvents: localFp.eventCount, cloudEvents: canonicalFp.eventCount },
              canonicalDifference: { localOnly: 0, cloudOnly: 0, canonicalEvents: canonicalFp.eventCount, cloudEvents: cloudFp && cloudFp.eventCount || canonicalFp.eventCount },
              updatedAt: Date.now()
            },
            lastProgress,
            progressHistory: progressHistory.slice(-16),
            elapsedMs: Date.now() - startedAt,
            updatedAt: Date.now(),
            finishedAt: Date.now()
          });
          writeSyncSummaryEverywhere(recovered);
          try { window.dispatchEvent(new CustomEvent("mk-account-sync-complete", { detail: recovered })); } catch (_) {}
          return Object.assign({ ok: true, accountJsonSummary: recovered, accountDataSummary: recovered, recovered: true, syncedAt: recovered.finishedAt }, recovered);
        }
      } catch (_) {}
      const failureStep = lastProgress && typeof lastProgress === "object" ? lastProgress : null;
      const failure = {
        ok: false,
        schema: "mk-account-data-sync-summary",
        error: err && err.message || "Account sync failed",
        updatedAt: Date.now(),
        finishedAt: 0,
        elapsedMs: Date.now() - startedAt,
        deviceName: getDeviceName(),
        accountKey: ak,
        afterLocal: statsForFile(readFile()),
        lastProgress: failureStep,
        failureStep,
        progressHistory: progressHistory.slice(-16)
      };
      writeSyncSummaryEverywhere(failure);
      try { window.dispatchEvent(new CustomEvent("mk-account-sync-complete", { detail: failure })); } catch (_) {}
      return failure;
    });
    try { return await syncPromise; } finally { syncPromise = null; }
  }

  function normaliseAutoSyncIntervalMs(value) {
    if (value === Infinity || value === "Infinity" || value === "off" || value === "disabled" || value === "never") return Infinity;
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return AUTO_SYNC_INTERVAL_DEFAULT_MS;
    return Math.max(AUTO_SYNC_INTERVAL_MIN_MS, Math.min(AUTO_SYNC_INTERVAL_MAX_MS, Math.round(n)));
  }
  function getAutoSyncIntervalMs() {
    try {
      const raw = localStorage.getItem(AUTO_SYNC_INTERVAL_KEY);
      if (raw == null || raw === "") return isMobilePowerSensitiveClient() ? AUTO_SYNC_INTERVAL_MOBILE_DEFAULT_MS : AUTO_SYNC_INTERVAL_DEFAULT_MS;
      return normaliseAutoSyncIntervalMs(raw);
    } catch (_) { return AUTO_SYNC_INTERVAL_DEFAULT_MS; }
  }
  function setAutoSyncIntervalMs(value) {
    const next = normaliseAutoSyncIntervalMs(value);
    try {
      if (next === Infinity) localStorage.setItem(AUTO_SYNC_INTERVAL_KEY, "off");
      else localStorage.setItem(AUTO_SYNC_INTERVAL_KEY, String(next));
    } catch (_) {}
    try { if (autoTimer) window.clearTimeout(autoTimer); } catch (_) {}
    autoTimer = 0;
    autoSyncDueAt = 0;
    autoSyncReason = "";
    try { window.dispatchEvent(new CustomEvent("mk-account-auto-sync-interval-change", { detail: { intervalMs: next, disabled: next === Infinity } })); } catch (_) {}
    emitAutoSyncTimerChange();
    return next;
  }
  function autoSyncIntervalLabel(value) {
    const ms = normaliseAutoSyncIntervalMs(value);
    if (ms === Infinity) return "Off";
    const minutes = Math.max(1, Math.round(ms / 60000));
    if (minutes < 60) return `${minutes} min`;
    return "1 hour";
  }
  let autoTimer = 0;
  let autoSyncDueAt = 0;
  let autoSyncReason = "";

  function emitAutoSyncTimerChange() {
    try {
      window.dispatchEvent(new CustomEvent("mk-account-auto-sync-timer-change", { detail: getAutoSyncStatus() }));
    } catch (_) {}
  }

  function clearAutoSyncTimerState() {
    autoSyncDueAt = 0;
    autoSyncReason = "";
    emitAutoSyncTimerChange();
  }

  function getAutoSyncStatus() {
    const intervalMs = getAutoSyncIntervalMs();
    const hasAccount = !!accountKey();
    const disabled = intervalMs === Infinity || !hasAccount;
    const dueAt = disabled ? 0 : Number(autoSyncDueAt || 0);
    return {
      ok: true,
      hasAccount,
      disabled,
      intervalMs,
      intervalLabel: autoSyncIntervalLabel(intervalMs),
      scheduled: !!(autoTimer && dueAt),
      dueAt,
      remainingMs: dueAt ? Math.max(0, dueAt - Date.now()) : 0,
      reason: autoSyncReason || ""
    };
  }

  function isLearningAutoSyncReason(reason) {
    const r = String(reason || "").toLowerCase();
    if (!r) return false;
    return /^(mastery|ai[_-]?quiz|shop[-_](purchase|activation|gift|spend)|eorbits[-_](spend|credit)|learning[-_]?action)/.test(r);
  }

  function scheduleAutoSync(reason) {
    if (!accountKey()) { clearAutoSyncTimerState(); return false; }
    const why = reason || "auto";
    if (!isLearningAutoSyncReason(why)) { emitAutoSyncTimerChange(); return false; }
    const intervalMs = getAutoSyncIntervalMs();
    if (intervalMs === Infinity) { clearAutoSyncTimerState(); return false; }
    if (autoTimer) { emitAutoSyncTimerChange(); return true; }
    autoSyncDueAt = Date.now() + intervalMs;
    autoSyncReason = why;
    emitAutoSyncTimerChange();
    autoTimer = window.setTimeout(() => {
      autoTimer = 0;
      clearAutoSyncTimerState();
      if (document.hidden) { return; }
      syncNow({ reason: why, force: false, preflight: false })
        .catch(() => {});
    }, intervalMs);
    return true;
  }

  function getStateForPage(path) {
    const p = normalisePath(path || currentPath());
    const actions = {};
    // Page-load checks should not parse the full event ledger. The legacy mirror
    // is enough for the current-page UI and is refreshed on real writes/syncs.
    try {
      const rows = readJson(LEGACY_PAGE_ACTIONS_KEY, []);
      (Array.isArray(rows) ? rows : []).forEach((x) => {
        if (normalisePath(x && x.path || "") === p && x && x.action && x.deleted !== true && x.active !== false) actions[String(x.action)] = true;
      });
    } catch (_) {}
    try {
      const favs = readJson(LEGACY_FAVORITES_KEY, []);
      if ((Array.isArray(favs) ? favs : []).some((x) => normalisePath(x && x.path || "") === p && x && x.deleted !== true && x.active !== false)) actions.favorite = true;
    } catch (_) {}
    return { path: p, actions, favorite: !!actions.favorite };
  }
  function getLocalVisits() { return deriveCurrentState().visits.map((x) => ({ path: x.path, title: x.title, ts: x.lastVisited, lastVisited: x.lastVisited, visitCount: x.visitCount })); }
  function clearLocalVisits() {
    const file = readFile();
    file.eventLog = (file.eventLog || []).filter((ev) => !(ev.type === "page_visit" || ev.metric === "view"));
    writeFile(file, { source: "clear-visits" });
  }
  // Hand callers fresh element copies: the underlying records belong to the
  // memoised current-state object, and page-action/favorite records are flat, so
  // a shallow copy fully isolates them from accidental mutation by the caller.
  function getLocalPageActions() { return deriveCurrentState().activePageActions.map((x) => Object.assign({}, x)); }
  function getLocalFavorites() { return deriveCurrentState().favorites.map((x) => Object.assign({}, x)); }
  // Mastery Manager mutates this map and its records in place before writing it
  // back, so it must receive a fully independent object, not the memoised one.
  function getMasteryMap() { return deriveState(readFile()).mastery; }
  function clearMasteryAndQuiz() {
    const file = readFile();
    const t = now();
    const state = deriveState(file);
    Object.keys(state.mastery || {}).forEach((p) => recordEvent("mastery_set", { path: p, value: null, details: { clear: true, source: "mastery-manager-clear" } }, { metric: "mastery", path: p, ts: t }));
    // AI quiz removals are represented by a clear event so the timeline is explicit.
    recordEvent("ai_quiz_clear", { details: { source: "mastery-manager-clear" } }, { metric: "ai_quiz", ts: t });
  }

  function postHotPageViewNow(path, title, ts) {
    // v56: keep public Rankings/Views hot tables current even before the
    // account-file sync runs.  The account ledger still records the view, but
    // /hot uses the pages/page_views_daily tables updated by /track.
    try {
      const payload = JSON.stringify({
        path,
        title: title || "",
        visitorId: getVisitorId(),
        deviceId: getDeviceId(),
        ts: Number(ts) || Date.now(),
        source: "track-views-v56-immediate"
      });
      const url = API_BASE + "/track";
      if (navigator && typeof navigator.sendBeacon === "function") {
        try {
          const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
          if (navigator.sendBeacon(url, blob)) return;
        } catch (_) {}
      }
      fetch(url, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: payload
      }).catch(() => {});
    } catch (_) {}
  }

  function activeDayEventIdFor(day) {
    return `active_day_${day}_${getDeviceId()}`;
  }

  function dailyOpenStorageKeyForDay(day) {
    const key = String(accountKey() || getVisitorId() || getDeviceId() || "anon").trim().toLowerCase();
    return `${DAILY_OPEN_KEY}:${key}:${day}`;
  }

  function ensureActiveDayRecorded(reason) {
    const today = dayKey(Date.now());
    const id = activeDayEventIdFor(today);
    const storageKey = dailyOpenStorageKeyForDay(today);
    try {
      if (localStorage.getItem(storageKey) === id) return false;
    } catch (_) {}
    const ev = recordEvent("wiki_open", { title: "Wiki opened", details: { day: today, source: reason || "wiki-open-auto" } }, { metric: "active_day", id });
    if (ev) {
      try { localStorage.setItem(storageKey, id); } catch (_) {}
      // Keep the original global marker only as a harmless compatibility hint.
      try { localStorage.setItem(DAILY_OPEN_KEY, today); } catch (_) {}
      return true;
    }
    return false;
  }

  function trackView() {
    const rel = currentPath();
    const title = currentTitle();
    ensureActiveDayRecorded("track-view");
    if (!isConceptRelPath(rel)) return;
    const key = `view_last_v3:${rel}`;
    try {
      const last = Number(sessionStorage.getItem(key) || "0");
      if (Date.now() - last < 60000) return;
      sessionStorage.setItem(key, String(Date.now()));
    } catch (_) {}
    const pageState = getStateForPage(rel);
    recordEvent("page_visit", { path: rel, title, details: { source: "page-load" } }, { metric: "view", path: rel, title });
    if (!isMobilePowerSensitiveClient()) postHotPageViewNow(rel, title, Date.now());
    if (pageState && Object.keys(pageState.actions || {}).length) {
      recordActivity("saved_page_visit", { path: rel, title, details: { actions: pageState.actions, source: "page-load-saved-state" } }, { path: rel, title, scope: `saved-page-visit:${rel}:${dayKey(Date.now())}`, throttleMs: 60000 });
    }
  }
  function trackEvent(type, detail) { return recordEvent(type || "ui_event", detail || {}, { metric: detail && detail.metric || "activity" }); }

  function readSyncSummary() {
    const candidates = [];
    const push = (summary) => { if (summary && typeof summary === "object") candidates.push(summary); };
    try { push(readJson(LOCAL_SYNC_SUMMARY_KEY, null)); } catch (_) {}
    try {
      const file = readFile();
      if (file && file.syncSummary && typeof file.syncSummary === "object") push(file.syncSummary);
    } catch (_) {}
    try {
      const raw = localStorage.getItem(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY) || sessionStorage.getItem(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY);
      const rec = raw ? JSON.parse(raw) : null;
      if (rec && rec.cloudStats) {
        push({
          ok: true,
          schema: "mk-account-confirmed-cloud-summary",
          accountKey: rec.accountKey || accountKey(),
          deviceName: rec.deviceName || getDeviceName(),
          uploaded: { total: 0, stores: {} },
          downloaded: { total: 0, stores: {} },
          afterLocal: statsForFile(readFile()),
          cloudDisplayOnly: true,
          server: { after: rec.cloudStats, reportedAfter: rec.rawServer || rec.cloudStats, displayOnly: true, stale: !!rec.stale, updatedAt: rec.updatedAt || Date.now() },
          updatedAt: Number(rec.updatedAt || rec.finishedAt || Date.now()) || Date.now(),
          finishedAt: Number(rec.finishedAt || rec.updatedAt || Date.now()) || Date.now()
        });
      }
    } catch (_) {}
    if (!candidates.length) return null;
    const currentAk = String(accountKey() || "").toLowerCase();
    const score = (s) => {
      const akScore = !currentAk || String(s.accountKey || "").toLowerCase() === currentAk ? 1000000000000000 : 0;
      const ts = Math.max(Number(s.finishedAt || 0), Number(s.updatedAt || 0));
      const exact = s && s.server && (s.server.localCloudExact === true || s.server.cloudCanonicalExact === true) ? 5000 : 0;
      const failedPenalty = s && s.ok === false ? -2500 : 0;
      const displayPenalty = s && (s.cloudDisplayOnly || s.server && s.server.displayOnly) ? -1000 : 0;
      return akScore + ts + exact + failedPenalty + displayPenalty;
    };
    candidates.sort((a, b) => score(b) - score(a));
    return candidates[0] || null;
  }

  function resetLocalAccountFile() {
    const f = emptyFile();
    writeFile(f, { source: "reset" });
    writeJson(LOCAL_SYNC_SUMMARY_KEY, null);
    return f;
  }

  function scheduleCosmeticRefreshAfterNavigation(reason) {
    const delays = isMobilePowerSensitiveClient() ? [160] : [0, 180];
    delays.forEach((delay) => {
      try {
        window.setTimeout(() => {
          try { applyEquippedCosmetics(shopInventoryForCosmetics()); } catch (_) {}
        }, delay);
      } catch (_) {}
    });
  }

  function normaliseAiQuizCompletionPayload(detail, source) {
    const d = detail && typeof detail === "object" ? detail : {};
    const path = normalisePath(d.path || d.conceptPath || d.concept_path || d.conceptId || d.concept_id || currentPath());
    const completedAt = Math.max(1, Number(d.completedAt || d.completed_at || d.resultAt || d.result_at || d.ts || Date.now()) || Date.now());
    const resultId = clampText(
      d.resultId || d.result_id || d.quizResultId || d.quiz_result_id || d.sessionResultId || d.session_result_id ||
        (d.sessionId || d.session_id ? `session-${d.sessionId || d.session_id}` : "") ||
        `aiq-${fastStringHash([path || "global", completedAt, d.correct, d.score, d.total].join("|"))}`,
      180
    );
    const sessionId = clampText(d.sessionId || d.session_id || d.quizSessionId || d.quiz_session_id || "", 140);
    return Object.assign({}, d, {
      path,
      resultId,
      sessionId,
      title: cleanPageTitleText(d.title || d.conceptTitle || d.concept_title || path || currentTitle()),
      completedAt,
      completed: true,
      resultProduced: true,
      source: source || d.source || "ai-quiz-local-xp-bridge"
    });
  }

  function recordAiQuizCompletionLocal(detail, source) {
    try {
      const d = normaliseAiQuizCompletionPayload(detail, source);
      if (!d.path && !d.resultId) return null;
      const path = d.path || normalisePath(currentPath());
      const eventId = eventStableId({
        type: "ai_quiz_complete",
        metric: "ai_quiz",
        path,
        ts: Number(d.completedAt || Date.now()) || Date.now(),
        details: { resultId: d.resultId || d.sessionId || "" }
      });
      return recordAiQuiz(path, d, {
        id: eventId,
        ts: Number(d.completedAt || Date.now()) || Date.now(),
        scope: `ai_quiz:${d.resultId || d.sessionId || path || Date.now()}`,
        throttleMs: 0,
        source: source || "ai-quiz-local-xp-bridge"
      });
    } catch (_) { return null; }
  }

  function normaliseMasteryCompletionPayload(detail, source) {
    const d = detail && typeof detail === "object" ? detail : {};
    const path = normalisePath(d.path || d.conceptId || d.concept_id || currentPath());
    const kind = String(d.kind || d.type || d.event || d.action || "").toLowerCase().trim();
    const changeKind = String(d.changeKind || d.change_kind || "").toLowerCase().trim();
    const level = d.level !== undefined ? d.level : (d.mastery !== undefined ? d.mastery : (d.m !== undefined ? d.m : undefined));
    const explicitClear = !!(d.clear === true || changeKind === "clear");
    if ((kind === "view" || kind === "visit" || kind === "seen") && level == null && !explicitClear) return null;
    if (level == null && !explicitClear) return null;
    return Object.assign({}, d, {
      path,
      conceptId: path,
      level: explicitClear ? null : level,
      mastery: explicitClear ? null : level,
      m: explicitClear ? null : level,
      clear: explicitClear || undefined,
      source: source || d.source || "mastery-event-bridge",
      ts: Math.max(1, Number(d.ts || d.updatedAt || d.updated_at || d.lastReviewed || Date.now()) || Date.now())
    });
  }

  function recordMasteryCompletionLocal(detail, source) {
    try {
      const d = normaliseMasteryCompletionPayload(detail, source);
      if (!d || !d.path) return null;
      return recordMastery(d.path, d.clear ? null : d.level, d, {
        source: source || d.source || "mastery-event-bridge",
        clear: !!d.clear,
        ts: Number(d.ts || Date.now()) || Date.now(),
        throttleMs: 0
      });
    } catch (_) { return null; }
  }

  function bindMasteryLocalPersistenceBridgeOnce() {
    if (window.__mkMasteryLocalPersistenceBridgeBound) return;
    window.__mkMasteryLocalPersistenceBridgeBound = true;
    const onMastery = (ev) => {
      try { recordMasteryCompletionLocal(ev && ev.detail, "mastery-event-bridge"); } catch (_) {}
    };
    try { window.addEventListener("conceptMasteryChanged", onMastery, true); } catch (_) {}
    try { document.addEventListener("conceptMasteryChanged", onMastery, true); } catch (_) {}
    try { window.addEventListener("mk:mastery-submitted", onMastery, true); } catch (_) {}
    try { document.addEventListener("mk:mastery-submitted", onMastery, true); } catch (_) {}
    try { window.addEventListener("mk:ai-mastery-accepted", onMastery, true); } catch (_) {}
    try { document.addEventListener("mk:ai-mastery-accepted", onMastery, true); } catch (_) {}
  }

  function bindAiQuizLocalXpBridgeOnce() {
    if (window.__mkAiQuizLocalXpBridgeBound) return;
    window.__mkAiQuizLocalXpBridgeBound = true;

    const install = () => {
      try {
        const xpApi = window.MkXpActivity = window.MkXpActivity || {};
        const current = typeof xpApi.recordAiQuizCompleted === "function" ? xpApi.recordAiQuizCompleted : null;
        if (current && current.__mkLocalXpBridgeWrapped) return;
        const wrapped = function(detail) {
          const localEvent = recordAiQuizCompletionLocal(detail, "ai-quiz-explicit-api-bridge");
          let legacyResult = null;
          if (current) {
            try { legacyResult = current.apply(this, arguments); } catch (_) {}
          }
          try {
            const f = readFile();
            const score = scoreStateToXp(bestScoreStateForFile(f, { allowCompute: false }) || emptyScoreState(), f);
            window.dispatchEvent(new CustomEvent("mk-account-xp-change", { detail: { score, source: "ai-quiz-explicit-api-bridge", event: localEvent } }));
          } catch (_) {}
          return legacyResult || Promise.resolve({ ok: true, localFirst: true, event: localEvent });
        };
        wrapped.__mkLocalXpBridgeWrapped = true;
        wrapped.__mkWrappedOriginal = current || null;
        xpApi.recordAiQuizCompleted = wrapped;
      } catch (_) {}
    };

    install();
    [60, 300, 1000, 2500].forEach((delay) => {
      try { window.setTimeout(install, delay); } catch (_) {}
    });

    const onCompleted = (ev) => {
      try { recordAiQuizCompletionLocal(ev && ev.detail, "ai-quiz-completed-event-bridge"); } catch (_) {}
    };
    try { document.addEventListener("mk:ai-quiz-completed", onCompleted, true); } catch (_) {}
    try { window.addEventListener("mk:ai-quiz-completed", onCompleted, true); } catch (_) {}
  }

  function bindCosmeticRefreshAfterNavigationOnce() {
    if (window.__mkCosmeticRefreshAfterNavigationBound) return;
    window.__mkCosmeticRefreshAfterNavigationBound = true;
    try {
      if (window.document$ && typeof window.document$.subscribe === "function") {
        window.document$.subscribe(() => scheduleCosmeticRefreshAfterNavigation("document$"));
      }
    } catch (_) {}
    try { window.addEventListener("pageshow", () => scheduleCosmeticRefreshAfterNavigation("pageshow"), { passive: true }); } catch (_) {}
    try { window.addEventListener("popstate", () => scheduleCosmeticRefreshAfterNavigation("popstate"), { passive: true }); } catch (_) {}
    try { window.addEventListener("mk-shop-trial-change", () => scheduleCosmeticRefreshAfterNavigation("trial-change")); } catch (_) {}
  }

  try { localStorage.removeItem(ADMIN_SHOP_PREVIEW_KEY); } catch (_) {}
  try { clearRetiredVisualShopAttributes(); } catch (_) {}
  try { bindMaterialColorSchemeBridgeOnce(); } catch (_) {}
  try { bindPageShopTrialExitClearOnce(); } catch (_) {}
  try { bindCosmeticRefreshAfterNavigationOnce(); } catch (_) {}
  try { bindMasteryLocalPersistenceBridgeOnce(); } catch (_) {}
  try { bindAiQuizLocalXpBridgeOnce(); } catch (_) {}
  try { applyEquippedCosmetics(shopInventoryForCosmetics()); } catch (_) {}
  try { window.addEventListener("online", () => flushCloudEventUploadQueue({ reason: "online" }).catch(() => {}), { passive: true }); } catch (_) {}
  try { window.addEventListener("focus", () => flushCloudEventUploadQueue({ reason: "focus" }).catch(() => {}), { passive: true }); } catch (_) {}
  try { document.addEventListener("visibilitychange", () => { if (!document.hidden) flushCloudEventUploadQueue({ reason: "visible" }).catch(() => {}); }, { passive: true }); } catch (_) {}
  try { if (readCloudEventUploadQueue().length) scheduleCloudEventUploadFlush(2500); } catch (_) {}

  // Diagnostic: what exactly is "N events different"? Fetches the cloud file and
  // breaks the device-only / cloud-only events down by type/metric with samples, so
  // we can see WHAT is not syncing (and why) instead of guessing. Run in the console:
  //   await window.MkAccountData.syncDiff()
  async function syncDiffDiagnostic() {
    const ak = accountKey();
    if (!ak) return { ok: false, error: "no account connected" };
    const local = normaliseFile(readFile());
    let cloud = emptyFile();
    let cloudSource = "full-file";
    try {
      const url = `${API_BASE}/identity/account-file-sync?visitorId=${encodeURIComponent(getVisitorId())}&accountKey=${encodeURIComponent(ak)}&deviceName=${encodeURIComponent(getDeviceName())}&verify=1&t=${Date.now()}`;
      const res = await fetchJson(url, { timeoutMs: 120000, attempts: 2, retryDelayMs: 800 });
      if (res && res.file && typeof res.file === "object") cloud = normaliseFile(res.file);
      else cloudSource = `no file in response (${res && res.error || "?"})`;
    } catch (err) { cloudSource = `download failed: ${String(err && err.message || err)}`; }
    const localEvents = withoutAccountScoreBaselineEvents(local.eventLog || []);
    const cloudEvents = withoutAccountScoreBaselineEvents(cloud.eventLog || []);
    const cloudSigs = new Set(cloudEvents.map(eventContentSignature));
    const localSigs = new Set(localEvents.map(eventContentSignature));
    const deviceOnly = localEvents.filter((ev) => !cloudSigs.has(eventContentSignature(ev)));
    const cloudOnly = cloudEvents.filter((ev) => !localSigs.has(eventContentSignature(ev)));
    const breakdown = (events) => {
      const by = {};
      for (const ev of events) { const k = `${ev.type || "?"} / ${ev.metric || "?"}`; by[k] = (by[k] || 0) + 1; }
      return Object.fromEntries(Object.entries(by).sort((a, b) => b[1] - a[1]));
    };
    const sample = (events) => events.slice(0, 10).map((ev) => ({ id: ev.id, type: ev.type, metric: ev.metric, path: ev.path, action: ev.action, ts: ev.ts, tsISO: ev.ts ? new Date(Number(ev.ts)).toISOString() : "", value: ev.value, sig: eventContentSignature(ev) }));
    // For a few device-only events, see if the cloud has the SAME (type,metric,path)
    // at a different ts (would mean ts drift is splitting one logical event in two).
    const tsDriftSuspects = deviceOnly.slice(0, 10).map((ev) => {
      const near = cloudEvents.find((c) => c.type === ev.type && c.metric === ev.metric && (c.path || "") === (ev.path || "") && Number(c.ts || 0) !== Number(ev.ts || 0));
      return near ? { type: ev.type, metric: ev.metric, path: ev.path, deviceTs: ev.ts, cloudTs: near.ts } : null;
    }).filter(Boolean);
    return {
      ok: true, cloudSource,
      localCount: local.eventLog.length, cloudCount: cloud.eventLog.length,
      deviceOnlyCount: deviceOnly.length, cloudOnlyCount: cloudOnly.length,
      deviceOnlyByType: breakdown(deviceOnly), cloudOnlyByType: breakdown(cloudOnly),
      deviceOnlySamples: sample(deviceOnly), cloudOnlySamples: sample(cloudOnly),
      tsDriftSuspects
    };
  }
  // Direct test of the server-side fold (materialize append-log → snapshot). Returns
  // the raw server result: { materialized, locked, skipped, stats, error }. Run
  // `await window.MkAccountData.foldStaged()` a few times; "materialized" should go
  // positive and then 0 once everything is folded. "locked" => lock contention,
  // "error" => the snapshot write failed.
  async function foldStagedDiagnostic() {
    const ak = accountKey();
    if (!ak) return { ok: false, error: "no account connected" };
    return fetchJson(`${API_BASE}/identity/account-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId(), accountKey: ak, deviceName: getDeviceName(), reason: "manual-fold", responseMode: "summary", materialize: true, events: [] }),
      timeoutMs: 150000, attempts: 1
    }).catch((err) => ({ ok: false, error: String(err && err.message || err) }));
  }
  // Forcibly adopt the cloud: download it, CLEAR the pending buffer first (that buffer
  // is what re-inflates the device count back to its stuck value every read), write the
  // cloud as the local file, and report whether any local-only events remain (should be
  // 0). Run `await window.MkAccountData.resetToCloud()` once per device to converge.
  async function resetToCloudDiagnostic() {
    const ak = accountKey();
    if (!ak) return { ok: false, error: "no account connected" };
    const url = `${API_BASE}/identity/account-file-sync?visitorId=${encodeURIComponent(getVisitorId())}&accountKey=${encodeURIComponent(ak)}&deviceName=${encodeURIComponent(getDeviceName())}&verify=1&t=${Date.now()}`;
    const res = await fetchJson(url, { timeoutMs: 120000, attempts: 3, retryDelayMs: 800 }).catch((e) => ({ ok: false, error: String(e && e.message || e) }));
    if (!res || res.ok === false || !res.file) return { ok: false, error: (res && res.error) || "could not download cloud file" };
    const cloud = normaliseFile(res.file);
    const cloudCount = (cloud.eventLog || []).length;
    try { clearPendingEvents(); } catch (_) {}
    let saved = null;
    try { saved = persistFileForSync(cloud, "reset-to-cloud", { allowCompacted: true }); } catch (e) { return { ok: false, error: "persist failed: " + String(e && e.message || e), cloudCount }; }
    try { clearPendingEvents(); } catch (_) {}
    const fp = fileFingerprint(cloud);
    let xp = null; try { xp = xpFromFile(cloud); } catch (_) {}
    try { localStorage.setItem("mk_account_synced_cloud_fp_v1", JSON.stringify({ eventCount: fp.eventCount, totalScore: xp ? Number(xp.totalScore || 0) : null, currencyBalance: xp ? Number(xp.currencyBalance != null ? xp.currencyBalance : xp.eorbits || 0) : null, at: Date.now() })); } catch (_) {}
    try { const ss = bestScoreStateForFile(cloud, { allowCompute: true }); if (ss) publishScoreStateChange(ss, "reset-to-cloud", null); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("mk-account-data-changed", { detail: { source: "reset-to-cloud", persisted: true } })); } catch (_) {}
    const afterFile = readFile();
    const diff = fileDifference(afterFile, cloud);
    // Write a fresh sync summary so the panel's DEVICE count (which reads the latest
    // summary's afterLocal) and the synced status update to the adopted values.
    try {
      const localStatsNow = statsForFile(afterFile);
      const cloudStatsNow = statsForFile(cloud);
      writeSyncSummaryEverywhere({
        ok: true, schema: "mk-account-data-sync-summary", accountKey: ak, deviceName: getDeviceName(),
        afterLocal: localStatsNow,
        server: { after: cloudStatsNow, verifiedAfter: cloudStatsNow, cloudFingerprint: fp, localCompactedCache: true, localCloudExact: false, difference: { localOnly: 0, cloudOnly: Math.max(0, cloudCount - fileFingerprint(afterFile).eventCount) } },
        xp: xp || undefined, updatedAt: Date.now(), finishedAt: Date.now()
      });
    } catch (_) {}
    try { if (xp) publishScoreStateChange(bestScoreStateForFile(cloud, { allowCompute: true }) || (cloud && cloud.scoreState), "reset-to-cloud-final", null); } catch (_) {}
    return {
      ok: true, cloudCount,
      localAfter: fileFingerprint(afterFile).eventCount,
      localOnlyAfter: diff.localOnly,
      compactCache: !(saved && saved.exact),
      xp: xp ? Number(xp.totalScore || 0) : null,
      currency: xp ? Number(xp.currencyBalance != null ? xp.currencyBalance : xp.eorbits || 0) : null
    };
  }
  window.MkAccountData = {
    version: "account-data-rewrite-v13",
    syncDiff: syncDiffDiagnostic,
    foldStaged: foldStagedDiagnostic,
    resetToCloud: resetToCloudDiagnostic,
    apiBase: API_BASE,
    readFile,
    writeFile,
    resetLocalAccountFile,
    mergeFiles,
    deriveState,
    stats: (opts) => (opts && opts.exact ? statsForCurrentLocalFile() : cachedLocalStatsForDisplay()),
    statsExact: () => statsForCurrentLocalFile(),
    xpSnapshot: () => xpCachedNoCompute(),
    xpCachedNoCompute: () => xpCachedNoCompute(),
    xp: () => xpCachedFromFile(null),
    xpCached: () => xpCachedFromFile(null),
    xpFresh: () => xpCachedFromFile(readFile(), { force: true }),
    xpDebugToday: () => {
      const f = readFile();
      const xp = xpFromFile(f);
      const today = dayKey(Date.now());
      const events = (f.eventLog || []).filter((ev) => dayKey(ev && ev.ts) === today).map((ev) => {
        const row = (xp.events || []).find((x) => x && x.createdAt === ev.ts && x.metric === ev.metric && x.path === ev.path) || null;
        return { id: ev.id, type: ev.type, metric: ev.metric, count: ev.count, path: ev.path, ts: ev.ts, stateKey: stateKeyForXp(ev), counted: !!XP_RULES[ev.metric], score: row ? row.score : 0, rawScore: row ? row.rawScore : 0, details: ev.details || {} };
      });
      return { today, todayXp: xp.todayXp, totalScore: xp.totalScore, breakdown: xp.breakdown, eventCount: events.length, xpEventCount: events.filter((e) => e.counted).length, scoredEventCount: events.filter((e) => Number(e.score || 0) > 0).length, events };
    },
    readSyncSummary,
    refreshCloudStatus,
    syncNow,
    scheduleAutoSync,
    flushPendingEventsToFile,
    migrateScoreStateIfNeeded,
    scheduleScoreStateMigration,
    pendingEventCount,
    getAutoSyncStatus,
    getAutoSyncIntervalMs,
    setAutoSyncIntervalMs,
    autoSyncIntervalLabel,
    compactForStorage,
    recordEvent,
    recordActivity,
    recordPageAction,
    recordMastery,
    recordAiQuiz,
    shopCatalog: () => visibleShopCatalogItems(),
    dailyDiscounts: () => dailyDiscounts(),
    shopItemPricing: (itemId) => shopItemEffectivePrice(itemId),
    setShopDynamicMultipliers,
    getShopInventory: () => { requestShopStateSync("get-shop-inventory"); return shopInventoryFromFile(readFile()); },
    syncShopStateNow,
    flushCloudEventUploadQueue,
    getPendingCloudEventUploads: () => readCloudEventUploadQueue(),
    lastShopPurchaseFailure: () => {
      try { return JSON.parse(localStorage.getItem("mk_shop_purchase_last_failure_v1") || "null"); } catch (_) { return null; }
    },
    getActiveShopTrials: () => activeShopTrialItems(readFile()),
    getEquippedCosmetics: () => (shopInventoryFromFile(readFile()).equipped || {}),
    getActiveShopTrials: () => activeShopTrialItems(),
    isShopAdminTrialUser,
    startShopTrial,
    stopShopTrial,
    setShopTrialMuted,
    hasUsedShopTrialToday: (itemId) => hasUsedShopTrialToday(itemId, readFile()),
    hasShopItem: (itemId) => hasShopItem(itemId, readFile()),
    hasShopItemAccess: (itemId) => hasShopItemAccess(itemId, readFile()),
    buyShopItem,
    equipShopItem,
    clearShopSlot,
    applyEquippedCosmetics: () => applyEquippedCosmetics(shopInventoryForCosmetics()),
    recordShopTransaction: (kind, detail, opts) => recordEvent(String(kind || "shop_purchase"), Object.assign({}, detail || {}, { metric: String(kind || "shop_purchase") }), Object.assign({}, opts || {}, { metric: String(kind || "shop_purchase") })),
    drainPendingXpActivityQueue,
    getStateForPage,
    getLocalVisits,
    clearLocalVisits,
    getLocalPageActions,
    getLocalFavorites,
    getMasteryMap,
    clearMasteryAndQuiz,
    importLegacyMasteryIntoAccountFileOnce,
    importLegacyAccountFileOnce,
    importLegacyStoresOnce,
    getVisitorId,
    getDeviceId,
    getDeviceName,
    currentPath,
    currentTitle,
    isConceptRelPath,
    siteRootUrl: getSiteRootUrl
  };

  // Mobile-friendly trigger: opening any wiki page with ?mkResetToCloud=1 (or
  // #mkResetToCloud) runs resetToCloud() once, shows the result, and reloads — so a
  // phone can converge without a developer console.
  try {
    if (/[?&]mkResetToCloud=1\b/.test(location.search) || /(^|[#&])mkResetToCloud\b/.test(location.hash)) {
      setTimeout(() => {
        resetToCloudDiagnostic().then((r) => {
          try { alert("Reset to cloud:\n" + (r && r.ok ? `device=${r.localAfter} cloud=${r.cloudCount}\nlocalOnly=${r.localOnlyAfter}\nXP=${r.xp}  EORbits=${r.currency}` : "FAILED: " + (r && r.error || "?"))); } catch (_) {}
          try {
            const u = new URL(location.href);
            u.searchParams.delete("mkResetToCloud");
            u.hash = u.hash.replace(/(^|[#&])mkResetToCloud\b/g, "");
            location.replace(u.toString());
          } catch (_) { location.reload(); }
        }).catch((e) => { try { alert("Reset to cloud failed: " + String(e && e.message || e)); } catch (_) {} });
      }, 1500);
    }
  } catch (_) {}

  window.MkHotTrack = Object.assign(window.MkHotTrack || {}, {
    apiBase: API_BASE,
    siteRootUrl: getSiteRootUrl,
    getVisitorId,
    currentPath,
    isConceptRelPath,
    trackView,
    trackEvent,
    trackActivity: recordActivity,
    flushLocalSyncQueue: (opts) => syncNow(Object.assign({ force: false, reason: "legacy-flush" }, opts && typeof opts === "object" ? opts : {})),
    getLocalSyncQueueSize: () => 0,
    getLocalVisits,
    clearLocalVisits,
  });

  function init() {
    // Keep page opening cheap. Legacy import and score-state repair are no longer
    // run synchronously on every page load because they parse large localStorage
    // records on phones. First-time migration is deferred to idle time.
    try {
      const needLegacy = !localStorage.getItem(LEGACY_ACCOUNT_IMPORT_KEY) || !localStorage.getItem(LEGACY_MASTERY_IMPORT_KEY);
      if (needLegacy) {
        const runLegacy = () => { try { importLegacyStoresOnce("idle-legacy-account-preserve"); } catch (_) {} };
        if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(runLegacy, { timeout: isMobilePowerSensitiveClient() ? 12000 : 4500 });
        else window.setTimeout(runLegacy, isMobilePowerSensitiveClient() ? 8000 : 1200);
      }
    } catch (_) {}
    try { if (!isMobilePowerSensitiveClient()) drainPendingXpActivityQueue("track-views-init"); } catch (_) {}
    trackView();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  document.addEventListener("DOMContentSwitch", init);
  document.addEventListener("navigation:load", init);
  window.addEventListener("online", () => { emitAutoSyncTimerChange(); }, { passive: true });
  window.addEventListener("focus", () => { emitAutoSyncTimerChange(); }, { passive: true });
  try {
    if (isMobilePowerSensitiveClient() && !document.getElementById("mk-mobile-low-heat-animation-style")) {
      const st = document.createElement("style");
      st.id = "mk-mobile-low-heat-animation-style";
      st.textContent = `
        @media (hover: none), (pointer: coarse), (max-width: 768px){
          html[data-mk-search-box-effect] .md-search__form::before,
          html[data-mk-search-box-effect] .md-search__form::after,
          html[data-mk-search-box-effect] .md-search__inner::before,
          html[data-mk-search-box-effect] .md-search__inner::after,
          html[data-mk-search-box-effect] .md-search-result::after{
            animation:none !important;
            filter:none !important;
            text-shadow:none !important;
          }
        }`;
      document.head && document.head.appendChild(st);
    }
  } catch (_) {}

})();


/* v57 visible search-box cosmetics: stronger real sparkle, blossom, and dragon-ball themes. */
(function(){
  try{
    if(document.getElementById('mk-search-box-effects-v57-visible')) return;
    const st=document.createElement('style');
    st.id='mk-search-box-effects-v57-visible';
    st.textContent=`
      html[data-mk-search-box-effect] .md-search,
      html[data-mk-search-box-effect] .md-search__inner,
      html[data-mk-search-box-effect] .md-search__form{
        position:relative !important;
        overflow:visible !important;
        isolation:isolate !important;
      }
      html[data-mk-search-box-effect] .md-search__form{ z-index:1 !important; }
      html[data-mk-search-box-effect] .md-search__form::before,
      html[data-mk-search-box-effect] .md-search__form::after,
      html[data-mk-search-box-effect] .md-search__inner::before,
      html[data-mk-search-box-effect] .md-search__inner::after{
        pointer-events:none !important;
        user-select:none !important;
      }

      /* Search Box Sparkle: visible star particles around the search input. */
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__form{
        border:1px solid rgba(250,204,21,.76) !important;
        background:
          radial-gradient(circle at 14% 45%, rgba(255,255,255,.72) 0 2px, transparent 3px),
          radial-gradient(circle at 72% 24%, rgba(250,204,21,.55) 0 3px, transparent 5px),
          linear-gradient(135deg, rgba(254,243,199,.42), rgba(255,255,255,.10)) !important;
        box-shadow:0 0 0 2px rgba(250,204,21,.32),0 0 26px rgba(250,204,21,.42),0 12px 34px rgba(15,23,42,.20) !important;
      }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__form::after{
        content:"✦ ✨ ✧" !important;
        position:absolute !important;
        right:10px !important;
        top:50% !important;
        transform:translateY(-50%) !important;
        z-index:3 !important;
        display:block !important;
        width:auto !important;
        height:auto !important;
        padding:0 !important;
        border:0 !important;
        background:transparent !important;
        color:#facc15 !important;
        font-size:18px !important;
        line-height:1 !important;
        letter-spacing:3px !important;
        text-shadow:0 0 8px rgba(250,204,21,.95),0 0 22px rgba(250,204,21,.58) !important;
        animation:mk-eorbit-search-sparkle-v57 1.05s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__inner::before{
        content:"✧" !important;
        position:absolute !important;
        z-index:4 !important;
        left:10px !important;
        top:-7px !important;
        color:#fde68a !important;
        font-size:16px !important;
        text-shadow:0 0 12px rgba(250,204,21,.88) !important;
        animation:mk-eorbit-search-float-v57 1.45s ease-in-out infinite !important;
      }

      /* Blossom Search Box: real sakura decorations, not just pink colour. */
      html[data-mk-search-box-effect="header_search_flower"] .md-search__form{
        border:1px solid rgba(244,114,182,.78) !important;
        border-radius:999px !important;
        background:
          radial-gradient(circle at 18% 32%, rgba(255,255,255,.7) 0 2px, transparent 4px),
          linear-gradient(135deg, rgba(253,242,248,.66), rgba(238,242,255,.24)) !important;
        box-shadow:0 0 0 2px rgba(244,114,182,.30),0 0 26px rgba(244,114,182,.38),0 12px 34px rgba(15,23,42,.18) !important;
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__form::after{
        content:"🌸" !important;
        position:absolute !important;
        right:13px !important;
        top:50% !important;
        transform:translateY(-50%) rotate(-8deg) !important;
        z-index:4 !important;
        font-size:22px !important;
        line-height:1 !important;
        filter:drop-shadow(0 0 9px rgba(244,114,182,.72)) !important;
        animation:mk-eorbit-blossom-sway-v57 2.2s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__inner::before{
        content:"❀" !important;
        position:absolute !important;
        left:8px !important;
        top:-9px !important;
        z-index:4 !important;
        color:#f472b6 !important;
        font-size:18px !important;
        text-shadow:0 0 10px rgba(244,114,182,.62) !important;
        animation:mk-eorbit-blossom-float-v57 2.8s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__inner::after{
        content:"✿" !important;
        position:absolute !important;
        right:54px !important;
        bottom:-9px !important;
        z-index:4 !important;
        color:#fb7185 !important;
        font-size:16px !important;
        text-shadow:0 0 10px rgba(251,113,133,.55) !important;
        animation:mk-eorbit-blossom-float-v57 3.1s ease-in-out infinite reverse !important;
      }

      /* Dragon Search Box: dragon + orange Dragon Ball with red stars. */
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__form{
        border:1px solid rgba(251,146,60,.86) !important;
        border-radius:999px !important;
        background:
          linear-gradient(135deg, rgba(255,237,213,.68), rgba(254,243,199,.32)),
          radial-gradient(circle at 88% 50%, rgba(251,191,36,.68), transparent 18px) !important;
        box-shadow:0 0 0 2px rgba(249,115,22,.28),0 0 28px rgba(249,115,22,.38),0 12px 34px rgba(15,23,42,.18) !important;
      }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__form::after{
        content:"★★★" !important;
        position:absolute !important;
        right:13px !important;
        top:50% !important;
        width:28px !important;
        height:28px !important;
        transform:translateY(-50%) !important;
        z-index:4 !important;
        display:grid !important;
        place-items:center !important;
        border-radius:50% !important;
        border:2px solid rgba(154,52,18,.36) !important;
        background:radial-gradient(circle at 35% 28%, #fde68a 0 16%, #fbbf24 36%, #f97316 78%, #ea580c 100%) !important;
        color:#dc2626 !important;
        font-size:7px !important;
        letter-spacing:-1px !important;
        line-height:1 !important;
        text-shadow:0 0 1px rgba(127,29,29,.45) !important;
        box-shadow:inset -4px -5px 8px rgba(124,45,18,.22),0 0 18px rgba(249,115,22,.72) !important;
        animation:mk-eorbit-dragon-ball-v57 2.6s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__inner::before{
        content:"🐉" !important;
        position:absolute !important;
        left:4px !important;
        top:-13px !important;
        z-index:4 !important;
        font-size:24px !important;
        line-height:1 !important;
        filter:drop-shadow(0 0 8px rgba(22,163,74,.35)) !important;
        animation:mk-eorbit-dragon-float-v57 3.2s ease-in-out infinite !important;
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_flower"] .md-search__form,
      body[data-md-color-scheme="slate"] html[data-mk-search-box-effect="header_search_flower"] .md-search__form{
        background:linear-gradient(135deg,rgba(76,29,149,.62),rgba(30,41,59,.88)) !important;
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_dragon"] .md-search__form{
        background:linear-gradient(135deg,rgba(67,20,7,.72),rgba(30,41,59,.90)) !important;
      }
      @keyframes mk-eorbit-search-sparkle-v57{0%,100%{opacity:.72;transform:translateY(-50%) scale(.92) rotate(-5deg)}50%{opacity:1;transform:translateY(-50%) scale(1.12) rotate(5deg)}}
      @keyframes mk-eorbit-search-float-v57{0%,100%{opacity:.6;transform:translateY(0) rotate(0)}50%{opacity:1;transform:translateY(-4px) rotate(18deg)}}
      @keyframes mk-eorbit-blossom-sway-v57{0%,100%{transform:translateY(-50%) rotate(-10deg) scale(.98)}50%{transform:translateY(-56%) rotate(9deg) scale(1.08)}}
      @keyframes mk-eorbit-blossom-float-v57{0%,100%{opacity:.72;transform:translateY(0) rotate(-8deg)}50%{opacity:1;transform:translateY(-5px) rotate(12deg)}}
      @keyframes mk-eorbit-dragon-ball-v57{0%,100%{transform:translateY(-50%) rotate(-8deg) scale(.98)}50%{transform:translateY(-50%) rotate(10deg) scale(1.08)}}
      @keyframes mk-eorbit-dragon-float-v57{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(-4px) translateX(3px)}}


      /* v61: keep the mobile top-search layout intact.
         The real rounded surfaces are .mk-search-history for history and
         .md-search__scrollwrap for result suggestions.  .md-search__output is
         only a positioning shell, so visual skins must not paint or resize it. */
      html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search-result{
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
        filter:none !important;
        padding:0 !important;
        margin:0 !important;
        overflow:visible !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search__output{
        position:absolute !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__output::before,
      html[data-mk-search-box-effect] .md-header .md-search__output::after,
      html[data-mk-search-box-effect] .md-header .md-search-result::before,
      html[data-mk-search-box-effect] .md-header .md-search-result::after{
        display:none !important;
        content:none !important;
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap,
      html[data-mk-search-box-effect] .md-header .md-search__inner.mk-search-result-open > .md-search__output .md-search__scrollwrap{
        position:relative !important;
        overflow:hidden !important;
        border-radius:var(--mk-header-search-radius,18px) !important;
        background:var(--mk-search-effect-surface, var(--md-default-bg-color)) !important;
        border:1px solid var(--mk-search-effect-border, rgba(148,163,184,.18)) !important;
        box-shadow:var(--mk-search-effect-shadow, var(--md-shadow-z3)) !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        -webkit-mask-image:-webkit-radial-gradient(white, black) !important;
        mask-image:radial-gradient(white, black) !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__list,
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result__list,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__panel,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__scroll,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__list{
        background:transparent !important;
        border-color:color-mix(in srgb,var(--mk-search-effect-border, rgba(148,163,184,.18)) 55%, transparent) !important;
        box-shadow:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer{
        background:var(--mk-search-effect-footer, rgba(255,255,255,.05)) !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect] .md-header .mk-search-history::before,
      html[data-mk-search-box-effect] .md-header .mk-search-history::after{
        position:absolute !important;
        z-index:0 !important;
        pointer-events:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap > *,
      html[data-mk-search-box-effect] .md-header .mk-search-history > *{
        position:relative !important;
        z-index:1 !important;
      }
      html[data-mk-search-box-effect="header_search_sparkle"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(255,251,235,.98),rgba(254,243,199,.94));
        --mk-search-effect-border:rgba(250,204,21,.46);
        --mk-search-effect-shadow:0 14px 42px rgba(250,204,21,.16),0 16px 44px rgba(15,23,42,.16);
        --mk-search-effect-footer:rgba(250,204,21,.10);
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_sparkle"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(24,24,27,.98),rgba(67,56,18,.92));
        --mk-search-effect-footer:rgba(250,204,21,.08);
      }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_sparkle"] .md-header .mk-search-history::after{
        content:"✦   ✧   ✨" !important;
        right:16px !important;
        bottom:12px !important;
        color:#facc15 !important;
        font-size:18px !important;
        text-shadow:0 0 12px rgba(250,204,21,.78),0 0 26px rgba(250,204,21,.38) !important;
        animation:mk-sparkle-row-v58 1.1s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_flower"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(253,242,248,.98),rgba(255,228,230,.94));
        --mk-search-effect-border:rgba(244,114,182,.38);
        --mk-search-effect-shadow:0 14px 42px rgba(244,114,182,.14),0 16px 44px rgba(15,23,42,.14);
        --mk-search-effect-footer:rgba(244,114,182,.10);
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_flower"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(30,41,59,.98),rgba(76,29,149,.90));
        --mk-search-effect-footer:rgba(244,114,182,.08);
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect="header_search_flower"] .md-header .mk-search-history::before{
        content:"🌸" !important;
        right:16px !important;
        top:12px !important;
        font-size:22px !important;
        filter:drop-shadow(0 0 9px rgba(244,114,182,.42)) !important;
        animation:mk-blossom-float-v58 2.6s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_flower"] .md-header .mk-search-history::after{
        content:"❀   ✿" !important;
        left:18px !important;
        bottom:12px !important;
        color:#f472b6 !important;
        font-size:17px !important;
        opacity:.78 !important;
      }
      html[data-mk-search-box-effect="header_search_dragon"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(255,237,213,.98),rgba(254,243,199,.94));
        --mk-search-effect-border:rgba(249,115,22,.40);
        --mk-search-effect-shadow:0 14px 42px rgba(249,115,22,.15),0 16px 44px rgba(15,23,42,.15);
        --mk-search-effect-footer:rgba(249,115,22,.10);
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_dragon"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(30,41,59,.98),rgba(67,20,7,.92));
        --mk-search-effect-footer:rgba(249,115,22,.08);
      }
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .mk-search-history::before{
        content:"🐉" !important;
        right:18px !important;
        top:12px !important;
        font-size:25px !important;
        opacity:.78 !important;
        filter:drop-shadow(0 0 9px rgba(34,197,94,.35)) !important;
        animation:mk-dragon-float-v58 3.1s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .mk-search-history::after{
        content:"★★★" !important;
        right:18px !important;
        bottom:14px !important;
        width:27px !important;
        height:27px !important;
        border-radius:999px !important;
        display:grid !important;
        place-items:center !important;
        font-size:7px !important;
        color:#dc2626 !important;
        background:radial-gradient(circle at 34% 26%,#fde68a 0 15%,#fbbf24 34%,#f97316 72%,#ea580c 100%) !important;
        box-shadow:0 0 18px rgba(249,115,22,.55) !important;
      }
      @media screen and (max-width:59.984375em){
        html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output{
          top:calc(2.4rem + var(--mk-header-search-gap,4px)) !important;
          left:0 !important;
          right:0 !important;
          width:auto !important;
          transform:none !important;
        }
        html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history,
        html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap{
          max-height:calc(100dvh - 2.4rem - 12px) !important;
          border-radius:var(--mk-header-search-mobile-radius,18px) !important;
        }
      }

    `;
    (document.head||document.documentElement).appendChild(st);
  }catch(_){ }
})();


/* v58 cosmetic polish: stronger search themes, mode-specific page coverage, safer glass flyouts, profile modal header. */
(function(){
  try{
    if(document.getElementById('mk-cosmetic-polish-v58')) return;
    var st=document.createElement('style');
    st.id='mk-cosmetic-polish-v58';
    st.textContent=`
      html[data-mk-search-box-effect] .md-search,
      html[data-mk-search-box-effect] [data-md-component="search"]{ position:relative !important; overflow:visible !important; }
      html[data-mk-search-box-effect] .md-search__form,
      html[data-mk-search-box-effect] .md-search__inner{ overflow:visible !important; position:relative !important; }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__form{
        border:2px solid rgba(250,204,21,.92) !important;
        background:linear-gradient(135deg,rgba(255,251,235,.72),rgba(255,255,255,.18)) !important;
        box-shadow:0 0 0 3px rgba(250,204,21,.32),0 0 18px rgba(250,204,21,.90),0 0 44px rgba(250,204,21,.58),0 14px 42px rgba(15,23,42,.22) !important;
        animation:mk-search-glow-v58 1.55s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__form::before{
        content:"✦" !important; position:absolute !important; left:-12px !important; top:-13px !important; z-index:5 !important;
        width:auto !important; height:auto !important; background:transparent !important; color:#fde68a !important; font-size:24px !important;
        text-shadow:0 0 8px #facc15,0 0 20px rgba(250,204,21,.9) !important; animation:mk-star-float-v58 1.2s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__form::after{
        content:"✧ ✦ ✨" !important; position:absolute !important; right:-14px !important; top:-15px !important; z-index:5 !important;
        color:#facc15 !important; font-size:20px !important; letter-spacing:4px !important; text-shadow:0 0 10px #facc15,0 0 26px rgba(250,204,21,.85) !important;
        animation:mk-sparkle-row-v58 1.05s ease-in-out infinite !important; pointer-events:none !important;
      }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__input{ text-shadow:0 0 12px rgba(250,204,21,.28) !important; }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_sparkle"] .md-search__form{
        background:linear-gradient(135deg,rgba(30,41,59,.96),rgba(67,56,18,.62)) !important;
        box-shadow:0 0 0 3px rgba(250,204,21,.30),0 0 22px rgba(250,204,21,.74),0 0 52px rgba(250,204,21,.46) !important;
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__form::before{ content:"🌸" !important; position:absolute !important; left:-12px !important; top:-16px !important; z-index:5 !important; width:auto !important; height:auto !important; background:transparent !important; font-size:25px !important; filter:drop-shadow(0 0 10px rgba(244,114,182,.86)) !important; animation:mk-blossom-float-v58 2.2s ease-in-out infinite !important; }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__form::after{ content:"🌸 ❀ 🌸" !important; right:-12px !important; top:-14px !important; color:#f472b6 !important; font-size:20px !important; text-shadow:0 0 10px rgba(244,114,182,.75) !important; animation:mk-blossom-float-v58 2.6s ease-in-out infinite reverse !important; }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__inner::before{ content:"🐉" !important; position:absolute !important; left:-18px !important; top:-18px !important; z-index:6 !important; font-size:30px !important; filter:drop-shadow(0 0 9px rgba(34,197,94,.45)) !important; animation:mk-dragon-float-v58 3.1s ease-in-out infinite !important; }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__form::after{ content:"★★★" !important; right:-12px !important; top:-13px !important; width:34px !important; height:34px !important; display:grid !important; place-items:center !important; border-radius:999px !important; border:2px solid rgba(124,45,18,.32) !important; background:radial-gradient(circle at 34% 26%,#fde68a 0 15%,#fbbf24 34%,#f97316 72%,#ea580c 100%) !important; color:#dc2626 !important; font-size:8px !important; letter-spacing:-1px !important; box-shadow:inset -5px -6px 9px rgba(124,45,18,.24),0 0 22px rgba(249,115,22,.82) !important; animation:mk-dragonball-v58 2.2s ease-in-out infinite !important; }
      html[data-mk-header-font="header_font_serif"]{ --mk-header-font-family:Georgia,'Times New Roman',serif; }
      html[data-mk-body-font="body_font_serif"]{ --mk-body-font-family:Georgia,'Times New Roman',serif; }
      html[data-mk-header-font="header_font_rounded"]{ --mk-header-font-family:'Arial Rounded MT Bold','Nunito','Trebuchet MS',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_rounded"]{ --mk-body-font-family:'Arial Rounded MT Bold','Nunito','Trebuchet MS',system-ui,sans-serif; }
      html[data-mk-header-font="header_font_geometric"]{ --mk-header-font-family:Avenir Next,Montserrat,Futura,'Century Gothic','Segoe UI',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_geometric"]{ --mk-body-font-family:Avenir Next,Montserrat,Futura,'Century Gothic','Segoe UI',system-ui,sans-serif; }
      html[data-mk-header-font="header_font_humanist"]{ --mk-header-font-family:Optima,Candara,'Segoe UI',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_humanist"]{ --mk-body-font-family:Optima,Candara,'Segoe UI',system-ui,sans-serif; }
      html[data-mk-header-font="header_font_editorial"]{ --mk-header-font-family:Baskerville,'Libre Baskerville','Times New Roman',Georgia,serif; }
      html[data-mk-body-font="body_font_editorial"]{ --mk-body-font-family:Baskerville,'Libre Baskerville','Times New Roman',Georgia,serif; }
      html[data-mk-header-font="header_font_slab"]{ --mk-header-font-family:Rockwell,'Roboto Slab','Courier New',Georgia,serif; }
      html[data-mk-body-font="body_font_slab"]{ --mk-body-font-family:Rockwell,'Roboto Slab','Courier New',Georgia,serif; }
      html[data-mk-header-font="header_font_condensed"]{ --mk-header-font-family:'Arial Narrow','Roboto Condensed','Segoe UI Condensed','Helvetica Neue',Arial,sans-serif; }
      html[data-mk-body-font="body_font_condensed"]{ --mk-body-font-family:'Arial Narrow','Roboto Condensed','Segoe UI Condensed','Helvetica Neue',Arial,sans-serif; }
      html[data-mk-header-font="header_font_mono"]{ --mk-header-font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace; }
      html[data-mk-body-font="body_font_mono"]{ --mk-body-font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace; }
      html[data-mk-header-font="header_font_elegant"]{ --mk-header-font-family:Palatino,'Palatino Linotype','Book Antiqua',Georgia,serif; }
      html[data-mk-body-font="body_font_elegant"]{ --mk-body-font-family:Palatino,'Palatino Linotype','Book Antiqua',Georgia,serif; }
      html[data-mk-header-font="header_font_playful"]{ --mk-header-font-family:'Trebuchet MS','Comic Sans MS','Segoe Print',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_playful"]{ --mk-body-font-family:'Trebuchet MS','Comic Sans MS','Segoe Print',system-ui,sans-serif; }
      html[data-mk-header-font^="header_font_"] :where(.md-header,.md-header *,.md-tabs,.md-tabs *,.mk-random-tabs-menu,.mk-random-tabs-menu *,.mk-header-dropdown,.mk-header-dropdown *,.mk-rt-menu,.mk-rt-menu *,.mk-rt-trigger,.mk-rt-trigger *,.mk-rt-panel,.mk-rt-panel *,#random-dropdown-panel,#random-dropdown-panel *,#year-dropdown-panel,#year-dropdown-panel *,#rf-year-course-popover-v4,#rf-year-course-popover-v4 *,article.md-content__inner h1,article.md-content__inner h1 *,article.md-content__inner h2,article.md-content__inner h2 *,.md-search,.md-search *,input.md-search__input){ font-family:var(--mk-header-font-family) !important; }
      html[data-mk-header-font^="header_font_"] .md-search__input::placeholder{ font-family:var(--mk-header-font-family) !important; }
      html[data-mk-body-font^="body_font_"] body :where(.md-main,.md-main *,.md-content,.md-content *,.md-sidebar,.md-sidebar *,#current-course-bar,#current-course-bar *,#mk-sidebar-sortdock,#mk-sidebar-sortdock *,#mk-mobile-unified-sidebar-surface,#mk-mobile-unified-sidebar-surface *,#comments,#comments *,.mk-page-comments,.mk-page-comments *,.mk-local-activity-modal,.mk-local-activity-modal *,.mk-account-panel,.mk-account-panel *):not(:where(.md-header,.md-header *,.md-tabs,.md-tabs *,h1,h1 *,h2,h2 *,h3,h3 *,h4,h4 *,h5,h5 *,h6,h6 *,code,code *,pre,pre *,kbd,kbd *,samp,samp *,.arithmatex,.arithmatex *,.MathJax,.MathJax *,.katex,.katex *,.katex-display,.katex-display *,mjx-container,mjx-container *,[class^="mjx-"],[class*=" mjx-"])){ font-family:var(--mk-body-font-family) !important; }
      html[data-mk-dropdown-skin="dropdown_glass"]{ --mk-header-panel-bg-glass-v58:linear-gradient(135deg,rgba(30,64,175,.50),rgba(13,148,136,.42),rgba(79,70,229,.46)); }
      html[data-mk-dropdown-skin="dropdown_glass"] .mk-rt-panel,
      html[data-mk-dropdown-skin="dropdown_glass"] #random-dropdown-panel,
      html[data-mk-dropdown-skin="dropdown_glass"] #year-dropdown-panel,
      html[data-mk-dropdown-skin="dropdown_glass"] #rf-year-course-popover-v4{ backdrop-filter:blur(5px) saturate(1.04) !important; -webkit-backdrop-filter:blur(5px) saturate(1.04) !important; background:var(--mk-header-panel-bg-glass-v58) !important; overflow:visible !important; }
      html[data-mk-dropdown-skin="dropdown_glass"] #rf-year-course-popover-v4.rf-year-course-popover-open-v4{ display:block !important; opacity:1 !important; visibility:visible !important; pointer-events:auto !important; z-index:2147483000 !important; }
      html[data-mk-page-effect] .md-sidebar,
      html[data-mk-page-effect] .md-sidebar__scrollwrap,
      html[data-mk-page-effect] .md-sidebar .md-nav,
      html[data-mk-page-effect] .md-sidebar .md-nav__title,
      html[data-mk-page-effect] .md-sidebar .md-nav__list,
      html[data-mk-page-effect] .md-sidebar [class*="course"],
      html[data-mk-page-effect] .md-sidebar [class*="sidebar"]{ background:transparent !important; box-shadow:none !important; }
      html[data-mk-profile-frame] .mk-public-profile-modal .mk-local-activity-head,
      html[data-mk-profile-frame] .mk-public-profile-modal .mk-local-activity-header,
      html[data-mk-profile-background] .mk-public-profile-modal .mk-local-activity-head,
      html[data-mk-profile-background] .mk-public-profile-modal .mk-local-activity-header{ background:color-mix(in srgb,var(--md-default-bg-color) 72%,transparent) !important; backdrop-filter:blur(12px) saturate(1.08) !important; -webkit-backdrop-filter:blur(12px) saturate(1.08) !important; border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent) !important; }
      html[data-mk-profile-frame="profile_frame_neon"] .mk-public-profile-modal .mk-local-activity-head,
      html[data-mk-profile-frame="profile_frame_neon"] .mk-public-profile-modal .mk-local-activity-header{ background:linear-gradient(135deg,rgba(20,184,166,.18),rgba(124,58,237,.12)) !important; }
      html[data-mk-profile-frame="profile_frame_glow"] .mk-public-profile-modal .mk-local-activity-head,
      html[data-mk-profile-frame="profile_frame_glow"] .mk-public-profile-modal .mk-local-activity-header{ background:linear-gradient(135deg,rgba(250,204,21,.18),rgba(255,255,255,.08)) !important; }
      @keyframes mk-search-glow-v58{0%,100%{filter:brightness(1)}50%{filter:brightness(1.08)}}
      @keyframes mk-star-float-v58{0%,100%{opacity:.72;transform:translateY(0) rotate(0) scale(.9)}50%{opacity:1;transform:translateY(-4px) rotate(18deg) scale(1.15)}}
      @keyframes mk-sparkle-row-v58{0%,100%{opacity:.55;transform:translateY(0) scale(.9)}50%{opacity:1;transform:translateY(-3px) scale(1.12)}}
      @keyframes mk-blossom-float-v58{0%,100%{transform:translateY(0) rotate(-6deg) scale(.95)}50%{transform:translateY(-5px) rotate(10deg) scale(1.08)}}
      @keyframes mk-dragon-float-v58{0%,100%{transform:translate(0,0) rotate(-4deg)}50%{transform:translate(5px,-4px) rotate(6deg)}}
      @keyframes mk-dragonball-v58{0%,100%{transform:rotate(-8deg) scale(.96)}50%{transform:rotate(10deg) scale(1.08)}}


      /* v61: keep the mobile top-search layout intact.
         The real rounded surfaces are .mk-search-history for history and
         .md-search__scrollwrap for result suggestions.  .md-search__output is
         only a positioning shell, so visual skins must not paint or resize it. */
      html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search-result{
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
        filter:none !important;
        padding:0 !important;
        margin:0 !important;
        overflow:visible !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search__output{
        position:absolute !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__output::before,
      html[data-mk-search-box-effect] .md-header .md-search__output::after,
      html[data-mk-search-box-effect] .md-header .md-search-result::before,
      html[data-mk-search-box-effect] .md-header .md-search-result::after{
        display:none !important;
        content:none !important;
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap,
      html[data-mk-search-box-effect] .md-header .md-search__inner.mk-search-result-open > .md-search__output .md-search__scrollwrap{
        position:relative !important;
        overflow:hidden !important;
        border-radius:var(--mk-header-search-radius,18px) !important;
        background:var(--mk-search-effect-surface, var(--md-default-bg-color)) !important;
        border:1px solid var(--mk-search-effect-border, rgba(148,163,184,.18)) !important;
        box-shadow:var(--mk-search-effect-shadow, var(--md-shadow-z3)) !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        -webkit-mask-image:-webkit-radial-gradient(white, black) !important;
        mask-image:radial-gradient(white, black) !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__list,
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result__list,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__panel,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__scroll,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__list{
        background:transparent !important;
        border-color:color-mix(in srgb,var(--mk-search-effect-border, rgba(148,163,184,.18)) 55%, transparent) !important;
        box-shadow:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer{
        background:var(--mk-search-effect-footer, rgba(255,255,255,.05)) !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect] .md-header .mk-search-history::before,
      html[data-mk-search-box-effect] .md-header .mk-search-history::after{
        position:absolute !important;
        z-index:0 !important;
        pointer-events:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap > *,
      html[data-mk-search-box-effect] .md-header .mk-search-history > *{
        position:relative !important;
        z-index:1 !important;
      }
      html[data-mk-search-box-effect="header_search_sparkle"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(255,251,235,.98),rgba(254,243,199,.94));
        --mk-search-effect-border:rgba(250,204,21,.46);
        --mk-search-effect-shadow:0 14px 42px rgba(250,204,21,.16),0 16px 44px rgba(15,23,42,.16);
        --mk-search-effect-footer:rgba(250,204,21,.10);
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_sparkle"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(24,24,27,.98),rgba(67,56,18,.92));
        --mk-search-effect-footer:rgba(250,204,21,.08);
      }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_sparkle"] .md-header .mk-search-history::after{
        content:"✦   ✧   ✨" !important;
        right:16px !important;
        bottom:12px !important;
        color:#facc15 !important;
        font-size:18px !important;
        text-shadow:0 0 12px rgba(250,204,21,.78),0 0 26px rgba(250,204,21,.38) !important;
        animation:mk-sparkle-row-v58 1.1s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_flower"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(253,242,248,.98),rgba(255,228,230,.94));
        --mk-search-effect-border:rgba(244,114,182,.38);
        --mk-search-effect-shadow:0 14px 42px rgba(244,114,182,.14),0 16px 44px rgba(15,23,42,.14);
        --mk-search-effect-footer:rgba(244,114,182,.10);
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_flower"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(30,41,59,.98),rgba(76,29,149,.90));
        --mk-search-effect-footer:rgba(244,114,182,.08);
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect="header_search_flower"] .md-header .mk-search-history::before{
        content:"🌸" !important;
        right:16px !important;
        top:12px !important;
        font-size:22px !important;
        filter:drop-shadow(0 0 9px rgba(244,114,182,.42)) !important;
        animation:mk-blossom-float-v58 2.6s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_flower"] .md-header .mk-search-history::after{
        content:"❀   ✿" !important;
        left:18px !important;
        bottom:12px !important;
        color:#f472b6 !important;
        font-size:17px !important;
        opacity:.78 !important;
      }
      html[data-mk-search-box-effect="header_search_dragon"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(255,237,213,.98),rgba(254,243,199,.94));
        --mk-search-effect-border:rgba(249,115,22,.40);
        --mk-search-effect-shadow:0 14px 42px rgba(249,115,22,.15),0 16px 44px rgba(15,23,42,.15);
        --mk-search-effect-footer:rgba(249,115,22,.10);
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_dragon"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(30,41,59,.98),rgba(67,20,7,.92));
        --mk-search-effect-footer:rgba(249,115,22,.08);
      }
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .mk-search-history::before{
        content:"🐉" !important;
        right:18px !important;
        top:12px !important;
        font-size:25px !important;
        opacity:.78 !important;
        filter:drop-shadow(0 0 9px rgba(34,197,94,.35)) !important;
        animation:mk-dragon-float-v58 3.1s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .mk-search-history::after{
        content:"★★★" !important;
        right:18px !important;
        bottom:14px !important;
        width:27px !important;
        height:27px !important;
        border-radius:999px !important;
        display:grid !important;
        place-items:center !important;
        font-size:7px !important;
        color:#dc2626 !important;
        background:radial-gradient(circle at 34% 26%,#fde68a 0 15%,#fbbf24 34%,#f97316 72%,#ea580c 100%) !important;
        box-shadow:0 0 18px rgba(249,115,22,.55) !important;
      }
      @media screen and (max-width:59.984375em){
        html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output{
          top:calc(2.4rem + var(--mk-header-search-gap,4px)) !important;
          left:0 !important;
          right:0 !important;
          width:auto !important;
          transform:none !important;
        }
        html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history,
        html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap{
          max-height:calc(100dvh - 2.4rem - 12px) !important;
          border-radius:var(--mk-header-search-mobile-radius,18px) !important;
        }
      }

    `;
    (document.head||document.documentElement).appendChild(st);
  }catch(_){ }
})();


/* v60 search/header skin cleanup: no preview side effects, cleaner search themes, dropdown/history coverage. */
(function(){
  try{
    if(document.getElementById('mk-cosmetic-v60-search-header')) return;
    var st=document.createElement('style');
    st.id='mk-cosmetic-v60-search-header';
    st.textContent=`
      html[data-mk-header-skin="header_skin_blossom"]{
        --mk-header-panel-bg:linear-gradient(135deg,#831843 0%,#db2777 45%,#f9a8d4 100%);
        --mk-header-panel-bg-glass:linear-gradient(135deg,rgba(131,24,67,.82),rgba(219,39,119,.72),rgba(249,168,212,.56));
        --mk-header-panel-border:rgba(251,207,232,.42);
        --mk-header-panel-shadow:0 18px 52px rgba(131,24,67,.32),inset 0 0 0 1px rgba(255,255,255,.08);
      }
      html[data-mk-header-skin="header_skin_dragon"]{
        --mk-header-panel-bg:linear-gradient(90deg,#0f766e 0%,#f97316 46%,#facc15 72%,#7c2d12 100%);
        --mk-header-panel-bg-glass:linear-gradient(135deg,rgba(15,118,110,.76),rgba(249,115,22,.70),rgba(250,204,21,.52));
        --mk-header-panel-border:rgba(253,186,116,.48);
        --mk-header-panel-shadow:0 18px 52px rgba(124,45,18,.32),inset 0 0 0 1px rgba(255,255,255,.08);
      }
      html[data-mk-header-skin="header_skin_blossom"] .md-header,
      html[data-mk-header-skin="header_skin_blossom"] .md-tabs{ background:linear-gradient(90deg,#831843,#db2777,#f9a8d4) !important; }
      html[data-mk-header-skin="header_skin_dragon"] .md-header,
      html[data-mk-header-skin="header_skin_dragon"] .md-tabs{ background:linear-gradient(90deg,#0f766e,#f97316,#facc15,#7c2d12) !important; }
      html[data-mk-header-skin="header_skin_blossom"] .md-header::after{ content:"🌸  ❀"; position:absolute; right:16px; top:50%; transform:translateY(-50%); opacity:.55; font-size:18px; pointer-events:none; }
      html[data-mk-header-skin="header_skin_dragon"] .md-header::after{ content:"🐉   ★"; position:absolute; right:16px; top:50%; transform:translateY(-50%); opacity:.72; font-size:18px; pointer-events:none; }

      html[data-mk-header-font="header_font_serif"]{ --mk-header-font-family:Georgia,'Times New Roman',serif; }
      html[data-mk-body-font="body_font_serif"]{ --mk-body-font-family:Georgia,'Times New Roman',serif; }
      html[data-mk-header-font="header_font_rounded"]{ --mk-header-font-family:'Arial Rounded MT Bold','Nunito','Trebuchet MS',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_rounded"]{ --mk-body-font-family:'Arial Rounded MT Bold','Nunito','Trebuchet MS',system-ui,sans-serif; }
      html[data-mk-header-font="header_font_geometric"]{ --mk-header-font-family:Avenir Next,Montserrat,Futura,'Century Gothic','Segoe UI',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_geometric"]{ --mk-body-font-family:Avenir Next,Montserrat,Futura,'Century Gothic','Segoe UI',system-ui,sans-serif; }
      html[data-mk-header-font="header_font_humanist"]{ --mk-header-font-family:Optima,Candara,'Segoe UI',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_humanist"]{ --mk-body-font-family:Optima,Candara,'Segoe UI',system-ui,sans-serif; }
      html[data-mk-header-font="header_font_editorial"]{ --mk-header-font-family:Baskerville,'Libre Baskerville','Times New Roman',Georgia,serif; }
      html[data-mk-body-font="body_font_editorial"]{ --mk-body-font-family:Baskerville,'Libre Baskerville','Times New Roman',Georgia,serif; }
      html[data-mk-header-font="header_font_slab"]{ --mk-header-font-family:Rockwell,'Roboto Slab','Courier New',Georgia,serif; }
      html[data-mk-body-font="body_font_slab"]{ --mk-body-font-family:Rockwell,'Roboto Slab','Courier New',Georgia,serif; }
      html[data-mk-header-font="header_font_condensed"]{ --mk-header-font-family:'Arial Narrow','Roboto Condensed','Segoe UI Condensed','Helvetica Neue',Arial,sans-serif; }
      html[data-mk-body-font="body_font_condensed"]{ --mk-body-font-family:'Arial Narrow','Roboto Condensed','Segoe UI Condensed','Helvetica Neue',Arial,sans-serif; }
      html[data-mk-header-font="header_font_mono"]{ --mk-header-font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace; }
      html[data-mk-body-font="body_font_mono"]{ --mk-body-font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace; }
      html[data-mk-header-font="header_font_elegant"]{ --mk-header-font-family:Palatino,'Palatino Linotype','Book Antiqua',Georgia,serif; }
      html[data-mk-body-font="body_font_elegant"]{ --mk-body-font-family:Palatino,'Palatino Linotype','Book Antiqua',Georgia,serif; }
      html[data-mk-header-font="header_font_playful"]{ --mk-header-font-family:'Trebuchet MS','Comic Sans MS','Segoe Print',system-ui,sans-serif; }
      html[data-mk-body-font="body_font_playful"]{ --mk-body-font-family:'Trebuchet MS','Comic Sans MS','Segoe Print',system-ui,sans-serif; }
      html[data-mk-header-font^="header_font_"] :where(.md-header,.md-header *,.md-tabs,.md-tabs *,.mk-random-tabs-menu,.mk-random-tabs-menu *,.mk-header-dropdown,.mk-header-dropdown *,.mk-rt-menu,.mk-rt-menu *,.mk-rt-trigger,.mk-rt-trigger *,.mk-rt-panel,.mk-rt-panel *,#random-dropdown-panel,#random-dropdown-panel *,#year-dropdown-panel,#year-dropdown-panel *,#rf-year-course-popover-v4,#rf-year-course-popover-v4 *,article.md-content__inner h1,article.md-content__inner h1 *,article.md-content__inner h2,article.md-content__inner h2 *,.md-search,.md-search *,input.md-search__input){ font-family:var(--mk-header-font-family) !important; }
      html[data-mk-header-font^="header_font_"] .md-search__input::placeholder{ font-family:var(--mk-header-font-family) !important; }
      html[data-mk-body-font^="body_font_"] body :where(.md-main,.md-main *,.md-content,.md-content *,.md-sidebar,.md-sidebar *,#current-course-bar,#current-course-bar *,#mk-sidebar-sortdock,#mk-sidebar-sortdock *,#mk-mobile-unified-sidebar-surface,#mk-mobile-unified-sidebar-surface *,#comments,#comments *,.mk-page-comments,.mk-page-comments *,.mk-local-activity-modal,.mk-local-activity-modal *,.mk-account-panel,.mk-account-panel *):not(:where(.md-header,.md-header *,.md-tabs,.md-tabs *,h1,h1 *,h2,h2 *,h3,h3 *,h4,h4 *,h5,h5 *,h6,h6 *,code,code *,pre,pre *,kbd,kbd *,samp,samp *,.arithmatex,.arithmatex *,.MathJax,.MathJax *,.katex,.katex *,.katex-display,.katex-display *,mjx-container,mjx-container *,[class^="mjx-"],[class*=" mjx-"])){ font-family:var(--mk-body-font-family) !important; }

      html[data-mk-search-box-effect] .md-search,
      html[data-mk-search-box-effect] .md-search__inner,
      html[data-mk-search-box-effect] .md-search__form{ overflow:visible !important; }
      html[data-mk-search-box-effect] .md-search__output,
      html[data-mk-search-box-effect] .md-search-result,
      html[data-mk-search-box-effect] .md-search__scrollwrap{
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        overflow:visible !important;
        position:relative !important;
        border-radius:18px !important;
      }
      html[data-mk-search-box-effect] .md-search-result__item,
      html[data-mk-search-box-effect] .md-search-result__link,
      html[data-mk-search-box-effect] .md-search-result__meta{ position:relative !important; z-index:1 !important; }

      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__form{
        border:2px solid rgba(250,204,21,.98) !important;
        background:linear-gradient(135deg,rgba(255,251,235,.84),rgba(254,243,199,.32)) !important;
        box-shadow:0 0 0 2px rgba(250,204,21,.38),0 0 20px rgba(250,204,21,.95),0 0 54px rgba(250,204,21,.56),0 12px 34px rgba(15,23,42,.20) !important;
      }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__output,
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search-result,
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__scrollwrap{
        background:linear-gradient(135deg,color-mix(in srgb,var(--md-default-bg-color) 84%,#fef3c7 16%),color-mix(in srgb,var(--md-default-bg-color) 92%,#ffffff 8%)) !important;
        border:1px solid rgba(250,204,21,.38) !important;
        box-shadow:0 14px 42px rgba(250,204,21,.18),0 16px 44px rgba(15,23,42,.18) !important;
      }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search__output::after,
      html[data-mk-search-box-effect="header_search_sparkle"] .md-search-result::after{ content:"✦   ✧   ✨"; position:absolute; right:18px; bottom:12px; color:#facc15; font-size:18px; text-shadow:0 0 12px rgba(250,204,21,.78); pointer-events:none; animation:mk-sparkle-row-v58 1.1s ease-in-out infinite; }

      html[data-mk-search-box-effect="header_search_flower"] .md-search__form{
        border:2px solid rgba(244,114,182,.76) !important;
        outline:0 !important;
        background:linear-gradient(135deg,rgba(253,242,248,.86),rgba(255,255,255,.18)) !important;
        box-shadow:0 0 0 1px rgba(244,114,182,.24),0 0 24px rgba(244,114,182,.34),0 12px 34px rgba(15,23,42,.18) !important;
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__inner::before,
      html[data-mk-search-box-effect="header_search_flower"] .md-search__inner::after{ display:none !important; content:none !important; }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__form::before{ content:"🌸" !important; left:-10px !important; top:-13px !important; background:transparent !important; box-shadow:none !important; }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__form::after{ content:"❀  🌸" !important; right:10px !important; top:50% !important; transform:translateY(-50%) !important; width:auto !important; height:auto !important; border:0 !important; background:transparent !important; color:#f472b6 !important; font-size:18px !important; box-shadow:none !important; }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__output,
      html[data-mk-search-box-effect="header_search_flower"] .md-search-result,
      html[data-mk-search-box-effect="header_search_flower"] .md-search__scrollwrap{
        background:linear-gradient(135deg,color-mix(in srgb,var(--md-default-bg-color) 80%,#fdf2f8 20%),color-mix(in srgb,var(--md-default-bg-color) 90%,#ffe4e6 10%)) !important;
        border:1px solid rgba(244,114,182,.34) !important;
        box-shadow:0 14px 42px rgba(244,114,182,.15),0 16px 44px rgba(15,23,42,.16) !important;
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__output::before,
      html[data-mk-search-box-effect="header_search_flower"] .md-search-result::before{ content:"🌸"; position:absolute; right:18px; top:14px; font-size:22px; opacity:.88; pointer-events:none; filter:drop-shadow(0 0 9px rgba(244,114,182,.42)); }
      html[data-mk-search-box-effect="header_search_flower"] .md-search__output::after,
      html[data-mk-search-box-effect="header_search_flower"] .md-search-result::after{ content:"❀   ✿"; position:absolute; left:18px; bottom:12px; color:#f472b6; font-size:17px; opacity:.72; pointer-events:none; }

      html[data-mk-search-box-effect="header_search_dragon"] .md-search__form{
        border:2px solid rgba(251,146,60,.78) !important;
        outline:0 !important;
        background:linear-gradient(135deg,rgba(255,237,213,.88),rgba(254,243,199,.40)) !important;
        box-shadow:0 0 0 1px rgba(249,115,22,.24),0 0 24px rgba(249,115,22,.34),0 12px 34px rgba(15,23,42,.18) !important;
      }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__inner::before{ content:"🐉" !important; left:-16px !important; top:-12px !important; display:block !important; }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__inner::after{ display:none !important; content:none !important; }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__form::after{ content:"★★★" !important; right:18px !important; top:78% !important; width:28px !important; height:28px !important; transform:translateY(-50%) !important; border-radius:999px !important; background:radial-gradient(circle at 34% 26%,#fde68a 0 15%,#fbbf24 34%,#f97316 72%,#ea580c 100%) !important; color:#dc2626 !important; box-shadow:inset -5px -6px 9px rgba(124,45,18,.24),0 0 18px rgba(249,115,22,.70) !important; }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__output,
      html[data-mk-search-box-effect="header_search_dragon"] .md-search-result,
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__scrollwrap{
        background:linear-gradient(135deg,color-mix(in srgb,var(--md-default-bg-color) 78%,#ffedd5 22%),color-mix(in srgb,var(--md-default-bg-color) 88%,#fef3c7 12%)) !important;
        border:1px solid rgba(249,115,22,.34) !important;
        box-shadow:0 14px 42px rgba(249,115,22,.16),0 16px 44px rgba(15,23,42,.16) !important;
      }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__output::before,
      html[data-mk-search-box-effect="header_search_dragon"] .md-search-result::before{ content:"🐉"; position:absolute; right:18px; top:12px; font-size:25px; opacity:.78; pointer-events:none; filter:drop-shadow(0 0 9px rgba(34,197,94,.35)); }
      html[data-mk-search-box-effect="header_search_dragon"] .md-search__output::after,
      html[data-mk-search-box-effect="header_search_dragon"] .md-search-result::after{ content:"★★★"; position:absolute; right:18px; bottom:14px; width:27px; height:27px; border-radius:999px; display:grid; place-items:center; font-size:7px; color:#dc2626; background:radial-gradient(circle at 34% 26%,#fde68a 0 15%,#fbbf24 34%,#f97316 72%,#ea580c 100%); box-shadow:0 0 18px rgba(249,115,22,.55); pointer-events:none; }

      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_sparkle"] .md-search__output,
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_sparkle"] .md-search-result,
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_sparkle"] .md-search__scrollwrap{ background:linear-gradient(135deg,rgba(24,24,27,.98),rgba(67,56,18,.82)) !important; }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_flower"] .md-search__output,
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_flower"] .md-search-result,
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_flower"] .md-search__scrollwrap{ background:linear-gradient(135deg,rgba(30,41,59,.98),rgba(76,29,149,.82)) !important; }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_dragon"] .md-search__output,
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_dragon"] .md-search-result,
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_dragon"] .md-search__scrollwrap{ background:linear-gradient(135deg,rgba(30,41,59,.98),rgba(67,20,7,.86)) !important; }


      /* v61: keep the mobile top-search layout intact.
         The real rounded surfaces are .mk-search-history for history and
         .md-search__scrollwrap for result suggestions.  .md-search__output is
         only a positioning shell, so visual skins must not paint or resize it. */
      html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search-result{
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
        filter:none !important;
        padding:0 !important;
        margin:0 !important;
        overflow:visible !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search__output{
        position:absolute !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__output::before,
      html[data-mk-search-box-effect] .md-header .md-search__output::after,
      html[data-mk-search-box-effect] .md-header .md-search-result::before,
      html[data-mk-search-box-effect] .md-header .md-search-result::after{
        display:none !important;
        content:none !important;
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap,
      html[data-mk-search-box-effect] .md-header .md-search__inner.mk-search-result-open > .md-search__output .md-search__scrollwrap{
        position:relative !important;
        overflow:hidden !important;
        border-radius:var(--mk-header-search-radius,18px) !important;
        background:var(--mk-search-effect-surface, var(--md-default-bg-color)) !important;
        border:1px solid var(--mk-search-effect-border, rgba(148,163,184,.18)) !important;
        box-shadow:var(--mk-search-effect-shadow, var(--md-shadow-z3)) !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        -webkit-mask-image:-webkit-radial-gradient(white, black) !important;
        mask-image:radial-gradient(white, black) !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__list,
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result__list,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__panel,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__scroll,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__list{
        background:transparent !important;
        border-color:color-mix(in srgb,var(--mk-search-effect-border, rgba(148,163,184,.18)) 55%, transparent) !important;
        box-shadow:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer{
        background:var(--mk-search-effect-footer, rgba(255,255,255,.05)) !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect] .md-header .mk-search-history::before,
      html[data-mk-search-box-effect] .md-header .mk-search-history::after{
        position:absolute !important;
        z-index:0 !important;
        pointer-events:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap > *,
      html[data-mk-search-box-effect] .md-header .mk-search-history > *{
        position:relative !important;
        z-index:1 !important;
      }
      html[data-mk-search-box-effect="header_search_sparkle"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(255,251,235,.98),rgba(254,243,199,.94));
        --mk-search-effect-border:rgba(250,204,21,.46);
        --mk-search-effect-shadow:0 14px 42px rgba(250,204,21,.16),0 16px 44px rgba(15,23,42,.16);
        --mk-search-effect-footer:rgba(250,204,21,.10);
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_sparkle"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(24,24,27,.98),rgba(67,56,18,.92));
        --mk-search-effect-footer:rgba(250,204,21,.08);
      }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_sparkle"] .md-header .mk-search-history::after{
        content:"✦   ✧   ✨" !important;
        right:16px !important;
        bottom:12px !important;
        color:#facc15 !important;
        font-size:18px !important;
        text-shadow:0 0 12px rgba(250,204,21,.78),0 0 26px rgba(250,204,21,.38) !important;
        animation:mk-sparkle-row-v58 1.1s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_flower"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(253,242,248,.98),rgba(255,228,230,.94));
        --mk-search-effect-border:rgba(244,114,182,.38);
        --mk-search-effect-shadow:0 14px 42px rgba(244,114,182,.14),0 16px 44px rgba(15,23,42,.14);
        --mk-search-effect-footer:rgba(244,114,182,.10);
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_flower"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(30,41,59,.98),rgba(76,29,149,.90));
        --mk-search-effect-footer:rgba(244,114,182,.08);
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect="header_search_flower"] .md-header .mk-search-history::before{
        content:"🌸" !important;
        right:16px !important;
        top:12px !important;
        font-size:22px !important;
        filter:drop-shadow(0 0 9px rgba(244,114,182,.42)) !important;
        animation:mk-blossom-float-v58 2.6s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_flower"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_flower"] .md-header .mk-search-history::after{
        content:"❀   ✿" !important;
        left:18px !important;
        bottom:12px !important;
        color:#f472b6 !important;
        font-size:17px !important;
        opacity:.78 !important;
      }
      html[data-mk-search-box-effect="header_search_dragon"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(255,237,213,.98),rgba(254,243,199,.94));
        --mk-search-effect-border:rgba(249,115,22,.40);
        --mk-search-effect-shadow:0 14px 42px rgba(249,115,22,.15),0 16px 44px rgba(15,23,42,.15);
        --mk-search-effect-footer:rgba(249,115,22,.10);
      }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_dragon"]{
        --mk-search-effect-surface:linear-gradient(135deg,rgba(30,41,59,.98),rgba(67,20,7,.92));
        --mk-search-effect-footer:rgba(249,115,22,.08);
      }
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .mk-search-history::before{
        content:"🐉" !important;
        right:18px !important;
        top:12px !important;
        font-size:25px !important;
        opacity:.78 !important;
        filter:drop-shadow(0 0 9px rgba(34,197,94,.35)) !important;
        animation:mk-dragon-float-v58 3.1s ease-in-out infinite !important;
      }
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .mk-search-history::after{
        content:"★★★" !important;
        right:18px !important;
        bottom:14px !important;
        width:27px !important;
        height:27px !important;
        border-radius:999px !important;
        display:grid !important;
        place-items:center !important;
        font-size:7px !important;
        color:#dc2626 !important;
        background:radial-gradient(circle at 34% 26%,#fde68a 0 15%,#fbbf24 34%,#f97316 72%,#ea580c 100%) !important;
        box-shadow:0 0 18px rgba(249,115,22,.55) !important;
      }
      @media screen and (max-width:59.984375em){
        html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output{
          top:calc(2.4rem + var(--mk-header-search-gap,4px)) !important;
          left:0 !important;
          right:0 !important;
          width:auto !important;
          transform:none !important;
        }
        html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history,
        html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap{
          max-height:calc(100dvh - 2.4rem - 12px) !important;
          border-radius:var(--mk-header-search-mobile-radius,18px) !important;
        }
      }

    `;
    (document.head||document.documentElement).appendChild(st);
  }catch(_){ }
})();

;(() => {
  const STYLE_ID = "mk-interface-theme-continuous-sidebar-v81";
  function ensureContinuousSidebarThemeStyle(){
    try {
      let st = document.getElementById(STYLE_ID);
      if (!st) {
        st = document.createElement("style");
        st.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(st);
      }
      st.textContent = `
/* v83: continuous theme floors, but keep the actual sidebar containers.
   The outer sidebar floors remain transparent so the page background is not
   restarted.  The sticky course/sort header gets the same fixed page background
   to mask scrolled items behind it, and the week/group cards keep their own
   surface and border. */
html[data-mk-interface-theme^="ui_theme_"]{
  --mk-theme-surface-shadow:none !important;
}
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar__scrollwrap,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar__inner,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar .md-nav,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar .md-nav__list,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar .md-nav__title,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-drawer-ghost-floor,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap{
  background:transparent !important;
  background-image:none !important;
  box-shadow:none !important;
  filter:none !important;
  outline:none !important;
  border-color:transparent !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar::before,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar::after,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar__scrollwrap::before,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar__scrollwrap::after,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar__inner::before,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar__inner::after,
html[data-mk-interface-theme^="ui_theme_"] #current-course-bar::before,
html[data-mk-interface-theme^="ui_theme_"] #current-course-bar::after,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-sortdock::before,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-sortdock::after,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-drawer-ghost-floor::before,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-drawer-ghost-floor::after{
  content:none !important;
  display:none !important;
  background:none !important;
  background-image:none !important;
  box-shadow:none !important;
  filter:none !important;
}
/* The sticky top area must be opaque enough to hide the scrolled nav text
   underneath.  Using the same fixed background keeps it visually continuous. */
html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] :is(#current-course-bar,#mk-sidebar-sortdock),
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] :is(#current-course-bar,#mk-sidebar-sortdock),
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] :is(#current-course-bar,#mk-sidebar-sortdock),
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] :is(#current-course-bar,#mk-sidebar-sortdock){
  background:var(--mk-theme-page-bg, var(--mk-gold-theme-page-bg, var(--md-default-bg-color))) !important;
  background-attachment:fixed !important;
  background-repeat:no-repeat !important;
  background-size:cover !important;
  border-color:transparent !important;
  box-shadow:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
  z-index:24 !important;
}
/* Restore the actual left-sidebar cards.  Only the surrounding floor is
   transparent; the week/course containers should still read as containers. */
html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within,
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within,
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within{
  background:var(--mk-theme-sidebar-card-bg, var(--msb-card-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  border-color:var(--mk-theme-sidebar-border, var(--msb-card-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent))) !important;
  box-shadow:none !important;
}
html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within,
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within,
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within{
  background:var(--mk-theme-sidebar-card-bg-hover, var(--msb-card-bg-hover, var(--mk-theme-sidebar-card-bg, var(--md-default-bg-color)))) !important;
  border-color:var(--msb-card-border-strong, var(--mk-theme-sidebar-border, color-mix(in srgb, var(--md-accent-fg-color) 24%, transparent))) !important;
}
`;
    } catch (_) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureContinuousSidebarThemeStyle, { once:true });
  else ensureContinuousSidebarThemeStyle();
  try { window.addEventListener("pageshow", ensureContinuousSidebarThemeStyle, { passive:true }); } catch (_) {}
})();

;(() => {
  const STYLE_ID = "mk-interface-theme-sidebar-sticky-mask-v84";
  function ensureInterfaceThemeSidebarStickyMaskStyle(){
    try {
      let st = document.getElementById(STYLE_ID);
      if (!st) {
        st = document.createElement("style");
        st.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(st);
      }
      st.textContent = `
/* v84: restore the sidebar scroll mask under Sort by and keep gold themes
   visually continuous. The page/header floor is one colour; the actual course,
   week and Learning path panels remain visible card surfaces. */
html[data-mk-interface-theme^="ui_theme_"]{
  --mk-theme-sticky-floor:var(--mk-theme-page-bg, var(--mk-gold-theme-page-bg, var(--md-default-bg-color)));
  --msb-sidebar-page-bg:var(--mk-theme-sticky-floor) !important;
  --msb-sidebar-page-background:var(--mk-theme-sticky-floor) !important;
  --msb-sidebar-page-bg-size:auto !important;
  --msb-sidebar-page-bg-position:0 0 !important;
  --msb-sidebar-page-bg-repeat:no-repeat !important;
  --msb-sidebar-page-bg-attachment:scroll !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_light_"],
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_sunlit_gold"],
html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_dark_"],
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_lantern_gold"]{
  --mk-theme-page-bg:var(--md-default-bg-color) !important;
  --mk-gold-theme-page-bg:var(--md-default-bg-color) !important;
  --mk-theme-sticky-floor:var(--md-default-bg-color) !important;
  --mk-theme-sidebar-bg:var(--md-default-bg-color) !important;
  --mk-theme-sidebar-card-bg:color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%) !important;
  --mk-theme-sidebar-card-bg-hover:color-mix(in srgb, var(--md-default-bg-color) 90%, var(--md-accent-fg-color) 10%) !important;
  --mk-theme-sidebar-border:color-mix(in srgb, var(--md-default-fg-color) 12%, transparent) !important;
  --msb-card-bg:var(--mk-theme-sidebar-card-bg) !important;
  --msb-card-bg-hover:var(--mk-theme-sidebar-card-bg-hover) !important;
  --msb-card-border:var(--mk-theme-sidebar-border) !important;
}
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"]{
  --mk-gold-theme-page-bg:#fbf1de !important;
  --mk-theme-page-bg:#fbf1de !important;
  --mk-theme-sidebar-bg:#fbf1de !important;
  --mk-theme-sticky-floor:#fbf1de !important;
  --mk-theme-sidebar-card-bg:#fff7e8 !important;
  --mk-theme-sidebar-card-bg-hover:#fff0cf !important;
  --mk-theme-sidebar-border:rgba(159,114,14,.26) !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"]{
  --mk-gold-theme-page-bg:#1f180d !important;
  --mk-theme-page-bg:#1f180d !important;
  --mk-theme-sidebar-bg:#1f180d !important;
  --mk-theme-sticky-floor:#1f180d !important;
  --mk-theme-sidebar-card-bg:#2a2112 !important;
  --mk-theme-sidebar-card-bg-hover:#342817 !important;
  --mk-theme-sidebar-border:rgba(255,212,92,.22) !important;
}
html[data-mk-interface-theme^="ui_theme_"] body,
html[data-mk-interface-theme^="ui_theme_"] .md-container,
html[data-mk-interface-theme^="ui_theme_"] .md-main,
html[data-mk-interface-theme^="ui_theme_"] .md-main__inner,
html[data-mk-interface-theme^="ui_theme_"] .md-content,
html[data-mk-interface-theme^="ui_theme_"] .md-content__inner{
  background:var(--mk-theme-page-bg, var(--mk-gold-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  box-shadow:none !important;
}
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar__scrollwrap,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar__inner,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar .md-nav,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar .md-nav__list,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar .md-nav__title,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-drawer-ghost-floor,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap{
  background:transparent !important;
  background-image:none !important;
  border-color:transparent !important;
  box-shadow:none !important;
  filter:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #current-course-bar,
html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #current-course-bar{
  z-index:92 !important;
}
html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #mk-sidebar-sortdock,
html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock,
html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .msb-unified-head{
  z-index:84 !important;
}
html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #current-course-bar,
html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #mk-sidebar-sortdock,
html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .msb-unified-head,
html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #current-course-bar,
html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock{
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  border-color:transparent !important;
  box-shadow:none !important;
  filter:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
  /* stacking order is set separately so Sort by never covers the course selector. */
}
html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #mk-sidebar-sortdock::before,
html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock::before{
  content:none !important;
  display:none !important;
  background:none !important;
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary #mk-sidebar-sortdock::after,
html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .msb-unified-head::after{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:0 !important;
  right:0 !important;
  bottom:calc(-1 * var(--msb-sidebar-fade-h, 1.22rem)) !important;
  height:var(--msb-sidebar-fade-h, 1.22rem) !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,.78) 45%,transparent 100%) !important;
  mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,.78) 45%,transparent 100%) !important;
  pointer-events:none !important;
  z-index:1 !important;
}
html[data-mk-interface-theme^="ui_theme_"] #current-course-bar .ccb-course-trigger,
html[data-mk-interface-theme^="ui_theme_"] #current-course-bar .ccb-menu,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-sortdock .msb-sortdock__btn,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind],
html[data-mk-interface-theme^="ui_theme_"] #mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind]{
  background:var(--mk-theme-sidebar-card-bg, var(--msb-card-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  border-color:var(--mk-theme-sidebar-border, var(--msb-card-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent))) !important;
  box-shadow:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
html[data-mk-interface-theme^="ui_theme_"] #current-course-bar .ccb-course-trigger:hover,
html[data-mk-interface-theme^="ui_theme_"] #current-course-bar[data-course-menu-open="1"] .ccb-course-trigger,
html[data-mk-interface-theme^="ui_theme_"] #current-course-bar .ccb-menu-item:hover,
html[data-mk-interface-theme^="ui_theme_"] #current-course-bar .ccb-menu-item:focus-visible,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-sortdock .msb-sortdock__btn:hover,
html[data-mk-interface-theme^="ui_theme_"] #mk-sidebar-sortdock .msb-sortdock__btn:focus-visible,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within{
  background:var(--mk-theme-sidebar-card-bg-hover, var(--mk-theme-sidebar-card-bg, var(--md-default-bg-color))) !important;
  border-color:var(--msb-card-border-strong, var(--mk-theme-sidebar-border, color-mix(in srgb, var(--md-accent-fg-color) 24%, transparent))) !important;
}
`;
    } catch (_) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureInterfaceThemeSidebarStickyMaskStyle, { once:true });
  else ensureInterfaceThemeSidebarStickyMaskStyle();
  try { window.addEventListener("pageshow", ensureInterfaceThemeSidebarStickyMaskStyle, { passive:true }); } catch (_) {}
})();

;(() => {
  const STYLE_ID = "mk-interface-theme-dark-sidebar-polish-v85";
  function ensureDarkSidebarPolishStyle(){
    try {
      let st = document.getElementById(STYLE_ID);
      if (!st) {
        st = document.createElement("style");
        st.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(st);
      }
      st.textContent = `
/* v85: make all dark interface themes follow the same sidebar model as Lantern Gold.
   The page floor, Sort by floor, and surrounding sidebar floor use one solid colour;
   only the selector button and week/group containers are visible card surfaces. */
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_midnight"]{
  --mk-theme-page-bg:#0c1222 !important;
  --mk-theme-sidebar-bg:#0c1222 !important;
  --mk-theme-sticky-floor:#0c1222 !important;
  --mk-theme-sidebar-card-bg:#151f35 !important;
  --mk-theme-sidebar-card-bg-hover:#1e2d4a !important;
  --mk-theme-sidebar-border:rgba(147,197,253,.20) !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_evergreen"]{
  --mk-theme-page-bg:#081813 !important;
  --mk-theme-sidebar-bg:#081813 !important;
  --mk-theme-sticky-floor:#081813 !important;
  --mk-theme-sidebar-card-bg:#102b26 !important;
  --mk-theme-sidebar-card-bg-hover:#183e36 !important;
  --mk-theme-sidebar-border:rgba(110,231,183,.18) !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_aurora_grad"]{
  --mk-theme-page-bg:#071822 !important;
  --mk-theme-sidebar-bg:#071822 !important;
  --mk-theme-sticky-floor:#071822 !important;
  --mk-theme-sidebar-card-bg:#0d303c !important;
  --mk-theme-sidebar-card-bg-hover:#124854 !important;
  --mk-theme-sidebar-border:rgba(103,232,249,.18) !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_plum_grad"]{
  --mk-theme-page-bg:#160d21 !important;
  --mk-theme-sidebar-bg:#160d21 !important;
  --mk-theme-sticky-floor:#160d21 !important;
  --mk-theme-sidebar-card-bg:#27193a !important;
  --mk-theme-sidebar-card-bg-hover:#39234e !important;
  --mk-theme-sidebar-border:rgba(216,180,254,.18) !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] body,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-container,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-main,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-main__inner,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-content,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-content__inner{
  background:var(--mk-theme-page-bg, var(--md-default-bg-color)) !important;
  background-image:none !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] :is(.md-sidebar,.md-sidebar--primary,.md-sidebar--secondary,.md-sidebar__scrollwrap,.md-sidebar__inner,.md-sidebar .md-nav,.md-sidebar .md-nav__list,.md-sidebar .md-nav__title){
  background:transparent !important;
  background-image:none !important;
  border-color:transparent !important;
  box-shadow:none !important;
  filter:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #current-course-bar,
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #mk-sidebar-sortdock{
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  border-color:transparent !important;
  box-shadow:none !important;
  filter:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #current-course-bar{
  isolation:isolate !important;
  overflow:visible !important;
  z-index:92 !important;
}
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #current-course-bar::before{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:-1.2rem !important;
  right:-1.2rem !important;
  top:-2.8rem !important;
  bottom:-.66rem !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  box-shadow:none !important;
  pointer-events:none !important;
  z-index:0 !important;
}
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #current-course-bar > *{
  position:relative !important;
  z-index:1 !important;
}
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #mk-sidebar-sortdock{
  isolation:isolate !important;
  overflow:visible !important;
  z-index:84 !important;
}
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #mk-sidebar-sortdock::before{
  content:none !important;
  display:none !important;
}
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #mk-sidebar-sortdock::after{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:-1.2rem !important;
  right:-1.2rem !important;
  bottom:calc(-1 * var(--msb-sidebar-fade-h, 1.22rem)) !important;
  height:var(--msb-sidebar-fade-h, 1.22rem) !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,.78) 46%,transparent 100%) !important;
  mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,.78) 46%,transparent 100%) !important;
  pointer-events:none !important;
  z-index:0 !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-course-trigger,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-menu,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-sidebar-sortdock .msb-sortdock__btn,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]{
  background:var(--mk-theme-sidebar-card-bg, var(--msb-card-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  border-color:var(--mk-theme-sidebar-border, var(--msb-card-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent))) !important;
  box-shadow:none !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-course-trigger:hover,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar[data-course-menu-open="1"] .ccb-course-trigger,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-menu-item:hover,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #current-course-bar .ccb-menu-item:focus-visible,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-sidebar-sortdock .msb-sortdock__btn:hover,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] #mk-sidebar-sortdock .msb-sortdock__btn:focus-visible,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:hover,
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary .md-nav__item[data-msb-group-kind]:focus-within{
  background:var(--mk-theme-sidebar-card-bg-hover, var(--mk-theme-sidebar-card-bg, var(--md-default-bg-color))) !important;
}
/* Safety net for one-frame palette/theme mismatches: a light interface theme must not paint a white page while Material is in slate mode. */
html[data-mk-interface-theme^="ui_theme_light_"] body[data-md-color-scheme="slate"],
html[data-mk-interface-theme="ui_theme_sunlit_gold"] body[data-md-color-scheme="slate"],
html[data-mk-interface-theme^="ui_theme_light_"] body[data-md-color-scheme="slate"] .md-container,
html[data-mk-interface-theme="ui_theme_sunlit_gold"] body[data-md-color-scheme="slate"] .md-container,
html[data-mk-interface-theme^="ui_theme_light_"] body[data-md-color-scheme="slate"] .md-main,
html[data-mk-interface-theme="ui_theme_sunlit_gold"] body[data-md-color-scheme="slate"] .md-main,
html[data-mk-interface-theme^="ui_theme_light_"] body[data-md-color-scheme="slate"] .md-main__inner,
html[data-mk-interface-theme="ui_theme_sunlit_gold"] body[data-md-color-scheme="slate"] .md-main__inner,
html[data-mk-interface-theme^="ui_theme_light_"] body[data-md-color-scheme="slate"] .md-content,
html[data-mk-interface-theme="ui_theme_sunlit_gold"] body[data-md-color-scheme="slate"] .md-content,
html[data-mk-interface-theme^="ui_theme_light_"] body[data-md-color-scheme="slate"] .md-content__inner,
html[data-mk-interface-theme="ui_theme_sunlit_gold"] body[data-md-color-scheme="slate"] .md-content__inner{
  background:var(--md-default-bg-color) !important;
  background-image:none !important;
}
html[data-mk-interface-theme^="ui_theme_light_"] body[data-md-color-scheme="slate"] :is(.md-sidebar,.md-sidebar--primary,.md-sidebar--secondary,.md-sidebar__scrollwrap,.md-sidebar__inner,.md-sidebar .md-nav,.md-sidebar .md-nav__list,.md-sidebar .md-nav__title,#current-course-bar,#mk-sidebar-sortdock),
html[data-mk-interface-theme="ui_theme_sunlit_gold"] body[data-md-color-scheme="slate"] :is(.md-sidebar,.md-sidebar--primary,.md-sidebar--secondary,.md-sidebar__scrollwrap,.md-sidebar__inner,.md-sidebar .md-nav,.md-sidebar .md-nav__list,.md-sidebar .md-nav__title,#current-course-bar,#mk-sidebar-sortdock){
  background:var(--md-default-bg-color) !important;
  background-image:none !important;
  box-shadow:none !important;
}
`;
    } catch (_) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureDarkSidebarPolishStyle, { once:true });
  else ensureDarkSidebarPolishStyle();
  try { window.addEventListener("pageshow", ensureDarkSidebarPolishStyle, { passive:true }); } catch (_) {}
})();

;(() => {
  const STYLE_ID = "mk-interface-theme-dark-week-button-border-fix-v86";
  function ensureDarkWeekButtonBorderFix(){
    try {
      let st = document.getElementById(STYLE_ID);
      if (!st) {
        st = document.createElement("style");
        st.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(st);
      }
      st.textContent = `
/* v86: keep non-gold dark themes aligned with Lantern Gold.
   The dark-theme polish layer added an extra mask below the course selector;
   because that selector sits above Sort by in the stacking order, the mask could
   visually cut across the top border of the Week button.  Lantern Gold does not
   use that extra mask, so remove it for the other dark shop themes as well. */
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #current-course-bar::before,
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #current-course-bar::after{
  content:none !important;
  display:none !important;
  background:none !important;
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #current-course-bar{
  background:transparent !important;
  background-image:none !important;
  box-shadow:none !important;
  z-index:92 !important;
}
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #mk-sidebar-sortdock{
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  box-shadow:none !important;
  z-index:84 !important;
}
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #mk-sidebar-sortdock .msb-sortdock__box,
html.mk-sidebar-sort-ready[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"] .md-sidebar--primary #mk-sidebar-sortdock .msb-sortdock__btn{
  position:relative !important;
  z-index:2 !important;
}
`;
    } catch (_) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureDarkWeekButtonBorderFix, { once:true });
  else ensureDarkWeekButtonBorderFix();
  try { window.addEventListener("pageshow", ensureDarkWeekButtonBorderFix, { passive:true }); } catch (_) {}
})();


;(() => {
  const STYLE_ID = "mk-interface-theme-tab-dropdown-header-match-v87";
  function ensureTabDropdownHeaderMatch(){
    try {
      let st = document.getElementById(STYLE_ID);
      if (!st) {
        st = document.createElement("style");
        st.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(st);
      }
      st.textContent = `
/* v87: tab dropdowns inherit the visible header colour.
   Both first-level and second-level tab menus use the same background as the
   header/tabs bar, instead of their former darker/lighter panel colour.  For
   gradient headers, fixed background positioning keeps the colour continuous
   with the header area at the same horizontal position. */
html[data-mk-header-skin="header_skin_aurora"]{
  --mk-active-header-bg:linear-gradient(90deg,#172554,#0f766e,#6d28d9);
  --mk-active-header-fg:#fff;
}
html[data-mk-header-skin="header_skin_sunset"]{
  --mk-active-header-bg:linear-gradient(90deg,#7c2d12,#be123c,#f59e0b);
  --mk-active-header-fg:#fff;
}
html[data-mk-header-skin="header_skin_midnight"]{
  --mk-active-header-bg:linear-gradient(90deg,#020617,#111827,#1e3a8a);
  --mk-active-header-fg:#fff;
}
html[data-mk-color-scheme="default"][data-mk-interface-theme^="ui_theme_light_"],
html[data-mk-color-scheme="slate"][data-mk-interface-theme^="ui_theme_dark_"]{
  --mk-active-header-bg:var(--mk-theme-header-bg, var(--md-primary-fg-color));
  --mk-active-header-fg:#fff;
}
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"]{
  --mk-active-header-bg:var(--mk-gold-theme-header-bg, linear-gradient(90deg,#6f4b00 0%,#9f720e 42%,#d2a22f 100%));
  --mk-active-header-fg:#fff;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"]{
  --mk-active-header-bg:var(--mk-gold-theme-header-bg, linear-gradient(90deg,#4a3200 0%,#7a5600 52%,#9f7300 100%));
  --mk-active-header-fg:#fff;
}
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(
  .mk-random-tabs-menu,
  .mk-header-dropdown,
  .mk-rt-panel,
  #rf-year-course-popover-v4,
  [data-md-component="tabs"] .md-tabs__link + *,
  .md-tab-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel.md-random-dropdown-panel,
  #year-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel,
  #year-dropdown-panel
){
  background:var(--mk-active-header-bg, var(--md-primary-fg-color)) !important;
  background-image:var(--mk-active-header-bg, var(--md-primary-fg-color)) !important;
  background-attachment:fixed !important;
  background-size:100vw 100% !important;
  background-position:0 0 !important;
  background-repeat:no-repeat !important;
  color:var(--mk-active-header-fg, #fff) !important;
  border-color:rgba(255,255,255,.22) !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(
  .mk-random-tabs-menu,
  .mk-header-dropdown,
  .mk-rt-panel,
  #rf-year-course-popover-v4,
  [data-md-component="tabs"] .md-tabs__link + *,
  .md-tab-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel.md-random-dropdown-panel,
  #year-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel,
  #year-dropdown-panel
) :is(a,button,summary,span,li,div,.md-nav__link,.mk-rt-panel-item,.mk-rt-group-title){
  color:var(--mk-active-header-fg, #fff) !important;
}
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(
  .mk-random-tabs-menu,
  .mk-header-dropdown,
  .mk-rt-panel,
  #rf-year-course-popover-v4,
  [data-md-component="tabs"] .md-tabs__link + *,
  .md-tab-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel.md-random-dropdown-panel,
  #year-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel,
  #year-dropdown-panel
) :is(svg,.md-icon){
  color:var(--mk-active-header-fg, #fff) !important;
  fill:currentColor !important;
}
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(
  .mk-random-tabs-menu,
  .mk-header-dropdown,
  .mk-rt-panel,
  #rf-year-course-popover-v4,
  [data-md-component="tabs"] .md-tabs__link + *,
  .md-tab-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel.md-random-dropdown-panel,
  #year-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel,
  #year-dropdown-panel
) :is(a,button,summary,.md-nav__link,.mk-rt-panel-item):is(:hover,:focus,:focus-visible){
  color:#fff !important;
  background:rgba(255,255,255,.10) !important;
}
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(.mk-rt-panel .mk-rt-sep,#rf-year-course-popover-v4 hr,.mk-header-dropdown hr,.mk-random-tabs-menu hr){
  background:rgba(255,255,255,.22) !important;
  border-color:rgba(255,255,255,.22) !important;
}
`;
    } catch (_) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureTabDropdownHeaderMatch, { once:true });
  else ensureTabDropdownHeaderMatch();
  try { window.addEventListener("pageshow", ensureTabDropdownHeaderMatch, { passive:true }); } catch (_) {}
})();

;(() => {
  const STYLE_ID = "mk-interface-theme-search-icon-v88";
  function ensureInterfaceThemeSearchIconColour(){
    try {
      const st = document.getElementById(STYLE_ID);
      if (st && st.parentNode) st.parentNode.removeChild(st);
    } catch (_) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureInterfaceThemeSearchIconColour, { once:true });
  else ensureInterfaceThemeSearchIconColour();
  try { window.addEventListener("pageshow", ensureInterfaceThemeSearchIconColour, { passive:true }); } catch (_) {}
})();


;(() => {
  const STYLE_ID = "mk-interface-theme-course-selector-top-mask-v89";
  function ensureCourseSelectorTopMaskStyle(){
    try {
      let st = document.getElementById(STYLE_ID);
      if (!st) {
        st = document.createElement("style");
        st.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(st);
      }
      st.textContent = `
/* v89: selected interface themes need an opaque sidebar top floor above the
   current-course selector, so scrolled nav items cannot show through behind it. */
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_light_peach_grad"],
html[data-md-color-scheme="default"][data-mk-interface-theme="ui_theme_light_peach_grad"]{
  --mk-theme-sticky-floor:#fff5ef !important;
}
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_light_lavender_grad"],
html[data-md-color-scheme="default"][data-mk-interface-theme="ui_theme_light_lavender_grad"]{
  --mk-theme-sticky-floor:#f8f5ff !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_midnight"],
html[data-md-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_midnight"]{
  --mk-theme-sticky-floor:#0c1222 !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_evergreen"],
html[data-md-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_evergreen"]{
  --mk-theme-sticky-floor:#081813 !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_aurora_grad"],
html[data-md-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_aurora_grad"]{
  --mk-theme-sticky-floor:#071822 !important;
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_plum_grad"],
html[data-md-color-scheme="slate"][data-mk-interface-theme="ui_theme_dark_plum_grad"]{
  --mk-theme-sticky-floor:#160d21 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar,
html:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #current-course-bar{
  position:sticky !important;
  isolation:isolate !important;
  overflow:visible !important;
  contain:none !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  z-index:94 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar::before,
html:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #current-course-bar::before{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:-1.25rem !important;
  right:-1.25rem !important;
  top:-3.25rem !important;
  bottom:0 !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  box-shadow:none !important;
  pointer-events:none !important;
  z-index:0 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar > *,
html:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #current-course-bar > *{
  position:relative !important;
  z-index:1 !important;
}
`;
    } catch (_) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureCourseSelectorTopMaskStyle, { once:true });
  else ensureCourseSelectorTopMaskStyle();
  try { window.addEventListener("pageshow", ensureCourseSelectorTopMaskStyle, { passive:true }); } catch (_) {}
})();


;(() => {
  const STYLE_ID = "mk-interface-theme-search-actions-and-tab-hover-fix-v91";
  function ensureInterfaceThemeSearchActionsAndTabHoverFix(){
    try {
      let st = document.getElementById(STYLE_ID);
      if (!st) {
        st = document.createElement("style");
        st.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(st);
      }
      st.textContent = `
/* v91: fix interface-theme search icon contrast without forcing the
   search action buttons to stay visible.  The magnifier is the direct icon
   inside the search form; the share/reset buttons live in .md-search__options
   and should remain hidden until the search field contains text. */
html:is([data-mk-color-scheme="default"],[data-md-color-scheme="default"])[data-mk-interface-theme^="ui_theme_light_"] .md-header .md-search .md-search__form > .md-search__icon,
html:is([data-mk-color-scheme="default"],[data-md-color-scheme="default"])[data-mk-interface-theme^="ui_theme_light_"] .md-header .md-search .md-search__form > .md-search__icon svg{
  color:rgba(71,85,105,.72) !important;
  fill:currentColor !important;
  opacity:1 !important;
}
html:is([data-mk-color-scheme="default"],[data-md-color-scheme="default"])[data-mk-interface-theme^="ui_theme_light_"] .md-header .md-search .md-search__input{
  color:rgba(15,23,42,.88) !important;
  -webkit-text-fill-color:rgba(15,23,42,.88) !important;
}
html:is([data-mk-color-scheme="default"],[data-md-color-scheme="default"])[data-mk-interface-theme^="ui_theme_light_"] .md-header .md-search .md-search__input::placeholder{
  color:rgba(71,85,105,.72) !important;
  opacity:1 !important;
}
html .md-header .md-search .md-search__form:has(.md-search__input:placeholder-shown) .md-search__options{
  opacity:0 !important;
  visibility:hidden !important;
  pointer-events:none !important;
}
html .md-header .md-search .md-search__form:has(.md-search__input:placeholder-shown) .md-search__options .md-search__icon{
  opacity:0 !important;
  visibility:hidden !important;
  pointer-events:none !important;
}
html .md-header .md-search .md-search__form:has(.md-search__input:not(:placeholder-shown)) .md-search__options{
  opacity:1 !important;
  visibility:visible !important;
  pointer-events:auto !important;
}

/* v91: theme/header tab dropdown hover should match the normal Material feel:
   no rectangular hover block, only the hovered item's text colour changes.
   Some account/notification rows wrap the label in inner spans for badges, so
   hover colour is also propagated to non-badge text spans. */
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(
  .mk-random-tabs-menu,
  .mk-header-dropdown,
  .mk-rt-panel,
  #rf-year-course-popover-v4,
  [data-md-component="tabs"] .md-tabs__link + *,
  .md-tab-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel.md-random-dropdown-panel,
  #year-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel,
  #year-dropdown-panel
) :is(a,button,summary,.md-nav__link,.mk-rt-panel-item,[role="menuitem"],[role="button"]):is(:hover,:focus,:focus-visible),
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(
  .mk-random-tabs-menu,
  .mk-header-dropdown,
  .mk-rt-panel,
  #rf-year-course-popover-v4,
  [data-md-component="tabs"] .md-tabs__link + *,
  .md-tab-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel.md-random-dropdown-panel,
  #year-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel,
  #year-dropdown-panel
) :is(li,.md-nav__item):hover > :is(a,button,summary,.md-nav__link,.mk-rt-panel-item,[role="menuitem"],[role="button"]){
  color:var(--mk-tab-dropdown-hover-fg, var(--md-accent-fg-color, #00bfa5)) !important;
  background:transparent !important;
  background-color:transparent !important;
  background-image:none !important;
  box-shadow:none !important;
  outline-color:transparent !important;
}
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(
  .mk-random-tabs-menu,
  .mk-header-dropdown,
  .mk-rt-panel,
  #rf-year-course-popover-v4,
  [data-md-component="tabs"] .md-tabs__link + *,
  .md-tab-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel.md-random-dropdown-panel,
  #year-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel,
  #year-dropdown-panel
) :is(a,button,summary,.md-nav__link,.mk-rt-panel-item,[role="menuitem"],[role="button"]):is(:hover,:focus,:focus-visible) :is(svg,.md-icon),
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(
  .mk-random-tabs-menu,
  .mk-header-dropdown,
  .mk-rt-panel,
  #rf-year-course-popover-v4,
  [data-md-component="tabs"] .md-tabs__link + *,
  .md-tab-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel.md-random-dropdown-panel,
  #year-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel,
  #year-dropdown-panel
) :is(a,button,summary,.md-nav__link,.mk-rt-panel-item,[role="menuitem"],[role="button"]):is(:hover,:focus,:focus-visible) span:not([class*="badge"]):not([class*="Badge"]),
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(
  .mk-random-tabs-menu,
  .mk-header-dropdown,
  .mk-rt-panel,
  #rf-year-course-popover-v4,
  [data-md-component="tabs"] .md-tabs__link + *,
  .md-tab-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel.md-random-dropdown-panel,
  #year-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel,
  #year-dropdown-panel
) :is(li,.md-nav__item):hover > :is(a,button,summary,.md-nav__link,.mk-rt-panel-item,[role="menuitem"],[role="button"]) :is(svg,.md-icon),
html:is([data-mk-header-skin],[data-mk-interface-theme]) :is(
  .mk-random-tabs-menu,
  .mk-header-dropdown,
  .mk-rt-panel,
  #rf-year-course-popover-v4,
  [data-md-component="tabs"] .md-tabs__link + *,
  .md-tab-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel.md-random-dropdown-panel,
  #year-dropdown-panel.md-random-dropdown-panel,
  #random-dropdown-panel,
  #year-dropdown-panel
) :is(li,.md-nav__item):hover > :is(a,button,summary,.md-nav__link,.mk-rt-panel-item,[role="menuitem"],[role="button"]) span:not([class*="badge"]):not([class*="Badge"]){
  color:currentColor !important;
  fill:currentColor !important;
}
`;
    } catch (_) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureInterfaceThemeSearchActionsAndTabHoverFix, { once:true });
  else ensureInterfaceThemeSearchActionsAndTabHoverFix();
  try { window.addEventListener("pageshow", ensureInterfaceThemeSearchActionsAndTabHoverFix, { passive:true }); } catch (_) {}
})();


;(() => {
  const STYLE_ID = "mk-interface-theme-sidebar-menu-position-fix-v93";
  function ensureSidebarMenuPositionFix(){
    try {
      let st = document.getElementById(STYLE_ID);
      if (!st) {
        st = document.createElement("style");
        st.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(st);
      }
      st.textContent = `
/* v92: course selector/dropdown and themed sidebar top-floor correction.
   The sticky course selector and Sort by strip must form an opaque header.
   Scrolled course items must begin visually below the Sort by boundary, never
   ghost behind the course title. */
html:is([data-mk-interface-theme="ui_theme_light_peach_grad"],[data-mk-interface-theme="ui_theme_light_lavender_grad"]){
  --mk-theme-page-bg:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg)) !important;
  --mk-theme-sidebar-bg:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg)) !important;
  --msb-sidebar-page-bg:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg)) !important;
  --msb-sidebar-page-background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg)) !important;
}
html:is([data-mk-interface-theme="ui_theme_light_peach_grad"]){ --mk-theme-sticky-floor:#fff5ef !important; }
html:is([data-mk-interface-theme="ui_theme_light_lavender_grad"]){ --mk-theme-sticky-floor:#f8f5ff !important; }
html:is([data-mk-interface-theme="ui_theme_dark_midnight"]){ --mk-theme-sticky-floor:#0c1222 !important; }
html:is([data-mk-interface-theme="ui_theme_dark_evergreen"]){ --mk-theme-sticky-floor:#081813 !important; }
html:is([data-mk-interface-theme="ui_theme_dark_aurora_grad"]){ --mk-theme-sticky-floor:#071822 !important; }
html:is([data-mk-interface-theme="ui_theme_dark_plum_grad"]){ --mk-theme-sticky-floor:#160d21 !important; }
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar,
html:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #current-course-bar{
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  overflow:visible !important;
  contain:none !important;
  isolation:isolate !important;
  z-index:94 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar::before,
html:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #current-course-bar::before{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:-1.25rem !important;
  right:-1.25rem !important;
  top:-4rem !important;
  bottom:-.2rem !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  pointer-events:none !important;
  z-index:0 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar > *,
html:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #current-course-bar > *{
  position:relative !important;
  z-index:1 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #mk-sidebar-sortdock,
html:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock{
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  z-index:90 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #mk-sidebar-sortdock::after,
html:is(
  [data-mk-interface-theme="ui_theme_light_peach_grad"],
  [data-mk-interface-theme="ui_theme_light_lavender_grad"],
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock::after{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:-1.25rem !important;
  right:-1.25rem !important;
  bottom:calc(-1 * var(--msb-sidebar-fade-h, 1.22rem)) !important;
  height:var(--msb-sidebar-fade-h, 1.22rem) !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  background-image:none !important;
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,.86) 55%,transparent 100%) !important;
  mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,.86) 55%,transparent 100%) !important;
  pointer-events:none !important;
  z-index:1 !important;
}
/* v93: hard mask for the first four dark interface themes.
   The scrollable course cards must not paint above Sort by. */
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #current-course-bar{
  position:sticky !important;
  top:0 !important;
  z-index:340 !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-sidebar-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  overflow:visible !important;
  contain:none !important;
  isolation:isolate !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar::before,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #current-course-bar::before{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:-2rem !important;
  right:-2rem !important;
  top:-8rem !important;
  bottom:-.35rem !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-sidebar-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  box-shadow:none !important;
  pointer-events:none !important;
  z-index:0 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar > *,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #current-course-bar > *{
  position:relative !important;
  z-index:2 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #mk-sidebar-sortdock,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock{
  position:sticky !important;
  z-index:330 !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-sidebar-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  overflow:visible !important;
  isolation:isolate !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #mk-sidebar-sortdock::before,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock::before{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:-2rem !important;
  right:-2rem !important;
  top:-8rem !important;
  bottom:0 !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-sidebar-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  box-shadow:none !important;
  pointer-events:none !important;
  z-index:0 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #mk-sidebar-sortdock::after,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock::after{
  z-index:0 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #mk-sidebar-sortdock .msb-sortdock__box,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock .msb-sortdock__box{
  position:relative !important;
  z-index:2 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar .ccb-menu,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface #current-course-bar .ccb-menu{
  z-index:1000 !important;
}

html.mk-sidebar-sort-ready #current-course-bar .ccb-menu,
html #mk-mobile-unified-sidebar-surface #current-course-bar .ccb-menu{
  top:calc(100% + .48rem) !important;
  z-index:110 !important;
  transform:none !important;
  margin-top:0 !important;
  max-height:min(54vh, 380px) !important;
  overflow:auto !important;
  overscroll-behavior:contain !important;
}
html.mk-sidebar-sort-ready #current-course-bar[data-course-menu-open="1"]{
  z-index:120 !important;
}
`;
    } catch (_) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureSidebarMenuPositionFix, { once:true });
  else ensureSidebarMenuPositionFix();
  try { window.addEventListener("pageshow", ensureSidebarMenuPositionFix, { passive:true }); } catch (_) {}
})();

/* v60 mobile low-heat override: appended last so it wins over visual-effect bundles. */
(function(){
  try{
    var mobile = !!(window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse), (max-width: 768px)').matches);
    if(!mobile) return;
    var st = document.getElementById('mk-mobile-low-heat-animation-style-final');
    if(!st){
      st = document.createElement('style');
      st.id = 'mk-mobile-low-heat-animation-style-final';
      (document.head || document.documentElement).appendChild(st);
    }
    st.textContent = "@media (hover: none), (pointer: coarse), (max-width: 768px){html[data-mk-search-box-effect] .md-search__form::before,html[data-mk-search-box-effect] .md-search__form::after,html[data-mk-search-box-effect] .md-search__inner::before,html[data-mk-search-box-effect] .md-search__inner::after,html[data-mk-search-box-effect] .md-search-result::after{animation:none!important;filter:none!important;text-shadow:none!important;box-shadow:none!important}}";
  }catch(_){ }
})();
