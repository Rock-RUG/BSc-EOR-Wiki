(function(){function __mkFetchSearchIndex(url,init){const shared=window.__mkFetchJsonShared;if(typeof shared==="function")return shared(url,init);return fetch(url,init).then(function(r){return r&&r.ok?r.json():null;});}
const{STYLE_ID,PANEL_ID,TOGGLE_ID,STORAGE_KEY,RECENT_WINDOW_MS,DAILY_HISTORY_KEY,DAILY_HISTORY_LIMIT,AIQ_SESSIONS_KEY,CMM_HOT_API_BASE,CMM_DIAGNOSTICS_ITEM_ID,CMM_DIAGNOSTICS_PRICE,CMM_DIAGNOSTICS_NAME,q,escapeHtml,csrSimpleHash,getSiteRootUrl,normLoc,safeNum,asStringList,cleanTitle,clamp,clamp01,cmmClamp,cmmPx,csrConsumeGuestAction,cmmConsumeGuestAction,unitNounFromType,lectureInfoFromTags,readAllMastery,isExplicitRating,masteryPctFromLevel,historyEntryKind,masterySourceName,isAiMasterySource,lectureRiskLabel,lectureRiskToneByScore,cmmVisitorId,publicScoreAvgLabel,todayKeyLocal,shortDateLabel,mapSvg,chevronSvg,cmmIsTouchLikeViewport,cmmPageScrollXNow,cmmPageScrollYNow,cmmIsIOSWebKitMobile,cmmReadSafeAreaBottomInsetPx,cmmCssLength,cmmSetVar}=window.MkCMM||{};const BUILD="mk-course-mastery-map-v34-exam-origin-only";if(window.__mkCourseMasteryMapBuild===BUILD){try{if(window.MkCourseMasteryMap&&typeof window.MkCourseMasteryMap.refresh==="function"){window.MkCourseMasteryMap.refresh();}}catch(_){}
return;}
window.__mkCourseMasteryMapBuild=BUILD;const state={open:false,filters:{weak:false,unvisited:false},expandedLecture:new Set(),data:null,loadPromise:null,seq:0,refreshTimer:0,selectedConceptLoc:'',scrollToLecture:'',scrollToFocus:false,autoExpandedOnce:false,preservedScrollTop:null,prereqReadySeq:0,prereqReadyCache:new Map(),};function currentRelPath(){try{const root=new URL(getSiteRootUrl());const rootPath=root.pathname.endsWith("/")?root.pathname:root.pathname+"/";let p=String(window.location.pathname||"");if(p.startsWith(rootPath))p=p.slice(rootPath.length);return p.replace(/^\/+/,"");}catch(_){return String(window.location.pathname||"").replace(/^\/+/,"");}}
function currentCourseScope(){const rel=currentRelPath();const segs=rel.split("/").filter(Boolean);if(segs.length>=3&&/^index\.html?$/i.test(segs[segs.length-1]))segs.pop();if(segs.length>=2){return{yearSeg:segs[0],courseSeg:segs[1]};}
return{yearSeg:"",courseSeg:""};}
function getTagsFromDoc(d){const out=[];out.push(...asStringList(d&&d.tags));out.push(...asStringList(d&&d.tag));out.push(...asStringList(d&&d.meta&&d.meta.tags));out.push(...asStringList(d&&d.meta&&d.meta.tag));out.push(...asStringList(d&&d.meta&&d.meta["tags"]));return out.map((s)=>String(s||"").trim()).filter(Boolean);}
function isIndexPage(loc){const path=normLoc(loc).toLowerCase();if(!path)return true;if(path.endsWith("/"))return true;const base=(path.split("/").pop()||"");return base==="index.html"||base==="index.md";}
function isUtilityPage(loc){const base=(normLoc(loc).split("/").pop()||"").toLowerCase().replace(/\.html$/i,"");return base==="find"||base==="custom-random"||base==="search"||base==="tags"||base==="trending";}
function isRandomPage(loc){const base=(normLoc(loc).split("/").pop()||"").toLowerCase().replace(/\.html$/i,"");if(base==="random")return true;if(/^random-\d/.test(base))return true;return false;}
function isConceptPageLocation(loc){const path=normLoc(loc);if(!path)return false;if(path.endsWith("/"))return false;const segs=path.split("/").filter(Boolean);if(segs.length<3)return false;if(isIndexPage(path)||isUtilityPage(path)||isRandomPage(path))return false;return true;}
function aggregateDocsToPages(docs){const map=new Map();for(const d of(Array.isArray(docs)?docs:[])){const pageLoc=normLoc(d&&d.location);if(!pageLoc||!isConceptPageLocation(pageLoc))continue;let entry=map.get(pageLoc);if(!entry){entry={location:pageLoc,title:"",tags:new Set(),text:"",};map.set(pageLoc,entry);}
const locFull=String(d&&d.location||"");if(!entry.title&&!locFull.includes("#")&&d&&d.title)entry.title=cleanTitle(d.title);if(!entry.title&&d&&d.title)entry.title=cleanTitle(d.title);const txt=String(d&&d.text||"").trim();if(txt)entry.text+=(entry.text?"\n":"")+txt;for(const tg of getTagsFromDoc(d))entry.tags.add(tg);}
return Array.from(map.values()).map((item)=>({location:item.location,title:item.title||fileTitleFallback(item.location),tags:Array.from(item.tags),text:item.text||"",}));}
function fileTitleFallback(loc){const file=(normLoc(loc).split("/").pop()||"").replace(/\.html$/i,"");return file.replace(/[-_]+/g," ").replace(/\b\w/g,(m)=>m.toUpperCase());}
function normaliseRecord(raw){const rec=raw&&typeof raw==="object"?raw:{};if(window.ConceptMastery&&typeof window.ConceptMastery._normaliseRecord==="function"){try{return window.ConceptMastery._normaliseRecord(rec);}catch(_){}}
const hasRating=rec.unrated!==true&&rec.m!=null&&(typeof rec.m==='number'||(typeof rec.m==='string'&&rec.m.trim()!==''));const m=hasRating&&[0,1,2,3].includes(Number(rec.m))?Number(rec.m):null;const history=Array.isArray(rec.history)?rec.history.slice():[];return{m,reviewCount:safeNum(rec.reviewCount),viewCount:safeNum(rec.viewCount),visitCount:safeNum(rec.visitCount),lastReviewed:safeNum(rec.lastReviewed),lastViewed:Math.max(safeNum(rec.lastViewed),safeNum(rec.lastSeen)),visited:!!(rec.visited||safeNum(rec.visitCount)>0||safeNum(rec.viewCount)>0||safeNum(rec.lastViewed)>0),history,};}
function latestTsFromHistory(history){let best=0;for(const item of(Array.isArray(history)?history:[])){const ts=safeNum(item&&(item.ts||item.time||item.at||item.date));if(ts>best)best=ts;}
return best;}
let __cmmAiQuizCountsRaw=null;let __cmmAiQuizCountsByConcept=null;function latestViewTsFromHistory(history){let best=0;for(const item of(Array.isArray(history)?history:[])){if(historyEntryKind(item)!=='view')continue;const ts=safeNum(item&&(item.ts||item.time||item.at||item.date));if(ts>best)best=ts;}
return best;}
function isDirectMasterySource(source){const s=String(source||'').toLowerCase().trim();if(!s||s==='legacy')return false;if(isAiMasterySource(s))return false;return true;}
function directMasteryUpdateCount(rec){const hist=rec&&Array.isArray(rec.history)?rec.history:[];let count=0;hist.forEach((item)=>{if(historyEntryKind(item)!=='mastery')return;if(!isDirectMasterySource(masterySourceName(item)))return;count+=1;});return count;}
function readAiQuizCountsByConcept(){let raw='';try{raw=localStorage.getItem(AIQ_SESSIONS_KEY)||'';}catch(_){raw='';}
if(__cmmAiQuizCountsByConcept&&raw===__cmmAiQuizCountsRaw)return __cmmAiQuizCountsByConcept;const map=new Map();try{const parsed=raw?JSON.parse(raw):{};if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed)){Object.entries(parsed).forEach(([conceptId,sessions])=>{const key=normLoc(conceptId);if(!key)return;const arr=Array.isArray(sessions)?sessions:[];const count=arr.filter((session)=>{if(!session||typeof session!=='object')return false;if(session.completed_at||session.suggested_mastery!=null)return true;return Array.isArray(session.questions)&&session.questions.length>0&&session.correct_count!=null;}).length;if(count>0)map.set(key,(map.get(key)||0)+count);});}}catch(_){}
__cmmAiQuizCountsRaw=raw;__cmmAiQuizCountsByConcept=map;return map;}
function aiQuizCountForConceptLoc(loc){const key=normLoc(loc);if(!key)return 0;const map=readAiQuizCountsByConcept();if(map.has(key))return safeNum(map.get(key));return 0;}
function recencyLabel(ts){const n=safeNum(ts);if(!n)return"No activity yet";const diff=Date.now()-n;const day=24*60*60*1000;if(diff<60*60*1000)return"Active today";if(diff<day)return"Touched today";if(diff<2*day)return"Touched yesterday";const days=Math.floor(diff/day);if(days<7)return`Touched ${days} days ago`;if(days<30)return`Touched ${Math.floor(days / 7)} weeks ago`;return`Touched ${Math.floor(days / 30)} months ago`;}
function lectureHeatTone(lecture){const weakRatio=lecture.total?lecture.weak/lecture.total:0;const unratedRatio=lecture.total?(lecture.total-lecture.rated)/lecture.total:0;const visitRatio=lecture.total?lecture.visited/lecture.total:0;const readinessAvg=safeNum(lecture&&(lecture.readinessAvg??lecture.avgPct));const avg=readinessAvg/100;if(weakRatio>=0.4||unratedRatio>=0.55)return"is-hot";if(avg>=0.78&&weakRatio<=0.12&&unratedRatio<=0.25)return"is-cool";if(visitRatio<0.35)return"is-cold";return"is-mid";}
function courseTokenForPage(anchor){const fromAttr=String(anchor&&anchor.getAttribute&&anchor.getAttribute("data-course-mastery-map")||"").trim().toLowerCase();if(fromAttr)return fromAttr;const wrap=q('.course-search[data-course-token]');const fromWrap=String(wrap&&wrap.getAttribute&&wrap.getAttribute('data-course-token')||'').trim().toLowerCase();if(fromWrap)return fromWrap;const meta=document.querySelector('meta[name="tags"], meta[property="tags"]');const content=String(meta&&meta.getAttribute&&meta.getAttribute('content')||'').trim().toLowerCase();if(content){const first=content.split(',').map((x)=>x.trim()).filter(Boolean)[0];if(first)return first;}
return'';}
function pageMatchesCourse(page,token,scope){const tags=Array.isArray(page&&page.tags)?page.tags.map((x)=>String(x||'').trim().toLowerCase()):[];const lecture=lectureInfoFromTags(tags);if(token&&tags.includes(token))return true;if(token&&lecture&&lecture.courseCode===token)return true;const path=normLoc(page&&page.location);if(scope&&scope.courseSeg){const segs=path.split('/').filter(Boolean);if(segs.length>=2&&segs[1]===scope.courseSeg)return true;}
return false;}
function isCoreCurriculumPage(page){const tags=Array.isArray(page&&page.tags)?page.tags.map((value)=>String(value||'').trim().toLowerCase()):[];return!tags.includes('curriculum-enrichment')&&!tags.includes('curriculum-retired');}
function absoluteHref(loc){try{return new URL(String(loc||'').replace(/^\/+/,''),getSiteRootUrl()).toString();}catch(_){return String(loc||'');}}
function metricValueCard(label,value,helper){return`
      <div class="cmm-metric">
        <div class="cmm-metric__label">${escapeHtml(label)}</div>
        <div class="cmm-metric__value">${escapeHtml(value)}</div>
        <div class="cmm-metric__helper">${escapeHtml(helper)}</div>
      </div>
    `;}
function buildCourseDiagnosticHead(score){const hasScore=Number.isFinite(Number(score));const pct=hasScore?Math.max(0,Math.min(100,Math.round(Number(score)))):null;return`
      <div class="cmm-head">
        <div class="cmm-head__row">
          ${hasScore ? `<div class="cmm-headreadiness-wrap"><button type="button"class="cmm-headreadiness cmm-headreadiness--orb"data-cmm-course-readiness-info="1"style="${escapeHtml(readinessToneStyle(pct))}"aria-label="${escapeHtml(`Course mastery readiness ${pct}%. Lower scores mark lecture units and concepts to review first.`)}"><strong>${escapeHtml(String(pct))}%</strong><span>Course mastery</span></button><div class="cmm-readiness-help"hidden>Lower mastery readiness marks the lecture units and concepts to review first.</div></div>` : ''}
          <div class="cmm-headcopy">
            <div class="cmm-title" id="${PANEL_ID}-title">Course diagnostics</div>
            <div class="cmm-sub">A course view of visited, rated, unrated, and low-readiness concepts. Separate from prerequisite readiness.</div>
          </div>
        </div>
      </div>
    `;}
function daysSince(ts){const n=safeNum(ts);if(!n)return Infinity;return Math.max(0,(Date.now()-n)/(24*60*60*1000));}
function historySignals(history){const items=(Array.isArray(history)?history:[]).slice().sort((a,b)=>safeNum(a&&(a.ts||a.time||a.at||a.date))-safeNum(b&&(b.ts||b.time||b.at||b.date)));let weakRatings=0;let masteryEvents=0;let viewEvents=0;let flips=0;let lastMastery=null;let lastMasteryTs=0;let lastWeakTs=0;let weakAfterStrong=0;for(const item of items){const kind=String(item&&(item.kind||item.type||item.event||item.action)||'').toLowerCase().trim();const ts=safeNum(item&&(item.ts||item.time||item.at||item.date));const maybeM=item&&Object.prototype.hasOwnProperty.call(item,'m')?Number(item.m):Number(item&&(item.level??item.mastery));const isView=kind==='view'||kind==='visit'||kind==='seen';if(isView){viewEvents+=1;continue;}
if(![0,1,2,3].includes(maybeM))continue;masteryEvents+=1;if(maybeM<=1){weakRatings+=1;lastWeakTs=Math.max(lastWeakTs,ts);if(lastMastery!=null&&lastMastery>=2)weakAfterStrong+=1;}
if(lastMastery!=null&&lastMastery!==maybeM)flips+=1;lastMastery=maybeM;lastMasteryTs=Math.max(lastMasteryTs,ts);}
return{weakRatings,masteryEvents,viewEvents,flips,lastMasteryTs,lastWeakTs,weakAfterStrong};}
function lectureRiskScore(lecture){const weakRatio=lecture.total?lecture.weak/lecture.total:0;const unratedRatio=lecture.total?(lecture.total-lecture.rated)/lecture.total:0;const visitedRatio=lecture.total?lecture.visited/lecture.total:0;const avg=lecture.rated?lecture.avgPct/100:0.45;const score=(weakRatio*0.42+
unratedRatio*0.24+
(1-avg)*0.20+
(1-visitedRatio)*0.14)*100;return Math.round(clamp(score,0,100));}
function conceptSignals(concept,lectureRisk){const rec=concept&&concept.record?concept.record:null;const hist=historySignals(rec&&rec.history);const visited=!!(rec&&rec.visited);const explicit=isExplicitRating(rec);const m=explicit?rec.m:null;const activityTs=Math.max(concept&&concept.lastActivity?concept.lastActivity:0,hist.lastMasteryTs);const staleDays=daysSince(activityTs);const staleFactor=staleDays===Infinity?1:clamp01((staleDays-2)/21);const revisitLoad=clamp01((safeNum(rec&&rec.viewCount)+safeNum(rec&&rec.reviewCount)-1)/8);const weakHistory=clamp01(hist.weakRatings/4);const volatility=clamp01(hist.flips/5);const lectureFactor=clamp01((Number(lectureRisk)||0)/100);let baseWeak=0.56;if(!visited)baseWeak=1.00;else if(!explicit)baseWeak=0.74;else if(m===0)baseWeak=1.00;else if(m===1)baseWeak=0.74;else if(m===2)baseWeak=0.26;else if(m===3)baseWeak=0.00;let score=(baseWeak*0.68+
staleFactor*0.12+
revisitLoad*0.08+
weakHistory*0.06+
volatility*0.03+
lectureFactor*0.03)*100;if(!visited)score=100;else if(!explicit)score=Math.max(score,72+staleFactor*10+lectureFactor*6);else if(m===0)score=100;else if(m===1)score=Math.max(score,72+staleFactor*8+lectureFactor*5);else if(m===3&&staleFactor===0&&revisitLoad===0&&weakHistory===0&&volatility===0&&lectureFactor===0)score=0;const falseMasteryBase=explicit&&m>=2?((m===2?0.22:0.10)+
staleFactor*0.28+
clamp01(Math.max(0,safeNum(rec&&rec.viewCount)-safeNum(rec&&rec.reviewCount))/6)*0.22+
weakHistory*0.18+
clamp01(hist.weakAfterStrong/2)*0.10+
volatility*0.12)*100:0;const falseMasteryScore=Math.round(clamp(falseMasteryBase,0,100));const reasons=[];if(!visited)reasons.push('not visited yet');else if(!explicit)reasons.push('visited but not rated');else if(m===0)reasons.push('currently rated Unknown');else if(m===1)reasons.push('currently rated Unclear');else if(m===2)reasons.push('currently rated Clear');else if(m===3)reasons.push('currently rated Mastered');if(Number.isFinite(staleDays)&&staleDays>=7)reasons.push(`${Math.round(staleDays)} days since last touch`);if(safeNum(rec&&rec.viewCount)+safeNum(rec&&rec.reviewCount)>=4)reasons.push('revisited many times');if(hist.weakRatings>=2)reasons.push('multiple low ratings in history');if(hist.flips>=3)reasons.push('mastery changed several times');const weakScore=Math.round(clamp(score,0,100));const readinessScore=100-weakScore;const confidenceScore=100-falseMasteryScore;return{weakScore,readinessScore,falseMasteryScore,confidenceScore,staleDays,revisitLoad,weakHistory,volatility,lectureRisk:Number(lectureRisk)||0,history:hist,reasons,};}
function buildDiagnosis(summary){const lectureDiagnostics=(summary&&Array.isArray(summary.lectures)?summary.lectures:[]).map((lecture)=>{const riskScore=lectureRiskScore(lecture);return{lecture,lectureNum:lecture.lectureNum,label:lecture.label,readinessAvg:safeNum(lecture&&lecture.readinessAvg),riskScore,riskLabel:lectureRiskLabel(riskScore),tone:lectureRiskToneByScore(riskScore),weakRatio:lecture.total?lecture.weak/lecture.total:0,unratedRatio:lecture.total?(lecture.total-lecture.rated)/lecture.total:0,visitedRatio:lecture.total?lecture.visited/lecture.total:0,};}).sort((a,b)=>{if(b.riskScore!==a.riskScore)return b.riskScore-a.riskScore;return a.lectureNum-b.lectureNum;});const lectureRiskMap=new Map(lectureDiagnostics.map((item)=>[String(item.lectureNum),item.riskScore]));const conceptDiagnostics=(summary&&Array.isArray(summary.concepts)?summary.concepts:[]).map((concept)=>{const lectureRisk=lectureRiskMap.get(String(concept.lectureNum))||0;const signals=conceptSignals(concept,lectureRisk);return{key:concept.location,concept,lectureNum:concept.lectureNum,weakScore:signals.weakScore,readinessScore:signals.readinessScore,falseMasteryScore:signals.falseMasteryScore,confidenceScore:signals.confidenceScore,signals,};});const lectureReadinessMap=new Map();let courseReadinessSum=0;let courseReadinessCount=0;conceptDiagnostics.forEach((item)=>{const lectureKey=String(item.lectureNum);const readiness=Math.max(0,Math.min(100,safeNum(item&&item.readinessScore)));const bucket=lectureReadinessMap.get(lectureKey)||{sum:0,count:0};bucket.sum+=readiness;bucket.count+=1;lectureReadinessMap.set(lectureKey,bucket);courseReadinessSum+=readiness;courseReadinessCount+=1;});lectureDiagnostics.forEach((item)=>{const bucket=lectureReadinessMap.get(String(item.lectureNum))||{sum:0,count:0};const readinessAvg=bucket.count?Math.round(bucket.sum/bucket.count):0;item.readinessAvg=readinessAvg;if(item.lecture&&typeof item.lecture==='object')item.lecture.readinessAvg=readinessAvg;});const courseReadinessAvg=courseReadinessCount?Math.round(courseReadinessSum/courseReadinessCount):0;const byConcept=new Map(conceptDiagnostics.map((item)=>[item.key,item]));const topWeak=conceptDiagnostics.filter((item)=>item.weakScore>=40||!item.concept.record||!item.concept.record.visited||!isExplicitRating(item.concept.record)).sort((a,b)=>{if(b.weakScore!==a.weakScore)return b.weakScore-a.weakScore;return(b.signals.lectureRisk||0)-(a.signals.lectureRisk||0);}).slice(0,8);const falseMastery=conceptDiagnostics.filter((item)=>isExplicitRating(item.concept.record)&&item.concept.record.m>=2&&item.falseMasteryScore>=34).sort((a,b)=>{if(b.falseMasteryScore!==a.falseMasteryScore)return b.falseMasteryScore-a.falseMasteryScore;return b.weakScore-a.weakScore;}).slice(0,6);const mostUnratedLecture=lectureDiagnostics.slice().sort((a,b)=>{const au=a.lecture.total-a.lecture.rated;const bu=b.lecture.total-b.lecture.rated;if(bu!==au)return bu-au;return safeNum(a.readinessAvg)-safeNum(b.readinessAvg);})[0]||null;const lowestReadinessLecture=lectureDiagnostics.slice().sort((a,b)=>{const ar=Math.max(0,Math.min(100,safeNum(a&&a.readinessAvg)));const br=Math.max(0,Math.min(100,safeNum(b&&b.readinessAvg)));if(ar!==br)return ar-br;return safeNum(b&&b.lecture&&b.lecture.total)-safeNum(a&&a.lecture&&a.lecture.total);})[0]||null;const actions=[];if(lowestReadinessLecture){actions.push({kind:'lecture',lectureNum:lowestReadinessLecture.lectureNum,title:`Review ${lowestReadinessLecture.label}`,note:`Mastery readiness ${Math.max(0, Math.min(100, safeNum(lowestReadinessLecture.readinessAvg)))}% - review this unit first`,});}
if(topWeak[0]){actions.push({kind:'concept',conceptKey:topWeak[0].key,title:`Review ${topWeak[0].concept.title}`,note:`Mastery readiness ${topWeak[0].readinessScore}% - review this concept first`,});}
if(mostUnratedLecture&&(mostUnratedLecture.lecture.total-mostUnratedLecture.lecture.rated)>0){actions.push({kind:'lecture',lectureNum:mostUnratedLecture.lectureNum,title:`Rate ${mostUnratedLecture.label}`,note:`${mostUnratedLecture.lecture.total - mostUnratedLecture.lecture.rated} concepts still unrated`,});}
return{lectureDiagnostics,conceptDiagnostics,byConcept,topWeak,falseMastery,courseReadinessAvg,actions:actions.slice(0,3),};}
function ensureSelectedConcept(summary,diagnosis){const curr=String(state.selectedConceptLoc||'');if(curr&&diagnosis.byConcept.has(curr))return diagnosis.byConcept.get(curr);state.selectedConceptLoc='';return null;}
function shortRecencyLabel(ts){const n=safeNum(ts);if(!n)return'No activity';const d=daysSince(n);if(!Number.isFinite(d))return'No activity';if(d<1)return'Today';if(d<2)return'Yesterday';if(d<7)return`${Math.round(d)}d ago`;if(d<30)return`${Math.round(d / 7)}w ago`;return`${Math.round(d / 30)}mo ago`;}
function levelShort(rec){if(!rec||(!rec.visited&&!isExplicitRating(rec)))return'•';if(!isExplicitRating(rec))return'V';if(rec.m===3)return'M';if(rec.m===2)return'C';if(rec.m===1)return'F';if(rec.m===0)return'D';return'•';}
function tileStyle(entry){const weak=clamp01((entry&&entry.weakScore?entry.weakScore:0)/100);const hue=Math.round(158-weak*154);const sat=Math.round(62+weak*18);const light=Math.round(95-weak*18);const borderLight=Math.max(30,light-34);return`--cmm-h:${hue};--cmm-s:${sat}%;--cmm-l:${light}%;--cmm-bl:${borderLight}%;--cmm-a:${(0.22 + weak * 0.18).toFixed(3)};`;}
function scoreOrbStyle(entry){const weak=clamp01((entry&&entry.weakScore?entry.weakScore:0)/100);const hue=Math.round(158-weak*154);const sat=Math.round(58+weak*20);const light=Math.round(92-weak*18);const borderLight=Math.max(30,light-30);return`--cmm-h:${hue};--cmm-s:${sat}%;--cmm-l:${light}%;--cmm-bl:${borderLight}%;`;}
function readinessToneStyle(value){const pct=clampPct(value);const weak=1-(pct/100);const hue=Math.round(158-weak*154);const sat=Math.round(58+weak*20);const fillLight=Math.round(64-weak*1);const bgLight=Math.round(92-weak*17);const borderLight=Math.max(34,Math.round(fillLight-18));const inkLight=Math.max(20,Math.round(fillLight-38));return`--cmm-h:${hue};--cmm-s:${sat}%;--cmm-fill-l:${fillLight}%;--cmm-bg-l:${bgLight}%;--cmm-border-l:${borderLight}%;--cmm-ink-l:${inkLight}%;`;}
function clampPct(value){return Math.max(0,Math.min(100,safeNum(value)));}
function readinessPct(entry){return clampPct(entry&&entry.readinessScore);}
function readinessValueLabel(value){return`Mastery readiness ${clampPct(value)}%`;}
function prerequisiteReadinessValueLabel(value){return`Prerequisite readiness ${clampPct(value)}%`;}
function applyPrereqReadinessOrb(el,data){if(!el)return;const ok=!!(data&&data.status==='ok');const pct=ok?clampPct(data.pct):null;const valueEl=el.querySelector('[data-cmm-prereq-pct]');const label=ok?prerequisiteReadinessValueLabel(pct):'Prerequisite readiness unavailable';if(valueEl)valueEl.textContent=ok?`${pct}%`:'--';el.setAttribute('title',data&&data.explain?`${label}. ${data.explain}`:label);el.setAttribute('aria-label',data&&data.explain?`${label}. ${data.explain}`:label);if(ok){el.setAttribute('style',readinessToneStyle(pct));el.classList.remove('is-loading','is-unavailable');}else{el.setAttribute('style','');el.classList.toggle('is-loading',!!(data&&data.status==='loading'));el.classList.toggle('is-unavailable',!(data&&data.status==='loading'));}}
function cmmHotNetworkAllowed(){try{return!window.__mkExamMode;}catch(_){return false;}}
async function cmmApiGet(path){if(!cmmHotNetworkAllowed())return null;try{const res=await fetch(CMM_HOT_API_BASE+path,{cache:'no-store'});return res?await res.json().catch(()=>null):null;}catch(_){return null;}}
async function cmmApiPost(path,body){if(!cmmHotNetworkAllowed())return null;try{const res=await fetch(CMM_HOT_API_BASE+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body||{}),keepalive:false,});return res?await res.json().catch(()=>null):null;}catch(_){return null;}}
function applyPublicScoreAverage(panel,loc,type,data){if(!panel||!loc||!type)return;const el=Array.from(panel.querySelectorAll(`[data-cmm-public-score-avg="${type}"]`)).find((node)=>normLoc(node.getAttribute('data-cmm-public-score-for'))===normLoc(loc))||null;if(!el)return;const valueEl=el.querySelector('[data-cmm-public-score-value]');const avg=data&&data.average!=null?Number(data.average):null;const count=data&&data.count!=null?Number(data.count):0;if(Number.isFinite(avg)){const shown=`${Math.round(avg * 10) / 10}%`;if(valueEl)valueEl.textContent=shown;el.classList.remove('is-loading','is-unavailable');el.setAttribute('title',publicScoreAvgLabel(type,avg,count));el.setAttribute('aria-label',publicScoreAvgLabel(type,avg,count));}else{if(valueEl)valueEl.textContent='--';el.classList.toggle('is-loading',!!(data&&data.status==='loading'));el.classList.toggle('is-unavailable',!(data&&data.status==='loading'));const label=data&&data.status==='loading'?'Public average loading':publicScoreAvgLabel(type,null,0);el.setAttribute('title',label);el.setAttribute('aria-label',label);}}
async function syncSelectedPublicScoreAverages(panel,selected,localScores){if(!panel||!selected||!selected.concept)return;const loc=normLoc(selected.concept.location);if(!loc)return;if(!cmmHotNetworkAllowed()){applyPublicScoreAverage(panel,loc,'mastery',{status:'unavailable'});applyPublicScoreAverage(panel,loc,'prereq',{status:'unavailable'});return;}
const title=selected.concept.title||'';const scores=localScores&&typeof localScores==='object'?localScores:{};const renderSeq=state.seq;applyPublicScoreAverage(panel,loc,'mastery',{status:'loading'});applyPublicScoreAverage(panel,loc,'prereq',{status:'loading'});try{const bodyScores={};if(scores.mastery!=null&&Number.isFinite(Number(scores.mastery)))bodyScores.mastery=clampPct(scores.mastery);if(scores.prereq!=null&&Number.isFinite(Number(scores.prereq)))bodyScores.prereq=clampPct(scores.prereq);if(Object.keys(bodyScores).length){await cmmApiPost('/concept-score',{visitorId:cmmVisitorId(),path:loc,title,scores:bodyScores});}}catch(_){}
if(renderSeq!==state.seq)return;const[masteryAvg,prereqAvg]=await Promise.all([cmmApiGet(`/concept-score/average?path=${encodeURIComponent(loc)}&type=mastery&visitorId=${encodeURIComponent(cmmVisitorId())}`),cmmApiGet(`/concept-score/average?path=${encodeURIComponent(loc)}&type=prereq&visitorId=${encodeURIComponent(cmmVisitorId())}`),]);if(renderSeq!==state.seq)return;applyPublicScoreAverage(panel,loc,'mastery',masteryAvg&&masteryAvg.ok?masteryAvg:{status:'unavailable'});applyPublicScoreAverage(panel,loc,'prereq',prereqAvg&&prereqAvg.ok?prereqAvg:{status:'unavailable'});}
async function syncSelectedPrereqReadiness(panel,selected){if(!panel||!selected||!selected.concept)return;const loc=normLoc(selected.concept.location);if(!loc)return;const findOrb=()=>Array.from(panel.querySelectorAll('[data-cmm-prereq-readiness-for]')).find((node)=>normLoc(node.getAttribute('data-cmm-prereq-readiness-for'))===loc)||null;const el=findOrb();if(!el)return;const cache=state.prereqReadyCache instanceof Map?state.prereqReadyCache:(state.prereqReadyCache=new Map());if(cache.has(loc)){const cached=cache.get(loc);applyPrereqReadinessOrb(el,cached);syncSelectedPublicScoreAverages(panel,selected,{mastery:readinessPct(selected),prereq:cached&&cached.status==='ok'?clampPct(cached.pct):null});return;}
applyPrereqReadinessOrb(el,{status:'loading'});if(!window.ConceptMastery||typeof window.ConceptMastery.readinessOf!=='function'){applyPrereqReadinessOrb(el,{status:'unavailable'});syncSelectedPublicScoreAverages(panel,selected,{mastery:readinessPct(selected),prereq:null});return;}
const seq=++state.prereqReadySeq;const data=await window.ConceptMastery.readinessOf(loc,{maxDepth:2}).catch(()=>({status:'unavailable'}));if(seq!==state.prereqReadySeq)return;cache.set(loc,data);const current=findOrb();if(current)applyPrereqReadinessOrb(current,data);syncSelectedPublicScoreAverages(panel,selected,{mastery:readinessPct(selected),prereq:data&&data.status==='ok'?clampPct(data.pct):null});}
function safeReadDailyHistory(){try{const raw=localStorage.getItem(DAILY_HISTORY_KEY);const obj=raw?JSON.parse(raw):{};return obj&&typeof obj==='object'?obj:{};}catch(_){return{};}}
function safeWriteDailyHistory(obj){try{localStorage.setItem(DAILY_HISTORY_KEY,JSON.stringify(obj||{}));}catch(_){}}
function normaliseDailySnapshots(arr){return(Array.isArray(arr)?arr:[]).filter((x)=>x&&typeof x==='object'&&x.date).sort((a,b)=>String(a.date).localeCompare(String(b.date))).slice(-DAILY_HISTORY_LIMIT);}
function snapshotForCourse(summary,diagnosis){const lectures=(diagnosis&&Array.isArray(diagnosis.lectureDiagnostics)?diagnosis.lectureDiagnostics:[]).slice().sort((a,b)=>safeNum(a&&a.lectureNum)-safeNum(b&&b.lectureNum)).map((item)=>({lectureNum:safeNum(item&&item.lectureNum),label:String(item&&item.label||''),readiness:clampPct((item&&item.readinessAvg)??(item&&item.lecture&&item.lecture.readinessAvg)),}));return{date:todayKeyLocal(),ts:Date.now(),courseReadiness:clampPct(diagnosis&&diagnosis.courseReadinessAvg),totalConcepts:safeNum(summary&&summary.totals&&summary.totals.total),lectures,};}
function cmmRecordDailySnapshot(courseKey,summary,diagnosis){const key=String(courseKey||'course').replace(/[^a-z0-9|/_-]+/gi,'_').slice(0,120)||'course';const store=safeReadDailyHistory();const currentRaw=snapshotForCourse(summary,diagnosis);const arr=normaliseDailySnapshots(store[key]);const existingIdx=arr.findIndex((x)=>String(x.date)===String(currentRaw.date));let current=currentRaw;if(existingIdx>=0){const previousToday=arr[existingIdx]||{};const startCourseReadiness=previousToday.startCourseReadiness!=null?clampPct(previousToday.startCourseReadiness):clampPct(previousToday.courseReadiness);const startTs=safeNum(previousToday.startTs)||safeNum(previousToday.ts)||Date.now();const startLectureMap=new Map((Array.isArray(previousToday.lectures)?previousToday.lectures:[]).map((lec)=>[String(lec.lectureNum),lec]));current=Object.assign({},currentRaw,{startTs,startCourseReadiness,lectures:(Array.isArray(currentRaw.lectures)?currentRaw.lectures:[]).map((lec)=>{const old=startLectureMap.get(String(lec.lectureNum))||{};return Object.assign({},lec,{startReadiness:old.startReadiness!=null?clampPct(old.startReadiness):(old.readiness!=null?clampPct(old.readiness):clampPct(lec.readiness)),});}),});arr[existingIdx]=current;}else{current=Object.assign({},currentRaw,{startTs:currentRaw.ts,startCourseReadiness:clampPct(currentRaw.courseReadiness),lectures:(Array.isArray(currentRaw.lectures)?currentRaw.lectures:[]).map((lec)=>Object.assign({},lec,{startReadiness:clampPct(lec.readiness),})),});arr.push(current);}
const cleaned=normaliseDailySnapshots(arr);store[key]=cleaned;safeWriteDailyHistory(store);const previousDay=cleaned.slice().reverse().find((x)=>String(x.date)<String(current.date))||null;const hasPreviousDay=!!previousDay;const hasTodayBaseline=!hasPreviousDay&&safeNum(current.startTs)&&safeNum(current.startTs)!==safeNum(current.ts);const compareBase=hasPreviousDay?{type:'previous-day',label:shortDateLabel(previousDay.date),courseReadiness:clampPct(previousDay.courseReadiness),lectures:previousDay.lectures||[]}:(hasTodayBaseline?{type:'today-start',label:'first snapshot today',courseReadiness:clampPct(current.startCourseReadiness),lectures:(current.lectures||[]).map((lec)=>Object.assign({},lec,{readiness:lec.startReadiness}))}:null);const prevMap=new Map((compareBase&&Array.isArray(compareBase.lectures)?compareBase.lectures:[]).map((x)=>[String(x.lectureNum),x]));const lectureChanges=(Array.isArray(current.lectures)?current.lectures:[]).map((lec)=>{const prev=prevMap.get(String(lec.lectureNum));const before=prev?clampPct(prev.readiness):null;const after=clampPct(lec.readiness);return{lectureNum:lec.lectureNum,label:lec.label||`${unitNounFromType(lec && lec.unitType)} ${lec.lectureNum}`,before,after,delta:before==null?null:after-before,};}).filter((x)=>x&&x.delta!=null);lectureChanges.sort((a,b)=>{if(b.delta!==a.delta)return b.delta-a.delta;return safeNum(a.lectureNum)-safeNum(b.lectureNum);});return{key,snapshots:cleaned,current,previous:previousDay,compareBase,courseDelta:compareBase?clampPct(current.courseReadiness)-clampPct(compareBase.courseReadiness):null,lectureChanges,};}
function levelBucketKey(rec){if(!rec||(!rec.visited&&!isExplicitRating(rec)))return'notVisited';if(!isExplicitRating(rec))return'visitedOnly';if(rec.m===0)return'unknown';if(rec.m===1)return'fuzzy';if(rec.m===2)return'clear';if(rec.m===3)return'mastered';return rec.visited?'visitedOnly':'notVisited';}
function buildSelectedConceptCard(entry){if(!entry){return`
        <section class="cmm-sidecard cmm-sidecard--focus cmm-focuscard cmm-focuscard--empty">
          <div class="cmm-focuscard__body">
            <div class="cmm-focuscard__main">
              <div class="cmm-sidecard__kicker">Current focus</div>
              <div class="cmm-sidecard__title">No concept selected</div>
              <div class="cmm-sidecard__sub">Select a tile to inspect mastery, visits, AI checks, and prerequisite readiness.</div>
            </div>
          </div>
        </section>
      `;}
const concept=entry.concept;const rec=concept.record;const href=absoluteHref(concept.location);const level=levelLabel(rec);const visits=Math.max(safeNum(rec&&rec.viewCount),safeNum(rec&&rec.visitCount));const lastVisitTs=Math.max(safeNum(rec&&rec.lastViewed),latestViewTsFromHistory(rec&&rec.history));const lastVisit=lastVisitTs?shortRecencyLabel(lastVisitTs):'Not visited';const aiChecks=aiQuizCountForConceptLoc(concept.location);const selfRatings=directMasteryUpdateCount(rec);const evidenceTitle=aiChecks>0?`${aiChecks} completed AI mastery check${aiChecks === 1 ? '' : 's'} for this concept.`:`No completed AI mastery check yet. ${selfRatings} direct mastery rating${selfRatings === 1 ? '' : 's'} recorded.`;return`
      <section class="cmm-sidecard cmm-sidecard--focus cmm-focuscard">
        <div class="cmm-focuscard__body">
          <div class="cmm-focuscard__main">
            <div class="cmm-sidecard__kicker">Current focus</div>
            <a class="cmm-sidecard__title cmm-focuscard__titlelink" href="${escapeHtml(href)}" title="Open concept page">${escapeHtml(concept.title)}</a>
            <div class="cmm-focusfacts" aria-label="Selected concept details">
              <div class="cmm-focusfact"><span>Mastery</span><strong>${escapeHtml(level)}</strong></div>
              <div class="cmm-focusfact"><span>Last visit</span><strong>${escapeHtml(lastVisit)}</strong></div>
              <div class="cmm-focusfact"><span>Visits</span><strong>${escapeHtml(String(visits))}</strong></div>
              <div class="cmm-focusfact" title="${escapeHtml(evidenceTitle)}"><span>AI checks</span><strong>${escapeHtml(String(aiChecks))}</strong></div>
            </div>
          </div>
          <div class="cmm-focusorbs-stack" aria-label="Selected concept scores and public averages">
            <div class="cmm-focusorbs" aria-label="Selected concept mastery and prerequisite readiness scores">
              <div class="cmm-scoreorb cmm-scoreorb--mastery" style="${escapeHtml(scoreOrbStyle(entry))}" title="${escapeHtml(readinessValueLabel(readinessPct(entry)))}" aria-label="${escapeHtml(readinessValueLabel(readinessPct(entry)))}"><span>${escapeHtml(String(readinessPct(entry)))}%</span><small>Mastery</small></div>
              <div class="cmm-scoreorb cmm-scoreorb--prereq is-loading" data-cmm-prereq-readiness-for="${escapeHtml(concept.location)}" title="Prerequisite readiness loading" aria-label="Prerequisite readiness loading"><span data-cmm-prereq-pct>--</span><small>Prereq</small></div>
            </div>
            <div class="cmm-public-score-avgs" aria-label="Public averages for this concept">
              <div class="cmm-public-score-avg" data-cmm-public-score-avg="mastery" data-cmm-public-score-for="${escapeHtml(concept.location)}"><span>Public mastery avg</span><strong data-cmm-public-score-value>--</strong></div>
              <div class="cmm-public-score-avg" data-cmm-public-score-avg="prereq" data-cmm-public-score-for="${escapeHtml(concept.location)}"><span>Public prereq avg</span><strong data-cmm-public-score-value>--</strong></div>
            </div>
          </div>
        </div>
      </section>
    `;}
function lectureStatusCounts(lecture){const concepts=Array.isArray(lecture&&lecture.concepts)?lecture.concepts:[];const counts={total:Math.max(0,safeNum(lecture&&lecture.total)||concepts.length),notVisited:0,visitedOnly:0,unknown:0,fuzzy:0,clear:0,mastered:0,visited:0,rated:0,aiQuiz:0,directMastery:0,};concepts.forEach((concept)=>{const rec=concept&&concept.record?concept.record:null;counts.aiQuiz+=aiQuizCountForConceptLoc(concept&&concept.location);counts.directMastery+=directMasteryUpdateCount(rec);const key=levelBucketKey(rec);if(key==='notVisited')counts.notVisited+=1;else if(key==='visitedOnly')counts.visitedOnly+=1;else if(key==='unknown')counts.unknown+=1;else if(key==='fuzzy')counts.fuzzy+=1;else if(key==='clear')counts.clear+=1;else if(key==='mastered')counts.mastered+=1;if(rec&&rec.visited)counts.visited+=1;if(isExplicitRating(rec))counts.rated+=1;});if(!concepts.length&&counts.total>0){counts.rated=Math.max(0,safeNum(lecture&&lecture.rated));counts.visited=Math.max(0,safeNum(lecture&&lecture.visited));counts.notVisited=Math.max(0,counts.total-counts.visited);}
return counts;}
function pctOf(part,total){const denom=Math.max(0,safeNum(total));if(!denom)return 0;return Math.max(0,Math.min(100,Math.round((Math.max(0,safeNum(part))/denom)*100)));}
function lectureMetricForLecture(metric,lecture){const c=lectureStatusCounts(lecture);const label=lecture&&lecture.label?lecture.label:`${unitNounFromType(lecture && lecture.unitType)} ${lecture && lecture.lectureNum ? lecture.lectureNum : ''}`.trim();const lectureNum=safeNum(lecture&&lecture.lectureNum);const readiness=clampPct((lecture&&lecture.readinessAvg)??(lecture&&lecture.avgPct));let pct=0;let count=0;let denom=c.total;let meta='';let toneValue=50;let display='';if(metric.key==='readinessHigh'){pct=readiness;count=readiness;denom=c.total;toneValue=readiness;display=`${pct}%`;meta=`Highest average mastery readiness across ${c.total} concepts`;}else if(metric.key==='readinessLow'){pct=readiness;count=100-readiness;denom=c.total;toneValue=readiness;display=`${pct}%`;meta=`Lowest average mastery readiness across ${c.total} concepts`;}else if(metric.key==='mastered'){count=c.mastered;denom=c.total;pct=pctOf(count,denom);toneValue=pct;display=`${pct}%`;meta=`Highest mastered share: ${count}/${denom} concepts`;}else if(metric.key==='strong'){count=c.clear+c.mastered;denom=c.total;pct=pctOf(count,denom);toneValue=pct;display=`${pct}%`;meta=`Highest clear or mastered share: ${count}/${denom} concepts`;}else if(metric.key==='fuzzy'){count=c.fuzzy;denom=c.total;pct=pctOf(count,denom);toneValue=100-pct;display=`${pct}%`;meta=`Highest fuzzy share: ${count}/${denom} concepts`;}else if(metric.key==='visitedOnly'){count=c.visitedOnly;denom=c.visited;pct=pctOf(count,denom);toneValue=100-pct;display=`${pct}%`;meta=denom?`Highest visited but unrated share: ${count}/${denom} visited concepts`:'No visited concepts yet';}else if(metric.key==='notVisited'){count=c.notVisited;denom=c.total;pct=pctOf(count,denom);toneValue=100-pct;display=`${pct}%`;meta=`Highest not visited share: ${count}/${denom} concepts`;}else if(metric.key==='aiQuizCount'){count=c.aiQuiz;denom=Math.max(1,safeNum(metric.maxCount));pct=pctOf(count,denom);toneValue=count>0?86:25;display=String(count);meta=count===1?'1 completed AI concept check in this learning unit':`${count} completed AI concept checks in this learning unit`;}else if(metric.key==='directMasteryCount'){count=c.directMastery;denom=Math.max(1,safeNum(metric.maxCount));pct=pctOf(count,denom);toneValue=count>0?86:25;display=String(count);meta=count===1?'1 direct mastery rating submitted in this learning unit':`${count} direct mastery ratings submitted in this learning unit`;}
return{lecture,label,lectureNum,pct,count,denom,meta,toneValue,display};}
function lectureHighlightRow(metric,allLectures){const candidates=(Array.isArray(allLectures)?allLectures:[]).map((lecture)=>lectureMetricForLecture(metric,lecture)).filter((item)=>item.lecture&&item.denom>0&&(!metric.requirePositive||item.count>0)).sort((a,b)=>{if(metric.sort==='asc'){if(a.pct!==b.pct)return a.pct-b.pct;if(b.count!==a.count)return b.count-a.count;}else{if(b.pct!==a.pct)return b.pct-a.pct;if(b.count!==a.count)return b.count-a.count;}
return safeNum(a.lectureNum)-safeNum(b.lectureNum);});const item=candidates[0]||null;if(!item){const zeroLabel=metric.key==='aiQuizCount'||metric.key==='directMasteryCount'?'0':'0%';return`
        <div class="cmm-vizrow cmm-vizrow--static">
          <span class="cmm-vizrow__head">
            <span class="cmm-vizrow__award">${escapeHtml(metric.award)}</span>
            <span class="cmm-vizrow__score">${escapeHtml(zeroLabel)}</span>
          </span>
          <span class="cmm-vizrow__lecture">No learning-unit data yet</span>
          <span class="cmm-vizrow__meta">${escapeHtml(metric.empty || 'Open concepts to build this view.')}</span>
        </div>
      `;}
const width=Math.max(0,Math.min(100,safeNum(item.pct)));const fillStyle=`${readinessToneStyle(item.toneValue)}width:${escapeHtml(String(width))}%`;return`
      <button type="button" class="cmm-vizrow" data-cmm-jump-lecture="${escapeHtml(String(item.lectureNum))}">
        <span class="cmm-vizrow__head">
          <span class="cmm-vizrow__award">${escapeHtml(metric.award)}</span>
          <span class="cmm-vizrow__score" style="${escapeHtml(readinessToneStyle(item.toneValue))}">${escapeHtml(item.display)}</span>
        </span>
        <span class="cmm-vizrow__lecture">${escapeHtml(item.label)}</span>
        <span class="cmm-vizbar"><span class="cmm-vizbar__fill" style="${escapeHtml(fillStyle)}"></span></span>
        <span class="cmm-vizrow__meta">${escapeHtml(item.meta)}</span>
      </button>
    `;}
function buildLectureStatusHighlightsCard(summary){const lectures=summary&&Array.isArray(summary.lectures)?summary.lectures:[];const unitNoun=summary&&summary.unitNoun?summary.unitNoun:'Lecture';const aiCounts=lectures.map((lecture)=>lectureMetricForLecture({key:'aiQuizCount'},lecture).count);const directCounts=lectures.map((lecture)=>lectureMetricForLecture({key:'directMasteryCount'},lecture).count);const maxAiQuiz=Math.max(1,...aiCounts);const maxDirectMastery=Math.max(1,...directCounts);const metrics=[{key:'readinessLow',award:'Review first',sort:'asc'},{key:'readinessHigh',award:'Strongest unit',sort:'desc'},{key:'fuzzy',award:'Most fuzzy',sort:'desc'},{key:'visitedOnly',award:'Visited, unrated',sort:'desc'},{key:'notVisited',award:'Least opened',sort:'desc'},{key:'aiQuizCount',award:'Most AI checks',sort:'desc',maxCount:maxAiQuiz,requirePositive:true,empty:'No completed AI concept checks yet.'},{key:'directMasteryCount',award:'Most self-ratings',sort:'desc',maxCount:maxDirectMastery,requirePositive:true,empty:'No direct mastery ratings submitted yet.'},];const totalAiQuiz=aiCounts.reduce((sum,n)=>sum+safeNum(n),0);const totalDirectMastery=directCounts.reduce((sum,n)=>sum+safeNum(n),0);return`
      <section class="cmm-sidecard cmm-sidecard--chart">
        <div class="cmm-sidecard__kicker">${escapeHtml(unitNoun)} highlights</div>
        <div class="cmm-vizrows">
          ${lectures.length ? metrics.map((metric) => lectureHighlightRow(metric, lectures)).join('') : `<div class="cmm-sidecard__empty">No ${escapeHtml(unitNoun.toLowerCase())}data yet.</div>`}
        </div>
      </section>
    `;}
function changeToneClass(delta){const n=safeNum(delta);if(n>0)return'is-positive';if(n<0)return'is-negative';return'is-neutral';}
function changeArrowGlyph(delta){const n=safeNum(delta);if(n>0)return'⤴';if(n<0)return'⤵';return'→';}
function changeBeforeAfterHtml(item,changeDate){const before=clampPct(item&&item.before);const after=clampPct(item&&item.after);const tone=changeToneClass(item&&item.delta);const arrow=changeArrowGlyph(item&&item.delta);const date=escapeHtml(String(changeDate||'').trim());return['<span class="cmm-change-ba__was">Was</span> ',`<span class="cmm-change-ba__before">${before}%</span>`,' <span class="cmm-change-ba__dot">·</span> ',`<span class="cmm-change-ba__date">${date}</span>`,` <span class="cmm-change-ba__arrow ${tone}">${arrow}</span> `,`<span class="cmm-change-ba__after ${tone}">${after}%</span>`].join('');}
function buildRecentChangeCard(diagnosis){const hist=diagnosis&&diagnosis.dailyHistory?diagnosis.dailyHistory:null;const current=hist&&hist.current?hist.current:null;const compareBase=hist&&hist.compareBase?hist.compareBase:null;const changeDate=shortDateLabel(current&&current.date?current.date:todayKeyLocal());const changes=compareBase?(hist.lectureChanges||[]).filter((x)=>x&&safeNum(x.delta)!==0).slice().sort((a,b)=>{const absDiff=Math.abs(safeNum(b.delta))-Math.abs(safeNum(a.delta));if(absDiff!==0)return absDiff;if(safeNum(b.delta)!==safeNum(a.delta))return safeNum(b.delta)-safeNum(a.delta);return safeNum(a.lectureNum)-safeNum(b.lectureNum);}).slice(0,3):[];return`
      <section class="cmm-sidecard cmm-sidecard--chart">
        <div class="cmm-sidecard__kicker">Recent mastery-readiness change</div>
        <div class="cmm-change-list cmm-change-list--compact">
          ${changes.length ? changes.map((item) => `<button type="button"class="cmm-change-row cmm-change-row--${changeToneClass(item.delta)}"data-cmm-jump-lecture="${escapeHtml(String(item.lectureNum))}"><span class="cmm-change-row__label">${escapeHtml(item.label)}</span><span class="cmm-change-row__right"><span class="cmm-change-row__beforeafter ${changeToneClass(item.delta)}">${changeBeforeAfterHtml(item,changeDate)}</span></span></button>`).join('') : '<div class="cmm-sidecard__empty">No recent lecture change yet.</div>'}
        </div>
      </section>
    `;}
function buildConceptStateHistogram(diagnosis){const items=diagnosis&&Array.isArray(diagnosis.conceptDiagnostics)?diagnosis.conceptDiagnostics:[];const buckets=[{key:'notVisited',label:'Not visited',tone:0,count:0},{key:'visitedOnly',label:'Visited, unrated',tone:22,count:0},{key:'unknown',label:'Unknown',tone:0,count:0},{key:'fuzzy',label:'Unclear',tone:25,count:0},{key:'clear',label:'Clear',tone:67,count:0},{key:'mastered',label:'Mastered',tone:96,count:0},];const byKey=new Map(buckets.map((bucket)=>[bucket.key,bucket]));items.forEach((item)=>{const rec=item&&item.concept?item.concept.record:null;const bucket=byKey.get(levelBucketKey(rec))||byKey.get('notVisited');bucket.count+=1;});const total=Math.max(1,items.length);const maxCount=Math.max(1,...buckets.map((b)=>b.count));return`
      <section class="cmm-sidecard cmm-sidecard--chart">
        <div class="cmm-sidecard__kicker">Concept status distribution</div>
        <div class="cmm-sidecard__sub">Counted from your concept states.</div>
        <div class="cmm-histrows cmm-histrows--states">
          ${buckets.map((bucket) => {
            const width = Math.round((bucket.count / maxCount) * 100);
            const share = Math.round((bucket.count / total) * 100);
            return `<div class="cmm-histrow cmm-histrow--state"><span class="cmm-histrow__label">${escapeHtml(bucket.label)}</span><span class="cmm-histbar"><span class="cmm-histbar__fill"style="${escapeHtml(readinessToneStyle(bucket.tone))}width:${escapeHtml(String(width))}%"></span></span><span class="cmm-histrow__count">${escapeHtml(String(bucket.count))}</span><span class="cmm-histrow__share">${escapeHtml(String(share))}%</span></div>`;
          }).join('')}
        </div>
      </section>
    `;}
function buildHeatmapRow(lecture,diagnosis){const diag=(diagnosis&&diagnosis.lectureDiagnostics||[]).find((item)=>item.lectureNum===lecture.lectureNum)||null;const tone=diag?diag.tone:lectureHeatTone(lecture);const score=Math.max(0,Math.min(100,safeNum((diag&&diag.readinessAvg)??lecture.readinessAvg)));const concepts=Array.isArray(lecture.concepts)?lecture.concepts:[];return`
      <div class="cmm-row ${tone}">
        <button type="button" class="cmm-row__label" data-cmm-jump-lecture="${escapeHtml(String(lecture.lectureNum))}">
          <span class="cmm-row__title">${escapeHtml(lecture.label)}</span>
          <span class="cmm-row__meta">
            <span class="cmm-row__meta-line">${escapeHtml(`${lecture.weak}low-rated`)}</span>
            <span class="cmm-row__meta-line">${escapeHtml(`${lecture.total-lecture.rated}unrated`)}</span>
          </span>
        </button>
        <div class="cmm-row__tiles">
          ${concepts.map((concept) => {
            const entry = diagnosis.byConcept.get(concept.location);
            const rec = concept.record;
            const isActive = state.selectedConceptLoc === concept.location;
            const tileTitle = `${concept.title}· ${levelLabel(rec)}· ${readinessValueLabel(entry?readinessPct(entry):0)}`;
            return `<button
type="button"
class="cmm-tile ${levelClass(rec)} ${isActive ? 'is-active' : ''}"
data-cmm-select-concept="${escapeHtml(concept.location)}"
title="${escapeHtml(tileTitle)}"
aria-label="${escapeHtml(tileTitle)}"
style="${tileStyle(entry)}"><span class="cmm-tile__txt">${escapeHtml(levelShort(rec))}</span></button>`;
          }).join('')}
        </div>
        <div class="cmm-row__risk">
          <span class="cmm-riskchip" style="${escapeHtml(readinessToneStyle(score))}" title="${escapeHtml(`${lecture.label}· ${readinessValueLabel(score)}`)}">${escapeHtml(String(score))}%</span><span class="cmm-row__risklabel">Mastery readiness</span>
        </div>
      </div>
    `;}
function buildVisualStage(summary,diagnosis){const selected=ensureSelectedConcept(summary,diagnosis);const unitNoun=summary&&summary.unitNoun?summary.unitNoun:'Lecture';return`
      <div class="cmm-stage">
        <section class="cmm-stage__main">
          <div class="cmm-stagehead">
            <div>
              <div class="cmm-sidecard__kicker">${escapeHtml(unitNoun)} concept tiles</div>
              <div class="cmm-stagehead__sub">Each square is one concept. Click a tile to inspect it.</div>
            </div>
            <div class="cmm-legend">
              <span class="cmm-legend__label">Low mastery readiness</span>
              <span class="cmm-legend__bar"></span>
              <span class="cmm-legend__label">High mastery readiness</span>
            </div>
          </div>
          <div class="cmm-heatmap">
            ${(summary && summary.lectures ? summary.lectures : []).map((lecture) => buildHeatmapRow(lecture, diagnosis)).join('') || `<div class="cmm-error">No ${escapeHtml(unitNoun.toLowerCase())}data yet.</div>`}
          </div>
        </section>
        <aside class="cmm-stage__side">
          ${buildLectureStatusHighlightsCard(summary)}
          ${buildRecentChangeCard(diagnosis)}
          ${buildConceptStateHistogram(diagnosis)}
        </aside>
      </div>
    `;}
function levelLabel(rec){if(!rec)return"Not visited";if(!rec.visited&&!isExplicitRating(rec))return"Not visited";if(!isExplicitRating(rec))return"Visited";if(rec.m===3)return"Mastered";if(rec.m===2)return"Clear";if(rec.m===1)return"Unclear";if(rec.m===0)return"Unknown";return rec.visited?"Visited":"Not visited";}
function levelClass(rec){if(!rec)return"is-none";if(!rec.visited&&!isExplicitRating(rec))return"is-none";if(!isExplicitRating(rec))return"is-visit";if(rec.m===3)return"is-m3";if(rec.m===2)return"is-m2";if(rec.m===1)return"is-m1";if(rec.m===0)return"is-m0";return"is-none";}
function matchesFilters(concept){const rec=concept.record;const wantWeak=!!state.filters.weak;const wantUnvisited=!!state.filters.unvisited;if(!wantWeak&&!wantUnvisited)return true;const isWeak=!!(rec&&isExplicitRating(rec)&&(rec.m===0||rec.m===1));const isUnvisited=!rec||!rec.visited;if(wantWeak&&wantUnvisited)return isWeak||isUnvisited;if(wantWeak)return isWeak;if(wantUnvisited)return isUnvisited;return true;}
function summariseData(pages){const masteryAll=readAllMastery();const lectures=new Map();const now=Date.now();const concepts=pages.map((page)=>{const record=normaliseRecord(masteryAll[normLoc(page.location)]);const tags=Array.isArray(page.tags)?page.tags:[];const lectureInfo=lectureInfoFromTags(tags);const unitType=lectureInfo&&lectureInfo.unitType?lectureInfo.unitType:"lecture";const lectureNum=lectureInfo&&lectureInfo.lectureNum?lectureInfo.lectureNum:0;const pct=isExplicitRating(record)?masteryPctFromLevel(record.m):null;const lastActivity=Math.max(safeNum(record.lastViewed),safeNum(record.lastReviewed),latestTsFromHistory(record.history));const recent=!!(lastActivity&&now-lastActivity<=RECENT_WINDOW_MS);const concept={location:normLoc(page.location),title:cleanTitle(page.title),tags,lectureNum,unitType,record,pct,lastActivity,recent,};if(!lectures.has(lectureNum)){lectures.set(lectureNum,{lectureNum,unitType,concepts:[],total:0,visited:0,rated:0,weak:0,recent:0,avgPct:0,sumPct:0,});}
const lec=lectures.get(lectureNum);if(unitType==="week")lec.unitType="week";lec.concepts.push(concept);lec.total+=1;if(record&&record.visited)lec.visited+=1;if(isExplicitRating(record)){lec.rated+=1;lec.sumPct+=pct||0;if(record.m===0||record.m===1)lec.weak+=1;}
if(recent)lec.recent+=1;return concept;});const lectureList=Array.from(lectures.values()).sort((a,b)=>{const la=a.lectureNum>0?a.lectureNum:Number.MAX_SAFE_INTEGER;const lb=b.lectureNum>0?b.lectureNum:Number.MAX_SAFE_INTEGER;if(la!==lb)return la-lb;return a.concepts.length-b.concepts.length;}).map((lecture)=>{lecture.avgPct=lecture.rated?Math.round(lecture.sumPct/lecture.rated):0;lecture.label=lecture.lectureNum>0?`${unitNounFromType(lecture.unitType)} ${lecture.lectureNum}`:'Other';lecture.concepts.sort((a,b)=>{const aw=a.record&&isExplicitRating(a.record)&&(a.record.m===0||a.record.m===1)?1:0;const bw=b.record&&isExplicitRating(b.record)&&(b.record.m===0||b.record.m===1)?1:0;if(bw!==aw)return bw-aw;const av=a.record&&a.record.visited?1:0;const bv=b.record&&b.record.visited?1:0;if(av!==bv)return av-bv;return String(a.title||'').localeCompare(String(b.title||''),undefined,{sensitivity:'base'});});return lecture;});const total=concepts.length;const visited=concepts.filter((x)=>x.record&&x.record.visited).length;const rated=concepts.filter((x)=>x.record&&isExplicitRating(x.record)).length;const weak=concepts.filter((x)=>x.record&&isExplicitRating(x.record)&&(x.record.m===0||x.record.m===1)).length;const recent=concepts.filter((x)=>x.recent).length;const avgPct=rated?Math.round(concepts.reduce((acc,x)=>acc+(x.pct||0),0)/rated):0;const latestConcept=concepts.filter((x)=>x.lastActivity>0).sort((a,b)=>b.lastActivity-a.lastActivity)[0]||null;const unitNoun=lectureList.some((lecture)=>lecture&&lecture.unitType==='week')?'Week':'Lecture';return{concepts,lectures:lectureList,unitNoun,totals:{total,visited,rated,weak,recent,avgPct},latestConcept,};}
async function loadCourseMapData(anchor){const courseToken=courseTokenForPage(anchor);const scope=currentCourseScope();const key=`${courseToken}|${scope.yearSeg}|${scope.courseSeg}`;if(state.data&&state.data.key===key){state.data.summary=summariseData(state.data.pages);return state.data;}
if(state.loadPromise&&state.loadPromise.key===key)return state.loadPromise;const promise=(async()=>{const root=getSiteRootUrl();const url=new URL('search/search_index.json',root).toString();const request=__mkFetchSearchIndex(url,{cache:'no-cache'});const j=await request;if(!j||!Array.isArray(j.docs)){[window.__mkSharedJsonPromiseMap,window.__mkMaterialSearchIndexPromises].forEach((cache)=>{if(cache&&cache[url]===request)delete cache[url];});throw new Error('Invalid course search index');}
const pages=aggregateDocsToPages(j.docs).filter((page)=>pageMatchesCourse(page,courseToken,scope)).filter(isCoreCurriculumPage);const data={key,courseToken,scope,pages,summary:summariseData(pages),};if(state.loadPromise===promise)state.data=data;return data;})();promise.key=key;state.loadPromise=promise;try{return await promise;}finally{if(state.loadPromise===promise)state.loadPromise=null;}}
function cmmIOSCompleteToolbarOcclusionPx(){if(!cmmIsTouchLikeViewport()||!cmmIsIOSWebKitMobile())return 0;try{const vv=window.visualViewport;const layoutH=Math.max(1,Number(window.innerHeight)||Number(document.documentElement&&document.documentElement.clientHeight)||1);const vvBottom=vv?((Number(vv.offsetTop)||0)+(Number(vv.height)||0)):layoutH;const visualGap=vv?Math.max(0,Math.round(layoutH-vvBottom)):0;let screenH=0;try{screenH=Math.max(Number(window.screen&&window.screen.height)||0,Number(window.screen&&window.screen.width)||0);}catch(_){screenH=0;}
const safe=Math.max(0,cmmReadSafeAreaBottomInsetPx());const screenGap=screenH>0?Math.max(0,Math.round(screenH-layoutH-safe)):0;const raw=Math.max(visualGap,screenGap);if(raw<56)return 0;return cmmClamp(raw,64,260);}catch(_){return 0;}}
function cmmUpdateViewportMetrics(){try{const modal=document.getElementById('mk-course-mastery-map-modal');if(!state.open||!modal||modal.hidden)return;const setModalVar=(name,value)=>{if(modal.style.getPropertyValue(name)!==value)modal.style.setProperty(name,value);};const vv=window.visualViewport;const layoutW=Math.max(1,Number(window.innerWidth)||Number(document.documentElement&&document.documentElement.clientWidth)||1);const layoutH=Math.max(1,Number(window.innerHeight)||Number(document.documentElement&&document.documentElement.clientHeight)||1);const vvLeft=vv?(Number(vv.offsetLeft)||0):0;const vvTop=vv?(Number(vv.offsetTop)||0):0;const vvW=vv&&Number(vv.width)?Number(vv.width):layoutW;const vvH=vv&&Number(vv.height)?Number(vv.height):layoutH;const vvBottom=vvTop+vvH;if(vvH>0)setModalVar('--cmm-vh',cmmPx(vvH));if(!cmmIsTouchLikeViewport()){setModalVar('--cmm-mobile-top-pad','0px');setModalVar('--cmm-mobile-bottom-pad','0px');['--cmm-doc-left','--cmm-doc-top','--cmm-doc-width','--cmm-doc-height','--cmm-visible-height','--cmm-ios-hidden-tail'].forEach((name)=>{try{modal.style.removeProperty(name);}catch(_){}});const dialog=q('.cmm-modal__dialog',modal);if(dialog)dialog.classList.remove('cmm-ios-bottom-continued');return;}
const safeStrip=Math.max(cmmReadSafeAreaBottomInsetPx(),vv?Math.max(0,Math.round(layoutH-vvBottom)):0,cmmIOSCompleteToolbarOcclusionPx());const visibleBottom=vv?Math.max(0,vvBottom):layoutH;const layoutBottom=Math.max(layoutH,visibleBottom)+Math.max(0,safeStrip);const docLeft=cmmPageScrollXNow()+vvLeft;const docTop=cmmPageScrollYNow()+vvTop;const docHeight=Math.max(80,Math.ceil(layoutBottom-vvTop));const visibleHeight=Math.max(80,Math.ceil(vvH||layoutH));const hiddenTail=Math.max(0,Math.ceil(docHeight-visibleHeight));const vars={'--cmm-doc-left':cmmPx(docLeft),'--cmm-doc-top':cmmPx(docTop),'--cmm-doc-width':cmmPx(vvW||layoutW),'--cmm-doc-height':cmmPx(docHeight),'--cmm-visible-height':cmmPx(visibleHeight),'--cmm-ios-hidden-tail':cmmPx(hiddenTail),'--cmm-mobile-top-pad':'0px','--cmm-mobile-bottom-pad':'0px',};Object.keys(vars).forEach((name)=>{try{setModalVar(name,vars[name]);}catch(_){}});const dialog=q('.cmm-modal__dialog',modal);if(dialog)dialog.classList.toggle('cmm-ios-bottom-continued',hiddenTail>12||safeStrip>12);}catch(_){}}
function cmmBindViewportMetricsOnce(){if(window.__cmmViewportMetricsBoundV22)return;window.__cmmViewportMetricsBoundV22=true;const update=()=>cmmUpdateViewportMetrics();try{window.addEventListener('resize',update,{passive:true});}catch(_){window.addEventListener('resize',update);}
try{window.addEventListener('orientationchange',()=>window.setTimeout(update,80),{passive:true});}catch(_){window.addEventListener('orientationchange',()=>window.setTimeout(update,80));}
try{if(window.visualViewport){window.visualViewport.addEventListener('resize',update,{passive:true});window.visualViewport.addEventListener('scroll',update,{passive:true});}}catch(_){}}
function ensureStyles(){cmmUpdateViewportMetrics();cmmBindViewportMetricsOnce();if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
      .cmm-h1-row{
        display:flex;
        align-items:center;
        gap:12px;
        flex-wrap:wrap;
      }
      .cmm-h1-row .cmm-h1-text{
        min-width:0;
        flex:1 1 auto;
      }
      .cmm-h1-entry-wrap{
        flex:0 0 auto;
        display:flex;
        align-items:center;
      }
      .cmm-h1-entry{
        --cmm-entry-height: 58px;
        --cmm-entry-text-color: var(--md-default-fg-color);
        --cmm-entry-icon-size: 18px;
        height: var(--cmm-entry-height, 58px);
        min-height: var(--cmm-entry-height, 58px);
        box-sizing:border-box;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:var(--cmm-entry-gap, .56rem);
        padding:var(--cmm-entry-padding, 0 1.12rem 0 1.04rem);
        border-radius:var(--cmm-entry-radius, 16px);
        border:1px solid rgba(82,102,255,.34);
        background: linear-gradient(135deg, rgba(82,102,255,.14), rgba(128,92,255,.08));
        color:var(--cmm-entry-text-color, var(--md-default-fg-color)) !important;
        font-family:var(--cmm-entry-font-family, inherit);
        font-size:var(--cmm-entry-font-size, inherit);
        font-weight:var(--cmm-entry-font-weight, inherit);
        font-style:var(--cmm-entry-font-style, inherit);
        line-height:var(--cmm-entry-line-height, normal);
        letter-spacing:var(--cmm-entry-letter-spacing, normal);
        text-transform:var(--cmm-entry-text-transform, none);
        white-space:nowrap;
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
        cursor:pointer;
        transition: transform .14s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease, color .18s ease;
      }
      .cmm-h1-entry__icon{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        flex:0 0 auto;
        width:var(--cmm-entry-icon-size, 18px);
        height:var(--cmm-entry-icon-size, 18px);
        padding:0;
        margin:0;
        color:inherit !important;
        background:none !important;
        border:0 !important;
        box-shadow:none !important;
      }
      .cmm-h1-entry__icon svg{
        width:var(--cmm-entry-icon-size, 18px);
        height:var(--cmm-entry-icon-size, 18px);
        display:block;
        color:inherit !important;
        background:none !important;
        border:0 !important;
        box-shadow:none !important;
        fill:none !important;
        stroke:none !important;
        filter:none !important;
      }
      .cmm-h1-entry__icon svg *,
      .cmm-h1-entry__icon svg path,
      .cmm-h1-entry__icon svg line,
      .cmm-h1-entry__icon svg polyline{
        color:inherit !important;
        stroke: currentColor !important;
        fill: none !important;
        background:none !important;
        filter:none !important;
        opacity:1 !important;
      }
      .cmm-h1-entry__icon svg [stroke]{
        stroke: currentColor !important;
      }
      .cmm-h1-entry__icon svg [fill="none"]{
        fill: none !important;
      }
      .cmm-h1-entry__icon svg [fill]:not([fill="none"]){
        fill: none !important;
      }
      .cmm-h1-entry__label{
        display:inline-block;
      }
      .cmm-h1-entry:hover{
        transform: translateY(-1px);
        border-color: rgba(82,102,255,.50);
        background: linear-gradient(135deg, rgba(82,102,255,.18), rgba(128,92,255,.12));
        box-shadow: 0 14px 34px rgba(82,102,255,.14), var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
      }
      .cmm-h1-entry svg,
      .cmm-cta svg,
      .cmm-filter svg,
      .cmm-lecture__chev svg{
        width:var(--cmm-entry-icon-size, 18px);
        height:var(--cmm-entry-icon-size, 18px);
        display:block;
        flex:0 0 auto;
        color:currentColor;
      }
      html.cmm-modal-open,
      body.cmm-modal-open{
        overflow:hidden;
      }
      .cmm-modal{
        position:fixed;
        inset:0;
        z-index:2147483000;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
      }
      .cmm-modal[hidden]{ display:none !important; }
      .cmm-modal__backdrop{
        position:absolute;
        inset:0;
        background: rgba(12, 16, 24, .42);
        backdrop-filter: blur(10px) saturate(1.04);
        -webkit-backdrop-filter: blur(10px) saturate(1.04);
        pointer-events:auto;
        cursor:default;
      }
      .cmm-modal__dialog{
        position:relative;
        width:min(1180px, calc(100vw - 28px));
        max-height:calc(100vh - 28px);
        overflow:auto;
        border-radius:22px;
        box-shadow: 0 28px 72px rgba(0,0,0,.28);
        z-index:1;
      }
      .cmm-modal__close{
        position:absolute;
        top:14px;
        right:14px;
        width:38px;
        height:38px;
        border:1px solid rgba(0,0,0,.10);
        border-radius:999px;
        background: color-mix(in srgb, var(--md-default-bg-color) 90%, transparent);
        color:inherit;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        font-size:1.25rem;
        line-height:1;
        cursor:pointer;
        z-index:3;
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
        outline:none !important;
        -webkit-tap-highlight-color:transparent;
        appearance:none;
        -webkit-appearance:none;
        user-select:none;
      }
      .cmm-modal__close:hover{
        transform: translateY(-1px);
      }
      .cmm-modal__close:focus,
      .cmm-modal__close:focus-visible,
      .cmm-modal__close:active{
        outline:none !important;
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10)) !important;
      }
      #${PANEL_ID}{
        --cmm-panel-bg: #f2f3f5;
        margin: 0;
        border-radius: 22px;
        border: 1px solid rgba(0,0,0,.10);
        background: var(--cmm-panel-bg) !important;
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
        overflow: hidden;
      }
      #${PANEL_ID}[hidden]{ display:none !important; }
      #${PANEL_ID} .cmm-head{
        padding: 1rem 3.8rem .85rem 1rem;
        border-bottom: 1px solid rgba(0,0,0,.08);
      }
      #${PANEL_ID} .cmm-head__row{
        display:grid;
        grid-template-columns: 92px minmax(0, 1fr);
        gap: 1rem;
        align-items:center;
      }
      #${PANEL_ID} .cmm-headreadiness{
        min-width:0;
        border:1px solid var(--cmm-readiness-border, rgba(0,0,0,.10));
        background:var(--cmm-readiness-bg, color-mix(in srgb,var(--md-default-bg-color) 90%,transparent));
        color:var(--cmm-readiness-fg, var(--md-default-fg-color));
        border-radius:18px;
        padding:.58rem .7rem .62rem;
        box-shadow:0 10px 24px rgba(0,0,0,.04);
      }
      #${PANEL_ID} .cmm-headreadiness--orb{
        width:86px;
        height:86px;
        border-radius:999px;
        padding:.42rem;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        text-align:center;
        background:
          radial-gradient(circle at 34% 30%, rgba(255,255,255,.36), transparent 46%),
          linear-gradient(145deg,
            color-mix(in srgb, var(--cmm-readiness-bg, var(--md-default-bg-color)) 94%, white 6%),
            color-mix(in srgb, var(--cmm-readiness-bg, var(--md-default-bg-color)) 86%, var(--cmm-readiness-fg, var(--md-default-fg-color)) 14%)
          );
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.24), 0 12px 28px rgba(0,0,0,.08);
      }
      #${PANEL_ID} .cmm-headreadiness span{
        display:block;
        font-size:.50rem;
        font-weight:800;
        line-height:.98;
        opacity:.82;
      }
      #${PANEL_ID} .cmm-headreadiness strong{
        display:block;
        margin:0 0 .12rem;
        font-size:1.18rem;
        line-height:.96;
        font-weight:900;
        letter-spacing:-.02em;
      }
      #${PANEL_ID} .cmm-headcopy{
        min-width:0;
      }
      #${PANEL_ID} .cmm-kicker{
        display:flex;
        align-items:center;
        gap:10px;
        font-size:.88rem;
        font-weight:700;
        letter-spacing:0;
        opacity:.82;
        margin-bottom:.35rem;
      }
      #${PANEL_ID} .cmm-kicker svg{ width:18px; height:18px; display:block; }
      #${PANEL_ID} .cmm-title{
        font-size:1.15rem;
        font-weight:800;
        line-height:1.2;
      }
      #${PANEL_ID} .cmm-sub{
        margin-top:.35rem;
        opacity:.82;
        font-size:.95rem;
      }
      #${PANEL_ID} .cmm-body{
        padding: 1rem;
        display:grid;
        gap: 1rem;
      }
      #${PANEL_ID} .cmm-toprow{
        display:grid;
        grid-template-columns: minmax(260px, .38fr) minmax(560px, 1.62fr);
        gap:1rem;
        align-items:stretch;
      }
      #${PANEL_ID} .cmm-metrics{
        display:grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap:.75rem;
        align-items:stretch;
      }
      #${PANEL_ID} .cmm-metric{
        border-radius:14px;
        border:1px solid rgba(0,0,0,.08);
        background: color-mix(in srgb, var(--md-default-bg-color) 90%, transparent);
        padding:.9rem .88rem;
        min-width:0;
        min-height:7.15rem;
        display:flex;
        flex-direction:column;
        justify-content:center;
      }
      #${PANEL_ID} .cmm-metric__label{
        font-size:.72rem;
        opacity:.72;
        letter-spacing:0;
        line-height:1.24;
        font-weight:700;
      }
      #${PANEL_ID} .cmm-metric__value{
        margin-top:.34rem;
        font-weight:800;
        font-size:.98rem;
        line-height:1.12;
      }
      #${PANEL_ID} .cmm-metric__helper{
        margin-top:.24rem;
        font-size:.74rem;
        opacity:.72;
        line-height:1.28;
      }
      #${PANEL_ID} .cmm-actions{
        display:flex;
        gap:.65rem;
        flex-wrap:wrap;
        align-items:center;
      }
      #${PANEL_ID} .cmm-cta,
      #${PANEL_ID} .cmm-filter{
        appearance:none;
        border:1px solid rgba(0,0,0,.12);
        background: color-mix(in srgb, var(--md-default-bg-color) 90%, transparent);
        color:inherit;
        border-radius:999px;
        padding:.6rem 1rem;
        display:inline-flex;
        align-items:center;
        gap:.52rem;
        cursor:pointer;
        font-weight:700;
        line-height:1;
      }
      #${PANEL_ID} .cmm-filter{
        font-size:.84rem;
        font-weight:500;
        padding:.44rem .74rem;
      }
      #${PANEL_ID} .cmm-cta:hover,
      #${PANEL_ID} .cmm-filter:hover{
        background: color-mix(in srgb, var(--md-default-bg-color) 82%, var(--md-accent-fg-color, var(--md-primary-fg-color)) 18%);
      }
      #${PANEL_ID} .cmm-cta[disabled]{
        opacity:.45;
        cursor:default;
      }
      #${PANEL_ID} .cmm-filters{
        display:flex;
        gap:.55rem;
        flex-wrap:wrap;
      }
      #${PANEL_ID} .cmm-filter.is-on{
        border-color: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 58%, transparent);
        background: color-mix(in srgb, var(--md-default-bg-color) 76%, var(--md-accent-fg-color, var(--md-primary-fg-color)) 24%);
      }
      #${PANEL_ID} .cmm-lectures{
        display:grid;
        gap:.8rem;
      }
      #${PANEL_ID} .cmm-lecture{
        border-radius:16px;
        border:1px solid rgba(0,0,0,.10);
        background: color-mix(in srgb, var(--md-default-bg-color) 92%, transparent);
        overflow:hidden;
      }
      #${PANEL_ID} .cmm-lecture.is-hot{
        background: linear-gradient(135deg, rgba(226, 104, 84, .16), rgba(226, 104, 84, .06));
      }
      #${PANEL_ID} .cmm-lecture.is-mid{
        background: linear-gradient(135deg, rgba(63,81,181,.14), rgba(0,150,136,.10));
      }
      #${PANEL_ID} .cmm-lecture.is-cool{
        background: linear-gradient(135deg, rgba(0,150,136,.16), rgba(0,150,136,.05));
      }
      #${PANEL_ID} .cmm-lecture.is-cold{
        background: linear-gradient(135deg, rgba(120,140,255,.10), rgba(120,140,255,.03));
      }
      #${PANEL_ID} .cmm-lecture__btn{
        width:100%;
        border:0;
        background:transparent;
        color:inherit;
        display:grid;
        grid-template-columns: minmax(0, 1fr) auto auto;
        gap:.62rem;
        padding:.82rem .92rem;
        text-align:left;
        align-items:center;
        cursor:pointer;
      }
      #${PANEL_ID} .cmm-lecture__left{ min-width:0; }
      #${PANEL_ID} .cmm-lecture__title{
        font-weight:800;
        line-height:1.2;
        font-size:1.08rem;
      }
      #${PANEL_ID} .cmm-lecture__meta{
        margin-top:.18rem;
        opacity:.78;
        font-size:.9rem;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-lecture__stats{
        display:flex;
        gap:.32rem;
        flex-wrap:wrap;
        justify-content:flex-end;
      }
      #${PANEL_ID} .cmm-chip{
        border-radius:999px;
        border:1px solid rgba(0,0,0,.10);
        background: rgba(255,255,255,.46);
        padding:.32rem .62rem;
        font-size:.84rem;
        font-weight:700;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-chip--readiness{
        border-color: hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-border-l, 48%), .52);
        background: hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-bg-l, 82%), .70);
        color: hsl(var(--cmm-h, 140) 72% var(--cmm-ink-l, 26%));
      }
      #${PANEL_ID} .cmm-lecture__chev{
        width:30px;
        height:30px;
        border-radius:999px;
        border:1px solid rgba(0,0,0,.08);
        display:inline-flex;
        align-items:center;
        justify-content:center;
        background: rgba(255,255,255,.38);
        transition: transform .16s ease;
      }
      #${PANEL_ID} .cmm-lecture.is-open .cmm-lecture__chev{
        transform: rotate(180deg);
      }
      #${PANEL_ID} .cmm-lecture__body{
        padding: 0 .9rem .9rem;
        display:grid;
        gap:.42rem;
      }
      #${PANEL_ID} .cmm-lecture__body[hidden]{
        display:none !important;
      }
      #${PANEL_ID} .cmm-lecture__empty{
        padding:.2rem 0 .1rem;
        opacity:.74;
        font-size:.88rem;
      }
      #${PANEL_ID} .cmm-concept{
        display:grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap:.58rem;
        align-items:center;
        padding:.62rem .72rem;
        border-radius:13px;
        border:1px solid rgba(0,0,0,.08);
        background: color-mix(in srgb, var(--md-default-bg-color) 92%, transparent);
      }
      #${PANEL_ID} .cmm-dot{
        width:9px;
        height:9px;
        border-radius:999px;
        background: rgba(0,0,0,.18);
      }
      #${PANEL_ID} .cmm-dot.is-m3{ background:#c79400; }
      #${PANEL_ID} .cmm-dot.is-m2{ background:#7d8da7; }
      #${PANEL_ID} .cmm-dot.is-m1{ background:#cc7e38; }
      #${PANEL_ID} .cmm-dot.is-m0{ background:#c25757; }
      #${PANEL_ID} .cmm-dot.is-visit{ background:#4d87b2; }
      #${PANEL_ID} .cmm-dot.is-none{ background: rgba(0,0,0,.16); }
      #${PANEL_ID} .cmm-concept__title{
        min-width:0;
        font-weight:700;
        font-size:1rem;
        line-height:1.18;
        text-decoration:none;
      }
      #${PANEL_ID} .cmm-concept__title:hover{ text-decoration:underline; }
      #${PANEL_ID} .cmm-concept__meta{
        font-size:.76rem;
        opacity:.66;
        margin-top:.1rem;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-state{
        font-size:.76rem;
        font-weight:700;
        padding:.24rem .5rem;
        border-radius:999px;
        border:1px solid rgba(0,0,0,.09);
        background: rgba(255,255,255,.56);
        white-space:nowrap;
        align-self:center;
      }
      #${PANEL_ID} .cmm-state.is-m3{ color:#8a6700; }
      #${PANEL_ID} .cmm-state.is-m2{ color:#5d6e87; }
      #${PANEL_ID} .cmm-state.is-m1{ color:#9c5d21; }
      #${PANEL_ID} .cmm-state.is-m0{ color:#983d3d; }
      #${PANEL_ID} .cmm-state.is-visit{ color:#2d6f9d; }
      #${PANEL_ID} .cmm-state.is-none{ color:inherit; opacity:.75; }
      #${PANEL_ID} .cmm-loading,
      #${PANEL_ID} .cmm-error{
        padding: .95rem 1rem 1.05rem;
        opacity:.82;
      }

      #${PANEL_ID} .cmm-stage{
        display:grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(300px, .95fr);
        gap: 1rem;
        align-items:start;
      }
      #${PANEL_ID} .cmm-stage__main,
      #${PANEL_ID} .cmm-sidecard{
        border-radius:18px;
        border:1px solid rgba(0,0,0,.08);
        background: color-mix(in srgb, var(--md-default-bg-color) 90%, transparent);
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
      }
      #${PANEL_ID} .cmm-stage__main{
        padding:.9rem;
      }
      #${PANEL_ID} .cmm-stagehead{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:1rem;
        margin-bottom:.8rem;
        flex-wrap:wrap;
      }
      #${PANEL_ID} .cmm-stagehead__title{
        font-size:1.02rem;
        font-weight:800;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-stagehead__sub{
        margin-top:.18rem;
        opacity:.76;
        font-size:.86rem;
        line-height:1.24;
      }
      #${PANEL_ID} .cmm-legend{
        display:grid;
        grid-template-columns:max-content minmax(130px,1fr) max-content;
        align-items:center;
        gap:.58rem;
        width:100%;
        min-width:0;
        font-size:.76rem;
        opacity:.82;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-legend__bar{
        width:100%;
        min-width:0;
        height:10px;
        display:inline-block;
        position:relative;
        overflow:hidden;
        box-sizing:border-box;
        padding:0;
        border:0;
        border-radius:999px;
        background:transparent;
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.08);
        isolation:isolate;
      }
      #${PANEL_ID} .cmm-legend__bar::before{
        content:"";
        position:absolute;
        inset:0;
        border-radius:inherit;
        background: linear-gradient(90deg, hsl(7 78% 63%) 0%, hsl(42 84% 69%) 50%, hsl(150 60% 78%) 100%);
        background-repeat:no-repeat;
        background-size:100% 100%;
        z-index:-1;
      }
      #${PANEL_ID} .cmm-heatmap{
        display:grid;
        gap:.62rem;
      }
      #${PANEL_ID} .cmm-row{
        display:grid;
        grid-template-columns: minmax(96px, 116px) minmax(0, 1fr) minmax(92px, auto);
        gap:.42rem;
        align-items:center;
        padding:.7rem .72rem;
        border-radius:16px;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(255,255,255,.42);
      }
      #${PANEL_ID} .cmm-row.is-hot{ background: linear-gradient(135deg, rgba(226,104,84,.14), rgba(226,104,84,.04)); }
      #${PANEL_ID} .cmm-row.is-mid{ background: linear-gradient(135deg, rgba(255,183,77,.14), rgba(255,183,77,.04)); }
      #${PANEL_ID} .cmm-row.is-cold{ background: linear-gradient(135deg, rgba(120,140,255,.10), rgba(120,140,255,.03)); }
      #${PANEL_ID} .cmm-row.is-cool{ background: linear-gradient(135deg, rgba(0,150,136,.12), rgba(0,150,136,.04)); }
      #${PANEL_ID} .cmm-row__label{
        border:0;
        background:transparent;
        color:inherit;
        text-align:left;
        padding:0;
        cursor:pointer;
      }
      #${PANEL_ID} .cmm-row__title{
        display:block;
        font-weight:800;
        font-size:.92rem;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-row__meta{
        display:grid;
        gap:.04rem;
        margin-top:.18rem;
        opacity:.72;
        font-size:.74rem;
        line-height:1.08;
      }
      #${PANEL_ID} .cmm-row__meta-line{
        display:block;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-row__tiles{
        display:flex;
        flex-wrap:wrap;
        gap:.36rem;
        align-items:center;
        justify-content:flex-start;
        min-width:0;
      }
      #${PANEL_ID} .cmm-tile{
        width:22px;
        height:22px;
        border-radius:8px;
        border:1px solid hsla(var(--cmm-h, 140), 70%, var(--cmm-bl, 56%), .52);
        background: hsla(var(--cmm-h, 140), var(--cmm-s, 64%), var(--cmm-l, 92%), .98);
        color: hsla(var(--cmm-h, 140), 72%, 24%, .98);
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:0;
        cursor:pointer;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.28), 0 4px 10px rgba(0,0,0,.05);
        transition: transform .14s ease, box-shadow .18s ease, border-color .18s ease;
      }
      #${PANEL_ID} .cmm-tile:hover,
      #${PANEL_ID} .cmm-tile.is-active{
        transform: translateY(-1px) scale(1.06);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.36), 0 8px 18px rgba(0,0,0,.10);
      }
      #${PANEL_ID} .cmm-tile.is-active{
        border-color: var(--md-accent-fg-color, var(--md-primary-fg-color));
        outline: 2px solid color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 24%, transparent);
        outline-offset: 1px;
      }
      #${PANEL_ID} .cmm-tile__txt{
        font-size:.62rem;
        font-weight:800;
        line-height:1;
        opacity:.9;
      }
      #${PANEL_ID} .cmm-row__risk{
        display:grid;
        justify-items:end;
        gap:.16rem;
        min-width:92px;
      }
      #${PANEL_ID} .cmm-riskchip{
        min-width:40px;
        text-align:center;
        border-radius:999px;
        border:1px solid hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-border-l, 48%), .58);
        background: hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-bg-l, 82%), .78);
        color: hsl(var(--cmm-h, 140) 72% var(--cmm-ink-l, 26%));
        padding:.24rem .48rem;
        font-size:.78rem;
        font-weight:800;
      }
      #${PANEL_ID} .cmm-row__risklabel{
        font-size:.66rem;
        opacity:.72;
        text-transform:none;
        letter-spacing:.005em;
      }
      #${PANEL_ID} .cmm-stage__side{
        display:grid;
        gap:.8rem;
      }
      #${PANEL_ID} .cmm-sidecard{
        padding:.76rem .82rem;
      }
      #${PANEL_ID} .cmm-sidecard__kicker{
        font-size:.72rem;
        font-weight:800;
        opacity:.72;
        text-transform:none;
        letter-spacing:.005em;
      }
      #${PANEL_ID} .cmm-sidecard__title{
        margin-top:.22rem;
        font-size:.98rem;
        font-weight:800;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-focuscard__titlelink{
        display:block;
        color:inherit;
        text-decoration:none;
        text-underline-offset:.16em;
        max-width:100%;
      }
      #${PANEL_ID} .cmm-focuscard__titlelink:hover{
        color:var(--md-primary-fg-color);
        text-decoration:underline;
      }
      #${PANEL_ID} .cmm-focuscard__lecture{
        margin-top:.32rem;
        color:var(--md-default-fg-color--light);
        font-size:.82rem;
        font-weight:750;
        line-height:1.15;
      }
      #${PANEL_ID} .cmm-sidecard__sub{
        margin-top:.2rem;
        opacity:.76;
        font-size:.82rem;
        line-height:1.24;
      }
      #${PANEL_ID} .cmm-sidecard__list,
      #${PANEL_ID} .cmm-clusters,
      #${PANEL_ID} .cmm-actionsgrid{
        display:grid;
        gap:.5rem;
        margin-top:.65rem;
      }
      #${PANEL_ID} .cmm-sidecard__empty{
        opacity:.7;
        font-size:.82rem;
        line-height:1.22;
      }
      #${PANEL_ID} .cmm-focuscard{
        min-width:0;
        min-height:0;
      }
      #${PANEL_ID} .cmm-focuscard__body{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:.9rem;
        align-items:center;
      }
      #${PANEL_ID} .cmm-focuscard__main{
        min-width:0;
      }
      #${PANEL_ID} .cmm-focuscard__meta{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:.65rem;
        flex-wrap:wrap;
      }
      #${PANEL_ID} .cmm-focuscard__open{
        flex:0 0 auto;
        padding:.46rem .72rem;
        font-size:.78rem;
      }
      #${PANEL_ID} .cmm-focusfacts{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(92px,1fr));
        gap:.36rem;
        align-items:center;
        margin-top:.52rem;
        width:min(100%,620px);
        max-width:100%;
      }
      #${PANEL_ID} .cmm-focusfact{
        min-width:0;
        border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent);
        background:color-mix(in srgb,var(--md-default-bg-color) 94%,var(--md-default-fg-color) 6%);
        border-radius:12px;
        padding:.30rem .38rem;
      }
      #${PANEL_ID} .cmm-focusfact span{
        display:block;
        color:var(--md-default-fg-color--light);
        font-size:.52rem;
        font-weight:650;
        line-height:1.05;
        letter-spacing:0;
        text-transform:none;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      #${PANEL_ID} .cmm-focusfact strong{
        display:block;
        margin-top:.08rem;
        font-size:.68rem;
        font-weight:700;
        line-height:1.12;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      #${PANEL_ID} .cmm-focuscard--empty{
        justify-content:center;
      }
      #${PANEL_ID} .cmm-focushead{
        margin-top:.42rem;
        display:grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap:.6rem;
        align-items:start;
      }
      #${PANEL_ID} .cmm-scoreorb{
        width:82px;
        height:82px;
        min-width:82px;
        border-radius:999px;
        display:inline-flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:.16rem;
        box-sizing:border-box;
        padding:.42rem .36rem;
        overflow:hidden;
        border:1px solid hsla(var(--cmm-h, 140), 70%, var(--cmm-bl, 56%), .52);
        background:
          radial-gradient(circle at 30% 30%, rgba(255,255,255,.34), transparent 46%),
          linear-gradient(135deg,
            hsla(var(--cmm-h, 140), var(--cmm-s, 64%), calc(var(--cmm-l, 92%) + 2%), .98),
            hsla(var(--cmm-h, 140), calc(var(--cmm-s, 64%) + 8%), calc(var(--cmm-l, 92%) - 8%), .94)
          );
        color: hsla(var(--cmm-h, 140), 72%, 24%, .98);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.24), 0 8px 18px rgba(0,0,0,.08);
      }
      #${PANEL_ID} .cmm-scoreorb span{
        display:block;
        font-size:1.18rem;
        font-weight:900;
        line-height:.95;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-scoreorb small{
        display:block;
        max-width:100%;
        font-size:.50rem;
        font-weight:850;
        line-height:.95;
        opacity:.82;
        text-transform:none;
        letter-spacing:0;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-focusorbs{
        display:inline-flex;
        align-items:center;
        justify-content:flex-end;
        gap:.48rem;
        flex-wrap:nowrap;
        min-width:0;
      }
      #${PANEL_ID} .cmm-focusorbs-stack{
        display:flex;
        flex-direction:column;
        align-items:flex-end;
        justify-content:center;
        gap:.34rem;
        min-width:0;
      }
      #${PANEL_ID} .cmm-public-score-avgs{
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:.36rem;
        width:100%;
        max-width:190px;
      }
      #${PANEL_ID} .cmm-public-score-avg{
        min-width:0;
        text-align:center;
        color:var(--md-default-fg-color--light);
        font-size:.48rem;
        line-height:1.05;
      }
      #${PANEL_ID} .cmm-public-score-avg span,
      #${PANEL_ID} .cmm-public-score-avg strong{
        display:block;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      #${PANEL_ID} .cmm-public-score-avg strong{
        margin-top:.06rem;
        color:var(--md-default-fg-color);
        font-size:.56rem;
        font-weight:750;
      }
      #${PANEL_ID} .cmm-scoreorb--prereq.is-loading,
      #${PANEL_ID} .cmm-scoreorb--prereq.is-unavailable{
        --cmm-h: 220;
        --cmm-s: 12%;
        --cmm-l: 92%;
        --cmm-bl: 58%;
        color: var(--md-default-fg-color--light);
      }
      #${PANEL_ID} .cmm-focuschips,
      #${PANEL_ID} .cmm-reasons{
        display:flex;
        flex-wrap:wrap;
        gap:.42rem;
        margin-top:.62rem;
      }
      #${PANEL_ID} .cmm-reason{
        border-radius:999px;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(0,0,0,.03);
        padding:.28rem .56rem;
        font-size:.74rem;
        line-height:1.1;
      }
      #${PANEL_ID} .cmm-cta--link{
        display:inline-flex;
        width:fit-content;
        margin-top:.72rem;
        text-decoration:none;
      }
      #${PANEL_ID} .cmm-minirow,
      #${PANEL_ID} .cmm-cluster,
      #${PANEL_ID} .cmm-actioncard{
        appearance:none;
        width:100%;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(255,255,255,.52);
        color:inherit;
        border-radius:14px;
        padding:.6rem .66rem;
        text-align:left;
        cursor:pointer;
        transition: transform .14s ease, background .18s ease, border-color .18s ease;
      }
      #${PANEL_ID} .cmm-minirow:hover,
      #${PANEL_ID} .cmm-cluster:hover,
      #${PANEL_ID} .cmm-actioncard:hover{
        transform: translateY(-1px);
        background: color-mix(in srgb, var(--md-default-bg-color) 80%, var(--md-accent-fg-color, var(--md-primary-fg-color)) 20%);
      }
      #${PANEL_ID} .cmm-minirow{
        display:grid;
        grid-template-columns:auto minmax(0, 1fr) auto;
        gap:.5rem;
        align-items:center;
      }
      #${PANEL_ID} .cmm-minirow__body{
        min-width:0;
        display:grid;
        gap:.16rem;
      }
      #${PANEL_ID} .cmm-minirow__title{
        font-weight:700;
        font-size:.88rem;
        line-height:1.16;
      }
      #${PANEL_ID} .cmm-minirow__sub{
        opacity:.72;
        font-size:.74rem;
        line-height:1.14;
      }
      #${PANEL_ID} .cmm-minirow__stat{
        font-size:.78rem;
        font-weight:800;
        text-align:right;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-cluster__top{
        display:flex;
        justify-content:space-between;
        gap:.5rem;
        align-items:center;
      }
      #${PANEL_ID} .cmm-cluster__label{
        font-weight:800;
        font-size:.88rem;
      }
      #${PANEL_ID} .cmm-cluster__score{
        font-size:.78rem;
        font-weight:900;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-cluster__bar{
        display:block;
        width:100%;
        height:8px;
        border-radius:999px;
        background: rgba(0,0,0,.08);
        margin-top:.42rem;
        overflow:hidden;
      }
      #${PANEL_ID} .cmm-cluster__bar > span{
        display:block;
        height:100%;
        border-radius:inherit;
        background: hsl(var(--cmm-h, 140) var(--cmm-s, 60%) var(--cmm-fill-l, 64%));
      }
      #${PANEL_ID} .cmm-cluster__meta,
      #${PANEL_ID} .cmm-actioncard__sub{
        display:block;
        margin-top:.34rem;
        opacity:.72;
        font-size:.74rem;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-actioncard__title{
        display:block;
        font-weight:800;
        font-size:.88rem;
        line-height:1.16;
      }

      #${PANEL_ID} .cmm-vizrows,
      #${PANEL_ID} .cmm-histrows{
        display:grid;
        gap:.48rem;
        margin-top:.62rem;
      }
      #${PANEL_ID} .cmm-vizrow{
        appearance:none;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(255,255,255,.48);
        color:inherit;
        border-radius:13px;
        padding:.52rem .56rem;
        display:grid;
        gap:.26rem;
        text-align:left;
        cursor:pointer;
      }
      #${PANEL_ID} .cmm-vizrow:hover{
        background: color-mix(in srgb, var(--md-default-bg-color) 82%, var(--md-accent-fg-color, var(--md-primary-fg-color)) 18%);
      }
      #${PANEL_ID} .cmm-vizrow--static{
        cursor:default;
      }
      #${PANEL_ID} .cmm-vizrow--static:hover{
        background: rgba(255,255,255,.48);
      }
      #${PANEL_ID} .cmm-vizrow__head,
      #${PANEL_ID} .cmm-vizrow__top{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:.5rem;
        min-width:0;
      }
      #${PANEL_ID} .cmm-vizrow__award,
      #${PANEL_ID} .cmm-vizrow__label{
        min-width:0;
        font-size:.72rem;
        font-weight:900;
        letter-spacing:0;
        line-height:1.08;
        color:rgba(0,0,0,.62);
        text-transform:none;
      }
      #${PANEL_ID} .cmm-vizrow__lecture{
        display:block;
        font-size:.86rem;
        font-weight:900;
        line-height:1.05;
      }
      #${PANEL_ID} .cmm-vizrow__score{
        border-radius:999px;
        border:1px solid hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-border-l, 48%), .52);
        background: hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-bg-l, 82%), .72);
        color: hsl(var(--cmm-h, 140) 72% var(--cmm-ink-l, 26%));
        padding:.16rem .42rem;
        font-size:.70rem;
        font-weight:900;
        line-height:1;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-vizrow__meta{
        font-size:.68rem;
        opacity:.72;
        line-height:1.13;
      }
      #${PANEL_ID} .cmm-vizbar,
      #${PANEL_ID} .cmm-histbar{
        display:block;
        height:8px;
        border-radius:999px;
        background: rgba(0,0,0,.08);
        overflow:hidden;
      }
      #${PANEL_ID} .cmm-vizbar__fill,
      #${PANEL_ID} .cmm-histbar__fill{
        display:block;
        height:100%;
        min-width:2px;
        border-radius:inherit;
        background: hsl(var(--cmm-h, 140) var(--cmm-s, 60%) var(--cmm-fill-l, 64%));
      }
      #${PANEL_ID} .cmm-histrow{
        display:grid;
        grid-template-columns: 92px minmax(0, 1fr) 24px 34px;
        gap:.38rem;
        align-items:center;
      }
      #${PANEL_ID} .cmm-histrow__label,
      #${PANEL_ID} .cmm-histrow__count,
      #${PANEL_ID} .cmm-histrow__share{
        font-size:.70rem;
        line-height:1;
      }
      #${PANEL_ID} .cmm-histrow__label{ font-weight:800; opacity:.82; }
      #${PANEL_ID} .cmm-histrow__count{ font-weight:900; text-align:right; }
      #${PANEL_ID} .cmm-histrow__share{ opacity:.62; text-align:right; }
      #${PANEL_ID} .cmm-trend-summary{
        margin-top:.62rem;
        display:flex;
        align-items:baseline;
        justify-content:space-between;
        gap:.5rem;
        padding:.48rem .56rem;
        border-radius:13px;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(255,255,255,.48);
      }
      #${PANEL_ID} .cmm-trend-summary__value{
        font-weight:900;
        font-size:.88rem;
        line-height:1.05;
      }
      #${PANEL_ID} .cmm-trend-summary__label{
        opacity:.66;
        font-size:.68rem;
        line-height:1;
        text-align:right;
      }
      #${PANEL_ID} .cmm-timeline{
        margin-top:.58rem;
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(34px, 1fr));
        gap:.32rem;
        align-items:end;
      }
      #${PANEL_ID} .cmm-timeline__item{
        min-width:0;
        display:grid;
        gap:.22rem;
      }
      #${PANEL_ID} .cmm-timeline__bar{
        height:46px;
        border-radius:999px;
        background: rgba(0,0,0,.08);
        overflow:hidden;
        display:flex;
        align-items:flex-end;
      }
      #${PANEL_ID} .cmm-timeline__bar > span{
        display:block;
        width:100%;
        min-height:3px;
        border-radius:inherit;
        background: hsl(var(--cmm-h, 140) var(--cmm-s, 60%) var(--cmm-fill-l, 64%));
      }
      #${PANEL_ID} .cmm-timeline__date{
        text-align:center;
        font-size:.58rem;
        opacity:.62;
        line-height:1;
      }
      #${PANEL_ID} .cmm-change-list{
        display:grid;
        gap:.36rem;
        margin-top:.58rem;
      }
      #${PANEL_ID} .cmm-change-list--compact{
        margin-top:.52rem;
      }
      #${PANEL_ID} .cmm-change-row{
        appearance:none;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(255,255,255,.42);
        color:inherit;
        border-radius:12px;
        padding:.46rem .54rem;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:.5rem;
        text-align:left;
        cursor:pointer;
      }
      #${PANEL_ID} .cmm-change-row--is-positive{
        border-color: color-mix(in srgb, hsl(138 58% 42%) 22%, rgba(0,0,0,.08));
        background: color-mix(in srgb, var(--md-default-bg-color) 91%, hsl(138 58% 48%) 9%);
      }
      #${PANEL_ID} .cmm-change-row--is-negative{
        border-color: color-mix(in srgb, hsl(7 72% 48%) 24%, rgba(0,0,0,.08));
        background: color-mix(in srgb, var(--md-default-bg-color) 91%, hsl(7 72% 58%) 9%);
      }
      #${PANEL_ID} .cmm-change-row--is-neutral{
        border-color: color-mix(in srgb, hsl(220 16% 48%) 20%, rgba(0,0,0,.08));
        background: color-mix(in srgb, var(--md-default-bg-color) 91%, hsl(220 16% 60%) 9%);
      }
      #${PANEL_ID} .cmm-change-row:hover{
        background: color-mix(in srgb, var(--md-default-bg-color) 82%, var(--md-accent-fg-color, var(--md-primary-fg-color)) 18%);
      }
      #${PANEL_ID} .cmm-change-row__label{
        font-size:.74rem;
        font-weight:800;
        line-height:1.1;
        flex:0 0 auto;
        min-width:max-content;
      }
      #${PANEL_ID} .cmm-change-row__right{
        display:inline-flex;
        align-items:baseline;
        justify-content:flex-end;
        gap:.42rem;
        white-space:nowrap;
        min-width:0;
        flex:1 1 auto;
      }
      #${PANEL_ID} .cmm-change-row__date,
      #${PANEL_ID} .cmm-change-row__delta{
        display:none;
      }
      #${PANEL_ID} .cmm-change-row__beforeafter{
        min-width:0;
        max-width:100%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.62rem;
        line-height:1.08;
        font-weight:760;
        letter-spacing:-.01em;
        color:var(--md-default-fg-color--light);
        opacity:.92;
      }
      #${PANEL_ID} .cmm-change-row__beforeafter > span{
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-change-ba__was,
      #${PANEL_ID} .cmm-change-ba__dot,
      #${PANEL_ID} .cmm-change-ba__date{
        color:var(--md-default-fg-color--light);
        opacity:.82;
      }
      #${PANEL_ID} .cmm-change-ba__before{
        color:color-mix(in srgb, var(--md-default-fg-color) 74%, transparent);
        opacity:.92;
      }
      #${PANEL_ID} .cmm-change-ba__arrow{
        display:inline-block;
        margin:0 .03rem;
        font-size:.92em;
        line-height:1;
        transform:translateY(-.02rem);
        color:color-mix(in srgb, var(--md-default-fg-color) 56%, transparent);
        opacity:.86;
      }
      #${PANEL_ID} .cmm-change-ba__arrow.is-positive,
      #${PANEL_ID} .cmm-change-ba__after.is-positive{
        color:hsl(138 58% 34%);
        opacity:1;
      }
      #${PANEL_ID} .cmm-change-ba__arrow.is-negative,
      #${PANEL_ID} .cmm-change-ba__after.is-negative{
        color:hsl(7 72% 45%);
        opacity:1;
      }
      #${PANEL_ID} .cmm-change-ba__arrow.is-neutral,
      #${PANEL_ID} .cmm-change-ba__after.is-neutral{
        color:hsl(220 16% 38%);
        opacity:1;
      }

      html[data-md-color-scheme="default"] .cmm-h1-entry,
      body[data-md-color-scheme="default"] .cmm-h1-entry{
        --cmm-entry-text-color: #111827 !important;
        color: #111827 !important;
      }
      html[data-md-color-scheme="default"] .cmm-h1-entry__icon,
      html[data-md-color-scheme="default"] .cmm-h1-entry__label,
      html[data-md-color-scheme="default"] .cmm-h1-entry__icon svg,
      body[data-md-color-scheme="default"] .cmm-h1-entry__icon,
      body[data-md-color-scheme="default"] .cmm-h1-entry__label,
      body[data-md-color-scheme="default"] .cmm-h1-entry__icon svg{
        color: #111827 !important;
      }
      html[data-md-color-scheme="default"] .cmm-h1-entry__icon svg *,
      body[data-md-color-scheme="default"] .cmm-h1-entry__icon svg *{
        color: #111827 !important;
        stroke: currentColor !important;
        opacity: 1 !important;
      }

      html[data-md-color-scheme="slate"] .cmm-h1-entry,
      body[data-md-color-scheme="slate"] .cmm-h1-entry{
        --cmm-entry-text-color: rgba(255,255,255,.96) !important;
        background: linear-gradient(135deg, rgba(99,102,241,.24), rgba(129,140,248,.14));
        color: rgba(255,255,255,.96) !important;
        border-color: rgba(129,140,248,.42);
        box-shadow: 0 12px 34px rgba(0,0,0,.28);
      }
      html[data-md-color-scheme="slate"] .cmm-h1-entry:hover,
      body[data-md-color-scheme="slate"] .cmm-h1-entry:hover{
        background: linear-gradient(135deg, rgba(99,102,241,.31), rgba(129,140,248,.20));
        border-color: rgba(165,180,252,.58);
      }
      html[data-md-color-scheme="slate"] .cmm-h1-entry,
      html[data-md-color-scheme="slate"] .cmm-h1-entry__icon,
      html[data-md-color-scheme="slate"] .cmm-h1-entry__label,
      html[data-md-color-scheme="slate"] .cmm-h1-entry__icon svg,
      body[data-md-color-scheme="slate"] .cmm-h1-entry,
      body[data-md-color-scheme="slate"] .cmm-h1-entry__icon,
      body[data-md-color-scheme="slate"] .cmm-h1-entry__label,
      body[data-md-color-scheme="slate"] .cmm-h1-entry__icon svg{
        color: rgba(255,255,255,.96) !important;
      }
      html[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg,
      body[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg{
        color: currentColor !important;
        fill: none !important;
        stroke: none !important;
        filter: none !important;
      }
      html[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg *,
      body[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg *{
        color: #fff !important;
        filter: none !important;
        opacity: 1 !important;
      }
      html[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [stroke],
      body[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [stroke]{
        stroke: currentColor !important;
      }
      html[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [fill="none"],
      body[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [fill="none"]{
        fill: none !important;
      }
      html[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [fill]:not([fill="none"]),
      body[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [fill]:not([fill="none"]){
        fill: none !important;
      }
      html[data-md-color-scheme="slate"] .cmm-modal__close,
      body[data-md-color-scheme="slate"] .cmm-modal__close{
        border-color: rgba(255,255,255,.10);
      }
      html[data-md-color-scheme="default"] #${PANEL_ID},
      body[data-md-color-scheme="default"] #${PANEL_ID}{
        --cmm-panel-bg: #f2f3f5;
        background: #f2f3f5 !important;
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID},
      body[data-md-color-scheme="slate"] #${PANEL_ID}{
        --cmm-panel-bg: #242832;
        background: #242832 !important;
        border-color: rgba(255,255,255,.10);
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-head,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-head{
        border-bottom-color: rgba(255,255,255,.10);
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-metric,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-concept,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-chip,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-cta,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-filter,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-state,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture__chev,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-metric,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-concept,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-chip,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-cta,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-filter,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-state,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture__chev,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-stage__main,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-sidecard,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-row,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-minirow,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-cluster,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-actioncard,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-reason,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-scoreorb{
        border-color: rgba(255,255,255,.10);
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-stage__main,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-sidecard,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-row,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-minirow,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-cluster,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-actioncard,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-stage__main,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-sidecard,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-row,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-minirow,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-cluster,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-actioncard,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow{
        background: color-mix(in srgb, var(--md-default-bg-color) 82%, var(--md-primary-fg-color) 18%);
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow__award,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow__award,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow__label,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow__label{
        color:rgba(255,255,255,.68);
      }
      @media (max-width: 1100px){
        #${PANEL_ID} .cmm-toprow{
          grid-template-columns:1fr;
        }
        #${PANEL_ID} .cmm-metrics{
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 720px){
        .cmm-h1-row{
          align-items:flex-start;
          gap:10px;
        }
        .cmm-h1-entry{
          height: var(--cmm-entry-height, 48px);
          min-height: var(--cmm-entry-height, 48px);
          padding:var(--cmm-entry-padding, 0 .92rem 0 .86rem);
          border-radius:var(--cmm-entry-radius, 14px);
          font-size:var(--cmm-entry-font-size, inherit);
          gap:var(--cmm-entry-gap, .42rem);
        }
        .cmm-modal{
          padding:10px;
        }
        .cmm-modal__dialog{
          width:min(980px, calc(100vw - 12px));
          max-height:calc(100vh - 12px);
          border-radius:18px;
        }
        .cmm-modal__close{
          top:10px;
          right:10px;
          width:34px;
          height:34px;
        }
        #${PANEL_ID}{
          border-radius:18px;
        }
        #${PANEL_ID} .cmm-body,
        #${PANEL_ID} .cmm-head{
          padding: .9rem;
        }
        #${PANEL_ID} .cmm-head{
          padding-right: 3.2rem;
        }
        #${PANEL_ID} .cmm-head__row{
          grid-template-columns:1fr;
          gap:.65rem;
        }
        #${PANEL_ID} .cmm-headreadiness--orb{
          width:80px;
          height:80px;
        }
        #${PANEL_ID} .cmm-metrics{
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        #${PANEL_ID} .cmm-focuscard__body{
          grid-template-columns:minmax(0,1fr) auto;
          align-items:start;
        }
        #${PANEL_ID} .cmm-focusfacts{
          grid-template-columns:repeat(3,minmax(0,1fr));
          width:100%;
        }
        #${PANEL_ID} .cmm-actions,
        #${PANEL_ID} .cmm-filters{
          gap:.45rem;
        }
        #${PANEL_ID} .cmm-cta,
        #${PANEL_ID} .cmm-filter{
          padding:.54rem .82rem;
        }
        #${PANEL_ID} .cmm-filter{
          font-size:.82rem;
          font-weight:500;
          padding:.42rem .68rem;
        }
        #${PANEL_ID} .cmm-lecture__btn{
          grid-template-columns: minmax(0, 1fr) auto;
        }
        #${PANEL_ID} .cmm-lecture__stats{
          grid-column: 1 / -1;
          justify-content:flex-start;
        }
        #${PANEL_ID} .cmm-concept{
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap:.5rem;
          padding:.56rem .64rem;
        }
        #${PANEL_ID} .cmm-state{
          font-size:.72rem;
          padding:.22rem .46rem;
        }

        #${PANEL_ID} .cmm-stage{
          grid-template-columns: 1fr;
        }
        #${PANEL_ID} .cmm-stage__main,
        #${PANEL_ID} .cmm-sidecard{
          border-radius:16px;
        }
        #${PANEL_ID} .cmm-row{
          grid-template-columns: 1fr;
          gap:.5rem;
        }
        #${PANEL_ID} .cmm-row__risk{
          justify-items:start;
          grid-auto-flow:column;
          align-items:center;
          gap:.42rem;
        }
        #${PANEL_ID} .cmm-row__tiles{
          gap:.3rem;
        }
        #${PANEL_ID} .cmm-tile{
          width:20px;
          height:20px;
          border-radius:7px;
        }
        #${PANEL_ID} .cmm-focushead{
          grid-template-columns: 1fr auto;
        }
        #${PANEL_ID} .cmm-scoreorb{
          width:76px;
          height:76px;
          min-width:76px;
        }
        #${PANEL_ID} .cmm-scoreorb span{ font-size:1.06rem; }
        #${PANEL_ID} .cmm-scoreorb small{ font-size:.48rem; }

      }

      @media (max-width: 900px), (pointer: coarse){
        .cmm-modal{
          display:block;
          top:0 !important;
          bottom:auto !important;
          height:var(--cmm-vh, 100dvh) !important;
          padding:0 !important;
          align-items:stretch !important;
          justify-content:stretch !important;
          overflow:hidden !important;
          background:transparent !important;
        }
        .cmm-modal[hidden]{ display:none !important; }
        .cmm-modal__backdrop{
          position:absolute;
          inset:0;
          background:rgba(12,16,24,.42);
          -webkit-backdrop-filter:blur(10px) saturate(1.04);
          backdrop-filter:blur(10px) saturate(1.04);
          pointer-events:auto;
        }
        .cmm-modal__dialog{
          position:absolute !important;
          top:var(--cmm-mobile-top-pad, 96px) !important;
          left:18px !important;
          right:18px !important;
          bottom:var(--cmm-mobile-bottom-pad, env(safe-area-inset-bottom, 0px)) !important;
          width:auto !important;
          max-width:none !important;
          height:auto !important;
          max-height:none !important;
          margin:0 !important;
          overflow:auto !important;
          -webkit-overflow-scrolling:touch;
          overscroll-behavior:contain;
          border-radius:18px !important;
        }
        #${PANEL_ID}{
          min-height:100%;
          border-radius:18px !important;
          background:var(--cmm-panel-bg, #f2f3f5) !important;
        }
        [data-md-color-scheme="default"] #${PANEL_ID},
        body[data-md-color-scheme="default"] #${PANEL_ID}{
          --cmm-panel-bg:#f2f3f5;
          background:#f2f3f5 !important;
        }
        [data-md-color-scheme="slate"] #${PANEL_ID},
        body[data-md-color-scheme="slate"] #${PANEL_ID}{
          --cmm-panel-bg:#242832;
          background:#242832 !important;
        }
      }

      @media (max-width: 520px), (pointer: coarse){
        .cmm-modal__dialog{
          left:12px !important;
          right:12px !important;
        }
      }

      #${PANEL_ID} .cmm-headreadiness-wrap{
        position:relative;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-width:0;
      }
      #${PANEL_ID} button.cmm-headreadiness{
        appearance:none;
        -webkit-appearance:none;
        cursor:pointer;
        font:inherit;
      }
      #${PANEL_ID} .cmm-readiness-help{
        position:absolute;
        left:0;
        top:calc(100% + 8px);
        z-index:8;
        width:min(280px, calc(100vw - 48px));
        padding:.72rem .82rem;
        border-radius:14px;
        border:1px solid rgba(0,0,0,.12);
        background:var(--md-default-bg-color,#fff);
        color:var(--md-default-fg-color,#1f2328);
        box-shadow:0 16px 38px rgba(0,0,0,.18);
        font-size:.78rem;
        line-height:1.35;
      }
      #${PANEL_ID} .cmm-readiness-help[hidden]{ display:none !important; }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-readiness-help,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-readiness-help{
        border-color:rgba(255,255,255,.14);
        background:color-mix(in srgb,var(--md-default-bg-color) 90%,var(--md-primary-fg-color) 10%);
      }

      @media (max-width: 720px){
        #${PANEL_ID},
        #${PANEL_ID} *{
          box-sizing:border-box;
        }
        #${PANEL_ID} .cmm-sub,
        #${PANEL_ID} .cmm-stagehead__sub{
          display:none !important;
        }
        #${PANEL_ID} .cmm-body{
          padding:.72rem !important;
          gap:.72rem !important;
          overflow:hidden;
        }
        #${PANEL_ID} .cmm-head{
          padding:.78rem 3rem .72rem .78rem !important;
        }
        #${PANEL_ID} .cmm-head__row{
          grid-template-columns:72px minmax(0,1fr) !important;
          gap:.6rem !important;
          align-items:center !important;
        }
        #${PANEL_ID} .cmm-headreadiness--orb{
          width:66px !important;
          height:66px !important;
          min-width:66px !important;
          padding:.35rem !important;
        }
        #${PANEL_ID} .cmm-headreadiness strong{
          font-size:1rem !important;
        }
        #${PANEL_ID} .cmm-headreadiness span{
          font-size:.43rem !important;
        }
        #${PANEL_ID} .cmm-title{
          font-size:1.05rem !important;
          line-height:1.12 !important;
        }
        #${PANEL_ID} .cmm-toprow,
        #${PANEL_ID} .cmm-stage{
          grid-template-columns:minmax(0,1fr) !important;
          width:100% !important;
          max-width:100% !important;
          overflow:hidden;
        }
        #${PANEL_ID} .cmm-metrics{
          grid-template-columns:repeat(2,minmax(0,1fr)) !important;
          gap:.55rem !important;
          min-width:0 !important;
          width:100% !important;
        }
        #${PANEL_ID} .cmm-metric{
          min-width:0 !important;
          min-height:5.55rem !important;
          padding:.68rem .58rem !important;
          border-radius:13px !important;
        }
        #${PANEL_ID} .cmm-metric__label{
          font-size:.64rem !important;
          line-height:1.16 !important;
        }
        #${PANEL_ID} .cmm-metric__value{
          font-size:.88rem !important;
          line-height:1.06 !important;
        }
        #${PANEL_ID} .cmm-metric__helper{
          font-size:.64rem !important;
          line-height:1.16 !important;
        }
        #${PANEL_ID} .cmm-focuscard,
        #${PANEL_ID} .cmm-sidecard,
        #${PANEL_ID} .cmm-stage__main,
        #${PANEL_ID} .cmm-row,
        #${PANEL_ID} .cmm-minirow,
        #${PANEL_ID} .cmm-vizrow{
          min-width:0 !important;
          max-width:100% !important;
          overflow:hidden;
        }
        #${PANEL_ID} .cmm-focuscard__body{
          grid-template-columns:minmax(0,1fr) 62px !important;
          gap:.55rem !important;
          align-items:start !important;
        }
        #${PANEL_ID} .cmm-sidecard__kicker{
          font-size:.68rem !important;
          line-height:1.1 !important;
        }
        #${PANEL_ID} .cmm-sidecard__title,
        #${PANEL_ID} .cmm-focuscard__titlelink{
          font-size:.94rem !important;
          line-height:1.12 !important;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #${PANEL_ID} .cmm-focusfacts{
          grid-template-columns:repeat(3,minmax(0,1fr)) !important;
          gap:.34rem !important;
          width:100% !important;
          min-width:0 !important;
        }
        #${PANEL_ID} .cmm-focusfact{
          min-width:0 !important;
          border-radius:11px !important;
          padding:.34rem .38rem !important;
        }
        #${PANEL_ID} .cmm-focusfact span{
          font-size:.54rem !important;
          line-height:1.05 !important;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #${PANEL_ID} .cmm-focusfact strong{
          font-size:.68rem !important;
          line-height:1.08 !important;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #${PANEL_ID} .cmm-focusorbs{
          display:flex !important;
          flex-direction:column !important;
          align-items:flex-end !important;
          gap:.32rem !important;
        }
        #${PANEL_ID} .cmm-scoreorb{
          width:62px !important;
          height:62px !important;
          min-width:62px !important;
        }
        #${PANEL_ID} .cmm-scoreorb span{
          font-size:.86rem !important;
          line-height:.95 !important;
        }
        #${PANEL_ID} .cmm-scoreorb small{
          font-size:.40rem !important;
        }
        #${PANEL_ID} .cmm-lecture__btn{
          grid-template-columns:minmax(0,1fr) 30px !important;
          gap:.42rem !important;
          padding:.58rem .64rem !important;
          align-items:center !important;
        }
        #${PANEL_ID} .cmm-lecture__left{
          grid-column:1 / 2 !important;
          grid-row:1 !important;
          min-width:0 !important;
        }
        #${PANEL_ID} .cmm-lecture__chev{
          grid-column:2 / 3 !important;
          grid-row:1 !important;
          justify-self:end !important;
          align-self:center !important;
          width:28px !important;
          height:28px !important;
          min-width:28px !important;
        }
        #${PANEL_ID} .cmm-lecture__stats{
          grid-column:1 / -1 !important;
          grid-row:2 !important;
          justify-content:flex-start !important;
          gap:.24rem !important;
          flex-wrap:wrap !important;
        }
        #${PANEL_ID} .cmm-lecture__title{
          font-size:.96rem !important;
          line-height:1.12 !important;
        }
        #${PANEL_ID} .cmm-lecture__meta{
          font-size:.66rem !important;
          line-height:1.1 !important;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #${PANEL_ID} .cmm-chip{
          font-size:.61rem !important;
          line-height:1 !important;
          padding:.19rem .36rem !important;
          border-radius:999px !important;
        }
        #${PANEL_ID} .cmm-row__tiles{
          min-width:0 !important;
          max-width:100% !important;
        }
      }


      /* v10 mobile diagnostics: full-screen panel, safe-area transparent, no horizontal spill. */
      @media (max-width: 900px), (pointer: coarse){
        .cmm-modal{
          position:fixed !important;
          inset:0 !important;
          width:100vw !important;
          height:var(--cmm-vh, 100dvh) !important;
          padding:0 !important;
          margin:0 !important;
          display:block !important;
          overflow:hidden !important;
          background:transparent !important;
          touch-action:none !important;
        }
        .cmm-modal__backdrop{
          position:absolute !important;
          inset:0 !important;
          background:rgba(12,16,24,.42) !important;
          -webkit-backdrop-filter:blur(10px) saturate(1.04) !important;
          backdrop-filter:blur(10px) saturate(1.04) !important;
        }
        .cmm-modal__dialog{
          position:absolute !important;
          top:var(--cmm-mobile-top-pad, env(safe-area-inset-top, 0px)) !important;
          left:0 !important;
          right:0 !important;
          bottom:var(--cmm-mobile-bottom-pad, env(safe-area-inset-bottom, 0px)) !important;
          width:100vw !important;
          max-width:none !important;
          height:auto !important;
          max-height:none !important;
          margin:0 !important;
          padding:0 !important;
          border-radius:0 !important;
          overflow:auto !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior:contain !important;
          box-shadow:none !important;
          touch-action:pan-y !important;
        }
        .cmm-modal__close{
          top:10px !important;
          right:12px !important;
          width:36px !important;
          height:36px !important;
          z-index:20 !important;
        }
        #${PANEL_ID}{
          width:100% !important;
          max-width:100% !important;
          min-height:100% !important;
          border-radius:0 !important;
          border-left:0 !important;
          border-right:0 !important;
          box-shadow:none !important;
          overflow:hidden !important;
        }
        #${PANEL_ID} .cmm-head,
        #${PANEL_ID} .cmm-body{
          width:100% !important;
          max-width:100% !important;
          overflow:hidden !important;
        }
      }

      @media (max-width: 720px){
        #${PANEL_ID} .cmm-head{
          padding:.76rem 3.25rem .74rem .78rem !important;
        }
        #${PANEL_ID} .cmm-head__row{
          grid-template-columns:68px minmax(0,1fr) !important;
        }
        #${PANEL_ID} .cmm-headreadiness--orb{
          width:62px !important;
          height:62px !important;
          min-width:62px !important;
        }
        #${PANEL_ID} .cmm-title{
          font-size:1.08rem !important;
          line-height:1.1 !important;
        }
        #${PANEL_ID} .cmm-legend{
          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;
          display:grid !important;
          grid-template-columns:max-content minmax(84px,1fr) max-content !important;
          gap:.36rem !important;
          justify-content:stretch !important;
          align-items:center !important;
          font-size:.62rem !important;
          line-height:1.22 !important;
          white-space:nowrap !important;
          overflow:visible !important;
          padding-bottom:2px !important;
        }
        #${PANEL_ID} .cmm-legend__label{
          display:block !important;
          line-height:1.22 !important;
          padding-bottom:1px !important;
        }
        #${PANEL_ID} .cmm-legend__bar{
          width:100% !important;
          min-width:0 !important;
          height:8px !important;
        }
        #${PANEL_ID} .cmm-stagehead{
          align-items:flex-start !important;
          gap:.48rem !important;
        }
        #${PANEL_ID} .cmm-focuscard{
          position:relative !important;
        }
        #${PANEL_ID} .cmm-focuscard__body{
          display:block !important;
          width:100% !important;
          min-width:0 !important;
        }
        #${PANEL_ID} .cmm-focuscard__main{
          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-sidecard__sub{
          max-width:none !important;
          width:100% !important;
          font-size:.78rem !important;
          line-height:1.22 !important;
        }
        #${PANEL_ID} .cmm-focusfacts{
          grid-template-columns:repeat(3,minmax(0,1fr)) !important;
          gap:.36rem !important;
          width:100% !important;
          max-width:100% !important;
          margin-top:.56rem !important;
        }
        #${PANEL_ID} .cmm-focusfact{
          padding:.34rem .4rem !important;
        }
        #${PANEL_ID} .cmm-focusfact span{
          font-size:.53rem !important;
          line-height:1.05 !important;
        }
        #${PANEL_ID} .cmm-focusfact strong{
          font-size:.68rem !important;
          line-height:1.08 !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-focusorbs{
          display:flex !important;
          flex-direction:row !important;
          align-items:center !important;
          justify-content:flex-start !important;
          gap:.42rem !important;
          flex-wrap:wrap !important;
          margin-top:.54rem !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-focusorbs-stack{
          align-items:flex-start !important;
          width:100% !important;
          margin-top:.54rem !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-focusorbs-stack .cmm-focusorbs{
          margin-top:0 !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-public-score-avgs{
          max-width:none !important;
          width:100% !important;
          grid-template-columns:repeat(2,minmax(0,1fr)) !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-public-score-avg{
          text-align:left !important;
          font-size:.52rem !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-public-score-avg strong{
          font-size:.62rem !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-scoreorb{
          position:static !important;
          width:max-content !important;
          min-width:0 !important;
          height:auto !important;
          min-height:0 !important;
          display:inline-flex !important;
          flex-direction:row !important;
          align-items:center !important;
          justify-content:center !important;
          gap:.25rem !important;
          border-radius:999px !important;
          padding:.36rem .58rem !important;
          margin-top:0 !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-scoreorb span{
          font-size:.78rem !important;
          line-height:1 !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-scoreorb small{
          font-size:.44rem !important;
          line-height:1 !important;
        }
        #${PANEL_ID} .cmm-lecture__btn{
          grid-template-columns:minmax(0,1fr) 28px !important;
          gap:.38rem !important;
          padding:.54rem .56rem !important;
        }
        #${PANEL_ID} .cmm-lecture__stats{
          display:flex !important;
          flex-wrap:nowrap !important;
          overflow:hidden !important;
          gap:.24rem !important;
        }
        #${PANEL_ID} .cmm-lecture__stats .cmm-chip{
          flex:0 1 auto !important;
          min-width:0 !important;
          max-width:33.33% !important;
          white-space:nowrap !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
          font-size:.56rem !important;
          padding:.20rem .32rem !important;
        }
        #${PANEL_ID} .cmm-row__risk{
          display:flex !important;
          align-items:center !important;
          gap:.38rem !important;
          min-width:0 !important;
          max-width:100% !important;
        }
        #${PANEL_ID} .cmm-row__risk .cmm-riskchip{
          flex:0 0 auto !important;
        }
        #${PANEL_ID} .cmm-row__risklabel{
          min-width:0 !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
        }
      }


      /* v28/v29 mobile diagnostics row/legend balance:
         Keep Lecture label, concept tiles, and readiness chip on one row.
         The tile strip is a two-row horizontal grid, so long lectures need much less dragging.
         v29 tightens the mobile label-to-tile gap slightly so the overflow strip visibly reveals more of the next tile.
         v30 also tightens the desktop label-to-tile spacing while keeping all tiles visible via wrapping.
         The legend uses the available row width: labels keep their natural width and the bar receives the remaining space. */
      @media (max-width: 720px), (pointer: coarse){
        #${PANEL_ID} .cmm-legend{
          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;
          display:grid !important;
          grid-template-columns:max-content minmax(0, 1fr) max-content !important;
          justify-content:stretch !important;
          align-items:center !important;
          gap:.42rem !important;
          font-size:clamp(.52rem, 2.35vw, .64rem) !important;
          line-height:1.14 !important;
          white-space:nowrap !important;
          overflow:visible !important;
          opacity:.84 !important;
        }
        #${PANEL_ID} .cmm-legend__label{
          display:block !important;
          min-width:max-content !important;
          max-width:none !important;
          overflow:visible !important;
          text-overflow:clip !important;
          white-space:nowrap !important;
          line-height:1.14 !important;
          padding:0 !important;
        }
        #${PANEL_ID} .cmm-legend__bar{
          width:100% !important;
          min-width:0 !important;
          max-width:none !important;
          height:7px !important;
          flex:1 1 auto !important;
          justify-self:stretch !important;
        }
        #${PANEL_ID} .cmm-stagehead{
          align-items:flex-start !important;
          gap:.42rem !important;
          overflow:visible !important;
        }
        #${PANEL_ID} .cmm-stage__main{
          overflow:hidden !important;
        }
        #${PANEL_ID} .cmm-row{
          display:grid !important;
          grid-template-columns:minmax(72px, 84px) minmax(0, 1fr) auto !important;
          column-gap:.30rem !important;
          row-gap:.42rem !important;
          align-items:center !important;
          padding:.62rem .52rem !important;
          overflow:hidden !important;
        }
        #${PANEL_ID} .cmm-row__label{
          min-width:0 !important;
          align-self:center !important;
        }
        #${PANEL_ID} .cmm-row__title{
          font-size:.82rem !important;
          line-height:1.1 !important;
          white-space:nowrap !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
        }
        #${PANEL_ID} .cmm-row__meta{
          display:grid !important;
          gap:.02rem !important;
          margin-top:.12rem !important;
          font-size:.66rem !important;
          line-height:1.03 !important;
        }
        #${PANEL_ID} .cmm-row__meta-line{
          display:block !important;
          white-space:nowrap !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
        }
        #${PANEL_ID} .cmm-row__tiles{
          grid-column:2 !important;
          min-width:0 !important;
          max-width:100% !important;
          display:grid !important;
          grid-template-rows:repeat(2, 18px) !important;
          grid-auto-flow:column !important;
          grid-auto-columns:18px !important;
          justify-content:flex-start !important;
          align-content:center !important;
          align-items:center !important;
          gap:.20rem .22rem !important;
          overflow-x:auto !important;
          overflow-y:hidden !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior-x:contain !important;
          scrollbar-width:none !important;
          padding:2px 1px 3px !important;
        }
        #${PANEL_ID} .cmm-row__tiles::-webkit-scrollbar{
          display:none !important;
        }
        #${PANEL_ID} .cmm-tile{
          width:18px !important;
          height:18px !important;
          min-width:18px !important;
          min-height:18px !important;
          flex:0 0 18px !important;
          border-radius:7px !important;
        }
        #${PANEL_ID} .cmm-tile__txt{
          font-size:.54rem !important;
        }
        #${PANEL_ID} .cmm-row__risk{
          grid-column:3 !important;
          min-width:0 !important;
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          justify-items:center !important;
          gap:0 !important;
        }
        #${PANEL_ID} .cmm-row__risk .cmm-riskchip{
          min-width:42px !important;
          padding:.22rem .42rem !important;
          font-size:.74rem !important;
          line-height:1 !important;
          flex:0 0 auto !important;
        }
        #${PANEL_ID} .cmm-row__risklabel{
          display:none !important;
        }
      }


      /* v22 mobile safe-area surface for the new fullscreen diagnostics layout.
         This keeps the v20 transparent safe-area effect, then lets the actual
         diagnostics panel continue down into iOS Safari's bottom toolbar area. */
      html.cmm-modal-open #mw-mastery,
      html.cmm-modal-open #mw-mastery *,
      html.cmm-modal-open #mw-mastery-compact,
      html.cmm-modal-open #mw-mastery-compact *,
      html.cmm-modal-open .mw-fly-layer,
      html.cmm-modal-open .mw-fly-layer *,
      html.cmm-modal-open .mw-title-menu,
      html.cmm-modal-open .mw-title-menu *,
      body.cmm-modal-open #mw-mastery,
      body.cmm-modal-open #mw-mastery *,
      body.cmm-modal-open #mw-mastery-compact,
      body.cmm-modal-open #mw-mastery-compact *,
      body.cmm-modal-open .mw-fly-layer,
      body.cmm-modal-open .mw-fly-layer *,
      body.cmm-modal-open .mw-title-menu,
      body.cmm-modal-open .mw-title-menu *{
        pointer-events:none !important;
      }
      @media (max-width: 900px), (pointer: coarse){
        html.cmm-modal-open,
        body.cmm-modal-open{
          overflow:hidden !important;
          touch-action:none !important;
        }
        .cmm-modal{
          position:absolute !important;
          inset:auto !important;
          left:var(--cmm-doc-left, 0px) !important;
          top:var(--cmm-doc-top, 0px) !important;
          width:var(--cmm-doc-width, 100vw) !important;
          height:var(--cmm-doc-height, var(--cmm-vh, 100dvh)) !important;
          min-height:var(--cmm-doc-height, var(--cmm-vh, 100dvh)) !important;
          max-height:none !important;
          padding:0 !important;
          margin:0 !important;
          display:block !important;
          overflow:hidden !important;
          background:transparent !important;
          -webkit-backdrop-filter:none !important;
          backdrop-filter:none !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          -webkit-transform:translateZ(0) !important;
          transform:translateZ(0) !important;
        }
        .cmm-modal::before{
          content:"";
          position:absolute !important;
          inset:0 !important;
          height:100% !important;
          min-height:100% !important;
          z-index:0 !important;
          pointer-events:none !important;
          background:rgba(12,16,24,.38) !important;
          -webkit-backdrop-filter:blur(10px) saturate(1.04) !important;
          backdrop-filter:blur(10px) saturate(1.04) !important;
        }
        .cmm-modal__backdrop{
          display:none !important;
          background:transparent !important;
          -webkit-backdrop-filter:none !important;
          backdrop-filter:none !important;
        }
        .cmm-modal__dialog{
          position:absolute !important;
          z-index:1 !important;
          display:flex !important;
          flex-direction:column !important;
          top:env(safe-area-inset-top, 0px) !important;
          left:0 !important;
          right:0 !important;
          bottom:0 !important;
          width:100% !important;
          max-width:none !important;
          height:calc(var(--cmm-doc-height, var(--cmm-vh, 100dvh)) - env(safe-area-inset-top, 0px)) !important;
          min-height:calc(var(--cmm-doc-height, var(--cmm-vh, 100dvh)) - env(safe-area-inset-top, 0px)) !important;
          max-height:none !important;
          margin:0 !important;
          padding:0 !important;
          border-radius:0 !important;
          overflow:hidden !important;
          box-shadow:none !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          -webkit-transform:translateZ(0) !important;
          transform:translateZ(0) !important;
          contain:layout paint style !important;
        }
        .cmm-modal__close{
          top:10px !important;
          right:12px !important;
          z-index:20 !important;
        }
        #${PANEL_ID}{
          flex:1 1 auto !important;
          width:100% !important;
          max-width:100% !important;
          height:100% !important;
          min-height:0 !important;
          border-radius:0 !important;
          border-left:0 !important;
          border-right:0 !important;
          box-shadow:none !important;
          overflow-y:auto !important;
          overflow-x:hidden !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          padding-bottom:calc(var(--cmm-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 24px) !important;
          background:var(--cmm-panel-bg, #f2f3f5) !important;
        }
        [data-md-color-scheme="default"] #${PANEL_ID},
        body[data-md-color-scheme="default"] #${PANEL_ID}{
          --cmm-panel-bg:#f2f3f5;
          background:#f2f3f5 !important;
        }
        [data-md-color-scheme="slate"] #${PANEL_ID},
        body[data-md-color-scheme="slate"] #${PANEL_ID}{
          --cmm-panel-bg:#242832;
          background:#242832 !important;
        }
      }

      /* v31 lecture list header polish:
         Put the lecture title, status summary, mastery readiness score, and expand arrow on one clean row. */
      #${PANEL_ID} .cmm-lecture__btn{
        grid-template-columns:auto minmax(0, 1fr) auto 30px !important;
        gap:.58rem !important;
        align-items:center !important;
        padding:.78rem .88rem !important;
      }
      #${PANEL_ID} .cmm-lecture__left{
        min-width:max-content !important;
        grid-column:auto !important;
        grid-row:auto !important;
      }
      #${PANEL_ID} .cmm-lecture__title{
        font-size:1.08rem;
        line-height:1.12;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-lecture__meta,
      #${PANEL_ID} .cmm-lecture__stats{
        display:none !important;
      }
      #${PANEL_ID} .cmm-lecture__facts{
        min-width:0;
        display:flex;
        align-items:center;
        gap:.44rem;
        flex-wrap:nowrap;
        overflow:hidden;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-lecture__fact{
        min-width:max-content;
        flex:0 0 auto;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:.34rem .72rem;
        border-radius:999px;
        border:1px solid rgba(0,0,0,.09);
        background:rgba(255,255,255,.42);
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);
        font-size:.78rem;
        line-height:1.05;
        font-weight:700;
        color:color-mix(in srgb, var(--md-default-fg-color) 86%, transparent);
        overflow:visible;
        text-overflow:clip;
      }
      #${PANEL_ID} .cmm-lecture__score{
        justify-self:end;
        flex:0 0 auto;
        display:inline-flex;
        align-items:center;
        gap:.34rem;
        padding:.34rem .72rem;
        border-radius:999px;
        border:1px solid hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-border-l, 48%), .55);
        background:hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-bg-l, 82%), .70);
        color:hsl(var(--cmm-h, 140) 72% var(--cmm-ink-l, 26%));
        line-height:1;
        white-space:nowrap;
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);
      }
      #${PANEL_ID} .cmm-lecture__scorelabel{
        font-size:.74rem;
        font-weight:650;
        opacity:.82;
      }
      #${PANEL_ID} .cmm-lecture__score strong{
        font-size:.88rem;
        font-weight:850;
        line-height:1;
      }
      #${PANEL_ID} .cmm-lecture__chev{
        grid-column:auto !important;
        grid-row:auto !important;
        justify-self:end !important;
        align-self:center !important;
        flex:0 0 auto !important;
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture__fact,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture__fact{
        border-color:rgba(255,255,255,.12);
        background:rgba(255,255,255,.05);
        color:rgba(255,255,255,.82);
      }
      @media (max-width: 980px){
        #${PANEL_ID} .cmm-lecture__btn{
          grid-template-columns:auto minmax(0, 1fr) auto 28px !important;
          gap:.42rem !important;
          padding:.68rem .70rem !important;
        }
        #${PANEL_ID} .cmm-lecture__title{
          font-size:.98rem !important;
        }
        #${PANEL_ID} .cmm-lecture__facts{
          gap:.32rem !important;
          overflow-x:auto !important;
          overflow-y:hidden !important;
          -webkit-overflow-scrolling:touch !important;
          scrollbar-width:none !important;
        }
        #${PANEL_ID} .cmm-lecture__facts::-webkit-scrollbar{
          display:none !important;
        }
        #${PANEL_ID} .cmm-lecture__fact{
          flex:0 0 auto !important;
          font-size:.66rem !important;
          padding:.26rem .50rem !important;
        }
        #${PANEL_ID} .cmm-lecture__score{
          padding:.28rem .48rem !important;
          gap:.22rem !important;
        }
        #${PANEL_ID} .cmm-lecture__scorelabel{
          display:none !important;
        }
        #${PANEL_ID} .cmm-lecture__score strong{
          font-size:.74rem !important;
        }
        #${PANEL_ID} .cmm-lecture__chev{
          width:28px !important;
          height:28px !important;
          min-width:28px !important;
        }
      }
      @media (max-width: 520px){
        #${PANEL_ID} .cmm-lecture__btn{
          grid-template-columns:minmax(68px, auto) minmax(0, 1fr) auto 28px !important;
          gap:.32rem !important;
          padding:.60rem .56rem !important;
        }
        #${PANEL_ID} .cmm-lecture__title{
          font-size:.90rem !important;
        }
        #${PANEL_ID} .cmm-lecture__fact{
          font-size:.58rem !important;
          padding:.22rem .42rem !important;
        }
        #${PANEL_ID} .cmm-lecture__score{
          min-width:40px !important;
          justify-content:center !important;
          padding:.24rem .38rem !important;
        }
      }



    `.trim();document.head.appendChild(st);}
function ensureModal(anchor){let modal=document.getElementById('mk-course-mastery-map-modal');if(!modal){modal=document.createElement('div');modal.id='mk-course-mastery-map-modal';modal.className='cmm-modal';modal.hidden=true;modal.innerHTML=`
        <div class="cmm-modal__backdrop" data-cmm-close="1"></div>
        <div class="cmm-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="${PANEL_ID}-title">
          <button type="button" class="cmm-modal__close" data-cmm-close="1" aria-label="Close course mastery map">×</button>
          <section id="${PANEL_ID}"></section>
        </div>
      `;document.body.appendChild(modal);}
let panel=q(`#${PANEL_ID}`,modal);if(!panel){panel=document.createElement('section');panel.id=PANEL_ID;const dialog=q('.cmm-modal__dialog',modal)||modal;dialog.appendChild(panel);}
if(modal.dataset.cmmBound!=='1'){modal.dataset.cmmBound='1';modal.addEventListener('click',(e)=>{const dialog=q('.cmm-modal__dialog',modal);const closeTarget=e.target&&e.target.closest?e.target.closest('[data-cmm-close]'):null;const path=e&&typeof e.composedPath==='function'?e.composedPath():[];const insideDialog=!!(dialog&&((path&&path.includes&&path.includes(dialog))||(e.target&&dialog.contains(e.target))));if(closeTarget||(dialog&&!insideDialog)){e.preventDefault();setModalOpen(false);}});['touchstart','touchmove','pointerdown','click'].forEach((eventName)=>{try{modal.addEventListener(eventName,(ev)=>{if(ev&&typeof ev.stopPropagation==='function')ev.stopPropagation();},{capture:false,passive:eventName!=='click'});}catch(_){}});}
if(!window.__cmmEscBound){window.__cmmEscBound=true;document.addEventListener('keydown',(e)=>{if(!state.open||e.defaultPrevented)return;const modal=document.getElementById('mk-course-mastery-map-modal');const dialog=modal&&q('.cmm-modal__dialog',modal);if(!dialog)return;const active=document.activeElement;const otherDialog=active&&active.closest&&active.closest('[aria-modal="true"]');if(otherDialog&&otherDialog!==dialog)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();setModalOpen(false);}else if(e.key==='Tab'){const controls=Array.from(dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]')).filter(node=>!node.disabled&&node.getAttribute('tabindex')!=='-1'&&node.getClientRects().length);const first=controls[0],last=controls[controls.length-1];if(first&&(!dialog.contains(active)||(e.shiftKey?active===first:active===last))){e.preventDefault();(e.shiftKey?last:first).focus({preventScroll:true});}}});}
if(anchor)state.anchor=anchor;return{modal,panel};}
function cmmInstallClickShield(durationMs){try{const touchPrimary=!!(window.matchMedia&&window.matchMedia('(pointer: coarse)').matches);if(!touchPrimary)return;if(document.getElementById('cmm-click-shield'))return;const shield=document.createElement('div');shield.id='cmm-click-shield';shield.setAttribute('aria-hidden','true');shield.style.cssText='position:fixed;inset:0;z-index:2147483647;background:transparent;pointer-events:auto;';const kill=(e)=>{try{if(e&&e.cancelable)e.preventDefault();if(e){e.stopPropagation();if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();}}catch(_){}
return false;};['pointerdown','pointerup','click','touchstart','touchend','mousedown','mouseup'].forEach((type)=>{shield.addEventListener(type,kill,{passive:false,capture:true});});document.body.appendChild(shield);window.setTimeout(()=>{try{shield.remove();}catch(_){}},Math.max(120,Number(durationMs)||520));}catch(_){}}
function setModalOpen(open,anchor,btn,keyboardOpen){if(open&&!state.open&&!cmmConsumeGuestAction('map',{source:'course-diagnostics-map',title:'Course diagnostics'}))return;if(anchor)state.anchor=anchor;if(btn)state.button=btn;const targetAnchor=state.anchor||anchor||q('[data-course-mastery-map]');if(!targetAnchor)return;const{modal,panel}=ensureModal(targetAnchor);const wasOpen=state.open;const focusWasInside=modal.contains(document.activeElement);state.open=!!open;if(!state.open){state.seq+=1;state.prereqReadySeq+=1;}else if(!wasOpen){state.prereqReadySeq+=1;state.prereqReadyCache=new Map();}
if(state.open)cmmUpdateViewportMetrics();else if(wasOpen)cmmInstallClickShield(520);modal.hidden=!state.open;document.documentElement.classList.toggle('cmm-modal-open',state.open);document.body.classList.toggle('cmm-modal-open',state.open);if(state.button){state.button.setAttribute('aria-expanded',state.open?'true':'false');}
state.expandedLecture.clear();state.autoExpandedOnce=false;state.preservedScrollTop=null;if(state.open){cmmUpdateViewportMetrics();try{const dialog=q('.cmm-modal__dialog',modal);if(dialog)dialog.scrollTop=0;}catch(_){}
renderMap(targetAnchor,panel);window.setTimeout(cmmUpdateViewportMetrics,60);const closeBtn=q('.cmm-modal__close',modal);if(keyboardOpen&&closeBtn){try{closeBtn.focus({preventScroll:true});}catch(_){}}else if(closeBtn&&typeof closeBtn.blur==='function'){try{closeBtn.blur();}catch(_){}}}else if(wasOpen&&focusWasInside&&state.button&&state.button.isConnected){try{state.button.focus({preventScroll:true});}catch(_){}}}
function cmmPrimaryCourseSearchButton(){const form=q('#course-search-form');const root=form||document;return(q('#course-search-btn',root)||q('.search-hero__button',root)||q('button.fb-cta-btn--search',root)||q('button[type="submit"]',root)||null);}
function cmmMeasureCourseSearchHeight(){const form=q('#course-search-form');const root=form||document;const candidates=[cmmPrimaryCourseSearchButton(),q('#course-search-input',root),q('.search-hero__input',root),].filter(Boolean);let best=0;for(const el of candidates){try{const cs=window.getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')continue;const rect=el.getBoundingClientRect();const h=rect&&Number.isFinite(rect.height)?rect.height:0;if(h>best)best=h;}catch(_){}}
const rounded=Math.round(best);if(rounded>=40&&rounded<=96)return rounded;return 0;}
function cmmSyncEntryButtonStyle(btn){const targetBtn=btn||document.getElementById(TOGGLE_ID);if(!targetBtn||!targetBtn.style)return;const sourceBtn=cmmPrimaryCourseSearchButton();const h=cmmMeasureCourseSearchHeight();if(h){cmmSetVar(targetBtn,'--cmm-entry-height',`${h}px`);targetBtn.style.height=`${h}px`;targetBtn.style.minHeight=`${h}px`;}
if(!sourceBtn||sourceBtn===targetBtn)return;try{const cs=window.getComputedStyle(sourceBtn);const rect=sourceBtn.getBoundingClientRect();const sh=rect&&Number.isFinite(rect.height)?Math.round(rect.height):h;if(sh>=40&&sh<=96){cmmSetVar(targetBtn,'--cmm-entry-height',`${sh}px`);targetBtn.style.height=`${sh}px`;targetBtn.style.minHeight=`${sh}px`;}
cmmSetVar(targetBtn,'--cmm-entry-font-family',cs.fontFamily||'inherit');cmmSetVar(targetBtn,'--cmm-entry-font-size',cs.fontSize||'inherit');cmmSetVar(targetBtn,'--cmm-entry-font-weight',cs.fontWeight||'inherit');cmmSetVar(targetBtn,'--cmm-entry-font-style',cs.fontStyle||'normal');cmmSetVar(targetBtn,'--cmm-entry-line-height',cmmCssLength(cs.lineHeight,'normal'));cmmSetVar(targetBtn,'--cmm-entry-letter-spacing',cmmCssLength(cs.letterSpacing,'normal'));cmmSetVar(targetBtn,'--cmm-entry-text-transform',cs.textTransform||'none');const isSlate=!!(document.documentElement.matches('[data-md-color-scheme="slate"]')||document.body.matches('[data-md-color-scheme="slate"]'));const entryTextColor=isSlate?'rgba(255,255,255,.96)':'#111827';cmmSetVar(targetBtn,'--cmm-entry-text-color',entryTextColor);targetBtn.style.color=entryTextColor;const pt=cmmCssLength(cs.paddingTop,'0px');const pr=cmmCssLength(cs.paddingRight,'0px');const pb=cmmCssLength(cs.paddingBottom,'0px');const pl=cmmCssLength(cs.paddingLeft,'0px');if(pt&&pr&&pb&&pl)cmmSetVar(targetBtn,'--cmm-entry-padding',`${pt} ${pr} ${pb} ${pl}`);const rtl=cmmCssLength(cs.borderTopLeftRadius,'16px');const rtr=cmmCssLength(cs.borderTopRightRadius,rtl);const rbr=cmmCssLength(cs.borderBottomRightRadius,rtr);const rbl=cmmCssLength(cs.borderBottomLeftRadius,rtl);if(rtl&&rtr&&rbr&&rbl)cmmSetVar(targetBtn,'--cmm-entry-radius',`${rtl} ${rtr} ${rbr} ${rbl}`);cmmSetVar(targetBtn,'--cmm-entry-gap',cmmCssLength(cs.columnGap||cs.gap,'.56rem'));const srcIcon=q('.fb-cta__ico, svg',sourceBtn);if(srcIcon){const ir=srcIcon.getBoundingClientRect();const iw=ir&&Number.isFinite(ir.width)?Math.round(ir.width):0;const ih=ir&&Number.isFinite(ir.height)?Math.round(ir.height):0;const size=Math.max(iw,ih);if(size>=14&&size<=34)cmmSetVar(targetBtn,'--cmm-entry-icon-size',`${size}px`);}}catch(_){}}
function cmmBindEntryHeightSyncOnce(){if(window.__cmmEntryHeightSyncBound)return;window.__cmmEntryHeightSyncBound=true;const sync=()=>{cmmSyncEntryButtonStyle(document.getElementById(TOGGLE_ID));};try{window.addEventListener('resize',sync,{passive:true});}catch(_){window.addEventListener('resize',sync);}
window.addEventListener('pageshow',sync);document.addEventListener('DOMContentSwitch',sync);window.setTimeout(sync,80);window.setTimeout(sync,360);window.setTimeout(sync,900);}
function ensureTitleEntry(anchor){const inner=q('article.md-content__inner');const h1=inner?q(':scope > h1',inner)||q('h1',inner):null;if(!h1)return null;let wrap=document.getElementById(`${TOGGLE_ID}-wrap`);if(wrap&&wrap.parentNode&&wrap.parentNode!==h1)wrap.remove();if(!h1.classList.contains('cmm-h1-row')){const textHtml=h1.innerHTML;h1.classList.add('cmm-h1-row');h1.innerHTML=`<span class="cmm-h1-text">${textHtml}</span>`;}
if(!wrap){wrap=document.createElement('div');wrap.id=`${TOGGLE_ID}-wrap`;wrap.className='cmm-h1-entry-wrap';h1.appendChild(wrap);}
let btn=document.getElementById(TOGGLE_ID);if(!btn){btn=document.createElement('button');btn.id=TOGGLE_ID;btn.type='button';btn.className='cmm-h1-entry';btn.setAttribute('aria-label','Open course diagnostics');btn.setAttribute('title','Open course diagnostics');btn.innerHTML=`<span class="cmm-h1-entry__icon" aria-hidden="true">${mapSvg()}</span><span class="cmm-h1-entry__label">Course diagnostics</span>`;wrap.appendChild(btn);}else if(btn.parentNode!==wrap){wrap.appendChild(btn);}
btn.setAttribute('aria-expanded',state.open?'true':'false');cmmBindEntryHeightSyncOnce();cmmSyncEntryButtonStyle(btn);window.setTimeout(()=>cmmSyncEntryButtonStyle(btn),60);window.setTimeout(()=>cmmSyncEntryButtonStyle(btn),360);if(btn.dataset.cmmBound!=='1'){btn.dataset.cmmBound='1';btn.addEventListener('click',(event)=>{if(state.open)setModalOpen(false,anchor,btn);else setModalOpen(true,anchor,btn,!!(event&&event.detail===0));});}
state.button=btn;return btn;}
function buildConceptRow(concept){const rec=concept.record;const cls=levelClass(rec);const href=absoluteHref(concept.location);const metaBits=[];metaBits.push(recencyLabel(concept.lastActivity));if(rec&&rec.visited&&concept.pct!=null)metaBits.push(`${levelLabel(rec)}`);else if(!rec||!rec.visited)metaBits.push('Not opened yet');return`
      <div class="cmm-concept">
        <span class="cmm-dot ${cls}" aria-hidden="true"></span>
        <div class="cmm-concept__main">
          <a class="cmm-concept__title" href="${escapeHtml(href)}">${escapeHtml(concept.title)}</a>
          <div class="cmm-concept__meta">${escapeHtml(metaBits.join(' · '))}</div>
        </div>
        <span class="cmm-state ${cls}">${escapeHtml(levelLabel(rec))}</span>
      </div>
    `;}
function buildLectureCard(lecture){const filtered=lecture.concepts.filter(matchesFilters);const lectureKey=String(lecture.lectureNum);const isOpen=state.expandedLecture.has(lectureKey);const tone=lectureHeatTone(lecture);const readinessAvg=Math.max(0,Math.min(100,safeNum(lecture&&lecture.readinessAvg)));const counts=lectureStatusCounts(lecture);const totalConcepts=Math.max(0,safeNum(counts.total)||safeNum(lecture&&lecture.total));const unvisited=Math.max(0,safeNum(counts.notVisited));const visitedUnrated=Math.max(0,safeNum(counts.visitedOnly));const lowRated=Math.max(0,safeNum(counts.unknown)+safeNum(counts.fuzzy));const facts=[`${totalConcepts} concepts`,`${unvisited} unvisited`,`${lowRated} low-rated`,];return`
      <section class="cmm-lecture ${tone} ${isOpen ? 'is-open' : ''}" data-lecture="${lectureKey}">
        <button type="button" class="cmm-lecture__btn" data-cmm-lecture-toggle="${lectureKey}" aria-expanded="${isOpen ? 'true' : 'false'}">
          <div class="cmm-lecture__left">
            <div class="cmm-lecture__title">${escapeHtml(lecture.label)}</div>
          </div>
          <div class="cmm-lecture__facts" aria-label="${escapeHtml(`${lecture.label}status summary`)}">
            ${facts.map((text) => `<span class="cmm-lecture__fact">${escapeHtml(text)}</span>`).join('')}
          </div>
          <span class="cmm-lecture__score" style="${escapeHtml(readinessToneStyle(readinessAvg))}" title="${escapeHtml(`${lecture.label}· Mastery readiness ${readinessAvg}%`)}"><span class="cmm-lecture__scorelabel">Mastery readiness</span><strong>${escapeHtml(String(readinessAvg))}%</strong></span>
          <span class="cmm-lecture__chev" aria-hidden="true">${chevronSvg()}</span>
        </button>
        <div class="cmm-lecture__body" ${isOpen ? '' : 'hidden'}>
          ${filtered.length ? filtered.map(buildConceptRow).join('') : '<div class="cmm-lecture__empty">Nothing matches the current filters in this learning unit.</div>'}
        </div>
      </section>
    `;}
function rememberDialogScroll(panel){const dialog=panel&&panel.closest?panel.closest('.cmm-modal__dialog'):null;state.preservedScrollTop=dialog?dialog.scrollTop:null;}
function restoreDialogScroll(panel){if(state.scrollToLecture||state.scrollToFocus)return;if(state.preservedScrollTop==null)return;const dialog=panel&&panel.closest?panel.closest('.cmm-modal__dialog'):null;const top=state.preservedScrollTop;state.preservedScrollTop=null;if(!dialog)return;window.requestAnimationFrame(()=>{try{dialog.scrollTop=top;}catch(_){}});}
function renderPanelShell(panel){panel.innerHTML=`
      ${buildCourseDiagnosticHead(null)}
      <div class="cmm-body">
        <div class="cmm-loading">Loading course map…</div>
      </div>
    `;}
async function renderMap(anchor,panel){if(!anchor||!panel)return;const seq=++state.seq;const focused=document.activeElement;const focusAttr=panel.contains(focused)&&['data-cmm-filter','data-cmm-lecture-toggle','data-cmm-select-concept','data-cmm-jump-lecture','data-cmm-course-readiness-info'].find(attr=>focused.hasAttribute(attr));const focusValue=focusAttr?focused.getAttribute(focusAttr):null;ensureStyles();renderPanelShell(panel);panel.hidden=!state.open;try{const data=await loadCourseMapData(anchor);if(seq!==state.seq)return;const summary=data.summary;const totals=summary.totals;const diagnosis=buildDiagnosis(summary);diagnosis.dailyHistory=cmmRecordDailySnapshot(data.key,summary,diagnosis);const selected=ensureSelectedConcept(summary,diagnosis);const allLecturesHtml=(summary.lectures||[]).map(buildLectureCard).join('');const panelBody=`
        <div class="cmm-toprow">
          <div class="cmm-metrics">
            ${metricValueCard('Visited concepts', `${totals.visited}/${totals.total}`, `${Math.round(totals.total ? (totals.visited /totals.total)*100:0)}%visited`)}
            ${metricValueCard('Rated concepts', `${totals.rated}/${totals.total}`, `${totals.total-totals.rated}unrated`)}
          </div>
          ${buildSelectedConceptCard(selected)}
        </div>
        ${buildVisualStage(summary, diagnosis, selected)}
        <div class="cmm-filters">
          <button type="button" class="cmm-filter ${state.filters.weak ? 'is-on' : ''}" data-cmm-filter="weak">Low mastery readiness</button>
          <button type="button" class="cmm-filter ${state.filters.unvisited ? 'is-on' : ''}" data-cmm-filter="unvisited">Unvisited</button>
        </div>
        <div class="cmm-lectures">${allLecturesHtml || '<div class="cmm-error">No concept pages were found for this course yet.</div>'}</div>
      `;panel.innerHTML=`
        ${buildCourseDiagnosticHead(diagnosis.courseReadinessAvg)}
        <div class="cmm-body">${panelBody}</div>
      `;if(focusAttr&&state.open&&document.activeElement===document.body){const restored=Array.from(panel.querySelectorAll(`[${focusAttr}]`)).find(node=>node.getAttribute(focusAttr)===focusValue);if(restored){try{restored.focus({preventScroll:true});}catch(_){}}}
syncSelectedPrereqReadiness(panel,selected);if(panel.dataset.cmmBound!=='1'){panel.dataset.cmmBound='1';panel.addEventListener('click',(e)=>{const readinessInfo=e.target&&e.target.closest?e.target.closest('[data-cmm-course-readiness-info]'):null;if(readinessInfo){e.preventDefault();e.stopPropagation();const wrap=readinessInfo.closest('.cmm-headreadiness-wrap');const help=wrap&&wrap.querySelector?wrap.querySelector('.cmm-readiness-help'):null;if(help){if(help.hasAttribute('hidden'))help.removeAttribute('hidden');else help.setAttribute('hidden','');}
return;}
if(e.target&&e.target.closest&&!e.target.closest('.cmm-headreadiness-wrap')){panel.querySelectorAll('.cmm-readiness-help').forEach((el)=>el.setAttribute('hidden',''));}
const toggle=e.target&&e.target.closest?e.target.closest('[data-cmm-lecture-toggle]'):null;if(toggle){e.preventDefault();e.stopPropagation();const id=String(toggle.getAttribute('data-cmm-lecture-toggle')||'');rememberDialogScroll(panel);if(state.expandedLecture.has(id))state.expandedLecture.delete(id);else state.expandedLecture.add(id);renderMap(anchor,panel);return;}
const filterBtn=e.target&&e.target.closest?e.target.closest('[data-cmm-filter]'):null;if(filterBtn){e.preventDefault();e.stopPropagation();const key=filterBtn.getAttribute('data-cmm-filter');if(key==='weak'||key==='unvisited'){rememberDialogScroll(panel);state.filters[key]=!state.filters[key];renderMap(anchor,panel);}
return;}
const conceptBtn=e.target&&e.target.closest?e.target.closest('[data-cmm-select-concept]'):null;if(conceptBtn){e.preventDefault();e.stopPropagation();if(cmmIsTouchLikeViewport()){state.preservedScrollTop=null;state.scrollToFocus=true;}else{rememberDialogScroll(panel);}
state.selectedConceptLoc=String(conceptBtn.getAttribute('data-cmm-select-concept')||'');renderMap(anchor,panel);return;}
const jumpLecture=e.target&&e.target.closest?e.target.closest('[data-cmm-jump-lecture]'):null;if(jumpLecture){e.preventDefault();e.stopPropagation();const id=String(jumpLecture.getAttribute('data-cmm-jump-lecture')||'');if(id){rememberDialogScroll(panel);state.expandedLecture.add(id);state.scrollToLecture=id;renderMap(anchor,panel);}
return;}});}
restoreDialogScroll(panel);if(state.scrollToFocus){state.scrollToFocus=false;const target=q('.cmm-focuscard',panel);if(target&&typeof target.scrollIntoView==='function'){window.setTimeout(()=>{try{target.scrollIntoView({behavior:'smooth',block:'start'});}
catch(_){try{target.scrollIntoView();}catch(__){}}},36);}}
if(state.scrollToLecture){const target=q(`.cmm-lecture[data-lecture="${state.scrollToLecture}"]`,panel);state.scrollToLecture='';if(target&&typeof target.scrollIntoView==='function'){window.setTimeout(()=>{try{target.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(_){try{target.scrollIntoView();}catch(__){}}},24);}}
try{window.MathJax&&window.MathJax.typesetPromise&&window.MathJax.typesetPromise([panel]).catch(()=>{});}catch(_){}}catch(_){if(seq!==state.seq)return;panel.innerHTML=`
        <div class="cmm-head">
          <div class="cmm-title" id="${PANEL_ID}-title">Course diagnostics</div>
          <div class="cmm-sub">The panel could not be built right now.</div>
        </div>
        <div class="cmm-body"><div class="cmm-error">Failed to load course data.</div></div>
      `;}}
function mount(preserveOpen){preserveOpen=preserveOpen===true;const anchor=q('[data-course-mastery-map]');if(!anchor)return;ensureStyles();state.anchor=anchor;const btn=ensureTitleEntry(anchor);const{modal,panel}=ensureModal(anchor);if(!preserveOpen){state.open=false;state.expandedLecture.clear();}
modal.hidden=!state.open;document.documentElement.classList.toggle('cmm-modal-open',state.open);document.body.classList.toggle('cmm-modal-open',state.open);if(btn)btn.setAttribute('aria-expanded',state.open?'true':'false');if(!panel.innerHTML)renderPanelShell(panel);if(state.open)renderMap(anchor,panel);}
function scheduleRefresh(){window.clearTimeout(state.refreshTimer);state.refreshTimer=window.setTimeout(()=>{state.data=null;state.prereqReadySeq+=1;state.prereqReadyCache=new Map();mount(true);},80);}
window.MkCourseMasteryMap={refresh:scheduleRefresh,mount,};function mountPreservingOpen(){mount(state.open===true);}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mountPreservingOpen,{once:true});}else{mount();}
document.addEventListener('DOMContentSwitch',mountPreservingOpen);window.addEventListener('pageshow',mountPreservingOpen);})();