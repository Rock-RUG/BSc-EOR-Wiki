// docs/javascripts/ui-guard.js
// Mobile reliability layer for MkDocs Material + custom JS.
// Goals:
// 1) Fix iOS/Android cases where tap does not generate click for header/menu/search controls and normal Markdown links,
//    while preserving Material "instant navigation" whenever possible.
// 2) Provide a robust mobile search backdrop (blur/dim) WITHOUT blocking the search UI (caret, suggestions, history).
// 3) Clean up stale overlay/scroll-lock states that can randomly break tapping.
// 4) Defensive cleanup for occasional duplicate/stray injected lines.
(function () {
  const isMobile = (() => {
    try {
      if (!window.matchMedia) return false;

      // Phone-only: exclude tablets that render the desktop header/search layout.
      // (Tablets are usually coarse pointer AND have both dimensions fairly large.)
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      if (!coarse) return false;

      const isTablet =
        window.matchMedia('(min-width: 768px)').matches &&
        window.matchMedia('(min-height: 700px)').matches;

      return !isTablet;
    } catch (_) {
      return false;
    }
  })();

  if (!isMobile) return;

  // ----------------------- force top on every page open/navigation -----------------------
  const FORCE_TOP_DELAYS = [0, 50, 140, 320];

  function setHistoryScrollManual() {
    try {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    } catch (_) {}
  }

  function clearSavedScrollState() {
    try { sessionStorage.removeItem('__md_scroll_y__'); } catch (_) {}
    try { sessionStorage.removeItem('__material_scroll_top'); } catch (_) {}
    try { sessionStorage.removeItem('mk_last_scroll_y'); } catch (_) {}
  }

  function setScrollTopNow() {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    } catch (_) {}
    try { window.scrollTo(0, 0); } catch (_) {}
  }

  let __mkForceTopSeq = 0;

  function scheduleForceTop(delay) {
    const seq = ++__mkForceTopSeq;
    window.setTimeout(() => {
      try {
        if (seq !== __mkForceTopSeq) return;
        clearSavedScrollState();
        setHistoryScrollManual();
        setScrollTopNow();
        requestAnimationFrame(() => {
          try {
            if (seq !== __mkForceTopSeq) return;
            setScrollTopNow();
          } catch (_) {}
        });
      } catch (_) {}
    }, Math.max(0, Number(delay) || 0));
  }

  function forceTopBurst(delays) {
    const list = Array.isArray(delays) && delays.length ? delays : FORCE_TOP_DELAYS;
    clearSavedScrollState();
    setHistoryScrollManual();
    list.forEach((ms) => scheduleForceTop(ms));
  }


  // ----------------------- helpers -----------------------
  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function isHeaderSearchShell(el) {
    return !!(el && el.closest && el.closest('.md-header .md-search'));
  }

  function getHeaderSearchShell() {
    try {
      const active = document.activeElement;
      if (active && active.matches && active.matches('input[data-md-component="search-query"]')) {
        const shell = active.closest('.md-search');
        if (isHeaderSearchShell(shell)) return shell;
      }
    } catch (_) {}

    return (
      q('.md-header .md-search.md-search--active') ||
      q('.md-header .md-search') ||
      null
    );
  }

  function getHeaderSearchInner() {
    const shell = getHeaderSearchShell();
    return (shell && q('.md-search__inner', shell)) || q('.md-header .md-search__inner') || null;
  }

  function getHeaderSearchForm() {
    const shell = getHeaderSearchShell();
    return (shell && q('.md-search__form', shell)) || q('.md-header .md-search__form') || null;
  }

  function getHeaderSearchOutput() {
    const shell = getHeaderSearchShell();
    return (shell && q('.md-search__output', shell)) || q('.md-header .md-search__output') || null;
  }

  function getHeaderSearchScrollwrap() {
    const shell = getHeaderSearchShell();
    return (shell && q('.md-search__scrollwrap', shell)) || q('.md-header .md-search__scrollwrap') || null;
  }

  function getHeaderSearchInput() {
    try {
      const active = document.activeElement;
      if (active && active.matches && active.matches('input[data-md-component="search-query"]') && isHeaderSearchShell(active.closest('.md-search'))) {
        return active;
      }
    } catch (_) {}

    const shell = getHeaderSearchShell();
    return (shell && q('input[data-md-component="search-query"]', shell)) || q('.md-header input[data-md-component="search-query"]') || null;
  }

  function getSearchToggle() {
    return (
      q('input.md-toggle[data-md-toggle="search"]') ||
      q('input#__search') ||
      q('#__search')
    );
  }

  function isSearchUiVisibleEl(el) {
    try {
      if (!el || !el.getBoundingClientRect) return false;
      const cs = window.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity || 1) === 0) return false;
      const r = el.getBoundingClientRect();
      return !!(r && Number.isFinite(r.width) && Number.isFinite(r.height) && r.width > 24 && r.height > 18);
    } catch (_) {
      return false;
    }
  }

  function hasCheapSearchOpenSignal() {
    try {
      const toggle = getSearchToggle();
      if (toggle && toggle.checked) return true;
      const html = document.documentElement;
      const body = document.body;
      if (html && html.classList && html.classList.contains('md-search--active')) return true;
      if (body && body.classList && body.classList.contains('md-search--active')) return true;
      const active = document.activeElement;
      if (
        active &&
        active.matches &&
        active.matches('input[data-md-component="search-query"]') &&
        isHeaderSearchShell(active.closest('.md-search'))
      ) return true;
      const shell = getHeaderSearchShell();
      if (shell && shell.classList && shell.classList.contains('md-search--active')) return true;
      if (shell && shell.getAttribute && shell.getAttribute(FORCE_ACTIVE_ATTR) === '1') return true;
      return false;
    } catch (_) {
      return false;
    }
  }

  function isSearchActive() {
    const html = document.documentElement;
    const body = document.body;
    const toggle = getSearchToggle();

    if (toggle && toggle.checked) return true;
    if (html && html.classList && html.classList.contains('md-search--active')) return true;
    if (body && body.classList && body.classList.contains('md-search--active')) return true;

    try {
      const active = document.activeElement;
      if (
        active &&
        active.matches &&
        active.matches('input[data-md-component="search-query"]') &&
        isHeaderSearchShell(active.closest('.md-search'))
      ) return true;
    } catch (_) {}

    const explicitClose = hasExplicitSearchClose();
    const graceActive = !explicitClose && hasSearchActiveGrace();

    if (graceActive) {
      const shell = getHeaderSearchShell();
      const liveInput = getHeaderSearchInput();
      if (liveInput) return true;
      if (shell && shell.getAttribute && shell.getAttribute(FORCE_ACTIVE_ATTR) === '1') return true;
    }

    // The geometry fallback is deliberately gated. Calling getComputedStyle() and
    // getBoundingClientRect() from global MutationObservers forces layout on busy
    // pages; only pay that cost while a search open/settle signal is already live.
    if (!explicitClose && (__mkSearchBackdropLatch || graceActive)) {
      const shell = getHeaderSearchShell();
      const inner = getHeaderSearchInner();
      const form = getHeaderSearchForm();
      const out = getHeaderSearchOutput();
      if (isSearchUiVisibleEl(shell) && (isSearchUiVisibleEl(form) || isSearchUiVisibleEl(inner) || isSearchUiVisibleEl(out))) {
        return true;
      }
    }

    return false;
  }

  function isInExemptUi(el) {
    if (!el || !el.closest) return false;
    return !!el.closest(
      '#lp-side-panel, #lp-map-modal, #mm-modal, #custom-random-banner, #find-builder, .mk-search-history, .mk-search-suggest'
    );
  }

  function isSearchDropdownUi(el) {
    if (!el || !el.closest) return false;
    return !!el.closest('.mk-search-history, .mk-search-suggest, .md-search__output');
  }

  function isSameOriginUrl(href) {
    try {
      const u = new URL(href, document.baseURI);
      return u.origin === window.location.origin;
    } catch (_) {
      return false;
    }
  }

  function toAbs(href) {
    try { return new URL(href, document.baseURI).toString(); } catch (_) { return String(href || ''); }
  }

  function stripHash(u) {
    try {
      const x = new URL(u, document.baseURI);
      x.hash = '';
      return x.toString();
    } catch (_) {
      return String(u || '').split('#')[0];
    }
  }

  function isHashOnly(href) {
    const h = String(href || '');
    return h.startsWith('#') && h.length > 1;
  }

  function canNavigate(a) {
    if (!a) return false;
    const href = a.getAttribute('href') || '';
    if (!href) return false;
    if (a.getAttribute('target') === '_blank') return false;
    if (a.hasAttribute('download')) return false;
    if (/^(mailto|tel):/i.test(href)) return false;
    if (!isSameOriginUrl(href) && !isHashOnly(href)) return false;
    return true;
  }

  function cssZ(el) {
    try {
      if (!el) return null;
      const z = window.getComputedStyle(el).zIndex;
      const n = parseInt(z, 10);
      return Number.isFinite(n) ? n : null;
    } catch (_) {
      return null;
    }
  }

  // ----------------------- Mobile search backdrop -----------------------
  const BACKDROP_ID = 'mk-mobile-search-backdrop';
  const STYLE_ID = 'mk-mobile-search-guard-style';
  const FORCE_ACTIVE_ATTR = 'data-mk-search-force-active';
  let __mkSearchActiveGraceUntil = 0;
  let __mkSearchDismissSuppressUntil = 0;
  let __mkMathRepairTimer = 0;
  const __mkHeaderTitleSwapState = { siteTitle: '', pageTitle: '' };

  const FIXED_CHROME_STYLE_ID = 'mk-mobile-fixed-chrome-style';
  const MOBILE_CHROME_CLASS = 'mk-mobile-fixed-chrome';
  let __mkChromeSyncRaf = 0;
  // Last-written mobile-chrome metrics, so syncMobileChromeMetrics() only writes
  // the --mk-mobile-* custom properties when a value actually changed (writing a
  // var on <html> invalidates/repaints the whole tree, including the header).
  let __mkLastHeaderH = -1;
  let __mkLastTabsH = -1;
  let __mkLastTotalH = -1;
  // Sticky "search backdrop is open" latch. Prevents a one-frame isSearchActive()
  // false (during keyboard animation / search DOM mutations) from tearing down
  // the blur and the header z-index elevation, which caused the header top row +
  // blur to flicker when opening search away from the top of the page.
  let __mkSearchBackdropLatch = false;
  // Idempotency state for syncBackdrop(): the last resolved state signature and
  // active flag, so the mutation-driven sync loop writes nothing (and re-composites
  // nothing) when the search backdrop state has not actually changed.
  let __mkLastSyncSig = '';
  let __mkLastSyncActive = false;
  // Bounded re-assert loop that keeps md-search--active pinned during the iOS URL
  // bar settle window after opening search (see startSearchOpenReassertLoop).
  let __mkReassertUntil = 0;
  let __mkReassertRaf = 0;
  // Last translateY offset applied to the fixed chrome to keep it pinned to the
  // visual viewport top while the iOS keyboard is open (see pinFixedChromeToVisualViewport).
  let __mkLastChromeOffset = -1;


  function markSearchActiveGrace(ms) {
    const extra = Math.max(420, Number(ms) || 0);
    const until = Date.now() + extra;
    if (until > __mkSearchActiveGraceUntil) __mkSearchActiveGraceUntil = until;
    try {
      const prev = Number(window.__mkFindHeaderSearchGraceUntil || 0);
      if (until > prev) window.__mkFindHeaderSearchGraceUntil = until;
    } catch (_) {}
    try { window.__mkHeaderSearchUserTouchTs = Date.now(); } catch (_) {}
  }

  function clearSearchActiveGrace() {
    __mkSearchActiveGraceUntil = 0;
    try { window.__mkFindHeaderSearchGraceUntil = 0; } catch (_) {}
  }

  function hasSearchActiveGrace() {
    try {
      const shared = Number(window.__mkFindHeaderSearchGraceUntil || 0);
      return Date.now() < Math.max(__mkSearchActiveGraceUntil, shared);
    } catch (_) {
      return Date.now() < __mkSearchActiveGraceUntil;
    }
  }

  function hasExplicitSearchClose() {
    try {
      const shared = Number(window.__mkSearchHistoryExplicitCloseUntil || 0);
      return Date.now() < shared;
    } catch (_) {
      return false;
    }
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = `@media (max-width: 900px), (pointer: coarse){
  /* Caret visibility on iOS */
  .md-header .md-search__form input[data-md-component="search-query"]{ caret-color: var(--md-accent-fg-color) !important; }

  /* Overlay must never capture taps; we use our own backdrop for blur/dim */
  .md-header .md-search__overlay{ pointer-events:none !important; background: transparent !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important; }
  .md-header .md-search__inner{ z-index:1 !important; position: relative !important; overflow: visible !important; }
  .md-header .md-search__form{ z-index:2 !important; }

  /* Never blur the search panel itself */
  .md-header .md-search__inner, .md-header .md-search__form{ filter:none !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important; opacity: 1 !important; }

  /* --------------------------------------------
     Search UI visibility gating (mobile)
     Default: keep search UI fully hidden to avoid stray borders/boxes
     Active: show search UI when Material search toggle is active
     -------------------------------------------- */
  .md-header .md-search__inner,
  .md-header .md-search__output{
    display:none !important;
    visibility:hidden !important;
    opacity:0 !important;
    pointer-events:none !important;
  }

  /* Active (theme class / shell class / focus / temporary force-active latch) */
  html.md-search--active .md-header .md-search__inner,
  body.md-search--active .md-header .md-search__inner,
  html.md-search--active .md-header .md-search__output,
  body.md-search--active .md-header .md-search__output,
  .md-header .md-search.md-search--active .md-search__inner,
  .md-header .md-search.md-search--active .md-search__output,
  .md-header .md-search:focus-within .md-search__inner,
  .md-header .md-search:focus-within .md-search__output,
  .md-header .md-search[data-mk-search-force-active="1"] .md-search__inner,
  .md-header .md-search[data-mk-search-force-active="1"] .md-search__output{
    display:block !important;
    visibility:visible !important;
    opacity:1 !important;
    pointer-events:auto !important;
  }

  /* Active (checkbox toggle) – __search is a sibling of .md-header in Material */
  input.md-toggle[data-md-toggle="search"]:checked ~ .md-header .md-search__inner,
  input.md-toggle[data-md-toggle="search"]:checked ~ .md-header .md-search__output,
  #__search:checked ~ .md-header .md-search__inner,
  #__search:checked ~ .md-header .md-search__output{
    display:block !important;
    visibility:visible !important;
    opacity:1 !important;
    pointer-events:auto !important;
  }

  /* Ensure output/list can show above keyboard (only matters when visible) */
  .md-header .md-search__output{ z-index:3 !important; }
  .md-header .md-search-result__list{
    display:block !important;
    max-height: calc(100dvh - 140px - env(safe-area-inset-bottom, 0px));
    overflow:auto;
    -webkit-overflow-scrolling: touch;
  }

  /* Keep stacking context, but DO NOT force position: fixed (iOS transforms would make it scroll) */
  .md-header .md-search{ isolation:isolate; }

  /* ---------------------------------------------------------------
     Defeat Material's mobile search scroll-lock.
     On open, Material sets the body to position:fixed; top:-<scrollY>px to
     "freeze" the background. With our custom fixed header that lock drags the
     whole page — and the header — out of view when the user is scrolled down,
     and fighting it from JS produced a visible flicker. Keeping the body in
     normal flow (via !important, which beats Material's inline styles) means
     opening search adds only the blur + keyboard, with zero scroll movement.
     The blur backdrop is fixed:inset:0, so the frozen-look still holds.
     --------------------------------------------------------------- */
  html[data-md-scrollfix],
  body[data-md-scrollfix],
  html.md-search--active,
  body.md-search--active,
  html.md-search--active body,
  input.md-toggle[data-md-toggle="search"]:checked ~ * body,
  #__search:checked ~ * body{
    position: static !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    width: auto !important;
    height: auto !important;
    overflow: visible !important;
  }

  /* Remove search overlay animations on mobile (reduce flicker/jank) */
  .md-header .md-search__overlay,
  .md-header .md-search__inner,
  .md-header .md-search__output,
  .md-header .md-search__form{ transition:none !important; animation:none !important; }

  /* Kill the iOS touch-callout / tiny "Clear" bubble under the right-side X */
  .md-header [data-mk-clear-tooltip-killed="1"],
  .md-header [data-mk-clear-tooltip-killed="1"] *,
  .md-header .md-search__form [title],
  .md-header .md-search__form [aria-label]{
    -webkit-touch-callout:none !important;
    -webkit-user-select:none !important;
    user-select:none !important;
    -webkit-tap-highlight-color:transparent !important;
  }

  .md-header [data-mk-clear-tooltip-killed="1"]::before,
  .md-header [data-mk-clear-tooltip-killed="1"]::after,
  .md-header [data-mk-clear-tooltip-killed="1"] *::before,
  .md-header [data-mk-clear-tooltip-killed="1"] *::after{
    content:none !important;
    display:none !important;
  }

  /* Prevent mysterious horizontal slide/black gap when opening search (iOS Safari) */
  html.mk-no-search-slide,
	  html.mk-no-search-slide body{ overflow-x:hidden !important; background: var(--md-default-bg-color) !important; }

  html.mk-no-search-slide .md-container,
  html.mk-no-search-slide .md-main,
  html.mk-no-search-slide .md-content,
  html.mk-no-search-slide .md-grid,
  html.mk-no-search-slide .md-header,
	  html.mk-no-search-slide .md-tabs,
	  html.mk-no-search-slide .md-header .md-search,
	  html.mk-no-search-slide .md-header .md-search__inner,
	  html.mk-no-search-slide .md-header .md-search__overlay{ transition:none !important; animation:none !important; transform:none !important; }

}`;
    document.head.appendChild(st);
  }

  function desiredBackdropZ() {
    const search = getHeaderSearchShell();
    const header = q('.md-header');
    let z = cssZ(search) || cssZ(header) || 2000;
    if (z < 50) z = 2000;
    return Math.max(10, z - 1);
  }

  function ensureBackdrop() {
    let el = document.getElementById(BACKDROP_ID);
    if (el) return el;

    el = document.createElement('div');
    el.id = BACKDROP_ID;
    // Always non-blocking. Full-viewport (inset:0) blur.
    //
    // The chrome (header + tabs) stays sharp because syncBackdrop() raises it
    // above this backdrop via z-index, not because the backdrop avoids the header
    // region. A full inset:0 backdrop is required so the visible area is always
    // covered regardless of the iOS keyboard's visualViewport offset: when the
    // keyboard pushes the visual viewport down within the layout viewport, the
    // fixed chrome is re-pinned by translateY(offsetTop) (pinFixedChromeToVisualViewport),
    // and an inset:0 backdrop still blurs everything under it with no unblurred
    // strip. (An earlier "start below the chrome" variant was based on a
    // disproven backdrop-filter-flicker theory and broke once the chrome moved.)
    el.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'right:0',
      'bottom:0',
      'display:none',
      'pointer-events:none',
      // lighter dim than before; rely on blur to convey depth
      'background:rgba(0,0,0,.18)',
      'backdrop-filter:blur(7px) saturate(1.05)',
      '-webkit-backdrop-filter:blur(7px) saturate(1.05)',
      'contain:layout style paint',
      'will-change:opacity'
    ].join(';');

    // mask defaults (Safari needs -webkit-*)
    try {
      el.style.webkitMaskRepeat = 'no-repeat';
      el.style.maskRepeat = 'no-repeat';
      el.style.webkitMaskSize = '100% 100%';
      el.style.maskSize = '100% 100%';
      el.style.webkitMaskPosition = '0 0';
      el.style.maskPosition = '0 0';
    } catch (_) {}

    document.body.appendChild(el);
    return el;
  }

  // --------- Backdrop "hole" mask (rounded shape like desktop) ---------
  let __mkMaskRaf = 0;
  let __mkLastMaskKey = '';

  function clampNum(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function pxFromCss(v, refEl) {
    if (!v) return 0;
    const s = String(v).trim();
    const first = s.split(/\s+/)[0];
    const n = parseFloat(first);
    if (!Number.isFinite(n)) return 0;
    if (first.endsWith('px')) return n;
    if (first.endsWith('rem')) {
      const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return n * fs;
    }
    if (first.endsWith('em')) {
      const fs = parseFloat(getComputedStyle(refEl || document.body).fontSize) || 16;
      return n * fs;
    }
    return n;
  }

  function parseRadiusPx(el, w, h) {
    if (!el) return 18;
    let r = 18;
    try {
      const br = getComputedStyle(el).borderRadius || '';
      const token = br.split('/')[0].trim();
      const first = token.split(/\s+/)[0] || token;
      if (first.endsWith('%')) {
        const p = parseFloat(first);
        if (Number.isFinite(p)) r = (Math.min(w, h) * p) / 100;
      } else {
        r = pxFromCss(first, el) || r;
      }
    } catch (_) {}
    r = clampNum(r, 0, Math.min(w, h) / 2);
    return r;
  }

  function rectUnion(a, b) {
    if (!a) return b || null;
    if (!b) return a;
    return {
      left: Math.min(a.left, b.left),
      top: Math.min(a.top, b.top),
      right: Math.max(a.right, b.right),
      bottom: Math.max(a.bottom, b.bottom)
    };
  }

  function isVisibleRect(el) {
    if (!el || !el.getBoundingClientRect) return null;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return null;
    const r = el.getBoundingClientRect();
    if (!Number.isFinite(r.width) || !Number.isFinite(r.height) || r.width < 10 || r.height < 10) return null;
    return r;
  }

  function getHoleTarget() {
    // No mask cutouts at all.
    //
    // While search is open, the header and the entire `.md-search` shell (search
    // bar, history and results) are raised above the blur backdrop via z-index in
    // syncBackdrop(), so the whole search UI already renders crisply on top of the
    // blur without any SVG mask hole. The mask was therefore redundant, and it was
    // the cause of two device bugs:
    //   1. The dropdown hole, placed using visualViewport.offsetTop, landed
    //      mid-screen over sharp page content when scrolled + keyboard up (the
    //      "unblurred hole").
    //   2. Re-applying webkitMaskImage on every visualViewport scroll/resize event
    //      (a stream of them while the iOS keyboard is up and the page isn't at the
    //      top) forces Safari to recomposite the backdrop-filter, flashing the blur
    //      off and back on — the whole-screen blur→clear→blur pulsing.
    // Returning null makes applyBackdropMask() clear any mask and bail, so the
    // backdrop stays a single, stable, uniform blur and never re-composites.
    return null;
  }

  function parseCornerRadiiPx(el, w, h) {
    if (!el) return { tl: 0, tr: 0, br: 0, bl: 0 };
    const cs = getComputedStyle(el);

    function one(prop) {
      const v = cs && cs[prop] ? String(cs[prop]) : '';
      if (!v) return 0;
      const token = v.split('/')[0].trim();
      const first = token.split(/\s+/)[0] || token;
      if (first.endsWith('%')) {
        const p = parseFloat(first);
        return Number.isFinite(p) ? (Math.min(w, h) * p) / 100 : 0;
      }
      return pxFromCss(first, el) || 0;
    }

    const maxR = Math.min(w, h) / 2;
    const tl = clampNum(one('borderTopLeftRadius'), 0, maxR);
    const tr = clampNum(one('borderTopRightRadius'), 0, maxR);
    const br = clampNum(one('borderBottomRightRadius'), 0, maxR);
    const bl = clampNum(one('borderBottomLeftRadius'), 0, maxR);

    return { tl, tr, br, bl };
  }

  function roundedRectPath(x, y, w, h, r) {
    const tl = clampNum((r && r.tl) || 0, 0, Math.min(w, h) / 2);
    const tr = clampNum((r && r.tr) || 0, 0, Math.min(w, h) / 2);
    const br = clampNum((r && r.br) || 0, 0, Math.min(w, h) / 2);
    const bl = clampNum((r && r.bl) || 0, 0, Math.min(w, h) / 2);

    // SVG path with per-corner radii.
    return (
      'M ' + (x + tl) + ' ' + y +
      ' H ' + (x + w - tr) +
      (tr ? (' A ' + tr + ' ' + tr + ' 0 0 1 ' + (x + w) + ' ' + (y + tr)) : (' L ' + (x + w) + ' ' + y)) +
      ' V ' + (y + h - br) +
      (br ? (' A ' + br + ' ' + br + ' 0 0 1 ' + (x + w - br) + ' ' + (y + h)) : (' L ' + (x + w) + ' ' + (y + h))) +
      ' H ' + (x + bl) +
      (bl ? (' A ' + bl + ' ' + bl + ' 0 0 1 ' + x + ' ' + (y + h - bl)) : (' L ' + x + ' ' + (y + h))) +
      ' V ' + (y + tl) +
      (tl ? (' A ' + tl + ' ' + tl + ' 0 0 1 ' + (x + tl) + ' ' + y) : (' L ' + x + ' ' + y)) +
      ' Z'
    );
  }

  function buildMaskSvg(vw, vh, paths) {
    const holes = (paths || []).map((d) => '<path d="' + d + '" fill="black"/>').join('');
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + vw + '" height="' + vh + '" viewBox="0 0 ' + vw + ' ' + vh + '">' +
        '<defs>' +
          '<mask id="m" maskUnits="userSpaceOnUse">' +
            '<rect x="0" y="0" width="' + vw + '" height="' + vh + '" fill="white"/>' +
            holes +
          '</mask>' +
        '</defs>' +
        '<rect x="0" y="0" width="' + vw + '" height="' + vh + '" fill="white" mask="url(#m)"/>' +
      '</svg>'
    );
  }

  function applyBackdropMask() {
    const bd = ensureBackdrop();
    if (!bd || bd.style.display === 'none') return;

    const t = getHoleTarget();
    if (!t || !t.holes || !t.holes.length) {
      if (__mkLastMaskKey) {
        __mkLastMaskKey = '';
        try { bd.style.webkitMaskImage = ''; bd.style.maskImage = ''; } catch (_) {}
      }
      return;
    }

    const vp = window.visualViewport;

    // IMPORTANT (iOS keyboard): backdrop is fixed to the *layout viewport*.
    // Use the backdrop's own box size and convert from visualViewport coords.
    const bdRect = bd.getBoundingClientRect();
    const vw = Math.ceil(bdRect.width || document.documentElement.clientWidth || window.innerWidth);
    const vh = Math.ceil(bdRect.height || document.documentElement.clientHeight || window.innerHeight);

    const ox = (vp && Number.isFinite(vp.offsetLeft)) ? vp.offsetLeft : 0;
    const oy = (vp && Number.isFinite(vp.offsetTop)) ? vp.offsetTop : 0;

    // IMPORTANT:
    // On iOS Safari, rounding (Math.round) can introduce a 1px drift when
    // elements are positioned on half-pixels (e.g. 104.5px). We keep
    // subpixel precision and avoid the previous 2px "safety" padding, since
    // the dark scheme uses translucent surfaces and even a tiny oversize hole
    // shows up as a mismatch ring.
    const r2 = (n) => Math.round((n || 0) * 100) / 100;
    const basePad = 0; // no artificial expansion; rely on precise geometry

    const paths = [];
    const keyParts = [vw, vh];

    for (const hole of t.holes) {
      const r0 = hole && hole.rect ? hole.rect : null;
      if (!r0) continue;

      const padHole = basePad;

      const hx = clampNum((r0.left + ox - padHole), 0, vw);
      const hy = clampNum((r0.top + oy - padHole), 0, vh);
      const hr = clampNum((r0.right + ox + padHole), 0, vw);
      const hb = clampNum((r0.bottom + oy + padHole), 0, vh);
      const hw = Math.max(0, hr - hx);
      const hh = Math.max(0, hb - hy);
      if (hw < 6 || hh < 6) continue;

      let radii = { tl: 0, tr: 0, br: 0, bl: 0 };

      // Unified "combo" hole: top corners from the bar, bottom corners from dropdown.
      if (hole && hole.kind === 'combo' && hole.combo) {
        const c = hole.combo;
        const tr0 = c.topRect || r0;
        const br0 = c.bottomRect || r0;
        const wTop = Math.max(1, tr0.width || (tr0.right - tr0.left) || hw);
        const hTop = Math.max(1, tr0.height || (tr0.bottom - tr0.top) || 44);
        const wBot = Math.max(1, br0.width || (br0.right - br0.left) || hw);
        const hBot = Math.max(1, br0.height || (br0.bottom - br0.top) || 120);

        let top = c.topEl ? parseCornerRadiiPx(c.topEl, wTop, hTop) : { tl: 0, tr: 0, br: 0, bl: 0 };
        let bot = c.bottomEl ? parseCornerRadiiPx(c.bottomEl, wBot, hBot) : { tl: 0, tr: 0, br: 0, bl: 0 };

        const sumTop = (top.tl || 0) + (top.tr || 0) + (top.br || 0) + (top.bl || 0);
        const sumBot = (bot.tl || 0) + (bot.tr || 0) + (bot.br || 0) + (bot.bl || 0);

        if (sumTop < 4) {
          const pill = clampNum(hTop / 2, 0, Math.min(wTop, hTop) / 2);
          top = { tl: pill, tr: pill, br: pill, bl: pill };
        }
        if (sumBot < 4) {
          const pill = clampNum(hBot / 2, 0, Math.min(wBot, hBot) / 2);
          bot = { tl: pill, tr: pill, br: pill, bl: pill };
        }

        radii = { tl: top.tl, tr: top.tr, br: bot.br, bl: bot.bl };
      } else {
        radii = hole.el ? parseCornerRadiiPx(hole.el, hw, hh) : radii;
      }

      // Dark-mode quirk: Material can draw the rounded search bar background via ::before,
      // so computed radii may be 0px on the form. Ensure a pill-shaped cutout for the bar.
      if (hole && hole.kind === 'form') {
        const sum = (radii.tl || 0) + (radii.tr || 0) + (radii.br || 0) + (radii.bl || 0);
        if (sum < 4) {
          const pill = clampNum(hh / 2, 0, Math.min(hw, hh) / 2);
          radii = { tl: pill, tr: pill, br: pill, bl: pill };
        }
      }

      const d = roundedRectPath(hx, hy, hw, hh, radii);

      paths.push(d);
      keyParts.push(r2(hx), r2(hy), r2(hw), r2(hh), r2(radii.tl), r2(radii.tr), r2(radii.br), r2(radii.bl));
    }

    if (!paths.length) return;

    const key = keyParts.join(',');
    if (key === __mkLastMaskKey) return;
    __mkLastMaskKey = key;

    const svg = buildMaskSvg(vw, vh, paths);
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

    try {
      bd.style.webkitMaskImage = 'url("' + url + '")';
      bd.style.maskImage = 'url("' + url + '")';
      bd.style.webkitMaskSize = '100% 100%';
      bd.style.maskSize = '100% 100%';
    } catch (_) {}
  }

  function scheduleBackdropMask() {
    if (__mkMaskRaf) return;
    __mkMaskRaf = requestAnimationFrame(() => {
      __mkMaskRaf = 0;
      applyBackdropMask();
    });
  }


  function syncMobileHeaderSearchActions() {
    try {
      const form = getHeaderSearchForm();
      if (!form) return;

      const formRect = form.getBoundingClientRect();
      if (!Number.isFinite(formRect.width) || formRect.width < 120) return;

      // Only consider controls that are currently visible. Crucially we never
      // un-hide controls here: the previous version removed display from every
      // control on each call and then re-hid the duplicates, so on the stream of
      // syncs fired while the iOS keyboard animates the header action buttons
      // blinked visible -> hidden every frame. Hiding is now idempotent (we skip
      // controls already marked hidden), so once the duplicates are collapsed the
      // function makes no further DOM changes and the header stops flickering.
      const visible = qa('button, label, a, [role="button"]', form).filter((el) => {
        try {
          if (!el || !el.getBoundingClientRect) return false;
          if (el.dataset && el.dataset.mkMobileSearchActionHidden === '1') return false;
          if (el.closest('.md-search__output, .mk-search-history, .mk-search-suggest')) return false;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity || 1) === 0) return false;
          const r = el.getBoundingClientRect();
          return Number.isFinite(r.width) && Number.isFinite(r.height) && r.width > 14 && r.height > 14;
        } catch (_) {
          return false;
        }
      });

      const rightControls = visible
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .filter((x) => ((x.rect.left + x.rect.right) / 2) > (formRect.left + formRect.width * 0.62))
        .sort((a, b) => a.rect.left - b.rect.left);

      if (rightControls.length <= 1) return;

      const keep = rightControls[rightControls.length - 1].el;
      rightControls.forEach(({ el }) => {
        if (el === keep) return;
        if (el.dataset && el.dataset.mkMobileSearchActionHidden === '1') return;
        try { el.style.setProperty('display', 'none', 'important'); } catch (_) {}
        try { el.style.setProperty('pointer-events', 'none', 'important'); } catch (_) {}
        try { el.dataset.mkMobileSearchActionHidden = '1'; } catch (_) {}
      });

      try { keep.removeAttribute('title'); } catch (_) {}
      try { keep.removeAttribute('aria-label'); } catch (_) {}
      try { keep.setAttribute('data-mk-clear-tooltip-killed', '1'); } catch (_) {}
      try { keep.style.setProperty('-webkit-touch-callout', 'none', 'important'); } catch (_) {}
      try { keep.style.setProperty('-webkit-user-select', 'none', 'important'); } catch (_) {}
      try { keep.style.setProperty('user-select', 'none', 'important'); } catch (_) {}
    } catch (_) {}
  }

  function suppressHeaderSearchClearTooltip() {
    try {
      qa('.md-header [title="Clear"], .md-header [aria-label="Clear"], .md-header [title="clear"], .md-header [aria-label="clear"]').forEach((el) => {
        try { el.removeAttribute('title'); } catch (_) {}
        try { el.removeAttribute('aria-label'); } catch (_) {}
        try { el.setAttribute('data-mk-clear-tooltip-killed', '1'); } catch (_) {}
        try { el.style.setProperty('-webkit-touch-callout', 'none', 'important'); } catch (_) {}
        try { el.style.setProperty('-webkit-user-select', 'none', 'important'); } catch (_) {}
        try { el.style.setProperty('user-select', 'none', 'important'); } catch (_) {}
      });
    } catch (_) {}

    try {
      const shell = getHeaderSearchShell() || q('.md-header .md-search') || document;
      qa('button, [role="button"], label, a', shell).forEach((el) => {
        try {
          const title = String(el.getAttribute && (el.getAttribute('title') || '') || '').trim().toLowerCase();
          const aria = String(el.getAttribute && (el.getAttribute('aria-label') || '') || '').trim().toLowerCase();
          if (title === 'clear' || aria === 'clear') {
            try { el.removeAttribute('title'); } catch (_) {}
            try { el.removeAttribute('aria-label'); } catch (_) {}
            try { el.setAttribute('data-mk-clear-tooltip-killed', '1'); } catch (_) {}
            try { el.style.setProperty('-webkit-touch-callout', 'none', 'important'); } catch (_) {}
            try { el.style.setProperty('-webkit-user-select', 'none', 'important'); } catch (_) {}
            try { el.style.setProperty('user-select', 'none', 'important'); } catch (_) {}
          }
        } catch (_) {}
      });
    } catch (_) {}
  }


  function ensureInlineMathRepairStyle() {
    const ID = 'mk-inline-math-repair-style';
    if (document.getElementById(ID)) return;
    const st = document.createElement('style');
    st.id = ID;
    st.textContent = `@media (max-width: 900px), (pointer: coarse){
  article.md-content__inner mjx-container:not([display="true"]),
  article.md-content__inner .MathJax:not(.MathJax_Display){
    display: inline-block !important;
    overflow: visible !important;
    contain: none !important;
    will-change: auto !important;
    backface-visibility: visible !important;
    -webkit-backface-visibility: visible !important;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }
  article.md-content__inner mjx-container[display="true"],
  article.md-content__inner .MathJax_Display{
    contain: none !important;
    will-change: auto !important;
    backface-visibility: visible !important;
    -webkit-backface-visibility: visible !important;
  }
}`;
    document.head.appendChild(st);
  }


function cleanHeaderTitleText(s) {
    return String(s || '')
      .replace(/\s+-\s+BSc EOR Wiki\s*$/i, '')
      .replace(/\u00B6/g, '')
      .replace(/¶/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

function readCurrentPageTitle() {
    const h1 = q('article.md-content__inner h1') || q('.md-content__inner h1') || q('main h1');
    const raw = (h1 && h1.textContent) ? h1.textContent : document.title;
    return cleanHeaderTitleText(raw) || 'BSc EOR Wiki';
  }

function headerTitleNodes() {
    const titleRoot = q('.md-header [data-md-component="header-title"]');
    if (!titleRoot) return null;

    const topics = qa('.md-header__topic', titleRoot);
    const siteTopic = topics[0] || titleRoot;
    const pageTopic = q('[data-md-component="header-topic"]', titleRoot) || topics[1] || null;
    const siteEllipsis = q('.md-ellipsis', siteTopic) || siteTopic;
    const pageEllipsis = pageTopic ? (q('.md-ellipsis', pageTopic) || pageTopic) : null;
    return { titleRoot, siteTopic, pageTopic, siteEllipsis, pageEllipsis, topics };
  }

function syncMobileHeaderTitleSwap() {
    const nodes = headerTitleNodes();
    if (!nodes) return;

    const { titleRoot, siteEllipsis, pageEllipsis, topics } = nodes;
    const rememberedSiteTitle = cleanHeaderTitleText(
      titleRoot.getAttribute('data-mk-site-title') ||
      __mkHeaderTitleSwapState.siteTitle ||
      (siteEllipsis && siteEllipsis.textContent) ||
      titleRoot.textContent ||
      'BSc EOR Wiki'
    ) || 'BSc EOR Wiki';

    if (!__mkHeaderTitleSwapState.siteTitle) {
      __mkHeaderTitleSwapState.siteTitle = rememberedSiteTitle;
    }

    const pageTitle = readCurrentPageTitle();
    if (pageTitle) {
      __mkHeaderTitleSwapState.pageTitle = pageTitle;
      __mkHeaderTitleSwapState.lastPageTitle = pageTitle;
    }

    const safePageTitle = __mkHeaderTitleSwapState.pageTitle || __mkHeaderTitleSwapState.lastPageTitle || rememberedSiteTitle;
    const scrolled = (window.scrollY || window.pageYOffset || 0) > 24;
    const activeText = scrolled ? safePageTitle : rememberedSiteTitle;

    try { titleRoot.setAttribute('data-mk-site-title', rememberedSiteTitle); } catch (_) {}
    try { titleRoot.setAttribute('data-mk-page-title', safePageTitle); } catch (_) {}
    try { titleRoot.setAttribute('title', activeText); } catch (_) {}

    try {
      if (siteEllipsis && cleanHeaderTitleText(siteEllipsis.textContent) !== rememberedSiteTitle) {
        siteEllipsis.textContent = rememberedSiteTitle;
      }
      if (siteEllipsis) siteEllipsis.setAttribute('title', rememberedSiteTitle);
    } catch (_) {}

    try {
      if (pageEllipsis && cleanHeaderTitleText(pageEllipsis.textContent) !== safePageTitle) {
        pageEllipsis.textContent = safePageTitle;
      }
      if (pageEllipsis) pageEllipsis.setAttribute('title', safePageTitle);
    } catch (_) {}

    if (!pageEllipsis && topics && topics.length) {
      const fallback = topics[topics.length - 1];
      const fallbackTextNode = q('.md-ellipsis', fallback) || fallback;
      try {
        if (fallbackTextNode && cleanHeaderTitleText(fallbackTextNode.textContent) !== activeText) {
          fallbackTextNode.textContent = activeText;
        }
        if (fallbackTextNode) fallbackTextNode.setAttribute('title', activeText);
      } catch (_) {}
    }
  }


  function installHeaderTitleSwapOnly() {
    if (window.__mkHeaderTitleSwapOnlyInstalledV1) {
      syncMobileHeaderTitleSwap();
      return;
    }
    window.__mkHeaderTitleSwapOnlyInstalledV1 = true;
    let raf = 0;
    let lastScrolledState = null;
    const runNow = (force) => {
      if (!force) {
        const scrolled = (window.scrollY || window.pageYOffset || 0) > 24;
        if (lastScrolledState === scrolled) return;
        lastScrolledState = scrolled;
      }
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        try { syncMobileHeaderTitleSwap(); } catch (_) {}
      });
    };
    const run = () => runNow(false);
    const runForce = () => { lastScrolledState = null; runNow(true); };
    window.addEventListener('scroll', run, { passive: true });
    window.addEventListener('resize', runForce, { passive: true });
    window.addEventListener('orientationchange', runForce, { passive: true });
    try {
      let moTimer = 0;
      const mo = new MutationObserver(() => {
        if (moTimer) return;
        moTimer = window.setTimeout(() => { moTimer = 0; runForce(); }, 120);
      });
      mo.observe(document.body || document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    } catch (_) {}
    [0, 120, 420, 1200].forEach((ms) => setTimeout(runForce, ms));
  }


function repairInlineMathPaint() {
    try {
      const root = q('article.md-content__inner');
      if (!root) return;
      const nodes = qa('mjx-container:not([display="true"]), .MathJax:not(.MathJax_Display)', root);
      if (!nodes.length) return;
      nodes.forEach((el) => {
        try {
          el.style.opacity = '0.999';
          el.style.transform = 'translateZ(0)';
          el.style.webkitTransform = 'translateZ(0)';
          void el.offsetHeight;
          requestAnimationFrame(() => {
            try { el.style.opacity = ''; } catch (_) {}
          });
        } catch (_) {}
      });
    } catch (_) {}
  }

function installInlineMathRepair() {
    if (window.__mkInlineMathRepairInstalledV1) {
      repairInlineMathPaint();
      return;
    }
    window.__mkInlineMathRepairInstalledV1 = true;

    const schedule = () => {
      try { clearTimeout(__mkMathRepairTimer); } catch (_) {}
      __mkMathRepairTimer = window.setTimeout(() => {
        repairInlineMathPaint();
      }, 120);
    };

    // Avoid forced reflow of every inline MathJax node during ordinary scroll.
    // Run after scrolling finishes where supported, and after touchend as a fallback.
    try { window.addEventListener('scrollend', schedule, { passive: true }); } catch (_) {}
    window.addEventListener('touchend', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) window.setTimeout(repairInlineMathPaint, 80);
    });

    [80, 220, 480, 900].forEach((ms) => setTimeout(repairInlineMathPaint, ms));
  }



  function ensureFixedChromeStyle() {
    if (document.getElementById(FIXED_CHROME_STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = FIXED_CHROME_STYLE_ID;
    st.textContent = `@media (max-width: 900px), (pointer: coarse){
  html.${MOBILE_CHROME_CLASS}{
    --mk-mobile-header-h: 56px;
    --mk-mobile-tabs-h: 0px;
    --mk-mobile-chrome-h: 56px;
    scroll-padding-top: calc(var(--mk-mobile-chrome-h) + 12px);
  }
  html.${MOBILE_CHROME_CLASS} body{
    scroll-padding-top: calc(var(--mk-mobile-chrome-h) + 12px);
  }
  html.${MOBILE_CHROME_CLASS} .md-header{
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 10040 !important;
    transform: none !important;
    -webkit-transform: none !important;
    will-change: auto !important;
  }
  html.${MOBILE_CHROME_CLASS} .md-header__inner,
  html.${MOBILE_CHROME_CLASS} .md-header [data-md-component="header-title"]{
    min-width: 0 !important;
  }
  html.${MOBILE_CHROME_CLASS} .md-header [data-md-component="header-title"] .md-ellipsis{
    display: block !important;
    min-width: 0 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  html.${MOBILE_CHROME_CLASS} .md-tabs{
    position: fixed !important;
    top: var(--mk-mobile-header-h, 56px) !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 10039 !important;
  }
  html.${MOBILE_CHROME_CLASS} .md-container{
    padding-top: var(--mk-mobile-chrome-h, 56px) !important;
  }
  html.${MOBILE_CHROME_CLASS} .md-main{
    margin-top: 0 !important;
  }
  html.${MOBILE_CHROME_CLASS} #current-course-bar{
    top: var(--mk-mobile-chrome-h, 56px) !important;
    z-index: 10020 !important;
  }
  html.${MOBILE_CHROME_CLASS} article :is(h1,h2,h3,h4,h5,h6,[id]){
    scroll-margin-top: calc(var(--mk-mobile-chrome-h, 56px) + 12px) !important;
  }
}`;
    document.head.appendChild(st);
  }

  function visibleOuterHeight(el) {
    if (!el || !el.getBoundingClientRect) return 0;
    try {
      const cs = window.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
      const r = el.getBoundingClientRect();
      if (!Number.isFinite(r.height) || r.height <= 0) return 0;
      return Math.max(0, Math.round(r.height));
    } catch (_) {
      return 0;
    }
  }

  function syncMobileChromeMetrics() {
    if (!isMobile) return;
    ensureFixedChromeStyle();

    const html = document.documentElement;
    if (html && html.classList && !html.classList.contains(MOBILE_CHROME_CLASS)) html.classList.add(MOBILE_CHROME_CLASS);

    // FREEZE while search is open.
    //
    // The chrome heights never change during a search session, but measuring them
    // then is dangerous: `.md-header` is overflow:visible and the search dropdown/
    // history can transiently become in-flow (two CSS rule sets — extra.css vs the
    // stabilizer — fight over absolute/relative by class state), so the measured
    // header height balloons from ~56 to several hundred px. That value is written
    // to --mk-mobile-header-h, which is the tabs' `top`, shoving the tabs far down
    // — the random "header splits into two halves with a blurred gap" the user saw.
    // Heights are already correct from before search opened, so do not re-measure.
    if (__mkSearchBackdropLatch) return;

    // Clamp to a sane bar height as belt-and-suspenders against the same balloon
    // outside the latch window (a single header bar is never this tall).
    const headerH = Math.min(Math.max(48, visibleOuterHeight(q('.md-header')) || 0), 88);
    const tabsH = Math.min(visibleOuterHeight(q('.md-tabs')) || 0, 80);
    const total = headerH + tabsH;

    // Only WRITE the custom properties when a value actually changed.
    //
    // This is called from a body-subtree MutationObserver, so it fires on every
    // DOM change on the page. Writing a CSS custom property on the <html> root
    // invalidates the computed style of the entire tree (descendants may inherit
    // the var), forcing a style recalc + REPAINT of the header on every call —
    // even when the value is identical. That was the header top-row flicker whose
    // rate tracked the page's DOM-mutation rate (fast on Trending, slow on Home)
    // and which stopped once the page finished lazy-loading (scrolling to the
    // bottom). Header/tabs heights almost never change after first layout, so
    // guarding the writes makes the steady-state sync a pure (cheap) measurement
    // with zero style invalidation.
    if (headerH === __mkLastHeaderH && tabsH === __mkLastTabsH && total === __mkLastTotalH) return;
    __mkLastHeaderH = headerH;
    __mkLastTabsH = tabsH;
    __mkLastTotalH = total;

    try { html.style.setProperty('--mk-mobile-header-h', `${headerH}px`); } catch (_) {}
    try { html.style.setProperty('--mk-mobile-tabs-h', `${tabsH}px`); } catch (_) {}
    try { html.style.setProperty('--mk-mobile-chrome-h', `${total}px`); } catch (_) {}
  }

  function scheduleMobileChromeSync() {
    if (__mkChromeSyncRaf) return;
    __mkChromeSyncRaf = requestAnimationFrame(() => {
      __mkChromeSyncRaf = 0;
      syncMobileChromeMetrics();
      if (__mkSearchBackdropLatch || hasCheapSearchOpenSignal()) scheduleBackdropMask();
    });
  }

  function installFixedChromeSafe() {
    ensureFixedChromeStyle();
    if (window.__mkFixedChromeSafeInstalledV2) {
      scheduleMobileChromeSync();
      return;
    }
    window.__mkFixedChromeSafeInstalledV2 = true;
    // Header/tabs heights do not change on every page scroll.  Re-measuring them
    // continuously was expensive on iOS; resize/orientation/DOM changes are enough.
    window.addEventListener('resize', scheduleMobileChromeSync, { passive: true });
    window.addEventListener('orientationchange', scheduleMobileChromeSync, { passive: true });
    if (window.visualViewport) {
      try { window.visualViewport.addEventListener('resize', scheduleMobileChromeSync, { passive: true }); } catch (_) {}
      try { window.visualViewport.addEventListener('scroll', () => { if (__mkSearchBackdropLatch || hasCheapSearchOpenSignal()) scheduleBackdropMask(); }, { passive: true }); } catch (_) {}
    }
    try {
      const mo = new MutationObserver(() => scheduleMobileChromeSync());
      mo.observe(document.body || document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    } catch (_) {}
    [0, 60, 180, 420, 900, 1400, 2200].forEach((ms) => setTimeout(scheduleMobileChromeSync, ms));
  }

  function focusSearchInputNow() {
    const input = getHeaderSearchInput();
    if (!input) return false;
    try {
      if (document.activeElement === input) return true;
      input.focus({ preventScroll: true });
      // place caret at end (helps iOS)
      try {
        const v = input.value || '';
        input.setSelectionRange(v.length, v.length);
      } catch (_) {}
      return true;
    } catch (_) {
      try { input.focus(); return true; } catch (_) { return false; }
    }
  }

  function syncBackdrop() {
    ensureStyle();
    const bd = ensureBackdrop();
    // Sticky open-state. The toggle checkbox is the authoritative open/closed
    // signal; the latch + grace window also covers custom search flows that do
    // not flip the checkbox. The latch is released only once we are confident
    // search is closed (explicit close, or the grace window has elapsed and the
    // toggle is no longer checked), so it can never get stuck on.
    const reallyActive = isSearchActive();
    const toggleEl = getSearchToggle();
    const toggleOpen = !!(toggleEl && toggleEl.checked);
    if (reallyActive || toggleOpen) __mkSearchBackdropLatch = true;
    else if (hasExplicitSearchClose() || !hasSearchActiveGrace()) __mkSearchBackdropLatch = false;
    const active = reallyActive || toggleOpen || __mkSearchBackdropLatch;

    const shell = getHeaderSearchShell();
    const header = q('.md-header');
    const tabs = q('.md-tabs');
    const fixedChromeOn = !!(document.documentElement && document.documentElement.classList && document.documentElement.classList.contains(MOBILE_CHROME_CLASS));

    // Compute target z-indexes up front so they can go into the change signature.
    let zBd;
    let zShell = 0;
    if (active && shell) {
      const zLP = cssZ(q('#lp-mobile-sheet')) || 0;
      const zLPb = cssZ(q('#lp-mobile-backdrop')) || 0;
      const zMap = cssZ(q('#lp-map-modal')) || 0;
      const zMM = cssZ(q('#mm-modal')) || 0;
      const zTabs = cssZ(tabs) || 0;
      // Deliberately EXCLUDE the current header z-index from zBase, otherwise each
      // sync would see the already-raised header, push the backdrop higher, then
      // push the header higher again — endless z-index escalation.
      const zBase = fixedChromeOn
        ? Math.max(zLP, zLPb, zMap, zMM, zTabs, 10040)
        : Math.max(zLP, zLPb, zMap, zMM, cssZ(header) || 0, 10000);
      zBd = zBase + 10;
      zShell = zBd + 1;
    } else {
      zBd = desiredBackdropZ();
    }

    // IDEMPOTENCY GUARD.
    // The class/childList MutationObservers call syncBackdrop() on every page DOM
    // change; on busy pages (e.g. Trending) that is many times per second. The
    // expensive part is re-writing inline styles to the FIXED header — every
    // `header.style.setProperty('z-index', ...)` recomposites the fixed header and
    // flickers its top row (drawer/title/magnifier/bar), and the flicker rate
    // tracked the page's DOM-mutation rate (Trending fast, Home slow). When the
    // resolved state has not changed, do nothing at all.
    const sig = [active ? 1 : 0, fixedChromeOn ? 1 : 0, shell ? 1 : 0, zBd, zShell].join('|');
    if (sig === __mkLastSyncSig) return;
    __mkLastSyncSig = sig;
    const becameActive = active && !__mkLastSyncActive;
    __mkLastSyncActive = active;

    bd.style.zIndex = String(zBd);
    // Always show our independent blur/dim backdrop when search is active.
    bd.style.display = active ? 'block' : 'none';

    if (active) {
      // Self-heal any stale inline state left by navigation helpers (some Find
      // entry paths temporarily muted the custom backdrop/shell inline styles).
      try { bd.style.opacity = '1'; } catch (_) {}
      try { bd.style.pointerEvents = 'none'; } catch (_) {}
      if (shell && shell.style) {
        try { shell.style.pointerEvents = ''; } catch (_) {}
        try { shell.style.opacity = ''; } catch (_) {}
      }
      if (shell && shell.setAttribute) {
        try { shell.setAttribute(FORCE_ACTIVE_ATTR, '1'); } catch (_) {}
      }
      suppressHeaderSearchClearTooltip();
    } else {
      try { bd.style.opacity = ''; } catch (_) {}
      try { bd.style.pointerEvents = 'none'; } catch (_) {}
      if (shell && shell.removeAttribute) {
        try { shell.removeAttribute(FORCE_ACTIVE_ATTR); } catch (_) {}
      }
    }

    // Make sure Material's overlay never masks the blur.
    const ov = (shell && q('.md-search__overlay', shell)) || q('.md-header .md-search__overlay') || q('.md-search__overlay');
    if (ov && ov.style) {
      if (ov.style.display === 'none') ov.style.display = '';
      ov.style.pointerEvents = 'none';
      ov.style.background = 'transparent';
      ov.style.backdropFilter = 'none';
      ov.style.webkitBackdropFilter = 'none';
    }

    // Keep the search UI above the backdrop. With fixed chrome the header is a
    // stacking context, so a child .md-search cannot escape it — raise the HEADER.
    if (active && shell) {
      if (fixedChromeOn && header && header.style) {
        try { header.style.setProperty('z-index', String(zShell), 'important'); } catch (_) {}
        try { shell.style.setProperty('z-index', String(zShell + 1), 'important'); } catch (_) {}
      } else {
        try { shell.style.zIndex = String(zShell); } catch (_) {}
      }
    } else {
      if (fixedChromeOn && header && header.style) {
        try { header.style.removeProperty('z-index'); } catch (_) {}
      }
      if (shell && shell.style) {
        try { shell.style.removeProperty('z-index'); } catch (_) {}
      }
    }

    // iOS sometimes opens search without focus. Only on the open transition —
    // never on every sync (re-focusing on each mutation was its own flicker risk).
    if (becameActive) { focusSearchInputNow(); startSearchOpenReassertLoop(); }
    // Pin (on open) or reset (on close) the chrome offset for the iOS keyboard.
    pinFixedChromeToVisualViewport();
    scheduleBackdropMask();
  }

  // Keep Material's "search is open" class from collapsing while search is open.
  //
  // Root cause of the remaining header top-row flicker: on iOS, focusing the
  // field while the Safari URL bar is COMPACT makes Safari animate the bar to its
  // FULL size; during that animation the field briefly blurs, so the project's
  // search scripts pull `md-search--active`, Material collapses the whole top row
  // (drawer / title / magnifier / bar) and then re-expands it on refocus — one
  // flash per open, repeated on pages that also reflow (Trending). Once the bar
  // is already full (after over-scrolling to grow it) there is no animation, no
  // blur, and no flash — exactly the user's observation.
  //
  // While our open latch is set we re-assert the class the instant it is removed.
  // We deliberately DO NOT touch the #__search toggle here: the latch is released
  // (in syncBackdrop) only when the toggle is unchecked and the grace window has
  // elapsed, so forcing the toggle would deadlock closing. Each write is guarded
  // by a `!contains` check, so the steady state performs zero DOM writes.
  function reassertSearchOpenClassIfLatched() {
    if (!__mkSearchBackdropLatch) return;
    // Gate on the authoritative open/closed signal — the #__search toggle.
    // md-search--active tracks field FOCUS (pulled on a transient blur), while
    // #__search tracks whether the search PANEL is open and stays checked through
    // that transient blur. Re-asserting only while the toggle is checked pins the
    // class during the URL-bar-animation blur (no collapse, no flash) but stops
    // the instant the user actually closes (toggle unchecked) — otherwise pinning
    // the class would keep isSearchActive() true forever and the blur could never
    // close (the deadlock this guard fixes).
    const toggle = getSearchToggle();
    if (!toggle || !toggle.checked) return;
    try {
      const shell = getHeaderSearchShell();
      if (shell && shell.classList && !shell.classList.contains('md-search--active')) shell.classList.add('md-search--active');
      const html = document.documentElement;
      const body = document.body;
      if (html && html.classList && !html.classList.contains('md-search--active')) html.classList.add('md-search--active');
      if (body && body.classList && !body.classList.contains('md-search--active')) body.classList.add('md-search--active');
    } catch (_) {}
  }

  // Keep the fixed header + tabs pinned to the VISUAL viewport top while search
  // is open.
  //
  // Because ui-guard defeats Material's body scroll-lock (position:static), the
  // background is free to scroll. When the iOS keyboard opens, Safari offsets the
  // visual viewport DOWN within the layout viewport (visualViewport.offsetTop > 0,
  // and it only happens when the page isn't at the very top). A position:fixed
  // element is laid out against the LAYOUT viewport, so the header at top:0 ends
  // up above the visible area — the header "drifts up off-screen" the user saw.
  // Counteract it by translating the chrome down by offsetTop so it sits at the
  // visible top. Writes only happen when the offset changes, and a transform is a
  // cheap composited move (the header is already its own layer), so this does not
  // repaint or flicker. On close (search inactive) the offset returns to 0 and the
  // inline transform is removed, falling back to the CSS translateZ(0) layer.
  function pinFixedChromeToVisualViewport() {
    if (!isMobile) return;
    const vp = window.visualViewport;
    const oy = vp && Number.isFinite(vp.offsetTop) ? Math.max(0, Math.round(vp.offsetTop)) : 0;
    // Gate on the sticky open latch, not isSearchActive(): the latch is stable for
    // the whole open session, so a one-frame isSearchActive() false can't snap the
    // header to the top and back (a position flicker). It clears on close, which
    // resets the offset to 0.
    const want = __mkSearchBackdropLatch ? oy : 0;
    if (want === __mkLastChromeOffset) return;
    __mkLastChromeOffset = want;

    const header = q('.md-header');
    const tabs = q('.md-tabs');
    if (header && header.style) {
      if (want > 0) { try { header.style.setProperty('transform', `translateY(${want}px) translateZ(0)`, 'important'); } catch (_) {} }
      else { try { header.style.removeProperty('transform'); } catch (_) {} }
    }
    if (tabs && tabs.style) {
      if (want > 0) { try { tabs.style.setProperty('transform', `translateY(${want}px)`, 'important'); } catch (_) {} }
      else { try { tabs.style.removeProperty('transform'); } catch (_) {} }
    }
  }

  function startSearchOpenReassertLoop() {
    // Backstop for the URL-bar settle window (the class can also be pulled via a
    // property/state change the class MutationObserver does not see). Bounded in
    // time and stops as soon as the latch clears, so it can never spin forever.
    __mkReassertUntil = Date.now() + 1500;
    if (__mkReassertRaf) return;
    const tick = () => {
      __mkReassertRaf = 0;
      if (!__mkSearchBackdropLatch || Date.now() > __mkReassertUntil) return;
      reassertSearchOpenClassIfLatched();
      pinFixedChromeToVisualViewport();
      __mkReassertRaf = requestAnimationFrame(tick);
    };
    __mkReassertRaf = requestAnimationFrame(tick);
  }

  function isCourseSearchUiTarget(t) {
    try {
      return !!(t && t.closest && t.closest('#course-search-form, #course-search-input, #course-search-results, #csr-courseassist-dropdown, .csr-courseassist, .csr-courseassist-dropdown, .csr-courseassist-item, .csr-courseassist-note, .csr-courseassist-footer'));
    } catch (_) { return false; }
  }

  // Decisively tear down every signal isSearchActive() reads, so a close can
  // never be left half-applied (the random "blur stays after closing"). Order
  // matters: clear the latch FIRST, then remove md-search--active — that way the
  // class MutationObserver's re-assert sees latch=false and does not put it back.
  function hardClearSearchActiveState() {
    try {
      __mkSearchBackdropLatch = false;
      clearSearchActiveGrace();
      const shell = getHeaderSearchShell();
      if (shell && shell.classList) shell.classList.remove('md-search--active');
      if (shell && shell.removeAttribute) { try { shell.removeAttribute(FORCE_ACTIVE_ATTR); } catch (_) {} }
      const html = document.documentElement;
      const body = document.body;
      if (html && html.classList) html.classList.remove('md-search--active');
      if (body && body.classList) body.classList.remove('md-search--active');
    } catch (_) {}
  }

  function closeSearchIfTapOutside(e) {
    try {
      if (!__mkSearchBackdropLatch && !hasCheapSearchOpenSignal()) return;
      if (!isSearchActive()) return;
      const t = e && e.target;
      if (t && t.closest && t.closest('.md-search')) return;
      if (t && t.closest && t.closest('label[for="__search"], label[for="__search"] *')) return;

      // The Course Search is its own input, outside Material's header search.
      // When Material's header search is stale-active, this document-level
      // outside-tap handler used to preventDefault + blur, so the course search
      // input immediately lost focus after being tapped. Close only the stale
      // header overlay and let the course-search click continue normally.
      if (isCourseSearchUiTarget(t)) {
        const toggle = getSearchToggle();
        if (toggle) {
          try { toggle.checked = false; } catch (_) {}
          hardClearSearchActiveState();
          try { toggle.dispatchEvent(new Event('change', { bubbles: true })); } catch (_) {}
        }
        syncBackdrop();
        return;
      }

      try { e && e.preventDefault && e.preventDefault(); } catch (_) {}
      try { e && e.stopImmediatePropagation && e.stopImmediatePropagation(); } catch (_) {}
      try { e && e.stopPropagation && e.stopPropagation(); } catch (_) {}
      __mkSearchDismissSuppressUntil = Date.now() + 420;

      const toggle = getSearchToggle();
      if (!toggle) return;
      toggle.checked = false;
      hardClearSearchActiveState();
      toggle.dispatchEvent(new Event('change', { bubbles: true }));
      try { document.activeElement && document.activeElement.blur && document.activeElement.blur(); } catch (_) {}
      syncBackdrop();
    } catch (_) {}
  }

  function installBackdropSync() {
    const bindToggle = () => {
      const toggle = getSearchToggle();
      if (!toggle || toggle.dataset.mkBackdropSyncBoundV4 === '1') return;
      toggle.dataset.mkBackdropSyncBoundV4 = '1';
      toggle.addEventListener('change', () => {
        if (toggle.checked) { markSearchActiveGrace(1600); __mkSearchBackdropLatch = true; }
        else { hardClearSearchActiveState(); }
        syncBackdrop();
        if (toggle.checked) {
          // Focus ASAP: during the user gesture we can reliably open the keyboard.
          focusSearchInputNow();
          requestAnimationFrame(() => { markSearchActiveGrace(1600); focusSearchInputNow(); scheduleBackdropMask(); });
          [40, 120, 260, 520].forEach((ms) => setTimeout(() => { markSearchActiveGrace(1200); syncBackdrop(); focusSearchInputNow(); scheduleBackdropMask(); }, ms));
        }
      }, { passive: true });
    };

    bindToggle();

    if (window.__mkBackdropSyncDocV4) return;
    window.__mkBackdropSyncDocV4 = true;

    // Problem-1 fix: ui-guard now defeats Material's mobile search scroll-lock via
    // CSS (see ensureStyle), so the page never shifts on open. Declare ownership
    // so the header-search-stabilizer scroll-restore loop stands down (no racing).
    try { window.__mkUiGuardOwnsSearchScroll = true; } catch (_) {}

    // If user taps anywhere inside the search panel and input isn't focused, focus it.
    document.addEventListener('pointerdown', (e) => {
      try {
        if (!__mkSearchBackdropLatch && !hasCheapSearchOpenSignal()) return;
        const t = e && e.target;
        if (!t || !t.closest) return;
        const inner = getHeaderSearchInner();
        if (!inner || !t.closest('.md-search__inner') || !inner.contains(t)) return;
        if (isSearchDropdownUi(t)) return;
        markSearchActiveGrace(960);
        focusSearchInputNow(); scheduleBackdropMask();
      } catch (_) {}
    }, true);


    document.addEventListener('focusin', (e) => {
      try {
        const t = e && e.target;
        if (!t || !t.closest) return;
        if (!t.closest('.md-header .md-search')) return;
        markSearchActiveGrace(1400);
        suppressHeaderSearchClearTooltip();
        syncMobileHeaderSearchActions();
        syncBackdrop();
        scheduleBackdropMask();
      } catch (_) {}
    }, true);

    document.addEventListener('input', (e) => {
      try {
        const t = e && e.target;
        if (!t || !t.matches || !t.matches('input[data-md-component="search-query"]')) return;
        if (!isHeaderSearchShell(t.closest('.md-search'))) return;
        markSearchActiveGrace(1600);
        suppressHeaderSearchClearTooltip();
        syncMobileHeaderSearchActions();
        syncBackdrop();
        scheduleBackdropMask();
      } catch (_) {}
    }, true);

    // Re-assert the search-open class BEFORE syncBackdrop. The MutationObserver
    // callback runs at the microtask checkpoint (before paint), so re-adding a
    // pulled md-search--active here means the collapsed top-row state never
    // renders — killing the open-time flash without any visible frame.
    const mo = new MutationObserver(() => { reassertSearchOpenClassIfLatched(); syncBackdrop(); });
    try { mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] }); } catch (_) {}
    try { mo.observe(document.body, { attributes: true, attributeFilter: ['class'] }); } catch (_) {}
    // Material toggles md-search--active on the .md-search shell itself, so watch
    // it too (it is the element whose class change collapses the header layout).
    try { const sh = getHeaderSearchShell(); if (sh) mo.observe(sh, { attributes: true, attributeFilter: ['class'] }); } catch (_) {}

    // Keep the fixed chrome pinned to the visual viewport top while the keyboard
    // is open / the background is scrolled (this is what stops the header drifting
    // up off-screen on iOS).
    window.addEventListener('resize', () => { pinFixedChromeToVisualViewport(); scheduleBackdropMask(); }, { passive: true });
    window.addEventListener('orientationchange', () => { pinFixedChromeToVisualViewport(); scheduleBackdropMask(); }, { passive: true });
    window.addEventListener('scroll', pinFixedChromeToVisualViewport, { passive: true });
    if (window.visualViewport) {
      try {
        window.visualViewport.addEventListener('resize', () => {
          pinFixedChromeToVisualViewport();
          if (__mkSearchBackdropLatch || hasCheapSearchOpenSignal()) scheduleBackdropMask();
        }, { passive: true });
        window.visualViewport.addEventListener('scroll', () => {
          pinFixedChromeToVisualViewport();
          if (__mkSearchBackdropLatch || hasCheapSearchOpenSignal()) scheduleBackdropMask();
        }, { passive: true });
      } catch (_) {}
    }

    // When results/history DOM changes, the panel height changes => update the mask.
    try {
      const searchRoot = getHeaderSearchShell();
      if (searchRoot) {
        const mo2 = new MutationObserver(() => {
          if (__mkSearchBackdropLatch || hasCheapSearchOpenSignal()) scheduleBackdropMask();
        });
        mo2.observe(searchRoot, { childList: true, subtree: true, attributes: true });
      }
    } catch (_) {}

    // find.html can finish wiring custom search UI slightly after page paint.
    // Re-sync a few times so the blur is ready even when the header search is opened immediately.
    try {
      const mo3 = new MutationObserver(() => {
        if (__mkSearchBackdropLatch || hasCheapSearchOpenSignal()) {
          syncBackdrop();
          scheduleBackdropMask();
        }
      });
      mo3.observe(document.body || document.documentElement, { childList: true, subtree: true });
    } catch (_) {}

    document.addEventListener('click', (e) => {
      if (Date.now() >= __mkSearchDismissSuppressUntil) return;
      try { e.preventDefault(); } catch (_) {}
      try { e.stopImmediatePropagation(); } catch (_) {}
      try { e.stopPropagation(); } catch (_) {}
    }, true);

    requestAnimationFrame(syncBackdrop);
    [80, 220, 480, 900, 1400].forEach((ms) => setTimeout(() => { syncBackdrop(); scheduleBackdropMask(); }, ms));
    syncBackdrop();

    document.addEventListener('pointerdown', closeSearchIfTapOutside, true);
  }

  // ----------------------- stale scroll-lock / overlay repair -----------------------
  function repairScrollLockIfInactiveSearch() {
    try {
      const toggle = getSearchToggle();
      const shell = getHeaderSearchInner() || getHeaderSearchShell();

      const uiVisible = (() => {
        try {
          if (!shell) return false;
          const cs = window.getComputedStyle(shell);
          if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity || 1) === 0) return false;
          const r = shell.getBoundingClientRect();
          return !!(r && r.width > 30 && r.height > 30);
        } catch (_) { return false; }
      })();

      // If search checkbox is checked AND UI is visible, do nothing.
      if (toggle && toggle.checked && uiVisible) return;

      // If any stale "search active" flags / scrollfix exist while checkbox isn't checked, hard reset.
      const html = document.documentElement;
      const body = document.body;
      const stale =
        (!!qa('[data-md-scrollfix]').length) ||
        (html && html.classList && html.classList.contains('md-search--active')) ||
        (body && body.classList && body.classList.contains('md-search--active')) ||
        (body && body.style && body.style.position === 'fixed');

      if (!stale) return;

      forceCloseSearchUI();
      hardUnlockScroll();
      setNoSearchSlide(false);
    } catch (_) {}
  }

  // ----------------------- HARD reset utilities -----------------------
  function hardUnlockScroll() {
    try {
      const html = document.documentElement;
      const body = document.body;

      // Record body.top (common iOS scroll lock pattern)
      const top = body && body.style ? body.style.top : "";
      const lockedY = top && /-?\d+px/.test(top) ? Math.abs(parseInt(top, 10)) : 0;

      // Remove scrollfix everywhere
      qa('[data-md-scrollfix]').forEach((el) => { try { el.removeAttribute('data-md-scrollfix'); } catch (_) {} });
      try { html && html.removeAttribute && html.removeAttribute('data-md-scrollfix'); } catch (_) {}
      try { body && body.removeAttribute && body.removeAttribute('data-md-scrollfix'); } catch (_) {}

      // Clear active overlay classes
      const cls = ['md-search--active', 'md-dialog--active', 'md-overlay--active', 'md-sidebar--active', 'md-nav--active'];
      cls.forEach((c) => { try { html && html.classList && html.classList.remove(c); } catch (_) {} });
      cls.forEach((c) => { try { body && body.classList && body.classList.remove(c); } catch (_) {} });

      // Clear inline styles that can lock scrolling / cause shifts
      const clear = (el) => {
        if (!el || !el.style) return;
        [
          'overflow', 'overflow-x', 'overflow-y',
          'position', 'top', 'left', 'right', 'bottom',
          'height', 'width', 'touch-action',
          'padding-right', 'margin-right',
          'transform', 'transition', 'animation',
          '-webkit-overflow-scrolling'
        ].forEach((p) => { try { el.style.removeProperty(p); } catch (_) {} });
      };
      clear(html);
      clear(body);

      // Also clear common container nodes that Material may lock/transform
      qa('.md-container, .md-main, .md-content, .md-grid, .md-page').forEach(clear);

      // Restore scroll position if it was fixed/top locked
      if (lockedY > 0) {
        try { window.scrollTo(0, lockedY); } catch (_) {}
      }

      // Defensive: ensure candidate lists/overlay aren't forced hidden
      const list = (getHeaderSearchOutput() && q('.md-search-result__list', getHeaderSearchOutput())) || q('.md-header .md-search-result__list');
      if (list && list.style) { try { list.style.removeProperty('display'); } catch (_) {} }

      const overlay = (getHeaderSearchShell() && q('.md-search__overlay', getHeaderSearchShell())) || q('.md-header .md-search__overlay');
      if (overlay && overlay.style) { try { overlay.style.removeProperty('display'); } catch (_) {} }

      // Blur Material's stale active element, but never steal focus from
      // the Course Search input while it is being opened.
      clearSearchActiveGrace();
      __mkSearchBackdropLatch = false;
      try {
        const active = document.activeElement;
        if (!isCourseSearchUiTarget(active)) active && active.blur && active.blur();
      } catch (_) {}
    } catch (_) {}
  }

  function forceCloseSearchUI() {
    try {
      const t = getSearchToggle();
      if (t) {
        try { t.checked = false; } catch (_) {}
        try { t.dispatchEvent(new Event('change', { bubbles: true })); } catch (_) {}
      }
      hardClearSearchActiveState();
    } catch (_) {}
  }

  function forceCloseDrawerUI() {
    try {
      const t =
        q('input.md-toggle[data-md-toggle="drawer"]') ||
        q('input#__drawer') ||
        q('#__drawer');
      if (t) {
        try { t.checked = false; } catch (_) {}
        clearSearchActiveGrace();
        try { t.dispatchEvent(new Event('change', { bubbles: true })); } catch (_) {}
      }
    } catch (_) {}
  }

  function setNoSearchSlide(on) {
    try {
      const html = document.documentElement;
      if (!html || !html.classList) return;
      if (on) html.classList.add('mk-no-search-slide');
      else html.classList.remove('mk-no-search-slide');
    } catch (_) {}
  }

  function bfcacheHardReset() {
    try {
      // Coming back/forward: ensure no modal UI remains that can lock scrolling.
      setNoSearchSlide(false);
      forceCloseSearchUI();
      forceCloseDrawerUI();
      hardUnlockScroll();
      syncMobileHeaderTitleSwap();
      repairInlineMathPaint();
      syncBackdrop();
      forceTopBurst([0, 60, 180, 360]);
    } catch (_) {}
  }

  function installSearchSlideGuard() {
    if (window.__mkSearchSlideGuardInstalled) return;
    window.__mkSearchSlideGuardInstalled = true;

    // Add the guard class BEFORE Material toggles search (prevents the left-slide animation/glitch).
    document.addEventListener('pointerdown', (e) => {
      try {
	        if (!isMobile) return;
        const t = e && e.target;
        if (!t || !t.closest) return;

        const isSearchTrigger = !!t.closest(
          '.md-search__form, .md-search__input, label[for="__search"], label[for="__search"] *,' +
          'button[aria-label*="Search"], a[aria-label*="Search"], .md-header__button[for="__search"]'
        );

        if (isSearchTrigger) {
          setNoSearchSlide(true);
          // If search didn't actually open, release the class shortly.
          setTimeout(() => { try { if (!isSearchActive()) setNoSearchSlide(false); } catch (_) {} }, 700);
        }
      } catch (_) {}
    }, true);
  }

  // ----------------------- article noise cleanup -----------------------
  function cleanupArticleNoise() {
    try {
      const inner = q('article.md-content__inner');
      if (!inner) return;

      const cls = qa('.lp-course-lecture', inner);
      if (cls.length > 1) {
        for (let i = 1; i < cls.length; i++) cls[i].remove();
      }

      const h1 = q('h1', inner);
      if (h1) {
        let prev = h1.previousSibling;
        while (prev && prev.nodeType === 3 && !(prev.textContent || '').trim()) prev = prev.previousSibling;

        const isNoiseText = (t) => {
          const s = String(t || '').trim();
          if (!s) return false;
          if (!s.startsWith('..')) return false;
          if (!/Year-\d+/i.test(s)) return false;
          if (s.length > 90) return false;
          return true;
        };

        if (prev && prev.nodeType === 3 && isNoiseText(prev.textContent)) prev.remove();
        if (prev && prev.nodeType === 1) {
          const txt = (prev.textContent || '').trim();
          if (isNoiseText(txt) && prev.tagName !== 'A') prev.remove();
        }
      }
    } catch (_) {}
  }

  // ----------------------- tap-to-click fallback (preserve instant nav) -----------------------
  function toggleInputById(id) {
    if (!id) return false;
    const input = document.getElementById(id);
    if (!input) return false;
    const type = String(input.type || '').toLowerCase();
    if (type === 'checkbox') {
      input.checked = !input.checked;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    if (type === 'radio') {
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }

  function isPaletteToggleUi(el) {
    try {
      if (!el || !el.closest) return false;
      if (el.closest('label[for="__palette"], .md-header__button[for="__palette"], [data-md-component="palette"]')) return true;
      const opt = el.closest('.md-header__option');
      return !!(opt && opt.querySelector && opt.querySelector('label[for="__palette"], .md-header__button[for="__palette"], [data-md-component="palette"]'));
    } catch (_) {
      return false;
    }
  }

  function getActionCandidate(target) {
    if (!target || !target.closest) return null;
    // Let MkDocs Material handle palette switching itself. On iOS the synthetic
    // tap fallback can otherwise combine with the delayed native click and
    // advance the light/dark palette twice.
    if (isPaletteToggleUi(target)) return null;

    const a = target.closest('a[href]');
    if (a && canNavigate(a)) return { kind: 'a', el: a };

    const label = target.closest('label[for]');
    if (label) {
      const fid = label.getAttribute('for') || '';
      if (fid) return { kind: 'label', el: label, forId: fid };
    }

    const btn = target.closest('button');
    if (btn) return { kind: 'button', el: btn };

    const rb = target.closest('[role="button"]');
    if (rb) return { kind: 'role', el: rb };

    return null;
  }

  function installTapFallback() {
    if (window.__mkTapFallbackV3) return;
    window.__mkTapFallbackV3 = true;

    const TAP_MAX_MOVE = 12;
    const TAP_MAX_TIME = 650;
    const CLICK_WAIT = 90;
    const ROUTER_WAIT = 320;

    let down = null;
    let lastClickToken = 0;
    let suppressUntil = 0;
    let suppressRoot = null;
    let suppressForId = "";

    document.addEventListener('click', (e) => {
      const now = Date.now();
      const tgt = e && e.target;
      const inRoot = !!(suppressRoot && tgt && suppressRoot.contains(tgt));
      const isToggledInput = !!(suppressForId && tgt && (tgt.id === suppressForId));
      if (now < suppressUntil && (inRoot || isToggledInput)) {
        try { e.preventDefault(); } catch (_) {}
        try { e.stopImmediatePropagation(); } catch (_) {}
        try { e.stopPropagation(); } catch (_) {}
        return;
      }
      lastClickToken = Date.now();
    }, true);

    window.addEventListener('pointerdown', (e) => {
      try {
        if (!e || e.button !== 0) return;
        const cand = getActionCandidate(e.target);
        if (!cand) { down = null; return; }
        if (isInExemptUi(cand.el)) { down = null; return; }

        down = { cand, x: e.clientX, y: e.clientY, ts: Date.now(), clickToken: lastClickToken };
      } catch (_) {
        down = null;
      }
    }, true);

    window.addEventListener('pointerup', (e) => {
      try {
        if (!down) return;
        const now = Date.now();
        const dt = now - down.ts;
        const dx = Math.abs((e.clientX || 0) - down.x);
        const dy = Math.abs((e.clientY || 0) - down.y);

        const cand = down.cand;
        const clickTokenAtDown = down.clickToken;
        down = null;

        if (!cand || !cand.el) return;
        if (dt > TAP_MAX_TIME) return;
        if (dx > TAP_MAX_MOVE || dy > TAP_MAX_MOVE) return;

        setTimeout(() => {
          try {
            if (lastClickToken !== clickTokenAtDown) return;

            if (cand.kind === 'a') {
              const a = cand.el;
              const href = a.getAttribute('href') || '';
              const abs = toAbs(href);

              if (isHashOnly(href)) {
                const id = href.replace(/^#/, '');
                if (!id) return;
                try { window.location.hash = '#' + id; } catch (_) {}
                const el = document.getElementById(id);
                if (el && el.scrollIntoView) {
                  try { el.scrollIntoView({ block: 'start' }); } catch (_) { try { el.scrollIntoView(); } catch (_) {} }
                }
                return;
              }

              try { a.click(); } catch (_) {}

              const before = stripHash(window.location.href);
              const target = stripHash(abs);
              setTimeout(() => {
                try {
                  const after = stripHash(window.location.href);
                  if (after === before && target && target !== before) {
                    window.location.assign(abs);
                  }
                } catch (_) {}
              }, ROUTER_WAIT);
              return;
            }

            if (cand.kind === 'label') {
              const forId = cand.forId || (cand.el.getAttribute && cand.el.getAttribute('for')) || '';
              if (toggleInputById(forId)) {
                // If this was the search toggle, focus the search input immediately.
                if (String(forId) === '__search') {
                  focusSearchInputNow();
                  requestAnimationFrame(() => { focusSearchInputNow(); scheduleBackdropMask(); });
                }
                suppressUntil = Date.now() + 480;
                suppressRoot = cand.el;
                suppressForId = forId || "";
                lastClickToken = Date.now();
                return;
              }
              try { cand.el.click(); } catch (_) {}
              suppressUntil = Date.now() + 480;
              suppressRoot = cand.el;
              suppressForId = "";
              lastClickToken = Date.now();
              return;
            }

            try { cand.el.click(); } catch (_) {}
            suppressUntil = Date.now() + 480;
            suppressRoot = cand.el;
            suppressForId = "";
            lastClickToken = Date.now();
          } catch (_) {}
        }, CLICK_WAIT);
      } catch (_) {
        down = null;
      }
    }, true);
  }

  // ----------------------- init & instant navigation hooks -----------------------
  function init() {
    setHistoryScrollManual();
    installFixedChromeSafe();
    installHeaderTitleSwapOnly();
    installInlineMathRepair();
    installBackdropSync();
    installSearchSlideGuard();
    installTapFallback();
    repairScrollLockIfInactiveSearch();
    cleanupArticleNoise();
    suppressHeaderSearchClearTooltip();
    syncMobileHeaderSearchActions();
    syncMobileHeaderTitleSwap();
    repairInlineMathPaint();
    syncBackdrop();
    forceTopBurst(FORCE_TOP_DELAYS);
    [30, 60, 120, 180, 420, 900].forEach((ms) => setTimeout(() => {
      suppressHeaderSearchClearTooltip();
      syncMobileHeaderSearchActions();
      syncMobileHeaderTitleSwap();
      repairInlineMathPaint();
      syncBackdrop();
      scheduleBackdropMask();
    }, ms));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      forceTopBurst([0, 70, 180, 360]);
    });
  } else {
    init();
    forceTopBurst([0, 70, 180, 360]);
  }

  document.addEventListener('DOMContentSwitch', () => {
    init();
    forceTopBurst([0, 70, 180, 360]);
  });
  document.addEventListener('navigation:load', () => {
    init();
    forceTopBurst([0, 70, 180, 360]);
  });

  window.addEventListener('load', () => {
    forceTopBurst([0, 90, 220, 420]);
  }, { passive: true });

  window.addEventListener('pageshow', (e) => {
    if (e && e.persisted) bfcacheHardReset();
    init();
    forceTopBurst([0, 70, 180, 360]);
  }, { passive: true });
})();
