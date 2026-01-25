// docs/javascripts/custom-random.js
(function () {
  const TOKENS_KEY = "random_custom_tokens_v1";
  const CANDS_KEY = "random_custom_candidates_v1";
  const ENTRY_KEY = "random_custom_page_v1";
  const TOKENMAP_KEY = "random_custom_token_map_v1";

  // 每个 token 的展开状态
  const EXPAND_KEY = "random_custom_expand_v1";

  // 用户勾选池（location -> true/false）
  const SELECT_KEY = "random_custom_selected_v1";

  // 新增：custom random 页面上的 self-test 勾选状态
  const SELFTEST_PREF_KEY = "random_custom_selftest_pref_v1";

  const PER_TOKEN_PREVIEW = 10;

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

  function readJson(key, fallback) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return fallback;
      const v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  }

  function readTokens() {
    const arr = readJson(TOKENS_KEY, []);
    return Array.isArray(arr) ? arr.filter(Boolean).map(String) : [];
  }

  function storeTokens(tokens) {
    writeJson(TOKENS_KEY, tokens || []);
  }

  function storeCandidates(locations) {
    writeJson(CANDS_KEY, locations || []);
  }

  function storeTokenMap(mapObj) {
    writeJson(TOKENMAP_KEY, mapObj || {});
  }

  function storeEntryUrl() {
    try {
      sessionStorage.setItem(ENTRY_KEY, window.location.href);
    } catch (_) {}
  }

  function readExpandState() {
    const obj = readJson(EXPAND_KEY, {});
    return obj && typeof obj === "object" ? obj : {};
  }

  function storeExpandState(obj) {
    writeJson(EXPAND_KEY, obj || {});
  }

  function readSelectedMap() {
    const obj = readJson(SELECT_KEY, {});
    return obj && typeof obj === "object" ? obj : {};
  }

  function storeSelectedMap(obj) {
    writeJson(SELECT_KEY, obj || {});
  }

  function readSelfTestPref() {
    // 默认 true，更符合“自测”目的
    const v = readJson(SELFTEST_PREF_KEY, true);
    return v === true;
  }

  function storeSelfTestPref(v) {
    writeJson(SELFTEST_PREF_KEY, !!v);
  }

  function matchToken(pageDoc, tokenRaw) {
    const toks = tokeniseLoose(tokenRaw);
    if (!toks.length) return false;

    const hay = normaliseForSearch((pageDoc.title || "") + " " + (pageDoc.text || "") + " " + (pageDoc.location || ""));
    for (const t of toks) {
      if (!hay.includes(t)) return false;
    }
    return true;
  }

  function buildResultsByToken(pageDocs, tokens) {
    const byToken = [];
    const tokenMap = {};

    for (const token of (tokens || [])) {
      const hits = pageDocs.filter(d => matchToken(d, token));
      byToken.push({ token, hits });
      tokenMap[token] = hits.map(h => h.location);
    }

    const unionMap = new Map();
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

  function ensureDefaultSelection(unionDocs, selectedMap) {
    let changed = false;
    for (const d of unionDocs) {
      const loc = d.location;
      if (selectedMap[loc] === undefined) {
        selectedMap[loc] = true;
        changed = true;
      }
    }
    const unionSet = new Set(unionDocs.map(d => d.location));
    for (const k of Object.keys(selectedMap)) {
      if (!unionSet.has(k)) {
        delete selectedMap[k];
        changed = true;
      }
    }
    return changed;
  }

  function countSelected(unionDocs, selectedMap) {
    let c = 0;
    for (const d of unionDocs) if (selectedMap[d.location]) c++;
    return c;
  }

  function setSelectionForLocations(selectedMap, locations, value) {
    for (const loc of locations) selectedMap[loc] = value;
  }

  function renderApp(container, state) {
    const tokens = state.tokens;
    const unionCount = state.union.length;
    const selectedCount = countSelected(state.union, state.selectedMap);

    const chips = tokens.length
      ? tokens.map((t, i) => `
          <span style="display:inline-flex;align-items:center;gap:6px;margin:0 6px 6px 0;padding:4px 10px;border-radius:999px;border:1px solid var(--md-default-fg-color--lightest);">
            <span>${escapeHtml(t)}</span>
            <button data-del="${i}" class="md-button" style="padding:2px 8px;min-width:auto">×</button>
          </span>
        `).join("")
      : `<span style="opacity:.7">No tokens yet.</span>`;

    const unionInfo = tokens.length
      ? `<div style="margin-top:12px;opacity:.85">
           Union (OR) across tokens: <strong>${unionCount}</strong> unique page(s),
           Selected for random: <strong>${selectedCount}</strong>
         </div>`
      : "";

    const selfTestChecked = state.selfTestPref ? "checked" : "";

    const startBar = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px">
        <button id="cr-random" class="md-button md-button--primary" ${selectedCount ? "" : "disabled"}>
          Start random
        </button>

        <label style="display:inline-flex;align-items:center;gap:8px;opacity:.9">
          <input id="cr-selftest" type="checkbox" ${selfTestChecked} />
          Self-test mode (fold sections)
        </label>
      </div>
    `;

    const expandState = state.expandState || {};
    const selectedMap = state.selectedMap || {};

    const sections = state.byToken.length
      ? state.byToken.map(group => {
          const token = group.token;
          const hits = group.hits || [];
          const count = hits.length;

          const expanded = !!expandState[token];
          const shown = expanded ? hits : hits.slice(0, PER_TOKEN_PREVIEW);
          const hiddenCount = Math.max(0, count - shown.length);

          const list = count
            ? shown.map(r => {
                const href = toAbsoluteUrl(r.location);
                const course = courseLabelFromLocation(r.location);
                const checked = selectedMap[r.location] ? "checked" : "";
                return `
                  <article style="padding:8px 0;border-bottom:1px solid var(--md-default-fg-color--lightest);">
                    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between">
                      <div style="display:flex;gap:10px;align-items:center;min-width:260px;flex:1">
                        <input type="checkbox" data-select-loc="${escapeHtml(r.location)}" ${checked} />
                        <a href="${href}" style="text-decoration:none">${escapeHtml(r.title || "Untitled")}</a>
                      </div>
                      ${course ? `<span style="opacity:.75;font-size:.85em">${escapeHtml(course)}</span>` : ""}
                    </div>
                  </article>
                `;
              }).join("")
            : `<div style="opacity:.7;padding:8px 0">No pages matched this token.</div>`;

          const foldBtn = (count > PER_TOKEN_PREVIEW)
            ? `<button data-toggle-token="${escapeHtml(token)}" class="md-button" style="padding:4px 10px">
                 ${expanded ? "Fold" : `Expand (+${hiddenCount})`}
               </button>`
            : "";

          const tokenActions = count
            ? `
              <button data-token-all="${escapeHtml(token)}" class="md-button" style="padding:4px 10px">Select all</button>
              <button data-token-none="${escapeHtml(token)}" class="md-button" style="padding:4px 10px">Select none</button>
            `
            : "";

          return `
            <section style="margin-top:16px;padding:12px 14px;border:1px solid var(--md-default-fg-color--lightest);border-radius:12px">
              <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
                <div>
                  <strong>${escapeHtml(token)}</strong>
                  <span style="opacity:.75">(${count} page(s))</span>
                </div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
                  ${foldBtn}
                  ${tokenActions}
                  <button data-del-token="${escapeHtml(token)}" class="md-button" style="padding:4px 10px">× Remove</button>
                </div>
              </div>
              <div style="margin-top:10px">
                ${list}
              </div>
            </section>
          `;
        }).join("")
      : `<div style="opacity:.75;margin-top:12px">Add tokens to see results.</div>`;

    container.innerHTML = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
        <input id="cr-input" class="md-input" style="flex:1;min-width:240px" placeholder="e.g. continuity, m1c-lecture05" />
        <button id="cr-add" class="md-button md-button--primary">Add</button>
        <button id="cr-clear" class="md-button">Clear all</button>
      </div>

      <div style="margin:6px 0 6px 0">
        ${chips}
      </div>

      ${unionInfo}
      ${startBar}

      ${sections}
    `;

    const input = container.querySelector("#cr-input");
    const addBtn = container.querySelector("#cr-add");
    const clearBtn = container.querySelector("#cr-clear");
    const randomBtn = container.querySelector("#cr-random");

    const selfTestCb = container.querySelector("#cr-selftest");


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

    // 记住 self-test 勾选
    if (selfTestCb) {
      selfTestCb.addEventListener("change", () => {
        state.selfTestPref = !!selfTestCb.checked;
        storeSelfTestPref(state.selfTestPref);
        state.recompute();
      });
    }

    clearBtn.addEventListener("click", () => {
      state.tokens = [];
      storeTokens(state.tokens);
      state.expandState = {};
      storeExpandState(state.expandState);

      state.selectedMap = {};
      storeSelectedMap(state.selectedMap);

      state.recompute();
    });

    container.querySelectorAll("button[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-del"));
        if (Number.isFinite(idx)) {
          const removed = state.tokens[idx];
          state.tokens.splice(idx, 1);
          storeTokens(state.tokens);

          if (removed && state.expandState) {
            delete state.expandState[removed];
            storeExpandState(state.expandState);
          }
          state.recompute();
        }
      });
    });

    container.querySelectorAll("button[data-del-token]").forEach(btn => {
      btn.addEventListener("click", () => {
        const token = btn.getAttribute("data-del-token") || "";
        state.tokens = state.tokens.filter(t => t !== token);
        storeTokens(state.tokens);

        if (state.expandState) {
          delete state.expandState[token];
          storeExpandState(state.expandState);
        }
        state.recompute();
      });
    });

    container.querySelectorAll("button[data-toggle-token]").forEach(btn => {
      btn.addEventListener("click", () => {
        const token = btn.getAttribute("data-toggle-token") || "";
        state.expandState = state.expandState || {};
        state.expandState[token] = !state.expandState[token];
        storeExpandState(state.expandState);
        state.recompute();
      });
    });

    container.querySelectorAll("input[type=checkbox][data-select-loc]").forEach(cb => {
      cb.addEventListener("change", () => {
        const loc = cb.getAttribute("data-select-loc") || "";
        if (!loc) return;
        state.selectedMap[loc] = cb.checked;
        storeSelectedMap(state.selectedMap);
        state.recompute();
      });
    });


    container.querySelectorAll("button[data-token-all]").forEach(btn => {
      btn.addEventListener("click", () => {
        const token = btn.getAttribute("data-token-all") || "";
        const group = state.byToken.find(g => g.token === token);
        if (!group) return;
        const locs = group.hits.map(d => d.location);
        setSelectionForLocations(state.selectedMap, locs, true);
        storeSelectedMap(state.selectedMap);
        state.recompute();
      });
    });

    container.querySelectorAll("button[data-token-none]").forEach(btn => {
      btn.addEventListener("click", () => {
        const token = btn.getAttribute("data-token-none") || "";
        const group = state.byToken.find(g => g.token === token);
        if (!group) return;
        const locs = group.hits.map(d => d.location);
        setSelectionForLocations(state.selectedMap, locs, false);
        storeSelectedMap(state.selectedMap);
        state.recompute();
      });
    });

    // Start random：只从勾选池随机
    randomBtn.addEventListener("click", () => {
      const poolDocs = state.union.filter(d => state.selectedMap[d.location]);
      if (!poolDocs.length) return;

      storeEntryUrl();
      storeTokenMap(state.tokenMap);

      const locs = poolDocs.map(r => r.location);
      storeCandidates(locs);

      const chosen = pickRandom(locs);
      if (!chosen) return;

      // 关键：根据勾选决定是否开启 self-test mode
      const wantSelfTest = !!(selfTestCb && selfTestCb.checked);
      try {
        if (wantSelfTest) sessionStorage.setItem("random_review_mode_v1", "1");
        else sessionStorage.removeItem("random_review_mode_v1");
      } catch (_) {}

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
      expandState: readExpandState(),
      selectedMap: readSelectedMap(),
      selfTestPref: readSelfTestPref(),
      recompute: () => {},
    };

    state.recompute = () => {
      const built = buildResultsByToken(pageDocs, state.tokens);
      state.byToken = built.byToken;
      state.union = built.union;
      state.tokenMap = built.tokenMap;

      const cleanExpand = {};
      for (const t of state.tokens) cleanExpand[t] = !!state.expandState[t];
      state.expandState = cleanExpand;
      storeExpandState(state.expandState);

      const changed = ensureDefaultSelection(state.union, state.selectedMap);
      if (changed) storeSelectedMap(state.selectedMap);

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
