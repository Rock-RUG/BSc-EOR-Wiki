(function () {
  const PANEL_ID = "random-dropdown-panel";
  const TOGGLE_ID = "random-dropdown-toggle";

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function removePanel() {
    const p = document.getElementById(PANEL_ID);
    if (p) p.remove();
  }

  function buildPanel(items, anchor) {
    removePanel();

    const panel = el("div");
    panel.id = PANEL_ID;

    /* ===== CRITICAL PART =====
       All sizing lives here.
       No CSS, no theme interference.
    */
    Object.assign(panel.style, {
      position: "fixed",
      zIndex: 1000,
      minWidth: "160px",
      background: "rgb(30, 33, 41)",
      borderRadius: "12px",
      padding: "6px",
      boxShadow: "0 8px 30px rgba(0,0,0,.35)",
      fontSize: "14px",        // ← visually matches md-tabs
      lineHeight: "1.4",
    });

    const rect = anchor.getBoundingClientRect();
    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.bottom + 8}px`;

    items.forEach(({ label, href }) => {
      const a = el("a", "item", label);
      a.href = href;

      Object.assign(a.style, {
        display: "block",
        padding: "6px 10px",
        borderRadius: "8px",
        textDecoration: "none",
        color: "inherit",
        fontSize: "14px",
        lineHeight: "1.4",
        fontWeight: "400",
        whiteSpace: "nowrap",
        cursor: "pointer",
      });

      a.addEventListener("mouseenter", () => {
        a.style.background = "rgba(255,255,255,0.06)";
      });
      a.addEventListener("mouseleave", () => {
        a.style.background = "transparent";
      });

      panel.appendChild(a);
    });

    document.body.appendChild(panel);

    // close on outside click
    setTimeout(() => {
      document.addEventListener(
        "click",
        (e) => {
          if (!panel.contains(e.target) && e.target !== anchor) {
            removePanel();
          }
        },
        { once: true }
      );
    });
  }

  function init() {
    const toggle = document.getElementById(TOGGLE_ID);
    if (!toggle) return;

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const existing = document.getElementById(PANEL_ID);
      if (existing) {
        existing.remove();
        return;
      }

      const items = [
        { label: "Random", href: "/BSc-EOR-Wiki/random.html" },
        { label: "Custom random", href: "/BSc-EOR-Wiki/custom-random.html" },
      ];

      buildPanel(items, toggle);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
