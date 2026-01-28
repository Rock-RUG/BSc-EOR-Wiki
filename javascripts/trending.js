function cleanTitle(title) {
  const t = String(title || "").trim();
  if (!t) return "";
  return t.replace(/\s+-\s+BSc EOR Wiki\s*$/i, "").trim();
}

function courseLabelFromPath(path) {
  // 例：Year-1/1a-Math-I-Calculus/definite-integral.html
  const p = String(path || "").replace(/^\/+/, "");
  const segs = p.split("/").filter(Boolean);
  if (segs.length < 2) return "";

  let courseSeg = segs[1]; // 1a-Math-I-Calculus
  courseSeg = courseSeg.replace(/^\d+[a-z]-/i, ""); // 去掉 1a- / 2b- 这种前缀
  courseSeg = courseSeg.replace(/-/g, " ").trim(); // Math I Calculus

  // 给 "Math I Calculus" 这种插入冒号：Math I: Calculus
  const parts = courseSeg.split(/\s+/).filter(Boolean);
  if (parts.length >= 3 && /^Math$/i.test(parts[0]) && /^[IVX]+$/i.test(parts[1])) {
    return `${parts[0]} ${parts[1]}: ${parts.slice(2).join(" ")}`;
  }

  return courseSeg;
}

function displayTitle(item) {
  const page = cleanTitle(item.title) || item.path;
  const course = courseLabelFromPath(item.path);
  return course ? `${page} - ${course}` : page;
}

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
    // Note: "Today" is a UTC calendar day (not a rolling last-24-hours window)
    { key: "today", label: "Today", limit: 10 },
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
    // 仅 Most views 显示右侧数字含义
    if (metric === "views") {
      header.appendChild(el("div", "trending-metahead", "Total views"));
    }

    const tabs = el("div", "trending-tabs");
    PERIODS.forEach((p) => {
      const btn = el("button", "trending-tab", p.label);
      btn.type = "button";
      btn.dataset.period = p.key;
      tabs.appendChild(btn);
    });

    header.appendChild(tabs);

    const list = el("ol", "trending-list");
    const footer = el("div", "trending-footer");

    const prev = el("button", "trending-page-btn");
    prev.type = "button";
    prev.setAttribute("aria-label", "Previous page");
    prev.textContent = "←";

    const pages = el("div", "trending-pages"); // 👈 页码容器

    const next = el("button", "trending-page-btn");
    next.type = "button";
    next.setAttribute("aria-label", "Next page");
    next.textContent = "→";

    footer.appendChild(prev);
    footer.appendChild(pages);
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
      const periodConfig = PERIODS.find((x) => x.key === state.period) || PERIODS[2];
      const limit = periodConfig.limit;

      list.classList.add("is-loading");
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
          a.href = new URL(it.path, document.baseURI).toString();
          a.textContent = displayTitle(it);
          li.appendChild(a);

          const meta = el("span", "trending-meta", String(it.count || 0));
          li.appendChild(meta);

          list.appendChild(li);
        });
      }

      if (state.period === "all") {
        footer.style.display = "flex";

        const totalPages = Math.max(1, Math.ceil(state.total / limit));
        const currentPage = Math.floor(state.offset / limit) + 1;

        prev.disabled = currentPage <= 1;
        next.disabled = currentPage >= totalPages;
        list.classList.remove("is-loading");
        // 渲染页码：1 2 3 ... totalPages，当前高亮
        pages.innerHTML = "";
        for (let p = 1; p <= totalPages; p++) {
          const b = el("button", "trending-page-num", String(p));
          b.type = "button";
          b.dataset.page = String(p);
          if (p === currentPage) b.classList.add("is-active");
          pages.appendChild(b);
        }
      } else {
        footer.style.display = "none";
        pages.innerHTML = "";
      }

      // 🔢 MathJax：对动态插入的标题重新 typeset
      if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
        window.MathJax.typesetPromise([list]).catch(() => {});
      }
    }

    function setActiveTab() {
      tabs.querySelectorAll(".trending-tab").forEach((btn) => {
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
      const limit = (PERIODS.find((x) => x.key === state.period) || PERIODS[2]).limit;
      state.offset = Math.max(0, state.offset - limit);
      load();
    });

    next.addEventListener("click", () => {
      const limit = (PERIODS.find((x) => x.key === state.period) || PERIODS[2]).limit;
      state.offset = state.offset + limit;
      load();
    });

    pages.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest(".trending-page-num");
      if (!btn) return;
      const p = Number(btn.dataset.page || "1");
      const limit = (PERIODS.find((x) => x.key === state.period) || PERIODS[2]).limit;
      state.offset = (p - 1) * limit;
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
