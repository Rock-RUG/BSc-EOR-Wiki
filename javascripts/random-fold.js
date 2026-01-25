// docs/javascripts/random-fold.js
(function () {
  const FLAG = "random_review_mode_v1";

  function isConceptPage() {
    // 你的规则：至少 /year/course/page 三段，且不是 index
    const p = String(window.location.pathname || "").replace(/^\/+/, "").toLowerCase();
    if (!p) return false;
    if (p.endsWith("index.html")) return false;
    const segs = p.split("/").filter(Boolean);
    return segs.length >= 3;
  }

  function shouldFold() {
    try {
      return sessionStorage.getItem(FLAG) === "1";
    } catch (_) {
      return false;
    }
  }

  function addExitChip(container) {
    const chip = document.createElement("div");
    chip.className = "md-typeset";
    chip.style.margin = "12px 0 16px 0";
    chip.style.padding = "10px 12px";
    chip.style.border = "1px solid var(--md-default-fg-color--lightest)";
    chip.style.borderRadius = "12px";
    chip.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
        <div style="opacity:.85">
          <strong>Self-test mode</strong>
          <span style="opacity:.75">Sections are folded by default.</span>
        </div>
        <button id="rf-exit" class="md-button">Exit</button>
      </div>
    `;
    const h1 = container.querySelector("h1");
    if (h1) h1.insertAdjacentElement("afterend", chip);
    else container.insertAdjacentElement("afterbegin", chip);

    const btn = chip.querySelector("#rf-exit");
    btn.addEventListener("click", () => {
      try { sessionStorage.removeItem(FLAG); } catch (_) {}
      // 退出后刷新一次恢复全展开
      window.location.reload();
    });
  }

  function foldSections() {
    const inner = document.querySelector("article.md-content__inner");
    if (!inner) return;

    // 避免重复处理
    if (inner.getAttribute("data-rf-done") === "1") return;
    inner.setAttribute("data-rf-done", "1");

    // 找到所有 h2
    const h2s = Array.from(inner.children).filter(el => el.tagName === "H2");
    if (!h2s.length) return;

    // 在标题下加一个“退出自测模式”
    addExitChip(inner);

    for (const h2 of h2s) {
      // 如果这个 h2 已经被移动过，跳过
      if (!h2.parentElement || h2.parentElement.tagName === "SUMMARY") continue;

      const details = document.createElement("details");
      details.className = "rf-details";
      // 默认折叠：不设置 open

      const summary = document.createElement("summary");
      summary.className = "rf-summary";
      summary.style.cursor = "pointer";
      summary.style.fontWeight = "600";

      // summary 文本 = 原 h2 文本（保留 emoji）
      summary.textContent = h2.textContent || "Section";

      details.appendChild(summary);

      // 把 h2 后面的兄弟节点都搬进去，直到下一个 H2 或结束
      let node = h2.nextSibling;
      const toMove = [];
      while (node) {
        const next = node.nextSibling;
        if (node.nodeType === 1 && node.tagName === "H2") break;
        toMove.push(node);
        node = next;
      }

      // 插入 details 到 h2 位置，移除 h2
      inner.insertBefore(details, h2);
      h2.remove();

      for (const n of toMove) details.appendChild(n);
    }
  }

  function init() {
    if (!isConceptPage()) return;
    if (!shouldFold()) return;
    foldSections();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  // mkdocs-material instant navigation
  document.addEventListener("DOMContentSwitch", init);
})();
