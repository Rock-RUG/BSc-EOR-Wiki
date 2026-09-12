(function(){const BAR_ID="current-course-bar";const STYLE_ID="mk-current-course-bar-style-v10-seam-close";const toggleListenerBound=new WeakMap();let applyTimer=0;function getSiteRootUrl(){const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]');const attr=script?script.getAttribute("src"):(link?link.getAttribute("href"):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname;const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function relPathFromSiteRoot(absPathname){const siteRoot=new URL(getSiteRootUrl());const rootPath=siteRoot.pathname.endsWith("/")?siteRoot.pathname:siteRoot.pathname+"/";let p=String(absPathname||window.location.pathname);if(p.startsWith(rootPath))p=p.slice(rootPath.length);p=p.replace(/^\/+/,"").replace(/\/+$/,"");return p;}
function splitSegs(relPath){return(relPath||"").split("/").filter(Boolean);}
function inferYearCourse(){const rel=relPathFromSiteRoot(window.location.pathname);const segs=splitSegs(rel);if(segs.length===0)return{year:"",course:""};if(segs.length===1)return{year:segs[0],course:""};if(segs.length===2&&String(segs[1]).toLowerCase()==="index.html"){return{year:segs[0],course:""};}
return{year:segs[0],course:segs[1]};}
function cleanTitleText(s){return String(s||"").replace(/\s*¶\s*$/u,"").replace(/\s+/g," ").trim();}
function directNavLink(item){if(!item||!item.querySelector)return null;return item.querySelector(':scope > a.md-nav__link, :scope > label.md-nav__link, :scope > .md-nav__link');}
function chevronSvg(className){const cls=className?` ${className}`:"";return`<svg class="ccb-chevron${cls}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5"></path></svg>`;}
function ensureStyleInjected(){if(document.getElementById(STYLE_ID))return;const style=document.createElement("style");style.id=STYLE_ID;style.textContent=`
#current-course-bar{
  --ccb-line: transparent;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 20;
  flex: 0 0 auto;
  background: var(--md-default-bg-color);
  border-bottom: 0;
  box-shadow: none;
  padding: .35rem .5rem .18rem;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  will-change: transform;
  contain: paint;
  isolation: isolate;
}
@supports (color: color-mix(in srgb, black, white)){
#current-course-bar{
  --ccb-line: color-mix(in srgb, var(--md-default-fg-color) 14%, transparent);
}
}
html[data-md-color-scheme="slate"] #current-course-bar{
  --ccb-line: rgba(255,255,255,.10);
}
#current-course-bar .ccb-row{
  position: relative;
  z-index: 1;
  display:flex;
  align-items:flex-start;
  gap:.42rem;
  min-width:0;
}
#current-course-bar .ccb-titlelink{
  flex:1 1 auto;
  min-width:0;
  display:flex;
  align-items:flex-start;
  gap:.4rem;
  padding:.24rem .08rem;
  color:inherit;
  text-decoration:none;
  background:transparent;
  transition:
    color .16s ease,
    opacity .16s ease,
    transform .14s ease;
}
#current-course-bar .ccb-title{
  flex:1 1 auto;
  min-width:0;
  display:block;
  overflow:visible;
  text-overflow:clip;
  white-space:normal;
  overflow-wrap:anywhere;
  word-break:break-word;
  font-size:.96rem;
  font-weight:700;
  line-height:1.22;
  opacity:.96;
  text-decoration:none;
  text-underline-offset:.17em;
  text-decoration-thickness:1px;
}
#current-course-bar .ccb-toggle{
  appearance:none;
  flex:0 0 auto;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:1.15rem;
  height:1.15rem;
  min-width:1.15rem;
  min-height:1.15rem;
  margin:.16rem 0 0;
  padding:0;
  border:0;
  border-radius:0;
  background:transparent;
  color:inherit;
  cursor:pointer;
  box-shadow:none;
  transition:
    transform .14s ease,
    color .16s ease,
    opacity .16s ease;
  -webkit-tap-highlight-color:transparent;
}
#current-course-bar .ccb-toggle[hidden]{
  display:none !important;
}
#current-course-bar .ccb-icon{
  display:block;
  width:.95rem;
  height:.95rem;
  color:currentColor;
  transform:rotate(0deg);
  transform-origin:50% 50%;
  transition:
    transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
    color 120ms ease;
}
#current-course-bar .ccb-icon.is-open{
  transform:rotate(90deg);
}
#current-course-bar .ccb-titlelink:hover,
#current-course-bar .ccb-titlelink:focus-visible{
  color:var(--md-accent-fg-color);
  outline:none;
}
#current-course-bar .ccb-titlelink:hover .ccb-title,
#current-course-bar .ccb-titlelink:focus-visible .ccb-title{
  text-decoration:underline;
}
#current-course-bar .ccb-titlelink:active{
  transform:translateY(1px);
}
#current-course-bar .ccb-toggle:hover,
#current-course-bar .ccb-toggle:focus-visible{
  color:var(--md-accent-fg-color);
  outline:none;
}
#current-course-bar .ccb-toggle:active{
  transform:translateY(1px);
}
@media (max-width: 76.1875em){
  #current-course-bar{
    top:0;
    z-index:19;
    padding:.26rem .42rem .12rem;
  }
  #current-course-bar .ccb-row{
    gap:.34rem;
  }
  #current-course-bar .ccb-titlelink{
    padding:.22rem .08rem;
  }
  #current-course-bar .ccb-title{
    font-size:.86rem;
    font-weight:700;
    line-height:1.2;
  }
  #current-course-bar .ccb-toggle{
    width:1.08rem;
    height:1.08rem;
    min-width:1.08rem;
    min-height:1.08rem;
    margin:.15rem 0 0;
    padding:0;
    border:0;
    border-radius:0;
    background:transparent;
  }
  #current-course-bar .ccb-icon{
    width:.94rem;
    height:.94rem;
  }

  html.lp-drawer-open #current-course-bar,
  body.lp-drawer-open #current-course-bar{
    overflow:visible !important;
  }
  html.lp-drawer-open #current-course-bar::after,
  body.lp-drawer-open #current-course-bar::after{
    content:"";
    position:absolute;
    left:100%;
    top:0;
    width:var(--lp-drawer-cover-width, 0px);
    height:100%;
    background:rgba(0,0,0,.55);
    pointer-events:none;
    z-index:0;
  }
}
`;(document.head||document.documentElement).appendChild(style);}
function ensureBar(){const sidebar=document.querySelector(".md-sidebar--primary");if(!sidebar)return null;const scrollWrap=sidebar.querySelector(".md-sidebar__scrollwrap")||sidebar.querySelector(".md-sidebar__inner")||sidebar;let bar=scrollWrap.querySelector(`#${BAR_ID}`);if(!bar){bar=document.createElement("div");bar.id=BAR_ID;bar.innerHTML=`
        <div class="ccb-row">
          <a class="ccb-titlelink" href="#top" aria-label="Open current scope index">
            <span class="ccb-title"></span>
          </a>
          <button type="button" class="ccb-toggle" aria-label="Toggle current scope">
            ${chevronSvg("ccb-icon")}
          </button>
        </div>
      `;scrollWrap.prepend(bar);}
return bar;}
function normaliseHrefToRel(href){if(!href)return"";try{const u=new URL(href,document.baseURI);return relPathFromSiteRoot(u.pathname);}catch(_){return"";}}
function toAbsoluteSiteHref(rel){const clean=String(rel||"").replace(/^\/+/,"");if(!clean)return"";try{return new URL(clean,getSiteRootUrl()).toString();}catch(_){return clean;}}
function findYearNodeByPath(yearSeg){if(!yearSeg)return null;const root=getSiteRootUrl();const wantA=`${yearSeg}/`;const wantB=`${yearSeg}/index.html`;const links=Array.from(document.querySelectorAll(".md-sidebar--primary a.md-nav__link, .md-sidebar--primary label.md-nav__link"));for(const el of links){const href=el.getAttribute&&el.getAttribute("href");const rel=href?normaliseHrefToRel(new URL(href,root).toString()):"";if(rel===wantA||rel===wantB){return el.closest(".md-nav__item")||null;}}
return null;}
function findCourseNodeFromActive(activeLink,yearSeg,courseSeg){if(!activeLink||!yearSeg||!courseSeg)return null;const prefix=`${yearSeg}/${courseSeg}/`;const item=activeLink.closest(".md-nav__item");if(!item)return null;let cur=item;while(cur){if(cur.classList&&cur.classList.contains("md-nav__item--nested")){const anchors=Array.from(cur.querySelectorAll("a.md-nav__link[href]"));const ok=anchors.some((a)=>normaliseHrefToRel(a.getAttribute("href")).startsWith(prefix));if(ok)return cur;}
cur=cur.parentElement?cur.parentElement.closest(".md-nav__item"):null;}
cur=item;while(cur){if(cur.classList&&cur.classList.contains("md-nav__item--nested"))return cur;cur=cur.parentElement?cur.parentElement.closest(".md-nav__item"):null;}
return null;}
function findScopeHref(scopeNode,yearSeg,courseSeg){if(!scopeNode)return"";const directAnchor=scopeNode.querySelector(':scope > a.md-nav__link[href], :scope > .md-nav__link[href]');if(directAnchor)return directAnchor.href||directAnchor.getAttribute("href")||"";const want=[];if(yearSeg&&courseSeg){want.push(`${yearSeg}/${courseSeg}/`,`${yearSeg}/${courseSeg}/index.html`);}else if(yearSeg){want.push(`${yearSeg}/`,`${yearSeg}/index.html`);}
if(want.length){const links=Array.from(scopeNode.querySelectorAll('a.md-nav__link[href]'));for(const a of links){const rel=normaliseHrefToRel(a.getAttribute("href"));if(want.includes(rel))return a.href||a.getAttribute("href")||"";}}
if(yearSeg&&courseSeg)return toAbsoluteSiteHref(`${yearSeg}/${courseSeg}/`);if(yearSeg)return toAbsoluteSiteHref(`${yearSeg}/`);return"";}
function emitLayoutChanged(){try{window.dispatchEvent(new CustomEvent("mk:current-course-bar-layout"));}catch(_){}}
function isMobileViewport(){try{return!!(window.matchMedia&&window.matchMedia("(max-width: 76.1875em)").matches);}catch(_){return false;}}
function measuredBarHeight(bar){if(!(bar instanceof HTMLElement))return 0;let h=Math.ceil(bar.getBoundingClientRect().height||bar.offsetHeight||0);if(h>2)return h;const row=bar.querySelector(".ccb-row");if(row instanceof HTMLElement){const rowH=Math.ceil(row.getBoundingClientRect().height||row.offsetHeight||0);if(rowH>2){try{const cs=window.getComputedStyle(bar);const pt=parseFloat(cs.paddingTop||"0")||0;const pb=parseFloat(cs.paddingBottom||"0")||0;h=Math.ceil(rowH+pt+pb);if(h>2)return h;}catch(_){return rowH;}}}
return isMobileViewport()?44:0;}
function syncSiblingStickyOffsets(){const bar=document.getElementById(BAR_ID);if(!bar)return;const dock=document.getElementById("mk-sidebar-sortdock");const h=measuredBarHeight(bar);const scrollWrap=bar.closest(".md-sidebar__scrollwrap")||bar.closest(".md-sidebar__inner")||bar.parentElement;if(scrollWrap&&scrollWrap.style){scrollWrap.style.setProperty("--msb-current-bar-h",`${h}px`);}
if(dock){dock.style.top=isMobileViewport()?`${Math.max(44, h - 6)}px`:`${Math.max(0, h - 2)}px`;}}
function emitLayoutChangedSettled(){syncSiblingStickyOffsets();emitLayoutChanged();requestAnimationFrame(()=>{syncSiblingStickyOffsets();emitLayoutChanged();});window.setTimeout(()=>{syncSiblingStickyOffsets();emitLayoutChanged();},120);}
function apply(){ensureStyleInjected();const bar=ensureBar();if(!bar)return;const titleLink=bar.querySelector(".ccb-titlelink");const titleSpan=bar.querySelector(".ccb-title");const toggleBtn=bar.querySelector(".ccb-toggle");const iconSpan=bar.querySelector(".ccb-icon");const activeLink=document.querySelector(".md-sidebar--primary a.md-nav__link--active, .md-sidebar--primary a.md-nav__link[aria-current='page']")||document.querySelector(".md-sidebar--primary .md-nav__link--active");if(!activeLink){bar.style.display="none";emitLayoutChangedSettled();return;}
const{year,course}=inferYearCourse();let scopeNode=null;let showArrow=false;if(!course){scopeNode=findYearNodeByPath(year)||activeLink.closest(".md-nav__item");showArrow=false;}else{scopeNode=findCourseNodeFromActive(activeLink,year,course);showArrow=true;}
if(!scopeNode){bar.style.display="none";emitLayoutChangedSettled();return;}
const titleEl=directNavLink(scopeNode)||scopeNode.querySelector(".md-nav__link");const titleText=cleanTitleText(titleEl?titleEl.textContent:"");if(!titleText){bar.style.display="none";emitLayoutChangedSettled();return;}
const scopeHref=findScopeHref(scopeNode,year,course);titleSpan.textContent=titleText;if(titleLink){const href=scopeHref||"#top";titleLink.href=href;titleLink.title=course?`Open ${titleText} index`:`Open ${titleText}`;titleLink.setAttribute("aria-label",titleLink.title);}
bar.style.display="";bar.style.top="0px";const sidebarApi=course&&window.MkSidebarNavSort&&typeof window.MkSidebarNavSort.isCurrentCourseOpen==="function"&&typeof window.MkSidebarNavSort.toggleCurrentCourse==="function"?window.MkSidebarNavSort:null;const toggle=scopeNode.querySelector(":scope > input.md-nav__toggle")||scopeNode.querySelector("input.md-nav__toggle");if(!showArrow||!toggleBtn||!iconSpan||(!sidebarApi&&!toggle)){bar.dataset.hasToggle="0";if(toggleBtn){toggleBtn.hidden=true;toggleBtn.onclick=null;}
emitLayoutChangedSettled();return;}
bar.dataset.hasToggle="1";toggleBtn.hidden=false;const syncIcon=()=>{const open=sidebarApi?!!sidebarApi.isCurrentCourseOpen():!!(toggle&&toggle.checked);iconSpan.classList.toggle("is-open",open);toggleBtn.setAttribute("aria-label",`${open ? "Collapse" : "Expand"} ${titleText}`);toggleBtn.title=`${open ? "Collapse" : "Expand"} ${titleText}`;};syncIcon();if(!sidebarApi&&toggle&&!toggleListenerBound.has(toggle)){const handler=()=>syncIcon();toggle.addEventListener("change",handler,{passive:true});toggleListenerBound.set(toggle,handler);}
toggleBtn.onclick=(e)=>{e.preventDefault();e.stopPropagation();if(sidebarApi){sidebarApi.toggleCurrentCourse();}else if(toggle){toggle.click();}
requestAnimationFrame(syncIcon);};emitLayoutChangedSettled();}
function scheduleApply(){if(applyTimer)window.clearTimeout(applyTimer);applyTimer=window.setTimeout(()=>{applyTimer=0;apply();},30);}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",apply,{once:true});}else{apply();}
document.addEventListener("DOMContentSwitch",scheduleApply);window.addEventListener("pageshow",scheduleApply);window.addEventListener("mk:sidebar-sort-rendered",scheduleApply,{passive:true});window.addEventListener("mk:sidebar-current-course-toggle",scheduleApply,{passive:true});window.addEventListener("resize",scheduleApply,{passive:true});})();