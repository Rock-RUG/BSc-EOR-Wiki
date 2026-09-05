(function(){function __mkFetchSearchIndex(url,init){const shared=window.__mkFetchJsonShared;if(typeof shared==="function")return shared(url,init);return fetch(url,init).then(function(r){return r&&r.ok?r.json():null;});}
const{CSR_INPUT_HISTORY_KEY,CSR_INPUT_HISTORY_MAX,CSR_NOFLASH_STYLE_ID,CSR_FUZZY_CORE_PATH,CSR_VIEWS_API_BASE,CSR_VIEWS_CACHE_KEY,CSR_VIEWS_CACHE_TTL_MS,escapeHtml,csrSimpleHash,getSiteRootUrl,csrNormLoc,csrNormPath,safePath,asStringList,normaliseForSearch,csrCleanPageTitle,csrStripPluralS,unitNounFromType,csrStopInPlaceEvent,csrIsSubmitLikeTarget,csrCourseFormFromEvent,csrIsCourseSearchEnter,typesetMath,typesetMathAsync,csrConsumeGuestAction,latexMathToPlain,getCourseKeyFromUrl,csrGetSearchForm,csrGetSearchInput,csrIsDesktopAssistViewport,yearCourseFromLocation,yearOrderFromFolder,courseOrderFromFolder,buildPageButtons,csrSortKeyDirFromOption,csrSvg}=window.MkCS||{};window.__courseSearchVersion="v4.2.42-course-search-focus-preserve";let CSR_STATE={items:[],page:1,pageSize:10,sortKey:"best",sortDir:"desc",};let CSR_LAST_HAS_RESULTS=false;let CSR_SEARCH_SEQ=0;const __csrAssistUi={items:[],activeIndex:-1,suppressBlurHideUntil:0,lastApplied:"",lastNoteFix:"",requestSeq:0,scopeCacheKey:"",scopePromise:null,resizeBound:false,outsideClickBound:false,scrollBound:false,};let __csrNoFlashCleanupTimer=0;let __csrSubmitGuardBound=false;let __csrLastSubmitStamp={key:"",t:0};let __csrFocusProtectUntil=0;function csrInstallNoFlashStyles(){if(document.getElementById(CSR_NOFLASH_STYLE_ID))return;const st=document.createElement("style");st.id=CSR_NOFLASH_STYLE_ID;st.textContent=`
      /* Course search should behave like Find builder's in-place Run search:
         no route preload, no full-screen dim/black overlay, no blur/fog while results render. */
      html.csr-course-search-inplace #course-search-results,
      body.csr-course-search-inplace #course-search-results,
      html.csr-course-search-inplace #course-search-results .csr-wrap,
      body.csr-course-search-inplace #course-search-results .csr-wrap,
      html.csr-course-search-inplace #course-search-results .csr-cols,
      body.csr-course-search-inplace #course-search-results .csr-cols,
      html.csr-course-search-inplace #course-search-results .csr-list,
      body.csr-course-search-inplace #course-search-results .csr-list,
      html.csr-course-search-inplace #course-search-results .csr-foot,
      body.csr-course-search-inplace #course-search-results .csr-foot{
        filter:none !important;
        -webkit-filter:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        opacity:1 !important;
        transform:none !important;
        animation:none !important;
        transition:none !important;
      }

      html.csr-course-search-inplace .md-search__overlay,
      body.csr-course-search-inplace .md-search__overlay,
      html.csr-course-search-inplace .md-overlay,
      body.csr-course-search-inplace .md-overlay,
      html.csr-course-search-inplace .mk-first-paint-gate,
      body.csr-course-search-inplace .mk-first-paint-gate,
      html.csr-course-search-inplace .mk-preload-gate,
      body.csr-course-search-inplace .mk-preload-gate,
      html.csr-course-search-inplace .mk-route-preload,
      body.csr-course-search-inplace .mk-route-preload,
      html.csr-course-search-inplace .mk-page-transition,
      body.csr-course-search-inplace .mk-page-transition,
      html.csr-course-search-inplace #mk-mobile-search-backdrop,
      body.csr-course-search-inplace #mk-mobile-search-backdrop,
      html.csr-course-search-inplace .mk-mobile-search-backdrop,
      body.csr-course-search-inplace .mk-mobile-search-backdrop,
      html.csr-course-search-inplace [data-mk-mobile-search-backdrop],
      body.csr-course-search-inplace [data-mk-mobile-search-backdrop],
      html.csr-course-search-inplace [data-mk-preload-gate],
      body.csr-course-search-inplace [data-mk-preload-gate],
      html.csr-course-search-inplace [data-mk-route-preload],
      body.csr-course-search-inplace [data-mk-route-preload],
      html.csr-course-search-inplace [data-rk-preload],
      body.csr-course-search-inplace [data-rk-preload]{
        display:none !important;
        opacity:0 !important;
        visibility:hidden !important;
        pointer-events:none !important;
        background:transparent !important;
        filter:none !important;
        -webkit-filter:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        animation:none !important;
        transition:none !important;
      }
    `;(document.head||document.documentElement).appendChild(st);}
function csrBeginInPlaceSearchGuard(ms){csrInstallNoFlashStyles();const until=Date.now()+Math.max(1200,Number(ms)||0);try{window.__mkCourseSearchInPlaceUntil=until;}catch(_){}
try{window.__findHeaderSamePageHandledUntilV8=until;}catch(_){}
try{window.__findHeaderSamePageHandledUntilV7=until;}catch(_){}
try{window.__findHeaderEnterSuppressUntilV8=until;}catch(_){}
try{window.__findHeaderEnterSuppressUntilV6=until;}catch(_){}
try{window.__mkFindSamePageTopSearchUntil=until;}catch(_){}
try{window.__mkCourseSearchNoMobileBackdropUntil=until;}catch(_){}
try{window.__rkCancelPreloadForFindSamePage&&window.__rkCancelPreloadForFindSamePage("course-search");}catch(_){}
try{window.__rkRevealWhenReady&&window.__rkRevealWhenReady();}catch(_){}
csrHideMobileSearchBackdrop();try{document.documentElement&&document.documentElement.classList.add("csr-course-search-inplace");document.body&&document.body.classList.add("csr-course-search-inplace");}catch(_){}
if(__csrNoFlashCleanupTimer){try{window.clearTimeout(__csrNoFlashCleanupTimer);}catch(_){}
__csrNoFlashCleanupTimer=0;}
__csrNoFlashCleanupTimer=window.setTimeout(csrClearInPlaceSearchGuard,Math.max(1300,Number(ms)||0));}
function csrClearInPlaceSearchGuard(){__csrNoFlashCleanupTimer=0;try{if(Date.now()<Number(window.__mkCourseSearchInPlaceUntil||0))return;}catch(_){}
try{document.documentElement&&document.documentElement.classList.remove("csr-course-search-inplace");document.body&&document.body.classList.remove("csr-course-search-inplace");}catch(_){}
csrRestoreMobileSearchBackdropStyles();}
function csrClearInPlaceSearchGuardSoon(){window.setTimeout(csrClearInPlaceSearchGuard,260);window.setTimeout(csrClearInPlaceSearchGuard,900);window.setTimeout(csrRestoreMobileSearchBackdropStyles,1800);window.setTimeout(csrRestoreMobileSearchBackdropStyles,3800);}
function csrHideMobileSearchBackdrop(){try{const until=Number(window.__mkCourseSearchNoMobileBackdropUntil||0);if(until&&Date.now()>until)return;const nodes=document.querySelectorAll('#mk-mobile-search-backdrop, .mk-mobile-search-backdrop, [data-mk-mobile-search-backdrop], .md-search__overlay, .md-overlay');nodes.forEach((el)=>{try{el.dataset.csrMobileBackdropHidden='1';el.style.setProperty('display','none','important');el.style.setProperty('opacity','0','important');el.style.setProperty('visibility','hidden','important');el.style.setProperty('pointer-events','none','important');el.style.setProperty('background','transparent','important');el.style.setProperty('backdrop-filter','none','important');el.style.setProperty('-webkit-backdrop-filter','none','important');el.style.setProperty('filter','none','important');el.style.setProperty('-webkit-filter','none','important');}catch(_){}});}catch(_){}}
function csrRestoreMobileSearchBackdropStyles(){try{if(Date.now()<Number(window.__mkCourseSearchNoMobileBackdropUntil||0))return;const nodes=document.querySelectorAll('#mk-mobile-search-backdrop[data-csr-mobile-backdrop-hidden="1"], .mk-mobile-search-backdrop[data-csr-mobile-backdrop-hidden="1"], [data-mk-mobile-search-backdrop][data-csr-mobile-backdrop-hidden="1"], .md-search__overlay[data-csr-mobile-backdrop-hidden="1"], .md-overlay[data-csr-mobile-backdrop-hidden="1"]');nodes.forEach((el)=>{try{delete el.dataset.csrMobileBackdropHidden;['display','opacity','visibility','pointer-events','background','backdrop-filter','-webkit-backdrop-filter','filter','-webkit-filter'].forEach((prop)=>{try{el.style.removeProperty(prop);}catch(_){}});}catch(_){}});}catch(_){}}
function csrKeepMobileSearchBackdropHidden(ms){try{const until=Date.now()+Math.max(900,Number(ms)||0);window.__mkCourseSearchNoMobileBackdropUntil=Math.max(Number(window.__mkCourseSearchNoMobileBackdropUntil||0),until);csrHideMobileSearchBackdrop();[40,120,260,520,900,1400].forEach((delay)=>{window.setTimeout(csrHideMobileSearchBackdrop,Math.min(delay,Math.max(40,Number(ms)||1400)));});}catch(_){}}
function csrProtectCourseSearchFocus(ms){try{const input=document.getElementById("course-search-input");if(!input)return;const form=document.getElementById("course-search-form");const until=Date.now()+Math.max(350,Number(ms)||0);__csrFocusProtectUntil=Math.max(__csrFocusProtectUntil||0,until);try{window.__mkCourseSearchFocusProtectUntil=__csrFocusProtectUntil;}catch(_){}
const refocus=()=>{try{if(Date.now()>__csrFocusProtectUntil)return;const active=document.activeElement;const alreadyInside=!!(active&&form&&form.contains(active));if(active===input||alreadyInside)return;input.focus({preventScroll:true});const v=String(input.value||"");if(typeof input.setSelectionRange==="function")input.setSelectionRange(v.length,v.length);}catch(_){try{input.focus();}catch(__){}}};[0,40,120,260].forEach((delay)=>window.setTimeout(refocus,delay));}catch(_){}}
function csrCloseMaterialSearchOverlayForCourseSearch(){try{const courseInput=document.getElementById("course-search-input");const shouldPreserveCourseFocus=!!(courseInput&&(document.activeElement===courseInput||Date.now()<(__csrFocusProtectUntil||0)));if(shouldPreserveCourseFocus)csrProtectCourseSearchFocus(650);const toggle=document.querySelector('input.md-toggle[data-md-toggle="search"]')||document.querySelector('input#__search');if(toggle)toggle.checked=false;csrKeepMobileSearchBackdropHidden(1600);const headerInputs=Array.from(document.querySelectorAll('input[data-md-component="search-query"]'));headerInputs.forEach((el)=>{if(el&&el.id==="course-search-input")return;try{el.value="";}catch(_){}
try{el.dispatchEvent(new Event("input",{bubbles:true}));}catch(_){}
try{el.blur&&el.blur();}catch(_){}});document.querySelectorAll('.md-search.md-search--active').forEach((el)=>{try{el.classList.remove("md-search--active");}catch(_){}});if(shouldPreserveCourseFocus)csrProtectCourseSearchFocus(650);}catch(_){}}
function csrHandleCourseSearchSubmit(ev,source){const form=csrCourseFormFromEvent(ev);const input=document.getElementById("course-search-input");const out=document.getElementById("course-search-results");if(!form||!input||!out)return false;try{if(ev&&ev.__csrCourseSearchHandled)return true;if(ev)ev.__csrCourseSearchHandled=true;}catch(_){}
csrStopInPlaceEvent(ev);csrBeginInPlaceSearchGuard(3200);csrKeepMobileSearchBackdropHidden(3600);csrCloseMaterialSearchOverlayForCourseSearch();csrHideFuzzyNote();csrHideAssistDropdown();const rawNow=String(input.value||"").trim().replace(/\s+/g," ");const dedupeKey=rawNow+"::"+String(source||"");const now=Date.now();if(dedupeKey&&__csrLastSubmitStamp.key===dedupeKey&&(now-__csrLastSubmitStamp.t)<180){return true;}
__csrLastSubmitStamp={key:dedupeKey,t:now};const historyValue=(__csrAssistUi.lastNoteFix&&rawNow&&rawNow.toLowerCase()===String(csrGetSearchInput()&&csrGetSearchInput().value||"").trim().replace(/\s+/g," ").toLowerCase())?String(__csrAssistUi.lastNoteFix||"").trim():rawNow;if(historyValue)csrAddInputHistory(historyValue);Promise.resolve().then(()=>runCourseSearch(input.value,{_directInPlace:true})).then((res)=>{if(rawNow&&res&&res.ok!==false){csrTrackActivity("course_search",{query:rawNow.slice(0,120),querySample:rawNow.slice(0,80),queryLength:rawNow.length,course:getCourseKeyFromUrl(),resultCount:Number(res.count||0),},{scope:"course_search_submit:"+rawNow.slice(0,80),throttleMs:0});}}).catch((err)=>{out.innerHTML=`<div class="csr-item">Error: ${escapeHtml(err && (err.message || String(err)) || "Search failed")}</div>`;}).finally(()=>{csrClearInPlaceSearchGuardSoon();});return true;}
function csrInstallCourseSearchSubmitGuard(){if(__csrSubmitGuardBound)return;__csrSubmitGuardBound=true;const onSubmitCapture=(ev)=>{try{const form=csrCourseFormFromEvent(ev);if(!form||form.id!=="course-search-form")return;csrHandleCourseSearchSubmit(ev,"capture-submit");}catch(_){}};const onEnterCapture=(ev)=>{try{if(!csrIsCourseSearchEnter(ev))return;csrHandleCourseSearchSubmit(ev,"enter");}catch(_){}};const onPointerDownCapture=(ev)=>{try{const form=csrCourseFormFromEvent(ev);if(!form||form.id!=="course-search-form")return;if(csrIsSubmitLikeTarget(ev&&ev.target))csrBeginInPlaceSearchGuard(2400);}catch(_){}};window.addEventListener("submit",onSubmitCapture,true);document.addEventListener("submit",onSubmitCapture,true);window.addEventListener("keydown",onEnterCapture,true);document.addEventListener("keydown",onEnterCapture,true);window.addEventListener("pointerdown",onPointerDownCapture,true);document.addEventListener("pointerdown",onPointerDownCapture,true);window.addEventListener("click",onPointerDownCapture,true);document.addEventListener("click",onPointerDownCapture,true);}
function csrCourseSearchEventId(query,course){const q=String(query||"").trim().replace(/\s+/g," ").toLowerCase();const c=String(course||getCourseKeyFromUrl()||"course").trim().toLowerCase();return`course-search-submit-v10:${csrSimpleHash(`${c}:${q}:${Date.now()}:${Math.random().toString(36).slice(2,8)}`)}`;}
function csrFlushXpQueuesSoon(){try{if(window.MkLocalActivity&&typeof window.MkLocalActivity.flushLocalSyncQueue==="function"){window.MkLocalActivity.flushLocalSyncQueue({force:false}).catch(()=>{});}}catch(_){}
try{if(window.MkHotTrack&&typeof window.MkHotTrack.flushLocalSyncQueue==="function"){window.MkHotTrack.flushLocalSyncQueue({force:false});}}catch(_){}}
function csrQueueXpActivity(metric,detail,opts){try{const key="mk_xp_pending_activity_queue_v1";const arr=JSON.parse(localStorage.getItem(key)||"[]");arr.push({metric,details:detail||{},opts:opts||{},queuedAt:Date.now(),source:"course-search-fallback"});localStorage.setItem(key,JSON.stringify(arr.slice(-300)));}catch(_){}}
function csrTrackActivity(metric,details,opts){const m=String(metric||"");const d=details&&typeof details==="object"?details:{};const o=opts&&typeof opts==="object"?opts:{};const xpMetrics={course_search:true,search_suggestion:true,sort_use:true};if(xpMetrics[m]){try{if(window.MkXpActivity&&typeof window.MkXpActivity.record==="function"){if(m==="course_search"&&typeof window.MkXpActivity.recordCourseSearchUsed==="function"){const course=d.course||getCourseKeyFromUrl();const query=String(d.query||d.querySample||"").trim().replace(/\s+/g," ");window.MkXpActivity.recordCourseSearchUsed(Object.assign({source:"course-search-js-submit",eventName:"course-search-submit",query,querySample:query.slice(0,80),queryLength:query.length,course,actionStateVersion:8,actionStateKey:d.actionStateKey||csrCourseSearchEventId(query,course),courseSearchExplicitVersion:10,},d));}else{window.MkXpActivity.record(m,Object.assign({source:"course-search-js",eventName:"course-search-js"},d),o);}
window.setTimeout(csrFlushXpQueuesSoon,120);window.setTimeout(csrFlushXpQueuesSoon,1200);return;}
if(window.MkAccountData&&typeof window.MkAccountData.recordActivity==="function"){window.MkAccountData.recordActivity(m,Object.assign({source:"course-search-js-local"},d),Object.assign({scope:`${m}:${d.actionStateKey || d.query || d.text || d.sort || d.path || Date.now()}`,throttleMs:0},o));return;}}catch(_){}
csrQueueXpActivity(m,Object.assign({source:"course-search-js-queued"},d),Object.assign({scope:`${m}:${d.actionStateKey || d.query || d.text || d.sort || d.path || Date.now()}`,throttleMs:0},o));try{document.dispatchEvent(new CustomEvent("mk:xp-activity",{detail:Object.assign({metric:m},d)}));}catch(_){}
return;}
try{if(window.MkHotTrack&&typeof window.MkHotTrack.trackActivity==="function"){window.MkHotTrack.trackActivity(metric,Object.assign({details:d},o));}}catch(_){}}
let __csrIndexLoadPromise=null;async function loadIndex(){if(__csrIndexLoadPromise)return __csrIndexLoadPromise;const promise=(async()=>{const root=getSiteRootUrl();const candidates=[new URL("search/search_index.json",root).toString(),new URL("search_index.json",root).toString(),];for(const url of candidates){try{const request=__mkFetchSearchIndex(url,{cache:"no-cache"});const j=await request;if(j&&Array.isArray(j.docs))return j;for(const map of[window.__mkSharedJsonPromiseMap,window.__mkMaterialSearchIndexPromises]){if(map&&map[url]===request)delete map[url];}}catch(_){}}
throw new Error("Could not load the course search index. Check your connection and search again.");})();__csrIndexLoadPromise=promise;try{return await promise;}catch(err){if(__csrIndexLoadPromise===promise)__csrIndexLoadPromise=null;throw err;}}
function csrIsIndexPage(loc){const path=csrNormLoc(loc).toLowerCase();const base=(path.split("/").pop()||"");return base==="index.html"||base==="index.md";}
function csrIsUtilityPage(loc){const base=(csrNormLoc(loc).split("/").pop()||"").toLowerCase().replace(/\.html$/i,"");return base==="find"||base==="custom-random"||base==="search"||base==="tags"||base==="trending";}
function csrIsRandomPage(loc){const base=(csrNormLoc(loc).split("/").pop()||"").toLowerCase().replace(/\.html$/i,"");if(base==="random")return true;if(/^random-\d/.test(base))return true;return false;}
function csrIsConceptPageLocation(loc){const path=csrNormLoc(loc);if(!path)return false;if(path.endsWith("/"))return false;const segs=path.split("/").filter(Boolean);if(segs.length<3)return false;if(csrIsIndexPage(path)||csrIsUtilityPage(path)||csrIsRandomPage(path))return false;return true;}
function csrFileTitleFallback(loc){const file=(csrNormLoc(loc).split("/").pop()||"").replace(/\.html$/i,"");return file.replace(/[-_]+/g," ").replace(/\b\w/g,(m)=>m.toUpperCase());}
function csrAggregateDocsToPages(docs){const map=new Map();for(const d of(Array.isArray(docs)?docs:[])){const pageLoc=csrNormLoc(d&&d.location);if(!pageLoc||!csrIsConceptPageLocation(pageLoc))continue;let entry=map.get(pageLoc);if(!entry){entry={location:pageLoc,title:"",tags:new Set(),text:"",};map.set(pageLoc,entry);}
const locFull=String(d&&d.location||"");if(!entry.title&&!locFull.includes("#")&&d&&d.title)entry.title=csrCleanPageTitle(d.title);if(!entry.title&&d&&d.title)entry.title=csrCleanPageTitle(d.title);const txt=String(d&&d.text||"").trim();if(txt)entry.text+=(entry.text?"\n":"")+txt;for(const tg of getTagsFromDoc(d))entry.tags.add(tg);}
return Array.from(map.values()).map((item)=>({location:item.location,title:item.title||csrFileTitleFallback(item.location),tags:Array.from(item.tags),text:item.text||"",}));}
function csrPluralS(w){const s=csrStripPluralS(w);if(!s)return"";if(s.endsWith("s"))return s;return s+"s";}
function csrTokenVariants(tok){const base=String(tok||"").toLowerCase().trim();if(!base)return[];const sing=csrStripPluralS(base);const out=new Set([base,sing,csrPluralS(sing)]);return Array.from(out).filter(Boolean);}
function csrHitInHay(hay,tok){const vars=csrTokenVariants(tok);if(!vars.length)return false;const h=String(hay||"");for(const v of vars){if(v&&h.includes(v))return true;}
return false;}
const __csrHayCache=new Map();function csrHayForPage(p){const loc=String(p&&p.location||"");if(!loc)return"";const cached=__csrHayCache.get(loc);if(cached)return cached;const fileBase=fileBaseFromLocation(loc);const tags=Array.isArray(p&&p.tags)?p.tags.join(" "):String((p&&p.tags)||"");const aliases=Array.isArray(p&&p.aliases)?p.aliases.join(" "):String((p&&p.aliases)||"");const title=String((p&&p.title)||"");const text=String((p&&p.text)||"");const hay=normaliseForSearch(`${fileBase} ${title} ${tags} ${aliases} ${text} ${loc}`);__csrHayCache.set(loc,hay);return hay;}
function csrStrictAnyResult(pages,keyword){const toks=tokeniseQuery(keyword);if(!toks.length)return false;for(const p of pages||[]){const hay=csrHayForPage(p);let ok=true;for(const t of toks){if(!csrHitInHay(hay,t)){ok=false;break;}}
if(ok)return true;}
return false;}
let __csrFuzzyLoadPromise=null;function csrEnsureFuzzyCore(){if(window.__mkFuzzyCore)return Promise.resolve(window.__mkFuzzyCore);if(__csrFuzzyLoadPromise)return __csrFuzzyLoadPromise;__csrFuzzyLoadPromise=new Promise((resolve)=>{const existing=document.querySelector('script[data-mk-fuzzy-core="1"]');if(existing){existing.addEventListener("load",()=>resolve(window.__mkFuzzyCore),{once:true});existing.addEventListener("error",()=>resolve(null),{once:true});return;}
const s=document.createElement("script");s.dataset.mkFuzzyCore="1";s.async=true;s.defer=true;try{s.src=new URL(CSR_FUZZY_CORE_PATH,getSiteRootUrl()).toString();}catch(_){s.src=CSR_FUZZY_CORE_PATH;}
s.onload=()=>resolve(window.__mkFuzzyCore||null);s.onerror=()=>resolve(null);document.head.appendChild(s);});return __csrFuzzyLoadPromise;}
function csrEnsureFuzzyStyles(){}
function csrHideFuzzyNote(){const note=document.getElementById("csr-fuzzy-note");if(!note)return;note.style.display="none";note.innerHTML="";note.removeAttribute("data-csr-fuzzy-payload");}
async function csrTryAutoCorrectOnNoResults(keyword,inCoursePages,courseKey){const core=await csrEnsureFuzzyCore();if(!core||typeof core.suggestPhrase!=="function")return null;const kw=String(keyword||"").trim();if(!kw)return null;const scopeKey="course:"+String(courseKey||"global");try{await core.ensureScope(scopeKey,{pageDocs:inCoursePages,includeBody:true,minFreq:2,maxVocab:9000});}catch(_){}
const sug=await core.suggestPhrase(scopeKey,kw,{pageDocs:inCoursePages,includeBody:true,minFreq:2,maxVocab:9000});if(!sug||!sug.suggested)return null;const to=String(sug.suggested||"").trim().replace(/\s+/g," ");if(!to||to===kw)return null;return{from:kw,to};}
function unitInfoFromTags(tagArr){const tags=Array.isArray(tagArr)?tagArr:[];const withCourse=/^([a-z0-9]+)[-_]?(lecture|week)[-_]?0*(\d+)$/i;const bare=/^(lecture|week)[-_]?0*(\d+)$/i;for(const raw of tags){const t=String(raw||"").trim();let m=t.match(withCourse);if(m){const unitType=String(m[2]||"lecture").toLowerCase();const unitNum=parseInt(m[3],10)||0;const unitNoun=unitNounFromType(unitType);return{courseCode:String(m[1]||"").toLowerCase(),unitType,unitNum,unitLabel:unitNum?`${unitNoun} ${unitNum}`:unitNoun,lectureNum:unitNum,lectureLabel:unitNum?`${unitNoun} ${unitNum}`:unitNoun};}
m=t.match(bare);if(m){const unitType=String(m[1]||"lecture").toLowerCase();const unitNum=parseInt(m[2],10)||0;const unitNoun=unitNounFromType(unitType);return{courseCode:"",unitType,unitNum,unitLabel:unitNum?`${unitNoun} ${unitNum}`:unitNoun,lectureNum:unitNum,lectureLabel:unitNum?`${unitNoun} ${unitNum}`:unitNoun};}}
return null;}
function lectureInfoFromTags(tagArr){return unitInfoFromTags(tagArr);}
function tokeniseQuery(q){return normaliseForSearch(q).split(" ").filter(Boolean);}
function fileBaseFromLocation(location){const loc=safePath(location);const file=(loc.split("/").pop()||"").replace(/\.html$/i,"");return file;}
function getTagsFromDoc(d){const out=[];out.push(...asStringList(d&&d.tags));out.push(...asStringList(d&&d.tag));out.push(...asStringList(d&&d.meta&&d.meta.tags));out.push(...asStringList(d&&d.meta&&d.meta.tag));out.push(...asStringList(d&&d.meta&&d.meta["tags"]));return out.map(s=>String(s).trim()).filter(Boolean);}
function stripPluralS(tok){tok=String(tok||"");if(tok.length<=3)return tok;if(!tok.endsWith("s"))return tok;if(tok.endsWith("ss")||tok.endsWith("us")||tok.endsWith("is")||tok.endsWith("as"))return tok;return tok.slice(0,-1);}
function pluralS(tok){tok=String(tok||"");if(tok.length<=2)return"";if(tok.endsWith("s"))return"";return tok+"s";}
function titleHitRatio(qToks,titleChars){const t=String(titleChars||"");if(!t)return 0;const toks=Array.isArray(qToks)?qToks:[];if(!toks.length)return 0;const marks=new Uint8Array(t.length);for(const raw of toks){const base=String(raw||"");if(!base)continue;const vars=new Set([base,stripPluralS(base)]);const p=pluralS(base);if(p)vars.add(p);for(const v0 of vars){const v=String(v0||"");if(!v)continue;let idx=t.indexOf(v);while(idx!==-1){const end=Math.min(t.length,idx+v.length);for(let i=idx;i<end;i+=1)marks[i]=1;idx=t.indexOf(v,idx+1);}}}
let matched=0;for(let i=0;i<marks.length;i+=1)matched+=marks[i];return matched/Math.max(1,t.length);}
function getScoreFn(){const SCORE_FN_VERSION="alias-max-v4";if(window.__mkScoreDocKeyword&&typeof window.__mkScoreDocKeyword==="function"&&window.__mkScoreDocKeyword.__version===SCORE_FN_VERSION){return window.__mkScoreDocKeyword;}
const cache=new WeakMap();function tokenVariants(t){const base=String(t||"");const vars=new Set();if(base)vars.add(base);const sing=stripPluralS(base);if(sing)vars.add(sing);const p=pluralS(sing||base);if(p)vars.add(p);return Array.from(vars).filter(Boolean);}
function includesAny(hay,vars){const src=String(hay||"");if(!src)return false;for(const v of vars){if(v&&src.includes(v))return true;}
return false;}
function fieldStats(qNorm,fieldNorm){const out={ratio:0,cov:0,exact:false,prefix:false,strong:0,weak:0,mid:0,lenTokens:0,chars:0,};const q=String(qNorm||"");const f=String(fieldNorm||"");if(!q||!f)return out;const qToks=q.split(" ").filter(Boolean);const fToks=f.split(" ").filter(Boolean);out.lenTokens=fToks.length;out.chars=f.replace(/\s+/g,"").length;const fieldSet=new Set(fToks);const fieldSetSing=new Set(fToks.map(stripPluralS));for(const t of qToks){if(!t)continue;const ts=stripPluralS(t);if(fieldSet.has(t)||fieldSetSing.has(ts)){out.strong+=1;continue;}
if(ts.length>=2){for(const ft of fToks){if(!ft)continue;if(ft.startsWith(t)||ft.startsWith(ts)){out.weak+=1;break;}
if(ft.includes(t)||ft.includes(ts)){out.mid+=1;break;}}}}
out.ratio=titleHitRatio(qToks,f.replace(/\s+/g,""))||0;out.cov=out.ratio;out.exact=f===q;if(f.startsWith(q)){const ch=f.length===q.length?"":f.slice(q.length,q.length+1);if(ch===""||ch===" ")out.prefix=true;}
return out;}
function compareFieldStats(a,b){const ar=Number(a&&a.ratio)||0;const br=Number(b&&b.ratio)||0;if(ar!==br)return ar-br;const ae=!!(a&&a.exact);const be=!!(b&&b.exact);if(ae!==be)return ae?1:-1;const ap=!!(a&&a.prefix);const bp=!!(b&&b.prefix);if(ap!==bp)return ap?1:-1;const astr=Number(a&&a.strong)||0;const bstr=Number(b&&b.strong)||0;if(astr!==bstr)return astr-bstr;const aw=Number(a&&a.weak)||0;const bw=Number(b&&b.weak)||0;if(aw!==bw)return aw-bw;const am=Number(a&&a.mid)||0;const bm=Number(b&&b.mid)||0;if(am!==bm)return am-bm;const ac=Number(a&&a.chars)||Number.MAX_SAFE_INTEGER;const bc=Number(b&&b.chars)||Number.MAX_SAFE_INTEGER;if(ac!==bc)return bc-ac;return 0;}
function normDoc(doc){if(!doc||typeof doc!=="object"){return{hay:"",title:"",tags:"",aliases:"",loc:"",file:"",text:"",titleFieldNorm:"",tagItemsNorm:[],aliasItemsNorm:[],};}
const cached=cache.get(doc);if(cached)return cached;const loc=String(doc.location||"");const fileBase=fileBaseFromLocation(loc);const title=String(doc.title||"");const text=String(doc.text||"");const rawTags=Array.isArray(doc.tags)?doc.tags:asStringList(doc.tags);const rawAliases=Array.isArray(doc.rawAliases)?doc.rawAliases:(Array.isArray(doc.aliases)?doc.aliases:asStringList(doc.aliases));const aliasHayList=Array.isArray(doc.aliases)?doc.aliases:rawAliases;const titleNorm=normaliseForSearch(title);const tagsNorm=rawTags.map((x)=>normaliseForSearch(x)).filter(Boolean);const aliasNorm=rawAliases.map((x)=>normaliseForSearch(x)).filter(Boolean);const out={title:titleNorm,tags:normaliseForSearch(rawTags.join(" ")),aliases:normaliseForSearch(aliasHayList.join(" ")),loc:normaliseForSearch(loc),file:normaliseForSearch(fileBase),text:normaliseForSearch(text),hay:"",titleFieldNorm:titleNorm,tagItemsNorm:tagsNorm,aliasItemsNorm:aliasNorm,};out.hay=normaliseForSearch(`${fileBase} ${title} ${rawTags.join(" ")} ${aliasHayList.join(" ")} ${text} ${loc}`);cache.set(doc,out);return out;}
function bestStructuredStats(qNorm,n){let best=fieldStats(qNorm,n.titleFieldNorm||"");best.kind="title";best.value=n.titleFieldNorm||"";for(const item of(n.tagItemsNorm||[])){const cand=fieldStats(qNorm,item);cand.kind="tag";cand.value=item;if(compareFieldStats(cand,best)>0)best=cand;}
for(const item of(n.aliasItemsNorm||[])){const cand=fieldStats(qNorm,item);cand.kind="alias";cand.value=item;if(compareFieldStats(cand,best)>0)best=cand;}
return best;}
function scoreDocKeyword(query,doc){const qNorm=normaliseForSearch(query);const toks=qNorm?qNorm.split(" ").filter(Boolean):[];if(!toks.length)return 0;const n=normDoc(doc);for(const t of toks){const vars=tokenVariants(t);if(!includesAny(n.hay,vars))return 0;}
const best=bestStructuredStats(qNorm,n);const maxCov=Number(best.ratio||best.cov||0);let score=0;if(maxCov>0){score+=Math.round(maxCov*10000);if(best.exact)score+=2500;if(best.prefix)score+=700;score+=(Number(best.strong)||0)*120;score+=(Number(best.weak)||0)*40;score+=(Number(best.mid)||0)*20;score+=Math.max(0,12-Math.min(12,Number(best.lenTokens)||0));}
for(const t of toks){const vars=tokenVariants(t);if(includesAny(n.loc,vars)||includesAny(n.file,vars))score+=120;if(includesAny(n.text,vars))score+=80;}
return score;}
scoreDocKeyword.coverage=(query,doc)=>{try{const n=normDoc(doc);const best=bestStructuredStats(normaliseForSearch(query),n);return Number(best.ratio||best.cov||0);}catch(_){return 0;}};scoreDocKeyword.bestMatch=(query,doc)=>{try{const n=normDoc(doc);return bestStructuredStats(normaliseForSearch(query),n);}catch(_){return{kind:"",value:"",ratio:0,cov:0,exact:false,prefix:false,strong:0,weak:0,mid:0,lenTokens:0,chars:0};}};scoreDocKeyword.__version=SCORE_FN_VERSION;window.__mkScoreDocKeyword=scoreDocKeyword;return scoreDocKeyword;}
function inSameCourseByKey(location,courseKey){const loc=safePath(location);if(!courseKey)return false;return loc.includes("/"+courseKey+"/");}
function csrReadInputHistory(){try{const raw=localStorage.getItem(CSR_INPUT_HISTORY_KEY);const arr=raw?JSON.parse(raw):[];return Array.isArray(arr)?arr.map((x)=>String(x||"").trim()).filter(Boolean):[];}catch(_){return[];}}
function csrWriteInputHistory(arr){try{localStorage.setItem(CSR_INPUT_HISTORY_KEY,JSON.stringify((arr||[]).map((x)=>String(x||"").trim().replace(/\s+/g," ")).filter(Boolean).slice(0,CSR_INPUT_HISTORY_MAX)));}catch(_){}}
function csrAddInputHistory(raw){const s=String(raw||"").trim().replace(/\s+/g," ");if(!s)return;const curr=csrReadInputHistory();const next=[s,...curr.filter((x)=>x.toLowerCase()!==s.toLowerCase())];csrWriteInputHistory(next);}
function csrRemoveInputHistory(raw){const s=String(raw||"").trim();if(!s)return;csrWriteInputHistory(csrReadInputHistory().filter((x)=>x.toLowerCase()!==s.toLowerCase()));}
function csrClearInputHistory(){csrWriteInputHistory([]);}
function csrMarkAssistInteraction(){__csrAssistUi.suppressBlurHideUntil=Date.now()+280;}
function csrGetAssistDropdown(){const form=csrGetSearchForm();return form?form.querySelector(".csr-courseassist-dropdown"):null;}
function csrGetAssistRows(){const dd=csrGetAssistDropdown();return dd?Array.from(dd.querySelectorAll(".csr-courseassist-item")):[];}
function csrHasOpenAssistDropdown(){const dd=csrGetAssistDropdown();return!!(dd&&dd.style.display!=="none"&&dd.children&&dd.children.length);}
function csrEnsureCourseAssistStyles(){}
function csrEnsureCourseAssistUi(form,input){csrEnsureCourseAssistStyles();if(!form||!input)return null;let dd=form.querySelector(".csr-courseassist-dropdown");if(!dd){dd=document.createElement("div");dd.className="csr-courseassist-dropdown";dd.setAttribute("role","listbox");dd.style.display="none";form.appendChild(dd);}
csrSyncAssistGeometry();return dd;}
function csrSetStyleIfChanged(el,name,value){try{if(el&&el.style&&el.style.getPropertyValue(name)!==String(value)){el.style.setProperty(name,String(value));}}catch(_){}}
function csrRemoveStyleIfPresent(el,name){try{if(el&&el.style&&el.style.getPropertyValue(name)!=="")el.style.removeProperty(name);}catch(_){}}
function csrSyncAssistMetrics(){const form=csrGetSearchForm();const input=csrGetSearchInput();if(!form||!input)return;try{const submitBtn=form.querySelector('button[type="submit"], button:not([type]), input[type="submit"]');const h1=Math.round(input.getBoundingClientRect().height||input.offsetHeight||0);const h2=submitBtn?Math.round(submitBtn.getBoundingClientRect().height||submitBtn.offsetHeight||0):0;const h=Math.max(44,h1,h2);csrSetStyleIfChanged(form,"--csr-assist-row-h",h+"px");}catch(_){}}
function csrSyncAssistGeometry(){const form=csrGetSearchForm();const input=csrGetSearchInput();const dd=csrGetAssistDropdown();if(!form||!input||!dd)return;try{const formRect=form.getBoundingClientRect();const inputRect=input.getBoundingClientRect();const left=Math.max(0,Math.round(inputRect.left-formRect.left));const top=Math.max(0,Math.round(inputRect.bottom-formRect.top-1));const width=Math.max(0,Math.round(inputRect.width));if(width>=120){dd.style.left=left+"px";dd.style.width=width+"px";dd.style.right="auto";}
dd.style.top=top+"px";}catch(_){}}
function csrGetDesktopTopChromeBottom(){if(!csrIsDesktopAssistViewport())return 0;let topBottom=0;try{const seen=new Set();const nodes=document.querySelectorAll('.md-header, .md-tabs, [data-md-component="header"], [data-md-component="tabs"]');nodes.forEach((node)=>{if(!node||seen.has(node))return;seen.add(node);const cs=window.getComputedStyle?window.getComputedStyle(node):null;if(!cs||cs.display==='none'||cs.visibility==='hidden')return;const pos=String(cs.position||'').toLowerCase();if(pos!=='fixed'&&pos!=='sticky')return;const rect=node.getBoundingClientRect();if(!rect||rect.height<=0||rect.width<=0)return;topBottom=Math.max(topBottom,Math.round(rect.bottom));});}catch(_){}
return Math.max(0,topBottom);}
function csrSyncAssistViewportClip(){const dd=csrGetAssistDropdown();if(!dd)return;if(dd.style.display==='none'){dd.style.clipPath='';dd.style.webkitClipPath='';return;}
if(!csrIsDesktopAssistViewport()){dd.style.clipPath='';dd.style.webkitClipPath='';return;}
try{const topChromeBottom=csrGetDesktopTopChromeBottom();const rect=dd.getBoundingClientRect();if(!rect||rect.height<=0){dd.style.clipPath='';dd.style.webkitClipPath='';return;}
const overlap=Math.max(0,Math.ceil(topChromeBottom-rect.top));if(overlap<=0){dd.style.clipPath='';dd.style.webkitClipPath='';return;}
const insetTop=Math.min(Math.max(0,overlap),Math.max(0,Math.ceil(rect.height-2)));const clipValue=`inset(${insetTop}px 0 0 0 round 22px)`;dd.style.clipPath=clipValue;dd.style.webkitClipPath=clipValue;}catch(_){dd.style.clipPath='';dd.style.webkitClipPath='';}}
function csrSetAssistActiveIndex(idx){const rows=csrGetAssistRows();if(!rows.length){__csrAssistUi.activeIndex=-1;return;}
let next=Number.isFinite(idx)?Math.trunc(idx):-1;if(next<0||next>=rows.length)next=-1;__csrAssistUi.activeIndex=next;rows.forEach((row,i)=>row.classList.toggle("is-active",i===next));if(next>=0){try{rows[next].scrollIntoView({block:"nearest"});}catch(_){}}}
function csrHideAssistDropdown(){const dd=csrGetAssistDropdown();if(!dd)return;dd.style.display="none";dd.innerHTML="";__csrAssistUi.items=[];__csrAssistUi.lastNoteFix="";csrSetAssistActiveIndex(-1);}
function csrApplyAssistChoice(text,opts){csrTrackActivity("search_suggestion",{text:String(text||"").slice(0,120)},{scope:"search_suggestion:"+String(text||"").slice(0,80),throttleMs:30000});const input=csrGetSearchInput();if(!input)return;const next=String(text||"").trim();if(!next)return;input.value=next;__csrAssistUi.lastApplied=next;try{input.focus();const end=next.length;if(typeof input.setSelectionRange==="function")input.setSelectionRange(end,end);}catch(_){}
csrHideAssistDropdown();csrSyncAssistGeometry();if(opts&&opts.refresh){csrRefreshAssistSoon(0);}}
async function csrLoadAssistScope(){const courseKey=getCourseKeyFromUrl();if(__csrAssistUi.scopePromise&&__csrAssistUi.scopeCacheKey===courseKey){return __csrAssistUi.scopePromise;}
__csrAssistUi.scopeCacheKey=courseKey;const promise=(async()=>{const indexJson=await loadIndex();const docs=indexJson.docs||[];const pages=csrAggregateDocsToPages(docs).filter((p)=>inSameCourseByKey(p.location,courseKey)).map((p)=>{const lec=lectureInfoFromTags(Array.isArray(p.tags)?p.tags:[]);return{...p,lectureText:lec?(lec.unitLabel||`Lecture ${lec.lectureNum}`):"",};});return pages;})();__csrAssistUi.scopePromise=promise;try{return await promise;}catch(err){if(__csrAssistUi.scopePromise===promise)__csrAssistUi.scopePromise=null;throw err;}}
function csrFindAssistMatches(pages,keyword,maxItems){const scoreDocKeyword=getScoreFn();const limit=Math.max(4,Number(maxItems)||8);return(pages||[]).map((p,i)=>({page:p,score:scoreDocKeyword(keyword,p),cov:(scoreDocKeyword.coverage?scoreDocKeyword.coverage(keyword,p):0),i,})).filter((x)=>x.score>0).sort((a,b)=>(b.score-a.score)||((b.cov||0)-(a.cov||0))||String(a.page.title||"").localeCompare(String(b.page.title||""))).slice(0,limit).map((x)=>({kind:"suggest",text:String(x.page.title||""),meta:String(x.page.lectureText||""),location:String(x.page.location||""),}));}
async function csrBuildAssistState(raw,maxItems){const q=String(raw||"").trim().replace(/\s+/g," ");const limit=Math.max(4,Number(maxItems)||8);const pages=await csrLoadAssistScope();if(!q){const items=csrReadInputHistory().slice(0,limit).map((text)=>({kind:"history",text,}));return{items,noteFix:"",noteHtml:""};}
let effective=q;let items=csrFindAssistMatches(pages,q,limit);const strictAny=csrStrictAnyResult(pages,q);let noteFix="";let noteHtml="";if((!strictAny||!items.length)&&q){try{const fix=await csrTryAutoCorrectOnNoResults(q,pages,getCourseKeyFromUrl());if(fix&&fix.to&&fix.to.toLowerCase()!==q.toLowerCase()){effective=fix.to;noteFix=fix.to;items=csrFindAssistMatches(pages,effective,limit);noteHtml=`No exact matches for <strong>${escapeHtml(q)}</strong>`+` <span aria-hidden="true">·</span> Showing suggestions for <em>${escapeHtml(effective)}</em>`;}}catch(_){}}
return{items,noteFix,noteHtml};}
function csrRenderAssistDropdown(items,opts){const dd=csrGetAssistDropdown();if(!dd)return;const rows=Array.isArray(items)?items:[];const noteHtml=opts&&opts.noteHtml?String(opts.noteHtml):"";const noteFix=opts&&opts.noteFix?String(opts.noteFix):"";if(!rows.length&&!noteHtml){csrHideAssistDropdown();return;}
dd.innerHTML="";__csrAssistUi.items=rows.slice();__csrAssistUi.lastNoteFix=noteFix;if(noteHtml){const note=document.createElement("div");note.className="csr-courseassist-note";note.innerHTML=noteHtml;if(noteFix){note.tabIndex=-1;const applyNote=(ev)=>{csrMarkAssistInteraction();if(ev){ev.preventDefault();ev.stopPropagation();}
csrApplyAssistChoice(noteFix,{refresh:true});};note.addEventListener("pointerdown",applyNote,true);note.addEventListener("mousedown",applyNote,true);note.addEventListener("click",applyNote);}
dd.appendChild(note);}
for(const item of rows){const row=document.createElement("div");row.className="csr-courseassist-item";row.setAttribute("role","option");row.tabIndex=-1;row.dataset.csrValue=String(item.text||"");if(item.kind==="history")row.classList.add("is-history");const main=document.createElement("div");main.className="csr-courseassist-main";main.innerHTML=escapeHtml(item.text||"");row.appendChild(main);if(item.kind==="history"){const del=document.createElement("button");del.type="button";del.className="csr-courseassist-del";del.setAttribute("aria-label","Remove");del.textContent="×";del.addEventListener("pointerdown",(ev)=>{csrMarkAssistInteraction();ev.preventDefault();ev.stopPropagation();},true);del.addEventListener("click",(ev)=>{ev.preventDefault();ev.stopPropagation();csrRemoveInputHistory(item.text||"");csrRefreshAssistSoon(0);});row.appendChild(del);}else{const meta=document.createElement("div");meta.className="csr-courseassist-meta";meta.textContent=String(item.meta||"");row.appendChild(meta);}
const pick=(ev)=>{if(ev&&ev.target&&ev.target.closest&&ev.target.closest(".csr-courseassist-del"))return;csrMarkAssistInteraction();if(ev){ev.preventDefault();ev.stopPropagation();}
csrApplyAssistChoice(item.text||"",{refresh:false});};row.addEventListener("pointerdown",pick,true);row.addEventListener("mousedown",pick,true);row.addEventListener("click",pick);dd.appendChild(row);}
if(!String(csrGetSearchInput()&&csrGetSearchInput().value||"").trim()&&rows.some((item)=>item&&item.kind==="history")){const footer=document.createElement("div");footer.className="csr-courseassist-footer";const clear=document.createElement("button");clear.type="button";clear.className="csr-courseassist-clear";clear.textContent="Clear history";clear.addEventListener("pointerdown",(ev)=>{csrMarkAssistInteraction();ev.preventDefault();ev.stopPropagation();},true);clear.addEventListener("click",(ev)=>{ev.preventDefault();ev.stopPropagation();csrClearInputHistory();csrRefreshAssistSoon(0);});footer.appendChild(clear);dd.appendChild(footer);}
dd.style.display="block";dd.style.visibility="hidden";csrSyncAssistGeometry();csrSyncAssistViewportClip();csrSetAssistActiveIndex(-1);Promise.resolve(typesetMathAsync(dd)).finally(()=>{if(!dd||dd!==csrGetAssistDropdown())return;dd.style.visibility="visible";csrSyncAssistGeometry();csrSyncAssistViewportClip();});}
async function csrRefreshAssistUiNow(){const input=csrGetSearchInput();const dd=csrGetAssistDropdown();if(!input||!dd)return;const seq=++__csrAssistUi.requestSeq;const value=String(input.value||"");const page=window.location.pathname;const current=()=>seq===__csrAssistUi.requestSeq&&page===window.location.pathname&&input===csrGetSearchInput()&&dd===csrGetAssistDropdown()&&input.isConnected!==false&&String(input.value||"")===value;try{const state=await csrBuildAssistState(value,8);if(!current())return;csrRenderAssistDropdown(state.items,state);}catch(_){if(!current())return;csrHideAssistDropdown();}}
function csrRefreshAssistSoon(delay){window.clearTimeout(__csrAssistUi.timer||0);__csrAssistUi.timer=window.setTimeout(()=>{csrRefreshAssistUiNow();},Math.max(0,Number(delay)||0));}
function csrEnsureAssistBinding(form,input){if(!form||!input||form.dataset.csrAssistBound==="1")return;form.dataset.csrAssistBound="1";input.setAttribute("autocomplete","off");input.setAttribute("autocapitalize","off");input.setAttribute("spellcheck","false");input.addEventListener("focus",()=>{csrSyncAssistGeometry();csrRefreshAssistSoon(0);try{const clearBtn=document.getElementById("csr-mobile-clear");if(clearBtn&&typeof clearBtn.__csrSync==="function")clearBtn.__csrSync();}catch(_){}},{passive:true});input.addEventListener("click",()=>{csrProtectCourseSearchFocus(700);csrSyncAssistGeometry();csrRefreshAssistSoon(0);try{const clearBtn=document.getElementById("csr-mobile-clear");if(clearBtn&&typeof clearBtn.__csrSync==="function")clearBtn.__csrSync();}catch(_){}},{passive:true});input.addEventListener("focus",()=>{csrProtectCourseSearchFocus(850);csrBeginInPlaceSearchGuard(1800);csrKeepMobileSearchBackdropHidden(1800);csrCloseMaterialSearchOverlayForCourseSearch();},true);form.addEventListener("pointerdown",()=>{csrProtectCourseSearchFocus(850);csrBeginInPlaceSearchGuard(1600);csrKeepMobileSearchBackdropHidden(1600);},true);input.addEventListener("input",()=>{csrHideFuzzyNote();__csrAssistUi.lastApplied=String(input.value||"");csrRefreshAssistSoon(0);});input.addEventListener("blur",()=>{window.setTimeout(()=>{if(Date.now()<(__csrAssistUi.suppressBlurHideUntil||0))return;csrHideAssistDropdown();try{const clearBtn=document.getElementById("csr-mobile-clear");if(clearBtn&&typeof clearBtn.__csrSync==="function")clearBtn.__csrSync();}catch(_){}},90);});input.addEventListener("keydown",(ev)=>{if(ev.isComposing||ev.keyCode===229)return;const dd=csrGetAssistDropdown();const visible=!!(dd&&dd.style.display!=="none"&&dd.children.length);const items=Array.isArray(__csrAssistUi.items)?__csrAssistUi.items:[];let idx=Number(__csrAssistUi.activeIndex);if(!Number.isFinite(idx))idx=-1;if(!visible){if(ev.key==="ArrowDown"){csrRefreshAssistSoon(0);}else if(ev.key==="Escape"){csrHideAssistDropdown();}
return;}
if(ev.key==="ArrowDown"){ev.preventDefault();ev.stopPropagation();idx=Math.min(items.length-1,idx+1);csrSetAssistActiveIndex(idx);return;}
if(ev.key==="ArrowUp"){ev.preventDefault();ev.stopPropagation();idx=Math.max(-1,idx-1);csrSetAssistActiveIndex(idx);return;}
if(ev.key==="Enter"&&idx>=0&&items[idx]){ev.preventDefault();ev.stopPropagation();csrApplyAssistChoice(items[idx].text||"",{refresh:false});return;}
if(ev.key==="Escape"){ev.preventDefault();ev.stopPropagation();csrHideAssistDropdown();}});if(!__csrAssistUi.outsideClickBound){__csrAssistUi.outsideClickBound=true;document.addEventListener("click",(ev)=>{const ddNow=csrGetAssistDropdown();const formNow=csrGetSearchForm();if(!ddNow||!formNow||ddNow.style.display==="none")return;if(formNow.contains(ev.target))return;csrHideAssistDropdown();},true);}
if(!__csrAssistUi.resizeBound){__csrAssistUi.resizeBound=true;window.addEventListener("resize",()=>{csrSyncAssistMetrics();csrSyncAssistGeometry();csrSyncAssistViewportClip();},{passive:true});}
if(!__csrAssistUi.scrollBound){__csrAssistUi.scrollBound=true;window.addEventListener("scroll",()=>{if(!csrHasOpenAssistDropdown())return;csrSyncAssistGeometry();csrSyncAssistViewportClip();},{passive:true,capture:true});}}
function csrUnitNounFromItems(items){let week=0;let lecture=0;(Array.isArray(items)?items:[]).forEach((item)=>{const info=unitInfoFromTags(item&&item.tags);if(info&&info.unitType==="week")week+=1;else if(info)lecture+=1;else{const meta=String(item&&item.meta||"").toLowerCase();if(/\bweek\b/.test(meta))week+=1;else if(/\blecture\b/.test(meta))lecture+=1;}});return week>lecture?"Week":"Lecture";}
function csrCurrentUnitNoun(){return csrUnitNounFromItems(CSR_STATE.items);}
function getSortedItems(items){const dir=CSR_STATE.sortDir==="desc"?-1:1;const key=CSR_STATE.sortKey||"best";const arr=items.slice();arr.sort((a,b)=>{const ta=String(a.title||"");const tb=String(b.title||"");if(key==="views30d"){const va=csrViewsCountFor(a);const vb=csrViewsCountFor(b);if(vb!==va)return vb-va;const sa=Number(a.score)||0;const sb=Number(b.score)||0;if(sb!==sa)return sb-sa;const ca=Number(a.cov)||0;const cb=Number(b.cov)||0;if(cb!==ca)return cb-ca;const pa=yearCourseFromLocation(a.location);const pb=yearCourseFromLocation(b.location);const ya=yearOrderFromFolder(pa.year);const yb=yearOrderFromFolder(pb.year);if(ya!==yb)return ya-yb;const oa=courseOrderFromFolder(pa.course);const ob=courseOrderFromFolder(pb.course);if(oa!==ob)return oa-ob;const laNum=lectureInfoFromTags(a.tags)?.lectureNum||0;const lbNum=lectureInfoFromTags(b.tags)?.lectureNum||0;if(laNum!==lbNum)return laNum-lbNum;const c1=ta.localeCompare(tb,undefined,{sensitivity:"base"});if(c1!==0)return c1;const la=String(a.location||"");const lb=String(b.location||"");const c2=la.localeCompare(lb,undefined,{sensitivity:"base"});if(c2!==0)return c2;return(Number(a.__i)||0)-(Number(b.__i)||0);}
if(key!=="title"&&key!=="lecture"){const sa=Number(a.score)||0;const sb=Number(b.score)||0;if(sb!==sa)return sb-sa;const ca=Number(a.cov)||0;const cb=Number(b.cov)||0;if(cb!==ca)return cb-ca;const pa=yearCourseFromLocation(a.location);const pb=yearCourseFromLocation(b.location);const ya=yearOrderFromFolder(pa.year);const yb=yearOrderFromFolder(pb.year);if(ya!==yb)return ya-yb;const oa=courseOrderFromFolder(pa.course);const ob=courseOrderFromFolder(pb.course);if(oa!==ob)return oa-ob;const laNum=lectureInfoFromTags(a.tags)?.lectureNum||0;const lbNum=lectureInfoFromTags(b.tags)?.lectureNum||0;if(laNum!==lbNum)return laNum-lbNum;const c1=ta.localeCompare(tb,undefined,{sensitivity:"base"});if(c1!==0)return c1;const la=String(a.location||"");const lb=String(b.location||"");const c2=la.localeCompare(lb,undefined,{sensitivity:"base"});if(c2!==0)return c2;return(Number(a.__i)||0)-(Number(b.__i)||0);}
if(key==="lecture"){const pa=yearCourseFromLocation(a.location);const pb=yearCourseFromLocation(b.location);const ya=yearOrderFromFolder(pa.year);const yb=yearOrderFromFolder(pb.year);if(ya!==yb)return(ya-yb)*dir;const oa=courseOrderFromFolder(pa.course);const ob=courseOrderFromFolder(pb.course);if(oa!==ob)return(oa-ob)*dir;const laNum=lectureInfoFromTags(a.tags)?.lectureNum||0;const lbNum=lectureInfoFromTags(b.tags)?.lectureNum||0;if(laNum!==lbNum)return(laNum-lbNum)*dir;return ta.localeCompare(tb,undefined,{sensitivity:"base"})*dir;}
const c=ta.localeCompare(tb,undefined,{sensitivity:"base"});if(c!==0)return c*dir;return(Number(a.__i)||0)-(Number(b.__i)||0);});return arr;}
function syncResultsWidthToSearchBar(out){try{const form=document.getElementById("course-search-form");const wrap=out.querySelector(".csr-wrap");if(!form||!wrap)return;const formRect=form.getBoundingClientRect();const outRect=out.getBoundingClientRect();const w=Math.round(formRect.width);const dx=Math.round(formRect.left-outRect.left);if(!w||w<200)return;wrap.style.boxSizing="border-box";wrap.style.width=`${w}px`;wrap.style.maxWidth=`${w}px`;wrap.style.position="static";wrap.style.left="";wrap.style.marginLeft=`${Math.max(0, dx)}px`;wrap.style.marginRight="0";}catch(_){}}
function renderPager(){const total=CSR_STATE.items.length;const pageSize=CSR_STATE.pageSize;const totalPages=Math.max(1,Math.ceil(total/pageSize));const page=Math.min(Math.max(1,CSR_STATE.page),totalPages);const prevDisabled=page<=1?"disabled":"";const nextDisabled=page>=totalPages?"disabled":"";const btns=buildPageButtons(totalPages,page).map(x=>{if(x==="…")return`<span class="csr-page-ellipsis">…</span>`;const n=x;const active=n===page?"is-active":"";return`<button type="button" class="csr-page ${active}" data-page="${n}">${n}</button>`;}).join("");return`
      <div class="csr-pager">
        <button type="button" class="md-button csr-prev" aria-label="Previous page" ${prevDisabled}>
          <span class="csr-pagerbtn__ico" aria-hidden="true">${csrSvg("left", 18)}</span>
          <span class="csr-pagerbtn__txt">Prev</span>
        </button>
        <div class="csr-pages">${btns}</div>
        <button type="button" class="md-button csr-next" aria-label="Next page" ${nextDisabled}>
          <span class="csr-pagerbtn__ico" aria-hidden="true">${csrSvg("right", 18)}</span>
          <span class="csr-pagerbtn__txt">Next</span>
        </button>
      </div>
    `;}
let __csrViews30dPromise=null;let __csrViews30dMap=null;function csrReadViewsCache(){try{const raw=sessionStorage.getItem(CSR_VIEWS_CACHE_KEY);if(!raw)return null;const obj=JSON.parse(raw);if(!obj||typeof obj!=="object")return null;const ts=Number(obj.ts)||0;if(!ts||(Date.now()-ts)>CSR_VIEWS_CACHE_TTL_MS)return null;const items=obj.items&&typeof obj.items==="object"?obj.items:null;if(!items)return null;return items;}catch(_){return null;}}
function csrWriteViewsCache(mapObj){try{sessionStorage.setItem(CSR_VIEWS_CACHE_KEY,JSON.stringify({ts:Date.now(),items:mapObj||{}}));}catch(_){}}
async function csrFetchHot({metric,period,limit,offset}){const url=new URL(CSR_VIEWS_API_BASE+"/hot");url.searchParams.set("metric",metric);url.searchParams.set("period",period);url.searchParams.set("limit",String(limit));url.searchParams.set("offset",String(offset));const resp=await fetch(url.toString()).catch(()=>null);const data=resp?await resp.json().catch(()=>null):null;return{items:data&&Array.isArray(data.items)?data.items:[],total:data&&typeof data.total==="number"?data.total:0,};}
async function csrLoadViews30dMapOnce(){if(typeof window!=="undefined"&&window.__mkExamMode)return new Map();if(__csrViews30dMap)return __csrViews30dMap;if(__csrViews30dPromise)return __csrViews30dPromise;const cached=csrReadViewsCache();if(cached){const m=new Map();for(const k of Object.keys(cached))m.set(csrNormPath(k),Number(cached[k])||0);__csrViews30dMap=m;return m;}
__csrViews30dPromise=(async()=>{const limit=80;let offset=0;let guard=0;const maxPages=60;const m=new Map();while(guard<maxPages){guard+=1;const chunk=await csrFetchHot({metric:"views",period:"30d",limit,offset});const arr=chunk.items||[];if(!arr.length)break;for(const it of arr){const p=csrNormPath(it&&it.path);if(!p)continue;const c=Number(it&&it.count)||0;if(!m.has(p))m.set(p,c);}
offset+=arr.length;if(chunk.total&&offset>=chunk.total)break;if(arr.length<limit)break;}
try{const obj={};for(const[k,v]of m.entries())obj[k]=v;csrWriteViewsCache(obj);}catch(_){}
__csrViews30dMap=m;return m;})();return __csrViews30dPromise;}
function csrSortLabel(){const key=CSR_STATE.sortKey||"best";const dir=CSR_STATE.sortDir||"desc";if(key==="best")return"Most relevant";if(key==="views30d")return"Most viewed (30d)";if(key==="lecture"&&dir==="asc")return`Course · ${csrCurrentUnitNoun()} ↑`;if(key==="lecture"&&dir==="desc")return`Course · ${csrCurrentUnitNoun()} ↓`;if(key==="title"&&dir==="asc")return"Title A → Z";if(key==="title"&&dir==="desc")return"Title Z → A";return"Most relevant";}
function csrIsActiveOption(optId){const s=csrSortKeyDirFromOption(optId);return(CSR_STATE.sortKey||"best")===s.key&&(CSR_STATE.sortDir||"desc")===s.dir;}
function csrRenderSortDropdownHtml(){const label=csrSortLabel();const opts=[{id:"best",label:"Most relevant",icon:"target"},{id:"views30d",label:"Most viewed (30d)",icon:"fire"},{id:"lecture-asc",label:`Course · ${csrCurrentUnitNoun()} ↑`,icon:"up"},{id:"lecture-desc",label:`Course · ${csrCurrentUnitNoun()} ↓`,icon:"down"},{id:"title-asc",label:"Title A → Z",icon:"az"},{id:"title-desc",label:"Title Z → A",icon:"za"},];const menu=opts.map(o=>{const active=csrIsActiveOption(o.id)?"is-active":"";return`
      <button type="button" class="mk-sortopt ${active}" data-mk-sort="${o.id}">
        <span class="mk-sortopt__ico">${csrSvg(o.icon, 18)}</span>
        <span class="mk-sortopt__txt">${o.label}</span>
      </button>
    `.trim();}).join("");return`
    <div class="mk-sort" data-mk-sort-root="1">
      <button type="button" class="mk-sortbtn" aria-haspopup="listbox" aria-expanded="false">
        <span class="mk-sortbtn__ico">${csrSvg("sort", 18)}</span>
        <span class="mk-sortbtn__txt">Sort</span>
        <span class="mk-sortbtn__val">${label}</span>
        <span class="mk-sortbtn__chev">${csrSvg("chev", 18)}</span>
      </button>
      <div class="mk-sortmenu" role="listbox" hidden>
        ${menu}
      </div>
    </div>
  `.trim();}
function csrEnsureSortDropdownStylesOnce(){if(document.getElementById("mk-sortdropdown-style-v1"))return;const st=document.createElement("style");st.id="mk-sortdropdown-style-v1";st.textContent=`
    .mk-sort{ position:relative; display:inline-flex; max-width:100%; }
    .mk-sortbtn{
      appearance:none;
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:6px 10px;
      border-radius:999px;
      border:1px solid var(--md-default-fg-color--lightest);
      background: rgba(0,0,0,.02);
      color: inherit;
      font: inherit;
      cursor:pointer;
      user-select:none;
      max-width:100%;
    }
    [data-md-color-scheme="slate"] .mk-sortbtn{ background: rgba(255,255,255,.04); }
    .mk-sortbtn:hover{ border-color: rgba(99,102,241,.45); background: rgba(99,102,241,.06); }
    .mk-sortbtn__ico, .mk-sortbtn__chev{ display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; opacity:.85; flex:0 0 auto; color: inherit; }
    .mk-sortbtn__txt{ font-weight:650; opacity:.85; }
    .mk-sortbtn__val{
      font-weight:750;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      max-width:min(40vw, 320px);
    }
    .mk-sortbtn[aria-expanded="true"] .mk-sortbtn__chev{ transform: rotate(180deg); }

    .mk-sortmenu{
      position:absolute;
      left:0;
      top: calc(100% + 8px);
      min-width: 260px;
      max-width: min(92vw, 340px);
      padding:6px;
      border-radius:14px;
      border:1px solid var(--md-default-fg-color--lightest);
      background: var(--md-default-bg-color);
      box-shadow: 0 14px 38px rgba(0,0,0,.18);
      z-index: 90;
    }
    [data-md-color-scheme="slate"] .mk-sortmenu{ background: rgba(24,24,24,.98); }

    .mk-sortopt{
      width:100%;
      appearance:none;
      border:0;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor:pointer;
      display:flex;
      align-items:center;
      gap:10px;
      padding:8px 10px;
      border-radius:12px;
      text-align:left;
    }
    .mk-sortopt__ico{ width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center; opacity:.88; flex:0 0 auto; color: inherit; }
    .mk-sortopt:hover{ background: rgba(0,0,0,.06); }
    [data-md-color-scheme="slate"] .mk-sortopt:hover{ background: rgba(255,255,255,.08); }
    .mk-sortopt.is-active{
      background: rgba(99,102,241,.10);
      box-shadow: inset 0 0 0 1px rgba(99,102,241,.22);
    }

    .csr-colheads{
      margin-top: 2px;
      display:flex;
      align-items:flex-end;
      gap: 18px;
      width:100%;
    }
    .csr-colhead{
      opacity:.82;
      font-weight:650;
      white-space:nowrap;
    }
    .csr-colhead--right{
      margin-left:auto;
      justify-self:end;
      text-align:right;
    }

    .csr-prev,
    .csr-next{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:10px;
    }
    .csr-pagerbtn__ico{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:18px;
      height:18px;
      flex:0 0 auto;
      line-height:1;
      color: inherit;
    }
    .csr-pagerbtn__ico svg{
      display:block;
      width:18px;
      height:18px;
    }

    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn,
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt,
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit,
    html[data-md-color-scheme="slate"] .course-search .csr-prev,
    html[data-md-color-scheme="slate"] .course-search .csr-next,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn,
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt,
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit,
    body[data-md-color-scheme="slate"] .course-search .csr-prev,
    body[data-md-color-scheme="slate"] .course-search .csr-next{
      color: rgba(255,255,255,.94) !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn__ico,
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn__chev,
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt__ico,
    html[data-md-color-scheme="slate"] .course-search .csr-pagerbtn__ico,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn__ico,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn__chev,
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt__ico,
    body[data-md-color-scheme="slate"] .course-search .csr-pagerbtn__ico{
      color: rgba(255,255,255,.94) !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg,
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt svg,
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg,
    html[data-md-color-scheme="slate"] .course-search .csr-prev svg,
    html[data-md-color-scheme="slate"] .course-search .csr-next svg,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg,
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt svg,
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg,
    body[data-md-color-scheme="slate"] .course-search .csr-prev svg,
    body[data-md-color-scheme="slate"] .course-search .csr-next svg{
      color: rgba(255,255,255,.96) !important;
      fill: none !important;
      stroke: none !important;
      filter: none !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn__ico svg *,
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn__chev svg *,
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt__ico svg *,
    html[data-md-color-scheme="slate"] .course-search .csr-pagerbtn__ico svg *,
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg *,
    html[data-md-color-scheme="slate"] .course-search .csr-prev svg *,
    html[data-md-color-scheme="slate"] .course-search .csr-next svg *,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn__ico svg *,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn__chev svg *,
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt__ico svg *,
    body[data-md-color-scheme="slate"] .course-search .csr-pagerbtn__ico svg *,
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg *,
    body[data-md-color-scheme="slate"] .course-search .csr-prev svg *,
    body[data-md-color-scheme="slate"] .course-search .csr-next svg *{
      color: #fff !important;
      filter: none !important;
      opacity: 1 !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [stroke],
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [stroke],
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [stroke],
    html[data-md-color-scheme="slate"] .course-search .csr-prev svg [stroke],
    html[data-md-color-scheme="slate"] .course-search .csr-next svg [stroke],
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [stroke],
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [stroke],
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [stroke],
    body[data-md-color-scheme="slate"] .course-search .csr-prev svg [stroke],
    body[data-md-color-scheme="slate"] .course-search .csr-next svg [stroke]{
      stroke: currentColor !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [fill]:not([fill="none"]),
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [fill]:not([fill="none"]),
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [fill]:not([fill="none"]),
    html[data-md-color-scheme="slate"] .course-search .csr-prev svg [fill]:not([fill="none"]),
    html[data-md-color-scheme="slate"] .course-search .csr-next svg [fill]:not([fill="none"]),
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [fill]:not([fill="none"]),
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [fill]:not([fill="none"]),
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [fill]:not([fill="none"]),
    body[data-md-color-scheme="slate"] .course-search .csr-prev svg [fill]:not([fill="none"]),
    body[data-md-color-scheme="slate"] .course-search .csr-next svg [fill]:not([fill="none"]){
      fill: currentColor !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [fill="none"],
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [fill="none"],
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [fill="none"],
    html[data-md-color-scheme="slate"] .course-search .csr-prev svg [fill="none"],
    html[data-md-color-scheme="slate"] .course-search .csr-next svg [fill="none"],
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [fill="none"],
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [fill="none"],
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [fill="none"],
    body[data-md-color-scheme="slate"] .course-search .csr-prev svg [fill="none"],
    body[data-md-color-scheme="slate"] .course-search .csr-next svg [fill="none"]{
      fill: none !important;
    }

    @media (max-width: 720px){
      .csr-prev,
      .csr-next{
        gap:0;
        min-width:52px;
        padding-left:12px;
        padding-right:12px;
      }
      .csr-prev .csr-pagerbtn__txt,
      .csr-next .csr-pagerbtn__txt{
        display:none;
      }
    }
  `.trim();document.head.appendChild(st);}
function csrSetSortExplicit(key,dir){CSR_STATE.sortKey=key;CSR_STATE.sortDir=dir;CSR_STATE.page=1;}
function csrCloseMenu(root){if(!root)return;const btn=root.querySelector(".mk-sortbtn");const menu=root.querySelector(".mk-sortmenu");if(menu)menu.hidden=true;if(btn)btn.setAttribute("aria-expanded","false");}
function csrToggleMenu(root){if(!root)return;const btn=root.querySelector(".mk-sortbtn");const menu=root.querySelector(".mk-sortmenu");if(!btn||!menu)return;const isOpen=btn.getAttribute("aria-expanded")==="true";if(isOpen){csrCloseMenu(root);}else{document.querySelectorAll('.mk-sort[data-mk-sort-root="1"]').forEach(el=>{if(el!==root)csrCloseMenu(el);});menu.hidden=false;btn.setAttribute("aria-expanded","true");}}
function csrEnsureSortDropdownBinding(out){if(!out||out.dataset.csrSortDdBound==="1")return;out.dataset.csrSortDdBound="1";out.addEventListener("click",(e)=>{const root=e.target&&e.target.closest?e.target.closest('.mk-sort[data-mk-sort-root="1"]'):null;const btn=e.target&&e.target.closest?e.target.closest(".mk-sortbtn"):null;if(btn&&root&&out.contains(root)){e.preventDefault();e.stopPropagation();csrToggleMenu(root);return;}
const opt=e.target&&e.target.closest?e.target.closest(".mk-sortopt"):null;if(opt&&root&&out.contains(root)){e.preventDefault();e.stopPropagation();const id=opt.getAttribute("data-mk-sort")||"";const next=csrSortKeyDirFromOption(id);csrTrackActivity("sort_use",{sort:id||""},{scope:"sort:"+(id||""),throttleMs:15000});csrSetSortExplicit(next.key,next.dir);csrCloseMenu(root);renderPage(out);requestAnimationFrame(()=>syncResultsWidthToSearchBar(out));if(next.key==="views30d"){csrLoadViews30dMapOnce().then(()=>{if((CSR_STATE.sortKey||"best")==="views30d"){renderPage(out);requestAnimationFrame(()=>syncResultsWidthToSearchBar(out));}}).catch(()=>{});}
return;}});document.addEventListener("click",(e)=>{const open=out.querySelector('.mk-sortbtn[aria-expanded="true"]');if(!open)return;const root=open.closest('.mk-sort[data-mk-sort-root="1"]');if(!root)return;if(e.target&&root.contains(e.target))return;csrCloseMenu(root);},true);document.addEventListener("keydown",(e)=>{if(!e||e.key!=="Escape")return;const open=out.querySelector('.mk-sortbtn[aria-expanded="true"]');if(!open)return;const root=open.closest('.mk-sort[data-mk-sort-root="1"]');csrCloseMenu(root);},true);}
function csrViewsCountFor(item){if(!__csrViews30dMap)return 0;const p=csrNormPath(item&&item.location);return(__csrViews30dMap.get(p)||0);}
function renderPage(out){const total=CSR_STATE.items.length;if(!total){out.innerHTML=`<div class="csr-empty">No results.</div>`;const hasResultsNow=(CSR_STATE.items&&CSR_STATE.items.length>0);if(hasResultsNow&&!CSR_LAST_HAS_RESULTS){const wrap=out.querySelector(".csr-wrap");if(wrap){wrap.classList.remove("csr-fade-in");requestAnimationFrame(()=>wrap.classList.add("csr-fade-in"));}}
CSR_LAST_HAS_RESULTS=hasResultsNow;typesetMath(out);return;}
const pageSize=CSR_STATE.pageSize||10;const totalPages=Math.max(1,Math.ceil(total/pageSize));CSR_STATE.page=Math.min(Math.max(1,CSR_STATE.page),totalPages);const sorted=getSortedItems(CSR_STATE.items);const start=(CSR_STATE.page-1)*pageSize;const end=start+pageSize;const items=sorted.slice(start,end);const startN=total?(start+1):0;const endN=Math.min(total,end);const showingHtml=`<div class="csr-foot">`+`<div class="csr-showing">Showing ${startN}-${endN} of ${total}</div>`+
renderPager()+`</div>`;const titleActive=(CSR_STATE.sortKey||"title")==="title";const lectureActive=CSR_STATE.sortKey==="lecture";const dir=CSR_STATE.sortDir||"asc";const root=new URL(getSiteRootUrl());const headerHtml=`
  <div class="csr-head">
    ${csrRenderSortDropdownHtml()}
  </div>
  <div class="csr-cols csr-colheads">
    <div class="csr-colhead">Title</div>
    <div class="csr-colhead csr-colhead--right">${escapeHtml(csrCurrentUnitNoun())}</div>
  </div>
`;const listHtml=items.map(p=>{const href=new URL(p.location,root).toString();const lecTxt=p.meta?String(p.meta).replace(/^Course:\s*/i,""):"";return`
        <div class="csr-row">
          <a class="csr-link" href="${href}">${escapeHtml(p.title)}</a>
          <div class="csr-lecture">${escapeHtml(lecTxt)}</div>
        </div>
      `;}).join("");out.innerHTML=`<div class="csr-wrap">`+
headerHtml+`<div class="csr-list">${listHtml}</div>`+
showingHtml+`</div>`;requestAnimationFrame(()=>typesetMath(out));csrEnsureSortDropdownStylesOnce();csrEnsureSortDropdownBinding(out);requestAnimationFrame(()=>syncResultsWidthToSearchBar(out));}
function ensurePagerBinding(out){if(!out||out.dataset.csrPagerBound==="1")return;out.dataset.csrPagerBound="1";out.addEventListener("click",(e)=>{const t=e.target;if(!(t instanceof Element))return;const prevBtn=t.closest(".csr-prev");if(prevBtn&&!prevBtn.hasAttribute("disabled")){const totalPages=Math.max(1,Math.ceil(CSR_STATE.items.length/CSR_STATE.pageSize));if(CSR_STATE.page>1){CSR_STATE.page-=1;CSR_STATE.page=Math.min(Math.max(1,CSR_STATE.page),totalPages);renderPage(out);requestAnimationFrame(()=>syncResultsWidthToSearchBar(out));}
return;}
const nextBtn=t.closest(".csr-next");if(nextBtn&&!nextBtn.hasAttribute("disabled")){const totalPages=Math.max(1,Math.ceil(CSR_STATE.items.length/CSR_STATE.pageSize));if(CSR_STATE.page<totalPages){CSR_STATE.page+=1;CSR_STATE.page=Math.min(Math.max(1,CSR_STATE.page),totalPages);renderPage(out);requestAnimationFrame(()=>syncResultsWidthToSearchBar(out));}
return;}
const pageBtn=t.closest(".csr-page");if(pageBtn){const n=parseInt(pageBtn.getAttribute("data-page")||"",10);if(Number.isFinite(n)&&n>0){CSR_STATE.page=n;renderPage(out);requestAnimationFrame(()=>syncResultsWidthToSearchBar(out));}}});}
async function runCourseSearch(keyword,opts){const out=document.getElementById("course-search-results");if(!out)return;const input=document.getElementById("course-search-input");const inputValue=input?String(input.value||""):null;const page=window.location.pathname;const courseKey=getCourseKeyFromUrl();const searchSeq=++CSR_SEARCH_SEQ;const current=()=>searchSeq===CSR_SEARCH_SEQ&&page===window.location.pathname&&courseKey===getCourseKeyFromUrl()&&out.isConnected!==false&&out===document.getElementById("course-search-results")&&(!input||(input.isConnected!==false&&input===document.getElementById("course-search-input")&&String(input.value||"")===inputValue));ensurePagerBinding(out);const isAuto=!!(opts&&opts._fromAuto);if(!isAuto)csrHideFuzzyNote();const kw=String(keyword||"").trim();if(!kw){out.innerHTML=`<div class="csr-item">Please enter a token.</div>`;return{ok:false,reason:"empty"};}
let indexJson;try{indexJson=await loadIndex();}catch(err){if(!current())return{ok:false,reason:"stale"};out.innerHTML=`<div class="csr-item" role="status">${escapeHtml(err && err.message || "Could not load the course search index. Search again to retry.")}</div>`;return{ok:false,reason:"index"};}
if(!current())return{ok:false,reason:"stale"};const docs=indexJson.docs||[];const pages=csrAggregateDocsToPages(docs);const scoreDocKeyword=getScoreFn();const inCourse=pages.filter(p=>inSameCourseByKey(p.location,courseKey));const scoredAll=inCourse.map((p,i)=>({page:p,score:scoreDocKeyword(kw,p),cov:(scoreDocKeyword.coverage?scoreDocKeyword.coverage(kw,p):0),__i:i})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).map(x=>{const tags=Array.isArray(x.page.tags)?x.page.tags:[];const lec=lectureInfoFromTags(tags);return{location:x.page.location,title:x.page.title,meta:lec?(lec.unitLabel||`Lecture ${lec.lectureNum}`):"",tags,score:x.score,cov:x.cov,__i:x.__i,};});const __csrStrictAny=csrStrictAnyResult(inCourse,kw);try{const kw2=String(kw||"").trim();if(!isAuto&&(!__csrStrictAny||!scoredAll||!scoredAll.length)){const fix=await csrTryAutoCorrectOnNoResults(kw2,inCourse,courseKey);if(!current())return{ok:false,reason:"stale"};if(fix&&fix.to){const inputEl=document.getElementById("course-search-input");if(inputEl)inputEl.value=fix.to;csrHideFuzzyNote();return await runCourseSearch(fix.to,{_fromAuto:true});}}}catch(_){}
if(!current())return{ok:false,reason:"stale"};CSR_STATE.items=scoredAll;CSR_STATE.page=1;CSR_STATE.pageSize=10;renderPage(out);requestAnimationFrame(()=>{if(current())syncResultsWidthToSearchBar(out);});return{ok:true,query:kw,count:scoredAll.length,course:courseKey,auto:isAuto};}
function bind(){const wrap=document.querySelector(".course-search");if(!wrap)return;csrEnsureFuzzyStyles();csrInstallNoFlashStyles();csrInstallCourseSearchSubmitGuard();const form=document.getElementById("course-search-form");const input=document.getElementById("course-search-input");const out=document.getElementById("course-search-results");if(!window.__csrFormRO){window.__csrFormRO=new ResizeObserver(()=>{const out2=document.getElementById("course-search-results");requestAnimationFrame(()=>{if(out2)syncResultsWidthToSearchBar(out2);try{window.__csrSyncInputHeight&&window.__csrSyncInputHeight();}catch(_){}
try{csrSyncAssistMetrics();}catch(_){}
try{csrSyncAssistGeometry();}catch(_){}});});}
try{window.__csrFormRO.disconnect();window.__csrFormRO.observe(form);}catch(_){}
if(!form||!input||!out)return;function csrDeriveMobilePlaceholder(){try{const original=String(input.getAttribute("placeholder")||"").trim();let courseText=original;if(!courseText){const h1=document.querySelector("main h1, .md-content h1, article h1");courseText=String(h1&&h1.textContent||"").trim();}
courseText=String(courseText||"").replace(/^\s*search\s+in\s+/i,"").replace(/\s*[·•|]\s*.*$/,"").replace(/\s+[–—-]\s+.*$/,"").replace(/\s*\([^)]*\)\s*$/,"").trim();if(!courseText){const segs=String(window.location.pathname||"").split("/").filter(Boolean);const guess=segs.length>=2?segs[segs.length-2]:"";courseText=guess.replace(/^\d+[a-z]?-/i,"").replace(/-/g," ").replace(/Iii/g,"III").replace(/Ii/g,"II").replace(/Iv/g,"IV").replace(/I/g,"I").trim();}
return courseText?`Search in ${courseText}`:"Search in course";}catch(_){return"Search in course";}}
function csrSyncMobilePlaceholder(){try{if(!input.dataset.csrDesktopPlaceholder){input.dataset.csrDesktopPlaceholder=String(input.getAttribute("placeholder")||"");}
const isMobile=!!(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches);if(isMobile){input.setAttribute("placeholder",csrDeriveMobilePlaceholder());}else{input.setAttribute("placeholder",input.dataset.csrDesktopPlaceholder||"");}}catch(_){}}
csrSyncMobilePlaceholder();const submitBtn=form.querySelector('button[type="submit"], button:not([type]), input[type="submit"]');if(submitBtn&&submitBtn.tagName&&submitBtn.tagName.toLowerCase()==="button"){submitBtn.classList.add("fb-cta-btn","fb-cta-btn--search");if(!submitBtn.dataset.fbCtaDecorated){submitBtn.dataset.fbCtaDecorated="1";const label=(submitBtn.textContent||"").trim()||"Search in course";submitBtn.innerHTML=`<span class="fb-cta__ico fb-cta__ico--search" aria-hidden="true"></span>`+`<span class="fb-cta__txt">${escapeHtml(label)}</span>`;}}
function ensureMobileSubmitIcon(){try{const existing=document.getElementById("csr-mobile-submit");if(existing&&existing.closest("form")!==form)existing.remove();let btn=document.getElementById("csr-mobile-submit");if(!btn){btn=document.createElement("button");btn.id="csr-mobile-submit";btn.type="submit";btn.setAttribute("aria-label","Search in course");btn.innerHTML=`
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M10 4a6 6 0 104.472 10.03l4.249 4.25a1 1 0 001.414-1.415l-4.25-4.249A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z"/>
        </svg>
      `;form.appendChild(btn);}}catch(_){}}
ensureMobileSubmitIcon();function ensureMobileClearButton(){try{const existing=document.getElementById("csr-mobile-clear");if(existing&&existing.closest("form")!==form)existing.remove();let btn=document.getElementById("csr-mobile-clear");if(!btn){btn=document.createElement("button");btn.id="csr-mobile-clear";btn.type="button";btn.setAttribute("aria-label","Clear search");btn.setAttribute("title","Clear search");btn.hidden=true;btn.innerHTML="&times;";form.appendChild(btn);}
if(!btn.dataset.bound){btn.dataset.bound="1";btn.addEventListener("click",(e)=>{e.preventDefault();e.stopPropagation();try{input.value="";__csrAssistUi.lastApplied="";__csrAssistUi.lastNoteFix="";csrHideFuzzyNote();btn.hidden=true;input.focus();input.dispatchEvent(new Event("input",{bubbles:true}));csrRefreshAssistSoon(0);csrSyncAssistGeometry();}catch(_){}});}
const syncClear=()=>{try{const isMobile=!!(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches);const hasText=!!String(input&&input.value||"").trim();const focusWithin=!!(form&&form.matches&&form.matches(":focus-within"));const dd=typeof csrGetAssistDropdown==="function"?csrGetAssistDropdown():null;const dropdownVisible=!!(dd&&dd.style.display!=="none"&&dd.children&&dd.children.length);const isCollapsed=!(focusWithin||dropdownVisible);btn.hidden=!(isMobile&&hasText&&isCollapsed);try{const submitBtn=document.getElementById("csr-mobile-submit");const submitRect=submitBtn&&submitBtn.getBoundingClientRect?submitBtn.getBoundingClientRect():null;const submitW=submitRect&&submitRect.width?Math.ceil(submitRect.width):0;if(form&&form.style&&submitW>0){csrSetStyleIfChanged(form,"--csr-mobile-submit-w",submitW+"px");}}catch(_){}}catch(_){btn.hidden=true;}};btn.__csrSync=syncClear;syncClear();return btn;}catch(_){return null;}}
ensureMobileClearButton();window.__csrSyncInputHeight=()=>{try{const btn=form.querySelector('button[type="submit"], button:not([type]), input[type="submit"]');const h=btn&&btn.getBoundingClientRect?btn.getBoundingClientRect().height:0;if(h&&h>0){const hh=Math.round(h);csrSetStyleIfChanged(form,"--csr-btn-h",hh+"px");const isMobile=!!(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches);const inputEl=document.getElementById("course-search-input");if(inputEl){if(isMobile){csrSetStyleIfChanged(inputEl,"box-sizing","border-box");csrSetStyleIfChanged(inputEl,"min-height",hh+"px");csrSetStyleIfChanged(inputEl,"height",hh+"px");}else{csrRemoveStyleIfPresent(inputEl,"min-height");csrRemoveStyleIfPresent(inputEl,"height");}}}}catch(_){}};window.__csrSyncInputHeight();requestAnimationFrame(()=>{try{window.__csrSyncInputHeight&&window.__csrSyncInputHeight();}catch(_){}
try{csrSyncMobilePlaceholder();}catch(_){}
try{const clearBtn=document.getElementById("csr-mobile-clear");if(clearBtn&&typeof clearBtn.__csrSync==="function")clearBtn.__csrSync();}catch(_){}});csrEnsureCourseAssistUi(form,input);csrSyncAssistMetrics();csrSyncAssistGeometry();csrEnsureAssistBinding(form,input);ensurePagerBinding(out);if(form.dataset.bound==="1"){requestAnimationFrame(()=>{csrEnsureCourseAssistUi(form,input);csrSyncAssistMetrics();try{const clearBtn=document.getElementById("csr-mobile-clear");if(clearBtn&&typeof clearBtn.__csrSync==="function")clearBtn.__csrSync();}catch(_){}});return;}
form.dataset.bound="1";input.addEventListener("focus",()=>{csrProtectCourseSearchFocus(850);csrBeginInPlaceSearchGuard(1800);csrKeepMobileSearchBackdropHidden(1800);csrCloseMaterialSearchOverlayForCourseSearch();},true);form.addEventListener("pointerdown",()=>{csrProtectCourseSearchFocus(850);csrBeginInPlaceSearchGuard(1600);csrKeepMobileSearchBackdropHidden(1600);},true);input.addEventListener("input",()=>{csrHideFuzzyNote();try{const clearBtn=document.getElementById("csr-mobile-clear");if(clearBtn&&typeof clearBtn.__csrSync==="function")clearBtn.__csrSync();}catch(_){}});form.addEventListener("submit",e=>{csrHandleCourseSearchSubmit(e,"form-submit");},true);input.addEventListener("keydown",e=>{if(csrIsCourseSearchEnter(e))csrHandleCourseSearchSubmit(e,"input-enter");},true);if(!window.__csrResizeBound){window.__csrResizeBound=true;window.addEventListener("resize",()=>{const out2=document.getElementById("course-search-results");if(out2)syncResultsWidthToSearchBar(out2);try{window.__csrSyncInputHeight&&window.__csrSyncInputHeight();}catch(_){}
try{csrSyncMobilePlaceholder();}catch(_){}
try{csrSyncAssistMetrics();}catch(_){}
try{const clearBtn=document.getElementById("csr-mobile-clear");if(clearBtn&&typeof clearBtn.__csrSync==="function")clearBtn.__csrSync();}catch(_){}});}}
function init(){bind();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();document.addEventListener("DOMContentSwitch",()=>{CSR_SEARCH_SEQ+=1;__csrAssistUi.requestSeq+=1;init();});})();