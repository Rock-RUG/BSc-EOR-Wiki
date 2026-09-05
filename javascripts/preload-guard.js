(function(){"use strict";const html=document.documentElement;const PRELOAD_CLASS="rk-preload";const READY_CLASS="rk-ready";const ACTIVE_CLASS="rk-guard-active";const SHOP_INVENTORY_LIGHT_CACHE_KEY="mk_shop_inventory_light_cache_v1";const SHOP_RUNTIME_TRIAL_KEY="mk_shop_runtime_trials_v55";const EARLY_THEME_STYLE_ID="rk-preload-interface-theme-style-v1";const INTERFACE_THEME_ITEMS={ui_theme_light_sky:{slot:"interface_theme",mode:"light"},ui_theme_light_sage:{slot:"interface_theme",mode:"light"},ui_theme_light_peach_grad:{slot:"interface_theme",mode:"light"},ui_theme_light_lavender_grad:{slot:"interface_theme",mode:"light"},ui_theme_sunlit_gold:{slot:"interface_theme",mode:"light"},ui_theme_dark_midnight:{slot:"interface_theme",mode:"dark"},ui_theme_dark_evergreen:{slot:"interface_theme",mode:"dark"},ui_theme_dark_aurora_grad:{slot:"interface_theme",mode:"dark"},ui_theme_dark_plum_grad:{slot:"interface_theme",mode:"dark"},ui_theme_lantern_gold:{slot:"interface_theme",mode:"dark"}};const ACCOUNT_THEME_ATTRS=["data-mk-theme-mode","data-mk-interface-theme","data-mk-image-interface-theme","data-mk-img-hdr-clip","data-mk-interface-theme-light","data-mk-interface-theme-dark"];const ACCOUNT_THEME_VARS=["--mk-image-theme-header-image","--mk-image-theme-bg-image","--mk-theme-page-bg","--mk-theme-sidebar-bg","--mk-theme-sticky-floor","--mk-theme-sidebar-card-bg","--mk-theme-sidebar-card-bg-hover","--mk-theme-sidebar-border","--md-primary-fg-color","--md-accent-fg-color"];const QUIET_MS=32;const HARD_CAP_MS=700;const BOOT_HOLD_MAX_MS=420;const INITIAL_TOP_SNAP_GUARD_MS=3200;const INSTANT_TOP_SNAP_GUARD_MS=1800;let navSeq=0;let currentObserver=null;let lastBeginUrl=String(window.location.href||"").split("#")[0];let currentGuardUntil=0;let userInteractedThisNav=false;let lastNonZeroScrollY=0;let lastNonZeroScrollAt=0;let restoringScroll=false;let installedScrollGuard=false;let scrollGuardExpiryTimer=0;const preloadHolds=new Set();const BOOT_HOLD="__rk_boot__";const LP_PANEL_HOLD_PREFIX="__rk_lp_panel__";let preloadRevealed=false;let hardCapTimer=0;try{html.classList.add(ACTIVE_CLASS);}catch(_){}
function earlyLooksConceptPage(){try{const p=String(window.location.pathname||"").replace(/\\/g,"/");const clean=p.split("#")[0].split("?")[0].replace(/\/+$/g,"");if(!/\.html?$/i.test(clean))return false;if(/(^|\/)(index|find|random|custom-random|trending|contributors|about|404)\.html?$/i.test(clean))return false;return/\/Year[-_ ]?\d+\//i.test(clean)||/\/year[-_ ]?\d+\//i.test(clean);}catch(_){return false;}}
function normalizePathFragment(path){try{return decodeURIComponent(String(path||"")).replace(/\\/g,"/").replace(/^\/+/g,"").replace(/\/+$/g,"").toLowerCase();}catch(_){return String(path||"").replace(/\\/g,"/").replace(/^\/+/g,"").replace(/\/+$/g,"").toLowerCase();}}
function panelMatchesCurrentPage(panel){try{const panelLoc=normalizePathFragment(panel&&panel.dataset&&panel.dataset.lpCurrentLoc);if(!panelLoc)return false;const current=normalizePathFragment(window.location.pathname||"");return!!current&&(current===panelLoc||current.endsWith("/"+panelLoc));}catch(_){return false;}}
try{html.toggleAttribute("data-rk-concept-page",earlyLooksConceptPage());}catch(_){}
function installEarlyInterfaceThemeStyle(){try{if(document.getElementById(EARLY_THEME_STYLE_ID))return;const st=document.createElement("style");st.id=EARLY_THEME_STYLE_ID;st.textContent=`
        html[data-mk-interface-theme="ui_theme_light_sky"]{--rk-preload-theme-bg:#f5f9ff;--rk-preload-theme-primary:#2f74c0;--rk-preload-theme-accent:#2563eb;}
        html[data-mk-interface-theme="ui_theme_light_sage"]{--rk-preload-theme-bg:#f5f8f2;--rk-preload-theme-primary:#4f7f67;--rk-preload-theme-accent:#3f7f5f;}
        html[data-mk-interface-theme="ui_theme_light_peach_grad"]{--rk-preload-theme-bg:#fff5ef;--rk-preload-theme-primary:#d97757;--rk-preload-theme-accent:#db6b45;}
        html[data-mk-interface-theme="ui_theme_light_lavender_grad"]{--rk-preload-theme-bg:#f8f5ff;--rk-preload-theme-primary:#7b6fbd;--rk-preload-theme-accent:#7468c4;}
        html[data-mk-interface-theme="ui_theme_sunlit_gold"]{--rk-preload-theme-bg:#fbf1de;--rk-preload-theme-primary:#9f720e;--rk-preload-theme-accent:#8a5d00;}
        html[data-mk-interface-theme="ui_theme_dark_midnight"]{--rk-preload-theme-bg:#0b1020;--rk-preload-theme-primary:#17213a;--rk-preload-theme-accent:#93c5fd;}
        html[data-mk-interface-theme="ui_theme_dark_evergreen"]{--rk-preload-theme-bg:#081612;--rk-preload-theme-primary:#14332e;--rk-preload-theme-accent:#6ee7b7;}
        html[data-mk-interface-theme="ui_theme_dark_aurora_grad"]{--rk-preload-theme-bg:linear-gradient(135deg,#06111f 0%,#081d2b 50%,#071a1c 100%);--rk-preload-theme-primary:#155e75;--rk-preload-theme-accent:#67e8f9;}
        html[data-mk-interface-theme="ui_theme_dark_plum_grad"]{--rk-preload-theme-bg:linear-gradient(135deg,#10091b 0%,#171024 52%,#1a0f1d 100%);--rk-preload-theme-primary:#4c1d5f;--rk-preload-theme-accent:#d8b4fe;}
        html[data-mk-interface-theme="ui_theme_lantern_gold"]{--rk-preload-theme-bg:#1f180d;--rk-preload-theme-primary:#7a5600;--rk-preload-theme-accent:#f1c653;}
        html[data-mk-interface-theme^="ui_theme_"],
        html[data-mk-interface-theme^="ui_theme_"] body{
          min-height:100vh !important;
          background:var(--rk-preload-theme-bg, var(--md-default-bg-color)) !important;
          background-attachment:fixed !important;
          background-repeat:no-repeat !important;
          background-size:cover !important;
        }
        html:not(.rk-ready)[data-mk-interface-theme^="ui_theme_"] .md-container,
        html.rk-preload[data-mk-interface-theme^="ui_theme_"] .md-container{
          background:transparent !important;
        }
        html[data-mk-interface-theme^="ui_theme_"]{
          --md-primary-fg-color:var(--rk-preload-theme-primary, var(--md-primary-fg-color));
          --md-accent-fg-color:var(--rk-preload-theme-accent, var(--md-accent-fg-color));
          --mk-theme-page-bg:var(--rk-preload-theme-bg, var(--md-default-bg-color));
        }
      `;const head=document.head||document.documentElement;head.appendChild(st);}catch(_){}}
function readJsonStorage(key,fallback){try{const raw=localStorage.getItem(key);if(!raw)return fallback;const parsed=JSON.parse(raw);return parsed==null?fallback:parsed;}catch(_){return fallback;}}
function readJsonAnyStorage(key,fallback){try{const raw=localStorage.getItem(key)||sessionStorage.getItem(key)||"";if(!raw)return fallback;const parsed=JSON.parse(raw);return parsed==null?fallback:parsed;}catch(_){return fallback;}}
function clampThemeId(value){return String(value||"").trim().slice(0,120);}
function themeMode(id){const item=INTERFACE_THEME_ITEMS[clampThemeId(id)];return item?item.mode:"";}
function inferMaterialSchemeEarly(){try{const body=document.body||null;const attr=(body&&body.getAttribute&&body.getAttribute("data-md-color-scheme"))||(html&&html.getAttribute&&html.getAttribute("data-md-color-scheme"))||(html&&html.getAttribute&&html.getAttribute("data-mk-color-scheme"))||"";if(attr)return String(attr).trim()||"default";}catch(_){}
try{let palette=null;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&/(^|\/|\.)__palette$/.test(k)){const v=JSON.parse(localStorage.getItem(k)||"null");if(v){palette=v;break;}}}}catch(_){}
if(!palette)palette=readJsonStorage("/.__palette",null)||readJsonStorage("__palette",null);const colour=palette&&typeof palette==="object"?(palette.color||palette.colour||palette):null;const scheme=colour&&typeof colour==="object"?(colour.scheme||colour.colorScheme||""):"";if(scheme)return String(scheme).trim()||"default";}catch(_){}
return"default";}
function isThemeOwned(inv,itemId){const id=clampThemeId(itemId);if(!id)return false;try{const owned=inv&&inv.owned;if(owned&&typeof owned==="object"&&owned[id])return true;const ownedIds=inv&&inv.ownedIds;if(Array.isArray(ownedIds)&&ownedIds.indexOf(id)>=0)return true;}catch(_){}
return false;}
function earlyTrialItemForSlot(slot){const wanted=String(slot||"").trim();if(!wanted)return"";const now=Date.now();const candidates=[];try{const inv=readJsonStorage(SHOP_INVENTORY_LIGHT_CACHE_KEY,null);const trials=inv&&Array.isArray(inv.activeTrials)?inv.activeTrials:[];trials.forEach((row)=>candidates.push(row));}catch(_){}
try{const rows=readJsonAnyStorage(SHOP_RUNTIME_TRIAL_KEY,[]);if(Array.isArray(rows))rows.forEach((row)=>candidates.push(row));}catch(_){}
const bestBySlot=candidates.map((row)=>{const r=row&&typeof row==="object"?row:{};const id=clampThemeId(r.itemId||r.id||"");const item=INTERFACE_THEME_ITEMS[id];if(!id||!item||item.slot!==wanted)return null;if(r.muted||r.shadowMuted)return null;if(Number(r.expiresAt||0)<=now)return null;return{id,rank:Math.max(Number(r.activatedAt||0)||0,Number(r.ts||r.startedAt||0)||0,Number(r.expiresAt||0)||0)};}).filter(Boolean).sort((a,b)=>b.rank-a.rank);return bestBySlot.length?bestBySlot[0].id:"";}
function applyEarlyInterfaceTheme(){try{installEarlyInterfaceThemeStyle();const scheme=inferMaterialSchemeEarly();const accountOff=html.classList.contains("mk-startup-account-off")||html.getAttribute("data-mk-startup-account")==="off";if(accountOff){ACCOUNT_THEME_ATTRS.forEach((attr)=>html.removeAttribute(attr));ACCOUNT_THEME_VARS.forEach((name)=>html.style.removeProperty(name));html.setAttribute("data-mk-color-scheme",scheme==="slate"?"slate":"default");return;}
const customOn=String(scheme||"").trim()==="custom";html.removeAttribute("data-mk-interface-theme-light");html.removeAttribute("data-mk-interface-theme-dark");const inv=readJsonStorage(SHOP_INVENTORY_LIGHT_CACHE_KEY,null)||{};const eq=inv&&inv.equipped&&typeof inv.equipped==="object"?inv.equipped:{};const trialTheme=earlyTrialItemForSlot("interface_theme");const equippedTheme=clampThemeId(eq.interface_theme||eq.interface_theme_light||eq.interface_theme_dark||"");const activeTheme=clampThemeId(trialTheme||equippedTheme||"");const valid=!!activeTheme&&!!INTERFACE_THEME_ITEMS[activeTheme]&&(!!trialTheme||isThemeOwned(inv,activeTheme));if(valid){const mode=themeMode(activeTheme)||"light";html.setAttribute("data-mk-color-scheme",mode==="dark"?"slate":"default");html.setAttribute("data-mk-theme-mode",mode);html.setAttribute("data-mk-interface-theme",activeTheme);html.removeAttribute("data-mk-deferred-interface-theme");}else{html.setAttribute("data-mk-color-scheme",customOn?"default":(scheme||"default"));html.removeAttribute("data-mk-deferred-interface-theme");html.removeAttribute("data-mk-theme-mode");html.removeAttribute("data-mk-interface-theme");}}catch(_){}}
function isFindPage(){try{const p0=String(window.location.pathname||"").toLowerCase();const clean=p0.replace(/\/index\.html$/,"").replace(/\/find\.html$/,"/find").replace(/\/+$/,"");if(clean==="find"||clean.endsWith("/find"))return true;if(p0.endsWith("/find.html")||p0.endsWith("/find/index.html"))return true;}catch(_){}
try{if(document.body&&document.body.classList&&document.body.classList.contains("mk-find-page"))return true;if(document.getElementById("find-builder"))return true;const form=document.getElementById("search-form");const results=document.getElementById("search-results");const input=document.getElementById("search-input");if(form&&results&&input&&form.contains(input))return true;}catch(_){}
return false;}
function isSameFindTopSearchInPlaceFlow(){try{const now=Date.now();return(now<Number(window.__findHeaderSamePageHandledUntilV8||0)||now<Number(window.__findHeaderSamePageHandledUntilV7||0)||now<Number(window.__mkFindSamePageTopSearchUntil||0));}catch(_){return false;}}
function shouldBypassPreloadHide(){try{const now=Date.now();const trialUntil=Math.max(Number(window.__mkShopTrialSkipPreloadUntil||0)||0,Number(sessionStorage.getItem("mk_shop_trial_skip_preload_until_v1")||0)||0);const commentUntil=Number(window.__mkCommentNoPreloadUntil||0)||0;if(now<trialUntil||now<commentUntil)return true;}catch(_){}
return false;}
function currentUrlNoHash(){try{return String(window.location.href||"").split("#")[0];}catch(_){return"";}}
function safeNow(){return(typeof performance!=="undefined"&&performance.now)?performance.now():Date.now();}
function scrollYNow(){try{return Math.max(0,Number(window.scrollY)||0,Number(window.pageYOffset)||0,Number(document.documentElement&&document.documentElement.scrollTop)||0,Number(document.body&&document.body.scrollTop)||0);}catch(_){return 0;}}
function hasIntentionalHashTarget(){try{const h=String(window.location.hash||"");return!!h&&h!=="#";}catch(_){return false;}}
function isWithinTopSnapGuard(){return safeNow()<currentGuardUntil;}
function revealImmediately(){try{html.classList.add(READY_CLASS);html.classList.remove(PRELOAD_CLASS);html.classList.remove(ACTIVE_CLASS);window.__rkPreloadGuardReady=true;}catch(_){}}
function addPreload(){if(userInteractedThisNav||scrollYNow()>8){doReveal();return false;}
try{html.classList.add(PRELOAD_CLASS);html.classList.remove(READY_CLASS);}catch(_){}
return true;}
function setReady(){const before=scrollYNow();revealImmediately();if(before>24)rememberNonZeroScroll(before);requestAnimationFrame(()=>{requestAnimationFrame(()=>maybeRestoreEarlyTopSnap("setReady"));});}
function rememberNonZeroScroll(y){const yy=Math.round(Number(y)||0);if(yy<=8)return;lastNonZeroScrollY=yy;lastNonZeroScrollAt=safeNow();}
function maybeRestoreEarlyTopSnap(reason){if(restoringScroll)return;if(!isWithinTopSnapGuard())return;if(hasIntentionalHashTarget())return;if(!userInteractedThisNav)return;if(!(lastNonZeroScrollY>48))return;const now=safeNow();if(now-lastNonZeroScrollAt>1600)return;const y=scrollYNow();if(y>12)return;restoringScroll=true;try{window.scrollTo(0,lastNonZeroScrollY);}catch(_){}
requestAnimationFrame(()=>{restoringScroll=false;const y2=scrollYNow();if(y2>12)rememberNonZeroScroll(y2);});}
function onUserScrollish(){userInteractedThisNav=true;doReveal();}
function onScrollGuard(){if(!isWithinTopSnapGuard()){uninstallScrollGuard();return;}
if(restoringScroll)return;const y=scrollYNow();if(y>8){userInteractedThisNav=true;rememberNonZeroScroll(y);doReveal();return;}
maybeRestoreEarlyTopSnap("scroll");}
function onGuardKeydown(ev){const key=ev&&ev.key;if(key==="PageDown"||key==="PageUp"||key==="ArrowDown"||key==="ArrowUp"||key==="Home"||key==="End"||key===" "){onUserScrollish();}}
function uninstallScrollGuard(){if(!installedScrollGuard)return;installedScrollGuard=false;if(scrollGuardExpiryTimer){try{window.clearTimeout(scrollGuardExpiryTimer);}catch(_){}
scrollGuardExpiryTimer=0;}
try{window.removeEventListener("scroll",onScrollGuard,true);}catch(_){}
try{document.removeEventListener("scroll",onScrollGuard,true);}catch(_){}
try{window.removeEventListener("wheel",onUserScrollish,true);}catch(_){}
try{window.removeEventListener("touchmove",onUserScrollish,true);}catch(_){}
try{window.removeEventListener("pointerdown",onUserScrollish,true);}catch(_){}
try{window.removeEventListener("keydown",onGuardKeydown,true);}catch(_){}}
function scheduleScrollGuardExpiry(){if(scrollGuardExpiryTimer){try{window.clearTimeout(scrollGuardExpiryTimer);}catch(_){}
scrollGuardExpiryTimer=0;}
const remaining=Math.max(0,currentGuardUntil-safeNow());scrollGuardExpiryTimer=window.setTimeout(function(){scrollGuardExpiryTimer=0;if(isWithinTopSnapGuard()){scheduleScrollGuardExpiry();return;}
uninstallScrollGuard();},remaining+32);}
function installScrollGuardOnce(){if(!installedScrollGuard){installedScrollGuard=true;try{window.addEventListener("scroll",onScrollGuard,{passive:true,capture:true});}catch(_){}
try{document.addEventListener("scroll",onScrollGuard,{passive:true,capture:true});}catch(_){}
try{window.addEventListener("wheel",onUserScrollish,{passive:true,capture:true});}catch(_){}
try{window.addEventListener("touchmove",onUserScrollish,{passive:true,capture:true});}catch(_){}
try{window.addEventListener("pointerdown",onUserScrollish,{passive:true,capture:true});}catch(_){}
try{window.addEventListener("keydown",onGuardKeydown,{passive:true,capture:true});}catch(_){}}
scheduleScrollGuardExpiry();}
function disconnectObserver(){try{if(currentObserver)currentObserver.disconnect();}catch(_){}
currentObserver=null;}
function doReveal(){if(preloadRevealed)return;preloadRevealed=true;preloadHolds.clear();if(hardCapTimer){clearTimeout(hardCapTimer);hardCapTimer=0;}
setReady();}
function maybeReveal(){if(preloadRevealed)return;if(preloadHolds.size>0)return;doReveal();}
function releaseBootHoldWhenSettled(){let released=false;const release=()=>{if(released)return;released=true;preloadHolds.delete(BOOT_HOLD);requestAnimationFrame(maybeReveal);};const settle=()=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>{window.setTimeout(release,QUIET_MS);});});};if(document.readyState==="interactive"||document.readyState==="complete")settle();else document.addEventListener("DOMContentLoaded",settle,{once:true});window.setTimeout(release,BOOT_HOLD_MAX_MS);}
window.__rkHold=function(token){if(preloadRevealed)return null;const t=String(token||("rk-hold-"+Math.random().toString(36).slice(2)));preloadHolds.add(t);return t;};window.__rkRelease=function(token){if(token==null)return;preloadHolds.delete(String(token));requestAnimationFrame(maybeReveal);};function learningPathPanelReady(){try{if(!earlyLooksConceptPage())return true;const panel=document.getElementById("lp-side-panel");if(!panel)return false;if(!panelMatchesCurrentPage(panel))return false;if(panel.dataset&&panel.dataset.lpShell==="1")return false;if(panel.classList&&panel.classList.contains("lp-pending"))return false;return true;}catch(_){return true;}}
function armLearningPathShellHold(){if(!earlyLooksConceptPage())return;if(learningPathPanelReady())return;const token=`${LP_PANEL_HOLD_PREFIX}:${navSeq}`;preloadHolds.add(token);let released=false;let timer=0;let obs=null;const release=()=>{if(released)return;released=true;try{if(timer)window.clearTimeout(timer);}catch(_){}
timer=0;try{window.removeEventListener("lp:panel-ready",onSignal);}catch(_){}
try{if(obs)obs.disconnect();}catch(_){}
if(currentObserver===obs)currentObserver=null;obs=null;preloadHolds.delete(token);requestAnimationFrame(maybeReveal);};const check=()=>{if(learningPathPanelReady())release();};function onSignal(){check();}
try{window.addEventListener("lp:panel-ready",onSignal);}catch(_){}
try{obs=new MutationObserver(check);currentObserver=obs;obs.observe(document.documentElement||document.body,{childList:true,subtree:true});}catch(_){}
try{timer=window.setTimeout(release,2200);}catch(_){timer=0;}
check();}
function beginAndReveal(reason){++navSeq;disconnectObserver();const currentUrl=currentUrlNoHash();const sameUrlDocumentRefresh=String(reason||"")==="document$"&&currentUrl&&currentUrl===lastBeginUrl;const isDocumentNavigation=String(reason||"")==="document$"&&!sameUrlDocumentRefresh;lastBeginUrl=currentUrl||lastBeginUrl;try{html.toggleAttribute("data-rk-concept-page",earlyLooksConceptPage());}catch(_){}
userInteractedThisNav=false;lastNonZeroScrollY=0;lastNonZeroScrollAt=0;currentGuardUntil=safeNow()+(String(reason||"")==="document$"?INSTANT_TOP_SNAP_GUARD_MS:INITIAL_TOP_SNAP_GUARD_MS);installScrollGuardOnce();if((String(reason||"")!=="initial"&&!isDocumentNavigation)||sameUrlDocumentRefresh||isFindPage()||isSameFindTopSearchInPlaceFlow()||shouldBypassPreloadHide()){doReveal();return;}
preloadRevealed=false;preloadHolds.clear();try{html.classList.add(ACTIVE_CLASS);}catch(_){}
addPreload();if(preloadRevealed)return;preloadHolds.add(BOOT_HOLD);if(hardCapTimer)clearTimeout(hardCapTimer);hardCapTimer=window.setTimeout(doReveal,HARD_CAP_MS);releaseBootHoldWhenSettled();}
try{applyEarlyInterfaceTheme();}catch(_){}
beginAndReveal("initial");if(window.document$&&typeof window.document$.subscribe==="function"){try{window.document$.subscribe(()=>{beginAndReveal("document$");});}catch(_){}}else{window.addEventListener("pageshow",()=>{beginAndReveal("pageshow");});}
window.__rkRevealWhenReady=function(){try{doReveal();}catch(_){revealImmediately();}};window.__rkCancelPreloadForFindSamePage=function(){try{userInteractedThisNav=true;disconnectObserver();doReveal();}catch(_){revealImmediately();}};})();