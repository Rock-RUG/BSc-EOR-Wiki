(function () {
  const API_BASE = "https://mkdocs-hot.eorwikihot.workers.dev";
  const PAGE_PATH = "trending.html";

  function relPathFromSiteRoot(absPathname) {
    const base = new URL(document.baseURI);
    const p = String(absPathname || window.location.pathname);
    const basePath = base.pathname;
    // 这里简单处理：只要最后是 trending.html 就行
    return p.replace(/^\/+/, "");
  }

  function isTrendingPage() {
  return !!document.getElementById("trending-app");
}

  const PERIODS = [
    { key: "24h", label: "Today", limit: 10 },
    { key: "7d", label: "This week", limit: 10 },
    { key: "30d", label: "This month", limit: 10 },
    { key: "all", label: "All time", limit: 20 },
  ];

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function buildBlock({ title, metric }) {
    const block = el("section", "trending-block");

    const header = el("div", "trending-block-header");
    header.appendChild(el("h2", "trending-block-title", title));

    const tabs = el("div", "trending-tabs");
PERIODS.forEach(p => {
  const btn = el("button", "trending-tab", p.label);
  btn.type = "button";
  btn.dataset.period = p.key;
  tabs.appendChild(btn);
});

    header.appendChild(tabs);

    const list = el("ol", "trending-list");
    const footer = el("div", "trending-footer");
    const prev = el("button", "trending-page-btn", "Prev");
    const next = el("button", "trending-page-btn", "Next");
    prev.type = "button";
    next.type = "button";
    footer.appendChild(prev);
    footer.appendChild(next);

    block.appendChild(header);
    block.appendChild(list);
    block.appendChild(footer);

    const state = {
      metric,
      period: "30d",
      offset: 0,
      total: 0,
    };

    async function load() {
      const periodConfig = PERIODS.find(x => x.key === state.period) || PERIODS[2];
      const limit = periodConfig.limit;

      list.innerHTML = "";
      list.appendChild(el("li", "trending-loading", "Loading..."));

      // popular/comments 暂时占位
      if (metric !== "views") {
  list.innerHTML = "";
  list.style.listStyle = "none";
  list.appendChild(el("li", "trending-empty", "Coming soon"));
  footer.style.display = "none";
  return;
}



      const url = new URL(API_BASE + "/hot");
      url.searchParams.set("metric", metric);
      url.searchParams.set("period", state.period);
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("offset", String(state.offset));

      const resp = await fetch(url.toString()).catch(() => null);
      const data = resp ? await resp.json().catch(() => null) : null;

      const items = data && data.items ? data.items : [];
      state.total = data && typeof data.total === "number" ? data.total : 0;

      list.innerHTML = "";
      if (!items.length) {
        list.appendChild(el("li", "trending-empty", "No data yet"));
      } else {
        items.forEach((it, idx) => {
          const li = el("li", "trending-item");
          const a = el("a", "trending-link");
          a.href = it.path;
          a.textContent = it.title || it.path;
          li.appendChild(a);

          const meta = el("span", "trending-meta", String(it.count || 0));
          li.appendChild(meta);

          list.appendChild(li);
        });
      }

      if (state.period === "all") {
        footer.style.display = "flex";
        prev.disabled = state.offset <= 0;
        next.disabled = state.offset + limit >= state.total;
      } else {
        footer.style.display = "none";
      }
    }

    function setActiveTab() {
      tabs.querySelectorAll(".trending-tab").forEach(btn => {
  btn.classList.toggle("is-active", btn.dataset.period === state.period);
});

    }

    tabs.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest(".trending-tab");
      if (!btn) return;
      state.period = btn.dataset.period;
      state.offset = 0;
      setActiveTab();
      load();
    });

    prev.addEventListener("click", () => {
      const limit = (PERIODS.find(x => x.key === state.period) || PERIODS[2]).limit;
      state.offset = Math.max(0, state.offset - limit);
      load();
    });

    next.addEventListener("click", () => {
      const limit = (PERIODS.find(x => x.key === state.period) || PERIODS[2]).limit;
      state.offset = state.offset + limit;
      load();
    });

    // 默认 this month
    setActiveTab();
    load();

    return block;
  }

  function mount() {
    if (!isTrendingPage()) return;

    const host = document.getElementById("trending-app");
    if (!host) return;

    // 防止 material 局部刷新重复 mount
    if (host.dataset.mounted === "1") return;
    host.dataset.mounted = "1";

    const wrap = el("div", "trending-grid");

    wrap.appendChild(buildBlock({ title: "Most views", metric: "views" }));
    wrap.appendChild(buildBlock({ title: "Most popular", metric: "likes" }));
    wrap.appendChild(buildBlock({ title: "Most comments", metric: "comments" }));

    host.innerHTML = "";
    host.appendChild(wrap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
  document.addEventListener("DOMContentSwitch", mount);
})();
