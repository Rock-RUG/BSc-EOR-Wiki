// docs/javascripts/custom-random.js
(function () {
  const TOKENS_KEY = "random_custom_tokens_v1";
  const CANDS_KEY = "random_custom_candidates_v1";
  const ENTRY_KEY = "random_custom_page_v1";

  // 新增：存每个 token 对应的候选列表，用于目标页判断“命中了哪些 token”
  const TOKENMAP_KEY = "random_custom_token_map_v1";

  function getSiteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]');

    const attr = script ? script.getAttribute("src") : (link ? link.getAttribute("href") : null);
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);

    const p = assetUrl.pathname;
    const idx = p.indexOf("/assets/");
    if (idx >= 0) return assetUrl.origin + p.slice(0, idx + 1);

    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normaliseForSearch(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokeniseLoose(s) {
    const n = normaliseForSearch(s);
    if (!n) return [];
    return n.split(" ").filter(Boolean);
  }

  function isCustomRandomPage() {
    const p = window.location.pathname.toLowerCase();
    return p.endsWith("/custom-random.html") || p.endsWith("custom-random.html");
  }

  function isIndexPage(location) {
    const loc = String(location || "").toLowerCase().split("#")[0];
    return loc.endsWith("/index.html") || loc.endsWith("index.html");
  }

  function isRandomPage(location) {
    const loc = String(location || "").toLowerCase().split("#")[0];
    if (loc.includes("/random/")) return true;
    const file = loc.split("/").pop() || "";
    return /^random.*\.html$/.test(file) || file === "custom-random.html";
  }

  function isConceptLocation(loc) {
    const s = String(loc || "");
    if (!s) return false;
    const clean = s.replace(/^\/+/, "").split("#")[0].replace(/\/+$/, "");
    const segs = clean.split("/").filter(Boolean);
    return segs.length >= 3;
  }

  function courseLabelFromLocation(location) {
    const loc = String(location || "").replace(/^\/+/, "");
    const path = loc.split("#")[0];
    const segs = path.split("/").filter(Boolean);
    if (segs.length < 2) return "";

    let course = segs[1];
    course = course.replace(/^\d+[ab]-/i, "");
    course = course.replace(/-/g, " ").trim();
    course = course.replace(/^Math\s+(I|II|III|IV)\s+/i, (m) => m.trim() + ": ");
    return course;
  }

  async function loadIndex() {
    const root = getSiteRootUrl();
    const url = new URL("search/search_index.json", root);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to load search index");
    return await res.json();
  }

  // 聚合 section hits 到 page-level
  function aggregateDocsToPages(docs) {
    const pageMap = new Map();

    for (const d of docs) {
      const locFull = String(d.location || "");
      if (!locFull) continue;

      const pageLoc = locFull.split("#")[0];
      if (!pageLoc) continue;

      if (isIndexPage(pageLoc)) continue;
      if (isRandomPage(pageLoc)) continue;
      if (!isConceptLocation(pageLoc)) continue;

      let entry = pageMap.get(pageLoc);
      if (!entry) {
        entry = { location: pageLoc, title: "", text: "" };
        pageMap.set(pageLoc, entry);
      }

      if (locFull === pageLoc && d.title) entry.title = String(d.title);

      const anchor = locFull.includes("#") ? (locFull.split("#")[1] || "").toLowerCase() : "";
      const isNoisySection =
        anchor === "prerequisites" ||
        anchor.startsWith("prerequisites-") ||
        anchor === "related-concepts" ||
        anchor.startsWith("related-concepts-");

      if (!isNoisySection && d.text) entry.text += " " + String(d.text);

      if (d.tags) entry.text += " " + String(d.tags);
      if (d.keywords) entry.text += " " + String(d.keywords);
      if (d.meta) entry.text += " " + JSON.stringify(d.meta);
    }

    for (const entry of pageMap.values()) {
      if (!entry.title) {
        const file = entry.location.split("/").pop() || "Untitled";
        entry.title = file.replace(/\.html$/i, "").replace(/-/g, " ");
      }
    }

    return Array.from(pageMap.values());
  }

  function readTokens() {
    try {
      const raw = sessionStorage.getItem(TOKENS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter(Boolean).map(String) : [];
    } catch (_) {
      return [];
    }
  }

  function storeTokens(tokens) {
    try {
      sessionStorage.setItem(TOKENS_KEY, JSON.stringify(tokens || []));
    } catch (_) {}
  }

  function storeCandidates(locations) {
    try {
      sessionStorage.setItem(CANDS_KEY, JSON.stringify(locations || []));
    } catch (_) {}
  }

  function storeTokenMap(mapObj) {
    try {
      sessionStorage.setItem(TOKENMAP_KEY, JSON.stringify(mapObj || {}));
    } catch (_) {}
  }

  function storeEntryUrl() {
    try {
      sessionStorage.setItem(ENTRY_KEY, window.location.href);
    } catch (_) {}
  }

  // 单 token 的命中（把 token 作为整体输入，但匹配用 loose tokenised）
  function matchToken(pageDoc, tokenRaw) {
    const toks = tokeniseLoose(tokenRaw);
    if (!toks.length) return false;

    const hay = normaliseForSearch((pageDoc.title || "") + " " + (pageDoc.text || "") + " " + (pageDoc.location || ""));
    // 这里仍然用 AND：一个 token 里面如果用户写了 "ivt evt"，希望同时命中
    for (const t of toks) {
      if (!hay.includes(t)) return false;
    }
    return true;
  }

  // 你要的：多个 token 之间做 OR（并集），并且结果按 token 分区
  function buildResultsByToken(pageDocs, tokens) {
    const byToken = [];
    const tokenMap = {}; // token -> [location]

    for (const token of (tokens || [])) {
      const hits = pageDocs.filter(d => matchToken(d, token));
      byToken.push({ token, hits });
      tokenMap[token] = hits.map(h => h.location);
    }

    // 合并去重（并集）
    const unionMap = new Map(); // loc -> doc
    for (const group of byToken) {
      for (const doc of group.hits) {
        if (!unionMap.has(doc.location)) unionMap.set(doc.location, doc);
      }
    }

    return { byToken, union: Array.from(unionMap.values()), tokenMap };
  }

  function toAbsoluteUrl(loc) {
    const siteRoot = getSiteRootUrl();
    const cleanLoc = String(loc).replace(/^\//, "");
    return new URL(cleanLoc, siteRoot).toString().split("#")[0] + "#top";
  }

  function pickRandom(arr) {
    if (!arr || !arr.length) return null;
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
  }

  function renderApp(container, state) {
    const tokens = state.tokens;
    const unionCount = state.union.length;

    const chips = tokens.length
      ? tokens.map((t, i) => `
          <span style="display:inline-flex;align-items:center;gap:6px;margin:0 6px 6px 0;padding:4px 10px;border-radius:999px;border:1px solid var(--md-default-fg-color--lightest);">
            <span>${escapeHtml(t)}</span>
            <button data-del="${i}" class="md-button" style="padding:2px 8px;min-width:auto">×</button>
          </span>
        `).join("")
      : `<span style="opacity:.7">No tokens yet.</span>`;

    // 按 token 分区展示
    const sections = state.byToken.length
      ? state.byToken.map(group => {
          const count = group.hits.length;
          const list = count
            ? group.hits.slice(0, 120).map(r => {
                const href = toAbsoluteUrl(r.location);
                const course = courseLabelFromLocation(r.location);
                return `
                  <article style="padding:8px 0;border-bottom:1px solid var(--md-default-fg-color--lightest);">
                    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between">
                      <a href="${href}" style="text-decoration:none">${escapeHtml(r.title || "Untitled")}</a>
                      ${course ? `<span style="opacity:.75;font-size:.85em">${escapeHtml(course)}</span>` : ""}
                    </div>
                  </article>
                `;
              }).join("")
            : `<div style="opacity:.7;padding:8px 0">No pages matched this token.</div>`;

          return `
            <section style="margin-top:16px;padding:12px 14px;border:1px solid var(--md-default-fg-color--lightest);border-radius:12px">
              <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
                <div>
                  <strong>${escapeHtml(group.token)}</strong>
                  <span style="opacity:.75">(${count} page(s))</span>
                </div>
                <button data-del-token="${escapeHtml(group.token)}" class="md-button" style="padding:4px 10px">× Remove</button>
              </div>
              <div style="margin-top:10px">
                ${list}
              </div>
            </section>
          `;
        }).join("")
      : `<div style="opacity:.75;margin-top:12px">Add tokens to see results.</div>`;

    const unionInfo = tokens.length
      ? `<div style="margin-top:14px;opacity:.85">Union (OR) across tokens: <strong>${unionCount}</strong> unique page(s)</div>`
      : "";

    container.innerHTML = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
        <input id="cr-input" class="md-input" style="flex:1;min-width:240px" placeholder="e.g. continuity, m1c-lecture05" />
        <button id="cr-add" class="md-button md-button--primary">Add</button>
        <button id="cr-clear" class="md-button">Clear all</button>
      </div>

      <div style="margin:6px 0 8px 0">
        ${chips}
      </div>

      ${unionInfo}

      ${sections}

      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:18px">
        <button id="cr-random" class="md-button md-button--primary" ${unionCount ? "" : "disabled"}>Start random</button>
      </div>
    `;

    const input = container.querySelector("#cr-input");
    const addBtn = container.querySelector("#cr-add");
    const clearBtn = container.querySelector("#cr-clear");
    const randomBtn = container.querySelector("#cr-random");

    function addTokenFromInput() {
      const v = (input.value || "").trim();
      if (!v) return;
      if (!state.tokens.includes(v)) state.tokens.push(v);
      input.value = "";
      storeTokens(state.tokens);
      state.recompute();
    }

    addBtn.addEventListener("click", addTokenFromInput);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTokenFromInput();
      }
    });

    clearBtn.addEventListener("click", () => {
      state.tokens = [];
      storeTokens(state.tokens);
      state.recompute();
    });

    // 上方 chips 的单删
    container.querySelectorAll("button[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-del"));
        if (Number.isFinite(idx)) {
          state.tokens.splice(idx, 1);
          storeTokens(state.tokens);
          state.recompute();
        }
      });
    });

    // 每个分区右上角 “× Remove”
    container.querySelectorAll("button[data-del-token]").forEach(btn => {
      btn.addEventListener("click", () => {
        const token = btn.getAttribute("data-del-token") || "";
        state.tokens = state.tokens.filter(t => t !== token);
        storeTokens(state.tokens);
        state.recompute();
      });
    });

    randomBtn.addEventListener("click", () => {
      if (!state.union.length) return;

      storeEntryUrl();

      // 写入 tokenMap + union candidates，供目标页 banner 使用
      storeTokenMap(state.tokenMap);

      const locs = state.union.map(r => r.location);
      storeCandidates(locs);

      const chosen = pickRandom(locs);
      if (!chosen) return;
      window.location.assign(toAbsoluteUrl(chosen));
    });
  }

  async function init() {
    if (!isCustomRandomPage()) return;

    const mount = document.getElementById("custom-random-app");
    if (!mount) return;

    const indexJson = await loadIndex();
    const docs = (indexJson && indexJson.docs) ? indexJson.docs : [];
    const pageDocs = aggregateDocsToPages(docs);

    let state = {
      tokens: readTokens(),
      byToken: [],
      union: [],
      tokenMap: {},
      recompute: () => {},
    };

    state.recompute = () => {
      const built = buildResultsByToken(pageDocs, state.tokens);
      state.byToken = built.byToken;
      state.union = built.union;
      state.tokenMap = built.tokenMap;
      renderApp(mount, state);
    };

    state.recompute();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init().catch(e => console.warn("custom-random:", e)));
  } else {
    init().catch(e => console.warn("custom-random:", e));
  }

  document.addEventListener("DOMContentSwitch", () => init().catch(e => console.warn("custom-random:", e)));
})();
