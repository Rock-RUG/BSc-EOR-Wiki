// docs/javascripts/search-results.js
(function () {
  // ========== base url ==========
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

  function closeMaterialSearchOverlay() {
    const toggle =
      document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
      document.querySelector('input#__search');
    if (toggle) toggle.checked = false;

    const input = document.querySelector('input[data-md-component="search-query"]');
    if (input) input.blur();
  }

  function isOnFindPage() {
    const p = window.location.pathname.toLowerCase();
    return p.endsWith("/find.html") || p.endsWith("find.html");
  }

  // ========== helpers ==========
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function stripHtml(s) {
    if (!s) return "";
    const div = document.createElement("div");
    div.innerHTML = s;
    return div.textContent || div.innerText || "";
  }

  function normaliseText(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function normaliseForSearch(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokeniseQuery(q) {
    return normaliseForSearch(q).split(" ").filter(Boolean);
  }

  // 让 snippet 不显示 TeX
  function stripMathJax(s) {
    if (!s) return "";
    let t = stripHtml(s);

    t = t.replace(/\$\$[\s\S]*?\$\$/g, " ");
    t = t.replace(/\$[^$]*?\$/g, " ");
    t = t.replace(/\\\[[\s\S]*?\\\]/g, " ");
    t = t.replace(/\\\([\s\S]*?\\\)/g, " ");

    t = t.replace(/\\([a-zA-Z]+)\b/g, "$1");
    t = t.replace(/[{}]/g, " ");
    return normaliseText(t);
  }

  // ========== filters ==========
  function isIndexPage(location) {
    const loc = String(location || "").toLowerCase().split("#")[0];
    return loc.endsWith("/index.html") || loc.endsWith("index.html");
  }

  function isRandomPage(location) {
    const loc = String(location || "").toLowerCase().split("#")[0];
    if (loc.includes("/random/")) return true;
    const file = loc.split("/").pop() || "";
    return /^random.*\.html$/.test(file);
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

  function toAbsoluteUrl(loc) {
    const root = getSiteRootUrl();
    return new URL(String(loc || "").replace(/^\//, ""), root).toString();
  }

  // ========== index loading & aggregation ==========
  async function loadIndex() {
    const root = getSiteRootUrl();
    const url = new URL("search/search_index.json", root);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to load search index");
    return await res.json();
  }

  function asStringList(x) {
    if (!x) return [];
    if (Array.isArray(x)) return x.map(String).filter(Boolean);
    if (typeof x === "string") return [x];
    return [];
  }

  function getTagsFromDoc(d) {
    // 兼容多种形状
    const out = [];
    out.push(...asStringList(d && d.tags));
    out.push(...asStringList(d && d.tag));
    out.push(...asStringList(d && d.meta && d.meta.tags));
    return out;
  }

  function getAliasesFromDoc(d) {
    const out = [];
    out.push(...asStringList(d && d.aliases));
    out.push(...asStringList(d && d.alias));
    out.push(...asStringList(d && d.meta && d.meta.aliases));
    return out;
  }

  // 把 section(#anchor) 聚合成 page-level 文档（你旧的 search-results.js 就是这么做的）
  function aggregateDocsToPages(docs) {
    const pageMap = new Map();

    for (const d of docs) {
      const locFull = String(d.location || "");
      if (!locFull) continue;

      const pageLoc = locFull.split("#")[0];
      if (!pageLoc) continue;

      if (isIndexPage(pageLoc)) continue;
      if (isRandomPage(pageLoc)) continue;

      let entry = pageMap.get(pageLoc);
      if (!entry) {
        entry = {
          location: pageLoc,
          title: "",
          text: "",
          tags: new Set(),
          aliases: new Set(),
        };
        pageMap.set(pageLoc, entry);
      }

      if (locFull === pageLoc && d.title) entry.title = String(d.title);

      for (const tg of getTagsFromDoc(d)) entry.tags.add(String(tg));
      for (const al of getAliasesFromDoc(d)) entry.aliases.add(String(al));

      // 跳过 noisy section
      const anchor = locFull.includes("#") ? (locFull.split("#")[1] || "").toLowerCase() : "";
      const isNoisy =
        anchor === "prerequisites" || anchor.startsWith("prerequisites-") ||
        anchor === "related-concepts" || anchor.startsWith("related-concepts-");

      if (!isNoisy && d.text) entry.text += " " + stripMathJax(d.text);
    }

    const out = [];
    for (const entry of pageMap.values()) {
      if (!entry.title) {
        const file = entry.location.split("/").pop() || "Untitled";
        entry.title = file.replace(/\.html$/i, "").replace(/-/g, " ");
      }
      out.push({
        location: entry.location,
        title: entry.title,
        text: entry.text,
        tags: Array.from(entry.tags),
        aliases: Array.from(entry.aliases),
      });
    }
    return out;
  }

  // ========== token matching (Step 1: union semantics) ==========
  // token 内部多词：AND
  function matchToken(doc, token) {
    const tks = tokeniseQuery(token);
    if (!tks.length) return false;

    const titleN = normaliseForSearch(doc.title || "");
    const textN = normaliseForSearch(doc.text || "");
    const locN = normaliseForSearch(doc.location || "");
    const tagsN = normaliseForSearch((doc.tags || []).join(" "));
    const aliasesN = normaliseForSearch((doc.aliases || []).join(" "));
    const hay = `${titleN} ${textN} ${locN} ${tagsN} ${aliasesN}`;

    for (const t of tks) {
      if (!hay.includes(t)) return false;
    }
    return true;
  }

  function buildGroups(pageDocs, tokens) {
    const byToken = [];
    const unionMap = new Map(); // loc -> doc

    for (const token of tokens) {
      const hits = [];
      for (const d of pageDocs) {
        if (matchToken(d, token)) {
          hits.push(d);
          if (!unionMap.has(d.location)) unionMap.set(d.location, d);
        }
      }
      byToken.push({ token, hits });
    }

    const union = Array.from(unionMap.values());
    return { byToken, union };
  }

  // ========== selection & random ==========
  const STORAGE_KEY = "customRandomState.v1"; // 统一用这一份（find 也用）

  function loadStateFromStorage() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveStateToStorage(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  function countSelected(union, selectedMap) {
    let n = 0;
    for (const d of union) if (selectedMap[d.location]) n++;
    return n;
  }

  function pickRandomSelected(union, selectedMap) {
    const pool = union.filter(d => !!selectedMap[d.location]);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function bindSearchFormToToken(state, rerender) {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    if (!form || !input) return;

    // submit = 把 input 当成“新增 token”，而不是替换页面
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const v = (input.value || "").trim();
      if (!v) return;

      // 如果当前 tokens 为空，把它当第一个；否则追加
      state.tokens.push(v);

      // 清空输入框，并把 URL 上 q 清掉（避免刷新后重复注入）
      input.value = "";
      const params = new URLSearchParams(window.location.search);
      params.delete("q");
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

      rerender();
    });
  }

  // ========== UI ==========
  function render(container, state) {
    const tokens = state.tokens;
    const byToken = state.byToken;
    const union = state.union;
    const selectedMap = state.selectedMap;

    const unionCount = union.length;
    const selectedCount = countSelected(union, selectedMap);

    const chips = tokens.length
      ? tokens.map((t, i) => `
          <span style="display:inline-flex;align-items:center;gap:6px;margin:0 6px 6px 0;padding:4px 10px;border-radius:999px;border:1px solid var(--md-default-fg-color--lightest);">
            <span>${escapeHtml(t)}</span>
            <button data-del="${i}" class="md-button" style="padding:2px 8px;min-width:auto">×</button>
          </span>
        `).join("")
      : `<span style="opacity:.7">No tokens yet. Use the search bar above to add one.</span>`;

    const topInfo = tokens.length ? `
      <div style="margin-top:10px;opacity:.85;line-height:1.5">
        <div>Found <strong>${unionCount}</strong> page(s) related to your tokens.</div>
        <div><strong>${selectedCount}</strong> page(s) are selected for random practice.</div>
      </div>
    ` : "";

    const controls = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px">
        <button id="cr-random" class="md-button md-button--primary" ${selectedCount ? "" : "disabled"}>
          Start random
        </button>
        <button id="cr-select-all" class="md-button" ${unionCount ? "" : "disabled"}>Select all</button>
        <button id="cr-select-none" class="md-button" ${unionCount ? "" : "disabled"}>Select none</button>
      </div>
    `;

    const sections = byToken.length ? byToken.map(group => {
      const token = group.token;
      const hits = group.hits || [];
      const list = hits.map(d => {
        const href = toAbsoluteUrl(d.location);
        const course = courseLabelFromLocation(d.location);
        const checked = selectedMap[d.location] ? "checked" : "";
        return `
          <article style="padding:8px 0;border-bottom:1px solid var(--md-default-fg-color--lightest);">
            <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between">
              <div style="display:flex;gap:10px;align-items:center;min-width:260px;flex:1">
                <input type="checkbox" data-select-loc="${escapeHtml(d.location)}" ${checked} />
                <a href="${href}" style="text-decoration:none">${escapeHtml(d.title || "Untitled")}</a>
              </div>
              ${course ? `<span class="sr-chip">${escapeHtml(course)}</span>` : ""}
            </div>
          </article>
        `;
      }).join("");

      return `
        <details open style="margin-top:14px">
          <summary style="cursor:pointer">
            <strong>${escapeHtml(token)}</strong> <span style="opacity:.7">(${hits.length})</span>
          </summary>
          <div style="margin-top:8px">${list || `<div style="opacity:.7">No hits.</div>`}</div>
        </details>
      `;
    }).join("") : "";

    container.innerHTML = `
      <div class="sr-top">
        <div class="sr-top__title">Find</div>
        <div style="margin-top:8px">${chips}</div>
        ${topInfo}
        ${controls}
      </div>
      <div class="sr-list" style="margin-top:10px">
        ${tokens.length ? sections : `<div class="sr-empty"><p>Add a token to see results.</p></div>`}
      </div>
    `;

    // bind chip delete
    container.querySelectorAll("button[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-del"));
        if (!Number.isFinite(idx)) return;
        state.tokens.splice(idx, 1);
        rerender(container, state);
      });
    });

    // bind per-item checkbox
    container.querySelectorAll('input[type="checkbox"][data-select-loc]').forEach(cb => {
      cb.addEventListener("change", () => {
        const loc = cb.getAttribute("data-select-loc");
        state.selectedMap[loc] = cb.checked;
        // 只更新上面的计数和 random 按钮状态：简单起见直接全 rerender
        rerender(container, state);
      });
    });

    // select all/none
    const btnAll = container.querySelector("#cr-select-all");
    if (btnAll) btnAll.addEventListener("click", () => {
      for (const d of state.union) state.selectedMap[d.location] = true;
      rerender(container, state);
    });

    const btnNone = container.querySelector("#cr-select-none");
    if (btnNone) btnNone.addEventListener("click", () => {
      for (const d of state.union) state.selectedMap[d.location] = false;
      rerender(container, state);
    });

    // random
    const btnRandom = container.querySelector("#cr-random");
    if (btnRandom) btnRandom.addEventListener("click", () => {
      const picked = pickRandomSelected(state.union, state.selectedMap);
      if (!picked) return;

      // 存储给 banner/continue random 用（你原本就是这么做的思路）
      saveStateToStorage({
        tokens: state.tokens,
        selectedMap: state.selectedMap,
        // 直接存 union locations，足够 banner 继续 random
        unionLocations: state.union.map(d => d.location),
      });

      window.location.assign(toAbsoluteUrl(picked.location));
    });

    // persist
    saveStateToStorage({
      tokens: state.tokens,
      selectedMap: state.selectedMap,
      unionLocations: state.union.map(d => d.location),
    });
  }

  function rerender(container, state) {
    // 重新计算 groups/union
    const g = buildGroups(state.pageDocs, state.tokens);
    state.byToken = g.byToken;
    state.union = g.union;

    // 对新 union 默认勾上（更符合“筛选池”直觉）
    for (const d of state.union) {
      if (state.selectedMap[d.location] === undefined) state.selectedMap[d.location] = true;
    }

    render(container, state);
  }

  async function main() {
    if (!isOnFindPage()) return;

    closeMaterialSearchOverlay();

    const container = document.getElementById("search-results");
    if (!container) return;

    // 初始化 tokens：q 作为首 token（只注入一次）
    const params = new URLSearchParams(window.location.search);
    const q = (params.get("q") || "").trim();

    const indexJson = await loadIndex();
    const docs = (indexJson && indexJson.docs) ? indexJson.docs : [];
    const pageDocs = aggregateDocsToPages(docs);

    const restored = loadStateFromStorage();

    const state = {
      pageDocs,
      tokens: [],
      byToken: [],
      union: [],
      selectedMap: (restored && restored.selectedMap) ? restored.selectedMap : {},
    };

    if (q) state.tokens.push(q);

    bindSearchFormToToken(state, () => rerender(container, state));

    // 把 find 页顶部输入框展示为 q（便于用户看见自己刚搜了啥）
    const input = document.getElementById("search-input");
    if (input && q) input.value = q;

    rerender(container, state);
  }

  function init() {
    main().catch(err => console.warn("find unified:", err));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("DOMContentSwitch", init);
})();
