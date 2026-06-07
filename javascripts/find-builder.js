// docs/javascripts/find-builder.js
(function () {
  window.__findBuilderVersion = "v5.6.31-clear-tokens-trash-svg-fix";


  // v8: disable the old Find-page fog/blur transition completely.
  // This page is now shown through the global first-paint gate, so the long blur FX is only visual noise.
  try { window.__mkFindFxDisabled = true; } catch (_) {}


  // v5.6.26: light-mode polish for the random/self-test Start random CTA.
  // Keep the dice glyph, but remove the small pale square tile behind it.
  // This script is loaded globally, so the patch is installed here instead of relying on page-local CSS timing.
  function fbInstallRandomDiceLightBgFixV1() {
    if (document.getElementById("mk-random-dice-light-bg-fix-v1")) return;
    const st = document.createElement("style");
    st.id = "mk-random-dice-light-bg-fix-v1";
    st.textContent = `
      /* Start random: remove only the light-mode icon tile behind the dice. */
      html[data-md-color-scheme="default"] .md-typeset .md-button#rf-start::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button#rf-start::before,
      html[data-md-color-scheme="default"] .md-typeset .md-button#cr-start::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button#cr-start::before,
      html[data-md-color-scheme="default"] .md-typeset .md-button#random-start::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button#random-start::before,
      html[data-md-color-scheme="default"] .md-typeset .md-button.start-random::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button.start-random::before,
      html[data-md-color-scheme="default"] .md-typeset .md-button[data-random-start]::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button[data-random-start]::before,
      html[data-md-color-scheme="default"] .md-typeset .md-button[aria-label*="Start random" i]::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button[aria-label*="Start random" i]::before{
        background: transparent !important;
        border-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
      }

      /* Same fix for the fb-cta icon-span implementation, if this button is rendered with fb-cta markup. */
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#rf-start,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#rf-start,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#cr-start,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#cr-start,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#random-start,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#random-start,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn.start-random,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn.start-random,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[data-random-start],
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[data-random-start],
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[aria-label*="Start random" i],
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[aria-label*="Start random" i]{
        --cta-ico-bg: transparent !important;
        --cta-ico-border: transparent !important;
      }

      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#rf-start .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#rf-start .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#cr-start .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#cr-start .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#random-start .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#random-start .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn.start-random .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn.start-random .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[data-random-start] .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[data-random-start] .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[aria-label*="Start random" i] .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[aria-label*="Start random" i] .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn .fb-cta__ico--random,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn .fb-cta__ico--random,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn .fb-cta__ico--dice,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn .fb-cta__ico--dice{
        background: transparent !important;
        border-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(st);
  }

  try { fbInstallRandomDiceLightBgFixV1(); } catch (_) {}


  const FB_LOGIC_ITEM_ID = "logic_operators";
  const FB_LOGIC_ITEM_TITLE = "Search Logic Operators";
  const FB_LOGIC_ITEM_PRICE = 50;

  function fbShopApi() { try { return window.MkAccountData || null; } catch (_) { return null; } }
  function fbHasShopItem(itemId) {
    if (String(itemId || "") === FB_LOGIC_ITEM_ID) return true;
    try {
      const api = fbShopApi();
      if (api && typeof api.hasShopItem === "function") return !!api.hasShopItem(itemId);
      const xp = api && typeof api.xp === "function" ? api.xp() : null;
      const owned = xp && (xp.ownedShopItems || (xp.shopInventory && xp.shopInventory.ownedIds));
      return Array.isArray(owned) && owned.indexOf(itemId) >= 0;
    } catch (_) { return false; }
  }
  function fbCurrencyBalance() {
    try {
      const api = fbShopApi();
      const xp = api && typeof api.xp === "function" ? api.xp() : null;
      return Number(xp && (xp.currencyBalance != null ? xp.currencyBalance : xp.eorbits) || 0) || 0;
    } catch (_) { return 0; }
  }
  function fbOfferUnlock(itemId, title, price, source) {
    try {
      if (fbHasShopItem(itemId)) return Promise.resolve(true);
      const api = fbShopApi();
      if (!api || typeof api.buyShopItem !== "function") {
        window.alert("The shop is still loading. Please try again in a moment.");
        return Promise.resolve(false);
      }
      const balance = fbCurrencyBalance();
      if (balance + 1e-9 < Number(price || 0)) {
        window.alert(`${title} needs ${price} EORbits. You currently have ${Math.round(balance * 10) / 10}.`);
        return Promise.resolve(false);
      }
      if (!window.confirm(`Unlock ${title} for ${price} EORbits?`)) return Promise.resolve(false);
      return api.buyShopItem(itemId, { source: source || itemId }).then((res) => {
        if (!res || res.ok === false) {
          window.alert(res && res.error === "insufficient_funds" ? "Not enough EORbits." : "Unlock failed. Please try again.");
          return false;
        }
        try { window.dispatchEvent(new CustomEvent("mk-shop-inventory-change", { detail: { itemId, source: source || itemId } })); } catch (_) {}
        return true;
      });
    } catch (err) {
      try { window.alert(String(err && err.message || err || "Unlock failed.")); } catch (_) {}
      return Promise.resolve(false);
    }
  }
  function fbEnsureLogicUnlocked(source) {
    if (fbHasShopItem(FB_LOGIC_ITEM_ID)) return Promise.resolve(true);
    return fbOfferUnlock(FB_LOGIC_ITEM_ID, FB_LOGIC_ITEM_TITLE, FB_LOGIC_ITEM_PRICE, source || "find-builder-logic");
  }

  function fbMarkLockedLogicButtons(host) {
    try {
      const locked = !fbHasShopItem(FB_LOGIC_ITEM_ID);
      (host || document).querySelectorAll("#fb-and,#fb-or").forEach((btn) => {
        btn.classList.toggle("fb-op-locked", locked);
        btn.title = locked ? `Unlock ${FB_LOGIC_ITEM_TITLE} · ${FB_LOGIC_ITEM_PRICE} EORbits` : "";
      });
    } catch (_) {}
  }

  function fbInstallShopLockStylesOnce() {
    if (document.getElementById("mk-find-builder-shop-lock-style-v1")) return;
    const st = document.createElement("style");
    st.id = "mk-find-builder-shop-lock-style-v1";
    st.textContent = `
      #fb-and.fb-op-locked,#fb-or.fb-op-locked{
        border-color:rgba(245,200,75,.42) !important;
        color:color-mix(in srgb,#f5c84b 82%,var(--md-default-fg-color)) !important;
      }
      #fb-and.fb-op-locked::after,#fb-or.fb-op-locked::after{
        content:"🔒";
        font-size:.58em;
        margin-left:.35em;
        opacity:.78;
      }
    `;
    (document.head || document.documentElement).appendChild(st);
  }
  try { fbInstallShopLockStylesOnce(); } catch (_) {}
  document.addEventListener("DOMContentSwitch", () => {
    try { fbInstallRandomDiceLightBgFixV1(); } catch (_) {}


  const FB_LOGIC_ITEM_ID = "logic_operators";
  const FB_LOGIC_ITEM_TITLE = "Search Logic Operators";
  const FB_LOGIC_ITEM_PRICE = 50;

  function fbShopApi() { try { return window.MkAccountData || null; } catch (_) { return null; } }
  function fbHasShopItem(itemId) {
    if (String(itemId || "") === FB_LOGIC_ITEM_ID) return true;
    try {
      const api = fbShopApi();
      if (api && typeof api.hasShopItem === "function") return !!api.hasShopItem(itemId);
      const xp = api && typeof api.xp === "function" ? api.xp() : null;
      const owned = xp && (xp.ownedShopItems || (xp.shopInventory && xp.shopInventory.ownedIds));
      return Array.isArray(owned) && owned.indexOf(itemId) >= 0;
    } catch (_) { return false; }
  }
  function fbCurrencyBalance() {
    try {
      const api = fbShopApi();
      const xp = api && typeof api.xp === "function" ? api.xp() : null;
      return Number(xp && (xp.currencyBalance != null ? xp.currencyBalance : xp.eorbits) || 0) || 0;
    } catch (_) { return 0; }
  }
  function fbOfferUnlock(itemId, title, price, source) {
    try {
      if (fbHasShopItem(itemId)) return Promise.resolve(true);
      const api = fbShopApi();
      if (!api || typeof api.buyShopItem !== "function") {
        window.alert("The shop is still loading. Please try again in a moment.");
        return Promise.resolve(false);
      }
      const balance = fbCurrencyBalance();
      if (balance + 1e-9 < Number(price || 0)) {
        window.alert(`${title} needs ${price} EORbits. You currently have ${Math.round(balance * 10) / 10}.`);
        return Promise.resolve(false);
      }
      if (!window.confirm(`Unlock ${title} for ${price} EORbits?`)) return Promise.resolve(false);
      return api.buyShopItem(itemId, { source: source || itemId }).then((res) => {
        if (!res || res.ok === false) {
          window.alert(res && res.error === "insufficient_funds" ? "Not enough EORbits." : "Unlock failed. Please try again.");
          return false;
        }
        try { window.dispatchEvent(new CustomEvent("mk-shop-inventory-change", { detail: { itemId, source: source || itemId } })); } catch (_) {}
        return true;
      });
    } catch (err) {
      try { window.alert(String(err && err.message || err || "Unlock failed.")); } catch (_) {}
      return Promise.resolve(false);
    }
  }
  function fbEnsureLogicUnlocked(source) {
    if (fbHasShopItem(FB_LOGIC_ITEM_ID)) return Promise.resolve(true);
    return fbOfferUnlock(FB_LOGIC_ITEM_ID, FB_LOGIC_ITEM_TITLE, FB_LOGIC_ITEM_PRICE, source || "find-builder-logic");
  }

  function fbMarkLockedLogicButtons(host) {
    try {
      const locked = !fbHasShopItem(FB_LOGIC_ITEM_ID);
      (host || document).querySelectorAll("#fb-and,#fb-or").forEach((btn) => {
        btn.classList.toggle("fb-op-locked", locked);
        btn.title = locked ? `Unlock ${FB_LOGIC_ITEM_TITLE} · ${FB_LOGIC_ITEM_PRICE} EORbits` : "";
      });
    } catch (_) {}
  }

  function fbInstallShopLockStylesOnce() {
    if (document.getElementById("mk-find-builder-shop-lock-style-v1")) return;
    const st = document.createElement("style");
    st.id = "mk-find-builder-shop-lock-style-v1";
    st.textContent = `
      #fb-and.fb-op-locked,#fb-or.fb-op-locked{
        border-color:rgba(245,200,75,.42) !important;
        color:color-mix(in srgb,#f5c84b 82%,var(--md-default-fg-color)) !important;
      }
      #fb-and.fb-op-locked::after,#fb-or.fb-op-locked::after{
        content:"🔒";
        font-size:.58em;
        margin-left:.35em;
        opacity:.78;
      }
    `;
    (document.head || document.documentElement).appendChild(st);
  }
  try { fbInstallShopLockStylesOnce(); } catch (_) {}
  });
  window.addEventListener("pageshow", () => {
    try { fbInstallRandomDiceLightBgFixV1(); } catch (_) {}


  const FB_LOGIC_ITEM_ID = "logic_operators";
  const FB_LOGIC_ITEM_TITLE = "Search Logic Operators";
  const FB_LOGIC_ITEM_PRICE = 50;

  function fbShopApi() { try { return window.MkAccountData || null; } catch (_) { return null; } }
  function fbHasShopItem(itemId) {
    if (String(itemId || "") === FB_LOGIC_ITEM_ID) return true;
    try {
      const api = fbShopApi();
      if (api && typeof api.hasShopItem === "function") return !!api.hasShopItem(itemId);
      const xp = api && typeof api.xp === "function" ? api.xp() : null;
      const owned = xp && (xp.ownedShopItems || (xp.shopInventory && xp.shopInventory.ownedIds));
      return Array.isArray(owned) && owned.indexOf(itemId) >= 0;
    } catch (_) { return false; }
  }
  function fbCurrencyBalance() {
    try {
      const api = fbShopApi();
      const xp = api && typeof api.xp === "function" ? api.xp() : null;
      return Number(xp && (xp.currencyBalance != null ? xp.currencyBalance : xp.eorbits) || 0) || 0;
    } catch (_) { return 0; }
  }
  function fbOfferUnlock(itemId, title, price, source) {
    try {
      if (fbHasShopItem(itemId)) return Promise.resolve(true);
      const api = fbShopApi();
      if (!api || typeof api.buyShopItem !== "function") {
        window.alert("The shop is still loading. Please try again in a moment.");
        return Promise.resolve(false);
      }
      const balance = fbCurrencyBalance();
      if (balance + 1e-9 < Number(price || 0)) {
        window.alert(`${title} needs ${price} EORbits. You currently have ${Math.round(balance * 10) / 10}.`);
        return Promise.resolve(false);
      }
      if (!window.confirm(`Unlock ${title} for ${price} EORbits?`)) return Promise.resolve(false);
      return api.buyShopItem(itemId, { source: source || itemId }).then((res) => {
        if (!res || res.ok === false) {
          window.alert(res && res.error === "insufficient_funds" ? "Not enough EORbits." : "Unlock failed. Please try again.");
          return false;
        }
        try { window.dispatchEvent(new CustomEvent("mk-shop-inventory-change", { detail: { itemId, source: source || itemId } })); } catch (_) {}
        return true;
      });
    } catch (err) {
      try { window.alert(String(err && err.message || err || "Unlock failed.")); } catch (_) {}
      return Promise.resolve(false);
    }
  }
  function fbEnsureLogicUnlocked(source) {
    if (fbHasShopItem(FB_LOGIC_ITEM_ID)) return Promise.resolve(true);
    return fbOfferUnlock(FB_LOGIC_ITEM_ID, FB_LOGIC_ITEM_TITLE, FB_LOGIC_ITEM_PRICE, source || "find-builder-logic");
  }

  function fbMarkLockedLogicButtons(host) {
    try {
      const locked = !fbHasShopItem(FB_LOGIC_ITEM_ID);
      (host || document).querySelectorAll("#fb-and,#fb-or").forEach((btn) => {
        btn.classList.toggle("fb-op-locked", locked);
        btn.title = locked ? `Unlock ${FB_LOGIC_ITEM_TITLE} · ${FB_LOGIC_ITEM_PRICE} EORbits` : "";
      });
    } catch (_) {}
  }

  function fbInstallShopLockStylesOnce() {
    if (document.getElementById("mk-find-builder-shop-lock-style-v1")) return;
    const st = document.createElement("style");
    st.id = "mk-find-builder-shop-lock-style-v1";
    st.textContent = `
      #fb-and.fb-op-locked,#fb-or.fb-op-locked{
        border-color:rgba(245,200,75,.42) !important;
        color:color-mix(in srgb,#f5c84b 82%,var(--md-default-fg-color)) !important;
      }
      #fb-and.fb-op-locked::after,#fb-or.fb-op-locked::after{
        content:"🔒";
        font-size:.58em;
        margin-left:.35em;
        opacity:.78;
      }
    `;
    (document.head || document.documentElement).appendChild(st);
  }
  try { fbInstallShopLockStylesOnce(); } catch (_) {}
  }, { passive: true });

  function fbInstallNoBlurCssV8() {
    if (document.getElementById("mk-find-no-blur-v8")) return;
    const st = document.createElement("style");
    st.id = "mk-find-no-blur-v8";
    st.textContent = `
      #find-builder.fb-dream-active .fb-board,
      #search-results.fb-preblur,
      #search-results.fb-preblur .csr-cols,
      #search-results.fb-preblur .csr-list,
      #search-results.fb-preblur .csr-foot,
      #find-builder .fb-hint--pending,
      #find-builder .fb-hint--reveal{
        filter:none!important;
        backdrop-filter:none!important;
        -webkit-backdrop-filter:none!important;
        opacity:1!important;
        transform:none!important;
        animation:none!important;
        transition:none!important;
      }
    `;
    (document.head || document.documentElement).appendChild(st);
  }

  function fbClearNoBlurResidueV8() {
    try { fbInstallNoBlurCssV8(); } catch (_) {}
    try {
      const fb = document.getElementById("find-builder");
      if (fb) fb.classList.remove("fb-dream-active", "fb-undo-bump", "fb-redo-bump");
      const res = document.getElementById("search-results");
      if (res) res.classList.remove("fb-preblur");
      document.querySelectorAll("#search-results .csr-cols,#search-results .csr-list,#search-results .csr-foot,#find-builder .fb-board,#find-builder .fb-hint").forEach((el) => {
        el.style.filter = "";
        el.style.opacity = "";
        el.style.transform = "";
        el.classList.remove("fb-hint--pending", "fb-hint--reveal");
      });
    } catch (_) {}
  }

  fbInstallNoBlurCssV8();
  if (!window.MkSiteMotion) {
    (function () {
      const STORAGE_KEY = "mk_site_motion_enabled_v1";
      const CHANGE_EVENT = "mk:site-motion-change";
      const BTN_WRAP_ID = "mk-site-motion-toggle";
      const STYLE_ID = "mk-site-motion-style-v1";
      let __mkRetryTimer = 0;
      let __mkRetryCount = 0;
      const __MK_MAX_RETRY = 40;

      function __mkReadUserEnabled() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          return raw == null ? true : raw !== "0";
        } catch (_) {
          return true;
        }
      }

      function __mkWriteUserEnabled(v) {
        try { localStorage.setItem(STORAGE_KEY, v ? "1" : "0"); } catch (_) {}
      }

      function __mkSystemReduced() {
        try {
          return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        } catch (_) {
          return false;
        }
      }

      function __mkMotionEnabled() {
        return __mkReadUserEnabled() && !__mkSystemReduced();
      }

      function __mkApplyHtmlState() {
        const root = document.documentElement;
        const enabled = __mkMotionEnabled();
        if (!root) return enabled;
        root.classList.toggle("mk-site-motion-on", enabled);
        root.classList.toggle("mk-site-motion-off", !enabled);
        return enabled;
      }

      function __mkEnsureMotionStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const st = document.createElement("style");
        st.id = STYLE_ID;
        st.textContent = `
#${BTN_WRAP_ID}{
  display:inline-flex;
  align-items:center;
}
#${BTN_WRAP_ID}.md-header__option{
  margin-left: 0;
}
#${BTN_WRAP_ID} .mk-motion-btn{
  appearance:none;
  border:0;
  background:transparent;
  color:inherit;
  width:2.2rem;
  height:2.2rem;
  padding:0;
  border-radius:999px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  opacity:.96;
}
#${BTN_WRAP_ID} .mk-motion-btn:hover{
  background:rgba(255,255,255,.10);
}
html[data-md-color-scheme="default"] #${BTN_WRAP_ID} .mk-motion-btn:hover,
body[data-md-color-scheme="default"] #${BTN_WRAP_ID} .mk-motion-btn:hover{
  background:rgba(0,0,0,.06);
}
#${BTN_WRAP_ID}.is-off .mk-motion-btn{
  opacity:.82;
}
#${BTN_WRAP_ID}.is-system-off .mk-motion-btn{
  opacity:.68;
}
#${BTN_WRAP_ID} .mk-motion-btn svg{
  width:1.1rem;
  height:1.1rem;
  display:block;
}
html.mk-site-motion-off #find-builder .fb-fly-layer,
html.mk-site-motion-off #find-builder .fb-fly-ghost,
html.mk-site-motion-off #lp-map-modal .lp-flow-arrow{
  display:none !important;
}
html.mk-site-motion-off #lp-map-modal .lp-mapviewport svg path.lp-rel-edge.lp-rel-anim{
  animation:none !important;
}
`;
        (document.head || document.documentElement).appendChild(st);
      }

      function __mkEnabledIcon() {
        return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5.14v14l11-7-11-7Z"/></svg>';
      }

      function __mkDisabledIcon() {
        return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 19h4V5H6v14m8-14v14h4V5h-4Z"/></svg>';
      }

      function __mkGetAnchor() {
        const palette = document.querySelector('label[for="__palette"]');
        if (palette && palette.closest) {
          const opt = palette.closest('.md-header__option');
          if (opt) return opt;
        }
        const options = document.querySelector('.md-header__options');
        if (options) return options;
        return document.querySelector('.md-header');
      }

      function __mkUpdateButton() {
        const wrap = document.getElementById(BTN_WRAP_ID);
        if (!wrap) return;
        const btn = wrap.querySelector('.mk-motion-btn');
        if (!btn) return;

        const enabled = __mkMotionEnabled();
        const systemReduced = __mkSystemReduced();
        btn.innerHTML = enabled ? __mkEnabledIcon() : __mkDisabledIcon();
        btn.setAttribute('aria-label', enabled ? 'Turn off site animations' : 'Turn on site animations');
        btn.setAttribute('title', systemReduced
          ? 'Site animations follow your system reduced-motion setting'
          : (enabled ? 'Turn off site animations' : 'Turn on site animations'));
        wrap.classList.toggle('is-off', !enabled);
        wrap.classList.toggle('is-system-off', systemReduced);
      }

      function __mkInsertButton(anchor) {
        let wrap = document.getElementById(BTN_WRAP_ID);
        if (!wrap) {
          wrap = document.createElement('div');
          wrap.id = BTN_WRAP_ID;
          wrap.className = 'md-header__option';
          wrap.innerHTML = '<button type="button" class="md-header__button md-icon mk-motion-btn"></button>';
          const btn = wrap.querySelector('.mk-motion-btn');
          if (btn) {
            btn.addEventListener('click', function () {
              __mkWriteUserEnabled(!__mkReadUserEnabled());
              window.MkSiteMotion.refresh();
            });
          }
        }

        const parent = anchor && anchor.parentNode ? anchor.parentNode : null;
        if (anchor && anchor.classList && anchor.classList.contains('md-header__option') && parent) {
          if (wrap.parentNode !== parent || wrap.previousSibling !== anchor) {
            anchor.insertAdjacentElement('afterend', wrap);
          }
        } else if (anchor && wrap.parentNode !== anchor) {
          anchor.appendChild(wrap);
        }

        __mkUpdateButton();
        return true;
      }

      function __mkEmitChange() {
        const detail = {
          enabled: __mkMotionEnabled(),
          userEnabled: __mkReadUserEnabled(),
          systemReduced: __mkSystemReduced()
        };
        try {
          window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail }));
        } catch (_) {}
      }

      function __mkClearRetry() {
        if (__mkRetryTimer) {
          clearTimeout(__mkRetryTimer);
          __mkRetryTimer = 0;
        }
      }

      function __mkEnsureButton() {
        __mkEnsureMotionStyles();
        __mkApplyHtmlState();
        const anchor = __mkGetAnchor();
        if (!anchor) return false;
        __mkClearRetry();
        __mkRetryCount = 0;
        return __mkInsertButton(anchor);
      }

      function __mkScheduleRetry() {
        if (__mkRetryTimer || __mkRetryCount >= __MK_MAX_RETRY) return;
        __mkRetryCount += 1;
        __mkRetryTimer = window.setTimeout(function () {
          __mkRetryTimer = 0;
          if (!__mkEnsureButton()) __mkScheduleRetry();
        }, 200);
      }

      function __mkMount() {
        __mkEnsureMotionStyles();
        __mkApplyHtmlState();
        if (!__mkEnsureButton()) __mkScheduleRetry();
        __mkEmitChange();
      }

      window.MkSiteMotion = {
        isEnabled: __mkMotionEnabled,
        isReduced: function () { return !__mkMotionEnabled(); },
        readUserEnabled: __mkReadUserEnabled,
        setEnabled: function (v) {
          __mkWriteUserEnabled(!!v);
          this.refresh();
        },
        refresh: function () {
          __mkApplyHtmlState();
          if (!__mkEnsureButton()) __mkScheduleRetry();
          __mkEmitChange();
        },
        mount: __mkMount,
      };

      try {
        const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
        const onChange = function () { window.MkSiteMotion.refresh(); };
        if (mq && typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
        else if (mq && typeof mq.addListener === 'function') mq.addListener(onChange);
      } catch (_) {}

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', __mkMount, { once: true });
      } else {
        __mkMount();
      }
      document.addEventListener('DOMContentSwitch', __mkMount);
      window.addEventListener('pageshow', __mkMount);
      window.addEventListener('load', __mkMount);
    })();
  } else {
    try { window.MkSiteMotion.mount && window.MkSiteMotion.mount(); } catch (_) {}
  }


  const TOKENS_KEY = "random_custom_tokens_v1";
const EXPR_KEY = "random_custom_expr_v1";
const FB_TOKEN_INPUT_HISTORY_KEY = "mk_find_token_input_history_v1";
const FB_TOKEN_INPUT_HISTORY_MAX = 12;
const __fbTokenInputUi = {
  seq: 0,
  activeIndex: -1,
  items: [],
  suppressBlurHideUntil: 0,
  pointerFocusUntil: 0,
  lastPointerDownTarget: null,
  lastPointerDownTs: 0,
  lastApplied: "",
  bootAt: Date.now(),
  bootGuardUntil: Date.now() + 1350,
  mobileFocusGraceUntil: 0,
  mobileDropdownDeferUntil: 0,
  mobileBootTapUntil: 0,
  lastFocusTs: 0,
  dropdownPress: null,
  dropdownSuppressChoiceUntil: 0,
};



  function fbConsumeGuestAction(action, detail) {
    try {
      if (window.MkGuestAccess && typeof window.MkGuestAccess.consume === "function") {
        return !!window.MkGuestAccess.consume(action, detail || {});
      }
    } catch (_) {}
    return true;
  }

  function isOnFindPage() {
    // Accept every routing shape MkDocs/hosting may use for the Find page:
    // /find, /find/, /find.html, /find/index.html, and the same paths under a site prefix.
    try {
      const p0 = String(window.location.pathname || "").toLowerCase();
      const clean = p0
        .replace(/\/index\.html$/, "")
        .replace(/\/find\.html$/, "/find")
        .replace(/\/+$/, "");

      if (clean === "find" || clean.endsWith("/find")) return true;
      if (p0.endsWith("/find.html") || p0.endsWith("/find/index.html")) return true;
    } catch (_) {}

    // DOM fallback for Material instant navigation, where the URL and page body can
    // briefly disagree while the swapped content is already the Find page.
    try {
      if (document.body && document.body.classList && document.body.classList.contains("mk-find-page")) return true;
      if (document.getElementById("find-builder")) return true;
      const form = document.getElementById("search-form");
      const results = document.getElementById("search-results");
      const input = document.getElementById("search-input");
      if (form && results && input && form.contains(input)) return true;
    } catch (_) {}

    return false;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ----------------------------
  // Fuzzy core (dynamic load) + UI note line
  // ----------------------------
  const FUZZY_CORE_PATH = "javascripts/fuzzy-core.js";
  let __fbFuzzyLoadPromise = null;

  function fbGetSiteRootUrl() {
    // Same logic as other scripts in this repo
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]');

    const attr = script ? script.getAttribute("src") : (link ? link.getAttribute("href") : null);
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);

    const p = assetUrl.pathname;
    const idx = p.indexOf("/assets/");
    if (idx >= 0) return assetUrl.origin + p.slice(0, idx + 1);

    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }

  function fbEnsureFuzzyCore() {
    if (window.__mkFuzzyCore) return Promise.resolve(window.__mkFuzzyCore);
    if (__fbFuzzyLoadPromise) return __fbFuzzyLoadPromise;

    __fbFuzzyLoadPromise = new Promise((resolve) => {
      const existing = document.querySelector('script[data-mk-fuzzy-core="1"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.__mkFuzzyCore), { once: true });
        existing.addEventListener("error", () => resolve(null), { once: true });
        return;
      }

      const s = document.createElement("script");
      s.dataset.mkFuzzyCore = "1";
      s.async = true;
      s.defer = true;
      try {
        s.src = new URL(FUZZY_CORE_PATH, fbGetSiteRootUrl()).toString();
      } catch (_) {
        s.src = FUZZY_CORE_PATH;
      }
      s.onload = () => resolve(window.__mkFuzzyCore || null);
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });

    return __fbFuzzyLoadPromise;
  }

  function fbEnsureFuzzyStyles() {
    if (document.getElementById("fb-fuzzy-style-v1")) return;
    const st = document.createElement("style");
    st.id = "fb-fuzzy-style-v1";
    st.textContent = `
      #fb-fuzzy-note{
        margin:12px 0 12px;
        padding:10px 12px;
        border-radius:14px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: var(--grad-panel, rgba(0,0,0,.03));
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
        display:none;
        gap:12px;
        align-items:center;
        justify-content:space-between;
        flex-wrap:wrap;
      }
      #fb-fuzzy-note .fb-fuzzy-msg{ min-width:0; line-height:1.25; opacity:.95; }
      #fb-fuzzy-note code{
        padding:2px 6px; border-radius:10px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(0,0,0,.04);
      }
      #fb-fuzzy-note .fb-fuzzy-actions{ display:flex; gap:10px; flex:0 0 auto; }
      #fb-fuzzy-note .fb-fuzzy-btn{
        appearance:none;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(0,0,0,.03);
        color:inherit;
        border-radius:999px;
        padding:7px 12px;
        cursor:pointer;
        font-weight:650;
        display:inline-flex;
        align-items:center;
        gap:8px;
        line-height:1;
      }
      #fb-fuzzy-note .fb-fuzzy-btn:hover{ background: rgba(0,0,0,.06); }
      #fb-fuzzy-note .fb-fuzzy-btn::before{
        display:inline-flex; align-items:center; justify-content:center;
        width:18px; height:18px; border-radius:999px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(0,0,0,.04);
        font-size:12px; font-weight:900;
      }
      #fb-fuzzy-note .fb-fuzzy-btn--undo::before{ content:"↩"; }
          `;
    document.head.appendChild(st);
  }

  function fbEnsureFuzzyNoteHost() {
  fbEnsureFuzzyStyles();
  return document.getElementById("fb-fuzzy-note");
}

  function fbApplyFuzzyNoteDom(host) {
    fbEnsureFuzzyStyles();
  const root = host || document.getElementById("find-builder") || document;
  const note = root && root.querySelector ? root.querySelector("#fb-fuzzy-note") : document.getElementById("fb-fuzzy-note");
  if (!note) return;

  const st = state.fuzzyNote || { visible: false, html: "", payload: "" };
  if (!st.visible) {
    note.style.display = "none";
    note.innerHTML = "";
    note.removeAttribute("data-fb-fuzzy-payload");
    return;
  }

  note.innerHTML = st.html || "";
  note.style.display = "flex";
  if (st.payload) note.setAttribute("data-fb-fuzzy-payload", st.payload);
  else note.removeAttribute("data-fb-fuzzy-payload");
}

function fbShowFuzzyNote(html, payloadObj) {
  const payload = payloadObj ? (() => { try { return JSON.stringify(payloadObj); } catch (_) { return ""; } })() : "";
  state.fuzzyNote = { visible: true, html: html || "", payload };
  fbApplyFuzzyNoteDom(document.getElementById("find-builder"));
}

function fbHideFuzzyNote() {
  state.fuzzyNote = { visible: false, html: "", payload: "" };
  fbApplyFuzzyNoteDom(document.getElementById("find-builder"));
}

  
  // ----------------------------
  // Autofill from header search (search-results.js dispatches "find:autofill")
  // Fixes:
  // - Ensure a typo typed in the TOP search bar is handled on the Find page (pool + panel + auto run).
  // - Avoid the misleading "Using <existing token> instead of <typed>" banner by always starting from a fresh panel.
  // - Keep your existing fuzzy logic and UI; this is only a glue layer.
  // ----------------------------
  const __fbAutofillStateV1 = { running: false, last: "", t: 0 };

  function fbMarkReadyV1() {
    try { window.__fbReadyV1 = true; } catch (_) {}
    if (window.__fbReadyDispatchedV1) return;
    window.__fbReadyDispatchedV1 = true;
    try { window.dispatchEvent(new CustomEvent("fb:ready")); } catch (_) {}
  }

  function fbBindAutofillListenerOnce() {
    if (window.__fbAutofillBoundV1) return;
    window.__fbAutofillBoundV1 = true;

    try {
      window.addEventListener("find:autofill", (ev) => {
        const token = ev && ev.detail ? ev.detail.token : "";
        fbAutofillFromTopSearch(token);
      });
    } catch (_) {}
  }

  function fbCanAutofillRunButton(btn) {
    if (!btn) return false;
    try { if (btn.disabled) return false; } catch (_) {}
    try { if (btn.getAttribute && btn.getAttribute("aria-disabled") === "true") return false; } catch (_) {}
    try {
      if (btn.classList && (
        btn.classList.contains("disabled") ||
        btn.classList.contains("is-disabled") ||
        btn.classList.contains("md-button--disabled")
      )) return false;
    } catch (_) {}
    return true;
  }

  function fbDispatchSyntheticClick(btn) {
    if (!btn) return false;
    const fire = (Ctor, type, extra) => {
      try {
        btn.dispatchEvent(new Ctor(type, Object.assign({ bubbles: true, cancelable: true, view: window }, extra || {})));
        return true;
      } catch (_) {
        return false;
      }
    };

    try { btn.focus && btn.focus({ preventScroll: true }); } catch (_) {}
    fire(window.PointerEvent || window.MouseEvent, "pointerdown", { button: 0, buttons: 1, pointerType: "mouse", isPrimary: true });
    fire(window.MouseEvent, "mousedown", { button: 0, buttons: 1 });
    fire(window.PointerEvent || window.MouseEvent, "pointerup", { button: 0, buttons: 0, pointerType: "mouse", isPrimary: true });
    fire(window.MouseEvent, "mouseup", { button: 0, buttons: 0 });
    fire(window.MouseEvent, "click", { button: 0, buttons: 0 });
    try {
      btn.click();
      return true;
    } catch (_) {}
    return true;
  }

  function fbRunSearchFallbackFromAutofill() {
    try {
      if (!state || !Array.isArray(state.expr) || !state.expr.length) return false;
      const norm = normalizeNodesToTokens(state.expr);
      const exprText = tokensToExprText(norm);
      if (!exprText) return false;

      try { clearStatus(); } catch (_) {}
      try { render(); } catch (_) {}
      try { fbStartRunSearchFx(); } catch (_) {}

      if (window.__findSearchV2 && typeof window.__findSearchV2.runLogicExpr === "function") {
        window.__findSearchV2.runLogicExpr(exprText);
        return true;
      }
      if (window.__findSearchV2 && typeof window.__findSearchV2.runQuery === "function") {
        window.__findSearchV2.runQuery(exprText);
        return true;
      }

      const params = new URLSearchParams(window.location.search);
      params.set("q", exprText);
      window.location.search = params.toString();
      return true;
    } catch (_) {
      return false;
    }
  }

  async function fbWaitAndRunSearchFromAutofill(timeoutMs) {
    const timeout = Number.isFinite(timeoutMs) ? timeoutMs : 2400;
    const startedAt = Date.now();
    let attempts = 0;

    while (Date.now() - startedAt < timeout) {
      attempts += 1;
      const scope = document.getElementById("find-builder") || document;
      const rb = scope.querySelector("#fb-run") || document.querySelector("#fb-run");
      const hasExpr = !!(state && Array.isArray(state.expr) && state.expr.length);

      if (rb && hasExpr && fbCanAutofillRunButton(rb)) {
        fbDispatchSyntheticClick(rb);
        return true;
      }

      await new Promise((r) => setTimeout(r, attempts < 8 ? 32 : 80));
    }

    return fbRunSearchFallbackFromAutofill();
  }


  function fbReadLpDirectRequest() {
    try {
      const params = new URLSearchParams(window.location.search);
      const directRaw = String(
        params.get("lp_direct") ||
        params.get("fb_direct") ||
        ""
      ).trim().toLowerCase();
      const src = String(params.get("src") || "").trim().toLowerCase();
      const q = String(params.get("q") || "").trim().replace(/\s+/g, " ");
      const token = String(params.get("lp_token") || q || "").trim().replace(/\s+/g, " ");
      const kind = String(params.get("lp_kind") || "").trim().toLowerCase();
      const isDirect =
        directRaw === "1" ||
        directRaw === "true" ||
        src === "learning_path" ||
        src === "lp_direct";
      if (!isDirect || !token) return null;
      return {
        q: token,
        token,
        kind: (kind === "lecture" || kind === "week") ? kind : "course"
      };
    } catch (_) {
      return null;
    }
  }

  function fbConsumeLpDirectRequest() {
    const req = fbReadLpDirectRequest();
    if (!req) return null;

    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("q");
      url.searchParams.delete("lp_direct");
      url.searchParams.delete("fb_direct");
      url.searchParams.delete("lp_token");
      url.searchParams.delete("lp_kind");
      const src = String(url.searchParams.get("src") || "").trim().toLowerCase();
      if (src === "learning_path" || src === "lp_direct") {
        url.searchParams.delete("src");
      }
      history.replaceState(history.state || {}, "", url.toString());
    } catch (_) {}

    return req;
  }

  async function fbAutofillFromLpDirect(req) {
    const token = String(req && (req.token || req.q) || "").trim().replace(/\s+/g, " ");
    if (!token) return;

    const now = Date.now();
    if (
      __fbAutofillStateV1.running &&
      __fbAutofillStateV1.last === token &&
      now - (__fbAutofillStateV1.t || 0) < 1200
    ) return;

    __fbAutofillStateV1.running = true;
    __fbAutofillStateV1.last = token;
    __fbAutofillStateV1.t = now;

    try {
      state.enterQuery = "";
      state.enterQueryUsed = true;
      state.history = [];
      state.future = [];
    } catch (_) {}

    try { fbHideFuzzyNote(); } catch (_) {}
    try { clearStatus(); } catch (_) {}

    try {
      state.expr = [TERM(token)];
      state.cursor = state.expr.length;
    } catch (_) {}

    try {
      state.tokens = addTokensToStorage([token]);
    } catch (_) {}

    clearStatus();
    render();

    try {
      await new Promise((r) => setTimeout(r, 0));
      await fbWaitAndRunSearchFromAutofill(2600);
    } catch (_) {}

    __fbAutofillStateV1.running = false;
  }

  async function fbAutofillFromTopSearch(rawToken) {
    const q = String(rawToken || "").trim().replace(/\s+/g, " ");
    if (!q) return;

    const now = Date.now();
    if (
      __fbAutofillStateV1.running &&
      __fbAutofillStateV1.last === q &&
      now - (__fbAutofillStateV1.t || 0) < 1200
    ) return;

    __fbAutofillStateV1.running = true;
    __fbAutofillStateV1.last = q;
    __fbAutofillStateV1.t = now;

    // Disable the "enter query reflection" banner (it can be misleading if the panel had old tokens).
    try {
      state.enterQuery = "";
      state.enterQueryUsed = true;
    } catch (_) {}

    try { fbHideFuzzyNote(); } catch (_) {}
    try { clearStatus(); } catch (_) {}

    const beforePool = (() => { try { return readTokens(); } catch (_) { return []; } })();
    const beforePoolLower = new Set(beforePool.map((x) => String(x || "").trim().toLowerCase()));

    // Support comma-separated input, but only the first token is used for the panel search.
    const rawTokens = parseTokensFromInput(q);
    const toks = rawTokens.length ? rawTokens : [q];
    const first = String(toks[0] || "").trim().replace(/\s+/g, " ");
    if (!first) {
      __fbAutofillStateV1.running = false;
      return;
    }

    // Fresh panel for this run (avoid mixing with previous expression)
    try {
      state.history = [];
      state.future = [];
    } catch (_) {}
    state.expr = [TERM(first)];
    state.cursor = state.expr.length;

    // Add to pool EXACTLY as typed here (so the later correction shows "No results as typed...")
    try { state.tokens = addTokensToStorage(toks); } catch (_) {}

    clearStatus();
    render();

    // If the typed token has zero matches, swap it to a suggestion NOW and show the standard banner.
    // (This also ensures the pool ends up with the corrected token.)
    try {
      const has = await fbHasAnyMatchForTermCached(first);
      if (!has) {
        let to = "";
        try { to = await fbSuggestPhraseForAdd(first); } catch (_) { to = ""; }
        to = String(to || "").trim().replace(/\s+/g, " ");

        if (to && to.toLowerCase() !== first.toLowerCase()) {
          let ok = true;
          try { ok = await fbHasAnyMatchForTermCached(to); } catch (_) { ok = true; }

          if (ok) {
            const exprBefore = snapshot().expr;
            fbReplaceTokenEverywhere(first, to);

            // Re-render so pool + panel reflect the corrected token
            try { state.tokens = readTokens(); } catch (_) {}
            clearStatus();
            render();

            const exprNow = tokensToExprText(normalizeNodesToTokens(state.expr));

            const swapExisted = beforePoolLower.has(String(to).toLowerCase());
            const tokenSwaps = swapExisted ? {} : { [to]: first };
            const tokenAddsOnEdit = swapExisted ? [first] : [];

            fbShowFuzzyNote(
              `<div class="fb-fuzzy-msg">No results as typed. Using <code>${escapeHtml(to)}</code> instead of <code>${escapeHtml(first)}</code>.</div>
               <div class="fb-fuzzy-actions">
                 <button type="button" class="fb-fuzzy-btn fb-fuzzy-btn--undo" data-fb-fuzzy-act="edit">Edit as typed</button>
               </div>`,
              { origExpr: exprBefore, tokenSwaps, tokenAddsOnEdit, forExprText: exprNow }
            );
          }
        }
      }
    } catch (_) {}

    // Finally: run search.
    // Mobile can be one render/frame behind here, so don't rely on a single immediate rb.click().
    try {
      await new Promise((r) => setTimeout(r, 0));
      await fbWaitAndRunSearchFromAutofill(2600);
    } catch (_) {}

    __fbAutofillStateV1.running = false;
  }

// ----------------------------
  // Enter flow (from header search): cache typed query so mobile can show the same banner
  // when a typo gets corrected automatically.
  // ----------------------------
  const FB_ENTER_CACHE_KEY = "__fb_enter_query_v1__";
  const FB_ENTER_PAYLOAD_KEY_V2 = "find_pending_token_v2";
  const FB_ENTER_PAYLOAD_KEY_V1 = "find_pending_token_v1";

  function fbReadEnterQueryNow() {
    // Try v2 payload first: {"q": "...", "nonce": "..."}
    try {
      const raw = sessionStorage.getItem(FB_ENTER_PAYLOAD_KEY_V2) || "";
      const s = String(raw || "").trim();
      if (s && s.startsWith("{")) {
        const obj = JSON.parse(s);
        const q = String(obj && obj.q || "").trim();
        if (q) return q;
      }
      if (s) return s;
    } catch (_) {}

    // Legacy
    try {
      const q1 = String(sessionStorage.getItem(FB_ENTER_PAYLOAD_KEY_V1) || "").trim();
      if (q1) return q1;
    } catch (_) {}

    // Our own cache
    try {
      const q2 = String(sessionStorage.getItem(FB_ENTER_CACHE_KEY) || "").trim();
      if (q2) return q2;
    } catch (_) {}

    return "";
  }

  function fbCacheEnterQuery() {
    const q = fbReadEnterQueryNow();
    if (!q) return "";
    try { sessionStorage.setItem(FB_ENTER_CACHE_KEY, q); } catch (_) {}
    return q;
  }

  function fbGetFirstTermInExpr() {
    for (const n of state.expr || []) {
      if (n && n.t === "TERM") {
        const v = String(n.v || "").trim().replace(/\s+/g, " ");
        if (v) return v;
      }
    }
    return "";
  }

  function fbMaybeShowEnterCorrectionNote() {
    if (state.enterQueryUsed) return;
    if (!state.enterQuery) return;
    if (state.fuzzyNote && state.fuzzyNote.visible) return;

    const orig = String(state.enterQuery || "").trim().replace(/\s+/g, " ");
    if (!orig) return;

    const nowTerm = fbGetFirstTermInExpr();
    if (!nowTerm) return;

    if (nowTerm.toLowerCase() === orig.toLowerCase()) return;

    // Show the same banner text as desktop. We do NOT perform any correction here;
    // we only reflect a correction that has already happened (e.g., via other scripts).
    const normNow = normalizeNodesToTokens(state.expr);
    const exprNow = tokensToExprText(normNow);

    const msg = `<code>${escapeHtml(nowTerm)}</code> instead of <code>${escapeHtml(orig)}</code>`;

    fbShowFuzzyNote(
      `<div class="fb-fuzzy-msg">No results as typed. Using ${msg}.</div>
       <div class="fb-fuzzy-actions">
         <button type="button" class="fb-fuzzy-btn fb-fuzzy-btn--undo" data-fb-fuzzy-act="edit">Edit as typed</button>
       </div>`,
      { origExpr: snapshot().expr, tokenSwaps: { [nowTerm]: orig }, forExprText: exprNow }
    );

    state.enterQueryUsed = true;
  }


  function fbIsGarbageToken(t) {
    const s = String(t || "").trim();
    if (!s) return true;
    // Fix accidental pollution from v2 pending token JSON
    if (s.includes('"nonce"') || s.includes('"q"') || s.includes('find_pending_token_v2')) return true;
    // JSON-ish object token (contains : inside {...})
    if (/^\{[\s\S]*:[\s\S]*\}$/.test(s)) return true;
    return false;
  }

  function fbReplaceTokenEverywhere(fromToken, toToken) {
    const from = String(fromToken || "").trim().replace(/\s+/g, " ");
    const to = String(toToken || "").trim().replace(/\s+/g, " ");
    if (!from || !to || from === to) return;

    // 1) token pool storage
    const curr = readTokens();
    const out = [];
    let hadFrom = false;
    for (const x of curr) {
      const nx = String(x || "").trim().replace(/\s+/g, " ");
      if (!nx) continue;
      if (nx === from) { hadFrom = true; continue; }
      if (!fbIsGarbageToken(nx)) out.push(nx);
    }
    if (hadFrom) out.push(to);
    writeTokens(Array.from(new Set(out)));

    // 2) expression nodes
    for (const n of state.expr) {
      if (n && n.t === "TERM") {
        const v = String(n.v || "").trim().replace(/\s+/g, " ");
        if (v === from) n.v = to;
      }
    }
  }

  let __fb_pages_cache = null;
  async function fbGetPageDocsCached() {
    if (__fb_pages_cache) return __fb_pages_cache;
    const indexJson = await fbLoadIndex();
    const docs = (indexJson && indexJson.docs) ? indexJson.docs : [];
    __fb_pages_cache = fbAggregateDocsToPages(docs);
    return __fb_pages_cache;
  }


  // ----------------------------
  // Simple fuzzy suggestion (no extra files)
  // Uses vocabulary extracted from search index (titles/tags/aliases/slug).
  // - Only applies to ASCII letter tokens (no digits, no symbols, no non-ASCII).
  // - Only triggers when the exact token has 0 matches.
  // ----------------------------
  let __fb_vocab_cache = null; // Map(wordLower -> freq)
  let __fb_vocab_list_cache = null; // Array<{w,f}>, sorted by freq desc

  function fbTokenizeWords(s) {
    const out = [];
    const str = String(s || "").toLowerCase();
    const m = str.match(/[a-z]{3,24}/g);
    if (m) out.push(...m);
    return out;
  }

  function fbLevenshtein(a, b, maxDist) {
    a = String(a || "");
    b = String(b || "");
    const al = a.length, bl = b.length;
    const maxD = Number.isFinite(maxDist) ? maxDist : 3;
    if (Math.abs(al - bl) > maxD) return maxD + 1;
    if (!al) return bl;
    if (!bl) return al;

    // Ensure b is shorter for memory usage
    if (bl > al) return fbLevenshtein(b, a, maxD);

    let prev = new Array(bl + 1);
    let curr = new Array(bl + 1);
    for (let j = 0; j <= bl; j++) prev[j] = j;

    for (let i = 1; i <= al; i++) {
      curr[0] = i;
      let rowMin = curr[0];
      const ca = a.charCodeAt(i - 1);

      for (let j = 1; j <= bl; j++) {
        const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
        const v = Math.min(
          prev[j] + 1,        // delete
          curr[j - 1] + 1,    // insert
          prev[j - 1] + cost  // substitute
        );
        curr[j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > maxD) return maxD + 1;
      const tmp = prev; prev = curr; curr = tmp;
    }
    return prev[bl];
  }

  async function fbBuildVocab() {
    if (__fb_vocab_cache && __fb_vocab_list_cache) return { map: __fb_vocab_cache, list: __fb_vocab_list_cache };

    const pages = await fbGetPageDocsCached();
    const freq = new Map();

    for (const d of pages || []) {
      const slug = (String(d.location || "").split("/").pop() || "").replace(/\.html$/i, "").replace(/[-_]+/g, " ");
      const hay = [
        d.title || "",
        slug,
        Array.isArray(d.tags) ? d.tags.join(" ") : "",
        Array.isArray(d.aliases) ? d.aliases.join(" ") : "",
      ].join(" ");

      for (const w of fbTokenizeWords(hay)) {
        freq.set(w, (freq.get(w) || 0) + 1);
      }
    }

    const list = Array.from(freq.entries())
      .map(([w, f]) => ({ w, f }))
      .sort((a, b) => (b.f - a.f) || (a.w < b.w ? -1 : a.w > b.w ? 1 : 0));

    __fb_vocab_cache = freq;
    __fb_vocab_list_cache = list;
    return { map: freq, list };
  }

  async function fbSuggestToken(raw) {
    const t0 = String(raw || "").trim().replace(/\s+/g, " ");
    if (!t0) return "";
    if (t0.includes(" ")) return ""; // no multi-word autocorrect
    if (/[0-9]/.test(t0)) return "";
    if (/[^\x00-\x7F]/.test(t0)) return "";
    if (/[^a-zA-Z-]/.test(t0)) return "";

    const t = t0.toLowerCase();
    const len = t.length;
    if (len < 3 || len > 24) return "";

    const { list } = await fbBuildVocab();

    const maxD = len <= 5 ? 2 : 3;

    // Prefix gate (fast)
    const p1 = t[0] || "";
    const p2 = t.slice(0, 2);

    let best = "";
    let bestD = maxD + 1;
    let bestF = -1;

    const maxScan = 2000;
    let scanned = 0;

    for (const { w, f } of list) {
      if (++scanned > maxScan) break;

      if (w[0] !== p1) continue;
      if (len >= 4 && w.slice(0, 2) !== p2) continue;

      const d = fbLevenshtein(t, w, maxD);
      if (d > maxD) continue;

      if (d < bestD || (d === bestD && f > bestF) || (d === bestD && f === bestF && w.length < best.length)) {
        best = w;
        bestD = d;
        bestF = f;
        if (bestD === 0) break;
      }
    }

    if (!best) return "";
    const ratio = bestD / Math.max(1, len);
    if (ratio > 0.34) return "";
    return best;
  }

  function fbTermMatchesHay(termLower, hay) {
    const parts = String(termLower || "")
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter(Boolean);
    if (!parts.length) return false;
    return parts.every((p) => hay.includes(p));
  }

  async function fbHasAnyMatchForTerm(rawTerm) {
    const termLower = String(rawTerm || "").trim().toLowerCase();
    if (!termLower) return false;

    const pages = await fbGetPageDocsCached();
    for (const d of pages) {
      const extraTags = Array.isArray(d.tags) ? d.tags.join(" ") : "";
      const extraAliases = Array.isArray(d.aliases) ? d.aliases.join(" ") : "";
      const hay = fbNormaliseForSearch(`${d.title} ${d.text} ${d.location} ${extraTags} ${extraAliases}`);
      if (fbTermMatchesHay(termLower, hay)) return true;
    }
    return false;
  }


  // ----------------------------
  // Add-token fuzzy detection helpers
  // Goal: when the user clicks "Add token", detect obvious typos immediately and
  // add the corrected token into the pool (instead of waiting until Run Search).
  // ----------------------------
  const __fbHasAnyMatchCache = new Map(); // key: lowercased token -> boolean

  async function fbHasAnyMatchForTermCached(rawTerm) {
    const k = String(rawTerm || "").trim().replace(/\s+/g, " ").toLowerCase();
    if (!k) return false;
    if (__fbHasAnyMatchCache.has(k)) return !!__fbHasAnyMatchCache.get(k);
    let v = false;
    try { v = await fbHasAnyMatchForTerm(rawTerm); } catch (_) { v = false; }
    __fbHasAnyMatchCache.set(k, !!v);
    return !!v;
  }

  function fbIsSafeForFuzzyToken(s) {
    const x = String(s || "").trim();
    if (!x) return false;
    // Match fuzzy-core safety (never touch math/symbol/digit tokens)
    if (/\d/.test(x)) return false;
    if (/[^\x00-\x7F]/.test(x)) return false; // non-ascii
    if (/[\^_{}\[\]()<>=:+*\/|]/.test(x)) return false;
    return true;
  }

  let __fbAddFuzzyScopeReady = false;
  async function fbSuggestPhraseForAdd(raw) {
    const from = String(raw || "").trim().replace(/\s+/g, " ");
    if (!from) return "";
    if (!fbIsSafeForFuzzyToken(from)) return "";

    // Prefer shared fuzzy-core (handles missing/extra spaces), fallback to local vocab suggestion.
    try {
      const core = await fbEnsureFuzzyCore();
      if (core && typeof core.suggestPhrase === "function") {
        const pages = await fbGetPageDocsCached();
        const scopeKey = "find:global";
        try {
          if (!__fbAddFuzzyScopeReady && typeof core.ensureScope === "function") {
            await core.ensureScope(scopeKey, { pageDocs: pages, includeBody: true, minFreq: 2, maxVocab: 12000 });
            __fbAddFuzzyScopeReady = true;
          }
        } catch (_) {}

        const sug = await core.suggestPhrase(scopeKey, from, { pageDocs: pages, includeBody: true, minFreq: 2, maxVocab: 12000 }).catch(() => null);
        const to = sug && sug.suggested ? String(sug.suggested || "").trim().replace(/\s+/g, " ") : "";
        if (to && to.toLowerCase() !== from.toLowerCase()) return to;
      }
    } catch (_) {}

    // Fallback: only single-word local autocorrect
    if (!from.includes(" ")) {
      try { return (await fbSuggestToken(from)) || ""; } catch (_) { return ""; }
    }

    return "";
  }

  function fbScheduleIdle(fn) {
    try {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => { try { fn(); } catch (_) {} }, { timeout: 800 });
        return;
      }
    } catch (_) {}
    setTimeout(() => { try { fn(); } catch (_) {} }, 0);
  }

  async function fbAutocorrectTokens(tokens) {
    // v5.0: autocorrect is now performed only when a search yields 0 results (deterministic, avoids race with autoflow).
    // Keeping this function as a no-op for backward compatibility.
    return;
  }

  async function fbTryAutoCorrectOnNoResults(normNodes, uniqueTermsLower, termCountsMap, hasLogic, exprText) {
    const zeroTerms = (uniqueTermsLower || []).filter(t => (termCountsMap.get(t) || 0) <= 0);
    if (!zeroTerms.length) return false;

    const termLowerToOrig = new Map();
    for (const t of normNodes || []) {
      if (t && t.k === "TERM") {
        const orig = String(t.v || "").trim().replace(/\s+/g, " ");
        if (orig) termLowerToOrig.set(orig.toLowerCase(), orig);
      }
    }

    const swaps = [];
    const swapMapUndo = {}; // to->from
    const exprBefore = snapshot().expr;

    for (const z of zeroTerms) {
      const orig = termLowerToOrig.get(z) || z;
      const from = String(orig || "").trim().replace(/\s+/g, " ");
      if (!from) continue;

      let to = "";
      try { to = await fbSuggestToken(from); } catch (_) { to = ""; }
      if (!to) continue;

      // Preserve leading uppercase
      if (/^[A-Z]/.test(from)) to = to.charAt(0).toUpperCase() + to.slice(1);

      if (!to || to === from) continue;

      fbReplaceTokenEverywhere(from, to);
      swaps.push([from, to]);
      swapMapUndo[to] = from;
    }

    if (!swaps.length) return false;

    state.tokens = readTokens();
    clearStatus();
    render();

    const norm2 = normalizeNodesToTokens(state.expr);
    const expr2 = tokensToExprText(norm2);

    const msg = swaps
      .map(([a, b]) => `<code>${escapeHtml(b)}</code> instead of <code>${escapeHtml(a)}</code>`)
      .join(", ");

    fbShowFuzzyNote(
      `<div class="fb-fuzzy-msg">No results as typed. Using ${msg}.</div>
       <div class="fb-fuzzy-actions">
         <button type="button" class="fb-fuzzy-btn fb-fuzzy-btn--undo" data-fb-fuzzy-act="edit">Edit as typed</button>
       </div>`,
      { origExpr: exprBefore, tokenSwaps: swapMapUndo, forExprText: expr2 }
    );

    try {
      if (window.__findSearchV2 && typeof window.__findSearchV2.runLogicExpr === "function") {
        window.__findSearchV2.runLogicExpr(expr2);
      } else if (window.__findSearchV2 && typeof window.__findSearchV2.runQuery === "function") {
        window.__findSearchV2.runQuery(expr2);
      }
    } catch (_) {}

    return true;
  }



  function ensureHeaderSearchInteractionTracker() {
    if (window.__fbHeaderSearchTrackerBoundV1) return;
    window.__fbHeaderSearchTrackerBoundV1 = true;

    const mark = (ms) => {
      const now = Date.now();
      const until = now + Math.max(360, Number(ms) || 0);
      try { window.__mkHeaderSearchUserTouchTs = now; } catch (_) {}
      try {
        const prev = Number(window.__mkFindHeaderSearchGraceUntil || 0);
        if (until > prev) window.__mkFindHeaderSearchGraceUntil = until;
      } catch (_) {}
    };

    const isHeaderSearchTarget = (t) => {
      try {
        if (!t || !t.closest) return false;
        return !!t.closest('.md-header .md-search, label[for="__search"], [for="__search"], input#__search, input.md-toggle[data-md-toggle="search"]');
      } catch (_) {
        return false;
      }
    };

    document.addEventListener('pointerdown', (e) => {
      if (isHeaderSearchTarget(e && e.target)) mark(1400);
    }, true);

    document.addEventListener('focusin', (e) => {
      const t = e && e.target;
      try {
        if (t && t.matches && t.matches('input[data-md-component="search-query"]') && t.closest('.md-header .md-search')) mark(1400);
      } catch (_) {}
    }, true);

    document.addEventListener('keydown', (e) => {
      const t = e && e.target;
      try {
        if (t && t.matches && t.matches('input[data-md-component="search-query"]') && t.closest('.md-header .md-search')) {
          mark((t.value || '').trim() ? 320 : 1200);
        }
      } catch (_) {}
    }, true);
  }

  function hasRecentHeaderSearchInteraction(ms) {
    try {
      const last = Number(window.__mkHeaderSearchUserTouchTs || 0);
      const graceUntil = Number(window.__mkFindHeaderSearchGraceUntil || 0);
      if (graceUntil > Date.now()) return true;
      return last > 0 && (Date.now() - last) < Math.max(240, Number(ms) || 0);
    } catch (_) {
      return false;
    }
  }

  function isHeaderSearchBusy() {
    try {
      const activeEl = document.activeElement;
      if (activeEl && activeEl.matches && activeEl.matches('input[data-md-component="search-query"]') && activeEl.closest('.md-header .md-search')) return true;
      if (activeEl && activeEl.closest && activeEl.closest('.md-header .md-search')) return true;

      const activeShell = document.querySelector('.md-header .md-search.md-search--active');
      if (activeShell) return true;

      const toggle =
        document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
        document.querySelector('input#__search');
      if (toggle && toggle.checked) return true;

      return hasRecentHeaderSearchInteraction(1400);
    } catch (_) {
      return hasRecentHeaderSearchInteraction(1400);
    }
  }

  function closeMaterialSearchOverlayFast() {
    if (isHeaderSearchBusy()) return;

    const toggle =
      document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
      document.querySelector('input#__search');
    if (toggle) toggle.checked = false;

    const input = document.querySelector('input[data-md-component="search-query"]');
    if (input) {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      try { input.blur(); } catch (_) {}
    }

    const list = document.querySelector(".md-search-result__list");
    if (list) list.style.removeProperty("display");
  }

  function fbForceClearTopSearchBarNow() {
    try {
      const toggles = Array.from(document.querySelectorAll(
        'input.md-toggle[data-md-toggle="search"], input#__search'
      ));
      toggles.forEach((toggle) => {
        try { toggle.checked = false; } catch (_) {}
      });

      const headerInputs = Array.from(document.querySelectorAll('input[data-md-component="search-query"]'));
      headerInputs.forEach((input) => {
        try {
          input.value = "";
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          input.removeAttribute && input.removeAttribute("value");
        } catch (_) {}
        try { input.blur && input.blur(); } catch (_) {}
      });

      const activeShells = Array.from(document.querySelectorAll('.md-header .md-search.md-search--active, .md-search.md-search--active'));
      activeShells.forEach((el) => {
        try { el.classList.remove('md-search--active'); } catch (_) {}
      });

      const overlay = document.querySelector('.md-search__overlay');
      if (overlay && overlay.style) {
        overlay.style.display = "";
        overlay.style.pointerEvents = "";
      }

      const list = document.querySelector('.md-search-result__list');
      if (list) list.style.removeProperty('display');
    } catch (_) {}
  }

  function fbForceClearTopSearchBarSoon() {
    const delays = [0, 40, 140, 320, 700];
    delays.forEach((ms) => {
      window.setTimeout(() => {
        try { fbForceClearTopSearchBarNow(); } catch (_) {}
      }, ms);
    });
  }


  // ----------------------------
  // Same-page top search bridge
  // ----------------------------
  // Problem fixed here: when the user is already on Find, pressing Enter in the
  // header search must NOT route to Find again. It should only inject the typed
  // query into the token pool + panel and run the search in-place.
  function fbIsMaterialHeaderSearchInput(el) {
    try {
      if (!el || !el.matches) return false;
      if (!/^input$/i.test(el.tagName || "")) return false;
      if (el.closest && el.closest('#find-builder, #search-form, .fb-tokensearch-wrap')) return false;

      const type = String(el.getAttribute('type') || '').toLowerCase();
      if (type && type !== 'search' && type !== 'text') return false;

      const shell = el.closest && el.closest('.md-search, .md-header');
      const hasMaterialMarker = el.matches('input[data-md-component="search-query"]');
      const classLooksRight = el.matches('input.md-search__input, input[type="search"]');
      const nameLooksRight = el.matches('input[name="q"], input[name="query"], input[name="search"]');
      const textLooksRight = (() => {
        try {
          const ph = String(el.getAttribute('placeholder') || '').toLowerCase();
          const aria = String(el.getAttribute('aria-label') || '').toLowerCase();
          const role = String(el.getAttribute('role') || '').toLowerCase();
          return role === 'searchbox' || ph.includes('search') || aria.includes('search');
        } catch (_) { return false; }
      })();

      return !!(hasMaterialMarker || (shell && (classLooksRight || nameLooksRight || textLooksRight)));
    } catch (_) {
      return false;
    }
  }

  function fbGetHeaderSearchInputFromEvent(ev) {
    try {
      const target = ev && ev.target;
      if (fbIsMaterialHeaderSearchInput(target)) return target;
      const active = document.activeElement;
      if (fbIsMaterialHeaderSearchInput(active)) return active;
      if (target && target.closest) {
        const shell = target.closest('.md-search, .md-header');
        if (shell) {
          const input = shell.querySelector('input[data-md-component="search-query"], input.md-search__input, input[type="search"], input[name="q"], input[name="query"]');
          if (fbIsMaterialHeaderSearchInput(input)) return input;
        }
      }
    } catch (_) {}
    return null;
  }

  function fbStopTopSearchEnterEvent(ev) {
    try { ev.preventDefault(); } catch (_) {}
    try { ev.stopPropagation(); } catch (_) {}
    try { if (ev && ev.stopImmediatePropagation) ev.stopImmediatePropagation(); } catch (_) {}
  }

  function fbMarkSameFindTopSearchHandled(ms) {
    const until = Date.now() + Math.max(1600, Number(ms) || 0);
    try { window.__findHeaderSamePageHandledUntilV8 = until; } catch (_) {}
    // Keep v7 name too, because search-enter.js already checks that flag.
    try { window.__findHeaderSamePageHandledUntilV7 = until; } catch (_) {}
    try { window.__findHeaderEnterSuppressUntilV8 = until; } catch (_) {}
    try { window.__findHeaderEnterSuppressUntilV6 = until; } catch (_) {}
    try { window.__mkFindSamePageTopSearchUntil = until; } catch (_) {}
    try { window.__rkCancelPreloadForFindSamePage && window.__rkCancelPreloadForFindSamePage('find-builder'); } catch (_) {}
  }

  function fbClearHeaderSearchInputForSamePage(input) {
    try {
      const inputs = input ? [input] : Array.from(document.querySelectorAll('input[data-md-component="search-query"], .md-search input[type="search"], .md-header input[type="search"]'));
      inputs.forEach((el) => {
        try { el.value = ""; } catch (_) {}
        try { el.dispatchEvent(new Event("input", { bubbles: true })); } catch (_) {}
        try { el.dispatchEvent(new Event("change", { bubbles: true })); } catch (_) {}
        try { el.blur && el.blur(); } catch (_) {}
      });
    } catch (_) {}
    try { fbForceClearTopSearchBarSoon(); } catch (_) {}
  }

  function fbSamePageTopSearch(raw, opts) {
    const q = String(raw || "").trim().replace(/\s+/g, " ");
    if (!q || !isOnFindPage()) return false;
    fbMarkSameFindTopSearchHandled(3200);
    try { sessionStorage.removeItem("find_pending_token_v2"); } catch (_) {}
    try { sessionStorage.removeItem("find_pending_token_v1"); } catch (_) {}
    try { sessionStorage.removeItem("__find_autoflow_ran_v2__"); } catch (_) {}
    try { sessionStorage.removeItem("__se_find_autofill_nonce_v2__"); } catch (_) {}
    // In-place flow. No page transition and no preload gate.
    fbAutofillFromTopSearch(q, Object.assign({ samePage: true, noFx: true }, opts || {}));
    return true;
  }

  function fbInstallSameFindTopSearchBridge() {
    try { window.__mkFindAutofillFromTopSearch = fbSamePageTopSearch; } catch (_) {}

    if (window.__fbSameFindTopSearchEnterGuardV1) return;
    window.__fbSameFindTopSearchEnterGuardV1 = true;

    const onEnterCapture = (ev) => {
      try {
        if (!isOnFindPage()) return;
        if (!ev || ev.key !== "Enter") return;
        if (ev.isComposing || ev.keyCode === 229) return;
        const input = fbGetHeaderSearchInputFromEvent(ev);
        if (!input) return;
        const q = String(input.value || "").trim().replace(/\s+/g, " ");
        if (!q) return;
        fbStopTopSearchEnterEvent(ev);
        fbMarkSameFindTopSearchHandled(3200);
        fbClearHeaderSearchInputForSamePage(input);
        fbSamePageTopSearch(q, { source: "find-builder-enter" });
      } catch (_) {}
    };

    const onLateEnterCapture = (ev) => {
      try {
        if (!ev || ev.key !== "Enter") return;
        if (Date.now() >= Number(window.__findHeaderEnterSuppressUntilV8 || 0)) return;
        if (!fbGetHeaderSearchInputFromEvent(ev)) return;
        fbStopTopSearchEnterEvent(ev);
      } catch (_) {}
    };

    window.addEventListener("keydown", onEnterCapture, true);
    document.addEventListener("keydown", onEnterCapture, true);
    window.addEventListener("keypress", onLateEnterCapture, true);
    window.addEventListener("keyup", onLateEnterCapture, true);

    const onSubmitCapture = (ev) => {
      try {
        if (!isOnFindPage()) return;
        const form = ev && ev.target;
        if (!form || !form.querySelector) return;
        if (form.closest && form.closest('#find-builder, #search-form, .fb-tokensearch-wrap')) return;
        const input = form.querySelector('input[data-md-component="search-query"], input.md-search__input, input[type="search"], input[name="q"], input[name="query"]') || document.activeElement;
        if (!fbIsMaterialHeaderSearchInput(input)) return;
        const q = String(input.value || "").trim().replace(/\s+/g, " ");
        if (!q) return;
        fbStopTopSearchEnterEvent(ev);
        fbMarkSameFindTopSearchHandled(3200);
        fbClearHeaderSearchInputForSamePage(input);
        if (!fbConsumeGuestAction("search", { query: q, source: "find-builder-header-submit", dedupeMs: 2500 })) return;
        fbSamePageTopSearch(q, { source: "find-builder-submit" });
      } catch (_) {}
    };

    window.addEventListener("submit", onSubmitCapture, true);
    document.addEventListener("submit", onSubmitCapture, true);
  }

  // Remove MkDocs Material "speech bubble" styling leaking into find page content.
  // (That bubble adds a grey background + little corner/arrow via ::before.)
    // Remove MkDocs Material "speech bubble" styling leaking into the Find page.
  // Some markup on find page reuses Material's `.md-search__output`, which has a grey background + a little
  // corner/arrow via ::before/::after (very visible in light mode). We neutralize ONLY the bubble that contains
  // #search-form / #find-builder (never the real header search overlay).
  function ensureFindSpeechBubbleFix() {
    if (!document.getElementById("mk-find-bubble-fix-style-v2")) {
      const st = document.createElement("style");
      st.id = "mk-find-bubble-fix-style-v2";
      st.textContent = `
        body.mk-find-page .mk-find-output-wrap,
        body.mk-find-page .mk-find-output-wrap.md-search__output,
        body.mk-find-page .mk-find-output-wrap.md-search__scrollwrap,
        body.mk-find-page .mk-find-output-wrap .md-search__output{
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          filter: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        body.mk-find-page .mk-find-output-wrap::before,
        body.mk-find-page .mk-find-output-wrap::after,
        body.mk-find-page .mk-find-output-wrap.md-search__output::before,
        body.mk-find-page .mk-find-output-wrap.md-search__output::after{
          display:none !important;
          content:none !important;
        }
      `;
      document.head.appendChild(st);
    }

    const form = document.getElementById("search-form");
    const fb = document.getElementById("find-builder");
    const seeds = [form, fb].filter(Boolean);

    const mark = (el) => {
      if (!el || !el.classList) return;

      // Skip the real header search overlay (it contains Material's search query input)
      try {
        if (el.querySelector && el.querySelector('input[data-md-component="search-query"]')) return;
      } catch (_) {}

      el.classList.add("mk-find-output-wrap");

      // Kill the arrow by removing Material's bubble classes (safe for content area)
      if (el.classList.contains("md-search__output")) el.classList.remove("md-search__output");

      try {
        el.style.background = "transparent";
        el.style.boxShadow = "none";
        el.style.border = "0";
        el.style.padding = "0";
        el.style.margin = "0";
      } catch (_) {}
    };

    // Walk up from the seeds and mark the first bubble-ish wrapper we find
    for (const s of seeds) {
      let p = s;
      let hop = 0;
      while (p && p !== document.body && hop++ < 14) {
        if (p.classList && (p.classList.contains("md-search__output") || p.classList.contains("md-search__scrollwrap"))) {
          mark(p);
          break;
        }
        p = p.parentElement;
      }
    }

    // Fallback: mark any output wrapper that contains our widgets
    try {
      const outs = Array.from(document.querySelectorAll(".md-search__output, .md-search__scrollwrap"));
      for (const out of outs) {
        if (!out || !out.contains) continue;
        if ((form && out.contains(form)) || (fb && out.contains(fb))) mark(out);
      }
    } catch (_) {}
  }


  // Desktop wide layout: reuse the exact same page-level layout hook as Trending.
  // Trending gets its PC width from the global `body.trending-page` rules, not from
  // a 100vw child. Find should join that same page mode and avoid extra width math here.
  function ensureFindWideLayoutStyles() {
    // Clean up the two earlier Find-only width attempts. This is important with
    // Material instant navigation, where old <style> nodes can stay in <head>.
    [
      "mk-find-wide-layout-style-v1",
      "mk-find-wide-layout-style-v2",
      "mk-find-wide-layout-style-v3"
    ].forEach((id) => {
      try {
        const old = document.getElementById(id);
        if (old && old.parentNode) old.parentNode.removeChild(old);
      } catch (_) {}
    });

    let st = document.getElementById("mk-find-trending-layout-bridge-v1");
    if (!st) {
      st = document.createElement("style");
      st.id = "mk-find-trending-layout-bridge-v1";
      (document.head || document.documentElement).appendChild(st);
    }

    st.textContent = `
      /* Do not define page width here. The width is inherited from the same
         global .trending-page layout rules used by Trending itself. */
      body.mk-find-page.trending-page .md-sidebar--secondary,
      body.mk-find-page.trending-page [data-md-component="toc"]{
        display: none !important;
      }

      body.mk-find-page.trending-page .search-hero,
      body.mk-find-page.trending-page #find-builder,
      body.mk-find-page.trending-page #search-results{
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
      }

      body.mk-find-page.trending-page #search-form.fb-find-form,
      body.mk-find-page.trending-page #search-form.fb-find-form .fb-addtoken-bar{
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
      }

      body.mk-find-page.trending-page #search-form.fb-find-form .fb-addtoken-actions{
        min-width: 0;
      }

      body.mk-find-page.trending-page #search-form.fb-find-form .fb-addtoken-actions .fb-cta__txt{
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `;
  }

  // Mobile layout polish (Find page panel)
  function ensureFindMobileUiStyles() {
    // Always update (instant navigation keeps old <style> nodes alive)
    let st = document.getElementById('mk-find-mobile-style-v1');
    if (!st) {
      st = document.createElement('style');
      st.id = 'mk-find-mobile-style-v1';
      document.head.appendChild(st);
    }
    st.textContent = `

      /* Keep the overall form/panels on their normal width.
         Only the desktop token input itself is widened below. */
      #search-form.fb-find-form,
      #find-builder .fb-panel{
        width: 100%;
        max-width: 100%;
        margin-left: 0;
        margin-right: 0;
        box-sizing: border-box;
      }
      #find-builder .fb-panel{
        padding-left: 10px;
        padding-right: 10px;
      }
      #find-builder .fb-board__inner{
        padding-left: 12px;
        padding-right: 12px;
      }

      /* Button icons (Clear / Undo / Redo) */
      #find-builder .fb-btn__ico{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width: 1.15em;
        height: 1.15em;
        margin-right: .45em;
        flex: 0 0 auto;
        position: relative;
        top: -0.02em;
      }
      #find-builder .fb-btn__ico svg{
        width: 1.15em;
        height: 1.15em;
        display:block;
      }
      html[data-md-color-scheme="slate"] #find-builder .fb-btn__ico,
      body[data-md-color-scheme="slate"] #find-builder .fb-btn__ico,
      html[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg,
      body[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg{
        color: rgba(255,255,255,.96) !important;
      }
      html[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg path,
      html[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg circle,
      html[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg rect,
      html[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg line,
      html[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg polyline,
      html[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg polygon,
      html[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg ellipse,
      body[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg path,
      body[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg circle,
      body[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg rect,
      body[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg line,
      body[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg polyline,
      body[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg polygon,
      body[data-md-color-scheme="slate"] #find-builder .fb-btn__ico svg ellipse{
        fill: currentColor !important;
        stroke: currentColor !important;
      }
      html[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg,
      html[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg *,
      html[data-md-color-scheme="slate"] #find-builder #fb-undo .fb-btn__ico svg,
      html[data-md-color-scheme="slate"] #find-builder #fb-undo .fb-btn__ico svg *,
      html[data-md-color-scheme="slate"] #find-builder #fb-redo .fb-btn__ico svg,
      html[data-md-color-scheme="slate"] #find-builder #fb-redo .fb-btn__ico svg *,
      html[data-md-color-scheme="slate"] #find-builder #fb-run .fb-btn__ico svg,
      html[data-md-color-scheme="slate"] #find-builder #fb-run .fb-btn__ico svg *,
      body[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg,
      body[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg *,
      body[data-md-color-scheme="slate"] #find-builder #fb-undo .fb-btn__ico svg,
      body[data-md-color-scheme="slate"] #find-builder #fb-undo .fb-btn__ico svg *,
      body[data-md-color-scheme="slate"] #find-builder #fb-redo .fb-btn__ico svg,
      body[data-md-color-scheme="slate"] #find-builder #fb-redo .fb-btn__ico svg *,
      body[data-md-color-scheme="slate"] #find-builder #fb-run .fb-btn__ico svg,
      body[data-md-color-scheme="slate"] #find-builder #fb-run .fb-btn__ico svg *{
        color: #fff !important;
        fill: currentColor !important;
        stroke: currentColor !important;
        opacity: 1 !important;
      }
      html[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg,
      html[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg *,
      body[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg,
      body[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg *{
        color: #fff !important;
        fill: none !important;
        opacity: 1 !important;
      }
      html[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg [stroke],
      body[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg [stroke]{
        stroke: currentColor !important;
      }
      html[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg [fill="none"],
      body[data-md-color-scheme="slate"] #find-builder #fb-clear .fb-btn__ico svg [fill="none"]{
        fill: none !important;
      }
      #find-builder .fb-btn__txt{ display:inline-block; }

      /* Clear tokens uses the exact same inline SVG trash icon language as the panel Clear button.
         Do not replace it with a CSS mask: the previous mask only contained the lid + bars,
         which made the left trash icon look broken in slate mode. */
      #find-builder #fb-clear-tokens .fb-clear__x{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width: 1.15em;
        height: 1.15em;
        margin-right: .45em;
        flex: 0 0 auto;
        position: relative;
        top: -0.02em;
        color: currentColor;
      }
      #find-builder #fb-clear-tokens .fb-clear__x svg{
        width: 1.15em;
        height: 1.15em;
        display:block !important;
        color: currentColor !important;
        fill: none !important;
        stroke: currentColor !important;
        opacity: 1 !important;
      }
      #find-builder #fb-clear-tokens .fb-clear__x svg *,
      #find-builder #fb-clear-tokens .fb-clear__x svg path,
      #find-builder #fb-clear-tokens .fb-clear__x svg circle,
      #find-builder #fb-clear-tokens .fb-clear__x svg rect,
      #find-builder #fb-clear-tokens .fb-clear__x svg line,
      #find-builder #fb-clear-tokens .fb-clear__x svg polyline,
      #find-builder #fb-clear-tokens .fb-clear__x svg polygon,
      #find-builder #fb-clear-tokens .fb-clear__x svg ellipse{
        fill: none !important;
        stroke: currentColor !important;
        opacity: 1 !important;
      }
      #find-builder #fb-clear-tokens .fb-clear__x::before,
      #find-builder #fb-clear-tokens .fb-clear__x::after{
        display:none !important;
        content:none !important;
      }
      html[data-md-color-scheme="slate"] #find-builder #fb-clear-tokens .fb-clear__x,
      body[data-md-color-scheme="slate"] #find-builder #fb-clear-tokens .fb-clear__x,
      html[data-md-color-scheme="slate"] #find-builder #fb-clear-tokens .fb-clear__x svg,
      body[data-md-color-scheme="slate"] #find-builder #fb-clear-tokens .fb-clear__x svg{
        color:#fff !important;
        filter:none !important;
      }

      @media (max-width: 720px) {
        /* Make Run search CTA match the Add token CTA height */
        #find-builder .fb-cta-btn{ min-height: 46px; padding: 10px 14px; }
        #find-builder .fb-actions__right{ flex: 0 0 auto; }
        #find-builder #fb-run.fb-cta-btn{ width: auto; }

        /* Tokens header: keep Clear tokens on the same row, right aligned (mobile unchanged) */
        #find-builder .fb-tokens__head{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
        #find-builder .fb-tokens__head{ margin-bottom: .35rem; }
        #find-builder .fb-tokens__title{ margin:0; }
        #find-builder .fb-tokens__clear{ margin-left:auto; }
      }

      @media (min-width: 721px) {
        /* Desktop: Token pool and Query panel sit side by side: 1/3 + 2/3. */
        #find-builder{
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) !important;
          gap: 14px !important;
          align-items: stretch !important;
        }
        #find-builder > #fb-fuzzy-note{
          grid-column: 1 / -1 !important;
        }
        #find-builder > .fb-panel--pool{
          grid-column: 1 !important;
        }
        #find-builder > .fb-panel--board{
          grid-column: 2 !important;
        }

        /* Clear tokens belongs to the pool box itself, not to the token flow.
           Keep it pinned to the container's bottom-right even when neighbouring
           panel height changes. Do not touch individual token close buttons. */
        #find-builder .fb-panel--pool{
          position: relative !important;
          margin-bottom: 0 !important;
          padding-bottom: 5.15rem !important;
        }
        #find-builder .fb-panel--pool .fb-tokens__row{
          display: block !important;
        }
        #find-builder .fb-panel--pool .fb-tokens__list{
          min-width: 0;
          padding-bottom: .25rem;
        }
        #find-builder #fb-clear-tokens.fb-tokens__clear{
          position: absolute !important;
          right: 12px !important;
          bottom: 12px !important;
          margin: 0 !important;
          white-space: nowrap;
          z-index: 2;
        }
      }

      /* Tokens section moved above board: use outer panel spacing (avoid extra height inside pool box) */
      #find-builder .fb-tokens{ margin-bottom: 0; }

      /* Token pool box: slightly shorter */
      #find-builder .fb-panel--pool{ padding: 10px 12px; }
      #find-builder .fb-panel--pool .fb-tokens{ margin: 0 !important; }
      #find-builder .fb-panel--pool .fb-tokens__head{ margin-bottom: .25rem !important; }

      /* Token pool / panel titles: section heading (non-interactive) */
      #find-builder .fb-tokens__title,
      #find-builder .fb-panel__title{
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 800;
        font-size: .95rem;
        letter-spacing: .01em;
        text-transform: none !important;
        opacity: .92;
        cursor: default;
        user-select: none;
        pointer-events: none;
        margin: 0;
      }
      /* remove the little blue square */
      #find-builder .fb-tokens__title::before,
      #find-builder .fb-panel__title::before{
        display:none !important;
        content:none !important;
      }
      /* panel title row */
      #find-builder .fb-panel__head{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin: 0 0 .55rem;
      }
      /* Ghost text: match page body typography (exactly inherit from surrounding typeset) */
      #find-builder .fb-board__placeholder,
      #find-builder .fb-tokens__empty,
      #find-builder .fb-ghost__hint{
        font: inherit !important;
        font-size: var(--md-typeset-font-size, inherit) !important;
        line-height: var(--md-typeset-line-height, inherit) !important;
        font-weight: 400 !important;
        letter-spacing: normal !important;
        text-transform: none !important;
      }

      /* When the query has real chips, keep the hidden empty-state example in
         the grid only as a height reference. This prevents the Query panel from
         shrinking after the first token is added. */
      #find-builder .fb-board__inner.has-expr{
        display: grid !important;
        align-items: center !important;
        justify-items: center !important;
      }
      #find-builder .fb-board__inner.has-expr > .fb-board__line,
      #find-builder .fb-board__inner.has-expr > .fb-board__placeholder--height-ghost{
        grid-area: 1 / 1 !important;
      }
      #find-builder .fb-board__inner.has-expr > .fb-board__line{
        position: relative;
        z-index: 2;
      }
      #find-builder .fb-board__placeholder--height-ghost{
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        user-select: none !important;
        filter: none !important;
      }

      /* Ghost example chips: match real chips (shape / size / weight) */
      #find-builder .fb-ghost__chip{
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: .35rem !important;

        padding: .40rem .90rem !important;
        border-radius: 999px !important;

        border: 1px solid rgba(255,255,255,.18) !important;
        background: rgba(255,255,255,.06) !important;
        color: rgba(255,255,255,.92) !important;

        font-weight: 750 !important;
        line-height: 1 !important;
        text-transform: none !important;
        letter-spacing: normal !important;
        user-select: none !important;
      }
      #find-builder .fb-ghost__term{
        background: rgba(99,102,241,.22) !important;
        border-color: rgba(99,102,241,.55) !important;
      }
      #find-builder .fb-ghost__op{
        background: rgba(16,185,129,.20) !important;
        border-color: rgba(16,185,129,.55) !important;
        letter-spacing: .08em !important;
        text-transform: uppercase !important;
      }
      #find-builder .fb-ghost__paren{
        background: rgba(59,130,246,.18) !important;
        border-color: rgba(59,130,246,.45) !important;
        border-style: dashed !important;
      }

      /* Operator buttons (AND/OR/()): match panel chip sizing/shape/typography.
         Keep the existing color scheme + hover rules from extra.css. */
      #find-builder .fb-actions__mid .fb-btn--op{
        border-radius: 999px !important;
        padding: .32rem .72rem !important; /* 80% */
        font-weight: 750 !important;
        font-size: .80rem !important; /* 80% */
        line-height: 1 !important;
      }
/* Fallback: force operator button sizing by id (in case external CSS overrides) */
#find-builder #fb-and.fb-btn--op,
#find-builder #fb-or.fb-btn--op,
#find-builder #fb-lp.fb-btn--op,
#find-builder #fb-rp.fb-btn--op{
  border-radius: 999px !important;
  padding: .32rem .72rem !important;
  font-weight: 750 !important;
  font-size: .80rem !important;
  line-height: 1 !important;
}

      #find-builder #fb-and.fb-btn--op,
      #find-builder #fb-or.fb-btn--op{
        letter-spacing: .08em !important;
        text-transform: uppercase !important;
      }
      #find-builder #fb-lp.fb-btn--op,
      #find-builder #fb-rp.fb-btn--op{
        border-style: dashed !important;
      }

      /* === Scale logic chips (AND/OR/() ) everywhere to 80% (panel + ghost + buttons) === */
      /* Panel chips */
      #find-builder .fb-chip--op,
      #find-builder .fb-chip--paren{
        font-size: .80rem !important;
        padding: .32rem .72rem !important;
        border-radius: 999px !important;
        line-height: 1 !important;
      }
      /* Keep the close button proportional */
      #find-builder .fb-chip--op .fb-chip__x,
      #find-builder .fb-chip--paren .fb-chip__x{
        transform: scale(.80);
        transform-origin: center;
      }
      /* Ghost chips (only op/paren; terms stay original size) */
      #find-builder .fb-ghost__op,
      #find-builder .fb-ghost__paren{
        font-size: .80rem !important;
        padding: .32rem .72rem !important;
      }

      /* Action row op buttons (AND/OR/()): match scaled chip size */
      #find-builder .fb-btn--op{
        font-size: .80rem !important;
        padding: .32rem .72rem !important;
        min-height: 26px !important;
        line-height: 1 !important;
        border-radius: 999px !important;
        font-weight: 750 !important;
      }

      /* Light mode overrides for ghost chips */
      [data-md-color-scheme="default"] #find-builder .fb-ghost__chip{
        border: 1px solid rgba(15,23,42,.18) !important;
        background: rgba(15,23,42,.04) !important;
        color: rgba(15,23,42,.92) !important;
      }
      [data-md-color-scheme="default"] #find-builder .fb-ghost__term{
        background: rgba(99,102,241,.18) !important;
        border-color: rgba(99,102,241,.45) !important;
      }
      [data-md-color-scheme="default"] #find-builder .fb-ghost__op{
        background: rgba(16,185,129,.16) !important;
        border-color: rgba(16,185,129,.45) !important;
      }
      [data-md-color-scheme="default"] #find-builder .fb-ghost__paren{
        background: rgba(59,130,246,.14) !important;
        border-color: rgba(59,130,246,.45) !important;
      }

      /* --- Find page: split Add token into two buttons (layout only) --- */
#search-form.fb-find-form{
  max-width: 100%;
  box-sizing: border-box;
}
#search-form.fb-find-form .fb-addtoken-bar{
  display:flex;
  align-items:center;
  gap: 12px;
  flex-wrap: nowrap;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
#search-form.fb-find-form .fb-addtoken-bar > *{ min-width: 0; }
#search-form.fb-find-form .fb-addtoken-bar #search-input{
  flex: 1 1 auto;
  min-width: 0;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box;
}
#search-form.fb-find-form .fb-addtoken-actions{
  display:flex;
  gap: 12px;
  flex: 0 0 auto;
  align-items:center;
  justify-content: flex-end;
  margin-left: auto;               /* ✅ keep both buttons flush right */
  max-width: 100%;
  box-sizing: border-box;
}
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn{
  white-space: nowrap;
  flex: 0 0 auto;
  min-width: 0;
}
@media (min-width: 721px) {
  #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-wrap{
    flex: 0 1 clamp(30rem, 38vw, 34rem);
    width: clamp(30rem, 38vw, 34rem);
    min-width: min(30rem, 100%);
    max-width: 100%;
  }
  #search-form.fb-find-form .fb-addtoken-actions{
    margin-left: 12px;
  }
}

/* Prevent accidental text selection highlight inside CTA buttons (Safari/iOS/desktop can draw a box around label text) */
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn,
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn *{
  user-select: none !important;
  -webkit-user-select: none !important;
  -webkit-touch-callout: none !important;
}
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn,
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn *{
  -webkit-tap-highlight-color: transparent !important;
}
#search-form.fb-find-form .fb-addtoken-actions .fb-cta__txt{
  display:inline-flex !important;
  align-items:center !important;
  outline: none !important;
  border: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  text-decoration: none !important;
}
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn,
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn *,
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn:focus,
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn:focus-visible,
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn:active,
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn:hover{
  text-decoration: none !important;
  outline: none !important;
}

#search-form.fb-find-form .fb-addtoken-actions .fb-cta__txt,
#search-form.fb-find-form .fb-addtoken-actions .fb-cta__ico{
  pointer-events: none;
}

/* Remove focus outlines (some browsers draw a rectangle around the label text) */

#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn{ -webkit-appearance: none; appearance: none; }
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn:focus,
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn:focus-visible{
  box-shadow: none !important;

  outline: none !important;
  box-shadow: none !important;
}
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn::-moz-focus-inner{
  border: 0 !important;
}



@media (pointer: coarse) {
  /* Mobile: input takes the first row; two add buttons sit on the second row */
  #search-form.fb-find-form .fb-addtoken-bar{
    flex-wrap: wrap;
    align-items: stretch;
    gap: 10px;
  }

  #search-form.fb-find-form .fb-addtoken-bar #search-input{
    flex: 1 0 100%;
    width: 100% !important;
    max-width: 100% !important;
  }

  #search-form.fb-find-form .fb-addtoken-actions{
    flex: 1 0 100%;
    display: grid;
    grid-template-columns: minmax(0, 0.80fr) minmax(0, 1.20fr);
    margin-left: 0;
    align-items: stretch;
    justify-content: stretch;
    gap: 6px; /* reduce outer blank space between the two buttons */
  }

  #search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn{
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 46px;
    padding: 0 8px !important;   /* reduce inner blank space */
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box;
    font-size: clamp(.90rem, 3.7vw, .96rem);
    line-height: 1.18 !important; /* fix clipped descenders like p/g/y */
  }

  #search-form.fb-find-form .fb-addtoken-actions > :first-child,
  #search-form.fb-find-form .fb-addtoken-actions > :last-child{
    justify-self: stretch;
    margin-left: 0;
  }

  /* hide the + icon on mobile to save width */
  #search-form.fb-find-form .fb-addtoken-actions .fb-cta__ico{
    display: none !important;
  }

  #search-form.fb-find-form .fb-addtoken-actions .fb-cta__txt{
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;
    text-align: center;
    font-size: inherit;
    line-height: 1.18 !important;  /* same fix for text itself */
    letter-spacing: -.01em;
  }
}

#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn,
#search-form.fb-find-form .fb-addtoken-actions .fb-cta__txt{
  line-height: 1.18 !important;
}

/* Light mode: Run search text/icon should be black */
body[data-md-color-scheme="default"] #find-builder #fb-run{
  color: #000 !important;
}

/* Undo/Redo bump (panel "time shift") */
#find-builder.fb-undo-bump .fb-board__inner{ animation: fbUndoBump 220ms cubic-bezier(.22,1,.36,1) 1; }
#find-builder.fb-redo-bump .fb-board__inner{ animation: fbRedoBump 220ms cubic-bezier(.22,1,.36,1) 1; }
@keyframes fbUndoBump{ 0%{ transform: translateX(0); } 45%{ transform: translateX(-8px); } 100%{ transform: translateX(0); } }
@keyframes fbRedoBump{ 0%{ transform: translateX(0); } 45%{ transform: translateX(8px); } 100%{ transform: translateX(0); } }

/* Split token pool and panel into two separate rounded boxes */
#find-builder .fb-panel--pool{ margin-bottom: 14px; }
#find-builder .fb-panel--pool .fb-tokens{ margin-top: 0 !important; }

/* Run search cinematic FX (non-flashy):
   - Only affect the BOARD rectangle (the big dashed rounded rect)
   - Board goes clear -> very blurry/mixed -> clear (continuous)
   - Results start as chaotic blur, then continuously wake to crisp
*/
#find-builder.fb-dream-active .fb-board{
  overflow: hidden;
  will-change: filter;
}

/* Results: "chaos" state (applied immediately on Run), then JS animates to crisp */
#search-results.fb-preblur{
  position: relative;
}
/* Apply chaos only to the real list area (NOT the action/sort bars) */
#search-results.fb-preblur .csr-cols,
#search-results.fb-preblur .csr-list,
#search-results.fb-preblur .csr-foot{
  will-change: filter, opacity, transform;
  filter: blur(30px) saturate(3.0) contrast(1.40) brightness(1.08);
  opacity: .12;
  transform: scale(1.01);
}
/* Empty-state hint: delayed reveal after dissolve (more noticeable) */
#find-builder .fb-hint{
  will-change: opacity, transform, filter;
}
#find-builder .fb-hint--pending{
  opacity: 0 !important;
  pointer-events: none !important;
  transform: translateY(10px) scale(.985);
  filter: blur(10px);
}
#find-builder .fb-hint--reveal{
  animation: fbHintReveal 520ms cubic-bezier(.16,1,.22,1) 1;
}
@keyframes fbHintReveal{
  0%{ opacity:0; transform: translateY(10px) scale(.985); filter: blur(10px); }
  60%{ opacity:1; transform: translateY(-1px) scale(1.01); filter: blur(2px); }
  100%{ opacity:1; transform: translateY(0) scale(1); filter: blur(0); }
}




`;
    document.head.appendChild(st);
  }

  function focusPanelSoon() {
    window.setTimeout(() => {
      const slot = document.querySelector("#find-builder .fb-slot.is-cursor");
      if (slot && slot.focus) {
        try { slot.focus(); } catch (_) {}
        return;
      }
      const board = document.querySelector("#find-builder .fb-board__inner");
      if (board && board.focus) {
        try { board.focus(); } catch (_) {}
      }
    }, 0);
  }

  function readJsonFrom(storage, key, fallback) {
    try {
      const raw = storage.getItem(key);
      if (!raw) return fallback;
      const v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch {
      return fallback;
    }
  }

  function writeJsonTo(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {}
  }


// ----------------------------
// Animations: fly-to-target + FLIP layout reflow
// - Purely cosmetic: does NOT change any search logic.
// - Respects prefers-reduced-motion.
// ----------------------------
function fbPrefersReducedMotion() {
  try {
    if (window.MkSiteMotion && typeof window.MkSiteMotion.isReduced === "function") {
      return !!window.MkSiteMotion.isReduced();
    }
  } catch (_) {}
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (_) {
    return false;
  }
}

function fbEnsureFlyStyles() {
  if (document.getElementById("fb-fly-style-v1")) return;
  const st = document.createElement("style");
  st.id = "fb-fly-style-v1";
  st.textContent = `
    .fb-fly-layer{
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2147483000;
    }
    .fb-fly-ghost{
      position: fixed;
      left: 0; top: 0;
      transform: translate(-50%, -50%);
      will-change: transform, opacity;
      pointer-events: none;
      user-select: none;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.22);
      background: rgba(120, 100, 220, .22);
      color: inherit;
      box-shadow: 0 18px 40px rgba(0,0,0,.28);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      font-weight: 750;
      font-size: 14px;
      line-height: 1;
      white-space: nowrap;
    }
    .fb-fly-ghost.is-hidden{ opacity: 0; }
    .fb-fly-pulse{
      animation: fbFlyPulse .38s cubic-bezier(.2,.9,.2,1) 1;
    }
    .fb-evaporate-ghost{
      will-change: transform, opacity;
      contain: layout paint style;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transform: translate3d(-50%, -50%, 0);
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      box-shadow: 0 10px 24px rgba(0,0,0,.16);
      filter: none;
    }
    @keyframes fbFlyPulse{
      0%{ transform: scale(1); }
      55%{ transform: scale(1.08); }
      100%{ transform: scale(1); }
    }
  `;
  document.head.appendChild(st);
}

function fbGetFlyLayer() {
  fbEnsureFlyStyles();
  let layer = document.querySelector(".fb-fly-layer");
  if (layer) return layer;
  layer = document.createElement("div");
  layer.className = "fb-fly-layer";
  document.body.appendChild(layer);
  return layer;
}

function fbRectCenter(r) {
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function fbInputStartPoint(inputEl) {
  try {
    if (!inputEl) return null;
    const r = inputEl.getBoundingClientRect();
    const cs = window.getComputedStyle ? window.getComputedStyle(inputEl) : null;
    const pl = cs ? parseFloat(cs.paddingLeft || "0") || 0 : 0;
    // Start where typed text begins (left padding + a small nudge)
    const x = r.left + Math.min(r.width - 10, Math.max(10, pl + 8));
    const y = r.top + r.height / 2;
    return { x, y };
  } catch (_) {
    return null;
  }
}

function fbBezierQuad(p0, p1, p2, t) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function fbPickGhostStyleSource() {
  // Prefer a TERM chip (board), then a token button (pool)
  return (
    document.querySelector("#find-builder .fb-chip--term") ||
    document.querySelector("#find-builder .fb-tokenbtn") ||
    null
  );
}

function fbCreateFlyGhost(text, styleSourceEl) {
  const layer = fbGetFlyLayer();
  const ghost = document.createElement("div");
  ghost.className = "fb-fly-ghost";
  ghost.textContent = String(text || "").trim();

  const srcEl = styleSourceEl || fbPickGhostStyleSource();
  if (srcEl && window.getComputedStyle) {
    try {
      const cs = getComputedStyle(srcEl);
      // Copy only what makes it look consistent
      ghost.style.fontFamily = cs.fontFamily;
      ghost.style.fontSize = cs.fontSize;
      ghost.style.fontWeight = cs.fontWeight;
      ghost.style.letterSpacing = cs.letterSpacing;
      ghost.style.padding = cs.padding;
      ghost.style.borderRadius = cs.borderRadius;
      // Use explicit longhands so we don't lose operator (green) styling in some browsers
      ghost.style.backgroundColor = cs.backgroundColor;
      ghost.style.backgroundImage = cs.backgroundImage;
      ghost.style.backgroundRepeat = cs.backgroundRepeat;
      ghost.style.backgroundPosition = cs.backgroundPosition;
      ghost.style.backgroundSize = cs.backgroundSize;
      ghost.style.color = cs.color;
      ghost.style.borderColor = cs.borderColor;
      ghost.style.borderWidth = cs.borderWidth;
      ghost.style.borderStyle = cs.borderStyle;
      ghost.style.boxShadow = cs.boxShadow;
      ghost.style.backdropFilter = cs.backdropFilter;
      ghost.style.webkitBackdropFilter = cs.webkitBackdropFilter;
    } catch (_) {}
  }

  layer.appendChild(ghost);
  return ghost;
}

function fbAnimateGhost(ghost, fromPt, toPt, opts) {
  const duration = Math.max(180, Math.min(900, Number(opts && opts.duration) || 420));
  const delay = Math.max(0, Number(opts && opts.delay) || 0);

  if (!ghost) return Promise.resolve();

  // Position at start
  ghost.style.left = fromPt.x + "px";
  ghost.style.top = fromPt.y + "px";

  // Compute a pleasant arc control point
  const dx = toPt.x - fromPt.x;
  const dy = toPt.y - fromPt.y;

  const control = {
    x: fromPt.x + dx * 0.45,
    y: fromPt.y + dy * 0.25 - 60, // lift
  };

  const mid1 = fbBezierQuad(fromPt, control, toPt, 0.55);
  const mid2 = fbBezierQuad(fromPt, control, toPt, 0.82);

  const base = "translate(-50%, -50%)";
  const kf = [
    { transform: `${base} translate(0px, 0px) scale(1)`, opacity: 1, offset: 0 },
    // small "hop"
    { transform: `${base} translate(${dx * 0.06}px, -18px) scale(1.10)`, opacity: 1, offset: 0.14 },
    // arc midpoints
    { transform: `${base} translate(${mid1.x - fromPt.x}px, ${mid1.y - fromPt.y}px) scale(1.04)`, opacity: 1, offset: 0.58 },
    { transform: `${base} translate(${mid2.x - fromPt.x}px, ${mid2.y - fromPt.y}px) scale(1.01)`, opacity: 1, offset: 0.82 },
    { transform: `${base} translate(${dx}px, ${dy}px) scale(1)`, opacity: 1, offset: 1 },
  ];

  // Prefer WAAPI when available (smooth & doesn't require manual cleanup)
  if (ghost.animate) {
    const anim = ghost.animate(kf, {
      duration,
      delay,
      easing: "cubic-bezier(.22, 1, .36, 1)",
      fill: "forwards",
    });
    return anim.finished
      .catch(() => {})
      .then(() => {});
  }

  // Fallback: no animation API -> jump
  ghost.style.left = toPt.x + "px";
  ghost.style.top = toPt.y + "px";
  return Promise.resolve();
}

function fbCaptureBoardChipRects() {
  const map = new Map();
  try {
    document.querySelectorAll("#find-builder .fb-chip[data-fb-node]").forEach((el) => {
      const k = el.getAttribute("data-fb-node") || "";
      if (!k) return;
      map.set(k, el.getBoundingClientRect());
    });
  } catch (_) {}
  return map;
}

function fbPlayBoardFlip(firstMap) {
  if (!firstMap || !firstMap.size) return;
  if (fbPrefersReducedMotion()) return;

  // Next frame: apply inverted transforms then animate to 0
  requestAnimationFrame(() => {
    try {
      const els = Array.from(document.querySelectorAll("#find-builder .fb-chip[data-fb-node]"));
      for (const el of els) {
        const k = el.getAttribute("data-fb-node") || "";
        const first = firstMap.get(k);
        if (!first) continue;

        const last = el.getBoundingClientRect();
        const dx = first.left - last.left;
        const dy = first.top - last.top;

        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;

        el.style.willChange = "transform";
        el.style.transition = "transform 0s";
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        // force
        el.getBoundingClientRect();
        el.style.transition = "transform 420ms cubic-bezier(.22, 1, .36, 1)";
        el.style.transform = "translate(0px, 0px)";

        el.addEventListener(
          "transitionend",
          () => {
            el.style.transition = "";
            el.style.transform = "";
            el.style.willChange = "";
          },
          { once: true }
        );
      }
    } catch (_) {}
  });
}

function fbFindTokenButtonByText(token) {
  const t = String(token || "").trim();
  if (!t) return null;
  try {
    const items = Array.from(document.querySelectorAll("#find-builder .fb-tokenbtn__text"));
    for (const it of items) {
      if ((it.textContent || "").trim() === t) {
        return it.closest(".fb-tokenbtn");
      }
    }
  } catch (_) {}
  return null;
}

function fbFindBoardChipByNodeId(nodeId) {
  const id = String(nodeId || "").trim();
  if (!id) return null;
  try {
    const esc = (window.CSS && typeof window.CSS.escape === "function") ? window.CSS.escape(id) : id.replace(/"/g, '\\"');
    const els = Array.from(document.querySelectorAll(`#find-builder .fb-chip[data-fb-node="${esc}"]`));
    if (els.length) {
      // If a stale duplicate id somehow survived, the new animated chip is the hidden one.
      return els.find((el) => {
        try {
          const cs = window.getComputedStyle ? window.getComputedStyle(el) : null;
          return (el.style && (el.style.visibility === "hidden" || el.style.opacity === "0")) ||
            (cs && (cs.visibility === "hidden" || cs.opacity === "0"));
        } catch (_) { return false; }
      }) || els[els.length - 1];
    }
  } catch (_) {
    try {
      const els = Array.from(document.querySelectorAll("#find-builder .fb-chip[data-fb-node]"))
        .filter((el) => (el.getAttribute("data-fb-node") || "") === id);
      if (els.length) return els.find((el) => el.style && (el.style.visibility === "hidden" || el.style.opacity === "0")) || els[els.length - 1];
    } catch (_) {}
  }
  return null;
}

function fbPulse(el) {
  if (!el) return;
  try {
    el.classList.remove("fb-fly-pulse");
    // force
    void el.offsetWidth;
    el.classList.add("fb-fly-pulse");
    window.setTimeout(() => el.classList.remove("fb-fly-pulse"), 420);
  } catch (_) {}
}

function fbAnimTokenKey(tok) {
  return String(tok || "").trim().replace(/\s+/g, " ");
}

function fbRevealAnimTokenNow(tok) {
  const key = fbAnimTokenKey(tok);
  if (!key) return false;
  let changed = false;
  try {
    if (state.animHideTokens && state.animHideTokens.delete(key)) changed = true;
  } catch (_) {}
  try {
    const btn = fbFindTokenButtonByText(key);
    const wrap = btn && btn.closest ? btn.closest(".fb-tokenwrap") : null;
    if (wrap) {
      wrap.style.opacity = "";
      wrap.style.visibility = "";
      wrap.style.transform = "";
      changed = true;
    }
  } catch (_) {}
  return changed;
}

function fbRevealAnimNodeNow(nodeId) {
  const id = String(nodeId || "").trim();
  if (!id) return false;
  let changed = false;
  try {
    if (state.animHideNodeIds && state.animHideNodeIds.delete(id)) changed = true;
  } catch (_) {}
  try {
    const chip = fbFindBoardChipByNodeId(id);
    if (chip) {
      chip.style.opacity = "";
      chip.style.visibility = "";
      chip.style.transform = "";
      changed = true;
    }
  } catch (_) {}
  return changed;
}

function fbScheduleAnimRevealFallback(tokens, nodeIds, delayMs) {
  const tks = (Array.isArray(tokens) ? tokens : []).map(fbAnimTokenKey).filter(Boolean);
  const ids = (Array.isArray(nodeIds) ? nodeIds : []).map((x) => String(x || "").trim()).filter(Boolean);
  if (!tks.length && !ids.length) return;
  window.setTimeout(() => {
    let changed = false;
    for (const t of tks) {
      if (fbRevealAnimTokenNow(t)) changed = true;
    }
    for (const id of ids) {
      if (fbRevealAnimNodeNow(id)) changed = true;
    }
    if (changed) {
      try { render(); } catch (_) {}
    }
  }, Math.max(520, Number(delayMs) || 1400));
}

function fbRunAddTokenAnimations(plan) {
  if (!plan) return;

  const startPt = plan.startPt || (plan.startRect ? fbRectCenter(plan.startRect) : null);

  // 1) Fly NEW tokens from input to their pool chip (parallel with slight stagger)
  const newTokens = Array.isArray(plan.newTokens) ? plan.newTokens.filter(Boolean) : [];
  const maxPool = plan.mode === "insert" ? 1 : Math.min(3, newTokens.length);
  const poolTokens = startPt ? newTokens.slice(0, maxPool) : [];
  const insertIdsForFallback = plan.mode === "insert"
    ? (Array.isArray(plan.insertNodeIds) ? plan.insertNodeIds.slice(0, 2) : [])
    : [];

  // Safety net: animation targets are hidden only for the ghost effect. If WAAPI is
  // interrupted, a DOM lookup misses, or several tokens are inserted at once, reveal them anyway.
  fbScheduleAnimRevealFallback(poolTokens, insertIdsForFallback, 1450);

  if (fbPrefersReducedMotion()) {
    fbScheduleAnimRevealFallback(poolTokens, insertIdsForFallback, 10);
    // Still do FLIP (already gated) and return
    fbPlayBoardFlip(plan.boardFirst);
    return;
  }

  // Board reflow (if insert happened)
  try { fbPlayBoardFlip(plan.boardFirst); } catch (_) {}

  if (startPt && poolTokens.length) {
    poolTokens.forEach((tok, i) => {
      window.setTimeout(async () => {
        const destBtn = fbFindTokenButtonByText(tok);
        if (!destBtn) {
          fbRevealAnimTokenNow(tok);
          return;
        }

        // If the token is newly created, keep the real destination invisible until the ghost arrives
        try {
          const w = destBtn.closest && destBtn.closest(".fb-tokenwrap");
          if (w) { w.style.opacity = "0"; w.style.visibility = "hidden"; }
        } catch (_) {}

        const destPt = fbRectCenter(destBtn.getBoundingClientRect());
        const ghost = fbCreateFlyGhost(tok, fbPickGhostStyleSource());
        await fbAnimateGhost(ghost, startPt, destPt, { duration: 420, delay: 0 });
        try { ghost.remove(); } catch (_) {}
        try {
          const w = destBtn.closest && destBtn.closest(".fb-tokenwrap");
          if (w) { w.style.opacity = ""; w.style.visibility = ""; w.style.transform=""; }
        } catch (_) {}
        try { if (state.animHideTokens) state.animHideTokens.delete(String(tok||"").trim().replace(/\s+/g," ")); } catch (_) {}
        fbPulse(destBtn);
      }, i * 70);
    });
  }

  
// 2) If "Add to pool & panel": after the pool hop, also fly clone(s) from pool -> board chip
if (plan.mode === "insert") {
  const toks = Array.isArray(plan.insertTokens) ? plan.insertTokens.filter(Boolean) : [];
  const ids = Array.isArray(plan.insertNodeIds) ? plan.insertNodeIds : [];
  const max = Math.min(2, toks.length, ids.length); // keep total < 1s

  window.setTimeout(() => {
    for (let i = 0; i < max; i++) {
      const tok = toks[i];
      const nodeId = ids[i];

      window.setTimeout(async () => {
        const poolBtn = fbFindTokenButtonByText(tok) || null;
        const chipEl = fbFindBoardChipByNodeId(nodeId) || null;
        if (!poolBtn || !chipEl) {
          fbRevealAnimNodeNow(nodeId);
          return;
        }

        const fromPt = fbRectCenter(poolBtn.getBoundingClientRect());
        const toPt = fbRectCenter(chipEl.getBoundingClientRect());

        // Hide the freshly inserted chip until the ghost arrives
        try { chipEl.style.opacity = "0"; chipEl.style.visibility="hidden"; } catch (_) {}

        const ghost2 = fbCreateFlyGhost(tok, poolBtn);
        await fbAnimateGhost(ghost2, fromPt, toPt, { duration: 420, delay: 0 });
        try { ghost2.remove(); } catch (_) {}
        try { chipEl.style.opacity = ""; chipEl.style.visibility=""; } catch (_) {}
        try { if (state.animHideNodeIds) state.animHideNodeIds.delete(String(nodeId||"")); } catch (_) {}
        fbPulse(chipEl);
      }, i * 60);
    }
  }, 440);
}
}

function fbRunPoolTokenInsertAnimation(opts) {
  if (!opts) return;
  fbScheduleAnimRevealFallback([], opts.nodeId ? [opts.nodeId] : [], 1100);
  if (fbPrefersReducedMotion()) {
    fbRevealAnimNodeNow(opts.nodeId);
    fbPlayBoardFlip(opts.boardFirst);
    return;
  }
  try { fbPlayBoardFlip(opts.boardFirst); } catch (_) {}

  if (!opts.fromRect || !opts.nodeId || !opts.token) {
    fbRevealAnimNodeNow(opts && opts.nodeId);
    return;
  }

  window.setTimeout(async () => {
    const chipEl = fbFindBoardChipByNodeId(opts.nodeId);
    if (!chipEl) {
      fbRevealAnimNodeNow(opts.nodeId);
      return;
    }

    const fromPt = fbRectCenter(opts.fromRect);
    const toPt = fbRectCenter(chipEl.getBoundingClientRect());
    try { chipEl.style.opacity = "0"; chipEl.style.visibility="hidden"; } catch (_) {}

    const ghost = fbCreateFlyGhost(opts.token, chipEl);
    await fbAnimateGhost(ghost, fromPt, toPt, { duration: 420 });
    try { ghost.remove(); } catch (_) {}
    try { chipEl.style.opacity = ""; chipEl.style.visibility=""; } catch (_) {}
    try { if (state.animHideNodeIds) state.animHideNodeIds.delete(String(opts.nodeId||"")); } catch (_) {}
    fbPulse(chipEl);
  }, 40);
}


// ----------------------------
// Fast evaporation helpers (for Clear tokens / Clear panel)
// - Replaces the older shard/clip-path animation.
// - One lightweight ghost per element, transform + opacity only in bulk mode.
// - This keeps Clear tokens smooth even when the token pool is large.
// ----------------------------
let __fbEvapBurstAt = 0;
let __fbEvapBurstCount = 0;

function fbCreateEvaporateGhost(text, styleSourceEl, opts) {
  const layer = fbGetFlyLayer();
  const ghost = document.createElement("div");
  ghost.className = "fb-fly-ghost fb-evaporate-ghost";
  ghost.textContent = String(text || "").trim();

  const srcEl = styleSourceEl || fbPickGhostStyleSource();
  if (srcEl && window.getComputedStyle) {
    try {
      const cs = getComputedStyle(srcEl);
      ghost.style.fontFamily = cs.fontFamily;
      ghost.style.fontSize = cs.fontSize;
      ghost.style.fontWeight = cs.fontWeight;
      ghost.style.letterSpacing = cs.letterSpacing;
      ghost.style.lineHeight = cs.lineHeight;
      ghost.style.padding = cs.padding;
      ghost.style.borderRadius = cs.borderRadius;
      ghost.style.backgroundColor = cs.backgroundColor;
      ghost.style.backgroundImage = cs.backgroundImage;
      ghost.style.color = cs.color;
      ghost.style.borderColor = cs.borderColor;
      ghost.style.borderWidth = cs.borderWidth;
      ghost.style.borderStyle = cs.borderStyle;
      ghost.style.boxShadow = "0 10px 24px rgba(0,0,0,.16)";
    } catch (_) {}
  }

  // Avoid expensive inherited glass/backdrop effects. The old version copied these and
  // then created 18-22 clipped ghosts per chip, which was the FPS killer on Clear all.
  try {
    ghost.style.backdropFilter = "none";
    ghost.style.webkitBackdropFilter = "none";
    ghost.style.filter = "none";
    ghost.style.pointerEvents = "none";
    ghost.style.userSelect = "none";
    ghost.style.contain = "layout paint style";
  } catch (_) {}

  layer.appendChild(ghost);
  return ghost;
}

function fbDissolveFromElement(el, opts) {
  if (!el) return;
  if (fbPrefersReducedMotion()) return;

  const text = String((opts && opts.text) || (el.textContent || "")).trim();
  if (!text) return;

  let r = null;
  try { r = el.getBoundingClientRect(); } catch (_) {}
  if (!r || !r.width || !r.height) return;

  const now = (window.performance && performance.now) ? performance.now() : Date.now();
  if (!__fbEvapBurstAt || now - __fbEvapBurstAt > 90) {
    __fbEvapBurstAt = now;
    __fbEvapBurstCount = 0;
  }
  const burstIndex = __fbEvapBurstCount++;

  // Once many chips are being cleared in one burst, use the cheapest possible animation.
  const explicitBulk = !!(opts && opts.bulk);
  const bulkMode = explicitBulk || burstIndex > 32;
  const duration = Math.max(320, Math.min(760, Number(opts && opts.duration) || (bulkMode ? 430 : 580)));
  const c = fbRectCenter(r);

  const ghost = fbCreateEvaporateGhost(text, el, opts);
  ghost.style.left = c.x + "px";
  ghost.style.top = c.y + "px";

  const dx = (Math.random() - 0.5) * (bulkMode ? 28 : 54);
  const dy = -18 - Math.random() * (bulkMode ? 28 : 46);
  const scale = bulkMode ? 0.92 : 0.86;
  const base = "translate3d(-50%, -50%, 0)";

  const kf = bulkMode
    ? [
        { offset: 0, transform: `${base} translate3d(0px, 0px, 0) scale(1)`, opacity: 1 },
        { offset: .42, transform: `${base} translate3d(${(dx * .35).toFixed(2)}px, ${(dy * .42).toFixed(2)}px, 0) scale(.98)`, opacity: .55 },
        { offset: 1, transform: `${base} translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale})`, opacity: 0 }
      ]
    : [
        { offset: 0, transform: `${base} translate3d(0px, 0px, 0) scale(1)`, opacity: 1, filter: "blur(0px)" },
        { offset: .36, transform: `${base} translate3d(${(dx * .30).toFixed(2)}px, ${(dy * .38).toFixed(2)}px, 0) scale(1.01)`, opacity: .68, filter: "blur(.8px)" },
        { offset: .72, transform: `${base} translate3d(${(dx * .72).toFixed(2)}px, ${(dy * .76).toFixed(2)}px, 0) scale(.94)`, opacity: .22, filter: "blur(3px)" },
        { offset: 1, transform: `${base} translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale})`, opacity: 0, filter: "blur(6px)" }
      ];

  if (ghost.animate) {
    const anim = ghost.animate(kf, {
      duration,
      easing: "cubic-bezier(.16, 1, .22, 1)",
      fill: "forwards",
    });
    anim.finished.catch(() => {}).then(() => { try { ghost.remove(); } catch (_) {} });
  } else {
    try {
      ghost.style.transition = `transform ${duration}ms cubic-bezier(.16,1,.22,1), opacity ${duration}ms ease`;
      requestAnimationFrame(() => {
        ghost.style.transform = `${base} translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale})`;
        ghost.style.opacity = "0";
      });
    } catch (_) {}
    window.setTimeout(() => { try { ghost.remove(); } catch (_) {} }, duration + 80);
  }
}

function fbDissolveMany(els, opts) {
  const arr = Array.isArray(els) ? els : [];
  if (!arr.length) return;
  const bulk = arr.length > 24;
  for (const el of arr) fbDissolveFromElement(el, Object.assign({}, opts || {}, { bulk: bulk || !!(opts && opts.bulk) }));
}


// ----------------------------
// Empty-state hint suppression helpers
// ----------------------------
const FB_DISSOLVE_MS_DEFAULT = 620;
const FB_HINT_DELAY_AFTER_DISSOLVE_MS = 160;

function fbSuppressEmptyHints(opts) {
  const o = opts || {};
  const delayMs = Math.max(0, Number(o.delayMs) || 0);
  const until = Date.now() + delayMs;
  if (o.pool) state.suppressPoolHintUntil = Math.max(state.suppressPoolHintUntil || 0, until);
  if (o.board) state.suppressBoardHintUntil = Math.max(state.suppressBoardHintUntil || 0, until);
  fbQueueHintReveal();
}

function fbQueueHintReveal() {
  try { if (state.__hintRevealTimer) window.clearTimeout(state.__hintRevealTimer); } catch (_) {}
  const now = Date.now();
  const waits = [];
  if (now < (state.suppressPoolHintUntil || 0)) waits.push(state.suppressPoolHintUntil - now);
  if (now < (state.suppressBoardHintUntil || 0)) waits.push(state.suppressBoardHintUntil - now);
  if (!waits.length) return;
  const ms = Math.max(0, Math.min(...waits)) + 5;
  state.__hintRevealTimer = window.setTimeout(fbRevealEmptyHints, ms);
}

function fbRevealEmptyHints() {
  const fb = document.getElementById("find-builder");
  if (!fb) return;

  const now = Date.now();

  function reveal(nodes) {
    try {
      Array.from(nodes || []).forEach((el) => {
        try {
          el.classList.remove("fb-hint--pending");
          // Restart the reveal animation reliably
          el.classList.remove("fb-hint--reveal");
          void el.offsetHeight;
          el.classList.add("fb-hint--reveal");
          window.setTimeout(() => { try { el.classList.remove("fb-hint--reveal"); } catch (_) {} }, 620);
        } catch (_) {}
      });
    } catch (_) {}
  }

  if (now >= (state.suppressPoolHintUntil || 0)) {
    const poolHints = fb.querySelectorAll('[data-fb-empty-hint="pool"].fb-hint--pending');
    reveal(poolHints);
    state.suppressPoolHintUntil = 0;
  }

  if (now >= (state.suppressBoardHintUntil || 0)) {
    const boardHints = fb.querySelectorAll('[data-fb-empty-hint="board"].fb-hint--pending');
    reveal(boardHints);
    state.suppressBoardHintUntil = 0;
  }

  // If something is still pending, queue again
  fbQueueHintReveal();
}


// ----------------------------
// Run-search FX: "mix" the panel, and reveal results from blur -> clear.
// ----------------------------
let __fbRunFxObs = null;
let __fbRunFxTimers = [];
let __fbRunFxBoardAnim = null;
let __fbRunFxResAnims = [];
function fbStopRunSearchFxNow() {
  try { if (__fbRunFxObs) __fbRunFxObs.disconnect(); } catch (_) {}
  __fbRunFxObs = null;

  try { (__fbRunFxTimers || []).forEach((t) => clearTimeout(t)); } catch (_) {}
  __fbRunFxTimers = [];

  try { if (__fbRunFxBoardAnim) __fbRunFxBoardAnim.cancel(); } catch (_) {}
  __fbRunFxBoardAnim = null;

  try { (__fbRunFxResAnims || []).forEach((a) => { try { a.cancel(); } catch (_) {} }); } catch (_) {}
  __fbRunFxResAnims = [];

  try {
    const fb = document.getElementById("find-builder");
    const board = fb ? fb.querySelector(".fb-board") : null;
    const res = document.getElementById("search-results");

    if (fb) fb.classList.remove("fb-dream-active");
    if (res) {
      res.classList.remove("fb-preblur");
      Array.from(res.querySelectorAll(".csr-cols, .csr-list, .csr-foot")).forEach((el) => {
        el.style.filter = "";
        el.style.opacity = "";
        el.style.transform = "";
      });
    }
    if (board) board.style.filter = "";

    Array.from(document.querySelectorAll("#find-builder .fb-chip[data-fb-node]")).forEach((el) => {
      el.style.transition = "";
      el.style.transform = "";
      el.style.willChange = "";
      el.classList.remove("fb-fly-pulse");
    });

    const flyLayer = document.querySelector(".fb-fly-layer");
    if (flyLayer) flyLayer.remove();
  } catch (_) {}
}

window.addEventListener("mk:site-motion-change", () => {
  try {
    if (fbPrefersReducedMotion()) {
      fbStopRunSearchFxNow();
      let needsRender = false;
      try {
        if (state && state.animHideTokens && state.animHideTokens.size) {
          state.animHideTokens.clear();
          needsRender = true;
        }
        if (state && state.animHideNodeIds && state.animHideNodeIds.size) {
          state.animHideNodeIds.clear();
          needsRender = true;
        }
      } catch (_) {}
      if (needsRender) render();
    }
  } catch (_) {}
});

function fbStartRunSearchFx() {
  // v8: no-op. The old effect created a 1s+ full-page blur on mobile when Find was opened from tabs or refreshed.
  try { fbClearNoBlurResidueV8(); } catch (_) {}
  return;
}







  function readTokens() {
    let arr = readJsonFrom(sessionStorage, TOKENS_KEY, null);
    if (arr == null) arr = readJsonFrom(localStorage, TOKENS_KEY, []);

    const norm = (s) => String(s || "").trim().replace(/\s+/g, " ");
    const out = Array.isArray(arr)
      ? arr
          .filter(Boolean)
          .map(norm)
          .filter(Boolean)
          .filter((t) => !fbIsGarbageToken(t))
      : [];

    // Self-heal if polluted
    try {
      const raw2 = JSON.stringify(out);
      const rawSess = sessionStorage.getItem(TOKENS_KEY) || "";
      const rawLoc = localStorage.getItem(TOKENS_KEY) || "";
      if ((rawSess && rawSess !== raw2) || (rawLoc && rawLoc !== raw2)) {
        writeTokens(out);
      }
    } catch (_) {}

    return out;
  }

  function writeTokens(tokens) {
    writeJsonTo(sessionStorage, TOKENS_KEY, tokens || []);
    writeJsonTo(localStorage, TOKENS_KEY, tokens || []);
  }

  function readExpr() {
  let v = readJsonFrom(sessionStorage, EXPR_KEY, null);
  if (v == null) v = readJsonFrom(localStorage, EXPR_KEY, []);
  return Array.isArray(v) ? v : [];
}

function writeExpr(expr) {
  writeJsonTo(sessionStorage, EXPR_KEY, expr || []);
  writeJsonTo(localStorage, EXPR_KEY, expr || []);
}


  function parseTokensFromInput(s) {
    const raw = String(s || "").trim();
    if (!raw) return [];
    // Support multi-word tokens: spaces are kept inside a token.
    // Use comma / newline / tab / semicolon as separators for multiple tokens.
    return raw
      .split(/[,，;\n\r\t]+/g)
      .map((x) => String(x || "").trim().replace(/\s+/g, " "))
      .filter(Boolean);
  }

  function addTokensToStorage(newTokens) {
    const curr = readTokens();
    const norm = (x) => String(x || "").trim().replace(/\s+/g, " ");
    const set = new Set(curr.map(norm));
    for (const t of newTokens) set.add(norm(t));
    const merged = Array.from(set);
    writeTokens(merged);
    return merged;
  }



  // ===== token input history + suggestions =====
  function fbReadTokenInputHistory() {
    try {
      const raw = localStorage.getItem(FB_TOKEN_INPUT_HISTORY_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr)
        ? arr.filter(Boolean).map((x) => String(x).trim()).filter(Boolean)
        : [];
    } catch (_) {
      return [];
    }
  }

  function fbWriteTokenInputHistory(arr) {
    try {
      localStorage.setItem(
        FB_TOKEN_INPUT_HISTORY_KEY,
        JSON.stringify(
          (arr || [])
            .map((x) => String(x || "").trim())
            .filter(Boolean)
            .slice(0, FB_TOKEN_INPUT_HISTORY_MAX)
        )
      );
    } catch (_) {}
  }

  function fbAddTokenInputHistory(raw) {
    const s = String(raw || "").trim().replace(/\s+/g, " ");
    if (!s) return;
    const curr = fbReadTokenInputHistory();
    const next = [s, ...curr.filter((x) => x.toLowerCase() !== s.toLowerCase())];
    fbWriteTokenInputHistory(next);
  }

  function fbRemoveTokenInputHistory(raw) {
    const s = String(raw || "").trim();
    if (!s) return;
    fbWriteTokenInputHistory(
      fbReadTokenInputHistory().filter((x) => x.toLowerCase() !== s.toLowerCase())
    );
  }

  function fbClearTokenInputHistory() {
    fbWriteTokenInputHistory([]);
  }

  function fbMarkTokenInputDropdownInteraction() {
    __fbTokenInputUi.suppressBlurHideUntil = Date.now() + 260;
  }

  function fbArmTokenInputPointerFocusLock(ms) {
    const until = Date.now() + Math.max(220, Number(ms) || 0);
    __fbTokenInputUi.pointerFocusUntil = Math.max(Number(__fbTokenInputUi.pointerFocusUntil || 0), until);
    fbMarkTokenInputDropdownInteraction();
  }

  function fbTokenInputPointerWasInsideWrap(wrap) {
    const target = __fbTokenInputUi.lastPointerDownTarget;
    if (!wrap || !target) return false;
    try {
      return !!(wrap.contains && wrap.contains(target));
    } catch (_) {
      return false;
    }
  }

  function fbRestoreTokenInputFocusSoon(delayMs) {
    const ms = Math.max(0, Number(delayMs) || 0);
    window.setTimeout(() => {
      const input = fbGetTokenInputEl();
      const wrap = fbGetTokenInputWrap();
      if (!input || !wrap) return;
      if (document.activeElement === input) {
        fbRefreshTokenInputUiSoon(0);
        return;
      }
      if (Date.now() >= Number(__fbTokenInputUi.pointerFocusUntil || 0)) return;
      if (!fbTokenInputPointerWasInsideWrap(wrap)) return;
      try { input.focus({ preventScroll: true }); } catch (_) { try { input.focus(); } catch (__){ } }
      if (document.activeElement !== input) return;
      try {
        const end = String(input.value || '').length;
        if (typeof input.setSelectionRange === 'function') input.setSelectionRange(end, end);
      } catch (_) {}
      fbRefreshTokenInputUiSoon(0);
    }, ms);
  }

  function fbGetTokenInputEl() {
    return document.getElementById("search-input");
  }

  function fbGetTokenInputWrap() {
    const input = fbGetTokenInputEl();
    return input && input.parentElement && input.parentElement.classList && input.parentElement.classList.contains("fb-tokensearch-wrap")
      ? input.parentElement
      : null;
  }

  function fbIsMobileTokenInputUi() {
    try {
      return !!(window.matchMedia && window.matchMedia("(max-width: 720px)").matches);
    } catch (_) {
      return false;
    }
  }

  let __fbTokenInputKeyboardLiftBound = false;
  let __fbTokenInputKeyboardLiftSeq = 0;
  let __fbTokenInputKeyboardLiftDoneSeq = 0;
  let __fbTokenInputKeyboardLiftTimer = 0;

  function fbNewTokenInputKeyboardLiftSession() {
    __fbTokenInputKeyboardLiftSeq += 1;
    __fbTokenInputKeyboardLiftDoneSeq = 0;
    if (__fbTokenInputKeyboardLiftTimer) {
      try { window.clearTimeout(__fbTokenInputKeyboardLiftTimer); } catch (_) {}
      __fbTokenInputKeyboardLiftTimer = 0;
    }
    return __fbTokenInputKeyboardLiftSeq;
  }

  function fbCancelTokenInputKeyboardLiftSession() {
    if (__fbTokenInputKeyboardLiftTimer) {
      try { window.clearTimeout(__fbTokenInputKeyboardLiftTimer); } catch (_) {}
      __fbTokenInputKeyboardLiftTimer = 0;
    }
    __fbTokenInputKeyboardLiftDoneSeq = __fbTokenInputKeyboardLiftSeq;
  }

  function fbEnsureTokenInputAboveKeyboardNow(input, opts) {
    const el = input || fbGetTokenInputEl();
    if (!el || !fbIsMobileTokenInputUi()) return false;

    try {
      if (el.offsetParent === null && document.activeElement !== el) return false;
    } catch (_) {}

    // One-shot mobile lift: do not attach a continuous tracker to the input.
    // The large margin gives the browser enough room above the virtual keyboard,
    // while the single scrollBy below prevents the repeated up/down correction loop.
    try { el.style.scrollMarginTop = "72px"; } catch (_) {}
    try { el.style.scrollMarginBottom = "min(48vh, 380px)"; } catch (_) {}

    let rect = null;
    try { rect = el.getBoundingClientRect(); } catch (_) {}
    if (!rect) return false;

    const margin = Math.max(22, Number(opts && opts.margin) || 34);
    const headerReserve = 76;
    let visibleTop = headerReserve;
    let visibleBottom = window.innerHeight || 0;

    try {
      if (window.visualViewport) {
        const vvTop = Number(window.visualViewport.offsetTop || 0);
        const vvBottom = vvTop + Number(window.visualViewport.height || visibleBottom);
        visibleTop = Math.max(headerReserve, vvTop + 12);
        visibleBottom = vvBottom;
      }
    } catch (_) {}

    if (!visibleBottom || visibleBottom <= visibleTop + 90) return false;

    const targetBottom = visibleBottom - margin;
    const targetTop = visibleTop + margin;
    let dy = 0;

    if (rect.bottom > targetBottom) {
      dy = rect.bottom - targetBottom;
    } else if (rect.top < targetTop) {
      dy = rect.top - targetTop;
    }

    if (Math.abs(dy) < 3) return false;

    try {
      window.scrollBy({ top: dy, left: 0, behavior: "auto" });
    } catch (_) {
      try { window.scrollBy(0, dy); } catch (__){ }
    }
    return true;
  }

  function fbScheduleTokenInputKeyboardLift(input, reason) {
    const el = input || fbGetTokenInputEl();
    if (!el || !fbIsMobileTokenInputUi()) return;

    const seq = __fbTokenInputKeyboardLiftSeq || fbNewTokenInputKeyboardLiftSession();

    // Once per focus lifecycle. After this has run, viewport scroll/resize or user
    // dragging the page must not trigger more corrections.
    if (__fbTokenInputKeyboardLiftDoneSeq === seq) return;
    if (__fbTokenInputKeyboardLiftTimer) return;

    const delay = reason === "viewport" ? 90 : 230;
    __fbTokenInputKeyboardLiftTimer = window.setTimeout(() => {
      __fbTokenInputKeyboardLiftTimer = 0;
      try {
        const nowInput = fbGetTokenInputEl();
        if (!nowInput) return;
        if (document.activeElement !== nowInput && document.activeElement !== el) return;
        if (__fbTokenInputKeyboardLiftDoneSeq === seq) return;
        fbEnsureTokenInputAboveKeyboardNow(nowInput, { reason });
        __fbTokenInputKeyboardLiftDoneSeq = seq;
      } catch (_) {
        __fbTokenInputKeyboardLiftDoneSeq = seq;
      }
    }, delay);
  }

  function fbBindTokenInputKeyboardLiftOnce() {
    if (__fbTokenInputKeyboardLiftBound) return;
    __fbTokenInputKeyboardLiftBound = true;

    const onViewportResize = () => {
      try {
        const input = fbGetTokenInputEl();
        if (!input || document.activeElement !== input) return;
        fbScheduleTokenInputKeyboardLift(input, "viewport");
      } catch (_) {}
    };

    try {
      if (window.visualViewport) {
        // Resize can indicate the keyboard became visible. Do not listen to
        // visualViewport.scroll: that fires while the user drags and caused the jitter.
        window.visualViewport.addEventListener("resize", onViewportResize, { passive: true });
      }
    } catch (_) {}
    try { window.addEventListener("orientationchange", () => fbCancelTokenInputKeyboardLiftSession(), { passive: true }); } catch (_) {}
  }

  function fbIsTokenInputBootGuardActive() {
    return fbIsMobileTokenInputUi() && Date.now() < Number(__fbTokenInputUi.bootGuardUntil || 0);
  }

  function fbShouldDeferTokenInputDropdown() {
    return fbIsMobileTokenInputUi() && Date.now() < Number(__fbTokenInputUi.mobileDropdownDeferUntil || 0);
  }

  function fbArmMobileTokenInputBootTap(ms) {
    if (!fbIsMobileTokenInputUi()) return;
    const now = Date.now();
    const lockMs = Math.max(420, Number(ms) || 0);
    __fbTokenInputUi.mobileBootTapUntil = Math.max(Number(__fbTokenInputUi.mobileBootTapUntil || 0), now + lockMs);
    __fbTokenInputUi.mobileFocusGraceUntil = Math.max(Number(__fbTokenInputUi.mobileFocusGraceUntil || 0), now + lockMs + 240);
    __fbTokenInputUi.mobileDropdownDeferUntil = Math.max(Number(__fbTokenInputUi.mobileDropdownDeferUntil || 0), now + Math.min(lockMs, 320));
    __fbTokenInputUi.pointerFocusUntil = Math.max(Number(__fbTokenInputUi.pointerFocusUntil || 0), now + lockMs + 120);
    __fbTokenInputUi.suppressBlurHideUntil = Math.max(Number(__fbTokenInputUi.suppressBlurHideUntil || 0), now + lockMs + 180);
  }


  let __fbTokenInputEnterAddLockUntil = 0;
  let __fbTokenInputKeepFocusUntil = 0;

  function fbMobileFocusTokenInputNow(input) {
    const el = input || fbGetTokenInputEl();
    if (!el) return false;
    try { if (el.disabled) el.disabled = false; } catch (_) {}
    try { el.removeAttribute && el.removeAttribute("readonly"); } catch (_) {}
    try { el.focus({ preventScroll: true }); } catch (_) { try { el.focus(); } catch (__){ } }
    try {
      const end = String(el.value || "").length;
      if (typeof el.setSelectionRange === "function") el.setSelectionRange(end, end);
    } catch (_) {}
    return document.activeElement === el;
  }

  function fbRequestTokenInputKeepFocus(ms) {
    const until = Date.now() + Math.max(700, Number(ms) || 0);
    __fbTokenInputKeepFocusUntil = Math.max(Number(__fbTokenInputKeepFocusUntil || 0), until);
    __fbTokenInputUi.pointerFocusUntil = Math.max(Number(__fbTokenInputUi.pointerFocusUntil || 0), until);
    __fbTokenInputUi.mobileFocusGraceUntil = Math.max(Number(__fbTokenInputUi.mobileFocusGraceUntil || 0), until);
    __fbTokenInputUi.suppressBlurHideUntil = Math.max(Number(__fbTokenInputUi.suppressBlurHideUntil || 0), until);
  }

  function fbRefocusTokenInputAfterAdd() {
    const delays = fbIsMobileTokenInputUi() ? [0, 16, 60, 140, 280] : [0, 40];
    delays.forEach((ms) => {
      window.setTimeout(() => {
        if (Date.now() >= Number(__fbTokenInputKeepFocusUntil || 0)) return;
        const input = fbGetTokenInputEl();
        if (!input) return;
        fbMobileFocusTokenInputNow(input);
        fbRefreshTokenInputUiSoon(0);
      }, ms);
    });
  }

  function fbBlurTokenInputAfterEnterAdd(input) {
    const el = input || fbGetTokenInputEl();

    // Cancel all mobile focus-retention locks that are useful while typing,
    // but wrong after Enter. Enter should add the token and leave the caret gone.
    __fbTokenInputKeepFocusUntil = 0;
    try { __fbTokenInputUi.pointerFocusUntil = 0; } catch (_) {}
    try { __fbTokenInputUi.mobileFocusGraceUntil = 0; } catch (_) {}
    try { __fbTokenInputUi.suppressBlurHideUntil = 0; } catch (_) {}
    try { window.__fbTokenInputEnterBlurUntilV4 = Date.now() + 1400; } catch (_) {}

    const blurOnce = () => {
      try { fbHideTokenInputDropdown(); } catch (_) {}
      try {
        const nowEl = el || fbGetTokenInputEl();
        if (nowEl && document.activeElement === nowEl && nowEl.blur) nowEl.blur();
      } catch (_) {}
    };

    [0, 16, 60, 140, 300, 620].forEach((ms) => window.setTimeout(blurOnce, ms));
    window.setTimeout(() => { try { focusPanelSoon(); } catch (_) {} }, 80);
  }

  function fbTriggerTokenInputEnterAddToPanel() {
    const input = fbGetTokenInputEl();
    if (!input) return false;
    const rawTokens = parseTokensFromInput(input.value);
    if (!rawTokens.length) return false;

    const now = Date.now();
    if (now < Number(__fbTokenInputEnterAddLockUntil || 0)) return true;
    __fbTokenInputEnterAddLockUntil = now + 650;

    const btn = document.getElementById("add-token");
    if (!btn) return false;
    try {
      btn.click();
      fbBlurTokenInputAfterEnterAdd(input);
      return true;
    } catch (_) {
      return false;
    }
  }


  function fbHandleTokenInputEnterKey(ev) {
    if (!ev || ev.key !== "Enter") return false;
    if (ev.isComposing || ev.keyCode === 229) return false;

    const input = fbGetTokenInputEl();
    const target = ev.target;
    if (!input || target !== input) return false;

    if (ev.__fbTokenInputEnterHandled) return true;
    try { ev.__fbTokenInputEnterHandled = true; } catch (_) {}

    // Critical: never allow Enter in the Find Builder token input to submit
    // #search-form or bubble into the global/header search handlers.
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();

    try { window.__fbTokenInputEnterBlurUntilV4 = Date.now() + 1400; } catch (_) {}

    const wrapNow = fbGetTokenInputWrap();
    const dd = wrapNow ? wrapNow.querySelector(".fb-tokensearch-dropdown") : null;
    const visible = !!(dd && dd.style.display !== "none" && dd.children.length);
    const items = Array.isArray(__fbTokenInputUi.items) ? __fbTokenInputUi.items : [];
    const rawIdx = Number(__fbTokenInputUi.activeIndex);
    const idx = Number.isFinite(rawIdx) ? rawIdx : -1;

    if (visible && idx >= 0 && items[idx] && items[idx].text) {
      fbApplyTokenInputChoice(items[idx].text);
      return true;
    }

    fbTriggerTokenInputEnterAddToPanel();
    fbBlurTokenInputAfterEnterAdd(input);
    return true;
  }

  function fbStopEnterEvent(ev) {
    try { ev.preventDefault(); } catch (_) {}
    try { ev.stopPropagation(); } catch (_) {}
    try { if (ev && ev.stopImmediatePropagation) ev.stopImmediatePropagation(); } catch (_) {}
  }

  function fbIsTokenInputEnterEvent(ev) {
    try {
      const input = fbGetTokenInputEl();
      return !!(ev && ev.key === "Enter" && input && ev.target === input);
    } catch (_) {
      return false;
    }
  }

  function fbSuppressLateTokenInputEnter(ev) {
    if (!fbIsTokenInputEnterEvent(ev)) return false;
    if (Date.now() >= Number(window.__fbTokenInputEnterSuppressUntilV3 || 0)) return false;
    fbStopEnterEvent(ev);
    return true;
  }

  function fbInstallTokenInputEnterGuard() {
    if (window.__fbTokenInputEnterGuardBoundV3) return;
    window.__fbTokenInputEnterGuardBoundV3 = true;

    const onKeydown = (ev) => {
      try {
        if (!fbIsTokenInputEnterEvent(ev)) return;
        window.__fbTokenInputEnterSuppressUntilV3 = Date.now() + 900;
        fbHandleTokenInputEnterKey(ev);
      } catch (_) {}
    };
    const onLate = (ev) => {
      try { fbSuppressLateTokenInputEnter(ev); } catch (_) {}
    };

    // Capture at window, not just document/input. Window capture runs before
    // Material/search-form handlers and prevents the native form submit reload.
    window.addEventListener("keydown", onKeydown, true);
    window.addEventListener("keypress", onLate, true);
    window.addEventListener("keyup", onLate, true);
    document.addEventListener("keydown", onKeydown, true);
  }

  function fbHandleSearchFormSubmit(ev) {
    try {
      const form = document.getElementById("search-form");
      if (!form || !ev || ev.target !== form) return false;
      fbStopEnterEvent(ev);
      window.__fbTokenInputEnterSuppressUntilV3 = Date.now() + 900;
      fbTriggerTokenInputEnterAddToPanel();
      return true;
    } catch (_) {
      return false;
    }
  }

  function fbInstallSearchFormSubmitGuard() {
    if (window.__fbSearchFormSubmitGuardBoundV1) return;
    window.__fbSearchFormSubmitGuardBoundV1 = true;
    window.addEventListener("submit", fbHandleSearchFormSubmit, true);
    document.addEventListener("submit", fbHandleSearchFormSubmit, true);
  }


  function fbSplitTokenInputForSuggest(raw) {
    const s = String(raw || "");
    const m = s.match(/^(.*(?:[,，;\n\r\t]\s*|\s+))(.*)$/);
    if (m) {
      return { prefix: m[1] || "", token: String(m[2] || "") };
    }
    return { prefix: "", token: s };
  }

  function fbNormaliseTokenInputValue(raw) {
    return String(raw || "").replace(/[\u00A0\u2007\u202F]/g, " ");
  }

  function fbTokenInputCanInline(rawToken) {
    const t = String(rawToken || "").trim();
    if (!t) return false;
    if (/[,，;\n\r\t]/.test(t)) return false;
    return !/[\^_{}\[\]()<>=:+*\/|]/.test(t);
  }

  async function fbGetTokenInputSuggestionItems(raw, maxItems) {
    const full = fbNormaliseTokenInputValue(raw);
    const parts = fbSplitTokenInputForSuggest(full);
    const typedTokenRaw = String(parts.token || "");
    const typedToken = typedTokenRaw.trim().replace(/\s+/g, " ");
    const prefix = String(parts.prefix || "");
    const limit = Math.max(4, Number(maxItems) || 8);

    const items = [];
    const seen = new Set();
    const push = (text, meta) => {
      const v = String(text || "").trim().replace(/\s+/g, " ");
      if (!v) return;
      const key = v.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ text: v, ...(meta || {}) });
    };

    if (!typedToken) {
      for (const h of fbReadTokenInputHistory()) {
        push(h, { kind: "history" });
        if (items.length >= limit) break;
      }
      return { items, inlineSuffix: "", inlineText: "" };
    }

    for (const h of fbReadTokenInputHistory()) {
      if (h.toLowerCase().includes(full.trim().toLowerCase())) {
        push(h, { kind: "history" });
        if (items.length >= Math.min(3, limit)) break;
      }
    }

    let inlineText = "";
    let inlineSuffix = "";
    const tokenLower = typedToken.toLowerCase();

    if (fbTokenInputCanInline(typedToken)) {
      try {
        const { list } = await fbBuildVocab();
        const prefixMatches = [];
        for (const entry of list || []) {
          const w = String((entry && entry.w) || "").trim();
          if (!w) continue;
          const wl = w.toLowerCase();
          if (!wl.startsWith(tokenLower) || wl === tokenLower) continue;
          prefixMatches.push({ w, f: Number((entry && entry.f) || 0) });
          if (prefixMatches.length >= 24) break;
        }
        prefixMatches.sort((a, b) => (b.f - a.f) || (a.w.length - b.w.length) || (a.w < b.w ? -1 : a.w > b.w ? 1 : 0));
        for (const hit of prefixMatches) {
          const outText = `${prefix}${hit.w}`;
          push(outText, { kind: "suggest", via: "prefix" });
          if (!inlineText) inlineText = outText;
          if (items.length >= limit) break;
        }
      } catch (_) {}
    }

    if ((!items.length || items.length < Math.min(5, limit)) && typedToken) {
      try {
        const suggestedToken = typeof fbSuggestToken === "function"
          ? await fbSuggestToken(typedToken)
          : await fbSuggestPhraseForAdd(typedToken);
        const s = String(suggestedToken || "").trim().replace(/\s+/g, " ");
        if (s && s.toLowerCase() !== tokenLower) {
          const fullText = `${prefix}${s}`;
          push(fullText, { kind: "suggest", via: "fuzzy" });
          if (!inlineText && s.toLowerCase().startsWith(tokenLower)) inlineText = fullText;
        }
      } catch (_) {}
    }

    if (!inlineText && items.length) {
      const first = String(items[0].text || "");
      const firstToken = first.startsWith(prefix) ? first.slice(prefix.length) : first;
      if (firstToken.toLowerCase().startsWith(tokenLower)) inlineText = first;
    }

    if (inlineText) {
      const from = `${prefix}${typedTokenRaw}`;
      if (inlineText.toLowerCase().startsWith(from.toLowerCase()) && inlineText.length > from.length) {
        inlineSuffix = inlineText.slice(from.length);
      }
    }

    return { items: items.slice(0, limit), inlineSuffix, inlineText };
  }

  function fbTokenInputSyncOverlayStyle(input, overlay) {
    if (!input || !overlay) return;
    try {
      const cs = window.getComputedStyle(input);
      overlay.style.font = cs.font;
      overlay.style.letterSpacing = cs.letterSpacing;
      overlay.style.paddingTop = cs.paddingTop;
      overlay.style.paddingRight = cs.paddingRight;
      overlay.style.paddingBottom = cs.paddingBottom;
      overlay.style.paddingLeft = cs.paddingLeft;
      overlay.style.textIndent = cs.textIndent;
      overlay.style.textTransform = cs.textTransform;
      overlay.style.lineHeight = cs.lineHeight;
    } catch (_) {}
  }

  function fbSetTokenInputActiveIndex(idx) {
    const wrap = fbGetTokenInputWrap();
    const dd = wrap ? wrap.querySelector(".fb-tokensearch-dropdown") : null;
    const rows = dd ? Array.from(dd.querySelectorAll(".fb-tokensearch-item")) : [];
    if (!rows.length) {
      __fbTokenInputUi.activeIndex = -1;
      return;
    }
    let next = Number.isFinite(idx) ? Math.trunc(idx) : -1;
    if (next < 0 || next >= rows.length) next = -1;
    __fbTokenInputUi.activeIndex = next;
    rows.forEach((row, i) => row.classList.toggle("is-active", i === next));
    if (next >= 0) {
      try { rows[next].scrollIntoView({ block: "nearest" }); } catch (_) {}
    }
  }

  function fbApplyTokenInputChoice(text) {
    const input = fbGetTokenInputEl();
    if (!input) return;
    const next = String(text || "").trim();
    if (!next) return;
    input.value = next;
    __fbTokenInputUi.lastApplied = next;
    try {
      input.focus();
      const end = next.length;
      if (typeof input.setSelectionRange === "function") input.setSelectionRange(end, end);
    } catch (_) {}
    fbHideTokenInputDropdown();
    fbRefreshTokenInputUiSoon(0);
  }

  function fbHideTokenInputDropdown() {
    const wrap = fbGetTokenInputWrap();
    if (!wrap) return;
    const dd = wrap.querySelector(".fb-tokensearch-dropdown");
    if (dd) {
      dd.style.display = "none";
      dd.innerHTML = "";
    }
    __fbTokenInputUi.dropdownPress = null;
    fbSetTokenInputActiveIndex(-1);
  }

  function fbTokenInputPointerPoint(ev) {
    try {
      const src = (ev && ev.touches && ev.touches[0]) || (ev && ev.changedTouches && ev.changedTouches[0]) || ev;
      if (!src) return null;
      return { x: Number(src.clientX || 0), y: Number(src.clientY || 0) };
    } catch (_) {
      return null;
    }
  }

  function fbArmTokenInputDropdownScrollGuard(ms) {
    const now = Date.now();
    const until = now + Math.max(240, Number(ms) || 0);
    __fbTokenInputUi.dropdownSuppressChoiceUntil = Math.max(
      Number(__fbTokenInputUi.dropdownSuppressChoiceUntil || 0),
      until
    );
    __fbTokenInputUi.suppressBlurHideUntil = Math.max(
      Number(__fbTokenInputUi.suppressBlurHideUntil || 0),
      until
    );
  }

  function fbStartTokenInputDropdownPress(row, ev) {
    fbMarkTokenInputDropdownInteraction();
    const dd = row && row.closest ? row.closest(".fb-tokensearch-dropdown") : null;
    const p = fbTokenInputPointerPoint(ev) || { x: 0, y: 0 };
    __fbTokenInputUi.dropdownPress = {
      row,
      value: row ? String(row.dataset.fbValue || "") : "",
      x: p.x,
      y: p.y,
      scrollTop: dd ? Number(dd.scrollTop || 0) : 0,
      ts: Date.now(),
      moved: false
    };
  }

  function fbMoveTokenInputDropdownPress(row, ev) {
    const press = __fbTokenInputUi.dropdownPress;
    if (!press || (row && press.row !== row)) return;
    const p = fbTokenInputPointerPoint(ev);
    if (!p) return;
    const dx = Math.abs(p.x - Number(press.x || 0));
    const dy = Math.abs(p.y - Number(press.y || 0));
    if (dx > 8 || dy > 8) {
      press.moved = true;
      fbArmTokenInputDropdownScrollGuard(520);
    } else {
      fbMarkTokenInputDropdownInteraction();
    }
  }

  function fbTokenInputChoiceLooksLikeScroll(row, ev) {
    const now = Date.now();
    if (now < Number(__fbTokenInputUi.dropdownSuppressChoiceUntil || 0)) return true;

    const press = __fbTokenInputUi.dropdownPress;
    if (!press || (row && press.row !== row)) return false;

    const dd = row && row.closest ? row.closest(".fb-tokensearch-dropdown") : null;
    const p = fbTokenInputPointerPoint(ev);
    const dx = p ? Math.abs(p.x - Number(press.x || 0)) : 0;
    const dy = p ? Math.abs(p.y - Number(press.y || 0)) : 0;
    const scrolled = dd ? Math.abs(Number(dd.scrollTop || 0) - Number(press.scrollTop || 0)) > 2 : false;

    return !!(press.moved || dx > 8 || dy > 8 || scrolled);
  }

  function fbBindTokenInputDropdownScrollGuard(dd) {
    if (!dd || dd.dataset.fbScrollGuard === "1") return;
    dd.dataset.fbScrollGuard = "1";
    dd.addEventListener("scroll", () => {
      fbArmTokenInputDropdownScrollGuard(420);
    }, { passive: true });
    dd.addEventListener("touchmove", () => {
      fbMarkTokenInputDropdownInteraction();
      fbArmTokenInputDropdownScrollGuard(360);
    }, { passive: true });
  }

  function fbRenderTokenInputDropdown(items, query) {
    const wrap = fbGetTokenInputWrap();
    if (!wrap) return;
    const dd = wrap.querySelector(".fb-tokensearch-dropdown");
    if (!dd) return;
    fbBindTokenInputDropdownScrollGuard(dd);

    if (!Array.isArray(items) || !items.length) {
      fbHideTokenInputDropdown();
      return;
    }

    dd.innerHTML = "";
    const q = String(query || "").trim();

    for (const item of items) {
      const row = document.createElement("div");
      row.className = "fb-tokensearch-item";
      row.setAttribute("role", "option");
      row.tabIndex = -1;
      row.dataset.fbValue = String(item.text || "");
      if (item.kind === "history") row.classList.add("is-history");

      const main = document.createElement("div");
      main.className = "fb-tokensearch-item__main";
      main.textContent = String(item.text || "");
      row.appendChild(main);

      if (item.kind === "history") {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "fb-tokensearch-item__del";
        del.setAttribute("aria-label", "Remove");
        del.textContent = "×";
        del.addEventListener("pointerdown", (ev) => {
          fbMarkTokenInputDropdownInteraction();
          ev.preventDefault();
          ev.stopPropagation();
        }, true);
        del.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          fbRemoveTokenInputHistory(item.text || "");
          fbRefreshTokenInputUiSoon(0);
        });
        row.appendChild(del);
      }

      const startPress = (ev) => {
        // Do not choose on pointerdown. On mobile, the same first touch is also
        // the start of a vertical scroll gesture, so applying immediately makes
        // the dropdown feel far too sensitive.
        fbStartTokenInputDropdownPress(row, ev);
      };
      const movePress = (ev) => {
        fbMoveTokenInputDropdownPress(row, ev);
      };
      const pick = (ev) => {
        fbMarkTokenInputDropdownInteraction();
        if (ev) {
          ev.preventDefault();
          ev.stopPropagation();
        }
        if (fbTokenInputChoiceLooksLikeScroll(row, ev)) {
          __fbTokenInputUi.dropdownPress = null;
          return;
        }
        __fbTokenInputUi.dropdownPress = null;
        fbApplyTokenInputChoice(item.text || "");
      };

      row.addEventListener("pointerdown", startPress, { capture: true, passive: true });
      row.addEventListener("pointermove", movePress, { passive: true });
      row.addEventListener("touchstart", startPress, { capture: true, passive: true });
      row.addEventListener("touchmove", movePress, { passive: true });
      row.addEventListener("mousedown", startPress, true);
      row.addEventListener("click", pick);
      dd.appendChild(row);
    }

    if (!q && items.some((item) => item && item.kind === "history")) {
      const footer = document.createElement("div");
      footer.className = "fb-tokensearch-footer";

      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = "fb-tokensearch-footer__clear";
      clearBtn.textContent = "Clear history";
      clearBtn.addEventListener("pointerdown", (ev) => {
        fbMarkTokenInputDropdownInteraction();
        ev.preventDefault();
        ev.stopPropagation();
      }, true);
      clearBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        fbClearTokenInputHistory();
        fbRefreshTokenInputUiSoon(0);
      });
      footer.appendChild(clearBtn);
      dd.appendChild(footer);
    }

    dd.style.display = "block";
    fbSetTokenInputActiveIndex(-1);
  }

  async function fbRefreshTokenInputUi() {
    const input = fbGetTokenInputEl();
    const wrap = fbGetTokenInputWrap();
    if (!input || !wrap) return;

    const overlay = wrap.querySelector(".fb-tokensearch-overlay");
    const mirror = wrap.querySelector(".fb-tokensearch-mirror");
    const suffix = wrap.querySelector(".fb-tokensearch-suffix");
    if (overlay) fbTokenInputSyncOverlayStyle(input, overlay);

    const raw = fbNormaliseTokenInputValue(input.value || "");
    const tokenPart = fbSplitTokenInputForSuggest(raw).token || "";

    const seq = ++__fbTokenInputUi.seq;
    let payload = { items: [], inlineSuffix: "", inlineText: "" };
    try {
      payload = await fbGetTokenInputSuggestionItems(raw, 8);
    } catch (_) {}
    if (seq !== __fbTokenInputUi.seq) return;

    if (mirror) mirror.textContent = raw;
    const canShowInline = !!payload.inlineSuffix && document.activeElement === input && fbTokenInputCanInline(tokenPart);
    if (suffix) {
      suffix.textContent = canShowInline ? payload.inlineSuffix : "";
      suffix.style.display = canShowInline ? "inline" : "none";
    }

    __fbTokenInputUi.items = Array.isArray(payload.items) ? payload.items.slice() : [];

    const isFocused = document.activeElement === input;
    const q = String(raw || "").trim();
    if (!isFocused) {
      fbHideTokenInputDropdown();
      return;
    }

    if (fbShouldDeferTokenInputDropdown()) {
      fbHideTokenInputDropdown();
      const left = Math.max(0, Number(__fbTokenInputUi.mobileDropdownDeferUntil || 0) - Date.now());
      if (left > 8) fbRefreshTokenInputUiSoon(Math.min(left + 20, 280));
      return;
    }

    if (!q) {
      if (__fbTokenInputUi.items.length) fbRenderTokenInputDropdown(__fbTokenInputUi.items, "");
      else fbHideTokenInputDropdown();
      return;
    }

    if (__fbTokenInputUi.items.length) fbRenderTokenInputDropdown(__fbTokenInputUi.items, q);
    else fbHideTokenInputDropdown();
  }

  function fbRefreshTokenInputUiSoon(delayMs) {
    const ms = Number(delayMs) || 0;
    window.setTimeout(() => {
      try { fbRefreshTokenInputUi(); } catch (_) {}
    }, ms);
  }

  function fbScheduleMobileTokenInputSettledRefresh() {
    if (!fbIsMobileTokenInputUi()) return;
    fbRefreshTokenInputUiSoon(120);
    fbRefreshTokenInputUiSoon(220);
    fbRefreshTokenInputUiSoon(360);
    fbRefreshTokenInputUiSoon(520);
  }

  function fbEnsureTokenInputAssistStyles() {
    const old = document.getElementById("fb-token-input-assist-style-v1");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    let st = document.getElementById("fb-token-input-assist-style-v4");
    if (!st) {
      const oldV2 = document.getElementById("fb-token-input-assist-style-v3") || document.getElementById("fb-token-input-assist-style-v2");
      if (oldV2 && oldV2.parentNode) oldV2.parentNode.removeChild(oldV2);
      st = document.createElement("style");
      st.id = "fb-token-input-assist-style-v4";
      document.head.appendChild(st);
    }
    st.textContent = `
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-wrap{
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  max-width: 100%;
}
@media (min-width: 721px){
  #search-form.fb-find-form .fb-addtoken-bar{
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    justify-content: space-between;
    column-gap: 12px;
    row-gap: 0;
  }
  #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-wrap{
    width: min(100%, 40rem);
    max-width: 40rem;
  }
  #search-form.fb-find-form .fb-addtoken-actions{
    margin-left: 0;
    justify-content: flex-end;
    max-width: 100%;
  }
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-wrap > #search-input{
  position: relative;
  z-index: 2;
  width: 100%;
  min-width: 0;
  scroll-margin-bottom: min(46vh, 360px);
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-overlay{
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  pointer-events: none;
  white-space: pre;
  overflow: hidden;
  color: inherit;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-mirror{
  visibility: hidden;
  white-space: pre;
  flex: 0 0 auto;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-suffix{
  color: var(--md-default-fg-color--light);
  opacity: .92;
  white-space: pre;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-dropdown{
  position: absolute;
  top: calc(100% - 1px);
  left: 0;
  right: 0;
  z-index: 40;
  display: none;
  max-height: min(52vh, 360px);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
  border-radius: 16px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.34);
  box-shadow: 0 12px 28px rgba(15,23,42,.10);
  backdrop-filter: blur(14px) saturate(135%);
  -webkit-backdrop-filter: blur(14px) saturate(135%);
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item{
  display: grid;
  grid-template-columns: minmax(0,1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: var(--fb-token-input-h, 3.15rem);
  padding: 0 16px;
  cursor: pointer;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item + .fb-tokensearch-item{
  border-top: 1px solid rgba(15,23,42,.08);
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item:hover,
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item.is-active{
  background: transparent;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__main{
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 650;
  transition: color 140ms ease, opacity 140ms ease;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item:hover .fb-tokensearch-item__main,
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item.is-active .fb-tokensearch-item__main{
  color: var(--md-accent-fg-color);
}
@supports selector(:has(*)){
  #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item:has(.fb-tokensearch-item__del:hover) .fb-tokensearch-item__main,
  #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item:has(.fb-tokensearch-item__del:focus-visible) .fb-tokensearch-item__main{
    color: inherit;
  }
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__meta{
  display: none !important;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del{
  appearance: none;
  -webkit-appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  margin-left: 2px;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  outline: none;
  color: var(--md-default-fg-color--light);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 140ms ease, opacity 140ms ease, transform 140ms ease;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del:hover,
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del:focus,
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del:focus-visible{
  background: transparent;
  box-shadow: none;
  outline: none;
  color: var(--md-accent-fg-color);
}
html[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del:hover,
html[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del:focus,
html[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del:focus-visible,
body[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del:hover,
body[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del:focus,
body[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del:focus-visible{
  color: var(--md-accent-fg-color) !important;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del::before,
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del::after{
  display: none;
  content: none;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-height: var(--fb-token-input-h, 3.15rem);
  padding: 0 16px;
  border-top: 1px solid rgba(15,23,42,.08);
  background: rgba(255,255,255,.10);
  backdrop-filter: blur(14px) saturate(135%);
  -webkit-backdrop-filter: blur(14px) saturate(135%);
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer:empty{
  display: none;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__hint{
  display: none !important;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear{
  appearance: none;
  -webkit-appearance: none;
  font-size: .74rem;
  font-weight: 550;
  color: var(--md-default-fg-color--light);
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 140ms ease, opacity 140ms ease;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear:hover,
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear:focus,
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear:focus-visible{
  background: transparent;
  box-shadow: none;
  outline: none;
  color: var(--md-accent-fg-color);
}
html[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear:hover,
html[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear:focus,
html[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear:focus-visible,
body[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear:hover,
body[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear:focus,
body[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear:focus-visible{
  color: var(--md-accent-fg-color) !important;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear::before,
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer__clear::after{
  display: none;
  content: none;
}

#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item.is-history{
  grid-template-columns: minmax(0,1fr) auto;
}
#search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item__del{
  justify-self: end;
}
#search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn{
  border-style: solid !important;
}
#search-form.fb-find-form .fb-addtoken-actions .fb-cta__ico{
  width: 18px !important;
  height: 18px !important;
  flex: 0 0 18px !important;
  border-radius: 0 !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
}
#search-form.fb-find-form .fb-addtoken-actions .fb-cta__ico::before{
  width: 18px !important;
  height: 18px !important;
}
html[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn,
body[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn{
  color: rgba(15,23,42,.92) !important;
  border-color: rgba(15,23,42,.22) !important;
  background: rgba(255,255,255,.40) !important;
  box-shadow: 0 10px 26px rgba(15,23,42,.12) !important;
}
html[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn:hover,
body[data-md-color-scheme="default"] #search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn:hover{
  background: rgba(255,255,255,.55) !important;
  border-color: rgba(15,23,42,.30) !important;
}
html[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn,
body[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn{
  color: rgba(255,255,255,.92) !important;
  border-color: rgba(99,102,241,.40) !important;
  background: linear-gradient(135deg, rgba(99,102,241,.20), rgba(99,102,241,.09)) !important;
  box-shadow: 0 10px 22px rgba(0,0,0,.22) !important;
}
html[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn:hover,
body[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn:hover{
  border-color: rgba(99,102,241,.55) !important;
  background: linear-gradient(135deg, rgba(99,102,241,.25), rgba(99,102,241,.11)) !important;
}
html[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-dropdown,
body[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-dropdown{
  border-color: rgba(148,163,184,.16);
  background: rgba(30,41,59,.42);
  box-shadow: 0 12px 28px rgba(0,0,0,.22);
}
html[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item + .fb-tokensearch-item,
body[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item + .fb-tokensearch-item{
  border-top-color: rgba(148,163,184,.12);
}
html[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item:hover,
html[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item.is-active,
body[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item:hover,
body[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-item.is-active{
  background: rgba(255,255,255,.08);
}
html[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer,
body[data-md-color-scheme="slate"] #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-footer{
  border-top-color: rgba(148,163,184,.12);
  background: rgba(255,255,255,.03);
}
@media (max-width: 720px){
  #search-form.fb-find-form .fb-addtoken-bar .fb-tokensearch-dropdown{
    top: calc(100% - 1px);
    max-height: min(44vh, 320px);
  }
}
`;
  }

  let __fbTokenInputAssistResizeBound = false;
  let __fbTokenInputAssistPointerTrackBound = false;

  function fbSyncTokenInputAssistMetrics() {
    const input = fbGetTokenInputEl();
    const wrap = fbGetTokenInputWrap();
    if (!input || !wrap) return;
    try {
      const h = Math.max(44, Math.round(input.getBoundingClientRect().height || input.offsetHeight || 0));
      if (h) wrap.style.setProperty("--fb-token-input-h", h + "px");
    } catch (_) {}

    try {
      const isMobile = !!(window.matchMedia && window.matchMedia("(max-width: 720px)").matches);
      input.placeholder = isMobile
        ? "limit, m1c, m2la"
        : "limit, m1c, m2la, lecture 3, linear algebra, differentiation";
    } catch (_) {}
  }

  function fbEnsureTokenInputAssistUi() {
    fbEnsureTokenInputAssistStyles();
    const input = fbGetTokenInputEl();
    if (!input || !input.parentElement) return;

    let wrap = fbGetTokenInputWrap();
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "fb-tokensearch-wrap";
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
    }

    if (!wrap.querySelector(".fb-tokensearch-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "fb-tokensearch-overlay";
      overlay.innerHTML = '<span class="fb-tokensearch-mirror"></span><span class="fb-tokensearch-suffix"></span>';
      wrap.appendChild(overlay);
    }

    if (!wrap.querySelector(".fb-tokensearch-dropdown")) {
      const dd = document.createElement("div");
      dd.className = "fb-tokensearch-dropdown";
      dd.setAttribute("role", "listbox");
      dd.style.display = "none";
      wrap.appendChild(dd);
    }

    fbSyncTokenInputAssistMetrics();
    try { fbBindTokenInputKeyboardLiftOnce(); } catch (_) {}
    window.setTimeout(fbSyncTokenInputAssistMetrics, 0);
    window.setTimeout(fbSyncTokenInputAssistMetrics, 80);
    if (!__fbTokenInputAssistPointerTrackBound) {
      __fbTokenInputAssistPointerTrackBound = true;
      document.addEventListener("pointerdown", (ev) => {
        __fbTokenInputUi.lastPointerDownTarget = ev ? ev.target : null;
        __fbTokenInputUi.lastPointerDownTs = Date.now();
      }, true);
      document.addEventListener("mousedown", (ev) => {
        __fbTokenInputUi.lastPointerDownTarget = ev ? ev.target : null;
        __fbTokenInputUi.lastPointerDownTs = Date.now();
      }, true);
    }
    if (!__fbTokenInputAssistResizeBound) {
      __fbTokenInputAssistResizeBound = true;
      window.addEventListener("resize", fbSyncTokenInputAssistMetrics, { passive: true });
    }

    if (wrap.dataset.fbTokenAssistPointerGuard !== "1") {
      wrap.dataset.fbTokenAssistPointerGuard = "1";
      const guardPointerFocus = (ev) => {
        const target = ev && ev.target;
        if (!target) return;
        try {
          if (target.closest && target.closest(".fb-tokensearch-dropdown")) return;
        } catch (_) {}
        const bootGuard = fbIsTokenInputBootGuardActive();
        if (bootGuard) fbArmMobileTokenInputBootTap(760);
        fbArmTokenInputPointerFocusLock(bootGuard ? 820 : 560);
        if (fbIsMobileTokenInputUi()) {
          const inputNow = fbGetTokenInputEl();
          if (inputNow) {
            fbRequestTokenInputKeepFocus(1100);
            fbMobileFocusTokenInputNow(inputNow);
          }
        }
        fbRestoreTokenInputFocusSoon(0);
        fbRestoreTokenInputFocusSoon(16);
        if (bootGuard) {
          fbRestoreTokenInputFocusSoon(60);
          fbRestoreTokenInputFocusSoon(120);
          fbRestoreTokenInputFocusSoon(220);
          fbRestoreTokenInputFocusSoon(360);
          fbScheduleMobileTokenInputSettledRefresh();
        }
      };
      wrap.addEventListener("pointerdown", guardPointerFocus, true);
      wrap.addEventListener("mousedown", guardPointerFocus, true);
      wrap.addEventListener("touchstart", guardPointerFocus, { capture: true, passive: true });
      wrap.addEventListener("touchend", guardPointerFocus, { capture: true, passive: true });
      wrap.addEventListener("click", guardPointerFocus, true);
    }

    if (input.dataset.fbTokenAssistBound !== "1") {
      input.dataset.fbTokenAssistBound = "1";

      input.addEventListener("focus", () => {
        __fbTokenInputUi.lastFocusTs = Date.now();
        try {
          fbBindTokenInputKeyboardLiftOnce();
          fbNewTokenInputKeyboardLiftSession();
          fbRequestTokenInputKeepFocus(1200);
          fbScheduleTokenInputKeyboardLift(input, "focus");
        } catch (_) {}
        if (fbIsTokenInputBootGuardActive() || Date.now() < Number(__fbTokenInputUi.mobileBootTapUntil || 0)) {
          __fbTokenInputUi.mobileDropdownDeferUntil = Math.max(Number(__fbTokenInputUi.mobileDropdownDeferUntil || 0), Date.now() + 240);
          fbHideTokenInputDropdown();
          fbScheduleMobileTokenInputSettledRefresh();
          return;
        }
        fbRefreshTokenInputUiSoon(0);
      }, { passive: true });

      input.addEventListener("input", () => {
        __fbTokenInputUi.lastApplied = fbNormaliseTokenInputValue(input.value || "");
        fbRefreshTokenInputUiSoon(0);
      });

      input.addEventListener("blur", () => {
        try { fbCancelTokenInputKeyboardLiftSession(); } catch (_) {}
        window.setTimeout(() => {
          const wrapNow = fbGetTokenInputWrap();
          const shouldRestoreFocus =
            !!wrapNow &&
            Date.now() < Number(__fbTokenInputUi.pointerFocusUntil || 0) &&
            fbTokenInputPointerWasInsideWrap(wrapNow);
          const shouldRestoreMobileBootFocus =
            !!wrapNow &&
            fbIsMobileTokenInputUi() &&
            Date.now() < Number(__fbTokenInputUi.mobileFocusGraceUntil || 0) &&
            fbTokenInputPointerWasInsideWrap(wrapNow);

          if (shouldRestoreFocus || shouldRestoreMobileBootFocus) {
            fbRestoreTokenInputFocusSoon(0);
            fbRestoreTokenInputFocusSoon(16);
            if (shouldRestoreMobileBootFocus) {
              fbRestoreTokenInputFocusSoon(60);
              fbRestoreTokenInputFocusSoon(120);
              fbRestoreTokenInputFocusSoon(220);
              fbRestoreTokenInputFocusSoon(360);
              fbScheduleMobileTokenInputSettledRefresh();
            }
            return;
          }

          if (Date.now() < (__fbTokenInputUi.suppressBlurHideUntil || 0)) return;
          fbHideTokenInputDropdown();
          if (!wrapNow) return;
          const suffix = wrapNow.querySelector(".fb-tokensearch-suffix");
          if (suffix) {
            suffix.textContent = "";
            suffix.style.display = "none";
          }
        }, fbIsMobileTokenInputUi() ? 120 : 80);
      });

      input.addEventListener("keydown", (ev) => {
        const wrapNow = fbGetTokenInputWrap();
        const dd = wrapNow ? wrapNow.querySelector(".fb-tokensearch-dropdown") : null;
        const visible = !!(dd && dd.style.display !== "none" && dd.children.length);
        const items = Array.isArray(__fbTokenInputUi.items) ? __fbTokenInputUi.items : [];
        const suffixEl = wrapNow ? wrapNow.querySelector(".fb-tokensearch-suffix") : null;
        const hasInline = !!(suffixEl && suffixEl.textContent);
        let idx = Number(__fbTokenInputUi.activeIndex);
        if (!Number.isFinite(idx)) idx = -1;

        // IMPORTANT: Enter inside the Find Builder token input must NEVER fall through
        // to the page/header search flow or to the browser's form submit.
        // It is defined to do exactly the same thing as clicking "Add to pool & panel".
        if (ev.key === "Enter") {
          if (fbHandleTokenInputEnterKey(ev)) return;
        }

        if ((ev.key === "Tab" || ev.key === "ArrowRight") && hasInline) {
          const applied = items[idx] ? items[idx].text : (items[0] ? items[0].text : "");
          if (applied) {
            ev.preventDefault();
            ev.stopPropagation();
            fbApplyTokenInputChoice(applied);
          }
          return;
        }

        if (!visible) {
          if (ev.key === "Escape") fbHideTokenInputDropdown();
          return;
        }

        if (ev.key === "ArrowDown") {
          ev.preventDefault();
          ev.stopPropagation();
          idx = Math.min(items.length - 1, idx + 1);
          fbSetTokenInputActiveIndex(idx);
          return;
        }
        if (ev.key === "ArrowUp") {
          ev.preventDefault();
          ev.stopPropagation();
          idx = Math.max(0, idx - 1);
          fbSetTokenInputActiveIndex(idx);
          return;
        }
        if (ev.key === "Escape") {
          ev.preventDefault();
          ev.stopPropagation();
          fbHideTokenInputDropdown();
          return;
        }
      }, true);
    }

    if (!window.__fbTokenInputAssistGlobalBound) {
      window.__fbTokenInputAssistGlobalBound = true;
      document.addEventListener("click", (ev) => {
        const wrapNow = fbGetTokenInputWrap();
        if (!wrapNow) return;
        const t = ev.target;
        if (t && wrapNow.contains(t)) return;
        fbHideTokenInputDropdown();
      }, true);
      window.addEventListener("resize", () => fbRefreshTokenInputUiSoon(0), { passive: true });
    }

    fbRefreshTokenInputUiSoon(0);
  }

  // ===== editor model =====
    // ===== editor model =====
  const state = {
    tokens: [],
    expr: [], // nodes: {t:"TERM"|"OP"|"LP"|"RP", v?:string}
    cursor: 0,

    history: [], // undo stack (snapshots)
    future: [],  // redo stack (snapshots)

    // Animation: hide freshly inserted targets until the flying ghost arrives
    animHideTokens: new Set(),     // token strings (exact)
    animHideNodeIds: new Set(),    // __fbid strings

    lastMsg: "",
    lastMsgKind: "", // "ok" | "bad" | ""

    // Fuzzy suggestion bar (persist across re-renders)
    fuzzyNote: { visible: false, html: "", payload: "" },

    // Header-search enter flow: remember the original typed query so we can show the same
    // "No results as typed..." banner on mobile even if another step corrected the token.
    enterQuery: "",
    enterQueryUsed: false,

    // Empty-state hint suppression (delay "No tokens yet" / board tips until dissolve completes)
    suppressPoolHintUntil: 0,
    suppressBoardHintUntil: 0,
    __hintRevealTimer: null,
  };

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  function snapshot() {
    try { fbEnsureExprNodeIds(state.expr); } catch (_) {}
    return { expr: state.expr.map((n) => ({ ...n })), cursor: state.cursor };
  }

  function pushHistory() {
    state.history.push(snapshot());
    if (state.history.length > 200) state.history.shift();
    // any new action kills redo chain
    state.future = [];
  }

  function restore(prev) {
    state.expr = prev && Array.isArray(prev.expr) ? prev.expr.map((n) => ({ ...n })) : [];
    try { fbEnsureExprNodeIds(state.expr); } catch (_) {}
    state.cursor = Number.isFinite(prev && prev.cursor) ? prev.cursor : state.expr.length;
    state.cursor = clamp(state.cursor, 0, state.expr.length);
  }


  // ===== node constructors =====
// Stable node id for FLIP animations (safe: extra property does not affect logic)
let __fbNodeSeq = 1;

function fbNextNodeId(used) {
  const seen = used && typeof used.has === "function" ? used : null;
  let id = "";
  do {
    id = "n" + (__fbNodeSeq++);
  } while (seen && seen.has(id));
  if (seen) seen.add(id);
  return id;
}

function fbEnsureNodeId(obj) {
  if (!obj) return obj;
  const id = String(obj.__fbid || "").trim();
  if (!/^n\d+$/.test(id)) obj.__fbid = fbNextNodeId();
  return obj;
}

function fbEnsureExprNodeIds(nodes) {
  const arr = Array.isArray(nodes) ? nodes : [];
  const used = new Set();
  let maxSeen = 0;

  // First pass: keep the first valid occurrence of each persisted id and bump the sequence
  // above ids restored from localStorage/sessionStorage. Without this, the first new token
  // after a page load can reuse n1/n2 and the animation will target an old chip.
  for (const n of arr) {
    if (!n) continue;
    const id = String(n.__fbid || "").trim();
    const m = /^n(\d+)$/.exec(id);
    if (m && !used.has(id)) {
      used.add(id);
      maxSeen = Math.max(maxSeen, Number(m[1]) || 0);
    }
  }
  if (__fbNodeSeq <= maxSeen) __fbNodeSeq = maxSeen + 1;

  // Second pass: replace missing, invalid, or duplicate ids with fresh runtime ids.
  const kept = new Set();
  for (const n of arr) {
    if (!n) continue;
    const id = String(n.__fbid || "").trim();
    if (/^n\d+$/.test(id) && !kept.has(id)) {
      kept.add(id);
      continue;
    }
    n.__fbid = fbNextNodeId(kept);
  }
  return arr;
}

function TERM(v) {
  return fbEnsureNodeId({ t: "TERM", v: String(v || "").trim().replace(/\s+/g, " ") });
}
function OP(v) {
  return fbEnsureNodeId({ t: "OP", v: String(v || "").toUpperCase() });
}
function LP() {
  return fbEnsureNodeId({ t: "LP" });
}
function RP() {
  return fbEnsureNodeId({ t: "RP" });
}

  function isTerm(n) {
    return n && n.t === "TERM" && !!String(n.v || "").trim();
  }
  function isOp(n) {
    return n && n.t === "OP" && (n.v === "AND" || n.v === "OR");
  }
  function isLP(n) {
    return n && n.t === "LP";
  }
  function isRP(n) {
    return n && n.t === "RP";
  }

  function nodeLabel(n) {
    if (!n) return "";
    if (n.t === "TERM") return String(n.v || "").trim();
    if (n.t === "OP") return n.v || "";
    if (n.t === "LP") return "(";
    if (n.t === "RP") return ")";
    return "";
  }

  // ===== insertion / deletion =====
  function insertAtCursorNode(node) {
    if (!node) return;
    pushHistory();
    state.cursor = clamp(state.cursor, 0, state.expr.length);
    state.expr.splice(state.cursor, 0, node);
    state.cursor += 1;
  }

  function deleteAtIndex(i) {
    if (!Number.isFinite(i)) return;
    i = Math.floor(i);
    if (i < 0 || i >= state.expr.length) return;
    pushHistory();
    state.expr.splice(i, 1);
    if (state.cursor > i) state.cursor -= 1;
    state.cursor = clamp(state.cursor, 0, state.expr.length);
  }

  // ===== strict tokenize + validate (NO implicit AND) =====
  function normalizeNodesToTokens(nodes) {
    const out = [];
    for (const n of nodes) {
      if (isTerm(n)) out.push({ k: "TERM", v: String(n.v || "").trim() });
      else if (isOp(n)) out.push({ k: "OP", v: n.v });
      else if (isLP(n)) out.push({ k: "LP", v: "(" });
      else if (isRP(n)) out.push({ k: "RP", v: ")" });
    }
    return out;
  }

  function validateTokens(tokens) {
    if (!tokens.length) return { ok: false, msg: "Empty expression." };

    let bal = 0;
    let expect = "VALUE"; // VALUE: TERM/LP, OP: OP/RP/end

    function label(t) {
      if (!t) return "";
      if (t.k === "TERM") return `token '${t.v}'`;
      if (t.k === "OP") return `operator '${t.v}'`;
      if (t.k === "LP") return "'('";
      if (t.k === "RP") return "')'";
      return "token";
    }

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      const prev = i > 0 ? tokens[i - 1] : null;

      if (expect === "VALUE") {
        if (t.k === "TERM") {
          expect = "OP";
          continue;
        }
        if (t.k === "LP") {
          bal++;
          expect = "VALUE";
          continue;
        }
        if (t.k === "RP") {
          if (prev && prev.k === "LP") return { ok: false, msg: "Empty parentheses '()' are not allowed." };
          if (prev && prev.k === "OP") return { ok: false, msg: `Missing token after ${label(prev)}.` };
          return { ok: false, msg: "Missing token before ')'." };
        }
        if (t.k === "OP") {
          if (!prev) return { ok: false, msg: `Expression cannot start with ${label(t)}.` };
          return { ok: false, msg: `Missing token before ${label(t)}.` };
        }
      } else {
        // expect OP
        if (t.k === "OP") {
          expect = "VALUE";
          continue;
        }
        if (t.k === "RP") {
          bal--;
          if (bal < 0) return { ok: false, msg: "Unmatched ')'." };
          expect = "OP";
          continue;
        }
        if (t.k === "TERM") return { ok: false, msg: `Missing operator between ${label(prev)} and ${label(t)}.` };
        if (t.k === "LP") return { ok: false, msg: `Missing operator before '(' (between ${label(prev)} and '(').` };
      }
    }

    if (bal !== 0) return { ok: false, msg: "Unclosed '('." };
    if (expect !== "OP") {
      const last = tokens[tokens.length - 1];
      if (last && last.k === "OP") return { ok: false, msg: `Missing token after ${label(last)}.` };
      if (last && last.k === "LP") return { ok: false, msg: "Unclosed '('." };
      return { ok: false, msg: "Expression cannot end here: add a token." };
    }
    return { ok: true, msg: "" };
  }

  function tokensToExprText(tokens) {
    const out = [];
    for (const t of (tokens || [])) {
      if (!t) continue;
      if (t.k === "TERM") {
        const term = String(t.v || "").trim().replace(/\s+/g, " ");
        const parts = term.split(/\s+/).filter(Boolean);
        if (parts.length <= 1) {
          if (parts[0]) out.push(parts[0]);
        } else {
          // Treat a multi-word token as (w1 AND w2 AND ...)
          out.push("(");
          for (let i = 0; i < parts.length; i++) {
            out.push(parts[i]);
            if (i < parts.length - 1) out.push("AND");
          }
          out.push(")");
        }
        continue;
      }
      out.push(String(t.v || "").trim());
    }
    return out.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  }


  // ===== lightweight "will this return results?" evaluator =====
let __fb_index_cache = null;

async function fbLoadIndex() {
  if (__fb_index_cache) return __fb_index_cache;

  // reuse same site-root logic as other files
  function getSiteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]');
    const attr = script ? script.getAttribute("src") : (link ? link.getAttribute("href") : null);
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);
    const p = assetUrl.pathname;
    const idx = p.indexOf("/assets/");
    if (idx >= 0) return assetUrl.origin + p.slice(0, idx + 1);
    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }

  const root = getSiteRootUrl();
  const url = new URL("search/search_index.json", root);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load search index");
  __fb_index_cache = await res.json();
  return __fb_index_cache;
}

function fbNormaliseForSearch(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fbAsStringList(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x.map(String).filter(Boolean);
  if (typeof x === "string") return [x];
  return [];
}

// Try hard to read tags/aliases from different index shapes (same spirit as search-results.js)
function fbGetTagsFromDoc(d) {
  const out = [];
  out.push(...fbAsStringList(d && d.tags));
  out.push(...fbAsStringList(d && d.tag));
  out.push(...fbAsStringList(d && d.meta && d.meta.tags));
  out.push(...fbAsStringList(d && d.meta && d.meta.tag));
  out.push(...fbAsStringList(d && d.meta && d.meta["tags"]));
  return out.map(s => String(s).trim()).filter(Boolean);
}

function fbGetAliasesFromDoc(d) {
  const out = [];
  out.push(...fbAsStringList(d && d.aliases));
  out.push(...fbAsStringList(d && d.alias));
  out.push(...fbAsStringList(d && d.meta && d.meta.aliases));
  out.push(...fbAsStringList(d && d.meta && d.meta.alias));
  out.push(...fbAsStringList(d && d.meta && d.meta["aliases"]));
  return out.map(s => String(s).trim()).filter(Boolean);
}

function fbAggregateDocsToPages(docs) {
  const pageMap = new Map();
  for (const d of (docs || [])) {
    const locFull = String(d.location || "");
    if (!locFull) continue;
    const pageLoc = locFull.split("#")[0];
    if (!pageLoc) continue;

    let entry = pageMap.get(pageLoc);
    if (!entry) {
      entry = { location: pageLoc, title: "", text: "", tags: new Set(), aliases: new Set() };
      pageMap.set(pageLoc, entry);
    }

    if (locFull === pageLoc && d.title) entry.title = String(d.title);

    // keep all text (this is only for existence check)
    if (d.text) entry.text += " " + String(d.text);

    // collect tags/aliases (if present in index)
    for (const tg of fbGetTagsFromDoc(d)) entry.tags.add(tg);
    for (const al of fbGetAliasesFromDoc(d)) entry.aliases.add(al);
  }

  for (const e of pageMap.values()) {
    if (!e.title) {
      const file = e.location.split("/").pop() || "Untitled";
      e.title = file.replace(/\.html$/i, "").replace(/-/g, " ");
    }
  }

  return Array.from(pageMap.values()).map(e => ({
    location: e.location,
    title: e.title,
    text: e.text,
    tags: Array.from(e.tags),
    aliases: Array.from(e.aliases),
  }));
}

// Shunting-yard: tokens are ["(", ")", "AND", "OR", {term:"aa"}]
function fbToRPN(tokens) {
  const out = [];
  const st = [];
  const prec = { "OR": 1, "AND": 2 };

  for (const t of tokens) {
    if (t && t.term) {
      out.push(t);
      continue;
    }
    if (t === "AND" || t === "OR") {
      while (st.length) {
        const top = st[st.length - 1];
        if ((top === "AND" || top === "OR") && prec[top] >= prec[t]) out.push(st.pop());
        else break;
      }
      st.push(t);
      continue;
    }
    if (t === "(") { st.push(t); continue; }
    if (t === ")") {
      while (st.length && st[st.length - 1] !== "(") out.push(st.pop());
      if (st.length && st[st.length - 1] === "(") st.pop();
      continue;
    }
  }
  while (st.length) out.push(st.pop());
  return out;
}

function fbEvalRPN(rpn, termHas) {
  const st = [];
  for (const t of rpn) {
    if (t && t.term) {
      st.push(!!termHas(t.term));
      continue;
    }
    if (t === "AND" || t === "OR") {
      const b = !!st.pop();
      const a = !!st.pop();
      st.push(t === "AND" ? (a && b) : (a || b));
    }
  }
  return !!st.pop();
}

function fbRenderNoResults(qText, hintText) {
  const container = document.getElementById("search-results");
  if (!container) return;

  container.innerHTML = `
    <div class="sr-top">
      <div class="sr-top__title">Search results</div>
      <div class="sr-top__q">${escapeHtml(qText)}</div>
    </div>
    <div class="sr-empty">
      <p>No results found.</p>
      ${hintText ? `<p class="sr-hint">${escapeHtml(hintText)}</p>` : ""}
    </div>
  `;
}

function buildNoMatchTokenHint(tokens) {
  if (!tokens || tokens.length === 0) return "";

  // 给每个 token 加英文引号
  const quoted = tokens.map(t => `"${t}"`);

  if (quoted.length === 1) {
    return `This token has no matches: ${quoted[0]}. Is it spelled correctly?`;
  }

  return `These tokens have no matches: ${quoted.join(", ")}. Are they spelled correctly?`;
}

function formatExprForDisplay(normTokens) {
  return normTokens.map(t => {
    if (t.k === "TERM") {
      return `"${t.v}"`;
    }
    return t.v; // AND / OR / ( / )
  }).join(" ");
}


  // Mobile Find-page intro: move the long paragraph under the H1 into a compact
  // information dropdown. On phones the information button sits on the same
  // line as the H1, to the right of "Concept Finder". Desktop keeps the
  // original paragraph in place.
  const FB_MOBILE_INTRO_TIPS_STYLE_ID = "fb-mobile-intro-tips-style-v2";
  let __fbMobileIntroTipsResizeBound = false;

  function fbIsMobileIntroTipsMode() {
    try {
      return !!(window.matchMedia && window.matchMedia("(max-width: 720px), (hover: none) and (pointer: coarse)").matches);
    } catch (_) {
      return false;
    }
  }

  function fbEnsureMobileIntroTipsStyles() {
    if (document.getElementById(FB_MOBILE_INTRO_TIPS_STYLE_ID)) return;
    const st = document.createElement("style");
    st.id = FB_MOBILE_INTRO_TIPS_STYLE_ID;
    st.textContent = `
      .fb-mobile-intro-title-shell{
        position:relative;
        display:flex;
        align-items:center;
        gap:.55rem;
        flex-wrap:nowrap;
        max-width:100%;
        margin:0 0 .72rem;
        z-index:3;
      }
      .fb-mobile-intro-title-shell > h1{
        display:block !important;
        flex:0 1 auto !important;
        min-width:0 !important;
        margin-bottom:0 !important;
      }
      .fb-mobile-intro-tips{
        position:relative;
        display:inline-flex;
        flex:0 0 auto;
        align-items:center;
        width:auto;
        max-width:100%;
        margin:.02em 0 0 .06rem;
        z-index:3;
        vertical-align:middle;
      }
      .fb-mobile-intro-tips .fb-mobile-tipbtn{
        appearance:none !important;
        border:1px solid rgba(255,255,255,.10) !important;
        background:rgba(29,34,45,.88) !important;
        color:rgba(255,255,255,.94) !important;
        border-radius:999px !important;
        width:38px !important;
        min-width:38px !important;
        height:38px !important;
        min-height:38px !important;
        padding:0 !important;
        display:inline-flex !important;
        align-items:center !important;
        justify-content:center !important;
        gap:8px !important;
        font:inherit !important;
        font-size:.76rem !important;
        font-weight:800 !important;
        line-height:1 !important;
        cursor:pointer !important;
        box-shadow:0 12px 24px rgba(0,0,0,.18) !important;
        backdrop-filter:blur(12px) !important;
        -webkit-backdrop-filter:blur(12px) !important;
        -webkit-tap-highlight-color:transparent !important;
      }
      .fb-mobile-intro-tips .fb-mobile-tipbtn-icon{
        width:1.1rem;
        height:1.1rem;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        font-size:1rem;
        font-weight:900;
        line-height:1;
      }
      .fb-mobile-intro-tips .fb-mobile-tipbtn-text{
        position:absolute !important;
        width:1px !important;
        height:1px !important;
        padding:0 !important;
        margin:-1px !important;
        overflow:hidden !important;
        clip:rect(0,0,0,0) !important;
        white-space:nowrap !important;
        border:0 !important;
      }
      .fb-mobile-intro-title-shell .fb-mobile-helper{
        position:absolute !important;
        left:0 !important;
        top:calc(100% + 8px) !important;
        z-index:12 !important;
        width:min(28rem, calc(100vw - 64px)) !important;
        max-width:calc(100vw - 64px) !important;
        padding:12px 14px !important;
        border-radius:16px !important;
        border:1px solid rgba(255,255,255,.10) !important;
        background:rgba(29,34,45,.88) !important;
        color:rgba(255,255,255,.94) !important;
        box-shadow:0 12px 24px rgba(0,0,0,.18) !important;
        backdrop-filter:blur(12px) !important;
        -webkit-backdrop-filter:blur(12px) !important;
        font-size:clamp(.82rem, 3.4vw, .92rem) !important;
        line-height:1.35 !important;
        pointer-events:auto !important;
      }
      .fb-mobile-intro-title-shell .fb-mobile-helper[hidden]{ display:none !important; }
      .fb-mobile-intro-title-shell .fb-mobile-helper p,
      .fb-mobile-intro-title-shell .fb-mobile-intro-paragraph{
        margin:0 !important;
        color:inherit !important;
        font:inherit !important;
        line-height:inherit !important;
      }
      html[data-md-color-scheme="default"] .fb-mobile-intro-tips .fb-mobile-tipbtn,
      body[data-md-color-scheme="default"] .fb-mobile-intro-tips .fb-mobile-tipbtn,
      html[data-md-color-scheme="default"] .fb-mobile-intro-title-shell .fb-mobile-helper,
      body[data-md-color-scheme="default"] .fb-mobile-intro-title-shell .fb-mobile-helper{
        background:rgba(244,246,250,.96) !important;
        color:rgba(15,23,42,.92) !important;
        border-color:rgba(15,23,42,.12) !important;
        box-shadow:0 10px 22px rgba(15,23,42,.12) !important;
      }
      @media (min-width: 721px) and (hover: hover) and (pointer: fine){
        .fb-mobile-intro-title-shell .fb-mobile-intro-tips,
        .fb-mobile-intro-title-shell .fb-mobile-helper{ display:none !important; }
      }
    `;
    (document.head || document.documentElement).appendChild(st);
  }

  function fbFindIntroArticle() {
    return document.querySelector("article.md-content__inner") || document.querySelector(".md-content__inner") || document;
  }

  const FB_FIND_PAGE_TITLE = "Concept Finder";

  function fbCleanFindIntroTitleText(raw) {
    return String(raw || "")
      .replace(/Search tips/gi, "")
      .replace(/\bi\b/gi, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function fbIsFindIntroTitleText(raw) {
    const text = fbCleanFindIntroTitleText(raw);
    return text === "search & filter" ||
      text === "concept finder" ||
      text.includes("search & filter") ||
      text.includes("concept finder");
  }

  function fbFindIntroH1(article) {
    const h1 = article && article.querySelector ? article.querySelector("h1") : null;
    if (!h1) return null;
    return fbIsFindIntroTitleText(h1.textContent || "") ? h1 : null;
  }

  function fbSetH1TitlePreservingChildren(h1, title) {
    if (!h1) return;
    const wanted = String(title || "").trim();
    if (!wanted) return;

    let replaced = false;
    try {
      Array.from(h1.childNodes || []).forEach((node) => {
        if (node && node.nodeType === Node.TEXT_NODE) {
          if (!replaced && String(node.nodeValue || "").trim()) {
            node.nodeValue = wanted + " ";
            replaced = true;
          } else {
            node.nodeValue = "";
          }
        }
      });
      if (!replaced) h1.insertBefore(document.createTextNode(wanted + " "), h1.firstChild || null);
    } catch (_) {
      try { h1.textContent = wanted; } catch (__) {}
    }
  }

  function fbRenameFindPageTitle() {
    if (!isOnFindPage()) return;
    const article = fbFindIntroArticle();
    const h1 = fbFindIntroH1(article);
    if (h1) fbSetH1TitlePreservingChildren(h1, FB_FIND_PAGE_TITLE);

    try {
      if (document.title && /search\s*&\s*filter/i.test(document.title)) {
        document.title = document.title.replace(/search\s*&\s*filter/ig, FB_FIND_PAGE_TITLE);
      }
    } catch (_) {}
  }

  function fbLooksLikeFindIntroParagraph(el) {
    if (!el || String(el.tagName || "").toLowerCase() !== "p") return false;
    const text = String(el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!text) return false;
    return text.includes("add tokens in the box below") || text.includes("build a query") || text.includes("start random practice");
  }

  function fbFindIntroParagraph(article, h1, panel) {
    if (panel && panel.querySelector) {
      const moved = panel.querySelector("[data-fb-mobile-intro-copy='1']");
      if (moved) return moved;
    }
    if (!article || !h1) return null;

    const shell = h1.closest && h1.closest(".fb-mobile-intro-title-shell[data-fb-mobile-intro-shell='1']");
    let node = shell ? shell.nextElementSibling : h1.nextElementSibling;
    let fallbackP = null;
    while (node) {
      if (node.id === "search-form" || node.id === "find-builder") break;
      if (node.matches && (node.matches(".fb-mobile-intro-tips") || node.matches(".fb-mobile-intro-title-shell"))) {
        node = node.nextElementSibling;
        continue;
      }
      if (String(node.tagName || "").toLowerCase() === "p") {
        if (!fallbackP) fallbackP = node;
        if (fbLooksLikeFindIntroParagraph(node)) return node;
      }
      node = node.nextElementSibling;
    }
    return fallbackP;
  }

  function fbCollapseMobileIntroTips(article) {
    if (!article || !article.querySelector) return;

    const shell = article.querySelector(".fb-mobile-intro-title-shell[data-fb-mobile-intro-shell='1']");
    if (shell) {
      const h1 = shell.querySelector("h1");
      const panel = shell.querySelector(".fb-mobile-helper");
      const p = panel && panel.querySelector ? panel.querySelector("[data-fb-mobile-intro-copy='1']") : null;
      if (p) {
        try {
          p.classList.remove("fb-mobile-intro-paragraph");
          p.removeAttribute("data-fb-mobile-intro-copy");
          shell.insertAdjacentElement("afterend", p);
        } catch (_) {}
      }
      try {
        shell.querySelectorAll(".fb-mobile-intro-tips[data-fb-mobile-intro-tips='1']").forEach((n) => n.remove());
      } catch (_) {}
      if (h1) {
        try {
          h1.querySelectorAll(".fb-mobile-intro-tips[data-fb-mobile-intro-tips='1']").forEach((n) => n.remove());
          shell.insertAdjacentElement("beforebegin", h1);
        } catch (_) {}
      }
      try { shell.remove(); } catch (_) {}
      return;
    }

    const oldWrap = article.querySelector(".fb-mobile-intro-tips[data-fb-mobile-intro-tips='1']");
    if (!oldWrap) return;
    const p = oldWrap.querySelector("[data-fb-mobile-intro-copy='1']");
    if (p) {
      try {
        p.classList.remove("fb-mobile-intro-paragraph");
        p.removeAttribute("data-fb-mobile-intro-copy");
        oldWrap.insertAdjacentElement("afterend", p);
      } catch (_) {}
    }
    try { oldWrap.remove(); } catch (_) {}
  }

  function fbEnsureMobileIntroTips() {
    if (!isOnFindPage()) return;
    fbEnsureMobileIntroTipsStyles();

    const article = fbFindIntroArticle();
    let h1 = fbFindIntroH1(article);
    if (!article || !h1) return;

    if (!fbIsMobileIntroTipsMode()) {
      fbCollapseMobileIntroTips(article);
      return;
    }

    let shell = h1.closest && h1.closest(".fb-mobile-intro-title-shell[data-fb-mobile-intro-shell='1']");
    let panel = shell && shell.querySelector ? shell.querySelector(".fb-mobile-helper") : null;
    const p = fbFindIntroParagraph(article, h1, panel);
    if (!p) return;

    if (!shell) {
      shell = document.createElement("div");
      shell.className = "fb-mobile-intro-title-shell";
      shell.setAttribute("data-fb-mobile-intro-shell", "1");
      h1.insertAdjacentElement("beforebegin", shell);
      shell.appendChild(h1);
    }

    let wrap = shell.querySelector(".fb-mobile-intro-tips[data-fb-mobile-intro-tips='1']") || h1.querySelector(".fb-mobile-intro-tips[data-fb-mobile-intro-tips='1']");
    if (!wrap) {
      wrap = document.createElement("span");
      wrap.className = "fb-mobile-intro-tips";
      wrap.setAttribute("data-fb-mobile-intro-tips", "1");
      wrap.innerHTML = `
        <button type="button" class="fb-mobile-tipbtn" aria-expanded="false" aria-label="Search tips" title="Search tips">
          <span class="fb-mobile-tipbtn-icon" aria-hidden="true">i</span>
          <span class="fb-mobile-tipbtn-text">Search tips</span>
        </button>
      `;
    }
    if (wrap.parentElement !== shell) {
      try { shell.appendChild(wrap); } catch (_) {}
    }

    panel = shell.querySelector(".fb-mobile-helper");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "fb-mobile-helper";
      panel.hidden = true;
      shell.appendChild(panel);
    }

    const btn = wrap.querySelector(".fb-mobile-tipbtn");
    if (!panel || !btn) return;

    if (p.parentElement !== panel) {
      try {
        p.setAttribute("data-fb-mobile-intro-copy", "1");
        p.classList.add("fb-mobile-intro-paragraph");
        panel.appendChild(p);
      } catch (_) {}
    }

    if (btn.dataset.fbMobileIntroBound !== "1") {
      btn.dataset.fbMobileIntroBound = "1";
      btn.addEventListener("click", (ev) => {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (_) {}
        const nextOpen = panel.hidden !== false;
        panel.hidden = !nextOpen;
        btn.setAttribute("aria-expanded", nextOpen ? "true" : "false");
      });
    }

    if (shell.dataset.fbMobileIntroOutsideBound !== "1") {
      shell.dataset.fbMobileIntroOutsideBound = "1";
      document.addEventListener("click", (ev) => {
        try {
          if (!shell.isConnected || panel.hidden) return;
          if (shell.contains(ev.target)) return;
          panel.hidden = true;
          btn.setAttribute("aria-expanded", "false");
        } catch (_) {}
      }, true);
    }

    if (!__fbMobileIntroTipsResizeBound) {
      __fbMobileIntroTipsResizeBound = true;
      window.addEventListener("resize", () => {
        try { fbEnsureMobileIntroTips(); } catch (_) {}
      }, { passive: true });
      window.addEventListener("orientationchange", () => {
        window.setTimeout(() => { try { fbEnsureMobileIntroTips(); } catch (_) {} }, 80);
      }, { passive: true });
    }
  }



  // ===== UI host =====
  function ensureFindBuilderHost() {
    let host = document.getElementById("find-builder");
    if (host) return host;

    const form = document.getElementById("search-form");
    if (!form) return null;

    host = document.createElement("div");
    host.id = "find-builder";
    form.insertAdjacentElement("afterend", host);
    return host;
  }

  function buttonHtml({ id, label, disabled, kind }) {
  const cls = ["fb-btn"];
  if (kind) cls.push(`fb-btn--${kind}`);
  if (disabled) cls.push("is-disabled");

  // Main CTA: Run search
  const isRun = id === "fb-run";
  if (isRun) cls.push("fb-cta-btn");

  // Inline SVG icons (Apache 2.0 / ISC sources; rendered with currentColor)
  const ICON_TRASH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none"><path d="M4 7h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 3.5h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 7l-1 12a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 19L6 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M14 11v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  const ICON_UNDO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" /></svg>`;
  const ICON_REDO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g transform="translate(24 0) scale(-1 1)"><path fill="currentColor" d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" /></g></svg>`;

  const ICON_SEARCH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M9.5 3a6.5 6.5 0 1 0 4.03 11.61l4.43 4.43 1.41-1.41-4.43-4.43A6.5 6.5 0 0 0 9.5 3Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"/></svg>`;

  const iconSvg =
    id === "fb-clear" ? ICON_TRASH :
    id === "fb-undo" ? ICON_UNDO :
    id === "fb-redo" ? ICON_REDO :
    "";

  const inner = isRun
    ? `<span class="fb-btn__ico" aria-hidden="true">${ICON_SEARCH}</span><span class="fb-btn__txt">${escapeHtml(label)}</span>`
    : iconSvg
      ? `<span class="fb-btn__ico" aria-hidden="true">${iconSvg}</span><span class="fb-btn__txt">${escapeHtml(label)}</span>`
      : `${escapeHtml(label)}`;
  const styleAttr = kind === "op"
    ? ' style="border-radius:999px;padding:.32rem .72rem;font-size:.80rem;font-weight:750;line-height:1;min-height:26px;"'
    : "";

  return `<button id="${id}" class="${cls.join(" ")}" type="button"${styleAttr} ${
    disabled ? "disabled" : ""
  }>${inner}</button>`;
}

  
  // Normalize operator buttons (AND/OR/()/) sizing even if older cached CSS/DOM remains
  function fbNormalizeOpButtons(host) {
    const root = host || document.getElementById("find-builder");
    if (!root) return;
    const ids = ["fb-and", "fb-or", "fb-lp", "fb-rp"];
    for (const id of ids) {
      const b = root.querySelector("#" + id);
      if (!b) continue;
      try { b.classList.add("fb-btn--op"); } catch (_) {}
      try {
        b.style.borderRadius = "999px";
        b.style.padding = ".32rem .72rem";
        b.style.fontSize = ".80rem";
        b.style.fontWeight = "750";
        b.style.lineHeight = "1";
        b.style.minHeight = "26px";
        b.style.height = "auto";
        b.style.display = "inline-flex";
        b.style.alignItems = "center";
        b.style.justifyContent = "center";
        b.style.boxSizing = "border-box";
      } catch (_) {}
    }
  }

function clearStatus() {
    state.lastMsg = "";
    state.lastMsgKind = "";
  }

  function setStatus(kind, msg) {
    state.lastMsgKind = kind || "";
    state.lastMsg = String(msg || "");
  }

  function render() {
  state.tokens = readTokens();
  try { fbEnsureExprNodeIds(state.expr); } catch (_) {}

  // If animations are disabled, never keep "hide until ghost arrives" state alive.
  // Otherwise newly added tokens/chips can stay visually blank while still taking layout space.
  try {
    if (fbPrefersReducedMotion()) {
      if (state.animHideTokens && state.animHideTokens.size) state.animHideTokens.clear();
      if (state.animHideNodeIds && state.animHideNodeIds.size) state.animHideNodeIds.clear();
    }
  } catch (_) {}

    // ✅ persist current expression so Edit filter can restore it
  try { writeExpr(state.expr); } catch {}

  const host = ensureFindBuilderHost();
  if (!host) return;

  state.cursor = clamp(state.cursor, 0, state.expr.length);
  const hasExpr = state.expr.length > 0;

  const hasTokenList = state.tokens.length > 0;
  const canUndo = state.history.length > 0;
  const canClear = hasExpr;
  const canRun = hasExpr;
  const canRedo = state.future.length > 0;

  const statusHtml = state.lastMsg
    ? `<div class="fb-status ${
        state.lastMsgKind === "bad"
          ? "fb-status--bad"
          : state.lastMsgKind === "ok"
          ? "fb-status--ok"
          : ""
      }">${escapeHtml(state.lastMsg)}</div>`
    : `<div class="fb-status"></div>`;

  const tokenButtons = state.tokens
    .map((t, idx) => {
      const safe = escapeHtml(t);
      const __tokKey = String(t || "").trim().replace(/\s+/g, " ");
      const isHidden = !!(state.animHideTokens && state.animHideTokens.has(__tokKey));
      const wrapStyle = isHidden ? `style="opacity:0; visibility:hidden; transform:scale(.98);"` : "";
      return `
        <div class="fb-tokenwrap" data-idx="${idx}" ${wrapStyle}>
          <button class="fb-tokenbtn" type="button" ${hasTokenList ? "" : "disabled"} title="${safe}">
            <span class="fb-tokenbtn__text">${safe}</span>
          </button>
          <button class="fb-tokenbtn__x" type="button" title="Remove token" aria-label="Remove token">×</button>
        </div>
      `;
    })
    .join("");

  // Board
  let boardHtml = "";
  for (let i = 0; i <= state.expr.length; i++) {
    const isCursor = i === state.cursor;
    boardHtml += `
      <button class="fb-slot ${isCursor ? "is-cursor" : ""}" type="button" data-slot="${i}" aria-label="Insert here">
        <span class="fb-caret">${isCursor ? "|" : ""}</span>
      </button>
    `;
    if (i < state.expr.length) {
      const n = state.expr[i];
      const txt = escapeHtml(nodeLabel(n));
      let cls = "fb-chip";
      if (n.t === "TERM") cls += " fb-chip--term";
      else if (n.t === "OP") cls += " fb-chip--op";
      else if (n.t === "LP" || n.t === "RP") cls += " fb-chip--paren";

      const __nid = String(n.__fbid || "");
      const __hideChip = !!(state.animHideNodeIds && __nid && state.animHideNodeIds.has(__nid));
      const __chipStyle = __hideChip ? `style="opacity:0; visibility:hidden; transform:scale(.98);"` : "";

      boardHtml += `
        <span class="${cls}" data-chip="${i}" data-expr-idx="${i}" data-fb-node="${escapeHtml(n.__fbid || '')}" ${__chipStyle}>
          <span class="fb-chip__text">${txt}</span>
          <button class="fb-chip__x" type="button" data-del="${i}" aria-label="Delete">×</button>
        </span>
      `;
    }
  }

  // ===== Task 2: mobile-short ghost example + hint =====
  const isMobile = !!(window.matchMedia && window.matchMedia("(max-width: 600px)").matches);

  const ghostLineHtml = isMobile
    ? `
      <div class="fb-ghost__line">
        <span class="fb-ghost__chip fb-ghost__term">m1c</span>
        <span class="fb-ghost__chip fb-ghost__op">AND</span>
        <span class="fb-ghost__chip fb-ghost__term">limit</span>
      </div>
    `
    : `
      <div class="fb-ghost__line">
        <span class="fb-ghost__chip fb-ghost__paren">(</span>
        <span class="fb-ghost__chip fb-ghost__term">m1c</span>
        <span class="fb-ghost__chip fb-ghost__op">OR</span>
        <span class="fb-ghost__chip fb-ghost__term">m3a</span>
        <span class="fb-ghost__chip fb-ghost__paren">)</span>
        <span class="fb-ghost__chip fb-ghost__op">AND</span>
        <span class="fb-ghost__chip fb-ghost__paren">(</span>
        <span class="fb-ghost__chip fb-ghost__term">limit</span>
        <span class="fb-ghost__chip fb-ghost__op">AND</span>
        <span class="fb-ghost__chip fb-ghost__term">infinity</span>
        <span class="fb-ghost__chip fb-ghost__paren">)</span>
      </div>
    `;

  const ghostHintText = isMobile
    ? `Tip: build like "token AND token".`
    : `Tip: add tokens above, then click tokens and AND/OR/() to build the query. You can drag tokens to rearrange.`;

    const __nowMs = Date.now();
  const __suppressPoolEmpty = __nowMs < (state.suppressPoolHintUntil || 0);
  const __suppressBoardEmpty = __nowMs < (state.suppressBoardHintUntil || 0);

  const placeholderHtml = `
    <div class="fb-board__placeholder fb-ghost fb-hint${__suppressBoardEmpty ? " fb-hint--pending" : ""}" data-fb-empty-hint="board">
      ${ghostLineHtml}
      <div class="fb-ghost__hint">${escapeHtml(ghostHintText)}</div>
    </div>
  `;

  const placeholderHeightHtml = placeholderHtml
    .replace('class="fb-board__placeholder ', 'aria-hidden="true" class="fb-board__placeholder fb-board__placeholder--height-ghost ')
    .replace('data-fb-empty-hint="board"', 'data-fb-empty-hint="board-height"');

    const clearTokensBtnHtml = `
          <button id="fb-clear-tokens" class="fb-btn fb-btn--ghost fb-tokens__clear" type="button" ${hasTokenList ? "" : "disabled"}>
            <span class="fb-clear__x" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" fill="none"><path d="M4 7h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 3.5h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 7l-1 12a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 19L6 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M14 11v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
            <span class="fb-clear__txt">Clear tokens</span>
          </button>
        `;

    const poolEmptyHtml = `<div class="fb-tokens__empty fb-hint${__suppressPoolEmpty ? " fb-hint--pending" : ""}" data-fb-empty-hint="pool">No tokens yet. Add tokens from the search bar above the pool.</div>`;


  host.innerHTML = `
    <div id="fb-fuzzy-note"></div>

    <div class="fb-panel fb-panel--pool">
      <div class="fb-tokens">
        <div class="fb-tokens__head">
          <div class="fb-tokens__title">Token pool</div>
          ${isMobile ? clearTokensBtnHtml : ""}
        </div>
        <div class="fb-tokens__row">
          <div class="fb-tokens__list">
            ${tokenButtons || poolEmptyHtml}
          </div>
          ${!isMobile ? clearTokensBtnHtml : ""}
        </div>
      </div>
    </div>

    <div class="fb-panel fb-panel--board">
      <div class="fb-panel__head"><div class="fb-panel__title">Query panel</div></div>
      <div class="fb-board">
        <div class="fb-board__inner ${hasExpr ? "has-expr" : "is-empty"}" data-board-inner="1">
          ${
            hasExpr
              ? `<div class="fb-board__line">${boardHtml}</div>${placeholderHeightHtml}`
              : placeholderHtml
          }
        </div>
      </div>

      ${statusHtml}

      <div class="fb-actions">
        <div class="fb-actions__left">
          ${buttonHtml({ id: "fb-clear", label: "Clear", disabled: !canClear })}
          ${buttonHtml({ id: "fb-undo", label: "Undo", disabled: !canUndo })}
          ${buttonHtml({ id: "fb-redo", label: "Redo", disabled: !canRedo })}
        </div>

        <div class="fb-actions__mid">
          ${buttonHtml({ id: "fb-and", label: "AND", disabled: false, kind: "op" })}
          ${buttonHtml({ id: "fb-or", label: "OR", disabled: false, kind: "op" })}
          ${buttonHtml({ id: "fb-lp", label: "(", disabled: false, kind: "op" })}
          ${buttonHtml({ id: "fb-rp", label: ")", disabled: false, kind: "op" })}
        </div>

        <div class="fb-actions__right">
          ${buttonHtml({ id: "fb-run", label: "Run search", disabled: !canRun, kind: "primary" })}
        </div>
      </div>
    </div>
`;


  // Restore fuzzy note after re-render (important on mobile panel)
  fbApplyFuzzyNoteDom(host);
  try { ensureFindSpeechBubbleFix(); } catch (_) {}
  try { fbMaybeShowEnterCorrectionNote(); } catch (_) {}

  try { fbNormalizeOpButtons(host); } catch (_) {}
  try { fbMarkLockedLogicButtons(host); } catch (_) {}

  bind(host);
}




  function bind(host) {
// Fuzzy note actions (Edit as typed)
const fuzzyNote = host.querySelector("#fb-fuzzy-note");
if (fuzzyNote && fuzzyNote.dataset.bound !== "1") {
  fuzzyNote.dataset.bound = "1";
  fuzzyNote.addEventListener("click", (e) => {
    const btn = e.target && e.target.closest ? e.target.closest("button[data-fb-fuzzy-act]") : null;
    if (!btn) return;
    const act = btn.getAttribute("data-fb-fuzzy-act") || "";
    if (act !== "edit") return;

    const payload = fuzzyNote.getAttribute("data-fb-fuzzy-payload") || (state.fuzzyNote && state.fuzzyNote.payload) || "";
    let data = null;
    try { data = payload ? JSON.parse(payload) : null; } catch (_) {}

    if (data && data.origExpr) {
      try {
        state.expr = Array.isArray(data.origExpr) ? data.origExpr.map(n => ({ ...n })) : [];
        state.cursor = Math.min(state.cursor, state.expr.length);
      } catch (_) {}
    }

    if (data && data.tokenSwaps && typeof data.tokenSwaps === "object") {
      for (const [to, from] of Object.entries(data.tokenSwaps)) {
        fbReplaceTokenEverywhere(to, from);
      }
      state.tokens = readTokens();
    }

    // Optional: some correction flows should NOT remove the suggested token from the pool
    // (e.g. when it already existed before the correction). In that case we just add the
    // original token(s) back so "Edit as typed" matches the board token.
    if (data && Array.isArray(data.tokenAddsOnEdit) && data.tokenAddsOnEdit.length) {
      try {
        const adds = data.tokenAddsOnEdit
          .map((x) => String(x || "").trim().replace(/\s+/g, " "))
          .filter(Boolean)
          .filter((t) => !fbIsGarbageToken(t));
        if (adds.length) addTokensToStorage(adds);
      } catch (_) {}
      state.tokens = readTokens();
    }

    clearStatus();
    fbHideFuzzyNote();
    render();
    focusPanelSoon();
  });
}


    // Clear tokens (all) — clears pool + panel, with a dissolve/shatter effect
const clearTokensBtn = host.querySelector("#fb-clear-tokens");
if (clearTokensBtn) {
  clearTokensBtn.addEventListener("click", () => {
    // Clear tokens always refers to the TOKEN POOL.
    // Panel behavior depends on whether the panel currently contains any TERM tokens:
    // - panel empty OR panel has only logic words: do NOT affect panel (no FX, keep logic)
    // - panel has TERM(s): clear both pool + panel, and show board empty-hint with FX after dissolve
    if (!state.tokens.length) return;

    fbHideFuzzyNote();

    const panelHasTerm =
      Array.isArray(state.expr) &&
      state.expr.some((n) => n && n.t === "TERM" && String(n.v || "").trim());

    // Visual: evaporate current pool tokens, and optionally the panel chips.
    // Bulk clear must stay cheap: animate the main chips only, skip every small × button.
    try {
      const poolWraps = Array.from(host.querySelectorAll(".fb-tokenwrap"));
      const bulkClear = poolWraps.length > 18;
      for (const w of poolWraps) {
        const b = w.querySelector(".fb-tokenbtn");
        const x = w.querySelector(".fb-tokenbtn__x");
        if (b) {
          const t = b.querySelector(".fb-tokenbtn__text");
          fbDissolveFromElement(b, {
            text: (t ? t.textContent : b.textContent) || "",
            bulk: bulkClear,
            duration: bulkClear ? 430 : FB_DISSOLVE_MS_DEFAULT
          });
        }
        // Keep single/small clears expressive, but avoid doubling ghost count on large Clear tokens.
        if (!bulkClear && x) fbDissolveFromElement(x, { text: "×", bulk: false, duration: 460 });
      }

      if (panelHasTerm) {
        const chips = Array.from(host.querySelectorAll(".fb-chip"));
        const bulkPanel = bulkClear || chips.length > 18;
        for (const c of chips) {
          const t = c.querySelector(".fb-chip__text");
          fbDissolveFromElement(c, {
            text: (t ? t.textContent : c.textContent) || "",
            bulk: bulkPanel,
            duration: bulkPanel ? 430 : FB_DISSOLVE_MS_DEFAULT
          });
        }
      }
    } catch (_) {}

    // Delay empty-state hints until dissolve finishes (+ extra delay).
    // Pool will become empty after clearing; board hint only if we clear the panel.
    // If the panel is NOT being cleared (empty or logic-only), ensure the board hint stays "as-is"
    // (no pending/reveal FX triggered by the pool dissolve).
    if (!panelHasTerm) {
      try { state.suppressBoardHintUntil = 0; } catch (_) {}
      try {
        const bh = host.querySelectorAll('[data-fb-empty-hint="board"]');
        Array.from(bh || []).forEach((el) => {
          try { el.classList.remove("fb-hint--pending"); } catch (_) {}
          try { el.classList.remove("fb-hint--reveal"); } catch (_) {}
        });
      } catch (_) {}
    }

    fbSuppressEmptyHints({
      pool: true,
      board: !!panelHasTerm,
      delayMs: FB_DISSOLVE_MS_DEFAULT + FB_HINT_DELAY_AFTER_DISSOLVE_MS
    });

    pushHistory();

    // 1) clear token storage (pool)
    state.tokens = [];
    writeTokens([]);

    // 2) clear the panel expression ONLY if it had TERM tokens
    if (panelHasTerm) {
      state.expr = [];
      state.cursor = 0;
    }

    clearStatus();

    // Re-render after a tiny tick so clones can take their rects and animate smoothly
    window.setTimeout(() => {
      render();
      focusPanelSoon();
    }, 20);
  });
}


    // Clear (panel) — dissolve chips then reset expression
    const clearBtn = host.querySelector("#fb-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (!state.expr.length) return;

        fbHideFuzzyNote();

        try {
          const chips = Array.from(host.querySelectorAll(".fb-chip"));
          const bulkPanelClear = chips.length > 18;
          for (const c of chips) {
            const t = c.querySelector(".fb-chip__text");
            fbDissolveFromElement(c, {
              text: (t ? t.textContent : c.textContent) || "",
              bulk: bulkPanelClear,
              duration: bulkPanelClear ? 430 : FB_DISSOLVE_MS_DEFAULT
            });
          }
        } catch (_) {}

        // Delay the board placeholder tips until dissolve finishes (+0.2s)
        fbSuppressEmptyHints({ board: true, delayMs: FB_DISSOLVE_MS_DEFAULT + FB_HINT_DELAY_AFTER_DISSOLVE_MS });

        pushHistory();
        state.expr = [];
        state.cursor = 0;
        clearStatus();

        window.setTimeout(() => {
          render();
          focusPanelSoon();
        }, 20);
      });
    }

        // Undo
    const undoBtn = host.querySelector("#fb-undo");
    if (undoBtn) {
      undoBtn.addEventListener("click", () => {
        const prev = state.history.pop();
        if (!prev) return;

        const boardFirst = fbCaptureBoardChipRects();

        // current -> redo stack
        state.future.push(snapshot());

        restore(prev);
        clearStatus();
        render();

        // Visual: time-shift bump + FLIP reflow
        try {
          host.classList.remove("fb-redo-bump");
          host.classList.add("fb-undo-bump");
          window.setTimeout(() => host.classList.remove("fb-undo-bump"), 260);
        } catch (_) {}
        try { fbPlayBoardFlip(boardFirst); } catch (_) {}
      });
    }

    // Redo
    const redoBtn = host.querySelector("#fb-redo");
    if (redoBtn) {
      redoBtn.addEventListener("click", () => {
        const next = state.future.pop();
        if (!next) return;

        const boardFirst = fbCaptureBoardChipRects();

        // current -> undo stack
        state.history.push(snapshot());

        restore(next);
        clearStatus();
        render();

        // Visual: time-shift bump + FLIP reflow
        try {
          host.classList.remove("fb-undo-bump");
          host.classList.add("fb-redo-bump");
          window.setTimeout(() => host.classList.remove("fb-redo-bump"), 260);
        } catch (_) {}
        try { fbPlayBoardFlip(boardFirst); } catch (_) {}
      });
    }


    // Slots
    host.querySelectorAll(".fb-slot").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.getAttribute("data-slot"));
        if (!Number.isFinite(i)) return;
        state.cursor = clamp(i, 0, state.expr.length);
        render();
      });
    });

    // Delete chip on board: ONLY delete this expr node
    // Visual: apply the same powder-crush animation to the chip AND its close "×".
    host.querySelectorAll('button[data-del]').forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();

        const i = Number(btn.getAttribute("data-del"));
        if (!Number.isFinite(i)) return;

        // Particle effect (non-blocking): crush the chip + the "×".
        let chip = null;
        try { chip = btn.closest ? btn.closest(".fb-chip") : null; } catch (_) {}

        try {
          if (chip) {
            const ct = chip.querySelector(".fb-chip__text");
            const raw = String((ct ? ct.textContent : chip.textContent) || "");
            const txt = raw.replace(/\s*×\s*$/, "").trim();
            if (txt) fbDissolveFromElement(chip, { text: txt, pieces: 18 });
          }
        } catch (_) {}
        try { fbDissolveFromElement(btn, { text: "×", pieces: 22 }); } catch (_) {}

        // Hide originals immediately to avoid double-vision while particles fly.
        try {
          if (chip) {
            chip.style.opacity = "0";
            chip.style.pointerEvents = "none";
          }
        } catch (_) {}

        // If this deletion empties the board, delay the hint reveal until after the crush.
        try {
          const willBoardEmpty = (Array.isArray(state.expr) ? state.expr.length : 0) <= 1;
          if (willBoardEmpty) {
            fbSuppressEmptyHints({
              board: true,
              delayMs: FB_DISSOLVE_MS_DEFAULT + FB_HINT_DELAY_AFTER_DISSOLVE_MS,
            });
          }
        } catch (_) {}

        deleteAtIndex(i);   // deleteAtIndex 已经 pushHistory 了
        clearStatus();

        // Re-render after a tiny tick so the particle ghosts can sample rects smoothly.
        window.setTimeout(() => {
          render();
        }, 20);
      });
    });



    // Insert operators / parens (with fly animation)
    const btnAnd = host.querySelector("#fb-and");
    if (btnAnd)
      btnAnd.addEventListener("click", async () => {
        if (!(await fbEnsureLogicUnlocked("find-builder-and"))) return;
        const __fbBoardFirst = fbCaptureBoardChipRects();
        const __fbFromRect = (() => { try { return btnAnd.getBoundingClientRect(); } catch (_) { return null; } })();
        const __node = OP("AND");
        const __nodeId = __node && __node.__fbid ? __node.__fbid : "";
        insertAtCursorNode(__node);
        // Animation: hide the new chip until the ghost arrives
        try { if (__nodeId) state.animHideNodeIds.add(__nodeId); } catch (_) {}
        clearStatus();
        render();
        try {
          fbRunPoolTokenInsertAnimation({
            token: "AND",
            nodeId: __nodeId,
            fromRect: __fbFromRect,
            styleSourceEl: btnAnd,
            boardFirst: __fbBoardFirst,
          });
        } catch (_) {}
      });

    const btnOr = host.querySelector("#fb-or");
    if (btnOr)
      btnOr.addEventListener("click", async () => {
        if (!(await fbEnsureLogicUnlocked("find-builder-or"))) return;
        const __fbBoardFirst = fbCaptureBoardChipRects();
        const __fbFromRect = (() => { try { return btnOr.getBoundingClientRect(); } catch (_) { return null; } })();
        const __node = OP("OR");
        const __nodeId = __node && __node.__fbid ? __node.__fbid : "";
        insertAtCursorNode(__node);
        // Animation: hide the new chip until the ghost arrives
        try { if (__nodeId) state.animHideNodeIds.add(__nodeId); } catch (_) {}
        clearStatus();
        render();
        try {
          fbRunPoolTokenInsertAnimation({
            token: "OR",
            nodeId: __nodeId,
            fromRect: __fbFromRect,
            styleSourceEl: btnOr,
            boardFirst: __fbBoardFirst,
          });
        } catch (_) {}
      });

    const btnLP = host.querySelector("#fb-lp");
    if (btnLP)
      btnLP.addEventListener("click", () => {
        const __fbBoardFirst = fbCaptureBoardChipRects();
        const __fbFromRect = (() => { try { return btnLP.getBoundingClientRect(); } catch (_) { return null; } })();
        const __node = LP();
        const __nodeId = __node && __node.__fbid ? __node.__fbid : "";
        insertAtCursorNode(__node);
        // Animation: hide the new chip until the ghost arrives
        try { if (__nodeId) state.animHideNodeIds.add(__nodeId); } catch (_) {}
        clearStatus();
        render();
        try {
          fbRunPoolTokenInsertAnimation({
            token: "(",
            nodeId: __nodeId,
            fromRect: __fbFromRect,
            styleSourceEl: btnLP,
            boardFirst: __fbBoardFirst,
          });
        } catch (_) {}
      });

    const btnRP = host.querySelector("#fb-rp");
    if (btnRP)
      btnRP.addEventListener("click", () => {
        const __fbBoardFirst = fbCaptureBoardChipRects();
        const __fbFromRect = (() => { try { return btnRP.getBoundingClientRect(); } catch (_) { return null; } })();
        const __node = RP();
        const __nodeId = __node && __node.__fbid ? __node.__fbid : "";
        insertAtCursorNode(__node);
        // Animation: hide the new chip until the ghost arrives
        try { if (__nodeId) state.animHideNodeIds.add(__nodeId); } catch (_) {}
        clearStatus();
        render();
        try {
          fbRunPoolTokenInsertAnimation({
            token: ")",
            nodeId: __nodeId,
            fromRect: __fbFromRect,
            styleSourceEl: btnRP,
            boardFirst: __fbBoardFirst,
          });
        } catch (_) {}
      });

    // Token list insert & remove
    host.querySelectorAll(".fb-tokenwrap").forEach((wrap) => {
      const idx = Number(wrap.getAttribute("data-idx"));
      const tokenBtn = wrap.querySelector(".fb-tokenbtn");
      const xBtn = wrap.querySelector(".fb-tokenbtn__x");

      if (tokenBtn) {
        tokenBtn.addEventListener("click", () => {
          const t = state.tokens[idx];
          if (!t) return;

          // --- Animation: clone token -> board (pool token remains) + board FLIP reflow ---
          const __fbBoardFirst = fbCaptureBoardChipRects();
          const __fbFromRect = (() => { try { return tokenBtn.getBoundingClientRect(); } catch (_) { return null; } })();

          const __node = TERM(t);
          const __nodeId = __node && __node.__fbid ? __node.__fbid : "";

          insertAtCursorNode(__node);
          try { if (__nodeId) state.animHideNodeIds.add(__nodeId); } catch (_) {}
          clearStatus();
          render();

          try {
            fbRunPoolTokenInsertAnimation({
              token: t,
              nodeId: __nodeId,
              fromRect: __fbFromRect,
              boardFirst: __fbBoardFirst,
            });
          } catch (_) {}
        });
      }

      if (xBtn) {
  xBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();

    const t = state.tokens[idx];
    if (!t) return;

    fbHideFuzzyNote();

    const norm = (s) => String(s || "").trim().replace(/\s+/g, " ").toLowerCase();
    const target = norm(t);

    // Visual: powder-crush the pool chip AND its close "×"
    try {
      if (tokenBtn) {
        const tt = tokenBtn.querySelector(".fb-tokenbtn__text");
        fbDissolveFromElement(tokenBtn, { text: (tt ? tt.textContent : tokenBtn.textContent) || "", pieces: 20 });
      }
    } catch (_) {}
    try { fbDissolveFromElement(xBtn, { text: "×", pieces: 22 }); } catch (_) {}

    // Visual: powder-crush matching TERM chips on the board (they will be removed)
    try {
      const chips = Array.from(host.querySelectorAll(".fb-chip--term"));
      for (const c of chips) {
        const ct = c.querySelector(".fb-chip__text");
        const v = (ct ? ct.textContent : c.textContent) || "";
        if (target && norm(v) === target) {
          fbDissolveFromElement(c, { text: String(v || "").trim(), pieces: 18 });
        }
      }
    } catch (_) {}

    // Hide the real elements immediately so the destination looks empty during the particle effect
    try { wrap.style.opacity = "0"; wrap.style.pointerEvents = "none"; } catch (_) {}

    // Compute next state (remove token from pool + remove matching term(s) from board)
    const nextTokens = state.tokens.slice();
    nextTokens.splice(idx, 1);

    let nextExpr = state.expr;
    if (target) {
      nextExpr = state.expr.filter((n) => {
        if (!n || n.t !== "TERM") return true;
        return norm(n.v) !== target;
      });
    }

    // Delay empty hints if this removal causes empty states
    const willPoolEmpty = nextTokens.length === 0;
    const willBoardEmpty = (state.expr && state.expr.length > 0) && nextExpr.length === 0;
    if (willPoolEmpty || willBoardEmpty) {
      fbSuppressEmptyHints({
        pool: willPoolEmpty,
        board: willBoardEmpty,
        delayMs: FB_DISSOLVE_MS_DEFAULT + FB_HINT_DELAY_AFTER_DISSOLVE_MS,
      });
    }

    // ✅ undo/redo 需要：先入栈
    pushHistory();

    // Apply state
    state.tokens = nextTokens;
    writeTokens(nextTokens);
    state.expr = nextExpr;
    state.cursor = clamp(state.cursor, 0, state.expr.length);

    clearStatus();

    // Re-render after a tiny tick so particles can take their rects and animate smoothly
    window.setTimeout(() => {
      render();
      focusPanelSoon();
    }, 20);
  });
}
    });

// ===== Drag & drop v4 (ground-up): reorder TERM values, iOS/desktop-friendly =====
// Uses mouse + touch (not HTML5 drag/drop, not pointer events) for maximum compatibility & stability.
(function initDragV4Once() {
  if (host.__fb_drag_v4_init) return;
  host.__fb_drag_v4_init = true;

  const DRAG_THRESHOLD_PX = 6;

  let drag = null; // {fromExprIdx, active, startX,startY, lastX,lastY, ghost, offsetX,offsetY, toExprIdx, dropEl, raf}

  function termSlots() {
    const slots = [];
    for (let i = 0; i < state.expr.length; i++) {
      const n = state.expr[i];
      if (n && n.t === "TERM") slots.push(i);
    }
    return slots;
  }

  function slotToNearestTermExprIdx(slotIdx) {
    const slots = termSlots();
    if (!slots.length) return null;
    for (const s of slots) if (s >= slotIdx) return s;
    return slots[slots.length - 1];
  }

  function moveTermValue(fromExprIdx, toExprIdx) {
    if (fromExprIdx === toExprIdx) return;

    const slots = termSlots();
    const fromPos = slots.indexOf(fromExprIdx);
    const toPos = slots.indexOf(toExprIdx);
    if (fromPos < 0 || toPos < 0) return;

    pushHistory();

    const values = slots.map(i => state.expr[i].v);
    const picked = values.splice(fromPos, 1)[0];
    values.splice(toPos, 0, picked);

    for (let k = 0; k < slots.length; k++) {
      state.expr[slots[k]].v = values[k];
    }

    state.cursor = clamp(state.cursor, 0, state.expr.length);
    render();
  }
function cleanupAfterMove() {
  // Collapse consecutive empty TERM nodes into a single hole
  for (let i = 1; i < state.expr.length; ) {
    const a = state.expr[i - 1], b = state.expr[i];
    const aEmpty = a && a.t === "TERM" && !String(a.v || "").trim();
    const bEmpty = b && b.t === "TERM" && !String(b.v || "").trim();
    if (aEmpty && bEmpty) {
      state.expr.splice(i, 1);
      continue;
    }
    i++;
  }
  // If this is a simple chain with exactly one operator and no parentheses,
  // holes are not useful: remove all empty TERM placeholders.
  const hasParen = state.expr.some(n => n && (n.t === "LP" || n.t === "RP"));
  const opCount = state.expr.reduce((acc, n) => acc + (n && n.t === "OP" ? 1 : 0), 0);
  if (!hasParen && opCount === 1) {
    state.expr = state.expr.filter(n => !(n && n.t === "TERM" && !String(n.v || "").trim()));
    state.cursor = clamp(state.cursor, 0, state.expr.length);
    return;
  }



  // If we only have <=1 non-empty TERM in the whole expression,
  // remove all empty TERM placeholders (prevents "empty token with X" in cases like: [hole] OR "limit")
  const nonEmptyTerms = state.expr.filter(n => n && n.t === "TERM" && String(n.v || "").trim());
  if (nonEmptyTerms.length <= 1) {
    state.expr = state.expr.filter(n => !(n && n.t === "TERM" && !String(n.v || "").trim()));
    state.cursor = clamp(state.cursor, 0, state.expr.length);
    return;
  }

  // Otherwise (structured queries), remove empty TERM only when it acts like a useless operand placeholder:
  // - empty TERM immediately before an OP at the start side (no real left operand)
  // - empty TERM immediately after an OP at the end side (no real right operand)
  for (let i = 0; i < state.expr.length; ) {
    const n = state.expr[i];
    const isEmptyTerm = n && n.t === "TERM" && !String(n.v || "").trim();
    if (!isEmptyTerm) { i++; continue; }

    const prev = i > 0 ? state.expr[i - 1] : null;
    const next = i + 1 < state.expr.length ? state.expr[i + 1] : null;

    const prevIsOpish = !prev || (prev.t === "OP" || prev.t === "LP");
    const nextIsOpish = !next || (next.t === "OP" || next.t === "RP");

    // If it's on the left of an OP but there's no real left operand
    if (next && next.t === "OP" && prevIsOpish) {
      state.expr.splice(i, 1);
      continue;
    }

    // If it's on the right of an OP but there's no real right operand
    if (prev && prev.t === "OP" && nextIsOpish) {
      state.expr.splice(i, 1);
      continue;
    }

    i++;
  }

  state.cursor = clamp(state.cursor, 0, state.expr.length);
}

function moveTermToSlot(fromExprIdx, slotIdx) {
  const fromNode = state.expr[fromExprIdx];
  if (!fromNode || fromNode.t !== "TERM") return;
  const val = String(fromNode.v || "").trim();
  if (!val) return;

  // slotIdx is an insertion index in expr (0..expr.length)
  let idx = Number(slotIdx);
  if (!Number.isFinite(idx)) return;
  idx = Math.max(0, Math.min(state.expr.length, idx));

  pushHistory();

  // Leave a hole at the original position
  fromNode.v = "";

  // Insert new TERM at target index
  state.expr.splice(idx, 0, { t: "TERM", v: val });

  cleanupAfterMove();

  // Cursor clamp
  state.cursor = clamp(state.cursor, 0, state.expr.length);
  render();
}


  function withinBoard(el) {
    return !!(el && el.closest && el.closest('[data-board-inner="1"]'));
  }

  function clearDropVisual() {
    host.querySelectorAll(".fb-drop-target").forEach(el => el.classList.remove("fb-drop-target"));
  }

  function setDropVisual(el) {
    clearDropVisual();
    if (el) el.classList.add("fb-drop-target");
  }

  function removeGhost() {
    if (drag && drag.ghost && drag.ghost.parentNode) drag.ghost.remove();
    if (drag) drag.ghost = null;
  }

  function cleanup(commit) {
    if (!drag) return;

    // restore selection/scroll
    document.body.style.userSelect = "";

    const fromEl = host.querySelector(`.fb-chip[data-expr-idx="${drag.fromExprIdx}"]`);
    if (fromEl) fromEl.classList.remove("fb-dragging");
    clearDropVisual();
    removeGhost();
    if (drag.raf) cancelAnimationFrame(drag.raf);

    const shouldCommit = commit && drag.active;

const fromIdx = drag.fromExprIdx;
const kind = drag.toKind;
const toExprIdx = drag.toExprIdx;
const toSlotIdx = drag.toSlotIdx;

drag = null;

if (!shouldCommit) return;

if (kind === "term" && toExprIdx != null && Number.isFinite(toExprIdx)) {
  moveTermValue(fromIdx, toExprIdx);
  return;
}

if ((kind === "slot" || kind === "end") && toSlotIdx != null && Number.isFinite(toSlotIdx)) {
  moveTermToSlot(fromIdx, toSlotIdx);
  return;
}


    // detach global listeners
    document.removeEventListener("mousemove", onMove, true);
    document.removeEventListener("mouseup", onUp, true);
    document.removeEventListener("touchmove", onTouchMove, { capture: true });
    document.removeEventListener("touchend", onTouchEnd, true);
    document.removeEventListener("touchcancel", onTouchEnd, true);
    window.removeEventListener("blur", onCancel, true);
    document.removeEventListener("visibilitychange", onVis, true);
  }

  function createGhost(fromEl) {
    const g = fromEl.cloneNode(true);
    g.classList.add("fb-ghost");
    g.style.position = "fixed";
    g.style.left = "0px";
    g.style.top = "0px";
    g.style.zIndex = "9999";
    g.style.pointerEvents = "none";
    g.style.opacity = "0.88";
    g.style.boxShadow = "0 14px 30px rgba(0,0,0,.35)";
    return g;
  }

  function updateGhost(x, y) {
    if (!drag || !drag.ghost) return;
    drag.ghost.style.transform = `translate(${x + drag.offsetX}px, ${y + drag.offsetY}px)`;
  }

  function pickDropTarget(clientX, clientY) {
            const el = document.elementFromPoint(clientX, clientY);
            if (!el) return { kind: "", exprIdx: null, slotIdx: null, el: null };

            // Prefer TERM chip (swap/move into existing TERM)
            const chip = el.closest ? el.closest(".fb-chip") : null;
            if (chip && withinBoard(chip)) {
              const idx = Number(chip.getAttribute("data-expr-idx"));
              if (Number.isFinite(idx) && state.expr[idx] && state.expr[idx].t === "TERM") {
                return { kind: "term", exprIdx: idx, slotIdx: null, el: chip };
              }
            }

            // Slot buttons (including empty-term hole) -> insert at this slot index
            const slot = el.closest ? el.closest(".fb-slot") : null;
            if (slot && withinBoard(slot)) {
              const slotIdx = Number(slot.getAttribute("data-slot"));
              if (Number.isFinite(slotIdx)) {
                return { kind: "slot", exprIdx: null, slotIdx, el: slot };
              }
            }

            // Blank board area -> insert at end
            const inner = el.closest ? el.closest('[data-board-inner="1"]') : null;
            if (inner) {
              return { kind: "end", exprIdx: null, slotIdx: state.expr.length, el: inner };
            }

            return { kind: "", exprIdx: null, slotIdx: null, el: null };
          }

  function scheduleHitTest() {
    if (!drag || drag.raf) return;
    drag.raf = requestAnimationFrame(() => {
      drag.raf = null;
      if (!drag) return;
      const tgt = pickDropTarget(drag.lastX, drag.lastY);
              drag.toKind = tgt.kind;
              drag.toExprIdx = tgt.exprIdx;
              drag.toSlotIdx = tgt.slotIdx;
              drag.dropEl = tgt.el;
      setDropVisual(tgt.el);
    });
  }

  function startIfNeeded(clientX, clientY) {
    const dx = clientX - drag.startX;
    const dy = clientY - drag.startY;
    const dist = Math.hypot(dx, dy);
    if (drag.active || dist >= DRAG_THRESHOLD_PX) {
      if (!drag.active) {
        drag.active = true;

        const fromEl = host.querySelector(`.fb-chip[data-expr-idx="${drag.fromExprIdx}"]`);
        if (!fromEl) { cleanup(false); return false; }

        fromEl.classList.add("fb-dragging");

        const rect = fromEl.getBoundingClientRect();
        drag.offsetX = -(rect.width / 2);
        drag.offsetY = -(rect.height / 2);

        drag.ghost = createGhost(fromEl);
        document.body.appendChild(drag.ghost);

        document.body.style.userSelect = "none";
      }
      return true;
    }
    return false;
  }

  function onMove(ev) {
    if (!drag) return;

    drag.lastX = ev.clientX;
    drag.lastY = ev.clientY;

    if (!startIfNeeded(ev.clientX, ev.clientY)) return;

    ev.preventDefault();
    updateGhost(ev.clientX, ev.clientY);
    scheduleHitTest();
  }

  function onUp() {
    cleanup(true);
  }

  function onCancel() {
    cleanup(false);
  }

  function onVis() {
    if (document.visibilityState !== "visible") cleanup(false);
  }

  function getTouchXY(ev) {
    const t = (ev.touches && ev.touches[0]) || (ev.changedTouches && ev.changedTouches[0]);
    if (!t) return null;
    return { x: t.clientX, y: t.clientY };
  }

  function onTouchMove(ev) {
    if (!drag) return;
    const xy = getTouchXY(ev);
    if (!xy) return;

    drag.lastX = xy.x;
    drag.lastY = xy.y;

    if (!startIfNeeded(xy.x, xy.y)) return;

    // IMPORTANT: prevent scrolling while dragging
    ev.preventDefault();
    updateGhost(xy.x, xy.y);
    scheduleHitTest();
  }

  function onTouchEnd() {
    cleanup(true);
  }

  function tryBeginFromEventTarget(tgt, clientX, clientY) {
    if (tgt && tgt.closest && tgt.closest(".fb-chip__x")) return false;

    const chip = tgt && tgt.closest ? tgt.closest(".fb-chip") : null;
    if (!chip) return false;
    if (!withinBoard(chip)) return false;

    const idx = Number(chip.getAttribute("data-expr-idx"));
    if (!Number.isFinite(idx)) return false;

    const node = state.expr[idx];
            if (!node || node.t !== "TERM") return false;
            if (!String(node.v || "").trim()) return false;
            if (!String(node.v || "").trim()) return false;

    // reset any previous drag (safety)
    if (drag) cleanup(false);

    drag = {
      fromExprIdx: idx,
      startX: clientX,
      startY: clientY,
      lastX: clientX,
      lastY: clientY,
      active: false,
      ghost: null,
      offsetX: 0,
      offsetY: 0,
      raf: null,
      toExprIdx: null,
      dropEl: null,
    };

    // attach global listeners
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("mouseup", onUp, true);

    // touch: use capture + passive:false so preventDefault works
    document.addEventListener("touchmove", onTouchMove, { capture: true, passive: false });
    document.addEventListener("touchend", onTouchEnd, true);
    document.addEventListener("touchcancel", onTouchEnd, true);

    window.addEventListener("blur", onCancel, true);
    document.addEventListener("visibilitychange", onVis, true);

    return true;
  }

  host.addEventListener("mousedown", (ev) => {
    if (ev.button !== 0) return;
    tryBeginFromEventTarget(ev.target, ev.clientX, ev.clientY);
  });

  host.addEventListener("touchstart", (ev) => {
    const xy = getTouchXY(ev);
    if (!xy) return;
    // don't preventDefault here; only when drag actually starts (threshold reached)
    tryBeginFromEventTarget(ev.target, xy.x, xy.y);
  }, { passive: true });

  // Kill any native drag
  host.addEventListener("dragstart", (ev) => {
    if (ev.target && ev.target.closest && ev.target.closest(".fb-chip")) ev.preventDefault();
  });
})();



    // Run search (strict)
    const runBtn = host.querySelector("#fb-run");
    if (runBtn) {
      runBtn.addEventListener("click", async () => {
        if (!state.expr.length) return;

        const norm = normalizeNodesToTokens(state.expr);
        const exprText = tokensToExprText(norm);
        if (!fbConsumeGuestAction("search", { query: exprText, source: "concept-finder-run", dedupeMs: 2500 })) return;

        // Keep the fuzzy banner visible across "Run search" if it still applies to the current expression.
        // (Otherwise mobile autoflow can auto-correct on "Add token" but the banner gets hidden immediately.)
        try {
          const raw = (state.fuzzyNote && state.fuzzyNote.payload) ? state.fuzzyNote.payload : "";
          if (raw) {
            const data = JSON.parse(raw);
            if (data && data.forExprText && data.forExprText !== exprText) {
              fbHideFuzzyNote();
            }
          }
        } catch (_) {}

            // ✅ 先做表达式语法校验：有错就直接提示，不进入搜索也不进入“无结果预判”
    const v = validateTokens(norm);
    if (!v.ok) {
      setStatus("bad", v.msg);
      render();
      return;
    }


                // ✅ 先判断是否会有结果；无结果则渲染“no results + 提示”
        try {
          // 收集 terms（用户输入的 token）
          const terms = norm.filter(t => t.k === "TERM").map(t => String(t.v || "").trim()).filter(Boolean);
          const uniqueTerms = Array.from(new Set(terms.map(s => s.toLowerCase())));

          // 判断是否包含逻辑结构（AND/OR/括号）
          const hasLogic = norm.some(t => t.k === "OP" || t.k === "LP" || t.k === "RP");

          // 构造 evaluator token stream
          const stream = norm.map(t => {
            if (t.k === "TERM") return { term: String(t.v || "").trim().toLowerCase() };
            if (t.k === "OP") return t.v;
            if (t.k === "LP") return "(";
            if (t.k === "RP") return ")";
            return null;
          }).filter(Boolean);

          const indexJson = await fbLoadIndex();
          const pageDocs = fbAggregateDocsToPages((indexJson && indexJson.docs) ? indexJson.docs : []);
          const rpn = fbToRPN(stream);

          // per-term hit counts
          const termCounts = new Map();
          for (const t of uniqueTerms) termCounts.set(t, 0);

          let combinedCount = 0;

          for (const d of pageDocs) {
            const extraTags = Array.isArray(d.tags) ? d.tags.join(" ") : "";
            const extraAliases = Array.isArray(d.aliases) ? d.aliases.join(" ") : "";
            const hay = fbNormaliseForSearch(`${d.title} ${d.text} ${d.location} ${extraTags} ${extraAliases}`);

            // Split tokens on non-alphanumerics (Material search treats "-" as separator)
            const termMatches = (termLower) => {
              const parts = String(termLower || "")
                .toLowerCase()
                .split(/[^a-z0-9]+/g)
                .filter(Boolean);
              if (!parts.length) return false;
              return parts.every((p) => hay.includes(p));
            };

            for (const t of uniqueTerms) {
              if (termMatches(t)) termCounts.set(t, (termCounts.get(t) || 0) + 1);
            }

            if (fbEvalRPN(rpn, termMatches)) combinedCount += 1;
          }

          if (combinedCount <= 0) {
            // 三类提示
            let hint = "";
            if (!hasLogic && uniqueTerms.length === 1) {
              hint = `This token "${uniqueTerms[0]}" has no matches. Is it spelled correctly?`;
            } else {
              const zeroTerms = uniqueTerms.filter(t => (termCounts.get(t) || 0) <= 0);
              if (zeroTerms.length) {
                hint = buildNoMatchTokenHint(zeroTerms);
              } else {
                hint = `Each token matches some pages, but the combined logic returns none. Consider adjusting AND/OR or parentheses.`;
              }
            }

            // ✅ Try auto-correct (only when the exact search returns 0 results)
            try {
              const did = await fbTryAutoCorrectOnNoResults(norm, uniqueTerms, termCounts, hasLogic, exprText);
              if (did) return;
            } catch (_) {}

            const displayExpr = formatExprForDisplay(norm);
            fbRenderNoResults(displayExpr, hint);
            return;
          }
        } catch (e) {
          // 索引加载/评估失败：忽略，继续走原搜索
        }

        // ✅ 有结果：再运行原搜索渲染
        if (window.__findSearchV2 && typeof window.__findSearchV2.runLogicExpr === "function") {
          clearStatus();
          render();
          try { fbStartRunSearchFx(); } catch (_) {}
          window.__findSearchV2.runLogicExpr(exprText);
          return;
        }


        // fallback: still run AND for terms, but warn user that OR won't work
        if (window.__findSearchV2 && typeof window.__findSearchV2.runQuery === "function") {
          const onlyTerms = norm
            .filter((t) => t.k === "TERM")
            .flatMap((t) => String(t.v || "").trim().split(/\s+/).filter(Boolean))
            .join(" ")
            .trim();

          if (!onlyTerms) {
            setStatus("bad", "No terms to search.");
            render();
            return;
          }
          setStatus("bad", "Logic search not ready: fallback AND was used.");
          render();
          try { fbStartRunSearchFx(); } catch (_) {}
          window.__findSearchV2.runQuery(onlyTerms);
          return;
        }

        const params = new URLSearchParams(window.location.search);
        params.set("q", exprText);
        try { fbStartRunSearchFx(); } catch (_) {}
        window.location.search = params.toString();
      });
    }
  }

  function init() {
  if (!isOnFindPage()) return;

  ensureHeaderSearchInteractionTracker();
  fbInstallSameFindTopSearchBridge();

  try { document.body && document.body.classList && document.body.classList.add("mk-find-page", "trending-page"); } catch (_) {}
  ensureFindWideLayoutStyles();
  ensureFindMobileUiStyles();
  ensureFindSpeechBubbleFix();
  try { fbRenameFindPageTitle(); } catch (_) {}
  try { fbEnsureMobileIntroTips(); } catch (_) {}

  // Cache header-search query (if any) so mobile can show the same fuzzy banner
  try { state.enterQuery = fbCacheEnterQuery(); } catch (_) { state.enterQuery = ""; }
  state.enterQueryUsed = false;


  // Ensure Material overlay is closed and the top search boxes stay empty
  closeMaterialSearchOverlayFast();
  fbForceClearTopSearchBarNow();
  const topInput = document.getElementById("search-input");
  if (topInput) topInput.value = "";
  const params = new URLSearchParams(window.location.search);
  const q = (params.get("q") || "").trim();
  const lpDirectReq = fbConsumeLpDirectRequest();
  const lpDirectToken = lpDirectReq && lpDirectReq.q
    ? String(lpDirectReq.token || lpDirectReq.q || "").trim().replace(/\s+/g, " ")
    : "";

  // Direct open from the course / lecture links under H1:
  // seed the first render with the token already in the panel/pool so the page
  // does not flash an empty find state for one frame before autofill runs.
  if (lpDirectToken) {
    try {
      state.enterQuery = "";
      state.enterQueryUsed = true;
      state.history = [];
      state.future = [];
    } catch (_) {}
    try { fbHideFuzzyNote(); } catch (_) {}
    try { fbForceClearTopSearchBarSoon(); } catch (_) {}
    state.expr = [TERM(lpDirectToken)];
    state.cursor = state.expr.length;
    try { state.tokens = addTokensToStorage([lpDirectToken]); } catch (_) {}
  } else {
    // ✅ 1) 优先恢复之前构建的表达式（Edit filter 返回时不清空）
    const savedExpr = readExpr();
    if (Array.isArray(savedExpr) && savedExpr.length) {
      state.expr = savedExpr;
      state.cursor = Math.min(state.cursor || savedExpr.length, savedExpr.length);
    } else if (q) {
      // ✅ 2) 其次才是 URL 参数 q（兼容旧行为）
      const parts = q.split(/\s+/).filter(Boolean);
      state.expr = parts.map((x) => TERM(x));
      state.cursor = state.expr.length;
    } else {
      state.expr = [];
      state.cursor = 0;
    }
  }

  state.history = [];
  clearStatus();

  render();
  try { fbRenameFindPageTitle(); } catch (_) {}
  try { fbEnsureMobileIntroTips(); } catch (_) {}

  if (lpDirectToken) {
    try { fbForceClearTopSearchBarSoon(); } catch (_) {}
    try {
      state.history = [];
      state.future = [];
      __fbAutofillStateV1.running = true;
      __fbAutofillStateV1.last = lpDirectToken;
      __fbAutofillStateV1.t = Date.now();
    } catch (_) {}
    setTimeout(async () => {
      try {
        await fbWaitAndRunSearchFromAutofill(2600);
      } catch (_) {}
      try { fbForceClearTopSearchBarSoon(); } catch (_) {}
      try { __fbAutofillStateV1.running = false; } catch (_) {}
    }, 0);
  }

      // Split "Add token" into two buttons:
  // - Add to pool: only adds token(s) into the token pool
  // - Add to pool & panel: adds token(s) into the pool AND inserts TERM(s) into the panel expression
  function fbDecorateAddTokenCta(btn, label) {
    if (!btn) return;
    btn.classList.add("fb-cta-btn");
    btn.dataset.fbCtaDecorated = "1";
    try { btn.style.textDecoration = "none"; } catch (_) {}
    try { btn.style.boxShadow = "none"; } catch (_) {}
    try { btn.style.outline = "none"; } catch (_) {}
    btn.innerHTML =
      `<span class="fb-cta__ico fb-cta__ico--add" aria-hidden="true"></span>` +
      `<span class="fb-cta__txt">${escapeHtml(label)}</span>`;
    if (!btn.__fbNoTextBoxBound) {
      btn.__fbNoTextBoxBound = true;
      const blurBtn = () => { try { btn.blur && btn.blur(); } catch (_) {} };
      btn.addEventListener("pointerup", blurBtn, { passive: true });
      btn.addEventListener("mouseup", blurBtn, { passive: true });
      btn.addEventListener("keyup", (ev) => { if (ev && (ev.key === "Enter" || ev.key === " ")) blurBtn(); });
    }
  }

  function fbEnsureSplitAddTokenUi() {
    const form = document.getElementById("search-form");
    if (!form) return;

    // Mark this form so layout CSS can target it reliably (it's a sibling of #find-builder)
    try { form.classList && form.classList.add("fb-find-form"); } catch (_) {}

    const input = form.querySelector("#search-input");
    if (!input) return;

    if (form.dataset.fbEnterSubmitBoundV1 !== "1") {
      form.dataset.fbEnterSubmitBoundV1 = "1";
      form.addEventListener("submit", (ev) => {
        fbHandleSearchFormSubmit(ev);
      }, true);
    }

    // If instant navigation reuses an already-split form, still keep the submit
    // guard above active. The old code returned before installing it.
    if (form.dataset.fbAddSplitV1 === "1") return;

    let btnInsert =
      form.querySelector("#add-token") ||
      Array.from(form.querySelectorAll("button, a")).find(
        (x) => (x.textContent || "").trim().toLowerCase() === "add token"
      );
    if (!btnInsert) return;
    try {
      if (btnInsert.tagName && btnInsert.tagName.toLowerCase() === "button") btnInsert.type = "button";
    } catch (_) {}


    // Ensure the insert CTA is a <button>. If it's an <a>, some browsers (iOS/desktop)
    // can draw a tap/selection box around the label. We rebuild it as a <button> so
    // both CTAs behave identically.
    try {
      if (btnInsert && btnInsert.tagName && btnInsert.tagName.toLowerCase() !== "button") {
        const old = btnInsert;
        const b = document.createElement("button");
        b.type = "button";
        b.id = old.id || "add-token";
        b.className = old.className || "";
        try { for (const [k, v] of Object.entries(old.dataset || {})) b.dataset[k] = v; } catch (_) {}
        try { old.replaceWith(b); } catch (_) { try { old.parentNode && old.parentNode.replaceChild(b, old); } catch (__){ } }
        btnInsert = b;
      }
    } catch (_) {}

    // Build a stable flex layout wrapper
    const bar = document.createElement("div");
    bar.className = "fb-addtoken-bar";
    const actions = document.createElement("div");
    actions.className = "fb-addtoken-actions";

    // Insert bar before input and move input + buttons into it
    try { form.insertBefore(bar, input); } catch (_) { form.prepend(bar); }
    bar.appendChild(input);
    bar.appendChild(actions);

    // Create pool-only button
    let btnPool = form.querySelector("#add-token-pool");
    if (!btnPool) {
      btnPool = document.createElement("button");
      btnPool.type = "button";
      btnPool.id = "add-token-pool";
      btnPool.className = btnInsert.className || "";
    }

    actions.appendChild(btnPool);
    actions.appendChild(btnInsert);

    // Button texts (requested)
    fbDecorateAddTokenCta(btnPool, "Add to pool");
    fbDecorateAddTokenCta(btnInsert, "Add to pool & panel");

    // Stable identification: do NOT rely on button text (text can change)
    try { btnPool.dataset.fbAddMode = "pool"; } catch (_) {}
    try { btnInsert.dataset.fbAddMode = "insert"; } catch (_) {}
    try { if (!btnInsert.id) btnInsert.id = "add-token"; } catch (_) {}

    form.dataset.fbAddSplitV1 = "1";
  }

  // Ensure UI exists (safe on instant navigation)
  fbInstallSearchFormSubmitGuard();
  fbInstallTokenInputEnterGuard();
  fbEnsureSplitAddTokenUi();
  fbEnsureTokenInputAssistUi();

  // Capture "Add token" clicks (supports <button> or <a>)
  if (!window.__fbAddTokenBoundV2) {
    window.__fbAddTokenBoundV2 = true;

    document.addEventListener(
      "click",
      (ev) => {
        const el =
          ev.target && ev.target.closest
            ? ev.target.closest("#add-token, #add-token-pool, button, a")
            : null;
        if (!el) return;

        // Determine which CTA was clicked. Prefer explicit data attributes / ids; never rely on label text.
        const btn =
          (ev.target && ev.target.closest
            ? ev.target.closest('[data-fb-add-mode], #add-token, #add-token-pool')
            : null) || el;

        const modeAttr = (btn && btn.dataset && btn.dataset.fbAddMode) ? String(btn.dataset.fbAddMode) : "";
        const id = String((btn && btn.id) || "");
        const text = ((btn && btn.textContent) || "").trim().toLowerCase();

        const isPool = modeAttr === "pool" || id === "add-token-pool" || text === "add to pool";
        const isInsert =
          modeAttr === "insert" ||
          id === "add-token" ||
          text === "add to pool & panel" ||
          text === "add & insert" ||
          text === "add token";

        if (!isPool && !isInsert) return;

        // ✅ critical: stop default behavior (a/form submit)
        ev.preventDefault();
        ev.stopPropagation();

        const input = document.getElementById("search-input");
        if (!input) return;

        const keepTokenInputFocus = Date.now() < Number(__fbTokenInputKeepFocusUntil || 0);
        if (!keepTokenInputFocus) {
          try { (btn && btn.blur) && btn.blur(); } catch (_) {}
          try { (document.activeElement && document.activeElement.blur) && document.activeElement.blur(); } catch (_) {}
        } else {
          fbMobileFocusTokenInputNow(input);
        }
        fbHideFuzzyNote();

        const rawInputForHistory = fbNormaliseTokenInputValue(input.value || "").trim().replace(/\s+/g, " ");
        const rawTokens = parseTokensFromInput(input.value);
        if (!rawTokens.length) return;

        const mode = isPool ? "pool" : "insert";
        const doInsert = mode === "insert";

        // Async fuzzy check + correction at add-time (PC + mobile)
        (async () => {
          try { fbEnsureExprNodeIds(state.expr); } catch (_) {}
          const beforePool = readTokens();
          const beforePoolLower = new Set(beforePool.map((x) => String(x || "").trim().toLowerCase()));
          const __fbAnimStartRect = (() => { try { return input.getBoundingClientRect(); } catch (_) { return null; } })();
          const __fbAnimStartPt = fbInputStartPoint(input) || null;
          const __fbAnimBoardFirst = doInsert ? fbCaptureBoardChipRects() : null;


          const swaps = [];
          const swapMapUndo = {};     // corrected -> original (for Edit as typed)
          const tokenAddsOnEdit = []; // originals to add if corrected token already existed in pool
          const corrected = [];

          for (const tok0 of rawTokens) {
            const from = String(tok0 || "").trim().replace(/\s+/g, " ");
            if (!from) continue;
            if (fbIsGarbageToken(from)) continue;

            let has = false;
            try { has = await fbHasAnyMatchForTermCached(from); } catch (_) { has = false; }
            if (has) {
              corrected.push(from);
              continue;
            }

            let to = "";
            try { to = await fbSuggestPhraseForAdd(from); } catch (_) { to = ""; }
            to = String(to || "").trim().replace(/\s+/g, " ");

            if (to) {
              // Preserve leading uppercase
              if (/^[A-Z]/.test(from)) to = to.charAt(0).toUpperCase() + to.slice(1);

              // Ensure suggested token actually has matches (avoid false positives)
              let ok = true;
              try { ok = await fbHasAnyMatchForTermCached(to); } catch (_) { ok = true; }

              if (ok && to.toLowerCase() !== from.toLowerCase()) {
                corrected.push(to);
                swaps.push([from, to]);

                if (!beforePoolLower.has(String(to).toLowerCase())) swapMapUndo[to] = from;
                else tokenAddsOnEdit.push(from);

                continue;
              }
            }

            corrected.push(from);
          }


          const __fbAnimNewTokens = corrected.filter((t) => !beforePoolLower.has(String(t).toLowerCase()));
          const __fbAnimInsertedNodeIds = [];
          // 1) Add to token pool
          state.tokens = addTokensToStorage(corrected);

          // 2) Optionally insert TERM(s) into panel expression (no implicit operators)
          if (doInsert && corrected.length) {
            pushHistory();
            state.cursor = clamp(state.cursor, 0, state.expr.length);
            for (const t of corrected) {
              const __node = TERM(t);
              try { __fbAnimInsertedNodeIds.push(__node.__fbid); } catch (_) {}
              state.expr.splice(state.cursor, 0, __node);
              state.cursor += 1;
            }
            state.cursor = clamp(state.cursor, 0, state.expr.length);
          }

          // Animation: hide only targets that will actually be animated. Earlier versions hid
          // every inserted node but animated at most two of them, which could leave invisible
          // chips occupying space in the panel when multiple tokens were added at once.
          const __fbAnimHideTokens = (__fbAnimStartPt
            ? __fbAnimNewTokens.slice(0, doInsert ? 1 : 3)
            : []);
          const __fbAnimHideNodeIds = doInsert ? __fbAnimInsertedNodeIds.slice(0, 2) : [];
          try {
            state.animHideTokens = new Set(__fbAnimHideTokens.map(x => String(x||"").trim().replace(/\s+/g," ")));
            state.animHideNodeIds = new Set(__fbAnimHideNodeIds.map(x => String(x||"")));
          } catch (_) {}

          if (rawInputForHistory) fbAddTokenInputHistory(rawInputForHistory);
          input.value = "";
          try { fbHideTokenInputDropdown(); } catch (_) {}
          clearStatus();
          render();
          if (Date.now() < Number(window.__fbTokenInputEnterBlurUntilV4 || 0)) {
            try { fbBlurTokenInputAfterEnterAdd(input); } catch (_) {}
          }
          // --- Animations (non-blocking): fly token(s) to pool / board + FLIP board reflow ---
          try {
            fbRunAddTokenAnimations({
              mode,
              startRect: __fbAnimStartRect,
              startPt: __fbAnimStartPt,
              newTokens: __fbAnimNewTokens,
              boardFirst: __fbAnimBoardFirst,
              insertTokens: corrected || [],
              insertNodeIds: __fbAnimInsertedNodeIds || [],
            });
          } catch (_) {}


          // 3) Show correction note (if any)
          if (swaps.length) {
            const exprNow = tokensToExprText(normalizeNodesToTokens(state.expr));
            const msg = swaps
              .map(([a, b]) => `<code>${escapeHtml(b)}</code> instead of <code>${escapeHtml(a)}</code>`)
              .join(", ");

            const verb = doInsert ? "Inserted" : "Added";
            const origExprPayload = snapshot().expr;

            fbShowFuzzyNote(
              `<div class="fb-fuzzy-msg">Typo detected. ${verb} ${msg}.</div>
               <div class="fb-fuzzy-actions">
                 <button type="button" class="fb-fuzzy-btn fb-fuzzy-btn--undo" data-fb-fuzzy-act="edit">Edit as typed</button>
               </div>`,
              { origExpr: origExprPayload, tokenSwaps: swapMapUndo, tokenAddsOnEdit, forExprText: exprNow }
            );
          }

          if (doInsert) {
            if (Date.now() < Number(window.__fbTokenInputEnterBlurUntilV4 || 0)) {
              try { fbBlurTokenInputAfterEnterAdd(input); } catch (_) {}
            } else if (keepTokenInputFocus) fbRefocusTokenInputAfterAdd();
            else focusPanelSoon();
          }
        })();
      },
      true
    );
  }

  // Handshake for search-results.js autoflow + listener for pending token dispatch
  fbBindAutofillListenerOnce();
  fbMarkReadyV1();


}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("DOMContentSwitch", init);


  // v8: repeated cleanup because instant navigation may reuse old DOM/classes.
  try {
    [0, 40, 120, 280, 700, 1200].forEach((ms) => setTimeout(fbClearNoBlurResidueV8, ms));
    document.addEventListener("DOMContentSwitch", () => {
      [0, 40, 120, 280, 700].forEach((ms) => setTimeout(fbClearNoBlurResidueV8, ms));
    });
    window.addEventListener("pageshow", () => {
      [0, 40, 120, 280, 700].forEach((ms) => setTimeout(fbClearNoBlurResidueV8, ms));
    }, { passive: true });
  } catch (_) {}
  try { window.__mkFindNoBlurCleanupV8 = fbClearNoBlurResidueV8; } catch (_) {}
  try { window.dispatchEvent(new CustomEvent("fb:ready")); } catch (_) {}
})();
