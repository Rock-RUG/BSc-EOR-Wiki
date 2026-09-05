(function(){"use strict";const BUILD="mk-random-tabs-shadow-mobile-v35-direct-finder";if(window.__mkRandomTabsShadowBuild===BUILD){try{window.MkRandomTabs&&window.MkRandomTabs.refresh&&window.MkRandomTabs.refresh();}catch(_){}
return;}
window.__mkRandomTabsShadowBuild=BUILD;const IDS={style:"mk-random-tabs-shadow-style-v33",shell:"mk-random-tabs-shadow",yearPanel:"mk-random-tabs-year-panel",randomPanel:"mk-random-tabs-random-panel",trendingPanel:"mk-random-tabs-trending-panel",activityPanel:"mk-random-tabs-activity-panel",};const state={mounted:false,host:null,tabs:null,shell:null,openPanel:null,openTrigger:null,pinned:false,closeBound:false,resizeTimer:0,refreshTimer:0,searchStateTimer:0,hoverOpenTimer:0,hoverCloseTimer:0,mobileMenuMode:null,accountBadgeRaw:null,accountBadgeHasAccount:false,notificationBadgeCount:0,connectionBadgeCount:0,};function $(sel,root){return(root||document).querySelector(sel);}
function $all(sel,root){return Array.from((root||document).querySelectorAll(sel));}
function cleanText(node){return String(node&&node.textContent||"").replace(/\s+/g," ").trim();}
function textLower(node){return cleanText(node).toLowerCase();}
function hrefOf(a){return String(a&&a.href||(a&&a.getAttribute&&a.getAttribute("href"))||"");}
function hrefLower(a){return hrefOf(a).toLowerCase();}
function safeUrl(href){try{return new URL(href,document.baseURI);}catch(_){return null;}}
function siteRootUrl(){const asset=document.querySelector('script[src*="assets/javascripts/bundle"]')||document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]')||document.querySelector('script[src*="assets/javascripts"]');const attr=asset?(asset.getAttribute("src")||asset.getAttribute("href")||""):"";const u=attr?safeUrl(attr):safeUrl(document.baseURI);if(!u)return document.baseURI;const idx=u.pathname.indexOf("/assets/");if(idx>=0)return u.origin+u.pathname.slice(0,idx+1);const base=safeUrl(document.baseURI);if(!base)return document.baseURI;if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function pathKey(href){const u=safeUrl(href);if(!u)return"";return u.pathname.replace(/\/index\.html$/i,"/").replace(/\/+$/g,"").toLowerCase();}
function legacyConceptFinderHref(href){try{const u=new URL(href);const legacy=/\/custom-random(?:\.html|\/(?:index\.html)?)?$/i;if(!legacy.test(u.pathname))return"";u.pathname=u.pathname.replace(legacy,"/find.html");return u.toString();}catch(_){return"";}}
function redirectLegacyConceptFinder(){const target=legacyConceptFinderHref(window.location.href);if(!target)return false;const fallback=document.getElementById("concept-finder-redirect");if(fallback)fallback.href=target;try{window.location.replace(target);}catch(_){}
return true;}
function samePath(a,b){const aa=pathKey(a);const bb=pathKey(b);return!!aa&&!!bb&&aa===bb;}
function accountFeatureEnabled(){try{return document.documentElement.getAttribute("data-mk-startup-account")!=="off"&&!document.documentElement.classList.contains("mk-startup-account-off");}catch(_){return true;}}
function rankingsItems(trendingHref){const items=[{label:"Most Viewed",href:makeTrendingMetricHref(trendingHref,"views"),noActive:true},{label:"Most Popular",href:makeTrendingMetricHref(trendingHref,"popular"),noActive:true},{label:"Most Tested",href:makeTrendingMetricHref(trendingHref,"tested"),noActive:true},];if(accountFeatureEnabled()){items.push({label:"Biggest Spenders",href:makeTrendingMetricHref(trendingHref,"spenders"),noActive:true},{label:"Mastery Explorers",href:makeTrendingMetricHref(trendingHref,"mastery_explorers"),noActive:true},{label:"Most Active Users",href:makeTrendingMetricHref(trendingHref,"users"),noActive:true},{label:"AI Quiz Lovers",href:makeTrendingMetricHref(trendingHref,"quiz_correct"),noActive:true},);}
return items;}
function hasConnectedAccountForBadge(){const hasAccountKey=(obj)=>{try{return!!String((obj&&(obj.accountKey||obj.account_key||obj.nameKey||obj.name_key))||"").trim();}catch(_){return false;}};try{if(window.MkGuestAccess&&typeof window.MkGuestAccess.hasAccount==="function"&&window.MkGuestAccess.hasAccount())return true;}catch(_){}
try{if(window.MkLocalActivity&&typeof window.MkLocalActivity.getProfile==="function"){const prof=window.MkLocalActivity.getProfile();if(hasAccountKey(prof))return true;}}catch(_){}
try{const raw=localStorage.getItem("mk_comment_profile_v1")||"{}";if(raw===state.accountBadgeRaw)return!!state.accountBadgeHasAccount;state.accountBadgeRaw=raw;state.accountBadgeHasAccount=hasAccountKey(JSON.parse(raw||"{}"));return!!state.accountBadgeHasAccount;}catch(_){return false;}}
function updateAccountPromptBadge(){const badges=document.querySelectorAll('[data-mk-rt-account-badge]');if(!badges||!badges.length)return;const show=!hasConnectedAccountForBadge();badges.forEach((el)=>{if(!el)return;if(el.hidden!==!show)el.hidden=!show;if(el.textContent!=="1")el.textContent="1";try{el.setAttribute("aria-label","Account setup reminder");}catch(_){}});}
function consumeGuestAction(action,detail){try{if(!action)return true;if(window.MkGuestAccess&&typeof window.MkGuestAccess.consume==="function"){return!!window.MkGuestAccess.consume(action,detail||{});}}catch(_){}
return true;}
function isHomeLink(a){const t=textLower(a);const h=hrefLower(a);if(t==="home")return true;try{const u=new URL(hrefOf(a),document.baseURI);const root=new URL(siteRootUrl());const p=u.pathname.replace(/\/index\.html$/i,"/").replace(/\/+$/g,"/");const rp=root.pathname.replace(/\/+$/g,"/");return p===rp;}catch(_){return/(^|\/)index\.html(?:[?#].*)?$/i.test(h);}}
function isFindLink(a){const t=textLower(a);const h=hrefLower(a);return t==="search & filter"||t==="concept finder"||t==="search"||h.includes("find.html")||/(^|\/)find(?:\/|\.html|$)/i.test(h);}
function isTrendingLink(a){const t=textLower(a);const h=hrefLower(a);return t==="trending"||t==="rankings"||h.includes("trending")||h.includes("rankings");}
function isYear1Link(a){const t=textLower(a);const h=hrefLower(a);return t==="year 1"||/(^|\/)year[-_ ]?1(?:\/|\.html|$)/i.test(h);}
function isYear2Link(a){const t=textLower(a);const h=hrefLower(a);return t==="year 2"||/(^|\/)year[-_ ]?2(?:\/|\.html|$)/i.test(h);}
function isCustomRandomLink(a){const h=hrefLower(a);const t=textLower(a);return(h.includes("custom")&&h.includes("random"))||t==="random picker"||t==="concept finder";}
function isCourseRandomLink(a){const h=hrefLower(a);const t=textLower(a);return(h.includes("random")&&h.includes("course"))||t==="course random";}
function isRandomConceptLink(a){const h=hrefLower(a);const t=textLower(a);if(isCustomRandomLink(a)||isCourseRandomLink(a))return false;if(t==="random"||t==="random concept")return true;if(!h.includes("random"))return false;if(h.includes("custom")||h.includes("course"))return false;return/(^|\/)random(?:\/|\.html|$)/i.test(h.split("#")[0].split("?")[0]);}
function makeRandomModeHref(randomHref,mode){try{const u=new URL(randomHref,document.baseURI);u.searchParams.set("mode",String(mode||"concept"));u.hash="";return u.toString();}catch(_){return randomHref;}}
function makeRandomRouteHref(randomHref){return makeRandomModeHref(randomHref,"route");}
function makeTrendingMetricHref(trendingHref,metric){try{const u=new URL(trendingHref||"trending.html",document.baseURI);u.searchParams.set("metric",metric||"views");u.hash="";return u.toString();}catch(_){return trendingHref||"#";}}
function canonicalDirPath(pathname){return String(pathname||"/").replace(/\/index\.html$/i,"/").replace(/\/+$/g,"/");}
function decodePathLabel(segment){let out=String(segment||"");try{out=decodeURIComponent(out);}catch(_){}
out=out.replace(/\.html$/i,"").replace(/[-_]+/g," ").replace(/\s+/g," ").trim();return out||"Course";}
function makeChildDirHref(parentHref,encodedSegment){try{const u=new URL(parentHref,document.baseURI);const base=canonicalDirPath(u.pathname);u.pathname=base+String(encodedSegment||"").replace(/^\/+|\/+$/g,"")+"/";u.search="";u.hash="";return u.toString();}catch(_){return parentHref||"#";}}
function collectYearCourseItems(yearLink){if(!yearLink)return[];let yearUrl;try{yearUrl=new URL(hrefOf(yearLink),document.baseURI);}catch(_){return[];}
const basePath=canonicalDirPath(yearUrl.pathname);const seen=new Map();const selectors=[".md-sidebar--primary .md-nav a.md-nav__link[href]",".md-nav--primary a.md-nav__link[href]",".md-nav a.md-nav__link[href]",".md-tabs__list a.md-tabs__link[href]"];$all(selectors.join(",")).forEach((a)=>{let u;try{u=new URL(hrefOf(a),document.baseURI);}catch(_){return;}
if(u.origin!==yearUrl.origin)return;const childPath=canonicalDirPath(u.pathname);if(!childPath.startsWith(basePath)||childPath===basePath)return;const rel=childPath.slice(basePath.length).replace(/^\/+|\/+$/g,"");if(!rel)return;const parts=rel.split("/").filter(Boolean);const first=parts[0]||"";if(!first||/^index(?:\.html)?$/i.test(first))return;const key=first.toLowerCase();const item=seen.get(key)||{label:decodePathLabel(first),href:makeChildDirHref(yearUrl.toString(),first),order:seen.size,exactRoot:false,};const isExactRoot=parts.length===1;const label=cleanText(a);if(isExactRoot&&label){item.label=label;item.href=u.toString();item.exactRoot=true;}else if(!item.exactRoot&&label&&!/^(previous|next|home|year\s*[12])$/i.test(label)){item.label=item.label||label;}
seen.set(key,item);});return Array.from(seen.values()).sort((a,b)=>a.order-b.order).map((item)=>({label:item.label,href:item.href}));}
function canUseHoverDropdown(){try{return!!(window.matchMedia&&window.matchMedia("(hover: hover) and (pointer: fine)").matches);}catch(_){return false;}}
function isMobileMenuMode(){try{if(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches)return true;}catch(_){}
return!canUseHoverDropdown();}
function findLinks(){const list=document.querySelector(".md-tabs__list");const links=list?$all("a.md-tabs__link[href]",list):[];const home=links.find(isHomeLink)||null;const find=links.find(isFindLink)||null;const trending=links.find(isTrendingLink)||null;const year1=links.find(isYear1Link)||null;const year2=links.find(isYear2Link)||null;const random=links.find(isRandomConceptLink)||null;const custom=links.find(isCustomRandomLink)||null;const course=links.find(isCourseRandomLink)||null;return{list,links,home,find,trending,year1,year2,random,custom,course};}
function ensureStyles(){if(document.getElementById(IDS.style))return;const st=document.createElement("style");st.id=IDS.style;st.textContent=`
/* Shadow tabs: keep Material's original tab list in layout, but paint our own tabs above it. */
.md-tabs.mk-rt-active .md-tabs__list{
  visibility:hidden !important;
  pointer-events:none !important;
}
.md-tabs .mk-rt-host{
  position:relative !important;
}
#${IDS.shell}{
  position:absolute;
  inset:0;
  z-index:1;
  display:flex;
  align-items:center;
  width:100%;
  height:100%;
  box-sizing:border-box;
  pointer-events:auto;
  font-family:var(--md-text-font-family, inherit);
  font-size:var(--md-typeset-font-size, .8rem);
  line-height:1;
  color:inherit;
  overflow:visible;
  -webkit-font-smoothing:antialiased;
}
#${IDS.shell} .mk-rt-left,
#${IDS.shell} .mk-rt-right{
  display:flex;
  align-items:center;
  min-width:0;
  height:100%;
  gap:.12rem;
}
#${IDS.shell} .mk-rt-left{
  flex:0 1 auto;
}
#${IDS.shell} .mk-rt-spacer{
  flex:1 1 auto;
  min-width:1.2rem;
}
#${IDS.shell} .mk-rt-right{
  flex:0 0 auto;
  justify-content:flex-end;
}
#${IDS.shell} a.mk-rt-link,
#${IDS.shell} button.mk-rt-trigger{
  appearance:none;
  border:0 !important;
  outline:0;
  box-shadow:none !important;
  background:transparent !important;
  border-radius:0 !important;
  height:100%;
  min-height:2.4rem;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:.22rem;
  box-sizing:border-box;
  padding:0 .62rem;
  margin:0;
  /* --md-primary-bg-color--light is hsla(0,0%,100%,.7), which renders #c6cbe9 on
     the indigo header: 4.28:1 against the WCAG 2.1 AA minimum of 4.5:1 for normal
     text. These are the site's top-level links on every page, so they are worth
     clearing outright — .86 measures 5.5:1 on the same background. */
  color:rgba(255,255,255,.86);
  opacity:1;
  text-decoration:none !important;
  white-space:nowrap;
  font:inherit;
  font-weight:400;
  letter-spacing:.01em;
  cursor:pointer;
  -webkit-tap-highlight-color:transparent;
  transition:color 125ms ease, opacity 125ms ease;
}
#${IDS.shell} a.mk-rt-link:hover,
#${IDS.shell} a.mk-rt-link:focus-visible,
#${IDS.shell} button.mk-rt-trigger:hover,
#${IDS.shell} button.mk-rt-trigger:focus-visible,
#${IDS.shell} button.mk-rt-trigger[aria-expanded="true"]{
  color:var(--md-accent-fg-color) !important;
  opacity:1;
  background:transparent !important;
  box-shadow:none !important;
}
#${IDS.shell} a.mk-rt-link.mk-rt-active,
#${IDS.shell} button.mk-rt-trigger.mk-rt-active{
  color:var(--md-primary-bg-color, #fff);
}
#${IDS.shell} .mk-rt-chevron{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:.7rem;
  height:.7rem;
  min-width:.7rem;
  border:0 !important;
  border-radius:0 !important;
  background:transparent !important;
  box-shadow:none !important;
  color:currentColor;
  opacity:.86;
  transform:rotate(0deg);
  transition:transform 130ms ease, color 125ms ease, opacity 125ms ease;
  pointer-events:none;
}
#${IDS.shell} button.mk-rt-trigger[aria-expanded="true"] .mk-rt-chevron{
  transform:rotate(180deg);
  color:var(--md-accent-fg-color);
  opacity:1;
}
#${IDS.shell} .mk-rt-chevron svg{
  display:block;
  width:.7rem;
  height:.7rem;
  background:transparent !important;
  border-radius:0 !important;
  box-shadow:none !important;
}
.mk-rt-panel{
  position:fixed;
  z-index:200;
  display:none;
  width:max-content;
  min-width:0;
  max-width:calc(100vw - 18px);
  margin:0;
  padding:.28rem 0;
  box-sizing:border-box;
  border-radius:12px;
  border:1px solid rgba(100, 116, 139, 0.14);
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 14%, transparent);
  background:var(--md-primary-fg-color);
  background:color-mix(in srgb, var(--md-primary-fg-color) 88%, var(--md-default-bg-color) 12%);
  color:var(--md-primary-bg-color, #fff);
  box-shadow:0 10px 26px rgba(0,0,0,.20);
  font-family:var(--md-text-font-family, inherit);
  font-size:var(--md-typeset-font-size, .8rem);
  font-weight:400;
  line-height:1.1;
  overflow:auto;
  overflow-x:hidden;
  overscroll-behavior:contain;
  max-height:min(72vh, 520px);
  -webkit-overflow-scrolling:touch;
  -webkit-font-smoothing:antialiased;
}
.mk-rt-panel.mk-rt-open{
  display:block;
}

/* Search safety:
   Do not hide the shadow tab bar itself. On desktop, Material may leave
   .md-search--active around briefly after blur, which used to make the whole
   tab row disappear. Only dropdown panels are suppressed while header search
   is active; the search suggestion layer is lifted by search-suggestions.js. */
html:is(.mk-rt-search-active, :has(.md-header input[data-md-component="search-query"]:focus)) .mk-rt-panel{
  display:none !important;
  opacity:0 !important;
  visibility:hidden !important;
  pointer-events:none !important;
}
.mk-rt-badge{
  min-width:16px;
  height:16px;
  padding:0 4px;
  border-radius:999px;
  background:#e11d48;
  color:#fff;
  font-size:10px;
  font-weight:800;
  line-height:16px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  box-sizing:border-box;
  margin-left:.55rem;
}
.mk-rt-badge[hidden]{ display:none !important; }
#${IDS.shell} .mk-rt-trigger{ position:relative; }
#${IDS.shell} .mk-rt-trigger .mk-rt-label{ position:relative; display:inline-flex; align-items:center; }
#${IDS.shell} .mk-rt-trigger .mk-rt-label .mk-rt-badge{
  position:absolute;
  right:-.62rem;
  top:-.58rem;
  border:1px solid var(--md-primary-fg-color);
  border:1px solid color-mix(in srgb, var(--md-primary-fg-color) 68%, transparent);
  margin-left:0;
}
.mk-rt-panel a.mk-rt-panel-item,
.mk-rt-panel button.mk-rt-panel-item{
  appearance:none;
  border:0;
  background:transparent;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:.55rem;
  width:100%;
  box-sizing:border-box;
  padding:.36rem .78rem;
  justify-content:flex-start;
  text-align:left;
  color:var(--md-primary-bg-color--light, rgba(255,255,255,.76));
  text-decoration:none !important;
  white-space:nowrap;
  font:inherit;
  line-height:1.1;
}
.mk-rt-panel .mk-rt-panel-label{ flex:0 1 auto; min-width:0; text-align:left; }
.mk-rt-panel .mk-rt-panel-account-badge{ margin-left:.35rem; flex:0 0 auto; }
.mk-rt-panel a.mk-rt-panel-item:hover,
.mk-rt-panel a.mk-rt-panel-item:focus-visible,
.mk-rt-panel button.mk-rt-panel-item:hover,
.mk-rt-panel button.mk-rt-panel-item:focus-visible{
  color:var(--md-accent-fg-color) !important;
  background:transparent !important;
  box-shadow:none !important;
  outline:0;
}
.mk-rt-panel a.mk-rt-panel-item.mk-rt-active,
.mk-rt-panel button.mk-rt-panel-item.mk-rt-active{
  color:var(--md-primary-bg-color, #fff);
}
.mk-rt-panel .mk-rt-sep{
  height:1px;
  margin:.10rem .78rem;
  background:rgba(255,255,255,.18);
}
.mk-rt-panel .mk-rt-group{
  display:block;
}
.mk-rt-panel .mk-rt-group summary{
  list-style:none;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:.7rem;
  padding:.36rem .78rem;
  color:var(--md-primary-bg-color--light, rgba(255,255,255,.76));
  white-space:nowrap;
  user-select:none;
}
.mk-rt-panel .mk-rt-group summary::-webkit-details-marker{ display:none; }
.mk-rt-panel .mk-rt-group summary::after{
  content:"›";
  opacity:.55;
  transform:rotate(0deg);
  transition:transform 120ms ease;
}
.mk-rt-panel .mk-rt-group[open] summary::after{ transform:rotate(90deg); }
.mk-rt-panel .mk-rt-group summary:hover{ color:var(--md-accent-fg-color) !important; }
.mk-rt-panel .mk-rt-group-body{ padding:.02rem 0 .14rem; }
.mk-rt-panel .mk-rt-group-body .mk-rt-panel-item{ padding-left:1.18rem; font-size:.74em; }
@media (max-height: 640px){ .mk-rt-panel{ max-height:calc(100vh - 74px); } }
html[data-md-color-scheme="default"] .mk-rt-panel,
body[data-md-color-scheme="default"] .mk-rt-panel{
  background:var(--md-default-bg-color);
  color:var(--md-default-fg-color);
  border-color:rgba(0,0,0,.10);
  box-shadow:0 10px 26px rgba(0,0,0,.16);
}
html[data-md-color-scheme="default"] .mk-rt-panel a.mk-rt-panel-item,
body[data-md-color-scheme="default"] .mk-rt-panel a.mk-rt-panel-item,
html[data-md-color-scheme="default"] .mk-rt-panel button.mk-rt-panel-item,
body[data-md-color-scheme="default"] .mk-rt-panel button.mk-rt-panel-item,
html[data-md-color-scheme="default"] .mk-rt-panel .mk-rt-group summary,
body[data-md-color-scheme="default"] .mk-rt-panel .mk-rt-group summary{
  color:var(--md-default-fg-color);
  color:color-mix(in srgb, var(--md-default-fg-color) 76%, transparent);
}
html[data-md-color-scheme="default"] .mk-rt-panel a.mk-rt-panel-item.mk-rt-active,
body[data-md-color-scheme="default"] .mk-rt-panel a.mk-rt-panel-item.mk-rt-active,
.mk-rt-panel button.mk-rt-panel-item.mk-rt-active{
  color:var(--md-default-fg-color);
}
html[data-md-color-scheme="default"] .mk-rt-panel .mk-rt-sep,
body[data-md-color-scheme="default"] .mk-rt-panel .mk-rt-sep{
  background:rgba(0,0,0,.10);
}
/* Cosmetic header skins are account-level choices injected by account-tracking.js.
   The dropdown panels live directly under document.body, so they must be
   styled here as well, not only through the Material header/tabs containers. */
html[data-mk-header-skin="header_skin_aurora"]{
  --mk-header-panel-bg:linear-gradient(135deg,#172554 0%,#155e75 46%,#0f766e 100%);
  --mk-header-panel-bg-glass:linear-gradient(135deg,rgba(23,37,84,.78) 0%,rgba(21,94,117,.72) 46%,rgba(15,118,110,.70) 100%);
  --mk-header-panel-border:rgba(103,232,249,.28);
}
html[data-mk-header-skin="header_skin_sunset"]{
  --mk-header-panel-bg:linear-gradient(135deg,#7c2d12 0%,#be123c 54%,#d97706 100%);
  --mk-header-panel-bg-glass:linear-gradient(135deg,rgba(124,45,18,.78) 0%,rgba(190,18,60,.72) 54%,rgba(217,119,6,.70) 100%);
  --mk-header-panel-border:rgba(253,186,116,.34);
}
html[data-mk-header-skin="header_skin_midnight"]{
  --mk-header-panel-bg:linear-gradient(135deg,#020617 0%,#111827 56%,#1e3a8a 100%);
  --mk-header-panel-bg-glass:linear-gradient(135deg,rgba(2,6,23,.84) 0%,rgba(17,24,39,.76) 56%,rgba(30,58,138,.72) 100%);
  --mk-header-panel-border:rgba(147,197,253,.25);
}
html[data-mk-header-skin] .mk-rt-panel{
  background:var(--mk-header-panel-bg) !important;
  color:rgba(255,255,255,.90) !important;
  border-color:var(--mk-header-panel-border) !important;
}
html[data-mk-header-skin] .mk-rt-panel a.mk-rt-panel-item,
html[data-mk-header-skin] .mk-rt-panel button.mk-rt-panel-item,
html[data-mk-header-skin] .mk-rt-panel .mk-rt-group summary,
html[data-mk-header-skin][data-md-color-scheme="default"] .mk-rt-panel a.mk-rt-panel-item,
html[data-mk-header-skin][data-md-color-scheme="default"] .mk-rt-panel button.mk-rt-panel-item,
html[data-mk-header-skin][data-md-color-scheme="default"] .mk-rt-panel .mk-rt-group summary{
  color:rgba(255,255,255,.80) !important;
}
html[data-mk-header-skin] .mk-rt-panel a.mk-rt-panel-item:hover,
html[data-mk-header-skin] .mk-rt-panel a.mk-rt-panel-item:focus-visible,
html[data-mk-header-skin] .mk-rt-panel button.mk-rt-panel-item:hover,
html[data-mk-header-skin] .mk-rt-panel button.mk-rt-panel-item:focus-visible{
  color:#fff !important;
  background:rgba(255,255,255,.08) !important;
}
html[data-mk-header-skin] .mk-rt-panel .mk-rt-sep{ background:rgba(255,255,255,.22) !important; }
html[data-mk-dropdown-skin="dropdown_glass"] .mk-rt-panel{
  backdrop-filter:blur(5px) saturate(1.04) !important;
  -webkit-backdrop-filter:blur(5px) saturate(1.04) !important;
  background:var(--mk-header-panel-bg-glass-v58, var(--md-default-bg-color)) !important;
  border:1px solid rgba(255,255,255,.26) !important;
  box-shadow:0 18px 54px rgba(15,23,42,.20) !important;
  overflow:visible !important;
}
@supports (color: color-mix(in srgb, black, white)){
html[data-mk-dropdown-skin="dropdown_glass"] .mk-rt-panel{
  background:var(--mk-header-panel-bg-glass-v58, color-mix(in srgb,var(--md-default-bg-color) 54%,transparent)) !important;
}
}
html[data-mk-dropdown-skin="dropdown_cute"] .mk-rt-panel{
  border-radius:24px !important;
  overflow:hidden !important;
  box-shadow:0 18px 50px rgba(15,23,42,.22) !important;
}
html[data-mk-dropdown-skin="dropdown_cute"] .mk-rt-panel a.mk-rt-panel-item,
html[data-mk-dropdown-skin="dropdown_cute"] .mk-rt-panel button.mk-rt-panel-item{
  border-radius:14px !important;
  margin:2px 6px !important;
  width:auto !important;
}
.md-tab-dropdown-panel.md-random-dropdown-panel,
#random-dropdown-panel.md-random-dropdown-panel,
#year-dropdown-panel.md-random-dropdown-panel{
  backdrop-filter:none !important;
  -webkit-backdrop-filter:none !important;
}
html[data-mk-dropdown-skin="dropdown_glass"] .md-tab-dropdown-panel.md-random-dropdown-panel,
html[data-mk-dropdown-skin="dropdown_glass"] #random-dropdown-panel.md-random-dropdown-panel,
html[data-mk-dropdown-skin="dropdown_glass"] #year-dropdown-panel.md-random-dropdown-panel{
  backdrop-filter:blur(5px) saturate(1.04) !important;
  -webkit-backdrop-filter:blur(5px) saturate(1.04) !important;
  background:var(--mk-header-panel-bg-glass-v58, var(--md-default-bg-color)) !important;
  overflow:visible !important;
}
@supports (color: color-mix(in srgb, black, white)){
html[data-mk-dropdown-skin="dropdown_glass"] .md-tab-dropdown-panel.md-random-dropdown-panel,
html[data-mk-dropdown-skin="dropdown_glass"] #random-dropdown-panel.md-random-dropdown-panel,
html[data-mk-dropdown-skin="dropdown_glass"] #year-dropdown-panel.md-random-dropdown-panel{
  background:var(--mk-header-panel-bg-glass-v58, color-mix(in srgb,var(--md-default-bg-color) 54%,transparent)) !important;
}
}
.mk-rt-panel.mk-rt-mobile-year-course-panel{
  max-width:min(28rem, calc(100vw - 18px));
}
@media (max-width: 76.1875em){
  #${IDS.shell}{
    font-size:.72rem;
  }
  #${IDS.shell} a.mk-rt-link,
  #${IDS.shell} button.mk-rt-trigger{
    padding:0 .56rem;
    min-height:2.3rem;
    font-weight:400;
  }
  #${IDS.shell} .mk-rt-spacer{
    min-width:.65rem;
  }
}
@media (max-width: 720px){
  #${IDS.shell}{
    font-size:.72rem;
    padding-left:1.05rem;
    padding-right:1.05rem;
  }
  #${IDS.shell} .mk-rt-left,
  #${IDS.shell} .mk-rt-right{
    gap:0;
  }
  #${IDS.shell} a.mk-rt-link,
  #${IDS.shell} button.mk-rt-trigger{
    padding:0 .38rem;
    min-height:2.25rem;
    letter-spacing:0;
  }
  #${IDS.shell} .mk-rt-left > .mk-rt-link:first-child{
    padding-left:0;
  }
  #${IDS.shell} .mk-rt-right > :last-child{
    padding-right:0;
  }
  #${IDS.shell} .mk-rt-spacer{
    min-width:.28rem;
  }

  /* Touch devices can keep :hover/:focus after the first tap. Keep closed
     dropdown tabs in their normal colour, and use the accent colour only
     while the panel is actually open. */
  #${IDS.shell} button.mk-rt-trigger:hover,
  #${IDS.shell} button.mk-rt-trigger:focus,
  #${IDS.shell} button.mk-rt-trigger:focus-visible{
    color:var(--md-primary-bg-color--light, rgba(255,255,255,.72)) !important;
    background:transparent !important;
    box-shadow:none !important;
    outline:0 !important;
  }
  #${IDS.shell} button.mk-rt-trigger[aria-expanded="true"]{
    color:var(--md-accent-fg-color) !important;
  }
  #${IDS.shell} button.mk-rt-trigger[aria-expanded="true"] .mk-rt-chevron{
    color:var(--md-accent-fg-color) !important;
  }
  .mk-rt-panel{
    font-size:.74rem;
    border-radius:11px;
  }
  .mk-rt-panel a.mk-rt-panel-item,
  .mk-rt-panel button.mk-rt-panel-item{
    padding:.34rem .72rem;
    background:transparent !important;
  }
  .mk-rt-panel .mk-rt-year-row{
    display:grid;
    grid-template-columns:max-content .76rem;
    align-items:stretch;
    justify-content:start;
    column-gap:.10rem;
    width:max-content;
    min-width:0;
  }
  .mk-rt-panel .mk-rt-year-text-btn{
    appearance:none;
    border:0 !important;
    outline:0;
    box-shadow:none !important;
    background:transparent !important;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:flex-start;
    width:100%;
    min-width:0;
    box-sizing:border-box;
    padding:.46rem .12rem .46rem .78rem;
    color:var(--md-primary-bg-color--light, rgba(255,255,255,.76));
    text-decoration:none !important;
    white-space:nowrap;
    text-align:left;
    font:inherit;
    line-height:1.1;
    touch-action:manipulation;
    -webkit-tap-highlight-color:transparent;
  }
  .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:hover,
  .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:focus,
  .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:focus-visible,
  .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:active,
  .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn.mk-rt-active{
    color:var(--md-primary-bg-color--light, rgba(255,255,255,.76)) !important;
    background:transparent !important;
    box-shadow:none !important;
    outline:0;
  }
  .mk-rt-panel .mk-rt-year-arrow{
    appearance:none;
    position:relative;
    z-index:3;
    width:.76rem;
    min-width:.76rem;
    border:0 !important;
    margin:0;
    padding:0;
    display:flex;
    align-items:center;
    justify-content:center;
    background:transparent !important;
    color:var(--md-primary-bg-color--light, rgba(255,255,255,.76));
    font:inherit;
    font-size:.72rem;
    font-weight:600;
    line-height:1;
    cursor:pointer;
    touch-action:manipulation;
    -webkit-tap-highlight-color:transparent;
  }
  .mk-rt-panel .mk-rt-year-arrow svg{
    display:block;
    width:.50rem;
    height:.50rem;
  }
  html[data-md-color-scheme="default"] .mk-rt-panel .mk-rt-year-text-btn,
  body[data-md-color-scheme="default"] .mk-rt-panel .mk-rt-year-text-btn,
  html[data-md-color-scheme="default"] .mk-rt-panel .mk-rt-year-arrow,
  body[data-md-color-scheme="default"] .mk-rt-panel .mk-rt-year-arrow{
    color:var(--md-default-fg-color);
    color:color-mix(in srgb, var(--md-default-fg-color) 76%, transparent);
  }
  .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:hover,
  .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:focus,
  .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:focus-visible,
  .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:active{
    color:var(--md-primary-bg-color--light, rgba(255,255,255,.76)) !important;
    background:transparent !important;
    box-shadow:none !important;
    outline:0;
  }
  .mk-rt-panel .mk-rt-year-back{
    font-weight:600;
  }
  .mk-rt-panel .mk-rt-year-empty{
    cursor:default;
    opacity:.68;
  }
  .mk-rt-panel a.mk-rt-panel-item:hover,
  .mk-rt-panel a.mk-rt-panel-item:focus,
  .mk-rt-panel a.mk-rt-panel-item:focus-visible,
  .mk-rt-panel a.mk-rt-panel-item:active,
  .mk-rt-panel a.mk-rt-panel-item.mk-rt-active,
.mk-rt-panel button.mk-rt-panel-item.mk-rt-active{
    background:transparent !important;
    box-shadow:none !important;
  }
  .mk-rt-panel a.mk-rt-panel-item:hover,
  .mk-rt-panel a.mk-rt-panel-item:focus,
  .mk-rt-panel a.mk-rt-panel-item:focus-visible,
  .mk-rt-panel a.mk-rt-panel-item:active,
  .mk-rt-panel button.mk-rt-panel-item:hover,
  .mk-rt-panel button.mk-rt-panel-item:focus,
  .mk-rt-panel button.mk-rt-panel-item:focus-visible,
  .mk-rt-panel button.mk-rt-panel-item:active{
    color:var(--md-accent-fg-color) !important;
  }
  .mk-rt-panel a.mk-rt-panel-item.mk-rt-active,
.mk-rt-panel button.mk-rt-panel-item.mk-rt-active{
    color:var(--md-accent-fg-color) !important;
  }

  .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:hover,
  .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:focus,
  .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:focus-visible,
  .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:active,
  .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item.mk-rt-active{
    color:var(--md-primary-bg-color--light, rgba(255,255,255,.76)) !important;
    background:transparent !important;
    box-shadow:none !important;
    outline:0;
  }
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:hover,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:hover,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:focus,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:focus,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:focus-visible,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:focus-visible,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:active,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item:active,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item.mk-rt-active,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-trending-panel a.mk-rt-panel-item.mk-rt-active,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:hover,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:hover,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:focus,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:focus,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:focus-visible,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:focus-visible,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:active,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn:active,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn.mk-rt-active,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-text-btn.mk-rt-active,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:hover,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:hover,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:focus,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:focus,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:focus-visible,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:focus-visible,
  html[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:active,
  body[data-md-color-scheme="default"] .mk-rt-panel.mk-rt-mobile-year-panel .mk-rt-year-arrow:active{
    color:var(--md-default-fg-color) !important;
    color:color-mix(in srgb, var(--md-default-fg-color) 76%, transparent) !important;
  }
 }
@media (max-width: 430px){
  #${IDS.shell}{
    font-size:.68rem;
    padding-left:.96rem;
    padding-right:.96rem;
  }
  #${IDS.shell} a.mk-rt-link,
  #${IDS.shell} button.mk-rt-trigger{
    padding:0 .30rem;
  }
}
    `.trim();(document.head||document.documentElement).appendChild(st);}
function chevronSvg(){return'<span class="mk-rt-chevron" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M4 6l4 4 4-4"></path></svg></span>';}
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=text;return node;}
function makeLink(label,href,extraClass){const a=document.createElement("a");a.className="mk-rt-link"+(extraClass?" "+extraClass:"");a.href=href||"#";a.textContent=label;if(samePath(a.href,window.location.href))a.classList.add("mk-rt-active");return a;}
function makeTrigger(label,panelId){const btn=document.createElement("button");btn.type="button";btn.className="mk-rt-trigger";btn.id=panelId+"-trigger";btn.setAttribute("aria-haspopup","menu");btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-controls",panelId);const panel=document.getElementById(panelId);if(panel)panel.setAttribute("aria-labelledby",btn.id);btn.innerHTML=`<span class="mk-rt-label">${label}</span>${chevronSvg()}`;return btn;}
function ensurePanel(id){let panel=document.getElementById(id);if(!panel){panel=document.createElement("div");panel.id=id;panel.className="mk-rt-panel";panel.setAttribute("role","menu");panel.addEventListener("mouseenter",()=>{try{if(state.hoverCloseTimer)window.clearTimeout(state.hoverCloseTimer);}catch(_){}
state.hoverCloseTimer=0;});panel.addEventListener("mouseleave",()=>queueHoverClose());panel.addEventListener("focusin",clearHoverTimers);panel.addEventListener("keydown",(event)=>{if(!["ArrowDown","ArrowUp","Home","End"].includes(event.key))return;const items=visibleMenuItems(panel);if(!items.length)return;event.preventDefault();const current=items.indexOf(document.activeElement);const next=event.key==="Home"?0:event.key==="End"?items.length-1:event.key==="ArrowDown"?(current+1)%items.length:(current+items.length-1)%items.length;items[next].focus();});document.body.appendChild(panel);}
return panel;}
function resetPanelInteractionState(panel){try{const active=document.activeElement;if(active&&active.blur&&panel&&panel.contains(active))active.blur();}catch(_){}
try{if(!panel)return;panel.querySelectorAll('.mk-rt-year-text-btn, .mk-rt-year-arrow, .mk-rt-panel-item').forEach((node)=>{try{node.blur&&node.blur();}catch(_){}});}catch(_){}}
function queueLocalActivityOpen(kind){const type=kind||"visits";const request={type,ts:Date.now(),source:"top-tabs"};try{window.__mkPendingLocalActivityOpen=request;}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-open-local-activity",{detail:{type,source:"top-tabs",queued:true}}));}catch(_){}
return request;}
function openLocalActivity(kind){const type=kind||"visits";try{closeOpenPanel({returnFocus:true});if(window.MkLocalActivity&&typeof window.MkLocalActivity.open==="function"){try{delete window.__mkPendingLocalActivityOpen;}catch(_){window.__mkPendingLocalActivityOpen=null;}
window.MkLocalActivity.open(type);closeOpenPanel();return;}
let pendingRequest=queueLocalActivityOpen(type);closeOpenPanel();let attempts=0;const retry=()=>{if(window.__mkPendingLocalActivityOpen!==pendingRequest)return;attempts+=1;try{if(window.MkLocalActivity&&typeof window.MkLocalActivity.open==="function"){window.MkLocalActivity.open(type);if(window.__mkPendingLocalActivityOpen===pendingRequest){try{delete window.__mkPendingLocalActivityOpen;}catch(_){window.__mkPendingLocalActivityOpen=null;}}
return;}
pendingRequest=queueLocalActivityOpen(type);}catch(_){}
if(attempts<20)window.setTimeout(retry,150);else{try{window.dispatchEvent(new CustomEvent("mk-local-activity-open-failed",{detail:{type,source:"top-tabs"}}));}catch(_){}}};window.setTimeout(retry,80);}catch(_){}}
function tryDirectRandomNavigation(item){try{if(!item||!item.randomDirect)return false;const api=window.MkRandom;if(!api||typeof api.jumpFromHref!=="function")return false;api.jumpFromHref(item.href||"",{source:"top-tabs"}).catch(()=>{try{window.location.assign(item.href||"#");}catch(_){}});return true;}catch(_){return false;}}
function makePanelItem(item){if(item&&item.action==="local-activity"){const b=document.createElement("button");b.type="button";b.className="mk-rt-panel-item";b.dataset.mkLocalKind=item.kind||"";if(item.kind==="notifications"){b.innerHTML=`<span class="mk-rt-panel-label">${item.label || ""}</span><span class="mk-rt-badge" data-mk-rt-notification-badge hidden>0</span>`;}else if(item.kind==="connections"){b.innerHTML=`<span class="mk-rt-panel-label">${item.label || ""}</span><span class="mk-rt-badge" data-mk-rt-connection-badge hidden>0</span>`;}else if(item.kind==="info"){b.innerHTML=`<span class="mk-rt-panel-label">${item.label || ""}</span><span class="mk-rt-badge mk-rt-account-badge mk-rt-panel-account-badge" data-mk-rt-account-badge>1</span>`;}else if(item.kind==="shop"){b.innerHTML=`<span class="mk-rt-panel-label">${item.label || ""}</span><span class="mk-rt-badge mk-rt-shop-discount-badge" data-mk-shop-discount-badge hidden>1</span>`;}else{b.textContent=item.label||"";}
b.setAttribute("role","menuitem");b.addEventListener("click",(ev)=>{ev.preventDefault();ev.stopPropagation();openLocalActivity(item.kind||"visits");});return b;}
const a=document.createElement("a");a.className="mk-rt-panel-item";a.href=item.href||"#";a.textContent=item.label||"";a.setAttribute("role","menuitem");if(item&&item.noActive)a.dataset.mkNoActive="1";if(!(item&&item.noActive)&&samePath(a.href,window.location.href))a.classList.add("mk-rt-active");a.addEventListener("click",(ev)=>{if(item&&item.guestAction&&!consumeGuestAction(item.guestAction,{title:item.label||"",path:item.href||"",source:"top-tabs"})){ev.preventDefault();ev.stopPropagation();return;}
resetPanelInteractionState(a.closest&&a.closest(".mk-rt-panel"));closeOpenPanel();if(tryDirectRandomNavigation(item)){ev.preventDefault();ev.stopPropagation();return;}},true);return a;}
function fillPanel(panel,items){if(!panel)return;resetPanelInteractionState(panel);panel.classList.remove("mk-rt-mobile-year-panel","mk-rt-mobile-trending-panel");panel.innerHTML="";(items||[]).forEach((item,idx)=>{if(idx>0)panel.appendChild(el("div","mk-rt-sep"));if(item&&item.action==="group"){const details=document.createElement("details");details.className="mk-rt-group";if(item.open)details.open=true;const summary=document.createElement("summary");summary.textContent=item.label||"";summary.setAttribute("role","menuitem");const body=document.createElement("div");body.className="mk-rt-group-body";(item.children||[]).forEach((child,cidx)=>{if(cidx>0)body.appendChild(el("div","mk-rt-sep"));body.appendChild(makePanelItem(child));});details.appendChild(summary);details.appendChild(body);panel.appendChild(details);return;}
panel.appendChild(makePanelItem(item||{}));});}
function fillMobileYearPanel(panel,items){if(!panel)return;resetPanelInteractionState(panel);panel.classList.add("mk-rt-mobile-year-panel");panel.classList.remove("mk-rt-mobile-trending-panel","mk-rt-mobile-year-course-panel");panel.innerHTML="";(items||[]).forEach((item,idx)=>{if(idx>0)panel.appendChild(el("div","mk-rt-sep"));const row=document.createElement("div");row.className="mk-rt-year-row";row.setAttribute("role","none");const textBtn=document.createElement("button");textBtn.type="button";textBtn.className="mk-rt-year-text-btn";textBtn.textContent=item&&item.label?item.label:"Year";textBtn.setAttribute("role","menuitem");let lastTextNavAt=0;const stopOnly=(ev)=>{if(!ev)return;try{ev.stopPropagation();}catch(_){}
try{ev.stopImmediatePropagation();}catch(_){}};const swallow=(ev)=>{if(!ev)return;try{ev.preventDefault();}catch(_){}
try{ev.stopPropagation();}catch(_){}
try{ev.stopImmediatePropagation();}catch(_){}};const navigateText=(ev)=>{swallow(ev);resetPanelInteractionState(panel);const href=item&&item.href?item.href:"#";if(!href||href==="#")return;const now=Date.now?Date.now():new Date().getTime();if(now-lastTextNavAt<520)return;lastTextNavAt=now;closeOpenPanel();window.setTimeout(()=>{try{window.location.assign(href);}catch(_){window.location.href=href;}},0);};["pointerdown","mousedown","touchstart"].forEach((eventName)=>{textBtn.addEventListener(eventName,stopOnly,{capture:true,passive:false});});textBtn.addEventListener("touchend",navigateText,{capture:true,passive:false});textBtn.addEventListener("pointerup",navigateText,true);textBtn.addEventListener("click",navigateText,true);textBtn.addEventListener("keydown",(ev)=>{if(ev.key==="Enter"||ev.key===" ")navigateText(ev);},true);row.appendChild(textBtn);const arrow=document.createElement("button");arrow.type="button";arrow.className="mk-rt-year-arrow";arrow.innerHTML='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><path d="M6 4l4 4-4 4"></path></svg>';arrow.setAttribute("role","menuitem");arrow.setAttribute("aria-label",`Show ${item && item.label ? item.label : "year"} courses`);let lastArrowOpenAt=0;const openCoursesFromArrow=(ev)=>{const keyboardActivation=ev&&(ev.type==="keydown"||(ev.type==="click"&&ev.detail===0));swallow(ev);resetPanelInteractionState(panel);const now=Date.now?Date.now():new Date().getTime();if(now-lastArrowOpenAt<420)return;lastArrowOpenAt=now;try{panel.__mkRtParentRect=panel.getBoundingClientRect();}catch(_){panel.__mkRtParentRect=null;}
fillMobileYearCoursePanel(panel,item||{},items||[]);if(state.openPanel===panel&&state.openTrigger)placePanel(panel,state.openTrigger);if(keyboardActivation){const first=visibleMenuItems(panel)[0];if(first)first.focus({preventScroll:true});}};["pointerdown","mousedown","touchstart"].forEach((eventName)=>{arrow.addEventListener(eventName,stopOnly,{capture:true,passive:false});});arrow.addEventListener("touchend",openCoursesFromArrow,{capture:true,passive:false});arrow.addEventListener("pointerup",openCoursesFromArrow,true);arrow.addEventListener("click",openCoursesFromArrow,true);arrow.addEventListener("keydown",(ev)=>{if(ev.key==="Enter"||ev.key===" ")openCoursesFromArrow(ev);},true);row.appendChild(arrow);panel.appendChild(row);});}
function fillMobileYearCoursePanel(panel,item,parentItems){if(!panel)return;resetPanelInteractionState(panel);panel.classList.add("mk-rt-mobile-year-panel","mk-rt-mobile-year-course-panel");panel.classList.remove("mk-rt-mobile-trending-panel");panel.innerHTML="";const back=document.createElement("button");back.type="button";back.className="mk-rt-panel-item mk-rt-year-back";back.textContent=`‹ Back to Year`;back.setAttribute("role","menuitem");back.addEventListener("click",(ev)=>{const keyboardActivation=ev.detail===0;ev.preventDefault();ev.stopPropagation();resetPanelInteractionState(panel);try{panel.__mkRtParentRect=null;}catch(_){}
fillMobileYearPanel(panel,parentItems||[]);if(state.openPanel===panel&&state.openTrigger)placePanel(panel,state.openTrigger);if(keyboardActivation){const arrows=panel.querySelectorAll(".mk-rt-year-arrow");const previous=arrows[Math.max(0,(parentItems||[]).indexOf(item))];if(previous)previous.focus({preventScroll:true});}});panel.appendChild(back);const courses=(item&&item.children)||[];if(!courses.length){panel.appendChild(el("div","mk-rt-sep"));const empty=document.createElement("button");empty.type="button";empty.className="mk-rt-panel-item mk-rt-year-empty";empty.textContent="No course list found";empty.setAttribute("role","menuitem");empty.disabled=true;panel.appendChild(empty);return;}
courses.forEach((course,idx)=>{panel.appendChild(el("div","mk-rt-sep"));panel.appendChild(makePanelItem(course||{}));});}
function setTriggerActive(btn,items){const walk=(arr)=>(arr||[]).some((item)=>{if(!item)return false;if(samePath(item.href,window.location.href))return true;return walk(item.children||[]);});btn.classList.toggle("mk-rt-active",walk(items));}
function clearHoverTimers(){try{if(state.hoverOpenTimer)window.clearTimeout(state.hoverOpenTimer);}catch(_){}
try{if(state.hoverCloseTimer)window.clearTimeout(state.hoverCloseTimer);}catch(_){}
state.hoverOpenTimer=0;state.hoverCloseTimer=0;}
function mkRtHexToRgb(hex){const h=String(hex||"").replace(/^#/,"");if(h.length!==6)return[30,64,175];return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function mkRtRgbToCss(rgb){return`rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])})`;}
function mkRtRgbToRgbaCss(rgb,alpha){const a=Math.max(0,Math.min(1,Number(alpha)));return`rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${Number.isFinite(a) ? a : 1})`;}
function mkRtMix(a,b,t){const x=Math.max(0,Math.min(1,Number(t)||0));return[a[0]+(b[0]-a[0])*x,a[1]+(b[1]-a[1])*x,a[2]+(b[2]-a[2])*x];}
function mkRtGradientColor(stops,t){const x=Math.max(0,Math.min(1,Number(t)||0));for(let i=0;i<stops.length-1;i+=1){const a=stops[i];const b=stops[i+1];if(x>=a[0]&&x<=b[0]){const local=(x-a[0])/Math.max(0.0001,b[0]-a[0]);return mkRtMix(mkRtHexToRgb(a[1]),mkRtHexToRgb(b[1]),local);}}
return mkRtHexToRgb(stops[stops.length-1][1]);}
function applyHeaderSkinPanelGradient(panel,triggerRect){if(!panel)return;const skin=String(document.documentElement.getAttribute("data-mk-header-skin")||"");const stopsBySkin={header_skin_aurora:[[0,"#172554"],[0.48,"#0f766e"],[1,"#6d28d9"]],header_skin_sunset:[[0,"#dc2626"],[0.50,"#be123c"],[1,"#f59e0b"]],header_skin_midnight:[[0,"#020617"],[0.58,"#111827"],[1,"#1e3a8a"]],};const stops=stopsBySkin[skin];if(!stops){try{panel.style.removeProperty("background");panel.style.removeProperty("border-color");}catch(_){}
return;}
const r=triggerRect||{left:0,width:0};const center=(Number(r.left||0)+Number(r.width||0)/2)/Math.max(1,window.innerWidth||document.documentElement.clientWidth||1);const c1=mkRtGradientColor(stops,center);const c0=mkRtGradientColor(stops,center-0.10);const c2=mkRtGradientColor(stops,center+0.16);const dark=mkRtMix(c1,[8,13,28],0.22);const useGlass=String(document.documentElement.getAttribute("data-mk-dropdown-skin")||"")==="dropdown_glass";const bg=useGlass?`linear-gradient(135deg, ${mkRtRgbToRgbaCss(c0, .50)} 0%, ${mkRtRgbToRgbaCss(c1, .44)} 48%, ${mkRtRgbToRgbaCss(c2, .46)} 100%)`:`linear-gradient(135deg, ${mkRtRgbToCss(c0)} 0%, ${mkRtRgbToCss(c1)} 48%, ${mkRtRgbToCss(c2)} 100%)`;try{panel.style.setProperty("background",bg,"important");panel.style.setProperty("border-color",`rgba(${Math.round(dark[0]+80)}, ${Math.round(dark[1]+80)}, ${Math.round(dark[2]+80)}, .34)`,"important");panel.style.setProperty("color","rgba(255,255,255,.90)","important");}catch(_){}}
function closeOpenPanel(options){const trigger=state.openTrigger;clearHoverTimers();if(state.openPanel){resetPanelInteractionState(state.openPanel);try{state.openPanel.classList.remove("mk-rt-open");}catch(_){}}
if(state.openTrigger){try{state.openTrigger.setAttribute("aria-expanded","false");}catch(_){}
try{if(isMobileMenuMode()&&state.openTrigger.blur)state.openTrigger.blur();}catch(_){}}
state.openPanel=null;state.openTrigger=null;state.pinned=false;try{if(window.__rfHideYearCoursePopoverV4)window.__rfHideYearCoursePopoverV4({force:true});}catch(_){}
if(options&&options.returnFocus&&trigger&&trigger.isConnected){try{trigger.focus({preventScroll:true});}catch(_){trigger.focus();}}}
function viewportBox(){try{const vv=window.visualViewport;if(vv){return{left:Math.round(vv.offsetLeft||0),top:Math.round(vv.offsetTop||0),right:Math.round((vv.offsetLeft||0)+(vv.width||window.innerWidth||0)),bottom:Math.round((vv.offsetTop||0)+(vv.height||window.innerHeight||0)),width:Math.round(vv.width||window.innerWidth||document.documentElement.clientWidth||0),height:Math.round(vv.height||window.innerHeight||document.documentElement.clientHeight||0),};}}catch(_){}
const w=Math.round(window.innerWidth||document.documentElement.clientWidth||0);const h=Math.round(window.innerHeight||document.documentElement.clientHeight||0);return{left:0,top:0,right:w,bottom:h,width:w,height:h};}
function clampNumber(value,min,max){const n=Math.round(Number(value)||0);if(max<min)return min;return Math.max(min,Math.min(max,n));}
function placePanel(panel,trigger){if(!panel||!trigger)return;panel.classList.add("mk-rt-open");panel.style.visibility="hidden";panel.style.left="0px";panel.style.top="0px";panel.style.width="max-content";const r=trigger.getBoundingClientRect();applyHeaderSkinPanelGradient(panel,r);const view=viewportBox();const gap=Math.max(8,Math.min(14,Math.round(view.width*0.018)||8));const availableW=Math.max(120,view.width-gap*2);const availableH=Math.max(120,view.height-gap*2);const minW=Math.ceil(Math.max(r.width||0,0));panel.style.minWidth=minW?`${minW}px`:"0px";panel.style.maxWidth=`${availableW}px`;panel.style.maxHeight=`${availableH}px`;panel.style.overflowX="hidden";let pw=Math.ceil(panel.getBoundingClientRect().width||panel.offsetWidth||panel.scrollWidth||120);if(pw>availableW){panel.style.width=`${availableW}px`;pw=availableW;}
let ph=Math.ceil(panel.getBoundingClientRect().height||panel.offsetHeight||panel.scrollHeight||80);if(ph>availableH){panel.style.maxHeight=`${availableH}px`;ph=availableH;}
let left=Math.round(r.left);let top=Math.round(r.bottom+6);const parentRect=panel.classList.contains("mk-rt-mobile-year-course-panel")&&panel.__mkRtParentRect?panel.__mkRtParentRect:null;if(parentRect&&view.width>760){left=Math.round(Number(parentRect.right||0)+6);top=Math.round(Number(parentRect.top||r.top));if(left+pw>view.right-gap)left=Math.round(Number(parentRect.left||r.left)-pw-6);}else{const belowTop=Math.round(r.bottom+6);const aboveTop=Math.round(r.top-ph-6);const spaceBelow=view.bottom-gap-belowTop;const spaceAbove=aboveTop-(view.top+gap);top=(ph>spaceBelow&&spaceAbove>spaceBelow)?aboveTop:belowTop;}
left=clampNumber(left,view.left+gap,view.right-gap-pw);top=clampNumber(top,view.top+gap,view.bottom-gap-ph);panel.style.left=`${left}px`;panel.style.top=`${top}px`;panel.style.visibility="visible";}
function openPanelNow(panel,trigger,pinned){if(!panel||!trigger)return;closeOpenPanel();state.openPanel=panel;state.openTrigger=trigger;state.pinned=!!pinned;trigger.setAttribute("aria-expanded","true");placePanel(panel,trigger);try{paintShopDiscountBadge();}catch(_){}}
function queueHoverOpen(panel,trigger){if(!canUseHoverDropdown())return;if(state.pinned)return;try{if(state.hoverCloseTimer)window.clearTimeout(state.hoverCloseTimer);}catch(_){}
state.hoverCloseTimer=0;if(state.openPanel===panel&&panel.classList.contains("mk-rt-open")){placePanel(panel,trigger);return;}
try{if(state.hoverOpenTimer)window.clearTimeout(state.hoverOpenTimer);}catch(_){}
state.hoverOpenTimer=window.setTimeout(()=>{state.hoverOpenTimer=0;openPanelNow(panel,trigger);},45);}
function queueHoverClose(){if(!canUseHoverDropdown())return;try{if(state.hoverOpenTimer)window.clearTimeout(state.hoverOpenTimer);}catch(_){}
state.hoverOpenTimer=0;if(state.pinned)return;try{if(state.hoverCloseTimer)window.clearTimeout(state.hoverCloseTimer);}catch(_){}
state.hoverCloseTimer=window.setTimeout(()=>{state.hoverCloseTimer=0;if(state.pinned||isInOpenMenu(document.activeElement))return;const flyout=document.getElementById("rf-year-course-popover-v4");if(flyout&&flyout.matches(":hover"))return;closeOpenPanel();},280);}
function isInOpenMenu(target){if(!target)return false;const flyout=document.getElementById("rf-year-course-popover-v4");return!!((state.openPanel&&state.openPanel.contains(target))||(state.openTrigger&&state.openTrigger.contains(target))||(flyout&&flyout.contains(target)));}
function visibleMenuItems(panel){return Array.from(panel.querySelectorAll('[role="menuitem"]')).filter((item)=>!item.disabled&&item.getClientRects().length&&window.getComputedStyle(item).visibility!=="hidden");}
function togglePanel(panel,trigger){if(!panel||!trigger)return;if(state.openPanel===panel&&panel.classList.contains("mk-rt-open")){if(state.pinned)closeOpenPanel();else{clearHoverTimers();state.pinned=true;}
return;}
openPanelNow(panel,trigger,true);}
function bindTrigger(trigger,panel,options){if(!trigger||!panel||trigger.dataset.mkRtBound==="1")return;trigger.dataset.mkRtBound="1";let lastMobileToggleAt=0;const stopMobileEvent=(e)=>{try{e.preventDefault();}catch(_){}
try{e.stopPropagation();}catch(_){}
try{e.stopImmediatePropagation();}catch(_){}};const toggleFromMobileTap=(e)=>{if(!isMobileMenuMode())return false;if(e&&e.pointerType&&e.pointerType==="mouse")return false;stopMobileEvent(e);const now=Date.now?Date.now():new Date().getTime();if(now-lastMobileToggleAt<360)return true;lastMobileToggleAt=now;togglePanel(panel,trigger);return true;};trigger.addEventListener("pointerdown",toggleFromMobileTap,{capture:true,passive:false});trigger.addEventListener("touchstart",toggleFromMobileTap,{capture:true,passive:false});trigger.addEventListener("click",(e)=>{const now=Date.now?Date.now():new Date().getTime();if(isMobileMenuMode()&&now-lastMobileToggleAt<700){stopMobileEvent(e);return;}
e.preventDefault();e.stopPropagation();togglePanel(panel,trigger);});trigger.addEventListener("mouseenter",()=>queueHoverOpen(panel,trigger));trigger.addEventListener("mouseleave",()=>queueHoverClose());trigger.addEventListener("blur",()=>{if(canUseHoverDropdown())queueHoverClose();});trigger.addEventListener("keydown",(e)=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();openPanelNow(panel,trigger,true);const items=visibleMenuItems(panel);const item=e.key==="ArrowUp"?items[items.length-1]:items[0];if(item)item.focus();}});}
function isHeaderSearchRelatedTarget(target){try{if(!target||!target.closest)return false;return!!target.closest('.md-header .md-search, .md-header label[for="__search"], .md-header [data-md-component="search"], label[for="__search"], input#__search, input.md-toggle[data-md-toggle="search"]');}catch(_){return false;}}
function isHeaderSearchOpen(){try{const active=document.activeElement;const toggle=document.querySelector('input.md-toggle[data-md-toggle="search"], input#__search, #__search');const root=document.querySelector('.md-header .md-search');const focusedInSearch=!!(active&&active.closest&&active.closest('.md-header .md-search'));const checked=!!(toggle&&toggle.checked);const q=root?root.querySelector('input[data-md-component="search-query"]'):null;const hasQuery=!!(q&&String(q.value||'').trim());const output=root?root.querySelector('.md-search__output'):null;let outputVisible=false;if(output){const cs=window.getComputedStyle?window.getComputedStyle(output):null;outputVisible=!!(output.offsetParent!==null&&(!cs||(cs.display!=='none'&&cs.visibility!=='hidden'&&cs.opacity!=='0')));}
return focusedInSearch||checked||(hasQuery&&outputVisible);}catch(_){return false;}}
function setHeaderSearchActive(active){try{document.documentElement.classList.toggle('mk-rt-search-active',!!active);if(document.body)document.body.classList.toggle('mk-rt-search-active',!!active);}catch(_){}
if(active)closeOpenPanel();}
function updateHeaderSearchStateSoon(delay){try{window.clearTimeout(state.searchStateTimer);}catch(_){}
state.searchStateTimer=window.setTimeout(()=>{state.searchStateTimer=0;setHeaderSearchActive(isHeaderSearchOpen());},Math.max(0,Number(delay)||0));}
function closeForHeaderSearchIfNeeded(event){const t=event&&event.target;const syntheticInput=event&&event.type==="input"&&event.isTrusted===false;if(isHeaderSearchRelatedTarget(t)&&(!syntheticInput||isHeaderSearchOpen())){setHeaderSearchActive(true);closeOpenPanel();}
updateHeaderSearchStateSoon(60);}
function bindGlobalCloseOnce(){if(state.closeBound)return;state.closeBound=true;document.addEventListener("pointerdown",(e)=>{const t=e&&e.target;if(!t)return;if(isInOpenMenu(t))return;closeOpenPanel();},true);document.addEventListener("keydown",(e)=>{if(e.key==="Escape"&&state.openPanel){e.preventDefault();closeOpenPanel({returnFocus:true});}
else closeForHeaderSearchIfNeeded(e);},true);document.addEventListener("focusin",closeForHeaderSearchIfNeeded,true);document.addEventListener("focusin",(e)=>{if(state.openPanel&&!isInOpenMenu(e.target))closeOpenPanel();});document.addEventListener("input",closeForHeaderSearchIfNeeded,true);document.addEventListener("pointerdown",closeForHeaderSearchIfNeeded,true);document.addEventListener("click",()=>updateHeaderSearchStateSoon(80),true);document.addEventListener("keyup",()=>updateHeaderSearchStateSoon(80),true);window.addEventListener("pageshow",()=>updateHeaderSearchStateSoon(80),{passive:true});window.addEventListener("resize",()=>{const mobileNow=isMobileMenuMode();if(state.mobileMenuMode!==null&&mobileNow!==state.mobileMenuMode){closeOpenPanel();refreshSoon(80);return;}
if(!state.openPanel||!state.openTrigger)return;window.clearTimeout(state.resizeTimer);state.resizeTimer=window.setTimeout(()=>placePanel(state.openPanel,state.openTrigger),80);});window.addEventListener("scroll",(e)=>{if(!state.openPanel||!state.openTrigger)return;if(isInOpenMenu(e.target))return;if(state.pinned){placePanel(state.openPanel,state.openTrigger);return;}
closeOpenPanel();},true);}
function buildShell(data){const shell=document.createElement("div");shell.id=IDS.shell;shell.setAttribute("data-build",BUILD);const left=el("div","mk-rt-left");const spacer=el("div","mk-rt-spacer");const right=el("div","mk-rt-right");const homeHref=data.home?data.home.href:new URL("index.html",siteRootUrl()).toString();left.appendChild(makeLink("Home",homeHref,"mk-rt-home"));if(data.year1&&data.year2){const yearItems=[{label:"Year 1",href:data.year1.href,children:collectYearCourseItems(data.year1)},{label:"Year 2",href:data.year2.href,children:collectYearCourseItems(data.year2)},];const yearPanel=ensurePanel(IDS.yearPanel);if(isMobileMenuMode())fillMobileYearPanel(yearPanel,yearItems);else fillPanel(yearPanel,yearItems.map((item)=>({label:item.label,href:item.href})));const yearBtn=makeTrigger("Year",IDS.yearPanel);setTriggerActive(yearBtn,yearItems);bindTrigger(yearBtn,yearPanel);left.appendChild(yearBtn);}else if(data.year1){left.appendChild(makeLink("Year 1",data.year1.href));}else if(data.year2){left.appendChild(makeLink("Year 2",data.year2.href));}
if(data.trending&&!window.__mkExamMode){const label="Rankings";const trendingItems=rankingsItems(data.trending.href);const trendingPanel=ensurePanel(IDS.trendingPanel);fillPanel(trendingPanel,trendingItems);if(isMobileMenuMode())trendingPanel.classList.add("mk-rt-mobile-trending-panel");else trendingPanel.classList.remove("mk-rt-mobile-trending-panel");const trendingBtn=makeTrigger(label,IDS.trendingPanel);if(samePath(data.trending.href,window.location.href))trendingBtn.classList.add("mk-rt-active");bindTrigger(trendingBtn,trendingPanel);right.appendChild(trendingBtn);}
if(data.random||data.find||data.custom){const randomItems=[];if(data.random)randomItems.push({label:"Random Concept",href:makeRandomModeHref(data.random.href,"unvisited"),guestAction:"random",randomDirect:true});if(data.random)randomItems.push({label:"Random Route",href:makeRandomRouteHref(data.random.href),guestAction:"guided_study",randomDirect:true});if(data.random&&!window.__mkExamMode)randomItems.push({label:"Random AI Quiz",href:makeRandomModeHref(data.random.href,"ai-untested"),guestAction:"random",randomDirect:true});if(data.find||data.custom)randomItems.push({label:"Concept Finder",href:new URL("find.html",siteRootUrl()).toString(),guestAction:"concept_finder"});else if(data.course)randomItems.push({label:"Course Random",href:data.course.href,guestAction:"random"});const randomPanel=ensurePanel(IDS.randomPanel);fillPanel(randomPanel,randomItems);const randomBtn=makeTrigger("Explore",IDS.randomPanel);setTriggerActive(randomBtn,randomItems);bindTrigger(randomBtn,randomPanel);right.appendChild(randomBtn);}
if(accountFeatureEnabled()){const activityItems=[{label:"Account",action:"local-activity",kind:"info"},{label:"Privacy",action:"local-activity",kind:"privacy"},{label:"Notifications",action:"local-activity",kind:"notifications"},{label:"Connections",action:"local-activity",kind:"connections"},{label:"Saved Pages",action:"local-activity",kind:"saved"},{label:"Activity",action:"local-activity",kind:"activity"},{label:"Store",action:"local-activity",kind:"shop"},];const activityPanel=ensurePanel(IDS.activityPanel);fillPanel(activityPanel,activityItems);const activityBtn=makeTrigger("My",IDS.activityPanel);activityBtn.dataset.mkLocalKind="my";{const lab=activityBtn.querySelector('.mk-rt-label')||activityBtn;lab.insertAdjacentHTML("beforeend",'<span class="mk-rt-badge mk-rt-account-badge" data-mk-rt-account-badge>1</span><span class="mk-rt-badge mk-rt-notification-badge mk-rt-notification-badge--trigger" data-mk-rt-notification-badge hidden>0</span><span class="mk-rt-badge mk-rt-shop-discount-badge mk-rt-shop-discount-badge--trigger" data-mk-shop-discount-badge hidden>1</span>');}
bindTrigger(activityBtn,activityPanel);right.appendChild(activityBtn);try{paintShopDiscountBadge();}catch(_){}}else{try{document.getElementById(IDS.activityPanel)?.remove();}catch(_){}}
shell.appendChild(left);shell.appendChild(spacer);shell.appendChild(right);return shell;}
function mount(){if(redirectLegacyConceptFinder())return true;ensureStyles();const tabs=document.querySelector(".md-tabs");const list=tabs?tabs.querySelector(".md-tabs__list"):null;const host=tabs?(tabs.querySelector(".md-grid")||tabs):null;if(!tabs||!host||!list)return false;const data=findLinks();if(!data.home&&!data.year1&&!data.year2&&!data.random&&!data.find&&!data.custom&&!data.trending)return false;closeOpenPanel();let existing=document.getElementById(IDS.shell);if(existing&&existing.parentNode!==host){try{existing.remove();}catch(_){}
existing=null;}
const shell=buildShell(data);if(existing){try{existing.replaceWith(shell);}catch(_){existing.remove();host.appendChild(shell);}}else{host.appendChild(shell);}
tabs.classList.add("mk-rt-active");host.classList.add("mk-rt-host");state.mounted=true;state.tabs=tabs;state.host=host;state.shell=shell;state.mobileMenuMode=isMobileMenuMode();try{shell.style.removeProperty('opacity');shell.style.removeProperty('visibility');shell.style.removeProperty('pointer-events');}catch(_){}
bindGlobalCloseOnce();updateHeaderSearchStateSoon(0);updateAccountPromptBadge();setNotificationBadge(state.notificationBadgeCount);setConnectionBadge(state.connectionBadgeCount);return true;}
function refreshSoon(delay){window.clearTimeout(state.refreshTimer);state.refreshTimer=window.setTimeout(()=>{state.refreshTimer=0;const y=window.scrollY||document.documentElement.scrollTop||0;mount();if(y>2&&(window.scrollY||0)<2){try{window.scrollTo(0,y);}catch(_){}}},Math.max(0,Number(delay)||0));}
function initialMountWithRetry(){let tries=0;const run=()=>{tries+=1;if(mount())return;if(tries<30)window.setTimeout(run,tries<6?80:180);};run();}
function setNotificationBadge(count){const n=Math.max(0,Math.min(99,Number(count)||0));state.notificationBadgeCount=n;const txt=n>=99?"99+":String(n);document.querySelectorAll('[data-mk-rt-notification-badge]').forEach((el)=>{if(!el)return;el.hidden=n<=0;el.textContent=txt;});paintShopDiscountBadge();}
function setConnectionBadge(count){const n=Math.max(0,Math.min(99,Number(count)||0));state.connectionBadgeCount=n;const txt=n>=99?"99+":String(n);document.querySelectorAll('[data-mk-rt-connection-badge]').forEach((el)=>{if(!el)return;el.hidden=n<=0;el.textContent=txt;});}
function shopDiscountsUnseen(){try{const today=new Date().toISOString().slice(0,10);return localStorage.getItem("mk_shop_discount_seen_day_v1")!==today;}catch(_){return false;}}
function paintShopDiscountBadge(){const unseen=shopDiscountsUnseen();const hasAccount=hasConnectedAccountForBadge();document.querySelectorAll('[data-mk-shop-discount-badge]').forEach((el)=>{if(!el)return;const isTrigger=el.classList.contains("mk-rt-shop-discount-badge--trigger");el.hidden=!unseen||(isTrigger&&(!hasAccount||state.notificationBadgeCount>0));});}
window.MkRandomTabs={refresh:()=>refreshSoon(0),close:closeOpenPanel,setNotificationBadge,setConnectionBadge,updateAccountPromptBadge,paintShopDiscountBadge,keepHoverOpen:clearHoverTimers,leaveHoverMenu:queueHoverClose,};window.addEventListener("mk-shop-discounts-seen",()=>{try{paintShopDiscountBadge();}catch(_){}});window.addEventListener("mk-guest-account-change",()=>{state.accountBadgeRaw=null;updateAccountPromptBadge();});window.addEventListener("mk-local-activity-change",(ev)=>{try{const t=ev&&ev.detail&&ev.detail.type||"";if(/profile|cloud-sync|account/i.test(String(t))){state.accountBadgeRaw=null;updateAccountPromptBadge();}}catch(_){}});window.addEventListener("storage",(ev)=>{if(!ev||ev.key==="mk_comment_profile_v1"){state.accountBadgeRaw=null;updateAccountPromptBadge();}});if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>initialMountWithRetry(),{once:true});}else{initialMountWithRetry();}
document.addEventListener("DOMContentSwitch",()=>refreshSoon(40));document.addEventListener("navigation:load",()=>refreshSoon(40));})();