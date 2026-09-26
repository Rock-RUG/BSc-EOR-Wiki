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
(function(){const API_BASE="https://hot.eor-wiki.workers.dev";const USER_RANKING_CACHE_TTL_MS=10*60*1000;const USER_RANKING_MEMORY_TTL_MS=60*1000;const latestRankingRequests=new Map();const ENABLE_H1_HOT_BADGE=false;function ensureStylesOnce(){const STYLE_ID="trending-style-v25-ranking-disclosure";if(document.getElementById(STYLE_ID))return;try{const old24=document.getElementById("trending-style-v24-avatar-frame-safe-area");if(old24&&old24.parentNode)old24.parentNode.removeChild(old24);}catch(_){}
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
  display:block;
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
.trending-user-quick{
  display:inline-flex;
  align-items:center;
  gap:6px;
  flex-wrap:wrap;
}
/* The pair travels together: on a phone the group wraps to the next line
   rather than stacking one button above the other. */
.trending-quick-buttons{
  display:inline-flex;
  align-items:center;
  gap:4px;
  flex-shrink:0;
}
.trending-quick-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:1.6rem;
  height:1.6rem;
  padding:0;
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 22%, transparent);
  border-radius:999px;
  background:transparent;
  color:var(--md-default-fg-color);
  cursor:pointer;
  opacity:.72;
}
.trending-quick-btn:hover,
.trending-quick-btn:focus-visible{ opacity:1; }
.trending-quick-btn[disabled]{ cursor:default; opacity:.4; }
.trending-quick-btn svg{ width:.92rem; height:.92rem; }
.trending-quick-sr{
  position:absolute;
  width:1px;
  height:1px;
  overflow:hidden;
  clip-path:inset(50%);
  white-space:nowrap;
}
.trending-quick-status{
  font-size:.66rem;
  font-weight:600;
  opacity:.78;
}
.trending-quick-status[data-error]{ color:var(--md-typeset-del-color, #c62828); opacity:1; }
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
.trending-block[data-metric="collection_value"] .trending-user-period-xp,
.trending-block[data-metric="spenders"] .trending-user-period-xp,
.trending-block[data-metric="eor_rating"] .trending-user-period-xp{
  white-space:normal;
  overflow-wrap:anywhere;
  line-height:1.25;
}
.trending-rating-value{
  display:block;
  font-size:.9rem;
  font-weight:750;
}
.trending-rating-change{
  display:block;
  font-size:.66rem;
  font-weight:600;
  opacity:.72;
}
.trending-user-name[aria-busy="true"]{ cursor:progress; opacity:.65; }
.trending-rivals-toggle{ appearance:none; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); border-radius:999px; background:transparent; color:inherit; font:inherit; font-size:.7rem; font-weight:700; padding:.3rem .7rem; cursor:pointer; }
.trending-rivals-toggle.is-active{ border-color:var(--md-accent-fg-color); color:var(--md-accent-fg-color); background:color-mix(in srgb,var(--md-accent-fg-color) 9%,transparent); }
.trending-rivals-toggle[hidden],.trending-rivals-note[hidden]{ display:none !important; }
.trending-rivals-bar{ display:flex; align-items:center; flex-wrap:wrap; gap:.35rem .6rem; margin:.1rem 0 .35rem; }
.trending-rivals-note{ margin:0; font-size:.68rem; opacity:.75; }
.trending-user-item.is-rival{ box-shadow:inset 3px 0 0 color-mix(in srgb,var(--md-accent-fg-color) 70%,transparent); }
.trending-rival-gap{ font-size:.66rem; font-weight:650; opacity:.78; }

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
function periodMetricLabel(period,metric){const m=String(metric||"views");const p=String(period||"7d");if(p==="honors")return m==="spenders"?"Spent that month":m==="eor_rating"?"Rating gained":"XP that month";if(m==="collection_value")return p==="all"?"Collection value":p==="today"?"Change today":p==="7d"?"Change in 7 days":"Change in 30 days";if(m==="spenders"){return p==="today"?"Daily spent":p==="7d"?"7-day spent":p==="30d"?"30-day spent":"Total spent";}
if(m==="eor_rating"){return p==="today"?"Change today":p==="7d"?"Change in 7 days":p==="30d"?"Change in 30 days":"EOR Rating";}
if(m==="popular"){if(p==="today")return"Daily score";if(p==="7d")return"7-day score";if(p==="30d")return"30-day score";return"Total score";}
if(m==="lively"){if(p==="today")return"Daily liveliness";if(p==="7d")return"7-day liveliness";if(p==="30d")return"30-day liveliness";return"Total liveliness";}
if(m==="saved"){if(p==="today")return"Daily saves";if(p==="7d")return"7-day saves";if(p==="30d")return"30-day saves";return"Total saves";}
if(m==="tested"){if(p==="today")return"Daily tests";if(p==="7d")return"7-day tests";if(p==="30d")return"30-day tests";return"Total tests";}
if(m==="comments"){if(p==="today")return"Daily comments";if(p==="7d")return"7-day comments";if(p==="30d")return"30-day comments";return"Total comments";}
if(m==="users"){if(p==="today")return"Daily XP";if(p==="7d")return"7-day XP";if(p==="30d")return"30-day XP";return"Total XP";}
if(m==="quiz_correct"){if(p==="today")return"Daily correct";if(p==="7d")return"7-day correct";if(p==="30d")return"30-day correct";return"Total correct";}
if(p==="today")return"Daily views";if(p==="7d")return"7-day views";if(p==="30d")return"30-day views";return"Total views";}
function metricValue(item,metric){if(!item)return 0;if(metric==="collection_value")return`${formatTrendingNumber(item.score)} EOR Bits`;if(metric==="spenders")return`${formatTrendingNumber(item.spent != null ? item.spent : item.score)} EOR Bits`;if(metric==="eor_rating"){if(item.periodGain!=null)return formatRatingGain(item.periodGain);return formatTrendingInteger(item.rating!=null?item.rating:item.score);}
if(metric==="popular"||metric==="lively"){const v=item.score!=null?item.score:item.count;return Number.isInteger(Number(v))?String(Number(v)):String(Number(v||0).toFixed(1)).replace(/\.0$/,"");}
if(metric==="users"){return formatTrendingXp(userPeriodXp(item));}
if(metric==="quiz_correct"){return formatTrendingInteger(userQuizCorrectCount(item));}
return String(item.count||0);}
function firstDefinedValue(obj,keys){const source=obj&&typeof obj==="object"?obj:{};const profile=source.profile&&typeof source.profile==="object"?source.profile:{};for(const key of keys||[]){if(source[key]!=null&&source[key]!=="")return source[key];if(profile[key]!=null&&profile[key]!=="")return profile[key];}
return"";}
function formatTrendingNumber(value){const n=Number(value||0);if(!Number.isFinite(n))return"0";return(Math.round(n*10)/10).toFixed(1).replace(/\.0$/,"");}
function formatTrendingInteger(value){const n=Math.max(0,Math.round(Number(value||0)));return Number.isFinite(n)?String(n):"0";}
function trendingValueWithUnit(num,unit){return`<span class="trending-value-num">${escapeTrendingHtml(num)}</span><span class="trending-value-unit">${escapeTrendingHtml(unit)}</span>`;}
function formatTrendingXp(value){return`${formatTrendingNumber(value)} XP`;}
function isTrendingUserMetric(metric){return metric==="users"||metric==="quiz_correct"||isMilestoneMetric(metric);}
function isMilestoneMetric(metric){return metric==="collection_value"||metric==="spenders"||metric==="eor_rating";}
function formatRatingGain(value){const n=Math.round(Number(value)||0);return n>0?`+${n}`:n<0?`−${Math.abs(n)}`:"0";}
function ratingSecondaryHtml(item){const part=(cls,text)=>text?`<span class="${cls}">${escapeTrendingHtml(text)}</span>`:"";if(item&&item.periodGain!=null){return part("trending-rating-change-label","Rating ")+part("trending-rating-change-num",formatTrendingInteger(item.rating));}
const n=Math.round(Number(item&&item.ratingChange7d)||0);const num=n>0?`+${n}`:n<0?`\u2212${Math.abs(n)}`:"\u00b10";return part("trending-rating-change-num",num)+part("trending-rating-change-label"," this week");}
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
function patchCurrentUserRankingItems(items,period,options){const list=Array.isArray(items)?items:[];if(!list.length)return list;const opts=options&&typeof options==="object"?options:{};const preferLocalOwnScore=!!opts.preferLocalOwnScore;const profile=readTrendingLocalProfile();const accountKey=String(profile.accountKey||"").trim().toLowerCase();const profileName=cleanTrendingProfileName(profile.name||"").toLowerCase();if(!accountKey&&!profileName)return list;const snap=readTrendingCurrentXpSnapshot();if(!snap)return list;const snapKey=String(snap.accountKey||"").trim().toLowerCase();const snapName=cleanTrendingProfileName(snap.name||profile.name||"").toLowerCase();const belongs=(accountKey&&snapKey&&accountKey===snapKey)||(profileName&&snapName&&profileName===snapName)||(!snapKey&&profileName&&snapName===profileName);if(!belongs)return list;const localPeriodScore=Math.round(periodXpFromSnapshot(snap,period)*10)/10;const localTotalScore=Math.round(Number(firstDefinedValue(snap,["totalScore","totalXp","score"]))*10)/10;const useLocalXp=preferLocalOwnScore&&Number.isFinite(localPeriodScore)&&localPeriodScore>=0&&Number.isFinite(localTotalScore)&&localTotalScore>=0;let changed=false;const patched=list.map((it)=>{const itemKey=String(it&&(it.accountKey||it.account_key||"")||"").trim().toLowerCase();const itemName=cleanTrendingProfileName(it&&(it.name||it.title||it.username||it.displayName)||"").toLowerCase();const isMe=!!((accountKey&&itemKey&&accountKey===itemKey)||(profileName&&itemName&&profileName===itemName));if(!isMe)return it;changed=true;const serverPeriodScore=Math.round(userPeriodXp(it)*10)/10;const serverTotalScore=Math.round(userTotalXp(it)*10)/10;const periodScore=useLocalXp?localPeriodScore:(Number.isFinite(serverPeriodScore)?serverPeriodScore:0);const totalScore=useLocalXp?localTotalScore:(Number.isFinite(serverTotalScore)?serverTotalScore:0);const xpSnapshot=useLocalXp?snap:it;const level=Math.max(1,Math.floor(Number(xpSnapshot.level||1))||1);const selectedFrame=cleanAvatarFrameLocal(profile.avatarFrame||snap.selectedAvatarFrame||snap.avatarFrame||it.selectedAvatarFrame||it.avatarFrame||avatarFrameForLevelLocal(level));return Object.assign({},it,{accountKey:it.accountKey||profile.accountKey||snap.accountKey||"",name:it.name||profile.name||snap.name||"",title:it.title||it.name||profile.name||snap.name||"",avatar:profile.avatar||snap.avatar||it.avatar||"",score:periodScore,count:periodScore,periodScore,totalScore,totalXp:totalScore,level,progressPct:xpSnapshot.progressPct,levelStart:xpSnapshot.levelStart,nextLevelStart:xpSnapshot.nextLevelStart,avatarFrame:selectedFrame,selectedAvatarFrame:selectedFrame,equippedCosmetics:snap.equippedCosmetics||it.equippedCosmetics||{},rankingEffect:(snap.equippedCosmetics&&snap.equippedCosmetics.ranking_effect)||it.rankingEffect||"",localXpSnapshotPatched:true});});if(!changed)return list;patched.sort((a,b)=>Number(userPeriodXp(b)||0)-Number(userPeriodXp(a)||0)||Number(userTotalXp(b)||0)-Number(userTotalXp(a)||0)||userDisplayName(a).localeCompare(userDisplayName(b)));return patched;}
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
        ${circle(53, `stroke="rgba(122,133,150,.78)" stroke-width="3.2"`)}
        ${circle(57, `stroke="rgba(122,133,150,.25)" stroke-width="1.2"`)}
        ${ticks(8, 59, 62, "rgba(148,163,184,.32)", 1.1, -90)}
        ${beadAt(-90, 61, 2.4, "#cbd5e1", "#f8fafc")}
      ${svgClose}`;}
if(level===2){return`${svgOpen}
        ${circle(52, `stroke="#9a5c2c" stroke-width="4.3"`)}
        ${circle(58, `stroke="rgba(245,186,117,.62)" stroke-width="1.6" stroke-dasharray="4 6"`)}
        ${circle(46, `stroke="rgba(120,53,15,.32)" stroke-width="1.4"`)}
        ${dots(8, 62, 3.4, ["#b87333", "#d08a45"])}
        ${ticks(16, 55, 59, "rgba(255,237,213,.48)", 1.05, -90)}
      ${svgClose}`;}
if(level===3){return`${svgOpen}
        ${circle(52, `stroke="#cbd5e1" stroke-width="4.1"`)}
        ${circle(59, `stroke="rgba(148,163,184,.56)" stroke-width="1.55"`)}
        ${circle(45, `stroke="rgba(226,232,240,.30)" stroke-width="1.2" stroke-dasharray="7 7"`)}
        ${[ -90, 0, 90, 180 ].map((d) => diamondAt(d, 63, 6.1, "#e2e8f0", "#94a3b8")).join(" ")}
        ${[ -45, 45, 135, 225 ].map((d) => diamondAt(d, 60, 3.7, "#f8fafc", "#cbd5e1")).join(" ")}
        ${ticks(12, 54, 61, "rgba(248,250,252,.55)", 1.25, -90)}
        <path d="M50 -4V12 M50 88v16 M-4 50H12 M88 50h16" stroke="#f8fafc" stroke-width="2.8" stroke-linecap="round"/>
      ${svgClose}`;}
if(level===4){return`${svgOpen}
        ${circle(51, `stroke="#d99b22" stroke-width="5"`)}
        ${circle(58, `stroke="rgba(255,224,130,.76)" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"`)}
        ${circle(44, `stroke="rgba(146,64,14,.34)" stroke-width="1.6"`)}
        ${dots(12, 63, 3.6, ["#facc15", "#f59e0b", "#fde68a"])}
        ${dots(12, 48, 1.25, "rgba(255,251,235,.70)", -75)}
        ${[ -90, 0, 90, 180 ].map((d) => diamondAt(d, 66, 4.2, "#fff7ad", "#ca8a04")).join(" ")}
      ${svgClose}`;}
if(level===5){return`${svgOpen}
        ${circle(51, `stroke="#059669" stroke-width="4.8"`)}
        ${circle(58, `stroke="rgba(167,243,208,.62)" stroke-width="1.7" stroke-dasharray="10 8" stroke-linecap="round"`)}
        <path d="M 6 88 C -10 60, -6 29, 15 8" fill="none" stroke="#10b981" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M 94 88 C 110 60, 106 29, 85 8" fill="none" stroke="#10b981" stroke-width="4.2" stroke-linecap="round"/>
        ${leaf(19,82,-25,"#10b981",1.02)} ${leaf(10,68,-15,"#6ee7b7",.92)} ${leaf(7,53,0,"#34d399",.85)} ${leaf(10,38,14,"#10b981",.92)} ${leaf(20,21,31,"#6ee7b7",1)}
        ${leaf(81,82,205,"#10b981",1.02)} ${leaf(90,68,195,"#6ee7b7",.92)} ${leaf(93,53,180,"#34d399",.85)} ${leaf(90,38,166,"#10b981",.92)} ${leaf(80,21,149,"#6ee7b7",1)}
        ${diamondAt(-90, 64, 5.4, "#a7f3d0", "#047857")}
        ${dots(8, 49, 1.35, "rgba(236,253,245,.70)", -90)}
      ${svgClose}`;}
if(level===6){return`${svgOpen}
        ${circle(51, `stroke="#2563eb" stroke-width="4.9"`)}
        ${circle(59, `stroke="rgba(96,165,250,.82)" stroke-width="2" stroke-dasharray="9 7" stroke-linecap="round"`)}
        ${circle(44, `stroke="rgba(191,219,254,.34)" stroke-width="1.45"`)}
        ${[ -90, 0, 90, 180 ].map((d) => shardAt(d, 64, 8.8, "#38bdf8", "#dbeafe", 4.4)).join(" ")}
        ${[ -45, 45, 135, 225 ].map((d) => shardAt(d, 61, 5.7, "#60a5fa", "#eff6ff", 3.2)).join(" ")}
        <path d="M18 3 C33 -9, 67 -9, 82 3" fill="none" stroke="#bfdbfe" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M18 97 C33 109, 67 109, 82 97" fill="none" stroke="#bfdbfe" stroke-width="3.2" stroke-linecap="round"/>
        ${dots(12, 50, 1.2, ["#dbeafe", "#93c5fd"], -75)}
      ${svgClose}`;}
if(level===7){return`${svgOpen}
        ${circle(51, `stroke="#7c3aed" stroke-width="5.1"`)}
        ${circle(60, `stroke="rgba(216,180,254,.78)" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"`)}
        ${circle(44, `stroke="rgba(233,213,255,.34)" stroke-width="1.4" stroke-dasharray="5 6"`)}
        ${[ -90, 90 ].map((d) => starAt(d, 65, 8, 3.4, "#c084fc", "#faf5ff")).join(" ")}
        ${[ -35, 35, 145, 215 ].map((d) => starAt(d, 64, 6.1, 2.5, "#a78bfa", "#ede9fe")).join(" ")}
        ${[ -65, -15, 70, 110, 195, 245 ].map((d) => starAt(d, 54, 3.2, 1.4, "#f0abfc", "#fdf4ff")).join(" ")}
        <path d="M 18 8 C 34 -3, 66 -3, 82 8" fill="none" stroke="#f0abfc" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M 20 93 C 35 101, 65 101, 80 93" fill="none" stroke="#c4b5fd" stroke-width="2.2" stroke-linecap="round"/>
        ${dots(14, 49, 1.05, ["#f5d0fe", "#ddd6fe"], -86)}
      ${svgClose}`;}
if(level===8){return`${svgOpen}
        ${circle(51, `stroke="#e11d48" stroke-width="5.2"`)}
        ${circle(60, `stroke="rgba(253,164,175,.78)" stroke-width="2" stroke-dasharray="6 5" stroke-linecap="round"`)}
        ${[ -90, 0, 90, 180 ].map((d) => petalAt(d, 63, 10.2, "#fb7185", "#fff1f2", 0)).join(" ")}
        ${[ -45, 45, 135, 225 ].map((d) => petalAt(d, 61, 7.3, "#f97316", "#ffedd5", 5)).join(" ")}
        ${[ -20, 20, 160, 200 ].map((d) => shardAt(d, 57, 5.2, "#f43f5e", "#ffe4e6", 3)).join(" ")}
        ${diamondAt(-90, 47, 4.5, "#fecdd3", "#be123c")}
        ${diamondAt(90, 47, 4.5, "#fecdd3", "#be123c")}
        ${dots(16, 50, 1.05, ["#ffe4e6", "#fed7aa"], -90)}
      ${svgClose}`;}
if(level===9){return`${svgOpen}
        ${circle(51, `stroke="#06b6d4" stroke-width="5.2"`)}
        ${circle(60, `stroke="rgba(240,171,252,.72)" stroke-width="2" stroke-dasharray="12 6" stroke-linecap="round"`)}
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
      ${circle(51, `stroke="#f59e0b" stroke-width="5.6"`)}
      ${circle(61, `stroke="rgba(251,191,36,.88)" stroke-width="2.4" stroke-dasharray="3 5" stroke-linecap="round"`)}
      ${circle(43, `stroke="rgba(254,240,138,.34)" stroke-width="1.5" stroke-dasharray="8 5"`)}
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
const QUICK_ACTION_ICONS={star:'<path d="M11.53 2.3a.53.53 0 0 1 .94 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.9l5.16-.76a2.12 2.12 0 0 0 1.6-1.16z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',swords:'<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4"/><path d="m7 17-3 3"/><path d="m3 19 2 2"/>',check:'<path d="M20 6 9 17l-5-5"/>',};function quickActionIcon(name){return`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${QUICK_ACTION_ICONS[name] || ""}</svg>`;}
async function ensureAccountFeatureApi(get){if(get())return get();const startup=window.MkStartupPrefs;if(startup&&typeof startup.ensureFeature==="function")await startup.ensureFeature("account");return get();}
let rankingConnections=null;function rankingConnectionSnapshot(meKey,refresh){if(!refresh&&rankingConnections&&rankingConnections.key===meKey&&Date.now()-rankingConnections.at<15000)return rankingConnections.promise;const promise=(async()=>{const api=window.MkLocalActivity;if(api&&typeof api.fetchConnections==="function")return api.fetchConnections();const visitorId=trendingVisitorId();if(!visitorId)throw new Error("Connections unavailable");const controller=typeof AbortController==="function"?new AbortController():null;const timer=controller?window.setTimeout(()=>controller.abort(),10000):null;try{const response=await fetch(API_BASE+"/connections?visitorId="+encodeURIComponent(visitorId),{cache:"no-store",...(controller?{signal:controller.signal}:{})});if(!response.ok)throw new Error("Connections unavailable");return await response.json();}finally{if(timer)window.clearTimeout(timer);}})().then(data=>{if(!data||!data.ok||!["connections","incoming","outgoing"].every(key=>Array.isArray(data[key])))throw new Error("Connections unavailable");return data;});rankingConnections={key:meKey,at:Date.now(),promise};promise.catch(()=>{if(rankingConnections&&rankingConnections.promise===promise)rankingConnections=null;});return promise;}
function trendingQuickActions(item){const accountKey=String(item&&(item.accountKey||item.account_key)||"").trim();if(!accountKey)return null;let meKey="";try{meKey=String(readTrendingLocalProfile().accountKey||"").trim().toLowerCase();}catch(_){meKey="";}
if(!meKey||meKey===accountKey.toLowerCase())return null;const name=userDisplayName(item);const wrap=el("span","trending-user-quick");const buttons=el("span","trending-quick-buttons");wrap.appendChild(buttons);const status=el("span","trending-quick-status");status.setAttribute("role","status");status.setAttribute("aria-live","polite");const say=(text,bad)=>{status.textContent=text||"";if(bad)status.setAttribute("data-error","true");else status.removeAttribute("data-error");};const make=(kind,label,icon)=>{const btn=el("button",`trending-quick-btn trending-quick-${kind}`);btn.type="button";btn.title=label;btn.setAttribute("aria-label",`${label}: ${name}`);btn.innerHTML=`${quickActionIcon(icon)}<span class="trending-quick-sr">${escapeTrendingHtml(label)}</span>`;buttons.appendChild(btn);return btn;};const connect=make("connect","Checking connection","link");connect.disabled=true;const duel=make("challenge","Challenge to a duel","swords");wrap.appendChild(status);let relationship="unknown",connectionBusy=false;const current=()=>wrap.isConnected&&String(readTrendingLocalProfile().accountKey||"").trim().toLowerCase()===meKey;function paintRelationship(state){relationship=state;const label=state==="accepted"?"Applaud":state==="outgoing"?"Request sent":state==="incoming"?"Incoming request":state==="unknown"?"Retry connection status":"Add study connection";connect.title=label;connect.setAttribute("aria-label",`${label}: ${name}`);connect.innerHTML=`${quickActionIcon(state === "accepted" ? "star" : state === "outgoing" || state === "incoming" ? "check" : "link")}<span class="trending-quick-sr">${escapeTrendingHtml(label)}</span>`;connect.disabled=state==="outgoing"||state==="incoming";}
async function refreshRelationship(force){const data=await rankingConnectionSnapshot(meKey,force);if(!current())return false;const matches=row=>String(row.otherAccountKey||"").toLowerCase()===accountKey.toLowerCase();paintRelationship(data.connections.some(matches)?"accepted":data.outgoing.some(matches)?"outgoing":data.incoming.some(matches)?"incoming":"none");return true;}
refreshRelationship(false).catch(()=>{if(current())paintRelationship("unknown");});connect.addEventListener("click",async()=>{if(connect.disabled||connectionBusy||!current())return;connectionBusy=true;connect.disabled=true;connect.setAttribute("aria-busy","true");try{if(!await refreshRelationship(true)||!current())return;const api=await ensureAccountFeatureApi(()=>window.MkLocalActivity);if(!current())return;if(relationship==="accepted"){api.applaudLearner({...item,accountKey,name});say("");}else if(relationship==="none"){connect.disabled=true;say("Sending request…");const res=await api.requestConnection(name,{isCurrent:current});if(!current())return;rankingConnections=null;if(res&&res.ok){await refreshRelationship(true);say(relationship==="accepted"?"Connected":"Request sent");}
else say(res&&res.error||"Could not send the request.",true);}}catch(_){if(current()){paintRelationship("unknown");say("Could not load connection status. Try again.",true);}}
finally{connectionBusy=false;if(current()){connect.removeAttribute("aria-busy");paintRelationship(relationship);}}});duel.addEventListener("click",async()=>{if(duel.disabled)return;duel.disabled=true;duel.setAttribute("aria-busy","true");say("Opening the challenge…");try{const arena=await ensureAccountFeatureApi(()=>window.MkArena);const res=arena&&typeof arena.challenge==="function"?await arena.challenge({accountKey,name}):null;say(res&&res.ok?"":((res&&res.error)||"Challenges are unavailable."),!(res&&res.ok));}catch(_){say("Challenges are unavailable.",true);}
duel.removeAttribute("aria-busy");duel.disabled=false;});return wrap;}
const RIVALS_KEY="mk_ranking_rivals_v1";function readRankingRivals(){try{const me=String(readTrendingLocalProfile().accountKey||"").trim().toLowerCase();if(!me)return[];const all=JSON.parse(localStorage.getItem(RIVALS_KEY)||"{}");const list=all&&typeof all==="object"&&Array.isArray(all[me])?all[me]:[];return list.map(key=>String(key||"").trim().toLowerCase()).filter(Boolean).slice(0,5);}catch(_){return[];}}
function boardNumber(item,metric){if(!item)return null;if(metric==="eor_rating")return Number(item.periodGain!=null?item.periodGain:item.rating);if(metric==="collection_value")return Number(item.score);if(metric==="spenders")return Number(item.spent!=null?item.spent:item.score);if(metric==="users")return Number(userPeriodXp(item));return null;}
let trendingProfileOpenEpoch=0;document.addEventListener("keydown",event=>{if(event.key==="Escape")trendingProfileOpenEpoch+=1;},true);document.addEventListener("DOMContentSwitch",()=>{trendingProfileOpenEpoch+=1;});window.addEventListener("pagehide",()=>{trendingProfileOpenEpoch+=1;});async function openTrendingPublicProfile(input,anchor){const epoch=++trendingProfileOpenEpoch;const route=String(window.location.href);try{if(!window.MkLocalActivity||typeof window.MkLocalActivity.openPublicProfile!=="function"){if(anchor)anchor.setAttribute("aria-busy","true");const startup=window.MkStartupPrefs;if(startup&&typeof startup.ensureFeature==="function")await startup.ensureFeature("account");if(epoch!==trendingProfileOpenEpoch||route!==String(window.location.href)||(anchor&&!anchor.isConnected))return;}
if(!window.MkLocalActivity||typeof window.MkLocalActivity.openPublicProfile!=="function")return;const item=input&&typeof input==="object"?input:null;const name=item?userDisplayName(item):String(input||"");const accountKey=item?String(item.accountKey||item.account_key||"").trim():"";let selfPreview=false;try{const me=readTrendingLocalProfile();const meKey=String(me&&me.accountKey||"").trim().toLowerCase();selfPreview=!!(accountKey&&meKey&&accountKey.toLowerCase()===meKey);}catch(_){}
const payload=item?{accountKey,account_key:accountKey,selfPreview,source:"rankings",rankingProfile:item?{accountKey,name,avatar:userAvatarValue(item),avatarFrame:userAvatarFrameValue(item),bio:userIntroText(item),intro:userIntroText(item),equippedCosmetics:item.equippedCosmetics||{},rankingEffect:item.rankingEffect||""}:null,rankingXp:item&&item.monthlyHonor?null:{totalXp:formatTrendingNumber(userTotalXp(item)),periodXp:formatTrendingNumber(userPeriodXp(item)),level:userLevel(item),progressPct:userLevelProgressPct(item,userTotalXp(item),userLevel(item)),accountKey,source:"rankings"}}:null;window.MkLocalActivity.openPublicProfile(name||accountKey||"",payload||undefined);}catch(_){if(anchor&&anchor.isConnected&&epoch===trendingProfileOpenEpoch){const notice=el("span","trending-profile-error","Profile could not load. Select the name to retry.");notice.setAttribute("role","status");const parent=anchor.parentElement;if(parent&&!parent.querySelector(".trending-profile-error"))parent.appendChild(notice);}}finally{if(anchor)anchor.removeAttribute("aria-busy");}}
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
async function fetchUserRankings({period,limit,offset}){const cacheKey=hotCacheKey("users",period,limit,offset);const request={};latestRankingRequests.set(cacheKey,request);const url=new URL(API_BASE+"/v2/rankings");url.searchParams.set("period",v2RankingPeriodParam(period));url.searchParams.set("limit",String(limit));url.searchParams.set("offset",String(offset));const visitorId=trendingVisitorId();if(visitorId)url.searchParams.set("visitorId",visitorId);url.searchParams.set("fresh",String(Date.now()));url.searchParams.set("r",Math.random().toString(36).slice(2));const resp=await fetch(url.toString(),{cache:"no-store",headers:{"Cache-Control":"no-cache","Pragma":"no-cache"}}).catch(()=>null);const data=resp&&resp.ok?await resp.json().catch(()=>null):null;if(data&&data.ok!==false&&(Array.isArray(data.entries)||Array.isArray(data.items))){const items=normaliseUserRankingItems(data);const fresh={items,total:typeof data.count==="number"?data.count:(typeof data.total==="number"?data.total:items.length),fetchedAt:Date.now(),source:"v2-rankings",refreshPending:data.refreshPending===true,};if(latestRankingRequests.get(cacheKey)===request)writeHotCache("users",period,limit,offset,fresh);return fresh;}
const cached=readHotCache("users",period,limit,offset)||readUserBoardCache(period,limit,offset);if(cached)return Object.assign({},cached,{stale:true,refreshFailed:true});return{items:[],total:0,stale:true,refreshFailed:true};}
async function fetchHot({metric,period,limit,offset}){if(metric==="users")return fetchUserRankings({period,limit,offset});const cacheKey=hotCacheKey(metric,period,limit,offset);const request={};latestRankingRequests.set(cacheKey,request);const url=new URL(API_BASE+(metric==="eor_rating"?"/arena/rating/leaderboard":"/hot"));if(metric!=="eor_rating")url.searchParams.set("metric",metric);url.searchParams.set("period",period);url.searchParams.set("limit",String(limit));url.searchParams.set("offset",String(offset));url.searchParams.set("fresh",String(Date.now()));url.searchParams.set("r",Math.random().toString(36).slice(2));const resp=await fetch(url.toString(),{cache:"no-store",headers:{"Cache-Control":"no-cache","Pragma":"no-cache"}}).catch(()=>null);const data=resp&&resp.ok?await resp.json().catch(()=>null):null;if(metric==="eor_rating"&&data&&Object.prototype.hasOwnProperty.call(data,"prizes"))applyPrizeTeaser(data.prizes);if(data&&data.ok!==false&&Array.isArray(data.items)&&(!isMilestoneMetric(metric)||(data.metric===metric&&data.period_used===period))){const fresh={items:data.items,historyComplete:data.historyComplete,trackedFrom:data.trackedFrom,total:typeof data.total==="number"?data.total:data.items.length,fetchedAt:Date.now(),};if(latestRankingRequests.get(cacheKey)===request)writeHotCache(metric,period,limit,offset,fresh);return fresh;}
const cached=readHotCache(metric,period,limit,offset);if(cached)return Object.assign({},cached,{stale:true,refreshFailed:true});return{items:[],total:0,stale:true,refreshFailed:true};}
async function fetchMonthlyHonors({metric,limit,offset}){const url=new URL(API_BASE+"/rewards/honors");url.searchParams.set("metric",metric);url.searchParams.set("limit",String(limit));url.searchParams.set("offset",String(offset));const response=await fetch(url.toString(),{cache:"no-store",headers:{"Cache-Control":"no-cache","Pragma":"no-cache"}}).catch(()=>null);const data=response&&response.ok?await response.json().catch(()=>null):null;if(!data||data.ok!==true||data.metric!==metric||!Array.isArray(data.entries)||!Number.isSafeInteger(data.total)||data.total<0||data.offset!==offset||data.limit!==limit||data.entries.length>limit||data.entries.length>data.total||data.entries.some(item=>!item||item.metric!==metric||!/^\d{4}-(0[1-9]|1[0-2])$/.test(String(item.month||""))||typeof item.accountKey!=="string"||!item.accountKey.trim()||typeof item.name!=="string"||!item.name.trim()||!Number.isFinite(item.score)||item.score<=0)){return{items:[],total:0,refreshFailed:true,fetchedAt:0};}
return{items:data.entries,total:data.total,firstEligibleMonth:/^\d{4}-(0[1-9]|1[0-2])$/.test(String(data.firstEligibleMonth||""))?data.firstEligibleMonth:"",historyFirstMonth:/^\d{4}-(0[1-9]|1[0-2])$/.test(String(data.historyFirstMonth||""))?data.historyFirstMonth:"",graceHours:Number.isFinite(data.graceHours)&&data.graceHours>=0?data.graceHours:null,monthOutcomes:Array.isArray(data.monthOutcomes)?data.monthOutcomes.filter(o=>o&&/^\d{4}-(0[1-9]|1[0-2])$/.test(String(o.month||""))&&typeof o.champion==="boolean"):[],fetchedAt:Date.now(),};}
function monthlyHonorMonthLabel(month){const parts=String(month||"").split("-");const months=["January","February","March","April","May","June","July","August","September","October","November","December"];return months[Number(parts[1])-1]?`${months[Number(parts[1]) - 1]} ${parts[0]}`:"";}
const HONOR_TROPHY_SVG='<svg viewBox="0 0 48 48" focusable="false" aria-hidden="true"><path class="trending-honor-trophy-handle" d="M13 10H6v7c0 8 6 12 13 12M35 10h7v7c0 8-6 12-13 12"/><path class="trending-honor-trophy-cup" d="M13 7h22v11c0 9-5 14-11 14S13 27 13 18Z"/><path class="trending-honor-trophy-base" d="M21 31h6v7h7v5H14v-5h7Z"/><path class="trending-honor-trophy-star" d="m24 12 2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7Z"/></svg>';function monthlyHonorStamp(month){const stamp=el("div","trending-rank trending-honor-stamp");const trophy=el("span","trending-honor-trophy");trophy.setAttribute("aria-hidden","true");trophy.innerHTML=HONOR_TROPHY_SVG;stamp.appendChild(trophy);const time=el("time","trending-honor-month",monthlyHonorMonthLabel(month));time.setAttribute("datetime",month);stamp.appendChild(time);return stamp;}
function monthlyHonorValue(item,metric){const meta=el("span","trending-user-period-xp trending-honor-value");if(metric==="eor_rating")meta.innerHTML=trendingValueWithUnit(formatRatingGain(item.score)," gained");else if(metric==="spenders")meta.innerHTML=trendingValueWithUnit(formatTrendingNumber(item.score)," EOR Bits");else meta.innerHTML=trendingValueWithUnit(formatTrendingNumber(item.score)," XP");return meta;}
function monthlyHonorRow(item,metric){const coWinners=Math.max(1,Math.floor(Number(item.coWinnerCount)||1));const row=trendingUserRow(item,metric,{leading:monthlyHonorStamp(item.month),value:monthlyHonorValue(item,metric),profileItem:Object.assign({},item,{monthlyHonor:true}),extra:coWinners>1?el("span","trending-honor-title",`Joint monthly champion · ${coWinners} winners`):null,});row.classList.add("trending-honor-item");row.dataset.month=item.month;return row;}
function monthlyHonorGapReason(outcome,metric){const anyone=Number(outcome&&outcome.learners)>0;if(metric==="eor_rating")return anyone?"Nobody's rating rose this month.":"No rated results this month.";if(metric==="spenders")return anyone?"No eligible spending this month.":"Nobody spent EOR Bits this month.";return anyone?"No eligible XP this month.":"Nobody earned XP this month.";}
function monthlyHonorGapRow(outcome,metric){const row=el("li","trending-item trending-user-item trending-honor-item trending-honor-gap");row.dataset.month=outcome.month;row.appendChild(monthlyHonorStamp(outcome.month));const profile=el("div","trending-user-profile");const placeholder=el("span","trending-honor-gap-avatar");placeholder.setAttribute("aria-hidden","true");profile.appendChild(placeholder);const main=el("div","trending-user-main");main.appendChild(el("span","trending-honor-gap-title","No champion"));main.appendChild(el("span","trending-honor-gap-reason",monthlyHonorGapReason(outcome,metric)));profile.appendChild(main);row.appendChild(profile);row.appendChild(el("span","trending-user-period-xp trending-honor-value","—"));return row;}
function mergeHonorGaps(entries,gaps,{firstPage,lastPage,newerBound}){const rows=entries.map(item=>({month:item.month,item}));if(!Array.isArray(gaps)||!gaps.length)return rows;const newest=entries.length?entries[0].month:"",oldest=entries.length?entries[entries.length-1].month:"";const upper=firstPage?"":(newerBound||newest);for(const gap of gaps){if(entries.length){if(upper&&!(gap.month<upper))continue;if(!lastPage&&gap.month<oldest)continue;}
rows.push({month:gap.month,gap});}
return rows.sort((a,b)=>(a.month<b.month?1:a.month>b.month?-1:0));}
function trendingUserRow(it,metric,{leading,value,profileItem=null,extra=null}={}){const li=el("li","trending-item trending-user-item");const fx=String((it&&(it.rankingEffect||(it.equippedCosmetics&&it.equippedCosmetics.ranking_effect)))||"").trim();if(fx)li.setAttribute("data-ranking-effect",fx);try{const me=readTrendingLocalProfile();const meKey=String(me.accountKey||"").trim().toLowerCase();if(meKey&&String(it&&(it.accountKey||it.account_key||"")||"").trim().toLowerCase()===meKey){li.classList.add("mk-trending-current-user");li.setAttribute("data-current-user","true");}}catch(_){}
if(it&&it.__rival)li.classList.add("is-rival");li.appendChild(leading);const name=userDisplayName(it);const level=userLevel(it);const totalXp=userTotalXp(it);const intro=userIntroText(it);const levelPct=formatTrendingPctStyle(userLevelProgressPct(it,totalXp,level));const profile=el("div","trending-user-profile");profile.innerHTML=trendingUserAvatarHtml(it,name);const main=el("div","trending-user-main");const nameRow=el("div","trending-user-name-row");const nameLink=el("a","trending-user-name",name);nameLink.href="#";nameRow.appendChild(nameLink);const quick=trendingQuickActions(it);if(quick)nameRow.appendChild(quick);const levelChip=el("span","trending-user-level");levelChip.title=`${levelPct}% complete in this level`;levelChip.innerHTML=`<span class="trending-user-level-fill" style="width:${levelPct}%"></span><strong>Lv. ${escapeTrendingHtml(level)}</strong>`;nameRow.appendChild(levelChip);const totalXpChip=el("span","trending-user-total-xp");totalXpChip.title="Total experience";totalXpChip.appendChild(el("span","trending-user-total-label","Total XP "));totalXpChip.appendChild(el("span","trending-user-total-value",formatTrendingXp(totalXp)));nameRow.appendChild(totalXpChip);main.appendChild(nameRow);if(intro)main.appendChild(el("div","trending-user-intro",intro));if(extra)main.appendChild(extra);profile.appendChild(main);const open=(ev)=>{ev.preventDefault();const oldError=profile.querySelector(".trending-profile-error");if(oldError)oldError.remove();openTrendingPublicProfile(profileItem||it,nameLink);};nameLink.addEventListener("click",open);profile.addEventListener("dblclick",open);li.appendChild(profile);li.appendChild(value);return li;}
function getTagsFromDoc(d){const out=[];out.push(...asStringList(d&&d.tags));out.push(...asStringList(d&&d.tag));out.push(...asStringList(d&&d.meta&&d.meta.tags));out.push(...asStringList(d&&d.meta&&d.meta.tag));return out.map(s=>String(s).trim()).filter(Boolean);}
function lectureNumFromTags(tagsArr){const info=unitInfoFromTags(tagsArr);return info?info.lectureNum:0;}
let __lectureMapPromise=null;function loadLectureMapOnce(){if(__lectureMapPromise)return __lectureMapPromise;__lectureMapPromise=(async()=>{const docs=await loadIndexDocsOnce();const map=new Map();for(const d of docs){const loc=safePath(d&&d.location);if(!loc||map.has(loc))continue;const info=unitInfoFromTags(getTagsFromDoc(d));if(info&&info.unitNum)map.set(loc,info);}
return map;})().catch((error)=>{__lectureMapPromise=null;throw error;});return __lectureMapPromise;}
function isTrendingPage(){return!!document.getElementById("trending-app");}
function accountFeatureEnabled(){try{return document.documentElement.getAttribute("data-mk-startup-account")!=="off"&&!document.documentElement.classList.contains("mk-startup-account-off");}catch(_){return true;}}
const CONCEPT_TRENDING_METRICS=[{key:"views",title:"Most viewed"},{key:"popular",title:"Most popular"},{key:"tested",title:"Most tested"},];const ACCOUNT_TRENDING_METRICS=[{key:"users",title:"Most active users"},{key:"eor_rating",title:"EOR Rating"},{key:"collection_value",title:"Collection Value"},];const TRENDING_METRICS=CONCEPT_TRENDING_METRICS.concat(ACCOUNT_TRENDING_METRICS);function visibleTrendingMetrics(){return accountFeatureEnabled()?TRENDING_METRICS:CONCEPT_TRENDING_METRICS;}
function normaliseTrendingMetric(metric){let key=String(metric||"").toLowerCase();if(key==="spenders"||key==="biggest_spenders")key="collection_value";if(key==="comments"||key==="buzz"||key==="buzzing"||key==="liveliness")key="lively";if(key==="saved_pages"||key==="saves"||key==="most_saved")key="saved";if(key==="most_tested"||key==="ai_quiz_tested"||key==="quiz_tested"||key==="ai_quiz_sessions")key="tested";if(["quiz_correct","ai_quiz_correct","aiquiz_correct","quiz_correct_answers","ai_quiz_correct_answers","mastery_explorers","rating","elo"].includes(key))key="eor_rating";return visibleTrendingMetrics().some((m)=>m.key===key)?key:"views";}
function emitSortFilterUsed(kind,detail){try{document.dispatchEvent(new CustomEvent("mk:sort-filter-used",{detail:Object.assign({source:"trending-page",controlKind:kind||"sort",sortFilterSignalVersion:8,},detail||{})}));}catch(_){}}
function readInitialTrendingMetric(){try{const url=new URL(window.location.href);if(url.searchParams.has("metric"))return normaliseTrendingMetric(url.searchParams.get("metric"));}catch(_){}
try{const hash=String(window.location.hash||"").replace(/^#/,"").toLowerCase();if(hash)return normaliseTrendingMetric(hash);}catch(_){}
return"views";}
function writeTrendingMetricToUrl(metric){try{const url=new URL(window.location.href);url.searchParams.set("metric",normaliseTrendingMetric(metric));url.hash="";window.history.replaceState(null,"",url.toString());}catch(_){}}
const PERIODS=[{key:"today",label:"Top 10 Today",shortLabel:"Today",limit:10},{key:"7d",label:"Top 10 Last 7 days",shortLabel:"Last 7 days",limit:10},{key:"30d",label:"Top 10 Last 30 days",shortLabel:"Last 30 days",limit:10},{key:"all",label:"Top 100 All time",shortLabel:"All time",limit:10},];const ALL_TIME_CAP=100;function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=text;return node;}
const FALLBACK_ICON_CACHE={};function prizeIconSvg(name,size){const key=String(name||"star");const sizeAttr=Number(size)||18;const cached=FALLBACK_ICON_CACHE[key];const svg=(cached&&cached(sizeAttr))||"";return`<svg class="trending-prize-icon" viewBox="0 0 24 24" width="${sizeAttr}" height="${sizeAttr}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true" focusable="false">${svg}</svg>`;}
FALLBACK_ICON_CACHE.star=()=>'<path d="M11.53 2.3a.53.53 0 0 1 .94 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.9l5.16-.76a2.12 2.12 0 0 0 1.6-1.16z"/>';function prizeIconImg(prize){let src="";try{const icon=String((prize&&prize.icon)||"");if(/^assets\/[a-z0-9/_-]+\.svg$/i.test(icon))src=new URL(icon,getSiteRootUrl()).toString();}catch(_){src="";}
if(!src)return prizeIconNode("star",22);const img=el("img","trending-prize-icon");img.setAttribute("src",src);img.setAttribute("alt","");img.setAttribute("loading","lazy");img.setAttribute("decoding","async");return img;}
function prizeMonthLabel(month){const match=/^(\d{4})-(0[1-9]|1[0-2])$/.exec(String(month||""));if(!match)return String(month||"");return new Date(Date.UTC(Number(match[1]),Number(match[2])-1,1)).toLocaleString("en-GB",{month:"long",year:"numeric",timeZone:"UTC"});}
function currentUtcMonth(){return new Date().toISOString().slice(0,7);}
function prizeIconNode(name,size){const node=el("span","trending-prize-icon is-placeholder");node.setAttribute("aria-hidden","true");node.innerHTML=prizeIconSvg(name,size||22);return node;}
function renderPrizeTeaser(host,prizes){if(!host)return;const list=prizes&&Array.isArray(prizes.prizes)?prizes.prizes.filter(prize=>prize&&prize.id&&prize.title):[];const firstMonth=prizes&&/^\d{4}-(0[1-9]|1[0-2])$/.test(String(prizes.firstMonth||""))?String(prizes.firstMonth):"";host.textContent="";if(list.length!==6||new Set(list.map(prize=>prize.id)).size!==6||!firstMonth){host.hidden=true;return;}
const month=currentUtcMonth();const monthCopy=month<firstMonth?`The first prize is awarded for ${prizeMonthLabel(firstMonth)}.`:`${prizeMonthLabel(month)}'s winner chooses one of these ${list.length} prizes.`;const section=el("section","trending-prize-teaser");section.setAttribute("aria-labelledby","trending-prize-heading");const main=el("div","trending-prize-main");const heading=el("h3","trending-prize-heading");heading.id="trending-prize-heading";heading.innerHTML=prizeIconSvg("star",18);heading.appendChild(el("span","","Monthly prize"));main.appendChild(heading);main.appendChild(el("p","trending-prize-lede",`Whoever gains the most EOR Rating in a UTC calendar month wins a physical prize. ${monthCopy}`));const grid=el("ul","trending-prize-grid");list.forEach((prize)=>{const choice=el("li","trending-prize-choice");choice.appendChild(prizeIconImg(prize));choice.appendChild(el("span","",String(prize.title)));if(prize.description)choice.appendChild(el("small","",String(prize.description)));grid.appendChild(choice);});main.appendChild(grid);const more=el("details","trending-prize-more");more.appendChild(el("summary","","How the prize is awarded"));more.appendChild(el("p","",`The champion is the frozen monthly honour for EOR Rating, taken from the rating gained inside that UTC calendar month, and every tied winner shares the title. The prize is arranged after the month closes. A winner is told in their Account notifications, where they choose one prize and leave a name and university email; only the site admin sees those details, and only to arrange delivery. Nobody can claim before their month has been settled, and no prize is awarded for a month before ${prizeMonthLabel(firstMonth)}.`));main.appendChild(more);section.appendChild(main);host.appendChild(section);host.hidden=false;}
let prizeTeaserRequest=null;let prizeTeaserCache=null;function applyPrizeTeaser(prizes){prizeTeaserCache=prizes||null;const host=Array.from(document.querySelectorAll(".trending-prize-host")).find(node=>node.closest&&node.closest(".trending-block")&&node.closest(".trending-block").dataset.metric==="eor_rating");renderPrizeTeaser(host||null,prizeTeaserCache);}
function loadPrizeTeaser(){if(prizeTeaserRequest)return prizeTeaserRequest;prizeTeaserRequest=fetch(API_BASE+"/arena/prizes",{cache:"no-store",headers:{"Cache-Control":"no-cache","Pragma":"no-cache"}}).then(response=>(response&&response.ok?response.json():null)).catch(()=>null).then(data=>{applyPrizeTeaser(data&&data.prizes?data.prizes:null);return prizeTeaserCache;});return prizeTeaserRequest;}
function isUtilityPath(p){const s=String(p||"").toLowerCase();const base=(s.split("?")[0].split("#")[0].split("/").pop()||"").trim();return base==="find.html"||base==="find"||base==="custom-random.html"||base==="custom-random";}
function buildAllTimePages(totalPages,currentPage){const tp=Math.max(1,totalPages);const cur=Math.min(Math.max(1,currentPage),tp);const set=new Set([1,2,tp-1,tp,cur,cur-1,cur-2,cur+1,cur+2]);const nums=Array.from(set).filter(n=>n>=1&&n<=tp).sort((a,b)=>a-b);const out=[];let prev=0;for(const n of nums){if(prev&&n-prev>1)out.push("…");out.push(n);prev=n;}
return out;}
function buildBlock({title,metric,deferInitialLoad}){const block=el("section","trending-block");block.dataset.metric=metric||"views";if(isTrendingUserMetric(metric))block.classList.add("trending-user-block");const ratingBoard=metric==="eor_rating";const initialPeriod=isTrendingUserMetric(metric)?"all":"7d";const boardPeriods=PERIODS.map((p)=>(ratingBoard&&p.key==="all"?{...p,label:"Top 100 current EOR Ratings",shortLabel:"Current"}:p));if(metric==="collection_value"){const all=boardPeriods.find(p=>p.key==="all");if(all){all.label="Current collection market value";all.shortLabel="Current";}}
if(isTrendingUserMetric(metric)&&metric!=="collection_value")boardPeriods.splice(3,0,{key:"honors",label:"Monthly honours: past calendar-month champions",shortLabel:"Monthly honours",limit:10});const header=el("div","trending-block-header");header.appendChild(el("h2","trending-block-title",title));const tabs=el("div","trending-tabs");tabs.setAttribute("role","group");tabs.setAttribute("aria-label","Time period");boardPeriods.forEach((p)=>{const btn=el("button","trending-tab",p.shortLabel);btn.setAttribute("aria-label",p.label);btn.type="button";btn.dataset.period=p.key;tabs.appendChild(btn);});header.appendChild(tabs);const colHeadEl=el("div","trending-colhead");colHeadEl.appendChild(el("span","trending-colhead-spacer","#"));colHeadEl.appendChild(el("span","trending-colhead-left",isTrendingUserMetric(metric)?"Learner":"Concept"));if(!isTrendingUserMetric(metric))colHeadEl.appendChild(el("span","trending-colhead-course","Course · unit"));const metaHeadEl=el("span","trending-metahead trending-colhead-right",periodMetricLabel(initialPeriod,metric));colHeadEl.appendChild(metaHeadEl);const prizeHost=ratingBoard?el("div","trending-prize-host"):null;if(prizeHost)block.appendChild(prizeHost);const list=el("ol","trending-list");const footer=el("div","trending-footer");const prev=el("button","trending-page-btn");prev.type="button";prev.setAttribute("aria-label","Previous page");prev.textContent="←";const pages=el("div","trending-pages");const next=el("button","trending-page-btn");next.type="button";next.setAttribute("aria-label","Next page");next.textContent="→";footer.appendChild(prev);footer.appendChild(pages);footer.appendChild(next);const boardMeta=el("div","trending-board-meta");const boardMetaTime=el("span","trending-board-time","");boardMetaTime.setAttribute("role","status");boardMetaTime.setAttribute("aria-live","polite");const boardRefresh=el("button","trending-board-refresh");boardRefresh.type="button";boardRefresh.setAttribute("aria-label","Refresh this ranking");boardRefresh.title="Refresh this ranking from the cloud";boardRefresh.innerHTML="<span class=\"trending-board-refresh-icon\" aria-hidden=\"true\">↻</span><span class=\"trending-board-refresh-text\">Refresh</span>";boardMeta.appendChild(boardMetaTime);boardMeta.appendChild(boardRefresh);block.appendChild(header);let metricNote=metric==="users"?"XP earned in the selected period. Includes learners with public rankings.":"";let metricNoteParagraphs=metricNote?[metricNote]:[];if(metric==="collection_value"){metricNoteParagraphs=["Current market value of permanently owned items, including gifts, at undiscounted prices. Daily discounts, temporary trials and already-activated consumables do not count.","Today, week and month rank the net change in total value, including market-price rises and falls, over the current UTC day and last 7 or 30 calendar days.","When a window starts before valuation tracking began, its change is measured from the first recorded valuation and the shorter coverage is labelled; earlier market values cannot be reconstructed.","Public rankings update after cloud sync."];metricNote=metricNoteParagraphs.join(" ");}
if(metric==="spenders"){metricNote="EOR Bits spent, including gifts sent. Received gifts and credits are excluded; refunds leave original spending counted. Today uses UTC; week and month cover the last 7 and 30 calendar days. Public rankings update after cloud sync.";metricNoteParagraphs=[metricNote];}
if(metric==="eor_rating"){metricNoteParagraphs=["EOR Rating is an Elo-style score that starts at 1200. Each rated result is a game against an opponent rating: AI quiz questions count as 1000 (basic), 1200 (standard) or 1400 (challenge), duels use the other player's rating, and weekend events use a 1500-rated opponent. Beating a stronger opponent gains more; losing to a weaker one costs more.","Duels move the rating further than practice, and a ten-question weekend Quiz Sprint weighs the same as five games, settled after the event closes. Historical puzzle results keep their original rules.","Current ranks by the standing rating; today, week and month rank by how far the rating moved inside that window, using UTC and the last 7 and 30 calendar days, and a losing window is listed rather than hidden.","Only your first answer to each quiz question counts, up to 40 answers a UTC day, and answers on a concept you have recently shown you know count for less: if your best AI check on it in the last 30 days was 3 of 3, a correct basic, standard or challenge answer at 1200 adds only about 1, 2 or 3, and 2 of 3 counts three-quarters as much;","a session that recorded only a score counts each of its answers once at the standard tier; the same two players are rated at most three times a week; unfinished duels with no result change nothing.","One rated result is enough to be listed, and a rating under ten results is marked provisional because an Elo number means little that early. Quiz answers are checked in your browser, so treat the rating as a friendly learning signal, not an exam grade. Public rankings update after cloud sync."];metricNote=metricNoteParagraphs.join(" ");}
if(metric==="quiz_correct"){metricNote="Ranked by correct answers in public AI quiz practice; wrong answers are shown alongside.";metricNoteParagraphs=[metricNote];}
const honorMetricNote={users:"The monthly score is XP recorded during that UTC calendar month.",spenders:"The monthly score is actual EOR Bits charges recorded during that UTC calendar month, including gifts sent.",eor_rating:"The monthly score is the EOR Rating gained during that UTC calendar month. A month spent losing rating scores zero rather than a negative, so it has no champion claim.",}[metric]||"";let honorDetailsParagraphs=["Honours recognise completed UTC calendar months, and every tied winner shares the title. "+honorMetricNote,"Awards appear after each month closes and results are finalised. Only champions with public rankings are shown; private winners are not replaced."];let metricNoteElement=null;let metricToggleElement=null;let metricSummaryElement=null;const renderMetricParagraphs=(host,paragraphs)=>{host.textContent=paragraphs.join(" ");host.innerHTML=paragraphs.map((copy,index)=>`<p class="trending-metric-rule">${copy.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}${index < paragraphs.length - 1 ? " " : ""}</p>`).join("");};const metricSummary=(period)=>{if(metric==="eor_rating")return period==="honors"?"Monthly honours use rating gained in a completed UTC month; tied public champions share the title.":period==="all"?"Current ranks learners by their standing EOR Rating, a practice score that starts at 1200.":"This period ranks learners by EOR Rating gained or lost, rather than their current standing.";if(metric==="collection_value")return period==="all"?"Collection Value estimates permanently owned items at current, undiscounted market prices.":"This period ranks the net change in collection market value, including price rises and falls.";return"";};if(metricNote){const note=el("div","trending-user-ranking-note");metricNoteElement=note;renderMetricParagraphs(note,metricNoteParagraphs);note.id=`trending-metric-note-${metric}`;note.hidden=true;const toggle=el("button","trending-metric-toggle","How it counts");metricToggleElement=toggle;toggle.type="button";toggle.setAttribute("aria-label","How it counts");toggle.setAttribute("aria-controls",note.id);toggle.setAttribute("aria-expanded","false");const icon=el("span","trending-metric-toggle-icon","+");icon.setAttribute("aria-hidden","true");toggle.appendChild(icon);toggle.addEventListener("click",()=>{const expanded=toggle.getAttribute("aria-expanded")!=="true";toggle.setAttribute("aria-expanded",String(expanded));icon.textContent=expanded?"−":"+";note.hidden=!expanded;});boardMeta.appendChild(toggle);boardMeta.appendChild(note);if(metric==="eor_rating"||metric==="collection_value"){metricSummaryElement=el("p","trending-metric-summary",metricSummary(initialPeriod));block.appendChild(metricSummaryElement);}}
block.appendChild(boardMeta);let rivalsToggle=null,rivalsNote=null;if(isTrendingUserMetric(metric)){rivalsToggle=el("button","trending-rivals-toggle","Rivals");rivalsToggle.type="button";rivalsToggle.setAttribute("aria-pressed","false");rivalsToggle.title="Show only you and the learners you pinned as rivals";rivalsNote=el("p","trending-rivals-note");rivalsNote.setAttribute("role","status");rivalsNote.hidden=true;const rivalsBar=el("div","trending-rivals-bar");rivalsBar.appendChild(rivalsToggle);rivalsBar.appendChild(rivalsNote);block.appendChild(rivalsBar);}
const honorNote=isTrendingUserMetric(metric)?el("p","trending-honors-note","UTC monthly champions. Every tie shares the honour."):null;if(honorNote){honorNote.hidden=true;block.appendChild(honorNote);}
if(prizeHost&&prizeTeaserCache)renderPrizeTeaser(prizeHost,prizeTeaserCache);const coverageNote=metric==="collection_value"?el("p","trending-honors-note trending-collection-coverage"):null;if(coverageNote){coverageNote.hidden=true;block.appendChild(coverageNote);}
block.appendChild(colHeadEl);block.appendChild(list);block.appendChild(footer);const state={metric,period:initialPeriod,offset:0,total:0,rivalsOnly:false,};function rivalItemsFrom(list,base){const rivals=readRankingRivals(),me=String(readTrendingLocalProfile().accountKey||"").trim().toLowerCase();const keep=new Set(me?rivals.concat(me):rivals);const ranked=(Array.isArray(list)?list:[]).map((it,index)=>Object.assign({},it,{__rank:base+index+1}));const mine=ranked.find(it=>String(it.accountKey||it.account_key||"").toLowerCase()===me);const mineValue=mine?boardNumber(mine,metric):null;const out=ranked.filter(it=>keep.has(String(it.accountKey||it.account_key||"").toLowerCase())).map(it=>{const key=String(it.accountKey||it.account_key||"").toLowerCase();if(key===me||mineValue==null||!Number.isFinite(mineValue))return it;const value=boardNumber(it,metric);return Number.isFinite(value)?Object.assign({},it,{__rival:true,__gap:value-mineValue}):Object.assign({},it,{__rival:true});});const missing=rivals.filter(key=>!ranked.some(it=>String(it.accountKey||it.account_key||"").toLowerCase()===key)).length;if(rivalsNote){rivalsNote.hidden=false;rivalsNote.textContent=!rivals.length?"No rivals yet. Open a learner's profile and choose Pin as rival.":missing?`${missing} ${missing === 1 ? "rival is" : "rivals are"} not on this board for this period.`:"";if(!rivalsNote.textContent)rivalsNote.hidden=true;}
state.total=out.length;return out;}
const periodCache=new Map();const honorsPageCache=new Map();let loadToken=0;function formatBoardTime(ts){const d=new Date(Number(ts)||Date.now());const pad=(n)=>String(n).padStart(2,"0");return`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;}
function updateBoardMeta(fetchedAt,opts){if(!boardMetaTime)return;const o=opts||{};if(o.loading){boardMetaTime.textContent="Updating…";return;}
if(o.refreshFailed&&!fetchedAt){boardMetaTime.textContent="Cloud refresh failed";return;}
if(o.refreshPending){boardMetaTime.textContent="Recent activity is still being added · refresh again shortly";return;}
if(!fetchedAt){boardMetaTime.textContent="";return;}
if(o.refreshFailed){boardMetaTime.textContent=`Saved ${formatBoardTime(fetchedAt)} · cloud refresh failed`;return;}
if(o.stale){boardMetaTime.textContent=`Saved ${formatBoardTime(fetchedAt)}`;return;}
boardMetaTime.textContent=`Updated ${formatBoardTime(fetchedAt)}${o.cached ? " (cached)" : ""}`;}
function updateMetaHead(){if(metaHeadEl)metaHeadEl.textContent=periodMetricLabel(state.period,metric);colHeadEl.querySelector(".trending-colhead-spacer").textContent=state.period==="honors"?"Month":"#";}
function setActiveTab(){const wasHonors=block.classList.contains("trending-honors-active");block.classList.toggle("trending-honors-active",state.period==="honors");if(honorNote)honorNote.hidden=state.period!=="honors";if(metricSummaryElement)metricSummaryElement.textContent=metricSummary(state.period);if(metricNoteElement){renderMetricParagraphs(metricNoteElement,state.period==="honors"?honorDetailsParagraphs:metricNoteParagraphs);if(wasHonors!==(state.period==="honors")){metricNoteElement.hidden=true;metricToggleElement.setAttribute("aria-expanded","false");metricToggleElement.querySelector(".trending-metric-toggle-icon").textContent="+";}}
tabs.querySelectorAll(".trending-tab").forEach((btn)=>{btn.classList.toggle("is-active",btn.dataset.period===state.period);btn.setAttribute("aria-pressed",btn.dataset.period===state.period?"true":"false");});updateMetaHead();}
let __allTimeValidPromise=null;async function loadAllTimeValidItems(options){if(options&&options.forceFresh)__allTimeValidPromise=null;if(__allTimeValidPromise)return __allTimeValidPromise;const pending=(async()=>{const validSet=isTrendingUserMetric(metric)?null:await loadValidPathSetOnce().catch(()=>null);const out=[];const seen=new Set();const result={items:out,fetchedAt:0,status:!isTrendingUserMetric(metric)&&!validSet?{refreshFailed:true}:{}};const CHUNK=isMilestoneMetric(metric)?ALL_TIME_CAP:50;let offset=0;let total=Infinity;let guard=0;while(offset<total&&guard<200){guard++;const r=await fetchHot({metric,period:"all",limit:CHUNK,offset}).catch(()=>({items:[],total:0,refreshFailed:true,stale:true,}));if(r.refreshFailed||r.stale||r.cached||r.refreshPending){for(const key of["refreshFailed","stale","cached","refreshPending"])if(r[key])result.status[key]=true;}
result.fetchedAt=Math.max(result.fetchedAt,Number(r.fetchedAt||r.cachedAt||0)||0);const chunk=Array.isArray(r.items)?r.items:[];if(typeof r.total==="number"&&r.total>0)total=r.total;if(!chunk.length)break;for(const it of chunk){const p=isTrendingUserMetric(metric)?String((it&&(it.accountKey||it.name||it.path))||""):safePath(it&&it.path);if(!p)continue;if(!isTrendingUserMetric(metric)){if(isUtilityPath(p))continue;if(!isExistingPagePath(p,validSet))continue;}
if(seen.has(p))continue;seen.add(p);out.push(it);if(out.length>=ALL_TIME_CAP)return result;}
offset+=chunk.length;}
return result;})();__allTimeValidPromise=pending;pending.then((result)=>{if((result.status.refreshFailed||result.status.stale)&&__allTimeValidPromise===pending)__allTimeValidPromise=null;},()=>{if(__allTimeValidPromise===pending)__allTimeValidPromise=null;});return pending;}
async function load(options){const token=++loadToken;const period=state.period;if(coverageNote)coverageNote.hidden=true;const loadOptions=options&&typeof options==="object"?options:{};const forceFresh=!!loadOptions.forceFresh;const periodConfig=boardPeriods.find((x)=>x.key===period)||PERIODS[1];const limit=periodConfig.limit;if(period==="honors"&&forceFresh)honorsPageCache.clear();const cachedCandidate=(period==="honors"?honorsPageCache.get(state.offset):periodCache.get(period))||null;const cached=rankingMemoryCacheUsable(metric,cachedCandidate,Date.now())?cachedCandidate:null;if(cachedCandidate&&!cached){if(period==="honors")honorsPageCache.delete(state.offset);else periodCache.delete(period);if(period==="all")__allTimeValidPromise=null;}
const willFetch=forceFresh||!cached;list.classList.add("is-loading");list.setAttribute("aria-busy","true");if(willFetch){list.innerHTML="";list.appendChild(el("li","trending-loading","Loading..."));updateBoardMeta(0,{loading:true});}
let items=[];let fetchedAt=cached?cached.fetchedAt:0;const usedCache=!!cached&&!forceFresh;let fetchStatus=cached&&cached.status?cached.status:{};let honorGaps=period==="honors"&&cached&&Array.isArray(cached.monthOutcomes)?cached.monthOutcomes.filter(o=>!o.champion):[];if(period==="honors"){const requestedOffset=state.offset;const result=cached&&!forceFresh?cached:await fetchMonthlyHonors({metric,limit,offset:requestedOffset});if(token!==loadToken)return;fetchStatus={refreshFailed:!!result.refreshFailed};honorGaps=Array.isArray(result.monthOutcomes)?result.monthOutcomes.filter(o=>!o.champion):[];fetchedAt=result.fetchedAt;items=result.items;state.total=result.total;if(!result.refreshFailed){honorsPageCache.set(requestedOffset,result);if(requestedOffset>0&&!items.length){state.offset=Math.max(0,Math.floor((state.total-1)/limit)*limit);if(state.offset!==requestedOffset)return load({forceFresh:true});}}else honorsPageCache.delete(requestedOffset);const grace=result.graceHours!=null?` Awards are finalised at least ${formatTrendingNumber(result.graceHours)} hours after month end, once all synced results have been checked. Until then, the month remains open.`:" Awards appear after the month closes and all synced results have been checked.";honorDetailsParagraphs=["Honours recognise completed UTC calendar months, and every tied winner shares the title. "+honorMetricNote,grace.trim()+" Only champions with public rankings are shown; private winners are not replaced."];renderMetricParagraphs(metricNoteElement,honorDetailsParagraphs);}else if(period==="all"){let allItems;if(cached&&!forceFresh){allItems=Array.isArray(cached.allItems)?cached.allItems:[];}else{const result=await loadAllTimeValidItems({forceFresh}).catch(()=>({items:[],status:{refreshFailed:true,stale:true},fetchedAt:0}));if(token!==loadToken)return;allItems=result.items;fetchStatus=result.status;fetchedAt=result.fetchedAt;const cleanAllItems=Array.isArray(allItems)?allItems:[];if(!fetchedAt&&!(fetchStatus&&fetchStatus.refreshFailed&&!cleanAllItems.length))fetchedAt=Date.now();if(!fetchStatus.refreshFailed&&!fetchStatus.stale){periodCache.set(period,{fetchedAt,allItems:cleanAllItems,status:fetchStatus});}else periodCache.delete(period);}
const patchedAllItems=dedupeUserRankingItems(metric==="users"?patchCurrentUserRankingItems(Array.isArray(allItems)?allItems:[],period,{preferLocalOwnScore:!!(fetchStatus&&(fetchStatus.refreshFailed||fetchStatus.stale))}):(Array.isArray(allItems)?allItems:[])).slice(0,ALL_TIME_CAP);state.total=Math.min(ALL_TIME_CAP,patchedAllItems.length);if(state.offset>=state.total)state.offset=Math.max(0,Math.floor((state.total-1)/limit)*limit);items=state.rivalsOnly&&period!=="honors"?rivalItemsFrom(patchedAllItems,0):patchedAllItems.slice(state.offset,state.offset+limit).map((it,index)=>Object.assign({},it,{__rank:state.offset+index+1}));}else{let rawItems;if(cached&&!forceFresh){rawItems=Array.isArray(cached.rawItems)?cached.rawItems:[];}else{const oversample=Math.max(limit,60);let fetchOk=true;const r=await fetchHot({metric,period,limit:oversample,offset:0,}).catch(()=>{fetchOk=false;return{items:[],total:0,refreshFailed:true,stale:true};});if(token!==loadToken)return;rawItems=Array.isArray(r.items)?r.items:[];fetchStatus={historyComplete:r&&r.historyComplete,trackedFrom:r&&r.trackedFrom,refreshFailed:!!(r&&r.refreshFailed),stale:!!(r&&r.stale),cached:!!(r&&r.cached),refreshPending:!!(r&&r.refreshPending)};fetchedAt=Number(r&&(r.fetchedAt||r.cachedAt)||0)||0;if(!fetchedAt&&!(fetchStatus.refreshFailed&&!rawItems.length))fetchedAt=Date.now();if(fetchOk&&!fetchStatus.refreshFailed&&!fetchStatus.stale)periodCache.set(period,{fetchedAt,rawItems,status:fetchStatus});else periodCache.delete(period);}
const validSet=isTrendingUserMetric(metric)?null:await loadValidPathSetOnce().catch(()=>null);if(token!==loadToken)return;items=dedupeUserRankingItems(metric==="users"?patchCurrentUserRankingItems(rawItems,period,{preferLocalOwnScore:!!(fetchStatus&&(fetchStatus.refreshFailed||fetchStatus.stale))}):rawItems).filter((it)=>{if(isTrendingUserMetric(metric))return!!(it&&(it.name||it.title||it.username||it.displayName));const p=safePath(it&&it.path);if(!p)return false;if(isUtilityPath(p))return false;if(!isExistingPagePath(p,validSet))return false;return true;});items=state.rivalsOnly&&isTrendingUserMetric(metric)?rivalItemsFrom(items,0):items.slice(0,limit).map((it,index)=>Object.assign({},it,{__rank:index+1}));state.total=items.length;state.offset=0;}
const[lectureMap,titleMap]=items.length&&!isTrendingUserMetric(metric)?await Promise.all([loadLectureMapOnce().catch(()=>null),loadTitleMapOnce().catch(()=>null),]):[null,null];if(token!==loadToken)return;if(coverageNote){const since=Number(fetchStatus.trackedFrom);const partial=period!=="all"&&fetchStatus.historyComplete===false&&Number.isFinite(since)&&since>0;coverageNote.hidden=!partial;coverageNote.textContent=partial?`Change since ${new Date(since).toISOString().slice(0, 16).replace("T", " ")} UTC. Earlier market values were not recorded, so this window currently covers a shorter period.`:"";}
list.innerHTML="";const honorRows=period==="honors"&&!fetchStatus.refreshFailed?mergeHonorGaps(items,honorGaps,{firstPage:state.offset===0,lastPage:state.offset+limit>=state.total,newerBound:((honorsPageCache.get(state.offset-limit)||{}).items||[]).slice(-1).map(x=>x.month)[0]||"",}):null;if(honorRows&&honorRows.length){honorRows.forEach(row=>list.appendChild(row.gap?monthlyHonorGapRow(row.gap,metric):monthlyHonorRow(row.item,metric)));}else if(!items.length){const emptyCopy=period==="honors"?fetchStatus.refreshFailed?"Monthly honours could not load. Use Refresh to try again.":"No public monthly honours to display yet. Only champions with public rankings appear here.":fetchStatus&&fetchStatus.refreshFailed?"Could not refresh ranking":metric==="collection_value"?(period==="all"?"No public collections yet.":"No public collections in this period."):metric==="eor_rating"?(period==="all"?"No public EOR Ratings yet. A rating appears after your first rated answer, duel or weekend quiz run.":"No rated results in this period yet."):"No data yet";list.appendChild(el("li","trending-empty",emptyCopy));}else{items.forEach((it,idx)=>{const rank=el("span","trending-rank",String(it&&it.__rank?it.__rank:state.offset+idx+1));if(isTrendingUserMetric(metric)){let extra=null;if(it&&it.__rival&&Number.isFinite(it.__gap)){const gap=Math.round(Math.abs(it.__gap)*10)/10;extra=el("div","trending-rival-gap",gap===0?"Level with you":`${formatTrendingNumber(gap)} ${it.__gap > 0 ? "ahead of" : "behind"} you`);}
const meta=el("span",metric==="quiz_correct"?"trending-user-period-xp trending-quiz-correct-score":"trending-user-period-xp");if(metric==="quiz_correct"){meta.innerHTML=`${escapeTrendingHtml(formatQuizCorrectMetric(it))}<span class="trending-quiz-wrong">${escapeTrendingHtml(formatQuizWrongMetric(it))}</span>`;}else if(metric==="eor_rating"){meta.innerHTML=`<span class="trending-rating-value">${escapeTrendingHtml(metricValue(it, metric))}</span><span class="trending-rating-change">${ratingSecondaryHtml(it)}</span>`;}else if(metric==="collection_value"){meta.innerHTML=trendingValueWithUnit(period==="all"?formatTrendingNumber(it.collectionValue):formatRatingGain(it.score)," EOR Bits")+(period==="all"?"":`<span class="trending-rating-change">Current: ${escapeTrendingHtml(formatTrendingNumber(it.collectionValue))} EOR Bits</span>`);}else if(metric==="spenders"){meta.innerHTML=trendingValueWithUnit(formatTrendingNumber(it.spent!=null?it.spent:it.score)," EOR Bits");}else if(isMilestoneMetric(metric)){meta.textContent=metricValue(it,metric);}else{meta.innerHTML=trendingValueWithUnit(formatTrendingNumber(userPeriodXp(it))," XP");}
list.appendChild(trendingUserRow(it,metric,{leading:rank,value:meta,extra}));return;}
const li=el("li","trending-item");li.appendChild(rank);const a=el("a","trending-link");a.href=new URL(it.path,document.baseURI).toString();a.innerHTML=titleToHtml(displayTitle(it,titleMap));li.appendChild(a);const courseSpan=el("span","trending-course",displayCourseLecture(it,lectureMap));li.appendChild(courseSpan);const meta=el("span","trending-meta",metricValue(it,metric));li.appendChild(meta);list.appendChild(li);});}
if((state.period==="all"&&!state.rivalsOnly)||(state.period==="honors"&&!fetchStatus.refreshFailed)){footer.style.display="flex";const totalPages=Math.max(1,Math.ceil(state.total/limit));const currentPage=Math.floor(state.offset/limit)+1;prev.disabled=currentPage<=1;next.disabled=currentPage>=totalPages;pages.innerHTML="";const btns=buildAllTimePages(totalPages,currentPage);btns.forEach((p)=>{if(p==="…"){const dot=el("span","trending-ellipsis","…");pages.appendChild(dot);return;}
const b=el("button","trending-page-num",String(p));b.type="button";b.dataset.page=String(p);if(p===currentPage){b.classList.add("is-active");b.setAttribute("aria-current","page");}
b.setAttribute("aria-label",`Page ${p}`);pages.appendChild(b);});}else{footer.style.display="none";pages.innerHTML="";}
updateBoardMeta(fetchedAt,Object.assign({cached:usedCache},fetchStatus||{}));list.classList.remove("is-loading");list.setAttribute("aria-busy","false");if(window.MathJax&&typeof window.MathJax.typesetPromise==="function"){window.MathJax.typesetPromise([list]).catch(()=>{});}}
tabs.addEventListener("click",(e)=>{const btn=e.target&&e.target.closest(".trending-tab");if(!btn)return;state.period=btn.dataset.period;state.offset=0;setActiveTab();emitSortFilterUsed("filter",{value:state.period,period:state.period,controlKey:`trending-period:${state.period}`,triggerText:btn.textContent||state.period});updateMetaHead();load({forceFresh:isTrendingUserMetric(metric)});});tabs.addEventListener("keydown",(event)=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;const buttons=Array.from(tabs.querySelectorAll(".trending-tab"));const current=buttons.indexOf(event.target);if(current<0)return;event.preventDefault();const nextIndex=event.key==="Home"?0:event.key==="End"?buttons.length-1:(current+(event.key==="ArrowRight"?1:-1)+buttons.length)%buttons.length;buttons[nextIndex].focus();if(typeof buttons[nextIndex].scrollIntoView==="function")buttons[nextIndex].scrollIntoView({block:"nearest",inline:"nearest"});});prev.addEventListener("click",()=>{const limit=(boardPeriods.find((x)=>x.key===state.period)||PERIODS[1]).limit;state.offset=Math.max(0,state.offset-limit);load();});next.addEventListener("click",()=>{const limit=(boardPeriods.find((x)=>x.key===state.period)||PERIODS[1]).limit;state.offset=state.offset+limit;load();});pages.addEventListener("click",(e)=>{const btn=e.target&&e.target.closest(".trending-page-num");if(!btn)return;const p=Number(btn.dataset.page||"1");const limit=(boardPeriods.find((x)=>x.key===state.period)||PERIODS[1]).limit;state.offset=(p-1)*limit;load();});boardRefresh.addEventListener("click",()=>{boardRefresh.classList.add("is-busy");Promise.resolve(load({forceFresh:true})).finally(()=>boardRefresh.classList.remove("is-busy"));});block.__mkTrendingReload=function reloadTrendingBlock(options){return load(Object.assign({},options||{}));};if(rivalsToggle){const paintRivals=()=>{const signedIn=!!String(readTrendingLocalProfile().accountKey||"").trim();rivalsToggle.hidden=!signedIn;if(!signedIn&&state.rivalsOnly)state.rivalsOnly=false;rivalsToggle.setAttribute("aria-pressed",String(state.rivalsOnly));rivalsToggle.classList.toggle("is-active",state.rivalsOnly);if(!state.rivalsOnly&&rivalsNote)rivalsNote.hidden=true;};paintRivals();rivalsToggle.addEventListener("click",()=>{state.rivalsOnly=!state.rivalsOnly;state.offset=0;paintRivals();load();});const onRivalsChanged=()=>{paintRivals();if(state.rivalsOnly)load();};window.addEventListener("mk-ranking-rivals-changed",onRivalsChanged);window.addEventListener("storage",event=>{if(event&&(event.key===RIVALS_KEY||event.key==null))onRivalsChanged();});}
block.__mkTrendingResetCache=function resetTrendingBlockCache(){__allTimeValidPromise=null;periodCache.clear();honorsPageCache.clear();};setActiveTab();if(!deferInitialLoad)load();return block;}
const HOT_BADGE_TOP_LIMIT=10;const HOT_BADGE_ALL_CAP=100;const HOT_BADGE_PERIODS=[{key:"7d",label:"Top 10 Last 7 days",viewsLabel:"views in the last 7 days",limit:10},{key:"30d",label:"Top 10 Last 30 days",viewsLabel:"views in the last 30 days",limit:10},{key:"all",label:"Top 100 All time",viewsLabel:"total views",limit:100},];const __hotBadgeState={listsPromise:null,currentKey:"",currentRanks:[],popover:null,activeAnchor:null,hideTimer:0,observer:null,retryTimers:[],};function normaliseHotPathKey(pathLike){let p=safePath(pathLike).toLowerCase();try{p=decodeURIComponent(p);}catch(_){}
p=p.split("?")[0].split("#")[0].replace(/\\/g,"/").replace(/\/+/g,"/");p=p.replace(/\/index\.html$/i,"");p=p.replace(/\.html$/i,"");p=p.replace(/\/+$/g,"");return p;}
function relPathFromSiteRoot(absPathname){let p=String(absPathname||window.location.pathname||"");try{const root=new URL(getSiteRootUrl());const rootPath=root.pathname.endsWith("/")?root.pathname:root.pathname+"/";if(p.startsWith(rootPath))p=p.slice(rootPath.length);}catch(_){}
return p.replace(/^\/+/,"").replace(/\/+$/,"");}
function currentHotPathKeys(){const out=new Set();const push=(x)=>{const k=normaliseHotPathKey(x);if(k)out.add(k);};push(relPathFromSiteRoot(window.location.pathname||""));push(window.location.pathname||"");try{const canonical=document.querySelector('link[rel="canonical"]');if(canonical&&canonical.href){const u=new URL(canonical.href,document.baseURI);push(relPathFromSiteRoot(u.pathname||""));push(u.pathname||"");}}catch(_){}
return out;}
function isConceptPageForHotBadge(){const rel=relPathFromSiteRoot(window.location.pathname||"").toLowerCase();if(!rel)return false;const base=(rel.split("/").pop()||"").replace(/\.html$/i,"");if(!base)return false;if(["index","about","find","random","custom-random","trending","contributors","search","tags"].includes(base))return false;const segs=rel.split("/").filter(Boolean);return segs.length>=3;}
function hotIconSvg(size){const s=Number(size)||20;return`<svg class="mk-trending-hot-svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;}
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
function rankingsQuickShopIconSvg(){return'<svg class="mk-exact-clothes-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/><path d="M6 14.5c2.2 0 2.8-1.5 6-1.5s3.8 1.5 6 1.5"/><path d="M6 18c2.2 0 2.8-1.5 6-1.5s3.8 1.5 6 1.5"/></svg>';}
function openRankingsQuickShop(anchor){try{if(window.MkLocalActivity&&typeof window.MkLocalActivity.openQuickShop==="function"){window.MkLocalActivity.openQuickShop(anchor,{categories:["Ranking effects"],title:"Ranking effects"});}else{window.dispatchEvent(new CustomEvent("mk-open-quick-shop",{detail:{anchor,categories:["Ranking effects"],title:"Ranking effects"}}));}}catch(_){}}
function ensureRankingsQuickShopButton(h1){if(!h1)return;let btn=h1.querySelector(":scope > .mk-rankings-quick-shop-btn");if(!btn){btn=document.createElement("button");btn.type="button";btn.className="mk-quick-shop-h1-btn mk-rankings-quick-shop-btn";btn.setAttribute("aria-label","Ranking effects");btn.setAttribute("title","Ranking effects");btn.innerHTML=rankingsQuickShopIconSvg();btn.addEventListener("click",(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}
openRankingsQuickShop(btn);});h1.appendChild(btn);}
try{h1.classList.add("mk-h1-has-quick-shop");}catch(_){}}
function refreshMountedTrendingHost(host,reason){try{if(!host||host.dataset.mounted!=="1")return;const nowTs=Date.now();const last=Number(host.dataset.lastFreshRankingsReload||0)||0;if(nowTs-last<1200)return;host.dataset.lastFreshRankingsReload=String(nowTs);const active=host.querySelector(".trending-block.is-active");const targets=active?[active]:Array.from(host.querySelectorAll(".trending-block"));targets.forEach((block)=>{if(block&&typeof block.__mkTrendingReload==="function")block.__mkTrendingReload({forceFresh:true,reason:reason||"page-open"});});}catch(_){}}
function mount(){if(!isTrendingPage())return;ensureStylesOnce();syncRankingsPageTitle();document.body.classList.add("trending-page");const host=document.getElementById("trending-app");if(!host)return;if(host.dataset.mounted==="1"){refreshMountedTrendingHost(host,"page-open");return;}
host.dataset.mounted="1";const shell=el("div","trending-unified");const metricSwitch=el("div","trending-metric-switch");metricSwitch.setAttribute("role","tablist");metricSwitch.setAttribute("aria-label","Concept and user rankings");const metricRows=new Map();for(const kind of["concept","user"]){if(kind==="user"&&!accountFeatureEnabled())continue;const group=el("div","trending-metric-group");group.dataset.kind=kind;group.setAttribute("role","presentation");group.appendChild(el("p","trending-group-label",kind==="concept"?"Concepts":"Learners"));const row=el("div","trending-metric-row");row.setAttribute("role","presentation");group.appendChild(row);metricSwitch.appendChild(group);metricRows.set(kind,row);}
const wrap=el("div","trending-grid");const blocks=new Map();const initialMetric=readInitialTrendingMetric();visibleTrendingMetrics().forEach((cfg)=>{const btn=el("button","trending-metric-btn",cfg.title);btn.type="button";btn.dataset.metric=cfg.key;btn.setAttribute("role","tab");btn.setAttribute("aria-controls",`trending-panel-${cfg.key}`);metricRows.get(isTrendingUserMetric(cfg.key)?"user":"concept").appendChild(btn);const block=buildBlock({title:cfg.title,metric:cfg.key,deferInitialLoad:cfg.key!==initialMetric});block.id=`trending-panel-${cfg.key}`;block.setAttribute("role","tabpanel");block.setAttribute("aria-label",cfg.title);blocks.set(cfg.key,block);wrap.appendChild(block);});function activateMetric(metric,options){const key=normaliseTrendingMetric(metric);host.dataset.metric=key;metricSwitch.querySelectorAll(".trending-metric-btn").forEach((btn)=>{const active=btn.dataset.metric===key;btn.classList.toggle("is-active",active);btn.setAttribute("aria-selected",active?"true":"false");btn.tabIndex=active?0:-1;if(active){const group=btn.closest(".trending-metric-group");if(group&&group.clientWidth>0){const bounds=group.getBoundingClientRect();const buttonBounds=btn.getBoundingClientRect();if(buttonBounds.left<bounds.left)group.scrollLeft-=bounds.left-buttonBounds.left;else if(buttonBounds.right>bounds.right)group.scrollLeft+=buttonBounds.right-bounds.right;}}});blocks.forEach((block,blockKey)=>{const active=blockKey===key;block.hidden=!active;block.classList.toggle("is-active",active);if(active&&blockKey==="eor_rating"&&!prizeTeaserCache)loadPrizeTeaser();if(active&&!(options&&options.skipReload)&&typeof block.__mkTrendingReload==="function"){window.setTimeout(()=>block.__mkTrendingReload({reason:"metric-activated"}),0);}});if(!(options&&options.skipUrl))writeTrendingMetricToUrl(key);}
metricSwitch.addEventListener("click",(ev)=>{const btn=ev.target&&ev.target.closest?ev.target.closest(".trending-metric-btn"):null;if(!btn)return;const metric=btn.dataset.metric||"views";activateMetric(metric);emitSortFilterUsed("sort",{value:metric,metric,controlKey:`trending-metric:${metric}`,triggerText:btn.textContent||metric});});metricSwitch.addEventListener("keydown",(ev)=>{if(!ev||!["ArrowLeft","ArrowRight","Home","End"].includes(ev.key))return;const buttons=Array.from(metricSwitch.querySelectorAll(".trending-metric-btn"));if(!buttons.length)return;const cur=Math.max(0,buttons.findIndex((btn)=>btn.classList.contains("is-active")));let next=cur;if(ev.key==="ArrowLeft")next=(cur-1+buttons.length)%buttons.length;else if(ev.key==="ArrowRight")next=(cur+1)%buttons.length;else if(ev.key==="Home")next=0;else if(ev.key==="End")next=buttons.length-1;ev.preventDefault();buttons[next].focus();const metric=buttons[next].dataset.metric||"views";activateMetric(metric);emitSortFilterUsed("sort",{value:metric,metric,controlKey:`trending-metric:${metric}`,triggerText:buttons[next].textContent||metric,eventName:`keyboard-${ev.key}`});});shell.appendChild(metricSwitch);shell.appendChild(wrap);host.innerHTML="";host.appendChild(shell);activateMetric(initialMetric,{skipUrl:true,skipReload:true});}
function bootTrendingFeatures(){mount();mountHotBadge();}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",bootTrendingFeatures);}else{bootTrendingFeatures();}
document.addEventListener("DOMContentSwitch",bootTrendingFeatures);window.addEventListener("pageshow",bootTrendingFeatures,{passive:true});})();