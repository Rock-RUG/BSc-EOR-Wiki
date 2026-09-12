(function(){"use strict";if(window.__mkLastUpdatedInstalledV3)return;window.__mkLastUpdatedInstalledV3=true;const POSITION="bottom";const EXCLUDE_BASE=new Set(["about","find","contributors","trending",]);const INSERT_CLASS="mk-last-updated-inline";const STYLE_ID="mk-last-updated-style";const HIDDEN_ATTR="data-mk-last-updated-hidden";const ORIGINAL_DISPLAY_ATTR="data-mk-last-updated-orig-display";const CHILD_SCAN_ATTR="data-mk-last-updated-child-scan";const CACHE_KEY_PREFIX="mk_last_updated_page_fact_v1:";const CACHE_TTL_MS=7*24*60*60*1000;const MAX_CHILD_PAGES_TO_CHECK=180;const CHILD_FETCH_CONCURRENCY=4;const MONTH_INDEX={january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11,jan:0,feb:1,mar:2,apr:3,jun:5,jul:6,aug:7,sep:8,sept:8,oct:9,nov:10,dec:11,};function normalisePathname(pathname){return String(pathname||"").replace(/^\/+/,"").split("?")[0].replace(/\/+$/,"");}
function getBaseSlug(){const p=normalisePathname(window.location.pathname).toLowerCase();const last=(p.split("/").pop()||"").toLowerCase();return last.replace(/\.html$/i,"");}
function shouldHandleCurrentPage(){const p=normalisePathname(window.location.pathname).toLowerCase();if(!p)return false;const base=getBaseSlug();if(EXCLUDE_BASE.has(base))return false;return true;}
function restorePreviouslyHiddenFacts(){document.querySelectorAll(`.md-source-file__fact[${HIDDEN_ATTR}="1"]`).forEach((el)=>{try{const prev=el.getAttribute(ORIGINAL_DISPLAY_ATTR);if(prev===null||prev==="")el.style.removeProperty("display");else el.style.display=prev;el.removeAttribute(HIDDEN_ATTR);el.removeAttribute(ORIGINAL_DISPLAY_ATTR);}catch(_){}});}
function parseFactText(txt){const clean=String(txt||"").replace(/\s+/g," ").trim();if(!clean)return null;let m=clean.match(/^Last\s+updated\s*:\s*(.+)$/i);if(m&&m[1])return{raw:m[1].trim(),fullLine:clean};m=clean.match(/^Last\s+modified\s*:\s*(.+)$/i);if(m&&m[1])return{raw:m[1].trim(),fullLine:clean};return null;}
function findLastUpdatedFact(root){const scope=root||document;const factEls=scope.querySelectorAll(".md-source-file__fact");for(const el of factEls){const parsed=parseFactText(el.textContent||"");if(parsed)return{el,raw:parsed.raw,fullLine:parsed.fullLine};}
return null;}
function pad2(n){const x=String(n);return x.length===1?"0"+x:x;}
function to24HourFormat(raw){const s=String(raw||"").trim();let m=s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\s+(\d{1,2})[.:](\d{2})\s*(AM|PM)$/i);if(m){const dd=m[1];const month=m[2];const yyyy=m[3];let hh=parseInt(m[4],10);const mm=m[5];const ap=m[6].toUpperCase();if(ap==="PM"&&hh<12)hh+=12;if(ap==="AM"&&hh===12)hh=0;return`${dd} ${month} ${yyyy} ${pad2(hh)}:${mm}`;}
m=s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\s+(\d{1,2})[:.](\d{2})$/);if(m){const dd=m[1];const month=m[2];const yyyy=m[3];const hh=pad2(parseInt(m[4],10));const mm=m[5];return`${dd} ${month} ${yyyy} ${hh}:${mm}`;}
return s.replace(/(\d{1,2})\.(\d{2})\b/g,"$1:$2");}
function parseDateToMs(raw){const s=String(raw||"").trim();let m=s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})(?:\s+(\d{1,2})[:.](\d{2})(?:\s*(AM|PM))?)?$/i);if(m){const day=parseInt(m[1],10);const month=MONTH_INDEX[String(m[2]||"").toLowerCase()];const year=parseInt(m[3],10);let hour=m[4]===undefined?0:parseInt(m[4],10);const minute=m[5]===undefined?0:parseInt(m[5],10);const ap=String(m[6]||"").toUpperCase();if(month!==undefined&&Number.isFinite(day)&&Number.isFinite(year)){if(ap==="PM"&&hour<12)hour+=12;if(ap==="AM"&&hour===12)hour=0;const ms=new Date(year,month,day,hour||0,minute||0,0,0).getTime();if(Number.isFinite(ms))return ms;}}
m=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/);if(m){const ms=new Date(parseInt(m[1],10),parseInt(m[2],10)-1,parseInt(m[3],10),m[4]?parseInt(m[4],10):0,m[5]?parseInt(m[5],10):0,0,0).getTime();if(Number.isFinite(ms))return ms;}
const fallback=Date.parse(s);return Number.isFinite(fallback)?fallback:null;}
function ensureStyleInjected(){if(document.getElementById(STYLE_ID))return;const style=document.createElement("style");style.id=STYLE_ID;style.textContent=`
      .${INSERT_CLASS}{
        margin-top: 12px;
        font-size: 12px;
        opacity: 0.65;
      }
      .${INSERT_CLASS}[${CHILD_SCAN_ATTR}="1"]{
        opacity: 0.5;
      }
    `;document.head.appendChild(style);}
function removeExistingInserted(){document.querySelectorAll("."+INSERT_CLASS).forEach((n)=>n.remove());}
function getInsertedLine(){return document.querySelector("."+INSERT_CLASS);}
function setInsertedLine(text,scanning){const el=getInsertedLine();if(!el)return false;el.textContent=text;if(scanning)el.setAttribute(CHILD_SCAN_ATTR,"1");else el.removeAttribute(CHILD_SCAN_ATTR);return true;}
function insertLine(text,scanning){const inner=document.querySelector("article.md-content__inner");if(!inner)return false;const p=document.createElement("p");p.className=INSERT_CLASS;p.textContent=text;if(scanning)p.setAttribute(CHILD_SCAN_ATTR,"1");if(POSITION==="top"){const h1=inner.querySelector("h1");if(h1){h1.insertAdjacentElement("afterend",p);return true;}
inner.insertAdjacentElement("afterbegin",p);return true;}
inner.insertAdjacentElement("beforeend",p);return true;}
function hideMatchedFactOnly(factEl){if(!factEl)return;try{if(!factEl.hasAttribute(HIDDEN_ATTR)){factEl.setAttribute(HIDDEN_ATTR,"1");factEl.setAttribute(ORIGINAL_DISPLAY_ATTR,factEl.style.display||"");}
factEl.style.display="none";}catch(_){}}
function pathWithoutIndex(pathname){let p=String(pathname||"").split("?")[0].split("#")[0];p=p.replace(/index\.html$/i,"");return p;}
function currentDirectoryPath(){let p=pathWithoutIndex(window.location.pathname);if(!p.endsWith("/"))p=p.replace(/[^/]*$/,"");return p||"/";}
function isProbablyHtmlPage(url){const p=url.pathname.toLowerCase();if(p.endsWith("/"))return true;if(p.endsWith(".html"))return true;if(!/\.[a-z0-9]{2,8}$/i.test(p))return true;return false;}
function collectChildPageUrls(){const article=document.querySelector("article.md-content__inner");if(!article)return[];const baseDir=currentDirectoryPath();const current=pathWithoutIndex(window.location.pathname).replace(/\/+$/,"/");const urls=new Map();article.querySelectorAll("a[href]").forEach((a)=>{const href=a.getAttribute("href")||"";if(!href||href.startsWith("#")||href.startsWith("mailto:")||href.startsWith("tel:"))return;if(a.classList.contains("headerlink"))return;let url;try{url=new URL(href,window.location.href);}catch(_){return;}
if(url.origin!==window.location.origin)return;if(!isProbablyHtmlPage(url))return;url.hash="";url.search="";const childPath=pathWithoutIndex(url.pathname);const childNorm=childPath.replace(/\/+$/,"/");if(childNorm===current)return;if(!childPath.startsWith(baseDir))return;const rest=childPath.slice(baseDir.length).replace(/^\/+/,"");if(!rest)return;if(rest.startsWith("../"))return;urls.set(url.href,url.href);});return Array.from(urls.values()).slice(0,MAX_CHILD_PAGES_TO_CHECK);}
function readCachedFact(url){try{const raw=window.localStorage.getItem(CACHE_KEY_PREFIX+url);if(!raw)return null;const parsed=JSON.parse(raw);if(!parsed||!parsed.raw||!parsed.ms)return null;if(Date.now()-Number(parsed.savedAt||0)>CACHE_TTL_MS)return null;return parsed;}catch(_){return null;}}
function writeCachedFact(url,fact){if(!fact||!fact.raw||!fact.ms)return;try{window.localStorage.setItem(CACHE_KEY_PREFIX+url,JSON.stringify({raw:fact.raw,ms:fact.ms,savedAt:Date.now()}));}catch(_){}}
async function fetchPageFact(url){const cached=readCachedFact(url);if(cached)return cached;const res=await fetch(url,{credentials:"same-origin",cache:"force-cache",});if(!res||!res.ok)return null;const html=await res.text();const doc=new DOMParser().parseFromString(html,"text/html");const fact=findLastUpdatedFact(doc);if(!fact)return null;const ms=parseDateToMs(fact.raw);if(!ms)return null;const result={raw:fact.raw,ms};writeCachedFact(url,result);return result;}
async function mapWithConcurrency(items,worker,concurrency){const results=new Array(items.length);let next=0;async function runWorker(){while(next<items.length){const i=next;next+=1;try{results[i]=await worker(items[i],i);}
catch(_){results[i]=null;}}}
const runners=[];const count=Math.max(1,Math.min(concurrency,items.length));for(let i=0;i<count;i+=1)runners.push(runWorker());await Promise.all(runners);return results;}
function shouldScanChildren(currentFact,urls){if(!currentFact||!urls.length)return false;const currentMs=parseDateToMs(currentFact.raw);if(!currentMs)return true;return urls.length>0;}
async function updateFromChildPages(currentFact){const urls=collectChildPageUrls();if(!shouldScanChildren(currentFact,urls))return;const currentMs=parseDateToMs(currentFact.raw);let best=currentMs?{raw:currentFact.raw,ms:currentMs}:null;const cachedFacts=urls.map((url)=>readCachedFact(url)).filter(Boolean);for(const fact of cachedFacts){if(!best||Number(fact.ms)>Number(best.ms))best=fact;}
if(best&&currentMs&&Number(best.ms)>Number(currentMs)){setInsertedLine(`Last updated: ${to24HourFormat(best.raw)}`,true);}
const missingUrls=urls.filter((url)=>!readCachedFact(url));const freshFacts=await mapWithConcurrency(missingUrls,fetchPageFact,CHILD_FETCH_CONCURRENCY);for(const fact of freshFacts){if(!fact||!fact.ms)continue;if(!best||Number(fact.ms)>Number(best.ms))best=fact;}
if(best){setInsertedLine(`Last updated: ${to24HourFormat(best.raw)}`,false);}}
function runOnce(){removeExistingInserted();restorePreviouslyHiddenFacts();if(!shouldHandleCurrentPage())return false;const fact=findLastUpdatedFact(document);if(!fact)return false;ensureStyleInjected();hideMatchedFactOnly(fact.el);const formatted=to24HourFormat(fact.raw);const inserted=insertLine(`Last updated: ${formatted}`,false);if(!inserted)return false;updateFromChildPages(fact).catch(function(){});return true;}
function scheduleInit(){let tries=0;const maxTries=12;function tick(){tries+=1;const done=runOnce();if(done||tries>=maxTries)return;window.setTimeout(tick,80);}
tick();}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",scheduleInit,{passive:true});}else{scheduleInit();}
document.addEventListener("DOMContentSwitch",scheduleInit);if(window.document$&&typeof window.document$.subscribe==="function"){try{window.document$.subscribe(scheduleInit);}catch(_){}}})();