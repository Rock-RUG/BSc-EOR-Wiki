(function(){"use strict";const CONFIG=Object.assign({bankUrl:"assets/ai-mcq-bank.json",indexUrl:"assets/ai-mcq-index.json",sessionStorageKey:"concept_quiz_sessions_v1",buttonText:"AI concept check",source:"ai-mcq",questionsPerSession:3,reportEndpoint:"",reportAdminEndpoint:"",reportStorageKey:"ai_mqc_problem_reports_v1",reportAdminTokenKey:"ai_mqc_report_admin_token_v1",reportAdminParam:"aiq_report_admin",reportButtonText:"Report",reportSentText:"Question flagged. Thank you.",hotApiBase:"",},window.AIMCQ_CONFIG||{});const LEVELS={0:{label:"Unknown",className:"aiq-level-dont"},1:{label:"Unclear",className:"aiq-level-fuzzy"},2:{label:"Clear",className:"aiq-level-know"},3:{label:"Mastered",className:"aiq-level-mastered"},};const DIFFICULTY_TIME_LIMITS={basic:15,standard:25,challenge:35};const QUIZ_COOLDOWN_MS=7*24*60*60*1000;function aiqIsExamMode(){return window.__mkExamMode===true;}
function aiqUrlAllowedInExam(url){if(!aiqIsExamMode())return true;try{return new URL(String(url||""),window.location.href).origin===window.location.origin;}catch(_){return false;}}
function aiqFetchQuizAsset(url){if(!aiqUrlAllowedInExam(url)){return Promise.reject(new Error("Exam mode blocked a cross-origin quiz asset."));}
return fetch(url,{credentials:"same-origin"});}
const state={bank:null,bankByConcept:null,bankPromise:null,index:null,indexConcepts:null,indexPromise:null,available:false,availabilityKnown:false,conceptId:"",conceptData:null,modal:null,panel:null,currentSession:null,currentQuestion:null,currentDifficulty:"basic",currentQuestionStartedAt:0,questionTimerId:0,questionDeadline:0,timerDisabled:false,focusReturn:null,selectedOption:null,answerSubmitted:false,lastAnswerCorrect:null,completed:false,resultMasterySaved:false,resultXpRecorded:false,pendingMasteryLevel:null,quizOptions:null,initialManualLevel:null,currentQuestionReportBusy:false,openingQuiz:false,openingContext:null,loadFailureContext:null,sessionContext:null,sessionSaved:false,masterySaveAttempt:null,};function aiqAccountOwner(){if(aiqIsExamMode())return"exam-local";try{const profile=JSON.parse(localStorage.getItem("mk_comment_profile_v1")||"{}");const key=String(profile&&(profile.accountKey||profile.account_key||profile.nameKey||profile.name_key)||"").replace(/^user:/i,"").trim().toLowerCase();const profileOwner=key?`account:${key}`:"guest";const workspaces=window.MkAccountWorkspaces;const owner=workspaces&&typeof workspaces.activeOwner==="function"?String(workspaces.activeOwner()):localStorage.getItem("mk_account_workspace_active_owner_v1")||profileOwner;return owner===profileOwner?owner:"";}catch(_){return"";}}
function aiqCaptureContext(){let visitor="";try{if(!aiqIsExamMode())visitor=localStorage.getItem("mk_hot_visitor_id_v1")||"";}catch(_){}
return{path:currentRelPath(),owner:aiqAccountOwner(),exam:aiqIsExamMode(),visitor};}
function aiqContextIsCurrent(context){const current=aiqCaptureContext();return!!context&&!!context.owner&&(!window.__mkAccountWorkspaceSwitching||aiqIsExamMode())&&context.path===current.path&&context.owner===current.owner&&context.exam===current.exam&&context.visitor===current.visitor;}
function aiqSessionIsCurrent(){if(aiqContextIsCurrent(state.sessionContext||aiqCaptureContext()))return true;closeQuiz();return false;}
function escapeHtml(value){return String(value==null?"":value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function normId(id){return String(id||"").split("#")[0].replace(/^\/+/,"").trim();}
function getSiteRootUrl(){const link=document.querySelector('link[href*="assets/stylesheets"]')||document.querySelector('script[src*="assets/javascripts"]');const href=link?(link.getAttribute("href")||link.getAttribute("src")||""):"";const u=href?new URL(href,document.baseURI):new URL(document.baseURI);const p=u.pathname;const idx=p.indexOf("/assets/");if(idx>=0)return u.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function currentRelPath(){let p=String(window.location.pathname||"");try{const root=new URL(getSiteRootUrl());const rootPath=root.pathname.endsWith("/")?root.pathname:`${root.pathname}/`;if(p.startsWith(rootPath))p=p.slice(rootPath.length);}catch(_){}
return p.replace(/^\/+/,"");}
function aiqLooksConceptPage(){try{const rel=currentRelPath();if(!/\.html?$/i.test(rel))return false;if(/(^|\/)(index|find|random|custom-random|trending|contributors|about|404)\.html?$/i.test(rel))return false;return/(^|\/)Year[-_ ]?\d+\//i.test(rel)||/(^|\/)year[-_ ]?\d+\//i.test(rel);}catch(_){return false;}}
function aiqReleasePreloadHold(token){if(!token)return;try{window.__rkRelease&&window.__rkRelease(token);}catch(_){}}
function aiqHotApiBase(){return String(CONFIG.hotApiBase||(window.MkHotTrack&&window.MkHotTrack.apiBase)||window.MKDOCS_HOT_API_BASE||"https://hot.eor-wiki.workers.dev").replace(/\/+$/g,"");}
function aiqConsumeGuestAction(action,detail){try{if(!window.MkGuestAccess||typeof window.MkGuestAccess.consume!=="function")return true;return window.MkGuestAccess.consume(action,Object.assign({blocking:true},detail||{}));}catch(_){return true;}}
function aiqGetVisitorId(){try{if(window.MkHotTrack&&typeof window.MkHotTrack.getVisitorId==="function")return window.MkHotTrack.getVisitorId();const key="mk_hot_visitor_id_v1";let id=localStorage.getItem(key);if(!id){id="v_"+Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem(key,id);}
return id;}catch(_){return"anon";}}
function aiqReadLocalProfile(){try{if(window.MkLocalActivity&&typeof window.MkLocalActivity.getProfile==="function"){const profile=window.MkLocalActivity.getProfile()||{};return{name:String(profile.name||"").trim(),accountKey:String(profile.accountKey||"").trim()};}}catch(_){}
try{const obj=JSON.parse(localStorage.getItem("mk_comment_profile_v1")||"null")||{};return{name:String(obj.name||localStorage.getItem("mk_comment_name_v1")||"").trim(),accountKey:String(obj.accountKey||"").trim()};}catch(_){return{name:"",accountKey:""};}}
function aiqIsRockAdminUser(){const profile=aiqReadLocalProfile();return String(profile.name||"").trim()==="Rock"||String(profile.accountKey||"").trim().toLowerCase()==="rock";}
function aiqReadAdminToken(){try{const stored=String(localStorage.getItem(CONFIG.reportAdminTokenKey||"ai_mqc_report_admin_token_v1")||localStorage.getItem("mk_hot_admin_token_v1")||localStorage.getItem("mk_hot_admin")||"").trim();if(stored)return stored;const profile=aiqReadLocalProfile();if(String(profile.name||"").trim()==="Rock")return String(profile.accountKey||"Rock").trim()||"Rock";if(String(profile.accountKey||"").trim().toLowerCase()==="rock")return"Rock";return"";}catch(_){return"";}}
function aiqWriteAdminToken(token){const t=String(token||"").trim();try{if(t)localStorage.setItem(CONFIG.reportAdminTokenKey||"ai_mqc_report_admin_token_v1",t);else localStorage.removeItem(CONFIG.reportAdminTokenKey||"ai_mqc_report_admin_token_v1");}catch(_){}}
function aiqPromptAdminToken(message){if(!aiqIsRockAdminUser())return"";return aiqReadAdminToken();}
function aiqAdminAuthPayload(){const profile=aiqReadLocalProfile();return{visitorId:aiqGetVisitorId(),adminUser:"Rock",adminAccountKey:String(profile.accountKey||""),};}
function currentConceptCandidates(){const rel=normId(currentRelPath());const out=[];const push=(x)=>{const v=normId(x);if(v&&!out.includes(v))out.push(v);};push(rel);if(rel.endsWith("/"))push(rel.slice(0,-1)+".html");if(rel.endsWith("/index.html"))push(rel.slice(0,-"/index.html".length)+".html");if(!/\.html?$/i.test(rel)&&!rel.endsWith("/"))push(rel+".html");const canonical=document.querySelector('link[rel="canonical"]');if(canonical&&canonical.href){try{const url=new URL(canonical.href);let cp=url.pathname.replace(/^\/+/,"");const root=new URL(getSiteRootUrl()).pathname.replace(/^\/+/,"");if(root&&cp.startsWith(root))cp=cp.slice(root.length).replace(/^\/+/,"");push(cp);if(cp.endsWith("/"))push(cp.slice(0,-1)+".html");if(cp.endsWith("/index.html"))push(cp.slice(0,-"/index.html".length)+".html");}catch(_){}}
return out;}
function resolveBankUrl(){const raw=String(CONFIG.bankUrl||"assets/ai-mcq-bank.json");try{if(/^https?:\/\//i.test(raw))return raw;return new URL(raw.replace(/^\/+/,""),getSiteRootUrl()).toString();}catch(_){return raw;}}
function resolveShardUrl(conceptId){const dirRaw=(state.index&&state.index.shard_dir)||"assets/ai-mcq";const dir=String(dirRaw).replace(/^\/+/,"").replace(/\/+$/,"");const rel=dir+"/"+String(conceptId||"").split("/").map(encodeURIComponent).join("/")+".json";try{return new URL(rel,getSiteRootUrl()).toString();}catch(_){return rel;}}
function shardCandidates(){const all=currentConceptCandidates();const known=state.indexConcepts;if(known&&known.size){const hits=all.filter((id)=>known.has(normId(id)));if(hits.length)return hits;}
return all;}
function aiqHasUsableQuestions(concept){if(!concept||typeof concept!=="object"||Array.isArray(concept)||!Array.isArray(concept.questions)||!concept.questions.length)return false;const ids=new Set();return concept.questions.every((question)=>{if(!question||typeof question!=="object"||Array.isArray(question))return false;const id=question.id;if((typeof id!=="string"&&typeof id!=="number")||!String(id).trim()||ids.has(String(id)))return false;ids.add(String(id));const options=question.options;const answer=question.correct_index;return typeof question.question==="string"&&!!question.question.trim()&&Array.isArray(options)&&options.length>=2&&options.every((option)=>typeof option==="string"&&!!option.trim())&&(typeof answer==="number"||(typeof answer==="string"&&!!answer.trim()))&&Number.isInteger(Number(answer))&&Number(answer)>=0&&Number(answer)<options.length;});}
async function loadCurrentConceptShard(){if(state.bankByConcept&&findConceptInBank())return true;for(const id of shardCandidates()){let res;try{res=await aiqFetchQuizAsset(resolveShardUrl(id));}catch(_){return false;}
if(!res||!res.ok)continue;let payload;try{payload=await res.json();}catch(_){continue;}
const concept=payload&&payload.concept;if(!aiqHasUsableQuestions(concept))continue;const merged=Object.assign({},state.bankByConcept||{});merged[id]=concept;state.bankByConcept=merged;return true;}
return false;}
async function ensureBankForCurrentConcept(){if(await loadCurrentConceptShard())return;throw new Error("The questions could not be loaded. Please try again.");}
async function loadBank(){if(state.bank)return state.bank;try{if(window.__AIMCQBankData&&window.__AIMCQBankByConcept){state.bank=window.__AIMCQBankData;state.bankByConcept=window.__AIMCQBankByConcept;return state.bank;}}catch(_){}
if(!state.bankPromise){const url=resolveBankUrl();state.bankPromise=(window.__AIMCQBankPromise||aiqFetchQuizAsset(url).then((res)=>{if(!res.ok)throw new Error(`Could not load AI MCQ bank: ${res.status}`);return res.json();})).then((bank)=>{const byConcept=bank&&bank.by_concept&&typeof bank.by_concept==="object"?bank.by_concept:{};state.bank=bank;state.bankByConcept=byConcept;try{window.__AIMCQBankData=bank;window.__AIMCQBankByConcept=byConcept;}catch(_){}
return bank;}).finally(()=>{state.bankPromise=null;});try{window.__AIMCQBankPromise=state.bankPromise;}catch(_){}}
return await state.bankPromise;}
function findConceptInBank(){const byConcept=state.bankByConcept||{};for(const id of currentConceptCandidates()){if(byConcept[id])return{conceptId:id,conceptData:byConcept[id]};}
return null;}
function resolveIndexUrl(){const raw=String(CONFIG.indexUrl||"assets/ai-mcq-index.json");try{if(/^https?:\/\//i.test(raw))return raw;return new URL(raw.replace(/^\/+/,""),getSiteRootUrl()).toString();}catch(_){return raw;}}
async function loadIndex(){if(state.indexConcepts)return state.indexConcepts;try{if(window.__AIMCQIndexConcepts){state.index=window.__AIMCQIndexData||null;state.indexConcepts=window.__AIMCQIndexConcepts;return state.indexConcepts;}}catch(_){}
if(!state.indexPromise){const url=resolveIndexUrl();const pending=(window.__AIMCQIndexPromise||aiqFetchQuizAsset(url).then((res)=>{if(!res.ok)throw new Error(`Could not load AI MCQ index: ${res.status}`);return res.json();})).then((index)=>{if(!index||typeof index!=="object"||Array.isArray(index)||!Array.isArray(index.concepts)||!index.concepts.every((id)=>typeof id==="string"&&!!normId(id))){throw new Error("Invalid AI MCQ availability index");}
const list=index.concepts;const concepts=new Set(list.map((id)=>normId(id)));state.index=index;state.indexConcepts=concepts;try{window.__AIMCQIndexData=index;window.__AIMCQIndexConcepts=concepts;}catch(_){}
return concepts;}).catch((error)=>{try{if(window.__AIMCQIndexPromise===pending)delete window.__AIMCQIndexPromise;}catch(_){}
throw error;}).finally(()=>{if(state.indexPromise===pending)state.indexPromise=null;});state.indexPromise=pending;try{window.__AIMCQIndexPromise=pending;}catch(_){}}
return await state.indexPromise;}
function findConceptInIndex(){const set=state.indexConcepts;if(!set||!set.size)return null;for(const id of currentConceptCandidates()){if(set.has(normId(id)))return{conceptId:id};}
return null;}
function cleanTitleText(s){return String(s||"").replace(/\s*¶\s*$/u,"").replace(/\s+/g," ").trim();}
function pageTitle(){return cleanTitleText((document.querySelector("h1")&&document.querySelector("h1").textContent)||document.title||"");}
function katexLatexFrom(el){if(!el||!el.querySelector)return"";const annotation=el.querySelector('annotation[encoding="application/x-tex"]');if(annotation&&annotation.textContent)return annotation.textContent.trim();return"";}
function mathjaxLatexFrom(el){if(!el||!el.getAttribute)return"";return(el.getAttribute("data-original-tex")||el.getAttribute("data-tex")||el.getAttribute("aria-label")||"").trim();}
function titleWithMathFromElement(el){if(!el)return"";const walk=(node)=>{if(!node)return"";if(node.nodeType===Node.TEXT_NODE)return node.nodeValue||"";if(node.nodeType!==Node.ELEMENT_NODE)return"";const element=node;const tag=(element.tagName||"").toLowerCase();if(tag==="script"||tag==="style")return"";if(element.matches&&element.matches(".headerlink,.toclink,.anchor,.md-clipboard"))return"";if(element.matches&&element.matches(".katex")){const latex=katexLatexFrom(element);return latex?`\\(${latex}\\)`:"";}
if(element.matches&&element.matches("mjx-container")){const latex=mathjaxLatexFrom(element);return latex?`\\(${latex}\\)`:"";}
let out="";element.childNodes.forEach((child)=>{out+=walk(child);});return out;};return cleanTitleText(walk(el));}
function repairKnownMathTitleIssues(title){return cleanTitleText(title).replace(/\b(Big|big)-O{2,}\b/g,(_,prefix)=>`${prefix}-\\(O\\)`).replace(/\b(Little|little)-o{2,}\b/g,(_,prefix)=>`${prefix}-\\(o\\)`).replace(/\b(Big|big)\s+O{2,}\b/g,(_,prefix)=>`${prefix} \\(O\\)`).replace(/\b(Little|little)\s+o{2,}\b/g,(_,prefix)=>`${prefix} \\(o\\)`);}
function hasExplicitMath(title){return/\$[^$]+\$|\\\(.+?\\\)/.test(String(title||""));}
function modalSubtitleTitle(){const conceptTitle=repairKnownMathTitleIssues((state.conceptData&&state.conceptData.title)||"");const h1Title=repairKnownMathTitleIssues(titleWithMathFromElement(document.querySelector("h1")));if(h1Title&&hasExplicitMath(h1Title))return h1Title;if(conceptTitle&&hasExplicitMath(conceptTitle))return conceptTitle;return conceptTitle||h1Title||repairKnownMathTitleIssues(pageTitle());}
function typesetMathIn(el){if(!el)return;try{if(typeof window.__mkRenderDynamicMath==="function"){const out=window.__mkRenderDynamicMath(el);if(out&&typeof out.catch==="function")out.catch(()=>{});return;}
if(typeof window.__mkRenderDynamicMathSoon==="function")window.__mkRenderDynamicMathSoon(el);if(window.MathJax&&typeof window.MathJax.typesetPromise==="function"){window.MathJax.typesetPromise([el]).catch(()=>{});}}catch(_){}}
function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
return a;}
function shuffleQuestionOptions(question){if(!question||!Array.isArray(question.options))return question;const items=question.options.map((text,idx)=>({text,originalIndex:idx}));for(let i=items.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
const newCorrectIndex=items.findIndex((x)=>x.originalIndex===Number(question.correct_index));const srcExpl=Array.isArray(question.option_explanations)?question.option_explanations:null;return Object.assign({},question,{options:items.map((x)=>x.text),correct_index:newCorrectIndex,option_explanations:srcExpl?items.map((x)=>srcExpl[x.originalIndex]||""):srcExpl,});}
function normaliseDifficulty(value){const d=String(value||"").toLowerCase().trim();if(d==="challenge"||d==="standard"||d==="basic")return d;return"basic";}
function difficultyForManualLevel(level){const m=Number(level);if(m===3)return"challenge";if(m===2)return"standard";return"basic";}
function initialDifficultyFromOptions(options){const opts=options&&typeof options==="object"?options:{};if(opts.startDifficulty||opts.initialDifficulty){return normaliseDifficulty(opts.startDifficulty||opts.initialDifficulty);}
if(opts.manualLevel!=null||opts.initialLevel!=null){return difficultyForManualLevel(opts.manualLevel!=null?opts.manualLevel:opts.initialLevel);}
return"basic";}
function nextDifficultyAfter(correct,current){const d=normaliseDifficulty(current);if(d==="challenge")return correct?"challenge":"standard";if(d==="standard")return correct?"challenge":"basic";return correct?"standard":"basic";}
function readSessions(strict){try{const raw=localStorage.getItem(CONFIG.sessionStorageKey);const parsed=raw?JSON.parse(raw):{};if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))throw new Error("Invalid quiz session history");return parsed;}catch(error){if(strict)throw error;return{};}}
function writeSessions(obj){try{const text=JSON.stringify(obj||{});localStorage.setItem(CONFIG.sessionStorageKey,text);return localStorage.getItem(CONFIG.sessionStorageKey)===text;}catch(_){return false;}}
function saveSession(session){if(!session||!session.concept_id||!aiqSessionIsCurrent())return false;let all;try{all=readSessions(true);}catch(_){return false;}
const key=normId(session.concept_id);const arr=Array.isArray(all[key])?all[key].slice():[];const sessionId=String(session.session_id||session.ts||"");const idx=sessionId?arr.findIndex((item)=>item&&String(item.session_id||item.ts||"")===sessionId):-1;if(idx>=0)arr[idx]=Object.assign({},arr[idx],session);else arr.push(session);all[key]=arr.slice(-50);if(!writeSessions(all))return false;try{window.dispatchEvent(new CustomEvent("mk-ai-quiz-sessions-changed",{detail:{source:"ai-mcq-quiz",path:key}}));}catch(_){}
return true;}
function sessionStartedAt(session){return Number(session&&(session.started_at||session.startedAt||session.ts||session.completed_at||session.completedAt||0))||0;}
function latestAttemptSession(conceptId){const key=normId(conceptId||state.conceptId||currentRelPath());if(!key)return null;const all=readSessions();const arr=Array.isArray(all[key])?all[key]:[];return arr.filter((s)=>s&&sessionStartedAt(s)>0).sort((a,b)=>sessionStartedAt(b)-sessionStartedAt(a))[0]||null;}
function cooldownState(conceptId){const latest=latestAttemptSession(conceptId);const startedAt=latest?sessionStartedAt(latest):0;const completedAt=latest?Number(latest.completed_at||latest.completedAt||0)||0:0;const until=startedAt?startedAt+QUIZ_COOLDOWN_MS:0;const remainingMs=Math.max(0,until-Date.now());return{active:remainingMs>0,startedAt,completedAt,until,remainingMs,conceptId:normId(conceptId||state.conceptId||currentRelPath()),};}
function formatCooldown(ms){const minutes=Math.max(1,Math.ceil((Number(ms)||0)/60000));const days=Math.floor(minutes/1440);const hours=Math.floor((minutes%1440)/60);const mins=minutes%60;if(days>0)return`${days}d ${hours}h`;if(hours>0)return`${hours}h ${mins}m`;return`${mins}m`;}
function difficultyLabel(value){const d=normaliseDifficulty(value);if(d==="challenge")return"Challenge";if(d==="standard")return"Standard";return"Basic";}
function timeLimitForDifficulty(value){const d=normaliseDifficulty(value);return Number(DIFFICULTY_TIME_LIMITS[d])||15;}
function clearQuestionTimer(){if(state.questionTimerId){try{window.clearInterval(state.questionTimerId);}catch(_){}}
state.questionTimerId=0;state.questionDeadline=0;}
function updateTimerBadge(){if(!state.panel||!state.questionDeadline||state.answerSubmitted)return;const badge=state.panel.querySelector(".aiq-timer");if(!badge)return;const remaining=Math.max(0,Math.ceil((Number(state.questionDeadline)-Date.now())/1000));badge.textContent=`${remaining}s`;badge.classList.toggle("is-low",remaining<=3);}
function startQuestionTimer(){clearQuestionTimer();const limit=timeLimitForDifficulty(state.currentDifficulty);state.currentQuestionStartedAt=Date.now();if(state.timerDisabled)return;state.questionDeadline=state.currentQuestionStartedAt+limit*1000;updateTimerBadge();const question=state.currentQuestion,session=state.currentSession;state.questionTimerId=window.setInterval(()=>{if(!aiqSessionIsCurrent()||state.currentQuestion!==question||state.currentSession!==session||state.timerDisabled||!state.questionDeadline)return;if(state.answerSubmitted){clearQuestionTimer();return;}
updateTimerBadge();if(Date.now()>=Number(state.questionDeadline||0)){clearQuestionTimer();submitAnswer({timedOut:true});}},250);}
function getMeta(){const concept=state.conceptData||{};const conceptId=state.conceptId||"";return{title:concept.title||pageTitle(),course:concept.course||"",coursePath:concept.course_path||conceptId.split("/").slice(0,-1).join("/"),};}
function writeMastery(level){const cm=window.ConceptMastery;if(!cm)return false;const meta=getMeta();const opts={source:CONFIG.source};try{if(typeof cm.rate==="function"){cm.rate(state.conceptId,level,meta,opts);return true;}
if(typeof cm.setLevel==="function"){cm.setLevel(state.conceptId,level,meta,opts);return true;}
if(typeof cm.set==="function"){cm.set(state.conceptId,level,meta,opts);return true;}}catch(_){}
return false;}
function forceLocalMasteryCommit(level,reason){const m=Math.max(0,Math.min(3,Number(level)));const conceptId=normId(state.conceptId||"");if(!conceptId||![0,1,2,3].includes(m))return false;const now=Date.now();const meta=getMeta();let all={};try{const parsed=JSON.parse(localStorage.getItem("concept_mastery_v1")||"{}");if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))return false;all=parsed;}catch(_){return false;}
const prev=all[conceptId]&&typeof all[conceptId]==="object"?all[conceptId]:{};const oldRaw=prev&&prev.unrated!==true&&String(prev.state||"").toLowerCase()!=="unrated"?Number(prev.m):NaN;const hadRating=[0,1,2,3].includes(oldRaw);const oldM=hadRating?oldRaw:null;const history=Array.isArray(prev.history)?prev.history.slice():[];const src=String(reason||CONFIG.source||"ai-mcq");const hasRecentSame=history.some((item)=>{if(!item||typeof item!=="object")return false;const kind=String(item.kind||item.type||item.event||item.action||"mastery").toLowerCase();const levelNow=Number(item.m!=null?item.m:item.level!=null?item.level:item.mastery);const ts=Number(item.ts||item.time||item.at||item.createdAt||0);return kind!=="view"&&levelNow===m&&Number.isFinite(ts)&&Math.abs(now-ts)<2500;});if(!hasRecentSame){history.push({kind:"mastery",type:"mastery",m,level:m,ts:now,source:src,title:meta.title||prev.title||"",});}
const reviewCount=Math.max(0,Number(prev.reviewCount||prev.reviews||0)||0)+(hasRecentSame?0:1);all[conceptId]=Object.assign({},prev,{m,unrated:false,state:"rated",title:meta.title||prev.title||"",course:meta.course||prev.course||"",coursePath:meta.coursePath||prev.coursePath||"",lastReviewed:now,updatedAt:now,visited:true,ratingSource:src,reviewCount,history:history.slice(-120),});try{localStorage.setItem("concept_mastery_v1",JSON.stringify(all));}catch(_){return false;}
try{window.dispatchEvent(new CustomEvent("conceptMasteryChanged",{detail:{conceptId,path:conceptId,title:meta.title||prev.title||"",source:src,fallback:true,ts:now,level:m,mastery:m,m,oldLevel:oldM,oldMastery:oldM,hadRating,hasRating:true,ratingChanged:!hadRating||oldM!==m,xpEligible:!hadRating||oldM!==m,forceRepeat:!!(hadRating&&oldM!==m),repeatOnly:!!(hadRating&&oldM!==m),changeKind:!hadRating?"create":(oldM!==m?"change":"same")}}));}catch(_){}
return true;}
function aiqSvgIcon(size){const s=Number(size)||18;return`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v4.5L5.5 16a3.6 3.6 0 0 0 3.2 5h6.6a3.6 3.6 0 0 0 3.2-5L14 7.5V3"/><path d="M8 14h8"/><path d="M9.5 17h5"/><path d="M18.5 4.5l.35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35.35-.9z"/></svg>`;}
function aiqReportSvgIcon(size){const s=Number(size)||16;return`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22V15"/></svg>`;}
function aiqReportStorageKey(){return String(CONFIG.reportStorageKey||"ai_mqc_problem_reports_v1");}
function aiqReadJsonLocal(key,fallback){try{const raw=localStorage.getItem(key);if(!raw)return fallback;const parsed=JSON.parse(raw);return parsed==null?fallback:parsed;}catch(_){return fallback;}}
function aiqWriteJsonLocal(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(_){return false;}}
function aiqReadLocalReports(){const arr=aiqReadJsonLocal(aiqReportStorageKey(),[]);return Array.isArray(arr)?arr:[];}
function aiqWriteLocalReports(reports){const arr=Array.isArray(reports)?reports:[];return aiqWriteJsonLocal(aiqReportStorageKey(),arr.slice(-1000));}
function aiqReportId(){return"aiq_report_"+String(Date.now())+"_"+Math.random().toString(16).slice(2);}
function aiqQuestionFingerprint(report){return[report&&report.concept_id,report&&report.question_id,report&&report.page_path].map((x)=>String(x||"")).join("::");}
function aiqSaveLocalReport(report){const reports=aiqReadLocalReports();reports.push(report);return aiqWriteLocalReports(reports)?report:null;}
function aiqUpdateLocalReport(reportId,patch){if(!reportId)return;const reports=aiqReadLocalReports();const idx=reports.findIndex((r)=>r&&r.report_id===reportId);if(idx<0)return;reports[idx]=Object.assign({},reports[idx],patch||{});aiqWriteLocalReports(reports);}
function aiqConfiguredReportEndpoint(kind){if(aiqIsExamMode())return"";const admin=String(CONFIG.reportAdminEndpoint||CONFIG.reportEndpoint||"").trim();const normal=String(CONFIG.reportEndpoint||"").trim();return kind==="admin"?admin:normal;}
function aiqEndpointCandidates(endpoint){const raw=String(endpoint||"").trim();const out=[];const push=(value)=>{const v=String(value||"").trim();if(v&&!out.includes(v))out.push(v);};push(raw);try{const u=new URL(raw,window.location.href);const host=String(u.hostname||"");if(host.endsWith(".")){u.hostname=host.replace(/\.+$/g,"");push(u.toString());}else if(/\.workers\.dev$/i.test(host)){const dotted=new URL(u.toString());dotted.hostname=host+".";push(dotted.toString());}}catch(_){}
return out;}
async function aiqPostJsonText(endpoint,payload){if(aiqIsExamMode())throw new Error("Reporting is unavailable in exam mode.");const res=await fetch(endpoint,{method:"POST",mode:"cors",credentials:"omit",cache:"no-store",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload),});const text=await res.text().catch(()=>"");let json=null;try{json=text?JSON.parse(text):null;}catch(_){json=null;}
if(!res.ok)throw new Error(`Report endpoint returned ${res.status}`);if(json&&json.status&&json.status!=="ok")throw new Error(json.message||"Report endpoint rejected the report");return{ok:true,response:json||text||null,endpoint};}
function aiqBeaconReport(endpoint,payload){if(aiqIsExamMode())return false;try{if(!navigator||typeof navigator.sendBeacon!=="function")return false;const blob=new Blob([JSON.stringify(payload)],{type:"text/plain;charset=utf-8"});return!!navigator.sendBeacon(endpoint,blob);}catch(_){return false;}}
function aiqBuildReportPayload(){const q=state.currentQuestion||{};const session=state.currentSession||{};const meta=getMeta();const selected=state.selectedOption==null?null:Number(state.selectedOption);let colorScheme="";try{colorScheme=document.documentElement.getAttribute("data-md-color-scheme")||(document.body&&document.body.getAttribute("data-md-color-scheme"))||"";}catch(_){}
return{report_id:aiqReportId(),created_at:new Date().toISOString(),kind:"ai-mcq-question-report",reporter_visitor_id:aiqGetVisitorId(),status:"queued",source:CONFIG.source,concept_id:state.conceptId||"",concept_title:(state.conceptData&&state.conceptData.title)||meta.title||pageTitle(),course:meta.course||"",course_path:meta.coursePath||"",page_title:pageTitle(),page_url:String(window.location.href||"").split("#")[0],page_path:currentRelPath(),question_id:q.id||"",difficulty:q.difficulty||"",question_type:q.question_type||"",question:q.question||"",options:Array.isArray(q.options)?q.options.slice():[],correct_index:Number.isFinite(Number(q.correct_index))?Number(q.correct_index):null,explanation:q.explanation||"",answer_state:{submitted:!!state.answerSubmitted,selected_index:selected,selected_option:selected==null||!Array.isArray(q.options)?"":String(q.options[selected]||""),last_answer_correct:state.lastAnswerCorrect==null?null:!!state.lastAnswerCorrect,},session:{started_at:session.ts||null,source:session.source||"",manual_level:session.manual_level==null?null:Number(session.manual_level),initial_difficulty:session.initial_difficulty||"",current_difficulty:state.currentDifficulty||"",question_number:Array.isArray(session.questions)?session.questions.length+(state.answerSubmitted?0:1):1,answered_so_far:Array.isArray(session.questions)?session.questions.slice():[],},technical:{user_agent:String(navigator.userAgent||""),viewport:`${window.innerWidth || 0}x${window.innerHeight || 0}`,color_scheme:colorScheme,language:String(navigator.language||""),},note_required_from_student:false,};}
function aiqEndpointUrl(endpoint,params){const url=new URL(endpoint,window.location.href);Object.entries(params||{}).forEach(([key,value])=>{if(value!=null&&String(value)!=="")url.searchParams.set(key,String(value));});return url.toString();}
function aiqTrackHotActivity(metric,details){if(aiqIsExamMode())return;try{if(window.MkHotTrack&&typeof window.MkHotTrack.trackActivity==="function"){window.MkHotTrack.trackActivity(metric,{details:details||{},throttleMs:0,});}else if(window.MkHotTrack&&typeof window.MkHotTrack.trackEvent==="function"){window.MkHotTrack.trackEvent(metric,{throttleMs:0});}}catch(_){}}
async function aiqPostReport(report){if(aiqIsExamMode())return{ok:false,reason:"exam_mode"};const endpoint=aiqConfiguredReportEndpoint("submit");if(!endpoint)return{ok:false,reason:"not_configured"};const payload={action:"create",report};const candidates=aiqEndpointCandidates(endpoint);let lastErr=null;for(const url of candidates){try{return await aiqPostJsonText(url,payload);}catch(err){lastErr=err;}}
for(const url of candidates){if(aiqBeaconReport(url,payload)){return{ok:true,queued:true,response:{status:"queued_by_beacon"},endpoint:url};}}
throw lastErr||new Error("Report endpoint could not be reached");}
function aiqSetReportNotice(body,message,isError){if(!body)return;const note=body.querySelector(".aiq-report-note");if(!note)return;note.textContent=message||"";note.classList.toggle("is-error",!!isError);}
function aiqSetReportButtonState(btn,stateName,text){if(!btn)return;const icon=aiqReportSvgIcon(15);btn.disabled=stateName==="busy";if(stateName==="busy")btn.setAttribute("aria-disabled","true");else btn.removeAttribute("aria-disabled");btn.classList.toggle("is-sent",stateName==="sent");btn.innerHTML=`${icon}<span>${escapeHtml(text || CONFIG.reportButtonText || "Report")}</span>`;}
async function aiqSendCurrentQuestionReport(btn){if(aiqIsExamMode()){const body=state.panel?state.panel.querySelector(".aiq-body"):null;aiqSetReportButtonState(btn,"busy","Unavailable during exam");aiqSetReportNotice(body,"Question reporting is unavailable during an exam.",false);return;}
if(state.currentQuestionReportBusy)return;if(!state.currentQuestion)return;const reportContext=aiqCaptureContext();const question=state.currentQuestion;const session=state.currentSession;const isCurrentQuestion=()=>aiqContextIsCurrent(reportContext)&&state.currentQuestion===question&&state.currentSession===session&&!!state.modal;state.currentQuestionReportBusy=true;const body=state.panel?state.panel.querySelector(".aiq-body"):null;aiqSetReportButtonState(btn,"busy","Reporting...");aiqSetReportNotice(body,"",false);const report=aiqBuildReportPayload();const recentDuplicate=aiqReadLocalReports().some((r)=>{if(!r||aiqQuestionFingerprint(r)!==aiqQuestionFingerprint(report))return false;const t=Date.parse(r.created_at||"")||0;return Date.now()-t<12*60*60*1000;});if(recentDuplicate){aiqSetReportButtonState(btn,"sent","Already reported");aiqSetReportNotice(body,"This question has already been flagged from this browser.",false);state.currentQuestionReportBusy=false;return;}
const localSaved=!!aiqSaveLocalReport(report);aiqTrackHotActivity("bug_report",{questionId:report.question_id||"",conceptId:report.concept_id||"",pagePath:report.page_path||""});try{const sent=await aiqPostReport(report);if(!aiqContextIsCurrent(reportContext))return;if(sent&&sent.ok){aiqUpdateLocalReport(report.report_id,{status:sent.queued?"queued":"sent",sent_at:new Date().toISOString(),endpoint_used:sent.endpoint||""});if(!isCurrentQuestion())return;aiqSetReportButtonState(btn,"sent","Reported");aiqSetReportNotice(body,sent.queued?"Question flagged and queued for remote submission.":(CONFIG.reportSentText||"Question flagged. Thank you."),false);}else{aiqUpdateLocalReport(report.report_id,{status:"local_only",local_only_reason:sent&&sent.reason||"not_configured"});if(!isCurrentQuestion())return;aiqSetReportButtonState(btn,localSaved?"sent":"idle",localSaved?"Flagged locally":"Retry report");aiqSetReportNotice(body,localSaved?"This report is saved on this device; remote reporting is unavailable.":"This report could not be saved or sent. Free some browser storage and try again.",!localSaved);}}catch(err){if(!aiqContextIsCurrent(reportContext))return;aiqUpdateLocalReport(report.report_id,{status:"send_failed",error:String(err&&err.message||err)});if(!isCurrentQuestion())return;aiqSetReportButtonState(btn,localSaved?"sent":"idle",localSaved?"Flagged locally":"Retry report");aiqSetReportNotice(body,localSaved?"Flag saved on this device. It could not be sent right now.":"This report could not be saved or sent. Free some browser storage and try again.",true);}finally{if(isCurrentQuestion())state.currentQuestionReportBusy=false;}}
function aiqInstallReportButton(body){if(!body)return;const btn=body.querySelector(".aiq-report");if(!btn||btn.dataset.aiqReportBound)return;btn.dataset.aiqReportBound="1";btn.addEventListener("click",(event)=>{event.preventDefault();event.stopPropagation();aiqSendCurrentQuestionReport(btn);});}
function aiqEnsureReportAdminStyles(){if(document.getElementById("aiq-report-admin-style"))return;const st=document.createElement("style");st.id="aiq-report-admin-style";st.textContent=`
      .aiq-report-admin-modal{position:fixed;inset:0;z-index:2147483400;display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;background:rgba(12,16,24,.48);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);}
      .aiq-report-admin-panel{width:min(1180px,100%);height:min(840px,calc(100vh - 36px));max-height:calc(100vh - 36px);overflow:hidden;display:flex;flex-direction:column;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 80%,transparent);background:var(--md-default-bg-color,#fff);color:var(--md-default-fg-color,#1f2328);box-shadow:0 24px 80px rgba(0,0,0,.30);}
      .aiq-report-admin-head{flex:0 0 auto;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:16px 20px 11px;border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 70%,transparent);}
      .aiq-report-admin-title{font-weight:800;font-size:1rem;line-height:1.2;}
      .aiq-report-admin-sub{margin-top:4px;font-size:.72rem;line-height:1.35;color:var(--md-default-fg-color--light);}
      .aiq-report-admin-close{width:34px;height:34px;border-radius:999px;border:1px solid var(--md-default-fg-color--lightest);background:transparent;color:inherit;cursor:pointer;font-size:20px;line-height:1;}
      .aiq-report-admin-toolbar{flex:0 0 auto;display:flex;gap:8px;flex-wrap:wrap;padding:10px 20px;border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 66%,transparent);}
      .aiq-report-admin-btn{appearance:none;border:1px solid var(--md-default-fg-color--lightest);border-radius:999px;background:color-mix(in srgb,var(--md-default-bg-color) 90%,var(--md-default-fg-color) 10%);color:inherit;font:inherit;font-size:.74rem;line-height:1.1;min-height:32px;padding:6px 11px;cursor:pointer;}
      .aiq-report-admin-btn:hover{border-color:color-mix(in srgb,var(--md-primary-fg-color) 55%,var(--md-default-fg-color--lightest));background:color-mix(in srgb,var(--md-default-bg-color) 82%,var(--md-primary-fg-color) 18%);}
      .aiq-report-admin-body{flex:1 1 auto;min-height:0;padding:12px 20px 16px;overflow:hidden;display:flex;flex-direction:column;gap:10px;}
      .aiq-report-admin-status{flex:0 0 auto;font-size:.74rem;line-height:1.35;color:var(--md-default-fg-color--light);}
      .aiq-report-admin-cards{flex:1 1 auto;min-height:0;overflow:hidden;}
      .aiq-report-admin-split{height:100%;min-height:0;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);gap:12px;}
      .aiq-report-admin-section{min-height:0;overflow:hidden;display:flex;flex-direction:column;border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 78%,transparent);border-radius:18px;background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent);}
      .aiq-report-admin-section-head{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 64%,transparent);background:color-mix(in srgb,var(--md-default-bg-color) 92%,var(--md-default-fg-color) 8%);}
      .aiq-report-admin-section-title{font-size:.78rem;font-weight:800;line-height:1.1;}
      .aiq-report-admin-section-count{font-size:.68rem;font-weight:750;line-height:1;border-radius:999px;padding:4px 8px;background:color-mix(in srgb,var(--md-default-bg-color) 78%,var(--md-default-fg-color) 22%);color:var(--md-default-fg-color--light);white-space:nowrap;}
      .aiq-report-admin-section-body{flex:1 1 auto;min-height:0;overflow:auto;display:grid;align-content:start;gap:8px;padding:9px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;}
      .aiq-report-admin-empty{border:1px dashed color-mix(in srgb,var(--md-default-fg-color--lightest) 80%,transparent);border-radius:14px;padding:14px;font-size:.74rem;color:var(--md-default-fg-color--light);background:color-mix(in srgb,var(--md-default-bg-color) 88%,transparent);}
      .aiq-report-admin-card{border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 78%,transparent);border-radius:15px;background:color-mix(in srgb,var(--md-default-bg-color) 95%,var(--md-default-fg-color) 5%);padding:10px;display:grid;gap:7px;box-shadow:0 2px 10px rgba(0,0,0,.035);}
      .aiq-report-admin-card.is-processed{opacity:.86;background:color-mix(in srgb,var(--md-default-bg-color) 97%,var(--md-default-fg-color) 3%);}
      .aiq-report-admin-card-head{display:grid;grid-template-columns:minmax(0,1fr) max-content;gap:10px;align-items:start;}
      .aiq-report-admin-q{font-size:.82rem;line-height:1.32;font-weight:800;overflow-wrap:anywhere;}
      .aiq-report-admin-compact-meta{font-size:.67rem;line-height:1.25;color:var(--md-default-fg-color--light);display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
      .aiq-report-admin-side{display:flex;flex-direction:column;align-items:flex-end;gap:6px;min-width:150px;}
      .aiq-report-admin-time{font-size:.68rem;line-height:1.1;color:var(--md-default-fg-color--light);white-space:nowrap;}
      .aiq-report-admin-link{font-size:.70rem;line-height:1;text-decoration:none!important;white-space:nowrap;}
      .aiq-report-admin-actions{display:flex;gap:6px;align-items:center;justify-content:flex-end;flex-wrap:wrap;}
      .aiq-report-admin-decision{appearance:none;border-radius:999px;border:1px solid var(--md-default-fg-color--lightest);font:inherit;font-size:.68rem;font-weight:800;line-height:1.1;min-height:31px;padding:6px 10px;cursor:pointer;white-space:nowrap;}
      .aiq-report-admin-ignore{background:color-mix(in srgb,var(--md-default-bg-color) 84%,var(--md-default-fg-color) 16%);color:var(--md-default-fg-color--light);}
      .aiq-report-admin-reward{border-color:color-mix(in srgb,#16a34a 50%,var(--md-default-fg-color--lightest));background:color-mix(in srgb,#22c55e 14%,var(--md-default-bg-color));color:color-mix(in srgb,#15803d 84%,var(--md-default-fg-color));}
      .aiq-report-admin-ignore:hover{background:color-mix(in srgb,#ef4444 10%,var(--md-default-bg-color));border-color:color-mix(in srgb,#ef4444 48%,var(--md-default-fg-color--lightest));}
      .aiq-report-admin-reward:hover{background:color-mix(in srgb,#22c55e 22%,var(--md-default-bg-color));border-color:color-mix(in srgb,#16a34a 66%,var(--md-default-fg-color--lightest));}
      .aiq-report-admin-pill{border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 80%,transparent);border-radius:999px;padding:2px 7px;background:color-mix(in srgb,var(--md-default-bg-color) 84%,var(--md-default-fg-color) 16%);white-space:nowrap;}
      .aiq-report-admin-pill.is-status{font-weight:800;}
      .aiq-report-admin-pill.is-processed{background:color-mix(in srgb,#22c55e 13%,var(--md-default-bg-color));border-color:color-mix(in srgb,#16a34a 45%,var(--md-default-fg-color--lightest));color:color-mix(in srgb,#15803d 82%,var(--md-default-fg-color));}
      .aiq-report-admin-options{font-size:.68rem;line-height:1.28;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 8px;}
      .aiq-report-admin-option{overflow-wrap:anywhere;opacity:.88;min-width:0;}
      .aiq-report-admin-option strong{font-weight:800;}
      @media (max-width:900px){.aiq-report-admin-panel{height:calc(100vh - 20px);max-height:calc(100vh - 20px);}.aiq-report-admin-split{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) minmax(0,1fr);}.aiq-report-admin-card-head{grid-template-columns:1fr;}.aiq-report-admin-side{align-items:flex-start;min-width:0;}.aiq-report-admin-options{grid-template-columns:1fr;}}
      @media (max-width:720px){.aiq-report-admin-modal{padding:10px;align-items:flex-end;}.aiq-report-admin-panel{border-radius:20px;}.aiq-report-admin-head,.aiq-report-admin-toolbar,.aiq-report-admin-body{padding-left:14px;padding-right:14px;}.aiq-report-admin-toolbar{gap:6px;}.aiq-report-admin-btn{padding:6px 10px;}.aiq-report-admin-section-body{padding:8px;}.aiq-report-admin-card{padding:9px;}.aiq-report-admin-decision{width:auto;}}
    `;document.head.appendChild(st);}
function aiqFlattenReportForExport(report){const r=report||{};const answer=r.answer_state||{};return{created_at:r.created_at||"",status:r.status||"",concept_id:r.concept_id||"",concept_title:r.concept_title||"",course:r.course||"",question_id:r.question_id||"",difficulty:r.difficulty||"",question_type:r.question_type||"",submitted:answer.submitted==null?"":String(!!answer.submitted),selected_index:answer.selected_index==null?"":String(answer.selected_index),last_answer_correct:answer.last_answer_correct==null?"":String(!!answer.last_answer_correct),question:r.question||"",options:Array.isArray(r.options)?r.options.join(" | "):"",page_url:r.page_url||"",report_id:r.report_id||"",};}
function aiqCsvCell(value){const s=String(value==null?"":value);return/[",\n\r]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;}
function aiqDownloadText(filename,content,mime){try{const blob=new Blob([content],{type:mime||"text/plain;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();window.setTimeout(()=>{try{URL.revokeObjectURL(a.href);a.remove();}catch(_){}},200);}catch(_){}}
function aiqExportReports(reports,type){const arr=Array.isArray(reports)?reports:[];const stamp=new Date().toISOString().slice(0,10);if(type==="csv"){const rows=arr.map(aiqFlattenReportForExport);const headers=Object.keys(rows[0]||aiqFlattenReportForExport({}));const csv=[headers.map(aiqCsvCell).join(",")].concat(rows.map((row)=>headers.map((h)=>aiqCsvCell(row[h])).join(","))).join("\n");aiqDownloadText(`ai-mcq-question-reports-${stamp}.csv`,csv,"text/csv;charset=utf-8");return;}
aiqDownloadText(`ai-mcq-question-reports-${stamp}.json`,JSON.stringify(arr,null,2),"application/json;charset=utf-8");}
function aiqReportPreviewText(value,max){const s=String(value==null?"":value).replace(/\s+/g," ").trim();const n=Math.max(40,Number(max)||180);return s.length>n?s.slice(0,n-1)+"…":s;}
function aiqReportBugFingerprint(report){const r=report||{};const qid=String(r.question_id||r.questionId||"").trim();if(qid)return"aiq:"+qid.toLowerCase().replace(/[^a-z0-9._:-]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"");const composite=[r.concept_id||"",r.page_path||"",r.question||""].join("::");return"aiq:"+composite.toLowerCase().replace(/[^a-z0-9._:-]+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"").slice(0,160);}
function aiqEarliestReportForFingerprint(reports,fingerprint){const arr=Array.isArray(reports)?reports.slice():[];return arr.filter((r)=>aiqReportBugFingerprint(r)===fingerprint).sort((a,b)=>(Date.parse(a&&a.created_at||"")||0)-(Date.parse(b&&b.created_at||"")||0))[0]||null;}
function aiqAdminDecisionStorageKey(){return"ai_mqc_report_admin_decisions_v2";}
function aiqReadAdminDecisions(){try{const raw=localStorage.getItem(aiqAdminDecisionStorageKey());const parsed=raw?JSON.parse(raw):{};return parsed&&typeof parsed==="object"?parsed:{};}catch(_){return{};}}
function aiqWriteAdminDecisions(obj){try{localStorage.setItem(aiqAdminDecisionStorageKey(),JSON.stringify(obj||{}));}catch(_){}}
function aiqReportLocalDecision(report){const id=String(report&&report.report_id||"");const fp=aiqReportBugFingerprint(report||{});const map=aiqReadAdminDecisions();const row=(id&&map[id])||(fp&&map["fp:"+fp]);return row&&typeof row==="object"?row:null;}
function aiqStoreReportLocalDecision(report,payload){const id=String(report&&report.report_id||"");const fp=aiqReportBugFingerprint(report||{});const map=aiqReadAdminDecisions();const base=Object.assign({},(id&&map[id])||(fp&&map["fp:"+fp])||{},payload||{},{reportId:id,fingerprint:fp,updatedAt:Date.now()});if(id)map[id]=base;if(fp)map["fp:"+fp]=base;aiqWriteAdminDecisions(map);}
function aiqNormaliseRemoteStatus(value){return String(value||"").toLowerCase().replace(/[\s_-]+/g,"-").trim();}
function aiqReportProcessedDecision(report){const local=aiqReportLocalDecision(report);if(local&&local.decision)return local;const status=aiqNormaliseRemoteStatus(report&&report.status);if(/^(confirmed|rewarded|ignored|dismissed|rejected|resolved|reviewed|duplicate|duplicate-confirmed)$/.test(status)){return{decision:status,remote:true,updatedAt:Number(report&&(report.status_updated_at||report.statusUpdatedAt||report.reviewed_at||0))||0};}
return null;}
function aiqDecisionLabel(decision){const d=String(decision&&decision.decision||decision||"").toLowerCase();if(d.includes("ignore")||d.includes("dismiss")||d.includes("reject"))return"Ignored";if(d.includes("duplicate"))return"Confirmed · first reporter rewarded";if(d.includes("confirm")||d.includes("reward")||d.includes("review"))return"Confirmed + reward";return"Processed";}
async function aiqSubmitReportDecision(report,decision,btn,allReports){if(aiqIsExamMode()){window.alert("Report administration is unavailable in exam mode.");return null;}
if(!aiqIsRockAdminUser()){window.alert("Only the Rock account can process AI question reports.");return null;}
const token=aiqReadAdminToken();const profile=aiqReadLocalProfile();const r=report||{};const reporterVisitorId=String(r.reporter_visitor_id||r.visitor_id||r.visitorId||"");const fingerprint=aiqReportBugFingerprint(r);const first=aiqEarliestReportForFingerprint(allReports||[],fingerprint)||r;const firstReporterVisitorId=String(first.reporter_visitor_id||first.visitor_id||first.visitorId||reporterVisitorId||"");if(btn)btn.disabled=true;try{const res=await fetch(aiqHotApiBase()+"/admin/report-decision",{method:"POST",mode:"cors",credentials:"omit",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({adminKey:token||String(profile.accountKey||"Rock"),visitorId:aiqGetVisitorId(),adminUser:"Rock",adminAccountKey:String(profile.accountKey||""),kind:"ai_test_bug_report",decision:decision==="confirm"?"confirm":"ignore",reportId:r.report_id||"",fingerprint,reporterVisitorId,firstReporterVisitorId,firstReportId:first.report_id||r.report_id||"",questionId:r.question_id||"",conceptId:r.concept_id||"",conceptTitle:r.concept_title||"",pagePath:r.page_path||"",pageTitle:r.page_title||r.concept_title||"",question:r.question||"",}),});const text=await res.text().catch(()=>"");let json=null;try{json=text?JSON.parse(text):null;}catch(_){json=null;}
if(!res.ok||!json||!json.ok)throw new Error((json&&json.error)||`Hot Worker returned ${res.status}`);const storedDecision=decision==="confirm"?(json.duplicate||json.firstAlreadyRewarded?"duplicate-confirmed":"confirmed"):"ignored";aiqStoreReportLocalDecision(r,{decision:storedDecision,serverDecision:json.decision||"",duplicate:!!(json.duplicate||json.firstAlreadyRewarded),rewardedAccountKey:json.rewardedAccountKey||"",reporterAccountKey:json.reporterAccountKey||"",response:json,});try{r.status=storedDecision;r.status_updated_at=new Date().toISOString();r.reviewed_at=r.status_updated_at;}catch(_){}
if(decision==="confirm"){if(json.voucherSkipped&&!json.rewardedAccountKey)window.alert("Bug confirmed. No reward notification was sent because the first reporter is not connected to an account.");else if(json.duplicate||json.firstAlreadyRewarded)window.alert(json.notificationSkipped?"This bug was confirmed as a duplicate. No reporter notification was sent because this report is not connected to an account.":"This bug was confirmed, but the first reporter had already received or will receive the voucher. This reporter has been notified.");else window.alert(json.notificationSkipped?"Bug confirmed. The report was processed, but no notification was sent because the reporter is not connected to an account.":"Bug confirmed. The first reporter has been sent a reward voucher.");}else{window.alert(json.notificationSkipped?"Report ignored. No notification was sent because the reporter is not connected to an account.":"Report ignored. The reporter has been notified.");}
return json;}catch(err){window.alert("Could not update this report: "+String(err&&err.message||err));return null;}finally{if(btn)btn.disabled=false;}}
function aiqShortDate(value){const raw=String(value||"");const t=Date.parse(raw);if(!Number.isFinite(t)||!t)return raw;try{return new Date(t).toLocaleString(undefined,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});}catch(_){return raw;}}
function aiqReportCardHtml(r,isProcessed){const ans=r.answer_state||{};const opts=Array.isArray(r.options)?r.options:[];const pageUrl=String(r.page_url||"");const submitted=ans.submitted?"submitted":"not submitted";const sent=r.status||"received";const decision=aiqReportProcessedDecision(r);const reportId=escapeHtml(r.report_id||"");const qid=r.question_id||"";const concept=r.concept_title||r.concept_id||"Unknown concept";return`<div class="aiq-report-admin-card${isProcessed ? " is-processed" : ""}" data-aiq-report-card="${reportId}">
      <div class="aiq-report-admin-card-head">
        <div>
          <div class="aiq-report-admin-q">${escapeHtml(aiqReportPreviewText(r.question || "", 180))}</div>
          <div class="aiq-report-admin-compact-meta" style="margin-top:5px">
            <span>${escapeHtml(concept)}</span>
            ${qid ? `<span>qid:${escapeHtml(qid)}</span>` : ""}
            ${ans.selected_index != null ? `<span>selected:${escapeHtml(ans.selected_index)}</span>` : ""}
          </div>
        </div>
        <div class="aiq-report-admin-side">
          <div class="aiq-report-admin-time" title="${escapeHtml(r.created_at || "")}">${escapeHtml(aiqShortDate(r.created_at || ""))}</div>
          ${pageUrl ? `<a class="aiq-report-admin-link"href="${escapeHtml(pageUrl)}"target="_blank"rel="noopener">Open page</a>` : ""}
          ${isProcessed
            ? `<span class="aiq-report-admin-pill is-status is-processed">${escapeHtml(aiqDecisionLabel(decision))}</span>`
            : `<div class="aiq-report-admin-actions"><button type="button"class="aiq-report-admin-decision aiq-report-admin-ignore"data-aiq-decision="ignore"data-aiq-report-id="${reportId}">Ignore</button><button type="button"class="aiq-report-admin-decision aiq-report-admin-reward"data-aiq-decision="confirm"data-aiq-report-id="${reportId}">Confirm+reward</button></div>`}
        </div>
      </div>
      <div class="aiq-report-admin-compact-meta">
        <span class="aiq-report-admin-pill">${escapeHtml(r.difficulty || "unknown difficulty")}</span>
        <span class="aiq-report-admin-pill">${escapeHtml(r.question_type || "unknown type")}</span>
        <span class="aiq-report-admin-pill">${escapeHtml(submitted)}</span>
        ${sent ? `<span class="aiq-report-admin-pill">${escapeHtml(sent)}</span>` : ""}
      </div>
      ${opts.length ? `<div class="aiq-report-admin-options">${opts.map((opt,i)=>`<div class="aiq-report-admin-option"><strong>${String.fromCharCode(65 + i)}.</strong> ${escapeHtml(aiqReportPreviewText(opt, 118))}</div>`).join("")}</div>` : ""}
    </div>`;}
function aiqRenderReportSection(title,reports,isProcessed){const arr=Array.isArray(reports)?reports:[];return`<section class="aiq-report-admin-section ${isProcessed ? "is-processed" : "is-pending"}">
      <div class="aiq-report-admin-section-head">
        <div class="aiq-report-admin-section-title">${escapeHtml(title)}</div>
        <div class="aiq-report-admin-section-count">${arr.length}</div>
      </div>
      <div class="aiq-report-admin-section-body">
        ${arr.length ? arr.map((r) => aiqReportCardHtml(r, isProcessed)).join("") : `<div class="aiq-report-admin-empty">${isProcessed?"No processed reports yet.":"No pending reports."}</div>`}
      </div>
    </section>`;}
function aiqRenderReportCards(host,reports){if(!host)return;const arr=Array.isArray(reports)?reports.slice():[];arr.sort((a,b)=>(Date.parse(b&&b.created_at||"")||0)-(Date.parse(a&&a.created_at||"")||0));if(!arr.length){host.innerHTML=`<div class="aiq-report-admin-status">No reports yet.</div>`;return;}
const pending=arr.filter((r)=>!aiqReportProcessedDecision(r));const processed=arr.filter((r)=>!!aiqReportProcessedDecision(r));processed.sort((a,b)=>{const da=aiqReportProcessedDecision(a)||{};const db=aiqReportProcessedDecision(b)||{};return(Number(db.updatedAt||0)||Date.parse(b&&b.created_at||"")||0)-(Number(da.updatedAt||0)||Date.parse(a&&a.created_at||"")||0);});host.innerHTML=`<div class="aiq-report-admin-split">
      ${aiqRenderReportSection("Pending review", pending, false)}
      ${aiqRenderReportSection("Processed", processed, true)}
    </div>`;host.querySelectorAll("[data-aiq-decision][data-aiq-report-id]").forEach((btn)=>{btn.addEventListener("click",async()=>{const id=btn.getAttribute("data-aiq-report-id")||"";const decision=btn.getAttribute("data-aiq-decision")||"ignore";const report=arr.find((x)=>String(x&&x.report_id||"")===id)||null;if(!report)return;const ok=await aiqSubmitReportDecision(report,decision,btn,arr);if(ok){try{const storedDecision=decision==="confirm"?((ok.duplicate||ok.firstAlreadyRewarded)?"duplicate-confirmed":"confirmed"):"ignored";report.status=storedDecision;report.status_updated_at=new Date().toISOString();report.reviewed_at=report.status_updated_at;}catch(_){}
aiqRenderReportCards(host,arr);}});});typesetMathIn(host);}
async function aiqFetchRemoteReports(token){if(aiqIsExamMode())return{source:"local",reports:aiqReadLocalReports()};const endpoint=aiqConfiguredReportEndpoint("admin");if(!endpoint)return{source:"local",reports:aiqReadLocalReports()};const res=await fetch(aiqEndpointUrl(endpoint,Object.assign({action:"list",key:token||""},aiqAdminAuthPayload())),{method:"GET",mode:"cors",credentials:"omit",cache:"no-store",});const text=await res.text().catch(()=>"");let json=null;try{json=text?JSON.parse(text):null;}catch(_){json=null;}
if(!res.ok)throw new Error(`Report endpoint returned ${res.status}`);if(!json||(json.status&&json.status!=="ok"))throw new Error((json&&json.message)||"Could not load reports");return{source:"remote",reports:Array.isArray(json.reports)?json.reports:[]};}
function aiqOpenReportAdmin(options){if(aiqIsExamMode())return false;const opts=options&&typeof options==="object"?options:{};if(!aiqIsRockAdminUser())return false;aiqEnsureReportAdminStyles();const existing=document.querySelector(".aiq-report-admin-modal");if(existing)existing.remove();const modal=document.createElement("div");modal.className="aiq-report-admin-modal";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");const hasEndpoint=!!aiqConfiguredReportEndpoint("admin");modal.innerHTML=`
      <div class="aiq-report-admin-panel" role="document">
        <div class="aiq-report-admin-head">
          <div>
            <div class="aiq-report-admin-title">AI question reports</div>
            <div class="aiq-report-admin-sub">${hasEndpoint ? "Remote maintainer view for the Rock account." : "Local development view. Configure reportEndpoint to collect reports from students."}</div>
          </div>
          <button type="button" class="aiq-report-admin-close" aria-label="Close">×</button>
        </div>
        <div class="aiq-report-admin-toolbar">
          <button type="button" class="aiq-report-admin-btn" data-action="refresh">Refresh</button>
          <button type="button" class="aiq-report-admin-btn" data-action="json">Export JSON</button>
          <button type="button" class="aiq-report-admin-btn" data-action="csv">Export CSV</button>
          <button type="button" class="aiq-report-admin-btn" data-action="clear-local">Clear local copy</button>
        </div>
        <div class="aiq-report-admin-body">
          <div class="aiq-report-admin-status">Loading reports…</div>
          <div class="aiq-report-admin-cards"></div>
        </div>
      </div>`;document.body.appendChild(modal);let currentReports=[];const status=modal.querySelector(".aiq-report-admin-status");const cards=modal.querySelector(".aiq-report-admin-cards");const close=()=>{try{modal.remove();}catch(_){}};const readToken=()=>aiqReadAdminToken();const writeToken=(token)=>aiqWriteAdminToken(token);const askToken=(message)=>aiqPromptAdminToken(message||"Enter the admin key for AI question reports.");const refresh=async()=>{status.textContent="Loading reports…";try{let token=hasEndpoint?readToken():"";let loaded;try{loaded=await aiqFetchRemoteReports(token);}catch(err1){throw err1;}
currentReports=loaded.reports||[];status.textContent=`${currentReports.length} report${currentReports.length === 1 ? "" : "s"} loaded from ${loaded.source === "remote" ? "remote endpoint" : "this browser"}.`;aiqRenderReportCards(cards,currentReports);}catch(err){currentReports=aiqReadLocalReports();status.textContent=`Could not load remote reports: ${String(err && err.message || err)}. Showing ${currentReports.length} local report${currentReports.length === 1 ? "" : "s"}.`;aiqRenderReportCards(cards,currentReports);}};modal.addEventListener("click",(ev)=>{if(ev.target===modal){close();return;}
const btn=ev.target&&ev.target.closest?ev.target.closest("button[data-action]"):null;if(!btn)return;const action=btn.getAttribute("data-action")||"";if(action==="refresh")refresh();if(action==="json")aiqExportReports(currentReports,"json");if(action==="csv")aiqExportReports(currentReports,"csv");if(action==="clear-local"){if(window.confirm("Clear the local report copy stored in this browser?")){if(aiqWriteLocalReports([]))refresh();else status.textContent="The local report copy could not be cleared. Check browser storage and try again.";}}});modal.querySelector(".aiq-report-admin-close").addEventListener("click",close);const onKey=(ev)=>{if(ev.key==="Escape"){try{document.removeEventListener("keydown",onKey,true);}catch(_){}close();}};document.addEventListener("keydown",onKey,true);refresh();}
function aiqMaybeOpenReportAdminFromUrl(){if(aiqIsExamMode())return;try{const params=new URLSearchParams(window.location.search||"");const key=String(CONFIG.reportAdminParam||"aiq_report_admin");const byQuery=params.get(key)==="1"||params.get(key)==="true";const byHash=/aiq[-_]report[-_]admin/i.test(String(window.location.hash||""));if((byQuery||byHash)&&aiqIsRockAdminUser())window.setTimeout(()=>aiqOpenReportAdmin(),80);}catch(_){}}
function applyMasteryResult(level){const m=Math.max(0,Math.min(3,Number(level)));const meta=getMeta();try{const mw=window.MasteryWidget||window.__MasteryWidget;if(mw&&typeof mw.rateWithAnimation==="function"){const ok=mw.rateWithAnimation(state.conceptId,m,meta,{source:CONFIG.source});if(ok)return true;}}catch(_){}
return writeMastery(m);}
function canApplyMasteryResult(){try{const mw=window.MasteryWidget||window.__MasteryWidget;if(mw&&typeof mw.rateWithAnimation==="function")return true;}catch(_){}
try{const cm=window.ConceptMastery;return!!(cm&&(typeof cm.rate==="function"||typeof cm.setLevel==="function"||typeof cm.set==="function"));}catch(_){return false;}}
function aiqIsTouchLikeViewport(){try{const mm=window.matchMedia;return!!((mm&&(mm("(max-width: 900px)").matches||mm("(pointer: coarse)").matches||mm("(hover: none)").matches))||(navigator&&navigator.maxTouchPoints>0));}catch(_){return false;}}
function aiqPx(n){const x=Number(n);return Number.isFinite(x)?Math.max(0,Math.round(x))+"px":"0px";}
function aiqPageScrollXNow(){try{return Math.max(0,Number(window.scrollX)||Number(window.pageXOffset)||Number(document.documentElement&&document.documentElement.scrollLeft)||Number(document.body&&document.body.scrollLeft)||0);}catch(_){return 0;}}
function aiqPageScrollYNow(){try{return Math.max(0,Number(window.scrollY)||Number(window.pageYOffset)||Number(document.documentElement&&document.documentElement.scrollTop)||Number(document.body&&document.body.scrollTop)||0);}catch(_){return 0;}}
function aiqClamp(value,min,max){return Math.min(max,Math.max(min,value));}
function aiqIsIOSWebKitMobile(){try{const ua=String(navigator.userAgent||"");const platform=String(navigator.platform||"");return/iP(?:hone|ad|od)/i.test(ua)||(/Mac/i.test(platform)&&Number(navigator.maxTouchPoints||0)>1);}catch(_){return false;}}
function aiqReadSafeAreaBottomInsetPx(){try{let probe=document.getElementById("aiq-safe-area-probe");if(!probe){probe=document.createElement("div");probe.id="aiq-safe-area-probe";probe.style.cssText="position:fixed;left:0;bottom:0;visibility:hidden;pointer-events:none;height:0;padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom,0px);";(document.body||document.documentElement).appendChild(probe);}
const cs=window.getComputedStyle?window.getComputedStyle(probe):null;return Math.max(0,Math.ceil(parseFloat(cs&&cs.paddingBottom)||0));}catch(_){return 0;}}
function aiqIOSCompleteToolbarOcclusionPx(){if(!aiqIsTouchLikeViewport()||!aiqIsIOSWebKitMobile())return 0;try{const vv=window.visualViewport;const layoutH=Math.max(1,Number(window.innerHeight)||Number(document.documentElement&&document.documentElement.clientHeight)||1);const vvBottom=vv?((Number(vv.offsetTop)||0)+(Number(vv.height)||0)):layoutH;const visualGap=vv?Math.max(0,Math.round(layoutH-vvBottom)):0;let screenH=0;try{screenH=Math.max(Number(window.screen&&window.screen.height)||0,Number(window.screen&&window.screen.width)||0);}catch(_){screenH=0;}
const safe=Math.max(0,aiqReadSafeAreaBottomInsetPx());const screenGap=screenH>0?Math.max(0,Math.round(screenH-layoutH-safe)):0;const raw=Math.max(visualGap,screenGap);if(raw<56)return 0;return aiqClamp(raw,64,260);}catch(_){return 0;}}
function aiqUpdateViewportMetrics(){const modal=document.getElementById("aiq-modal");if(!modal)return;try{const vv=window.visualViewport;const layoutW=Math.max(1,Number(window.innerWidth)||Number(document.documentElement&&document.documentElement.clientWidth)||1);const layoutH=Math.max(1,Number(window.innerHeight)||Number(document.documentElement&&document.documentElement.clientHeight)||1);const vvLeft=vv?(Number(vv.offsetLeft)||0):0;const vvTop=vv?(Number(vv.offsetTop)||0):0;const vvW=vv&&Number(vv.width)?Number(vv.width):layoutW;const vvH=vv&&Number(vv.height)?Number(vv.height):layoutH;const vvBottom=vvTop+vvH;if(vvH>0)modal.style.setProperty("--aiq-vh",aiqPx(vvH));if(!aiqIsTouchLikeViewport()){modal.style.removeProperty("--aiq-doc-left");modal.style.removeProperty("--aiq-doc-top");modal.style.removeProperty("--aiq-doc-width");modal.style.removeProperty("--aiq-doc-height");modal.style.removeProperty("--aiq-visible-height");modal.style.removeProperty("--aiq-ios-hidden-tail");const panel=document.getElementById("aiq-panel");if(panel)panel.classList.remove("aiq-ios-bottom-continued");return;}
const safeStrip=Math.max(aiqReadSafeAreaBottomInsetPx(),vv?Math.max(0,Math.round(layoutH-vvBottom)):0,aiqIOSCompleteToolbarOcclusionPx());const visibleBottom=vv?Math.max(0,vvBottom):layoutH;const layoutBottom=Math.max(layoutH,visibleBottom)+Math.max(0,safeStrip);const docLeft=aiqPageScrollXNow()+vvLeft;const docTop=aiqPageScrollYNow()+vvTop;const docHeight=Math.max(80,Math.ceil(layoutBottom-vvTop));const visibleHeight=Math.max(80,Math.ceil((vv&&vvH)?vvH:layoutH));const hiddenTail=Math.max(0,Math.ceil(docHeight-visibleHeight));modal.style.setProperty("--aiq-doc-left",aiqPx(docLeft));modal.style.setProperty("--aiq-doc-top",aiqPx(docTop));modal.style.setProperty("--aiq-doc-width",aiqPx(vvW||layoutW));modal.style.setProperty("--aiq-doc-height",aiqPx(docHeight));modal.style.setProperty("--aiq-visible-height",aiqPx(visibleHeight));modal.style.setProperty("--aiq-ios-hidden-tail",aiqPx(hiddenTail));const panel=document.getElementById("aiq-panel");if(panel)panel.classList.toggle("aiq-ios-bottom-continued",hiddenTail>12||safeStrip>12);}catch(_){}}
function aiqBindViewportMetricsOnce(){if(window.__aiqViewportMetricsBoundV2)return;window.__aiqViewportMetricsBoundV2=true;const update=()=>aiqUpdateViewportMetrics();try{window.addEventListener("resize",update,{passive:true});}catch(_){window.addEventListener("resize",update);}
try{window.addEventListener("orientationchange",()=>window.setTimeout(update,80),{passive:true});}catch(_){window.addEventListener("orientationchange",()=>window.setTimeout(update,80));}
try{if(window.visualViewport){window.visualViewport.addEventListener("resize",update,{passive:true});window.visualViewport.addEventListener("scroll",update,{passive:true});}}catch(_){}}
function ensureStyles(){const AIQ_STYLE_ID="aiq-style-v2-mobile-safe-panel";try{const oldStyle=document.getElementById("aiq-style-v1");if(oldStyle&&oldStyle.parentNode)oldStyle.parentNode.removeChild(oldStyle);}catch(_){}
if(document.getElementById(AIQ_STYLE_ID))return;const st=document.createElement("style");st.id=AIQ_STYLE_ID;st.textContent=`
      .aiq-entry-wrap{margin:.45rem 0 .85rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;}
      .aiq-entry-btn,.aiq-btn{appearance:none;border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 88%,transparent);background:color-mix(in srgb,var(--md-default-bg-color) 88%,var(--md-primary-fg-color) 12%);color:var(--md-default-fg-color);border-radius:999px;min-height:34px;padding:6px 12px;font:inherit;font-size:.72rem;line-height:1.15;cursor:pointer;box-shadow:0 8px 18px rgba(0,0,0,.06);}
      .aiq-entry-btn:hover,.aiq-btn:hover{border-color:color-mix(in srgb,var(--md-primary-fg-color) 60%,transparent);background:color-mix(in srgb,var(--md-default-bg-color) 78%,var(--md-primary-fg-color) 22%);}
      .aiq-entry-note{font-size:.68rem;color:var(--md-default-fg-color--light);}
      #mw-mastery .mw-meta.mw-aiq-host{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px;padding-right:264px;min-height:0;opacity:1!important;}
      #mw-mastery .mw-meta.mw-aiq-host:empty{display:none;}
      #mw-mastery .mw-aiq-btn{appearance:none;border:1px solid var(--md-default-fg-color--lightest);background:rgba(255,255,255,.04);color:var(--mw-title-plain-ink,var(--md-default-fg-color));border-radius:999px;padding:6px 10px;display:inline-flex;align-items:center;justify-content:center;gap:6px;line-height:1;font:inherit;font-size:12px;font-weight:400;font-family:var(--md-text-font-family,inherit);box-sizing:border-box;min-height:36px;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(255,255,255,.02);transition:background .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease,transform .18s ease;}
      #mw-mastery .mw-aiq-btn:hover,#mw-mastery .mw-aiq-btn:focus-visible{background:rgba(255,255,255,.08);border-color:color-mix(in srgb,var(--md-primary-fg-color) 48%,var(--md-default-fg-color--lightest));box-shadow:inset 0 0 0 1px rgba(255,255,255,.02),0 8px 18px rgba(0,0,0,.10);}
      #mw-mastery .mw-aiq-btn svg,#mw-mastery .mw-aiq-btn svg *{width:18px;height:18px;display:block;color:currentColor!important;stroke:currentColor!important;fill:none!important;}
      #mw-mastery .mw-aiq-btn-label{font-size:12px;line-height:1;font-weight:400;opacity:.9;color:inherit!important;}
      html[data-md-color-scheme="slate"] #mw-mastery .mw-aiq-btn,body[data-md-color-scheme="slate"] #mw-mastery .mw-aiq-btn{color:rgba(255,255,255,.96)!important;}
      @media (max-width:720px){#mw-mastery .mw-meta.mw-aiq-host{padding-right:44px;margin-top:7px;}#mw-mastery .mw-aiq-btn{min-height:32px;padding:4px 8px;}#mw-mastery .mw-aiq-btn-label{font-size:11px;}#mw-mastery .mw-aiq-btn svg{width:16px!important;height:16px!important;}}
      #aiq-modal{position:fixed;inset:0;z-index:2147483300;background:rgba(12,16,24,.46);-webkit-backdrop-filter:blur(10px) saturate(1.04);backdrop-filter:blur(10px) saturate(1.04);display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;}
      #aiq-panel{width:min(720px,100%);max-height:min(760px,calc(100vh - 36px));overflow:auto;box-sizing:border-box;background:var(--md-default-bg-color);color:var(--md-default-fg-color);border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 80%,transparent);border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.28);}
      .aiq-head{position:sticky;top:0;z-index:1;display:flex;align-items:flex-start;gap:12px;justify-content:space-between;padding:18px 20px 12px;background:color-mix(in srgb,var(--md-default-bg-color) 94%,transparent);border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 70%,transparent);}
      .aiq-title{font-weight:750;font-size:1rem;line-height:1.25;}
      .aiq-subtitle{margin-top:4px;font-size:.72rem;color:var(--md-default-fg-color--light);}
      .aiq-head-actions{flex:0 0 auto;display:flex;align-items:center;gap:8px;}
      .aiq-admin-entry{appearance:none;height:34px;min-width:0;border-radius:999px;border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 80%,transparent);background:color-mix(in srgb,var(--md-default-bg-color) 92%,var(--md-default-fg-color) 8%);color:var(--md-default-fg-color);cursor:pointer;font:inherit;font-size:.68rem;line-height:1;padding:0 10px;white-space:nowrap;}
      .aiq-admin-entry:hover,.aiq-admin-entry:focus-visible{border-color:color-mix(in srgb,var(--md-primary-fg-color) 55%,var(--md-default-fg-color--lightest));background:color-mix(in srgb,var(--md-default-bg-color) 82%,var(--md-primary-fg-color) 18%);}
      .aiq-head-report{appearance:none;height:34px;min-width:0;border-radius:999px;border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 80%,transparent);background:color-mix(in srgb,var(--md-default-bg-color) 92%,var(--md-default-fg-color) 8%);color:var(--md-default-fg-color);cursor:pointer;font:inherit;font-size:.68rem;line-height:1;padding:0 10px;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:6px;}
      .aiq-head-report:hover,.aiq-head-report:focus-visible{border-color:color-mix(in srgb,var(--md-primary-fg-color) 55%,var(--md-default-fg-color--lightest));background:color-mix(in srgb,var(--md-default-bg-color) 82%,var(--md-primary-fg-color) 18%);}
      .aiq-head-report svg,.aiq-head-report svg *{width:15px;height:15px;display:block;color:currentColor!important;stroke:currentColor!important;fill:none!important;}
      .aiq-head-report.is-sent{border-color:color-mix(in srgb,#16a34a 52%,var(--md-default-fg-color--lightest));background:color-mix(in srgb,#22c55e 10%,var(--md-default-bg-color));color:color-mix(in srgb,#16a34a 82%,var(--md-default-fg-color));}
      .aiq-close{flex:0 0 auto;width:34px;height:34px;border-radius:999px;border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 80%,transparent);background:transparent;color:var(--md-default-fg-color);cursor:pointer;font-size:20px;line-height:1;}
      .aiq-body{padding:18px 20px 20px;}
      .aiq-progress{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-bottom:14px;}
      .aiq-pill{display:inline-flex;align-items:center;border-radius:999px;padding:4px 9px;font-size:.68rem;background:color-mix(in srgb,var(--md-default-fg-color) 7%,transparent);color:var(--md-default-fg-color--light);}
      .aiq-question-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:0 0 10px;}
      .aiq-timer-wrap{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:4px 9px;font-size:.68rem;background:color-mix(in srgb,var(--md-primary-fg-color) 10%,transparent);color:var(--md-default-fg-color--light);}
      .aiq-timer{min-width:2.4em;text-align:right;color:var(--md-default-fg-color);font-variant-numeric:tabular-nums;}
      .aiq-timer.is-low{color:#dc2626;}
      .aiq-question{margin:0 0 14px;font-weight:650;font-size:.92rem;line-height:1.45;}
      .aiq-question-index{font-weight:800;color:var(--md-default-fg-color);white-space:nowrap;}
      .aiq-subtitle .katex,.aiq-question .katex,.aiq-option-text .katex,.aiq-feedback .katex,.aiq-result-card .katex{display:inline-block !important;vertical-align:baseline !important;max-width:none !important;overflow:visible !important;line-height:1 !important;}
      .aiq-subtitle .katex-display,.aiq-question .katex-display,.aiq-option-text .katex-display,.aiq-feedback .katex-display{display:inline-block !important;margin:0 .12em !important;text-align:left !important;}
      .aiq-math-inline{display:inline-block;vertical-align:baseline;margin:0 .16em;white-space:nowrap;max-width:none;}
      .aiq-nowrap-group{white-space:nowrap;display:inline;}
      .aiq-options{display:grid;gap:10px;margin:12px 0 16px;}
      .aiq-option{width:100%;text-align:left;display:flex;gap:12px;align-items:center;padding:12px 13px;border-radius:15px;border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 78%,transparent);background:color-mix(in srgb,var(--md-default-bg-color) 94%,var(--md-default-fg-color) 6%);color:var(--md-default-fg-color);cursor:pointer;font:inherit;line-height:1.35;}
      .aiq-option:hover{border-color:color-mix(in srgb,var(--md-primary-fg-color) 52%,transparent);}
      .aiq-option.is-selected{border-color:var(--md-primary-fg-color);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary-fg-color) 18%,transparent);}
      .aiq-option.is-correct{border-color:#15803d;background:color-mix(in srgb,#22c55e 14%,var(--md-default-bg-color));}
      .aiq-option.is-wrong{border-color:#b91c1c;background:color-mix(in srgb,#ef4444 12%,var(--md-default-bg-color));}
      .aiq-letter{flex:0 0 auto;width:34px;height:34px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:1rem;font-weight:800;background:color-mix(in srgb,var(--md-default-fg-color) 10%,transparent);}
      .aiq-option-text{display:block;align-self:center;flex:1 1 auto;font-size:1rem;line-height:1.4;min-width:0;white-space:normal;word-break:normal;overflow-wrap:normal;}
      .aiq-feedback{display:none;margin:12px 0 14px;padding:12px 13px;border-radius:15px;border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 75%,transparent);background:color-mix(in srgb,var(--md-default-fg-color) 6%,transparent);font-size:.86rem;line-height:1.55;word-break:normal;overflow-wrap:normal;}
      .aiq-feedback.is-visible{display:block;}
      .aiq-feedback-main{margin:0;}
      .aiq-feedback-wrong{margin:9px 0 0;padding-top:9px;border-top:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 70%,transparent);color:var(--md-default-fg-color--light);}
      .aiq-actions{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:12px;}
      .aiq-report-note{display:block;margin:-4px 0 10px;font-size:.72rem;line-height:1.35;color:var(--md-default-fg-color--light);text-align:left;}
      .aiq-report-note:empty{display:none;}
      .aiq-report-note.is-error{color:color-mix(in srgb,#dc2626 78%,var(--md-default-fg-color));}
      .aiq-btn.primary{border-color:color-mix(in srgb,var(--md-primary-fg-color) 70%,transparent);background:var(--md-primary-fg-color);color:var(--md-primary-bg-color,white);}
      .aiq-btn[disabled]{opacity:.55;cursor:not-allowed;}
      .aiq-result-card{padding:16px;border-radius:18px;background:color-mix(in srgb,var(--md-default-fg-color) 6%,transparent);border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 75%,transparent);}
      .aiq-result-main{font-size:1.35rem;font-weight:800;margin:4px 0 6px;}
      .aiq-result-copy{font-size:.78rem;line-height:1.5;color:var(--md-default-fg-color--light);}
      html.aiq-modal-open,body.aiq-modal-open{overflow:hidden !important;}
      @media (max-width:720px){#aiq-modal{padding:10px;align-items:flex-end;}#aiq-panel{max-height:calc(100vh - 20px);border-radius:20px 20px 14px 14px;}.aiq-head{padding:15px 15px 10px;}.aiq-body{padding:15px;}.aiq-option{padding:11px 12px;}.aiq-option-text{font-size:.96rem;}}

      /* Mobile safe-area surface, matched to the fixed mastery-manager pattern. */
      html.aiq-modal-open #mw-mastery,
      html.aiq-modal-open #mw-mastery *,
      html.aiq-modal-open #mw-mastery-compact,
      html.aiq-modal-open #mw-mastery-compact *,
      html.aiq-modal-open .mw-fly-layer,
      html.aiq-modal-open .mw-fly-layer *,
      html.aiq-modal-open .mw-title-menu,
      html.aiq-modal-open .mw-title-menu *,
      body.aiq-modal-open #mw-mastery,
      body.aiq-modal-open #mw-mastery *,
      body.aiq-modal-open #mw-mastery-compact,
      body.aiq-modal-open #mw-mastery-compact *,
      body.aiq-modal-open .mw-fly-layer,
      body.aiq-modal-open .mw-fly-layer *,
      body.aiq-modal-open .mw-title-menu,
      body.aiq-modal-open .mw-title-menu *{
        pointer-events:none !important;
      }
      @media (max-width:720px), (pointer:coarse){
        html.aiq-modal-open, body.aiq-modal-open{
          overflow:hidden !important;
          touch-action:none !important;
        }
        #aiq-modal{
          position:absolute !important;
          inset:auto !important;
          left:var(--aiq-doc-left, 0px) !important;
          top:var(--aiq-doc-top, 0px) !important;
          width:var(--aiq-doc-width, 100vw) !important;
          height:var(--aiq-doc-height, var(--aiq-vh, 100dvh)) !important;
          min-height:var(--aiq-doc-height, var(--aiq-vh, 100dvh)) !important;
          max-height:none !important;
          display:flex !important;
          align-items:flex-end !important;
          justify-content:center !important;
          padding:10px 10px calc(var(--aiq-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 10px) !important;
          box-sizing:border-box !important;
          overflow:hidden !important;
          background:transparent !important;
          -webkit-backdrop-filter:none !important;
          backdrop-filter:none !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          -webkit-transform:translateZ(0) !important;
          transform:translateZ(0) !important;
        }
        #aiq-modal::before{
          content:"";
          position:absolute !important;
          inset:0 !important;
          z-index:0;
          pointer-events:none;
          height:100% !important;
          min-height:100% !important;
          background:rgba(12,16,24,.38) !important;
          -webkit-backdrop-filter:blur(10px) saturate(1.04) !important;
          backdrop-filter:blur(10px) saturate(1.04) !important;
        }
        #aiq-panel{
          position:relative !important;
          z-index:1 !important;
          display:flex !important;
          flex-direction:column !important;
          width:100% !important;
          max-width:720px !important;
          height:auto !important;
          min-height:0 !important;
          max-height:calc(var(--aiq-visible-height, var(--aiq-vh, 100dvh)) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 20px) !important;
          margin:0 auto !important;
          overflow:hidden !important;
          border-radius:20px !important;
          background:var(--md-default-bg-color,#fff) !important;
          -webkit-transform:translateZ(0) !important;
          transform:translateZ(0) !important;
          contain:layout paint style !important;
        }
        #aiq-panel.aiq-ios-bottom-continued{
          border-bottom-left-radius:20px !important;
          border-bottom-right-radius:20px !important;
        }
        .aiq-head{
          position:relative !important;
          top:auto !important;
          flex:0 0 auto !important;
          z-index:2 !important;
          padding:15px 15px 10px !important;
        }
        .aiq-body{
          flex:1 1 auto !important;
          min-height:0 !important;
          overflow-y:auto !important;
          overflow-x:hidden !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          padding:15px 15px calc(env(safe-area-inset-bottom, 0px) + 18px) !important;
        }
        .aiq-actions{
          gap:8px !important;
        }
        .aiq-btn{
          min-height:34px !important;
          padding:6px 10px !important;
        }
      }
    `;document.head.appendChild(st);}
function useDisplayStyle(latex){return/\\int|\\sum|\\frac|\\sqrt|\\lim/.test(latex);}
function latexifyCore(expr){let s=String(expr||"").trim();s=s.replace(/\b(dx|dt|du|dv)\b/g,(_,d)=>`\\mathrm{d}${d.slice(1)}`);s=s.replace(/1\s*\/\s*\\sqrt\{([^}]+)\}/g,(_,inner)=>`\\frac{1}{\\sqrt{${inner}}}`);s=s.replace(/1\s*\/\s*([A-Za-z])(\^\{[^}]+\}|\^[A-Za-z0-9+-]+)?/g,(_,base,pow)=>{const expo=pow?(pow.startsWith("^{")?`${base}${pow}`:`${base}^{${pow.slice(1)}}`):base;return`\\frac{1}{${expo}}`;});s=s.replace(/\b(p|x|y|t)\s*>=\s*/g,"$1 \\\\ge ");s=s.replace(/\b(p|x|y|t)\s*<=\s*/g,"$1 \\\\le ");s=s.replace(/\b(p|x|y|t)\s*>\s*/g,"$1 > ");s=s.replace(/\b(p|x|y|t)\s*<\s*/g,"$1 < ");s=s.replace(/\b(p|x|y|t)\s*=\s*/g,"$1 = ");s=s.replace(/\[\s*([^\],]+)\s*,\s*\\infty\s*\)/g,(_,a)=>`[${a}, \\infty)`);return s;}
function wrapMath(latex,noWrap){const core=latexifyCore(latex);const displayPrefix=useDisplayStyle(core)?"\\displaystyle ":"";return`<span class="aiq-math-inline${noWrap ? " aiq-nowrap-group" : ""}">\\(${displayPrefix}${core}\\)</span>`;}
function renderRichText(value){let raw=String(value==null?"":value);const stash=[];const put=(html)=>{const token=`@@AIMATH${stash.length}@@`;stash.push({token,html});return token;};raw=raw.replace(/\$([^$]+)\$/g,(_,body)=>put(wrapMath(body,false)));raw=raw.replace(/\\\((.+?)\\\)/g,(_,body)=>put(wrapMath(body,false)));raw=raw.replace(/\b(Big|big)-O{1,3}\b/g,(_,prefix)=>`${prefix}-${put(wrapMath("O", true))}`);raw=raw.replace(/\b(Little|little)-o{1,3}\b/g,(_,prefix)=>`${prefix}-${put(wrapMath("o", true))}`);raw=raw.replace(/\b(Big|big)\s+O{1,3}\b/g,(_,prefix)=>`${prefix} ${put(wrapMath("O", true))}`);raw=raw.replace(/\b(Little|little)\s+o{1,3}\b/g,(_,prefix)=>`${prefix} ${put(wrapMath("o", true))}`);raw=raw.replace(/\b([A-Za-z])\s*(?:\\to|→|->)\s*(-?\d+(?:\.\d+)?|\\infty|[A-Za-z])\b/g,(_,variable,target)=>{return put(wrapMath(`${variable} \\to ${target}`,true));});raw=raw.replace(/\b([A-Za-z])\s*\(\s*([A-Za-z])\s*\)\s*=\s*([Oo])\s*\(\s*([A-Za-z])\s*\(\s*([A-Za-z])\s*\)\s*\)/g,(_,f,x1,order,g,x2)=>{return put(wrapMath(`${f}(${x1}) = ${order}(${g}(${x2}))`,true));});raw=raw.replace(/\b([Oo])\s*\(\s*([A-Za-z])\s*\(\s*([A-Za-z])\s*\)\s*\)/g,(_,order,fn,variable)=>{return put(wrapMath(`${order}(${fn}(${variable}))`,true));});raw=raw.replace(/\b([A-Za-z])\s*\(\s*([A-Za-z])\s*\)/g,(_,fn,variable)=>{return put(wrapMath(`${fn}(${variable})`,true));});raw=raw.replace(/\bp-(test|series|norm|metric)\b/gi,(_,suffix)=>put(`${wrapMath("p", true)}-${escapeHtml(suffix.toLowerCase())}`));raw=raw.replace(/\\int_[^.!?;]+?(?:\\mathrm\{d\}[a-zA-Z]|d[a-zA-Z])/g,(m)=>put(wrapMath(m,false)));raw=raw.replace(/\[[^\]]*\\infty[^\)]*\)/g,(m)=>put(wrapMath(m,true)));raw=raw.replace(/1\s*\/\s*(?:\\sqrt\{[^}]+\}|[A-Za-z](?:\^\{[^}]+\}|\^[A-Za-z0-9+-]+)?)(?:\s*=\s*[A-Za-z](?:\^\{[^}]+\}|\^[A-Za-z0-9+-]+)?)?/g,(m)=>put(wrapMath(m,false)));raw=raw.replace(/\b(?:p|x|y|t)\s*(?:\\ge|\\le|>=|<=|>|<|=)\s*(?:-?\d+(?:\/\d+)?|\\infty|[A-Za-z](?:\^\{[^}]+\}|\^[A-Za-z0-9+-]+)?)/g,(m)=>put(wrapMath(m,true)));raw=raw.replace(/\b[A-Za-z]\^\{[^}]+\}/g,(m)=>put(wrapMath(m,true)));raw=raw.replace(/\\sqrt\{[^}]+\}/g,(m)=>put(wrapMath(m,true)));raw=raw.replace(/\\infty/g,(m)=>put(wrapMath(m,true)));let html=escapeHtml(raw);html=html.replace(/\b(only if|if|since|when|because)\s+(@@AIMATH\d+@@)/gi,'<span class="aiq-nowrap-group">$1 $2</span>');for(const item of stash){html=html.split(item.token).join(item.html);}
return html;}
function ensureEntryButton(){const loadFailed=aiqContextIsCurrent(state.loadFailureContext);if(!state.conceptData&&!state.available&&!loadFailed)return;if(document.getElementById("aiq-entry"))return;const host=document.querySelector("#mw-meta[data-aiq-widget-host='1'], #mw-meta");if(!host)return;host.classList.add("mw-aiq-host");host.setAttribute("data-aiq-widget-host","1");host.textContent="";const btn=document.createElement("button");btn.type="button";btn.id="aiq-entry";btn.className="mw-aiq-btn";const cooldown=cooldownState(state.conceptId||currentRelPath());const entryLabel=cooldown.active?`AI concept check available in ${formatCooldown(cooldown.remainingMs)}`:loadFailed?"Retry AI concept check":CONFIG.buttonText;btn.title=entryLabel;btn.setAttribute("aria-label",entryLabel);btn.disabled=!!cooldown.active;btn.setAttribute("data-aiq-load-failed",loadFailed&&!cooldown.active?"1":"0");btn.innerHTML=`<span class="mw-aiq-btn-ico">${aiqSvgIcon(18)}</span><span class="mw-aiq-btn-label">${escapeHtml(loadFailed && !cooldown.active ? "Retry AI concept check" : CONFIG.buttonText)}</span>`;let lastOpenAt=0;const triggerOpen=(event)=>{event.preventDefault();event.stopPropagation();if(btn.disabled||btn.getAttribute("aria-disabled")==="true")return;const now=Date.now();if(now-lastOpenAt<650)return;lastOpenAt=now;try{const out=publicOpenQuiz();if(out&&typeof out.catch==="function")out.catch(()=>{});}catch(_){}};btn.addEventListener("click",triggerOpen);btn.addEventListener("pointerup",(event)=>{if(event&&event.pointerType==="mouse")return;triggerOpen(event);});btn.addEventListener("touchend",(event)=>{triggerOpen(event);});host.appendChild(btn);}
function buildModal(){ensureStyles();if(!state.modal)state.focusReturn=document.activeElement;closeQuiz({replacingModal:true});const subtitleHtml=renderRichText(modalSubtitleTitle());const modal=document.createElement("div");modal.id="aiq-modal";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.setAttribute("aria-labelledby","aiq-dialog-title");modal.innerHTML=`
      <div id="aiq-panel" role="document">
        <div class="aiq-head">
          <div>
            <div class="aiq-title" id="aiq-dialog-title">AI concept check</div>
            <div class="aiq-subtitle">${subtitleHtml}</div>
          </div>
          <div class="aiq-head-actions">
            ${aiqIsExamMode()
              ? ""
              : aiqIsRockAdminUser()
              ? '<button type="button" class="aiq-admin-entry" title="Open AI question reports" aria-label="Open AI question reports">Admin</button>'
              : `<button type="button"class="aiq-head-report aiq-report"title="Flag this question for maintainer review.">${aiqReportSvgIcon(15)}<span>${escapeHtml(CONFIG.reportButtonText||"Report")}</span></button>`}
            <button type="button" class="aiq-close" aria-label="Close">×</button>
          </div>
        </div>
        <div class="aiq-body"></div>
      </div>`;modal.addEventListener("click",(event)=>{if(event.target===modal)closeQuiz();});const adminEntry=modal.querySelector(".aiq-admin-entry");if(adminEntry){adminEntry.addEventListener("click",(event)=>{event.preventDefault();event.stopPropagation();aiqOpenReportAdmin();});}
const reportEntry=modal.querySelector(".aiq-head-report");if(reportEntry)aiqInstallReportButton(modal);modal.querySelector(".aiq-close").addEventListener("click",closeQuiz);["touchstart","touchmove","pointerdown","click"].forEach((eventName)=>{try{modal.addEventListener(eventName,(event)=>{if(event&&typeof event.stopPropagation==="function")event.stopPropagation();},{capture:false,passive:eventName!=="click"});}catch(_){}});document.body.appendChild(modal);state.modal=modal;state.panel=modal.querySelector("#aiq-panel");aiqBindViewportMetricsOnce();aiqUpdateViewportMetrics();typesetMathIn(modal.querySelector(".aiq-head"));document.documentElement.classList.add("aiq-modal-open");document.body.classList.add("aiq-modal-open");try{modal.querySelector('.aiq-close').focus({preventScroll:true});}catch(_){}
window.setTimeout(aiqUpdateViewportMetrics,60);return modal;}
function masteryRecordMatches(level){try{const cm=window.ConceptMastery;if(!cm||typeof cm.get!=="function")return false;const rec=cm.get(state.conceptId);return!!(rec&&rec.unrated!==true&&rec.state!=="unrated"&&rec.m!=null&&Number(rec.m)===Number(level));}catch(_){return false;}}
function notifyMasteryAccepted(level){const m=Math.max(0,Math.min(3,Number(level)));let rec=null;try{const cm=window.ConceptMastery;if(cm&&typeof cm.get==="function")rec=cm.get(state.conceptId);}catch(_){rec=null;}
const ts=Number(rec&&(rec.lastReviewed||rec.updatedAt)||Date.now())||Date.now();const detail={conceptId:state.conceptId,path:state.conceptId,title:getMeta().title||"",level:m,mastery:m,m,source:CONFIG.source,ts,forceRepeat:false,repeatOnly:false,changeKind:"ai-accept"};try{if(window.MkAccountData&&typeof window.MkAccountData.recordMastery==="function"){window.MkAccountData.recordMastery(detail.path||detail.conceptId,m,detail,{source:"ai-mastery-accepted-direct",ts,throttleMs:0});}}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk:ai-mastery-accepted",{detail}));}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk:mastery-submitted",{detail}));}catch(_){}
try{window.dispatchEvent(new CustomEvent("conceptMasteryChanged",{detail}));}catch(_){}}
function ensureMasteryResultSaved(level){const m=Math.max(0,Math.min(3,Number(level)));if(!aiqSessionIsCurrent())return false;const previous=state.masterySaveAttempt;const sameAttempt=previous&&previous.conceptId===state.conceptId&&previous.level===m&&aiqContextIsCurrent(previous.context);const startedAt=sameAttempt?previous.startedAt:Date.now();state.masterySaveAttempt={conceptId:state.conceptId,level:m,startedAt,context:aiqCaptureContext()};const cm=window.ConceptMastery;let memoryResult=null;try{memoryResult=cm&&typeof cm.get==="function"?cm.get(state.conceptId):null;}catch(_){}
const retryMemoryResult=sameAttempt&&masteryRecordMatches(m)&&memoryResult&&Number(memoryResult.lastReviewed||0)>=startedAt&&/^ai-mcq/.test(String(memoryResult.ratingSource||""));if(!retryMemoryResult){try{applyMasteryResult(m);}catch(_){}}
if(!masteryRecordMatches(m))writeMastery(m);const persisted=()=>{const matches=rec=>!!(rec&&rec.unrated!==true&&rec.state!=="unrated"&&rec.m!=null&&Number(rec.m)===m&&Number(rec.lastReviewed||rec.updatedAt||0)>=startedAt);try{const all=JSON.parse(localStorage.getItem("concept_mastery_v1")||"{}");if(matches(all[state.conceptId]))return true;}catch(_){}
try{const account=window.MkAccountData;if(account&&typeof account.getMasteryMap==="function"&&matches(account.getMasteryMap()[state.conceptId]))return true;}catch(_){}
return false;};if(!persisted()&&masteryRecordMatches(m)&&cm&&typeof cm._readAll==="function"&&typeof cm._writeAll==="function"){try{cm._writeAll(cm._readAll());}catch(_){}}
if(!persisted())forceLocalMasteryCommit(m,"ai-mcq-save-repair");if(!persisted())return false;notifyMasteryAccepted(m);return true;}
function closeQuiz(options){const opts=options&&typeof options==="object"?options:{};const shouldFinalize=!!(opts.saveMastery&&state.completed&&!state.resultMasterySaved&&state.pendingMasteryLevel!=null);const levelToFinalize=shouldFinalize?Number(state.pendingMasteryLevel):null;clearQuestionTimer();if(shouldFinalize){if(!ensureMasteryResultSaved(levelToFinalize)){const body=state.panel&&state.panel.querySelector(".aiq-body");const copy=body&&body.querySelector(".aiq-result-copy");if(copy)copy.textContent="The level could not be saved. Free some browser storage, then try Accept level again.";const button=body&&body.querySelector(".aiq-accept");if(button)button.disabled=false;return false;}
state.resultMasterySaved=true;}
if(!opts.replacingModal){state.openingContext=null;state.openingQuiz=false;}
state.pendingMasteryLevel=null;if(state.modal&&state.modal.parentNode)state.modal.parentNode.removeChild(state.modal);state.modal=null;state.panel=null;document.documentElement.classList.remove("aiq-modal-open");document.body.classList.remove("aiq-modal-open");if(!opts.replacingModal){const returnTo=state.focusReturn;state.focusReturn=null;try{if(returnTo&&returnTo.isConnected)returnTo.focus({preventScroll:true});}catch(_){}}
return true;}
function acceptSuggestedMastery(event){try{if(event&&event.preventDefault)event.preventDefault();}catch(_){}
try{if(event&&event.stopPropagation)event.stopPropagation();}catch(_){}
try{if(event&&event.stopImmediatePropagation)event.stopImmediatePropagation();}catch(_){}
const btn=event&&event.currentTarget;try{if(btn)btn.disabled=true;}catch(_){}
closeQuiz({saveMastery:true});}
function openQuiz(options){const opts=options&&typeof options==="object"?options:{};if(!state.conceptData)return false;if(!aiqContextIsCurrent(aiqCaptureContext()))return false;const questions=Array.isArray(state.conceptData.questions)?state.conceptData.questions:[];if(!questions.length)return false;const cooldown=cooldownState(state.conceptId);if(cooldown.active){state.currentSession=null;state.quizOptions=Object.assign({},opts);buildModal();renderCooldown(cooldown);return true;}
if(!aiqConsumeGuestAction("ai_quiz",{source:"ai-mcq-quiz",path:currentRelPath(),title:pageTitle(),dedupeMs:2500}))return false;state.sessionContext=aiqCaptureContext();state.currentSession={concept_id:state.conceptId,concept_title:state.conceptData.title||pageTitle(),ts:Date.now(),started_at:Date.now(),session_id:`aiq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,status:"started",questions:[],correct_count:0,suggested_mastery:null,source:opts.source||CONFIG.source,manual_level:opts.manualLevel!=null?Number(opts.manualLevel):(opts.initialLevel!=null?Number(opts.initialLevel):null),initial_difficulty:initialDifficultyFromOptions(opts),adaptive_policy:"manual-seeded-v1",};state.quizOptions=Object.assign({},opts);state.initialManualLevel=state.currentSession.manual_level;state.currentDifficulty=state.currentSession.initial_difficulty;state.timerDisabled=false;state.selectedOption=null;state.answerSubmitted=false;state.lastAnswerCorrect=null;state.completed=false;state.resultMasterySaved=false;state.masterySaveAttempt=null;state.resultXpRecorded=false;state.pendingMasteryLevel=null;state.sessionSaved=saveSession(state.currentSession);if(!state.sessionSaved){state.currentSession=null;return false;}
buildModal();renderQuestion();return true;}
function usedIds(){return new Set((state.currentSession&&state.currentSession.questions||[]).map((q)=>q.qid));}
function pickQuestion(difficulty){const questions=Array.isArray(state.conceptData.questions)?state.conceptData.questions:[];const used=usedIds();const exact=questions.filter((q)=>q&&q.difficulty===difficulty&&!used.has(q.id));if(exact.length)return shuffle(exact)[0];const fallback=questions.filter((q)=>q&&!used.has(q.id));if(fallback.length)return shuffle(fallback)[0];return shuffle(questions)[0]||null;}
function renderQuestion(){if(!state.panel||!state.currentSession)return;clearQuestionTimer();const body=state.panel.querySelector(".aiq-body");const session=state.currentSession;const index=session.questions.length+1;const rawQuestion=pickQuestion(state.currentDifficulty);if(!rawQuestion){renderError("No questions are available for this concept.");return;}
const q=shuffleQuestionOptions(rawQuestion);state.currentQuestion=q;state.currentDifficulty=normaliseDifficulty(q.difficulty||state.currentDifficulty);state.currentQuestionReportBusy=false;state.selectedOption=null;state.answerSubmitted=false;state.lastAnswerCorrect=null;state.currentQuestionStartedAt=0;aiqSetReportButtonState(state.modal&&state.modal.querySelector(".aiq-head-report"),"idle",CONFIG.reportButtonText||"Report");const options=Array.isArray(q.options)?q.options:[];const timeLimit=timeLimitForDifficulty(q.difficulty||state.currentDifficulty);body.innerHTML=`
      <div class="aiq-question-meta">
        <span class="aiq-pill">${escapeHtml(difficultyLabel(q.difficulty || state.currentDifficulty))}</span>
        <span class="aiq-timer-wrap" role="timer" aria-live="off">${state.timerDisabled ? 'No time limit' : `Time left<strong class="aiq-timer">${timeLimit}s</strong>`}</span>
        <button type="button" class="aiq-btn aiq-disable-timer"${state.timerDisabled ? ' hidden' : ''}>Turn off timer</button>
      </div>
      <div class="aiq-question" role="heading" aria-level="2" tabindex="-1"><span class="aiq-question-index">Q${index}:</span> ${renderRichText(q.question || "")}</div>
      <div class="aiq-report-note" aria-live="polite"></div>
      <div class="aiq-options">
        ${options.map((opt, i) => `<button type="button"class="aiq-option"data-index="${i}"><span class="aiq-letter">${String.fromCharCode(65+i)}</span><span class="aiq-option-text">${renderRichText(opt)}</span></button>`).join("")}
      </div>
      <div class="aiq-feedback" aria-live="polite"></div>
      <div class="aiq-actions">
        <button type="button" class="aiq-btn aiq-cancel">Cancel</button>
        <button type="button" class="aiq-btn primary aiq-submit" disabled>Submit answer</button>
      </div>`;body.querySelectorAll(".aiq-option").forEach((btn)=>{btn.addEventListener("click",()=>selectOption(Number(btn.dataset.index)));});aiqInstallReportButton(body);body.querySelector(".aiq-cancel").addEventListener("click",closeQuiz);body.querySelector(".aiq-submit").addEventListener("click",handlePrimaryButtonClick);body.querySelector('.aiq-disable-timer').addEventListener('click',()=>{if(!aiqSessionIsCurrent()||state.answerSubmitted)return;state.timerDisabled=true;clearQuestionTimer();body.querySelector('.aiq-timer-wrap').textContent='No time limit';body.querySelector('.aiq-disable-timer').hidden=true;try{body.querySelector('.aiq-question').focus({preventScroll:true});}catch(_){}});typesetMathIn(body);startQuestionTimer();try{body.querySelector('.aiq-question').focus({preventScroll:true});}catch(_){}}
function selectOption(index){if(!aiqSessionIsCurrent()||state.answerSubmitted)return;state.selectedOption=index;if(!state.panel)return;const body=state.panel.querySelector(".aiq-body");body.querySelectorAll(".aiq-option").forEach((btn)=>{btn.classList.toggle("is-selected",Number(btn.dataset.index)===index);});const submit=body.querySelector(".aiq-submit");if(submit)submit.disabled=false;}
function handlePrimaryButtonClick(){if(!aiqSessionIsCurrent())return;if(state.answerSubmitted){const session=state.currentSession;if(!session)return;const done=session.questions.length>=(Number(CONFIG.questionsPerSession)||3);if(done){renderResult();return;}
state.currentDifficulty=nextDifficultyAfter(!!state.lastAnswerCorrect,state.currentDifficulty);renderQuestion();return;}
submitAnswer();}
function submitAnswer(options){const opts=options&&typeof options==="object"?options:{};if(!aiqSessionIsCurrent()||state.answerSubmitted||!state.panel)return;const q=state.currentQuestion;const session=state.currentSession;const timedOut=!!opts.timedOut||(state.questionDeadline>0&&Date.now()>=state.questionDeadline);if(!q||!session||(!timedOut&&state.selectedOption==null))return;clearQuestionTimer();state.answerSubmitted=true;const correctIndex=Number(q.correct_index);const selectedIndex=timedOut?null:Number(state.selectedOption);const correct=!timedOut&&selectedIndex===correctIndex;state.lastAnswerCorrect=correct;if(correct)session.correct_count+=1;session.questions.push({qid:q.id,difficulty:q.difficulty,question_type:q.question_type,correct,selected_index:selectedIndex,correct_index:correctIndex,timed_out:timedOut,time_limit_seconds:state.timerDisabled?null:timeLimitForDifficulty(q.difficulty||state.currentDifficulty),time_spent_ms:state.currentQuestionStartedAt?Math.max(0,Date.now()-Number(state.currentQuestionStartedAt)):null,shown_options:Array.isArray(q.options)?q.options.slice():[],});const body=state.panel.querySelector(".aiq-body");const timerControl=body.querySelector('.aiq-disable-timer');if(timerControl)timerControl.hidden=true;body.querySelectorAll(".aiq-option").forEach((btn)=>{const idx=Number(btn.dataset.index);btn.disabled=true;btn.classList.toggle("is-correct",idx===correctIndex);btn.classList.toggle("is-wrong",selectedIndex!=null&&idx===selectedIndex&&!correct);});const feedback=body.querySelector(".aiq-feedback");if(feedback){feedback.classList.add("is-visible");const heading=correct?"Correct.":(timedOut?"Time is up.":"Not quite.");let html=`<p class="aiq-feedback-main"><strong>${heading}</strong> ${renderRichText(q.explanation || "")}</p>`;const optExpl=Array.isArray(q.option_explanations)?q.option_explanations:null;if(!correct&&!timedOut&&selectedIndex!=null&&optExpl&&optExpl[selectedIndex]){html+=`<p class="aiq-feedback-wrong"><strong>Why your answer (${String.fromCharCode(65 + selectedIndex)}) is wrong:</strong> ${renderRichText(optExpl[selectedIndex])}</p>`;}
feedback.innerHTML=html;typesetMathIn(feedback);}
const submit=body.querySelector(".aiq-submit");if(submit){const done=session.questions.length>=(Number(CONFIG.questionsPerSession)||3);submit.textContent=done?"Show result":"Next question";submit.disabled=false;}}
function masteryLabel(level){return(LEVELS[level]&&LEVELS[level].label)||"Not rated";}
function simpleResultHash(value){const src=String(value||"").slice(0,1000);let h=2166136261;for(let i=0;i<src.length;i+=1){h^=src.charCodeAt(i);h=Math.imul(h,16777619);}
return(h>>>0).toString(36);}
function aiQuizResultId(session){const s=session&&typeof session==="object"?session:{};const qs=Array.isArray(s.questions)?s.questions:[];const raw=[s.concept_id||state.conceptId||currentRelPath(),s.ts||0,s.completed_at||Date.now(),s.correct_count||0,qs.map((q)=>[q&&q.qid,q&&q.selected_index,q&&q.correct].join(":")).join("|")].join("::");return`aiq-${simpleResultHash(raw)}`;}
function aiQuizSelectedWrongCount(session){const questions=Array.isArray(session&&session.questions)?session.questions:[];return questions.reduce((count,q)=>{if(!q||typeof q!=="object")return count;const selected=q.selected_index!=null?q.selected_index:q.selectedIndex;if(q.timed_out===true||q.timedOut===true||selected==null||selected==="")return count;return q.correct===false?count+1:count;},0);}
function aiQuizTimeoutCount(session){const questions=Array.isArray(session&&session.questions)?session.questions:[];return questions.reduce((count,q)=>(q&&(q.timed_out===true||q.timedOut===true)?count+1:count),0);}
function recordAiQuizXp(session,level,resultId){if(state.resultXpRecorded)return true;if(!aiqSessionIsCurrent())return false;const s=session&&typeof session==="object"?session:{};const total=Number(CONFIG.questionsPerSession)||(Array.isArray(s.questions)?s.questions.length:0)||3;const selectedWrong=aiQuizSelectedWrongCount(s);const timeoutCount=aiQuizTimeoutCount(s);const detail={resultId:resultId||aiQuizResultId(s),sessionId:String(s.ts||""),conceptId:s.concept_id||state.conceptId||"",path:s.concept_id||state.conceptId||currentRelPath(),title:s.concept_title||pageTitle(),score:Number(s.correct_count||0),correct:Number(s.correct_count||0),selectedWrong,selectedWrongCount:selectedWrong,answeredWrongCount:selectedWrong,wrongAnswerCount:selectedWrong,wrong:selectedWrong,wrongCount:selectedWrong,incorrect:selectedWrong,incorrectCount:selectedWrong,timeoutCount,timedOutCount:timeoutCount,total,suggestedMastery:Number(level),completedAt:Number(s.completed_at||Date.now()),completed:true,resultProduced:true,source:"ai-mcq-render-result",};const eventId=`evt_ai_quiz_complete_${detail.path || "global"}_${detail.resultId}`.replace(/[^a-zA-Z0-9_.:-]/g,"_").slice(0,220);const eventOptions={id:eventId,ts:detail.completedAt,scope:`ai_quiz:${detail.resultId}`,throttleMs:0,requirePersistence:true};let recorded=false;try{if(window.MkXpActivity&&typeof window.MkXpActivity.recordAiQuizCompleted==="function"){window.MkXpActivity.recordAiQuizCompleted(detail);}}catch(_){}
try{let result;let directQuizApi=false;if(window.MkAccountData&&typeof window.MkAccountData.recordAiQuiz==="function"){directQuizApi=true;result=window.MkAccountData.recordAiQuiz(detail.path||detail.conceptId||currentRelPath(),detail,eventOptions);}else if(window.MkAccountData&&typeof window.MkAccountData.recordActivity==="function"){result=window.MkAccountData.recordActivity("ai_quiz",detail,eventOptions);}
recorded=!!(result&&(result.ok===true||(directQuizApi&&result.id===eventId&&result.type==="ai_quiz_complete")));if(result&&typeof result.catch==="function")result.catch(()=>{});}catch(_){}
try{document.dispatchEvent(new CustomEvent("mk:ai-quiz-completed",{detail}));}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk:ai-quiz-completed",{detail}));}catch(_){}
if(!recorded){try{const key="mk_xp_pending_activity_queue_v1";const arr=JSON.parse(localStorage.getItem(key)||"[]");if(!Array.isArray(arr))throw new Error("Invalid pending activity queue");if(!arr.some(item=>item&&item.metric==="ai_quiz"&&item.details&&item.details.resultId===detail.resultId)){arr.push({id:eventId,metric:"ai_quiz",details:detail,opts:eventOptions,queuedAt:detail.completedAt,source:"ai-mcq-quiz-fallback"});}
const text=JSON.stringify(arr.slice(-300));localStorage.setItem(key,text);recorded=localStorage.getItem(key)===text;}catch(_){}}
state.resultXpRecorded=recorded;return recorded;}
function renderResult(){if(!aiqSessionIsCurrent()||!state.panel||!state.currentSession)return;clearQuestionTimer();const body=state.panel.querySelector(".aiq-body");const session=state.currentSession;const correct=Number(session.correct_count)||0;const level=Math.max(0,Math.min(3,correct));session.suggested_mastery=level;session.completed_at=session.completed_at||Date.now();session.status="completed";const resultId=session.result_id||aiQuizResultId(session);session.result_id=resultId;state.completed=true;state.pendingMasteryLevel=level;state.sessionSaved=saveSession(session);if(state.sessionSaved)recordAiQuizXp(session,level,resultId);const resultNeedsRetry=!state.sessionSaved||!state.resultXpRecorded;const cooldown=cooldownState(session.concept_id);const masteryWritable=state.sessionSaved&&canApplyMasteryResult();const rows=session.questions.map((item,i)=>`<span class="aiq-pill">Q${i + 1}: ${item.timed_out ? "timeout" : (item.correct ? "correct" : "wrong")}</span>`).join("");body.innerHTML=`
      <div class="aiq-result-card" data-ai-quiz-result="1" data-aiq-result-id="${escapeHtml(resultId)}">
        <div class="aiq-pill">${correct}/${Number(CONFIG.questionsPerSession) || 3} correct</div>
        <div class="aiq-result-main" role="heading" aria-level="2" tabindex="-1">Suggested level: ${escapeHtml(masteryLabel(level))}</div>
        <div class="aiq-result-copy">
          ${!state.sessionSaved
            ? "This result could not be saved. Free some browser storage, then choose Save result to retry."
            : masteryWritable
            ? `Accept to save this suggested level to your concept mastery history.This concept is now on a 7-day AI quiz cooldown${cooldown.active?` (${escapeHtml(formatCooldown(cooldown.remainingMs))} left)`:""}.`
            : `This quiz session has been saved,but the mastery system is not available on this page.This concept is now on a 7-day AI quiz cooldown${cooldown.active?` (${escapeHtml(formatCooldown(cooldown.remainingMs))} left)`:""}.`}
        </div>
        ${state.sessionSaved && !state.resultXpRecorded ? '<p class="aiq-result-save-note">The quiz session is saved, but its activity record could not be saved. Free some browser storage, then choose Save result to retry.</p>' : ""}
        <div class="aiq-progress" style="margin-top:14px">${rows}</div>
      </div>
      <div class="aiq-actions">
        ${resultNeedsRetry ? '<button type="button" class="aiq-btn primary aiq-save-result">Save result</button>' : ""}
        <button type="button" class="aiq-btn primary aiq-accept"${masteryWritable ? "" : " disabled"}>Accept level</button>
        <button type="button" class="aiq-btn aiq-retry"${cooldown.active ? " disabled" : ""}>${cooldown.active ? `Available in ${escapeHtml(formatCooldown(cooldown.remainingMs))}` : "Try again"}</button>
        <button type="button" class="aiq-btn aiq-close-result">Close</button>
      </div>`;const acceptBtn=body.querySelector(".aiq-accept");if(acceptBtn)acceptBtn.addEventListener("click",acceptSuggestedMastery);const saveBtn=body.querySelector(".aiq-save-result");if(saveBtn&&resultNeedsRetry)saveBtn.addEventListener("click",renderResult);const retryBtn=body.querySelector(".aiq-retry");if(retryBtn&&!retryBtn.disabled)retryBtn.addEventListener("click",()=>openQuiz(state.quizOptions||{}));body.querySelector(".aiq-close-result").addEventListener("click",()=>closeQuiz());typesetMathIn(body);try{body.querySelector('.aiq-result-main').focus({preventScroll:true});}catch(_){}}
function renderCooldown(cooldown){if(!state.panel)return;clearQuestionTimer();const body=state.panel.querySelector(".aiq-body");const cd=cooldown||cooldownState(state.conceptId);const untilText=cd.until?new Date(cd.until).toLocaleString():"";body.innerHTML=`
      <div class="aiq-result-card">
        <div class="aiq-pill">7-day cooldown</div>
        <div class="aiq-result-main">AI quiz locked for now</div>
        <div class="aiq-result-copy">
          You have already started the AI quiz for this concept. You can answer again in ${escapeHtml(formatCooldown(cd.remainingMs))}${untilText ? `,after ${escapeHtml(untilText)}` : ""}.
        </div>
      </div>
      <div class="aiq-actions"><button type="button" class="aiq-btn primary aiq-close-result">Close</button></div>`;body.querySelector(".aiq-close-result").addEventListener("click",closeQuiz);}
function renderError(message,retry){if(!state.panel)return;clearQuestionTimer();const body=state.panel.querySelector(".aiq-body");const retryModal=state.modal;const retryContext=retry&&retry.context;body.innerHTML=`
      <div class="aiq-result-card">
        <div class="aiq-result-main">Quiz unavailable</div>
        <div class="aiq-result-copy">${escapeHtml(message || "The quiz could not be loaded.")}</div>
      </div>
      <div class="aiq-actions">${retryContext ? '<button type="button" class="aiq-btn primary aiq-load-retry">Retry</button>' : ""}<button type="button" class="aiq-btn primary aiq-close-result">Close</button></div>`;if(retryContext)body.querySelector(".aiq-load-retry").addEventListener("click",(event)=>{if(state.modal!==retryModal||!aiqContextIsCurrent(retryContext))return;if(event&&event.currentTarget)event.currentTarget.disabled=true;publicOpenQuiz(retry.options||{}).catch(()=>{});});body.querySelector(".aiq-close-result").addEventListener("click",closeQuiz);}
function renderLoading(message){if(!state.panel)return;clearQuestionTimer();const body=state.panel.querySelector(".aiq-body");const report=state.modal&&state.modal.querySelector(".aiq-head-report");if(report){report.disabled=true;report.setAttribute("aria-disabled","true");}
body.innerHTML=`
      <div class="aiq-result-card">
        <div class="aiq-result-main">Loading quiz</div>
        <div class="aiq-result-copy">${escapeHtml(message || "Preparing questions...")}</div>
      </div>`;}
function emitAvailability(available){if(available)state.loadFailureContext=null;state.availabilityKnown=true;state.available=!!available;try{window.__AIMCQAvailabilityState={known:true,available:!!available,conceptId:state.conceptId||"",ts:Date.now()};}catch(_){}
try{window.dispatchEvent(new CustomEvent("aiq:availability-change",{detail:{available:!!available,conceptId:state.conceptId||""},}));if(available){window.dispatchEvent(new CustomEvent("aiq:ready",{detail:{available:true,conceptId:state.conceptId||""},}));}}catch(_){}}
function setCurrentConcept(found){if(!found||!found.conceptData)return false;state.conceptId=found.conceptId;state.conceptData=found.conceptData;return true;}
function currentStateMatchesPage(){if(!state.conceptData||!state.conceptId)return false;const id=normId(state.conceptId);return currentConceptCandidates().some((candidate)=>normId(candidate)===id);}
async function ensureConceptLoaded(context){if(currentStateMatchesPage())return true;state.conceptData=null;try{await ensureBankForCurrentConcept();if(context&&(state.openingContext!==context||!aiqContextIsCurrent(context)))return false;const found=findConceptInBank();if(!setCurrentConcept(found)){state.available=false;emitAvailability(false);return false;}
state.available=true;ensureEntryButton();emitAvailability(true);return true;}catch(err){if(context&&(state.openingContext!==context||!aiqContextIsCurrent(context)))return false;console.warn("AI MCQ quiz unavailable:",err);state.loadFailureContext=context||aiqCaptureContext();ensureEntryButton();emitAvailability(false);return false;}}
async function publicOpenQuiz(options){const opts=options&&typeof options==="object"?options:{};if(state.openingQuiz)return false;if(!aiqContextIsCurrent(aiqCaptureContext()))return false;if(!state.conceptData){if(!state.modal)buildModal();renderLoading();}
const context=aiqCaptureContext();state.openingContext=context;state.openingQuiz=true;try{const ok=await ensureConceptLoaded(context);if(state.openingContext!==context)return false;if(!aiqContextIsCurrent(context)){closeQuiz();return false;}
if(!ok){if(!state.modal)buildModal();renderError("The quiz could not be loaded. Please try again.",{context,options:Object.assign({},opts)});return false;}
const opened=openQuiz(opts);if(!opened){if(!state.modal)buildModal();renderError("The quiz could not be started or saved. Check browser storage and try again.");}
return!!opened;}finally{if(state.openingContext===context){state.openingContext=null;state.openingQuiz=false;}}}
function publicAcceptSuggestedMastery(){try{if(!state.completed||state.pendingMasteryLevel==null)return false;if(!state.sessionSaved||!aiqSessionIsCurrent())return false;return closeQuiz({saveMastery:true});}catch(_){return false;}}
function publicCloseQuiz(){try{closeQuiz();return true;}catch(_){return false;}}
function publicState(){return{open:!!state.modal,completed:!!state.completed,conceptId:state.conceptId||"",pendingMasteryLevel:state.pendingMasteryLevel==null?null:Number(state.pendingMasteryLevel),resultMasterySaved:!!state.resultMasterySaved,loadFailed:aiqContextIsCurrent(state.loadFailureContext),cooldown:cooldownState(state.conceptId||currentRelPath()),};}
function publicCooldownState(conceptId){return cooldownState(conceptId||state.conceptId||currentRelPath());}
function installPublicApi(){try{window.AIMCQQuiz=Object.assign(window.AIMCQQuiz||{},{open:publicOpenQuiz,isAvailable:()=>(!!state.conceptData||!!state.available)&&!cooldownState(state.conceptId||currentRelPath()).active,availabilityKnown:()=>!!state.availabilityKnown,ensureEntryButton,getCooldownState:publicCooldownState,getButtonText:()=>CONFIG.buttonText,iconHtml:aiqSvgIcon,openReportAdmin:aiqOpenReportAdmin,readLocalReports:aiqReadLocalReports,acceptSuggestedMastery:publicAcceptSuggestedMastery,close:publicCloseQuiz,getState:publicState,});window.AIQQuiz=window.AIMCQQuiz;window.AIMCQQuizReports=Object.assign(window.AIMCQQuizReports||{},{openAdmin:aiqOpenReportAdmin,readLocal:aiqReadLocalReports,exportJson:()=>aiqExportReports(aiqReadLocalReports(),"json"),exportCsv:()=>aiqExportReports(aiqReadLocalReports(),"csv"),});}catch(_){}}
async function init(){const context=aiqCaptureContext();state.loadFailureContext=null;const preloadHold=(()=>{try{return aiqLooksConceptPage()&&window.__rkHold?window.__rkHold("ai-mcq-availability"):null;}catch(_){return null;}})();let preloadHoldReleased=false;let preloadHoldTimer=0;const releasePreloadHold=()=>{if(preloadHoldReleased)return;preloadHoldReleased=true;if(preloadHoldTimer){try{window.clearTimeout(preloadHoldTimer);}catch(_){}
preloadHoldTimer=0;}
aiqReleasePreloadHold(preloadHold);};if(preloadHold){try{preloadHoldTimer=window.setTimeout(releasePreloadHold,1000);}catch(_){preloadHoldTimer=0;}}
try{installPublicApi();ensureStyles();aiqMaybeOpenReportAdminFromUrl();let resolved=false;try{await loadIndex();const hit=findConceptInIndex();if(hit){state.conceptId=hit.conceptId;state.available=true;ensureEntryButton();emitAvailability(true);resolved=true;}else if(state.indexConcepts){emitAvailability(false);resolved=true;}}catch(_){}
if(!resolved){await ensureBankForCurrentConcept();const found=findConceptInBank();if(!setCurrentConcept(found)){emitAvailability(false);return;}
state.available=true;ensureEntryButton();emitAvailability(true);}
if(!state.available)return;window.addEventListener("mk:mastery-widget-ready",()=>ensureEntryButton());window.addEventListener("mw:widget-ready",()=>ensureEntryButton());window.setTimeout(()=>ensureEntryButton(),120);window.setTimeout(()=>ensureEntryButton(),480);}catch(err){if(!aiqContextIsCurrent(context))return;console.warn("AI MCQ quiz unavailable:",err);state.loadFailureContext=context;ensureEntryButton();emitAvailability(false);}finally{requestAnimationFrame(()=>{requestAnimationFrame(releasePreloadHold);});}}
function onReady(fn){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",fn,{once:true});else fn();}
installPublicApi();onReady(init);document.addEventListener("keydown",(event)=>{if(!state.modal||event.defaultPrevented)return;if(event.key==="Escape"){event.preventDefault();closeQuiz();return;}
if(event.key!=='Tab')return;const controls=Array.from(state.modal.querySelectorAll('button, input, select, textarea, a[href], [tabindex]')).filter(el=>!el.disabled&&el.tabIndex>=0&&!el.hidden&&el.getClientRects().length);const first=controls[0],last=controls[controls.length-1];const active=document.activeElement;if(first&&(!state.modal.contains(active)||(event.shiftKey?active===first||!controls.includes(active):active===last))){event.preventDefault();(event.shiftKey?last:first).focus();}});window.addEventListener("pagehide",()=>closeQuiz());window.addEventListener("mk-account-workspace-changed",()=>closeQuiz());})();