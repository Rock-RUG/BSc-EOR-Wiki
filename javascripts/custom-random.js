(function(){function __mkFetchSearchIndex(url,init){const shared=window.__mkFetchJsonShared;if(typeof shared==="function")return shared(url,init);return fetch(url,init).then(function(r){return r&&r.ok?r.json():null;});}
const TOKENS_KEY="random_custom_tokens_v1";const CANDS_KEY="random_custom_candidates_v1";const ENTRY_KEY="random_custom_page_v1";const TOKENMAP_KEY="random_custom_token_map_v1";const EXPAND_KEY="random_custom_expand_v1";const SELECT_KEY="random_custom_selected_v1";const SELFTEST_PREF_KEY="random_custom_selftest_pref_v1";const NAV_FLAG_KEY="random_custom_nav_flag_v1";const CR_SELF_TEST_ITEM_ID="self_test_mode";const CR_SELF_TEST_ITEM_TITLE="Self-test Mode";const CR_SELF_TEST_ITEM_PRICE=0;function crShopApi(){try{return window.MkAccountData||null;}catch(_){return null;}}
function crHasShopItem(itemId){try{if(itemId===CR_SELF_TEST_ITEM_ID)return true;const api=crShopApi();if(api&&typeof api.hasShopItem==="function")return!!api.hasShopItem(itemId);const xp=api&&typeof api.xp==="function"?api.xp():null;const owned=xp&&(xp.ownedShopItems||(xp.shopInventory&&xp.shopInventory.ownedIds));return Array.isArray(owned)&&owned.indexOf(itemId)>=0;}catch(_){return false;}}
function crEnsureSelfTestUnlocked(source){return Promise.resolve(true);}
function crInstallStylesOnce(){if(document.getElementById("mk-custom-random-shop-lock-style-v1"))return;const st=document.createElement("style");st.id="mk-custom-random-shop-lock-style-v1";st.textContent=`
      html[data-md-color-scheme="slate"] .cr-dice__ico,
      html[data-md-color-scheme="slate"] .cr-dice__ico svg,
      html[data-md-color-scheme="slate"] .cr-dice__ico svg *,
      body[data-md-color-scheme="slate"] .cr-dice__ico,
      body[data-md-color-scheme="slate"] .cr-dice__ico svg,
      body[data-md-color-scheme="slate"] .cr-dice__ico svg *{
        color:#fff !important;
        stroke:currentColor !important;
      }
      .cr-selftest-bar label.is-locked{ color:color-mix(in srgb,#f5c84b 82%,var(--md-default-fg-color)); }
      .cr-selftest-bar label.is-locked::after{ content:"🔒"; opacity:.75; font-size:.75em; }
    `;(document.head||document.documentElement).appendChild(st);}
try{crInstallStylesOnce();}catch(_){}
const LAST_FACE_KEY="random_custom_last_dice_face_v1";function queueCustomRandomXp(detail){try{const key="mk_xp_pending_activity_queue_v1";const arr=JSON.parse(localStorage.getItem(key)||"[]");arr.push({metric:"random_browse_start",details:detail||{},opts:{scope:`random_browse_start:${detail && (detail.path || detail.eventName || Date.now())}`,throttleMs:0},queuedAt:Date.now(),source:"custom-random-fallback"});localStorage.setItem(key,JSON.stringify(arr.slice(-300)));}catch(_){}}
function recordCustomRandomXp(detail){try{const d=Object.assign({source:"custom-random-page",path:location.pathname||""},detail||{});if(window.MkXpActivity&&typeof window.MkXpActivity.record==="function"){window.MkXpActivity.record("random_browse_start",d);return;}
if(window.MkXpActivity&&typeof window.MkXpActivity.recordRandomBrowseStarted==="function"){window.MkXpActivity.recordRandomBrowseStarted(d);return;}
if(window.MkAccountData&&typeof window.MkAccountData.recordActivity==="function"){window.MkAccountData.recordActivity("random_browse_start",d,{scope:`random_browse_start:${d.path || d.eventName || Date.now()}`,throttleMs:0});return;}
queueCustomRandomXp(d);document.dispatchEvent(new CustomEvent("mk:xp-activity",{detail:Object.assign({metric:"random_browse_start"},d)}));}catch(_){}}
function isHoverPointer(){try{return!!(window.matchMedia&&window.matchMedia("(hover: hover) and (pointer: fine)").matches);}catch(_){return false;}}
function sleep(ms){return new Promise((r)=>setTimeout(r,ms||0));}
function diceSvg(n){const pips={1:[[12,12]],2:[[8,8],[16,16]],3:[[8,8],[12,12],[16,16]],4:[[8,8],[16,8],[8,16],[16,16]],5:[[8,8],[16,8],[12,12],[8,16],[16,16]],6:[[8,8],[16,8],[8,12],[16,12],[8,16],[16,16]],};const pts=pips[n]||pips[1];const dots=pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.05" fill="currentColor"/>`).join("");return`
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <rect x="4.5" y="4.5" width="15" height="15" rx="3" ry="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
        ${dots}
      </svg>
    `;}
function randFace(){return 1+Math.floor(Math.random()*6);}
function readLastFace(){try{const v=Number(sessionStorage.getItem(LAST_FACE_KEY)||"");return v>=1&&v<=6?v:1;}catch(_){return 1;}}
function writeLastFace(n){try{const v=Number(n);if(v>=1&&v<=6)sessionStorage.setItem(LAST_FACE_KEY,String(v));}catch(_){}}
function setDiceFace(iconEl,n){if(!iconEl)return;iconEl.innerHTML=diceSvg(n);}
function rollDiceOnce(iconEl,opts){const frames=(opts&&opts.frames)||14;const interval=(opts&&opts.interval)||55;return new Promise((resolve)=>{if(!iconEl)return resolve(1);let i=0;const timer=setInterval(()=>{i+=1;setDiceFace(iconEl,randFace());if(i>=frames){clearInterval(timer);const finalFace=randFace();setDiceFace(iconEl,finalFace);resolve(finalFace);}},interval);});}
function beginHoverRoll(iconEl,st){if(!iconEl||!st||st.timer)return;st.timer=window.setInterval(()=>setDiceFace(iconEl,randFace()),70);}
function stopHoverRoll(st){if(!st||!st.timer)return;window.clearInterval(st.timer);st.timer=null;}
function freezeToRandomFace(iconEl,st){stopHoverRoll(st);const face=randFace();setDiceFace(iconEl,face);return face;}
const PER_TOKEN_PREVIEW=10;function getSiteRootUrl(){const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]');const attr=script?script.getAttribute("src"):(link?link.getAttribute("href"):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname;const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function normaliseForSearch(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim();}
function tokeniseLoose(s){const n=normaliseForSearch(s);if(!n)return[];return n.split(" ").filter(Boolean);}
function isCustomRandomPage(){const p=window.location.pathname.toLowerCase();return p.endsWith("/custom-random.html")||p.endsWith("custom-random.html");}
function isIndexPage(location){const loc=String(location||"").toLowerCase().split("#")[0];return loc.endsWith("/index.html")||loc.endsWith("index.html");}
function isRandomPage(location){const loc=String(location||"").toLowerCase().split("#")[0];if(loc.includes("/random/"))return true;const file=loc.split("/").pop()||"";return/^random.*\.html$/.test(file)||file==="custom-random.html";}
function isConceptLocation(loc){const s0=String(loc||"");if(!s0)return false;const clean=s0.split("#")[0].replace(/^\/+/,"").replace(/\/+$/,"");if(!clean)return false;const low=clean.toLowerCase();if(!low.endsWith(".html"))return false;const base=(clean.split("/").pop()||"").toLowerCase();if(!base)return false;if(base==="index.html"||low.endsWith("/index.html"))return false;if(base==="custom-random.html")return false;if(/^random[^\/]*\.html$/.test(base))return false;const badBases=new Set(["find.html","trending.html","contributors.html","about.html","about-this-wiki.html","404.html"]);if(badBases.has(base))return false;if(low.includes("assets/"))return false;if(low.includes("/search/"))return false;if(low.includes("/find"))return false;if(low.includes("/trending"))return false;if(low.includes("/contributors"))return false;if(low.includes("/about"))return false;const segs=clean.split("/").filter(Boolean);return segs.length>=3;}
function courseLabelFromLocation(location){const loc=String(location||"").replace(/^\/+/,"");const path=loc.split("#")[0];const segs=path.split("/").filter(Boolean);if(segs.length<2)return"";let course=segs[1];course=course.replace(/^\d+[ab]-/i,"");course=course.replace(/-/g," ").trim();course=course.replace(/^Math\s+(I|II|III|IV)\s+/i,(m)=>m.trim()+": ");return course;}
async function loadIndex(){const root=getSiteRootUrl();const url=new URL("search/search_index.json",root);const j=await __mkFetchSearchIndex(url.toString());if(!j)throw new Error("Failed to load search index");return j;}
function aggregateDocsToPages(docs){const pageMap=new Map();for(const d of docs){const locFull=String(d.location||"");if(!locFull)continue;const pageLoc=locFull.split("#")[0];if(!pageLoc)continue;if(isIndexPage(pageLoc))continue;if(isRandomPage(pageLoc))continue;if(!isConceptLocation(pageLoc))continue;let entry=pageMap.get(pageLoc);if(!entry){entry={location:pageLoc,title:"",text:""};pageMap.set(pageLoc,entry);}
if(locFull===pageLoc&&d.title)entry.title=String(d.title);const anchor=locFull.includes("#")?(locFull.split("#")[1]||"").toLowerCase():"";const isNoisySection=anchor==="prerequisites"||anchor.startsWith("prerequisites-")||anchor==="related-concepts"||anchor.startsWith("related-concepts-");if(!isNoisySection&&d.text)entry.text+=" "+String(d.text);if(d.tags)entry.text+=" "+String(d.tags);if(d.keywords)entry.text+=" "+String(d.keywords);if(d.meta)entry.text+=" "+JSON.stringify(d.meta);}
for(const entry of pageMap.values()){if(!entry.title){const file=entry.location.split("/").pop()||"Untitled";entry.title=file.replace(/\.html$/i,"").replace(/-/g," ");}}
return Array.from(pageMap.values());}
function readJson(key,fallback){try{const raw=sessionStorage.getItem(key);if(!raw)return fallback;const v=JSON.parse(raw);return v==null?fallback:v;}catch(_){return fallback;}}
function writeJson(key,value){try{sessionStorage.setItem(key,JSON.stringify(value));}catch(_){}}
function readTokens(){const arr=readJson(TOKENS_KEY,[]);return Array.isArray(arr)?arr.filter(Boolean).map(String):[];}
function storeTokens(tokens){writeJson(TOKENS_KEY,tokens||[]);}
function storeCandidates(locations){writeJson(CANDS_KEY,locations||[]);}
function storeTokenMap(mapObj){writeJson(TOKENMAP_KEY,mapObj||{});}
function storeEntryUrl(){try{sessionStorage.setItem(ENTRY_KEY,window.location.href);}catch(_){}}
function readExpandState(){const obj=readJson(EXPAND_KEY,{});return obj&&typeof obj==="object"?obj:{};}
function storeExpandState(obj){writeJson(EXPAND_KEY,obj||{});}
function readSelectedMap(){const obj=readJson(SELECT_KEY,{});return obj&&typeof obj==="object"?obj:{};}
function storeSelectedMap(obj){writeJson(SELECT_KEY,obj||{});}
function readSelfTestPref(){const v=readJson(SELFTEST_PREF_KEY,true);return v===true;}
function storeSelfTestPref(v){writeJson(SELFTEST_PREF_KEY,!!v);}
function matchToken(pageDoc,tokenRaw){const toks=tokeniseLoose(tokenRaw);if(!toks.length)return false;const hay=normaliseForSearch((pageDoc.title||"")+" "+(pageDoc.text||"")+" "+(pageDoc.location||""));for(const t of toks){if(!hay.includes(t))return false;}
return true;}
function buildResultsByToken(pageDocs,tokens){const byToken=[];const tokenMap={};for(const token of(tokens||[])){const hits=pageDocs.filter((d)=>matchToken(d,token));byToken.push({token,hits});tokenMap[token]=hits.map((h)=>h.location);}
const unionMap=new Map();for(const group of byToken){for(const doc of group.hits){if(!unionMap.has(doc.location))unionMap.set(doc.location,doc);}}
return{byToken,union:Array.from(unionMap.values()),tokenMap};}
function toAbsoluteUrl(loc){const siteRoot=getSiteRootUrl();const cleanLoc=String(loc).replace(/^\//,"");return new URL(cleanLoc,siteRoot).toString().split("#")[0]+"#top";}
function pickRandom(arr){if(!arr||!arr.length)return null;return arr[Math.floor(Math.random()*arr.length)];}
function ensureDefaultSelection(unionDocs,selectedMap){let changed=false;for(const d of unionDocs){const loc=d.location;if(selectedMap[loc]===undefined){selectedMap[loc]=true;changed=true;}}
const unionSet=new Set(unionDocs.map((d)=>d.location));for(const k of Object.keys(selectedMap)){if(!unionSet.has(k)){delete selectedMap[k];changed=true;}}
return changed;}
function countSelected(unionDocs,selectedMap){let c=0;for(const d of unionDocs)if(selectedMap[d.location])c++;return c;}
function setSelectionForLocations(selectedMap,locations,value){for(const loc of locations)selectedMap[loc]=value;}
function renderApp(container,state){const tokens=state.tokens;const unionCount=state.union.length;const selectedCount=countSelected(state.union,state.selectedMap);const chips=tokens.length?tokens.map((t,i)=>`
          <span style="display:inline-flex;align-items:center;gap:6px;margin:0 6px 6px 0;padding:4px 10px;border-radius:999px;border:1px solid var(--md-default-fg-color--lightest);">
            <span>${escapeHtml(t)}</span>
            <button data-del="${i}" class="md-button" style="padding:2px 8px;min-width:auto">×</button>
          </span>
        `).join(""):`<span style="opacity:.7">No tokens yet.</span>`;const unionInfo=tokens.length?`<div style="margin-top:12px;opacity:.85;line-height:1.5">
       <div>
         Found <strong>${unionCount}</strong> page(s) related to your keywords.
       </div>
       <div>
         <strong>${selectedCount}</strong> page(s) are currently selected for random practice.
       </div>
     </div>`:"";const selfTestChecked=state.selfTestPref?"checked":"";const lastFace=readLastFace();const startBar=`
      <div class="cr-selftest-bar" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px">
        <button id="cr-random" class="md-button md-button--primary cr-dice-btn" ${selectedCount ? "" : "disabled"}>
          <span class="cr-dice__ico" aria-hidden="true">${diceSvg(lastFace)}</span>
          <span class="cr-dice__txt">Start random</span>
        </button>

        <label class="${crHasShopItem(CR_SELF_TEST_ITEM_ID) ? "" : "is-locked"}" title="${crHasShopItem(CR_SELF_TEST_ITEM_ID) ? "" : `Unlock ${CR_SELF_TEST_ITEM_TITLE}· ${CR_SELF_TEST_ITEM_PRICE}EORbits`}" style="display:inline-flex;align-items:center;gap:8px;opacity:.9">
          <input id="cr-selftest" type="checkbox" ${selfTestChecked} />
          Self-test mode (fold sections)
        </label>
      </div>
    `;const expandState=state.expandState||{};const selectedMap=state.selectedMap||{};const sections=state.byToken.length?state.byToken.map((group)=>{const token=group.token;const hits=group.hits||[];const count=hits.length;const expanded=!!expandState[token];const shown=expanded?hits:hits.slice(0,PER_TOKEN_PREVIEW);const hiddenCount=Math.max(0,count-shown.length);const list=count?shown.map((r)=>{const href=toAbsoluteUrl(r.location);const course=courseLabelFromLocation(r.location);const checked=selectedMap[r.location]?"checked":"";return`
                  <article style="padding:8px 0;border-bottom:1px solid var(--md-default-fg-color--lightest);">
                    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between">
                      <div style="display:flex;gap:10px;align-items:center;min-width:260px;flex:1">
                        <input type="checkbox" data-select-loc="${escapeHtml(r.location)}" ${checked} />
                        <a href="${href}" style="text-decoration:none">${escapeHtml(r.title || "Untitled")}</a>
                      </div>
                      ${course ? `<span style="opacity:.75;font-size:.85em">${escapeHtml(course)}</span>` : ""}
                    </div>
                  </article>
                `;}).join(""):`<div style="opacity:.7;padding:8px 0">No pages matched this token.</div>`;const toggleBtn=count>PER_TOKEN_PREVIEW?`<div style="margin-top:10px;display:flex;justify-content:flex-end">
                     <button data-toggle-token="${escapeHtml(token)}" class="md-button" style="padding:4px 10px">
                       ${expanded ? "Collapse" : `Expand(+${hiddenCount})`}
                     </button>
                   </div>`:"";const tokenActions=count?`
              <button data-token-all="${escapeHtml(token)}" class="md-button" style="padding:4px 10px">Select all</button>
              <button data-token-none="${escapeHtml(token)}" class="md-button" style="padding:4px 10px">Select none</button>
            `:"";return`
            <section style="margin-top:16px;padding:12px 14px;border:1px solid var(--md-default-fg-color--lightest);border-radius:12px">
              <div class="cr-token-head" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
                <div>
                  <strong>${escapeHtml(token)}</strong>
                  <span style="opacity:.75">(${count} page(s))</span>
                </div>
                <div class="cr-token-actions" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
                  ${tokenActions}
                </div>
              </div>
              <div style="margin-top:10px">
                ${list}
                ${toggleBtn}
              </div>
            </section>
          `;}).join(""):`<div style="opacity:.75;margin-top:12px">Add tokens to see results.</div>`;container.innerHTML=`
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
        <input id="cr-input" class="md-input" style="flex:1;min-width:240px" placeholder="e.g. continuity, m1c-lecture05" />
        <button id="cr-add" class="md-button md-button--primary">Add</button>
        <button id="cr-clear" class="md-button">Clear all</button>
      </div>

      <div style="margin:6px 0 6px 0">
        ${chips}
      </div>

      ${unionInfo}
      ${startBar}

      ${sections}
    `;const input=container.querySelector("#cr-input");const addBtn=container.querySelector("#cr-add");const clearBtn=container.querySelector("#cr-clear");const randomBtn=container.querySelector("#cr-random");const selfTestCb=container.querySelector("#cr-selftest");const randomIco=randomBtn?randomBtn.querySelector(".cr-dice__ico"):null;const randomDiceState={timer:null,navigating:false};if(randomBtn&&randomIco&&isHoverPointer()){randomBtn.addEventListener("mouseenter",()=>{if(randomDiceState.navigating)return;if(randomBtn.disabled)return;beginHoverRoll(randomIco,randomDiceState);});randomBtn.addEventListener("mouseleave",()=>{if(randomDiceState.navigating)return;freezeToRandomFace(randomIco,randomDiceState);});}
function addTokenFromInput(){const v=(input.value||"").trim();if(!v)return;if(!state.tokens.includes(v))state.tokens.push(v);input.value="";storeTokens(state.tokens);state.recompute();}
addBtn.addEventListener("click",addTokenFromInput);input.addEventListener("keydown",(e)=>{if(e.key==="Enter"){e.preventDefault();addTokenFromInput();}});if(selfTestCb){selfTestCb.addEventListener("change",async()=>{if(selfTestCb.checked&&!(await crEnsureSelfTestUnlocked("custom-random-self-test-toggle"))){selfTestCb.checked=false;}
state.selfTestPref=!!selfTestCb.checked;storeSelfTestPref(state.selfTestPref);state.recompute();});}
clearBtn.addEventListener("click",()=>{state.tokens=[];storeTokens(state.tokens);state.expandState={};storeExpandState(state.expandState);state.selectedMap={};storeSelectedMap(state.selectedMap);state.recompute();});container.querySelectorAll("button[data-del]").forEach((btn)=>{btn.addEventListener("click",()=>{const idx=Number(btn.getAttribute("data-del"));if(!Number.isFinite(idx))return;const removed=state.tokens[idx];state.tokens.splice(idx,1);storeTokens(state.tokens);if(removed&&state.expandState){delete state.expandState[removed];storeExpandState(state.expandState);}
state.recompute();});});container.querySelectorAll("button[data-toggle-token]").forEach((btn)=>{btn.addEventListener("click",()=>{const token=btn.getAttribute("data-toggle-token")||"";state.expandState=state.expandState||{};state.expandState[token]=!state.expandState[token];storeExpandState(state.expandState);state.recompute();});});container.querySelectorAll("input[type=checkbox][data-select-loc]").forEach((cb)=>{cb.addEventListener("change",()=>{const loc=cb.getAttribute("data-select-loc")||"";if(!loc)return;state.selectedMap[loc]=cb.checked;storeSelectedMap(state.selectedMap);state.recompute();});});container.querySelectorAll("button[data-token-all]").forEach((btn)=>{btn.addEventListener("click",()=>{const token=btn.getAttribute("data-token-all")||"";const group=state.byToken.find((g)=>g.token===token);if(!group)return;setSelectionForLocations(state.selectedMap,group.hits.map((d)=>d.location),true);storeSelectedMap(state.selectedMap);state.recompute();});});container.querySelectorAll("button[data-token-none]").forEach((btn)=>{btn.addEventListener("click",()=>{const token=btn.getAttribute("data-token-none")||"";const group=state.byToken.find((g)=>g.token===token);if(!group)return;setSelectionForLocations(state.selectedMap,group.hits.map((d)=>d.location),false);storeSelectedMap(state.selectedMap);state.recompute();});});randomBtn.addEventListener("click",async(e)=>{e.preventDefault();recordCustomRandomXp({eventName:"custom-random-start-click"});if(randomDiceState&&randomDiceState.navigating)return;const poolDocs=state.union.filter((d)=>state.selectedMap[d.location]);if(!poolDocs.length)return;storeEntryUrl();storeTokenMap(state.tokenMap);let locs=poolDocs.map((r)=>r.location);if(window.ConceptMastery){locs=window.ConceptMastery.filterActive(locs);}
if(!locs.length){alert("All selected pages are marked as Mastered. Please select more pages or change mastery.");return;}
storeCandidates(locs);const chosen=window.ConceptMastery?window.ConceptMastery.pickWeighted(locs):pickRandom(locs);if(!chosen)return;const wantSelfTest=!!(selfTestCb&&selfTestCb.checked);if(wantSelfTest&&!(await crEnsureSelfTestUnlocked("custom-random-start-self-test")))return;try{if(wantSelfTest){sessionStorage.setItem("random_review_mode_v1","1");sessionStorage.setItem("random_review_nav_flag_v1","1");}else{sessionStorage.removeItem("random_review_mode_v1");sessionStorage.removeItem("random_review_nav_flag_v1");}}catch(_){}
try{sessionStorage.setItem(NAV_FLAG_KEY,"1");}catch(_){}
try{const arrivalId=String(Date.now())+"_"+Math.random().toString(16).slice(2);sessionStorage.setItem("random_arrival_id_v1",arrivalId);sessionStorage.setItem("random_arrival_loc_v1",String(chosen).split("#")[0].replace(/^\/+/,""));}catch(_){}
const targetUrl=toAbsoluteUrl(chosen);if(randomDiceState)randomDiceState.navigating=true;try{randomBtn.disabled=true;randomBtn.setAttribute("aria-disabled","true");randomBtn.style.pointerEvents="none";}catch(_){}
let face=1;if(randomIco){if(isHoverPointer()){face=freezeToRandomFace(randomIco,randomDiceState);}else{face=await rollDiceOnce(randomIco,{frames:14,interval:55});}
writeLastFace(face);}
await sleep(250);window.location.assign(targetUrl);});}
async function init(){if(!isCustomRandomPage())return;const mount=document.getElementById("custom-random-app");if(!mount)return;const indexJson=await loadIndex();const docs=(indexJson&&indexJson.docs)?indexJson.docs:[];const pageDocs=aggregateDocsToPages(docs);let state={tokens:readTokens(),byToken:[],union:[],tokenMap:{},expandState:readExpandState(),selectedMap:readSelectedMap(),selfTestPref:readSelfTestPref(),recompute:()=>{},};state.recompute=()=>{const built=buildResultsByToken(pageDocs,state.tokens);state.byToken=built.byToken;state.union=built.union;state.tokenMap=built.tokenMap;const cleanExpand={};for(const t of state.tokens)cleanExpand[t]=!!state.expandState[t];state.expandState=cleanExpand;storeExpandState(state.expandState);const changed=ensureDefaultSelection(state.union,state.selectedMap);if(changed)storeSelectedMap(state.selectedMap);renderApp(mount,state);};state.recompute();}
function safeInit(){init().catch((e)=>console.warn("custom-random:",e));}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",safeInit);}else{safeInit();}
document.addEventListener("DOMContentSwitch",safeInit);})();