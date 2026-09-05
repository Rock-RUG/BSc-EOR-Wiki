(function installMaterialClipboardGuard(){if(window.__mkMaterialClipboardGuardV1)return;window.__mkMaterialClipboardGuardV1=true;let requestId=0,feedbackTimer=0;const selector='[data-md-component="search-share"], .md-code__button[data-md-type="copy"]';function selectionState(){const s=window.getSelection&&window.getSelection();const active=document.activeElement;const selection=s?[s.anchorNode,s.anchorOffset,s.focusNode,s.focusOffset]:[];return selection.concat(active&&typeof active.selectionStart==='number'?[active.selectionStart,active.selectionEnd,active.selectionDirection]:[]);}
function current(request){if(request.id!==requestId||request.url!==window.location.href||!request.trigger.isConnected||!request.trigger.getClientRects().length||document.activeElement!==request.focus)return false;const selection=selectionState();return selection.length===request.selection.length&&selection.every((value,index)=>value===request.selection[index]);}
function feedback(message){let node=document.getElementById('mk-clipboard-feedback');if(!node){node=document.createElement('div');node.id='mk-clipboard-feedback';node.className='md-dialog';node.setAttribute('role','status');node.setAttribute('aria-live','polite');node.setAttribute('aria-atomic','true');node.style.zIndex='2147483647';node.style.pointerEvents='none';node.style.maxWidth='calc(100vw - 1.6rem)';node.style.bottom='calc(.8rem + env(safe-area-inset-bottom, 0px))';const inner=document.createElement('div');inner.className='md-dialog__inner';node.appendChild(inner);document.body.appendChild(node);}
window.clearTimeout(feedbackTimer);node.querySelector('.md-dialog__inner').textContent=message;node.setAttribute('data-md-state','open');node.classList.add('md-dialog--active');feedbackTimer=window.setTimeout(()=>{node.removeAttribute('data-md-state');node.classList.remove('md-dialog--active');},4000);}
function fallbackCopy(text){const focused=document.activeElement,selection=window.getSelection&&window.getSelection(),ranges=[];if(selection)for(let i=0;i<selection.rangeCount;i++)ranges.push(selection.getRangeAt(i).cloneRange());const inputSelection=focused&&typeof focused.selectionStart==='number'?[focused.selectionStart,focused.selectionEnd,focused.selectionDirection]:null;const field=document.createElement('textarea');field.value=text;field.setAttribute('readonly','');field.setAttribute('aria-hidden','true');field.tabIndex=-1;field.style.cssText='position:fixed;left:-9999px;top:0;font-size:16px';try{document.body.appendChild(field);field.focus({preventScroll:true});field.select();return typeof document.execCommand==='function'&&document.execCommand('copy')===true;}catch(_){return false;}
finally{if(document.activeElement===field){if(focused&&focused.isConnected&&focused.focus){try{focused.focus({preventScroll:true});}catch(_){}
try{if(inputSelection&&focused.setSelectionRange)focused.setSelectionRange(...inputSelection);}catch(_){}}
try{if(selection){selection.removeAllRanges();ranges.forEach(range=>selection.addRange(range));}}catch(_){}}
field.remove();}}
document.addEventListener('click',async event=>{const trigger=event.target&&event.target.closest&&event.target.closest(selector);if(!trigger||!trigger.isConnected)return;event.preventDefault();event.stopImmediatePropagation();const request={id:++requestId,url:window.location.href,trigger,focus:document.activeElement,selection:selectionState()};const share=trigger.getAttribute('data-md-component')==='search-share';let text;try{if(share){const input=trigger.closest('.md-search')?.querySelector('input[data-md-component="search-query"]');const url=new URL(request.url);const query=input?input.value:new URL(trigger.href,request.url).searchParams.get('q');if(query==null)throw new Error('Search query unavailable');url.search='';url.hash='';url.searchParams.set('q',query);text=url.href;trigger.href=text;trigger.setAttribute('data-clipboard-text',text);}else{const target=document.querySelector(trigger.getAttribute('data-clipboard-target'));if(!target)throw new Error('Copy source unavailable');const authored=target.closest('[data-copy]');target.setAttribute('data-md-copying','');try{text=String(authored?authored.getAttribute('data-copy'):target.innerText).trimEnd();}
finally{target.removeAttribute('data-md-copying');}}
let copied=false;if(navigator.clipboard&&typeof navigator.clipboard.writeText==='function'){try{await navigator.clipboard.writeText(text);copied=true;}catch(_){}}
if(!current(request))return;if(!copied)copied=fallbackCopy(text);if(current(request))feedback(copied?'Copied to clipboard':share?'Copy failed. Use your browser’s Copy link address command on Share.':'Copy failed. Select the code and copy it manually.');}catch(_){if(current(request))feedback('Copy failed. Select the text or use your browser’s Copy link address command.');}},true);function cancel(){requestId++;const node=document.getElementById('mk-clipboard-feedback');if(node){node.removeAttribute('data-md-state');node.classList.remove('md-dialog--active');}}
window.addEventListener('pagehide',cancel);document.addEventListener('DOMContentSwitch',cancel);})();(function(){const isMobile=(()=>{try{if(!window.matchMedia)return false;const coarse=window.matchMedia('(pointer: coarse)').matches;if(!coarse)return false;const isTablet=window.matchMedia('(min-width: 768px)').matches&&window.matchMedia('(min-height: 700px)').matches;return!isTablet;}catch(_){return false;}})();if(!isMobile)return;const FORCE_TOP_DELAYS=[0,50,140,320];function setHistoryScrollManual(){try{if('scrollRestoration'in history)history.scrollRestoration='manual';}catch(_){}}
function clearSavedScrollState(){try{sessionStorage.removeItem('__md_scroll_y__');}catch(_){}
try{sessionStorage.removeItem('__material_scroll_top');}catch(_){}
try{sessionStorage.removeItem('mk_last_scroll_y');}catch(_){}}
function setScrollTopNow(){try{window.scrollTo({top:0,left:0,behavior:'auto'});return;}catch(_){}
try{window.scrollTo(0,0);}catch(_){}}
let __mkForceTopSeq=0;let __mkForceTopPath=String(window.location.pathname||'');let __mkForceTopInteracted=false;function canForceTop(){return!__mkForceTopInteracted&&!window.location.hash;}
function cancelForceTopForInteraction(event){if(event&&event.isTrusted===false)return;__mkForceTopPath=String(window.location.pathname||'');__mkForceTopInteracted=true;++__mkForceTopSeq;}
['wheel','touchstart','pointerdown'].forEach((type)=>{window.addEventListener(type,cancelForceTopForInteraction,{passive:true,capture:true});});window.addEventListener('keydown',(event)=>{if(event&&/^(ArrowDown|ArrowUp|PageDown|PageUp|Home|End| )$/.test(String(event.key||''))){cancelForceTopForInteraction(event);}},true);function scheduleForceTop(delay){if(!canForceTop())return;const seq=++__mkForceTopSeq;window.setTimeout(()=>{try{if(seq!==__mkForceTopSeq||!canForceTop())return;clearSavedScrollState();setHistoryScrollManual();setScrollTopNow();requestAnimationFrame(()=>{try{if(seq!==__mkForceTopSeq||!canForceTop())return;setScrollTopNow();}catch(_){}});}catch(_){}},Math.max(0,Number(delay)||0));}
function forceTopBurst(delays){const path=String(window.location.pathname||'');if(path!==__mkForceTopPath){__mkForceTopPath=path;__mkForceTopInteracted=false;}
if(!canForceTop())return;const list=Array.isArray(delays)&&delays.length?delays:FORCE_TOP_DELAYS;clearSavedScrollState();setHistoryScrollManual();list.forEach((ms)=>scheduleForceTop(ms));}
function q(sel,root){return(root||document).querySelector(sel);}
function qa(sel,root){return Array.from((root||document).querySelectorAll(sel));}
let __mkThemeColorBurstSeq=0;let __mkThemeColorObserver=null;let __mkThemeColorInstalled=false;function firstThemeColourToken(value){const raw=String(value||"").trim();if(!raw)return"";const match=raw.match(/#[0-9a-f]{8}\b|#[0-9a-f]{6}\b|#[0-9a-f]{4}\b|#[0-9a-f]{3}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/i);return match?match[0]:raw;}
function opaqueThemeColour(value){let colour=firstThemeColourToken(value);if(!colour||/^transparent$/i.test(colour))return"";let match=colour.match(/^#([0-9a-f]{8})$/i);if(match){if(match[1].slice(6).toLowerCase()==="00")return"";return`#${match[1].slice(0, 6)}`;}
match=colour.match(/^#([0-9a-f]{4})$/i);if(match){if(match[1].slice(3).toLowerCase()==="0")return"";return`#${match[1].slice(0, 3)}`;}
match=colour.match(/^rgba?\(\s*([0-9.]+)(?:\s*,\s*|\s+)([0-9.]+)(?:\s*,\s*|\s+)([0-9.]+)(?:\s*(?:,|\/)\s*([0-9.]+%?))?\s*\)$/i);if(match){const alphaRaw=match[4]||"1";const alpha=alphaRaw.endsWith("%")?parseFloat(alphaRaw)/100:parseFloat(alphaRaw);if(!Number.isFinite(alpha)||alpha<=0.01)return"";const rgb=[match[1],match[2],match[3]].map((part)=>Math.max(0,Math.min(255,Math.round(Number(part)||0))));return`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;}
if(/^hsla?\(/i.test(colour)&&/(?:,|\/)\s*0(?:\.0+)?%?\s*\)$/i.test(colour))return"";try{if(window.CSS&&typeof window.CSS.supports==="function"&&!window.CSS.supports("color",colour))return"";}catch(_){}
return colour;}
function mobileThemeColour(){const root=document.documentElement;const body=document.body;let rootStyle=null;let headerStyle=null;try{rootStyle=window.getComputedStyle(root);}catch(_){}
try{const header=q(".md-header");if(header)headerStyle=window.getComputedStyle(header);}catch(_){}
const interfaceTheme=String(root.getAttribute("data-mk-interface-theme")||"");const headerSkin=String(root.getAttribute("data-mk-header-skin")||"");const imageTheme=root.hasAttribute("data-mk-image-interface-theme");const knownThemeColours={ui_theme_sunlit_gold:"#9f720e",ui_theme_lantern_gold:"#7a5600"};const knownHeaderSkinColours={header_skin_aurora:"#155e75",header_skin_sunset:"#be123c",header_skin_midnight:"#111827"};const candidates=[];if(rootStyle){candidates.push(rootStyle.getPropertyValue("--mk-mobile-theme-color"));if(imageTheme)candidates.push(rootStyle.getPropertyValue("--mk-image-theme-menu-bg"));if(knownThemeColours[interfaceTheme])candidates.push(knownThemeColours[interfaceTheme]);if(interfaceTheme)candidates.push(rootStyle.getPropertyValue("--md-primary-fg-color"));candidates.push(rootStyle.getPropertyValue("--mk-theme-header-bg"));candidates.push(rootStyle.getPropertyValue("--mk-gold-theme-header-bg"));if(!interfaceTheme&&knownHeaderSkinColours[headerSkin])candidates.push(knownHeaderSkinColours[headerSkin]);candidates.push(rootStyle.getPropertyValue("--md-primary-fg-color"));}
if(headerStyle)candidates.push(headerStyle.backgroundColor);for(const candidate of candidates){const colour=opaqueThemeColour(candidate);if(colour)return colour;}
const scheme=String(root.getAttribute("data-mk-color-scheme")||root.getAttribute("data-md-color-scheme")||(body&&body.getAttribute("data-md-color-scheme"))||"").toLowerCase();return scheme==="slate"||scheme==="dark"?"#1f2129":"#3f51b5";}
function syncMobileThemeColor(){try{let meta=q('meta[name="theme-color"]');if(!meta){meta=document.createElement("meta");meta.setAttribute("name","theme-color");(document.head||document.documentElement).appendChild(meta);}
const colour=mobileThemeColour();if(colour&&meta.getAttribute("content")!==colour)meta.setAttribute("content",colour);try{document.documentElement.style.setProperty("--mk-mobile-theme-color-active",colour);}catch(_){}}catch(_){}}
function burstSyncMobileThemeColor(){const seq=++__mkThemeColorBurstSeq;const run=()=>{if(seq!==__mkThemeColorBurstSeq)return;syncMobileThemeColor();};run();try{requestAnimationFrame(run);}catch(_){}
[50,150,300,600].forEach((ms)=>window.setTimeout(run,ms));}
function installMobileThemeColorSync(){if(__mkThemeColorInstalled){burstSyncMobileThemeColor();return;}
__mkThemeColorInstalled=true;try{__mkThemeColorObserver=new MutationObserver(()=>burstSyncMobileThemeColor());__mkThemeColorObserver.observe(document.documentElement,{attributes:true,attributeFilter:["data-md-color-scheme","data-mk-color-scheme","data-mk-interface-theme","data-mk-image-interface-theme","data-mk-header-skin"]});if(document.body){__mkThemeColorObserver.observe(document.body,{attributes:true,attributeFilter:["data-md-color-scheme"]});}}catch(_){}
window.addEventListener("storage",burstSyncMobileThemeColor,{passive:true});document.addEventListener("visibilitychange",()=>{if(!document.hidden)burstSyncMobileThemeColor();});document.addEventListener("mk-shop-inventory-change",burstSyncMobileThemeColor);window.addEventListener("mk-shop-inventory-change",burstSyncMobileThemeColor);document.addEventListener("DOMContentSwitch",burstSyncMobileThemeColor);burstSyncMobileThemeColor();}
function isHeaderSearchShell(el){return!!(el&&el.closest&&el.closest('.md-header .md-search'));}
function getHeaderSearchShell(){try{const active=document.activeElement;if(active&&active.matches&&active.matches('input[data-md-component="search-query"]')){const shell=active.closest('.md-search');if(isHeaderSearchShell(shell))return shell;}}catch(_){}
return(q('.md-header .md-search.md-search--active')||q('.md-header .md-search')||null);}
function getHeaderSearchInner(){const shell=getHeaderSearchShell();return(shell&&q('.md-search__inner',shell))||q('.md-header .md-search__inner')||null;}
function getHeaderSearchForm(){const shell=getHeaderSearchShell();return(shell&&q('.md-search__form',shell))||q('.md-header .md-search__form')||null;}
function getHeaderSearchOutput(){const shell=getHeaderSearchShell();return(shell&&q('.md-search__output',shell))||q('.md-header .md-search__output')||null;}
function getHeaderSearchInput(){try{const active=document.activeElement;if(active&&active.matches&&active.matches('input[data-md-component="search-query"]')&&isHeaderSearchShell(active.closest('.md-search'))){return active;}}catch(_){}
const shell=getHeaderSearchShell();return(shell&&q('input[data-md-component="search-query"]',shell))||q('.md-header input[data-md-component="search-query"]')||null;}
function getSearchToggle(){return(q('input.md-toggle[data-md-toggle="search"]')||q('input#__search')||q('#__search'));}
function isSearchUiVisibleEl(el){try{if(!el||!el.getBoundingClientRect)return false;const cs=window.getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity||1)===0)return false;const r=el.getBoundingClientRect();return!!(r&&Number.isFinite(r.width)&&Number.isFinite(r.height)&&r.width>24&&r.height>18);}catch(_){return false;}}
function hasCheapSearchOpenSignal(){try{const toggle=getSearchToggle();if(toggle&&toggle.checked)return true;const html=document.documentElement;const body=document.body;if(html&&html.classList&&html.classList.contains('md-search--active'))return true;if(body&&body.classList&&body.classList.contains('md-search--active'))return true;const active=document.activeElement;if(active&&active.matches&&active.matches('input[data-md-component="search-query"]')&&isHeaderSearchShell(active.closest('.md-search')))return true;const shell=getHeaderSearchShell();if(shell&&shell.classList&&shell.classList.contains('md-search--active'))return true;if(shell&&shell.getAttribute&&shell.getAttribute(FORCE_ACTIVE_ATTR)==='1')return true;return false;}catch(_){return false;}}
function isSearchActive(){const html=document.documentElement;const body=document.body;const toggle=getSearchToggle();if(toggle&&toggle.checked)return true;if(html&&html.classList&&html.classList.contains('md-search--active'))return true;if(body&&body.classList&&body.classList.contains('md-search--active'))return true;try{const active=document.activeElement;if(active&&active.matches&&active.matches('input[data-md-component="search-query"]')&&isHeaderSearchShell(active.closest('.md-search')))return true;}catch(_){}
const explicitClose=hasExplicitSearchClose();const graceActive=!explicitClose&&hasSearchActiveGrace();if(graceActive){const shell=getHeaderSearchShell();const liveInput=getHeaderSearchInput();if(liveInput)return true;if(shell&&shell.getAttribute&&shell.getAttribute(FORCE_ACTIVE_ATTR)==='1')return true;}
if(!explicitClose&&(__mkSearchBackdropLatch||graceActive)){const shell=getHeaderSearchShell();const inner=getHeaderSearchInner();const form=getHeaderSearchForm();const out=getHeaderSearchOutput();if(isSearchUiVisibleEl(shell)&&(isSearchUiVisibleEl(form)||isSearchUiVisibleEl(inner)||isSearchUiVisibleEl(out))){return true;}}
return false;}
function isInExemptUi(el){if(!el||!el.closest)return false;return!!el.closest('#lp-side-panel, #lp-map-modal, #mm-modal, #custom-random-banner, #find-builder, .mk-search-history, .mk-search-suggest');}
function isSearchDropdownUi(el){if(!el||!el.closest)return false;return!!el.closest('.mk-search-history, .mk-search-suggest, .md-search__output');}
function isSameOriginUrl(href){try{const u=new URL(href,document.baseURI);return u.origin===window.location.origin;}catch(_){return false;}}
function toAbs(href){try{return new URL(href,document.baseURI).toString();}catch(_){return String(href||'');}}
function stripHash(u){try{const x=new URL(u,document.baseURI);x.hash='';return x.toString();}catch(_){return String(u||'').split('#')[0];}}
function isHashOnly(href){const h=String(href||'');return h.startsWith('#')&&h.length>1;}
function canNavigate(a){if(!a)return false;const href=a.getAttribute('href')||'';if(!href)return false;if(a.getAttribute('target')==='_blank')return false;if(a.hasAttribute('download'))return false;if(/^(mailto|tel):/i.test(href))return false;if(!isSameOriginUrl(href)&&!isHashOnly(href))return false;return true;}
function cssZ(el){try{if(!el)return null;const z=window.getComputedStyle(el).zIndex;const n=parseInt(z,10);return Number.isFinite(n)?n:null;}catch(_){return null;}}
const BACKDROP_ID='mk-mobile-search-backdrop';const STYLE_ID='mk-mobile-search-guard-style';const FORCE_ACTIVE_ATTR='data-mk-search-force-active';let __mkSearchActiveGraceUntil=0;let __mkSearchDismissSuppressUntil=0;let __mkMathRepairTimer=0;const __mkHeaderTitleSwapState={siteTitle:'',pageTitle:''};const FIXED_CHROME_STYLE_ID='mk-mobile-fixed-chrome-style';const MOBILE_CHROME_CLASS='mk-mobile-fixed-chrome';let __mkChromeSyncRaf=0;let __mkLastHeaderH=-1;let __mkLastTabsH=-1;let __mkLastTotalH=-1;let __mkSearchBackdropLatch=false;let __mkLastSyncSig='';let __mkLastSyncActive=false;let __mkReassertUntil=0;let __mkReassertRaf=0;let __mkLastChromeOffset=-1;function markSearchActiveGrace(ms){const extra=Math.max(420,Number(ms)||0);const until=Date.now()+extra;if(until>__mkSearchActiveGraceUntil)__mkSearchActiveGraceUntil=until;try{const prev=Number(window.__mkFindHeaderSearchGraceUntil||0);if(until>prev)window.__mkFindHeaderSearchGraceUntil=until;}catch(_){}
try{window.__mkHeaderSearchUserTouchTs=Date.now();}catch(_){}}
function clearSearchActiveGrace(){__mkSearchActiveGraceUntil=0;try{window.__mkFindHeaderSearchGraceUntil=0;}catch(_){}}
function hasSearchActiveGrace(){try{const shared=Number(window.__mkFindHeaderSearchGraceUntil||0);return Date.now()<Math.max(__mkSearchActiveGraceUntil,shared);}catch(_){return Date.now()<__mkSearchActiveGraceUntil;}}
function hasExplicitSearchClose(){try{const shared=Number(window.__mkSearchHistoryExplicitCloseUntil||0);return Date.now()<shared;}catch(_){return false;}}
function ensureStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`@media (max-width: 900px), (pointer: coarse){
  /* Caret visibility on iOS: inherit the already contrast-tested input text
     colour instead of using a theme accent that may disappear into the fill. */
  .md-header .md-search__form input[data-md-component="search-query"]{ caret-color: currentColor !important; }

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

}`;document.head.appendChild(st);}
function desiredBackdropZ(){const search=getHeaderSearchShell();const header=q('.md-header');let z=cssZ(search)||cssZ(header)||2000;if(z<50)z=2000;return Math.max(10,z-1);}
function ensureBackdrop(){let el=document.getElementById(BACKDROP_ID);if(el)return el;el=document.createElement('div');el.id=BACKDROP_ID;el.style.cssText=['position:fixed','top:0','left:0','right:0','bottom:0','display:none','pointer-events:none','background:rgba(0,0,0,.18)','backdrop-filter:blur(7px) saturate(1.05)','-webkit-backdrop-filter:blur(7px) saturate(1.05)','contain:layout style paint','will-change:opacity'].join(';');try{el.style.webkitMaskRepeat='no-repeat';el.style.maskRepeat='no-repeat';el.style.webkitMaskSize='100% 100%';el.style.maskSize='100% 100%';el.style.webkitMaskPosition='0 0';el.style.maskPosition='0 0';}catch(_){}
document.body.appendChild(el);return el;}
let __mkMaskRaf=0;let __mkLastMaskKey='';function scheduleBackdropMask(){return;}
function syncMobileHeaderSearchActions(){try{const form=getHeaderSearchForm();if(!form)return;const formRect=form.getBoundingClientRect();if(!Number.isFinite(formRect.width)||formRect.width<120)return;const visible=qa('button, label, a, [role="button"]',form).filter((el)=>{try{if(!el||!el.getBoundingClientRect)return false;if(el.dataset&&el.dataset.mkMobileSearchActionHidden==='1')return false;if(el.closest('.md-search__output, .mk-search-history, .mk-search-suggest'))return false;const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity||1)===0)return false;const r=el.getBoundingClientRect();return Number.isFinite(r.width)&&Number.isFinite(r.height)&&r.width>14&&r.height>14;}catch(_){return false;}});const rightControls=visible.map((el)=>({el,rect:el.getBoundingClientRect()})).filter((x)=>((x.rect.left+x.rect.right)/2)>(formRect.left+formRect.width*0.62)).sort((a,b)=>a.rect.left-b.rect.left);if(rightControls.length<=1)return;const keep=rightControls[rightControls.length-1].el;rightControls.forEach(({el})=>{if(el===keep)return;if(el.dataset&&el.dataset.mkMobileSearchActionHidden==='1')return;try{el.style.setProperty('display','none','important');}catch(_){}
try{el.style.setProperty('pointer-events','none','important');}catch(_){}
try{el.dataset.mkMobileSearchActionHidden='1';}catch(_){}});try{keep.removeAttribute('title');}catch(_){}
try{keep.removeAttribute('aria-label');}catch(_){}
try{keep.setAttribute('data-mk-clear-tooltip-killed','1');}catch(_){}
try{keep.style.setProperty('-webkit-touch-callout','none','important');}catch(_){}
try{keep.style.setProperty('-webkit-user-select','none','important');}catch(_){}
try{keep.style.setProperty('user-select','none','important');}catch(_){}}catch(_){}}
function suppressHeaderSearchClearTooltip(){try{qa('.md-header [title="Clear"], .md-header [aria-label="Clear"], .md-header [title="clear"], .md-header [aria-label="clear"]').forEach((el)=>{try{el.removeAttribute('title');}catch(_){}
try{el.removeAttribute('aria-label');}catch(_){}
try{el.setAttribute('data-mk-clear-tooltip-killed','1');}catch(_){}
try{el.style.setProperty('-webkit-touch-callout','none','important');}catch(_){}
try{el.style.setProperty('-webkit-user-select','none','important');}catch(_){}
try{el.style.setProperty('user-select','none','important');}catch(_){}});}catch(_){}
try{const shell=getHeaderSearchShell()||q('.md-header .md-search')||document;qa('button, [role="button"], label, a',shell).forEach((el)=>{try{const title=String(el.getAttribute&&(el.getAttribute('title')||'')||'').trim().toLowerCase();const aria=String(el.getAttribute&&(el.getAttribute('aria-label')||'')||'').trim().toLowerCase();if(title==='clear'||aria==='clear'){try{el.removeAttribute('title');}catch(_){}
try{el.removeAttribute('aria-label');}catch(_){}
try{el.setAttribute('data-mk-clear-tooltip-killed','1');}catch(_){}
try{el.style.setProperty('-webkit-touch-callout','none','important');}catch(_){}
try{el.style.setProperty('-webkit-user-select','none','important');}catch(_){}
try{el.style.setProperty('user-select','none','important');}catch(_){}}}catch(_){}});}catch(_){}}
function cleanHeaderTitleText(s){return String(s||'').replace(/\s+-\s+BSc EOR Wiki\s*$/i,'').replace(/\u00B6/g,'').replace(/¶/g,'').replace(/\s+/g,' ').trim();}
function readCurrentPageTitle(){const h1=q('article.md-content__inner h1')||q('.md-content__inner h1')||q('main h1');const raw=(h1&&h1.textContent)?h1.textContent:document.title;return cleanHeaderTitleText(raw)||'BSc EOR Wiki';}
function headerTitleNodes(){const titleRoot=q('.md-header [data-md-component="header-title"]');if(!titleRoot)return null;const topics=qa('.md-header__topic',titleRoot);const siteTopic=topics[0]||titleRoot;const pageTopic=q('[data-md-component="header-topic"]',titleRoot)||topics[1]||null;const siteEllipsis=q('.md-ellipsis',siteTopic)||siteTopic;const pageEllipsis=pageTopic?(q('.md-ellipsis',pageTopic)||pageTopic):null;return{titleRoot,siteTopic,pageTopic,siteEllipsis,pageEllipsis,topics};}
function syncMobileHeaderTitleSwap(){const nodes=headerTitleNodes();if(!nodes)return;const{titleRoot,siteEllipsis,pageEllipsis,topics}=nodes;const rememberedSiteTitle=cleanHeaderTitleText(titleRoot.getAttribute('data-mk-site-title')||__mkHeaderTitleSwapState.siteTitle||(siteEllipsis&&siteEllipsis.textContent)||titleRoot.textContent||'BSc EOR Wiki')||'BSc EOR Wiki';if(!__mkHeaderTitleSwapState.siteTitle){__mkHeaderTitleSwapState.siteTitle=rememberedSiteTitle;}
const pageTitle=readCurrentPageTitle();if(pageTitle){__mkHeaderTitleSwapState.pageTitle=pageTitle;__mkHeaderTitleSwapState.lastPageTitle=pageTitle;}
const safePageTitle=__mkHeaderTitleSwapState.pageTitle||__mkHeaderTitleSwapState.lastPageTitle||rememberedSiteTitle;const scrolled=(window.scrollY||window.pageYOffset||0)>24;const activeText=scrolled?safePageTitle:rememberedSiteTitle;try{titleRoot.setAttribute('data-mk-site-title',rememberedSiteTitle);}catch(_){}
try{titleRoot.setAttribute('data-mk-page-title',safePageTitle);}catch(_){}
try{titleRoot.setAttribute('title',activeText);}catch(_){}
try{if(siteEllipsis&&cleanHeaderTitleText(siteEllipsis.textContent)!==rememberedSiteTitle){siteEllipsis.textContent=rememberedSiteTitle;}
if(siteEllipsis)siteEllipsis.setAttribute('title',rememberedSiteTitle);}catch(_){}
try{if(pageEllipsis&&cleanHeaderTitleText(pageEllipsis.textContent)!==safePageTitle){pageEllipsis.textContent=safePageTitle;}
if(pageEllipsis)pageEllipsis.setAttribute('title',safePageTitle);}catch(_){}
if(!pageEllipsis&&topics&&topics.length){const fallback=topics[topics.length-1];const fallbackTextNode=q('.md-ellipsis',fallback)||fallback;try{if(fallbackTextNode&&cleanHeaderTitleText(fallbackTextNode.textContent)!==activeText){fallbackTextNode.textContent=activeText;}
if(fallbackTextNode)fallbackTextNode.setAttribute('title',activeText);}catch(_){}}}
function installHeaderTitleSwapOnly(){if(window.__mkHeaderTitleSwapOnlyInstalledV1){syncMobileHeaderTitleSwap();return;}
window.__mkHeaderTitleSwapOnlyInstalledV1=true;let raf=0;let lastScrolledState=null;const runNow=(force)=>{if(!force){const scrolled=(window.scrollY||window.pageYOffset||0)>24;if(lastScrolledState===scrolled)return;lastScrolledState=scrolled;}
if(raf)return;raf=requestAnimationFrame(()=>{raf=0;try{syncMobileHeaderTitleSwap();}catch(_){}});};const run=()=>runNow(false);const runForce=()=>{lastScrolledState=null;runNow(true);};window.addEventListener('scroll',run,{passive:true});window.addEventListener('resize',runForce,{passive:true});window.addEventListener('orientationchange',runForce,{passive:true});try{let moTimer=0;const mo=new MutationObserver(()=>{if(moTimer)return;moTimer=window.setTimeout(()=>{moTimer=0;runForce();},120);});const watchRoots=[q('.md-header [data-md-component="header-title"]'),q('main.md-main')].filter(Boolean);watchRoots.forEach((node)=>mo.observe(node,{childList:true,subtree:true,characterData:true}));}catch(_){}
[0,120,420,1200].forEach((ms)=>setTimeout(runForce,ms));}
function repairInlineMathPaint(){try{const root=q('article.md-content__inner');if(!root)return;const nodes=qa('mjx-container:not([display="true"]), .MathJax:not(.MathJax_Display)',root);if(!nodes.length)return;nodes.forEach((el)=>{try{el.style.opacity='0.999';el.style.transform='translateZ(0)';el.style.webkitTransform='translateZ(0)';void el.offsetHeight;requestAnimationFrame(()=>{try{el.style.opacity='';}catch(_){}});}catch(_){}});}catch(_){}}
function installInlineMathRepair(){if(window.__mkInlineMathRepairInstalledV1){repairInlineMathPaint();return;}
window.__mkInlineMathRepairInstalledV1=true;const schedule=()=>{try{clearTimeout(__mkMathRepairTimer);}catch(_){}
__mkMathRepairTimer=window.setTimeout(()=>{repairInlineMathPaint();},120);};try{window.addEventListener('scrollend',schedule,{passive:true});}catch(_){}
window.addEventListener('touchend',schedule,{passive:true});window.addEventListener('orientationchange',schedule,{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)window.setTimeout(repairInlineMathPaint,80);});[80,220,480,900].forEach((ms)=>setTimeout(repairInlineMathPaint,ms));}
function ensureFixedChromeStyle(){if(document.getElementById(FIXED_CHROME_STYLE_ID))return;const st=document.createElement('style');st.id=FIXED_CHROME_STYLE_ID;st.textContent=`@media (max-width: 900px), (pointer: coarse){
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
}`;document.head.appendChild(st);}
function visibleOuterHeight(el){if(!el||!el.getBoundingClientRect)return 0;try{const cs=window.getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return 0;const r=el.getBoundingClientRect();if(!Number.isFinite(r.height)||r.height<=0)return 0;return Math.max(0,Math.round(r.height));}catch(_){return 0;}}
function syncMobileChromeMetrics(){if(!isMobile)return;ensureFixedChromeStyle();const html=document.documentElement;if(html&&html.classList&&!html.classList.contains(MOBILE_CHROME_CLASS))html.classList.add(MOBILE_CHROME_CLASS);if(__mkSearchBackdropLatch)return;const headerH=Math.min(Math.max(48,visibleOuterHeight(q('.md-header'))||0),88);const tabsH=Math.min(visibleOuterHeight(q('.md-tabs'))||0,80);const total=headerH+tabsH;if(headerH===__mkLastHeaderH&&tabsH===__mkLastTabsH&&total===__mkLastTotalH)return;__mkLastHeaderH=headerH;__mkLastTabsH=tabsH;__mkLastTotalH=total;try{html.style.setProperty('--mk-mobile-header-h',`${headerH}px`);}catch(_){}
try{html.style.setProperty('--mk-mobile-tabs-h',`${tabsH}px`);}catch(_){}
try{html.style.setProperty('--mk-mobile-chrome-h',`${total}px`);}catch(_){}}
function scheduleMobileChromeSync(){if(__mkChromeSyncRaf)return;__mkChromeSyncRaf=requestAnimationFrame(()=>{__mkChromeSyncRaf=0;syncMobileChromeMetrics();if(__mkSearchBackdropLatch||hasCheapSearchOpenSignal())scheduleBackdropMask();});}
function installFixedChromeSafe(){ensureFixedChromeStyle();if(window.__mkFixedChromeSafeInstalledV2){scheduleMobileChromeSync();return;}
window.__mkFixedChromeSafeInstalledV2=true;window.addEventListener('resize',scheduleMobileChromeSync,{passive:true});window.addEventListener('orientationchange',scheduleMobileChromeSync,{passive:true});if(window.visualViewport){try{window.visualViewport.addEventListener('resize',scheduleMobileChromeSync,{passive:true});}catch(_){}
try{window.visualViewport.addEventListener('scroll',()=>{if(__mkSearchBackdropLatch||hasCheapSearchOpenSignal())scheduleBackdropMask();},{passive:true});}catch(_){}}
try{const chromeNodes=[q('.md-header'),q('.md-tabs')].filter(Boolean);if(window.ResizeObserver){const ro=new ResizeObserver(()=>scheduleMobileChromeSync());chromeNodes.forEach((node)=>ro.observe(node));}else{const mo=new MutationObserver(()=>scheduleMobileChromeSync());chromeNodes.forEach((node)=>mo.observe(node,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']}));}}catch(_){}
[0,60,180,420,900,1400,2200].forEach((ms)=>setTimeout(scheduleMobileChromeSync,ms));}
function focusSearchInputNow(){const input=getHeaderSearchInput();if(!input)return false;try{if(document.activeElement===input)return true;input.focus({preventScroll:true});try{const v=input.value||'';input.setSelectionRange(v.length,v.length);}catch(_){}
return true;}catch(_){try{input.focus();return true;}catch(_){return false;}}}
function syncBackdrop(){ensureStyle();const bd=ensureBackdrop();const reallyActive=isSearchActive();const toggleEl=getSearchToggle();const toggleOpen=!!(toggleEl&&toggleEl.checked);if(reallyActive||toggleOpen)__mkSearchBackdropLatch=true;else if(hasExplicitSearchClose()||!hasSearchActiveGrace())__mkSearchBackdropLatch=false;const active=reallyActive||toggleOpen||__mkSearchBackdropLatch;const shell=getHeaderSearchShell();const header=q('.md-header');const tabs=q('.md-tabs');const fixedChromeOn=!!(document.documentElement&&document.documentElement.classList&&document.documentElement.classList.contains(MOBILE_CHROME_CLASS));let zBd;let zShell=0;if(active&&shell){const zLP=cssZ(q('#lp-mobile-sheet'))||0;const zLPb=cssZ(q('#lp-mobile-backdrop'))||0;const zMap=cssZ(q('#lp-map-modal'))||0;const zMM=cssZ(q('#mm-modal'))||0;const zTabs=cssZ(tabs)||0;const zBase=fixedChromeOn?Math.max(zLP,zLPb,zMap,zMM,zTabs,10040):Math.max(zLP,zLPb,zMap,zMM,cssZ(header)||0,10000);zBd=zBase+10;zShell=zBd+1;}else{zBd=desiredBackdropZ();}
const sig=[active?1:0,fixedChromeOn?1:0,shell?1:0,zBd,zShell].join('|');if(sig===__mkLastSyncSig)return;__mkLastSyncSig=sig;const becameActive=active&&!__mkLastSyncActive;__mkLastSyncActive=active;bd.style.zIndex=String(zBd);bd.style.display=active?'block':'none';if(active){try{bd.style.opacity='1';}catch(_){}
try{bd.style.pointerEvents='none';}catch(_){}
if(shell&&shell.style){try{shell.style.pointerEvents='';}catch(_){}
try{shell.style.opacity='';}catch(_){}}
if(shell&&shell.setAttribute){try{shell.setAttribute(FORCE_ACTIVE_ATTR,'1');}catch(_){}}
suppressHeaderSearchClearTooltip();}else{try{bd.style.opacity='';}catch(_){}
try{bd.style.pointerEvents='none';}catch(_){}
if(shell&&shell.removeAttribute){try{shell.removeAttribute(FORCE_ACTIVE_ATTR);}catch(_){}}}
const ov=(shell&&q('.md-search__overlay',shell))||q('.md-header .md-search__overlay')||q('.md-search__overlay');if(ov&&ov.style){if(ov.style.display==='none')ov.style.display='';ov.style.pointerEvents='none';ov.style.background='transparent';ov.style.backdropFilter='none';ov.style.webkitBackdropFilter='none';}
if(active&&shell){if(fixedChromeOn&&header&&header.style){try{header.style.setProperty('z-index',String(zShell),'important');}catch(_){}
try{shell.style.setProperty('z-index',String(zShell+1),'important');}catch(_){}}else{try{shell.style.zIndex=String(zShell);}catch(_){}}}else{if(fixedChromeOn&&header&&header.style){try{header.style.removeProperty('z-index');}catch(_){}}
if(shell&&shell.style){try{shell.style.removeProperty('z-index');}catch(_){}}}
if(becameActive){focusSearchInputNow();startSearchOpenReassertLoop();}
pinFixedChromeToVisualViewport();scheduleBackdropMask();}
function reassertSearchOpenClassIfLatched(){if(!__mkSearchBackdropLatch)return;const toggle=getSearchToggle();if(!toggle||!toggle.checked)return;try{const shell=getHeaderSearchShell();if(shell&&shell.classList&&!shell.classList.contains('md-search--active'))shell.classList.add('md-search--active');const html=document.documentElement;const body=document.body;if(html&&html.classList&&!html.classList.contains('md-search--active'))html.classList.add('md-search--active');if(body&&body.classList&&!body.classList.contains('md-search--active'))body.classList.add('md-search--active');}catch(_){}}
function pinFixedChromeToVisualViewport(){if(!isMobile)return;if(!__mkSearchBackdropLatch&&__mkLastChromeOffset===0)return;const vp=window.visualViewport;const oy=vp&&Number.isFinite(vp.offsetTop)?Math.max(0,Math.round(vp.offsetTop)):0;const want=__mkSearchBackdropLatch?oy:0;if(want===__mkLastChromeOffset)return;__mkLastChromeOffset=want;const header=q('.md-header');const tabs=q('.md-tabs');if(header&&header.style){if(want>0){try{header.style.setProperty('transform',`translateY(${want}px) translateZ(0)`,'important');}catch(_){}}
else{try{header.style.removeProperty('transform');}catch(_){}}}
if(tabs&&tabs.style){if(want>0){try{tabs.style.setProperty('transform',`translateY(${want}px)`,'important');}catch(_){}}
else{try{tabs.style.removeProperty('transform');}catch(_){}}}}
function startSearchOpenReassertLoop(){__mkReassertUntil=Date.now()+1500;if(__mkReassertRaf)return;const tick=()=>{__mkReassertRaf=0;if(!__mkSearchBackdropLatch||Date.now()>__mkReassertUntil)return;reassertSearchOpenClassIfLatched();pinFixedChromeToVisualViewport();__mkReassertRaf=requestAnimationFrame(tick);};__mkReassertRaf=requestAnimationFrame(tick);}
function isCourseSearchUiTarget(t){try{return!!(t&&t.closest&&t.closest('#course-search-form, #course-search-input, #course-search-results, #csr-courseassist-dropdown, .csr-courseassist, .csr-courseassist-dropdown, .csr-courseassist-item, .csr-courseassist-note, .csr-courseassist-footer'));}catch(_){return false;}}
function hardClearSearchActiveState(){try{__mkSearchBackdropLatch=false;clearSearchActiveGrace();const shell=getHeaderSearchShell();if(shell&&shell.classList)shell.classList.remove('md-search--active');if(shell&&shell.removeAttribute){try{shell.removeAttribute(FORCE_ACTIVE_ATTR);}catch(_){}}
const html=document.documentElement;const body=document.body;if(html&&html.classList)html.classList.remove('md-search--active');if(body&&body.classList)body.classList.remove('md-search--active');}catch(_){}}
function closeSearchIfTapOutside(e){try{if(!__mkSearchBackdropLatch&&!hasCheapSearchOpenSignal())return;if(!isSearchActive())return;const t=e&&e.target;if(t&&t.closest&&t.closest('.md-search'))return;if(t&&t.closest&&t.closest('label[for="__search"], label[for="__search"] *'))return;if(isCourseSearchUiTarget(t)){const toggle=getSearchToggle();if(toggle){try{toggle.checked=false;}catch(_){}
hardClearSearchActiveState();try{toggle.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}}
syncBackdrop();return;}
try{e&&e.preventDefault&&e.preventDefault();}catch(_){}
try{e&&e.stopImmediatePropagation&&e.stopImmediatePropagation();}catch(_){}
try{e&&e.stopPropagation&&e.stopPropagation();}catch(_){}
__mkSearchDismissSuppressUntil=Date.now()+420;const toggle=getSearchToggle();if(!toggle)return;toggle.checked=false;hardClearSearchActiveState();toggle.dispatchEvent(new Event('change',{bubbles:true}));try{document.activeElement&&document.activeElement.blur&&document.activeElement.blur();}catch(_){}
syncBackdrop();}catch(_){}}
function installBackdropSync(){const bindToggle=()=>{const toggle=getSearchToggle();if(!toggle||toggle.dataset.mkBackdropSyncBoundV4==='1')return;toggle.dataset.mkBackdropSyncBoundV4='1';toggle.addEventListener('change',()=>{if(toggle.checked){markSearchActiveGrace(1600);__mkSearchBackdropLatch=true;}
else{hardClearSearchActiveState();}
syncBackdrop();if(toggle.checked){focusSearchInputNow();requestAnimationFrame(()=>{markSearchActiveGrace(1600);focusSearchInputNow();scheduleBackdropMask();});[40,120,260,520].forEach((ms)=>setTimeout(()=>{markSearchActiveGrace(1200);syncBackdrop();focusSearchInputNow();scheduleBackdropMask();},ms));}},{passive:true});};bindToggle();if(window.__mkBackdropSyncDocV4)return;window.__mkBackdropSyncDocV4=true;try{window.__mkUiGuardOwnsSearchScroll=true;}catch(_){}
document.addEventListener('pointerdown',(e)=>{try{if(!__mkSearchBackdropLatch&&!hasCheapSearchOpenSignal())return;const t=e&&e.target;if(!t||!t.closest)return;const inner=getHeaderSearchInner();if(!inner||!t.closest('.md-search__inner')||!inner.contains(t))return;if(isSearchDropdownUi(t))return;markSearchActiveGrace(960);focusSearchInputNow();scheduleBackdropMask();}catch(_){}},true);document.addEventListener('focusin',(e)=>{try{const t=e&&e.target;if(!t||!t.closest)return;if(!t.closest('.md-header .md-search'))return;markSearchActiveGrace(1400);suppressHeaderSearchClearTooltip();syncMobileHeaderSearchActions();syncBackdrop();scheduleBackdropMask();}catch(_){}},true);document.addEventListener('input',(e)=>{try{const t=e&&e.target;if(!t||!t.matches||!t.matches('input[data-md-component="search-query"]'))return;if(!isHeaderSearchShell(t.closest('.md-search')))return;markSearchActiveGrace(1600);suppressHeaderSearchClearTooltip();syncMobileHeaderSearchActions();syncBackdrop();scheduleBackdropMask();}catch(_){}},true);const mo=new MutationObserver(()=>{reassertSearchOpenClassIfLatched();syncBackdrop();});try{mo.observe(document.documentElement,{attributes:true,attributeFilter:['class']});}catch(_){}
try{mo.observe(document.body,{attributes:true,attributeFilter:['class']});}catch(_){}
try{const sh=getHeaderSearchShell();if(sh)mo.observe(sh,{attributes:true,attributeFilter:['class']});}catch(_){}
window.addEventListener('resize',()=>{pinFixedChromeToVisualViewport();scheduleBackdropMask();},{passive:true});window.addEventListener('orientationchange',()=>{pinFixedChromeToVisualViewport();scheduleBackdropMask();},{passive:true});window.addEventListener('scroll',pinFixedChromeToVisualViewport,{passive:true});if(window.visualViewport){try{window.visualViewport.addEventListener('resize',()=>{pinFixedChromeToVisualViewport();if(__mkSearchBackdropLatch||hasCheapSearchOpenSignal())scheduleBackdropMask();},{passive:true});window.visualViewport.addEventListener('scroll',()=>{pinFixedChromeToVisualViewport();if(__mkSearchBackdropLatch||hasCheapSearchOpenSignal())scheduleBackdropMask();},{passive:true});}catch(_){}}
try{const searchRoot=getHeaderSearchShell();if(searchRoot){const mo2=new MutationObserver(()=>{if(__mkSearchBackdropLatch||hasCheapSearchOpenSignal())scheduleBackdropMask();});mo2.observe(searchRoot,{childList:true,subtree:true,attributes:true});}}catch(_){}
try{const mo3=new MutationObserver(()=>{if(__mkSearchBackdropLatch||hasCheapSearchOpenSignal()){syncBackdrop();scheduleBackdropMask();}});mo3.observe(document.body||document.documentElement,{childList:true,subtree:true});}catch(_){}
document.addEventListener('click',(e)=>{if(Date.now()>=__mkSearchDismissSuppressUntil)return;try{e.preventDefault();}catch(_){}
try{e.stopImmediatePropagation();}catch(_){}
try{e.stopPropagation();}catch(_){}},true);requestAnimationFrame(syncBackdrop);[80,220,480,900,1400].forEach((ms)=>setTimeout(()=>{syncBackdrop();scheduleBackdropMask();},ms));syncBackdrop();document.addEventListener('pointerdown',closeSearchIfTapOutside,true);}
function repairScrollLockIfInactiveSearch(){try{const toggle=getSearchToggle();const shell=getHeaderSearchInner()||getHeaderSearchShell();const uiVisible=(()=>{try{if(!shell)return false;const cs=window.getComputedStyle(shell);if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity||1)===0)return false;const r=shell.getBoundingClientRect();return!!(r&&r.width>30&&r.height>30);}catch(_){return false;}})();if(toggle&&toggle.checked&&uiVisible)return;const html=document.documentElement;const body=document.body;const stale=(!!qa('[data-md-scrollfix]').length)||(html&&html.classList&&html.classList.contains('md-search--active'))||(body&&body.classList&&body.classList.contains('md-search--active'))||(body&&body.style&&body.style.position==='fixed');if(!stale)return;forceCloseSearchUI();hardUnlockScroll();setNoSearchSlide(false);}catch(_){}}
function hardUnlockScroll(){try{const html=document.documentElement;const body=document.body;const top=body&&body.style?body.style.top:"";const lockedY=top&&/-?\d+px/.test(top)?Math.abs(parseInt(top,10)):0;qa('[data-md-scrollfix]').forEach((el)=>{try{el.removeAttribute('data-md-scrollfix');}catch(_){}});try{html&&html.removeAttribute&&html.removeAttribute('data-md-scrollfix');}catch(_){}
try{body&&body.removeAttribute&&body.removeAttribute('data-md-scrollfix');}catch(_){}
const cls=['md-search--active','md-dialog--active','md-overlay--active','md-sidebar--active','md-nav--active'];cls.forEach((c)=>{try{html&&html.classList&&html.classList.remove(c);}catch(_){}});cls.forEach((c)=>{try{body&&body.classList&&body.classList.remove(c);}catch(_){}});const clear=(el)=>{if(!el||!el.style)return;['overflow','overflow-x','overflow-y','position','top','left','right','bottom','height','width','touch-action','padding-right','margin-right','transform','transition','animation','-webkit-overflow-scrolling'].forEach((p)=>{try{el.style.removeProperty(p);}catch(_){}});};clear(html);clear(body);qa('.md-container, .md-main, .md-content, .md-grid, .md-page').forEach(clear);if(lockedY>0){try{window.scrollTo(0,lockedY);}catch(_){}}
const list=(getHeaderSearchOutput()&&q('.md-search-result__list',getHeaderSearchOutput()))||q('.md-header .md-search-result__list');if(list&&list.style){try{list.style.removeProperty('display');}catch(_){}}
const overlay=(getHeaderSearchShell()&&q('.md-search__overlay',getHeaderSearchShell()))||q('.md-header .md-search__overlay');if(overlay&&overlay.style){try{overlay.style.removeProperty('display');}catch(_){}}
clearSearchActiveGrace();__mkSearchBackdropLatch=false;try{const active=document.activeElement;if(!isCourseSearchUiTarget(active))active&&active.blur&&active.blur();}catch(_){}}catch(_){}}
function forceCloseSearchUI(){try{const t=getSearchToggle();if(t){try{t.checked=false;}catch(_){}
try{t.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}}
hardClearSearchActiveState();}catch(_){}}
function forceCloseDrawerUI(){try{const t=q('input.md-toggle[data-md-toggle="drawer"]')||q('input#__drawer')||q('#__drawer');if(t){try{t.checked=false;}catch(_){}
clearSearchActiveGrace();try{t.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}}}catch(_){}}
function setNoSearchSlide(on){try{const html=document.documentElement;if(!html||!html.classList)return;if(on)html.classList.add('mk-no-search-slide');else html.classList.remove('mk-no-search-slide');}catch(_){}}
function bfcacheHardReset(){try{setNoSearchSlide(false);forceCloseSearchUI();forceCloseDrawerUI();hardUnlockScroll();syncMobileHeaderTitleSwap();repairInlineMathPaint();syncBackdrop();forceTopBurst([0,60,180,360]);}catch(_){}}
function installSearchSlideGuard(){if(window.__mkSearchSlideGuardInstalled)return;window.__mkSearchSlideGuardInstalled=true;document.addEventListener('pointerdown',(e)=>{try{if(!isMobile)return;const t=e&&e.target;if(!t||!t.closest)return;const isSearchTrigger=!!t.closest('.md-search__form, .md-search__input, label[for="__search"], label[for="__search"] *,'+'button[aria-label*="Search"], a[aria-label*="Search"], .md-header__button[for="__search"]');if(isSearchTrigger){setNoSearchSlide(true);setTimeout(()=>{try{if(!isSearchActive())setNoSearchSlide(false);}catch(_){}},700);}}catch(_){}},true);}
function cleanupArticleNoise(){try{const inner=q('article.md-content__inner');if(!inner)return;const cls=qa('.lp-course-lecture',inner);if(cls.length>1){for(let i=1;i<cls.length;i++)cls[i].remove();}
const h1=q('h1',inner);if(h1){let prev=h1.previousSibling;while(prev&&prev.nodeType===3&&!(prev.textContent||'').trim())prev=prev.previousSibling;const isNoiseText=(t)=>{const s=String(t||'').trim();if(!s)return false;if(!s.startsWith('..'))return false;if(!/Year-\d+/i.test(s))return false;if(s.length>90)return false;return true;};if(prev&&prev.nodeType===3&&isNoiseText(prev.textContent))prev.remove();if(prev&&prev.nodeType===1){const txt=(prev.textContent||'').trim();if(isNoiseText(txt)&&prev.tagName!=='A')prev.remove();}}}catch(_){}}
function toggleInputById(id){if(!id)return false;const input=document.getElementById(id);if(!input)return false;const type=String(input.type||'').toLowerCase();if(type==='checkbox'){input.checked=!input.checked;input.dispatchEvent(new Event('change',{bubbles:true}));return true;}
if(type==='radio'){input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));return true;}
return false;}
function isPaletteToggleUi(el){try{if(!el||!el.closest)return false;if(el.closest('label[for="__palette"], .md-header__button[for="__palette"], [data-md-component="palette"]'))return true;const opt=el.closest('.md-header__option');return!!(opt&&opt.querySelector&&opt.querySelector('label[for="__palette"], .md-header__button[for="__palette"], [data-md-component="palette"]'));}catch(_){return false;}}
function getActionCandidate(target){if(!target||!target.closest)return null;if(isPaletteToggleUi(target))return null;const a=target.closest('a[href]');if(a&&canNavigate(a))return{kind:'a',el:a};const label=target.closest('label[for]');if(label){const fid=label.getAttribute('for')||'';if(fid)return{kind:'label',el:label,forId:fid};}
const btn=target.closest('button');if(btn)return{kind:'button',el:btn};const rb=target.closest('[role="button"]');if(rb)return{kind:'role',el:rb};return null;}
function installTapFallback(){if(window.__mkTapFallbackV3)return;window.__mkTapFallbackV3=true;const TAP_MAX_MOVE=12;const TAP_MAX_TIME=650;const CLICK_WAIT=90;const ROUTER_WAIT=320;let down=null;let lastClickToken=0;let suppressUntil=0;let suppressRoot=null;let suppressForId="";document.addEventListener('click',(e)=>{const now=Date.now();const tgt=e&&e.target;const inRoot=!!(suppressRoot&&tgt&&suppressRoot.contains(tgt));const isToggledInput=!!(suppressForId&&tgt&&(tgt.id===suppressForId));if(now<suppressUntil&&(inRoot||isToggledInput)){try{e.preventDefault();}catch(_){}
try{e.stopImmediatePropagation();}catch(_){}
try{e.stopPropagation();}catch(_){}
return;}
lastClickToken=Date.now();},true);window.addEventListener('pointerdown',(e)=>{try{if(!e||e.button!==0)return;const cand=getActionCandidate(e.target);if(!cand){down=null;return;}
if(isInExemptUi(cand.el)){down=null;return;}
down={cand,x:e.clientX,y:e.clientY,ts:Date.now(),clickToken:lastClickToken};}catch(_){down=null;}},true);window.addEventListener('pointerup',(e)=>{try{if(!down)return;const now=Date.now();const dt=now-down.ts;const dx=Math.abs((e.clientX||0)-down.x);const dy=Math.abs((e.clientY||0)-down.y);const cand=down.cand;const clickTokenAtDown=down.clickToken;down=null;if(!cand||!cand.el)return;if(dt>TAP_MAX_TIME)return;if(dx>TAP_MAX_MOVE||dy>TAP_MAX_MOVE)return;setTimeout(()=>{try{if(lastClickToken!==clickTokenAtDown)return;if(cand.kind==='a'){const a=cand.el;const href=a.getAttribute('href')||'';const abs=toAbs(href);if(isHashOnly(href)){const id=href.replace(/^#/,'');if(!id)return;try{window.location.hash='#'+id;}catch(_){}
const el=document.getElementById(id);if(el&&el.scrollIntoView){try{el.scrollIntoView({block:'start'});}catch(_){try{el.scrollIntoView();}catch(_){}}}
return;}
try{a.click();}catch(_){}
const before=stripHash(window.location.href);const target=stripHash(abs);setTimeout(()=>{try{const after=stripHash(window.location.href);if(after===before&&target&&target!==before){window.location.assign(abs);}}catch(_){}},ROUTER_WAIT);return;}
if(cand.kind==='label'){const forId=cand.forId||(cand.el.getAttribute&&cand.el.getAttribute('for'))||'';if(toggleInputById(forId)){if(String(forId)==='__search'){focusSearchInputNow();requestAnimationFrame(()=>{focusSearchInputNow();scheduleBackdropMask();});}
suppressUntil=Date.now()+480;suppressRoot=cand.el;suppressForId=forId||"";lastClickToken=Date.now();return;}
try{cand.el.click();}catch(_){}
suppressUntil=Date.now()+480;suppressRoot=cand.el;suppressForId="";lastClickToken=Date.now();return;}
try{cand.el.click();}catch(_){}
suppressUntil=Date.now()+480;suppressRoot=cand.el;suppressForId="";lastClickToken=Date.now();}catch(_){}},CLICK_WAIT);}catch(_){down=null;}},true);}
function init(){setHistoryScrollManual();installMobileThemeColorSync();installFixedChromeSafe();installHeaderTitleSwapOnly();installInlineMathRepair();installBackdropSync();installSearchSlideGuard();installTapFallback();repairScrollLockIfInactiveSearch();cleanupArticleNoise();suppressHeaderSearchClearTooltip();syncMobileHeaderSearchActions();syncMobileHeaderTitleSwap();repairInlineMathPaint();syncBackdrop();forceTopBurst(FORCE_TOP_DELAYS);[30,60,120,180,420,900].forEach((ms)=>setTimeout(()=>{suppressHeaderSearchClearTooltip();syncMobileHeaderSearchActions();syncMobileHeaderTitleSwap();repairInlineMathPaint();syncBackdrop();scheduleBackdropMask();},ms));}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',()=>{init();forceTopBurst([0,70,180,360]);});}else{init();forceTopBurst([0,70,180,360]);}
document.addEventListener('DOMContentSwitch',()=>{init();forceTopBurst([0,70,180,360]);});document.addEventListener('navigation:load',()=>{init();forceTopBurst([0,70,180,360]);});window.addEventListener('load',()=>{forceTopBurst([0,90,220,420]);},{passive:true});window.addEventListener('pageshow',(e)=>{if(e&&e.persisted)bfcacheHardReset();init();forceTopBurst([0,70,180,360]);},{passive:true});})();