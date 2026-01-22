(function () {
  const BAR_ID = "current-course-bar";

  function findCourseNode(activeLink) {
    // 从当前 topic 往上找最近的 nested 节点，它就是课程那一层
    let node = activeLink.closest(".md-nav__item");
    while (node) {
      if (node.classList.contains("md-nav__item--nested")) return node;
      node = node.parentElement ? node.parentElement.closest(".md-nav__item") : null;
    }
    return null;
  }

  function ensureBar() {
    const sidebar = document.querySelector(".md-sidebar--primary");
    if (!sidebar) return null;

    const scrollWrap =
      sidebar.querySelector(".md-sidebar__scrollwrap") ||
      sidebar.querySelector(".md-sidebar__inner") ||
      sidebar;

    let bar = scrollWrap.querySelector(`#${BAR_ID}`);
    if (!bar) {
      bar = document.createElement("div");
      bar.id = BAR_ID;
      bar.innerHTML = `
        <button type="button" class="ccb-btn" aria-label="Toggle current course">
          <span class="ccb-title"></span>
          <span class="ccb-icon" aria-hidden="true">▾</span>
        </button>
      `;
      // 放在滚动容器最上面
      scrollWrap.prepend(bar);
    }
    return bar;
  }

  function apply() {
    const bar = ensureBar();
    if (!bar) return;

    const activeLink = document.querySelector(
      ".md-sidebar--primary .md-nav__link--active"
    );

    // 没有 active page 时隐藏
    if (!activeLink) {
      bar.style.display = "none";
      return;
    }

    const courseNode = findCourseNode(activeLink);
    if (!courseNode) {
      bar.style.display = "none";
      return;
    }

    // 课程标题文本
    const courseTitleEl =
      courseNode.querySelector(":scope > .md-nav__link") ||
      courseNode.querySelector(":scope > label.md-nav__link") ||
      courseNode.querySelector(".md-nav__link");

    const titleText = courseTitleEl ? courseTitleEl.textContent.trim() : "";
    if (!titleText) {
      bar.style.display = "none";
      return;
    }

    // 找折叠用的 toggle
    const toggle =
      courseNode.querySelector(":scope > input.md-nav__toggle") ||
      courseNode.querySelector("input.md-nav__toggle");

    const titleSpan = bar.querySelector(".ccb-title");
    const iconSpan = bar.querySelector(".ccb-icon");
    const btn = bar.querySelector(".ccb-btn");

    titleSpan.textContent = titleText;
    bar.style.display = "";

    // 同步箭头方向
    const isOpen = toggle ? toggle.checked : true;
    iconSpan.textContent = isOpen ? "▾" : "▸";

    btn.onclick = () => {
      if (!toggle) return;

      toggle.checked = !toggle.checked;
      toggle.dispatchEvent(new Event("change", { bubbles: true }));

      // 更新箭头
      iconSpan.textContent = toggle.checked ? "▾" : "▸";
    };
  }

  // 首次加载
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  // Material instant navigation 时页面切换
  document.addEventListener("DOMContentSwitch", apply);
})();
