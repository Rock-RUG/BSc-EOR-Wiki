(function(){"use strict";const STYLE_ID="mk-course-mastery-map-style-v23-pc-wider-panel";const PANEL_ID="mk-course-mastery-map";const TOGGLE_ID="mk-course-mastery-map-toggle";const STORAGE_KEY="mk_course_map_open_v1";const RECENT_WINDOW_MS=7*24*60*60*1000;const DAILY_HISTORY_KEY="mk_course_map_readiness_daily_v1";const DAILY_HISTORY_LIMIT=45;const AIQ_SESSIONS_KEY="concept_quiz_sessions_v1";const CMM_HOT_API_BASE=String((window.MkHotTrack&&window.MkHotTrack.apiBase)||window.MKDOCS_HOT_API_BASE||"https://hot.eor-wiki.workers.dev").replace(/\/+$/g,"");const CMM_DIAGNOSTICS_ITEM_ID='course_diagnostics';const CMM_DIAGNOSTICS_PRICE=500;const CMM_DIAGNOSTICS_NAME='Course Diagnostics';function q(sel,root){return(root||document).querySelector(sel);}
function escapeHtml(s){return String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function csrSimpleHash(value){const src=String(value||"").slice(0,500);let h=2166136261;for(let i=0;i<src.length;i+=1){h^=src.charCodeAt(i);h=Math.imul(h,16777619);}
return(h>>>0).toString(36);}
function getSiteRootUrl(){const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]')||document.querySelector('script[src*="assets/javascripts"]');const attr=script?script.getAttribute("src"):(link?(link.getAttribute("href")||link.getAttribute("src")):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname||"/";const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function normLoc(loc){return String(loc||"").split("#")[0].replace(/^\/+/,"").trim();}
function safeNum(v){const n=Number(v);return Number.isFinite(n)?n:0;}
function asStringList(x){if(!x)return[];if(Array.isArray(x))return x.map(String).filter(Boolean);if(typeof x==="string")return[x];return[];}
function cleanTitle(title){return String(title||"").replace(/\s+-\s+BSc EOR Wiki\s*$/i,"").replace(/\u00B6/g,"").replace(/\s*¶\s*$/u,"").replace(/\s+/g," ").trim();}
function clamp(v,min,max){const n=Number(v);if(!Number.isFinite(n))return min;return Math.min(max,Math.max(min,n));}
function clamp01(v){const n=Number(v);if(!Number.isFinite(n))return 0;if(n<=0)return 0;if(n>=1)return 1;return n;}
function cmmClamp(value,min,max){return Math.min(max,Math.max(min,value));}
function cmmPx(n){const x=Number(n);return Number.isFinite(x)?Math.max(0,Math.round(x))+'px':'0px';}
function csrConsumeGuestAction(action,detail){try{if(window.MkGuestAccess&&typeof window.MkGuestAccess.consume==="function"){return!!window.MkGuestAccess.consume(action,detail||{});}}catch(_){}
return true;}
function cmmConsumeGuestAction(action,detail){try{if(window.MkGuestAccess&&typeof window.MkGuestAccess.consume==='function'){return!!window.MkGuestAccess.consume(action,detail||{});}}catch(_){}
return true;}
function unitNounFromType(type){return String(type||"lecture").toLowerCase()==="week"?"Week":"Lecture";}
function unitInfoFromTags(tagArr){const tags=Array.isArray(tagArr)?tagArr:[];const withCourse=/^([a-z0-9]+)[-_]?(lecture|week)[-_]?0*(\d+)$/i;const bare=/^(lecture|week)[-_]?0*(\d+)$/i;for(const raw of tags){const tag=String(raw||"").trim();let match=tag.match(withCourse);if(match){const unitType=String(match[2]||"lecture").toLowerCase();const unitNum=parseInt(match[3],10)||0;const unitNoun=unitNounFromType(unitType);return{courseCode:String(match[1]||"").toLowerCase(),unitType,unitNum,unitLabel:unitNum?`${unitNoun} ${unitNum}`:unitNoun,lectureNum:unitNum,lectureLabel:unitNum?`${unitNoun} ${unitNum}`:unitNoun,};}
match=tag.match(bare);if(match){const unitType=String(match[1]||"lecture").toLowerCase();const unitNum=parseInt(match[2],10)||0;const unitNoun=unitNounFromType(unitType);return{courseCode:"",unitType,unitNum,unitLabel:unitNum?`${unitNoun} ${unitNum}`:unitNoun,lectureNum:unitNum,lectureLabel:unitNum?`${unitNoun} ${unitNum}`:unitNoun,};}}
return null;}
function lectureInfoFromTags(tags){return unitInfoFromTags(tags);}
function readAllMastery(){try{if(window.ConceptMastery&&typeof window.ConceptMastery._readAll==="function"){return window.ConceptMastery._readAll()||{};}}catch(_){}
try{const raw=localStorage.getItem("concept_mastery_v1");const obj=raw?JSON.parse(raw):{};return obj&&typeof obj==="object"?obj:{};}catch(_){return{};}}
function isExplicitRating(rec){return!!(rec&&typeof rec.m==="number"&&[0,1,2,3].includes(rec.m));}
function masteryPctFromLevel(m){if(m===3)return 100;if(m===2)return 75;if(m===1)return 35;if(m===0)return 0;return null;}
function historyEntryKind(item){const kind=String(item&&(item.kind||item.type||item.event||item.action)||'').toLowerCase().trim();if(kind==='view'||kind==='visit'||kind==='seen')return'view';return'mastery';}
function masterySourceName(item){return String(item&&item.source||'').toLowerCase().trim();}
function isAiMasterySource(source){const s=String(source||'').toLowerCase().trim();if(!s)return false;return s==='ai-mcq'||s.includes('aiq')||s.includes('ai-test')||s.includes('ai-test-mode')||s.includes('random-ai');}
function lectureRiskLabel(score){const s=Number(score)||0;if(s>=75)return'Needs review';if(s>=56)return'Low mastery readiness';if(s>=38)return'Partial mastery readiness';return'Looks secure';}
function lectureRiskToneByScore(score){const s=Number(score)||0;if(s>=75)return'is-hot';if(s>=56)return'is-mid';if(s>=38)return'is-cold';return'is-cool';}
function cmmVisitorId(){try{if(window.MkHotTrack&&typeof window.MkHotTrack.getVisitorId==='function')return window.MkHotTrack.getVisitorId();const key='mk_hot_visitor_id_v1';let id=localStorage.getItem(key);if(!id){id=(crypto&&crypto.randomUUID)?crypto.randomUUID():`v_${Date.now()}_${Math.random().toString(16).slice(2)}`;localStorage.setItem(key,id);}
return id;}catch(_){return'anonymous';}}
function publicScoreAvgLabel(type,value,count){const n=Number(value);const label=type==='mastery'?'public mastery average':'public prerequisite average';if(!Number.isFinite(n))return`No ${label} yet`;const c=Math.max(0,Math.floor(Number(count)||0));return`${Math.round(n * 10) / 10}% ${label}${c ? `from ${c}public user${c===1?'':'s'}` : ''}`;}
function todayKeyLocal(){const d=new Date();const y=d.getUTCFullYear();const m=String(d.getUTCMonth()+1).padStart(2,'0');const day=String(d.getUTCDate()).padStart(2,'0');return`${y}-${m}-${day}`;}
function shortDateLabel(dateKey){const s=String(dateKey||'');const m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return s||'today';const monthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];const monthIdx=Math.max(0,Math.min(11,Number(m[2])-1));const day=String(Number(m[3])||m[3]);return`${monthNames[monthIdx]} ${day}`;}
function mapSvg(){return`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="5" y="3.5" width="14" height="17" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></rect>
        <path d="M9.2 3.5h5.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M8 13h2.1l1.35-3.15 2.25 6.3 1.55-3.15H17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M8 8h3.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;}
function chevronSvg(){return`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M7 10l5 5 5-5"/>
      </svg>
    `;}
function cmmIsTouchLikeViewport(){try{const mm=window.matchMedia;return!!((mm&&(mm('(max-width: 900px)').matches||mm('(pointer: coarse)').matches||mm('(hover: none)').matches))||(navigator&&navigator.maxTouchPoints>0));}catch(_){return false;}}
function cmmPageScrollXNow(){try{return Math.max(0,Number(window.scrollX)||Number(window.pageXOffset)||Number(document.documentElement&&document.documentElement.scrollLeft)||Number(document.body&&document.body.scrollLeft)||0);}catch(_){return 0;}}
function cmmPageScrollYNow(){try{return Math.max(0,Number(window.scrollY)||Number(window.pageYOffset)||Number(document.documentElement&&document.documentElement.scrollTop)||Number(document.body&&document.body.scrollTop)||0);}catch(_){return 0;}}
function cmmIsIOSWebKitMobile(){try{const ua=String(navigator.userAgent||'');const platform=String(navigator.platform||'');return/iP(?:hone|ad|od)/i.test(ua)||(/Mac/i.test(platform)&&Number(navigator.maxTouchPoints||0)>1);}catch(_){return false;}}
function cmmReadSafeAreaBottomInsetPx(){try{let probe=document.getElementById('cmm-safe-area-probe');if(!probe){probe=document.createElement('div');probe.id='cmm-safe-area-probe';probe.style.cssText='position:fixed;left:0;bottom:0;visibility:hidden;pointer-events:none;height:0;padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom,0px);';(document.body||document.documentElement).appendChild(probe);}
const cs=window.getComputedStyle?window.getComputedStyle(probe):null;return Math.max(0,Math.ceil(parseFloat(cs&&cs.paddingBottom)||0));}catch(_){return 0;}}
function cmmCssLength(v,fallback){const s=String(v||'').trim();if(!s||s==='normal'||s==='auto')return fallback||'';return s;}
function cmmSetVar(el,name,value){if(!el||!el.style||!name||value==null||value==='')return;try{el.style.setProperty(name,String(value));}catch(_){}}
window.MkCMM=Object.assign(window.MkCMM||{},{STYLE_ID,PANEL_ID,TOGGLE_ID,STORAGE_KEY,RECENT_WINDOW_MS,DAILY_HISTORY_KEY,DAILY_HISTORY_LIMIT,AIQ_SESSIONS_KEY,CMM_HOT_API_BASE,CMM_DIAGNOSTICS_ITEM_ID,CMM_DIAGNOSTICS_PRICE,CMM_DIAGNOSTICS_NAME,q,escapeHtml,csrSimpleHash,getSiteRootUrl,normLoc,safeNum,asStringList,cleanTitle,clamp,clamp01,cmmClamp,cmmPx,csrConsumeGuestAction,cmmConsumeGuestAction,unitNounFromType,lectureInfoFromTags,readAllMastery,isExplicitRating,masteryPctFromLevel,historyEntryKind,masterySourceName,isAiMasterySource,lectureRiskLabel,lectureRiskToneByScore,cmmVisitorId,publicScoreAvgLabel,todayKeyLocal,shortDateLabel,mapSvg,chevronSvg,cmmIsTouchLikeViewport,cmmPageScrollXNow,cmmPageScrollYNow,cmmIsIOSWebKitMobile,cmmReadSafeAreaBottomInsetPx,cmmCssLength,cmmSetVar});})();