(function () {
  const MENU_LI_ID = "random-dropdown";
  const PANEL_ID = "random-dropdown-panel";
  const BTN_ID = "random-dropdown-btn";

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

  // --- tab link detection (ONLY within tabs list) ---
  function getTabLinks(tabsList) {
    return tabsList ? $all("a.md-tabs__link[href]", tabsList) : [];
  }
  function hrefLower(a) {
    return String(a?.getAttribute("href") || "").toLowerCase();
  }
  function isRandomLink(a) {
    const h = hrefLower(a);
    return h.includes("random") && !h.includes("custom") && !h.includes("course");
  }
  function isCustomRandomLink(a) {
    const h = hrefLower(a);
    return h.includes("custom") && h.includes("random");
  }
  function isCourseRandomLink(a) {
    const h = hrefLower(a);
    return h.includes("random") && h.includes("course");
  }
  function isTrendingLink(a) {
    const h = hrefLower(a);
    return h.includes("trending");
  }

  function cleanupOld() {
    const oldLi = document.getElementById(MENU_LI_ID);
    if (oldLi) oldLi.remove();

    const oldPanel = document.getElementById(PANEL_ID);
    if (oldPanel) oldPanel.remove();
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

    // IMPORTANT: default hidden, otherwise fixed-position panel appears at (0,0)
    panel.classList.remove("open");
    panel.style.display = "none";

    return panel;
  }

  function setOpenState(dropdownLi, isOpen) {
    const wrap = dropdownLi.querySelector(".md-tabs__link.md-tab-dropdown");
    const icon = dropdownLi.querySelector("#" + BTN_ID + " .rd-icon");

    if (wrap) {
      wrap.classList.toggle("is-open", !!isOpen);
      wrap.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (icon) icon.classList.toggle("is-open", !!isOpen);
  }

  function closePanel(dropdownLi, panel) {
    if (panel) {
      panel.classList.remove("open");
      panel.style.display = "none";
    }
    setOpenState(dropdownLi, false);
  }

  function openPanelUnder(dropdownLi, panel, btn) {
    if (!panel) return;

    // show first so offsetWidth/Height are valid
    panel.style.display = "block";
    panel.classList.add("open");
    setOpenState(dropdownLi, true);

    const r = btn.getBoundingClientRect();
    const pw = panel.offsetWidth || 240;
    const ph = panel.offsetHeight || 120;

    // align panel’s right edge with button’s right edge (Material-like)
    let left = Math.max(8, r.right - pw);
    let top = r.bottom + 8;

    // flip upward if needed
    if (top + ph > window.innerHeight - 8) {
      top = Math.max(8, r.top - 8 - ph);
    }

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }

  function setRightGroupStart(tabsList, itemToStart) {
    if (!tabsList) return;
    $all(".md-tabs__item.random-right-start", tabsList).forEach(li => li.classList.remove("random-right-start"));
    if (itemToStart) itemToStart.classList.add("random-right-start");
  }

  function mount() {
    const tabsList = document.querySelector(".md-tabs__list");
    if (!tabsList) return;

    // Always upgrade: remove previous dropdown DOM
    cleanupOld();

    const links = getTabLinks(tabsList);
    const randomA = links.find(isRandomLink);
    const customA = links.find(isCustomRandomLink);
    const courseA = links.find(isCourseRandomLink) || null;
    const trendingA = links.find(isTrendingLink) || null;

    // If not present, do nothing (avoid breaking pages without these tabs)
    if (!randomA || !customA) return;

    const randomLi = randomA.closest("li.md-tabs__item");
    const customLi = customA.closest("li.md-tabs__item");
    const courseLi = courseA ? courseA.closest("li.md-tabs__item") : null;
    const trendingLi = trendingA ? trendingA.closest("li.md-tabs__item") : null;

    // Build dropdown <li>
    const dropdownLi = el("li", "md-tabs__item");
    dropdownLi.id = MENU_LI_ID;

    const wrap = el("span", "md-tabs__link md-tab-dropdown");
    wrap.setAttribute("aria-expanded", "false");

    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.className = "md-tabs__link-btn";
    btn.setAttribute("aria-haspopup", "menu");
    btn.setAttribute("aria-controls", PANEL_ID);

    btn.appendChild(document.createTextNode("Random"));

    // md-icon chevron + rotate via CSS (.is-open)
    const icon = el("span", "md-nav__icon md-icon rd-icon");
icon.setAttribute("aria-hidden", "true");
icon.setAttribute("data-md-icon", "chevron-right");
btn.appendChild(icon);

    wrap.appendChild(btn);
    dropdownLi.appendChild(wrap);

    // Build panel
    const items = [
      { label: "Random", href: randomA.href },
      { label: "Custom random", href: customA.href },
    ];
    if (courseA) items.push({ label: "Random in course", href: courseA.href });

    const panel = buildPanel(items);

    // Replace the original Random tab with dropdown
    if (randomLi) {
      randomLi.insertAdjacentElement("beforebegin", dropdownLi);
      randomLi.remove();
    } else {
      tabsList.appendChild(dropdownLi);
    }

    // Remove redundant tabs
    if (customLi) customLi.remove();
    if (courseLi) courseLi.remove();

    // ---- Right grouping: Trending + Random dropdown to the right ----
    // We want: ... Home Year1 Year2 | Trending Random (right side)
    // So the "start" item should be Trending (if exists), else dropdown itself.
    if (trendingLi) {
      // Ensure Trending is immediately before dropdown (same right group)
      if (trendingLi.nextSibling !== dropdownLi) {
        tabsList.insertBefore(trendingLi, dropdownLi);
      }
      setRightGroupStart(tabsList, trendingLi);
    } else {
      setRightGroupStart(tabsList, dropdownLi);
    }

    // ---- Toggle handlers ----
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = panel.classList.contains("open");
      if (isOpen) closePanel(dropdownLi, panel);
      else openPanelUnder(dropdownLi, panel, btn);
    });

    // Outside click closes
    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("open")) return;
      if (dropdownLi.contains(e.target) || panel.contains(e.target)) return;
      closePanel(dropdownLi, panel);
    });

    // ESC closes
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePanel(dropdownLi, panel);
    });

    // Navigation closes
    document.addEventListener("DOMContentSwitch", () => closePanel(dropdownLi, panel));
  }

  const fire = () => setTimeout(mount, 0);
  document.addEventListener("DOMContentLoaded", fire);
  document.addEventListener("DOMContentSwitch", fire);
  document.addEventListener("navigation:load", fire);
})();
