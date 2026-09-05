(function(){function __mkFetchSearchIndex(url,init){const shared=window.__mkFetchJsonShared;if(typeof shared==="function")return shared(url,init);return fetch(url,init).then(function(r){return r&&r.ok?r.json():null;});}
function hardUnlockScroll(){try{const html=document.documentElement;const body=document.body;const top=body?body.style.top:"";const lockedY=top&&/-?\d+px/.test(top)?Math.abs(parseInt(top,10)):0;document.querySelectorAll('[data-md-scrollfix]').forEach(el=>{el.removeAttribute('data-md-scrollfix');});if(html)html.removeAttribute("data-md-scrollfix");if(body)body.removeAttribute("data-md-scrollfix");if(html)html.classList.remove("md-search--active");if(body)body.classList.remove("md-search--active");if(html){html.style.removeProperty("overflow");html.style.removeProperty("position");html.style.removeProperty("top");html.style.removeProperty("height");html.style.removeProperty("width");}
if(body){body.style.removeProperty("overflow");body.style.removeProperty("position");body.style.removeProperty("top");body.style.removeProperty("left");body.style.removeProperty("right");body.style.removeProperty("height");body.style.removeProperty("width");body.style.removeProperty("touch-action");body.style.removeProperty("-webkit-overflow-scrolling");}
if(lockedY>0){window.scrollTo(0,lockedY);}
const list=document.querySelector(".md-search-result__list");if(list)list.style.removeProperty("display");const overlay=document.querySelector(".md-search__overlay");if(overlay)overlay.style.removeProperty("display");const mdInput=document.querySelector('input[data-md-component="search-query"]');if(mdInput)mdInput.blur();if(document.activeElement&&document.activeElement.blur){try{document.activeElement.blur();}catch(_){}}}catch(_){}}
function typesetMath(rootEl){try{if(!rootEl)return;if(window.__mkRenderDynamicMathAsync){window.__mkRenderDynamicMathAsync([rootEl]).catch(()=>{});return;}
if(window.__mkRenderDynamicMath){Promise.resolve(window.__mkRenderDynamicMath(rootEl)).catch(()=>{});return;}
if(window.MathJax&&typeof window.MathJax.typesetPromise==="function"){window.MathJax.typesetPromise([rootEl]).catch(()=>{});return;}
if(window.renderMathInElement){window.renderMathInElement(rootEl,{delimiters:[{left:"$$",right:"$$",display:true},{left:"$",right:"$",display:false},{left:"\\(",right:"\\)",display:false},{left:"\\[",right:"\\]",display:true},],throwOnError:false,strict:"ignore"});}}catch(_){}}
function isOnFindPage(){const p=window.location.pathname.toLowerCase().replace(/\/+$/,"/");return p.endsWith("/find.html")||p.endsWith("/find/")||p.endsWith("/find/index.html");}
let __srMainGeneration=0;let __srActiveContext=null;function srSearchContextCurrent(context){return!!context&&context===__srActiveContext&&context.generation===__srMainGeneration&&isOnFindPage()&&context.path===window.location.pathname&&context.container.isConnected&&document.getElementById("search-results")===context.container;}
function srRenderIndexError(container,context){container.innerHTML=`<div class="sr-loading" role="status">Could not load the search index. Check your connection and retry. <button type="button" class="md-button" data-sr-retry>Retry</button></div>`;const retry=container.querySelector("[data-sr-retry]");if(retry)retry.addEventListener("click",()=>{if(srSearchContextCurrent(context))main(context).catch(e=>console.warn("search-results:",e));});}
const SELF_TEST_MODE_KEY="random_review_mode_v1";const SELF_TEST_NAV_FLAG="random_review_nav_flag_v1";const RANDOM_MODE_KEY="random_review_mode_kind_v1";const RANDOM_AI_NAV_FLAG="random_ai_nav_flag_v1";const MASTERY_LS_KEY="concept_mastery_v1";const SR_MASTERY_FILTER_KEY="mk_find_mastery_filter_v1";const SR_LP_FIND_SCROLL_KEY="lp_find_scroll_to_results_v1";const SR_SELF_TEST_ITEM_ID="self_test_mode";const SR_SELF_TEST_ITEM_TITLE="Self-test Mode";const SR_SELF_TEST_ITEM_PRICE=0;const SR_AI_ITEM_ID="ai_mastery_checks";const SR_AI_ITEM_TITLE="AI Mastery Checks";const SR_AI_ITEM_PRICE=400;function srShopApi(){try{return window.MkAccountData||null;}catch(_){return null;}}
function srHasShopItem(itemId){try{if(itemId===SR_SELF_TEST_ITEM_ID||itemId===SR_AI_ITEM_ID)return true;const api=srShopApi();if(api&&typeof api.hasShopItem==="function")return!!api.hasShopItem(itemId);const xp=api&&typeof api.xp==="function"?api.xp():null;const owned=xp&&(xp.ownedShopItems||(xp.shopInventory&&xp.shopInventory.ownedIds));return Array.isArray(owned)&&owned.indexOf(itemId)>=0;}catch(_){return false;}}
function srEnsureSelfTestUnlocked(source){return Promise.resolve(true);}
function srEnsureAiUnlocked(source){return Promise.resolve(true);}
const LAST_FACE_KEY="random_custom_last_dice_face_v1";let __srDiceState={timer:null,navigating:false};let __srRandomNavigation=null;let __srRandomNavigationSequence=0;function srCancelRandomNavigation(){const request=__srRandomNavigation;__srRandomNavigation=null;++__srRandomNavigationSequence;if(request)request.timers.forEach(id=>window.clearTimeout(id));srResetRandomButtonUi(document);}
function srBeginRandomNavigation(container,button){srCancelRandomNavigation();const request={url:String(window.location.href),container,button,timers:[]};__srRandomNavigation=request;__srDiceState.navigating=true;return request;}
function srRandomNavigationCurrent(request){return request===__srRandomNavigation&&request.url===String(window.location.href)&&isOnFindPage()&&(!request.container||(request.container.isConnected&&document.getElementById("search-results")===request.container))&&(!request.button||(request.button.isConnected&&document.getElementById("cr-random")===request.button));}
function isHoverPointer(){try{return!!(window.matchMedia&&window.matchMedia("(hover: hover) and (pointer: fine)").matches);}catch(_){return false;}}
function sleep(ms){return new Promise((r)=>setTimeout(r,ms||0));}
function diceSvg(n){const pips={1:[[12,12]],2:[[8,8],[16,16]],3:[[8,8],[12,12],[16,16]],4:[[8,8],[16,8],[8,16],[16,16]],5:[[8,8],[16,8],[12,12],[8,16],[16,16]],6:[[8,8],[16,8],[8,12],[16,12],[8,16],[16,16]],};const pts=pips[n]||pips[1];const dots=pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.05" fill="currentColor"/>`).join("");return`
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <rect x="4.5" y="4.5" width="15" height="15" rx="3" ry="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
        ${dots}
      </svg>
    `;}
function randFace(){return 1+Math.floor(Math.random()*6);}
function srConsumeGuestAction(action,detail){try{if(!window.MkGuestAccess||typeof window.MkGuestAccess.consume!=="function")return true;return window.MkGuestAccess.consume(action,Object.assign({blocking:true},detail||{}));}catch(_){return true;}}
function readLastFace(){try{const v=Number(sessionStorage.getItem(LAST_FACE_KEY)||"");return v>=1&&v<=6?v:1;}catch(_){return 1;}}
function writeLastFace(n){try{const v=Number(n);if(v>=1&&v<=6)sessionStorage.setItem(LAST_FACE_KEY,String(v));}catch(_){}}
function setDiceFace(iconEl,n){if(!iconEl)return;iconEl.innerHTML=diceSvg(n);}
function stopHoverRoll(st){if(!st||!st.timer)return;window.clearInterval(st.timer);st.timer=null;}
function beginHoverRoll(iconEl,st){if(!iconEl||!st)return;if(st.timer)return;st.timer=window.setInterval(()=>setDiceFace(iconEl,randFace()),70);}
function freezeToRandomFace(iconEl,st){stopHoverRoll(st);const face=randFace();setDiceFace(iconEl,face);return face;}
function rollDiceOnce(iconEl,opts){const frames=(opts&&opts.frames)||14;const interval=(opts&&opts.interval)||55;return new Promise((resolve)=>{if(!iconEl)return resolve(1);let i=0;const timer=window.setInterval(()=>{i+=1;setDiceFace(iconEl,randFace());if(i>=frames){window.clearInterval(timer);const finalFace=randFace();setDiceFace(iconEl,finalFace);resolve(finalFace);}},interval);});}
function srResetRandomButtonUi(rootEl){try{stopHoverRoll(__srDiceState);}catch(_){}
try{__srDiceState.navigating=false;}catch(_){}
const root=rootEl&&rootEl.querySelector?rootEl:document;const btnRandom=root&&root.querySelector?root.querySelector("#cr-random"):null;if(!btnRandom)return;try{btnRandom.disabled=false;btnRandom.removeAttribute("aria-disabled");btnRandom.style.removeProperty("pointer-events");}catch(_){}
try{const ico=btnRandom.querySelector(".cr-dice__ico");if(ico)setDiceFace(ico,readLastFace());}catch(_){}}
const COURSE_MAP={i2da:"Introduction to Data Analytics",m1c:"Math I: Calculus",orm:"OR Modelling",m2la:"Math II: Linear Algebra",pt:"Probability Theory for EOR",prog:"Programming for EOR",fin:"Finance for EOR",m3a:"Math III: Analysis",micro:"Microeconomics for EOR",m4mc:"Math IV: Multivariate Calculus",pd:"Probability Distributions",sm1:"Statistical Modelling for EOR",macro:"Macroeconomics for EOR",m5ala:"Math V: Advanced Linear Algebra",si:"Statistical Inference",lms:"Linear Models in Statistics",m6co:"Math VI: Convexity and Optimization",sor:"Stochastic Operations Research",dor:"Discrete Operations Research",i2e:"Introduction to Econometrics",li:"Life Insurance",gt:"Game Theory",ri:"Risk Insurance",};function unitNounFromType(type){return String(type||"lecture").toLowerCase()==="week"?"Week":"Lecture";}
function lectureNumberFromMeta(meta){const s=String(meta||"");const m=s.match(/(\d+)/);return m?parseInt(m[1],10):0;}
function srTitleSortValue(raw){let s=String(raw||"").trim();if(!s)return"";s=s.replace(/\\\(([^]*?)\\\)/g," $1 ").replace(/\\\[([^]*?)\\\]/g," $1 ").replace(/\$\$([^]*?)\$\$/g," $1 ").replace(/\$([^$]*?)\$/g," $1 ").replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g," $1 $2 ").replace(/\\(?:text|mathrm|operatorname|mathit|mathbf|mathsf|mathtt|mathbb|mathcal|mathfrak)\s*\{([^{}]*)\}/g," $1 ").replace(/\\([A-Za-z]+)/g," $1 ").replace(/\\([^\w\s])/g,"$1").replace(/[{}]/g," ").replace(/[\^_]/g," ").replace(/\s*([‐‑–—-])\s*/g,"$1").replace(/\(\s+/g,"(").replace(/\s+\)/g,")").replace(/\\/g," ").replace(/\s+/g," ").trim();return s||String(raw||"").trim();}
function srCompareTitles(a,b){const aa=srTitleSortValue(a);const bb=srTitleSortValue(b);return aa.localeCompare(bb,undefined,{sensitivity:"base",numeric:true});}
function mkNormPath(p){return String(p||"").split("#")[0].replace(/^\/+/,"");}
function srDefaultMasteryFilter(){return{mastered:true,clear:true,fuzzy:true,unknown:true,unrated:true,unvisited:true,};}
function srReadMasteryFilter(){const fallback=srDefaultMasteryFilter();try{const raw=sessionStorage.getItem(SR_MASTERY_FILTER_KEY);if(!raw)return fallback;const obj=JSON.parse(raw);if(!obj||typeof obj!=="object")return fallback;return{mastered:obj.mastered!==false,clear:obj.clear!==false,fuzzy:obj.fuzzy!==false,unknown:obj.unknown!==false,unrated:obj.unrated!==false,unvisited:obj.unvisited!==false,};}catch(_){return fallback;}}
function srWriteMasteryFilter(filter){try{sessionStorage.setItem(SR_MASTERY_FILTER_KEY,JSON.stringify(filter||srDefaultMasteryFilter()));}catch(_){}}
function srNormMasteryLoc(loc){return String(loc||"").split("#")[0].replace(/^\/+/,"").replace(/\/+$/g,"").trim();}
function srReadMasteryStore(){try{const raw=localStorage.getItem(MASTERY_LS_KEY);if(!raw)return{};const obj=JSON.parse(raw);return obj&&typeof obj==="object"?obj:{};}catch(_){return{};}}
function srFindMasteryRecord(loc){const all=srReadMasteryStore();const key=srNormMasteryLoc(loc);if(!key)return null;const variants=[key,"/"+key,key+"/","/"+key+"/",];for(const k of variants){if(Object.prototype.hasOwnProperty.call(all,k))return all[k];}
const noIndex=key.replace(/\/index\.html$/i,"");if(noIndex&&noIndex!==key){const more=[noIndex,"/"+noIndex,noIndex+"/","/"+noIndex+"/"];for(const k of more){if(Object.prototype.hasOwnProperty.call(all,k))return all[k];}}
return null;}
function srMasteryBucketForDoc(doc){const rec=srFindMasteryRecord(doc&&doc.location);if(!rec||typeof rec!=="object")return"unvisited";const mRaw=rec.m??rec.level??rec.mastery;const m=Number(mRaw);const hasValidM=[0,1,2,3].includes(m);const visited=!!(rec.visited||Number(rec.visitCount)>0||Number(rec.viewCount)>0||Number(rec.lastViewed)>0||Number(rec.lastSeen)>0||(Array.isArray(rec.history)&&rec.history.some((h)=>{const kind=String((h&&(h.kind||h.type||h.event||h.action))||"").toLowerCase();return kind==="view"||kind==="visit"||kind==="seen";})));const explicitUnrated=rec.unrated===true||String(rec.state||"").toLowerCase()==="unrated";if(hasValidM){if(m===3)return"mastered";if(m===2)return"clear";if(m===1)return"fuzzy";return"unknown";}
if(visited||explicitUnrated)return"unrated";return"unvisited";}
function srHitPassesMasteryFilter(hit){const f=state.masteryFilter||srDefaultMasteryFilter();const bucket=srMasteryBucketForDoc(hit&&hit.doc);return f[bucket]!==false;}
function srFilteredHits(hits){const src=Array.isArray(hits)?hits:[];return src.filter(srHitPassesMasteryFilter);}
function srLearningHits(hits){return(Array.isArray(hits)?hits:[]).filter(hit=>{const tags=(hit&&hit.doc&&hit.doc.tags)||[];return!(Array.isArray(tags)?tags:String(tags).split(/[\s,]+/)).some(tag=>/^curriculum-(enrichment|retired)$/i.test(String(tag).trim()));});}
function srRenderMasteryFilterHtml(){const f=state.masteryFilter||srDefaultMasteryFilter();const items=[["mastered","Mastered"],["clear","Clear"],["fuzzy","Unclear"],["unknown","Unknown"],["unrated","Unrated"],["unvisited","Unvisited"],];return`
    <div class="csr-mastery-filter" aria-label="Filter by mastery level">
      ${items.map(([key, label]) => `<label class="csr-mf"><input type="checkbox"data-mastery-filter="${key}"${f[key]!==false?"checked":""}><span>${label}</span></label>`.trim()).join("")}
    </div>
  `.trim();}
function srEnsureMasteryFilterStylesOnce(){const STYLE_ID="mk-search-results-mastery-filter-style-v11-random-dice-light-bg-fix";if(document.getElementById(STYLE_ID))return;["mk-search-results-mastery-filter-style-v1","mk-search-results-mastery-filter-style-v2","mk-search-results-mastery-filter-style-v3","mk-search-results-mastery-filter-style-v3-layout","mk-search-results-mastery-filter-style-v4-layout","mk-search-results-mastery-filter-style-v5-select-group","mk-search-results-mastery-filter-style-v6-stable-filter-update","mk-search-results-mastery-filter-style-v7-pc-selftest-sort-swap","mk-search-results-mastery-filter-style-v8-pc-filter-one-line","mk-search-results-mastery-filter-style-v9-pc-filter-inline-with-sort","mk-search-results-mastery-filter-style-v10-mobile-random-modes-red"].forEach((id)=>{try{const old=document.getElementById(id);if(old&&old.parentNode)old.parentNode.removeChild(old);}catch(_){}});const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
    .csr-actions.csr-actions--v3{
      display:grid !important;
      grid-template-columns:auto auto auto minmax(1rem, 1fr) auto;
      grid-template-areas:
        "start self ai spacer selects"
        "sort  filter filter filter filter";
      align-items:center;
      gap:.72rem .52rem;
      width:100%;
      margin-bottom:1.05rem;
    }

    .csr-actions--v3 .csr-action-start{ grid-area:start !important; justify-self:start; min-width:0; }
    .csr-actions--v3 .csr-selftest{ grid-area:self !important; justify-self:start; }
    .csr-actions--v3 .csr-aitest{ grid-area:ai !important; justify-self:start; }
    .csr-actions--v3 .csr-action-sort{ grid-area:sort !important; justify-self:start; min-width:0; }
    .csr-actions--v3 .csr-select-actions{
      grid-area:selects !important;
      justify-self:end;
      display:flex;
      align-items:center;
      justify-content:flex-end;
      gap:.95rem;
      white-space:nowrap;
    }
    .csr-actions--v3 .csr-mastery-filter{ grid-area:filter !important; justify-self:end; }

    .csr-actions--v3 .cr-dice-btn{
      width:auto !important;
      min-width:max-content !important;
      max-width:100%;
      white-space:nowrap !important;
      display:inline-flex !important;
      align-items:center;
      justify-content:center;
      gap:.52rem;
      padding-inline:1.05rem !important;
      line-height:1.05;
    }
    .csr-actions--v3 .cr-dice__txt{
      white-space:nowrap !important;
      display:inline-block;
    }

    .csr-actions--v3 .cr-dice__ico{
      display:inline-flex !important;
      align-items:center;
      justify-content:center;
      width:1.16rem !important;
      height:1.16rem !important;
      min-width:1.16rem !important;
      min-height:1.16rem !important;
      padding:0 !important;
      margin:0 !important;
      border:0 !important;
      border-radius:0 !important;
      background:transparent !important;
      box-shadow:none !important;
      outline:0 !important;
      color:currentColor;
    }
    .csr-actions--v3 .cr-dice__ico::before,
    .csr-actions--v3 .cr-dice__ico::after{
      display:none !important;
      content:none !important;
    }
    .csr-actions--v3 .cr-dice__ico svg{
      display:block;
      width:1.12rem !important;
      height:1.12rem !important;
    }
    .csr-actions--v3 .cr-dice__ico,
    .csr-actions--v3 .cr-dice__ico *,
    .csr-actions--v3 .cr-dice__ico svg,
    .csr-actions--v3 .cr-dice__ico svg *{
      background: transparent !important;
      box-shadow: none !important;
    }
    .csr-actions--v3 .cr-dice__ico rect{
      fill: none !important;
    }
    html[data-md-color-scheme="slate"] #search-results .csr-actions--v3 .cr-dice__ico,
    html[data-md-color-scheme="slate"] #search-results .csr-actions--v3 .cr-dice__ico svg,
    html[data-md-color-scheme="slate"] #search-results .csr-actions--v3 .cr-dice__ico svg *,
    body[data-md-color-scheme="slate"] #search-results .csr-actions--v3 .cr-dice__ico,
    body[data-md-color-scheme="slate"] #search-results .csr-actions--v3 .cr-dice__ico svg,
    body[data-md-color-scheme="slate"] #search-results .csr-actions--v3 .cr-dice__ico svg *{
      color:#fff !important;
      stroke:currentColor !important;
    }
    .csr-actions--v3 .csr-selftest.is-locked span,
    .csr-actions--v3 .csr-aitest.is-locked span{
      color:color-mix(in srgb,#f5c84b 82%,var(--md-default-fg-color)) !important;
    }
    .csr-actions--v3 .csr-selftest.is-locked span::after,
    .csr-actions--v3 .csr-aitest.is-locked span::after{
      content:" 🔒";
      font-size:.72em;
      opacity:.75;
    }

    /* v11: remove the light-mode square tile behind the Start random dice.
       Keep the dice drawing itself; only neutralise inherited button/icon backgrounds. */
    html[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico,
    body[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico,
    html[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico::before,
    html[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico::after,
    body[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico::before,
    body[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico::after,
    html[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico svg,
    body[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico svg,
    html[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico svg *,
    body[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico svg *{
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border: 0 !important;
      box-shadow: none !important;
      outline: 0 !important;
    }
    html[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico::before,
    html[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico::after,
    body[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico::before,
    body[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico::after{
      display: none !important;
      content: none !important;
    }
    html[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico rect,
    body[data-md-color-scheme="default"] #search-results .csr-actions--v3 #cr-random.cr-dice-btn > .cr-dice__ico rect{
      fill: none !important;
    }

    .csr-actions--v3 #cr-all,
    .csr-actions--v3 #cr-none{
      white-space:nowrap;
    }

    .csr-selftest,
    .csr-aitest,
    .csr-mf{
      display:inline-flex;
      align-items:center;
      gap:.42rem;
      cursor:pointer;
      user-select:none;
      white-space:nowrap;
      line-height:1.2;
      opacity:.92;
    }

    .csr-selftest,
    .csr-aitest{ font-size:.92rem; }
    .csr-mf{ font-size:.86rem; }

    .csr-selftest input,
    .csr-aitest input,
    .csr-mf input{
      width:.92rem;
      height:.92rem;
      min-width:.92rem;
      min-height:.92rem;
      margin:0;
      accent-color: var(--md-accent-fg-color, var(--md-primary-fg-color));
      cursor:pointer;
    }

    .csr-selftest input,
    .csr-aitest input{
      accent-color: #e5484d !important;
    }
    .csr-selftest input:checked + span,
    .csr-aitest input:checked + span{
      color: color-mix(in srgb, #e5484d 78%, var(--md-default-fg-color));
      font-weight:700;
    }

    .csr-selftest:hover,
    .csr-aitest:hover,
    .csr-mf:hover{ opacity:1; }

    .csr-mastery-filter{
      display:flex;
      flex-wrap:wrap;
      align-items:center;
      justify-content:flex-end;
      gap:.42rem .78rem;
      max-width:min(820px, 100%);
      line-height:1.2;
      contain: layout style;
    }

    @media (min-width: 721px){
      .csr-actions--v3 .csr-action-sort{ align-self:center; }
      .csr-actions--v3 .csr-mastery-filter{
        min-width:0;
        max-width:none;
        flex-wrap:nowrap;
        justify-self:end;
        gap:.42rem .68rem;
      }
      .csr-actions--v3 .csr-mf{
        flex:0 0 auto;
      }
    }

    /* Keep filter clicks from causing a visible height snap or transition flash. */
    .csr-wrap .csr-actions,
    .csr-wrap .csr-list,
    .csr-wrap .csr-foot{
      transition: none !important;
      animation: none !important;
    }
    .csr-wrap .csr-list{
      min-height: var(--csr-stable-list-min-h, 0px);
    }
    .csr-wrap .csr-actions{
      min-height: var(--csr-stable-actions-min-h, auto);
    }

    @media (max-width: 720px){
      .csr-actions.csr-actions--v3{
        display:grid !important;
        grid-template-columns:minmax(0, 1fr) minmax(0, 1fr);
        grid-template-areas:
          "start  start"
          "self   ai"
          "filter filter"
          "all    nonebtn"
          "sort   sort";
        gap:.82rem 1.05rem;
        align-items:center;
      }

      .csr-actions--v3 .cr-dice-btn{
        grid-area:start !important;
        justify-self:start;
        width:auto !important;
        padding-inline:.9rem !important;
        min-width:max-content !important;
        max-width:100% !important;
      }

      .csr-actions--v3 .cr-dice__ico,
      .csr-actions--v3 .cr-dice__ico *,
      .csr-actions--v3 .cr-dice__ico svg,
      .csr-actions--v3 .cr-dice__ico svg *{
        background:transparent !important;
        box-shadow:none !important;
      }

      .csr-actions--v3 .csr-selftest{
        grid-area:self !important;
        justify-self:start;
        font-size:.9rem;
      }
      .csr-actions--v3 .csr-aitest{
        grid-area:ai !important;
        justify-self:end;
        font-size:.9rem;
      }

      .csr-actions--v3 .csr-select-actions{ display: contents; }
      .csr-actions--v3 #cr-all{ grid-area: all !important; justify-self:start; }
      .csr-actions--v3 #cr-none{ grid-area: nonebtn !important; justify-self:end; }
      .csr-actions--v3 #cr-all,
      .csr-actions--v3 #cr-none{
        min-width:max-content;
        width:auto;
      }

      .csr-actions--v3 .csr-mastery-filter{
        grid-area:filter !important;
        width:100%;
        max-width:none;
        justify-self:stretch;
        display:grid;
        grid-template-columns:repeat(3, minmax(0, 1fr));
        column-gap:1.05rem;
        row-gap:.78rem;
        justify-content:stretch;
        align-items:center;
        padding-top:.1rem;
      }

      .csr-actions--v3 .csr-mf{
        justify-content:flex-start;
        min-width:0;
        font-size:.84rem;
      }

      .csr-actions--v3 .csr-action-sort{
        grid-area:sort !important;
        justify-self:start;
      }
    }
  `.trim();document.head.appendChild(st);}
const SR_VIEWS_API_BASE="https://hot.eor-wiki.workers.dev";const SR_VIEWS_CACHE_KEY="__mk_views30d_cache_v1";const SR_VIEWS_CACHE_TTL_MS=10*60*1000;let __srViews30dPromise=null;let __srViews30dMap=null;function srReadViewsCache(){try{const raw=sessionStorage.getItem(SR_VIEWS_CACHE_KEY);if(!raw)return null;const obj=JSON.parse(raw);if(!obj||typeof obj!=="object")return null;const ts=Number(obj.ts)||0;if(!ts||(Date.now()-ts)>SR_VIEWS_CACHE_TTL_MS)return null;const items=obj.items&&typeof obj.items==="object"?obj.items:null;if(!items)return null;return items;}catch(_){return null;}}
function srWriteViewsCache(mapObj){try{sessionStorage.setItem(SR_VIEWS_CACHE_KEY,JSON.stringify({ts:Date.now(),items:mapObj||{}}));}catch(_){}}
async function srFetchHot({metric,period,limit,offset}){const url=new URL(SR_VIEWS_API_BASE+"/hot");url.searchParams.set("metric",metric);url.searchParams.set("period",period);url.searchParams.set("limit",String(limit));url.searchParams.set("offset",String(offset));const resp=await fetch(url.toString());if(!resp||!resp.ok)throw new Error("Could not load view counts");const data=await resp.json();if(!data||!Array.isArray(data.items))throw new Error("Invalid view counts response");return{items:data.items,total:data&&typeof data.total==="number"?data.total:0,};}
async function srLoadViews30dMapOnce(){if(typeof window!=="undefined"&&window.__mkExamMode)return new Map();if(__srViews30dMap)return __srViews30dMap;if(__srViews30dPromise)return __srViews30dPromise;const cached=srReadViewsCache();if(cached){const m=new Map();for(const k of Object.keys(cached))m.set(mkNormPath(k),Number(cached[k])||0);__srViews30dMap=m;return m;}
__srViews30dPromise=(async()=>{const limit=80;let offset=0;let guard=0;const maxPages=60;const m=new Map();while(guard<maxPages){guard+=1;const chunk=await srFetchHot({metric:"views",period:"30d",limit,offset});const arr=chunk.items||[];if(!arr.length)break;for(const it of arr){const p=mkNormPath(it&&it.path);if(!p)continue;const c=Number(it&&it.count)||0;if(!m.has(p))m.set(p,c);}
offset+=arr.length;if(chunk.total&&offset>=chunk.total)break;if(arr.length<limit)break;}
try{const obj={};for(const[k,v]of m.entries())obj[k]=v;srWriteViewsCache(obj);}catch(_){}
__srViews30dMap=m;return m;})();try{return await __srViews30dPromise;}finally{__srViews30dPromise=null;}}
function srViewsCountFor(hit){if(!__srViews30dMap)return 0;const p=mkNormPath(hit&&hit.doc&&hit.doc.location);return __srViews30dMap.get(p)||0;}
function srSortLabel(){const key=state.sortKey||"best";const dir=state.sortDir||"desc";if(key==="best")return"Most relevant";if(key==="views30d")return"Most viewed (30d)";if(key==="lecture"&&dir==="asc")return"Course · Lecture/Week ↑";if(key==="lecture"&&dir==="desc")return"Course · Lecture/Week ↓";if(key==="title"&&dir==="asc")return"Title A → Z";if(key==="title"&&dir==="desc")return"Title Z → A";return"Most relevant";}
function srSortKeyDirFromOption(optId){const id=String(optId||"");if(id==="best")return{key:"best",dir:"desc"};if(id==="views30d")return{key:"views30d",dir:"desc"};if(id==="lecture-asc")return{key:"lecture",dir:"asc"};if(id==="lecture-desc")return{key:"lecture",dir:"desc"};if(id==="title-asc")return{key:"title",dir:"asc"};if(id==="title-desc")return{key:"title",dir:"desc"};return{key:"best",dir:"desc"};}
function srIsActiveOption(optId){const s=srSortKeyDirFromOption(optId);return(state.sortKey||"best")===s.key&&(state.sortDir||"desc")===s.dir;}
function srSvg(name,size){const s=Number(size)||18;const common=`width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"`;const stroke=`fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;if(name==="sort"){return`<svg ${common} ${stroke}><path d="M3 6h10"/><path d="M3 12h14"/><path d="M3 18h6"/><path d="M17 8l2-2 2 2"/><path d="M19 6v12"/><path d="M21 16l-2 2-2-2"/></svg>`;}
if(name==="chev"){return`<svg ${common} ${stroke}><path d="M6 9l6 6 6-6"/></svg>`;}
if(name==="target"){return`<svg ${common} ${stroke}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>`;}
if(name==="fire"){return`<svg ${common} ${stroke}><path d="M12 2c2.6 3 4 5.2 4 8.2A4.5 4.5 0 0 1 11.5 15c-1.8 0-3.5-1.5-3.5-3.8C8 7.9 10 5.6 12 2z"/><path d="M12 13c1.2 1.3 1.7 2.3 1.7 3.4A2 2 0 0 1 11.7 19 2.2 2.2 0 0 1 9.5 16.6C9.5 15.1 10.6 14 12 13z"/></svg>`;}
if(name==="up"){return`<svg ${common} ${stroke}><path d="M12 6v12"/><path d="M7 11l5-5 5 5"/></svg>`;}
if(name==="down"){return`<svg ${common} ${stroke}><path d="M12 6v12"/><path d="M7 13l5 5 5-5"/></svg>`;}
if(name==="az"){return`<svg ${common} fill="none"><text x="4.8" y="9.4" font-size="8" font-family="system-ui, sans-serif" fill="currentColor">A</text><text x="4.8" y="20.2" font-size="8" font-family="system-ui, sans-serif" fill="currentColor">Z</text><path d="M12 7h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 17h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l2 2-2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
if(name==="za"){return`<svg ${common} fill="none"><text x="4.8" y="9.4" font-size="8" font-family="system-ui, sans-serif" fill="currentColor">Z</text><text x="4.8" y="20.2" font-size="8" font-family="system-ui, sans-serif" fill="currentColor">A</text><path d="M12 7h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 17h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M21 18l-2-2 2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
return"";}
function srRenderSortDropdownHtml(){const label=srSortLabel();const opts=[{id:"best",label:"Most relevant",icon:"target"},{id:"views30d",label:"Most viewed (30d)",icon:"fire"},{id:"lecture-asc",label:"Course · Lecture/Week ↑",icon:"up"},{id:"lecture-desc",label:"Course · Lecture/Week ↓",icon:"down"},{id:"title-asc",label:"Title A → Z",icon:"az"},{id:"title-desc",label:"Title Z → A",icon:"za"},];const menu=opts.map(o=>{const active=srIsActiveOption(o.id)?"is-active":"";return`
      <button type="button" class="mk-sortopt ${active}" data-mk-sort="${o.id}">
        <span class="mk-sortopt__ico">${srSvg(o.icon, 18)}</span>
        <span class="mk-sortopt__txt">${o.label}</span>
      </button>
    `.trim();}).join("");return`
    <div class="mk-sort" data-mk-sort-root="1">
      <button type="button" class="mk-sortbtn" aria-haspopup="listbox" aria-expanded="false">
        <span class="mk-sortbtn__ico">${srSvg("sort", 18)}</span>
        <span class="mk-sortbtn__txt">Sort</span>
        <span class="mk-sortbtn__val">${label}</span>
        <span class="mk-sortbtn__chev">${srSvg("chev", 18)}</span>
      </button>
      <div class="mk-sortmenu" role="listbox" hidden>
        ${menu}
      </div>
    </div>
  `.trim();}
function srEnsureSortDropdownStylesOnce(){if(document.getElementById("mk-sortdropdown-style-v1"))return;const st=document.createElement("style");st.id="mk-sortdropdown-style-v1";st.textContent=`
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
    .mk-sortbtn__ico, .mk-sortbtn__chev{ display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; opacity:.85; flex:0 0 auto; }
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
    .mk-sortopt__ico{ width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center; opacity:.88; flex:0 0 auto; }
    .mk-sortopt:hover{ background: rgba(0,0,0,.06); }
    [data-md-color-scheme="slate"] .mk-sortopt:hover{ background: rgba(255,255,255,.08); }
    .mk-sortopt.is-active{
      background: rgba(99,102,241,.10);
      box-shadow: inset 0 0 0 1px rgba(99,102,241,.22);
    }

    .csr-colheads{ margin-top: 2px; }
    .csr-colhead{ opacity:.82; font-weight:650; }
    .csr-colhead--right{ justify-self:end; text-align:right; }
  `.trim();document.head.appendChild(st);}
function srSetSortExplicit(key,dir){state.sortKey=key;state.sortDir=dir;state.page=1;}
function srCloseMenu(root){if(!root)return;const btn=root.querySelector(".mk-sortbtn");const menu=root.querySelector(".mk-sortmenu");if(menu)menu.hidden=true;if(btn)btn.setAttribute("aria-expanded","false");}
function srToggleMenu(root){if(!root)return;const btn=root.querySelector(".mk-sortbtn");const menu=root.querySelector(".mk-sortmenu");if(!btn||!menu)return;const isOpen=btn.getAttribute("aria-expanded")==="true";if(isOpen){srCloseMenu(root);}else{document.querySelectorAll('.mk-sort[data-mk-sort-root="1"]').forEach(el=>{if(el!==root)srCloseMenu(el);});menu.hidden=false;btn.setAttribute("aria-expanded","true");}}
function srEnsureSortDropdownBinding(container){if(!container||container.dataset.srSortDdBound==="1")return;container.dataset.srSortDdBound="1";container.addEventListener("click",(e)=>{const root=e.target&&e.target.closest?e.target.closest('.mk-sort[data-mk-sort-root="1"]'):null;const btn=e.target&&e.target.closest?e.target.closest(".mk-sortbtn"):null;if(btn&&root&&container.contains(root)){e.preventDefault();e.stopPropagation();srToggleMenu(root);return;}
const opt=e.target&&e.target.closest?e.target.closest(".mk-sortopt"):null;if(opt&&root&&container.contains(root)){e.preventDefault();e.stopPropagation();const id=opt.getAttribute("data-mk-sort")||"";const next=srSortKeyDirFromOption(id);srSetSortExplicit(next.key,next.dir);state.viewsError="";srCloseMenu(root);renderResults(container);if(next.key==="views30d"){const context=__srActiveContext;srLoadViews30dMapOnce().then(()=>{if(srSearchContextCurrent(context)&&(state.sortKey||"best")==="views30d")renderResults(container);}).catch(()=>{if(!srSearchContextCurrent(context)||(state.sortKey||"best")!=="views30d")return;state.viewsError="View counts could not be loaded. Select Most viewed (30d) again to retry.";renderResults(container);});}
return;}});document.addEventListener("click",(e)=>{const open=container.querySelector('.mk-sortbtn[aria-expanded="true"]');if(!open)return;const root=open.closest('.mk-sort[data-mk-sort-root="1"]');if(!root)return;if(e.target&&root.contains(e.target))return;srCloseMenu(root);},true);document.addEventListener("keydown",(e)=>{if(!e||e.key!=="Escape")return;const open=container.querySelector('.mk-sortbtn[aria-expanded="true"]');if(!open)return;const root=open.closest('.mk-sort[data-mk-sort-root="1"]');srCloseMenu(root);},true);}
function getSortedHits(hits){const dir=state.sortDir==="desc"?-1:1;const key=state.sortKey||"best";const arr=hits.slice();arr.sort((a,b)=>{const ta=String(a.doc?.title||"");const tb=String(b.doc?.title||"");const tc=srCompareTitles(ta,tb);if(key==="views30d"){const va=srViewsCountFor(a);const vb=srViewsCountFor(b);if(vb!==va)return vb-va;const sa=Number(a.score)||0;const sb=Number(b.score)||0;if(sb!==sa)return sb-sa;const ca=Number(a.cov)||0;const cb=Number(b.cov)||0;if(cb!==ca)return cb-ca;const pa=yearCourseFromLocation(a.doc?.location);const pb=yearCourseFromLocation(b.doc?.location);const ya=yearOrderFromFolder(pa.year);const yb=yearOrderFromFolder(pb.year);if(ya!==yb)return ya-yb;const oa=courseOrderFromFolder(pa.course);const ob=courseOrderFromFolder(pb.course);if(oa!==ob)return oa-ob;const laNum=lectureInfoFromTags(a.doc?.tags)?.lectureNum||0;const lbNum=lectureInfoFromTags(b.doc?.tags)?.lectureNum||0;if(laNum!==lbNum)return laNum-lbNum;return tc;}
if(key!=="title"&&key!=="lecture"){const sa=Number(a.score)||0;const sb=Number(b.score)||0;if(sb!==sa)return sb-sa;const ca=Number(a.cov)||0;const cb=Number(b.cov)||0;if(cb!==ca)return cb-ca;const pa=yearCourseFromLocation(a.doc?.location);const pb=yearCourseFromLocation(b.doc?.location);const ya=yearOrderFromFolder(pa.year);const yb=yearOrderFromFolder(pb.year);if(ya!==yb)return ya-yb;const oa=courseOrderFromFolder(pa.course);const ob=courseOrderFromFolder(pb.course);if(oa!==ob)return oa-ob;const laNum=lectureInfoFromTags(a.doc?.tags)?.lectureNum||0;const lbNum=lectureInfoFromTags(b.doc?.tags)?.lectureNum||0;if(laNum!==lbNum)return laNum-lbNum;const c1=tc;if(c1!==0)return c1;const la=String(a.doc?.location||"");const lb=String(b.doc?.location||"");const c2=la.localeCompare(lb,undefined,{sensitivity:"base"});if(c2!==0)return c2;return(Number(a.__i)||0)-(Number(b.__i)||0);}
if(key==="lecture"){const pa=yearCourseFromLocation(a.doc?.location);const pb=yearCourseFromLocation(b.doc?.location);const ya=yearOrderFromFolder(pa.year);const yb=yearOrderFromFolder(pb.year);if(ya!==yb)return(ya-yb)*dir;const oa=courseOrderFromFolder(pa.course);const ob=courseOrderFromFolder(pb.course);if(oa!==ob)return(oa-ob)*dir;const la=lectureInfoFromTags(a.doc?.tags)?.lectureNum||0;const lb=lectureInfoFromTags(b.doc?.tags)?.lectureNum||0;if(la!==lb)return(la-lb)*dir;return tc*dir;}
const c=tc;if(c!==0)return c*dir;return(lectureNumberFromMeta(a.doc?.meta)-lectureNumberFromMeta(b.doc?.meta))*dir;});return arr;}
function buildPageButtons(totalPages,cur){const tp=Math.max(1,totalPages);const p=Math.min(Math.max(1,cur),tp);const isMobile=typeof window!=="undefined"&&!!(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches);if(!isMobile){if(tp<=9)return Array.from({length:tp},(_,i)=>i+1);const nums=[1];let start=Math.max(2,p-3);let end=Math.min(tp-1,p+3);if(start<=2)end=Math.min(tp-1,8);if(end>=tp-1)start=Math.max(2,tp-7);for(let n=start;n<=end;n+=1)nums.push(n);if(tp>1)nums.push(tp);const out=[];let prev=0;for(const n of nums){if(prev&&n-prev>1)out.push("…");out.push(n);prev=n;}
return out;}
const vw=Math.max((document.documentElement&&document.documentElement.clientWidth)||0,window.innerWidth||0,320);const pagerGap=6;const navBtnWidth=44;const horizontalPadding=32;const numericArea=Math.max(120,vw-horizontalPadding-(navBtnWidth*2)-(pagerGap*2));const tokenWidth=(token)=>{if(token==="…")return 12;const digits=String(token).length;if(digits>=3)return 26;if(digits===2)return 20;return 14;};const fits=(tokens)=>tokens.reduce((sum,token,idx)=>{return sum+tokenWidth(token)+(idx?pagerGap:0);},0)<=numericArea;const all=Array.from({length:tp},(_,i)=>i+1);if(fits(all))return all;let maxNumeric=tp;while(maxNumeric>5){const middleSlots=Math.max(1,maxNumeric-2);let start=Math.max(2,p-Math.floor(middleSlots/2));let end=Math.min(tp-1,start+middleSlots-1);const visibleMiddle=Math.max(0,end-start+1);if(visibleMiddle<middleSlots)start=Math.max(2,end-middleSlots+1);if(start===2)end=Math.min(tp-1,start+middleSlots-1);if(end===tp-1)start=Math.max(2,end-middleSlots+1);const nums=[1];for(let n=start;n<=end;n+=1)nums.push(n);if(tp>1)nums.push(tp);const deduped=nums.filter((n,i,arr)=>i===0||n!==arr[i-1]);const out=[];let prev=0;for(const n of deduped){if(prev&&n-prev>1)out.push("…");out.push(n);prev=n;}
if(fits(out))return out;maxNumeric-=1;}
const fallback=[1];if(p>3)fallback.push("…");for(let n=Math.max(2,p-1);n<=Math.min(tp-1,p+1);n+=1)fallback.push(n);if(p<tp-2)fallback.push("…");if(tp>1)fallback.push(tp);const dedupedFallback=[];for(const token of fallback){if(!dedupedFallback.length||token!==dedupedFallback[dedupedFallback.length-1]){dedupedFallback.push(token);}}
return dedupedFallback;}
function yearCourseFromLocation(loc){const s=String(loc||"").replace(/^\/+/,"");const segs=s.split("/").filter(Boolean);return{year:segs[0]||"",course:segs[1]||"",};}
function srCourseLabelFromLocation(loc){const yc=yearCourseFromLocation(loc);let courseSeg=String(yc.course||"");if(!courseSeg)return"";courseSeg=courseSeg.replace(/^\d+[a-z]-/i,"").replace(/-/g," ").trim();const parts=courseSeg.split(/\s+/).filter(Boolean);if(parts.length>=3&&/^Math$/i.test(parts[0])&&/^[IVX]+$/i.test(parts[1])){return`${parts[0]} ${parts[1]}: ${parts.slice(2).join(" ")}`;}
return courseSeg;}
function yearOrderFromFolder(yearFolder){const m=String(yearFolder).match(/year-(\d+)/i);return m?parseInt(m[1],10):Number.MAX_SAFE_INTEGER;}
function courseOrderFromFolder(folder){const m=String(folder).match(/^(\d+)([a-z])-/i);if(!m)return Number.MAX_SAFE_INTEGER;const num=parseInt(m[1],10);const letter=(m[2]||"z").toLowerCase();const letterIndex=Math.max(0,letter.charCodeAt(0)-97);return num*100+letterIndex;}
function lectureInfoFromTags(tagSetOrArr){const tags=Array.isArray(tagSetOrArr)?tagSetOrArr:(tagSetOrArr&&typeof tagSetOrArr.forEach==="function")?Array.from(tagSetOrArr):[];const withCourse=/^([a-z0-9]+)[-_]?(lecture|week)[-_]?0*(\d+)$/i;const bare=/^(lecture|week)[-_]?0*(\d+)$/i;for(const raw of tags){const t=String(raw||"").trim().toLowerCase();let m=t.match(withCourse);if(m){const courseCode=m[1];const unitType=String(m[2]||"lecture").toLowerCase();const lectureNum=parseInt(m[3],10);const courseName=COURSE_MAP[courseCode];if(!courseName||!Number.isFinite(lectureNum))continue;const unitNoun=unitNounFromType(unitType);return{courseCode,courseName,unitType,unitNum:lectureNum,lectureNum,unitLabel:`${unitNoun} ${lectureNum}`,lectureLabel:`${unitNoun} ${lectureNum}`};}
m=t.match(bare);if(m){const unitType=String(m[1]||"lecture").toLowerCase();const lectureNum=parseInt(m[2],10);if(!Number.isFinite(lectureNum))continue;const unitNoun=unitNounFromType(unitType);return{courseCode:"",courseName:"",unitType,unitNum:lectureNum,lectureNum,unitLabel:`${unitNoun} ${lectureNum}`,lectureLabel:`${unitNoun} ${lectureNum}`};}}
return null;}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function stripHtml(s){if(!s)return"";const div=document.createElement("div");div.innerHTML=s;return div.textContent||div.innerText||"";}
function normaliseText(s){return String(s||"").replace(/\s+/g," ").trim();}
function normaliseForSearch(s){const spelled=typeof window.__mkSymbolsToWords==="function"?window.__mkSymbolsToWords(s):s;return String(spelled||"").toLowerCase().replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim();}
function tokeniseQuery(q){return normaliseForSearch(q).split(" ").filter(Boolean);}
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
function getSiteRootUrl(){try{const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]');const attr=script?script.getAttribute("src"):(link?link.getAttribute("href"):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname;const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}catch(_){return document.baseURI;}}
function toAbsoluteUrl(loc){const raw=String(loc||"").trim();if(!raw)return"";try{if(/^[a-z]+:\/\//i.test(raw))return new URL(raw).toString();}catch(_){}
try{const clean=raw.replace(/^\.\//,"").replace(/^\/+/,"");return new URL(clean,getSiteRootUrl()).toString();}catch(_){try{return new URL(raw,document.baseURI).toString();}catch(_){return raw;}}}
function srNavigateToTarget(targetUrl,request){const href=String(targetUrl||"").trim();if(!href)return false;request=request||srBeginRandomNavigation(null,null);if(!srRandomNavigationCurrent(request))return false;try{const a=document.createElement("a");a.href=href;a.rel="noopener";a.style.display="none";document.body.appendChild(a);a.click();if(!srRandomNavigationCurrent(request))return true;request.timers.push(window.setTimeout(()=>{if(!srRandomNavigationCurrent(request))return;try{window.location.href=href;}catch(_){}},60));request.timers.push(window.setTimeout(()=>{if(!srRandomNavigationCurrent(request))return;try{window.location.assign(href);}catch(_){}},180));return true;}catch(_){}
if(!srRandomNavigationCurrent(request))return false;try{window.location.href=href;return true;}catch(_){}
if(!srRandomNavigationCurrent(request))return false;try{window.location.assign(href);return true;}catch(_){}
return false;}
function safePath(loc){const s0=String(loc||"");return(s0.split("#")[0]||s0).replace(/^\/+/,"");}
function fileBaseFromLocation(location){const loc=safePath(location);const file=(loc.split("/").pop()||"").replace(/\.html$/i,"");return file;}
function asStringList(x){if(!x)return[];if(Array.isArray(x))return x.map(String).filter(Boolean);if(typeof x==="string")return[x];return[];}
function getTagsFromDoc(d){const out=[];out.push(...asStringList(d&&d.tags));out.push(...asStringList(d&&d.tag));out.push(...asStringList(d&&d.meta&&d.meta.tags));out.push(...asStringList(d&&d.meta&&d.meta.tag));out.push(...asStringList(d&&d.meta&&d.meta["tags"]));return out.map(s=>String(s).trim()).filter(Boolean);}
function splitAliasPieces(raw){const src=normaliseText(stripHtml(String(raw||""))).replace(/\u00a0/g," ");if(!src)return[];return src.split(/\s*(?:,|;|•|·|\|)\s*/).map(s=>String(s||"").trim()).filter(Boolean);}
function extractAliasesFromText(raw){const htmlish=String(raw||"");if(!htmlish)return[];const withBreaks=htmlish.replace(/<br\s*\/?>/gi,"\n").replace(/<\/(?:p|div|li|tr|td|th|h[1-6])>/gi,"\n");const plain=stripHtml(withBreaks).replace(/\u00a0/g," ");if(!plain)return[];const out=[];const re=/(?:^|\n|\|)\s*aliases?\s*:\s*([^\n|]+)/ig;let m;while((m=re.exec(plain))){out.push(...splitAliasPieces(m[1]||""));}
return out;}
function latexMathToPlain(raw){let s=String(raw||"");if(!s)return"";s=s.replace(/\\begin\{[^}]+\}/g," ").replace(/\\end\{[^}]+\}/g," ").replace(/\\text\{([^}]*)\}/g," $1 ").replace(/\\mathrm\{([^}]*)\}/g," $1 ").replace(/\\operatorname\{([^}]*)\}/g," $1 ").replace(/\\left|\\right/g," ").replace(/\\[()\[\]]/g," ").replace(/\$\$([\s\S]*?)\$\$/g," $1 ").replace(/\$([^$]+)\$/g," $1 ").replace(/\\(?:displaystyle|textstyle|scriptstyle|scriptscriptstyle)\b/g," ").replace(/\\(?:qquad|quad|enspace|thinspace|medspace|thickspace)\b/g," ").replace(/\\([a-zA-Z]+)/g," $1 ").replace(/[{}_^]/g," ").replace(/[-–]+/g," - ").replace(/\s+/g," ").trim();return s;}
function buildAliasVariants(raw){const out=new Set();const addNorm=(s)=>{const n=normaliseForSearch(s);if(!n)return;out.add(n);out.add(n.replace(/\s+/g,""));out.add(n.replace(/\s+/g,"-"));};const src=String(raw||"");if(!src)return Array.from(out);addNorm(src);addNorm(stripHtml(src));addNorm(latexMathToPlain(src));const re=/\\\((.*?)\\\)|\\\[(.*?)\\\]|\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g;let m;while((m=re.exec(src))){const piece=m[1]||m[2]||m[3]||m[4]||"";if(piece)addNorm(latexMathToPlain(piece));}
const plainNorm=normaliseForSearch(latexMathToPlain(src));if(plainNorm){const toks=plainNorm.split(" ").filter(Boolean);if(toks.length>=2){addNorm(toks.join(" "));addNorm(toks.join("-"));}}
return Array.from(out).filter(Boolean);}
function getAliasesFromDoc(d){const raw=[];raw.push(...asStringList(d&&d.aliases));raw.push(...asStringList(d&&d.alias));raw.push(...asStringList(d&&d.meta&&d.meta.aliases));raw.push(...asStringList(d&&d.meta&&d.meta.alias));raw.push(...asStringList(d&&d.meta&&d.meta["aliases"]));const out=[];for(const item of raw)out.push(...splitAliasPieces(item));out.push(...extractAliasesFromText(d&&d.text));const seen=new Set();const deduped=[];for(const item of out){const s=String(item||"").trim();if(!s)continue;const key=s.toLowerCase();if(seen.has(key))continue;seen.add(key);deduped.push(s);}
return deduped;}
async function loadIndex(){const candidates=["search/search_index.json","/search/search_index.json","search_index.json"];const base=document.baseURI;for(const u of candidates){try{const url=new URL(u,base).toString();const request=__mkFetchSearchIndex(url,{cache:"no-cache"});const j=await request;if(j&&Array.isArray(j.docs))return j;for(const map of[window.__mkSharedJsonPromiseMap,window.__mkMaterialSearchIndexPromises]){if(map&&map[url]===request)delete map[url];}}catch(_){}}
throw new Error("Could not load the search index");}
function isIndexPage(loc){const path=safePath(loc);if(!path)return true;if(path.endsWith("/"))return true;const base=(path.split("/").pop()||"").toLowerCase();return base==="index.html"||base==="index.md";}
function isRandomPage(loc){const path=safePath(loc);if(!path)return false;const base=(path.split("/").pop()||"").toLowerCase().replace(/\.html$/i,"");if(base==="random")return true;if(/^random-\d/.test(base))return true;return false;}
function isUtilityPage(loc){const base=fileBaseFromLocation(loc).toLowerCase();return base==="find"||base==="custom-random"||base==="search"||base==="tags";}
function isConceptPageLocation(loc){const path=safePath(loc);if(!path)return false;if(path.endsWith("/"))return false;if(/^assets\//i.test(path))return false;const segs=path.split("/").filter(Boolean);if(segs.length<3)return false;if(isIndexPage(path))return false;if(isRandomPage(path))return false;if(isUtilityPage(path))return false;return true;}
function aggregateDocsToPages(docs){const pageMap=new Map();for(const d of docs||[]){const locFull=String(d.location||"");if(!locFull)continue;const pageLoc=safePath(locFull);if(!pageLoc)continue;if(!isConceptPageLocation(pageLoc))continue;let entry=pageMap.get(pageLoc);if(!entry){entry={location:pageLoc,title:"",text:"",tags:new Set(),aliases:new Set(),rawAliases:new Set(),};pageMap.set(pageLoc,entry);}
if(!entry.title&&d.title)entry.title=String(d.title);for(const tg of getTagsFromDoc(d))entry.tags.add(tg);for(const al of getAliasesFromDoc(d)){const rawAlias=String(al||"").trim();if(rawAlias)entry.rawAliases.add(rawAlias);entry.aliases.add(rawAlias);for(const v of buildAliasVariants(rawAlias))entry.aliases.add(v);}
const anchor=locFull.includes("#")?(locFull.split("#")[1]||"").toLowerCase():"";const isNoisySection=anchor==="prerequisites"||anchor.startsWith("prerequisites-")||anchor==="related-concepts"||anchor.startsWith("related-concepts-");if(!isNoisySection&&d.text){entry.text+=" "+normaliseText(stripHtml(d.text));}}
for(const e of pageMap.values()){if(!e.title){const file=e.location.split("/").pop()||"Untitled";e.title=file.replace(/\.html$/i,"").replace(/-/g," ");}}
return Array.from(pageMap.values()).map(e=>({location:e.location,title:e.title,text:e.text,tags:Array.from(e.tags),aliases:Array.from(e.aliases),rawAliases:Array.from(e.rawAliases||[]),}));}
function matchCourseToken(pageDoc,term){const token=String(term||"").trim().toLowerCase();const unit=token.match(/^([a-z][a-z0-9]*)-(week|lecture)(\d{1,3})$/);const code=unit?unit[1]:token;if(!Object.prototype.hasOwnProperty.call(COURSE_MAP,code))return null;const tags=Array.isArray(pageDoc.tags)?pageDoc.tags:[];return tags.some((raw)=>{const tag=String(raw||"").trim().toLowerCase();if(!unit)return tag===code||tag.startsWith(`${code}-`);const actual=tag.match(/^([a-z][a-z0-9]*)-(week|lecture)(\d{1,3})$/);return!!actual&&actual[1]===code&&actual[2]===unit[2]&&Number(actual[3])===Number(unit[3]);});}
function matchTerm(pageDoc,term){const courseMatch=matchCourseToken(pageDoc,term);if(courseMatch!==null)return courseMatch;const toks=tokeniseQuery(term);if(!toks.length)return false;const loc=String(pageDoc.location||"");const title=String(pageDoc.title||"");const text=String(pageDoc.text||"");const fileBase=fileBaseFromLocation(loc);const tags=Array.isArray(pageDoc.tags)?pageDoc.tags.join(" "):"";const aliases=Array.isArray(pageDoc.aliases)?pageDoc.aliases.join(" "):"";const hay=normaliseForSearch(`${fileBase} ${title} ${tags} ${aliases} ${text} ${loc}`);for(const t of toks){if(!hay.includes(t))return false;}
return true;}
function tokenizeExpr(exprText){const raw=String(exprText||"").trim();if(!raw)return[];const parts=raw.match(/"(?:\\.|[^"\\])*"(?=\s|[()]|$)|[()]|[^\s()]+/g)||[];const toks=[];for(const p of parts){if(p.startsWith('"')&&p.endsWith('"')){try{toks.push({k:"TERM",v:JSON.parse(p)});continue;}catch(_){}}
const up=p.toUpperCase();if(p==="(")toks.push({k:"LP",v:"("});else if(p===")")toks.push({k:"RP",v:")"});else if(up==="AND"||up==="OR")toks.push({k:"OP",v:up});else toks.push({k:"TERM",v:p});}
return toks;}
function validateTokens(tokens){if(!tokens.length)return{ok:false,msg:"Empty expression."};let bal=0;let expect="VALUE";function label(t){if(!t)return"";if(t.k==="TERM")return`token '${t.v}'`;if(t.k==="OP")return`operator '${t.v}'`;if(t.k==="LP")return"'('";if(t.k==="RP")return"')'";return"token";}
for(let i=0;i<tokens.length;i++){const t=tokens[i];const prev=i>0?tokens[i-1]:null;if(expect==="VALUE"){if(t.k==="TERM"){expect="OP";continue;}
if(t.k==="LP"){bal++;expect="VALUE";continue;}
if(t.k==="RP"){if(prev&&prev.k==="LP")return{ok:false,msg:"Empty parentheses '()' are not allowed."};if(prev&&prev.k==="OP")return{ok:false,msg:`Missing token after ${label(prev)}.`};return{ok:false,msg:"Missing token before ')'."};}
if(t.k==="OP"){if(!prev)return{ok:false,msg:`Expression cannot start with ${label(t)}.`};return{ok:false,msg:`Missing token before ${label(t)}.`};}}else{if(t.k==="OP"){expect="VALUE";continue;}
if(t.k==="RP"){bal--;if(bal<0)return{ok:false,msg:"Unmatched ')'."};expect="OP";continue;}
if(t.k==="TERM")return{ok:false,msg:`Missing operator between ${label(prev)} and ${label(t)}.`};if(t.k==="LP")return{ok:false,msg:`Missing operator before '(' (between ${label(prev)} and '(').`};}}
if(bal!==0)return{ok:false,msg:"Unclosed '('."};if(expect!=="OP"){const last=tokens[tokens.length-1];if(last&&last.k==="OP")return{ok:false,msg:`Missing token after ${label(last)}.`};if(last&&last.k==="LP")return{ok:false,msg:"Unclosed '('."};return{ok:false,msg:"Expression cannot end here: add a token."};}
return{ok:true,msg:""};}
function toRpn(tokens){const prec={AND:2,OR:1};const output=[];const ops=[];for(const t of tokens){if(t.k==="TERM")output.push(t);else if(t.k==="LP")ops.push(t);else if(t.k==="RP"){while(ops.length&&ops[ops.length-1].k!=="LP")output.push(ops.pop());if(!ops.length)return null;ops.pop();}else if(t.k==="OP"){while(ops.length&&ops[ops.length-1].k==="OP"&&prec[ops[ops.length-1].v]>=prec[t.v]){output.push(ops.pop());}
ops.push(t);}}
while(ops.length){const top=ops.pop();if(top.k==="LP"||top.k==="RP")return null;output.push(top);}
return output;}
function rpnToAst(rpn){const st=[];for(const t of rpn){if(t.k==="TERM")st.push({type:"TERM",term:t.v});else if(t.k==="OP"){const b=st.pop();const a=st.pop();if(!a||!b)return null;st.push({type:"OP",op:t.v,left:a,right:b});}}
return st.length===1?st[0]:null;}
function astToInfixWithParens(ast,parentOp=null,side=null){if(!ast)return"";if(ast.type==="TERM")return`"${String(ast.term)}"`;const prec={AND:2,OR:1};const myOp=ast.op;const left=astToInfixWithParens(ast.left,myOp,"L");const right=astToInfixWithParens(ast.right,myOp,"R");let s=`${left} ${myOp} ${right}`;let needParen=false;if(parentOp){if(prec[parentOp]>prec[myOp])needParen=true;if(parentOp==="OR"&&myOp==="AND")needParen=true;}
return needParen?`(${s})`:s;}
function evalAst(ast,doc,cache){if(ast.type==="TERM"){const key=ast.term;let ok;if(cache.has(key))ok=cache.get(key);else{ok=matchTerm(doc,key);cache.set(key,ok);}
return ok?{ok:true,hits:new Set([key])}:{ok:false,hits:new Set()};}
const L=evalAst(ast.left,doc,cache);const R=evalAst(ast.right,doc,cache);if(ast.op==="AND"){if(!L.ok||!R.ok)return{ok:false,hits:new Set()};const s=new Set(L.hits);for(const x of R.hits)s.add(x);return{ok:true,hits:s};}
if(L.ok&&R.ok){const s=new Set(L.hits);for(const x of R.hits)s.add(x);return{ok:true,hits:s};}
if(L.ok)return L;if(R.ok)return R;return{ok:false,hits:new Set()};}
const state={pageDocs:[],hits:[],selectedMap:{},currentExpr:"",hint:"",viewsError:"",page:1,pageSize:10,selfTestMode:false,aiTestMode:false,masteryFilter:srDefaultMasteryFilter(),sortKey:"best",sortDir:"desc",};function pickRandomSelected(pool=srFilteredHits(state.hits).filter(x=>state.selectedMap[x.doc.location])){pool=srLearningHits(pool);if(!pool.length)return null;return pool[Math.floor(Math.random()*pool.length)].doc;}
function loadRandomMode(){try{const raw=String(sessionStorage.getItem(RANDOM_MODE_KEY)||"").toLowerCase();if(raw==="ai"||raw==="self"||raw==="normal")return raw;return sessionStorage.getItem(SELF_TEST_MODE_KEY)==="1"?"self":"normal";}catch(_){return"normal";}}
function setRandomMode(mode){const m=(mode==="ai"||mode==="self")?mode:"normal";try{sessionStorage.setItem(RANDOM_MODE_KEY,m);if(m==="self")sessionStorage.setItem(SELF_TEST_MODE_KEY,"1");else sessionStorage.removeItem(SELF_TEST_MODE_KEY);if(m!=="ai")sessionStorage.removeItem(RANDOM_AI_NAV_FLAG);}catch(_){}
state.selfTestMode=m==="self";state.aiTestMode=m==="ai";}
function loadSelfTestMode(){return loadRandomMode()==="self";}
function loadAiTestMode(){return loadRandomMode()==="ai";}
function srBuildResultRowHtml(x,root){const d=(x&&x.doc)||{};const href=new URL(String(d.location||""),root).toString();const lec=lectureInfoFromTags(d.tags);const courseName=lec?(lec.courseName||srCourseLabelFromLocation(d.location)):"";const metaHtml=lec?`${courseName ? `<span class="csr-course">${escapeHtml(courseName)}</span><span class="csr-meta-sep"aria-hidden="true">·</span>` : ""}<span class="csr-lecture-no">${escapeHtml(lec.unitLabel || `Lecture ${lec.lectureNum}`)}</span>`:"";const checked=state.selectedMap&&state.selectedMap[d.location]?"checked":"";return`
    <div class="csr-row csr-row--select">
      <label class="csr-check">
        <input type="checkbox"
               aria-label="Select ${escapeHtml(d.title || 'Untitled')}"
               data-loc="${escapeHtml(d.location || "")}"
               ${checked}>
      </label>
      <a class="csr-link" href="${href}">
        ${escapeHtml(d.title || "Untitled")}
      </a>
      <div class="csr-lecture">
        ${metaHtml}
      </div>
    </div>
  `;}
function srBuildPagerHtml(totalPages,curPage){return buildPageButtons(totalPages,curPage).map(x=>{if(x==="…")return`<span class="csr-page-ellipsis">…</span>`;const n=x;const active=n===curPage?"is-active":"";return`<button type="button" class="csr-page ${active}" data-page="${n}"${active ? ' aria-current="page"' : ''}>${n}</button>`;}).join("");}
function srBuildFooterHtml(total,start,end,totalPages,pagerBtns){return`
    <div class="csr-foot">
      <div class="csr-showing">Showing ${total ? (start + 1) : 0}-${end} of ${total}</div>

      <div class="csr-pager">
        <button type="button" class="md-button csr-prev" aria-label="Previous page" ${state.page <= 1 ? "disabled" : ""}>
          <span class="csr-pagerbtn__ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
              <path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="csr-pagerbtn__txt">Prev</span>
        </button>
        <div class="csr-pages">${pagerBtns}</div>
        <button type="button" class="md-button csr-next" aria-label="Next page" ${state.page >= totalPages ? "disabled" : ""}>
          <span class="csr-pagerbtn__txt">Next</span>
          <span class="csr-pagerbtn__ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
              <path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  `;}
function srReadLpFindScrollRequest(){let fromStorage=null;try{const raw=sessionStorage.getItem(SR_LP_FIND_SCROLL_KEY)||"";if(raw){let obj=null;try{obj=JSON.parse(raw);}catch(_){obj={q:raw};}
if(obj&&typeof obj==="object"){const ts=Number(obj.ts)||0;if(!ts||Date.now()-ts<=90000){const q=String(obj.q||"").trim().replace(/\s+/g," ");if(q)fromStorage=Object.assign({},obj,{q,source:obj.source||"learning-path"});}else{try{sessionStorage.removeItem(SR_LP_FIND_SCROLL_KEY);}catch(_){}}}}}catch(_){}
if(fromStorage)return fromStorage;try{const url=new URL(window.location.href);const hash=String(url.hash||"").replace(/^#/,"");const wantsHash=hash==="search-results"||hash==="find-results"||hash==="results";if(!wantsHash)return null;const q=String(url.searchParams.get("lp_token")||url.searchParams.get("q")||"").trim().replace(/\s+/g," ");return{q,source:"learning-path-hash",ts:Date.now()};}catch(_){return null;}}
function srConsumeLpFindScrollRequest(){try{sessionStorage.removeItem(SR_LP_FIND_SCROLL_KEY);}catch(_){}
try{const url=new URL(window.location.href);const hash=String(url.hash||"").replace(/^#/,"");if(hash==="search-results"||hash==="find-results"||hash==="results"){url.hash="";history.replaceState(history.state||{},"",url.toString());}}catch(_){}}
function srHeaderOffsetPx(){let h=0;try{const headers=Array.from(document.querySelectorAll(".md-header, .md-tabs, #current-course-bar"));for(const el of headers){if(!el||!el.getBoundingClientRect)continue;const cs=window.getComputedStyle?window.getComputedStyle(el):null;if(!cs||(cs.position!=="fixed"&&cs.position!=="sticky"))continue;const r=el.getBoundingClientRect();if(r&&r.height>0&&r.bottom>0&&r.top<window.innerHeight){h=Math.max(h,Math.ceil(r.bottom));}}}catch(_){}
return Math.max(0,h);}
function srResultsScrollTarget(container){try{const root=container&&container.querySelector?container:document.getElementById("search-results");if(!root||!root.getBoundingClientRect)return null;return(root.querySelector(".csr-actions")||root.querySelector(".csr-wrap")||root);}catch(_){return null;}}
function srScrollToResultsTop(container){try{const target=srResultsScrollTarget(container);if(!target||!target.getBoundingClientRect)return false;const r=target.getBoundingClientRect();if(!r||(!r.width&&!r.height))return false;const yNow=window.scrollY||window.pageYOffset||0;const pad=12;const top=Math.max(0,yNow+r.top-srHeaderOffsetPx()-pad);try{window.scrollTo({top,left:0,behavior:"auto"});}
catch(_){try{window.scrollTo(0,top);}catch(__){}}
try{document.documentElement&&(document.documentElement.scrollTop=top);}catch(_){}
try{document.body&&(document.body.scrollTop=top);}catch(_){}
return true;}catch(_){return false;}}
function srFindResultsLookReady(container){try{const root=container&&container.querySelector?container:document.getElementById("search-results");if(!root)return false;if(!root.querySelector(".csr-actions, .csr-wrap"))return false;if(String(state.currentExpr||"").trim())return true;if(Array.isArray(state.hits)&&state.hits.length)return true;if(root.querySelector(".csr-list, .csr-empty, .csr-foot"))return true;return false;}catch(_){return false;}}
let __srLpFindScrollJob=null;let __srLpFindScrollCleanup=null;function srCleanupLpFindScrollJob(){try{if(typeof __srLpFindScrollCleanup==="function")__srLpFindScrollCleanup();}catch(_){}
__srLpFindScrollCleanup=null;}
function srFinishLpFindScrollJob(jobId,consumeRequest){if(jobId&&__srLpFindScrollJob!==jobId)return;srCleanupLpFindScrollJob();if(consumeRequest)srConsumeLpFindScrollRequest();if(!jobId||__srLpFindScrollJob===jobId)__srLpFindScrollJob=null;}
function srInstallLpFindScrollUserCancel(jobId){srCleanupLpFindScrollJob();const cancel=(ev)=>{if(__srLpFindScrollJob!==jobId)return;if(ev&&ev.type==="keydown"){const key=String(ev.key||"");if(!["ArrowDown","ArrowUp","PageDown","PageUp","Home","End"," ","Spacebar"].includes(key))return;}
srFinishLpFindScrollJob(jobId,true);};const opts={passive:true,capture:true};try{window.addEventListener("wheel",cancel,opts);}catch(_){}
try{window.addEventListener("touchstart",cancel,opts);}catch(_){}
try{window.addEventListener("touchmove",cancel,opts);}catch(_){}
try{window.addEventListener("pointerdown",cancel,opts);}catch(_){}
try{window.addEventListener("keydown",cancel,true);}catch(_){}
__srLpFindScrollCleanup=()=>{try{window.removeEventListener("wheel",cancel,opts);}catch(_){}
try{window.removeEventListener("touchstart",cancel,opts);}catch(_){}
try{window.removeEventListener("touchmove",cancel,opts);}catch(_){}
try{window.removeEventListener("pointerdown",cancel,opts);}catch(_){}
try{window.removeEventListener("keydown",cancel,true);}catch(_){}};}
function srScheduleLpFindResultScroll(container,req){const request=req||srReadLpFindScrollRequest();if(!request)return;const q=String(request.q||"").trim().toLowerCase();const jobId=`${Date.now()}_${Math.random().toString(16).slice(2)}`;__srLpFindScrollJob=jobId;srInstallLpFindScrollUserCancel(jobId);const delays=[0,32,80,160,320,560,900,1200];let didScroll=false;let finishScheduled=false;const currentSearchResults=()=>{return(container&&container.isConnected)?container:document.getElementById("search-results");};const scheduleFinishAfterOneVerification=()=>{if(finishScheduled)return;finishScheduled=true;const finish=()=>{if(__srLpFindScrollJob!==jobId)return;const currentContainer=currentSearchResults();if(currentContainer)srScrollToResultsTop(currentContainer);srFinishLpFindScrollJob(jobId,true);};try{requestAnimationFrame(()=>requestAnimationFrame(finish));}catch(_){window.setTimeout(finish,32);}};const attempt=(isLast)=>{if(__srLpFindScrollJob!==jobId)return;if(!isOnFindPage()){srFinishLpFindScrollJob(jobId,false);return;}
const currentContainer=currentSearchResults();if(!currentContainer)return;const expr=String(state.currentExpr||"").trim().toLowerCase();if(q&&expr&&expr.indexOf(q)<0){if(isLast)srFinishLpFindScrollJob(jobId,true);return;}
if(!srFindResultsLookReady(currentContainer)&&!isLast)return;if(srScrollToResultsTop(currentContainer)){didScroll=true;scheduleFinishAfterOneVerification();return;}
if(isLast){srFinishLpFindScrollJob(jobId,didScroll);}};delays.forEach((ms,idx)=>{window.setTimeout(()=>attempt(idx===delays.length-1),ms);});try{requestAnimationFrame(()=>{attempt(false);requestAnimationFrame(()=>attempt(false));});}catch(_){}}
function srMaybeScrollToResultsFromLearningPath(container){const req=srReadLpFindScrollRequest();if(!req)return;srScheduleLpFindResultScroll(container,req);}
function srStableMeasure(container){if(!container)return;try{const wrap=container.querySelector(".csr-wrap")||container;const list=container.querySelector(".csr-list");if(list){const h=Math.ceil(list.getBoundingClientRect().height||list.offsetHeight||0);const prev=Number(container.dataset.srStableListMinH||0);const next=Math.max(prev,h);if(next>0){container.dataset.srStableListMinH=String(next);wrap.style.setProperty("--csr-stable-list-min-h",next+"px");}}
const actions=container.querySelector(".csr-actions");if(actions){const h=Math.ceil(actions.getBoundingClientRect().height||actions.offsetHeight||0);const prev=Number(container.dataset.srStableActionsMinH||0);const next=Math.max(prev,h);if(next>0){container.dataset.srStableActionsMinH=String(next);wrap.style.setProperty("--csr-stable-actions-min-h",next+"px");}}}catch(_){}}
function srBindListAndPager(container,totalPages){const prev=container.querySelector(".csr-prev");if(prev)prev.addEventListener("click",()=>{if(state.page>1)state.page-=1;renderResults(container);});const next=container.querySelector(".csr-next");if(next)next.addEventListener("click",()=>{state.page=Math.min(totalPages,state.page+1);renderResults(container);});container.querySelectorAll(".csr-page").forEach(btn=>{btn.addEventListener("click",()=>{const n=parseInt(btn.getAttribute("data-page"),10);if(!Number.isFinite(n))return;state.page=n;renderResults(container);});});container.querySelectorAll('input[type="checkbox"][data-loc]').forEach(cb=>{cb.addEventListener("change",()=>{const loc=cb.getAttribute("data-loc");if(!loc)return;state.selectedMap=state.selectedMap||{};state.selectedMap[loc]=cb.checked;});});}
function srUpdateResultsListOnly(container){if(!container)return;srStableMeasure(container);const filteredHits=srFilteredHits(state.hits);const total=filteredHits.length;const pageSize=state.pageSize||10;const totalPages=Math.max(1,Math.ceil(total/pageSize));state.page=Math.min(Math.max(1,state.page),totalPages);const sorted=getSortedHits(filteredHits);const start=(state.page-1)*pageSize;const end=Math.min(total,start+pageSize);const pageHits=sorted.slice(start,start+pageSize);const root=new URL(document.baseURI);const listEl=container.querySelector(".csr-list");if(listEl)listEl.innerHTML=pageHits.map(x=>srBuildResultRowHtml(x,root)).join("")||``;const oldFoot=container.querySelector(".csr-foot");if(oldFoot)oldFoot.outerHTML=srBuildFooterHtml(total,start,end,totalPages,srBuildPagerHtml(totalPages,state.page));srBindListAndPager(container,totalPages);typesetMath(container.querySelector(".csr-list")||container);srStableMeasure(container);}
function renderResults(container){srCancelRandomNavigation();srEnsureMasteryFilterStylesOnce();if(String(state.currentExpr||"").trim()&&!(state.hits&&state.hits.length)){container.innerHTML=`
      <div class="sr-top">
        <div class="sr-top__title">Search results</div>
        <div class="sr-top__q">${escapeHtml(state.currentExpr)}</div>
      </div>
      <div class="sr-empty" role="status"><p>No results found.</p></div>
    `;typesetMath(container);srMaybeScrollToResultsFromLearningPath(container);return;}
const filteredHits=srFilteredHits(state.hits);const total=filteredHits.length;const pageSize=state.pageSize||10;const totalPages=Math.max(1,Math.ceil(total/pageSize));state.page=Math.min(Math.max(1,state.page),totalPages);const sorted=getSortedHits(filteredHits);const start=(state.page-1)*pageSize;const end=Math.min(total,start+pageSize);const pageHits=sorted.slice(start,start+pageSize);const titleActive=(state.sortKey||"title")==="title";const lectureActive=state.sortKey==="lecture";const dir=state.sortDir||"asc";const pagerBtns=buildPageButtons(totalPages,state.page).map(x=>{if(x==="…")return`<span class="csr-page-ellipsis">…</span>`;const n=x;const active=n===state.page?"is-active":"";return`<button type="button" class="csr-page ${active}" data-page="${n}"${active ? ' aria-current="page"' : ''}>${n}</button>`;}).join("");const root=new URL(document.baseURI);const headerHtml=`
  <div class="csr-cols csr-colheads">
    <div class="csr-colhead">Title</div>
    <div class="csr-colhead csr-colhead--right">Course · Lecture/Week</div>
  </div>
`;const actionsHtml=`
  <div class="csr-actions csr-actions--v3">
    <button type="button" class="md-button md-button--primary cr-dice-btn csr-action-start" id="cr-random">
      <span class="cr-dice__ico" aria-hidden="true">${diceSvg(readLastFace())}</span>
      <span class="cr-dice__txt">Start random</span>
    </button>

    <label class="csr-selftest ${srHasShopItem(SR_SELF_TEST_ITEM_ID) ? "" : "is-locked"}" title="${srHasShopItem(SR_SELF_TEST_ITEM_ID) ? "" : `Unlock ${SR_SELF_TEST_ITEM_TITLE}· ${SR_SELF_TEST_ITEM_PRICE}EORbits`}">
      <input type="checkbox" id="cr-selftest" ${state.selfTestMode ? "checked" : ""}>
      <span>Self-test mode</span>
    </label>

    <label class="csr-aitest ${srHasShopItem(SR_AI_ITEM_ID) ? "" : "is-locked"}" title="${srHasShopItem(SR_AI_ITEM_ID) ? "" : `Unlock ${SR_AI_ITEM_TITLE}· ${SR_AI_ITEM_PRICE}EORbits`}">
      <input type="checkbox" id="cr-aitest" ${state.aiTestMode ? "checked" : ""}>
      <span>AI-test mode</span>
    </label>

    <div class="csr-select-actions">
      <button type="button" class="md-button" id="cr-all">Select all</button>
      <button type="button" class="md-button" id="cr-none">Select none</button>
    </div>

    <div class="csr-action-sort">
      ${srRenderSortDropdownHtml()}
    </div>

    ${srRenderMasteryFilterHtml()}
  </div>
`;const listHtml=pageHits.map(x=>{const d=x.doc||{};const href=new URL(String(d.location||""),root).toString();const lec=lectureInfoFromTags(d.tags);const courseName=lec?(lec.courseName||srCourseLabelFromLocation(d.location)):"";const metaHtml=lec?`${courseName ? `<span class="csr-course">${escapeHtml(courseName)}</span><span class="csr-meta-sep"aria-hidden="true">·</span>` : ""}<span class="csr-lecture-no">${escapeHtml(lec.unitLabel || `Lecture ${lec.lectureNum}`)}</span>`:"";const checked=state.selectedMap&&state.selectedMap[d.location]?"checked":"";return`
    <div class="csr-row csr-row--select">
      <label class="csr-check">
        <input type="checkbox"
               aria-label="Select ${escapeHtml(d.title || 'Untitled')}"
               data-loc="${escapeHtml(d.location || "")}"
               ${checked}>
      </label>
      <a class="csr-link" href="${href}">
        ${escapeHtml(d.title || "Untitled")}
      </a>
      <div class="csr-lecture">
        ${metaHtml}
      </div>
    </div>
  `;}).join("");const footerHtml=`
    <div class="csr-foot">
      <div class="csr-showing">Showing ${total ? (start + 1) : 0}-${end} of ${total}</div>

      <div class="csr-pager">
        <button type="button" class="md-button csr-prev" aria-label="Previous page" ${state.page <= 1 ? "disabled" : ""}>
          <span class="csr-pagerbtn__ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
              <path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="csr-pagerbtn__txt">Prev</span>
        </button>
        <div class="csr-pages">${pagerBtns}</div>
        <button type="button" class="md-button csr-next" aria-label="Next page" ${state.page >= totalPages ? "disabled" : ""}>
          <span class="csr-pagerbtn__txt">Next</span>
          <span class="csr-pagerbtn__ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
              <path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  `;const hasResults=state.hits&&state.hits.length>0;container.innerHTML=`
  <div class="csr-wrap ${hasResults ? "is-visible" : "is-hidden"}">
    ${actionsHtml}
    ${state.viewsError ? `<p class="sr-loading"role="status">${escapeHtml(state.viewsError)}</p>` : ""}
    ${headerHtml}
    <div class="csr-list">
      ${listHtml || ``}
    </div>
    ${footerHtml}
  </div>
`;srStableMeasure(container);const btnAll=container.querySelector("#cr-all");if(btnAll)btnAll.addEventListener("click",()=>{state.selectedMap=state.selectedMap||{};for(const x of srFilteredHits(state.hits))state.selectedMap[x.doc.location]=true;renderResults(container);});const btnNone=container.querySelector("#cr-none");if(btnNone)btnNone.addEventListener("click",()=>{state.selectedMap=state.selectedMap||{};for(const x of srFilteredHits(state.hits))state.selectedMap[x.doc.location]=false;renderResults(container);});const cbSelf=container.querySelector("#cr-selftest");const cbAi=container.querySelector("#cr-aitest");if(cbSelf)cbSelf.addEventListener("change",async()=>{if(cbSelf.checked){if(!(await srEnsureSelfTestUnlocked("find-self-test-toggle"))){cbSelf.checked=false;setRandomMode(cbAi&&cbAi.checked?"ai":"normal");return;}
if(cbAi)cbAi.checked=false;setRandomMode("self");}else{setRandomMode(cbAi&&cbAi.checked?"ai":"normal");}});if(cbAi)cbAi.addEventListener("change",async()=>{if(cbAi.checked){if(!(await srEnsureAiUnlocked("find-ai-test-toggle"))){cbAi.checked=false;setRandomMode(cbSelf&&cbSelf.checked?"self":"normal");return;}
if(cbSelf)cbSelf.checked=false;setRandomMode("ai");}else{setRandomMode(cbSelf&&cbSelf.checked?"self":"normal");}});container.querySelectorAll('input[data-mastery-filter]').forEach(cb=>{cb.addEventListener("change",()=>{const key=cb.getAttribute("data-mastery-filter")||"";if(!key)return;state.masteryFilter=state.masteryFilter||srDefaultMasteryFilter();state.masteryFilter[key]=!!cb.checked;srWriteMasteryFilter(state.masteryFilter);state.page=1;srUpdateResultsListOnly(container);});});const btnRandom=container.querySelector("#cr-random");if(btnRandom&&btnRandom.dataset.crDiceBound!=="1"){btnRandom.dataset.crDiceBound="1";const ico=btnRandom.querySelector(".cr-dice__ico");if(ico)setDiceFace(ico,readLastFace());if(ico&&isHoverPointer()){btnRandom.addEventListener("mouseenter",()=>{if(__srDiceState.navigating)return;beginHoverRoll(ico,__srDiceState);});btnRandom.addEventListener("mouseleave",()=>{if(__srDiceState.navigating)return;freezeToRandomFace(ico,__srDiceState);});}
btnRandom.addEventListener("click",async(e)=>{e.preventDefault();e.stopPropagation();if(__srDiceState.navigating)return;const request=srBeginRandomNavigation(container,btnRandom);let committed=false;try{if(state.aiTestMode&&!(await srEnsureAiUnlocked("find-start-ai-test")))return;if(!srRandomNavigationCurrent(request))return;if(state.selfTestMode&&!(await srEnsureSelfTestUnlocked("find-start-self-test")))return;if(!srRandomNavigationCurrent(request))return;const pool=srLearningHits(srFilteredHits(state.hits)).filter(x=>state.selectedMap[x.doc.location]);const locs=pool.map(x=>x.doc.location);const mode=state.aiTestMode?"ai":(state.selfTestMode?"self":"normal");const picked=pickRandomSelected(pool);if(!picked){let notice=container.querySelector('.sr-random-notice');if(!notice){notice=document.createElement('p');notice.className='sr-random-notice';notice.setAttribute('role','status');container.appendChild(notice);}
notice.textContent='Select at least one current course concept to start random study. Supplementary pages remain available through their links.';return;}
const targetUrl=toAbsoluteUrl(picked.location);if(!targetUrl)return;if(!srConsumeGuestAction("random",{source:"find-start-random",title:"Start random",dedupeMs:2500}))return;try{btnRandom.disabled=true;btnRandom.setAttribute("aria-disabled","true");btnRandom.style.pointerEvents="none";}catch(_){}
try{stopHoverRoll(__srDiceState);}catch(_){}
let face=readLastFace();try{if(ico){if(isHoverPointer())face=freezeToRandomFace(ico,__srDiceState);else face=await rollDiceOnce(ico,{frames:14,interval:55});}}catch(_){}
if(!srRandomNavigationCurrent(request))return;await sleep(250);if(!srRandomNavigationCurrent(request))return;try{sessionStorage.setItem("random_custom_candidates_v1",JSON.stringify(locs));}catch(_){}
try{sessionStorage.setItem("random_custom_page_v1",window.location.href);}catch(_){}
try{sessionStorage.setItem("random_custom_nav_flag_v1","1");}catch(_){}
try{sessionStorage.setItem(RANDOM_MODE_KEY,mode);if(mode==="self"){sessionStorage.setItem(SELF_TEST_MODE_KEY,"1");sessionStorage.setItem(SELF_TEST_NAV_FLAG,"1");sessionStorage.removeItem(RANDOM_AI_NAV_FLAG);}else if(mode==="ai"){sessionStorage.removeItem(SELF_TEST_MODE_KEY);sessionStorage.removeItem(SELF_TEST_NAV_FLAG);sessionStorage.setItem(RANDOM_AI_NAV_FLAG,"1");}else{sessionStorage.removeItem(SELF_TEST_MODE_KEY);sessionStorage.removeItem(SELF_TEST_NAV_FLAG);sessionStorage.removeItem(RANDOM_AI_NAV_FLAG);}}catch(_){}
try{const arrivalId=String(Date.now())+"_"+Math.random().toString(16).slice(2);sessionStorage.setItem("random_arrival_id_v1",arrivalId);sessionStorage.setItem("random_arrival_loc_v1",String(picked.location||"").split("#")[0].replace(/^\/+/,""));}catch(_){}
try{writeLastFace(face);}catch(_){}
committed=srNavigateToTarget(targetUrl,request);}finally{if(!committed&&__srRandomNavigation===request)srCancelRandomNavigation();}});}
srEnsureSortDropdownStylesOnce();srEnsureSortDropdownBinding(container);const prev=container.querySelector(".csr-prev");if(prev)prev.addEventListener("click",()=>{if(state.page>1)state.page-=1;renderResults(container);});const next=container.querySelector(".csr-next");if(next)next.addEventListener("click",()=>{state.page=Math.min(totalPages,state.page+1);renderResults(container);});container.querySelectorAll(".csr-page").forEach(btn=>{btn.addEventListener("click",()=>{const n=parseInt(btn.getAttribute("data-page"),10);if(!Number.isFinite(n))return;state.page=n;renderResults(container);});});container.querySelectorAll('input[type="checkbox"][data-loc]').forEach(cb=>{cb.addEventListener("change",()=>{const loc=cb.getAttribute("data-loc");if(!loc)return;state.selectedMap=state.selectedMap||{};state.selectedMap[loc]=cb.checked;});});typesetMath(container);srMaybeScrollToResultsFromLearningPath(container);}
function exposeApi(container,context){window.__findSearchV2=window.__findSearchV2||{};window.__findSearchV2.matchCourseToken=matchCourseToken;window.__findSearchV2.clearEmptyResults=()=>{if(context&&!srSearchContextCurrent(context))return false;if(!container.querySelector(".sr-empty"))return false;if(context){context.queryVersion+=1;context.pendingExpr="";}
state.currentExpr="";state.hits=[];state.selectedMap={};container.innerHTML="";return true;};window.__findSearchV2.runLogicExpr=(exprText)=>{if(context&&!srSearchContextCurrent(context))return false;const raw=String(exprText||"").trim();if(context){context.queryVersion+=1;if(!context.ready){context.pendingExpr=raw;if(context.failed)main(context).catch(e=>console.warn("search-results:",e));return true;}}
state.currentExpr=raw;state.hint="";state.page=1;const toks=tokenizeExpr(raw);const v=validateTokens(toks);if(!v.ok){state.hits=[];state.selectedMap={};renderResults(container);return;}
const rpn=toRpn(toks);const ast=rpn?rpnToAst(rpn):null;if(!ast){state.hits=[];state.selectedMap={};renderResults(container);return;}
const hasParen=toks.some(t=>t.k==="LP"||t.k==="RP");const ops=toks.filter(t=>t.k==="OP").map(t=>t.v);const mixedOps=ops.includes("AND")&&ops.includes("OR");const termCount=toks.filter(t=>t.k==="TERM").length;if(!hasParen&&mixedOps&&termCount>=3){const suggested=astToInfixWithParens(ast);state.hint=`Did you mean: ${suggested}?`;}
const hit=[];const scoreDocKeyword=getScoreFn();for(const d of state.pageDocs){const cache=new Map();const r=evalAst(ast,d,cache);if(r.ok){const terms=Array.from(r.hits);const why=terms.join(", ");let score=0;let cov=0;for(const t of terms){score+=scoreDocKeyword(t,d);try{const c=scoreDocKeyword.coverage?scoreDocKeyword.coverage(t,d):0;if(c>cov)cov=c;}catch(_){}}
hit.push({doc:d,why,score,cov,__i:hit.length});}}
state.hits=hit;state.selectedMap={};for(const x of hit)state.selectedMap[x.doc.location]=true;renderResults(container);};}
async function main(retryContext){if(retryContext&&!srSearchContextCurrent(retryContext))return;const generation=++__srMainGeneration;if(!isOnFindPage())return;const container=document.getElementById("search-results");if(!container)return;const context={generation,container,path:window.location.pathname,ready:false,failed:false,queryVersion:0,pendingExpr:retryContext?retryContext.pendingExpr:null,};__srActiveContext=context;exposeApi(container,context);hardUnlockScroll();const unlockIfCurrent=()=>{if(srSearchContextCurrent(context))hardUnlockScroll();};requestAnimationFrame(unlockIfCurrent);setTimeout(unlockIfCurrent,60);container.innerHTML=`<div class="sr-loading">Loading search index…</div>`;if(window.renderMathInElement){window.renderMathInElement(container,{delimiters:[{left:"$$",right:"$$",display:true},{left:"$",right:"$",display:false},{left:"\\(",right:"\\)",display:false},{left:"\\[",right:"\\]",display:true},],throwOnError:false,});}else if(window.MathJax&&window.MathJax.typesetPromise){window.MathJax.typesetPromise([container]).catch(()=>{});}
let indexJson;try{indexJson=await loadIndex();}catch(_){if(srSearchContextCurrent(context)){context.failed=true;srRenderIndexError(container,context);}
return;}
if(!srSearchContextCurrent(context))return;const docs=indexJson&&Array.isArray(indexJson.docs)?indexJson.docs:[];state.pageDocs=aggregateDocsToPages(docs);state.selfTestMode=loadSelfTestMode();state.aiTestMode=loadAiTestMode();if(state.aiTestMode)state.selfTestMode=false;state.masteryFilter=srReadMasteryFilter();context.ready=true;state.hits=[];state.selectedMap={};state.currentExpr="";state.viewsError="";if(context.pendingExpr!==null)window.__findSearchV2.runLogicExpr(context.pendingExpr);else renderResults(container);function autoRunFromPendingToken(){const KEY_V2="find_pending_token_v2";const KEY_V1="find_pending_token_v1";let q="";let headerUrl=null;try{const url=new URL(window.location.href);if(url.searchParams.get("src")==="header_search_done")return;if(url.searchParams.get("src")==="header_search"){headerUrl=url;q=(url.searchParams.get("q")||"").trim();if(!q)return;}}catch(_){}
try{const raw2=(sessionStorage.getItem(KEY_V2)||"").trim();if(!q&&raw2){try{const obj=JSON.parse(raw2);if(obj&&typeof obj.q==="string"&&obj.q.trim())q=obj.q.trim();else q=raw2;}catch(_){q=raw2;}}}catch(_){}
if(!q){try{q=(sessionStorage.getItem(KEY_V1)||"").trim();}catch(_){}}
if(!q)return;try{sessionStorage.removeItem(KEY_V2);}catch(_){}
try{sessionStorage.removeItem(KEY_V1);}catch(_){}
const consumeHeaderUrl=()=>{if(!headerUrl)return;try{headerUrl.searchParams.delete("q");headerUrl.searchParams.set("src","header_search_done");window.history.replaceState(window.history.state,"",headerUrl.toString());}catch(_){}};if(context.pendingExpr!==null){consumeHeaderUrl();return;}
const fire=()=>{if(!srSearchContextCurrent(context)||context.queryVersion!==handoffQueryVersion)return false;try{consumeHeaderUrl();window.dispatchEvent(new CustomEvent("find:autofill",{detail:{token:q}}));return true;}catch(_){}
return false;};const handoffQueryVersion=context.queryVersion;if(window.__fbReadyV1){fire();return;}
let done=false;const onReady=()=>{if(done||!window.__fbReadyV1)return;done=true;try{window.removeEventListener("fb:ready",onReady);}catch(_){}
fire();};try{window.addEventListener("fb:ready",onReady,{once:true});}catch(_){}
setTimeout(()=>{if(!done)onReady();},800);}
autoRunFromPendingToken();}
function init(){main().catch((e)=>console.warn("search-results:",e));}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();document.addEventListener("DOMContentSwitch",()=>{srCancelRandomNavigation();init();});window.addEventListener("pagehide",srCancelRandomNavigation);window.addEventListener("pageshow",()=>{if(!isOnFindPage())return;hardUnlockScroll();srResetRandomButtonUi(document);const sequence=__srRandomNavigationSequence;const pageUrl=String(window.location.href);setTimeout(()=>{if(sequence!==__srRandomNavigationSequence||pageUrl!==String(window.location.href)||!isOnFindPage())return;hardUnlockScroll();srResetRandomButtonUi(document);},60);});})();