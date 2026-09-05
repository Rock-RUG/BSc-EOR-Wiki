(function(){function __mkFetchSearchIndex(url,init){const shared=window.__mkFetchJsonShared;if(typeof shared==="function")return shared(url,init);return fetch(url,init).then(function(r){return r&&r.ok?r.json():null;});}
const{TOKENS_KEY,EXPR_KEY,FB_TOKEN_INPUT_HISTORY_KEY,FB_TOKEN_INPUT_HISTORY_MAX,FUZZY_CORE_PATH,FB_ENTER_CACHE_KEY,FB_ENTER_PAYLOAD_KEY_V2,FB_ENTER_PAYLOAD_KEY_V1,FB_DISSOLVE_MS_DEFAULT,FB_HINT_DELAY_AFTER_DISSOLVE_MS,FB_MOBILE_INTRO_TIPS_STYLE_ID,FB_FIND_PAGE_TITLE,escapeHtml,clamp,isOnFindPage,fbGetSiteRootUrl,fbConsumeGuestAction,fbShopApi,isTerm,isOp,isLP,isRP,nodeLabel,fbCanAutofillRunButton,fbDispatchSyntheticClick,fbReadLpDirectRequest,fbIsGarbageToken,fbTokenizeWords,fbLevenshtein,fbTermMatchesHay,fbIsSafeForFuzzyToken,hasRecentHeaderSearchInteraction,fbIsMaterialHeaderSearchInput,fbStopTopSearchEnterEvent,fbParseComputedColor,fbCompositeColor,fbRelativeLuminance,readJsonFrom,writeJsonTo,fbPrefersReducedMotion,fbRectCenter,fbInputStartPoint,fbBezierQuad,fbPickGhostStyleSource,fbCaptureBoardChipRects,fbFindTokenButtonByText,fbFindBoardChipByNodeId,fbAnimTokenKey,parseTokensFromInput,fbGetTokenInputEl,fbIsMobileTokenInputUi,fbStopEnterEvent,fbSplitTokenInputForSuggest,fbNormaliseTokenInputValue,fbTokenInputCanInline,fbTokenInputPointerPoint,validateTokens,tokensToExprText,fbNormaliseForSearch,fbAsStringList,fbToRPN,fbEvalRPN,buildNoMatchTokenHint,formatExprForDisplay,fbIsMobileIntroTipsMode,fbFindIntroArticle,fbCleanFindIntroTitleText,fbLooksLikeFindIntroParagraph,fbQuickShopIconSvg,buttonHtml}=window.MkFB||{};window.__findBuilderVersion="v5.6.33-theme-aware-finder-foreground";try{window.__mkFindFxDisabled=true;}catch(_){}
function fbInstallRandomDiceLightBgFixV1(){if(document.getElementById("mk-random-dice-light-bg-fix-v1"))return;const st=document.createElement("style");st.id="mk-random-dice-light-bg-fix-v1";st.textContent=`
      /* Start random: remove only the light-mode icon tile behind the dice. */
      html[data-md-color-scheme="default"] .md-typeset .md-button#rf-start::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button#rf-start::before,
      html[data-md-color-scheme="default"] .md-typeset .md-button#cr-start::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button#cr-start::before,
      html[data-md-color-scheme="default"] .md-typeset .md-button#random-start::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button#random-start::before,
      html[data-md-color-scheme="default"] .md-typeset .md-button.start-random::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button.start-random::before,
      html[data-md-color-scheme="default"] .md-typeset .md-button[data-random-start]::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button[data-random-start]::before,
      html[data-md-color-scheme="default"] .md-typeset .md-button[aria-label*="Start random" i]::before,
      body[data-md-color-scheme="default"] .md-typeset .md-button[aria-label*="Start random" i]::before{
        background: transparent !important;
        border-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
      }

      /* Same fix for the fb-cta icon-span implementation, if this button is rendered with fb-cta markup. */
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#rf-start,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#rf-start,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#cr-start,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#cr-start,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#random-start,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#random-start,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn.start-random,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn.start-random,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[data-random-start],
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[data-random-start],
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[aria-label*="Start random" i],
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[aria-label*="Start random" i]{
        --cta-ico-bg: transparent !important;
        --cta-ico-border: transparent !important;
      }

      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#rf-start .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#rf-start .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#cr-start .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#cr-start .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#random-start .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn#random-start .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn.start-random .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn.start-random .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[data-random-start] .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[data-random-start] .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[aria-label*="Start random" i] .fb-cta__ico,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn[aria-label*="Start random" i] .fb-cta__ico,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn .fb-cta__ico--random,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn .fb-cta__ico--random,
      html[data-md-color-scheme="default"] .md-typeset .fb-cta-btn .fb-cta__ico--dice,
      body[data-md-color-scheme="default"] .md-typeset .fb-cta-btn .fb-cta__ico--dice{
        background: transparent !important;
        border-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
      }
    `;(document.head||document.documentElement).appendChild(st);}
try{fbInstallRandomDiceLightBgFixV1();}catch(_){}
const FB_LOGIC_ITEM_ID="logic_operators";const FB_LOGIC_ITEM_TITLE="Search Logic Operators";const FB_LOGIC_ITEM_PRICE=50;function fbHasShopItem(itemId){if(String(itemId||"")===FB_LOGIC_ITEM_ID)return true;try{const api=fbShopApi();if(api&&typeof api.hasShopItem==="function")return!!api.hasShopItem(itemId);const xp=api&&typeof api.xp==="function"?api.xp():null;const owned=xp&&(xp.ownedShopItems||(xp.shopInventory&&xp.shopInventory.ownedIds));return Array.isArray(owned)&&owned.indexOf(itemId)>=0;}catch(_){return false;}}
function fbCurrencyBalance(){try{const api=fbShopApi();const xp=api&&typeof api.xp==="function"?api.xp():null;return Number(xp&&(xp.currencyBalance!=null?xp.currencyBalance:xp.eorbits)||0)||0;}catch(_){return 0;}}
function fbOfferUnlock(itemId,title,price,source){try{if(fbHasShopItem(itemId))return Promise.resolve(true);const api=fbShopApi();if(!api||typeof api.buyShopItem!=="function"){window.alert("The shop is still loading. Please try again in a moment.");return Promise.resolve(false);}
const balance=fbCurrencyBalance();if(balance+1e-9<Number(price||0)){window.alert(`${title} needs ${price} EORbits. You currently have ${Math.round(balance * 10) / 10}.`);return Promise.resolve(false);}
if(!window.confirm(`Unlock ${title} for ${price} EORbits?`))return Promise.resolve(false);return api.buyShopItem(itemId,{source:source||itemId}).then((res)=>{if(!res||res.ok===false){window.alert(res&&res.error==="insufficient_funds"?"Not enough EORbits.":"Unlock failed. Please try again.");return false;}
try{window.dispatchEvent(new CustomEvent("mk-shop-inventory-change",{detail:{itemId,source:source||itemId}}));}catch(_){}
return true;});}catch(err){try{window.alert(String(err&&err.message||err||"Unlock failed."));}catch(_){}
return Promise.resolve(false);}}
function fbEnsureLogicUnlocked(source){if(fbHasShopItem(FB_LOGIC_ITEM_ID))return Promise.resolve(true);return fbOfferUnlock(FB_LOGIC_ITEM_ID,FB_LOGIC_ITEM_TITLE,FB_LOGIC_ITEM_PRICE,source||"find-builder-logic");}
function fbMarkLockedLogicButtons(host){try{const locked=!fbHasShopItem(FB_LOGIC_ITEM_ID);(host||document).querySelectorAll("#fb-and,#fb-or").forEach((btn)=>{btn.classList.toggle("fb-op-locked",locked);btn.title=locked?`Unlock ${FB_LOGIC_ITEM_TITLE} · ${FB_LOGIC_ITEM_PRICE} EORbits`:"";});}catch(_){}}
function fbInstallShopLockStylesOnce(){if(document.getElementById("mk-find-builder-shop-lock-style-v1"))return;const st=document.createElement("style");st.id="mk-find-builder-shop-lock-style-v1";st.textContent=`
      #fb-and.fb-op-locked,#fb-or.fb-op-locked{
        border-color:rgba(245,200,75,.42) !important;
        color:color-mix(in srgb,#f5c84b 82%,var(--md-default-fg-color)) !important;
      }
      #fb-and.fb-op-locked::after,#fb-or.fb-op-locked::after{
        content:"🔒";
        font-size:.58em;
        margin-left:.35em;
        opacity:.78;
      }
    `;(document.head||document.documentElement).appendChild(st);}
try{fbInstallShopLockStylesOnce();}catch(_){}
document.addEventListener("DOMContentSwitch",()=>{try{fbInstallRandomDiceLightBgFixV1();}catch(_){}
const FB_LOGIC_ITEM_ID="logic_operators";const FB_LOGIC_ITEM_TITLE="Search Logic Operators";const FB_LOGIC_ITEM_PRICE=50;function fbShopApi(){try{return window.MkAccountData||null;}catch(_){return null;}}
function fbHasShopItem(itemId){if(String(itemId||"")===FB_LOGIC_ITEM_ID)return true;try{const api=fbShopApi();if(api&&typeof api.hasShopItem==="function")return!!api.hasShopItem(itemId);const xp=api&&typeof api.xp==="function"?api.xp():null;const owned=xp&&(xp.ownedShopItems||(xp.shopInventory&&xp.shopInventory.ownedIds));return Array.isArray(owned)&&owned.indexOf(itemId)>=0;}catch(_){return false;}}
function fbCurrencyBalance(){try{const api=fbShopApi();const xp=api&&typeof api.xp==="function"?api.xp():null;return Number(xp&&(xp.currencyBalance!=null?xp.currencyBalance:xp.eorbits)||0)||0;}catch(_){return 0;}}
function fbOfferUnlock(itemId,title,price,source){try{if(fbHasShopItem(itemId))return Promise.resolve(true);const api=fbShopApi();if(!api||typeof api.buyShopItem!=="function"){window.alert("The shop is still loading. Please try again in a moment.");return Promise.resolve(false);}
const balance=fbCurrencyBalance();if(balance+1e-9<Number(price||0)){window.alert(`${title} needs ${price} EORbits. You currently have ${Math.round(balance * 10) / 10}.`);return Promise.resolve(false);}
if(!window.confirm(`Unlock ${title} for ${price} EORbits?`))return Promise.resolve(false);return api.buyShopItem(itemId,{source:source||itemId}).then((res)=>{if(!res||res.ok===false){window.alert(res&&res.error==="insufficient_funds"?"Not enough EORbits.":"Unlock failed. Please try again.");return false;}
try{window.dispatchEvent(new CustomEvent("mk-shop-inventory-change",{detail:{itemId,source:source||itemId}}));}catch(_){}
return true;});}catch(err){try{window.alert(String(err&&err.message||err||"Unlock failed."));}catch(_){}
return Promise.resolve(false);}}
function fbEnsureLogicUnlocked(source){if(fbHasShopItem(FB_LOGIC_ITEM_ID))return Promise.resolve(true);return fbOfferUnlock(FB_LOGIC_ITEM_ID,FB_LOGIC_ITEM_TITLE,FB_LOGIC_ITEM_PRICE,source||"find-builder-logic");}
function fbMarkLockedLogicButtons(host){try{const locked=!fbHasShopItem(FB_LOGIC_ITEM_ID);(host||document).querySelectorAll("#fb-and,#fb-or").forEach((btn)=>{btn.classList.toggle("fb-op-locked",locked);btn.title=locked?`Unlock ${FB_LOGIC_ITEM_TITLE} · ${FB_LOGIC_ITEM_PRICE} EORbits`:"";});}catch(_){}}
function fbInstallShopLockStylesOnce(){if(document.getElementById("mk-find-builder-shop-lock-style-v1"))return;const st=document.createElement("style");st.id="mk-find-builder-shop-lock-style-v1";st.textContent=`
      #fb-and.fb-op-locked,#fb-or.fb-op-locked{
        border-color:rgba(245,200,75,.42) !important;
        color:color-mix(in srgb,#f5c84b 82%,var(--md-default-fg-color)) !important;
      }
      #fb-and.fb-op-locked::after,#fb-or.fb-op-locked::after{
        content:"🔒";
        font-size:.58em;
        margin-left:.35em;
        opacity:.78;
      }
    `;(document.head||document.documentElement).appendChild(st);}
try{fbInstallShopLockStylesOnce();}catch(_){}});window.addEventListener("pageshow",()=>{try{fbInstallRandomDiceLightBgFixV1();}catch(_){}
const FB_LOGIC_ITEM_ID="logic_operators";const FB_LOGIC_ITEM_TITLE="Search Logic Operators";const FB_LOGIC_ITEM_PRICE=50;function fbShopApi(){try{return window.MkAccountData||null;}catch(_){return null;}}
function fbHasShopItem(itemId){if(String(itemId||"")===FB_LOGIC_ITEM_ID)return true;try{const api=fbShopApi();if(api&&typeof api.hasShopItem==="function")return!!api.hasShopItem(itemId);const xp=api&&typeof api.xp==="function"?api.xp():null;const owned=xp&&(xp.ownedShopItems||(xp.shopInventory&&xp.shopInventory.ownedIds));return Array.isArray(owned)&&owned.indexOf(itemId)>=0;}catch(_){return false;}}
function fbCurrencyBalance(){try{const api=fbShopApi();const xp=api&&typeof api.xp==="function"?api.xp():null;return Number(xp&&(xp.currencyBalance!=null?xp.currencyBalance:xp.eorbits)||0)||0;}catch(_){return 0;}}
function fbOfferUnlock(itemId,title,price,source){try{if(fbHasShopItem(itemId))return Promise.resolve(true);const api=fbShopApi();if(!api||typeof api.buyShopItem!=="function"){window.alert("The shop is still loading. Please try again in a moment.");return Promise.resolve(false);}
const balance=fbCurrencyBalance();if(balance+1e-9<Number(price||0)){window.alert(`${title} needs ${price} EORbits. You currently have ${Math.round(balance * 10) / 10}.`);return Promise.resolve(false);}
if(!window.confirm(`Unlock ${title} for ${price} EORbits?`))return Promise.resolve(false);return api.buyShopItem(itemId,{source:source||itemId}).then((res)=>{if(!res||res.ok===false){window.alert(res&&res.error==="insufficient_funds"?"Not enough EORbits.":"Unlock failed. Please try again.");return false;}
try{window.dispatchEvent(new CustomEvent("mk-shop-inventory-change",{detail:{itemId,source:source||itemId}}));}catch(_){}
return true;});}catch(err){try{window.alert(String(err&&err.message||err||"Unlock failed."));}catch(_){}
return Promise.resolve(false);}}
function fbEnsureLogicUnlocked(source){if(fbHasShopItem(FB_LOGIC_ITEM_ID))return Promise.resolve(true);return fbOfferUnlock(FB_LOGIC_ITEM_ID,FB_LOGIC_ITEM_TITLE,FB_LOGIC_ITEM_PRICE,source||"find-builder-logic");}
function fbMarkLockedLogicButtons(host){try{const locked=!fbHasShopItem(FB_LOGIC_ITEM_ID);(host||document).querySelectorAll("#fb-and,#fb-or").forEach((btn)=>{btn.classList.toggle("fb-op-locked",locked);btn.title=locked?`Unlock ${FB_LOGIC_ITEM_TITLE} · ${FB_LOGIC_ITEM_PRICE} EORbits`:"";});}catch(_){}}
function fbInstallShopLockStylesOnce(){if(document.getElementById("mk-find-builder-shop-lock-style-v1"))return;const st=document.createElement("style");st.id="mk-find-builder-shop-lock-style-v1";st.textContent=`
      #fb-and.fb-op-locked,#fb-or.fb-op-locked{
        border-color:rgba(245,200,75,.42) !important;
        color:color-mix(in srgb,#f5c84b 82%,var(--md-default-fg-color)) !important;
      }
      #fb-and.fb-op-locked::after,#fb-or.fb-op-locked::after{
        content:"🔒";
        font-size:.58em;
        margin-left:.35em;
        opacity:.78;
      }
    `;(document.head||document.documentElement).appendChild(st);}
try{fbInstallShopLockStylesOnce();}catch(_){}},{passive:true});function fbInstallNoBlurCssV8(){if(document.getElementById("mk-find-no-blur-v8"))return;const st=document.createElement("style");st.id="mk-find-no-blur-v8";st.textContent=`
      #find-builder.fb-dream-active .fb-board,
      #search-results.fb-preblur,
      #search-results.fb-preblur .csr-cols,
      #search-results.fb-preblur .csr-list,
      #search-results.fb-preblur .csr-foot,
      #find-builder .fb-hint--pending,
      #find-builder .fb-hint--reveal{
        filter:none!important;
        backdrop-filter:none!important;
        -webkit-backdrop-filter:none!important;
        opacity:1!important;
        transform:none!important;
        animation:none!important;
        transition:none!important;
      }
    `;(document.head||document.documentElement).appendChild(st);}
function fbClearNoBlurResidueV8(){try{fbInstallNoBlurCssV8();}catch(_){}
try{const fb=document.getElementById("find-builder");if(fb)fb.classList.remove("fb-dream-active","fb-undo-bump","fb-redo-bump");const res=document.getElementById("search-results");if(res)res.classList.remove("fb-preblur");document.querySelectorAll("#search-results .csr-cols,#search-results .csr-list,#search-results .csr-foot,#find-builder .fb-board,#find-builder .fb-hint").forEach((el)=>{el.style.filter="";el.style.opacity="";el.style.transform="";el.classList.remove("fb-hint--pending","fb-hint--reveal");});}catch(_){}}
fbInstallNoBlurCssV8();if(!window.MkSiteMotion){(function(){const STORAGE_KEY="mk_site_motion_enabled_v1";const CHANGE_EVENT="mk:site-motion-change";const BTN_WRAP_ID="mk-site-motion-toggle";const STYLE_ID="mk-site-motion-style-v1";let __mkRetryTimer=0;let __mkRetryCount=0;const __MK_MAX_RETRY=40;function __mkReadUserEnabled(){try{const raw=localStorage.getItem(STORAGE_KEY);return raw==null?true:raw!=="0";}catch(_){return true;}}
function __mkWriteUserEnabled(v){try{localStorage.setItem(STORAGE_KEY,v?"1":"0");}catch(_){}}
function __mkSystemReduced(){try{return!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);}catch(_){return false;}}
function __mkMotionEnabled(){return __mkReadUserEnabled()&&!__mkSystemReduced();}
function __mkApplyHtmlState(){const root=document.documentElement;const enabled=__mkMotionEnabled();if(!root)return enabled;root.classList.toggle("mk-site-motion-on",enabled);root.classList.toggle("mk-site-motion-off",!enabled);return enabled;}
function __mkEnsureMotionStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
#${BTN_WRAP_ID}{
  display:inline-flex;
  align-items:center;
}
#${BTN_WRAP_ID}.md-header__option{
  margin-left: 0;
}
#${BTN_WRAP_ID} .mk-motion-btn{
  appearance:none;
  border:0;
  background:transparent;
  color:inherit;
  width:2.2rem;
  height:2.2rem;
  padding:0;
  border-radius:999px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  opacity:.96;
}
#${BTN_WRAP_ID} .mk-motion-btn:hover{
  background:rgba(255,255,255,.10);
}
html[data-md-color-scheme="default"] #${BTN_WRAP_ID} .mk-motion-btn:hover,
body[data-md-color-scheme="default"] #${BTN_WRAP_ID} .mk-motion-btn:hover{
  background:rgba(0,0,0,.06);
}
#${BTN_WRAP_ID}.is-off .mk-motion-btn{
  opacity:.82;
}
#${BTN_WRAP_ID}.is-system-off .mk-motion-btn{
  opacity:.68;
}
#${BTN_WRAP_ID} .mk-motion-btn svg{
  width:1.1rem;
  height:1.1rem;
  display:block;
}
html.mk-site-motion-off #find-builder .fb-fly-layer,
html.mk-site-motion-off #find-builder .fb-fly-ghost,
html.mk-site-motion-off #lp-map-modal .lp-flow-arrow{
  display:none !important;
}
html.mk-site-motion-off #lp-map-modal .lp-mapviewport svg path.lp-rel-edge.lp-rel-anim{
  animation:none !important;
}
`;(document.head||document.documentElement).appendChild(st);}
function __mkEnabledIcon(){return'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5.14v14l11-7-11-7Z"/></svg>';}
function __mkDisabledIcon(){return'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 19h4V5H6v14m8-14v14h4V5h-4Z"/></svg>';}
function __mkGetAnchor(){const palette=document.querySelector('label[for="__palette"]');if(palette&&palette.closest){const opt=palette.closest('.md-header__option');if(opt)return opt;}
const options=document.querySelector('.md-header__options');if(options)return options;return document.querySelector('.md-header');}
function __mkUpdateButton(){const wrap=document.getElementById(BTN_WRAP_ID);if(!wrap)return;const btn=wrap.querySelector('.mk-motion-btn');if(!btn)return;const enabled=__mkMotionEnabled();const systemReduced=__mkSystemReduced();btn.innerHTML=enabled?__mkEnabledIcon():__mkDisabledIcon();btn.setAttribute('aria-label',enabled?'Turn off site animations':'Turn on site animations');btn.setAttribute('title',systemReduced?'Site animations follow your system reduced-motion setting':(enabled?'Turn off site animations':'Turn on site animations'));wrap.classList.toggle('is-off',!enabled);wrap.classList.toggle('is-system-off',systemReduced);}
function __mkInsertButton(anchor){let wrap=document.getElementById(BTN_WRAP_ID);if(!wrap){wrap=document.createElement('div');wrap.id=BTN_WRAP_ID;wrap.className='md-header__option';wrap.innerHTML='<button type="button" class="md-header__button md-icon mk-motion-btn"></button>';const btn=wrap.querySelector('.mk-motion-btn');if(btn){btn.addEventListener('click',function(){__mkWriteUserEnabled(!__mkReadUserEnabled());window.MkSiteMotion.refresh();});}}
const parent=anchor&&anchor.parentNode?anchor.parentNode:null;if(anchor&&anchor.classList&&anchor.classList.contains('md-header__option')&&parent){if(wrap.parentNode!==parent||wrap.previousSibling!==anchor){anchor.insertAdjacentElement('afterend',wrap);}}else if(anchor&&wrap.parentNode!==anchor){anchor.appendChild(wrap);}
__mkUpdateButton();return true;}
function __mkEmitChange(){const detail={enabled:__mkMotionEnabled(),userEnabled:__mkReadUserEnabled(),systemReduced:__mkSystemReduced()};try{window.dispatchEvent(new CustomEvent(CHANGE_EVENT,{detail}));}catch(_){}}
function __mkClearRetry(){if(__mkRetryTimer){clearTimeout(__mkRetryTimer);__mkRetryTimer=0;}}
function __mkEnsureButton(){__mkEnsureMotionStyles();__mkApplyHtmlState();const anchor=__mkGetAnchor();if(!anchor)return false;__mkClearRetry();__mkRetryCount=0;return __mkInsertButton(anchor);}
function __mkScheduleRetry(){if(__mkRetryTimer||__mkRetryCount>=__MK_MAX_RETRY)return;__mkRetryCount+=1;__mkRetryTimer=window.setTimeout(function(){__mkRetryTimer=0;if(!__mkEnsureButton())__mkScheduleRetry();},200);}
function __mkMount(){__mkEnsureMotionStyles();__mkApplyHtmlState();if(!__mkEnsureButton())__mkScheduleRetry();__mkEmitChange();}
window.MkSiteMotion={isEnabled:__mkMotionEnabled,isReduced:function(){return!__mkMotionEnabled();},readUserEnabled:__mkReadUserEnabled,setEnabled:function(v){__mkWriteUserEnabled(!!v);this.refresh();},refresh:function(){__mkApplyHtmlState();if(!__mkEnsureButton())__mkScheduleRetry();__mkEmitChange();},mount:__mkMount,};try{const mq=window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null;const onChange=function(){window.MkSiteMotion.refresh();};if(mq&&typeof mq.addEventListener==='function')mq.addEventListener('change',onChange);else if(mq&&typeof mq.addListener==='function')mq.addListener(onChange);}catch(_){}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',__mkMount,{once:true});}else{__mkMount();}
document.addEventListener('DOMContentSwitch',__mkMount);window.addEventListener('pageshow',__mkMount);window.addEventListener('load',__mkMount);})();}else{try{window.MkSiteMotion.mount&&window.MkSiteMotion.mount();}catch(_){}}
const __fbTokenInputUi={seq:0,activeIndex:-1,items:[],suppressBlurHideUntil:0,pointerFocusUntil:0,lastPointerDownTarget:null,lastPointerDownTs:0,lastApplied:"",bootAt:Date.now(),bootGuardUntil:Date.now()+1350,mobileFocusGraceUntil:0,mobileDropdownDeferUntil:0,mobileBootTapUntil:0,lastFocusTs:0,dropdownPress:null,dropdownSuppressChoiceUntil:0,};let __fbFuzzyLoadPromise=null;function fbEnsureFuzzyCore(){if(window.__mkFuzzyCore)return Promise.resolve(window.__mkFuzzyCore);if(__fbFuzzyLoadPromise)return __fbFuzzyLoadPromise;__fbFuzzyLoadPromise=new Promise((resolve)=>{const existing=document.querySelector('script[data-mk-fuzzy-core="1"]');if(existing){existing.addEventListener("load",()=>resolve(window.__mkFuzzyCore),{once:true});existing.addEventListener("error",()=>resolve(null),{once:true});return;}
const s=document.createElement("script");s.dataset.mkFuzzyCore="1";s.async=true;s.defer=true;try{s.src=new URL(FUZZY_CORE_PATH,fbGetSiteRootUrl()).toString();}catch(_){s.src=FUZZY_CORE_PATH;}
s.onload=()=>resolve(window.__mkFuzzyCore||null);s.onerror=()=>resolve(null);document.head.appendChild(s);});return __fbFuzzyLoadPromise;}
function fbEnsureFuzzyStyles(){}
function fbApplyFuzzyNoteDom(host){fbEnsureFuzzyStyles();const root=host||document.getElementById("find-builder")||document;const note=root&&root.querySelector?root.querySelector("#fb-fuzzy-note"):document.getElementById("fb-fuzzy-note");if(!note)return;const st=state.fuzzyNote||{visible:false,html:"",payload:""};if(!st.visible){note.style.display="none";note.innerHTML="";note.removeAttribute("data-fb-fuzzy-payload");return;}
note.innerHTML=st.html||"";note.style.display="flex";if(st.payload)note.setAttribute("data-fb-fuzzy-payload",st.payload);else note.removeAttribute("data-fb-fuzzy-payload");}
function fbShowFuzzyNote(html,payloadObj){const payload=payloadObj?(()=>{try{return JSON.stringify(payloadObj);}catch(_){return"";}})():"";state.fuzzyNote={visible:true,html:html||"",payload};fbApplyFuzzyNoteDom(document.getElementById("find-builder"));}
function fbHideFuzzyNote(){state.fuzzyNote={visible:false,html:"",payload:""};fbApplyFuzzyNoteDom(document.getElementById("find-builder"));}
const __fbAutofillStateV1={running:false,last:"",t:0};function fbMarkReadyV1(){try{window.__fbReadyV1=true;}catch(_){}
if(window.__fbReadyDispatchedV1)return;window.__fbReadyDispatchedV1=true;try{window.dispatchEvent(new CustomEvent("fb:ready"));}catch(_){}}
function fbBindAutofillListenerOnce(){if(window.__fbAutofillBoundV1)return;window.__fbAutofillBoundV1=true;try{window.addEventListener("find:autofill",(ev)=>{const token=ev&&ev.detail?ev.detail.token:"";fbAutofillFromTopSearch(token);});}catch(_){}}
function fbRunSearchFallbackFromAutofill(){try{if(!state||!Array.isArray(state.expr)||!state.expr.length)return false;const norm=normalizeNodesToTokens(state.expr);const exprText=tokensToExprText(norm);if(!exprText)return false;try{clearStatus();}catch(_){}
try{render();}catch(_){}
try{fbStartRunSearchFx();}catch(_){}
if(window.__findSearchV2&&typeof window.__findSearchV2.runLogicExpr==="function"){window.__findSearchV2.runLogicExpr(exprText);return true;}
if(window.__findSearchV2&&typeof window.__findSearchV2.runQuery==="function"){window.__findSearchV2.runQuery(exprText);return true;}
const params=new URLSearchParams(window.location.search);params.set("q",exprText);window.location.search=params.toString();return true;}catch(_){return false;}}
async function fbWaitAndRunSearchFromAutofill(timeoutMs,isCurrent){const timeout=Number.isFinite(timeoutMs)?timeoutMs:2400;const startedAt=Date.now();let attempts=0;while(Date.now()-startedAt<timeout){if(typeof isCurrent==="function"&&!isCurrent())return false;attempts+=1;const scope=document.getElementById("find-builder")||document;const rb=scope.querySelector("#fb-run")||document.querySelector("#fb-run");const hasExpr=!!(state&&Array.isArray(state.expr)&&state.expr.length);if(rb&&hasExpr&&fbCanAutofillRunButton(rb)){fbDispatchSyntheticClick(rb);return true;}
await new Promise((r)=>setTimeout(r,attempts<8?32:80));}
if(typeof isCurrent==="function"&&!isCurrent())return false;return fbRunSearchFallbackFromAutofill();}
function fbConsumeLpDirectRequest(){const req=fbReadLpDirectRequest();if(!req)return null;try{const url=new URL(window.location.href);url.searchParams.delete("q");url.searchParams.delete("lp_direct");url.searchParams.delete("fb_direct");url.searchParams.delete("lp_token");url.searchParams.delete("lp_kind");const src=String(url.searchParams.get("src")||"").trim().toLowerCase();if(src==="learning_path"||src==="lp_direct"){url.searchParams.delete("src");}
history.replaceState(history.state||{},"",url.toString());}catch(_){}
return req;}
async function fbAutofillFromTopSearch(rawToken){const q=String(rawToken||"").trim().replace(/\s+/g," ");if(!q)return;const now=Date.now();if(__fbAutofillStateV1.running&&__fbAutofillStateV1.last===q&&now-(__fbAutofillStateV1.t||0)<1200)return;const requestId=__fbAutofillStateV1.request=(Number(__fbAutofillStateV1.request)||0)+1;__fbAutofillStateV1.running=true;__fbAutofillStateV1.last=q;__fbAutofillStateV1.t=now;try{state.enterQuery="";state.enterQueryUsed=true;}catch(_){}
try{fbHideFuzzyNote();}catch(_){}
try{clearStatus();}catch(_){}
const beforePool=(()=>{try{return readTokens();}catch(_){return[];}})();const beforePoolLower=new Set(beforePool.map((x)=>String(x||"").trim().toLowerCase()));const rawTokens=parseTokensFromInput(q);const toks=rawTokens.length?rawTokens:[q];const first=String(toks[0]||"").trim().replace(/\s+/g," ");if(!first){__fbAutofillStateV1.running=false;return;}
try{state.history=[];state.future=[];}catch(_){}
state.expr=[TERM(first)];state.cursor=state.expr.length;try{state.tokens=addTokensToStorage(toks);}catch(_){}
clearStatus();render();const sourceUrl=window.location.href;const sourceHost=document.getElementById("find-builder");const sourceExpr=state.expr;let expectedExpr=tokensToExprText(normalizeNodesToTokens(state.expr));const isCurrent=()=>requestId===__fbAutofillStateV1.request&&window.location.href===sourceUrl&&document.getElementById("find-builder")===sourceHost&&state.expr===sourceExpr&&tokensToExprText(normalizeNodesToTokens(state.expr))===expectedExpr;try{try{const has=await fbHasAnyMatchForTermCached(first);if(!isCurrent())return;if(!has){let to="";try{to=await fbSuggestPhraseForAdd(first);}catch(_){to="";}
if(!isCurrent())return;to=String(to||"").trim().replace(/\s+/g," ");if(to&&to.toLowerCase()!==first.toLowerCase()){let ok=true;try{ok=await fbHasAnyMatchForTermCached(to);}catch(_){ok=true;}
if(!isCurrent())return;if(ok){const exprBefore=snapshot().expr;fbReplaceTokenEverywhere(first,to);try{state.tokens=readTokens();}catch(_){}
clearStatus();render();const exprNow=tokensToExprText(normalizeNodesToTokens(state.expr));expectedExpr=exprNow;const swapExisted=beforePoolLower.has(String(to).toLowerCase());const tokenSwaps=swapExisted?{}:{[to]:first};const tokenAddsOnEdit=swapExisted?[first]:[];fbShowFuzzyNote(`<div class="fb-fuzzy-msg">No results as typed. Using <code>${escapeHtml(to)}</code> instead of <code>${escapeHtml(first)}</code>.</div>
               <div class="fb-fuzzy-actions">
                 <button type="button" class="fb-fuzzy-btn fb-fuzzy-btn--undo" data-fb-fuzzy-act="edit">Edit as typed</button>
               </div>`,{origExpr:exprBefore,tokenSwaps,tokenAddsOnEdit,forExprText:exprNow});}}}}catch(_){}
try{await new Promise((r)=>setTimeout(r,0));if(!isCurrent())return;await fbWaitAndRunSearchFromAutofill(2600,isCurrent);}catch(_){}}finally{if(requestId===__fbAutofillStateV1.request)__fbAutofillStateV1.running=false;}}
function fbReadEnterQueryNow(){try{const params=new URLSearchParams(window.location.search);if(params.get("src")==="header_search")return(params.get("q")||"").trim();if(params.get("src")==="header_search_done")return"";}catch(_){}
try{const raw=sessionStorage.getItem(FB_ENTER_PAYLOAD_KEY_V2)||"";const s=String(raw||"").trim();if(s&&s.startsWith("{")){const obj=JSON.parse(s);const q=String(obj&&obj.q||"").trim();if(q)return q;}
if(s)return s;}catch(_){}
try{const q1=String(sessionStorage.getItem(FB_ENTER_PAYLOAD_KEY_V1)||"").trim();if(q1)return q1;}catch(_){}
try{const q2=String(sessionStorage.getItem(FB_ENTER_CACHE_KEY)||"").trim();if(q2)return q2;}catch(_){}
return"";}
function fbCacheEnterQuery(){const q=fbReadEnterQueryNow();if(!q)return"";try{sessionStorage.setItem(FB_ENTER_CACHE_KEY,q);}catch(_){}
return q;}
function fbGetFirstTermInExpr(){for(const n of state.expr||[]){if(n&&n.t==="TERM"){const v=String(n.v||"").trim().replace(/\s+/g," ");if(v)return v;}}
return"";}
function fbMaybeShowEnterCorrectionNote(){if(state.enterQueryUsed)return;if(!state.enterQuery)return;if(state.fuzzyNote&&state.fuzzyNote.visible)return;const orig=String(state.enterQuery||"").trim().replace(/\s+/g," ");if(!orig)return;const nowTerm=fbGetFirstTermInExpr();if(!nowTerm)return;if(nowTerm.toLowerCase()===orig.toLowerCase())return;const normNow=normalizeNodesToTokens(state.expr);const exprNow=tokensToExprText(normNow);const msg=`<code>${escapeHtml(nowTerm)}</code> instead of <code>${escapeHtml(orig)}</code>`;fbShowFuzzyNote(`<div class="fb-fuzzy-msg">No results as typed. Using ${msg}.</div>
       <div class="fb-fuzzy-actions">
         <button type="button" class="fb-fuzzy-btn fb-fuzzy-btn--undo" data-fb-fuzzy-act="edit">Edit as typed</button>
       </div>`,{origExpr:snapshot().expr,tokenSwaps:{[nowTerm]:orig},forExprText:exprNow});state.enterQueryUsed=true;}
function fbReplaceTokenEverywhere(fromToken,toToken){const from=String(fromToken||"").trim().replace(/\s+/g," ");const to=String(toToken||"").trim().replace(/\s+/g," ");if(!from||!to||from===to)return;const curr=readTokens();const out=[];let hadFrom=false;for(const x of curr){const nx=String(x||"").trim().replace(/\s+/g," ");if(!nx)continue;if(nx===from){hadFrom=true;continue;}
if(!fbIsGarbageToken(nx))out.push(nx);}
if(hadFrom)out.push(to);writeTokens(Array.from(new Set(out)));for(const n of state.expr){if(n&&n.t==="TERM"){const v=String(n.v||"").trim().replace(/\s+/g," ");if(v===from)n.v=to;}}}
let __fb_pages_cache=null;async function fbGetPageDocsCached(){if(__fb_pages_cache)return __fb_pages_cache;const indexJson=await fbLoadIndex();const docs=(indexJson&&indexJson.docs)?indexJson.docs:[];__fb_pages_cache=fbAggregateDocsToPages(docs);return __fb_pages_cache;}
let __fb_vocab_cache=null;let __fb_vocab_list_cache=null;async function fbBuildVocab(){if(__fb_vocab_cache&&__fb_vocab_list_cache)return{map:__fb_vocab_cache,list:__fb_vocab_list_cache};const pages=await fbGetPageDocsCached();const freq=new Map();for(const d of pages||[]){const slug=(String(d.location||"").split("/").pop()||"").replace(/\.html$/i,"").replace(/[-_]+/g," ");const hay=[d.title||"",slug,Array.isArray(d.tags)?d.tags.join(" "):"",Array.isArray(d.aliases)?d.aliases.join(" "):"",].join(" ");for(const w of fbTokenizeWords(hay)){freq.set(w,(freq.get(w)||0)+1);}}
const list=Array.from(freq.entries()).map(([w,f])=>({w,f})).sort((a,b)=>(b.f-a.f)||(a.w<b.w?-1:a.w>b.w?1:0));__fb_vocab_cache=freq;__fb_vocab_list_cache=list;return{map:freq,list};}
async function fbSuggestToken(raw){const t0=String(raw||"").trim().replace(/\s+/g," ");if(!t0)return"";if(t0.includes(" "))return"";if(/[0-9]/.test(t0))return"";if(/[^\x00-\x7F]/.test(t0))return"";if(/[^a-zA-Z-]/.test(t0))return"";const t=t0.toLowerCase();const len=t.length;if(len<3||len>24)return"";const{list}=await fbBuildVocab();const maxD=len<=5?2:3;const p1=t[0]||"";const p2=t.slice(0,2);let best="";let bestD=maxD+1;let bestF=-1;const maxScan=2000;let scanned=0;for(const{w,f}of list){if(++scanned>maxScan)break;if(w[0]!==p1)continue;if(len>=4&&w.slice(0,2)!==p2)continue;const d=fbLevenshtein(t,w,maxD);if(d>maxD)continue;if(d<bestD||(d===bestD&&f>bestF)||(d===bestD&&f===bestF&&w.length<best.length)){best=w;bestD=d;bestF=f;if(bestD===0)break;}}
if(!best)return"";const ratio=bestD/Math.max(1,len);if(ratio>0.34)return"";return best;}
async function fbHasAnyMatchForTerm(rawTerm){const termLower=String(rawTerm||"").trim().toLowerCase();if(!termLower)return false;const pages=await fbGetPageDocsCached();for(const d of pages){const extraTags=Array.isArray(d.tags)?d.tags.join(" "):"";const extraAliases=Array.isArray(d.aliases)?d.aliases.join(" "):"";const hay=fbNormaliseForSearch(`${d.title} ${d.text} ${d.location} ${extraTags} ${extraAliases}`);if(fbTermMatchesHay(termLower,hay,d))return true;}
return false;}
const __fbHasAnyMatchCache=new Map();async function fbHasAnyMatchForTermCached(rawTerm){const k=String(rawTerm||"").trim().replace(/\s+/g," ").toLowerCase();if(!k)return false;if(__fbHasAnyMatchCache.has(k))return!!__fbHasAnyMatchCache.get(k);const v=await fbHasAnyMatchForTerm(rawTerm);__fbHasAnyMatchCache.set(k,!!v);return!!v;}
let __fbAddFuzzyScopeReady=false;async function fbSuggestPhraseForAdd(raw){const from=String(raw||"").trim().replace(/\s+/g," ");if(!from)return"";if(!fbIsSafeForFuzzyToken(from))return"";try{const core=await fbEnsureFuzzyCore();if(core&&typeof core.suggestPhrase==="function"){const pages=await fbGetPageDocsCached();const scopeKey="find:global";try{if(!__fbAddFuzzyScopeReady&&typeof core.ensureScope==="function"){await core.ensureScope(scopeKey,{pageDocs:pages,includeBody:true,minFreq:2,maxVocab:12000});__fbAddFuzzyScopeReady=true;}}catch(_){}
const sug=await core.suggestPhrase(scopeKey,from,{pageDocs:pages,includeBody:true,minFreq:2,maxVocab:12000}).catch(()=>null);const to=sug&&sug.suggested?String(sug.suggested||"").trim().replace(/\s+/g," "):"";if(to&&to.toLowerCase()!==from.toLowerCase())return to;}}catch(_){}
if(!from.includes(" ")){try{return(await fbSuggestToken(from))||"";}catch(_){return"";}}
return"";}
async function fbTryAutoCorrectOnNoResults(normNodes,uniqueTermsLower,termCountsMap,hasLogic,exprText,isCurrent){const zeroTerms=(uniqueTermsLower||[]).filter(t=>(termCountsMap.get(t)||0)<=0);if(!zeroTerms.length)return false;const termLowerToOrig=new Map();for(const t of normNodes||[]){if(t&&t.k==="TERM"){const orig=String(t.v||"").trim().replace(/\s+/g," ");if(orig)termLowerToOrig.set(orig.toLowerCase(),orig);}}
const swaps=[];const swapMapUndo={};const exprBefore=snapshot().expr;for(const z of zeroTerms){const orig=termLowerToOrig.get(z)||z;const from=String(orig||"").trim().replace(/\s+/g," ");if(!from)continue;let to="";try{to=await fbSuggestToken(from);}catch(_){to="";}
if(typeof isCurrent==="function"&&!isCurrent())return false;if(!to)continue;if(/^[A-Z]/.test(from))to=to.charAt(0).toUpperCase()+to.slice(1);if(!to||to===from)continue;swaps.push([from,to]);swapMapUndo[to]=from;}
if(!swaps.length)return false;if(typeof isCurrent==="function"&&!isCurrent())return false;swaps.forEach(([from,to])=>fbReplaceTokenEverywhere(from,to));state.tokens=readTokens();clearStatus();render();const norm2=normalizeNodesToTokens(state.expr);const expr2=tokensToExprText(norm2);const msg=swaps.map(([a,b])=>`<code>${escapeHtml(b)}</code> instead of <code>${escapeHtml(a)}</code>`).join(", ");fbShowFuzzyNote(`<div class="fb-fuzzy-msg">No results as typed. Using ${msg}.</div>
       <div class="fb-fuzzy-actions">
         <button type="button" class="fb-fuzzy-btn fb-fuzzy-btn--undo" data-fb-fuzzy-act="edit">Edit as typed</button>
       </div>`,{origExpr:exprBefore,tokenSwaps:swapMapUndo,forExprText:expr2});try{if(window.__findSearchV2&&typeof window.__findSearchV2.runLogicExpr==="function"){window.__findSearchV2.runLogicExpr(expr2);}else if(window.__findSearchV2&&typeof window.__findSearchV2.runQuery==="function"){window.__findSearchV2.runQuery(expr2);}}catch(_){}
return true;}
function ensureHeaderSearchInteractionTracker(){if(window.__fbHeaderSearchTrackerBoundV1)return;window.__fbHeaderSearchTrackerBoundV1=true;const mark=(ms)=>{const now=Date.now();const until=now+Math.max(360,Number(ms)||0);try{window.__mkHeaderSearchUserTouchTs=now;}catch(_){}
try{const prev=Number(window.__mkFindHeaderSearchGraceUntil||0);if(until>prev)window.__mkFindHeaderSearchGraceUntil=until;}catch(_){}};const isHeaderSearchTarget=(t)=>{try{if(!t||!t.closest)return false;return!!t.closest('.md-header .md-search, label[for="__search"], [for="__search"], input#__search, input.md-toggle[data-md-toggle="search"]');}catch(_){return false;}};document.addEventListener('pointerdown',(e)=>{if(isHeaderSearchTarget(e&&e.target))mark(1400);},true);document.addEventListener('focusin',(e)=>{const t=e&&e.target;try{if(t&&t.matches&&t.matches('input[data-md-component="search-query"]')&&t.closest('.md-header .md-search'))mark(1400);}catch(_){}},true);document.addEventListener('keydown',(e)=>{const t=e&&e.target;try{if(t&&t.matches&&t.matches('input[data-md-component="search-query"]')&&t.closest('.md-header .md-search')){mark((t.value||'').trim()?320:1200);}}catch(_){}},true);}
function isHeaderSearchBusy(){try{const activeEl=document.activeElement;if(activeEl&&activeEl.matches&&activeEl.matches('input[data-md-component="search-query"]')&&activeEl.closest('.md-header .md-search'))return true;if(activeEl&&activeEl.closest&&activeEl.closest('.md-header .md-search'))return true;const activeShell=document.querySelector('.md-header .md-search.md-search--active');if(activeShell)return true;const toggle=document.querySelector('input.md-toggle[data-md-toggle="search"]')||document.querySelector('input#__search');if(toggle&&toggle.checked)return true;return hasRecentHeaderSearchInteraction(1400);}catch(_){return hasRecentHeaderSearchInteraction(1400);}}
function closeMaterialSearchOverlayFast(){if(isHeaderSearchBusy())return;const toggle=document.querySelector('input.md-toggle[data-md-toggle="search"]')||document.querySelector('input#__search');if(toggle)toggle.checked=false;const input=document.querySelector('input[data-md-component="search-query"]');if(input){input.value="";input.dispatchEvent(new Event("input",{bubbles:true}));try{input.blur();}catch(_){}}
const list=document.querySelector(".md-search-result__list");if(list)list.style.removeProperty("display");}
function fbForceClearTopSearchBarNow(){try{const toggles=Array.from(document.querySelectorAll('input.md-toggle[data-md-toggle="search"], input#__search'));toggles.forEach((toggle)=>{try{toggle.checked=false;}catch(_){}});const headerInputs=Array.from(document.querySelectorAll('input[data-md-component="search-query"]'));headerInputs.forEach((input)=>{try{input.value="";input.dispatchEvent(new Event("input",{bubbles:true}));input.dispatchEvent(new Event("change",{bubbles:true}));input.removeAttribute&&input.removeAttribute("value");}catch(_){}
try{input.blur&&input.blur();}catch(_){}});const activeShells=Array.from(document.querySelectorAll('.md-header .md-search.md-search--active, .md-search.md-search--active'));activeShells.forEach((el)=>{try{el.classList.remove('md-search--active');}catch(_){}});const overlay=document.querySelector('.md-search__overlay');if(overlay&&overlay.style){overlay.style.display="";overlay.style.pointerEvents="";}
const list=document.querySelector('.md-search-result__list');if(list)list.style.removeProperty('display');}catch(_){}}
function fbForceClearTopSearchBarSoon(){const delays=[0,40,140,320,700];delays.forEach((ms)=>{window.setTimeout(()=>{try{fbForceClearTopSearchBarNow();}catch(_){}},ms);});}
function fbGetHeaderSearchInputFromEvent(ev){try{const target=ev&&ev.target;if(fbIsMaterialHeaderSearchInput(target))return target;const active=document.activeElement;if(fbIsMaterialHeaderSearchInput(active))return active;if(target&&target.closest){const shell=target.closest('.md-search, .md-header');if(shell){const input=shell.querySelector('input[data-md-component="search-query"], input.md-search__input, input[type="search"], input[name="q"], input[name="query"]');if(fbIsMaterialHeaderSearchInput(input))return input;}}}catch(_){}
return null;}
function fbMarkSameFindTopSearchHandled(ms){const until=Date.now()+Math.max(1600,Number(ms)||0);try{window.__findHeaderSamePageHandledUntilV8=until;}catch(_){}
try{window.__findHeaderSamePageHandledUntilV7=until;}catch(_){}
try{window.__findHeaderEnterSuppressUntilV8=until;}catch(_){}
try{window.__findHeaderEnterSuppressUntilV6=until;}catch(_){}
try{window.__mkFindSamePageTopSearchUntil=until;}catch(_){}
try{window.__rkCancelPreloadForFindSamePage&&window.__rkCancelPreloadForFindSamePage('find-builder');}catch(_){}}
function fbClearHeaderSearchInputForSamePage(input){try{const inputs=input?[input]:Array.from(document.querySelectorAll('input[data-md-component="search-query"], .md-search input[type="search"], .md-header input[type="search"]'));inputs.forEach((el)=>{try{el.value="";}catch(_){}
try{el.dispatchEvent(new Event("input",{bubbles:true}));}catch(_){}
try{el.dispatchEvent(new Event("change",{bubbles:true}));}catch(_){}
try{el.blur&&el.blur();}catch(_){}});}catch(_){}
try{fbForceClearTopSearchBarSoon();}catch(_){}}
function fbSamePageTopSearch(raw,opts){const q=String(raw||"").trim().replace(/\s+/g," ");if(!q||!isOnFindPage())return false;fbMarkSameFindTopSearchHandled(3200);try{sessionStorage.removeItem("find_pending_token_v2");}catch(_){}
try{sessionStorage.removeItem("find_pending_token_v1");}catch(_){}
try{sessionStorage.removeItem("__find_autoflow_ran_v2__");}catch(_){}
try{sessionStorage.removeItem("__se_find_autofill_nonce_v2__");}catch(_){}
fbAutofillFromTopSearch(q,Object.assign({samePage:true,noFx:true},opts||{}));return true;}
function fbInstallSameFindTopSearchBridge(){try{window.__mkFindAutofillFromTopSearch=fbSamePageTopSearch;}catch(_){}
if(window.__fbSameFindTopSearchEnterGuardV1)return;window.__fbSameFindTopSearchEnterGuardV1=true;const onEnterCapture=(ev)=>{try{if(!isOnFindPage())return;if(!ev||ev.key!=="Enter")return;if(ev.isComposing||ev.keyCode===229)return;const input=fbGetHeaderSearchInputFromEvent(ev);if(!input)return;const q=String(input.value||"").trim().replace(/\s+/g," ");if(!q)return;fbStopTopSearchEnterEvent(ev);fbMarkSameFindTopSearchHandled(3200);fbClearHeaderSearchInputForSamePage(input);fbSamePageTopSearch(q,{source:"find-builder-enter"});}catch(_){}};const onLateEnterCapture=(ev)=>{try{if(!ev||ev.key!=="Enter")return;if(Date.now()>=Number(window.__findHeaderEnterSuppressUntilV8||0))return;if(!fbGetHeaderSearchInputFromEvent(ev))return;fbStopTopSearchEnterEvent(ev);}catch(_){}};window.addEventListener("keydown",onEnterCapture,true);document.addEventListener("keydown",onEnterCapture,true);window.addEventListener("keypress",onLateEnterCapture,true);window.addEventListener("keyup",onLateEnterCapture,true);const onSubmitCapture=(ev)=>{try{if(!isOnFindPage())return;const form=ev&&ev.target;if(!form||!form.querySelector)return;if(form.closest&&form.closest('#find-builder, #search-form, .fb-tokensearch-wrap'))return;const input=form.querySelector('input[data-md-component="search-query"], input.md-search__input, input[type="search"], input[name="q"], input[name="query"]')||document.activeElement;if(!fbIsMaterialHeaderSearchInput(input))return;const q=String(input.value||"").trim().replace(/\s+/g," ");if(!q)return;fbStopTopSearchEnterEvent(ev);fbMarkSameFindTopSearchHandled(3200);fbClearHeaderSearchInputForSamePage(input);if(!fbConsumeGuestAction("search",{query:q,source:"find-builder-header-submit",dedupeMs:2500}))return;fbSamePageTopSearch(q,{source:"find-builder-submit"});}catch(_){}};window.addEventListener("submit",onSubmitCapture,true);document.addEventListener("submit",onSubmitCapture,true);}
function ensureFindSpeechBubbleFix(){if(!document.getElementById("mk-find-bubble-fix-style-v2")){const st=document.createElement("style");st.id="mk-find-bubble-fix-style-v2";st.textContent=`
        body.mk-find-page .mk-find-output-wrap,
        body.mk-find-page .mk-find-output-wrap.md-search__output,
        body.mk-find-page .mk-find-output-wrap.md-search__scrollwrap,
        body.mk-find-page .mk-find-output-wrap .md-search__output{
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          filter: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        body.mk-find-page .mk-find-output-wrap::before,
        body.mk-find-page .mk-find-output-wrap::after,
        body.mk-find-page .mk-find-output-wrap.md-search__output::before,
        body.mk-find-page .mk-find-output-wrap.md-search__output::after{
          display:none !important;
          content:none !important;
        }
      `;document.head.appendChild(st);}
const form=document.getElementById("search-form");const fb=document.getElementById("find-builder");const seeds=[form,fb].filter(Boolean);const mark=(el)=>{if(!el||!el.classList)return;try{if(el.querySelector&&el.querySelector('input[data-md-component="search-query"]'))return;}catch(_){}
el.classList.add("mk-find-output-wrap");if(el.classList.contains("md-search__output"))el.classList.remove("md-search__output");try{el.style.background="transparent";el.style.boxShadow="none";el.style.border="0";el.style.padding="0";el.style.margin="0";}catch(_){}};for(const s of seeds){let p=s;let hop=0;while(p&&p!==document.body&&hop++<14){if(p.classList&&(p.classList.contains("md-search__output")||p.classList.contains("md-search__scrollwrap"))){mark(p);break;}
p=p.parentElement;}}
try{const outs=Array.from(document.querySelectorAll(".md-search__output, .md-search__scrollwrap"));for(const out of outs){if(!out||!out.contains)continue;if((form&&out.contains(form))||(fb&&out.contains(fb)))mark(out);}}catch(_){}}
function ensureFindWideLayoutStyles(){}
function ensureFindMobileUiStyles(){}
function ensureFindThemeForegroundStyles(){let st=document.getElementById("mk-find-theme-foreground-v1");if(!st){st=document.createElement("style");st.id="mk-find-theme-foreground-v1";(document.head||document.documentElement).appendChild(st);}
st.textContent=`
body.mk-find-page.trending-page{
  --mk-finder-fg-strong: rgba(15,23,42,.95);
  --mk-finder-fg: rgba(15,23,42,.84);
  --mk-finder-fg-muted: rgba(15,23,42,.63);
  --mk-finder-fg-disabled: rgba(15,23,42,.46);
}

body.mk-find-page.trending-page #find-builder,
body.mk-find-page.trending-page #search-form.fb-find-form{
  color: var(--mk-finder-fg) !important;
}

body.mk-find-page.trending-page #find-builder :is(.fb-panel__title,.fb-tokens__title),
body.mk-find-page.trending-page #find-builder :is(.fb-btn,.fb-tokenbtn,.fb-chip,.fb-ghost__chip),
body.mk-find-page.trending-page #search-form.fb-find-form .fb-addtoken-actions .fb-cta-btn,
body.mk-find-page.trending-page #search-form.fb-find-form .fb-tokensearch-item__main,
body.mk-find-page.trending-page #search-form.fb-find-form .fb-tokensearch-footer__clear{
  color: var(--mk-finder-fg-strong) !important;
}

body.mk-find-page.trending-page #find-builder :is(.fb-board__placeholder,.fb-tokens__empty,.fb-ghost__hint,.fb-status),
body.mk-find-page.trending-page #search-form.fb-find-form :is(.fb-tokensearch-suffix,.fb-tokensearch-item__meta,.fb-tokensearch-footer__hint){
  color: var(--mk-finder-fg-muted) !important;
}

body.mk-find-page.trending-page #search-form.fb-find-form #search-input{
  color: var(--mk-finder-fg-strong) !important;
  caret-color: var(--mk-finder-accent, var(--md-accent-fg-color)) !important;
  -webkit-text-fill-color: var(--mk-finder-fg-strong) !important;
}
body.mk-find-page.trending-page #search-form.fb-find-form #search-input::placeholder{
  color: var(--mk-finder-fg-muted) !important;
  -webkit-text-fill-color: var(--mk-finder-fg-muted) !important;
  opacity: 1 !important;
}

body.mk-find-page.trending-page #find-builder :is(.fb-btn__txt,.fb-clear__txt,.fb-chip__text,.fb-tokenbtn__text),
body.mk-find-page.trending-page #search-form.fb-find-form .fb-addtoken-actions :is(.fb-cta__txt,.fb-cta__ico){
  color: inherit !important;
}

body.mk-find-page.trending-page #find-builder :is(.fb-btn__ico,.fb-clear__x),
body.mk-find-page.trending-page #find-builder :is(.fb-btn__ico,.fb-clear__x) svg{
  color: inherit !important;
}
body.mk-find-page.trending-page #find-builder :is(.fb-btn__ico,.fb-clear__x) svg [stroke]:not([stroke="none"]){
  stroke: currentColor !important;
}
body.mk-find-page.trending-page #find-builder :is(.fb-btn__ico,.fb-clear__x) svg [fill]:not([fill="none"]){
  fill: currentColor !important;
}
body.mk-find-page.trending-page #find-builder :is(#fb-undo,#fb-redo,#fb-run) .fb-btn__ico svg,
body.mk-find-page.trending-page #find-builder :is(#fb-undo,#fb-redo,#fb-run) .fb-btn__ico svg *{
  fill: currentColor !important;
  stroke: none !important;
}
body.mk-find-page.trending-page #find-builder :is(#fb-clear,#fb-clear-tokens) :is(.fb-btn__ico,.fb-clear__x) svg,
body.mk-find-page.trending-page #find-builder :is(#fb-clear,#fb-clear-tokens) :is(.fb-btn__ico,.fb-clear__x) svg *{
  fill: none !important;
  stroke: currentColor !important;
}

body.mk-find-page.trending-page #find-builder :is(.fb-chip__x,.fb-tokenbtn__x,.fb-caret),
body.mk-find-page.trending-page #search-form.fb-find-form .fb-tokensearch-item__del{
  color: var(--mk-finder-fg-muted) !important;
}

body.mk-find-page.trending-page #find-builder :is(.fb-btn,.fb-tokens__clear):disabled,
body.mk-find-page.trending-page #find-builder :is(.fb-btn,.fb-tokens__clear).is-disabled,
body.mk-find-page.trending-page #find-builder :is(.fb-btn,.fb-tokens__clear):disabled :is(.fb-btn__ico,.fb-clear__x),
body.mk-find-page.trending-page #find-builder :is(.fb-btn,.fb-tokens__clear).is-disabled :is(.fb-btn__ico,.fb-clear__x){
  color: var(--mk-finder-fg-disabled) !important;
}
`;}
let __fbThemeForegroundObserver=null;let __fbThemeForegroundFrame=0;let __fbThemeForegroundTimer=0;function fbFinderVisibleSurface(panel){let node=panel;let color=null;while(node){let layer=null;try{layer=fbParseComputedColor(getComputedStyle(node).backgroundColor);}catch(_){}
if(layer&&layer.a>0)color=color?fbCompositeColor(color,layer):layer;if(color&&color.a>=.98)break;node=node.parentElement;}
if(!color||color.a<.98){const scheme=String(document.documentElement.getAttribute("data-md-color-scheme")||"");const fallback=scheme==="slate"?{r:15,g:23,b:42,a:1}:{r:248,g:250,b:252,a:1};color=color?fbCompositeColor(color,fallback):fallback;}
return color;}
function fbContrastRatio(a,b){const l1=fbRelativeLuminance(a);const l2=fbRelativeLuminance(b);return(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);}
function fbSyncThemeForeground(){const body=document.body;const panel=document.querySelector("#find-builder .fb-panel");if(!body||!panel)return;const surface=fbFinderVisibleSurface(panel);const light={r:248,g:250,b:252,a:1};const dark={r:15,g:23,b:42,a:1};const useLight=fbContrastRatio(light,surface)>=fbContrastRatio(dark,surface);const palette=useLight?{strong:"rgba(248,250,252,.96)",normal:"rgba(248,250,252,.86)",muted:"rgba(248,250,252,.68)",disabled:"rgba(248,250,252,.48)",}:{strong:"rgba(15,23,42,.95)",normal:"rgba(15,23,42,.84)",muted:"rgba(15,23,42,.63)",disabled:"rgba(15,23,42,.46)",};body.style.setProperty("--mk-finder-fg-strong",palette.strong);body.style.setProperty("--mk-finder-fg",palette.normal);body.style.setProperty("--mk-finder-fg-muted",palette.muted);body.style.setProperty("--mk-finder-fg-disabled",palette.disabled);body.style.setProperty("--mk-finder-text",palette.normal);}
function fbScheduleThemeForegroundSync(){if(__fbThemeForegroundFrame)cancelAnimationFrame(__fbThemeForegroundFrame);if(__fbThemeForegroundTimer)clearTimeout(__fbThemeForegroundTimer);const sync=()=>{if(__fbThemeForegroundFrame)cancelAnimationFrame(__fbThemeForegroundFrame);if(__fbThemeForegroundTimer)clearTimeout(__fbThemeForegroundTimer);__fbThemeForegroundFrame=0;__fbThemeForegroundTimer=0;fbSyncThemeForeground();};__fbThemeForegroundFrame=requestAnimationFrame(sync);__fbThemeForegroundTimer=window.setTimeout(sync,60);}
function fbInstallThemeForegroundObserver(){if(__fbThemeForegroundObserver||typeof MutationObserver!=="function")return;__fbThemeForegroundObserver=new MutationObserver(fbScheduleThemeForegroundSync);const options={attributes:true,attributeFilter:["data-md-color-scheme","data-mk-color-scheme","data-mk-interface-theme","data-mk-image-interface-theme",],};try{__fbThemeForegroundObserver.observe(document.documentElement,options);}catch(_){}
try{document.body&&__fbThemeForegroundObserver.observe(document.body,options);}catch(_){}}
function focusPanelSoon(){window.setTimeout(()=>{const slot=document.querySelector("#find-builder .fb-slot.is-cursor");if(slot&&slot.focus){try{slot.focus();}catch(_){}
return;}
const board=document.querySelector("#find-builder .fb-board__inner");if(board&&board.focus){try{board.focus();}catch(_){}}},0);}
function fbEnsureFlyStyles(){if(document.getElementById("fb-fly-style-v1"))return;const st=document.createElement("style");st.id="fb-fly-style-v1";st.textContent=`
    .fb-fly-layer{
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2147483000;
    }
    .fb-fly-ghost{
      position: fixed;
      left: 0; top: 0;
      transform: translate(-50%, -50%);
      will-change: transform, opacity;
      pointer-events: none;
      user-select: none;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.22);
      background: rgba(120, 100, 220, .22);
      color: inherit;
      box-shadow: 0 18px 40px rgba(0,0,0,.28);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      font-weight: 750;
      font-size: 14px;
      line-height: 1;
      white-space: nowrap;
    }
    .fb-fly-ghost.is-hidden{ opacity: 0; }
    .fb-fly-pulse{
      animation: fbFlyPulse .38s cubic-bezier(.2,.9,.2,1) 1;
    }
    .fb-evaporate-ghost{
      will-change: transform, opacity;
      contain: layout paint style;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transform: translate3d(-50%, -50%, 0);
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      box-shadow: 0 10px 24px rgba(0,0,0,.16);
      filter: none;
    }
    @keyframes fbFlyPulse{
      0%{ transform: scale(1); }
      55%{ transform: scale(1.08); }
      100%{ transform: scale(1); }
    }
  `;document.head.appendChild(st);}
function fbGetFlyLayer(){fbEnsureFlyStyles();let layer=document.querySelector(".fb-fly-layer");if(layer)return layer;layer=document.createElement("div");layer.className="fb-fly-layer";document.body.appendChild(layer);return layer;}
function fbCreateFlyGhost(text,styleSourceEl){const layer=fbGetFlyLayer();const ghost=document.createElement("div");ghost.className="fb-fly-ghost";ghost.textContent=String(text||"").trim();const srcEl=styleSourceEl||fbPickGhostStyleSource();if(srcEl&&window.getComputedStyle){try{const cs=getComputedStyle(srcEl);ghost.style.fontFamily=cs.fontFamily;ghost.style.fontSize=cs.fontSize;ghost.style.fontWeight=cs.fontWeight;ghost.style.letterSpacing=cs.letterSpacing;ghost.style.padding=cs.padding;ghost.style.borderRadius=cs.borderRadius;ghost.style.backgroundColor=cs.backgroundColor;ghost.style.backgroundImage=cs.backgroundImage;ghost.style.backgroundRepeat=cs.backgroundRepeat;ghost.style.backgroundPosition=cs.backgroundPosition;ghost.style.backgroundSize=cs.backgroundSize;ghost.style.color=cs.color;ghost.style.borderColor=cs.borderColor;ghost.style.borderWidth=cs.borderWidth;ghost.style.borderStyle=cs.borderStyle;ghost.style.boxShadow=cs.boxShadow;ghost.style.backdropFilter=cs.backdropFilter;ghost.style.webkitBackdropFilter=cs.webkitBackdropFilter;}catch(_){}}
layer.appendChild(ghost);return ghost;}
function fbAnimateGhost(ghost,fromPt,toPt,opts){const duration=Math.max(180,Math.min(900,Number(opts&&opts.duration)||420));const delay=Math.max(0,Number(opts&&opts.delay)||0);if(!ghost)return Promise.resolve();ghost.style.left=fromPt.x+"px";ghost.style.top=fromPt.y+"px";const dx=toPt.x-fromPt.x;const dy=toPt.y-fromPt.y;const control={x:fromPt.x+dx*0.45,y:fromPt.y+dy*0.25-60,};const mid1=fbBezierQuad(fromPt,control,toPt,0.55);const mid2=fbBezierQuad(fromPt,control,toPt,0.82);const base="translate(-50%, -50%)";const kf=[{transform:`${base} translate(0px, 0px) scale(1)`,opacity:1,offset:0},{transform:`${base} translate(${dx * 0.06}px, -18px) scale(1.10)`,opacity:1,offset:0.14},{transform:`${base} translate(${mid1.x - fromPt.x}px, ${mid1.y - fromPt.y}px) scale(1.04)`,opacity:1,offset:0.58},{transform:`${base} translate(${mid2.x - fromPt.x}px, ${mid2.y - fromPt.y}px) scale(1.01)`,opacity:1,offset:0.82},{transform:`${base} translate(${dx}px, ${dy}px) scale(1)`,opacity:1,offset:1},];if(ghost.animate){const anim=ghost.animate(kf,{duration,delay,easing:"cubic-bezier(.22, 1, .36, 1)",fill:"forwards",});return anim.finished.catch(()=>{}).then(()=>{});}
ghost.style.left=toPt.x+"px";ghost.style.top=toPt.y+"px";return Promise.resolve();}
function fbPlayBoardFlip(firstMap){if(!firstMap||!firstMap.size)return;if(fbPrefersReducedMotion())return;requestAnimationFrame(()=>{try{const els=Array.from(document.querySelectorAll("#find-builder .fb-chip[data-fb-node]"));for(const el of els){const k=el.getAttribute("data-fb-node")||"";const first=firstMap.get(k);if(!first)continue;const last=el.getBoundingClientRect();const dx=first.left-last.left;const dy=first.top-last.top;if(Math.abs(dx)<0.5&&Math.abs(dy)<0.5)continue;el.style.willChange="transform";el.style.transition="transform 0s";el.style.transform=`translate(${dx}px, ${dy}px)`;el.getBoundingClientRect();el.style.transition="transform 420ms cubic-bezier(.22, 1, .36, 1)";el.style.transform="translate(0px, 0px)";el.addEventListener("transitionend",()=>{el.style.transition="";el.style.transform="";el.style.willChange="";},{once:true});}}catch(_){}});}
function fbPulse(el){if(!el)return;try{el.classList.remove("fb-fly-pulse");void el.offsetWidth;el.classList.add("fb-fly-pulse");window.setTimeout(()=>el.classList.remove("fb-fly-pulse"),420);}catch(_){}}
function fbRevealAnimTokenNow(tok){const key=fbAnimTokenKey(tok);if(!key)return false;let changed=false;try{if(state.animHideTokens&&state.animHideTokens.delete(key))changed=true;}catch(_){}
try{const btn=fbFindTokenButtonByText(key);const wrap=btn&&btn.closest?btn.closest(".fb-tokenwrap"):null;if(wrap){wrap.style.opacity="";wrap.style.visibility="";wrap.style.transform="";changed=true;}}catch(_){}
return changed;}
function fbRevealAnimNodeNow(nodeId){const id=String(nodeId||"").trim();if(!id)return false;let changed=false;try{if(state.animHideNodeIds&&state.animHideNodeIds.delete(id))changed=true;}catch(_){}
try{const chip=fbFindBoardChipByNodeId(id);if(chip){chip.style.opacity="";chip.style.visibility="";chip.style.transform="";changed=true;}}catch(_){}
return changed;}
function fbScheduleAnimRevealFallback(tokens,nodeIds,delayMs){const tks=(Array.isArray(tokens)?tokens:[]).map(fbAnimTokenKey).filter(Boolean);const ids=(Array.isArray(nodeIds)?nodeIds:[]).map((x)=>String(x||"").trim()).filter(Boolean);if(!tks.length&&!ids.length)return;window.setTimeout(()=>{let changed=false;for(const t of tks){if(fbRevealAnimTokenNow(t))changed=true;}
for(const id of ids){if(fbRevealAnimNodeNow(id))changed=true;}
if(changed){try{render();}catch(_){}}},Math.max(520,Number(delayMs)||1400));}
function fbRunAddTokenAnimations(plan){if(!plan)return;const startPt=plan.startPt||(plan.startRect?fbRectCenter(plan.startRect):null);const newTokens=Array.isArray(plan.newTokens)?plan.newTokens.filter(Boolean):[];const maxPool=plan.mode==="insert"?1:Math.min(3,newTokens.length);const poolTokens=startPt?newTokens.slice(0,maxPool):[];const insertIdsForFallback=plan.mode==="insert"?(Array.isArray(plan.insertNodeIds)?plan.insertNodeIds.slice(0,2):[]):[];fbScheduleAnimRevealFallback(poolTokens,insertIdsForFallback,1450);if(fbPrefersReducedMotion()){fbScheduleAnimRevealFallback(poolTokens,insertIdsForFallback,10);fbPlayBoardFlip(plan.boardFirst);return;}
try{fbPlayBoardFlip(plan.boardFirst);}catch(_){}
if(startPt&&poolTokens.length){poolTokens.forEach((tok,i)=>{window.setTimeout(async()=>{const destBtn=fbFindTokenButtonByText(tok);if(!destBtn){fbRevealAnimTokenNow(tok);return;}
try{const w=destBtn.closest&&destBtn.closest(".fb-tokenwrap");if(w){w.style.opacity="0";w.style.visibility="hidden";}}catch(_){}
const destPt=fbRectCenter(destBtn.getBoundingClientRect());const ghost=fbCreateFlyGhost(tok,fbPickGhostStyleSource());await fbAnimateGhost(ghost,startPt,destPt,{duration:420,delay:0});try{ghost.remove();}catch(_){}
try{const w=destBtn.closest&&destBtn.closest(".fb-tokenwrap");if(w){w.style.opacity="";w.style.visibility="";w.style.transform="";}}catch(_){}
try{if(state.animHideTokens)state.animHideTokens.delete(String(tok||"").trim().replace(/\s+/g," "));}catch(_){}
fbPulse(destBtn);},i*70);});}
if(plan.mode==="insert"){const toks=Array.isArray(plan.insertTokens)?plan.insertTokens.filter(Boolean):[];const ids=Array.isArray(plan.insertNodeIds)?plan.insertNodeIds:[];const max=Math.min(2,toks.length,ids.length);window.setTimeout(()=>{for(let i=0;i<max;i++){const tok=toks[i];const nodeId=ids[i];window.setTimeout(async()=>{const poolBtn=fbFindTokenButtonByText(tok)||null;const chipEl=fbFindBoardChipByNodeId(nodeId)||null;if(!poolBtn||!chipEl){fbRevealAnimNodeNow(nodeId);return;}
const fromPt=fbRectCenter(poolBtn.getBoundingClientRect());const toPt=fbRectCenter(chipEl.getBoundingClientRect());try{chipEl.style.opacity="0";chipEl.style.visibility="hidden";}catch(_){}
const ghost2=fbCreateFlyGhost(tok,poolBtn);await fbAnimateGhost(ghost2,fromPt,toPt,{duration:420,delay:0});try{ghost2.remove();}catch(_){}
try{chipEl.style.opacity="";chipEl.style.visibility="";}catch(_){}
try{if(state.animHideNodeIds)state.animHideNodeIds.delete(String(nodeId||""));}catch(_){}
fbPulse(chipEl);},i*60);}},440);}}
function fbRunPoolTokenInsertAnimation(opts){if(!opts)return;fbScheduleAnimRevealFallback([],opts.nodeId?[opts.nodeId]:[],1100);if(fbPrefersReducedMotion()){fbRevealAnimNodeNow(opts.nodeId);fbPlayBoardFlip(opts.boardFirst);return;}
try{fbPlayBoardFlip(opts.boardFirst);}catch(_){}
if(!opts.fromRect||!opts.nodeId||!opts.token){fbRevealAnimNodeNow(opts&&opts.nodeId);return;}
window.setTimeout(async()=>{const chipEl=fbFindBoardChipByNodeId(opts.nodeId);if(!chipEl){fbRevealAnimNodeNow(opts.nodeId);return;}
const fromPt=fbRectCenter(opts.fromRect);const toPt=fbRectCenter(chipEl.getBoundingClientRect());try{chipEl.style.opacity="0";chipEl.style.visibility="hidden";}catch(_){}
const ghost=fbCreateFlyGhost(opts.token,chipEl);await fbAnimateGhost(ghost,fromPt,toPt,{duration:420});try{ghost.remove();}catch(_){}
try{chipEl.style.opacity="";chipEl.style.visibility="";}catch(_){}
try{if(state.animHideNodeIds)state.animHideNodeIds.delete(String(opts.nodeId||""));}catch(_){}
fbPulse(chipEl);},40);}
let __fbEvapBurstAt=0;let __fbEvapBurstCount=0;function fbCreateEvaporateGhost(text,styleSourceEl,opts){const layer=fbGetFlyLayer();const ghost=document.createElement("div");ghost.className="fb-fly-ghost fb-evaporate-ghost";ghost.textContent=String(text||"").trim();const srcEl=styleSourceEl||fbPickGhostStyleSource();if(srcEl&&window.getComputedStyle){try{const cs=getComputedStyle(srcEl);ghost.style.fontFamily=cs.fontFamily;ghost.style.fontSize=cs.fontSize;ghost.style.fontWeight=cs.fontWeight;ghost.style.letterSpacing=cs.letterSpacing;ghost.style.lineHeight=cs.lineHeight;ghost.style.padding=cs.padding;ghost.style.borderRadius=cs.borderRadius;ghost.style.backgroundColor=cs.backgroundColor;ghost.style.backgroundImage=cs.backgroundImage;ghost.style.color=cs.color;ghost.style.borderColor=cs.borderColor;ghost.style.borderWidth=cs.borderWidth;ghost.style.borderStyle=cs.borderStyle;ghost.style.boxShadow="0 10px 24px rgba(0,0,0,.16)";}catch(_){}}
try{ghost.style.backdropFilter="none";ghost.style.webkitBackdropFilter="none";ghost.style.filter="none";ghost.style.pointerEvents="none";ghost.style.userSelect="none";ghost.style.contain="layout paint style";}catch(_){}
layer.appendChild(ghost);return ghost;}
function fbDissolveFromElement(el,opts){if(!el)return;if(fbPrefersReducedMotion())return;const text=String((opts&&opts.text)||(el.textContent||"")).trim();if(!text)return;let r=null;try{r=el.getBoundingClientRect();}catch(_){}
if(!r||!r.width||!r.height)return;const now=(window.performance&&performance.now)?performance.now():Date.now();if(!__fbEvapBurstAt||now-__fbEvapBurstAt>90){__fbEvapBurstAt=now;__fbEvapBurstCount=0;}
const burstIndex=__fbEvapBurstCount++;const explicitBulk=!!(opts&&opts.bulk);const bulkMode=explicitBulk||burstIndex>32;const duration=Math.max(320,Math.min(760,Number(opts&&opts.duration)||(bulkMode?430:580)));const c=fbRectCenter(r);const ghost=fbCreateEvaporateGhost(text,el,opts);ghost.style.left=c.x+"px";ghost.style.top=c.y+"px";const dx=(Math.random()-0.5)*(bulkMode?28:54);const dy=-18-Math.random()*(bulkMode?28:46);const scale=bulkMode?0.92:0.86;const base="translate3d(-50%, -50%, 0)";const kf=bulkMode?[{offset:0,transform:`${base} translate3d(0px, 0px, 0) scale(1)`,opacity:1},{offset:.42,transform:`${base} translate3d(${(dx * .35).toFixed(2)}px, ${(dy * .42).toFixed(2)}px, 0) scale(.98)`,opacity:.55},{offset:1,transform:`${base} translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale})`,opacity:0}]:[{offset:0,transform:`${base} translate3d(0px, 0px, 0) scale(1)`,opacity:1,filter:"blur(0px)"},{offset:.36,transform:`${base} translate3d(${(dx * .30).toFixed(2)}px, ${(dy * .38).toFixed(2)}px, 0) scale(1.01)`,opacity:.68,filter:"blur(.8px)"},{offset:.72,transform:`${base} translate3d(${(dx * .72).toFixed(2)}px, ${(dy * .76).toFixed(2)}px, 0) scale(.94)`,opacity:.22,filter:"blur(3px)"},{offset:1,transform:`${base} translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale})`,opacity:0,filter:"blur(6px)"}];if(ghost.animate){const anim=ghost.animate(kf,{duration,easing:"cubic-bezier(.16, 1, .22, 1)",fill:"forwards",});anim.finished.catch(()=>{}).then(()=>{try{ghost.remove();}catch(_){}});}else{try{ghost.style.transition=`transform ${duration}ms cubic-bezier(.16,1,.22,1), opacity ${duration}ms ease`;requestAnimationFrame(()=>{ghost.style.transform=`${base} translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale})`;ghost.style.opacity="0";});}catch(_){}
window.setTimeout(()=>{try{ghost.remove();}catch(_){}},duration+80);}}
function fbDissolveMany(els,opts){const arr=Array.isArray(els)?els:[];if(!arr.length)return;const bulk=arr.length>24;for(const el of arr)fbDissolveFromElement(el,Object.assign({},opts||{},{bulk:bulk||!!(opts&&opts.bulk)}));}
function fbSuppressEmptyHints(opts){const o=opts||{};const delayMs=Math.max(0,Number(o.delayMs)||0);const until=Date.now()+delayMs;if(o.pool)state.suppressPoolHintUntil=Math.max(state.suppressPoolHintUntil||0,until);if(o.board)state.suppressBoardHintUntil=Math.max(state.suppressBoardHintUntil||0,until);fbQueueHintReveal();}
function fbQueueHintReveal(){try{if(state.__hintRevealTimer)window.clearTimeout(state.__hintRevealTimer);}catch(_){}
const now=Date.now();const waits=[];if(now<(state.suppressPoolHintUntil||0))waits.push(state.suppressPoolHintUntil-now);if(now<(state.suppressBoardHintUntil||0))waits.push(state.suppressBoardHintUntil-now);if(!waits.length)return;const ms=Math.max(0,Math.min(...waits))+5;state.__hintRevealTimer=window.setTimeout(fbRevealEmptyHints,ms);}
function fbRevealEmptyHints(){const fb=document.getElementById("find-builder");if(!fb)return;const now=Date.now();function reveal(nodes){try{Array.from(nodes||[]).forEach((el)=>{try{el.classList.remove("fb-hint--pending");el.classList.remove("fb-hint--reveal");void el.offsetHeight;el.classList.add("fb-hint--reveal");window.setTimeout(()=>{try{el.classList.remove("fb-hint--reveal");}catch(_){}},620);}catch(_){}});}catch(_){}}
if(now>=(state.suppressPoolHintUntil||0)){const poolHints=fb.querySelectorAll('[data-fb-empty-hint="pool"].fb-hint--pending');reveal(poolHints);state.suppressPoolHintUntil=0;}
if(now>=(state.suppressBoardHintUntil||0)){const boardHints=fb.querySelectorAll('[data-fb-empty-hint="board"].fb-hint--pending');reveal(boardHints);state.suppressBoardHintUntil=0;}
fbQueueHintReveal();}
let __fbRunFxObs=null;let __fbRunFxTimers=[];let __fbRunFxBoardAnim=null;let __fbRunFxResAnims=[];function fbStopRunSearchFxNow(){try{if(__fbRunFxObs)__fbRunFxObs.disconnect();}catch(_){}
__fbRunFxObs=null;try{(__fbRunFxTimers||[]).forEach((t)=>clearTimeout(t));}catch(_){}
__fbRunFxTimers=[];try{if(__fbRunFxBoardAnim)__fbRunFxBoardAnim.cancel();}catch(_){}
__fbRunFxBoardAnim=null;try{(__fbRunFxResAnims||[]).forEach((a)=>{try{a.cancel();}catch(_){}});}catch(_){}
__fbRunFxResAnims=[];try{const fb=document.getElementById("find-builder");const board=fb?fb.querySelector(".fb-board"):null;const res=document.getElementById("search-results");if(fb)fb.classList.remove("fb-dream-active");if(res){res.classList.remove("fb-preblur");Array.from(res.querySelectorAll(".csr-cols, .csr-list, .csr-foot")).forEach((el)=>{el.style.filter="";el.style.opacity="";el.style.transform="";});}
if(board)board.style.filter="";Array.from(document.querySelectorAll("#find-builder .fb-chip[data-fb-node]")).forEach((el)=>{el.style.transition="";el.style.transform="";el.style.willChange="";el.classList.remove("fb-fly-pulse");});const flyLayer=document.querySelector(".fb-fly-layer");if(flyLayer)flyLayer.remove();}catch(_){}}
window.addEventListener("mk:site-motion-change",()=>{try{if(fbPrefersReducedMotion()){fbStopRunSearchFxNow();let needsRender=false;try{if(state&&state.animHideTokens&&state.animHideTokens.size){state.animHideTokens.clear();needsRender=true;}
if(state&&state.animHideNodeIds&&state.animHideNodeIds.size){state.animHideNodeIds.clear();needsRender=true;}}catch(_){}
if(needsRender)render();}}catch(_){}});function fbStartRunSearchFx(){try{fbClearNoBlurResidueV8();}catch(_){}
return;}
function readTokens(){let arr=readJsonFrom(sessionStorage,TOKENS_KEY,null);if(!Array.isArray(arr))arr=readJsonFrom(localStorage,TOKENS_KEY,[]);const norm=(s)=>String(s||"").trim().replace(/\s+/g," ");const out=Array.isArray(arr)?arr.filter((token)=>typeof token==="string").map(norm).filter(Boolean).filter((t)=>!fbIsGarbageToken(t)):[];try{const raw2=JSON.stringify(out);const rawSess=sessionStorage.getItem(TOKENS_KEY)||"";const rawLoc=localStorage.getItem(TOKENS_KEY)||"";if((rawSess&&rawSess!==raw2)||(rawLoc&&rawLoc!==raw2)){writeTokens(out);}}catch(_){}
return out;}
function writeTokens(tokens){writeJsonTo(sessionStorage,TOKENS_KEY,tokens||[]);writeJsonTo(localStorage,TOKENS_KEY,tokens||[]);}
function fbSanitizeExpr(value){if(!Array.isArray(value))return[];return value.filter((node)=>node&&typeof node==="object"&&!Array.isArray(node)&&((node.t==="TERM"&&typeof node.v==="string"&&node.v.trim())||(node.t==="OP"&&(node.v==="AND"||node.v==="OR"))||node.t==="LP"||node.t==="RP")).map((node)=>{const copy={...node};if(!fbValidNodeId(copy.__fbid))delete copy.__fbid;else copy.__fbid=copy.__fbid.trim();return copy;});}
function readExpr(){let v=readJsonFrom(sessionStorage,EXPR_KEY,null);if(!Array.isArray(v))v=readJsonFrom(localStorage,EXPR_KEY,[]);return fbSanitizeExpr(v);}
function writeExpr(expr){writeJsonTo(sessionStorage,EXPR_KEY,expr||[]);writeJsonTo(localStorage,EXPR_KEY,expr||[]);}
function addTokensToStorage(newTokens){const curr=readTokens();const norm=(x)=>String(x||"").trim().replace(/\s+/g," ");const set=new Set(curr.map(norm));for(const t of newTokens)set.add(norm(t));const merged=Array.from(set);writeTokens(merged);return merged;}
function fbReadTokenInputHistory(){try{const raw=localStorage.getItem(FB_TOKEN_INPUT_HISTORY_KEY);const arr=raw?JSON.parse(raw):[];return Array.isArray(arr)?arr.filter(Boolean).map((x)=>String(x).trim()).filter(Boolean):[];}catch(_){return[];}}
function fbWriteTokenInputHistory(arr){try{localStorage.setItem(FB_TOKEN_INPUT_HISTORY_KEY,JSON.stringify((arr||[]).map((x)=>String(x||"").trim()).filter(Boolean).slice(0,FB_TOKEN_INPUT_HISTORY_MAX)));}catch(_){}}
function fbAddTokenInputHistory(raw){const s=String(raw||"").trim().replace(/\s+/g," ");if(!s)return;const curr=fbReadTokenInputHistory();const next=[s,...curr.filter((x)=>x.toLowerCase()!==s.toLowerCase())];fbWriteTokenInputHistory(next);}
function fbRemoveTokenInputHistory(raw){const s=String(raw||"").trim();if(!s)return;fbWriteTokenInputHistory(fbReadTokenInputHistory().filter((x)=>x.toLowerCase()!==s.toLowerCase()));}
function fbClearTokenInputHistory(){fbWriteTokenInputHistory([]);}
function fbMarkTokenInputDropdownInteraction(){__fbTokenInputUi.suppressBlurHideUntil=Date.now()+260;}
function fbArmTokenInputPointerFocusLock(ms){const until=Date.now()+Math.max(220,Number(ms)||0);__fbTokenInputUi.pointerFocusUntil=Math.max(Number(__fbTokenInputUi.pointerFocusUntil||0),until);fbMarkTokenInputDropdownInteraction();}
function fbTokenInputPointerWasInsideWrap(wrap){const target=__fbTokenInputUi.lastPointerDownTarget;if(!wrap||!target)return false;try{return!!(wrap.contains&&wrap.contains(target));}catch(_){return false;}}
function fbRestoreTokenInputFocusSoon(delayMs){const ms=Math.max(0,Number(delayMs)||0);window.setTimeout(()=>{const input=fbGetTokenInputEl();const wrap=fbGetTokenInputWrap();if(!input||!wrap)return;if(document.activeElement===input){fbRefreshTokenInputUiSoon(0);return;}
if(Date.now()>=Number(__fbTokenInputUi.pointerFocusUntil||0))return;if(!fbTokenInputPointerWasInsideWrap(wrap))return;try{input.focus({preventScroll:true});}catch(_){try{input.focus();}catch(__){}}
if(document.activeElement!==input)return;try{const end=String(input.value||'').length;if(typeof input.setSelectionRange==='function')input.setSelectionRange(end,end);}catch(_){}
fbRefreshTokenInputUiSoon(0);},ms);}
function fbGetTokenInputWrap(){const input=fbGetTokenInputEl();return input&&input.parentElement&&input.parentElement.classList&&input.parentElement.classList.contains("fb-tokensearch-wrap")?input.parentElement:null;}
let __fbTokenInputKeyboardLiftBound=false;let __fbTokenInputKeyboardLiftSeq=0;let __fbTokenInputKeyboardLiftDoneSeq=0;let __fbTokenInputKeyboardLiftTimer=0;function fbNewTokenInputKeyboardLiftSession(){__fbTokenInputKeyboardLiftSeq+=1;__fbTokenInputKeyboardLiftDoneSeq=0;if(__fbTokenInputKeyboardLiftTimer){try{window.clearTimeout(__fbTokenInputKeyboardLiftTimer);}catch(_){}
__fbTokenInputKeyboardLiftTimer=0;}
return __fbTokenInputKeyboardLiftSeq;}
function fbCancelTokenInputKeyboardLiftSession(){if(__fbTokenInputKeyboardLiftTimer){try{window.clearTimeout(__fbTokenInputKeyboardLiftTimer);}catch(_){}
__fbTokenInputKeyboardLiftTimer=0;}
__fbTokenInputKeyboardLiftDoneSeq=__fbTokenInputKeyboardLiftSeq;}
function fbEnsureTokenInputAboveKeyboardNow(input,opts){const el=input||fbGetTokenInputEl();if(!el||!fbIsMobileTokenInputUi())return false;try{if(el.offsetParent===null&&document.activeElement!==el)return false;}catch(_){}
try{el.style.scrollMarginTop="72px";}catch(_){}
try{el.style.scrollMarginBottom="min(48vh, 380px)";}catch(_){}
let rect=null;try{rect=el.getBoundingClientRect();}catch(_){}
if(!rect)return false;const margin=Math.max(22,Number(opts&&opts.margin)||34);const headerReserve=76;let visibleTop=headerReserve;let visibleBottom=window.innerHeight||0;try{if(window.visualViewport){const vvTop=Number(window.visualViewport.offsetTop||0);const vvBottom=vvTop+Number(window.visualViewport.height||visibleBottom);visibleTop=Math.max(headerReserve,vvTop+12);visibleBottom=vvBottom;}}catch(_){}
if(!visibleBottom||visibleBottom<=visibleTop+90)return false;const targetBottom=visibleBottom-margin;const targetTop=visibleTop+margin;let dy=0;if(rect.bottom>targetBottom){dy=rect.bottom-targetBottom;}else if(rect.top<targetTop){dy=rect.top-targetTop;}
if(Math.abs(dy)<3)return false;try{window.scrollBy({top:dy,left:0,behavior:"auto"});}catch(_){try{window.scrollBy(0,dy);}catch(__){}}
return true;}
function fbScheduleTokenInputKeyboardLift(input,reason){const el=input||fbGetTokenInputEl();if(!el||!fbIsMobileTokenInputUi())return;const seq=__fbTokenInputKeyboardLiftSeq||fbNewTokenInputKeyboardLiftSession();if(__fbTokenInputKeyboardLiftDoneSeq===seq)return;if(__fbTokenInputKeyboardLiftTimer)return;const delay=reason==="viewport"?90:230;__fbTokenInputKeyboardLiftTimer=window.setTimeout(()=>{__fbTokenInputKeyboardLiftTimer=0;try{const nowInput=fbGetTokenInputEl();if(!nowInput)return;if(document.activeElement!==nowInput&&document.activeElement!==el)return;if(__fbTokenInputKeyboardLiftDoneSeq===seq)return;fbEnsureTokenInputAboveKeyboardNow(nowInput,{reason});__fbTokenInputKeyboardLiftDoneSeq=seq;}catch(_){__fbTokenInputKeyboardLiftDoneSeq=seq;}},delay);}
function fbBindTokenInputKeyboardLiftOnce(){if(__fbTokenInputKeyboardLiftBound)return;__fbTokenInputKeyboardLiftBound=true;const onViewportResize=()=>{try{const input=fbGetTokenInputEl();if(!input||document.activeElement!==input)return;fbScheduleTokenInputKeyboardLift(input,"viewport");}catch(_){}};try{if(window.visualViewport){window.visualViewport.addEventListener("resize",onViewportResize,{passive:true});}}catch(_){}
try{window.addEventListener("orientationchange",()=>fbCancelTokenInputKeyboardLiftSession(),{passive:true});}catch(_){}}
function fbIsTokenInputBootGuardActive(){return fbIsMobileTokenInputUi()&&Date.now()<Number(__fbTokenInputUi.bootGuardUntil||0);}
function fbShouldDeferTokenInputDropdown(){return fbIsMobileTokenInputUi()&&Date.now()<Number(__fbTokenInputUi.mobileDropdownDeferUntil||0);}
function fbArmMobileTokenInputBootTap(ms){if(!fbIsMobileTokenInputUi())return;const now=Date.now();const lockMs=Math.max(420,Number(ms)||0);__fbTokenInputUi.mobileBootTapUntil=Math.max(Number(__fbTokenInputUi.mobileBootTapUntil||0),now+lockMs);__fbTokenInputUi.mobileFocusGraceUntil=Math.max(Number(__fbTokenInputUi.mobileFocusGraceUntil||0),now+lockMs+240);__fbTokenInputUi.mobileDropdownDeferUntil=Math.max(Number(__fbTokenInputUi.mobileDropdownDeferUntil||0),now+Math.min(lockMs,320));__fbTokenInputUi.pointerFocusUntil=Math.max(Number(__fbTokenInputUi.pointerFocusUntil||0),now+lockMs+120);__fbTokenInputUi.suppressBlurHideUntil=Math.max(Number(__fbTokenInputUi.suppressBlurHideUntil||0),now+lockMs+180);}
let __fbTokenInputEnterAddLockUntil=0;let __fbTokenInputKeepFocusUntil=0;function fbMobileFocusTokenInputNow(input){const el=input||fbGetTokenInputEl();if(!el)return false;try{if(el.disabled)el.disabled=false;}catch(_){}
try{el.removeAttribute&&el.removeAttribute("readonly");}catch(_){}
try{el.focus({preventScroll:true});}catch(_){try{el.focus();}catch(__){}}
try{const end=String(el.value||"").length;if(typeof el.setSelectionRange==="function")el.setSelectionRange(end,end);}catch(_){}
return document.activeElement===el;}
function fbRequestTokenInputKeepFocus(ms){const until=Date.now()+Math.max(700,Number(ms)||0);__fbTokenInputKeepFocusUntil=Math.max(Number(__fbTokenInputKeepFocusUntil||0),until);__fbTokenInputUi.pointerFocusUntil=Math.max(Number(__fbTokenInputUi.pointerFocusUntil||0),until);__fbTokenInputUi.mobileFocusGraceUntil=Math.max(Number(__fbTokenInputUi.mobileFocusGraceUntil||0),until);__fbTokenInputUi.suppressBlurHideUntil=Math.max(Number(__fbTokenInputUi.suppressBlurHideUntil||0),until);}
function fbRefocusTokenInputAfterAdd(){const delays=fbIsMobileTokenInputUi()?[0,16,60,140,280]:[0,40];delays.forEach((ms)=>{window.setTimeout(()=>{if(Date.now()>=Number(__fbTokenInputKeepFocusUntil||0))return;const input=fbGetTokenInputEl();if(!input)return;fbMobileFocusTokenInputNow(input);fbRefreshTokenInputUiSoon(0);},ms);});}
function fbBlurTokenInputAfterEnterAdd(input){const el=input||fbGetTokenInputEl();__fbTokenInputKeepFocusUntil=0;try{__fbTokenInputUi.pointerFocusUntil=0;}catch(_){}
try{__fbTokenInputUi.mobileFocusGraceUntil=0;}catch(_){}
try{__fbTokenInputUi.suppressBlurHideUntil=0;}catch(_){}
try{window.__fbTokenInputEnterBlurUntilV4=Date.now()+1400;}catch(_){}
const blurOnce=()=>{try{fbHideTokenInputDropdown();}catch(_){}
try{const nowEl=el||fbGetTokenInputEl();if(nowEl&&document.activeElement===nowEl&&nowEl.blur)nowEl.blur();}catch(_){}};[0,16,60,140,300,620].forEach((ms)=>window.setTimeout(blurOnce,ms));window.setTimeout(()=>{try{focusPanelSoon();}catch(_){}},80);}
function fbTriggerTokenInputEnterAddToPanel(){const input=fbGetTokenInputEl();if(!input)return false;const rawTokens=parseTokensFromInput(input.value);if(!rawTokens.length)return false;const now=Date.now();if(now<Number(__fbTokenInputEnterAddLockUntil||0))return true;__fbTokenInputEnterAddLockUntil=now+650;const btn=document.getElementById("add-token");if(!btn)return false;try{btn.click();fbBlurTokenInputAfterEnterAdd(input);return true;}catch(_){return false;}}
function fbHandleTokenInputEnterKey(ev){if(!ev||ev.key!=="Enter")return false;if(ev.isComposing||ev.keyCode===229)return false;const input=fbGetTokenInputEl();const target=ev.target;if(!input||target!==input)return false;if(ev.__fbTokenInputEnterHandled)return true;try{ev.__fbTokenInputEnterHandled=true;}catch(_){}
ev.preventDefault();ev.stopPropagation();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();try{window.__fbTokenInputEnterBlurUntilV4=Date.now()+1400;}catch(_){}
const wrapNow=fbGetTokenInputWrap();const dd=wrapNow?wrapNow.querySelector(".fb-tokensearch-dropdown"):null;const visible=!!(dd&&dd.style.display!=="none"&&dd.children.length);const items=Array.isArray(__fbTokenInputUi.items)?__fbTokenInputUi.items:[];const rawIdx=Number(__fbTokenInputUi.activeIndex);const idx=Number.isFinite(rawIdx)?rawIdx:-1;if(visible&&idx>=0&&items[idx]&&items[idx].text){fbApplyTokenInputChoice(items[idx].text);return true;}
fbTriggerTokenInputEnterAddToPanel();fbBlurTokenInputAfterEnterAdd(input);return true;}
function fbIsTokenInputEnterEvent(ev){try{const input=fbGetTokenInputEl();return!!(ev&&ev.key==="Enter"&&input&&ev.target===input);}catch(_){return false;}}
function fbSuppressLateTokenInputEnter(ev){if(!fbIsTokenInputEnterEvent(ev))return false;if(Date.now()>=Number(window.__fbTokenInputEnterSuppressUntilV3||0))return false;fbStopEnterEvent(ev);return true;}
function fbInstallTokenInputEnterGuard(){if(window.__fbTokenInputEnterGuardBoundV3)return;window.__fbTokenInputEnterGuardBoundV3=true;const onKeydown=(ev)=>{try{if(!fbIsTokenInputEnterEvent(ev))return;window.__fbTokenInputEnterSuppressUntilV3=Date.now()+900;fbHandleTokenInputEnterKey(ev);}catch(_){}};const onLate=(ev)=>{try{fbSuppressLateTokenInputEnter(ev);}catch(_){}};window.addEventListener("keydown",onKeydown,true);window.addEventListener("keypress",onLate,true);window.addEventListener("keyup",onLate,true);document.addEventListener("keydown",onKeydown,true);}
function fbHandleSearchFormSubmit(ev){try{const form=document.getElementById("search-form");if(!form||!ev||ev.target!==form)return false;fbStopEnterEvent(ev);window.__fbTokenInputEnterSuppressUntilV3=Date.now()+900;fbTriggerTokenInputEnterAddToPanel();return true;}catch(_){return false;}}
function fbInstallSearchFormSubmitGuard(){if(window.__fbSearchFormSubmitGuardBoundV1)return;window.__fbSearchFormSubmitGuardBoundV1=true;window.addEventListener("submit",fbHandleSearchFormSubmit,true);document.addEventListener("submit",fbHandleSearchFormSubmit,true);}
async function fbGetTokenInputSuggestionItems(raw,maxItems){const full=fbNormaliseTokenInputValue(raw);const parts=fbSplitTokenInputForSuggest(full);const typedTokenRaw=String(parts.token||"");const typedToken=typedTokenRaw.trim().replace(/\s+/g," ");const prefix=String(parts.prefix||"");const limit=Math.max(4,Number(maxItems)||8);const items=[];const seen=new Set();const push=(text,meta)=>{const v=String(text||"").trim().replace(/\s+/g," ");if(!v)return;const key=v.toLowerCase();if(seen.has(key))return;seen.add(key);items.push({text:v,...(meta||{})});};if(!typedToken){for(const h of fbReadTokenInputHistory()){push(h,{kind:"history"});if(items.length>=limit)break;}
return{items,inlineSuffix:"",inlineText:""};}
for(const h of fbReadTokenInputHistory()){if(h.toLowerCase().includes(full.trim().toLowerCase())){push(h,{kind:"history"});if(items.length>=Math.min(3,limit))break;}}
let inlineText="";let inlineSuffix="";const tokenLower=typedToken.toLowerCase();if(fbTokenInputCanInline(typedToken)){try{const{list}=await fbBuildVocab();const prefixMatches=[];for(const entry of list||[]){const w=String((entry&&entry.w)||"").trim();if(!w)continue;const wl=w.toLowerCase();if(!wl.startsWith(tokenLower)||wl===tokenLower)continue;prefixMatches.push({w,f:Number((entry&&entry.f)||0)});if(prefixMatches.length>=24)break;}
prefixMatches.sort((a,b)=>(b.f-a.f)||(a.w.length-b.w.length)||(a.w<b.w?-1:a.w>b.w?1:0));for(const hit of prefixMatches){const outText=`${prefix}${hit.w}`;push(outText,{kind:"suggest",via:"prefix"});if(!inlineText)inlineText=outText;if(items.length>=limit)break;}}catch(_){}}
if((!items.length||items.length<Math.min(5,limit))&&typedToken){try{const suggestedToken=typeof fbSuggestToken==="function"?await fbSuggestToken(typedToken):await fbSuggestPhraseForAdd(typedToken);const s=String(suggestedToken||"").trim().replace(/\s+/g," ");if(s&&s.toLowerCase()!==tokenLower){const fullText=`${prefix}${s}`;push(fullText,{kind:"suggest",via:"fuzzy"});if(!inlineText&&s.toLowerCase().startsWith(tokenLower))inlineText=fullText;}}catch(_){}}
if(!inlineText&&items.length){const first=String(items[0].text||"");const firstToken=first.startsWith(prefix)?first.slice(prefix.length):first;if(firstToken.toLowerCase().startsWith(tokenLower))inlineText=first;}
if(inlineText){const from=`${prefix}${typedTokenRaw}`;if(inlineText.toLowerCase().startsWith(from.toLowerCase())&&inlineText.length>from.length){inlineSuffix=inlineText.slice(from.length);}}
return{items:items.slice(0,limit),inlineSuffix,inlineText};}
function fbTokenInputSyncOverlayStyle(input,overlay){if(!input||!overlay)return;try{const cs=window.getComputedStyle(input);overlay.style.font=cs.font;overlay.style.letterSpacing=cs.letterSpacing;overlay.style.paddingTop=cs.paddingTop;overlay.style.paddingRight=cs.paddingRight;overlay.style.paddingBottom=cs.paddingBottom;overlay.style.paddingLeft=cs.paddingLeft;overlay.style.textIndent=cs.textIndent;overlay.style.textTransform=cs.textTransform;overlay.style.lineHeight=cs.lineHeight;}catch(_){}}
function fbSetTokenInputActiveIndex(idx){const wrap=fbGetTokenInputWrap();const dd=wrap?wrap.querySelector(".fb-tokensearch-dropdown"):null;const rows=dd?Array.from(dd.querySelectorAll(".fb-tokensearch-item")):[];if(!rows.length){__fbTokenInputUi.activeIndex=-1;return;}
let next=Number.isFinite(idx)?Math.trunc(idx):-1;if(next<0||next>=rows.length)next=-1;__fbTokenInputUi.activeIndex=next;rows.forEach((row,i)=>row.classList.toggle("is-active",i===next));if(next>=0){try{rows[next].scrollIntoView({block:"nearest"});}catch(_){}}}
function fbApplyTokenInputChoice(text){const input=fbGetTokenInputEl();if(!input)return;const next=String(text||"").trim();if(!next)return;input.value=next;__fbTokenInputUi.lastApplied=next;try{input.focus();const end=next.length;if(typeof input.setSelectionRange==="function")input.setSelectionRange(end,end);}catch(_){}
fbHideTokenInputDropdown();fbRefreshTokenInputUiSoon(0);}
function fbHideTokenInputDropdown(){const wrap=fbGetTokenInputWrap();if(!wrap)return;const dd=wrap.querySelector(".fb-tokensearch-dropdown");if(dd){dd.style.display="none";dd.innerHTML="";}
__fbTokenInputUi.dropdownPress=null;fbSetTokenInputActiveIndex(-1);}
function fbDismissTokenInputSuggestions(){__fbTokenInputUi.seq+=1;__fbTokenInputUi.refreshEpoch=(Number(__fbTokenInputUi.refreshEpoch)||0)+1;__fbTokenInputUi.items=[];fbHideTokenInputDropdown();const wrap=fbGetTokenInputWrap();const suffix=wrap&&wrap.querySelector(".fb-tokensearch-suffix");if(suffix){suffix.textContent="";suffix.style.display="none";}}
function fbArmTokenInputDropdownScrollGuard(ms){const now=Date.now();const until=now+Math.max(240,Number(ms)||0);__fbTokenInputUi.dropdownSuppressChoiceUntil=Math.max(Number(__fbTokenInputUi.dropdownSuppressChoiceUntil||0),until);__fbTokenInputUi.suppressBlurHideUntil=Math.max(Number(__fbTokenInputUi.suppressBlurHideUntil||0),until);}
function fbStartTokenInputDropdownPress(row,ev){fbMarkTokenInputDropdownInteraction();const dd=row&&row.closest?row.closest(".fb-tokensearch-dropdown"):null;const p=fbTokenInputPointerPoint(ev)||{x:0,y:0};__fbTokenInputUi.dropdownPress={row,value:row?String(row.dataset.fbValue||""):"",x:p.x,y:p.y,scrollTop:dd?Number(dd.scrollTop||0):0,ts:Date.now(),moved:false};}
function fbMoveTokenInputDropdownPress(row,ev){const press=__fbTokenInputUi.dropdownPress;if(!press||(row&&press.row!==row))return;const p=fbTokenInputPointerPoint(ev);if(!p)return;const dx=Math.abs(p.x-Number(press.x||0));const dy=Math.abs(p.y-Number(press.y||0));if(dx>8||dy>8){press.moved=true;fbArmTokenInputDropdownScrollGuard(520);}else{fbMarkTokenInputDropdownInteraction();}}
function fbTokenInputChoiceLooksLikeScroll(row,ev){const now=Date.now();if(now<Number(__fbTokenInputUi.dropdownSuppressChoiceUntil||0))return true;const press=__fbTokenInputUi.dropdownPress;if(!press||(row&&press.row!==row))return false;const dd=row&&row.closest?row.closest(".fb-tokensearch-dropdown"):null;const p=fbTokenInputPointerPoint(ev);const dx=p?Math.abs(p.x-Number(press.x||0)):0;const dy=p?Math.abs(p.y-Number(press.y||0)):0;const scrolled=dd?Math.abs(Number(dd.scrollTop||0)-Number(press.scrollTop||0))>2:false;return!!(press.moved||dx>8||dy>8||scrolled);}
function fbBindTokenInputDropdownScrollGuard(dd){if(!dd||dd.dataset.fbScrollGuard==="1")return;dd.dataset.fbScrollGuard="1";dd.addEventListener("scroll",()=>{fbArmTokenInputDropdownScrollGuard(420);},{passive:true});dd.addEventListener("touchmove",()=>{fbMarkTokenInputDropdownInteraction();fbArmTokenInputDropdownScrollGuard(360);},{passive:true});}
function fbRenderTokenInputDropdown(items,query){const wrap=fbGetTokenInputWrap();if(!wrap)return;const dd=wrap.querySelector(".fb-tokensearch-dropdown");if(!dd)return;fbBindTokenInputDropdownScrollGuard(dd);if(!Array.isArray(items)||!items.length){fbHideTokenInputDropdown();return;}
dd.innerHTML="";const q=String(query||"").trim();for(const item of items){const row=document.createElement("div");row.className="fb-tokensearch-item";row.setAttribute("role","option");row.tabIndex=-1;row.dataset.fbValue=String(item.text||"");if(item.kind==="history")row.classList.add("is-history");const main=document.createElement("div");main.className="fb-tokensearch-item__main";main.textContent=String(item.text||"");row.appendChild(main);if(item.kind==="history"){const del=document.createElement("button");del.type="button";del.className="fb-tokensearch-item__del";del.setAttribute("aria-label","Remove");del.textContent="×";del.addEventListener("pointerdown",(ev)=>{fbMarkTokenInputDropdownInteraction();ev.preventDefault();ev.stopPropagation();},true);del.addEventListener("click",(ev)=>{ev.preventDefault();ev.stopPropagation();fbRemoveTokenInputHistory(item.text||"");fbRefreshTokenInputUiSoon(0);});row.appendChild(del);}
const startPress=(ev)=>{fbStartTokenInputDropdownPress(row,ev);};const movePress=(ev)=>{fbMoveTokenInputDropdownPress(row,ev);};const pick=(ev)=>{fbMarkTokenInputDropdownInteraction();if(ev){ev.preventDefault();ev.stopPropagation();}
if(fbTokenInputChoiceLooksLikeScroll(row,ev)){__fbTokenInputUi.dropdownPress=null;return;}
__fbTokenInputUi.dropdownPress=null;fbApplyTokenInputChoice(item.text||"");};row.addEventListener("pointerdown",startPress,{capture:true,passive:true});row.addEventListener("pointermove",movePress,{passive:true});row.addEventListener("touchstart",startPress,{capture:true,passive:true});row.addEventListener("touchmove",movePress,{passive:true});row.addEventListener("mousedown",startPress,true);row.addEventListener("click",pick);dd.appendChild(row);}
if(!q&&items.some((item)=>item&&item.kind==="history")){const footer=document.createElement("div");footer.className="fb-tokensearch-footer";const clearBtn=document.createElement("button");clearBtn.type="button";clearBtn.className="fb-tokensearch-footer__clear";clearBtn.textContent="Clear history";clearBtn.addEventListener("pointerdown",(ev)=>{fbMarkTokenInputDropdownInteraction();ev.preventDefault();ev.stopPropagation();},true);clearBtn.addEventListener("click",(ev)=>{ev.preventDefault();ev.stopPropagation();fbClearTokenInputHistory();fbRefreshTokenInputUiSoon(0);});footer.appendChild(clearBtn);dd.appendChild(footer);}
dd.style.display="block";fbSetTokenInputActiveIndex(-1);}
async function fbRefreshTokenInputUi(){const input=fbGetTokenInputEl();const wrap=fbGetTokenInputWrap();if(!input||!wrap)return;const overlay=wrap.querySelector(".fb-tokensearch-overlay");const mirror=wrap.querySelector(".fb-tokensearch-mirror");const suffix=wrap.querySelector(".fb-tokensearch-suffix");if(overlay)fbTokenInputSyncOverlayStyle(input,overlay);const raw=fbNormaliseTokenInputValue(input.value||"");const tokenPart=fbSplitTokenInputForSuggest(raw).token||"";const seq=++__fbTokenInputUi.seq;let payload={items:[],inlineSuffix:"",inlineText:""};try{payload=await fbGetTokenInputSuggestionItems(raw,8);}catch(_){}
if(seq!==__fbTokenInputUi.seq||fbGetTokenInputEl()!==input||fbGetTokenInputWrap()!==wrap||fbNormaliseTokenInputValue(input.value||"")!==raw)return;if(mirror)mirror.textContent=raw;const canShowInline=!!payload.inlineSuffix&&document.activeElement===input&&fbTokenInputCanInline(tokenPart);if(suffix){suffix.textContent=canShowInline?payload.inlineSuffix:"";suffix.style.display=canShowInline?"inline":"none";}
__fbTokenInputUi.items=Array.isArray(payload.items)?payload.items.slice():[];const isFocused=document.activeElement===input;const q=String(raw||"").trim();if(!isFocused){fbHideTokenInputDropdown();return;}
if(fbShouldDeferTokenInputDropdown()){fbHideTokenInputDropdown();const left=Math.max(0,Number(__fbTokenInputUi.mobileDropdownDeferUntil||0)-Date.now());if(left>8)fbRefreshTokenInputUiSoon(Math.min(left+20,280));return;}
if(!q){if(__fbTokenInputUi.items.length)fbRenderTokenInputDropdown(__fbTokenInputUi.items,"");else fbHideTokenInputDropdown();return;}
if(__fbTokenInputUi.items.length)fbRenderTokenInputDropdown(__fbTokenInputUi.items,q);else fbHideTokenInputDropdown();}
function fbRefreshTokenInputUiSoon(delayMs){const ms=Number(delayMs)||0;const input=fbGetTokenInputEl();const epoch=Number(__fbTokenInputUi.refreshEpoch)||0;window.setTimeout(()=>{if(epoch!==(Number(__fbTokenInputUi.refreshEpoch)||0)||fbGetTokenInputEl()!==input)return;try{fbRefreshTokenInputUi();}catch(_){}},ms);}
function fbScheduleMobileTokenInputSettledRefresh(){if(!fbIsMobileTokenInputUi())return;fbRefreshTokenInputUiSoon(120);fbRefreshTokenInputUiSoon(220);fbRefreshTokenInputUiSoon(360);fbRefreshTokenInputUiSoon(520);}
function fbEnsureTokenInputAssistStyles(){}
let __fbTokenInputAssistResizeBound=false;let __fbTokenInputAssistPointerTrackBound=false;function fbSyncTokenInputAssistMetrics(){const input=fbGetTokenInputEl();const wrap=fbGetTokenInputWrap();if(!input||!wrap)return;try{const h=Math.max(44,Math.round(input.getBoundingClientRect().height||input.offsetHeight||0));if(h)wrap.style.setProperty("--fb-token-input-h",h+"px");}catch(_){}
try{const isMobile=!!(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches);input.placeholder=isMobile?"limit, m1c, m2la":"limit, m1c, m2la, lecture 3, linear algebra, differentiation";}catch(_){}}
function fbEnsureTokenInputAssistUi(){fbEnsureTokenInputAssistStyles();const input=fbGetTokenInputEl();if(!input||!input.parentElement)return;let wrap=fbGetTokenInputWrap();if(!wrap){wrap=document.createElement("div");wrap.className="fb-tokensearch-wrap";input.parentNode.insertBefore(wrap,input);wrap.appendChild(input);}
if(!wrap.querySelector(".fb-tokensearch-overlay")){const overlay=document.createElement("div");overlay.className="fb-tokensearch-overlay";overlay.innerHTML='<span class="fb-tokensearch-mirror"></span><span class="fb-tokensearch-suffix"></span>';wrap.appendChild(overlay);}
if(!wrap.querySelector(".fb-tokensearch-dropdown")){const dd=document.createElement("div");dd.className="fb-tokensearch-dropdown";dd.setAttribute("role","listbox");dd.style.display="none";wrap.appendChild(dd);}
fbSyncTokenInputAssistMetrics();try{fbBindTokenInputKeyboardLiftOnce();}catch(_){}
window.setTimeout(fbSyncTokenInputAssistMetrics,0);window.setTimeout(fbSyncTokenInputAssistMetrics,80);if(!__fbTokenInputAssistPointerTrackBound){__fbTokenInputAssistPointerTrackBound=true;document.addEventListener("pointerdown",(ev)=>{__fbTokenInputUi.lastPointerDownTarget=ev?ev.target:null;__fbTokenInputUi.lastPointerDownTs=Date.now();},true);document.addEventListener("mousedown",(ev)=>{__fbTokenInputUi.lastPointerDownTarget=ev?ev.target:null;__fbTokenInputUi.lastPointerDownTs=Date.now();},true);}
if(!__fbTokenInputAssistResizeBound){__fbTokenInputAssistResizeBound=true;window.addEventListener("resize",fbSyncTokenInputAssistMetrics,{passive:true});}
if(wrap.dataset.fbTokenAssistPointerGuard!=="1"){wrap.dataset.fbTokenAssistPointerGuard="1";const guardPointerFocus=(ev)=>{const target=ev&&ev.target;if(!target)return;try{if(target.closest&&target.closest(".fb-tokensearch-dropdown"))return;}catch(_){}
const bootGuard=fbIsTokenInputBootGuardActive();if(bootGuard)fbArmMobileTokenInputBootTap(760);fbArmTokenInputPointerFocusLock(bootGuard?820:560);if(fbIsMobileTokenInputUi()){const inputNow=fbGetTokenInputEl();if(inputNow){fbRequestTokenInputKeepFocus(1100);fbMobileFocusTokenInputNow(inputNow);}}
fbRestoreTokenInputFocusSoon(0);fbRestoreTokenInputFocusSoon(16);if(bootGuard){fbRestoreTokenInputFocusSoon(60);fbRestoreTokenInputFocusSoon(120);fbRestoreTokenInputFocusSoon(220);fbRestoreTokenInputFocusSoon(360);fbScheduleMobileTokenInputSettledRefresh();}};wrap.addEventListener("pointerdown",guardPointerFocus,true);wrap.addEventListener("mousedown",guardPointerFocus,true);wrap.addEventListener("touchstart",guardPointerFocus,{capture:true,passive:true});wrap.addEventListener("touchend",guardPointerFocus,{capture:true,passive:true});wrap.addEventListener("click",guardPointerFocus,true);}
if(input.dataset.fbTokenAssistBound!=="1"){input.dataset.fbTokenAssistBound="1";input.addEventListener("focus",()=>{__fbTokenInputUi.lastFocusTs=Date.now();try{fbBindTokenInputKeyboardLiftOnce();fbNewTokenInputKeyboardLiftSession();fbRequestTokenInputKeepFocus(1200);fbScheduleTokenInputKeyboardLift(input,"focus");}catch(_){}
if(fbIsTokenInputBootGuardActive()||Date.now()<Number(__fbTokenInputUi.mobileBootTapUntil||0)){__fbTokenInputUi.mobileDropdownDeferUntil=Math.max(Number(__fbTokenInputUi.mobileDropdownDeferUntil||0),Date.now()+240);fbHideTokenInputDropdown();fbScheduleMobileTokenInputSettledRefresh();return;}
fbRefreshTokenInputUiSoon(0);},{passive:true});input.addEventListener("input",()=>{__fbTokenInputUi.lastApplied=fbNormaliseTokenInputValue(input.value||"");fbRefreshTokenInputUiSoon(0);});input.addEventListener("blur",()=>{try{fbCancelTokenInputKeyboardLiftSession();}catch(_){}
window.setTimeout(()=>{const wrapNow=fbGetTokenInputWrap();const shouldRestoreFocus=!!wrapNow&&Date.now()<Number(__fbTokenInputUi.pointerFocusUntil||0)&&fbTokenInputPointerWasInsideWrap(wrapNow);const shouldRestoreMobileBootFocus=!!wrapNow&&fbIsMobileTokenInputUi()&&Date.now()<Number(__fbTokenInputUi.mobileFocusGraceUntil||0)&&fbTokenInputPointerWasInsideWrap(wrapNow);if(shouldRestoreFocus||shouldRestoreMobileBootFocus){fbRestoreTokenInputFocusSoon(0);fbRestoreTokenInputFocusSoon(16);if(shouldRestoreMobileBootFocus){fbRestoreTokenInputFocusSoon(60);fbRestoreTokenInputFocusSoon(120);fbRestoreTokenInputFocusSoon(220);fbRestoreTokenInputFocusSoon(360);fbScheduleMobileTokenInputSettledRefresh();}
return;}
if(Date.now()<(__fbTokenInputUi.suppressBlurHideUntil||0))return;fbHideTokenInputDropdown();if(!wrapNow)return;const suffix=wrapNow.querySelector(".fb-tokensearch-suffix");if(suffix){suffix.textContent="";suffix.style.display="none";}},fbIsMobileTokenInputUi()?120:80);});input.addEventListener("keydown",(ev)=>{if(ev.isComposing||ev.keyCode===229)return;const wrapNow=fbGetTokenInputWrap();const dd=wrapNow?wrapNow.querySelector(".fb-tokensearch-dropdown"):null;const visible=!!(dd&&dd.style.display!=="none"&&dd.children.length);const items=Array.isArray(__fbTokenInputUi.items)?__fbTokenInputUi.items:[];const suffixEl=wrapNow?wrapNow.querySelector(".fb-tokensearch-suffix"):null;const hasInline=!!(suffixEl&&suffixEl.textContent);let idx=Number(__fbTokenInputUi.activeIndex);if(!Number.isFinite(idx))idx=-1;if(ev.key==="Enter"){if(fbHandleTokenInputEnterKey(ev))return;}
if(ev.key==="Escape"){ev.preventDefault();ev.stopPropagation();fbDismissTokenInputSuggestions();return;}
if((ev.key==="Tab"||ev.key==="ArrowRight")&&hasInline){const applied=items[idx]?items[idx].text:(items[0]?items[0].text:"");if(applied){ev.preventDefault();ev.stopPropagation();fbApplyTokenInputChoice(applied);}
return;}
if(!visible)return;if(ev.key==="ArrowDown"){ev.preventDefault();ev.stopPropagation();idx=Math.min(items.length-1,idx+1);fbSetTokenInputActiveIndex(idx);return;}
if(ev.key==="ArrowUp"){ev.preventDefault();ev.stopPropagation();idx=Math.max(0,idx-1);fbSetTokenInputActiveIndex(idx);return;}},true);}
if(!window.__fbTokenInputAssistGlobalBound){window.__fbTokenInputAssistGlobalBound=true;document.addEventListener("click",(ev)=>{const wrapNow=fbGetTokenInputWrap();if(!wrapNow)return;const t=ev.target;if(t&&wrapNow.contains(t))return;fbHideTokenInputDropdown();},true);window.addEventListener("resize",()=>fbRefreshTokenInputUiSoon(0),{passive:true});}
fbRefreshTokenInputUiSoon(0);}
const state={tokens:[],expr:[],cursor:0,history:[],future:[],animHideTokens:new Set(),animHideNodeIds:new Set(),lastMsg:"",lastMsgKind:"",fuzzyNote:{visible:false,html:"",payload:""},enterQuery:"",enterQueryUsed:false,suppressPoolHintUntil:0,suppressBoardHintUntil:0,__hintRevealTimer:null,};function snapshot(){try{fbEnsureExprNodeIds(state.expr);}catch(_){}
return{expr:state.expr.map((n)=>({...n})),cursor:state.cursor};}
function pushHistory(){state.history.push(snapshot());if(state.history.length>200)state.history.shift();state.future=[];}
function restore(prev){state.expr=fbSanitizeExpr(prev&&prev.expr);try{fbEnsureExprNodeIds(state.expr);}catch(_){}
state.cursor=Number.isFinite(prev&&prev.cursor)?prev.cursor:state.expr.length;state.cursor=clamp(state.cursor,0,state.expr.length);}
let __fbNodeSeq=1;function fbValidNodeId(id){if(typeof id!=="string")return false;const match=/^n(\d+)$/.exec(id.trim());return!!match&&Number.isSafeInteger(Number(match[1]))&&Number(match[1])>0;}
function fbNextNodeId(used){const seen=used&&typeof used.has==="function"?used:null;let id="";do{if(!Number.isSafeInteger(__fbNodeSeq)||__fbNodeSeq<1)__fbNodeSeq=1;id="n"+__fbNodeSeq;__fbNodeSeq=__fbNodeSeq>=Number.MAX_SAFE_INTEGER?1:__fbNodeSeq+1;}while(seen&&seen.has(id));if(seen)seen.add(id);return id;}
function fbEnsureNodeId(obj){if(!obj)return obj;const id=typeof obj.__fbid==="string"?obj.__fbid.trim():"";if(!fbValidNodeId(id))obj.__fbid=fbNextNodeId();return obj;}
function fbEnsureExprNodeIds(nodes){const arr=Array.isArray(nodes)?nodes:[];const used=new Set();let maxSeen=0;for(const n of arr){if(!n||typeof n!=="object"||Array.isArray(n))continue;const id=typeof n.__fbid==="string"?n.__fbid.trim():"";const m=/^n(\d+)$/.exec(id);if(m&&fbValidNodeId(id)&&!used.has(id)){used.add(id);maxSeen=Math.max(maxSeen,Number(m[1])||0);}}
if(__fbNodeSeq<=maxSeen)__fbNodeSeq=maxSeen>=Number.MAX_SAFE_INTEGER?1:maxSeen+1;const kept=new Set();for(const n of arr){if(!n||typeof n!=="object"||Array.isArray(n))continue;const id=typeof n.__fbid==="string"?n.__fbid.trim():"";if(fbValidNodeId(id)&&!kept.has(id)){kept.add(id);continue;}
n.__fbid=fbNextNodeId(used);kept.add(n.__fbid);}
return arr;}
function TERM(v){return fbEnsureNodeId({t:"TERM",v:String(v||"").trim().replace(/\s+/g," ")});}
function OP(v){return fbEnsureNodeId({t:"OP",v:String(v||"").toUpperCase()});}
function LP(){return fbEnsureNodeId({t:"LP"});}
function RP(){return fbEnsureNodeId({t:"RP"});}
function insertAtCursorNode(node){if(!node)return;pushHistory();state.cursor=clamp(state.cursor,0,state.expr.length);state.expr.splice(state.cursor,0,node);state.cursor+=1;}
function deleteAtIndex(i){if(!Number.isFinite(i))return;i=Math.floor(i);if(i<0||i>=state.expr.length)return;pushHistory();state.expr.splice(i,1);if(state.cursor>i)state.cursor-=1;state.cursor=clamp(state.cursor,0,state.expr.length);}
function normalizeNodesToTokens(nodes){const out=[];for(const n of nodes){if(isTerm(n))out.push({k:"TERM",v:String(n.v||"").trim()});else if(isOp(n))out.push({k:"OP",v:n.v});else if(isLP(n))out.push({k:"LP",v:"("});else if(isRP(n))out.push({k:"RP",v:")"});}
return out;}
let __fb_index_cache=null;async function fbLoadIndex(){if(__fb_index_cache)return __fb_index_cache;function getSiteRootUrl(){const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]');const attr=script?script.getAttribute("src"):(link?link.getAttribute("href"):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname;const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
const root=getSiteRootUrl();const url=new URL("search/search_index.json",root);const key=url.toString();const request=__mkFetchSearchIndex(key);try{const j=await request;if(!j||!Array.isArray(j.docs))throw new Error("Failed to load search index");__fb_index_cache=j;return __fb_index_cache;}catch(error){for(const map of[window.__mkSharedJsonPromiseMap,window.__mkMaterialSearchIndexPromises]){if(map&&map[key]===request)delete map[key];}
throw error;}}
function fbGetTagsFromDoc(d){const out=[];out.push(...fbAsStringList(d&&d.tags));out.push(...fbAsStringList(d&&d.tag));out.push(...fbAsStringList(d&&d.meta&&d.meta.tags));out.push(...fbAsStringList(d&&d.meta&&d.meta.tag));out.push(...fbAsStringList(d&&d.meta&&d.meta["tags"]));return out.map(s=>String(s).trim()).filter(Boolean);}
function fbGetAliasesFromDoc(d){const out=[];out.push(...fbAsStringList(d&&d.aliases));out.push(...fbAsStringList(d&&d.alias));out.push(...fbAsStringList(d&&d.meta&&d.meta.aliases));out.push(...fbAsStringList(d&&d.meta&&d.meta.alias));out.push(...fbAsStringList(d&&d.meta&&d.meta["aliases"]));return out.map(s=>String(s).trim()).filter(Boolean);}
function fbAggregateDocsToPages(docs){const pageMap=new Map();for(const d of(docs||[])){const locFull=String(d.location||"");if(!locFull)continue;const pageLoc=locFull.split("#")[0];if(!pageLoc)continue;let entry=pageMap.get(pageLoc);if(!entry){entry={location:pageLoc,title:"",text:"",tags:new Set(),aliases:new Set()};pageMap.set(pageLoc,entry);}
if(locFull===pageLoc&&d.title)entry.title=String(d.title);if(d.text)entry.text+=" "+String(d.text);for(const tg of fbGetTagsFromDoc(d))entry.tags.add(tg);for(const al of fbGetAliasesFromDoc(d))entry.aliases.add(al);}
for(const e of pageMap.values()){if(!e.title){const file=e.location.split("/").pop()||"Untitled";e.title=file.replace(/\.html$/i,"").replace(/-/g," ");}}
return Array.from(pageMap.values()).map(e=>({location:e.location,title:e.title,text:e.text,tags:Array.from(e.tags),aliases:Array.from(e.aliases),}));}
function fbClearEmptySearchResults(){const container=document.getElementById("search-results");if(!container||!container.querySelector(".sr-empty"))return;const api=window.__findSearchV2;if(api&&typeof api.clearEmptyResults==="function"&&api.clearEmptyResults())return;container.innerHTML="";}
function fbRenderNoResults(qText,hintText){const container=document.getElementById("search-results");if(!container)return;container.innerHTML=`
    <div class="sr-top">
      <div class="sr-top__title">Search results</div>
      <div class="sr-top__q">${escapeHtml(qText)}</div>
    </div>
    <div class="sr-empty">
      <p>No results found.</p>
      ${hintText ? `<p class="sr-hint">${escapeHtml(hintText)}</p>` : ""}
    </div>
  `;}
let __fbMobileIntroTipsResizeBound=false;function fbEnsureMobileIntroTipsStyles(){}
function fbIsFindIntroTitleText(raw){const text=fbCleanFindIntroTitleText(raw);return text==="search & filter"||text==="concept finder"||text.includes("search & filter")||text.includes("concept finder");}
function fbFindIntroH1(article){const h1=article&&article.querySelector?article.querySelector("h1"):null;if(!h1)return null;return fbIsFindIntroTitleText(h1.textContent||"")?h1:null;}
function fbSetH1TitlePreservingChildren(h1,title){if(!h1)return;const wanted=String(title||"").trim();if(!wanted)return;let replaced=false;try{Array.from(h1.childNodes||[]).forEach((node)=>{if(node&&node.nodeType===Node.TEXT_NODE){if(!replaced&&String(node.nodeValue||"").trim()){node.nodeValue=wanted+" ";replaced=true;}else{node.nodeValue="";}}});if(!replaced)h1.insertBefore(document.createTextNode(wanted+" "),h1.firstChild||null);}catch(_){try{h1.textContent=wanted;}catch(__){}}}
function fbRenameFindPageTitle(){if(!isOnFindPage())return;const article=fbFindIntroArticle();const h1=fbFindIntroH1(article);if(h1)fbSetH1TitlePreservingChildren(h1,FB_FIND_PAGE_TITLE);try{if(document.title&&/search\s*&\s*filter/i.test(document.title)){document.title=document.title.replace(/search\s*&\s*filter/ig,FB_FIND_PAGE_TITLE);}}catch(_){}}
function fbFindIntroParagraph(article,h1,panel){if(panel&&panel.querySelector){const moved=panel.querySelector("[data-fb-mobile-intro-copy='1']");if(moved)return moved;}
if(!article||!h1)return null;const shell=h1.closest&&h1.closest(".fb-mobile-intro-title-shell[data-fb-mobile-intro-shell='1']");let node=shell?shell.nextElementSibling:h1.nextElementSibling;let fallbackP=null;while(node){if(node.id==="search-form"||node.id==="find-builder")break;if(node.matches&&(node.matches(".fb-mobile-intro-tips")||node.matches(".fb-mobile-intro-title-shell"))){node=node.nextElementSibling;continue;}
if(String(node.tagName||"").toLowerCase()==="p"){if(!fallbackP)fallbackP=node;if(fbLooksLikeFindIntroParagraph(node))return node;}
node=node.nextElementSibling;}
return fallbackP;}
function fbCollapseMobileIntroTips(article){if(!article||!article.querySelector)return;const shell=article.querySelector(".fb-mobile-intro-title-shell[data-fb-mobile-intro-shell='1']");if(shell){const h1=shell.querySelector("h1");const panel=shell.querySelector(".fb-mobile-helper");const p=panel&&panel.querySelector?panel.querySelector("[data-fb-mobile-intro-copy='1']"):null;if(p){try{p.classList.remove("fb-mobile-intro-paragraph");p.removeAttribute("data-fb-mobile-intro-copy");shell.insertAdjacentElement("afterend",p);}catch(_){}}
try{shell.querySelectorAll(".fb-mobile-intro-tips[data-fb-mobile-intro-tips='1']").forEach((n)=>n.remove());}catch(_){}
if(h1){try{h1.querySelectorAll(".fb-mobile-intro-tips[data-fb-mobile-intro-tips='1']").forEach((n)=>n.remove());shell.insertAdjacentElement("beforebegin",h1);}catch(_){}}
try{shell.remove();}catch(_){}
return;}
const oldWrap=article.querySelector(".fb-mobile-intro-tips[data-fb-mobile-intro-tips='1']");if(!oldWrap)return;const p=oldWrap.querySelector("[data-fb-mobile-intro-copy='1']");if(p){try{p.classList.remove("fb-mobile-intro-paragraph");p.removeAttribute("data-fb-mobile-intro-copy");oldWrap.insertAdjacentElement("afterend",p);}catch(_){}}
try{oldWrap.remove();}catch(_){}}
function fbEnsureMobileIntroTips(){if(!isOnFindPage())return;fbEnsureMobileIntroTipsStyles();const article=fbFindIntroArticle();let h1=fbFindIntroH1(article);if(!article||!h1)return;if(!fbIsMobileIntroTipsMode()){fbCollapseMobileIntroTips(article);return;}
let shell=h1.closest&&h1.closest(".fb-mobile-intro-title-shell[data-fb-mobile-intro-shell='1']");let panel=shell&&shell.querySelector?shell.querySelector(".fb-mobile-helper"):null;const p=fbFindIntroParagraph(article,h1,panel);if(!p)return;if(!shell){shell=document.createElement("div");shell.className="fb-mobile-intro-title-shell";shell.setAttribute("data-fb-mobile-intro-shell","1");h1.insertAdjacentElement("beforebegin",shell);shell.appendChild(h1);}
let wrap=shell.querySelector(".fb-mobile-intro-tips[data-fb-mobile-intro-tips='1']")||h1.querySelector(".fb-mobile-intro-tips[data-fb-mobile-intro-tips='1']");if(!wrap){wrap=document.createElement("span");wrap.className="fb-mobile-intro-tips";wrap.setAttribute("data-fb-mobile-intro-tips","1");wrap.innerHTML=`
        <button type="button" class="fb-mobile-tipbtn" aria-expanded="false" aria-label="Search tips" title="Search tips">
          <span class="fb-mobile-tipbtn-icon" aria-hidden="true">i</span>
          <span class="fb-mobile-tipbtn-text">Search tips</span>
        </button>
      `;}
if(wrap.parentElement!==shell){try{shell.appendChild(wrap);}catch(_){}}
panel=shell.querySelector(".fb-mobile-helper");if(!panel){panel=document.createElement("div");panel.className="fb-mobile-helper";panel.hidden=true;shell.appendChild(panel);}
const btn=wrap.querySelector(".fb-mobile-tipbtn");if(!panel||!btn)return;if(p.parentElement!==panel){try{p.setAttribute("data-fb-mobile-intro-copy","1");p.classList.add("fb-mobile-intro-paragraph");panel.appendChild(p);}catch(_){}}
if(btn.dataset.fbMobileIntroBound!=="1"){btn.dataset.fbMobileIntroBound="1";btn.addEventListener("click",(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}
const nextOpen=panel.hidden!==false;panel.hidden=!nextOpen;btn.setAttribute("aria-expanded",nextOpen?"true":"false");});}
if(shell.dataset.fbMobileIntroOutsideBound!=="1"){shell.dataset.fbMobileIntroOutsideBound="1";document.addEventListener("click",(ev)=>{try{if(!shell.isConnected||panel.hidden)return;if(shell.contains(ev.target))return;panel.hidden=true;btn.setAttribute("aria-expanded","false");}catch(_){}},true);}
if(!__fbMobileIntroTipsResizeBound){__fbMobileIntroTipsResizeBound=true;window.addEventListener("resize",()=>{try{fbEnsureMobileIntroTips();}catch(_){}},{passive:true});window.addEventListener("orientationchange",()=>{window.setTimeout(()=>{try{fbEnsureMobileIntroTips();}catch(_){}},80);},{passive:true});}}
function fbOpenQuickShop(anchor){try{if(window.MkLocalActivity&&typeof window.MkLocalActivity.openQuickShop==="function"){window.MkLocalActivity.openQuickShop(anchor,{categories:["Finder effects"],title:"Finder effects"});}else{window.dispatchEvent(new CustomEvent("mk-open-quick-shop",{detail:{anchor,categories:["Finder effects"],title:"Finder effects"}}));}}catch(_){}}
function fbEnsureFinderQuickShopButton(){if(!isOnFindPage())return;const article=fbFindIntroArticle();const h1=fbFindIntroH1(article)||(article&&article.querySelector?article.querySelector("h1"):null);if(!h1)return;const accountOff=document.documentElement.classList.contains("mk-startup-account-off")||document.documentElement.getAttribute("data-mk-startup-account")==="off";if(accountOff){try{h1.querySelector(":scope > .mk-finder-quick-shop-btn")?.remove();}catch(_){}
try{h1.classList.remove("mk-h1-has-quick-shop");}catch(_){}
return;}
let btn=h1.querySelector(":scope > .mk-finder-quick-shop-btn");if(!btn){btn=document.createElement("button");btn.type="button";btn.className="mk-quick-shop-h1-btn mk-finder-quick-shop-btn";btn.setAttribute("aria-label","Finder effects");btn.setAttribute("title","Finder effects");btn.innerHTML=fbQuickShopIconSvg();btn.addEventListener("click",(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}
fbOpenQuickShop(btn);});h1.appendChild(btn);}
try{h1.classList.add("mk-h1-has-quick-shop");}catch(_){}}
function ensureFindBuilderHost(){let host=document.getElementById("find-builder");if(host)return host;const form=document.getElementById("search-form");if(!form)return null;host=document.createElement("div");host.id="find-builder";form.insertAdjacentElement("afterend",host);return host;}
function fbNormalizeOpButtons(host){const root=host||document.getElementById("find-builder");if(!root)return;const ids=["fb-and","fb-or","fb-lp","fb-rp"];for(const id of ids){const b=root.querySelector("#"+id);if(!b)continue;try{b.classList.add("fb-btn--op");}catch(_){}
try{b.style.borderRadius="999px";b.style.padding=".32rem .72rem";b.style.fontSize=".80rem";b.style.fontWeight="750";b.style.lineHeight="1";b.style.minHeight="26px";b.style.height="auto";b.style.display="inline-flex";b.style.alignItems="center";b.style.justifyContent="center";b.style.boxSizing="border-box";}catch(_){}}}
function clearStatus(){state.lastMsg="";state.lastMsgKind="";}
function setStatus(kind,msg){state.lastMsgKind=kind||"";state.lastMsg=String(msg||"");}
function render(){state.tokens=readTokens();try{fbEnsureExprNodeIds(state.expr);}catch(_){}
try{if(fbPrefersReducedMotion()){if(state.animHideTokens&&state.animHideTokens.size)state.animHideTokens.clear();if(state.animHideNodeIds&&state.animHideNodeIds.size)state.animHideNodeIds.clear();}}catch(_){}
try{writeExpr(state.expr);}catch{}
const host=ensureFindBuilderHost();if(!host)return;state.cursor=clamp(state.cursor,0,state.expr.length);const hasExpr=state.expr.length>0;const hasTokenList=state.tokens.length>0;const canUndo=state.history.length>0;const canClear=hasExpr;const canRun=hasExpr;const canRedo=state.future.length>0;const statusHtml=state.lastMsg?`<div class="fb-status ${
        state.lastMsgKind === "bad"
          ? "fb-status--bad"
          : state.lastMsgKind === "ok"
          ? "fb-status--ok"
          : ""
      }">${escapeHtml(state.lastMsg)}</div>`:`<div class="fb-status"></div>`;const tokenButtons=state.tokens.map((t,idx)=>{const safe=escapeHtml(t);const __tokKey=String(t||"").trim().replace(/\s+/g," ");const isHidden=!!(state.animHideTokens&&state.animHideTokens.has(__tokKey));const wrapStyle=isHidden?`style="opacity:0; visibility:hidden; transform:scale(.98);"`:"";return`
        <div class="fb-tokenwrap" data-idx="${idx}" ${wrapStyle}>
          <button class="fb-tokenbtn" type="button" ${hasTokenList ? "" : "disabled"} title="${safe}">
            <span class="fb-tokenbtn__text">${safe}</span>
          </button>
          <button class="fb-tokenbtn__x" type="button" title="Remove token" aria-label="Remove token">×</button>
        </div>
      `;}).join("");let boardHtml="";for(let i=0;i<=state.expr.length;i++){const isCursor=i===state.cursor;boardHtml+=`
      <button class="fb-slot ${isCursor ? "is-cursor" : ""}" type="button" data-slot="${i}" aria-label="Insert here">
        <span class="fb-caret">${isCursor ? "|" : ""}</span>
      </button>
    `;if(i<state.expr.length){const n=state.expr[i];const txt=escapeHtml(nodeLabel(n));let cls="fb-chip";if(n.t==="TERM")cls+=" fb-chip--term";else if(n.t==="OP")cls+=" fb-chip--op";else if(n.t==="LP"||n.t==="RP")cls+=" fb-chip--paren";const __nid=String(n.__fbid||"");const __hideChip=!!(state.animHideNodeIds&&__nid&&state.animHideNodeIds.has(__nid));const __chipStyle=__hideChip?`style="opacity:0; visibility:hidden; transform:scale(.98);"`:"";boardHtml+=`
        <span class="${cls}" data-chip="${i}" data-expr-idx="${i}" data-fb-node="${escapeHtml(n.__fbid || '')}" ${__chipStyle}>
          <span class="fb-chip__text">${txt}</span>
          <button class="fb-chip__x" type="button" data-del="${i}" aria-label="Delete">×</button>
        </span>
      `;}}
const isMobile=!!(window.matchMedia&&window.matchMedia("(max-width: 600px)").matches);const ghostLineHtml=isMobile?`
      <div class="fb-ghost__line">
        <span class="fb-ghost__chip fb-ghost__term">m1c</span>
        <span class="fb-ghost__chip fb-ghost__op">AND</span>
        <span class="fb-ghost__chip fb-ghost__term">limit</span>
      </div>
    `:`
      <div class="fb-ghost__line">
        <span class="fb-ghost__chip fb-ghost__paren">(</span>
        <span class="fb-ghost__chip fb-ghost__term">m1c</span>
        <span class="fb-ghost__chip fb-ghost__op">OR</span>
        <span class="fb-ghost__chip fb-ghost__term">m3a</span>
        <span class="fb-ghost__chip fb-ghost__paren">)</span>
        <span class="fb-ghost__chip fb-ghost__op">AND</span>
        <span class="fb-ghost__chip fb-ghost__paren">(</span>
        <span class="fb-ghost__chip fb-ghost__term">limit</span>
        <span class="fb-ghost__chip fb-ghost__op">AND</span>
        <span class="fb-ghost__chip fb-ghost__term">infinity</span>
        <span class="fb-ghost__chip fb-ghost__paren">)</span>
      </div>
    `;const ghostHintText=isMobile?`Tip: build like "token AND token".`:`Tip: add tokens above, then click tokens and AND/OR/() to build the query. You can drag tokens to rearrange.`;const __nowMs=Date.now();const __suppressPoolEmpty=__nowMs<(state.suppressPoolHintUntil||0);const __suppressBoardEmpty=__nowMs<(state.suppressBoardHintUntil||0);const placeholderHtml=`
    <div class="fb-board__placeholder fb-ghost fb-hint${__suppressBoardEmpty ? " fb-hint--pending" : ""}" data-fb-empty-hint="board">
      ${ghostLineHtml}
      <div class="fb-ghost__hint">${escapeHtml(ghostHintText)}</div>
    </div>
  `;const placeholderHeightHtml=placeholderHtml.replace('class="fb-board__placeholder ','aria-hidden="true" class="fb-board__placeholder fb-board__placeholder--height-ghost ').replace('data-fb-empty-hint="board"','data-fb-empty-hint="board-height"');const clearTokensBtnHtml=`
          <button id="fb-clear-tokens" class="fb-btn fb-btn--ghost fb-tokens__clear" type="button" ${hasTokenList ? "" : "disabled"}>
            <span class="fb-clear__x" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" fill="none"><path d="M4 7h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 3.5h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 7l-1 12a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 19L6 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M14 11v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
            <span class="fb-clear__txt">Clear tokens</span>
          </button>
        `;const poolEmptyHtml=`<div class="fb-tokens__empty fb-hint${__suppressPoolEmpty ? " fb-hint--pending" : ""}" data-fb-empty-hint="pool">No tokens yet. Add tokens from the search bar above the pool.</div>`;host.innerHTML=`
    <div id="fb-fuzzy-note"></div>

    <div class="fb-panel fb-panel--pool">
      <div class="fb-tokens">
        <div class="fb-tokens__head">
          <div class="fb-tokens__title">Token pool</div>
          ${isMobile ? clearTokensBtnHtml : ""}
        </div>
        <div class="fb-tokens__row">
          <div class="fb-tokens__list">
            ${tokenButtons || poolEmptyHtml}
          </div>
          ${!isMobile ? clearTokensBtnHtml : ""}
        </div>
      </div>
    </div>

    <div class="fb-panel fb-panel--board">
      <div class="fb-panel__head"><div class="fb-panel__title">Query panel</div></div>
      <div class="fb-board">
        <div class="fb-board__inner ${hasExpr ? "has-expr" : "is-empty"}" data-board-inner="1">
          ${
            hasExpr
              ? `<div class="fb-board__line">${boardHtml}</div>${placeholderHeightHtml}`
              : placeholderHtml
          }
        </div>
      </div>

      ${statusHtml}

      <div class="fb-actions">
        <div class="fb-actions__left">
          ${buttonHtml({ id: "fb-clear", label: "Clear", disabled: !canClear })}
          ${buttonHtml({ id: "fb-undo", label: "Undo", disabled: !canUndo })}
          ${buttonHtml({ id: "fb-redo", label: "Redo", disabled: !canRedo })}
        </div>

        <div class="fb-actions__mid">
          ${buttonHtml({ id: "fb-and", label: "AND", disabled: false, kind: "op" })}
          ${buttonHtml({ id: "fb-or", label: "OR", disabled: false, kind: "op" })}
          ${buttonHtml({ id: "fb-lp", label: "(", disabled: false, kind: "op" })}
          ${buttonHtml({ id: "fb-rp", label: ")", disabled: false, kind: "op" })}
        </div>

        <div class="fb-actions__right">
          ${buttonHtml({ id: "fb-run", label: "Run search", disabled: !canRun, kind: "primary" })}
        </div>
      </div>
    </div>
`;fbApplyFuzzyNoteDom(host);try{ensureFindSpeechBubbleFix();}catch(_){}
try{fbMaybeShowEnterCorrectionNote();}catch(_){}
try{fbScheduleThemeForegroundSync();}catch(_){}
try{fbNormalizeOpButtons(host);}catch(_){}
try{fbMarkLockedLogicButtons(host);}catch(_){}
bind(host);}
function bind(host){const fuzzyNote=host.querySelector("#fb-fuzzy-note");if(fuzzyNote&&fuzzyNote.dataset.bound!=="1"){fuzzyNote.dataset.bound="1";fuzzyNote.addEventListener("click",(e)=>{const btn=e.target&&e.target.closest?e.target.closest("button[data-fb-fuzzy-act]"):null;if(!btn)return;const act=btn.getAttribute("data-fb-fuzzy-act")||"";if(act!=="edit")return;const payload=fuzzyNote.getAttribute("data-fb-fuzzy-payload")||(state.fuzzyNote&&state.fuzzyNote.payload)||"";let data=null;try{data=payload?JSON.parse(payload):null;}catch(_){}
if(data&&data.origExpr){try{state.expr=Array.isArray(data.origExpr)?data.origExpr.map(n=>({...n})):[];state.cursor=Math.min(state.cursor,state.expr.length);}catch(_){}}
if(data&&data.tokenSwaps&&typeof data.tokenSwaps==="object"){for(const[to,from]of Object.entries(data.tokenSwaps)){fbReplaceTokenEverywhere(to,from);}
state.tokens=readTokens();}
if(data&&Array.isArray(data.tokenAddsOnEdit)&&data.tokenAddsOnEdit.length){try{const adds=data.tokenAddsOnEdit.map((x)=>String(x||"").trim().replace(/\s+/g," ")).filter(Boolean).filter((t)=>!fbIsGarbageToken(t));if(adds.length)addTokensToStorage(adds);}catch(_){}
state.tokens=readTokens();}
clearStatus();fbHideFuzzyNote();render();focusPanelSoon();});}
const clearTokensBtn=host.querySelector("#fb-clear-tokens");if(clearTokensBtn){clearTokensBtn.addEventListener("click",()=>{if(!state.tokens.length)return;state.poolGeneration=(Number(state.poolGeneration)||0)+1;fbHideFuzzyNote();const panelHasTerm=Array.isArray(state.expr)&&state.expr.some((n)=>n&&n.t==="TERM"&&String(n.v||"").trim());try{const poolWraps=Array.from(host.querySelectorAll(".fb-tokenwrap"));const bulkClear=poolWraps.length>18;for(const w of poolWraps){const b=w.querySelector(".fb-tokenbtn");const x=w.querySelector(".fb-tokenbtn__x");if(b){const t=b.querySelector(".fb-tokenbtn__text");fbDissolveFromElement(b,{text:(t?t.textContent:b.textContent)||"",bulk:bulkClear,duration:bulkClear?430:FB_DISSOLVE_MS_DEFAULT});}
if(!bulkClear&&x)fbDissolveFromElement(x,{text:"×",bulk:false,duration:460});}
if(panelHasTerm){const chips=Array.from(host.querySelectorAll(".fb-chip"));const bulkPanel=bulkClear||chips.length>18;for(const c of chips){const t=c.querySelector(".fb-chip__text");fbDissolveFromElement(c,{text:(t?t.textContent:c.textContent)||"",bulk:bulkPanel,duration:bulkPanel?430:FB_DISSOLVE_MS_DEFAULT});}}}catch(_){}
if(!panelHasTerm){try{state.suppressBoardHintUntil=0;}catch(_){}
try{const bh=host.querySelectorAll('[data-fb-empty-hint="board"]');Array.from(bh||[]).forEach((el)=>{try{el.classList.remove("fb-hint--pending");}catch(_){}
try{el.classList.remove("fb-hint--reveal");}catch(_){}});}catch(_){}}
fbSuppressEmptyHints({pool:true,board:!!panelHasTerm,delayMs:FB_DISSOLVE_MS_DEFAULT+FB_HINT_DELAY_AFTER_DISSOLVE_MS});pushHistory();state.tokens=[];writeTokens([]);if(panelHasTerm){state.expr=[];state.cursor=0;fbClearEmptySearchResults();}
clearStatus();window.setTimeout(()=>{render();focusPanelSoon();},20);});}
const clearBtn=host.querySelector("#fb-clear");if(clearBtn){clearBtn.addEventListener("click",()=>{if(!state.expr.length)return;fbHideFuzzyNote();try{const chips=Array.from(host.querySelectorAll(".fb-chip"));const bulkPanelClear=chips.length>18;for(const c of chips){const t=c.querySelector(".fb-chip__text");fbDissolveFromElement(c,{text:(t?t.textContent:c.textContent)||"",bulk:bulkPanelClear,duration:bulkPanelClear?430:FB_DISSOLVE_MS_DEFAULT});}}catch(_){}
fbSuppressEmptyHints({board:true,delayMs:FB_DISSOLVE_MS_DEFAULT+FB_HINT_DELAY_AFTER_DISSOLVE_MS});pushHistory();state.expr=[];state.cursor=0;fbClearEmptySearchResults();clearStatus();window.setTimeout(()=>{render();focusPanelSoon();},20);});}
const undoBtn=host.querySelector("#fb-undo");if(undoBtn){undoBtn.addEventListener("click",()=>{const prev=state.history.pop();if(!prev)return;const boardFirst=fbCaptureBoardChipRects();state.future.push(snapshot());restore(prev);clearStatus();render();try{host.classList.remove("fb-redo-bump");host.classList.add("fb-undo-bump");window.setTimeout(()=>host.classList.remove("fb-undo-bump"),260);}catch(_){}
try{fbPlayBoardFlip(boardFirst);}catch(_){}});}
const redoBtn=host.querySelector("#fb-redo");if(redoBtn){redoBtn.addEventListener("click",()=>{const next=state.future.pop();if(!next)return;const boardFirst=fbCaptureBoardChipRects();state.history.push(snapshot());restore(next);clearStatus();render();try{host.classList.remove("fb-undo-bump");host.classList.add("fb-redo-bump");window.setTimeout(()=>host.classList.remove("fb-redo-bump"),260);}catch(_){}
try{fbPlayBoardFlip(boardFirst);}catch(_){}});}
host.querySelectorAll(".fb-slot").forEach((btn)=>{btn.addEventListener("click",()=>{const i=Number(btn.getAttribute("data-slot"));if(!Number.isFinite(i))return;state.cursor=clamp(i,0,state.expr.length);render();});});host.querySelectorAll('button[data-del]').forEach((btn)=>{btn.addEventListener("click",(ev)=>{ev.stopPropagation();const i=Number(btn.getAttribute("data-del"));if(!Number.isFinite(i))return;let chip=null;try{chip=btn.closest?btn.closest(".fb-chip"):null;}catch(_){}
try{if(chip){const ct=chip.querySelector(".fb-chip__text");const raw=String((ct?ct.textContent:chip.textContent)||"");const txt=raw.replace(/\s*×\s*$/,"").trim();if(txt)fbDissolveFromElement(chip,{text:txt,pieces:18});}}catch(_){}
try{fbDissolveFromElement(btn,{text:"×",pieces:22});}catch(_){}
try{if(chip){chip.style.opacity="0";chip.style.pointerEvents="none";}}catch(_){}
try{const willBoardEmpty=(Array.isArray(state.expr)?state.expr.length:0)<=1;if(willBoardEmpty){fbSuppressEmptyHints({board:true,delayMs:FB_DISSOLVE_MS_DEFAULT+FB_HINT_DELAY_AFTER_DISSOLVE_MS,});}}catch(_){}
deleteAtIndex(i);clearStatus();window.setTimeout(()=>{render();},20);});});const btnAnd=host.querySelector("#fb-and");if(btnAnd)
btnAnd.addEventListener("click",async()=>{if(!(await fbEnsureLogicUnlocked("find-builder-and")))return;const __fbBoardFirst=fbCaptureBoardChipRects();const __fbFromRect=(()=>{try{return btnAnd.getBoundingClientRect();}catch(_){return null;}})();const __node=OP("AND");const __nodeId=__node&&__node.__fbid?__node.__fbid:"";insertAtCursorNode(__node);try{if(__nodeId)state.animHideNodeIds.add(__nodeId);}catch(_){}
clearStatus();render();try{fbRunPoolTokenInsertAnimation({token:"AND",nodeId:__nodeId,fromRect:__fbFromRect,styleSourceEl:btnAnd,boardFirst:__fbBoardFirst,});}catch(_){}});const btnOr=host.querySelector("#fb-or");if(btnOr)
btnOr.addEventListener("click",async()=>{if(!(await fbEnsureLogicUnlocked("find-builder-or")))return;const __fbBoardFirst=fbCaptureBoardChipRects();const __fbFromRect=(()=>{try{return btnOr.getBoundingClientRect();}catch(_){return null;}})();const __node=OP("OR");const __nodeId=__node&&__node.__fbid?__node.__fbid:"";insertAtCursorNode(__node);try{if(__nodeId)state.animHideNodeIds.add(__nodeId);}catch(_){}
clearStatus();render();try{fbRunPoolTokenInsertAnimation({token:"OR",nodeId:__nodeId,fromRect:__fbFromRect,styleSourceEl:btnOr,boardFirst:__fbBoardFirst,});}catch(_){}});const btnLP=host.querySelector("#fb-lp");if(btnLP)
btnLP.addEventListener("click",()=>{const __fbBoardFirst=fbCaptureBoardChipRects();const __fbFromRect=(()=>{try{return btnLP.getBoundingClientRect();}catch(_){return null;}})();const __node=LP();const __nodeId=__node&&__node.__fbid?__node.__fbid:"";insertAtCursorNode(__node);try{if(__nodeId)state.animHideNodeIds.add(__nodeId);}catch(_){}
clearStatus();render();try{fbRunPoolTokenInsertAnimation({token:"(",nodeId:__nodeId,fromRect:__fbFromRect,styleSourceEl:btnLP,boardFirst:__fbBoardFirst,});}catch(_){}});const btnRP=host.querySelector("#fb-rp");if(btnRP)
btnRP.addEventListener("click",()=>{const __fbBoardFirst=fbCaptureBoardChipRects();const __fbFromRect=(()=>{try{return btnRP.getBoundingClientRect();}catch(_){return null;}})();const __node=RP();const __nodeId=__node&&__node.__fbid?__node.__fbid:"";insertAtCursorNode(__node);try{if(__nodeId)state.animHideNodeIds.add(__nodeId);}catch(_){}
clearStatus();render();try{fbRunPoolTokenInsertAnimation({token:")",nodeId:__nodeId,fromRect:__fbFromRect,styleSourceEl:btnRP,boardFirst:__fbBoardFirst,});}catch(_){}});host.querySelectorAll(".fb-tokenwrap").forEach((wrap)=>{const idx=Number(wrap.getAttribute("data-idx"));const tokenBtn=wrap.querySelector(".fb-tokenbtn");const xBtn=wrap.querySelector(".fb-tokenbtn__x");if(tokenBtn){tokenBtn.addEventListener("click",()=>{const t=state.tokens[idx];if(!t)return;const __fbBoardFirst=fbCaptureBoardChipRects();const __fbFromRect=(()=>{try{return tokenBtn.getBoundingClientRect();}catch(_){return null;}})();const __node=TERM(t);const __nodeId=__node&&__node.__fbid?__node.__fbid:"";insertAtCursorNode(__node);try{if(__nodeId)state.animHideNodeIds.add(__nodeId);}catch(_){}
clearStatus();render();try{fbRunPoolTokenInsertAnimation({token:t,nodeId:__nodeId,fromRect:__fbFromRect,boardFirst:__fbBoardFirst,});}catch(_){}});}
if(xBtn){xBtn.addEventListener("click",(ev)=>{ev.stopPropagation();const t=state.tokens[idx];if(!t)return;fbHideFuzzyNote();const norm=(s)=>String(s||"").trim().replace(/\s+/g," ").toLowerCase();const target=norm(t);try{if(tokenBtn){const tt=tokenBtn.querySelector(".fb-tokenbtn__text");fbDissolveFromElement(tokenBtn,{text:(tt?tt.textContent:tokenBtn.textContent)||"",pieces:20});}}catch(_){}
try{fbDissolveFromElement(xBtn,{text:"×",pieces:22});}catch(_){}
try{const chips=Array.from(host.querySelectorAll(".fb-chip--term"));for(const c of chips){const ct=c.querySelector(".fb-chip__text");const v=(ct?ct.textContent:c.textContent)||"";if(target&&norm(v)===target){fbDissolveFromElement(c,{text:String(v||"").trim(),pieces:18});}}}catch(_){}
try{wrap.style.opacity="0";wrap.style.pointerEvents="none";}catch(_){}
const nextTokens=state.tokens.slice();nextTokens.splice(idx,1);let nextExpr=state.expr;if(target){nextExpr=state.expr.filter((n)=>{if(!n||n.t!=="TERM")return true;return norm(n.v)!==target;});}
const willPoolEmpty=nextTokens.length===0;const willBoardEmpty=(state.expr&&state.expr.length>0)&&nextExpr.length===0;if(willPoolEmpty||willBoardEmpty){fbSuppressEmptyHints({pool:willPoolEmpty,board:willBoardEmpty,delayMs:FB_DISSOLVE_MS_DEFAULT+FB_HINT_DELAY_AFTER_DISSOLVE_MS,});}
pushHistory();state.tokens=nextTokens;writeTokens(nextTokens);state.expr=nextExpr;state.cursor=clamp(state.cursor,0,state.expr.length);clearStatus();window.setTimeout(()=>{render();focusPanelSoon();},20);});}});(function initDragV4Once(){if(host.__fb_drag_v4_init)return;host.__fb_drag_v4_init=true;const DRAG_THRESHOLD_PX=6;let drag=null;function termSlots(){const slots=[];for(let i=0;i<state.expr.length;i++){const n=state.expr[i];if(n&&n.t==="TERM")slots.push(i);}
return slots;}
function moveTermValue(fromExprIdx,toExprIdx){if(fromExprIdx===toExprIdx)return;const slots=termSlots();const fromPos=slots.indexOf(fromExprIdx);const toPos=slots.indexOf(toExprIdx);if(fromPos<0||toPos<0)return;pushHistory();const values=slots.map(i=>state.expr[i].v);const picked=values.splice(fromPos,1)[0];values.splice(toPos,0,picked);for(let k=0;k<slots.length;k++){state.expr[slots[k]].v=values[k];}
state.cursor=clamp(state.cursor,0,state.expr.length);render();}
function cleanupAfterMove(){for(let i=1;i<state.expr.length;){const a=state.expr[i-1],b=state.expr[i];const aEmpty=a&&a.t==="TERM"&&!String(a.v||"").trim();const bEmpty=b&&b.t==="TERM"&&!String(b.v||"").trim();if(aEmpty&&bEmpty){state.expr.splice(i,1);continue;}
i++;}
const hasParen=state.expr.some(n=>n&&(n.t==="LP"||n.t==="RP"));const opCount=state.expr.reduce((acc,n)=>acc+(n&&n.t==="OP"?1:0),0);if(!hasParen&&opCount===1){state.expr=state.expr.filter(n=>!(n&&n.t==="TERM"&&!String(n.v||"").trim()));state.cursor=clamp(state.cursor,0,state.expr.length);return;}
const nonEmptyTerms=state.expr.filter(n=>n&&n.t==="TERM"&&String(n.v||"").trim());if(nonEmptyTerms.length<=1){state.expr=state.expr.filter(n=>!(n&&n.t==="TERM"&&!String(n.v||"").trim()));state.cursor=clamp(state.cursor,0,state.expr.length);return;}
for(let i=0;i<state.expr.length;){const n=state.expr[i];const isEmptyTerm=n&&n.t==="TERM"&&!String(n.v||"").trim();if(!isEmptyTerm){i++;continue;}
const prev=i>0?state.expr[i-1]:null;const next=i+1<state.expr.length?state.expr[i+1]:null;const prevIsOpish=!prev||(prev.t==="OP"||prev.t==="LP");const nextIsOpish=!next||(next.t==="OP"||next.t==="RP");if(next&&next.t==="OP"&&prevIsOpish){state.expr.splice(i,1);continue;}
if(prev&&prev.t==="OP"&&nextIsOpish){state.expr.splice(i,1);continue;}
i++;}
state.cursor=clamp(state.cursor,0,state.expr.length);}
function moveTermToSlot(fromExprIdx,slotIdx){const fromNode=state.expr[fromExprIdx];if(!fromNode||fromNode.t!=="TERM")return;const val=String(fromNode.v||"").trim();if(!val)return;let idx=Number(slotIdx);if(!Number.isFinite(idx))return;idx=Math.max(0,Math.min(state.expr.length,idx));pushHistory();fromNode.v="";state.expr.splice(idx,0,{t:"TERM",v:val});cleanupAfterMove();state.cursor=clamp(state.cursor,0,state.expr.length);render();}
function withinBoard(el){return!!(el&&el.closest&&el.closest('[data-board-inner="1"]'));}
function clearDropVisual(){host.querySelectorAll(".fb-drop-target").forEach(el=>el.classList.remove("fb-drop-target"));}
function setDropVisual(el){clearDropVisual();if(el)el.classList.add("fb-drop-target");}
function removeGhost(){if(drag&&drag.ghost&&drag.ghost.parentNode)drag.ghost.remove();if(drag)drag.ghost=null;}
function cleanup(commit){if(!drag)return;document.body.style.userSelect="";const fromEl=host.querySelector(`.fb-chip[data-expr-idx="${drag.fromExprIdx}"]`);if(fromEl)fromEl.classList.remove("fb-dragging");clearDropVisual();removeGhost();if(drag.raf)cancelAnimationFrame(drag.raf);const shouldCommit=commit&&drag.active;const fromIdx=drag.fromExprIdx;const kind=drag.toKind;const toExprIdx=drag.toExprIdx;const toSlotIdx=drag.toSlotIdx;drag=null;if(!shouldCommit)return;if(kind==="term"&&toExprIdx!=null&&Number.isFinite(toExprIdx)){moveTermValue(fromIdx,toExprIdx);return;}
if((kind==="slot"||kind==="end")&&toSlotIdx!=null&&Number.isFinite(toSlotIdx)){moveTermToSlot(fromIdx,toSlotIdx);return;}
document.removeEventListener("mousemove",onMove,true);document.removeEventListener("mouseup",onUp,true);document.removeEventListener("touchmove",onTouchMove,{capture:true});document.removeEventListener("touchend",onTouchEnd,true);document.removeEventListener("touchcancel",onTouchEnd,true);window.removeEventListener("blur",onCancel,true);document.removeEventListener("visibilitychange",onVis,true);}
function createGhost(fromEl){const g=fromEl.cloneNode(true);g.classList.add("fb-ghost");g.style.position="fixed";g.style.left="0px";g.style.top="0px";g.style.zIndex="9999";g.style.pointerEvents="none";g.style.opacity="0.88";g.style.boxShadow="0 14px 30px rgba(0,0,0,.35)";return g;}
function updateGhost(x,y){if(!drag||!drag.ghost)return;drag.ghost.style.transform=`translate(${x + drag.offsetX}px, ${y + drag.offsetY}px)`;}
function pickDropTarget(clientX,clientY){const el=document.elementFromPoint(clientX,clientY);if(!el)return{kind:"",exprIdx:null,slotIdx:null,el:null};const chip=el.closest?el.closest(".fb-chip"):null;if(chip&&withinBoard(chip)){const idx=Number(chip.getAttribute("data-expr-idx"));if(Number.isFinite(idx)&&state.expr[idx]&&state.expr[idx].t==="TERM"){return{kind:"term",exprIdx:idx,slotIdx:null,el:chip};}}
const slot=el.closest?el.closest(".fb-slot"):null;if(slot&&withinBoard(slot)){const slotIdx=Number(slot.getAttribute("data-slot"));if(Number.isFinite(slotIdx)){return{kind:"slot",exprIdx:null,slotIdx,el:slot};}}
const inner=el.closest?el.closest('[data-board-inner="1"]'):null;if(inner){return{kind:"end",exprIdx:null,slotIdx:state.expr.length,el:inner};}
return{kind:"",exprIdx:null,slotIdx:null,el:null};}
function scheduleHitTest(){if(!drag||drag.raf)return;drag.raf=requestAnimationFrame(()=>{drag.raf=null;if(!drag)return;const tgt=pickDropTarget(drag.lastX,drag.lastY);drag.toKind=tgt.kind;drag.toExprIdx=tgt.exprIdx;drag.toSlotIdx=tgt.slotIdx;drag.dropEl=tgt.el;setDropVisual(tgt.el);});}
function startIfNeeded(clientX,clientY){const dx=clientX-drag.startX;const dy=clientY-drag.startY;const dist=Math.hypot(dx,dy);if(drag.active||dist>=DRAG_THRESHOLD_PX){if(!drag.active){drag.active=true;const fromEl=host.querySelector(`.fb-chip[data-expr-idx="${drag.fromExprIdx}"]`);if(!fromEl){cleanup(false);return false;}
fromEl.classList.add("fb-dragging");const rect=fromEl.getBoundingClientRect();drag.offsetX=-(rect.width/2);drag.offsetY=-(rect.height/2);drag.ghost=createGhost(fromEl);document.body.appendChild(drag.ghost);document.body.style.userSelect="none";}
return true;}
return false;}
function onMove(ev){if(!drag)return;drag.lastX=ev.clientX;drag.lastY=ev.clientY;if(!startIfNeeded(ev.clientX,ev.clientY))return;ev.preventDefault();updateGhost(ev.clientX,ev.clientY);scheduleHitTest();}
function onUp(){cleanup(true);}
function onCancel(){cleanup(false);}
function onVis(){if(document.visibilityState!=="visible")cleanup(false);}
function getTouchXY(ev){const t=(ev.touches&&ev.touches[0])||(ev.changedTouches&&ev.changedTouches[0]);if(!t)return null;return{x:t.clientX,y:t.clientY};}
function onTouchMove(ev){if(!drag)return;const xy=getTouchXY(ev);if(!xy)return;drag.lastX=xy.x;drag.lastY=xy.y;if(!startIfNeeded(xy.x,xy.y))return;ev.preventDefault();updateGhost(xy.x,xy.y);scheduleHitTest();}
function onTouchEnd(){cleanup(true);}
function tryBeginFromEventTarget(tgt,clientX,clientY){if(tgt&&tgt.closest&&tgt.closest(".fb-chip__x"))return false;const chip=tgt&&tgt.closest?tgt.closest(".fb-chip"):null;if(!chip)return false;if(!withinBoard(chip))return false;const idx=Number(chip.getAttribute("data-expr-idx"));if(!Number.isFinite(idx))return false;const node=state.expr[idx];if(!node||node.t!=="TERM")return false;if(!String(node.v||"").trim())return false;if(!String(node.v||"").trim())return false;if(drag)cleanup(false);drag={fromExprIdx:idx,startX:clientX,startY:clientY,lastX:clientX,lastY:clientY,active:false,ghost:null,offsetX:0,offsetY:0,raf:null,toExprIdx:null,dropEl:null,};document.addEventListener("mousemove",onMove,true);document.addEventListener("mouseup",onUp,true);document.addEventListener("touchmove",onTouchMove,{capture:true,passive:false});document.addEventListener("touchend",onTouchEnd,true);document.addEventListener("touchcancel",onTouchEnd,true);window.addEventListener("blur",onCancel,true);document.addEventListener("visibilitychange",onVis,true);return true;}
host.addEventListener("mousedown",(ev)=>{if(ev.button!==0)return;tryBeginFromEventTarget(ev.target,ev.clientX,ev.clientY);});host.addEventListener("touchstart",(ev)=>{const xy=getTouchXY(ev);if(!xy)return;tryBeginFromEventTarget(ev.target,xy.x,xy.y);},{passive:true});host.addEventListener("dragstart",(ev)=>{if(ev.target&&ev.target.closest&&ev.target.closest(".fb-chip"))ev.preventDefault();});})();const runBtn=host.querySelector("#fb-run");if(runBtn){runBtn.addEventListener("click",async()=>{if(!state.expr.length)return;const norm=normalizeNodesToTokens(state.expr);const exprText=tokensToExprText(norm);const requestId=state.runRequest=(Number(state.runRequest)||0)+1;const sourceUrl=window.location.href;const isCurrent=()=>state.runRequest===requestId&&window.location.href===sourceUrl&&document.getElementById("find-builder")===host&&tokensToExprText(normalizeNodesToTokens(state.expr))===exprText;if(!fbConsumeGuestAction("search",{query:exprText,source:"concept-finder-run",dedupeMs:2500}))return;try{const raw=(state.fuzzyNote&&state.fuzzyNote.payload)?state.fuzzyNote.payload:"";if(raw){const data=JSON.parse(raw);if(data&&data.forExprText&&data.forExprText!==exprText){fbHideFuzzyNote();}}}catch(_){}
const v=validateTokens(norm);if(!v.ok){setStatus("bad",v.msg);render();return;}
try{const terms=norm.filter(t=>t.k==="TERM").map(t=>String(t.v||"").trim()).filter(Boolean);const uniqueTerms=Array.from(new Set(terms.map(s=>s.toLowerCase())));const hasLogic=norm.some(t=>t.k==="OP"||t.k==="LP"||t.k==="RP");const stream=norm.map(t=>{if(t.k==="TERM")return{term:String(t.v||"").trim().toLowerCase()};if(t.k==="OP")return t.v;if(t.k==="LP")return"(";if(t.k==="RP")return")";return null;}).filter(Boolean);const indexJson=await fbLoadIndex();if(!isCurrent())return;const pageDocs=fbAggregateDocsToPages((indexJson&&indexJson.docs)?indexJson.docs:[]);const rpn=fbToRPN(stream);const termCounts=new Map();for(const t of uniqueTerms)termCounts.set(t,0);let combinedCount=0;for(const d of pageDocs){const extraTags=Array.isArray(d.tags)?d.tags.join(" "):"";const extraAliases=Array.isArray(d.aliases)?d.aliases.join(" "):"";const hay=fbNormaliseForSearch(`${d.title} ${d.text} ${d.location} ${extraTags} ${extraAliases}`);const termMatches=(termLower)=>fbTermMatchesHay(termLower,hay,d);for(const t of uniqueTerms){if(termMatches(t))termCounts.set(t,(termCounts.get(t)||0)+1);}
if(fbEvalRPN(rpn,termMatches))combinedCount+=1;}
if(combinedCount<=0){let hint="";if(!hasLogic&&uniqueTerms.length===1){hint=`This token "${uniqueTerms[0]}" has no matches. Is it spelled correctly?`;}else{const zeroTerms=uniqueTerms.filter(t=>(termCounts.get(t)||0)<=0);if(zeroTerms.length){hint=buildNoMatchTokenHint(zeroTerms);}else{hint=`Each token matches some pages, but the combined logic returns none. Consider adjusting AND/OR or parentheses.`;}}
try{const did=await fbTryAutoCorrectOnNoResults(norm,uniqueTerms,termCounts,hasLogic,exprText,isCurrent);if(did)return;}catch(_){}
if(!isCurrent())return;const displayExpr=formatExprForDisplay(norm);fbRenderNoResults(displayExpr,hint);return;}}catch(e){}
if(!isCurrent())return;if(window.__findSearchV2&&typeof window.__findSearchV2.runLogicExpr==="function"){clearStatus();render();try{fbStartRunSearchFx();}catch(_){}
window.__findSearchV2.runLogicExpr(exprText);return;}
if(window.__findSearchV2&&typeof window.__findSearchV2.runQuery==="function"){const onlyTerms=norm.filter((t)=>t.k==="TERM").flatMap((t)=>String(t.v||"").trim().split(/\s+/).filter(Boolean)).join(" ").trim();if(!onlyTerms){setStatus("bad","No terms to search.");render();return;}
setStatus("bad","Logic search not ready: fallback AND was used.");render();try{fbStartRunSearchFx();}catch(_){}
window.__findSearchV2.runQuery(onlyTerms);return;}
const params=new URLSearchParams(window.location.search);params.set("q",exprText);try{fbStartRunSearchFx();}catch(_){}
window.location.search=params.toString();});}}
function init(){if(!isOnFindPage())return;ensureHeaderSearchInteractionTracker();fbInstallSameFindTopSearchBridge();try{document.body&&document.body.classList&&document.body.classList.add("mk-find-page","trending-page");}catch(_){}
ensureFindWideLayoutStyles();ensureFindMobileUiStyles();ensureFindThemeForegroundStyles();fbInstallThemeForegroundObserver();ensureFindSpeechBubbleFix();try{fbRenameFindPageTitle();}catch(_){}
try{fbEnsureFinderQuickShopButton();}catch(_){}
try{fbEnsureMobileIntroTips();}catch(_){}
try{state.enterQuery=fbCacheEnterQuery();}catch(_){state.enterQuery="";}
state.enterQueryUsed=false;closeMaterialSearchOverlayFast();fbForceClearTopSearchBarNow();const topInput=document.getElementById("search-input");if(topInput)topInput.value="";const params=new URLSearchParams(window.location.search);const q=(params.get("q")||"").trim();const lpDirectReq=fbConsumeLpDirectRequest();const lpDirectToken=lpDirectReq&&lpDirectReq.q?String(lpDirectReq.token||lpDirectReq.q||"").trim().replace(/\s+/g," "):"";if(lpDirectToken){try{state.enterQuery="";state.enterQueryUsed=true;state.history=[];state.future=[];}catch(_){}
try{fbHideFuzzyNote();}catch(_){}
try{fbForceClearTopSearchBarSoon();}catch(_){}
state.expr=[TERM(lpDirectToken)];state.cursor=state.expr.length;try{state.tokens=addTokensToStorage([lpDirectToken]);}catch(_){}}else if(params.get("src")==="header_search"&&q){state.expr=[TERM(q)];state.cursor=state.expr.length;try{state.tokens=addTokensToStorage([q]);}catch(_){}}else{const savedExpr=readExpr();if(Array.isArray(savedExpr)&&savedExpr.length){state.expr=savedExpr;state.cursor=Math.min(state.cursor||savedExpr.length,savedExpr.length);}else if(q){const parts=q.split(/\s+/).filter(Boolean);state.expr=parts.map((x)=>TERM(x));state.cursor=state.expr.length;}else{state.expr=[];state.cursor=0;}}
state.history=[];clearStatus();render();try{fbRenameFindPageTitle();}catch(_){}
try{fbEnsureFinderQuickShopButton();}catch(_){}
try{fbEnsureMobileIntroTips();}catch(_){}
if(lpDirectToken){try{fbForceClearTopSearchBarSoon();}catch(_){}
try{state.history=[];state.future=[];__fbAutofillStateV1.running=true;__fbAutofillStateV1.last=lpDirectToken;__fbAutofillStateV1.t=Date.now();}catch(_){}
setTimeout(async()=>{try{await fbWaitAndRunSearchFromAutofill(2600);}catch(_){}
try{fbForceClearTopSearchBarSoon();}catch(_){}
try{__fbAutofillStateV1.running=false;}catch(_){}},0);}
function fbDecorateAddTokenCta(btn,label){if(!btn)return;btn.classList.add("fb-cta-btn");btn.dataset.fbCtaDecorated="1";try{btn.style.textDecoration="none";}catch(_){}
try{btn.style.boxShadow="none";}catch(_){}
try{btn.style.outline="none";}catch(_){}
btn.innerHTML=`<span class="fb-cta__ico fb-cta__ico--add" aria-hidden="true"></span>`+`<span class="fb-cta__txt">${escapeHtml(label)}</span>`;if(!btn.__fbNoTextBoxBound){btn.__fbNoTextBoxBound=true;const blurBtn=()=>{try{btn.blur&&btn.blur();}catch(_){}};btn.addEventListener("pointerup",blurBtn,{passive:true});btn.addEventListener("mouseup",blurBtn,{passive:true});btn.addEventListener("keyup",(ev)=>{if(ev&&(ev.key==="Enter"||ev.key===" "))blurBtn();});}}
function fbEnsureSplitAddTokenUi(){const form=document.getElementById("search-form");if(!form)return;try{form.classList&&form.classList.add("fb-find-form");}catch(_){}
const input=form.querySelector("#search-input");if(!input)return;if(form.dataset.fbEnterSubmitBoundV1!=="1"){form.dataset.fbEnterSubmitBoundV1="1";form.addEventListener("submit",(ev)=>{fbHandleSearchFormSubmit(ev);},true);}
if(form.dataset.fbAddSplitV1==="1")return;let btnInsert=form.querySelector("#add-token")||Array.from(form.querySelectorAll("button, a")).find((x)=>(x.textContent||"").trim().toLowerCase()==="add token");if(!btnInsert)return;try{if(btnInsert.tagName&&btnInsert.tagName.toLowerCase()==="button")btnInsert.type="button";}catch(_){}
try{if(btnInsert&&btnInsert.tagName&&btnInsert.tagName.toLowerCase()!=="button"){const old=btnInsert;const b=document.createElement("button");b.type="button";b.id=old.id||"add-token";b.className=old.className||"";try{for(const[k,v]of Object.entries(old.dataset||{}))b.dataset[k]=v;}catch(_){}
try{old.replaceWith(b);}catch(_){try{old.parentNode&&old.parentNode.replaceChild(b,old);}catch(__){}}
btnInsert=b;}}catch(_){}
const bar=document.createElement("div");bar.className="fb-addtoken-bar";const actions=document.createElement("div");actions.className="fb-addtoken-actions";try{form.insertBefore(bar,input);}catch(_){form.prepend(bar);}
bar.appendChild(input);bar.appendChild(actions);let btnPool=form.querySelector("#add-token-pool");if(!btnPool){btnPool=document.createElement("button");btnPool.type="button";btnPool.id="add-token-pool";btnPool.className=btnInsert.className||"";}
actions.appendChild(btnPool);actions.appendChild(btnInsert);fbDecorateAddTokenCta(btnPool,"Add to pool");fbDecorateAddTokenCta(btnInsert,"Add to pool & panel");try{btnPool.dataset.fbAddMode="pool";}catch(_){}
try{btnInsert.dataset.fbAddMode="insert";}catch(_){}
try{if(!btnInsert.id)btnInsert.id="add-token";}catch(_){}
form.dataset.fbAddSplitV1="1";}
fbInstallSearchFormSubmitGuard();fbInstallTokenInputEnterGuard();fbEnsureSplitAddTokenUi();fbEnsureTokenInputAssistUi();if(!window.__fbAddTokenBoundV2){window.__fbAddTokenBoundV2=true;document.addEventListener("click",(ev)=>{const el=ev.target&&ev.target.closest?ev.target.closest("#add-token, #add-token-pool, button, a"):null;if(!el)return;const btn=(ev.target&&ev.target.closest?ev.target.closest('[data-fb-add-mode], #add-token, #add-token-pool'):null)||el;const modeAttr=(btn&&btn.dataset&&btn.dataset.fbAddMode)?String(btn.dataset.fbAddMode):"";const id=String((btn&&btn.id)||"");const text=((btn&&btn.textContent)||"").trim().toLowerCase();const isPool=modeAttr==="pool"||id==="add-token-pool"||text==="add to pool";const isInsert=modeAttr==="insert"||id==="add-token"||text==="add to pool & panel"||text==="add & insert"||text==="add token";if(!isPool&&!isInsert)return;ev.preventDefault();ev.stopPropagation();const input=document.getElementById("search-input");if(!input)return;const keepTokenInputFocus=Date.now()<Number(__fbTokenInputKeepFocusUntil||0);if(!keepTokenInputFocus){try{(btn&&btn.blur)&&btn.blur();}catch(_){}
try{(document.activeElement&&document.activeElement.blur)&&document.activeElement.blur();}catch(_){}}else{fbMobileFocusTokenInputNow(input);}
fbHideFuzzyNote();const rawInputForHistory=fbNormaliseTokenInputValue(input.value||"").trim().replace(/\s+/g," ");const rawTokens=parseTokensFromInput(input.value);if(!rawTokens.length)return;const mode=isPool?"pool":"insert";const doInsert=mode==="insert";const sourceUrl=window.location.href;const sourceHost=document.getElementById("find-builder");const sourceExpr=state.expr;const sourcePoolGeneration=Number(state.poolGeneration)||0;const submittedInput=input.value;const isCurrent=()=>window.location.href===sourceUrl&&document.getElementById("find-builder")===sourceHost&&document.getElementById("search-input")===input&&(Number(state.poolGeneration)||0)===sourcePoolGeneration&&(!doInsert||state.expr===sourceExpr);(async()=>{try{fbEnsureExprNodeIds(state.expr);}catch(_){}
const beforePool=readTokens();const beforePoolLower=new Set(beforePool.map((x)=>String(x||"").trim().toLowerCase()));const __fbAnimStartRect=(()=>{try{return input.getBoundingClientRect();}catch(_){return null;}})();const __fbAnimStartPt=fbInputStartPoint(input)||null;const __fbAnimBoardFirst=doInsert?fbCaptureBoardChipRects():null;const swaps=[];const swapMapUndo={};const tokenAddsOnEdit=[];const corrected=[];for(const tok0 of rawTokens){const from=String(tok0||"").trim().replace(/\s+/g," ");if(!from)continue;if(fbIsGarbageToken(from))continue;let has=false;try{has=await fbHasAnyMatchForTermCached(from);}catch(_){has=false;}
if(has){corrected.push(from);continue;}
let to="";try{to=await fbSuggestPhraseForAdd(from);}catch(_){to="";}
to=String(to||"").trim().replace(/\s+/g," ");if(to){if(/^[A-Z]/.test(from))to=to.charAt(0).toUpperCase()+to.slice(1);let ok=true;try{ok=await fbHasAnyMatchForTermCached(to);}catch(_){ok=true;}
if(ok&&to.toLowerCase()!==from.toLowerCase()){corrected.push(to);swaps.push([from,to]);if(!beforePoolLower.has(String(to).toLowerCase()))swapMapUndo[to]=from;else tokenAddsOnEdit.push(from);continue;}}
corrected.push(from);}
if(!isCurrent())return;const __fbAnimNewTokens=corrected.filter((t)=>!beforePoolLower.has(String(t).toLowerCase()));const __fbAnimInsertedNodeIds=[];state.tokens=addTokensToStorage(corrected);if(doInsert&&corrected.length){pushHistory();state.cursor=clamp(state.cursor,0,state.expr.length);for(const t of corrected){const __node=TERM(t);try{__fbAnimInsertedNodeIds.push(__node.__fbid);}catch(_){}
state.expr.splice(state.cursor,0,__node);state.cursor+=1;}
state.cursor=clamp(state.cursor,0,state.expr.length);}
const __fbAnimHideTokens=(__fbAnimStartPt?__fbAnimNewTokens.slice(0,doInsert?1:3):[]);const __fbAnimHideNodeIds=doInsert?__fbAnimInsertedNodeIds.slice(0,2):[];try{state.animHideTokens=new Set(__fbAnimHideTokens.map(x=>String(x||"").trim().replace(/\s+/g," ")));state.animHideNodeIds=new Set(__fbAnimHideNodeIds.map(x=>String(x||"")));}catch(_){}
if(rawInputForHistory)fbAddTokenInputHistory(rawInputForHistory);const inputUnchanged=input.value===submittedInput;if(inputUnchanged){input.value="";try{fbHideTokenInputDropdown();}catch(_){}}
clearStatus();render();if(inputUnchanged&&Date.now()<Number(window.__fbTokenInputEnterBlurUntilV4||0)){try{fbBlurTokenInputAfterEnterAdd(input);}catch(_){}}
try{fbRunAddTokenAnimations({mode,startRect:__fbAnimStartRect,startPt:__fbAnimStartPt,newTokens:__fbAnimNewTokens,boardFirst:__fbAnimBoardFirst,insertTokens:corrected||[],insertNodeIds:__fbAnimInsertedNodeIds||[],});}catch(_){}
if(swaps.length){const exprNow=tokensToExprText(normalizeNodesToTokens(state.expr));const msg=swaps.map(([a,b])=>`<code>${escapeHtml(b)}</code> instead of <code>${escapeHtml(a)}</code>`).join(", ");const verb=doInsert?"Inserted":"Added";const origExprPayload=snapshot().expr;fbShowFuzzyNote(`<div class="fb-fuzzy-msg">Typo detected. ${verb} ${msg}.</div>
               <div class="fb-fuzzy-actions">
                 <button type="button" class="fb-fuzzy-btn fb-fuzzy-btn--undo" data-fb-fuzzy-act="edit">Edit as typed</button>
               </div>`,{origExpr:origExprPayload,tokenSwaps:swapMapUndo,tokenAddsOnEdit,forExprText:exprNow});}
if(doInsert&&inputUnchanged){if(Date.now()<Number(window.__fbTokenInputEnterBlurUntilV4||0)){try{fbBlurTokenInputAfterEnterAdd(input);}catch(_){}}else if(keepTokenInputFocus)fbRefocusTokenInputAfterAdd();else focusPanelSoon();}})();},true);}
fbBindAutofillListenerOnce();fbMarkReadyV1();}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
document.addEventListener("DOMContentSwitch",init);try{[0,40,120,280,700,1200].forEach((ms)=>setTimeout(fbClearNoBlurResidueV8,ms));document.addEventListener("DOMContentSwitch",()=>{[0,40,120,280,700].forEach((ms)=>setTimeout(fbClearNoBlurResidueV8,ms));});window.addEventListener("pageshow",()=>{[0,40,120,280,700].forEach((ms)=>setTimeout(fbClearNoBlurResidueV8,ms));},{passive:true});}catch(_){}
try{window.__mkFindNoBlurCleanupV8=fbClearNoBlurResidueV8;}catch(_){}
try{window.dispatchEvent(new CustomEvent("fb:ready"));}catch(_){}})();