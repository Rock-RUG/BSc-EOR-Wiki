(function(){"use strict";function __mkFetchSearchIndex(url,init){const shared=window.__mkFetchJsonShared;if(typeof shared==="function")return shared(url,init);return fetch(url,init).then(function(r){return r&&r.ok?r.json():null;});}
const COURSE_TAG_MAP={i2da:"Introduction to Data Analytics",m1c:"Math I: Calculus",orm:"OR Modelling",m2la:"Math II: Linear Algebra",pt:"Probability Theory for EOR",prog:"Programming for EOR",fin:"Finance for EOR",m3a:"Math III: Analysis",micro:"Microeconomics for EOR",m4mc:"Math IV: Multivariate Calculus",pd:"Probability Distributions",sm1:"Statistical Modelling for EOR",macro:"Macroeconomics for EOR",m5ala:"Math V: Advanced Linear Algebra",si:"Statistical Inference",lms:"Linear Models in Statistics",m6co:"Math VI: Convexity and Optimization",sor:"Stochastic Operations Research",dor:"Discrete Operations Research",i2e:"Introduction to Econometrics",li:"Life Insurance",gt:"Game Theory",ri:"Risk Insurance",};const LS_KEY="concept_mastery_v1";const AIQ_KEY="concept_quiz_sessions_v1";const STYLE_ID="mm-manager-style-v17-cloud-sync";let mmSortKey="recent";let mmSearchQuery="";let mmRender=null;let mmReturnFocus=null;let mmLectureMap=null;let mmLectureMapPromise=null;const mmAiConcepts=new Map();const mmAiConceptPromises=new Map();function escapeHtml(s){return String(s==null?"":s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function mathToken(stash,latex){const token=`@@MMATH${stash.length}@@`;const tex=String(latex||"").trim();stash.push({token,html:tex?`\\(${tex}\\)`:""});return token;}
function repairMathPollutedTitle(value){const stash=[];let s=String(value||"");s=s.replace(/\\\((.+?)\\\)/g,(m)=>{const token=`@@MMATH${stash.length}@@`;stash.push({token,html:m});return token;});["R","C","N","Z","Q"].forEach((sym)=>{const bb=`\\\\mathbb\\s*\\{?\\s*${sym}\\s*\\}?`;const pollutedPow=new RegExp(`\\b${sym}\\s*([A-Za-z0-9]+)\\s*${bb}\\s*\\^\\s*\\{?\\s*([A-Za-z0-9]+)\\s*\\}?\\s*${sym}\\s*\\1\\b`,"g");s=s.replace(pollutedPow,(_,_plainExp,texExp)=>mathToken(stash,`\\mathbb{${sym}}^{${texExp}}`));const pollutedBare=new RegExp(`\\b${sym}\\s*${bb}\\s*${sym}\\b`,"g");s=s.replace(pollutedBare,()=>mathToken(stash,`\\mathbb{${sym}}`));const rawPow=new RegExp(`${bb}\\s*\\^\\s*\\{?\\s*([A-Za-z0-9]+)\\s*\\}?`,"g");s=s.replace(rawPow,(_,exp)=>mathToken(stash,`\\mathbb{${sym}}^{${exp}}`));const rawBare=new RegExp(`${bb}`,"g");s=s.replace(rawBare,()=>mathToken(stash,`\\mathbb{${sym}}`));});s=s.replace(/\b(Big|big)-O{2,}\b/g,(_,prefix)=>`${prefix}-`+mathToken(stash,"O")).replace(/\b(Little|little)-o{2,}\b/g,(_,prefix)=>`${prefix}-`+mathToken(stash,"o"));s=s.replace(/\b([A-Za-z])\1{2}(?=-(?:test|th|axis|coordinate|norm|metric|root|lemma|case|value|variable|term|series|sequence|space|plane|line|method|rule|integral|derivative|function)\b)/gi,(_,letter)=>mathToken(stash,letter));s=s.replace(/\u00B6/g,"").replace(/¶/g,"").replace(/\s+/g," ").trim();stash.forEach((item)=>{s=s.split(item.token).join(item.html);});return s;}
function cleanTitle(s){return repairMathPollutedTitle(s);}
function normId(id){return String(id||"").split("#")[0].split("?")[0].replace(/^\/+/,"").trim();}
function normComparable(id){return normId(id).replace(/\/index\.html$/i,"/").replace(/\/+$/g,"").toLowerCase();}
function prettyCourseName(raw){const s=String(raw||"").trim();if(!s)return"";const maybeKey=s.toLowerCase().split(/[-_]/)[0];if(COURSE_TAG_MAP[maybeKey])return COURSE_TAG_MAP[maybeKey];const t=s.toLowerCase();if(t.includes("math-i-calculus"))return COURSE_TAG_MAP.m1c;if(t.includes("math-ii-linear-algebra"))return COURSE_TAG_MAP.m2la;if(t.includes("math-iii-analysis"))return COURSE_TAG_MAP.m3a;if(t.includes("multivariate-calculus"))return COURSE_TAG_MAP.m4mc;if(t.includes("advanced-linear-algebra"))return COURSE_TAG_MAP.m5ala;if(t.includes("convexity")||t.includes("optimization"))return COURSE_TAG_MAP.m6co;if(t.includes("or-modelling")||t.includes("orm"))return COURSE_TAG_MAP.orm;return s.replace(/[-_]+/g," ").replace(/\b\w/g,(m)=>m.toUpperCase());}
function deriveCourseName(loc){const segs=String(loc||"").split("/").filter(Boolean);return segs.length>=2?segs[segs.length-2]:"";}
function unitNounFromType(type){return String(type||"lecture").toLowerCase()==="week"?"Week":"Lecture";}
function deriveLectureLabel(loc){const segs=String(loc||"").split("/").filter(Boolean);const candidates=segs.slice(0,-1);for(let i=candidates.length-1;i>=0;i-=1){const m=String(candidates[i]||"").match(/^(lecture|week)[-_ ]*0*(\d+)$/i);if(m)return`${unitNounFromType(m[1])} ${Number(m[2])}`;}
return"";}
function getSiteRootUrl(){const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]')||document.querySelector('script[src*="assets/javascripts"]');const attr=script?script.getAttribute("src"):(link?(link.getAttribute("href")||link.getAttribute("src")):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname||"/";const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function hrefForLoc(loc){try{const root=new URL(getSiteRootUrl());const target=new URL(String(loc||""),root);if(!/^https?:$/.test(target.protocol)||target.origin!==root.origin||target.username||target.password)return"#";return target.href;}catch(_){return"#";}}
function typesetMathIn(el){if(!el)return;try{if(typeof window.__mkRenderDynamicMath==="function"){const out=window.__mkRenderDynamicMath(el);if(out&&typeof out.catch==="function")out.catch(()=>{});return;}
if(typeof window.__mkRenderDynamicMathSoon==="function")window.__mkRenderDynamicMathSoon(el);if(window.MathJax&&typeof window.MathJax.typesetPromise==="function"){window.MathJax.typesetPromise([el]).catch(()=>{});}}catch(_){}}
function mmAccountContext(){if(window.__mkExamMode)return"exam-local";try{const profile=JSON.parse(localStorage.getItem("mk_comment_profile_v1")||"{}");const key=String(profile&&(profile.accountKey||profile.account_key||profile.nameKey||profile.name_key)||"").replace(/^user:/i,"").trim().toLowerCase();const profileOwner=key?`account:${key}`:"guest";const workspaces=window.MkAccountWorkspaces;const owner=workspaces&&typeof workspaces.activeOwner==="function"?workspaces.activeOwner():localStorage.getItem("mk_account_workspace_active_owner_v1")||profileOwner;if(owner!==profileOwner)return null;return JSON.stringify([owner,localStorage.getItem("mk_hot_visitor_id_v1")||""]);}catch(_){return null;}}
function mmAccountContextIsCurrent(context){return context!=null&&(window.__mkExamMode||!window.__mkAccountWorkspaceSwitching)&&context===mmAccountContext();}
function mmViewContext(){const modal=document.getElementById("mm-modal");return JSON.stringify([window.location&&window.location.pathname||document.baseURI||"",modal&&modal.__mmClosedVersion||0]);}
function mmControlIsCurrent(control,accountContext,viewContext){const modal=document.getElementById("mm-modal");return!!(control&&control.isConnected&&modal&&modal.style.display==="block"&&viewContext===mmViewContext()&&mmAccountContextIsCurrent(accountContext));}
function readAll(){const local=mmReadStoredMap(LS_KEY);const cm=window.ConceptMastery;if(cm&&typeof cm._readAll==="function"&&cm._readAll({requireReadable:true})==null){throw new Error("Local mastery history could not be read.");}
if(window.MkAccountData&&typeof window.MkAccountData.getMasteryMap==="function"){const map=window.MkAccountData.getMasteryMap();if(!map||typeof map!=="object"||Array.isArray(map))throw new Error("Account mastery records could not be read.");return map;}
return local;}
function mmReadStoredMap(key){const raw=localStorage.getItem(key);const map=raw==null?{}:JSON.parse(raw);const object=value=>value&&typeof value==="object"&&!Array.isArray(value);if(!object(map)||!Object.values(map).every(value=>key===AIQ_KEY?Array.isArray(value)&&value.every(session=>object(session)&&(session.questions==null||Array.isArray(session.questions))):object(value)&&["history","reviewHistory","masteryHistory"].every(field=>value[field]==null||Array.isArray(value[field])&&value[field].every(object)))){throw new Error("Local learning records could not be read.");}
return map;}
function writeAll(obj){const context=mmAccountContext();if(!mmAccountContextIsCurrent(context))return false;let saved=false;try{if(window.ConceptMastery&&typeof window.ConceptMastery._writeAll==="function"){saved=window.ConceptMastery._writeAll(obj||{},{requirePersistence:true})===true;}else{const payload=JSON.stringify(obj||{});localStorage.setItem(LS_KEY,payload);saved=localStorage.getItem(LS_KEY)===payload;}}catch(_){}
if(!saved||!mmAccountContextIsCurrent(context))return false;try{window.dispatchEvent(new CustomEvent("conceptMasteryChanged",{detail:{source:"mastery-manager"}}));}catch(_){}
return true;}
function managerWriteFailed(){try{window.alert("The change could not be fully saved in this browser. Please retry when local storage is available.");}catch(_){}}
function readQuizSessions(){if(window.__mkExamMode)return{};return mmReadStoredMap(AIQ_KEY);}
function validLevel(m){return[0,1,2,3].includes(Number(m));}
function historyKind(h){const kind=String(h&&(h.kind||h.type||h.event||h.action)||"").toLowerCase().trim();if(kind==="view"||kind==="visit"||kind==="seen")return"view";return"mastery";}
function historyTs(h){return Number(h&&(h.ts||h.time||h.at||h.date))||0;}
function isAiSource(source){return/(?:ai|mcq|quiz)/i.test(String(source||""));}
function normaliseHistoryFallback(history,currentLevel,lastReviewed,reviewCount,lastViewed){const src=Array.isArray(history)?history:[];const out=[];for(const item of src){const ts=historyTs(item);if(!ts)continue;const srcName=typeof item?.source==="string"?item.source:"";if(historyKind(item)==="view"){out.push({kind:"view",ts,source:srcName,visitId:item&&item.visitId||""});continue;}
const mm=Number(item&&(item.m??item.level??item.mastery));if(!validLevel(mm))continue;out.push({kind:"mastery",m:mm,ts,source:srcName});}
out.sort((a,b)=>(Number(a.ts)||0)-(Number(b.ts)||0));if(!out.some((x)=>x.kind==="mastery")&&validLevel(currentLevel)&&Number(lastReviewed)>0&&Number(reviewCount)>0){out.push({kind:"mastery",m:Number(currentLevel),ts:Number(lastReviewed),source:"legacy"});}
if(Number(lastViewed)>0&&!out.some((x)=>x.kind==="view"&&Number(x.ts)===Number(lastViewed))){out.push({kind:"view",ts:Number(lastViewed),source:"legacy",visitId:""});}
out.sort((a,b)=>(Number(a.ts)||0)-(Number(b.ts)||0));return out;}
function normaliseRecord(rec){if(window.ConceptMastery&&typeof window.ConceptMastery._normaliseRecord==="function"){return window.ConceptMastery._normaliseRecord(rec);}
const r=(rec&&typeof rec==="object")?rec:{};const explicitUnrated=r.unrated===true||String(r.state||"").toLowerCase()==="unrated";const rawM=(r.m===null||r.m==="")?null:Number(r.m);const m=explicitUnrated?null:(validLevel(rawM)?rawM:null);const counts0=r.counts&&typeof r.counts==="object"?r.counts:{};const counts=explicitUnrated?{full:0,know:0,fuzzy:0,dont:0}:{full:Number(counts0.full)||0,know:Number(counts0.know)||0,fuzzy:Number(counts0.fuzzy)||0,dont:Number(counts0.dont)||0,};const lastReviewed=explicitUnrated?0:(Number(r.lastReviewed)||0);const lastViewed=Math.max(Number(r.lastViewed)||0,Number(r.lastSeen)||0,0);const reviewCountRaw=Number(r.reviewCount)||0;const reviewCount=explicitUnrated?0:Math.max(reviewCountRaw,counts.full+counts.know+counts.fuzzy+counts.dont);let history=normaliseHistoryFallback(r.history||r.reviewHistory||r.masteryHistory,m,lastReviewed,reviewCount,lastViewed);if(explicitUnrated)history=history.filter((h)=>historyKind(h)==="view");const historyViews=history.filter((h)=>historyKind(h)==="view").length;const viewCount=Math.max(Number(r.viewCount)||0,reviewCount,historyViews);const visitCount=Math.max(Number(r.visitCount)||0,viewCount,reviewCount);return{m,unrated:explicitUnrated||m==null,state:(explicitUnrated||m==null)?"unrated":"rated",lastReviewed,reviewCount,viewCount,visitCount,lastViewed,visited:!!(r.visited||visitCount>0||lastViewed>0),counts,history,title:typeof r.title==="string"?cleanTitle(r.title):"",course:typeof r.course==="string"?r.course:"",coursePath:typeof r.coursePath==="string"?r.coursePath:"",};}
function mLabel(m){if(m===3)return"Mastered";if(m===2)return"Clear";if(m===1)return"Unclear";if(m===0)return"Unknown";return"Not rated";}
function mClass(m){if(m===3)return"mm-level-mastered";if(m===2)return"mm-level-clear";if(m===1)return"mm-level-fuzzy";if(m===0)return"mm-level-unknown";return"mm-level-unrated";}
function mmSvg(name,size){const s=Number(size)||18;const common=`xmlns="http://www.w3.org/2000/svg" class="mm-svg-icon" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"`;const stroke=`fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;if(name==="shield-check-outline")return`<svg ${common} ${stroke}><path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"/><path d="M9 12.5l2 2 4-4.5"/></svg>`;if(name==="check-circle-outline")return`<svg ${common} ${stroke}><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.2 2.2 4.8-5.2"/></svg>`;if(name==="help-circle-outline")return`<svg ${common} ${stroke}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 3.5"/><circle cx="12" cy="17" r="1"/></svg>`;if(name==="close-circle-outline")return`<svg ${common} ${stroke}><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>`;if(name==="eye-outline")return`<svg ${common} ${stroke}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/></svg>`;if(name==="quiz")return`<svg ${common} ${stroke}><path d="M9 3h6"/><path d="M10 3v4.5L5.5 16a3.6 3.6 0 0 0 3.2 5h6.6a3.6 3.6 0 0 0 3.2-5L14 7.5V3"/><path d="M8 14h8"/><path d="M9.5 17h5"/></svg>`;if(name==="delete")return`<svg ${common} ${stroke}><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/></svg>`;if(name==="download")return`<svg ${common} ${stroke}><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>`;if(name==="upload")return`<svg ${common} ${stroke}><path d="M12 21V9"/><path d="M7 14l5-5 5 5"/><path d="M5 3h14"/></svg>`;return"";}
function mmSvgForLevel(m,size){if(m===3)return mmSvg("shield-check-outline",size);if(m===2)return mmSvg("check-circle-outline",size);if(m===1)return mmSvg("help-circle-outline",size);if(m===0)return mmSvg("close-circle-outline",size);return"";}
function mmIcon(m,size){return`<span class="mm-icon-inline">${mmSvgForLevel(m, size || 16)}</span>`;}
function fmtTime(ms){if(!ms)return"";try{return new Date(ms).toLocaleString();}catch(_){return"";}}
function sessionTime(session){return Number(session&&(session.completed_at||session.ts||session.started_at))||0;}
function isCompletedQuizSession(session){if(!session||typeof session!=="object")return false;if(session.completed_at||session.suggested_mastery!=null)return true;return Array.isArray(session.questions)&&session.questions.length>0&&session.correct_count!=null;}
function quizSessionsForLoc(loc,quizStore){const store=quizStore||readQuizSessions();const target=normComparable(loc);const out=[];Object.keys(store||{}).forEach((key)=>{const arr=Array.isArray(store[key])?store[key]:[];const keyNorm=normComparable(key);arr.forEach((session)=>{const sid=normComparable(session&&(session.concept_id||key));if(keyNorm===target||sid===target)out.push(session);});});return out.filter(isCompletedQuizSession).sort((a,b)=>sessionTime(b)-sessionTime(a));}
function allQuizSessionsFlat(quizStore){const store=quizStore||readQuizSessions();const out=[];Object.keys(store||{}).forEach((key)=>{const arr=Array.isArray(store[key])?store[key]:[];arr.forEach((session)=>{if(isCompletedQuizSession(session))out.push({key,session});});});return out;}
function directRatingCount(rec){const hist=Array.isArray(rec&&rec.history)?rec.history:[];return hist.filter((h)=>historyKind(h)==="mastery"&&!isAiSource(h&&h.source)).length;}
function aiMasteryAcceptCount(rec){const hist=Array.isArray(rec&&rec.history)?rec.history:[];return hist.filter((h)=>historyKind(h)==="mastery"&&isAiSource(h&&h.source)).length;}
function quizScore(session){const questions=Array.isArray(session&&session.questions)?session.questions:[];const total=questions.length||Number(session&&session.total_count)||0;const correct=Number(session&&session.correct_count);const cc=Number.isFinite(correct)?correct:questions.filter((q)=>q&&q.correct).length;return{correct:cc,total};}
function lectureInfoFromTags(tagsLike){const tags=Array.isArray(tagsLike)?tagsLike:(tagsLike&&typeof tagsLike.forEach==="function")?Array.from(tagsLike):[];const withCourse=/^([a-z0-9]+)[-_]?(lecture|week)[-_]?0*(\d+)$/i;const bare=/^(lecture|week)[-_]?0*(\d+)$/i;for(const raw of tags){const t=String(raw||"").trim().toLowerCase();let m=t.match(withCourse);if(m){const courseCode=m[1];const unitType=String(m[2]||"lecture").toLowerCase();const lectureNum=parseInt(m[3],10);const courseName=COURSE_TAG_MAP[courseCode]||"";if(!Number.isFinite(lectureNum))continue;return{courseCode,courseName,unitType,unitNum:lectureNum,lectureNum,unitLabel:`${unitNounFromType(unitType)} ${lectureNum}`,lectureLabel:`${unitNounFromType(unitType)} ${lectureNum}`};}
m=t.match(bare);if(m){const unitType=String(m[1]||"lecture").toLowerCase();const lectureNum=parseInt(m[2],10);if(!Number.isFinite(lectureNum))continue;return{courseCode:"",courseName:"",unitType,unitNum:lectureNum,lectureNum,unitLabel:`${unitNounFromType(unitType)} ${lectureNum}`,lectureLabel:`${unitNounFromType(unitType)} ${lectureNum}`};}}
return null;}
async function loadLectureMapOnce(){if(mmLectureMap)return mmLectureMap;if(mmLectureMapPromise)return mmLectureMapPromise;const pending=Promise.resolve().then(async()=>{const root=getSiteRootUrl();const candidates=[new URL("search/search_index.json",root).href,new URL("search_index.json",root).href,];for(const url of candidates){try{const request=__mkFetchSearchIndex(url,{credentials:"same-origin"});const data=await request;if(!data||!Array.isArray(data.docs)){for(const name of["__mkSharedJsonPromiseMap","__mkMaterialSearchIndexPromises"]){const cache=window[name];if(cache&&cache[url]===request)delete cache[url];}
continue;}
const map=new Map();for(const doc of data.docs){const key=normId(doc&&doc.location);if(!key)continue;const info=lectureInfoFromTags(doc&&doc.tags);if(!info)continue;map.set(normComparable(key),info.unitLabel||`Lecture ${info.lectureNum}`);}
mmLectureMap=map;return map;}catch(_){}}
return new Map();}).catch(()=>new Map()).finally(()=>{if(mmLectureMapPromise===pending)mmLectureMapPromise=null;});mmLectureMapPromise=pending;return pending;}
function getLectureLabelForLoc(loc){const key=normComparable(loc);if(mmLectureMap&&mmLectureMap.has(key))return mmLectureMap.get(key)||"";return deriveLectureLabel(loc);}
function aiShardUrl(conceptId){const rel="assets/ai-mcq/"+
String(conceptId||"").replace(/^\/+/,"").split("/").map(encodeURIComponent).join("/")+".json";return new URL(rel,getSiteRootUrl()).href;}
function loadAiConceptOnce(conceptId){if(window.__mkExamMode)return Promise.resolve(null);const key=normComparable(conceptId);if(!key)return Promise.resolve(null);if(mmAiConcepts.has(key))return Promise.resolve(mmAiConcepts.get(key));if(mmAiConceptPromises.has(key))return mmAiConceptPromises.get(key);const p=Promise.resolve().then(()=>fetch(aiShardUrl(conceptId),{credentials:"same-origin"})).then(async(r)=>{if(r&&(r.status===404||r.status===410)){mmAiConcepts.set(key,null);return null;}
if(!r||!r.ok)return null;const j=await r.json();const concept=j&&j.concept;if(!concept||typeof concept!=="object"||Array.isArray(concept)||normComparable(j.concept_id)!==key||normComparable(concept.concept_id)!==key||!Array.isArray(concept.questions))return null;mmAiConcepts.set(key,concept);return concept;}).catch(()=>null).finally(()=>{if(mmAiConceptPromises.get(key)===p)mmAiConceptPromises.delete(key);});mmAiConceptPromises.set(key,p);return p;}
function loadAiConceptsForSessions(sessions){const ids=[];(Array.isArray(sessions)?sessions:[]).forEach((s)=>{const id=s&&s.concept_id;if(id&&!ids.includes(id))ids.push(id);});return Promise.all(ids.map((id)=>loadAiConceptOnce(id)));}
function findBankConcept(conceptId){return mmAiConcepts.get(normComparable(conceptId))||null;}
function findBankQuestion(conceptId,qid){const concept=findBankConcept(conceptId);const qs=Array.isArray(concept&&concept.questions)?concept.questions:[];return qs.find((q)=>String(q&&q.id)===String(qid))||null;}
function getMetaForLoc(loc,rec,sessions){const rr=normaliseRecord(rec);const fromSession=Array.isArray(sessions)&&sessions.length?sessions[0]:null;return{title:rr.title||cleanTitle(fromSession&&(fromSession.concept_title||fromSession.title)||loc.split("/").pop()||loc),course:rr.course||prettyCourseName(deriveCourseName(loc)),coursePath:rr.coursePath||String(loc||"").split("/").slice(0,-1).join("/"),};}
function getConceptKeys(all,quizStore){const keys=new Map();Object.keys(all||{}).forEach((k)=>{const n=normId(k);if(n)keys.set(normComparable(n),n);});Object.keys(quizStore||{}).forEach((k)=>{const n=normId(k);if(n)keys.set(normComparable(n),n);});Object.keys(quizStore||{}).forEach((k)=>{const arr=Array.isArray(quizStore[k])?quizStore[k]:[];arr.forEach((s)=>{const n=normId(s&&s.concept_id||k);if(n)keys.set(normComparable(n),n);});});return Array.from(keys.values());}
function globalStats(all,quizStore){let total=0,m3=0,m2=0,m1=0,m0=0,unrated=0;let direct=0,aiAccepted=0,views=0;Object.keys(all||{}).forEach((k)=>{total+=1;const rec=normaliseRecord(all[k]);if(rec.m===3)m3+=1;else if(rec.m===2)m2+=1;else if(rec.m===1)m1+=1;else if(rec.m===0)m0+=1;else unrated+=1;direct+=directRatingCount(rec);aiAccepted+=aiMasteryAcceptCount(rec);views+=Number(rec.viewCount)||0;});const quizzes=allQuizSessionsFlat(quizStore);let correct=0,attempted=0;quizzes.forEach(({session})=>{const sc=quizScore(session);correct+=sc.correct;attempted+=sc.total;});return{total,m3,m2,m1,m0,unrated,direct,aiAccepted,views,aiChecks:quizzes.length,correct,attempted};}
function buildItems(all,quizStore){if(all===undefined)all=readAll();if(quizStore===undefined)quizStore=readQuizSessions();const keys=getConceptKeys(all,quizStore);const items=keys.map((loc)=>{const raw=all[loc]||all[Object.keys(all).find((k)=>normComparable(k)===normComparable(loc))]||{};const rec=normaliseRecord(raw);const sessions=quizSessionsForLoc(loc,quizStore);const meta=getMetaForLoc(loc,raw,sessions);if(!sessions.length){const isPathTitle=value=>!value||[loc,loc.split("/").pop()].some(path=>normComparable(value)===normComparable(path));if(isPathTitle(meta.title)){let latestTitleTime=-1;Object.entries(quizStore).forEach(([key,rows])=>{(Array.isArray(rows)?rows:[]).forEach(session=>{if(!session||normComparable(session.concept_id||key)!==normComparable(loc))return;const title=typeof session.concept_title==="string"?cleanTitle(session.concept_title):"";const ts=sessionTime(session);if(!isPathTitle(title)&&ts>=latestTitleTime){meta.title=title;latestTitleTime=ts;}});});}}
const latestQuiz=sessions.length?sessionTime(sessions[0]):0;const ratingRecent=Array.isArray(rec.history)?rec.history.filter((h)=>historyKind(h)==="mastery").reduce((mx,h)=>Math.max(mx,historyTs(h)),0):0;const recent=Math.max(ratingRecent,Number(rec.lastReviewed)||0,Number(rec.lastViewed)||0,latestQuiz);return{loc,rec,sessions,title:cleanTitle(meta.title||loc),courseName:prettyCourseName(meta.course||deriveCourseName(loc)),lectureLabel:getLectureLabelForLoc(loc),m:(typeof rec.m==="number")?rec.m:null,views:Number(rec.viewCount)||0,direct:directRatingCount(rec),aiAccepted:aiMasteryAcceptCount(rec),aiChecks:sessions.length,latestQuiz,ratingRecent,recent,};});return items;}
function sortItems(items){const arr=items.slice();arr.sort((a,b)=>{const at=(a.title||"").toLowerCase();const bt=(b.title||"").toLowerCase();const am=typeof a.m==="number"?a.m:-1;const bm=typeof b.m==="number"?b.m:-1;if(mmSortKey==="mastery")return(bm-am)||(b.recent-a.recent)||at.localeCompare(bt);if(mmSortKey==="views")return(b.views-a.views)||(b.recent-a.recent)||at.localeCompare(bt);if(mmSortKey==="ai")return(b.aiChecks-a.aiChecks)||(b.latestQuiz-a.latestQuiz)||at.localeCompare(bt);if(mmSortKey==="direct")return(b.direct-a.direct)||(b.recent-a.recent)||at.localeCompare(bt);if(mmSortKey==="title")return at.localeCompare(bt);const aRated=typeof a.m==="number"?1:0;const bRated=typeof b.m==="number"?1:0;return(bRated-aRated)||((Number(b.ratingRecent)||0)-(Number(a.ratingRecent)||0))||(b.recent-a.recent)||at.localeCompare(bt);});return arr;}
function filterItems(items){const q=String(mmSearchQuery||"").toLowerCase().trim();if(!q)return items;const toks=q.split(/\s+/).filter(Boolean);return items.filter((item)=>{const hay=[item.title,item.courseName,item.lectureLabel,item.loc,mLabel(item.m)].join(" ").toLowerCase();return toks.every((t)=>hay.includes(t));});}
function historyLabel(h){if(historyKind(h)==="view")return"Viewed";return mLabel((h&&Object.prototype.hasOwnProperty.call(h,"m"))?Number(h.m):null);}
function historyRowsHtml(rec){const hist=Array.isArray(rec.history)?rec.history.slice().sort((a,b)=>historyTs(b)-historyTs(a)):[];if(!hist.length)return`<div class="mm-empty">No mastery history yet.</div>`;return hist.map((h)=>{const kind=historyKind(h);const level=kind==="view"?null:Number(h&&h.m);const src=String(h&&h.source||"");return`
        <div class="mm-event-row ${kind === "view" ? "is-view" : mClass(level)}">
          <div class="mm-event-icon">${kind === "view" ? mmSvg("eye-outline", 16) : mmSvgForLevel(level, 16)}</div>
          <div class="mm-event-main">
            <div class="mm-event-title">${escapeHtml(historyLabel(h))}</div>
            <div class="mm-event-meta">${escapeHtml(fmtTime(historyTs(h)))}${kind === "mastery" && src ? `· ${escapeHtml(isAiSource(src)?"AI-suggested rating accepted":"Direct rating")}` : ""}</div>
          </div>
        </div>`;}).join("");}
function optionTextFromSession(item,index){const opts=Array.isArray(item&&item.shown_options)?item.shown_options:[];if(typeof index!=="number"&&typeof index!=="string")return"";if(typeof index==="string"&&!index.trim())return"";const position=Number(index);if(!Number.isInteger(position)||position<0||position>=opts.length)return"";const text=opts[position];return text==null?"":String(text);}
function wrongQuestionsHtml(session){const qs=Array.isArray(session&&session.questions)?session.questions:[];const wrong=qs.filter((q)=>q&&q.correct===false);if(!wrong.length)return`<div class="mm-good-news">No wrong answers in this check.</div>`;return wrong.map((item,idx)=>{const bankQ=findBankQuestion(session.concept_id,item.qid);const questionText=item.question||(bankQ&&bankQ.question)||`Question ${escapeHtml(item.qid || idx + 1)}`;const explanation=item.explanation||(bankQ&&bankQ.explanation)||"";const yourAnswer=optionTextFromSession(item,item.selected_index);const correctAnswer=optionTextFromSession(item,item.correct_index);return`
        <details class="mm-wrong-question">
          <summary>
            <span>Wrong question ${idx + 1}</span>
            <span class="mm-soft">${escapeHtml(item.difficulty || "")}${item.question_type ? `· ${escapeHtml(item.question_type)}` : ""}</span>
          </summary>
          <div class="mm-question-text">${escapeHtml(questionText)}</div>
          <div class="mm-answer-grid">
            <div><strong>Your answer</strong><br>${yourAnswer ? escapeHtml(yourAnswer) : `<span class="mm-soft">No answer recorded</span>`}</div>
            <div><strong>Correct answer</strong><br>${correctAnswer ? escapeHtml(correctAnswer) : `<span class="mm-soft">Not recorded</span>`}</div>
          </div>
          ${explanation ? `<div class="mm-explanation"><strong>Explanation</strong><br>${escapeHtml(explanation)}</div>` : ""}
        </details>`;}).join("");}
function quizSessionsHtml(loc,sessions){if(!sessions||!sessions.length)return`<div class="mm-empty">No AI concept checks for this concept yet.</div>`;return sessions.map((session,idx)=>{const score=quizScore(session);const level=mLabel(Number(session.suggested_mastery));const when=fmtTime(sessionTime(session));const wrongCount=(Array.isArray(session.questions)?session.questions:[]).filter((q)=>q&&q.correct===false).length;return`
        <details class="mm-session" ${idx === 0 ? "open" : ""}>
          <summary>
            <span class="mm-session-title">AI check · ${escapeHtml(when || "time unknown")}</span>
            <span class="mm-session-score">${escapeHtml(String(score.correct))}/${escapeHtml(String(score.total || "?"))} correct · ${escapeHtml(level)}</span>
          </summary>
          <div class="mm-session-body">
            <div class="mm-session-pills">
              <span>${escapeHtml(String(score.correct))}/${escapeHtml(String(score.total || "?"))} correct</span>
              <span>Suggested: ${escapeHtml(level)}</span>
              <span>${wrongCount} wrong</span>
            </div>
            ${wrongQuestionsHtml(session)}
          </div>
        </details>`;}).join("");}
function compactMetric(label,value,extraClass){return`<span class="mm-compact-metric ${extraClass || ""}"><strong>${escapeHtml(String(value))}</strong> ${escapeHtml(label)}</span>`;}
function cardHtml(item){const href=hrefForLoc(item.loc);const histCount=Array.isArray(item.rec.history)?item.rec.history.length:0;const statusClass=mClass(item.m);return`
      <article class="mm-card ${statusClass}" data-loc="${escapeHtml(item.loc)}">
        <div class="mm-card-line">
          <div class="mm-card-course">
            <span>${escapeHtml(item.courseName || "Unknown course")}</span>
            ${item.lectureLabel ? `<span>${escapeHtml(item.lectureLabel)}</span>` : ""}
          </div>
          <a class="mm-card-title" href="${escapeHtml(href)}">${escapeHtml(item.title || item.loc)}</a>

          <div class="mm-level-cell">
            <label class="mm-small-label">Level</label>
            <select data-loc="${escapeHtml(item.loc)}" class="mm-level mm-select" aria-label="Mastery level for ${escapeHtml(item.title || item.loc)}">
              <option value="" ${item.m == null ? "selected" : ""}>Not rated</option>
              <option value="3" ${item.m === 3 ? "selected" : ""}>Mastered</option>
              <option value="2" ${item.m === 2 ? "selected" : ""}>Clear</option>
              <option value="1" ${item.m === 1 ? "selected" : ""}>Unclear</option>
              <option value="0" ${item.m === 0 ? "selected" : ""}>Unknown</option>
            </select>
          </div>

          <div class="mm-inline-actions">
            <div class="mm-compact-stats" aria-label="Learning record summary">
              ${compactMetric("views", item.views)}
              ${compactMetric("direct", item.direct)}
              ${window.__mkExamMode ? "" : compactMetric("AI", item.aiChecks)}
            </div>
            <button class="mm-pill-btn mm-panel-toggle" type="button" data-panel="history" aria-expanded="false">History <span>${escapeHtml(String(histCount))}</span><span class="mm-toggle-chevron" aria-hidden="true">▾</span></button>
            ${window.__mkExamMode ? "" : `<button class="mm-pill-btn mm-panel-toggle ${item.aiChecks ? "has-ai" : ""}"type="button"data-panel="ai"aria-expanded="false">AI details<span>${escapeHtml(String(item.aiChecks))}</span><span class="mm-toggle-chevron"aria-hidden="true">▾</span></button>`}
            <button class="mm-icon-btn mm-del" data-loc="${escapeHtml(item.loc)}" title="Delete this concept record">${mmSvg("delete", 17)}<span>Delete</span></button>
            <div class="mm-history-menu" data-history-menu hidden>
              <div class="mm-detail-body" data-lazy-panel="history"></div>
            </div>
          </div>
        </div>

        ${window.__mkExamMode ? "" : `<div class="mm-expand-row ${item.aiChecks ? "has-ai" : ""}"data-panel-body="ai"hidden><div class="mm-detail-body"data-lazy-panel="ai"></div></div>`}
      </article>`;}
function renderStatCards(s){const acc=s.attempted?`${Math.round((s.correct / s.attempted) * 100)}%`:"-";return`
      <div class="mm-stat-grid">
        <div class="mm-stat-card"><span>Total concepts</span><strong>${escapeHtml(String(s.total))}</strong></div>
        <div class="mm-stat-card"><span>Direct ratings</span><strong>${escapeHtml(String(s.direct))}</strong></div>
        ${window.__mkExamMode ? "" : `<div class="mm-stat-card"><span>AI checks</span><strong>${escapeHtml(String(s.aiChecks))}</strong></div><div class="mm-stat-card"><span>Self-reported practice accuracy</span><strong>${escapeHtml(acc)}</strong><small>${escapeHtml(String(s.correct))}/${escapeHtml(String(s.attempted))} answers · not a verified assessment</small></div>`}
        <div class="mm-stat-card mm-status-card"><span>Status</span><strong>${mmIcon(3, 16)}${s.m3} ${mmIcon(2, 16)}${s.m2} ${mmIcon(1, 16)}${s.m1} ${mmIcon(0, 16)}${s.m0}</strong><small>${escapeHtml(String(s.unrated))} not rated</small></div>
      </div>`;}
function ensureManagerStyles(){["mm-manager-style-v5-click-layer","mm-manager-style-v6","mm-manager-style-v7","mm-manager-style-v8-learning-records","mm-manager-style-v9-compact-inline","mm-manager-style-v10-lazy-history-ai","mm-manager-style-v12-mobile-scroll-compact","mm-manager-style-v13-mobile-safe-compact-actions","mm-manager-style-v14-mobile-panel-floor","mm-manager-style-v14-mobile-safe-continuation","mm-manager-style-v15-mobile-doc-surface"].forEach((id)=>{try{const old=document.getElementById(id);if(old&&old.parentNode)old.parentNode.removeChild(old);}catch(_){}});try{const legacyFloor=document.getElementById("mm-mobile-panel-floor");if(legacyFloor&&legacyFloor.parentNode)legacyFloor.parentNode.removeChild(legacyFloor);}catch(_){}
if(document.getElementById(STYLE_ID))return;const style=document.createElement("style");style.id=STYLE_ID;style.textContent=`
      html.mm-modal-open, body.mm-modal-open{ overflow:hidden !important; }
      #mm-modal{
        position:fixed; inset:0; z-index:2147483000; display:none;
        box-sizing:border-box; padding:22px; overflow:hidden;
        background:rgba(12,16,24,.42);
        -webkit-backdrop-filter:blur(10px) saturate(1.04);
        backdrop-filter:blur(10px) saturate(1.04);
        --mm-vh:100vh; --mm-mobile-top-pad:0px; --mm-mobile-bottom-pad:0px;
      }
      #mm-panel{
        position:relative; box-sizing:border-box; display:flex; flex-direction:column;
        width:min(1320px, 100%); height:min(860px, calc(100vh - 44px)); margin:0 auto;
        background:var(--md-default-bg-color,#fff); color:var(--md-default-fg-color,#1f2328);
        border:1px solid rgba(0,0,0,.10); border-radius:24px;
        box-shadow:0 24px 80px rgba(0,0,0,.28); overflow:hidden;
      }
      [data-md-color-scheme="slate"] #mm-panel, body[data-md-color-scheme="slate"] #mm-panel{
        background:var(--md-default-bg-color);
        background:color-mix(in srgb,var(--md-default-bg-color) 90%,var(--md-primary-fg-color) 10%);
        border-color:rgba(255,255,255,.14);
      }
      #mm-close{
        position:absolute; top:14px; right:14px; z-index:20;
        width:40px; height:40px; border-radius:999px; border:1px solid var(--md-default-fg-color--lightest);
        background:var(--md-default-bg-color);
        background:color-mix(in srgb,var(--md-default-bg-color) 86%,var(--md-default-fg-color) 14%);
        color:inherit; font-size:26px; line-height:1; display:flex; align-items:center; justify-content:center;
        cursor:pointer; box-shadow:0 10px 24px rgba(0,0,0,.12);
      }
      #mm-close:hover{ background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 76%,var(--md-default-fg-color) 24%); }
      .mm-header{ flex:0 0 auto; padding:22px 70px 14px 22px; border-bottom:1px solid rgba(100, 116, 139, 0.1);
 border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); }
      .mm-title{ font-size:22px; font-weight:850; line-height:1.15; margin:0; }
      .mm-subtitle{ margin-top:4px; color:var(--md-default-fg-color--light); font-size:13px; line-height:1.45; }
      .mm-stat-grid{ display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:10px; margin-top:16px; }
      .mm-stat-card{ border:1px solid rgba(100, 116, 139, 0.11);
 border:1px solid color-mix(in srgb,var(--md-default-fg-color) 11%,transparent); border-radius:18px; padding:11px 12px; background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 92%,var(--md-primary-fg-color) 8%); min-width:0; }
      .mm-stat-card span{ display:block; color:var(--md-default-fg-color--light); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.03em; }
      .mm-stat-card strong{ display:block; margin-top:4px; font-size:22px; line-height:1.1; font-weight:850; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .mm-stat-card small{ display:block; margin-top:3px; color:var(--md-default-fg-color--light); font-size:12px; }
      .mm-status-card strong{ font-size:17px; display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
      .mm-toolbar{ flex:0 0 auto; display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:14px 22px; border-bottom:1px solid rgba(100, 116, 139, 0.09);
 border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 9%,transparent); }
      .mm-toolbar label{ font-weight:750; color:var(--md-default-fg-color--light); }
      #mm-sort,.mm-select,.mm-filter{ min-height:42px; border-radius:14px; border:1px solid rgba(100, 116, 139, 0.12);
 border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 94%,var(--md-default-fg-color) 6%); color:inherit; padding:7px 12px; font:inherit; box-sizing:border-box; }
      .mm-filter{ flex:1 1 240px; min-width:180px; }
      .mm-toolbar-spacer{ flex:1 1 auto; }
      .mm-btn,.mm-icon-btn{ appearance:none; min-height:40px; border-radius:999px; border:1px solid rgba(100, 116, 139, 0.12);
 border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 94%,var(--md-default-fg-color) 6%); color:inherit; padding:8px 13px; font:inherit; font-weight:750; display:inline-flex; align-items:center; justify-content:center; gap:7px; cursor:pointer; }
      .mm-btn:hover,.mm-icon-btn:hover{ background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 86%,var(--md-default-fg-color) 14%); }
      .mm-icon-btn svg,.mm-svg-icon{ width:17px; height:17px; display:block; color:currentColor !important; stroke:currentColor !important; fill:none !important; }
      .mm-icon-inline{ display:inline-flex; vertical-align:-.16em; align-items:center; justify-content:center; }
      #mm-list{ flex:1 1 auto; overflow:auto; padding:18px 22px 24px; background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 96%,var(--md-default-fg-color) 4%); }
      .mm-card{ position:relative; background:var(--md-default-bg-color,#fff); border:1px solid rgba(100, 116, 139, 0.1);
 border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:18px; padding:9px 11px; box-shadow:0 8px 22px rgba(0,0,0,.04); margin:0 0 9px; }
      .mm-card.is-popover-open{ z-index:40; }
      .mm-card-line{ display:grid; grid-template-columns:minmax(120px,.6fr) minmax(0,1fr) 128px; gap:10px; align-items:center; }
      .mm-card-course{ min-width:0; color:var(--md-default-fg-color--light); font-size:12px; line-height:1.28; }
      .mm-card-course span{ display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .mm-card-course span:first-child{ color:var(--md-default-fg-color); font-weight:750; }
      .mm-card-title{ color:var(--md-primary-fg-color); font-size:17px; line-height:1.2; font-weight:850; text-decoration:none; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .mm-card-title:hover{ text-decoration:underline; }
      .mm-small-label{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
      .mm-level-cell{ min-width:0; width:128px; }
      .mm-level{ width:128px !important; min-width:128px !important; max-width:128px !important; min-height:36px !important; border-radius:13px !important; padding:6px 30px 6px 10px !important; font-size:14px !important; }
      .mm-compact-stats{ display:flex; align-items:center; gap:8px; justify-content:flex-end; white-space:nowrap; color:var(--md-default-fg-color--light); font-size:12px; line-height:1; }
      .mm-compact-metric{ display:inline-flex; align-items:baseline; gap:3px; min-height:0; min-width:0; padding:0; border:0; border-radius:0; background:transparent; box-shadow:none; cursor:default; }
      .mm-compact-metric + .mm-compact-metric::before{ content:"·"; margin-right:8px; color:rgba(100, 116, 139, 0.28);
 color:color-mix(in srgb,var(--md-default-fg-color) 28%,transparent); font-weight:700; }
      .mm-compact-metric strong{ font-weight:850; font-size:14px; line-height:1; color:var(--md-default-fg-color); }
      .mm-compact-metric span{ color:var(--md-default-fg-color--light); font-size:12px; font-weight:650; }
      .mm-inline-actions{ grid-column:1 / -1; position:relative; display:flex; flex-wrap:wrap; align-items:center; justify-content:flex-start; gap:7px; white-space:nowrap; min-width:0; }
      .mm-inline-actions .mm-compact-stats{ flex:0 1 auto; min-width:0; margin-right:2px; }
      .mm-pill-btn{ appearance:none; min-height:36px; border-radius:999px; border:1px solid var(--md-primary-fg-color);
 border:1px solid color-mix(in srgb,var(--md-primary-fg-color) 28%,var(--md-default-fg-color) 12%); background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 90%,var(--md-primary-fg-color) 10%); color:inherit; padding:6px 11px; font:inherit; font-size:14px; font-weight:850; display:inline-flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.045); }
      .mm-pill-btn span:not(.mm-toggle-chevron){ color:var(--md-default-fg-color--light); font-weight:800; }
      .mm-toggle-chevron{ color:var(--md-default-fg-color--light); font-size:12px; line-height:1; transition:transform .16s ease; }
      .mm-pill-btn:hover,.mm-pill-btn.is-open{ border-color:var(--md-primary-fg-color);
 border-color:color-mix(in srgb,var(--md-primary-fg-color) 52%,var(--md-default-fg-color) 10%); background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 82%,var(--md-primary-fg-color) 18%); box-shadow:0 6px 16px rgba(0,0,0,.075); }
      .mm-pill-btn.is-open .mm-toggle-chevron{ transform:rotate(180deg); }
      .mm-pill-btn.has-ai{ border-color:var(--md-primary-fg-color);
 border-color:color-mix(in srgb,var(--md-primary-fg-color) 38%,var(--md-default-fg-color) 10%); }
      .mm-del{ min-height:36px; color:var(--md-default-fg-color);
 color:color-mix(in srgb,var(--md-default-fg-color) 68%,#ef4444 32%); padding:6px 10px; background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 94%,#ef4444 6%); }
      .mm-history-menu{
        position:absolute;
        top:calc(100% + 7px);
        right:0;
        z-index:90;
        width:max-content;
        min-width:min(260px, calc(100vw - 64px));
        max-width:min(340px, calc(100vw - 64px));
        max-height:360px;
        overflow:auto;
        border:1px solid var(--md-primary-fg-color);
        border:1px solid color-mix(in srgb,var(--md-primary-fg-color) 26%,var(--md-default-fg-color) 12%);
        border-radius:16px;
        background:var(--md-default-bg-color,#fff);
        box-shadow:0 18px 42px rgba(0,0,0,.18);
      }
      .mm-history-menu[hidden]{ display:none !important; }
      .mm-history-menu .mm-detail-body{ padding:8px 12px; }
      .mm-history-menu .mm-event-row{ min-width:0; }
      .mm-history-menu .mm-event-meta{ white-space:nowrap; }
      .mm-history-menu::before{
        content:"";
        position:absolute;
        top:-7px;
        right:78px;
        width:12px;
        height:12px;
        transform:rotate(45deg);
        background:var(--md-default-bg-color,#fff);
        border-left:1px solid var(--md-primary-fg-color);
        border-left:1px solid color-mix(in srgb,var(--md-primary-fg-color) 26%,var(--md-default-fg-color) 12%);
        border-top:1px solid var(--md-primary-fg-color);
        border-top:1px solid color-mix(in srgb,var(--md-primary-fg-color) 26%,var(--md-default-fg-color) 12%);
      }
      .mm-expand-row{ margin-top:10px; border:1px solid rgba(100, 116, 139, 0.1);
 border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:16px; background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 96%,var(--md-default-fg-color) 4%); overflow:hidden; }
      .mm-expand-row.has-ai{ border-color:var(--md-primary-fg-color);
 border-color:color-mix(in srgb,var(--md-primary-fg-color) 35%,var(--md-default-fg-color) 8%); }
      .mm-detail-body{ padding:10px 14px 14px; }
      .mm-event-row{ display:flex; gap:9px; align-items:flex-start; padding:9px 0; border-bottom:1px solid rgba(100, 116, 139, 0.08);
 border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); }
      .mm-event-row:last-child{ border-bottom:0; }
      .mm-event-icon{ flex:0 0 auto; margin-top:1px; opacity:.85; }
      .mm-event-title{ font-weight:800; line-height:1.2; }
      .mm-event-meta{ margin-top:2px; font-size:12px; color:var(--md-default-fg-color--light); }
      .mm-session{ border:1px solid rgba(100, 116, 139, 0.1);
 border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:15px; background:var(--md-default-bg-color); margin:0 0 10px; overflow:hidden; }
      .mm-session:last-child{ margin-bottom:0; }
      .mm-session summary{ padding:10px 12px; display:flex; justify-content:space-between; align-items:flex-start; gap:10px; cursor:pointer; font-weight:800; }
      .mm-session-score{ flex:0 0 auto; color:var(--md-default-fg-color--light); font-weight:750; }
      .mm-session-body{ padding:0 12px 12px; }
      .mm-session-pills{ display:flex; flex-wrap:wrap; gap:7px; margin:4px 0 10px; }
      .mm-session-pills span{ border-radius:999px; border:1px solid rgba(100, 116, 139, 0.12);
 border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 90%,var(--md-default-fg-color) 10%); padding:4px 8px; font-size:12px; font-weight:750; }
      .mm-wrong-question{ border-top:1px solid rgba(100, 116, 139, 0.08);
 border-top:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); padding:8px 0; }
      .mm-wrong-question summary{ padding:4px 0; display:flex; justify-content:space-between; gap:10px; cursor:pointer; font-weight:800; }
      .mm-question-text{ margin:7px 0; line-height:1.45; }
      .mm-answer-grid{ display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; }
      .mm-answer-grid > div,.mm-explanation{ border-radius:12px; background:var(--md-default-bg-color);
 background:color-mix(in srgb,var(--md-default-bg-color) 86%,var(--md-default-fg-color) 14%); padding:9px 10px; line-height:1.42; }
      .mm-explanation{ margin-top:8px; }
      .mm-empty,.mm-good-news,.mm-soft{ color:var(--md-default-fg-color--light); }
      .mm-good-news{ font-weight:750; }
      .mm-level-mastered .mm-card-title{ color:#15803d; }
      .mm-level-clear .mm-card-title{ color:#237a3a; }
      .mm-level-fuzzy .mm-card-title{ color:#9a6a00; }
      .mm-level-unknown .mm-card-title{ color:#a12a2a; }
      .mm-level-unrated .mm-card-title{ color:var(--md-primary-fg-color); }
      @media (max-width: 960px){
        #mm-modal{ padding:0; height:var(--mm-vh,100dvh); }
        #mm-panel{ position:absolute; left:12px; right:12px; top:var(--mm-mobile-top-pad,84px); bottom:var(--mm-mobile-bottom-pad,10px); width:auto; height:auto; border-radius:20px; }
        .mm-header{ padding:18px 62px 12px 16px; }
        .mm-stat-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); }
        .mm-toolbar{ padding:12px 16px; }
        #mm-list{ padding:14px 16px 18px; }
        .mm-card-line{ grid-template-columns:1fr; gap:9px; }
        .mm-compact-stats{ justify-content:flex-start; flex-wrap:wrap; }
        .mm-inline-actions{ justify-content:flex-start; flex-wrap:wrap; }
        .mm-answer-grid{ grid-template-columns:1fr; }
      }
      @media (max-width: 540px){
        .mm-stat-grid{ grid-template-columns:1fr; }
        .mm-compact-stats{ align-items:stretch; }
        .mm-compact-metric{ flex:1 1 auto; }
        .mm-toolbar{ align-items:stretch; }
        .mm-toolbar label{ width:100%; }
        .mm-filter,#mm-sort{ width:100%; }
        .mm-toolbar-spacer{ display:none; }
      }

      /* v12 mobile containment and compact layout.  The modal itself scrolls on
         phones, so taps and swipes never fall through to the mastery widget below. */
      #mm-modal, #mm-panel{ pointer-events:auto !important; }
      @media (max-width: 640px), (pointer: coarse){
        html.mm-modal-open, body.mm-modal-open{
          overflow:hidden !important;
          touch-action:none !important;
        }
        #mm-modal{
          position:fixed !important;
          inset:0 !important;
          height:var(--mm-vh, 100dvh) !important;
          min-height:100vh !important;
          padding:10px !important;
          overflow-y:auto !important;
          overflow-x:hidden !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          background:rgba(12,16,24,.48) !important;
        }
        #mm-panel{
          position:relative !important;
          left:auto !important;
          right:auto !important;
          top:auto !important;
          bottom:auto !important;
          width:100% !important;
          height:auto !important;
          min-height:calc(var(--mm-vh, 100dvh) - 22px) !important;
          max-height:none !important;
          margin:0 auto calc(env(safe-area-inset-bottom, 0px) + 18px) !important;
          overflow:visible !important;
          border-radius:18px !important;
        }
        #mm-close{
          top:10px !important;
          right:10px !important;
          width:34px !important;
          height:34px !important;
          font-size:22px !important;
        }
        .mm-header{
          padding:14px 50px 10px 14px !important;
        }
        .mm-title{
          font-size:1.25rem !important;
          line-height:1.12 !important;
        }
        .mm-subtitle{
          display:none !important;
        }
        .mm-stat-grid{
          display:grid !important;
          grid-template-columns:repeat(3,minmax(0,1fr)) !important;
          gap:6px !important;
          margin-top:10px !important;
        }
        .mm-stat-card{
          border-radius:12px !important;
          padding:7px 8px !important;
          min-height:0 !important;
        }
        .mm-stat-card span{
          font-size:8.5px !important;
          line-height:1.05 !important;
          letter-spacing:.02em !important;
        }
        .mm-stat-card strong{
          margin-top:3px !important;
          font-size:17px !important;
          line-height:1.05 !important;
        }
        .mm-stat-card small{
          margin-top:2px !important;
          font-size:10px !important;
          line-height:1.08 !important;
        }
        .mm-stat-card:nth-child(5){
          grid-column:span 2 !important;
        }
        .mm-status-card strong{
          font-size:13px !important;
          gap:4px !important;
        }
        .mm-toolbar{
          position:sticky !important;
          top:0 !important;
          z-index:5 !important;
          padding:9px 12px !important;
          gap:7px !important;
          background:var(--md-default-bg-color,#fff) !important;
        }
        [data-md-color-scheme="slate"] .mm-toolbar,
        body[data-md-color-scheme="slate"] .mm-toolbar{
          background:var(--md-default-bg-color) !important;
          background:color-mix(in srgb,var(--md-default-bg-color) 90%,var(--md-primary-fg-color) 10%) !important;
        }
        .mm-toolbar label{
          width:auto !important;
          font-size:12px !important;
        }
        #mm-sort,.mm-filter{
          min-height:34px !important;
          border-radius:11px !important;
          font-size:12px !important;
          padding:5px 9px !important;
        }
        #mm-sort{ width:8.8rem !important; max-width:42vw !important; }
        .mm-filter{ flex:1 1 120px !important; min-width:0 !important; }
        .mm-btn{
          min-height:32px !important;
          padding:5px 8px !important;
          font-size:12px !important;
        }
        #mm-list{
          overflow:visible !important;
          padding:10px 12px 16px !important;
          background:var(--md-default-bg-color) !important;
          background:color-mix(in srgb,var(--md-default-bg-color) 96%,var(--md-default-fg-color) 4%) !important;
        }
        .mm-card{
          padding:8px 9px !important;
          border-radius:14px !important;
          margin-bottom:8px !important;
        }
        .mm-card-line{
          display:grid !important;
          grid-template-columns:minmax(0,1fr) auto !important;
          gap:6px 8px !important;
          align-items:center !important;
        }
        .mm-card-course{
          grid-column:1 / 2 !important;
          font-size:10.5px !important;
          line-height:1.16 !important;
        }
        .mm-card-title{
          grid-column:1 / 2 !important;
          font-size:13.5px !important;
          line-height:1.16 !important;
        }
        .mm-compact-stats{
          grid-column:1 / -1 !important;
          justify-content:flex-start !important;
          gap:6px !important;
          font-size:10.5px !important;
          flex-wrap:wrap !important;
        }
        .mm-compact-metric strong{ font-size:12px !important; }
        .mm-compact-metric span{ font-size:10.5px !important; }
        .mm-compact-metric + .mm-compact-metric::before{ margin-right:6px !important; }
        .mm-level-cell{
          grid-column:2 / 3 !important;
          grid-row:1 / span 2 !important;
          width:104px !important;
        }
        .mm-level{
          width:104px !important;
          min-width:104px !important;
          max-width:104px !important;
          min-height:32px !important;
          font-size:12px !important;
          padding:4px 24px 4px 8px !important;
          border-radius:11px !important;
        }
        .mm-inline-actions{
          grid-column:1 / -1 !important;
          justify-content:flex-start !important;
          gap:6px !important;
          flex-wrap:wrap !important;
        }
        .mm-pill-btn,.mm-del{
          min-height:31px !important;
          padding:4px 8px !important;
          font-size:12px !important;
          border-radius:999px !important;
        }
        .mm-history-menu{
          left:0 !important;
          right:auto !important;
          width:max-content !important;
          max-width:calc(100vw - 48px) !important;
          min-width:min(220px, calc(100vw - 48px)) !important;
        }
        .mm-history-menu::before{ right:auto !important; left:34px !important; }
        .mm-expand-row{ margin-top:8px !important; border-radius:13px !important; }
      }


      /* v13 mobile: keep browser safe areas visually transparent/blurry like the
         learning-path mobile sheet. Wrap record actions so the history popover
         is not clipped by a horizontal scroll container. */
      @media (max-width: 640px), (pointer: coarse){
        #mm-modal{
          background:transparent !important;
          -webkit-backdrop-filter:none !important;
          backdrop-filter:none !important;
        }
        #mm-modal::before{
          content:"";
          position:fixed;
          left:0;
          right:0;
          top:0;
          bottom:0;
          z-index:0;
          pointer-events:none;
          background:rgba(12,16,24,.38);
          -webkit-backdrop-filter:blur(10px) saturate(1.04);
          backdrop-filter:blur(10px) saturate(1.04);
        }
        #mm-panel{
          position:relative !important;
          z-index:1 !important;
          margin-top:calc(env(safe-area-inset-top, 0px) + 8px) !important;
          margin-bottom:calc(env(safe-area-inset-bottom, 0px) + 18px) !important;
          min-height:calc(var(--mm-vh, 100dvh) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 26px) !important;
        }
        .mm-card-line{
          grid-template-columns:minmax(0,1fr) 102px !important;
          gap:5px 7px !important;
        }
        .mm-card-course{ grid-column:1 / 2 !important; grid-row:1 !important; }
        .mm-card-title{ grid-column:1 / 2 !important; grid-row:2 !important; }
        .mm-level-cell{ grid-column:2 / 3 !important; grid-row:1 / span 2 !important; width:102px !important; justify-self:end !important; }
        .mm-level{ width:102px !important; min-width:102px !important; max-width:102px !important; }
        .mm-inline-actions{
          grid-column:1 / -1 !important;
          grid-row:3 !important;
          display:flex !important;
          align-items:center !important;
          justify-content:flex-start !important;
          flex-wrap:wrap !important;
          gap:4px !important;
          overflow:visible !important;
          padding-bottom:1px !important;
        }
        .mm-inline-actions .mm-compact-stats{
          flex:0 0 auto !important;
          display:flex !important;
          align-items:center !important;
          gap:4px !important;
          margin-right:2px !important;
          white-space:nowrap !important;
        }
        .mm-compact-metric strong{ font-size:11.5px !important; }
        .mm-compact-metric span{ font-size:10px !important; }
        .mm-compact-metric + .mm-compact-metric::before{ margin-right:4px !important; }
        .mm-pill-btn,.mm-del{
          flex:0 0 auto !important;
          min-height:28px !important;
          padding:3px 6px !important;
          font-size:10.8px !important;
          gap:3px !important;
        }
        .mm-pill-btn .mm-toggle-chevron{ font-size:9px !important; }
        .mm-del span{ display:none !important; }
        .mm-del svg{ width:15px !important; height:15px !important; }
        .mm-history-menu{
          left:0 !important;
          right:auto !important;
          top:calc(100% + 6px) !important;
          max-width:calc(100vw - 46px) !important;
        }
      }



      /* v16 mobile: continuous document-layer panel surface.
         Match the sidebar pattern more closely: the modal shell is a document-
         positioned shield, while the panel is a single fixed-height surface with
         its own list scroller.  This avoids the grey/white seam that appeared
         when the whole modal scrolled and the backdrop ended before iOS Safari's
         complete bottom toolbar finished sampling the page. */
      html.mm-modal-open #mw-mastery,
      html.mm-modal-open #mw-mastery *,
      html.mm-modal-open #mw-mastery-compact,
      html.mm-modal-open #mw-mastery-compact *,
      html.mm-modal-open .mw-fly-layer,
      html.mm-modal-open .mw-fly-layer *,
      html.mm-modal-open .mw-title-menu,
      html.mm-modal-open .mw-title-menu *,
      body.mm-modal-open #mw-mastery,
      body.mm-modal-open #mw-mastery *,
      body.mm-modal-open #mw-mastery-compact,
      body.mm-modal-open #mw-mastery-compact *,
      body.mm-modal-open .mw-fly-layer,
      body.mm-modal-open .mw-fly-layer *,
      body.mm-modal-open .mw-title-menu,
      body.mm-modal-open .mw-title-menu *{
        pointer-events:none !important;
      }
      @media (max-width: 640px), (pointer: coarse){
        #mm-modal{
          position:absolute !important;
          inset:auto !important;
          left:var(--mm-doc-left, 0px) !important;
          top:var(--mm-doc-top, 0px) !important;
          width:var(--mm-doc-width, 100vw) !important;
          height:var(--mm-doc-height, var(--mm-vh, 100dvh)) !important;
          min-height:var(--mm-doc-height, var(--mm-vh, 100dvh)) !important;
          max-height:none !important;
          padding:10px !important;
          overflow:hidden !important;
          background:transparent !important;
          -webkit-backdrop-filter:none !important;
          backdrop-filter:none !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          -webkit-transform:translateZ(0) !important;
          transform:translateZ(0) !important;
        }
        #mm-modal::before{
          position:absolute !important;
          inset:0 !important;
          height:100% !important;
          min-height:100% !important;
          background:rgba(12,16,24,.38) !important;
          -webkit-backdrop-filter:blur(10px) saturate(1.04) !important;
          backdrop-filter:blur(10px) saturate(1.04) !important;
        }
        #mm-panel{
          position:relative !important;
          z-index:1 !important;
          display:flex !important;
          flex-direction:column !important;
          width:100% !important;
          height:calc(var(--mm-doc-height, var(--mm-vh, 100dvh)) - env(safe-area-inset-top, 0px) - 18px) !important;
          min-height:calc(var(--mm-doc-height, var(--mm-vh, 100dvh)) - env(safe-area-inset-top, 0px) - 18px) !important;
          max-height:none !important;
          margin-top:calc(env(safe-area-inset-top, 0px) + 8px) !important;
          margin-bottom:0 !important;
          padding-bottom:0 !important;
          overflow:hidden !important;
          background:var(--md-default-bg-color,#fff) !important;
          -webkit-transform:translateZ(0) !important;
          transform:translateZ(0) !important;
          contain:layout paint style !important;
        }
        [data-md-color-scheme="slate"] #mm-panel,
        body[data-md-color-scheme="slate"] #mm-panel{
          background:var(--md-default-bg-color) !important;
          background:color-mix(in srgb,var(--md-default-bg-color) 90%,var(--md-primary-fg-color) 10%) !important;
        }
        #mm-panel.mm-ios-bottom-continued{
          border-bottom-left-radius:0 !important;
          border-bottom-right-radius:0 !important;
        }
        #mm-list{
          flex:1 1 auto !important;
          min-height:0 !important;
          overflow-y:auto !important;
          overflow-x:hidden !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          padding-bottom:calc(var(--mm-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 28px) !important;
          background:var(--md-default-bg-color) !important;
          background:color-mix(in srgb,var(--md-default-bg-color) 96%,var(--md-default-fg-color) 4%) !important;
        }
        [data-md-color-scheme="slate"] #mm-list,
        body[data-md-color-scheme="slate"] #mm-list{
          background:var(--md-default-bg-color) !important;
          background:color-mix(in srgb,var(--md-default-bg-color) 93%,var(--md-primary-fg-color) 7%) !important;
        }
      }

    `;document.head.appendChild(style);}
function setLevelFromManager(loc,value){const all=readAll();const actualKey=Object.keys(all).find((k)=>normComparable(k)===normComparable(loc))||loc;const raw=(all[actualKey]&&typeof all[actualKey]==="object")?all[actualKey]:{};const rec=normaliseRecord(raw);const meta=getMetaForLoc(actualKey,raw,quizSessionsForLoc(actualKey));if(window.ConceptMastery&&typeof window.ConceptMastery.setLevel==="function"){const saved=window.ConceptMastery.setLevel(actualKey,value===""?null:Number(value),meta,{source:"manager",requirePersistence:true});if(!saved)managerWriteFailed();return;}
const timestamps=[Date.now(),raw.updatedAt,raw.lastReviewed,raw.lastViewed,raw.ratingClearedAt].concat((Array.isArray(raw.history)?raw.history:[]).map(historyTs)).map(Number).filter(Number.isFinite);try{if(!window.__mkExamMode&&window.MkAccountData&&typeof window.MkAccountData.readFile==="function"){const file=window.MkAccountData.readFile();for(const event of file&&Array.isArray(file.eventLog)?file.eventLog:[]){if(event&&event.type==="mastery_set"&&normComparable(event.path)===normComparable(actualKey)){for(const time of[Number(event.ts),Number(event.updatedAt)])if(Number.isFinite(time))timestamps.push(time);}}}}catch(_){}
const latest=Math.max(...timestamps),ts=latest+1;if(!Number.isFinite(ts)||ts<=latest){managerWriteFailed();return;}
raw.updatedAt=ts;if(value===""){const viewHistory=(Array.isArray(rec.history)?rec.history:[]).filter((h)=>historyKind(h)==="view");raw.m=null;raw.unrated=true;raw.state="unrated";raw.ratingClearedAt=ts;raw.lastReviewed=0;raw.reviewCount=0;raw.counts={full:0,know:0,fuzzy:0,dont:0};raw.history=viewHistory;}else{raw.m=Number(value);raw.ratingClearedAt=0;delete raw.unrated;if(raw.state==="unrated")delete raw.state;raw.lastReviewed=ts;raw.visited=true;raw.history=Array.isArray(raw.history)?raw.history.slice():[];raw.history.push({kind:"mastery",m:raw.m,ts,source:"manager"});raw.reviewCount=(Number(raw.reviewCount)||0)+1;}
raw.title=meta.title||raw.title||"";raw.course=meta.course||raw.course||"";raw.coursePath=meta.coursePath||raw.coursePath||"";all[actualKey]=raw;try{if(window.MkAccountData&&typeof window.MkAccountData.recordMastery==="function"){const recorded=window.MkAccountData.recordMastery(actualKey,value===""?null:Number(value),{path:actualKey,title:raw.title||meta.title||"",level:value===""?null:Number(value),mastery:value===""?null:Number(value),source:"mastery-manager",ts,changeKind:value===""?"clear":"change"},{source:"mastery-manager",ts,requirePersistence:true,requireExact:true,preserveLegacy:true});if(!recorded||typeof recorded!=="object"||!recorded.id){managerWriteFailed();return;}}}catch(_){managerWriteFailed();return;}
if(!writeAll(all))managerWriteFailed();}
function deleteConceptRecord(loc){const all=readAll();const key=Object.keys(all).find((k)=>normComparable(k)===normComparable(loc));if(key){try{if(window.MkAccountData&&typeof window.MkAccountData.recordMastery==="function"){const record=all[key]||{};const timestamps=[Date.now(),record.updatedAt,record.lastReviewed,record.lastViewed,record.ratingClearedAt].concat((Array.isArray(record.history)?record.history:[]).map(historyTs)).map(Number).filter(Number.isFinite);const latest=Math.max(...timestamps);const ts=latest+1;if(!Number.isFinite(ts)||ts<=latest){managerWriteFailed();return false;}
const recorded=window.MkAccountData.recordMastery(key,null,{path:key,level:null,mastery:null,source:"mastery-manager-delete",changeKind:"clear",xpEligible:false},{source:"mastery-manager-delete",ts,requirePersistence:true,requireExact:true,preserveLegacy:true});if(!recorded||typeof recorded!=="object"||!recorded.id){managerWriteFailed();return false;}}}catch(_){managerWriteFailed();return false;}
delete all[key];}
if(!writeAll(all)){managerWriteFailed();return false;}
return true;}
function rawRecordForLoc(loc){const all=readAll();const key=Object.keys(all||{}).find((k)=>normComparable(k)===normComparable(loc))||loc;return(all&&all[key]&&typeof all[key]==="object")?all[key]:{};}
function closeOpenCardPanels(root,exceptCard){const scope=root||document;scope.querySelectorAll(".mm-card").forEach((card)=>{if(exceptCard&&card===exceptCard)return;card.classList.remove("is-popover-open");card.querySelectorAll(".mm-history-menu").forEach((menu)=>menu.setAttribute("hidden",""));card.querySelectorAll(".mm-expand-row").forEach((row)=>row.setAttribute("hidden",""));card.querySelectorAll(".mm-panel-toggle").forEach((btn)=>{btn.classList.remove("is-open");btn.setAttribute("aria-expanded","false");});});}
function renderHistoryMenu(card){if(!card)return;const loc=card.getAttribute("data-loc")||"";const menu=card.querySelector(".mm-history-menu");const target=menu&&menu.querySelector('[data-lazy-panel="history"]');if(!target)return;if(target.getAttribute("data-rendered")==="1")return;const rec=normaliseRecord(rawRecordForLoc(loc));target.innerHTML=historyRowsHtml(rec);target.setAttribute("data-rendered","1");typesetMathIn(target);}
function mmDetailsState(root){const states=new Map();if(!root)return states;root.querySelectorAll("details").forEach((detail)=>{const path=[];for(let node=detail;node&&root.contains(node);node=node.parentElement&&node.parentElement.closest("details")){const summary=node.querySelector("summary");path.unshift(summary?summary.textContent.trim():"");}
states.set(JSON.stringify(path),detail.open);});return states;}
function mmRestoreDetailsState(root,states){if(!root||!states||!states.size)return;root.querySelectorAll("details").forEach((detail)=>{const path=[];for(let node=detail;node&&root.contains(node);node=node.parentElement&&node.parentElement.closest("details")){const summary=node.querySelector("summary");path.unshift(summary?summary.textContent.trim():"");}
const key=JSON.stringify(path);if(states.has(key))detail.open=states.get(key);});}
function renderAiDetailsPanel(card,savedDetails){if(!card)return;const accountContext=mmAccountContext();if(!mmAccountContextIsCurrent(accountContext))return;const loc=card.getAttribute("data-loc")||"";const row=card.querySelector('[data-panel-body="ai"]');const target=row&&row.querySelector('[data-lazy-panel="ai"]');if(!target)return;if(target.getAttribute("data-rendered")==="1")return;const detailsState=savedDetails||mmDetailsState(target);const sessions=quizSessionsForLoc(loc,readQuizSessions());const draw=()=>{if(!target.isConnected||!mmAccountContextIsCurrent(accountContext))return;const incomplete=sessions.some((session)=>{const key=normComparable(session&&session.concept_id);return key&&!mmAiConcepts.has(key);});target.innerHTML=quizSessionsHtml(loc,sessions)+(incomplete?'<p class="mm-load-retry">Some question details could not load. <button type="button" class="mm-btn" data-mm-retry-ai aria-label="Retry loading question details">Retry</button></p>':'');target.setAttribute("data-rendered",incomplete?"retry":"1");mmRestoreDetailsState(target,detailsState);const retry=target.querySelector("[data-mm-retry-ai]");if(retry)retry.addEventListener("click",(event)=>{event.preventDefault();event.stopPropagation();if(mmAccountContextIsCurrent(accountContext))renderAiDetailsPanel(card);});typesetMathIn(target);};const pending=sessions.some((s)=>!mmAiConcepts.has(normComparable(s&&s.concept_id)));if(sessions.length&&pending){target.innerHTML='<div class="mm-empty">Loading AI check details…</div>';loadAiConceptsForSessions(sessions).then(draw).catch(draw);}else{draw();}}
function mmIsTouchLikeViewport(){try{const mm=window.matchMedia;return!!((mm&&(mm("(max-width: 900px)").matches||mm("(pointer: coarse)").matches||mm("(hover: none)").matches))||(navigator&&navigator.maxTouchPoints>0));}catch(_){return false;}}
function mmPx(n){const x=Number(n);return Number.isFinite(x)?Math.max(0,Math.round(x))+"px":"0px";}
function mmPageScrollXNow(){try{return Math.max(0,Number(window.scrollX)||Number(window.pageXOffset)||Number(document.documentElement&&document.documentElement.scrollLeft)||Number(document.body&&document.body.scrollLeft)||0);}catch(_){return 0;}}
function mmPageScrollYNow(){try{return Math.max(0,Number(window.scrollY)||Number(window.pageYOffset)||Number(document.documentElement&&document.documentElement.scrollTop)||Number(document.body&&document.body.scrollTop)||0);}catch(_){return 0;}}
function mmClamp(value,min,max){return Math.min(max,Math.max(min,value));}
function mmIsIOSWebKitMobile(){try{const ua=String(navigator.userAgent||"");const platform=String(navigator.platform||"");return/iP(?:hone|ad|od)/i.test(ua)||(/Mac/i.test(platform)&&Number(navigator.maxTouchPoints||0)>1);}catch(_){return false;}}
function mmReadSafeAreaBottomInsetPx(){try{let probe=document.getElementById("mm-safe-area-probe");if(!probe){probe=document.createElement("div");probe.id="mm-safe-area-probe";probe.style.cssText="position:fixed;left:0;bottom:0;visibility:hidden;pointer-events:none;height:0;padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom,0px);";(document.body||document.documentElement).appendChild(probe);}
const cs=window.getComputedStyle?window.getComputedStyle(probe):null;return Math.max(0,Math.ceil(parseFloat(cs&&cs.paddingBottom)||0));}catch(_){return 0;}}
function mmIOSCompleteToolbarOcclusionPx(){if(!mmIsTouchLikeViewport()||!mmIsIOSWebKitMobile())return 0;try{const vv=window.visualViewport;const layoutH=Math.max(1,Number(window.innerHeight)||Number(document.documentElement&&document.documentElement.clientHeight)||1);const vvBottom=vv?((Number(vv.offsetTop)||0)+(Number(vv.height)||0)):layoutH;const visualGap=vv?Math.max(0,Math.round(layoutH-vvBottom)):0;let screenH=0;try{screenH=Math.max(Number(window.screen&&window.screen.height)||0,Number(window.screen&&window.screen.width)||0);}catch(_){screenH=0;}
const safe=Math.max(0,mmReadSafeAreaBottomInsetPx());const screenGap=screenH>0?Math.max(0,Math.round(screenH-layoutH-safe)):0;const raw=Math.max(visualGap,screenGap);if(raw<56)return 0;return mmClamp(raw,64,260);}catch(_){return 0;}}
function mmRemoveLegacyMobilePanelFloor(){try{const floor=document.getElementById("mm-mobile-panel-floor");if(floor&&floor.parentNode)floor.parentNode.removeChild(floor);}catch(_){}}
function mmUpdateViewportMetrics(){const modal=document.getElementById("mm-modal");if(!modal||modal.style.display==="none"||!document.documentElement.classList.contains("mm-modal-open"))return;try{const setModalVar=(name,value)=>{if(modal.style.getPropertyValue(name)!==value)modal.style.setProperty(name,value);};const vv=window.visualViewport;const layoutW=Math.max(1,Number(window.innerWidth)||Number(document.documentElement&&document.documentElement.clientWidth)||1);const layoutH=Math.max(1,Number(window.innerHeight)||Number(document.documentElement&&document.documentElement.clientHeight)||1);const vvLeft=vv?(Number(vv.offsetLeft)||0):0;const vvTop=vv?(Number(vv.offsetTop)||0):0;const vvW=vv&&Number(vv.width)?Number(vv.width):layoutW;const vvH=vv&&Number(vv.height)?Number(vv.height):layoutH;const vvBottom=vvTop+vvH;if(vvH>0)setModalVar("--mm-vh",mmPx(vvH));if(!mmIsTouchLikeViewport()){setModalVar("--mm-mobile-top-pad","0px");setModalVar("--mm-mobile-bottom-pad","0px");modal.style.removeProperty("--mm-doc-left");modal.style.removeProperty("--mm-doc-top");modal.style.removeProperty("--mm-doc-width");modal.style.removeProperty("--mm-doc-height");modal.style.removeProperty("--mm-visible-height");modal.style.removeProperty("--mm-ios-hidden-tail");const panel=document.getElementById("mm-panel");if(panel)panel.classList.remove("mm-ios-bottom-continued");return;}
const safeStrip=Math.max(mmReadSafeAreaBottomInsetPx(),vv?Math.max(0,Math.round(layoutH-vvBottom)):0,mmIOSCompleteToolbarOcclusionPx());const visibleBottom=vv?Math.max(0,vvBottom):layoutH;const layoutBottom=Math.max(layoutH,visibleBottom)+Math.max(0,safeStrip);const docLeft=mmPageScrollXNow()+vvLeft;const docTop=mmPageScrollYNow()+vvTop;const docHeight=Math.max(80,Math.ceil(layoutBottom-vvTop));const visibleHeight=Math.max(80,Math.ceil((vv&&vvH)?vvH:layoutH));const hiddenTail=Math.max(0,Math.ceil(docHeight-visibleHeight));setModalVar("--mm-doc-left",mmPx(docLeft));setModalVar("--mm-doc-top",mmPx(docTop));setModalVar("--mm-doc-width",mmPx(vvW||layoutW));setModalVar("--mm-doc-height",mmPx(docHeight));setModalVar("--mm-visible-height",mmPx(visibleHeight));setModalVar("--mm-ios-hidden-tail",mmPx(hiddenTail));setModalVar("--mm-mobile-top-pad","0px");setModalVar("--mm-mobile-bottom-pad","0px");const panel=document.getElementById("mm-panel");if(panel)panel.classList.toggle("mm-ios-bottom-continued",hiddenTail>12||safeStrip>12);}catch(_){}}
function mmBindViewportMetricsOnce(){if(window.__mmViewportMetricsBoundV16)return;window.__mmViewportMetricsBoundV16=true;const update=()=>mmUpdateViewportMetrics();try{window.addEventListener("resize",update,{passive:true});}catch(_){window.addEventListener("resize",update);}
try{window.addEventListener("orientationchange",()=>window.setTimeout(update,80),{passive:true});}catch(_){window.addEventListener("orientationchange",()=>window.setTimeout(update,80));}
try{if(window.visualViewport){window.visualViewport.addEventListener("resize",update,{passive:true});window.visualViewport.addEventListener("scroll",update,{passive:true});}}catch(_){}}
function closeModal(){mmRemoveLegacyMobilePanelFloor();const m=document.getElementById("mm-modal");if(m){m.style.display="none";m.__mmClosedVersion=(m.__mmClosedVersion||0)+1;}
try{document.documentElement.classList.remove("mm-modal-open");}catch(_){}
try{document.body.classList.remove("mm-modal-open");}catch(_){}
const opener=mmReturnFocus;mmReturnFocus=null;if(opener&&opener.isConnected&&opener.getClientRects().length){try{opener.focus({preventScroll:true});}catch(_){opener.focus();}}}
function ensureModal(){mmRemoveLegacyMobilePanelFloor();ensureManagerStyles();mmBindViewportMetricsOnce();const existing=document.getElementById("mm-modal");if(existing){if(existing.getAttribute("data-mm-manager-build")==="v18")return;try{existing.remove();}catch(_){}}
const wrap=document.createElement("div");wrap.id="mm-modal";wrap.setAttribute("data-mm-manager-build","v18");wrap.innerHTML=`
      <div id="mm-panel" role="dialog" aria-modal="true" aria-label="Mastery manager" tabindex="-1">
        <button id="mm-close" type="button" aria-label="Close" title="Close">&times;</button>
        <div class="mm-header">
          <h2 class="mm-title">Mastery manager</h2>
          <div class="mm-subtitle">${window.__mkExamMode ? "Review mastery ratings and page visits stored in this browser." : "Review your mastery ratings, page visits, and AI concept-check sessions."}</div>
          <div id="mm-stat"></div>
        </div>
        <div class="mm-toolbar">
          <label for="mm-sort">Sort</label>
          <select id="mm-sort" class="mm-select">
            <option value="recent">Recent rating</option>
            <option value="mastery">Mastery level</option>
            <option value="views">Views</option>
            ${window.__mkExamMode ? "" : '<option value="ai">AI checks</option>'}
            <option value="direct">Direct ratings</option>
            <option value="title">Title</option>
          </select>
          <input id="mm-filter" class="mm-filter" type="search" aria-label="Filter mastery records" placeholder="Filter by concept, course, lecture, week, or level" />
          <span class="mm-toolbar-spacer"></span>
          <button id="mm-clear" class="mm-btn" type="button">Clear all</button>
        </div>
        <div id="mm-list"></div>
      </div>`;document.body.appendChild(wrap);["touchstart","touchmove","pointerdown","click"].forEach((eventName)=>{try{wrap.addEventListener(eventName,(ev)=>{if(ev&&typeof ev.stopPropagation==="function")ev.stopPropagation();},{capture:false,passive:eventName!=="click"});}catch(_){}});let renderPending=false;let renderedAccountContext=null;wrap.addEventListener("focusout",()=>{if(!renderPending)return;window.setTimeout(()=>{if(renderPending&&typeof mmRender==="function")mmRender();},0);});mmRender=function render(){const force=arguments[0]===true;const modal=document.getElementById("mm-modal");if(!modal||modal.style.display==="none")return;const focused=document.activeElement;const accountContext=mmAccountContext();const viewContext=mmViewContext();const list=document.getElementById("mm-list");const stat=document.getElementById("mm-stat");const clear=document.getElementById("mm-clear");const sameAccount=accountContext!=null&&accountContext===renderedAccountContext;if(!force&&sameAccount&&list&&list.__mmViewContext===viewContext&&focused&&focused.matches&&focused.matches("#mm-list .mm-level")){renderPending=true;return;}
renderPending=false;renderedAccountContext=accountContext;if(clear){clear.disabled=true;clear.__mmViewContext=viewContext;}
if(accountContext==null){if(list)list.innerHTML='<div class="mm-empty" style="padding:16px">Account data is changing. Please wait, then reopen the manager.</div>';if(stat)stat.innerHTML="";return;}
let all,quizStore;try{all=readAll();quizStore=readQuizSessions();}
catch(_){if(stat)stat.innerHTML="";if(list){list.innerHTML='<div class="mm-empty" style="padding:16px" role="alert">Saved learning records could not be read. The stored data has not been changed. Restore access or recover the stored data, then retry. <button id="mm-read-retry" type="button" class="mm-btn">Retry</button></div>';const retry=document.getElementById("mm-read-retry");if(retry)retry.addEventListener("click",()=>{if(mmControlIsCurrent(retry,accountContext,viewContext))mmRender();});}
return;}
if(clear)clear.disabled=false;if(list)list.__mmViewContext=viewContext;const s=globalStats(all,quizStore);const statEl=document.getElementById("mm-stat");if(statEl){const pending=Object.values(all||{}).some(record=>record&&record.localPendingSync===true);statEl.innerHTML=renderStatCards(s)+(pending?'<p class="mm-soft" role="status">Some ratings are saved on this device and waiting to sync.</p>':"");}
let items=buildItems(all,quizStore);items=filterItems(items);items=sortItems(items);if(!list)return;const expanded=list.querySelector('.mm-panel-toggle[aria-expanded="true"]');const expandedCard=expanded&&expanded.closest(".mm-card");const savedPanel=sameAccount&&expandedCard?{loc:expandedCard.getAttribute("data-loc"),panel:expanded.getAttribute("data-panel"),details:mmDetailsState(expandedCard),focused:expanded===focused,}:null;list.innerHTML=items.length?items.map(cardHtml).join(""):`<div class="mm-empty" style="padding:16px">No records match this filter.</div>`;typesetMathIn(list);list.querySelectorAll(".mm-level").forEach((sel)=>{sel.addEventListener("change",()=>{if(!mmControlIsCurrent(sel,accountContext,viewContext)){mmRender();return;}
try{setLevelFromManager(sel.getAttribute("data-loc")||"",sel.value);}catch(_){mmRender(true);return;}
if(typeof mmRender==="function")mmRender();});});list.querySelectorAll(".mm-del").forEach((btn)=>{btn.addEventListener("click",()=>{if(!mmControlIsCurrent(btn,accountContext,viewContext)){mmRender();return;}
const loc=btn.getAttribute("data-loc")||"";if(!confirm(window.__mkExamMode?"Delete this concept mastery record?":"Delete this concept mastery record? AI quiz sessions for this concept will be kept."))return;if(!mmControlIsCurrent(btn,accountContext,viewContext)){mmRender();return;}
try{deleteConceptRecord(loc);}catch(_){mmRender(true);return;}
if(typeof mmRender==="function")mmRender();});});list.querySelectorAll(".mm-panel-toggle").forEach((btn)=>{btn.addEventListener("click",(event)=>{event.preventDefault();event.stopPropagation();if(!mmControlIsCurrent(btn,accountContext,viewContext)){mmRender();return;}
try{readAll();readQuizSessions();}catch(_){mmRender(true);return;}
const card=btn.closest(".mm-card");if(!card)return;const panel=btn.getAttribute("data-panel")||"";if(panel==="history"){const menu=card.querySelector(".mm-history-menu");if(!menu)return;const willOpen=menu.hasAttribute("hidden");closeOpenCardPanels(list,card);card.classList.remove("is-popover-open");card.querySelectorAll(".mm-history-menu").forEach((m)=>m.setAttribute("hidden",""));card.querySelectorAll(".mm-expand-row").forEach((row)=>row.setAttribute("hidden",""));card.querySelectorAll(".mm-panel-toggle").forEach((b)=>{b.classList.remove("is-open");b.setAttribute("aria-expanded","false");});if(willOpen){renderHistoryMenu(card);menu.removeAttribute("hidden");card.classList.add("is-popover-open");btn.classList.add("is-open");btn.setAttribute("aria-expanded","true");}
return;}
if(panel==="ai"){const body=card.querySelector('[data-panel-body="ai"]');if(!body)return;const willOpen=body.hasAttribute("hidden");closeOpenCardPanels(list,card);card.classList.remove("is-popover-open");card.querySelectorAll(".mm-history-menu").forEach((menu)=>menu.setAttribute("hidden",""));card.querySelectorAll(".mm-expand-row").forEach((row)=>row.setAttribute("hidden",""));card.querySelectorAll(".mm-panel-toggle").forEach((b)=>{b.classList.remove("is-open");b.setAttribute("aria-expanded","false");});if(willOpen){body.removeAttribute("hidden");renderAiDetailsPanel(card);btn.classList.add("is-open");btn.setAttribute("aria-expanded","true");}}});});const sortEl=document.getElementById("mm-sort");if(sortEl)sortEl.value=mmSortKey;const filterEl=document.getElementById("mm-filter");if(filterEl&&filterEl.value!==mmSearchQuery)filterEl.value=mmSearchQuery;if(savedPanel){const card=Array.from(list.querySelectorAll(".mm-card")).find((el)=>el.getAttribute("data-loc")===savedPanel.loc);const btn=card&&Array.from(card.querySelectorAll(".mm-panel-toggle")).find((el)=>el.getAttribute("data-panel")===savedPanel.panel);if(btn){btn.classList.add("is-open");btn.setAttribute("aria-expanded","true");if(savedPanel.panel==="history"){renderHistoryMenu(card);card.querySelector(".mm-history-menu").removeAttribute("hidden");card.classList.add("is-popover-open");}else if(savedPanel.panel==="ai"){card.querySelector('[data-panel-body="ai"]').removeAttribute("hidden");renderAiDetailsPanel(card,savedPanel.details);}
if(savedPanel.focused)btn.focus({preventScroll:true});}}};wrap.addEventListener("click",(e)=>{if(!wrap.isConnected||document.getElementById("mm-modal")!==wrap)return;const panel=document.getElementById("mm-panel");if(e.target===wrap||(panel&&e.target&&!panel.contains(e.target))){e.preventDefault();closeModal();return;}
if(panel&&e.target&&panel.contains(e.target)&&!e.target.closest(".mm-inline-actions")&&!e.target.closest(".mm-expand-row")){closeOpenCardPanels(panel,null);}});if(!window.__mmNavigationCloseBound){window.__mmNavigationCloseBound=true;document.addEventListener("DOMContentSwitch",()=>{const modal=document.getElementById("mm-modal");if(modal&&modal.style.display==="block")closeModal();});}
const closeButton=document.getElementById("mm-close");closeButton.addEventListener("click",()=>{if(closeButton.isConnected)closeModal();});document.getElementById("mm-sort").addEventListener("change",(e)=>{const clear=document.getElementById("mm-clear");if(!mmControlIsCurrent(e.target,renderedAccountContext,clear&&clear.__mmViewContext))return;mmSortKey=e.target.value||"recent";if(typeof mmRender==="function")mmRender();});document.getElementById("mm-filter").addEventListener("input",(e)=>{const clear=document.getElementById("mm-clear");if(!mmControlIsCurrent(e.target,renderedAccountContext,clear&&clear.__mmViewContext))return;mmSearchQuery=e.target.value||"";if(typeof mmRender==="function")mmRender();});document.getElementById("mm-clear").addEventListener("click",((clear)=>()=>{const accountContext=renderedAccountContext;const viewContext=clear&&clear.__mmViewContext;if(!clear||clear.disabled||!mmControlIsCurrent(clear,accountContext,viewContext)){mmRender();return;}
try{readAll();readQuizSessions();}catch(_){mmRender(true);return;}
if(!confirm(window.__mkExamMode?"Clear all mastery records stored in this browser?":"Clear all mastery records and AI quiz sessions stored in this browser?"))return;if(!mmControlIsCurrent(clear,accountContext,viewContext)){mmRender();return;}
try{readAll();readQuizSessions();}catch(_){mmRender(true);return;}
try{if(!window.__mkExamMode&&window.MkAccountData&&typeof window.MkAccountData.clearMasteryAndQuiz==="function"){const cleared=window.MkAccountData.clearMasteryAndQuiz();if(!cleared||cleared.ok!==true){managerWriteFailed();return;}}}catch(_){managerWriteFailed();return;}
if(!mmAccountContextIsCurrent(accountContext)){mmRender();return;}
if(!writeAll({})){managerWriteFailed();return;}
try{localStorage.removeItem(LS_KEY);if(!window.__mkExamMode){localStorage.removeItem(AIQ_KEY);if(localStorage.getItem(AIQ_KEY)!=null)throw new Error("Quiz clearing was not saved");}}catch(_){managerWriteFailed();return;}
try{window.dispatchEvent(new CustomEvent("conceptMasteryChanged",{detail:{source:"mastery-manager-clear"}}));}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-ai-quiz-sessions-changed",{detail:{source:"mastery-manager-clear"}}));}catch(_){}
if(typeof mmRender==="function")mmRender();})(document.getElementById("mm-clear")));document.addEventListener("keydown",(e)=>{if(e.isComposing||e.keyCode===229)return;const modal=document.getElementById("mm-modal");if(!modal||modal.style.display!=="block")return;if(e.key==="Escape"){e.preventDefault();closeModal();}else if(e.key==="Tab"){const panel=document.getElementById("mm-panel");const controls=Array.from(panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((el)=>el.getClientRects().length&&window.getComputedStyle(el).visibility!=="hidden");const first=controls[0]||panel;const last=controls[controls.length-1]||panel;if(!panel.contains(document.activeElement)||(e.shiftKey?document.activeElement===first:document.activeElement===last)){e.preventDefault();(e.shiftKey?last:first).focus();}}},true);if(!window.__mmCloudStorageEventsBoundV2){window.__mmCloudStorageEventsBoundV2=true;const refreshOpenManager=()=>{const modal=document.getElementById("mm-modal");if(!modal||modal.style.display!=="block")return;if(typeof mmRender==="function")mmRender();};window.addEventListener("conceptMasteryChanged",refreshOpenManager);window.addEventListener("mk-ai-quiz-sessions-changed",refreshOpenManager);window.addEventListener("mk-local-activity-change",refreshOpenManager);window.addEventListener("mk-account-workspace-changed",()=>{refreshOpenManager();window.setTimeout(refreshOpenManager,0);});window.addEventListener("mk-account-login-change",refreshOpenManager);window.addEventListener("storage",(event)=>{if(!event||event.key==null||[LS_KEY,AIQ_KEY,"mk_account_workspace_active_owner_v1","mk_comment_profile_v1","mk_hot_visitor_id_v1"].includes(event.key))refreshOpenManager();});}
mmRender();}
function syncFromCloudOnOpen(attempt){try{const api=window.MkLocalActivity;const n=Number(attempt||0);if(!api){if(n<12)window.setTimeout(()=>syncFromCloudOnOpen(n+1),250);return;}
const profile=typeof api.getProfile==="function"?api.getProfile():null;if(!profile||!(profile.accountKey||profile.name))return;const rerender=()=>{if(typeof mmRender==="function")mmRender();};if(window.MkAccountData&&typeof window.MkAccountData.refreshCloudStatus==="function"){const p=window.MkAccountData.refreshCloudStatus({reason:"mastery-manager-open-metadata",timeoutMs:30000,writeDisplaySummary:false,lightStatus:true,cloudCountOnly:true});if(p&&typeof p.then==="function")p.then(rerender).catch(()=>{});}}catch(_){}}
function open(){mmRemoveLegacyMobilePanelFloor();const existing=document.getElementById("mm-modal");if(!existing||existing.style.display!=="block")mmReturnFocus=document.activeElement;ensureModal();const m=document.getElementById("mm-modal");if(!m)return;m.style.display="block";try{document.documentElement.classList.add("mm-modal-open");}catch(_){}
try{document.body.classList.add("mm-modal-open");}catch(_){}
mmUpdateViewportMetrics();window.setTimeout(mmUpdateViewportMetrics,60);if(typeof mmRender==="function")mmRender();const firstControl=document.getElementById("mm-close");if(firstControl)firstControl.focus({preventScroll:true});loadLectureMapOnce().then(()=>{if(typeof mmRender==="function")mmRender();}).catch(()=>{});window.setTimeout(syncFromCloudOnOpen,80);}
window.MasteryManager={open};})();