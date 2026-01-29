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

  function getWrapAndIcon(li) {
    const wrap = li.querySelector(".md-tabs__link.md-tab-dropdown");
    const icon = li.querySelector("#" + BTN_ID + " .rd-icon");
    return { wrap, icon };
  }

  function setOpenState(li, isOpen) {
    const { wrap, icon } = getWrapAndIcon(li);
    if (wrap) {
      wrap.classList.toggle("is-open", !!isOpen);
      wrap.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (icon) icon.classList.toggle("is-open", !!isOpen);
  }

  function closePanel(li) {
    const panel = $("#" + PANEL_ID);
    if (panel) panel.classList.remove("open");
    setOpenState(li, false);
  }

  function openPanelUnder(li, btn) {
    const panel = $("#" + PANEL_ID);
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

  function buildPanel(items) {
    let panel = $("#" + PANEL_ID);
    if (!panel) {
      panel = el("div");
      panel.id = PANEL_ID;
      panel.classList.add("md-random-dropdown-panel");
      document.body.appendChild(panel);
    }

    panel.innerHTML = "";

    items.forEach(({ href, label }, idx) => {
      const a = el("a", "md-random-dropdown-item", label);
      a.href = href;

      // active highlight
      try {
        const cur = location.pathname.replace(/\/+$/, "");
        const tgt = new URL(href, document.baseURI).pathname.replace(/\/+$/, "");
        if (cur === tgt) a.classList.add("is-active");
      } catch (_) {}

      panel.appendChild(a);

      // separator between items (match your extra.css separator style)
      if (idx !== items.length - 1) {
        const sep = el("div", "md-random-dropdown-sep");
        panel.appendChild(sep);
      }
    });
  }

  function mount() {
    const tabsUl = $(".md-tabs__list");
    if (!tabsUl) return;

    const randomA = findTabAnchorByText(LABEL_RANDOM);
    const customA = findTabAnchorByText(LABEL_CUSTOM_RANDOM);
    const courseA = findTabAnchorByText(LABEL_RANDOM_IN_COURSE);

    if (!randomA || !customA) return;
    if ($("#" + MENU_LI_ID)) return;

    const randomLi = randomA.closest("li.md-tabs__item");
    const customLi = customA.closest("li.md-tabs__item");
    const courseLi = courseA ? courseA.closest("li.md-tabs__item") : null;

    const li = el("li", "md-tabs__item");
    li.id = MENU_LI_ID;
    li.classList.add("random-right-start");

    // Wrap should behave like a tab link + allow aria-expanded styling in your extra.css
    const btnWrap = el("span", "md-tabs__link md-tab-dropdown");
    btnWrap.setAttribute("aria-expanded", "false");

    const btn = el("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "menu");
    btn.setAttribute("aria-controls", PANEL_ID);

    btn.appendChild(document.createTextNode("Random"));

    // Material-native icon (same mechanism as your sidebar arrow)
    const icon = el("span", "md-nav__icon md-icon rd-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("data-md-icon", "chevron-right");
    btn.appendChild(icon);

    btnWrap.appendChild(btn);
    li.appendChild(btnWrap);

    const items = [
      { href: randomA.href, label: LABEL_RANDOM },
      { href: customA.href, label: LABEL_CUSTOM_RANDOM },
    ];
    if (courseA) items.push({ href: courseA.href, label: LABEL_RANDOM_IN_COURSE });

    buildPanel(items);

    if (randomLi) {
      randomLi.insertAdjacentElement("beforebegin", li);
      randomLi.remove();
    } else {
      tabsUl.appendChild(li);
    }

    if (customLi) customLi.remove();
    if (courseLi) courseLi.remove();

    // Toggle open/close
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const panel = $("#" + PANEL_ID);
      if (!panel) return;

      const isOpen = panel.classList.contains("open");
      if (isOpen) closePanel(li);
      else openPanelUnder(li, btn);
    });

    // Outside click close
    document.addEventListener("click", (e) => {
      const panel = $("#" + PANEL_ID);
      if (!panel) return;
      if (li.contains(e.target) || panel.contains(e.target)) return;
      closePanel(li);
    });

    // Esc close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePanel(li);
    });

    // If navigation happens while panel open, ensure state resets on next load
    document.addEventListener("DOMContentSwitch", () => closePanel(li));
  }

  const fire = () => setTimeout(mount, 0);

  document.addEventListener("DOMContentLoaded", fire);
  document.addEventListener("DOMContentSwitch", fire);
  document.addEventListener("navigation:load", fire);
})();
