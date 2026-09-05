(function(){const{LP_FOG_ENABLED_KEY,lpReadFogEnabled,lpWriteFogEnabled,lpFogEnabled,lpSetFogEnabled,LP_NAV_CTX_KEY,LP_NAV_CTX_TTL_MS,LP_RELATED_BODY_CACHE_KEY,LP_GPS_MODE_KEY,LP_GPS_ROUTE_KEY,LP_GPS_ROUTE_TTL_MS,LP_GPS_ROUTE_TICKET_KEY,LP_GPS_ROUTE_TICKET_TTL_MS,LP_MAP_ZOOM_DEFAULT,LP_MAP_ZOOM_MIN,LP_MAP_ZOOM_MAX,LP_MAP_ZOOM_MIN_PCT,LP_MAP_ZOOM_MAX_PCT,LP_MAP_MOBILE_VISUAL_SCALE,LP_ROUTE_MAP_MOBILE_DISTANCE_SCALE,LP_3D_MAP_ENABLED,LP_3D_LOCAL_ROT_X,LP_3D_LOCAL_ROT_Y,LP_3D_ROUTE_ROT_X,LP_3D_ROUTE_ROT_Y,LP_3D_ROT_X_MIN,LP_3D_ROT_X_MAX,LP_3D_ROT_Y_MIN,LP_3D_ROT_Y_MAX,LP_WEBGL3D_CAMERA,LP_MAP_VIEW_MODE_KEY,LP_3D_LOCAL_MAP_ITEM_ID,LP_3D_LOCAL_MAP_PRICE,LP_3D_LOCAL_MAP_NAME,LP_LOCAL_MAP_ANIM_ITEM_ID,LP_LOCAL_MAP_ANIM_PRICE,LP_LOCAL_MAP_ANIM_NAME,LP_KNOWLEDGE_MASKING_ITEM_ID,LP_KNOWLEDGE_MASKING_PRICE,LP_KNOWLEDGE_MASKING_NAME,LP_GUIDED_ROUTES_ITEM_ID,LP_GUIDED_ROUTES_PRICE,LP_GUIDED_ROUTES_NAME,lp3dShopApi,lpShopItemOwned,lp3dOwnsLocalMapItem,lpLocalMapAnimationsUnlocked,lpLocalMapAnimationsEnabled,lpSyncLocalMapAnimationAccess,lpGuidedRoutesUnlocked,lpCurrencyBalance,lpShowLockedHint,lp3dShowLockedHint,lpQueueXpActivity,lp3dMapViewMode,lp3dSetMapViewMode,lp3dMapEnabled,lp3dClampNumber,lp3dEnsureStyles,lp3dClearModal3D,lp3dUpdateViewToggle,lp3dDefaultRot,lp3dViewportTiltTransform,lp3dViewportTransform,lpWebgl3dEnabled,lpWebgl3dEnsureStyles,lpWebgl3dNodeColor,lpWebgl3dEdgeColor,lpWebgl3dParsePx,lpWebgl3dViewportSize,lpWebgl3dCompile,lpWebgl3dInitGl,lpWebgl3dRotatePoint,lpWebgl3dProjectBase,lpWebgl3dProjectWithScreenTransform,lpWebgl3dProject,lpWebgl3dNodeBaseFromElement,lpWebgl3dMixAngle,lpWebgl3dNodeIsHighlighted,lpWebgl3dAnyFocusKey,lpWebgl3dUploadArray,lpWebgl3dSvgNs,lpWebgl3dHash01,lpWebgl3dEnsureSvgOverlay,lpWebgl3dClearSvgOverlay,lpWebgl3dStartRelDash,lpWebgl3dCssColor,lpWebgl3dMakeArrowMarker,lpWebgl3dProjectedNodes,lpWebgl3dClipPillEdge,lpWebgl3dCurvedD,lpWebgl3dLocalEdgeType,lpWebgl3dAppendPath,lpWebgl3dPointOnPath,lpWebgl3dAppendFlowArrow,lpWebgl3dUpdateLabels,lpWheelDeltaYPixels,lpIsTrackpadPinchWheel,lpWheelZoomDecision,lpMotionReduced,lpGuestAccess,lpConsumeGuestAction,lpAnyMapModalOpen,lpStripTitleUiArtifacts,lpExtractRenderableTitleHtmlFromHeading,lpMasterySvg,lpMasteryIcon,lpMasteryLevelLabel,lpHasExplicitMastery,lpMaskUnknownTitle,lpShuffleInPlace,lpEnsureRevealSession,lpResetRevealSession,lpSharedRevealSet,lpSplitRevealTitle,lpBuildRevealUnits,lpRevealTextForState,lpRevealProgressForState,lpRevealIsComplete,lpRevealAdvanceOne,lpRevealStopTimer,lpShouldMaskNode,lpEnsureMapRedesignPatchStyles,lpEnsureAuxMapPatchStyles,lpUpdateZoomRangeVisual,lpHasMathMarkup,lpEnsureMathDelimiters,lpExtractMathTexFromNode,lpNodeTitleNeedsTypeset,lpSetNodeTitleMathPending,lpGpsClearRouteState,lpGpsNavigationType,LP_RELATED_KEYS,lpGpsLectureMapSync,lpGpsWeightedChoice,lpGpsEstimateLength,lpGpsNeedsWork,lpGpsModeLabel,lpGpsModeCopy,lpMapButtonSvg,lpGpsPlayButtonSvg,lpGpsShuffleButtonSvg,lpCompassButtonSvg,lpH1RouteTargetPinSvg,lpRenderKnowledgeGpsProgress,lpMountKnowledgeGpsEntryProgress,lpLocalMapSafeInsets,lpLocalMapPreferredTargetPoint,lpStripMathDelimiters,lpPrettyInlineMathText,lpKatexAvailable,lpKatexInlineMathHtml,lpLocalMapHideDirectionMenu,lpLocalMapShowDirectionMenu,lpEventPoint,lpFindStrictHitNode,lpNodeFromPoint,lpStrictNodeFromEvent,lpFindRelaxedTapNode,lpBestTapNodeFromEvent,lpTapDragThreshold,lpSelectionGuardAllowsTarget,lpSelectionGuardInteractiveTarget,lpInstallBlankLongPressSelectionGuard,lpMapDocSurfaceIsIOS,lpMapDocPx,lpMapDocScrollX,lpMapDocScrollY,lpMapDocClamp,lpMapDocSafeBottomPx,lpEnsureMapDocumentSurfaceStyle,lpExitMapDocumentSurface,lpSetFullscreenIcon,lpBindTap,lpReparentZoomGroup,LP_MOBILE_SHEET_STATE_KEY,LP_MOBILE_SHEET_NAV_KEY,LP_MOBILE_SHEET_LAST_PAGE_KEY,LP_MOBILE_PANEL_ANIM_MS,LP_MOBILE_PANEL_CLOSE_ARROW_LEAD_MS,lpGetMobileSheetState,lpSetMobileSheetState,lpClearMobileSheetAnimTimer,lpMobileSheetPanelSections,lpGetMobileSheetBody,lpGetMobileSheetHead,lpClearMobileSheetPanelInlineStyles,lpMeasureMobileSheetPanelSections,lpPrimeMobileSheetOpenAnimation,lpPrimeMobileSheetCloseAnimation,lpRunMobileSheetPanelAnimation,lpResetMobileSheetAnimClasses,lpSetMobileSheetExpandedImmediate,lpSetMobileSheetScrollGuards,lpStopMobileTapEvent,lpEventTimeNow,lpBindMobileTapAction,lpSetAccordionBodyHeight,lpToggleAccordionDetails,lpBindMobileSectionSummaryTaps,lpEnsurePanelSectionChevrons,lpInstallMobileSheetSelectionShield,lpSyncMobileSheetMotionPreference,lpSyncDesktopPanelShiftNow,lpH1RouteMarkerSvg,lpSplitInlineMathParts,lpSetPendingRouteTargetTitle,LP_ROUTE_MAP_MODE,LP_ROUTE_MAP_MAX_DISTANCE,LP_ROUTE_MAP_ANIM_START_FOCUS_HOLD_MS,LP_ROUTE_MAP_ANIM_STEP_FOCUS_HOLD_MS,LP_ROUTE_MAP_ANIM_NODE_READ_MIN_MS,LP_ROUTE_MAP_MASK_REVEAL_SETTLE_MS,LP_ROUTE_MAP_NAV_ANCHOR_Y,LP_ROUTE_MAP_NAV_ROTATE_MIN_MS,LP_ROUTE_MAP_NAV_ROTATE_MAX_MS,LP_ROUTE_MAP_NAV_TRAVEL_MIN_MS,LP_ROUTE_MAP_NAV_TRAVEL_MAX_MS,LP_ROUTE_MAP_OVERVIEW_MS,LP_ROUTE_MAP_OVERVIEW_PAD_X,LP_ROUTE_MAP_OVERVIEW_PAD_TOP,LP_ROUTE_MAP_OVERVIEW_PAD_BOTTOM,LP_ROUTE_MAP_OVERVIEW_MAX_SCALE,lpRouteMapMode,lpH1StudyRouteMaskText,lpMapTipsReposition,lpMapTipsCollapse,lpMapTipsToggle,lpRouteMapFollowsForward,lpRouteMapActiveModal,lpH1StudyStartNormQuery,lpH1StudyStartQueryTokens,lpH1StudyStartEscapeRegex,lpH1StudyStartViewport,lpH1StudyStartStage,lpH1StudyStartViewportBounds,lpH1StudyRouteAnimEase,lpWebgl3dRouteViewActive,lpWebgl3dRouteScreenPoint,lpWebgl3dShortestAngleDelta,lpWebgl3dRouteRotateDuration,lpH1StudyRouteAnimDelay,lpH1StudyRouteAnimDrawPath,lpH1StudyRouteAnimEnsureNavArrow,lpH1StudyRouteAnimSetNavArrow,lpH1StudyRouteAnimRemoveNavArrow,lpH1StudyStartLaunchSleep,lpH1StudyStartLaunchCleanup,lpH1StudyStartLaunchEase,lpH1StudyStartLaunchProjectPoint,lpH1StudyStartLaunchClipProjected,lpH1StudyStartLaunchLinePath,lpH1StudyStartLaunchMakeArrowMarker,lpH1StudyStartLaunchCloneNode,lpH1StudyStartLaunchMeasureNode,lpH1StudyStartAngleNorm,lpH1StudyStartAngleDelta,lpH1StudyStartResolveAngles,lpH1StudyStartEstimateHostSize,lpH1StudyStartPrepCacheRoot,lpH1StudyStartPrepBucket,lpRouteMapHideDirectionMenu,lpIsH1RoutePreSibling,lpFindH1RouteInsertAfter,lpPlaceH1RouteBar}=window.MkLP||{};const GRAPH_URL="assets/concept-graph.json";const LP_MAP_MODAL_Z=2147483400;const MASTERY_KEY="concept_mastery_v1";function h01Stable(s){if(typeof lpWebgl3dHash01==="function")return lpWebgl3dHash01(s);let h=2166136261;const str=String(s||"");for(let i=0;i<str.length;i+=1){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}
return(h>>>0)/4294967295;}
function lpLocalMapInteractionNow(){return(window.performance&&performance.now)?performance.now():Date.now();}
function lpMarkLocalMapInteractionBusy(ms){try{const now=lpLocalMapInteractionNow();const span=Math.max(80,Math.min(1200,Number(ms)||180));window.__lpLocalMapInteractionBusyUntil=Math.max(Number(window.__lpLocalMapInteractionBusyUntil)||0,now+span);if(typeof window.__mkMarkInteractionBusy==="function"){window.__mkMarkInteractionBusy(Math.min(280,span));}}catch(_){}}
function lpLocalMapPointerHeld(){return(Number(window.__lpLocalMapPointerDown)||0)>0;}
function lpInstallLocalMapPointerWatch(){if(window.__lpLocalMapPointerWatchInstalled)return;window.__lpLocalMapPointerWatchInstalled=true;const ids=(window.__lpLocalMapPointerIds=window.__lpLocalMapPointerIds||new Set());const sync=()=>{window.__lpLocalMapPointerDown=ids.size;};const down=(e)=>{try{const t=e&&e.target;if(!t||!t.closest||!t.closest("#lp-map-modal, #lp-h1sg-modal"))return;ids.add(e.pointerId==null?-1:e.pointerId);sync();lpMarkLocalMapInteractionBusy(320);}catch(_){}};const up=(e)=>{try{ids.delete(e&&e.pointerId==null?-1:e.pointerId);sync();lpMarkLocalMapInteractionBusy(200);}catch(_){ids.clear();sync();}};try{window.addEventListener("pointerdown",down,{passive:true,capture:true});}catch(_){}
try{window.addEventListener("pointerup",up,{passive:true,capture:true});}catch(_){}
try{window.addEventListener("pointercancel",up,{passive:true,capture:true});}catch(_){}
try{window.addEventListener("blur",()=>{ids.clear();sync();},{passive:true});}catch(_){}}
function lpLocalMapInteractionIsBusy(modal){try{const root=modal||document.getElementById("lp-map-modal");if(!root||!root.classList||!root.classList.contains("lp-open"))return false;if(lpLocalMapPointerHeld())return true;if(lpLocalMapInteractionNow()<(Number(window.__lpLocalMapInteractionBusyUntil)||0))return true;if(root.classList.contains("lp-map-dragging")||root.classList.contains("lp-slider-zooming")||root.classList.contains("lp-mobile-gesturing")||root.classList.contains("lp-webgl3d-dragging")||root.classList.contains("lp-route-animating"))return true;const state=window.__lpMapState;return!!(state&&state.__lpZoomDragging);}catch(_){return false;}}
function lpWaitForLocalMapInteractionIdle(maxWaitMs){const deadline=lpLocalMapInteractionNow()+Math.max(0,Number(maxWaitMs)||1200);return new Promise((resolve)=>{const check=()=>{if(!lpLocalMapInteractionIsBusy(document.getElementById("lp-map-modal"))||lpLocalMapInteractionNow()>=deadline){resolve();return;}
window.setTimeout(check,64);};check();});}
const LP_MAP_REFRESH_QUIET_MS=700;const LP_MAP_REFRESH_MIN_INTERVAL_MS=1600;function lpLocalMapShowsLoc(modal,loc){try{if(!loc)return false;const set=modal&&modal.__lpRenderedLocSet;if(!set||typeof set.has!=="function")return false;return set.has(normLoc(loc))||set.has(lpCanonKey(loc));}catch(_){return false;}}
function lpScheduleLocalMapDataRefresh(graph,loc){try{const modal=document.getElementById("lp-map-modal");if(!modal)return;if(!lpLocalMapShowsLoc(modal,loc))return;modal.__lpRelatedDirty=true;modal.__lpRelatedChangedAt=lpLocalMapInteractionNow();if(modal.__lpRelatedRefreshScheduled)return;modal.__lpRelatedRefreshScheduled=true;const retry=(delay)=>{modal.__lpRelatedRefreshTimer=window.setTimeout(attempt,Math.max(64,Number(delay)||160));};const notReadyDelay=()=>{const now=lpLocalMapInteractionNow();const quietFor=now-(Number(modal.__lpRelatedChangedAt)||0);const sinceLast=now-(Number(modal.__lpRelatedRefreshedAt)||0);return Math.max(96,LP_MAP_REFRESH_QUIET_MS-quietFor+8,LP_MAP_REFRESH_MIN_INTERVAL_MS-sinceLast+8);};const ready=()=>{const now=lpLocalMapInteractionNow();if(now-(Number(modal.__lpRelatedChangedAt)||0)<LP_MAP_REFRESH_QUIET_MS)return false;if(modal.__lpRelatedRefreshedAt&&now-Number(modal.__lpRelatedRefreshedAt)<LP_MAP_REFRESH_MIN_INTERVAL_MS)return false;return!lpLocalMapInteractionIsBusy(modal);};const attempt=()=>{modal.__lpRelatedRefreshTimer=0;if(!modal.__lpRelatedDirty){modal.__lpRelatedRefreshScheduled=false;return;}
if(!modal.classList.contains("lp-open")){modal.__lpRelatedRefreshScheduled=false;return;}
if(!ready()){retry(notReadyDelay());return;}
const refresh=()=>{modal.__lpRelatedRefreshIdleId=0;if(!modal.classList.contains("lp-open")){modal.__lpRelatedRefreshScheduled=false;return;}
if(!ready()){retry(notReadyDelay());return;}
if(!modal.__lpRelatedDirty){modal.__lpRelatedRefreshScheduled=false;return;}
modal.__lpRelatedRefreshScheduled=false;modal.__lpRelatedDirty=false;modal.__lpRelatedRefreshedAt=lpLocalMapInteractionNow();try{renderLocalMapModal(graph);}
catch(_){modal.__lpRelatedDirty=true;}};try{if(typeof window.requestIdleCallback==="function"){modal.__lpRelatedRefreshIdleId=window.requestIdleCallback(refresh,{timeout:1200});}else{modal.__lpRelatedRefreshIdleId=window.requestAnimationFrame(refresh);}}catch(_){retry(96);}};retry(LP_MAP_REFRESH_QUIET_MS+40);}catch(_){}}
function lpOfferGuidedRoutesUnlock(source){return lpOfferUnlock(LP_GUIDED_ROUTES_ITEM_ID,LP_GUIDED_ROUTES_NAME,LP_GUIDED_ROUTES_PRICE,source||"guided-routes");}
let __lpUnlockPromptBusy=false;function lpOfferUnlock(itemId,itemName,price,source){try{if(__lpUnlockPromptBusy)return Promise.resolve({ok:false,busy:true});const api=lp3dShopApi();if(lpShopItemOwned(itemId))return Promise.resolve({ok:true,alreadyOwned:true});if(!api||typeof api.buyShopItem!=='function'){window.alert('The shop is still loading. Please try again in a moment.');return Promise.resolve({ok:false,error:'shop_loading'});}
const balance=lpCurrencyBalance();if(balance+1e-9<Number(price||0)){window.alert(`${itemName} needs ${price} EORbits. You currently have ${Math.round(balance * 10) / 10}.`);return Promise.resolve({ok:false,error:'insufficient_funds'});}
__lpUnlockPromptBusy=true;const ok=window.confirm(`Unlock ${itemName} for ${price} EORbits?`);__lpUnlockPromptBusy=false;if(!ok)return Promise.resolve({ok:false,cancelled:true});return api.buyShopItem(itemId,{source:source||itemId}).then((res)=>{if(!res||res.ok===false){window.alert(res&&res.error==='insufficient_funds'?'Not enough EORbits.':'Unlock failed. Please try again.');return res||{ok:false};}
try{window.dispatchEvent(new CustomEvent('mk-shop-inventory-change',{detail:{itemId,source:source||itemId}}));}catch(_){}
return res;});}catch(err){__lpUnlockPromptBusy=false;try{window.alert(String(err&&err.message||err||'Unlock failed.'));}catch(_){}
return Promise.resolve({ok:false,error:String(err&&err.message||err)});}}
function lp3dOfferQuickBuy(btn){return lpOfferUnlock(LP_3D_LOCAL_MAP_ITEM_ID,LP_3D_LOCAL_MAP_NAME,LP_3D_LOCAL_MAP_PRICE,'local-map-3d-toggle');}
function lpRecordXpActivity(metric,detail){try{const d=Object.assign({source:"learning-path",path:currentRelPath?currentRelPath():location.pathname},detail||{});if(window.MkXpActivity&&typeof window.MkXpActivity.record==="function"){window.MkXpActivity.record(metric,d);return;}
if(window.MkXpActivity){if(metric==="map_open"&&typeof window.MkXpActivity.recordMapOpened==="function"){window.MkXpActivity.recordMapOpened(d);return;}
if(metric==="guided_study_start"&&typeof window.MkXpActivity.recordGuidedStudyStarted==="function"){window.MkXpActivity.recordGuidedStudyStarted(d);return;}}
if(window.MkAccountData&&typeof window.MkAccountData.recordActivity==="function"){window.MkAccountData.recordActivity(metric,d,{source:d.source||"learning-path",scope:`${metric}:${d.actionStateKey || d.path || d.eventName || Date.now()}`,throttleMs:0});return;}
lpQueueXpActivity(metric,d);document.dispatchEvent(new CustomEvent("mk:xp-activity",{detail:Object.assign({metric},d)}));}catch(_){}}
installFooterAwareSidebarSpacePatchV2();function installFooterAwareSidebarSpacePatchV2(){const BUILD="mk-footer-aware-sidebar-space-v2-footer-overlay-no-lag";if(window.__mkFooterAwareSidebarSpacePatch===BUILD){try{if(window.MkFooterAwareSidebars&&typeof window.MkFooterAwareSidebars.refresh==="function"){window.MkFooterAwareSidebars.refresh();}}catch(_){}
return;}
window.__mkFooterAwareSidebarSpacePatch=BUILD;const STYLE_ID="mk-footer-aware-sidebar-space-style-v2";let raf=0;let mo=null;let mobileCleared=false;let footerObserver=null;let observedFooters=[];let footerVisibility=new Map();let footerNearViewport=false;function isDesktopLayout(){try{return!!(window.matchMedia&&window.matchMedia("(min-width: 901px)").matches);}catch(_){return(Number(window.innerWidth)||0)>=901;}}
function viewportHeight(){return Math.max(0,Number(window.innerHeight)||Number(document.documentElement.clientHeight)||0);}
function disconnectFooterObserver(){if(footerObserver){try{footerObserver.disconnect();}catch(_){}}
footerObserver=null;observedFooters=[];footerVisibility=new Map();footerNearViewport=false;}
function refreshFooterObserver(){const next=Array.prototype.slice.call(document.querySelectorAll(".md-footer, footer")).filter(function(footer){return footer instanceof HTMLElement;});const same=next.length===observedFooters.length&&next.every(function(footer,index){return footer===observedFooters[index];});if(same&&footerObserver)return;disconnectFooterObserver();observedFooters=next;if(!next.length)return;if(typeof window.IntersectionObserver!=="function")return;footerVisibility=new Map(next.map(function(footer){return[footer,false];}));footerObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){footerVisibility.set(entry.target,!!entry.isIntersecting);});const near=observedFooters.some(function(footer){return footerVisibility.get(footer)===true;});if(near===footerNearViewport)return;footerNearViewport=near;},{root:null,rootMargin:"180px 0px 180px 0px",threshold:0});next.forEach(function(footer){try{footerObserver.observe(footer);}catch(_){}});}
function mutationTouchesSidebarOrFooter(records){const selector=".md-sidebar, .md-footer, footer, .lp-secondary-fallback";for(let i=0;i<records.length;i++){const record=records[i];const target=record&&record.target;if(target&&target.nodeType===1&&target.closest&&target.closest(selector))return true;const changed=Array.prototype.slice.call((record&&record.addedNodes)||[]).concat(Array.prototype.slice.call((record&&record.removedNodes)||[]));for(let j=0;j<changed.length;j++){const node=changed[j];if(!node||node.nodeType!==1)continue;if((node.matches&&node.matches(selector))||(node.querySelector&&node.querySelector(selector)))return true;}}
return false;}
function asArray(list){return Array.prototype.slice.call(list||[]);}
function uniqueElements(list){const out=[];const seen=new WeakSet();list.forEach(function(el){if(!(el instanceof HTMLElement)||seen.has(el))return;seen.add(el);out.push(el);});return out;}
function managedSidebarElements(){return uniqueElements([document.querySelector(".md-sidebar--primary"),document.querySelector(".md-sidebar--primary .md-sidebar__scrollwrap"),document.querySelector(".md-sidebar--primary .md-sidebar__inner")].concat(asArray(document.querySelectorAll(".md-sidebar--secondary.lp-secondary-host-active, .lp-secondary-fallback")),asArray(document.querySelectorAll(".md-sidebar--secondary.lp-secondary-host-active .md-sidebar__scrollwrap, .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__inner, .lp-secondary-fallback .md-sidebar__scrollwrap, .lp-secondary-fallback .md-sidebar__inner"))));}
function removeOldStyles(){["mk-footer-aware-sidebar-space-style-v1","mk-footer-aware-sidebar-space-style-v2"].forEach(function(id){const old=document.getElementById(id);if(old&&old.id!==STYLE_ID&&old.parentNode)old.parentNode.removeChild(old);});}
function ensureStyles(){removeOldStyles();const existing=document.getElementById(STYLE_ID);if(existing)return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
  @media (min-width: 901px){
    /* Material owns sidebar height/overflow. The footer masks the sidebars at
       page end, so no JavaScript geometry follows document scroll. */
    html.mk-footer-aware-sidebars .md-footer,
    html.mk-footer-aware-sidebars footer.md-footer,
    html.mk-footer-aware-sidebars body > footer{
      position:relative !important;
      z-index:90 !important;
      isolation:isolate !important;
    }
    html.mk-footer-aware-sidebars #msb-desktop-scrollbar{
      z-index:35 !important;
    }
  }
  `;(document.head||document.documentElement).appendChild(st);}
function clearManagedStyles(){document.documentElement.classList.remove("mk-footer-aware-sidebars","mk-footer-offscreen-sidebars");}
function clearManagedStylesOnce(){if(mobileCleared)return;clearManagedStyles();mobileCleared=true;}
function apply(){raf=0;if(!isDesktopLayout()){clearManagedStylesOnce();return;}
mobileCleared=false;ensureStyles();const html=document.documentElement;html.classList.add("mk-footer-aware-sidebars");}
function schedule(){if(!isDesktopLayout()){if(raf){try{window.cancelAnimationFrame(raf);}catch(_){}
raf=0;}
clearManagedStylesOnce();disconnectFooterObserver();return;}
if(raf)return;raf=window.requestAnimationFrame(apply);}
function applyNow(){if(raf){try{window.cancelAnimationFrame(raf);}catch(_){}
raf=0;}
apply();}
window.MkFooterAwareSidebars={refresh:function(){ensureStyles();refreshFooterObserver();schedule();},apply:apply,applyNow:applyNow,isFooterNear:function(){return footerNearViewport;}};function refresh(){if(!isDesktopLayout()){schedule();return;}
ensureStyles();refreshFooterObserver();schedule();}
["resize","orientationchange","pageshow","load"].forEach(function(name){window.addEventListener(name,refresh,{passive:true});});document.addEventListener("DOMContentLoaded",refresh,{once:true});document.addEventListener("DOMContentSwitch",refresh);try{mo=new MutationObserver(function(records){if(!mutationTouchesSidebarOrFooter(records||[]))return;refreshFooterObserver();schedule();});mo.observe(document.documentElement,{childList:true,subtree:true});}catch(_){}
refresh();window.setTimeout(refresh,120);window.setTimeout(refresh,420);}
function lpMapUsesMobileVisualScale(){try{if(typeof __lpIsMobileMapModal==="function")return!!__lpIsMobileMapModal();}catch(_){}
try{if(typeof __lpIsPhoneTouch==="function")return!!__lpIsPhoneTouch();}catch(_){}
return false;}
function lpMapVisualScaleFactor(){return lpMapUsesMobileVisualScale()?LP_MAP_MOBILE_VISUAL_SCALE:1;}
function lpMapDefaultActualScale(){return LP_MAP_ZOOM_DEFAULT*lpMapVisualScaleFactor();}
function lpMapMinActualScale(){return LP_MAP_ZOOM_MIN*lpMapVisualScaleFactor();}
function lpMapMaxActualScale(){return LP_MAP_ZOOM_MAX*lpMapVisualScaleFactor();}
function lpMapDisplayPctFromScale(scale){const factor=lpMapVisualScaleFactor();const value=(Number(scale)||lpMapDefaultActualScale())/Math.max(0.001,factor);return Math.round(value*100);}
function lpMapScaleFromDisplayPct(valuePct){const pct=Number(valuePct);const safePct=Number.isFinite(pct)?pct:100;return(safePct/100)*lpMapVisualScaleFactor();}
function lpMapZoomStepActualScale(){return 0.1*lpMapVisualScaleFactor();}
function lpRouteMapMobileDistanceScale(){try{return __lpIsMobileMapModal()?LP_ROUTE_MAP_MOBILE_DISTANCE_SCALE:1;}catch(_){return 1;}}
function lp3dRefreshOpenModalAfterModeChange(modal,kind){try{if(!modal||!modal.classList||!modal.classList.contains('lp-open'))return;const graph=modal.__lpGraph||window.__lpLearningPathGraph||null;if(modal.id==='lp-map-modal'){if(window.__lpMapState){window.__lpMapState.scale=lpMapDefaultActualScale();window.__lpMapState.__lpForceCenter=true;window.__lpMapState.userMoved=false;}
renderLocalMapModal(graph);requestAnimationFrame(()=>{try{if(window.__lpMapState)lpLocalMapResetView(modal,window.__lpMapState);modal.__lpApplyTransform&&modal.__lpApplyTransform();}catch(_){}});return;}
if(modal.id==='lp-h1sg-modal'){const state=modal.__lpH1StudyState||{};const target=modal.dataset.lpTargetLoc||state.target||currentRelPath();const mode=modal.dataset.lpMode||state.mode||LP_ROUTE_MAP_MODE.TO_HERE;const view=lpH1StudyStartEnsureView(modal);view.scale=lpMapDefaultActualScale();view.forceCenter=true;view.userMoved=false;lpH1StudyStartRenderModal(graph,target,null,mode);}}catch(_){}}
function lp3dMapAccessMessage(){const next='Open Account → Store to check purchase and trial options.';const api=lp3dShopApi();if(!api)return'Account is not ready to check 3D access yet. '+next;const locked='3D Local Map requires ownership or an active trial. ';try{const pricing=typeof api.shopItemPricing==='function'?api.shopItemPricing(LP_3D_LOCAL_MAP_ITEM_ID):null;const price=pricing&&pricing.final!=null?Number(pricing.final):NaN;if(!Number.isFinite(price)||price<0)return locked+next;const number=value=>Number(value).toLocaleString('en',{maximumFractionDigits:2});let message=locked+`Current Store price: ${number(price)} EORbits. `;const xp=typeof api.xp==='function'?api.xp():null;const rawBalance=xp&&(xp.currencyBalance!=null?xp.currencyBalance:xp.eorbits);const balance=rawBalance!=null?Number(rawBalance):NaN;if(Number.isFinite(balance)&&balance>=0){message+=`Your balance: ${number(balance)} EORbits. `;if(balance<price)message+=`You need ${number(Math.ceil((price - balance) * 100) / 100)} more. `;}
return message+next;}catch(_){return locked+next;}}
function lp3dSyncAccessFeedback(modal,show){if(!modal||!modal.querySelector)return;const btn=modal.querySelector('[data-lp-view-mode="3d"]');let note=modal.querySelector('[data-lp-map-access-status]');if(lp3dOwnsLocalMapItem()){if(note){note.hidden=true;note.textContent='';}
if(btn){btn.title='Use the rotatable WebGL 3D map';btn.setAttribute('aria-label',btn.title);}
return;}
const message=lp3dMapAccessMessage();if(btn){btn.title=message;btn.setAttribute('aria-label',message);}
if(!show&&(!note||note.hidden))return;if(!note){const host=modal.querySelector('.lp-map-context-copy');if(!host)return;note=document.createElement('span');note.className='lp-map-access-status';note.setAttribute('data-lp-map-access-status','');host.appendChild(note);}
note.textContent=message;note.hidden=false;}
function lp3dInstallViewToggle(modal,kind){if(!modal||!modal.querySelector)return;lp3dEnsureStyles();try{const box=modal.querySelector('.lp-mbox')||modal;let wrap=modal.querySelector('.lp-view-toggle');if(!wrap){wrap=document.createElement('div');wrap.className='lp-view-toggle';wrap.setAttribute('aria-label','Switch map view');wrap.innerHTML=`
          <button type="button" data-lp-view-mode="2d" aria-pressed="false" title="Use the original 2D map with all SVG hover effects">2D</button>
          <button type="button" data-lp-view-mode="3d" aria-pressed="false" title="Use the rotatable WebGL 3D map">3D</button>
        `;box.appendChild(wrap);const stop=(e)=>{try{if(e&&e.cancelable)e.preventDefault();if(e&&e.stopPropagation)e.stopPropagation();if(e&&typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();}catch(_){}};wrap.addEventListener('click',(e)=>{const btn=e&&e.target&&e.target.closest?e.target.closest('[data-lp-view-mode]'):null;if(!btn)return;stop(e);const next=btn.getAttribute('data-lp-view-mode')==='2d'?'2d':'3d';if(next==='3d'&&!lp3dOwnsLocalMapItem()){lp3dSyncAccessFeedback(modal,true);return;}
const note=modal.querySelector('[data-lp-map-access-status]');if(note){note.hidden=true;note.textContent='';}
if(lp3dMapViewMode()===next)return;lp3dSetMapViewMode(next);lp3dClearModal3D(modal);lp3dUpdateViewToggle(modal);lp3dRefreshOpenModalAfterModeChange(modal,kind);},true);wrap.addEventListener('pointerdown',stop,true);wrap.addEventListener('touchstart',stop,{capture:true,passive:false});}
wrap.dataset.lp3dKind=kind==='route'?'route':'local';lp3dUpdateViewToggle(modal);lp3dSyncAccessFeedback(modal,false);}catch(_){}}
try{const refreshShopMapAccess=()=>{try{document.querySelectorAll('#lp-map-modal.lp-open, #lp-h1sg-modal.lp-open').forEach((modal)=>{lp3dUpdateViewToggle(modal);lp3dSyncAccessFeedback(modal,false);const wasUsing3d=lp3dMapViewMode()==='3d'||modal.classList.contains('lp-webgl3d')||!!modal.__lpWebgl3dEngine;if(!lp3dOwnsLocalMapItem()&&wasUsing3d){lp3dSetMapViewMode('2d');lp3dClearModal3D(modal);lp3dRefreshOpenModalAfterModeChange(modal,modal.id==='lp-h1sg-modal'?'route':'local');}});}catch(_){}};window.addEventListener('mk-shop-inventory-change',refreshShopMapAccess);window.addEventListener('mk-shop-trial-change',refreshShopMapAccess);}catch(_){}
function lp3dInstallRotationControls(modal,kind){return;if(!modal||!modal.querySelector||!lp3dMapEnabled())return;try{const box=modal.querySelector('.lp-mbox')||modal;let ctl=modal.querySelector('.lp-3d-rotctl');if(!ctl){ctl=document.createElement('div');ctl.className='lp-3d-rotctl';ctl.setAttribute('aria-label','3D rotation controls');ctl.innerHTML=`
          <span class="lp-3d-rot-label" data-lp-3d-drag title="Drag here to rotate the 3D map">Rotate</span>
          <button type="button" class="lp-3d-rot-btn" data-lp-3d-rot="left" aria-label="Rotate left">←</button>
          <button type="button" class="lp-3d-rot-btn" data-lp-3d-rot="right" aria-label="Rotate right">→</button>
          <button type="button" class="lp-3d-rot-btn" data-lp-3d-rot="up" aria-label="Tilt up">↑</button>
          <button type="button" class="lp-3d-rot-btn" data-lp-3d-rot="down" aria-label="Tilt down">↓</button>
          <button type="button" class="lp-3d-rot-btn lp-3d-rot-reset" data-lp-3d-rot="reset" aria-label="Reset 3D view">Reset</button>
        `;box.appendChild(ctl);const stop=(e)=>{try{if(e&&e.cancelable)e.preventDefault();if(e&&e.stopPropagation)e.stopPropagation();if(e&&typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();}catch(_){}};ctl.addEventListener('click',(e)=>{const btn=e&&e.target&&e.target.closest?e.target.closest('[data-lp-3d-rot]'):null;if(!btn)return;stop(e);lpMarkLocalMapInteractionBusy(220);const activeKind=ctl.dataset.lp3dKind||'local';const cur=modal.__lp3d||lp3dDefaultRot(activeKind);const action=btn.getAttribute('data-lp-3d-rot')||'';let rx=Number(cur.rx);let ry=Number(cur.ry);if(!Number.isFinite(rx)||!Number.isFinite(ry)){const d=lp3dDefaultRot(activeKind);rx=d.rx;ry=d.ry;}
if(action==='left')ry-=10;else if(action==='right')ry+=10;else if(action==='up')rx-=8;else if(action==='down')rx+=8;else if(action==='reset'){const d=lp3dDefaultRot(activeKind);rx=d.rx;ry=d.ry;}
lp3dSetModalRotation(modal,activeKind,rx,ry);},true);let drag=null;const dragHandle=ctl.querySelector('[data-lp-3d-drag]')||ctl;dragHandle.addEventListener('pointerdown',(e)=>{stop(e);lpMarkLocalMapInteractionBusy(360);const activeKind=ctl.dataset.lp3dKind||'local';const cur=modal.__lp3d||lp3dDefaultRot(activeKind);drag={id:e.pointerId,kind:activeKind,x:Number(e.clientX)||0,y:Number(e.clientY)||0,rx:Number.isFinite(Number(cur.rx))?Number(cur.rx):lp3dDefaultRot(activeKind).rx,ry:Number.isFinite(Number(cur.ry))?Number(cur.ry):lp3dDefaultRot(activeKind).ry,};try{dragHandle.setPointerCapture(e.pointerId);}catch(_){}
try{ctl.classList.add('is-dragging');}catch(_){}},true);dragHandle.addEventListener('pointermove',(e)=>{if(!drag||(e.pointerId!=null&&drag.id!==e.pointerId))return;stop(e);lpMarkLocalMapInteractionBusy(240);const dx=(Number(e.clientX)||0)-drag.x;const dy=(Number(e.clientY)||0)-drag.y;lp3dSetModalRotation(modal,drag.kind,drag.rx-dy*0.18,drag.ry+dx*0.18);},true);const endDrag=(e)=>{if(!drag)return;stop(e);lpMarkLocalMapInteractionBusy(180);try{dragHandle.releasePointerCapture(drag.id);}catch(_){}
drag=null;try{ctl.classList.remove('is-dragging');}catch(_){}
try{lpWebgl3dFlushRotation(modal&&modal.__lpWebgl3dEngine);}catch(_){}};dragHandle.addEventListener('pointerup',endDrag,true);dragHandle.addEventListener('pointercancel',endDrag,true);ctl.addEventListener('pointerdown',stop,true);ctl.addEventListener('touchstart',stop,{capture:true,passive:false});}
ctl.dataset.lp3dKind=kind==='route'?'route':'local';}catch(_){}}
function lp3dActivateModal(modal,kind){if(!modal)return false;const activeKind=kind==='route'?'route':'local';lp3dInstallViewToggle(modal,activeKind);if(!lp3dMapEnabled()){lp3dClearModal3D(modal);lp3dUpdateViewToggle(modal);return false;}
lp3dEnsureStyles();const isRoute=activeKind==='route';try{modal.classList.toggle('lp-route-3d',isRoute);modal.classList.toggle('lp-map-3d',!isRoute);if(!modal.__lp3d)modal.__lp3d={};const def=lp3dDefaultRot(activeKind);const rx=Number.isFinite(Number(modal.__lp3d.rx))?Number(modal.__lp3d.rx):def.rx;const ry=Number.isFinite(Number(modal.__lp3d.ry))?Number(modal.__lp3d.ry):def.ry;lp3dSetModalRotation(modal,activeKind,rx,ry);lp3dInstallRotationControls(modal,activeKind);lp3dUpdateViewToggle(modal);}catch(_){}
return true;}
function lp3dSetModalRotation(modal,kind,rx,ry){if(!modal||!lp3dMapEnabled())return;const def=lp3dDefaultRot(kind);const nx=lp3dClampNumber(rx,LP_3D_ROT_X_MIN,LP_3D_ROT_X_MAX,def.rx);const ny=lp3dClampNumber(ry,LP_3D_ROT_Y_MIN,LP_3D_ROT_Y_MAX,def.ry);try{if(!modal.__lp3d)modal.__lp3d={};modal.__lp3d.rx=nx;modal.__lp3d.ry=ny;modal.style.setProperty('--lp-3d-rx',`${nx}deg`);modal.style.setProperty('--lp-3d-ry',`${ny}deg`);modal.dataset.lp3dRx=String(Math.round(nx));modal.dataset.lp3dRy=String(Math.round(ny));try{if(modal.__lpWebgl3dEngine)lpWebgl3dSetRotation(modal.__lpWebgl3dEngine,nx,ny);}catch(_){}}catch(_){}}
function lp3dDepthForLocalNode(loc,cur,level,coreSet){const key=normLoc(loc);if(key&&normLoc(cur)===key)return 168;const isCore=!coreSet||!coreSet.has||coreSet.has(key);if(!isCore)return-138;const d=Number(level&&level.get?level.get(key):0)||0;if(d<0)return Math.max(-190,-72-Math.abs(d)*42);if(d>0)return Math.min(190,72+Math.abs(d)*42);return 28;}
function lp3dDecorateLocalNodeElement(nodeEl,loc,cur,level,coreSet){if(!nodeEl||!lp3dMapEnabled())return;const z=lp3dDepthForLocalNode(loc,cur,level,coreSet);try{nodeEl.style.setProperty('--lp-3d-z',`${z}px`);nodeEl.style.transform='translate(-50%, -50%) translateZ(var(--lp-3d-z, 0px)) scale(var(--lp-3d-node-scale, 1))';const baseZ=nodeEl.classList&&nodeEl.classList.contains('is-cur')?62:(z>=100?48:(z>=25?36:24));nodeEl.style.zIndex=String(baseZ);}catch(_){}}
function lp3dDecorateLocalMap(modal,graph,ctx){const data=ctx&&typeof ctx==='object'?ctx:{};lp3dInstallViewToggle(modal,'local');const vp=modal&&modal.querySelector?modal.querySelector('[data-map-viewport]'):null;if(vp&&lpWebgl3dInstall(modal,'local',vp,graph,data,null))return;if(!lp3dActivateModal(modal,'local'))return;if(!vp)return;const cur=data.cur||currentRelPath();const level=data.level||null;const coreSet=data.coreSet||null;try{Array.from(vp.querySelectorAll('a.lp-node[data-lp-loc]')).forEach((nodeEl)=>{const loc=normLoc(nodeEl.getAttribute('data-lp-loc')||'');lp3dDecorateLocalNodeElement(nodeEl,loc,cur,level,coreSet);});}catch(_){}}
function lp3dDepthForRouteNode(nodeEl,state){const depth=Math.max(0,Number(nodeEl&&nodeEl.getAttribute&&nodeEl.getAttribute('data-lp-route-depth'))||0);const loc=normLoc((nodeEl&&nodeEl.getAttribute&&nodeEl.getAttribute('data-lp-loc'))||'');const targetKey=lpCanonKey(state&&state.target||'');const startKey=lpCanonKey(state&&state.startLoc||'');const locKey=lpCanonKey(loc);if(targetKey&&locKey===targetKey)return 178;if(startKey&&locKey===startKey)return 118;if(nodeEl&&nodeEl.classList&&nodeEl.classList.contains('is-route'))return Math.max(-130,132-depth*34);return Math.max(-150,Math.min(150,106-depth*34));}
function lp3dDecorateRouteMap(modal,viewport,state){lp3dInstallViewToggle(modal,'route');const vp=viewport||lpH1StudyStartViewport(modal);if(vp&&lpWebgl3dInstall(modal,'route',vp,(state&&state.graph)||null,{},state||(modal&&modal.__lpH1StudyState)||null))return;if(!lp3dActivateModal(modal,'route'))return;if(!vp||!vp.querySelectorAll)return;try{Array.from(vp.querySelectorAll('.lp-node[data-lp-loc]')).forEach((nodeEl)=>{const z=lp3dDepthForRouteNode(nodeEl,state||(modal&&modal.__lpH1StudyState)||null);nodeEl.style.setProperty('--lp-3d-z',`${z}px`);const zRank=z>=100?58:(z>=76?46:(z>=35?28:16));if(!(nodeEl.classList&&(nodeEl.classList.contains('lp-dim')||nodeEl.classList.contains('is-filter-faded')))){nodeEl.style.zIndex=String(zRank);}});}catch(_){}}
function lpWebgl3dLocalCloudRank(loc,cur,level,coreSet){const key=lpCanonKey(loc);const curKey=lpCanonKey(cur);if(key&&curKey&&key===curKey)return-9999;const lv=Number(level&&level.get?level.get(normLoc(loc)):0)||0;const abs=Math.abs(lv);const isCore=!coreSet||!coreSet.has||coreSet.has(normLoc(loc));const relOnly=isCore?0:1;return relOnly*1000+abs*40+(lv<0?0:(lv>0?8:16))+lpWebgl3dHash01(key||loc)*0.9;}
function lpWebgl3dLocalCloudPoint(engine,loc,base,ordinal,total,cur,level,coreSet){const W=Math.max(1,Number(engine&&engine.W)||1);const H=Math.max(1,Number(engine&&engine.H)||1);const cx=W/2;const cy=H/2;const key=lpCanonKey(loc);const curKey=lpCanonKey(cur);if(key&&curKey&&key===curKey){return{x:cx,y:cy,z:205};}
const minDim=Math.max(420,Math.min(W,H));const lv=Number(level&&level.get?level.get(normLoc(loc)):0)||0;const absLv=Math.max(1,Math.abs(lv)||1);const isCore=!coreSet||!coreSet.has||coreSet.has(normLoc(loc));const n=Math.max(1,Number(total)||1);const i=Math.max(0,Number(ordinal)||0);const hash=lpWebgl3dHash01(`${curKey}|${key}|cloud`);const hash2=lpWebgl3dHash01(`${key}|${curKey}|height`);const hash3=lpWebgl3dHash01(`${key}|${curKey}|radius`);const dx0=(Number(base&&base.x)||cx)-cx;const dy0=(Number(base&&base.y)||cy)-cy;const oldAngle=Math.hypot(dx0,dy0)>18?Math.atan2(dy0,dx0):(hash*Math.PI*2);const golden=Math.PI*(3-Math.sqrt(5));const phase=(lpWebgl3dHash01(`${curKey}|local-cloud-phase`)-0.5)*Math.PI*0.35;const cloudAngle=-Math.PI/2+phase+i*golden;const theta=lpWebgl3dMixAngle(oldAngle,cloudAngle,0.68);const shell=Math.floor(i/Math.max(7,Math.ceil(Math.sqrt(n)*2.15)));const baseRadius=Math.max(210,Math.min(420,minDim*0.305));const levelStep=Math.max(48,Math.min(105,minDim*0.074));const shellStep=Math.max(78,Math.min(142,minDim*0.105));const relExtra=isCore?0:Math.max(74,minDim*0.082);const radius=baseRadius+(absLv-1)*levelStep+shell*shellStep+relExtra+(hash3-0.5)*42;const band=(i%7)-3;let elev=band*0.105+(hash2-0.5)*0.18;if(lv>0)elev+=0.13;else if(lv<0)elev-=0.13;if(!isCore)elev+=(hash<0.5?-0.18:0.18);elev=Math.max(-0.58,Math.min(0.58,elev));const flat=radius*Math.cos(elev);const yFlatten=0.84;const z=radius*Math.sin(elev);return{x:cx+Math.cos(theta)*flat,y:cy+Math.sin(theta)*flat*yFlatten,z:Math.max(-270,Math.min(270,z))};}
function lpWebgl3dCollectNodes(engine){const vp=engine.viewport;const kind=engine.kind;const list=[];const selector=kind==='route'?'.lp-node[data-lp-loc]':'a.lp-node[data-lp-loc]';const cur=(engine.ctx&&engine.ctx.cur)||currentRelPath();const level=engine.ctx&&engine.ctx.level;const coreSet=engine.ctx&&engine.ctx.coreSet;const state=engine.state||{};try{const elements=Array.from(vp.querySelectorAll(selector));const localRanks=new Map();if(kind==='local'){const curKey=lpCanonKey(cur);const byKey=new Map();elements.forEach((el)=>{const loc=normLoc(el.getAttribute('data-lp-loc')||'');const key=lpCanonKey(loc);if(key&&!byKey.has(key))byKey.set(key,{el,loc,key});});const baseLocs=Array.isArray(engine.ctx&&engine.ctx.baseNodes)?(engine.ctx.baseNodes||[]).map(normLoc).filter(Boolean):[];const baseKeys=new Set(baseLocs.map(lpCanonKey).filter(Boolean));const makeRanked=(items)=>(items||[]).map((item)=>Object.assign({},item,{rank:lpWebgl3dLocalCloudRank(item.loc,cur,level,coreSet)})).filter((item)=>item.loc).sort((a,b)=>a.rank-b.rank||String(a.key).localeCompare(String(b.key)));let baseRanked=[];let extraRanked=[];if(baseLocs.length){const seen=new Set();baseRanked=makeRanked(baseLocs.map((loc)=>{const key=lpCanonKey(loc);const hit=key?byKey.get(key):null;if(!hit||seen.has(key))return null;seen.add(key);return hit;}).filter(Boolean));extraRanked=makeRanked(Array.from(byKey.values()).filter((item)=>item.key&&!baseKeys.has(item.key)));}else{baseRanked=makeRanked(Array.from(byKey.values()));extraRanked=[];}
let ord=0;const baseTotal=Math.max(0,baseRanked.filter((item)=>!(item.key&&curKey&&item.key===curKey)).length);baseRanked.forEach((item)=>{if(item.key&&curKey&&item.key===curKey){localRanks.set(item.el,{ordinal:-1,total:baseTotal||1});}else{localRanks.set(item.el,{ordinal:ord++,total:baseTotal||1});}});let extraOrd=Math.max(0,ord);const extraTotal=Math.max(1,baseTotal+extraRanked.length);extraRanked.forEach((item)=>{if(item.key&&curKey&&item.key===curKey){localRanks.set(item.el,{ordinal:-1,total:baseTotal||1});}else{localRanks.set(item.el,{ordinal:extraOrd++,total:extraTotal});}});}
elements.forEach((el)=>{const loc=normLoc(el.getAttribute('data-lp-loc')||'');if(!loc)return;const base=lpWebgl3dNodeBaseFromElement(el);let x=base.x;let y=base.y;let z=kind==='route'?lp3dDepthForRouteNode(el,state):lp3dDepthForLocalNode(loc,cur,level,coreSet);if(kind==='local'){const rank=localRanks.get(el)||{ordinal:0,total:1};const cloud=lpWebgl3dLocalCloudPoint(engine,loc,base,rank.ordinal,rank.total,cur,level,coreSet);x=cloud.x;y=cloud.y;z=cloud.z;}
const visual=String(el.getAttribute('data-lp-visual')||'');const color=lpWebgl3dNodeColor(el,kind);list.push({loc,key:lpCanonKey(loc),el,x,y,z,visual,color});});}catch(_){}
return list;}
function lpWebgl3dCollectEdges(engine,nodeMap){const edges=[];const seen=new Set();const kind=engine.kind;if(kind==='route'){const path=lpGpsNormalizeRoutePath((engine.state&&engine.state.path)||[]);for(let i=0;i<path.length-1;i+=1){const from=normLoc(path[i]);const to=normLoc(path[i+1]);if(!nodeMap.has(lpCanonKey(from))||!nodeMap.has(lpCanonKey(to)))continue;edges.push({from,to,type:'route',seq:i});}
return edges;}
try{const paths=Array.from(engine.viewport.querySelectorAll('svg path.lp-edge[data-from][data-to]'));paths.forEach((p)=>{const from=normLoc(p.dataset.from||'');const to=normLoc(p.dataset.to||'');if(!from||!to)return;const fk=lpCanonKey(from),tk=lpCanonKey(to);if(!nodeMap.has(fk)||!nodeMap.has(tk))return;const type=String(p.dataset.type||'edge').toLowerCase();const key=`${fk}->${tk}:${type}`;if(seen.has(key))return;seen.add(key);edges.push({from,to,type});});}catch(_){}
return edges;}
function lpWebgl3dRebuild(engine){if(!engine||!engine.viewport||!engine.canvas)return;const size=lpWebgl3dViewportSize(engine);engine.W=size.W;engine.H=size.H;engine.camera=Math.max(900,Math.min(1900,Math.max(size.W,size.H)*1.24));const dpr=Math.max(1,Math.min(lpMapUsesMobileVisualScale()?1.35:2.0,Number(window.devicePixelRatio)||1));engine.dpr=dpr;engine.canvas.style.width=`${size.W}px`;engine.canvas.style.height=`${size.H}px`;const cw=Math.max(1,Math.round(size.W*dpr));const ch=Math.max(1,Math.round(size.H*dpr));if(engine.canvas.width!==cw)engine.canvas.width=cw;if(engine.canvas.height!==ch)engine.canvas.height=ch;const nodes=lpWebgl3dCollectNodes(engine);const nodeMap=new Map();nodes.forEach((n)=>{if(n.key)nodeMap.set(n.key,n);});const edges=lpWebgl3dCollectEdges(engine,nodeMap);engine.nodes=nodes;engine.nodeMap=nodeMap;engine.edges=edges;lpWebgl3dBindNodeEvents(engine);lpWebgl3dDraw(engine);}
function lpWebgl3dBindNodeEvents(engine){if(!engine||!Array.isArray(engine.nodes))return;if(engine.kind==='local')return;engine.nodes.forEach((n)=>{const el=n.el;if(!el||el.__lpWebgl3dBound)return;el.__lpWebgl3dBound=true;el.addEventListener('mouseenter',()=>{try{const e=engine.modal&&engine.modal.__lpWebgl3dEngine;if(!e)return;e.hoverKey=lpCanonKey(el.getAttribute('data-lp-loc')||'');el.classList.add('lp-webgl3d-hover');lpWebgl3dDraw(e);}catch(_){}});el.addEventListener('mouseleave',()=>{try{const e=engine.modal&&engine.modal.__lpWebgl3dEngine;if(!e)return;const k=lpCanonKey(el.getAttribute('data-lp-loc')||'');if(e.hoverKey===k)e.hoverKey='';el.classList.remove('lp-webgl3d-hover');lpWebgl3dDraw(e);}catch(_){}});});}
function lpWebgl3dBuildArrays(engine){const linePos=[];const lineCol=[];const lineSize=[];const nodePos=[];const nodeCol=[];const nodeSize=[];const W=Number(engine.W)||1;const H=Number(engine.H)||1;const cx=W/2,cy=H/2;const focusKey=lpWebgl3dAnyFocusKey(engine);const now=(performance&&performance.now)?performance.now():Date.now();const routeSig=engine.kind==='route'?(engine.edges||[]).map((e)=>`${lpCanonKey(e.from)}>${lpCanonKey(e.to)}`).join('|'):'';if(engine.kind==='route'&&routeSig&&engine.routeSig!==routeSig){engine.routeSig=routeSig;engine.routeAnimStart=now;}
const routeAnimAge=engine.routeAnimStart?(now-engine.routeAnimStart):999999;let routeAnimating=false;for(const e of(engine.edges||[])){const A=engine.nodeMap&&engine.nodeMap.get(lpCanonKey(e.from));const B=engine.nodeMap&&engine.nodeMap.get(lpCanonKey(e.to));if(!A||!B)continue;let alpha=0.38;let type=e.type;if(engine.kind==='route'){const delay=Math.max(0,Number(e.seq)||0)*760;const t=Math.max(0,Math.min(1,(routeAnimAge-delay)/520));alpha=0.18+0.78*t;routeAnimating=routeAnimating||(!engine.routeNavMode&&t<1);type='route';}else if(focusKey&&(A.key===focusKey||B.key===focusKey)){alpha=0.92;if(A.key===focusKey&&e.type!=='related')type='dependent';else if(B.key===focusKey&&e.type!=='related')type='prereq';}else if(focusKey){alpha=0.14;}
const col=lpWebgl3dEdgeColor(type,alpha,engine.kind);void col;}
for(const n of(engine.nodes||[])){const hi=lpWebgl3dNodeIsHighlighted(engine,n);let col=(n.color||[1,1,1,1]).slice();let size=n.el&&n.el.classList&&n.el.classList.contains('is-cur')?22:13.5;if(engine.kind==='route')size=n.el&&n.el.classList&&n.el.classList.contains('is-cur')?20:12.5;if(hi)size*=1.42;if(focusKey&&!hi)col[3]*=0.56;if(n.el&&n.el.getAttribute&&n.el.getAttribute('data-lp-rel-only')==='1'&&n.el.closest&&n.el.closest('#lp-map-modal[data-lp-rel-mode="dim"]'))col[3]*=0.56;nodePos.push(n.x-cx,cy-n.y,n.z||0);nodeCol.push(col[0],col[1],col[2],col[3]);nodeSize.push(size);}
engine.__routeAnimating=routeAnimating;return{linePos,lineCol,lineSize,nodePos,nodeCol,nodeSize};}
function lpWebgl3dLocalDimFilter(){try{if(!lpFogEnabled())return'';if(typeof __lpIsMobileMapModal==='function'&&__lpIsMobileMapModal())return'';return'blur(0.8px)';}catch(_){return'blur(0.8px)';}}
function lpWebgl3dRenderSvgOverlay(engine){if(!engine||!engine.viewport||!lpWebgl3dEnabled()){lpWebgl3dClearSvgOverlay(engine);return false;}
const svg=lpWebgl3dEnsureSvgOverlay(engine);if(!svg)return false;svg.innerHTML='';const ns=lpWebgl3dSvgNs();const defs=document.createElementNS(ns,'defs');const uid=`lp-webgl3d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;const markerColors={prereq:'rgb(16,185,129)',dependent:'rgb(96,165,250)',route:'rgb(255,255,255)',default:'rgb(255,255,255)'};Object.keys(markerColors).forEach((k)=>lpWebgl3dMakeArrowMarker(defs,`${uid}-${k}`,markerColors[k],k==='route'?0.86:1));svg.appendChild(defs);const projected=lpWebgl3dProjectedNodes(engine);const focusKey=lpWebgl3dAnyFocusKey(engine);const now=(performance&&performance.now)?performance.now():Date.now();const routeNavMode=!!(engine.kind==='route'&&engine.routeNavMode);const routeActiveSeq=Math.max(0,Number(engine.routeActiveSeq)||0);const routeActiveT=Math.max(0,Math.min(1,Number(engine.routeActiveT)||0));const routeVisibleThrough=Math.max(0,Number(engine.routeVisibleThrough)||0);const localMapAnimationsOn=engine.kind!=='local'||lpLocalMapAnimationsEnabled(engine.modal);let needRaf=false;for(let idx=0;idx<(engine.edges||[]).length;idx+=1){const e=engine.edges[idx];const A=projected.get(lpCanonKey(e.from));const B=projected.get(lpCanonKey(e.to));if(!A||!B)continue;const isRoute=engine.kind==='route';const routeSeq=Math.max(0,Number(e.seq)||0);let routeProgress=1;let routeCompleted=true;if(isRoute&&routeNavMode){if(routeSeq<routeVisibleThrough){routeProgress=1;routeCompleted=true;}else if(routeSeq===routeActiveSeq){routeProgress=routeActiveT;routeCompleted=routeProgress>=0.999;}else{continue;}}
let meta=isRoute?{type:'route',highlighted:true,related:false,alpha:0.92,fadedByFocus:false}:lpWebgl3dLocalEdgeType(engine,e,A,B,focusKey);const pad=isRoute?18:(meta.highlighted?14:9);const p1=lpWebgl3dClipPillEdge(A,B,pad);const p2=lpWebgl3dClipPillEdge(B,A,pad);const dist=Math.hypot(p2.x-p1.x,p2.y-p1.y);if(dist<8)continue;const seed=`${A.key}>${B.key}:${meta.type}:${idx}`;const side=lpWebgl3dHash01(seed)<0.5?-1:1;const bendBase=isRoute?(routeNavMode?0:20):(meta.related?18:14);const bend=routeNavMode&&isRoute?0:side*bendBase*Math.max(0.25,Math.min(1,dist/260));const d=lpWebgl3dCurvedD(p1,p2,bend);const color=lpWebgl3dCssColor(meta.type,meta.highlighted,meta.alpha,engine.kind);const cls=`lp-webgl3d-edge${meta.highlighted ? ' lp-webgl3d-hi-edge' : ''}${meta.related ? ' is-related' : ''}`;const strokeWidth=isRoute?2.55:(meta.highlighted?2.45:1.35);const markerKey=isRoute?'route':(meta.related?'':(meta.highlighted?(meta.type==='dependent'?'dependent':(meta.type==='prereq'?'prereq':'default')):'default'));const markerEnd=markerKey?`url(#${uid}-${markerKey})`:null;const pathOpacity=isRoute?'1':String(Math.max(0,Math.min(1,Number(meta.alpha)||0)));const dimFilter=(!isRoute&&!meta.highlighted)?lpWebgl3dLocalDimFilter():'';const path=lpWebgl3dAppendPath(svg,{class:cls,d,fill:'none',stroke:color,'stroke-width':strokeWidth,opacity:pathOpacity,style:dimFilter?`filter:${dimFilter}`:null,'marker-end':markerEnd});if(isRoute){if(routeNavMode){try{const len=path.getTotalLength();const t=Math.max(0,Math.min(1,routeProgress));if(!routeCompleted){path.style.strokeDasharray=String(len);path.style.strokeDashoffset=String(len*(1-t));path.removeAttribute('marker-end');lpWebgl3dAppendFlowArrow(svg,path,markerColors.route,Math.max(0.035,t),0.94);}else if(markerEnd){path.setAttribute('marker-end',markerEnd);}}catch(_){}}else{const delay=Math.max(0,Number(e.seq)||0)*760;const age=Math.max(0,now-(Number(engine.routeAnimStart)||now)-delay);const t=Math.max(0,Math.min(1,age/580));if(t<1){needRaf=true;try{const len=path.getTotalLength();path.style.strokeDasharray=String(len);path.style.strokeDashoffset=String(len*(1-t));path.removeAttribute('marker-end');lpWebgl3dAppendFlowArrow(svg,path,markerColors.route,Math.max(0.03,t),0.92);}catch(_){}}}}else if(meta.highlighted&&meta.related){try{path.removeAttribute('marker-end');path.style.strokeDasharray='6 6';if(localMapAnimationsOn){path.classList.add('lp-rel-anim');if(!Number.isFinite(Number(engine.__relDashT0)))engine.__relDashT0=now;const relPhase=(((now-(Number(engine.__relDashT0)||now))/1200)%1+1)%1;path.style.strokeDashoffset=String(-24*relPhase);path.style.animation='none';lpWebgl3dStartRelDash(engine);}else{path.classList.remove('lp-rel-anim');path.style.strokeDashoffset='0';path.style.animation='none';}}catch(_){}}else if(meta.highlighted){if(localMapAnimationsOn){const flowT=((now/1450)+lpWebgl3dHash01(seed))%1;lpWebgl3dAppendFlowArrow(svg,path,markerColors[markerKey||'default']||markerColors.default,flowT,0.92);needRaf=true;}}}
engine.__needsOverlayRaf=needRaf;return needRaf;}
function lpWebgl3dDraw(engine){if(!engine||!engine.canvas||!lpWebgl3dEnabled())return;if(!lpWebgl3dInitGl(engine))return;const gl=engine.gl;const prog=engine.program;const dpr=Number(engine.dpr)||1;gl.viewport(0,0,engine.canvas.width,engine.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(prog);gl.uniform1f(engine.uni.rx,(Number(engine.rx)||0)*Math.PI/180);gl.uniform1f(engine.uni.ry,(Number(engine.ry)||0)*Math.PI/180);gl.uniform1f(engine.uni.cx,(Number(engine.W)||1)/2);gl.uniform1f(engine.uni.cy,(Number(engine.H)||1)/2);gl.uniform1f(engine.uni.w,Number(engine.W)||1);gl.uniform1f(engine.uni.h,Number(engine.H)||1);gl.uniform1f(engine.uni.camera,Number(engine.camera)||LP_WEBGL3D_CAMERA);gl.uniform1f(engine.uni.pointBoost,dpr);const arr=lpWebgl3dBuildArrays(engine);lpWebgl3dUpdateLabels(engine);const overlayNeedsRaf=lpWebgl3dRenderSvgOverlay(engine);if(arr.linePos.length){lpWebgl3dUploadArray(gl,engine.attr.pos,engine.buffers.linePos,new Float32Array(arr.linePos),3);lpWebgl3dUploadArray(gl,engine.attr.color,engine.buffers.lineCol,new Float32Array(arr.lineCol),4);lpWebgl3dUploadArray(gl,engine.attr.size,engine.buffers.lineSize,new Float32Array(arr.lineSize),1);gl.uniform1i(engine.uni.isPoint,0);try{gl.lineWidth(lpMapUsesMobileVisualScale()?1:1.5);}catch(_){}
gl.drawArrays(gl.LINES,0,arr.linePos.length/3);}
if(engine.__routeAnimating||overlayNeedsRaf){if(!engine.__animRaf){engine.__animRaf=requestAnimationFrame(()=>{engine.__animRaf=0;lpWebgl3dDraw(engine);});}}}
function lpWebgl3dDrawMotionFrame(engine,now,forceFull){if(!engine)return;const stamp=Number(now)||((performance&&performance.now)?performance.now():Date.now());const last=Number(engine.__lpRouteOverlayFrameAt)||0;const full=!!forceFull||(stamp-last)>=32;if(full){engine.__lpRouteOverlayFrameAt=stamp;lpWebgl3dDraw(engine);return;}
try{lpWebgl3dUpdateLabels(engine);}catch(_){}}
function lpWebgl3dSetRotation(engine,rx,ry){if(!engine)return;engine.rx=lp3dClampNumber(rx,LP_3D_ROT_X_MIN,LP_3D_ROT_X_MAX,lp3dDefaultRot(engine.kind).rx);engine.ry=lp3dClampNumber(ry,LP_3D_ROT_Y_MIN,LP_3D_ROT_Y_MAX,lp3dDefaultRot(engine.kind).ry);if(engine.__lpRotationRaf)return;engine.__lpRotationRaf=requestAnimationFrame((now)=>{engine.__lpRotationRaf=0;lpWebgl3dDrawMotionFrame(engine,now,false);});}
function lpWebgl3dFlushRotation(engine){if(!engine)return;try{if(engine.__lpRotationRaf)cancelAnimationFrame(engine.__lpRotationRaf);}catch(_){}
engine.__lpRotationRaf=0;lpWebgl3dDrawMotionFrame(engine,lpLocalMapInteractionNow(),true);}
function lpWebgl3dBindCanvas(engine){if(!engine||!engine.canvas||engine.canvas.__lpWebgl3dPointerBound)return;const canvas=engine.canvas;canvas.__lpWebgl3dPointerBound=true;canvas.setAttribute('aria-label','Rotatable 3D knowledge map canvas');canvas.tabIndex=-1;let drag=null;const stop=(e)=>{try{if(e&&e.cancelable)e.preventDefault();if(e&&e.stopPropagation)e.stopPropagation();}catch(_){}};canvas.addEventListener('pointerdown',(e)=>{if(!engine.__observing||!engine.modal||engine.modal.__lpWebgl3dEngine!==engine)return;if(e&&e.button!=null&&e.button!==0)return;stop(e);lpMarkLocalMapInteractionBusy(360);const cur=engine.modal&&engine.modal.__lp3d?engine.modal.__lp3d:lp3dDefaultRot(engine.kind);drag={id:e.pointerId,x:Number(e.clientX)||0,y:Number(e.clientY)||0,rx:Number.isFinite(Number(cur.rx))?Number(cur.rx):lp3dDefaultRot(engine.kind).rx,ry:Number.isFinite(Number(cur.ry))?Number(cur.ry):lp3dDefaultRot(engine.kind).ry,};try{canvas.setPointerCapture(e.pointerId);}catch(_){}
try{engine.modal.classList.add('lp-webgl3d-dragging');}catch(_){}},true);canvas.addEventListener('pointermove',(e)=>{if(!drag||(e.pointerId!=null&&drag.id!==e.pointerId))return;if(e.buttons===0){end(e);return;}
stop(e);lpMarkLocalMapInteractionBusy(240);const dx=(Number(e.clientX)||0)-drag.x;const dy=(Number(e.clientY)||0)-drag.y;lp3dSetModalRotation(engine.modal,engine.kind,drag.rx-dy*0.22,drag.ry+dx*0.22);},true);const end=(e,flush=true)=>{if(!drag||(e&&e.pointerId!=null&&drag.id!==e.pointerId))return;stop(e);lpMarkLocalMapInteractionBusy(180);const id=drag.id;drag=null;try{canvas.releasePointerCapture(id);}catch(_){}
try{engine.modal.classList.remove('lp-webgl3d-dragging');}catch(_){}
if(flush){try{lpWebgl3dFlushRotation(engine);}catch(_){}}};canvas.addEventListener('pointerup',end,true);canvas.addEventListener('pointercancel',end,true);canvas.addEventListener('lostpointercapture',end,true);engine.__cancelPointerDrag=()=>end(null,false);}
function lpWebgl3dObserve(engine){if(!engine||!engine.viewport||engine.__observing)return;engine.__observing=true;let timer=0;let disposed=false;const schedule=()=>{if(disposed||timer)return;timer=window.setTimeout(()=>{timer=0;try{if(!disposed&&engine.modal&&engine.modal.__lpWebgl3dEngine===engine)lpWebgl3dRebuild(engine);}catch(_){}},80);};engine.__disposeLifecycle=()=>{if(disposed)return;disposed=true;try{if(engine.__cancelPointerDrag)engine.__cancelPointerDrag();}catch(_){}
if(timer)window.clearTimeout(timer);timer=0;try{if(engine.__mo)engine.__mo.disconnect();}catch(_){}
engine.__mo=null;['resize','orientationchange'].forEach((name)=>window.removeEventListener(name,schedule));['__animRaf','__lpRotationRaf','__relDashRaf','__lpRevealSyncRaf'].forEach((key)=>{try{if(engine[key])cancelAnimationFrame(engine[key]);}catch(_){}
engine[key]=0;});engine.__observing=false;engine.__schedule=null;};try{const mo=new MutationObserver((records)=>{const relevant=(records||[]).some((record)=>{const target=record&&record.target;if(target&&target.nodeType===1&&target.closest&&target.closest('.lp-webgl3d-overlay, .lp-map-presentation-svg'))return false;if(record&&record.type==='childList'){const changed=[...(record.addedNodes||[]),...(record.removedNodes||[])];if(changed.length&&changed.every(node=>node&&node.nodeType===1&&node.matches&&node.matches('svg.lp-map-presentation-svg')))return false;}
return true;});if(relevant)schedule();});mo.observe(engine.viewport,{childList:true,subtree:true,attributes:true,attributeFilter:['data-lp-visual','data-lp-unvisited','data-lp-rel-only','data-lp-loc']});engine.__mo=mo;}catch(_){}
['resize','orientationchange'].forEach((name)=>window.addEventListener(name,schedule,{passive:true}));engine.__schedule=schedule;}
function lpWebgl3dInstall(modal,kind,viewport,graph,ctx,state){if(!modal||!viewport)return false;lp3dInstallViewToggle(modal,kind==='route'?'route':'local');if(!lpWebgl3dEnabled()){lp3dClearModal3D(modal);return false;}
try{lpWebgl3dEnsureStyles();lp3dActivateModal(modal,kind==='route'?'route':'local');modal.classList.add('lp-webgl3d');let canvas=viewport.querySelector(':scope > canvas.lp-webgl3d-canvas');if(!canvas){canvas=document.createElement('canvas');canvas.className='lp-webgl3d-canvas';const firstSvg=viewport.querySelector('svg');if(firstSvg&&firstSvg.nextSibling)viewport.insertBefore(canvas,firstSvg.nextSibling);else viewport.insertBefore(canvas,viewport.firstChild||null);}
const old=modal.__lpWebgl3dEngine;const def=lp3dDefaultRot(kind==='route'?'route':'local');const rx=Number.isFinite(Number(modal.__lp3d&&modal.__lp3d.rx))?Number(modal.__lp3d.rx):def.rx;const ry=Number.isFinite(Number(modal.__lp3d&&modal.__lp3d.ry))?Number(modal.__lp3d.ry):def.ry;const engine=old&&old.canvas===canvas?old:{modal,canvas};if(old&&old!==engine&&typeof old.__disposeLifecycle==='function')old.__disposeLifecycle();engine.modal=modal;engine.viewport=viewport;engine.canvas=canvas;engine.kind=kind==='route'?'route':'local';engine.graph=graph||null;engine.ctx=ctx||{};engine.state=state||(modal&&modal.__lpH1StudyState)||null;engine.rx=rx;engine.ry=ry;engine.roll=Number.isFinite(Number(engine.roll))?Number(engine.roll):0;engine.panX=Number.isFinite(Number(engine.panX))?Number(engine.panX):0;engine.panY=Number.isFinite(Number(engine.panY))?Number(engine.panY):0;engine.hoverKey=engine.hoverKey||'';modal.__lpWebgl3dEngine=engine;canvas.__lpWebgl3dEngine=engine;lpWebgl3dBindCanvas(engine);lpWebgl3dObserve(engine);lpWebgl3dRebuild(engine);return true;}catch(err){try{console.warn('[learning-path] WebGL 3D map failed; falling back to HTML/SVG map.',err);}catch(_){}
return false;}}
function __mkInstallSharedJsonFetch(){try{if(typeof window.__mkFetchJsonShared==="function")return window.__mkFetchJsonShared;window.__mkFetchJsonShared=function(url,options){const key=String(url||"");if(!key)return Promise.resolve(null);if(!window.__mkSharedJsonPromiseMap)window.__mkSharedJsonPromiseMap=Object.create(null);const map=window.__mkSharedJsonPromiseMap;if(map[key])return map[key];const opts=Object.assign({credentials:"same-origin"},options||{});const p=fetch(key,opts).then((r)=>{if(!r||!r.ok)throw new Error(`Failed to fetch JSON: ${key}`);return r.json();}).catch((err)=>{try{delete map[key];}catch(_){}
throw err;});map[key]=p;return p;};return window.__mkFetchJsonShared;}catch(_){return function(url,options){return fetch(String(url||""),Object.assign({credentials:"same-origin"},options||{})).then((r)=>{if(!r||!r.ok)throw new Error(`Failed to fetch JSON: ${url}`);return r.json();});};}}
const __mkFetchJsonShared=__mkInstallSharedJsonFetch();function __mkRunIdle(task,timeoutMs){const fn=typeof task==="function"?task:function(){};const timeout=Math.max(0,Number(timeoutMs)||0);try{if(typeof window.requestIdleCallback==="function"){return window.requestIdleCallback(()=>{try{fn();}catch(_){}},timeout?{timeout}:undefined);}}catch(_){}
return window.setTimeout(()=>{try{fn();}catch(_){}},timeout?Math.min(timeout,180):120);}
function __lpIsPhoneTouch(){try{if(!window.matchMedia)return false;const coarse=window.matchMedia('(pointer: coarse)').matches;if(!coarse)return false;const isTablet=window.matchMedia('(min-width: 768px)').matches&&window.matchMedia('(min-height: 700px)').matches;return!isTablet;}catch(_){return false;}}
function __lpIsIPadLikeTouch(){try{const nav=navigator||{};const ua=String(nav.userAgent||"");const platform=String(nav.platform||"");const vendor=String(nav.vendor||"");const points=Number(nav.maxTouchPoints||0);if(/\biPad\b/i.test(ua))return true;if(/Apple/i.test(vendor)&&/Mac/i.test(platform)&&points>1)return true;}catch(_){}
return false;}
function getSiteRootUrl(){const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]');const attr=script?script.getAttribute("src"):(link?link.getAttribute("href"):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname;const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function normLoc(loc){return String(loc||"").split("#")[0].replace(/^\/+/g,"");}
function lpCanonKey(loc){const s0=normLoc(loc).replace(/\\/g,"/");if(!s0)return"";let s=s0.replace(/\/index\.html?$/i,"");s=s.replace(/\/+$/g,"");return s;}
function lpPairKey(a,b){const ca=lpCanonKey(a);const cb=lpCanonKey(b);const lo=ca<cb?ca:cb;const hi=ca<cb?cb:ca;return`${lo}||${hi}`;}
function currentRelPath(){const siteRoot=new URL(getSiteRootUrl());const rootPath=siteRoot.pathname.endsWith("/")?siteRoot.pathname:siteRoot.pathname+"/";let p=String(window.location.pathname||"");if(p.startsWith(rootPath))p=p.slice(rootPath.length);return p.replace(/^\/+/g,"");}
function isConceptPage(relPath){const p=String(relPath||"").toLowerCase();if(!p)return false;if(p.endsWith("/"))return false;if(!p.endsWith(".html"))return false;if(p==="index.html"||p.endsWith("/index.html"))return false;const segs=String(relPath||"").split("/").filter(Boolean);return segs.length>=2;}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function cleanTitle(s){return String(s||"").replaceAll("\u00B6","").replace(/\s+/g," ").trim();}
function toAbsoluteUrl(loc){const root=getSiteRootUrl();const cleanLoc=String(loc).replace(/^\//,"");return new URL(cleanLoc,root).toString().split("#")[0]+"#top";}
function toAbsolutePageUrl(loc){const root=getSiteRootUrl();const cleanLoc=String(loc).replace(/^\//,"");return new URL(cleanLoc,root).toString().split("#")[0];}
function lpResolveSiteHref(href,fallbackLoc){const loc=normLoc(fallbackLoc||"");if(loc&&isConceptPage(loc))return toAbsoluteUrl(loc);const raw=String(href||"").trim();if(!raw)return"";if(raw.startsWith("#"))return raw;try{const abs=new URL(raw,document.baseURI);const rel=urlToRelPath(abs.toString());if(rel&&isConceptPage(rel))return toAbsoluteUrl(rel);if(/^[a-z][a-z0-9+.-]*:/i.test(raw)||raw.startsWith("//")||raw.startsWith("/")){return abs.toString();}}catch(_){}
const clean=raw.replace(/^\/+/,"").replace(/^(?:\.\/)+/,"").replace(/^(?:\.\.\/)+/,"");if(clean&&isConceptPage(clean))return toAbsoluteUrl(clean);return raw;}
function lpNavHrefFromAnchor(a){if(!a)return"";try{const loc=(a.dataset&&a.dataset.lpLoc)?a.dataset.lpLoc:(a.getAttribute("data-lp-loc")||"");const raw=a.getAttribute("href")||a.href||"";return lpResolveSiteHref(raw,loc);}catch(_){return"";}}
function isSameOriginUrl(u){try{const url=new URL(u,document.baseURI);return url.origin===window.location.origin;}catch(_){return false;}}
function urlToRelPath(u){try{const siteRoot=new URL(getSiteRootUrl());const url=new URL(u,document.baseURI);if(url.origin!==siteRoot.origin)return null;const rootPath=siteRoot.pathname.endsWith("/")?siteRoot.pathname:siteRoot.pathname+"/";let p=url.pathname;if(p.startsWith(rootPath))p=p.slice(rootPath.length);return p.replace(/^\/+/g,"");}catch(_){return null;}}
function getPageTitleFromDom(){const h1=document.querySelector("article.md-content__inner h1");if(!h1)return"";try{const html=__lpSanitizeRenderedMathHtml(String(lpExtractRenderableTitleHtmlFromHeading(h1)||'').trim());if(html){const txt=__lpTitleHtmlToText(html);if(txt)return txt;}}catch(_){}
return cleanTitle(h1.textContent||"");}
function getPageTitleHtmlFromDom(){const h1=document.querySelector("article.md-content__inner h1");return h1?__lpSanitizeRenderedMathHtml(lpExtractRenderableTitleHtmlFromHeading(h1)):"";}
function lpPanelStatusIcon(loc,rec,fallbackM){const m=(rec&&typeof rec.m==="number")?rec.m:(typeof fallbackM==="number"?fallbackM:null);if(m===0||m===1||m===2||m===3){return{state:`m${m}`,icon:lpMasteryIcon(m),label:`Mastery level: ${lpMasteryLevelLabel(m)}`};}
if(lpWasVisited(loc)){return{state:"viewed-unrated",icon:lpMasterySvg("eye-outline",18),label:"Viewed but not rated"};}
return{state:"not-viewed",icon:lpMasterySvg("eye-off-outline",18),label:"Not viewed"};}
function masteryScore(m){if(m===0)return 100;if(m===1)return 40;if(m===2)return 10;if(m===3)return 0;return 25;}
function masteryReady(m,rec){try{if(rec&&window.ConceptMastery&&typeof window.ConceptMastery.readinessValueFromRecord==="function"){return Math.max(0,Math.min(1,Number(window.ConceptMastery.readinessValueFromRecord(rec))||0));}}catch(_){}
if(m===3||m===2)return 1;if(m===1)return 0.5;if(m===0)return 0;return 0;}
let __lpMasteryCacheSignature=null;let __lpMasteryCacheAll=null;let __lpMasteryRecordCache=new Map();let __lpMasterySignatureReadAt=Number.NEGATIVE_INFINITY;let __lpMasterySignatureValue='';let __lpMasteryCanonIndex=null;function lpInvalidateMasteryCache(){__lpMasteryCacheSignature=null;__lpMasteryCacheAll=null;__lpMasteryRecordCache=new Map();__lpMasterySignatureReadAt=Number.NEGATIVE_INFINITY;__lpMasteryCanonIndex=null;}
function lpMasteryCanonIndex(all){if(__lpMasteryCanonIndex)return __lpMasteryCanonIndex;const index=new Map();try{Object.keys(all||{}).forEach((storedKey)=>{const canon=lpCanonKey(storedKey);if(!canon||index.has(canon))return;index.set(canon,all[storedKey]);});}catch(_){}
__lpMasteryCanonIndex=index;return index;}
function lpReadMasteryAllCached(){if(!window.ConceptMastery||typeof window.ConceptMastery._readAll!=="function")return null;const sig=lpCurrentMasterySignature();if(__lpMasteryCacheAll&&__lpMasteryCacheSignature===sig)return __lpMasteryCacheAll;let all=null;try{all=window.ConceptMastery._readAll()||{};}catch(_){all=null;}
if(!all||typeof all!=="object"||Array.isArray(all))return null;__lpMasteryCacheSignature=sig;__lpMasteryCacheAll=all;__lpMasteryRecordCache=new Map();__lpMasteryCanonIndex=null;return all;}
function getMastery(loc){if(!window.ConceptMastery)return null;const key=normLoc(loc);if(!key)return null;const all=lpReadMasteryAllCached();if(all){if(__lpMasteryRecordCache.has(key))return __lpMasteryRecordCache.get(key);let raw=all[key]||all[key.replace(/\/+$/,"")]||null;if(!raw){const canon=lpCanonKey(key);if(canon)raw=lpMasteryCanonIndex(all).get(canon)||null;}
const rec=raw?(typeof window.ConceptMastery._normaliseRecord==="function"?window.ConceptMastery._normaliseRecord(raw):raw):null;__lpMasteryRecordCache.set(key,rec);return rec;}
return window.ConceptMastery.get(key);}
function lpCurrentMasterySignature(){try{const now=Date.now();if(now-__lpMasterySignatureReadAt<16)return __lpMasterySignatureValue;__lpMasterySignatureValue=String(localStorage.getItem(MASTERY_KEY)||"");__lpMasterySignatureReadAt=now;return __lpMasterySignatureValue;}catch(_){return"";}}
function lpWasVisited(loc){const rec=getMastery(loc);if(!rec)return false;return!!(rec.visited||(Number(rec.visitCount)||0)>0||(Number(rec.viewCount)||0)>0||(Number(rec.lastViewed)||0)>0||(Number(rec.lastReviewed)||0)>0||(Array.isArray(rec.history)&&rec.history.length>0));}
try{if(!window.__lpMasteryCacheInvalidationInstalled){window.__lpMasteryCacheInvalidationInstalled=true;window.addEventListener("conceptMasteryChanged",lpInvalidateMasteryCache);window.addEventListener("storage",(e)=>{try{if(e&&(e.key===MASTERY_KEY||e.key===null))lpInvalidateMasteryCache();}catch(_){}});}}catch(_){}
function lpMasteryPercentForLoc(loc){const rec=getMastery(loc);if(!rec)return-1;const counts=(rec&&rec.counts&&typeof rec.counts==="object")?rec.counts:{};const full=Number(counts.full)||0;const know=Number(counts.know)||0;const fuzzy=Number(counts.fuzzy)||0;const dont=Number(counts.dont)||0;const total=Math.max(Number(rec.reviewCount)||0,full+know+fuzzy+dont);if(total>0){return((full*100)+(know*75)+(fuzzy*40)+(dont*10))/total;}
const m=(rec&&typeof rec.m==="number")?rec.m:null;if(m===3)return 100;if(m===2)return 75;if(m===1)return 40;if(m===0)return 10;return lpWasVisited(loc)?40:0;}
function lpSharedRevealHas(loc){try{const key=lpCanonKey(loc);return!!(key&&lpSharedRevealSet().has(key));}catch(_){return false;}}
function lpSharedRevealAdd(loc){try{const key=lpCanonKey(loc);if(!key)return false;const set=lpSharedRevealSet();const had=set.has(key);set.add(key);try{window.dispatchEvent(new CustomEvent('lp:shared-reveal-change',{detail:{key,added:!had}}));}catch(_){}
return!had;}catch(_){return false;}}
function lpEnsureRevealState(loc,title){const sess=lpEnsureRevealSession();const key=normLoc(loc);const nextTitle=String(title||"");let st=sess.states.get(key);if(!st||st.title!==nextTitle){const parts=lpSplitRevealTitle(nextTitle);const units=lpBuildRevealUnits(parts);st={key,title:nextTitle,parts,units,order:lpShuffleInPlace(units.map((_,idx)=>idx)),revealed:lpSharedRevealHas(key)?new Set(units.map((_,idx)=>idx)):new Set(),timerId:0,running:false,navigateOnDone:false,};sess.states.set(key,st);}
return st;}
function lpLimitDependentsForMap(graph,loc){const deps=uniq(getDependents(graph,loc));if(deps.length<=10)return deps;const cacheRoot=(window.__lpDependentPickCache=window.__lpDependentPickCache||new Map());const depSignature=deps.slice().map(normLoc).sort().join("|");const cacheKey=`${normLoc(loc)}::${depSignature}`;const cached=cacheRoot.get(cacheKey);if(Array.isArray(cached)&&cached.length)return cached.slice();const buckets=new Map();for(const d of deps){const pct=Number(lpMasteryPercentForLoc(d));const key=Number.isFinite(pct)?pct:0;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(d);}
const orderedPcts=Array.from(buckets.keys()).sort((a,b)=>a-b);const picked=[];for(const pct of orderedPcts){const bucket=lpShuffleInPlace((buckets.get(pct)||[]).slice());for(const dep of bucket){picked.push(dep);if(picked.length>=10)break;}
if(picked.length>=10)break;}
cacheRoot.set(cacheKey,picked.slice());return picked;}
function lpMapVisualForLoc(loc){const rec=getMastery(loc);const visited=lpWasVisited(loc);const m=(rec&&typeof rec.m==="number")?rec.m:null;const hasMastery=lpHasExplicitMastery(rec,m);const seen=!!(visited||hasMastery);const fogOn=lpFogEnabled();if(!fogOn){if(m===3)return{key:"mastered",blurPx:0,hideTitle:false,fog:false,visited:seen,mastered:true,know:false};if(m===2)return{key:"know",blurPx:0,hideTitle:false,fog:false,visited:seen,mastered:false,know:true};if(m===1)return{key:"fuzzy",blurPx:0.45,hideTitle:false,fog:false,visited:seen,mastered:false,know:false};if(m===0)return{key:"dont",blurPx:0.75,hideTitle:false,fog:false,visited:seen,mastered:false,know:false};return{key:seen?"not-rated":"seen",blurPx:0,hideTitle:false,fog:false,visited:seen,mastered:false,know:false};}
if(!seen){return{key:"unvisited",blurPx:1.35,hideTitle:true,fog:true,visited:false,mastered:false,know:false};}
if(m===3)return{key:"mastered",blurPx:0,hideTitle:false,fog:false,visited:true,mastered:true,know:false};if(m===2)return{key:"know",blurPx:0,hideTitle:false,fog:false,visited:true,mastered:false,know:true};if(m===1)return{key:"fuzzy",blurPx:0.45,hideTitle:false,fog:false,visited:true,mastered:false,know:false};if(m===0)return{key:"dont",blurPx:0.75,hideTitle:false,fog:false,visited:true,mastered:false,know:false};return{key:"not-rated",blurPx:0,hideTitle:false,fog:false,visited:true,mastered:false,know:false};}
async function loadGraph(){const root=getSiteRootUrl();const url=new URL(GRAPH_URL,root).toString();const graph=await __mkFetchJsonShared(url).catch(()=>null);if(!graph)throw new Error("failed to load graph");return graph;}
async function typesetMathSafe(elements){try{const els=(elements||[]).filter(Boolean);if(!els.length)return;const needsTypeset=(el)=>{try{if(!el)return false;const pendingSelector='script[type^="math/tex"], script[type^="math/asciimath"], [data-lp-pending-math="1"], .arithmatex';if(el.matches&&el.matches(pendingSelector))return true;if(el.querySelector&&el.querySelector(pendingSelector))return true;const raw=String((el.getAttribute&&(el.getAttribute("data-lp-raw-title")||el.getAttribute("data-tex")||el.getAttribute("data-latex")||el.getAttribute("data-math")))||"");if(lpHasMathMarkup(raw))return true;const text=String(el.textContent||"");if(lpHasMathMarkup(text))return true;const html=String(el.innerHTML||"");return lpHasMathMarkup(html)&&!/<(?:mjx-container|math)\b|class=["'][^"']*(?:katex|MathJax)/i.test(html);}catch(_){return true;}};const targets=els.filter(needsTypeset);if(!targets.length)return;if(window.__mkRenderDynamicMathAsync){await window.__mkRenderDynamicMathAsync(targets).catch(()=>{});return;}
if(window.__mkRenderDynamicMath){await Promise.resolve(window.__mkRenderDynamicMath(targets)).catch(()=>{});return;}
if(window.MathJax&&typeof window.MathJax.typesetPromise==="function"){const sp=window.MathJax.startup&&window.MathJax.startup.promise;if(sp&&typeof sp.then==="function")await sp;await window.MathJax.typesetPromise(targets).catch(()=>{});}}catch(_){}}
function lpCacheTitleElement(graphRef,titleEl){try{if(!titleEl)return;const loc=titleEl.getAttribute&&titleEl.getAttribute('data-lp-title-loc')?normLoc(titleEl.getAttribute('data-lp-title-loc')||''):normLoc((titleEl.closest&&titleEl.closest('[data-lp-loc]')&&titleEl.closest('[data-lp-loc]').getAttribute('data-lp-loc'))||'');if(!loc)return;const html=__lpSanitizeRenderedMathHtml(String(titleEl.innerHTML||'').trim());const rawTitle=String((titleEl.getAttribute&&titleEl.getAttribute('data-lp-raw-title'))||'').trim();const text=lpTitleTextForCache(titleEl,html);if(html)__lpSetTitleHtmlCache(graphRef||graph,loc,html,true);if(text){__lpSetTitleCache(graphRef||graph,loc,text,true);if(!(rawTitle&&lpHasMathMarkup(rawTitle))){__lpForceGraphNodeTitle(graphRef||graph,loc,text);}}}catch(_){}}
async function lpTypesetTitleElements(graphRef,root){try{const host=root&&root.querySelectorAll?root:null;if(!host)return;const els=Array.from(host.querySelectorAll('.lp-name, .lp-node-title, .lp-h1-route-target-text')).filter((el)=>lpNodeTitleNeedsTypeset(el));if(!els.length)return;await typesetMathSafe(els);els.forEach((el)=>{try{lpDeduplicateRenderedMathInTitleEl(el);}catch(_){}});els.forEach((el)=>lpCacheTitleElement(graphRef||graph,el));}catch(_){}}
function lpRebuildTitleElFromRawMath(titleEl){try{if(!titleEl||!titleEl.querySelectorAll)return false;const rawTitle=String((titleEl.getAttribute&&titleEl.getAttribute('data-lp-raw-title'))||'').trim();if(!rawTitle||!lpHasMathMarkup(rawTitle))return false;const parts=lpSplitInlineMathParts(rawTitle);if(!Array.isArray(parts)||!parts.some((part)=>part&&part.type==='math'))return false;const renderedNodes=[];let prevRoot=null;let prevSig='';Array.from(titleEl.querySelectorAll('mjx-container, .MathJax, math, .katex')).forEach((node)=>{try{const sig=`${String(node.tagName || '').toLowerCase()}|${cleanTitle(node.textContent || '')}`;if(!sig)return;if(prevRoot&&sig===prevSig){let p=node.previousSibling;while(p&&p.nodeType===3&&!String(p.textContent||'').trim())p=p.previousSibling;const adjacentCopy=(p===prevRoot)||!!(prevRoot.contains&&prevRoot.contains(node));if(adjacentCopy){prevRoot=node;prevSig=sig;return;}}
renderedNodes.push(node.cloneNode(true));prevRoot=node;prevSig=sig;}catch(_){}});if(!renderedNodes.length)return false;while(titleEl.firstChild)titleEl.removeChild(titleEl.firstChild);let mathIdx=0;parts.forEach((part)=>{if(!part)return;if(part.type==='text'){const txt=String(part.text||'');if(txt)titleEl.appendChild(document.createTextNode(txt));return;}
const rendered=renderedNodes[mathIdx++]||null;if(rendered)titleEl.appendChild(rendered);});return mathIdx>0;}catch(_){return false;}}
function lpTitleTextForCache(titleEl,sanitizedHtml){try{const html=String(sanitizedHtml||'').trim();const rawTitle=String((titleEl&&titleEl.getAttribute&&titleEl.getAttribute('data-lp-raw-title'))||'').trim();if(rawTitle&&lpHasMathMarkup(rawTitle))return cleanTitle(rawTitle);if(html&&/<(?:mjx-container|math)\b|class=["\'][^"\']*katex/i.test(html)){const txt=__lpTitleHtmlToText(html);if(txt)return txt;}}catch(_){}
return cleanTitle((titleEl&&titleEl.textContent)||'');}
function lpDeduplicateRenderedMathInTitleEl(titleEl){try{if(!titleEl)return;const rebuilt=lpRebuildTitleElFromRawMath(titleEl);const raw=String(titleEl.innerHTML||'').trim();if(!raw)return;try{const mathEls=Array.from(titleEl.querySelectorAll('mjx-container, .MathJax, math, .katex'));if(mathEls.length>1){const sigOf=(el)=>String(el.tagName||'').toLowerCase()+'|'+cleanTitle(el.textContent||'');const isMathEl=(el)=>!!(el&&el.matches&&el.matches('mjx-container, .MathJax, math, .katex'));mathEls.forEach((el)=>{if(!el.isConnected)return;let prev=el.previousSibling;while(prev&&prev.nodeType===3&&!String(prev.textContent||'').trim())prev=prev.previousSibling;if(prev&&prev.nodeType===1&&isMathEl(prev)&&sigOf(prev)===sigOf(el)){try{el.remove();}catch(_){}}});}}catch(_){}
try{const fullText=String(titleEl.textContent||'').trim();const half=Math.floor(fullText.length/2);if(half>0){const firstHalf=fullText.slice(0,half).trim();const secondHalf=fullText.slice(half).trim();if(firstHalf&&secondHalf&&firstHalf===secondHalf){const rawTitle=String((titleEl.getAttribute&&titleEl.getAttribute('data-lp-raw-title'))||'').trim();if(rawTitle){const rebuilt2=lpRebuildTitleElFromRawMath(titleEl);if(!rebuilt2){titleEl.textContent=firstHalf;}}}}}catch(_){}
const afterDedup=String(titleEl.innerHTML||'').trim();const cleaned=__lpSanitizeRenderedMathHtml(afterDedup);if(cleaned&&cleaned!==afterDedup)titleEl.innerHTML=cleaned;else if(rebuilt&&cleaned)titleEl.innerHTML=cleaned;}catch(_){}}
function lpCacheRenderedNodeTitle(graphRef,nodeEl){try{const host=nodeEl&&nodeEl.closest?nodeEl.closest('.lp-node[data-lp-loc]'):null;const loc=host&&host.dataset?normLoc(host.dataset.lpLoc||""):"";const titleEl=host&&host.querySelector?host.querySelector('.lp-node-title'):null;if(!loc||!titleEl)return;const html=__lpSanitizeRenderedMathHtml(String(titleEl.innerHTML||"").trim());const rawTitle=String((titleEl.getAttribute&&titleEl.getAttribute('data-lp-raw-title'))||'').trim();const text=lpTitleTextForCache(titleEl,html);if(html)__lpSetTitleHtmlCache(graphRef||graph,loc,html,true);if(text){__lpSetTitleCache(graphRef||graph,loc,text,true);if(!(rawTitle&&lpHasMathMarkup(rawTitle))){__lpForceGraphNodeTitle(graphRef||graph,loc,text);}}}catch(_){}}
const __lpTitleTypesetQueues=new WeakMap();function lpQueueTitleTypeset(el){if(!el)return Promise.resolve();const prev=__lpTitleTypesetQueues.get(el)||Promise.resolve();const next=prev.catch(()=>{}).then(()=>typesetMathSafe([el])).catch(()=>{});__lpTitleTypesetQueues.set(el,next);return next;}
function lpMaybeTypesetNodeTitleEl(nodeEl){try{const titleEl=nodeEl&&nodeEl.querySelector?nodeEl.querySelector('.lp-node-title'):null;if(!titleEl)return Promise.resolve();if(!lpNodeTitleNeedsTypeset(titleEl)){lpSetNodeTitleMathPending(nodeEl,false);return Promise.resolve();}
lpSetNodeTitleMathPending(nodeEl,true);return lpQueueTitleTypeset(titleEl).then(()=>{try{lpDeduplicateRenderedMathInTitleEl(titleEl);}catch(_){}
lpSetNodeTitleMathPending(nodeEl,false);try{lpCacheRenderedNodeTitle(graph,nodeEl);}catch(_){}}).catch(()=>{lpSetNodeTitleMathPending(nodeEl,false);});}catch(_){return Promise.resolve();}}
const __lpNodeTitleTypesetQueue=new Set();let __lpNodeTitleTypesetDraining=false;function lpMapGestureActive(){try{const roots=[document.getElementById("lp-map-modal"),document.getElementById("lp-h1sg-modal")];for(const root of roots){if(!root||!root.classList||!root.classList.contains("lp-open"))continue;if(lpLocalMapPointerHeld())return true;if(root.classList.contains("lp-map-dragging")||root.classList.contains("lp-slider-zooming")||root.classList.contains("lp-mobile-gesturing")||root.classList.contains("lp-webgl3d-dragging")||root.classList.contains("lp-route-animating"))return true;const state=window.__lpMapState;if(state&&state.__lpZoomDragging)return true;}
return false;}catch(_){return false;}}
function lpRunWhenMapGestureIdle(key,fn){try{if(typeof fn!=="function")return;const modal=document.getElementById("lp-map-modal");if(!modal)return;if(!lpMapGestureActive()){fn();return;}
const pendingKey="__lpDeferredPending_"+key;const timerKey="__lpDeferredTimer_"+key;modal[pendingKey]=fn;if(modal[timerKey])return;const retry=()=>{const live=document.getElementById("lp-map-modal");if(!live)return;live[timerKey]=0;if(!live.classList.contains("lp-open")){live[pendingKey]=null;return;}
if(lpMapGestureActive()){live[timerKey]=window.setTimeout(retry,120);return;}
const pending=live[pendingKey];live[pendingKey]=null;if(typeof pending==="function"){try{pending();}catch(_){}}};modal[timerKey]=window.setTimeout(retry,120);}catch(_){}}
function lpQueueNodeTitleTypeset(nodeEl){try{if(!nodeEl)return;const titleEl=nodeEl.querySelector?nodeEl.querySelector(".lp-node-title"):null;if(!titleEl)return;if(!lpNodeTitleNeedsTypeset(titleEl)){lpSetNodeTitleMathPending(nodeEl,false);return;}
lpSetNodeTitleMathPending(nodeEl,true);__lpNodeTitleTypesetQueue.add(nodeEl);lpDrainNodeTitleTypesetQueue();}catch(_){}}
function lpDrainNodeTitleTypesetQueue(){if(__lpNodeTitleTypesetDraining||!__lpNodeTitleTypesetQueue.size)return;__lpNodeTitleTypesetDraining=true;const step=function(){if(lpMapGestureActive()){window.setTimeout(step,90);return;}
const batch=[];for(const el of __lpNodeTitleTypesetQueue){__lpNodeTitleTypesetQueue.delete(el);if(el&&el.isConnected)batch.push(el);if(batch.length>=4)break;}
if(!batch.length){__lpNodeTitleTypesetDraining=false;if(__lpNodeTitleTypesetQueue.size)lpDrainNodeTitleTypesetQueue();return;}
Promise.all(batch.map((el)=>lpMaybeTypesetNodeTitleEl(el))).catch(()=>{}).then(()=>{if(!__lpNodeTitleTypesetQueue.size){__lpNodeTitleTypesetDraining=false;return;}
window.setTimeout(step,0);});};step();}
function saveNavContext(ctx){try{sessionStorage.setItem(LP_NAV_CTX_KEY,JSON.stringify(ctx));}catch(_){}}
function lpGpsNormalizeRoutePath(path){const out=[];const seen=new Set();for(const raw of(Array.isArray(path)?path:[])){const loc=normLoc(raw);if(!loc||!isConceptPage(loc))continue;const key=lpCanonKey(loc);if(seen.has(key))continue;seen.add(key);out.push(loc);}
return out;}
function lpGpsReadRouteState(){try{const raw=sessionStorage.getItem(LP_GPS_ROUTE_KEY);if(!raw)return null;const obj=JSON.parse(raw);if(!obj||!obj.ts)return null;if((Date.now()-Number(obj.ts))>LP_GPS_ROUTE_TTL_MS){sessionStorage.removeItem(LP_GPS_ROUTE_KEY);return null;}
const path=lpGpsNormalizeRoutePath(obj.path);if(!path.length)return null;const target=normLoc(obj.target||path[path.length-1]||'');let currentIndex=Number.isFinite(Number(obj.currentIndex))?Number(obj.currentIndex):0;currentIndex=Math.max(0,Math.min(path.length-1,currentIndex));return{ts:Number(obj.ts)||Date.now(),target,path,currentIndex,currentLoc:normLoc(obj.currentLoc||path[currentIndex]||''),completed:!!obj.completed};}catch(_){return null;}}
function lpGpsWriteRouteState(state){try{if(!state){sessionStorage.removeItem(LP_GPS_ROUTE_KEY);return;}
const path=lpGpsNormalizeRoutePath(state.path);if(!path.length){sessionStorage.removeItem(LP_GPS_ROUTE_KEY);return;}
let currentIndex=Number.isFinite(Number(state.currentIndex))?Number(state.currentIndex):0;currentIndex=Math.max(0,Math.min(path.length-1,currentIndex));const payload={ts:Date.now(),target:normLoc(state.target||path[path.length-1]||''),path,currentIndex,currentLoc:normLoc(state.currentLoc||path[currentIndex]||''),completed:!!state.completed};sessionStorage.setItem(LP_GPS_ROUTE_KEY,JSON.stringify(payload));}catch(_){}}
function lpGpsReadRouteTicket(){try{const raw=sessionStorage.getItem(LP_GPS_ROUTE_TICKET_KEY);if(!raw)return null;const obj=JSON.parse(raw);if(!obj||!obj.ts)return null;if((Date.now()-Number(obj.ts))>LP_GPS_ROUTE_TICKET_TTL_MS){sessionStorage.removeItem(LP_GPS_ROUTE_TICKET_KEY);return null;}
const to=normLoc(obj.to||'');if(!to)return null;return{ts:Number(obj.ts)||0,to};}catch(_){return null;}}
function lpGpsWriteRouteTicket(loc){try{const to=normLoc(loc||'');if(!to){sessionStorage.removeItem(LP_GPS_ROUTE_TICKET_KEY);return;}
sessionStorage.setItem(LP_GPS_ROUTE_TICKET_KEY,JSON.stringify({ts:Date.now(),to}));}catch(_){}}
function lpGpsValidateRouteEntryForPage(currentLoc){const state=lpGpsReadRouteState();if(!state)return null;const cur=normLoc(currentLoc||currentRelPath());if(!cur)return state;const navType=lpGpsNavigationType();if(navType==='reload')return state;const ticket=lpGpsReadRouteTicket();if(ticket&&lpCanonKey(ticket.to)===lpCanonKey(cur))return state;lpGpsClearRouteState();return null;}
function lpGpsClearPlanCache(targetLoc){const target=normLoc(targetLoc||currentRelPath());const memKey=`${currentRelPath()}::${lpCanonKey(target)}`;try{if(window.__lpGpsPlanMem&&Object.prototype.hasOwnProperty.call(window.__lpGpsPlanMem,memKey)){delete window.__lpGpsPlanMem[memKey];}}catch(_){}}
function lpGpsRerollPlan(targetLoc){lpGpsClearRouteState();lpGpsClearPlanCache(targetLoc);}
function lpGpsRouteIndexForLoc(state,loc){if(!state||!Array.isArray(state.path))return-1;const key=lpCanonKey(loc);if(!key)return-1;return state.path.findIndex((it)=>lpCanonKey(it)===key);}
function lpGpsSyncRouteStateForPage(currentLoc){const state=lpGpsReadRouteState();if(!state)return null;const cur=normLoc(currentLoc||currentRelPath());if(!cur)return state;const idx=lpGpsRouteIndexForLoc(state,cur);if(idx<0)return state;const done=idx===(state.path.length-1)&&lpCanonKey(cur)===lpCanonKey(state.target);if(state.currentIndex!==idx||state.currentLoc!==cur||state.completed!==done){state.currentIndex=idx;state.currentLoc=cur;state.completed=done;lpGpsWriteRouteState(state);}
return state;}
function lpGpsBuildRouteStateFromPlan(plan,startIndex){const steps=plan&&Array.isArray(plan.steps)?plan.steps:[];const path=lpGpsNormalizeRoutePath(steps.map((step)=>step&&step.loc));if(!path.length)return null;let idx=Number.isFinite(Number(startIndex))?Number(startIndex):0;idx=Math.max(0,Math.min(path.length-1,idx));return{target:normLoc((plan&&plan.target)||path[path.length-1]||''),path,currentIndex:idx,currentLoc:path[idx]||'',completed:idx===path.length-1&&lpCanonKey(path[idx])===lpCanonKey((plan&&plan.target)||path[path.length-1]||'')};}
function lpGpsOpenStepFromPlan(plan,stepIndex){const state=lpGpsBuildRouteStateFromPlan(plan,stepIndex);if(!state||!state.path.length)return;lpGpsWriteRouteState(state);hideKnowledgeGpsModal();const dest=state.path[state.currentIndex]||state.target;try{const destAbs=toAbsoluteUrl(dest);const curAbs=window.location.href.split('#')[0];const destAbs0=destAbs.split('#')[0];if(curAbs===destAbs0){window.location.replace(destAbs);return;}}catch(_){}
lpNavigate(toAbsoluteUrl(dest),dest,{keepGpsRoute:true});}
function lpGpsNavigateActiveRouteTo(stepIndex){const state=lpGpsReadRouteState();if(!state||!state.path.length)return;let idx=Number.isFinite(Number(stepIndex))?Number(stepIndex):state.currentIndex;idx=Math.max(0,Math.min(state.path.length-1,idx));state.currentIndex=idx;state.currentLoc=state.path[idx]||'';state.completed=idx===state.path.length-1&&lpCanonKey(state.currentLoc)===lpCanonKey(state.target);lpGpsWriteRouteState(state);lpNavigate(toAbsoluteUrl(state.currentLoc),state.currentLoc,{keepGpsRoute:true});}
function lpGpsActiveTargetForPage(currentLoc){const state=lpGpsSyncRouteStateForPage(currentLoc);const cur=normLoc(currentLoc||currentRelPath());if(!state||!cur)return cur;return lpGpsRouteIndexForLoc(state,cur)>=0?normLoc(state.target||cur):cur;}
function installPanelClickHardFix(){if(window.__lpPanelHardFixV2)return;window.__lpPanelHardFixV2=true;function handle(e){try{if(!e)return;const target=e.target&&e.target.closest?e.target:null;if(!target)return;const inPanel=target.closest("#lp-side-panel");const inModal=target.closest("#lp-map-modal");if(!inPanel&&!inModal)return;if("button"in e&&e.button!==0)return;if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const openBtn=target.closest("#lp-side-panel [data-lp-open-map]");if(openBtn){e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();const modal=document.getElementById("lp-map-modal");if(modal&&typeof modal.__lpOpen==="function")modal.__lpOpen();lpRecordXpActivity("map_open",{source:"learning-path-panel-open-map",eventName:"data-lp-open-map"});try{document.dispatchEvent(new CustomEvent("mk:map-opened",{detail:{source:"learning-path-panel-open-map"}}));}catch(_){}
return;}
const gpsBtn=target.closest("#lp-side-panel [data-lp-open-gps]");if(gpsBtn){e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();const targetLoc=lpGpsActiveTargetForPage(gpsBtn.getAttribute('data-lp-target')||(inPanel&&inPanel.dataset?inPanel.dataset.lpCurrentLoc:'')||currentRelPath());const gpsModal=document.getElementById("lp-gps-modal");if(gpsModal&&typeof gpsModal.__lpOpen==="function")gpsModal.__lpOpen(targetLoc);else if(typeof showKnowledgeGpsModal==='function')showKnowledgeGpsModal(window.__lpLearningPathGraph,targetLoc);return;}
const isMobileUi=lpIsMobileSheet();if(isMobileUi&&inPanel)return;const a=target.closest('a.lp-row[href], #lp-map-modal a.lp-node[href]');if(!a)return;if(inModal&&a.classList&&a.classList.contains("lp-node")){return;}
e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();lpNavigate(lpNavHrefFromAnchor(a),(a.dataset&&a.dataset.lpLoc)?a.dataset.lpLoc:"");}catch(_){}}
window.addEventListener("pointerdown",handle,true);window.addEventListener("click",(e)=>{if(typeof e.detail==="number"&&e.detail!==0)return;handle(e);},true);}
function lpNavigate(href,fallbackLoc,opts){const finalHref=lpResolveSiteHref(href,fallbackLoc);try{const fromRel=currentRelPath();const toRel=urlToRelPath(finalHref)||normLoc(fallbackLoc||"");const keepGpsRoute=!!(opts&&opts.keepGpsRoute);if(keepGpsRoute)lpGpsWriteRouteTicket(toRel||fallbackLoc||'');else lpGpsClearRouteState();if(fromRel&&toRel&&isConceptPage(fromRel)&&isConceptPage(toRel)){saveNavContext({ts:Date.now(),from:normLoc(fromRel),fromTitle:getPageTitleFromDom(),to:normLoc(toRel),});}}catch(_){}
try{window.location.href=finalHref||href;}catch(_){}}
function setupInternalNavCapture(){installPanelClickHardFix();if(window.__lpNavCaptureInstalledV2)return;window.__lpNavCaptureInstalledV2=true;document.addEventListener("click",(e)=>{try{if(!e||e.defaultPrevented)return;if(e.button!==0)return;if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const a=e.target&&e.target.closest?e.target.closest("a[href]"):null;if(!a)return;const href=a.getAttribute("href");if(!href)return;if(a.getAttribute("target")==="_blank")return;if(!isSameOriginUrl(href))return;const preserveRoute=!!(a.matches&&a.matches('[data-lp-h1-route-jump]'));if(!preserveRoute){try{const abs=new URL(href,document.baseURI);const leavesCurrentDocument=abs.origin===window.location.origin&&(abs.pathname!==window.location.pathname||abs.search!==window.location.search);if(leavesCurrentDocument)lpGpsClearRouteState();}catch(_){}}
const toRel=urlToRelPath(href);if(!toRel||!isConceptPage(toRel))return;const fromRel=currentRelPath();if(!fromRel||!isConceptPage(fromRel))return;saveNavContext({ts:Date.now(),from:normLoc(fromRel),fromTitle:getPageTitleFromDom(),to:normLoc(toRel),});}catch(_){}},true);}
function uniq(arr){return Array.from(new Set((arr||[]).map(normLoc))).filter(Boolean);}
function __lpMapLastSlug(loc){try{let s=normLoc(loc).replace(/\\/g,"/");s=s.replace(/\/index\.html?$/i,"").replace(/\.html?$/i,"").replace(/\/+$/g,"");return decodeURIComponent((s.split("/").filter(Boolean).pop()||"")).replace(/_/g,"-").trim();}catch(_){return"";}}
function __lpMapHasMath(s){return/\\\(|\\\[|\$\$[\s\S]+?\$\$|\$[^$]+\$|<(?:mjx-container|math)\b|class=["'][^"']*katex/i.test(String(s||""));}
function __lpCollapseRepeatedMathLetters(s){return cleanTitle(String(s||"")).replace(/\b([A-Za-z])\1+(?=[-–—−_ ]?[A-Za-z])/g,"$1").replace(/([A-Za-z])\s+\1(?=[-–—−_ ]?[A-Za-z])/g,"$1").replace(/([A-Za-z])\s+\1\s+\1(?=[-–—−_ ]?[A-Za-z])/g,"$1");}
function __lpRemoveSingleLetterMathKey(s){return __lpMapTitleKey(String(s||"").replace(/(^|[\s-–—−_])([A-Za-z])(?=[\s-–—−_]+[A-Za-z])/g,"$1").replace(/[\s-–—−_]+/g," "));}
function __lpRawMathTitleFromGraphNode(graph,key,aliases){try{const node=__lpReadGraphNodeForLoc(graph,key,aliases)||null;if(!node||typeof node!=="object")return"";const vals=[node.title,node.name,node.label].map((x)=>cleanTitle(x||"")).filter(Boolean);for(const v of vals)if(__lpMapHasMath(v))return v;return"";}catch(_){return"";}}
function __lpShouldBlockTitleMutation(graph,key,incomingTitle,aliases){try{const incoming=cleanTitle(incomingTitle||"");if(!incoming)return true;const sourceMath=__lpRawMathTitleFromGraphNode(graph,key,aliases);if(sourceMath&&!__lpMapHasMath(incoming))return true;if(!__lpMapHasMath(incoming)&&__lpTitleTextLooksBrokenForLoc(key,incoming))return true;}catch(_){}
return false;}
function __lpMapTitleWord(w,i,prev){const x=String(w||"").trim();if(!x)return"";const lo=x.toLowerCase();if(["and","or","of","in","on","to","for","the","a","an","th"].includes(lo))return lo;if(i>0&&["test","series","norm","metric","space","axis","algebra","field","root","set","rule","function"].includes(lo))return lo;if(prev&&String(prev).toLowerCase()==="th")return x.charAt(0).toUpperCase()+x.slice(1);return x.charAt(0).toUpperCase()+x.slice(1);}
function __lpShouldAutoMathSlugToken(tok,next,prev,parts){const t=String(tok||"").trim().toLowerCase();const n=String(next||"").trim().toLowerCase();const p=String(prev||"").trim().toLowerCase();const all=Array.isArray(parts)?parts.map((x)=>String(x||"").toLowerCase()):[];if(t==="a"||t==="an")return false;if(t==="m"&&n==="test"&&all.includes("weierstrass"))return true;if(t==="p"&&(n==="series"||n==="test"||n==="norm"||n==="space"))return true;if(t==="q"&&(n==="series"||n==="test"||n==="norm"||n==="space"))return true;if(t==="n"&&(n==="th"||n==="root"))return true;if((t==="x"||t==="y"||t==="z")&&n==="axis")return true;if((t==="l"||t==="r")&&(n==="space"||n==="norm"))return true;if(p==="weierstrass"&&n==="test")return true;return false;}
function __lpMapMathTitleFromSlug(loc){const slug0=__lpMapLastSlug(loc);const slug=String(slug0||"").trim();if(!slug)return"";if(__lpMapHasMath(slug)){return cleanTitle(slug.replace(/_/g,"-").replace(/\\\)\s*[-–—]\s*/g,"\\)-").replace(/\s+/g," "));}
const paren=slug.match(/^\(([A-Za-z])\)[-–—_](.+)$/);if(paren){const letter=paren[1];const rest=String(paren[2]||"").split(/[-–—_]+/).filter(Boolean);if(rest.length)return cleanTitle(`\\(${letter}\\)-${rest.map((w, i) => __lpMapTitleWord(w, i + 1, i ? rest[i - 1] : letter)).join(" ")}`);}
const parts=slug.split(/[-–—_]+/).filter(Boolean);if(parts.length<2)return"";const out=[];let used=false;for(let i=0;i<parts.length;i++){const tok=parts[i]||"";const next=parts[i+1]||"";const prev=parts[i-1]||"";if(/^[A-Za-z]$/.test(tok)&&next&&__lpShouldAutoMathSlugToken(tok,next,prev,parts)){const mathTok=(String(tok).toLowerCase()==="m"&&parts.some((x)=>String(x).toLowerCase()==="weierstrass"))?"M":tok;out.push(`\\(${mathTok}\\)-${__lpMapTitleWord(next, i + 1, mathTok)}`);used=true;i++;}else{out.push(__lpMapTitleWord(tok,i,parts[i-1]||""));}}
return used?cleanTitle(out.join(" ")):"";}
function __lpMapPlainMathTitle(s){return cleanTitle(String(s||"").replace(/\\\(([^)]*)\\\)/g,"$1").replace(/\\\[([\s\S]*?)\\\]/g,"$1").replace(/\$([^$]+)\$/g,"$1").replace(/\\/g,""));}
function __lpMapTitleKey(s){return cleanTitle(s||"").toLowerCase().replace(/[\s_]+/g,"").replace(/[–—−]/g,"-");}
function __lpPlainTitleForArticleFix(s){const raw=String(s||"").trim();if(!raw)return"";try{if(/<[a-z][\s\S]*>/i.test(raw)){const txt=__lpTitleHtmlToText(raw);if(txt)return cleanTitle(txt);}}catch(_){}
return cleanTitle(__lpMapPlainMathTitle(raw));}
function __lpFixFalseArticleASetTitleForLoc(loc,title){try{const raw=String(title||"");if(!raw)return"";const plain=__lpPlainTitleForArticleFix(raw);if(!plain)return"";const hasFalseASet=/\ba\s*[-–—−]\s*sets?\b/.test(plain)||/\baa\s*[-–—−]\s*sets?\b/.test(plain)||/\ba\s+a\s*[-–—−]\s*sets?\b/.test(plain);if(!hasFalseASet)return"";const slugWords=__lpMapLastSlug(loc).replace(/[-–—−_]+/g," ").toLowerCase();const plainCtx=plain.toLowerCase();const context=`${plainCtx} ${slugWords}`;const articleContext=/\bof\s+a(?:\s*[-–—−]\s*|\s+)sets?\b/.test(context)||/\b(interior|exterior|closure|boundary|complement)\b/.test(context);if(!articleContext)return"";return cleanTitle(plain.replace(/\ba\s+a\s*[-–—−]\s*(sets?)\b/g,"a $1").replace(/\baa\s*[-–—−]\s*(sets?)\b/g,"a $1").replace(/\ba\s*[-–—−]\s*(sets?)\b/g,"a $1"));}catch(_){return"";}}
function __lpRepairTitleMathFromLoc(loc,title){const raw=String(title||"");const articleFixed=__lpFixFalseArticleASetTitleForLoc(loc,raw);const cur=articleFixed||cleanTitle(raw);if(!loc)return cur||raw;if(__lpMapHasMath(raw))return cur||raw;const fixed=__lpMapMathTitleFromSlug(loc);if(!fixed)return cur;if(!cur)return fixed;const plain=__lpMapPlainMathTitle(fixed);const curCollapsed=__lpCollapseRepeatedMathLetters(cur);const curKey=__lpMapTitleKey(cur);const curCollapsedKey=__lpMapTitleKey(curCollapsed);const plainKey=__lpMapTitleKey(plain);if(curKey===plainKey||curCollapsedKey===plainKey)return fixed;const plainNoLettersKey=__lpRemoveSingleLetterMathKey(plain);const curNoLettersKey=__lpRemoveSingleLetterMathKey(curCollapsed);if(plainNoLettersKey&&(curKey===plainNoLettersKey||curCollapsedKey===plainNoLettersKey||curNoLettersKey===plainNoLettersKey)){return fixed;}
const first=(plain.match(/^([A-Za-z])[-–—]/)||[])[1]||"";if(first){const noFirstKey=__lpMapTitleKey(plain.replace(/^[A-Za-z][-–—]/,"-"));if(curKey===noFirstKey||curCollapsedKey===noFirstKey||/^[-–—−]/.test(cur)){const suffix=cur.replace(/^[–—−]/,"-");if(/^-/.test(suffix))return`\\(${first}\\)${suffix}`;return fixed;}}
const letters=new Set();__lpMapLastSlug(loc).replace(/(?:^|-)([A-Za-z])-(?=[A-Za-z])/g,(_m,c)=>{letters.add(String(c).toLowerCase());return _m;});if(letters.size){const out=cur.replace(/\b([A-Za-z])[-–—](?=[A-Za-z])/g,(m,c)=>letters.has(String(c).toLowerCase())?`\\(${c}\\)-`:m);if(out!==cur)return out;}
return cur;}
function __lpTitleTextLooksBrokenForLoc(loc,title){try{const fixed=__lpRepairTitleMathFromLoc(loc,title||"");const cur=cleanTitle(title||"");return!!(fixed&&cur&&fixed!==cur&&__lpMapHasMath(fixed));}catch(_){return false;}}
function __lpRenderedTitleHtmlLooksBrokenForLoc(loc,html){try{const rawHtml=String(html||'').trim();if(!rawHtml||!/<(?:mjx-container|math)\b|class=["\'][^"\']*katex/i.test(rawHtml))return false;const fixed=__lpMapMathTitleFromSlug(loc);if(!fixed||!__lpMapHasMath(fixed))return false;const expectedPlain=cleanTitle(__lpMapPlainMathTitle(fixed));const actualPlain=cleanTitle(__lpCollapseRepeatedMathLetters(__lpTitleHtmlToText(rawHtml)));if(!expectedPlain||!actualPlain)return false;const expectedKey=__lpMapTitleKey(expectedPlain);const actualKey=__lpMapTitleKey(actualPlain);if(!expectedKey||!actualKey)return false;if(actualKey===expectedKey)return false;const m=expectedPlain.match(/^([A-Za-z])\s*[-–—−]\s*(.+)$/);if(m){const withoutLetterKey=__lpMapTitleKey(String(m[2]||''));const withoutLetterHyphenKey=__lpMapTitleKey('-'+String(m[2]||''));if(actualKey===withoutLetterKey||actualKey===withoutLetterHyphenKey)return true;}
return true;}catch(_){return false;}}
function __lpRepairTitleHtmlFromLoc(loc,html){const raw=String(html||"").trim();if(!raw)return"";const sanitized=__lpSanitizeRenderedMathHtml(raw);if(!sanitized)return"";const articleFixed=__lpFixFalseArticleASetTitleForLoc(loc,sanitized);if(articleFixed)return escapeHtml(articleFixed);if(/<(?:mjx-container|math)\b|class=["\'][^"\']*katex/i.test(sanitized)){if(__lpRenderedTitleHtmlLooksBrokenForLoc(loc,sanitized))return"";return sanitized;}
try{if(__lpTitleTextLooksBrokenForLoc(loc,__lpTitleHtmlToText(sanitized)))return"";}catch(_){}
return sanitized;}
function __lpReadGraphNodeForLoc(graph,key,aliases){try{const nodes=graph&&graph.nodes;const k=normLoc(key);const ck=lpCanonKey(k);if(!nodes||!k)return null;if(nodes instanceof Map){if(nodes.has(k))return nodes.get(k);if(aliases)return nodes.get((aliases.get(ck)||[])[0])||null;for(const[kk,vv]of nodes.entries())if(lpCanonKey(kk)===ck)return vv;return null;}
if(Object.prototype.hasOwnProperty.call(nodes,k))return nodes[k];const bare=k.replace(/\/+$/g,"");const slash=bare?`${bare}/`:"";if(bare&&Object.prototype.hasOwnProperty.call(nodes,bare))return nodes[bare];if(slash&&Object.prototype.hasOwnProperty.call(nodes,slash))return nodes[slash];if(aliases)return nodes[(aliases.get(ck)||[])[0]]||null;for(const kk of Object.keys(nodes))if(lpCanonKey(kk)===ck)return nodes[kk];}catch(_){}
return null;}
function nodeTitle(graph,loc){const key=normLoc(loc);const sourceRawMath=__lpRawMathTitleFromGraphNode(graph,key);if(sourceRawMath)return __lpRepairTitleMathFromLoc(key,sourceRawMath);const n=__lpReadGraphNodeForLoc(graph,key)||null;const direct=__lpRepairTitleMathFromLoc(key,(n&&(n.title||n.name||n.label))||"");if(direct)return direct;if(lpCanonKey(key)===lpCanonKey(currentRelPath())){const curTitle=__lpRepairTitleMathFromLoc(key,getPageTitleFromDom());if(curTitle)return curTitle;}
const cached=__lpRepairTitleMathFromLoc(key,__lpGetTitleCache(graph,key)||"");if(cached)return cached;const idxTitle=__lpRepairTitleMathFromLoc(key,__lpGetSearchIndexPageTitleSync(key)||"");if(idxTitle)return idxTitle;try{const seg=String(key).split("/").filter(Boolean).pop()||String(key);const fallback=cleanTitle(decodeURIComponent(seg).replace(/\.html?$/i,"").replace(/[-_]+/g," "));return __lpRepairTitleMathFromLoc(key,fallback);}catch(_){}
return __lpRepairTitleMathFromLoc(key,key);}
function lpNodeTitleDisplay(graph,loc,fallbackTitle){const key=normLoc(loc);const text=__lpRepairTitleMathFromLoc(key,fallbackTitle||nodeTitle(graph,key)||key);if(lpCanonKey(key)===lpCanonKey(currentRelPath())){const curHtml=__lpRepairTitleHtmlFromLoc(key,String(getPageTitleHtmlFromDom()||"").trim());if(curHtml)return{text,html:curHtml};}
const cachedHtml=__lpRepairTitleHtmlFromLoc(key,String(__lpGetTitleHtmlCache(graph,key)||"").trim());if(cachedHtml)return{text,html:cachedHtml};return{text,html:""};}
function getPrereqs(graph,loc){return uniq((graph&&graph.prereqOf&&graph.prereqOf[loc])?graph.prereqOf[loc]:[]);}
function getDependents(graph,loc){return uniq((graph&&graph.dependents&&graph.dependents[loc])?graph.dependents[loc]:[]);}
function __lpPushRelatedLike(out,v){if(!v)return;if(Array.isArray(v)){for(const it of v)__lpPushRelatedLike(out,it);return;}
const t=typeof v;if(t==="string"){out.push(v);return;}
if(t==="object"){if(typeof v.loc==="string")out.push(v.loc);else if(typeof v.path==="string")out.push(v.path);else if(typeof v.href==="string")out.push(urlToRelPath(v.href)||v.href);else if(typeof v.url==="string")out.push(urlToRelPath(v.url)||v.url);else{for(const kk of Object.keys(v)){if(typeof kk==="string")out.push(kk);}}}}
function getRelated(graph,loc){const key=normLoc(loc);const out=[];const pushAny=(v)=>__lpPushRelatedLike(out,v);try{__lpRestoreRelatedBodyCacheFromSession(graph);}catch(_){}
try{const c=graph&&graph.__lpRelatedFromBody;if(c){if(c instanceof Map)pushAny(c.get(key));else pushAny(c[key]);}}catch(_){}
for(const k of LP_RELATED_KEYS){try{const v=graph&&graph[k]?graph[k][key]:null;if(v)pushAny(v);}catch(_){}}
try{const n=graph&&graph.nodes?(graph.nodes[key]||graph.nodes[key.replace(/\/$/,"")]||null):null;if(n){for(const k of LP_RELATED_KEYS){if(n[k])pushAny(n[k]);}
if(n.links&&typeof n.links==="object"){if(n.links.related)pushAny(n.links.related);if(n.links.similar)pushAny(n.links.similar);if(n.links.seeAlso)pushAny(n.links.seeAlso);}}}catch(_){}
return uniq(out).map(normLoc).filter((x)=>x&&x!==key&&isConceptPage(x));}
function rankDependents(graph,currentLoc,resolveTitle){const deps=getDependents(graph,currentLoc);const out=[];const titleFor=(typeof resolveTitle==="function")?resolveTitle:((loc)=>nodeTitle(graph,loc));for(const loc of deps){const self=getMastery(loc);const selfM=self&&typeof self.m==="number"?self.m:null;const pres=getPrereqs(graph,loc);const total=pres.length;let readyStrong=0;let sumWeighted=0;for(const p of pres){const rec=getMastery(p);const m=rec&&typeof rec.m==="number"?rec.m:null;const r=masteryReady(m,rec);sumWeighted+=r;if(r>=1)readyStrong+=1;}
const readiness=total?sumWeighted/total:1;const pct=Math.round(readiness*100);const hint=total?`Prereqs ${readyStrong}/${total} (${pct}%)`:`No prereqs`;const tooltip=total?`Readiness: ${pct}% (weighted ${sumWeighted.toFixed(1)}/${total}). Fully ready prereqs: ${readyStrong}/${total}.`:`No prerequisites.`;out.push({loc,title:titleFor(loc),m:selfM,hint,tooltip,readiness,readyStrong,total});}
out.sort((a,b)=>{const aDone=a.m===3?1:0;const bDone=b.m===3?1:0;if(aDone!==bDone)return aDone-bDone;if(b.readiness!==a.readiness)return b.readiness-a.readiness;if((b.readyStrong||0)!==(a.readyStrong||0))return(b.readyStrong||0)-(a.readyStrong||0);if((a.total||0)!==(b.total||0))return(a.total||0)-(b.total||0);const at=String(a.title||"");const bt=String(b.title||"");return at.localeCompare(bt,undefined,{sensitivity:"base"});});const seen=new Set();const dedup=[];for(const it of out){const k=normLoc(it.loc);if(!k||seen.has(k))continue;seen.add(k);dedup.push(it);}
return dedup;}
function suggestForward(graph,currentLoc,limit){const ranked=rankDependents(graph,currentLoc);const candidates=ranked.filter((x)=>x.m!==3);return candidates.slice(0,limit);}
function suggestBackfill(graph,currentLoc,limit,resolveTitle){const pres=getPrereqs(graph,currentLoc);const out=[];const titleFor=(typeof resolveTitle==="function")?resolveTitle:((loc)=>nodeTitle(graph,loc));for(const loc of pres){const rec=getMastery(loc);const m=rec&&typeof rec.m==="number"?rec.m:null;out.push({loc,title:titleFor(loc),m,rec,score:masteryScore(m)});}
out.sort((a,b)=>b.score-a.score);return out.slice(0,limit);}
function lpGpsMasteryMeta(loc){const rec=getMastery(loc);const m=rec&&typeof rec.m==="number"?rec.m:null;const ready=masteryReady(m,rec);let bucket="unrated";let label="Not rated";if(m===3){bucket="mastered";label="Mastered";}
else if(m===2){bucket="know";label="Clear";}
else if(m===1){bucket="fuzzy";label="Unclear";}
else if(m===0){bucket="dont";label="Unknown";}
return{rec,m,ready,bucket,label};}
function lpGpsDistanceMap(graph,targetLoc,maxDepth){const target=normLoc(targetLoc);const limit=Math.max(1,Number(maxDepth)||6);const dist=new Map();if(!target)return dist;const q=[target];dist.set(target,0);for(let qi=0;qi<q.length;qi+=1){const cur=q[qi];const d=Number(dist.get(cur)||0);if(d>=limit)continue;for(const raw of getPrereqs(graph,cur)){const pre=normLoc(raw);if(!pre||!isConceptPage(pre))continue;const nd=d+1;if(!dist.has(pre)||nd<dist.get(pre)){dist.set(pre,nd);q.push(pre);}}}
return dist;}
function lpGpsLectureNumForLoc(loc){const map=lpGpsLectureMapSync();if(!map)return 0;try{return Number(map.get(__lpCanonPath(normLoc(loc)))||0)||0;}catch(_){return 0;}}
function lpGpsAvgReadyForPath(path){const arr=Array.isArray(path)?path:[];if(!arr.length)return 0;let sum=0;for(const loc of arr){const meta=lpGpsMasteryMeta(loc);sum+=meta&&Number.isFinite(Number(meta.ready))?Number(meta.ready):masteryReady(meta&&typeof meta.m==="number"?meta.m:null,meta&&meta.rec);}
return sum/arr.length;}
function lpGpsWeakRatioForPath(path){const arr=Array.isArray(path)?path:[];if(!arr.length)return 0;let weak=0;for(const loc of arr){if(lpGpsNeedsWork(lpGpsMasteryMeta(loc)))weak+=1;}
return weak/arr.length;}
function lpGpsLecturePenaltyForPath(path){const arr=Array.isArray(path)?path:[];if(arr.length<2)return 0;let penalty=0;for(let i=1;i<arr.length;i+=1){const prevLecture=lpGpsLectureNumForLoc(arr[i-1]);const nextLecture=lpGpsLectureNumForLoc(arr[i]);if(!prevLecture||!nextLecture)continue;if(prevLecture>nextLecture)penalty+=3+(prevLecture-nextLecture)*1.25;else if(nextLecture-prevLecture>1)penalty+=(nextLecture-prevLecture-1)*0.35;}
return penalty;}
function lpGpsChainKey(path){return(Array.isArray(path)?path:[]).map((loc)=>lpCanonKey(loc)).join(" -> ");}
function lpGpsCandidatePrereqs(graph,loc,distMap){const current=normLoc(loc);const currentLecture=lpGpsLectureNumForLoc(current);return uniq(getPrereqs(graph,current).map(normLoc).filter(Boolean).filter(isConceptPage)).sort((a,b)=>{const ma=lpGpsMasteryMeta(a);const mb=lpGpsMasteryMeta(b);const weakA=lpGpsNeedsWork(ma)?1:0;const weakB=lpGpsNeedsWork(mb)?1:0;if(weakB!==weakA)return weakB-weakA;const la=lpGpsLectureNumForLoc(a);const lb=lpGpsLectureNumForLoc(b);const aLate=currentLecture&&la?(la>currentLecture?1:0):0;const bLate=currentLecture&&lb?(lb>currentLecture?1:0):0;if(aLate!==bLate)return aLate-bLate;if(currentLecture&&la&&lb){const da=Math.abs(currentLecture-la);const db=Math.abs(currentLecture-lb);if(da!==db)return da-db;}
const fa=lpGpsIsFoundationNode(graph,a)?1:0;const fb=lpGpsIsFoundationNode(graph,b)?1:0;if(fb!==fa)return fb-fa;const pa=getPrereqs(graph,a).length;const pb=getPrereqs(graph,b).length;if(pa!==pb)return pa-pb;const distA=Number(distMap.get(normLoc(a))||0);const distB=Number(distMap.get(normLoc(b))||0);if(distB!==distA)return distB-distA;const ta=String(nodeTitle(graph,a)||a||"");const tb=String(nodeTitle(graph,b)||b||"");return ta.localeCompare(tb,undefined,{sensitivity:"base"});});}
function lpGpsEnumerateChainPaths(graph,targetLoc,maxDepth,distMap){const target=normLoc(targetLoc);const maxCandidates=64;const maxBranch=5;const out=[];const seen=new Set();function visit(loc,depth,stackKeys){const key=normLoc(loc);if(!key||!isConceptPage(key))return[[key].filter(Boolean)];const canon=lpCanonKey(key);if(!canon)return[[key]];if(depth>=maxDepth)return[[key]];const nextStack=new Set(stackKeys||[]);nextStack.add(canon);const prereqs=lpGpsCandidatePrereqs(graph,key,distMap).filter((pre)=>!nextStack.has(lpCanonKey(pre))).slice(0,maxBranch);if(!prereqs.length)return[[key]];const chains=[];for(const pre of prereqs){const preChains=visit(pre,depth+1,nextStack);for(const chain of preChains){const nextChain=chain.concat([key]);const chainKey=lpGpsChainKey(nextChain);if(seen.has(chainKey))continue;seen.add(chainKey);chains.push(nextChain);if(chains.length>=maxCandidates||out.length+chains.length>=maxCandidates)break;}
if(chains.length>=maxCandidates||out.length+chains.length>=maxCandidates)break;}
if(!chains.length)return[[key]];return chains;}
const chains=visit(target,0,new Set());for(const chain of chains){const normed=uniq((Array.isArray(chain)?chain:[]).map(normLoc).filter(Boolean));if(!normed.length)continue;const chainKey=lpGpsChainKey(normed);if(seen.has(`final:${chainKey}`))continue;seen.add(`final:${chainKey}`);out.push(normed);if(out.length>=maxCandidates)break;}
if(!out.length&&target)out.push([target]);return out;}
function lpGpsScoreChainPath(graph,path){const chain=Array.isArray(path)?path:[];if(!chain.length){return{weight:1,avgReady:1,weakRatio:0,lecturePenalty:0,depthBonus:0};}
const avgReady=lpGpsAvgReadyForPath(chain);const weakRatio=lpGpsWeakRatioForPath(chain);const lecturePenalty=lpGpsLecturePenaltyForPath(chain);let depthBonus=Math.min(1.2,Math.max(0,chain.length-1)*0.08);if(chain.length<=2)depthBonus*=0.5;const lowReadyBias=Math.max(0.08,1.12-avgReady);const weakBias=0.28+weakRatio*0.9;const penaltyScale=1/(1+Math.max(0,lecturePenalty));const foundationBias=lpGpsIsFoundationNode(graph,chain[0])?1.08:1;const weight=Math.max(0.05,lowReadyBias*weakBias*penaltyScale*foundationBias+depthBonus);return{weight,avgReady,weakRatio,lecturePenalty,depthBonus};}
function lpGpsStatusForStep(loc,targetLoc){if(lpCanonKey(loc)===lpCanonKey(targetLoc))return"target";const meta=lpGpsMasteryMeta(loc);if(meta.m==null||meta.m===0)return"learn";if(meta.m===1)return"review";return"solid";}
function lpGpsStepButtonHtml(graph,loc,stepIndex,opts){const options=opts&&typeof opts==='object'?opts:{};const display=lpNodeTitleDisplay(graph,loc,nodeTitle(graph,loc));const titleText=cleanTitle(display.text||nodeTitle(graph,loc)||loc);const rawHtml=String(display.html||'').trim();const titleHtml=rawHtml||escapeHtml(titleText);const cls=options.className?` ${escapeHtml(options.className)}`:'';const label=options.ariaLabel||titleText;return`<button type="button" class="lp-gps-step-link${cls}" data-lp-gps-go-index="${escapeHtml(String(stepIndex))}" data-lp-gps-step-loc="${escapeHtml(normLoc(loc))}" aria-label="Open ${escapeHtml(label)} in the guided study">${titleHtml}</button>`;}
function lpGpsIsFoundationNode(graph,loc){const pres=getPrereqs(graph,loc).map(normLoc).filter(Boolean);return pres.length===0;}
function lpGpsSortPrereqsForSpine(graph,prereqs,distMap){return(prereqs||[]).slice().sort((a,b)=>{const ma=lpGpsMasteryMeta(a);const mb=lpGpsMasteryMeta(b);const needA=lpGpsNeedsWork(ma)?1:0;const needB=lpGpsNeedsWork(mb)?1:0;if(needB!==needA)return needB-needA;const da=Number(distMap.get(normLoc(a))||0);const db=Number(distMap.get(normLoc(b))||0);if(db!==da)return db-da;const fa=lpGpsIsFoundationNode(graph,a)?1:0;const fb=lpGpsIsFoundationNode(graph,b)?1:0;if(fb!==fa)return fb-fa;const pa=getPrereqs(graph,a).length;const pb=getPrereqs(graph,b).length;if(pa!==pb)return pa-pb;const ca=getDependents(graph,a).length;const cb=getDependents(graph,b).length;if(cb!==ca)return cb-ca;const at=String(nodeTitle(graph,a)||a||"");const bt=String(nodeTitle(graph,b)||b||"");return at.localeCompare(bt,undefined,{sensitivity:"base"});});}
function lpGpsBuildPrimarySpine(graph,targetLoc,maxDepth,distMap){const target=normLoc(targetLoc);if(!target)return[];const spine=[target];const seen=new Set([target]);let cur=target;let depth=0;while(depth<maxDepth){const pres=uniq(getPrereqs(graph,cur).map(normLoc).filter(Boolean).filter(isConceptPage));if(!pres.length)break;const next=lpGpsSortPrereqsForSpine(graph,pres,distMap).find((loc)=>!seen.has(normLoc(loc)));if(!next)break;spine.unshift(next);seen.add(normLoc(next));cur=normLoc(next);depth+=1;}
return spine;}
function lpGpsSortSupportLocs(graph,locs,distMap){return(locs||[]).slice().sort((a,b)=>{const ma=lpGpsMasteryMeta(a);const mb=lpGpsMasteryMeta(b);const needA=lpGpsNeedsWork(ma)?1:0;const needB=lpGpsNeedsWork(mb)?1:0;if(needB!==needA)return needB-needA;const fa=lpGpsIsFoundationNode(graph,a)?1:0;const fb=lpGpsIsFoundationNode(graph,b)?1:0;if(fb!==fa)return fb-fa;const da=Number(distMap.get(normLoc(a))||0);const db=Number(distMap.get(normLoc(b))||0);if(db!==da)return db-da;const at=String(nodeTitle(graph,a)||a||"");const bt=String(nodeTitle(graph,b)||b||"");return at.localeCompare(bt,undefined,{sensitivity:"base"});});}
function lpGpsCollectSideSupports(graph,spineSet,stepLoc,prevLoc,distMap){const prevKey=prevLoc?lpCanonKey(prevLoc):"";const pres=uniq(getPrereqs(graph,stepLoc).map(normLoc).filter(Boolean).filter(isConceptPage));const extras=pres.filter((loc)=>{if(prevKey&&lpCanonKey(loc)===prevKey)return false;return!spineSet.has(normLoc(loc));});return lpGpsSortSupportLocs(graph,extras,distMap).slice(0,4);}
function lpGpsStepWhy(graph,step,nextLoc,targetLoc){const meta=step.meta||{};const title=nodeTitle(graph,nextLoc||targetLoc);const parts=[];if(step.isTarget){parts.push('This is the page you are trying to reach.');}else if(nextLoc){parts.push(`Study this before ${title}.`);}
if(meta.m==null)parts.push('Not rated yet.');else if(meta.m===0)parts.push("Currently marked Unknown.");else if(meta.m===1)parts.push('Currently marked Unclear.');else if(meta.m===2)parts.push('Currently marked Clear.');else if(meta.m===3)parts.push('Currently marked Mastered.');return parts.join(' ');}
function lpBuildKnowledgeGpsPlan(graph,targetLoc,opts){const options=opts&&typeof opts==='object'?opts:{};const target=normLoc(targetLoc);const activeState=options.activeState&&lpCanonKey(options.activeState.target||'')===lpCanonKey(target)?options.activeState:null;const maxDepth=7;const distMap=lpGpsDistanceMap(graph,target,maxDepth);const directPrereqs=uniq(getPrereqs(graph,target).map(normLoc).filter(Boolean).filter(isConceptPage));const missingPrereqs=directPrereqs.filter((loc)=>lpGpsMasteryMeta(loc).ready<1);let routeLocs=[];if(activeState&&Array.isArray(activeState.path)&&activeState.path.length){routeLocs=lpGpsNormalizeRoutePath(activeState.path);}
const memKey=`${currentRelPath()}::${lpCanonKey(target)}`;try{if(!window.__lpGpsPlanMem||window.__lpGpsPlanMemPage!==currentRelPath()){window.__lpGpsPlanMem=Object.create(null);window.__lpGpsPlanMemPage=currentRelPath();}
const cached=window.__lpGpsPlanMem[memKey];if(!routeLocs.length&&Array.isArray(cached)&&cached.length)routeLocs=cached.slice();}catch(_){}
if(!routeLocs.length){const chainCandidates=lpGpsEnumerateChainPaths(graph,target,maxDepth,distMap);const scored=chainCandidates.map((path)=>{const score=lpGpsScoreChainPath(graph,path);return Object.assign({path},score);}).sort((a,b)=>{if(b.weight!==a.weight)return b.weight-a.weight;if(a.lecturePenalty!==b.lecturePenalty)return a.lecturePenalty-b.lecturePenalty;if(b.weakRatio!==a.weakRatio)return b.weakRatio-a.weakRatio;if(a.avgReady!==b.avgReady)return a.avgReady-b.avgReady;return(b.path.length||0)-(a.path.length||0);});const picked=lpGpsWeightedChoice(scored.slice(0,24))||scored[0]||null;routeLocs=picked&&Array.isArray(picked.path)&&picked.path.length?picked.path.slice():(target?[target]:[]);try{if(!window.__lpGpsPlanMem||window.__lpGpsPlanMemPage!==currentRelPath()){window.__lpGpsPlanMem=Object.create(null);window.__lpGpsPlanMemPage=currentRelPath();}
window.__lpGpsPlanMem[memKey]=routeLocs.slice();}catch(_){}}
if(!routeLocs.length&&target)routeLocs=[target];const routeSet=new Set(routeLocs.map(normLoc).filter(Boolean));const steps=routeLocs.map((loc,idx)=>{const meta=lpGpsMasteryMeta(loc);const nextLoc=idx<routeLocs.length-1?routeLocs[idx+1]:null;const prevLoc=idx>0?routeLocs[idx-1]:null;const isTarget=idx===routeLocs.length-1;const sideSupports=lpGpsCollectSideSupports(graph,routeSet,loc,prevLoc,distMap);return{loc,title:nodeTitle(graph,loc),meta,status:lpGpsStatusForStep(loc,target),dist:Number(distMap.get(normLoc(loc))||0),why:lpGpsStepWhy(graph,{meta,isTarget},nextLoc,target),sideSupports,isTarget,stepNumber:idx+1,stepLabel:isTarget?'target page':(idx===0?'start here':`step ${idx + 1}`),nextLoc};});const anchorExtras=lpGpsSortSupportLocs(graph,directPrereqs.filter((loc)=>!routeSet.has(normLoc(loc))),distMap).slice(0,6);const currentReadyNow=missingPrereqs.length===0&&steps.length<=1;const headline=currentReadyNow?'You can work on this page now.':(missingPrereqs.length>0?`${missingPrereqs.length} direct prerequisite${missingPrereqs.length === 1 ? '' : 's'} still need support.`:'This route is one connected prerequisite chain. Reloading the page may show a different valid chain.');return{mode:'guided',target,steps,allSteps:steps,missingPrereqs,directPrereqs,anchorExtras,suggestedStart:steps[0]||null,estimatedLength:lpGpsEstimateLength(steps.length),estimatedCount:steps.length,directPrereqCount:directPrereqs.length,currentReadyNow,headline};}
function lpRenderKnowledgeGpsCard(graph,plan,currentLoc,activeState){const steps=(plan&&Array.isArray(plan.steps))?plan.steps:[];const start=plan&&plan.suggestedStart?plan.suggestedStart:null;const targetStep=steps.length?steps[steps.length-1]:null;const cur=normLoc(currentLoc||currentRelPath());const state=activeState&&lpCanonKey(activeState.target)===lpCanonKey(plan&&plan.target)?activeState:null;const currentIndex=state?lpGpsRouteIndexForLoc(state,cur):-1;const targetTitle=targetStep?cleanTitle(nodeTitle(graph,targetStep.loc)||targetStep.loc):'this page';const renderRouteTitle=(step,stepIdx,isCurrent)=>{const title=cleanTitle(nodeTitle(graph,step.loc)||step.loc);const currentBadge=isCurrent?'<span class="lp-gps-current-badge" aria-label="Current step">Current</span>':'';if(isCurrent){const display=lpNodeTitleDisplay(graph,step.loc,nodeTitle(graph,step.loc));const rawHtml=String(display&&display.html||'').trim();const titleHtml=rawHtml||escapeHtml(cleanTitle((display&&display.text)||title));return`<span class="lp-gps-current-title" data-lp-title-loc="${escapeHtml(normLoc(step.loc))}">${titleHtml}</span>${currentBadge}`;}
const linkCls=step.isTarget?'lp-gps-target-link lp-gps-node-link':'lp-gps-node-link';return`${lpGpsStepButtonHtml(graph, step.loc, stepIdx, { className: linkCls, ariaLabel: title })}${currentBadge}`;};const renderActionBar=()=>{const startLabel=(state&&currentIndex>=0)?'Restart guided study':'Start guided study';const continueLabel=(state&&currentIndex>=0)?(currentIndex<(state.path.length-1)?'Continue guided study':'Finish guided study'):'';return`
      <div class="lp-gps-actions">
        <button type="button" class="lp-gps-cta is-primary" data-lp-gps-start="1">
          <span class="lp-gps-cta-icon" aria-hidden="true">${lpGpsPlayButtonSvg()}</span>
          <span>${escapeHtml(startLabel)}</span>
        </button>
        ${continueLabel ? `<button type="button"class="lp-gps-cta"${currentIndex<(state.path.length-1)?`data-lp-gps-next-index="${escapeHtml(String(currentIndex + 1))}"`:'data-lp-gps-clear="1"'}><span class="lp-gps-cta-icon"aria-hidden="true">${lpCompassButtonSvg()}</span><span>${escapeHtml(continueLabel)}</span></button>` : ''}
        <button type="button" class="lp-gps-cta" data-lp-gps-reroll="1">
          <span class="lp-gps-cta-icon" aria-hidden="true">${lpGpsShuffleButtonSvg()}</span>
          <span>Another valid path</span>
        </button>
      </div>
    `;};const renderRoute=()=>{if(!steps.length)return`<div class="lp-gps-empty">No route available yet.</div>`;return`
      <div class="lp-gps-route" aria-label="Knowledge route">
        ${steps.map((step, idx) => {
          const courseLabel = __lpCourseLabelFromRelPath(step.loc) || '';
          const lectureNum = lpGpsLectureNumForLoc(step.loc);
          const courseLecture = courseLabel ? (lectureNum ? `${courseLabel}· Lecture ${lectureNum}` : courseLabel) : (lectureNum ? `Lecture ${lectureNum}` : '');
          const masteryText = step.meta && step.meta.label ? step.meta.label : 'Not rated';
          const readinessRaw = lpMasteryPercentForLoc(step.loc);
          const readinessPct = Math.max(0, Math.min(100, Math.round(readinessRaw >= 0 ? readinessRaw : ((Number(step.meta && step.meta.ready) || 0) * 100))));
          const isCurrent = lpCanonKey(step.loc) === lpCanonKey(cur);
          return `<div class="lp-gps-route-step is-${escapeHtml(String(step.status || 'solid'))} ${step.isTarget ? 'is-target-card' : ''} ${isCurrent ? 'is-current-page' : ''}"><div class="lp-gps-route-rail"aria-hidden="true"><div class="lp-gps-route-dot">${idx+1}</div>${idx<steps.length-1?'<div class="lp-gps-route-line"></div><div class="lp-gps-route-arrow">↓</div>':''}</div><div class="lp-gps-route-card"><div class="lp-gps-route-title">${renderRouteTitle(step,idx,isCurrent)}</div><div class="lp-gps-route-meta"><span class="lp-gps-meta-pill">${escapeHtml(masteryText)}</span><span class="lp-gps-meta-pill">Readiness ${escapeHtml(String(readinessPct))}%</span>${courseLecture?`<span class="lp-gps-meta-course">${escapeHtml(courseLecture)}</span>`:''}</div></div></div>`;
        }).join('')}
      </div>
    `;};return`
    <div class="lp-gps-card">
      <div class="lp-gps-head">
        <div>
          <div class="lp-gps-title">Knowledge GPS</div>
          <div class="lp-gps-sub">${state && currentIndex >= 0 ? 'This is your current guided study route.' : 'This is one valid route into this page, not the only one.'}</div>
        </div>
      </div>

      <div class="lp-gps-stats">
        <div class="lp-gps-stat">
          <span class="lp-gps-stat-k">Start</span>
          <span class="lp-gps-stat-v">${start ? lpGpsStepButtonHtml(graph, start.loc, 0, { className: 'lp-gps-inline-link', ariaLabel: cleanTitle(nodeTitle(graph, start.loc) || start.loc) }) : '<span class="lp-gps-inline-link">This page</span>'}</span>
        </div>
        <div class="lp-gps-stat">
          <span class="lp-gps-stat-k">Target</span>
          <span class="lp-gps-stat-v">${targetStep ? `<span class="lp-gps-target-inline">${escapeHtml(targetTitle)}</span>` : '<span class="lp-gps-target-inline">This page</span>'}</span>
        </div>
        <div class="lp-gps-stat">
          <span class="lp-gps-stat-k">Route size</span>
          <span class="lp-gps-stat-v">${escapeHtml(String((plan && plan.estimatedCount) || 1))} step${Number((plan && plan.estimatedCount) || 1) === 1 ? '' : 's'} · ${escapeHtml((plan && plan.estimatedLength) || 'Start here')}</span>
        </div>
      </div>

      ${renderActionBar()}
      ${renderRoute()}
    </div>
  `;}
function lpBindKnowledgeGpsActions(root,graph,plan,targetLoc){if(!root)return;const target=normLoc(targetLoc||(plan&&plan.target)||currentRelPath());const bindAll=(selector,fn)=>{root.querySelectorAll(selector).forEach((el)=>lpBindTap(el,(e)=>{try{if(e&&e.preventDefault)e.preventDefault();}catch(_){}
fn(el);}));};bindAll('[data-lp-gps-go-index]',(el)=>{const idx=Number(el.getAttribute('data-lp-gps-go-index')||0);lpGpsOpenStepFromPlan(plan,idx);});bindAll('[data-lp-gps-start]',()=>{const run=()=>{lpRecordXpActivity("guided_study_start",{source:"knowledge-gps-start",eventName:"data-lp-gps-start"});lpGpsOpenStepFromPlan(plan,0);};if(lpShopItemOwned(LP_GUIDED_ROUTES_ITEM_ID))run();else lpOfferUnlock(LP_GUIDED_ROUTES_ITEM_ID,LP_GUIDED_ROUTES_NAME,LP_GUIDED_ROUTES_PRICE,"knowledge-gps-start").then((res)=>{if(res&&res.ok!==false)run();});});bindAll('[data-lp-gps-restart]',()=>{const run=()=>{lpRecordXpActivity("guided_study_start",{source:"knowledge-gps-restart",eventName:"data-lp-gps-restart"});lpGpsOpenStepFromPlan(plan,0);};if(lpShopItemOwned(LP_GUIDED_ROUTES_ITEM_ID))run();else lpOfferUnlock(LP_GUIDED_ROUTES_ITEM_ID,LP_GUIDED_ROUTES_NAME,LP_GUIDED_ROUTES_PRICE,"knowledge-gps-restart").then((res)=>{if(res&&res.ok!==false)run();});});bindAll('[data-lp-gps-next-index]',(el)=>{const idx=Number(el.getAttribute('data-lp-gps-next-index')||0);lpGpsNavigateActiveRouteTo(idx);});bindAll('[data-lp-gps-reroll]',()=>{lpGpsRerollPlan(target);try{const modal=document.getElementById('lp-gps-modal');if(modal&&typeof modal.__lpRender==='function')modal.__lpRender(window.__lpLearningPathGraph||graph,target);}catch(_){}});bindAll('[data-lp-gps-clear]',()=>{lpGpsClearRouteState();try{const g=window.__lpLearningPathGraph||graph;const p=mountPanel(g);const t=mountH1Tools(g);const b=mountH1RouteBar(g);typesetMathSafe([p,t,b]).catch(()=>{});}catch(_){}
hideKnowledgeGpsModal();});}
function lpMountKnowledgeGps(panel,graph,targetLoc){const root=panel&&panel.querySelector?panel.querySelector('[data-lp-gps-root]'):null;if(!root)return null;const render=()=>{const currentLoc=currentRelPath();const activeState=lpGpsSyncRouteStateForPage(currentLoc);const plan=lpBuildKnowledgeGpsPlan(graph,targetLoc,{activeState});root.innerHTML=lpRenderKnowledgeGpsCard(graph,plan,currentLoc,activeState);lpBindKnowledgeGpsActions(root,graph,plan,targetLoc);try{typesetMathSafe([root]);}catch(_){}
return plan;};render();return root;}
function ensureKnowledgeGpsModal(graph){let modal=document.getElementById('lp-gps-modal');if(!modal){modal=document.createElement('div');modal.id='lp-gps-modal';modal.setAttribute('aria-hidden','true');modal.style.display='none';modal.innerHTML=`
        <div class="lp-gps-mbox" role="dialog" aria-modal="true" aria-label="Knowledge GPS">
          <button class="lp-gps-close" type="button" aria-label="Close">✕</button>
          <div class="lp-gps-mbody" data-lp-gps-modal-root="1"></div>
        </div>
      `;document.body.appendChild(modal);const closeBtn=modal.querySelector('.lp-gps-close');lpBindTap(closeBtn,()=>hideKnowledgeGpsModal());modal.addEventListener('click',(e)=>{if(e.target===modal)hideKnowledgeGpsModal();});window.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&modal.style.display!=='none')hideKnowledgeGpsModal();});}
const root=modal.querySelector('[data-lp-gps-modal-root]');if(root&&!root.dataset.lpGpsBound){root.dataset.lpGpsBound='1';}
modal.__lpRender=(g,targetLoc)=>{const activeGraph=g||window.__lpLearningPathGraph||graph;if(!activeGraph||!root)return;const target=normLoc(targetLoc||currentRelPath());modal.dataset.lpTargetLoc=target;const activeState=lpGpsSyncRouteStateForPage(currentRelPath());const plan=lpBuildKnowledgeGpsPlan(activeGraph,target,{activeState});root.innerHTML=lpRenderKnowledgeGpsCard(activeGraph,plan,currentRelPath(),activeState);lpBindKnowledgeGpsActions(root,activeGraph,plan,target);try{typesetMathSafe([root]);}catch(_){}};modal.__lpOpen=(targetLoc)=>showKnowledgeGpsModal(window.__lpLearningPathGraph||graph,targetLoc||modal.dataset.lpTargetLoc||currentRelPath());return modal;}
function showKnowledgeGpsModal(graph,targetLoc){ensureGpsStylesOnce();ensureKnowledgeGpsModalStylesOnce();const modal=ensureKnowledgeGpsModal(graph);modal.__lpRender(graph,targetLoc);modal.style.display='flex';modal.classList.add('lp-open');try{modal.style.setProperty('z-index',String(LP_MAP_MODAL_Z),'important');}catch(_){}
modal.setAttribute('aria-hidden','false');setLpModalScrollLock(true);}
function hideKnowledgeGpsModal(){const modal=document.getElementById('lp-gps-modal');if(!modal||modal.style.display==='none')return;lpInstallClickShield(560);modal.classList.remove('lp-open');modal.setAttribute('aria-hidden','true');modal.style.display='none';setLpModalScrollLock(false);}
function ensureKnowledgeGpsModalStylesOnce(){if(document.getElementById('lp-gps-modal-style-v1'))return;const st=document.createElement('style');st.id='lp-gps-modal-style-v1';st.textContent=`
      #lp-gps-modal{
        position:fixed;
        inset:0;
        z-index:10020;
        display:none;
        align-items:center;
        justify-content:center;
        padding:14px;
        background: rgba(7,10,20,.44);
        backdrop-filter: blur(10px) saturate(1.06);
        -webkit-backdrop-filter: blur(10px) saturate(1.06);
      }
      #lp-gps-modal.lp-open{ display:flex; }
      #lp-gps-modal .lp-gps-mbox{
        position:relative;
        width:min(760px, calc(100vw - 20px));
        max-height:min(90vh, calc(100vh - 20px));
        border-radius:20px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: color-mix(in srgb, var(--md-default-bg-color) 78%, transparent);
        box-shadow:0 22px 60px rgba(0,0,0,.32);
        overflow:hidden;
      }
      #lp-gps-modal .lp-gps-mbody{
        overflow:auto;
        max-height:min(90vh, calc(100vh - 20px));
        padding:16px;
      }
      #lp-gps-modal .lp-gps-close{
        position:absolute;
        top:12px;
        right:12px;
        width:38px;
        height:38px;
        border:none;
        border-radius:999px;
        background: rgba(15,23,42,.08);
        color: inherit;
        cursor:pointer;
        z-index:2;
        font-size:1.1rem;
        line-height:1;
      }
      html[data-md-color-scheme="slate"] #lp-gps-modal .lp-gps-close,
      body[data-md-color-scheme="slate"] #lp-gps-modal .lp-gps-close{ background: rgba(255,255,255,.08); }
      #lp-gps-modal .lp-gps-close:hover{ background: rgba(99,102,241,.14); }
      #lp-gps-modal .lp-gps-card{ margin:0; }
      @media (max-width: 700px){
        #lp-gps-modal{ padding:0; align-items:stretch; justify-content:stretch; }
        #lp-gps-modal .lp-gps-mbox{
          width:100%;
          max-height:100%;
          border-radius:0;
          border:none;
        }
        #lp-gps-modal .lp-gps-mbody{
          max-height:100vh;
          padding:14px 14px 20px;
        }
        #lp-gps-modal .lp-gps-close{ top:10px; right:10px; }
      }
    `;document.head.appendChild(st);}
function ensureGpsStylesOnce(){if(document.getElementById('lp-gps-style-v3'))return;const old=document.getElementById('lp-gps-style-v1');if(old&&old.parentNode)old.parentNode.removeChild(old);const st=document.createElement('style');st.id='lp-gps-style-v3';st.textContent=`
    #lp-side-panel [data-lp-gps-root]{ margin-top:14px; }
    #lp-side-panel .lp-gps-card,
    #lp-gps-modal .lp-gps-card{
      border-radius:22px;
      padding:20px;
      color:inherit;
      background:linear-gradient(180deg, rgba(99,102,241,.07), rgba(15,23,42,.03));
    }
    html[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-card,
    body[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-card,
    #lp-gps-modal .lp-gps-card{
      background:linear-gradient(180deg, rgba(99,102,241,.12), rgba(15,23,42,.14));
    }
    #lp-side-panel .lp-gps-title,
    #lp-gps-modal .lp-gps-title{ font-size:1.42rem; font-weight:800; line-height:1.14; letter-spacing:-0.02em; }
    #lp-side-panel .lp-gps-sub,
    #lp-gps-modal .lp-gps-sub{ margin-top:6px; font-size:.9rem; line-height:1.45; opacity:.78; font-weight:500; max-width:42rem; }
    #lp-side-panel .lp-gps-stats,
    #lp-gps-modal .lp-gps-stats{ margin-top:14px; display:grid; gap:10px; grid-template-columns:repeat(3, minmax(0,1fr)); }
    #lp-side-panel .lp-gps-stat,
    #lp-gps-modal .lp-gps-stat{ border-radius:16px; padding:12px 14px; background:rgba(15,23,42,.045); }
    html[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-stat,
    body[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-stat,
    #lp-gps-modal .lp-gps-stat{ background:rgba(255,255,255,.045); }
    #lp-side-panel .lp-gps-stat-k,
    #lp-gps-modal .lp-gps-stat-k{ display:block; font-size:.8rem; opacity:.72; text-transform:none; font-weight:600; }
    #lp-side-panel .lp-gps-stat-v,
    #lp-gps-modal .lp-gps-stat-v{ display:block; margin-top:4px; font-size:.9rem; font-weight:600; line-height:1.32; }
    #lp-side-panel .lp-gps-actions,
    #lp-gps-modal .lp-gps-actions{ margin-top:16px; display:flex; gap:10px; flex-wrap:wrap; }
    #lp-side-panel .lp-gps-cta,
    #lp-gps-modal .lp-gps-cta{ appearance:none; border:1px solid rgba(129,140,248,.22); background:rgba(255,255,255,.05); color:inherit; border-radius:999px; padding:11px 16px; min-height:44px; display:inline-flex; align-items:center; gap:9px; font:inherit; font-size:.95rem; font-weight:700; cursor:pointer; box-shadow:0 8px 24px rgba(15,23,42,.06); }
    html[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-cta:not(.is-primary),
    body[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-cta:not(.is-primary),
    #lp-gps-modal .lp-gps-cta:not(.is-primary){ background:rgba(255,255,255,.045); }
    #lp-side-panel .lp-gps-cta,
    #lp-gps-modal .lp-gps-cta{ transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease, filter .18s ease; }
    #lp-side-panel .lp-gps-cta:hover,
    #lp-gps-modal .lp-gps-cta:hover{ border-color:rgba(129,140,248,.38); background:rgba(255,255,255,.08); transform:translateY(-2px); box-shadow:0 14px 28px rgba(15,23,42,.12); }
    #lp-side-panel .lp-gps-cta.is-primary,
    #lp-gps-modal .lp-gps-cta.is-primary{ background:linear-gradient(135deg, rgba(99,102,241,.20), rgba(99,102,241,.10)); border-color:rgba(99,102,241,.42); }
    #lp-side-panel .lp-gps-cta.is-primary:hover,
    #lp-gps-modal .lp-gps-cta.is-primary:hover{ filter:brightness(1.06) saturate(1.04); transform:translateY(-2px); box-shadow:0 16px 30px rgba(79,70,229,.18), 0 0 0 1px rgba(99,102,241,.18); }
    #lp-side-panel .lp-gps-cta-icon,
    #lp-gps-modal .lp-gps-cta-icon{ width:.96rem; height:.96rem; display:inline-flex; align-items:center; justify-content:center; flex:0 0 auto; }
    #lp-side-panel .lp-gps-cta-icon svg,
    #lp-gps-modal .lp-gps-cta-icon svg{ width:.96rem; height:.96rem; display:block; }
    #lp-side-panel .lp-gps-route,
    #lp-gps-modal .lp-gps-route{ margin-top:18px; display:grid; gap:16px; }
    #lp-side-panel .lp-gps-route-step,
    #lp-gps-modal .lp-gps-route-step{ display:grid; grid-template-columns:38px minmax(0,1fr); gap:14px; align-items:flex-start; }
    #lp-side-panel .lp-gps-route-rail,
    #lp-gps-modal .lp-gps-route-rail{ position:relative; display:flex; flex-direction:column; align-items:center; min-height:100%; }
    #lp-side-panel .lp-gps-route-dot,
    #lp-gps-modal .lp-gps-route-dot{ width:30px; height:30px; border-radius:999px; display:flex; align-items:center; justify-content:center; font-size:.84rem; font-weight:700; background:rgba(99,102,241,.14); color:inherit; }
    #lp-side-panel .lp-gps-route-line,
    #lp-gps-modal .lp-gps-route-line{ width:2px; flex:1 1 auto; min-height:28px; margin-top:8px; background:linear-gradient(180deg, rgba(129,140,248,.65), rgba(52,211,153,.45)); border-radius:999px; }
    #lp-side-panel .lp-gps-route-arrow,
    #lp-gps-modal .lp-gps-route-arrow{ margin-top:6px; font-size:.9rem; opacity:.58; }
    #lp-side-panel .lp-gps-route-card,
    #lp-gps-modal .lp-gps-route-card{ border-radius:18px; padding:16px 18px; background:rgba(15,23,42,.045); box-shadow:0 8px 24px rgba(15,23,42,.04); }
    #lp-side-panel .lp-gps-route-step.is-current-page .lp-gps-route-card,
    #lp-gps-modal .lp-gps-route-step.is-current-page .lp-gps-route-card{ border:1px solid rgba(16,185,129,.24); background:linear-gradient(180deg, rgba(16,185,129,.10), rgba(255,255,255,.04)); }
    html[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-route-card,
    body[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-route-card,
    #lp-gps-modal .lp-gps-route-card{ background:rgba(255,255,255,.045); box-shadow:none; }
    html[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-route-step.is-current-page .lp-gps-route-card,
    body[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-route-step.is-current-page .lp-gps-route-card,
    #lp-gps-modal .lp-gps-route-step.is-current-page .lp-gps-route-card{ background:linear-gradient(180deg, rgba(16,185,129,.12), rgba(255,255,255,.05)); }
    #lp-side-panel .lp-gps-route-top,
    #lp-gps-modal .lp-gps-route-top{ display:none; }
    #lp-side-panel .lp-gps-step-label,
    #lp-gps-modal .lp-gps-step-label{ display:none; }
    #lp-side-panel .lp-gps-route-title,
    #lp-gps-modal .lp-gps-route-title{ margin-top:0; font-size:1rem; line-height:1.24; font-weight:700; display:flex; align-items:center; gap:9px; flex-wrap:wrap; }
    #lp-side-panel .lp-gps-current-title,
    #lp-gps-modal .lp-gps-current-title{ color:inherit; font-weight:750; }
    #lp-side-panel .lp-gps-current-badge,
    #lp-gps-modal .lp-gps-current-badge{ display:inline-flex; align-items:center; border-radius:999px; padding:2px 8px; font-size:.72rem; line-height:1.2; font-weight:800; letter-spacing:.01em; background:rgba(16,185,129,.12); color:rgb(5,150,105); border:1px solid rgba(16,185,129,.24); white-space:nowrap; }
    #lp-side-panel .lp-gps-node-link,
    #lp-gps-modal .lp-gps-node-link,
    #lp-side-panel .lp-gps-chip-link,
    #lp-gps-modal .lp-gps-chip-link,
    #lp-side-panel .lp-gps-inline-link,
    #lp-gps-modal .lp-gps-inline-link{ color:var(--md-accent-fg-color); text-decoration:underline; text-decoration-color:rgba(129,140,248,.35); text-underline-offset:.14em; font-weight:650; }
    #lp-side-panel .lp-gps-node-link:hover,
    #lp-gps-modal .lp-gps-node-link:hover,
    #lp-side-panel .lp-gps-chip-link:hover,
    #lp-gps-modal .lp-gps-chip-link:hover,
    #lp-side-panel .lp-gps-inline-link:hover,
    #lp-gps-modal .lp-gps-inline-link:hover{ text-decoration-color:currentColor; }
    #lp-side-panel .lp-gps-step-link,
    #lp-gps-modal .lp-gps-step-link{ appearance:none; border:0; background:none; padding:0; margin:0; color:var(--md-accent-fg-color); text-decoration:underline; text-decoration-color:rgba(129,140,248,.35); text-underline-offset:.14em; font:inherit; font-weight:650; cursor:pointer; text-align:left; }
    #lp-side-panel .lp-gps-step-link:hover,
    #lp-gps-modal .lp-gps-step-link:hover{ text-decoration-color:currentColor; }
    #lp-side-panel .lp-gps-route-actions,
    #lp-gps-modal .lp-gps-route-actions{ display:none; }
    #lp-side-panel .lp-gps-open-step-btn,
    #lp-gps-modal .lp-gps-open-step-btn{ display:none; }

    #lp-side-panel .lp-gps-target-title,
    #lp-gps-modal .lp-gps-target-title,
    #lp-side-panel .lp-gps-target-inline,
    #lp-gps-modal .lp-gps-target-inline{ color:inherit; font-weight:650; }
    #lp-side-panel .lp-gps-route-meta,
    #lp-gps-modal .lp-gps-route-meta{ margin-top:8px; display:flex; align-items:center; gap:9px; flex-wrap:nowrap; min-width:0; font-size:.8rem; line-height:1.35; opacity:.88; }
    #lp-side-panel .lp-gps-meta-pill,
    #lp-gps-modal .lp-gps-meta-pill{ display:inline-flex; align-items:center; flex:0 0 auto; border-radius:999px; padding:3px 9px; background:rgba(255,255,255,.06); border:1px solid rgba(129,140,248,.16); font-weight:650; white-space:nowrap; }
    #lp-side-panel .lp-gps-meta-course,
    #lp-gps-modal .lp-gps-meta-course{ margin-left:auto; flex:1 1 auto; min-width:0; text-align:right; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:.78; }
    #lp-side-panel .lp-gps-route-why,
    #lp-gps-modal .lp-gps-route-why,
    #lp-side-panel .lp-gps-supports,
    #lp-gps-modal .lp-gps-supports,
    #lp-side-panel .lp-gps-node-badge,
    #lp-gps-modal .lp-gps-node-badge{ display:none !important; }
    #lp-side-panel .lp-gps-route-step.is-learn .lp-gps-route-dot,
    #lp-gps-modal .lp-gps-route-step.is-learn .lp-gps-route-dot{ background:rgba(239,68,68,.16); color:rgb(153,27,27); }
    #lp-side-panel .lp-gps-route-step.is-review .lp-gps-route-dot,
    #lp-gps-modal .lp-gps-route-step.is-review .lp-gps-route-dot{ background:rgba(245,158,11,.18); color:rgb(146,64,14); }
    #lp-side-panel .lp-gps-route-step.is-target .lp-gps-route-dot,
    #lp-gps-modal .lp-gps-route-step.is-target .lp-gps-route-dot,
    #lp-side-panel .lp-gps-route-step.is-target-card .lp-gps-route-dot,
    #lp-gps-modal .lp-gps-route-step.is-target-card .lp-gps-route-dot{ background:rgba(16,185,129,.16); color:rgb(4,120,87); }
    #lp-side-panel .lp-gps-route-step.is-current-page .lp-gps-route-dot,
    #lp-gps-modal .lp-gps-route-step.is-current-page .lp-gps-route-dot{ background:rgba(16,185,129,.18); color:rgb(4,120,87); box-shadow:0 0 0 3px rgba(16,185,129,.12); }
    #lp-side-panel .lp-gps-route-step.is-solid .lp-gps-route-dot,
    #lp-gps-modal .lp-gps-route-step.is-solid .lp-gps-route-dot{ background:rgba(99,102,241,.16); }
    #lp-side-panel .lp-gps-node-badge.is-learn,
    #lp-gps-modal .lp-gps-node-badge.is-learn{ background:rgba(239,68,68,.10); color:rgb(185,28,28); border-color:rgba(239,68,68,.18); }
    #lp-side-panel .lp-gps-node-badge.is-review,
    #lp-gps-modal .lp-gps-node-badge.is-review{ background:rgba(245,158,11,.12); color:rgb(180,83,9); border-color:rgba(245,158,11,.2); }
    #lp-side-panel .lp-gps-node-badge.is-target,
    #lp-gps-modal .lp-gps-node-badge.is-target,
    #lp-side-panel .lp-gps-node-badge.is-solid,
    #lp-gps-modal .lp-gps-node-badge.is-solid{ background:rgba(99,102,241,.12); color:rgb(67,56,202); border-color:rgba(99,102,241,.2); }
    #lp-side-panel .lp-gps-extra,
    #lp-gps-modal .lp-gps-extra{ display:none !important; }
    #lp-side-panel .lp-gps-mini-row,
    #lp-gps-modal .lp-gps-mini-row{ padding:7px 0; border-bottom:1px dashed rgba(125,125,155,.14); font-size:.9rem; }
    #lp-side-panel .lp-gps-mini-row:last-child,
    #lp-gps-modal .lp-gps-mini-row:last-child{ border-bottom:none; }
    #lp-side-panel .lp-gps-empty,
    #lp-gps-modal .lp-gps-empty{ font-size:.9rem; line-height:1.55; opacity:.7; }
    #lp-side-panel .lp-gps-run-box{ margin-top:12px; border-radius:14px; padding:11px 12px; background:rgba(255,255,255,.035); }
    #lp-side-panel .lp-gps-run-top{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
    #lp-side-panel .lp-gps-run-kicker{ font-size:.72rem; font-weight:600; opacity:.7; }
    #lp-side-panel .lp-gps-run-step{ font-size:.72rem; opacity:.62; }
    #lp-side-panel .lp-gps-run-title{ margin-top:5px; font-size:.86rem; font-weight:600; }
    #lp-side-panel .lp-gps-run-note{ margin-top:3px; font-size:.82rem; line-height:1.42; opacity:.74; }
    @media (max-width: 720px){
      #lp-side-panel .lp-gps-stats,
      #lp-gps-modal .lp-gps-stats{ grid-template-columns:1fr; }
      #lp-side-panel .lp-gps-route-title,
      #lp-gps-modal .lp-gps-route-title{ font-size:.98rem; }
    }
  `;document.head.appendChild(st);}
function injectStylesOnce(){if(document.getElementById("lp-style-v2"))return;const st=document.createElement("style");st.id="lp-style-v2";st.textContent=`
   
      /* hard isolation: prevent global pseudo-icons inside panel */
            /* prevent global pseudo-icons inside panel (targeted) */
      #lp-side-panel summary.lp-sum::before,
      #lp-side-panel summary.lp-sum::after,
      #lp-side-panel .lp-head::before,
      #lp-side-panel .lp-head::after{ content:none !important; display:none !important; }
      #lp-side-panel summary.lp-sum::marker{ content:"" !important; }
      #lp-side-panel summary.lp-sum::-webkit-details-marker{ display:none !important; }


      /* modal isolation */
            /* prevent global pseudo-icons inside modal (targeted) */
      #lp-map-modal .lp-mhdr::before,
      #lp-map-modal .lp-mhdr::after{ content:none !important; display:none !important; }
      #lp-map-modal summary::marker{ content:"" !important; }


      #lp-side-panel{
        box-sizing:border-box;
        max-width:100%;
        margin:0 0 .8rem 0;
        padding:.8rem .8rem;
        border-radius:18px;
        border:1px solid var(--md-default-fg-color--lightest);
        /* match local-map hover colours */
        --lp-pre:  rgb(16, 185, 129);  /* prerequisites green */
        --lp-post: rgb(96, 165, 250);  /* dependents blue */
        --lp-rel:  rgb(167, 139, 250); /* related concepts purple */
        background:
          radial-gradient(900px 480px at 85% 0%, rgba(99,102,241,.14), rgba(99,102,241,0)),
          radial-gradient(900px 480px at 0% 25%, rgba(16,185,129,.10), rgba(16,185,129,0)),
          linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
        box-shadow:none;
      }
      /* vTheme: interface themes should not create a separate right-sidebar
         floor, but the Learning path itself should remain a visible panel with
         a clean border and no shadow. */
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__scrollwrap,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__inner,
      html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback,
      html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback .md-sidebar__scrollwrap,
      html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback .md-sidebar__inner{
        background:transparent !important;
        background-image:none !important;
        border-color:transparent !important;
        box-shadow:none !important;
        outline:0 !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-interface-theme^="ui_theme_"] #lp-side-panel{
        background:var(--mk-theme-sidebar-card-bg, color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%)) !important;
        background-image:none !important;
        border-color:var(--mk-theme-sidebar-border, var(--md-default-fg-color--lightest)) !important;
        box-shadow:none !important;
        outline:0 !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-interface-theme^="ui_theme_"] #lp-side-panel::before,
      html[data-mk-interface-theme^="ui_theme_"] #lp-side-panel::after,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active::before,
      html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active::after,
      html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback::before,
      html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback::after{
        content:none !important;
        display:none !important;
        background:none !important;
        box-shadow:none !important;
      }
      /* Keep the stable first-paint shell visible while graph/math enrichment is
         still running. Only interaction is gated until the real panel is ready. */
      #lp-side-panel.lp-pending{ opacity:1; pointer-events:none; }
#lp-side-panel{ font-size:1.03em; } 

@media (min-width: 901px){
  .md-sidebar--secondary.lp-secondary-host-active,
  .lp-secondary-fallback{
    display:block !important;
    visibility:visible !important;
    opacity:1 !important;
    width:15.5rem !important;
    flex:0 0 15.5rem !important;
    max-width:15.5rem !important;
    order:3 !important;
    align-self:stretch !important;
    box-sizing:border-box !important;
  }
  .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__inner,
  .lp-secondary-fallback .md-sidebar__inner{
    display:block !important;
    visibility:visible !important;
  }
  .md-sidebar--secondary.lp-secondary-host-active .md-nav--secondary{
    display:none !important;
  }
  .lp-secondary-fallback{
    position:relative !important;
    padding:0 .6rem !important;
  }
  .lp-secondary-fallback .md-sidebar__scrollwrap{
    height:auto !important;
    max-height:none !important;
    overflow:visible !important;
  }
  .lp-secondary-fallback .md-sidebar__inner{
    position:sticky !important;
    top:4.8rem !important;
    max-height:calc(100vh - 5.2rem) !important;
    overflow:auto !important;
    scrollbar-gutter:stable;
  }
}
@media (max-width: 900px){
  .lp-secondary-fallback{ display:none !important; }
}

      #lp-side-panel .lp-head{
  display:block;
  width:100%;
  margin-bottom:.55rem;
}
#lp-side-panel .lp-head .lp-head-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:.65rem;
}
#lp-side-panel .lp-head .lp-title{ flex:1 1 auto; }
#lp-side-panel .lp-head .lp-title{
  display:block;
  width:100%;
  font-weight:800;
  letter-spacing:-.01em;
  opacity:.95;
  font-size:clamp(1.05rem, 1.35vw, 1.32rem);
  line-height:1.16;
  white-space:nowrap;
}


      /* section accordion */
      #lp-side-panel details.lp-acc{ border-top:1px solid var(--md-default-fg-color--lightest); padding-top:.55rem; margin-top:.55rem; }
      #lp-side-panel summary.lp-sum{ list-style:none; display:flex; align-items:center; justify-content:space-between; cursor:pointer; user-select:none; gap:.6rem; }
      #lp-side-panel summary.lp-sum .lp-sum-left{ font-weight:780; opacity:.95; font-size:1.2em; }
      /* make the first section title slightly larger (Move forward) */
      #lp-side-panel details.lp-forward summary.lp-sum .lp-sum-left{ font-size:1.2em; }
      #lp-side-panel summary.lp-sum .lp-sum-right{
        opacity:.74;
        font-size:.9em;
        display:inline-flex;
        align-items:center;
        justify-content:flex-end;
        gap:.35rem;
        flex:0 0 auto;
      }
      #lp-side-panel summary.lp-sum .lp-sum-chevron{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:1.35rem;
        height:1.35rem;
        border-radius:999px;
        color:currentColor;
        transform:rotate(-90deg);
        transition:transform .16s ease, opacity .16s ease, background-color .16s ease;
        opacity:.82;
      }
      #lp-side-panel summary.lp-sum .lp-sum-chevron svg{
        width:1.05rem;
        height:1.05rem;
        display:block;
      }
      #lp-side-panel details[open] > summary.lp-sum .lp-sum-chevron{ transform:rotate(0deg); }
      #lp-side-panel summary.lp-sum:hover .lp-sum-chevron{
        opacity:1;
        background:rgba(99,102,241,.10);
      }

      /* vFinal: real, always-visible section chevrons. The earlier global
         pseudo-icon reset intentionally hides ::after, so these are DOM icons. */
      #lp-side-panel summary.lp-sum .lp-sum-chevron{
        display:inline-flex !important;
        visibility:visible !important;
        opacity:.92 !important;
        transform:rotate(0deg) !important;
      }
      #lp-side-panel details.lp-acc[open] > summary.lp-sum .lp-sum-chevron{
        transform:rotate(180deg) !important;
      }
      #lp-mobile-sheet #lp-side-panel summary.lp-sum{
        position:relative;
        padding-right:2.05rem;
      }
      #lp-mobile-sheet #lp-side-panel summary.lp-sum .lp-sum-right{
        position:absolute;
        right:.05rem;
        top:50%;
        transform:translateY(-50%);
        display:inline-flex !important;
        align-items:center;
        justify-content:center;
        color:currentColor;
        opacity:.96 !important;
      }
      #lp-mobile-sheet #lp-side-panel summary.lp-sum .lp-sum-chevron{
        width:1.55rem;
        height:1.55rem;
        background:color-mix(in srgb, currentColor 10%, transparent);
      }

      #lp-side-panel .lp-body{ margin-top:.55rem; overflow:hidden; }
      @media (min-width:901px){
        #lp-side-panel details.lp-acc .lp-body{ transition:max-height .24s ease, opacity .20s ease, margin-top .20s ease; will-change:max-height,opacity; }
        #lp-side-panel details.lp-acc:not([open]) .lp-body{ max-height:0 !important; opacity:0; margin-top:0; }
        #lp-side-panel details.lp-acc[open] .lp-body{ opacity:1; }
      }
      #lp-side-panel .lp-empty{ opacity:.75; font-size:.95em; padding:.35rem .2rem; }


/* dependents: optional expanded list */
#lp-side-panel details.lp-subacc{
  margin-top:.55rem;
  padding-top:.4rem;
  border-top:1px solid var(--md-default-fg-color--lightest);
}
#lp-side-panel summary.lp-subsum .lp-sum-left{ font-size:1.05em; }
#lp-side-panel .lp-sort-note{
  margin-top:.55rem;
  opacity:.65;
  font-size:.86em;
  line-height:1.25;
}

      #lp-side-panel .lp-mini{ display:flex; align-items:center; justify-content:space-between; gap:.6rem; }
      #lp-side-panel .lp-mini .lp-mini-note{ opacity:.72; font-size:.92em; }

      /* local map section */
      #lp-side-panel .lp-local{ border-top:1px solid var(--md-default-fg-color--lightest); padding-top:.55rem; margin-top:.55rem; }
      #lp-side-panel .lp-local-row{ display:flex; align-items:center; justify-content:space-between; gap:.65rem; }
      #lp-side-panel .lp-local-title{ font-weight:780; opacity:.95; font-size:1.2em; }
      #lp-side-panel .lp-local-actions{ display:inline-flex; align-items:center; gap:.5rem; flex:0 0 auto; }
      #lp-side-panel .lp-local-sep{ margin-top:.9rem; padding-top:.85rem; border-top:1px solid var(--md-default-fg-color--lightest); }
      #lp-side-panel .lp-gps-entry-note{ margin-top:.55rem; opacity:.72; font-size:.92em; line-height:1.35; }
      #lp-side-panel .lp-fog-row{
        margin-top:.7rem;
        display:flex; align-items:center; justify-content:space-between; gap:.8rem;
      }
      #lp-side-panel .lp-fog-copy{ min-width:0; flex:1 1 auto; }
      #lp-side-panel .lp-fog-title{ display:block; font-weight:760; line-height:1.15; }
      #lp-side-panel .lp-fog-note{ display:block; margin-top:.14rem; opacity:.68; font-size:.9em; line-height:1.2; }
      #lp-side-panel .lp-ios-switch{ position:relative; display:inline-flex; align-items:center; flex:0 0 auto; cursor:pointer; -webkit-tap-highlight-color:transparent; }
      #lp-side-panel .lp-ios-switch input{ position:absolute; inset:0; opacity:0; width:100%; height:100%; margin:0; cursor:pointer; }
      #lp-side-panel .lp-ios-switch-ui{
        position:relative; display:block; width:46px; height:26px; border-radius:999px;
        background: linear-gradient(180deg, rgba(238,240,242,.92), rgba(218,221,225,.92));
        border:1px solid rgba(148,163,184,.60);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.45), 0 1px 5px rgba(15,23,42,.18);
        transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
      }
      #lp-side-panel .lp-ios-switch-ui::after{
        content:""; position:absolute; top:50%; left:2px; width:20px; height:20px; border-radius:999px;
        transform:translateY(-50%);
        background:#fff; box-shadow:0 1px 5px rgba(15,23,42,.28);
        transition: transform .18s ease, box-shadow .18s ease;
      }
      #lp-side-panel .lp-ios-switch input:checked + .lp-ios-switch-ui{
        background: linear-gradient(180deg, rgba(67,219,103,.98), rgba(34,197,94,.94));
        border-color: rgba(34,197,94,.72);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.28), 0 1px 5px rgba(15,23,42,.18);
      }
      #lp-side-panel .lp-ios-switch input:checked + .lp-ios-switch-ui::after{ transform: translate(20px,-50%); }
      #lp-side-panel .lp-ios-switch input:focus-visible + .lp-ios-switch-ui{ outline:2px solid rgba(255,255,255,.28); outline-offset:3px; }
      #lp-side-panel .lp-btn{
        appearance:none; border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
        color: var(--md-default-fg-color);
        border-radius:12px; padding:.35rem .55rem; font-weight:780;
        cursor:pointer;
      }
      #lp-side-panel .lp-btn:hover{ border-color: var(--md-accent-fg-color); background: rgba(99,102,241,.10); }

      /* list rows */
      #lp-side-panel a.lp-row{
  display:grid;
  grid-template-columns: 1.18em 1fr;  /* status icon column */
  gap:.55rem;
  align-items:start;

  padding:.45rem .5rem .45rem 0;    /* keep icon aligned to the old number position */
  border-radius:12px;
  text-decoration:none;
  border:1px solid transparent;
}
#lp-side-panel .lp-rank{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:1.18em;
  height:1.18em;
  margin-top:.03em;
  color: color-mix(in srgb, var(--md-default-fg-color) 58%, transparent);
  line-height:1;
}
#lp-side-panel .lp-rank svg{
  width:1.08em;
  height:1.08em;
  display:block;
  flex:0 0 auto;
}
#lp-side-panel .lp-rank[data-lp-state="not-viewed"]{
  color: color-mix(in srgb, var(--md-default-fg-color) 46%, transparent);
  opacity:.82;
}
#lp-side-panel .lp-rank[data-lp-state="viewed-unrated"]{
  color: rgba(125, 211, 252, .96);
  filter: drop-shadow(0 0 6px rgba(125,211,252,.18));
}
#lp-side-panel .lp-rank[data-lp-state="m0"]{
  color: rgba(248, 113, 113, .96);
  filter: drop-shadow(0 0 6px rgba(248,113,113,.18));
}
#lp-side-panel .lp-rank[data-lp-state="m1"]{
  /* "Unclear" is a neutral state. Gold is reserved for m3/mastered. */
  color: color-mix(in srgb, var(--md-default-fg-color) 92%, transparent);
  filter: none;
}
#lp-side-panel .lp-rank[data-lp-state="m2"]{
  color: rgba(210, 220, 236, .99);
  filter:
    drop-shadow(0 0 3px rgba(214,223,237,.26))
    drop-shadow(0 0 8px rgba(220,229,242,.30))
    drop-shadow(0 0 14px rgba(220,229,242,.18));
}
#lp-side-panel .lp-rank[data-lp-state="m3"]{
  color: rgba(226, 179, 54, .99);
  filter:
    drop-shadow(0 0 4px rgba(234,188,62,.34))
    drop-shadow(0 0 10px rgba(246,207,90,.42))
    drop-shadow(0 0 18px rgba(246,207,90,.28));
}
#lp-side-panel a.lp-row:hover .lp-rank[data-lp-state="m2"]{
  filter:
    drop-shadow(0 0 4px rgba(214,223,237,.34))
    drop-shadow(0 0 10px rgba(220,229,242,.38))
    drop-shadow(0 0 18px rgba(220,229,242,.24));
}
#lp-side-panel a.lp-row:hover .lp-rank[data-lp-state="m3"]{
  filter:
    drop-shadow(0 0 5px rgba(234,188,62,.42))
    drop-shadow(0 0 13px rgba(246,207,90,.54))
    drop-shadow(0 0 22px rgba(246,207,90,.34));
}

#lp-side-panel .lp-icon-btn,
#lp-mobile-sheet .lp-msheet-iconbtn{
  appearance:none;
  border:1px solid var(--md-default-fg-color--lightest);
  background: rgba(255,255,255,.04);
  color: var(--md-default-fg-color);
  width:40px;
  height:40px;
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:0;
  cursor:pointer;
  opacity:.9;
  user-select:none;
  line-height:0;
  box-shadow:none;
  transform:none;
}

#lp-side-panel .lp-icon-btn:hover,
#lp-mobile-sheet .lp-msheet-iconbtn:hover{
  border-color: var(--md-accent-fg-color);
  background: rgba(99,102,241,.10);
  opacity:1;
  transform:none;
  box-shadow:none;
}

#lp-side-panel .lp-icon-btn:focus-visible,
#lp-mobile-sheet .lp-msheet-iconbtn:focus-visible{
  outline: 2px solid rgba(255,255,255,.28);
  outline-offset: 3px;
}

#lp-side-panel .lp-icon-btn svg,
#lp-mobile-sheet .lp-msheet-iconbtn svg{
  width:24px;
  height:24px;
  display:block;
  color: inherit !important;
  filter:none !important;
}

#lp-side-panel .lp-icon-btn svg,
#lp-side-panel .lp-icon-btn svg *,
#lp-side-panel .lp-icon-btn svg path,
#lp-side-panel .lp-icon-btn svg line,
#lp-side-panel .lp-icon-btn svg polyline,
#lp-mobile-sheet .lp-msheet-iconbtn svg,
#lp-mobile-sheet .lp-msheet-iconbtn svg *,
#lp-mobile-sheet .lp-msheet-iconbtn svg path,
#lp-mobile-sheet .lp-msheet-iconbtn svg line,
#lp-mobile-sheet .lp-msheet-iconbtn svg polyline{
  stroke: currentColor !important;
  fill: none !important;
  filter:none !important;
}

#lp-side-panel .lp-gps-open svg circle:last-of-type,
#lp-mobile-sheet [data-lp-ms-opengps] svg circle:last-of-type{
  fill: currentColor !important;
  stroke: none !important;
}

html[data-md-color-scheme="slate"] #lp-side-panel .lp-icon-btn,
body[data-md-color-scheme="slate"] #lp-side-panel .lp-icon-btn,
html[data-md-color-scheme="slate"] #lp-mobile-sheet .lp-msheet-iconbtn,
body[data-md-color-scheme="slate"] #lp-mobile-sheet .lp-msheet-iconbtn{
  color: #fff !important;
  border-color: rgba(255,255,255,.16) !important;
  background: rgba(255,255,255,.04) !important;
}

html[data-md-color-scheme="slate"] #lp-side-panel .lp-icon-btn:hover,
body[data-md-color-scheme="slate"] #lp-side-panel .lp-icon-btn:hover,
html[data-md-color-scheme="slate"] #lp-mobile-sheet .lp-msheet-iconbtn:hover,
body[data-md-color-scheme="slate"] #lp-mobile-sheet .lp-msheet-iconbtn:hover{
  color: #fff !important;
}
html[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-open svg,
html[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-open svg *,
body[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-open svg,
body[data-md-color-scheme="slate"] #lp-side-panel .lp-gps-open svg *,
html[data-md-color-scheme="slate"] #lp-mobile-sheet [data-lp-ms-opengps] svg,
html[data-md-color-scheme="slate"] #lp-mobile-sheet [data-lp-ms-opengps] svg *,
body[data-md-color-scheme="slate"] #lp-mobile-sheet [data-lp-ms-opengps] svg,
body[data-md-color-scheme="slate"] #lp-mobile-sheet [data-lp-ms-opengps] svg *{
  color:#fff !important;
  stroke:currentColor !important;
  filter:none !important;
}

article.md-content__inner .lp-h1-routebar{
  margin-top:10px;
  --lp-h1-route-ink: var(--md-default-fg-color);
}
article.md-content__inner .lp-h1-route-track{
  display:flex;
  align-items:center;
  gap:.42rem;
  flex-wrap:wrap;
  min-height:30px;
}
article.md-content__inner .lp-h1-route-label{
  display:inline-flex;
  align-items:center;
  font-size:.82rem;
  font-weight:500;
  letter-spacing:0;
  opacity:.9;
}
article.md-content__inner .lp-h1-route-target{
  position:relative;
  display:inline-flex;
  align-items:center;
  min-height:20px;
  padding:.18rem .54rem;
  border-radius:999px;
  border:1px solid rgba(16,185,129,.34);
  background:rgba(255,255,255,.04);
  color:var(--lp-h1-route-ink, var(--md-default-fg-color));
  font-size:.72rem;
  font-weight:500;
  line-height:1.1;
  text-decoration:none;
  transition:border-color .15s ease, background .15s ease, transform .15s ease, box-shadow .15s ease;
  overflow:visible;
}
article.md-content__inner .lp-h1-route-target-text{
  display:inline-flex;
  align-items:center;
  font-weight:500;
}
article.md-content__inner .lp-h1-route-target-pin{
  position:absolute;
  left:50%;
  bottom:100%;
  width:16px;
  height:16px;
  margin-bottom:3px;
  transform:translateX(-50%);
  display:inline-flex;
  align-items:center;
  justify-content:center;
  color:#ef4444;
  pointer-events:none;
}
article.md-content__inner .lp-h1-route-target-pin svg{
  width:18px;
  height:18px;
  display:block;
}
article.md-content__inner .lp-h1-route-target-pin svg path{
  stroke:currentColor;
  fill:none;
}
article.md-content__inner .lp-h1-route-target-pin svg circle{
  fill:currentColor;
  stroke:none;
}
article.md-content__inner .lp-h1-route-target:hover{
  border-color:var(--md-accent-fg-color);
  background:rgba(99,102,241,.1);
  transform:translateY(-1px);
}
article.md-content__inner .lp-h1-route-target.is-current{
  border-color:rgba(16,185,129,.42);
  box-shadow:0 0 0 1px rgba(16,185,129,.14) inset;
}
article.md-content__inner .lp-h1-route-target .MathJax,
article.md-content__inner .lp-h1-route-target mjx-container{
  font-size:.96em !important;
}
article.md-content__inner .lp-h1-route-target-text.lp-math-pending{
  visibility:hidden;
}
article.md-content__inner .lp-h1-route-target-text .lp-h1-route-text-part,
article.md-content__inner .lp-h1-route-target-text .lp-h1-route-math-part{
  display:inline;
}
article.md-content__inner .lp-h1-route-target-text .lp-h1-route-math-part[data-lp-pad-left="1"]{
  margin-left:.18em;
}
article.md-content__inner .lp-h1-route-target-text .lp-h1-route-math-part[data-lp-pad-right="1"]{
  margin-right:.18em;
}
article.md-content__inner .lp-h1-route-target-text > mjx-container:not(:first-child),
article.md-content__inner .lp-h1-route-target-text > .MathJax:not(:first-child),
article.md-content__inner .lp-h1-route-target-text .lp-h1-route-math-part > mjx-container:not(:first-child),
article.md-content__inner .lp-h1-route-target-text .lp-h1-route-math-part > .MathJax:not(:first-child){
  margin-left:.14em;
}
article.md-content__inner .lp-h1-route-dots{
  display:inline-flex;
  align-items:center;
  gap:.42rem;
}
article.md-content__inner .lp-h1-route-stop{
  position:relative;
  appearance:none;
  border:1px solid rgba(125,125,155,.22);
  background:rgba(255,255,255,.04);
  color:var(--lp-h1-route-ink, var(--md-default-fg-color));
  border-radius:999px;
  width:22px;
  height:22px;
  padding:0;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  text-decoration:none;
  line-height:0;
  transition:border-color .15s ease, background .15s ease, transform .15s ease, box-shadow .15s ease;
}
article.md-content__inner .lp-h1-route-stop .lp-h1-route-dotcore{
  width:6px;
  height:6px;
  border-radius:999px;
  background:currentColor;
  opacity:.92;
}
article.md-content__inner .lp-h1-route-stop.is-start{
  border-color:rgba(99,102,241,.28);
}
article.md-content__inner .lp-h1-route-stop.is-start .lp-h1-route-dotcore{
  width:5px;
  height:5px;
  box-shadow:0 0 0 3px rgba(99,102,241,.18);
}
article.md-content__inner .lp-h1-route-stop.is-end{
  border-color:rgba(16,185,129,.32);
}
article.md-content__inner .lp-h1-route-stop.is-end::before{
  content:"";
  position:absolute;
  inset:5px;
  border-radius:999px;
  border:1.6px solid currentColor;
  opacity:.82;
}
article.md-content__inner .lp-h1-route-stop.is-end .lp-h1-route-dotcore{
  width:4px;
  height:4px;
}
article.md-content__inner .lp-h1-route-stop.is-current{
  width:22px;
  height:22px;
  border-color:rgba(125,125,155,.22);
  background:rgba(255,255,255,.04);
}
article.md-content__inner .lp-h1-route-marker{
  display:inline-flex;
  width:20px;
  height:20px;
  align-items:center;
  justify-content:center;
}
article.md-content__inner .lp-h1-route-marker-svg{
  width:24px;
  height:24px;
  display:block;
  overflow:visible;
}
article.md-content__inner .lp-h1-route-marker-svg{
  color:currentColor;
}
article.md-content__inner .lp-h1-route-marker-svg path{
  fill:currentColor;
}
article.md-content__inner .lp-h1-route-stop:hover{
  border-color:var(--md-accent-fg-color);
  background:rgba(99,102,241,.1);
  transform:translateY(-1px);
}
article.md-content__inner .lp-h1-route-arrow{
  opacity:.72;
  font-size:.96rem;
  line-height:1;
  color:var(--lp-h1-route-ink, var(--md-default-fg-color)) !important;
}
article.md-content__inner .lp-h1-route-arrow svg,
article.md-content__inner .lp-h1-route-arrow svg *,
article.md-content__inner .lp-h1-route-stop svg,
article.md-content__inner .lp-h1-route-stop svg *{
  color:currentColor !important;
  stroke:currentColor !important;
}
article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow{
  color:var(--lp-h1-route-ink, var(--md-default-fg-color)) !important;
}
article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow svg,
article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow svg *,
article.md-content__inner .lp-h1-routebar .lp-h1-route-stop svg,
article.md-content__inner .lp-h1-routebar .lp-h1-route-stop svg *{
  color:currentColor !important;
  stroke:currentColor !important;
}
article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow svg [fill]:not([fill="none"]),
article.md-content__inner .lp-h1-routebar .lp-h1-route-stop svg [fill]:not([fill="none"]){
  fill:currentColor !important;
}
article.md-content__inner .lp-sr-only{
  position:absolute;
  width:1px;
  height:1px;
  margin:-1px;
  padding:0;
  overflow:hidden;
  clip:rect(0 0 0 0);
  clip-path:inset(50%);
  border:0;
  white-space:nowrap;
}
html[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-stop,
body[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-stop{
  color:var(--lp-h1-route-ink, var(--md-default-fg-color)) !important;
  border-color:rgba(255,255,255,.16) !important;
  background:rgba(255,255,255,.04) !important;
}
html[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-stop.is-current,
body[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-stop.is-current{
  border-color:rgba(255,255,255,.16) !important;
  background:rgba(255,255,255,.04) !important;
}
html[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-stop.is-start .lp-h1-route-dotcore,
body[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-stop.is-start .lp-h1-route-dotcore{
  box-shadow:0 0 0 3px rgba(129,140,248,.22);
}
html[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-stop.is-end,
body[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-stop.is-end{
  border-color:rgba(52,211,153,.28) !important;
}
html[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-target,
body[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-target{
  color:var(--lp-h1-route-ink, var(--md-default-fg-color)) !important;
  border-color:rgba(52,211,153,.28) !important;
  background:rgba(255,255,255,.04) !important;
}
html[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-target.is-current,
body[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-target.is-current{
  border-color:rgba(52,211,153,.38) !important;
  box-shadow:0 0 0 1px rgba(52,211,153,.16) inset;
}
html[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-arrow,
body[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-route-arrow{
  color:var(--lp-h1-route-ink, var(--md-default-fg-color)) !important;
  opacity:.72 !important;
}
@media (max-width: 768px), (hover: none) and (pointer: coarse){
  article.md-content__inner .lp-h1-routebar{
    overflow-x:auto;
    padding-bottom:2px;
    -webkit-overflow-scrolling:touch;
  }
  article.md-content__inner .lp-h1-route-track{
    flex-wrap:nowrap;
    min-width:max-content;
  }
  article.md-content__inner .lp-h1-route-label{
    display:none !important;
  }
  article.md-content__inner .lp-h1-route-target,
  article.md-content__inner .lp-h1-route-target-text{
    font-size:.8rem;
  }
  article.md-content__inner .lp-h1-route-target--icon{
    min-height:22px;
    width:22px;
    padding:0;
    border:0;
    background:transparent;
    box-shadow:none;
  }
  article.md-content__inner .lp-h1-route-target--icon:hover{
    transform:none;
    background:transparent;
    border-color:transparent;
    box-shadow:none;
  }
  article.md-content__inner .lp-h1-route-target--icon.is-current{
    border:0;
    box-shadow:none;
  }
  article.md-content__inner .lp-h1-route-target--icon .lp-h1-route-target-icon{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    width:18px;
    height:18px;
    color:#ef4444;
  }
  article.md-content__inner .lp-h1-route-target--icon .lp-h1-route-target-icon svg{
    width:18px;
    height:18px;
    display:block;
  }
  article.md-content__inner .lp-h1-route-target--icon .lp-h1-route-target-icon svg path{
    stroke:currentColor;
    fill:none;
  }
  article.md-content__inner .lp-h1-route-target--icon .lp-h1-route-target-icon svg circle{
    fill:currentColor;
    stroke:none;
  }
}

      /* row hover: subtle background + underline only (no left bar, no size change) */
#lp-side-panel a.lp-row{
  position:relative;
  border:1px solid transparent;
  transition: background .12s ease;
}
#lp-side-panel a.lp-row:hover{
  background: transparent;
}
#lp-side-panel a.lp-row:hover .lp-name--text,
#lp-mobile-sheet #lp-side-panel a.lp-row .lp-name--text{
  display:inline;
  max-width:100%;
  text-decoration: underline;
  text-decoration-color: currentColor;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-skip-ink: auto;
  background:none !important;
}
#lp-side-panel a.lp-row:hover .lp-name--text::after,
#lp-mobile-sheet #lp-side-panel a.lp-row .lp-name--text::after{
  content:none !important;
  display:none !important;
}
#lp-side-panel a.lp-row:hover .lp-name--math,
#lp-mobile-sheet #lp-side-panel a.lp-row .lp-name--math{
  position:relative;
  display:inline-block;
  max-width:100%;
  text-decoration:none !important;
  background:none !important;
}
#lp-side-panel a.lp-row:hover .lp-name--math::after,
#lp-mobile-sheet #lp-side-panel a.lp-row .lp-name--math::after{
  content:"";
  position:absolute;
  left:0;
  right:0;
  bottom:0.06em;
  height:1px;
  background:currentColor;
  pointer-events:none;
}

/* focus 也别出框 */
#lp-side-panel a.lp-row:focus-visible{
  outline: none;
}

      
      #lp-side-panel .lp-main{ min-width:0; }
#lp-side-panel .lp-line1{
  display:flex;
  align-items:flex-start;
  gap:.52rem;
}

#lp-side-panel .lp-emoji{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  line-height:1;
  flex:0 0 auto;
  width:1.08em;
  height:1.08em;
  color: var(--md-default-fg-color);
}

#lp-side-panel .lp-emoji svg{
  width:1.08em;
  height:1.08em;
  display:block;
}

#lp-side-panel .lp-emoji[data-m="3"]{
  color: rgba(226, 179, 54, .99);
  filter:
    drop-shadow(0 0 4px rgba(234,188,62,.34))
    drop-shadow(0 0 10px rgba(246,207,90,.42))
    drop-shadow(0 0 18px rgba(246,207,90,.28));
}

#lp-side-panel .lp-emoji[data-m="2"]{
  color: rgba(210, 220, 236, .99);
  filter:
    drop-shadow(0 0 3px rgba(214,223,237,.26))
    drop-shadow(0 0 8px rgba(220,229,242,.30))
    drop-shadow(0 0 14px rgba(220,229,242,.18));
}

#lp-side-panel a.lp-row:hover .lp-emoji[data-m="3"]{
  filter:
    drop-shadow(0 0 5px rgba(234,188,62,.42))
    drop-shadow(0 0 13px rgba(246,207,90,.54))
    drop-shadow(0 0 22px rgba(246,207,90,.34));
}

#lp-side-panel a.lp-row:hover .lp-emoji[data-m="2"]{
  filter:
    drop-shadow(0 0 4px rgba(214,223,237,.34))
    drop-shadow(0 0 10px rgba(220,229,242,.38))
    drop-shadow(0 0 18px rgba(220,229,242,.24));
}

#lp-side-panel .lp-name{
  font-weight:780;
  line-height:1.2;
  color: var(--md-accent-fg-color);
  min-width:0;
}
#lp-side-panel .lp-name mjx-container,
#lp-side-panel .lp-name .MathJax,
#lp-side-panel .lp-name .katex,
#lp-side-panel .lp-name math{
  max-width:100%;
}

/* Math wrappers: keep them visually aligned with plain text and let the
   parent .lp-name draw the single underline, same as body-link styling. */
#lp-side-panel .lp-name mjx-container,
#lp-side-panel .lp-name .MathJax,
#lp-side-panel .lp-name .katex,
#lp-side-panel .lp-name .katex,
#lp-side-panel .lp-name math,
#lp-mobile-sheet #lp-side-panel .lp-name mjx-container,
#lp-mobile-sheet #lp-side-panel .lp-name .MathJax,
#lp-mobile-sheet #lp-side-panel .lp-name .katex,
#lp-mobile-sheet #lp-side-panel .lp-name math{
  border-bottom:none !important;
  text-decoration:none !important;
  box-shadow:none !important;
  background:none !important;
  display:inline-block !important;
  vertical-align:baseline !important;
  line-height:1 !important;
  padding-bottom:0 !important;
  margin-bottom:0 !important;
}
      #lp-side-panel .lp-hint{ display:none !important; }

      /* section colour coding (titles + links) */
      #lp-side-panel details.lp-deps summary.lp-sum .lp-sum-left{ color: var(--lp-post); }
      #lp-side-panel details.lp-pres summary.lp-sum .lp-sum-left{ color: var(--lp-pre); }
      #lp-side-panel details.lp-rel  summary.lp-sum .lp-sum-left{ color: var(--lp-rel); }

      #lp-side-panel details.lp-deps .lp-name{ color: var(--lp-post); }
      #lp-side-panel details.lp-pres .lp-name{ color: var(--lp-pre); }
      #lp-side-panel details.lp-rel  .lp-name{ color: var(--lp-rel); }
      /* modal */
      #lp-map-modal{
        position:fixed; inset:0; z-index:2147483400; display:none;
        align-items:center; justify-content:center;
        background: rgba(0,0,0,.46);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
        pointer-events: auto;
        overscroll-behavior: contain;
        touch-action: none;
      }
      body.lp-modal-open{
        overflow: hidden !important;
      }
      #lp-map-modal.lp-open{ display:flex; }
      #lp-map-modal .lp-mbox{
        width:min(980px, calc(100vw - 2rem));
        height:min(720px, calc(100vh - 2rem));
        border-radius:18px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: transparent;
        transition: width .46s cubic-bezier(.22,1,.36,1), height .46s cubic-bezier(.22,1,.36,1), border-radius .46s cubic-bezier(.22,1,.36,1);

        box-shadow:0 18px 54px rgba(0,0,0,.28);
        overflow:hidden;
        display:flex; flex-direction:column;
      }
        /* smooth resize when toggling fullscreen */
#lp-map-modal .lp-mbox{
  transition: width .22s ease, height .22s ease, border-radius .22s ease;
}
@media (pointer: fine){
  /* Desktop: avoid expensive size-animation + re-render feedback during fullscreen toggle. */
  #lp-map-modal .lp-mbox{ transition: none !important; }
  #lp-map-modal .lp-mapstage{ transition: none !important; }
}


@media (pointer: coarse) and (min-width: 768px) and (min-height: 700px){
  /* Tablet fullscreen: keep controls out of the top browser chrome / safe-area. */
  #lp-map-modal.lp-full{
    padding-top: env(safe-area-inset-top, 0px);
    padding-right: env(safe-area-inset-right, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    padding-left: env(safe-area-inset-left, 0px);
    box-sizing: border-box;
  }
  #lp-map-modal.lp-full .lp-mbox{ width: 100% !important; height: 100% !important; }
  #lp-map-modal.lp-full .lp-mctrl{ top: 16px; }
  #lp-map-modal.lp-full .lp-close{ top: 16px; }
  #lp-map-modal.lp-full .lp-full{ top: 16px; }
}
#lp-map-modal.lp-full .lp-mbox{
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  border: none !important;
  box-shadow: none !important;
}
#lp-map-modal .lp-mapstage{
  transition: inset .22s ease, border-radius .22s ease;
}
#lp-map-modal.lp-full{ background: rgba(0,0,0,.46); }
@media (min-width: 769px){
  #lp-map-modal.lp-full{ background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; }
}
@media (pointer: coarse) and (max-width: 767px), (pointer: coarse) and (max-height: 600px){
  /* Mobile/iOS safe-area handling:
     - keep controls out of the notch/status bar area
     - keep the whole interactive map area inside safe areas (no dead zones)
  */
  #lp-map-modal,
  #lp-map-modal.lp-full{
    background: rgba(0,0,0,.62);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
	    padding-top: constant(safe-area-inset-top);
	    padding-right: constant(safe-area-inset-right);
	    padding-bottom: constant(safe-area-inset-bottom);
	    padding-left: constant(safe-area-inset-left);
    padding-top: env(safe-area-inset-top, 0px);
    padding-right: env(safe-area-inset-right, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    padding-left: env(safe-area-inset-left, 0px);
    box-sizing: border-box;
  }

  /* On mobile we always open the map as full-screen.
     The modal itself has safe-area padding, so the inner box must be 100%.
  */
  #lp-map-modal.lp-open{ align-items: stretch; justify-content: stretch; }
  #lp-map-modal .lp-mbox{ width: 100% !important; height: 100% !important; border-radius: 0 !important; }
  #lp-map-modal.lp-full .lp-mbox{ width: 100% !important; height: 100% !important; }

  /* Fullscreen toggle is hidden on mobile (keep behaviour). */
  #lp-map-modal [data-lp-fullscreen]{ display: none !important; }

  /* Keep top controls comfortably below the safe-area top.
     (Safe-area padding already shifts the box down; add a small offset.)
  */
  #lp-map-modal .lp-mctrl{ top: 16px; left: 0; right: 0; transform: none; gap: 12px; }
  #lp-map-modal .lp-close{ top: 16px; }
  #lp-map-modal .lp-full{ top: 16px; }

  /* Zoom controls are docked at the bottom on mobile (separate from distance controls).
     We re-parent the zoom group into .lp-mzoom in JS (mobile-only) to avoid iOS fixed-position quirks.
  */
  #lp-map-modal .lp-mzoom{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
    z-index: 4;
  }


  /* Prevent iOS link preview/callout; long-press is reserved for navigation */
  #lp-map-modal a.lp-node{
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    touch-action: none;
    -webkit-user-select: none;
  }
}
#lp-map-modal.lp-full .lp-mbox{
  border: none !important;
  box-shadow: none !important;
}
#lp-map-modal.lp-full .lp-mapstage{
  inset: 0 !important;
  border-radius: 0 !important;
}

      #lp-map-modal .lp-mhdr{
        display:flex; align-items:center; justify-content:space-between;
        padding:.85rem .9rem;
        border-bottom:1px solid var(--md-default-fg-color--lightest);
        gap:.8rem;
      }
      #lp-map-modal .lp-mttl{ font-weight:860; letter-spacing:.2px; }
      #lp-map-modal .lp-mctrl{ display:flex; align-items:center; gap:.45rem; }
      #lp-map-modal .lp-btn{
        appearance:none; border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
        color: var(--md-default-fg-color);
        border-radius:12px; padding:.3rem .55rem; font-weight:780;
        cursor:pointer;
      }
      #lp-map-modal .lp-btn:hover{ border-color: var(--md-accent-fg-color); background: rgba(99,102,241,.10); }
      #lp-map-modal .lp-mctrl .lp-hop{ opacity:.78; font-weight:780; min-width:5.5rem; text-align:center; }
      #lp-map-modal .lp-close{ border:none; background:transparent; color:var(--md-default-fg-color); cursor:pointer; font-size:1.2rem; opacity:.75; }
      #lp-map-modal .lp-close:hover{ opacity:1; }
      #lp-map-modal .lp-mbody{ flex:1; position:relative; padding:0; background: transparent; }
            #lp-map-modal .lp-mapstage{
        position:absolute; inset:0; border-radius:0;
        border:none;
        background: transparent;
        overflow:hidden;
      }

      #lp-map-modal .lp-mapstage svg{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
      /* Strict 4-layer stack for the local map:
         4) base SVG dim edges
         3) dim nodes (+ their empty neighbourhood shields)
         2) highlight/static-visible SVG edges
         1) kept/focus nodes (+ their empty neighbourhood shields)
         This guarantees white static edges can pass above dim nodes, while kept/focus nodes still cut the edge layer. */
      #lp-map-modal .lp-mapstage svg.lp-map-svg{ z-index: 0; }
      #lp-map-modal .lp-mapstage svg.lp-map-svg-hi{ z-index: 20; }
      #lp-map-modal a.lp-node{ z-index: 30; }
      #lp-map-modal a.lp-node.lp-keep{ z-index: 30; }
      #lp-map-modal a.lp-node.lp-dim{ z-index: 10; }
      #lp-map-modal a.lp-node.lp-focus{ z-index: 40; }
      #lp-map-modal a.lp-node{
        position:absolute;
        width:max-content;
        max-width:none;
        max-inline-size:min(560px, calc(100vw - 48px));
        padding:.45rem .72rem;
        border-radius:999px;

        /* Background/border/shadow moved to ::after so we can put an opaque mask below. */
        background: transparent;
        border: none;
        box-shadow: none;

        color: var(--md-default-fg-color);
        text-decoration:none;
        font-weight:760;
        font-size:1.12em;
        line-height:1.1;
        white-space:nowrap;
        overflow:visible;
        text-overflow:clip;
        transform:translate(-50%,-50%);

        /* Ensure pseudo-elements layer correctly within the node. */
        isolation: isolate;
      }
      #lp-map-modal a.lp-node .lp-node-label{
        position:relative;
        z-index:1;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:.42rem;
        width:max-content;
        max-width:100%;
        white-space:nowrap;
        overflow:visible;
        text-overflow:clip;
      }
      #lp-map-modal a.lp-node .lp-node-prefix{
        display:inline-flex; align-items:center; justify-content:center; flex:0 0 auto;
        width:1.02em; height:1.02em;
      }
      #lp-map-modal a.lp-node .lp-node-prefix svg{
        width:1.02em; height:1.02em; display:block;
      }
      #lp-map-modal a.lp-node .lp-node-title{
        min-width:0;
        display:inline-block;
        white-space:nowrap;
      }
      #lp-map-modal a.lp-node .lp-node-label[data-lp-has-mastery-icon="1"] .lp-node-title{
        line-height:1;
        transform: translateY(.055em);
      }

      /* Transparent neighbourhood layer. Actual edge hiding is handled by the SVG masks. */
      #lp-map-modal a.lp-node::before{
        content:"";
        position:absolute;
        inset:-12px;
        border-radius:999px;
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        pointer-events:none;
        z-index:-2;
      }

      /* Visible pill styling (keeps the original look). */
      #lp-map-modal a.lp-node::after{
        content:"";
        position:absolute;
        inset:0;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
        box-shadow: 0 10px 22px rgba(0,0,0,.16);
        pointer-events:none;
        z-index:-1;
      }
        #lp-map-modal a.lp-node:hover::after{ border-color: rgba(255,255,255,.85) !important; }
      #lp-map-modal a.lp-node.lp-focus::after{
        border-color: rgba(255,255,255,.90) !important;
        box-shadow: 0 0 0 1px rgba(255,255,255,.18), 0 12px 26px rgba(0,0,0,.22) !important;
      }
  
      /* focus + dim transitions (used by hover-neighbour highlight) */
      #lp-map-modal a.lp-node,
      #lp-map-modal .lp-mapviewport svg .lp-edge{
        /* IMPORTANT: remove transitions so hover reset is instant (no lingering states) */
        transition: none !important;
      }
      
/* fullscreen toggle button (same size as close) */
#lp-map-modal .lp-full{
  position:absolute; top:12px; right:56px;
  width:36px; height:36px; border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  background: rgba(0,0,0,.18);
  border:1px solid rgba(255,255,255,.10);
  color: var(--md-default-fg-color);
  cursor:pointer;
  font-size:0;
  line-height:0;
  opacity:.75;
  z-index:5;
  touch-action: manipulation;
}
#lp-map-modal .lp-full:hover{ opacity:1; }
#lp-map-modal .lp-full svg{ width:18px; height:18px; display:block; }
@media (min-width: 901px){
  #lp-map-modal [data-lp-fullscreen]{ display:none !important; }
}

      #lp-map-modal a.lp-node:hover::after{ border-color: rgba(255,255,255,.85); }
      #lp-map-modal a.lp-node.lp-center{ max-width:none; max-inline-size:min(620px, calc(100vw - 40px)); font-weight:820; }

      /* map modal controls & close: polish */
      #lp-map-modal .lp-mbox{ position:relative; }
      #lp-map-modal .lp-close{
        position:absolute; top:12px; right:14px; left:auto;
        width:36px; height:36px; border-radius:12px;
        display:flex; align-items:center; justify-content:center;
        background: rgba(0,0,0,.18);
        border:1px solid rgba(255,255,255,.10);
        z-index:5;
        touch-action: manipulation;
      }

      #lp-map-modal .lp-mctrl{
        position:absolute; top:12px; left:50%;
        transform: translateX(-50%);
        display:flex; align-items:center; justify-content:center;
        gap:14px;
        flex-wrap: wrap;
        z-index:4;
      }

/* zoom dock: bottom-centered on all devices (PC + mobile) */
#lp-map-modal .lp-mzoom{
  position:absolute;
  left:50%;
  transform: translateX(-50%);
  bottom: 16px;
  width: min(560px, calc(100% - 32px));
  z-index:4;
  pointer-events: auto;
}
#lp-map-modal .lp-mzoom [data-ctrl-zoom]{
  width:100%;
  justify-content: flex-start;
  gap:10px;
  pointer-events:auto;
}
#lp-map-modal .lp-zoombar .lp-hop{ min-width:4.6rem; text-align:center; }
#lp-map-modal .lp-zoombar .lp-btn{ flex: 0 0 auto; }
#lp-map-modal .lp-ctrl-group.lp-zoombar{ padding:7px 12px; }
#lp-map-modal input.lp-zoomrange{
  flex:1 1 auto;
  width:100%;
  height: 26px;
  background: transparent !important;
  accent-color: rgba(255,255,255,.85);
  touch-action: none;
  overscroll-behavior: contain;
  -webkit-user-select: none;
  user-select: none;
  -webkit-appearance:none !important;
  appearance:none !important;
  border:none !important;
  box-shadow:none !important;
  outline:none !important;
  padding:0 !important;
  border-radius:999px !important;
}
#lp-map-modal input.lp-zoomrange::-webkit-slider-runnable-track{
  height: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,.18);
}
#lp-map-modal input.lp-zoomrange::-webkit-slider-thumb{
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  margin-top: -6px;
  background: rgba(255,255,255,.88);
  border: 1px solid rgba(0,0,0,.25);
  box-shadow: 0 6px 18px rgba(0,0,0,.35);
}
#lp-map-modal input.lp-zoomrange::-moz-range-track{
  height: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,.18);
}
#lp-map-modal input.lp-zoomrange::-moz-range-thumb{
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: rgba(255,255,255,.88);
  border: 1px solid rgba(0,0,0,.25);
  box-shadow: 0 6px 18px rgba(0,0,0,.35);
}
@media (max-width: 768px){
  #lp-map-modal .lp-mzoom{
    bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
    width: min(640px, calc(100% - 24px));
  }
}
      #lp-map-modal .lp-ctrl-group{
        display:flex; align-items:center; gap:8px;
        padding:7px 12px;
        border-radius:14px;
        border:1px solid rgba(255,255,255,.14);
        /* Less transparency: do not let the map behind reduce legibility */
        background: rgba(0,0,0,.72);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: 0 10px 26px rgba(0,0,0,.28);
      }
      #lp-map-modal .lp-ctrl-group .lp-hop{
        min-width:4.8rem;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      /* viewport: transform applies to both nodes & edges */
      #lp-map-modal .lp-mapviewport{
        position:absolute; inset:0;
        transform-origin: 0 0;
        will-change: transform;
        contain: layout paint style;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      #lp-map-modal .lp-mapviewport svg,
      #lp-map-modal .lp-mapviewport a.lp-node{
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      @media (min-width: 901px) and (hover: hover) and (pointer: fine){
        /* Desktop local-map hover was still flickering when the whole transformed viewport
           got promoted into a large composited 3D layer. Keep the same visuals, but opt out
           of the heavy GPU layer hints so painting stays stable even with many nodes. */
        #lp-map-modal .lp-mapviewport{
          will-change: auto !important;
          contain: none !important;
          backface-visibility: visible !important;
          -webkit-backface-visibility: visible !important;
          transform-style: flat !important;
        }
        #lp-map-modal .lp-mapviewport svg,
        #lp-map-modal .lp-mapviewport a.lp-node{
          backface-visibility: visible !important;
          -webkit-backface-visibility: visible !important;
          transform-style: flat !important;
        }
      }
      #lp-map-modal .lp-mapviewport.lp-zoom-proxy{
        pointer-events:none;
        z-index:2;
      }
      #lp-map-modal .lp-mapviewport.lp-zoom-proxy .lp-flow-arrow{
        display:none !important;
      }
      #lp-map-modal .lp-mapviewport.lp-zoom-proxy path.lp-rel-edge.lp-rel-anim{
        animation:none !important;
      }
      #lp-map-modal .lp-mapviewport.lp-zoom-proxy .lp-fog-layer{
        opacity:0 !important;
        filter:none !important;
        -webkit-filter:none !important;
      }
      #lp-map-modal .lp-mapviewport.lp-zoom-proxy a.lp-node::after{
        box-shadow:none !important;
      }
      #lp-map-modal .lp-mapviewport.lp-zoom-proxy-source{
        visibility:hidden !important;
      }
      @media (min-width: 901px) and (hover: hover) and (pointer: fine){
        /* Desktop hover preview must not change the whole map's brightness.
           The lp-desktop-focus-preview class is still used by JS to identify
           an active hover preview, but it must not alter the modal background,
           fog opacity/filter, node shadows, or edge filters. Otherwise hovering
           a local-map node causes a visible global light/dark flash. */
        #lp-map-modal.lp-desktop-focus-preview .lp-mapviewport svg,
        #lp-map-modal.lp-desktop-focus-preview .lp-mapviewport svg *{
          pointer-events:none !important;
        }
      }

      /* prevent browser panning/scrolling inside the modal on touch devices */
      #lp-map-modal .lp-mapstage,
      #lp-map-modal .lp-mapviewport{
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }
      #lp-map-modal .lp-mapviewport svg{
        position:absolute; inset:0; width:100%; height:100%;
      }

      /* edges: smoother hover + allow pointer hit on stroke */
      #lp-map-modal .lp-mapviewport svg path.lp-edge{
        pointer-events: none;
        transition: none !important;
        stroke-linecap: round;
        shape-rendering: geometricPrecision;
      }

      /* related edges: dashed purple, optionally animated on focus/hover */
      #lp-map-modal .lp-mapviewport svg path.lp-rel-edge{
        pointer-events: none;
        stroke-dasharray: 6 6;
        shape-rendering: geometricPrecision;
      }
      /* will-change only while the dash actually moves. Hinting it on every
         related edge kept a paint hint alive for hundreds of idle paths. */
      #lp-map-modal .lp-mapviewport svg path.lp-rel-edge.lp-rel-anim{
        animation: lp-rel-dash 1.2s linear infinite;
        will-change: stroke-dashoffset;
      }
      @keyframes lp-rel-dash{
        from{ stroke-dashoffset: 0; }
        to{ stroke-dashoffset: -24; }
      }
      /* Local map animations are a shop unlock. Locked maps keep the same
         hover / long-press / tap neighbourhood highlight, but remove moving
         arrows, dashed-edge motion, and transition-style animation. */
      #lp-map-modal.lp-local-map-animations-off .lp-mapviewport svg path.lp-rel-edge.lp-rel-anim,
      #lp-map-modal.lp-local-map-animations-off.lp-webgl3d .lp-webgl3d-edge.is-related.lp-rel-anim{
        animation: none !important;
        stroke-dashoffset: 0 !important;
      }
      #lp-map-modal.lp-local-map-animations-off .lp-mapviewport svg .lp-flow-arrow,
      #lp-map-modal.lp-local-map-animations-off.lp-webgl3d .lp-webgl3d-flow-arrow{
        display: none !important;
      }
      #lp-map-modal.lp-local-map-animations-off a.lp-node,
      #lp-map-modal.lp-local-map-animations-off a.lp-node::before,
      #lp-map-modal.lp-local-map-animations-off a.lp-node::after,
      #lp-map-modal.lp-local-map-animations-off .lp-mapviewport svg path,
      #lp-map-modal.lp-local-map-animations-off .lp-fog-layer{
        transition: none !important;
        animation: none !important;
      }
      @media (prefers-reduced-motion: reduce){
        #lp-map-modal .lp-mapviewport svg path.lp-rel-edge.lp-rel-anim{ animation: none !important; }
      }
      }

      /* related toggle button (polished) */
      #lp-map-modal .lp-ctrl-group[data-ctrl-rel]{ padding:6px 10px; }
      #lp-map-modal .lp-btn.lp-rel-toggle{
        position: relative;
        padding: .34rem .72rem;
        border-radius: 999px;
        border: 1px solid rgba(167,139,250,.55);
        background: linear-gradient(135deg, rgba(167,139,250,.18), rgba(255,255,255,.04));
        box-shadow:
          0 0 0 1px rgba(167,139,250,.10),
          0 10px 22px rgba(0,0,0,.26);
        font-weight: 820;
        letter-spacing: .1px;
        transition: transform .12s ease, filter .12s ease, background .12s ease, border-color .12s ease;
      }
      #lp-map-modal .lp-btn.lp-rel-toggle::before{
        content:"";
        width: .46rem; height: .46rem;
        border-radius: 999px;
        margin-right: .44rem;
        display:inline-block;
        vertical-align: middle;
        background: rgba(167,139,250,.85);
        box-shadow: 0 0 0 2px rgba(0,0,0,.45);
      }
      #lp-map-modal .lp-btn.lp-rel-toggle:hover{
        transform: translateY(-1px);
        filter: brightness(1.06);
        border-color: rgba(167,139,250,.75);
      }
      #lp-map-modal .lp-btn.lp-rel-toggle:active{
        transform: translateY(0px) scale(.99);
      }
      #lp-map-modal .lp-btn.lp-rel-toggle[data-lp-rel-mode="off"]{
        border-color: rgba(255,255,255,.16);
        background: rgba(255,255,255,.04);
        opacity: .88;
      }
      #lp-map-modal .lp-btn.lp-rel-toggle[data-lp-rel-mode="off"]::before{
        background: rgba(255,255,255,.70);
      }
      #lp-map-modal .lp-btn.lp-rel-toggle[data-lp-rel-mode="dim"]::before{
        background: rgba(255,255,255,.72);
        box-shadow: 0 0 0 2px rgba(0,0,0,.45), 0 0 0 6px rgba(167,139,250,.08);
      }
      #lp-map-modal .lp-btn.lp-rel-toggle[data-lp-rel-mode="all"]{
        border-color: rgba(167,139,250,.82);
        background: linear-gradient(135deg, rgba(167,139,250,.26), rgba(59,130,246,.10));
      }
      #lp-map-modal .lp-btn.lp-rel-toggle[data-lp-rel-mode="all"]::before{
        background: rgba(167,139,250,.95);
        box-shadow: 0 0 0 2px rgba(0,0,0,.45), 0 0 12px rgba(167,139,250,.28);
      }

      /* baseline dim for "related-only" nodes in dim mode */
      #lp-map-modal[data-lp-rel-mode="dim"] a.lp-node[data-lp-rel-only="1"]{
        opacity: .18;
        filter: blur(1px);
      }


      /* focused/hovered node must never inherit the related-only baseline dim */
      #lp-map-modal a.lp-node.lp-focus{
        opacity: 1 !important;
        filter: none !important;
      }

      /* iOS long-press grey block fix: disable system tap highlight / callout on nodes */
      #lp-map-modal a.lp-node{
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        -webkit-user-drag: none;
      }
      #lp-map-modal a.lp-node *{
        -webkit-user-select: none;
        user-select: none;
      }
      #lp-map-modal a.lp-node,
      #lp-map-modal a.lp-node:focus,
      #lp-map-modal a.lp-node:focus-visible,
      #lp-map-modal a.lp-node:active{
        outline: none !important;
        -webkit-tap-highlight-color: transparent;
      }

      /* moving arrow on hover/focus */
      #lp-map-modal .lp-mapviewport svg .lp-flow-arrow{
        pointer-events:none;
        opacity:1;
        filter: none;
      }
      @media (prefers-reduced-motion: reduce){
      }
      @media (max-width: 768px){
        #lp-map-modal{
          background: rgba(0,0,0,.58) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }
        #lp-mobile-backdrop{
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }
        /* Mobile performance mode for local map:
           keep interaction snappy by removing the heaviest visual recomposition layers
           that used to come back after pan/zoom end and block the next gesture.
           During an intentional long-press preview we temporarily opt back into
           the full hover animation treatment. */
        #lp-map-modal .lp-fog-layer{
          opacity:0 !important;
          filter:none !important;
          -webkit-filter:none !important;
        }
        #lp-map-modal .lp-mapviewport svg .lp-flow-arrow{
          display:none !important;
        }
        #lp-map-modal .lp-mapviewport svg path.lp-rel-edge.lp-rel-anim{
          animation:none !important;
        }
        #lp-map-modal.lp-mobile-focus-preview .lp-mapviewport svg .lp-flow-arrow{
          display:block !important;
        }
        #lp-map-modal.lp-mobile-focus-preview .lp-mapviewport svg path.lp-rel-edge.lp-rel-anim{
          animation: lp-rel-dash 1.2s linear infinite !important;
        }
        #lp-map-modal.lp-mobile-focus-zoomed .lp-mapviewport a.lp-node,
        #lp-map-modal.lp-mobile-focus-zoomed .lp-mapviewport a.lp-node::before,
        #lp-map-modal.lp-mobile-focus-zoomed .lp-mapviewport a.lp-node::after,
        #lp-map-modal.lp-mobile-focus-zoomed .lp-mapviewport svg path,
        #lp-map-modal.lp-mobile-focus-zoomed .lp-mapviewport svg .lp-flow-arrow{
          filter:none !important;
          -webkit-filter:none !important;
          will-change:auto !important;
        }
        #lp-map-modal.lp-mobile-focus-zoomed .lp-mapviewport a.lp-node{
          transition:none !important;
        }
        #lp-map-modal.lp-mobile-focus-zoomed .lp-mapviewport a.lp-node::after{
          box-shadow:none !important;
        }
      }


      /* Opera Mobile performance fallback for the local map.
         Opera's compositor is much slower with large transformed SVG/HTML maps when
         backdrop-filter, node shadows, blur masks, and dash animations are active.
         This class is only toggled for touch/mobile Opera, so other browsers keep
         the richer visuals. */
      #lp-map-modal.lp-opera-map-perf{
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        background:rgba(0,0,0,.58) !important;
      }
      #lp-map-modal.lp-opera-map-perf .lp-mapviewport{
        will-change:transform !important;
        contain:layout paint style !important;
        transform-style:flat !important;
      }
      #lp-map-modal.lp-opera-map-perf .lp-fog-layer{
        display:none !important;
        opacity:0 !important;
        filter:none !important;
        -webkit-filter:none !important;
      }
      #lp-map-modal.lp-opera-map-perf .lp-mapviewport svg .lp-flow-arrow{
        display:none !important;
      }
      #lp-map-modal.lp-opera-map-perf .lp-mapviewport svg path.lp-rel-edge.lp-rel-anim{
        animation:none !important;
      }
      #lp-map-modal.lp-opera-map-perf .lp-mapviewport svg path.lp-edge,
      #lp-map-modal.lp-opera-map-perf .lp-mapviewport svg path.lp-rel-edge{
        shape-rendering:optimizeSpeed !important;
      }
      #lp-map-modal.lp-opera-map-perf a.lp-node,
      #lp-map-modal.lp-opera-map-perf a.lp-node::before,
      #lp-map-modal.lp-opera-map-perf a.lp-node::after,
      #lp-map-modal.lp-opera-map-perf a.lp-node .lp-node-prefix{
        transition:none !important;
        filter:none !important;
        -webkit-filter:none !important;
      }
      #lp-map-modal.lp-opera-map-perf a.lp-node::before{
        display:none !important;
      }
      #lp-map-modal.lp-opera-map-perf a.lp-node::after{
        box-shadow:none !important;
      }
      #lp-map-modal.lp-opera-map-perf[data-lp-rel-mode="dim"] a.lp-node[data-lp-rel-only="1"]{
        opacity:.30 !important;
        filter:none !important;
        -webkit-filter:none !important;
      }
      #lp-map-modal.lp-opera-map-perf .lp-mapstage,
      #lp-map-modal.lp-opera-map-perf .lp-mapviewport{
        touch-action:none !important;
        overscroll-behavior:contain !important;
        -webkit-user-select:none !important;
        user-select:none !important;
      }
      #lp-map-modal.lp-opera-map-perf.lp-mobile-gesturing,
      #lp-map-modal.lp-opera-map-perf.lp-slider-zooming{
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      /* Opera Mobile fallback: during live pan / pinch we temporarily remove the
         expensive SVG edge layers and pill shadows. They come back after finger-up.
         This is intentionally stronger than the normal mobile optimization. */
      #lp-map-modal.lp-opera-map-perf.lp-mobile-gesturing .lp-mapviewport svg,
      #lp-map-modal.lp-opera-map-perf.lp-slider-zooming .lp-mapviewport svg{
        display:none !important;
      }
      #lp-map-modal.lp-opera-map-perf.lp-mobile-gesturing a.lp-node::before,
      #lp-map-modal.lp-opera-map-perf.lp-slider-zooming a.lp-node::before{
        display:none !important;
      }
      #lp-map-modal.lp-opera-map-perf.lp-mobile-gesturing a.lp-node::after,
      #lp-map-modal.lp-opera-map-perf.lp-slider-zooming a.lp-node::after{
        box-shadow:none !important;
        background:rgba(255,255,255,.055) !important;
      }
      #lp-map-modal.lp-opera-map-perf.lp-mobile-gesturing a.lp-node,
      #lp-map-modal.lp-opera-map-perf.lp-mobile-gesturing a.lp-node *,
      #lp-map-modal.lp-opera-map-perf.lp-slider-zooming a.lp-node,
      #lp-map-modal.lp-opera-map-perf.lp-slider-zooming a.lp-node *{
        transition:none !important;
        animation:none !important;
        filter:none !important;
        -webkit-filter:none !important;
        text-shadow:none !important;
      }

      /* top line on page */
      .lp-top-why{ margin:.35rem 0 0 0; font-size:.92em; opacity:.78; }
      .lp-top-why.lp-pending{ opacity:0; }
      .lp-top-why a{ color: var(--md-accent-fg-color); text-decoration:none; }
      .lp-top-why a:hover{ text-decoration:underline; }
      .lp-course-lecture{ margin:.25rem 0 0 0; font-size:.92em; opacity:.72; }
      .lp-course-lecture.lp-pending{ opacity:0; }
      .lp-course-lecture a{ color: var(--md-accent-fg-color); text-decoration:none; }
      .lp-course-lecture a:hover{ text-decoration:underline; }
      /* ----- Sidebar nav hover: color only, no flicker / no jitter ----- */
      .md-sidebar--primary .md-nav__link,
      .md-sidebar--primary .md-nav__link:link,
      .md-sidebar--primary .md-nav__link:visited,
      .md-sidebar--primary .md-nav__link--active{
        transition: color .12s ease !important;
        transform: none !important;
        box-shadow: none !important;
        background: transparent !important;
        border: none !important;
        outline: none !important;
        font-weight: inherit !important; /* prevent layout shift */
      }
      .md-sidebar--primary .md-nav__link::before,
      .md-sidebar--primary .md-nav__link::after,
      .md-sidebar--primary .md-nav__link--active::before,
      .md-sidebar--primary .md-nav__link--active::after{
        content: none !important;
        display: none !important;
      }
      /* some themes draw the "active/hover bar" on the item, not the link */
      .md-sidebar--primary .md-nav__item::before,
      .md-sidebar--primary .md-nav__item::after{
        content: none !important;
        display: none !important;
      }
      .md-sidebar--primary .md-nav__link:hover,
      .md-sidebar--primary .md-nav__link:focus{
        color: var(--md-accent-fg-color) !important;
      }

      /* --- Mobile learning path bottom sheet --- */
      #lp-mobile-backdrop{
        position: fixed;
        inset: 0;
        z-index: 9996;
        display: none;
        background: rgba(0,0,0,.18);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      #lp-mobile-backdrop.lp-open{ display:block; }

      /* At page end the real footer masks the collapsed fixed sheet without any
         scroll listener or root-class toggle. An opened sheet/backdrop remains
         above the footer so modal behaviour is unchanged. */
      @media (max-width: 900px), (pointer: coarse){
        .md-footer,
        footer.md-footer,
        body > footer{
          position:relative !important;
          z-index:9998 !important;
          isolation:isolate !important;
        }
        #lp-mobile-backdrop.lp-open{ z-index:9999; }
        #lp-mobile-sheet.lp-expanded,
        #lp-mobile-sheet.lp-animating{ z-index:10000; }
      }

      #lp-mobile-sheet{
        position: fixed;
        left: 0;
        right: 0;
        /* Lift the wrapper itself above the safe-area + gap instead of using
           padding-bottom. This way the wrapper is exactly as tall as the card
           and there is no empty space below for the page background to show through. */
        bottom: calc(env(safe-area-inset-bottom, 0px) + 2px);
        z-index: 9997;
        display: none;
        padding: 0 12px;
        box-sizing: border-box;
        pointer-events: none;
      }
      #lp-mobile-sheet.lp-mounted{ display:block; }
      #lp-mobile-sheet.lp-expanded,
      #lp-mobile-sheet.lp-animating{
        top:0;
        bottom:0;
        min-height:100dvh;
        padding:0 12px calc(env(safe-area-inset-bottom, 0px) + 2px);
        display:flex;
        align-items:flex-end;
        justify-content:center;
        pointer-events:auto;
      }
      #lp-mobile-sheet.lp-expanded .lp-msheet,
      #lp-mobile-sheet.lp-animating .lp-msheet{
        flex:0 0 auto;
        margin:0 auto;
      }

      /* Sheet chrome */
      #lp-mobile-sheet .lp-msheet{
        pointer-events: auto;
        width: 100%;
        max-width: 980px;
        margin: 0 auto;
        border-radius: 18px;
        border: 1px solid var(--md-default-fg-color--lightest);
        background: none;
        box-shadow: none;
        overflow: hidden;
      }

      /* collapsed: solid dark (no transparency) */
      #lp-mobile-sheet.lp-collapsed .lp-msheet{
        background: #1f2329 !important;
      }
      /* expanded: also needs a solid background so the page behind doesn't show through */
      #lp-mobile-sheet.lp-expanded .lp-msheet{
        background: #1f2329 !important;
      }

      #lp-mobile-sheet .lp-msheet-head{
        display:flex;
        align-items:center;
        justify-content: space-between;
        gap: 10px;
        padding: 12px 12px;
        border-bottom: 1px solid var(--md-default-fg-color--lightest);
        touch-action: none; /* avoid page scroll when swiping on header */
      }
      #lp-mobile-sheet .lp-msheet-txt{ min-width:0; flex:1 1 auto; }
      #lp-mobile-sheet .lp-msheet-title{ font-weight: 860; font-size: 1.12em; line-height:1.1; }
      #lp-mobile-sheet .lp-msheet-sub{ opacity:.72; font-size:.9em; margin-top:2px; }
            #lp-mobile-sheet .lp-msheet-actions{
        display:flex;
        align-items:center;
        gap:8px;
        flex:0 0 auto;
      }
      #lp-mobile-sheet .lp-msheet-btn{
        appearance:none;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
        color: var(--md-default-fg-color);
        border-radius: 12px;
        padding: .35rem .75rem;
        min-height: 40px;
        font-weight: 800;
        cursor:pointer;
        user-select:none;
        line-height: 1.1;
        flex: 0 0 auto;
      }
      #lp-mobile-sheet .lp-msheet-iconbtn{
        width:40px;
        min-width:40px;
        height:40px;
        padding:0;
        border-radius:12px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
      }
      #lp-mobile-sheet .lp-msheet-iconbtn svg{ width:20px; height:20px; display:block; }
      #lp-mobile-sheet.lp-collapsed .lp-msheet-btn{
        background: rgba(255,255,255,.02);
      }

      #lp-mobile-sheet .lp-msheet-fog{
        display:inline-flex;
        align-items:center;
        gap:8px;
        min-height:40px;
        padding:.35rem .6rem;
        border:1px solid var(--md-default-fg-color--lightest);
        border-radius:12px;
        background: rgba(255,255,255,.04);
        color: var(--md-default-fg-color);
        flex:0 0 auto;
        user-select:none;
        -webkit-tap-highlight-color: transparent;
      }
      #lp-mobile-sheet.lp-collapsed .lp-msheet-fog{
        background: rgba(255,255,255,.02);
      }
      #lp-mobile-sheet .lp-msheet-fog-label{
        display:inline !important;
        font-size:.82em;
        font-weight:780;
        line-height:1;
        opacity:.82;
        letter-spacing:.01em;
        white-space:nowrap;
      }
      #lp-mobile-sheet .lp-msheet-fog-switch{
        position:relative;
        display:inline-flex;
        align-items:center;
        flex:0 0 auto;
        cursor:pointer;
        -webkit-tap-highlight-color: transparent;
      }
      #lp-mobile-sheet .lp-msheet-fog-switch input{
        position:absolute;
        inset:0;
        opacity:0;
        width:100%;
        height:100%;
        margin:0;
        cursor:pointer;
      }
      #lp-mobile-sheet .lp-msheet-fog-ui{
        position:relative;
        display:block;
        width:42px;
        height:24px;
        border-radius:999px;
        background: linear-gradient(180deg, rgba(238,240,242,.92), rgba(218,221,225,.92));
        border:1px solid rgba(148,163,184,.60);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.45), 0 1px 5px rgba(15,23,42,.18);
        transition: background .18s ease, border-color .18s ease, box-shadow .18s ease;
      }
      #lp-mobile-sheet .lp-msheet-fog-ui::after{
        content:"";
        position:absolute;
        top:50%;
        left:2px;
        width:18px;
        height:18px;
        border-radius:999px;
        transform:translateY(-50%);
        background:#fff;
        box-shadow:0 1px 5px rgba(15,23,42,.28);
        transition: transform .18s ease, box-shadow .18s ease;
      }
      #lp-mobile-sheet .lp-msheet-fog-switch input:checked + .lp-msheet-fog-ui{
        background: linear-gradient(180deg, rgba(67,219,103,.98), rgba(34,197,94,.94));
        border-color: rgba(34,197,94,.72);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.28), 0 1px 5px rgba(15,23,42,.18);
      }
      #lp-mobile-sheet .lp-msheet-fog-switch input:checked + .lp-msheet-fog-ui::after{
        transform: translate(18px,-50%);
      }
      #lp-mobile-sheet .lp-msheet-fog-switch input:focus-visible + .lp-msheet-fog-ui{
        outline:2px solid rgba(255,255,255,.28);
        outline-offset:3px;
      }

      #lp-mobile-sheet .lp-msheet-toggle{
        width: 44px;
        min-width: 44px;
        padding: .35rem 0;
        display:flex;
        align-items:center;
        justify-content:center;
      }
      @media (max-width: 390px){
        #lp-mobile-sheet .lp-msheet-actions{ gap:5px; }
        #lp-mobile-sheet .lp-msheet-fog{ gap:5px; padding:.35rem .38rem; }
        #lp-mobile-sheet .lp-msheet-fog-label{
          display:inline !important;
          font-size:.76em;
          letter-spacing:0;
        }
        #lp-mobile-sheet .lp-msheet-iconbtn{ width:38px; min-width:38px; height:38px; }
        #lp-mobile-sheet .lp-msheet-toggle{ width:40px; min-width:40px; }
      }
      #lp-mobile-sheet .lp-msheet-toggle svg{
        width: 20px;
        height: 20px;
        display:block;
        transform: rotate(0deg);
        transition: transform .16s ease;
      }
      #lp-mobile-sheet.lp-expanded .lp-msheet-toggle svg{ transform: rotate(180deg); }
      #lp-mobile-sheet.lp-panel-closing .lp-msheet-toggle svg{
        transform: rotate(0deg);
        transition: transform .18s cubic-bezier(.2,.8,.2,1);
      }

      #lp-mobile-sheet .lp-msheet-body{ padding: 0 12px 12px; overscroll-behavior: contain; }
      #lp-mobile-sheet.lp-collapsed .lp-msheet-body{ display:none; }
      #lp-mobile-sheet.lp-expanded .lp-msheet-body{
        max-height: 70vh;
        overflow:auto;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y;
      }
      #lp-mobile-sheet.lp-expanded,
      #lp-mobile-sheet.lp-expanded .lp-msheet,
      #lp-mobile-sheet.lp-expanded .lp-msheet-body,
      #lp-mobile-sheet.lp-expanded #lp-side-panel{
        -webkit-user-select:text;
        user-select:text;
        -webkit-touch-callout:default;
      }
      #lp-mobile-sheet .lp-msheet-head,
      #lp-mobile-sheet .lp-msheet-actions,
      #lp-mobile-sheet .lp-msheet-btn,
      #lp-mobile-sheet summary.lp-sum{
        -webkit-user-select:none;
        user-select:none;
        -webkit-touch-callout:none;
      }

      /* Reuse existing panel markup, but remove nested visuals inside the sheet */
      #lp-mobile-sheet #lp-side-panel{
        margin:0;
        padding:0;
        border:none;
        box-shadow:none;
        background: transparent;
      }
      #lp-mobile-sheet #lp-side-panel .lp-head{ display:none; }
      #lp-mobile-sheet #lp-side-panel .lp-local{ display:none; } /* use header Open button */

      /* section separators (remove the top line above Dependents) */
      #lp-mobile-sheet #lp-side-panel details.lp-acc{
        border-top:1px solid var(--md-default-fg-color--lightest);
        padding-top:.55rem;
        margin-top:.55rem;
      }
      #lp-mobile-sheet #lp-side-panel details.lp-acc:first-of-type{
        border-top:none;
        /* keep breathing room below the sheet header divider */
        padding-top:.55rem;
        margin-top:0;
      }

      /* Only link-text is tappable (avoid accidental navigation while scrolling) */
      #lp-mobile-sheet #lp-side-panel a.lp-row{ pointer-events:none; }
      #lp-mobile-sheet #lp-side-panel a.lp-row .lp-name{ pointer-events:auto; }

      @media (min-width: 769px){
        #lp-mobile-backdrop{ display:none !important; }
        #lp-mobile-sheet{ display:none !important; }
      }


      /* --- Light scheme readability tweaks (buttons + panels) --- */
      html[data-md-color-scheme="default"] #lp-side-panel,
      body[data-md-color-scheme="default"] #lp-side-panel{
        border-color: rgba(0,0,0,.12);
        background:
          radial-gradient(900px 480px at 85% 0%, rgba(99,102,241,.10), rgba(99,102,241,0)),
          radial-gradient(900px 480px at 0% 25%, rgba(16,185,129,.08), rgba(16,185,129,0)),
          linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.88));
        box-shadow: 0 10px 26px rgba(0,0,0,.10);
      }
      html[data-md-color-scheme="default"] #lp-side-panel .lp-btn,
      body[data-md-color-scheme="default"] #lp-side-panel .lp-btn{
        border-color: rgba(0,0,0,.16);
        background: rgba(0,0,0,.035);
        color: var(--md-default-fg-color);
      }
      html[data-md-color-scheme="default"] #lp-side-panel .lp-ios-switch-ui,
      body[data-md-color-scheme="default"] #lp-side-panel .lp-ios-switch-ui{
        background: linear-gradient(180deg, #eef0f2, #dadde1);
        border-color: rgba(148,163,184,.62);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.50), 0 1px 5px rgba(15,23,42,.20);
      }
      html[data-md-color-scheme="default"] #lp-side-panel .lp-ios-switch input:checked + .lp-ios-switch-ui,
      body[data-md-color-scheme="default"] #lp-side-panel .lp-ios-switch input:checked + .lp-ios-switch-ui{
        background: linear-gradient(180deg, #43db67, #22c55e);
        border-color: rgba(34,197,94,.72);
      }
      html[data-md-color-scheme="default"] #lp-side-panel .lp-ios-switch-ui::after,
      body[data-md-color-scheme="default"] #lp-side-panel .lp-ios-switch-ui::after{
        background: #ffffff;
        box-shadow: 0 1px 5px rgba(15,23,42,.24);
      }

      /* Mobile bottom sheet: use light chrome in light scheme (dark chrome stays for slate). */
      html[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet,
      body[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet{
        border-color: rgba(0,0,0,.12);
        background: none;
        box-shadow: none;
      }
      html[data-md-color-scheme="default"] #lp-mobile-sheet.lp-collapsed .lp-msheet,
      body[data-md-color-scheme="default"] #lp-mobile-sheet.lp-collapsed .lp-msheet{
        background: rgba(255,255,255,.996) !important;
      }
      html[data-md-color-scheme="default"] #lp-mobile-sheet.lp-expanded .lp-msheet,
      body[data-md-color-scheme="default"] #lp-mobile-sheet.lp-expanded .lp-msheet{
        background: rgba(255,255,255,.996) !important;
      }
            html[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet-btn,
      body[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet-btn{
        border-color: rgba(0,0,0,.16);
        background: rgba(0,0,0,.035);
        color: var(--md-default-fg-color);
      }
      html[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet-fog,
      body[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet-fog{
        border-color: rgba(0,0,0,.16);
        background: rgba(0,0,0,.035);
        color: var(--md-default-fg-color);
      }
      html[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet-fog-ui,
      body[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet-fog-ui{
        background: linear-gradient(180deg, #eef0f2, #dadde1);
        border-color: rgba(148,163,184,.62);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.50), 0 1px 5px rgba(15,23,42,.20);
      }
      html[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet-fog-switch input:checked + .lp-msheet-fog-ui,
      body[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet-fog-switch input:checked + .lp-msheet-fog-ui{
        background: linear-gradient(180deg, #43db67, #22c55e);
        border-color: rgba(34,197,94,.72);
      }
      html[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet-fog-ui::after,
      body[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet-fog-ui::after{
        background: #ffffff;
        box-shadow: 0 1px 5px rgba(15,23,42,.24);
      }

      /* Map modal: improve contrast in light scheme (do not touch pre/post/rel hover colours). */
      html[data-md-color-scheme="default"] #lp-map-modal .lp-ctrl-group,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-ctrl-group{
        border-color: rgba(0,0,0,.12);
        background: rgba(255,255,255,.86);
      }
      html[data-md-color-scheme="default"] #lp-map-modal .lp-btn,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-btn{
        border-color: rgba(0,0,0,.16);
        background: rgba(0,0,0,.035);
        color: var(--md-default-fg-color);
      }
      html[data-md-color-scheme="default"] #lp-map-modal a.lp-node::before,
      body[data-md-color-scheme="default"] #lp-map-modal a.lp-node::before{
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
      html[data-md-color-scheme="default"] #lp-map-modal a.lp-node::after,
      body[data-md-color-scheme="default"] #lp-map-modal a.lp-node::after{
        border-color: rgba(0,0,0,.14);
        background: rgba(255,255,255,.92);
        box-shadow: 0 10px 22px rgba(0,0,0,.12);
      }
      html[data-md-color-scheme="default"] #lp-map-modal input.lp-zoomrange,
      body[data-md-color-scheme="default"] #lp-map-modal input.lp-zoomrange{
        accent-color: rgba(0,0,0,.70);
      }
      html[data-md-color-scheme="default"] #lp-map-modal input.lp-zoomrange::-webkit-slider-runnable-track,
      body[data-md-color-scheme="default"] #lp-map-modal input.lp-zoomrange::-webkit-slider-runnable-track{
        background: rgba(0,0,0,.14);
      }

      /* Zoom dock: desktop matches hop controls; mobile keeps slider+reset */
      @media (max-width: 768px){
        /* Mobile: keep slider + reset, but also show zoom percentage */
        #lp-map-modal [data-ctrl-zoom] [data-zoom-dec],
        #lp-map-modal [data-ctrl-zoom] [data-zoom-inc]{ display:none !important; }

        #lp-map-modal [data-ctrl-zoom] [data-zoom-label]{
          display:flex !important;
          align-items:center;
          justify-content:center;
          min-width: 3.8rem;
          font-weight: 780;
          opacity: .85;
          letter-spacing: .2px;
        }

        /* keep the slider comfortably wide on mobile */
        #lp-map-modal [data-ctrl-zoom] input.lp-zoomrange{ width: 100% !important; flex: 1 1 auto; }
      }
      @media (min-width: 769px){
        #lp-map-modal .lp-mzoom{
          width: auto;
          max-width: calc(100% - 32px);
          display:flex;
          justify-content:center;
          bottom: 18px;
        }
        #lp-map-modal .lp-mzoom [data-ctrl-zoom]{
          width: auto;
          justify-content: center;
          gap: 14px;
        }
        #lp-map-modal [data-ctrl-zoom] [data-zoom-label]{
          min-width: 4.8rem;
          text-align: center;
          opacity: .85;
          font-weight: 780;
        }
        #lp-map-modal [data-ctrl-zoom] input.lp-zoomrange{
          width: clamp(240px, 26vw, 460px) !important;
          flex: 0 0 auto;
        }
      }

/* --- v2.2: Light scheme: make modal close/fullscreen buttons clearly visible --- */
      html[data-md-color-scheme="default"] #lp-map-modal .lp-close,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-close,
      html[data-md-color-scheme="default"] #lp-map-modal .lp-full,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-full{
        background: rgba(255,255,255,.94) !important;
        border: 1px solid rgba(0,0,0,.18) !important;
        color: rgba(0,0,0,.86) !important;
        box-shadow: 0 10px 22px rgba(0,0,0,.16) !important;
        opacity: .92;
      }
      html[data-md-color-scheme="default"] #lp-map-modal .lp-close:hover,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-close:hover,
      html[data-md-color-scheme="default"] #lp-map-modal .lp-full:hover,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-full:hover{
        opacity: 1;
      }

      

/* --- Zoom dock: unified pill overlay (PC + mobile), compact slider, no wasted gaps --- */
#lp-map-modal .lp-mapviewport{
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
#lp-map-modal .lp-mzoom{
  position: absolute !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  bottom: 18px !important;
  width: auto !important;
  max-width: calc(100% - 32px) !important;
  z-index: 6 !important;
  pointer-events: none; /* wrapper only */
}
#lp-map-modal .lp-mzoom [data-ctrl-zoom]{
  pointer-events: auto;
  width: auto !important;
  justify-content: center !important;
  gap: 8px !important;
  padding: 8px 12px !important;
}

/* Reduce label width and keep it close to the slider */
#lp-map-modal .lp-mzoom [data-zoom-label]{
  min-width: 3.6rem !important;
  text-align: center !important;
  opacity: .82;
  font-weight: 800;
}

/* Compact slider: ~1/3 of previous width on desktop; keep mobile unchanged */
@media (min-width: 769px){
  #lp-map-modal .lp-mzoom input.lp-zoomrange{
    width: clamp(160px, 14vw, 220px) !important;
    flex: 0 0 auto !important;
  }
}
@media (max-width: 768px){
  #lp-map-modal .lp-mzoom{
    bottom: calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
    width: calc(100% - 12px) !important;
    max-width: none !important;
  }
  #lp-map-modal a.lp-node{ max-inline-size: calc(100vw - 32px); }
  /* Larger touch targets + longer slider on mobile */
  #lp-map-modal .lp-ctrl-group.lp-zoombar{ padding:10px 14px !important; }
  #lp-map-modal .lp-zoombar .lp-btn{ min-width:5.6rem !important; min-height:40px !important; }
  #lp-map-modal input.lp-zoomrange{ height:34px !important; }
  #lp-map-modal input.lp-zoomrange::-webkit-slider-runnable-track{ height:8px !important; }
  #lp-map-modal input.lp-zoomrange::-webkit-slider-thumb{
    width:24px !important;
    height:24px !important;
    margin-top:-8px !important;
  }
  #lp-map-modal input.lp-zoomrange::-moz-range-track{ height:8px !important; }
  #lp-map-modal input.lp-zoomrange::-moz-range-thumb{ width:24px !important; height:24px !important; }
}
`;document.head.appendChild(st);}
function buildList(items,graphRef,resolveTitle){if(!items.length)return`<div class="lp-empty">No suggestions.</div>`;const graphForTitles=graphRef||window.__lpLearningPathGraph||null;const titleFor=(typeof resolveTitle==="function")?resolveTitle:((loc)=>nodeTitle(graphForTitles,loc));return items.map((it)=>{const itemTitleHtml=__lpRepairTitleHtmlFromLoc(it.loc,String(it.titleHtml||it.html||"").trim());const fallbackTitle=cleanTitle(it.title||titleFor(it.loc)||it.loc);const display=lpNodeTitleDisplay(graphForTitles,it.loc,fallbackTitle);const titleText=cleanTitle(display.text||fallbackTitle||it.loc);const titleHtml=itemTitleHtml||String(display.html||"").trim()||escapeHtml(titleText);const rawTitle=cleanTitle(lpHasMathMarkup(titleText)?titleText:((itemTitleHtml?__lpTitleHtmlToText(itemTitleHtml):"")||titleText));const titleHasMath=lpHasMathMarkup(titleHtml)||lpHasMathMarkup(rawTitle)||lpHasMathMarkup(titleText);const titleClass=titleHasMath?"lp-name lp-name--math":"lp-name lp-name--text";const hint=it.hint?escapeHtml(it.hint):"";const tooltip=it.tooltip?escapeHtml(it.tooltip):"";const rec=getMastery(it.loc);const m=rec&&typeof rec.m==="number"?rec.m:(typeof it.m==="number"?it.m:null);const statusIcon=lpPanelStatusIcon(it.loc,rec,m);const statusLabel=escapeHtml(statusIcon.label||"Concept status");const statusState=escapeHtml(statusIcon.state||"not-viewed");const statusSvg=statusIcon.icon||lpMasterySvg("eye-off-outline",18);return`
          <a class="lp-row" href="${toAbsoluteUrl(it.loc)}" data-lp-loc="${escapeHtml(normLoc(it.loc))}" ${tooltip ? `title="${tooltip}"` : ``}>
            <span class="lp-rank" data-lp-state="${statusState}" aria-label="${statusLabel}" title="${statusLabel}">${statusSvg}</span>
            <span class="lp-main">
              <span class="lp-line1"><span class="${titleClass}" data-lp-title-loc="${escapeHtml(normLoc(it.loc))}" data-lp-raw-title="${escapeHtml(rawTitle)}">${titleHtml}</span></span>
            </span>
          </a>
        `;}).join("");}
function findSectionHtmlByHeadingText(headingRegex){const inner=document.querySelector("article.md-content__inner");if(!inner)return null;const heads=Array.from(inner.querySelectorAll("h2, h3"));const normHead=(s)=>cleanTitle(s||"").replace(/[^\p{L}\p{N}\s]/gu,"").replace(/\s+/g," ").trim();const h=heads.find((x)=>headingRegex.test(normHead(x.textContent||"")));if(!h)return null;const parts=[];let n=h.nextElementSibling;while(n){const tag=(n.tagName||"").toLowerCase();if(tag==="h2"||tag==="h3")break;parts.push(n.outerHTML);n=n.nextElementSibling;}
return parts.length?parts.join("\n"):null;}
function extractConceptLinksFromLiveSection(headingRegex){try{const inner=document.querySelector("article.md-content__inner");if(!inner)return[];const normHead=(s)=>cleanTitle(s||"").replace(/[^\p{L}\p{N}\s]/gu,"").replace(/\s+/g," ").trim();const heads=Array.from(inner.querySelectorAll("h2, h3"));const h=heads.find((x)=>headingRegex.test(normHead(x.textContent||"")));if(!h)return[];const items=[];const seen=new Set();let n=h.nextElementSibling;while(n){const tag=(n.tagName||"").toLowerCase();if(tag==="h2"||tag==="h3")break;const links=n.querySelectorAll?Array.from(n.querySelectorAll("a[href]")):[];for(const a of links){const href=a.getAttribute("href");if(!href||!isSameOriginUrl(href))continue;const rel=urlToRelPath(href);if(!rel||!isConceptPage(rel))continue;const loc=normLoc(rel);if(!loc||seen.has(loc))continue;seen.add(loc);const rawHtml=String(a.innerHTML||"").trim();const titleHtml=rawHtml?(__lpRepairTitleHtmlFromLoc(loc,rawHtml)||__lpSanitizeRenderedMathHtml(rawHtml)||""):"";const textFromHtml=titleHtml?__lpTitleHtmlToText(titleHtml):"";const textFromDom=cleanTitle(a.textContent||"");const title=__lpRepairTitleMathFromLoc(loc,textFromHtml||textFromDom||cleanTitle(loc));items.push({loc,title,titleHtml});}
n=n.nextElementSibling;}
return items;}catch(_){return[];}}
function extractConceptLinksFromHtml(html,baseUrl){try{const doc=new DOMParser().parseFromString(`<div>${html}</div>`,"text/html");const as=Array.from(doc.querySelectorAll("a[href]"));const items=[];const seen=new Set();for(const a of as){const href=a.getAttribute("href");if(!href)continue;let resolvedHref="";try{resolvedHref=new URL(href,baseUrl||document.baseURI).toString();}catch(_){continue;}
if(!isSameOriginUrl(resolvedHref))continue;const rel=urlToRelPath(resolvedHref);if(!rel||!isConceptPage(rel))continue;const loc=normLoc(rel);if(seen.has(loc))continue;seen.add(loc);const rawHtml=String(a.innerHTML||"").trim();const titleHtml=rawHtml?(__lpRepairTitleHtmlFromLoc(loc,rawHtml)||__lpSanitizeRenderedMathHtml(rawHtml)||""):"";const textFromHtml=titleHtml?__lpTitleHtmlToText(titleHtml):"";const textFromDom=cleanTitle(a.textContent||"");const t=__lpRepairTitleMathFromLoc(loc,textFromHtml||textFromDom||cleanTitle(loc));items.push({loc,title:t,titleHtml});}
return items;}catch(_){return[];}}
function __lpFindSectionHtmlInDoc(doc,headingRegex){try{const inner=doc.querySelector("article.md-content__inner");if(!inner)return null;const heads=Array.from(inner.querySelectorAll("h2, h3"));const normHead=(s)=>cleanTitle(s||"").replace(/[^\p{L}\p{N}\s]/gu,"").replace(/\s+/g," ").trim();const h=heads.find((x)=>headingRegex.test(normHead(x.textContent||"")));if(!h)return null;const parts=[];let n=h.nextElementSibling;while(n){const tag=(n.tagName||"").toLowerCase();if(tag==="h2"||tag==="h3")break;parts.push(n.outerHTML);n=n.nextElementSibling;}
return parts.length?parts.join("\n"):null;}catch(_){return null;}}
function __lpExtractRelatedLocsFromFullHtml(html,baseUrl){try{const doc=new DOMParser().parseFromString(String(html||""),"text/html");const section=__lpFindSectionHtmlInDoc(doc,/^related concepts$/i)||__lpFindSectionHtmlInDoc(doc,/^related$/i)||null;if(!section)return[];const items=extractConceptLinksFromHtml(section,baseUrl)||[];return(items||[]).map((x)=>(x&&x.loc)?normLoc(x.loc):"").filter(Boolean);}catch(_){return[];}}
function __lpEnsureTitleCache(graph){try{if(!graph)return null;if(!graph.__lpTitleByLoc)graph.__lpTitleByLoc=new Map();return graph.__lpTitleByLoc;}catch(_){return null;}}
function __lpBuildTitleAliasIndex(collection){const aliases=new Map();const keys=collection instanceof Map?collection.keys():Object.keys(collection||{});for(const key of keys)__lpIndexTitleAlias(aliases,key);return aliases;}
function __lpIndexTitleAlias(aliases,key){const canonical=lpCanonKey(key);let keys=aliases.get(canonical);if(!keys)aliases.set(canonical,keys=[]);if(!keys.includes(key))keys.push(key);return keys;}
function __lpScoreTitleCandidate(loc,title){const t=cleanTitle(title||"");if(!t)return-1;let score=0;if(/[A-Z]/.test(t))score+=20;try{const seg=String(normLoc(loc)).split("/").filter(Boolean).pop()||"";const slugText=cleanTitle(decodeURIComponent(seg).replace(/\.html?$/i,"").replace(/[-_]+/g," "));if(t.toLowerCase()!==slugText.toLowerCase())score+=10;}catch(_){}
score+=Math.min(10,t.length/10);return score;}
function __lpGetTitleCache(graph,key,aliases){try{const k=normLoc(key);const ck=lpCanonKey(k);const c=graph&&graph.__lpTitleByLoc;if(!c||!k)return"";const candidates=[];const addCandidate=(locKey,value)=>{const t=cleanTitle(value||"");if(!t)return;if(lpCanonKey(locKey)!==ck)return;candidates.push({loc:locKey,title:t,score:__lpScoreTitleCandidate(locKey,t)});};if(c instanceof Map){if(c.has(k))addCandidate(k,c.get(k));const kBare=k.replace(/\/+$/g,"");const kSlash=kBare?(kBare+"/"):"";if(kBare&&c.has(kBare))addCandidate(kBare,c.get(kBare));if(kSlash&&c.has(kSlash))addCandidate(kSlash,c.get(kSlash));if(aliases){for(const kk of aliases.get(ck)||[])addCandidate(kk,c.get(kk));}else{for(const[kk,vv]of c.entries())addCandidate(kk,vv);}}else{if(Object.prototype.hasOwnProperty.call(c,k))addCandidate(k,c[k]);const kBare=k.replace(/\/+$/g,"");const kSlash=kBare?(kBare+"/"):"";if(kBare&&Object.prototype.hasOwnProperty.call(c,kBare))addCandidate(kBare,c[kBare]);if(kSlash&&Object.prototype.hasOwnProperty.call(c,kSlash))addCandidate(kSlash,c[kSlash]);for(const kk of aliases?(aliases.get(ck)||[]):Object.keys(c))addCandidate(kk,c[kk]);}
if(!candidates.length)return"";candidates.sort((a,b)=>b.score-a.score);return __lpRepairTitleMathFromLoc(k,candidates[0].title);}catch(_){return"";}}
function __lpEnsureTitleHtmlCache(graph){try{if(!graph)return null;if(!graph.__lpTitleHtmlByLoc)graph.__lpTitleHtmlByLoc=new Map();return graph.__lpTitleHtmlByLoc;}catch(_){return null;}}
function __lpStripDuplicateRenderedMathText(root,doc){try{if(!root||!doc||!root.querySelectorAll)return;const RENDERED_SEL='mjx-container, .MathJax, math, .katex';const RENDERED_BOUNDARY_SEL='mjx-container, .MathJax, .katex';const renderedRoots=Array.from(root.querySelectorAll(RENDERED_BOUNDARY_SEL)).filter((el)=>{try{return!(el.parentElement&&el.parentElement.closest(RENDERED_BOUNDARY_SEL));}
catch(_){return true;}});if(!renderedRoots.length)return;try{let prevRoot=null;let prevSig='';renderedRoots.forEach((el)=>{const tex=lpExtractMathTexFromNode(el)||'';const visible=__lpRenderedMathPlainText(el)||'';const sig=String(el.tagName||'').toLowerCase()+'|'+cleanTitle(tex||visible||el.textContent||'');if(prevRoot&&sig===prevSig){let p=el.previousSibling;while(p&&p.nodeType===3&&!String(p.textContent||'').trim())p=p.previousSibling;if(p===prevRoot){try{el.remove();}catch(_){}
return;}}
prevRoot=el;prevSig=sig;});}catch(_){}
const liveRenderedRoots=Array.from(root.querySelectorAll(RENDERED_BOUNDARY_SEL)).filter((el)=>{try{return!(el.parentElement&&el.parentElement.closest(RENDERED_BOUNDARY_SEL));}
catch(_){return true;}});if(!liveRenderedRoots.length)return;const canonical=(value)=>cleanTitle(String(value||'').replace(/\u00a0/g,' ').replace(/[{}]/g,'').replace(/\\left|\\right/g,'').replace(/\$+/g,'').replace(/^\\\(|\\\)$/g,'').replace(/^\\\[|\\\]$/g,'').replace(/\s+/g,' '));const renderedTexts=liveRenderedRoots.map((el)=>canonical(lpExtractMathTexFromNode(el)||__lpRenderedMathPlainText(el)||el.textContent||'')).filter(Boolean);const renderedSet=new Set(renderedTexts);const renderedJoined=canonical(renderedTexts.join(' '));const isInsideRenderedMath=(node)=>{try{const el=node&&(node.nodeType===1?node:node.parentElement);return!!(el&&el.closest&&el.closest(RENDERED_SEL));}catch(_){return false;}};const nodeHasRendered=(node)=>{if(!node||node.nodeType!==1)return false;try{return!!((node.matches&&node.matches(RENDERED_SEL))||(node.querySelector&&node.querySelector(RENDERED_SEL)));}catch(_){return false;}};const shouldDropRawMathText=(txt)=>{const raw=String(txt||'').trim();if(!raw)return false;const norm=canonical(raw);if(!norm)return false;if(/^\\\([\s\S]+\\\)$/.test(raw)||/^\\\[[\s\S]+\\\]$/.test(raw)||/^\$[\s\S]+\$$/.test(raw))return true;if(/\\\(|\\\)|\\\[|\\\]|\$\$/.test(raw))return true;if(renderedSet.has(norm))return true;if(renderedJoined&&norm===renderedJoined)return true;if(renderedTexts.length>1){const pieces=norm.split(/\s+/).filter(Boolean);if(pieces.length>1&&pieces.every((piece)=>renderedSet.has(piece)))return true;}
return false;};const walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return isInsideRenderedMath(node)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}});const drop=[];while(walker.nextNode()){const node=walker.currentNode;if(!node||!node.parentNode)continue;const txt=String(node.nodeValue||'');if(!txt||!txt.trim())continue;const parent=node.parentNode;const hasRenderedSibling=Array.from(parent.childNodes||[]).some((sib)=>sib&&sib!==node&&nodeHasRendered(sib));if(hasRenderedSibling&&shouldDropRawMathText(txt))drop.push(node);}
drop.forEach((node)=>{try{node.nodeValue='';}catch(_){}});Array.from(root.querySelectorAll('span, i, b, em, strong, small')).forEach((el)=>{try{if(!el||!el.parentNode||!el.querySelectorAll)return;if(isInsideRenderedMath(el))return;if(el.querySelector(RENDERED_SEL))return;const txt=String(el.textContent||'');if(!txt||!txt.trim())return;const hasRenderedSibling=Array.from(el.parentNode.childNodes||[]).some((sib)=>sib&&sib!==el&&nodeHasRendered(sib));if(hasRenderedSibling&&shouldDropRawMathText(txt))el.remove();}catch(_){}});}catch(_){}}
function __lpRenderedMathRootsWithin(scope){try{if(!scope||!scope.querySelectorAll)return[];const ROOT_SEL='mjx-container, .MathJax, .katex, math';const BOUNDARY_SEL='mjx-container, .MathJax, .katex';const ASSISTIVE_SEL='.katex-mathml, mjx-assistive-mml, .mjx-assistive-mml, .MJX_Assistive_MathML';return Array.from(scope.querySelectorAll(ROOT_SEL)).filter((el)=>{try{if(!el||!el.matches)return false;if(el.closest&&el.closest(ASSISTIVE_SEL))return false;const parentRendered=el.parentElement&&el.parentElement.closest&&el.parentElement.closest(BOUNDARY_SEL);if(parentRendered&&scope.contains(parentRendered))return false;return true;}catch(_){return true;}});}catch(_){return[];}}
function __lpSanitizeRenderedMathHtml(html){const raw=String(html||"").trim();if(!raw)return"";try{const doc=new DOMParser().parseFromString(`<div data-lp-title-html-root="1">${raw}</div>`,"text/html");const root=doc.querySelector('[data-lp-title-html-root="1"]')||doc.body;if(!root)return raw;const removeSelectors=['.MathJax_Preview','.MJX_LiveRegion','.MJX_Assistive_MathML','.mjx-assistive-mml','mjx-assistive-mml','[aria-hidden="false"].MJX_Assistive_MathML','annotation','annotation-xml'];Array.from(root.querySelectorAll(removeSelectors.join(','))).forEach((node)=>{try{node.remove();}catch(_){}});Array.from(root.querySelectorAll('.arithmatex')).forEach((node)=>{try{const rendered=__lpRenderedMathRootsWithin(node);if(rendered.length){const wrap=doc.createElement('span');wrap.className='lp-math-rendered';const seen=new Set();for(const child of rendered){const sig=`${String(child.tagName || '').toLowerCase()}|${cleanTitle(child.textContent || '')}`;if(seen.has(sig))continue;seen.add(sig);try{wrap.appendChild(child.cloneNode(true));}catch(_){}}
if(!wrap.childNodes.length)return;node.replaceWith(wrap);return;}
let rawMath='';const scriptMath=Array.from(node.querySelectorAll('script[type^="math/tex"]'));if(scriptMath.length){rawMath=scriptMath.map((el)=>String(el.textContent||'').trim()).filter(Boolean).join(' ');if(rawMath){const firstType=String(scriptMath[0].getAttribute('type')||'').toLowerCase();rawMath=firstType.indexOf('mode=display')>=0?`\\[${rawMath}\\]`:`\\(${rawMath}\\)`;}}
if(!rawMath)rawMath=String(node.textContent||'').trim();if(!rawMath)return;const wrap=doc.createElement('span');wrap.className='lp-math-raw';wrap.textContent=rawMath;node.replaceWith(wrap);}catch(_){}});Array.from(root.querySelectorAll('script[type^="math/tex"], script[type^="math/asciimath"]')).forEach((node)=>{try{const rawMath=String(node.textContent||'').trim();if(!rawMath){node.remove();return;}
const typ=String(node.getAttribute('type')||'').toLowerCase();const wrap=doc.createElement('span');wrap.className='lp-math-raw';wrap.textContent=lpEnsureMathDelimiters(rawMath,typ.indexOf('mode=display')>=0);node.replaceWith(wrap);}catch(_){}});const hasRenderedMath=__lpRenderedMathRootsWithin(root).length>0;if(hasRenderedMath){__lpStripDuplicateRenderedMathText(root,doc);const walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT);const drop=[];while(walker.nextNode()){const node=walker.currentNode;const txt=String(node&&node.nodeValue||'');const norm=txt.replace(/\s+/g,' ').trim();if(!norm)continue;if(/^\\\(.+\\\)$/.test(norm)||/^\\\[.+\\\]$/.test(norm)||/^\$.+\$$/.test(norm)||/\\\(|\\\)|\\\[|\\\]/.test(norm)){drop.push(node);}}
drop.forEach((node)=>{try{node.nodeValue='';}catch(_){}});}
return String(root.innerHTML||'').trim();}catch(_){return raw;}}
function __lpRenderedMathPlainText(el){try{if(!el||!el.cloneNode)return"";const clone=el.cloneNode(true);if(clone.querySelectorAll){if(clone.matches&&clone.matches('.katex')){const htmlBranch=clone.querySelector('.katex-html');if(htmlBranch)return cleanTitle(htmlBranch.textContent||'');}
Array.from(clone.querySelectorAll(['.katex-mathml','mjx-assistive-mml','.mjx-assistive-mml','.MJX_Assistive_MathML','.MathJax_Preview','.MJX_LiveRegion','annotation','annotation-xml'].join(','))).forEach((n)=>{try{n.remove();}catch(_){}});}
return cleanTitle(clone.textContent||"");}catch(_){return"";}}
function __lpTitleHtmlToText(html){try{const doc=new DOMParser().parseFromString(`<div>${String(html || "")}</div>`,"text/html");const root=doc.body||doc;try{root.querySelectorAll('.katex-html, mjx-assistive-mml, .MJX_LiveRegion, .MathJax_Preview').forEach((el)=>{try{el.remove();}catch(_){}});}catch(_){}
return cleanTitle(root.textContent||"");}catch(_){return cleanTitle(String(html||"").replace(/<[^>]+>/g," "));}}
function __lpGetTitleHtmlCache(graph,key){try{const k=normLoc(key);const ck=lpCanonKey(k);const c=graph&&graph.__lpTitleHtmlByLoc;if(!c||!k)return"";const candidates=[];const addCandidate=(locKey,value)=>{const html=__lpSanitizeRenderedMathHtml(value);if(!html)return;if(lpCanonKey(locKey)!==ck)return;const text=__lpTitleHtmlToText(html);candidates.push({loc:locKey,html,score:__lpScoreTitleCandidate(locKey,text)+(/<(?:mjx-container|math)\b|class=["\'][^"\']*katex/i.test(html)||/\$[^$]+\$/.test(html)?15:0)});};if(c instanceof Map){if(c.has(k))addCandidate(k,c.get(k));const kBare=k.replace(/\/+$/g,"");const kSlash=kBare?(kBare+"/"):"";if(kBare&&c.has(kBare))addCandidate(kBare,c.get(kBare));if(kSlash&&c.has(kSlash))addCandidate(kSlash,c.get(kSlash));for(const[kk,vv]of c.entries())addCandidate(kk,vv);}else{if(Object.prototype.hasOwnProperty.call(c,k))addCandidate(k,c[k]);const kBare=k.replace(/\/+$/g,"");const kSlash=kBare?(kBare+"/"):"";if(kBare&&Object.prototype.hasOwnProperty.call(c,kBare))addCandidate(kBare,c[kBare]);if(kSlash&&Object.prototype.hasOwnProperty.call(c,kSlash))addCandidate(kSlash,c[kSlash]);for(const kk of Object.keys(c))addCandidate(kk,c[kk]);}
if(!candidates.length)return"";candidates.sort((a,b)=>b.score-a.score);return candidates[0].html;}catch(_){return"";}}
function __lpSetTitleHtmlCache(graph,key,html,force){try{const k=normLoc(key);const raw=__lpSanitizeRenderedMathHtml(html);if(!k||!raw)return;if(__lpRenderedTitleHtmlLooksBrokenForLoc(k,raw))return;const c=__lpEnsureTitleHtmlCache(graph);if(!c)return;const prevBest=String(__lpGetTitleHtmlCache(graph,k)||"").trim();const nextScore=__lpScoreTitleCandidate(k,__lpTitleHtmlToText(raw));const prevScore=__lpScoreTitleCandidate(k,__lpTitleHtmlToText(prevBest));if(!force&&prevBest&&nextScore<prevScore)return;if(c instanceof Map){c.set(k,raw);for(const[kk]of c.entries()){if(lpCanonKey(kk)===lpCanonKey(k))c.set(kk,raw);}}else{c[k]=raw;for(const kk of Object.keys(c)){if(lpCanonKey(kk)===lpCanonKey(k))c[kk]=raw;}}}catch(_){}}
function __lpSetTitleCache(graph,key,title,force,batch){try{const k=normLoc(key);const incoming=cleanTitle(title||"");if(__lpShouldBlockTitleMutation(graph,k,incoming,batch&&batch.nodes))return;const t=__lpRepairTitleMathFromLoc(k,incoming);if(!k||!t)return;const c=__lpEnsureTitleCache(graph);if(!c)return;const aliases=batch&&batch.cache;const prevBest=cleanTitle(__lpGetTitleCache(graph,k,aliases)||"");if(!force&&prevBest&&__lpScoreTitleCandidate(k,t)<__lpScoreTitleCandidate(k,prevBest))return;if(prevBest&&lpHasMathMarkup(prevBest)&&!lpHasMathMarkup(t))return;if(c instanceof Map){c.set(k,t);for(const kk of aliases?__lpIndexTitleAlias(aliases,k):c.keys()){if(lpCanonKey(kk)===lpCanonKey(k))c.set(kk,t);}}else{c[k]=t;for(const kk of aliases?__lpIndexTitleAlias(aliases,k):Object.keys(c)){if(lpCanonKey(kk)===lpCanonKey(k))c[kk]=t;}}}catch(_){}}
function __lpForceGraphNodeTitle(graph,key,title,aliases){try{const k=normLoc(key);const ck=lpCanonKey(k);const incoming=cleanTitle(title||"");if(__lpShouldBlockTitleMutation(graph,k,incoming,aliases))return;const t=__lpRepairTitleMathFromLoc(k,incoming);if(!graph||!graph.nodes||!t||!k)return;let hit=false;for(const kk of aliases?(aliases.get(ck)||[]):Object.keys(graph.nodes)){if(lpCanonKey(kk)!==ck)continue;const oldNode=graph.nodes[kk];const nextNode=(oldNode&&typeof oldNode==="object")?oldNode:{};const oldTitle=cleanTitle((nextNode&&(nextNode.title||nextNode.name||nextNode.label))||"");if(oldTitle&&lpHasMathMarkup(oldTitle)&&!lpHasMathMarkup(t)){hit=true;continue;}
nextNode.title=t;if("name"in nextNode)nextNode.name=t;if("label"in nextNode)nextNode.label=t;graph.nodes[kk]=nextNode;hit=true;}
if(!hit){graph.nodes[k]={title:t};if(aliases)__lpIndexTitleAlias(aliases,k);}}catch(_){}}
function __lpReadSessionRelatedBodyCache(){let obj={};try{const raw=sessionStorage.getItem(LP_RELATED_BODY_CACHE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed&&typeof parsed==="object")obj=parsed;}}catch(_){obj={};}
try{if(__lpRelatedCachePending){for(const k in __lpRelatedCachePending){if(Object.prototype.hasOwnProperty.call(__lpRelatedCachePending,k))obj[k]=__lpRelatedCachePending[k];}}}catch(_){}
return obj;}
let __lpRelatedCachePending=null;let __lpRelatedCacheFlushTimer=0;function __lpFlushSessionRelatedBodyCache(){__lpRelatedCacheFlushTimer=0;const pending=__lpRelatedCachePending;__lpRelatedCachePending=null;if(!pending)return;try{const obj=__lpReadSessionRelatedBodyCache();for(const k in pending){if(Object.prototype.hasOwnProperty.call(pending,k))obj[k]=pending[k];}
sessionStorage.setItem(LP_RELATED_BODY_CACHE_KEY,JSON.stringify(obj));}catch(_){}}
function __lpWriteSessionRelatedBodyCache(key,arr){try{const k=normLoc(key);if(!k||!isConceptPage(k))return;if(!__lpRelatedCachePending)__lpRelatedCachePending=Object.create(null);__lpRelatedCachePending[k]=Array.isArray(arr)?uniq(arr.map(normLoc).filter(Boolean)):[];if(__lpRelatedCacheFlushTimer)return;__lpRelatedCacheFlushTimer=setTimeout(__lpFlushSessionRelatedBodyCache,400);}catch(_){}}
try{window.addEventListener("pagehide",__lpFlushSessionRelatedBodyCache);document.addEventListener("visibilitychange",function(){if(document.hidden)__lpFlushSessionRelatedBodyCache();});}catch(_){}
function __lpRestoreRelatedBodyCacheFromSession(graph){try{if(!graph||graph.__lpRelatedSessionRestored)return;graph.__lpRelatedSessionRestored=true;const obj=__lpReadSessionRelatedBodyCache();const entries=Object.entries(obj||{});if(!entries.length)return;if(!graph.__lpRelatedFromBody)graph.__lpRelatedFromBody=new Map();const c=graph.__lpRelatedFromBody;for(const[rawKey,rawArr]of entries){const k=normLoc(rawKey);if(!k||!isConceptPage(k))continue;const arr=Array.isArray(rawArr)?uniq(rawArr.map(normLoc).filter(Boolean)):[];if(c instanceof Map)c.set(k,arr);else c[k]=arr;}}catch(_){}}
async function __lpEnsureGlobalRelatedBodyIndex(graph,opts){return;}
function __lpUpdateRelatedReverseIndex(graph,srcLoc,prevArr,nextArr){return;}
function __lpGetRelatedCache(graph,key){try{const k=normLoc(key);const c=graph&&graph.__lpRelatedFromBody;if(!c)return null;if(c instanceof Map)return c.get(k)||null;return Object.prototype.hasOwnProperty.call(c,k)?(c[k]||null):null;}catch(_){return null;}}
function __lpSetRelatedCache(graph,key,arr){try{const k=normLoc(key);const next=uniq(Array.isArray(arr)?arr.map(normLoc).filter(Boolean):[]);const prev=__lpGetRelatedCache(graph,k)||[];const changed=(prev.length!==next.length||prev.some((x,i)=>normLoc(x)!==normLoc(next[i])));if(!graph.__lpRelatedFromBody)graph.__lpRelatedFromBody=new Map();if(graph.__lpRelatedFromBody instanceof Map)graph.__lpRelatedFromBody.set(k,next);else graph.__lpRelatedFromBody[k]=next;__lpWriteSessionRelatedBodyCache(k,next);if(changed){try{window.dispatchEvent(new CustomEvent("lp:related-cache-updated",{detail:{loc:k}}));}catch(_){}}}catch(_){}}
const LP_RELATED_PREFETCH_CONCURRENCY=2;const LP_RELATED_FETCH_TIMEOUT_MS=15000;const __lpRelatedFetchQueue=[];let __lpRelatedFetchActive=0;function __lpPumpRelatedFetchQueue(){while(__lpRelatedFetchActive<LP_RELATED_PREFETCH_CONCURRENCY&&__lpRelatedFetchQueue.length){const job=__lpRelatedFetchQueue.shift();if(!job)continue;__lpRelatedFetchActive+=1;Promise.resolve().then(job.task).then(job.resolve,job.reject).finally(()=>{__lpRelatedFetchActive=Math.max(0,__lpRelatedFetchActive-1);__lpPumpRelatedFetchQueue();});}}
function __lpRunRelatedFetch(task){return new Promise((resolve,reject)=>{__lpRelatedFetchQueue.push({task,resolve,reject});__lpPumpRelatedFetchQueue();});}
function __lpRelatedCompanionUrl(fullUrl){try{const u=new URL(String(fullUrl||""),document.baseURI);if(u.origin!==window.location.origin||!/\.html$/i.test(u.pathname||""))return"";u.pathname=u.pathname.replace(/\.html$/i,".preview.html");u.search="";u.hash="";return u.toString();}catch(_){return"";}}
function __lpFetchRelatedPageHtml(fullUrl){const init={credentials:"same-origin",priority:"low"};let controller=null;try{controller=new AbortController();}catch(_){}
if(controller)init.signal=controller.signal;const fetchFull=()=>fetch(fullUrl,init).then((r)=>{if(!r||!r.ok)throw new Error("HTTP "+(r?r.status:"fetch failed"));return r.text();});const companionUrl=__lpRelatedCompanionUrl(fullUrl);const request=!companionUrl?fetchFull():fetch(companionUrl,init).then((r)=>(r&&r.ok)?r.text():"").then((html)=>{const value=String(html||"");const valid=/<meta\b[^>]*name=["']mk-hover-preview["'][^>]*content=["']1["'][^>]*>/i.test(value)&&/<article\b/i.test(value)&&/\bmd-content__inner\b/i.test(value);return valid?value:"";}).catch(()=>"").then((html)=>html||fetchFull());let timeoutId=0;const deadline=new Promise((resolve,reject)=>{timeoutId=window.setTimeout(()=>{try{controller&&controller.abort();}catch(_){}
reject(new Error("Related-page fetch timed out"));},LP_RELATED_FETCH_TIMEOUT_MS);});return Promise.race([request,deadline]).finally(()=>{if(timeoutId)clearTimeout(timeoutId);});}
function __lpEnsureRelatedFromBody(graph,loc,onUpdate){try{if(!graph)return Promise.resolve([]);const key=normLoc(loc);if(!key||!isConceptPage(key))return Promise.resolve([]);const cached=__lpGetRelatedCache(graph,key);if(cached)return Promise.resolve(cached);if(!graph.__lpRelatedFetchPromises)graph.__lpRelatedFetchPromises=new Map();if(graph.__lpRelatedFetchPromises.has(key))return graph.__lpRelatedFetchPromises.get(key);const url=toAbsolutePageUrl(key);const p=__lpRunRelatedFetch(()=>__lpFetchRelatedPageHtml(url).then(async(html2)=>{await lpWaitForLocalMapInteractionIdle(15000);await new Promise((resolve)=>window.setTimeout(resolve,0));try{const doc=new DOMParser().parseFromString(String(html2||""),"text/html");const h1=doc.querySelector("article.md-content__inner h1")||doc.querySelector("h1");const h1t=cleanTitle(h1?(h1.textContent||""):"");const h1html=lpExtractRenderableTitleHtmlFromHeading(h1);if(h1t){__lpSetTitleCache(graph,key,h1t,true);__lpForceGraphNodeTitle(graph,key,h1t);}
if(h1html)__lpSetTitleHtmlCache(graph,key,h1html,true);const section=__lpFindSectionHtmlInDoc(doc,/^related concepts$/i)||__lpFindSectionHtmlInDoc(doc,/^related$/i)||null;const items=section?(extractConceptLinksFromHtml(section,url)||[]):[];for(const it of items){if(it&&it.loc&&it.title)__lpSetTitleCache(graph,it.loc,it.title,false);if(it&&it.loc&&it.titleHtml)__lpSetTitleHtmlCache(graph,it.loc,it.titleHtml,false);}
const arr=(items||[]).map((x)=>(x&&x.loc)?normLoc(x.loc):"").filter((loc2)=>loc2&&lpCanonKey(loc2)!==lpCanonKey(key));__lpSetRelatedCache(graph,key,arr);if(typeof onUpdate==="function")onUpdate(key,arr);return arr;}catch(_){const arr=(__lpExtractRelatedLocsFromFullHtml(html2,url)||[]).filter((loc2)=>loc2&&lpCanonKey(loc2)!==lpCanonKey(key));__lpSetRelatedCache(graph,key,arr);if(typeof onUpdate==="function")onUpdate(key,arr);return arr;}}).catch(()=>[])).finally(()=>{try{graph.__lpRelatedFetchPromises.delete(key);}catch(_){}});graph.__lpRelatedFetchPromises.set(key,p);return p;}catch(_){return Promise.resolve([]);}}
function __lpPrefetchRelatedForLocs(graph,locs,onUpdate,limit){try{const uniqLocs=Array.from(new Set((locs||[]).map(normLoc))).filter(Boolean);const cap=Math.max(0,Math.min(40,Number(limit||0)||0));const slice=cap?uniqLocs.slice(0,cap):uniqLocs;if(!slice.length)return Promise.resolve([]);const out=new Array(slice.length);let cursor=0;const worker=async()=>{for(;;){const i=cursor++;if(i>=slice.length)return;try{out[i]=await __lpEnsureRelatedFromBody(graph,slice[i],onUpdate);}catch(_){out[i]=[];}}};const lanes=Math.min(LP_RELATED_PREFETCH_CONCURRENCY,slice.length);const workers=[];for(let i=0;i<lanes;i++)workers.push(worker());return Promise.all(workers).then(()=>out);}catch(_){return Promise.resolve([]);}}
async function __lpPrimeSidebarRelated(graph,currentLoc,opts){try{if(!graph)return;const cur=normLoc(currentLoc);if(!cur||!isConceptPage(cur))return;const deep=!!(opts&&opts.deep);const curTitle=cleanTitle(getPageTitleFromDom());const curTitleHtml=getPageTitleHtmlFromDom();if(curTitle){__lpSetTitleCache(graph,cur,curTitle,true);__lpForceGraphNodeTitle(graph,cur,curTitle);}
if(curTitleHtml)__lpSetTitleHtmlCache(graph,cur,curTitleHtml,true);const relatedHtml=findSectionHtmlByHeadingText(/^related concepts$/i)||findSectionHtmlByHeadingText(/^related$/i)||null;const fromBody=relatedHtml?extractConceptLinksFromHtml(relatedHtml):[];try{(fromBody||[]).forEach((it)=>{if(!it||!it.loc)return;if(it.title)__lpSetTitleCache(graph,it.loc,it.title,false);if(it.titleHtml)__lpSetTitleHtmlCache(graph,it.loc,it.titleHtml,false);});}catch(_){}
const bodyLocs=(fromBody||[]).map((x)=>x&&x.loc?normLoc(x.loc):"").filter((loc2)=>loc2&&lpCanonKey(loc2)!==lpCanonKey(cur));try{__lpSetRelatedCache(graph,cur,bodyLocs);}catch(_){}
const nb=getNeighbourhood(graph,cur,1,1,"off")||{nodes:[]};const firstWave=uniq([cur,...getPrereqs(graph,cur),...getDependents(graph,cur),...bodyLocs,...((nb&&nb.nodes)||[])]).filter(Boolean);await __lpPrefetchRelatedForLocs(graph,firstWave,null,deep?18:8);}catch(_){}}
function getNeighbourhood(graph,start,maxBackDist,maxFwdDist,relMode){if(!graph||!start)return{level:new Map(),nodes:[],edges:[],core:[]};const level=new Map();level.set(start,0);const prereqs=uniq(getPrereqs(graph,start));const dependents=lpLimitDependentsForMap(graph,start);const relateds=uniq(getRelated(graph,start)).filter((x)=>!prereqs.includes(x)&&!dependents.includes(x)&&x!==start);for(const p of prereqs)level.set(p,-1);for(const d of dependents)level.set(d,1);for(const r of relateds)level.set(r,0.5);const core=uniq([start,...prereqs,...dependents]);let nodes=uniq([start,...prereqs,...dependents,...relateds]);const nodeSet=new Set(nodes);const edges=[];const seen=new Set();for(const p of prereqs){if(!nodeSet.has(p))continue;const k=`${lpCanonKey(start)}|${lpCanonKey(p)}|prereq`;if(seen.has(k))continue;seen.add(k);edges.push({from:start,to:p,type:"prereq"});}
for(const d of dependents){if(!nodeSet.has(d))continue;const k=`${lpCanonKey(d)}|${lpCanonKey(start)}|prereq`;if(seen.has(k))continue;seen.add(k);edges.push({from:d,to:start,type:"prereq"});}
const relStart=new Set((getRelated(graph,start)||[]).map(lpCanonKey).filter(Boolean));for(const r of relateds){if(!nodeSet.has(r))continue;const pairKey=lpPairKey(start,r);if(!pairKey||seen.has(pairKey+"|related"))continue;if(!relStart.has(lpCanonKey(r)))continue;seen.add(pairKey+"|related");const lo=start<r?start:r;const hi=start<r?r:start;edges.push({from:lo,to:hi,type:"related"});}
const deg=new Map();for(const e of edges){deg.set(e.from,(deg.get(e.from)||0)+1);deg.set(e.to,(deg.get(e.to)||0)+1);}
nodes=nodes.filter((n)=>n===start||(deg.get(n)||0)>0);const keep=new Set(nodes);for(const k of Array.from(level.keys())){if(!keep.has(k))level.delete(k);}
return{level,nodes,edges:edges.filter((e)=>keep.has(e.from)&&keep.has(e.to)),core:core.filter((n)=>keep.has(n))};}
const LP_MAP_PAN_KEEP_SHARE=0.35;const LP_MAP_PAN_KEEP_MIN=64;function lpMapPanKeep(scaledSpan,stageSpan){const span=Math.min(Number(scaledSpan)||0,Number(stageSpan)||0);if(!(span>0))return 0;return Math.min(span,Math.max(LP_MAP_PAN_KEEP_MIN,span*LP_MAP_PAN_KEEP_SHARE));}
function lpMapFitCamera(records,area,minScale,maxScale,semanticScale){const rows=(records||[]).filter((r)=>r&&[r.x,r.y,r.w,r.h].every(Number.isFinite)&&r.w>0&&r.h>0);if(!rows.length||!area||!(area.width>0)||!(area.height>0)||!(minScale>0)||!(maxScale>=minScale))return null;const boundsAt=(scale)=>{const semantic=Math.max(1,Number(semanticScale&&semanticScale(scale))||1);let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;rows.forEach((r)=>{left=Math.min(left,r.x-r.w*semantic/2);right=Math.max(right,r.x+r.w*semantic/2);top=Math.min(top,r.y-r.h*semantic/2);bottom=Math.max(bottom,r.y+r.h*semantic/2);});return{left,top,right,bottom};};const fits=(scale)=>{const b=boundsAt(scale);return(b.right-b.left)*scale<=area.width&&(b.bottom-b.top)*scale<=area.height;};const limited=!fits(minScale);let low=minScale,high=maxScale;if(!limited&&fits(high))low=high;else if(!limited){for(let i=0;i<18;i++){const mid=(low+high)/2;if(fits(mid))low=mid;else high=mid;}}
const bounds=boundsAt(low);return{scale:low,tx:area.left+area.width/2-(bounds.left+bounds.right)*low/2,ty:area.top+area.height/2-(bounds.top+bounds.bottom)*low/2,limited,count:rows.length};}
function lpMapFitArea(modal,route,view){const stage=modal&&modal.querySelector('.lp-mapstage');if(!stage)return null;const rect=stage.getBoundingClientRect();const width=Number(stage.clientWidth)||Number(rect.width)||0;const height=Number(stage.clientHeight)||Number(rect.height)||0;if(!(width>0)||!(height>0))return null;if(route){view.stageW=width;view.stageH=height;}
else{view.__lpStageW=width;view.__lpStageH=height;}
const safe=route?lpH1StudyStartSafeInsets(modal):lpLocalMapSafeInsets(modal,width,height);let bottom=Math.max(24,Number(safe.bottom)||0);const launch=route&&modal.querySelector('[data-lp-h1sg-dock-launch]');if(launch&&!launch.hidden){const launchRect=launch.getBoundingClientRect();if(launchRect.height>0&&launchRect.top<rect.bottom)bottom=Math.max(bottom,rect.bottom-launchRect.top+12);}
const left=Math.max(24,Number(safe.left)||0)+12;const top=Math.max(24,Number(safe.top)||0)+12;const right=Math.max(24,Number(safe.right)||0)+12;return{left,top,width:Math.max(1,width-left-right),height:Math.max(1,height-top-bottom-12)};}
function lpMapFitRecords(modal,viewport,view,route,path){const engine=modal.classList.contains('lp-webgl3d')&&modal.__lpWebgl3dEngine;if(engine)lpWebgl3dFlushRotation(engine);const stageRect=modal.querySelector('.lp-mapstage').getBoundingClientRect();const scale=Math.max(.001,Number(view.scale)||1);const semantic=route?lpH1StudyRouteSemanticScale(modal,scale):1;const selected=path&&path.length>1?new Set(path.map(lpCanonKey)):null;const nodes=Array.from(viewport.querySelectorAll('.lp-node[data-lp-loc]')).filter((node)=>!selected||selected.has(lpCanonKey(node.getAttribute('data-lp-loc')||'')));const culled=nodes.filter((node)=>node.classList.contains('lp-pan-culled'));culled.forEach((node)=>node.classList.remove('lp-pan-culled'));try{return nodes.map((node)=>{const key=lpCanonKey(node.getAttribute('data-lp-loc')||'');const rect=node.getBoundingClientRect();if(!(rect.width>0)||!(rect.height>0))return null;const projectedNode=engine&&engine.nodeMap&&engine.nodeMap.get(key);const point=projectedNode?lpWebgl3dProject(engine,projectedNode):null;const x=point?point.x:(rect.left-stageRect.left+rect.width/2-(Number(view.tx)||0))/scale;const y=point?point.y:(rect.top-stageRect.top+rect.height/2-(Number(view.ty)||0))/scale;return{x,y,w:rect.width/scale/semantic,h:rect.height/scale/semantic};}).filter(Boolean);}finally{culled.forEach((node)=>node.classList.add('lp-pan-culled'));}}
function lpMapFitView(modal){if(!modal||!modal.classList.contains('lp-open'))return false;const route=modal.id==='lp-h1sg-modal';const viewport=route?lpH1StudyStartViewport(modal):modal.querySelector('[data-map-viewport]');const view=route?lpH1StudyStartEnsureView(modal):window.__lpMapState;if(!viewport||!view||(route&&modal.__lpH1LaunchBusy))return false;if(typeof modal.__lpStopZoomGesture==='function')modal.__lpStopZoomGesture();const state=route&&modal.__lpH1StudyState;const path=state&&Array.isArray(state.path)?state.path:[];if(route){lpH1StudyRouteAnimStop(modal);if(path.length>1)lpH1StudyStartRenderSelection(viewport,state,{staticView:true});}
const records=lpMapFitRecords(modal,viewport,view,route,path);const minScale=lpMapMinActualScale();const maxScale=Math.min(lpMapMaxActualScale(),lpMapDefaultActualScale());const semantic=route?(scale)=>lpH1StudyRouteSemanticScale(modal,scale):null;let fit=lpMapFitCamera(records,lpMapFitArea(modal,route,view),minScale,maxScale,semantic);if(!fit)return false;const status=modal.querySelector('[data-lp-map-fit-status]');if(status){const initiallyLimited=fit.limited;status.hidden=false;status.textContent=fit.limited?`Minimum zoom (${lpMapDisplayPctFromScale(minScale)}%). Drag to explore the rest.`:(path.length>1?'Selected path fitted.':'Map fitted.');fit=lpMapFitCamera(records,lpMapFitArea(modal,route,view),minScale,maxScale,semantic)||fit;if(fit.limited&&!initiallyLimited){status.textContent=`Minimum zoom (${lpMapDisplayPctFromScale(minScale)}%). Drag to explore the rest.`;fit=lpMapFitCamera(records,lpMapFitArea(modal,route,view),minScale,maxScale,semantic)||fit;}}
view.scale=fit.scale;view.tx=fit.tx;view.ty=fit.ty;view.userMoved=true;if(route){view.forceCenter=false;modal.__lpH1PreserveViewUntil=Date.now()+900;lpH1StudyStartApplyTransform(modal,{skipClamp:true});lpH1StudyStartCullForDrag(modal,true,true);}else{view.__lpForceCenter=false;if(typeof modal.__lpApplyTransform==='function')modal.__lpApplyTransform({skipClamp:true});}
return true;}
function lpMapSyncRouteContext(modal){const state=modal&&modal.__lpH1StudyState;const copy=modal&&modal.querySelector('[data-lp-map-context]');const endpoints=modal&&modal.querySelector('[data-lp-map-route-endpoints]');if(!copy||!endpoints)return;const path=state&&Array.isArray(state.path)?state.path:[];const hasPath=path.length>1;const text=hasPath?`${path.length} concepts · Start guided study to begin.`:'Select a node to show a learning path.';if(copy.textContent!==text)copy.textContent=text;endpoints.hidden=!hasPath;const visibleTitle=(loc)=>{const node=lpH1StudyStartFindNodeEl(modal,loc);if(!node||lpH1StudyRouteNodeMasked(node,state)||node.classList.contains('is-route-revealing'))return'Unknown concept';const title=node.querySelector('.lp-node-title');const text=String(title&&(title.innerText||title.textContent)||'').replace(/\s+/g,' ').trim();return text.length>72?text.slice(0,69)+'…':(text||'Concept');};const labels=hasPath?`Start: ${visibleTitle(path[0])} → Goal: ${visibleTitle(path[path.length - 1])}`:'';if(endpoints.textContent!==labels){endpoints.textContent=labels;endpoints.title=labels;}
const fit=modal.querySelector('[data-lp-map-fit]');if(fit){fit.setAttribute('aria-label',hasPath?'Fit selected learning path in view':'Fit all map nodes in view');fit.setAttribute('title',hasPath?'Zoom out until the selected learning path fits on screen':'Zoom out until every concept fits on screen');const label=fit.querySelector&&fit.querySelector('.lp-map-fit-txt');const labelText=hasPath?'Fit path':'Fit all';if(label&&label.textContent!==labelText)label.textContent=labelText;}}
function lpMapSyncRouteContextForNode(node,state){const path=state&&Array.isArray(state.path)?state.path:[];if(path.length<2||!node||!node.closest)return;const key=lpCanonKey(node.getAttribute('data-lp-loc')||'');if(key===lpCanonKey(path[0])||key===lpCanonKey(path[path.length-1]))lpMapSyncRouteContext(node.closest('#lp-h1sg-modal'));}
function lpMapClearFitStatus(modal){const status=modal&&modal.querySelector('[data-lp-map-fit-status]');if(status){status.hidden=true;status.textContent='';}}
function lpLocalMapResetView(modal,st){const state=st||window.__lpMapState;if(!modal||!state)return;lpMapClearFitStatus(modal);const stageW=Math.max(0,Number(state.__lpStageW)||0);const stageH=Math.max(0,Number(state.__lpStageH)||0);const safe=lpLocalMapSafeInsets(modal,stageW,stageH);const centerX=Number.isFinite(safe.centerX)?safe.centerX:(stageW/2);const centerY=Number.isFinite(safe.centerY)?safe.centerY:(stageH/2);const target=lpLocalMapPreferredTargetPoint(modal,state);const scale=lpMapDefaultActualScale();state.scale=scale;state.tx=centerX-(Number(target.x)||0)*scale;state.ty=centerY-(Number(target.y)||0)*scale;state.userMoved=false;state.__lpForceCenter=false;}
let __lpLiteMathKatexRefreshBound=false;function lpFallbackLiteMathHtml(rawMath){const body=lpStripMathDelimiters(rawMath);const pretty=lpPrettyInlineMathText(rawMath||"");return`<span class="lp-lite-math" aria-label="${escapeHtml(body)}">${escapeHtml(pretty || body)}</span>`;}
function lpMapInlineMathSegmentHtml(rawMath){const katexHtml=lpKatexInlineMathHtml(rawMath);if(katexHtml)return katexHtml;return lpFallbackLiteMathHtml(rawMath);}
function lpRefreshLiteMathTitleSpans(){if(!lpKatexAvailable())return;try{document.querySelectorAll(["#lp-map-modal .lp-node-title[data-lp-raw-title]","#lp-h1sg-modal .lp-node-title[data-lp-raw-title]"].join(",")).forEach((titleSpan)=>{const raw=String(titleSpan.getAttribute("data-lp-raw-title")||"").trim();if(!raw||!lpHasMathMarkup(raw))return;titleSpan.setAttribute("data-lp-skip-typeset","1");titleSpan.classList.add("mk-no-runtime-math");titleSpan.innerHTML=lpLiteMathTitleHtml(raw);});}catch(_){}}
function lpScheduleLiteMathKatexRefresh(){if(lpKatexAvailable())return;if(__lpLiteMathKatexRefreshBound)return;__lpLiteMathKatexRefreshBound=true;let ran=false;const runOnce=()=>{if(ran||!lpKatexAvailable())return;ran=true;__lpLiteMathKatexRefreshBound=false;try{lpRefreshLiteMathTitleSpans();}catch(_){}};try{window.addEventListener("mk:math-runtime-ready",runOnce,{once:true});}catch(_){}
try{const p=window.MathJax&&window.MathJax.startup&&window.MathJax.startup.promise;if(p&&typeof p.then==="function")p.then(()=>window.setTimeout(runOnce,0)).catch(()=>{});}catch(_){}
try{window.setTimeout(runOnce,200);}catch(_){}
try{window.setTimeout(runOnce,800);}catch(_){}}
function lpLiteMathTitleHtml(rawTitle){const src=String(rawTitle||"");if(!src)return"";try{const parts=lpSplitRevealTitle(src);if(!Array.isArray(parts)||!parts.some((p)=>p&&p.type==="math"))return escapeHtml(src);return parts.map((part)=>{if(!part)return"";if(part.type!=="math")return escapeHtml(part.text||"");return lpMapInlineMathSegmentHtml(part.text||"");}).join("");}catch(_){return escapeHtml(src);}}
function lpSetMapNodeTitleContent(titleSpan,rawTitle,visual,renderedHtml){if(!titleSpan)return;const raw=String(rawTitle||"").trim();const html=String(renderedHtml||"").trim();try{titleSpan.setAttribute("data-lp-raw-title",raw);}catch(_){}
try{titleSpan.removeAttribute("data-lp-skip-typeset");}catch(_){}
try{titleSpan.classList.remove("mk-no-runtime-math");}catch(_){}
if(!(visual&&visual.hideTitle)&&lpHasMathMarkup(raw)){titleSpan.setAttribute("data-lp-skip-typeset","1");titleSpan.classList.add("mk-no-runtime-math");titleSpan.innerHTML=lpLiteMathTitleHtml(raw);lpScheduleLiteMathKatexRefresh();return;}
if(!(visual&&visual.hideTitle)&&html){const cleanHtml=__lpSanitizeRenderedMathHtml(html);if(cleanHtml){titleSpan.innerHTML=cleanHtml;return;}}
titleSpan.textContent=raw;}
function renderLocalMapModal(graph){const modal=document.getElementById("lp-map-modal");if(!modal)return;lpSyncLocalMapAnimationAccess(modal);lpEnsureMapRedesignPatchStyles();const stage=modal.querySelector(".lp-mapstage");if(!stage)return;modal.__lpRelatedDirty=false;const vp=stage.querySelector("[data-map-viewport]")||stage;vp.innerHTML="";const backHop=1;const fwdHop=1;const cur=currentRelPath();if(!cur)return;const depPickState=(window.__lpDependentPickCacheState=window.__lpDependentPickCacheState||{current:""});if(depPickState.current!==cur){window.__lpDependentPickCache=new Map();depPickState.current=cur;}
const relMode="all";modal.dataset.lpRelMode=relMode;const nb=getNeighbourhood(graph,cur,backHop,fwdHop,relMode);try{if(relMode!=="off"){const coreLocs=(nb&&nb.core)?nb.core:[];const coreSet2=new Set((coreLocs||[]).map(normLoc));const extraLocs=(nb&&nb.nodes)?(nb.nodes||[]).filter((x)=>x&&!coreSet2.has(normLoc(x))):[];const limCore=(relMode==="all")?22:14;const limExtra=(relMode==="all")?14:8;try{if(modal.__lpRelatedPrefetchTimer)window.clearTimeout(modal.__lpRelatedPrefetchTimer);}catch(_){}
modal.__lpRelatedPrefetchTimer=window.setTimeout(()=>{modal.__lpRelatedPrefetchTimer=0;if(!modal.classList.contains("lp-open"))return;__lpPrefetchRelatedForLocs(graph,coreLocs,null,limCore);__lpPrefetchRelatedForLocs(graph,extraLocs,null,limExtra);},900);}}catch(_){}
const nodes=nb.nodes||[];const edges=nb.edges||[];const level=nb.level||new Map();lpApplyLocalMapPerfMode(modal,nodes.length,edges.length);try{const drawnLocs=new Set();for(const loc of nodes){if(!loc)continue;drawnLocs.add(normLoc(loc));drawnLocs.add(lpCanonKey(loc));}
modal.__lpRenderedLocSet=drawnLocs;}catch(_){modal.__lpRenderedLocSet=null;}
const coreSet=new Set((nb&&nb.core)?nb.core:nodes);const degPre=new Map();const degRel=new Map();for(const e of edges){if(!e)continue;const t=e.type||"prereq";if(t==="related"){degRel.set(e.from,(degRel.get(e.from)||0)+1);degRel.set(e.to,(degRel.get(e.to)||0)+1);}else{degPre.set(e.from,(degPre.get(e.from)||0)+1);degPre.set(e.to,(degPre.get(e.to)||0)+1);}}
const rect=stage.getBoundingClientRect();const stageW=Math.max(320,Math.floor(rect.width));const stageH=Math.max(260,Math.floor(rect.height));const base=1.28;const byN=Math.sqrt(Math.max(1,nodes.length))/5.8;const maxHop=Math.max(backHop,fwdHop);const byHop=Math.max(0,maxHop-1)*0.18;const worldScale=Math.max(1.28,Math.min(3.0,base+byN+byHop));const layoutSpanRaw=Math.max(stageW,stageH);const layoutSpanBasis=Math.max(860,Math.min(980,Math.floor((stageW+stageH)/2)));const layoutSpan=Math.min(layoutSpanRaw,layoutSpanBasis);const W=Math.floor(layoutSpan*worldScale);const H=Math.floor(layoutSpan*worldScale);const cx=Math.floor(W/2);const cy=Math.floor(H/2);vp.style.inset="auto";vp.style.left="0";vp.style.top="0";vp.style.width=`${W}px`;vp.style.height=`${H}px`;const st=window.__lpMapState||(window.__lpMapState={scale:lpMapDefaultActualScale(),tx:0,ty:0});st.__lpStageW=stageW;st.__lpStageH=stageH;st.__lpWorldCX=cx;st.__lpWorldCY=cy;st.__lpCurrentX=cx;st.__lpCurrentY=cy;st.__lpWorldW=W;st.__lpWorldH=H;if(st.__lpForceCenter||!st.userMoved){lpLocalMapResetView(modal,st);if(modal.__lpApplyTransform)modal.__lpApplyTransform();}
const pos=new Map();const prefPos=new Map();pos.set(cur,{x:cx,y:cy});prefPos.set(cur,{x:cx,y:cy});const byLCore=new Map();const relOnlyNodes=[];for(const p of nodes){if(p===cur)continue;const isRelOnlyNode=(relMode!=="off")&&(!coreSet.has(p));if(isRelOnlyNode){relOnlyNodes.push(p);continue;}
const l=Number(level.get(p)||0);if(!byLCore.has(l))byLCore.set(l,[]);byLCore.get(l).push(p);}
const levels=Array.from(byLCore.keys());const maxAbs=Math.max(0,...levels.map((v)=>Math.abs(Number(v||0))));const ringFactor=0.22+0.16*Math.min(1,Math.sqrt(nodes.length)/6);const ring=Math.min(W,H)*ringFactor/Math.max(1,maxAbs||1);const LEFT_CENTER=Math.PI;const RIGHT_CENTER=0;const TOP_CENTER=-Math.PI/2;const BOTTOM_CENTER=Math.PI/2;const CORE_Y_SCALE=0.84;const BOTTOM_Y_SCALE=0.92;function clamp01(x){return Math.max(0,Math.min(1,Number(x)||0));}
function lerp(a,b,t){const u=clamp01(t);return a+(b-a)*u;}
function mixPoint(a,b,t){return{x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)};}
function nodeAdj(loc){const out=[];for(const e of edges){if(!e)continue;if(e.from===loc&&e.to)out.push(e.to);else if(e.to===loc&&e.from)out.push(e.from);}
return uniq(out);}
function titleTie(loc){return`${cleanTitle(nodeTitle(graph, loc) || "").toLowerCase()}|${normLoc(loc)}`;}
function sortByPlacedY(arr,tag){const placedScore=(loc)=>{const ys=[];const xs=[];for(const nbLoc of nodeAdj(loc)){const q=pos.get(nbLoc);if(!q)continue;xs.push(q.x);ys.push(q.y);}
if(!ys.length)return null;const avgY=ys.reduce((s,v)=>s+v,0)/ys.length;const avgX=xs.reduce((s,v)=>s+v,0)/xs.length;return{avgY,avgX};};return arr.slice().sort((a,b)=>{const sa=placedScore(a);const sb=placedScore(b);if(sa&&sb){if(Math.abs(sa.avgY-sb.avgY)>1e-6)return sa.avgY-sb.avgY;if(Math.abs(sa.avgX-sb.avgX)>1e-6)return sa.avgX-sb.avgX;}else if(sa&&!sb){return-1;}else if(!sa&&sb){return 1;}
const ta=titleTie(a);const tb=titleTie(b);if(ta!==tb)return ta.localeCompare(tb,undefined,{sensitivity:"base"});const ja=h01Stable(`${tag}|${a}`);const jb=h01Stable(`${tag}|${b}`);return ja-jb;});}
function placeArc(arr,centerAng,span,radius,opts){const cfg=opts||{};const n=arr.length;if(!n)return;const sorted=sortByPlacedY(arr,cfg.tag||`${centerAng}|${radius}`);const xScale=Number.isFinite(cfg.xScale)?cfg.xScale:1;const yScale=Number.isFinite(cfg.yScale)?cfg.yScale:1;const start=centerAng-span/2;const end=centerAng+span/2;for(let i=0;i<n;i++){const loc=sorted[i];const t=(n===1)?0.5:((i+0.5)/n);const jitterAmp=Math.min(0.08,span/Math.max(10,n*7));const jitter=(h01Stable(`${cfg.tag || 'arc'}|${loc}`)-0.5)*2*jitterAmp;const ang=lerp(start,end,t)+jitter;const pt={x:cx+Math.cos(ang)*radius*xScale,y:cy+Math.sin(ang)*radius*yScale,};pos.set(loc,pt);prefPos.set(loc,{x:pt.x,y:pt.y});}}
const orderedLevels=Array.from(byLCore.keys()).sort((a,b)=>{const aa=Math.abs(Number(a||0));const bb=Math.abs(Number(b||0));if(aa!==bb)return aa-bb;if(a===b)return 0;if(a<0&&b>0)return-1;if(a>0&&b<0)return 1;return a-b;});for(const l0 of orderedLevels){const l=Number(l0||0);const arr=byLCore.get(l0)||[];if(!arr.length)continue;const depth=Math.max(1,Math.abs(l));const radiusBase=depth*ring;let centerAng=TOP_CENTER;let span=Math.min(1.7,0.62+0.24*Math.max(0,arr.length-1));let radius=radiusBase;let yScale=CORE_Y_SCALE;let xScale=1;let tag=`core:${l}`;if(l<0){centerAng=LEFT_CENTER;span=Math.min(2.05,0.90+0.28*Math.max(0,arr.length-1));radius=radiusBase*0.96;tag=`pre:${depth}`;}else if(l>0){centerAng=-Math.PI/4;span=Math.min(1.72,0.96+0.22*Math.max(0,arr.length-1));radius=radiusBase*1.03;yScale=0.90;tag=`post:${depth}`;}else{centerAng=TOP_CENTER;span=Math.min(1.35,0.54+0.22*Math.max(0,arr.length-1));radius=Math.max(ring*0.9,radiusBase*0.9);yScale=0.78;tag=`same:${arr.length}`;}
placeArc(arr,centerAng,span,radius,{tag,xScale,yScale});}
if(relOnlyNodes.length){const relInfo=new Map();for(const p of relOnlyNodes){const ns=nodeAdj(p);let sx=0,sy=0,cnt=0;let left=0,right=0,same=0;for(const q of ns){const pt=pos.get(q);if(!pt)continue;sx+=pt.x;sy+=pt.y;cnt++;const lv=Number(level.get(q)||0);if(lv<0)left++;else if(lv>0)right++;else same++;}
relInfo.set(p,{cnt,avgX:cnt?(sx/cnt):cx,avgY:cnt?(sy/cnt):(cy+ring*0.55),left,right,same,});}
const relSorted=relOnlyNodes.slice().sort((a,b)=>{const ia=relInfo.get(a)||{avgX:cx,avgY:cy};const ib=relInfo.get(b)||{avgX:cx,avgY:cy};if(Math.abs(ia.avgX-ib.avgX)>1e-6)return ia.avgX-ib.avgX;if(Math.abs(ia.avgY-ib.avgY)>1e-6)return ia.avgY-ib.avgY;return titleTie(a).localeCompare(titleTie(b),undefined,{sensitivity:"base"});});const nRel=relSorted.length;const relSpan=Math.min(1.9,0.95+0.18*Math.max(0,nRel-1));const relRadius=Math.max(ring*1.02,Math.min(W,H)*0.30);for(let i=0;i<nRel;i++){const p=relSorted[i];const info=relInfo.get(p)||{cnt:0,avgX:cx,avgY:cy,left:0,right:0,same:0};const t=(nRel===1)?0.5:((i+0.5)/nRel);const slotAng=(BOTTOM_CENTER+relSpan/2)-relSpan*t;const slot={x:cx+Math.cos(slotAng)*relRadius,y:cy+Math.sin(slotAng)*relRadius*BOTTOM_Y_SCALE,};const sideBias=(info.right-info.left)*ring*0.12;const anchor={x:info.avgX+sideBias,y:Math.max(cy+ring*0.42,info.avgY+ring*(info.same?0.46:0.58)),};const blend=info.cnt?0.62:0.18;const pt=mixPoint(slot,anchor,blend);pos.set(p,pt);prefPos.set(p,{x:pt.x,y:pt.y});}}
(function(){const others=nodes.filter((p)=>p!==cur);if(!others.length)return;const minDim=Math.min(W,H);const baseOrbit=Math.max(212,minDim*0.245);const ringStep=Math.max(102,minDim*0.095);const maxOrbit=Math.max(baseOrbit+ringStep,minDim*0.435);const startAng=-Math.PI/2;const pres=[];const deps=[];const rels=[];const same=[];for(const p of others){const lv=Number(level.get(p)||0);if(lv<0)pres.push(p);else if(lv>0)deps.push(p);else if(relSet(cur).has(p))rels.push(p);else same.push(p);}
const sortStable=(arr,tag)=>arr.slice().sort((a,b)=>{const ta=titleTie(a);const tb=titleTie(b);if(ta!==tb)return ta.localeCompare(tb,undefined,{sensitivity:"base"});return h01Stable(`${tag}|${a}`)-h01Stable(`${tag}|${b}`);});const buckets=[{tag:'pre',arr:sortStable(pres,'centered-pre')},{tag:'dep',arr:sortStable(deps,'centered-dep')},{tag:'rel',arr:sortStable(rels,'centered-rel')},{tag:'same',arr:sortStable(same,'centered-same')},];const interleaved=[];let guard=0;while(guard<10000){let pushed=false;for(const b of buckets){if(!b.arr.length)continue;interleaved.push({loc:b.arr.shift(),tag:b.tag});pushed=true;}
if(!pushed)break;guard++;}
const n=interleaved.length;const ringCount=(n<=8)?1:(n<=18?2:(n<=32?3:4));const capacities=[];for(let r=0;r<ringCount;r++){capacities.push(Math.max(1,Math.round(n/ringCount+(r===0?-1:(r===ringCount-1?1:0)))));}
let capSum=capacities.reduce((s,v)=>s+v,0);while(capSum<n){capacities[capSum%ringCount]++;capSum++;}
while(capSum>n){const idx=capacities.findIndex((v)=>v>1);if(idx<0)break;capacities[idx]--;capSum--;}
let idx=0;for(let ringIdx=0;ringIdx<capacities.length;ringIdx++){const count=capacities[ringIdx];if(!count)continue;const ringNodes=interleaved.slice(idx,idx+count);idx+=count;const orbit=Math.min(maxOrbit,baseOrbit+ringIdx*ringStep);const ringPhase=(h01Stable(`centered-phase|${currentRelPath()}|${ringIdx}`)-0.5)*(Math.PI/Math.max(12,count*4));for(let i=0;i<ringNodes.length;i++){const item=ringNodes[i];const slotAng=startAng+ringPhase+((Math.PI*2)*i/ringNodes.length);const jitterAng=(h01Stable(`centered-ang|${currentRelPath()}|${item.loc}`)-0.5)*Math.min(0.18,(Math.PI*2)/Math.max(18,ringNodes.length*4));let radialBias=0;if(item.tag==='pre')radialBias=-10;else if(item.tag==='dep')radialBias=8;else if(item.tag==='rel')radialBias=18;const radialJitter=(h01Stable(`centered-rad|${currentRelPath()}|${item.loc}`)-0.5)*20;const ang=slotAng+jitterAng;const rr=Math.max(baseOrbit-18,orbit+radialBias+radialJitter);const pt={x:cx+Math.cos(ang)*rr,y:cy+Math.sin(ang)*rr,};pos.set(item.loc,pt);prefPos.set(item.loc,{x:pt.x,y:pt.y});}}})();const nodeEls=new Map();const dims=new Map();const nodeVisual=new Map();const createdNodes=[];for(const p of nodes){const xy=pos.get(p);if(!xy)continue;const a=document.createElement("a");a.className="lp-node";a.dataset.lpLoc=p;a.href=toAbsoluteUrl(p);a.setAttribute("data-mk-no-hover-preview","1");const rawVisual=lpMapVisualForLoc(p);const visual=(p===cur)?{...rawVisual,blurPx:0,hideTitle:false,fog:false}:rawVisual;nodeVisual.set(p,visual);const label=document.createElement("span");label.className="lp-node-label";lpBuildNodeLabel(label,p,visual);a.appendChild(label);a.dataset.lpTitle=__lpRepairTitleMathFromLoc(p,nodeTitle(graph,p));a.dataset.lpVisual=visual.key;if(visual.mastered)a.classList.add("lp-node-mastered");if(lpShouldMaskNode(visual))a.dataset.lpUnvisited="1";a.style.filter=visual.blurPx>0?`blur(${visual.blurPx}px)`:"none";const isRelOnly=(relMode!=="off")&&(!coreSet.has(p))&&(p!==cur);a.dataset.lpRelOnly=isRelOnly?"1":"0";if(relMode!=="off"&&!coreSet.has(p))a.dataset.lpFromRel="1";a.style.left=`${Math.round(xy.x)}px`;a.style.top=`${Math.round(xy.y)}px`;a.style.transform="translate(-50%, -50%)";if(p===cur)a.classList.add("is-cur");vp.appendChild(a);nodeEls.set(p,a);lpQueueNodeTitleTypeset(a);createdNodes.push(p);}
for(const p of createdNodes){const a=nodeEls.get(p);if(!a)continue;const hw=Math.max(34,a.offsetWidth/2);const hh=Math.max(14,a.offsetHeight/2);dims.set(p,{hw,hh});}
(function(){const adj=new Map();for(const n of nodes)adj.set(n,new Set());for(const e of edges){if(!e||!e.from||!e.to)continue;if(!adj.has(e.from))adj.set(e.from,new Set());if(!adj.has(e.to))adj.set(e.to,new Set());adj.get(e.from).add(e.to);adj.get(e.to).add(e.from);}
const REFINE_ITERS=72;const PREF_PULL=0.075;const EDGE_PULL=0.018;const SECTOR_PULL=0.05;const STEP_CAP=Math.max(3.5,ring*0.08);const CLAMP_PAD_LAYOUT=8;function shellHalfFor(p){const d=dims.get(p)||{hw:80,hh:18};return{hw:d.hw+12,hh:d.hh+12};}
function clampLayoutPoint(p,x,y){const d=shellHalfFor(p);return{x:Math.min(W-d.hw-CLAMP_PAD_LAYOUT,Math.max(d.hw+CLAMP_PAD_LAYOUT,x)),y:Math.min(H-d.hh-CLAMP_PAD_LAYOUT,Math.max(d.hh+CLAMP_PAD_LAYOUT,y)),};}
for(let it=0;it<REFINE_ITERS;it++){let moved=0;for(const p of nodes){if(p===cur)continue;const P=pos.get(p);if(!P)continue;const pref=prefPos.get(p)||P;let fx=(pref.x-P.x)*PREF_PULL;let fy=(pref.y-P.y)*PREF_PULL;const ns=Array.from(adj.get(p)||[]);let cnt=0;let avgX=0;let avgY=0;for(const q of ns){const Q=pos.get(q);if(!Q)continue;avgX+=Q.x;avgY+=Q.y;cnt++;}
if(cnt){avgX/=cnt;avgY/=cnt;fx+=(avgX-P.x)*EDGE_PULL;fy+=(avgY-P.y)*EDGE_PULL;}
const dxFromCenter=P.x-cx;const dyFromCenter=P.y-cy;const distFromCenter=Math.hypot(dxFromCenter,dyFromCenter)||1;const softMinOrbit=Math.max(ring*1.16,Math.min(W,H)*0.275);if(distFromCenter<softMinOrbit){const push=(softMinOrbit-distFromCenter)*SECTOR_PULL;fx+=(dxFromCenter/distFromCenter)*push;fy+=(dyFromCenter/distFromCenter)*push;}
const mag=Math.hypot(fx,fy);if(mag>STEP_CAP){fx*=STEP_CAP/mag;fy*=STEP_CAP/mag;}
if((Math.abs(fx)+Math.abs(fy))<0.04)continue;const C=clampLayoutPoint(p,P.x+fx,P.y+fy);P.x=C.x;P.y=C.y;moved++;}
if(moved===0)break;}})();const NODE_NEIGHBOUR_PAD=18;const SHELL_PAD=NODE_NEIGHBOUR_PAD;const MIN_GAP=Math.max(102,Math.min(138,380/Math.sqrt(nodes.length+1)));const DIRECT_EDGE_GAP=Math.max(148,Math.min(188,MIN_GAP+42));const ITER=180;const CLAMP_PAD=10;const connectedPairSet=new Set();for(const e of edges){if(!e||!e.from||!e.to)continue;connectedPairSet.add(lpPairKey(e.from,e.to));}
const CUR_MIN_GAP=MIN_GAP+18;const CUR_DIRECT_GAP=DIRECT_EDGE_GAP+20;function shellDimsFor(p){const d0=dims.get(p)||{hw:80,hh:18};const hw=d0.hw+SHELL_PAD;const hh=d0.hh+SHELL_PAD;return{hw,hh,hx:Math.max(0,hw-hh),r:hh};}
function capsuleExtent(sd,uxAbs){return sd.r+sd.hx*Math.abs(uxAbs);}
function clampPoint(p,x,y){const d=shellDimsFor(p);const minX=d.hw+CLAMP_PAD;const maxX=W-d.hw-CLAMP_PAD;const minY=d.hh+CLAMP_PAD;const maxY=H-d.hh-CLAMP_PAD;return{x:Math.min(maxX,Math.max(minX,x)),y:Math.min(maxY,Math.max(minY,y)),};}
function sepDir(a,b){const seed=`${a}|${b}`;let h=2166136261;for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619);}
const ang=((h>>>0)/4294967295)*Math.PI*2;return{x:Math.cos(ang),y:Math.sin(ang)};}
const movable=nodes.slice();for(let it=0;it<ITER;it++){let moved=0;for(let i=0;i<movable.length;i++){const a=movable[i];const A=pos.get(a);if(!A)continue;const sa=shellDimsFor(a);for(let j=i+1;j<movable.length;j++){const b=movable[j];const B=pos.get(b);if(!B)continue;const sb=shellDimsFor(b);let dx=B.x-A.x;let dy=B.y-A.y;let dist=Math.hypot(dx,dy);if(dist<1e-6){const dir=sepDir(a,b);dx=dir.x;dy=dir.y;dist=1;}
const ux=dx/dist;const uy=dy/dist;let pairGap=connectedPairSet.has(lpPairKey(a,b))?DIRECT_EDGE_GAP:MIN_GAP;if(a===cur||b===cur){pairGap=Math.max(pairGap,connectedPairSet.has(lpPairKey(a,b))?CUR_DIRECT_GAP:CUR_MIN_GAP);}
const need=capsuleExtent(sa,ux)+capsuleExtent(sb,ux)+pairGap;if(dist<need){const push=(need-dist)+0.5;if(a===cur){B.x+=ux*push;B.y+=uy*push;}else if(b===cur){A.x-=ux*push;A.y-=uy*push;}else{A.x-=ux*push*0.5;A.y-=uy*push*0.5;B.x+=ux*push*0.5;B.y+=uy*push*0.5;}
moved++;}}
const C=clampPoint(a,A.x,A.y);A.x=C.x;A.y=C.y;}
if(moved===0)break;}
(function(){const adj=new Map();for(const n of nodes)adj.set(n,new Set());for(const e of edges){if(!e)continue;const a=e.from,b=e.to;if(!a||!b)continue;if(!adj.has(a))adj.set(a,new Set());if(!adj.has(b))adj.set(b,new Set());adj.get(a).add(b);adj.get(b).add(a);}
function h01(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
return(h>>>0)/4294967295;}
const JIT=Math.max(10,Math.min(28,MIN_GAP*1.1));const COS_TH=-0.985;const MAX_NEI=6;let did=0;for(let pass=0;pass<2;pass++){let nudged=0;for(const mid of nodes){if(mid===cur)continue;const ns=Array.from(adj.get(mid)||[]);if(ns.length<2)continue;ns.sort();const nb=ns.slice(0,MAX_NEI);const M=pos.get(mid);if(!M)continue;outer:for(let i=0;i<nb.length;i++){const a=nb[i];const A=pos.get(a);if(!A)continue;const v1x=A.x-M.x,v1y=A.y-M.y;const n1=Math.hypot(v1x,v1y);if(n1<1e-6)continue;for(let j=i+1;j<nb.length;j++){const c=nb[j];const C=pos.get(c);if(!C)continue;const v2x=C.x-M.x,v2y=C.y-M.y;const n2=Math.hypot(v2x,v2y);if(n2<1e-6)continue;const cos=(v1x*v2x+v1y*v2y)/(n1*n2);if(cos<COS_TH){const px=-v1y/n1;const py=v1x/n1;const sgn=(h01(`${a}|${mid}|${c}`)<0.5)?-1:1;const nx=M.x+px*JIT*sgn;const ny=M.y+py*JIT*sgn;const Cl=clampPoint(mid,nx,ny);M.x=Cl.x;M.y=Cl.y;nudged++;break outer;}}}}
if(nudged===0)break;did+=nudged;const ITER2=32;for(let it2=0;it2<ITER2;it2++){let moved2=0;for(let i=0;i<movable.length;i++){const a=movable[i];const A=pos.get(a);if(!A)continue;const da=dims.get(a)||{hw:80,hh:18};for(let j=i+1;j<movable.length;j++){const b=movable[j];const B=pos.get(b);if(!B)continue;const db=dims.get(b)||{hw:80,hh:18};let dx=B.x-A.x;let dy=B.y-A.y;let dist=Math.hypot(dx,dy);if(dist<1e-6){const dir=sepDir(a,b);dx=dir.x;dy=dir.y;dist=1;}
const ux=dx/dist;const uy=dy/dist;const sa=shellDimsFor(a);const sb=shellDimsFor(b);let pairGap=connectedPairSet.has(lpPairKey(a,b))?DIRECT_EDGE_GAP:MIN_GAP;if(a===cur||b===cur){pairGap=Math.max(pairGap,connectedPairSet.has(lpPairKey(a,b))?CUR_DIRECT_GAP:CUR_MIN_GAP);}
const need=capsuleExtent(sa,ux)+capsuleExtent(sb,ux)+pairGap;if(dist<need){const push=(need-dist)+0.5;if(a===cur){B.x+=ux*push;B.y+=uy*push;}else if(b===cur){A.x-=ux*push;A.y-=uy*push;}else{A.x-=ux*push*0.5;A.y-=uy*push*0.5;B.x+=ux*push*0.5;B.y+=uy*push*0.5;}
moved2++;}}
const C=clampPoint(a,A.x,A.y);A.x=C.x;A.y=C.y;}
if(moved2===0)break;}}})();for(const p of nodes){const el=nodeEls.get(p);const xy=pos.get(p);if(!el||!xy)continue;el.style.left=`${Math.round(xy.x)}px`;el.style.top=`${Math.round(xy.y)}px`;lp3dDecorateLocalNodeElement(el,p,cur,level,coreSet);}
lp3dDecorateLocalMap(modal,graph,{cur,level,coreSet,baseNodes:nodes.slice()});const fogNodes=nodes.filter((n)=>{const meta=nodeVisual.get(n);return!!(meta&&meta.fog);});if(fogNodes.length){const fog=document.createElement("div");fog.className="lp-fog-layer";fog.style.width=`${W}px`;fog.style.height=`${H}px`;fog.style.left="0";fog.style.top="0";const layers=[];for(const n of fogNodes){const xy=pos.get(n);const d=dims.get(n)||{hw:80,hh:18};if(!xy)continue;const rx=Math.round(Math.max(118,d.hw*2.25+58));const ry=Math.round(Math.max(92,d.hh*4.0+58));layers.push(`radial-gradient(${rx}px ${ry}px at ${Math.round(xy.x)}px ${Math.round(xy.y)}px, rgba(255,255,255,.18) 0%, rgba(255,255,255,.12) 30%, rgba(255,255,255,.05) 58%, rgba(255,255,255,0) 78%)`);}
fog.style.backgroundImage=layers.join(", ");const firstSvg=vp.querySelector("svg.lp-map-svg");if(firstSvg&&firstSvg.nextSibling)vp.insertBefore(fog,firstSvg.nextSibling);else if(firstSvg)vp.appendChild(fog);else vp.insertBefore(fog,vp.firstChild||null);}
const prereqCache=new Map();const depCache=new Map();function prereqSet(x){if(!prereqCache.has(x))prereqCache.set(x,new Set(getPrereqs(graph,x)||[]));return prereqCache.get(x);}
function depSet(x){if(!depCache.has(x))depCache.set(x,new Set(getDependents(graph,x)||[]));return depCache.get(x);}
const relCache=new Map();function relSet(x){if(!relCache.has(x)){const s=new Set(getRelated(graph,x)||[]);for(const p of(getPrereqs(graph,x)||[]))s.delete(p);for(const d of(getDependents(graph,x)||[]))s.delete(d);s.delete(x);relCache.set(x,s);}
return relCache.get(x);}
function orientEdge(e){let a=e.from,b=e.to;if(e.type==="prereq"){if(prereqSet(a).has(b))return{from:b,to:a,arrow:true,type:"prereq"};if(prereqSet(b).has(a))return{from:a,to:b,arrow:true,type:"prereq"};return{from:b,to:a,arrow:true,type:"prereq"};}
if(e.type==="related"){const from=a<b?a:b;const to=a<b?b:a;return{from,to,arrow:false,type:"related"};}
return{from:a,to:b,arrow:false,type:(e.type||"prereq")};}
const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("viewBox",`0 0 ${W} ${H}`);svg.setAttribute("width",String(W));svg.setAttribute("height",String(H));svg.classList.add("lp-map-svg");const EDGE_DEFAULT="rgb(255,255,255)";const EDGE_DEFAULT_ALPHA=0.92;const PRE_COLOR="rgb(16, 185, 129)";const POST_COLOR="rgb(96, 165, 250)";const REL_COLOR="rgb(167, 139, 250)";const defs=document.createElementNS("http://www.w3.org/2000/svg","defs");svg.appendChild(defs);const lpMaskId=__lpSvgUid("lpNodeMask");svg.__lpMaskId=lpMaskId;const mask=document.createElementNS("http://www.w3.org/2000/svg","mask");mask.setAttribute("id",lpMaskId);mask.setAttribute("maskUnits","userSpaceOnUse");mask.setAttribute("x","0");mask.setAttribute("y","0");mask.setAttribute("width",String(W));mask.setAttribute("height",String(H));const mAll=document.createElementNS("http://www.w3.org/2000/svg","rect");mAll.setAttribute("x","0");mAll.setAttribute("y","0");mAll.setAttribute("width",String(W));mAll.setAttribute("height",String(H));mAll.setAttribute("fill","white");mask.appendChild(mAll);const MASK_PAD=NODE_NEIGHBOUR_PAD;for(const n of nodes){const xy=pos.get(n);if(!xy)continue;const d=dims.get(n)||{hw:80,hh:18};const r=document.createElementNS("http://www.w3.org/2000/svg","rect");r.setAttribute("x",String(xy.x-d.hw-MASK_PAD));r.setAttribute("y",String(xy.y-d.hh-MASK_PAD));r.setAttribute("width",String((d.hw+MASK_PAD)*2));r.setAttribute("height",String((d.hh+MASK_PAD)*2));r.setAttribute("rx",String(Math.min(999,d.hh+MASK_PAD)));r.setAttribute("ry",String(Math.min(999,d.hh+MASK_PAD)));r.setAttribute("fill","black");mask.appendChild(r);}
defs.appendChild(mask);function __lpParseRgbAlpha(c){const s=String(c||"").trim();let m=s.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i);if(m){const r=Math.max(0,Math.min(255,Number(m[1])));const g=Math.max(0,Math.min(255,Number(m[2])));const b=Math.max(0,Math.min(255,Number(m[3])));const a=Math.max(0,Math.min(1,Number(m[4])));return{rgb:`rgb(${r}, ${g}, ${b})`,alpha:a};}
m=s.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i);if(m){const r=Math.max(0,Math.min(255,Number(m[1])));const g=Math.max(0,Math.min(255,Number(m[2])));const b=Math.max(0,Math.min(255,Number(m[3])));return{rgb:`rgb(${r}, ${g}, ${b})`,alpha:1};}
return{rgb:s||"white",alpha:1};}
function makeEdgeArrowMarker(id,fill){const marker=document.createElementNS("http://www.w3.org/2000/svg","marker");marker.setAttribute("id",id);marker.setAttribute("markerWidth","9");marker.setAttribute("markerHeight","9");marker.setAttribute("refX","9");marker.setAttribute("refY","3");marker.setAttribute("orient","auto");marker.setAttribute("markerUnits","strokeWidth");const mpath=document.createElementNS("http://www.w3.org/2000/svg","path");mpath.setAttribute("d","M0,0 L9,3 L0,6 Z");const parsed=__lpParseRgbAlpha(fill);mpath.setAttribute("fill",parsed.rgb);mpath.setAttribute("fill-opacity","1");mpath.setAttribute("stroke",parsed.rgb);mpath.setAttribute("stroke-opacity","1");mpath.setAttribute("stroke-width","0.6");mpath.setAttribute("stroke-linejoin","round");marker.appendChild(mpath);defs.appendChild(marker);return mpath;}
function setEdgeArrowPaint(edgeEl,stroke,opacity){const mp=edgeEl&&edgeEl.__lpMarkerPath;if(!mp)return;const parsed=__lpParseRgbAlpha(stroke);try{mp.setAttribute("fill",parsed.rgb);mp.setAttribute("fill-opacity","1");mp.setAttribute("stroke",parsed.rgb);mp.setAttribute("stroke-opacity","1");}catch(_){}}
function setEdgeArrowFill(edgeEl,fill){try{const op=edgeEl&&edgeEl.style&&edgeEl.style.opacity?Number(edgeEl.style.opacity):1;setEdgeArrowPaint(edgeEl,fill,Number.isFinite(op)?op:1);}catch(_){setEdgeArrowPaint(edgeEl,fill,1);}}
function clipToEdge(ax,ay,bx,by,hw,hh){const dx=bx-ax;const dy=by-ay;const len=Math.max(1e-6,Math.hypot(dx,dy));const ux=dx/len;const uy=dy/len;const r=Math.max(0,hh);const hx=Math.max(0,hw-hh);const axu=Math.abs(ux);const ayu=Math.abs(uy);let reach=r;if(hx<=1e-6){reach=r;}else if(ayu>1e-6){const tTop=r/ayu;const xAtTop=tTop*axu;if(xAtTop<=hx+1e-6){reach=tTop;}else{const disc=Math.max(0,(r*r)-((hx*ayu)*(hx*ayu)));reach=(hx*axu)+Math.sqrt(disc);}}else{reach=hx+r;}
const MASK_OVERLAP=1.2;const t=Math.max(0,reach-MASK_OVERLAP);return{x:ax+ux*t,y:ay+uy*t};}
const __lpTouchFastMap=(()=>{try{return!!(__lpIsMobileMapModal()||lpMapDocSurfaceIsTouch()||(window.matchMedia&&(window.matchMedia("(pointer: coarse)").matches||window.matchMedia("(hover: none)").matches)));}catch(_){return false;}})();const PAD=0;const MIN_SEG=0;const edgeEls=[];const incident=new Map();function addIncident(loc,el){if(!incident.has(loc))incident.set(loc,[]);incident.get(loc).push(el);}
function curvedPath(p1,p2,bend){const dx=p2.x-p1.x;const dy=p2.y-p1.y;const len=Math.max(1e-6,Math.hypot(dx,dy));const nx=-dy/len;const ny=dx/len;const c1x0=p1.x+dx*0.33;const c1y0=p1.y+dy*0.33;const c2x0=p1.x+dx*0.66;const c2y0=p1.y+dy*0.66;const c1x=c1x0+nx*bend;const c1y=c1y0+ny*bend;const c2x=c2x0+nx*(bend*0.18);const c2y=c2y0+ny*(bend*0.18);return`M ${p1.x} ${p1.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;}
function hash01(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
return(h>>>0)/4294967295;}
function __lpSvgUid(prefix){const seed=`${prefix}|${Date.now()}|${Math.random()}|${currentRelPath()}|${nodes.length}|${edges.length}`;let h=2166136261;for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619);}
return`${prefix}-${(h >>> 0).toString(36)}`;}
for(const e of edges){const o=orientEdge(e);const A=pos.get(o.from);const B=pos.get(o.to);if(!A||!B)continue;const da=dims.get(o.from)||{hw:80,hh:18};const db=dims.get(o.to)||{hw:80,hh:18};const P1=clipToEdge(A.x,A.y,B.x,B.y,da.hw+NODE_NEIGHBOUR_PAD,da.hh+NODE_NEIGHBOUR_PAD,PAD);const P2=clipToEdge(B.x,B.y,A.x,A.y,db.hw+NODE_NEIGHBOUR_PAD,db.hh+NODE_NEIGHBOUR_PAD,PAD);const segLen=Math.hypot(P2.x-P1.x,P2.y-P1.y);const t=hash01(`${o.from}→${o.to}`);const baseB=(t<0.5?-1:1)*(8+16*Math.abs(t-0.5)*2);const damp=Math.max(0.35,Math.min(1,segLen/220));const bend=baseB*damp;const path=document.createElementNS("http://www.w3.org/2000/svg","path");path.classList.add("lp-edge");path.setAttribute("d",curvedPath(P1,P2,bend));path.setAttribute("fill","none");if(!__lpTouchFastMap)path.setAttribute("mask",`url(#${lpMaskId})`);path.dataset.from=o.from;path.dataset.to=o.to;path.dataset.type=o.type||e.type||"prereq";if(path.dataset.type==="related"){path.classList.add("lp-rel-edge");path.setAttribute("stroke",EDGE_DEFAULT);path.setAttribute("stroke-width","1.7");const relOp=relMode==="all"?0.42:0.24;path.setAttribute("opacity",String(relOp*EDGE_DEFAULT_ALPHA));path.setAttribute("stroke-dasharray","6 6");path.setAttribute("stroke-dashoffset","0");}else{path.setAttribute("stroke",EDGE_DEFAULT);path.setAttribute("stroke-width","1.8");path.setAttribute("opacity",String(0.78*EDGE_DEFAULT_ALPHA));const markerId=__lpSvgUid(`lpArrowE${edgeEls.length}`);path.dataset.lpMarkerId=markerId;path.__lpMarkerPath=makeEdgeArrowMarker(markerId,EDGE_DEFAULT);path.setAttribute("marker-end",`url(#${markerId})`);}
svg.appendChild(path);edgeEls.push(path);addIncident(o.from,path);addIncident(o.to,path);}
vp.insertBefore(svg,vp.firstChild);const hiSvg=document.createElementNS("http://www.w3.org/2000/svg","svg");hiSvg.setAttribute("viewBox",`0 0 ${W} ${H}`);hiSvg.setAttribute("width",String(W));hiSvg.setAttribute("height",String(H));hiSvg.classList.add("lp-map-svg-hi");hiSvg.style.pointerEvents="none";const hiDefs=document.createElementNS("http://www.w3.org/2000/svg","defs");hiSvg.appendChild(hiDefs);const hiMaskId=__lpSvgUid("lpNodeMaskHi");hiSvg.__lpMaskId=hiMaskId;const __lpDesktopSingleLayerHi=lpIsDesktopLocalMapHover()||__lpTouchFastMap;if(__lpDesktopSingleLayerHi){try{hiSvg.dataset.lpSingleLayer="1";}catch(_){}
try{hiSvg.__lpDisableMask="1";}catch(_){}}
const hiMask=document.createElementNS("http://www.w3.org/2000/svg","mask");hiMask.setAttribute("id",hiMaskId);hiMask.setAttribute("maskUnits","userSpaceOnUse");hiMask.setAttribute("x","0");hiMask.setAttribute("y","0");hiMask.setAttribute("width",String(W));hiMask.setAttribute("height",String(H));const hiAll=document.createElementNS("http://www.w3.org/2000/svg","rect");hiAll.setAttribute("x","0");hiAll.setAttribute("y","0");hiAll.setAttribute("width",String(W));hiAll.setAttribute("height",String(H));hiAll.setAttribute("fill","white");hiMask.appendChild(hiAll);const hiCuts=document.createElementNS("http://www.w3.org/2000/svg","g");hiCuts.setAttribute("data-hi-cuts","1");hiMask.appendChild(hiCuts);hiDefs.appendChild(hiMask);const HI_PRE_MARKER_ID=__lpSvgUid("lpHiArrowPre");const HI_POST_MARKER_ID=__lpSvgUid("lpHiArrowPost");const HI_DEF_MARKER_ID=__lpSvgUid("lpHiArrowDef");(function initHiMarkers(){const mk=(id,color)=>{const marker=document.createElementNS("http://www.w3.org/2000/svg","marker");marker.setAttribute("id",id);marker.setAttribute("markerWidth","9");marker.setAttribute("markerHeight","9");marker.setAttribute("refX","9");marker.setAttribute("refY","3");marker.setAttribute("orient","auto");marker.setAttribute("markerUnits","strokeWidth");const mpath=document.createElementNS("http://www.w3.org/2000/svg","path");mpath.setAttribute("d","M0,0 L9,3 L0,6 Z");const parsed=__lpParseRgbAlpha(color);mpath.setAttribute("fill",parsed.rgb);mpath.setAttribute("fill-opacity","1");mpath.setAttribute("stroke",parsed.rgb);mpath.setAttribute("stroke-opacity","1");mpath.setAttribute("stroke-width","0.6");mpath.setAttribute("stroke-linejoin","round");marker.appendChild(mpath);hiDefs.appendChild(marker);};mk(HI_PRE_MARKER_ID,PRE_COLOR);mk(HI_POST_MARKER_ID,POST_COLOR);mk(HI_DEF_MARKER_ID,EDGE_DEFAULT);})();const hiBaseG=document.createElementNS("http://www.w3.org/2000/svg","g");hiBaseG.setAttribute("data-hi-static-edges","1");hiBaseG.setAttribute("mask",`url(#${hiMaskId})`);hiSvg.appendChild(hiBaseG);const hiG=document.createElementNS("http://www.w3.org/2000/svg","g");hiG.setAttribute("data-hi-edges","1");hiSvg.appendChild(hiG);vp.appendChild(hiSvg);function __lpEdgeIsBaselineVisible(baseEl){if(!baseEl)return false;const typ=baseEl.dataset.type||"prereq";if(typ==="related")return relMode==="all";const from=baseEl.dataset.from;const to=baseEl.dataset.to;const isCoreEdge=!!(from&&to&&coreSet&&coreSet.has(from)&&coreSet.has(to));return!(relMode==="dim"&&!isCoreEdge);}
function __lpSyncStaticHiEdges(){try{hiBaseG.innerHTML="";}catch(_){}
if(__lpDesktopSingleLayerHi)return;for(const baseEl of edgeEls){if(!__lpEdgeIsBaselineVisible(baseEl))continue;const typ=baseEl.dataset.type||"prereq";const dAttr=baseEl.getAttribute("d")||"";if(!dAttr)continue;const p=document.createElementNS("http://www.w3.org/2000/svg","path");p.classList.add("lp-edge","lp-static-hi-edge");p.setAttribute("d",dAttr);p.setAttribute("fill","none");p.style.stroke=EDGE_DEFAULT;p.style.filter="";p.dataset.from=baseEl.dataset.from||"";p.dataset.to=baseEl.dataset.to||"";p.dataset.type=typ;if(typ==="related"){p.classList.add("lp-rel-edge");p.style.strokeWidth="1.7";p.style.opacity="0.42";p.style.strokeDasharray="6 6";p.style.strokeDashoffset="0";}else{p.style.strokeWidth="1.8";p.style.opacity="0.78";p.setAttribute("marker-end",`url(#${HI_DEF_MARKER_ID})`);}
hiBaseG.appendChild(p);}}
function __lpHiClear(){try{hiG.innerHTML="";}catch(_){}
try{hiCuts.innerHTML="";}catch(_){}}
function __lpTopNodeCoverSet(explicitKeepSet){if(explicitKeepSet&&explicitKeepSet.size)return new Set(Array.from(explicitKeepSet));const topSet=new Set();for(const n of(nodes||[])){const el=nodeEls.get(n);const isBaselineDim=!!(el&&el.dataset&&el.dataset.lpRelOnly==="1"&&relMode==="dim");if(!isBaselineDim)topSet.add(n);}
return topSet;}
function __lpHiUpdateMask(keepSet){try{hiCuts.innerHTML="";}catch(_){}
if(__lpDesktopSingleLayerHi)return;const MASK_PAD_HI=NODE_NEIGHBOUR_PAD;const cutNodes=Array.from(__lpTopNodeCoverSet(keepSet));for(const n of cutNodes){const xy=pos.get(n);if(!xy)continue;const d=dims.get(n)||{hw:80,hh:18};const r=document.createElementNS("http://www.w3.org/2000/svg","rect");r.setAttribute("x",String(xy.x-d.hw-MASK_PAD_HI));r.setAttribute("y",String(xy.y-d.hh-MASK_PAD_HI));r.setAttribute("width",String((d.hw+MASK_PAD_HI)*2));r.setAttribute("height",String((d.hh+MASK_PAD_HI)*2));r.setAttribute("rx",String(Math.min(999,d.hh+MASK_PAD_HI)));r.setAttribute("ry",String(Math.min(999,d.hh+MASK_PAD_HI)));r.setAttribute("fill","black");hiCuts.appendChild(r);}}
function __lpHiRenderFromBaseEdges(incEdges,loc,keepSet){__lpHiClear();__lpHiUpdateMask(keepSet);const list=Array.from(incEdges||[]);for(const baseEl of list){if(!baseEl)continue;const typ=baseEl.dataset.type||"prereq";const dAttr=baseEl.getAttribute("d")||"";if(!dAttr)continue;const p2=document.createElementNS("http://www.w3.org/2000/svg","path");p2.classList.add("lp-edge","lp-hi-edge");p2.setAttribute("d",dAttr);p2.setAttribute("fill","none");if(!__lpDesktopSingleLayerHi)p2.setAttribute("mask",`url(#${hiMaskId})`);p2.style.strokeWidth="2.3";p2.style.opacity="1";p2.style.filter="";const gWrap=document.createElementNS("http://www.w3.org/2000/svg","g");gWrap.classList.add("lp-hi-edgewrap");gWrap.style.opacity="0.92";if(typ==="related"){p2.classList.add("lp-rel-edge");if(!__lpReduceMotion())p2.classList.add("lp-rel-anim");try{p2.removeAttribute("marker-end");}catch(_){}
p2.style.stroke=REL_COLOR;if(!__lpReduceMotion())__lpStartRelDash(p2);}else{let col=EDGE_DEFAULT;let mid=HI_DEF_MARKER_ID;if(baseEl.dataset.to===loc){col=PRE_COLOR;mid=HI_PRE_MARKER_ID;}
else if(baseEl.dataset.from===loc){col=POST_COLOR;mid=HI_POST_MARKER_ID;}
p2.style.stroke=col;p2.setAttribute("marker-end",`url(#${mid})`);}
gWrap.appendChild(p2);hiG.appendChild(gWrap);if(typ!=="related")__lpStartFlow(p2,gWrap);}}
const st2=window.__lpMapState||(window.__lpMapState={scale:lpMapDefaultActualScale(),tx:0,ty:0});const renderId=(st2.__lpRenderId=(st2.__lpRenderId||0)+1);function __lpReduceMotion(){return lpMotionReduced()||!lpLocalMapAnimationsEnabled(modal);}
const __lpFlow=new Map();let __lpFlowRaf=0;const __lpRelDash=new Map();let __lpRelDashRaf=0;const __LP_FLOW_MS=1000;const __LP_FLOW_SAMPLES=240;const __LP_FLOW_SCALE=0.95;const __LP_FLOW_TAIL_TO_TIP=14*__LP_FLOW_SCALE;const __LP_FLOW_START_PHASE=0.12;const __LP_FLOW_FADE_FRAC=0.10;const __LP_FLOW_FADE_MIN_PX=12;const __LP_FLOW_FADE_MAX_PX=28;function __lpStopAllFlows(){for(const[,st]of __lpFlow){try{st.arrow&&st.arrow.remove();}catch(_){}}
__lpFlow.clear();for(const[p]of __lpRelDash){try{if(p&&p.style){p.style.strokeDashoffset='0';p.style.removeProperty('will-change');}}catch(_){}}
__lpRelDash.clear();if(__lpFlowRaf){cancelAnimationFrame(__lpFlowRaf);__lpFlowRaf=0;}
if(__lpRelDashRaf){cancelAnimationFrame(__lpRelDashRaf);__lpRelDashRaf=0;}}
function __lpStartRelDash(path){if(__lpReduceMotion())return;if(!path||__lpRelDash.has(path))return;try{path.classList.add('lp-rel-anim');path.style.strokeDasharray='6 6';path.style.willChange='stroke-dashoffset';}catch(_){}
__lpRelDash.set(path,{t0:performance.now()});if(__lpRelDashRaf)return;const step=(now)=>{if(st2.__lpRenderId!==renderId){__lpStopAllFlows();return;}
if(__lpRelDash.size===0){__lpRelDashRaf=0;return;}
for(const[p,st]of Array.from(__lpRelDash.entries())){if(!p||!p.isConnected){__lpRelDash.delete(p);continue;}
try{const phase=(((now-(Number(st&&st.t0)||now))/1200)%1+1)%1;p.style.strokeDashoffset=String(-24*phase);}catch(_){}}
__lpRelDashRaf=requestAnimationFrame(step);};__lpRelDashRaf=requestAnimationFrame(step);}
function __lpFlowSample(st,dist){const u=(dist/st.total)*st.n;let i=Math.floor(u);if(i<0)i=0;if(i>=st.n)i=st.n-1;const f=u-i;const p0=st.pts[i];let j=i+1;let p1=st.pts[j]||st.pts[st.n];while(j<st.n&&Math.abs(p1.x-p0.x)+Math.abs(p1.y-p0.y)<0.001){j++;p1=st.pts[j]||st.pts[st.n];}
const x=p0.x+(p1.x-p0.x)*f;const y=p0.y+(p1.y-p0.y)*f;const ang=Math.atan2(p1.y-p0.y,p1.x-p0.x)*180/Math.PI;return{x,y,ang};}
function __lpFlowAlpha(st,dist){const fade=Math.max(0,Math.min(st.fadeDist||0,st.travel*0.49));if(!(fade>0))return 1;if(dist<fade)return Math.max(0,Math.min(1,dist/fade));const tail=st.travel-dist;if(tail<fade)return Math.max(0,Math.min(1,tail/fade));return 1;}
function __lpPaintFlow(st,dist){const pose=__lpFlowSample(st,dist);const alpha=__lpFlowAlpha(st,dist);st.arrow.setAttribute("transform",`translate(${pose.x} ${pose.y}) rotate(${pose.ang}) scale(${__LP_FLOW_SCALE}) translate(0 -5.2)`);st.arrow.setAttribute("opacity",String(alpha));}
function __lpStartFlow(path,container){if(__lpReduceMotion())return;if(!path||__lpFlow.has(path))return;const svgRoot=path.ownerSVGElement;if(!svgRoot)return;const arrow=document.createElementNS("http://www.w3.org/2000/svg","path");arrow.setAttribute("d","M0 0 L12 5.2 L0 10.4 Z");arrow.classList.add("lp-flow-arrow");arrow.style.pointerEvents="none";arrow.style.willChange="transform, opacity";try{const mid=svgRoot.__lpMaskId;const disableMask=!!(svgRoot&&svgRoot.__lpDisableMask==="1");if(mid&&!disableMask)arrow.setAttribute("mask",`url(#${mid})`);}catch(_){}
(container&&container.ownerSVGElement===svgRoot?container:svgRoot).appendChild(arrow);const total=Math.max(1,path.getTotalLength());const isMobileMap=(()=>{try{return __lpIsMobileMapModal();}catch(_){return false;}})();const isMobileSmoothPreview=(()=>{try{return!!(modal&&modal.classList&&modal.classList.contains('lp-mobile-focus-preview'));}catch(_){return false;}})();const isDesktopSmoothPreview=(()=>{try{return!!(modal&&modal.classList&&modal.classList.contains('lp-desktop-focus-preview'));}catch(_){return false;}})();const useSmoothFlow=isMobileMap||isMobileSmoothPreview||isDesktopSmoothPreview;const sampleCap=isDesktopSmoothPreview?Math.max(160,Math.floor(__LP_FLOW_SAMPLES*0.8)):(useSmoothFlow?Math.max(96,Math.floor(__LP_FLOW_SAMPLES*0.5)):__LP_FLOW_SAMPLES);const n=Math.max(isDesktopSmoothPreview?48:(useSmoothFlow?32:48),Math.min(sampleCap,Math.ceil(total/(isDesktopSmoothPreview?2:(useSmoothFlow?3:2)))));const pts=new Array(n+1);for(let i=0;i<=n;i++){const L=(total*i)/n;const p=path.getPointAtLength(L);pts[i]={x:p.x,y:p.y};}
let __lpFill="white";try{const cs0=getComputedStyle(path);const colRaw0=(cs0.stroke||path.getAttribute("stroke")||path.style.stroke||"white");const parsed0=__lpParseRgbAlpha(colRaw0);__lpFill=parsed0.rgb;}catch(_){}
try{arrow.setAttribute("fill",__lpFill);arrow.setAttribute("fill-opacity","1");}catch(_){}
const travel=Math.max(0.5,total-__LP_FLOW_TAIL_TO_TIP);const fadeDist=Math.min(__LP_FLOW_FADE_MAX_PX,Math.max(__LP_FLOW_FADE_MIN_PX,travel*__LP_FLOW_FADE_FRAC));const st={arrow,total,travel,fadeDist,pts,n,fill:__lpFill,fillOpacity:1,t0:performance.now()-(__LP_FLOW_MS*__LP_FLOW_START_PHASE)};__lpFlow.set(path,st);try{const now0=performance.now();const phase0=((((now0-st.t0)/__LP_FLOW_MS)%1)+1)%1;__lpPaintFlow(st,phase0*st.travel);}catch(_){}
if(__lpFlowRaf)return;const flowMinFrameMs=isDesktopSmoothPreview?0:(useSmoothFlow?(1000/30):0);let lastFlowPaint=0;const step=(now)=>{if(st2.__lpRenderId!==renderId){__lpStopAllFlows();return;}
if(__lpFlow.size===0){__lpFlowRaf=0;return;}
if(!flowMinFrameMs||!lastFlowPaint||(now-lastFlowPaint)>=flowMinFrameMs){lastFlowPaint=now;for(const[p,st]of __lpFlow){if(!p.isConnected){try{st.arrow&&st.arrow.remove();}catch(_){}
__lpFlow.delete(p);continue;}
const phase=((((now-st.t0)/__LP_FLOW_MS)%1)+1)%1;__lpPaintFlow(st,phase*st.travel);}}
__lpFlowRaf=requestAnimationFrame(step);};__lpFlowRaf=requestAnimationFrame(step);}
const baseNodeSet=new Set(nodes);const focusExtra={loc:null,nodes:new Map(),edges:[]};function lpFocusEdgeKey(e){return`${lpCanonKey(e && e.from)}>>${lpCanonKey(e && e.to)}>>${String((e && e.type) || "prereq")}`;}
function lpNodeTitleRevealFor(loc,visual){const title=nodeTitle(graph,loc);if(visual&&visual.hideTitle){const rs=lpEnsureRevealState(loc,title);return lpRevealTextForState(rs);}
return title;}
function lpBuildNodeLabel(label,loc,visual){if(!label)return;while(label.firstChild)label.removeChild(label.firstChild);try{delete label.dataset.lpHasMasteryIcon;}catch(_){}
const rec=getMastery(loc);const m=rec&&typeof rec.m==="number"?rec.m:null;if(lpHasExplicitMastery(rec,m)){const prefix=document.createElement("span");prefix.className="lp-node-prefix";prefix.setAttribute("aria-hidden","true");prefix.innerHTML=lpMasteryIcon(m)||"";label.appendChild(prefix);try{label.dataset.lpHasMasteryIcon="1";}catch(_){}}
const revealTitle=__lpRepairTitleMathFromLoc(loc,lpNodeTitleRevealFor(loc,visual));const display=(visual&&visual.hideTitle)?{text:revealTitle,html:""}:lpNodeTitleDisplay(graph,loc,revealTitle);const rawTitle=__lpRepairTitleMathFromLoc(loc,(display&&display.text)||revealTitle);const titleSpan=document.createElement("span");titleSpan.className="lp-node-title";lpSetMapNodeTitleContent(titleSpan,rawTitle,visual,(display&&display.html)||"");label.appendChild(titleSpan);}
function lpEdgeDimFilter(){try{if(!lpFogEnabled())return"none";if(__lpIsMobileMapModal())return"none";return"blur(0.8px)";}catch(_){return lpFogEnabled()?"blur(0.8px)":"none";}}
function lpNodeVisualFilter(loc,extraBlurPx){if(loc===cur)return"none";if(!lpFogEnabled())return"none";const visual=nodeVisual.get(loc)||lpMapVisualForLoc(loc);const mobileMap=(()=>{try{return __lpIsMobileMapModal();}catch(_){return false;}})();const effExtraBlur=mobileMap?(Number(extraBlurPx)||0)*0.6:(Number(extraBlurPx)||0);let blur=Math.max(Number(visual&&visual.blurPx)||0,effExtraBlur);if(visual&&visual.hideTitle){const rs=lpEnsureRevealState(loc,nodeTitle(graph,loc));const progress=lpRevealProgressForState(rs);blur=Math.max(Number(extraBlurPx)||0,blur*(1-progress));}
return blur>0?`blur(${blur}px)`:"none";}
function lpApplyBaselineNodeVisual(el,loc){if(!el)return;const visual=nodeVisual.get(loc)||lpMapVisualForLoc(loc);el.classList.remove("lp-focus","lp-dim","lp-keep");el.style.opacity="1";el.style.color="";el.style.filter=lpNodeVisualFilter(loc,0);if(relMode==="dim"&&el.dataset.lpRelOnly==="1"){el.classList.add("lp-dim");el.style.opacity="0.18";el.style.filter=lpNodeVisualFilter(loc,0.7);}}
function lpApplyDimNodeVisual(el,loc){if(!el)return;el.classList.remove("lp-focus","lp-keep");el.classList.add("lp-dim");el.style.opacity="0.18";el.style.color="";el.style.filter=lpNodeVisualFilter(loc,0.7);}
function removeExtraFocusNodes(preserveLoc){const preserveKey=lpCanonKey(preserveLoc||"");for(const[k,el]of Array.from(focusExtra.nodes.entries())){const key=lpCanonKey(k);if(preserveKey&&key&&key===preserveKey){continue;}
try{if(el&&el.remove)el.remove();}catch(_){}
nodeEls.delete(k);try{dims.delete(k);}catch(_){}
try{pos.delete(k);}catch(_){}
try{nodeVisual.delete(k);}catch(_){}
focusExtra.nodes.delete(k);}
focusExtra.edges=[];if(!preserveKey){focusExtra.loc=null;}else{let stillPreserved=false;try{for(const k of focusExtra.nodes.keys()){if(lpCanonKey(k)===preserveKey){stillPreserved=true;break;}}}catch(_){}
if(!stillPreserved)focusExtra.loc=null;}}
function classifyDirectSets(loc){const pres=new Set(getPrereqs(graph,loc)||[]);const deps=new Set(lpLimitDependentsForMap(graph,loc)||[]);const rels=new Set((getRelated(graph,loc)||[]).filter((x)=>!pres.has(x)&&!deps.has(x)&&x!==loc));return{pres,deps,rels};}
function buildFocusContextEdges(loc,ctx){const out=[];for(const p of(ctx&&ctx.pres)||[])out.push({from:loc,to:p,type:"prereq"});for(const d of(ctx&&ctx.deps)||[])out.push({from:d,to:loc,type:"prereq"});for(const r of(ctx&&ctx.rels)||[])out.push({from:loc,to:r,type:"related"});return out;}
function lpDirectEdgesToCurrent(loc){const out=[];if(!loc||loc===cur)return out;const wantA=lpCanonKey(loc);const wantB=lpCanonKey(cur);const seen=new Set();for(const e of(edges||[])){if(!e||!e.from||!e.to)continue;const a=lpCanonKey(e.from);const b=lpCanonKey(e.to);if(!((a===wantA&&b===wantB)||(a===wantB&&b===wantA)))continue;const o=orientEdge(e);const key=lpFocusEdgeKey(o);if(seen.has(key))continue;seen.add(key);out.push({from:o.from,to:o.to,type:o.type||(e.type||"prereq")});}
return out;}
function measureNodeEl(loc,a){if(!a)return dims.get(loc)||{hw:80,hh:18};const hw=Math.max(34,a.offsetWidth/2);const hh=Math.max(14,a.offsetHeight/2);const d={hw,hh};dims.set(loc,d);return d;}
function createNodeEl(loc,extra,opts){const xy=pos.get(loc)||{x:cx,y:cy};const rawVisual=lpMapVisualForLoc(loc);const visual=(loc===cur)?{...rawVisual,blurPx:0,hideTitle:false,fog:false}:rawVisual;nodeVisual.set(loc,visual);const a=document.createElement("a");a.className="lp-node"+(extra?" lp-extra":"");a.dataset.lpLoc=loc;a.href=toAbsoluteUrl(loc);a.setAttribute("data-mk-no-hover-preview","1");const label=document.createElement("span");label.className="lp-node-label";lpBuildNodeLabel(label,loc,visual);a.appendChild(label);a.dataset.lpTitle=__lpRepairTitleMathFromLoc(loc,nodeTitle(graph,loc));a.dataset.lpVisual=visual.key;if(visual.mastered)a.classList.add("lp-node-mastered");if(lpShouldMaskNode(visual))a.dataset.lpUnvisited="1";if(loc===cur)a.classList.add("is-cur");a.style.color="";a.style.filter=lpNodeVisualFilter(loc,0);a.style.left=`${Math.round(xy.x)}px`;a.style.top=`${Math.round(xy.y)}px`;a.style.transform="translate(-50%, -50%)";lp3dDecorateLocalNodeElement(a,loc,cur,level,coreSet);vp.appendChild(a);lpQueueNodeTitleTypeset(a);nodeEls.set(loc,a);if(!(opts&&opts.deferMeasure))measureNodeEl(loc,a);return a;}
function overlapsExisting(pt,d,occupied,gap){const g=Number(gap)||26;for(const it of occupied){const od=it.d||{hw:80,hh:18};const dx=Math.abs(pt.x-it.x);const dy=Math.abs(pt.y-it.y);if(dx<(d.hw+od.hw+g)&&dy<(d.hh+od.hh+g))return true;}
return false;}
function clampFocusPoint(pt,d){const pad=10;return{x:Math.min(W-d.hw-pad,Math.max(d.hw+pad,pt.x)),y:Math.min(H-d.hh-pad,Math.max(d.hh+pad,pt.y)),};}
function placeFocusExtras(loc,ctx){const anchor=pos.get(loc)||pos.get(cur)||{x:cx,y:cy};const occupied=[];for(const n of baseNodeSet){const p0=pos.get(n);const d0=dims.get(n);if(p0&&d0)occupied.push({x:p0.x,y:p0.y,d:d0});}
const extras=[];for(const child of Array.from(ctx.pres).filter((n)=>!baseNodeSet.has(n)))extras.push({loc:child,tag:'pre'});for(const child of Array.from(ctx.deps).filter((n)=>!baseNodeSet.has(n)))extras.push({loc:child,tag:'dep'});for(const child of Array.from(ctx.rels).filter((n)=>!baseNodeSet.has(n)))extras.push({loc:child,tag:'rel'});if(!extras.length)return;extras.sort((a,b)=>{const ta=titleTie(a.loc);const tb=titleTie(b.loc);if(ta!==tb)return ta.localeCompare(tb,undefined,{sensitivity:'base'});return h01Stable(`focus-extra-sort|${loc}|${a.tag}|${a.loc}`)-h01Stable(`focus-extra-sort|${loc}|${b.tag}|${b.loc}`);});const count=extras.length;const startAng=-Math.PI/2+((h01Stable(`focus-extra-phase|${loc}`)-0.5)*0.45);const baseRadius=214;const ringStep=50;const perRing=Math.max(6,Math.min(10,Math.ceil(count/2)));const extraEls=[];for(let i=0;i<count;i++)extraEls.push(createNodeEl(extras[i].loc,true,{deferMeasure:true}));for(let i=0;i<count;i++)measureNodeEl(extras[i].loc,extraEls[i]);for(let i=0;i<count;i++){const item=extras[i];const child=item.loc;const a=extraEls[i];const d=dims.get(child)||{hw:80,hh:18};const ringIdx=Math.floor(i/perRing);const slotIdx=i%perRing;const slotsThisRing=Math.min(perRing,count-ringIdx*perRing);const slotAng=startAng+((Math.PI*2)*slotIdx/Math.max(1,slotsThisRing));const jitterAng=(h01Stable(`focus-extra-ang|${loc}|${item.tag}|${child}`)-0.5)*Math.min(0.24,(Math.PI*2)/Math.max(14,slotsThisRing*3));let radius=baseRadius+ringIdx*ringStep;if(item.tag==='rel')radius+=14;else if(item.tag==='pre')radius-=8;const radialJitter=(h01Stable(`focus-extra-r|${loc}|${item.tag}|${child}`)-0.5)*18;let ang=slotAng+jitterAng;let pt={x:anchor.x+Math.cos(ang)*(radius+radialJitter),y:anchor.y+Math.sin(ang)*(radius+radialJitter*0.8),};pt=clampFocusPoint(pt,d);for(let tries=0;tries<10&&overlapsExisting(pt,d,occupied,50);tries++){radius+=16;ang+=0.28+tries*0.05;pt={x:anchor.x+Math.cos(ang)*radius,y:anchor.y+Math.sin(ang)*radius,};pt=clampFocusPoint(pt,d);}
pos.set(child,pt);a.style.left=`${Math.round(pt.x)}px`;a.style.top=`${Math.round(pt.y)}px`;occupied.push({x:pt.x,y:pt.y,d});focusExtra.nodes.set(child,a);}}
function renderContextEdges(contextEdges,loc,keepSet){__lpHiClear();try{hiBaseG.innerHTML="";}catch(_){}
__lpHiUpdateMask(keepSet);for(const e0 of(contextEdges||[])){const o=orientEdge(e0);const incidentToLoc=o.from===loc||o.to===loc;if(!incidentToLoc)continue;const A=pos.get(o.from);const B=pos.get(o.to);if(!A||!B)continue;const da=dims.get(o.from)||{hw:80,hh:18};const db=dims.get(o.to)||{hw:80,hh:18};const P1=clipToEdge(A.x,A.y,B.x,B.y,da.hw+NODE_NEIGHBOUR_PAD,da.hh+NODE_NEIGHBOUR_PAD);const P2=clipToEdge(B.x,B.y,A.x,A.y,db.hw+NODE_NEIGHBOUR_PAD,db.hh+NODE_NEIGHBOUR_PAD);const t=hash01(`${o.from}→${o.to}`);const segLen=Math.hypot(P2.x-P1.x,P2.y-P1.y);const baseB=(t<0.5?-1:1)*(8+16*Math.abs(t-0.5)*2);const damp=Math.max(0.35,Math.min(1,segLen/220));const dAttr=curvedPath(P1,P2,baseB*damp);const p2=document.createElementNS("http://www.w3.org/2000/svg","path");p2.classList.add("lp-edge");p2.setAttribute("d",dAttr);p2.setAttribute("fill","none");try{p2.dataset.from=o.from;p2.dataset.to=o.to;p2.dataset.type=o.type||"prereq";}catch(_){}
if(!__lpDesktopSingleLayerHi)p2.setAttribute("mask",`url(#${hiMaskId})`);const gWrap=document.createElementNS("http://www.w3.org/2000/svg","g");gWrap.classList.add("lp-hi-edgewrap");gWrap.style.opacity=incidentToLoc?"0.92":"0.78";if(o.type==="related"){p2.classList.add("lp-rel-edge");p2.style.strokeWidth=incidentToLoc?"2.2":"1.8";p2.style.strokeDasharray="6 6";p2.style.strokeDashoffset="0";p2.style.stroke=incidentToLoc?REL_COLOR:EDGE_DEFAULT;if(incidentToLoc&&!__lpReduceMotion()){p2.classList.add("lp-rel-anim");__lpStartRelDash(p2);}}else{p2.style.strokeWidth=incidentToLoc?"2.3":"1.85";let col=EDGE_DEFAULT;let mid=HI_DEF_MARKER_ID;if(incidentToLoc){if(o.to===loc){col=PRE_COLOR;mid=HI_PRE_MARKER_ID;}
else if(o.from===loc){col=POST_COLOR;mid=HI_POST_MARKER_ID;}}
p2.style.stroke=col;p2.setAttribute("marker-end",`url(#${mid})`);}
gWrap.appendChild(p2);hiG.appendChild(gWrap);if(incidentToLoc&&o.type!=="related")__lpStartFlow(p2,gWrap);}}
function lpShuffleIndexes(arr){const out=Array.isArray(arr)?arr.slice():[];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const tmp=out[i];out[i]=out[j];out[j]=tmp;}
return out;}
function lpRevealCurrentElement(loc,fallbackEl){if(fallbackEl&&fallbackEl.isConnected)return fallbackEl;try{const modalEl=document.getElementById('lp-map-modal');const key=normLoc(loc||'');if(modalEl&&key){const candidates=modalEl.querySelectorAll('a.lp-node[data-lp-loc]');for(const cand of Array.from(candidates||[])){try{if(normLoc(cand.dataset&&cand.dataset.lpLoc)===key)return cand;}catch(_){}}}}catch(_){}
const mapped=nodeEls.get(loc)||focusExtra.nodes.get(loc);if(mapped&&mapped.isConnected)return mapped;return fallbackEl||mapped||null;}
function lpSyncRevealNode(loc,fallbackEl){try{const el=lpRevealCurrentElement(loc,fallbackEl);if(!el)return;const visual=nodeVisual.get(loc)||lpMapVisualForLoc(loc);if(!(visual&&visual.hideTitle))return;const rs=lpEnsureRevealState(loc,el.dataset.lpTitle||nodeTitle(graph,loc));const titleEl=el.querySelector('.lp-node-title')||el.querySelector('.lp-node-label');if(titleEl){const nextText=lpRevealTextForState(rs);lpSetMapNodeTitleContent(titleEl,nextText,visual);if(lpRevealIsComplete(rs)&&lpNodeTitleNeedsTypeset(titleEl))lpQueueTitleTypeset(titleEl);}
el.style.filter=lpNodeVisualFilter(loc,el.classList.contains('lp-dim')?0.7:0);try{const engine=modal&&modal.__lpWebgl3dEngine;if(engine&&engine.kind==='local'&&modal.classList&&modal.classList.contains('lp-webgl3d')&&lpWebgl3dEnabled()){if(!engine.__lpRevealSyncRaf){engine.__lpRevealSyncRaf=window.requestAnimationFrame(()=>{engine.__lpRevealSyncRaf=0;try{if(modal&&modal.__lpWebgl3dEngine===engine&&lpWebgl3dEnabled())lpWebgl3dDraw(engine);}catch(_){}});}}}catch(_){}}catch(_){}}
function lpRevealNavIsActive(loc){try{const rs=lpEnsureRevealState(loc,nodeTitle(graph,loc));return!!(rs&&((rs.running&&rs.navigateOnDone)||rs.navTimerId));}catch(_){return false;}}
function lpScheduleRevealEdgeFocusRepaint(loc,fallbackEl){try{const rid=renderId;window.requestAnimationFrame(()=>{try{if(!st2||st2.__lpRenderId!==rid)return;if(!lpRevealNavIsActive(loc))return;lpApplyRevealEdgeFocus(loc,fallbackEl);}catch(_){}});}catch(_){}}
function lpApplyRevealEdgeFocus(loc,fallbackEl){try{if(!loc||loc===cur)return false;if(st2.__lpRenderId!==renderId)return false;const target=lpRevealCurrentElement(loc,fallbackEl);if(!target)return false;st2.__lpRevealFocusLoc=loc;try{if(modal&&modal.classList){modal.classList.add('lp-mobile-focus-preview','lp-reveal-edge-preview');lpSyncMobileFocusZoomedClass(true);}}catch(_){}
try{st2.__lpApplyingRevealFocus=true;if(typeof st2.__lpApplyFocus==="function")st2.__lpApplyFocus(loc);else if(typeof applyFocus==="function")applyFocus(loc);}catch(_){}finally{try{st2.__lpApplyingRevealFocus=false;}catch(__){}}
const directEdges=lpDirectEdgesToCurrent(loc);if(directEdges&&directEdges.length){const keep=new Set([loc,cur]);renderContextEdges(directEdges,loc,keep);}
const curEl=nodeEls.get(cur);if(curEl){curEl.classList.add('lp-keep');curEl.style.opacity='1';curEl.style.filter=lpNodeVisualFilter(cur,0);}
const liveTarget=lpRevealCurrentElement(loc,target);if(liveTarget){liveTarget.classList.add('lp-focus','lp-keep');liveTarget.style.opacity='1';liveTarget.style.filter=lpNodeVisualFilter(loc,0);}
st2.__lpRevealFocusLoc=loc;return true;}catch(_){return false;}}
function lpClearRevealEdgeFocus(loc){try{if(!st2||!st2.__lpRevealFocusLoc)return;if(loc&&st2.__lpRevealFocusLoc!==loc)return;st2.__lpRevealFocusLoc=null;if(modal&&modal.classList)modal.classList.remove('lp-reveal-edge-preview');}catch(_){}}
function lpPauseRevealPlayback(loc,fallbackEl){try{const rs=lpEnsureRevealState(loc,nodeTitle(graph,loc));lpRevealStopTimer(rs);const el=lpRevealCurrentElement(loc,fallbackEl);if(el){try{delete el.dataset.lpRevealing;}catch(_){}
el.classList.remove('lp-revealing');try{if(typeof el.blur==="function")el.blur();}catch(_){}}
lpSyncRevealNode(loc,el);if(!lpRevealNavIsActive(loc))lpClearRevealEdgeFocus(loc);}catch(_){}}
function lpStartRevealPlayback(el,loc,opts){try{if(!loc)return false;const target=lpRevealCurrentElement(loc,el);const visual=nodeVisual.get(loc)||lpMapVisualForLoc(loc);if(!(target&&visual&&visual.hideTitle))return false;const rs=lpEnsureRevealState(loc,target.dataset.lpTitle||nodeTitle(graph,loc));const navigateOnDone=!!(opts&&opts.navigateOnDone);const forceStepReveal=!!navigateOnDone;const stepMs=Math.max(28,Number(opts&&opts.stepMs)||(navigateOnDone?105:38));const firstDelayMs=Math.max(0,Number(opts&&opts.firstDelayMs)||(navigateOnDone?stepMs:50));const doneDelayMs=Math.max(0,Number(opts&&opts.doneDelayMs)||(navigateOnDone&&__lpIsPhoneTouch()?500:0));const navHref=String((opts&&opts.href)||target.getAttribute('href')||toAbsoluteUrl(loc)||'');if(navigateOnDone){lpApplyRevealEdgeFocus(loc,target);lpScheduleRevealEdgeFocusRepaint(loc,target);}
const doNavigate=(href)=>{const finalHref=href||navHref||toAbsoluteUrl(loc);if(finalHref)lpNavigate(finalHref,loc);};if(__lpReduceMotion()&&!forceStepReveal){lpRevealStopTimer(rs);rs.running=false;rs.navigateOnDone=false;for(let i=0;i<rs.units.length;i++)rs.revealed.add(i);lpSharedRevealAdd(loc);lpSyncRevealNode(loc,target);try{delete target.dataset.lpRevealing;}catch(_){}
target.classList.remove('lp-revealing');if(navigateOnDone){if(doneDelayMs>0){rs.navTimerId=window.setTimeout(()=>{rs.navTimerId=0;doNavigate(navHref);},doneDelayMs);lpApplyRevealEdgeFocus(loc,target);lpScheduleRevealEdgeFocusRepaint(loc,target);}else{doNavigate(navHref);}}
return true;}
if(lpRevealIsComplete(rs)){lpSharedRevealAdd(loc);lpPauseRevealPlayback(loc,target);if(navigateOnDone)lpApplyRevealEdgeFocus(loc,target);if(navigateOnDone){if(doneDelayMs>0){rs.navTimerId=window.setTimeout(()=>{rs.navTimerId=0;doNavigate(navHref);},doneDelayMs);lpApplyRevealEdgeFocus(loc,target);lpScheduleRevealEdgeFocusRepaint(loc,target);}else{doNavigate(navHref);}}
return true;}
if(rs.running&&!navigateOnDone&&!rs.navigateOnDone){const liveEl=lpRevealCurrentElement(loc,target)||target;if(liveEl){try{liveEl.dataset.lpRevealing='1';}catch(_){}
try{liveEl.classList.add('lp-revealing');}catch(_){}
lpSyncRevealNode(loc,liveEl);}
return true;}
lpRevealStopTimer(rs);rs.running=true;rs.navigateOnDone=navigateOnDone;target.dataset.lpRevealing='1';target.classList.add('lp-revealing');const finishIfDone=(doneEl)=>{if(!lpRevealIsComplete(rs))return false;lpSharedRevealAdd(loc);const finalEl=lpRevealCurrentElement(loc,doneEl||target);if(finalEl){try{delete finalEl.dataset.lpRevealing;}catch(_){}
finalEl.classList.remove('lp-revealing');}
rs.running=false;const go=!!rs.navigateOnDone;rs.navigateOnDone=false;if(!go)lpClearRevealEdgeFocus(loc);if(go){const href=(finalEl&&finalEl.getAttribute('href'))||navHref||toAbsoluteUrl(loc);if(doneDelayMs>0){try{if(rs.navTimerId)window.clearTimeout(rs.navTimerId);}catch(_){}
rs.navTimerId=window.setTimeout(()=>{rs.navTimerId=0;doNavigate(href);},doneDelayMs);lpApplyRevealEdgeFocus(loc,finalEl||target);lpScheduleRevealEdgeFocusRepaint(loc,finalEl||target);}else{doNavigate(href);}}
return true;};const tick=()=>{const liveEl=lpRevealCurrentElement(loc,target);rs.timerId=0;if(!rs.running)return;if(!lpRevealAdvanceOne(rs)){rs.running=false;}
lpSyncRevealNode(loc,liveEl);if(finishIfDone(liveEl))return;rs.timerId=window.setTimeout(tick,stepMs);};if(!lpRevealAdvanceOne(rs)){rs.running=false;}
lpSyncRevealNode(loc,target);if(finishIfDone(target))return true;rs.timerId=window.setTimeout(tick,firstDelayMs);return true;}catch(_){lpPauseRevealPlayback(loc,el);return false;}}
function lpStartRevealPreview(el,loc){return lpStartRevealPlayback(el,loc,{navigateOnDone:false});}
function lpStartRevealNavigation(el,loc,opts){const mobile=(()=>{try{return __lpIsPhoneTouch();}catch(_){return false;}})();return lpStartRevealPlayback(el,loc,Object.assign({navigateOnDone:true,doneDelayMs:mobile?500:0,stepMs:mobile?105:38},opts||{}));}
function lpRevealCompleteImmediate(el,loc){try{if(!loc)return false;const target=lpRevealCurrentElement(loc,el);const visual=nodeVisual.get(loc)||lpMapVisualForLoc(loc);if(!(target&&visual&&visual.hideTitle))return false;const rs=lpEnsureRevealState(loc,(target&&target.dataset&&target.dataset.lpTitle)||nodeTitle(graph,loc));lpRevealStopTimer(rs);rs.running=false;rs.navigateOnDone=false;for(let i=0;i<rs.units.length;i+=1)rs.revealed.add(i);lpSharedRevealAdd(loc);try{delete target.dataset.lpRevealing;}catch(_){}
target.classList.remove('lp-revealing');lpSyncRevealNode(loc,target);return true;}catch(_){lpPauseRevealPlayback(loc,el);return false;}}
function lpHandleUnvisitedNodeTap(el,loc,href){try{const target=lpRevealCurrentElement(loc,el)||el;const rs=lpEnsureRevealState(loc,(target&&target.dataset&&target.dataset.lpTitle)||nodeTitle(graph,loc));if(lpRevealIsComplete(rs)){if(href)lpNavigate(href,loc);return true;}
lpStartRevealPreview(target,loc);return true;}catch(_){return false;}}
function lpHandleUnvisitedNodeHold(el,loc){return lpRevealCompleteImmediate(el,loc);}
function lpSyncMobileFocusZoomedClass(forceOn){try{if(!modal||!modal.classList)return;const st=window.__lpMapState;const scale=st&&Number(st.scale);const on=forceOn===true||(!!(scale&&scale>1.02&&__lpIsPhoneTouch()));modal.classList.toggle('lp-mobile-focus-zoomed',!!on);}catch(_){}}
function lpNodeShouldRunRevealPreview(el,loc){try{const visual=nodeVisual.get(loc)||lpMapVisualForLoc(loc);if(!(visual&&visual.hideTitle))return false;const rs=lpEnsureRevealState(loc,(el&&el.dataset&&el.dataset.lpTitle)||nodeTitle(graph,loc));return!lpRevealIsComplete(rs);}catch(_){try{return!!(el&&el.dataset&&el.dataset.lpUnvisited==='1');}catch(_){}
return false;}}
function lpIsDesktopLocalMapHover(){try{return!!(window.matchMedia&&window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)').matches);}catch(_){return false;}}
function lpClearDesktopHoverInterference(){if(!lpIsDesktopLocalMapHover())return;try{if(modal&&modal.classList)modal.classList.remove('lp-slider-zooming','lp-mobile-gesturing');}catch(_){}
try{const proxies=modal&&modal.querySelectorAll?modal.querySelectorAll('.lp-mapviewport.lp-zoom-proxy'):[];Array.from(proxies||[]).forEach((proxy)=>{try{if(proxy&&proxy.parentNode)proxy.parentNode.removeChild(proxy);}catch(_){}});}catch(_){}
try{if(vp&&vp.classList)vp.classList.remove('lp-zoom-proxy-source');}catch(_){}
try{if(st2)st2.__lpZoomProxy=null;}catch(_){}}
function bindNodeInteractions(el,loc){if(!el||el.dataset.lpHoverBound==="1")return;el.dataset.lpHoverBound="1";const stopEvt=(e)=>{try{if(e&&e.cancelable)e.preventDefault();e&&e.stopPropagation&&e.stopPropagation();if(e&&typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();}catch(_){}};const LP_TOUCH_LONG_PRESS_MS=360;const LP_TOUCH_MOVE_TOL_PX=14;const lpCanRunMobileLongPress=()=>{try{return __lpIsPhoneTouch();}catch(_){return false;}};const lpDesktopHoverStable=()=>{try{const st=window.__lpMapState;return!!(lpIsDesktopLocalMapHover()&&st&&st.__lpRenderId===renderId&&st.__lpHoverLoc===loc&&st.__lpFocusedLoc===loc);}catch(_){return false;}};const lpLocalWebgl3dHoverActive=()=>{try{return!!(modal&&modal.classList&&modal.classList.contains('lp-webgl3d')&&!modal.classList.contains('lp-route-3d')&&lpWebgl3dEnabled());}catch(_){return false;}};const lpCancelLocalWebgl3dHoverClear=()=>{try{const st=window.__lpMapState;if(st&&st.__lpWebgl3dHoverClearTimer){window.clearTimeout(st.__lpWebgl3dHoverClearTimer);st.__lpWebgl3dHoverClearTimer=0;}}catch(_){}};const lpCancelLocalWebgl3dHoverWork=()=>{try{const st=window.__lpMapState;if(!st)return;st.__lpWebgl3dHoverWorkEpoch=(Number(st.__lpWebgl3dHoverWorkEpoch)||0)+1;if(st.__lpWebgl3dHoverWorkRaf)window.cancelAnimationFrame(st.__lpWebgl3dHoverWorkRaf);if(st.__lpWebgl3dHoverWorkTimer)window.clearTimeout(st.__lpWebgl3dHoverWorkTimer);st.__lpWebgl3dHoverWorkRaf=0;st.__lpWebgl3dHoverWorkTimer=0;st.__lpPendingWebgl3dHoverLoc="";}catch(_){}};const lpMarkLocalWebgl3dHoverClass=(key,active)=>{try{if(!modal||!modal.querySelectorAll||!key)return;Array.from(modal.querySelectorAll('a.lp-node[data-lp-loc]')).forEach((nodeEl)=>{const same=lpCanonKey(nodeEl.getAttribute('data-lp-loc')||'')===key;if(same&&active)nodeEl.classList.add('lp-webgl3d-hover');else if(!active||same)nodeEl.classList.remove('lp-webgl3d-hover');});}catch(_){}};const lpLocalWebgl3dHoverPointer={x:0,y:0,valid:false,t:0};const lpRememberLocalWebgl3dHoverPoint=(e)=>{try{if(!e)return;const x=Number(e.clientX);const y=Number(e.clientY);if(!Number.isFinite(x)||!Number.isFinite(y))return;lpLocalWebgl3dHoverPointer.x=x;lpLocalWebgl3dHoverPointer.y=y;lpLocalWebgl3dHoverPointer.valid=true;lpLocalWebgl3dHoverPointer.t=(performance&&performance.now)?performance.now():Date.now();}catch(_){}};const lpLocalWebgl3dRevealPreviewRunning=()=>{try{const liveEl=lpRevealCurrentElement(loc,el)||el;const rs=lpEnsureRevealState(loc,(liveEl&&liveEl.dataset&&liveEl.dataset.lpTitle)||nodeTitle(graph,loc));return!!(rs&&rs.running&&!rs.navigateOnDone&&!rs.navTimerId&&!lpRevealIsComplete(rs));}catch(_){return false;}};const lpPointerHitsLocalWebgl3dNode=()=>{try{if(!lpLocalWebgl3dHoverPointer.valid)return false;const x=Number(lpLocalWebgl3dHoverPointer.x);const y=Number(lpLocalWebgl3dHoverPointer.y);if(!Number.isFinite(x)||!Number.isFinite(y))return false;const hit=document.elementFromPoint(x,y);const hitNode=hit&&hit.closest?hit.closest('a.lp-node[data-lp-loc]'):null;return!!(hitNode&&lpCanonKey(hitNode.getAttribute('data-lp-loc')||'')===lpCanonKey(loc));}catch(_){return false;}};const lpPointerStillOverLocalWebgl3dNode=(allowPaddedRect)=>{try{if(lpPointerHitsLocalWebgl3dNode())return true;if(!allowPaddedRect)return false;const x=Number(lpLocalWebgl3dHoverPointer.x);const y=Number(lpLocalWebgl3dHoverPointer.y);if(!Number.isFinite(x)||!Number.isFinite(y))return false;const liveEl=lpRevealCurrentElement(loc,el)||el;if(!liveEl||!liveEl.isConnected)return false;const r=liveEl.getBoundingClientRect&&liveEl.getBoundingClientRect();if(!r||r.width<=0||r.height<=0)return false;const pad=10;return x>=r.left-pad&&x<=r.right+pad&&y>=r.top-pad&&y<=r.bottom+pad;}catch(_){return false;}};let lpStopLocalWebgl3dHoverWatch=()=>{};const lpForceLocalWebgl3dHoverClear=(reason)=>{try{if(lpRevealNavIsActive(loc))return false;}catch(_){}
try{lpStopLocalWebgl3dHoverWatch();}catch(_){}
try{lpCancelLocalWebgl3dHoverClear();}catch(_){}
try{lpCancelLocalWebgl3dHoverWork();}catch(_){}
try{const engine=modal&&modal.__lpWebgl3dEngine;if(engine&&engine.kind==='local')engine.hoverKey='';}catch(_){}
try{lpMarkLocalWebgl3dHoverClass(lpCanonKey(loc),false);}catch(_){}
try{const stNow=window.__lpMapState;if(stNow&&stNow.__lpRenderId===renderId){stNow.__lpHoverLoc=null;stNow.__lpFocusedLoc=null;if(stNow.__lpRevealFocusLoc===loc&&!lpRevealNavIsActive(loc))stNow.__lpRevealFocusLoc=null;}}catch(_){}
try{lpPauseRevealPlayback(loc,el);}catch(_){}
try{const stNow=window.__lpMapState;if(stNow&&stNow.__lpRenderId===renderId&&typeof stNow.__lpClearFocus==='function'){stNow.__lpClearFocus();}else if(typeof clearFocus==='function'){clearFocus();}}catch(_){}
try{if(typeof __lpStopAllFlows==='function')__lpStopAllFlows();}catch(_){}
try{if(typeof __lpStopAllRelDash==='function')__lpStopAllRelDash();}catch(_){}
try{if(hiG)hiG.innerHTML='';if(hiCuts)hiCuts.innerHTML='';}catch(_){}
try{if(modal&&modal.classList){modal.classList.remove('lp-desktop-focus-preview','lp-reveal-edge-preview','lp-mobile-focus-preview','lp-mobile-focus-zoomed');}}catch(_){}
try{const engine=modal&&modal.__lpWebgl3dEngine;if(engine&&engine.kind==='local'){try{lpWebgl3dClearSvgOverlay(engine);}catch(_){}
try{lpWebgl3dRebuild(engine);}catch(_){try{lpWebgl3dDraw(engine);}catch(__){}}}}catch(_){}
return true;};const lpInstallLocalWebgl3dHoverWatch=()=>{try{const st=window.__lpMapState;if(!st)return;if(typeof st.__lpWebgl3dHoverWatchStop==='function'){try{st.__lpWebgl3dHoverWatchStop();}catch(_){}}
let stopped=false;let raf=0;const shouldKeepHover=()=>{if(lpPointerHitsLocalWebgl3dNode())return true;return lpLocalWebgl3dRevealPreviewRunning()&&lpPointerStillOverLocalWebgl3dNode(true);};const scheduleCheck=()=>{if(raf||stopped)return;raf=window.requestAnimationFrame(()=>{raf=0;if(stopped)return;try{const stNow=window.__lpMapState;const engine=modal&&modal.__lpWebgl3dEngine;if(!engine||engine.kind!=='local'||!lpLocalWebgl3dHoverActive()){lpForceLocalWebgl3dHoverClear('watch-inactive');return;}
if(stNow&&stNow.__lpRenderId===renderId&&stNow.__lpHoverLoc&&stNow.__lpHoverLoc!==loc){lpForceLocalWebgl3dHoverClear('watch-other-node');return;}
if(!shouldKeepHover())lpForceLocalWebgl3dHoverClear('watch-outside');}catch(_){}});};const onPointerMove=(e)=>{try{const pType=e&&e.pointerType?e.pointerType:'';if(pType&&pType!=='mouse')return;lpRememberLocalWebgl3dHoverPoint(e);scheduleCheck();}catch(_){}};const onPointerDown=(e)=>{try{const pType=e&&e.pointerType?e.pointerType:'';if(pType&&pType!=='mouse')return;lpRememberLocalWebgl3dHoverPoint(e);if(!lpPointerHitsLocalWebgl3dNode())lpForceLocalWebgl3dHoverClear('pointerdown-outside');}catch(_){}};const stop=()=>{if(stopped)return;stopped=true;try{if(raf)window.cancelAnimationFrame(raf);}catch(_){}
raf=0;try{window.removeEventListener('pointermove',onPointerMove,true);}catch(_){}
try{window.removeEventListener('pointerdown',onPointerDown,true);}catch(_){}
try{const stNow=window.__lpMapState;if(stNow&&stNow.__lpWebgl3dHoverWatchStop===stop)stNow.__lpWebgl3dHoverWatchStop=null;}catch(_){}};lpStopLocalWebgl3dHoverWatch=stop;st.__lpWebgl3dHoverWatchStop=stop;window.addEventListener('pointermove',onPointerMove,{capture:true,passive:true});window.addEventListener('pointerdown',onPointerDown,{capture:true,passive:true});}catch(_){}};const lpSetLocalWebgl3dHover=(active)=>{try{const st=window.__lpMapState;const engine0=modal&&modal.__lpWebgl3dEngine;if(!engine0||engine0.kind!=='local')return false;const key=lpCanonKey(loc);if(!key)return false;if(active){lpCancelLocalWebgl3dHoverClear();lpCancelLocalWebgl3dHoverWork();lpInstallLocalWebgl3dHoverWatch();try{modal&&modal.classList&&modal.classList.add('lp-desktop-focus-preview');}catch(_){}
try{lpClearDesktopHoverInterference();}catch(_){}
engine0.hoverKey=key;lpMarkLocalWebgl3dHoverClass(key,true);if(st&&st.__lpRenderId===renderId){const epoch=(Number(st.__lpWebgl3dHoverWorkEpoch)||0)+1;st.__lpWebgl3dHoverWorkEpoch=epoch;st.__lpPendingWebgl3dHoverLoc=loc;st.__lpWebgl3dHoverWorkRaf=window.requestAnimationFrame(()=>{st.__lpWebgl3dHoverWorkRaf=0;if(st.__lpWebgl3dHoverWorkEpoch!==epoch)return;st.__lpWebgl3dHoverWorkTimer=window.setTimeout(()=>{st.__lpWebgl3dHoverWorkTimer=0;try{const stNow=window.__lpMapState;const engine=modal&&modal.__lpWebgl3dEngine;if(!stNow||stNow.__lpRenderId!==renderId||stNow.__lpWebgl3dHoverWorkEpoch!==epoch)return;if(!engine||engine.kind!=='local'||!lpLocalWebgl3dHoverActive())return;if(!lpPointerHitsLocalWebgl3dNode()&&!lpPointerStillOverLocalWebgl3dNode(false))return;if(typeof stNow.__lpApplyFocus==="function"&&!(stNow.__lpHoverLoc===loc&&stNow.__lpFocusedLoc===loc)){stNow.__lpApplyFocus(loc);}
engine.hoverKey=key;lpMarkLocalWebgl3dHoverClass(key,true);try{lpWebgl3dRebuild(engine);}catch(_){try{lpWebgl3dDraw(engine);}catch(__){}}
stNow.__lpPendingWebgl3dHoverLoc="";}catch(_){}},0);});}
return true;}
lpCancelLocalWebgl3dHoverWork();lpCancelLocalWebgl3dHoverClear();const delay=lpLocalWebgl3dRevealPreviewRunning()?24:0;if(st){st.__lpWebgl3dHoverClearTimer=window.setTimeout(()=>{try{const stNow=window.__lpMapState;if(stNow)stNow.__lpWebgl3dHoverClearTimer=0;const engine=modal&&modal.__lpWebgl3dEngine;if(!engine||engine.kind!=='local')return;if(stNow&&stNow.__lpRenderId===renderId&&stNow.__lpHoverLoc&&stNow.__lpHoverLoc!==loc){lpForceLocalWebgl3dHoverClear('timer-other-node');return;}
if(lpPointerHitsLocalWebgl3dNode()||(lpLocalWebgl3dRevealPreviewRunning()&&lpPointerStillOverLocalWebgl3dNode(true))){engine.hoverKey=key;lpMarkLocalWebgl3dHoverClass(key,true);try{if(stNow&&stNow.__lpRenderId===renderId){stNow.__lpHoverLoc=loc;stNow.__lpFocusedLoc=loc;}}catch(_){}
try{lpWebgl3dDraw(engine);}catch(_){}
return;}
lpForceLocalWebgl3dHoverClear('timer-outside');}catch(_){}},delay);}else{lpForceLocalWebgl3dHoverClear('no-state');}
return true;}catch(_){return false;}};const lpTouchLongPress={timerId:0,touchId:null,source:"",startX:0,startY:0,fired:false,suppressClickUntil:0,};const lpClearTouchLongPressTimer=()=>{try{if(lpTouchLongPress.timerId)window.clearTimeout(lpTouchLongPress.timerId);}catch(_){}
lpTouchLongPress.timerId=0;};const lpResetTouchLongPress=()=>{lpClearTouchLongPressTimer();lpTouchLongPress.touchId=null;lpTouchLongPress.source="";lpTouchLongPress.startX=0;lpTouchLongPress.startY=0;lpTouchLongPress.fired=false;};const lpFindTrackedTouch=(e)=>{try{const id=lpTouchLongPress.touchId;const lists=[e&&e.touches,e&&e.changedTouches];for(const list of lists){if(!list||!list.length)continue;for(let i=0;i<list.length;i+=1){const t=list[i];if(t&&t.identifier===id)return t;}}}catch(_){}
return null;};const lpFinishLongPressVisual=()=>{try{const st=window.__lpMapState;if(!st||st.__lpRenderId!==renderId)return;if(st.__lpHoverLoc===loc&&typeof st.__lpClearFocus==="function"){window.setTimeout(()=>{try{const st2=window.__lpMapState;if(!st2||st2.__lpRenderId!==renderId)return;if(st2.__lpHoverLoc===loc&&typeof st2.__lpClearFocus==="function")st2.__lpClearFocus();}catch(_){}},40);}}catch(_){}};const lpFireTouchLongPress=()=>{lpClearTouchLongPressTimer();lpTouchLongPress.fired=true;lpTouchLongPress.suppressClickUntil=Date.now()+900;lpPauseRevealPlayback(loc,el);const st=window.__lpMapState;if(!st||st.__lpRenderId!==renderId)return;try{if(modal&&modal.classList)modal.classList.add('lp-mobile-focus-preview');lpSyncMobileFocusZoomedClass(true);}catch(_){}
try{if(typeof st.__lpApplyFocus==="function")st.__lpApplyFocus(loc);}catch(_){}
try{if(lpNodeShouldRunRevealPreview(el,loc))lpRevealCompleteImmediate(el,loc);}catch(_){}};const lpStartTouchLongPress=(x,y,source,touchId)=>{lpResetTouchLongPress();lpTouchLongPress.source=source||"touch";lpTouchLongPress.touchId=touchId==null?null:touchId;lpTouchLongPress.startX=Number(x)||0;lpTouchLongPress.startY=Number(y)||0;lpTouchLongPress.timerId=window.setTimeout(lpFireTouchLongPress,LP_TOUCH_LONG_PRESS_MS);};const lpCancelTouchLongPress=()=>{lpClearTouchLongPressTimer();lpTouchLongPress.touchId=null;lpTouchLongPress.source="";};const lpMaskedTap={pointerId:null,startX:0,startY:0,t0:0,moved:false,suppressClickUntil:0,};const lpIsMobileMaskedNode=()=>{try{return!!(lpCanRunMobileLongPress()&&el&&el.dataset&&el.dataset.lpUnvisited==="1"&&!(el.classList&&el.classList.contains("is-cur")));}catch(_){return false;}};const lpRunMobileMaskedNodeNavigation=(e)=>{try{if(!lpIsMobileMaskedNode())return false;if(e&&(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey))return false;stopEvt(e);lpCancelTouchLongPress();lpTouchLongPress.fired=false;lpTouchLongPress.suppressClickUntil=Date.now()+1200;lpMaskedTap.suppressClickUntil=Date.now()+1200;const st=window.__lpMapState;if(st&&st.__lpRenderId===renderId&&typeof st.__lpApplyFocus==="function"){try{st.__lpApplyFocus(loc);}catch(_){}}
try{if(modal&&modal.classList)modal.classList.add('lp-mobile-focus-preview');lpSyncMobileFocusZoomedClass(true);}catch(_){}
const href=el.getAttribute("href")||toAbsoluteUrl(loc);const rs=lpEnsureRevealState(loc,el.dataset.lpTitle||nodeTitle(graph,loc));if(rs&&(rs.running||rs.navTimerId))return true;if(lpRevealIsComplete(rs)){if(href)lpNavigate(href,loc);return true;}
return lpStartRevealNavigation(el,loc,{href,doneDelayMs:500,stepMs:105});}catch(_){return false;}};const lpResetMaskedTap=()=>{lpMaskedTap.pointerId=null;lpMaskedTap.startX=0;lpMaskedTap.startY=0;lpMaskedTap.t0=0;lpMaskedTap.moved=false;};const lpHandleTouchLongPressEnd=(e)=>{const fired=!!lpTouchLongPress.fired;lpClearTouchLongPressTimer();lpTouchLongPress.touchId=null;lpTouchLongPress.source="";if(fired){stopEvt(e);lpFinishLongPressVisual();}};if(el.dataset.lpTouchLongBound!=="1"){el.dataset.lpTouchLongBound="1";el.addEventListener("touchstart",(e)=>{if(!lpCanRunMobileLongPress())return;if(!e||!e.changedTouches||!e.changedTouches.length)return;if(e.touches&&e.touches.length>1){lpCancelTouchLongPress();return;}
const t=e.changedTouches[0];if(!t)return;lpStartTouchLongPress(t.clientX,t.clientY,"touch",t.identifier);},{passive:true});el.addEventListener("touchmove",(e)=>{if(!lpCanRunMobileLongPress())return;if(lpTouchLongPress.source!=="touch")return;if(lpTouchLongPress.fired)return;const t=lpFindTrackedTouch(e);if(!t)return;const dx=Math.abs((Number(t.clientX)||0)-lpTouchLongPress.startX);const dy=Math.abs((Number(t.clientY)||0)-lpTouchLongPress.startY);if(dx>LP_TOUCH_MOVE_TOL_PX||dy>LP_TOUCH_MOVE_TOL_PX)lpCancelTouchLongPress();},{passive:true});el.addEventListener("touchend",(e)=>{if(!lpCanRunMobileLongPress())return;if(lpTouchLongPress.source!=="touch")return;lpHandleTouchLongPressEnd(e);},true);el.addEventListener("touchcancel",(e)=>{if(!lpCanRunMobileLongPress())return;if(lpTouchLongPress.source!=="touch")return;lpHandleTouchLongPressEnd(e);},true);el.addEventListener("click",(e)=>{if(!lpCanRunMobileLongPress())return;const shouldBlock=Date.now()<(Number(lpTouchLongPress.suppressClickUntil)||0);if(!shouldBlock)return;stopEvt(e);lpTouchLongPress.fired=false;lpTouchLongPress.suppressClickUntil=0;},true);el.addEventListener("contextmenu",(e)=>{if(!lpCanRunMobileLongPress())return;stopEvt(e);},true);}
if(el.dataset.lpMaskedTapBound!=="1"){el.dataset.lpMaskedTapBound="1";el.addEventListener("pointerdown",(e)=>{try{if(!lpIsMobileMaskedNode())return;const pType=e&&e.pointerType?e.pointerType:"";if(pType&&pType==="mouse")return;lpMaskedTap.pointerId=e&&e.pointerId!=null?e.pointerId:null;lpMaskedTap.startX=Number(e&&e.clientX)||0;lpMaskedTap.startY=Number(e&&e.clientY)||0;lpMaskedTap.t0=performance.now();lpMaskedTap.moved=false;lpCancelTouchLongPress();}catch(_){}},{passive:true,capture:true});el.addEventListener("pointermove",(e)=>{try{if(!lpIsMobileMaskedNode())return;if(lpMaskedTap.pointerId==null||e.pointerId!==lpMaskedTap.pointerId)return;const dx=(Number(e.clientX)||0)-lpMaskedTap.startX;const dy=(Number(e.clientY)||0)-lpMaskedTap.startY;if((dx*dx+dy*dy)>(LP_TOUCH_MOVE_TOL_PX*LP_TOUCH_MOVE_TOL_PX))lpMaskedTap.moved=true;}catch(_){}},{passive:true,capture:true});el.addEventListener("pointerup",(e)=>{try{if(!lpIsMobileMaskedNode())return;const pType=e&&e.pointerType?e.pointerType:"";if(pType&&pType==="mouse")return;const samePointer=lpMaskedTap.pointerId==null||e.pointerId===lpMaskedTap.pointerId;const dt=performance.now()-(Number(lpMaskedTap.t0)||performance.now());const ok=samePointer&&!lpMaskedTap.moved&&dt<900;lpResetMaskedTap();if(!ok)return;lpRunMobileMaskedNodeNavigation(e);}catch(_){lpResetMaskedTap();}},{passive:false,capture:true});el.addEventListener("pointercancel",()=>{lpResetMaskedTap();},{passive:true,capture:true});el.addEventListener("click",(e)=>{try{if(!lpIsMobileMaskedNode())return;const shouldBlock=Date.now()<(Number(lpMaskedTap.suppressClickUntil)||0);if(shouldBlock){stopEvt(e);return;}
lpRunMobileMaskedNodeNavigation(e);}catch(_){}},{passive:false,capture:true});}
el.addEventListener("pointerenter",(e)=>{lpMarkLocalMapInteractionBusy(180);if(lpLocalWebgl3dHoverActive())lpRememberLocalWebgl3dHoverPoint(e);const st=window.__lpMapState;if(!st||st.__lpRenderId!==renderId)return;const pType=e&&e.pointerType?e.pointerType:"";if(pType&&pType!=="mouse")return;if(lpLocalWebgl3dHoverActive()){lpSetLocalWebgl3dHover(true);if(lpNodeShouldRunRevealPreview(el,loc)){const liveEl=lpRevealCurrentElement(loc,el)||el;lpStartRevealPreview(liveEl,loc);try{const engine=modal&&modal.__lpWebgl3dEngine;if(engine&&engine.kind==='local')lpWebgl3dDraw(engine);}catch(_){}}
return;}
if(lpIsDesktopLocalMapHover()){try{modal&&modal.classList&&modal.classList.add('lp-desktop-focus-preview');}catch(_){}
lpClearDesktopHoverInterference();if(lpDesktopHoverStable())return;}
if(typeof st.__lpApplyFocus==="function")st.__lpApplyFocus(loc);if(lpNodeShouldRunRevealPreview(el,loc)){lpStartRevealPreview(el,loc);}},{passive:true});el.addEventListener("pointermove",(e)=>{try{const pType=e&&e.pointerType?e.pointerType:"";if(pType&&pType!=="mouse")return;if(lpLocalWebgl3dHoverActive())lpRememberLocalWebgl3dHoverPoint(e);}catch(_){}},{passive:true});const maybeClear=(e)=>{lpMarkLocalMapInteractionBusy(160);if(lpLocalWebgl3dHoverActive())lpRememberLocalWebgl3dHoverPoint(e);if(lpLocalWebgl3dHoverActive()){lpSetLocalWebgl3dHover(false);return;}
const st=window.__lpMapState;try{const rs=lpEnsureRevealState(loc,(el&&el.dataset&&el.dataset.lpTitle)||nodeTitle(graph,loc));if(rs&&((rs.running&&rs.navigateOnDone)||rs.navTimerId))return;}catch(_){}
lpPauseRevealPlayback(loc,el);if(!st||st.__lpRenderId!==renderId)return;if(st.__lpHoverLoc===loc&&typeof st.__lpClearFocus==="function")st.__lpClearFocus();};el.addEventListener("pointerleave",maybeClear,{passive:true});el.addEventListener("pointercancel",maybeClear,{passive:true});if(el.dataset.lpUnvisited==="1"&&el.dataset.lpRevealBound!=="1"){el.dataset.lpRevealBound="1";el.addEventListener("click",(e)=>{try{const pType=e&&e.pointerType?e.pointerType:"";if(pType&&pType!=="mouse")return;if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;if(lpCanRunMobileLongPress()&&lpRunMobileMaskedNodeNavigation(e))return;stopEvt(e);lpPauseRevealPlayback(loc,el);const rs=lpEnsureRevealState(loc,el.dataset.lpTitle||nodeTitle(graph,loc));const href=el.getAttribute("href")||toAbsoluteUrl(loc);if(lpRevealIsComplete(rs)){if(href)lpNavigate(href,loc);return;}
lpStartRevealNavigation(el,loc,{href});}catch(_){}},true);}}
function applyBaseline(){if(st2.__lpRenderId!==renderId)return;try{const revealLoc=st2&&st2.__lpRevealFocusLoc;if(revealLoc&&!st2.__lpApplyingRevealFocus&&lpRevealNavIsActive(revealLoc)){lpScheduleRevealEdgeFocusRepaint(revealLoc,lpRevealCurrentElement(revealLoc,null));return;}}catch(_){}
__lpStopAllFlows();removeExtraFocusNodes();try{__lpHiClear();}catch(_){}
for(const el of edgeEls){el.classList.remove("lp-rel-anim");const typ=el.dataset.type||"prereq";el.style.removeProperty("filter");el.style.removeProperty("stroke-width");el.style.removeProperty("opacity");el.style.removeProperty("stroke");el.style.removeProperty("stroke-dasharray");el.style.removeProperty("stroke-dashoffset");if(typ==="related"){try{el.removeAttribute("marker-end");}catch(_){}
el.style.stroke=EDGE_DEFAULT;el.style.opacity="0.10";el.style.strokeWidth="1.7";el.style.strokeDasharray="6 6";el.style.strokeDashoffset="0";el.style.filter=lpEdgeDimFilter();}else{el.classList.add("lp-dim");setEdgeArrowPaint(el,EDGE_DEFAULT,0.10);el.style.stroke=EDGE_DEFAULT;el.style.opacity="0.10";el.style.strokeWidth="1.6";el.style.filter=lpEdgeDimFilter();}}
try{__lpHiUpdateMask();}catch(_){}
try{__lpSyncStaticHiEdges();}catch(_){}
for(const[loc,el]of nodeEls.entries()){lpApplyBaselineNodeVisual(el,loc);}
st2.__lpFocusedLoc=null;st2.__lpHoverLoc=null;}
function clearFocus(){try{const revealLoc=st2&&st2.__lpRevealFocusLoc;if(revealLoc&&lpRevealNavIsActive(revealLoc))return;}catch(_){}
lpClearRevealEdgeFocus();try{modal&&modal.classList&&modal.classList.remove('lp-mobile-focus-preview','lp-mobile-focus-zoomed','lp-desktop-focus-preview');}catch(_){}
applyBaseline();}
function applyFocus(loc){if(lpIsDesktopLocalMapHover()){try{modal&&modal.classList&&modal.classList.add('lp-desktop-focus-preview');}catch(_){}
lpClearDesktopHoverInterference();if(st2.__lpHoverLoc===loc&&st2.__lpFocusedLoc===loc)return;}
if(st2.__lpRenderId!==renderId)return;__lpStopAllFlows();removeExtraFocusNodes(loc);st2.__lpHoverLoc=loc;const locVisual=nodeVisual.get(loc)||lpMapVisualForLoc(loc);const locRec=getMastery(loc);const locMastery=(locRec&&typeof locRec.m==="number")?locRec.m:null;const isExpandable=(loc===cur)||!lpFogEnabled()||!!locVisual.visited||lpHasExplicitMastery(locRec,locMastery);const ctx=isExpandable?classifyDirectSets(loc):{pres:new Set(),deps:new Set(),rels:new Set()};const directCurEdges=lpDirectEdgesToCurrent(loc);const focusSet=new Set([loc,cur,...ctx.pres,...ctx.deps,...ctx.rels]);for(const e0 of directCurEdges){if(e0&&e0.from)focusSet.add(e0.from);if(e0&&e0.to)focusSet.add(e0.to);}
if(isExpandable)placeFocusExtras(loc,ctx);const keep=new Set();for(const n of focusSet){if(nodeEls.has(n)||focusExtra.nodes.has(n)||pos.has(n))keep.add(n);}
if(!isExpandable&&loc!==cur){applyBaseline();const curEl=nodeEls.get(cur);if(curEl){curEl.classList.add("lp-keep");curEl.style.opacity="1";curEl.style.filter=lpNodeVisualFilter(cur,0);}
const selfOnly=nodeEls.get(loc);if(selfOnly){selfOnly.classList.add("lp-focus","lp-keep");selfOnly.style.opacity="1";selfOnly.style.filter=lpNodeVisualFilter(loc,0);}
renderContextEdges(directCurEdges,loc,new Set([loc,cur]));st2.__lpFocusedLoc=loc;st2.__lpHoverLoc=loc;return;}
for(const[k,el]of nodeEls.entries()){el.style.color="";el.classList.remove("lp-focus","lp-dim","lp-keep");if(keep.has(k)){el.classList.add("lp-keep");el.style.opacity="1";el.style.filter=lpNodeVisualFilter(k,0);const visual=nodeVisual.get(k)||lpMapVisualForLoc(k);if(visual.mastered)el.style.color="";}else{lpApplyDimNodeVisual(el,k);}}
const self=nodeEls.get(loc);if(self){self.classList.add("lp-focus","lp-keep");self.style.opacity="1";self.style.filter=lpNodeVisualFilter(loc,0);}
for(const p of ctx.pres){const el=nodeEls.get(p);if(el)el.style.color=PRE_COLOR;}
for(const d of ctx.deps){const el=nodeEls.get(d);if(el)el.style.color=POST_COLOR;}
for(const r of ctx.rels){if(ctx.pres.has(r)||ctx.deps.has(r))continue;const el=nodeEls.get(r);if(el)el.style.color=REL_COLOR;}
const visibleContextEdgeMap=new Map();for(const e0 of[...(buildFocusContextEdges(loc,ctx)||[]),...directCurEdges]){const o=orientEdge(e0);if(!(o.from===loc||o.to===loc))continue;visibleContextEdgeMap.set(lpFocusEdgeKey(o),{from:o.from,to:o.to,type:o.type});}
const visibleContextEdges=Array.from(visibleContextEdgeMap.values());const visibleKeys=new Set(visibleContextEdges.map((e0)=>lpFocusEdgeKey(orientEdge(e0))));for(const el of edgeEls){const typ=el.dataset.type||"prereq";el.classList.remove("lp-rel-anim");const key=lpFocusEdgeKey({from:el.dataset.from,to:el.dataset.to,type:typ});const hiddenByHi=visibleKeys.has(key);el.style.opacity=hiddenByHi?"0":"0.10";el.style.strokeWidth="";el.style.filter=hiddenByHi?"none":lpEdgeDimFilter();if(typ==="related"){try{el.removeAttribute("marker-end");}catch(_){}
el.style.stroke=EDGE_DEFAULT;}else{setEdgeArrowPaint(el,EDGE_DEFAULT,hiddenByHi?0:0.10);el.style.stroke=EDGE_DEFAULT;}}
try{const staticHiEls=hiBaseG?hiBaseG.querySelectorAll('path.lp-static-hi-edge'):[];for(const p of staticHiEls){const key=lpFocusEdgeKey({from:p.dataset.from||'',to:p.dataset.to||'',type:p.dataset.type||'prereq'});p.style.opacity=visibleKeys.has(key)?'0':'';}}catch(_){}
renderContextEdges(visibleContextEdges,loc,keep);for(const[n,el]of focusExtra.nodes.entries())bindNodeInteractions(el,n);st2.__lpFocusedLoc=loc;}
st2.__lpClearFocus=clearFocus;st2.__lpApplyFocus=applyFocus;st2.__lpHoverLoc=null;applyBaseline();requestAnimationFrame(()=>{const st=window.__lpMapState;if(!st||st.__lpRenderId!==renderId)return;try{const revealLoc=st.__lpRevealFocusLoc;if(revealLoc&&lpRevealNavIsActive(revealLoc)){lpScheduleRevealEdgeFocusRepaint(revealLoc,lpRevealCurrentElement(revealLoc,null));return;}
if(st.__lpHoverLoc||st.__lpFocusedLoc)return;}catch(_){}
applyBaseline();});for(const[loc,el]of nodeEls.entries()){bindNodeInteractions(el,loc);}
const ctrlTargets=[(modal&&modal.querySelector)?modal.querySelector(".lp-mctrl"):null,(modal&&modal.querySelector)?modal.querySelector(".lp-mzoom"):null,].filter(Boolean);for(const ctrl of ctrlTargets){if(ctrl&&!ctrl.dataset.lpHoverClearBound){ctrl.dataset.lpHoverClearBound="1";const clearNow=()=>{const st=window.__lpMapState;if(st&&typeof st.__lpClearFocus==="function")st.__lpClearFocus();};ctrl.addEventListener("pointerenter",clearNow,{passive:true});ctrl.addEventListener("pointerdown",clearNow,{passive:true});}}
if(!stage.dataset.lpFocusBound){stage.dataset.lpFocusBound="1";stage.addEventListener("pointerleave",()=>{const st=window.__lpMapState;if(st&&typeof st.__lpClearFocus==="function")st.__lpClearFocus();});stage.addEventListener("pointerdown",(e)=>{const isMobile=__lpIsMobileMapModal();if(isMobile){try{const t=e&&e.target;if(t&&t.closest){if(t.closest("a.lp-node"))return;if(t.closest(".lp-mctrl"))return;if(t.closest(".lp-mzoom"))return;if(t.closest(".lp-close"))return;if(t.closest("[data-lp-fullscreen]"))return;}}catch(_){}}
const st=window.__lpMapState;if(st&&typeof st.__lpClearFocus==="function")st.__lpClearFocus();});}
const mathNodeEls=Array.from(nodeEls.values()).filter((el)=>{try{const titleEl=el&&el.querySelector?el.querySelector('.lp-node-title'):null;return lpNodeTitleNeedsTypeset(titleEl);}catch(_){return false;}});if(mathNodeEls.length)requestAnimationFrame(()=>{Promise.resolve().then(()=>typesetMathSafe(mathNodeEls.map((el)=>(el&&el.querySelector)?(el.querySelector('.lp-node-title')||el):el))).then(()=>{mathNodeEls.forEach((el)=>{try{lpCacheRenderedNodeTitle(graph,el);}catch(_){}});}).catch(()=>{});});modal.__lpRenderedFor=lpCanonKey(cur);modal.__lpRenderedGraph=graph||null;modal.__lpRenderedStageW=stageW;modal.__lpRenderedStageH=stageH;modal.__lpRenderedFogEnabled=lpFogEnabled();modal.__lpRenderedMasterySignature=lpCurrentMasterySignature();}
function ensureLocalMapModalUiStyles(){if(document.getElementById('lp-local-map-ui-style-v2'))return;const st=document.createElement('style');st.id='lp-local-map-ui-style-v2';st.textContent=`
      #lp-map-modal .lp-map-topbar{
        position:relative;
        z-index:4;
        padding:14px 18px 0;
        display:flex;
        flex-direction:column;
        align-items:flex-start;
        gap:10px;
        pointer-events:none;
      }
      #lp-map-modal .lp-map-toprow{
        display:flex;
        align-items:center;
        gap:10px;
        max-width:calc(100% - 0px);
        width:auto;
        pointer-events:auto;
      }
      #lp-map-modal .lp-map-tabs{
        display:inline-flex;
        align-items:center;
        gap:8px;
        max-width:calc(100% - 0px);
        padding:6px;
        border-radius:18px;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(7, 12, 24, .42);
        box-shadow:0 12px 24px rgba(0,0,0,.18);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        pointer-events:auto;
        overflow:auto hidden;
        scrollbar-width:none;
      }
      #lp-map-modal .lp-map-tabs::-webkit-scrollbar{ display:none; }
      #lp-map-modal .lp-map-tab{
        appearance:none;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(255,255,255,.04);
        color:rgba(255,255,255,.82);
        border-radius:14px;
        padding:9px 12px;
        min-height:40px;
        font:inherit;
        font-size:.76rem;
        font-weight:800;
        white-space:nowrap;
        cursor:pointer;
        pointer-events:auto;
      }
      #lp-map-modal .lp-map-tab.is-active{
        background:rgba(99,102,241,.18);
        color:rgba(255,255,255,.98);
        border-color:rgba(129,140,248,.32);
        box-shadow:inset 0 0 0 1px rgba(129,140,248,.18);
      }
      #lp-map-modal .lp-map-tipbtn{
        appearance:none;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(7, 12, 24, .42);
        color:rgba(255,255,255,.92);
        border-radius:999px;
        min-height:40px;
        padding:0 14px;
        display:inline-flex;
        align-items:center;
        gap:8px;
        font:inherit;
        font-size:.76rem;
        font-weight:800;
        cursor:pointer;
        box-shadow:0 12px 24px rgba(0,0,0,.18);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        pointer-events:auto;
      }
      #lp-map-modal .lp-map-tipbtn-icon{
        width:1.1rem;
        height:1.1rem;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        font-size:1rem;
        font-weight:900;
        line-height:1;
      }
      #lp-map-modal.lp-map-tip-phone .lp-map-tipbtn{ padding:0; width:40px; min-width:40px; justify-content:center; }
      #lp-map-modal.lp-map-tip-phone .lp-map-tipbtn-text{ display:none; }
      #lp-map-modal .lp-map-helper{
        display:block;
        width:fit-content;
        max-width:min(720px, calc(100% - 0px));
        border-radius:16px;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(7, 12, 24, .42);
        color:rgba(255,255,255,.92);
        padding:10px 14px;
        font-size:clamp(.72rem, .78vw, .84rem);
        line-height:1.28;
        box-shadow:0 12px 24px rgba(0,0,0,.18);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        pointer-events:auto;
      }
      #lp-map-modal .lp-map-helper[hidden]{ display:none !important; }

      html[data-md-color-scheme="default"] #lp-map-modal .lp-map-tabs,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-map-tabs,
      html[data-md-color-scheme="default"] #lp-map-modal .lp-map-tipbtn,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-map-tipbtn{
        border-color: rgba(15,23,42,.12);
        background: rgba(255,255,255,.96);
        color: rgba(15,23,42,.88);
        box-shadow: 0 10px 22px rgba(15,23,42,.12);
      }
      html[data-md-color-scheme="default"] #lp-map-modal .lp-map-tab,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-map-tab{
        border-color: rgba(15,23,42,.10);
        background: rgba(255,255,255,.72);
        color: rgba(15,23,42,.72);
      }
      html[data-md-color-scheme="default"] #lp-map-modal .lp-map-tab.is-active,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-map-tab.is-active{
        background: rgba(79,70,229,.12);
        color: rgba(15,23,42,.94);
        border-color: rgba(79,70,229,.18);
        box-shadow: inset 0 0 0 1px rgba(79,70,229,.10);
      }
      html[data-md-color-scheme="default"] #lp-map-modal .lp-map-helper,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-map-helper{
        border-color: rgba(15,23,42,.12);
        background: rgba(255,255,255,.96);
        color: rgba(15,23,42,.92);
        box-shadow: 0 10px 22px rgba(15,23,42,.12);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      #lp-map-modal .lp-map-dir-menu{ display:none !important; }

      @media (max-width: 720px){
        #lp-map-modal .lp-map-topbar{ padding:14px 14px 0; gap:8px; }
        #lp-map-modal .lp-map-toprow{ width:calc(100vw - 28px); justify-content:space-between; }
        #lp-map-modal .lp-map-tabs{ max-width:calc(100vw - 82px); }
        #lp-map-modal .lp-map-helper{ font-size:.8rem; max-width:calc(100vw - 28px); }
        #lp-map-modal .lp-map-tab{ font-size:.72rem; padding:8px 11px; min-height:38px; }
      }
    `;document.head.appendChild(st);}
function lpLocalMapOpenRouteFromMenu(mode,graph,modal){const root=modal||document.getElementById('lp-map-modal');if(!root)return;const targetLoc=root.__lpDirMenuAnchorLoc||currentRelPath();lpLocalMapHideDirectionMenu(root);hideLocalMapModal();if(lpRouteMapMode(mode)===LP_ROUTE_MAP_MODE.FROM_HERE)showH1StudyDependentsModal(graph,targetLoc);else showH1StudyStartModal(graph,targetLoc,LP_ROUTE_MAP_MODE.TO_HERE);}
let lpFocusedMap=null;let lpMapReturnFocus=null;let lpMapKeyboardBound=false;function lpMapFocusable(modal){return Array.from(modal.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')).filter((el)=>!el.disabled&&el.tabIndex>=0&&!el.closest('[hidden], [aria-hidden="true"]')&&el.getClientRects().length>0&&window.getComputedStyle(el).visibility!=='hidden');}
function lpMapFocusOpen(modal){if(lpFocusedMap!==modal){const active=document.activeElement;if(active&&!active.closest('#lp-map-modal, #lp-h1sg-modal'))lpMapReturnFocus=active;}
lpFocusedMap=modal;if(!lpMapKeyboardBound){lpMapKeyboardBound=true;document.addEventListener('keydown',(event)=>{const host=lpFocusedMap;if(!host||!host.isConnected||!host.classList.contains('lp-open'))return;const otherDialog=event.target&&event.target.closest&&event.target.closest('[role="dialog"][aria-modal="true"]');if(otherDialog&&!host.contains(otherDialog))return;const tab=event.target&&event.target.closest&&event.target.closest('[data-lp-map-tab]');if(tab&&host.contains(tab)&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){const tabs=Array.from(host.querySelectorAll('[data-lp-map-tab]')).filter((el)=>!el.disabled);const index=tabs.indexOf(tab);const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;event.preventDefault();tabs[next].click();return;}
if(event.key!=='Tab')return;const controls=lpMapFocusable(host);const activeIndex=controls.indexOf(document.activeElement);if(activeIndex<0||(event.shiftKey&&activeIndex===0)||(!event.shiftKey&&activeIndex===controls.length-1)){event.preventDefault();const target=event.shiftKey?controls[controls.length-1]:controls[0];if(target)target.focus({preventScroll:true});}},true);}
const controls=lpMapFocusable(modal);const selected=controls.find((el)=>el.getAttribute('aria-selected')==='true');const target=selected||controls[0];if(target)target.focus({preventScroll:true});}
function lpMapFocusClose(modal){if(lpFocusedMap!==modal)return;lpFocusedMap=null;const target=lpMapReturnFocus;lpMapReturnFocus=null;if(target&&target.isConnected&&target.getClientRects().length)target.focus({preventScroll:true});}
function ensureMapModal(graph){let modal=document.getElementById("lp-map-modal");ensureLocalMapModalUiStyles();if(!modal){modal=document.createElement("div");modal.id="lp-map-modal";modal.setAttribute("aria-hidden","true");modal.style.display="none";try{modal.style.setProperty("z-index",String(LP_MAP_MODAL_Z),"important");}catch(_){}
modal.innerHTML=`
      <div class="lp-mbox" role="dialog" aria-modal="true" aria-label="Concept maps">
        <button class="lp-full" type="button" aria-label="Fullscreen" data-lp-fullscreen>⤢</button>
        <button class="lp-close" type="button" aria-label="Close">✕</button>
        <div class="lp-map-topbar">
          <div class="lp-map-toprow">
            <div class="lp-map-tabs" role="tablist" aria-label="Map views">
              <button type="button" class="lp-map-tab" data-lp-map-tab="toHere" role="tab" aria-selected="false"><span class="lp-tab-label-long">Prerequisites</span><span class="lp-tab-label-short">Prerequisites</span></button>
              <button type="button" class="lp-map-tab" data-lp-map-tab="local" role="tab" aria-selected="true"><span class="lp-tab-label-long">Nearby</span><span class="lp-tab-label-short">Nearby</span></button>
              <button type="button" class="lp-map-tab" data-lp-map-tab="fromHere" role="tab" aria-selected="false"><span class="lp-tab-label-long">Dependents</span><span class="lp-tab-label-short">Dependents</span></button>
            </div>
            <button type="button" class="lp-map-tipbtn" data-lp-map-tip-toggle aria-expanded="false">
              <span class="lp-map-tipbtn-icon" aria-hidden="true">i</span>
              <span class="lp-map-tipbtn-text">Map tips</span>
            </button>
          </div>
          <div class="lp-map-context">
            <button class="lp-btn lp-map-fit" type="button" data-lp-map-fit aria-label="Fit all map nodes in view" title="Zoom out until every concept fits on screen"><svg class="lp-map-fit-ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2 5.6V2h3.6M14 5.6V2h-3.6M2 10.4V14h3.6M14 10.4V14h-3.6"/></svg><span class="lp-map-fit-txt">Fit all</span></button>
            <div class="lp-map-context-copy" role="status" aria-live="polite" aria-atomic="true">
              <span data-lp-map-context>Drag to explore nearby concepts.</span>
              <span class="lp-map-context-note" data-lp-map-fit-status hidden></span>
            </div>
          </div>
          <div class="lp-map-helper" data-lp-map-helper-panel hidden></div>
        </div>
        <div class="lp-mbody">
          <div class="lp-mapstage">
            <div class="lp-mapviewport" data-map-viewport></div>
            <div class="lp-map-dir-menu" data-lp-map-dir-menu hidden>
              <button class="lp-map-dir-btn" type="button" data-lp-map-dir="toHere">To here</button>
              <button class="lp-map-dir-btn" type="button" data-lp-map-dir="fromHere">From here</button>
            </div>
          </div>
        </div>
        <div class="lp-mzoom">
          <div class="lp-ctrl-group lp-zoombar lp-zoomctrl" data-ctrl-zoom>
            <button class="lp-btn lp-zoom-dec" type="button" aria-label="Zoom out" title="Zoom out" data-zoom-dec>-</button>
            <input class="lp-zoomrange lp-zoom-range" type="range" min="30" max="200" step="1" value="100" aria-label="Zoom" data-zoom-range>
            <div class="lp-hop lp-zoom-label" data-zoom-label>100%</div>
            <button class="lp-btn lp-zoom-inc" type="button" aria-label="Zoom in" title="Zoom in" data-zoom-inc>+</button>
            <button class="lp-btn lp-zoom-reset" type="button" aria-label="Reset zoom" title="Reset zoom" data-zoom-reset>Reset</button>
          </div>
        </div>
      </div>
    `;document.body.appendChild(modal);lpInstallBlankLongPressSelectionGuard(modal);modal.__lpOpen=()=>showLocalMapModal(graph);modal.addEventListener("click",(e)=>{const tab=e.target&&e.target.closest?e.target.closest('[data-lp-map-tab]'):null;if(!tab)return;e.preventDefault();e.stopPropagation();const kind=tab.getAttribute('data-lp-map-tab')||'local';if(kind==='local'){lpSyncMapTabs(modal,'local');lpMapTipsCollapse(modal);return;}
lpMapTipsCollapse(modal);lpOpenMapTab(kind,window.__lpLearningPathGraph||graph||null);});const localTipBtn=modal.querySelector('[data-lp-map-tip-toggle]');if(localTipBtn){lpBindTap(localTipBtn,(e)=>{if(e&&e.preventDefault)e.preventDefault();lpMapTipsToggle(modal);});}
lpMapTipsSet(modal,'local');lpMapTipsCollapse(modal);lpBindTap(modal.querySelector(".lp-close"),()=>{hideLocalMapModal();});lpBindTap(modal.querySelector("[data-lp-fullscreen]"),()=>{if(window.__lpMapState&&typeof window.__lpMapState.__lpClearFocus==="function"){window.__lpMapState.__lpClearFocus();}
const isOn=modal.classList.toggle("lp-full");const btn=modal.querySelector("[data-lp-fullscreen]");if(btn)lpSetFullscreenIcon(btn,isOn);const st=window.__lpMapState||(window.__lpMapState={scale:lpMapDefaultActualScale(),tx:0,ty:0});st.__lpForceCenter=true;st.userMoved=false;const isDesktopFine=!!(window.matchMedia&&window.matchMedia("(pointer: fine)").matches);if(isDesktopFine){if(typeof __lpStopAllFlows==="function"){try{__lpStopAllFlows();}catch(_){}}
st.__lpForceCenter=true;st.userMoved=false;renderLocalMapModal(graph);requestAnimationFrame(()=>{if(modal.style.display==="none")return;st.__lpForceCenter=true;st.userMoved=false;renderLocalMapModal(graph);requestAnimationFrame(()=>{if(modal.style.display==="none")return;st.__lpForceCenter=true;st.userMoved=false;renderLocalMapModal(graph);});});return;}
const DURATION=230;const start=performance.now();let lastPaint=0;const MIN_FRAME_MS=1000/30;function tick(now){if(modal.style.display==="none")return;if((now-lastPaint)>=MIN_FRAME_MS||(now-start)>=DURATION){lastPaint=now;st.__lpForceCenter=true;st.userMoved=false;renderLocalMapModal(graph);}
if((now-start)<DURATION){requestAnimationFrame(tick);}else{st.__lpForceCenter=true;st.userMoved=false;renderLocalMapModal(graph);}}
requestAnimationFrame(tick);});modal.addEventListener('pointerdown',(e)=>{if(!modal.classList.contains('lp-open'))return;const t=e.target;if(!(t&&t.closest))return;if(t.closest('[data-lp-map-dir-menu]'))return;if(t.closest('a.lp-node.is-cur'))return;lpLocalMapHideDirectionMenu(modal);},true);modal.addEventListener('click',(e)=>{const t=e.target;const dirBtn=t&&t.closest?t.closest('[data-lp-map-dir]'):null;if(dirBtn){e.preventDefault();e.stopPropagation();lpLocalMapOpenRouteFromMenu(dirBtn.getAttribute('data-lp-map-dir')||LP_ROUTE_MAP_MODE.TO_HERE,graph,modal);return;}
const curNode=lpStrictNodeFromEvent(modal,e,'#lp-map-modal a.lp-node.is-cur[href]')||(function(){const pt=lpEventPoint(e);return pt?lpNodeFromPoint(modal,pt.x,pt.y,'#lp-map-modal a.lp-node.is-cur[href]'):null;})()||(t&&t.closest?t.closest('#lp-map-modal a.lp-node.is-cur[href]'):null);if(!curNode)return;if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;if(e.cancelable)e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();lpLocalMapShowDirectionMenu(modal,curNode);},true);modal.addEventListener("click",(e)=>{if(e.target===modal)hideLocalMapModal();});window.addEventListener("keydown",(e)=>{if(e.isComposing||e.keyCode===229)return;if(e.key==="Escape"&&modal.style.display!=="none"){const menu=modal.querySelector('[data-lp-map-dir-menu]');if(menu&&!menu.hidden){lpLocalMapHideDirectionMenu(modal);return;}
hideLocalMapModal();}});}
if(modal.__lpBound)return modal;modal.__lpBound=true;const backLabel=modal.querySelector("[data-back-label]");const fwdLabel=modal.querySelector("[data-fwd-label]");const btnBackDec=modal.querySelector("[data-back-dec]");const btnBackInc=modal.querySelector("[data-back-inc]");const btnFwdDec=modal.querySelector("[data-fwd-dec]");const btnFwdInc=modal.querySelector("[data-fwd-inc]");function clamp012(x){const n=Number(x);if(!isFinite(n))return 1;return Math.max(0,Math.min(2,n));}
function hopVal(x){const n=Number(x);return isFinite(n)?n:1;}
function forceRecenter(){if(window.__lpMapState){window.__lpMapState.__lpForceCenter=true;window.__lpMapState.userMoved=false;}}
function syncLabels(){if(typeof window.__lpHopBack!=="number")window.__lpHopBack=1;if(typeof window.__lpHopFwd!=="number")window.__lpHopFwd=1;window.__lpHopBack=clamp012(window.__lpHopBack);window.__lpHopFwd=clamp012(window.__lpHopFwd);window.__lpHop=window.__lpHopBack;if(backLabel)backLabel.textContent=`Prerequisites ${window.__lpHopBack}`;if(fwdLabel)fwdLabel.textContent=`Dependents ${window.__lpHopFwd}`;}
lpBindTap(btnBackDec,()=>{if(window.__lpMapState&&typeof window.__lpMapState.__lpClearFocus==="function")window.__lpMapState.__lpClearFocus();window.__lpHopBack=clamp012(hopVal(window.__lpHopBack)-1);syncLabels();forceRecenter();renderLocalMapModal(graph);});lpBindTap(btnBackInc,()=>{if(window.__lpMapState&&typeof window.__lpMapState.__lpClearFocus==="function")window.__lpMapState.__lpClearFocus();window.__lpHopBack=clamp012(hopVal(window.__lpHopBack)+1);syncLabels();forceRecenter();renderLocalMapModal(graph);});lpBindTap(btnFwdDec,()=>{if(window.__lpMapState&&typeof window.__lpMapState.__lpClearFocus==="function")window.__lpMapState.__lpClearFocus();window.__lpHopFwd=clamp012(hopVal(window.__lpHopFwd)-1);syncLabels();forceRecenter();renderLocalMapModal(graph);});lpBindTap(btnFwdInc,()=>{if(window.__lpMapState&&typeof window.__lpMapState.__lpClearFocus==="function")window.__lpMapState.__lpClearFocus();window.__lpHopFwd=clamp012(hopVal(window.__lpHopFwd)+1);syncLabels();forceRecenter();renderLocalMapModal(graph);});const relToggle=modal.querySelector("[data-rel-toggle]");function normRelMode(m){const s=String(m||"dim").toLowerCase();if(s==="off"||s==="0"||s==="false"||s==="none")return"off";if(s==="all"||s==="full")return"all";return"dim";}
function nextRelMode(m){const s=normRelMode(m);if(s==="off")return"dim";if(s==="dim")return"all";return"off";}
function syncRelLabel(){if(typeof window.__lpRelMode==="undefined")window.__lpRelMode="dim";window.__lpRelMode=normRelMode(window.__lpRelMode);if(!relToggle)return;const m=window.__lpRelMode;relToggle.textContent=(m==="off")?"Related off":(m==="all"?"Related all":"Related dim");relToggle.dataset.lpRelMode=m;relToggle.setAttribute("aria-pressed",m==="off"?"false":"true");}
lpBindTap(relToggle,()=>{if(window.__lpMapState&&typeof window.__lpMapState.__lpClearFocus==="function")window.__lpMapState.__lpClearFocus();window.__lpRelMode=nextRelMode(window.__lpRelMode);syncRelLabel();forceRecenter();renderLocalMapModal(graph);});const vp=modal.querySelector("[data-map-viewport]");try{if(vp){vp.style.touchAction="none";vp.style.webkitUserSelect="none";vp.style.userSelect="none";}}catch(_){}
const zoomLabel=modal.querySelector("[data-zoom-label]");const zoomRange=modal.querySelector("[data-zoom-range]");const btnZoomDec=modal.querySelector("[data-zoom-dec]");const btnZoomInc=modal.querySelector("[data-zoom-inc]");if(!window.__lpMapState)window.__lpMapState={scale:lpMapDefaultActualScale(),tx:0,ty:0};const st=window.__lpMapState;function centerView(){if(typeof st.__lpStageW==="number"&&typeof st.__lpStageH==="number"){const safe=lpLocalMapSafeInsets(modal,st.__lpStageW,st.__lpStageH);const centerX=Number.isFinite(safe.centerX)?safe.centerX:(st.__lpStageW/2);const centerY=Number.isFinite(safe.centerY)?safe.centerY:(st.__lpStageH/2);const target=lpLocalMapPreferredTargetPoint(modal,st);st.tx=centerX-((Number(target.x)||0)*st.scale);st.ty=centerY-((Number(target.y)||0)*st.scale);return;}
st.tx=0;st.ty=0;}
function clampPan(){if(!vp)return;const scale=Number(st.scale)||1;const stageW=Number(st.__lpStageW)||(modal.querySelector(".lp-mapstage")?.clientWidth||0);const stageH=Number(st.__lpStageH)||(modal.querySelector(".lp-mapstage")?.clientHeight||0);const worldW=Number(st.__lpWorldW)||(vp.style.width?Number(String(vp.style.width).replace("px","")):0)||(vp.getBoundingClientRect?vp.getBoundingClientRect().width:0);const worldH=Number(st.__lpWorldH)||(vp.style.height?Number(String(vp.style.height).replace("px","")):0)||(vp.getBoundingClientRect?vp.getBoundingClientRect().height:0);if(!isFinite(stageW)||!isFinite(stageH)||stageW<=0||stageH<=0)return;if(!isFinite(worldW)||!isFinite(worldH)||worldW<=0||worldH<=0)return;const scaledW=worldW*scale;const scaledH=worldH*scale;const minTx=lpMapPanKeep(scaledW,stageW)-scaledW;const maxTx=stageW-lpMapPanKeep(scaledW,stageW);const minTy=lpMapPanKeep(scaledH,stageH)-scaledH;const maxTy=stageH-lpMapPanKeep(scaledH,stageH);st.tx=Math.min(maxTx,Math.max(minTx,Number(st.tx)||0));st.ty=Math.min(maxTy,Math.max(minTy,Number(st.ty)||0));}
function lpLocalMapPerfActive(){try{return!!(modal&&modal.classList&&modal.classList.contains("lp-opera-map-perf"));}catch(_){return false;}}
function lpLocalMapTouchCompositorActive(){try{return!!(lpLocalMapPerfActive()||__lpIsMobileMapModal()||__lpIsIPadLikeTouch()||lpMapDocSurfaceIsTouch()||(modal&&modal.classList&&modal.classList.contains("lp-touch-compositor")));}catch(_){return lpLocalMapPerfActive();}}
function lpLocalMapLiveGestureFast(){try{return!!(lpLocalMapTouchCompositorActive()||isTouchGestureDevice());}catch(_){return lpLocalMapTouchCompositorActive();}}
function applyTransform(opts){if(!vp)return;const skipRangeSync=!!(opts&&opts.skipRangeSync);const skipClamp=!!(opts&&opts.skipClamp);const syncZoomRange=!!(opts&&opts.syncZoomRange);const perfMode=lpLocalMapPerfActive();if(!skipClamp)clampPan();const tx=Number(st.tx)||0;const ty=Number(st.ty)||0;const sc=Number(st.scale)||1;const useCompositorTransform=lpLocalMapTouchCompositorActive()||!!(modal&&modal.classList&&modal.classList.contains("lp-map-dragging"));const transformText=lp3dViewportTransform(modal,'local',tx,ty,sc,useCompositorTransform);const useProxy=!!(st.__lpZoomDragging&&st.__lpUseZoomProxy&&st.__lpZoomProxy&&st.__lpZoomProxy.isConnected);const target=useProxy?st.__lpZoomProxy:vp;if(target&&target.style.transform!==transformText)target.style.transform=transformText;const labelText=`${lpMapDisplayPctFromScale(sc)}%`;if(zoomLabel&&zoomLabel.textContent!==labelText){if(!perfMode||!skipRangeSync){zoomLabel.textContent=labelText;}else{const now=(typeof performance!=="undefined"&&performance.now)?performance.now():Date.now();if(!st.__lpLastOperaZoomLabelAt||now-st.__lpLastOperaZoomLabelAt>140){st.__lpLastOperaZoomLabelAt=now;zoomLabel.textContent=labelText;}}}
if(zoomRange&&(!skipRangeSync||syncZoomRange)&&!st.__lpZoomDragging){const v=lpMapDisplayPctFromScale(sc);const nextValue=String(Math.min(LP_MAP_ZOOM_MAX_PCT,Math.max(LP_MAP_ZOOM_MIN_PCT,v)));if(zoomRange.value!==nextValue)zoomRange.value=nextValue;lpUpdateZoomRangeVisual(zoomRange,Number(nextValue),LP_MAP_ZOOM_MIN_PCT,LP_MAP_ZOOM_MAX_PCT,v);}else if(zoomRange&&(!skipRangeSync||syncZoomRange)){lpUpdateZoomRangeVisual(zoomRange,Number(zoomRange.value||100),LP_MAP_ZOOM_MIN_PCT,LP_MAP_ZOOM_MAX_PCT,lpMapDisplayPctFromScale(sc));}}
function applyTransformFast(opts){if(!vp)return;const skipClamp=!!(opts&&opts.skipClamp);if(!skipClamp)clampPan();const tx=Number(st.tx)||0;const ty=Number(st.ty)||0;const sc=Number(st.scale)||1;const transformText=lp3dViewportTransform(modal,'local',tx,ty,sc,true);const useProxy=!!(st.__lpZoomDragging&&st.__lpUseZoomProxy&&st.__lpZoomProxy&&st.__lpZoomProxy.isConnected);const target=useProxy?st.__lpZoomProxy:vp;if(target&&target.style.transform!==transformText)target.style.transform=transformText;}
let __lpTransformRaf=0;let __lpTransformSkipRangeSync=false;let __lpTransformSkipClamp=false;let __lpTransformSyncZoomRange=false;function scheduleTransform(opts){__lpTransformSkipRangeSync=__lpTransformSkipRangeSync||!!(opts&&opts.skipRangeSync);__lpTransformSkipClamp=__lpTransformSkipClamp||!!(opts&&opts.skipClamp);__lpTransformSyncZoomRange=__lpTransformSyncZoomRange||!!(opts&&opts.syncZoomRange);if(__lpTransformRaf)return;__lpTransformRaf=requestAnimationFrame(()=>{__lpTransformRaf=0;const skipRangeSync=__lpTransformSkipRangeSync;const skipClamp=__lpTransformSkipClamp;const syncZoomRange=__lpTransformSyncZoomRange;__lpTransformSkipRangeSync=false;__lpTransformSkipClamp=false;__lpTransformSyncZoomRange=false;applyTransform({skipRangeSync,skipClamp,syncZoomRange});});}
let __lpGestureRestoreTimer=0;let __lpGestureRestoreRaf=0;function clearMobileGestureRestore(){try{if(__lpGestureRestoreTimer)window.clearTimeout(__lpGestureRestoreTimer);}catch(_){}
try{if(__lpGestureRestoreRaf)window.cancelAnimationFrame(__lpGestureRestoreRaf);}catch(_){}
__lpGestureRestoreTimer=0;__lpGestureRestoreRaf=0;}
function setMobileGestureMode(on,opts){try{if(!__lpIsMobileMapModal()&&!__lpIsIPadLikeTouch()&&!lpLocalMapPerfActive()&&!lpMapDocSurfaceIsTouch()&&!(modal&&modal.classList&&modal.classList.contains("lp-touch-compositor")))return;const immediate=!!(opts&&opts.immediate);clearMobileGestureRestore();if(on){modal.classList.add('lp-mobile-gesturing');return;}
if(immediate){modal.classList.remove('lp-mobile-gesturing');return;}
__lpGestureRestoreTimer=window.setTimeout(()=>{__lpGestureRestoreTimer=0;__lpGestureRestoreRaf=requestAnimationFrame(()=>{__lpGestureRestoreRaf=0;const pointersStillActive=activePtrs&&typeof activePtrs.size==='number'?activePtrs.size>0:false;if(dragging||pendingNodeDrag||pinch||pointersStillActive)return;modal.classList.remove('lp-mobile-gesturing');});},120);}catch(_){}}
modal.__lpApplyTransform=applyTransform;function getStageCenter(){if(typeof st.__lpStageW==="number"&&typeof st.__lpStageH==="number"){return{x:st.__lpStageW/2,y:st.__lpStageH/2};}
const stage=modal.querySelector(".lp-mapstage");if(stage){const r=stage.getBoundingClientRect();return{x:r.width/2,y:r.height/2};}
return{x:0,y:0};}
function zoomAboutScreenPoint(nextScale,anchor,opts){if(!vp)return;const oldScale=Number(st.scale)||1;const clamped=Math.min(lpMapMaxActualScale(),Math.max(lpMapMinActualScale(),Number(nextScale)||oldScale));if(!isFinite(clamped)||clamped===oldScale)return;const a=anchor||getStageCenter();const ax=Number(a.x)||0;const ay=Number(a.y)||0;const wx=(ax-st.tx)/oldScale;const wy=(ay-st.ty)/oldScale;st.scale=clamped;st.tx=ax-wx*clamped;st.ty=ay-wy*clamped;if(opts&&opts.defer)scheduleTransform({skipRangeSync:!!opts.skipRangeSync,skipClamp:!!opts.skipClamp});else applyTransform({skipRangeSync:!!(opts&&opts.skipRangeSync),skipClamp:!!(opts&&opts.skipClamp)});}
function clearHoverNow(){if(!st)return;if(!st.__lpHoverLoc&&!st.__lpFocusedLoc)return;if(typeof st.__lpClearFocus==="function")st.__lpClearFocus();}
function setSliderZoomDragMode(on){try{if(!modal)return;modal.classList.toggle("lp-slider-zooming",!!on);}catch(_){}}
function markGestureScale(){try{st.__lpGestureScale0=Number(st.scale)||1;}catch(_){}}
let __lpPostZoomRestoreTimer=0;let __lpPostZoomRestoreRaf=0;function schedulePostZoomRestore(){try{if(__lpPostZoomRestoreTimer)window.clearTimeout(__lpPostZoomRestoreTimer);if(__lpPostZoomRestoreRaf)window.cancelAnimationFrame(__lpPostZoomRestoreRaf);}catch(_){}
__lpPostZoomRestoreTimer=window.setTimeout(()=>{__lpPostZoomRestoreTimer=0;__lpPostZoomRestoreRaf=requestAnimationFrame(()=>{__lpPostZoomRestoreRaf=0;if(!modal||!modal.classList.contains("lp-open"))return;const pointersStillActive=activePtrs&&typeof activePtrs.size==="number"?activePtrs.size>0:false;if(dragging||pendingNodeDrag||pinch||st.__lpZoomDragging||pointersStillActive)return;if(lpLocalMapPointerHeld()){schedulePostZoomRestore();return;}
try{modal.classList.remove("lp-mobile-gesturing","lp-slider-zooming");}catch(_){}
const avoidPostGestureRender=lpLocalMapLiveGestureFast();const scale0=Number(st.__lpGestureScale0);const scaleUnchanged=Number.isFinite(scale0)&&Math.abs((Number(st.scale)||1)-scale0)<1e-6;st.__lpGestureScale0=null;if(!avoidPostGestureRender&&!scaleUnchanged){try{renderLocalMapModal(graph);}catch(_){}}});},lpLocalMapLiveGestureFast()?180:34);}
if(zoomRange&&!zoomRange.dataset.lpBound){zoomRange.dataset.lpBound="1";function __lpRemoveZoomProxy(){try{const proxy=st.__lpZoomProxy;if(proxy&&proxy.parentNode)proxy.parentNode.removeChild(proxy);}catch(_){}
try{if(vp)vp.classList.remove("lp-zoom-proxy-source");}catch(_){}
st.__lpZoomProxy=null;}
let __lpZoomInputRaf=0;let __lpZoomInputValue=null;let __lpZoomPointerHeld=false;const __lpBeginZoomDrag=(e)=>{__lpZoomPointerHeld=true;lpMarkLocalMapInteractionBusy(360);clearHoverNow();markGestureScale();st.__lpZoomDragging=true;setSliderZoomDragMode(true);try{st.__lpZoomAnchor=getStageCenter();}catch(_){st.__lpZoomAnchor=null;}
st.__lpUseZoomProxy=false;__lpRemoveZoomProxy();if(e&&typeof e.stopPropagation==="function")e.stopPropagation();};const __lpFlushZoomInput=(opts)=>{__lpZoomInputRaf=0;const v=Number(__lpZoomInputValue!=null?__lpZoomInputValue:zoomRange.value)||100;const anchor=st.__lpZoomAnchor||getStageCenter();const oldScale=Number(st.scale)||1;const nextScale=Math.min(lpMapMaxActualScale(),Math.max(lpMapMinActualScale(),lpMapScaleFromDisplayPct(v)));if(Number.isFinite(nextScale)&&nextScale!==oldScale){const ax=Number(anchor&&anchor.x)||0;const ay=Number(anchor&&anchor.y)||0;const wx=(ax-(Number(st.tx)||0))/oldScale;const wy=(ay-(Number(st.ty)||0))/oldScale;st.scale=nextScale;st.tx=ax-wx*nextScale;st.ty=ay-wy*nextScale;}
st.userMoved=true;if(opts&&opts.forceFinal)applyTransform({skipRangeSync:true,skipClamp:false});else applyTransformFast({skipClamp:true});};zoomRange.addEventListener("input",(e)=>{lpMarkLocalMapInteractionBusy(240);__lpZoomInputValue=Number(zoomRange.value)||100;lpUpdateZoomRangeVisual(zoomRange,__lpZoomInputValue,LP_MAP_ZOOM_MIN_PCT,LP_MAP_ZOOM_MAX_PCT);if(zoomLabel)zoomLabel.textContent=`${Math.round(__lpZoomInputValue)}%`;if(!__lpZoomInputRaf){__lpZoomInputRaf=requestAnimationFrame(()=>{__lpZoomInputRaf=0;__lpFlushZoomInput({live:true});});}
e.stopPropagation();},{passive:true});const __lpEndZoomDrag=(e,closing=false)=>{if(e&&e.type==="change"&&__lpZoomPointerHeld)return;__lpZoomPointerHeld=false;lpMarkLocalMapInteractionBusy(180);if(__lpZoomInputRaf){try{cancelAnimationFrame(__lpZoomInputRaf);}catch(_){}
__lpZoomInputRaf=0;__lpFlushZoomInput({forceFinal:true});}
st.__lpZoomDragging=false;st.__lpUseZoomProxy=false;__lpZoomInputValue=null;st.__lpZoomAnchor=null;__lpRemoveZoomProxy();applyTransform();setSliderZoomDragMode(false);if(!closing)schedulePostZoomRestore();};modal.__lpStopZoomGesture=()=>{if(__lpPostZoomRestoreTimer)window.clearTimeout(__lpPostZoomRestoreTimer);if(__lpPostZoomRestoreRaf)window.cancelAnimationFrame(__lpPostZoomRestoreRaf);__lpPostZoomRestoreTimer=0;__lpPostZoomRestoreRaf=0;if(__lpZoomPointerHeld||st.__lpZoomDragging||__lpZoomInputRaf)__lpEndZoomDrag(null,true);};zoomRange.addEventListener("pointerdown",__lpBeginZoomDrag,{passive:true});zoomRange.addEventListener("pointerup",__lpEndZoomDrag,{passive:true});zoomRange.addEventListener("pointercancel",__lpEndZoomDrag,{passive:true});zoomRange.addEventListener("touchstart",__lpBeginZoomDrag,{passive:true});zoomRange.addEventListener("touchend",__lpEndZoomDrag,{passive:true});zoomRange.addEventListener("touchcancel",__lpEndZoomDrag,{passive:true});zoomRange.addEventListener("change",__lpEndZoomDrag,{passive:true});}
const ZOOM_BTN_STEP=0.1;lpBindTap(btnZoomDec,()=>{clearHoverNow();zoomAboutScreenPoint((Number(st.scale)||1)-lpMapZoomStepActualScale(),getStageCenter());st.userMoved=true;});lpBindTap(btnZoomInc,()=>{clearHoverNow();zoomAboutScreenPoint((Number(st.scale)||1)+lpMapZoomStepActualScale(),getStageCenter());st.userMoved=true;});lpBindTap(modal.querySelector("[data-zoom-reset]"),()=>{clearHoverNow();lpMapClearFitStatus(modal);st.scale=lpMapDefaultActualScale();st.userMoved=false;centerView();applyTransform();});lpBindTap(modal.querySelector('[data-lp-map-fit]'),()=>{clearHoverNow();lpMapFitView(modal);});let dragging=false;let pendingNodeDrag=null;let activePid=null;let lx=0,ly=0;const NODE_DRAG_THRESHOLD=8;const activePtrs=new Map();let pinch=null;function isTouchGestureDevice(){try{if(navigator&&typeof navigator.maxTouchPoints==="number"&&navigator.maxTouchPoints>0)return true;}catch(_){}
try{if("ontouchstart"in window)return true;}catch(_){}
try{if(window.matchMedia&&(window.matchMedia('(pointer: coarse)').matches||window.matchMedia('(any-pointer: coarse)').matches)){return true;}}catch(_){}
return false;}
function dist(a,b){const dx=(a.x-b.x);const dy=(a.y-b.y);return Math.max(1e-6,Math.hypot(dx,dy));}
function mid(a,b){return{x:(a.x+b.x)/2,y:(a.y+b.y)/2};}
function endDrag(opts){lpMarkLocalMapInteractionBusy(180);dragging=false;const pidToRelease=activePid;activePid=null;if(pidToRelease!=null&&vp&&typeof vp.releasePointerCapture==="function"){try{vp.releasePointerCapture(pidToRelease);}catch(_){}}
if(lpLocalMapLiveGestureFast()){if(!__lpTransformRaf){try{scheduleTransform({skipRangeSync:true,skipClamp:true});}catch(_){}}}else if(__lpTransformRaf){try{cancelAnimationFrame(__lpTransformRaf);}catch(_){}
__lpTransformRaf=0;const skipRangeSync=__lpTransformSkipRangeSync;const skipClamp=__lpTransformSkipClamp;const syncZoomRange=__lpTransformSyncZoomRange;__lpTransformSkipRangeSync=false;__lpTransformSkipClamp=false;__lpTransformSyncZoomRange=false;try{applyTransform({skipRangeSync,skipClamp,syncZoomRange});}catch(_){}}else{try{applyTransform();}catch(_){}}
requestAnimationFrame(()=>{if(dragging||pendingNodeDrag||pinch||(activePtrs&&activePtrs.size>0))return;try{modal&&modal.classList&&modal.classList.remove("lp-map-dragging");}catch(_){}
setMobileGestureMode(false,Object.assign({immediate:!lpLocalMapLiveGestureFast()},opts||{}));schedulePostZoomRestore();});}
function startDrag(e){if(!vp)return;if((e.pointerType||"mouse")==="mouse"&&typeof e.button==="number"&&e.button!==0)return;lpMarkLocalMapInteractionBusy(320);const isMobile=isTouchGestureDevice();if(isMobile&&(e.pointerType==="touch"||e.pointerType==="pen")){if(typeof e.pointerId==="number"){activePtrs.set(e.pointerId,{x:e.clientX,y:e.clientY});}
if(activePtrs.size===2){pendingNodeDrag=null;dragging=false;activePid=null;const ids=Array.from(activePtrs.keys());const p1=activePtrs.get(ids[0]);const p2=activePtrs.get(ids[1]);if(p1&&p2){clearHoverNow();markGestureScale();try{modal&&modal.classList&&modal.classList.add("lp-map-dragging");}catch(_){}
setMobileGestureMode(true);const r0=(stageEl&&typeof stageEl.getBoundingClientRect==="function")?stageEl.getBoundingClientRect():(vp&&typeof vp.getBoundingClientRect==="function"?vp.getBoundingClientRect():null);const m0=mid(p1,p2);const ax0=r0?(m0.x-r0.left):m0.x;const ay0=r0?(m0.y-r0.top):m0.y;const s0=(st.scale||1);const tx0=(st.tx||0);const ty0=(st.ty||0);const wx0=(ax0-tx0)/s0;const wy0=(ay0-ty0)/s0;pinch={id1:ids[0],id2:ids[1],d0:dist(p1,p2),s0,wx0,wy0,stageLeft:r0?(Number(r0.left)||0):0,stageTop:r0?(Number(r0.top)||0):0,};try{vp.setPointerCapture(ids[0]);}catch(_){}
try{vp.setPointerCapture(ids[1]);}catch(_){}
if(e.cancelable)e.preventDefault();e.stopPropagation();}
return;}}
const t=e.target;if(t&&t.closest){if(t.closest("a.lp-node")){if(isMobile&&(e.pointerType==="touch"||e.pointerType==="pen"||navigator.maxTouchPoints>0)){pendingNodeDrag={pid:(typeof e.pointerId==="number")?e.pointerId:null,sx:Number(e.clientX)||0,sy:Number(e.clientY)||0};activePid=pendingNodeDrag.pid;lx=Number(e.clientX)||0;ly=Number(e.clientY)||0;try{if(activePid!=null&&vp&&typeof vp.setPointerCapture==="function")vp.setPointerCapture(activePid);}catch(_){}
return;}
return;}
if(t.closest(".lp-mctrl"))return;if(t.closest(".lp-mzoom"))return;if(t.closest(".lp-close"))return;if(t.closest("[data-lp-fullscreen]"))return;}
clearHoverNow();markGestureScale();try{modal&&modal.classList&&modal.classList.add("lp-map-dragging");}catch(_){}
setMobileGestureMode(true);dragging=true;st.userMoved=true;activePid=(typeof e.pointerId==="number")?e.pointerId:null;lx=e.clientX;ly=e.clientY;if(activePid!=null&&typeof vp.setPointerCapture==="function"){try{vp.setPointerCapture(activePid);}catch(_){}}
if(e.cancelable)e.preventDefault();e.stopPropagation();}
function moveDrag(e){if(pinch&&(e.pointerType==="touch"||e.pointerType==="pen")&&typeof e.pointerId==="number"){if(e.pointerId===pinch.id1||e.pointerId===pinch.id2){activePtrs.set(e.pointerId,{x:e.clientX,y:e.clientY});const p1=activePtrs.get(pinch.id1);const p2=activePtrs.get(pinch.id2);if(p1&&p2){lpMarkLocalMapInteractionBusy(240);const d1=dist(p1,p2);const ratio=d1/Math.max(1e-6,pinch.d0);const rawScale=(pinch.s0||1)*ratio;const nextScale=Math.min(lpMapMaxActualScale(),Math.max(lpMapMinActualScale(),Number(rawScale)||(pinch.s0||lpMapDefaultActualScale())));const m=mid(p1,p2);const ax=m.x-(Number(pinch.stageLeft)||0);const ay=m.y-(Number(pinch.stageTop)||0);st.scale=nextScale;st.tx=ax-(Number(pinch.wx0)||0)*nextScale;st.ty=ay-(Number(pinch.wy0)||0)*nextScale;st.userMoved=true;try{const livePct=Math.max(LP_MAP_ZOOM_MIN_PCT,Math.min(LP_MAP_ZOOM_MAX_PCT,lpMapDisplayPctFromScale(nextScale)));if(zoomRange&&!st.__lpZoomDragging){const liveValue=String(livePct);if(zoomRange.value!==liveValue)zoomRange.value=liveValue;lpUpdateZoomRangeVisual(zoomRange,livePct,LP_MAP_ZOOM_MIN_PCT,LP_MAP_ZOOM_MAX_PCT);}
if(zoomLabel)zoomLabel.textContent=`${Math.round(livePct)}%`;}catch(_){}
applyTransformFast({skipClamp:true});}
if(e.cancelable)e.preventDefault();e.stopPropagation();return;}}
if(!dragging){if(pendingNodeDrag){if(pendingNodeDrag.pid!=null&&typeof e.pointerId==="number"&&e.pointerId!==pendingNodeDrag.pid)return;const dx0=e.clientX-pendingNodeDrag.sx;const dy0=e.clientY-pendingNodeDrag.sy;if((dx0*dx0+dy0*dy0)<(NODE_DRAG_THRESHOLD*NODE_DRAG_THRESHOLD))return;clearHoverNow();markGestureScale();try{modal&&modal.classList&&modal.classList.add("lp-map-dragging");}catch(_){}
setMobileGestureMode(true);dragging=true;st.userMoved=true;st.__lpSuppressNextNodeClick=true;if(activePid!=null&&vp&&typeof vp.setPointerCapture==="function"){try{vp.setPointerCapture(activePid);}catch(_){}}
lx=e.clientX;ly=e.clientY;pendingNodeDrag=null;}else{return;}}
if(activePid!=null&&typeof e.pointerId==="number"&&e.pointerId!==activePid)return;lpMarkLocalMapInteractionBusy(220);const dx=e.clientX-lx;const dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;st.tx+=dx;st.ty+=dy;st.userMoved=true;applyTransformFast({skipClamp:true});if(e.cancelable)e.preventDefault();e.stopPropagation();}
function stopDrag(e){if((e&&(e.pointerType==="touch"||e.pointerType==="pen"))&&typeof e.pointerId==="number"){activePtrs.delete(e.pointerId);if(pinch&&(e.pointerId===pinch.id1||e.pointerId===pinch.id2)){pinch=null;if(activePtrs.size===1&&!dragging&&!pendingNodeDrag){const rid=Array.from(activePtrs.keys())[0];const rp=activePtrs.get(rid);if(rp&&vp){clearHoverNow();dragging=true;st.userMoved=true;activePid=rid;lx=rp.x;ly=rp.y;try{vp.setPointerCapture(rid);}catch(_){}}}}
if(activePtrs.size<2){try{vp&&vp.releasePointerCapture&&vp.releasePointerCapture(e.pointerId);}catch(_){}}}
if(!dragging){if(pendingNodeDrag){if(pendingNodeDrag.pid!=null&&typeof e.pointerId==="number"&&e.pointerId!==pendingNodeDrag.pid)return;pendingNodeDrag=null;activePid=null;}
return;}
if(activePid!=null&&typeof e.pointerId==="number"&&e.pointerId!==activePid)return;endDrag();if(e&&e.cancelable)e.preventDefault();if(e)e.stopPropagation();}
const hardTouchGestureCleanup=(e)=>{try{const remainingTouches=e&&e.touches?Number(e.touches.length)||0:0;if(remainingTouches>0)return;activePtrs.clear();pinch=null;if(!dragging&&!pendingNodeDrag&&!st.__lpZoomDragging){try{modal&&modal.classList&&modal.classList.remove("lp-map-dragging");}catch(_){}
setMobileGestureMode(false,{immediate:!lpLocalMapLiveGestureFast()});schedulePostZoomRestore();}}catch(_){}};modal.addEventListener("touchend",hardTouchGestureCleanup,{passive:true,capture:true});modal.addEventListener("touchcancel",hardTouchGestureCleanup,{passive:true,capture:true});if(window.PointerEvent){vp?.addEventListener("pointerdown",startDrag,{passive:false});vp?.addEventListener("pointermove",moveDrag,{passive:false});vp?.addEventListener("pointerup",stopDrag,{passive:false});vp?.addEventListener("pointercancel",stopDrag,{passive:false});vp?.addEventListener("lostpointercapture",stopDrag,{passive:true});window.addEventListener("pointerup",stopDrag,{passive:false});window.addEventListener("pointercancel",stopDrag,{passive:false});}else{vp?.addEventListener("mousedown",(e)=>{clearHoverNow();dragging=true;st.userMoved=true;lx=e.clientX;ly=e.clientY;});window.addEventListener("mousemove",(e)=>{if(!dragging)return;st.tx+=(e.clientX-lx);st.ty+=(e.clientY-ly);lx=e.clientX;ly=e.clientY;scheduleTransform();});window.addEventListener("mouseup",()=>(dragging=false));}
const stageEl=modal.querySelector(".lp-mapstage");function onWheel(e){if(!modal.classList.contains("lp-open"))return;if(e.cancelable)e.preventDefault();e.stopPropagation();if(!stageEl||!(e.target&&stageEl.contains(e.target)))return;const wheelDecision=lpWheelZoomDecision(e,st.__lpWheelZoomState||(st.__lpWheelZoomState={}));if(!wheelDecision.zoom)return;lpMarkLocalMapInteractionBusy(240);clearHoverNow();const r=stageEl.getBoundingClientRect();const ax=(e.clientX-r.left);const ay=(e.clientY-r.top);zoomAboutScreenPoint((st.scale||1)*wheelDecision.factor,{x:ax,y:ay},{defer:true});st.userMoved=true;}
modal.addEventListener("wheel",onWheel,{passive:false,capture:true});modal.addEventListener("touchmove",(e)=>{if(!modal.classList.contains("lp-open"))return;const t=e.target;if(t&&t.closest){if(t.closest(".lp-mctrl")||t.closest(".lp-mzoom")||t.closest(".lp-close")||t.closest("[data-lp-fullscreen]"))return;}
if(e.cancelable)e.preventDefault();e.stopPropagation();},{passive:false,capture:true});syncLabels();syncRelLabel();applyTransform();return modal;}
function lpMapDocSurfaceIsTouch(){try{return!!(__lpIsPhoneTouch()||(window.matchMedia&&window.matchMedia("(max-width: 900px), (pointer: coarse), (hover: none)").matches)||(navigator&&Number(navigator.maxTouchPoints||0)>0));}catch(_){return Math.min(Number(window.innerWidth)||9999,Number(window.innerHeight)||9999)<=900;}}
function lpMapDocIOSBottomOcclusionPx(){if(!lpMapDocSurfaceIsTouch()||!lpMapDocSurfaceIsIOS())return 0;try{const vv=window.visualViewport;const layoutH=Math.max(1,Number(window.innerHeight)||Number(document.documentElement&&document.documentElement.clientHeight)||1);const vvBottom=vv?((Number(vv.offsetTop)||0)+(Number(vv.height)||0)):layoutH;const visualGap=vv?Math.max(0,Math.round(layoutH-vvBottom)):0;let screenH=0;try{screenH=Math.max(Number(window.screen&&window.screen.height)||0,Number(window.screen&&window.screen.width)||0);}catch(_){screenH=0;}
const safe=Math.max(0,lpMapDocSafeBottomPx());const screenGap=screenH>0?Math.max(0,Math.round(screenH-layoutH-safe)):0;const raw=Math.max(visualGap,screenGap);if(raw<40){try{if(__lpIsPhoneTouch()||__lpIsMobileMapModal())return 112;}catch(_){}
return 0;}
return lpMapDocClamp(raw,64,320);}catch(_){return 0;}}
function lpUpdateMapDocumentSurface(modal){try{if(!modal||!modal.classList||!modal.classList.contains("lp-open"))return;if(!modal.classList.contains("lp-doc-surface"))return;const vv=window.visualViewport;const layoutW=Math.max(1,Number(window.innerWidth)||Number(document.documentElement&&document.documentElement.clientWidth)||1);const layoutH=Math.max(1,Number(window.innerHeight)||Number(document.documentElement&&document.documentElement.clientHeight)||1);const vvLeft=vv?(Number(vv.offsetLeft)||0):0;const vvTop=vv?(Number(vv.offsetTop)||0):0;const vvW=vv&&Number(vv.width)?Number(vv.width):layoutW;const vvH=vv&&Number(vv.height)?Number(vv.height):layoutH;const vvBottom=vvTop+vvH;const safeStrip=Math.max(lpMapDocSafeBottomPx(),vv?Math.max(0,Math.round(layoutH-vvBottom)):0,lpMapDocIOSBottomOcclusionPx());const visibleBottom=vv?Math.max(0,vvBottom):layoutH;const extraTail=lpMapDocSurfaceIsIOS()?56:28;const layoutBottom=Math.max(layoutH,visibleBottom)+Math.max(0,safeStrip)+extraTail;const docLeft=lpMapDocScrollX()+vvLeft;const docTop=lpMapDocScrollY()+vvTop;const docHeight=Math.max(120,Math.ceil(layoutBottom-vvTop));const visibleHeight=Math.max(120,Math.ceil(vvH||layoutH));const hiddenTail=Math.max(0,Math.ceil(docHeight-visibleHeight));modal.style.setProperty("--lp-map-doc-left",lpMapDocPx(docLeft));modal.style.setProperty("--lp-map-doc-top",lpMapDocPx(docTop));modal.style.setProperty("--lp-map-doc-width",lpMapDocPx(vvW||layoutW));modal.style.setProperty("--lp-map-doc-height",lpMapDocPx(docHeight));modal.style.setProperty("--lp-map-visible-height",lpMapDocPx(visibleHeight));modal.style.setProperty("--lp-map-ios-hidden-tail",lpMapDocPx(hiddenTail));const visibleSafe=Math.max(lpMapDocSafeBottomPx(),0);const dockGap=lpMapDocSurfaceIsIOS()?8:12;const zoomBottom=Math.max(8,Math.ceil(hiddenTail+dockGap));modal.style.setProperty("--lp-map-zoom-bottom",lpMapDocPx(zoomBottom));}catch(_){}}
function lpBindMapDocumentSurfaceMetricsOnce(){if(window.__lpMapDocSurfaceMetricsBoundV9)return;window.__lpMapDocSurfaceMetricsBoundV9=true;let raf=0;const update=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;lpUpdateMapDocumentSurface(document.getElementById("lp-map-modal"));lpUpdateMapDocumentSurface(document.getElementById("lp-h1sg-modal"));});};try{window.addEventListener("resize",update,{passive:true});}catch(_){window.addEventListener("resize",update);}
try{window.addEventListener("orientationchange",()=>window.setTimeout(update,80),{passive:true});}catch(_){window.addEventListener("orientationchange",()=>window.setTimeout(update,80));}
try{if(window.visualViewport){window.visualViewport.addEventListener("resize",update,{passive:true});window.visualViewport.addEventListener("scroll",update,{passive:true});}}catch(_){}}
function lpEnterMapDocumentSurface(modal){try{if(!modal||!lpMapDocSurfaceIsTouch())return false;lpEnsureMapDocumentSurfaceStyle();lpBindMapDocumentSurfaceMetricsOnce();modal.classList.add("lp-doc-surface");modal.style.setProperty("padding","0","important");lpUpdateMapDocumentSurface(modal);requestAnimationFrame(()=>lpUpdateMapDocumentSurface(modal));window.setTimeout(()=>lpUpdateMapDocumentSurface(modal),80);return true;}catch(_){return false;}}
function setLpModalScrollLock(on){const html=document.documentElement;const body=document.body;if(!body)return;if(on){if(body.classList.contains("lp-modal-open"))return;const y=window.scrollY||document.documentElement.scrollTop||0;body.dataset.lpScrollY=String(y);body.classList.add("lp-modal-open");try{html&&html.classList&&html.classList.add("lp-modal-open");}catch(_){}
try{html&&html.style&&html.style.setProperty("overflow","hidden","important");}catch(_){}
try{body&&body.style&&body.style.setProperty("overflow","hidden","important");}catch(_){}
return;}
if(!body.classList.contains("lp-modal-open"))return;const y=Number(body.dataset.lpScrollY||"0")||0;body.classList.remove("lp-modal-open");try{html&&html.classList&&html.classList.remove("lp-modal-open");}catch(_){}
try{html&&html.style&&html.style.removeProperty("overflow");}catch(_){}
try{body&&body.style&&body.style.removeProperty("overflow");}catch(_){}
delete body.dataset.lpScrollY;try{window.scrollTo(0,y);}catch(_){}}
function lpInstallClickShield(durationMs=520){try{if(!__lpTouchPrimaryDevice())return;if(document.getElementById("lp-click-shield"))return;const shield=document.createElement("div");shield.id="lp-click-shield";shield.setAttribute("aria-hidden","true");shield.style.cssText="position:fixed;inset:0;z-index:2147483647;background:transparent;pointer-events:auto;";const kill=(e)=>{try{if(e&&e.cancelable)e.preventDefault();if(e){e.stopPropagation();if(typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();}}catch(_){}
return false;};["pointerdown","pointerup","click","touchstart","touchend","mousedown","mouseup"].forEach((t)=>{shield.addEventListener(t,kill,{passive:false,capture:true});});document.body.appendChild(shield);window.setTimeout(()=>{try{shield.remove();}catch(_){}},Math.max(120,Number(durationMs)||520));}catch(_){}}
function __lpIsMobileMapModal(){try{return __lpIsPhoneTouch();}catch(_){return false;}}
function __lpTouchPrimaryDevice(){try{if(window.matchMedia&&window.matchMedia("(pointer: coarse)").matches)return true;return!!(navigator&&Number(navigator.maxTouchPoints)>0&&window.matchMedia&&!window.matchMedia("(pointer: fine)").matches);}catch(_){return false;}}
function lpIsOperaMapPerfMode(){try{try{if(window.__lpForceOperaMapPerf===true)return true;if(localStorage.getItem('lp_force_opera_map_perf_v1')==='1')return true;if(/[?&]lp_opera_map_perf=1\b/.test(String(window.location.search||'')))return true;}catch(_){}
const now=Date.now();const cached=window.__lpOperaMapPerfCache;if(cached&&(now-Number(cached.ts||0))<1500)return!!cached.value;const nav=navigator||{};const ua=String(nav.userAgent||"");const brands=Array.isArray(nav.userAgentData&&nav.userAgentData.brands)?nav.userAgentData.brands.map((b)=>String((b&&b.brand)||"")).join(" "):"";const isOpera=/\b(OPR|OPT|OPX|OPiOS)\//i.test(ua)||/Opera(?: Mini| Mobi)?/i.test(ua)||/\b(OPR|Opera|Opera GX|OPiOS)\b/i.test(brands);if(!isOpera){window.__lpOperaMapPerfCache={ts:now,value:false};return false;}
const coarse=!!(window.matchMedia&&(window.matchMedia("(pointer: coarse)").matches||window.matchMedia("(any-pointer: coarse)").matches));const smallViewport=Math.min(Number(window.innerWidth)||9999,Number(window.innerHeight)||9999)<=900;const touchPoints=Number(nav.maxTouchPoints||0)>0;const value=!!(__lpIsMobileMapModal()||__lpIsPhoneTouch()||coarse||touchPoints||smallViewport);window.__lpOperaMapPerfCache={ts:now,value};return value;}catch(_){return false;}}
function lpApplyLocalMapPerfMode(modal,nodeCount,edgeCount){try{if(!modal||!modal.classList)return false;const operaPerf=lpIsOperaMapPerfMode();const prefersReduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);const lowCore=Number(navigator&&navigator.hardwareConcurrency||8)<=4;const lowMemory=Number(navigator&&navigator.deviceMemory||8)<=4;const n=Number(nodeCount)||0;const e=Number(edgeCount)||0;const on=!!(operaPerf||prefersReduced||((lowCore||lowMemory)&&(n>55||e>95))||(n>85||e>150));modal.classList.toggle("lp-opera-map-perf",on);if(on)modal.setAttribute('data-lp-opera-perf',operaPerf?'opera':'auto');else modal.removeAttribute('data-lp-opera-perf');return on;}catch(_){return false;}}
async function showLocalMapModal(graph){if(!lpAnyMapModalOpen()&&!lpConsumeGuestAction("map",{source:"learning-path-local-map",title:"Concept maps"}))return;lpResetRevealSession();const modal=ensureMapModal(graph);lpSyncLocalMapAnimationAccess(modal);lpLocalMapHideDirectionMenu(modal);const helper=modal&&modal.querySelector?modal.querySelector('[data-lp-map-helper-panel]'):null;if(helper)helper.textContent=lpMapTabHelperText('local',__lpIsPhoneTouch());lpSyncMapTabs(modal,'local');lpMapTipsSet(modal,'local');lpMapTipsCollapse(modal);if(!modal)return;const isMobile=__lpIsMobileMapModal();const touchCompositor=!!(isMobile||lpMapDocSurfaceIsTouch());try{modal.classList.toggle("lp-touch-compositor",!!touchCompositor);if(touchCompositor)modal.setAttribute("data-lp-touch-compositor","1");else modal.removeAttribute("data-lp-touch-compositor");}catch(_){}
lpApplyLocalMapPerfMode(modal,0,0);const isDesktopPc=!!(window.matchMedia&&window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)').matches);lpReparentZoomGroup(modal);if(isMobile||isDesktopPc)modal.classList.add("lp-full");else modal.classList.remove("lp-full");modal.classList.add("lp-open");modal.style.display="flex";lpInstallLocalMapPointerWatch();lpMarkLocalMapInteractionBusy(700);try{if(typeof window.__mkWarmMathRuntime==="function")window.__mkWarmMathRuntime();}catch(_){}
lpRecordXpActivity("map_open",{source:"show-local-map-modal",eventName:"showLocalMapModal"});try{document.dispatchEvent(new CustomEvent("mk:map-opened",{detail:{source:"show-local-map-modal"}}));}catch(_){}
try{modal.style.setProperty("z-index",String(LP_MAP_MODAL_Z),"important");}catch(_){}
modal.setAttribute("aria-hidden","false");const usingDocSurface=isMobile&&lpEnterMapDocumentSurface(modal);if(!usingDocSurface)setLpModalScrollLock(true);else{try{document.documentElement.classList.add("lp-modal-open");}catch(_){}
try{document.body&&document.body.classList.add("lp-modal-open");}catch(_){}}
const btn=modal.querySelector("[data-lp-fullscreen]");if(btn)lpSetFullscreenIcon(btn,modal.classList.contains("lp-full"));lpMapFocusOpen(modal);const stage=modal.querySelector('.lp-mapstage');const curKey=lpCanonKey(currentRelPath());const stageWNow=stage?Math.max(0,Math.round(stage.clientWidth||stage.getBoundingClientRect().width||0)):0;const stageHNow=stage?Math.max(0,Math.round(stage.clientHeight||stage.getBoundingClientRect().height||0)):0;const masterySigNow=lpCurrentMasterySignature();const canReuse=!!(stage&&curKey&&modal.__lpRenderedGraph===(graph||null)&&modal.__lpRenderedFor===curKey&&!modal.__lpRelatedDirty&&modal.__lpRenderedFogEnabled===lpFogEnabled()&&modal.__lpRenderedMasterySignature===masterySigNow&&stage.querySelector('[data-map-viewport] .lp-node[data-lp-loc]')&&Math.abs((Number(modal.__lpRenderedStageW)||0)-stageWNow)<=20&&Math.abs((Number(modal.__lpRenderedStageH)||0)-stageHNow)<=20);if(window.__lpMapState){window.__lpMapState.scale=lpMapDefaultActualScale();window.__lpMapState.__lpForceCenter=true;window.__lpMapState.userMoved=false;}
if(canReuse){if(stage)stage.style.visibility='';const engine=modal.__lpWebgl3dEngine;if(engine){lpWebgl3dObserve(engine);lpWebgl3dDraw(engine);}
requestAnimationFrame(()=>{try{if(window.__lpMapState)lpLocalMapResetView(modal,window.__lpMapState);modal.__lpApplyTransform&&modal.__lpApplyTransform();}catch(_){}});return;}
if(stage)stage.style.visibility='';lp3dActivateModal(modal,'local');renderLocalMapModal(graph);try{if(usingDocSurface){lpUpdateMapDocumentSurface(modal);requestAnimationFrame(()=>{try{lpUpdateMapDocumentSurface(modal);if(window.__lpMapState)lpLocalMapResetView(modal,window.__lpMapState);modal.__lpApplyTransform&&modal.__lpApplyTransform();}catch(_){}});}}catch(_){}}
function hideLocalMapModal(){lpResetRevealSession();lpLocalMapHideDirectionMenu(document.getElementById("lp-map-modal"));window.__lpDependentPickCache=new Map();if(window.__lpDependentPickCacheState)window.__lpDependentPickCacheState.current="";const modal=document.getElementById("lp-map-modal");if(!modal)return;try{if(modal.__lpStopZoomGesture)modal.__lpStopZoomGesture();}catch(_){}
if(modal.classList.contains("lp-doc-surface")){try{document.documentElement.classList.remove("lp-modal-open");}catch(_){}
try{document.body&&document.body.classList.remove("lp-modal-open");}catch(_){}}else{setLpModalScrollLock(false);}
lpExitMapDocumentSurface(modal);lpInstallClickShield(560);if(window.__lpMapState&&typeof window.__lpMapState.__lpClearFocus==="function"){window.__lpMapState.__lpClearFocus();}
modal.classList.remove("lp-open");modal.classList.remove("lp-full");modal.classList.remove("lp-opera-map-perf");modal.classList.remove("lp-touch-compositor");modal.classList.remove("lp-local-map-animations-on");modal.classList.remove("lp-local-map-animations-off");try{modal.removeAttribute('data-lp-map-animations');}catch(_){}
try{modal.removeAttribute('data-lp-opera-perf');}catch(_){}
try{modal.removeAttribute('data-lp-touch-compositor');}catch(_){}
const btn=modal.querySelector("[data-lp-fullscreen]");if(btn)lpSetFullscreenIcon(btn,false);modal.style.display="none";modal.setAttribute("aria-hidden","true");try{const engine=modal.__lpWebgl3dEngine;if(engine&&typeof engine.__disposeLifecycle==='function')engine.__disposeLifecycle();}catch(_){}
lpMapFocusClose(modal);}
try{window.addEventListener("mk-shop-inventory-change",()=>{try{const modal=document.getElementById("lp-map-modal");if(!modal)return;const before=modal.getAttribute("data-lp-map-animations")||"";const on=lpSyncLocalMapAnimationAccess(modal);const after=on?"on":"off";if(modal.classList.contains("lp-open")&&before&&before!==after){if(window.__lpLearningPathGraph)renderLocalMapModal(window.__lpLearningPathGraph);}}catch(_){}});window.addEventListener("mk-shop-trial-change",()=>{try{const modal=document.getElementById("lp-map-modal");if(!modal)return;const before=modal.getAttribute("data-lp-map-animations")||"";const on=lpSyncLocalMapAnimationAccess(modal);const after=on?"on":"off";if(modal.classList.contains("lp-open")&&before&&before!==after){if(window.__lpLearningPathGraph)renderLocalMapModal(window.__lpLearningPathGraph);}}catch(_){}});}catch(_){}
function lpUseDesktopLearningPathSidebar(){try{if(lpIsMobileSheet&&lpIsMobileSheet())return false;}catch(_){}
try{return!!(window.matchMedia&&window.matchMedia("(min-width: 901px)").matches);}catch(_){return(window.innerWidth||0)>=901;}}
function secondarySidebarInnerIfVisible(){const sec=document.querySelector(".md-sidebar--secondary .md-sidebar__inner");if(!sec)return null;const shell=sec.closest(".md-sidebar--secondary")||sec;if(lpUseDesktopLearningPathSidebar()){try{shell.classList.add("lp-secondary-host-active");}catch(_){}
try{shell.style.removeProperty("display");shell.style.removeProperty("visibility");}catch(_){}
return sec;}
try{const cs=window.getComputedStyle(shell);if(cs.display==="none"||cs.visibility==="hidden")return null;}catch(_){}
const r=shell.getBoundingClientRect();if(!r||r.width<40||r.height<40)return null;return sec;}
function ensureDesktopLearningPathFallbackHost(){try{let aside=document.getElementById("lp-secondary-fallback");if(!lpUseDesktopLearningPathSidebar()){if(aside)aside.remove();return null;}
if(aside){const inner=aside.querySelector(".md-sidebar__inner");return inner||aside;}
const mainInner=document.querySelector(".md-main__inner")||document.querySelector("main.md-main")||null;if(!mainInner)return null;aside=document.createElement("aside");aside.id="lp-secondary-fallback";aside.className="md-sidebar md-sidebar--secondary lp-secondary-fallback";aside.setAttribute("data-md-component","sidebar");aside.setAttribute("data-md-type","toc");aside.innerHTML='<div class="md-sidebar__scrollwrap"><div class="md-sidebar__inner"></div></div>';const content=mainInner.querySelector(".md-content");if(content&&content.nextSibling)mainInner.insertBefore(aside,content.nextSibling);else mainInner.appendChild(aside);return aside.querySelector(".md-sidebar__inner")||aside;}catch(_){return null;}}
function ensurePanelHost(){if(lpUseDesktopLearningPathSidebar()){const sec=secondarySidebarInnerIfVisible();if(sec)return sec;const fallback=ensureDesktopLearningPathFallbackHost();if(fallback)return fallback;}else{try{const f=document.getElementById("lp-secondary-fallback");if(f)f.remove();}catch(_){}}
const inner=document.querySelector("article.md-content__inner");return inner||document.body;}
function lpRelocatePanelForViewport(){const panel=document.getElementById("lp-side-panel");if(!panel||lpIsMobileSheet()||panel.closest("#lp-mobile-sheet"))return;const active=panel.contains(document.activeElement)?document.activeElement:null;const host=ensurePanelHost();if(!host)return;if(isSecondaryHost(host)){if(panel.parentElement!==host)host.insertAdjacentElement("afterbegin",panel);}else{const article=document.querySelector("article.md-content__inner")||document.querySelector(".md-content__inner");const target=article&&article.parentElement||document.querySelector("main.md-main")||document.body;if(panel.parentElement!==target)target.appendChild(panel);}
if(active&&active.isConnected)active.focus({preventScroll:true});lpSyncDesktopPanelShiftNow();}
try{const panelBreakpoint=window.matchMedia("(min-width: 901px)");if(panelBreakpoint.addEventListener)panelBreakpoint.addEventListener("change",lpRelocatePanelForViewport);else if(panelBreakpoint.addListener)panelBreakpoint.addListener(lpRelocatePanelForViewport);}catch(_){}
function isSecondaryHost(el){return!!(el&&el.closest&&el.closest(".md-sidebar--secondary"));}
function normHeadingText(s){return cleanTitle(s||"").replace(/[^\p{L}\p{N}\s]/gu,"").replace(/\s+/g," ").trim();}
function insertPanelAfterExamples(panel,hostEl){const inner=document.querySelector("article.md-content__inner");const host=hostEl||inner||document.body;if(!inner||host===document.body){host.insertAdjacentElement("afterbegin",panel);return;}
const heads=Array.from(inner.querySelectorAll("h2, h3"));const h=heads.find((x)=>/^examples$/i.test(normHeadingText(x.textContent||"")));if(!h){inner.appendChild(panel);return;}
let last=h;let n=h.nextElementSibling;while(n){const tag=(n.tagName||"").toLowerCase();if(tag==="h2"||tag==="h3")break;last=n;n=n.nextElementSibling;}
last.insertAdjacentElement("afterend",panel);}
function restoreLpHiddenBodySections(){try{document.querySelectorAll('[data-lp-hidden="1"]').forEach((n)=>{try{n.style.removeProperty("display");}catch(_){}
try{delete n.dataset.lpHidden;}catch(_){try{n.removeAttribute("data-lp-hidden");}catch(__){}}});}catch(_){}}
function hideBodySectionByHeadingRegex(headingRegex){const inner=document.querySelector("article.md-content__inner");if(!inner)return;const heads=Array.from(inner.querySelectorAll("h2, h3"));const targets=heads.filter((x)=>headingRegex.test(normHeadingText(x.textContent||"")));targets.reverse();for(const h of targets){let n=h;while(n){const next=n.nextElementSibling;try{n.dataset.lpHidden="1";}catch(_){}
try{n.style.display="none";}catch(_){}
n=next;if(!n)break;const tag=(n.tagName||"").toLowerCase();if(tag==="h1"||tag==="h2"||tag==="h3")break;if(n.matches&&n.matches('.md-source-file, .md-source-file__fact, .md-content__button, .md-content__button + *, .md-content__inner > footer'))break;}}}
function syncSecondaryTocVisibility(show){try{document.querySelectorAll('.md-sidebar--secondary .md-nav--secondary').forEach((el)=>{if(show)el.style.removeProperty('display');else el.style.display='none';});}catch(_){}}
function hideRedundantBodySections(){restoreLpHiddenBodySections();hideBodySectionByHeadingRegex(/^prerequisites$/i);hideBodySectionByHeadingRegex(/^related concepts$/i);hideBodySectionByHeadingRegex(/^related$/i);}
function lpIsMobileSheet(){try{return __lpIsPhoneTouch();}catch(_){return false;}}
function lpGetMobileSheetLastPage(){try{return normLoc(sessionStorage.getItem(LP_MOBILE_SHEET_LAST_PAGE_KEY)||"");}catch(_){return"";}}
function lpSetMobileSheetLastPage(v){try{sessionStorage.setItem(LP_MOBILE_SHEET_LAST_PAGE_KEY,normLoc(v||""));}catch(_){}}
function lpMobileSheetMotionEnabled(){try{return lpIsMobileSheet()&&!lpMotionReduced();}catch(_){return false;}}
function lpPanelSectionStateKey(details){try{if(!details||!details.classList)return"";if(details.classList.contains("lp-forward")||details.classList.contains("lp-deps"))return"deps";if(details.classList.contains("lp-pres"))return"pres";if(details.classList.contains("lp-rel"))return"rel";if(details.classList.contains("lp-map"))return"map";const summary=details.querySelector&&details.querySelector(":scope > summary.lp-sum .lp-sum-left");return cleanTitle(summary&&summary.textContent||"");}catch(_){return"";}}
function lpSnapshotPanelUiState(panel){const state={open:Object.create(null),panelScrollTop:0,sheetBodyScrollTop:0};if(!panel||!panel.querySelectorAll)return state;try{state.panelScrollTop=Math.max(0,Number(panel.scrollTop)||0);}catch(_){}
try{const sheetBody=panel.closest&&panel.closest("#lp-mobile-sheet")?lpGetMobileSheetBody(panel.closest("#lp-mobile-sheet")):null;if(sheetBody)state.sheetBodyScrollTop=Math.max(0,Number(sheetBody.scrollTop)||0);}catch(_){}
try{panel.querySelectorAll("details.lp-acc").forEach((details)=>{const key=lpPanelSectionStateKey(details);if(key)state.open[key]=!!details.open;});}catch(_){}
return state;}
function lpRestorePanelUiState(panel,state){if(!panel||!state||!panel.querySelectorAll)return;try{panel.querySelectorAll("details.lp-acc").forEach((details)=>{const key=lpPanelSectionStateKey(details);if(key&&Object.prototype.hasOwnProperty.call(state.open||{},key))details.open=!!state.open[key];});}catch(_){}
try{if(state.panelScrollTop)panel.scrollTop=state.panelScrollTop;}catch(_){}
try{if(state.sheetBodyScrollTop){const sheetBody=panel.closest&&panel.closest("#lp-mobile-sheet")?lpGetMobileSheetBody(panel.closest("#lp-mobile-sheet")):null;if(sheetBody)sheetBody.scrollTop=state.sheetBodyScrollTop;}}catch(_){}}
function ensureMobileSheetShell(){let backdrop=document.getElementById("lp-mobile-backdrop");if(!backdrop){backdrop=document.createElement("div");backdrop.id="lp-mobile-backdrop";backdrop.setAttribute("aria-hidden","true");document.body.appendChild(backdrop);backdrop.addEventListener("touchmove",(e)=>{if(e&&e.cancelable)e.preventDefault();},{passive:false});}
let root=document.getElementById("lp-mobile-sheet");if(!root){root=document.createElement("div");root.id="lp-mobile-sheet";root.className="lp-collapsed";root.innerHTML=`
      <div class="lp-msheet">
        <div class="lp-msheet-head">
          <div class="lp-msheet-txt">
            <div class="lp-msheet-title">Concept connections</div>
            <div class="lp-msheet-sub">Concept maps</div>
          </div>
          <div class="lp-msheet-actions">
            <button class="lp-msheet-btn lp-msheet-iconbtn" type="button" data-lp-ms-openmap aria-label="Open concept maps" title="Open concept maps">${lpMapButtonSvg()}</button>
            <div class="lp-msheet-fog" data-lp-ms-static title="Knowledge masking">
              <span class="lp-msheet-fog-label">Masking</span>
              <label class="lp-msheet-fog-switch" aria-label="Turn knowledge masking on or off">
                <input type="checkbox" data-lp-ms-fog-switch ${lpFogEnabled() ? 'checked' : ''}>
                <span class="lp-msheet-fog-ui" aria-hidden="true"></span>
              </label>
            </div>
            <button class="lp-msheet-btn lp-msheet-toggle" type="button" aria-label="Toggle" data-lp-ms-toggle>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
            </button>
          </div>
        </div>
        <div class="lp-msheet-body" data-lp-ms-body></div>
      </div>
    `;document.body.appendChild(root);}
root.classList.add("lp-mounted");return{backdrop,root};}
function lpSetMobileSheetExpanded(open){const root=document.getElementById("lp-mobile-sheet");const backdrop=document.getElementById("lp-mobile-backdrop");if(!root||!backdrop)return;const wantOpen=!!open;if(root.classList.contains("lp-animating"))return;const isExpanded=root.classList.contains("lp-expanded")&&!root.classList.contains("lp-panel-closing");const isCollapsed=root.classList.contains("lp-collapsed")&&!root.classList.contains("lp-panel-opening");if((wantOpen&&isExpanded)||(!wantOpen&&isCollapsed)){lpSetMobileSheetExpandedImmediate(wantOpen);return;}
if(!lpMobileSheetMotionEnabled()){lpSetMobileSheetExpandedImmediate(wantOpen);return;}
lpClearMobileSheetAnimTimer(root);lpResetMobileSheetAnimClasses(root);backdrop.classList.add("lp-open");backdrop.setAttribute("aria-hidden","false");lpSetMobileSheetScrollGuards(true);if(wantOpen){const measures=lpPrimeMobileSheetOpenAnimation(root);root.classList.add("lp-animating","lp-panel-opening");lpSetMobileSheetState("expanded");lpRunMobileSheetPanelAnimation(root,measures,true);root.__lpPanelAnimTimer=window.setTimeout(()=>{root.__lpPanelAnimTimer=0;root.classList.remove("lp-animating","lp-panel-opening","lp-panel-rows-hidden");lpClearMobileSheetPanelInlineStyles(root);},LP_MOBILE_PANEL_ANIM_MS);return;}
root.classList.remove("lp-collapsed");root.classList.add("lp-expanded");const measures=lpPrimeMobileSheetCloseAnimation(root);root.classList.add("lp-animating","lp-panel-closing");lpSetMobileSheetState("collapsed");root.__lpPanelCloseStartTimer=window.setTimeout(()=>{root.__lpPanelCloseStartTimer=0;if(!root.classList.contains("lp-panel-closing"))return;lpRunMobileSheetPanelAnimation(root,measures,false);},LP_MOBILE_PANEL_CLOSE_ARROW_LEAD_MS);root.__lpPanelAnimTimer=window.setTimeout(()=>{root.__lpPanelAnimTimer=0;root.classList.remove("lp-expanded");root.classList.add("lp-collapsed");root.classList.remove("lp-animating","lp-panel-closing","lp-panel-rows-hidden");lpClearMobileSheetPanelInlineStyles(root);backdrop.classList.remove("lp-open");backdrop.setAttribute("aria-hidden","true");lpSetMobileSheetScrollGuards(false);},LP_MOBILE_PANEL_CLOSE_ARROW_LEAD_MS+LP_MOBILE_PANEL_ANIM_MS);}
function unmountMobileSheet(){try{lpSetMobileSheetExpandedImmediate(false);}catch(_){}}
function lpInstallMobileSheetClickContainmentShield(){if(window.__lpMobileSheetClickContainmentShieldInstalled)return;window.__lpMobileSheetClickContainmentShieldInstalled=true;const STYLE_ID="lp-mobile-sheet-click-containment-style-v1";const ABSORB_MS=760;let absorbUntil=0;function ensureStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
@media (max-width: 768px), (pointer: coarse) {
  /* The sheet card is an interaction island: taps on its visual rectangle must
     never fall through to the page/mastery widget underneath. */
  #lp-mobile-sheet.lp-expanded,
  #lp-mobile-sheet.lp-animating{
    z-index: 2147482200 !important;
    top: 0 !important;
    /* Keep expanded/animating card on the exact same bottom baseline as the
       collapsed card. Do not use bottom:0 + padding-bottom here, otherwise the
       two states sit a few pixels apart on mobile Safari/Chrome. */
    bottom: calc(env(safe-area-inset-bottom, 0px) + 18px) !important;
    min-height: 0 !important;
    height: auto !important;
    padding: 0 12px !important;
    display: flex !important;
    align-items: flex-end !important;
    justify-content: center !important;
    pointer-events: auto !important;
  }
  #lp-mobile-sheet.lp-expanded .lp-msheet,
  #lp-mobile-sheet.lp-animating .lp-msheet{
    flex: 0 0 auto !important;
    margin: 0 auto !important;
  }
  #lp-mobile-backdrop.lp-open{
    z-index: 2147482190 !important;
  }
  #lp-mobile-sheet.lp-expanded .lp-msheet,
  #lp-mobile-sheet.lp-animating .lp-msheet,
  #lp-mobile-sheet.lp-expanded .lp-msheet-body,
  #lp-mobile-sheet.lp-animating .lp-msheet-body,
  #lp-mobile-sheet.lp-expanded #lp-side-panel,
  #lp-mobile-sheet.lp-animating #lp-side-panel{
    pointer-events: auto !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function mobileLike(){try{return!!(window.matchMedia&&(window.matchMedia("(max-width: 768px)").matches||window.matchMedia("(hover: none) and (pointer: coarse)").matches||window.matchMedia("(pointer: coarse)").matches));}catch(_){return false;}}
function sheetRoot(){return document.getElementById("lp-mobile-sheet");}
function sheetCard(){const root=sheetRoot();return root&&root.querySelector?root.querySelector(".lp-msheet"):null;}
function isSheetOpenOrAnimating(root){try{return!!(root&&root.classList&&(root.classList.contains("lp-expanded")||root.classList.contains("lp-panel-opening")||root.classList.contains("lp-panel-closing")||root.classList.contains("lp-animating")));}catch(_){return false;}}
function isOtherLpModalTarget(target){try{if(!target||!target.closest)return false;return!!target.closest("#lp-map-modal.lp-open, #lp-h1sg-modal.lp-open, #lp-gps-modal.lp-open, #mm-modal, .mw-ready-popover, #mw-recap-popover");}catch(_){return false;}}
function eventPoint(e){try{if(!e)return null;const t=(e.touches&&e.touches[0])||(e.changedTouches&&e.changedTouches[0]);if(t)return{x:Number(t.clientX)||0,y:Number(t.clientY)||0};if(typeof e.clientX==="number"&&typeof e.clientY==="number"){return{x:Number(e.clientX)||0,y:Number(e.clientY)||0};}}catch(_){}
return null;}
function pointInRect(pt,rect){if(!pt||!rect)return false;const pad=1.5;return pt.x>=rect.left-pad&&pt.x<=rect.right+pad&&pt.y>=rect.top-pad&&pt.y<=rect.bottom+pad;}
function consume(e,preventDefault){try{if(preventDefault&&e&&e.cancelable)e.preventDefault();if(e&&typeof e.stopPropagation==="function")e.stopPropagation();if(e&&typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();}catch(_){}}
function collapseSheet(){try{lpSetMobileSheetExpanded(false);}
catch(_){try{lpSetMobileSheetExpandedImmediate(false);}catch(__){}}}
function globalGuard(e){try{ensureStyle();if(!mobileLike())return;const now=Date.now();const root=sheetRoot();const open=isSheetOpenOrAnimating(root);if(!open){if(now<absorbUntil)consume(e,true);return;}
const target=e&&e.target;if(isOtherLpModalTarget(target))return;const card=sheetCard();const inDomSheet=!!(target&&target.closest&&target.closest("#lp-mobile-sheet .lp-msheet"));const pt=eventPoint(e);const rect=card&&card.getBoundingClientRect?card.getBoundingClientRect():null;const inVisualSheet=pointInRect(pt,rect);if(inDomSheet)return;if(inVisualSheet){absorbUntil=now+ABSORB_MS;consume(e,true);return;}
absorbUntil=now+ABSORB_MS;consume(e,true);collapseSheet();}catch(_){}}
function insideBubbleStop(e){try{if(!mobileLike())return;const root=sheetRoot();if(!isSheetOpenOrAnimating(root))return;const target=e&&e.target;if(!(target&&target.closest&&target.closest("#lp-mobile-sheet .lp-msheet")))return;if(typeof e.stopPropagation==="function")e.stopPropagation();}catch(_){}}
const types=["pointerdown","pointerup","pointercancel","mousedown","mouseup","click","dblclick","contextmenu"];types.forEach((type)=>{try{window.addEventListener(type,globalGuard,{passive:false,capture:true});}catch(_){}
try{document.addEventListener(type,globalGuard,{passive:false,capture:true});}catch(_){}});function bindRootBubbleStop(){ensureStyle();const root=sheetRoot();if(!root||root.dataset.lpClickContainmentBubbleBound==="1")return;root.dataset.lpClickContainmentBubbleBound="1";types.forEach((type)=>{try{root.addEventListener(type,insideBubbleStop,{passive:true,capture:false});}catch(_){}});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bindRootBubbleStop,{once:true});else bindRootBubbleStop();document.addEventListener("DOMContentSwitch",bindRootBubbleStop);window.addEventListener("pageshow",bindRootBubbleStop,{passive:true});try{const mo=new MutationObserver((records)=>{for(const record of records||[]){for(const node of(record&&record.addedNodes)||[]){if(!node||node.nodeType!==1)continue;try{if(node.id==="lp-mobile-sheet"||(node.querySelector&&node.querySelector("#lp-mobile-sheet"))){bindRootBubbleStop();return;}}catch(_){}}}});const start=()=>{try{if(document.body)mo.observe(document.body,{childList:true,subtree:true});}catch(_){}};if(document.body)start();else document.addEventListener("DOMContentLoaded",start,{once:true});}catch(_){}}
function bindMobileSheetLinkGestures(){const root=document.getElementById("lp-mobile-sheet");if(!root||root.dataset.lpMsTapBound==="1")return;root.dataset.lpMsTapBound="1";let st=null;let suppressClickUntil=0;let lastManualNavAt=0;const MOVE_PX=10;const TAP_MS=450;function nameTarget(e){return e&&e.target&&e.target.closest?e.target.closest("#lp-mobile-sheet .lp-name"):null;}
function rowFromName(name){return name&&name.closest?name.closest("a.lp-row[href]"):null;}
function navToRow(row){if(!row)return false;const href=lpNavHrefFromAnchor(row);const loc=(row.dataset&&row.dataset.lpLoc)?row.dataset.lpLoc:"";if(!href)return false;try{const toRel=urlToRelPath(href)||href;sessionStorage.setItem(LP_MOBILE_SHEET_NAV_KEY,normLoc(toRel));}catch(_){}
lastManualNavAt=Date.now();lpNavigate(href,loc);return true;}
root.addEventListener("pointerdown",(e)=>{const name=nameTarget(e);if(!name)return;const row=rowFromName(name);if(!row)return;st={pid:e.pointerId,x:e.clientX,y:e.clientY,t0:lpEventTimeNow(),moved:false,row};},{passive:true,capture:true});root.addEventListener("pointermove",(e)=>{if(!st||e.pointerId!==st.pid)return;const dx=e.clientX-st.x;const dy=e.clientY-st.y;if((dx*dx+dy*dy)>(MOVE_PX*MOVE_PX))st.moved=true;},{passive:true,capture:true});root.addEventListener("pointerup",(e)=>{if(!st||e.pointerId!==st.pid)return;const dt=lpEventTimeNow()-st.t0;const row=st.row;const ok=!st.moved&&dt<TAP_MS;st=null;if(!ok){suppressClickUntil=Date.now()+800;return;}
lpStopMobileTapEvent(e,true);navToRow(row);},{passive:false,capture:true});root.addEventListener("click",(e)=>{const name=nameTarget(e);if(!name)return;const row=rowFromName(name);if(!row)return;lpStopMobileTapEvent(e,true);const now=Date.now();if(now<suppressClickUntil||now-lastManualNavAt<900)return;navToRow(row);},{passive:false,capture:true});root.addEventListener("contextmenu",(e)=>{if(!nameTarget(e)&&!(e.target&&e.target.closest&&e.target.closest("#lp-mobile-sheet")))return;try{if(e&&typeof e.stopPropagation==="function")e.stopPropagation();}catch(_){}},{passive:true,capture:false});root.addEventListener("pointercancel",()=>{st=null;suppressClickUntil=Date.now()+500;},{passive:true,capture:true});}
function mountMobileSheet(panel,graph){const{backdrop,root}=ensureMobileSheetShell();const body=root.querySelector("[data-lp-ms-body]");const btnToggle=root.querySelector("[data-lp-ms-toggle]");const btnOpenMap=root.querySelector("[data-lp-ms-openmap]");const fogSwitch=root.querySelector("[data-lp-ms-fog-switch]");const head=root.querySelector(".lp-msheet-head");lpInstallMobileSheetSelectionShield();lpInstallMobileSheetClickContainmentShield();if(body){body.innerHTML="";body.appendChild(panel);lpBindMobileSectionSummaryTaps(panel);}
try{const curLoc=panel&&panel.dataset?(panel.dataset.lpCurrentLoc||currentRelPath()):currentRelPath();root.dataset.lpGpsTarget=lpGpsActiveTargetForPage(curLoc);}catch(_){}
if(fogSwitch){try{fogSwitch.checked=lpFogEnabled();}catch(_){}}
if(root.dataset.lpMsBound!=="1"){root.dataset.lpMsBound="1";const lpConsumeBackdropEvent=(e)=>{try{if(e&&e.cancelable)e.preventDefault();if(e&&typeof e.stopPropagation==="function")e.stopPropagation();if(e&&typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();}catch(_){}};const lpCollapseFromBackdrop=(e)=>{lpConsumeBackdropEvent(e);try{lpSetMobileSheetExpanded(false);}catch(_){}};backdrop.addEventListener("pointerdown",lpConsumeBackdropEvent,{passive:false,capture:true});backdrop.addEventListener("pointerup",(e)=>{if(e&&e.target!==backdrop)return;lpCollapseFromBackdrop(e);},{passive:false,capture:true});backdrop.addEventListener("click",lpConsumeBackdropEvent,{passive:false,capture:true});backdrop.addEventListener("touchstart",lpConsumeBackdropEvent,{passive:false,capture:true});backdrop.addEventListener("touchend",(e)=>{if(e&&e.target!==backdrop)return;lpCollapseFromBackdrop(e);},{passive:false,capture:true});backdrop.addEventListener("touchcancel",lpConsumeBackdropEvent,{passive:false,capture:true});if(root.dataset.lpMsRootOutsideCloseBound!=="1"){root.dataset.lpMsRootOutsideCloseBound="1";const closeFromRootOutside=(e)=>{try{const t=e&&e.target;if(t&&t.closest&&t.closest("#lp-mobile-sheet .lp-msheet"))return;lpConsumeBackdropEvent(e);lpSetMobileSheetExpanded(false);}catch(_){}};root.addEventListener("pointerup",closeFromRootOutside,{passive:false,capture:true});root.addEventListener("click",closeFromRootOutside,{passive:false,capture:true});root.addEventListener("touchend",closeFromRootOutside,{passive:false,capture:true});}
lpBindMobileTapAction(btnToggle,"lpMsToggleTapBound",()=>{const open=root.classList.contains("lp-expanded");lpSetMobileSheetExpanded(!open);},{movePx:12,tapMs:760});lpBindMobileTapAction(btnOpenMap,"lpMsOpenMapTapBound",()=>{showLocalMapModal(graph);},{movePx:12,tapMs:760});fogSwitch&&fogSwitch.addEventListener("change",()=>{const enabled=!!fogSwitch.checked;lpSetFogEnabled(enabled);const modalNow=document.getElementById("lp-map-modal");if(modalNow&&modalNow.classList.contains("lp-open")){requestAnimationFrame(()=>renderLocalMapModal(graph));}});}
let forceCollapsed=false;const currentSheetPage=normLoc(currentRelPath());try{const flag=sessionStorage.getItem(LP_MOBILE_SHEET_NAV_KEY)||"";if(flag&&normLoc(flag)===currentSheetPage){forceCollapsed=true;sessionStorage.removeItem(LP_MOBILE_SHEET_NAV_KEY);}}catch(_){}
if(!forceCollapsed){try{const lastMountedPage=lpGetMobileSheetLastPage();if(lastMountedPage&&lastMountedPage!==currentSheetPage)forceCollapsed=true;}catch(_){}}
if(forceCollapsed){lpSetMobileSheetExpandedImmediate(false);}else{lpSetMobileSheetExpandedImmediate(lpGetMobileSheetState()==="expanded");}
try{lpSetMobileSheetLastPage(currentSheetPage);}catch(_){}
bindMobileSheetLinkGestures();}
if(!window.__lpMobileSheetMotionSyncInstalled){window.__lpMobileSheetMotionSyncInstalled=true;window.addEventListener("mk:site-motion-change",lpSyncMobileSheetMotionPreference);window.addEventListener("mk:motionchange",lpSyncMobileSheetMotionPreference);}
function lpEmitPanelShellMounted(panel,loc){try{window.__lpShellMountedRel=normLoc(loc||currentRelPath());window.dispatchEvent(new CustomEvent("lp:shell-mounted",{detail:{relPath:window.__lpShellMountedRel,panelId:panel&&panel.id||""}}));}catch(_){}}
function lpEmitPanelReady(panel,loc){try{window.__lpPanelReadyRel=normLoc(loc||currentRelPath());window.dispatchEvent(new CustomEvent("lp:panel-ready",{detail:{relPath:window.__lpPanelReadyRel,panelId:panel&&panel.id||""}}));}catch(_){}}
function lpMarkPanelReady(panel,loc){if(!panel)return;try{delete panel.dataset.lpShell;}catch(_){try{panel.removeAttribute("data-lp-shell");}catch(__){}}
try{delete panel.dataset.lpEarlyShell;}catch(_){try{panel.removeAttribute("data-lp-early-shell");}catch(__){}}
try{panel.removeAttribute("aria-busy");}catch(_){}
try{panel.classList.remove("lp-pending");}catch(_){}
try{lpSyncDesktopPanelShiftNow();}catch(_){}
lpEmitPanelReady(panel,loc);}
function mountPanelShell(currentLoc){const loc=normLoc(currentLoc||currentRelPath());if(!loc||!isConceptPage(loc))return null;try{injectStylesOnce();}catch(_){}
try{ensureGpsStylesOnce();}catch(_){}
try{lpEnsureAuxMapPatchStyles();}catch(_){}
const existing=document.getElementById("lp-side-panel");if(existing){const existingLoc=normLoc(existing.dataset&&existing.dataset.lpCurrentLoc);if(existingLoc===loc){lpEmitPanelShellMounted(existing,loc);return existing;}}
const host=ensurePanelHost();if(!host)return null;const prevUiState=existing?lpSnapshotPanelUiState(existing):null;const panel=existing||document.createElement("div");panel.id="lp-side-panel";panel.className="lp-pending";panel.dataset.lpCurrentLoc=loc;panel.dataset.lpShell="1";panel.innerHTML=`
      <div class="lp-head">
        <div class="lp-title">Concept connections</div>
      </div>
      <details class="lp-acc lp-forward lp-deps" open>
        <summary class="lp-sum" aria-label="Toggle Dependents section">
          <span class="lp-sum-left">Dependents</span>
          <span class="lp-sum-right"><span class="lp-sum-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg></span></span>
        </summary>
        <div class="lp-body"><div class="lp-empty">Loading...</div></div>
      </details>
      <details class="lp-acc lp-pres" open>
        <summary class="lp-sum" aria-label="Toggle Prerequisites section">
          <span class="lp-sum-left">Prerequisites</span>
          <span class="lp-sum-right"><span class="lp-sum-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg></span></span>
        </summary>
        <div class="lp-body"><div class="lp-empty">Loading...</div></div>
      </details>
      <details class="lp-acc lp-rel" open>
        <summary class="lp-sum" aria-label="Toggle Related concepts section">
          <span class="lp-sum-left">Related concepts</span>
          <span class="lp-sum-right"><span class="lp-sum-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg></span></span>
        </summary>
        <div class="lp-body"><div class="lp-empty">Loading...</div></div>
      </details>
    `;if(lpIsMobileSheet()){const article=document.querySelector("article.md-content__inner")||document.querySelector(".md-content__inner");const mountHost=(article&&article.parentElement)?article.parentElement:(document.querySelector("main.md-main")||document.body);if(panel.parentElement!==mountHost)mountHost.appendChild(panel);}else if(isSecondaryHost(host)){if(panel.parentElement!==host)host.insertAdjacentElement("afterbegin",panel);}else{const article=document.querySelector("article.md-content__inner")||document.querySelector(".md-content__inner");const mountHost=(article&&article.parentElement)?article.parentElement:(document.querySelector("main.md-main")||document.body);if(panel.parentElement!==mountHost)mountHost.appendChild(panel);}
try{lpEnsurePanelSectionChevrons(panel);}catch(_){}
try{lpRestorePanelUiState(panel,prevUiState);}catch(_){}
try{lpSyncDesktopPanelShiftNow();}catch(_){}
lpEmitPanelShellMounted(panel,loc);return panel;}
function mountPanel(graph){const host=ensurePanelHost();if(!host)return null;const old=document.getElementById("lp-side-panel");try{if(old&&window.getComputedStyle){const oldShift=window.getComputedStyle(old).getPropertyValue("--lp-panel-right-shift");if(oldShift)document.documentElement.style.setProperty("--lp-desktop-panel-right-shift-current",oldShift.trim());}}catch(_){}
const currentLoc=normLoc(currentRelPath());if(!currentLoc||!isConceptPage(currentLoc))return null;const panelTitleCache=new Map();const panelTitleFor=(loc)=>{const k=normLoc(loc);if(!k)return"";if(panelTitleCache.has(k))return panelTitleCache.get(k);const title=nodeTitle(graph,k);panelTitleCache.set(k,title);return title;};const depsAll=rankDependents(graph,currentLoc,panelTitleFor);const forward=depsAll.filter((x)=>x.m!==3).slice(0,6);const prereqsAll=suggestBackfill(graph,currentLoc,99,panelTitleFor);const prereqTotal=prereqsAll.length;let prereqReadyStrong=0;let prereqSumWeighted=0;for(const it of prereqsAll){const r=masteryReady(it.m,it.rec);prereqSumWeighted+=r;if(r>=1)prereqReadyStrong+=1;}
const prereqPct=prereqTotal?Math.round((prereqSumWeighted/prereqTotal)*100):0;const prereqRightText=prereqTotal?`${prereqReadyStrong}/${prereqTotal} (${prereqPct}%)`:`None`;const usedLocs=new Set();const usedTitles=new Set();const normTitleKey=(s)=>cleanTitle(s||"").toLowerCase();const addUsed=(it)=>{if(!it)return;const loc=it.loc?normLoc(it.loc):"";if(loc)usedLocs.add(loc);const tk=normTitleKey(it.title);if(tk)usedTitles.add(tk);};for(const it of(forward||[]))addUsed(it);for(const it of(prereqsAll||[]))addUsed(it);const filterOutUsed=(items)=>{const out=[];const seenLoc=new Set();const seenTitle=new Set();const currentCanon=lpCanonKey(currentLoc);for(const it of(items||[])){if(!it)continue;const loc=it.loc?normLoc(it.loc):"";if(loc&&lpCanonKey(loc)===currentCanon)continue;const incomingTitle=cleanTitle(it.title||"");const resolvedTitle=incomingTitle||(loc?panelTitleFor(loc):"");const tk=normTitleKey(resolvedTitle||it.title);if(loc&&usedLocs.has(loc))continue;if(tk&&usedTitles.has(tk))continue;if(loc&&seenLoc.has(loc))continue;if(tk&&seenTitle.has(tk))continue;if(loc)seenLoc.add(loc);if(tk)seenTitle.add(tk);out.push({loc:loc||it.loc,title:resolvedTitle||cleanTitle(it.title||""),titleHtml:it.titleHtml||it.html||""});}
return out;};let relatedItemsFromBodyRaw=extractConceptLinksFromLiveSection(/^related concepts$/i);if(!relatedItemsFromBodyRaw.length)relatedItemsFromBodyRaw=extractConceptLinksFromLiveSection(/^related$/i);try{(relatedItemsFromBodyRaw||[]).forEach((it)=>{if(!it||!it.loc)return;if(it.title)__lpSetTitleCache(graph,it.loc,it.title,false);if(it.titleHtml)__lpSetTitleHtmlCache(graph,it.loc,it.titleHtml,false);});}catch(_){}
try{const arr=(relatedItemsFromBodyRaw||[]).map((x)=>(x&&x.loc)?normLoc(x.loc):"").filter((loc2)=>loc2&&lpCanonKey(loc2)!==lpCanonKey(currentLoc));__lpSetRelatedCache(graph,currentLoc,arr);}catch(_){}
const related=getRelated(graph,currentLoc);const relatedItemsFromBody=filterOutUsed(relatedItemsFromBodyRaw);const relatedLocObjs=filterOutUsed((related||[]).map((loc)=>({loc,title:panelTitleFor(loc)})));const relatedBodyByCanon=new Map();try{(relatedItemsFromBodyRaw||[]).forEach((x)=>{if(!x||!x.loc)return;const k=lpCanonKey(x.loc);if(!k||relatedBodyByCanon.has(k))return;relatedBodyByCanon.set(k,x);});}catch(_){}
const relatedMerged=filterOutUsed(uniq([...((relatedItemsFromBodyRaw||[]).map((x)=>x&&x.loc).filter(Boolean)),...(related||[])]).map((loc)=>{const bodyItem=relatedBodyByCanon.get(lpCanonKey(loc))||null;return{loc,title:(bodyItem&&bodyItem.title)||panelTitleFor(loc),titleHtml:(bodyItem&&bodyItem.titleHtml)||""};}));let relatedCount=0;let relatedListHtml=`<div class="lp-empty">None.</div>`;if(relatedMerged.length){relatedCount=relatedMerged.length;relatedListHtml=buildList(relatedMerged.slice(0,12),graph,panelTitleFor);}
try{const sidebarSeedLocs=uniq([currentLoc,...((forward||[]).map((x)=>x&&x.loc).filter(Boolean)),...((prereqsAll||[]).map((x)=>x&&x.loc).filter(Boolean)),...((relatedItemsFromBodyRaw||[]).map((x)=>x&&x.loc).filter(Boolean)),...(related||[])]);__mkRunIdle(()=>{try{__lpPrefetchRelatedForLocs(graph,sidebarSeedLocs,null,20);}catch(_){}},1200);}catch(_){}
const prevUiState=old?lpSnapshotPanelUiState(old):null;const panel=old||document.createElement("div");panel.id="lp-side-panel";panel.className="lp-pending";panel.dataset.lpCurrentLoc=currentLoc;panel.innerHTML=`
      <div class="lp-head">
        <div class="lp-title">Concept connections</div>
      </div>

      <details class="lp-acc lp-forward lp-deps" open>
        <summary class="lp-sum" aria-label="Toggle Dependents section">
          <span class="lp-sum-left">Dependents</span>
          <span class="lp-sum-right"><span class="lp-sum-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg></span></span>
        </summary>
        <div class="lp-body">${buildList(forward, graph, panelTitleFor)}</div>
      </details>

      <details class="lp-acc lp-pres" open>
        <summary class="lp-sum" aria-label="Toggle Prerequisites section">
          <span class="lp-sum-left">Prerequisites</span>
          <span class="lp-sum-right"><span class="lp-sum-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg></span></span>
        </summary>
        <div class="lp-body">${buildList(prereqsAll, graph, panelTitleFor)}</div>
      </details>

      <details class="lp-acc lp-rel" open>
        <summary class="lp-sum" aria-label="Toggle Related concepts section">
          <span class="lp-sum-left">Related concepts</span>
          <span class="lp-sum-right"><span class="lp-sum-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg></span></span>
        </summary>
        <div class="lp-body">${relatedListHtml}</div>
      </details>

      <div class="lp-local">
        <div class="lp-local-row">
          <span class="lp-local-title">Concept maps</span>
          <div class="lp-local-actions">
            <button class="lp-icon-btn lp-local-open" type="button" data-lp-open-map title="Open concept maps" aria-label="Open concept maps">${lpMapButtonSvg()}</button>
          </div>
        </div>
        <div class="lp-body">
          <div class="lp-mini">
            <span class="lp-mini-note">Explore nearby concepts, prerequisites, and dependents in three connected map views.</span>
          </div>
          <div class="lp-fog-row">
            <span class="lp-fog-copy">
              <span class="lp-fog-title">Knowledge masking</span>
              <span class="lp-fog-note">Turn on or off blur and question-mark hiding in the local map.</span>
            </span>
            <label class="lp-ios-switch" aria-label="Turn knowledge masking on or off">
              <input type="checkbox" data-lp-fog-switch ${lpFogEnabled() ? 'checked' : ''}>
              <span class="lp-ios-switch-ui" aria-hidden="true"></span>
            </label>
          </div>
        </div>
      </div>
    `;try{lpEnsurePanelSectionChevrons(panel);}catch(_){}
try{lpRestorePanelUiState(panel,prevUiState);}catch(_){}
try{lpBindMobileSectionSummaryTaps(panel);}catch(_){}
if(old&&lpIsMobileSheet()){mountMobileSheet(panel,graph);}else if(old){if(isSecondaryHost(host)){if(panel.parentElement!==host)host.insertAdjacentElement("afterbegin",panel);}else{const article=document.querySelector("article.md-content__inner")||document.querySelector(".md-content__inner");const mountHost=(article&&article.parentElement)?article.parentElement:(document.querySelector("main.md-main")||document.body);if(panel.parentElement!==mountHost)mountHost.appendChild(panel);}
try{lpBindMobileSectionSummaryTaps(panel);}catch(_){}}else if(lpIsMobileSheet()){mountMobileSheet(panel,graph);}else if(isSecondaryHost(host)){host.insertAdjacentElement("afterbegin",panel);}else{const article=document.querySelector("article.md-content__inner")||document.querySelector(".md-content__inner");const mountHost=(article&&article.parentElement)?article.parentElement:(document.querySelector("main.md-main")||document.body);mountHost.appendChild(panel);}
const mapBtn=panel.querySelector('[data-lp-open-map]');if(mapBtn)lpBindTap(mapBtn,()=>showLocalMapModal(graph));const gpsBtn=panel.querySelector('[data-lp-open-gps]');const fogSwitch=panel.querySelector('[data-lp-fog-switch]');if(fogSwitch){fogSwitch.checked=lpFogEnabled();const syncFogUi=()=>{try{fogSwitch.checked=lpFogEnabled();}catch(_){}};fogSwitch.addEventListener('change',()=>{const enabled=!!fogSwitch.checked;lpSetFogEnabled(enabled);const modalNow=document.getElementById('lp-map-modal');if(modalNow&&modalNow.classList.contains('lp-open')){requestAnimationFrame(()=>renderLocalMapModal(graph));}});if(!window.__lpFogUiSyncInstalled){window.__lpFogUiSyncInstalled=true;window.addEventListener('lp:fog-change',()=>{try{document.querySelectorAll('[data-lp-fog-switch], [data-lp-ms-fog-switch]').forEach((el)=>{el.checked=lpFogEnabled();});}catch(_){}});}
syncFogUi();}
hideRedundantBodySections();return panel;}
function lpH1RouteStopHtml(graph,loc,idx,opts){const options=opts&&typeof opts==='object'?opts:{};const title=cleanTitle(nodeTitle(graph,loc)||loc||'');const classes=['lp-h1-route-stop'];if(options.kind)classes.push(`is-${options.kind}`);if(options.isCurrent)classes.push('is-current');if(options.isStart)classes.push('is-start');if(options.isEnd)classes.push('is-end');const href=toAbsoluteUrl(loc);const aria=options.isCurrent?`Current step: ${title}`:`${options.kind === 'start' ? 'Start' : (options.kind === 'end' ? 'Target' : 'Route step')}: ${title}`;const inner=options.isCurrent?`<span class="lp-h1-route-marker" aria-hidden="true">${lpH1RouteMarkerSvg()}</span>`:'<span class="lp-h1-route-dotcore" aria-hidden="true"></span>';return`<a href="${href}" data-lp-loc="${escapeHtml(normLoc(loc))}" data-lp-h1-route-jump="${escapeHtml(String(idx))}" class="${classes.join(' ')}" aria-label="${escapeHtml(aria)}">${inner}<span class="lp-sr-only">${escapeHtml(title)}</span></a>`;}
function lpH1RouteTargetHtml(graph,loc,idx,opts){const options=opts&&typeof opts==='object'?opts:{};const display=lpNodeTitleDisplay(graph,loc,nodeTitle(graph,loc));const titleText=cleanTitle(display.text||nodeTitle(graph,loc)||loc||'');const href=toAbsoluteUrl(loc);const aria=options.isCurrent?`Current target: ${titleText}`:`Target: ${titleText}`;if(options.mobileIconOnly){const classes=['lp-h1-route-target','lp-h1-route-target--icon'];if(options.isCurrent)classes.push('is-current');if(options.isEnd)classes.push('is-end');return`<a href="${href}" data-lp-loc="${escapeHtml(normLoc(loc))}" data-lp-h1-route-jump="${escapeHtml(String(idx))}" class="${classes.join(' ')}" aria-label="${escapeHtml(aria)}"><span class="lp-h1-route-target-icon" aria-hidden="true">${lpH1RouteTargetPinSvg()}</span><span class="lp-sr-only">${escapeHtml(titleText)}</span></a>`;}
const titleHtmlRaw=String(display.html||'').trim();const titleHtmlHasRenderedMath=/<(?:mjx-container|math)\b|class=["\'][^"\']*katex/i.test(titleHtmlRaw);const titleNeedsTypeset=titleHtmlRaw?(!titleHtmlHasRenderedMath&&lpHasMathMarkup(titleHtmlRaw)):lpHasMathMarkup(titleText);const titleHtml=titleHtmlRaw||escapeHtml(titleText);const textClass=`lp-h1-route-target-text${titleNeedsTypeset ? ' lp-math-pending' : ''}`;const textAttrs=titleNeedsTypeset?` data-lp-pending-math="1" data-lp-raw-title="${escapeHtml(titleText)}"`:'';const classes=['lp-h1-route-target'];if(options.isCurrent)classes.push('is-current');if(options.isEnd)classes.push('is-end');const pinHtml=options.isEnd?`<span class="lp-h1-route-target-pin" aria-hidden="true">${lpH1RouteTargetPinSvg()}</span>`:'';return`<a href="${href}" data-lp-loc="${escapeHtml(normLoc(loc))}" data-lp-h1-route-jump="${escapeHtml(String(idx))}" class="${classes.join(' ')}" aria-label="${escapeHtml(aria)}">${pinHtml}<span class="${textClass}"${textAttrs}>${titleHtml}</span></a>`;}
function lpTypesetPendingH1RouteMath(graph,root){const host=root&&root.querySelectorAll?root:null;if(!host)return Promise.resolve();const pending=Array.from(host.querySelectorAll('[data-lp-pending-math="1"]'));if(!pending.length)return Promise.resolve();pending.forEach((el)=>{try{lpSetPendingRouteTargetTitle(el,el.getAttribute('data-lp-raw-title')||el.textContent||'');}catch(_){}});return typesetMathSafe(pending).catch(()=>{}).then(()=>{pending.forEach((el)=>{try{el.classList.remove('lp-math-pending');el.removeAttribute('data-lp-pending-math');const anchor=el.closest&&el.closest('[data-lp-loc]');const loc=anchor&&anchor.dataset?normLoc(anchor.dataset.lpLoc||''):'';const html=String(el.innerHTML||'').trim();if(loc&&html)__lpSetTitleHtmlCache(graph,loc,html,true);}catch(_){}});});}
function lpH1RouteDotsHtml(graph,path,fromIndex,toIndexExclusive){const start=Math.max(0,Number(fromIndex)||0);const end=Math.max(start,Number(toIndexExclusive)||0);const items=[];for(let idx=start;idx<end;idx+=1){const loc=normLoc(path[idx]);if(!loc)continue;items.push(lpH1RouteStopHtml(graph,loc,idx,{kind:'mid'}));}
if(!items.length)return'';return`<span class="lp-h1-route-dots">${items.join('')}</span>`;}
function lpRenderH1RouteBar(graph,currentLoc){const cur=normLoc(currentLoc||currentRelPath());const state=lpGpsSyncRouteStateForPage(cur);if(!state||!Array.isArray(state.path)||!state.path.length)return'';const idx=lpGpsRouteIndexForLoc(state,cur);if(idx<0)return'';const path=state.path.slice();const last=path.length-1;const isMobile=!!(window.matchMedia&&window.matchMedia('(max-width: 768px)').matches);const pieces=isMobile?[]:['<span class="lp-h1-route-label">Guided study</span>'];const pushPiece=(html,withArrow=true)=>{const s=String(html||'').trim();if(!s)return;if(withArrow&&pieces.length)pieces.push('<span class="lp-h1-route-arrow" aria-hidden="true">→</span>');pieces.push(s);};if(idx===0){pushPiece(lpH1RouteStopHtml(graph,normLoc(path[0]),0,{kind:'start',isStart:true,isCurrent:true}),false);pushPiece(lpH1RouteDotsHtml(graph,path,1,last));if(last>0)pushPiece(lpH1RouteTargetHtml(graph,normLoc(path[last]),last,{isEnd:true,mobileIconOnly:isMobile}));}else if(idx===last){pushPiece(lpH1RouteStopHtml(graph,normLoc(path[0]),0,{kind:'start',isStart:true}),false);pushPiece(lpH1RouteDotsHtml(graph,path,1,last));pushPiece(lpH1RouteTargetHtml(graph,normLoc(path[last]),last,{isEnd:true,isCurrent:true,mobileIconOnly:isMobile}));}else{pushPiece(lpH1RouteStopHtml(graph,normLoc(path[0]),0,{kind:'start',isStart:true}),false);pushPiece(lpH1RouteDotsHtml(graph,path,1,idx));pushPiece(lpH1RouteStopHtml(graph,normLoc(path[idx]),idx,{kind:'current',isCurrent:true}));pushPiece(lpH1RouteDotsHtml(graph,path,idx+1,last));pushPiece(lpH1RouteTargetHtml(graph,normLoc(path[last]),last,{isEnd:true,mobileIconOnly:isMobile}));}
return`
      <div class="lp-h1-routebar" data-lp-h1-routebar="1" aria-label="Guided study progress">
        <div class="lp-h1-route-track">${pieces.join('')}</div>
      </div>
    `;}
function lpH1StudyRouteRevealSetForState(state){if(!state||typeof state!=="object")return new Set(lpSharedRevealSet());if(state.revealedRouteNodes instanceof Set){try{lpSharedRevealSet().forEach((key)=>state.revealedRouteNodes.add(key));}catch(_){}
return state.revealedRouteNodes;}
const src=Array.isArray(state.revealedRouteNodes)?state.revealedRouteNodes:[];state.revealedRouteNodes=new Set(src.map((x)=>lpCanonKey(x)).filter(Boolean));try{lpSharedRevealSet().forEach((key)=>state.revealedRouteNodes.add(key));}catch(_){}
return state.revealedRouteNodes;}
function lpH1StudyRouteRevealKey(state,loc){const key=lpCanonKey(loc||'');if(!key)return false;if(lpSharedRevealHas(key))return true;return lpH1StudyRouteRevealSetForState(state).has(key);}
function lpH1StudyRouteNodeMaskMode(opts,loc,depth){const cfgMode=lpRouteMapMode(opts&&opts.mode);const key=lpCanonKey(loc||"");const targetKey=lpCanonKey((opts&&opts.target)||currentRelPath());const revealed=opts&&opts.revealedRouteNodes instanceof Set?opts.revealedRouteNodes:new Set();if(!lpFogEnabled())return"none";if(!key)return"none";if(targetKey&&key===targetKey)return"none";if(revealed.has(key))return"none";if(lpWasVisited(loc))return"none";if(cfgMode===LP_ROUTE_MAP_MODE.FROM_HERE){return Number(depth)>1?"weak":"none";}
return"full";}
function lpMapTabHelperText(kind,isPhone){const phone=typeof isPhone==="boolean"?isPhone:!!__lpIsPhoneTouch();if(String(kind||"")==="local"){return phone?"Long press a node to inspect knowledge flow, local relationships, and reveal unknown node titles. Short tap to jump.":"Hover to inspect knowledge flow, local relationships, and reveal unknown node titles. Click to jump.";}
return phone?"Tap a node to find a learning path. Tap Start guided study to begin along the path.":"Click a node to find a learning path. Click Start guided study to begin along the path.";}
function lpMapTipsIsPhone(root){try{return!!(__lpIsPhoneTouch()||(window.matchMedia&&window.matchMedia('(max-width: 900px)').matches));}catch(_){return false;}}
function lpMapTipsSet(root,kind){try{if(!root||!root.querySelector)return;const phone=lpMapTipsIsPhone(root);const btn=root.querySelector('[data-lp-map-tip-toggle]');const panel=root.querySelector('[data-lp-map-helper-panel]');const textEl=btn&&btn.querySelector?btn.querySelector('.lp-map-tipbtn-text, .lp-h1sg-tipbtn-text'):null;const text=lpMapTabHelperText(kind,phone);if(panel)panel.textContent=text;if(btn){btn.setAttribute('aria-label','Map tips');btn.setAttribute('title','Map tips');}
if(textEl)textEl.textContent=phone?'':'Map tips';root.classList.toggle('lp-map-tip-phone',!!phone);if(panel&&panel.hidden===false){requestAnimationFrame(()=>{lpMapTipsReposition(root);});}}catch(_){}}
function lpSyncMapTabs(root,activeKind){try{const host=root&&root.querySelectorAll?root:null;if(!host)return;Array.from(host.querySelectorAll('[data-lp-map-tab]')).forEach((btn)=>{if(!btn)return;const kind=String((btn.getAttribute&&btn.getAttribute('data-lp-map-tab'))||'').trim();const on=kind===String(activeKind||'').trim();btn.classList.toggle('is-active',on);try{btn.setAttribute('aria-selected',on?'true':'false');}catch(_){}
try{btn.setAttribute('tabindex',on?'0':'-1');}catch(_){}});lpMapTipsSet(host,activeKind);}catch(_){}}
function lpOpenMapTab(kind,graph){const next=String(kind||'').trim();const activeGraph=graph||window.__lpLearningPathGraph||null;if(!next)return;const routeModal=lpRouteMapActiveModal();const routeTarget=normLoc((routeModal&&routeModal.dataset&&routeModal.dataset.lpTargetLoc)||(routeModal&&routeModal.__lpH1StudyState&&routeModal.__lpH1StudyState.target)||currentRelPath());if(next==='local'){try{hideH1StudyStartModal();}catch(_){}
try{hideLocalMapModal();}catch(_){}
requestAnimationFrame(()=>{try{showLocalMapModal(activeGraph);}catch(_){}});return;}
if(next===LP_ROUTE_MAP_MODE.TO_HERE||next===LP_ROUTE_MAP_MODE.FROM_HERE){try{hideLocalMapModal();}catch(_){}
try{hideH1StudyStartModal();}catch(_){}
requestAnimationFrame(()=>{try{showH1StudyStartModal(activeGraph,routeTarget||currentRelPath(),next);}catch(_){}});}}
function lpRouteMapConfig(rawMode){const mode=lpRouteMapMode(rawMode);if(mode===LP_ROUTE_MAP_MODE.FROM_HERE){return{mode,helperText:lpMapTabHelperText(LP_ROUTE_MAP_MODE.FROM_HERE,__lpIsPhoneTouch()),filterPlaceholder:"Find a dependent",ariaLabel:"Concept maps: dependents",switchLabel:"Switch to To here",switchAriaLabel:"Switch to the To here map",switchMode:LP_ROUTE_MAP_MODE.TO_HERE,menuOptions:[],launchText:"Start guided study",loadingLine:"Rendering the full dependents map…",prepLine:"Preparing the dependents map…",};}
return{mode,helperText:lpMapTabHelperText(LP_ROUTE_MAP_MODE.TO_HERE,__lpIsPhoneTouch()),filterPlaceholder:"Find a prerequisite",ariaLabel:"Concept maps: prerequisites",switchLabel:"Switch to From here",switchAriaLabel:"Switch to the From here map",switchMode:LP_ROUTE_MAP_MODE.FROM_HERE,menuOptions:[],launchText:"Start guided study",loadingLine:"Rendering the full guided study map…",prepLine:"Preparing the guided study route…",};}
function lpH1StudyStartDistanceMap(graph,targetLoc,mode,maxDepth){const cfg=lpRouteMapConfig(mode);const target=normLoc(targetLoc||currentRelPath());const depthLimit=Math.max(1,Number(maxDepth)||LP_ROUTE_MAP_MAX_DISTANCE);const dist=new Map();if(!graph||!target||!isConceptPage(target))return dist;const q=[target];dist.set(target,0);for(let qi=0;qi<q.length;qi+=1){const cur=q[qi];const d=Number(dist.get(cur)||0);if(d>=depthLimit)continue;const nextLocs=lpRouteMapFollowsForward(cfg.mode)?getDependents(graph,cur):getPrereqs(graph,cur);for(const raw of nextLocs){const next=normLoc(raw);if(!next||!isConceptPage(next))continue;const nd=d+1;if(nd>depthLimit)continue;if(!dist.has(next)||nd<Number(dist.get(next)||0)){dist.set(next,nd);q.push(next);}}}
return dist;}
function lpH1StudyStartPath(graph,startLoc,targetLoc,distMap,parentOf,mode){const cfg=lpRouteMapConfig(mode);const start=normLoc(startLoc||"");const target=normLoc(targetLoc||currentRelPath());const dist=distMap instanceof Map?distMap:lpH1StudyStartDistanceMap(graph,target,cfg.mode);const parentMap=parentOf instanceof Map?parentOf:null;if(!start||!target||!dist.has(start))return[];if(lpCanonKey(start)===lpCanonKey(target))return[target];const towardRoot=[];const seen=new Set();let cur=start;let guard=0;if(parentMap&&parentMap.size){while(cur&&!seen.has(lpCanonKey(cur))&&guard<512){guard+=1;towardRoot.push(cur);seen.add(lpCanonKey(cur));if(lpCanonKey(cur)===lpCanonKey(target))break;const next=normLoc(parentMap.get(cur)||"");if(!next)break;cur=next;}
if(!towardRoot.length||lpCanonKey(towardRoot[towardRoot.length-1]||"")!==lpCanonKey(target)){towardRoot.push(target);}}else{cur=start;guard=0;while(cur&&!seen.has(lpCanonKey(cur))&&guard<512){guard+=1;towardRoot.push(cur);seen.add(lpCanonKey(cur));if(lpCanonKey(cur)===lpCanonKey(target))break;const curDist=Number(dist.get(cur));if(!Number.isFinite(curDist)||curDist<=0)break;const options=uniq(lpRouteMapFollowsForward(cfg.mode)?getPrereqs(graph,cur):getDependents(graph,cur)).map(normLoc).filter(Boolean).filter((next)=>dist.has(next)&&Number(dist.get(next))===curDist-1).filter((next)=>!seen.has(lpCanonKey(next))).sort((a,b)=>{const ta=cleanTitle(nodeTitle(graph,a)||a||"");const tb=cleanTitle(nodeTitle(graph,b)||b||"");return ta.localeCompare(tb,undefined,{sensitivity:"base"});});if(!options.length)break;cur=options[0]||"";}
if(!towardRoot.length||lpCanonKey(towardRoot[towardRoot.length-1]||"")!==lpCanonKey(target)){towardRoot.push(target);}}
const normalized=lpGpsNormalizeRoutePath(towardRoot);if(!normalized.length)return[];return lpRouteMapFollowsForward(cfg.mode)?normalized.slice().reverse():normalized;}
function lpH1StudyStartTree(graph,targetLoc,mode){const cfg=lpRouteMapConfig(mode);const target=normLoc(targetLoc||currentRelPath());const distMap=lpH1StudyStartDistanceMap(graph,target,cfg.mode);if(!target)return{target,distMap,layers:[],layerMap:new Map(),maxDepth:0,mode:cfg.mode};if(!distMap.has(target))distMap.set(target,0);const layerMap=new Map();for(const[loc,depthRaw]of distMap.entries()){const depth=Math.max(0,Number(depthRaw)||0);if(!layerMap.has(depth))layerMap.set(depth,[]);layerMap.get(depth).push(loc);}
const layers=Array.from(layerMap.keys()).sort((a,b)=>a-b).map((depth)=>{const arr=(layerMap.get(depth)||[]).slice().sort((a,b)=>{const ta=cleanTitle(nodeTitle(graph,a)||a||"");const tb=cleanTitle(nodeTitle(graph,b)||b||"");return ta.localeCompare(tb,undefined,{sensitivity:"base"});});return{depth,nodes:arr};});return{target,distMap,layers,layerMap,maxDepth:layers.length?layers[layers.length-1].depth:0,mode:cfg.mode};}
function lpH1StudyStartNodeContent(graph,loc,opts){const rec=getMastery(loc);const m=rec&&typeof rec.m==="number"?rec.m:null;const visual=lpMapVisualForLoc(loc)||{key:"seen"};const rawTitle=cleanTitle(nodeTitle(graph,loc)||loc||"");const display=lpNodeTitleDisplay(graph,loc,rawTitle);const html=String((display&&display.html)||"").trim();const hasMath=!!(lpHasMathMarkup(rawTitle||"")||lpHasMathMarkup(html||""));const maskMode=lpH1StudyRouteNodeMaskMode(opts||{},loc,Number(opts&&opts.depth)||0);const masked=maskMode!=="none";const wrap=document.createElement("span");wrap.className="lp-node-label";if(!masked&&lpHasExplicitMastery(rec,m)){const prefix=document.createElement("span");prefix.className="lp-node-prefix";prefix.setAttribute("aria-hidden","true");prefix.innerHTML=lpMasteryIcon(m)||"";wrap.appendChild(prefix);}
const titleSpan=document.createElement("span");titleSpan.className="lp-node-title";titleSpan.setAttribute("data-lp-raw-title",rawTitle||loc||"");if(masked)titleSpan.textContent=lpH1StudyRouteMaskText(rawTitle||loc||"");else if(html)titleSpan.innerHTML=__lpSanitizeRenderedMathHtml(html);else titleSpan.textContent=rawTitle||loc||"";wrap.appendChild(titleSpan);return{titleText:rawTitle||loc||"",el:wrap,visualKey:visual.key||"",hasMath,rawHtml:html,maskMode,masked,maskText:lpH1StudyRouteMaskText(rawTitle||loc||"")};}
function lpH1StudyStartMatches(graph,loc,query){const tokens=lpH1StudyStartQueryTokens(query);if(!tokens.length)return true;const title=cleanTitle(nodeTitle(graph,loc)||loc||"").toLowerCase();const hay=`${title} ${String(loc || "").toLowerCase()}`;return tokens.every((tok)=>hay.includes(tok));}
function lpH1StudyStartHighlightTitleHtml(rawTitle,query){const text=String(rawTitle||"");const tokens=lpH1StudyStartQueryTokens(query);if(!text)return"";if(!tokens.length)return escapeHtml(text);const uniqTokens=Array.from(new Set(tokens)).sort((a,b)=>b.length-a.length);const re=new RegExp(`(${uniqTokens.map(lpH1StudyStartEscapeRegex).join("|")})`,"ig");const parts=[];let last=0;let m;while((m=re.exec(text))){if(m.index>last)parts.push(escapeHtml(text.slice(last,m.index)));parts.push(`<mark class="lp-h1sg-hit">${escapeHtml(m[0])}</mark>`);last=m.index+m[0].length;}
if(last<text.length)parts.push(escapeHtml(text.slice(last)));return parts.join("");}
function lpH1StudyStartPaintNodeQuery(nodeEl,query){if(!nodeEl||!nodeEl.querySelector)return;const titleEl=nodeEl.querySelector('.lp-node-title');if(!titleEl)return;const rawTitle=String(nodeEl.getAttribute('data-lp-raw-title')||titleEl.textContent||'').trim();const rawHtml=String(nodeEl.getAttribute('data-lp-raw-html')||'').trim();const hasMath=String(nodeEl.getAttribute('data-lp-has-math')||'')==='1'||lpHasMathMarkup(rawTitle)||lpHasMathMarkup(rawHtml);if(!rawTitle&&!rawHtml)return;const q=lpH1StudyStartNormQuery(query);if(hasMath){if(rawHtml)titleEl.innerHTML=__lpSanitizeRenderedMathHtml(rawHtml);else titleEl.textContent=rawTitle;lpMaybeTypesetNodeTitleEl(nodeEl);return;}
if(!q){if(rawHtml)titleEl.innerHTML=__lpSanitizeRenderedMathHtml(rawHtml);else titleEl.textContent=rawTitle;return;}
titleEl.innerHTML=lpH1StudyStartHighlightTitleHtml(rawTitle,q);}
function lpH1StudyRouteNodeMasked(nodeEl,state){if(!nodeEl)return false;const mode=String((nodeEl.dataset&&nodeEl.dataset.lpRouteMaskMode)||'').trim();if(!mode||mode==='none')return false;const key=lpCanonKey((nodeEl.getAttribute&&nodeEl.getAttribute('data-lp-loc'))||'');const revealed=lpH1StudyRouteRevealKey(state,key);const preview=!!(nodeEl.dataset&&nodeEl.dataset.lpRouteMaskPreview==='1');return!(revealed||preview);}
function lpH1StudyRouteNodeBlurPx(nodeEl,state,masked){try{const loc=normLoc((nodeEl&&nodeEl.getAttribute&&nodeEl.getAttribute('data-lp-loc'))||'');const visual=lpMapVisualForLoc(loc)||{blurPx:0};const mode=String((nodeEl&&nodeEl.dataset&&nodeEl.dataset.lpRouteMaskMode)||'').trim();if(!masked)return 0;const base=Math.max(Number(visual&&visual.blurPx)||0,mode==='weak'?0.65:1.05);return base;}catch(_){return masked?0.9:0;}}
function lpH1StudyRouteApplyNodeMask(nodeEl,state){if(!nodeEl||!nodeEl.querySelector)return false;const titleEl=nodeEl.querySelector('.lp-node-title');if(!titleEl)return false;const mode=String((nodeEl.dataset&&nodeEl.dataset.lpRouteMaskMode)||'').trim();if(!mode||mode==='none'){nodeEl.classList.remove('is-route-masked','is-route-masked-full','is-route-masked-weak','is-route-preview');nodeEl.style.filter='none';lpH1StudyStartPaintNodeQuery(nodeEl,state&&state.query||'');lpMapSyncRouteContextForNode(nodeEl,state);return false;}
const masked=lpH1StudyRouteNodeMasked(nodeEl,state);nodeEl.classList.toggle('is-route-masked',masked);nodeEl.classList.toggle('is-route-masked-full',masked&&mode==='full');nodeEl.classList.toggle('is-route-masked-weak',masked&&mode==='weak');nodeEl.classList.toggle('is-route-preview',!masked&&nodeEl.dataset.lpRouteMaskPreview==='1');const blurPx=lpH1StudyRouteNodeBlurPx(nodeEl,state,masked);nodeEl.style.filter=blurPx>0?`blur(${blurPx}px)`:'none';if(masked){titleEl.textContent=String((nodeEl.dataset&&nodeEl.dataset.lpMaskText)||'?');lpMapSyncRouteContextForNode(nodeEl,state);return true;}
lpH1StudyStartPaintNodeQuery(nodeEl,state&&state.query||'');lpMapSyncRouteContextForNode(nodeEl,state);return false;}
function lpH1StudyStartBindMaskPreview(nodeEl,modal){if(!nodeEl||!modal||nodeEl.dataset.lpRouteMaskBound==='1')return;nodeEl.dataset.lpRouteMaskBound='1';const revealNow=()=>{try{if(!modal.classList.contains('lp-open'))return;const mode=String(nodeEl.dataset.lpRouteMaskMode||'').trim();if(!mode||mode==='none')return;const state=modal.__lpH1StudyState||null;if(!lpH1StudyRouteNodeMasked(nodeEl,state))return;const key=lpCanonKey((nodeEl.getAttribute&&nodeEl.getAttribute('data-lp-loc'))||'');if(!key)return;if(nodeEl.__lpRouteHoverRevealBusy)return;nodeEl.__lpRouteHoverRevealBusy=true;const anim={cancelled:false,timers:[]};lpH1StudyRouteAnimRevealMaskedNode(modal,anim,nodeEl,key,90,{settleMs:0,fast:true}).catch(()=>false).finally(()=>{nodeEl.__lpRouteHoverRevealBusy=false;try{if(Array.isArray(anim.timers)){anim.timers.forEach((tid)=>window.clearTimeout(tid));anim.timers.length=0;}}catch(_){}});}catch(_){}};nodeEl.addEventListener('pointerenter',(e)=>{try{if(!modal.classList.contains('lp-open'))return;const pType=e&&e.pointerType?e.pointerType:'';if(pType&&pType!=='mouse')return;revealNow();}catch(_){}},{passive:true});nodeEl.addEventListener('focus',revealNow,{passive:true});}
function lpH1StudyRouteAnimRevealMaskedNode(modal,anim,nodeEl,loc,durationMs,opts){const root=modal||lpRouteMapActiveModal();const state=root&&root.__lpH1StudyState;const options=opts&&typeof opts==='object'?opts:{};const fastReveal=options.fast===true;const requestedSettle=Number(options.settleMs);const settleMs=Number.isFinite(requestedSettle)?Math.max(0,Math.round(requestedSettle)):LP_ROUTE_MAP_MASK_REVEAL_SETTLE_MS;if(!root||!state||!nodeEl)return Promise.resolve(false);const key=lpCanonKey(loc||(nodeEl.getAttribute&&nodeEl.getAttribute('data-lp-loc'))||'');if(!key)return Promise.resolve(false);const revealed=lpH1StudyRouteRevealSetForState(state);if(!lpH1StudyRouteNodeMasked(nodeEl,state)){revealed.add(key);lpSharedRevealAdd(key);try{delete nodeEl.dataset.lpRouteMaskPreview;}catch(_){}
lpH1StudyRouteApplyNodeMask(nodeEl,state);return Promise.resolve(true);}
const titleEl=nodeEl.querySelector('.lp-node-title');const rawTitle=String(nodeEl.getAttribute('data-lp-raw-title')||'').trim();const rawHtml=String(nodeEl.getAttribute('data-lp-raw-html')||'').trim();const hasMath=String(nodeEl.getAttribute('data-lp-has-math')||'')==='1'||lpHasMathMarkup(rawTitle)||lpHasMathMarkup(rawHtml);if(!titleEl||!rawTitle){revealed.add(key);lpSharedRevealAdd(key);try{delete nodeEl.dataset.lpRouteMaskPreview;}catch(_){}
lpH1StudyRouteApplyNodeMask(nodeEl,state);return Promise.resolve(true);}
if(lpMotionReduced()||hasMath){revealed.add(key);lpSharedRevealAdd(key);try{delete nodeEl.dataset.lpRouteMaskPreview;}catch(_){}
lpH1StudyRouteApplyNodeMask(nodeEl,state);if(fastReveal&&settleMs<=0)return Promise.resolve(true);return lpH1StudyRouteAnimDelay(anim,Math.max(settleMs,Math.min(720,Math.round((Number(durationMs)||420)*0.9))));}
const parts=lpSplitRevealTitle(rawTitle);const units=lpBuildRevealUnits(parts);if(!units.length){revealed.add(key);lpSharedRevealAdd(key);try{delete nodeEl.dataset.lpRouteMaskPreview;}catch(_){}
lpH1StudyRouteApplyNodeMask(nodeEl,state);return Promise.resolve(true);}
const rs={parts,units,order:lpShuffleInPlace(units.map((_,idx)=>idx)),revealed:new Set(),};titleEl.textContent=String((nodeEl.dataset&&nodeEl.dataset.lpMaskText)||'?');nodeEl.classList.add('is-route-revealing');try{delete nodeEl.dataset.lpRouteMaskPreview;}catch(_){}
const totalMs=Math.max(fastReveal?54:180,Math.round((Number(durationMs)||420)/1.3));const stepMs=Math.max(fastReveal?8:22,Math.round(totalMs/Math.max(4,units.length)));return new Promise((resolve)=>{const finish=(ok)=>{nodeEl.classList.remove('is-route-revealing');if(ok){revealed.add(key);lpSharedRevealAdd(key);}
lpH1StudyRouteApplyNodeMask(nodeEl,state);if(ok){lpH1StudyRouteAnimDelay(anim,settleMs).then(resolve);return;}
resolve(ok);};const tick=()=>{if(!anim||anim.cancelled)return finish(false);if(!lpRevealAdvanceOne(rs))return finish(true);titleEl.textContent=lpRevealTextForState(rs);if(lpRevealIsComplete(rs))return finish(true);const tid=window.setTimeout(()=>{try{if(anim&&Array.isArray(anim.timers)){const idx=anim.timers.indexOf(tid);if(idx>=0)anim.timers.splice(idx,1);}}catch(_){}
tick();},stepMs);try{anim.timers.push(tid);}catch(_){}};tick();});}
function lpH1StudyStartEnsureView(modal){if(!modal.__lpH1View){modal.__lpH1View={scale:lpMapDefaultActualScale(),tx:0,ty:0,userMoved:false,forceCenter:true,stageW:0,stageH:0,worldW:0,worldH:0,worldCX:0,worldCY:0};}
return modal.__lpH1View;}
function lpH1StudyStartFindNodeEl(modal,loc){const vp=lpH1StudyStartViewport(modal);if(!vp||!loc)return null;const want=lpCanonKey(loc);const nodes=vp.querySelectorAll('.lp-node[data-lp-loc]');for(const el of nodes){const cur=lpCanonKey(el.getAttribute('data-lp-loc')||'');if(cur&&cur===want)return el;}
return null;}
function lpH1StudyStartEnsureTargetVisible(modal){const stage=lpH1StudyStartStage(modal);const state=modal&&modal.__lpH1StudyState;const view=lpH1StudyStartEnsureView(modal);if(!stage||!state||!state.positions)return false;if(modal.__lpH1RouteAnim&&!modal.__lpH1RouteAnim.cancelled)return false;if(Number(modal.__lpH1PreserveViewUntil)>Date.now())return false;const srect=stage.getBoundingClientRect();const stageW=Math.max(320,Math.round(stage.clientWidth||srect.width||Number(view.stageW)||0));const stageH=Math.max(320,Math.round(stage.clientHeight||srect.height||Number(view.stageH)||0));view.stageW=stageW;view.stageH=stageH;const targetLoc=normLoc(state.target||'');const targetPos=state.positions.get(targetLoc)||{x:Number(view.worldCX)||0,y:Number(view.worldCY)||0};const nodeEl=lpH1StudyStartFindNodeEl(modal,targetLoc);const safe=lpH1StudyStartSafeInsets(modal);const padX=Math.max(44,Number(safe.left)||0);const padTop=Math.max(112,Number(safe.top)||0);const padBottom=Math.max(120,Number(safe.bottom)||0);let dx=0;let dy=0;if(!nodeEl){const scale=Number(view.scale)||1;const px=Number(targetPos.x)*scale+(Number(view.tx)||0);const py=Number(targetPos.y)*scale+(Number(view.ty)||0);if(px<padX)dx=padX-px;else if(px>stageW-padX)dx=(stageW-padX)-px;if(py<padTop)dy=padTop-py;else if(py>stageH-padBottom)dy=(stageH-padBottom)-py;if(dx||dy){view.tx+=dx;view.ty+=dy;lpH1StudyStartApplyTransform(modal);}
return!!(dx||dy);}
const nr=nodeEl.getBoundingClientRect();if(!nr.width||!nr.height){const scale=Number(view.scale)||1;const px=Number(targetPos.x)*scale+(Number(view.tx)||0);const py=Number(targetPos.y)*scale+(Number(view.ty)||0);if(px<padX)dx=padX-px;else if(px>stageW-padX)dx=(stageW-padX)-px;if(py<padTop)dy=padTop-py;else if(py>stageH-padBottom)dy=(stageH-padBottom)-py;if(dx||dy){view.tx+=dx;view.ty+=dy;lpH1StudyStartApplyTransform(modal);}
return!!(dx||dy);}
if(nr.left<srect.left+padX)dx=(srect.left+padX)-nr.left;else if(nr.right>srect.right-padX)dx=(srect.right-padX)-nr.right;if(nr.top<srect.top+padTop)dy=(srect.top+padTop)-nr.top;else if(nr.bottom>srect.bottom-padBottom)dy=(srect.bottom-padBottom)-nr.bottom;if(dx||dy){view.tx+=dx;view.ty+=dy;lpH1StudyStartApplyTransform(modal);}
return true;}
function lpH1StudyStartPreferredCenterLoc(modal){const state=modal&&modal.__lpH1StudyState;const cur=normLoc(currentRelPath());if(cur&&state&&state.positions instanceof Map&&state.positions.has(cur))return cur;const target=normLoc(state&&state.target||"");if(target)return target;return cur;}
function lpH1StudyStartSafeInsets(modal){const view=lpH1StudyStartEnsureView(modal);const stage=lpH1StudyStartStage(modal);const topbar=modal&&modal.querySelector?modal.querySelector('.lp-h1sg-topbar'):null;const zoom=modal&&modal.querySelector?(modal.querySelector('.lp-mzoom')||modal.querySelector('.lp-zoomctrl')):null;const stageRect=stage&&stage.getBoundingClientRect?stage.getBoundingClientRect():null;const topbarRect=topbar&&topbar.getBoundingClientRect?topbar.getBoundingClientRect():null;const zoomRect=zoom&&zoom.getBoundingClientRect?zoom.getBoundingClientRect():null;let top=24;let bottom=24;if(stageRect&&topbarRect&&topbarRect.bottom>stageRect.top){top=Math.max(top,Math.round(topbarRect.bottom-stageRect.top+14));}
if(stageRect&&zoomRect&&zoomRect.top<stageRect.bottom){bottom=Math.max(bottom,Math.round(stageRect.bottom-zoomRect.top+14));}
return{left:28,right:28,top,bottom,centerX:(Number(view.stageW)||0)/2,centerY:(Number(view.stageH)||0)/2,};}
function lpH1StudyStartCenterView(modal){const view=lpH1StudyStartEnsureView(modal);const scale=Number(view.scale)||lpMapDefaultActualScale();const stageW=Number(view.stageW)||0;const stageH=Number(view.stageH)||0;const safe=lpH1StudyStartSafeInsets(modal);const centerX=Number.isFinite(safe.centerX)?safe.centerX:(stageW/2);const centerY=Number.isFinite(safe.centerY)?safe.centerY:(stageH/2);const state=modal&&modal.__lpH1StudyState;const targetLoc=lpH1StudyStartPreferredCenterLoc(modal);const targetPos=targetLoc&&state&&state.positions instanceof Map?state.positions.get(targetLoc):null;const bounds=lpH1StudyStartViewportBounds(modal);if(targetPos){view.tx=centerX-Number(targetPos.x)*scale;view.ty=centerY-Number(targetPos.y)*scale;return;}
if(!bounds){view.tx=centerX-(Number(view.worldCX)||0)*scale;view.ty=centerY-(Number(view.worldCY)||0)*scale;return;}
view.tx=centerX-Number(bounds.cx)*scale;view.ty=centerY-Number(bounds.cy)*scale;}
function lpH1StudyStartClampPan(modal){const view=lpH1StudyStartEnsureView(modal);const stageW=Number(view.stageW)||0;const stageH=Number(view.stageH)||0;const worldW=Number(view.worldW)||0;const worldH=Number(view.worldH)||0;const scale=Number(view.scale)||1;if(!stageW||!stageH||!worldW||!worldH)return;const scaledW=worldW*scale;const scaledH=worldH*scale;const minTx=lpMapPanKeep(scaledW,stageW)-scaledW;const maxTx=stageW-lpMapPanKeep(scaledW,stageW);const minTy=lpMapPanKeep(scaledH,stageH)-scaledH;const maxTy=stageH-lpMapPanKeep(scaledH,stageH);view.tx=Math.min(maxTx,Math.max(minTx,Number(view.tx)||0));view.ty=Math.min(maxTy,Math.max(minTy,Number(view.ty)||0));}
function lpH1StudyRouteRefreshSemanticPairs(modal){try{const root=modal||lpRouteMapActiveModal();const state=root&&root.__lpH1StudyState;const viewport=root&&lpH1StudyStartViewport(root);const view=root&&lpH1StudyStartEnsureView(root);if(!state||!viewport||!view||!(state.positions instanceof Map))return;const records=Array.from(viewport.querySelectorAll('.lp-node[data-lp-loc]')).map((el)=>{const loc=normLoc(el.getAttribute('data-lp-loc')||'');const pos=state.positions.get(loc);if(!loc||!pos)return null;return{loc,x:Number(pos.x)||0,y:Number(pos.y)||0,w:Math.max(54,Number(el.offsetWidth)||120),h:Math.max(30,Number(el.offsetHeight)||38),};}).filter(Boolean);const pairs=[];for(let i=0;i<records.length;i+=1){const a=records[i];for(let j=i+1;j<records.length;j+=1){const b=records[j];const dx=b.x-a.x;const dy=b.y-a.y;const distance=Math.hypot(dx,dy);if(distance<1)continue;const ux=Math.abs(dx/distance);const uy=Math.abs(dy/distance);const extentA=ux*a.w*.5+uy*a.h*.5;const extentB=ux*b.w*.5+uy*b.h*.5;const extentSum=Math.max(36,extentA+extentB);if(distance<=extentSum*3.2+180)pairs.push({distance,extentSum});}}
view.semanticPairs=pairs;if(root.__lpH1ScaleMeta)root.__lpH1ScaleMeta.lastScale=null;}catch(_){}}
function lpH1StudyRouteSemanticScale(modal,actualScale){try{const scale=Math.max(.08,Number(actualScale)||1);if(scale>=.999)return 1;const root=modal||lpRouteMapActiveModal();const view=root&&lpH1StudyStartEnsureView(root);const phone=!!(window.matchMedia&&window.matchMedia('(max-width: 900px)').matches);const maxScale=phone?1.92:2.16;const desired=Math.min(maxScale,Math.max(1,Math.pow(1/scale,.62)));let collisionCap=maxScale;const screenGap=phone?9:12;const pairs=view&&Array.isArray(view.semanticPairs)?view.semanticPairs:[];for(const pair of pairs){const available=Number(pair.distance)-(screenGap/scale);const cap=available/Math.max(1,Number(pair.extentSum)||1);if(Number.isFinite(cap))collisionCap=Math.min(collisionCap,cap*.94);}
return Math.max(1,Math.min(desired,Math.max(1,collisionCap)));}catch(_){return 1;}}
function lpH1StudySyncScaleMeta(modal,scale,syncZoomMeta){const meta=modal.__lpH1ScaleMeta||(modal.__lpH1ScaleMeta={});if(meta.lastScale!==scale){meta.lastScale=scale;const semanticScale=lpH1StudyRouteSemanticScale(modal,scale);const semanticText=semanticScale.toFixed(4);if(meta.semanticText!==semanticText){meta.semanticText=semanticText;try{modal.style.setProperty('--lp-route-semantic-scale',semanticText);modal.dataset.lpSemanticZoom=semanticScale>1.001?'1':'0';}catch(_){}}}
if(!syncZoomMeta)return;const hoverScale=scale<1?Math.min(3,Math.max(1,1/scale)):1;const hoverText=String(hoverScale);if(meta.hoverText!==hoverText){meta.hoverText=hoverText;try{modal.style.setProperty('--lp-h1sg-hover-scale',hoverText);modal.dataset.lpZoomBelowOne=scale<1?'1':'0';}catch(_){}}}
function lpH1StudyStartApplyTransform(modal,opts){const vp=lpH1StudyStartViewport(modal);if(!vp)return;const view=lpH1StudyStartEnsureView(modal);if(!(opts&&opts.skipClamp))lpH1StudyStartClampPan(modal);const scale=Number(view.scale)||1;vp.style.transform=lp3dViewportTransform(modal,'route',Number(view.tx)||0,Number(view.ty)||0,scale,true);lpH1StudySyncScaleMeta(modal,scale,true);const zoomLabel=modal.querySelector("[data-lp-h1sg-zoom-label]");if(zoomLabel){const labelText=`${lpMapDisplayPctFromScale(scale)}%`;if(zoomLabel.textContent!==labelText)zoomLabel.textContent=labelText;}
const zoomRange=modal.querySelector("[data-lp-h1sg-zoom-range]");if(zoomRange&&!(opts&&opts.skipRangeSync)){const nextValue=String(Math.max(LP_MAP_ZOOM_MIN_PCT,Math.min(LP_MAP_ZOOM_MAX_PCT,lpMapDisplayPctFromScale(scale))));if(zoomRange.value!==nextValue)zoomRange.value=nextValue;lpUpdateZoomRangeVisual(zoomRange,Number(nextValue),LP_MAP_ZOOM_MIN_PCT,LP_MAP_ZOOM_MAX_PCT,lpMapDisplayPctFromScale(scale));}else if(zoomRange){lpUpdateZoomRangeVisual(zoomRange,Number(zoomRange.value||100),LP_MAP_ZOOM_MIN_PCT,LP_MAP_ZOOM_MAX_PCT,lpMapDisplayPctFromScale(scale));}
const state=modal&&modal.__lpH1StudyState;if(state&&state.positions instanceof Map&&state.positions.size>48){lpH1StudyStartCullForDrag(modal,true,false);}}
function lpH1StudyStartApplyTransformFast(modal,opts){const vp=lpH1StudyStartViewport(modal);if(!vp)return;const view=lpH1StudyStartEnsureView(modal);if(!(opts&&opts.skipClamp))lpH1StudyStartClampPan(modal);const scale=Number(view.scale)||1;const transformText=lp3dViewportTransform(modal,'route',Number(view.tx)||0,Number(view.ty)||0,scale,true);if(vp.style.transform!==transformText)vp.style.transform=transformText;lpH1StudySyncScaleMeta(modal,scale,!!(opts&&opts.syncZoomMeta));const state=modal&&modal.__lpH1StudyState;if(state&&state.positions instanceof Map&&state.positions.size>48){lpH1StudyStartCullForDrag(modal,true,false);}}
function lpH1StudyStartCullForDrag(modal,active,force){try{const viewport=lpH1StudyStartViewport(modal);const state=modal&&modal.__lpH1StudyState;const view=modal&&lpH1StudyStartEnsureView(modal);if(!viewport||!state||!view||!(state.positions instanceof Map))return;if(!active){const nodes=viewport.querySelectorAll('.lp-node[data-lp-loc]');nodes.forEach((nodeEl)=>{if(nodeEl.classList.contains('lp-pan-culled'))nodeEl.classList.remove('lp-pan-culled');});view.__lpCullTx=null;view.__lpCullTy=null;view.__lpCullScale=null;return;}
const scale=Math.max(0.05,Number(view.scale)||1);const tx=Number(view.tx)||0;const ty=Number(view.ty)||0;if(!force&&Number.isFinite(Number(view.__lpCullTx))&&Math.abs(tx-Number(view.__lpCullTx))<120&&Math.abs(ty-Number(view.__lpCullTy))<120&&Math.abs(scale-Number(view.__lpCullScale))<0.015)return;view.__lpCullTx=tx;view.__lpCullTy=ty;view.__lpCullScale=scale;const margin=200/scale;const left=(-tx/scale)-margin;const top=(-ty/scale)-margin;const right=((Number(view.stageW)||0)-tx)/scale+margin;const bottom=((Number(view.stageH)||0)-ty)/scale+margin;const nodes=viewport.querySelectorAll('.lp-node[data-lp-loc]');nodes.forEach((nodeEl)=>{const loc=normLoc(nodeEl.getAttribute('data-lp-loc')||'');const pos=state.positions.get(loc);const x=Number(pos&&pos.x);const y=Number(pos&&pos.y);const culled=Number.isFinite(x)&&Number.isFinite(y)?(x<left||x>right||y<top||y>bottom):false;nodeEl.classList.toggle('lp-pan-culled',culled);});}catch(_){}}
function lpH1StudyStartGetStageCenter(modal){const safe=lpH1StudyStartSafeInsets(modal);return{x:Number(safe.centerX)||0,y:Number(safe.centerY)||0};}
function lpH1StudyStartZoomAbout(modal,nextScale,anchor,opts){const view=lpH1StudyStartEnsureView(modal);const oldScale=Number(view.scale)||1;const clamped=Math.min(lpMapMaxActualScale(),Math.max(lpMapMinActualScale(),Number(nextScale)||oldScale));if(!isFinite(clamped)||clamped===oldScale)return;const a=anchor||lpH1StudyStartGetStageCenter(modal);const ax=Number(a.x)||0;const ay=Number(a.y)||0;const wx=(ax-(Number(view.tx)||0))/oldScale;const wy=(ay-(Number(view.ty)||0))/oldScale;view.scale=clamped;view.tx=ax-wx*clamped;view.ty=ay-wy*clamped;lpH1StudyStartApplyTransform(modal,opts);}
function lpH1StudyStartZoomAboutFast(modal,nextScale,anchor,opts){const view=lpH1StudyStartEnsureView(modal);const oldScale=Number(view.scale)||1;const clamped=Math.min(lpMapMaxActualScale(),Math.max(lpMapMinActualScale(),Number(nextScale)||oldScale));if(!isFinite(clamped)||clamped===oldScale)return;const a=anchor||lpH1StudyStartGetStageCenter(modal);const ax=Number(a.x)||0;const ay=Number(a.y)||0;const wx=(ax-(Number(view.tx)||0))/oldScale;const wy=(ay-(Number(view.ty)||0))/oldScale;view.scale=clamped;view.tx=ax-wx*clamped;view.ty=ay-wy*clamped;lpH1StudyStartApplyTransformFast(modal,{skipClamp:!!(opts&&opts.skipClamp),syncZoomMeta:true});}
function lpH1StudyRouteAnimResetZoom(modal){try{if(!modal)return;const view=lpH1StudyStartEnsureView(modal);const oldScale=Math.max(0.001,Number(view.scale)||1);const nextScale=Math.max(0.001,Number(lpMapDefaultActualScale())||1);const center=lpH1StudyStartGetStageCenter(modal);const ax=Number(center&&center.x)||0;const ay=Number(center&&center.y)||0;const wx=(ax-(Number(view.tx)||0))/oldScale;const wy=(ay-(Number(view.ty)||0))/oldScale;view.scale=nextScale;view.tx=ax-wx*nextScale;view.ty=ay-wy*nextScale;view.userMoved=false;view.forceCenter=false;lpH1StudyStartApplyTransform(modal,{skipClamp:true});try{const engine=modal.__lpWebgl3dEngine;if(engine&&engine.kind==='route')lpWebgl3dDraw(engine);}catch(_){}}catch(_){}}
function lpH1StudyRouteAnimViewForLoc(modal,loc){const root=modal||lpRouteMapActiveModal();const state=root&&root.__lpH1StudyState;const view=root?lpH1StudyStartEnsureView(root):null;if(!root||!state||!view||!state.positions)return null;const pos=state.positions.get(normLoc(loc||''));if(!pos)return null;const center=lpH1StudyStartGetStageCenter(root);const scale=Math.max(0.001,Number(view.scale)||1);return{scale,tx:Number(center.x)-Number(pos.x)*scale,ty:Number(center.y)-Number(pos.y)*scale,};}
function lpWebgl3dRouteAnimViewForHeading(modal,anchorLoc,fromLoc,toLoc){try{if(!lpWebgl3dRouteViewActive(modal))return null;const engine=modal.__lpWebgl3dEngine;if(!engine)return null;if(!engine.nodeMap||!engine.nodeMap.size)lpWebgl3dRebuild(engine);const anchor=engine.nodeMap&&engine.nodeMap.get(lpCanonKey(anchorLoc));if(!anchor)return null;const fromNode=fromLoc?(engine.nodeMap&&engine.nodeMap.get(lpCanonKey(fromLoc))):null;const toNode=toLoc?(engine.nodeMap&&engine.nodeMap.get(lpCanonKey(toLoc))):null;const W=Math.max(1,Number(engine.W)||1);const H=Math.max(1,Number(engine.H)||1);const view=lpH1StudyStartEnsureView(modal);const stage=lpH1StudyStartStage(modal);const srect=stage&&stage.getBoundingClientRect?stage.getBoundingClientRect():null;const stageW=Math.max(1,Number(stage&&stage.clientWidth)||Number(srect&&srect.width)||W);const stageH=Math.max(1,Number(stage&&stage.clientHeight)||Number(srect&&srect.height)||H);const parentScale=Math.max(0.001,Number(view&&view.scale)||1);const parentTx=Number(view&&view.tx)||0;const parentTy=Number(view&&view.ty)||0;const targetStageX=stageW*0.5;const targetStageY=stageH*LP_ROUTE_MAP_NAV_ANCHOR_Y;const targetX=(targetStageX-parentTx)/parentScale;const targetY=(targetStageY-parentTy)/parentScale;let roll=Number.isFinite(Number(engine.roll))?Number(engine.roll):0;if(fromNode&&toNode){const pa=lpWebgl3dProjectBase(engine,fromNode);const pb=lpWebgl3dProjectBase(engine,toNode);const dx=(Number(pb.x)||0)-(Number(pa.x)||0);const dy=(Number(pb.y)||0)-(Number(pa.y)||0);if(Math.hypot(dx,dy)>3){const phi=Math.atan2(dy,dx);roll=(-Math.PI/2-phi)*180/Math.PI;}}
const anchorRolled=lpWebgl3dRouteScreenPoint(engine,anchor,roll,0,0);return{__lpWebgl3dRouteView:true,anchorLoc:normLoc(anchorLoc||''),anchorKey:lpCanonKey(anchorLoc||''),targetX,targetY,targetStageX,targetStageY,roll,panX:targetX-(Number(anchorRolled.x)||0),panY:targetY-(Number(anchorRolled.y)||0)};}catch(_){return null;}}
function lpWebgl3dRouteAnimViewForSegment(modal,loc,nextLoc){return lpWebgl3dRouteAnimViewForHeading(modal,loc,loc,nextLoc);}
function lpWebgl3dRouteAnimViewForNode(modal,loc){try{if(!lpWebgl3dRouteViewActive(modal))return null;const engine=modal.__lpWebgl3dEngine;if(!engine)return null;if(!engine.nodeMap||!engine.nodeMap.size)lpWebgl3dRebuild(engine);const node=engine.nodeMap&&engine.nodeMap.get(lpCanonKey(loc||''));if(!node)return null;const view=lpH1StudyStartEnsureView(modal);const stage=lpH1StudyStartStage(modal);const rect=stage&&stage.getBoundingClientRect?stage.getBoundingClientRect():null;const stageW=Math.max(1,Number(stage&&stage.clientWidth)||Number(rect&&rect.width)||Number(engine.W)||1);const stageH=Math.max(1,Number(stage&&stage.clientHeight)||Number(rect&&rect.height)||Number(engine.H)||1);const parentScale=Math.max(.001,Number(view&&view.scale)||1);const parentTx=Number(view&&view.tx)||0;const parentTy=Number(view&&view.ty)||0;const targetStageX=stageW*.5;const targetStageY=stageH*LP_ROUTE_MAP_NAV_ANCHOR_Y;const targetX=(targetStageX-parentTx)/parentScale;const targetY=(targetStageY-parentTy)/parentScale;const roll=Number.isFinite(Number(engine.roll))?Number(engine.roll):0;const projected=lpWebgl3dRouteScreenPoint(engine,node,roll,0,0);return{__lpWebgl3dRouteView:true,anchorLoc:normLoc(loc||''),anchorKey:lpCanonKey(loc||''),targetX,targetY,targetStageX,targetStageY,roll,panX:targetX-(Number(projected&&projected.x)||0),panY:targetY-(Number(projected&&projected.y)||0)};}catch(_){return null;}}
function lpWebgl3dRouteAnchoredPan(engine,routeView,rollDeg){try{if(!engine||!routeView||!routeView.__lpWebgl3dRouteView)return null;const key=lpCanonKey(routeView.anchorKey||routeView.anchorLoc||'');if(!key||!engine.nodeMap)return null;const anchor=engine.nodeMap.get(key);if(!anchor)return null;const targetX=Number(routeView.targetX);const targetY=Number(routeView.targetY);if(!Number.isFinite(targetX)||!Number.isFinite(targetY))return null;const p=lpWebgl3dRouteScreenPoint(engine,anchor,Number(rollDeg)||0,0,0);return{panX:targetX-(Number(p&&p.x)||0),panY:targetY-(Number(p&&p.y)||0)};}catch(_){return null;}}
function lpWebgl3dRouteTweenView(modal,anim,toView,durationMs){if(!modal||!anim||anim.cancelled||!toView)return Promise.resolve(false);const engine=modal.__lpWebgl3dEngine;if(!engine)return lpH1StudyRouteAnimDelay(anim,Math.min(180,Math.max(0,Number(durationMs)||0))).then((ok)=>!!ok);const from={roll:Number.isFinite(Number(engine.roll))?Number(engine.roll):0,panX:Number.isFinite(Number(engine.panX))?Number(engine.panX):0,panY:Number.isFinite(Number(engine.panY))?Number(engine.panY):0};const dRoll=lpWebgl3dShortestAngleDelta(from.roll,Number(toView.roll)||0);const duration=Math.max(90,Number(durationMs)||0);return new Promise((resolve)=>{let last=performance.now();let elapsed=0;const step=(now)=>{if(!anim||anim.cancelled)return resolve(false);elapsed+=Math.min(Math.max(0,now-last),LP_ROUTE_ANIM_MAX_FRAME_MS);last=now;const t=Math.max(0,Math.min(1,elapsed/duration));const e=lpH1StudyRouteAnimEase(t);engine.roll=from.roll+dRoll*e;const anchoredPan=lpWebgl3dRouteAnchoredPan(engine,toView,engine.roll);if(anchoredPan){engine.panX=anchoredPan.panX;engine.panY=anchoredPan.panY;}else{engine.panX=from.panX+((Number(toView.panX)||0)-from.panX)*e;engine.panY=from.panY+((Number(toView.panY)||0)-from.panY)*e;}
lpWebgl3dDrawMotionFrame(engine,now,t>=1);if(t>=1)return resolve(true);lpH1RouteAnimTrackRaf(anim,"view",requestAnimationFrame(step));};lpH1RouteAnimTrackRaf(anim,"view",requestAnimationFrame(step));});}
function lpWebgl3dRouteSetNavProgress(modal,seq,t,visibleThrough){try{const engine=modal&&modal.__lpWebgl3dEngine;if(!engine||engine.kind!=='route')return false;engine.routeNavMode=true;engine.routeActiveSeq=Math.max(0,Number(seq)||0);engine.routeActiveT=Math.max(0,Math.min(1,Number(t)||0));engine.routeVisibleThrough=Math.max(0,Number.isFinite(Number(visibleThrough))?Number(visibleThrough):Number(seq)||0);lpWebgl3dDraw(engine);return true;}catch(_){return false;}}
function lpWebgl3dRouteClearNavProgress(modal,showAll){try{const engine=modal&&modal.__lpWebgl3dEngine;if(!engine||engine.kind!=='route')return false;if(showAll){engine.routeNavMode=true;engine.routeActiveSeq=Number.MAX_SAFE_INTEGER;engine.routeActiveT=1;engine.routeVisibleThrough=Array.isArray(engine.edges)?engine.edges.length:999;}else{engine.routeNavMode=false;engine.routeActiveSeq=0;engine.routeActiveT=0;engine.routeVisibleThrough=0;}
lpWebgl3dDraw(engine);return true;}catch(_){return false;}}
function lpWebgl3dRouteScreenDistance(modal,fromLoc,toLoc,routeView){try{const engine=modal&&modal.__lpWebgl3dEngine;if(!engine||!engine.nodeMap)return 420;const A=engine.nodeMap.get(lpCanonKey(fromLoc));const B=engine.nodeMap.get(lpCanonKey(toLoc));if(!A||!B)return 420;const roll=Number.isFinite(Number(routeView&&routeView.roll))?Number(routeView.roll):Number(engine.roll)||0;const panX=Number.isFinite(Number(routeView&&routeView.panX))?Number(routeView.panX):Number(engine.panX)||0;const panY=Number.isFinite(Number(routeView&&routeView.panY))?Number(routeView.panY):Number(engine.panY)||0;const pa=lpWebgl3dRouteScreenPoint(engine,A,roll,panX,panY);const pb=lpWebgl3dRouteScreenPoint(engine,B,roll,panX,panY);const view=lpH1StudyStartEnsureView(modal);const scale=Math.max(0.001,Number(view&&view.scale)||1);return Math.hypot((Number(pb.x)||0)-(Number(pa.x)||0),(Number(pb.y)||0)-(Number(pa.y)||0))*scale;}catch(_){return 420;}}
function lpWebgl3dRouteTravelDuration(modal,fromLoc,toLoc,routeView){const d=Math.max(120,Math.min(1200,Number(lpWebgl3dRouteScreenDistance(modal,fromLoc,toLoc,routeView))||420));return Math.round(Math.max(LP_ROUTE_MAP_NAV_TRAVEL_MIN_MS,Math.min(LP_ROUTE_MAP_NAV_TRAVEL_MAX_MS,600+d*0.62)));}
function lpWebgl3dRouteTweenTravel(modal,anim,toView,seq,durationMs){if(!modal||!anim||anim.cancelled||!toView)return Promise.resolve(false);const engine=modal.__lpWebgl3dEngine;if(!engine)return Promise.resolve(false);const from={roll:Number.isFinite(Number(engine.roll))?Number(engine.roll):0,panX:Number.isFinite(Number(engine.panX))?Number(engine.panX):0,panY:Number.isFinite(Number(engine.panY))?Number(engine.panY):0};const dRoll=lpWebgl3dShortestAngleDelta(from.roll,Number(toView.roll)||0);const duration=Math.max(220,Number(durationMs)||0);const activeSeq=Math.max(0,Number(seq)||0);return new Promise((resolve)=>{let last=performance.now();let elapsed=0;const step=(now)=>{if(!anim||anim.cancelled)return resolve(false);elapsed+=Math.min(Math.max(0,now-last),LP_ROUTE_ANIM_MAX_FRAME_MS);last=now;const t=Math.max(0,Math.min(1,elapsed/duration));const e=lpH1StudyRouteAnimEase(t);engine.roll=from.roll+dRoll*e;engine.panX=from.panX+((Number(toView.panX)||0)-from.panX)*e;engine.panY=from.panY+((Number(toView.panY)||0)-from.panY)*e;engine.routeNavMode=true;engine.routeActiveSeq=activeSeq;engine.routeActiveT=e;engine.routeVisibleThrough=activeSeq;if(t>=1){engine.routeActiveT=1;engine.routeVisibleThrough=activeSeq+1;lpWebgl3dDrawMotionFrame(engine,now,true);return resolve(true);}
lpWebgl3dDrawMotionFrame(engine,now,false);lpH1RouteAnimTrackRaf(anim,"view",requestAnimationFrame(step));};lpH1RouteAnimTrackRaf(anim,"view",requestAnimationFrame(step));});}
function lpWebgl3dRouteOverviewViewForPath(modal,pathLocs){try{if(!lpWebgl3dRouteViewActive(modal))return null;const engine=modal&&modal.__lpWebgl3dEngine;if(!engine)return null;if(!engine.nodeMap||!engine.nodeMap.size)lpWebgl3dRebuild(engine);const locs=lpGpsNormalizeRoutePath(Array.isArray(pathLocs)?pathLocs:[]);if(!locs.length)return null;const stage=lpH1StudyStartStage(modal);const view=lpH1StudyStartEnsureView(modal);const srect=stage&&stage.getBoundingClientRect?stage.getBoundingClientRect():null;const stageW=Math.max(1,Number(stage&&stage.clientWidth)||Number(srect&&srect.width)||Number(view.stageW)||Number(engine.W)||1);const stageH=Math.max(1,Number(stage&&stage.clientHeight)||Number(srect&&srect.height)||Number(view.stageH)||Number(engine.H)||1);view.stageW=stageW;view.stageH=stageH;const safe=lpH1StudyStartSafeInsets(modal);const padLeft=Math.max(Number(safe.left)||0,LP_ROUTE_MAP_OVERVIEW_PAD_X);const padRight=Math.max(Number(safe.right)||0,LP_ROUTE_MAP_OVERVIEW_PAD_X);const padTop=Math.max(Number(safe.top)||0,LP_ROUTE_MAP_OVERVIEW_PAD_TOP);const padBottom=Math.max(Number(safe.bottom)||0,LP_ROUTE_MAP_OVERVIEW_PAD_BOTTOM);const usableW=Math.max(80,stageW-padLeft-padRight);const usableH=Math.max(80,stageH-padTop-padBottom);const roll=0;const panX=0;const panY=0;let minX=Infinity;let minY=Infinity;let maxX=-Infinity;let maxY=-Infinity;let count=0;locs.forEach((loc)=>{const node=engine.nodeMap&&engine.nodeMap.get(lpCanonKey(loc));if(!node)return;const p=lpWebgl3dRouteScreenPoint(engine,node,roll,panX,panY);const el=node.el||null;const labelScale=Math.max(0.58,Math.min(1.38,Number(p&&p.scale)||1));const w=Math.max(72,(Number(el&&el.offsetWidth)||124)*labelScale)+34;const h=Math.max(34,(Number(el&&el.offsetHeight)||38)*labelScale)+24;const x=Number(p&&p.x)||0;const y=Number(p&&p.y)||0;minX=Math.min(minX,x-w/2);minY=Math.min(minY,y-h/2);maxX=Math.max(maxX,x+w/2);maxY=Math.max(maxY,y+h/2);count+=1;});if(!count||!Number.isFinite(minX)||!Number.isFinite(minY)||!Number.isFinite(maxX)||!Number.isFinite(maxY))return null;const boundsW=Math.max(1,maxX-minX);const boundsH=Math.max(1,maxY-minY);const rawFit=Math.min(usableW/boundsW,usableH/boundsH)*0.96;const visualFactor=lpMapVisualScaleFactor();const maxOverviewScale=LP_ROUTE_MAP_OVERVIEW_MAX_SCALE*visualFactor;const neededMin=Math.min(lpMapMinActualScale(),rawFit);const targetScale=Math.max(neededMin,Math.min(maxOverviewScale,rawFit));const cx=(minX+maxX)/2;const cy=(minY+maxY)/2;const targetStageX=padLeft+usableW/2;const targetStageY=padTop+usableH/2;return{__lpWebgl3dRouteOverview:true,roll,panX,panY,scale:targetScale,tx:targetStageX-cx*targetScale,ty:targetStageY-cy*targetScale};}catch(_){return null;}}
function lpWebgl3dRouteTweenOverview(modal,anim,overviewView,durationMs){if(!modal||!anim||anim.cancelled||!overviewView)return Promise.resolve(false);const engine=modal.__lpWebgl3dEngine;if(!engine)return Promise.resolve(false);const view=lpH1StudyStartEnsureView(modal);const from={roll:Number.isFinite(Number(engine.roll))?Number(engine.roll):0,panX:Number.isFinite(Number(engine.panX))?Number(engine.panX):0,panY:Number.isFinite(Number(engine.panY))?Number(engine.panY):0,scale:Math.max(0.001,Number(view.scale)||1),tx:Number(view.tx)||0,ty:Number(view.ty)||0};const dRoll=lpWebgl3dShortestAngleDelta(from.roll,Number(overviewView.roll)||0);const to={roll:from.roll+dRoll,panX:Number.isFinite(Number(overviewView.panX))?Number(overviewView.panX):0,panY:Number.isFinite(Number(overviewView.panY))?Number(overviewView.panY):0,scale:Math.max(0.001,Number(overviewView.scale)||from.scale),tx:Number(overviewView.tx)||0,ty:Number(overviewView.ty)||0};const duration=Math.max(220,Number(durationMs)||0);return new Promise((resolve)=>{let last=performance.now();let elapsed=0;const step=(now)=>{if(!anim||anim.cancelled)return resolve(false);elapsed+=Math.min(Math.max(0,now-last),LP_ROUTE_ANIM_MAX_FRAME_MS);last=now;const t=Math.max(0,Math.min(1,elapsed/duration));const e=lpH1StudyRouteAnimEase(t);engine.roll=from.roll+(to.roll-from.roll)*e;engine.panX=from.panX+(to.panX-from.panX)*e;engine.panY=from.panY+(to.panY-from.panY)*e;view.scale=from.scale+(to.scale-from.scale)*e;view.tx=from.tx+(to.tx-from.tx)*e;view.ty=from.ty+(to.ty-from.ty)*e;view.userMoved=true;lpH1StudyStartApplyTransformFast(modal,{skipClamp:true,syncZoomMeta:true});if(t>=1){view.scale=to.scale;view.tx=to.tx;view.ty=to.ty;engine.roll=to.roll;engine.panX=to.panX;engine.panY=to.panY;lpH1StudyStartApplyTransform(modal,{skipClamp:true});lpWebgl3dDrawMotionFrame(engine,now,true);return resolve(true);}
lpWebgl3dDrawMotionFrame(engine,now,false);lpH1RouteAnimTrackRaf(anim,"view",requestAnimationFrame(step));};lpH1RouteAnimTrackRaf(anim,"view",requestAnimationFrame(step));});}
function lpH1StudyRouteAnimTweenView(modal,anim,toView,durationMs){if(!modal||!anim||anim.cancelled||!toView)return Promise.resolve(false);if(lpWebgl3dRouteViewActive(modal)){if(toView&&toView.__lpWebgl3dRouteView)return lpWebgl3dRouteTweenView(modal,anim,toView,durationMs);return lpH1StudyRouteAnimDelay(anim,Math.min(180,Math.max(0,Number(durationMs)||0))).then((ok)=>!!ok);}
const view=lpH1StudyStartEnsureView(modal);const fromView={scale:Math.max(0.001,Number(view.scale)||1),tx:Number(view.tx)||0,ty:Number(view.ty)||0,};const nextView={scale:Number.isFinite(Number(toView.scale))?Number(toView.scale):fromView.scale,tx:Number(toView.tx)||0,ty:Number(toView.ty)||0,};const duration=Math.max(80,Number(durationMs)||0);return new Promise((resolve)=>{let last=performance.now();let elapsed=0;const step=(now)=>{if(!anim||anim.cancelled)return resolve(false);elapsed+=Math.min(Math.max(0,now-last),LP_ROUTE_ANIM_MAX_FRAME_MS);last=now;const t=Math.max(0,Math.min(1,elapsed/duration));const e=lpH1StudyRouteAnimEase(t);view.scale=fromView.scale+(nextView.scale-fromView.scale)*e;view.tx=fromView.tx+(nextView.tx-fromView.tx)*e;view.ty=fromView.ty+(nextView.ty-fromView.ty)*e;view.userMoved=true;lpH1StudyStartApplyTransformFast(modal,{skipClamp:true,syncZoomMeta:false});if(t>=1){lpH1StudyStartApplyTransform(modal,{skipClamp:true});return resolve(true);}
lpH1RouteAnimTrackRaf(anim,"view",requestAnimationFrame(step));};lpH1RouteAnimTrackRaf(anim,"view",requestAnimationFrame(step));});}
const LP_ROUTE_ANIM_MAX_FRAME_MS=90;function lpH1RouteAnimTrackRaf(anim,slotName,id){try{if(!anim||!Array.isArray(anim.rafs))return;const slots=anim.__rafSlots||(anim.__rafSlots={});const i=slots[slotName];if(i==null){slots[slotName]=anim.rafs.length;anim.rafs.push(id);}else{anim.rafs[i]=id;}}catch(_){}}
function lpH1StudyRouteAnimSetCompositor(modal,on){try{const root=modal||lpRouteMapActiveModal();if(root&&root.classList)root.classList.toggle('lp-route-animating',!!on);}catch(_){}}
function lpH1StudyRouteAnimStop(modal){const root=modal||lpRouteMapActiveModal();if(!root)return;lpH1StudyRouteAnimSetCompositor(root,false);const anim=root.__lpH1RouteAnim;if(anim&&typeof anim==="object"){anim.cancelled=true;const rafs=Array.isArray(anim.rafs)?anim.rafs.slice():[];const timers=Array.isArray(anim.timers)?anim.timers.slice():[];rafs.forEach((id)=>{try{cancelAnimationFrame(id);}catch(_){}});timers.forEach((id)=>{try{clearTimeout(id);}catch(_){}});}
root.__lpH1RouteAnim=null;try{lpWebgl3dRouteClearNavProgress(root,false);}catch(_){}
lpH1StudyRouteAnimRemoveNavArrow(root);try{const traveler=root.querySelector('.lp-route-preview-traveler');if(traveler&&traveler.parentNode)traveler.parentNode.removeChild(traveler);}catch(_){}
try{const viewport=lpH1StudyStartViewport(root);if(!viewport)return;Array.from(viewport.querySelectorAll('.lp-node.lp-route-anim-focus, .lp-node.lp-route-anim-will')).forEach((el)=>{try{el.classList.remove('lp-route-anim-focus','lp-route-anim-will');}catch(_){}
try{el.style.removeProperty('--lp-h1sg-node-extra-scale');el.style.removeProperty('--lp-route-pulse-scale');}catch(_){}});}catch(_){}}
function lpH1StudyRouteAnimCreate(modal){lpH1StudyRouteAnimStop(modal);const anim={cancelled:false,rafs:[],timers:[]};if(modal)modal.__lpH1RouteAnim=anim;return anim;}
function lpH1StudyRouteAnimRevealNode(nodeEl,state,key){if(!nodeEl||!state)return;const nodeKey=lpCanonKey(key||(nodeEl.getAttribute&&nodeEl.getAttribute('data-lp-loc'))||'');const startKey=lpCanonKey(state.startLoc||'');const targetKey=lpCanonKey(state.target||'');const isStart=!!(nodeKey&&startKey&&nodeKey===startKey);const isTarget=!!(nodeKey&&targetKey&&nodeKey===targetKey);try{nodeEl.classList.remove('lp-dim','is-filter-faded');}catch(_){}
try{nodeEl.classList.add('is-route');}catch(_){}
try{nodeEl.classList.toggle('is-start',isStart);}catch(_){}
try{nodeEl.classList.toggle('is-selected-start',isStart);}catch(_){}
try{nodeEl.classList.toggle('is-cur',isTarget);}catch(_){}
try{nodeEl.classList.toggle('is-target',isTarget);}catch(_){}}
function lpH1StudyRouteAnimFocusNode(modal,anim,nodeEl,holdMs,opts){if(!modal||!anim||anim.cancelled||!nodeEl)return Promise.resolve(false);const options=opts&&typeof opts==='object'?opts:{};const keepFocus=!!options.keep;const view=lpH1StudyStartEnsureView(modal);const currentScale=Math.max(0.001,Number(view&&view.scale)||1);let hoverScale=1;try{const raw=String(getComputedStyle(modal).getPropertyValue('--lp-h1sg-hover-scale')||'').trim();const parsed=Number(raw);if(Number.isFinite(parsed)&&parsed>0)hoverScale=parsed;}catch(_){}
const requestedPeakScale=Number(options.peakScale);let focusScale=Number.isFinite(requestedPeakScale)&&requestedPeakScale>1?Math.max(1.06,Math.min(1.5,requestedPeakScale)):(currentScale<0.999?1.18:1.16);const requestedGrowMs=Number(options.growMs);const totalHold=Math.max(220,Number(holdMs)||0);const growMs=Number.isFinite(requestedGrowMs)&&requestedGrowMs>0?Math.max(90,Math.round(requestedGrowMs)):Math.min(210,Math.max(110,Math.round(totalHold*0.28)));const isWebglRoute=lpWebgl3dRouteViewActive(modal);const ease=(t)=>lpH1StudyRouteAnimEase(Math.max(0,Math.min(1,Number(t)||0)));const runScalePhase=(setScale,from,to,duration)=>new Promise((resolve)=>{if(!anim||anim.cancelled)return resolve(false);let last=performance.now();let elapsed=0;const step=(now)=>{if(!anim||anim.cancelled)return resolve(false);elapsed+=Math.min(Math.max(0,now-last),LP_ROUTE_ANIM_MAX_FRAME_MS);last=now;const t=Math.max(0,Math.min(1,elapsed/Math.max(1,duration)));const e=ease(t);setScale(from+(to-from)*e);if(t>=1)return resolve(true);lpH1RouteAnimTrackRaf(anim,"focus",requestAnimationFrame(step));};lpH1RouteAnimTrackRaf(anim,"focus",requestAnimationFrame(step));});const runBreathePhase=(setScale,base,ms)=>new Promise((resolve)=>{if(!anim||anim.cancelled)return resolve(false);const amp=Math.max(0.012,(Number(base)-1)*0.08);let last=performance.now();let elapsed=0;const step=(now)=>{if(!anim||anim.cancelled)return resolve(false);elapsed+=Math.min(Math.max(0,now-last),LP_ROUTE_ANIM_MAX_FRAME_MS);last=now;const t=Math.max(0,Math.min(1,elapsed/Math.max(1,ms)));const envelope=Math.sin(Math.PI*t);setScale(base+Math.sin((elapsed/1000)*Math.PI*3)*amp*envelope);if(t>=1){setScale(base);return resolve(true);}
lpH1RouteAnimTrackRaf(anim,"focus",requestAnimationFrame(step));};lpH1RouteAnimTrackRaf(anim,"focus",requestAnimationFrame(step));});if(isWebglRoute){const setScale=(scale)=>{const sc=Math.max(1,Math.min(1.68,Number(scale)||1));try{nodeEl.style.setProperty('--lp-webgl-hover-scale','1');}catch(_){}
try{nodeEl.style.setProperty('--lp-route-pulse-scale',String(sc));}catch(_){}
try{nodeEl.style.setProperty('--lp-h1sg-node-extra-scale',String(sc));}catch(_){}};const clearScale=()=>{try{nodeEl.classList.remove('lp-route-anim-focus');}catch(_){}
try{nodeEl.style.removeProperty('--lp-webgl-hover-scale');}catch(_){}
try{nodeEl.style.removeProperty('--lp-route-pulse-scale');}catch(_){}
try{nodeEl.style.removeProperty('--lp-h1sg-node-extra-scale');}catch(_){}};nodeEl.classList.add('lp-route-anim-focus');setScale(1);return runScalePhase(setScale,1,focusScale,growMs).then((ok)=>{if(!ok||anim.cancelled){clearScale();return false;}
if(keepFocus){const readMs=Math.max(LP_ROUTE_MAP_ANIM_NODE_READ_MIN_MS,totalHold-growMs);return runBreathePhase(setScale,focusScale,readMs).then((ok2)=>!!ok2&&!(anim&&anim.cancelled));}
const plateauMs=Math.max(40,totalHold-growMs-Math.min(130,Math.max(90,Math.round(totalHold*0.24))));return runBreathePhase(setScale,focusScale,plateauMs).then((ok2)=>{if(!ok2||anim.cancelled){clearScale();return false;}
const shrinkMs=Math.min(130,Math.max(90,Math.round(totalHold*0.24)));return runScalePhase(setScale,focusScale,1,shrinkMs).then((ok3)=>{clearScale();return!!ok3&&!(anim&&anim.cancelled);});});});}
const set2dScale=(scale)=>{const sc=Math.max(1,Math.min(1.68,Number(scale)||1));try{nodeEl.style.setProperty('--lp-h1sg-node-extra-scale',String(sc));}catch(_){}
try{nodeEl.style.setProperty('--lp-route-pulse-scale',String(sc));}catch(_){}};const clear2dScale=()=>{try{nodeEl.classList.remove('lp-route-anim-focus');}catch(_){}
try{nodeEl.style.removeProperty('--lp-h1sg-node-extra-scale');}catch(_){}
try{nodeEl.style.removeProperty('--lp-route-pulse-scale');}catch(_){}};nodeEl.classList.add('lp-route-anim-focus');set2dScale(1);return runScalePhase(set2dScale,1,focusScale,growMs).then((ok)=>{if(!ok||anim.cancelled){clear2dScale();return false;}
if(keepFocus){const readMs=Math.max(LP_ROUTE_MAP_ANIM_NODE_READ_MIN_MS,totalHold-growMs);return runBreathePhase(set2dScale,focusScale,readMs).then((ok2)=>!!ok2&&!(anim&&anim.cancelled));}
const shrinkMs=Math.min(130,Math.max(90,Math.round(totalHold*0.28)));const plateauMs=Math.max(42,totalHold-growMs-shrinkMs);return runBreathePhase(set2dScale,focusScale,plateauMs).then((ok2)=>{if(!ok2||anim.cancelled){clear2dScale();return false;}
return runScalePhase(set2dScale,focusScale,1,shrinkMs).then((ok3)=>{clear2dScale();return!!ok3&&!(anim&&anim.cancelled);});});});}
function lpH1StudyRouteAnimClearFocusNodes(modal){try{const root=modal||lpRouteMapActiveModal();const viewport=root&&lpH1StudyStartViewport(root);if(!viewport)return;Array.from(viewport.querySelectorAll('.lp-node.lp-route-anim-focus')).forEach((el)=>{el.classList.remove('lp-route-anim-focus');el.style.removeProperty('--lp-webgl-hover-scale');el.style.removeProperty('--lp-route-pulse-scale');el.style.removeProperty('--lp-h1sg-node-extra-scale');});}catch(_){}}
function lpH1StudyRouteOverviewViewForPath(modal,pathLocs){try{const root=modal||lpRouteMapActiveModal();const state=root&&root.__lpH1StudyState;const view=root&&lpH1StudyStartEnsureView(root);const stage=root&&lpH1StudyStartStage(root);const locs=(pathLocs||[]).map(normLoc).filter(Boolean);if(!state||!view||!stage||!(state.positions instanceof Map)||!locs.length)return null;const stageW=Math.max(1,Number(stage.clientWidth)||Number(view.stageW)||1);const stageH=Math.max(1,Number(stage.clientHeight)||Number(view.stageH)||1);const safe=lpH1StudyStartSafeInsets(root);const padLeft=Math.max(Number(safe.left)||0,LP_ROUTE_MAP_OVERVIEW_PAD_X);const padRight=Math.max(Number(safe.right)||0,LP_ROUTE_MAP_OVERVIEW_PAD_X);const padTop=Math.max(Number(safe.top)||0,LP_ROUTE_MAP_OVERVIEW_PAD_TOP);const padBottom=Math.max(Number(safe.bottom)||0,LP_ROUTE_MAP_OVERVIEW_PAD_BOTTOM);const usableW=Math.max(80,stageW-padLeft-padRight);const usableH=Math.max(80,stageH-padTop-padBottom);const records=locs.map((loc)=>{const p=state.positions.get(loc);const el=lpH1StudyStartFindNodeEl(root,loc);if(!p)return null;return{x:Number(p.x)||0,y:Number(p.y)||0,w:Math.max(72,Number(el&&el.offsetWidth)||124),h:Math.max(34,Number(el&&el.offsetHeight)||38),};}).filter(Boolean);if(!records.length)return null;const boundsFor=(semantic)=>{let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;records.forEach((r)=>{const hw=r.w*semantic*.5+22;const hh=r.h*semantic*.5+18;minX=Math.min(minX,r.x-hw);minY=Math.min(minY,r.y-hh);maxX=Math.max(maxX,r.x+hw);maxY=Math.max(maxY,r.y+hh);});return{minX,minY,maxX,maxY,w:Math.max(1,maxX-minX),h:Math.max(1,maxY-minY)};};let bounds=boundsFor(1);let targetScale=Math.min(usableW/bounds.w,usableH/bounds.h)*.92;const semantic=lpH1StudyRouteSemanticScale(root,targetScale);bounds=boundsFor(semantic);targetScale=Math.min(usableW/bounds.w,usableH/bounds.h)*.92;targetScale=Math.max(.08,Math.min(lpMapDefaultActualScale(),targetScale));const cx=(bounds.minX+bounds.maxX)/2;const cy=(bounds.minY+bounds.maxY)/2;const targetX=padLeft+usableW/2;const targetY=padTop+usableH/2;return{scale:targetScale,tx:targetX-cx*targetScale,ty:targetY-cy*targetScale};}catch(_){return null;}}
function lpH1StudyRoutePreviewEnsureTraveler(modal){const root=modal||lpRouteMapActiveModal();const stage=root&&lpH1StudyStartStage(root);if(!stage)return null;let traveler=stage.querySelector('.lp-route-preview-traveler');if(!traveler){traveler=document.createElement('div');traveler.className='lp-route-preview-traveler';traveler.setAttribute('aria-hidden','true');traveler.innerHTML='<svg viewBox="0 0 40 40" focusable="false" aria-hidden="true"><path class="lp-route-preview-traveler-halo" d="M5 8L36 20 5 32 12 20Z"></path><path class="lp-route-preview-traveler-core" d="M7 10L33 20 7 30 13 20Z"></path></svg>';stage.appendChild(traveler);}
return traveler;}
function lpH1StudyRoutePreviewPoint(modal,entry,t){try{const root=modal||lpRouteMapActiveModal();const view=root&&lpH1StudyStartEnsureView(root);const u=Math.max(0,Math.min(1,Number(t)||0));const useWebgl=lpWebgl3dRouteViewActive(root);if(useWebgl){const engine=root.__lpWebgl3dEngine;const fromNode=engine&&engine.nodeMap&&engine.nodeMap.get(lpCanonKey(entry&&entry.fromLoc||''));const toNode=engine&&engine.nodeMap&&engine.nodeMap.get(lpCanonKey(entry&&entry.toLoc||''));if(engine&&fromNode&&toNode&&view){const a=lpWebgl3dRouteScreenPoint(engine,fromNode,Number(engine.roll)||0,Number(engine.panX)||0,Number(engine.panY)||0);const b=lpWebgl3dRouteScreenPoint(engine,toNode,Number(engine.roll)||0,Number(engine.panX)||0,Number(engine.panY)||0);const x1=(Number(view.tx)||0)+(Number(a.x)||0)*(Number(view.scale)||1);const y1=(Number(view.ty)||0)+(Number(a.y)||0)*(Number(view.scale)||1);const x2=(Number(view.tx)||0)+(Number(b.x)||0)*(Number(view.scale)||1);const y2=(Number(view.ty)||0)+(Number(b.y)||0)*(Number(view.scale)||1);return{x:x1+(x2-x1)*u,y:y1+(y2-y1)*u,angle:Math.atan2(y2-y1,x2-x1)*180/Math.PI};}}
const pathEl=entry&&entry.pathEl;if(!pathEl||!view||typeof pathEl.getTotalLength!=='function')return null;let length=entry.__lpPathLenEl===pathEl?Number(entry.__lpPathLen):0;if(!(length>0)){length=Math.max(1,Number(pathEl.getTotalLength())||1);entry.__lpPathLen=length;entry.__lpPathLenEl=pathEl;}
const p=pathEl.getPointAtLength(length*u);const tangentFrom=u>.92?Math.max(0,u-.035):Math.max(0,u-.006);const tangentTo=u>.92?Math.max(tangentFrom+.002,Math.min(1,u-.010)):Math.min(1,u+.012);const p1=pathEl.getPointAtLength(length*tangentFrom);const p2=pathEl.getPointAtLength(length*tangentTo);const scale=Number(view.scale)||1;return{x:(Number(view.tx)||0)+Number(p.x)*scale,y:(Number(view.ty)||0)+Number(p.y)*scale,angle:Math.atan2(Number(p2.y)-Number(p1.y),Number(p2.x)-Number(p1.x))*180/Math.PI,};}catch(_){return null;}}
async function lpH1StudyRoutePreviewLoop(modal,anim,state,edgeEntries){const root=modal||lpRouteMapActiveModal();const traveler=lpH1StudyRoutePreviewEnsureTraveler(root);const edges=(edgeEntries||[]).filter((entry)=>entry&&entry.fromLoc&&entry.toLoc);if(!root||!traveler||!edges.length)return false;edges.forEach((entry)=>{try{if(entry.pathEl)entry.pathEl.removeAttribute('marker-end');}catch(_){}});traveler.classList.add('is-visible');traveler.style.opacity='0';const moveEdge=(entry,durationMs)=>new Promise((resolve)=>{const duration=Math.max(520,Number(durationMs)||900);let last=performance.now();let elapsed=0;const frame=(now)=>{if(!anim||anim.cancelled)return resolve(false);elapsed+=Math.min(Math.max(0,now-last),LP_ROUTE_ANIM_MAX_FRAME_MS);last=now;const t=Math.max(0,Math.min(1,elapsed/duration));const fadeStart=.68;const fadeEnd=.84;const motionT=Math.min(t,fadeEnd);const point=lpH1StudyRoutePreviewPoint(root,entry,motionT);if(point)traveler.style.transform=`translate3d(${point.x.toFixed(2)}px, ${point.y.toFixed(2)}px, 0) translate(-50%, -50%) rotate(${point.angle.toFixed(2)}deg)`;const opacity=t<.12?(t/.12):(t>fadeStart?((fadeEnd-t)/(fadeEnd-fadeStart)):1);const visibleOpacity=Math.max(0,Math.min(1,opacity));traveler.style.opacity=String(visibleOpacity);traveler.style.visibility=visibleOpacity<=.015?'hidden':'visible';if(t>=1)return resolve(true);lpH1RouteAnimTrackRaf(anim,"preview",requestAnimationFrame(frame));};lpH1RouteAnimTrackRaf(anim,"preview",requestAnimationFrame(frame));});while(anim&&!anim.cancelled){try{while(document.hidden&&!anim.cancelled){traveler.classList.remove('is-visible');await lpH1StudyRouteAnimDelay(anim,240);}}catch(_){}
if(anim.cancelled)break;traveler.classList.add('is-visible');traveler.style.opacity='0';const targetKey=lpCanonKey(state&&state.target||'');const firstNode=lpH1StudyStartFindNodeEl(root,edges[0].fromLoc);if(firstNode){lpH1StudyRouteAnimFocusNode(root,anim,firstNode,420,{peakScale:1.26,growMs:100}).catch(()=>{});await lpH1StudyRouteAnimDelay(anim,160);}
if(anim.cancelled)break;for(const entry of edges){traveler.classList.add('is-visible');const a=lpH1StudyRoutePreviewPoint(root,entry,0);const b=lpH1StudyRoutePreviewPoint(root,entry,1);const distance=a&&b?Math.hypot(b.x-a.x,b.y-a.y):260;const duration=Math.max(720,Math.min(1650,distance*3.25));const moved=await moveEdge(entry,duration);if(!moved||anim.cancelled)return false;traveler.classList.remove('is-visible');traveler.style.opacity='0';traveler.style.visibility='hidden';const nodeEl=lpH1StudyStartFindNodeEl(root,entry.toLoc);const isTargetArrival=!!(targetKey&&lpCanonKey(entry.toLoc)===targetKey);if(nodeEl){lpH1StudyRouteAnimFocusNode(root,anim,nodeEl,isTargetArrival?760:480,isTargetArrival?{peakScale:1.42,growMs:130}:{peakScale:1.30,growMs:110}).catch(()=>{});await lpH1StudyRouteAnimDelay(anim,isTargetArrival?220:150);}
if(anim.cancelled)return false;}
await lpH1StudyRouteAnimDelay(anim,560);traveler.classList.remove('is-visible');traveler.style.opacity='0';traveler.style.visibility='hidden';await lpH1StudyRouteAnimDelay(anim,140);}
return false;}
function lpH1StudyRouteAnimPlay(modal,world,state,edgeEntries,markerId){if(!modal||!world||!state||!Array.isArray(state.path)||state.path.length<2)return;const anim=lpH1StudyRouteAnimCreate(modal);lpH1StudyRouteAnimSetCompositor(modal,true);const nodeMap=new Map();Array.from(world.querySelectorAll('.lp-node[data-lp-loc]')).forEach((nodeEl)=>{const loc=normLoc(nodeEl.getAttribute('data-lp-loc')||'');const key=lpCanonKey(loc);if(key)nodeMap.set(key,nodeEl);});const pathLocs=state.path.map((loc)=>normLoc(loc)).filter(Boolean);pathLocs.forEach((loc)=>{const nodeEl=nodeMap.get(lpCanonKey(loc));if(nodeEl){try{nodeEl.classList.add('lp-route-anim-will');}catch(_){}}});const startLoc=pathLocs[0]||'';const targetLoc=state.target||pathLocs[pathLocs.length-1]||'';const startEl=nodeMap.get(lpCanonKey(startLoc))||null;const targetEl=nodeMap.get(lpCanonKey(targetLoc))||null;const useNav3d=lpWebgl3dRouteViewActive(modal);if(useNav3d){lpWebgl3dRouteSetNavProgress(modal,0,0,0);}
const viewForFocus=(loc,nextLoc)=>{if(useNav3d)return lpWebgl3dRouteAnimViewForNode(modal,loc);return lpH1StudyRouteAnimViewForLoc(modal,loc);};const viewForTravel=(anchorLoc,fromLoc,toLoc)=>{if(useNav3d)return lpWebgl3dRouteAnimViewForNode(modal,anchorLoc);return lpH1StudyRouteAnimViewForLoc(modal,anchorLoc);};const startView=viewForFocus(startLoc,pathLocs[1]||'');(async()=>{const safeStep=async(label,factory)=>{try{return await factory();}catch(err){try{modal.__lpH1RouteAnimError=`${label}: ${String((err && err.message) || err || 'unknown error')}`;console.error(`[learning-path] route animation ${label} failed`,err);}catch(_){}
return false;}};if(startView){await safeStep('start camera',()=>lpH1StudyRouteAnimTweenView(modal,anim,startView,useNav3d?360:220));if(anim.cancelled)return;}
if(startEl){lpH1StudyRouteAnimRevealNode(startEl,state,startLoc);lpH1StudyRouteAnimSetNavArrow(modal,false);lpH1StudyRouteAnimFocusNode(modal,anim,startEl,440,{peakScale:1.26,growMs:100}).catch(()=>{});await safeStep('start node',()=>lpH1StudyRouteAnimRevealMaskedNode(modal,anim,startEl,startLoc,180,{settleMs:60}));if(anim.cancelled)return;await lpH1StudyRouteAnimDelay(anim,120);if(anim.cancelled)return;}
for(let i=0;i<edgeEntries.length;i+=1){if(anim.cancelled)return;const entry=edgeEntries[i];const fromLoc=pathLocs[i]||'';const nextLoc=pathLocs[i+1]||'';const nextKey=lpCanonKey(nextLoc);const nextEl=nodeMap.get(nextKey)||null;if(useNav3d)lpWebgl3dRouteSetNavProgress(modal,i,0,i);const arriveView=viewForTravel(nextLoc,fromLoc,nextLoc);const travelMs=useNav3d?lpWebgl3dRouteTravelDuration(modal,fromLoc,nextLoc,arriveView):520;lpH1StudyRouteAnimSetNavArrow(modal,false);let okList;if(useNav3d&&arriveView){okList=[await safeStep(`segment ${i + 1} travel`,()=>lpWebgl3dRouteTweenTravel(modal,anim,arriveView,i,travelMs))];}else{okList=await safeStep(`segment ${i + 1} travel`,()=>Promise.all([lpH1StudyRouteAnimDrawPath(anim,entry&&entry.pathEl,markerId,travelMs),arriveView?lpH1StudyRouteAnimTweenView(modal,anim,arriveView,travelMs):Promise.resolve(true)]));if(!Array.isArray(okList))okList=[false];}
lpH1StudyRouteAnimSetNavArrow(modal,false);if(anim.cancelled)return;if(useNav3d&&okList.some((ok)=>!ok)){lpWebgl3dRouteSetNavProgress(modal,i,1,i+1);}
if(nextEl){lpH1StudyRouteAnimRevealNode(nextEl,state,nextLoc);const isFinalArrival=(i===edgeEntries.length-1);lpH1StudyRouteAnimFocusNode(modal,anim,nextEl,isFinalArrival?760:500,isFinalArrival?{peakScale:1.42,growMs:130}:{peakScale:1.30,growMs:110}).catch(()=>{});await safeStep(`segment ${i + 1} arrival`,()=>lpH1StudyRouteAnimRevealMaskedNode(modal,anim,nextEl,nextLoc,180,{settleMs:60}));if(anim.cancelled)return;await lpH1StudyRouteAnimDelay(anim,isFinalArrival?200:110);if(anim.cancelled)return;}}
lpH1StudyRouteAnimSetNavArrow(modal,false);if(useNav3d){lpWebgl3dRouteClearNavProgress(modal,true);const overviewView=lpWebgl3dRouteOverviewViewForPath(modal,pathLocs);if(overviewView&&!anim.cancelled){await safeStep('overview',()=>lpWebgl3dRouteTweenOverview(modal,anim,overviewView,LP_ROUTE_MAP_OVERVIEW_MS));}}else{const overviewView=lpH1StudyRouteOverviewViewForPath(modal,pathLocs);if(overviewView&&!anim.cancelled){await safeStep('overview',()=>lpH1StudyRouteAnimTweenView(modal,anim,overviewView,LP_ROUTE_MAP_OVERVIEW_MS));}}
lpH1StudyRouteAnimClearFocusNodes(modal);if(!anim.cancelled){await safeStep('preview loop',()=>lpH1StudyRoutePreviewLoop(modal,anim,state,edgeEntries));}})().catch((err)=>{try{modal.__lpH1RouteAnimError=String((err&&err.message)||err||'unknown route animation error');console.error('[learning-path] route navigation animation failed',err);}catch(_){}}).finally(()=>{lpH1StudyRouteAnimSetNavArrow(modal,false);if(!anim.cancelled&&modal.__lpH1RouteAnim===anim){modal.__lpH1RouteAnim=null;}
if(!modal.__lpH1RouteAnim)lpH1StudyRouteAnimSetCompositor(modal,false);});}
function lpH1StudyStartRenderSelection(world,state,opts){if(!world||!state)return;const modal=(world&&world.closest)?world.closest('#lp-h1sg-modal'):lpRouteMapActiveModal();if(!(opts&&opts.staticView))lpMapClearFitStatus(modal);const cfg=lpRouteMapConfig(state.mode);const graph=state.graph||(modal&&modal.__lpGraph)||window.__lpLearningPathGraph||null;const pathLocs=Array.isArray(state.path)?state.path.map((loc)=>normLoc(loc)).filter(Boolean):[];const pathSet=new Set(pathLocs.map((loc)=>lpCanonKey(loc)).filter(Boolean));const startKey=lpCanonKey(state.startLoc||"");const targetKey=lpCanonKey(state.target||"");const hasQuery=!!lpH1StudyStartNormQuery(state.query||"");const hasPath=pathLocs.length>0;const hasAnimPath=pathLocs.length>=2;const animKey=hasPath?`${cfg.mode}|${pathLocs.map((loc) => lpCanonKey(loc)).join('>')}`:'';const explicitPlay=!!(modal&&modal.__lpH1ExplicitRoutePlay);if(modal)modal.__lpH1ExplicitRoutePlay=false;const canAnimate=!!(!(opts&&opts.staticView)&&hasAnimPath&&modal&&(explicitPlay||!lpMotionReduced())&&(explicitPlay||modal.__lpH1RenderedAnimKey!==animKey));if(modal)modal.__lpH1RenderedAnimKey=animKey;const visiblePathKeys=canAnimate?new Set():new Set(pathSet);if(hasPath&&!canAnimate&&lpMotionReduced()&&!(opts&&opts.staticView)){const revealed=lpH1StudyRouteRevealSetForState(state);pathLocs.forEach((loc)=>{const key=lpCanonKey(loc);if(key)revealed.add(key);});}
Array.from(world.querySelectorAll(".lp-node[data-lp-loc]")).forEach((nodeEl)=>{const loc=normLoc(nodeEl.getAttribute("data-lp-loc")||"");const key=lpCanonKey(loc);const onPath=pathSet.has(key);const isTarget=key===targetKey;const isStart=key===startKey;const isMatch=!hasQuery||lpH1StudyStartMatches(graph,loc,state.query||"");const isVisiblePathNode=visiblePathKeys.has(key);const shouldDimForPath=hasPath&&(!onPath||!isVisiblePathNode);const isRevealedPathNode=!canAnimate||isVisiblePathNode;nodeEl.classList.toggle("is-cur",isTarget&&isRevealedPathNode);nodeEl.classList.toggle("is-target",isTarget&&isRevealedPathNode);nodeEl.classList.toggle("is-start",isStart&&isRevealedPathNode&&(hasPath||!(__lpIsPhoneTouch()||(window.matchMedia&&window.matchMedia('(max-width: 900px)').matches))));nodeEl.classList.toggle("is-selected-start",isStart&&hasPath&&isRevealedPathNode);nodeEl.classList.toggle("is-route",onPath&&isVisiblePathNode);nodeEl.classList.toggle("is-filter-match",false);nodeEl.classList.toggle("is-filter-faded",!hasPath&&hasQuery&&!isMatch);nodeEl.classList.toggle("lp-dim",shouldDimForPath||(!hasPath&&false));if(!shouldDimForPath&&hasPath&&onPath){try{nodeEl.classList.remove('is-filter-faded');}catch(_){}}
try{if(!hasPath||!onPath||isVisiblePathNode){nodeEl.classList.remove('lp-route-anim-focus');nodeEl.style.removeProperty('--lp-h1sg-node-extra-scale');nodeEl.style.removeProperty('--lp-route-pulse-scale');}}catch(_){}
if(!lpH1StudyRouteApplyNodeMask(nodeEl,state)){lpH1StudyStartPaintNodeQuery(nodeEl,state.query||"");}});lp3dDecorateRouteMap(modal,world,state);const svg=world.querySelector(".lp-h1sg-overlay");if(svg){try{__lpStopAllFlows();}catch(_){}
svg.innerHTML="";if(hasAnimPath){const H1_EDGE_COLOR="rgb(255,255,255)";const H1_EDGE_ALPHA=0.92;const H1_NODE_PAD=18;function h1SvgUid(prefix){const seed=`${prefix}|${Date.now()}|${Math.random()}|${state.target || ""}|${pathLocs.join("→")}`;let h=2166136261;for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619);}
return`${prefix}-${(h >>> 0).toString(36)}`;}
function h1ClipToEdge(ax,ay,bx,by,hw,hh){const dx=bx-ax;const dy=by-ay;const len=Math.max(1e-6,Math.hypot(dx,dy));const ux=dx/len;const uy=dy/len;const r=Math.max(0,hh);const hx=Math.max(0,hw-hh);const axu=Math.abs(ux);const ayu=Math.abs(uy);let reach=r;if(hx<=1e-6){reach=r;}else if(ayu>1e-6){const tTop=r/ayu;const xAtTop=tTop*axu;if(xAtTop<=hx+1e-6)reach=tTop;else{const disc=Math.max(0,(r*r)-((hx*ayu)*(hx*ayu)));reach=(hx*axu)+Math.sqrt(disc);}}else{reach=hx+r;}
const MASK_OVERLAP=1.2;const t=Math.max(0,reach-MASK_OVERLAP);return{x:ax+ux*t,y:ay+uy*t};}
function h1CurvedPath(p1,p2,bend){const dx=p2.x-p1.x;const dy=p2.y-p1.y;const len=Math.max(1e-6,Math.hypot(dx,dy));const nx=-dy/len;const ny=dx/len;const c1x0=p1.x+dx*0.33;const c1y0=p1.y+dy*0.33;const c2x0=p1.x+dx*0.66;const c2y0=p1.y+dy*0.66;const c1x=c1x0+nx*bend;const c1y=c1y0+ny*bend;const c2x=c2x0+nx*(bend*0.18);const c2y=c2y0+ny*(bend*0.18);return`M ${p1.x} ${p1.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;}
function h1Hash01(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
return(h>>>0)/4294967295;}
function h1MakeArrowMarker(defsEl,id,fill){const marker=document.createElementNS("http://www.w3.org/2000/svg","marker");marker.setAttribute("id",id);marker.setAttribute("markerWidth","9");marker.setAttribute("markerHeight","9");marker.setAttribute("refX","9");marker.setAttribute("refY","3");marker.setAttribute("orient","auto");marker.setAttribute("markerUnits","strokeWidth");const mpath=document.createElementNS("http://www.w3.org/2000/svg","path");mpath.setAttribute("d","M0,0 L9,3 L0,6 Z");mpath.setAttribute("fill",fill);mpath.setAttribute("fill-opacity","1");mpath.setAttribute("stroke",fill);mpath.setAttribute("stroke-opacity","1");mpath.setAttribute("stroke-width","0.6");mpath.setAttribute("stroke-linejoin","round");marker.appendChild(mpath);defsEl.appendChild(marker);}
const viewBox=String(svg.getAttribute("viewBox")||"").trim().split(/\s+/).map(Number);const W=Math.max(1,Number(viewBox[2])||svg.clientWidth||world.offsetWidth||1200);const H=Math.max(1,Number(viewBox[3])||svg.clientHeight||world.offsetHeight||1200);const defsEl=document.createElementNS("http://www.w3.org/2000/svg","defs");svg.appendChild(defsEl);const maskId=h1SvgUid("lpH1NodeMask");const arrowId=h1SvgUid("lpH1PathArrow");const maskEl=document.createElementNS("http://www.w3.org/2000/svg","mask");maskEl.setAttribute("id",maskId);maskEl.setAttribute("maskUnits","userSpaceOnUse");let mMinX=Infinity,mMinY=Infinity,mMaxX=-Infinity,mMaxY=-Infinity;pathLocs.forEach((loc)=>{const p=state.positions&&state.positions.get(normLoc(loc));if(!p)return;mMinX=Math.min(mMinX,Number(p.x)||0);mMinY=Math.min(mMinY,Number(p.y)||0);mMaxX=Math.max(mMaxX,Number(p.x)||0);mMaxY=Math.max(mMaxY,Number(p.y)||0);});const MASK_REGION_PAD=240;const maskX=Number.isFinite(mMinX)?Math.max(0,Math.floor(mMinX-MASK_REGION_PAD)):0;const maskY=Number.isFinite(mMinY)?Math.max(0,Math.floor(mMinY-MASK_REGION_PAD)):0;const maskW=Number.isFinite(mMaxX)?Math.max(1,Math.min(W,Math.ceil(mMaxX+MASK_REGION_PAD))-maskX):W;const maskH=Number.isFinite(mMaxY)?Math.max(1,Math.min(H,Math.ceil(mMaxY+MASK_REGION_PAD))-maskY):H;maskEl.setAttribute("x",String(maskX));maskEl.setAttribute("y",String(maskY));maskEl.setAttribute("width",String(maskW));maskEl.setAttribute("height",String(maskH));const allRect=document.createElementNS("http://www.w3.org/2000/svg","rect");allRect.setAttribute("x",String(maskX));allRect.setAttribute("y",String(maskY));allRect.setAttribute("width",String(maskW));allRect.setAttribute("height",String(maskH));allRect.setAttribute("fill","white");maskEl.appendChild(allRect);const dimMap=new Map();Array.from(world.querySelectorAll('.lp-node[data-lp-loc]')).forEach((nodeEl)=>{const loc=normLoc(nodeEl.getAttribute('data-lp-loc')||'');if(!loc)return;const xy=state.positions&&state.positions.get(loc);if(!xy)return;const rect=nodeEl.getBoundingClientRect();const hw=Math.max(28,((nodeEl.offsetWidth||rect.width||160)/2));const hh=Math.max(14,((nodeEl.offsetHeight||rect.height||36)/2));dimMap.set(loc,{hw,hh});const key=lpCanonKey(loc);if(!pathSet.has(key))return;const cut=document.createElementNS('http://www.w3.org/2000/svg','rect');cut.setAttribute('fill','black');cut.setAttribute('x',String(xy.x-hw-H1_NODE_PAD));cut.setAttribute('y',String(xy.y-hh-H1_NODE_PAD));cut.setAttribute('width',String((hw+H1_NODE_PAD)*2));cut.setAttribute('height',String((hh+H1_NODE_PAD)*2));cut.setAttribute('rx',String(Math.min(999,hh+H1_NODE_PAD)));cut.setAttribute('ry',String(Math.min(999,hh+H1_NODE_PAD)));maskEl.appendChild(cut);});defsEl.appendChild(maskEl);h1MakeArrowMarker(defsEl,arrowId,H1_EDGE_COLOR);const edgeEntries=[];for(let i=0;i<pathLocs.length-1;i+=1){const fromLoc=normLoc(pathLocs[i]);const toLoc=normLoc(pathLocs[i+1]);const from=state.positions&&state.positions.get(fromLoc);const to=state.positions&&state.positions.get(toLoc);if(!from||!to)continue;const da=dimMap.get(fromLoc)||{hw:80,hh:18};const db=dimMap.get(toLoc)||{hw:80,hh:18};const baseP1=h1ClipToEdge(from.x,from.y,to.x,to.y,da.hw,da.hh);const baseP2=h1ClipToEdge(to.x,to.y,from.x,from.y,db.hw,db.hh);const baseGap=Math.hypot(baseP2.x-baseP1.x,baseP2.y-baseP1.y);const adaptivePad=baseGap<18?1.5:(baseGap<34?Math.min(6,H1_NODE_PAD*0.34):H1_NODE_PAD);const p1=h1ClipToEdge(from.x,from.y,to.x,to.y,da.hw+adaptivePad,da.hh+adaptivePad);const p2=h1ClipToEdge(to.x,to.y,from.x,from.y,db.hw+adaptivePad,db.hh+adaptivePad);const segLen=Math.hypot(p2.x-p1.x,p2.y-p1.y);const t=h1Hash01(`${fromLoc}→${toLoc}`);const baseB=(t<0.5?-1:1)*(8+16*Math.abs(t-0.5)*2);const damp=Math.max(0.35,Math.min(1,segLen/220));const bend=baseB*damp;const edgeD=h1CurvedPath(p1,p2,bend);const pathEl=document.createElementNS("http://www.w3.org/2000/svg","path");pathEl.classList.add("lp-h1sg-path");if(canAnimate)pathEl.classList.add('lp-is-hidden');pathEl.setAttribute("d",edgeD);pathEl.setAttribute("fill","none");pathEl.setAttribute("mask",`url(#${maskId})`);if(!canAnimate)pathEl.setAttribute("marker-end",`url(#${arrowId})`);pathEl.style.stroke=H1_EDGE_COLOR;pathEl.style.strokeWidth="2.3";pathEl.style.opacity=canAnimate?'0':String(H1_EDGE_ALPHA);pathEl.setAttribute("stroke-linecap","round");pathEl.setAttribute("stroke-linejoin","round");svg.appendChild(pathEl);edgeEntries.push({pathEl,fromLoc,toLoc});}
if(canAnimate)lpH1StudyRouteAnimPlay(modal,world,state,edgeEntries,arrowId);else lpH1StudyRouteAnimStop(modal);}else{lpH1StudyRouteAnimStop(modal);}}
const launch=world.querySelector(".lp-h1sg-launch");const dockLaunch=modal&&modal.querySelector?modal.querySelector('[data-lp-h1sg-dock-launch]'):null;const startPos=state.positions&&state.positions.get(normLoc(state.startLoc||""));const hasLaunchPath=!!(startPos&&state.path&&state.path.length);if(launch){launch.hidden=true;launch.removeAttribute("data-lp-start-loc");}
if(dockLaunch){dockLaunch.textContent=cfg.launchText;dockLaunch.hidden=!hasLaunchPath;if(hasLaunchPath)dockLaunch.setAttribute('data-lp-start-loc',normLoc(state.startLoc||''));else dockLaunch.removeAttribute('data-lp-start-loc');}
lpMapSyncRouteContext(modal);}
function lpH1StudyStartLaunchRouteTarget(state,target,path,currentKey){const cfg=lpRouteMapConfig(state.mode);const routeTarget=cfg.mode===LP_ROUTE_MAP_MODE.FROM_HERE?normLoc(path[path.length-1]||target):target;const pickRouteIndex=(preferredIdx)=>{let idx=Number.isFinite(Number(preferredIdx))?Number(preferredIdx):0;idx=Math.max(0,Math.min(path.length-1,idx));if(lpCanonKey(path[idx]||'')!==currentKey)return idx;for(let i=idx+1;i<path.length;i+=1){if(lpCanonKey(path[i]||'')!==currentKey)return i;}
for(let i=0;i<idx;i+=1){if(lpCanonKey(path[i]||'')!==currentKey)return i;}
return idx;};return{cfg,routeTarget,pickRouteIndex};}
function lpH1StudyStartCommitLaunch(modal){const root=modal||lpRouteMapActiveModal();if(!root)return false;const state=root.__lpH1StudyState;if(!state||!state.path||!state.path.length)return false;const target=normLoc(state.target||currentRelPath());const path=Array.isArray(state.path)?state.path.slice().map((loc)=>normLoc(loc)).filter(Boolean):[];if(!path.length)return false;const currentKey=lpCanonKey(currentRelPath());const route=lpH1StudyStartLaunchRouteTarget(state,target,path,currentKey);const cfg=route.cfg;const routeTarget=route.routeTarget;const pickRouteIndex=route.pickRouteIndex;if(cfg.mode===LP_ROUTE_MAP_MODE.FROM_HERE){const nextIndex=pickRouteIndex(path.length>1?1:0);const nextLoc=normLoc(path[nextIndex]||routeTarget||target);if(!nextLoc||lpCanonKey(nextLoc)===currentKey)return false;try{lpGpsWriteRouteState({target:routeTarget,path,currentIndex:nextIndex,currentLoc:nextLoc,completed:nextIndex>=(path.length-1)&&lpCanonKey(nextLoc)===lpCanonKey(routeTarget)});}catch(_){}
hideH1StudyStartModal();lpNavigate(toAbsoluteUrl(nextLoc),nextLoc,{keepGpsRoute:true});return true;}
const startIndex=pickRouteIndex(0);const dest=normLoc(path[startIndex]||target);if(!dest||lpCanonKey(dest)===currentKey)return false;try{lpGpsWriteRouteState({target,path,currentIndex:startIndex,currentLoc:dest,completed:startIndex>=(path.length-1)&&lpCanonKey(dest)===lpCanonKey(target)});}catch(_){}
hideH1StudyStartModal();lpNavigate(toAbsoluteUrl(dest),dest,{keepGpsRoute:true});return true;}
async function lpH1StudyStartPlayLaunchAnimation(modal){const root=modal||lpRouteMapActiveModal();if(!root||root.__lpH1LaunchBusy)return false;const state=root.__lpH1StudyState;const stage=lpH1StudyStartStage(root);const viewport=lpH1StudyStartViewport(root);if(!state||!stage||!viewport)return false;const pathLocs=Array.isArray(state.path)?state.path.slice().map((loc)=>normLoc(loc)).filter(Boolean):[];if(pathLocs.length<2)return false;if(lpMotionReduced())return false;const stageRect=stage.getBoundingClientRect();const stageW=Math.max(320,Math.round(stageRect.width||stage.clientWidth||0));const stageH=Math.max(420,Math.round(stageRect.height||stage.clientHeight||0));if(!stageW||!stageH)return false;const routeItems=[];for(let i=0;i<pathLocs.length;i+=1){const loc=pathLocs[i];const world=state.positions&&state.positions.get(loc);const nodeEl=lpH1StudyStartFindNodeEl(root,loc);if(!world||!nodeEl)continue;const measure=lpH1StudyStartLaunchMeasureNode(nodeEl);routeItems.push({loc,world:{x:Number(world.x)||0,y:Number(world.y)||0},nodeEl,clone:lpH1StudyStartLaunchCloneNode(nodeEl),width:measure.width,height:measure.height,});}
if(routeItems.length<2)return false;lpH1StudyStartLaunchCleanup(root);root.__lpH1LaunchBusy=true;root.classList.add('lp-h1sg-is-launching');const overlay=document.createElement('div');overlay.className='lp-h1sg-launch-overlay';overlay.setAttribute('aria-hidden','true');overlay.style.width=`${stageW}px`;overlay.style.height=`${stageH}px`;const svgNS='http://www.w3.org/2000/svg';const svg=document.createElementNS(svgNS,'svg');svg.setAttribute('class','lp-h1sg-launch-svg');svg.setAttribute('viewBox',`0 0 ${stageW} ${stageH}`);svg.setAttribute('width',String(stageW));svg.setAttribute('height',String(stageH));const defs=document.createElementNS(svgNS,'defs');svg.appendChild(defs);const arrowMarkerId=`lp-h1sg-launch-arrow-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;lpH1StudyStartLaunchMakeArrowMarker(defs,arrowMarkerId,'rgba(255,255,255,.98)');const segmentLayers=[];for(let i=0;i<routeItems.length-1;i+=1){const glow=document.createElementNS(svgNS,'path');glow.setAttribute('class','lp-h1sg-launch-path lp-h1sg-launch-path-glow');const main=document.createElementNS(svgNS,'path');main.setAttribute('class','lp-h1sg-launch-path lp-h1sg-launch-path-main');main.setAttribute('marker-end',`url(#${arrowMarkerId})`);svg.appendChild(glow);svg.appendChild(main);segmentLayers.push({glow,main});}
overlay.appendChild(svg);const startBadge=document.createElement('div');startBadge.className='lp-h1sg-launch-start-badge';startBadge.innerHTML=lpH1RouteMarkerSvg();overlay.appendChild(startBadge);const startBadgeSvg=startBadge.querySelector('.lp-h1-route-marker-svg');const endPin=document.createElement('div');endPin.className='lp-h1sg-launch-end-pin';endPin.innerHTML=lpH1RouteTargetPinSvg();overlay.appendChild(endPin);const layers=[];for(const item of routeItems){const shadow=document.createElement('div');shadow.className='lp-h1sg-launch-shadow';const clone=item.clone;if(!clone)continue;overlay.appendChild(shadow);overlay.appendChild(clone);layers.push({item,shadow,node:clone});}
if(layers.length<2){lpH1StudyStartLaunchCleanup(root);return false;}
stage.appendChild(overlay);const fx={cancelled:false,overlay,rafId:0,timers:[]};root.__lpH1LaunchFx=fx;const routePoints=routeItems.map((item)=>item.world);let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;routePoints.forEach((p)=>{minX=Math.min(minX,Number(p.x)||0);minY=Math.min(minY,Number(p.y)||0);maxX=Math.max(maxX,Number(p.x)||0);maxY=Math.max(maxY,Number(p.y)||0);});const pivotX=Number.isFinite((minX+maxX)/2)?(minX+maxX)/2:(Number(routePoints[0]&&routePoints[0].x)||0);const pivotY=Number.isFinite((minY+maxY)/2)?(minY+maxY)/2:(Number(routePoints[0]&&routePoints[0].y)||0);let segDx=Number(routePoints[1].x)-Number(routePoints[0].x);let segDy=Number(routePoints[1].y)-Number(routePoints[0].y);if(Math.abs(segDx)<0.001&&Math.abs(segDy)<0.001&&routePoints.length>2){segDx=Number(routePoints[2].x)-Number(routePoints[1].x);segDy=Number(routePoints[2].y)-Number(routePoints[1].y);}
const startHeading=Math.atan2(segDy||-1,segDx||0);const finalRot=(-Math.PI/2)-startHeading;const finalTilt=Math.PI*0.425;const perspective=Math.max(460,Math.round(stageH*1.00));const view=lpH1StudyStartEnsureView(root);const startPose={pivotX,pivotY,zoom:Math.max(0.001,Number(view.scale)||1),camX:(Number(view.tx)||0)+pivotX*Math.max(0.001,Number(view.scale)||1),camY:(Number(view.ty)||0)+pivotY*Math.max(0.001,Number(view.scale)||1),rot:0,tilt:0,perspective,};const rotateWorldNoPerspective=(point,rot,tilt)=>{const dx=Number(point.x)-pivotX;const dy=Number(point.y)-pivotY;const cosR=Math.cos(rot);const sinR=Math.sin(rot);const xr=dx*cosR-dy*sinR;const yr=dx*sinR+dy*cosR;return{x:xr,y:yr*Math.cos(tilt),z:yr*Math.sin(tilt),yr};};const finalBasis=routePoints.map((p)=>rotateWorldNoPerspective(p,finalRot,finalTilt));const basisMinX=Math.min(...finalBasis.map((p)=>p.x));const basisMaxX=Math.max(...finalBasis.map((p)=>p.x));const basisMinY=Math.min(...finalBasis.map((p)=>p.y));const basisMaxY=Math.max(...finalBasis.map((p)=>p.y));const basisW=Math.max(80,basisMaxX-basisMinX);const basisH=Math.max(80,basisMaxY-basisMinY);const fitPadX=Math.max(38,Math.round(stageW*0.08));const fitPadTop=Math.max(34,Math.round(stageH*0.08));const fitPadBottom=Math.max(18,Math.round(stageH*0.04));const fitZoom=Math.min((stageW-fitPadX*2)/basisW,(stageH-fitPadTop-fitPadBottom)/basisH);const desiredStartX=stageW*0.5;const desiredStartY=stageH*0.66;function buildAnchoredPose(zoomValue){const z=Math.max(0.001,Number(zoomValue)||0.001);const rawProjected=routePoints.map((p)=>lpH1StudyStartLaunchProjectPoint(p,{pivotX,pivotY,zoom:z,camX:0,camY:0,rot:finalRot,tilt:finalTilt,perspective,}));const startProj=rawProjected[0]||{x:0,y:0};const camX=desiredStartX-startProj.x;const camY=desiredStartY-startProj.y;return{pivotX,pivotY,zoom:z,camX,camY,rot:finalRot,tilt:finalTilt,perspective,projected:rawProjected.map((p)=>({x:p.x+camX,y:p.y+camY,scale:p.scale,depth:p.depth,yr:p.yr,})),};}
let targetZoom=Math.max(startPose.zoom*1.24,Math.min(startPose.zoom*3.05,fitZoom*1.02));let anchoredPose=buildAnchoredPose(targetZoom);for(let guard=0;guard<20;guard+=1){const projected=anchoredPose.projected||[];let boundsMinX=Infinity;let boundsMinY=Infinity;let boundsMaxX=-Infinity;let boundsMaxY=-Infinity;for(let i=0;i<projected.length;i+=1){const proj=projected[i];const item=routeItems[i];const nominalScale=Math.max(0.62,Math.min(2.75,(Number(proj&&proj.scale)||1)*1.08));const hw=(Number(item&&item.width)||80)*nominalScale*0.5+14;const hh=(Number(item&&item.height)||32)*nominalScale*0.5+14;boundsMinX=Math.min(boundsMinX,Number(proj&&proj.x)-hw);boundsMaxX=Math.max(boundsMaxX,Number(proj&&proj.x)+hw);boundsMinY=Math.min(boundsMinY,Number(proj&&proj.y)-hh);boundsMaxY=Math.max(boundsMaxY,Number(proj&&proj.y)+hh);}
if(projected.length){const firstProj=projected[0];const firstScale=Math.max(0.62,Math.min(2.75,(Number(firstProj&&firstProj.scale)||1)*1.08));const firstH=(Number(routeItems[0]&&routeItems[0].height)||32)*firstScale;boundsMinY=Math.min(boundsMinY,Number(firstProj&&firstProj.y)-firstH*1.05-34);const lastProj=projected[projected.length-1];const lastScale=Math.max(0.62,Math.min(2.75,(Number(lastProj&&lastProj.scale)||1)*1.08));const lastH=(Number(routeItems[routeItems.length-1]&&routeItems[routeItems.length-1].height)||32)*lastScale;boundsMinY=Math.min(boundsMinY,Number(lastProj&&lastProj.y)-lastH*0.90-34);}
const fits=boundsMinX>=fitPadX&&boundsMaxX<=(stageW-fitPadX)&&boundsMinY>=fitPadTop&&boundsMaxY<=(stageH-fitPadBottom);if(fits)break;targetZoom*=0.92;anchoredPose=buildAnchoredPose(targetZoom);}
const targetPose={pivotX,pivotY,zoom:Math.max(0.001,Number(anchoredPose.zoom)||startPose.zoom),camX:Number(anchoredPose.camX)||(stageW*0.5),camY:Number(anchoredPose.camY)||(stageH*0.62),rot:finalRot,tilt:finalTilt,perspective,};const duration=2655;const startTs=performance.now();await new Promise((resolve)=>{const frame=(now)=>{if(!root.__lpH1LaunchFx||root.__lpH1LaunchFx!==fx||fx.cancelled)return resolve();const rawT=Math.max(0,Math.min(1,(now-startTs)/duration));const e=lpH1StudyStartLaunchEase(rawT);const pose={pivotX,pivotY,zoom:startPose.zoom+(targetPose.zoom-startPose.zoom)*e,camX:startPose.camX+(targetPose.camX-startPose.camX)*e,camY:startPose.camY+(targetPose.camY-startPose.camY)*e,rot:startPose.rot+(targetPose.rot-startPose.rot)*e,tilt:startPose.tilt+(targetPose.tilt-startPose.tilt)*e,perspective,};const projected=routeItems.map((item)=>lpH1StudyStartLaunchProjectPoint(item.world,pose));const lineOpacity=Math.max(0.30,Math.min(1,0.24+e*0.92));let firstLineStart=null;let firstLineEnd=null;for(let i=0;i<segmentLayers.length;i+=1){const seg=segmentLayers[i];const a=projected[i];const b=projected[i+1];const aScale=Math.max(0.62,Math.min(2.75,(Number(a&&a.scale)||1)*(0.94+0.18*e)));const bScale=Math.max(0.62,Math.min(2.75,(Number(b&&b.scale)||1)*(0.94+0.18*e)));const p1=lpH1StudyStartLaunchClipProjected(a.x,a.y,b.x,b.y,routeItems[i].width*aScale*0.5,routeItems[i].height*aScale*0.5);const p2=lpH1StudyStartLaunchClipProjected(b.x,b.y,a.x,a.y,routeItems[i+1].width*bScale*0.5,routeItems[i+1].height*bScale*0.5);const d=lpH1StudyStartLaunchLinePath(p1,p2);if(!firstLineStart){firstLineStart=p1;firstLineEnd=p2;}
seg.main.setAttribute('d',d);seg.glow.setAttribute('d',d);seg.main.style.opacity=String(lineOpacity);seg.glow.style.opacity=String(Math.max(0.18,Math.min(0.7,0.10+e*0.40)));}
for(let i=0;i<layers.length;i+=1){const layer=layers[i];const proj=projected[i];if(!proj)continue;const nodeScale=Math.max(0.62,Math.min(2.75,proj.scale*(0.94+0.18*e)));const shadowScaleX=Math.max(0.2,Math.min(2.3,nodeScale*(0.92+Math.max(0,proj.depth)/760)));const shadowScaleY=Math.max(0.10,Math.min(0.62,0.22+Math.max(0,proj.depth)/1550));const shadowOpacity=Math.max(0.08,Math.min(0.42,0.12+Math.max(0,proj.depth)/1300));layer.shadow.style.left=`${proj.x.toFixed(2)}px`;layer.shadow.style.top=`${(proj.y + Math.min(34, layer.item.height * 0.44 * nodeScale)).toFixed(2)}px`;layer.shadow.style.transform=`translate(-50%, -50%) scale(${shadowScaleX.toFixed(3)}, ${shadowScaleY.toFixed(3)})`;layer.shadow.style.opacity=shadowOpacity.toFixed(3);layer.node.style.left=`${proj.x.toFixed(2)}px`;layer.node.style.top=`${proj.y.toFixed(2)}px`;layer.node.style.transform=`translate(-50%, -50%) scale(${nodeScale.toFixed(3)})`;layer.node.style.opacity=`${Math.max(0.74, Math.min(1, 0.76 + e * 0.24))}`;layer.node.style.setProperty('--lp-h1sg-launch-node-blur',`${(1 - e) * 1.25}px`);layer.node.style.zIndex=String(54+i);}
const firstProj=projected[0];const firstScale=Math.max(0.62,Math.min(2.75,(Number(firstProj&&firstProj.scale)||1)*(0.94+0.18*e)));const firstItem=routeItems[0];const startIconPoint={x:Number(firstProj&&firstProj.x)||(stageW*0.5),y:(Number(firstProj&&firstProj.y)||(stageH*0.8))-((Number(firstItem&&firstItem.height)||32)*firstScale*0.72)-Math.max(16,10*firstScale),};startBadge.style.left=`${Number(startIconPoint.x).toFixed(2)}px`;startBadge.style.top=`${Number(startIconPoint.y).toFixed(2)}px`;startBadge.style.opacity=String(Math.max(0.18,Math.min(1,0.10+e*0.98)));startBadge.style.transform=`translate(-50%, -50%) scale(${(1.02 + e * 0.28).toFixed(3)})`;if(startBadgeSvg){const dx=Number((firstLineEnd&&firstLineEnd.x)||0)-Number((firstLineStart&&firstLineStart.x)||0);const dy=Number((firstLineEnd&&firstLineEnd.y)||-1)-Number((firstLineStart&&firstLineStart.y)||0);const ang=Math.atan2(dy||-1,dx||0);startBadgeSvg.style.transform=`rotate(${(ang * 180 / Math.PI).toFixed(2)}deg)`;}
const lastProj=projected[projected.length-1]||{x:stageW*0.5,y:stageH*0.2,scale:1};const lastScale=Math.max(0.62,Math.min(2.75,(Number(lastProj&&lastProj.scale)||1)*(0.94+0.18*e)));const lastItem=routeItems[routeItems.length-1];endPin.style.left=`${Number(lastProj.x).toFixed(2)}px`;endPin.style.top=`${(Number(lastProj.y) - ((Number(lastItem && lastItem.height) || 32) * lastScale * 0.84) - Math.max(14, 10 * lastScale)).toFixed(2)}px`;endPin.style.opacity=String(Math.max(0.20,Math.min(1,0.08+e*1.04)));endPin.style.transform=`translate(-50%, -50%) rotate(0deg) scale(${(0.94 + e * 0.26).toFixed(3)})`;if(rawT>=1)return resolve();fx.rafId=requestAnimationFrame(frame);};fx.rafId=requestAnimationFrame(frame);});if(!root.__lpH1LaunchFx||root.__lpH1LaunchFx!==fx||fx.cancelled)return false;await lpH1StudyStartLaunchSleep(140);return!fx.cancelled;}
function lpH1StudyStartLaunchViewForStart(modal,startLoc){try{const root=modal||lpRouteMapActiveModal();const state=root&&root.__lpH1StudyState;const view=root&&lpH1StudyStartEnsureView(root);const stage=root&&lpH1StudyStartStage(root);const pos=state&&state.positions instanceof Map?state.positions.get(normLoc(startLoc||'')):null;if(!root||!view||!stage||!pos)return null;const safe=lpH1StudyStartSafeInsets(root);const stageW=Math.max(1,Number(stage.clientWidth)||Number(view.stageW)||1);const stageH=Math.max(1,Number(stage.clientHeight)||Number(view.stageH)||1);const usableH=Math.max(120,stageH-(Number(safe.top)||0)-(Number(safe.bottom)||0));const scale=Math.min(lpMapMaxActualScale(),Math.max(lpMapDefaultActualScale(),lpMapScaleFromDisplayPct(116)));const anchorX=stageW/2;const anchorY=(Number(safe.top)||0)+usableH*.68;return{scale,tx:anchorX-(Number(pos.x)||0)*scale,ty:anchorY-(Number(pos.y)||0)*scale,};}catch(_){return null;}}
async function lpH1StudyStartPlayLaunchAnimationV2(modal){const root=modal||lpRouteMapActiveModal();const state=root&&root.__lpH1StudyState;const pathLocs=state&&Array.isArray(state.path)?state.path.map(normLoc).filter(Boolean):[];if(!root||pathLocs.length<2||lpMotionReduced())return false;lpH1StudyRouteAnimStop(root);lpH1StudyStartLaunchCleanup(root);root.__lpH1LaunchBusy=true;root.classList.add('lp-h1sg-is-launching');const fx={cancelled:false,rafs:[],timers:[],rafId:0,overlay:null};root.__lpH1LaunchFx=fx;const startLoc=pathLocs[0];const nextLoc=pathLocs[1];const startEl=lpH1StudyStartFindNodeEl(root,startLoc);const useWebgl=lpWebgl3dRouteViewActive(root);const targetView=useWebgl?lpWebgl3dRouteAnimViewForHeading(root,startLoc,startLoc,nextLoc):lpH1StudyStartLaunchViewForStart(root,startLoc);lpH1StudyRouteAnimSetNavArrow(root,false);if(startEl)lpH1StudyRouteAnimRevealNode(startEl,state,startLoc);const moved=targetView?await lpH1StudyRouteAnimTweenView(root,fx,targetView,useWebgl?980:860):true;if(!moved||fx.cancelled)return false;if(startEl){lpH1StudyRouteAnimFocusNode(root,fx,startEl,440,{peakScale:1.26,growMs:100}).catch(()=>{});await lpH1StudyRouteAnimDelay(fx,160);}
await lpH1StudyRouteAnimDelay(fx,40);return!fx.cancelled;}
async function lpH1StudyStartLaunch(){const modal=lpRouteMapActiveModal();if(!modal||modal.__lpH1LaunchBusy)return;const state=modal.__lpH1StudyState;if(!state||!state.path||!state.path.length)return;if(!lpGuidedRoutesUnlocked()){const res=await lpOfferGuidedRoutesUnlock("route-map-start-guided-study");if(!res||res.ok===false)return;}
try{lpRecordXpActivity("guided_study_start",{source:"h1-study-start-launch",eventName:"lp-h1sg-launch"});}catch(_){}
let animated=false;try{animated=await lpH1StudyStartPlayLaunchAnimationV2(modal);}catch(_){animated=false;}
if(modal.__lpH1LaunchFx&&modal.__lpH1LaunchFx.cancelled){lpH1StudyStartLaunchCleanup(modal);return;}
lpH1StudyStartLaunchCleanup(modal);lpH1StudyStartCommitLaunch(modal);}
function lpH1StudyStartApplyFilter(modal,value){if(!modal)return;const state=modal.__lpH1StudyState;if(!state)return;state.query=String(value||"");lpH1StudyStartRenderSelection(lpH1StudyStartViewport(modal),state);}
function lpH1StudyStartPrimaryTree(graph,tree){const depthOf=tree&&tree.distMap instanceof Map?tree.distMap:new Map();const root=tree&&tree.target?normLoc(tree.target):"";const mode=lpRouteMapMode(tree&&tree.mode);const towardRoot=(loc)=>lpRouteMapFollowsForward(mode)?getPrereqs(graph,loc):getDependents(graph,loc);const parentOf=new Map();function buildChildren(parentMap){const out=new Map();for(const[child,parent]of parentMap.entries()){const p=normLoc(parent);const c=normLoc(child);if(!p||!c)continue;if(!out.has(p))out.set(p,[]);out.get(p).push(c);}
return out;}
function buildSubtree(childrenByParent){const subtreeSize=new Map();function calcSize(loc){const key=normLoc(loc);if(!key)return 1;if(subtreeSize.has(key))return subtreeSize.get(key);let total=1;for(const child of(childrenByParent.get(key)||[]))total+=calcSize(child);subtreeSize.set(key,total);return total;}
if(root)calcSize(root);return subtreeSize;}
function buildAngles(childrenByParent,subtreeSize){const desiredAngles=new Map();if(root)desiredAngles.set(root,-Math.PI/2);function assignAngles(parent,centerAngle,spread){const kids=(childrenByParent.get(normLoc(parent))||[]).slice();if(!kids.length)return;kids.sort((a,b)=>{const ta=cleanTitle(nodeTitle(graph,a)||a||"");const tb=cleanTitle(nodeTitle(graph,b)||b||"");return ta.localeCompare(tb,undefined,{sensitivity:"base"});});const totalWeight=kids.reduce((sum,child)=>sum+Math.max(1,Number(subtreeSize.get(normLoc(child))||1)),0)||kids.length;const usableSpread=Math.max(0.9,Math.min(Math.PI*1.84,Number(spread)||Math.PI));let cursor=centerAngle-usableSpread/2;for(let i=0;i<kids.length;i+=1){const child=kids[i];const weight=Math.max(1,Number(subtreeSize.get(normLoc(child))||1));const seg=usableSpread*(weight/totalWeight);const childAngle=cursor+seg/2;desiredAngles.set(normLoc(child),childAngle);const nextSpread=Math.max(0.34,Math.min(Math.PI*0.7,seg*0.82));assignAngles(child,childAngle,nextSpread);cursor+=seg;}}
if(root)assignAngles(root,-Math.PI/2,Math.PI*1.72);return desiredAngles;}
const layers=Array.isArray(tree&&tree.layers)?tree.layers:[];for(const layer of layers){const depth=Math.max(0,Number(layer&&layer.depth)||0);const nodes=Array.isArray(layer&&layer.nodes)?layer.nodes.slice():[];if(!nodes.length||depth<=0)continue;for(const rawLoc of nodes){const loc=normLoc(rawLoc);const candidates=uniq(towardRoot(loc)).map(normLoc).filter(Boolean).filter((dep)=>depthOf.has(dep)&&Number(depthOf.get(dep)||0)===depth-1).sort((a,b)=>{const ta=cleanTitle(nodeTitle(graph,a)||a||"");const tb=cleanTitle(nodeTitle(graph,b)||b||"");return ta.localeCompare(tb,undefined,{sensitivity:"base"});});if(candidates.length)parentOf.set(loc,candidates[0]);}}
for(let iter=0;iter<4;iter+=1){const childrenByParent=buildChildren(parentOf);const subtreeSize=buildSubtree(childrenByParent);const desiredAngles=buildAngles(childrenByParent,subtreeSize);const childCounts=new Map();for(const[p,kids]of childrenByParent.entries())childCounts.set(lpCanonKey(p),(kids||[]).length);let changed=0;for(const layer of layers){const depth=Math.max(0,Number(layer&&layer.depth)||0);const nodes=Array.isArray(layer&&layer.nodes)?layer.nodes.slice():[];if(!nodes.length||depth<=0)continue;for(const rawLoc of nodes){const loc=normLoc(rawLoc);const candidates=uniq(towardRoot(loc)).map(normLoc).filter(Boolean).filter((dep)=>depthOf.has(dep)&&Number(depthOf.get(dep)||0)===depth-1);if(!candidates.length)continue;const current=normLoc(parentOf.get(loc)||"");const hint=Number.isFinite(desiredAngles.get(loc))?Number(desiredAngles.get(loc)):0;candidates.sort((a,b)=>{const da=Math.abs(lpH1StudyStartAngleDelta(Number(desiredAngles.get(a)||0),hint));const db=Math.abs(lpH1StudyStartAngleDelta(Number(desiredAngles.get(b)||0),hint));if(Math.abs(da-db)>1e-6)return da-db;const ca=Number(childCounts.get(lpCanonKey(a))||0);const cb=Number(childCounts.get(lpCanonKey(b))||0);if(ca!==cb)return ca-cb;const ta=cleanTitle(nodeTitle(graph,a)||a||"");const tb=cleanTitle(nodeTitle(graph,b)||b||"");return ta.localeCompare(tb,undefined,{sensitivity:"base"});});const nextParent=candidates[0];if(nextParent&&lpCanonKey(nextParent)!==lpCanonKey(current)){parentOf.set(loc,nextParent);changed+=1;}}}
if(!changed)break;}
const childrenByParent=buildChildren(parentOf);for(const[parent,kids]of childrenByParent.entries()){kids.sort((a,b)=>{const ta=cleanTitle(nodeTitle(graph,a)||a||"");const tb=cleanTitle(nodeTitle(graph,b)||b||"");return ta.localeCompare(tb,undefined,{sensitivity:"base"});});}
const subtreeSize=buildSubtree(childrenByParent);const desiredAngles=buildAngles(childrenByParent,subtreeSize);return{parentOf,childrenByParent,subtreeSize,desiredAngles};}
function lpH1StudyStartLayout(tree,graph,hostW,hostH){const positions=new Map();const depthOf=tree&&tree.distMap instanceof Map?tree.distMap:new Map();const root=normLoc(tree&&tree.target||'');const maxDepth=Math.max(0,Number(tree&&tree.maxDepth)||0);const safeW=Math.max(320,Number(hostW)||960);const safeH=Math.max(420,Number(hostH)||960);const minDim=Math.min(safeW,safeH);const mobileDistanceScale=lpRouteMapMobileDistanceScale();const shellPad=24;const primary=lpH1StudyStartPrimaryTree(graph,tree);const parentOf=primary&&primary.parentOf instanceof Map?primary.parentOf:new Map();const childrenByParent=primary&&primary.childrenByParent instanceof Map?primary.childrenByParent:new Map();const subtreeSize=primary&&primary.subtreeSize instanceof Map?primary.subtreeSize:new Map();const desiredAngles=primary&&primary.desiredAngles instanceof Map?primary.desiredAngles:new Map();const layersSrc=Array.isArray(tree&&tree.layers)?tree.layers:[];const allNodes=uniq(layersSrc.flatMap((layer)=>Array.isArray(layer&&layer.nodes)?layer.nodes:[])).map(normLoc).filter(Boolean);function shellDimsFor(loc){const title=cleanTitle(nodeTitle(graph,loc)||loc||'');const iconPad=40;const labelPad=38;const textW=Math.max(76,Math.min(310,title.length*8.8));const hh=24;const hw=Math.max(82,Math.min(220,(textW+iconPad+labelPad)/2));const outHw=hw+shellPad;const outHh=hh+shellPad;return{hw:outHw,hh:outHh,hx:Math.max(0,outHw-outHh),r:outHh};}
let maxShellW=0;let maxShellH=0;for(const loc of allNodes.concat(root?[root]:[])){const d=shellDimsFor(loc);maxShellW=Math.max(maxShellW,d.hw*2);maxShellH=Math.max(maxShellH,d.hh*2);}
if(!maxShellW)maxShellW=280;if(!maxShellH)maxShellH=84;const baseOrbit=Math.round(Math.max(252,Math.round(minDim*0.198),Math.round(maxShellW*0.82+112))*mobileDistanceScale);const ringStep=Math.round(Math.max(196,Math.round(minDim*0.156),Math.round(maxShellW*0.50+92))*mobileDistanceScale);const worldRadius=Math.max(560,Math.round(baseOrbit+Math.max(0,maxDepth)*ringStep+maxShellW*0.92+220));const worldW=Math.max(1180,worldRadius*2);const worldH=Math.max(1180,worldRadius*2);const cx=Math.round(worldW/2);const cy=Math.round(worldH/2);const minPairGap=Math.round(Math.max(148,Math.round(maxShellW*0.38))*mobileDistanceScale);const sameLayerGap=Math.max(0.084,Math.min(0.30,((maxShellW+72)/Math.max(1,baseOrbit+ringStep))*mobileDistanceScale));const sectorGapBase=0.05*mobileDistanceScale;const globalStart=-Math.PI*0.985;const globalEnd=Math.PI*0.985;const preferred=new Map();const sectors=new Map();function branchWeight(loc){const key=normLoc(loc);return Math.max(1,Number(subtreeSize.get(key)||1));}
function clampVal(v,lo,hi){return Math.min(hi,Math.max(lo,v));}
function clampPoint(loc,x,y){const d=shellDimsFor(loc);const pad=18;return{x:Math.min(worldW-d.hw-pad,Math.max(d.hw+pad,x)),y:Math.min(worldH-d.hh-pad,Math.max(d.hh+pad,y)),};}
function placeAt(loc,angle,depth,sectorStart,sectorEnd){const radius=depth<=0?0:(baseOrbit+Math.max(0,depth-1)*ringStep);const x=cx+Math.cos(angle)*radius;const y=cy+Math.sin(angle)*radius;const clamped=clampPoint(loc,x,y);const actualAngle=depth<=0?0:Math.atan2(clamped.y-cy,clamped.x-cx);positions.set(loc,{x:clamped.x,y:clamped.y,angle:actualAngle,depth});preferred.set(loc,{x:clamped.x,y:clamped.y,angle,depth,radius});sectors.set(loc,{start:sectorStart,end:sectorEnd,center:angle,depth,radius});}
function stableNodeTie(a,b,salt){const ha=h01Stable(`${salt}|${a}`);const hb=h01Stable(`${salt}|${b}`);if(ha!==hb)return ha-hb;const ta=cleanTitle(nodeTitle(graph,a)||a||'');const tb=cleanTitle(nodeTitle(graph,b)||b||'');return ta.localeCompare(tb,undefined,{sensitivity:'base'});}
function childOrder(parent,kids){return(kids||[]).slice().sort((a,b)=>{const da=Number.isFinite(desiredAngles.get(normLoc(a)))?Number(desiredAngles.get(normLoc(a))):0;const db=Number.isFinite(desiredAngles.get(normLoc(b)))?Number(desiredAngles.get(normLoc(b))):0;if(da!==db)return da-db;const wa=branchWeight(a);const wb=branchWeight(b);if(wa!==wb)return wb-wa;return stableNodeTie(a,b,`lp-h1sg-child-order|${parent}`);});}
function resolveCenters(kids,lo,hi,depth){const nodes=(kids||[]).slice();if(!nodes.length)return[];const radius=baseOrbit+Math.max(0,depth-1)*ringStep;const desired=nodes.map((loc,idx)=>{const raw=Number(desiredAngles.get(normLoc(loc)));if(Number.isFinite(raw))return clampVal(raw,lo,hi);const t=nodes.length<=1?0.5:(idx/Math.max(1,nodes.length-1));return lo+(hi-lo)*t;});const gapPad=Math.max(0.14,Math.min(0.42,(maxShellW+minPairGap)/Math.max(1,radius)));return lpH1StudyStartResolveAngles(desired,gapPad);}
function allocateChildren(parentLoc,sectorStart,sectorEnd,depth){const kids=childOrder(parentLoc,childrenByParent.get(normLoc(parentLoc))||[]);if(!kids.length||depth<=0)return;const isRootRing=lpCanonKey(parentLoc)===lpCanonKey(root)&&depth===1;let lo;let hi;if(isRootRing){lo=globalStart+0.035;hi=globalEnd-0.035;}else{const parentPref=preferred.get(normLoc(parentLoc))||preferred.get(parentLoc)||{angle:-Math.PI/2};const parentAngle=Number(parentPref.angle)||-Math.PI/2;const inheritedSpan=Math.max(0.36,Number(sectorEnd)-Number(sectorStart));const spreadCap=Math.max(0.42,Math.min(inheritedSpan*0.94,1.26-Math.min(0.36,(depth-1)*0.12)));lo=Math.max(Number(sectorStart),parentAngle-spreadCap/2);hi=Math.min(Number(sectorEnd),parentAngle+spreadCap/2);if(!(hi>lo+0.18)){lo=Number(sectorStart);hi=Number(sectorEnd);}}
const span=Math.max(0.22,hi-lo);const gap=isRootRing?Math.min(0.09,Math.max(0.03,span/Math.max(24,kids.length*8))):Math.min(0.12,Math.max(sectorGapBase,span/Math.max(18,kids.length*9)));const usable=Math.max(0.2,span-Math.max(0,kids.length-1)*gap);const weights=isRootRing?kids.map(()=>1):kids.map((loc)=>Math.max(1,branchWeight(loc))+0.12);const totalWeight=weights.reduce((sum,w)=>sum+w,0)||kids.length;const minSlice=isRootRing?Math.max(0.22,usable/Math.max(1,kids.length)):Math.min(0.46,Math.max(0.18,usable/Math.max(5,kids.length*2.5)));let remainder=usable-minSlice*kids.length;if(remainder<0)remainder=0;const centers=isRootRing?kids.map((_,idx)=>lo+(hi-lo)*((idx+0.5)/Math.max(1,kids.length))):resolveCenters(kids,lo,hi,depth);let cursor=lo;for(let i=0;i<kids.length;i+=1){const child=kids[i];const extra=remainder>0?(remainder*(weights[i]/totalWeight)):0;const slice=minSlice+extra;let childStart=cursor;let childEnd=cursor+slice;if(i===kids.length-1)childEnd=hi;const innerMargin=Math.min(0.04,Math.max(0.018,(childEnd-childStart)*0.16));const wanted=Number.isFinite(centers[i])?centers[i]:((childStart+childEnd)/2);const center=clampVal(wanted,childStart+innerMargin,childEnd-innerMargin);placeAt(child,center,depth,childStart,childEnd);allocateChildren(child,childStart,childEnd,depth+1);cursor=childEnd+gap;}}
if(root){positions.set(root,{x:cx,y:cy,angle:0,depth:0});preferred.set(root,{x:cx,y:cy,angle:0,depth:0,radius:0});sectors.set(root,{start:globalStart,end:globalEnd,center:0,depth:0,radius:0});allocateChildren(root,globalStart,globalEnd,1);}
for(const layer of layersSrc){const depth=Math.max(0,Number(layer&&layer.depth)||0);if(depth<=0)continue;const nodes=(Array.isArray(layer&&layer.nodes)?layer.nodes:[]).map(normLoc).filter(Boolean);const missing=nodes.filter((loc)=>!positions.has(loc));if(!missing.length)continue;const ordered=missing.slice().sort((a,b)=>stableNodeTie(a,b,`lp-h1sg-fallback-${depth}`));const lo=globalStart+0.04;const hi=globalEnd-0.04;const centers=resolveCenters(ordered,lo,hi,depth);for(let i=0;i<ordered.length;i+=1){const loc=ordered[i];const ang=Number.isFinite(centers[i])?centers[i]:(lo+(hi-lo)*((i+0.5)/ordered.length));placeAt(loc,ang,depth,Math.max(globalStart,ang-0.12),Math.min(globalEnd,ang+0.12));}}
const depthBuckets=new Map();const movable=[];for(const[loc,pos]of positions.entries()){if(!loc||loc===root)continue;movable.push(loc);const depth=Math.max(0,Number(pos&&pos.depth)||0);if(!depthBuckets.has(depth))depthBuckets.set(depth,[]);depthBuckets.get(depth).push(loc);}
function depthRadius(depth){return depth<=0?0:(baseOrbit+Math.max(0,depth-1)*ringStep);}
function angleFor(loc){const P=positions.get(loc);if(!P)return 0;return Math.atan2(Number(P.y)-cy,Number(P.x)-cx);}
function syncPointFromPolar(loc,angle,radius){const clampedAngle=Number.isFinite(angle)?angle:0;const clampedRadius=Math.max(0,Number.isFinite(radius)?radius:0);const point=clampPoint(loc,cx+Math.cos(clampedAngle)*clampedRadius,cy+Math.sin(clampedAngle)*clampedRadius);const P=positions.get(loc)||{depth:Math.max(0,Number(depthOf.get(loc)||0))};P.x=point.x;P.y=point.y;P.angle=Math.atan2(P.y-cy,P.x-cx);positions.set(loc,P);}
const angularRelaxIterations=movable.length>240?48:(movable.length>120?64:90);for(let iter=0;iter<angularRelaxIterations;iter+=1){for(const loc of movable){const P=positions.get(loc);const pref=preferred.get(loc)||P;const sec=sectors.get(loc)||{start:globalStart,end:globalEnd};if(!P||!pref)continue;let angle=angleFor(loc);let radius=Math.hypot(Number(P.x)-cx,Number(P.y)-cy)||Number(pref.radius)||depthRadius(Number(pref.depth)||0);let targetAngle=Number(pref.angle);const parent=normLoc(parentOf.get(normLoc(loc))||'');const parentPos=parent?positions.get(parent):null;if(parentPos){const parentAngle=Math.atan2(Number(parentPos.y)-cy,Number(parentPos.x)-cx);targetAngle=targetAngle+lpH1StudyStartAngleDelta(targetAngle,parentAngle)*0.22;}
angle+=lpH1StudyStartAngleDelta(angle,targetAngle)*0.28;radius+=((Number(pref.radius)||radius)-radius)*0.28;const span=Math.max(0.12,Number(sec.end)-Number(sec.start));const margin=Math.min(0.08,Math.max(0.02,span*0.12));angle=clampVal(angle,Number(sec.start)+margin,Number(sec.end)-margin);syncPointFromPolar(loc,angle,radius);}
for(let depth=1;depth<=maxDepth;depth+=1){const nodes=(depthBuckets.get(depth)||[]).slice();if(nodes.length<=1)continue;nodes.sort((a,b)=>angleFor(a)-angleFor(b));const r=depthRadius(depth);for(let i=0;i<nodes.length-1;i+=1){const a=nodes[i];const b=nodes[i+1];const sa=shellDimsFor(a);const sb=shellDimsFor(b);const need=Math.max(sameLayerGap,(sa.hw+sb.hw+minPairGap)/Math.max(120,r));const aa=angleFor(a);const ab=angleFor(b);let gap=ab-aa;if(gap>=need)continue;const push=(need-gap)/2;const secA=sectors.get(a)||{start:globalStart,end:globalEnd};const secB=sectors.get(b)||{start:globalStart,end:globalEnd};const newA=clampVal(aa-push,Number(secA.start)+0.02,Number(secA.end)-0.02);const newB=clampVal(ab+push,Number(secB.start)+0.02,Number(secB.end)-0.02);syncPointFromPolar(a,newA,r);syncPointFromPolar(b,newB,r);}}}
const directPairSet=new Set();for(const[childLocRaw,parentLocRaw]of parentOf.entries()){const childLoc=normLoc(childLocRaw);const parentLoc=normLoc(parentLocRaw);if(!childLoc||!parentLoc)continue;directPairSet.add(lpPairKey(childLoc,parentLoc));}
const shellMetaCache=new Map();function shellMeta(loc){const key=normLoc(loc);if(shellMetaCache.has(key))return shellMetaCache.get(key);const meta=shellDimsFor(key);shellMetaCache.set(key,meta);return meta;}
function capsuleExtent(sd,uxAbs){return sd.r+sd.hx*Math.abs(uxAbs);}
function syncCollisionPoint(loc,x,y){const key=normLoc(loc);if(!key)return;if(root&&lpCanonKey(key)===lpCanonKey(root)){const R=positions.get(key)||{depth:0};R.x=cx;R.y=cy;R.angle=0;R.depth=0;positions.set(key,R);return;}
const P=positions.get(key)||{depth:Math.max(0,Number(depthOf.get(key)||0))};const pref=preferred.get(key)||P;const sec=sectors.get(key)||{start:globalStart,end:globalEnd};const depth=Math.max(0,Number(P.depth??pref.depth??depthOf.get(key)??0));const prefRadius=depth<=0?0:(Number(pref.radius)||depthRadius(depth));let angle=Math.atan2(Number(y)-cy,Number(x)-cx);if(!Number.isFinite(angle))angle=Number(pref.angle)||0;const span=Math.max(0.12,Number(sec.end)-Number(sec.start));const margin=Math.min(0.09,Math.max(0.018,span*0.10));angle=clampVal(angle,Number(sec.start)+margin,Number(sec.end)-margin);let radius=depth<=0?0:(Math.hypot(Number(x)-cx,Number(y)-cy)||prefRadius);if(depth>0){const minRadius=Math.max(Math.max(116,maxShellH*0.94),prefRadius*0.84);const maxRadius=Math.max(minRadius+80,prefRadius+ringStep*1.28);radius=clampVal(radius,minRadius,maxRadius);}
syncPointFromPolar(key,angle,radius);}
const allForCollision=root?[root,...movable]:movable.slice();const collisionGapBase=Math.round(Math.max(minPairGap+46,Math.round(maxShellH*1.02))*mobileDistanceScale);const collisionGapDirect=Math.round(Math.max(minPairGap-6,Math.round(maxShellH*0.68))*mobileDistanceScale);const collisionSameDepthExtra=Math.round(Math.max(42,Math.round(maxShellH*0.34))*mobileDistanceScale);const collisionRootExtra=Math.round(Math.max(24,Math.round(maxShellH*0.20))*mobileDistanceScale);const maxCollisionHalfWidth=allForCollision.reduce((maxValue,loc)=>{const sd=shellMeta(loc);return Math.max(maxValue,Number(sd.r)+Number(sd.hx));},0);const maxCollisionGap=Math.max(collisionGapBase+collisionSameDepthExtra,collisionGapBase+collisionRootExtra,collisionGapDirect);const maxInteractionDx=Math.max(1,maxCollisionHalfWidth*2+maxCollisionGap+4);const collisionIterations=allForCollision.length>240?52:(allForCollision.length>120?68:96);for(let iter=0;iter<collisionIterations;iter+=1){let moved=0;const collisionSweep=allForCollision.map((loc)=>{const key=normLoc(loc);const pos=positions.get(key);return key&&pos?{loc:key,x:Number(pos.x)||0}:null;}).filter(Boolean).sort((a,b)=>a.x-b.x);for(let i=0;i<collisionSweep.length;i+=1){const a=collisionSweep[i].loc;const A=positions.get(a);if(!a||!A)continue;const sa=shellMeta(a);for(let j=i+1;j<collisionSweep.length;j+=1){if((collisionSweep[j].x-collisionSweep[i].x)>maxInteractionDx)break;const b=collisionSweep[j].loc;const B=positions.get(b);if(!b||!B)continue;const sb=shellMeta(b);let dx=Number(B.x)-Number(A.x);let dy=Number(B.y)-Number(A.y);let dist=Math.hypot(dx,dy);if(dist<1e-6){const seed=`${a}|${b}`;let h=2166136261;for(let k=0;k<seed.length;k+=1){h^=seed.charCodeAt(k);h=Math.imul(h,16777619);}
const ang=((h>>>0)/4294967295)*Math.PI*2;dx=Math.cos(ang);dy=Math.sin(ang);dist=1;}
const ux=dx/dist;const uy=dy/dist;let pairGap=directPairSet.has(lpPairKey(a,b))?collisionGapDirect:collisionGapBase;const depthA=Math.max(0,Number((positions.get(a)||{}).depth||0));const depthB=Math.max(0,Number((positions.get(b)||{}).depth||0));if(depthA===depthB)pairGap=Math.max(pairGap,collisionGapBase+collisionSameDepthExtra);if((root&&lpCanonKey(a)===lpCanonKey(root))||(root&&lpCanonKey(b)===lpCanonKey(root))){pairGap=Math.max(pairGap,collisionGapBase+collisionRootExtra);}
const need=capsuleExtent(sa,ux)+capsuleExtent(sb,ux)+pairGap;if(dist>=need)continue;const push=(need-dist)+0.8;let shareA=0.5;let shareB=0.5;if(root&&lpCanonKey(a)===lpCanonKey(root)){shareA=0;shareB=1;}else if(root&&lpCanonKey(b)===lpCanonKey(root)){shareA=1;shareB=0;}else if(depthA<depthB){shareA=0.35;shareB=0.65;}else if(depthB<depthA){shareA=0.65;shareB=0.35;}
syncCollisionPoint(a,Number(A.x)-ux*push*shareA,Number(A.y)-uy*push*shareA);syncCollisionPoint(b,Number(B.x)+ux*push*shareB,Number(B.y)+uy*push*shareB);moved+=1;}}
if(moved===0)break;}
if(root&&positions.has(root)){const R=positions.get(root)||{};R.x=cx;R.y=cy;R.angle=0;R.depth=0;positions.set(root,R);}
return{positions,worldW,worldH,cx,cy,parentOf,childrenByParent,subtreeSize,desiredAngles};}
function lpH1StudyStartLayoutLooksValid(layout,tree){if(!layout||!(layout.positions instanceof Map))return false;const positions=layout.positions;const target=normLoc(tree&&tree.target||'');if(target&&!positions.has(target))return false;let expected=0;for(const layer of(tree&&tree.layers)||[]){expected+=Array.isArray(layer&&layer.nodes)?layer.nodes.length:0;}
if(expected<=0)return positions.size>0;if(positions.size<Math.max(1,Math.min(expected,3)))return false;for(const[loc,pos]of positions.entries()){if(!loc)return false;const x=Number(pos&&pos.x);const y=Number(pos&&pos.y);if(!Number.isFinite(x)||!Number.isFinite(y))return false;}
return true;}
function lpH1StudyStartLegacyLayout(tree,graph,hostW,hostH){const positions=new Map();const maxDepth=Math.max(0,Number(tree&&tree.maxDepth)||0);const safeW=Math.max(320,Number(hostW)||960);const safeH=Math.max(420,Number(hostH)||960);const minDim=Math.min(safeW,safeH);const mobileDistanceScale=lpRouteMapMobileDistanceScale();const baseOrbit=Math.max(190,minDim*0.18)*mobileDistanceScale;const ringStep=Math.max(138,minDim*0.12)*mobileDistanceScale;const outerRadius=maxDepth>0?(baseOrbit+Math.max(0,maxDepth-1)*ringStep):0;const worldRadius=Math.max(460,outerRadius+280);const worldW=Math.max(960,Math.round(worldRadius*2));const worldH=Math.max(960,Math.round(worldRadius*2));const cx=Math.round(worldW/2);const cy=Math.round(worldH/2);const target=normLoc(tree&&tree.target||'');if(target)positions.set(target,{x:cx,y:cy,angle:-Math.PI/2,depth:0});for(const layer of(tree&&tree.layers)||[]){const depth=Math.max(0,Number(layer&&layer.depth)||0);const nodes=(layer&&layer.nodes?layer.nodes.slice():[]).filter(Boolean).map(normLoc).filter(Boolean);if(!nodes.length||depth<=0)continue;const count=nodes.length;const radius=baseOrbit+(depth-1)*ringStep;const step=(Math.PI*2)/Math.max(1,count);const phase=-Math.PI/2+((depth%2)?0:step/2);nodes.forEach((loc,idx)=>{const jitterA=(Math.sin((idx+1)*1.73+depth*0.61)*0.09);const jitterR=Math.sin((idx+1)*2.11+depth*0.37)*Math.min(18,ringStep*0.08);const ang=phase+step*idx+jitterA;const x=cx+Math.cos(ang)*(radius+jitterR);const y=cy+Math.sin(ang)*(radius+jitterR);positions.set(loc,{x,y,angle:ang,depth});});}
return{positions,worldW,worldH,cx,cy};}
function lpH1StudyStartPrepKey(targetLoc,hostW,hostH,mode){return`${lpRouteMapMode(mode)}|d${lpRouteMapMobileDistanceScale()}|${lpCanonKey(targetLoc || currentRelPath())}|${lpH1StudyStartPrepBucket(hostW, hostH)}`;}
function lpH1StudyStartPrepare(graph,targetLoc,hostW,hostH,mode){const cfg=lpRouteMapConfig(mode);const tree=lpH1StudyStartTree(graph,targetLoc||currentRelPath(),cfg.mode);const target=tree.target||normLoc(targetLoc||currentRelPath());const targetTitle=cleanTitle(nodeTitle(graph,target)||target||'');let layout=null;try{layout=lpH1StudyStartLayout(tree,graph,hostW,hostH);}catch(_){layout=null;}
if(!lpH1StudyStartLayoutLooksValid(layout,tree)){layout=lpH1StudyStartLegacyLayout(tree,graph,hostW,hostH);}
const positions=layout&&layout.positions instanceof Map?layout.positions:new Map();const layoutParentOf=layout&&layout.parentOf instanceof Map?layout.parentOf:new Map();const worldW=Math.max(960,Math.round(Number(layout&&layout.worldW)||hostW||960));const worldH=Math.max(960,Math.round(Number(layout&&layout.worldH)||hostH||960));const cx=Math.round(Number(layout&&layout.cx)||(worldW/2));const cy=Math.round(Number(layout&&layout.cy)||(worldH/2));return{graph:graph||null,target,targetTitle,helperText:cfg.helperText,tree,layout,positions,layoutParentOf,worldW,worldH,cx,cy,hostW:Math.max(320,Number(hostW)||320),hostH:Math.max(420,Number(hostH)||420),cacheKey:lpH1StudyStartPrepKey(target,hostW,hostH,cfg.mode),cacheBucket:lpH1StudyStartPrepBucket(hostW,hostH),mode:cfg.mode,};}
function lpH1StudyStartFindPrepared(targetLoc,hostW,hostH,mode){const cfg=lpRouteMapConfig(mode);const cache=lpH1StudyStartPrepCacheRoot();const exactKey=lpH1StudyStartPrepKey(targetLoc,hostW,hostH,cfg.mode);if(cache.data.has(exactKey))return cache.data.get(exactKey);const wantTarget=lpCanonKey(targetLoc||currentRelPath());const wantW=Math.max(320,Number(hostW)||0);const wantH=Math.max(420,Number(hostH)||0);let best=null;let bestScore=Infinity;for(const[key,value]of cache.data.entries()){if(!value)continue;const keyMode=(typeof key==='string'&&key.includes('|'))?key.split('|')[0]:'';const valueMode=lpRouteMapMode((value&&value.mode)||keyMode||'');if(valueMode!==cfg.mode||lpCanonKey(value.target||'')!==wantTarget)continue;const dw=Math.abs((Number(value.hostW)||0)-wantW);const dh=Math.abs((Number(value.hostH)||0)-wantH);if(dw>120||dh>120)continue;const score=dw+dh;if(score<bestScore){bestScore=score;best=value;}}
return best;}
function lpH1StudyStartEnsurePrepared(graph,targetLoc,hostW,hostH,mode,opts){const cfg=lpRouteMapConfig(mode);const cache=lpH1StudyStartPrepCacheRoot();const exact=lpH1StudyStartFindPrepared(targetLoc,hostW,hostH,cfg.mode);if(exact)return Promise.resolve(exact);const key=lpH1StudyStartPrepKey(targetLoc,hostW,hostH,cfg.mode);if(cache.promises.has(key))return cache.promises.get(key);const shouldDefer=!!(opts&&opts.defer);const runner=()=>{const data=lpH1StudyStartPrepare(graph,targetLoc,hostW,hostH,cfg.mode);cache.data.set(key,data);return data;};const promise=new Promise((resolve,reject)=>{const kickoff=()=>{try{resolve(runner());}catch(err){reject(err);}};if(shouldDefer){requestAnimationFrame(()=>requestAnimationFrame(kickoff));}else{kickoff();}}).finally(()=>{try{cache.promises.delete(key);}catch(_){}});cache.promises.set(key,promise);return promise;}
function lpRouteMapSyncDirectionMenu(modal,mode){const root=modal||lpRouteMapActiveModal();if(!root)return;const cfg=lpRouteMapConfig(mode||(root.__lpH1StudyState&&root.__lpH1StudyState.mode)||root.dataset.lpMode);const menu=root.querySelector('[data-lp-h1sg-dir-menu]');if(!menu)return;const btns=Array.from(menu.querySelectorAll('[data-lp-h1sg-dir]'));const opts=Array.isArray(cfg.menuOptions)?cfg.menuOptions:[];btns.forEach((btn,idx)=>{const opt=opts[idx];if(!btn||!opt)return;btn.textContent=String(opt.label||'');btn.setAttribute('data-lp-h1sg-dir',String(opt.action||''));});}
function lpH1StudyStartNearestHitNode(root,e){try{if(!root||!root.querySelectorAll)return null;const point=lpEventPoint(e);if(!point)return null;const hits=[];Array.from(root.querySelectorAll('.lp-node[data-lp-loc]')).forEach((el)=>{const rect=el&&el.getBoundingClientRect?el.getBoundingClientRect():null;if(!rect||rect.width<=0||rect.height<=0)return;const pad=8;if(point.x<rect.left-pad||point.x>rect.right+pad||point.y<rect.top-pad||point.y>rect.bottom+pad)return;const dx=point.x-(rect.left+rect.width/2);const dy=point.y-(rect.top+rect.height/2);const nx=dx/Math.max(12,rect.width/2);const ny=dy/Math.max(12,rect.height/2);const inside=point.x>=rect.left&&point.x<=rect.right&&point.y>=rect.top&&point.y<=rect.bottom;hits.push({el,inside:inside?1:0,score:nx*nx+ny*ny,area:rect.width*rect.height});});if(!hits.length)return null;hits.sort((a,b)=>(b.inside-a.inside)||(a.score-b.score)||(a.area-b.area));return hits[0].el||null;}catch(_){return null;}}
function lpH1StudyStartResolveTapSelection(modal,e,initialLoc){const root=modal||lpRouteMapActiveModal();if(!root)return false;const state=root.__lpH1StudyState;if(!state)return false;const target=normLoc(state.target||currentRelPath());const targetKey=lpCanonKey(target);const nodeRoot=lpH1StudyStartViewport(root)||root;const graph=root.__lpGraph||state.graph||window.__lpLearningPathGraph;const locCandidates=[];const seen=new Set();const pushCandidate=(raw)=>{const loc=normLoc(raw||'');const key=lpCanonKey(loc);if(!loc||!key||seen.has(key))return;seen.add(key);locCandidates.push(loc);};pushCandidate(initialLoc||'');if(e){const bestNode=lpBestTapNodeFromEvent(nodeRoot,e,'.lp-node[data-lp-loc]')||lpBestTapNodeFromEvent(root,e,'.lp-node[data-lp-loc]');const strictNode=lpStrictNodeFromEvent(nodeRoot,e,'.lp-node[data-lp-loc]')||lpStrictNodeFromEvent(root,e,'.lp-node[data-lp-loc]');const fallbackNode=e.target&&e.target.closest?e.target.closest('.lp-node[data-lp-loc]'):null;pushCandidate(bestNode&&bestNode.getAttribute?bestNode.getAttribute('data-lp-loc')||'':'');pushCandidate(strictNode&&strictNode.getAttribute?strictNode.getAttribute('data-lp-loc')||'':'');pushCandidate(fallbackNode&&fallbackNode.getAttribute?fallbackNode.getAttribute('data-lp-loc')||'':'');}
lpRouteMapHideDirectionMenu(root);let sawTargetOnly=false;for(const pickLoc of locCandidates){if(lpCanonKey(pickLoc)===targetKey){sawTargetOnly=true;continue;}
const path=lpH1StudyStartPath(graph,pickLoc,target,state.distMap,state.parentOf,state.mode);if(!path.length)continue;try{lpH1StudyRouteAnimStop(root);}catch(_){}
root.__lpH1RenderedAnimKey='';root.__lpH1ExplicitRoutePlay=true;state.startLoc=pickLoc;state.path=path.slice();lpH1StudyStartRenderSelection(lpH1StudyStartViewport(root),state);return true;}
if(sawTargetOnly){lpH1StudyStartClearSelection(root);return true;}
return false;}
function lpH1StudyStartShowLoading(modal,targetLoc,text,mode){if(!modal)return;const host=modal.querySelector('[data-lp-h1sg-stage-host]');const helperLine=modal.querySelector('[data-lp-map-helper-panel]');const cfg=lpRouteMapConfig(mode);const target=normLoc(targetLoc||currentRelPath());const targetTitle=cleanTitle(nodeTitle(window.__lpLearningPathGraph,target)||target||'');if(helperLine)helperLine.textContent=targetTitle?(cfg.mode===LP_ROUTE_MAP_MODE.FROM_HERE?`Preparing the dependents map from ${targetTitle}…`:`Preparing the guided study route into ${targetTitle}…`):cfg.prepLine;if(!host)return;const estimate=lpH1StudyStartEstimateHostSize(modal);host.style.minHeight=`${Math.max(420, Number(estimate.hostH) || 420)}px`;host.innerHTML=`
      <div class="lp-h1sg-loading" data-lp-h1sg-loading="1" role="status" aria-live="polite">
        <div class="lp-h1sg-loading-spinner" aria-hidden="true"></div>
        <div class="lp-h1sg-loading-title">${escapeHtml(String(text || 'Rendering the full guided study map…'))}</div>
        <div class="lp-h1sg-loading-sub">The full map will appear as soon as the layout is ready.</div>
      </div>
    `;}
function lpH1StudyStartWarmCurrent(graph,targetLoc){const activeGraph=graph||window.__lpLearningPathGraph;if(!activeGraph)return;const target=normLoc(targetLoc||currentRelPath());if(!target)return;const estimate=lpH1StudyStartEstimateHostSize();__mkRunIdle(()=>{try{if(document.hidden)return;}catch(_){}
lpH1StudyStartEnsurePrepared(activeGraph,target,estimate.hostW,estimate.hostH,LP_ROUTE_MAP_MODE.TO_HERE,{defer:false}).catch(()=>null).finally(()=>{__mkRunIdle(()=>{try{if(document.hidden)return;}catch(_){}
lpH1StudyStartEnsurePrepared(activeGraph,target,estimate.hostW,estimate.hostH,LP_ROUTE_MAP_MODE.FROM_HERE,{defer:false}).catch(()=>null);},900);});},1400);}
function lpH1StudyStartClearSelection(modal){if(!modal)return;const state=modal.__lpH1StudyState;if(!state)return;state.startLoc="";state.path=[];lpH1StudyStartRenderSelection(lpH1StudyStartViewport(modal),state);}
function lpH1StudyStartSyncModalChrome(modal,mode){if(!modal)return lpRouteMapConfig(mode);const cfg=lpRouteMapConfig(mode);modal.dataset.lpMode=cfg.mode;const dialog=modal.querySelector('.lp-mbox');if(dialog)dialog.setAttribute('aria-label',cfg.ariaLabel);const helperLine=modal.querySelector('[data-lp-map-helper-panel]');if(helperLine)helperLine.textContent=cfg.helperText;lpMapTipsSet(modal,cfg.mode);lpSyncMapTabs(modal,cfg.mode);const filterInput=modal.querySelector('[data-lp-h1sg-filter-input]');if(filterInput)filterInput.setAttribute('placeholder',cfg.filterPlaceholder);const switchBtn=modal.querySelector('[data-lp-h1sg-switch]');if(switchBtn){switchBtn.textContent=cfg.switchLabel;switchBtn.setAttribute('aria-label',cfg.switchAriaLabel);switchBtn.dataset.lpSwitchMode=cfg.switchMode;}
const filterShell=filterInput&&filterInput.closest?filterInput.closest('.lp-h1sg-filter'):null;if(filterShell){const ph=String(cfg.filterPlaceholder||'');const ch=Math.max(16,Math.min(32,ph.length+4));filterShell.style.setProperty('--lp-h1sg-filter-ch',`${ch}ch`);}
if(helperLine){const helperCh=Math.max(28,Math.min(96,String(cfg.helperText||'').length+6));helperLine.style.setProperty('--lp-h1sg-helper-max-ch',`${helperCh}ch`);}
lpMapTipsCollapse(modal);lpRouteMapSyncDirectionMenu(modal,cfg.mode);return cfg;}
function lpH1StudyStartRenderModal(graph,targetLoc,preparedData,mode){const modal=lpRouteMapActiveModal();if(!modal)return;lp3dActivateModal(modal,'route');const cfg=lpH1StudyStartSyncModalChrome(modal,mode||(preparedData&&preparedData.mode)||modal.dataset.lpMode);const host=modal.querySelector("[data-lp-h1sg-stage-host]");const filterInput=modal.querySelector("[data-lp-h1sg-filter-input]");const helperLine=modal.querySelector("[data-lp-map-helper-panel]");if(!host)return;const boxRect=(modal.querySelector(".lp-mbox")||modal).getBoundingClientRect();const topbarRect=(modal.querySelector(".lp-h1sg-topbar")||host).getBoundingClientRect();const zoomRect=(modal.querySelector(".lp-mzoom")||host).getBoundingClientRect();const hostRect=host.getBoundingClientRect();const fallbackW=Math.max(320,Math.floor((boxRect.width||0)-24)||320);const fallbackH=Math.max(420,Math.floor((boxRect.height||0)-(topbarRect.height||0)-(zoomRect.height||0)-28)||420);host.style.minHeight=`${fallbackH}px`;const hostW=Math.max(320,Math.floor(host.clientWidth||hostRect.width||fallbackW));const hostH=Math.max(420,Math.floor(host.clientHeight||hostRect.height||fallbackH));const prepared=(preparedData&&preparedData.tree)?preparedData:lpH1StudyStartPrepare(graph,targetLoc||currentRelPath(),hostW,hostH,cfg.mode);const tree=prepared.tree;const target=prepared.target||normLoc(targetLoc||currentRelPath());modal.dataset.lpTargetLoc=target;if(helperLine)helperLine.textContent=prepared.helperText||cfg.helperText;if(filterInput)filterInput.setAttribute('placeholder',cfg.filterPlaceholder);try{lpH1StudyStartLaunchCleanup(modal);}catch(_){}
host.innerHTML="";const viewport=document.createElement("div");viewport.className="lp-mapviewport";viewport.setAttribute("data-lp-h1sg-viewport","1");const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("class","lp-h1sg-overlay");svg.setAttribute("aria-hidden","true");viewport.appendChild(svg);const positions=prepared.positions instanceof Map?prepared.positions:new Map();const layoutParentOf=prepared.layoutParentOf instanceof Map?prepared.layoutParentOf:new Map();const worldW=Math.max(960,Math.round(Number(prepared.worldW)||hostW||960));const worldH=Math.max(960,Math.round(Number(prepared.worldH)||hostH||960));const cx=Math.round(Number(prepared.cx)||(worldW/2));const cy=Math.round(Number(prepared.cy)||(worldH/2));viewport.style.width=`${worldW}px`;viewport.style.height=`${worldH}px`;svg.setAttribute("viewBox",`0 0 ${worldW} ${worldH}`);svg.setAttribute("width",String(worldW));svg.setAttribute("height",String(worldH));const prevState=modal.__lpH1StudyState||{};const revealMemory=modal.__lpH1RouteRevealMemory&&typeof modal.__lpH1RouteRevealMemory==='object'?modal.__lpH1RouteRevealMemory:(modal.__lpH1RouteRevealMemory=Object.create(null));const prevRevealSet=revealMemory[cfg.mode]instanceof Set?revealMemory[cfg.mode]:(prevState.mode===cfg.mode?lpH1StudyRouteRevealSetForState(prevState):new Set());const renderNodes=[];for(const layer of tree.layers){const depth=Math.max(0,Number(layer&&layer.depth)||0);const nodes=(layer&&layer.nodes?layer.nodes.slice():[]).filter(Boolean);if(!nodes.length)continue;for(const locRaw of nodes){const loc=normLoc(locRaw);if(!loc||!positions.has(loc))continue;const pos=positions.get(loc)||{};renderNodes.push({loc,depth,x:Math.round(Number(pos.x)||cx),y:Math.round(Number(pos.y)||cy),});}}
renderNodes.sort((a,b)=>{if(a.depth!==b.depth)return b.depth-a.depth;if(a.y!==b.y)return a.y-b.y;return a.x-b.x;});const sharedRevealedNodes=new Set([...(prevRevealSet||new Set()),...lpSharedRevealSet()]);const nodeFragment=document.createDocumentFragment();const pendingMathNodes=[];for(const item of renderNodes){const loc=item.loc;const btn=document.createElement("button");btn.type="button";btn.className="lp-node";btn.setAttribute("data-lp-loc",loc);btn.style.left=`${item.x}px`;btn.style.top=`${item.y}px`;const content=lpH1StudyStartNodeContent(graph,loc,{mode:cfg.mode,target,depth:item.depth,revealedRouteNodes:sharedRevealedNodes,});btn.setAttribute("aria-label",content.titleText||loc);btn.dataset.lpVisual=content.visualKey||"";btn.setAttribute("data-lp-raw-title",content.titleText||loc||"");const titleEl=content.el&&content.el.querySelector?content.el.querySelector('.lp-node-title'):null;btn.setAttribute("data-lp-raw-html",content&&typeof content.rawHtml==='string'?__lpSanitizeRenderedMathHtml(String(content.rawHtml||"")):(titleEl?__lpSanitizeRenderedMathHtml(String(titleEl.innerHTML||"")):""));btn.setAttribute("data-lp-has-math",content&&content.hasMath?"1":"0");btn.setAttribute("data-lp-mask-text",content&&content.maskText?content.maskText:"?");btn.setAttribute("data-lp-route-mask-mode",content&&content.maskMode?content.maskMode:"none");btn.setAttribute("data-lp-route-depth",String(item.depth));if(content&&content.masked)btn.classList.add("is-route-masked",content.maskMode==='weak'?'is-route-masked-weak':'is-route-masked-full');btn.style.transition='transform .14s ease, opacity .14s ease, z-index .14s ease, filter .18s ease';if(content.visualKey==="mastered")btn.classList.add("lp-node-mastered");if(lpCanonKey(loc)===lpCanonKey(target))btn.classList.add("is-cur","is-target");btn.appendChild(content.el);nodeFragment.appendChild(btn);lpH1StudyStartBindMaskPreview(btn,modal);lpH1StudyRouteApplyNodeMask(btn,{query:prevState.query||'',revealedRouteNodes:prevRevealSet});if(titleEl&&lpNodeTitleNeedsTypeset(titleEl)){lpSetNodeTitleMathPending(btn,true);pendingMathNodes.push(btn);}}
viewport.appendChild(nodeFragment);const launch=document.createElement("button");launch.type="button";launch.className="lp-h1sg-launch";launch.hidden=true;launch.textContent=cfg.launchText;viewport.appendChild(launch);host.appendChild(viewport);modal.__lpH1Viewport=viewport;lpRouteMapSyncDirectionMenu(modal,cfg.mode);lpRouteMapHideDirectionMenu(modal);const selectedStart=prevState.startLoc&&tree.distMap.has(normLoc(prevState.startLoc))?normLoc(prevState.startLoc):"";const state={graph,mode:cfg.mode,target,distMap:tree.distMap,parentOf:layoutParentOf,positions,query:prevState.mode===cfg.mode?(prevState.query||""):"",startLoc:selectedStart,path:selectedStart?lpH1StudyStartPath(graph,selectedStart,target,tree.distMap,layoutParentOf,cfg.mode):[],revealedRouteNodes:new Set([...(prevRevealSet||new Set()),...lpSharedRevealSet()])};revealMemory[cfg.mode]=state.revealedRouteNodes;modal.__lpH1StudyState=state;lpH1StudyRouteRefreshSemanticPairs(modal);const view=lpH1StudyStartEnsureView(modal);view.stageW=hostW;view.stageH=hostH;view.worldW=worldW;view.worldH=worldH;view.worldCX=cx;view.worldCY=cy;if(view.forceCenter||!view.userMoved){lpH1StudyStartCenterView(modal);view.forceCenter=false;}
lpH1StudyStartApplyTransform(modal);if(filterInput&&filterInput.value!==(state.query||""))filterInput.value=state.query||"";lpH1StudyStartRenderSelection(viewport,state);modal.__lpH1RenderedFor=lpCanonKey(target);modal.__lpH1RenderedGraph=graph||null;modal.__lpH1RenderedHostW=hostW;modal.__lpH1RenderedHostH=hostH;modal.__lpH1RenderedCacheKey=prepared.cacheKey||'';modal.__lpH1RenderedMode=cfg.mode;modal.__lpH1RenderedFogEnabled=lpFogEnabled();if(pendingMathNodes.length){__mkRunIdle(()=>{if(modal.__lpH1StudyState!==state||modal.__lpH1Viewport!==viewport)return;const titleEls=pendingMathNodes.map((nodeEl)=>nodeEl.querySelector('.lp-node-title')).filter(Boolean);typesetMathSafe(titleEls).then(()=>{pendingMathNodes.forEach((nodeEl)=>{const titleEl=nodeEl.querySelector('.lp-node-title');try{if(titleEl)lpDeduplicateRenderedMathInTitleEl(titleEl);}catch(_){}
lpSetNodeTitleMathPending(nodeEl,false);try{lpCacheRenderedNodeTitle(graph,nodeEl);}catch(_){}});if(modal.__lpH1StudyState===state&&modal.__lpH1Viewport===viewport){lpH1StudyRouteRefreshSemanticPairs(modal);lpH1StudyStartApplyTransform(modal,{skipClamp:true});}}).catch(()=>{pendingMathNodes.forEach((nodeEl)=>lpSetNodeTitleMathPending(nodeEl,false));});},700);}
requestAnimationFrame(()=>{try{lpH1StudyStartEnsureTargetVisible(modal);}catch(_){}});}
function lpH1StudyStartRerenderPreservingView(modal,graph,targetLoc,mode){try{if(!modal||!graph||!modal.classList.contains('lp-open'))return false;const anim=modal.__lpH1RouteAnim;if(anim&&!anim.cancelled)return false;const view=lpH1StudyStartEnsureView(modal);const saved={scale:Number(view.scale)||lpMapDefaultActualScale(),tx:Number(view.tx)||0,ty:Number(view.ty)||0,stageW:Number(view.stageW)||0,stageH:Number(view.stageH)||0,worldCX:Number(view.worldCX)||0,worldCY:Number(view.worldCY)||0,userMoved:!!view.userMoved,forceCenter:!!view.forceCenter};modal.__lpH1PreserveViewUntil=Date.now()+900;lpH1StudyStartRenderModal(graph,targetLoc||currentRelPath(),null,mode||modal.dataset.lpMode||LP_ROUTE_MAP_MODE.TO_HERE);const next=lpH1StudyStartEnsureView(modal);next.scale=saved.scale;next.tx=saved.tx+((Number(next.stageW)||0)-saved.stageW)/2+(saved.worldCX-(Number(next.worldCX)||0))*saved.scale;next.ty=saved.ty+((Number(next.stageH)||0)-saved.stageH)/2+(saved.worldCY-(Number(next.worldCY)||0))*saved.scale;next.userMoved=saved.userMoved;next.forceCenter=saved.forceCenter;lpH1StudyStartApplyTransform(modal,{skipClamp:true});return true;}catch(_){return false;}}
function ensureH1StudyStartModal(){let modal=document.getElementById("lp-h1sg-modal");if(!modal){modal=document.createElement("div");modal.id="lp-h1sg-modal";modal.setAttribute("aria-hidden","true");modal.style.display="none";modal.innerHTML=`
        <div class="lp-mbox" role="dialog" aria-modal="true" aria-label="Concept maps">
          <button class="lp-full" type="button" aria-label="Fullscreen" data-lp-h1sg-fullscreen></button>
          <button class="lp-close" type="button" aria-label="Close">✕</button>
          <div class="lp-h1sg-topbar">
            <div class="lp-h1sg-tophead">
              <div class="lp-h1sg-tabs" role="tablist" aria-label="Map views">
                <button type="button" class="lp-h1sg-tab" data-lp-map-tab="toHere" role="tab" aria-selected="false"><span class="lp-tab-label-long">Prerequisites</span><span class="lp-tab-label-short">Prerequisites</span></button>
                <button type="button" class="lp-h1sg-tab" data-lp-map-tab="local" role="tab" aria-selected="false"><span class="lp-tab-label-long">Nearby</span><span class="lp-tab-label-short">Nearby</span></button>
                <button type="button" class="lp-h1sg-tab" data-lp-map-tab="fromHere" role="tab" aria-selected="false"><span class="lp-tab-label-long">Dependents</span><span class="lp-tab-label-short">Dependents</span></button>
              </div>
              <button type="button" class="lp-h1sg-tipbtn" data-lp-map-tip-toggle aria-expanded="false">
                <span class="lp-h1sg-tipbtn-icon" aria-hidden="true">i</span>
                <span class="lp-h1sg-tipbtn-text">Map tips</span>
              </button>
              <div class="lp-h1sg-filter">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>
                <input type="text" autocomplete="off" spellcheck="false" placeholder="Find a prerequisite" data-lp-h1sg-filter-input>
              </div>
            </div>
            <div class="lp-map-context">
              <button class="lp-btn lp-map-fit" type="button" data-lp-map-fit aria-label="Fit all map nodes in view" title="Zoom out until every concept fits on screen"><svg class="lp-map-fit-ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2 5.6V2h3.6M14 5.6V2h-3.6M2 10.4V14h3.6M14 10.4V14h-3.6"/></svg><span class="lp-map-fit-txt">Fit all</span></button>
              <div class="lp-map-context-copy" role="status" aria-live="polite" aria-atomic="true">
                <span data-lp-map-context>Select a node to show a learning path.</span>
                <span class="lp-map-route-endpoints" data-lp-map-route-endpoints hidden></span>
                <span class="lp-map-context-note" data-lp-map-fit-status hidden></span>
              </div>
            </div>
            <div class="lp-h1sg-helper" data-lp-map-helper-panel hidden></div>
          </div>
          <div class="lp-mbody">
            <div class="lp-mapstage" data-lp-h1sg-stage-host></div>
            <div class="lp-h1sg-dir-menu" data-lp-h1sg-dir-menu hidden>
              <button class="lp-h1sg-dir-btn" type="button" data-lp-h1sg-dir="nearHere">Near here</button>
              <button class="lp-h1sg-dir-btn" type="button" data-lp-h1sg-dir="fromHere">From here</button>
            </div>
          </div>
          <button class="lp-h1sg-docklaunch" type="button" hidden data-lp-h1sg-dock-launch title="Begin the selected learning path">Start guided study</button>
          <div class="lp-mzoom">
            <div class="lp-ctrl-group lp-zoombar lp-zoomctrl">
              <button class="lp-btn lp-zoom-dec" type="button" aria-label="Zoom out" title="Zoom out" data-lp-h1sg-zoom-dec>-</button>
              <input class="lp-zoomrange lp-zoom-range" type="range" min="30" max="200" step="1" value="100" aria-label="Zoom" data-lp-h1sg-zoom-range>
              <div class="lp-hop lp-zoom-label" data-lp-h1sg-zoom-label>100%</div>
              <button class="lp-btn lp-zoom-inc" type="button" aria-label="Zoom in" title="Zoom in" data-lp-h1sg-zoom-inc>+</button>
              <button class="lp-btn lp-zoom-reset" type="button" aria-label="Reset zoom" title="Reset zoom" data-lp-h1sg-zoom-reset>Reset</button>
            </div>
          </div>
        </div>
      `;document.body.appendChild(modal);lpInstallBlankLongPressSelectionGuard(modal);}
try{const box=modal.querySelector('.lp-mbox');const dock=box&&box.querySelector(':scope > .lp-mzoom');const launch=box&&box.querySelector('[data-lp-h1sg-dock-launch]');if(box&&dock&&launch&&launch.parentElement===dock)box.insertBefore(launch,dock);}catch(_){}
if(modal.__lpBound)return modal;modal.__lpBound=true;lpH1StudyStartSyncModalChrome(modal,modal.dataset.lpMode||LP_ROUTE_MAP_MODE.TO_HERE);const closeBtn=modal.querySelector(".lp-close");if(closeBtn)lpBindTap(closeBtn,()=>hideH1StudyStartModal());const fsBtn=modal.querySelector("[data-lp-h1sg-fullscreen]");if(fsBtn){lpSetFullscreenIcon(fsBtn,false);lpBindTap(fsBtn,()=>{modal.classList.toggle("lp-full");lpSetFullscreenIcon(fsBtn,modal.classList.contains("lp-full"));const view=lpH1StudyStartEnsureView(modal);view.forceCenter=true;view.userMoved=false;const graph=modal.__lpGraph||window.__lpLearningPathGraph;if(graph){requestAnimationFrame(()=>{const v=lpH1StudyStartEnsureView(modal);v.forceCenter=true;v.userMoved=false;lpH1StudyStartRenderModal(graph,modal.dataset.lpTargetLoc||currentRelPath(),null,modal.dataset.lpMode||LP_ROUTE_MAP_MODE.TO_HERE);});}});}
modal.addEventListener("click",(e)=>{if(e.target===modal)hideH1StudyStartModal();});const filterInput=modal.querySelector("[data-lp-h1sg-filter-input]");if(filterInput){filterInput.addEventListener("input",()=>lpH1StudyStartApplyFilter(modal,filterInput.value||""));}
const dockLaunchBtn=modal.querySelector('[data-lp-h1sg-dock-launch]');if(dockLaunchBtn&&!dockLaunchBtn.__lpHoverBound){dockLaunchBtn.__lpHoverBound=true;dockLaunchBtn.addEventListener('mouseenter',()=>{try{dockLaunchBtn.classList.add('is-hover');}catch(_){}});dockLaunchBtn.addEventListener('mouseleave',()=>{try{dockLaunchBtn.classList.remove('is-hover');}catch(_){}
try{dockLaunchBtn.classList.remove('is-press');}catch(_){}});dockLaunchBtn.addEventListener('pointerdown',()=>{try{dockLaunchBtn.classList.add('is-press');}catch(_){}},{passive:true});const clearDockLaunchPress=()=>{try{dockLaunchBtn.classList.remove('is-press');}catch(_){}};dockLaunchBtn.addEventListener('pointerup',clearDockLaunchPress,{passive:true});dockLaunchBtn.addEventListener('pointercancel',clearDockLaunchPress,{passive:true});dockLaunchBtn.addEventListener('blur',()=>{try{dockLaunchBtn.classList.remove('is-hover');}catch(_){}
try{dockLaunchBtn.classList.remove('is-press');}catch(_){}});dockLaunchBtn.addEventListener('focus',()=>{try{dockLaunchBtn.classList.add('is-hover');}catch(_){}});}
modal.addEventListener("click",(e)=>{const tab=e.target&&e.target.closest?e.target.closest('[data-lp-map-tab]'):null;if(tab){e.preventDefault();e.stopPropagation();const kind=tab.getAttribute('data-lp-map-tab')||'local';const currentMode=modal.dataset.lpMode||LP_ROUTE_MAP_MODE.TO_HERE;if(kind==='local'){lpMapTipsCollapse(modal);lpOpenMapTab('local',modal.__lpGraph||window.__lpLearningPathGraph||null);return;}
if(kind===currentMode){lpSyncMapTabs(modal,currentMode);lpMapTipsCollapse(modal);return;}
lpMapTipsCollapse(modal);lpOpenMapTab(kind,modal.__lpGraph||window.__lpLearningPathGraph||null);return;}
const tipBtn=e.target&&e.target.closest?e.target.closest('[data-lp-map-tip-toggle]'):null;if(tipBtn){e.preventDefault();e.stopPropagation();lpMapTipsToggle(modal);return;}
const launch=e.target&&e.target.closest?e.target.closest(".lp-h1sg-launch, [data-lp-h1sg-dock-launch]"):null;if(launch){e.preventDefault();e.stopPropagation();lpH1StudyStartLaunch();return;}
const dirBtn=e.target&&e.target.closest?e.target.closest('[data-lp-h1sg-dir]'):null;if(dirBtn){e.preventDefault();e.stopPropagation();return;}});window.addEventListener("keydown",(e)=>{if(e.isComposing||e.keyCode===229)return;if(e.key==="Escape"&&modal.style.display!=="none")hideH1StudyStartModal();});let dragState=null;const DRAG_THRESHOLD=8;let __lpRouteDragRaf=0;let __lpRouteDragSkipRangeSync=false;let __lpRouteDragSkipClamp=false;function lpRouteSetDragCompositor(on){try{modal&&modal.classList&&modal.classList.toggle("lp-map-dragging",!!on);}catch(_){}
const state=modal&&modal.__lpH1StudyState;const keepVirtualized=!!(state&&state.positions instanceof Map&&state.positions.size>48);try{modal&&modal.classList&&modal.classList.toggle("lp-map-virtualized",keepVirtualized);}catch(_){}
lpH1StudyStartCullForDrag(modal,!!on||keepVirtualized,true);}
function lpRouteScheduleTransform(opts){__lpRouteDragSkipRangeSync=__lpRouteDragSkipRangeSync||!!(opts&&opts.skipRangeSync);__lpRouteDragSkipClamp=__lpRouteDragSkipClamp||!!(opts&&opts.skipClamp);if(__lpRouteDragRaf)return;__lpRouteDragRaf=requestAnimationFrame(()=>{__lpRouteDragRaf=0;const skipRangeSync=__lpRouteDragSkipRangeSync;const skipClamp=__lpRouteDragSkipClamp;__lpRouteDragSkipRangeSync=false;__lpRouteDragSkipClamp=false;lpH1StudyStartApplyTransform(modal,{skipRangeSync,skipClamp});});}
function lpRouteFlushTransform(opts){if(__lpRouteDragRaf){try{cancelAnimationFrame(__lpRouteDragRaf);}catch(_){}
__lpRouteDragRaf=0;}
const skipRangeSync=!!(opts&&opts.skipRangeSync);const skipClamp=!!(opts&&opts.skipClamp);__lpRouteDragSkipRangeSync=false;__lpRouteDragSkipClamp=false;lpH1StudyStartApplyTransform(modal,{skipRangeSync,skipClamp});}
modal.addEventListener("pointerdown",(e)=>{if(!modal.classList.contains("lp-open"))return;const stage=lpH1StudyStartStage(modal);if(!stage)return;const target=e.target;if(!(target&&target.closest))return;if(!target.closest(".lp-mapstage"))return;if(target.closest(".lp-h1sg-launch"))return;if(target.closest(".lp-h1sg-topbar"))return;if(target.closest(".lp-mzoom"))return;if(target.closest(".lp-close"))return;if(target.closest("[data-lp-h1sg-fullscreen]"))return;if(target.closest("[data-lp-h1sg-dir-menu]"))return;lpRouteMapHideDirectionMenu(modal);const nodeRoot=lpH1StudyStartViewport(modal)||modal;const directNode=target.closest(".lp-node[data-lp-loc]");const nearestNode=lpH1StudyStartNearestHitNode(nodeRoot,e);const strictNode=lpStrictNodeFromEvent(nodeRoot,e,'.lp-node[data-lp-loc]')||lpStrictNodeFromEvent(modal,e,'.lp-node[data-lp-loc]');const node=nearestNode||directNode||strictNode||lpBestTapNodeFromEvent(nodeRoot,e,'.lp-node[data-lp-loc]')||lpBestTapNodeFromEvent(modal,e,'.lp-node[data-lp-loc]');dragState={pid:e.pointerId,sx:e.clientX,sy:e.clientY,lastX:e.clientX,lastY:e.clientY,nodeLoc:node?(node.getAttribute("data-lp-loc")||""):"",dragging:false,tapSlop:lpTapDragThreshold(e,!!node)};try{stage.setPointerCapture&&stage.setPointerCapture(e.pointerId);}catch(_){}
if(e.cancelable)e.preventDefault();},{passive:false,capture:true});modal.addEventListener("pointermove",(e)=>{if(!dragState||dragState.pid!==e.pointerId)return;const dx0=e.clientX-dragState.sx;const dy0=e.clientY-dragState.sy;const dragThreshold=Math.max(8,Number(dragState.tapSlop)||DRAG_THRESHOLD);if(!dragState.dragging&&(dx0*dx0+dy0*dy0)>=(dragThreshold*dragThreshold)){dragState.dragging=true;lpRouteSetDragCompositor(true);}
if(!dragState.dragging)return;const view=lpH1StudyStartEnsureView(modal);view.tx+=e.clientX-dragState.lastX;view.ty+=e.clientY-dragState.lastY;view.userMoved=true;dragState.lastX=e.clientX;dragState.lastY=e.clientY;lpH1StudyStartApplyTransformFast(modal,{skipClamp:true});if(e.cancelable)e.preventDefault();},{passive:false,capture:true});const endDrag=(e)=>{if(!dragState||dragState.pid!==e.pointerId)return;const wasDragging=!!dragState.dragging;const pickLoc=(!wasDragging&&dragState.nodeLoc)?dragState.nodeLoc:"";dragState=null;if(wasDragging){lpRouteFlushTransform({skipRangeSync:true,skipClamp:false});requestAnimationFrame(()=>lpRouteSetDragCompositor(false));}else{lpRouteSetDragCompositor(false);}
if(pickLoc){lpH1StudyStartResolveTapSelection(modal,e,pickLoc);return;}
if(!wasDragging){lpRouteMapHideDirectionMenu(modal);lpH1StudyStartClearSelection(modal);}};modal.addEventListener("pointerup",endDrag,{passive:true,capture:true});modal.addEventListener("pointercancel",endDrag,{passive:true,capture:true});modal.addEventListener("wheel",(e)=>{if(!modal.classList.contains("lp-open"))return;const stage=lpH1StudyStartStage(modal);if(!stage||!(e.target&&stage.contains(e.target)))return;if(e.cancelable)e.preventDefault();const view=lpH1StudyStartEnsureView(modal);const wheelDecision=lpWheelZoomDecision(e,view.__lpWheelZoomState||(view.__lpWheelZoomState={}));if(!wheelDecision.zoom)return;const rect=stage.getBoundingClientRect();const anchor={x:e.clientX-rect.left,y:e.clientY-rect.top};lpH1StudyStartZoomAbout(modal,(Number(view.scale)||1)*wheelDecision.factor,anchor);view.userMoved=true;},{passive:false,capture:true});const btnDec=modal.querySelector("[data-lp-h1sg-zoom-dec]");const btnInc=modal.querySelector("[data-lp-h1sg-zoom-inc]");const btnReset=modal.querySelector("[data-lp-h1sg-zoom-reset]");const zoomRange=modal.querySelector("[data-lp-h1sg-zoom-range]");lpBindTap(modal.querySelector('[data-lp-map-fit]'),()=>lpMapFitView(modal));btnDec&&lpBindTap(btnDec,()=>{const view=lpH1StudyStartEnsureView(modal);lpH1StudyStartZoomAbout(modal,(Number(view.scale)||1)-lpMapZoomStepActualScale(),lpH1StudyStartGetStageCenter(modal));view.userMoved=true;});btnInc&&lpBindTap(btnInc,()=>{const view=lpH1StudyStartEnsureView(modal);lpH1StudyStartZoomAbout(modal,(Number(view.scale)||1)+lpMapZoomStepActualScale(),lpH1StudyStartGetStageCenter(modal));view.userMoved=true;});btnReset&&lpBindTap(btnReset,()=>{const view=lpH1StudyStartEnsureView(modal);lpMapClearFitStatus(modal);view.scale=lpMapDefaultActualScale();view.userMoved=false;view.forceCenter=true;lpH1StudyStartCenterView(modal);lpH1StudyStartApplyTransform(modal);});if(zoomRange){zoomRange.addEventListener("input",()=>{const view=lpH1StudyStartEnsureView(modal);const livePct=Number(zoomRange.value)||100;lpUpdateZoomRangeVisual(zoomRange,livePct,LP_MAP_ZOOM_MIN_PCT,LP_MAP_ZOOM_MAX_PCT);const zoomLabel=modal.querySelector("[data-lp-h1sg-zoom-label]");if(zoomLabel)zoomLabel.textContent=`${Math.round(livePct)}%`;lpH1StudyStartZoomAboutFast(modal,lpMapScaleFromDisplayPct(livePct),lpH1StudyStartGetStageCenter(modal),{skipClamp:true});view.userMoved=true;});zoomRange.addEventListener("change",()=>{lpH1StudyStartApplyTransform(modal,{skipRangeSync:true,skipClamp:false});},{passive:true});}
let pinchState=null;const routeTouchById=(touches,id)=>{if(!touches)return null;for(let i=0;i<touches.length;i++){const t=touches[i];if(t&&t.identifier===id)return t;}
return null;};modal.addEventListener('touchstart',(e)=>{if(!modal.classList.contains('lp-open'))return;const stage=lpH1StudyStartStage(modal);if(!stage)return;if(!e.touches||e.touches.length<2)return;const target=e.target;if(target&&target.closest&&(target.closest('.lp-h1sg-topbar')||target.closest('.lp-mzoom')||target.closest('.lp-close')||target.closest('[data-lp-h1sg-fullscreen]')||target.closest('[data-lp-h1sg-dir-menu]')))return;const t1=e.touches[0],t2=e.touches[1];const rect=stage.getBoundingClientRect();const mx=((t1.clientX+t2.clientX)/2)-rect.left;const my=((t1.clientY+t2.clientY)/2)-rect.top;const view=lpH1StudyStartEnsureView(modal);const scale0=Math.max(lpMapMinActualScale(),Number(view.scale)||lpMapDefaultActualScale());lpRouteSetDragCompositor(true);pinchState={id1:t1.identifier,id2:t2.identifier,d0:Math.max(1e-6,Math.hypot(t2.clientX-t1.clientX,t2.clientY-t1.clientY)),s0:scale0,wx0:(mx-(Number(view.tx)||0))/scale0,wy0:(my-(Number(view.ty)||0))/scale0};dragState=null;if(e.cancelable)e.preventDefault();},{passive:false,capture:true});modal.addEventListener('touchmove',(e)=>{if(!pinchState||!modal.classList.contains('lp-open'))return;const stage=lpH1StudyStartStage(modal);if(!stage)return;const t1=routeTouchById(e.touches,pinchState.id1);const t2=routeTouchById(e.touches,pinchState.id2);if(!t1||!t2)return;const rect=stage.getBoundingClientRect();const mx=((t1.clientX+t2.clientX)/2)-rect.left;const my=((t1.clientY+t2.clientY)/2)-rect.top;const d1=Math.max(1e-6,Math.hypot(t2.clientX-t1.clientX,t2.clientY-t1.clientY));const view=lpH1StudyStartEnsureView(modal);const nextScale=Math.min(lpMapMaxActualScale(),Math.max(lpMapMinActualScale(),(Number(pinchState.s0)||lpMapDefaultActualScale())*(d1/Math.max(1e-6,Number(pinchState.d0)||1))));view.scale=nextScale;view.tx=mx-(Number(pinchState.wx0)||0)*nextScale;view.ty=my-(Number(pinchState.wy0)||0)*nextScale;view.userMoved=true;lpH1StudyStartApplyTransformFast(modal,{skipClamp:true,syncZoomMeta:true});if(e.cancelable)e.preventDefault();},{passive:false,capture:true});const endPinch=()=>{pinchState=null;lpRouteFlushTransform({skipRangeSync:true,skipClamp:false});requestAnimationFrame(()=>lpRouteSetDragCompositor(false));};modal.addEventListener('touchend',endPinch,{passive:true,capture:true});modal.addEventListener('touchcancel',endPinch,{passive:true,capture:true});window.addEventListener("resize",()=>{if(modal.style.display==="none"||!modal.classList.contains("lp-open"))return;const graph=modal.__lpGraph||window.__lpLearningPathGraph;if(!graph)return;lpH1StudyRouteAnimStop(modal);lpH1StudyStartRerenderPreservingView(modal,graph,modal.dataset.lpTargetLoc||currentRelPath(),modal.dataset.lpMode||LP_ROUTE_MAP_MODE.TO_HERE);});return modal;}
function hideH1StudyStartModal(){const modal=lpRouteMapActiveModal();if(!modal)return;try{lpH1StudyRouteAnimStop(modal);}catch(_){}
try{lpH1StudyStartLaunchCleanup(modal);}catch(_){}
try{__lpStopAllFlows();}catch(_){}
try{modal.__lpH1RouteRevealMemory=Object.create(null);}catch(_){}
try{if(modal.__lpH1StudyState&&modal.__lpH1StudyState.revealedRouteNodes instanceof Set){modal.__lpH1StudyState.revealedRouteNodes=new Set();}}catch(_){}
if(modal.classList.contains("lp-doc-surface")){try{document.documentElement.classList.remove("lp-modal-open");}catch(_){}
try{document.body&&document.body.classList.remove("lp-modal-open");}catch(_){}}else{setLpModalScrollLock(false);}
lpExitMapDocumentSurface(modal);lpInstallClickShield(560);modal.classList.remove("lp-open");modal.classList.remove("lp-full");modal.style.display="none";modal.setAttribute("aria-hidden","true");try{const engine=modal.__lpWebgl3dEngine;if(engine&&typeof engine.__disposeLifecycle==='function')engine.__disposeLifecycle();}catch(_){}
modal.__lpH1PendingToken='';lpMapFocusClose(modal);}
function showH1StudyStartModal(graph,targetLoc,mode){if(!lpAnyMapModalOpen()&&!lpConsumeGuestAction("map",{source:"learning-path-route-map",title:"Guided study map"}))return;const modal=ensureH1StudyStartModal();if(!modal)return;ensureH1StudyStartStyles();lp3dActivateModal(modal,'route');const cfg=lpH1StudyStartSyncModalChrome(modal,mode||modal.dataset.lpMode||LP_ROUTE_MAP_MODE.TO_HERE);modal.__lpGraph=graph||window.__lpLearningPathGraph||null;if(!modal.__lpGraph)return;modal.classList.add("lp-open");modal.style.display="flex";try{modal.style.setProperty("z-index",String(LP_MAP_MODAL_Z),"important");}catch(_){}
modal.setAttribute("aria-hidden","false");try{document.dispatchEvent(new CustomEvent("mk:map-opened",{detail:{source:"show-guided-study-map"}}));}catch(_){}
const isMobile=__lpIsMobileMapModal();const usingDocSurface=isMobile&&lpEnterMapDocumentSurface(modal);if(!usingDocSurface)setLpModalScrollLock(true);else{try{document.documentElement.classList.add("lp-modal-open");}catch(_){}
try{document.body&&document.body.classList.add("lp-modal-open");}catch(_){}}
const isDesktopPc=!!(window.matchMedia&&window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)').matches);if(isMobile||isDesktopPc)modal.classList.add("lp-full");else modal.classList.remove("lp-full");lpMapFocusOpen(modal);const view=lpH1StudyStartEnsureView(modal);view.scale=lpMapDefaultActualScale();view.forceCenter=true;view.userMoved=false;const fsBtn=modal.querySelector("[data-lp-h1sg-fullscreen]");if(fsBtn)lpSetFullscreenIcon(fsBtn,modal.classList.contains("lp-full"));const wantedTarget=lpCanonKey(targetLoc||currentRelPath());const stage=lpH1StudyStartStage(modal);const stageRect=stage?stage.getBoundingClientRect():null;const stageWNow=stageRect?Math.max(0,Math.round(stageRect.width||0)):0;const stageHNow=stageRect?Math.max(0,Math.round(stageRect.height||0)):0;const cachedState=modal.__lpH1StudyState;const canReuse=!!(wantedTarget&&stage&&modal.__lpH1RenderedGraph===(modal.__lpGraph||null)&&modal.__lpH1RenderedFor===wantedTarget&&modal.__lpH1RenderedMode===cfg.mode&&modal.__lpH1RenderedFogEnabled===lpFogEnabled()&&lpH1StudyStartViewport(modal)&&lpH1StudyStartViewport(modal).querySelector('.lp-node[data-lp-loc]')&&cachedState&&lpRouteMapMode(cachedState.mode)===cfg.mode&&lpCanonKey(cachedState.target||'')===wantedTarget&&Math.abs((Number(modal.__lpH1RenderedHostW)||0)-stageWNow)<=20&&Math.abs((Number(modal.__lpH1RenderedHostH)||0)-stageHNow)<=20);if(canReuse){const filterInput=modal.querySelector('[data-lp-h1sg-filter-input]');if(filterInput){filterInput.value='';filterInput.setAttribute('placeholder',cfg.filterPlaceholder);}
cachedState.mode=cfg.mode;cachedState.query='';cachedState.startLoc='';cachedState.path=[];view.stageW=stageWNow||Number(view.stageW)||0;view.stageH=stageHNow||Number(view.stageH)||0;lpH1StudyStartCenterView(modal);lpH1StudyStartApplyTransform(modal);lpH1StudyStartRenderSelection(lpH1StudyStartViewport(modal),cachedState);requestAnimationFrame(()=>{try{lpH1StudyStartEnsureTargetVisible(modal);}catch(_){}});return;}
const estimate=lpH1StudyStartEstimateHostSize(modal);const pendingToken=`${Date.now()}|${Math.random()}`;modal.__lpH1PendingToken=pendingToken;const renderPrepared=(prepared)=>{if(!prepared)return;if(modal.style.display==='none'||!modal.classList.contains('lp-open'))return;if(modal.__lpH1PendingToken!==pendingToken)return;lpH1StudyStartRenderModal(modal.__lpGraph,targetLoc||currentRelPath(),prepared,cfg.mode);try{lpH1StudyStartEnsureTargetVisible(modal);}catch(_){}
requestAnimationFrame(()=>{try{lpH1StudyStartEnsureTargetVisible(modal);}catch(_){}});};const exactPrepared=lpH1StudyStartFindPrepared(targetLoc||currentRelPath(),estimate.hostW,estimate.hostH,cfg.mode);if(exactPrepared){renderPrepared(exactPrepared);return;}
lpH1StudyStartShowLoading(modal,targetLoc||currentRelPath(),cfg.loadingLine,cfg.mode);lpH1StudyStartEnsurePrepared(modal.__lpGraph,targetLoc||currentRelPath(),estimate.hostW,estimate.hostH,cfg.mode,{defer:true}).then((prepared)=>{renderPrepared(prepared);}).catch(()=>{if(modal.style.display==='none'||!modal.classList.contains('lp-open'))return;if(modal.__lpH1PendingToken!==pendingToken)return;lpH1StudyStartRenderModal(modal.__lpGraph,targetLoc||currentRelPath(),null,cfg.mode);requestAnimationFrame(()=>{try{lpH1StudyStartEnsureTargetVisible(modal);}catch(_){}});});}
function showH1StudyDependentsModal(graph,targetLoc){showH1StudyStartModal(graph,targetLoc,LP_ROUTE_MAP_MODE.FROM_HERE);}
function ensureH1StudyStartStyles(){if(document.getElementById("lp-h1sg-style-v8f"))return;const st=document.createElement("style");st.id="lp-h1sg-style-v8f";st.textContent=`
      #lp-h1sg-modal{
        position:fixed; inset:0; z-index:9999; display:none;
        align-items:center; justify-content:center;
        background: rgba(0,0,0,.46);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        overscroll-behavior: contain;
        touch-action: none;
        --lp-master-gold-border: rgba(226, 179, 54, .98);
        --lp-master-gold-fill-top: rgba(245, 213, 117, .42);
        --lp-master-gold-fill-bottom: rgba(163, 112, 8, .54);
        --lp-master-gold-glow-soft: rgba(241, 198, 75, .44);
        --lp-master-gold-glow-strong: rgba(241, 198, 75, .86);
        --lp-know-silver-border: rgba(188, 198, 214, .98);
        --lp-know-silver-fill-top: rgba(234, 239, 247, .26);
        --lp-know-silver-fill-bottom: rgba(132, 145, 166, .34);
        --lp-know-silver-glow-soft: rgba(205, 214, 230, .22);
        --lp-know-silver-glow-strong: rgba(205, 214, 230, .42);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal,
      body[data-md-color-scheme="default"] #lp-h1sg-modal{
        --lp-master-gold-border: rgba(202, 150, 20, .98);
        --lp-master-gold-fill-top: rgba(251, 238, 184, .96);
        --lp-master-gold-fill-bottom: rgba(240, 208, 108, .82);
        --lp-master-gold-glow-soft: rgba(235, 191, 65, .42);
        --lp-master-gold-glow-strong: rgba(235, 191, 65, .74);
        --lp-know-silver-border: rgba(146, 156, 171, .98);
        --lp-know-silver-fill-top: rgba(248, 250, 253, .98);
        --lp-know-silver-fill-bottom: rgba(222, 228, 236, .92);
        --lp-know-silver-glow-soft: rgba(164, 173, 189, .16);
        --lp-know-silver-glow-strong: rgba(164, 173, 189, .28);
      }
      html[data-md-color-scheme="slate"] #lp-h1sg-modal,
      body[data-md-color-scheme="slate"] #lp-h1sg-modal{
        --lp-master-gold-border: rgba(241, 198, 75, .98);
        --lp-master-gold-fill-top: rgba(177, 126, 18, .84);
        --lp-master-gold-fill-bottom: rgba(111, 72, 2, .92);
        --lp-master-gold-glow-soft: rgba(248, 214, 111, .50);
        --lp-master-gold-glow-strong: rgba(248, 214, 111, .94);
        --lp-know-silver-border: rgba(202, 213, 229, .98);
        --lp-know-silver-fill-top: rgba(118, 129, 149, .56);
        --lp-know-silver-fill-bottom: rgba(76, 88, 110, .74);
        --lp-know-silver-glow-soft: rgba(207, 218, 235, .26);
        --lp-know-silver-glow-strong: rgba(207, 218, 235, .46);
      }
      #lp-h1sg-modal.lp-open{ display:flex; }
      #lp-h1sg-modal .lp-h1sg-loading{
        min-height:100%;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:12px;
        text-align:center;
        padding:28px 18px;
        color:inherit;
        opacity:.96;
      }
      #lp-h1sg-modal .lp-h1sg-loading-title{
        font-weight:800;
        font-size:1.02rem;
      }
      #lp-h1sg-modal .lp-h1sg-loading-sub{
        max-width:34rem;
        opacity:.74;
        line-height:1.45;
        font-size:.92rem;
      }
      #lp-h1sg-modal .lp-h1sg-loading-spinner{
        width:30px;
        height:30px;
        border-radius:999px;
        border:3px solid rgba(129,140,248,.22);
        border-top-color: rgba(129,140,248,.86);
        animation: lpH1sgSpin .82s linear infinite;
      }
      @keyframes lpH1sgSpin{
        to{ transform:rotate(360deg); }
      }
      #lp-h1sg-modal .lp-mbox{
        width:min(980px, calc(100vw - 2rem));
        height:min(720px, calc(100vh - 2rem));
        border-radius:18px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: transparent;
        box-shadow:0 18px 54px rgba(0,0,0,.28);
        overflow:hidden;
        display:flex; flex-direction:column;
        position:relative;
      }
      #lp-h1sg-modal.lp-full .lp-mbox{
        width:100vw; height:100vh; border-radius:0; border:none !important; box-shadow:none !important;
      }
      #lp-h1sg-modal .lp-full{
        position:absolute; top:calc(env(safe-area-inset-top, 0px) + 12px); right:56px;
        width:36px; height:36px; border-radius:12px;
        display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,.18);
        border:1px solid rgba(255,255,255,.10);
        color:var(--md-default-fg-color);
        cursor:pointer;
        font-size:0;
        line-height:0;
        opacity:.75;
        z-index:6;
        touch-action:manipulation;
      }
      #lp-h1sg-modal .lp-full:hover{ opacity:1; }
      #lp-h1sg-modal .lp-full svg{ width:18px; height:18px; display:block; }
      @media (min-width: 901px){
        #lp-h1sg-modal [data-lp-h1sg-fullscreen]{ display:none !important; }
      }
      #lp-h1sg-modal .lp-full svg *,
      #lp-h1sg-modal .lp-close svg *{ stroke:currentColor !important; }
      #lp-h1sg-modal .lp-close{
        position:absolute; top:calc(env(safe-area-inset-top, 0px) + 12px); right:12px;
        width:36px; height:36px; border-radius:12px;
        display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,.18);
        border:1px solid rgba(255,255,255,.10);
        color:var(--md-default-fg-color);
        font-size:1.2rem;
        cursor:pointer;
        opacity:.75;
        z-index:6;
        touch-action:manipulation;
      }
      #lp-h1sg-modal .lp-close:hover{ opacity:1; }
      #lp-h1sg-modal .lp-mbody{ flex:1 1 auto; position:relative; padding:0; background:transparent; min-height:0; }
      #lp-h1sg-modal .lp-mapstage{
        position:relative; width:100%; height:100%; min-height:420px; border:none; border-radius:0; overflow:hidden; background:transparent;
      }
      #lp-h1sg-modal .lp-mapviewport{
        position:absolute; left:0; top:0;
        transform-origin:0 0;
        will-change:auto;
      }
      #lp-h1sg-modal .lp-h1sg-overlay{
        position:absolute; inset:0; width:100%; height:100%; pointer-events:none; overflow:visible; z-index:10;
      }
      #lp-h1sg-modal .lp-h1sg-path{
        pointer-events:none;
        stroke:rgba(255,255,255,.95);
        stroke-width:3.1;
        stroke-linecap:round;
        stroke-linejoin:round;
        filter:none;
      }
      #lp-h1sg-modal .lp-h1sg-overlay .lp-flow-arrow{
        pointer-events:none;
        opacity:1;
        filter:none;
      }

      #lp-h1sg-modal .lp-h1sg-topbar{
        position:absolute;
        left:16px; right:112px; top:calc(env(safe-area-inset-top, 0px) + 14px);
        z-index:5;
        display:flex;
        flex-direction:column;
        align-items:flex-start;
        gap:10px;
        pointer-events:auto;
      }
      #lp-h1sg-modal .lp-h1sg-tabs{
        display:inline-flex;
        align-items:center;
        gap:8px;
        max-width:calc(100% - 0px);
        padding:6px;
        border-radius:18px;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(7, 12, 24, .42);
        box-shadow:0 12px 24px rgba(0,0,0,.18);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        overflow:auto hidden;
        scrollbar-width:none;
      }
      #lp-h1sg-modal .lp-h1sg-tabs::-webkit-scrollbar{ display:none; }
      #lp-h1sg-modal .lp-h1sg-tab{
        appearance:none;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(255,255,255,.04);
        color:rgba(255,255,255,.82);
        border-radius:14px;
        padding:9px 12px;
        min-height:40px;
        font:inherit;
        font-size:.76rem;
        font-weight:800;
        white-space:nowrap;
        cursor:pointer;
      }
      #lp-h1sg-modal .lp-h1sg-tab.is-active{
        background:rgba(99,102,241,.18);
        color:rgba(255,255,255,.98);
        border-color:rgba(129,140,248,.32);
        box-shadow:inset 0 0 0 1px rgba(129,140,248,.18);
      }
      #lp-h1sg-modal .lp-h1sg-helper{
        flex:0 1 auto;
        display:block;
        width:fit-content;
        max-width:min(860px, calc(100% - 0px));
        min-width:0;
        border-radius:18px;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(7, 12, 24, .42);
        color:rgba(255,255,255,.92);
        padding:8px 14px;
        font-size:clamp(.62rem, .72vw, .74rem);
        line-height:1.18;
        white-space:normal;
        overflow:visible;
        text-overflow:clip;
        box-shadow:0 12px 24px rgba(0,0,0,.18);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      #lp-h1sg-modal .lp-h1sg-topbar-row{
        display:flex;
        align-items:center;
        gap:10px;
        flex:0 1 auto;
        min-width:0;
        flex-wrap:wrap;
      }
      #lp-h1sg-modal .lp-h1sg-filter{
        flex:0 1 auto;
        width:min(max(18rem, var(--lp-h1sg-filter-ch, 28ch)), calc(100% - 0px));
        min-width:0;
        display:flex;
        align-items:center;
        gap:10px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(7, 12, 24, .42);
        color:rgba(255,255,255,.82);
        padding:0 14px;
        height:44px;
        box-shadow:0 12px 24px rgba(0,0,0,.18);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      #lp-h1sg-modal .lp-h1sg-filter svg{
        width:18px; height:18px; flex:0 0 auto;
        fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;
        opacity:.82;
      }
      #lp-h1sg-modal .lp-h1sg-filter input{
        flex:1 1 auto; min-width:0; border:none; background:transparent; color:inherit; font:inherit; outline:none;
      }
      #lp-h1sg-modal .lp-h1sg-filter input::placeholder{ color:rgba(255,255,255,.54); }
      #lp-h1sg-modal .lp-h1sg-nav{ display:none !important; }
      #lp-h1sg-modal .lp-h1sg-navbtn{ display:none !important; }
      #lp-h1sg-modal .lp-h1sg-dir-menu{
        position:absolute;
        z-index:42;
        display:none !important;
        flex-direction:row;
        gap:10px;
        padding:0;
        border:none;
        background:transparent;
        box-shadow:none;
      }
      #lp-h1sg-modal .lp-h1sg-dir-menu,
      #lp-h1sg-modal .lp-h1sg-dir-menu[hidden]{ display:none !important; }
      #lp-h1sg-modal .lp-h1sg-dir-btn{
        appearance:none;
        border:1px solid rgba(255,255,255,.12);
        border-radius:999px;
        background:rgba(7,12,24,.56);
        color:rgba(255,255,255,.98);
        padding:10px 14px;
        min-height:42px;
        width:auto;
        font:inherit;
        font-size:.76rem;
        font-weight:700;
        cursor:pointer;
        box-shadow:0 10px 20px rgba(0,0,0,.22);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }
      #lp-h1sg-modal .lp-h1sg-dir-btn:hover{ background:rgba(7,12,24,.68); }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tabs,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tabs{
        border-color: rgba(15,23,42,.12);
        background: rgba(255,255,255,.96);
        box-shadow: 0 10px 22px rgba(15,23,42,.12);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tab,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tab{
        border-color: rgba(15,23,42,.10);
        background: rgba(255,255,255,.72);
        color: rgba(15,23,42,.72);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tab.is-active,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tab.is-active{
        background: rgba(79,70,229,.12);
        color: rgba(15,23,42,.94);
        border-color: rgba(79,70,229,.18);
        box-shadow: inset 0 0 0 1px rgba(79,70,229,.10);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-helper,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-helper,
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tipbtn,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tipbtn{
        border-color: rgba(15,23,42,.12);
        background: rgba(255,255,255,.96);
        color: rgba(15,23,42,.92);
        box-shadow: 0 10px 22px rgba(15,23,42,.12);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-filter,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-filter{
        border-color: rgba(15,23,42,.12);
        background: rgba(255,255,255,.96);
        color: rgba(15,23,42,.82);
        box-shadow: 0 10px 22px rgba(15,23,42,.12);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-filter input::placeholder,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-filter input::placeholder{ color: rgba(15,23,42,.44); }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-dir-btn,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-dir-btn{
        border-color: rgba(15,23,42,.14);
        background: rgba(255,255,255,.98);
        color: rgba(15,23,42,.92);
        box-shadow: 0 10px 20px rgba(15,23,42,.14);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-dir-btn:hover,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-dir-btn:hover{ background: rgba(248,250,252,.98); }
      #lp-h1sg-modal .lp-node .lp-node-title .lp-h1sg-hit{
        padding:0 .14em;
        border-radius:.42em;
        color:#eef2ff;
        background:rgba(99,102,241,.42);
        box-shadow:0 0 0 1px rgba(129,140,248,.34), 0 0 18px rgba(129,140,248,.24);
      }

      #lp-h1sg-modal .lp-mzoom{
        position:absolute;
        left:50%;
        transform:translateX(-50%);
        bottom:calc(env(safe-area-inset-bottom, 0px) + 16px);
        width:min(560px, calc(100% - 32px));
        z-index:5;
        pointer-events:auto;
        display:flex;
        flex-direction:column;
        gap:10px;
      }
      #lp-h1sg-modal .lp-h1sg-docklaunch{
        appearance:none;
        border:1px solid rgba(129,140,248,.18);
        border-radius:999px;
        padding:.68rem 1rem;
        background:linear-gradient(180deg, rgba(86, 96, 214, .96), rgba(69, 79, 198, .96));
        color:#fff;
        font:inherit;
        font-size:.92rem;
        font-weight:760;
        letter-spacing:0;
        box-shadow:0 10px 22px rgba(0,0,0,.24), 0 0 0 1px rgba(129,140,248,.14);
        cursor:pointer;
        width:100%;
        text-align:center;
      }
      #lp-h1sg-modal .lp-h1sg-docklaunch[hidden]{ display:none !important; }
      #lp-h1sg-modal .lp-mzoom .lp-ctrl-group.lp-zoombar{
        width:100%;
        justify-content:flex-start;
        gap:10px;
        pointer-events:auto;
      }
      #lp-h1sg-modal .lp-ctrl-group.lp-zoombar{
        display:flex; align-items:center; gap:8px;
        padding:7px 12px;
        border-radius:14px;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(0,0,0,.72);
        backdrop-filter:none;
        -webkit-backdrop-filter:none;
        box-shadow:0 10px 26px rgba(0,0,0,.28);
      }
      #lp-h1sg-modal .lp-btn{
        appearance:none; border:1px solid rgba(255,255,255,.10);
        background:rgba(255,255,255,.04);
        color:rgba(255,255,255,.92);
        border-radius:12px; padding:.3rem .55rem; font-weight:780; cursor:pointer;
      }
      #lp-h1sg-modal .lp-btn:hover{ border-color: rgba(255,255,255,.28); background:rgba(99,102,241,.10); }
      #lp-h1sg-modal .lp-hop{
        min-width:4.8rem;
        display:flex;
        align-items:center;
        justify-content:center;
        text-align:center;
        font-weight:800;
        color:rgba(255,255,255,.86);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-ctrl-group.lp-zoombar,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-ctrl-group.lp-zoombar{
        border-color: rgba(15,23,42,.12);
        background: rgba(255,255,255,.96);
        box-shadow: 0 10px 22px rgba(15,23,42,.12);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-btn,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-btn{
        border-color: rgba(15,23,42,.12);
        background: rgba(255,255,255,.72);
        color: rgba(15,23,42,.9);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-hop,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-hop{
        color: rgba(15,23,42,.9);
      }
      #lp-h1sg-modal input.lp-zoomrange{
        flex:1 1 auto;
        width:100%;
        height:26px;
        background:transparent !important;
        accent-color: rgba(255,255,255,.85);
        touch-action:none;
        overscroll-behavior: contain;
        -webkit-user-select:none;
        user-select:none;
        -webkit-appearance:none !important;
        appearance:none !important;
        border:none !important;
        box-shadow:none !important;
        outline:none !important;
        padding:0 !important;
        border-radius:999px !important;
      }
      #lp-h1sg-modal input.lp-zoomrange::-webkit-slider-runnable-track{
        height:6px;
        border-radius:999px;
        background:rgba(255,255,255,.18);
      }
      #lp-h1sg-modal input.lp-zoomrange::-webkit-slider-thumb{
        -webkit-appearance:none;
        width:18px;
        height:18px;
        border-radius:999px;
        margin-top:-6px;
        background:rgba(255,255,255,.88);
        border:1px solid rgba(0,0,0,.25);
        box-shadow:0 6px 18px rgba(0,0,0,.35);
      }
      #lp-h1sg-modal input.lp-zoomrange::-moz-range-track{
        height:6px;
        border-radius:999px;
        background:rgba(255,255,255,.18);
      }
      #lp-h1sg-modal input.lp-zoomrange::-moz-range-thumb{
        width:18px;
        height:18px;
        border-radius:999px;
        background:rgba(255,255,255,.88);
        border:1px solid rgba(0,0,0,.25);
        box-shadow:0 6px 18px rgba(0,0,0,.35);
      }

      #lp-h1sg-modal .lp-node{
        --lp-h1sg-node-cover-bg: rgba(7, 12, 24, .90);
        position:absolute;
        z-index:14;
        width:max-content;
        max-width:none;
        max-inline-size:min(560px, calc(100vw - 48px));
        padding:.45rem .72rem;
        border-radius:999px;
        background:transparent;
        border:none;
        box-shadow:none;
        color:var(--md-default-fg-color);
        font:inherit;
        font-weight:760;
        font-size:1.12em;
        line-height:1.1;
        white-space:nowrap;
        overflow:visible;
        transform:translate(-50%,-50%);
        text-decoration:none;
        isolation:isolate;
        cursor:pointer;
      }
      #lp-h1sg-modal .lp-node .lp-node-label{
        position:relative;
        z-index:1;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:.42rem;
        width:max-content;
        max-width:100%;
        white-space:nowrap;
        overflow:visible;
        text-overflow:clip;
      }
      #lp-h1sg-modal .lp-node .lp-node-prefix{
        display:inline-flex; align-items:center; justify-content:center; flex:0 0 auto;
        width:1.02em; height:1.02em;
      }
      #lp-h1sg-modal .lp-node .lp-node-prefix svg{
        width:1.02em; height:1.02em; display:block;
      }
      #lp-h1sg-modal .lp-node .lp-node-title{
        min-width:0;
        display:inline-block;
        white-space:nowrap;
      }
      #lp-h1sg-modal .lp-node *{ pointer-events:none; }
      #lp-h1sg-modal .lp-node{
        transition: transform .14s ease, opacity .14s ease, z-index .14s ease;
        transform-origin:center center;
      }
      #lp-h1sg-modal[data-lp-zoom-below-one="1"] .lp-node:hover,
      #lp-h1sg-modal[data-lp-zoom-below-one="1"] .lp-node:focus-visible{
        transform:translate(-50%,-50%) scale(var(--lp-h1sg-hover-scale, 1));
        z-index:42;
      }
      #lp-h1sg-modal[data-lp-zoom-below-one="1"] .lp-node:hover::before,
      #lp-h1sg-modal[data-lp-zoom-below-one="1"] .lp-node:focus-visible::before{
        inset:-4px;
        background:transparent;
        box-shadow:none;
      }
      #lp-h1sg-modal[data-lp-zoom-below-one="1"] .lp-node:hover::after,
      #lp-h1sg-modal[data-lp-zoom-below-one="1"] .lp-node:focus-visible::after{
        inset:-4px;
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node{
        --lp-h1sg-node-cover-bg: rgba(255,255,255,.94);
      }
      #lp-h1sg-modal .lp-node::before{
        content:"";
        position:absolute;
        inset:-12px;
        border-radius:999px;
        background:transparent;
        pointer-events:none;
        z-index:-2;
      }
      #lp-h1sg-modal .lp-node::after{
        content:"";
        position:absolute;
        inset:0;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.12);
        background:rgba(255,255,255,.04);
        box-shadow:0 10px 22px rgba(0,0,0,.16);
        pointer-events:none;
        z-index:-1;
      }
      #lp-h1sg-modal .lp-node:hover::after{ border-color: rgba(255,255,255,.85) !important; }
      #lp-h1sg-modal .lp-node.is-route-masked::after{
        background: var(--lp-h1sg-node-cover-bg);
        border-color: rgba(255,255,255,.18);
        box-shadow: 0 10px 22px rgba(0,0,0,.18);
      }
      #lp-h1sg-modal .lp-node.is-route-masked-full::after{
        background: color-mix(in srgb, var(--lp-h1sg-node-cover-bg) 94%, rgba(255,255,255,.08));
      }
      #lp-h1sg-modal .lp-node.is-route-masked-weak::after{
        background: color-mix(in srgb, var(--lp-h1sg-node-cover-bg) 78%, rgba(255,255,255,.18));
        border-color: rgba(255,255,255,.22);
      }
      #lp-h1sg-modal .lp-node.is-route-masked .lp-node-title{
        letter-spacing: .03em;
      }
      #lp-h1sg-modal .lp-node.is-route-preview::after{
        border-color: rgba(129, 140, 248, .78) !important;
        box-shadow:
          0 0 0 1px rgba(129, 140, 248, .30),
          0 0 0 5px rgba(129, 140, 248, .16),
          0 14px 28px rgba(0,0,0,.24) !important;
      }
      #lp-h1sg-modal .lp-node.is-route-revealing::after{
        border-color: rgba(255,255,255,.92) !important;
      }
      #lp-h1sg-modal .lp-node.is-cur{
        padding:.58rem .92rem;
        font-size:1.22em;
        font-weight:820;
        z-index:22;
      }
      #lp-h1sg-modal .lp-node.lp-dim{
        z-index:6;
        opacity:.16;
      }
      #lp-h1sg-modal .lp-node.is-filter-faded{
        z-index:6;
        opacity:.14;
      }
      #lp-h1sg-modal .lp-node.is-route,
      #lp-h1sg-modal .lp-node.is-start,
      #lp-h1sg-modal .lp-node.is-cur{
        z-index:22;
      }
      #lp-h1sg-modal .lp-node.is-filter-match{
        z-index:26;
      }
      #lp-h1sg-modal .lp-node.is-filter-match::after{
        border-color: rgba(129, 140, 248, .88) !important;
        box-shadow:
          0 0 0 1px rgba(129, 140, 248, .38),
          0 0 0 6px rgba(129, 140, 248, .18),
          0 0 30px rgba(129, 140, 248, .22),
          0 14px 28px rgba(0,0,0,.24) !important;
      }
      #lp-h1sg-modal .lp-node.is-route::after{
        border-color: rgba(255,255,255,.82) !important;
        box-shadow:
          0 0 0 1px rgba(255,255,255,.14),
          0 0 0 4px rgba(255,255,255,.08),
          0 14px 28px rgba(0,0,0,.24) !important;
      }
      #lp-h1sg-modal .lp-node.is-start::after,
      #lp-h1sg-modal .lp-node.is-selected-start::after{
        border-color: rgba(129, 140, 248, .94) !important;
        box-shadow:
          0 0 0 1px rgba(129, 140, 248, .34),
          0 0 0 6px rgba(129, 140, 248, .18),
          0 0 28px rgba(129, 140, 248, .24),
          0 14px 30px rgba(0,0,0,.24) !important;
      }
      #lp-h1sg-modal .lp-h1sg-nav-arrow{
        position:absolute;
        left:50%;
        top:66%;
        width:54px;
        height:54px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:999px;
        pointer-events:none;
        z-index:50;
        opacity:0;
        transform:translate(-50%, -50%) scale(.72);
        transform-origin:50% 50%;
        filter:
          drop-shadow(0 12px 20px rgba(0,0,0,.24))
          drop-shadow(0 0 18px rgba(255,255,255,.30));
        transition:opacity .14s ease, transform .18s ease;
      }
      #lp-h1sg-modal .lp-h1sg-nav-arrow svg{
        width:48px;
        height:48px;
        display:block;
      }
      #lp-h1sg-modal .lp-h1sg-nav-arrow.is-visible{
        opacity:1;
        transform:translate(-50%, -50%) scale(1);
      }
      #lp-h1sg-modal .lp-h1sg-nav-arrow.is-hidden{
        opacity:0;
        transform:translate(-50%, -50%) scale(.72);
      }
      #lp-h1sg-modal .lp-node.lp-route-anim-focus{
        z-index:48 !important;
        transform:translate(-50%,-50%) scale(var(--lp-route-pulse-scale, var(--lp-h1sg-node-extra-scale, 1))) !important;
        transform-origin:50% 50% !important;
      }
      #lp-h1sg-modal .lp-node.lp-route-anim-focus::before{
        inset:0;
        background:transparent;
        box-shadow:none;
      }
      #lp-h1sg-modal .lp-node.lp-route-anim-focus::after{
        inset:0;
        transform:none !important;
        transform-origin:50% 50% !important;
        border-color:rgba(255,255,255,.82) !important;
        box-shadow:0 10px 22px rgba(0,0,0,.16) !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus{
        /* Route highlight means visible/not dimmed.  Do not add glow or brightness. */
        --lp-webgl-hover-scale:1 !important;
        transform:translate(-50%, -50%) scale(calc(var(--lp-webgl-label-scale, 1) * var(--lp-route-pulse-scale, 1))) !important;
        transform-origin:50% 50% !important;
        transition:opacity .12s ease, filter .12s ease !important;
        filter:none !important;
        z-index:999 !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus .lp-node-label{
        transform:none !important;
        transform-origin:50% 50% !important;
        align-items:center !important;
        justify-content:center !important;
      }

      /* Route animation scale correction: scale each active node exactly once. */
      #lp-h1sg-modal .lp-node.lp-route-anim-focus .lp-node-label{
        transform:none !important;
        transform-origin:50% 50% !important;
      }
      #lp-h1sg-modal .lp-h1sg-path.lp-is-hidden{
        opacity:0;
      }

      #lp-h1sg-modal .lp-node.lp-node-mastered::after,
      #lp-h1sg-modal .lp-node[data-lp-visual="mastered"]::after{
        background: linear-gradient(180deg, var(--lp-master-gold-fill-top), var(--lp-master-gold-fill-bottom));
        border-color: var(--lp-master-gold-border) !important;
        box-shadow:
          0 0 0 1px rgba(234, 188, 62, .72),
          0 0 0 5px rgba(234, 188, 62, .24),
          0 0 36px var(--lp-master-gold-glow-soft),
          0 0 72px rgba(246, 207, 90, .34),
          0 0 134px rgba(246, 207, 90, .20),
          0 18px 34px rgba(0,0,0,.28) !important;
        animation: lp-master-glow 1.7s ease-in-out infinite alternate;
      }
      #lp-h1sg-modal .lp-node[data-lp-visual="know"]::after{
        background: linear-gradient(180deg, var(--lp-know-silver-fill-top), var(--lp-know-silver-fill-bottom));
        border-color: var(--lp-know-silver-border) !important;
        box-shadow:
          0 0 0 1px rgba(206, 216, 232, .54),
          0 0 0 3px rgba(206, 216, 232, .18),
          0 0 18px var(--lp-know-silver-glow-soft),
          0 0 40px rgba(220, 229, 242, .18),
          0 0 82px rgba(220, 229, 242, .12),
          0 12px 26px rgba(0,0,0,.22) !important;
        animation: lp-know-glow 2.2s ease-in-out infinite alternate;
      }
      #lp-h1sg-modal .lp-node.lp-node-mastered .lp-node-prefix,
      #lp-h1sg-modal .lp-node[data-lp-visual="mastered"] .lp-node-prefix{
        color: var(--lp-master-gold-border) !important;
        filter: drop-shadow(0 0 4px rgba(246, 207, 90, .34)) drop-shadow(0 0 10px rgba(246, 207, 90, .22));
      }
      #lp-h1sg-modal .lp-node[data-lp-visual="know"] .lp-node-prefix{
        color: var(--lp-know-silver-border) !important;
        filter: drop-shadow(0 0 3px rgba(220, 229, 242, .24)) drop-shadow(0 0 8px rgba(220, 229, 242, .16));
      }
      #lp-h1sg-modal .lp-node.lp-node-mastered .lp-node-title,
      #lp-h1sg-modal .lp-node.lp-node-mastered .lp-node-title *,
      #lp-h1sg-modal .lp-node[data-lp-visual="mastered"] .lp-node-title,
      #lp-h1sg-modal .lp-node[data-lp-visual="mastered"] .lp-node-title *{
        color: var(--lp-master-gold-border) !important;
      }
      #lp-h1sg-modal .lp-node[data-lp-visual="know"] .lp-node-title,
      #lp-h1sg-modal .lp-node[data-lp-visual="know"] .lp-node-title *{
        color: var(--lp-know-silver-border) !important;
      }

      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node::after,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node::after{
        background: rgba(255,255,255,.96);
        border-color: rgba(15,23,42,.12);
        box-shadow: 0 10px 22px rgba(15,23,42,.12);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node .lp-node-title,
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node .lp-node-title *,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node .lp-node-title,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node .lp-node-title *{
        color: rgba(15,23,42,.92);
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node .lp-node-prefix,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node .lp-node-prefix{
        color: rgba(15,23,42,.74);
        filter:none;
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-full,
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-close,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-full,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-close{
        background: rgba(255,255,255,.94) !important;
        border: 1px solid rgba(0,0,0,.18) !important;
        color: rgba(0,0,0,.86) !important;
        box-shadow: 0 10px 22px rgba(0,0,0,.16) !important;
        opacity: .92;
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-full:hover,
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-close:hover,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-full:hover,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-close:hover{
        opacity: 1;
      }
      #lp-h1sg-modal .lp-node.is-cur::after{
        background: linear-gradient(180deg, rgba(48, 93, 182, .92), rgba(24, 56, 120, .90)) !important;
        border-color: rgba(121, 179, 255, .98) !important;
        box-shadow:
          0 0 0 1px rgba(121, 179, 255, .52),
          0 0 0 6px rgba(96, 165, 250, .20),
          0 0 28px rgba(96, 165, 250, .26),
          0 0 70px rgba(59, 130, 246, .18),
          0 18px 34px rgba(0,0,0,.28) !important;
        animation: none !important;
      }
      #lp-h1sg-modal .lp-node.is-cur .lp-node-title,
      #lp-h1sg-modal .lp-node.is-cur .lp-node-title *{
        color: rgba(255,255,255,.98) !important;
      }
      #lp-h1sg-modal .lp-node.is-cur .lp-node-prefix{
        color: rgba(191, 219, 254, .96) !important;
        filter: drop-shadow(0 0 4px rgba(96, 165, 250, .28)) drop-shadow(0 0 10px rgba(59, 130, 246, .18));
      }
      #lp-h1sg-modal .lp-node.is-cur[data-lp-visual="mastered"] .lp-node-title,
      #lp-h1sg-modal .lp-node.is-cur[data-lp-visual="mastered"] .lp-node-title *,
      #lp-h1sg-modal .lp-node.is-cur.lp-node-mastered .lp-node-title,
      #lp-h1sg-modal .lp-node.is-cur.lp-node-mastered .lp-node-title *{
        color: var(--lp-master-gold-border) !important;
      }
      #lp-h1sg-modal .lp-node.is-cur[data-lp-visual="know"] .lp-node-title,
      #lp-h1sg-modal .lp-node.is-cur[data-lp-visual="know"] .lp-node-title *{
        color: var(--lp-know-silver-border) !important;
      }
      #lp-h1sg-modal .lp-node.is-cur[data-lp-visual="mastered"] .lp-node-prefix,
      #lp-h1sg-modal .lp-node.is-cur.lp-node-mastered .lp-node-prefix{
        color: var(--lp-master-gold-border) !important;
        filter: drop-shadow(0 0 4px rgba(246, 207, 90, .34)) drop-shadow(0 0 10px rgba(246, 207, 90, .22));
      }
      #lp-h1sg-modal .lp-node.is-cur[data-lp-visual="know"] .lp-node-prefix{
        color: var(--lp-know-silver-border) !important;
        filter: drop-shadow(0 0 3px rgba(220, 229, 242, .24)) drop-shadow(0 0 8px rgba(220, 229, 242, .16));
      }

      #lp-h1sg-modal.lp-h1sg-is-launching .lp-mapviewport{
        opacity:.08;
        filter: blur(12px) saturate(.78);
        transition: opacity .24s ease, filter .24s ease;
      }
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-h1sg-topbar,
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-mzoom,
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-close,
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-full{
        opacity:0;
        transform: translateY(10px);
        pointer-events:none;
        transition: opacity .22s ease, transform .22s ease;
      }
      #lp-h1sg-modal .lp-h1sg-launch-overlay{
        position:absolute;
        inset:0;
        overflow:hidden;
        pointer-events:none;
        z-index:52;
        isolation:isolate;
      }
      #lp-h1sg-modal .lp-h1sg-launch-svg{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        overflow:visible;
      }
      #lp-h1sg-modal .lp-h1sg-launch-path{
        fill:none;
        stroke-linecap:round;
        stroke-linejoin:round;
        vector-effect:non-scaling-stroke;
      }
      #lp-h1sg-modal .lp-h1sg-launch-path-glow{
        stroke:rgba(255,255,255,.34);
        stroke-width:16;
        filter:blur(8px);
        opacity:.32;
      }
      #lp-h1sg-modal .lp-h1sg-launch-path-main{
        stroke:rgba(255,255,255,.985);
        stroke-width:3.4;
        filter: drop-shadow(0 0 10px rgba(255,255,255,.24)) drop-shadow(0 10px 20px rgba(0,0,0,.14));
      }
      #lp-h1sg-modal .lp-h1sg-launch-start-badge{
        position:absolute;
        left:0;
        top:0;
        width:50px;
        height:50px;
        border-radius:12px;
        display:flex;
        align-items:center;
        justify-content:center;
        background:transparent;
        box-shadow:none;
        filter:drop-shadow(0 8px 16px rgba(0,0,0,.22)) drop-shadow(0 0 14px rgba(37,99,235,.30));
        transform:translate(-50%, -50%);
        pointer-events:none;
        z-index:58;
        will-change:transform,left,top,opacity;
      }
      #lp-h1sg-modal .lp-h1sg-launch-start-badge .lp-h1-route-marker-svg{
        width:42px;
        height:42px;
        display:block;
        transform-origin:50% 50%;
      }
      #lp-h1sg-modal .lp-h1sg-launch-end-pin{
        position:absolute;
        left:0;
        top:0;
        width:40px;
        height:40px;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#ef4444;
        transform:translate(-50%, -50%) rotate(0deg);
        transform-origin:50% 100%;
        pointer-events:none;
        z-index:58;
        filter:drop-shadow(0 12px 20px rgba(0,0,0,.20)) drop-shadow(0 0 10px rgba(239,68,68,.18));
        will-change:transform,left,top,opacity;
      }
      #lp-h1sg-modal .lp-h1sg-launch-end-pin svg{
        width:40px;
        height:40px;
        display:block;
      }
      #lp-h1sg-modal .lp-h1sg-launch-end-pin svg path{
        stroke:currentColor;
        fill:none;
      }
      #lp-h1sg-modal .lp-h1sg-launch-end-pin svg circle{
        fill:currentColor;
        stroke:none;
      }
      #lp-h1sg-modal .lp-h1sg-launch-shadow{
        position:absolute;
        width:126px;
        height:28px;
        border-radius:999px;
        background:radial-gradient(ellipse at center, rgba(0,0,0,.34), rgba(0,0,0,0));
        transform:translate(-50%, -50%);
        pointer-events:none;
        z-index:53;
        filter: blur(7px);
      }
      #lp-h1sg-modal .lp-h1sg-launch-node{
        position:absolute;
        left:0;
        top:0;
        margin:0;
        transform:translate(-50%, -50%);
        transform-origin:50% 50%;
        will-change: transform, left, top, opacity;
        pointer-events:none;
        z-index:54;
        filter: blur(var(--lp-h1sg-launch-node-blur, 0px));
      }
      #lp-h1sg-modal .lp-h1sg-launch-node::before{
        opacity:.16;
      }
      #lp-h1sg-modal .lp-h1sg-launch{
        display:none !important;

        position:absolute;
        transform:translate(-50%, -50%);
        border:none;
        border-radius:999px;
        padding:.62rem 1rem;
        background:linear-gradient(180deg, rgba(99, 102, 241, .92), rgba(79, 70, 229, .92));
        color:#fff;
        font:inherit;
        font-weight:800;
        letter-spacing:.01em;
        box-shadow:
          0 0 0 1px rgba(129,140,248,.28),
          0 0 0 6px rgba(129,140,248,.14),
          0 18px 32px rgba(0,0,0,.28);
        cursor:pointer;
        z-index:30;
        white-space:nowrap;
      }
      #lp-h1sg-modal .lp-h1sg-launch:hover{
        filter: brightness(1.05);
      }

      @keyframes lp-know-glow{
        0%{
          box-shadow:
            0 0 0 1px rgba(206, 216, 232, .42),
            0 0 0 2px rgba(206, 216, 232, .12),
            0 0 14px var(--lp-know-silver-glow-soft),
            0 0 26px rgba(220, 229, 242, .12),
            0 12px 26px rgba(0,0,0,.18);
        }
        100%{
          box-shadow:
            0 0 0 1px rgba(220, 229, 242, .68),
            0 0 0 4px rgba(220, 229, 242, .18),
            0 0 28px var(--lp-know-silver-glow-strong),
            0 0 58px rgba(220, 229, 242, .24),
            0 0 104px rgba(220, 229, 242, .16),
            0 12px 28px rgba(0,0,0,.20);
        }
      }
      @media (max-width: 720px){
        #lp-h1sg-modal .lp-h1sg-topbar{
          left:14px;
          right:14px;
          top:calc(env(safe-area-inset-top, 0px) + 10px);
          gap:8px;
        }
        #lp-h1sg-modal .lp-h1sg-tabs{ max-width:calc(100vw - 28px); }
        #lp-h1sg-modal .lp-h1sg-tab{ font-size:.72rem; padding:8px 11px; min-height:38px; }
        #lp-h1sg-modal .lp-h1sg-helper{ font-size:.76rem; line-height:1.18; padding:10px 14px; }
        #lp-h1sg-modal .lp-h1sg-filter{ width:min(100%, 420px); height:42px; }
      }

      @keyframes lp-master-glow{
        0%{
          box-shadow:
            0 0 0 1px rgba(234, 188, 62, .66),
            0 0 0 4px rgba(234, 188, 62, .20),
            0 0 28px var(--lp-master-gold-glow-soft),
            0 0 52px rgba(246, 207, 90, .24),
            0 0 96px rgba(246, 207, 90, .16),
            0 18px 34px rgba(0,0,0,.26);
        }
        100%{
          box-shadow:
            0 0 0 1px rgba(246, 207, 90, .94),
            0 0 0 6px rgba(246, 207, 90, .32),
            0 0 44px var(--lp-master-gold-glow-strong),
            0 0 86px rgba(246, 207, 90, .46),
            0 0 150px rgba(246, 207, 90, .24),
            0 18px 36px rgba(0,0,0,.30);
        }
      }

      @media (min-width: 901px){
        #lp-map-modal [data-lp-fullscreen],
        #lp-h1sg-modal [data-lp-h1sg-fullscreen]{ display:none !important; }
      }

      @media (max-width: 900px){
        #lp-h1sg-modal,
        #lp-h1sg-modal.lp-full{
          background: rgba(0,0,0,.62);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding-top: constant(safe-area-inset-top);
          padding-right: constant(safe-area-inset-right);
          padding-bottom: constant(safe-area-inset-bottom);
          padding-left: constant(safe-area-inset-left);
          padding-top: env(safe-area-inset-top, 0px);
          padding-right: env(safe-area-inset-right, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
          padding-left: env(safe-area-inset-left, 0px);
          box-sizing: border-box;
        }
        #lp-h1sg-modal .lp-mbox{ width:100% !important; height:100% !important; border-radius:0; border:none !important; box-shadow:none !important; }
        #lp-h1sg-modal [data-lp-h1sg-fullscreen]{ display:none !important; }
        #lp-h1sg-modal .lp-h1sg-topbar{
          left:12px; right:12px; top:calc(env(safe-area-inset-top, 0px) + 10px);
          gap:8px;
        }
        #lp-h1sg-modal .lp-h1sg-tophead{
          width:calc(100vw - 24px);
          justify-content:space-between;
        }
        #lp-h1sg-modal .lp-h1sg-tabs{ max-width:calc(100vw - 82px); }
        #lp-h1sg-modal .lp-h1sg-helper{
          font-size:.74rem;
          padding:10px 14px;
          white-space:normal;
          line-height:1.2;
          width:100%;
          max-width:none;
        }
        #lp-h1sg-modal .lp-h1sg-topbar-row{ flex:1 1 100% !important; width:100% !important; min-width:0; }
        #lp-h1sg-modal .lp-h1sg-filter{ flex:1 1 100% !important; width:100% !important; max-width:none !important; min-width:0; height:44px; }
        #lp-h1sg-modal .lp-h1sg-filter input{ width:100%; min-width:0; }
        #lp-h1sg-modal .lp-mzoom{
          bottom: calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
          width: calc(100% - 12px) !important;
          max-width: none !important;
        }
        #lp-h1sg-modal [data-lp-h1sg-zoom-dec],
        #lp-h1sg-modal [data-lp-h1sg-zoom-inc]{ display:none !important; }
        #lp-h1sg-modal [data-lp-h1sg-zoom-label]{
          display:flex !important;
          align-items:center;
          justify-content:center;
          min-width:3.8rem;
          font-weight:780;
          opacity:.85;
          letter-spacing:.2px;
        }
        #lp-h1sg-modal .lp-mzoom .lp-ctrl-group.lp-zoombar{
          width:100%;
          justify-content:center !important;
          gap:8px !important;
          padding:10px 14px !important;
        }
        #lp-h1sg-modal .lp-btn{ min-height:40px; min-width:5.6rem; }
        #lp-h1sg-modal .lp-node{ max-inline-size: calc(100vw - 32px); font-size:1.02em; }
        #lp-h1sg-modal .lp-h1sg-dir-btn{ font-size:.72rem; padding:9px 12px; }
        #lp-h1sg-modal input.lp-zoomrange{ height:34px !important; }
        #lp-h1sg-modal input.lp-zoomrange::-webkit-slider-runnable-track{ height:8px !important; }
        #lp-h1sg-modal input.lp-zoomrange::-webkit-slider-thumb{ width:24px !important; height:24px !important; margin-top:-8px !important; }
        #lp-h1sg-modal input.lp-zoomrange::-moz-range-track{ height:8px !important; }
        #lp-h1sg-modal input.lp-zoomrange::-moz-range-thumb{ width:24px !important; height:24px !important; }
      }
      #lp-h1sg-modal .lp-mzoom{
        position:absolute !important;
        left:50% !important;
        transform:translateX(-50%) !important;
        bottom:18px !important;
        width:auto !important;
        max-width:calc(100% - 32px) !important;
        z-index:6 !important;
        pointer-events:none;
      }
      @media (max-width: 900px){
        #lp-h1sg-modal .lp-mzoom{
          bottom: calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
          width: calc(100% - 12px) !important;
          max-width: none !important;
        }
        #lp-h1sg-modal .lp-mzoom .lp-ctrl-group.lp-zoombar{
          width: 100% !important;
          justify-content: center !important;
        }
      }
      #lp-h1sg-modal .lp-mzoom .lp-ctrl-group.lp-zoombar{
        pointer-events:auto;
        width:auto !important;
        justify-content:center !important;
        gap:8px !important;
        padding:8px 12px !important;
      }
      #lp-h1sg-modal [data-lp-h1sg-zoom-label]{
        min-width:3.6rem !important;
        text-align:center !important;
        opacity:.82;
        font-weight:800;
      }
      @media (min-width: 901px){
        #lp-h1sg-modal .lp-mzoom input.lp-zoomrange{
          width: clamp(160px, 14vw, 220px) !important;
          flex:0 0 auto !important;
        }
      }

      /* Route WebGL geometry fix:
         The outer .lp-node is now only a centre-positioning shell.  All visual
         scale, including perspective label scale and arrival pulse, is applied
         to the pill/background and text from the same centre.  This prevents
         the arrival pulse from shifting the node centre and keeps route edges
         clipped to the same visual boundary. */
      #lp-h1sg-modal.lp-webgl3d .lp-node{
        --lp-route-pulse-scale:1;
        --lp-route-visual-scale:calc(var(--lp-webgl-label-scale, 1) * var(--lp-webgl-hover-scale, 1) * var(--lp-route-pulse-scale, 1));
        transform:translate(-50%, -50%) scale(var(--lp-route-visual-scale)) !important;
        transform-origin:50% 50% !important;
        transition:opacity .12s ease, filter .12s ease !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node::before,
      #lp-h1sg-modal.lp-webgl3d .lp-node::after,
      #lp-h1sg-modal.lp-webgl3d .lp-node .lp-node-label{
        transform:none !important;
        transform-origin:50% 50% !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus{
        --lp-webgl-hover-scale:1 !important;
        transform:translate(-50%, -50%) scale(var(--lp-route-visual-scale)) !important;
        filter:none !important;
        z-index:999 !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus::after{
        border-color:rgba(255,255,255,.82) !important;
        box-shadow:0 10px 22px rgba(0,0,0,.16) !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus .lp-node-title,
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus .lp-node-title *,
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus .lp-node-label{
        text-shadow:none !important;
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus::after,
      body[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus::after{
        border-color:rgba(15,23,42,.16) !important;
        box-shadow:0 10px 22px rgba(15,23,42,.12) !important;
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus .lp-node-title,
      html[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus .lp-node-title *,
      html[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus .lp-node-label,
      body[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus .lp-node-title,
      body[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus .lp-node-title *,
      body[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus .lp-node-label{
        text-shadow:none !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node.is-route:not(.lp-route-anim-focus),
      #lp-h1sg-modal.lp-webgl3d .lp-node.is-start:not(.lp-route-anim-focus),
      #lp-h1sg-modal.lp-webgl3d .lp-node.is-target:not(.lp-route-anim-focus){
        filter:brightness(1.04) saturate(1.04);
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-dim,
      #lp-h1sg-modal.lp-webgl3d .lp-node.is-filter-faded{
        filter:brightness(.55) saturate(.55) blur(.15px);
      }

      /* Route focus changes visibility and scale, not semantic text colors:
         current nodes retain white text on blue; mastery colors also survive. */
      #lp-h1sg-modal .lp-node.lp-route-anim-focus,
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus,
      #lp-h1sg-modal.lp-webgl3d .lp-node.is-route:not(.lp-dim):not(.is-filter-faded),
      #lp-h1sg-modal.lp-webgl3d .lp-node.is-start:not(.lp-dim):not(.is-filter-faded),
      #lp-h1sg-modal.lp-webgl3d .lp-node.is-target:not(.lp-dim):not(.is-filter-faded){
        filter:none !important;
        opacity:1 !important;
      }
      #lp-h1sg-modal .lp-node.lp-route-anim-focus .lp-node-title,
      #lp-h1sg-modal .lp-node.lp-route-anim-focus .lp-node-title *,
      #lp-h1sg-modal .lp-node.lp-route-anim-focus .lp-node-label{
        text-shadow:none !important;
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node.lp-route-anim-focus .lp-node-title,
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node.lp-route-anim-focus .lp-node-title *,
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node.lp-route-anim-focus .lp-node-label,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node.lp-route-anim-focus .lp-node-title,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node.lp-route-anim-focus .lp-node-title *,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-node.lp-route-anim-focus .lp-node-label{
        text-shadow:none !important;
      }

    `;document.head.appendChild(st);}
function lpBindH1Tools(root,graph){if(!root)return;root.querySelectorAll('[data-lp-h1-route-jump]').forEach((btn)=>{if(btn.dataset.lpBound)return;btn.dataset.lpBound='1';lpBindTap(btn,()=>{lpGpsNavigateActiveRouteTo(Number(btn.getAttribute('data-lp-h1-route-jump')||0));});});}
function mountH1RouteBar(graph){const inner=document.querySelector('article.md-content__inner');const h1=inner?inner.querySelector('h1'):null;if(!inner||!h1)return null;const existing=inner.querySelector('.lp-h1-routebar');const html=lpRenderH1RouteBar(graph,currentRelPath());if(!html){if(existing)existing.remove();return null;}
let bar=existing;if(!bar){const wrap=document.createElement('div');wrap.innerHTML=html.trim();bar=wrap.firstElementChild;h1.insertAdjacentElement('afterend',bar);}else{const wrap=document.createElement('div');wrap.innerHTML=html.trim();const next=wrap.firstElementChild;existing.replaceWith(next);bar=next;}
lpPlaceH1RouteBar(inner,h1,bar);lpBindH1Tools(bar,graph);try{bar.__lpTypesetPromise=lpTypesetPendingH1RouteMath(graph,bar).catch(()=>{});}catch(_){try{bar.__lpTypesetPromise=Promise.resolve();}catch(_){}}
return bar;}
function mountH1Tools(graph){const inner=document.querySelector("article.md-content__inner");const h1=inner?inner.querySelector("h1"):null;if(!inner||!h1)return null;lpBindH1Tools(h1,graph);return h1;}
function mountTopWhyLine(){const inner=document.querySelector("article.md-content__inner");if(!inner)return null;const existing=inner.querySelector('.lp-top-why');if(existing)existing.remove();return null;}
function __lpIsMobileUi(){try{return!!(window.matchMedia&&(window.matchMedia("(pointer: coarse)").matches||window.matchMedia("(max-width: 768px)").matches));}catch(_){return false;}}
function __lpReleaseStaleSearchUiIfSafe(){try{if(!__lpIsMobileUi())return;if(!isConceptPage(currentRelPath()))return;const html=document.documentElement;const body=document.body;const searchActive=(html&&html.classList&&html.classList.contains("md-search--active"))||(body&&body.classList&&body.classList.contains("md-search--active"))||(document.querySelector('input.md-toggle[data-md-toggle="search"]')?.checked===true);if(searchActive)return;document.querySelectorAll("[data-md-scrollfix]").forEach((el)=>{try{el.removeAttribute("data-md-scrollfix");}catch(_){}});try{html&&html.classList&&html.classList.remove("md-search--active");}catch(_){}
try{body&&body.classList&&body.classList.remove("md-search--active");}catch(_){}
const clearLock=(el)=>{if(!el||!el.style)return;el.style.overflow="";el.style.position="";el.style.top="";el.style.left="";el.style.right="";el.style.height="";el.style.width="";el.style.touchAction="";};clearLock(html);clearLock(body);const ov=document.querySelector(".md-search__overlay");if(ov&&ov.style){ov.style.display="";ov.style.pointerEvents="";}
const shell=document.querySelector(".md-search");if(shell&&shell.style)shell.style.pointerEvents="";}catch(_){}}
const __LP_COURSE_LINE_ID="lp-course-lecture-line";const __LP_COURSE_LINKS_ATTR="data-lp-course-lecture-linked";function __lpPruneCourseLectureLines(){try{document.querySelectorAll(".lp-course-lecture").forEach((el)=>{try{el.remove();}catch(_){}});}catch(_){}}
function __lpClearCourseLectureMarker(inner){try{if(!inner)return;inner.removeAttribute(__LP_COURSE_LINKS_ATTR);}catch(_){}}
function __lpSetCourseLectureMarker(inner,courseToken,lectureToken){try{if(!inner)return;const course=String(courseToken||"").trim().toLowerCase();const lecture=String(lectureToken||"").trim().toLowerCase();if(!course||!lecture){__lpClearCourseLectureMarker(inner);return;}
inner.setAttribute(__LP_COURSE_LINKS_ATTR,`${course}||${lecture}`);}catch(_){}}
function __lpGetCourseLectureMarker(inner){try{return inner?String(inner.getAttribute(__LP_COURSE_LINKS_ATTR)||""):"";}catch(_){return"";}}
function __lpFindLiveSectionNodes(headingRegex){try{const inner=document.querySelector("article.md-content__inner");if(!inner)return null;const heads=Array.from(inner.querySelectorAll("h2, h3"));const h=heads.find((x)=>headingRegex.test(normHeadingText(x.textContent||"")));if(!h)return null;const nodes=[];let n=h.nextElementSibling;while(n){const tag=(n.tagName||"").toLowerCase();if(tag==="h2"||tag==="h3")break;if(n.matches&&n.matches('.md-source-file, .md-source-file__fact, .md-content__button, .md-content__button + *, .md-content__inner > footer'))break;nodes.push(n);n=n.nextElementSibling;}
return{inner,heading:h,nodes};}catch(_){return null;}}
function __lpUnwrapSourceCourseLectureLinks(root){try{const scope=root&&root.querySelectorAll?root:document;scope.querySelectorAll('a[data-lp-course-link-origin="sources"]').forEach((a)=>{const parent=a.parentNode;if(!parent)return;while(a.firstChild)parent.insertBefore(a.firstChild,a);a.remove();});}catch(_){}}
function __lpBuildSourceFindLink(token,kind,text){const a=document.createElement('a');a.textContent=String(text||'');try{a.setAttribute('data-lp-find-kind',String(kind||''));}catch(_){}
try{a.setAttribute('data-lp-course-link-origin','sources');}catch(_){}
__lpBindFindLink(a,token);return a;}
function __lpWrapElementContentsWithSourceLink(el,token,kind,targetText){try{if(!el||!el.parentNode)return null;if(el.closest&&el.closest('a[href]'))return null;if(el.querySelector&&el.querySelector('a[href], button, input, select, textarea'))return null;const text=cleanTitle(el.textContent||'');const want=cleanTitle(targetText||'');if(!text||!want||text!==want)return null;const a=__lpBuildSourceFindLink(token,kind,el.textContent||targetText||'');while(el.firstChild)a.appendChild(el.firstChild);el.appendChild(a);return a;}catch(_){return null;}}
function __lpFindExactElementInSection(sectionNodes,targetText){const want=cleanTitle(targetText||'');if(!want)return null;const pool=[];for(const node of(sectionNodes||[])){if(!node||node.nodeType!==1)continue;pool.push(node);try{pool.push(...Array.from(node.querySelectorAll('*')).reverse());}catch(_){}}
for(const el of pool){try{if(!el||!el.parentNode)continue;if(el.closest&&el.closest('a[href]'))continue;if(el.querySelector&&el.querySelector('a[href], button, input, select, textarea'))continue;const tag=String(el.tagName||'').toLowerCase();if(!/^(li|p|span|div|td|th|dd|dt|code|strong|em|small|b|i)$/.test(tag))continue;const text=cleanTitle(el.textContent||'');if(text===want)return el;}catch(_){}}
return null;}
function __lpWrapTextNodeMatch(textNode,targetText,token,kind){try{if(!textNode||textNode.nodeType!==3)return null;const raw=String(textNode.nodeValue||'');if(!raw)return null;const want=String(targetText||'');if(!want)return null;const lowerRaw=raw.toLowerCase();const lowerWant=want.toLowerCase();const idx=lowerRaw.indexOf(lowerWant);if(idx<0)return null;const matchText=raw.slice(idx,idx+want.length);const parent=textNode.parentNode;if(!parent)return null;const before=idx>0?textNode.splitText(idx):textNode;const after=before.splitText(want.length);const a=__lpBuildSourceFindLink(token,kind,matchText);a.textContent=matchText;parent.replaceChild(a,before);return a||after;}catch(_){return null;}}
function __lpLinkifyTextInSection(sectionNodes,targetText,token,kind){const exactEl=__lpFindExactElementInSection(sectionNodes,targetText);if(exactEl)return __lpWrapElementContentsWithSourceLink(exactEl,token,kind,targetText);for(const root of(sectionNodes||[])){if(!root||!root.ownerDocument)continue;try{const walker=root.ownerDocument.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){try{const parent=node&&node.parentElement;if(!parent)return NodeFilter.FILTER_REJECT;if(parent.closest&&parent.closest('a[href], script, style, textarea, button, input, select'))return NodeFilter.FILTER_REJECT;const value=String(node.nodeValue||'');if(!value||!value.trim())return NodeFilter.FILTER_REJECT;return value.toLowerCase().includes(String(targetText||'').toLowerCase())?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;}catch(_){return NodeFilter.FILTER_SKIP;}}});let node;while((node=walker.nextNode())){const linked=__lpWrapTextNodeMatch(node,targetText,token,kind);if(linked)return linked;}}catch(_){}}
return null;}
const __LP_FIND_KEY_V2="find_pending_token_v2";const __LP_FIND_KEY_V1="find_pending_token_v1";const __LP_FIND_RUN_LOCK="__find_autoflow_ran_v2__";const __LP_FIND_SCROLL_KEY="lp_find_scroll_to_results_v1";let __lpSearchIndexPromise=null;function __lpCanonPath(p){const s=String(p||"").split("#")[0].replace(/^\/+/g,"");const s2=s.replace(/index\.html?$/i,"").replace(/\/+$|\s+$/g,"");return s2;}
function __lpAsStringList(x){if(!x)return[];if(Array.isArray(x))return x.map(String).filter(Boolean);if(typeof x==="string")return[x];return[];}
function __lpGetTagsFromDoc(d){const out=[];out.push(...__lpAsStringList(d&&d.tags));out.push(...__lpAsStringList(d&&d.tag));out.push(...__lpAsStringList(d&&d.meta&&d.meta.tags));out.push(...__lpAsStringList(d&&d.meta&&d.meta.tag));out.push(...__lpAsStringList(d&&d.meta&&d.meta["tags"]));return out.map((s)=>String(s).trim()).filter(Boolean);}
function __lpCourseLabelFromRelPath(path){const p=String(path||"").replace(/^\/+/,"");const segs=p.split("/").filter(Boolean);if(segs.length<2)return"";let courseSeg=segs[1]||"";courseSeg=courseSeg.replace(/^\d+[a-z]-/i,"");courseSeg=courseSeg.replace(/-/g," ").trim();const parts=courseSeg.split(/\s+/).filter(Boolean);if(parts.length>=3&&/^Math$/i.test(parts[0])&&/^[IVX]+$/i.test(parts[1])){return`${parts[0]} ${parts[1]}: ${parts.slice(2).join(" ")}`;}
return courseSeg;}
function __lpRomanToInt(raw){const s=String(raw||"").toUpperCase().trim();if(!s)return 0;const vals={I:1,V:5,X:10,L:50};let total=0;let prev=0;for(let i=s.length-1;i>=0;i-=1){const v=vals[s[i]]||0;if(!v)return 0;if(v<prev)total-=v;else{total+=v;prev=v;}}
return total;}
function __lpCourseTokenFromRelPath(path){try{const p=String(path||"").replace(/^\/+/,"");const segs=p.split("/").filter(Boolean);if(segs.length<2)return"";let courseSeg=String(segs[1]||"").replace(/^\d+[a-z]-/i,"");if(/^OR-Modell?ing$/i.test(courseSeg))return"orm";const words=courseSeg.split(/[-_\s]+/).map((x)=>String(x||"").trim()).filter(Boolean);if(!words.length)return"";if(/^math$/i.test(words[0]||"")&&words[1]&&/^[IVXL]+$/i.test(words[1])){const n=__lpRomanToInt(words[1]);const rest=words.slice(2).filter((w)=>!/^(for|and|of|the|to|in|eor)$/i.test(w));const suffix=rest.map((w)=>w.charAt(0).toLowerCase()).join("");return n&&suffix?`m${n}${suffix}`:"";}
const meaningful=words.filter((w)=>!/^(for|and|of|the|to|in|eor)$/i.test(w));return meaningful.map((w)=>w.charAt(0).toLowerCase()).join("").slice(0,12);}catch(_){return"";}}
function __lpLectureInfoFromSection(section){try{const nodes=section&&Array.isArray(section.nodes)?section.nodes:[];const text=nodes.map((n)=>String((n&&n.textContent)||"")).join(" ");const m=text.match(/\b(week|lecture)\s*0*(\d{1,3})\b/i);if(!m)return null;const kind=String(m[1]||"").toLowerCase()==="week"?"week":"lecture";const num=parseInt(m[2],10)||0;return num?{kind,num}:null;}catch(_){return null;}}
async function __lpLoadSearchIndexOnce(){if(__lpSearchIndexPromise)return __lpSearchIndexPromise;const request=(async()=>{const root=getSiteRootUrl();const url=new URL("search/search_index.json",root).toString();const shared=__mkFetchJsonShared(url);const j=await shared;if(!j||!Array.isArray(j.docs)){for(const name of["__mkSharedJsonPromiseMap","__mkMaterialSearchIndexPromises"]){const cache=window[name];if(cache&&cache[url]===shared)delete cache[url];}
throw new Error("Invalid search index");}
return j.docs;})();const pending=request.catch(()=>{if(__lpSearchIndexPromise===pending)__lpSearchIndexPromise=null;return[];});__lpSearchIndexPromise=pending;return pending;}
function __lpBuildSearchIndexTitleMap(docs){const map=new Map();for(const d of(docs||[])){const rawLoc=String((d&&d.location)||"");if(!rawLoc||rawLoc.includes("#"))continue;const loc=normLoc(rawLoc);const title=__lpRepairTitleMathFromLoc(loc,d&&d.title);if(!loc||!title||!isConceptPage(loc))continue;const ck=__lpCanonPath(loc);if(!ck)continue;const prev=cleanTitle(map.get(ck)||"");if(!prev||__lpScoreTitleCandidate(loc,title)>=__lpScoreTitleCandidate(loc,prev)){map.set(ck,title);}}
return map;}
function __lpBuildSearchIndexLectureMap(docs){const map=new Map();const re=/^([a-z0-9]+)[-_]?(lecture|week)0*(\d+)$/i;for(const d of(docs||[])){const rawLoc=String((d&&d.location)||"");if(!rawLoc||rawLoc.includes("#"))continue;const loc=normLoc(rawLoc);if(!loc||!isConceptPage(loc))continue;const ck=__lpCanonPath(loc);if(!ck||map.has(ck))continue;const tags=__lpGetTagsFromDoc(d);let lectureNum=0;for(const rawTag of tags){const m=String(rawTag||"").trim().toLowerCase().match(re);if(!m)continue;lectureNum=parseInt(m[3],10)||0;break;}
if(lectureNum)map.set(ck,lectureNum);}
return map;}
async function __lpPrimeLectureMapFromSearchIndex(){try{if(window.__lpSearchIndexLectureMap instanceof Map&&window.__lpSearchIndexLectureMap.size){return window.__lpSearchIndexLectureMap;}
const docs=await __lpLoadSearchIndexOnce();if(window.__lpSearchIndexLectureMap instanceof Map&&window.__lpSearchIndexLectureMap.size)return window.__lpSearchIndexLectureMap;const map=__lpBuildSearchIndexLectureMap(docs);window.__lpSearchIndexLectureMap=map;return map;}catch(_){return new Map();}}
async function __lpPrimeTitlesFromSearchIndex(graph){try{const docs=await __lpLoadSearchIndexOnce();const map=__lpBuildSearchIndexTitleMap(docs);window.__lpSearchIndexPageTitleMap=map;const batch={cache:__lpBuildTitleAliasIndex(__lpEnsureTitleCache(graph)),nodes:__lpBuildTitleAliasIndex(graph&&graph.nodes)};for(const[loc,title]of map.entries()){if(!loc||!title)continue;__lpSetTitleCache(graph,loc,title,true,batch);__lpForceGraphNodeTitle(graph,loc,title,batch.nodes);}
return map;}catch(_){return new Map();}}
function __lpGetSearchIndexPageTitleSync(loc){try{const map=window.__lpSearchIndexPageTitleMap;if(!(map instanceof Map))return"";return __lpRepairTitleMathFromLoc(loc,map.get(__lpCanonPath(loc))||"");}catch(_){return"";}}
function __lpBuildDirectFindHref(token,kind){const q=String(token||"").trim().replace(/\s+/g," ");if(!q)return"";try{const url=new URL("find.html",getSiteRootUrl());url.searchParams.set("src","lp_direct");url.searchParams.set("lp_direct","1");url.searchParams.set("q",q);url.searchParams.set("lp_token",q);const k=String(kind||"").trim().toLowerCase();if(k==="course"||k==="lecture"||k==="week")url.searchParams.set("lp_kind",k);url.hash="search-results";return url.toString();}catch(_){return"";}}
function __lpSeedPendingFindToken(token){const q=String(token||"").trim().replace(/\s+/g," ");if(!q)return false;const nonce=`${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;try{sessionStorage.removeItem(__LP_FIND_RUN_LOCK);sessionStorage.setItem(__LP_FIND_KEY_V2,JSON.stringify({q,nonce}));sessionStorage.setItem(__LP_FIND_KEY_V1,q);sessionStorage.setItem(__LP_FIND_SCROLL_KEY,JSON.stringify({q,nonce,ts:Date.now(),source:"learning-path"}));return true;}catch(_){try{sessionStorage.setItem(__LP_FIND_KEY_V1,q);}catch(__){}
try{sessionStorage.setItem(__LP_FIND_SCROLL_KEY,JSON.stringify({q,nonce,ts:Date.now(),source:"learning-path"}));}catch(__){}
return true;}}
function __lpGoFindWithToken(token,kind){const href=__lpBuildDirectFindHref(token,kind);if(!href)return;__lpSeedPendingFindToken(token);try{lpSetMobileSheetExpanded(false);}catch(_){}
try{window.location.assign(href);}catch(_){}}
function __lpBindFindLink(a,token){if(!a)return;const initialKind=(a.getAttribute("data-lp-find-kind")||"").trim().toLowerCase();const href=__lpBuildDirectFindHref(token,initialKind);if(href){try{a.setAttribute("href",href);}catch(_){}}
try{a.setAttribute("data-lp-find-token",String(token||"").trim());}catch(_){}
if(a.dataset.lpFindBound==="1")return;a.dataset.lpFindBound="1";a.addEventListener("click",(e)=>{try{if(!e)return;if(e.defaultPrevented)return;if(typeof e.button==="number"&&e.button!==0)return;if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const tk=(a.getAttribute("data-lp-find-token")||token||"").trim();if(!tk)return;if(e.cancelable)e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();const kd=(a.getAttribute("data-lp-find-kind")||initialKind||"").trim().toLowerCase();__lpGoFindWithToken(tk,kd);}catch(_){}},true);a.addEventListener("keydown",(e)=>{try{if(!e)return;if(e.defaultPrevented)return;if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;if(e.key!=="Enter"&&e.key!==" ")return;const tk=(a.getAttribute("data-lp-find-token")||token||"").trim();if(!tk)return;if(e.cancelable)e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();__lpGoFindWithToken(tk);}catch(_){}},true);}
async function mountCourseLectureLine(){const inner=document.querySelector("article.md-content__inner");if(!inner)return null;__lpPruneCourseLectureLines();__lpClearCourseLectureMarker(inner);__lpUnwrapSourceCourseLectureLinks(inner);const rel=currentRelPath();if(!isConceptPage(rel))return null;const section=__lpFindLiveSectionNodes(/^sources$/i)||__lpFindLiveSectionNodes(/^source$/i)||null;if(!section||!Array.isArray(section.nodes)||!section.nodes.length)return null;const courseLabel=__lpCourseLabelFromRelPath(rel);const courseToken=__lpCourseTokenFromRelPath(rel)||courseLabel;const courseText=courseLabel||courseToken;const lectureInfo=__lpLectureInfoFromSection(section);let lectureNum=lectureInfo?lectureInfo.num:0;let lectureKind=lectureInfo?lectureInfo.kind:"lecture";if(!lectureNum){try{const cached=window.__lpSearchIndexLectureMap;const n=cached instanceof Map?Number(cached.get(__lpCanonPath(rel))||0):0;if(n>0)lectureNum=n;}catch(_){}}
if(!courseToken||!lectureNum)return null;const pad=String(lectureNum||0).padStart(2,"0");const lectureToken=`${courseToken}-${lectureKind}${pad}`;const lectureText=`${lectureKind === "week" ? "Week" : "Lecture"} ${lectureNum}`;const courseLink=__lpLinkifyTextInSection(section.nodes,courseText,courseToken,'course');const lectureLink=__lpLinkifyTextInSection(section.nodes,lectureText,lectureToken,lectureKind);if(courseLink&&lectureLink){__lpSetCourseLectureMarker(inner,courseToken,lectureToken);}
return lectureLink||courseLink||null;}
function __lpMarkObservedContentRefs(){try{window.__lpObservedArticleInner=document.querySelector("article.md-content__inner")||null;window.__lpObservedMainContainer=document.querySelector("main.md-main")||null;}catch(_){window.__lpObservedArticleInner=null;window.__lpObservedMainContainer=null;}}
function __lpScheduleDeepPrime(graph,rel){try{const relKey=normLoc(rel);if(!relKey)return;const ticket=(window.__lpDeepPrimeTicket||0)+1;window.__lpDeepPrimeTicket=ticket;__mkRunIdle(async()=>{try{if(ticket!==window.__lpDeepPrimeTicket)return;if(normLoc(currentRelPath())!==relKey)return;await __lpPrimeSidebarRelated(graph,relKey,{deep:true});}catch(_){}},4500);}catch(_){}}
function lpRefreshOpenMapsForMastery(graphRef){try{window.__lpDependentPickCache=new Map();if(window.__lpDependentPickCacheState)window.__lpDependentPickCacheState.current="";}catch(_){}
try{const g=graphRef||window.__lpLearningPathGraph;const modal=document.getElementById("lp-map-modal");if(modal)modal.__lpRenderedMasterySignature="";if(g&&modal&&modal.classList&&modal.classList.contains("lp-open")){if(!window.__lpMasteryMapRefreshRaf){window.__lpMasteryMapRefreshRaf=requestAnimationFrame(()=>{window.__lpMasteryMapRefreshRaf=0;lpRunWhenMapGestureIdle("mastery",()=>{try{renderLocalMapModal(g);}catch(_){}});});}}}catch(_){}
try{const g=graphRef||window.__lpLearningPathGraph;const modal=document.getElementById("lp-h1sg-modal");const state=modal&&modal.__lpH1StudyState;if(g&&modal&&modal.classList&&modal.classList.contains("lp-open")&&state){if(!window.__lpMasteryRouteMapRefreshRaf){window.__lpMasteryRouteMapRefreshRaf=requestAnimationFrame(()=>{window.__lpMasteryRouteMapRefreshRaf=0;try{lpH1StudyStartRerenderPreservingView(modal,g,state.target||currentRelPath(),state.mode||modal.dataset.lpMode||LP_ROUTE_MAP_MODE.TO_HERE);}catch(_){}});}}}catch(_){}}
function removeMasteryWatcher(){const prev=window.__lpMasteryWatcher;if(!prev)return;try{if(prev&&typeof prev.cancel==="function"){prev.cancel();return;}
if(typeof prev==="number")clearInterval(prev);else if(prev.intervalId)clearInterval(prev.intervalId);}catch(_){}
try{if(prev.storageHandler)window.removeEventListener("storage",prev.storageHandler);}catch(_){}
try{if(prev.masteryHandler)window.removeEventListener("conceptMasteryChanged",prev.masteryHandler);}catch(_){}
window.__lpMasteryWatcher=null;}
function installMasteryWatcher(onChange){removeMasteryWatcher();let last=lpCurrentMasterySignature();let raf=0;const schedule=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;try{onChange&&onChange();}catch(_){}});};const markChanged=()=>{last=lpCurrentMasterySignature();schedule();};const intervalId=setInterval(()=>{if(document.hidden)return;const now=lpCurrentMasterySignature();if(now!==last){last=now;schedule();}},6000);const storageHandler=(e)=>{if(!e)return;if(e.key===MASTERY_KEY||e.key===null)markChanged();};const masteryHandler=(ev)=>{try{const d=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:{};const kind=String(d.kind||d.type||d.event||d.action||"").toLowerCase().trim();const changeKind=String(d.changeKind||d.change_kind||"").toLowerCase().trim();const hasRatingSignal=!!(d.ratingChanged||d.hasRating||d.hadRating||d.level!=null||d.mastery!=null||["create","change","clear"].includes(changeKind));if(!hasRatingSignal&&(kind==="view"||kind==="visit"||kind==="seen"))return;}catch(_){}
markChanged();};window.addEventListener("storage",storageHandler);window.addEventListener("conceptMasteryChanged",masteryHandler);const cancel=()=>{try{clearInterval(intervalId);}catch(_){}
try{if(raf)cancelAnimationFrame(raf);}catch(_){}
raf=0;try{window.removeEventListener("storage",storageHandler);}catch(_){}
try{window.removeEventListener("conceptMasteryChanged",masteryHandler);}catch(_){}
try{if(window.__lpMasteryWatcher&&window.__lpMasteryWatcher.cancel===cancel)window.__lpMasteryWatcher=null;}catch(_){}};window.__lpMasteryWatcher={intervalId,storageHandler,masteryHandler,cancel};}
async function main(){injectStylesOnce();ensureGpsStylesOnce();lpEnsureAuxMapPatchStyles();setupInternalNavCapture();const rel=currentRelPath();if(!isConceptPage(rel)){removeMasteryWatcher();window.__lpLastRenderedRel="";syncSecondaryTocVisibility(true);restoreLpHiddenBodySections();try{document.querySelectorAll(".lp-course-lecture").forEach((x)=>x.remove());}catch(_){}
try{const inner=document.querySelector("article.md-content__inner");__lpClearCourseLectureMarker(inner);__lpUnwrapSourceCourseLectureLinks(inner);}catch(_){}
try{document.querySelectorAll(".lp-top-why").forEach((x)=>x.remove());}catch(_){}
unmountMobileSheet();return;}
__lpReleaseStaleSearchUiIfSafe();syncSecondaryTocVisibility(false);lpGpsValidateRouteEntryForPage(rel);try{mountPanelShell(rel);}catch(_){}
const existingPanel=document.getElementById("lp-side-panel");const existingInner=document.querySelector("article.md-content__inner");const existingCourseLinks=__lpGetCourseLectureMarker(existingInner);if(window.__lpLastRenderedRel===rel&&existingPanel&&(existingCourseLinks||window.__lpCourseLineMountRel===rel)){hideRedundantBodySections();__lpMarkObservedContentRefs();return;}
let graph;try{graph=await loadGraph();window.__lpLearningPathGraph=graph;if(!window.__lpMapMotionFogRefreshInstalled){window.__lpMapMotionFogRefreshInstalled=true;const rerenderOpenLocalMap=()=>{const g=window.__lpLearningPathGraph;const modal=document.getElementById('lp-map-modal');if(!g||!modal||!modal.classList.contains('lp-open'))return;lpRunWhenMapGestureIdle('motion-fog',()=>{requestAnimationFrame(()=>{try{renderLocalMapModal(g);}catch(_){}});});};const rerenderOpenRouteMap=()=>{const g=window.__lpLearningPathGraph;const modal=document.getElementById('lp-h1sg-modal');const state=modal&&modal.__lpH1StudyState;if(!g||!modal||!modal.classList.contains('lp-open')||!state)return;requestAnimationFrame(()=>{try{lpH1StudyStartRerenderPreservingView(modal,g,state.target||currentRelPath(),state.mode||modal.dataset.lpMode||LP_ROUTE_MAP_MODE.TO_HERE);}catch(_){}});};window.addEventListener('mk:site-motion-change',rerenderOpenLocalMap);window.addEventListener('mk:motionchange',rerenderOpenLocalMap);window.addEventListener('lp:fog-change',rerenderOpenLocalMap);window.addEventListener('mk:site-motion-change',rerenderOpenRouteMap);window.addEventListener('mk:motionchange',rerenderOpenRouteMap);window.addEventListener('lp:fog-change',rerenderOpenRouteMap);}
if(!window.__lpSharedRevealSyncInstalled){window.__lpSharedRevealSyncInstalled=true;const rerenderOpenLocalMapForReveal=(revealedKey)=>{const g=window.__lpLearningPathGraph;const modal=document.getElementById('lp-map-modal');if(!g||!modal||!modal.classList.contains('lp-open'))return;let restoreLoc='';let restoreDesktopPreview=false;try{const st=window.__lpMapState;restoreLoc=String((st&&(st.__lpHoverLoc||st.__lpFocusedLoc))||'');restoreDesktopPreview=!!(restoreLoc&&modal.classList&&modal.classList.contains('lp-desktop-focus-preview'));}catch(_){}
try{const activeKey=lpCanonKey(restoreLoc);const changedKey=lpCanonKey(revealedKey||'');if(activeKey&&changedKey&&activeKey===changedKey)return;}catch(_){}
const runRerender=()=>{requestAnimationFrame(()=>{try{renderLocalMapModal(g);}catch(_){}
if(!restoreLoc)return;requestAnimationFrame(()=>{try{const freshModal=document.getElementById('lp-map-modal');const st=window.__lpMapState;if(!freshModal||!freshModal.classList.contains('lp-open'))return;if(!st||typeof st.__lpApplyFocus!=='function')return;if(restoreDesktopPreview&&freshModal.classList){freshModal.classList.add('lp-desktop-focus-preview');}
st.__lpApplyFocus(restoreLoc);}catch(_){}});});};lpRunWhenMapGestureIdle('reveal',runRerender);};const syncOpenRouteMapForReveal=(key)=>{const modal=document.getElementById('lp-h1sg-modal');if(!modal||!modal.classList.contains('lp-open'))return;const state=modal.__lpH1StudyState;if(!state)return;try{lpH1StudyRouteRevealSetForState(state).add(key);}catch(_){}
const nodes=Array.from(modal.querySelectorAll('.lp-node[data-lp-loc]'));for(const el of nodes){try{const locKey=lpCanonKey((el.getAttribute&&el.getAttribute('data-lp-loc'))||'');if(!locKey||locKey!==key)continue;try{delete el.dataset.lpRouteMaskPreview;}catch(_){}
lpH1StudyRouteApplyNodeMask(el,state);}catch(_){}}};window.addEventListener('lp:shared-reveal-change',(e)=>{const key=lpCanonKey(e&&e.detail&&e.detail.key||'');if(!key)return;syncOpenRouteMapForReveal(key);rerenderOpenLocalMapForReveal(key);});}}catch(e){console.error(e);return;}
try{__mkRunIdle(()=>{try{__lpPrimeTitlesFromSearchIndex(graph).catch(()=>new Map());}catch(_){}
try{__lpPrimeLectureMapFromSearchIndex().catch(()=>new Map());}catch(_){}},1400);}catch(_){}
if(!window.__lpRelatedPanelRefreshInstalled){window.__lpRelatedPanelRefreshInstalled=true;window.addEventListener("lp:related-cache-updated",(e)=>{try{const g=window.__lpLearningPathGraph;const loc=(e&&e.detail&&e.detail.loc)||"";const modal=document.getElementById("lp-map-modal");if(g&&loc&&modal)lpScheduleLocalMapDataRefresh(g,loc);}catch(_){}});}
mountTopWhyLine();const h1Tools=mountH1Tools(graph);const h1RouteBar=mountH1RouteBar(graph);const panel=mountPanel(graph);lpMarkPanelReady(panel,rel);await typesetMathSafe([panel,h1Tools]);if(h1RouteBar&&h1RouteBar.__lpTypesetPromise&&typeof h1RouteBar.__lpTypesetPromise.then==="function"){await h1RouteBar.__lpTypesetPromise;}else{await typesetMathSafe([h1RouteBar]);}
await lpTypesetTitleElements(graph,panel);await lpTypesetTitleElements(graph,h1Tools);await lpTypesetTitleElements(graph,h1RouteBar);window.__lpCourseLineMountRel=rel;let courseLine=null;try{courseLine=await mountCourseLectureLine().catch(()=>null);if(normLoc(currentRelPath())===normLoc(rel)){await typesetMathSafe([courseLine]);if(courseLine)courseLine.classList.remove("lp-pending");}}catch(_){courseLine=null;}finally{if(window.__lpCourseLineMountRel===rel)window.__lpCourseLineMountRel="";}
window.__lpCourseLinePromise=Promise.resolve(courseLine);try{const relForPrime=rel;__mkRunIdle(async()=>{try{if(normLoc(currentRelPath())!==normLoc(relForPrime))return;await __lpPrimeSidebarRelated(graph,relForPrime,{deep:false});}catch(_){}},420);}catch(_){}
window.__lpLastRenderedRel=rel;__lpMarkObservedContentRefs();__lpScheduleDeepPrime(graph,rel);installMasteryWatcher(async()=>{lpRefreshOpenMapsForMastery(graph);const p2=mountPanel(graph);const t2=mountH1Tools(graph);const b2=mountH1RouteBar(graph);await typesetMathSafe([p2,t2]);if(b2&&b2.__lpTypesetPromise&&typeof b2.__lpTypesetPromise.then==="function"){await b2.__lpTypesetPromise;}else{await typesetMathSafe([b2]);}
await lpTypesetTitleElements(graph,p2);await lpTypesetTitleElements(graph,t2);await lpTypesetTitleElements(graph,b2);lpMarkPanelReady(p2,rel);__lpScheduleDeepPrime(graph,rel);});}
function lpEmitUnifiedReady(){try{window.__mkLearningPathReadyRel=String(location.pathname||"");window.dispatchEvent(new CustomEvent("mk:learning-path-ready",{detail:{pathname:location.pathname||"",relPath:currentRelPath()||""}}));if(window.__mkUnifiedFirstPaintProbe)window.__mkUnifiedFirstPaintProbe();}catch(_){}}
function __lpReleasePreloadHold(token){if(!token)return;try{window.__rkRelease&&window.__rkRelease(token);}catch(_){}}
function __lpRunMainSerial(){if(window.__lpMainRunning){window.__lpMainPending=true;return;}
window.__lpMainRunning=true;const preloadHold=(()=>{try{return window.__rkHold?window.__rkHold("learning-path"):null;}catch(_){return null;}})();let preloadHoldReleased=false;let preloadHoldTimer=0;const releasePreloadHold=()=>{if(preloadHoldReleased)return;preloadHoldReleased=true;if(preloadHoldTimer){try{window.clearTimeout(preloadHoldTimer);}catch(_){}
preloadHoldTimer=0;}
__lpReleasePreloadHold(preloadHold);};if(preloadHold){try{preloadHoldTimer=window.setTimeout(releasePreloadHold,1200);}catch(_){preloadHoldTimer=0;}}
(async()=>{try{await main();}catch(_){}finally{window.__lpMainRunning=false;if(window.__lpMainPending){window.__lpMainPending=false;scheduleMain();}else{lpEmitUnifiedReady();}
requestAnimationFrame(()=>{requestAnimationFrame(releasePreloadHold);});}})();}
function scheduleMain(){try{const rel=currentRelPath();if(isConceptPage(rel)){syncSecondaryTocVisibility(false);mountPanelShell(rel);}}catch(_){}
if(window.__lpMainScheduled)return;window.__lpMainScheduled=true;setTimeout(()=>{window.__lpMainScheduled=false;__lpRunMainSerial();},0);}
try{const rel0=currentRelPath();if(isConceptPage(rel0)){loadGraph().catch(()=>null);__mkRunIdle(()=>{try{__lpLoadSearchIndexOnce().catch(()=>[]);}catch(_){}
try{__lpPrimeLectureMapFromSearchIndex().catch(()=>new Map());}catch(_){}},900);}}catch(_){}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",scheduleMain);}else{scheduleMain();}
window.addEventListener("popstate",scheduleMain);window.addEventListener("pageshow",(e)=>{try{if(e&&e.persisted)scheduleMain();}catch(_){}});const mo=new MutationObserver(()=>{const rel=currentRelPath();if(!isConceptPage(rel)){window.__lpObservedArticleInner=null;window.__lpObservedMainContainer=null;unmountMobileSheet();return;}
const currentInner=document.querySelector("article.md-content__inner")||null;const currentMain=document.querySelector("main.md-main")||null;const relChanged=window.__lpLastRenderedRel!==rel;const innerChanged=currentInner!==(window.__lpObservedArticleInner||null);const mainChanged=currentMain!==(window.__lpObservedMainContainer||null);if(!relChanged&&!innerChanged&&!mainChanged)return;__lpReleaseStaleSearchUiIfSafe();scheduleMain();});try{const target=document.querySelector("main.md-main")||document.body;mo.observe(target,{childList:true,subtree:true});}catch(_){}
try{window.MkLearningPathUI=Object.assign(window.MkLearningPathUI||{},{isMobileMapModal:__lpIsMobileMapModal,});}catch(_){}})();(function installMapPresentation(){if(window.MkMapPresentation)return;const active=new Map();const reduce=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;function lpPresentationMotionBlocked(){if(document.hidden||(reduce&&reduce.matches))return true;if(document.documentElement.classList.contains('mk-motion-off'))return true;try{if(window.MkSiteMotion&&typeof window.MkSiteMotion.isReduced==='function'&&window.MkSiteMotion.isReduced())return true;}catch(_){}
return false;}
function lpPresentationOpen(modal){return!!(modal&&modal.isConnected&&modal.classList.contains('lp-open')&&modal.getAttribute('aria-hidden')!=='true');}
function lpPresentationStop(modal){const session=active.get(modal);if(!session)return;active.delete(modal);if(session.frame)window.cancelAnimationFrame(session.frame);if(session.timer)window.clearTimeout(session.timer);session.observers.forEach(observer=>observer.disconnect());session.listeners.forEach(([target,type,fn])=>target.removeEventListener(type,fn,true));session.animations.forEach(animation=>{try{animation.cancel();}catch(_){}});session.decorations.forEach(node=>{try{node.remove();}catch(_){}});}
function lpPresentationStopAll(){Array.from(active.keys()).forEach(lpPresentationStop);}
function lpPresentationLegend(modal){const host=modal.querySelector('.lp-map-context-copy');if(!host||host.querySelector('.lp-map-flow-key'))return;const legend=document.createElement('span');legend.className='lp-map-flow-key';legend.setAttribute('role','img');if(modal.id==='lp-map-modal'){legend.setAttribute('aria-label','Knowledge flow: prerequisites to this concept to dependents. Related concepts are undirected.');legend.innerHTML='<span class="lp-map-key-before">Prerequisites</span><span aria-hidden="true">→</span><span>Here</span><span aria-hidden="true">→</span><span class="lp-map-key-after">Dependents</span><span class="lp-map-key-related">· Related</span>';}else{legend.setAttribute('aria-label','Read a selected learning path from start to goal.');legend.innerHTML='<span class="lp-map-key-before">Start</span><span class="lp-map-key-track" aria-hidden="true"></span><span class="lp-map-key-after">Goal</span>';}
host.appendChild(legend);}
function lpPresentationAnimate(session,node,frames,options){if(!node||typeof node.animate!=='function')return;const animation=node.animate(frames,Object.assign({iterations:1,fill:'backwards'},options));session.animations.push(animation);}
function lpPresentationReadPaths(modal){const allowFlow=modal.id!=='lp-map-modal'||modal.getAttribute('data-lp-map-animations')==='on';const selector=modal.classList.contains('lp-webgl3d')?'svg.lp-webgl3d-overlay path.lp-webgl3d-edge':(modal.id==='lp-map-modal'?'svg.lp-map-svg path.lp-edge':'svg.lp-h1sg-overlay path.lp-h1sg-path');const paths=Array.from(modal.querySelectorAll(selector)).slice(0,18);const records=[];paths.forEach((path,index)=>{if(!path.parentNode)return;const style=window.getComputedStyle(path);if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)<.2)return;let length;try{length=path.getTotalLength();}catch(_){return;}
if(!(length>16)||!Number.isFinite(length))return;const original=path.ownerSVGElement;if(!original||!original.parentNode)return;records.push({path,index,length,original,stroke:style.stroke,strokeWidth:style.strokeWidth,zIndex:window.getComputedStyle(original).zIndex});});return{allowFlow,records};}
function lpPresentationFlow(session,prepared){const layers=new Map();let count=0;prepared.records.forEach(({path,index,length,original,stroke,strokeWidth,zIndex})=>{let layer=layers.get(original);if(!layer){layer=document.createElementNS('http://www.w3.org/2000/svg','svg');layer.setAttribute('class','lp-map-presentation-svg');layer.setAttribute('aria-hidden','true');['viewBox','width','height','preserveAspectRatio'].forEach(name=>{const value=original.getAttribute(name);if(value)layer.setAttribute(name,value);});layer.style.width=original.style.width||'100%';layer.style.height=original.style.height||'100%';layer.style.zIndex=zIndex;original.parentNode.insertBefore(layer,original.nextSibling||null);session.decorations.push(layer);layers.set(original,layer);}
function paintPath(className,extraWidth){const decoration=document.createElementNS('http://www.w3.org/2000/svg','path');['d','mask','clip-path','transform','vector-effect'].forEach(name=>{const value=path.getAttribute(name);if(value)decoration.setAttribute(name,value);});decoration.setAttribute('class',className);decoration.setAttribute('aria-hidden','true');decoration.setAttribute('fill','none');decoration.setAttribute('stroke',stroke||path.getAttribute('stroke')||'#fff');decoration.setAttribute('stroke-width',String(Math.min(4.2,(parseFloat(strokeWidth)||1.8)+extraWidth)));decoration.setAttribute('vector-effect','non-scaling-stroke');layer.appendChild(decoration);session.decorations.push(decoration);return decoration;}
const contour=paintPath('lp-map-reveal-stroke',.5);contour.style.strokeDasharray=`${length} ${length}`;lpPresentationAnimate(session,contour,[{strokeDashoffset:String(length),opacity:0},{strokeDashoffset:'0',opacity:.65,offset:.65},{strokeDashoffset:'0',opacity:0}],{duration:1080,delay:Math.min(180,index*14),easing:'cubic-bezier(.2,.6,.3,1)',fill:'both'});if(!prepared.allowFlow||count>=10||!path.getAttribute('marker-end'))return;const trace=paintPath('lp-map-flow-trace',1.3);const segment=Math.min(30,length*.18);trace.style.strokeDasharray=`${segment} ${length + segment}`;lpPresentationAnimate(session,trace,[{strokeDashoffset:String(segment),opacity:0},{strokeDashoffset:String(-length*.08),opacity:.95,offset:.12},{strokeDashoffset:String(-length*.88),opacity:.9,offset:.88},{strokeDashoffset:String(-length),opacity:0}],{duration:760,delay:190+count*24,easing:'linear',fill:'both'});count++;});}
function lpPresentationRun(modal,session){if(active.get(modal)!==session||!lpPresentationOpen(modal)||lpPresentationMotionBlocked()){lpPresentationStop(modal);return;}
const stage=modal.querySelector('.lp-mapstage');if(!stage)return;const focus=stage.querySelector('.lp-node.is-cur')||stage.querySelector('.lp-node.is-target');const candidates=Array.from(stage.querySelectorAll('.lp-node[data-lp-loc]')).slice(0,96);if(!candidates.length)return;if(focus&&!candidates.includes(focus))candidates.unshift(focus);const area=stage.getBoundingClientRect();const rows=candidates.map(node=>({node,rect:node.getBoundingClientRect()})).filter(({rect})=>rect.width>0&&rect.height>0&&rect.right>area.left&&rect.left<area.right&&rect.bottom>area.top&&rect.top<area.bottom);if(!rows.length)return;session.observers[0].disconnect();session.started=true;if(session.timer)window.clearTimeout(session.timer);const centre=rows.find(row=>row.node===focus)||rows[0];const cx=centre.rect.left+centre.rect.width/2-area.left;const cy=centre.rect.top+centre.rect.height/2-area.top;rows.forEach(row=>{row.distance=Math.hypot(row.rect.left+row.rect.width/2-area.left-cx,row.rect.top+row.rect.height/2-area.top-cy);});rows.sort((a,b)=>a.distance-b.distance);const haloRows=rows.slice(0,28).filter(({node})=>Number(window.getComputedStyle(node).opacity)>=.45);const pathPaint=lpPresentationReadPaths(modal);const field=document.createElement('div');field.className='lp-map-intro-field';field.setAttribute('aria-hidden','true');field.style.setProperty('--lp-intro-x',`${cx}px`);field.style.setProperty('--lp-intro-y',`${cy}px`);field.innerHTML='<span class="lp-map-intro-ring"></span><span class="lp-map-intro-ring lp-map-intro-ring-second"></span>';stage.insertBefore(field,stage.firstChild||null);session.decorations.push(field);lpPresentationAnimate(session,field,[{opacity:0},{opacity:1,offset:.18},{opacity:0}],{duration:1260,easing:'ease-out'});Array.from(field.querySelectorAll('.lp-map-intro-ring')).forEach((ring,i)=>{lpPresentationAnimate(session,ring,[{transform:'translate(-50%, -50%) scale(.18)',opacity:.8},{transform:'translate(-50%, -50%) scale(1.25)',opacity:0}],{duration:1050,delay:i*140,easing:'cubic-bezier(.16,.65,.24,1)'});});haloRows.forEach(({rect,distance})=>{const halo=document.createElement('span');halo.className='lp-map-intro-halo';halo.setAttribute('aria-hidden','true');halo.style.left=`${rect.left - area.left - 5}px`;halo.style.top=`${rect.top - area.top - 5}px`;halo.style.width=`${rect.width + 10}px`;halo.style.height=`${rect.height + 10}px`;field.appendChild(halo);session.decorations.push(halo);lpPresentationAnimate(session,halo,[{opacity:0,transform:'scale(.98)'},{opacity:.75,transform:'scale(1.02)',offset:.3},{opacity:0,transform:'scale(1.12)'}],{duration:700,delay:Math.min(280,distance*.38),easing:'cubic-bezier(.2,.65,.25,1)',fill:'both'});});lpPresentationFlow(session,pathPaint);session.timer=window.setTimeout(()=>lpPresentationStop(modal),1420);}
function lpPresentationPlay(modal){if(!modal)return false;lpPresentationStop(modal);lpPresentationLegend(modal);if(!lpPresentationOpen(modal)||lpPresentationMotionBlocked()||modal.classList.contains('lp-opera-map-perf'))return false;const effect=document.documentElement.getAttribute('data-mk-map-effect')||'';if(effect&&effect!=='local_map_3d')return false;const stage=modal.querySelector('.lp-mapstage');if(!stage||typeof stage.animate!=='function'||typeof MutationObserver!=='function')return false;const session={animations:[],decorations:[],observers:[],listeners:[],frame:0,timer:0,queued:false,started:false};active.set(modal,session);const schedule=()=>{if(session.queued||session.started||active.get(modal)!==session)return;session.queued=true;Promise.resolve().then(()=>{if(active.get(modal)!==session)return;session.frame=window.requestAnimationFrame(()=>{session.frame=0;session.queued=false;try{lpPresentationRun(modal,session);}catch(_){lpPresentationStop(modal);}});});};const ready=new MutationObserver(schedule);ready.observe(stage,{childList:true,subtree:true});const life=new MutationObserver(()=>{if(!lpPresentationOpen(modal))lpPresentationStop(modal);});life.observe(modal,{attributes:true,attributeFilter:['class','aria-hidden']});session.observers.push(ready,life);['pointerdown','touchstart','wheel','keydown'].forEach(type=>{const stop=()=>lpPresentationStop(modal);modal.addEventListener(type,stop,{capture:true,passive:true});session.listeners.push([modal,type,stop]);});session.timer=window.setTimeout(()=>lpPresentationStop(modal),3000);schedule();return true;}
document.addEventListener('mk:map-opened',event=>{const source=event&&event.detail&&event.detail.source;const id=source==='show-local-map-modal'?'lp-map-modal':(source==='show-guided-study-map'?'lp-h1sg-modal':'');if(id)Promise.resolve().then(()=>lpPresentationPlay(document.getElementById(id)));});document.addEventListener('visibilitychange',()=>{if(document.hidden)lpPresentationStopAll();});['pagehide','DOMContentSwitch','resize','orientationchange','mk-shop-trial-change','mk-shop-inventory-change'].forEach(type=>window.addEventListener(type,lpPresentationStopAll));['mk:site-motion-change','mk:motionchange'].forEach(type=>window.addEventListener(type,()=>{if(lpPresentationMotionBlocked())lpPresentationStopAll();}));if(reduce&&reduce.addEventListener)reduce.addEventListener('change',()=>{if(reduce.matches)lpPresentationStopAll();});window.MkMapPresentation=Object.freeze({play:lpPresentationPlay,stop:lpPresentationStop,activeCount:()=>active.size});})();(function(){try{if(document.getElementById('lp-concept-connections-polish-v1'))return;const st=document.createElement('style');st.id='lp-concept-connections-polish-v1';st.textContent=`
      #lp-side-panel .lp-head .lp-title{
        display:block !important;
        width:100% !important;
        min-width:0 !important;
        max-width:100% !important;
        box-sizing:border-box !important;
        font-size:clamp(.96rem, 1.05vw, 1.08rem) !important;
        line-height:1.2 !important;
        letter-spacing:-.01em !important;
        white-space:nowrap !important;
        overflow:visible !important;
      }
      @media (min-width:901px){
        #lp-side-panel .lp-head .lp-title{
          font-size:clamp(.90rem, 1vw, 1.02rem) !important;
        }
      }
      #lp-map-modal .lp-mbox > .lp-mzoom,
      #lp-h1sg-modal .lp-mbox > .lp-mzoom{
        left:50% !important;
        right:auto !important;
        bottom:18px !important;
        width:min(504px, calc(100vw - 24px)) !important;
        min-width:0 !important;
        max-width:none !important;
        height:58px !important;
        min-height:58px !important;
        box-sizing:border-box !important;
        transform:translateX(-50%) !important;
        display:flex !important;
        flex-direction:row !important;
        gap:0 !important;
        align-items:center !important;
        justify-content:center !important;
        padding:0 !important;
        border:0 !important;
        overflow:visible !important;
      }
      #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group,
      #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group{
        display:grid !important;
        grid-template-columns:40px minmax(0, 1fr) 60px 40px 72px !important;
        grid-template-rows:40px !important;
        column-gap:8px !important;
        row-gap:0 !important;
        align-items:center !important;
        width:100% !important;
        max-width:none !important;
        height:58px !important;
        min-height:58px !important;
        box-sizing:border-box !important;
        margin:0 !important;
        padding:8px 10px !important;
        border-radius:18px !important;
      }
      #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-btn,
      #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-btn{
        display:inline-flex !important;
        align-items:center !important;
        justify-content:center !important;
        width:40px !important;
        min-width:40px !important;
        max-width:40px !important;
        height:40px !important;
        min-height:40px !important;
        max-height:40px !important;
        margin:0 !important;
        padding:0 !important;
        box-sizing:border-box !important;
      }
      #lp-map-modal [data-zoom-dec],
      #lp-h1sg-modal [data-lp-h1sg-zoom-dec]{ grid-column:1 !important; }
      #lp-map-modal input.lp-zoomrange,
      #lp-h1sg-modal input.lp-zoomrange{
        grid-column:2 !important;
        min-width:0 !important;
        width:100% !important;
        margin:0 !important;
      }
      #lp-map-modal [data-zoom-label],
      #lp-h1sg-modal [data-lp-h1sg-zoom-label]{
        grid-column:3 !important;
        width:60px !important;
        min-width:60px !important;
        max-width:60px !important;
        margin:0 !important;
      }
      #lp-map-modal [data-zoom-inc],
      #lp-h1sg-modal [data-lp-h1sg-zoom-inc]{ grid-column:4 !important; }
      #lp-map-modal [data-zoom-reset],
      #lp-h1sg-modal [data-lp-h1sg-zoom-reset]{
        grid-column:5 !important;
        width:72px !important;
        min-width:72px !important;
        max-width:72px !important;
        padding:0 !important;
        justify-self:stretch !important;
      }
      #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-dec,
      #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-dec{ grid-column:1 !important; }
      #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-range,
      #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-range{
        grid-column:2 !important;
        width:100% !important;
        min-width:0 !important;
        max-width:none !important;
        justify-self:stretch !important;
      }
      #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-label,
      #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-label{
        grid-column:3 !important;
        display:flex !important;
        align-items:center !important;
        justify-content:center !important;
        align-self:center !important;
        justify-self:center !important;
        width:60px !important;
        min-width:60px !important;
        max-width:60px !important;
        height:40px !important;
        min-height:40px !important;
        max-height:40px !important;
        margin:0 !important;
        padding:0 !important;
        line-height:1 !important;
        box-sizing:border-box !important;
      }
      #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-inc,
      #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-inc{ grid-column:4 !important; }
      #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-reset,
      #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-reset{
        grid-column:5 !important;
        width:72px !important;
        min-width:72px !important;
        max-width:72px !important;
      }
      #lp-h1sg-modal .lp-h1sg-docklaunch{
        position:absolute !important;
        left:50% !important;
        bottom:86px !important;
        transform:translateX(-50%) !important;
        margin:0 !important;
        z-index:3 !important;
      }
      #lp-h1sg-modal .lp-h1sg-docklaunch:hover,
      #lp-h1sg-modal .lp-h1sg-docklaunch.is-hover{
        transform:translateX(-50%) translateY(-2px) scale(1.032) !important;
      }
      #lp-h1sg-modal .lp-h1sg-docklaunch:active,
      #lp-h1sg-modal .lp-h1sg-docklaunch.is-press{
        transform:translateX(-50%) scale(.988) !important;
      }

      #lp-h1sg-modal:not(.lp-webgl3d) .lp-node{
        --lp-route-pulse-scale:1;
        transform:translate(-50%,-50%) translateZ(var(--lp-3d-z, 0px)) scale(calc(var(--lp-route-semantic-scale, 1) * var(--lp-route-pulse-scale, 1))) !important;
        transform-origin:50% 50% !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node{
        --lp-route-visual-scale:calc(var(--lp-webgl-label-scale, 1) * var(--lp-webgl-hover-scale, 1) * var(--lp-route-pulse-scale, 1) * var(--lp-route-semantic-scale, 1)) !important;
        transform:translate(-50%, -50%) scale(var(--lp-route-visual-scale)) !important;
      }
      #lp-h1sg-modal[data-lp-semantic-zoom="1"] .lp-node{
        will-change:transform, opacity !important;
      }
      #lp-h1sg-modal .lp-node.lp-route-anim-focus{
        will-change:transform !important;
        backface-visibility:hidden !important;
        -webkit-backface-visibility:hidden !important;
      }

      #lp-h1sg-modal .lp-route-preview-traveler{
        position:absolute;
        left:0;
        top:0;
        width:34px;
        height:34px;
        opacity:0;
        visibility:hidden;
        pointer-events:none;
        z-index:64;
        transform-origin:50% 50%;
        transition:none;
        filter:drop-shadow(0 7px 12px rgba(0,0,0,.30)) drop-shadow(0 0 12px rgba(96,165,250,.56));
        will-change:transform,opacity;
      }
      #lp-h1sg-modal .lp-route-preview-traveler.is-visible{ opacity:1; }
      #lp-h1sg-modal .lp-route-preview-traveler svg{ width:100%; height:100%; display:block; overflow:visible; }
      #lp-h1sg-modal .lp-route-preview-traveler-halo{
        fill:rgba(255,255,255,.94);
        stroke:rgba(255,255,255,.98);
        stroke-width:3.6;
        stroke-linejoin:round;
      }
      #lp-h1sg-modal .lp-route-preview-traveler-core{
        fill:#3b82f6;
        stroke:#1d4ed8;
        stroke-width:1.2;
        stroke-linejoin:round;
      }

      #lp-h1sg-modal.lp-h1sg-is-launching .lp-mapviewport{
        opacity:1 !important;
        filter:none !important;
        transition:opacity .32s ease, filter .32s ease !important;
      }
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-node:not(.is-route):not(.is-start):not(.is-target):not(.is-cur){
        opacity:.10 !important;
        filter:saturate(.45) brightness(.58) !important;
        transition:opacity .42s ease, filter .42s ease !important;
      }
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-node.is-route,
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-node.is-start,
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-node.is-target,
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-node.is-cur{
        opacity:1 !important;
        filter:none !important;
      }
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-h1sg-topbar,
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-mzoom,
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-close,
      #lp-h1sg-modal.lp-h1sg-is-launching .lp-full{
        opacity:.18 !important;
        transform:none !important;
        transition:opacity .28s ease !important;
      }

      @media (max-width:900px){
        #lp-map-modal .lp-mbox > .lp-mzoom,
        #lp-h1sg-modal .lp-mbox > .lp-mzoom{
          bottom:calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
          width:calc(100vw - 12px) !important;
        }
        #lp-h1sg-modal .lp-h1sg-docklaunch{
          bottom:calc(env(safe-area-inset-bottom, 0px) + 84px) !important;
        }
        #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group,
        #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group{
          grid-template-columns:minmax(0, 1fr) 58px 72px !important;
        }
        #lp-map-modal [data-zoom-dec],
        #lp-map-modal [data-zoom-inc],
        #lp-h1sg-modal [data-lp-h1sg-zoom-dec],
        #lp-h1sg-modal [data-lp-h1sg-zoom-inc]{ display:none !important; }
        #lp-map-modal input.lp-zoomrange,
        #lp-h1sg-modal input.lp-zoomrange{ grid-column:1 !important; }
        #lp-map-modal [data-zoom-label],
        #lp-h1sg-modal [data-lp-h1sg-zoom-label]{
          grid-column:2 !important;
          width:58px !important;
          min-width:58px !important;
          max-width:58px !important;
        }
        #lp-map-modal [data-zoom-reset],
        #lp-h1sg-modal [data-lp-h1sg-zoom-reset]{ grid-column:3 !important; }
        #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-range,
        #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-range{ grid-column:1 !important; }
        #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-label,
        #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-label{
          grid-column:2 !important;
          width:58px !important;
          min-width:58px !important;
          max-width:58px !important;
        }
        #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-reset,
        #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-reset{ grid-column:3 !important; }
        #lp-map-modal .lp-map-tabs,
        #lp-h1sg-modal .lp-h1sg-tabs{
          display:grid !important;
          grid-template-columns:repeat(3, minmax(0, 1fr)) !important;
          gap:4px !important;
          width:100% !important;
          max-width:none !important;
          padding:4px !important;
          box-sizing:border-box !important;
          overflow:hidden !important;
        }
        #lp-map-modal .lp-map-tab,
        #lp-h1sg-modal .lp-h1sg-tab{
          min-width:0 !important;
          width:100% !important;
          padding:0 5px !important;
          font-size:.78rem !important;
          white-space:nowrap !important;
        }
        #lp-map-modal .lp-map-topbar,
        #lp-h1sg-modal .lp-h1sg-topbar{
          left:12px !important;
          right:auto !important;
          top:calc(env(safe-area-inset-top, 0px) + 10px) !important;
          width:calc(100vw - 72px) !important;
          min-width:0 !important;
          max-width:none !important;
          min-height:100px !important;
          box-sizing:border-box !important;
        }
        #lp-map-modal .lp-map-toprow{
          display:grid !important;
          grid-template-columns:auto minmax(0,1fr) !important;
          grid-template-areas:"tabs tabs" "tip spare" !important;
          align-items:center !important;
          gap:8px !important;
          width:100% !important;
          min-width:0 !important;
        }
        #lp-map-modal .lp-map-tabs{ grid-area:tabs !important; justify-self:start !important; }
        #lp-map-modal .lp-map-tipbtn{ grid-area:tip !important; justify-self:start !important; }
        #lp-map-modal.lp-map-tip-phone .lp-map-tipbtn-text,
        #lp-h1sg-modal.lp-map-tip-phone .lp-h1sg-tipbtn-text{ display:none !important; }
        #lp-map-modal.lp-map-tip-phone .lp-map-tipbtn,
        #lp-h1sg-modal.lp-map-tip-phone .lp-h1sg-tipbtn{
          width:40px !important;
          min-width:40px !important;
          height:40px !important;
          padding:0 !important;
          justify-content:center !important;
        }
        #lp-map-modal [data-lp-fullscreen]{ display:none !important; }
      }

      @media (prefers-reduced-motion:reduce){
        #lp-h1sg-modal .lp-route-preview-traveler{ display:none !important; }
      }
    `;(document.head||document.documentElement).appendChild(st);}catch(_){}})();(function(){const STYLE_ID='lp-map-final-fixes-v8';function ensureStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
#lp-map-modal .lp-map-topbar,
#lp-h1sg-modal .lp-h1sg-topbar,
#lp-map-modal .lp-mbody,
#lp-h1sg-modal .lp-mbody,
#lp-map-modal .lp-mapstage,
#lp-h1sg-modal .lp-mapstage{
  border:none !important;
  box-shadow:none !important;
  background:transparent !important;
}
#lp-map-modal .lp-map-helper,
#lp-h1sg-modal .lp-h1sg-helper{
  display:block;
}
#lp-map-modal .lp-map-helper[hidden],
#lp-h1sg-modal .lp-h1sg-helper[hidden]{
  display:none !important;
}
#lp-map-modal .lp-map-tipbtn,
#lp-h1sg-modal .lp-h1sg-tipbtn{
  appearance:none !important;
  border:1px solid rgba(255,255,255,.10) !important;
  background:rgba(29, 34, 45, .88) !important;
  color:rgba(255,255,255,.94) !important;
  border-radius:999px !important;
  min-height:40px !important;
  padding:0 14px !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  gap:8px !important;
  font:inherit !important;
  font-size:.76rem !important;
  font-weight:800 !important;
  cursor:pointer !important;
  box-shadow:0 12px 24px rgba(0,0,0,.18) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
}
#lp-map-modal .lp-map-tipbtn-icon,
#lp-h1sg-modal .lp-h1sg-tipbtn-icon{
  width:1.1rem;
  height:1.1rem;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  font-size:1rem;
  font-weight:900;
  line-height:1;
}
#lp-map-modal.lp-map-tip-phone .lp-map-tipbtn,
#lp-h1sg-modal.lp-map-tip-phone .lp-h1sg-tipbtn{
  width:40px !important;
  min-width:40px !important;
  padding:0 !important;
}
#lp-map-modal.lp-map-tip-phone .lp-map-tipbtn-text,
#lp-h1sg-modal.lp-map-tip-phone .lp-h1sg-tipbtn-text{
  display:none !important;
}
html[data-md-color-scheme="default"] #lp-map-modal .lp-map-tipbtn,
body[data-md-color-scheme="default"] #lp-map-modal .lp-map-tipbtn,
html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tipbtn,
body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tipbtn,
html[data-md-color-scheme="default"] #lp-map-modal .lp-map-helper,
body[data-md-color-scheme="default"] #lp-map-modal .lp-map-helper,
html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-helper,
body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-helper{
  background:rgba(244, 246, 250, .96) !important;
  color:rgba(15,23,42,.92) !important;
  border-color:rgba(15,23,42,.12) !important;
  box-shadow:0 10px 22px rgba(15,23,42,.12) !important;
}
html[data-md-color-scheme="slate"] #lp-map-modal .lp-map-tipbtn,
body[data-md-color-scheme="slate"] #lp-map-modal .lp-map-tipbtn,
html[data-md-color-scheme="slate"] #lp-h1sg-modal .lp-h1sg-tipbtn,
body[data-md-color-scheme="slate"] #lp-h1sg-modal .lp-h1sg-tipbtn,
html[data-md-color-scheme="slate"] #lp-map-modal .lp-map-helper,
body[data-md-color-scheme="slate"] #lp-map-modal .lp-map-helper,
html[data-md-color-scheme="slate"] #lp-h1sg-modal .lp-h1sg-helper,
body[data-md-color-scheme="slate"] #lp-h1sg-modal .lp-h1sg-helper{
  background:rgba(29, 34, 45, .88) !important;
  color:rgba(255,255,255,.94) !important;
  border-color:rgba(255,255,255,.10) !important;
}

/* route topbar should behave like local-map tips/filter sizing */
#lp-h1sg-modal .lp-h1sg-topbar{ gap:8px !important; }
#lp-h1sg-modal .lp-h1sg-tophead,
#lp-h1sg-modal .lp-h1sg-topbar-row{
  display:flex !important;
  align-items:center !important;
  gap:10px !important;
  width:auto !important;
  max-width:calc(100% - 0px) !important;
  min-width:0 !important;
  flex-wrap:nowrap !important;
}
#lp-h1sg-modal .lp-h1sg-helper{
  width:fit-content !important;
  max-width:min(var(--lp-h1sg-helper-max-ch, 72ch), calc(100% - 0px)) !important;
  min-width:0 !important;
}
#lp-h1sg-modal .lp-h1sg-filter{
  flex:0 1 auto !important;
  width:min(max(7.5rem, var(--lp-h1sg-filter-ch, 12ch)), 8.5rem) !important;
  max-width:calc(100% - 0px) !important;
  min-width:0 !important;
}
#lp-h1sg-modal .lp-h1sg-filter input::placeholder{ white-space:nowrap; }
@media (max-width: 900px){
  #lp-h1sg-modal .lp-h1sg-tophead,
  #lp-h1sg-modal .lp-h1sg-topbar-row{
    width:100% !important;
    max-width:none !important;
    flex-wrap:wrap !important;
  }
  #lp-h1sg-modal .lp-h1sg-filter{
    width:min(100%, 8.5rem) !important;
    max-width:100% !important;
  }
}

/* local map zoom should match route map zoom exactly */
#lp-map-modal .lp-mzoom,
#lp-h1sg-modal .lp-mzoom{
  display:flex !important;
  flex-direction:column !important;
  gap:10px !important;
}
#lp-map-modal .lp-mzoom .lp-ctrl-group.lp-zoombar,
#lp-h1sg-modal .lp-mzoom .lp-ctrl-group.lp-zoombar{
  width:100% !important;
  justify-content:flex-start !important;
  gap:10px !important;
  padding:8px 12px !important;
  border-radius:18px !important;
  border:1px solid rgba(255,255,255,.12) !important;
  background:rgba(10, 14, 22, .84) !important;
  box-shadow:0 10px 24px rgba(0,0,0,.24) !important;
  backdrop-filter:blur(12px) !important;
  -webkit-backdrop-filter:blur(12px) !important;
}
#lp-map-modal .lp-btn,
#lp-h1sg-modal .lp-btn{
  border-radius:999px !important;
  min-height:40px !important;
  padding:.3rem .9rem !important;
}
#lp-map-modal .lp-hop,
#lp-h1sg-modal .lp-hop{
  min-width:4.2rem !important;
  text-align:center !important;
  font-weight:800 !important;
  color:rgba(255,255,255,.90) !important;
}
html[data-md-color-scheme="default"] #lp-map-modal .lp-mzoom .lp-ctrl-group.lp-zoombar,
body[data-md-color-scheme="default"] #lp-map-modal .lp-mzoom .lp-ctrl-group.lp-zoombar,
html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-mzoom .lp-ctrl-group.lp-zoombar,
body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-mzoom .lp-ctrl-group.lp-zoombar{
  border-color:rgba(15,23,42,.12) !important;
  background:rgba(255,255,255,.96) !important;
  box-shadow:0 10px 22px rgba(15,23,42,.12) !important;
}
html[data-md-color-scheme="default"] #lp-map-modal .lp-btn,
body[data-md-color-scheme="default"] #lp-map-modal .lp-btn,
html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-btn,
body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-btn{
  border-color:rgba(15,23,42,.12) !important;
  background:rgba(255,255,255,.72) !important;
  color:rgba(15,23,42,.90) !important;
}
html[data-md-color-scheme="default"] #lp-map-modal .lp-hop,
body[data-md-color-scheme="default"] #lp-map-modal .lp-hop,
html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-hop,
body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-hop{
  color:rgba(15,23,42,.90) !important;
}
#lp-map-modal input.lp-zoomrange,
#lp-h1sg-modal input.lp-zoomrange{
  flex:1 1 auto !important;
  width:100% !important;
  height:30px !important;
  padding:0 !important;
  margin:0 !important;
  border:none !important;
  outline:none !important;
  box-shadow:none !important;
  background:transparent !important;
  background-image:none !important;
  border-radius:999px !important;
  -webkit-appearance:none !important;
  appearance:none !important;
}
#lp-map-modal input.lp-zoomrange::-webkit-slider-container,
#lp-h1sg-modal input.lp-zoomrange::-webkit-slider-container{
  border:none !important;
  background:transparent !important;
}
#lp-map-modal input.lp-zoomrange::-webkit-slider-runnable-track,
#lp-h1sg-modal input.lp-zoomrange::-webkit-slider-runnable-track{
  height:8px !important;
  border:none !important;
  border-radius:999px !important;
  background:linear-gradient(90deg, var(--lp-zoom-fill, rgb(255,42,35)) 0%, var(--lp-zoom-fill, rgb(255,42,35)) var(--lp-zoom-active-pct, 41.1765%), var(--lp-zoom-track, rgba(255,255,255,.20)) var(--lp-zoom-active-pct, 41.1765%), var(--lp-zoom-track, rgba(255,255,255,.20)) 100%) !important;
}
#lp-map-modal input.lp-zoomrange::-webkit-slider-thumb,
#lp-h1sg-modal input.lp-zoomrange::-webkit-slider-thumb{
  -webkit-appearance:none !important;
  width:18px !important;
  height:18px !important;
  margin-top:-5px !important;
  border:none !important;
  border-radius:999px !important;
  background:rgba(255,255,255,.92) !important;
  box-shadow:0 6px 16px rgba(0,0,0,.28) !important;
}
#lp-map-modal input.lp-zoomrange::-moz-range-track,
#lp-h1sg-modal input.lp-zoomrange::-moz-range-track{
  height:8px !important;
  border:none !important;
  border-radius:999px !important;
  background:var(--lp-zoom-track, rgba(255,255,255,.20)) !important;
}
#lp-map-modal input.lp-zoomrange::-moz-range-progress,
#lp-h1sg-modal input.lp-zoomrange::-moz-range-progress{
  height:8px !important;
  border:none !important;
  border-radius:999px !important;
  background:var(--lp-zoom-fill, rgb(255,42,35)) !important;
}
#lp-map-modal input.lp-zoomrange::-moz-range-thumb,
#lp-h1sg-modal input.lp-zoomrange::-moz-range-thumb{
  width:18px !important;
  height:18px !important;
  border:none !important;
  border-radius:999px !important;
  background:rgba(255,255,255,.92) !important;
  box-shadow:0 6px 16px rgba(0,0,0,.28) !important;
}
html[data-md-color-scheme="default"] #lp-map-modal input.lp-zoomrange,
body[data-md-color-scheme="default"] #lp-map-modal input.lp-zoomrange,
html[data-md-color-scheme="default"] #lp-h1sg-modal input.lp-zoomrange,
body[data-md-color-scheme="default"] #lp-h1sg-modal input.lp-zoomrange{
  --lp-zoom-track: rgba(15,23,42,.18) !important;
}
@media (max-width: 900px){
  #lp-map-modal .lp-mzoom,
  #lp-h1sg-modal .lp-mzoom{
    bottom:calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
    width:calc(100% - 12px) !important;
    max-width:none !important;
  }
  #lp-map-modal input.lp-zoomrange,
  #lp-h1sg-modal input.lp-zoomrange{ height:34px !important; }
  #lp-map-modal input.lp-zoomrange::-webkit-slider-runnable-track,
  #lp-h1sg-modal input.lp-zoomrange::-webkit-slider-runnable-track,
  #lp-map-modal input.lp-zoomrange::-moz-range-track,
  #lp-h1sg-modal input.lp-zoomrange::-moz-range-track,
  #lp-map-modal input.lp-zoomrange::-moz-range-progress,
  #lp-h1sg-modal input.lp-zoomrange::-moz-range-progress{ height:8px !important; }
  #lp-map-modal input.lp-zoomrange::-webkit-slider-thumb,
  #lp-h1sg-modal input.lp-zoomrange::-webkit-slider-thumb,
  #lp-map-modal input.lp-zoomrange::-moz-range-thumb,
  #lp-h1sg-modal input.lp-zoomrange::-moz-range-thumb{
    width:24px !important;
    height:24px !important;
    margin-top:-8px !important;
  }
}

/* align route backdrop/frost with local map */
#lp-h1sg-modal{
  background:rgba(0,0,0,.46) !important;
  backdrop-filter:blur(6px) !important;
  -webkit-backdrop-filter:blur(6px) !important;
}
@media (pointer: coarse) and (max-width: 767px), (pointer: coarse) and (max-height: 600px), (max-width: 900px){
  #lp-h1sg-modal,
  #lp-h1sg-modal.lp-full{
    background:rgba(0,0,0,.62) !important;
    backdrop-filter:blur(10px) !important;
    -webkit-backdrop-filter:blur(10px) !important;
  }
}

/* cleaner dock launch button */
#lp-h1sg-modal .lp-h1sg-docklaunch{
  border:1px solid rgba(129,140,248,.18) !important;
  border-radius:999px !important;
  padding:.82rem 1.12rem !important;
  background:linear-gradient(180deg, rgba(92,102,216,.96), rgba(74,84,198,.96)) !important;
  color:#fff !important;
  font:inherit !important;
  font-size:1rem !important;
  font-weight:760 !important;
  letter-spacing:0 !important;
  box-shadow:0 10px 22px rgba(0,0,0,.22), 0 0 0 1px rgba(129,140,248,.12) !important;
  text-align:center !important;
}
html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-docklaunch,
body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-docklaunch{
  background:linear-gradient(180deg, rgba(88,98,214,.94), rgba(73,82,196,.94)) !important;
}

/* mathjax duplicate symbol guard inside map nodes */
#lp-map-modal .lp-node-title mjx-assistive-mml,
#lp-h1sg-modal .lp-node-title mjx-assistive-mml,
#lp-map-modal .lp-node-title .MJX_Assistive_MathML,
#lp-h1sg-modal .lp-node-title .MJX_Assistive_MathML,
#lp-map-modal .lp-node-title .mjx-assistive-mml,
#lp-h1sg-modal .lp-node-title .mjx-assistive-mml,
#lp-map-modal .lp-node-title [aria-hidden="false"].MJX_Assistive_MathML,
#lp-h1sg-modal .lp-node-title [aria-hidden="false"].MJX_Assistive_MathML{
  display:none !important;
  width:0 !important;
  height:0 !important;
  overflow:hidden !important;
}
`;(document.head||document.documentElement).appendChild(st);}
function sync(){ensureStyles();try{const route=document.getElementById('lp-h1sg-modal');if(route){const panel=route.querySelector('[data-lp-map-helper-panel]');const btn=route.querySelector('[data-lp-map-tip-toggle]');if(panel&&(!btn||btn.getAttribute('aria-expanded')!=='true'))panel.hidden=true;else if(panel&&btn){const api=window.MkLP||{};if(typeof api.lpMapTipsReposition==='function')api.lpMapTipsReposition(route);}
const input=route.querySelector('[data-lp-h1sg-filter-input]');const shell=input&&input.closest?input.closest('.lp-h1sg-filter'):null;if(input&&shell){const ph=String(input.getAttribute('placeholder')||'').trim();const ch=Math.max(16,Math.min(24,ph.length+2));shell.style.setProperty('--lp-h1sg-filter-ch',`${ch}ch`);}}
const local=document.getElementById('lp-map-modal');if(local){const panel=local.querySelector('[data-lp-map-helper-panel]');const btn=local.querySelector('[data-lp-map-tip-toggle]');if(panel&&(!btn||btn.getAttribute('aria-expanded')!=='true'))panel.hidden=true;else if(panel&&btn){const api=window.MkLP||{};if(typeof api.lpMapTipsReposition==='function')api.lpMapTipsReposition(local);}}}catch(_){}}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',sync,{once:true});}else{sync();}
document.addEventListener('DOMContentSwitch',sync);window.addEventListener('resize',sync);})();(function(){const STYLE_ID='lp-map-final-fixes-v9';function ensureStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
/* Keep both map modals visually identical in backdrop blur */
#lp-map-modal,
#lp-h1sg-modal{
  background:rgba(0,0,0,.46) !important;
  backdrop-filter:blur(6px) !important;
  -webkit-backdrop-filter:blur(6px) !important;
}
@media (pointer: coarse) and (max-width: 767px), (pointer: coarse) and (max-height: 600px), (max-width: 900px){
  #lp-map-modal,
  #lp-map-modal.lp-full,
  #lp-h1sg-modal,
  #lp-h1sg-modal.lp-full{
    background:rgba(0,0,0,.62) !important;
    backdrop-filter:blur(10px) !important;
    -webkit-backdrop-filter:blur(10px) !important;
  }
}

/* Remove top/bottom block segmentation by making both top bars true overlays */
#lp-map-modal .lp-map-topbar,
#lp-h1sg-modal .lp-h1sg-topbar{
  position:absolute !important;
  left:16px !important;
  right:auto !important;
  width:max-content !important;
  max-width:calc(100% - 128px) !important;
  top:calc(env(safe-area-inset-top, 0px) + 14px) !important;
  z-index:6 !important;
  padding:0 !important;
  margin:0 !important;
  display:flex !important;
  flex-wrap:nowrap !important;
  align-items:flex-start !important;
  gap:10px !important;
  pointer-events:none !important;
  background:transparent !important;
  border:none !important;
  box-shadow:none !important;
}
#lp-map-modal .lp-map-toprow,
#lp-h1sg-modal .lp-h1sg-tophead,
#lp-h1sg-modal .lp-h1sg-topbar-row{
  pointer-events:auto !important;
  flex:0 0 auto !important;
  min-width:0 !important;
  max-width:none !important;
  width:auto !important;
}
#lp-map-modal .lp-tab-label-long,
#lp-h1sg-modal .lp-tab-label-long{ display:inline !important; }
#lp-map-modal .lp-tab-label-short,
#lp-h1sg-modal .lp-tab-label-short{ display:none !important; }
@media (max-width: 900px), (hover: none) and (pointer: coarse){
  #lp-map-modal .lp-tab-label-long,
  #lp-h1sg-modal .lp-tab-label-long{ display:none !important; }
  #lp-map-modal .lp-tab-label-short,
  #lp-h1sg-modal .lp-tab-label-short{ display:inline !important; }
}

#lp-map-modal .lp-map-tabs,
#lp-h1sg-modal .lp-h1sg-tabs{
  flex:0 0 auto !important;
  width:-moz-fit-content !important;
  width:fit-content !important;
  min-width:0 !important;
  max-width:100% !important;
  align-self:flex-start !important;
}
#lp-h1sg-modal .lp-h1sg-tophead,
#lp-h1sg-modal .lp-h1sg-topbar-row,
#lp-map-modal .lp-map-toprow{
  display:flex !important;
  align-items:center !important;
  gap:10px !important;
  flex-wrap:nowrap !important;
}
#lp-h1sg-modal .lp-h1sg-topbar-row{
  margin-left:0 !important;
}

/* Tips panels should be overlay dropdowns, never push the map down */
#lp-map-modal .lp-map-helper,
#lp-h1sg-modal .lp-h1sg-helper{
  position:absolute !important;
  left:0 !important;
  top:calc(100% + 8px) !important;
  z-index:7 !important;
  width:fit-content !important;
  max-width:min(740px, calc(100vw - 56px)) !important;
  padding:10px 14px !important;
  font-size:clamp(.72rem, .78vw, .84rem) !important;
  line-height:1.28 !important;
  white-space:normal !important;
  pointer-events:auto !important;
}
#lp-map-modal .lp-map-helper[hidden],
#lp-h1sg-modal .lp-h1sg-helper[hidden]{
  display:none !important;
}

/* Map tips surface colors */
#lp-map-modal .lp-map-tipbtn,
#lp-h1sg-modal .lp-h1sg-tipbtn,
#lp-map-modal .lp-map-helper,
#lp-h1sg-modal .lp-h1sg-helper{
  background:rgba(38,42,50,.88) !important;
  color:rgba(255,255,255,.94) !important;
  border-color:rgba(255,255,255,.10) !important;
}
html[data-md-color-scheme="default"] #lp-map-modal .lp-map-tipbtn,
body[data-md-color-scheme="default"] #lp-map-modal .lp-map-tipbtn,
html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tipbtn,
body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-tipbtn,
html[data-md-color-scheme="default"] #lp-map-modal .lp-map-helper,
body[data-md-color-scheme="default"] #lp-map-modal .lp-map-helper,
html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-helper,
body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-h1sg-helper{
  background:rgba(240,242,246,.96) !important;
  color:rgba(15,23,42,.92) !important;
  border-color:rgba(15,23,42,.12) !important;
}

/* Route search box lives on the first row, to the right of Map tips, and stays compact */
#lp-h1sg-modal .lp-h1sg-tophead{
  width:100% !important;
  display:flex !important;
  align-items:center !important;
  gap:10px !important;
  flex-wrap:nowrap !important;
}
#lp-h1sg-modal .lp-h1sg-tabs{
  flex:0 1 auto !important;
  width:fit-content !important;
  min-width:0 !important;
  max-width:100% !important;
}
#lp-h1sg-modal .lp-h1sg-tipbtn{
  flex:0 0 auto !important;
}
#lp-h1sg-modal .lp-h1sg-tophead > .lp-h1sg-filter,
#lp-h1sg-modal .lp-h1sg-filter{
  flex:0 0 clamp(7.5rem, 12vw, 8.5rem) !important;
  width:clamp(7.5rem, 12vw, 8.5rem) !important;
  max-width:8.5rem !important;
  min-width:7.5rem !important;
  height:40px !important;
  margin-left:0 !important;
}
#lp-h1sg-modal .lp-h1sg-filter input{
  min-width:0 !important;
  width:100% !important;
}
#lp-h1sg-modal .lp-h1sg-filter input::placeholder{
  white-space:nowrap !important;
}
@media (max-width: 900px), (hover: none) and (pointer: coarse){
  #lp-h1sg-modal .lp-h1sg-topbar-row{
    display:none !important;
  }
}

/* Sidebar MathJax duplicate guards */
#lp-side-panel .lp-name .MathJax_Preview,
#lp-mobile-sheet #lp-side-panel .lp-name .MathJax_Preview,
#lp-side-panel .lp-name .MJX_LiveRegion,
#lp-mobile-sheet #lp-side-panel .lp-name .MJX_LiveRegion,
#lp-side-panel .lp-name .MJX_Assistive_MathML,
#lp-mobile-sheet #lp-side-panel .lp-name .MJX_Assistive_MathML,
#lp-side-panel .lp-name .mjx-assistive-mml,
#lp-mobile-sheet #lp-side-panel .lp-name .mjx-assistive-mml,
#lp-side-panel .lp-name mjx-assistive-mml,
#lp-mobile-sheet #lp-side-panel .lp-name mjx-assistive-mml,
#lp-side-panel .lp-name [aria-hidden="false"].MJX_Assistive_MathML,
#lp-mobile-sheet #lp-side-panel .lp-name [aria-hidden="false"].MJX_Assistive_MathML{
  display:none !important;
  width:0 !important;
  height:0 !important;
  overflow:hidden !important;
}

/* Desktop route/local map chrome must stay visible. */
@media (min-width: 901px){
  #lp-map-modal .lp-map-topbar,
  #lp-h1sg-modal .lp-h1sg-topbar{
    display:flex !important;
    visibility:visible !important;
    opacity:1 !important;
    pointer-events:none !important;
    z-index:20 !important;
  }
  #lp-map-modal .lp-map-toprow,
  #lp-map-modal .lp-map-tabs,
  #lp-h1sg-modal .lp-h1sg-tophead,
  #lp-h1sg-modal .lp-h1sg-tabs,
  #lp-h1sg-modal .lp-h1sg-tipbtn,
  #lp-h1sg-modal .lp-h1sg-filter{
    display:flex !important;
    visibility:visible !important;
    opacity:1 !important;
  }
  #lp-map-modal .lp-close,
  #lp-h1sg-modal .lp-close{
    display:flex !important;
    visibility:visible !important;
    opacity:.92 !important;
    pointer-events:auto !important;
    z-index:40 !important;
  }
}

/* Make local zoom dock match route zoom dock exactly on desktop */
@media (min-width: 901px){
  #lp-map-modal .lp-mzoom .lp-ctrl-group.lp-zoombar,
  #lp-h1sg-modal .lp-mzoom .lp-ctrl-group.lp-zoombar{
    display:grid !important;
    grid-template-columns:44px minmax(180px,1fr) 4.2rem 44px auto !important;
    align-items:center !important;
    column-gap:10px !important;
    row-gap:0 !important;
    padding:8px 12px !important;
  }
  #lp-map-modal [data-zoom-dec],
  #lp-map-modal [data-zoom-inc],
  #lp-h1sg-modal [data-lp-h1sg-zoom-dec],
  #lp-h1sg-modal [data-lp-h1sg-zoom-inc]{
    width:44px !important;
    min-width:44px !important;
    max-width:44px !important;
    padding:0 !important;
    justify-content:center !important;
  }
  #lp-map-modal [data-zoom-reset],
  #lp-h1sg-modal [data-lp-h1sg-zoom-reset]{
    min-width:auto !important;
    padding:0 18px !important;
    justify-self:start !important;
  }
  #lp-map-modal .lp-hop,
  #lp-h1sg-modal .lp-hop{
    min-width:4.2rem !important;
    width:4.2rem !important;
    max-width:4.2rem !important;
  }
}

/* Stronger range cleanup so local slider does not show an extra rectangle */
#lp-map-modal input.lp-zoomrange,
#lp-h1sg-modal input.lp-zoomrange{
  display:block !important;
  box-sizing:border-box !important;
  background-color:transparent !important;
  background-image:none !important;
  overflow:visible !important;
}
#lp-map-modal input.lp-zoomrange::-webkit-slider-container,
#lp-h1sg-modal input.lp-zoomrange::-webkit-slider-container,
#lp-map-modal input.lp-zoomrange::-webkit-media-slider-container,
#lp-h1sg-modal input.lp-zoomrange::-webkit-media-slider-container{
  background:transparent !important;
  border:none !important;
}

/* Route helper panel stays narrow and never stretches the whole width */
#lp-h1sg-modal .lp-h1sg-helper{
  max-width:min(var(--lp-h1sg-helper-max-ch, 64ch), calc(100vw - 56px)) !important;
}

/* Mobile keeps stacked layout */
@media (max-width: 900px){
  #lp-map-modal .lp-map-topbar,
  #lp-h1sg-modal .lp-h1sg-topbar{
    left:12px !important;
    right:auto !important;
    width:auto !important;
    max-width:calc(100% - 72px) !important;
    top:calc(env(safe-area-inset-top, 0px) + 10px) !important;
    flex-wrap:wrap !important;
    gap:8px !important;
  }
  #lp-map-modal .lp-map-toprow,
  #lp-h1sg-modal .lp-h1sg-tophead,
  #lp-h1sg-modal .lp-h1sg-topbar-row{
    width:100% !important;
    max-width:none !important;
    flex-wrap:wrap !important;
  }
  #lp-h1sg-modal .lp-h1sg-filter{
    width:min(100%, 20rem) !important;
    max-width:100% !important;
    min-width:0 !important;
    flex:1 1 100% !important;
    order:3 !important;
  }
  #lp-map-modal .lp-map-helper,
  #lp-h1sg-modal .lp-h1sg-helper{
    max-width:calc(100vw - 28px) !important;
  }
}

/* Extra MathJax duplicate guards */
#lp-map-modal .lp-node-title .MathJax_Preview,
#lp-h1sg-modal .lp-node-title .MathJax_Preview,
#lp-map-modal .lp-node-title .MJX_LiveRegion,
#lp-h1sg-modal .lp-node-title .MJX_LiveRegion,
#lp-map-modal .lp-node-title .MJX_Assistive_MathML,
#lp-h1sg-modal .lp-node-title .MJX_Assistive_MathML,
#lp-map-modal .lp-node-title .mjx-assistive-mml,
#lp-h1sg-modal .lp-node-title .mjx-assistive-mml,
#lp-map-modal .lp-node-title mjx-assistive-mml,
#lp-h1sg-modal .lp-node-title mjx-assistive-mml{
  display:none !important;
}
`;(document.head||document.documentElement).appendChild(st);}
function sync(){ensureStyles();try{const route=document.getElementById('lp-h1sg-modal');if(route){const panel=route.querySelector('[data-lp-map-helper-panel]');const btn=route.querySelector('[data-lp-map-tip-toggle]');if(panel&&(!btn||btn.getAttribute('aria-expanded')!=='true'))panel.hidden=true;const input=route.querySelector('[data-lp-h1sg-filter-input]');const shell=input&&input.closest?input.closest('.lp-h1sg-filter'):null;const tophead=route.querySelector('.lp-h1sg-tophead');const topbarRow=route.querySelector('.lp-h1sg-topbar-row');if(tophead){tophead.style.display='flex';tophead.style.alignItems='center';tophead.style.flexWrap='nowrap';tophead.style.width='100%';}
if(topbarRow){const ui=window.MkLearningPathUI||{};topbarRow.style.display=(typeof ui.isMobileMapModal==='function'&&ui.isMobileMapModal())?'none':'';}
if(input&&shell){const ph=String(input.getAttribute('placeholder')||'').trim();const ch=Math.max(14,Math.min(18,ph.length+1));shell.style.setProperty('--lp-h1sg-filter-ch',`${ch}ch`);shell.style.flex='0 0 clamp(7.5rem, 12vw, 8.5rem)';shell.style.width='clamp(7.5rem, 12vw, 8.5rem)';shell.style.maxWidth='8.5rem';shell.style.minWidth='7.5rem';shell.style.height='40px';shell.style.marginLeft='0';input.style.width='100%';input.style.minWidth='0';}}
const local=document.getElementById('lp-map-modal');if(local){const panel=local.querySelector('[data-lp-map-helper-panel]');const btn=local.querySelector('[data-lp-map-tip-toggle]');if(panel&&(!btn||btn.getAttribute('aria-expanded')!=='true'))panel.hidden=true;}}catch(_){}}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',sync,{once:true});}else{sync();}
document.addEventListener('DOMContentSwitch',sync);window.addEventListener('resize',sync);})();(function(){const STYLE_ID='lp-map-mobile-refine-v10';function ensureStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
/* Final phone polish for map tabs / route search / dock launch */
@media (max-width: 900px){
  #lp-map-modal .lp-mapstage > .lp-mzoom[data-lp-zoom-dock="ghost"]{
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    min-width: 0 !important;
    min-height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    overflow: hidden !important;
    pointer-events: none !important;
  }

  #lp-map-modal .lp-mbox > .lp-mzoom[data-lp-zoom-dock="outer"]{
    bottom: calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: calc(100% - 12px) !important;
    max-width: none !important;
  }

  #lp-h1sg-modal .lp-mbox > .lp-mzoom{
    bottom: max(calc(env(safe-area-inset-bottom, 0px) + 16px), 88px) !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: calc(100% - 12px) !important;
    max-width: none !important;
  }

  /* Route map: keep tabs on row 1, then tip + search on row 2 aligned left */
  #lp-h1sg-modal .lp-h1sg-tophead{
    display: grid !important;
    grid-template-columns: auto minmax(0, 1fr) !important;
    grid-template-areas:
      "tabs tabs"
      "tip filter" !important;
    align-items: center !important;
    gap: 8px !important;
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
  }
  #lp-h1sg-modal .lp-h1sg-tabs{
    grid-area: tabs !important;
    width: max-content !important;
    max-width: 100% !important;
    min-width: 0 !important;
    justify-self: start !important;
  }
  #lp-h1sg-modal .lp-h1sg-tipbtn{
    grid-area: tip !important;
    justify-self: start !important;
    align-self: center !important;
    margin: 0 !important;
  }
  #lp-h1sg-modal .lp-h1sg-filter{
    grid-area: filter !important;
    width: auto !important;
    max-width: none !important;
    min-width: 0 !important;
    flex: none !important;
    order: unset !important;
    margin: 0 !important;
    align-self: center !important;
  }
  #lp-h1sg-modal .lp-h1sg-filter input{
    width: 100% !important;
    min-width: 0 !important;
  }
}

/* Make the dock launch button smaller and content-width instead of full-width */
#lp-h1sg-modal .lp-h1sg-docklaunch{
  width: auto !important;
  max-width: calc(100% - 24px) !important;
  align-self: center !important;
  justify-self: center !important;
  padding: .56rem .94rem !important;
  min-height: 0 !important;
  font-size: .88rem !important;
  line-height: 1.15 !important;
  white-space: nowrap !important;
  pointer-events: auto !important;
  touch-action: manipulation !important;
  /* Keep the absolute, horizontally centered anchor above the zoom dock. */
  transition: transform .18s ease, box-shadow .18s ease, filter .18s ease, border-color .18s ease, background .18s ease !important;
  will-change: transform !important;
}
#lp-h1sg-modal .lp-h1sg-docklaunch:hover,
#lp-h1sg-modal .lp-h1sg-docklaunch.is-hover{
  transform: translateX(-50%) translateY(-2px) scale(1.032) !important;
  box-shadow: 0 22px 40px rgba(0,0,0,.34), 0 0 0 1px rgba(129,140,248,.34), 0 0 0 8px rgba(129,140,248,.14) !important;
  filter: brightness(1.10) saturate(1.08) !important;
}
#lp-h1sg-modal .lp-h1sg-docklaunch:active,
#lp-h1sg-modal .lp-h1sg-docklaunch.is-press{
  transform: translateX(-50%) scale(.988) !important;
  box-shadow: 0 10px 22px rgba(0,0,0,.24), 0 0 0 1px rgba(129,140,248,.18) !important;
}
#lp-h1sg-modal .lp-h1sg-docklaunch:focus-visible{
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(129,140,248,.26), 0 12px 24px rgba(0,0,0,.24) !important;
}
@media (max-width: 900px){
  #lp-h1sg-modal .lp-h1sg-docklaunch{
    padding: .52rem .88rem !important;
    font-size: .84rem !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function syncTabLabels(root){if(!root||!root.querySelectorAll)return;const labels={toHere:{long:'Prerequisites',short:'Prerequisites'},local:{long:'Nearby',short:'Nearby'},fromHere:{long:'Dependents',short:'Dependents'}};const setLabel=(btn,label)=>{try{if(!btn||!label)return;const longLabel=document.createElement('span');longLabel.className='lp-tab-label-long';longLabel.textContent=String(label.long||'');const shortLabel=document.createElement('span');shortLabel.className='lp-tab-label-short';shortLabel.textContent=String(label.short||'');btn.replaceChildren(longLabel,shortLabel);}catch(_){}};root.querySelectorAll('[data-lp-map-tab="toHere"]').forEach((btn)=>setLabel(btn,labels.toHere));root.querySelectorAll('[data-lp-map-tab="local"]').forEach((btn)=>setLabel(btn,labels.local));root.querySelectorAll('[data-lp-map-tab="fromHere"]').forEach((btn)=>setLabel(btn,labels.fromHere));}
function syncRouteFilter(root){if(!root||!root.querySelector)return;const input=root.querySelector('[data-lp-h1sg-filter-input]');if(!input)return;const active=root.querySelector('[data-lp-map-tab].is-active, [data-lp-map-tab][aria-selected="true"]');const kind=active&&active.getAttribute?String(active.getAttribute('data-lp-map-tab')||''):'';input.setAttribute('placeholder',kind==='fromHere'?'Find a dependent':'Find a prerequisite');}
function syncLocalZoomDock(root){if(!root||!root.querySelector)return;try{const box=root.querySelector('.lp-mbox');if(!box)return;let dock=null;for(const child of Array.from(box.children||[])){if(child&&child.classList&&child.classList.contains('lp-mzoom')){dock=child;break;}}
if(!dock){dock=document.createElement('div');dock.className='lp-mzoom';box.appendChild(dock);}
try{dock.setAttribute('data-lp-zoom-dock','outer');if(root.id)dock.setAttribute('data-lp-zoom-owner',root.id);}catch(_){}
const zoom=box.querySelector('[data-ctrl-zoom]');if(zoom&&zoom.parentElement!==dock)dock.appendChild(zoom);const stage=box.querySelector('.lp-mapstage');if(stage){Array.from(stage.querySelectorAll(':scope > .lp-mzoom')).forEach((ghost)=>{try{ghost.setAttribute('data-lp-zoom-dock','ghost');ghost.remove();}catch(_){}});}}catch(_){}}
function sync(){ensureStyles();try{const local=document.getElementById('lp-map-modal');if(local){syncTabLabels(local);syncLocalZoomDock(local);}
const route=document.getElementById('lp-h1sg-modal');if(route){syncTabLabels(route);syncRouteFilter(route);}}catch(_){}}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',sync,{once:true});}else{sync();}
document.addEventListener('DOMContentSwitch',sync);window.addEventListener('resize',sync);})();(function(){function lpClearDrawerScrollfix(){try{const drawerToggle=document.querySelector('[data-md-toggle="drawer"]');if(!drawerToggle||drawerToggle.checked)return;document.querySelectorAll('[data-md-scrollfix]').forEach(function(el){try{el.removeAttribute('data-md-scrollfix');}catch(_){}});const html=document.documentElement;const body=document.body;[html,body].forEach(function(el){if(!el||!el.style)return;if(el.classList&&el.classList.contains('lp-modal-open'))return;el.style.overflow='';el.style.position='';el.style.top='';el.style.left='';el.style.right='';el.style.width='';el.style.height='';});}catch(_){}}
function lpInstallDrawerWatcher(){const toggle=document.querySelector('[data-md-toggle="drawer"]');if(!toggle||toggle._lpDrawerFixBound)return;toggle._lpDrawerFixBound=true;toggle.addEventListener('change',lpClearDrawerScrollfix);}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',lpInstallDrawerWatcher,{once:true});}else{lpInstallDrawerWatcher();}
document.addEventListener('DOMContentSwitch',lpInstallDrawerWatcher);})();(function(){"use strict";const STYLE_ID="lp-mobile-sheet-drawer-fix-style-v1";const STATE={timers:[],vvBound:false,drawerBound:false,searchSyncBound:false,cleanupRaf:0,};function isPhoneMobile(){try{if(!window.matchMedia)return false;const coarse=window.matchMedia("(pointer: coarse)").matches||window.matchMedia("(hover: none)").matches;if(!coarse)return false;const isTablet=window.matchMedia("(min-width: 768px)").matches&&window.matchMedia("(min-height: 700px)").matches;return!isTablet;}catch(_){return false;}}
function ensureStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
@media (max-width: 768px), (pointer: coarse) {
  /* Closed state must not block taps or scrolling. */
  #lp-mobile-backdrop{
    display: none !important;
    pointer-events: none !important;
    background: transparent !important;
    opacity: 1 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    touch-action: auto !important;
    -webkit-tap-highlight-color: transparent !important;
    -webkit-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
  }

  /* Open state: click-lock only. Keep page visible outside the sheet. */
  #lp-mobile-backdrop.lp-open{
    inset: 0 !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    display: block !important;
    pointer-events: auto !important;
    background: transparent !important;
    opacity: 1 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    touch-action: none !important;
    -webkit-tap-highlight-color: transparent !important;
    -webkit-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
  }

  /* Lift the panel slightly so the lower shadow remains inside the controllable area. */
  #lp-mobile-sheet{
    bottom: calc(max(env(safe-area-inset-bottom, 0px), var(--lp-mobile-vv-bottom-gap, 0px)) + 18px) !important;
    padding: 0 12px !important;
  }

  /* Continuous all-around shadow: no hard cutoff at the outer edge. */
  #lp-mobile-sheet .lp-msheet{
    position: relative !important;
    border-width: 1.25px !important;
    box-shadow:
      0 0 0 1px rgba(255,255,255,.30),
      0 0 0 1.35px rgba(15,23,42,.08) !important;
    filter:
      drop-shadow(0 0 1px rgba(15,23,42,.05))
      drop-shadow(0 0 6px rgba(15,23,42,.05))
      drop-shadow(0 4px 12px rgba(15,23,42,.05))
      drop-shadow(0 10px 22px rgba(15,23,42,.045))
      drop-shadow(0 18px 34px rgba(15,23,42,.03)) !important;
    -webkit-filter:
      drop-shadow(0 0 1px rgba(15,23,42,.05))
      drop-shadow(0 0 6px rgba(15,23,42,.05))
      drop-shadow(0 4px 12px rgba(15,23,42,.05))
      drop-shadow(0 10px 22px rgba(15,23,42,.045))
      drop-shadow(0 18px 34px rgba(15,23,42,.03)) !important;
  }

  html[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet,
  body[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet{
    background: rgba(255,255,255,.996) !important;
    border-color: rgba(27,31,36,.16) !important;
    box-shadow:
      0 0 0 1px rgba(255,255,255,.66),
      0 0 0 1.45px rgba(27,31,36,.10) !important;
    filter:
      drop-shadow(0 0 1px rgba(15,23,42,.045))
      drop-shadow(0 0 6px rgba(15,23,42,.045))
      drop-shadow(0 4px 12px rgba(15,23,42,.045))
      drop-shadow(0 10px 22px rgba(15,23,42,.04))
      drop-shadow(0 18px 34px rgba(15,23,42,.026)) !important;
    -webkit-filter:
      drop-shadow(0 0 1px rgba(15,23,42,.045))
      drop-shadow(0 0 6px rgba(15,23,42,.045))
      drop-shadow(0 4px 12px rgba(15,23,42,.045))
      drop-shadow(0 10px 22px rgba(15,23,42,.04))
      drop-shadow(0 18px 34px rgba(15,23,42,.026)) !important;
  }

  html[data-md-color-scheme="slate"] #lp-mobile-sheet .lp-msheet,
  body[data-md-color-scheme="slate"] #lp-mobile-sheet .lp-msheet{
    background: rgba(31,35,41,.985) !important;
    border-color: rgba(255,255,255,.16) !important;
    box-shadow:
      0 0 0 1px rgba(255,255,255,.06),
      0 0 0 1.3px rgba(255,255,255,.10) !important;
    filter:
      drop-shadow(0 0 1px rgba(0,0,0,.16))
      drop-shadow(0 0 6px rgba(0,0,0,.16))
      drop-shadow(0 4px 12px rgba(0,0,0,.18))
      drop-shadow(0 10px 22px rgba(0,0,0,.18))
      drop-shadow(0 18px 34px rgba(0,0,0,.13)) !important;
    -webkit-filter:
      drop-shadow(0 0 1px rgba(0,0,0,.16))
      drop-shadow(0 0 6px rgba(0,0,0,.16))
      drop-shadow(0 4px 12px rgba(0,0,0,.18))
      drop-shadow(0 10px 22px rgba(0,0,0,.18))
      drop-shadow(0 18px 34px rgba(0,0,0,.13)) !important;
  }

  /* The reused inner side-panel must not create a second glow layer. */
  #lp-mobile-sheet #lp-side-panel{
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }

  html.lp-mobile-search-active #lp-mobile-sheet,
  body.lp-mobile-search-active #lp-mobile-sheet,
  html.lp-mobile-search-active #lp-mobile-backdrop,
  body.lp-mobile-search-active #lp-mobile-backdrop{
    display:none !important;
    pointer-events:none !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function syncViewportVars(){try{if(!isPhoneMobile())return;const root=document.documentElement;if(!root||!root.style)return;let vvHeight=window.innerHeight||0;let bottomGap=0;const vv=window.visualViewport;if(vv){vvHeight=Math.round(vv.height||vvHeight||0);bottomGap=Math.max(0,Math.round((window.innerHeight||0)-((vv.height||0)+(vv.offsetTop||0))));}
const heightText=`${Math.max(0, vvHeight)}px`;const gapText=`${Math.max(0, bottomGap)}px`;if(root.style.getPropertyValue("--lp-mobile-vv-height")!==heightText){root.style.setProperty("--lp-mobile-vv-height",heightText);}
if(root.style.getPropertyValue("--lp-mobile-vv-bottom-gap")!==gapText){root.style.setProperty("--lp-mobile-vv-bottom-gap",gapText);}}catch(_){}}
function bindVisualViewport(){if(STATE.vvBound)return;STATE.vvBound=true;let rerunRaf=0;const rerunNow=()=>{rerunRaf=0;syncViewportVars();syncSearchSheetVisibility();};const rerun=()=>{if(rerunRaf)return;rerunRaf=requestAnimationFrame(rerunNow);};window.addEventListener("resize",rerun,{passive:true});window.addEventListener("orientationchange",rerun,{passive:true});window.addEventListener("pageshow",rerun,{passive:true});document.addEventListener("DOMContentSwitch",rerun);if(!STATE.searchSyncBound){STATE.searchSyncBound=true;const rerunSoon=()=>{window.setTimeout(rerun,0);};document.addEventListener("focusin",rerun,true);document.addEventListener("focusout",rerunSoon,true);document.addEventListener("input",rerun,true);document.addEventListener("change",rerunSoon,true);document.addEventListener("click",rerunSoon,true);document.addEventListener("keydown",rerunSoon,true);}
try{if(window.visualViewport){window.visualViewport.addEventListener("resize",rerun,{passive:true});window.visualViewport.addEventListener("scroll",()=>{const sheet=document.getElementById("lp-mobile-sheet");const sheetActive=!!(sheet&&sheet.classList&&(sheet.classList.contains("lp-expanded")||sheet.classList.contains("lp-panel-opening")||sheet.classList.contains("lp-panel-closing")||sheet.classList.contains("lp-animating")));const drawer=getDrawerToggle();if(!isSearchActive()&&!sheetActive&&!(drawer&&drawer.checked))return;rerun();},{passive:true});}}catch(_){}}
function getDrawerToggle(){return document.querySelector('[data-md-toggle="drawer"]');}
function isSearchActive(){try{const html=document.documentElement;const body=document.body;const toggle=document.querySelector('input.md-toggle[data-md-toggle="search"], input#__search, #__search');return!!((toggle&&toggle.checked)||(html&&html.classList&&html.classList.contains("md-search--active"))||(body&&body.classList&&body.classList.contains("md-search--active")));}catch(_){return false;}}
function syncSearchSheetVisibility(){try{const html=document.documentElement;const body=document.body;const searchOn=!!(isPhoneMobile()&&isSearchActive());if(html&&html.classList)html.classList.toggle('lp-mobile-search-active',searchOn);if(body&&body.classList)body.classList.toggle('lp-mobile-search-active',searchOn);if(!searchOn)return;try{const api=window.MkLP||{};if(typeof api.lpSetMobileSheetExpandedImmediate==='function'){api.lpSetMobileSheetExpandedImmediate(false);}
if(typeof api.lpSetMobileSheetScrollGuards==='function'){api.lpSetMobileSheetScrollGuards(false);}}catch(_){}
const backdrop=document.getElementById('lp-mobile-backdrop');if(backdrop){try{backdrop.classList.remove('lp-open');}catch(_){}
try{backdrop.setAttribute('aria-hidden','true');}catch(_){}}}catch(_){}}
function hasLearningPathModalLock(){try{const body=document.body;if(body&&body.classList&&body.classList.contains("lp-modal-open"))return true;const ids=["lp-map-modal","lp-h1sg-modal","lp-gps-modal"];return ids.some((id)=>{const el=document.getElementById(id);return!!(el&&el.classList&&el.classList.contains("lp-open"));});}catch(_){return false;}}
function shouldClearDrawerArtifacts(){if(!isPhoneMobile())return false;const drawer=getDrawerToggle();if(drawer&&drawer.checked)return false;if(isSearchActive())return false;if(hasLearningPathModalLock())return false;return true;}
function clearInlineLockStyles(el){if(!el||!el.style)return;["overflow","overflow-x","overflow-y","position","top","left","right","bottom","height","width","touch-action","padding-right","margin-right","transform","transition","animation","-webkit-overflow-scrolling"].forEach((prop)=>{try{el.style.removeProperty(prop);}catch(_){}});}
function clearDrawerArtifactsNow(){try{if(!shouldClearDrawerArtifacts())return;const html=document.documentElement;const body=document.body;const topSrc=(body&&body.style&&body.style.top)||(html&&html.style&&html.style.top)||"";const lockedY=/-?\d+px/.test(topSrc)?Math.abs(parseInt(topSrc,10)):0;document.querySelectorAll("[data-md-scrollfix]").forEach((el)=>{try{el.removeAttribute("data-md-scrollfix");}catch(_){}});try{html&&html.removeAttribute("data-md-scrollfix");}catch(_){}
try{body&&body.removeAttribute("data-md-scrollfix");}catch(_){}
["md-sidebar--active","md-nav--active","md-overlay--active","md-dialog--active"].forEach((cls)=>{try{html&&html.classList&&html.classList.remove(cls);}catch(_){}
try{body&&body.classList&&body.classList.remove(cls);}catch(_){}});[html,body].forEach(clearInlineLockStyles);document.querySelectorAll(".md-container, .md-main, .md-content, .md-grid, .md-page, .md-sidebar, .md-sidebar__inner, .md-sidebar__scrollwrap").forEach(clearInlineLockStyles);const overlay=document.querySelector(".md-overlay, .md-drawer__overlay, .md-sidebar__overlay, .md-search__overlay");if(overlay&&overlay.style){try{overlay.style.removeProperty("display");overlay.style.removeProperty("pointer-events");}catch(_){}}
if(lockedY>0){try{window.scrollTo(0,lockedY);}catch(_){}}
try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();}catch(_){}}catch(_){}}
function scheduleDrawerCleanupBurst(){STATE.timers.forEach((id)=>{try{window.clearTimeout(id);}catch(_){}});STATE.timers=[];if(STATE.cleanupRaf){try{cancelAnimationFrame(STATE.cleanupRaf);}catch(_){}
STATE.cleanupRaf=0;}
const delays=[0,50,140,280,520,900];delays.forEach((delay)=>{const id=window.setTimeout(()=>{syncViewportVars();syncSearchSheetVisibility();clearDrawerArtifactsNow();},delay);STATE.timers.push(id);});STATE.cleanupRaf=requestAnimationFrame(()=>{requestAnimationFrame(()=>{syncViewportVars();syncSearchSheetVisibility();clearDrawerArtifactsNow();STATE.cleanupRaf=0;});});}
function bindDrawerFix(){const drawer=getDrawerToggle();if(!drawer||drawer.dataset.lpDrawerCleanupBound==="1")return;drawer.dataset.lpDrawerCleanupBound="1";drawer.addEventListener("change",()=>{syncViewportVars();if(!drawer.checked)scheduleDrawerCleanupBurst("drawer-close");});}
function boot(){ensureStyles();syncViewportVars();syncSearchSheetVisibility();bindVisualViewport();bindDrawerFix();}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",boot,{once:true});}else{boot();}
document.addEventListener("DOMContentSwitch",()=>{ensureStyles();syncViewportVars();syncSearchSheetVisibility();bindDrawerFix();scheduleDrawerCleanupBurst("dom-switch");});})();(function(){"use strict";const STYLE_ID="lp-mobile-sheet-panel-anim-style-v3";function ensureStyles(){const old=document.getElementById(STYLE_ID);if(old)old.remove();const legacyIds=["lp-mobile-sheet-panel-anim-style-v2","lp-mobile-sheet-panel-anim-style-v1"];for(const legacyId of legacyIds){const legacy=document.getElementById(legacyId);if(legacy)legacy.remove();}
const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
@media (max-width: 768px), (pointer: coarse) {
  #lp-mobile-sheet.lp-animating .lp-msheet-body{
    display:block !important;
    overflow:hidden !important;
  }

  #lp-mobile-sheet #lp-side-panel details.lp-acc{
    border:1px solid var(--md-default-fg-color--lightest) !important;
    border-radius:16px !important;
    padding:.72rem .8rem !important;
    margin-top:.68rem !important;
    background:rgba(255,255,255,.035) !important;
    overflow:hidden !important;
    box-sizing:border-box !important;
  }

  #lp-mobile-sheet #lp-side-panel details.lp-acc:first-of-type{
    border-top:1px solid var(--md-default-fg-color--lightest) !important;
    padding-top:.72rem !important;
    margin-top:.55rem !important;
  }

  #lp-mobile-sheet #lp-side-panel details.lp-acc .lp-body{
    margin-top:.52rem !important;
  }

  #lp-mobile-sheet #lp-side-panel details.lp-acc .lp-sum-left{
    display:inline-block;
    transform-origin:left center;
  }

  #lp-mobile-sheet.lp-panel-rows-hidden #lp-side-panel details.lp-acc .lp-body > *{
    display:none !important;
  }

  html[data-md-color-scheme="default"] #lp-mobile-sheet #lp-side-panel details.lp-acc,
  body[data-md-color-scheme="default"] #lp-mobile-sheet #lp-side-panel details.lp-acc{
    background:rgba(0,0,0,.022) !important;
    border-color:rgba(0,0,0,.10) !important;
    box-shadow:0 6px 14px rgba(15,23,42,.05) !important;
  }

  html[data-md-color-scheme="slate"] #lp-mobile-sheet #lp-side-panel details.lp-acc,
  body[data-md-color-scheme="slate"] #lp-mobile-sheet #lp-side-panel details.lp-acc{
    background:rgba(255,255,255,.035) !important;
    border-color:rgba(255,255,255,.10) !important;
    box-shadow:0 10px 24px rgba(0,0,0,.14) !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",ensureStyles,{once:true});}else{ensureStyles();}
document.addEventListener("DOMContentSwitch",ensureStyles);window.addEventListener("pageshow",ensureStyles);})();(function(){"use strict";const STYLE_ID="lp-mobile-sheet-focus-box-style-v5";function ensureStyles(){const oldIds=[STYLE_ID,"lp-mobile-sheet-focus-box-style-v4","lp-mobile-sheet-focus-box-style-v3","lp-mobile-sheet-focus-box-style-v2","lp-mobile-sheet-focus-box-style-v1"];oldIds.forEach((id)=>{const node=document.getElementById(id);if(node)node.remove();});const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
@media (max-width: 768px), (pointer: coarse) {
  /* Closed backdrop must not block taps or scroll. */
  #lp-mobile-backdrop{
    display: none !important;
    pointer-events: none !important;
    background: transparent !important;
    opacity: 1 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    touch-action: auto !important;
    -webkit-tap-highlight-color: transparent !important;
    -webkit-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
  }

  /* Open backdrop: click-lock only. Keep page content outside the sheet normal. */
  #lp-mobile-backdrop.lp-open{
    position: fixed !important;
    inset: 0 !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    display: block !important;
    pointer-events: auto !important;
    background: transparent !important;
    opacity: 1 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    touch-action: none !important;
    -webkit-tap-highlight-color: transparent !important;
    -webkit-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
  }

  /* Lift the card slightly so the lower shadow stays in the controllable viewport. */
  #lp-mobile-sheet{
    bottom: calc(max(env(safe-area-inset-bottom, 0px), var(--lp-mobile-vv-bottom-gap, 0px)) + 18px) !important;
    padding: 0 12px !important;
  }

  /* Continuous all-around shadow with no abrupt outer boundary. */
  #lp-mobile-sheet .lp-msheet{
    position: relative !important;
    border-width: 1.25px !important;
    box-shadow:
      0 0 0 1px rgba(255,255,255,.30),
      0 0 0 1.35px rgba(15,23,42,.08) !important;
    filter:
      drop-shadow(0 0 1px rgba(15,23,42,.05))
      drop-shadow(0 0 6px rgba(15,23,42,.05))
      drop-shadow(0 4px 12px rgba(15,23,42,.05))
      drop-shadow(0 10px 22px rgba(15,23,42,.045))
      drop-shadow(0 18px 34px rgba(15,23,42,.03)) !important;
    -webkit-filter:
      drop-shadow(0 0 1px rgba(15,23,42,.05))
      drop-shadow(0 0 6px rgba(15,23,42,.05))
      drop-shadow(0 4px 12px rgba(15,23,42,.05))
      drop-shadow(0 10px 22px rgba(15,23,42,.045))
      drop-shadow(0 18px 34px rgba(15,23,42,.03)) !important;
  }

  html[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet,
  body[data-md-color-scheme="default"] #lp-mobile-sheet .lp-msheet{
    background: rgba(255,255,255,.996) !important;
    border-color: rgba(27,31,36,.16) !important;
    box-shadow:
      0 0 0 1px rgba(255,255,255,.66),
      0 0 0 1.45px rgba(27,31,36,.10) !important;
    filter:
      drop-shadow(0 0 1px rgba(15,23,42,.045))
      drop-shadow(0 0 6px rgba(15,23,42,.045))
      drop-shadow(0 4px 12px rgba(15,23,42,.045))
      drop-shadow(0 10px 22px rgba(15,23,42,.04))
      drop-shadow(0 18px 34px rgba(15,23,42,.026)) !important;
    -webkit-filter:
      drop-shadow(0 0 1px rgba(15,23,42,.045))
      drop-shadow(0 0 6px rgba(15,23,42,.045))
      drop-shadow(0 4px 12px rgba(15,23,42,.045))
      drop-shadow(0 10px 22px rgba(15,23,42,.04))
      drop-shadow(0 18px 34px rgba(15,23,42,.026)) !important;
  }

  html[data-md-color-scheme="slate"] #lp-mobile-sheet .lp-msheet,
  body[data-md-color-scheme="slate"] #lp-mobile-sheet .lp-msheet{
    background: rgba(31,35,41,.985) !important;
    border-color: rgba(255,255,255,.16) !important;
    box-shadow:
      0 0 0 1px rgba(255,255,255,.06),
      0 0 0 1.3px rgba(255,255,255,.10) !important;
    filter:
      drop-shadow(0 0 1px rgba(0,0,0,.16))
      drop-shadow(0 0 6px rgba(0,0,0,.16))
      drop-shadow(0 4px 12px rgba(0,0,0,.18))
      drop-shadow(0 10px 22px rgba(0,0,0,.18))
      drop-shadow(0 18px 34px rgba(0,0,0,.13)) !important;
    -webkit-filter:
      drop-shadow(0 0 1px rgba(0,0,0,.16))
      drop-shadow(0 0 6px rgba(0,0,0,.16))
      drop-shadow(0 4px 12px rgba(0,0,0,.18))
      drop-shadow(0 10px 22px rgba(0,0,0,.18))
      drop-shadow(0 18px 34px rgba(0,0,0,.13)) !important;
  }

  /* The reused inner side-panel must not create a second glow layer. */
  #lp-mobile-sheet #lp-side-panel{
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",ensureStyles,{once:true});}else{ensureStyles();}
document.addEventListener("DOMContentSwitch",ensureStyles);window.addEventListener("pageshow",ensureStyles);})();(function(){const STYLE_ID='lp-route-mask-mobile-fixes-v8';function ensureStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
/* Route-map masking + mobile polish */
@media (max-width: 900px), (hover: none) and (pointer: coarse){
  /* Widen the route search field slightly so the placeholder does not clip. */
  #lp-h1sg-modal .lp-h1sg-tophead > .lp-h1sg-filter,
  #lp-h1sg-modal .lp-h1sg-filter{
    flex: 0 0 clamp(8.95rem, 39vw, 9.8rem) !important;
    width: clamp(8.95rem, 39vw, 9.8rem) !important;
    min-width: 8.95rem !important;
    max-width: 9.8rem !important;
  }
  #lp-h1sg-modal .lp-h1sg-filter input{
    width: 100% !important;
    min-width: 0 !important;
    padding-right: .78rem !important;
  }
  #lp-h1sg-modal .lp-h1sg-filter input::placeholder{
    white-space: nowrap !important;
    letter-spacing: 0 !important;
  }

  /* Mobile route-bar end pin: optically center it inside the small round slot. */
  article.md-content__inner .lp-h1-route-target--icon{
    width: 22px !important;
    min-width: 22px !important;
    height: 22px !important;
    min-height: 22px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    line-height: 0 !important;
  }
  article.md-content__inner .lp-h1-route-target--icon .lp-h1-route-target-icon{
    width: 20px !important;
    height: 20px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    line-height: 0 !important;
  }
  article.md-content__inner .lp-h1-route-target--icon .lp-h1-route-target-icon svg{
    width: 16px !important;
    height: 16px !important;
    display: block !important;
    transform: translateY(.7px) !important;
    transform-origin: 50% 50% !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function sync(){ensureStyles();}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',sync,{once:true});}else{sync();}
document.addEventListener('DOMContentSwitch',sync);window.addEventListener('resize',sync);})();(function(){"use strict";const STYLE_ID="lp-mobile-drawer-interop-fix-style-v2";const STATE={timers:[],raf:0,globalsBound:false,mo:null,};function isPhoneMobile(){try{if(!window.matchMedia)return false;const coarse=window.matchMedia("(pointer: coarse)").matches||window.matchMedia("(hover: none)").matches;if(!coarse)return false;const isTablet=window.matchMedia("(min-width: 768px)").matches&&window.matchMedia("(min-height: 700px)").matches;return!isTablet;}catch(_){return false;}}
function getDrawerToggle(){return(document.querySelector('input.md-toggle[data-md-toggle="drawer"]')||document.querySelector('input#__drawer')||document.querySelector('#__drawer')||document.querySelector('[data-md-toggle="drawer"]')||null);}
function isDrawerOpen(){try{const t=getDrawerToggle();return!!(t&&t.checked);}catch(_){return false;}}
function isSearchActive(){try{const html=document.documentElement;const body=document.body;const toggle=document.querySelector('input.md-toggle[data-md-toggle="search"], input#__search, #__search');return!!((toggle&&toggle.checked)||(html&&html.classList&&html.classList.contains('md-search--active'))||(body&&body.classList&&body.classList.contains('md-search--active')));}catch(_){return false;}}
function hasLearningPathModalLock(){try{const body=document.body;if(body&&body.classList&&body.classList.contains('lp-modal-open'))return true;return['lp-map-modal','lp-h1sg-modal','lp-gps-modal'].some((id)=>{const el=document.getElementById(id);return!!(el&&el.classList&&el.classList.contains('lp-open'));});}catch(_){return false;}}
function ensureStyles(){const old=document.getElementById(STYLE_ID);if(old)return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
@media (max-width: 768px), (pointer: coarse) {
  html.lp-drawer-open #lp-mobile-sheet,
  body.lp-drawer-open #lp-mobile-sheet,
  html.lp-drawer-open #lp-mobile-backdrop,
  body.lp-drawer-open #lp-mobile-backdrop{
    display: none !important;
    pointer-events: none !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function syncDrawerClass(){try{const open=!!(isPhoneMobile()&&isDrawerOpen());const html=document.documentElement;const body=document.body;if(html&&html.classList)html.classList.toggle('lp-drawer-open',open);if(body&&body.classList)body.classList.toggle('lp-drawer-open',open);}catch(_){}}
function syncViewportVars(){try{if(!isPhoneMobile())return;const root=document.documentElement;if(!root||!root.style)return;let vvHeight=window.innerHeight||0;let bottomGap=0;const vv=window.visualViewport;if(vv){vvHeight=Math.round(vv.height||vvHeight||0);bottomGap=Math.max(0,Math.round((window.innerHeight||0)-((vv.height||0)+(vv.offsetTop||0))));}
const heightText=`${Math.max(0, vvHeight)}px`;const gapText=`${Math.max(0, bottomGap)}px`;if(root.style.getPropertyValue('--lp-mobile-vv-height')!==heightText){root.style.setProperty('--lp-mobile-vv-height',heightText);}
if(root.style.getPropertyValue('--lp-mobile-vv-bottom-gap')!==gapText){root.style.setProperty('--lp-mobile-vv-bottom-gap',gapText);}}catch(_){}}
function clearInlineLockStyles(el){if(!el||!el.style)return;['overflow','overflow-x','overflow-y','position','top','left','right','bottom','height','width','touch-action','padding-right','margin-right','transform','transition','animation','-webkit-overflow-scrolling'].forEach((prop)=>{try{el.style.removeProperty(prop);}catch(_){}});}
function shouldClearAfterDrawerClose(){if(!isPhoneMobile())return false;if(isDrawerOpen())return false;if(isSearchActive())return false;if(hasLearningPathModalLock())return false;return true;}
function clearDrawerArtifactsNow(){try{syncDrawerClass();syncViewportVars();if(!shouldClearAfterDrawerClose())return;const html=document.documentElement;const body=document.body;const topSrc=(body&&body.style&&body.style.top)||(html&&html.style&&html.style.top)||'';const lockedY=/-?\d+px/.test(topSrc)?Math.abs(parseInt(topSrc,10)):0;document.querySelectorAll('[data-md-scrollfix]').forEach((el)=>{try{el.removeAttribute('data-md-scrollfix');}catch(_){}});try{html&&html.removeAttribute&&html.removeAttribute('data-md-scrollfix');}catch(_){}
try{body&&body.removeAttribute&&body.removeAttribute('data-md-scrollfix');}catch(_){}
['md-sidebar--active','md-nav--active','md-overlay--active','md-dialog--active'].forEach((cls)=>{try{html&&html.classList&&html.classList.remove(cls);}catch(_){}
try{body&&body.classList&&body.classList.remove(cls);}catch(_){}});[html,body].forEach(clearInlineLockStyles);document.querySelectorAll('.md-container, .md-main, .md-content, .md-grid, .md-page, .md-sidebar, .md-sidebar__inner, .md-sidebar__scrollwrap').forEach(clearInlineLockStyles);document.querySelectorAll('.md-overlay, .md-drawer__overlay, .md-sidebar__overlay').forEach((el)=>{if(!el||!el.style)return;try{el.style.setProperty('display','none','important');}catch(_){}
try{el.style.setProperty('pointer-events','none','important');}catch(_){}
try{el.style.setProperty('opacity','0','important');}catch(_){}
try{el.style.setProperty('visibility','hidden','important');}catch(_){}});if(lockedY>0){try{window.scrollTo(0,lockedY);}catch(_){}}
try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();}catch(_){}}catch(_){}}
function scheduleCleanupBurst(){STATE.timers.forEach((id)=>{try{clearTimeout(id);}catch(_){}});STATE.timers=[];if(STATE.raf){try{cancelAnimationFrame(STATE.raf);}catch(_){}
STATE.raf=0;}
const delays=[0,40,100,180,320,520,820,1200];delays.forEach((delay)=>{const id=window.setTimeout(()=>{clearDrawerArtifactsNow();},delay);STATE.timers.push(id);});STATE.raf=requestAnimationFrame(()=>{requestAnimationFrame(()=>{clearDrawerArtifactsNow();STATE.raf=0;});});}
function bindDrawerToggle(){const drawer=getDrawerToggle();if(!drawer||drawer.dataset.lpDrawerInteropBound==='1')return;drawer.dataset.lpDrawerInteropBound='1';drawer.addEventListener('change',()=>{syncDrawerClass();syncViewportVars();if(!drawer.checked)scheduleCleanupBurst();});}
function closeDrawerFromOutsideTap(e){try{if(!isPhoneMobile())return;if(!isDrawerOpen())return;if(!e)return;const tgt=e.target;if(!tgt||!tgt.closest)return;if(tgt.closest('.md-sidebar--primary'))return;if(tgt.closest('label[for="__drawer"], [data-md-toggle="drawer"], .md-header__button[for="__drawer"]'))return;if(tgt.closest('#lp-map-modal, #lp-gps-modal, #lp-h1sg-modal'))return;const drawer=getDrawerToggle();if(!drawer||!drawer.checked)return;if(e.cancelable)e.preventDefault();if(typeof e.stopPropagation==='function')e.stopPropagation();if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();drawer.checked=false;try{drawer.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}
syncDrawerClass();}catch(_){}}
function bindGlobals(){if(STATE.globalsBound)return;STATE.globalsBound=true;document.addEventListener('pointerdown',closeDrawerFromOutsideTap,{passive:false,capture:true});document.addEventListener('click',closeDrawerFromOutsideTap,{passive:false,capture:true});document.addEventListener('DOMContentSwitch',()=>{ensureStyles();bindDrawerToggle();syncDrawerClass();syncViewportVars();});}
function boot(){ensureStyles();bindDrawerToggle();bindGlobals();syncDrawerClass();syncViewportVars();}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot,{once:true});}else{boot();}})();(function(){"use strict";const STYLE_ID="lp-mobile-search-sheet-stability-fix-v1";function ensureStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
@media (max-width: 768px), (pointer: coarse) {
  /* Keep the learning-path card pinned to one visual position.
     Do not let keyboard / visualViewport gap lift it upward. */
  #lp-mobile-sheet {
    bottom: calc(env(safe-area-inset-bottom, 0px) + 18px) !important;
    transform: none !important;
  }

  /* When header search is open, keep the card visible under the blur instead of
     hiding it and then re-showing it a few frames later. */
  html.lp-mobile-search-active #lp-mobile-sheet,
  body.lp-mobile-search-active #lp-mobile-sheet {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 18px) !important;
    transform: none !important;
    animation: none !important;
  }

  html.lp-mobile-search-active #lp-mobile-sheet .lp-msheet,
  body.lp-mobile-search-active #lp-mobile-sheet .lp-msheet,
  html.lp-mobile-search-active #lp-mobile-sheet .lp-msheet-head,
  body.lp-mobile-search-active #lp-mobile-sheet .lp-msheet-head,
  html.lp-mobile-search-active #lp-mobile-sheet .lp-msheet-body,
  body.lp-mobile-search-active #lp-mobile-sheet .lp-msheet-body {
    transform: none !important;
    animation: none !important;
  }

  /* Search owns the full-screen blur. The learning-path backdrop should stay off. */
  html.lp-mobile-search-active #lp-mobile-backdrop,
  body.lp-mobile-search-active #lp-mobile-backdrop {
    display: none !important;
    pointer-events: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function enforceSheetBottom(){try{const root=document.getElementById("lp-mobile-sheet");if(!root||!root.style)return;const bottom="calc(env(safe-area-inset-bottom, 0px) + 18px)";if(root.style.getPropertyValue("bottom")!==bottom||root.style.getPropertyPriority("bottom")!=="important"){root.style.setProperty("bottom",bottom,"important");}
if(root.style.getPropertyValue("transform")!=="none"||root.style.getPropertyPriority("transform")!=="important"){root.style.setProperty("transform","none","important");}}catch(_){}}
function run(){ensureStyle();enforceSheetBottom();}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",run,{once:true});}else{run();}
window.addEventListener("resize",enforceSheetBottom,{passive:true});window.addEventListener("orientationchange",enforceSheetBottom,{passive:true});window.addEventListener("pageshow",enforceSheetBottom,{passive:true});document.addEventListener("DOMContentSwitch",run);try{const mo=new MutationObserver(()=>{enforceSheetBottom();});mo.observe(document.documentElement,{attributes:true,attributeFilter:["class","style"]});if(document.body)mo.observe(document.body,{attributes:true,attributeFilter:["class","style"]});window.addEventListener("DOMContentLoaded",()=>{try{const root=document.getElementById("lp-mobile-sheet");if(root)mo.observe(root,{attributes:true,attributeFilter:["class","style"]});}catch(_){}},{once:true});}catch(_){}})();(function(){const STYLE_ID='lp-mobile-map-header-offset-v2';const ROOT_VAR='--lp-mobile-top-stack-offset';let rafId=0;function isPhoneLike(){try{return!!(window.matchMedia&&(window.matchMedia('(max-width: 900px)').matches||window.matchMedia('(hover: none) and (pointer: coarse)').matches));}catch(_){return false;}}
function isVisible(el){if(!el)return false;try{const cs=window.getComputedStyle(el);if(!cs)return false;if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity||1)===0)return false;const r=el.getBoundingClientRect();return!!(r&&r.width>0&&r.height>0);}catch(_){return false;}}
function currentTopStackBottom(){if(!isPhoneLike())return 0;let bottom=0;const candidates=[document.querySelector('.md-header'),document.querySelector('.md-tabs')];for(const el of candidates){if(!isVisible(el))continue;try{const rect=el.getBoundingClientRect();const cs=window.getComputedStyle(el);const isPinned=cs.position==='fixed'||(cs.position==='sticky'&&rect.top<=2)||rect.top<=2;if(!isPinned)continue;bottom=Math.max(bottom,Math.round(rect.bottom));}catch(_){}}
return Math.max(0,bottom);}
function applyOffset(){try{const root=document.documentElement;if(!root)return;const offset=currentTopStackBottom();const text=`${offset}px`;if(root.style.getPropertyValue(ROOT_VAR)!==text)root.style.setProperty(ROOT_VAR,text);}catch(_){}}
function scheduleApply(){try{if(rafId)cancelAnimationFrame(rafId);}catch(_){}
rafId=requestAnimationFrame(()=>{rafId=0;applyOffset();});}
function ensureStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
@media (max-width: 900px), (hover: none) and (pointer: coarse){
  #lp-map-modal,
  #lp-h1sg-modal{
    top: var(${ROOT_VAR}, 0px) !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    height: auto !important;
    padding-top: 0 !important;
  }

  #lp-map-modal,
  #lp-map-modal .lp-mbox,
  #lp-map-modal .lp-mapstage,
  #lp-map-modal .lp-mapviewport,
  #lp-map-modal .lp-map-topbar,
  #lp-map-modal [data-lp-map-helper-panel],
  #lp-h1sg-modal,
  #lp-h1sg-modal .lp-mbox,
  #lp-h1sg-modal .lp-mapstage,
  #lp-h1sg-modal .lp-mapviewport,
  #lp-h1sg-modal .lp-h1sg-topbar,
  #lp-h1sg-modal [data-lp-map-helper-panel]{
    -webkit-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
  }

  #lp-h1sg-modal input,
  #lp-h1sg-modal textarea{
    -webkit-user-select: text !important;
    user-select: text !important;
    -webkit-touch-callout: default !important;
  }

  #lp-mobile-sheet .lp-msheet{
    display: flex !important;
    flex-direction: column !important;
    max-height: calc(var(--lp-mobile-vv-height, 100svh) - var(${ROOT_VAR}, 0px) - max(env(safe-area-inset-bottom, 0px), var(--lp-mobile-vv-bottom-gap, 0px)) - 30px) !important;
  }

  #lp-mobile-sheet .lp-msheet-body{
    flex: 1 1 auto !important;
    min-height: 0 !important;
  }

  #lp-mobile-sheet.lp-expanded .lp-msheet-body{
    max-height: none !important;
  }

  #lp-map-modal .lp-map-topbar,
  #lp-h1sg-modal .lp-h1sg-topbar{
    top: 10px !important;
  }

  #lp-map-modal .lp-close,
  #lp-map-modal .lp-full,
  #lp-map-modal .lp-mctrl,
  #lp-h1sg-modal .lp-close,
  #lp-h1sg-modal .lp-full{
    top: 12px !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function bindModalObserver(id){try{const modal=document.getElementById(id);if(!modal||modal.__lpHeaderOffsetObserverBound)return;modal.__lpHeaderOffsetObserverBound=true;const mo=new MutationObserver(()=>scheduleApply());mo.observe(modal,{attributes:true,attributeFilter:['class','style']});}catch(_){}}
function run(){ensureStyle();applyOffset();bindModalObserver('lp-map-modal');bindModalObserver('lp-h1sg-modal');}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run,{once:true});}else{run();}
window.addEventListener('resize',scheduleApply,{passive:true});window.addEventListener('orientationchange',scheduleApply,{passive:true});window.addEventListener('pageshow',scheduleApply,{passive:true});document.addEventListener('DOMContentSwitch',run);try{const mo=new MutationObserver(()=>run());if(document.body){mo.observe(document.body,{childList:true});}else{window.addEventListener('DOMContentLoaded',()=>{try{if(document.body)mo.observe(document.body,{childList:true});}catch(_){}},{once:true});}}catch(_){}})();(function(){"use strict";const STYLE_ID="lp-ipad-only-map-ui-v4";const BOUND_FLAG="__lpIpadOnlyMapUiV4Bound";let raf=0;function isIPadLike(){try{const nav=navigator||{};const ua=String(nav.userAgent||"");const platform=String(nav.platform||"");const vendor=String(nav.vendor||"");const points=Number(nav.maxTouchPoints||0);if(/\biPad\b/i.test(ua))return true;if(/Apple/i.test(vendor)&&/Mac/i.test(platform)&&points>1)return true;}catch(_){}
return false;}
if(!isIPadLike())return;function ensureStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
/* Only active when JS detects iPad/iPadOS and adds .lp-ipad-map-ui. */
#lp-map-modal.lp-ipad-map-ui.lp-open{
  align-items:center !important;
  justify-content:center !important;
}
#lp-map-modal.lp-ipad-map-ui{
  background:rgba(0,0,0,.46) !important;
  backdrop-filter:blur(6px) !important;
  -webkit-backdrop-filter:blur(6px) !important;
}
#lp-map-modal.lp-ipad-map-ui .lp-mbox{
  width:min(980px, calc(100vw - 2rem)) !important;
  height:min(720px, calc(100vh - 2rem)) !important;
  border-radius:18px !important;
  overflow:hidden !important;
}
#lp-map-modal.lp-ipad-map-ui.lp-full .lp-mbox{
  width:100vw !important;
  height:100vh !important;
  border-radius:0 !important;
}
#lp-map-modal.lp-ipad-map-ui [data-lp-fullscreen]{
  display:none !important;
}

/* PC-style zoom dock, not phone full-width dock. */
#lp-map-modal.lp-ipad-map-ui .lp-mbox > .lp-mzoom,
#lp-map-modal.lp-ipad-map-ui .lp-mbox > .lp-mzoom[data-lp-zoom-dock="outer"]{
  position:absolute !important;
  left:50% !important;
  right:auto !important;
  transform:translateX(-50%) !important;
  bottom:18px !important;
  width:auto !important;
  max-width:calc(100% - 32px) !important;
  min-width:0 !important;
  display:flex !important;
  flex-direction:column !important;
  gap:10px !important;
  z-index:10 !important;
  pointer-events:none !important;
}
#lp-map-modal.lp-ipad-map-ui .lp-mapstage > .lp-mzoom[data-lp-zoom-dock="ghost"]{
  display:none !important;
}
#lp-map-modal.lp-ipad-map-ui .lp-mzoom .lp-ctrl-group.lp-zoombar{
  pointer-events:auto !important;
  box-sizing:border-box !important;
  display:grid !important;
  grid-template-columns:44px minmax(240px, 1fr) 4.2rem 44px auto !important;
  align-items:center !important;
  column-gap:10px !important;
  row-gap:0 !important;
  width:min(760px, calc(100vw - 64px)) !important;
  max-width:min(760px, calc(100vw - 64px)) !important;
  min-width:0 !important;
  justify-content:center !important;
  padding:8px 12px !important;
  border-radius:18px !important;
  border:1px solid rgba(255,255,255,.12) !important;
  background:rgba(10,14,22,.84) !important;
  box-shadow:0 10px 24px rgba(0,0,0,.24) !important;
  backdrop-filter:blur(12px) !important;
  -webkit-backdrop-filter:blur(12px) !important;
}
#lp-map-modal.lp-ipad-map-ui [data-zoom-dec]{ grid-column:1 !important; }
#lp-map-modal.lp-ipad-map-ui input.lp-zoomrange{ grid-column:2 !important; }
#lp-map-modal.lp-ipad-map-ui [data-zoom-label]{ grid-column:3 !important; }
#lp-map-modal.lp-ipad-map-ui [data-zoom-inc]{ grid-column:4 !important; }
#lp-map-modal.lp-ipad-map-ui [data-zoom-reset]{ grid-column:5 !important; }
#lp-map-modal.lp-ipad-map-ui [data-zoom-dec],
#lp-map-modal.lp-ipad-map-ui [data-zoom-inc],
#lp-map-modal.lp-ipad-map-ui [data-zoom-reset],
#lp-map-modal.lp-ipad-map-ui [data-zoom-label]{
  display:flex !important;
  visibility:visible !important;
  opacity:1 !important;
  position:relative !important;
  transform:none !important;
  align-self:center !important;
  justify-self:stretch !important;
  align-items:center !important;
  justify-content:center !important;
}
#lp-map-modal.lp-ipad-map-ui [data-zoom-dec],
#lp-map-modal.lp-ipad-map-ui [data-zoom-inc]{
  width:44px !important;
  min-width:44px !important;
  max-width:44px !important;
  height:40px !important;
  min-height:40px !important;
  padding:0 !important;
  border-radius:999px !important;
}
#lp-map-modal.lp-ipad-map-ui [data-zoom-reset]{
  width:auto !important;
  min-width:auto !important;
  max-width:none !important;
  height:40px !important;
  min-height:40px !important;
  padding:0 18px !important;
  border-radius:999px !important;
  white-space:nowrap !important;
}
#lp-map-modal.lp-ipad-map-ui [data-zoom-label]{
  width:4.2rem !important;
  min-width:4.2rem !important;
  max-width:4.2rem !important;
  height:40px !important;
  text-align:center !important;
  font-weight:800 !important;
  color:rgba(255,255,255,.90) !important;
}
#lp-map-modal.lp-ipad-map-ui input.lp-zoomrange{
  display:block !important;
  visibility:visible !important;
  opacity:1 !important;
  position:relative !important;
  transform:none !important;
  justify-self:stretch !important;
  align-self:center !important;
  width:100% !important;
  min-width:0 !important;
  max-width:none !important;
  height:30px !important;
  flex:none !important;
  margin:0 !important;
  padding:0 !important;
  background:transparent !important;
  border:none !important;
  outline:none !important;
  box-shadow:none !important;
  -webkit-appearance:none !important;
  appearance:none !important;
}
html[data-md-color-scheme="default"] #lp-map-modal.lp-ipad-map-ui .lp-mzoom .lp-ctrl-group.lp-zoombar,
body[data-md-color-scheme="default"] #lp-map-modal.lp-ipad-map-ui .lp-mzoom .lp-ctrl-group.lp-zoombar{
  border-color:rgba(15,23,42,.12) !important;
  background:rgba(255,255,255,.96) !important;
  box-shadow:0 10px 22px rgba(15,23,42,.12) !important;
}
html[data-md-color-scheme="default"] #lp-map-modal.lp-ipad-map-ui [data-zoom-label],
body[data-md-color-scheme="default"] #lp-map-modal.lp-ipad-map-ui [data-zoom-label]{
  color:rgba(15,23,42,.90) !important;
}

/* Preserve fog/blur while dragging. We do NOT hide .lp-fog-layer on iPad. */
#lp-map-modal.lp-ipad-map-ui.lp-mobile-gesturing,
#lp-map-modal.lp-ipad-map-ui.lp-slider-zooming{
  background:rgba(0,0,0,.46) !important;
  backdrop-filter:blur(6px) !important;
  -webkit-backdrop-filter:blur(6px) !important;
}
#lp-map-modal.lp-ipad-map-ui.lp-mobile-gesturing .lp-fog-layer,
#lp-map-modal.lp-ipad-map-ui.lp-slider-zooming .lp-fog-layer{
  display:block !important;
  opacity:.56 !important;
  filter:blur(14px) saturate(1.01) !important;
  -webkit-filter:blur(14px) saturate(1.01) !important;
}
`;(document.head||document.documentElement).appendChild(st);}
function sync(){ensureStyle();const ipad=isIPadLike();try{const modal=document.getElementById("lp-map-modal");if(!modal||!modal.classList)return;modal.classList.toggle("lp-ipad-map-ui",ipad);if(ipad){modal.classList.remove("lp-phone-layout","lp-phone-map");}}catch(_){}}
function scheduleSync(){if(raf)return;const cb=function(){raf=0;sync();};raf=window.requestAnimationFrame?window.requestAnimationFrame(cb):window.setTimeout(cb,16);}
function bind(){if(window[BOUND_FLAG])return;window[BOUND_FLAG]=true;["resize","orientationchange","pageshow"].forEach(function(ev){try{window.addEventListener(ev,scheduleSync,{passive:true});}catch(_){}});try{document.addEventListener("DOMContentSwitch",scheduleSync);}catch(_){}
try{const mo=new MutationObserver((records)=>{for(const record of records||[]){for(const node of(record&&record.addedNodes)||[]){if(!node||node.nodeType!==1)continue;try{if(node.id==="lp-map-modal"||(node.querySelector&&node.querySelector("#lp-map-modal"))){scheduleSync();return;}}catch(_){}}}});const start=function(){try{if(document.body)mo.observe(document.body,{childList:true,subtree:true});}catch(_){}};if(document.body)start();else document.addEventListener("DOMContentLoaded",start,{once:true});}catch(_){}}
ensureStyle();bind();if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",scheduleSync,{once:true});else scheduleSync();})();(function(){"use strict";const STYLE_ID="lp-final-panel-drawer-restore-v5";const COVER_ID="lp-drawer-dim-cover";const OLD_STYLE_IDS=["lp-final-panel-drawer-restore-v1","lp-final-panel-drawer-restore-v2","lp-final-panel-drawer-restore-v3","lp-final-panel-drawer-restore-v4"];const STATE={timers:[],raf:0,bound:false,coverBound:false};function isPhoneOrMobileDrawerViewport(){try{if(!window.matchMedia)return false;return!!(window.matchMedia("(max-width: 900px)").matches||window.matchMedia("(pointer: coarse)").matches||window.matchMedia("(hover: none)").matches);}catch(_){return(window.innerWidth||0)<=900;}}
function getDrawerToggle(){return(document.querySelector('input.md-toggle[data-md-toggle="drawer"]')||document.querySelector('input#__drawer')||document.querySelector('#__drawer')||document.querySelector('[data-md-toggle="drawer"]')||null);}
function isDrawerOpen(){try{const t=getDrawerToggle();if(t&&typeof t.checked==="boolean")return!!t.checked;const html=document.documentElement;const body=document.body;return!!((html&&html.classList&&(html.classList.contains("md-sidebar--active")||html.classList.contains("md-nav--active")))||(body&&body.classList&&(body.classList.contains("md-sidebar--active")||body.classList.contains("md-nav--active"))));}catch(_){return false;}}
function isSearchActive(){try{const html=document.documentElement;const body=document.body;const toggle=document.querySelector('input.md-toggle[data-md-toggle="search"], input#__search, #__search');return!!((toggle&&toggle.checked)||(html&&html.classList&&html.classList.contains("md-search--active"))||(body&&body.classList&&body.classList.contains("md-search--active")));}catch(_){return false;}}
function hasLpModalLock(){try{const body=document.body;if(body&&body.classList&&body.classList.contains("lp-modal-open"))return true;return["lp-map-modal","lp-h1sg-modal","lp-gps-modal"].some((id)=>{const el=document.getElementById(id);return!!(el&&el.classList&&el.classList.contains("lp-open"));});}catch(_){return false;}}
function ensureStyle(){OLD_STYLE_IDS.forEach((id)=>{const old=document.getElementById(id);if(old&&old.parentNode){try{old.parentNode.removeChild(old);}catch(_){}}});let st=document.getElementById(STYLE_ID);if(st)return;st=document.createElement("style");st.id=STYLE_ID;(document.head||document.documentElement).appendChild(st);st.textContent=`
@media (min-width: 901px){
  .md-sidebar--secondary.lp-secondary-host-active,
  .lp-secondary-fallback{
    display:block !important;
    visibility:visible !important;
    opacity:1 !important;
    width:15.5rem !important;
    flex:0 0 15.5rem !important;
    max-width:15.5rem !important;
    order:3 !important;
    box-sizing:border-box !important;
  }
  .md-sidebar--secondary.lp-secondary-host-active .md-nav--secondary{ display:none !important; }
  .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__inner,
  .lp-secondary-fallback .md-sidebar__inner{ display:block !important; visibility:visible !important; }
  .lp-secondary-fallback{ position:relative !important; padding:0 .6rem !important; }
  .lp-secondary-fallback .md-sidebar__scrollwrap{ height:auto !important; max-height:none !important; overflow:visible !important; }
  .lp-secondary-fallback .md-sidebar__inner{
    position:sticky !important;
    top:4.8rem !important;
    max-height:calc(100vh - 5.2rem) !important;
    overflow:auto !important;
    scrollbar-gutter:stable;
  }
}
@media (max-width: 900px){ .lp-secondary-fallback{ display:none !important; } }

@media (max-width: 900px), (pointer: coarse){
  html.lp-drawer-open #lp-mobile-sheet,
  body.lp-drawer-open #lp-mobile-sheet,
  html.lp-drawer-open #lp-mobile-backdrop,
  body.lp-drawer-open #lp-mobile-backdrop{
    display:none !important;
    visibility:hidden !important;
    pointer-events:none !important;
    opacity:0 !important;
  }

  html.lp-drawer-open,
  body.lp-drawer-open,
  html.lp-drawer-open .md-container,
  html.lp-drawer-open .md-main,
  html.lp-drawer-open .md-page,
  body.lp-drawer-open .md-container,
  body.lp-drawer-open .md-main,
  body.lp-drawer-open .md-page{
    background:var(--md-default-bg-color) !important;
  }

  /* Kill old pseudo-element based safe-area patches. They caused the bottom white/blank strip. */
  html.lp-drawer-open::before,
  html.lp-drawer-open::after,
  body.lp-drawer-open::before,
  body.lp-drawer-open::after{
    content:none !important;
    display:none !important;
  }

  /* Do not rely on Material's own overlay; it can stop above the iOS bottom bar. */
  html.lp-drawer-open .md-overlay,
  html.lp-drawer-open .md-drawer__overlay,
  html.lp-drawer-open .md-sidebar__overlay,
  body.lp-drawer-open .md-overlay,
  body.lp-drawer-open .md-drawer__overlay,
  body.lp-drawer-open .md-sidebar__overlay{
    display:none !important;
    visibility:hidden !important;
    opacity:0 !important;
    pointer-events:none !important;
  }

  html.lp-drawer-open .md-header,
  html.lp-drawer-open .md-tabs,
  body.lp-drawer-open .md-header,
  body.lp-drawer-open .md-tabs{
    z-index:2147482600 !important;
    isolation:isolate !important;
  }

  html.lp-drawer-open .md-sidebar--primary,
  body.lp-drawer-open .md-sidebar--primary{
    z-index:2147482500 !important;
    background:var(--md-default-bg-color) !important;
    height:var(--lp-drawer-sidebar-height, calc(100dvh + 96px)) !important;
    min-height:var(--lp-drawer-sidebar-height, calc(100dvh + 96px)) !important;
    max-height:none !important;
    padding-bottom:max(24px, env(safe-area-inset-bottom, 0px), var(--lp-mobile-vv-bottom-gap, 0px)) !important;
    box-sizing:border-box !important;
  }

  html.lp-drawer-open .md-sidebar--primary .md-sidebar__scrollwrap,
  html.lp-drawer-open .md-sidebar--primary .md-sidebar__inner,
  body.lp-drawer-open .md-sidebar--primary .md-sidebar__scrollwrap,
  body.lp-drawer-open .md-sidebar--primary .md-sidebar__inner{
    background:var(--md-default-bg-color) !important;
    min-height:var(--lp-drawer-sidebar-height, calc(100dvh + 96px)) !important;
    padding-bottom:max(24px, env(safe-area-inset-bottom, 0px), var(--lp-mobile-vv-bottom-gap, 0px)) !important;
    box-sizing:border-box !important;
  }

  #${COVER_ID}{
    position:fixed !important;
    display:none !important;
    left:var(--lp-drawer-cover-left, 0px) !important;
    top:var(--lp-drawer-cover-top, 0px) !important;
    width:var(--lp-drawer-cover-width, 100vw) !important;
    height:var(--lp-drawer-cover-height, calc(100dvh + 128px)) !important;
    min-height:calc(100dvh + 96px) !important;
    background:rgba(0,0,0,.55) !important;
    z-index:2147482400 !important;
    opacity:1 !important;
    visibility:visible !important;
    pointer-events:auto !important;
    touch-action:none !important;
    -webkit-tap-highlight-color:transparent !important;
    border:0 !important;
    margin:0 !important;
    padding:0 !important;
    transform:none !important;
    backdrop-filter:none !important;
    -webkit-backdrop-filter:none !important;
  }

  html.lp-drawer-open #${COVER_ID},
  body.lp-drawer-open #${COVER_ID},
  #${COVER_ID}.is-open{
    display:block !important;
  }
}
`;}
function ensureCover(){let cover=document.getElementById(COVER_ID);if(!cover){cover=document.createElement("div");cover.id=COVER_ID;cover.setAttribute("aria-hidden","true");cover.hidden=true;(document.body||document.documentElement).appendChild(cover);}
if(!STATE.coverBound){STATE.coverBound=true;const close=function(e){try{if(!isPhoneOrMobileDrawerViewport()||!isDrawerOpen())return;if(e&&e.cancelable)e.preventDefault();if(e&&typeof e.stopPropagation==="function")e.stopPropagation();if(e&&typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();closeDrawerAndCleanup();}catch(_){}};cover.addEventListener("pointerdown",close,{passive:false,capture:true});cover.addEventListener("touchstart",close,{passive:false,capture:true});cover.addEventListener("click",close,{passive:false,capture:true});}
return cover;}
function setCoverOpen(open){try{const cover=ensureCover();const state=open?"1":"0";if(cover.dataset.lpOpenState===state)return;cover.dataset.lpOpenState=state;cover.hidden=!open;cover.classList.toggle("is-open",!!open);cover.style.setProperty("display",open?"block":"none","important");cover.style.setProperty("pointer-events",open?"auto":"none","important");cover.style.setProperty("visibility",open?"visible":"hidden","important");cover.style.setProperty("opacity",open?"1":"0","important");}catch(_){}}
function visibleBottomOfTopChrome(){let bottom=0;[".md-header",".md-tabs","#current-course-bar"].forEach((sel)=>{try{const el=document.querySelector(sel);if(!el||!el.getBoundingClientRect)return;const cs=window.getComputedStyle(el);if(!cs||cs.display==="none"||cs.visibility==="hidden")return;const r=el.getBoundingClientRect();if(r&&r.width>0&&r.height>0)bottom=Math.max(bottom,Math.round(r.bottom||0));}catch(_){}});return Math.max(0,bottom);}
function syncViewportVars(){try{const root=document.documentElement;if(!root||!root.style)return;const de=document.documentElement;const vv=window.visualViewport;const winW=Math.max(0,Math.round(window.innerWidth||de.clientWidth||0));const winH=Math.max(0,Math.round(window.innerHeight||de.clientHeight||0));const vvW=Math.max(0,Math.round((vv&&vv.width)||winW||0));const vvH=Math.max(0,Math.round((vv&&vv.height)||winH||0));const vvTop=Math.max(0,Math.round((vv&&vv.offsetTop)||0));const bottomGap=vv?Math.max(0,Math.round((window.innerHeight||winH||0)-((vv.height||0)+(vv.offsetTop||0)))):0;const layoutH=Math.max(winH,vvH+vvTop+bottomGap,de.clientHeight||0);const pairs=[["--lp-mobile-vv-width",vvW+"px"],["--lp-mobile-vv-height",vvH+"px"],["--lp-mobile-layout-height",layoutH+"px"],["--lp-mobile-vv-bottom-gap",bottomGap+"px"],];for(const[name,value]of pairs){if(root.style.getPropertyValue(name)!==value)root.style.setProperty(name,value);}}catch(_){}}
function syncDrawerCoverMetrics(){try{syncViewportVars();const root=document.documentElement;if(!root||!root.style)return;const de=document.documentElement;const vv=window.visualViewport;const winW=Math.max(0,Math.round(window.innerWidth||de.clientWidth||0));const winH=Math.max(0,Math.round(window.innerHeight||de.clientHeight||0));const vvW=Math.max(0,Math.round((vv&&vv.width)||winW||0));const vvH=Math.max(0,Math.round((vv&&vv.height)||winH||0));const vvTop=Math.max(0,Math.round((vv&&vv.offsetTop)||0));const bottomGap=vv?Math.max(0,Math.round((window.innerHeight||winH||0)-((vv.height||0)+(vv.offsetTop||0)))):0;const viewportW=Math.max(winW,vvW,de.clientWidth||0);const viewportH=Math.max(winH,vvH+vvTop+bottomGap,de.clientHeight||0);const sidebar=document.querySelector(".md-sidebar--primary");let top=visibleBottomOfTopChrome();let left=0;if(sidebar&&sidebar.getBoundingClientRect){const r=sidebar.getBoundingClientRect();if(r&&r.width>0&&r.height>0){top=Math.max(0,Math.round(r.top||top||0));left=Math.max(0,Math.round(r.right||r.width||0));}}
if(!left||left<24){const fallback=Math.round(Math.min(viewportW*0.72,Math.max(280,viewportW*0.62)));left=Math.max(0,Math.min(viewportW,fallback));}
top=Math.max(0,Math.min(top,Math.max(0,viewportH-1)));left=Math.max(0,Math.min(left,viewportW));const extra=Math.max(96,bottomGap+64);const coverW=Math.max(0,viewportW-left);const coverH=Math.max(0,viewportH-top+extra);const sidebarH=Math.max(0,viewportH-top+extra);root.style.setProperty("--lp-drawer-cover-left",left+"px");root.style.setProperty("--lp-drawer-cover-top",top+"px");root.style.setProperty("--lp-drawer-cover-width",coverW+"px");root.style.setProperty("--lp-drawer-cover-height",coverH+"px");root.style.setProperty("--lp-drawer-sidebar-height",sidebarH+"px");}catch(_){}}
function syncDrawerClass(){try{ensureStyle();const open=!!(isPhoneOrMobileDrawerViewport()&&isDrawerOpen());const html=document.documentElement;const body=document.body;if(html&&html.classList)html.classList.toggle("lp-drawer-open",open);if(body&&body.classList)body.classList.toggle("lp-drawer-open",open);if(open){syncDrawerCoverMetrics();setCoverOpen(true);try{const api=window.MkLP||{};if(typeof api.lpSetMobileSheetExpandedImmediate==="function")api.lpSetMobileSheetExpandedImmediate(false);if(typeof api.lpSetMobileSheetScrollGuards==="function")api.lpSetMobileSheetScrollGuards(false);}catch(_){}}else{setCoverOpen(false);}}catch(_){}}
function clearInlineLockStyles(el){if(!el||!el.style)return;["overflow","overflow-x","overflow-y","position","top","left","right","bottom","inset","height","min-height","max-height","width","min-width","max-width","touch-action","overscroll-behavior","overscroll-behavior-y","padding-right","padding-bottom","margin-right","margin-bottom","transform","transition","animation","-webkit-overflow-scrolling"].forEach((prop)=>{try{el.style.removeProperty(prop);}catch(_){}});}
function clearDrawerVars(){try{const root=document.documentElement;if(!root||!root.style)return;["--lp-drawer-cover-left","--lp-drawer-cover-top","--lp-drawer-cover-width","--lp-drawer-cover-height","--lp-drawer-sidebar-height"].forEach((prop)=>{try{root.style.removeProperty(prop);}catch(_){}});}catch(_){}}
function shouldClearAfterClose(){if(!isPhoneOrMobileDrawerViewport())return false;if(isDrawerOpen())return false;if(isSearchActive())return false;if(hasLpModalLock())return false;return true;}
function clearDrawerArtifactsNow(){try{syncViewportVars();syncDrawerClass();if(!shouldClearAfterClose())return;const html=document.documentElement;const body=document.body;const topSrc=(body&&body.style&&body.style.top)||(html&&html.style&&html.style.top)||"";const lockedY=/-?\d+px/.test(topSrc)?Math.abs(parseInt(topSrc,10)):0;setCoverOpen(false);clearDrawerVars();document.querySelectorAll("[data-md-scrollfix]").forEach((el)=>{try{el.removeAttribute("data-md-scrollfix");}catch(_){}});try{html&&html.removeAttribute&&html.removeAttribute("data-md-scrollfix");}catch(_){}
try{body&&body.removeAttribute&&body.removeAttribute("data-md-scrollfix");}catch(_){}
["lp-drawer-open","md-sidebar--active","md-nav--active","md-overlay--active","md-dialog--active"].forEach((cls)=>{try{html&&html.classList&&html.classList.remove(cls);}catch(_){}
try{body&&body.classList&&body.classList.remove(cls);}catch(_){}});[html,body].forEach(clearInlineLockStyles);document.querySelectorAll(".md-container, .md-main, .md-content, .md-grid, .md-page, .md-sidebar, .md-sidebar__inner, .md-sidebar__scrollwrap").forEach(clearInlineLockStyles);document.querySelectorAll(".md-overlay, .md-drawer__overlay, .md-sidebar__overlay").forEach((el)=>{if(!el||!el.style)return;try{el.style.setProperty("display","none","important");}catch(_){}
try{el.style.setProperty("pointer-events","none","important");}catch(_){}
try{el.style.setProperty("opacity","0","important");}catch(_){}
try{el.style.setProperty("visibility","hidden","important");}catch(_){}});try{const sheet=document.getElementById("lp-mobile-sheet");if(sheet&&sheet.style){["display","visibility","opacity","pointer-events"].forEach((prop)=>{try{sheet.style.removeProperty(prop);}catch(_){}});}}catch(_){}
if(lockedY>0){try{window.scrollTo(0,lockedY);}catch(_){}}}catch(_){}}
function clearTimers(){STATE.timers.forEach((id)=>{try{clearTimeout(id);}catch(_){}});STATE.timers=[];if(STATE.raf){try{cancelAnimationFrame(STATE.raf);}catch(_){}STATE.raf=0;}}
function openSyncBurst(){clearTimers();[0,16,50,100,180,320,520].forEach((delay)=>{const id=setTimeout(()=>{if(!isDrawerOpen())return;syncViewportVars();syncDrawerClass();syncDrawerCoverMetrics();},delay);STATE.timers.push(id);});STATE.raf=requestAnimationFrame(()=>{requestAnimationFrame(()=>{STATE.raf=0;if(!isDrawerOpen())return;syncViewportVars();syncDrawerClass();syncDrawerCoverMetrics();});});}
function cleanupBurst(){clearTimers();[0,40,100,180,320,520,820,1200,1700].forEach((delay)=>{const id=setTimeout(clearDrawerArtifactsNow,delay);STATE.timers.push(id);});STATE.raf=requestAnimationFrame(()=>{requestAnimationFrame(()=>{STATE.raf=0;clearDrawerArtifactsNow();});});}
function closeDrawerAndCleanup(){try{const drawer=getDrawerToggle();if(drawer&&typeof drawer.checked==="boolean"&&drawer.checked){drawer.checked=false;try{drawer.dispatchEvent(new Event("change",{bubbles:true}));}catch(_){}}
syncDrawerClass();cleanupBurst();}catch(_){}}
function bindDrawer(){const drawer=getDrawerToggle();if(!drawer||drawer.dataset.lpFinalDrawerRestoreBound==="v5")return;drawer.dataset.lpFinalDrawerRestoreBound="v5";drawer.addEventListener("change",()=>{ensureStyle();syncViewportVars();syncDrawerClass();if(drawer.checked)openSyncBurst();else cleanupBurst();});}
function closeDrawerFromOutsideTap(e){try{if(!isPhoneOrMobileDrawerViewport())return;if(!isDrawerOpen())return;const tgt=e&&e.target;if(!tgt||!tgt.closest)return;if(tgt.closest(".md-sidebar--primary"))return;if(tgt.closest('label[for="__drawer"], [data-md-toggle="drawer"], .md-header__button[for="__drawer"]'))return;if(tgt.closest("#lp-map-modal, #lp-gps-modal, #lp-h1sg-modal"))return;if(e.cancelable)e.preventDefault();if(typeof e.stopPropagation==="function")e.stopPropagation();if(typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();closeDrawerAndCleanup();}catch(_){}}
function boot(){ensureStyle();ensureCover();syncViewportVars();syncDrawerClass();bindDrawer();if(isDrawerOpen())openSyncBurst();if(!STATE.bound){STATE.bound=true;document.addEventListener("pointerdown",closeDrawerFromOutsideTap,{passive:false,capture:true});document.addEventListener("click",closeDrawerFromOutsideTap,{passive:false,capture:true});["resize","orientationchange","pageshow"].forEach((ev)=>window.addEventListener(ev,()=>{syncViewportVars();syncDrawerClass();if(isDrawerOpen())syncDrawerCoverMetrics();},{passive:true}));try{if(window.visualViewport){window.visualViewport.addEventListener("resize",()=>{syncViewportVars();syncDrawerClass();if(isDrawerOpen())syncDrawerCoverMetrics();},{passive:true});window.visualViewport.addEventListener("scroll",()=>{if(!isDrawerOpen())return;syncViewportVars();syncDrawerClass();syncDrawerCoverMetrics();},{passive:true});}}catch(_){}
document.addEventListener("DOMContentSwitch",boot);}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();})();(function(){"use strict";const STYLE_ID="lp-desktop-map-chrome-restore-v1";const OFFSET_VAR="--lp-desktop-map-top-offset";function isDesktopMapViewport(){try{if(!window.matchMedia)return window.innerWidth>=901;return window.matchMedia("(min-width: 901px)").matches;}catch(_){return(window.innerWidth||0)>=901;}}
function isVisible(el){if(!el||!el.getBoundingClientRect)return false;try{const cs=window.getComputedStyle(el);if(!cs||cs.display==="none"||cs.visibility==="hidden"||Number(cs.opacity||1)===0)return false;const r=el.getBoundingClientRect();return!!(r&&r.width>0&&r.height>0);}catch(_){return false;}}
function desktopTopStackBottom(){if(!isDesktopMapViewport())return 0;let bottom=0;const candidates=[document.querySelector(".md-header"),document.querySelector(".md-tabs")];for(const el of candidates){if(!isVisible(el))continue;try{const rect=el.getBoundingClientRect();if(!rect||rect.bottom<=0)continue;const cs=window.getComputedStyle(el);const pinned=cs.position==="fixed"||cs.position==="sticky"||rect.top<=2;if(!pinned)continue;bottom=Math.max(bottom,Math.round(rect.bottom));}catch(_){}}
return Math.max(0,bottom);}
function hasOpenDesktopMap(){if(!isDesktopMapViewport())return false;try{return!!document.querySelector("#lp-map-modal.lp-open, #lp-h1sg-modal.lp-open");}catch(_){return false;}}
function syncOffsetNow(){try{if(!hasOpenDesktopMap())return;const root=document.documentElement;if(!root)return;const text=`${desktopTopStackBottom()}px`;if(root.style.getPropertyValue(OFFSET_VAR)!==text)root.style.setProperty(OFFSET_VAR,text);}catch(_){}}
let __lpOffsetRaf=0;function syncOffset(){if(__lpOffsetRaf)return;__lpOffsetRaf=requestAnimationFrame(()=>{__lpOffsetRaf=0;syncOffsetNow();});}
function ensureStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
@media (min-width: 901px){
  #lp-map-modal,
  #lp-h1sg-modal{
    position:fixed !important;
    inset:0 !important;
    z-index:2147483000 !important;
  }

  #lp-map-modal.lp-open,
  #lp-h1sg-modal.lp-open{
    display:flex !important;
    z-index:2147483000 !important;
  }

  #lp-map-modal .lp-mbox,
  #lp-h1sg-modal .lp-mbox{
    position:relative !important;
  }

  #lp-map-modal .lp-map-topbar,
  #lp-h1sg-modal .lp-h1sg-topbar{
    position:absolute !important;
    left:16px !important;
    right:auto !important;
    top:calc(var(${OFFSET_VAR}, 0px) + env(safe-area-inset-top, 0px) + 14px) !important;
    z-index:2147483002 !important;
    display:flex !important;
    visibility:visible !important;
    opacity:1 !important;
    transform:none !important;
    pointer-events:none !important;
  }

  #lp-map-modal .lp-map-toprow,
  #lp-map-modal .lp-map-tabs,
  #lp-map-modal .lp-map-tab,
  #lp-map-modal .lp-map-tipbtn,
  #lp-h1sg-modal .lp-h1sg-tophead,
  #lp-h1sg-modal .lp-h1sg-topbar-row,
  #lp-h1sg-modal .lp-h1sg-tabs,
  #lp-h1sg-modal .lp-h1sg-tab,
  #lp-h1sg-modal .lp-h1sg-tipbtn,
  #lp-h1sg-modal .lp-h1sg-filter{
    visibility:visible !important;
    opacity:1 !important;
    transform:none !important;
    pointer-events:auto !important;
  }

  #lp-map-modal .lp-map-toprow,
  #lp-map-modal .lp-map-tabs,
  #lp-h1sg-modal .lp-h1sg-tophead,
  #lp-h1sg-modal .lp-h1sg-tabs{
    display:flex !important;
  }

  #lp-map-modal .lp-map-tipbtn,
  #lp-h1sg-modal .lp-h1sg-tipbtn,
  #lp-h1sg-modal .lp-h1sg-filter{
    display:inline-flex !important;
  }

  #lp-map-modal .lp-close,
  #lp-h1sg-modal .lp-close{
    position:absolute !important;
    top:calc(var(${OFFSET_VAR}, 0px) + env(safe-area-inset-top, 0px) + 12px) !important;
    right:calc(env(safe-area-inset-right, 0px) + 12px) !important;
    z-index:2147483003 !important;
    display:flex !important;
    visibility:visible !important;
    opacity:.94 !important;
    transform:none !important;
    pointer-events:auto !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function boot(){ensureStyle();syncOffsetNow();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();["resize","orientationchange","pageshow"].forEach((ev)=>{try{window.addEventListener(ev,syncOffset,{passive:true});}catch(_){}});try{document.addEventListener("mk:map-opened",syncOffset);}catch(_){}
try{document.addEventListener("DOMContentSwitch",boot);}catch(_){}})();(function(){"use strict";const STYLE_ID="lp-mobile-drawer-keep-sheet-visible-v1";function ensureStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
@media (max-width: 768px), (pointer: coarse) {
  html.lp-drawer-open #lp-mobile-sheet.lp-mounted,
  body.lp-drawer-open #lp-mobile-sheet.lp-mounted{
    display:block !important;
    visibility:visible !important;
    opacity:1 !important;
    pointer-events:none !important;
    transform:none !important;
    animation:none !important;
  }

  html.lp-drawer-open #lp-mobile-sheet.lp-mounted .lp-msheet,
  body.lp-drawer-open #lp-mobile-sheet.lp-mounted .lp-msheet{
    visibility:visible !important;
    opacity:1 !important;
    transform:none !important;
    animation:none !important;
    pointer-events:none !important;
  }

  html.lp-drawer-open #lp-mobile-backdrop,
  body.lp-drawer-open #lp-mobile-backdrop{
    display:none !important;
    visibility:hidden !important;
    opacity:0 !important;
    pointer-events:none !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function run(){ensureStyle();}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",run,{once:true});}else{run();}
document.addEventListener("DOMContentSwitch",run);})();(function(){"use strict";const STYLE_ID="lp-desktop-map-viewport-top-fix-v1";function ensureStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
@media (min-width: 901px){
  #lp-map-modal,
  #lp-h1sg-modal{
    position:fixed !important;
    inset:0 !important;
    top:0 !important;
    right:0 !important;
    bottom:0 !important;
    left:0 !important;
    width:100vw !important;
    height:100vh !important;
    z-index:2147483000 !important;
  }

  #lp-map-modal.lp-open,
  #lp-h1sg-modal.lp-open{
    display:flex !important;
  }

  #lp-map-modal .lp-map-topbar,
  #lp-h1sg-modal .lp-h1sg-topbar{
    position:absolute !important;
    top:calc(env(safe-area-inset-top, 0px) + 14px) !important;
    left:calc(env(safe-area-inset-left, 0px) + 16px) !important;
    right:auto !important;
    bottom:auto !important;
    transform:none !important;
    z-index:2147483002 !important;
    display:flex !important;
    visibility:visible !important;
    opacity:1 !important;
    pointer-events:none !important;
  }

  #lp-map-modal .lp-map-toprow,
  #lp-map-modal .lp-map-tabs,
  #lp-map-modal .lp-map-tab,
  #lp-map-modal .lp-map-tipbtn,
  #lp-h1sg-modal .lp-h1sg-tophead,
  #lp-h1sg-modal .lp-h1sg-topbar-row,
  #lp-h1sg-modal .lp-h1sg-tabs,
  #lp-h1sg-modal .lp-h1sg-tab,
  #lp-h1sg-modal .lp-h1sg-tipbtn,
  #lp-h1sg-modal .lp-h1sg-filter{
    visibility:visible !important;
    opacity:1 !important;
    transform:none !important;
    pointer-events:auto !important;
  }

  #lp-map-modal .lp-close,
  #lp-h1sg-modal .lp-close{
    position:absolute !important;
    top:calc(env(safe-area-inset-top, 0px) + 12px) !important;
    right:calc(env(safe-area-inset-right, 0px) + 12px) !important;
    z-index:2147483003 !important;
    display:flex !important;
    visibility:visible !important;
    opacity:.94 !important;
    transform:none !important;
    pointer-events:auto !important;
  }

  #lp-map-modal .lp-full,
  #lp-h1sg-modal .lp-full{
    position:absolute !important;
    top:calc(env(safe-area-inset-top, 0px) + 12px) !important;
    right:calc(env(safe-area-inset-right, 0px) + 56px) !important;
    z-index:2147483003 !important;
    transform:none !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function boot(){ensureStyle();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();try{document.addEventListener("DOMContentSwitch",boot);}catch(_){}
try{window.addEventListener("pageshow",boot,{passive:true});}catch(_){}})();(function(){"use strict";const STYLE_ID="lp-local-map-overlay-shield-mobile-cover-v2";const ACTIVE_CLASS="lp-local-map-active";const MAP_Z=2147483400;function ensureStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
#lp-map-modal,
#lp-map-modal.lp-open,
#lp-map-modal.lp-full{
  z-index:${MAP_Z} !important;
  pointer-events:auto !important;
}
#lp-map-modal .lp-mbox{
  position:relative !important;
  z-index:${MAP_Z + 1} !important;
}
#lp-map-modal .lp-map-topbar,
#lp-map-modal .lp-mzoom{
  z-index:${MAP_Z + 2} !important;
}
#lp-map-modal .lp-close,
#lp-map-modal .lp-full{
  z-index:${MAP_Z + 3} !important;
}
html.${ACTIVE_CLASS} #mw-mastery,
body.${ACTIVE_CLASS} #mw-mastery,
html.${ACTIVE_CLASS} #mw-mastery-compact,
body.${ACTIVE_CLASS} #mw-mastery-compact,
html.${ACTIVE_CLASS} .mw-title-menu,
body.${ACTIVE_CLASS} .mw-title-menu,
html.${ACTIVE_CLASS} #mw-ready-popover,
body.${ACTIVE_CLASS} #mw-ready-popover,
html.${ACTIVE_CLASS} #mw-recap-popover,
body.${ACTIVE_CLASS} #mw-recap-popover,
html.${ACTIVE_CLASS} .mw-fly-layer,
body.${ACTIVE_CLASS} .mw-fly-layer{
  pointer-events:none !important;
}
@media (max-width: 900px), (pointer: coarse){
  #lp-map-modal,
  #lp-map-modal.lp-open,
  #lp-map-modal.lp-full{
    position:fixed !important;
    inset:0 !important;
    top:0 !important;
    right:0 !important;
    bottom:0 !important;
    left:0 !important;
    width:100vw !important;
    min-width:100vw !important;
    height:100vh !important;
    min-height:100vh !important;
    height:100dvh !important;
    min-height:100dvh !important;
    margin:0 !important;
    padding:0 !important;
    box-sizing:border-box !important;
    align-items:stretch !important;
    justify-content:stretch !important;
    background:rgba(0,0,0,.62) !important;
    backdrop-filter:blur(10px) !important;
    -webkit-backdrop-filter:blur(10px) !important;
    overflow:hidden !important;
  }
  #lp-map-modal .lp-mbox,
  #lp-map-modal.lp-full .lp-mbox{
    position:relative !important;
    width:100vw !important;
    max-width:100vw !important;
    min-width:100vw !important;
    height:100vh !important;
    min-height:100vh !important;
    height:100dvh !important;
    min-height:100dvh !important;
    max-height:none !important;
    margin:0 !important;
    padding:0 !important;
    border-radius:0 !important;
    border:none !important;
    box-shadow:none !important;
    overflow:hidden !important;
  }
  #lp-map-modal .lp-mbody{
    position:absolute !important;
    inset:0 !important;
    width:100% !important;
    height:100% !important;
    padding:0 !important;
    margin:0 !important;
    z-index:1 !important;
  }
  #lp-map-modal .lp-mapstage,
  #lp-map-modal.lp-full .lp-mapstage{
    position:absolute !important;
    inset:0 !important;
    width:100% !important;
    height:100% !important;
    border-radius:0 !important;
  }
  #lp-map-modal .lp-map-topbar{
    position:absolute !important;
    top:calc(env(safe-area-inset-top, 0px) + 10px) !important;
    left:calc(env(safe-area-inset-left, 0px) + 12px) !important;
    right:auto !important;
    bottom:auto !important;
    width:auto !important;
    max-width:calc(100vw - 72px) !important;
    padding:0 !important;
    transform:none !important;
    pointer-events:none !important;
  }
  #lp-map-modal .lp-map-toprow,
  #lp-map-modal .lp-map-tabs,
  #lp-map-modal .lp-map-tab,
  #lp-map-modal .lp-map-tipbtn{
    pointer-events:auto !important;
  }
  #lp-map-modal .lp-close{
    position:absolute !important;
    top:calc(env(safe-area-inset-top, 0px) + 10px) !important;
    right:calc(env(safe-area-inset-right, 0px) + 10px) !important;
    transform:none !important;
    pointer-events:auto !important;
  }
  #lp-map-modal .lp-full{
    position:absolute !important;
    top:calc(env(safe-area-inset-top, 0px) + 10px) !important;
    right:calc(env(safe-area-inset-right, 0px) + 54px) !important;
    transform:none !important;
  }
  #lp-map-modal .lp-mzoom{
    position:absolute !important;
    left:50% !important;
    right:auto !important;
    bottom:calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
    transform:translateX(-50%) !important;
  }
  html.${ACTIVE_CLASS} .md-header,
  body.${ACTIVE_CLASS} .md-header,
  html.${ACTIVE_CLASS} .md-tabs,
  body.${ACTIVE_CLASS} .md-tabs{
    pointer-events:none !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function isLocalMapOpen(){const modal=document.getElementById("lp-map-modal");if(!modal)return false;if(!modal.classList||!modal.classList.contains("lp-open"))return false;if(modal.getAttribute("aria-hidden")==="true")return false;if(modal.style&&modal.style.display==="none")return false;return true;}
function syncActiveClass(){const on=isLocalMapOpen();try{document.documentElement&&document.documentElement.classList.toggle(ACTIVE_CLASS,on);}catch(_){}
try{document.body&&document.body.classList.toggle(ACTIVE_CLASS,on);}catch(_){}}
function blockUnderlayEvent(e){try{if(!isLocalMapOpen())return;const target=e&&e.target;if(!target||!target.closest)return;if(target.closest("#lp-map-modal"))return;if(!target.closest("#mw-mastery,#mw-mastery-compact,.mw-title-menu,#mw-ready-popover,#mw-recap-popover,.mw-fly-layer,.md-header,.md-tabs"))return;if(e.cancelable)e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();}catch(_){}}
function observeModal(){syncActiveClass();const modal=document.getElementById("lp-map-modal");if(!modal||modal.__lpOverlayShieldObserver)return;try{const obs=new MutationObserver(syncActiveClass);obs.observe(modal,{attributes:true,attributeFilter:["class","style","aria-hidden"]});modal.__lpOverlayShieldObserver=obs;}catch(_){}}
function boot(){ensureStyle();observeModal();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();try{const mo=new MutationObserver((records)=>{for(const record of records||[]){const changed=[];if(record&&record.addedNodes)changed.push(...record.addedNodes);if(record&&record.removedNodes)changed.push(...record.removedNodes);for(const node of changed){if(!node||node.nodeType!==1)continue;try{if(node.id==="lp-map-modal"||(node.querySelector&&node.querySelector("#lp-map-modal"))){observeModal();return;}}catch(_){}}}});const start=()=>{try{if(document.body)mo.observe(document.body,{childList:true,subtree:true});}catch(_){}};if(document.body)start();else document.addEventListener("DOMContentLoaded",start,{once:true});}catch(_){}
["pointerdown","pointerup","click","mousedown","mouseup"].forEach((type)=>{try{document.addEventListener(type,blockUnderlayEvent,{capture:true,passive:false});}catch(_){}});try{document.addEventListener("DOMContentSwitch",boot);}catch(_){}
try{window.addEventListener("pageshow",boot,{passive:true});}catch(_){}})();(function(){const STYLE_ID='lp-map-v3-mobile-zoom-and-layer-fix';const LP_MAP_MODAL_Z=2147483400;function ensureStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
#lp-map-modal,
#lp-h1sg-modal{
  z-index: ${LP_MAP_MODAL_Z} !important;
  pointer-events: auto !important;
}

/* Use the input's own background as the live progress layer. Mobile WebKit updates
   this immediately during range dragging; pseudo-element gradients often repaint
   only after touchend/change. */
#lp-map-modal input.lp-zoomrange,
#lp-h1sg-modal input.lp-zoomrange{
  background: linear-gradient(90deg, var(--lp-zoom-fill, rgb(255, 42, 35)) 0%, var(--lp-zoom-fill, rgb(255, 42, 35)) var(--lp-zoom-active-pct, 41.1765%), var(--lp-zoom-track, rgba(255,255,255,.20)) var(--lp-zoom-active-pct, 41.1765%), var(--lp-zoom-track, rgba(255,255,255,.20)) 100%) center / 100% 8px no-repeat !important;
}
#lp-map-modal input.lp-zoomrange::-webkit-slider-runnable-track,
#lp-h1sg-modal input.lp-zoomrange::-webkit-slider-runnable-track{
  background: transparent !important;
}
#lp-map-modal input.lp-zoomrange::-webkit-slider-container,
#lp-h1sg-modal input.lp-zoomrange::-webkit-slider-container,
#lp-map-modal input.lp-zoomrange::-webkit-media-slider-container,
#lp-h1sg-modal input.lp-zoomrange::-webkit-media-slider-container{
  background: transparent !important;
}

@media (max-width: 900px), (hover: none) and (pointer: coarse){
  /* Phone map must cover the site header exactly like desktop fullscreen. */
  #lp-map-modal,
  #lp-map-modal.lp-full,
  #lp-h1sg-modal,
  #lp-h1sg-modal.lp-full{
    position: fixed !important;
    inset: 0 !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100dvh !important;
    min-height: 100dvh !important;
    max-height: 100dvh !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }
  #lp-map-modal .lp-mbox,
  #lp-h1sg-modal .lp-mbox{
    width: 100vw !important;
    height: 100dvh !important;
    min-height: 100dvh !important;
    max-height: 100dvh !important;
    border-radius: 0 !important;
  }
  #lp-map-modal .lp-mapstage,
  #lp-h1sg-modal .lp-mapstage,
  #lp-map-modal .lp-mbody,
  #lp-h1sg-modal .lp-mbody{
    min-height: 0 !important;
  }
  #lp-map-modal .lp-map-topbar,
  #lp-h1sg-modal .lp-h1sg-topbar{
    top: calc(env(safe-area-inset-top, 0px) + 10px) !important;
  }
  #lp-map-modal .lp-close,
  #lp-map-modal .lp-full,
  #lp-map-modal .lp-mctrl,
  #lp-h1sg-modal .lp-close,
  #lp-h1sg-modal .lp-full{
    top: calc(env(safe-area-inset-top, 0px) + 12px) !important;
  }
}

/* When a map modal is open, underlying mastery UI must never receive events,
   even if a browser briefly retargets a synthetic click outside the modal. */
html.lp-modal-open #mw-mastery,
html.lp-modal-open #mw-mastery *,
html.lp-modal-open #mw-mastery-compact,
html.lp-modal-open #mw-mastery-compact *,
html.lp-modal-open .mw-anchor,
html.lp-modal-open .mw-anchor *,
html.lp-modal-open .mw-fly-layer,
html.lp-modal-open .mw-fly-layer *,
html.lp-modal-open .mw-title-menu,
html.lp-modal-open .mw-title-menu *,
body.lp-modal-open #mw-mastery,
body.lp-modal-open #mw-mastery *,
body.lp-modal-open #mw-mastery-compact,
body.lp-modal-open #mw-mastery-compact *,
body.lp-modal-open .mw-anchor,
body.lp-modal-open .mw-anchor *,
body.lp-modal-open .mw-fly-layer,
body.lp-modal-open .mw-fly-layer *,
body.lp-modal-open .mw-title-menu,
body.lp-modal-open .mw-title-menu *{
  pointer-events: none !important;
}
`;(document.head||document.documentElement).appendChild(st);}
const LP_MAP_MODAL_IDS=['lp-map-modal','lp-h1sg-modal','lp-gps-modal'];function lpMapModalIsOpen(modal){if(!modal||!modal.classList)return false;if(!modal.classList.contains('lp-open'))return false;if(modal.hidden)return false;if(modal.style&&modal.style.display==='none')return false;return true;}
function openMapModals(){const open=[];try{for(let i=0;i<LP_MAP_MODAL_IDS.length;i++){const modal=document.getElementById(LP_MAP_MODAL_IDS[i]);if(lpMapModalIsOpen(modal))open.push(modal);}
const cmm=document.getElementById('mk-course-mastery-map-modal');if(cmm&&!cmm.hidden)open.push(cmm);}catch(_){}
return open;}
function lpTopLevelHost(node){let el=node;while(el&&el.parentElement&&el.parentElement!==document.body)el=el.parentElement;return(el&&el.parentElement===document.body)?el:null;}
function lpStacksAboveMaps(target,maps){try{const host=lpTopLevelHost(target);if(!host)return false;const cs=window.getComputedStyle(host);if(!cs||cs.position==='static')return false;const z=parseInt(cs.zIndex,10);if(!Number.isFinite(z))return false;let topMapZ=0;for(let i=0;i<maps.length;i++){const mz=parseInt(window.getComputedStyle(maps[i]).zIndex,10);if(Number.isFinite(mz)&&mz>topMapZ)topMapZ=mz;}
return z>topMapZ;}catch(_){return false;}}
function clickThroughGuard(e,passive){try{const maps=openMapModals();if(!maps.length)return;const target=e&&e.target;if(target&&target.nodeType===1){for(let i=0;i<maps.length;i++){if(maps[i]===target||maps[i].contains(target))return;}
if(lpStacksAboveMaps(target,maps))return;}
if(!passive&&e&&e.cancelable)e.preventDefault();if(e){e.stopPropagation();if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();}
return false;}catch(_){}}
function clickThroughGuardPassive(e){return clickThroughGuard(e,true);}
function syncExistingRange(range){try{if(!range||!range.style)return;const min=Number(range.min||30)||30;const max=Number(range.max||200)||200;const raw=Number(range.value||100)||100;const clamped=Math.max(min,Math.min(max,raw));const pct=((clamped-min)/Math.max(1,max-min))*100;range.style.setProperty('--lp-zoom-active-pct',`${pct}%`);const bg=`linear-gradient(90deg, var(--lp-zoom-fill, rgb(255, 42, 35)) 0%, var(--lp-zoom-fill, rgb(255, 42, 35)) ${pct}%, var(--lp-zoom-track, rgba(255,255,255,.20)) ${pct}%, var(--lp-zoom-track, rgba(255,255,255,.20)) 100%)`;range.style.setProperty('background',`${bg} center / 100% 8px no-repeat`,'important');}catch(_){}}
const ZOOM_RANGE_SELECTOR='#lp-map-modal input.lp-zoomrange, #lp-h1sg-modal input.lp-zoomrange';function syncRanges(root){try{const scope=root||document;if(!scope.querySelectorAll)return;if(scope.nodeType===1&&scope.matches&&scope.matches(ZOOM_RANGE_SELECTOR)){syncExistingRange(scope);}
scope.querySelectorAll(ZOOM_RANGE_SELECTOR).forEach(syncExistingRange);}catch(_){}}
function run(){ensureStyles();syncRanges(document);}
['pointerdown','pointerup','pointercancel','mousedown','mouseup','click','auxclick','dblclick','contextmenu'].forEach((type)=>{try{window.addEventListener(type,clickThroughGuard,{capture:true,passive:false});}catch(_){}
try{document.addEventListener(type,clickThroughGuard,{capture:true,passive:false});}catch(_){}});['touchstart','touchend','touchcancel'].forEach((type)=>{try{window.addEventListener(type,clickThroughGuardPassive,{capture:true,passive:true});}catch(_){}
try{document.addEventListener(type,clickThroughGuardPassive,{capture:true,passive:true});}catch(_){}});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();document.addEventListener('DOMContentSwitch',run);window.addEventListener('resize',run,{passive:true});window.addEventListener('orientationchange',run,{passive:true});try{const mo=new MutationObserver((mutations)=>{for(const m of mutations||[]){if(m&&m.addedNodes){Array.from(m.addedNodes).forEach((n)=>{if(n&&(n.nodeType===1||n.nodeType===11))syncRanges(n);});}}});const start=()=>{try{if(document.body)mo.observe(document.body,{childList:true,subtree:true});}catch(_){}};if(document.body)start();else document.addEventListener('DOMContentLoaded',start,{once:true});}catch(_){}})();(function(){const STYLE_ID='lp-map-v4-opaque-zoom-thumb';function ensureStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
#lp-map-modal input.lp-zoomrange,
#lp-h1sg-modal input.lp-zoomrange{
  opacity: 1 !important;
}
#lp-map-modal input.lp-zoomrange::-webkit-slider-thumb,
#lp-h1sg-modal input.lp-zoomrange::-webkit-slider-thumb{
  opacity: 1 !important;
  background: rgb(255,255,255) !important;
  border: 1px solid rgba(255,255,255,1) !important;
  box-shadow:
    0 0 0 1px rgba(0,0,0,.20),
    0 5px 14px rgba(0,0,0,.46) !important;
  filter: none !important;
}
#lp-map-modal input.lp-zoomrange::-moz-range-thumb,
#lp-h1sg-modal input.lp-zoomrange::-moz-range-thumb{
  opacity: 1 !important;
  background: rgb(255,255,255) !important;
  border: 1px solid rgba(255,255,255,1) !important;
  box-shadow:
    0 0 0 1px rgba(0,0,0,.20),
    0 5px 14px rgba(0,0,0,.46) !important;
  filter: none !important;
}
@media (max-width: 900px), (hover: none) and (pointer: coarse){
  #lp-map-modal input.lp-zoomrange::-webkit-slider-thumb,
  #lp-h1sg-modal input.lp-zoomrange::-webkit-slider-thumb,
  #lp-map-modal input.lp-zoomrange::-moz-range-thumb,
  #lp-h1sg-modal input.lp-zoomrange::-moz-range-thumb{
    background: rgb(255,255,255) !important;
    opacity: 1 !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureStyles,{once:true});else ensureStyles();try{document.addEventListener('DOMContentSwitch',ensureStyles);}catch(_){}})();(function(){"use strict";const STYLE_ID="lp-mobile-sheet-header-and-baseline-fix-v1";function ensureStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
@media (max-width: 768px), (pointer: coarse) {
  #lp-mobile-sheet{
    --lp-msheet-bottom: calc(env(safe-area-inset-bottom, 0px) + 18px);
    bottom: var(--lp-msheet-bottom) !important;
  }

  #lp-mobile-sheet.lp-expanded,
  #lp-mobile-sheet.lp-animating{
    top: 0 !important;
    bottom: var(--lp-msheet-bottom) !important;
    min-height: 0 !important;
    height: auto !important;
    padding: 0 12px !important;
    display: flex !important;
    align-items: flex-end !important;
    justify-content: center !important;
  }

  #lp-mobile-sheet.lp-expanded .lp-msheet,
  #lp-mobile-sheet.lp-animating .lp-msheet,
  #lp-mobile-sheet.lp-collapsed .lp-msheet{
    margin-bottom: 0 !important;
  }

  /* Do not allow the whole header to behave like a giant toggle. */
  #lp-mobile-sheet .lp-msheet-head,
  #lp-mobile-sheet .lp-msheet-txt,
  #lp-mobile-sheet .lp-msheet-title,
  #lp-mobile-sheet .lp-msheet-sub{
    pointer-events: none !important;
    cursor: default !important;
  }

  #lp-mobile-sheet .lp-msheet-actions,
  #lp-mobile-sheet .lp-msheet-actions *,
  #lp-mobile-sheet [data-lp-ms-toggle],
  #lp-mobile-sheet [data-lp-ms-openmap],
  #lp-mobile-sheet [data-lp-ms-static],
  #lp-mobile-sheet [data-lp-ms-static] *{
    pointer-events: auto !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureStyle,{once:true});else ensureStyle();try{document.addEventListener("DOMContentSwitch",ensureStyle);}catch(_){}
try{window.addEventListener("pageshow",ensureStyle,{passive:true});}catch(_){}})();(function(){"use strict";const BUILD="lp-desktop-panel-right-shift-v4-remount-stable";const STYLE_ID="lp-desktop-panel-right-shift-v4";const ROOT_SHIFT_VAR="--lp-desktop-panel-right-shift-current";const PANEL_SHIFT_VAR="--lp-panel-right-shift";const OLD_STYLE_IDS=["lp-desktop-panel-right-shift-v1","lp-desktop-panel-right-shift-v2","lp-desktop-panel-right-shift-v3"];const TARGET_SCROLLBAR_GAP_PX=30;const TARGET_VIEWPORT_GAP_PX=52;const MIN_RIGHT_GAP_PX=18;const MAX_SHIFT_PX=96;const MIN_PANEL_WIDTH_PX=180;const SHIFT_EPSILON_PX=0.5;if(window.__lpDesktopPanelRightShiftPatchBuild===BUILD){try{if(typeof window.__lpDesktopPanelRightShiftApplyNow==="function"){window.__lpDesktopPanelRightShiftApplyNow();}else if(typeof window.__lpDesktopPanelRightShiftSchedule==="function"){window.__lpDesktopPanelRightShiftSchedule();}}catch(_){}
return;}
window.__lpDesktopPanelRightShiftPatchBuild=BUILD;const state={raf:0,bound:false,observer:null,};function clamp(n,min,max){n=Number(n)||0;return Math.max(min,Math.min(max,n));}
function isDesktopViewport(){try{return!!(window.matchMedia&&window.matchMedia("(min-width: 901px)").matches);}catch(_){return(window.innerWidth||0)>=901;}}
function viewportRightEdge(){try{return Math.max(0,Number(document.documentElement&&document.documentElement.clientWidth)||0,Number(window.innerWidth)||0);}catch(_){return Number(window.innerWidth)||0;}}
function visibleRect(el){try{if(!el||!el.getBoundingClientRect)return null;const r=el.getBoundingClientRect();if(!r||r.width<=2||r.height<=2)return null;return r;}catch(_){return null;}}
function parsePx(raw){const n=parseFloat(String(raw||"0"));return Number.isFinite(n)?n:0;}
function rootShiftPx(){try{return parsePx(document.documentElement.style.getPropertyValue(ROOT_SHIFT_VAR)||window.getComputedStyle(document.documentElement).getPropertyValue(ROOT_SHIFT_VAR));}catch(_){return 0;}}
function readCurrentShiftPx(panel){try{if(!panel)return rootShiftPx();const inlineRaw=panel.style&&panel.style.getPropertyValue?panel.style.getPropertyValue(PANEL_SHIFT_VAR):"";const computedRaw=inlineRaw||(window.getComputedStyle(panel).getPropertyValue(PANEL_SHIFT_VAR)||"");const n=parsePx(computedRaw);return Number.isFinite(n)?n:rootShiftPx();}catch(_){return rootShiftPx();}}
function writeShiftPx(panel,shift){const px=`${clamp(Math.round(Number(shift) || 0), 0, MAX_SHIFT_PX)}px`;try{document.documentElement.style.setProperty(ROOT_SHIFT_VAR,px);}catch(_){}
try{if(panel&&panel.style&&panel.style.getPropertyValue(PANEL_SHIFT_VAR)){panel.style.removeProperty(PANEL_SHIFT_VAR);}}catch(_){}}
function panelRightLimit(panel){try{const scrollwrap=panel&&panel.closest?panel.closest(".md-sidebar__scrollwrap"):null;const sr=visibleRect(scrollwrap);if(sr){const sw=Math.max(0,Number(scrollwrap.offsetWidth||0)-Number(scrollwrap.clientWidth||0));return{right:Math.min(viewportRightEdge(),sr.right-sw-2),source:"scrollwrap"};}}catch(_){}
try{const rail=panel&&panel.closest?panel.closest(".md-sidebar--secondary, .lp-secondary-fallback"):null;const rr=visibleRect(rail);if(rr)return{right:Math.min(viewportRightEdge(),rr.right-2),source:"rail"};}catch(_){}
return{right:viewportRightEdge(),source:"viewport"};}
function articleRightEdge(){try{const el=document.querySelector(".md-content__inner")||document.querySelector(".md-content");const r=visibleRect(el);return r?Number(r.right):NaN;}catch(_){return NaN;}}
function panelIsInDesktopRail(panel){if(!panel||!panel.isConnected)return false;if(!isDesktopViewport())return false;try{if(panel.closest&&panel.closest("#lp-mobile-sheet"))return false;}catch(_){}
try{if(!panel.closest||!panel.closest(".md-sidebar--secondary, .lp-secondary-fallback"))return false;}catch(_){return false;}
try{const cs=window.getComputedStyle(panel);if(!cs||cs.display==="none"||cs.visibility==="hidden")return false;}catch(_){}
return true;}
function ensureStyle(){OLD_STYLE_IDS.forEach(function(id){try{const old=document.getElementById(id);if(old&&old.parentNode)old.parentNode.removeChild(old);}catch(_){}});let st=document.getElementById(STYLE_ID);if(!st){st=document.createElement("style");st.id=STYLE_ID;(document.head||document.documentElement).appendChild(st);}
const css=`
@media (min-width: 901px){
  html{
    ${ROOT_SHIFT_VAR}: ${document.documentElement.style.getPropertyValue(ROOT_SHIFT_VAR) || "0px"};
  }
  .md-sidebar--secondary.lp-secondary-host-active #lp-side-panel,
  .lp-secondary-fallback #lp-side-panel{
    ${PANEL_SHIFT_VAR}: var(${ROOT_SHIFT_VAR}, 0px);
    transform: translate3d(var(${PANEL_SHIFT_VAR}), 0, 0) !important;
    transform-origin: top right !important;
    transition: none !important;
    will-change: transform;
  }

  /* Let the card move into the empty visual gutter without moving the scrollbar. */
  .md-sidebar--secondary.lp-secondary-host-active,
  .lp-secondary-fallback,
  .lp-secondary-fallback .md-sidebar__scrollwrap{
    overflow-x: visible !important;
  }
}

@media (max-width: 900px){
  #lp-side-panel{
    ${PANEL_SHIFT_VAR}: 0px !important;
    transform: none !important;
    transition: none !important;
    will-change: auto !important;
  }
}
`;if(st.textContent!==css)st.textContent=css;}
function syncPanelRightShift(){state.raf=0;ensureStyle();const panel=document.getElementById("lp-side-panel");if(!panel)return;if(!panelIsInDesktopRail(panel)){try{document.documentElement.style.setProperty(ROOT_SHIFT_VAR,"0px");}catch(_){}
try{panel.style.removeProperty(PANEL_SHIFT_VAR);}catch(_){}
return;}
try{const rect=panel.getBoundingClientRect();if(!rect||rect.width<MIN_PANEL_WIDTH_PX)return;const currentShift=readCurrentShiftPx(panel);const naturalRight=Number(rect.right)-currentShift;const naturalLeft=Number(rect.left)-currentShift;const limit=panelRightLimit(panel);const limitRight=limit&&Number(limit.right);const rightRoom=limitRight-naturalRight;const articleRight=articleRightEdge();const leftGap=naturalLeft-articleRight;let shift;if(Number.isFinite(leftGap)){shift=Math.round((rightRoom-leftGap)/2);}else{const targetGap=limit&&limit.source==="viewport"?TARGET_VIEWPORT_GAP_PX:TARGET_SCROLLBAR_GAP_PX;shift=Math.round(rightRoom-targetGap);}
shift=clamp(shift,0,MAX_SHIFT_PX);if(limitRight-(naturalRight+shift)<MIN_RIGHT_GAP_PX){shift=clamp(Math.round(rightRoom-MIN_RIGHT_GAP_PX),0,MAX_SHIFT_PX);}
const rootShift=rootShiftPx();if(Math.abs(shift-rootShift)>=SHIFT_EPSILON_PX){writeShiftPx(panel,shift);}else{try{if(panel.style&&panel.style.getPropertyValue(PANEL_SHIFT_VAR))panel.style.removeProperty(PANEL_SHIFT_VAR);}catch(_){}}}catch(_){}}
function scheduleSync(){if(state.raf)return;const cb=function(){syncPanelRightShift();};state.raf=window.requestAnimationFrame?window.requestAnimationFrame(cb):window.setTimeout(cb,16);}
function applyNow(){if(state.raf){try{window.cancelAnimationFrame?window.cancelAnimationFrame(state.raf):window.clearTimeout(state.raf);}catch(_){}
state.raf=0;}
syncPanelRightShift();}
function bind(){if(state.bound)return;state.bound=true;["resize","orientationchange","pageshow","load"].forEach(function(ev){try{window.addEventListener(ev,scheduleSync,{passive:true});}catch(_){}});try{document.addEventListener("DOMContentSwitch",scheduleSync);}catch(_){}
try{window.addEventListener("conceptMasteryChanged",scheduleSync,{passive:true});}catch(_){}
try{state.observer=new MutationObserver(function(mutations){for(const m of mutations){if(!m||!m.addedNodes)continue;for(const node of m.addedNodes){if(!node||node.nodeType!==1)continue;if((node.id==="lp-side-panel")||(node.querySelector&&node.querySelector("#lp-side-panel"))||(node.classList&&(node.classList.contains("lp-secondary-fallback")||node.classList.contains("lp-secondary-host-active")))){applyNow();return;}}}});const startObserver=function(){try{if(document.body)state.observer.observe(document.body,{childList:true,subtree:true});}catch(_){}};if(document.body)startObserver();else document.addEventListener("DOMContentLoaded",startObserver,{once:true});}catch(_){}}
try{window.__lpDesktopPanelRightShiftSchedule=scheduleSync;}catch(_){}
try{window.__lpDesktopPanelRightShiftApplyNow=applyNow;}catch(_){}
ensureStyle();bind();if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",applyNow,{once:true});else applyNow();try{window.setTimeout(applyNow,120);}catch(_){}
try{window.setTimeout(applyNow,600);}catch(_){}})();(function(){"use strict";const STYLE_ID="lp-map-drag-compositor-style-v13";function install(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
#lp-map-modal.lp-map-dragging .lp-mapviewport,
#lp-h1sg-modal.lp-map-dragging .lp-mapviewport,
#lp-h1sg-modal.lp-route-animating .lp-mapviewport{
  transition:none !important;
  will-change:transform !important;
  contain:layout paint style !important;
  backface-visibility:hidden !important;
  -webkit-backface-visibility:hidden !important;
  transform-style:flat !important;
}
#lp-map-modal.lp-map-dragging .lp-mapviewport svg,
#lp-map-modal.lp-map-dragging .lp-mapviewport a.lp-node,
#lp-h1sg-modal.lp-map-dragging .lp-mapviewport svg,
#lp-h1sg-modal.lp-map-dragging .lp-mapviewport a.lp-node,
#lp-h1sg-modal.lp-route-animating .lp-mapviewport svg,
#lp-h1sg-modal.lp-route-animating .lp-mapviewport a.lp-node{
  backface-visibility:hidden !important;
  -webkit-backface-visibility:hidden !important;
}
/* Route-path pills stay on their own compositor layers for the whole
   animation, so the arrival pulse never pays a promote/demote raster pair
   on glow/blur-heavy nodes. Scoped to lp-route-animating so the layers are
   released as soon as the animation stops. */
#lp-h1sg-modal.lp-route-animating .lp-node.lp-route-anim-will{
  will-change:transform !important;
  backface-visibility:hidden !important;
  -webkit-backface-visibility:hidden !important;
}
/* While the route animation runs, freeze the mastered/know glow breathing on
   nodes that are NOT on the route. Those pills live inside the promoted
   viewport layer; their animated box-shadows dirtied viewport tiles on every
   frame, forcing tile re-rasters (masked route paths included) for the whole
   time the arrow was moving. Route pills sit on their own layers and keep
   breathing. */
#lp-h1sg-modal.lp-route-animating .lp-node:not(.lp-route-anim-will)::after{
  animation-play-state:paused !important;
}
/* Only transitions are suppressed here: an in-flight transition fights the
   per-frame transform of a live drag. The glow breathing, pill shadows and flow
   arrows stay on — they were switched off for a stutter that turned out to be
   the shop-state sync loop in account-tracking.js, not the map. */
#lp-map-modal.lp-map-dragging .lp-mapviewport a.lp-node,
#lp-map-modal.lp-map-dragging .lp-mapviewport a.lp-node::before,
#lp-map-modal.lp-map-dragging .lp-mapviewport a.lp-node::after,
#lp-map-modal.lp-map-dragging .lp-mapviewport svg path{
  transition:none !important;
}
/* Nodes cannot be interacted with mid-pan anyway (the pointer is captured by the
   viewport), so keep them out of hit-testing instead of re-running hover work. */
#lp-map-modal.lp-map-dragging .lp-mapviewport a.lp-node{
  pointer-events:none !important;
}
#lp-map-modal.lp-map-dragging,
#lp-h1sg-modal.lp-map-dragging{
  cursor:grabbing !important;
}
#lp-h1sg-modal.lp-map-dragging .lp-node{
  pointer-events:none !important;
  transition:none !important;
}
#lp-h1sg-modal.lp-map-virtualized.lp-map-dragging .lp-mapviewport{
  will-change:auto !important;
  contain:layout style !important;
}
#lp-h1sg-modal .lp-node.lp-pan-culled{
  display:none !important;
}
`;(document.head||document.documentElement).appendChild(st);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();})();(function(){try{if(document.getElementById('lp-h1-route-currentcolor-v28'))return;const st=document.createElement('style');st.id='lp-h1-route-currentcolor-v28';st.textContent=`
      article.md-content__inner .lp-h1-routebar{
        --lp-h1-route-ink: var(--md-default-fg-color);
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-stop,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-target{
        color: var(--lp-h1-route-ink, var(--md-default-fg-color)) !important;
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker-svg,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow svg,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow svg *,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-stop svg,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-stop svg *{
        color: currentColor !important;
        stroke: currentColor !important;
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker-svg [fill]:not([fill="none"]),
      article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow svg [fill]:not([fill="none"]),
      article.md-content__inner .lp-h1-routebar .lp-h1-route-stop svg [fill]:not([fill="none"]){
        fill: currentColor !important;
      }
    `;(document.head||document.documentElement).appendChild(st);}catch(_){}})();(function(){try{if(document.getElementById('lp-route-icon-currentcolor-v27'))return;const st=document.createElement('style');st.id='lp-route-icon-currentcolor-v27';st.textContent=`
      html[data-md-color-scheme="slate"] .lp-routebar svg,
      html[data-md-color-scheme="slate"] .lp-routebar svg *,
      html[data-md-color-scheme="slate"] [class*="guided"] svg,
      html[data-md-color-scheme="slate"] [class*="guided"] svg *,
      body[data-md-color-scheme="slate"] .lp-routebar svg,
      body[data-md-color-scheme="slate"] .lp-routebar svg *,
      body[data-md-color-scheme="slate"] [class*="guided"] svg,
      body[data-md-color-scheme="slate"] [class*="guided"] svg *{
        color:#fff !important;
        stroke:#fff !important;
      }
      html[data-md-color-scheme="slate"] .lp-routebar svg [fill]:not([fill="none"]),
      html[data-md-color-scheme="slate"] [class*="guided"] svg [fill]:not([fill="none"]){
        fill:#fff !important;
      }
    `;(document.head||document.documentElement).appendChild(st);}catch(_){}})();(function(){"use strict";const STYLE_ID="lp-local-map-default-blur-v72";const FOG_KEY="lp_map_fog_enabled_v1";const MAP_IDS=["lp-map-modal","lp-h1sg-modal"];const PHONE_MQ="(pointer: coarse) and (max-width: 767px), (pointer: coarse) and (max-height: 600px), (max-width: 900px)";const BACKDROP={wide:{bg:"rgba(0,0,0,.46)",filter:"blur(6px) saturate(1.04)"},phone:{bg:"rgba(0,0,0,.62)",filter:"blur(10px) saturate(1.06)"}};function backdropForViewport(){try{if(window.matchMedia&&window.matchMedia(PHONE_MQ).matches)return BACKDROP.phone;}catch(_){}
return BACKDROP.wide;}
function ensureStyle(){try{if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
#lp-map-modal,
#lp-map-modal.lp-open,
#lp-map-modal.lp-full,
#lp-map-modal.lp-doc-surface,
#lp-map-modal.lp-doc-surface.lp-full,
#lp-h1sg-modal,
#lp-h1sg-modal.lp-open,
#lp-h1sg-modal.lp-full,
#lp-h1sg-modal.lp-doc-surface,
#lp-h1sg-modal.lp-doc-surface.lp-full{
  background:${BACKDROP.wide.bg} !important;
  -webkit-backdrop-filter:${BACKDROP.wide.filter} !important;
  backdrop-filter:${BACKDROP.wide.filter} !important;
}
#lp-map-modal .lp-fog-layer{
  display:block !important;
  opacity:.56 !important;
  mix-blend-mode:screen !important;
  -webkit-filter:blur(14px) saturate(1.01) !important;
  filter:blur(14px) saturate(1.01) !important;
}
#lp-map-modal.lp-webgl3d .lp-fog-layer{
  opacity:.30 !important;
  -webkit-filter:blur(20px) saturate(1.08) !important;
  filter:blur(20px) saturate(1.08) !important;
}
@media ${PHONE_MQ}{
  #lp-map-modal,
  #lp-map-modal.lp-open,
  #lp-map-modal.lp-full,
  #lp-map-modal.lp-doc-surface,
  #lp-map-modal.lp-doc-surface.lp-full,
  #lp-h1sg-modal,
  #lp-h1sg-modal.lp-open,
  #lp-h1sg-modal.lp-full,
  #lp-h1sg-modal.lp-doc-surface,
  #lp-h1sg-modal.lp-doc-surface.lp-full{
    background:${BACKDROP.phone.bg} !important;
    -webkit-backdrop-filter:${BACKDROP.phone.filter} !important;
    backdrop-filter:${BACKDROP.phone.filter} !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}catch(_){}}
function restoreDefaultFogOnce(){try{const marker="lp_map_fog_free_default_restored_v72";if(localStorage.getItem(marker)==="1")return;if(localStorage.getItem(FOG_KEY)==="0")localStorage.setItem(FOG_KEY,"1");localStorage.setItem(marker,"1");}catch(_){}}
function syncOpenMap(){try{ensureStyle();const look=backdropForViewport();for(const id of MAP_IDS){const modal=document.getElementById(id);if(!modal||!modal.classList||!modal.classList.contains("lp-open"))continue;modal.style.setProperty("background",look.bg,"important");modal.style.setProperty("-webkit-backdrop-filter",look.filter,"important");modal.style.setProperty("backdrop-filter",look.filter,"important");}}catch(_){}}
function boot(){restoreDefaultFogOnce();ensureStyle();syncOpenMap();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();try{window.addEventListener("pageshow",boot,{passive:true});}catch(_){}
try{window.addEventListener("lp:fog-change",syncOpenMap);}catch(_){}
try{const mq=window.matchMedia&&window.matchMedia(PHONE_MQ);if(mq&&typeof mq.addEventListener==="function")mq.addEventListener("change",syncOpenMap);else if(mq&&typeof mq.addListener==="function")mq.addListener(syncOpenMap);}catch(_){}
try{document.addEventListener("mk:map-opened",syncOpenMap);}catch(_){}})();;(()=>{const STYLE_ID="lp-interface-theme-continuous-sidebar-v81";function ensureLearningPathThemeContinuityStyle(){try{let st=document.getElementById(STYLE_ID);if(!st){st=document.createElement("style");st.id=STYLE_ID;(document.head||document.documentElement).appendChild(st);}
st.textContent=`
/* v83: interface themes keep the right sidebar floor transparent, but the
   Learning path itself remains a visible no-shadow panel. Text colours and
   relation colours are untouched. */
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__scrollwrap,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__inner,
html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback,
html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback .md-sidebar__scrollwrap,
html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback .md-sidebar__inner{
  background:transparent !important;
  background-image:none !important;
  border-color:transparent !important;
  box-shadow:none !important;
  filter:none !important;
  outline:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
html[data-mk-interface-theme^="ui_theme_"] #lp-side-panel{
  background:var(--mk-theme-sidebar-card-bg, color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%)) !important;
  background-image:none !important;
  border-color:var(--mk-theme-sidebar-border, var(--md-default-fg-color--lightest)) !important;
  box-shadow:none !important;
  filter:none !important;
  outline:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
html:not([data-mk-interface-theme]) #lp-side-panel,
html[data-mk-interface-theme=""] #lp-side-panel{
  box-shadow:none !important;
}
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active::before,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active::after,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__scrollwrap::before,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__scrollwrap::after,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__inner::before,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__inner::after,
html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback::before,
html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback::after,
html[data-mk-interface-theme^="ui_theme_"] #lp-side-panel::before,
html[data-mk-interface-theme^="ui_theme_"] #lp-side-panel::after{
  content:none !important;
  display:none !important;
  background:none !important;
  background-image:none !important;
  box-shadow:none !important;
  filter:none !important;
}
`;}catch(_){}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureLearningPathThemeContinuityStyle,{once:true});else ensureLearningPathThemeContinuityStyle();try{window.addEventListener("pageshow",ensureLearningPathThemeContinuityStyle,{passive:true});}catch(_){}})();;(()=>{const STYLE_ID="lp-interface-theme-panel-surface-v84";function ensureLearningPathPanelSurfaceStyle(){try{let st=document.getElementById(STYLE_ID);if(!st){st=document.createElement("style");st.id=STYLE_ID;(document.head||document.documentElement).appendChild(st);}
st.textContent=`
/* v84: keep the Learning path as a visible panel, but remove the default
   shadow. Theme floors remain transparent; only the panel itself is surfaced. */
#lp-side-panel{
  box-shadow:none !important;
}
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__scrollwrap,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__inner,
html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback,
html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback .md-sidebar__scrollwrap,
html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback .md-sidebar__inner{
  background:transparent !important;
  background-image:none !important;
  border-color:transparent !important;
  box-shadow:none !important;
  filter:none !important;
  outline:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
html[data-mk-color-scheme="default"][data-mk-interface-theme="ui_theme_sunlit_gold"] #lp-side-panel{
  --mk-theme-sidebar-card-bg:#fff7e8;
  --mk-theme-sidebar-border:rgba(159,114,14,.26);
}
html[data-mk-color-scheme="slate"][data-mk-interface-theme="ui_theme_lantern_gold"] #lp-side-panel{
  --mk-theme-sidebar-card-bg:#2a2112;
  --mk-theme-sidebar-border:rgba(255,212,92,.22);
}
html[data-mk-interface-theme^="ui_theme_"] #lp-side-panel{
  background:var(--mk-theme-sidebar-card-bg, color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%)) !important;
  background-image:none !important;
  border-color:var(--mk-theme-sidebar-border, var(--md-default-fg-color--lightest)) !important;
  box-shadow:none !important;
  filter:none !important;
  outline:none !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}
html[data-mk-interface-theme^="ui_theme_"] #lp-side-panel::before,
html[data-mk-interface-theme^="ui_theme_"] #lp-side-panel::after,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active::before,
html[data-mk-interface-theme^="ui_theme_"] .md-sidebar--secondary.lp-secondary-host-active::after,
html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback::before,
html[data-mk-interface-theme^="ui_theme_"] .lp-secondary-fallback::after{
  content:none !important;
  display:none !important;
  background:none !important;
  background-image:none !important;
  box-shadow:none !important;
  filter:none !important;
}
`;}catch(_){}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureLearningPathPanelSurfaceStyle,{once:true});else ensureLearningPathPanelSurfaceStyle();try{window.addEventListener("pageshow",ensureLearningPathPanelSurfaceStyle,{passive:true});}catch(_){}})();(function(){try{if(document.getElementById('lp-h1-route-mobile-end-frame-v29'))return;const st=document.createElement('style');st.id='lp-h1-route-mobile-end-frame-v29';st.textContent=`
      article.md-content__inner .lp-h1-routebar{
        --lp-h1-route-ink: var(--md-typeset-a-color, var(--md-accent-fg-color, var(--md-default-fg-color)));
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-stop,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-target{
        color: var(--lp-h1-route-ink, var(--md-typeset-a-color, var(--md-default-fg-color))) !important;
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker-svg{
        color: var(--lp-h1-route-ink, var(--md-typeset-a-color, var(--md-default-fg-color))) !important;
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker-svg path,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-stop.is-current .lp-h1-route-marker-svg path{
        fill: currentColor !important;
        stroke: none !important;
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow{
        color: var(--lp-h1-route-ink, var(--md-typeset-a-color, var(--md-default-fg-color))) !important;
        opacity: .72 !important;
      }
      @media (max-width: 768px), (hover: none) and (pointer: coarse){
        article.md-content__inner .lp-h1-routebar .lp-h1-route-target--icon,
        article.md-content__inner .lp-h1-routebar .lp-h1-route-target--icon.is-current{
          width: 22px !important;
          min-width: 22px !important;
          height: 22px !important;
          min-height: 22px !important;
          padding: 0 !important;
          border-radius: 999px !important;
          border: 1px solid rgba(125,125,155,.22) !important;
          background: rgba(255,255,255,.04) !important;
          box-shadow: none !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          line-height: 0 !important;
        }
        html[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-routebar .lp-h1-route-target--icon,
        html[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-routebar .lp-h1-route-target--icon.is-current,
        body[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-routebar .lp-h1-route-target--icon,
        body[data-md-color-scheme="slate"] article.md-content__inner .lp-h1-routebar .lp-h1-route-target--icon.is-current{
          border-color: rgba(255,255,255,.16) !important;
          background: rgba(255,255,255,.04) !important;
        }
        article.md-content__inner .lp-h1-routebar .lp-h1-route-target--icon .lp-h1-route-target-icon{
          color: #ef4444 !important;
          width: 20px !important;
          height: 20px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          line-height: 0 !important;
        }
        article.md-content__inner .lp-h1-routebar .lp-h1-route-target--icon .lp-h1-route-target-icon svg{
          width: 16px !important;
          height: 16px !important;
          display: block !important;
          transform: translateY(.7px) !important;
          transform-origin: 50% 50% !important;
        }
      }
    `;(document.head||document.documentElement).appendChild(st);}catch(_){}})();(function(){try{if(document.getElementById('lp-h1-route-theme-split-v32'))return;const st=document.createElement('style');st.id='lp-h1-route-theme-split-v32';st.textContent=`
      article.md-content__inner .lp-h1-routebar{
        --lp-h1-route-theme-ink: var(--mk-theme-link-color, var(--md-accent-fg-color, var(--md-default-fg-color)));
        --lp-h1-route-default-ink: var(--md-default-fg-color);
      }

      /* Keep the separator arrows on the default text colour, not the shop theme. */
      article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow{
        color: var(--lp-h1-route-default-ink, var(--md-default-fg-color)) !important;
        -webkit-text-fill-color: currentColor !important;
        opacity: .72 !important;
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow svg,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow svg *{
        color: currentColor !important;
        stroke: currentColor !important;
        filter: none !important;
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-arrow svg [fill]:not([fill="none"]){
        fill: currentColor !important;
      }

      /* Theme colour: current-node SVG arrow in the first circle. */
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker-svg,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-stop.is-current .lp-h1-route-marker,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-stop.is-current .lp-h1-route-marker-svg{
        color: var(--lp-h1-route-theme-ink, var(--md-accent-fg-color)) !important;
        -webkit-text-fill-color: currentColor !important;
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker-svg,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker-svg *{
        color: currentColor !important;
        stroke: currentColor !important;
        filter: none !important;
      }
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker-svg path,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-marker-svg [fill]:not([fill="none"]){
        fill: currentColor !important;
        stroke: none !important;
      }

      /* Theme colour: dot cores inside the route circles. */
      article.md-content__inner .lp-h1-routebar .lp-h1-route-stop .lp-h1-route-dotcore{
        background: var(--lp-h1-route-theme-ink, var(--md-accent-fg-color)) !important;
      }

      /* Theme colour: target node text, including rendered maths. */
      article.md-content__inner .lp-h1-routebar .lp-h1-route-target-text,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-target-text *,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-target-text mjx-container,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-target-text .MathJax,
      article.md-content__inner .lp-h1-routebar .lp-h1-route-target-text .katex{
        color: var(--lp-h1-route-theme-ink, var(--md-accent-fg-color)) !important;
        -webkit-text-fill-color: currentColor !important;
      }
    `;(document.head||document.documentElement).appendChild(st);}catch(_){}})();(function(){try{if(document.getElementById('lp-map-mobile-chrome-geometry-v1'))return;const st=document.createElement('style');st.id='lp-map-mobile-chrome-geometry-v1';st.textContent=`
@media (max-width: 900px){
  /* 1 ── one row: [-] [========= slider =========] [100%] [+] [Reset] */
  #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group,
  #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group{
    grid-template-columns: 36px minmax(0, 1fr) 46px 36px 62px !important;
    grid-template-rows: 40px !important;
    grid-auto-rows: 0 !important;
    grid-auto-columns: 0 !important;
    column-gap: 6px !important;
    row-gap: 0 !important;
    padding: 8px 9px !important;
    align-items: center !important;
    overflow: visible !important;
  }
  #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-btn,
  #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-btn{
    grid-row: 1 !important;
    width: 36px !important;
    min-width: 36px !important;
    max-width: 36px !important;
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    padding: 0 !important;
    justify-self: stretch !important;
  }
  #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-dec,
  #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-dec{
    display: inline-flex !important;
    grid-column: 1 !important;
    grid-row: 1 !important;
  }
  #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-range,
  #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-range{
    grid-column: 2 !important;
    grid-row: 1 !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    justify-self: stretch !important;
    align-self: center !important;
  }
  #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-label,
  #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-label{
    grid-column: 3 !important;
    grid-row: 1 !important;
    width: 46px !important;
    min-width: 46px !important;
    max-width: 46px !important;
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    font-size: clamp(9.5px, 3vw, 12.5px) !important;
    justify-self: center !important;
    align-self: center !important;
  }
  #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-inc,
  #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-inc{
    display: inline-flex !important;
    grid-column: 4 !important;
    grid-row: 1 !important;
  }
  #lp-map-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-reset,
  #lp-h1sg-modal .lp-mbox > .lp-mzoom > .lp-ctrl-group > .lp-zoom-reset{
    grid-column: 5 !important;
    grid-row: 1 !important;
    width: 62px !important;
    min-width: 62px !important;
    max-width: 62px !important;
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    padding: 0 !important;
    font-size: clamp(9.5px, 3vw, 12.5px) !important;
    justify-self: stretch !important;
  }

  /* 2 ── tab labels sized against the viewport, never the root font size */
  /* The strip is content-sized but capped by the topbar. 72px was reserved on
     its right for the close button, which is 36px wide at right:10px - so about
     10px of that reservation was never used, and it is worth more to the labels. */
  #lp-map-modal .lp-map-topbar,
  #lp-h1sg-modal .lp-h1sg-topbar{
    width: calc(100vw - 62px) !important;
  }
  #lp-map-modal .lp-map-topbar .lp-map-tabs,
  #lp-h1sg-modal .lp-h1sg-topbar .lp-h1sg-tabs{
    gap: 3px !important;
    padding: 3px !important;
  }
  #lp-map-modal .lp-map-topbar .lp-map-tabs > .lp-map-tab,
  #lp-h1sg-modal .lp-h1sg-topbar .lp-h1sg-tabs > .lp-h1sg-tab{
    min-width: 0 !important;
    padding: 0 4px !important;
    /* px, not rem: the strip is capped by the topbar width, so a root font-size
       or iOS text-size larger than the design value pushes the label past the
       button it sits in. Verified at 280 / 320 / 393px against both the site
       font and the wider system fallback used when the vendored font is
       unavailable. */
    font-size: clamp(8px, 2.85vw, 12.6px) !important;
    letter-spacing: -.015em !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    -webkit-text-size-adjust: 100% !important;
    text-size-adjust: 100% !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}catch(_){}})();