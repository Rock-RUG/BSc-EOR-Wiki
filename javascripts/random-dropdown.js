(function () {
  const MENU_LI_ID = "random-dropdown";
  const PANEL_ID = "random-dropdown-panel";
  const BTN_ID = "random-dropdown-btn";

  const LABEL_RANDOM = "Random";
  const LABEL_CUSTOM_RANDOM = "Custom random";
  const LABEL_RANDOM_IN_COURSE = "Random in course";

  function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }
  function $(sel, root = document) {
    return root.querySelector(sel);
  }
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function findTabAnchorByText(text) {
    const links = $all(".md-tabs__link");
    return links.find(a => (a.textContent || "").trim() === text) || null;
  }

  function ensureStyle() {
    if ($("#random-dropdown-style")) return;
    const style = el("style");
    style.id = "random-dropdown-style";
    style.textContent = `
/* make the trigger look exactly like a tab link */
#${BTN_ID}{
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  height: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
#${BTN_ID} .caret{ font-size: .9em; opacity: .8; transform: translateY(1px); }

/* panel (attached to body, so won't be clipped) */
#${PANEL_ID}{
  position: fixed;
  min-width: 13rem;
  background: var(--md-default-bg-color);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: .55rem;
  box-shadow: 0 12px 36px rgba(0,0,0,.35);
  padding: .35rem;
  z-index: 9999;
  display: none;
}
#${PANEL_ID}.open{ display: block; }

#${PANEL_ID} a.item{
  display: block;
  padding: .5rem .6rem;
  border-radius: .45rem;
  color: var(--md-default-fg-color);
  text-decoration: none;
  font-size: .92rem;
  line-height: 1.2;
}
#${PANEL_ID} a.item:hover{ background: rgba(255,255,255,.06); }
#${PANEL_ID} a.item.is-active{ background: rgba(255,255,255,.10); font-weight: 600; }
`;
    document.head.appendChild(style);
  }

  function closePanel() {
    const panel = $("#" + PANEL_ID);
    if (panel) panel.classList.remove("open");
  }

  function openPanelUnder(btn) {
    const panel = $("#" + PANEL_ID);
    if (!panel) return;

    // 先显示再测量
    panel.classList.add("open");

    const r = btn.getBoundingClientRect();
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;

    // 默认右对齐到按钮右边
    let left = Math.max(8, r.right - pw);
    let top = r.bottom + 8;

    // 如果底部不够空间，向上弹
    if (top + ph > window.innerHeight - 8) {
      top = Math.max(8, r.top - 8 - ph);
    }

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }

  function buildPanel(items) {
    let panel = $("#" + PANEL_ID);
    if (!panel) {
      panel = el("div");
      panel.id = PANEL_ID;
      document.body.appendChild(panel);
    }
    panel.innerHTML = "";

    // Force compact typography (inline styles win over CSS)
    panel.style.fontSize = "0.875rem";
    panel.style.lineHeight = "1.35";
    panel.style.padding = "0.25rem";

    items.forEach(({ href, label }) => {
      const a = el("a", "item", label);
      a.href = href;
      
      a.style.fontSize = "0.875rem";
      a.style.lineHeight = "1.35";
      a.style.fontWeight = "400";
      a.style.padding = "0.4rem 0.75rem";
      a.style.display = "block";
      a.style.whiteSpace = "nowrap";


      // active highlight
      try {
        const cur = location.pathname.replace(/\/+$/, "");
        const tgt = new URL(href, document.baseURI).pathname.replace(/\/+$/, "");
        if (cur === tgt) a.classList.add("is-active");
      } catch (_) {}

      panel.appendChild(a);
    });

    // clicking an item should close
    panel.addEventListener("click", () => closePanel(), { once: true });
  }

  function mount() {
    ensureStyle();

    const tabsUl = $(".md-tabs__list");
    if (!tabsUl) return;

    // 获取现有三个 tab
    const randomA = findTabAnchorByText(LABEL_RANDOM);
    const customA = findTabAnchorByText(LABEL_CUSTOM_RANDOM);
    const courseA = findTabAnchorByText(LABEL_RANDOM_IN_COURSE);

    // 至少要有 Random + Custom random 才创建 dropdown
    if (!randomA || !customA) return;

    // 已经挂过就不重复
    if ($("#" + MENU_LI_ID)) return;

    const randomLi = randomA.closest("li.md-tabs__item");
    const customLi = customA.closest("li.md-tabs__item");
    const courseLi = courseA ? courseA.closest("li.md-tabs__item") : null;

    // dropdown li（保留 Material 的 md-tabs__item 结构）
    const li = el("li", "md-tabs__item");
    li.id = MENU_LI_ID;

    // 关键：恢复“靠右组”的起点（你原 random-tabs.js 用这个 class 推到右边）
    li.classList.add("random-right-start");

    // 用 button 作为触发器，确保高度一致
    const btnWrap = el("span", "md-tabs__link");
    const btn = el("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.appendChild(document.createTextNode("Random"));
    btn.appendChild(el("span", "caret", "▾"));
    btnWrap.appendChild(btn);
    li.appendChild(btnWrap);

    // 组装下拉项（课程页才有 Random in course）
    const items = [
      { href: randomA.href, label: LABEL_RANDOM },
      { href: customA.href, label: LABEL_CUSTOM_RANDOM },
    ];
    if (courseA) items.push({ href: courseA.href, label: LABEL_RANDOM_IN_COURSE });

    buildPanel(items);

    // 插入到 random 原来的位置
    if (randomLi) {
      randomLi.insertAdjacentElement("beforebegin", li);
      randomLi.remove();
    } else {
      tabsUl.appendChild(li);
    }

    // 删除原 tab
    if (customLi) customLi.remove();
    if (courseLi) courseLi.remove();

    // 打开/关闭逻辑
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const panel = $("#" + PANEL_ID);
      if (!panel) return;

      const isOpen = panel.classList.contains("open");
      if (isOpen) {
        closePanel();
      } else {
        openPanelUnder(btn);
      }
    });

    // 点外部关闭
    document.addEventListener("click", (e) => {
      const panel = $("#" + PANEL_ID);
      if (!panel) return;

      if (li.contains(e.target) || panel.contains(e.target)) return;
      closePanel();
    });

    // Esc 关闭
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePanel();
    });
  }

  const fire = () => setTimeout(mount, 0);

  document.addEventListener("DOMContentLoaded", fire);
  document.addEventListener("DOMContentSwitch", fire);
  document.addEventListener("navigation:load", fire);
})();
