(function(){const ARRIVAL_ID_KEY="random_arrival_id_v1";const ARRIVAL_LOC_KEY="random_arrival_loc_v1";const MASTERY_LS_KEY="concept_mastery_v1";const REVIEW_MODE_KEY="random_review_mode_v1";const CRB_SELF_TEST_ITEM_ID="self_test_mode";const CRB_SELF_TEST_ITEM_TITLE="Self-test Mode";const CRB_SELF_TEST_ITEM_PRICE=0;function crbHasShopItem(itemId){try{if(itemId===CRB_SELF_TEST_ITEM_ID)return true;const api=window.MkAccountData;if(api&&typeof api.hasShopItem==="function")return!!api.hasShopItem(itemId);const xp=api&&typeof api.xp==="function"?api.xp():null;const owned=xp&&(xp.ownedShopItems||(xp.shopInventory&&xp.shopInventory.ownedIds));return Array.isArray(owned)&&owned.indexOf(itemId)>=0;}catch(_){return false;}}
function crbBalance(){try{const api=window.MkAccountData;const xp=api&&typeof api.xp==="function"?api.xp():null;return Number(xp&&(xp.currencyBalance!=null?xp.currencyBalance:xp.eorbits)||0)||0;}catch(_){return 0;}}
function crbOfferUnlock(itemId,title,price,source){try{if(crbHasShopItem(itemId))return Promise.resolve(true);const api=window.MkAccountData;if(!api||typeof api.buyShopItem!=="function"){alert("The shop is still loading. Please try again in a moment.");return Promise.resolve(false);}const bal=crbBalance();if(bal+1e-9<Number(price||0)){alert(`${title} needs ${price} EORbits. You currently have ${Math.round(bal*10)/10}.`);return Promise.resolve(false);}if(!confirm(`Unlock ${title} for ${price} EORbits?`))return Promise.resolve(false);return api.buyShopItem(itemId,{source:source||itemId}).then((res)=>{if(!res||res.ok===false){alert(res&&res.error==="insufficient_funds"?"Not enough EORbits.":"Unlock failed. Please try again.");return false;}try{window.dispatchEvent(new CustomEvent("mk-shop-inventory-change",{detail:{itemId,source:source||itemId}}));}catch(_){}return true;});}catch(err){try{alert(String(err&&err.message||err||"Unlock failed."));}catch(_){}return Promise.resolve(false);}}
const REVIEW_NAV_FLAG="random_review_nav_flag_v1";const CANDS_KEY="random_custom_candidates_v1";const ENTRY_KEY="random_custom_page_v1";const TOKENS_KEY="random_custom_tokens_v1";const TOKENMAP_KEY="random_custom_token_map_v1";const NAV_FLAG_KEY="random_custom_nav_flag_v1";const LAST_FACE_KEY="random_custom_last_dice_face_v1";const __crBannerDiceState={timer:null,navigating:false,generation:0,button:null,cancelRoll:null};function restoreContinueButton(button){if(!button)return;button.removeAttribute("aria-disabled");button.style.pointerEvents="";button.style.opacity="";}
function cancelBannerNavigation(){__crBannerDiceState.generation+=1;stopHoverRoll(__crBannerDiceState);if(__crBannerDiceState.cancelRoll)__crBannerDiceState.cancelRoll();restoreContinueButton(__crBannerDiceState.button);__crBannerDiceState.button=null;__crBannerDiceState.navigating=false;}
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
function stopHoverRoll(st){if(!st||!st.timer)return;window.clearInterval(st.timer);st.timer=null;}
function beginHoverRoll(iconEl,st){if(!iconEl||!st)return;if(st.timer)return;st.timer=window.setInterval(()=>setDiceFace(iconEl,randFace()),70);}
function freezeToRandomFace(iconEl,st){stopHoverRoll(st);const face=randFace();setDiceFace(iconEl,face);return face;}
function rollDiceOnce(iconEl,opts){const frames=(opts&&opts.frames)||14;const interval=(opts&&opts.interval)||55;return new Promise((resolve)=>{if(!iconEl)return resolve(1);let i=0;const finish=(face)=>{window.clearInterval(timer);if(__crBannerDiceState.cancelRoll===cancel)__crBannerDiceState.cancelRoll=null;resolve(face);};const cancel=()=>finish(null);const timer=window.setInterval(()=>{i+=1;setDiceFace(iconEl,randFace());if(i>=frames){const finalFace=randFace();setDiceFace(iconEl,finalFace);finish(finalFace);}},interval);__crBannerDiceState.cancelRoll=cancel;});}
function getSiteRootUrl(){const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]');const attr=script?script.getAttribute("src"):(link?link.getAttribute("href"):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname;const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function crSvg(name,size){const s=Number(size)||18;const common=`width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"`;const stroke=`fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;if(name==="check-decagram-outline"){return`<svg ${common} ${stroke}><polygon points="12.0,3.0 17.3,4.7 20.6,9.2 20.6,14.8 17.3,19.3 12.0,21.0 6.7,19.3 3.4,14.8 3.4,9.2 6.7,4.7"/><path d="M8.5 12.5l2.2 2.2 4.8-5.2"/></svg>`;}
if(name==="shield-check-outline"){return`<svg ${common} ${stroke}><path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"/><path d="M9 12.5l2 2 4-4.5"/></svg>`;}
if(name==="check-circle-outline"){return`<svg ${common} ${stroke}><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.2 2.2 4.8-5.2"/></svg>`;}
if(name==="help-circle-outline"){return`<svg ${common} ${stroke}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 3.5"/><circle cx="12" cy="17" r="1"/></svg>`;}
if(name==="close-circle-outline"){return`<svg ${common} ${stroke}><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>`;}
if(name==="exit-to-app-outline"){return`<svg ${common} ${stroke}><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M10 16l4-4-4-4"/><path d="M14 12H4"/></svg>`;}
if(name==="file-edit-outline"){return`<svg ${common} ${stroke}><path d="M14 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M10 15l4.8-4.8a1.4 1.4 0 0 1 2 2L12 17H10z"/></svg>`;}
return"";}
function crSvgForLevel(m,size){if(m===3)return crSvg("shield-check-outline",size);if(m===2)return crSvg("check-circle-outline",size);if(m===1)return crSvg("help-circle-outline",size);if(m===0)return crSvg("close-circle-outline",size);return"";}
function crIcon(m,size){return`<span class="cr-mi" style="display:inline-block;vertical-align:-0.18em;margin-right:2px;">${crSvgForLevel(m, size)}</span>`;}
function toAbsoluteUrl(loc){const siteRoot=getSiteRootUrl();const cleanLoc=String(loc).replace(/^\//,"");return new URL(cleanLoc,siteRoot).toString().split("#")[0]+"#top";}
function readJson(key,fallback){try{const raw=sessionStorage.getItem(key);if(!raw)return fallback;const v=JSON.parse(raw);return v==null?fallback:v;}catch(_){return fallback;}}
function readCandidates(){const arr=readJson(CANDS_KEY,[]);return Array.isArray(arr)?arr.filter(Boolean).map(String):[];}
function normLoc(loc){return String(loc||"").split("#")[0].replace(/^\/+/,"");}
function newArrivalId(){return String(Date.now())+"_"+Math.random().toString(16).slice(2);}
function readTokens(){const arr=readJson(TOKENS_KEY,[]);return Array.isArray(arr)?arr.filter(Boolean).map(String):[];}
function readTokenMap(){const obj=readJson(TOKENMAP_KEY,{});return obj&&typeof obj==="object"?obj:{};}
function pickRandom(arr){if(!arr||!arr.length)return null;return arr[Math.floor(Math.random()*arr.length)];}
function isOnCustomRandomPage(){const p=window.location.pathname.toLowerCase();return p.endsWith("/custom-random.html")||p.endsWith("custom-random.html");}
function consumeNavFlag(){try{const v=sessionStorage.getItem(NAV_FLAG_KEY);if(v!=="1")return false;sessionStorage.removeItem(NAV_FLAG_KEY);return true;}catch(_){return false;}}
function currentRelPath(){const siteRoot=new URL(getSiteRootUrl());const rootPath=siteRoot.pathname.endsWith("/")?siteRoot.pathname:(siteRoot.pathname+"/");let p=String(window.location.pathname||"");if(p.startsWith(rootPath))p=p.slice(rootPath.length);return p.replace(/^\/+/,"");}
function isConceptPage(relPath){const p=String(relPath||"").toLowerCase();if(p==="")return false;if(p.endsWith("/"))return false;if(!p.endsWith(".html"))return false;if(p==="index.html"||p.endsWith("/index.html"))return false;const segs=String(relPath||"").split("/").filter(Boolean);return segs.length>=2;}
function computeMatchedTokens(tokens,tokenMap,currentLocRel){const matched=[];for(const t of tokens){const list=tokenMap[t];if(Array.isArray(list)&&list.includes(currentLocRel))matched.push(t);}
return matched;}
function insertBanner(cands,tokens,matchedTokens){const inner=document.querySelector("article.md-content__inner");if(!inner)return;if(document.getElementById("custom-random-banner"))return;const box=document.createElement("div");box.id="custom-random-banner";box.className="md-typeset";box.style.margin="12px 0 18px 0";box.style.padding="12px 14px";box.style.border="1px solid var(--md-default-fg-color--lightest)";box.style.borderRadius="12px";box.style.background="linear-gradient(135deg, rgba(63,81,181,.12), rgba(63,81,181,.05))";const count=cands.length;const tokenChips=tokens.length?tokens.map((t)=>{const isHit=matchedTokens.includes(t);return`<span style="display:inline-flex;align-items:center;margin:2px 6px 2px 0;padding:3px 10px;border-radius:999px;border:1px solid var(--md-default-fg-color--lightest);${
              isHit ? "font-weight:700" : "opacity:.85"
            }">${escapeHtml(t)}${isHit ? " ✓" : ""}</span>`;}).join(""):`<span style="opacity:.75">No tokens</span>`;const matchedText=matchedTokens.length?`This page matches: <strong>${matchedTokens.map(escapeHtml).join(", ")}</strong>`:`This page doesn't match any token (possible if you opened it manually).`;if(!document.getElementById("cr-mastery-style")){const st=document.createElement("style");st.id="cr-mastery-style";st.textContent=`
  #custom-random-banner .cr-mastery-emoji-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  #custom-random-banner .cr-mastery-emoji{
    display:flex;align-items:center;gap:8px;
    border:1px solid var(--md-default-fg-color--lightest);
    background: rgba(255,255,255,.04);
    border-radius: 999px;
    padding: 6px 10px;
    cursor:pointer;
  }
  #custom-random-banner .cr-mastery-emoji:hover{background: rgba(255,255,255,.08)}
  #custom-random-banner .cr-emo{display:inline-flex;align-items:center;line-height:1}
  #custom-random-banner .cr-emo svg{display:block}
  #custom-random-banner .cr-mi svg{display:block}
  #custom-random-banner .cr-lab{font-size:12px;opacity:.9}
  #custom-random-banner .cr-mastery-selected{
    background: rgba(63,81,181,.18);
    border-color: rgba(63,81,181,.55);
    font-weight: 700;
  }
  #custom-random-banner .cr-mastery-meta{opacity:.75;font-size:.85em;margin-top:6px}
  #custom-random-banner .cr-action-row{
    display:flex;
    justify-content:space-between;
    align-items:stretch;
    gap:18px;
    width:100%;
    flex-wrap:nowrap;
  }
  #custom-random-banner .cr-tool-btn,
  #custom-random-banner .cr-dice-btn{
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    width:auto !important;
    flex:0 1 auto !important;
    max-width:calc((100% - 36px) / 3) !important;
    gap:.44rem !important;
    white-space:nowrap !important;
    box-sizing:border-box !important;
    line-height:1 !important;
    padding:.34rem .9rem !important;
    border-radius:11px !important;
    min-height:2.28rem !important;
    box-shadow:none !important;
    filter:none !important;
    text-shadow:none !important;
    transform:none !important;
    transition:border-color 140ms ease, background-color 140ms ease, color 140ms ease !important;
  }
  #custom-random-banner .cr-dice-btn{
    box-shadow:none !important;
  }
  #custom-random-banner .cr-dice__txt,
  #custom-random-banner .cr-tool-btn .cr-tool__txt{
    display:inline-flex;
    align-items:center;
    line-height:1.02 !important;
    font-size:.65rem !important;
    font-weight:700 !important;
    letter-spacing:0 !important;
  }
  #custom-random-banner .cr-tool__ico{
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    width:auto !important;
    height:auto !important;
    flex:0 0 auto !important;
    border:none !important;
    background:none !important;
    box-shadow:none !important;
    border-radius:0 !important;
    padding:0 !important;
    margin:0 !important;
  }
  #custom-random-banner .cr-tool__ico svg{
    display:block;
    width:.82rem;
    height:.82rem;
  }
  #custom-random-banner .cr-dice__ico svg{
    width:.82rem !important;
    height:.82rem !important;
  }
  #custom-random-banner .cr-dice__ico,
  #custom-random-banner .cr-tool__ico,
  #custom-random-banner .cr-dice__ico svg,
  #custom-random-banner .cr-tool__ico svg,
  #custom-random-banner .cr-dice__ico svg *,
  #custom-random-banner .cr-tool__ico svg *{
    color:currentColor !important;
    stroke:currentColor !important;
  }
  html[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico,
  html[data-md-color-scheme="slate"] #custom-random-banner .cr-tool__ico,
  body[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico,
  body[data-md-color-scheme="slate"] #custom-random-banner .cr-tool__ico,
  .slate #custom-random-banner .cr-dice__ico,
  .slate #custom-random-banner .cr-tool__ico{
    color:#fff !important;
    stroke:#fff !important;
  }
  html[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico svg [fill]:not([fill="none"]),
  html[data-md-color-scheme="slate"] #custom-random-banner .cr-tool__ico svg [fill]:not([fill="none"]),
  html[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico svg circle{
    fill:#fff !important;
  }
  @media (hover: hover) and (pointer: fine){
    #custom-random-banner .cr-tool-btn:hover,
    #custom-random-banner .cr-dice-btn:hover{
      box-shadow:none !important;
      transform:none !important;
      filter:none !important;
    }
  }
  #custom-random-banner .cr-tool-btn:active,
  #custom-random-banner .cr-dice-btn:active{
    transform:none !important;
    filter:none !important;
  }
  @media (max-width: 860px){
    #custom-random-banner .cr-action-row{
      display:grid;
      grid-template-columns:1fr;
      gap:12px;
    }
    #custom-random-banner .cr-tool-btn,
    #custom-random-banner .cr-dice-btn{
      width:100% !important;
      max-width:none !important;
      min-height:2.2rem !important;
    }
  }
  #custom-random-banner a#cr-view.md-button::before,
  #custom-random-banner a#cr-view.md-button::after,
  #custom-random-banner a#cr-change.md-button::before,
  #custom-random-banner a#cr-change.md-button::after,
  #custom-random-banner #cr-view.md-button::before,
  #custom-random-banner #cr-view.md-button::after,
  #custom-random-banner #cr-change.md-button::before,
  #custom-random-banner #cr-change.md-button::after{
    display:none !important;
    content:none !important;
  }
`;document.head.appendChild(st);}
const lastFace=readLastFace();box.innerHTML=`
  <div style="display:flex;flex-direction:column;gap:10px;align-items:stretch;min-width:260px;width:100%">
    <div class="cr-action-row">
      <a id="cr-continue" class="md-button md-button--primary cr-dice-btn" href="#"><span class="cr-dice__ico" aria-hidden="true">${diceSvg(lastFace)}</span><span class="cr-dice__txt">Continue random</span></a>
      <a id="cr-view" class="md-button cr-tool-btn" href="#"><span class="cr-tool__ico" aria-hidden="true">${crSvg("exit-to-app-outline", 18)}</span><span class="cr-tool__txt">Exit random</span></a>
      <a id="cr-change" class="md-button cr-tool-btn" href="#"><span class="cr-tool__ico" aria-hidden="true">${crSvg("file-edit-outline", 18)}</span><span class="cr-tool__txt">Edit filter</span></a>
    </div>

    <label id="cr-selftest-label" style="display:flex;align-items:center;gap:8px;opacity:.9" title="">
      <input id="cr-selftest" type="checkbox" />
      Next page in self-test mode (fold sections)
    </label>
  </div>
`;const h1=inner.querySelector("h1");if(h1&&h1.parentNode)h1.insertAdjacentElement("afterend",box);else inner.insertAdjacentElement("afterbegin",box);try{const refBtn=document.getElementById("cr-continue");const toolBtns=[document.getElementById("cr-view"),document.getElementById("cr-change")].filter(Boolean);const allBtns=[refBtn,...toolBtns].filter(Boolean);allBtns.forEach((btn)=>{btn.style.setProperty("display","inline-flex","important");btn.style.setProperty("align-items","center","important");btn.style.setProperty("justify-content","center","important");btn.style.setProperty("box-sizing","border-box","important");btn.style.setProperty("width","auto","important");btn.style.setProperty("flex","0 1 auto","important");btn.style.setProperty("max-width","calc((100% - 36px) / 3)","important");btn.style.setProperty("padding-top","0.34rem","important");btn.style.setProperty("padding-bottom","0.34rem","important");btn.style.setProperty("padding-left","0.9rem","important");btn.style.setProperty("padding-right","0.9rem","important");btn.style.setProperty("border-radius","11px","important");btn.style.setProperty("min-height","2.28rem","important");btn.style.setProperty("font-size","0.65rem","important");btn.style.setProperty("font-weight","700","important");btn.style.setProperty("line-height","1.02","important");btn.style.setProperty("letter-spacing","0","important");btn.style.setProperty("white-space","nowrap","important");btn.style.setProperty("vertical-align","middle","important");btn.style.setProperty("gap","0.44rem","important");btn.style.setProperty("box-shadow","none","important");btn.style.setProperty("filter","none","important");btn.style.setProperty("text-shadow","none","important");btn.style.setProperty("transform","none","important");});[document.querySelector("#cr-continue .cr-dice__ico"),document.querySelector("#cr-view .cr-tool__ico"),document.querySelector("#cr-change .cr-tool__ico")].filter(Boolean).forEach((ico)=>{ico.style.setProperty("width","auto","important");ico.style.setProperty("height","auto","important");ico.style.setProperty("flex","0 0 auto","important");ico.style.setProperty("border-radius","0","important");ico.style.setProperty("border","none","important");ico.style.setProperty("background","none","important");ico.style.setProperty("box-shadow","none","important");ico.style.setProperty("padding","0","important");ico.style.setProperty("margin","0","important");const svg=ico.querySelector('svg');if(svg){svg.style.setProperty("width","0.82rem","important");svg.style.setProperty("height","0.82rem","important");svg.style.setProperty("display","block","important");}});}catch(_){}
try{const btn=document.getElementById("cr-continue");if(btn&&btn.dataset.crDiceBound!=="1"){btn.dataset.crDiceBound="1";const ico=btn.querySelector(".cr-dice__ico");if(ico)setDiceFace(ico,lastFace);if(ico&&isHoverPointer()){btn.addEventListener("mouseenter",()=>{if(__crBannerDiceState.navigating)return;beginHoverRoll(ico,__crBannerDiceState);});btn.addEventListener("mouseleave",()=>{if(__crBannerDiceState.navigating)return;freezeToRandomFace(ico,__crBannerDiceState);});}}}catch(_){}
try{const on=sessionStorage.getItem(REVIEW_MODE_KEY)==="1";const cb=document.getElementById("cr-selftest");const lb=document.getElementById("cr-selftest-label");if(cb)cb.checked=on;if(lb&&!crbHasShopItem(CRB_SELF_TEST_ITEM_ID))lb.title=`Unlock ${CRB_SELF_TEST_ITEM_TITLE} · ${CRB_SELF_TEST_ITEM_PRICE} EORbits`;if(cb&&!cb.__crbLockBound){cb.__crbLockBound=true;cb.addEventListener("change",async()=>{if(false&&cb.checked&&!crbHasShopItem(CRB_SELF_TEST_ITEM_ID)){const ok=await crbOfferUnlock(CRB_SELF_TEST_ITEM_ID,CRB_SELF_TEST_ITEM_TITLE,CRB_SELF_TEST_ITEM_PRICE,"random-banner-self-test");if(!ok){cb.checked=false;try{sessionStorage.removeItem(REVIEW_MODE_KEY);sessionStorage.removeItem(REVIEW_NAV_FLAG);}catch(_){}}}});}}catch(_){}
const conceptId=normLoc(currentRelPath());function getArrivalIdForThisPage(){try{const id=sessionStorage.getItem(ARRIVAL_ID_KEY)||"";const loc=normLoc(sessionStorage.getItem(ARRIVAL_LOC_KEY)||"");if(id&&loc===conceptId)return id;}catch(_){}
return"";}
const arrivalId=getArrivalIdForThisPage();const ratedKey=arrivalId?("cm_rated_arrival_v1:"+arrivalId):("cm_rated_page_v1:"+conceptId);function alreadyRatedThisArrival(){try{return sessionStorage.getItem(ratedKey)==="1";}catch(_){return false;}}
function markRatedThisArrival(){try{sessionStorage.setItem(ratedKey,"1");}catch(_){}}
function disableMasteryButtons(){document.querySelectorAll("#custom-random-banner .cr-mastery-emoji").forEach((b)=>{b.disabled=true;b.style.pointerEvents="none";b.style.opacity="0.6";});}
function enableMasteryButtons(){document.querySelectorAll("#custom-random-banner .cr-mastery-emoji").forEach((b)=>{b.disabled=false;b.style.pointerEvents="";b.style.opacity="";});}
if(alreadyRatedThisArrival())disableMasteryButtons();try{if(arrivalId){const viewKey="cm_viewed_arrival_v1:"+arrivalId;if(sessionStorage.getItem(viewKey)!=="1"){sessionStorage.setItem(viewKey,"1");const COURSE_TAG_MAP={i2da:"Introduction to Data Analytics",m1c:"Math I: Calculus",orm:"OR Modelling",m2la:"Math II: Linear Algebra",pt:"Probability Theory for EOR",prog:"Programming for EOR",fin:"Finance for EOR",m3a:"Math III: Analysis",micro:"Microeconomics for EOR",m4mc:"Math IV: Multivariate Calculus",pd:"Probability Distributions",sm1:"Statistical Modelling for EOR",macro:"Macroeconomics for EOR",m5ala:"Math V: Advanced Linear Algebra",si:"Statistical Inference",lms:"Linear Models in Statistics",m6co:"Math VI: Convexity and Optimization",sor:"Stochastic Operations Research",dor:"Discrete Operations Research",i2e:"Introduction to Econometrics",li:"Life Insurance",gt:"Game Theory",ri:"Risk Insurance",};function getFirstPageTag(){const meta=document.querySelector('meta[name="tags"]')||document.querySelector('meta[property="tags"]');const content=(meta&&meta.getAttribute("content"))?meta.getAttribute("content"):"";if(content){const t=content.split(",").map(x=>x.trim()).filter(Boolean)[0];if(t)return t;}
const tagEl=document.querySelector(".md-tag");const t2=tagEl?(tagEl.textContent||"").trim():"";if(t2)return t2;return"";}
function resolveCourseFromTagOrFallback(conceptId){const raw=getFirstPageTag().toLowerCase();const key=raw?raw.split(/[-_]/)[0]:"";if(key&&COURSE_TAG_MAP[key])return COURSE_TAG_MAP[key];return conceptId.split("/").slice(-2,-1)[0]||"";}
const meta={title:((document.querySelector("h1")&&document.querySelector("h1").textContent)||document.title||"").trim(),course:resolveCourseFromTagOrFallback(conceptId),coursePath:conceptId.split("/").slice(0,-1).join("/"),};if(window.ConceptMastery&&typeof window.ConceptMastery.bumpView==="function"){window.ConceptMastery.bumpView(conceptId,meta);}else{const raw=localStorage.getItem("concept_mastery_v1");const all=raw?JSON.parse(raw):{};const rec=(all&&all[conceptId]&&typeof all[conceptId]==="object")?all[conceptId]:{};rec.viewCount=(Number(rec.viewCount)||0)+1;if(!rec.title)rec.title=meta.title;if(!rec.course)rec.course=meta.course;if(!rec.coursePath)rec.coursePath=meta.coursePath;all[conceptId]=rec;localStorage.setItem("concept_mastery_v1",JSON.stringify(all));}
try{window.dispatchEvent(new CustomEvent("conceptMasteryChanged"));}catch(_){}}}}catch(_){}
function syncMasteryUI(){const meta=document.getElementById("cr-mastery-meta");const btns=Array.from(document.querySelectorAll("#custom-random-banner .cr-mastery-emoji"));const rec=(window.ConceptMastery&&typeof window.ConceptMastery.get==="function")?window.ConceptMastery.get(conceptId):null;if(!rec||rec.m==null){if(alreadyRatedThisArrival()){try{sessionStorage.removeItem(ratedKey);}catch(_){}}
enableMasteryButtons();}else{if(alreadyRatedThisArrival())disableMasteryButtons();else enableMasteryButtons();}
const currentM=(rec&&typeof rec.m==="number")?rec.m:null;btns.forEach((b)=>{const m=Number(b.getAttribute("data-m"));if(Number.isFinite(m)&&currentM===m)b.classList.add("cr-mastery-selected");else b.classList.remove("cr-mastery-selected");});if(!meta)return;if(!rec||rec.m==null){meta.textContent="Not rated yet.";return;}
let full=0,know=0,fuzzy=0,dont=0;if(rec.counts&&typeof rec.counts==="object"){full=Number(rec.counts.full)||0;know=Number(rec.counts.know)||0;fuzzy=Number(rec.counts.fuzzy)||0;dont=Number(rec.counts.dont)||0;}else{const rc=Number(rec.reviewCount)||0;if(currentM===3)full=rc;else if(currentM===2)know=rc;else if(currentM===1)fuzzy=rc;else if(currentM===0)dont=rc;}
const rated=Number(rec.reviewCount)||(full+know+fuzzy+dont);const seen=Number(rec.viewCount)||0;const dt=rec.lastReviewed?new Date(rec.lastReviewed):null;const when=dt?dt.toLocaleString():"";meta.innerHTML=`Seen: ${seen} · Rated: ${rated} (`+`${crIcon(3, 16)}${full} ${crIcon(2, 16)}${know} ${crIcon(1, 16)}${fuzzy} ${crIcon(0, 16)}${dont}`+`) · Last: ${escapeHtml(when)}`;}
syncMasteryUI();window.addEventListener("conceptMasteryChanged",syncMasteryUI);if(!alreadyRatedThisArrival())enableMasteryButtons();document.querySelectorAll("#custom-random-banner .cr-mastery-emoji").forEach((btn)=>{btn.addEventListener("click",()=>{if(alreadyRatedThisArrival())return;markRatedThisArrival();disableMasteryButtons();const m=Number(btn.getAttribute("data-m"));if(!window.ConceptMastery||!Number.isFinite(m))return;window.ConceptMastery.set(conceptId,m);syncMasteryUI();});});const MASTERY_LS_KEY="concept_mastery_v1";function ensureMasteryModal(){if(document.getElementById("cm-mastery-modal"))return;const wrap=document.createElement("div");wrap.id="cm-mastery-modal";wrap.style.cssText=`
    position:fixed; inset:0; display:none; z-index:9999;
    background: rgba(0,0,0,.55); padding: 18px;
  `;wrap.innerHTML=`
    <div style="max-width:980px;margin:0 auto;background:var(--md-default-bg-color);
                border:1px solid var(--md-default-fg-color--lightest);
                border-radius:14px;padding:14px 14px 10px 14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div style="font-weight:800;font-size:1.05em;">Mastery</div>
        <button id="cm-close" class="md-button">Close</button>
      </div>

      <div id="cm-summary" style="margin:10px 0;opacity:.9;"></div>

      <div style="overflow:auto;border:1px solid var(--md-default-fg-color--lightest);border-radius:12px;">
        <table style="width:100%;border-collapse:collapse;font-size:.95em;">
          <thead style="position:sticky;top:0;background:var(--md-default-bg-color);">
            <tr style="border-bottom:1px solid var(--md-default-fg-color--lightest);">
              <th style="text-align:left;padding:10px;">Course</th>
              <th style="text-align:left;padding:10px;">Concept</th>
              <th style="text-align:right;padding:10px;">Seen</th>
              <th style="text-align:right;padding:10px;">${crSvgForLevel(3, 16)}</th>
              <th style="text-align:right;padding:10px;">${crSvgForLevel(2, 16)}</th>
              <th style="text-align:right;padding:10px;">${crSvgForLevel(1, 16)}</th>
              <th style="text-align:right;padding:10px;">${crSvgForLevel(0, 16)}</th>
              <th style="text-align:left;padding:10px;">Current</th>
              <th style="text-align:left;padding:10px;">Last</th>
              <th style="text-align:left;padding:10px;">Action</th>
            </tr>
          </thead>
          <tbody id="cm-tbody"></tbody>
        </table>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;">
        <button id="cm-clear" class="md-button">Clear all</button>
      </div>
    </div>
  `;document.body.appendChild(wrap);function toCourse(id){const parts=String(id).split("/");parts.pop();const course=parts.length?parts[parts.length-1]:"";return course;}
function toConcept(rec,id){if(rec.title)return rec.title;const file=String(id).split("/").pop()||"";return file.replace(/\.html$/i,"").replace(/-/g," ");}
function mLabel(m){if(m===3)return"Mastered";if(m===2)return"Familiar";if(m===1)return"Unclear";if(m===0)return"Unknown";return"";}
function render(){const all=(window.ConceptMastery&&window.ConceptMastery._readAll)?window.ConceptMastery._readAll():{};const entries=Object.entries(all||{}).map(([id,raw])=>[id,window.ConceptMastery.get(id)]);entries.sort((a,b)=>{const ca=toCourse(a[0]);const cb=toCourse(b[0]);if(ca!==cb)return ca.localeCompare(cb);return toConcept(a[1],a[0]).localeCompare(toConcept(b[1],b[0]));});const counts={full:0,know:0,fuzzy:0,dont:0};for(const[,rec]of entries){const c=rec&&rec.counts?rec.counts:null;if(c){counts.full+=c.full||0;counts.know+=c.know||0;counts.fuzzy+=c.fuzzy||0;counts.dont+=c.dont||0;}}
document.getElementById("cm-summary").innerHTML=`Concepts: ${entries.length} · Ratings (`+`${crIcon(3, 16)}${counts.full} ${crIcon(2, 16)}${counts.know} ${crIcon(1, 16)}${counts.fuzzy} ${crIcon(0, 16)}${counts.dont}`+`)`;const tb=document.getElementById("cm-tbody");tb.innerHTML=entries.map(([id,rec])=>{const c=(rec&&rec.counts)?rec.counts:{full:0,know:0,fuzzy:0,dont:0};const last=rec&&rec.lastReviewed?new Date(rec.lastReviewed).toLocaleString():"";const cur=rec&&typeof rec.m==="number"?rec.m:"";return`
        <tr style="border-bottom:1px solid var(--md-default-fg-color--lightest);">
          <td style="padding:10px;opacity:.95;">${toCourse(id)}</td>
          <td style="padding:10px;">${toConcept(rec, id)}</td>
          <td style="padding:10px;text-align:right;">${rec ? (rec.viewCount || 0) : 0}</td>
          <td style="padding:10px;text-align:right;">${c.full || 0}</td>
          <td style="padding:10px;text-align:right;">${c.know || 0}</td>
          <td style="padding:10px;text-align:right;">${c.fuzzy || 0}</td>
          <td style="padding:10px;text-align:right;">${c.dont || 0}</td>
          <td style="padding:10px;">
            <select class="cm-level" data-id="${id}" style="padding:4px 8px;border-radius:10px;">
              <option value="" ${cur==="" ? "selected":""}>-</option>
              <option value="3" ${cur===3 ? "selected":""}>Fully</option>
              <option value="2" ${cur===2 ? "selected":""}>Familiar</option>
              <option value="1" ${cur===1 ? "selected":""}>Unclear</option>
              <option value="0" ${cur===0 ? "selected":""}>Unknown</option>
            </select>
          </td>
          <td style="padding:10px;opacity:.85;">${last}</td>
          <td style="padding:10px;">
            <button class="md-button cm-del" data-id="${id}">Delete</button>
          </td>
        </tr>
      `;}).join("");}
wrap.addEventListener("click",(e)=>{if(e.target===wrap)wrap.style.display="none";});document.getElementById("cm-close").addEventListener("click",()=>{wrap.style.display="none";});wrap.addEventListener("change",(e)=>{const sel=e.target&&e.target.classList&&e.target.classList.contains("cm-level")?e.target:null;if(!sel)return;const id=sel.getAttribute("data-id");const v=sel.value;if(!id||v==="")return;const m=Number(v);if(!window.ConceptMastery)return;window.ConceptMastery.setLevel(id,m,{course:toCourse(id)});render();});wrap.addEventListener("click",(e)=>{const btn=e.target&&e.target.classList&&e.target.classList.contains("cm-del")?e.target:null;if(!btn)return;const id=btn.getAttribute("data-id");if(!id)return;if(!confirm("Delete this concept record?"))return;const all=window.ConceptMastery._readAll();delete all[id];window.ConceptMastery._writeAll(all);try{window.dispatchEvent(new CustomEvent("conceptMasteryChanged"));}catch(_){}
render();});document.getElementById("cm-clear").addEventListener("click",()=>{if(!confirm("Clear all mastery data?"))return;try{localStorage.removeItem("concept_mastery_v1");}catch(_){}
try{window.dispatchEvent(new CustomEvent("conceptMasteryChanged"));}catch(_){}
render();});render();}
ensureMasteryModal();const manageBtn=document.getElementById("cr-mastery-manage");if(manageBtn){manageBtn.addEventListener("click",(e)=>{e.preventDefault();if(window.MasteryManager&&typeof window.MasteryManager.open==="function"){window.MasteryManager.open();}
try{document.getElementById("cm-reload").click();}catch(_){}});}
document.getElementById("cr-view").addEventListener("click",(e)=>{e.preventDefault();cancelBannerNavigation();try{sessionStorage.removeItem("random_custom_nav_flag_v1");sessionStorage.removeItem("random_custom_candidates_v1");sessionStorage.removeItem("random_custom_tokens_v1");sessionStorage.removeItem("random_custom_token_map_v1");sessionStorage.removeItem("random_custom_page_v1");sessionStorage.removeItem("random_review_nav_flag_v1");}catch(_){}
window.location.reload();});document.getElementById("cr-continue").addEventListener("click",async(e)=>{e.preventDefault();if(__crBannerDiceState.navigating)return;__crBannerDiceState.navigating=true;const contBtn=document.getElementById("cr-continue");const generation=++__crBannerDiceState.generation;const sourceUrl=String(window.location.href||"");const isCurrent=()=>generation===__crBannerDiceState.generation&&String(window.location.href||"")===sourceUrl&&contBtn&&contBtn.isConnected&&document.getElementById("cr-continue")===contBtn;__crBannerDiceState.button=contBtn;let committed=false;try{const ico=contBtn?contBtn.querySelector(".cr-dice__ico"):null;const currentId=normLoc(currentRelPath());let pool=readCandidates();pool=pool.filter((x)=>normLoc(x)!==currentId);if(window.ConceptMastery){pool=window.ConceptMastery.filterActive(pool);}
if(!pool.length){__crBannerDiceState.navigating=false;alert("Random pool only contains this page (or all remaining pages are Mastered). Please edit filter.");return;}
const chosen=(window.ConceptMastery&&window.ConceptMastery.pickWeighted)?window.ConceptMastery.pickWeighted(pool):pickRandom(pool);if(!chosen){__crBannerDiceState.navigating=false;return;}
let wantSelfTest=false;try{const cb=document.getElementById("cr-selftest");wantSelfTest=cb?cb.checked:(sessionStorage.getItem(REVIEW_MODE_KEY)==="1");if(wantSelfTest&&!crbHasShopItem(CRB_SELF_TEST_ITEM_ID)){wantSelfTest=await crbOfferUnlock(CRB_SELF_TEST_ITEM_ID,CRB_SELF_TEST_ITEM_TITLE,CRB_SELF_TEST_ITEM_PRICE,"random-banner-continue-self-test");if(!isCurrent())return;if(!wantSelfTest&&cb)cb.checked=false;}}catch(_){}
if(!isCurrent())return;const targetUrl=toAbsoluteUrl(chosen);try{if(contBtn){contBtn.setAttribute("aria-disabled","true");contBtn.style.pointerEvents="none";contBtn.style.opacity="0.9";}}catch(_){}
let face=1;try{if(ico){if(isHoverPointer())face=freezeToRandomFace(ico,__crBannerDiceState);else face=await rollDiceOnce(ico,{frames:14,interval:55});}}catch(_){}
if(!isCurrent())return;await sleep(250);if(!isCurrent())return;writeLastFace(face);try{sessionStorage.setItem(NAV_FLAG_KEY,"1");sessionStorage.setItem(ARRIVAL_ID_KEY,newArrivalId());sessionStorage.setItem(ARRIVAL_LOC_KEY,normLoc(chosen));if(wantSelfTest){sessionStorage.setItem(REVIEW_MODE_KEY,"1");sessionStorage.setItem(REVIEW_NAV_FLAG,"1");}else{sessionStorage.removeItem(REVIEW_MODE_KEY);sessionStorage.removeItem(REVIEW_NAV_FLAG);}}catch(_){}
window.location.assign(targetUrl);committed=true;}finally{if(!committed&&generation===__crBannerDiceState.generation){restoreContinueButton(contBtn);__crBannerDiceState.button=null;__crBannerDiceState.navigating=false;}}});document.getElementById("cr-change").addEventListener("click",(e)=>{e.preventDefault();cancelBannerNavigation();let entry="";try{entry=sessionStorage.getItem("random_custom_page_v1")||"";}catch(_){}
if(entry){window.location.assign(entry);return;}
try{const root=(document.querySelector('script[src*="assets/javascripts/bundle"]')&&new URL(document.querySelector('script[src*="assets/javascripts/bundle"]').getAttribute("src"),document.baseURI))||new URL(document.baseURI);const p=root.pathname;const idx=p.indexOf("/assets/");const siteRoot=idx>=0?root.origin+p.slice(0,idx+1):root.origin+(root.pathname.endsWith("/")?root.pathname:root.pathname+"/");window.location.assign(new URL("find.html",siteRoot).toString());}catch(_){window.location.assign("find.html");}});}
function init(){if(isOnCustomRandomPage())return;if(!consumeNavFlag())return;const rel=currentRelPath();if(!isConceptPage(rel))return;const cands=readCandidates();if(!cands.length)return;const tokens=readTokens();const tokenMap=readTokenMap();const matchedTokens=computeMatchedTokens(tokens,tokenMap,rel);insertBanner(cands,tokens,matchedTokens);}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
document.addEventListener("DOMContentSwitch",()=>{cancelBannerNavigation();init();});window.addEventListener("pagehide",cancelBannerNavigation);})();(function(){try{if(document.getElementById('random-banner-icon-currentcolor-v27'))return;const st=document.createElement('style');st.id='random-banner-icon-currentcolor-v27';st.textContent='\nhtml[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico,\nhtml[data-md-color-scheme="slate"] #custom-random-banner .cr-tool__ico,\nhtml[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico svg,\nhtml[data-md-color-scheme="slate"] #custom-random-banner .cr-tool__ico svg,\nhtml[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico svg *,\nhtml[data-md-color-scheme="slate"] #custom-random-banner .cr-tool__ico svg *,\nbody[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico,\nbody[data-md-color-scheme="slate"] #custom-random-banner .cr-tool__ico,\nbody[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico svg *,\nbody[data-md-color-scheme="slate"] #custom-random-banner .cr-tool__ico svg *{\n  color:#fff !important;\n  stroke:#fff !important;\n}\nhtml[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico svg [fill]:not([fill="none"]),\nhtml[data-md-color-scheme="slate"] #custom-random-banner .cr-tool__ico svg [fill]:not([fill="none"]),\nhtml[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico svg circle,\nbody[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico svg [fill]:not([fill="none"]),\nbody[data-md-color-scheme="slate"] #custom-random-banner .cr-tool__ico svg [fill]:not([fill="none"]),\nbody[data-md-color-scheme="slate"] #custom-random-banner .cr-dice__ico svg circle{ fill:#fff !important; }\n';(document.head||document.documentElement).appendChild(st);}catch(_){}})();(function(){try{if(document.getElementById('random-banner-icon-ink-v28'))return;const st=document.createElement('style');st.id='random-banner-icon-ink-v28';st.textContent='\n#custom-random-banner .cr-dice__ico,\n#custom-random-banner .cr-tool__ico,\n#custom-random-banner .cr-dice__ico svg,\n#custom-random-banner .cr-tool__ico svg,\n#custom-random-banner .cr-dice__ico svg *,\n#custom-random-banner .cr-tool__ico svg *{\n  color:rgba(255,255,255,.94) !important;\n  stroke:rgba(255,255,255,.94) !important;\n}\n#custom-random-banner .cr-dice__ico svg [fill]:not([fill="none"]),\n#custom-random-banner .cr-tool__ico svg [fill]:not([fill="none"]),\n#custom-random-banner .cr-dice__ico svg circle{ fill:rgba(255,255,255,.94) !important; }\n';(document.head||document.documentElement).appendChild(st);}catch(_){}})();