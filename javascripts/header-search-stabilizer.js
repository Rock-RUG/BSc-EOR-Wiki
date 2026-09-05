(function(){"use strict";const BUILD="mk-header-search-stabilizer-v3";if(window.__mkHeaderSearchStabilizerBuild===BUILD){try{window.MkHeaderSearchStabilizer&&window.MkHeaderSearchStabilizer.refresh&&window.MkHeaderSearchStabilizer.refresh();}catch(_){}
return;}
window.__mkHeaderSearchStabilizerBuild=BUILD;const STYLE_ID="mk-header-search-stabilizer-style-v1";const INPUT_SEL='input[data-md-component="search-query"]';const HISTORY_SEL=".mk-search-history";const state={raf:0,lastY:0,lastFocusAt:0,mo:null,};function isMobileLike(){try{return!!(window.matchMedia&&(window.matchMedia("(pointer: coarse)").matches||window.matchMedia("(hover: none)").matches||window.matchMedia("(max-width: 900px)").matches));}catch(_){return false;}}
function headerSearchRoot(){return document.querySelector(".md-header .md-search")||null;}
function headerInput(){const root=headerSearchRoot();return root&&root.querySelector?root.querySelector(INPUT_SEL):null;}
function searchToggle(){return(document.querySelector('input.md-toggle[data-md-toggle="search"]')||document.querySelector("input#__search")||document.querySelector("#__search")||null);}
function isSearchOpen(root,input){try{const toggle=searchToggle();const ae=document.activeElement;return!!((toggle&&toggle.checked)||(root&&root.classList&&root.classList.contains("md-search--active"))||(document.documentElement&&document.documentElement.classList.contains("md-search--active"))||(document.body&&document.body.classList.contains("md-search--active"))||(input&&ae===input)||(root&&ae&&root.contains&&root.contains(ae)));}catch(_){return false;}}
function hasCheapSearchSignal(){try{const toggle=searchToggle();if(toggle&&toggle.checked)return true;const root=headerSearchRoot();const input=root&&root.querySelector?root.querySelector(INPUT_SEL):null;const ae=document.activeElement;return!!((root&&root.classList&&root.classList.contains("md-search--active"))||(root&&root.classList&&root.classList.contains("mk-hsf-open"))||(document.documentElement&&document.documentElement.classList&&document.documentElement.classList.contains("md-search--active"))||(document.body&&document.body.classList&&document.body.classList.contains("md-search--active"))||(input&&ae===input)||(root&&ae&&root.contains&&root.contains(ae)));}catch(_){return false;}}
function isVisible(el){if(!el||!el.isConnected)return false;try{const cs=window.getComputedStyle(el);if(cs.display==="none"||cs.visibility==="hidden"||Number(cs.opacity||1)===0)return false;const r=el.getBoundingClientRect();return!!(r&&r.width>2&&r.height>2);}catch(_){return false;}}
function ownerOutputForHistory(history){if(!history||!history.closest)return null;return history.closest(".md-search__output")||null;}
function ensureStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
/* =========================================================
   Header search stabilizer, loaded from JS as a safety net.
   Put header-search-surface-fix.css in extra_css for first-paint coverage.
   ========================================================= */
.md-header .md-search:not(.md-search--active) .mk-search-history,
.md-header .md-search:not(.md-search--active) .md-search__output.mk-hsf-history-open{
  display:none !important;
  opacity:0 !important;
  pointer-events:none !important;
}

.md-header .md-search:not(.md-search--active) .md-search__form,
.md-header .md-search:not(.md-search--active) .md-search__inner{
  border-bottom:0 !important;
  box-shadow:none !important;
}

.md-header .md-search__form::before,
.md-header .md-search__form::after,
.md-header .md-search__output.mk-hsf-history-open::before,
.md-header .md-search__output.mk-hsf-history-open::after{
  display:none !important;
  content:none !important;
  background:none !important;
  border:0 !important;
  box-shadow:none !important;
  -webkit-mask:none !important;
  mask:none !important;
}

.md-header .md-search__output.mk-hsf-history-open{
  background:transparent !important;
  border:0 !important;
  box-shadow:none !important;
  filter:none !important;
  padding:0 !important;
  margin:0 !important;
  overflow:visible !important;
  -webkit-mask-image:none !important;
  mask-image:none !important;
}

.md-header .md-search__output.mk-hsf-history-open > .md-search-result,
.md-header .md-search__output.mk-hsf-history-open > .md-search-result__list,
.md-header .md-search__output.mk-hsf-history-open .md-search-result__meta{
  display:none !important;
  visibility:hidden !important;
  pointer-events:none !important;
}

.md-header .md-search__output.mk-hsf-history-open .mk-search-history{
  opacity:1 !important;
  visibility:visible !important;
  pointer-events:auto !important;
}

@media (hover: hover) and (pointer: fine){
  .md-header .md-search:not(.md-search--active) .md-search__output{
    display:none !important;
    border:0 !important;
    box-shadow:none !important;
    background:transparent !important;
  }
}

@media (max-width: 900px), (pointer: coarse){
  .md-header,
  .md-header__inner,
  .md-header .md-search,
  .md-header .md-search__inner,
  .md-header .md-search__form{
    overflow:visible !important;
  }

  .md-header .md-search,
  .md-header .md-search__inner,
  .md-header .md-search__form{
    position:relative !important;
  }

  .md-header .md-search__form{
    margin-bottom:0 !important;
    border-bottom:0 !important;
    box-shadow:none !important;
  }

  .md-header .md-search__output.mk-hsf-history-open{
    position:absolute !important;
    left:0 !important;
    right:0 !important;
    top:calc(100% - 1px) !important;
    bottom:auto !important;
    z-index:10034 !important;
    transform:none !important;
  }

  .md-header .md-search__output.mk-hsf-history-open .mk-search-history{
    position:relative !important;
    left:auto !important;
    right:auto !important;
    top:auto !important;
    bottom:auto !important;
    width:100% !important;
    max-width:100% !important;
    margin:0 !important;
    border-radius:0 0 18px 18px !important;
    overflow:hidden !important;
    -webkit-mask-image:-webkit-radial-gradient(white, black) !important;
    transform:translateZ(0) !important;
    will-change:auto !important;
  }

  .md-header .md-search__output:not(.mk-hsf-history-open) .mk-search-history{
    display:none !important;
  }

  html[data-md-color-scheme="default"] .md-header .md-search__output.mk-hsf-history-open .mk-search-history,
  body[data-md-color-scheme="default"] .md-header .md-search__output.mk-hsf-history-open .mk-search-history{
    background:rgba(255,255,255,.992) !important;
    color:#1f2937 !important;
  }

  html[data-md-color-scheme="default"] .md-header .md-search__output.mk-hsf-history-open .mk-search-history__footer,
  body[data-md-color-scheme="default"] .md-header .md-search__output.mk-hsf-history-open .mk-search-history__footer{
    background:#eef0f4 !important;
    border-top:1px solid rgba(0,0,0,.10) !important;
  }

  html[data-md-color-scheme="slate"] .md-header .md-search__output.mk-hsf-history-open .mk-search-history,
  body[data-md-color-scheme="slate"] .md-header .md-search__output.mk-hsf-history-open .mk-search-history{
    background:rgba(20,22,28,.992) !important;
    color:rgba(255,255,255,.92) !important;
  }

  html[data-md-color-scheme="slate"] .md-header .md-search__output.mk-hsf-history-open .mk-search-history__footer,
  body[data-md-color-scheme="slate"] .md-header .md-search__output.mk-hsf-history-open .mk-search-history__footer{
    background:rgba(15,17,22,.992) !important;
    border-top:1px solid rgba(255,255,255,.08) !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function refresh(){ensureStyles();const root=headerSearchRoot();const input=headerInput();const open=isSearchOpen(root,input);const q=input?String(input.value||"").trim():"";if(root&&root.classList){root.classList.toggle("mk-hsf-open",open);root.classList.toggle("mk-hsf-empty",open&&!q);root.classList.toggle("mk-hsf-has-query",open&&!!q);}
if(document.documentElement&&document.documentElement.classList){document.documentElement.classList.toggle("mk-hsf-open",open);document.documentElement.classList.toggle("mk-hsf-empty",open&&!q);document.documentElement.classList.toggle("mk-hsf-has-query",open&&!!q);}
const hostSet=new Set();const openSet=new Set();if(root&&input&&open){const histories=Array.from(root.querySelectorAll(HISTORY_SEL));histories.forEach((history)=>{const out=ownerOutputForHistory(history);if(!out)return;hostSet.add(out);if(!q&&isVisible(history))openSet.add(out);});}
const outputs=new Set();try{document.querySelectorAll(".md-header .md-search__output").forEach((out)=>outputs.add(out));}catch(_){}
hostSet.forEach((out)=>outputs.add(out));openSet.forEach((out)=>outputs.add(out));outputs.forEach((out)=>{if(!out||!out.classList)return;out.classList.toggle("mk-hsf-history-host",hostSet.has(out));out.classList.toggle("mk-hsf-history-open",openSet.has(out));});}
function scheduleRefresh(){if(state.raf)return;state.raf=requestAnimationFrame(()=>{state.raf=0;refresh();});}
function rememberScrollPosition(){if(!isMobileLike())return;state.lastY=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0;state.lastFocusAt=Date.now();}
function restoreScrollSoon(){if(!isMobileLike())return;try{if(window.__mkUiGuardOwnsSearchScroll)return;}catch(_){}
const y=Number(state.lastY||0);const started=Date.now();[0,16,40,80,140,230,360,520].forEach((ms)=>{window.setTimeout(()=>{try{const input=headerInput();const root=headerSearchRoot();if(!input||!root)return;if(!isSearchOpen(root,input))return;if(Date.now()-started>760)return;const nowY=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0;if(Math.abs(nowY-y)<=2)return;window.scrollTo(0,y);}catch(_){}},ms);});}
function bindOnce(){ensureStyles();document.addEventListener("pointerdown",(ev)=>{const t=ev&&ev.target;if(!t||!t.closest)return;if(t.closest('.md-header .md-search, label[for="__search"], [for="__search"], input#__search, input.md-toggle[data-md-toggle="search"]')){rememberScrollPosition();scheduleRefresh();}},true);document.addEventListener("touchstart",(ev)=>{const t=ev&&ev.target;if(!t||!t.closest)return;if(t.closest('.md-header .md-search, label[for="__search"], [for="__search"], input#__search, input.md-toggle[data-md-toggle="search"]')){rememberScrollPosition();scheduleRefresh();}},{capture:true,passive:true});document.addEventListener("focusin",(ev)=>{const t=ev&&ev.target;if(t&&t.matches&&t.matches(INPUT_SEL)&&t.closest&&t.closest(".md-header .md-search")){rememberScrollPosition();restoreScrollSoon();scheduleRefresh();}},true);["input","search","change","keyup","click"].forEach((type)=>{document.addEventListener(type,(ev)=>{const t=ev&&ev.target;if(!t||!t.closest)return;if(t.closest(".md-header .md-search"))scheduleRefresh();},true);});document.addEventListener("DOMContentSwitch",()=>{window.setTimeout(refresh,0);window.setTimeout(refresh,60);window.setTimeout(refresh,240);});window.addEventListener("pageshow",()=>{window.setTimeout(refresh,0);window.setTimeout(refresh,120);});window.addEventListener("resize",scheduleRefresh,{passive:true});try{state.mo=new MutationObserver(()=>{if(hasCheapSearchSignal())scheduleRefresh();});[document.documentElement,document.body].filter(Boolean).forEach((node)=>{state.mo.observe(node,{attributes:true,attributeFilter:["class"]});});const searchRoot=headerSearchRoot();if(searchRoot){state.mo.observe(searchRoot,{childList:true,subtree:true,attributes:true,attributeFilter:["class","style","aria-expanded"]});}
const toggle=searchToggle();if(toggle)state.mo.observe(toggle,{attributes:true,attributeFilter:["class","checked","aria-expanded"]});}catch(_){}
refresh();window.setTimeout(refresh,80);window.setTimeout(refresh,360);}
window.MkHeaderSearchStabilizer={refresh:scheduleRefresh};if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",bindOnce,{once:true});}else{bindOnce();}})();