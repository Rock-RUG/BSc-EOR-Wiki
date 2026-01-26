(function () {
  const MENU_ID = "random-dropdown";
  const BTN_ID = "random-dropdown-btn";

  // 你站点的 tab 文本（和你当前 UI 一致）
  const LABEL_RANDOM = "Random";
  const LABEL_RANDOM_IN_COURSE = "Random in course";
  const LABEL_CUSTOM_RANDOM = "Custom random";

  function $(sel, root = document) {
    return root.querySelector(sel);
  }
  function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function findTabAnchorByText(text) {
    // Material 顶栏 tabs 链接通常是 .md-tabs__link
    const links = $all(".md-tabs__link");
    return links.find(a => (a.textContent || "").trim() === text) || null;
  }

  function isCoursePage() {
    // 你的“课程页”通常会有左侧导航 + 当前 course 下拉
    // 更稳一点：存在 “Random in course” tab 时，就视为课程页
    return !!findTabAnchorByText(LABEL_RANDOM_IN_COURSE);
  }

  function ensureStyles() {
    if ($("#random-dropdown-style")) return;
    const style = el("style");
    style.id = "random-dropdown-style";
    style.textContent = `
/* container */
#${MENU_ID}{ position: relative; display: inline-flex; align-items: center; }

/* button look like tab */
#${BTN_ID}{
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  cursor: pointer;
  user-select: none;
}
#${BTN_ID} .caret{ font-size: .9em; opacity: .8; }

/* dropdown panel */
#${MENU_ID} .dropdown{
  position: absolute;
  top: calc(100% + .35rem);
  right: 0;
  min-width: 12rem;
  background: var(--md-default-bg-color);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: .5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,.35);
  padding: .35rem;
  z-index: 50;
  display: none;
}
#${MENU_ID}.open .dropdown{ display: block; }

#${MENU_ID} .item{
  display: block;
  padding: .45rem .6rem;
  border-radius: .4rem;
  color: var(--md-default-fg-color);
  text-decoration: none;
  font-size: .92rem;
  line-height: 1.2;
}
#${MENU_ID} .item:hover{
  background: rgba(255,255,255,.06);
}
#${MENU_ID} .item.is-active{
  background: rgba(255,255,255,.10);
  font-weight: 600;
}
`;
    document.head.appendChild(style);
  }

  function buildDropdown(randomA, customA, courseA) {
    // 用原来的链接 href
    const wrap = el("li", "md-tabs__item");
    wrap.id = MENU_ID;

    const btn = el("a", "md-tabs__link");
    btn.id = BTN_ID;
    btn.href = randomA.href; // 点击“Random ▾”默认去 Random
    btn.appendChild(document.createTextNode("Random"));
    btn.appendChild(el("span", "caret", "▾"));

    const panel = el("div", "dropdown");

    function addItem(a, label) {
      if (!a) return;
      const it = el("a", "item", label);
      it.href = a.href;

      // 当前页高亮（简单按 pathname 包含判断）
      try {
        const cur = location.pathname.replace(/\/+$/, "");
        const tgt = new URL(it.href, document.baseURI).pathname.replace(/\/+$/, "");
        if (cur === tgt) it.classList.add("is-active");
      } catch (_) {}

      panel.appendChild(it);
    }

    addItem(randomA, LABEL_RANDOM);
    addItem(customA, LABEL_CUSTOM_RANDOM);
    if (courseA) addItem(courseA, LABEL_RANDOM_IN_COURSE);

    wrap.appendChild(btn);
    wrap.appendChild(panel);

    // toggle open
    btn.addEventListener("click", (e) => {
      // 点击 caret 时打开菜单，但仍允许正常跳转（你想要的体验更像：点击就展开）
      e.preventDefault();
      wrap.classList.toggle("open");
    });

    // click outside close
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) wrap.classList.remove("open");
    });

    // Esc close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") wrap.classList.remove("open");
    });

    return wrap;
  }

  function mount() {
    ensureStyles();

    const tabsUl = $(".md-tabs__list");
    if (!tabsUl) return;

    const randomA = findTabAnchorByText(LABEL_RANDOM);
    const customA = findTabAnchorByText(LABEL_CUSTOM_RANDOM);
    const courseA = findTabAnchorByText(LABEL_RANDOM_IN_COURSE);

    // 必须至少有 Random + Custom random 才做下拉
    if (!randomA || !customA) return;

    // 已经挂过就不重复
    if ($("#" + MENU_ID)) return;

    // 找到原始的三个 li，然后移除它们
    const randomLi = randomA.closest("li");
    const customLi = customA.closest("li");
    const courseLi = courseA ? courseA.closest("li") : null;

    // 插入位置：用 random 原来的位置
    const dropdownLi = buildDropdown(randomA, customA, isCoursePage() ? courseA : null);

    // 替换 random 的 li
    if (randomLi) {
      randomLi.insertAdjacentElement("beforebegin", dropdownLi);
      randomLi.remove();
    } else {
      tabsUl.appendChild(dropdownLi);
    }

    if (customLi) customLi.remove();
    if (courseLi) courseLi.remove();
  }

  // Material instant navigation
  const fire = () => setTimeout(mount, 0);
  document.addEventListener("DOMContentLoaded", fire);
  document.addEventListener("DOMContentSwitch", fire);
  document.addEventListener("navigation:load", fire);
})();
