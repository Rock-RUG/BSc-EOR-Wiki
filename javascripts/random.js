// docs/javascripts/random.js
(function () {
  const STORAGE_SCOPE = "random_scope_v3";
  const STORAGE_LAST_NON_RANDOM = "random_last_non_random_v3";
  const RANDOM_ROUTE_PENDING_KEY = "random_route_pending_v1";
  const GPS_ROUTE_KEY = "lp_gps_route_v1";
  const GPS_ROUTE_TICKET_KEY = "lp_gps_route_ticket_v1";
  const GRAPH_URL = "assets/concept-graph.json";
  const AI_BANK_URL = "assets/ai-mcq-bank.json";
  const AI_QUIZ_SESSIONS_KEY = "concept_quiz_sessions_v1";
  const RANDOM_MODE_KEY = "random_review_mode_kind_v1";
  const RANDOM_AI_NAV_FLAG = "random_ai_nav_flag_v1";
  const RANDOM_AI_OPENED_KEY = "random_ai_opened_arrival_v1";
  const RANDOM_AI_ENTRY_URL_KEY = "random_ai_entry_url_v1";
  const RANDOM_AI_ONLY_UNTESTED_KEY = "random_ai_only_untested_after_check_v1";
  const RANDOM_ARRIVAL_ID_KEY = "random_arrival_id_v1";
  const RANDOM_ARRIVAL_LOC_KEY = "random_arrival_loc_v1";
  const SELF_TEST_MODE_KEY = "random_review_mode_v1";
  const SELF_TEST_NAV_FLAG = "random_review_nav_flag_v1";

  function queueRandomXp(metric, detail) {
    try {
      const key = "mk_xp_pending_activity_queue_v1";
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.push({ metric, details: detail || {}, opts: { scope: `${metric}:${detail && (detail.mode || detail.scope || detail.path || detail.eventName || Date.now())}`, throttleMs: 0 }, queuedAt: Date.now(), source: "random-page-fallback" });
      localStorage.setItem(key, JSON.stringify(arr.slice(-300)));
    } catch (_) {}
  }

  function recordRandomXp(metric, detail) {
    try {
      const d = Object.assign({ source: "random-page", path: location.pathname || "" }, detail || {});
      if (window.MkXpActivity && typeof window.MkXpActivity.record === "function") {
        window.MkXpActivity.record(metric, d);
        return;
      }
      if (metric === "random_browse_start" && window.MkXpActivity && typeof window.MkXpActivity.recordRandomBrowseStarted === "function") { window.MkXpActivity.recordRandomBrowseStarted(d); return; }
      if (metric === "guided_study_start" && window.MkXpActivity && typeof window.MkXpActivity.recordGuidedStudyStarted === "function") { window.MkXpActivity.recordGuidedStudyStarted(d); return; }
      if (window.MkAccountData && typeof window.MkAccountData.recordActivity === "function") { window.MkAccountData.recordActivity(metric, d, { scope: `${metric}:${d.mode || d.scope || d.path || d.eventName || Date.now()}`, throttleMs: 0 }); return; }
      queueRandomXp(metric, d);
      document.dispatchEvent(new CustomEvent("mk:xp-activity", { detail: Object.assign({ metric }, d) }));
    } catch (_) {}
  }


  function isCustomRandomPath(pathname) {
    const p = String(pathname || "").toLowerCase();
    return p.includes("custom-random");
  }

  // 只把“真正的 random 入口页”当成 random page
  // 匹配：
  // - .../random/...
  // - .../random.html
  // - .../random/index.html
  // 排除：
  // - custom-random.html
  function isTrueRandomPagePath(pathname) {
    const p = String(pathname || "").toLowerCase();
    if (isCustomRandomPath(p)) return false;
    return /(^|\/)random(\/|\.html$)/.test(p) || /(^|\/)random\/index\.html$/.test(p);
  }

  // 点击链接时，判断是否指向真正的 random 入口
  function isTrueRandomHref(href) {
    const h = String(href || "").toLowerCase();
    if (!h) return false;
    if (h.includes("custom-random")) return false;

    // 兼容相对路径 / 绝对路径 / 带 query/hash
    const clean = h.split("#")[0].split("?")[0];

    return /(^|\/)random(\/|\.html$)/.test(clean) || /(^|\/)random\/index\.html$/.test(clean);
  }

  function getSiteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]');

    const attr = script ? script.getAttribute("src") : (link ? link.getAttribute("href") : null);
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);

    const p = assetUrl.pathname;
    const idx = p.indexOf("/assets/");
    if (idx >= 0) {
      const rootPath = p.slice(0, idx + 1);
      return assetUrl.origin + rootPath;
    }

    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }

  function relPathFromSiteRoot(absPathname) {
    const siteRoot = new URL(getSiteRootUrl());
    const rootPath = siteRoot.pathname.endsWith("/") ? siteRoot.pathname : siteRoot.pathname + "/";

    let p = String(absPathname || window.location.pathname);
    if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
    p = p.replace(/^\/+/, "").replace(/\/+$/, "");
    return p;
  }

  function splitSegs(relPath) {
    return (relPath || "").split("/").filter(Boolean);
  }

  // 记录最后一个非 random 页面，避免在 random 页里再次点 random 时失去上下文
  function rememberLastNonRandom() {
    const now = window.location.pathname;
    if (!isTrueRandomPagePath(now) && !isCustomRandomPath(now)) {
      try {
        sessionStorage.setItem(STORAGE_LAST_NON_RANDOM, now);
      } catch (_) {}
    }
  }

  function readLastNonRandomPath() {
    try {
      return sessionStorage.getItem(STORAGE_LAST_NON_RANDOM) || "";
    } catch (_) {
      return "";
    }
  }

  // 从路径推断课程 scope：/<year>/<course>/...
  function isYearFolder(seg) {
  const s = String(seg || "").toLowerCase();
  return /^year[-_ ]?\d+$/.test(s);
}

function inferCourseScopeFromPath(absPathname) {
  const rel = relPathFromSiteRoot(absPathname);
  const segs = splitSegs(rel);

  if (!segs.length) return "";

  const s0 = segs[0];
  const s1 = segs[1];

  // Year-? / Course / ...
  if (isYearFolder(s0)) {
    if (!s1) return "";
    if (String(s1).toLowerCase().endsWith(".html")) return "";
    return `${s0}/${s1}/`;
  }

  // fallback
  if (String(s0 || "").toLowerCase().endsWith(".html")) return "";
  return `${s0}/`;
}

  function storeScope(scope) {
    try {
      sessionStorage.setItem(STORAGE_SCOPE, scope || "");
    } catch (_) {}
  }

  function readScope() {
    try {
      return sessionStorage.getItem(STORAGE_SCOPE) || "";
    } catch (_) {
      return "";
    }
  }

  async function loadSearchIndex() {
    const siteRoot = getSiteRootUrl();
    const url = new URL("search/search_index.json", siteRoot).toString();
    const res = await fetch(url);
    if (!res.ok) throw new Error("Cannot load search index at " + url);
    return await res.json();
  }

  // concept 页候选：至少 /year/course/page 这三段
  // 排除 random 入口页本身（但不要误伤 custom-random，因为它不在索引里也不会当候选）
  function isConceptLocation(loc) {
    const s0 = String(loc || "");
    if (!s0) return false;

    const clean = s0.split("#")[0].replace(/^\/+/, "").replace(/\/+$/, "");
    if (!clean) return false;

    const low = clean.toLowerCase();

    // Must be a real HTML page.
    if (!low.endsWith(".html")) return false;

    // Exclude obvious tool/meta pages.
    const base = (clean.split("/").pop() || "").toLowerCase();
    if (!base) return false;

    if (base === "index.html" || low.endsWith("/index.html")) return false;
    if (base === "404.html") return false;

    // Exclude any random*.html (random.html, random-xx.html, random_course.html, etc.)
    if (/^random[^\/]*\.html$/.test(base)) return false;

    // Exclude find/custom-random/trending/about/contributors pages (wherever they live)
    const badBases = new Set([
      "find.html",
      "custom-random.html",
      "trending.html",
      "contributors.html",
      "about.html",
      "about-this-wiki.html"
    ]);
    if (badBases.has(base)) return false;

    if (low.includes("assets/")) return false;
    if (low.includes("/search/")) return false;
    if (low.includes("/find")) return false;
    if (low.includes("/trending")) return false;
    if (low.includes("/contributors")) return false;
    if (low.includes("/about")) return false;

    // Concept pages in this wiki live under Year-*/<course>/...
    const segs = splitSegs(clean);
    return segs.length >= 3;
  }

  function conceptCandidates(indexJson, scopePrefix) {
    const docs = indexJson && indexJson.docs ? indexJson.docs : [];
    const scope = String(scopePrefix || "").replace(/^\/+/, "");
    return docs
      .map(d => d && d.location)
      .filter(Boolean)
      .map(String)
      .filter(isConceptLocation)
      .filter(loc => {
        if (!scope) return true;
        const clean = loc.replace(/^\/+/, "");
        return clean.startsWith(scope);
      });
  }

  function pickRandomFromList(candidates) {
    const arr = Array.isArray(candidates) ? candidates.filter(Boolean) : [];
    if (!arr.length) return null;
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
  }

  function pickRandomLocation(indexJson, scopePrefix, predicate) {
    let candidates = conceptCandidates(indexJson, scopePrefix);
    if (typeof predicate === "function") candidates = candidates.filter(predicate);
    return pickRandomFromList(candidates);
  }

  function toAbsoluteUrl(loc) {
    const siteRoot = getSiteRootUrl();
    const cleanLoc = String(loc).replace(/^\//, "");
    return new URL(cleanLoc, siteRoot).toString().split("#")[0] + "#top";
  }

  function normLoc(loc) {
    return String(loc || "").split("#")[0].replace(/^\/+/, "").trim();
  }

  function canonLoc(loc) {
    const s0 = normLoc(loc).replace(/\\/g, "/");
    if (!s0) return "";
    let s = s0.replace(/\/index\.html?$/i, "");
    s = s.replace(/\/+$/g, "");
    return s;
  }

  function clearGpsRouteState() {
    try {
      sessionStorage.removeItem(GPS_ROUTE_KEY);
      sessionStorage.removeItem(GPS_ROUTE_TICKET_KEY);
    } catch (_) {}
  }

  function writeGpsRouteTicket(loc) {
    try {
      const to = normLoc(loc);
      if (!to) {
        sessionStorage.removeItem(GPS_ROUTE_TICKET_KEY);
        return;
      }
      sessionStorage.setItem(GPS_ROUTE_TICKET_KEY, JSON.stringify({
        ts: Date.now(),
        to
      }));
    } catch (_) {}
  }

  function readMasteryLevel(loc) {
    try {
      const raw = localStorage.getItem("concept_mastery_v1");
      if (!raw) return null;
      const all = JSON.parse(raw);
      const rec = all && typeof all === "object" ? all[normLoc(loc)] : null;
      const m = rec && typeof rec.m === "number" ? rec.m : null;
      return (m === 0 || m === 1 || m === 2 || m === 3) ? m : null;
    } catch (_) {
      return null;
    }
  }

  function readMasteryRecord(loc) {
    try {
      const raw = localStorage.getItem("concept_mastery_v1");
      if (!raw) return null;
      const all = JSON.parse(raw);
      if (!all || typeof all !== "object") return null;
      const key = normLoc(loc);
      if (all[key]) return all[key];
      const target = canonLoc(key).toLowerCase();
      const found = Object.keys(all).find((k) => canonLoc(k).toLowerCase() === target);
      return found ? all[found] : null;
    } catch (_) {
      return null;
    }
  }

  function isUnvisitedConcept(loc) {
    const rec = readMasteryRecord(loc);
    if (!rec || typeof rec !== "object") return true;
    const m = rec.m;
    const hasRating = m === 0 || m === 1 || m === 2 || m === 3;
    const hasView = !!(
      rec.visited ||
      Number(rec.viewCount || rec.visitCount || rec.lastViewed || rec.lastSeen || 0) > 0 ||
      (Array.isArray(rec.history) && rec.history.some((h) => {
        const kind = String(h && (h.kind || h.type || h.event || h.action) || "").toLowerCase();
        return kind === "view" || kind === "visit" || kind === "seen";
      }))
    );
    return !hasRating && !hasView;
  }

  function aiCanon(loc) {
    let s = canonLoc(loc).replace(/\\/g, "/").toLowerCase();
    try { s = decodeURIComponent(s); } catch (_) {}
    return s;
  }

  function aiKeyAliases(loc) {
    const base = aiCanon(loc);
    const out = new Set();
    const push = (v) => { const x = aiCanon(v); if (x) out.add(x); };
    push(base);
    if (base && !base.endsWith(".html")) push(base + ".html");
    if (base.endsWith(".html")) push(base.slice(0, -5));
    if (base.endsWith("/")) push(base.slice(0, -1));
    return out;
  }

  async function loadAiBankKeySet() {
    const siteRoot = getSiteRootUrl();
    const url = new URL(AI_BANK_URL, siteRoot).toString();
    const res = await fetch(url, { cache: "no-store", credentials: "same-origin" });
    if (!res.ok) throw new Error("Cannot load AI quiz bank at " + url);
    const bank = await res.json();
    const by = bank && bank.by_concept && typeof bank.by_concept === "object" ? bank.by_concept : {};
    const set = new Set();
    Object.keys(by).forEach((key) => {
      aiKeyAliases(key).forEach((x) => set.add(x));
    });
    return set;
  }

  function locHasAiQuiz(loc, aiKeySet) {
    if (!aiKeySet || !aiKeySet.size) return false;
    for (const key of aiKeyAliases(loc)) {
      if (aiKeySet.has(key)) return true;
    }
    return false;
  }

  function readAiQuizSessions() {
    try {
      const raw = localStorage.getItem(AI_QUIZ_SESSIONS_KEY) || "{}";
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function isCompletedAiSession(session) {
    if (!session || typeof session !== "object") return false;
    if (session.completed_at || session.completedAt || session.suggested_mastery != null || session.suggestedMastery != null) return true;
    const qs = Array.isArray(session.questions) ? session.questions : [];
    return qs.length > 0 && (session.correct_count != null || session.correct != null || session.score != null);
  }

  function hasCompletedAiQuizForLoc(loc, sessions) {
    const store = sessions && typeof sessions === "object" ? sessions : readAiQuizSessions();
    const aliases = aiKeyAliases(loc);
    for (const [key, arr0] of Object.entries(store)) {
      const keyAliases = aiKeyAliases(key);
      let keyMatch = false;
      for (const a of aliases) {
        if (keyAliases.has(a)) { keyMatch = true; break; }
      }
      const arr = Array.isArray(arr0) ? arr0 : [];
      if (keyMatch && arr.some(isCompletedAiSession)) return true;
      for (const s of arr) {
        if (!isCompletedAiSession(s)) continue;
        const sid = s && (s.concept_id || s.conceptId || s.path || "");
        if (!sid) continue;
        const sidAliases = aiKeyAliases(sid);
        for (const a of aliases) {
          if (sidAliases.has(a)) return true;
        }
      }
    }
    return false;
  }

  function armRandomAiQuizNavigation(loc, mode) {
    const target = normLoc(loc);
    try {
      sessionStorage.setItem(RANDOM_MODE_KEY, "ai");
      sessionStorage.removeItem(SELF_TEST_MODE_KEY);
      sessionStorage.removeItem(SELF_TEST_NAV_FLAG);
      sessionStorage.setItem(RANDOM_AI_NAV_FLAG, "1");
      sessionStorage.removeItem(RANDOM_AI_OPENED_KEY);
      const arrivalId = String(Date.now()) + "_" + Math.random().toString(16).slice(2);
      sessionStorage.setItem(RANDOM_ARRIVAL_ID_KEY, arrivalId);
      sessionStorage.setItem(RANDOM_ARRIVAL_LOC_KEY, target);
      sessionStorage.setItem("random_ai_source_v1", String(mode || "random-ai"));
      sessionStorage.setItem(RANDOM_AI_ENTRY_URL_KEY, String(window.location.href || ""));
      if (String(mode || "").toLowerCase().includes("untested")) sessionStorage.setItem(RANDOM_AI_ONLY_UNTESTED_KEY, "1");
    } catch (_) {}
  }

  function armNormalRandomNavigation(loc) {
    try {
      sessionStorage.setItem(RANDOM_MODE_KEY, "normal");
      sessionStorage.removeItem(RANDOM_AI_NAV_FLAG);
      sessionStorage.removeItem(RANDOM_AI_OPENED_KEY);
      sessionStorage.removeItem(SELF_TEST_NAV_FLAG);
    } catch (_) {}
  }

  function masteryReady(m) {
    if (m === 3 || m === 2) return 1;
    if (m === 1) return 0.5;
    if (m === 0) return 0;
    return 0;
  }

  async function loadConceptGraph() {
    const siteRoot = getSiteRootUrl();
    const url = new URL(GRAPH_URL, siteRoot).toString();
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) throw new Error("Cannot load graph at " + url);
    return await res.json();
  }

  function getGraphPrereqs(graph, loc) {
    const key = normLoc(loc);
    if (!graph || !key) return [];
    const src =
      (graph.prereqOf && graph.prereqOf[key]) ||
      (graph.prereqs && graph.prereqs[key]) ||
      [];
    return Array.isArray(src) ? src : [];
  }

  function getGraphDependents(graph, loc) {
    const key = normLoc(loc);
    if (!graph || !key) return [];
    const src =
      (graph.dependents && graph.dependents[key]) ||
      (graph.dependentOf && graph.dependentOf[key]) ||
      [];
    return Array.isArray(src) ? src : [];
  }

  function compareRoutePrereqs(graph, a, b) {
    const locA = normLoc(a);
    const locB = normLoc(b);

    const readyA = masteryReady(readMasteryLevel(locA));
    const readyB = masteryReady(readMasteryLevel(locB));
    if (readyA !== readyB) return readyA - readyB;

    const preA = getGraphPrereqs(graph, locA).length;
    const preB = getGraphPrereqs(graph, locB).length;
    if (preA !== preB) return preB - preA;

    const depA = getGraphDependents(graph, locA).length;
    const depB = getGraphDependents(graph, locB).length;
    if (depA !== depB) return depB - depA;

    return String(locA).localeCompare(String(locB), undefined, { sensitivity: "base" });
  }

  function buildGuidedRoutePath(graph, targetLoc) {
    const target = normLoc(targetLoc);
    if (!target || !isConceptLocation(target)) return [];
    const path = [target];
    const seen = new Set([canonLoc(target)]);
    let cur = target;

    for (let depth = 0; depth < 7; depth += 1) {
      const prereqs = getGraphPrereqs(graph, cur)
        .map(normLoc)
        .filter(Boolean)
        .filter(isConceptLocation)
        .sort((a, b) => compareRoutePrereqs(graph, a, b));

      const next = prereqs.find((loc) => !seen.has(canonLoc(loc)));
      if (!next) break;
      path.unshift(next);
      seen.add(canonLoc(next));
      cur = next;
    }

    return path;
  }

  function storeGpsRouteState(targetLoc, path, startIndex) {
    try {
      const cleanPath = (Array.isArray(path) ? path : [])
        .map(normLoc)
        .filter(Boolean)
        .filter((loc, idx, arr) => arr.findIndex((x) => canonLoc(x) === canonLoc(loc)) === idx);

      if (!cleanPath.length) {
        clearGpsRouteState();
        return false;
      }

      let idx = Number.isFinite(Number(startIndex)) ? Number(startIndex) : 0;
      idx = Math.max(0, Math.min(cleanPath.length - 1, idx));

      const payload = {
        ts: Date.now(),
        target: normLoc(targetLoc || cleanPath[cleanPath.length - 1] || ""),
        path: cleanPath,
        currentIndex: idx,
        currentLoc: normLoc(cleanPath[idx] || ""),
        completed: idx === cleanPath.length - 1 && canonLoc(cleanPath[idx] || "") === canonLoc(targetLoc || cleanPath[cleanPath.length - 1] || "")
      };
      sessionStorage.setItem(GPS_ROUTE_KEY, JSON.stringify(payload));
      return true;
    } catch (_) {
      return false;
    }
  }

  function readRandomEntryModeFromUrl(urlLike) {
    try {
      const url = new URL(urlLike || window.location.href, document.baseURI);
      const raw = String(url.searchParams.get("mode") || "").toLowerCase().trim();
      if (raw === "route") return "route";
      if (raw === "unvisited" || raw === "random-unvisited") return "unvisited";
      if (raw === "ai" || raw === "ai-quiz" || raw === "random-ai") return "ai";
      if (raw === "ai-untested" || raw === "untested-ai" || raw === "random-ai-untested") return "ai-untested";
      return "concept";
    } catch (_) {
      return "concept";
    }
  }

  function readRandomEntryMode() {
    return readRandomEntryModeFromUrl(window.location.href);
  }

  function storeRandomRoutePending(loc) {
    try {
      const target = normLoc(loc);
      if (!target) return;
      sessionStorage.setItem(RANDOM_ROUTE_PENDING_KEY, JSON.stringify({
        target,
        ts: Date.now()
      }));
    } catch (_) {}
  }

  function clearRandomRoutePending() {
    try {
      sessionStorage.removeItem(RANDOM_ROUTE_PENDING_KEY);
    } catch (_) {}
  }

  async function randomJump(scope, options) {
    const indexJson = await loadSearchIndex();
    const mode = options && options.mode ? String(options.mode) : "concept";
    recordRandomXp(mode === "route" || /route/i.test(mode) ? "guided_study_start" : "random_browse_start", { source: "randomJump", eventName: "randomJump", scope: scope || "", mode });
    let loc = null;

    if (mode === "unvisited") {
      loc = pickRandomLocation(indexJson, scope || "", isUnvisitedConcept);
      // If every page has already been visited, fall back to ordinary random so
      // the menu item never feels broken.
      if (!loc) loc = pickRandomLocation(indexJson, scope || "");
    } else if (mode === "ai" || mode === "ai-untested") {
      let aiKeys = null;
      try { aiKeys = await loadAiBankKeySet(); } catch (_) { aiKeys = null; }
      const sessions = readAiQuizSessions();
      const hasAi = (candidate) => locHasAiQuiz(candidate, aiKeys);
      const untested = (candidate) => hasAi(candidate) && !hasCompletedAiQuizForLoc(candidate, sessions);
      loc = pickRandomLocation(indexJson, scope || "", mode === "ai-untested" ? untested : hasAi);
      if (!loc && mode === "ai-untested") {
        // The top Explore menu labels this simply as "Random AI Quiz".  It
        // should prefer untested checks, but if the user has tested everything
        // in scope it should still behave like a normal random AI quiz.
        loc = pickRandomLocation(indexJson, scope || "", hasAi);
      }
      // Final fallback only if the AI bank has no match for this scope.
      if (!loc) loc = pickRandomLocation(indexJson, scope || "");
    } else {
      loc = pickRandomLocation(indexJson, scope || "");
    }

    if (!loc) {
      clearRandomRoutePending();
      clearGpsRouteState();
      return;
    }

    try { sessionStorage.setItem("random_review_mode_v1", "1"); } catch (_) {}

    if (mode === "route") {
      armNormalRandomNavigation(loc);
      try {
        const graph = await loadConceptGraph();
        const routePath = buildGuidedRoutePath(graph, loc);
        if (storeGpsRouteState(loc, routePath, 0)) {
          clearRandomRoutePending();
          const startLoc = normLoc(routePath[0] || loc);
          writeGpsRouteTicket(startLoc);
          window.location.assign(toAbsoluteUrl(startLoc));
          return;
        }
      } catch (_) {}

      storeRandomRoutePending(loc);
      clearGpsRouteState();
      window.location.assign(toAbsoluteUrl(loc));
      return;
    }

    clearRandomRoutePending();
    clearGpsRouteState();
    if (mode === "ai" || mode === "ai-untested") armRandomAiQuizNavigation(loc, mode);
    else armNormalRandomNavigation(loc);
    window.location.assign(toAbsoluteUrl(loc));
  }

  async function directRandomJumpFromHref(href, options) {
    const rawHref = String(href || "");
    if (!isTrueRandomHref(rawHref)) return false;
    const scope = options && Object.prototype.hasOwnProperty.call(options, "scope")
      ? String(options.scope || "")
      : (readScope() || "");
    const mode = options && options.mode ? String(options.mode) : readRandomEntryModeFromUrl(rawHref);
    await randomJump(scope, { mode });
    return true;
  }

  // 点击 Random 入口时，仅记录 scope，不拦截默认跳转
  function bindRandomScopeRecorder() {
    if (window.__randomScopeRecorderBoundV3) return;
    window.__randomScopeRecorderBoundV3 = true;

    document.addEventListener(
      "click",
      (ev) => {
        const a = ev.target && ev.target.closest ? ev.target.closest("a") : null;
        if (!a) return;

        const href = a.getAttribute("href") || "";
        if (!href) return;

        // 只处理“真正的 random 入口”
        if (!isTrueRandomHref(href)) return;

        const mode = a.getAttribute("data-random-scope") || "";

        if (mode === "course") {
          const courseScope = inferCourseScopeFromPath(window.location.pathname);
          storeScope(courseScope || "");
        } else {
          storeScope("");
        }
      },
      true
    );
  }

  // 如果当前就是 random 入口页，则根据 scope 自动跳转到随机 concept
  async function autoOnRandomPage() {
    if (!isTrueRandomPagePath(window.location.pathname)) return;

    const scope = readScope() || "";
    const mode = readRandomEntryMode();
    try {
      await randomJump(scope, { mode });
    } catch (e) {
      clearRandomRoutePending();
      console.warn("Random auto jump failed:", e);
    }
  }

  function init() {
    rememberLastNonRandom();
    bindRandomScopeRecorder();
    autoOnRandomPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("DOMContentSwitch", init);

  window.MkRandom = Object.assign({}, window.MkRandom || {}, {
    jump: randomJump,
    jumpFromHref: directRandomJumpFromHref,
    storeScope,
    inferCourseScopeFromPath
  });
})();
