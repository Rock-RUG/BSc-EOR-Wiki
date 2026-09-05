function __mkFetchSearchIndex(url,init){const shared=window.__mkFetchJsonShared;if(typeof shared==="function")return shared(url,init);return fetch(url,init).then(function(r){return r&&r.ok?r.json():null;});}
function getSiteRootUrl(){const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]');const attr=script?script.getAttribute("src"):(link?link.getAttribute("href"):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname;const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function safePath(loc){const s0=String(loc||"");return(s0.split("#")[0]||s0).replace(/^\/+/,"");}
function asStringList(x){if(!x)return[];if(Array.isArray(x))return x.map(String).filter(Boolean);if(typeof x==="string")return[x];return[];}
function getTagsFromDoc(d){const out=[];out.push(...asStringList(d&&d.tags));out.push(...asStringList(d&&d.tag));out.push(...asStringList(d&&d.meta&&d.meta.tags));out.push(...asStringList(d&&d.meta&&d.meta.tag));out.push(...asStringList(d&&d.meta&&d.meta["tags"]));return out.map(s=>String(s).trim()).filter(Boolean);}
function unitNounFromType(type){return String(type||"lecture").toLowerCase()==="week"?"Week":"Lecture";}
function unitInfoFromTags(tagSetOrArr){const tags=Array.isArray(tagSetOrArr)?tagSetOrArr:[];const withCourse=/^([a-z0-9]+)[-_]?(lecture|week)[-_]?0*(\d+)$/i;const bare=/^(lecture|week)[-_]?0*(\d+)$/i;for(const raw of tags){const t=String(raw||"").trim().toLowerCase();let m=t.match(withCourse);if(m){const unitType=String(m[2]||"lecture").toLowerCase();const unitNum=parseInt(m[3],10)||0;const unitNoun=unitNounFromType(unitType);return{courseCode:m[1],unitType,unitNum,lectureNum:unitNum,unitLabel:`${unitNoun} ${unitNum}`};}
m=t.match(bare);if(m){const unitType=String(m[1]||"lecture").toLowerCase();const unitNum=parseInt(m[2],10)||0;const unitNoun=unitNounFromType(unitType);return{courseCode:"",unitType,unitNum,lectureNum:unitNum,unitLabel:`${unitNoun} ${unitNum}`};}}
return null;}
function lectureNumFromTags(tagSetOrArr){const info=unitInfoFromTags(tagSetOrArr);return info?info.lectureNum:0;}
let __lectureMapPromise=null;function loadLectureMapOnce(){if(__lectureMapPromise)return __lectureMapPromise;__lectureMapPromise=(async()=>{const root=getSiteRootUrl();const url=new URL("search/search_index.json",root).toString();const j=await __mkFetchSearchIndex(url,{cache:"no-cache"}).catch(()=>null);const docs=j&&Array.isArray(j.docs)?j.docs:[];const map=new Map();for(const d of docs){const loc=safePath(d&&d.location);if(!loc)continue;const key=loc;if(map.has(key))continue;const tags=getTagsFromDoc(d);const info=unitInfoFromTags(tags);if(info&&info.unitNum)map.set(key,info);}
return map;})();return __lectureMapPromise;}
function cleanTitle(title){const t=String(title||"").replace(/¶/g,"").replace(/\s*¶+\s*$/g,"").replace(/\s+/g," ").trim();if(!t)return"";return t.replace(/\s+-\s+BSc EOR Wiki\s*$/i,"").replace(/\s*¶+\s*$/g,"").trim();}
function courseLabelFromPath(path){const p=String(path||"").replace(/^\/+/,"");const segs=p.split("/").filter(Boolean);if(segs.length<2)return"";let courseSeg=segs[1];courseSeg=courseSeg.replace(/^\d+[a-z]-/i,"");courseSeg=courseSeg.replace(/-/g," ").trim();const parts=courseSeg.split(/\s+/).filter(Boolean);if(parts.length>=3&&/^Math$/i.test(parts[0])&&/^[IVX]+$/i.test(parts[1])){return`${parts[0]} ${parts[1]}: ${parts.slice(2).join(" ")}`;}
return courseSeg;}
function titleLooksLikePathForTrending(t){const s=String(t||"").trim();if(!s)return false;if(/^https?:\/\//i.test(s))return true;if(/\.html(?:[#?].*)?$/i.test(s)&&(s.includes("/")||s.includes("\\")))return true;if(/^[A-Za-z0-9._~%-]+(?:\/[A-Za-z0-9._~%-]+)+\.html$/i.test(s))return true;return false;}
function titleLookupKey(path){let p=String(path||"").trim();try{const u=new URL(p,document.baseURI);const root=new URL(getSiteRootUrl(),document.baseURI);if(u.origin===root.origin){let rp=root.pathname||"/";if(!rp.endsWith("/"))rp+="/";let up=u.pathname||"";if(up.toLowerCase().startsWith(rp.toLowerCase()))up=up.slice(rp.length);else up=up.replace(/^\/+/,"");p=up;}}catch(_){}
try{p=decodeURIComponent(p);}catch(_){}
return p.split("#")[0].split("?")[0].replace(/\\/g,"/").replace(/^\/+/,"").replace(/\/index\.html$/i,"/").replace(/\/+$/g,"").toLowerCase();}
function humanTitleFromPath(path){const base=String(path||"").split("#")[0].split("?")[0].split("/").pop()||String(path||"");return base.replace(/\.html$/i,"").replace(/[-_]+/g," ").replace(/\b\w/g,(m)=>m.toUpperCase()).trim()||String(path||"");}
function displayTitle(item,titleMap){const key=titleLookupKey(item&&item.path);const fromIndex=titleMap&&titleMap.get?(titleMap.get(key)||(key.endsWith(".html")?titleMap.get(key.slice(0,-5)):titleMap.get(key+".html"))||""):"";if(fromIndex&&!titleLooksLikePathForTrending(fromIndex))return fromIndex;const raw=cleanTitle(item&&item.title);if(raw&&!titleLooksLikePathForTrending(raw))return raw;return humanTitleFromPath(item&&item.path);}
function escapeTrendingHtml(s){return String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function normaliseMathExpr(expr){let s=String(expr||"").trim();if(!s)return"";s=s.replace(/\\mathbb\s*\{\s*([RNZQC])\s*\}\s*\^\s*\{?\s*([A-Za-z0-9]+)\s*\}?/g,"\\mathbb{$1}^{$2}").replace(/\\mathbb\s*([RNZQC])\s*\^\s*\{?\s*([A-Za-z0-9]+)\s*\}?/g,"\\mathbb{$1}^{$2}").replace(/\\mathbb\s*\{\s*([RNZQC])\s*\}/g,"\\mathbb{$1}").replace(/\\mathbb\s*([RNZQC])/g,"\\mathbb{$1}").replace(/\s+/g," ").trim();return s;}
function normaliseKnownMathTitle(title){let s=String(title||"").trim();s=s.replace(/^p{2,}-series$/i,"p-series").replace(/^p{2,}-test$/i,"p-test").replace(/\bWeierstrass\s+M{2,}-test\b/i,"Weierstrass M-test").replace(/\bR+n?mathbb\s+R\^nR*n?\b/gi,"$\\mathbb{R}^{n}$");if(/^p-series$/i.test(s))return"$p$-series";if(/^p-test$/i.test(s))return"$p$-test";if(/^Weierstrass\s+M-test$/i.test(s))return"Weierstrass $M$-test";s=s.replace(/\$\$\s*([^$\n]+?)\s*\$\$/g,(_,expr)=>`$${normaliseMathExpr(expr)}$`);if(!/(?:\\\([^)]*\\\)|\$[^$\n]+\$)/.test(s)){s=s.replace(/\\mathbb\s*(?:\{\s*([RNZQC])\s*\}|([RNZQC]))\s*(?:\^\s*(?:\{\s*([A-Za-z0-9]+)\s*\}|([A-Za-z0-9]+)))?/g,(_,b1,b2,p1,p2)=>{const base=b1||b2;const pow=p1||p2||"";return pow?`$\\mathbb{${base}}^{${pow}}$`:`$\\mathbb{${base}}$`;});s=s.replace(/\bR\s*\^\s*([A-Za-z0-9]+)\b/g,(_,pow)=>{return`$\\mathbb{R}^{${pow}}$`;});}
return s;}
function titleToHtml(title){const src=normaliseKnownMathTitle(title);const re=/\$([^$\n]+?)\$|\\\((.*?)\\\)/g;let out="";let last=0;let m;while((m=re.exec(src))){out+=escapeTrendingHtml(src.slice(last,m.index));const expr=normaliseMathExpr(m[1]!=null?m[1]:m[2]);out+=`<span class="mk-title-math">\\(${escapeTrendingHtml(expr)}\\)</span>`;last=re.lastIndex;}
out+=escapeTrendingHtml(src.slice(last));return out;}
function displayCourseLecture(item,lectureMap){const course=courseLabelFromPath(item.path);const p=String(item.path||"").replace(/^\/+/,"");const raw=lectureMap&&lectureMap.get(p)?lectureMap.get(p):null;const unitLabel=raw&&typeof raw==="object"?(raw.unitLabel||`${unitNounFromType(raw.unitType)} ${raw.unitNum || raw.lectureNum || ""}`.trim()):(raw?`Lecture ${raw}`:"");if(!course)return unitLabel||"";return unitLabel?`${course} · ${unitLabel}`:course;}
(function(){const API_BASE="https://hot.eor-wiki.workers.dev";const USER_RANKING_CACHE_TTL_MS=10*60*1000;const USER_RANKING_MEMORY_TTL_MS=60*1000;const latestRankingRequests=new Map();const ENABLE_H1_HOT_BADGE=false;const IS_MOBILE_UI=(()=>{try{const mm=window.matchMedia;const byWidth=!!(mm&&(mm('(max-width: 900px)').matches||mm('(max-width: 768px)').matches));const byPointer=!!(mm&&(mm('(pointer: coarse)').matches||mm('(hover: none)').matches));const byTouch=('ontouchstart'in window)||(navigator&&navigator.maxTouchPoints>0);return byWidth||byPointer||byTouch;}catch(_){return false;}})();function ensureStylesOnce(){const STYLE_ID="trending-style-v25-ranking-disclosure";if(document.getElementById(STYLE_ID))return;try{const old24=document.getElementById("trending-style-v24-avatar-frame-safe-area");if(old24&&old24.parentNode)old24.parentNode.removeChild(old24);}catch(_){}
try{const old23=document.getElementById("trending-style-v23-board-refresh");if(old23&&old23.parentNode)old23.parentNode.removeChild(old23);}catch(_){}
try{const old22=document.getElementById("trending-style-v22-mobile-title-ellipsis");if(old22&&old22.parentNode)old22.parentNode.removeChild(old22);}catch(_){}
["trending-style-v9-solid-flame","trending-style-v10-outline-hot-h1","trending-style-v11-map-frame-sync","trending-style-v12-isolated-hot-hover","trending-style-v13-hot-mobile-menu","trending-style-v15-unified","trending-style-v14-hot-no-today-h1-right","trending-style-v15-unified-metric-switch","trending-style-v16-rankings-compact-switch","trending-style-v17-active-users-profile-cards","trending-style-v18-active-users-inline-frames","trending-style-v19-active-users-total-xp-align","trending-style-v21-ranking-labels"].forEach((id)=>{try{const old=document.getElementById(id);if(old&&old.parentNode)old.parentNode.removeChild(old);}catch(_){}});const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
/* Per-board freshness line + refresh button */
.trending-board-meta{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  margin-top:.5rem; padding-top:.5rem;
  border-top:1px solid var(--md-default-fg-color--lightest, rgba(0,0,0,.08));
  font-size:.82em; color:var(--md-default-fg-color--light, #6b7280);
}
.trending-board-time{ flex:1 1 auto; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.trending-board-refresh{
  flex:0 0 auto; display:inline-flex; align-items:center; gap:.35em;
  padding:.28rem .6rem; border-radius:999px; cursor:pointer;
  border:1px solid var(--md-default-fg-color--lighter, rgba(0,0,0,.16));
  background:var(--md-default-bg-color, #fff); color:inherit;
  font:inherit; font-size:.95em; line-height:1; transition:background .15s ease, border-color .15s ease;
}
.trending-board-refresh:hover{ border-color:var(--md-accent-fg-color, #2563eb); color:var(--md-accent-fg-color, #2563eb); }
.trending-board-refresh-icon{ display:inline-block; }
.trending-board-refresh.is-busy{ opacity:.6; pointer-events:none; }
.trending-board-refresh.is-busy .trending-board-refresh-icon{ animation:trending-board-spin .8s linear infinite; }
@keyframes trending-board-spin{ to{ transform:rotate(360deg); } }
.trending-user-ranking-note{
  margin:-.15rem 0 .7rem; padding:.48rem .62rem; border-radius:10px;
  background:color-mix(in srgb,var(--md-accent-fg-color,#2563eb) 7%,transparent);
  color:var(--md-default-fg-color--light,#6b7280); font-size:.76rem; line-height:1.4;
}
@media (max-width: 900px), (pointer: coarse){
  .trending-board-refresh-text{ display:none; }
  .trending-board-refresh{ padding:.34rem .5rem; }
  .trending-user-ranking-note{ margin:-.05rem 0 .62rem; font-size:.72rem; }
}

@media (max-width: 900px), (pointer: coarse){
  .trending-metahead{ display:none !important; }

  /* tabs: 4 buttons in one row */
  .trending-tabs{ display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
  .trending-tab{ flex: 0 0 auto; width:auto; min-width:max-content; padding: .46rem .82rem; font-size: .96em; white-space:nowrap; }

  /* column head (Concept / views) */
  .trending-colhead{
    display:grid;
    grid-template-columns: 22px minmax(0, 1fr) max-content;
    column-gap: 10px;
    padding: .25rem 0 .55rem;
    margin-top: .25rem;
    opacity: .72;
    font-weight: 750;
    letter-spacing: .2px;
    min-width:0;
  }
  .trending-colhead > *{ min-width:0; }
  .trending-colhead-right{ justify-self:end; white-space:nowrap; }

  /* list: remove default left gutter; tighten rank column */
  .trending-list{ list-style:none !important; padding:0 !important; margin:0 !important; padding-inline-start:0 !important; min-width:0 !important; }
  .trending-item{
    display:grid;
    grid-template-columns: 22px minmax(0, 1fr) max-content;
    grid-template-areas:
      "rank title meta"
      ".    course meta";
    column-gap: 10px;
    row-gap: 2px;
    align-items:start;
    padding: .58rem 0;
    min-width:0;
    max-width:100%;
    overflow:hidden;
  }
  .trending-rank{ grid-area: rank; text-align:left; opacity:.8; min-width:0; }
  .trending-link{
    grid-area:title;
    display:block;
    min-width:0;
    max-width:100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .trending-course{
    grid-area:course;
    display:block;
    min-width:0;
    max-width:100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    text-align:left !important;
    justify-self:stretch;
    opacity:.72;
  }
  .trending-meta{ grid-area: meta; text-align:right; justify-self:end; opacity:.76; min-width:max-content; white-space:nowrap; }
}

.trending-link mjx-container,
.trending-link .MathJax{
  display:inline-block;
  vertical-align:baseline;
  border-bottom: max(1px, .06em) solid currentColor;
  padding-bottom: .02em;
}

.trending-link .mk-title-math{
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 500;
}

/* ===== Hot concept badge near H1 ===== */
/* Same frame model as learning-path's H1 map button. */
article.md-content__inner h1.lp-h1-row > a.mk-trending-h1-hot,
.md-typeset a.mk-trending-h1-hot,
.mk-trending-h1-hot{
  appearance:none;
  box-sizing:border-box;
  border:1px solid var(--mk-trending-hot-border, var(--md-default-fg-color--lightest)) !important;
  border-bottom:1px solid var(--mk-trending-hot-border, var(--md-default-fg-color--lightest)) !important;
  background:var(--mk-trending-hot-bg, rgba(255,255,255,.04)) !important;
  color:var(--md-default-fg-color) !important;
  width:40px !important;
  height:40px !important;
  min-width:40px !important;
  min-height:40px !important;
  max-width:40px !important;
  max-height:40px !important;
  border-radius:12px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  padding:0 !important;
  margin:0 !important;
  cursor:pointer;
  opacity:var(--mk-trending-hot-opacity, .9);
  user-select:none;
  line-height:0 !important;
  box-shadow:var(--mk-trending-hot-shadow, none) !important;
  transform:none !important;
  text-decoration:none !important;
  background-image:none !important;
  outline-offset:3px;
  flex:0 0 auto !important;
  vertical-align:middle;
  -webkit-tap-highlight-color:transparent;
}
.md-typeset a.mk-trending-h1-hot::before,
.md-typeset a.mk-trending-h1-hot::after,
.mk-trending-h1-hot::before,
.mk-trending-h1-hot::after{
  display:none !important;
  content:none !important;
  border:0 !important;
  box-shadow:none !important;
  background:none !important;
}
.md-typeset a.mk-trending-h1-hot:hover,
.md-typeset a.mk-trending-h1-hot:focus,
.md-typeset a.mk-trending-h1-hot:visited,
.mk-trending-h1-hot:hover,
.mk-trending-h1-hot:focus,
.mk-trending-h1-hot:visited{
  color:var(--md-default-fg-color) !important;
  text-decoration:none !important;
  background-image:none !important;
}
.mk-trending-h1-hot:hover{
  border-color:var(--mk-trending-hot-hover-border, var(--md-accent-fg-color)) !important;
  background:var(--mk-trending-hot-hover-bg, rgba(99,102,241,.10)) !important;
  opacity:var(--mk-trending-hot-hover-opacity, 1);
  transform:none !important;
  box-shadow:var(--mk-trending-hot-hover-shadow, none) !important;
}
.mk-trending-h1-hot:focus-visible{
  outline:2px solid rgba(255,255,255,.28);
  outline-offset:3px;
}
.mk-trending-h1-hot svg{
  width:24px !important;
  height:24px !important;
  display:block !important;
  color:inherit !important;
  stroke:currentColor !important;
  fill:none !important;
  filter:none !important;
  margin:0 !important;
  transform:none !important;
  overflow:visible;
  flex:0 0 auto;
}
.mk-trending-h1-hot svg *,
.mk-trending-h1-hot svg path,
.mk-trending-h1-hot svg line,
.mk-trending-h1-hot svg polyline,
.mk-trending-h1-hot svg circle,
.mk-trending-hot-popover .mk-trending-hot-title svg.mk-trending-hot-svg,
.mk-trending-hot-popover .mk-trending-hot-title svg.mk-trending-hot-svg *{
  stroke:currentColor !important;
  fill:none !important;
  filter:none !important;
}
.mk-trending-h1-hot svg.mk-trending-hot-svg,
.mk-trending-hot-popover .mk-trending-hot-title svg.mk-trending-hot-svg{
  stroke:currentColor !important;
  fill:none !important;
}
.mk-trending-h1-hot .mk-trending-sr{
  position:absolute;
  width:1px;
  height:1px;
  padding:0;
  margin:-1px;
  overflow:hidden;
  clip:rect(0,0,0,0);
  white-space:nowrap;
  border:0;
}
html[data-md-color-scheme="default"] article.md-content__inner h1.lp-h1-row > a.mk-trending-h1-hot,
body[data-md-color-scheme="default"] article.md-content__inner h1.lp-h1-row > a.mk-trending-h1-hot,
html[data-md-color-scheme="default"] .md-typeset a.mk-trending-h1-hot,
body[data-md-color-scheme="default"] .md-typeset a.mk-trending-h1-hot,
html[data-md-color-scheme="default"] .mk-trending-h1-hot,
body[data-md-color-scheme="default"] .mk-trending-h1-hot{
  --mk-trending-hot-border: rgba(70, 78, 96, .42);
  --mk-trending-hot-shadow: inset 0 0 0 1px rgba(0,0,0,.03);
}
html[data-md-color-scheme="slate"] .mk-trending-h1-hot,
body[data-md-color-scheme="slate"] .mk-trending-h1-hot{
  color:#fff !important;
  --mk-trending-hot-border: rgba(255,255,255,.16);
  --mk-trending-hot-bg: rgba(255,255,255,.04);
}
html[data-md-color-scheme="slate"] .mk-trending-h1-hot:hover,
body[data-md-color-scheme="slate"] .mk-trending-h1-hot:hover{
  color:#fff !important;
  --mk-trending-hot-hover-border: var(--md-accent-fg-color);
  --mk-trending-hot-hover-bg: rgba(99,102,241,.10);
  --mk-trending-hot-hover-shadow: none;
}
html[data-md-color-scheme="slate"] .mk-trending-h1-hot svg,
html[data-md-color-scheme="slate"] .mk-trending-h1-hot svg *,
body[data-md-color-scheme="slate"] .mk-trending-h1-hot svg,
body[data-md-color-scheme="slate"] .mk-trending-h1-hot svg *{
  color:#fff !important;
  stroke:currentColor !important;
  fill:none !important;
}
@media (max-width: 768px), (hover: none) and (pointer: coarse){
  article.md-content__inner h1.lp-h1-row > a.mk-trending-h1-hot,
  .md-typeset a.mk-trending-h1-hot,
  .mk-trending-h1-hot{
    display:flex !important;
  }
  .mk-trending-hot-popover:not(.is-mobile-menu){
    display:none !important;
  }
}

.mk-trending-hot-popover{
  position:fixed;
  z-index:2147482600;
  width:max-content;
  max-width:min(360px, calc(100vw - 24px));
  padding:10px 12px 11px;
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 14%, transparent);
  border-radius:14px;
  background: color-mix(in srgb, var(--md-default-bg-color) 96%, var(--md-primary-fg-color) 4%);
  color:var(--md-default-fg-color);
  box-shadow:0 16px 40px rgba(0,0,0,.16);
  opacity:0;
  transform:translateY(4px) scale(.985);
  pointer-events:none;
  transition:opacity .12s ease, transform .12s ease;
  font-family:var(--md-text-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif);
  font-size:.70rem;
  font-weight:400;
  letter-spacing:0;
  line-height:1.28;
  overflow:hidden;
}
.mk-trending-hot-popover.is-visible{
  opacity:1;
  transform:translateY(0) scale(1);
}
.mk-trending-hot-popover .mk-trending-hot-title{
  display:flex;
  align-items:center;
  gap:7px;
  font-weight:650;
  margin-bottom:7px;
  white-space:nowrap;
}
.mk-trending-hot-popover .mk-trending-hot-title svg{
  width:15px;
  height:15px;
  color:currentColor;
  fill:currentColor;
  stroke:none;
  opacity:.86;
  flex:0 0 auto;
}
.mk-trending-hot-popover .mk-trending-hot-row{
  display:grid;
  grid-template-columns:1fr auto;
  column-gap:18px;
  align-items:baseline;
  min-width:230px;
  padding:4px 0;
  border-top:1px solid color-mix(in srgb, var(--md-default-fg-color) 8%, transparent);
}
.mk-trending-hot-popover .mk-trending-hot-row:first-of-type{
  border-top:0;
}
.mk-trending-hot-popover .mk-trending-hot-label{
  font-weight:600;
  min-width:0;
}
.mk-trending-hot-popover .mk-trending-hot-meta{
  opacity:.74;
  font-weight:400;
  white-space:nowrap;
  text-align:right;
}
.mk-trending-hot-popover .mk-trending-hot-hint{
  margin-top:7px;
  padding-top:7px;
  border-top:1px solid color-mix(in srgb, var(--md-default-fg-color) 8%, transparent);
  opacity:.62;
  font-weight:400;
  font-size:.68rem;
}

.mk-trending-hot-popover.is-mobile-menu{
  pointer-events:auto;
  width:min(340px, calc(100vw - 24px));
  max-width:calc(100vw - 24px);
  font-size:.72rem;
}
.mk-trending-hot-popover.is-mobile-menu .mk-trending-hot-hint{
  display:none;
}
.mk-trending-hot-popover .mk-trending-hot-open{
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top:8px;
  padding:8px 10px;
  border-radius:10px;
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 12%, transparent);
  background:color-mix(in srgb, var(--md-default-fg-color) 6%, transparent);
  color:var(--md-default-fg-color) !important;
  text-decoration:none !important;
  background-image:none !important;
  font-weight:650;
  line-height:1.15;
}
.mk-trending-hot-popover .mk-trending-hot-open:hover,
.mk-trending-hot-popover .mk-trending-hot-open:focus{
  background:rgba(99,102,241,.10);
  border-color:var(--md-accent-fg-color);
  color:var(--md-default-fg-color) !important;
  text-decoration:none !important;
  background-image:none !important;
}

    

/* ===== Unified Trending page: metric switch + one table at a time ===== */
.trending-unified{
  width:100%;
}
.trending-metric-switch{
  display:flex;
  flex-direction:column;
  gap:.7rem;
  align-items:center;
  justify-content:center;
  margin:0 0 1rem;
}
.trending-metric-group{
  width:100%;
  min-width:0;
  overflow-x:auto;
  scrollbar-width:thin;
}
.trending-metric-row{
  display:flex;
  flex-wrap:nowrap;
  align-items:center;
  justify-content:center;
  gap:.7rem;
  width:max-content;
  min-width:100%;
  padding:.1rem .12rem .3rem;
  box-sizing:border-box;
}
.trending-metric-btn{
  appearance:none;
  flex:0 0 auto;
  width:auto;
  max-width:100%;
  min-width:max-content;
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 13%, transparent);
  background:color-mix(in srgb, var(--md-default-bg-color) 92%, var(--md-primary-fg-color) 8%);
  color:var(--md-default-fg-color);
  border-radius:999px;
  padding:.46rem 1.28rem;
  font:inherit;
  font-weight:750;
  line-height:1.12;
  white-space:nowrap;
  cursor:pointer;
  box-shadow:none;
  -webkit-tap-highlight-color:transparent;
}
.trending-metric-btn:hover,
.trending-metric-btn:focus-visible{
  border-color:var(--md-accent-fg-color);
  color:var(--md-default-fg-color);
  outline:0;
}
.trending-metric-btn.is-active{
  border-color:var(--md-accent-fg-color);
  background:color-mix(in srgb, var(--md-accent-fg-color) 14%, var(--md-default-bg-color) 86%);
  color:var(--md-default-fg-color);
}
.trending-unified .trending-grid{
  display:block;
}
.trending-unified .trending-block[hidden]{
  display:none !important;
}
.trending-unified .trending-block-title{
  display:none !important;
}
.trending-unified .trending-block-header{
  margin-top:.1rem;
}
.trending-unified .trending-tabs{
  margin-top:.15rem;
}



/* ===== Active users ranking: account-style profile rows ===== */
.trending-block.trending-user-block{
  --trending-user-rank-col:42px;
  --trending-user-xp-col:7.25rem;
  --trending-user-col-gap:14px;
}
.trending-block.trending-user-block .trending-list{
  list-style:none !important;
  padding:0 !important;
  margin:.55rem 0 0 !important;
  padding-inline-start:0 !important;
  width:100%;
  max-width:none;
  box-sizing:border-box;
}
.trending-user-item{
  list-style:none !important;
  display:grid !important;
  grid-template-columns:var(--trending-user-rank-col) minmax(0, 1fr) var(--trending-user-xp-col);
  grid-template-areas:none !important;
  align-items:center;
  column-gap:var(--trending-user-col-gap);
  width:100%;
  max-width:none;
  box-sizing:border-box;
  margin:.48rem 0;
  padding:.42rem 0;
  border:0;
  border-radius:0;
  background:transparent;
  box-shadow:none;
  overflow:visible;
}
.trending-user-item + .trending-user-item{
  border-top:0;
}

.trending-user-item[data-ranking-effect="ranking_row_gold"]{
  --trending-ranking-bg-strong:rgba(250,204,21,.16);
  --trending-ranking-bg-soft:rgba(254,240,138,.075);
  --trending-ranking-border:rgba(250,204,21,.30);
  --trending-ranking-line-1:#fef3c7;
  --trending-ranking-line-2:#f6c453;
  --trending-ranking-line-3:#fff7d6;
}
.trending-user-item[data-ranking-effect="ranking_row_pastel_red"]{
  --trending-ranking-bg-strong:rgba(252,165,165,.18);
  --trending-ranking-bg-soft:rgba(254,202,202,.085);
  --trending-ranking-border:rgba(248,113,113,.28);
  --trending-ranking-line-1:#ffe4e6;
  --trending-ranking-line-2:#fca5a5;
  --trending-ranking-line-3:#fff1f2;
}
.trending-user-item[data-ranking-effect="ranking_row_pastel_blue"]{
  --trending-ranking-bg-strong:rgba(147,197,253,.18);
  --trending-ranking-bg-soft:rgba(191,219,254,.085);
  --trending-ranking-border:rgba(96,165,250,.27);
  --trending-ranking-line-1:#dbeafe;
  --trending-ranking-line-2:#93c5fd;
  --trending-ranking-line-3:#eff6ff;
}
.trending-user-item[data-ranking-effect="ranking_row_pastel_purple"]{
  --trending-ranking-bg-strong:rgba(196,181,253,.18);
  --trending-ranking-bg-soft:rgba(221,214,254,.085);
  --trending-ranking-border:rgba(167,139,250,.27);
  --trending-ranking-line-1:#ede9fe;
  --trending-ranking-line-2:#c4b5fd;
  --trending-ranking-line-3:#f5f3ff;
}
.trending-user-item[data-ranking-effect="ranking_row_pastel_green"]{
  --trending-ranking-bg-strong:rgba(134,239,172,.18);
  --trending-ranking-bg-soft:rgba(187,247,208,.085);
  --trending-ranking-border:rgba(74,222,128,.25);
  --trending-ranking-line-1:#dcfce7;
  --trending-ranking-line-2:#86efac;
  --trending-ranking-line-3:#f0fdf4;
}
.trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]{
  --trending-ranking-bg-strong:rgba(253,186,116,.17);
  --trending-ranking-bg-soft:rgba(254,215,170,.085);
  --trending-ranking-border:rgba(251,146,60,.25);
  --trending-ranking-line-1:#ffedd5;
  --trending-ranking-line-2:#fdba74;
  --trending-ranking-line-3:#fff7ed;
}
.trending-user-item[data-ranking-effect="ranking_row_gold"],
.trending-user-item[data-ranking-effect="ranking_row_pastel_red"],
.trending-user-item[data-ranking-effect="ranking_row_pastel_blue"],
.trending-user-item[data-ranking-effect="ranking_row_pastel_purple"],
.trending-user-item[data-ranking-effect="ranking_row_pastel_green"],
.trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]{
  position:relative;
  overflow:visible;
  border-radius:16px;
  background:linear-gradient(90deg,var(--trending-ranking-bg-strong),var(--trending-ranking-bg-soft) 44%,transparent 84%);
  box-shadow:inset 0 0 0 1px var(--trending-ranking-border),0 10px 24px rgba(15,23,42,.075);
}
.trending-user-item[data-ranking-effect="ranking_row_gold"]::before,
.trending-user-item[data-ranking-effect="ranking_row_pastel_red"]::before,
.trending-user-item[data-ranking-effect="ranking_row_pastel_blue"]::before,
.trending-user-item[data-ranking-effect="ranking_row_pastel_purple"]::before,
.trending-user-item[data-ranking-effect="ranking_row_pastel_green"]::before,
.trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]::before{
  content:"";
  position:absolute;
  left:0;
  top:13%;
  bottom:13%;
  width:5px;
  border-radius:999px;
  background:linear-gradient(var(--trending-ranking-line-1),var(--trending-ranking-line-2),var(--trending-ranking-line-3));
  pointer-events:none;
}
.trending-user-item[data-ranking-effect="ranking_row_gold"]::after,
.trending-user-item[data-ranking-effect="ranking_row_pastel_red"]::after,
.trending-user-item[data-ranking-effect="ranking_row_pastel_blue"]::after,
.trending-user-item[data-ranking-effect="ranking_row_pastel_purple"]::after,
.trending-user-item[data-ranking-effect="ranking_row_pastel_green"]::after,
.trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]::after{
  content:none;
  display:none;
}
.trending-user-item .trending-rank{
  width:32px;
  text-align:center;
  color:color-mix(in srgb, var(--md-default-fg-color) 70%, transparent);
  font-weight:750;
  font-variant-numeric:tabular-nums;
  transform:translate(4px, 2px);
}
.trending-block.trending-user-block .trending-block-header{
  display:grid;
  grid-template-columns:minmax(0, 1fr) var(--trending-user-xp-col);
  align-items:end;
  column-gap:var(--trending-user-col-gap);
  width:100%;
  max-width:none;
  box-sizing:border-box;
}
.trending-block.trending-user-block .trending-tabs{
  min-width:0;
}
.trending-block.trending-user-block .trending-metahead{
  justify-self:end;
  text-align:right;
  width:var(--trending-user-xp-col);
  min-width:0;
}
.trending-user-profile{
  min-width:0;
  min-height:72px;
  display:grid;
  grid-template-columns:88px minmax(0, 1fr);
  align-items:center;
  column-gap:14px;
}
.trending-user-avatar,
.trending-user-avatar .trending-user-avatar-core{
  width:54px;
  height:54px;
  border-radius:999px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  box-sizing:border-box;
}
.trending-user-avatar{
  position:relative;
  flex:0 0 auto;
  justify-self:center;
  align-self:center;
  overflow:visible;
  isolation:isolate;
  background:transparent;
  color:var(--md-default-fg-color);
  font-weight:850;
  font-size:1rem;
  line-height:1;
}
.trending-user-avatar .trending-user-avatar-core{
  position:relative;
  z-index:1;
  overflow:hidden;
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 14%, transparent);
  background:color-mix(in srgb, var(--md-primary-fg-color) 14%, var(--md-default-bg-color));
}
.trending-user-avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
  border-radius:inherit;
}
.trending-user-avatar .mk-avatar-frame-svg{
  position:absolute;
  z-index:2;
  left:50%;
  top:50%;
  width:152% !important;
  height:152% !important;
  max-width:none !important;
  max-height:none !important;
  transform:translate(-50%, -50%);
  pointer-events:none;
  overflow:visible;
  filter:drop-shadow(0 1px 1px rgba(0,0,0,.20));
}
.trending-user-avatar.mk-avatar-frame-level-1 .mk-avatar-frame-svg{ width:134% !important; height:134% !important; opacity:.92; filter:none; }
.trending-user-avatar.mk-avatar-frame-level-2 .mk-avatar-frame-svg{ width:142% !important; height:142% !important; }
.trending-user-avatar.mk-avatar-frame-level-3 .mk-avatar-frame-svg{ width:148% !important; height:148% !important; }
.trending-user-avatar.mk-avatar-frame-level-4 .mk-avatar-frame-svg{ width:154% !important; height:154% !important; }
.trending-user-avatar.mk-avatar-frame-level-5 .mk-avatar-frame-svg{ width:162% !important; height:162% !important; }
.trending-user-avatar.mk-avatar-frame-level-6 .mk-avatar-frame-svg{ width:166% !important; height:166% !important; }
.trending-user-avatar.mk-avatar-frame-level-7 .mk-avatar-frame-svg{ width:170% !important; height:170% !important; filter:drop-shadow(0 0 4px rgba(168,85,247,.38)); }
.trending-user-avatar.mk-avatar-frame-level-8 .mk-avatar-frame-svg{ width:174% !important; height:174% !important; filter:drop-shadow(0 0 4px rgba(244,63,94,.38)); }
.trending-user-avatar.mk-avatar-frame-level-9 .mk-avatar-frame-svg{ width:180% !important; height:180% !important; filter:drop-shadow(0 0 5px rgba(14,165,233,.32)); }
.trending-user-avatar.mk-avatar-frame-level-10 .mk-avatar-frame-svg{ width:188% !important; height:188% !important; filter:drop-shadow(0 0 5px rgba(250,204,21,.42)); }
.trending-user-main{
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:4px;
}
.trending-user-name-row{
  min-width:0;
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
}
.trending-user-name,
.trending-user-name:visited{
  color:var(--md-default-fg-color) !important;
  font-weight:850;
  font-size:1.08rem;
  text-decoration:none !important;
  background-image:none !important;
  line-height:1.18;
  white-space:nowrap;
}
.trending-user-name:hover,
.trending-user-name:focus{
  color:var(--md-accent-fg-color) !important;
  text-decoration:none !important;
  background-image:none !important;
}
.trending-user-level{
  position:relative;
  overflow:hidden;
  isolation:isolate;
  display:inline-flex;
  align-items:center;
  gap:5px;
  border:1px solid color-mix(in srgb, var(--md-accent-fg-color) 48%, transparent);
  background:color-mix(in srgb, var(--md-accent-fg-color) 10%, transparent);
  color:var(--md-default-fg-color);
  border-radius:999px;
  padding:.22rem .58rem;
  font-size:.72rem;
  font-weight:850;
  line-height:1;
  white-space:nowrap;
  box-sizing:border-box;
  min-width:3.65rem;
  justify-content:center;
}
.trending-user-level::after{
  content:"";
  position:absolute;
  right:-4px;
  top:50%;
  width:4px;
  height:42%;
  transform:translateY(-50%);
  border:1px solid color-mix(in srgb, var(--md-accent-fg-color) 48%, transparent);
  border-left:0;
  border-radius:0 999px 999px 0;
  background:color-mix(in srgb, var(--md-accent-fg-color) 8%, transparent);
  pointer-events:none;
}
.trending-user-level-fill{
  position:absolute;
  inset:0 auto 0 0;
  width:0%;
  max-width:100%;
  min-width:0;
  border-radius:inherit;
  background:linear-gradient(90deg, color-mix(in srgb, var(--md-accent-fg-color) 26%, transparent), color-mix(in srgb, var(--md-accent-fg-color) 14%, transparent));
  z-index:0;
  pointer-events:none;
}
.trending-user-level strong,
.trending-user-level .trending-user-level-xp{
  position:relative;
  z-index:1;
}
.trending-user-level-xp{
  display:none;
}
.trending-user-total-xp{
  color:color-mix(in srgb, var(--md-default-fg-color) 70%, transparent);
  font-size:.72rem;
  font-weight:600;
  white-space:nowrap;
  line-height:1;
}
.trending-user-intro{
  min-width:0;
  color:color-mix(in srgb, var(--md-default-fg-color) 72%, transparent);
  font-size:.84rem;
  line-height:1.35;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.trending-user-intro.is-empty{
  opacity:.52;
  font-style:italic;
}
.trending-user-period-xp{
  justify-self:end;
  align-self:center;
  text-align:right;
  width:var(--trending-user-xp-col);
  min-width:0;
  font-size:.78rem;
  font-weight:600;
  font-variant-numeric:tabular-nums;
  color:var(--md-default-fg-color);
  white-space:nowrap;
}
.trending-quiz-correct-score{
  line-height:1.18;
}
.trending-block[data-metric="spenders"] .trending-user-period-xp,
.trending-block[data-metric="mastery_explorers"] .trending-user-period-xp{
  white-space:normal;
  overflow-wrap:anywhere;
  line-height:1.25;
}
.trending-user-name[aria-busy="true"]{ cursor:progress; opacity:.65; }
.trending-profile-error{ flex-basis:100%; font-size:.65rem; }
.trending-quiz-wrong{
  display:block;
  margin-top:.18rem;
  color:color-mix(in srgb, var(--md-default-fg-color) 62%, transparent);
  font-size:.72rem;
  font-weight:500;
}

@media (max-width: 900px), (pointer: coarse){
  .trending-metric-switch{
    gap:.44rem;
    margin-bottom:.85rem;
  }
  .trending-metric-row{ gap:.44rem; }
  .trending-metric-btn{
    width:auto;
    min-width:max-content;
    border-radius:999px;
    padding:.34rem .46rem;
    font-size:.72rem;
    white-space:nowrap;
    text-align:center;
  }
  .trending-unified .trending-tabs{
    display:grid;
    grid-template-columns:repeat(2, minmax(0, 1fr));
    gap:.42rem;
  }
  .trending-unified .trending-tab{
    width:100%;
    max-width:100%;
    min-width:0;
    padding:.38rem .44rem;
    font-size:.70rem;
    white-space:nowrap;
    line-height:1.12;
    text-align:center;
    overflow:hidden;
    text-overflow:ellipsis;
  }
}



@media (max-width: 900px), (pointer: coarse){
  .trending-block.trending-user-block{
    --trending-user-rank-col:22px;
    --trending-user-xp-col:4.9rem;
    --trending-user-col-gap:8px;
  }
  .trending-user-item{
    grid-template-columns:var(--trending-user-rank-col) minmax(0, 1fr) var(--trending-user-xp-col) !important;
    grid-template-areas:none !important;
    column-gap:var(--trending-user-col-gap);
    margin:.42rem 0;
    padding:.58rem .5rem .58rem .45rem !important;
    border-radius:0;
    background:transparent;
    box-shadow:none;
  }
  .trending-user-item .trending-rank{
    width:20px;
    font-size:.78rem;
  }
  .trending-user-profile{
    min-height:62px;
    grid-template-columns:68px minmax(0, 1fr);
    column-gap:9px;
  }
  .trending-user-avatar,
  .trending-user-avatar .trending-user-avatar-core{
    width:40px;
    height:40px;
    font-size:.78rem;
  }
  .trending-user-name{
    font-size:.90rem;
  }
  .trending-user-level{
    padding:.16rem .44rem;
    font-size:.62rem;
  }
  .trending-user-level-xp{
    display:none;
  }
  .trending-user-total-xp{
    flex-basis:100%;
    font-size:.62rem;
    line-height:1.15;
  }
  .trending-user-intro{
    font-size:.70rem;
    max-width:100%;
  }
  .trending-user-period-xp{
    width:var(--trending-user-xp-col);
    min-width:0;
    font-size:.74rem;
  }
}

    `.trim();document.head.appendChild(st);}
function periodMetricLabel(period,metric){const m=String(metric||"views");const p=String(period||"7d");if(m==="spenders"){return p==="today"?"Daily spent":p==="7d"?"Weekly spent":p==="30d"?"Monthly spent":"Total spent";}
if(m==="mastery_explorers"){return p==="today"?"Mastered · today":p==="7d"?"Mastered · this week":p==="30d"?"Mastered · this month":"Mastered concepts";}
if(m==="popular"){if(p==="today")return"Daily score";if(p==="7d")return"Weekly score";if(p==="30d")return"Monthly score";return"Total score";}
if(m==="lively"){if(p==="today")return"Daily liveliness";if(p==="7d")return"Weekly liveliness";if(p==="30d")return"Monthly liveliness";return"Total liveliness";}
if(m==="saved"){if(p==="today")return"Daily saves";if(p==="7d")return"Weekly saves";if(p==="30d")return"Monthly saves";return"Total saves";}
if(m==="tested"){if(p==="today")return"Daily tests";if(p==="7d")return"Weekly tests";if(p==="30d")return"Monthly tests";return"Total tests";}
if(m==="comments"){if(p==="today")return"Daily comments";if(p==="7d")return"Weekly comments";if(p==="30d")return"Monthly comments";return"Total comments";}
if(m==="users"){if(p==="today")return"Daily XP";if(p==="7d")return"Weekly XP";if(p==="30d")return"Monthly XP";return"Total XP";}
if(m==="quiz_correct"){if(p==="today")return"Daily correct";if(p==="7d")return"Weekly correct";if(p==="30d")return"Monthly correct";return"Total correct";}
if(p==="today")return"Daily views";if(p==="7d")return"Weekly views";if(p==="30d")return"Monthly views";return"Total views";}
function metricValue(item,metric){if(!item)return 0;if(metric==="spenders")return`${formatTrendingNumber(item.spent != null ? item.spent : item.score)} EOR Bits`;if(metric==="mastery_explorers")return`${formatTrendingInteger(item.masteredCount != null ? item.masteredCount : item.score)} mastered`;if(metric==="popular"||metric==="lively"){const v=item.score!=null?item.score:item.count;return Number.isInteger(Number(v))?String(Number(v)):String(Number(v||0).toFixed(1)).replace(/\.0$/,"");}
if(metric==="users"){return formatTrendingXp(userPeriodXp(item));}
if(metric==="quiz_correct"){return formatTrendingInteger(userQuizCorrectCount(item));}
return String(item.count||0);}
function firstDefinedValue(obj,keys){const source=obj&&typeof obj==="object"?obj:{};const profile=source.profile&&typeof source.profile==="object"?source.profile:{};for(const key of keys||[]){if(source[key]!=null&&source[key]!=="")return source[key];if(profile[key]!=null&&profile[key]!=="")return profile[key];}
return"";}
function formatTrendingNumber(value){const n=Number(value||0);if(!Number.isFinite(n))return"0";return(Math.round(n*10)/10).toFixed(1).replace(/\.0$/,"");}
function formatTrendingInteger(value){const n=Math.max(0,Math.round(Number(value||0)));return Number.isFinite(n)?String(n):"0";}
function formatTrendingXp(value){return`${formatTrendingNumber(value)} XP`;}
function isTrendingUserMetric(metric){return metric==="users"||metric==="quiz_correct"||isMilestoneMetric(metric);}
function isMilestoneMetric(metric){return metric==="spenders"||metric==="mastery_explorers";}
function userQuizCorrectCount(item){const v=firstDefinedValue(item,["correctCount","correct","score","count","periodScore"]);const n=Number(v||0);return Number.isFinite(n)?Math.max(0,Math.round(n)):0;}
function userQuizWrongCount(item){const v=firstDefinedValue(item,["selectedWrongCount","selectedWrong","answeredWrongCount","wrongAnswerCount","wrongCount","wrong","incorrectCount","incorrect"]);const n=Number(v||0);return Number.isFinite(n)?Math.max(0,Math.round(n)):0;}
function formatQuizCorrectMetric(item){return`${formatTrendingInteger(userQuizCorrectCount(item))} correct`;}
function formatQuizWrongMetric(item){return`(${formatTrendingInteger(userQuizWrongCount(item))} wrong)`;}
const TRENDING_ACCOUNT_XP_CACHE_PREFIX="mk_account_xp_complete_cache_v6:";const TRENDING_ACCOUNT_XP_CACHE_LATEST_KEY="mk_account_xp_complete_cache_latest_v6";const TRENDING_PROFILE_KEY="mk_comment_profile_v1";function cleanTrendingProfileName(value){return String(value||"").replace(/[\u0000-\u001f<>]/g," ").replace(/\s+/g," ").trim();}
function readTrendingLocalProfile(){try{const obj=JSON.parse(localStorage.getItem(TRENDING_PROFILE_KEY)||"{}");return obj&&typeof obj==="object"?obj:{};}catch(_){return{};}}
function parseTrendingXpCache(raw){try{if(!raw)return null;const parsed=JSON.parse(raw);const score=parsed&&parsed.score?parsed.score:parsed;if(!score||typeof score!=="object")return null;if(!Array.isArray(score.breakdown)||!Array.isArray(score.dailySummary))return null;const total=Number(score.totalScore!=null?score.totalScore:score.totalXp!=null?score.totalXp:score.score);if(!Number.isFinite(total))return null;return Object.assign({},score,{totalScore:total,cachedAt:Number((parsed&&parsed.cachedAt)||score.cachedAt||score.lastSyncedAt||0)||0});}catch(_){return null;}}
function trendingSnapshotBelongsToProfile(score,profile){if(!score||!profile)return false;const accountKey=String(profile.accountKey||"").trim().toLowerCase();const profileName=cleanTrendingProfileName(profile.name||"").toLowerCase();const scoreKey=String(score.accountKey||score.account_key||"").trim().toLowerCase();const scoreName=cleanTrendingProfileName(score.name||score.title||score.username||score.displayName||"").toLowerCase();if(accountKey&&scoreKey&&accountKey===scoreKey)return true;if(profileName&&scoreName&&profileName===scoreName)return true;if(!scoreKey&&profileName&&scoreName===profileName)return true;return false;}
function readTrendingLiveAccountXpSnapshot(){try{if(!window.MkAccountData||typeof window.MkAccountData.xp!=="function")return null;const profile=readTrendingLocalProfile();const xp=window.MkAccountData.xp();if(!xp||typeof xp!=="object")return null;const total=Number(xp.totalScore!=null?xp.totalScore:xp.totalXp!=null?xp.totalXp:xp.score);if(!Number.isFinite(total))return null;const snap=Object.assign({},xp,{accountKey:profile.accountKey||xp.accountKey||"",name:profile.name||xp.name||"",avatar:profile.avatar||xp.avatar||"",avatarFrame:profile.avatarFrame||xp.selectedAvatarFrame||xp.avatarFrame||"level-1",selectedAvatarFrame:profile.avatarFrame||xp.selectedAvatarFrame||xp.avatarFrame||"level-1",bio:profile.bio||xp.bio||"",intro:profile.bio||xp.intro||xp.bio||"",totalScore:Math.round(total*10)/10,totalXp:Math.round(total*10)/10,score:Math.round(total*10)/10,cachedAt:Date.now(),isCompleteXp:true,sourceEvents:true,source:"Local account event file",equippedCosmetics:(window.MkAccountData&&typeof window.MkAccountData.getEquippedCosmetics==="function")?window.MkAccountData.getEquippedCosmetics():{}});return trendingSnapshotBelongsToProfile(snap,profile)?snap:null;}catch(_){return null;}}
function readTrendingCurrentXpSnapshot(){try{const live=readTrendingLiveAccountXpSnapshot();if(live)return live;const profile=readTrendingLocalProfile();const keys=new Set([TRENDING_ACCOUNT_XP_CACHE_LATEST_KEY]);const accountKey=String(profile.accountKey||"").trim().toLowerCase();const name=cleanTrendingProfileName(profile.name||"").toLowerCase();if(accountKey)keys.add(TRENDING_ACCOUNT_XP_CACHE_PREFIX+accountKey);if(name)keys.add(TRENDING_ACCOUNT_XP_CACHE_PREFIX+name);try{for(let i=0;i<localStorage.length;i+=1){const k=localStorage.key(i)||"";if(k===TRENDING_ACCOUNT_XP_CACHE_LATEST_KEY||k.indexOf(TRENDING_ACCOUNT_XP_CACHE_PREFIX)===0)keys.add(k);}}catch(_){}
const candidates=[];const seen=new Set();keys.forEach((key)=>{try{const raw=localStorage.getItem(key)||"";if(!raw||seen.has(raw))return;seen.add(raw);const score=parseTrendingXpCache(raw);if(score&&trendingSnapshotBelongsToProfile(score,profile))candidates.push(score);}catch(_){}});candidates.sort((a,b)=>Number(b.cachedAt||b.lastSyncedAt||0)-Number(a.cachedAt||a.lastSyncedAt||0));return candidates[0]||null;}catch(_){return null;}}
function trendingDayStart(period){const now=new Date();const utc=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());if(period==="today")return new Date(utc).toISOString().slice(0,10);if(period==="7d")return new Date(utc-6*86400000).toISOString().slice(0,10);if(period==="30d")return new Date(utc-29*86400000).toISOString().slice(0,10);return"";}
function periodXpFromSnapshot(score,period){if(!score)return 0;if(period==="all")return Number(score.totalScore||0)||0;const start=trendingDayStart(period);if(!start)return Number(score.totalScore||0)||0;return(Array.isArray(score.dailySummary)?score.dailySummary:[]).reduce((sum,row)=>{const day=String(row&&row.day||"");if(day&&day>=start)return sum+Number(row&&row.score||0);return sum;},0);}
function patchCurrentUserRankingItems(items,period,options){const list=Array.isArray(items)?items:[];if(!list.length)return list;const opts=options&&typeof options==="object"?options:{};const preferLocalOwnScore=!!opts.preferLocalOwnScore;const profile=readTrendingLocalProfile();const accountKey=String(profile.accountKey||"").trim().toLowerCase();const profileName=cleanTrendingProfileName(profile.name||"").toLowerCase();if(!accountKey&&!profileName)return list;const snap=readTrendingCurrentXpSnapshot();if(!snap)return list;const snapKey=String(snap.accountKey||"").trim().toLowerCase();const snapName=cleanTrendingProfileName(snap.name||profile.name||"").toLowerCase();const belongs=(accountKey&&snapKey&&accountKey===snapKey)||(profileName&&snapName&&profileName===snapName)||(!snapKey&&profileName&&snapName===profileName);if(!belongs)return list;const localPeriodScore=Math.round(periodXpFromSnapshot(snap,period)*10)/10;const localTotalScore=Math.round(Number(snap.totalScore||snap.totalXp||snap.score||0)*10)/10;const level=Math.max(1,Math.floor(Number(snap.level||1))||1);let changed=false;const patched=list.map((it)=>{const itemKey=String(it&&(it.accountKey||it.account_key||"")||"").trim().toLowerCase();const itemName=cleanTrendingProfileName(it&&(it.name||it.title||it.username||it.displayName)||"").toLowerCase();const isMe=!!((accountKey&&itemKey&&accountKey===itemKey)||(profileName&&itemName&&profileName===itemName));if(!isMe)return it;changed=true;const serverPeriodScore=Math.round(userPeriodXp(it)*10)/10;const serverTotalScore=Math.round(userTotalXp(it)*10)/10;const periodScore=preferLocalOwnScore&&Number.isFinite(localPeriodScore)&&localPeriodScore>0?localPeriodScore:(Number.isFinite(serverPeriodScore)?serverPeriodScore:0);const totalScore=preferLocalOwnScore&&Number.isFinite(localTotalScore)&&localTotalScore>0?localTotalScore:(Number.isFinite(serverTotalScore)?serverTotalScore:0);const selectedFrame=cleanAvatarFrameLocal(profile.avatarFrame||snap.selectedAvatarFrame||snap.avatarFrame||it.selectedAvatarFrame||it.avatarFrame||avatarFrameForLevelLocal(level));return Object.assign({},it,{accountKey:it.accountKey||profile.accountKey||snap.accountKey||"",name:it.name||profile.name||snap.name||"",title:it.title||it.name||profile.name||snap.name||"",avatar:profile.avatar||snap.avatar||it.avatar||"",score:periodScore,count:periodScore,periodScore,totalScore,totalXp:totalScore,level,progressPct:snap.progressPct,levelStart:snap.levelStart,nextLevelStart:snap.nextLevelStart,avatarFrame:selectedFrame,selectedAvatarFrame:selectedFrame,equippedCosmetics:snap.equippedCosmetics||it.equippedCosmetics||{},rankingEffect:(snap.equippedCosmetics&&snap.equippedCosmetics.ranking_effect)||it.rankingEffect||"",localXpSnapshotPatched:true});});if(!changed)return list;patched.sort((a,b)=>Number(userPeriodXp(b)||0)-Number(userPeriodXp(a)||0)||Number(userTotalXp(b)||0)-Number(userTotalXp(a)||0)||userDisplayName(a).localeCompare(userDisplayName(b)));return patched;}
function userPeriodXp(item){if(isMilestoneMetric(item&&item.metric))return userTotalXp(item);const v=firstDefinedValue(item,["periodScore","periodXp","earnedXp","earnedXP","score","count","xp"]);const n=Number(v||0);return Number.isFinite(n)?n:0;}
function userTotalXp(item){const v=firstDefinedValue(item,["totalScore","totalXp","totalXP","xpTotal","overallScore","lifetimeXp","lifetimeXP","score"]);const n=Number(v||0);return Number.isFinite(n)?n:0;}
function userLevel(item){const v=firstDefinedValue(item,["level","xpLevel","currentLevel"]);const n=Math.floor(Number(v||1));return Number.isFinite(n)&&n>0?n:1;}
const TRENDING_LEVEL_THRESHOLDS_LOCAL=[0,50,140,300,600,1100,1900,3200,5200,8000];function clampTrendingPct(value){const n=Number(value);if(!Number.isFinite(n))return 0;return Math.max(0,Math.min(100,n));}
function userLevelProgressPct(item,totalXp,level){const explicit=firstDefinedValue(item,["progressPct","levelProgressPct","levelProgress","xpProgressPct"]);if(explicit!=="")return clampTrendingPct(explicit);const startRaw=firstDefinedValue(item,["levelStart","currentLevelStart"]);const nextRaw=firstDefinedValue(item,["nextLevelStart","nextLevelXp","nextLevelXP"]);let start=startRaw!==""?Number(startRaw):NaN;let next=nextRaw!==""?Number(nextRaw):NaN;const lvl=Math.max(1,Math.floor(Number(level||1)));if(!Number.isFinite(start))start=Number(TRENDING_LEVEL_THRESHOLDS_LOCAL[lvl-1]||0);if(!Number.isFinite(next))next=lvl<TRENDING_LEVEL_THRESHOLDS_LOCAL.length?Number(TRENDING_LEVEL_THRESHOLDS_LOCAL[lvl]||0):NaN;if(!Number.isFinite(next)||next<=start)return 100;return clampTrendingPct(((Number(totalXp||0)-start)/Math.max(1,next-start))*100);}
function formatTrendingPctStyle(pct){const n=clampTrendingPct(pct);return String(Math.round(n*10)/10);}
function userDisplayName(item){return String(firstDefinedValue(item,["name","title","username","displayName"])||"Public user").replace(/[\u0000-\u001f<>]/g,"").replace(/\s+/g," ").trim()||"Public user";}
function userIntroText(item){return String(firstDefinedValue(item,["bio","intro","description","profileIntro","tagline"])||"").replace(/[\u0000-\u001f<>]/g," ").replace(/\s+/g," ").trim().slice(0,180);}
function userAvatarValue(item){return String(firstDefinedValue(item,["avatar","avatarUrl","avatarURL","photo","photoUrl","image","imageUrl"])||"").replace(/[\u0000-\u001f<>]/g,"").trim();}
const AVATAR_FRAME_DEFS_LOCAL=[{id:"level-1",level:1,label:"Clean Ring"},{id:"level-2",level:2,label:"Bronze Studs"},{id:"level-3",level:3,label:"Silver Compass"},{id:"level-4",level:4,label:"Golden Beads"},{id:"level-5",level:5,label:"Emerald Laurel"},{id:"level-6",level:6,label:"Sapphire Crystal"},{id:"level-7",level:7,label:"Amethyst Stars"},{id:"level-8",level:8,label:"Ruby Flame"},{id:"level-9",level:9,label:"Aurora Wings"},{id:"level-10",level:10,label:"Royal Crown"},];function cleanAvatarFrameLocal(value){const raw=String(value||"").trim().toLowerCase();const m=raw.match(/^(?:level-|lv-?|frame-?)(10|[1-9])$/)||raw.match(/^(10|[1-9])$/);const n=m?Math.max(1,Math.min(10,Number(m[1]||1))):1;return`level-${n}`;}
function avatarFrameLevelLocal(frameId){const id=cleanAvatarFrameLocal(frameId);const m=id.match(/(10|[1-9])$/);return m?Math.max(1,Math.min(10,Number(m[1]))):1;}
function avatarFrameForLevelLocal(level){const n=Math.max(1,Math.min(10,Number(level||1)));return`level-${Math.floor(n)}`;}
function userAvatarFrameValue(item){const raw=firstDefinedValue(item,["selectedAvatarFrame","selectedFrame","selected_frame","avatarFrame","avatar_frame","profileAvatarFrame","frame"]);if(raw)return cleanAvatarFrameLocal(raw);return avatarFrameForLevelLocal(userLevel(item));}
function avatarFrameLabelLocal(frameId){const id=cleanAvatarFrameLocal(frameId);const found=AVATAR_FRAME_DEFS_LOCAL.find((f)=>f.id===id);return found?found.label:`Level ${avatarFrameLevelLocal(id)}`;}
function avatarFrameSvgLocal(frameId){const level=avatarFrameLevelLocal(frameId);const svgOpen=`<svg class="mk-avatar-frame-svg mk-avatar-frame-svg-${level}" viewBox="-28 -28 156 156" aria-hidden="true" focusable="false">`;const svgClose=`</svg>`;const circle=(r,attrs)=>`<circle cx="50" cy="50" r="${r}" fill="none" ${attrs || ""}/>`;const polar=(deg,r)=>{const a=(Number(deg)||0)*Math.PI/180;return[Number((50+Math.cos(a)*r).toFixed(2)),Number((50+Math.sin(a)*r).toFixed(2))];};const bead=(cx,cy,r,fill,stroke)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke || "rgba(255,255,255,.76)"}" stroke-width="1.35"/>`;const beadAt=(deg,rad,rr,fill,stroke)=>{const[x,y]=polar(deg,rad);return bead(x,y,rr,fill,stroke);};const tickAt=(deg,r1,r2,color,width)=>{const[x1,y1]=polar(deg,r1);const[x2,y2]=polar(deg,r2);return`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="${width || 1.4}" stroke-linecap="round"/>`;};const dots=(count,rad,rr,fills,start)=>Array.from({length:count},(_,i)=>{const deg=(start==null?-90:start)+i*360/count;const fill=Array.isArray(fills)?fills[i%fills.length]:fills;return beadAt(deg,rad,rr,fill,"rgba(255,255,255,.72)");}).join(" ");const ticks=(count,r1,r2,color,width,start)=>Array.from({length:count},(_,i)=>tickAt((start==null?-90:start)+i*360/count,r1,r2,color,width)).join(" ");const diamond=(cx,cy,size,fill,stroke)=>{const z=Number(size)||5;return`<path d="M ${cx} ${cy - z} L ${cx + z} ${cy} L ${cx} ${cy + z} L ${cx - z} ${cy} Z" fill="${fill}" stroke="${stroke || "rgba(255,255,255,.82)"}" stroke-width="1.35" stroke-linejoin="round"/>`;};const diamondAt=(deg,rad,size,fill,stroke)=>{const[x,y]=polar(deg,rad);return diamond(x,y,size,fill,stroke);};const star=(cx,cy,r1,r2,fill,stroke)=>{const pts=[];for(let i=0;i<10;i++){const a=(-90+i*36)*Math.PI/180;const rr=i%2===0?r1:r2;pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);}
return`<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${stroke || "rgba(255,255,255,.82)"}" stroke-width="1.05" stroke-linejoin="round"/>`;};const starAt=(deg,rad,r1,r2,fill,stroke)=>{const[x,y]=polar(deg,rad);return star(x,y,r1,r2,fill,stroke);};const leaf=(cx,cy,rot,fill,scale)=>{const sc=Number(scale||1);return`<path d="M ${cx} ${cy} C ${cx - 7 * sc} ${cy - 8 * sc}, ${cx - 15 * sc} ${cy - 6 * sc}, ${cx - 17 * sc} ${cy + 2 * sc} C ${cx - 9 * sc} ${cy + 4 * sc}, ${cx - 3 * sc} ${cy + 2 * sc}, ${cx} ${cy} Z" fill="${fill}" stroke="rgba(255,255,255,.62)" stroke-width="1" transform="rotate(${rot} ${cx} ${cy})"/>`;};const petalAt=(deg,rad,len,fill,stroke,twist)=>{const[x,y]=polar(deg,rad);const rot=deg+(twist||0);return`<path d="M ${x} ${y - len} C ${x + len * .72} ${y - len * .12}, ${x + len * .52} ${y + len * .56}, ${x} ${y + len * .88} C ${x - len * .52} ${y + len * .56}, ${x - len * .72} ${y - len * .12}, ${x} ${y - len} Z" fill="${fill}" stroke="${stroke || "rgba(255,255,255,.72)"}" stroke-width="1.1" stroke-linejoin="round" transform="rotate(${rot} ${x} ${y})"/>`;};const shardAt=(deg,rad,len,fill,stroke,width)=>{const[x,y]=polar(deg,rad);const w=width||len*.42;const rot=deg+90;return`<path d="M ${x} ${y - len} L ${x + w} ${y + len * .12} L ${x} ${y + len * .72} L ${x - w} ${y + len * .12} Z" fill="${fill}" stroke="${stroke || "rgba(255,255,255,.82)"}" stroke-width="1.1" stroke-linejoin="round" transform="rotate(${rot} ${x} ${y})"/>`;};if(level===1){return`${svgOpen}
        ${circle(53, `stroke="rgba(122,133,150,.78)"stroke-width="3.2"`)}
        ${circle(57, `stroke="rgba(122,133,150,.25)"stroke-width="1.2"`)}
        ${ticks(8, 59, 62, "rgba(148,163,184,.32)", 1.1, -90)}
        ${beadAt(-90, 61, 2.4, "#cbd5e1", "#f8fafc")}
      ${svgClose}`;}
if(level===2){return`${svgOpen}
        ${circle(52, `stroke="#9a5c2c"stroke-width="4.3"`)}
        ${circle(58, `stroke="rgba(245,186,117,.62)"stroke-width="1.6"stroke-dasharray="4 6"`)}
        ${circle(46, `stroke="rgba(120,53,15,.32)"stroke-width="1.4"`)}
        ${dots(8, 62, 3.4, ["#b87333", "#d08a45"])}
        ${ticks(16, 55, 59, "rgba(255,237,213,.48)", 1.05, -90)}
      ${svgClose}`;}
if(level===3){return`${svgOpen}
        ${circle(52, `stroke="#cbd5e1"stroke-width="4.1"`)}
        ${circle(59, `stroke="rgba(148,163,184,.56)"stroke-width="1.55"`)}
        ${circle(45, `stroke="rgba(226,232,240,.30)"stroke-width="1.2"stroke-dasharray="7 7"`)}
        ${[ -90, 0, 90, 180 ].map((d) => diamondAt(d, 63, 6.1, "#e2e8f0", "#94a3b8")).join(" ")}
        ${[ -45, 45, 135, 225 ].map((d) => diamondAt(d, 60, 3.7, "#f8fafc", "#cbd5e1")).join(" ")}
        ${ticks(12, 54, 61, "rgba(248,250,252,.55)", 1.25, -90)}
        <path d="M50 -4V12 M50 88v16 M-4 50H12 M88 50h16" stroke="#f8fafc" stroke-width="2.8" stroke-linecap="round"/>
      ${svgClose}`;}
if(level===4){return`${svgOpen}
        ${circle(51, `stroke="#d99b22"stroke-width="5"`)}
        ${circle(58, `stroke="rgba(255,224,130,.76)"stroke-width="2"stroke-dasharray="2 7"stroke-linecap="round"`)}
        ${circle(44, `stroke="rgba(146,64,14,.34)"stroke-width="1.6"`)}
        ${dots(12, 63, 3.6, ["#facc15", "#f59e0b", "#fde68a"])}
        ${dots(12, 48, 1.25, "rgba(255,251,235,.70)", -75)}
        ${[ -90, 0, 90, 180 ].map((d) => diamondAt(d, 66, 4.2, "#fff7ad", "#ca8a04")).join(" ")}
      ${svgClose}`;}
if(level===5){return`${svgOpen}
        ${circle(51, `stroke="#059669"stroke-width="4.8"`)}
        ${circle(58, `stroke="rgba(167,243,208,.62)"stroke-width="1.7"stroke-dasharray="10 8"stroke-linecap="round"`)}
        <path d="M 6 88 C -10 60, -6 29, 15 8" fill="none" stroke="#10b981" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M 94 88 C 110 60, 106 29, 85 8" fill="none" stroke="#10b981" stroke-width="4.2" stroke-linecap="round"/>
        ${leaf(19,82,-25,"#10b981",1.02)} ${leaf(10,68,-15,"#6ee7b7",.92)} ${leaf(7,53,0,"#34d399",.85)} ${leaf(10,38,14,"#10b981",.92)} ${leaf(20,21,31,"#6ee7b7",1)}
        ${leaf(81,82,205,"#10b981",1.02)} ${leaf(90,68,195,"#6ee7b7",.92)} ${leaf(93,53,180,"#34d399",.85)} ${leaf(90,38,166,"#10b981",.92)} ${leaf(80,21,149,"#6ee7b7",1)}
        ${diamondAt(-90, 64, 5.4, "#a7f3d0", "#047857")}
        ${dots(8, 49, 1.35, "rgba(236,253,245,.70)", -90)}
      ${svgClose}`;}
if(level===6){return`${svgOpen}
        ${circle(51, `stroke="#2563eb"stroke-width="4.9"`)}
        ${circle(59, `stroke="rgba(96,165,250,.82)"stroke-width="2"stroke-dasharray="9 7"stroke-linecap="round"`)}
        ${circle(44, `stroke="rgba(191,219,254,.34)"stroke-width="1.45"`)}
        ${[ -90, 0, 90, 180 ].map((d) => shardAt(d, 64, 8.8, "#38bdf8", "#dbeafe", 4.4)).join(" ")}
        ${[ -45, 45, 135, 225 ].map((d) => shardAt(d, 61, 5.7, "#60a5fa", "#eff6ff", 3.2)).join(" ")}
        <path d="M18 3 C33 -9, 67 -9, 82 3" fill="none" stroke="#bfdbfe" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M18 97 C33 109, 67 109, 82 97" fill="none" stroke="#bfdbfe" stroke-width="3.2" stroke-linecap="round"/>
        ${dots(12, 50, 1.2, ["#dbeafe", "#93c5fd"], -75)}
      ${svgClose}`;}
if(level===7){return`${svgOpen}
        ${circle(51, `stroke="#7c3aed"stroke-width="5.1"`)}
        ${circle(60, `stroke="rgba(216,180,254,.78)"stroke-width="2"stroke-dasharray="1 8"stroke-linecap="round"`)}
        ${circle(44, `stroke="rgba(233,213,255,.34)"stroke-width="1.4"stroke-dasharray="5 6"`)}
        ${[ -90, 90 ].map((d) => starAt(d, 65, 8, 3.4, "#c084fc", "#faf5ff")).join(" ")}
        ${[ -35, 35, 145, 215 ].map((d) => starAt(d, 64, 6.1, 2.5, "#a78bfa", "#ede9fe")).join(" ")}
        ${[ -65, -15, 70, 110, 195, 245 ].map((d) => starAt(d, 54, 3.2, 1.4, "#f0abfc", "#fdf4ff")).join(" ")}
        <path d="M 18 8 C 34 -3, 66 -3, 82 8" fill="none" stroke="#f0abfc" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M 20 93 C 35 101, 65 101, 80 93" fill="none" stroke="#c4b5fd" stroke-width="2.2" stroke-linecap="round"/>
        ${dots(14, 49, 1.05, ["#f5d0fe", "#ddd6fe"], -86)}
      ${svgClose}`;}
if(level===8){return`${svgOpen}
        ${circle(51, `stroke="#e11d48"stroke-width="5.2"`)}
        ${circle(60, `stroke="rgba(253,164,175,.78)"stroke-width="2"stroke-dasharray="6 5"stroke-linecap="round"`)}
        ${[ -90, 0, 90, 180 ].map((d) => petalAt(d, 63, 10.2, "#fb7185", "#fff1f2", 0)).join(" ")}
        ${[ -45, 45, 135, 225 ].map((d) => petalAt(d, 61, 7.3, "#f97316", "#ffedd5", 5)).join(" ")}
        ${[ -20, 20, 160, 200 ].map((d) => shardAt(d, 57, 5.2, "#f43f5e", "#ffe4e6", 3)).join(" ")}
        ${diamondAt(-90, 47, 4.5, "#fecdd3", "#be123c")}
        ${diamondAt(90, 47, 4.5, "#fecdd3", "#be123c")}
        ${dots(16, 50, 1.05, ["#ffe4e6", "#fed7aa"], -90)}
      ${svgClose}`;}
if(level===9){return`${svgOpen}
        ${circle(51, `stroke="#06b6d4"stroke-width="5.2"`)}
        ${circle(60, `stroke="rgba(240,171,252,.72)"stroke-width="2"stroke-dasharray="12 6"stroke-linecap="round"`)}
        <path d="M -12 61 C 7 23, 23 1, 46 -11" fill="none" stroke="#a78bfa" stroke-width="5.4" stroke-linecap="round"/>
        <path d="M 112 61 C 93 23, 77 1, 54 -11" fill="none" stroke="#f0abfc" stroke-width="5.4" stroke-linecap="round"/>
        <path d="M -5 78 C 12 48, 25 28, 45 8" fill="none" stroke="#22d3ee" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M 105 78 C 88 48, 75 28, 55 8" fill="none" stroke="#f472b6" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M -2 88 C 18 94, 33 103, 46 118" fill="none" stroke="#67e8f9" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M 102 88 C 82 94, 67 103, 54 118" fill="none" stroke="#f9a8d4" stroke-width="4.2" stroke-linecap="round"/>
        ${starAt(-90, 68, 7.5, 3.2, "#fde68a", "#fffbeb")}
        ${[ -55, -18, 18, 55, 125, 162, 198, 235 ].map((d) => starAt(d, 66, 4.2, 1.8, d < 90 ? "#f0abfc" : "#93c5fd", "#f8fafc")).join(" ")}
        ${diamondAt(90, 67, 7, "#67e8f9", "#e0f2fe")}
        ${dots(18, 49, 1.15, ["#cffafe", "#fae8ff", "#fde68a"], -90)}
      ${svgClose}`;}
return`${svgOpen}
      ${circle(51, `stroke="#f59e0b"stroke-width="5.6"`)}
      ${circle(61, `stroke="rgba(251,191,36,.88)"stroke-width="2.4"stroke-dasharray="3 5"stroke-linecap="round"`)}
      ${circle(43, `stroke="rgba(254,240,138,.34)"stroke-width="1.5"stroke-dasharray="8 5"`)}
      <path d="M 16 -9 L 32 10 L 50 -20 L 68 10 L 84 -9 L 80 19 L 20 19 Z" fill="#facc15" stroke="#fff7ad" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M 25 18 C 35 23, 65 23, 75 18" fill="none" stroke="#fef3c7" stroke-width="2" stroke-linecap="round"/>
      ${diamond(50,-2,6,"#ef4444","#fff1f2")} ${diamond(32,8,4.7,"#38bdf8","#eff6ff")} ${diamond(68,8,4.7,"#a855f7","#faf5ff")}
      <path d="M 3 87 C -14 55, -5 20, 20 3" fill="none" stroke="#fcd34d" stroke-width="4.4" stroke-linecap="round"/>
      <path d="M 97 87 C 114 55, 105 20, 80 3" fill="none" stroke="#fcd34d" stroke-width="4.4" stroke-linecap="round"/>
      ${leaf(18,82,-25,"#fde68a",1.02)} ${leaf(8,62,-8,"#fbbf24",.92)} ${leaf(15,39,16,"#fef08a",.86)}
      ${leaf(82,82,205,"#fde68a",1.02)} ${leaf(92,62,188,"#fbbf24",.92)} ${leaf(85,39,164,"#fef08a",.86)}
      ${dots(16, 63, 3.2, ["#facc15", "#fbbf24", "#fde68a", "#f97316"], -90)}
      ${[ -60, -30, 30, 60, 120, 150, 210, 240 ].map((d) => starAt(d, 56, 4.2, 1.8, "#fff7ad", "#fef3c7")).join(" ")}
      ${beadAt(90, 68, 5.2, "#ef4444", "#fff1f2")} ${beadAt(0, 68, 4.5, "#38bdf8", "#eff6ff")} ${beadAt(180, 68, 4.5, "#a855f7", "#faf5ff")}
    ${svgClose}`;}
function userInitials(name){const clean=String(name||"").replace(/[\u0000-\u001f<>]/g,"").replace(/\s+/g," ").trim();if(!clean)return"?";const parts=clean.split(/\s+/).filter(Boolean);const a=parts[0]||clean;const b=parts.length>1?parts[parts.length-1]:"";return((a[0]||"")+(b?b[0]:"")).toUpperCase();}
function isImageAvatarValue(value){return/^(https?:\/\/|data:image\/|\/|r2:)/i.test(String(value||""));}
function displayAvatarValue(value){const raw=String(value||"").trim();if(!/^r2:/i.test(raw))return raw;const key=raw.replace(/^r2:/i,"");if(!key||key.indexOf("..")>=0||key[0]==="/"||key.indexOf("comment-avatars/")!==0)return"";try{return new URL(`/avatar/${encodeURIComponent(key)}`,API_BASE).toString();}
catch(_){return"";}}
function trendingUserAvatarHtml(item,name){const avatar=displayAvatarValue(userAvatarValue(item));const frame=userAvatarFrameValue(item);const frameCls=` mk-avatar-frame mk-avatar-frame-${frame}`;const frameLabel=`${avatarFrameLabelLocal(frame)} avatar frame`;const frameSvg=avatarFrameSvgLocal(frame);if(avatar&&isImageAvatarValue(avatar)){return`<span class="trending-user-avatar has-image${frameCls}" title="${escapeTrendingHtml(frameLabel)}" aria-hidden="true"><span class="trending-user-avatar-core"><img src="${escapeTrendingHtml(avatar)}" alt="" loading="lazy" decoding="async"></span>${frameSvg}</span>`;}
const text=avatar||userInitials(name);return`<span class="trending-user-avatar${frameCls}" title="${escapeTrendingHtml(frameLabel)}" aria-hidden="true"><span class="trending-user-avatar-core">${escapeTrendingHtml(String(text).slice(0, 4))}</span>${frameSvg}</span>`;}
let trendingProfileOpenEpoch=0;document.addEventListener("keydown",event=>{if(event.key==="Escape")trendingProfileOpenEpoch+=1;},true);document.addEventListener("DOMContentSwitch",()=>{trendingProfileOpenEpoch+=1;});window.addEventListener("pagehide",()=>{trendingProfileOpenEpoch+=1;});async function openTrendingPublicProfile(input,anchor){const epoch=++trendingProfileOpenEpoch;const route=String(window.location.href);try{if(!window.MkLocalActivity||typeof window.MkLocalActivity.openPublicProfile!=="function"){if(anchor)anchor.setAttribute("aria-busy","true");const startup=window.MkStartupPrefs;if(startup&&typeof startup.ensureFeature==="function")await startup.ensureFeature("account");if(epoch!==trendingProfileOpenEpoch||route!==String(window.location.href)||(anchor&&!anchor.isConnected))return;}
if(!window.MkLocalActivity||typeof window.MkLocalActivity.openPublicProfile!=="function")return;const item=input&&typeof input==="object"?input:null;const name=item?userDisplayName(item):String(input||"");const accountKey=item?String(item.accountKey||item.account_key||"").trim():"";let selfPreview=false;try{const me=readTrendingLocalProfile();const meKey=String(me&&me.accountKey||"").trim().toLowerCase();selfPreview=!!(accountKey&&meKey&&accountKey.toLowerCase()===meKey);}catch(_){}
const payload=item?{accountKey,account_key:accountKey,selfPreview,source:"rankings",rankingProfile:item?{accountKey,name,avatar:userAvatarValue(item),avatarFrame:userAvatarFrameValue(item),bio:userIntroText(item),intro:userIntroText(item),equippedCosmetics:item.equippedCosmetics||{},rankingEffect:item.rankingEffect||""}:null,rankingXp:{totalXp:formatTrendingNumber(userTotalXp(item)),periodXp:formatTrendingNumber(userPeriodXp(item)),level:userLevel(item),progressPct:userLevelProgressPct(item,userTotalXp(item),userLevel(item)),accountKey,source:"rankings"}}:null;window.MkLocalActivity.openPublicProfile(name||accountKey||"",payload||undefined);}catch(_){if(anchor&&anchor.isConnected&&epoch===trendingProfileOpenEpoch){const notice=el("span","trending-profile-error","Profile could not load. Select the name to retry.");notice.setAttribute("role","status");const parent=anchor.parentElement;if(parent&&!parent.querySelector(".trending-profile-error"))parent.appendChild(notice);}}finally{if(anchor)anchor.removeAttribute("aria-busy");}}
function getSiteRootUrl(){const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]');const attr=script?script.getAttribute("src"):(link?link.getAttribute("href"):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname;const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function safePath(loc){const s0=String(loc||"");return(s0.split("#")[0]||s0).replace(/^\/+/,"");}
function asStringList(x){if(!x)return[];if(Array.isArray(x))return x.map(String).filter(Boolean);if(typeof x==="string")return[x];return[];}
let __indexDocsPromise=null;function loadIndexDocsOnce(){if(__indexDocsPromise)return __indexDocsPromise;__indexDocsPromise=(async()=>{const root=getSiteRootUrl();const url=new URL("search/search_index.json",root).toString();const request=__mkFetchSearchIndex(url,{cache:"no-cache"});const j=await request.catch(()=>null);if(!j||!Array.isArray(j.docs)){[window.__mkSharedJsonPromiseMap,window.__mkMaterialSearchIndexPromises].forEach((cache)=>{if(cache&&cache[url]===request)delete cache[url];});throw new Error("Ranking search index is unavailable");}
return j.docs;})().catch((error)=>{__indexDocsPromise=null;throw error;});return __indexDocsPromise;}
let __validPathSetPromise=null;function loadValidPathSetOnce(){if(__validPathSetPromise)return __validPathSetPromise;__validPathSetPromise=(async()=>{const docs=await loadIndexDocsOnce();const set=new Set();for(const d of docs){const loc=safePath(d&&d.location);if(loc)set.add(loc);}
return set;})().catch((error)=>{__validPathSetPromise=null;throw error;});return __validPathSetPromise;}
let __titleMapPromise=null;function loadTitleMapOnce(){if(__titleMapPromise)return __titleMapPromise;__titleMapPromise=(async()=>{const docs=await loadIndexDocsOnce();const map=new Map();for(const d of docs){const loc=safePath(d&&d.location);if(!loc)continue;const title=cleanTitle(d&&d.title);if(!title||titleLooksLikePathForTrending(title))continue;const key=titleLookupKey(loc);if(key&&!map.has(key))map.set(key,title);if(key.endsWith(".html"))map.set(key.slice(0,-5),title);else map.set(key+".html",title);}
return map;})().catch((error)=>{__titleMapPromise=null;throw error;});return __titleMapPromise;}
function isExistingPagePath(p,validSet){if(!validSet||!(validSet instanceof Set))return true;const key=safePath(p);if(!key)return false;if(validSet.has(key))return true;if(!key.endsWith(".html")&&validSet.has(key+".html"))return true;if(key.endsWith(".html")&&validSet.has(key.slice(0,-5)))return true;return false;}
function cacheKeyPart(value){return value==null?"":String(value);}
function hotCacheKey(metric,period,limit,offset){return"mk_trending_hot_cache_v3:"+[metric,period,limit,offset].map(cacheKeyPart).join(":");}
function userBoardCacheKey(period,limit,offset){return"mk_trending_user_board_cache_v2:"+[v2RankingPeriodParam(period),limit,offset].map(cacheKeyPart).join(":");}
function rankingCacheTimestampFresh(ts,ttlMs,nowTs){const savedAt=Number(ts||0);const now=Number(nowTs==null?Date.now():nowTs);const ttl=Math.max(0,Number(ttlMs||0));return savedAt>0&&Number.isFinite(now)&&now>=savedAt&&now-savedAt<=ttl;}
function rankingMemoryCacheUsable(metric,cached,nowTs){if(!cached)return false;const status=cached.status||{};if(status.stale||status.refreshFailed)return false;if(!isTrendingUserMetric(metric))return true;return rankingCacheTimestampFresh(cached.fetchedAt,USER_RANKING_MEMORY_TTL_MS,nowTs);}
function userRankingDedupeKey(item){const accountKey=String(item&&(item.accountKey||item.account_key)||"").trim().toLowerCase();if(accountKey)return"account:"+accountKey;const path=String(item&&item.path||"").trim().toLowerCase();if(path&&path.startsWith("user:"))return"path:"+path;const name=cleanTrendingProfileName(item&&(item.name||item.title||item.username||item.displayName)||"").toLowerCase();return name?"name:"+name:"";}
function dedupeUserRankingItems(items){const out=[];const seen=new Set();(Array.isArray(items)?items:[]).forEach((item)=>{const key=userRankingDedupeKey(item);if(key){if(seen.has(key))return;seen.add(key);}
out.push(item);});return out;}
function readUserBoardCache(period,limit,offset){try{const row=JSON.parse(localStorage.getItem(userBoardCacheKey(period,limit,offset))||"{}");if(!rankingCacheTimestampFresh(row&&row.ts,USER_RANKING_CACHE_TTL_MS))return null;const data=row&&row.data||{};const items=dedupeUserRankingItems(Array.isArray(data.items)?data.items:[]);if(!items.length)return null;return{items,total:Number(data.total||items.length)||items.length,cached:true,cachedAt:Number(row.ts||0)||0};}catch(_){return null;}}
function writeUserBoardCache(period,limit,offset,data){try{if(!data||!Array.isArray(data.items))return;const items=dedupeUserRankingItems(data.items);localStorage.setItem(userBoardCacheKey(period,limit,offset),JSON.stringify({ts:Date.now(),data:{items,total:data.total||items.length}}));}catch(_){}}
function readHotCache(metric,period,limit,offset){try{const raw=localStorage.getItem(hotCacheKey(metric,period,limit,offset));if(!raw)return null;const row=JSON.parse(raw);if(!row||typeof row!=="object")return null;const ts=Number(row.ts||0);if(!ts)return null;const ttl=isTrendingUserMetric(metric)?USER_RANKING_CACHE_TTL_MS:24*60*60*1000;if(!rankingCacheTimestampFresh(ts,ttl))return null;const data=row.data||{};const items=isTrendingUserMetric(metric)?dedupeUserRankingItems(data.items):(Array.isArray(data.items)?data.items:[]);if(isTrendingUserMetric(metric)&&!items.length)return null;return{items,total:typeof data.total==="number"?data.total:0,cached:true,cachedAt:ts,};}catch(_){return null;}}
function writeHotCache(metric,period,limit,offset,data){try{if(!data||!Array.isArray(data.items))return;const items=isTrendingUserMetric(metric)?dedupeUserRankingItems(data.items):data.items;localStorage.setItem(hotCacheKey(metric,period,limit,offset),JSON.stringify({ts:Date.now(),data:{items,total:data.total||0}}));if(metric==="users")writeUserBoardCache(period,limit,offset,Object.assign({},data,{items}));}catch(_){}}
function trendingVisitorId(){try{return String(localStorage.getItem("mk_hot_visitor_id_v1")||"").trim();}
catch(_){return"";}}
function v2RankingPeriodParam(period){const p=String(period||"").toLowerCase();if(p==="today"||p==="daily")return"daily";if(p==="7d"||p==="weekly")return"weekly";if(p==="30d"||p==="monthly")return"monthly";return"all";}
function normaliseUserRankingItems(data){const rawItems=Array.isArray(data&&data.entries)?data.entries:(Array.isArray(data&&data.items)?data.items:[]);return dedupeUserRankingItems(rawItems.map((it)=>{const score=Number(firstDefinedValue(it,["periodScore","score","xp","count"])||0);const total=Number(firstDefinedValue(it,["totalScore","totalXp","totalXP","xpTotal","overallScore","lifetimeXp","lifetimeXP"])||score||0);return Object.assign({},it,{kind:"user",path:it&&it.path||`user:${String(it && (it.accountKey || it.account_key || "") || "")}`,score:Number.isFinite(score)?score:0,count:Number.isFinite(score)?score:0,periodScore:Number.isFinite(score)?score:0,totalScore:Number.isFinite(total)?total:0,totalXp:Number.isFinite(total)?total:0,});}));}
async function fetchUserRankings({period,limit,offset}){const cacheKey=hotCacheKey("users",period,limit,offset);const request={};latestRankingRequests.set(cacheKey,request);const url=new URL(API_BASE+"/v2/rankings");url.searchParams.set("period",v2RankingPeriodParam(period));url.searchParams.set("limit",String(limit));url.searchParams.set("offset",String(offset));const visitorId=trendingVisitorId();if(visitorId)url.searchParams.set("visitorId",visitorId);url.searchParams.set("fresh",String(Date.now()));url.searchParams.set("r",Math.random().toString(36).slice(2));const resp=await fetch(url.toString(),{cache:"no-store",headers:{"Cache-Control":"no-cache","Pragma":"no-cache"}}).catch(()=>null);const data=resp&&resp.ok?await resp.json().catch(()=>null):null;if(data&&data.ok!==false&&(Array.isArray(data.entries)||Array.isArray(data.items))){const items=normaliseUserRankingItems(data);const fresh={items,total:typeof data.count==="number"?data.count:(typeof data.total==="number"?data.total:items.length),fetchedAt:Date.now(),source:"v2-rankings",};if(latestRankingRequests.get(cacheKey)===request)writeHotCache("users",period,limit,offset,fresh);return fresh;}
const cached=readHotCache("users",period,limit,offset)||readUserBoardCache(period,limit,offset);if(cached)return Object.assign({},cached,{stale:true,refreshFailed:true});return{items:[],total:0,stale:true,refreshFailed:true};}
async function fetchHot({metric,period,limit,offset}){if(metric==="users")return fetchUserRankings({period,limit,offset});const cacheKey=hotCacheKey(metric,period,limit,offset);const request={};latestRankingRequests.set(cacheKey,request);const url=new URL(API_BASE+"/hot");url.searchParams.set("metric",metric);url.searchParams.set("period",period);url.searchParams.set("limit",String(limit));url.searchParams.set("offset",String(offset));url.searchParams.set("fresh",String(Date.now()));url.searchParams.set("r",Math.random().toString(36).slice(2));const resp=await fetch(url.toString(),{cache:"no-store",headers:{"Cache-Control":"no-cache","Pragma":"no-cache"}}).catch(()=>null);const data=resp&&resp.ok?await resp.json().catch(()=>null):null;if(data&&data.ok!==false&&Array.isArray(data.items)&&(!isMilestoneMetric(metric)||(data.metric===metric&&data.period_used===period))){const fresh={items:data.items,total:typeof data.total==="number"?data.total:data.items.length,fetchedAt:Date.now(),};if(latestRankingRequests.get(cacheKey)===request)writeHotCache(metric,period,limit,offset,fresh);return fresh;}
const cached=readHotCache(metric,period,limit,offset);if(cached)return Object.assign({},cached,{stale:true,refreshFailed:true});return{items:[],total:0,stale:true,refreshFailed:true};}
function getTagsFromDoc(d){const out=[];out.push(...asStringList(d&&d.tags));out.push(...asStringList(d&&d.tag));out.push(...asStringList(d&&d.meta&&d.meta.tags));out.push(...asStringList(d&&d.meta&&d.meta.tag));return out.map(s=>String(s).trim()).filter(Boolean);}
function lectureNumFromTags(tagsArr){const info=unitInfoFromTags(tagsArr);return info?info.lectureNum:0;}
let __lectureMapPromise=null;function loadLectureMapOnce(){if(__lectureMapPromise)return __lectureMapPromise;__lectureMapPromise=(async()=>{const docs=await loadIndexDocsOnce();const map=new Map();for(const d of docs){const loc=safePath(d&&d.location);if(!loc||map.has(loc))continue;const info=unitInfoFromTags(getTagsFromDoc(d));if(info&&info.unitNum)map.set(loc,info);}
return map;})().catch((error)=>{__lectureMapPromise=null;throw error;});return __lectureMapPromise;}
function isTrendingPage(){return!!document.getElementById("trending-app");}
function accountFeatureEnabled(){try{return document.documentElement.getAttribute("data-mk-startup-account")!=="off"&&!document.documentElement.classList.contains("mk-startup-account-off");}catch(_){return true;}}
const CONCEPT_TRENDING_METRICS=[{key:"views",title:"Most viewed"},{key:"popular",title:"Most popular"},{key:"tested",title:"Most tested"},];const ACCOUNT_TRENDING_METRICS=[{key:"spenders",title:"Biggest Spenders"},{key:"mastery_explorers",title:"Mastery Explorers"},{key:"users",title:"Most active users"},{key:"quiz_correct",title:"AI Quiz Lovers"},];const TRENDING_METRICS=CONCEPT_TRENDING_METRICS.concat(ACCOUNT_TRENDING_METRICS);function visibleTrendingMetrics(){return accountFeatureEnabled()?TRENDING_METRICS:CONCEPT_TRENDING_METRICS;}
function normaliseTrendingMetric(metric){let key=String(metric||"").toLowerCase();if(key==="comments"||key==="buzz"||key==="buzzing"||key==="liveliness")key="lively";if(key==="saved_pages"||key==="saves"||key==="most_saved")key="saved";if(key==="most_tested"||key==="ai_quiz_tested"||key==="quiz_tested"||key==="ai_quiz_sessions")key="tested";if(key==="ai_quiz_correct"||key==="aiquiz_correct"||key==="quiz_correct_answers"||key==="ai_quiz_correct_answers")key="quiz_correct";return visibleTrendingMetrics().some((m)=>m.key===key)?key:"views";}
function emitSortFilterUsed(kind,detail){try{document.dispatchEvent(new CustomEvent("mk:sort-filter-used",{detail:Object.assign({source:"trending-page",controlKind:kind||"sort",sortFilterSignalVersion:8,},detail||{})}));}catch(_){}}
function readInitialTrendingMetric(){try{const url=new URL(window.location.href);if(url.searchParams.has("metric"))return normaliseTrendingMetric(url.searchParams.get("metric"));}catch(_){}
try{const hash=String(window.location.hash||"").replace(/^#/,"").toLowerCase();if(hash)return normaliseTrendingMetric(hash);}catch(_){}
return"views";}
function writeTrendingMetricToUrl(metric){try{const url=new URL(window.location.href);url.searchParams.set("metric",normaliseTrendingMetric(metric));url.hash="";window.history.replaceState(null,"",url.toString());}catch(_){}}
const PERIODS=[{key:"today",label:"Top 10 Today",limit:10},{key:"7d",label:"Top 10 This week",limit:10},{key:"30d",label:"Top 10 This month",limit:10},{key:"all",label:"Top 100 All time",limit:10},];const ALL_TIME_CAP=100;function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=text;return node;}
function isUtilityPath(p){const s=String(p||"").toLowerCase();const base=(s.split("?")[0].split("#")[0].split("/").pop()||"").trim();return base==="find.html"||base==="find"||base==="custom-random.html"||base==="custom-random";}
function buildAllTimePages(totalPages,currentPage){const tp=Math.max(1,totalPages);const cur=Math.min(Math.max(1,currentPage),tp);const set=new Set([1,2,tp-1,tp,cur,cur-1,cur-2,cur+1,cur+2]);const nums=Array.from(set).filter(n=>n>=1&&n<=tp).sort((a,b)=>a-b);const out=[];let prev=0;for(const n of nums){if(prev&&n-prev>1)out.push("…");out.push(n);prev=n;}
return out;}
function buildBlock({title,metric,deferInitialLoad}){const block=el("section","trending-block");block.dataset.metric=metric||"views";if(isTrendingUserMetric(metric))block.classList.add("trending-user-block");const initialPeriod="7d";const header=el("div","trending-block-header");header.appendChild(el("h2","trending-block-title",title));let metaHeadEl=null;if(!IS_MOBILE_UI){metaHeadEl=el("div","trending-metahead",periodMetricLabel(initialPeriod,metric));header.appendChild(metaHeadEl);}
const tabs=el("div","trending-tabs");PERIODS.forEach((p)=>{const btn=el("button","trending-tab",p.label);btn.setAttribute("aria-label",p.label);btn.type="button";btn.dataset.period=p.key;tabs.appendChild(btn);});header.appendChild(tabs);let colHeadEl=null;if(IS_MOBILE_UI){colHeadEl=el("div","trending-colhead");colHeadEl.appendChild(el("span","trending-colhead-spacer",""));colHeadEl.appendChild(el("span","trending-colhead-left",isTrendingUserMetric(metric)?"User":"Concept"));colHeadEl.appendChild(el("span","trending-colhead-right",periodMetricLabel(initialPeriod,metric)));}
const list=el("ol","trending-list");const footer=el("div","trending-footer");const prev=el("button","trending-page-btn");prev.type="button";prev.setAttribute("aria-label","Previous page");prev.textContent="←";const pages=el("div","trending-pages");const next=el("button","trending-page-btn");next.type="button";next.setAttribute("aria-label","Next page");next.textContent="→";footer.appendChild(prev);footer.appendChild(pages);footer.appendChild(next);const boardMeta=el("div","trending-board-meta");const boardMetaTime=el("span","trending-board-time","");const boardRefresh=el("button","trending-board-refresh");boardRefresh.type="button";boardRefresh.setAttribute("aria-label","Refresh this ranking");boardRefresh.title="Refresh this ranking from the cloud";boardRefresh.innerHTML="<span class=\"trending-board-refresh-icon\" aria-hidden=\"true\">↻</span><span class=\"trending-board-refresh-text\">Refresh</span>";boardMeta.appendChild(boardMetaTime);boardMeta.appendChild(boardRefresh);block.appendChild(header);if(metric==="users"){block.appendChild(el("p","trending-user-ranking-note","Shows users whose User rankings setting is Public and who have earned XP. This is not a count of registered accounts."));}
if(isMilestoneMetric(metric)){const note=metric==="spenders"?"EOR Bits spent in the selected period, including gifts sent. Received gifts and credits do not count; refunds do not remove the original spending.":"Different concepts currently Mastered (self-assessed), with a rating in the selected period. Repeated ratings count once; clearing or lowering a rating removes that concept. All time includes all currently Mastered concepts.";block.appendChild(el("p","trending-user-ranking-note",`${note} Today uses UTC; week and month cover the last 7 and 30 calendar days. Only users with User rankings set to Public appear. Updates after cloud sync.`));}
if(colHeadEl)block.appendChild(colHeadEl);block.appendChild(list);block.appendChild(footer);block.appendChild(boardMeta);const state={metric,period:initialPeriod,offset:0,total:0,};const periodCache=new Map();let loadToken=0;function formatBoardTime(ts){const d=new Date(Number(ts)||Date.now());const pad=(n)=>String(n).padStart(2,"0");return`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;}
function updateBoardMeta(fetchedAt,opts){if(!boardMetaTime)return;const o=opts||{};if(o.loading){boardMetaTime.textContent="Updating…";return;}
if(o.refreshFailed&&!fetchedAt){boardMetaTime.textContent="Cloud refresh failed";return;}
if(!fetchedAt){boardMetaTime.textContent="";return;}
if(o.refreshFailed){boardMetaTime.textContent=`Saved ${formatBoardTime(fetchedAt)} · cloud refresh failed`;return;}
if(o.stale){boardMetaTime.textContent=`Saved ${formatBoardTime(fetchedAt)}`;return;}
boardMetaTime.textContent=`Updated ${formatBoardTime(fetchedAt)}${o.cached ? " (cached)" : ""}`;}
function updateMetaHead(){if(metaHeadEl)metaHeadEl.textContent=periodMetricLabel(state.period,metric);if(colHeadEl){const right=colHeadEl.querySelector(".trending-colhead-right");if(right)right.textContent=periodMetricLabel(state.period,metric);}}
function setActiveTab(){tabs.querySelectorAll(".trending-tab").forEach((btn)=>{btn.classList.toggle("is-active",btn.dataset.period===state.period);btn.setAttribute("aria-pressed",btn.dataset.period===state.period?"true":"false");});updateMetaHead();}
let __allTimeValidPromise=null;async function loadAllTimeValidItems(options){if(options&&options.forceFresh)__allTimeValidPromise=null;if(__allTimeValidPromise)return __allTimeValidPromise;const pending=(async()=>{const validSet=isTrendingUserMetric(metric)?null:await loadValidPathSetOnce().catch(()=>null);const out=[];const seen=new Set();const result={items:out,fetchedAt:0,status:!isTrendingUserMetric(metric)&&!validSet?{refreshFailed:true}:{}};const CHUNK=isMilestoneMetric(metric)?ALL_TIME_CAP:50;let offset=0;let total=Infinity;let guard=0;while(offset<total&&guard<200){guard++;const r=await fetchHot({metric,period:"all",limit:CHUNK,offset}).catch(()=>({items:[],total:0,refreshFailed:true,stale:true,}));if(r.refreshFailed||r.stale||r.cached){for(const key of["refreshFailed","stale","cached"])if(r[key])result.status[key]=true;}
result.fetchedAt=Math.max(result.fetchedAt,Number(r.fetchedAt||r.cachedAt||0)||0);const chunk=Array.isArray(r.items)?r.items:[];if(typeof r.total==="number"&&r.total>0)total=r.total;if(!chunk.length)break;for(const it of chunk){const p=isTrendingUserMetric(metric)?String((it&&(it.accountKey||it.name||it.path))||""):safePath(it&&it.path);if(!p)continue;if(!isTrendingUserMetric(metric)){if(isUtilityPath(p))continue;if(!isExistingPagePath(p,validSet))continue;}
if(seen.has(p))continue;seen.add(p);out.push(it);if(out.length>=ALL_TIME_CAP)return result;}
offset+=chunk.length;}
return result;})();__allTimeValidPromise=pending;pending.then((result)=>{if((result.status.refreshFailed||result.status.stale)&&__allTimeValidPromise===pending)__allTimeValidPromise=null;},()=>{if(__allTimeValidPromise===pending)__allTimeValidPromise=null;});return pending;}
async function load(options){const token=++loadToken;const period=state.period;const loadOptions=options&&typeof options==="object"?options:{};const forceFresh=!!loadOptions.forceFresh;const periodConfig=PERIODS.find((x)=>x.key===period)||PERIODS[1];const limit=periodConfig.limit;const cachedCandidate=periodCache.get(period)||null;const cached=rankingMemoryCacheUsable(metric,cachedCandidate,Date.now())?cachedCandidate:null;if(cachedCandidate&&!cached){periodCache.delete(period);if(period==="all")__allTimeValidPromise=null;}
const willFetch=forceFresh||!cached;list.classList.add("is-loading");if(willFetch){list.innerHTML="";list.appendChild(el("li","trending-loading","Loading..."));updateBoardMeta(0,{loading:true});}
let items=[];let fetchedAt=cached?cached.fetchedAt:0;const usedCache=!!cached&&!forceFresh;let fetchStatus=cached&&cached.status?cached.status:{};if(period==="all"){let allItems;if(cached&&!forceFresh){allItems=Array.isArray(cached.allItems)?cached.allItems:[];}else{const result=await loadAllTimeValidItems({forceFresh}).catch(()=>({items:[],status:{refreshFailed:true,stale:true},fetchedAt:0}));if(token!==loadToken)return;allItems=result.items;fetchStatus=result.status;fetchedAt=result.fetchedAt;const cleanAllItems=Array.isArray(allItems)?allItems:[];if(!fetchedAt&&!(fetchStatus&&fetchStatus.refreshFailed&&!cleanAllItems.length))fetchedAt=Date.now();if(!fetchStatus.refreshFailed&&!fetchStatus.stale){periodCache.set(period,{fetchedAt,allItems:cleanAllItems,status:fetchStatus});}else periodCache.delete(period);}
const patchedAllItems=dedupeUserRankingItems(metric==="users"?patchCurrentUserRankingItems(Array.isArray(allItems)?allItems:[],period,{preferLocalOwnScore:!!(fetchStatus&&(fetchStatus.refreshFailed||fetchStatus.stale))}):(Array.isArray(allItems)?allItems:[])).slice(0,ALL_TIME_CAP);state.total=Math.min(ALL_TIME_CAP,patchedAllItems.length);if(state.offset>=state.total)state.offset=Math.max(0,Math.floor((state.total-1)/limit)*limit);items=patchedAllItems.slice(state.offset,state.offset+limit);}else{let rawItems;if(cached&&!forceFresh){rawItems=Array.isArray(cached.rawItems)?cached.rawItems:[];}else{const oversample=Math.max(limit,60);let fetchOk=true;const r=await fetchHot({metric,period,limit:oversample,offset:0,}).catch(()=>{fetchOk=false;return{items:[],total:0,refreshFailed:true,stale:true};});if(token!==loadToken)return;rawItems=Array.isArray(r.items)?r.items:[];fetchStatus={refreshFailed:!!(r&&r.refreshFailed),stale:!!(r&&r.stale),cached:!!(r&&r.cached)};fetchedAt=Number(r&&(r.fetchedAt||r.cachedAt)||0)||0;if(!fetchedAt&&!(fetchStatus.refreshFailed&&!rawItems.length))fetchedAt=Date.now();if(fetchOk&&!fetchStatus.refreshFailed&&!fetchStatus.stale)periodCache.set(period,{fetchedAt,rawItems,status:fetchStatus});else periodCache.delete(period);}
const validSet=isTrendingUserMetric(metric)?null:await loadValidPathSetOnce().catch(()=>null);if(token!==loadToken)return;items=dedupeUserRankingItems(metric==="users"?patchCurrentUserRankingItems(rawItems,period,{preferLocalOwnScore:!!(fetchStatus&&(fetchStatus.refreshFailed||fetchStatus.stale))}):rawItems).filter((it)=>{if(isTrendingUserMetric(metric))return!!(it&&(it.name||it.title||it.username||it.displayName));const p=safePath(it&&it.path);if(!p)return false;if(isUtilityPath(p))return false;if(!isExistingPagePath(p,validSet))return false;return true;}).slice(0,limit);state.total=items.length;state.offset=0;}
const[lectureMap,titleMap]=items.length&&!isTrendingUserMetric(metric)?await Promise.all([loadLectureMapOnce().catch(()=>null),loadTitleMapOnce().catch(()=>null),]):[null,null];if(token!==loadToken)return;list.innerHTML="";if(!items.length){list.appendChild(el("li","trending-empty",fetchStatus&&fetchStatus.refreshFailed?"Could not refresh ranking":"No data yet"));}else{items.forEach((it,idx)=>{const li=el("li",isTrendingUserMetric(metric)?"trending-item trending-user-item":"trending-item");if(isTrendingUserMetric(metric)){const fx=String((it&&(it.rankingEffect||(it.equippedCosmetics&&it.equippedCosmetics.ranking_effect)))||"").trim();if(fx)li.setAttribute("data-ranking-effect",fx);try{const me=readTrendingLocalProfile();const meKey=String(me.accountKey||"").trim().toLowerCase();if(meKey&&String(it&&(it.accountKey||it.account_key||"")||"").trim().toLowerCase()===meKey){li.classList.add("mk-trending-current-user");li.setAttribute("data-current-user","true");}}catch(_){}}
const rank=el("span","trending-rank",String(state.offset+idx+1));li.appendChild(rank);if(isTrendingUserMetric(metric)){const name=userDisplayName(it);const level=userLevel(it);const totalXp=userTotalXp(it);const intro=userIntroText(it);const levelPct=formatTrendingPctStyle(userLevelProgressPct(it,totalXp,level));const profile=el("div","trending-user-profile");profile.innerHTML=`${trendingUserAvatarHtml(it, name)}<div class="trending-user-main"><div class="trending-user-name-row"><a href="#" class="trending-user-name">${escapeTrendingHtml(name)}</a><span class="trending-user-level" title="${escapeTrendingHtml(levelPct)}% complete in this level"><span class="trending-user-level-fill" style="width:${levelPct}%"></span><strong>Lv. ${escapeTrendingHtml(level)}</strong></span><span class="trending-user-total-xp" title="Total experience">Total XP ${escapeTrendingHtml(formatTrendingXp(totalXp))}</span></div><div class="trending-user-intro${intro ? "" : " is-empty"}">${escapeTrendingHtml(intro || (it.profileIntroVisibility === "private" ? "Profile intro is private." : "No public profile intro."))}</div></div>`;const open=(ev)=>{ev.preventDefault();const oldError=profile.querySelector(".trending-profile-error");if(oldError)oldError.remove();openTrendingPublicProfile(it,nameLink);};const nameLink=profile.querySelector(".trending-user-name");if(nameLink)nameLink.addEventListener("click",open);profile.addEventListener("dblclick",open);li.appendChild(profile);const meta=el("span",metric==="quiz_correct"?"trending-user-period-xp trending-quiz-correct-score":"trending-user-period-xp");if(metric==="quiz_correct"){meta.innerHTML=`${escapeTrendingHtml(formatQuizCorrectMetric(it))}<span class="trending-quiz-wrong">${escapeTrendingHtml(formatQuizWrongMetric(it))}</span>`;}else if(isMilestoneMetric(metric)){meta.textContent=metricValue(it,metric);}else{meta.textContent=formatTrendingXp(userPeriodXp(it));}
li.appendChild(meta);list.appendChild(li);return;}
const a=el("a","trending-link");a.href=new URL(it.path,document.baseURI).toString();a.innerHTML=titleToHtml(displayTitle(it,titleMap));li.appendChild(a);const courseSpan=el("span","trending-course",displayCourseLecture(it,lectureMap));li.appendChild(courseSpan);const meta=el("span","trending-meta",metricValue(it,metric));li.appendChild(meta);list.appendChild(li);});}
if(state.period==="all"){footer.style.display="flex";const totalPages=Math.max(1,Math.ceil(state.total/limit));const currentPage=Math.floor(state.offset/limit)+1;prev.disabled=currentPage<=1;next.disabled=currentPage>=totalPages;pages.innerHTML="";const btns=buildAllTimePages(totalPages,currentPage);btns.forEach((p)=>{if(p==="…"){const dot=el("span","trending-ellipsis","…");pages.appendChild(dot);return;}
const b=el("button","trending-page-num",String(p));b.type="button";b.dataset.page=String(p);if(p===currentPage)b.classList.add("is-active");pages.appendChild(b);});}else{footer.style.display="none";pages.innerHTML="";}
updateBoardMeta(fetchedAt,Object.assign({cached:usedCache},fetchStatus||{}));list.classList.remove("is-loading");if(window.MathJax&&typeof window.MathJax.typesetPromise==="function"){window.MathJax.typesetPromise([list]).catch(()=>{});}}
tabs.addEventListener("click",(e)=>{const btn=e.target&&e.target.closest(".trending-tab");if(!btn)return;state.period=btn.dataset.period;state.offset=0;setActiveTab();emitSortFilterUsed("filter",{value:state.period,period:state.period,controlKey:`trending-period:${state.period}`,triggerText:btn.textContent||state.period});updateMetaHead();load({forceFresh:isTrendingUserMetric(metric)});});prev.addEventListener("click",()=>{const limit=(PERIODS.find((x)=>x.key===state.period)||PERIODS[1]).limit;state.offset=Math.max(0,state.offset-limit);load();});next.addEventListener("click",()=>{const limit=(PERIODS.find((x)=>x.key===state.period)||PERIODS[1]).limit;state.offset=state.offset+limit;load();});pages.addEventListener("click",(e)=>{const btn=e.target&&e.target.closest(".trending-page-num");if(!btn)return;const p=Number(btn.dataset.page||"1");const limit=(PERIODS.find((x)=>x.key===state.period)||PERIODS[1]).limit;state.offset=(p-1)*limit;load();});boardRefresh.addEventListener("click",()=>{boardRefresh.classList.add("is-busy");Promise.resolve(load({forceFresh:true})).finally(()=>boardRefresh.classList.remove("is-busy"));});block.__mkTrendingReload=function reloadTrendingBlock(options){return load(Object.assign({},options||{}));};block.__mkTrendingResetCache=function resetTrendingBlockCache(){__allTimeValidPromise=null;periodCache.clear();};setActiveTab();if(!deferInitialLoad)load();return block;}
const HOT_BADGE_TOP_LIMIT=10;const HOT_BADGE_ALL_CAP=100;const HOT_BADGE_PERIODS=[{key:"7d",label:"Top 10 This week",viewsLabel:"weekly views",limit:10},{key:"30d",label:"Top 10 This month",viewsLabel:"monthly views",limit:10},{key:"all",label:"Top 100 All time",viewsLabel:"total views",limit:100},];const __hotBadgeState={listsPromise:null,currentKey:"",currentRanks:[],popover:null,activeAnchor:null,hideTimer:0,observer:null,retryTimers:[],};function normaliseHotPathKey(pathLike){let p=safePath(pathLike).toLowerCase();try{p=decodeURIComponent(p);}catch(_){}
p=p.split("?")[0].split("#")[0].replace(/\\/g,"/").replace(/\/+/g,"/");p=p.replace(/\/index\.html$/i,"");p=p.replace(/\.html$/i,"");p=p.replace(/\/+$/g,"");return p;}
function relPathFromSiteRoot(absPathname){let p=String(absPathname||window.location.pathname||"");try{const root=new URL(getSiteRootUrl());const rootPath=root.pathname.endsWith("/")?root.pathname:root.pathname+"/";if(p.startsWith(rootPath))p=p.slice(rootPath.length);}catch(_){}
return p.replace(/^\/+/,"").replace(/\/+$/,"");}
function currentHotPathKeys(){const out=new Set();const push=(x)=>{const k=normaliseHotPathKey(x);if(k)out.add(k);};push(relPathFromSiteRoot(window.location.pathname||""));push(window.location.pathname||"");try{const canonical=document.querySelector('link[rel="canonical"]');if(canonical&&canonical.href){const u=new URL(canonical.href,document.baseURI);push(relPathFromSiteRoot(u.pathname||""));push(u.pathname||"");}}catch(_){}
return out;}
function isConceptPageForHotBadge(){const rel=relPathFromSiteRoot(window.location.pathname||"").toLowerCase();if(!rel)return false;const base=(rel.split("/").pop()||"").replace(/\.html$/i,"");if(!base)return false;if(["index","about","find","random","custom-random","trending","contributors","search","tags"].includes(base))return false;const segs=rel.split("/").filter(Boolean);return segs.length>=3;}
function hotIconSvg(size){const s=Number(size)||20;return`<svg class="mk-trending-hot-svg" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2.5c1.25 3.25.35 5.48-2.6 8.1"></path>
      <path d="M9.4 10.6C7.58 8.3 7.25 6.2 7.35 4.45C5.35 6.55 3.6 10.05 3.6 14.05C3.6 18.65 7.28 22 12 22s8.4-3.35 8.4-7.95c0-3.52-1.82-6.7-4.78-8.95c.55 2.78-.2 5.02-2.15 6.68"></path>
      <path d="M12.02 21.55c-1.95-1.25-2.9-3.05-2.55-5.05c.26-1.45 1.25-2.45 2.05-3.56c.82 1.22 2.22 2.16 2.58 3.76c.45 1.94-.42 3.75-2.08 4.85"></path>
    </svg>`;}
function escapeHtmlHot(s){return String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function trendingPageHref(){try{return new URL("trending.html",getSiteRootUrl()).toString();}
catch(_){return"trending.html";}}
function rankTitle(ranks){if(!Array.isArray(ranks)||!ranks.length)return"Trending concept";const labels=ranks.map((r)=>`${r.label} #${r.rank}`).join("; ");return`Trending concept: ${labels}`;}
async function loadHotBadgePeriodItems(periodCfg){const validSet=await loadValidPathSetOnce().catch(()=>null);if(periodCfg.key==="all"){const out=[];const seen=new Set();const CHUNK=50;let offset=0;let total=Infinity;let guard=0;while(offset<total&&out.length<HOT_BADGE_ALL_CAP&&guard<10){guard++;const r=await fetchHot({metric:"views",period:"all",limit:CHUNK,offset}).catch(()=>({items:[],total:0}));const chunk=Array.isArray(r.items)?r.items:[];if(typeof r.total==="number"&&r.total>0)total=r.total;if(!chunk.length)break;for(const it of chunk){const p=safePath(it&&it.path);const key=normaliseHotPathKey(p);if(!p||!key)continue;if(isUtilityPath(p))continue;if(!isExistingPagePath(p,validSet))continue;if(seen.has(key))continue;seen.add(key);out.push(it);if(out.length>=HOT_BADGE_ALL_CAP)break;}
offset+=chunk.length;}
return out;}
const oversample=Math.max(periodCfg.limit||HOT_BADGE_TOP_LIMIT,60);const r=await fetchHot({metric:"views",period:periodCfg.key,limit:oversample,offset:0}).catch(()=>({items:[],total:0}));const seen=new Set();const out=[];for(const it of(Array.isArray(r.items)?r.items:[])){const p=safePath(it&&it.path);const key=normaliseHotPathKey(p);if(!p||!key)continue;if(isUtilityPath(p))continue;if(!isExistingPagePath(p,validSet))continue;if(seen.has(key))continue;seen.add(key);out.push(it);if(out.length>=(periodCfg.limit||HOT_BADGE_TOP_LIMIT))break;}
return out;}
function loadHotBadgeListsOnce(){if(__hotBadgeState.listsPromise)return __hotBadgeState.listsPromise;__hotBadgeState.listsPromise=(async()=>{const entries=await Promise.all(HOT_BADGE_PERIODS.map(async(cfg)=>{const items=await loadHotBadgePeriodItems(cfg).catch(()=>[]);return[cfg.key,{cfg,items}];}));return new Map(entries);})();return __hotBadgeState.listsPromise;}
function findHotRanksForCurrentPage(lists){const currentKeys=currentHotPathKeys();const ranks=[];for(const cfg of HOT_BADGE_PERIODS){const entry=lists&&lists.get?lists.get(cfg.key):null;const items=entry&&Array.isArray(entry.items)?entry.items:[];for(let i=0;i<items.length;i++){const itemKey=normaliseHotPathKey(items[i]&&items[i].path);if(!itemKey||!currentKeys.has(itemKey))continue;ranks.push({period:cfg.key,label:cfg.label,rank:i+1,count:Number(items[i]&&items[i].count)||0,viewsLabel:cfg.viewsLabel,});break;}}
return ranks;}
function ensureHotPopover(){let pop=__hotBadgeState.popover;if(pop&&pop.isConnected)return pop;pop=document.createElement("div");pop.className="mk-trending-hot-popover";pop.setAttribute("role","tooltip");pop.hidden=true;document.body.appendChild(pop);__hotBadgeState.popover=pop;return pop;}
function popoverHtml(ranks,opts){const mobileMenu=!!(opts&&opts.mobileMenu);const rows=(Array.isArray(ranks)?ranks:[]).map((r)=>`
      <div class="mk-trending-hot-row">
        <span class="mk-trending-hot-label">${escapeHtmlHot(r.label)}</span>
        <span class="mk-trending-hot-meta">#${escapeHtmlHot(r.rank)} · ${escapeHtmlHot(r.count)} ${escapeHtmlHot(r.viewsLabel)}</span>
      </div>
    `).join("");const openLink=mobileMenu?`<a class="mk-trending-hot-open" href="${escapeHtmlHot(trendingPageHref())}">Open Trending page</a>`:`<div class="mk-trending-hot-hint">Click to open the Trending page.</div>`;return`
      <div class="mk-trending-hot-title">${hotIconSvg(15)}<span>Trending concept</span></div>
      ${rows}
      ${openLink}
    `;}
function positionHotPopover(anchor,pop){if(!anchor||!pop||pop.hidden)return;const r=anchor.getBoundingClientRect();const vw=Math.max(0,window.innerWidth||document.documentElement.clientWidth||0);const vh=Math.max(0,window.innerHeight||document.documentElement.clientHeight||0);pop.style.left="0px";pop.style.top="0px";const pr=pop.getBoundingClientRect();const gap=10;const pad=12;let left=r.left+r.width/2-pr.width/2;left=Math.max(pad,Math.min(left,vw-pr.width-pad));let top=r.bottom+gap;if(top+pr.height+pad>vh)top=Math.max(pad,r.top-pr.height-gap);pop.style.left=`${Math.round(left)}px`;pop.style.top=`${Math.round(top)}px`;}
function hotUsesTapMenu(){try{return!!(window.matchMedia&&window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches);}catch(_){return false;}}
function showHotPopover(anchor){if(!anchor||hotUsesTapMenu())return;if(__hotBadgeState.hideTimer){clearTimeout(__hotBadgeState.hideTimer);__hotBadgeState.hideTimer=0;}
const ranks=anchor.__mkTrendingRanks||__hotBadgeState.currentRanks||[];if(!ranks.length)return;const pop=ensureHotPopover();pop.classList.remove("is-mobile-menu");pop.innerHTML=popoverHtml(ranks);pop.hidden=false;__hotBadgeState.activeAnchor=anchor;positionHotPopover(anchor,pop);requestAnimationFrame(()=>pop.classList.add("is-visible"));}
function showHotTapMenu(anchor){if(!anchor)return;if(__hotBadgeState.hideTimer){clearTimeout(__hotBadgeState.hideTimer);__hotBadgeState.hideTimer=0;}
const ranks=anchor.__mkTrendingRanks||__hotBadgeState.currentRanks||[];if(!ranks.length)return;const pop=ensureHotPopover();pop.classList.add("is-mobile-menu");pop.setAttribute("role","menu");pop.innerHTML=popoverHtml(ranks,{mobileMenu:true});pop.hidden=false;__hotBadgeState.activeAnchor=anchor;anchor.setAttribute("aria-expanded","true");positionHotPopover(anchor,pop);requestAnimationFrame(()=>pop.classList.add("is-visible"));}
function hideHotTapMenu(){const pop=__hotBadgeState.popover;const anchor=__hotBadgeState.activeAnchor;if(anchor&&anchor.classList&&anchor.classList.contains("mk-trending-h1-hot")){try{anchor.setAttribute("aria-expanded","false");}catch(_){}}
if(!pop)return;pop.classList.remove("is-visible","is-mobile-menu");window.setTimeout(()=>{if(!pop.classList.contains("is-visible")){pop.hidden=true;try{pop.setAttribute("role","tooltip");}catch(_){}}},130);__hotBadgeState.activeAnchor=null;}
function toggleHotTapMenu(anchor){const pop=__hotBadgeState.popover;if(pop&&!pop.hidden&&pop.classList.contains("is-mobile-menu")&&__hotBadgeState.activeAnchor===anchor){hideHotTapMenu();return;}
showHotTapMenu(anchor);}
function hideHotPopoverSoon(){if(__hotBadgeState.hideTimer)clearTimeout(__hotBadgeState.hideTimer);__hotBadgeState.hideTimer=window.setTimeout(()=>{const pop=__hotBadgeState.popover;if(!pop)return;pop.classList.remove("is-visible","is-mobile-menu");window.setTimeout(()=>{if(!pop.classList.contains("is-visible"))pop.hidden=true;},130);__hotBadgeState.activeAnchor=null;},70);}
function installHotPopoverGlobalHandlersOnce(){if(window.__mkTrendingHotPopoverHandlersV2)return;window.__mkTrendingHotPopoverHandlersV2=true;const reposition=()=>{const pop=__hotBadgeState.popover;const anchor=__hotBadgeState.activeAnchor;if(pop&&anchor&&!pop.hidden)positionHotPopover(anchor,pop);};window.addEventListener("scroll",reposition,{passive:true,capture:true});window.addEventListener("resize",reposition,{passive:true});document.addEventListener("click",(ev)=>{const pop=__hotBadgeState.popover;if(!pop||pop.hidden||!pop.classList.contains("is-mobile-menu"))return;const target=ev&&ev.target;if(target&&target.closest&&(target.closest(".mk-trending-hot-popover")||target.closest(".mk-trending-h1-hot")))return;hideHotTapMenu();},true);document.addEventListener("keydown",(ev)=>{if(!ev||ev.key!=="Escape")return;const pop=__hotBadgeState.popover;if(pop&&!pop.hidden&&pop.classList.contains("is-mobile-menu"))hideHotTapMenu();},true);}
function buildHotBadge(ranks){const a=document.createElement("a");a.className="mk-trending-h1-hot";a.href=trendingPageHref();a.setAttribute("aria-label",rankTitle(ranks));a.setAttribute("aria-haspopup","menu");a.setAttribute("aria-expanded","false");a.title=rankTitle(ranks);a.innerHTML=`${hotIconSvg(24)}<span class="mk-trending-sr">Trending concept</span>`;a.__mkTrendingRanks=ranks;a.addEventListener("mouseenter",()=>showHotPopover(a));a.addEventListener("mouseleave",hideHotPopoverSoon);a.addEventListener("focus",()=>showHotPopover(a));a.addEventListener("blur",()=>{if(!hotUsesTapMenu())hideHotPopoverSoon();});a.addEventListener("click",(ev)=>{if(!hotUsesTapMenu())return;try{ev.preventDefault();ev.stopPropagation();}catch(_){}
toggleHotTapMenu(a);});return a;}
function findH1ForHotBadge(){const inner=document.querySelector("article.md-content__inner");return inner?inner.querySelector("h1"):document.querySelector(".md-content h1, h1");}
function clearHotBadgeInlineInteractiveFrame(badge){if(!badge||!badge.style)return;["background","background-color","background-image","border-color","border-top-color","border-right-color","border-bottom-color","border-left-color","box-shadow","opacity"].forEach((prop)=>{try{badge.style.removeProperty(prop);}catch(_){}});}
function syncHotBadgeFrameFromSibling(badge,h1){if(!badge||!h1||!window.getComputedStyle)return;try{clearHotBadgeInlineInteractiveFrame(badge);const ref=h1.querySelector(":scope > .mw-h1-manage, :scope > .mw-title-badge");if(!ref||ref===badge)return;const cs=window.getComputedStyle(ref);if(!cs)return;const cssName=(prop)=>String(prop||"").replace(/[A-Z]/g,(m)=>"-"+m.toLowerCase());const setImportant=(prop,value)=>{const v=String(value||"").trim();if(!v)return;badge.style.setProperty(cssName(prop),v,"important");};const copy=["width","height","minWidth","minHeight","maxWidth","maxHeight","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","borderTopStyle","borderRightStyle","borderBottomStyle","borderLeftStyle","borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius","paddingTop","paddingRight","paddingBottom","paddingLeft","marginTop","marginRight","marginBottom","marginLeft"];copy.forEach((prop)=>setImportant(prop,cs[prop]));let refInteractive=false;try{refInteractive=!!(ref.matches&&ref.matches(":hover, :focus, :focus-visible, :active"));}catch(_){}
if(!refInteractive){const borderColor=String(cs.borderTopColor||cs.borderRightColor||cs.borderBottomColor||cs.borderLeftColor||"").trim();if(borderColor)badge.style.setProperty("--mk-trending-hot-border",borderColor);const bg=String(cs.backgroundColor||"").trim();if(bg)badge.style.setProperty("--mk-trending-hot-bg",bg);const shadow=String(cs.boxShadow||"").trim();if(shadow)badge.style.setProperty("--mk-trending-hot-shadow",shadow==="none"?"none":shadow);const opacity=String(cs.opacity||"").trim();if(opacity)badge.style.setProperty("--mk-trending-hot-opacity",opacity);}
badge.style.setProperty("--mk-trending-hot-hover-border","var(--md-accent-fg-color)");badge.style.setProperty("--mk-trending-hot-hover-bg","rgba(99,102,241,.10)");badge.style.setProperty("--mk-trending-hot-hover-shadow","none");badge.style.setProperty("--mk-trending-hot-hover-opacity","1");setImportant("display","flex");setImportant("alignItems","center");setImportant("justifyContent","center");setImportant("lineHeight","0");setImportant("boxSizing","border-box");setImportant("textDecoration","none");setImportant("backgroundImage","none");}catch(_){}}
function scheduleHotBadgeFrameSync(badge,h1){if(!badge||!h1)return;[0,60,180,420,900,1600].forEach((delay)=>{try{window.setTimeout(()=>syncHotBadgeFrameFromSibling(badge,h1),delay);}catch(_){}});}
function placeHotBadge(h1,badge){if(!h1||!badge)return;const left=h1.querySelector(":scope > .lp-h1-left");if(left){const targetParent=h1;if(badge.parentNode!==targetParent||badge.previousSibling!==left){if(left.nextSibling)targetParent.insertBefore(badge,left.nextSibling);else targetParent.appendChild(badge);}
syncHotBadgeFrameFromSibling(badge,h1);scheduleHotBadgeFrameSync(badge,h1);return;}
if(badge.parentNode!==h1)h1.appendChild(badge);syncHotBadgeFrameFromSibling(badge,h1);scheduleHotBadgeFrameSync(badge,h1);}
function clearHotBadge(){document.querySelectorAll(".mk-trending-h1-hot").forEach((node)=>{try{node.remove();}catch(_){}});const pop=__hotBadgeState.popover;if(pop){pop.classList.remove("is-visible");pop.hidden=true;}
__hotBadgeState.currentRanks=[];}
function renderHotBadge(ranks){if(!Array.isArray(ranks)||!ranks.length){clearHotBadge();return;}
ensureStylesOnce();installHotPopoverGlobalHandlersOnce();const h1=findH1ForHotBadge();if(!h1)return;const all=Array.from(document.querySelectorAll(".mk-trending-h1-hot"));let badge=all[0]||null;all.slice(1).forEach((node)=>{try{node.remove();}catch(_){}});if(!badge)badge=buildHotBadge(ranks);clearHotBadgeInlineInteractiveFrame(badge);badge.__mkTrendingRanks=ranks;badge.setAttribute("aria-label",rankTitle(ranks));badge.setAttribute("aria-haspopup","menu");badge.setAttribute("aria-expanded","false");badge.title=rankTitle(ranks);placeHotBadge(h1,badge);}
function scheduleHotBadgeReposition(ranks){__hotBadgeState.retryTimers.forEach((id)=>{try{clearTimeout(id);}catch(_){}});__hotBadgeState.retryTimers=[];[80,220,520,1000,1800].forEach((delay)=>{const id=window.setTimeout(()=>renderHotBadge(ranks),delay);__hotBadgeState.retryTimers.push(id);});try{if(__hotBadgeState.observer)__hotBadgeState.observer.disconnect();const h1=findH1ForHotBadge();if(!h1||!window.MutationObserver)return;let raf=0;__hotBadgeState.observer=new MutationObserver(()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;renderHotBadge(__hotBadgeState.currentRanks||ranks);});});__hotBadgeState.observer.observe(h1,{childList:true,subtree:true});}catch(_){}}
async function mountHotBadge(){if(!ENABLE_H1_HOT_BADGE){clearHotBadge();return;}
if(isTrendingPage()||!isConceptPageForHotBadge()){clearHotBadge();return;}
const currentKey=Array.from(currentHotPathKeys()).join("|");if(__hotBadgeState.currentKey===currentKey&&Array.isArray(__hotBadgeState.currentRanks)){renderHotBadge(__hotBadgeState.currentRanks);scheduleHotBadgeReposition(__hotBadgeState.currentRanks);return;}
__hotBadgeState.currentKey=currentKey;const lists=await loadHotBadgeListsOnce().catch(()=>null);const ranks=findHotRanksForCurrentPage(lists);__hotBadgeState.currentRanks=ranks;renderHotBadge(ranks);if(ranks.length)scheduleHotBadgeReposition(ranks);}
function syncRankingsPageTitle(){try{const h1=document.querySelector("article.md-content__inner h1, .md-content h1, h1");if(h1&&String(h1.textContent||"").trim().toLowerCase()==="trending")h1.textContent="Rankings";ensureRankingsQuickShopButton(h1);if(document.title)document.title=document.title.replace(/^Trending\b/i,"Rankings");}catch(_){}}
function rankingsQuickShopIconSvg(){return'<span class="mk-exact-clothes-icon" aria-hidden="true" focusable="false" style="display:inline-block;width:18px;height:18px;background:currentColor;-webkit-mask:url(data:image/png;base64,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) center/contain no-repeat;mask:url(data:image/png;base64,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) center/contain no-repeat;"></span>';}
function openRankingsQuickShop(anchor){try{if(window.MkLocalActivity&&typeof window.MkLocalActivity.openQuickShop==="function"){window.MkLocalActivity.openQuickShop(anchor,{categories:["Ranking effects"],title:"Ranking effects"});}else{window.dispatchEvent(new CustomEvent("mk-open-quick-shop",{detail:{anchor,categories:["Ranking effects"],title:"Ranking effects"}}));}}catch(_){}}
function ensureRankingsQuickShopButton(h1){if(!h1)return;let btn=h1.querySelector(":scope > .mk-rankings-quick-shop-btn");if(!btn){btn=document.createElement("button");btn.type="button";btn.className="mk-quick-shop-h1-btn mk-rankings-quick-shop-btn";btn.setAttribute("aria-label","Ranking effects");btn.setAttribute("title","Ranking effects");btn.innerHTML=rankingsQuickShopIconSvg();btn.addEventListener("click",(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}
openRankingsQuickShop(btn);});h1.appendChild(btn);}
try{h1.classList.add("mk-h1-has-quick-shop");}catch(_){}}
function refreshMountedTrendingHost(host,reason){try{if(!host||host.dataset.mounted!=="1")return;const nowTs=Date.now();const last=Number(host.dataset.lastFreshRankingsReload||0)||0;if(nowTs-last<1200)return;host.dataset.lastFreshRankingsReload=String(nowTs);const active=host.querySelector(".trending-block.is-active");const targets=active?[active]:Array.from(host.querySelectorAll(".trending-block"));targets.forEach((block)=>{if(block&&typeof block.__mkTrendingReload==="function")block.__mkTrendingReload({forceFresh:true,reason:reason||"page-open"});});}catch(_){}}
function mount(){if(!isTrendingPage())return;ensureStylesOnce();syncRankingsPageTitle();document.body.classList.add("trending-page");const host=document.getElementById("trending-app");if(!host)return;if(host.dataset.mounted==="1"){refreshMountedTrendingHost(host,"page-open");return;}
host.dataset.mounted="1";const shell=el("div","trending-unified");const metricSwitch=el("div","trending-metric-switch");metricSwitch.setAttribute("role","tablist");metricSwitch.setAttribute("aria-label","Concept and user rankings");const metricRows=new Map();for(const kind of["concept","user"]){if(kind==="user"&&!accountFeatureEnabled())continue;const group=el("div","trending-metric-group");group.dataset.kind=kind;group.setAttribute("role","presentation");const row=el("div","trending-metric-row");row.setAttribute("role","presentation");group.appendChild(row);metricSwitch.appendChild(group);metricRows.set(kind,row);}
const wrap=el("div","trending-grid");const blocks=new Map();const initialMetric=readInitialTrendingMetric();visibleTrendingMetrics().forEach((cfg)=>{const btn=el("button","trending-metric-btn",cfg.title);btn.type="button";btn.dataset.metric=cfg.key;btn.setAttribute("role","tab");btn.setAttribute("aria-controls",`trending-panel-${cfg.key}`);metricRows.get(isTrendingUserMetric(cfg.key)?"user":"concept").appendChild(btn);const block=buildBlock({title:cfg.title,metric:cfg.key,deferInitialLoad:cfg.key!==initialMetric});block.id=`trending-panel-${cfg.key}`;block.setAttribute("role","tabpanel");blocks.set(cfg.key,block);wrap.appendChild(block);});function activateMetric(metric,options){const key=normaliseTrendingMetric(metric);host.dataset.metric=key;metricSwitch.querySelectorAll(".trending-metric-btn").forEach((btn)=>{const active=btn.dataset.metric===key;btn.classList.toggle("is-active",active);btn.setAttribute("aria-selected",active?"true":"false");btn.tabIndex=active?0:-1;if(active){const group=btn.closest(".trending-metric-group");if(group&&group.clientWidth>0){const bounds=group.getBoundingClientRect();const buttonBounds=btn.getBoundingClientRect();if(buttonBounds.left<bounds.left)group.scrollLeft-=bounds.left-buttonBounds.left;else if(buttonBounds.right>bounds.right)group.scrollLeft+=buttonBounds.right-bounds.right;}}});blocks.forEach((block,blockKey)=>{const active=blockKey===key;block.hidden=!active;block.classList.toggle("is-active",active);if(active&&!(options&&options.skipReload)&&typeof block.__mkTrendingReload==="function"){window.setTimeout(()=>block.__mkTrendingReload({reason:"metric-activated"}),0);}});if(!(options&&options.skipUrl))writeTrendingMetricToUrl(key);}
metricSwitch.addEventListener("click",(ev)=>{const btn=ev.target&&ev.target.closest?ev.target.closest(".trending-metric-btn"):null;if(!btn)return;const metric=btn.dataset.metric||"views";activateMetric(metric);emitSortFilterUsed("sort",{value:metric,metric,controlKey:`trending-metric:${metric}`,triggerText:btn.textContent||metric});});metricSwitch.addEventListener("keydown",(ev)=>{if(!ev||!["ArrowLeft","ArrowRight","Home","End"].includes(ev.key))return;const buttons=Array.from(metricSwitch.querySelectorAll(".trending-metric-btn"));if(!buttons.length)return;const cur=Math.max(0,buttons.findIndex((btn)=>btn.classList.contains("is-active")));let next=cur;if(ev.key==="ArrowLeft")next=(cur-1+buttons.length)%buttons.length;else if(ev.key==="ArrowRight")next=(cur+1)%buttons.length;else if(ev.key==="Home")next=0;else if(ev.key==="End")next=buttons.length-1;ev.preventDefault();buttons[next].focus();const metric=buttons[next].dataset.metric||"views";activateMetric(metric);emitSortFilterUsed("sort",{value:metric,metric,controlKey:`trending-metric:${metric}`,triggerText:buttons[next].textContent||metric,eventName:`keyboard-${ev.key}`});});shell.appendChild(metricSwitch);shell.appendChild(wrap);host.innerHTML="";host.appendChild(shell);activateMetric(initialMetric,{skipUrl:true,skipReload:true});}
function bootTrendingFeatures(){mount();mountHotBadge();}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",bootTrendingFeatures);}else{bootTrendingFeatures();}
document.addEventListener("DOMContentSwitch",bootTrendingFeatures);window.addEventListener("pageshow",bootTrendingFeatures,{passive:true});})();