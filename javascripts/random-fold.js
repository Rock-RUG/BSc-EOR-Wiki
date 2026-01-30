const UNFOLD_ONCE_KEY = "random_unfold_once_v1";
// docs/javascripts/random-fold.js
(function () {
  const MODE_FLAG = "random_review_mode_v1";

  // 新增：只有从 Start/Continue random 导航过来才允许折叠（一次性）
  const REVIEW_NAV_FLAG = "random_review_nav_flag_v1";

  function isConceptPage() {
    const p = String(window.location.pathname || "").replace(/^\/+/, "").toLowerCase();
    if (!p) return false;
    if (p.endsWith("index.html")) return false;
    const segs = p.split("/").filter(Boolean);
    return segs.length >= 3;
  }

  function isModeOn() {
    try {
      return sessionStorage.getItem(MODE_FLAG) === "1";
    } catch (_) {
      return false;
    }
  }

  // 关键：没有“本次导航票据”，就把 mode 关掉，保证默认关闭
  function consumeReviewNavFlagOrDisableMode() {
    try {
      const v = sessionStorage.getItem(REVIEW_NAV_FLAG);
      if (v === "1") {
        sessionStorage.removeItem(REVIEW_NAV_FLAG);
        return true;
      }
      sessionStorage.removeItem(MODE_FLAG);
      return false;
    } catch (_) {
      return false;
    }
  }

  // ✅ 临时展开一次：仅对当前页生效，下一页继续折叠
try {
  if (sessionStorage.getItem(UNFOLD_ONCE_KEY) === "1") {
    sessionStorage.removeItem(UNFOLD_ONCE_KEY);
    return; // 不折叠
  }
} catch (_) {}


  function addExitChip(container) {
    const chip = document.createElement("div");
    chip.className = "md-typeset";
    chip.style.margin = "12px 0 16px 0";
    chip.style.padding = "14px 16px";
chip.style.border = "1px solid var(--md-default-fg-color--lightest)";
chip.style.borderRadius = "16px";

/* 新增：渐变背景 + 轻微阴影 */
chip.style.background =
  "linear-gradient(135deg, rgba(63, 150, 181, 0.12), rgba(63, 134, 181, 0.05))";
chip.style.boxShadow = "0 10px 26px rgba(0,0,0,.10)";
chip.id = "rf-exit-chip";
    chip.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
        <div style="opacity:.85">
          <strong>Self-test mode</strong>
          <span style="opacity:.75">Sections are folded by default.</span>
        </div>
        <button id="rf-exit" class="md-button">Expand all sections</button>
      </div>
    `;
    const h1 = container.querySelector("h1");
    if (h1) h1.insertAdjacentElement("afterend", chip);
    else container.insertAdjacentElement("afterbegin", chip);

    function updateToggleLabel() {
  const btn = chip.querySelector("#rf-exit");
  if (!btn) return;

  const details = document.querySelectorAll("details.rf-details");

  // 关键：如果 fold 的 details 还没生成出来，首次默认提示“Expand”
  if (!details.length) {
    btn.textContent = "Expand all sections";
    return;
  }

  const anyClosed = Array.from(details).some(d => !d.open);
  btn.textContent = anyClosed ? "Expand all sections" : "Fold all sections";
}

chip.querySelector("#rf-exit").addEventListener("click", () => {
  const details = document.querySelectorAll("details.rf-details");
  if (!details.length) return;

  const anyClosed = Array.from(details).some(d => !d.open);
  for (const d of details) d.open = anyClosed;

  updateToggleLabel();
});

// 初始设置一次
updateToggleLabel();

// 再补两次延迟刷新，确保 fold 完成后按钮文案是对的
setTimeout(updateToggleLabel, 0);
setTimeout(updateToggleLabel, 80);

  }

  function foldSections() {
    const inner = document.querySelector("article.md-content__inner");
    if (!inner) return;

    if (inner.getAttribute("data-rf-done") === "1") return;
    inner.setAttribute("data-rf-done", "1");

    const h2s = Array.from(inner.children).filter((el) => el.tagName === "H2");
    if (!h2s.length) return;

    addExitChip(inner);

    for (const h2 of h2s) {
      if (!h2.parentElement || h2.parentElement.tagName === "SUMMARY") continue;

      const details = document.createElement("details");
      details.className = "rf-details";

      const summary = document.createElement("summary");
      summary.className = "rf-summary";
      summary.style.cursor = "pointer";
      summary.style.fontWeight = "600";
      summary.textContent = h2.textContent || "Section";

      details.appendChild(summary);

      let node = h2.nextSibling;
      const toMove = [];
      while (node) {
        const next = node.nextSibling;
        if (node.nodeType === 1 && node.tagName === "H2") break;
        toMove.push(node);
        node = next;
      }

      inner.insertBefore(details, h2);
      h2.remove();

      for (const n of toMove) details.appendChild(n);
    }
  }

  function init() {
    if (!isConceptPage()) return;
    if (!isModeOn()) return;

    // 没票据：说明不是从 random 导航来的，立刻关掉 mode，什么也不做
    if (!consumeReviewNavFlagOrDisableMode()) return;

    foldSections();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("DOMContentSwitch", init);
})();
