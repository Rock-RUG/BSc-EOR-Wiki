(function () {
  const MENU_LI_ID = "random-dropdown";
  const PANEL_ID = "random-dropdown-panel";
  const BTN_ID = "random-dropdown-btn";
function findTrendingItem(list) {
  if (!list) return null;
  const a = list.querySelector('a.md-tabs__link[href*="trending"]');
  return a ? a.closest(".md-tabs__item") : null;
}
  // Identify links by href (more robust than text)
  function getTabLinks() {
    return Array.from(document.querySelectorAll(".md-tabs__list a.md-tabs__link[href]"));
  }

  function isRandomLink(a) {
    const h = (a.getAttribute("href") || "").toLowerCase();
    return h.includes("random") && !h.includes("custom") && !h.includes("course");
  }
  function isCustomRandomLink(a) {
    const h = (a.getAttribute("href") || "").toLowerCase();
    return h.includes("custom") && h.includes("random");
  }
  function isCourseRandomLink(a) {
    const h = (a.getAttribute("href") || "").toLowerCase();
    return h.includes("random") && h.includes("course");
  }

  function cleanupOld() {
    const oldLi = document.getElementById(MENU_LI_ID);
    if (oldLi) oldLi.remove();

    const oldPanel = document.getElementById(PANEL_ID);
    if (oldPanel) oldPanel.remove();
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function buildPanel(items) {
    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = PANEL_ID;
      panel.className = "md-random-dropdown-panel";
      document.body.appendChild(panel);
    }
    panel.innerHTML = "";

    const curPath = location.pathname.replace(/\/+$/, "");

    items.forEach((it, idx) => {
      if (it.kind === "sep") {
        const sep = el("div", "md-random-dropdown-sep");
        panel.appendChild(sep);
        return;
      }

      const a = el("a", "md-random-dropdown-item", it.label);
      a.href = it.href;

      try {
        const tgt = new URL(it.href, document.baseURI).pathname.replace(/\/+$/, "");
        if (tgt === curPath) a.classList.add("is-active");
      } catch (_) {}

      panel.appendChild(a);

      if (idx !== items.length - 1) {
        panel.appendChild(el("div", "md-random-dropdown-sep"));
      }
    });

    return panel;
  }

  function setOpenState(li, isOpen) {
    const wrap = li.querySelector(".md-tabs__link.md-tab-dropdown");
    const icon = li.querySelector("#" + BTN_ID + " .rd-icon");

    if (wrap) {
      wrap.classList.toggle("is-open", !!isOpen);
      wrap.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (icon) icon.classList.toggle("is-open", !!isOpen);
  }

  function close(li) {
    const panel = document.getElementById(PANEL_ID);
    if (panel) panel.classList.remove("open");
    setOpenState(li, false);
  }

  function openUnder(li, btn) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;

    panel.classList.add("open");
    setOpenState(li, true);

    const r = btn.getBoundingClientRect();
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;

    let left = Math.max(8, r.right - pw);
    let top = r.bottom + 8;

    if (top + ph > window.innerHeight - 8) {
      top = Math.max(8, r.top - 8 - ph);
    }

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }

  function mount() {
    const tabsList = document.querySelector(".md-tabs__list");
    if (!tabsList) return;

    // Always upgrade: remove previous dropdown DOM (from any older version)
    cleanupOld();

    const links = getTabLinks();
    const randomA = links.find(isRandomLink);
    const customA = links.find(isCustomRandomLink);
    const courseA = links.find(isCourseRandomLink) || null;

    // If we can't find global random + custom random, do nothing.
    // (This prevents breaking tabs on pages without those links.)
    if (!randomA || !customA) return;

    const randomLi = randomA.closest("li.md-tabs__item");
    const customLi = customA.closest("li.md-tabs__item");
    const courseLi = courseA ? courseA.closest("li.md-tabs__item") : null;

    // Build dropdown <li>
    const li = el("li", "md-tabs__item");
    li.id = MENU_LI_ID;
    li.classList.add("random-right-start");

    const wrap = el("span", "md-tabs__link md-tab-dropdown");
    wrap.setAttribute("aria-expanded", "false");

    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.className = "md-tabs__link-btn";
    btn.setAttribute("aria-haspopup", "menu");
    btn.setAttribute("aria-controls", PANEL_ID);

    btn.appendChild(document.createTextNode("Random"));

    const icon = el("span", "md-nav__icon md-icon rd-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("data-md-icon", "chevron-right");
    btn.appendChild(icon);

    wrap.appendChild(btn);
    li.appendChild(wrap);

    // Build panel items
    const items = [
      { kind: "link", label: "Random", href: randomA.href },
      { kind: "link", label: "Custom random", href: customA.href },
    ];
    if (courseA) items.push({ kind: "link", label: "Random in course", href: courseA.href });

    const panel = buildPanel(items);

    // Replace the original Random tab with dropdown
    if (randomLi) {
      randomLi.insertAdjacentElement("beforebegin", li);
      randomLi.remove();
    } else {
      tabsList.appendChild(li);
    }

    // Remove the now-redundant tabs
    if (customLi) customLi.remove();
    if (courseLi) courseLi.remove();

    // ===== Keep Trending + Random dropdown as the right-most group =====
const list = findTabsList();
if (list) {
  const trendingItem = findTrendingItem(list);
  const dropdownItem = document.getElementById(RANDOM_DROPDOWN_ITEM_ID) || document.getElementById("random-dropdown");
  const courseItem = document.getElementById(COURSE_ITEM_ID);

  // 让 Trending 排在右侧组的最左边（也就是 dropdown 的前面）
  if (trendingItem && (courseItem || dropdownItem)) {
    const anchor = courseItem || dropdownItem;
    if (anchor && trendingItem.nextSibling !== anchor) {
      list.insertBefore(trendingItem, anchor);
    }
  }

  // 右侧组起点：优先 Trending，其次 courseItem，再其次 dropdown/global random
  setRightGroupStart(trendingItem || courseItem || dropdownItem);
}

    // Toggle
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = panel.classList.contains("open");
      if (isOpen) close(li);
      else openUnder(li, btn);
    });

    // Outside click close
    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("open")) return;
      if (li.contains(e.target) || panel.contains(e.target)) return;
      close(li);
    });

    // ESC close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close(li);
    });

    // Instant navigation close
    document.addEventListener("DOMContentSwitch", () => close(li));
  }

  const fire = () => setTimeout(mount, 0);
  document.addEventListener("DOMContentLoaded", fire);
  document.addEventListener("DOMContentSwitch", fire);
  document.addEventListener("navigation:load", fire);
})();
