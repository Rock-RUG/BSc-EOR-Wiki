(function(){function __mkFetchSearchIndex(url,init){const shared=window.__mkFetchJsonShared;if(typeof shared==="function")return shared(url,init);return fetch(url,init).then(function(r){return r&&r.ok?r.json():null;});}
const{escapeHtml,escapeAttr,el,escapeRegexLiteral,fastStringHash,formatTime,previewText,readJsonLocal,currentPath,getVisitorId,isConceptPath,plainMathTitleText,rawPageTitleForMath,titleLooksLikePath,isMobilePowerSensitiveViewport,pageIsHiddenForAccountSync,readNumberLocal,writeNumberLocal,readLocalArray,cleanProfileNameLocal,cleanProfileBioLocal,cleanAvatarLocal,cleanAvatarFrameLocal,avatarFrameForLevelLocal,cleanDeviceNameLocal,defaultDeviceName,isImageAvatar,emojiTextFromCodepoint,normaliseNotoEmojiText,normaliseNotoEmojiTag,getSiteRootUrlForActivity,normActivityTitlePath,accountLoginBase64UrlEncode,accountLoginBase64UrlDecode,accountQrImageSrc,removeAccountLoginParamFromUrl,visibilityValue,defaultPrivacy,pageActionLabels,savedPageActions,cleanPageTitleText,setActivityLinkTitle,typesetActivityMath,accountAutoSyncBackgroundDisabled,sampledStorageFingerprintPart,normaliseQueuedTask,aiQuizVisibleTextLooksLikeRealResult,pageActionPathKey,shouldCacheApiGet,avatarFrameLevelLocal,initialPrivacyPreference,displayInitials,registerCommentEmojiAlias,commentEmojiOfficialCategoryLabel,initialAvatarStyleItemId,normalisePrivacy,pageHref,accountSyncProgressText,isLikelyLostPostResponse,accountLoginPayloadToken,accountLoginPayloadFromToken,isActiveSavedPageAction,ecConsumeGuestAction,anonymousCommentDailyLimitMessage,hasUsedAnonymousCommentToday,publicProfileUrl,masteryTimestampValue,masteryHasRating,masteryHistoryArray,aiQuizSessionTimestampValue,localAiQuizSessionTime,aiQuizQuestionSignatureForSync,masterySnapshotTextFingerprint,splitMasterySnapshotText,flattenSnapshotQuizSessions,titleFromH1,shouldSkipMobileBackgroundWork,avatarFrameSvgLocal,commentEmojiDisplayCategory,masteryUpdatedAt,masteryRatingUpdatedAt,masteryHistoryItemKey,aiQuizSessionUpdatedAt,accountJsonSyncPositiveDelta,accountJsonStatsMissing,accountJsonStatsExtraLocal,splitAccountJsonSnapshotText,accountJsonMergeArrayById,accountJsonSnapshotWithoutActivityEvents,accountJsonCloudActivityCount,localActivityEventsUploadFingerprint,deviceSyncedEventCountFromSummary,accountSyncStatsTotal,accountSyncSummaryRawServerStats,accountSyncDateTime,accountSyncSummaryIsExactSynced,accountEventFileStatsForDisplay,mergeByPathTime,mergeActions,activityEventsIdbAvailable,activityCursorQuery,isLearningCloudSyncReason,wantsAdminModeFromUrl,adminCardMeta,mkLocalIsTouchLikeViewport,mkLocalPx,mkLocalPageScrollXNow,mkLocalPageScrollYNow,mkLocalClamp,mkLocalIsIOSWebKitMobile,mkLocalReadSafeAreaBottomInsetPx,mkLocalVisibleViewportBottomPx,isConnectionNotificationType,commentSvgIcon,iconLabel,actionHubSvg,actionIconName,pageEditTitleFromPath,sourceMdPathFromConceptPath,pageEditStatusLabel,reactionLabel,ownerReactionViewerText,normaliseReadinessNumber,pathVariantsForReadiness,localActivityTime,publicProfileRowTime,publicProfileImageThemeIdFromItem,publicProfileImageThemeConfig,formatCooldownDate,isCooldownActive,profileChangeWarningText,formatAccountXp,normaliseAccountXpRules,accountXpScoresDiffer,accountXpScoreRichness,accountXpHasUsefulHistory,isCompleteAccountXpScore,cachedRawNumber,cachedRawString,todayUtcDayLocal,dailyCapMessages,normaliseDailySummaryRow,dailyXpCapActuallyReached,ruleMatchesMetric,shortXpRuleDescription,accountLevelDetailKey,levelBreakCardIsOpen,formatShopTrialRemaining,currentDiscountDay,shopCategoryDisplayLabel,shopFontPreviewStack,connectionDateText,connectionDurationText,connectionStatusText,isSystemKeeperNotification,reactionSymbol,voucherStateText,notificationSourceLabel,isReportReviewNotification,localActivityTitleFor,emojiEntitlements,emojiUnlockItemId,emojiUnlockPrice,pageEditSourceErrorRows,downloadTextFile,title,masteryActivityAt,mergeMasteryHistories,accountSyncStatsMax,mkLocalIOSCompleteToolbarOcclusionPx,mkLocalAccountSafeBottomGuardPx,iconButtonHtml,pageEditRow,pageEditSourceErrorHtml,readinessFromCandidate,publicProfileMergeRows,formatEorbits,todayCurrencyEarned,betterAccountXpScore,utcDayFromLocalTs,pickDailyCapMessage,oneTimeStatusForMetric,quickShopDefaultTitle}=window.MkEC||{};const defaultNewAccountPrivacy=typeof(window.MkEC&&window.MkEC.defaultNewAccountPrivacy)==="function"?window.MkEC.defaultNewAccountPrivacy:()=>Object.assign(defaultPrivacy(false),{rankingVisibility:"public",rankingPublic:true});const API_BASE=String((window.MkHotTrack&&window.MkHotTrack.apiBase)||window.MKDOCS_HOT_API_BASE||"https://hot.eor-wiki.workers.dev").replace(/\/+$/g,"");const ADMIN_TOKEN_KEY="ai_mqc_report_admin_token_v1";const PENDING_XP_ACTIVITY_QUEUE_KEY="mk_xp_pending_activity_queue_v1";const LOCAL_COMMENTS_KEY="mk_hot_local_comments_v1";const LOCAL_FAVORITES_KEY="mk_hot_local_favorites_v1";const LOCAL_PAGE_ACTIONS_KEY="mk_hot_local_page_actions_v1";const LOCAL_COMMENT_REPORTS_KEY="mk_hot_local_comment_reports_v1";const GUEST_ANON_COMMENT_DAY_KEY_PREFIX="mk_guest_anonymous_comment_day_v1:";const LOCAL_PROFILE_KEY="mk_comment_profile_v1";const LOCAL_READINESS_KEY="mk_hot_local_readiness_v1";const LOCAL_VISITS_KEY="mk_hot_local_visits_v1";const LOCAL_MASTERY_KEY="concept_mastery_v1";const LOCAL_AI_QUIZ_SESSIONS_KEY="concept_quiz_sessions_v1";const CLOUD_SYNC_LAST_KEY="mk_hot_cloud_sync_last_v1";const LOCAL_DEVICE_NAME_KEY="mk_hot_device_name_v1";const NOTIFICATION_SEEN_KEY="mk_hot_notifications_seen_at_v1";const CONNECTION_NOTIFICATION_SEEN_KEY="mk_hot_connection_notifications_seen_at_v1";const ACCOUNT_LEVEL_SEEN_KEY_PREFIX="mk_account_last_seen_level_v2:";const ACCOUNT_XP_CACHE_SCHEMA_VERSION=6;const ACCOUNT_XP_CACHE_KEY_PREFIX="mk_account_xp_complete_cache_v6:";const ACCOUNT_XP_CACHE_LATEST_KEY="mk_account_xp_complete_cache_latest_v6";const ACCOUNT_XP_LIGHT_CACHE_KEY_PREFIX="mk_account_xp_light_cache_v1:";const ACCOUNT_XP_LIGHT_CACHE_LATEST_KEY="mk_account_xp_light_cache_latest_v1";const LEARNING_CURRENCY_NAME="EORbits";const LEARNING_CURRENCY_SINGULAR="EORbit";const LOCAL_ACTIVITY_EVENTS_KEY="mk_hot_local_activity_events_v1";const LOCAL_ACTIVITY_EVENTS_CHUNK_META_KEY="mk_hot_local_activity_events_chunks_v1";const LOCAL_ACTIVITY_EVENTS_CHUNK_PREFIX="mk_hot_local_activity_events_chunk_v1:";const LOCAL_ACTIVITY_EVENTS_CHUNK_SIZE=32000;const LOCAL_ACTIVITY_EVENTS_IDB_DB="mk_hot_account_sync_activity_v1";const LOCAL_ACTIVITY_EVENTS_IDB_STORE="kv";const LOCAL_ACTIVITY_EVENTS_IDB_KEY="activity_events";const LOCAL_ACTIVITY_EVENTS_MEMORY_KEY="__mk_account_activity_events_cache_v12";const LOCAL_ACTIVITY_EVENTS_DOWNLOAD_CURSOR_KEY="mk_account_activity_events_download_cursor_v12";const LOCAL_ACTIVITY_EVENTS_DOWNLOAD_DONE_KEY="mk_account_activity_events_download_done_v12";const MASTERY_JSON_SNAPSHOT_FINGERPRINT_KEY="mk_account_mastery_json_snapshot_fingerprint_v2";const ACCOUNT_JSON_SYNC_FINGERPRINT_KEY="mk_account_json_sync_fingerprint_v1";const ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY="mk_account_json_sync_last_summary_v1";const ACCOUNT_SYNC_LAST_RESULT_KEY="mk_account_sync_last_result_v2";const ACCOUNT_DATA_SYNC_SUMMARY_KEY="mk_account_data_sync_summary_v1";const ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY="mk_account_sync_confirmed_cloud_v1";const ACCOUNT_DEVICE_SYNCED_EVENTS_KEY="mk_account_device_synced_events_v1";const LOCAL_ACTIVITY_EVENTS_UPLOAD_FINGERPRINT_KEY="mk_account_activity_events_upload_fingerprint_v1";const ACCOUNT_JSON_SYNC_TYPE="account_json_snapshot";const PROFILE_CHANGE_COOLDOWN_MS=7*24*60*60*1000;const CLOUD_SYNC_DIRTY_KEY="mk_hot_cloud_sync_dirty_v2";const CLOUD_SYNC_FINGERPRINT_KEY="mk_hot_cloud_sync_fingerprint_v11_mastery_json_chunks";const AI_QUIZ_SESSION_SYNC_FINGERPRINT_KEY="mk_ai_quiz_session_sync_fingerprint_v9_mastery_json_chunks";const NOTIFICATION_BADGE_LAST_KEY="mk_hot_notification_badge_last_v2";const PROFILE_ONLINE_LAST_KEY="mk_hot_profile_online_last_v2";const MOBILE_CLOUD_SYNC_CLEAN_MIN_MS=60*1000;const MOBILE_CLOUD_SYNC_DIRTY_MIN_MS=45*1000;const ACCOUNT_SYNC_FETCH_TIMEOUT_MS=90000;const ACCOUNT_SYNC_MANUAL_TIMEOUT_MS=360000;const MOBILE_NOTIFICATION_MIN_MS=5*60*1000;const LOCAL_SYNC_QUEUE_KEY="mk_hot_local_sync_queue_v3";const LOCAL_SYNC_QUEUE_LOCK_KEY="mk_hot_local_sync_queue_lock_v1";const LOCAL_SYNC_QUEUE_LAST_KEY="mk_hot_local_sync_queue_last_v1";const LOCAL_SYNC_QUEUE_INTERVAL_MS=10*60*1000;const LOCAL_SYNC_QUEUE_MAX=900;const API_GET_CACHE_PREFIX="mk_hot_api_get_cache_v1:";const API_GET_CACHE_MAX_AGE_MS=24*60*60*1000;const ACCOUNT_SYNC_LOCALSTORAGE_META_KEY="mk_account_localstorage_meta_v1";const ACCOUNT_SYNC_LOCALSTORAGE_VALUE_MAX=180000;const ACCOUNT_SYNC_LOCALSTORAGE_TOTAL_MAX=900000;const ACCOUNT_WORKSPACE_RESUME_SYNC_KEY="mk_account_workspace_resume_sync_v1";const ACCOUNT_SYNC_ACTIVITY_EVENT_MAX=10000;const ACCOUNT_SYNC_ACTIVITY_EVENT_CAP_VERSION=10000;const ACCOUNT_SYNC_LOCALSTORAGE_EXACT_KEYS=new Set(["mk_search_history_v1","mk_course_search_input_history_v3","mk_find_token_input_history_v1","mk_course_map_readiness_daily_v1","mk_course_map_open_v1","random_custom_tokens_v1","random_custom_candidates_v1","random_custom_page_v1","random_custom_token_map_v1","random_custom_expand_v1","random_custom_selected_v1","random_custom_selftest_pref_v1","mk_site_motion_enabled_v1","lp_map_fog_enabled_v1","mw_widget_hidden_v1","mk_sidebar_sort_mode_course_v5","mk_sidebar_sort_mode_year_v3","mk_sidebar_group_open_v1","mk_sidebar_current_scope_open_v1","mk_sidebar_global_year_open_v1"]);const ACCOUNT_SYNC_LOCALSTORAGE_PREFIXES=["random_custom_","mk_find_","mk_course_search_","mk_search_history_","mk_sidebar_","lp_map_","mw_widget_"];const ACCOUNT_SYNC_LOCALSTORAGE_DENY_PREFIXES=["mk_hot_visitor","mk_hot_admin","mk_hot_cloud_sync_","mk_hot_api_get_cache_","mk_hot_local_sync_queue","mk_account_json_sync_","mk_account_sync_","mk_account_mastery_json_snapshot_fingerprint","mk_account_xp_complete_cache_","mk_ai_quiz_session_sync_fingerprint","mk_last_updated_page_fact_","ai_mqc_report_admin_token","__mk_views30d_cache","__md_"];function accountSyncShouldMirrorLocalStorageKey(key){const k=String(key||"").trim();if(!k||k===ACCOUNT_SYNC_LOCALSTORAGE_META_KEY)return false;if(k===LOCAL_PROFILE_KEY||k===LOCAL_DEVICE_NAME_KEY||k===NOTIFICATION_SEEN_KEY||k.indexOf(CONNECTION_NOTIFICATION_SEEN_KEY)===0)return false;if(k===CLOUD_SYNC_LAST_KEY||k===CLOUD_SYNC_DIRTY_KEY||k===CLOUD_SYNC_FINGERPRINT_KEY)return false;if(k===ACCOUNT_JSON_SYNC_FINGERPRINT_KEY||k===ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY||k===ACCOUNT_SYNC_LAST_RESULT_KEY)return false;if(k===ADMIN_TOKEN_KEY||k==="mk_hot_admin_token_v1"||k==="mk_comment_name_v1"||k==="mk_hot_visitor_id_v1")return false;if(ACCOUNT_SYNC_LOCALSTORAGE_DENY_PREFIXES.some((prefix)=>k.indexOf(prefix)===0))return false;if(ACCOUNT_SYNC_LOCALSTORAGE_EXACT_KEYS.has(k))return true;return ACCOUNT_SYNC_LOCALSTORAGE_PREFIXES.some((prefix)=>k.indexOf(prefix)===0);}
function readAccountLocalStorageMeta(){const meta=readJsonLocal(ACCOUNT_SYNC_LOCALSTORAGE_META_KEY,{});return meta&&typeof meta==="object"&&!Array.isArray(meta)?meta:{};}
function writeAccountLocalStorageMeta(meta){try{const clean={};Object.entries(meta&&typeof meta==="object"?meta:{}).slice(-1000).forEach(([key,rec])=>{if(!accountSyncShouldMirrorLocalStorageKey(key))return;const r=rec&&typeof rec==="object"?rec:{};const updatedAt=Math.max(0,Number(r.updatedAt||r.updated_at||r.ts||0)||0);if(!updatedAt)return;clean[key]={updatedAt,deleted:!!r.deleted};});safeSetLocalStorageItem(ACCOUNT_SYNC_LOCALSTORAGE_META_KEY,JSON.stringify(clean),"local-storage-meta");}catch(_){}}
function markAccountLocalStorageKeyChanged(key,opts){const k=String(key||"");if(!accountSyncShouldMirrorLocalStorageKey(k))return;const options=opts&&typeof opts==="object"?opts:{};const meta=readAccountLocalStorageMeta();meta[k]={updatedAt:Math.max(1,Number(options.updatedAt||Date.now())||Date.now()),deleted:!!options.deleted};writeAccountLocalStorageMeta(meta);if(!options.fromCloud)markCloudSyncDirty("local-storage:"+k.slice(0,60));}
let __accountLocalStorageApplyFromCloud=false;function installAccountLocalStorageMirrorMetadata(){try{if(window.__mkAccountLocalStorageMirrorMetadataV1)return;window.__mkAccountLocalStorageMirrorMetadataV1=true;const proto=window.Storage&&window.Storage.prototype;if(!proto||!proto.setItem||!proto.removeItem)return;const rawSet=proto.setItem;const rawRemove=proto.removeItem;proto.setItem=function patchedSetItem(key,value){const res=rawSet.apply(this,arguments);try{if(this===window.localStorage)markAccountLocalStorageKeyChanged(key,{fromCloud:__accountLocalStorageApplyFromCloud});}catch(_){}
return res;};proto.removeItem=function patchedRemoveItem(key){const res=rawRemove.apply(this,arguments);try{if(this===window.localStorage)markAccountLocalStorageKeyChanged(key,{deleted:true,fromCloud:__accountLocalStorageApplyFromCloud});}catch(_){}
return res;};}catch(_){}}
function localStorageMirrorEntryForKey(key,now){const k=String(key||"");if(!accountSyncShouldMirrorLocalStorageKey(k))return null;let value=null;try{value=localStorage.getItem(k);}catch(_){return null;}
const meta=readAccountLocalStorageMeta();const rec=meta[k]&&typeof meta[k]==="object"?meta[k]:{};let updatedAt=Math.max(0,Number(rec.updatedAt||rec.updated_at||rec.ts||0)||0);if(!updatedAt&&value!=null){updatedAt=Math.max(1,Number(readLastCloudSyncAt()||0)||Number(now||Date.now())||Date.now());meta[k]={updatedAt,deleted:false};writeAccountLocalStorageMeta(meta);}
if(value==null){if(rec&&rec.deleted&&updatedAt)return{deleted:true,updatedAt};return null;}
if(String(value).length>ACCOUNT_SYNC_LOCALSTORAGE_VALUE_MAX)return null;return{value:String(value),updatedAt:updatedAt||Math.max(1,Number(now||Date.now())||Date.now()),deleted:false};}
function accountLocalStorageSnapshotForSync(){const now=Date.now();const keys={};let total=0;try{for(let i=0;i<localStorage.length;i+=1){const key=localStorage.key(i);const rec=localStorageMirrorEntryForKey(key,now);if(!rec)continue;const bytes=rec.deleted?64:String(rec.value||"").length;if(total+bytes>ACCOUNT_SYNC_LOCALSTORAGE_TOTAL_MAX)continue;keys[String(key)]=rec;total+=bytes;}
const meta=readAccountLocalStorageMeta();Object.entries(meta).forEach(([key,rec])=>{if(keys[key]||!accountSyncShouldMirrorLocalStorageKey(key))return;const r=rec&&typeof rec==="object"?rec:{};if(!r.deleted)return;keys[key]={deleted:true,updatedAt:Math.max(1,Number(r.updatedAt||0)||now)};});}catch(_){}
return{version:1,updatedAt:now,keys};}
function applyAccountLocalStorageSnapshotFromCloud(store){const src=store&&typeof store==="object"&&!Array.isArray(store)?store:{};const entries=src.keys&&typeof src.keys==="object"&&!Array.isArray(src.keys)?src.keys:src;if(!entries||typeof entries!=="object")return false;const meta=readAccountLocalStorageMeta();let changed=false;Object.entries(entries).forEach(([key,value])=>{const k=String(key||"");if(!accountSyncShouldMirrorLocalStorageKey(k))return;const rec=value&&typeof value==="object"&&!Array.isArray(value)?value:{value:String(value==null?"":value),updatedAt:1};const cloudAt=Math.max(0,Number(rec.updatedAt||rec.updated_at||rec.ts||0)||0);const localAt=Math.max(0,Number(meta[k]&&(meta[k].updatedAt||meta[k].updated_at||meta[k].ts)||0)||0);if(cloudAt&&localAt&&cloudAt<localAt)return;try{__accountLocalStorageApplyFromCloud=true;if(rec.deleted){if(localStorage.getItem(k)!=null){localStorage.removeItem(k);changed=true;}
meta[k]={updatedAt:cloudAt||Date.now(),deleted:true};}else{const next=String(rec.value==null?"":rec.value);if(next.length>ACCOUNT_SYNC_LOCALSTORAGE_VALUE_MAX)return;if(localStorage.getItem(k)!==next){localStorage.setItem(k,next);changed=true;}
meta[k]={updatedAt:cloudAt||Date.now(),deleted:false};}}catch(_){}finally{__accountLocalStorageApplyFromCloud=false;}});writeAccountLocalStorageMeta(meta);return changed;}
function markCloudSyncDirty(reason){const r=String(reason||"");if(/^cloud-sync/i.test(r)||r==="notification-badge")return;writeNumberLocal(CLOUD_SYNC_DIRTY_KEY,Date.now());}
function cloudSyncDirtyAt(){return readNumberLocal(CLOUD_SYNC_DIRTY_KEY,0);}
function readLastCloudSyncAt(){return readNumberLocal(CLOUD_SYNC_LAST_KEY,0);}
function readLastNotificationBadgeAt(){return readNumberLocal(NOTIFICATION_BADGE_LAST_KEY,0);}
function touchNotificationBadgeRefresh(){writeNumberLocal(NOTIFICATION_BADGE_LAST_KEY,Date.now());}
function readLastOnlineProfileAt(){return readNumberLocal(PROFILE_ONLINE_LAST_KEY,0);}
function touchOnlineProfileRefresh(){writeNumberLocal(PROFILE_ONLINE_LAST_KEY,Date.now());}
function accountSyncClearDisposableLocalStorage(reason){const remove=[];try{for(let i=localStorage.length-1;i>=0;i-=1){const k=String(localStorage.key(i)||"");if(!k)continue;if(k.startsWith(API_GET_CACHE_PREFIX)||k.startsWith("__mk_views30d_cache")||k.startsWith("mk_last_updated_page_fact_"))remove.push(k);}
remove.forEach((k)=>{try{localStorage.removeItem(k);}catch(_){}});if(remove.length){try{sessionStorage.setItem("mk_account_sync_last_storage_cleanup_v1",JSON.stringify({ts:Date.now(),reason:String(reason||"sync-write"),count:remove.length}));}catch(_){}}}catch(_){}
return remove.length;}
function safeSetLocalStorageItem(key,text,reason){const k=String(key||"");const v=String(text==null?"":text);const attempt=()=>{try{localStorage.setItem(k,v);return localStorage.getItem(k)===v;}catch(_){return false;}};if(attempt())return true;accountSyncClearDisposableLocalStorage(reason||k);return attempt();}
function writeLocalArray(key,arr,maxLen){return safeSetLocalStorageItem(key,JSON.stringify((Array.isArray(arr)?arr:[]).slice(0,maxLen||100)),"write-array:"+String(key||""));}
function writeJsonLocal(key,value){try{return safeSetLocalStorageItem(key,JSON.stringify(value),"write-json:"+String(key||""));}catch(_){return false;}}
function localSyncQueueRead(){const arr=readJsonLocal(LOCAL_SYNC_QUEUE_KEY,[]);return Array.isArray(arr)?arr.filter((x)=>x&&typeof x==="object"):[];}
function compactLocalSyncQueue(queue){const input=(Array.isArray(queue)?queue:[]).map(normaliseQueuedTask);const lastPageAction=new Set();const lastAiQuizActivity=new Set();const out=[];for(let i=input.length-1;i>=0;i-=1){const item=input[i];if(item.kind==="pageActionSet"){const body=item.body&&typeof item.body==="object"?item.body:{};const key=`${String(body.path || "")}::${String(body.action || "")}`;if(!key.trim()||lastPageAction.has(key))continue;lastPageAction.add(key);}
if(item.kind==="activity"&&String(item.endpoint||"")==="/activity"){const body=item.body&&typeof item.body==="object"?item.body:{};const metric=String(body.metric||"").trim().toLowerCase().replace(/[\s-]+/g,"_");if(metric==="ai_quiz"||metric==="ai_quiz_attempt"){const d=body.details&&typeof body.details==="object"?body.details:{};const src=String(d.source||"").trim().toLowerCase();if((src==="ai-quiz-result-visible"||src==="ai-quiz-result-action-visible")&&!aiQuizVisibleTextLooksLikeRealResult(d.textSignature||d.text_signature||d.resultText||d.result_text||""))continue;const when=Number(d.completedAt||d.completed_at||d.eventClientTs||item.createdAt||Date.now())||Date.now();let day="today";try{day=new Date(when).toISOString().slice(0,10);}catch(_){}
const sig=String(d.resultId||d.result_id||d.sessionId||d.session_id||d.clientDedupeKey||d.textSignature||d.text_signature||d.signature||d.source||"result").slice(0,260);const key=`${String(body.path || "")}:${day}:${sig}`;if(lastAiQuizActivity.has(key))continue;lastAiQuizActivity.add(key);}}
out.push(item);}
out.reverse();const seen=new Set();return out.filter((item)=>{if(seen.has(item.id))return false;seen.add(item.id);return true;}).slice(-LOCAL_SYNC_QUEUE_MAX);}
function localSyncQueueWrite(queue){return writeJsonLocal(LOCAL_SYNC_QUEUE_KEY,compactLocalSyncQueue(queue));}
function localSyncQueueSize(){return localSyncQueueRead().length;}
function enqueueLocalSyncTask(task){const item=normaliseQueuedTask(Object.assign({},task||{},{updatedAt:Date.now()}));const q=localSyncQueueRead();q.push(item);localSyncQueueWrite(q);markCloudSyncDirty("local-sync-queue");try{window.dispatchEvent(new CustomEvent("mk-local-sync-queue-change",{detail:{size:localSyncQueueSize(),kind:item.kind||""}}));}catch(_){}
scheduleLocalSyncQueueFlush(LOCAL_SYNC_QUEUE_INTERVAL_MS);return item;}
function pageActionPathKeySet(path){const base=pageActionPathKey(path);const out=new Set();const add=(value)=>{const k=pageActionPathKey(value);if(!k)return;out.add(k);if(/\.html$/i.test(k))out.add(k.replace(/\.html$/i,""));else if(k.includes("/"))out.add(`${k}.html`);};add(base);if(base){add(base.replace(/[_\s]+/g,"-").replace(/-+/g,"-"));add(base.replace(/[-\s]+/g,"_").replace(/_+/g,"_"));}
return out;}
function pageActionPathMatches(a,b){const aa=pageActionPathKeySet(a);const bb=pageActionPathKeySet(b);for(const k of aa){if(bb.has(k))return true;}
return false;}
function pendingPageActionState(path){const out={};for(const item of localSyncQueueRead()){if(!item||item.kind!=="pageActionSet")continue;const body=item.body&&typeof item.body==="object"?item.body:{};if(!pageActionPathMatches(body.path||"",path||""))continue;const a=String(body.action||"");if(a)out[a]=!!body.active;}
return out;}
function pageActionMapForPathFromLocal(path){const actions={};try{if(window.MkAccountData&&typeof window.MkAccountData.getLocalPageActionMap==="function"){Object.assign(actions,window.MkAccountData.getLocalPageActionMap(path)||{});}}catch(_){}
getLocalPageActions().forEach((x)=>{if(x&&pageActionPathMatches(x.path||"",path||"")&&isActiveSavedPageAction(x.action))actions[String(x.action)]=true;});Object.assign(actions,pendingPageActionState(path));return actions;}
function apiGetCacheKey(path){return API_GET_CACHE_PREFIX+String(path||"").slice(0,500);}
function readCachedApiGet(path,maxAge){if(!shouldCacheApiGet(path))return null;const row=readJsonLocal(apiGetCacheKey(path),null);if(!row||typeof row!=="object")return null;const ts=Number(row.ts||0);if(!ts||Date.now()-ts>Math.max(1000,Number(maxAge||API_GET_CACHE_MAX_AGE_MS)))return null;return row.data||null;}
function writeCachedApiGet(path,data){if(shouldCacheApiGet(path)&&data)writeJsonLocal(apiGetCacheKey(path),{ts:Date.now(),data});}
let __localSyncQueueFlushTimer=0;let __localSyncQueueFlushAt=0;let __localSyncQueueFlushPromise=null;let __localSyncQueueFlushContext=null;function pageActionResponseIsValid(data){return!!data&&data.ok===true&&!!data.actions&&typeof data.actions==="object"&&!Array.isArray(data.actions)&&savedPageActions().every((action)=>!Object.prototype.hasOwnProperty.call(data.actions,action)||typeof data.actions[action]==="boolean");}
async function flushPageActionSetTask(item){const context=captureSocialAccountContext();if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();const body=item&&item.body&&typeof item.body==="object"?item.body:{};const path=String(body.path||"");const action=String(body.action||"");const desired=!!body.active;if(!path||!action)return{ok:true,skipped:true};const state=await apiGet(`/page-state?path=${encodeURIComponent(path)}&visitorId=${encodeURIComponent(body.visitorId || getVisitorId())}`);if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();if(!pageActionResponseIsValid(state))return{ok:false,error:state&&state.error||"page_action_state_unavailable"};const serverActions=state.actions;if(!!serverActions[action]===desired)return{ok:true,already:true};const res=await apiPost("/page-action/toggle",{path,title:body.title||path,visitorId:body.visitorId||getVisitorId(),action});if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();if(!res||res.ok===false)return res||{ok:false,error:"page_action_sync_failed"};if(!pageActionResponseIsValid(res))return{ok:false,error:"page_action_response_invalid"};const nextActions=res.actions;if(!!nextActions[action]!==desired)return{ok:false,error:"page_action_state_mismatch"};return res;}
async function flushOneLocalSyncTask(item){const task=normaliseQueuedTask(item);if(task.kind==="pageActionSet")return flushPageActionSetTask(task);const endpoint=String(task.endpoint||"");if(!endpoint)return{ok:true,skipped:true};return apiPost(endpoint,task.body&&typeof task.body==="object"?task.body:{});}
async function flushLocalSyncQueue(opts){const options=opts&&typeof opts==="object"?opts:{};const force=!!options.force;const context=captureSocialAccountContext();if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();if(!force&&shouldSkipMobileBackgroundWork(options.reason||"local-sync-queue"))return{ok:true,skipped:true,lowHeat:true};if(pageIsHiddenForAccountSync()&&!force)return null;if(__localSyncQueueFlushPromise&&socialAccountContextIsCurrent(__localSyncQueueFlushContext))return __localSyncQueueFlushPromise;const run=(async()=>{const now=Date.now();const lock=readJsonLocal(LOCAL_SYNC_QUEUE_LOCK_KEY,null);if(!force&&lock&&Number(lock.until||0)>now)return{ok:true,locked:true};writeJsonLocal(LOCAL_SYNC_QUEUE_LOCK_KEY,{until:now+25000,startedAt:now});const q=compactLocalSyncQueue(localSyncQueueRead());if(!q.length){writeNumberLocal(LOCAL_SYNC_QUEUE_LAST_KEY,now);try{localStorage.removeItem(LOCAL_SYNC_QUEUE_LOCK_KEY);}catch(_){}return{ok:true,empty:true};}
const completedVersions=new Set();const failedVersions=new Map();let sent=0;const maxPerFlush=force?80:28;for(let i=0;i<q.length;i+=1){const item=q[i];if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();if(sent>=maxPerFlush)continue;try{const res=await flushOneLocalSyncTask(item);if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();if(res&&res.ok!==false){sent+=1;completedVersions.add(JSON.stringify(item));}
else failedVersions.set(JSON.stringify(item),Object.assign({},item,{attempts:Math.max(0,Number(item.attempts||0))+1,lastError:String(res&&res.error||"sync_failed").slice(0,160),updatedAt:Date.now()}));}catch(err){if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();failedVersions.set(JSON.stringify(item),Object.assign({},item,{attempts:Math.max(0,Number(item.attempts||0))+1,lastError:String(err&&err.message||err||"sync_failed").slice(0,160),updatedAt:Date.now()}));}}
if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();const remaining=compactLocalSyncQueue(localSyncQueueRead()).filter((item)=>!completedVersions.has(JSON.stringify(item))).map((item)=>failedVersions.get(JSON.stringify(item))||item);if(!localSyncQueueWrite(remaining)){try{localStorage.removeItem(LOCAL_SYNC_QUEUE_LOCK_KEY);}catch(_){}
scheduleLocalSyncQueueFlush(LOCAL_SYNC_QUEUE_INTERVAL_MS);return{ok:false,sent,remaining:localSyncQueueSize(),error:"local_sync_queue_ack_failed"};}
writeNumberLocal(LOCAL_SYNC_QUEUE_LAST_KEY,Date.now());try{localStorage.removeItem(LOCAL_SYNC_QUEUE_LOCK_KEY);}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-local-sync-queue-flushed",{detail:{sent,remaining:localSyncQueueSize()}}));}catch(_){}
if(sent>0){scheduleCloudSync("queue-flushed",{delay:isMobilePowerSensitiveViewport()?4000:900,force:false});refreshAccountXpSoon("local-sync-queue",isMobilePowerSensitiveViewport()?2500:800);}
if(localSyncQueueSize()>0)scheduleLocalSyncQueueFlush(LOCAL_SYNC_QUEUE_INTERVAL_MS);return{ok:true,sent,remaining:localSyncQueueSize()};})();__localSyncQueueFlushPromise=run;__localSyncQueueFlushContext=context;try{return await run;}finally{if(__localSyncQueueFlushPromise===run){__localSyncQueueFlushPromise=null;__localSyncQueueFlushContext=null;}}}
function scheduleLocalSyncQueueFlush(delay,opts){const options=opts&&typeof opts==="object"?opts:{};if(!options.force&&shouldSkipMobileBackgroundWork(options.reason||"local-sync-queue-schedule"))return false;const d=Math.max(0,Number(delay==null?LOCAL_SYNC_QUEUE_INTERVAL_MS:delay)||0);const fireAt=Date.now()+d;if(__localSyncQueueFlushTimer&&__localSyncQueueFlushAt>0&&__localSyncQueueFlushAt<=fireAt)return true;try{window.clearTimeout(__localSyncQueueFlushTimer||0);}catch(_){}
__localSyncQueueFlushAt=fireAt;__localSyncQueueFlushTimer=window.setTimeout(()=>{__localSyncQueueFlushTimer=0;__localSyncQueueFlushAt=0;flushLocalSyncQueue(options).catch(()=>{});},d);return true;}
function activityChanged(type,detail){markCloudSyncDirty(type);try{window.dispatchEvent(new CustomEvent("mk-local-activity-change",{detail:Object.assign({type},detail||{})}));}catch(_){}}
const AVATAR_FRAME_DEFS_LOCAL=[{id:"level-1",level:1,label:"Clean Ring"},{id:"level-2",level:2,label:"Bronze Studs"},{id:"level-3",level:3,label:"Silver Compass"},{id:"level-4",level:4,label:"Golden Beads"},{id:"level-5",level:5,label:"Emerald Laurel"},{id:"level-6",level:6,label:"Sapphire Crystal"},{id:"level-7",level:7,label:"Amethyst Stars"},{id:"level-8",level:8,label:"Ruby Flame"},{id:"level-9",level:9,label:"Aurora Wings"},{id:"level-10",level:10,label:"Royal Crown"},];function avatarFrameLabelLocal(frameId){const id=cleanAvatarFrameLocal(frameId);const found=AVATAR_FRAME_DEFS_LOCAL.find((f)=>f.id===id);return found?found.label:`Level ${avatarFrameLevelLocal(id)}`;}
function avatarFramesForLevelLocal(level){const lvl=Math.max(1,Math.min(10,Math.floor(Number(level||1))));return AVATAR_FRAME_DEFS_LOCAL.map((f)=>Object.assign({},f,{unlocked:Number(f.level||1)<=lvl}));}
function normaliseUnlockedAvatarFramesLocal(value,fallbackLevel){const lvl=Math.max(1,Math.min(10,Math.floor(Number(fallbackLevel||1))));const byId=new Map();(Array.isArray(value)?value:[]).forEach((raw)=>{const obj=raw&&typeof raw==="object"?raw:{id:raw};const id=cleanAvatarFrameLocal(obj.id||obj.frame||obj.avatarFrame||obj.selectedFrame||"level-1");const level=Math.max(1,Math.min(10,Math.floor(Number(obj.level||avatarFrameLevelLocal(id))||1)));const known=AVATAR_FRAME_DEFS_LOCAL.find((f)=>f.id===id)||{};byId.set(id,{id,level,label:String(obj.label||known.label||avatarFrameLabelLocal(id)),unlocked:obj.unlocked===true||level<=lvl});});return AVATAR_FRAME_DEFS_LOCAL.map((def)=>{const row=byId.get(def.id)||{};return Object.assign({},def,row,{unlocked:row.unlocked===true||Number(def.level||1)<=lvl});});}
function getDeviceName(){try{const s=cleanDeviceNameLocal(localStorage.getItem(LOCAL_DEVICE_NAME_KEY)||"");if(s)return s;}catch(_){}
const d=defaultDeviceName();try{localStorage.setItem(LOCAL_DEVICE_NAME_KEY,d);}catch(_){}
return d;}
function setDeviceNameLocal(name){const nm=cleanDeviceNameLocal(name)||defaultDeviceName();try{localStorage.setItem(LOCAL_DEVICE_NAME_KEY,nm);}catch(_){}
return nm;}
function readLocalProfile(){try{const obj=JSON.parse(localStorage.getItem(LOCAL_PROFILE_KEY)||"null");if(!obj||typeof obj!=="object")return{name:getStoredName(),avatar:"",avatarFrame:"level-1",unlockedAvatarFrames:avatarFramesForLevelLocal(1),level:1,highestLevelSeen:1,lastLevelUpAt:0,bio:"",isPublic:false,privacy:defaultNewAccountPrivacy(),accountKey:"",nameChangedAt:0,avatarChangedAt:0,nameCooldownUntil:0,avatarCooldownUntil:0,cooldownDays:7};const isPublic=obj.isPublic!=null?!!obj.isPublic:!!(obj.privacy&&obj.privacy.profilePublic);return{name:cleanProfileNameLocal(obj.name||getStoredName()),avatar:cleanAvatarLocal(obj.avatar||""),avatarFrame:cleanAvatarFrameLocal(obj.avatarFrame||obj.selectedAvatarFrame||"level-1"),unlockedAvatarFrames:normaliseUnlockedAvatarFramesLocal(obj.unlockedAvatarFrames||obj.unlockedFrames,Math.max(Number(obj.highestLevelSeen||0),Number(obj.level||1))),level:Math.max(1,Math.min(10,Math.floor(Number(obj.level||1)||1))),highestLevelSeen:Math.max(1,Math.min(10,Math.floor(Number(obj.highestLevelSeen||obj.highest_level_seen||obj.level||1)||1))),lastLevelUpAt:Number(obj.lastLevelUpAt||obj.last_level_up_at||0),bio:cleanProfileBioLocal(obj.bio||obj.description||obj.intro||""),isPublic,privacy:normalisePrivacy(obj.privacy,isPublic),accountKey:String(obj.accountKey||""),updatedAt:Number(obj.updatedAt||0),nameChangedAt:Number(obj.nameChangedAt||0),avatarChangedAt:Number(obj.avatarChangedAt||0),nameCooldownUntil:Number(obj.nameCooldownUntil||(obj.nameChangedAt?Number(obj.nameChangedAt)+PROFILE_CHANGE_COOLDOWN_MS:0)),avatarCooldownUntil:Number(obj.avatarCooldownUntil||(obj.avatarChangedAt?Number(obj.avatarChangedAt)+PROFILE_CHANGE_COOLDOWN_MS:0)),cooldownDays:Number(obj.cooldownDays||7),};}catch(_){return{name:getStoredName(),avatar:"",avatarFrame:"level-1",unlockedAvatarFrames:avatarFramesForLevelLocal(1),level:1,highestLevelSeen:1,lastLevelUpAt:0,bio:"",isPublic:false,privacy:defaultNewAccountPrivacy(),accountKey:"",nameChangedAt:0,avatarChangedAt:0,nameCooldownUntil:0,avatarCooldownUntil:0,cooldownDays:7};}}
function writeLocalProfile(profile,options){const prev=readLocalProfile();const src=profile&&typeof profile==="object"?profile:{};const has=(key)=>Object.prototype.hasOwnProperty.call(src,key);const firstPresent=(...keys)=>{for(const key of keys)if(has(key))return src[key];return undefined;};const rawPrivacy=has("privacy")?src.privacy:prev.privacy;const isPublic=has("isPublic")?!!src.isPublic:!!(rawPrivacy&&rawPrivacy.profilePublic);const hasBio=has("bio")||has("description")||has("intro");const nameChangedRaw=firstPresent("nameChangedAt","name_changed_at");const avatarChangedRaw=firstPresent("avatarChangedAt","avatar_changed_at");const nameCooldownRaw=firstPresent("nameCooldownUntil","name_cooldown_until");const avatarCooldownRaw=firstPresent("avatarCooldownUntil","avatar_cooldown_until");const nameChangedAt=nameChangedRaw!==undefined?Number(nameChangedRaw||0):Number(prev.nameChangedAt||0);const avatarChangedAt=avatarChangedRaw!==undefined?Number(avatarChangedRaw||0):Number(prev.avatarChangedAt||0);const p={name:has("name")?cleanProfileNameLocal(src.name):cleanProfileNameLocal(prev.name||getStoredName()),avatar:has("avatar")?cleanAvatarLocal(src.avatar):cleanAvatarLocal(prev.avatar||""),avatarFrame:cleanAvatarFrameLocal((has("avatarFrame")?src.avatarFrame:(has("selectedAvatarFrame")?src.selectedAvatarFrame:prev.avatarFrame))||"level-1"),level:Math.max(1,Math.min(10,Math.floor(Number(firstPresent("level","currentLevel")||prev.level||1)||1))),highestLevelSeen:Math.max(1,Math.min(10,Math.floor(Number(firstPresent("highestLevelSeen","highest_level_seen")||firstPresent("level","currentLevel")||prev.highestLevelSeen||prev.level||1)||1))),lastLevelUpAt:Number(firstPresent("lastLevelUpAt","last_level_up_at")||prev.lastLevelUpAt||0),unlockedAvatarFrames:normaliseUnlockedAvatarFramesLocal(firstPresent("unlockedAvatarFrames","unlockedFrames")||prev.unlockedAvatarFrames,Math.max(Number(firstPresent("highestLevelSeen","highest_level_seen")||0),Number(firstPresent("level","currentLevel")||0),Number(prev.highestLevelSeen||prev.level||1))),bio:hasBio?cleanProfileBioLocal(src.bio||src.description||src.intro||""):cleanProfileBioLocal(prev.bio||""),isPublic,privacy:normalisePrivacy(rawPrivacy,isPublic),accountKey:String(has("accountKey")?(src.accountKey||""):(prev.accountKey||"")),nameChangedAt,avatarChangedAt,nameCooldownUntil:nameCooldownRaw!==undefined?Number(nameCooldownRaw||0):(nameChangedRaw!==undefined?(nameChangedAt?nameChangedAt+PROFILE_CHANGE_COOLDOWN_MS:0):Number(prev.nameCooldownUntil||0)),avatarCooldownUntil:avatarCooldownRaw!==undefined?Number(avatarCooldownRaw||0):(avatarChangedRaw!==undefined?(avatarChangedAt?avatarChangedAt+PROFILE_CHANGE_COOLDOWN_MS:0):Number(prev.avatarCooldownUntil||0)),cooldownDays:Number(has("cooldownDays")?(src.cooldownDays||7):(prev.cooldownDays||7)),updatedAt:Number(has("updatedAt")?(src.updatedAt||Date.now()):Date.now()),};p.isPublic=!!p.privacy.profilePublic;const workspaces=window.MkAccountWorkspaces;if(workspaces&&typeof workspaces.activeOwner==="function"&&typeof workspaces.ownerForAccount==="function"&&workspaces.activeOwner()!==workspaces.ownerForAccount(p.accountKey)){const message="Account identity needs recovery. Your local progress is preserved; connect the intended account in Account before syncing.";setIdentityRecoveryStatus(message,captureSocialAccountContext());if(options&&options.requirePersistence)throw new Error(message);return prev;}
try{const serialized=JSON.stringify(p);localStorage.setItem(LOCAL_PROFILE_KEY,serialized);if(localStorage.getItem(LOCAL_PROFILE_KEY)!==serialized)throw new Error("Could not verify the saved local profile.");}catch(err){if(options&&options.requirePersistence)throw err;setIdentityRecoveryStatus("This browser could not save the local profile. Free browser storage and reload to recover the cloud profile.",captureSocialAccountContext());return prev;}
if(p.name)setStoredName(p.name);activityChanged("profile",p);return p;}
function responseProfileWithPrivacy(response){const data=response&&typeof response==="object"?response:{};const profile=data.profile&&typeof data.profile==="object"?data.profile:null;if(!profile)return null;const privacy=data.privacy||profile.privacy||null;return privacy?Object.assign({},profile,{privacy}):profile;}
async function clearLocalAccountState(options){const opts=options&&typeof options==="object"?options:{};const accountContext=captureSocialAccountContext();const workspaces=window.MkAccountWorkspaces||null;if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!workspaces||typeof workspaces.activateGuest!=="function")return identityProfileFailure("Account storage is not ready. Reload before removing this account from the browser.",accountContext,false);let result;window.__mkAccountWorkspaceSwitching=true;try{result=await workspaces.activateGuest({expectedOwner:accountContext.owner,discardCurrent:!!opts.clearActivity,reason:opts.clearActivity?"account-local-delete":"account-logout",commit:()=>{for(const key of[LOCAL_PROFILE_KEY,"mk_comment_name_v1","mk_hot_visitor_id_v1"]){localStorage.removeItem(key);if(localStorage.getItem(key)!==null)throw new Error("Could not remove the local account identity.");}
for(const key of[CLOUD_SYNC_LAST_KEY,ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY,ACCOUNT_SYNC_LAST_RESULT_KEY,ACCOUNT_DATA_SYNC_SUMMARY_KEY]){try{localStorage.removeItem(key);}catch(_){}}
return readLocalProfile();}});}catch(error){result={ok:false,error:String(error&&error.message||error)};}finally{window.__mkAccountWorkspaceSwitching=false;}
if(!result||!result.ok){return identityProfileFailure("This browser could not finish removing the account. Keep its local data and retry. "+String(result&&result.error||""),accountContext,false);}
activityChanged("profile-cleared",{clearActivity:!!opts.clearActivity});try{window.dispatchEvent(new CustomEvent("conceptMasteryChanged"));}catch(_){}
return{ok:true,profile:result.commitResult||readLocalProfile()};}
function publicAvatarLocalUrl(avatar){const raw=String(avatar||"").trim();const avatarPathUrl=(key,base)=>{try{const safe=String(key||"").split("/").map((part)=>encodeURIComponent(part)).join("/");return new URL(`/avatar/${safe}`,base||API_BASE).toString();}
catch(_){return"";}};const avatarPathKey=(value)=>{try{const key=decodeURIComponent(String(value||"").replace(/^\/avatar\//i,""));if(key&&key.indexOf("..")<0&&key[0]!=="/"&&key.indexOf("comment-avatars/")===0)return key;}catch(_){}
return"";};if(/^\/avatar\//i.test(raw)){const key=avatarPathKey(raw);return key?avatarPathUrl(key,API_BASE):raw;}
if(!/^r2:/i.test(raw)){try{const u=/^https?:\/\//i.test(raw)?new URL(raw):null;if(u&&u.pathname.indexOf("/avatar/")===0){const key=avatarPathKey(u.pathname);if(key)return avatarPathUrl(key,API_BASE);}}catch(_){}
return raw;}
const key=raw.replace(/^r2:/i,"");if(!key||key.indexOf("..")>=0||key[0]==="/"||key.indexOf("comment-avatars/")!==0)return"";return avatarPathUrl(key,API_BASE);}
function avatarHtml(name,avatar,avatarFrame){const av=cleanAvatarLocal(publicAvatarLocalUrl(avatar));const frame=cleanAvatarFrameLocal(avatarFrame||"level-1");const frameCls=` mk-avatar-frame mk-avatar-frame-${frame}`;const frameLabel=`${avatarFrameLabelLocal(frame)} avatar frame`;const frameSvg=avatarFrameSvgLocal(frame);if(isImageAvatar(av)){return`<span class="mk-comment-avatar has-image${frameCls}" title="${escapeAttr(frameLabel)}" aria-hidden="true"><span class="mk-avatar-core"><img src="${escapeAttr(av)}" alt="" loading="lazy" decoding="async"></span>${frameSvg}</span>`;}
const initialStyle=isInitialAvatarStyleValue(av)?parseInitialAvatarStyle(av):null;const txt=initialStyle?displayInitials(name):(av||displayInitials(name));const emojiCls=av&&!initialStyle&&!/^[A-Za-z0-9]{1,3}$/i.test(av)?" is-emoji-avatar":"";const styleAttr=initialStyle?` style="${initialStyle.color.bg ? `background:${escapeAttr(initialStyle.color.bg)};` : ""}${initialStyle.text.fg ? `color:${escapeAttr(initialStyle.text.fg)};` : ""}${initialStyle.font.stack !== "inherit" ? `font-family:${escapeAttr(initialStyle.font.stack)};` : ""}${initialStyle.scale.scale !== 1 ? `font-size:${escapeAttr(String(initialStyle.scale.scale))}em;` : ""}"`:"";let core=escapeHtml(txt);try{const item=av&&__commentEmojiByText&&__commentEmojiByText.get(normaliseNotoEmojiText(av));const cp=String(item&&item.codepoint||"").replace(/[^0-9a-f_]/gi,"").toLowerCase();const ent=cp?emojiEntitlements():null;const src=ent&&emojiFamilyOwns(ent.avatarDynamic,cp)?item.animatedUrl:(ent&&emojiFamilyOwns(ent.avatarStatic,cp)?item.staticUrl:"");if(src)core=`<img src="${escapeAttr(src)}" alt="" loading="lazy" decoding="async">`;}catch(_){}
return`<span class="mk-comment-avatar${emojiCls}${frameCls}" title="${escapeAttr(frameLabel)}" aria-hidden="true"><span class="mk-avatar-core"${styleAttr}>${core}</span>${frameSvg}</span>`;}
const NOTO_EMOJI_DATA_URL="assets/noto-emoji-animation.json";const NOTO_EMOJI_ASSET_BASE="https://fonts.gstatic.com/s/e/notoemoji/latest/";const COMMENT_EMOJI_RECENT_KEY="mk_comment_recent_noto_emoji_v1";const COMMENT_EMOJI_RECENT_CATEGORY="__recent__";const COMMENT_EMOJI_UNLOCKED_AVATAR_CATEGORY="__avatar_unlocked__";const COMMENT_EMOJI_RECENT_MAX=48;const COMMENT_EMOJI_DISPLAY_CATEGORY_ORDER=["Faces","Gestures","Emotions","Characters","Animals","Nature","Food","Travel","Activities","Objects","Symbols","Flags"];let __commentEmojiDataPromise=null;let __commentEmojiIcons=[];let __commentEmojiByText=new Map();let __commentEmojiByCodepoint=new Map();let __commentEmojiCategories=[];let __commentEmojiDataReady=false;let __commentEmojiExactRe=null;const COMMENT_EMOJI_SKIN_TONES=[{token:"",label:"Default"},{token:"1f3fb",label:"Light"},{token:"1f3fc",label:"Medium-light"},{token:"1f3fd",label:"Medium"},{token:"1f3fe",label:"Medium-dark"},{token:"1f3ff",label:"Dark"}];const COMMENT_EMOJI_SKIN_TONE_SET=new Set(["1f3fb","1f3fc","1f3fd","1f3fe","1f3ff"]);const COMMENT_EMOJI_COLOR_FAMILIES=[{label:"Heart color",members:["2764_fe0f","1f9e1","1f49b","1f49a","1f499","1fa75","1f49c","1f90e","1f5a4","1fa76","1f90d","1fa77"]}];let __commentEmojiVariantFamilies=new Map();let __commentEmojiVariantBaseByCp=new Map();function emojiBaseCodepoint(codepoint){return String(codepoint||"").toLowerCase().split("_").filter((t)=>t&&!COMMENT_EMOJI_SKIN_TONE_SET.has(t)).join("_");}
function emojiToneToken(codepoint){return String(codepoint||"").toLowerCase().split("_").find((t)=>COMMENT_EMOJI_SKIN_TONE_SET.has(t))||"";}
function emojiFamilyBase(codepoint){const cp=String(codepoint||"").toLowerCase();if(__commentEmojiVariantBaseByCp.has(cp))return __commentEmojiVariantBaseByCp.get(cp);const stripped=emojiBaseCodepoint(cp);if(__commentEmojiVariantBaseByCp.has(stripped))return __commentEmojiVariantBaseByCp.get(stripped);return stripped;}
function emojiFamilyCodepoints(codepoint){const base=emojiFamilyBase(codepoint);const fam=__commentEmojiVariantFamilies.get(base);if(fam&&fam.members&&fam.members.length)return fam.members.map((m)=>m.codepoint);return[base];}
function emojiFamilyOwns(entMap,codepoint){if(!entMap)return false;const sharedOwns=window.MkEC&&window.MkEC.emojiEntitlementFamilyOwns;if(typeof sharedOwns==="function")return sharedOwns(entMap,codepoint);const cp=String(codepoint||"").toLowerCase();if(cp&&entMap[cp])return true;return emojiFamilyCodepoints(cp).some((c)=>!!entMap[c]);}
function emojiVariantFamilyRep(codepoint){const fam=__commentEmojiVariantFamilies.get(emojiFamilyBase(codepoint));return fam&&fam.rep?fam.rep:null;}
function notoEmojiAssetUrl(codepoint,kind){const cp=String(codepoint||"").replace(/[^0-9a-f_]/gi,"").toLowerCase();if(!cp)return"";if(kind==="static")return`${NOTO_EMOJI_ASSET_BASE}${cp}/emoji.svg`;if(kind==="gif")return`${NOTO_EMOJI_ASSET_BASE}${cp}/512.gif`;return`${NOTO_EMOJI_ASSET_BASE}${cp}/512.webp`;}
function buildCommentEmojiData(raw){const iconsRaw=raw&&Array.isArray(raw.icons)?raw.icons:[];const icons=[];const byText=new Map();const byCodepoint=new Map();const texts=new Set();iconsRaw.forEach((src)=>{const codepoint=String(src&&src.codepoint||"").toLowerCase();const emoji=emojiTextFromCodepoint(codepoint);if(!codepoint||!emoji)return;const officialCategory=String(src.categories&&src.categories[0]||"Emoji");const category=commentEmojiDisplayCategory(src,officialCategory);const tags=Array.isArray(src.tags)?src.tags:[];const label=String(tags[0]||src.name||emoji).replace(/^:+|:+$/g,"").replace(/[-_]+/g," ");const toneToken=emojiToneToken(codepoint);const item={emoji,codepoint,category,officialCategory,label,popularity:Number(src.popularity||0),toneToken,baseCodepoint:emojiBaseCodepoint(codepoint),isToneVariant:!!toneToken,staticUrl:notoEmojiAssetUrl(codepoint,"static"),animatedUrl:notoEmojiAssetUrl(codepoint,"animated")};icons.push(item);byCodepoint.set(codepoint,item);registerCommentEmojiAlias(byText,emoji,item);texts.add(emoji);const noVs=codepoint.replace(/_fe0f/g,"");if(noVs!==codepoint){const alias=emojiTextFromCodepoint(noVs);registerCommentEmojiAlias(byText,alias,item);if(alias)texts.add(alias);}});const variantFamilies=new Map();const variantBaseByCp=new Map();const registerFamily=(baseCp,label,rep,members)=>{rep.hasVariants=true;rep.variantLabel=label;rep.variantItems=members;variantFamilies.set(baseCp,{label,rep,members});members.forEach((m)=>{variantBaseByCp.set(m.codepoint,baseCp);if(m!==rep)m.isVariantMember=true;});};const toneGroups=new Map();icons.forEach((item)=>{if(!item.toneToken)return;let g=toneGroups.get(item.baseCodepoint);if(!g){g=[];toneGroups.set(item.baseCodepoint,g);}
g.push(item);});const toneOrder=(tok)=>{const i=COMMENT_EMOJI_SKIN_TONES.findIndex((t)=>t.token===tok);return i<0?99:i;};toneGroups.forEach((tones,baseCp)=>{tones.sort((a,b)=>toneOrder(a.toneToken)-toneOrder(b.toneToken));let rep=byCodepoint.get(baseCp)||null;if(!rep){rep=tones[0]||null;if(rep)rep.isToneVariant=false;}
if(!rep)return;const members=[rep].concat(tones.filter((t)=>t!==rep));registerFamily(baseCp,"Skin tone",rep,members);});COMMENT_EMOJI_COLOR_FAMILIES.forEach((famDef)=>{const members=famDef.members.map((cp)=>byCodepoint.get(String(cp).toLowerCase())).filter(Boolean);if(members.length<2)return;const rep=byCodepoint.get(String(famDef.members[0]).toLowerCase())||members[0];const ordered=[rep].concat(members.filter((m)=>m!==rep));registerFamily(rep.codepoint,famDef.label||"Color",rep,ordered);});__commentEmojiVariantFamilies=variantFamilies;__commentEmojiVariantBaseByCp=variantBaseByCp;__commentEmojiIcons=icons;__commentEmojiByText=byText;__commentEmojiByCodepoint=byCodepoint;const catSeen=new Set(icons.map((item)=>item.category));__commentEmojiCategories=COMMENT_EMOJI_DISPLAY_CATEGORY_ORDER.filter((cat)=>catSeen.has(cat)).concat(Array.from(catSeen).filter((cat)=>!COMMENT_EMOJI_DISPLAY_CATEGORY_ORDER.includes(cat)));__commentEmojiExactRe=texts.size?new RegExp(Array.from(texts).sort((a,b)=>b.length-a.length).map(escapeRegexLiteral).join("|"),"gu"):null;__commentEmojiDataReady=icons.length>0;return icons;}
function commentEmojiDataUrl(){try{return new URL(NOTO_EMOJI_DATA_URL,getSiteRootUrlForActivity()).toString();}catch(_){return NOTO_EMOJI_DATA_URL;}}
function loadCommentEmojiData(){if(__commentEmojiDataReady)return Promise.resolve(__commentEmojiIcons);if(__commentEmojiDataPromise)return __commentEmojiDataPromise;__commentEmojiDataPromise=fetchJsonWithRetry(commentEmojiDataUrl(),{cache:"force-cache",timeoutMs:9000},2).then((data)=>{buildCommentEmojiData(data);try{window.dispatchEvent(new CustomEvent("mk-comment-emoji-data-ready"));}catch(_){}
return __commentEmojiIcons;}).catch(()=>[]);return __commentEmojiDataPromise;}
function commentEmojiCategoryLabel(category){const c=String(category||"Emoji");if(c===COMMENT_EMOJI_RECENT_CATEGORY)return"Recent";if(c===COMMENT_EMOJI_UNLOCKED_AVATAR_CATEGORY)return"Owned";return commentEmojiOfficialCategoryLabel(c);}
function readRecentCommentEmojiCodepoints(){try{const arr=JSON.parse(localStorage.getItem(COMMENT_EMOJI_RECENT_KEY)||"[]");return(Array.isArray(arr)?arr:[]).map((x)=>String(x||"").replace(/[^0-9a-f_]/gi,"").toLowerCase()).filter(Boolean).slice(0,COMMENT_EMOJI_RECENT_MAX);}catch(_){return[];}}
function writeRecentCommentEmojiCodepoints(codepoints){try{localStorage.setItem(COMMENT_EMOJI_RECENT_KEY,JSON.stringify((Array.isArray(codepoints)?codepoints:[]).slice(0,COMMENT_EMOJI_RECENT_MAX)));}catch(_){}}
function recentCommentEmojiItems(){const items=[];readRecentCommentEmojiCodepoints().forEach((cp)=>{const item=__commentEmojiByCodepoint.get(cp);if(item)items.push(item);});return items;}
function rememberCommentEmojiUse(item){const cp=String(item&&item.codepoint||"").replace(/[^0-9a-f_]/gi,"").toLowerCase();if(!cp)return;const next=[cp].concat(readRecentCommentEmojiCodepoints().filter((x)=>x!==cp));writeRecentCommentEmojiCodepoints(next);}
function avatarUnlockedEmojiItems(){const ent=emojiEntitlements();const cps=new Set();[ent.avatarStatic,ent.avatarDynamic].forEach((group)=>{Object.keys(group||{}).forEach((cp)=>{const clean=String(cp||"").replace(/[^0-9a-f_]/gi,"").toLowerCase();if(clean)cps.add(clean);});});const items=[];cps.forEach((cp)=>{const item=__commentEmojiByCodepoint.get(cp)||__commentEmojiByCodepoint.get(cp.replace(/_fe0f/g,""));if(item)items.push(item);else{const emoji=emojiTextFromCodepoint(cp);if(emoji)items.push({emoji,codepoint:cp,category:COMMENT_EMOJI_UNLOCKED_AVATAR_CATEGORY,label:emoji,staticUrl:notoEmojiAssetUrl(cp,"static"),animatedUrl:notoEmojiAssetUrl(cp,"animated")});}});return items.sort((a,b)=>String(a.label||a.emoji||"").localeCompare(String(b.label||b.emoji||"")));}
function commentEmojiChoicesByCategory(opts){const out=new Map();if(opts&&opts.avatarUnlocked){const unlocked=avatarUnlockedEmojiItems();if(unlocked.length)out.set(COMMENT_EMOJI_UNLOCKED_AVATAR_CATEGORY,unlocked);}
const recent=opts&&opts.noRecent?[]:recentCommentEmojiItems();if(recent.length)out.set(COMMENT_EMOJI_RECENT_CATEGORY,recent);__commentEmojiCategories.forEach((cat)=>out.set(cat,[]));__commentEmojiIcons.forEach((item)=>{if(item.isVariantMember)return;const cat=item.category||"Emoji";if(!out.has(cat))out.set(cat,[]);out.get(cat).push(item);});return out;}
function profileEmojiChoices(){if(__commentEmojiIcons.length)return __commentEmojiIcons.filter((item)=>!item.isVariantMember).slice(0,120).map((item)=>item.emoji);loadCommentEmojiData();return"😀 😄 😊 🙂 😉 😍 😘 😎 🤓 🥳 😇 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐧 🐦 🐤 🦆 🐢 🌸 🌼 🌻 🌿 🍀 ⭐ ✨ ⚡ 🔥 🌈 🍎 🍓 🍒 🍰 ☕ 🎧 🎮 📚 💡 🚀 🎨 🏆 💎 💬".split(" ");}
const INITIAL_AVATAR_STYLE_PREFIX="init:";const INITIAL_AVATAR_FONTS=[{id:"clean",label:"Clean",stack:"inherit",price:0},{id:"serif",label:"Serif",stack:"Georgia, 'Times New Roman', serif",price:20},{id:"mono",label:"Mono",stack:"'SFMono-Regular', Consolas, 'Liberation Mono', monospace",price:20},{id:"round",label:"Round",stack:"'Arial Rounded MT Bold', 'Trebuchet MS', sans-serif",price:20},{id:"humanist",label:"Humanist",stack:"Aptos, Calibri, 'Segoe UI', sans-serif",price:20},{id:"geometric",label:"Geo",stack:"Avenir Next, Montserrat, Futura, sans-serif",price:20},{id:"editorial",label:"Editorial",stack:"'Playfair Display', Georgia, serif",price:20},{id:"condensed",label:"Narrow",stack:"'Arial Narrow', Roboto Condensed, sans-serif",price:20},{id:"soft",label:"Soft",stack:"Nunito, Quicksand, 'Trebuchet MS', sans-serif",price:20},{id:"slab",label:"Slab",stack:"Roboto Slab, Rockwell, Georgia, serif",price:20}];const INITIAL_AVATAR_TEXT_COLORS=[{id:"classic",label:"Classic",fg:"",price:0},{id:"ivory",label:"Ivory",fg:"#fff7ed",price:20},{id:"ink",label:"Ink",fg:"#111827",price:20},{id:"sage",label:"Sage",fg:"#84cc16",price:20},{id:"sky",label:"Sky",fg:"#38bdf8",price:20},{id:"rose",label:"Rose",fg:"#fb7185",price:20},{id:"amber",label:"Amber",fg:"#f59e0b",price:20},{id:"lilac",label:"Lilac",fg:"#a78bfa",price:20},{id:"mint",label:"Mint",fg:"#34d399",price:20},{id:"slate",label:"Slate",fg:"#94a3b8",price:20}];const INITIAL_AVATAR_BG_COLORS=[{id:"classic",label:"Classic",bg:"",price:0},{id:"teal",label:"Teal",bg:"linear-gradient(135deg,#0f766e,#14b8a6)",price:20},{id:"violet",label:"Violet",bg:"linear-gradient(135deg,#6d28d9,#a78bfa)",price:20},{id:"sunset",label:"Sunset",bg:"linear-gradient(135deg,#f97316,#be123c)",price:20},{id:"ocean",label:"Ocean",bg:"linear-gradient(135deg,#0369a1,#38bdf8)",price:20},{id:"forest",label:"Forest",bg:"linear-gradient(135deg,#166534,#84cc16)",price:20},{id:"orchid",label:"Orchid",bg:"linear-gradient(135deg,#a21caf,#f0abfc)",price:20},{id:"copper",label:"Copper",bg:"linear-gradient(135deg,#92400e,#f59e0b)",price:20},{id:"midnight",label:"Midnight",bg:"linear-gradient(135deg,#0f172a,#334155)",price:20},{id:"pearl",label:"Pearl",bg:"linear-gradient(135deg,#f8fafc,#cbd5e1)",price:20}];const INITIAL_AVATAR_COLORS=INITIAL_AVATAR_BG_COLORS;const INITIAL_AVATAR_SCALES=[{id:"100",label:"100%",scale:1,price:0},{id:"125",label:"125%",scale:1.25,price:20},{id:"150",label:"150%",scale:1.5,price:20},{id:"175",label:"175%",scale:1.75,price:20},{id:"200",label:"200%",scale:2,price:20}];function initialAvatarFontDef(id){const key=String(id||"clean").replace(/[^a-z0-9_-]/gi,"").toLowerCase();return INITIAL_AVATAR_FONTS.find((item)=>item.id===key)||INITIAL_AVATAR_FONTS[0];}
function initialAvatarTextColorDef(id){const key=String(id||"classic").replace(/[^a-z0-9_-]/gi,"").toLowerCase();return INITIAL_AVATAR_TEXT_COLORS.find((item)=>item.id===key)||INITIAL_AVATAR_TEXT_COLORS[0];}
function initialAvatarColorDef(id){const key=String(id||"classic").replace(/[^a-z0-9_-]/gi,"").toLowerCase();return INITIAL_AVATAR_BG_COLORS.find((item)=>item.id===key)||INITIAL_AVATAR_BG_COLORS[0];}
function initialAvatarScaleDef(id){const key=String(id||"100").replace(/[^0-9]/g,"");const percent=Math.max(100,Math.min(200,Math.round(Number(key)||100)));const preset=INITIAL_AVATAR_SCALES.find((item)=>item.id===String(percent));return preset?Object.assign({},preset,{price:0}):{id:String(percent),label:`${percent}%`,scale:percent/100,price:0};}
function isInitialAvatarStyleValue(value){return String(value||"").indexOf(INITIAL_AVATAR_STYLE_PREFIX)===0;}
function parseInitialAvatarStyle(value){const raw=isInitialAvatarStyleValue(value)?String(value||"").slice(INITIAL_AVATAR_STYLE_PREFIX.length):"";const parts=raw.split(":");return{font:initialAvatarFontDef(parts[0]||"clean"),text:initialAvatarTextColorDef(parts[2]||(parts[1]&&parts[1]!=="classic"?"ivory":"classic")),color:initialAvatarColorDef(parts[1]||"classic"),scale:initialAvatarScaleDef(parts[3]||"100")};}
function encodeInitialAvatarStyle(fontId,colorId,textColorId,scaleId){const font=initialAvatarFontDef(fontId);const color=initialAvatarColorDef(colorId);const text=initialAvatarTextColorDef(textColorId);const scale=initialAvatarScaleDef(scaleId);if(font.id==="clean"&&color.id==="classic"&&text.id==="classic"&&scale.id==="100")return"";return`${INITIAL_AVATAR_STYLE_PREFIX}${font.id}:${color.id}:${text.id}:${scale.id}`;}
function initialAvatarStyleInventory(){try{const api=window.MkAccountData||null;return api&&typeof api.getShopInventory==="function"?api.getShopInventory():{owned:{}};}catch(_){return{owned:{}};}}
function initialAvatarStyleOwned(type,id,inventory){const def=type==="font"?initialAvatarFontDef(id):(type==="text"?initialAvatarTextColorDef(id):(type==="scale"?initialAvatarScaleDef(id):initialAvatarColorDef(id)));if(!def.price)return true;const inv=inventory||initialAvatarStyleInventory();return!!(inv&&inv.owned&&inv.owned[initialAvatarStyleItemId(type,def.id)]);}
async function buyInitialAvatarStyle(type,id){const def=type==="font"?initialAvatarFontDef(id):(type==="text"?initialAvatarTextColorDef(id):(type==="scale"?initialAvatarScaleDef(id):initialAvatarColorDef(id)));if(!def.price||initialAvatarStyleOwned(type,def.id))return{ok:true,owned:true,price:0};const api=window.MkAccountData||null;if(!api||typeof api.buyOffCatalogItem!=="function")return{ok:false,error:"shop_unavailable",price:def.price};return api.buyOffCatalogItem({id:initialAvatarStyleItemId(type,def.id),title:`Initial avatar ${type}: ${def.label}`,category:"Avatar initials",price:def.price,consumable:false},{source:"initial-avatar-style",extraDetails:{avatarInitialStyle:{type,id:def.id,label:def.label}}});}
function avatarModeFromValue(avatar){const av=cleanAvatarLocal(avatar);if(isImageAvatar(av))return"upload";if(isInitialAvatarStyleValue(av))return"initials";if(av)return"emoji";return"initials";}
async function loadOnlineProfile(){const result=await withIdentityProfileUpdate(loadOnlineProfileNow);return result&&result.ok===false?readLocalProfile():result;}
async function loadOnlineProfileNow(){const cached=readLocalProfile();const profileBefore=JSON.stringify(cached);const accountContext=captureSocialAccountContext();if(isMobilePowerSensitiveViewport()&&cached&&cached.accountKey){const last=readLastOnlineProfileAt();if(last&&Date.now()-last<5*60*1000&&!identityIntentMatchesContext(readIdentityRekeyIntent(),accountContext))return cached;}
const data=await fetchFreshIdentityProfile(accountContext);if(!socialAccountContextIsCurrent(accountContext))return readLocalProfile();if(JSON.stringify(readLocalProfile())!==profileBefore)return readLocalProfile();if(data&&data.ok&&data.profile){const applied=await persistOnlineIdentityProfile(data,accountContext);if(applied.ok){touchOnlineProfileRefresh();return applied.profile;}
return readLocalProfile();}
if(data&&data.ok&&!data.profile){const pending=readIdentityRekeyIntent();if(identityIntentMatchesContext(pending,accountContext))pendingIdentityRecovery(pending,accountContext);else if(!accountContext.accountKey)setIdentityRecoveryStatus("",accountContext);else identityProfileFailure("This browser's cloud identity needs reconnecting. Your local progress is preserved; connect the intended account in Account.",accountContext,false);}
if(data&&data.revoked){const cleared=await clearLocalAccountState({clearActivity:false});return cleared&&cleared.ok?cleared.profile:readLocalProfile();}
return readLocalProfile();}
const ACCOUNT_CONSENT_KEY="mk_account_consent_v1";const ACCOUNT_CONSENT_VERSION=1;function readAccountConsent(){try{const obj=JSON.parse(localStorage.getItem(ACCOUNT_CONSENT_KEY)||"null");if(obj&&typeof obj==="object"&&Number(obj.version)===ACCOUNT_CONSENT_VERSION&&Number(obj.at)>0)return obj;}catch(_){}
return null;}
function recordAccountConsent(){const rec={version:ACCOUNT_CONSENT_VERSION,at:Date.now()};try{localStorage.setItem(ACCOUNT_CONSENT_KEY,JSON.stringify(rec));}catch(_){}
return rec;}
function requestAccountConsent(){if(readAccountConsent())return Promise.resolve(true);return new Promise((resolve)=>{let settled=false;const onKey=(e)=>{if(e.key==="Escape"){e.preventDefault();finish(false);}};function finish(ok){if(settled)return;settled=true;try{document.removeEventListener("keydown",onKey,true);}catch(_){}
try{overlay.remove();}catch(_){}
if(ok){try{recordAccountConsent();}catch(_){}}
resolve(!!ok);}
const overlay=document.createElement("div");overlay.className="mk-account-consent-overlay";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-label","Create an account");overlay.style.cssText="position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:18px;background:rgba(15,23,42,.55);backdrop-filter:blur(2px)";const card=document.createElement("div");card.style.cssText="max-width:30rem;width:100%;max-height:88vh;overflow:auto;border-radius:16px;padding:1.25rem 1.3rem;color:var(--md-default-fg-color,#1a1a1a);background:var(--md-default-bg-color,#fff);box-shadow:0 18px 50px rgba(15,23,42,.4);font-size:.86rem;line-height:1.5";card.innerHTML='<h2 style="margin:.1rem 0 .55rem;font-size:1.12rem;font-weight:800">Create an account — what this means</h2>'+'<p style="margin:0 0 .55rem">An account saves your learning progress (concepts studied, practice results, favourites) and syncs it across your devices. To do that, your progress is stored in the cloud (on Cloudflare).</p>'+'<ul style="margin:0 0 .6rem;padding-left:1.15rem">'+'<li style="margin:.18rem 0"><strong>No real personal information</strong> is required or collected — no name, email, or phone number. You only choose a username.</li>'+'<li style="margin:.18rem 0">As the site’s creator I can view this stored data, and may use <strong>anonymised, aggregated</strong> data to understand and improve the wiki.</li>'+'<li style="margin:.18rem 0">The wiki is <strong>fully usable without an account</strong> — you don’t need one to read or study anything.</li>'+'</ul>'+'<label style="display:flex;gap:.5rem;align-items:flex-start;margin:.2rem 0 .9rem;cursor:pointer">'+'<input type="checkbox" class="mk-consent-check" style="margin-top:.2rem;flex:0 0 auto">'+'<span>I understand and agree to my learning progress being stored in the cloud as described.</span>'+'</label>'+'<div style="display:flex;gap:.6rem;justify-content:flex-end;flex-wrap:wrap">'+'<button type="button" class="mk-consent-decline" style="padding:.42rem .8rem;border-radius:9px;border:1px solid color-mix(in srgb,currentColor 28%,transparent);background:transparent;color:inherit;font-weight:650;cursor:pointer">Continue without an account</button>'+'<button type="button" class="mk-consent-accept" disabled style="padding:.42rem .9rem;border-radius:9px;border:0;background:var(--md-accent-fg-color,#3b82f6);color:#fff;font-weight:750;cursor:pointer;opacity:.5">Create account</button>'+'</div>';overlay.appendChild(card);const check=card.querySelector(".mk-consent-check");const accept=card.querySelector(".mk-consent-accept");const decline=card.querySelector(".mk-consent-decline");check.addEventListener("change",()=>{accept.disabled=!check.checked;accept.style.opacity=check.checked?"1":".5";accept.style.cursor=check.checked?"pointer":"not-allowed";});accept.addEventListener("click",()=>{if(check.checked)finish(true);});decline.addEventListener("click",()=>finish(false));overlay.addEventListener("click",(e)=>{if(e.target===overlay)finish(false);});document.addEventListener("keydown",onKey,true);(document.body||document.documentElement).appendChild(overlay);try{accept.focus();}catch(_){}});}
const IDENTITY_REKEY_INTENT_KEY="mk_account_identity_rekey_pending_v1";let identityProfileUpdateBusy=false;const freshIdentityProfiles=new WeakSet();async function fetchFreshIdentityProfile(context){if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();const workspaces=window.MkAccountWorkspaces;if(workspaces&&typeof workspaces.ownerForAccount==="function"&&context.owner!==workspaces.ownerForAccount(context.accountKey))return socialAccountChangedResult();const path=`/identity?visitorId=${encodeURIComponent(context.visitorId)}&previousAccountKey=${encodeURIComponent(context.accountKey)}&t=${Date.now()}`;const data=await fetchJsonWithRetry(API_BASE+path,{cache:"no-store",timeoutMs:ACCOUNT_SYNC_FETCH_TIMEOUT_MS,accountContext:context},2);if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();if(data&&data.ok&&data.profile)freshIdentityProfiles.add(data);return data;}
async function refreshAccountIdentityForSync(){return withIdentityProfileUpdate(async()=>{const context=captureSocialAccountContext();if(!context.accountKey)return{ok:false,error:"Connect or save a username first."};const before=JSON.stringify(readLocalProfile());const data=await fetchFreshIdentityProfile(context);if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();if(JSON.stringify(readLocalProfile())!==before)return{ok:false,skipped:true,error:"profile_changed"};if(!data||!data.ok||!data.profile){return identityProfileFailure(data&&data.error||"This browser's cloud identity could not be confirmed. Your local progress is preserved; retry syncing when the account is available.",context,false);}
const applied=await persistOnlineIdentityProfile(data,context);if(!applied.ok)return applied;touchOnlineProfileRefresh();return Object.assign({},applied,{accountContext:captureSocialAccountContext()});});}
window.MkAccountIdentity={refreshForSync:refreshAccountIdentityForSync};async function withIdentityProfileUpdate(action){const busy={ok:false,busy:true,error:"An account update is already in progress. Please try again shortly."};if(identityProfileUpdateBusy)return busy;const locks=window.navigator&&window.navigator.locks;if(!locks||typeof locks.request!=='function')return{ok:false,error:"This browser cannot safely coordinate account updates. Use a browser with Web Locks support; your local progress is preserved."};const context=captureSocialAccountContext();return locks.request('mk-account-identity-profile-v1',{ifAvailable:true},async lock=>{if(!lock)return busy;if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();identityProfileUpdateBusy=true;try{return await action();}
finally{identityProfileUpdateBusy=false;}});}
function readIdentityRekeyIntent(){try{const value=JSON.parse(localStorage.getItem(IDENTITY_REKEY_INTENT_KEY)||"null");return value&&typeof value==="object"&&value.oldOwner&&value.targetOwner&&value.visitorId?value:null;}catch(_){return null;}}
function identityIntentMatchesContext(intent,context){return!!(intent&&context&&intent.oldOwner===context.owner&&intent.visitorId===context.visitorId);}
function clearIdentityRekeyIntentForContext(context){const intent=readIdentityRekeyIntent();if(identityIntentMatchesContext(intent,context)){try{localStorage.removeItem(IDENTITY_REKEY_INTENT_KEY);}catch(_){}}}
function setIdentityRecoveryStatus(error,context){window.__mkAccountIdentityRecoveryState=error?{error:String(error),context}:null;try{window.dispatchEvent(new CustomEvent("mk-account-identity-recovery"));}catch(_){}}
function identityProfileFailure(error,context,cloudSaved){const result={ok:false,localFailure:true,cloudSaved:!!cloudSaved,recoveryRequired:true,error:String(error)};setIdentityRecoveryStatus(result.error,context);return result;}
function pendingIdentityRecovery(intent,context){const name=String(intent.targetName||intent.targetOwner.replace(/^account:/,""));return identityProfileFailure('The previous account update is not confirmed yet. Keep the username "'+name+'" and select Save to retry it. Your local progress is preserved.',context,false);}
async function persistOnlineIdentityProfile(response,context){if(!socialAccountContextIsCurrent(context))return socialAccountChangedResult();const freshRead=!!(response&&freshIdentityProfiles.has(response));if(freshRead)freshIdentityProfiles.delete(response);const profile=responseProfileWithPrivacy(response);const key=String(profile&&profile.accountKey||"").trim().toLowerCase();if(!key)return{ok:false,error:"The server did not return an account identity."};const workspaces=window.MkAccountWorkspaces;const targetOwner=workspaces&&typeof workspaces.ownerForAccount==="function"?workspaces.ownerForAccount(key):"";const ownerChanged=targetOwner?targetOwner!==context.owner:key!==context.accountKey;const pending=readIdentityRekeyIntent();if(!ownerChanged&&identityIntentMatchesContext(pending,context))return pendingIdentityRecovery(pending,context);let saved;if(ownerChanged){let intent=readIdentityRekeyIntent();const proof=response&&response.identityRename;if(!intent&&context.accountKey&&freshRead&&proof&&proof.from===context.accountKey&&proof.to===key&&targetOwner&&workspaces&&typeof workspaces.rekeyActiveWorkspace==="function"){intent={oldOwner:context.owner,targetOwner,targetName:String(profile.name||key),visitorId:context.visitorId};try{const serialized=JSON.stringify(intent);localStorage.setItem(IDENTITY_REKEY_INTENT_KEY,serialized);if(localStorage.getItem(IDENTITY_REKEY_INTENT_KEY)!==serialized)throw new Error("Intent was not saved.");}catch(_){return identityProfileFailure("The cloud username changed, but this browser could not save its recovery record. Free browser storage and retry syncing; your local progress is preserved.",context,true);}}
if(!identityIntentMatchesContext(intent,context)||intent.targetOwner!==targetOwner||!workspaces||typeof workspaces.rekeyActiveWorkspace!=="function"){return identityProfileFailure("Account identity needs recovery. Your local progress is preserved; connect the intended account in Account before syncing.",context,false);}
const previousSwitching=window.__mkAccountWorkspaceSwitching;window.__mkAccountWorkspaceSwitching=true;let migration;try{migration=await workspaces.rekeyActiveWorkspace(targetOwner,{expectedOwner:context.owner,reason:"profile-identity-save",commit:()=>writeLocalProfile(profile,{requirePersistence:true})});}finally{window.__mkAccountWorkspaceSwitching=previousSwitching;}
if(!migration||!migration.ok){const message=migration&&migration.rollbackOk===false?"The cloud username was saved, but the local update and recovery failed. Keep this browser's data and use Account recovery before syncing. ":"The cloud username was saved, but this browser could not finish updating its local account. Local progress is preserved. Free browser storage if needed, then reload to retry recovery. ";return identityProfileFailure(message+String(migration&&migration.error||""),context,true);}
saved=migration.commitResult;}else{try{saved=writeLocalProfile(profile,{requirePersistence:true});}
catch(_){return identityProfileFailure("The cloud profile is available, but it could not be saved on this browser. Free browser storage and reload to retry.",context,true);}}
clearIdentityRekeyIntentForContext(context);setIdentityRecoveryStatus("",context);return{ok:true,profile:saved};}
async function applyOnlineIdentityProfile(response,context){return withIdentityProfileUpdate(()=>persistOnlineIdentityProfile(response,context));}
async function saveOnlineProfile(name,avatar,options){return withIdentityProfileUpdate(()=>saveOnlineProfileNow(name,avatar,options));}
async function saveOnlineProfileNow(name,avatar,options){const nm=cleanProfileNameLocal(name);const av=cleanAvatarLocal(avatar);const opts=options&&typeof options==="object"?options:{};if(!nm)return{ok:false,error:"Please choose a username first."};const currentProfile=readLocalProfile();const accountContext=captureSocialAccountContext();if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const isNewAccount=!currentProfile.accountKey;if(isNewAccount){const consented=await requestAccountConsent();if(!consented)return{ok:false,cancelled:true,error:"Account creation was cancelled."};if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();}
const hasBioOpt=Object.prototype.hasOwnProperty.call(opts,"bio")||Object.prototype.hasOwnProperty.call(opts,"description")||Object.prototype.hasOwnProperty.call(opts,"intro");const body={visitorId:getVisitorId(),name:nm,avatar:av,avatarFrame:cleanAvatarFrameLocal(opts.avatarFrame||currentProfile.avatarFrame||"level-1"),bio:cleanProfileBioLocal(hasBioOpt?(opts.bio||opts.description||opts.intro||""):(currentProfile.bio||"")),keepAvatar:!!opts.keepAvatar,deviceName:getDeviceName()};if(isNewAccount){const consentRec=readAccountConsent();if(consentRec)body.consent=consentRec;}
if(isNewAccount){const pref=opts.privacy?normalisePrivacy(opts.privacy,false):defaultNewAccountPrivacy();pref.rankingVisibility="public";pref.rankingPublic=true;opts.privacy=pref;if(opts.isPublic==null)opts.isPublic=!!pref.profilePublic;}
if(opts.isPublic!=null)body.isPublic=opts.isPublic;if(opts.privacy)body.privacy=opts.privacy;const workspaces=window.MkAccountWorkspaces;const targetOwner=workspaces&&typeof workspaces.ownerForAccount==="function"?workspaces.ownerForAccount(nm):"";const pending=readIdentityRekeyIntent();const retryingPending=identityIntentMatchesContext(pending,accountContext);if(retryingPending){const verified=await apiGet(`/identity?visitorId=${encodeURIComponent(accountContext.visitorId)}&t=${Date.now()}`);if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!verified||!verified.ok){return identityProfileFailure("The previous username change could not be verified. Your local progress is preserved. Check your connection and try Save again.",accountContext,false);}
const verifiedKey=String(verified.profile&&verified.profile.accountKey||"").trim().toLowerCase();if(verifiedKey&&verifiedKey!==accountContext.accountKey){const recovered=await persistOnlineIdentityProfile(verified,accountContext);if(!recovered.ok)return recovered;return{ok:false,retryRequired:true,error:"Your account identity has been recovered. Reopen the profile editor, review your details, then save your change again."};}
if(targetOwner!==pending.targetOwner||(!verifiedKey&&accountContext.accountKey))return pendingIdentityRecovery(pending,accountContext);}
if(targetOwner?targetOwner!==accountContext.owner:nm.toLowerCase()!==accountContext.accountKey){if(!workspaces||typeof workspaces.rekeyActiveWorkspace!=="function")return{ok:false,error:"Account storage is not ready. Reload before changing the username."};const preflight=await workspaces.rekeyActiveWorkspace(targetOwner,{expectedOwner:accountContext.owner,dryRun:true});if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!preflight||!preflight.ok)return{ok:false,error:String(preflight&&preflight.error||"The local account could not be prepared for this username.")};try{const serialized=retryingPending?JSON.stringify(pending):JSON.stringify({oldOwner:accountContext.owner,targetOwner,targetName:nm,visitorId:accountContext.visitorId});localStorage.setItem(IDENTITY_REKEY_INTENT_KEY,serialized);if(localStorage.getItem(IDENTITY_REKEY_INTENT_KEY)!==serialized)throw new Error("Intent was not saved.");}catch(_){return{ok:false,error:"The local recovery record could not be saved. Free browser storage before changing the username."};}}
const res=await apiPost("/identity",body);if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(res&&res.ok&&res.profile){const out=await persistOnlineIdentityProfile(res,accountContext);if(!out.ok)return out;invalidateAccountXpCache();try{const oldBio=String(currentProfile.bio||"");const newBio=String(body.bio||"");if(hasBioOpt&&oldBio!==newBio)trackActivity("intro_update",{source:"profile-save",hadIntroBefore:!!oldBio,introLength:newBio.length},{scope:"intro_update",throttleMs:0});if(av||opts.keepAvatar){const oldAvatar=String(currentProfile.avatar||"");const newAvatar=String(res.profile&&res.profile.avatar||av||"");if(oldAvatar!==newAvatar)trackActivity("avatar_upload",{source:"profile-save",avatarMode:av?"emoji":"upload"},{scope:"avatar_upload",throttleMs:0});}
if(isNewAccount)trackActivity("sync_device_connected",{source:"new-account",deviceName:getDeviceName()},{scope:"sync_device_connected:new-account",throttleMs:0});}catch(_){}
refreshAccountXpSoon("profile-save",120);updateNotificationBadgesSoon(350,{force:true,reason:"account-created"});return out;}
if(!retryingPending&&res&&res.ok===false&&res.renameNotApplied===true){clearIdentityRekeyIntentForContext(accountContext);setIdentityRecoveryStatus("",accountContext);}
return Object.assign({ok:false,error:(res&&res.error)||"Could not save this username."},res||{});}
async function saveAvatarFrameOnline(frame){const accountContext=captureSocialAccountContext();if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const requested=cleanAvatarFrameLocal(frame||"level-1");const curr=readLocalProfile();if(!curr.name)return{ok:false,error:"Please choose a username before changing the avatar frame."};let next;try{next=writeLocalProfile(Object.assign({},curr,{avatarFrame:requested,selectedAvatarFrame:requested,highestLevelSeen:Math.max(Number(curr.highestLevelSeen||curr.level||1),avatarFrameLevelLocal(requested)),unlockedAvatarFrames:avatarFramesForLevelLocal(Math.max(Number(curr.highestLevelSeen||curr.level||1),avatarFrameLevelLocal(requested)))}),{requirePersistence:true});}
catch(_){return identityProfileFailure("This browser could not save the avatar frame. Free browser storage and try again.",accountContext,false);}
try{window.setTimeout(()=>{if(!socialAccountContextIsCurrent(accountContext))return;apiPost("/identity/avatar-frame",{visitorId:accountContext.visitorId,frame:requested,avatarFrame:requested}).catch(()=>null);},0);}catch(_){}
return{ok:true,localOnly:true,profile:next,avatarFrame:requested,unlockedAvatarFrames:next.unlockedAvatarFrames};}
async function refreshLocalProfileFromServer(){const result=await withIdentityProfileUpdate(refreshLocalProfileFromServerNow);return result&&result.ok===false?readLocalProfile():result;}
async function refreshLocalProfileFromServerNow(){const accountContext=captureSocialAccountContext();const profileBefore=JSON.stringify(readLocalProfile());const data=await fetchFreshIdentityProfile(accountContext);if(!socialAccountContextIsCurrent(accountContext))return readLocalProfile();if(JSON.stringify(readLocalProfile())!==profileBefore)return readLocalProfile();if(data&&data.ok&&data.profile){const applied=await persistOnlineIdentityProfile(data,accountContext);if(applied.ok){touchOnlineProfileRefresh();return applied.profile;}
return readLocalProfile();}
if(data&&data.ok&&!data.profile){const pending=readIdentityRekeyIntent();if(identityIntentMatchesContext(pending,accountContext))pendingIdentityRecovery(pending,accountContext);else if(!accountContext.accountKey)setIdentityRecoveryStatus("",accountContext);else identityProfileFailure("This browser's cloud identity needs reconnecting. Your local progress is preserved; connect the intended account in Account.",accountContext,false);}
if(data&&data.revoked){const cleared=await clearLocalAccountState({clearActivity:false});return cleared&&cleared.ok?cleared.profile:readLocalProfile();}
return readLocalProfile();}
async function applyLevelUpRewardsOnline(level){const accountContext=captureSocialAccountContext();const lvl=Math.max(1,Math.min(10,Math.floor(Number(level||1))));const res=await apiPost("/identity/level-up-rewards",{visitorId:getVisitorId(),level:lvl});if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(res&&res.ok&&res.profile)writeLocalProfile(res.profile);else if(res&&res.ok)await refreshLocalProfileFromServer().catch(()=>readLocalProfile());return res||{ok:false};}
async function refreshProfileIfCooldownActive(kind){const curr=readLocalProfile();const active=kind==="name"?isCooldownActive(curr.nameCooldownUntil):isCooldownActive(curr.avatarCooldownUntil);if(!active)return curr;return refreshLocalProfileFromServer().catch(()=>curr);}
function mergeProfilePrivacy(profile,privacy){const base=profile&&typeof profile==="object"?Object.assign({},profile):Object.assign({},readLocalProfile());const nextPrivacy=normalisePrivacy(privacy||base.privacy,base.isPublic);base.privacy=nextPrivacy;base.isPublic=!!nextPrivacy.profilePublic;return base;}
async function fetchPrivacySettings(){const accountContext=captureSocialAccountContext();const profileBefore=JSON.stringify(readLocalProfile());const data=await apiGet(`/identity/privacy?visitorId=${encodeURIComponent(getVisitorId())}`);if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(JSON.stringify(readLocalProfile())!==profileBefore)return{ok:false,skipped:true,error:"profile_changed"};if(data&&data.ok){const merged=mergeProfilePrivacy(data.profile||readLocalProfile(),data.privacy||(data.profile&&data.profile.privacy));try{writeLocalProfile(merged,{requirePersistence:true});}
catch(_){return identityProfileFailure("The cloud privacy settings could not be saved on this browser. Free browser storage and reload.",accountContext,true);}
setIdentityRecoveryStatus("",accountContext);}
return data;}
async function savePrivacySettings(privacy){const accountContext=captureSocialAccountContext();const nextPrivacy=normalisePrivacy(privacy,false);const data=await apiPost("/identity/privacy",{visitorId:getVisitorId(),privacy:nextPrivacy});if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(data&&data.ok){const merged=mergeProfilePrivacy(data.profile||readLocalProfile(),data.privacy||nextPrivacy);try{writeLocalProfile(merged,{requirePersistence:true});}
catch(_){return identityProfileFailure("Privacy settings were saved in the cloud, but this browser could not save them locally. Free browser storage and reload.",accountContext,true);}
setIdentityRecoveryStatus("",accountContext);try{trackActivity("privacy_update",{source:"privacy-settings"},{scope:"privacy_update",throttleMs:0});}catch(_){}
data.privacy=merged.privacy;data.profile=merged;refreshAccountXpSoon("privacy-save",120);}
return data;}
function saveLocalComment(record){if(!record||!record.id)return;const arr=readLocalArray(LOCAL_COMMENTS_KEY).filter((x)=>x&&x.id!==record.id);arr.unshift(Object.assign({},record,{title:cleanPageTitleText(record.title||record.path||"")}));writeLocalArray(LOCAL_COMMENTS_KEY,arr,120);try{const metric=record.parentId||record.parent_id?"reply":"comment";trackActivity(metric,{path:record.path||currentPath(),title:record.title||title(),commentId:record.id,parentId:record.parentId||record.parent_id||"",textLength:String(record.text||"").length,source:"comment-save"},{scope:`${metric}:${record.id}`,throttleMs:0});const mentions=String(record.text||"").match(/@[A-Za-z0-9_.-]+/g)||[];mentions.forEach((m)=>trackActivity("mention_given",{path:record.path||currentPath(),commentId:record.id,mention:m,source:"comment-save"},{scope:`mention:${record.id}:${m}`,throttleMs:0}));}catch(_){}
activityChanged("comment",{id:record.id,path:record.path});}
function markLocalCommentDeleted(commentId){const id=String(commentId||"");if(!id)return;const arr=readLocalArray(LOCAL_COMMENTS_KEY).map((x)=>x&&x.id===id?Object.assign({},x,{deleted:true,deletedAt:Date.now()}):x).filter(Boolean);writeLocalArray(LOCAL_COMMENTS_KEY,arr,120);try{trackActivity("comment_edit",{commentId:id,deleted:true,source:"comment-delete"},{scope:`comment-delete:${id}`,throttleMs:0});}catch(_){}
activityChanged("comment-delete",{id});}
function updateLocalComment(commentId,patch){const id=String(commentId||"");if(!id)return;const arr=readLocalArray(LOCAL_COMMENTS_KEY).map((x)=>x&&x.id===id?Object.assign({},x,patch||{},{editedAt:(patch&&patch.editedAt)||Date.now()}):x).filter(Boolean);writeLocalArray(LOCAL_COMMENTS_KEY,arr,120);try{trackActivity("comment_edit",{commentId:id,source:"comment-edit"},{scope:`comment-edit:${id}:${Date.now()}`,throttleMs:0});}catch(_){}
activityChanged("comment-edit",{id});}
function getLocalComments(){return readLocalArray(LOCAL_COMMENTS_KEY);}
function getLocalFavorites(){return readLocalArray(LOCAL_FAVORITES_KEY);}
function getLocalCommentReports(){return readLocalArray(LOCAL_COMMENT_REPORTS_KEY);}
function saveLocalCommentReport(record){if(!record||!record.commentId)return;const arr=readLocalArray(LOCAL_COMMENT_REPORTS_KEY).filter((x)=>x&&!(x.commentId===record.commentId&&x.reportId===record.reportId));arr.unshift(Object.assign({},record,{ts:Number(record.ts||Date.now())}));writeLocalArray(LOCAL_COMMENT_REPORTS_KEY,arr,120);try{trackActivity("report",{path:record.path||currentPath(),commentId:record.commentId,reportId:record.reportId,source:"comment-report"},{scope:`report:${record.commentId}:${record.reportId || ""}`,throttleMs:0});}catch(_){}
activityChanged("comment-report",{commentId:record.commentId,path:record.path});}
function queuePageActionCloudState(path,pageTitle,action,active,reason){const p=String(path||"");const a=String(action||"");if(!p||!a)return null;try{const item=enqueueLocalSyncTask({kind:"pageActionSet",body:{path:p,title:cleanPageTitleText(pageTitle||p),visitorId:getVisitorId(),action:a,active:!!active,ts:Date.now(),source:reason||"page-action-state"},createdAt:Date.now()});try{scheduleLocalSyncQueueFlush(1200,{force:false,reason:"page-action-state-now"});}catch(_){}
return item;}catch(_){return null;}}
function saveLocalFavorite(path,pageTitle,active){const p=String(path||"");if(!p)return;try{if(window.MkAccountData&&typeof window.MkAccountData.recordPageAction==="function"){window.MkAccountData.recordPageAction(p,pageTitle||p,"favorite",!!active,{source:"saveLocalFavorite"});}}catch(_){}
queuePageActionCloudState(p,pageTitle||p,"favorite",!!active,"saveLocalFavorite");let arr=[];try{arr=(window.MkAccountData&&typeof window.MkAccountData.getLocalFavorites==="function")?window.MkAccountData.getLocalFavorites():readLocalArray(LOCAL_FAVORITES_KEY).filter((x)=>x&&x.path!==p);if(!window.MkAccountData&&active)arr.unshift({path:p,title:cleanPageTitleText(pageTitle||p),ts:Date.now()});}catch(_){arr=[];}
writeLocalArray(LOCAL_FAVORITES_KEY,arr,5000);activityChanged("favorite",{path:p,active:!!active});}
let __mkActivityTitleMapPromise=null;let __mkActivityTitleMap=null;async function loadActivityTitleMap(){if(__mkActivityTitleMap)return __mkActivityTitleMap;if(__mkActivityTitleMapPromise)return __mkActivityTitleMapPromise;__mkActivityTitleMapPromise=(async()=>{const map=new Map();const root=getSiteRootUrlForActivity();const candidates=[new URL("search/search_index.json",root).toString(),new URL("search_index.json",root).toString(),];for(const url of candidates){try{const data=await __mkFetchSearchIndex(url,{cache:"no-cache"});const docs=data&&Array.isArray(data.docs)?data.docs:[];for(const d of docs){const loc=normActivityTitlePath(d&&d.location);if(!loc||!String(loc).endsWith(".html"))continue;if(!map.has(loc)&&d&&d.title)map.set(loc,rawPageTitleForMath(d.title));}
if(map.size)break;}catch(_){}}
__mkActivityTitleMap=map;return map;})();return __mkActivityTitleMapPromise;}
function refreshActivityLinkTitles(host){if(!host)return;const links=Array.from(host.querySelectorAll("a.mk-local-activity-link[data-path]"));if(!links.length)return;loadActivityTitleMap().then((map)=>{if(!map||!map.size)return;links.forEach((a)=>{const pth=normActivityTitlePath(a.getAttribute("data-path")||"");const t=map.get(pth);if(t)setActivityLinkTitle(a,t);});typesetActivityMath(host);}).catch(()=>{});}
function captureSocialAccountContext(allowWorkspaceSwitch){const profile=readLocalProfile();const workspaces=window.MkAccountWorkspaces;return{accountKey:String(profile&&profile.accountKey||"").trim().toLowerCase(),visitorId:String(getVisitorId()||""),owner:workspaces&&typeof workspaces.activeOwner==="function"?workspaces.activeOwner():"",allowWorkspaceSwitch:!!allowWorkspaceSwitch};}
function socialAccountContextIsCurrent(context){if(!context||(!context.allowWorkspaceSwitch&&window.__mkAccountWorkspaceSwitching))return false;const current=captureSocialAccountContext(context.allowWorkspaceSwitch);return current.accountKey===context.accountKey&&current.visitorId===context.visitorId&&current.owner===context.owner;}
function socialAccountChangedResult(){return{ok:false,skipped:true,error:"account_workspace_changed"};}
async function fetchJsonWithRetry(url,init,attempts){const tries=Math.max(1,Number(attempts||1));const input=init&&typeof init==="object"?Object.assign({},init):{};const timeoutMs=Math.max(4000,Number(input.timeoutMs||input.__timeoutMs||ACCOUNT_SYNC_FETCH_TIMEOUT_MS)||ACCOUNT_SYNC_FETCH_TIMEOUT_MS);const accountContext=input.accountContext;delete input.accountContext;delete input.timeoutMs;delete input.__timeoutMs;for(let i=0;i<tries;i++){if(accountContext&&!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();let controller=null;let timer=null;try{if(typeof AbortController!=="undefined"){controller=new AbortController();input.signal=controller.signal;timer=window.setTimeout(()=>{try{controller.abort();}catch(_){}},timeoutMs+i*2500);}
const res=await fetch(url,Object.assign({cache:"no-store"},input));if(timer)window.clearTimeout(timer);if(accountContext&&!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!res||!res.ok){if(i<tries-1){await new Promise((resolve)=>window.setTimeout(resolve,280+i*320));continue;}}
const data=await res.json();if(accountContext&&!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!data||typeof data!=="object")throw new Error("Invalid server response");if(!res.ok){return Object.assign({},data,{ok:false,status:Number(res.status||0),backendUnavailable:res.status===429||res.status>=500,error:data.error||`HTTP ${res.status || "error"}`});}
return data;}catch(err){if(timer)window.clearTimeout(timer);if(accountContext&&!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(i<tries-1){await new Promise((resolve)=>window.setTimeout(resolve,280+i*320));continue;}
return{ok:false,backendUnavailable:true,error:err&&err.name==="AbortError"?"Request timed out. Please try again.":(err&&err.message||"Network request failed")};}}
return{ok:false,error:"Network request failed"};}
async function apiGet(path){const accountContext=captureSocialAccountContext();const timeoutMs=String(path||"").includes("/identity/json-sync")?180000:ACCOUNT_SYNC_FETCH_TIMEOUT_MS;const attempts=String(path||"").includes("/identity/json-sync")?4:2;const data=await fetchJsonWithRetry(API_BASE+path,{cache:"no-store",timeoutMs,accountContext},attempts);if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(data){if(data.ok!==false)writeCachedApiGet(path,data);return data;}
return readCachedApiGet(path,shouldCacheApiGet(path)?API_GET_CACHE_MAX_AGE_MS:0);}
const COMMENTS_MEMO_MS=2500;let commentsMemo={key:"",at:0,data:null,pending:null};let commentsMemoEpoch=0;function invalidateCommentsMemo(){commentsMemoEpoch+=1;commentsMemo={key:"",at:0,data:null,pending:null};}
function fetchCommentsForPath(path,opts){const context=captureSocialAccountContext();const key=`${path}|${context.visitorId}|${context.accountKey}|${context.owner}`;const now=Date.now();if(commentsMemo.key===key){if(commentsMemo.pending)return commentsMemo.pending;if(!(opts&&opts.fresh)&&commentsMemo.data&&now-commentsMemo.at<COMMENTS_MEMO_MS){return Promise.resolve(commentsMemo.data);}}
const pending=apiGet(`/comments?path=${encodeURIComponent(path)}&visitorId=${encodeURIComponent(getVisitorId())}`).then((data)=>{if(commentsMemo.key===key&&commentsMemo.pending===pending){commentsMemo.pending=null;if(commentsResponseIsValid(data)){commentsMemo.at=Date.now();commentsMemo.data=data;}}
return data;}).catch((err)=>{if(commentsMemo.key===key&&commentsMemo.pending===pending)commentsMemo.pending=null;throw err;});commentsMemo={key,at:commentsMemo.key===key?commentsMemo.at:0,data:commentsMemo.key===key?commentsMemo.data:null,pending};return pending;}
function reportAccountWriteOutcome(ok,path,backendUnavailable){try{window.dispatchEvent(new CustomEvent("mk-account-write-outcome",{detail:{ok:!!ok,path:String(path||""),backendUnavailable:!!backendUnavailable}}));}catch(_){}}
function apiPost(path,body){const allowWorkspaceSwitch=["/identity/sync-claim","/identity/recovery-claim","/identity/unlink"].includes(path);const accountContext=captureSocialAccountContext(allowWorkspaceSwitch);if(String(path||"").startsWith("/comments"))invalidateCommentsMemo();const timeoutMs=String(path||"").includes("/identity/json-sync")?180000:ACCOUNT_SYNC_FETCH_TIMEOUT_MS;const attempts=path==="/identity"?1:String(path||"").includes("/identity/json-sync")?4:2;const simplePost=path==="/identity"||path==="/comments"||String(path||"").startsWith("/connections/")||path==="/notifications/seen";return fetchJsonWithRetry(API_BASE+path,{method:"POST",headers:{"Content-Type":simplePost?"text/plain;charset=UTF-8":"application/json"},body:JSON.stringify(body),timeoutMs,accountContext,},attempts).then((res)=>{if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(String(path||"").startsWith("/comments"))invalidateCommentsMemo();reportAccountWriteOutcome(!!res&&res.ok!==false,path,!!(res&&res.backendUnavailable));return res;},(err)=>{if(String(path||"").startsWith("/comments"))invalidateCommentsMemo();reportAccountWriteOutcome(false,path,true);throw err;});}
function readPendingXpActivityQueue(){try{const raw=localStorage.getItem(PENDING_XP_ACTIVITY_QUEUE_KEY);const arr=raw?JSON.parse(raw):[];return Array.isArray(arr)?arr.filter((x)=>x&&typeof x==="object"):[];}catch(_){return[];}}
function writePendingXpActivityQueue(queue){try{const compact=(Array.isArray(queue)?queue:[]).slice(-300);localStorage.setItem(PENDING_XP_ACTIVITY_QUEUE_KEY,JSON.stringify(compact));return true;}catch(_){return false;}}
function queuePendingXpActivity(metric,details,opts){const m=String(metric||"").trim();if(!m)return{ok:false,queued:false,error:"empty metric"};const nowTs=Date.now();const item={id:`pending_${m}_${nowTs}_${Math.random().toString(36).slice(2, 8)}`,metric:m,details:details&&typeof details==="object"?details:{},opts:opts&&typeof opts==="object"?opts:{},queuedAt:nowTs,source:"engagement-comments-pending"};const q=readPendingXpActivityQueue();q.push(item);if(!writePendingXpActivityQueue(q))return{ok:false,queued:false,error:"pending activity could not be saved"};try{markCloudSyncDirty("pending-xp-activity");}catch(_){}
try{window.setTimeout(()=>flushPendingXpActivityQueue("pending-retry"),250);}catch(_){}
try{window.setTimeout(()=>flushPendingXpActivityQueue("pending-retry-late"),1500);}catch(_){}
return{ok:true,queued:true,pending:true,metric:m,id:item.id};}
let pendingXpActivityFlushPromise=null;function flushPendingXpActivityQueue(reason){if(pendingXpActivityFlushPromise)return pendingXpActivityFlushPromise;const accountContext=captureSocialAccountContext();if(!socialAccountContextIsCurrent(accountContext))return Promise.resolve(socialAccountChangedResult());const work=(async()=>{try{if(!window.MkAccountData||typeof window.MkAccountData.recordActivity!=="function")return{ok:false,deferred:true};const q=readPendingXpActivityQueue();if(!q.length)return{ok:true,empty:true};let imported=0;const acknowledged=new Set();for(const item of q.slice(-300)){if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();try{const opts=Object.assign({},item.opts||{},{id:item.id||(item.opts&&item.opts.id),ts:item.queuedAt||Date.now(),throttleMs:0,scope:(item.opts&&item.opts.scope)||`pending:${item.metric}:${item.queuedAt || Date.now()}`});const result=await window.MkAccountData.recordActivity(item.metric,Object.assign({source:reason||"pending-xp-flush"},item.details||{}),opts);if(result&&result.ok===true){acknowledged.add(JSON.stringify(item));imported+=1;}}catch(_){}}
if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const remaining=readPendingXpActivityQueue().filter((item)=>!acknowledged.has(JSON.stringify(item)));if(!writePendingXpActivityQueue(remaining))return{ok:false,imported,error:"pending activity acknowledgement could not be saved"};if(imported)refreshAccountXpSoon("pending-xp-flush",120);return{ok:true,imported,remaining:remaining.length};}catch(_){return{ok:false,error:"pending flush failed"};}})();pendingXpActivityFlushPromise=work;work.finally(()=>{if(pendingXpActivityFlushPromise===work)pendingXpActivityFlushPromise=null;});return work;}
function trackActivity(metric,details,opts){try{flushPendingXpActivityQueue("before-record");}catch(_){}
try{if(window.MkAccountData&&typeof window.MkAccountData.recordActivity==="function"){const res=window.MkAccountData.recordActivity(metric,details||{},opts||{});try{refreshAccountXpSoon("xp-activity:"+String(metric||"activity"),140);}catch(_){}
return Promise.resolve(res).then((value)=>{try{refreshAccountXpSoon("xp-activity-done:"+String(metric||"activity"),250);}catch(_){}
return value;});}}catch(_){}
const queued=queuePendingXpActivity(metric,details||{},opts||{});return Promise.resolve(queued);}
async function apiUploadAvatar(file,name){const accountContext=captureSocialAccountContext();if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const fd=new FormData();fd.append("visitorId",accountContext.visitorId);fd.append("name",cleanProfileNameLocal(name||""));fd.append("avatar",file);const controller=typeof AbortController!=="undefined"?new AbortController():null;let timer=0;try{if(controller)timer=window.setTimeout(()=>controller.abort(),ACCOUNT_SYNC_FETCH_TIMEOUT_MS);const res=await fetch(API_BASE+"/identity/avatar",{method:"POST",body:fd,cache:"no-store",signal:controller?controller.signal:undefined,});let data=null;try{data=await res.json();}catch(_){data=null;}
if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!data||typeof data!=="object"||Array.isArray(data)){return{ok:false,status:res.status,error:"Avatar upload returned an invalid response."};}
if(!res.ok){return Object.assign({},data,{ok:false,status:res.status,error:data.error||`Avatar upload failed with HTTP ${res.status}.`});}
return data;}catch(err){const timedOut=err&&err.name==="AbortError";return{ok:false,error:timedOut?"Avatar upload timed out. Please try again.":"Avatar upload could not reach the server. Please hard refresh and try again.",detail:err&&err.message?String(err.message):"",};}finally{if(timer)window.clearTimeout(timer);}}
async function createSyncCode(){const res=await apiPost("/identity/sync-code",{visitorId:getVisitorId(),deviceName:getDeviceName()});if(res&&res.ok)refreshAccountXpSoon("sync-code",120);return res;}
async function claimSyncCode(name,code){return apiPost("/identity/sync-claim",{visitorId:getVisitorId(),name,code,deviceName:getDeviceName()});}
async function createRecoveryCode(customCode){const body={visitorId:getVisitorId(),deviceName:getDeviceName()};if(customCode!=null&&String(customCode||"").trim())body.code=String(customCode||"").trim();const res=await apiPost("/identity/recovery-code",body);if(res&&res.ok)refreshAccountXpSoon("recovery-code",120);return res;}
async function claimRecoveryCode(name,code){return apiPost("/identity/recovery-claim",{visitorId:getVisitorId(),name,code,deviceName:getDeviceName()});}
function accountLoginUrlFromCode(syncRes){const res=syncRes&&typeof syncRes==="object"?syncRes:{};const payload={v:1,method:"sync",name:String(res.name||(readLocalProfile().name||"")),code:String(res.code||""),expiresAt:Number(res.expiresAt||0)||0,createdAt:Date.now()};if(!payload.name||!payload.code)return"";const token=accountLoginPayloadToken(payload);if(!token)return"";try{const u=new URL(window.location.href);u.hash="";u.searchParams.set("mk_account_login",token);return u.toString();}catch(_){return`${window.location.origin}${window.location.pathname}?mk_account_login=${encodeURIComponent(token)}`;}}
async function openAccountLoginQrModal(){const mini=openLocalMiniModal("Login QR");mini.body.innerHTML="";const box=el("div","mk-account-qr-modal-box");const loading=el("div","mk-account-qr-modal-loading","Generating QR code…");box.appendChild(loading);mini.body.appendChild(box);const res=await createSyncCode().catch(()=>null);box.innerHTML="";if(!res||!res.ok){box.appendChild(el("div","mk-account-qr-status is-error",(res&&res.error)||"Could not generate QR code."));return;}
const loginUrl=accountLoginUrlFromCode(res);const img=document.createElement("img");img.className="mk-account-qr-modal-img";img.alt="Account login QR code";img.referrerPolicy="no-referrer";img.src=accountQrImageSrc(loginUrl,260);box.appendChild(img);}
async function claimAccountAccessCode(name,code,reason){if(identityProfileUpdateBusy||window.__mkAccountWorkspaceSwitching)return{ok:false,busy:true,error:"An account update is already in progress."};const nm=cleanProfileNameLocal(name||"");const cd=String(code||"").trim();if(!nm||!cd)return{ok:false,error:"Missing account name or access code."};const accountContext=captureSocialAccountContext(true);const workspaces=window.MkAccountWorkspaces||null;const currentOwner=workspaces&&typeof workspaces.activeOwner==="function"?workspaces.activeOwner():"";const requestedOwner=workspaces&&typeof workspaces.ownerForAccount==="function"?workspaces.ownerForAccount(nm):"";const targetAlreadyLocal=!!(workspaces&&requestedOwner&&typeof workspaces.hasWorkspace==="function"&&workspaces.hasWorkspace(requestedOwner));const guestHasData=!!(workspaces&&currentOwner===workspaces.guestOwner&&typeof workspaces.hasMeaningfulActiveData==="function"&&workspaces.hasMeaningfulActiveData());let importGuest=false;if(guestHasData&&!targetAlreadyLocal){importGuest=window.confirm("This browser has guest learning data.\n\n"+"Press OK to import that guest data into this account.\n"+"Press Cancel to keep the guest data separate and load only this account.");}
if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();identityProfileUpdateBusy=true;window.__mkAccountWorkspaceSwitching=true;let res=null;let method="sync-claim";let keepWorkspaceSwitchLock=false;try{res=await claimSyncCode(nm,cd);if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!res||!res.ok){const fallback=await claimRecoveryCode(nm,cd);if(fallback&&fallback.ok){res=fallback;method="recovery-claim";}}
if(!res||!res.ok||!res.profile)return res||{ok:false,error:"Could not connect to this account."};if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const targetKey=String(res.profile.accountKey||res.profile.account_key||"").trim();const targetOwner=workspaces&&typeof workspaces.ownerForAccount==="function"?workspaces.ownerForAccount(targetKey):"";let workspaceResult={ok:false,error:"Account storage is not ready. Reload before connecting this account."};if(workspaces&&targetOwner){const options={expectedOwner:currentOwner,reason:reason||method,commit:()=>writeLocalProfile(res.profile,{requirePersistence:true})};try{if(importGuest&&currentOwner===workspaces.guestOwner&&!workspaces.hasWorkspace(targetOwner)){workspaceResult=await workspaces.adoptActiveWorkspace(targetOwner,options);}else{workspaceResult=await workspaces.activate(targetOwner,options);}}catch(error){workspaceResult={ok:false,error:String(error&&error.message||error)};}}
if(!workspaceResult||workspaceResult.ok===false){if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();let disconnected=false;try{const unlinked=await apiPost("/identity/unlink",{visitorId:accountContext.visitorId});disconnected=!!(unlinked&&unlinked.ok);}catch(_){}
const failure={ok:false,localFailure:true,error:`The account code was valid, but this browser could not finish connecting its local workspace. ${disconnected ? "The new cloud connection was removed." : "The cloud connection could not be verified; reconnect before syncing."} ${workspaceResult && workspaceResult.error ? workspaceResult.error : ""}`.trim()};if(socialAccountContextIsCurrent(accountContext))setIdentityRecoveryStatus(failure.error,accountContext);return failure;}
const workspaceChanged=!workspaceResult.unchanged;if(workspaceChanged){keepWorkspaceSwitchLock=true;try{sessionStorage.setItem(ACCOUNT_WORKSPACE_RESUME_SYNC_KEY,JSON.stringify({accountKey:targetKey,reason:reason||method,createdAt:Date.now()}));}catch(_){}
res.workspaceChanged=true;res.workspaceReloadRequired=true;window.setTimeout(()=>{try{window.location.reload();}catch(_){}},800);}else{window.__mkAccountWorkspaceSwitching=false;try{await syncAllAccountDataNow({force:true,reason:reason||method,timeoutMs:ACCOUNT_SYNC_MANUAL_TIMEOUT_MS});}catch(_){}}
try{refreshAccountXpSoon(reason||method,100);}catch(_){}
try{updateNotificationBadgesSoon(350,{force:true,reason:"account-login"});}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-account-login-change",{detail:{method,profile:res.profile||null,workspaceChanged}}));}catch(_){}
return res;}finally{identityProfileUpdateBusy=false;if(!keepWorkspaceSwitchLock)window.__mkAccountWorkspaceSwitching=false;}}
function resumeAccountWorkspaceSyncIfNeeded(){let pending=null;try{pending=JSON.parse(sessionStorage.getItem(ACCOUNT_WORKSPACE_RESUME_SYNC_KEY)||"null");}catch(_){pending=null;}
if(!pending||typeof pending!=="object")return false;const profile=readLocalProfile();const currentKey=String(profile&&profile.accountKey||"").trim().toLowerCase();const pendingKey=String(pending.accountKey||"").trim().toLowerCase();if(!currentKey||!pendingKey||currentKey!==pendingKey)return false;try{sessionStorage.removeItem(ACCOUNT_WORKSPACE_RESUME_SYNC_KEY);}catch(_){}
window.setTimeout(()=>{syncAllAccountDataNow({force:true,reason:pending.reason||"workspace-switch-resume",timeoutMs:ACCOUNT_SYNC_MANUAL_TIMEOUT_MS}).then((result)=>{if(!result||result.ok===false){try{console.warn("[account-workspace] post-switch sync failed",result&&result.error||result);}catch(_){}}}).catch(()=>{});},250);return true;}
async function claimAccountLoginToken(token,opts){const payload=accountLoginPayloadFromToken(token||"");if(!payload)return{ok:false,error:"This QR login link is not valid."};const expiresAt=Number(payload.expiresAt||0)||0;if(expiresAt&&Date.now()>expiresAt)return{ok:false,error:"This QR login code has expired. Generate a new QR code on the logged-in device."};return claimAccountAccessCode(payload.name||payload.username||"",payload.code||"",(opts&&opts.reason)||"qr-login-claim");}
function maybeHandleAccountLoginFromUrl(){let token="";try{token=new URL(window.location.href).searchParams.get("mk_account_login")||"";}catch(_){}
if(!token)return;const pending=window.__mkAccountLoginTokensInFlightV1||(window.__mkAccountLoginTokensInFlightV1=new Set());if(pending.has(token))return;pending.add(token);const context=captureSocialAccountContext();const tokenIsCurrent=()=>{try{return new URL(window.location.href).searchParams.get("mk_account_login")===token;}catch(_){return false;}};window.setTimeout(async()=>{try{if(!tokenIsCurrent()||!socialAccountContextIsCurrent(context))return;const res=await claimAccountLoginToken(token,{reason:"qr-url-login"}).catch((err)=>({ok:false,error:String(err&&err.message||err)}));if(!tokenIsCurrent())return;if(res&&res.ok){const targetKey=String(res.profile&&(res.profile.accountKey||res.profile.account_key)||"").trim().toLowerCase();const workspaces=window.MkAccountWorkspaces;const targetContext=Object.assign({},context,{accountKey:targetKey,owner:workspaces&&typeof workspaces.ownerForAccount==="function"?workspaces.ownerForAccount(targetKey):"",allowWorkspaceSwitch:!!res.workspaceChanged});if(!targetKey||!socialAccountContextIsCurrent(targetContext))return;removeAccountLoginParamFromUrl(token);try{window.alert(`This device is now logged in as ${res.profile && res.profile.name ? res.profile.name : "the scanned account"}.`);}catch(_){}
try{mountComments();}catch(_){}
return;}
try{window.alert((res&&res.error)||"Could not use this QR login link.");}catch(_){}}finally{pending.delete(token);}},250);}
async function fetchAccountDevices(){return apiGet(`/identity/devices?visitorId=${encodeURIComponent(getVisitorId())}&deviceName=${encodeURIComponent(getDeviceName())}`);}
async function saveCurrentDeviceName(name){const nm=setDeviceNameLocal(name);const res=await apiPost("/identity/device-name",{visitorId:getVisitorId(),deviceName:nm});if(res&&res.ok)refreshAccountXpSoon("device-name",120);return res;}
async function disconnectAccountDevice(visitorHashValue){return apiPost("/identity/device-disconnect",{visitorId:getVisitorId(),targetVisitorHash:visitorHashValue});}
async function unlinkThisBrowserAccount(){return apiPost("/identity/unlink",{visitorId:getVisitorId()});}
async function deleteCurrentCloudAccount(){return apiPost("/identity/delete-account",{visitorId:getVisitorId()});}
async function fetchConnections(){return apiGet(`/connections?visitorId=${encodeURIComponent(getVisitorId())}`);}
async function searchConnections(query){const qs=new URLSearchParams({visitorId:getVisitorId(),q:cleanProfileNameLocal(query||""),limit:"12"});return apiGet(`/connections/search?${qs.toString()}`);}
async function requestConnection(targetName){const res=await apiPost("/connections/request",{visitorId:getVisitorId(),targetName});if(res&&res.ok){try{trackActivity("connection_request",{targetName,source:"connection-request"},{scope:`connection_request:${targetName}`,throttleMs:0});}catch(_){}
refreshAccountXpSoon("connection-request",120);}
return res;}
async function respondConnection(requesterKey,action){const res=await apiPost("/connections/respond",{visitorId:getVisitorId(),requesterKey,action});if(res&&res.ok){try{if(String(action||"")==="accept")trackActivity("connection_added",{requesterKey,source:"connection-accept"},{scope:`connection_added:${requesterKey}`,throttleMs:0});}catch(_){}
refreshAccountXpSoon("connection-response",120);}
return res;}
async function removeConnection(accountKey){const res=await apiPost("/connections/remove",{visitorId:getVisitorId(),accountKey});if(res&&res.ok){refreshAccountXpSoon("connection-remove",120);updateNotificationBadgesSoon(120,{force:true,reason:"connection-remove"});}
return res;}
function guestAnonCommentDayKey(ts){const d=new Date(Number(ts||Date.now())||Date.now());const day=`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;return GUEST_ANON_COMMENT_DAY_KEY_PREFIX+day;}
function markAnonymousCommentUsedToday(){try{localStorage.setItem(guestAnonCommentDayKey(),String(Date.now()));}catch(_){}}
function scheduleLocalProgressSyncForNamedGuest(reason){window.setTimeout(async()=>{try{markCloudSyncDirty(reason||"named-guest-comment-account");}catch(_){}
try{await syncAllAccountDataNow({force:true,reason:reason||"named-guest-comment-account",timeoutMs:ACCOUNT_SYNC_MANUAL_TIMEOUT_MS,});}catch(_){try{scheduleCloudSync(reason||"named-guest-comment-account",{delay:800,force:true});}catch(__){}}
try{window.MkGuestAccess&&window.MkGuestAccess.refreshBadges&&window.MkGuestAccess.refreshBadges();}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-guest-account-change",{detail:{hasAccount:!!readLocalProfile().accountKey,source:reason||"named-guest-comment-account"}}));}catch(_){}},80);}
function getLocalPageActions(){try{if(window.MkAccountData&&typeof window.MkAccountData.getLocalPageActions==="function")return window.MkAccountData.getLocalPageActions();}catch(_){}
return readLocalArray(LOCAL_PAGE_ACTIONS_KEY);}
function saveLocalPageAction(path,pageTitle,action,active){const p=String(path||"");const a=String(action||"");if(!p||!a)return;try{if(window.MkAccountData&&typeof window.MkAccountData.recordPageAction==="function"){window.MkAccountData.recordPageAction(p,pageTitle||p,a,!!active,{source:"saveLocalPageAction"});}}catch(_){}
queuePageActionCloudState(p,pageTitle||p,a,!!active,"saveLocalPageAction");let arr=[];try{arr=(window.MkAccountData&&typeof window.MkAccountData.getLocalPageActions==="function")?window.MkAccountData.getLocalPageActions():readLocalArray(LOCAL_PAGE_ACTIONS_KEY).filter((x)=>x&&!(x.path===p&&x.action===a));if(!window.MkAccountData&&active)arr.unshift({path:p,title:cleanPageTitleText(pageTitle||p),action:a,ts:Date.now()});}catch(_){arr=[];}
writeLocalArray(LOCAL_PAGE_ACTIONS_KEY,arr,5000);if(a==="favorite"){try{const favs=window.MkAccountData&&typeof window.MkAccountData.getLocalFavorites==="function"?window.MkAccountData.getLocalFavorites():arr.filter((x)=>x&&x.action==="favorite");writeLocalArray(LOCAL_FAVORITES_KEY,favs,5000);}catch(_){}}
activityChanged("page-action",{path:p,action:a,active:!!active});}
async function fetchPublicProfile(name,options){return apiGet(publicProfileUrl(name,options));}
function getLocalVisitsForSync(){const stored=readLocalArray(LOCAL_VISITS_KEY);let live=[];try{if(window.MkHotTrack&&typeof window.MkHotTrack.getLocalVisits==="function")live=window.MkHotTrack.getLocalVisits()||[];}catch(_){live=[];}
return mergeByPathTime(stored,live,{key:"path",timeKeys:["ts","lastVisited","last_visited","updatedAt"],max:1000});}
function readLocalMasteryMap(){try{const obj=JSON.parse(localStorage.getItem(LOCAL_MASTERY_KEY)||"{}");return obj&&typeof obj==="object"&&!Array.isArray(obj)?obj:{};}catch(_){return{};}}
function writeLocalMasteryMap(obj){const next=JSON.stringify(obj&&typeof obj==="object"?obj:{});let prev="";try{prev=localStorage.getItem(LOCAL_MASTERY_KEY)||"{}";}catch(_){prev="";}
if(prev===next)return false;const ok=safeSetLocalStorageItem(LOCAL_MASTERY_KEY,next,"mastery-map");if(!ok)return false;try{window.dispatchEvent(new CustomEvent("conceptMasteryChanged",{detail:{source:"cloud-sync"}}));}catch(_){}
return true;}
function mergeMasteryRecordForLocal(oldRec,cloudRec,cloudUpdatedAt){const old=oldRec&&typeof oldRec==="object"?oldRec:{};const rec=cloudRec&&typeof cloudRec==="object"?cloudRec:{};const oldRated=masteryHasRating(old);const cloudRated=masteryHasRating(rec);const oldRatingAt=masteryRatingUpdatedAt(old);const cloudRatingAt=masteryRatingUpdatedAt(rec);const merged=Object.assign({},old,rec);if(oldRated&&(!cloudRated||oldRatingAt>cloudRatingAt)){merged.m=Number(old.m);if(old.lastReviewed||old.last_reviewed)merged.lastReviewed=old.lastReviewed||old.last_reviewed;}else if(cloudRated){merged.m=Number(rec.m);if(rec.lastReviewed||rec.last_reviewed||cloudRatingAt)merged.lastReviewed=rec.lastReviewed||rec.last_reviewed||cloudRatingAt;}else{delete merged.m;merged.unrated=true;}
const oldView=Math.max(Number(old.viewCount)||0,Number(old.views)||0);const cloudView=Math.max(Number(rec.viewCount)||0,Number(rec.views)||0);if(Math.max(oldView,cloudView))merged.viewCount=Math.max(oldView,cloudView);const oldVisit=Number(old.visitCount)||0;const cloudVisit=Number(rec.visitCount)||0;if(Math.max(oldVisit,cloudVisit))merged.visitCount=Math.max(oldVisit,cloudVisit);const oldReviewed=Math.max(masteryTimestampValue(old.lastReviewed),masteryTimestampValue(old.last_reviewed));const cloudReviewed=Math.max(masteryTimestampValue(rec.lastReviewed),masteryTimestampValue(rec.last_reviewed),cloudRatingAt);if(Math.max(oldReviewed,cloudReviewed))merged.lastReviewed=Math.max(oldReviewed,cloudReviewed);const oldViewed=Math.max(masteryTimestampValue(old.lastViewed),masteryTimestampValue(old.lastSeen),masteryTimestampValue(old.viewedAt));const cloudViewed=Math.max(masteryTimestampValue(rec.lastViewed),masteryTimestampValue(rec.lastSeen),masteryTimestampValue(rec.viewedAt));if(Math.max(oldViewed,cloudViewed))merged.lastViewed=Math.max(oldViewed,cloudViewed);const hist=mergeMasteryHistories(old,rec);if(hist.length)merged.history=hist;merged.visited=!!(old.visited||rec.visited||merged.viewCount||merged.visitCount||merged.lastViewed);const clearedAt=Math.max(Number(old.ratingClearedAt)||0,Number(rec.ratingClearedAt)||0);if(clearedAt&&clearedAt>=Math.max(oldRatingAt,cloudRatingAt)){merged.m=null;merged.unrated=true;merged.state="unrated";merged.lastReviewed=0;merged.reviewCount=0;merged.ratingClearedAt=clearedAt;merged.history=hist.filter((h)=>h.kind==="view");}else if(oldRated||cloudRated){merged.unrated=false;merged.state="rated";merged.ratingClearedAt=0;}
merged.updatedAt=Math.max(masteryActivityAt(old),masteryActivityAt(rec),masteryTimestampValue(cloudUpdatedAt),clearedAt);return merged;}
function readLocalAiQuizSessionsMap(){try{const obj=JSON.parse(localStorage.getItem(LOCAL_AI_QUIZ_SESSIONS_KEY)||"{}");return obj&&typeof obj==="object"&&!Array.isArray(obj)?obj:{};}catch(_){return{};}}
function writeLocalAiQuizSessionsMap(obj,opts){const nextObj=obj&&typeof obj==="object"&&!Array.isArray(obj)?obj:{};let next="{}";try{next=JSON.stringify(nextObj);}catch(_){next="{}";}
let prev="";try{prev=localStorage.getItem(LOCAL_AI_QUIZ_SESSIONS_KEY)||"{}";}catch(_){prev="";}
if(prev===next)return false;const ok=safeSetLocalStorageItem(LOCAL_AI_QUIZ_SESSIONS_KEY,next,"ai-quiz-sessions");if(!ok)return false;const source=opts&&opts.source||"local";try{window.dispatchEvent(new CustomEvent("mk-ai-quiz-sessions-changed",{detail:{source}}));}catch(_){}
try{window.dispatchEvent(new CustomEvent("conceptMasteryChanged",{detail:{source,quizSessionsChanged:true}}));}catch(_){}
return true;}
function normaliseLocalConceptPathForXp(path){let p=String(path||"").trim();if(!p)return"";try{if(/^https?:\/\//i.test(p))p=new URL(p).pathname;}catch(_){}
p=p.split("#")[0].split("?")[0].replace(/\\/g,"/").replace(/^\/+/,"").replace(/\/+$/g,"");if(!p)return"";if(/\.md$/i.test(p))p=p.replace(/\.md$/i,".html");if(!/\.html$/i.test(p)&&p.includes("/"))p+=".html";return p;}
function aiQuizSessionSemanticKeyForSync(session,path){const s=session&&typeof session==="object"?session:{};const p=normaliseLocalConceptPathForXp(s.concept_id||s.conceptId||s.path||path||"");const qs=aiQuizQuestionSignatureForSync(s);const raw=[p,qs||String(s.textSignature||s.text_signature||s.resultText||s.result_text||s.summary||"").slice(0,500),s.correct_count!=null?s.correct_count:s.correct!=null?s.correct:"",s.total!=null?s.total:s.total_questions!=null?s.total_questions:"",s.suggested_mastery!=null?s.suggested_mastery:s.suggestedMastery!=null?s.suggestedMastery:""].join("::");return`aiq-sem-${fastStringHash(raw)}`;}
function aiQuizStableTimestampForSync(session,path,fallback){const direct=localAiQuizSessionTime(session,fallback||0)||aiQuizSessionUpdatedAt(session,fallback||0);if(direct)return direct;const seed=aiQuizSessionSemanticKeyForSync(session,path);const n=parseInt(fastStringHash(seed),36);return 1704067200000+(Number.isFinite(n)?(n%(366*24*60*60*1000)):0);}
function localAiQuizResultId(session,path,ts){const s=session&&typeof session==="object"?session:{};const explicit=String(s.result_id||s.resultId||s.completionId||s.completion_id||"").trim();if(explicit)return explicit;const stableTs=ts||localAiQuizSessionTime(s,0)||0;const raw=[normaliseLocalConceptPathForXp(s.concept_id||s.conceptId||path||""),s.ts||s.started_at||s.startedAt||"",s.completed_at||s.completedAt||stableTs||"",aiQuizSessionSemanticKeyForSync(s,path)].join("::");return`local-aiq-${fastStringHash(raw)}`;}
function mergeCloudAiQuizSessionsIntoLocal(cloudInput){const rows=Array.isArray(cloudInput)?cloudInput:[];if(!rows.length)return false;const all=readLocalAiQuizSessionsMap();let changed=false;const seenHardLimit=80;rows.forEach((entry)=>{if(!entry||typeof entry!=="object")return;const session=entry.session&&typeof entry.session==="object"?Object.assign({},entry.session):Object.assign({},entry);const path=normaliseLocalConceptPathForXp(session.concept_id||session.conceptId||entry.path||session.path||"");if(!path)return;const ts=aiQuizStableTimestampForSync(session,path,entry.completedAt||entry.completed_at||entry.ts);const resultId=String(entry.resultId||entry.result_id||session.result_id||session.resultId||localAiQuizResultId(session,path,ts)).trim();const semanticId=aiQuizSessionSemanticKeyForSync(session,path);if(!resultId)return;session.concept_id=path;session.result_id=resultId;if(ts&&!session.completed_at)session.completed_at=ts;if(entry.title&&!session.concept_title&&!session.title)session.concept_title=entry.title;const arr=Array.isArray(all[path])?all[path].slice():[];const idx=arr.findIndex((old)=>{const oldId=String(old&&(old.result_id||old.resultId||localAiQuizResultId(old,path,aiQuizStableTimestampForSync(old,path,0)))||"");if(oldId===resultId)return true;return aiQuizSessionSemanticKeyForSync(old,path)===semanticId;});if(idx>=0){const old=arr[idx]&&typeof arr[idx]==="object"?arr[idx]:{};const oldTs=aiQuizSessionUpdatedAt(old,0);if((ts||0)>=oldTs){const merged=Object.assign({},old,session);if(JSON.stringify(old)!==JSON.stringify(merged)){arr[idx]=merged;changed=true;}}}else{arr.push(session);changed=true;}
const dedup=new Map();arr.forEach((item)=>{const itemTs=aiQuizStableTimestampForSync(item,path,0);const itemKey=aiQuizSessionSemanticKeyForSync(item,path)||String(item&&(item.result_id||item.resultId||localAiQuizResultId(item,path,itemTs))||"");const old=dedup.get(itemKey);if(!old||itemTs>=aiQuizStableTimestampForSync(old,path,0))dedup.set(itemKey,item);});all[path]=Array.from(dedup.values()).sort((a,b)=>aiQuizStableTimestampForSync(a,path,0)-aiQuizStableTimestampForSync(b,path,0)).slice(-seenHardLimit);});if(changed)writeLocalAiQuizSessionsMap(all,{source:"cloud-sync"});return changed;}
function localMasteryJsonSnapshotPayload(){return{type:"account_mastery_json_snapshot",version:2,updatedAt:Date.now(),mastery:readLocalMasteryMap(),quizSessions:readLocalAiQuizSessionsMap(),};}
function applyMasteryJsonSnapshot(snapshot){const snap=snapshot&&typeof snapshot==="object"?snapshot:{};let changed=false;try{const cloudMap=snap.mastery&&typeof snap.mastery==="object"&&!Array.isArray(snap.mastery)?snap.mastery:{};const all=readLocalMasteryMap();Object.entries(cloudMap).forEach(([path,rec])=>{const p=normaliseMasteryKeyForAccountJson(path,rec);if(!p||!rec||typeof rec!=="object"||Array.isArray(rec))return;const next=mergeMasteryRecordForLocal(all[p],Object.assign({},rec,{path:p}),rec.cloudUpdatedAt||rec.updatedAt||rec.updated_at);if(JSON.stringify(all[p]||null)!==JSON.stringify(next||null)){all[p]=next;changed=true;}});if(changed)writeLocalMasteryMap(all);}catch(_){}
let quizChanged=false;try{quizChanged=mergeCloudAiQuizSessionsIntoLocal(flattenSnapshotQuizSessions(snap.quizSessions||snap.aiQuizSessions||{}));}catch(_){quizChanged=false;}
if(changed||quizChanged){try{window.dispatchEvent(new CustomEvent("mk-local-activity-change",{detail:{type:"cloud-sync-mastery-json",quizSessionsChanged:quizChanged}}));}catch(_){}}
return changed||quizChanged;}
async function fetchAndApplyMasteryJsonSnapshot(){const data=await apiGet(`/identity/mastery-json-sync?visitorId=${encodeURIComponent(getVisitorId())}&t=${Date.now()}`);if(data&&data.ok&&data.snapshot)applyMasteryJsonSnapshot(data.snapshot);return data;}
async function uploadMasteryJsonSnapshot(opts){const options=opts&&typeof opts==="object"?opts:{};const force=!!options.force;const profile=readLocalProfile();if(!profile||!(profile.accountKey||profile.name))return{ok:true,skipped:true,reason:"no_account"};const payload=localMasteryJsonSnapshotPayload();const text=JSON.stringify(payload);const fingerprint=masterySnapshotTextFingerprint(text);let last="";try{last=localStorage.getItem(MASTERY_JSON_SNAPSHOT_FINGERPRINT_KEY)||"";}catch(_){}
if(!force&&last===fingerprint)return{ok:true,skipped:true,reason:"mastery_json_unchanged"};const chunks=splitMasterySnapshotText(text);const syncId=`mjs_${Date.now().toString(36)}_${fastStringHash(fingerprint)}`;let final=null;for(let i=0;i<chunks.length;i+=1){const res=await apiPost("/identity/mastery-json-sync",{visitorId:getVisitorId(),deviceName:getDeviceName(),syncId,chunkIndex:i,chunkCount:chunks.length,chunk:chunks[i],});if(!res||res.ok===false)return res||{ok:false,error:"mastery_json_snapshot_upload_failed"};final=res;}
if(final&&final.snapshot)applyMasteryJsonSnapshot(final.snapshot);try{localStorage.setItem(MASTERY_JSON_SNAPSHOT_FINGERPRINT_KEY,masterySnapshotTextFingerprint(JSON.stringify(localMasteryJsonSnapshotPayload())));}catch(_){}
return final||{ok:true};}
async function syncMasteryJsonSnapshot(opts){const options=opts&&typeof opts==="object"?opts:{};let uploaded=null;try{uploaded=await uploadMasteryJsonSnapshot(options);}catch(err){uploaded={ok:false,error:err&&err.message||"mastery_json_upload_failed"};}
let fetched=null;try{fetched=await fetchAndApplyMasteryJsonSnapshot();}catch(_){fetched=null;}
return Object.assign({ok:true},uploaded||{},{fetchedOk:!!(fetched&&fetched.ok)});}
function accountJsonSyncReadStore(id){if(id==="visits")return getLocalVisitsForSync();if(id==="pageActions")return getLocalPageActions();if(id==="favorites")return getLocalFavorites();if(id==="comments")return getLocalComments();if(id==="commentReports")return getLocalCommentReports();if(id==="readiness")return getLocalReadinessList();if(id==="mastery")return normaliseMasteryMapForAccountJson(readLocalMasteryMap());if(id==="quizSessions")return readLocalAiQuizSessionsMap();if(id==="activityEvents")return readLocalActivityEvents();if(id==="localStorage")return accountLocalStorageSnapshotForSync();return null;}
function accountJsonSyncStores(opts){const options=opts&&typeof opts==="object"?opts:{};const includeActivityEvents=options.includeActivityEvents!==false;const stores={visits:accountJsonSyncReadStore("visits"),pageActions:accountJsonSyncReadStore("pageActions"),favorites:accountJsonSyncReadStore("favorites"),comments:accountJsonSyncReadStore("comments"),commentReports:accountJsonSyncReadStore("commentReports"),readiness:accountJsonSyncReadStore("readiness"),mastery:accountJsonSyncReadStore("mastery"),quizSessions:accountJsonSyncReadStore("quizSessions"),activityEvents:includeActivityEvents?accountJsonSyncReadStore("activityEvents"):[],localStorage:accountJsonSyncReadStore("localStorage"),};return stores;}
function localAccountJsonSnapshotPayload(opts){const profile=readLocalProfile();return{type:ACCOUNT_JSON_SYNC_TYPE,version:1,updatedAt:Date.now(),deviceName:getDeviceName(),accountKey:profile&&profile.accountKey||"",activityEventMax:ACCOUNT_SYNC_ACTIVITY_EVENT_CAP_VERSION,learningHistoryMax:ACCOUNT_SYNC_ACTIVITY_EVENT_CAP_VERSION,stores:accountJsonSyncStores(opts),};}
function accountJsonSyncCountStore(id,value){if(id==="mastery"&&value&&typeof value==="object"&&!Array.isArray(value))return Object.keys(normaliseMasteryMapForAccountJson(value)).length;if(id==="quizSessions"&&value&&typeof value==="object"&&!Array.isArray(value)){return Object.values(value).reduce((n,arr)=>n+(Array.isArray(arr)?arr.length:(arr&&typeof arr==="object"?1:0)),0);}
if(id==="localStorage"&&value&&typeof value==="object"&&!Array.isArray(value)){const keys=value.keys&&typeof value.keys==="object"&&!Array.isArray(value.keys)?value.keys:value;return Object.keys(keys||{}).filter((k)=>!["version","updatedAt","updated_at"].includes(k)).length;}
if(Array.isArray(value))return value.length;if(value&&typeof value==="object")return Object.keys(value).length;return 0;}
function accountJsonSyncStats(snapshot){const snap=snapshot&&typeof snapshot==="object"?snapshot:{};const stores=snap.stores&&typeof snap.stores==="object"&&!Array.isArray(snap.stores)?snap.stores:{};const out={};let total=0;Object.entries(stores).forEach(([id,value])=>{const n=accountJsonSyncCountStore(id,value);out[id]=n;total+=n;});return{total,stores:out};}
function accountJsonSyncFingerprintForPayload(payload){try{const text=JSON.stringify(payload||localAccountJsonSnapshotPayload());return masterySnapshotTextFingerprint(text);}catch(_){return String(Date.now());}}
function normaliseQuizSessionMapForAccountSync(map){const src=map&&typeof map==="object"&&!Array.isArray(map)?map:{};const out={};const add=(rawPath,session)=>{if(!session||typeof session!=="object"||Array.isArray(session))return;const path=normaliseLocalConceptPathForXp(session.concept_id||session.conceptId||session.path||rawPath||"");if(!path)return;const ts=aiQuizStableTimestampForSync(session,path,session.completed_at||session.completedAt||session.updatedAt||session.ts);const resultId=String(session.result_id||session.resultId||localAiQuizResultId(session,path,ts)).trim();if(!resultId)return;const clean=Object.assign({},session,{concept_id:path,result_id:resultId,completed_at:Number(session.completed_at||session.completedAt||0)||ts});if(!Array.isArray(out[path]))out[path]=[];out[path].push(clean);};Object.entries(src).forEach(([path,value])=>{if(Array.isArray(value))value.forEach((session)=>add(path,session));else add(path,value);});Object.keys(out).forEach((path)=>{const m=new Map();out[path].forEach((session)=>{const ts=aiQuizStableTimestampForSync(session,path,0);const rid=String(session.result_id||session.resultId||localAiQuizResultId(session,path,ts)).trim();const sem=aiQuizSessionSemanticKeyForSync(session,path);const key=sem||rid;const old=m.get(key)||(rid&&m.get(rid));if(!old||ts>=aiQuizStableTimestampForSync(old,path,0))m.set(key||rid,session);});out[path]=Array.from(new Set(Array.from(m.values()))).sort((a,b)=>aiQuizStableTimestampForSync(a,path,0)-aiQuizStableTimestampForSync(b,path,0)).slice(-160);});return out;}
function mergeQuizSessionMapsForAccountSync(localMap,cloudMap){const a=normaliseQuizSessionMapForAccountSync(localMap);const b=normaliseQuizSessionMapForAccountSync(cloudMap);const out=Object.assign({},a);Object.entries(b).forEach(([path,arr])=>{const merged=normaliseQuizSessionMapForAccountSync(Object.assign({},{[path]:[].concat(out[path]||[],arr||[])}));out[path]=merged[path]||[];});return out;}
function normaliseMasteryKeyForAccountJson(rawPath,rec){const r=rec&&typeof rec==="object"&&!Array.isArray(rec)?rec:{};let p=normaliseLocalConceptPathForXp(r.path||r.conceptId||r.concept_id||rawPath||"");if(!p)p=String(rawPath||"").trim().split("#")[0].split("?")[0].replace(/\\/g,"/").replace(/^\/+/,"").replace(/\/+$/g,"");return p;}
function normaliseMasteryMapForAccountJson(map){const src=map&&typeof map==="object"&&!Array.isArray(map)?map:{};const out={};Object.entries(src).forEach(([rawPath,rec])=>{if(!rec||typeof rec!=="object"||Array.isArray(rec))return;const path=normaliseMasteryKeyForAccountJson(rawPath,rec);if(!path)return;const data=Object.assign({},rec);delete data.path;out[path]=data;});return out;}
function mergeMasteryMapsForAccountSync(localMap,cloudMap){const out=Object.assign({},localMap&&typeof localMap==="object"&&!Array.isArray(localMap)?localMap:{});const cloud=cloudMap&&typeof cloudMap==="object"&&!Array.isArray(cloudMap)?cloudMap:{};Object.entries(cloud).forEach(([rawPath,rec])=>{const path=normaliseMasteryKeyForAccountJson(rawPath,rec);if(!path||!rec||typeof rec!=="object"||Array.isArray(rec))return;out[path]=mergeMasteryRecordForLocal(out[path],Object.assign({},rec,{path}),rec.cloudUpdatedAt||rec.updatedAt||rec.updated_at);});return out;}
function applyAccountJsonSnapshot(snapshot){const snap=snapshot&&typeof snapshot==="object"?snapshot:{};const stores=snap.stores&&typeof snap.stores==="object"&&!Array.isArray(snap.stores)?snap.stores:{};const before=accountJsonSyncStats(localAccountJsonSnapshotPayload());let changed=false;try{const visits=mergeByPathTime(getLocalVisitsForSync(),stores.visits||[],{key:"path",timeKeys:["ts","lastVisited","last_visited","updatedAt"],max:1000});if(JSON.stringify(visits)!==JSON.stringify(getLocalVisitsForSync())){if(writeLocalArray(LOCAL_VISITS_KEY,visits,1000))changed=true;}}catch(_){}
try{const actions=mergeActions(getLocalPageActions(),stores.pageActions||[]);if(JSON.stringify(actions)!==JSON.stringify(getLocalPageActions())){writeLocalArray(LOCAL_PAGE_ACTIONS_KEY,actions,1200);changed=true;}}catch(_){}
try{const favorites=accountJsonMergeArrayById(getLocalFavorites(),stores.favorites||[],{key:"path",timeKeys:["updatedAt","ts","createdAt"],max:1000});if(JSON.stringify(favorites)!==JSON.stringify(getLocalFavorites())){writeLocalArray(LOCAL_FAVORITES_KEY,favorites,1000);changed=true;}}catch(_){}
try{const comments=accountJsonMergeArrayById(getLocalComments(),stores.comments||[],{key:"id",timeKeys:["editedAt","deletedAt","ts","createdAt"],max:1000});if(JSON.stringify(comments)!==JSON.stringify(getLocalComments())){writeLocalArray(LOCAL_COMMENTS_KEY,comments,1000);changed=true;}}catch(_){}
try{const reports=accountJsonMergeArrayById(getLocalCommentReports(),stores.commentReports||[],{key:(x)=>String(x&&(x.reportId||x.report_id||x.id||x.commentId||x.comment_id)||""),timeKeys:["ts","createdAt","updatedAt"],max:1000});if(JSON.stringify(reports)!==JSON.stringify(getLocalCommentReports())){writeLocalArray(LOCAL_COMMENT_REPORTS_KEY,reports,1000);changed=true;}}catch(_){}
try{const readiness=mergeByPathTime(getLocalReadinessList(),stores.readiness||[],{key:"path",timeKeys:["updatedAt","updated_at","ts"],max:2000});if(JSON.stringify(readiness)!==JSON.stringify(getLocalReadinessList())){writeLocalArray(LOCAL_READINESS_KEY,readiness,2000);changed=true;}}catch(_){}
try{const mastery=mergeMasteryMapsForAccountSync(readLocalMasteryMap(),stores.mastery||{});if(writeLocalMasteryMap(mastery))changed=true;}catch(_){}
try{const quizSessions=mergeQuizSessionMapsForAccountSync(readLocalAiQuizSessionsMap(),stores.quizSessions||{});if(writeLocalAiQuizSessionsMap(quizSessions,{source:"cloud-sync"}))changed=true;}catch(_){}
try{const events=mergeActivityEvents(readLocalActivityEvents(),stores.activityEvents||[]);if(JSON.stringify(events)!==JSON.stringify(readLocalActivityEvents())){if(writeLocalActivityEvents(events))changed=true;}}catch(_){}
try{if(applyAccountLocalStorageSnapshotFromCloud(stores.localStorage||{}))changed=true;}catch(_){}
const after=accountJsonSyncStats(localAccountJsonSnapshotPayload());const downloaded=accountJsonSyncPositiveDelta(before,after);if(changed){try{window.dispatchEvent(new CustomEvent("mk-local-activity-change",{detail:{type:"cloud-sync-json",downloaded}}));}catch(_){}}
return{changed,before,after,downloaded};}
async function fetchAccountJsonSnapshotChunked(opts){const options=opts&&typeof opts==="object"?opts:{};const onProgress=typeof options.onProgress==="function"?options.onProgress:null;const base=`/identity/json-sync?visitorId=${encodeURIComponent(getVisitorId())}&chunked=1&omitActivityEvents=1&t=${Date.now()}`;const meta=await apiGet(`${base}&meta=1`);if(!meta||meta.ok===false||!meta.chunked)return meta;const count=Math.max(0,Number(meta.chunkCount||0)||0);if(!count)return Object.assign({},meta,{snapshot:{type:ACCOUNT_JSON_SYNC_TYPE,version:1,updatedAt:meta.updatedAt||0,stores:{}}});let text="";for(let i=0;i<count;i+=1){if(onProgress)onProgress({phase:"download",label:`Downloading cloud snapshot chunk ${i + 1}/${count}`,chunkIndex:i+1,chunkCount:count});const part=await apiGet(`${base}&chunkIndex=${i}`);if(!part||part.ok===false)return Object.assign({ok:false,chunked:true,chunkIndex:i,chunkCount:count},part||{error:"cloud_snapshot_chunk_download_failed"});text+=String(part.chunk||part.data||"");}
try{const snapshot=JSON.parse(text||"{}");return Object.assign({},meta,{ok:true,chunked:true,snapshot,stats:meta.stats||accountJsonSyncStats(snapshot)});}catch(_){return{ok:false,chunked:true,error:"Cloud snapshot could not be parsed."};}}
async function fetchAndApplyAccountJsonSnapshot(opts){const options=opts&&typeof opts==="object"?opts:{};let data=null;try{data=await fetchAccountJsonSnapshotChunked(options);}catch(err){data={ok:false,error:err&&err.message||"chunked_account_json_fetch_failed"};}
if(!data||data.ok===false||!data.snapshot){try{const paged=await fetchAndApplyCloudActivityPaged({onProgress:options.onProgress});if(paged&&paged.ok)return paged;}catch(_){}
try{data=await apiGet(`/identity/json-sync?visitorId=${encodeURIComponent(getVisitorId())}&t=${Date.now()}`);}
catch(err){data={ok:false,error:err&&err.message||"account_json_fetch_failed"};}}
let applied=null;let pagedActivity=null;if(data&&data.ok&&data.snapshot){const cloudActivityCount=Math.min(ACCOUNT_SYNC_ACTIVITY_EVENT_MAX,accountJsonCloudActivityCount(data));const stores=data.snapshot&&data.snapshot.stores&&typeof data.snapshot.stores==="object"?data.snapshot.stores:{};const snapshotEvents=Array.isArray(stores.activityEvents)?stores.activityEvents.length:0;const usePagedActivity=cloudActivityCount>1000||snapshotEvents>1000||isMobilePowerSensitiveViewport();const snapshotForApply=usePagedActivity?accountJsonSnapshotWithoutActivityEvents(data.snapshot):data.snapshot;applied=applyAccountJsonSnapshot(snapshotForApply);let afterApplyStats=accountJsonSyncStats(localAccountJsonSnapshotPayload());let missingActivity=Math.max(0,cloudActivityCount-Number(afterApplyStats.stores&&afterApplyStats.stores.activityEvents||0));if(cloudActivityCount>0&&(usePagedActivity||missingActivity>0)){try{pagedActivity=await fetchAndApplyCloudActivityPaged({onProgress:options.onProgress,expectedTotal:cloudActivityCount});if(pagedActivity&&pagedActivity.ok&&pagedActivity.applied){afterApplyStats=accountJsonSyncStats(localAccountJsonSnapshotPayload());applied={changed:!!((applied&&applied.changed)||(pagedActivity.applied&&pagedActivity.applied.changed)),before:applied&&applied.before||pagedActivity.applied.before,after:afterApplyStats,downloaded:accountJsonSyncPositiveDelta((applied&&applied.before)||(pagedActivity.applied&&pagedActivity.applied.before)||{stores:{}},afterApplyStats),};}}catch(err){pagedActivity={ok:false,error:err&&err.message||"learning_history_paged_download_failed"};}}}
if(pagedActivity&&pagedActivity.ok===false){return Object.assign({},data||{},{ok:false,error:pagedActivity.error||"Learning history could not be downloaded.",applied,pagedActivity});}
return Object.assign({},data||{},{applied,pagedActivity});}
async function uploadLocalActivityEventsPaged(opts){const accountContext=captureSocialAccountContext();const options=opts&&typeof opts==="object"?opts:{};const onProgress=typeof options.onProgress==="function"?options.onProgress:null;await ensureLocalActivityEventsHydrated();if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const events=readLocalActivityEvents();if(!events.length)return{ok:true,skipped:true,reason:"no_learning_history",uploaded:0};const cloudEventTotal=Math.max(0,Number(options.cloudEventTotal||0)||0);const localEventTotal=events.length;const fingerprint=localActivityEventsUploadFingerprint(events);let last="";try{last=localStorage.getItem(LOCAL_ACTIVITY_EVENTS_UPLOAD_FINGERPRINT_KEY)||"";}catch(_){}
if(!options.force&&cloudEventTotal>=localEventTotal&&last===fingerprint)return{ok:true,skipped:true,reason:"learning_history_already_uploaded",uploaded:0,localEventTotal,cloudEventTotal};if(cloudEventTotal>=localEventTotal&&!cloudSyncDirtyAt()){try{safeSetLocalStorageItem(LOCAL_ACTIVITY_EVENTS_UPLOAD_FINGERPRINT_KEY,fingerprint,"activity-events-upload-fingerprint");}catch(_){}
return{ok:true,skipped:true,reason:"cloud_has_learning_history",uploaded:0,localEventTotal,cloudEventTotal};}
const pageSize=isMobilePowerSensitiveViewport()?120:240;let uploaded=0;for(let i=0;i<events.length;i+=pageSize){if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const batch=events.slice(i,i+pageSize).map(compactActivityEventForStorage);if(onProgress)onProgress({phase:"upload",label:`Uploading learning history ${i + 1}-${Math.min(i + batch.length, events.length)}/${events.length}`,chunkIndex:Math.floor(i/pageSize)+1,chunkCount:Math.ceil(events.length/pageSize)});const res=await apiPost("/identity/import-local",{visitorId:getVisitorId(),deviceName:getDeviceName(),eventsOnly:true,events:batch});if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!res||res.ok===false)return Object.assign({ok:false,uploaded,error:res&&res.error||"learning_history_upload_failed"},res||{});uploaded+=batch.length;await new Promise((resolve)=>window.setTimeout(resolve,isMobilePowerSensitiveViewport()?30:5));}
if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();try{safeSetLocalStorageItem(LOCAL_ACTIVITY_EVENTS_UPLOAD_FINGERPRINT_KEY,fingerprint,"activity-events-upload-fingerprint");}catch(_){}
return{ok:true,uploaded,localEventTotal,cloudEventTotal};}
async function uploadAccountJsonSnapshot(opts){const options=opts&&typeof opts==="object"?opts:{};const force=!!options.force;const onProgress=typeof options.onProgress==="function"?options.onProgress:null;const profile=readLocalProfile();if(!profile||!profile.accountKey)return{ok:true,skipped:true,reason:"no_account"};const payload=localAccountJsonSnapshotPayload({includeActivityEvents:false});const text=JSON.stringify(payload);const fingerprint=accountJsonSyncFingerprintForPayload(Object.assign({},localAccountJsonSnapshotPayload(),{uploadedWithoutActivityEvents:true}));let last="";try{last=localStorage.getItem(ACCOUNT_JSON_SYNC_FINGERPRINT_KEY)||"";}catch(_){}
if(!force&&last===fingerprint&&!cloudSyncDirtyAt())return{ok:true,skipped:true,reason:"account_json_unchanged"};const beforeLocalStats=accountJsonSyncStats(localAccountJsonSnapshotPayload());const uploadPayloadStats=accountJsonSyncStats(payload);const chunks=splitAccountJsonSnapshotText(text);const syncId=`ajs_${Date.now().toString(36)}_${fastStringHash(fingerprint)}`;let final=null;if(onProgress)onProgress({phase:"upload",label:"Uploading account data",chunkIndex:0,chunkCount:chunks.length,bytes:text.length,stats:uploadPayloadStats});for(let i=0;i<chunks.length;i+=1){if(onProgress)onProgress({phase:"upload",label:`Uploading account data chunk ${i + 1}/${chunks.length}`,chunkIndex:i+1,chunkCount:chunks.length,bytes:text.length,stats:uploadPayloadStats});const res=await apiPost("/identity/json-sync",{visitorId:getVisitorId(),deviceName:getDeviceName(),syncId,chunkIndex:i,chunkCount:chunks.length,chunk:chunks[i],deferCanonical:true,returnSnapshot:false});if(!res||res.ok===false)return res||{ok:false,error:"account_json_snapshot_upload_failed"};final=res;if(res.partial&&onProgress)onProgress({phase:"upload",label:`Server received ${res.received || i + 1}/${res.chunkCount || chunks.length} chunks`,chunkIndex:i+1,chunkCount:chunks.length,bytes:text.length,stats:beforeLocalStats});}
if(onProgress)onProgress({phase:"merge",label:"Merging cloud snapshot back into this browser"});let applied=null;if(final&&final.snapshot)applied=applyAccountJsonSnapshot(final.snapshot);let afterPayload=localAccountJsonSnapshotPayload();let afterLocalStats=accountJsonSyncStats(afterPayload);const serverAfterStats=final&&final.summary&&final.summary.after||final&&final.stats||null;let localApplyMissing=accountJsonStatsMissing(afterLocalStats,serverAfterStats);if(final&&final.snapshot&&localApplyMissing.total>0){accountSyncClearDisposableLocalStorage("account-json-apply-retry");const retryApplied=applyAccountJsonSnapshot(final.snapshot);if(retryApplied&&retryApplied.changed&&applied&&applied.downloaded){applied.downloaded=accountJsonSyncPositiveDelta(beforeLocalStats,retryApplied.after||accountJsonSyncStats(localAccountJsonSnapshotPayload()));}
afterPayload=localAccountJsonSnapshotPayload();afterLocalStats=accountJsonSyncStats(afterPayload);localApplyMissing=accountJsonStatsMissing(afterLocalStats,serverAfterStats);}
try{safeSetLocalStorageItem(ACCOUNT_JSON_SYNC_FINGERPRINT_KEY,accountJsonSyncFingerprintForPayload(afterPayload),"account-json-fingerprint");}catch(_){}
const localToCloudMissing=accountJsonStatsExtraLocal(afterLocalStats,serverAfterStats);const summary={ok:true,beforeLocal:beforeLocalStats,afterLocal:afterLocalStats,uploaded:final&&final.summary&&final.summary.uploaded||{total:0,stores:{}},downloaded:accountJsonSyncPositiveDelta(beforeLocalStats,afterLocalStats),server:final&&final.summary||null,updatedAt:Date.now(),deviceName:getDeviceName(),payloadBytes:text.length,chunkCount:chunks.length,canonicalDeferred:!!(final&&final.canonicalDeferred),partialLocalApply:localApplyMissing.total>0,localApplyMissing,partialCloudApply:localToCloudMissing.total>0,localToCloudMissing,};const savedSummary=writeAccountSyncSummary(summary);return Object.assign({},final||{ok:true},{applied,accountJsonSummary:savedSummary});}
async function syncAccountJsonSnapshot(opts){const options=opts&&typeof opts==="object"?opts:{};const onProgress=typeof options.onProgress==="function"?options.onProgress:null;let firstFetch=null;if(!options.skipDownloadFirst){if(onProgress)onProgress({phase:"download",label:"Downloading cloud account JSON"});try{firstFetch=await fetchAndApplyAccountJsonSnapshot({onProgress});}
catch(err){firstFetch={ok:false,error:err&&err.message||"account_json_fetch_failed"};}}
let learningHistoryUpload=null;try{const cloudEventTotal=firstFetch&&firstFetch.stats&&firstFetch.stats.stores?Number(firstFetch.stats.stores.activityEvents||0):0;learningHistoryUpload=await uploadLocalActivityEventsPaged(Object.assign({},options,{cloudEventTotal,onProgress}));}catch(err){learningHistoryUpload={ok:false,error:err&&err.message||"learning_history_upload_failed"};}
if(learningHistoryUpload&&learningHistoryUpload.ok===false)return Object.assign({fetchedOk:!!(firstFetch&&firstFetch.ok)},learningHistoryUpload);let uploaded=null;try{uploaded=await uploadAccountJsonSnapshot(options);}catch(err){uploaded={ok:false,error:err&&err.message||"account_json_upload_failed"};}
let secondFetch=null;if(!uploaded||uploaded.ok===false||uploaded.skipped){if(!(firstFetch&&firstFetch.ok)){if(onProgress)onProgress({phase:"download",label:"Downloading cloud account JSON"});try{secondFetch=await fetchAndApplyAccountJsonSnapshot({onProgress});}
catch(err){secondFetch={ok:false,error:err&&err.message||"account_json_fetch_failed"};}}}
const fetched=secondFetch||firstFetch;if(uploaded&&uploaded.ok===false)return Object.assign({fetchedOk:!!(fetched&&fetched.ok)},uploaded);let summary=uploaded&&uploaded.accountJsonSummary?uploaded.accountJsonSummary:null;if(!summary&&fetched&&fetched.applied){summary={ok:true,uploaded:{total:0,stores:{}},downloaded:fetched.applied.downloaded||{total:0,stores:{}},afterLocal:accountJsonSyncStats(localAccountJsonSnapshotPayload()),server:fetched.stats?{after:fetched.stats,updatedAt:fetched.updatedAt||0}:null,updatedAt:Date.now(),};}
if(summary){summary=writeAccountSyncSummary(summary);}
return Object.assign({ok:true},uploaded||{},{fetchedOk:!!(fetched&&fetched.ok),accountJsonSummary:summary,firstFetchOk:!!(firstFetch&&firstFetch.ok),learningHistoryUpload});}
function enrichAccountSyncSummary(summary){const src=summary&&typeof summary==="object"?Object.assign({},summary):{};const now=Date.now();let localStats=null;try{localStats=accountJsonSyncStats(localAccountJsonSnapshotPayload());}catch(_){localStats={total:0,stores:{}};}
if(!src.afterLocal||typeof src.afterLocal!=="object")src.afterLocal=localStats;if(!src.deviceName)src.deviceName=getDeviceName();if(!src.updatedAt)src.updatedAt=now;if(!src.finishedAt&&src.completed!==false&&src.ok!==false)src.finishedAt=src.updatedAt;if(!src.uploaded||typeof src.uploaded!=="object")src.uploaded={total:0,stores:{}};if(!src.downloaded||typeof src.downloaded!=="object")src.downloaded={total:0,stores:{}};return src;}
function writeAccountSyncSummary(summary){const enriched=enrichAccountSyncSummary(summary);try{safeSetLocalStorageItem(ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY,JSON.stringify(enriched),"account-sync-summary");}catch(_){}
try{safeSetLocalStorageItem(ACCOUNT_SYNC_LAST_RESULT_KEY,JSON.stringify(enriched),"account-sync-result");}catch(_){}
try{safeSetLocalStorageItem(ACCOUNT_DATA_SYNC_SUMMARY_KEY,JSON.stringify(enriched),"account-data-sync-summary");}catch(_){}
try{sessionStorage.setItem(ACCOUNT_SYNC_LAST_RESULT_KEY,JSON.stringify(enriched));}catch(_){}
try{sessionStorage.setItem(ACCOUNT_DATA_SYNC_SUMMARY_KEY,JSON.stringify(enriched));}catch(_){}
try{maybeWriteConfirmedCloudSync(enriched);}catch(_){}
try{recordDeviceSyncedEventCount(enriched);}catch(_){}
return enriched;}
function accountSyncSummaryAccountKey(summary){try{const s=summary&&typeof summary==="object"?summary:null;return String((s&&(s.accountKey||s.account_key))||readLocalProfile().accountKey||"").trim().toLowerCase();}catch(_){return"";}}
function maybeWriteConfirmedCloudSync(summary){const s=summary&&typeof summary==="object"?summary:null;if(!s||s.ok===false)return null;if(!(s.finishedAt||s.updatedAt))return null;const currentKey=accountSyncSummaryAccountKey(s);const afterLocal=s.afterLocal&&typeof s.afterLocal==="object"?s.afterLocal:null;const rawServer=accountSyncSummaryRawServerStats(s);const displayOnly=!!(s.cloudDisplayOnly||s.server&&s.server.displayOnly);const cloudTargetRaw=rawServer||(displayOnly?null:afterLocal);const targetTotal=accountSyncStatsTotal(cloudTargetRaw);if(!targetTotal)return null;const existing=readJsonLocal(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY,null);const existingKey=accountSyncSummaryAccountKey(existing);const existingStats=existing&&existing.cloudStats&&typeof existing.cloudStats==="object"?existing.cloudStats:null;const cloudTarget=(existing&&existingKey&&currentKey&&existingKey!==currentKey)?cloudTargetRaw:accountSyncStatsMax(cloudTargetRaw,existingStats);const server=s.server&&typeof s.server==="object"?s.server:null;const isCompletedSync=!displayOnly&&!!(server&&(server.localCloudExact===true||server.cloudCanonicalExact===true));const summaryTime=Number(s.finishedAt||s.updatedAt||Date.now())||Date.now();const sameAccount=!(existing&&existingKey&&currentKey&&existingKey!==currentKey);const existingFinished=sameAccount?(Number(existing&&existing.finishedAt||0)||0):0;const existingChecked=sameAccount?(Number(existing&&(existing.updatedAt||existing.finishedAt)||0)||0):0;const rec={ok:true,accountKey:currentKey,cloudStats:cloudTarget,afterLocal,rawServer:rawServer||cloudTargetRaw||cloudTarget,source:s.schema||s.source||"account-sync-summary",displayOnly,stale:!!(s.staleCloudStatus||s.server&&s.server.stale),deviceName:s.deviceName||getDeviceName(),updatedAt:Math.max(existingChecked,summaryTime),finishedAt:isCompletedSync?Math.max(existingFinished,summaryTime):existingFinished,checkedAt:Math.max(existingChecked,summaryTime),};try{safeSetLocalStorageItem(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY,JSON.stringify(rec),"account-sync-confirmed-cloud");}catch(_){}
try{sessionStorage.setItem(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY,JSON.stringify(rec));}catch(_){}
return rec;}
function recordDeviceSyncedEventCount(summary){const ak=accountSyncSummaryAccountKey(summary);if(!ak)return;const count=deviceSyncedEventCountFromSummary(summary);if(!count)return;const rec={accountKey:ak,count,updatedAt:Date.now()};try{safeSetLocalStorageItem(ACCOUNT_DEVICE_SYNCED_EVENTS_KEY,JSON.stringify(rec),"account-device-synced-events");}catch(_){}
try{sessionStorage.setItem(ACCOUNT_DEVICE_SYNCED_EVENTS_KEY,JSON.stringify(rec));}catch(_){}}
function lastSyncedDeviceEventCount(accountKey){const ak=String(accountKey||"").trim().toLowerCase()||accountSyncSummaryAccountKey(null);if(!ak)return 0;let rec=null;try{rec=readJsonLocal(ACCOUNT_DEVICE_SYNCED_EVENTS_KEY,null);}catch(_){rec=null;}
if(!rec){try{const raw=sessionStorage.getItem(ACCOUNT_DEVICE_SYNCED_EVENTS_KEY);rec=raw?JSON.parse(raw):null;}catch(_){rec=null;}}
if(!rec||String(rec.accountKey||"").trim().toLowerCase()!==ak)return 0;return Math.max(0,Number(rec.count||0)||0);}
function readConfirmedCloudSync(){const candidates=[];const push=(x)=>{if(x&&typeof x==="object")candidates.push(x);};try{push(readJsonLocal(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY,null));}catch(_){}
try{const raw=sessionStorage.getItem(ACCOUNT_SYNC_CONFIRMED_CLOUD_KEY);if(raw)push(JSON.parse(raw));}catch(_){}
if(!candidates.length)return null;const currentKey=accountSyncSummaryAccountKey(null);candidates.sort((a,b)=>Number(b.finishedAt||b.updatedAt||0)-Number(a.finishedAt||a.updatedAt||0)||accountSyncStatsTotal(b.cloudStats)-accountSyncStatsTotal(a.cloudStats));for(const c of candidates){const key=accountSyncSummaryAccountKey(c);if(!currentKey||!key||key===currentKey)return c;}
return null;}
function accountSyncSummaryCloudTargetStats(summary,currentLocalStats){const s=summary&&typeof summary==="object"?summary:null;const rawServer=accountSyncSummaryRawServerStats(s);const completedLocal=s&&s.afterLocal&&typeof s.afterLocal==="object"?s.afterLocal:null;const confirmed=readConfirmedCloudSync();const confirmedStats=confirmed&&confirmed.cloudStats&&typeof confirmed.cloudStats==="object"?confirmed.cloudStats:null;let bestCloud=rawServer;try{const rawAt=Number(s&&(s.server&&s.server.updatedAt||s.finishedAt||s.updatedAt)||0)||0;const confirmedAt=Number(confirmed&&(confirmed.finishedAt||confirmed.updatedAt)||0)||0;if(!bestCloud)bestCloud=confirmedStats;else if(confirmedStats&&confirmedAt>rawAt)bestCloud=confirmedStats;}catch(_){bestCloud=bestCloud||confirmedStats;}
const exact=!!(s&&s.server&&(s.server.localCloudExact===true||s.server.cloudCanonicalExact===true));if(exact&&completedLocal)bestCloud=accountSyncStatsMax(bestCloud,completedLocal);if(bestCloud)return bestCloud;if(completedLocal&&!(s&&(s.cloudDisplayOnly||s.server&&s.server.displayOnly)))return completedLocal;return null;}
function readAccountSyncSummary(){const candidates=[];const push=(s)=>{if(s&&typeof s==="object")candidates.push(enrichAccountSyncSummary(s));};try{if(window.MkAccountData&&typeof window.MkAccountData.readSyncSummary==="function")push(window.MkAccountData.readSyncSummary());}catch(_){}
try{push(readJsonLocal(ACCOUNT_DATA_SYNC_SUMMARY_KEY,null));}catch(_){}
try{push(readJsonLocal(ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY,null));}catch(_){}
try{push(readJsonLocal(ACCOUNT_SYNC_LAST_RESULT_KEY,null));}catch(_){}
if(!candidates.length){const confirmed=readConfirmedCloudSync();if(confirmed&&confirmed.cloudStats){return enrichAccountSyncSummary({ok:true,schema:"mk-account-confirmed-cloud-summary",accountKey:confirmed.accountKey||accountSyncSummaryAccountKey(null),deviceName:confirmed.deviceName||getDeviceName(),uploaded:{total:0,stores:{}},downloaded:{total:0,stores:{}},afterLocal:accountSyncLiveLocalStatsNow(),server:{after:confirmed.cloudStats,reportedAfter:confirmed.rawServer||confirmed.cloudStats,updatedAt:confirmed.updatedAt||Date.now()},updatedAt:Number(confirmed.updatedAt||confirmed.finishedAt||Date.now())||Date.now(),finishedAt:Number(confirmed.finishedAt||confirmed.updatedAt||Date.now())||Date.now()});}
return null;}
let localStats=null;try{localStats=accountSyncLiveLocalStatsNow();}catch(_){localStats=null;}
const currentAk=String(accountSyncSummaryAccountKey(null)||"").toLowerCase();const score=(summary)=>{const s=summary||{};const ts=Math.max(Number(s.finishedAt||0),Number(s.updatedAt||0));const sameAccount=!currentAk||String(s.accountKey||"").toLowerCase()===currentAk?1000000000000000:0;const exact=s&&s.server&&(s.server.localCloudExact===true||s.server.cloudCanonicalExact===true)?1000000000:0;const failedPenalty=s.ok===false?-500000000:0;const displayPenalty=(s.cloudDisplayOnly||s.server&&s.server.displayOnly)?-250000000:0;const localTotal=Math.min(999,accountSyncStatsTotal(s.afterLocal||localStats));return sameAccount+exact+failedPenalty+displayPenalty+ts+localTotal;};candidates.sort((a,b)=>score(b)-score(a));return candidates[0]||null;}
function accountSyncCachedLocalStatsNow(){const empty={total:0,stores:{}};const currentAk=String(accountSyncSummaryAccountKey(null)||"").toLowerCase();const candidates=[];const push=(stats,account)=>{if(!stats||typeof stats!=="object")return;const key=String(account||"").toLowerCase();if(currentAk&&key&&key!==currentAk)return;candidates.push(stats);};try{const s=readJsonLocal(ACCOUNT_DATA_SYNC_SUMMARY_KEY,null);if(s&&typeof s==="object")push(s.afterLocal,s.accountKey);}catch(_){}
try{const s=readJsonLocal(ACCOUNT_JSON_SYNC_LAST_SUMMARY_KEY,null);if(s&&typeof s==="object")push(s.afterLocal,s.accountKey);}catch(_){}
try{const s=readJsonLocal(ACCOUNT_SYNC_LAST_RESULT_KEY,null);if(s&&typeof s==="object")push(s.afterLocal,s.accountKey);}catch(_){}
try{const confirmed=readConfirmedCloudSync();if(confirmed&&typeof confirmed==="object")push(confirmed.afterLocal,confirmed.accountKey);}catch(_){}
if(!candidates.length)return empty;return candidates.reduce((best,x)=>accountSyncStatsMax(best,x),empty);}
function accountSyncLocalStatsNow(options){const opts=options&&typeof options==="object"?options:{};if(!opts.exact)return accountSyncCachedLocalStatsNow();try{if(window.MkAccountData&&typeof window.MkAccountData.stats==="function")return window.MkAccountData.stats({exact:true});}catch(_){}
try{return accountJsonSyncStats(localAccountJsonSnapshotPayload());}catch(_){return{total:0,stores:{}};}}
function accountSyncLiveLocalStatsNow(){const cached=accountSyncCachedLocalStatsNow();let exact=null;try{exact=accountSyncLocalStatsNow({exact:true});}catch(_){exact=null;}
return accountSyncStatsMax(exact,cached)||exact||cached||{total:0,stores:{}};}
function accountSyncCanonicalEventCount(stats,summary,side){const st=stats&&typeof stats==="object"?stats:null;const s=summary&&typeof summary==="object"?summary:null;const server=s&&s.server&&typeof s.server==="object"?s.server:null;const fp=server?(side==="cloud"?server.cloudFingerprint||server.fingerprint:(server.canonicalFingerprint||server.localFingerprint)):null;const fpCount=fp&&Number.isFinite(Number(fp.eventCount))?Math.max(0,Number(fp.eventCount)):null;let count=fpCount!=null?fpCount:Math.max(0,Number(st&&st.stores&&st.stores.eventLog||0));if(side==="local"){const liveCount=Math.max(0,Number(st&&st.stores&&st.stores.eventLog||0));if(liveCount>count)count=liveCount;const floor=lastSyncedDeviceEventCount(accountSyncSummaryAccountKey(s));if(floor>count)count=floor;try{const live=JSON.parse(localStorage.getItem("mk_account_device_new_rows_v1")||"null");const sinceSync=Math.max(0,Number(live&&live.sinceSync||0)||0);const liveKey=String(live&&live.accountKey||"").trim().toLowerCase();const summaryKey=String(accountSyncSummaryAccountKey(s)||"").trim().toLowerCase();if(sinceSync>0&&(!liveKey||!summaryKey||liveKey===summaryKey)){const frozenBase=Math.max(fpCount!=null?fpCount:0,floor);if(frozenBase>0)count=Math.max(count,frozenBase+sinceSync);}}catch(_){}}
return count;}
function shouldRenderCloudStatusSummary(fresh,current){const f=fresh&&typeof fresh==="object"?fresh:null;if(!f)return false;if(accountSyncSummaryIsExactSynced(f))return true;if(f.cloudDisplayOnly||f.server&&f.server.displayOnly){if(!accountSyncSummaryIsExactSynced(current))return true;try{const localStats=accountSyncLiveLocalStatsNow();const cloudStats=accountSyncSummaryRawServerStats(f);const localEvents=accountSyncCanonicalEventCount(localStats,f,"local");const cloudEvents=cloudStats?accountSyncCanonicalEventCount(cloudStats,f,"cloud"):0;return!!cloudStats&&localEvents!==cloudEvents;}catch(_){return false;}}
return true;}
let accountCloudStatusFetchPromise=null;async function refreshAccountCloudStatusForDisplay(){const profile=readLocalProfile();const ak=String(profile&&profile.accountKey||"").trim();if(!ak)return null;if(accountCloudStatusFetchPromise)return accountCloudStatusFetchPromise;const cachedFallback=(errorText)=>{const confirmed=readConfirmedCloudSync();if(!confirmed||!confirmed.cloudStats)return null;return enrichAccountSyncSummary({ok:true,schema:"mk-account-confirmed-cloud-summary",cloudDisplayOnly:true,staleCloudStatus:true,cloudStatusError:errorText||"Could not refresh cloud status.",accountKey:confirmed.accountKey||ak,deviceName:getDeviceName(),uploaded:{total:0,stores:{}},downloaded:{total:0,stores:{}},afterLocal:accountSyncLiveLocalStatsNow(),server:{after:confirmed.cloudStats,reportedAfter:confirmed.rawServer||confirmed.cloudStats,displayOnly:true,stale:true,updatedAt:confirmed.updatedAt||Date.now()},updatedAt:Number(confirmed.updatedAt||confirmed.finishedAt||Date.now())||Date.now(),finishedAt:0,});};accountCloudStatusFetchPromise=(async()=>{try{if(window.MkAccountData&&typeof window.MkAccountData.refreshCloudStatus==="function"){const fresh=await window.MkAccountData.refreshCloudStatus({reason:"account-panel-open",timeoutMs:30000,writeDisplaySummary:false,lightStatus:true,cloudCountOnly:true});if(fresh&&fresh.ok&&fresh.summary)return writeAccountSyncSummary(fresh.summary);if(fresh&&fresh.cachedSummary)return writeAccountSyncSummary(fresh.cachedSummary);if(fresh&&fresh.error){const cached=cachedFallback(fresh.error);if(cached)return cached;}}}catch(err){const cached=cachedFallback(err&&err.message||"Could not refresh cloud status.");if(cached)return cached;}
const url=`${API_BASE}/identity/account-file-sync?visitorId=${encodeURIComponent(getVisitorId())}&accountKey=${encodeURIComponent(ak)}&deviceName=${encodeURIComponent(getDeviceName())}&display=1&statsOnly=1&chunked=1&meta=1&countOnly=1&t=${Date.now()}`;const res=await fetchJsonWithRetry(url,{cache:"no-store",timeoutMs:60000},2).catch((err)=>({ok:false,error:err&&err.message||"Could not refresh cloud status."}));if(!res||res.ok===false)return cachedFallback(res&&res.error||"Could not refresh cloud status.");const serverAccountKey=String(res.accountKey||"").trim();if(serverAccountKey&&serverAccountKey.toLowerCase()!==ak.toLowerCase())return cachedFallback("This cloud status belongs to a different account.");const cloudStats=res.stats&&typeof res.stats==="object"?res.stats:accountEventFileStatsForDisplay(res.file&&typeof res.file==="object"?res.file:null);const localStats=accountSyncLiveLocalStatsNow();if(!accountSyncStatsTotal(cloudStats))return cachedFallback("Cloud status returned no event count.");return writeAccountSyncSummary({ok:true,schema:"mk-account-cloud-display-summary",cloudDisplayOnly:true,accountKey:ak,deviceName:getDeviceName(),uploaded:{total:0,stores:{}},downloaded:{total:0,stores:{}},afterLocal:localStats,server:{after:cloudStats,reportedAfter:res.stats||cloudStats,fingerprint:res.fingerprint||null,localCloudExact:false,updatedAt:res.updatedAt||Date.now(),seededFromCanonical:!!res.seededFromCanonical,seedSource:res.seedSource||"",displayOnly:true,statsOnly:true},updatedAt:Date.now(),finishedAt:0});})();try{return await accountCloudStatusFetchPromise;}finally{accountCloudStatusFetchPromise=null;}}
function accountSyncSummaryHtml(summary,statusText){const s=summary&&typeof summary==="object"?enrichAccountSyncSummary(summary):readAccountSyncSummary();const localStats=accountSyncLiveLocalStatsNow();const localTotal=Number(localStats&&localStats.total||0);const device=s&&s.deviceName||getDeviceName();const displayOnly=!!(s&&(s.cloudDisplayOnly||s.server&&s.server.displayOnly));const failedSummary=!!(s&&s.ok===false);const confirmedSync=readConfirmedCloudSync();const hasConfirmedSync=!!(confirmedSync&&confirmedSync.cloudStats);const confirmedFinished=(confirmedSync&&confirmedSync.finishedAt)?accountSyncDateTime(confirmedSync.finishedAt):"Never";const hasSync=!!(s&&(s.finishedAt||s.updatedAt))&&!displayOnly&&!failedSummary;const finished=hasSync?accountSyncDateTime(s.finishedAt||s.updatedAt):confirmedFinished;const rawServerAfter=accountSyncSummaryRawServerStats(s);const confirmedStats=confirmedSync&&confirmedSync.cloudStats&&typeof confirmedSync.cloudStats==="object"?confirmedSync.cloudStats:null;const exactFlag=s&&s.server&&(s.server.localCloudExact===true||s.server.cloudCanonicalExact===true);const compactVerified=!!(s&&(s.localCompactedCache||s.server&&s.server.localCompactedCache)&&s.server&&s.server.cloudCanonicalExact===true);const eventFileSummary=String(s&&s.schema||"")==="mk-account-data-sync-summary"||!!(s&&s.server&&(s.server.localFingerprint||s.server.cloudFingerprint));let serverAfter=accountSyncSummaryCloudTargetStats(s,localStats)||confirmedStats||rawServerAfter;const localEvents=accountSyncCanonicalEventCount(localStats,s,"local");let cloudEvents=serverAfter?accountSyncCanonicalEventCount(serverAfter,s,"cloud"):0;if(cloudEvents===0&&confirmedStats){const confirmedEvents=accountSyncCanonicalEventCount(confirmedStats,s,"cloud");if(confirmedEvents>0){serverAfter=confirmedStats;cloudEvents=confirmedEvents;}}
const cloudLoaded=!!serverAfter;const stagedInCloud=Math.max(0,Number(s&&s.server&&s.server.pendingAppendEvents||0)||0);if(cloudLoaded&&stagedInCloud>0)cloudEvents+=stagedInCloud;const status=String(statusText||"");const isProgress=/^\s*(Syncing|Step)\b/i.test(status);const isError=failedSummary||/^\s*Sync failed\b/i.test(status);const eventCountMismatch=cloudLoaded?localEvents!==cloudEvents:false;const missing=accountJsonStatsMissing(localStats,serverAfter);const extraLocal=accountJsonStatsExtraLocal(localStats,serverAfter);let needsMore=eventFileSummary?(exactFlag!==true||eventCountMismatch):(!!(s&&(s.partialLocalApply||s.partialCloudApply))||exactFlag===false||missing.total>0||extraLocal.total>0);let pendingLocalAfterSync=displayOnly&&cloudLoaded&&localEvents>cloudEvents;let pendingCloudAfterSync=displayOnly&&cloudLoaded&&cloudEvents>localEvents;const stagedSkewOnly=stagedInCloud>0&&cloudLoaded&&cloudEvents>localEvents&&(cloudEvents-localEvents)<=stagedInCloud;if(stagedSkewOnly)pendingCloudAfterSync=false;const displayOnlyStillAligned=displayOnly&&cloudLoaded&&localEvents===cloudEvents;if(compactVerified&&cloudLoaded&&cloudEvents>=localEvents){pendingCloudAfterSync=false;needsMore=false;}else{if(pendingLocalAfterSync||pendingCloudAfterSync)needsMore=true;if(displayOnlyStillAligned)needsMore=false;}
const failureStep=s&&(s.failureStep||s.lastProgress)&&typeof(s.failureStep||s.lastProgress)==="object"?(s.failureStep||s.lastProgress):null;const failureStepText=failureStep?` Step ${failureStep.step || "?"}/${failureStep.total || "?"}: ${failureStep.label || "syncing"}${failureStep.extra ? `,${failureStep.extra}` : ""}.`:"";const failureMain=`Sync failed.${failureStepText}`;const pendingLocalText=pendingLocalAfterSync?`${localEvents - cloudEvents} new event${localEvents - cloudEvents === 1 ? "" : "s"} pending upload`:"";const pendingCloudText=pendingCloudAfterSync?`${cloudEvents - localEvents} cloud event${cloudEvents - localEvents === 1 ? "" : "s"} waiting to download`:"";let main=status;if(!main){if(failedSummary)main=failureMain;else if(hasSync)main=needsMore?"Not fully synced":"Synced";else if(pendingLocalAfterSync)main="New activity pending sync";else if(pendingCloudAfterSync)main="Cloud has newer data";else if(displayOnlyStillAligned)main="Synced";else if(displayOnly&&cloudLoaded&&cloudEvents>localEvents)main="Cloud has newer data";else main=(localTotal||localEvents)?"Ready to sync":"No synced activity yet";}
const cloudCheckedAt=confirmedSync&&(confirmedSync.checkedAt||confirmedSync.updatedAt||confirmedSync.finishedAt)?accountSyncDateTime(confirmedSync.checkedAt||confirmedSync.updatedAt||confirmedSync.finishedAt):"";const cloudCheckNote=cloudCheckedAt?` · Cloud checked: ${cloudCheckedAt}`:"";const details=failedSummary?`${device || "This browser"} · ${s && s.error ? s.error : "The last sync did not complete."}${cloudCheckNote}`:((hasSync||hasConfirmedSync)?`${device || "This browser"} · Last sync: ${finished}${cloudCheckNote && finished !== cloudCheckedAt ? cloudCheckNote : ""}`:`${device || "This browser"}${cloudCheckNote}`);const badge=isError?"Failed":(isProgress?"Syncing":(hasSync?(needsMore?"Needs sync":"Synced"):(pendingLocalAfterSync?"Pending upload":(pendingCloudAfterSync?"Needs sync":(displayOnlyStillAligned?"Synced":"Not synced")))));const countBits=[];if(localEvents||cloudLoaded)countBits.push(`device ${localEvents || 0}`);if(cloudLoaded)countBits.push(`cloud ${cloudEvents || 0}`);if(stagedInCloud>0)countBits.push(`${stagedInCloud} received, folding into the cloud snapshot`);if(needsMore&&cloudLoaded&&!isError&&!isProgress){const diff=[];if(cloudEvents>localEvents)diff.push(pendingCloudText||`${cloudEvents - localEvents} more in cloud`);if(localEvents>cloudEvents)diff.push(pendingLocalText||`${localEvents - cloudEvents} more on this device`);if(diff.length)countBits.push(diff.join(", "));}
const meta=countBits.length?countBits.join(" · "):"Cloud status not checked yet.";const showBadge=String(badge||"").trim().toLowerCase()!==String(main||"").trim().toLowerCase();const displayMain=isProgress?"Syncing":(isError?"Sync failed":main);const displayDetails=isProgress?((hasSync||hasConfirmedSync)?`${device || "This browser"} · Last sync: ${finished}`:`${device || "This browser"}`):details;const diffLabel=compactVerified&&cloudLoaded&&cloudEvents>localEvents?"Cloud verified · compact local cache":(pendingLocalText||pendingCloudText||(stagedSkewOnly?`${cloudEvents - localEvents} folding in the cloud · reconciles on next sync`:"")||(needsMore&&cloudLoaded&&localEvents!==cloudEvents?`${Math.abs(localEvents - cloudEvents)} event${Math.abs(localEvents - cloudEvents) === 1 ? "" : "s"} different`:""));return`<div class="mk-account-sync-status-card${(hasSync || hasConfirmedSync) ? " has-sync" : " is-empty"}${needsMore && !isProgress ? " needs-sync" : ""}${isError ? " is-error" : ""}${isProgress ? " is-syncing" : ""}">
      <div class="mk-account-sync-status-layout">
        <div class="mk-account-sync-status-copy">
          <span class="mk-account-sync-eyebrow">Status</span>
          <strong>${escapeHtml(displayMain)}</strong>
          <small>${escapeHtml(displayDetails)}</small>
        </div>
        <div class="mk-account-sync-status-metrics" aria-label="Sync event counts">
          <div><span>Device</span><strong>${escapeHtml(String(localEvents || 0))}</strong></div>
          <div><span>Cloud</span><strong>${escapeHtml(String(cloudLoaded ? cloudEvents || 0 : "—"))}</strong></div>
          ${diffLabel ? `<em>${escapeHtml(diffLabel)}</em>` : ""}
        </div>
        ${showBadge ? `<span class="mk-account-sync-state-pill">${escapeHtml(badge)}</span>` : ""}
      </div>
    </div>`;}
async function syncAllAccountDataNow(opts){const options=opts&&typeof opts==="object"?opts:{};const onProgress=typeof options.onProgress==="function"?options.onProgress:null;const startedAt=Date.now();if(!window.MkAccountData||typeof window.MkAccountData.syncNow!=="function")return{ok:false,error:"The new account data engine is not loaded."};const res=await window.MkAccountData.syncNow({force:!!options.force,reason:options.reason||"sync-all-account-data",onProgress}).catch((err)=>({ok:false,error:err&&err.message||"Account sync failed"}));if(!res||res.ok===false){const failure=Object.assign({importedOk:false,accountJsonOk:false},res||{error:"Account sync failed"});failure.accountJsonSummary=failure.accountJsonSummary||failure.accountDataSummary||failure;failure.accountDataSummary=failure.accountDataSummary||failure.accountJsonSummary||failure;return failure;}
const summary=res.accountDataSummary||res.accountJsonSummary||res;const finalSummary=Object.assign({},summary||{},{updatedAt:Date.now(),finishedAt:Date.now(),elapsedMs:Date.now()-startedAt,deviceName:getDeviceName(),});writeAccountSyncSummary(finalSummary);return Object.assign({},res,{ok:true,importedOk:true,accountJsonOk:true,accountJsonSummary:finalSummary,syncedAt:finalSummary.finishedAt,elapsedMs:finalSummary.elapsedMs,});}
try{window.addEventListener("mk-account-sync-complete",(ev)=>{try{const detail=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:null;if(!detail)return;writeAccountSyncSummary(detail);maybeWriteConfirmedCloudSync(detail);}catch(_){}});}catch(_){}
function activityEventsMemoryCache(){try{const context=window[LOCAL_ACTIVITY_EVENTS_MEMORY_KEY+"_context"];if(!socialAccountContextIsCurrent(context))return null;const arr=window[LOCAL_ACTIVITY_EVENTS_MEMORY_KEY];return Array.isArray(arr)?arr.filter((x)=>x&&typeof x==="object").slice(0,ACCOUNT_SYNC_ACTIVITY_EVENT_MAX):null;}catch(_){return null;}}
function setActivityEventsMemoryCache(arr){try{window[LOCAL_ACTIVITY_EVENTS_MEMORY_KEY]=(Array.isArray(arr)?arr:[]).filter((x)=>x&&typeof x==="object").slice(0,ACCOUNT_SYNC_ACTIVITY_EVENT_MAX);window[LOCAL_ACTIVITY_EVENTS_MEMORY_KEY+"_context"]=captureSocialAccountContext();}catch(_){}}
function openActivityEventsIdb(){return new Promise((resolve,reject)=>{if(!activityEventsIdbAvailable()){reject(new Error("IndexedDB is not available"));return;}
let req=null;try{req=window.indexedDB.open(LOCAL_ACTIVITY_EVENTS_IDB_DB,1);}
catch(err){reject(err);return;}
req.onupgradeneeded=()=>{try{const db=req.result;if(!db.objectStoreNames.contains(LOCAL_ACTIVITY_EVENTS_IDB_STORE))db.createObjectStore(LOCAL_ACTIVITY_EVENTS_IDB_STORE,{keyPath:"key"});}catch(_){}};req.onerror=()=>reject(req.error||new Error("IndexedDB open failed"));req.onsuccess=()=>resolve(req.result);});}
async function readActivityEventsFromIdb(){const db=await openActivityEventsIdb();return await new Promise((resolve,reject)=>{let tx=null;try{tx=db.transaction(LOCAL_ACTIVITY_EVENTS_IDB_STORE,"readonly");}
catch(err){try{db.close();}catch(_){}reject(err);return;}
const store=tx.objectStore(LOCAL_ACTIVITY_EVENTS_IDB_STORE);const req=store.get(LOCAL_ACTIVITY_EVENTS_IDB_KEY);req.onerror=()=>{try{db.close();}catch(_){}reject(req.error||new Error("IndexedDB read failed"));};req.onsuccess=()=>{try{const row=req.result||null;const parsed=row&&row.data?JSON.parse(String(row.data||"[]")):[];resolve(Array.isArray(parsed)?parsed.filter((x)=>x&&typeof x==="object").slice(0,ACCOUNT_SYNC_ACTIVITY_EVENT_MAX):[]);}catch(_){resolve([]);}
try{db.close();}catch(_){}};});}
async function writeActivityEventsToIdbUnlocked(arr,accountContext){if(!socialAccountContextIsCurrent(accountContext))throw new Error("account_workspace_changed");const clean=(Array.isArray(arr)?arr:[]).filter((x)=>x&&typeof x==="object").slice(0,ACCOUNT_SYNC_ACTIVITY_EVENT_MAX);const row={key:LOCAL_ACTIVITY_EVENTS_IDB_KEY,data:JSON.stringify(clean),total:clean.length,cap:ACCOUNT_SYNC_ACTIVITY_EVENT_CAP_VERSION,updatedAt:Date.now()};const db=await openActivityEventsIdb();if(!socialAccountContextIsCurrent(accountContext)){try{db.close();}catch(_){}throw new Error("account_workspace_changed");}
return await new Promise((resolve,reject)=>{let tx=null;try{tx=db.transaction(LOCAL_ACTIVITY_EVENTS_IDB_STORE,"readwrite");}
catch(err){try{db.close();}catch(_){}reject(err);return;}
tx.oncomplete=()=>{try{db.close();}catch(_){}resolve(true);};tx.onerror=()=>{try{db.close();}catch(_){}reject(tx.error||new Error("IndexedDB write failed"));};tx.onabort=tx.onerror;try{tx.objectStore(LOCAL_ACTIVITY_EVENTS_IDB_STORE).put(row);}
catch(err){try{db.close();}catch(_){}reject(err);}});}
async function writeActivityEventsToIdb(arr){const accountContext=captureSocialAccountContext();const workspaces=window.MkAccountWorkspaces;if(!workspaces||typeof workspaces.withActiveWorkspace!=="function")throw new Error("Account storage is not ready.");const result=await workspaces.withActiveWorkspace(()=>writeActivityEventsToIdbUnlocked(arr,accountContext),{expectedOwner:accountContext.owner});if(!result||!result.ok)throw new Error(result&&result.error||"Activity history was not saved. Retry when the account is ready.");return result.value;}
async function ensureLocalActivityEventsHydrated(){const cached=activityEventsMemoryCache();if(cached&&cached.length)return cached;const accountContext=captureSocialAccountContext();const workspaces=window.MkAccountWorkspaces;if(!workspaces||typeof workspaces.withActiveWorkspace!=="function")return[];const result=await workspaces.withActiveWorkspace(async()=>{if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const local=readLocalActivityEvents({ignoreMemory:true});let fromIdb;try{fromIdb=await readActivityEventsFromIdb();}
catch(_){if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();setActivityEventsMemoryCache(local||[]);return local||[];}
if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const merged=mergeActivityEvents(fromIdb||[],local||[]);setActivityEventsMemoryCache(merged);if(JSON.stringify(merged)!==JSON.stringify(fromIdb||[])){try{await writeActivityEventsToIdbUnlocked(merged,accountContext);}catch(_){}}
if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();try{writeLocalActivityEvents(merged,{skipIdbMirror:true});}catch(_){}
return merged;},{expectedOwner:accountContext.owner});return result&&result.ok&&Array.isArray(result.value)?result.value:[];}
function compactActivityEventForStorage(ev){const src=ev&&typeof ev==="object"?ev:{};const details=src.details&&typeof src.details==="object"&&!Array.isArray(src.details)?src.details:{};const keepDetails={};["resultId","result_id","sessionId","session_id","conceptId","concept_id","source","historyKind"].forEach((k)=>{if(details[k]!==undefined&&details[k]!==null){const v=String(details[k]).trim();if(v&&v.length<=96)keepDetails[k]=v;}});const out={id:src.id!=null?String(src.id).slice(0,150):"",metric:String(src.metric||src.type||"").slice(0,48),count:Math.max(1,Number(src.count||1)||1),score:Number(src.score||0)||0,path:normaliseLocalConceptPathForXp(src.path||(details&&(details.path||details.conceptId))||"").slice(0,220),title:cleanPageTitleText(src.title||"").slice(0,96),createdAt:masteryTimestampValue(src.createdAt||src.created_at||src.ts||src.updatedAt)||Date.now(),};out.ts=out.createdAt;if(Object.keys(keepDetails).length)out.details=keepDetails;return out;}
function removeActivityEventChunksWithPrefix(prefix){const p=String(prefix||"");if(!p||p.indexOf(LOCAL_ACTIVITY_EVENTS_CHUNK_PREFIX)!==0)return;try{for(let i=localStorage.length-1;i>=0;i-=1){const k=String(localStorage.key(i)||"");if(k.indexOf(p)===0)localStorage.removeItem(k);}}catch(_){}}
function removeLocalActivityEventChunksExcept(keepPrefix){const keep=String(keepPrefix||"");try{for(let i=localStorage.length-1;i>=0;i-=1){const k=String(localStorage.key(i)||"");if(k.indexOf(LOCAL_ACTIVITY_EVENTS_CHUNK_PREFIX)!==0)continue;if(keep&&k.indexOf(keep)===0)continue;localStorage.removeItem(k);}}catch(_){}}
function readLocalActivityEvents(opts){const options=opts&&typeof opts==="object"?opts:{};if(!options.ignoreMemory){const cached=activityEventsMemoryCache();if(cached)return cached.slice(0,ACCOUNT_SYNC_ACTIVITY_EVENT_MAX);}
const meta=readJsonLocal(LOCAL_ACTIVITY_EVENTS_CHUNK_META_KEY,null);if(meta&&Number(meta.count||0)>0){let text="";const count=Math.min(800,Math.max(0,Number(meta.count||0)||0));const prefix=String(meta.prefix||LOCAL_ACTIVITY_EVENTS_CHUNK_PREFIX);const safePrefix=prefix.indexOf(LOCAL_ACTIVITY_EVENTS_CHUNK_PREFIX)===0?prefix:LOCAL_ACTIVITY_EVENTS_CHUNK_PREFIX;try{for(let i=0;i<count;i+=1)text+=localStorage.getItem(`${safePrefix}${i}`)||"";const parsed=JSON.parse(text||"[]");if(Array.isArray(parsed)){const arr=parsed.filter((x)=>x&&typeof x==="object").slice(0,ACCOUNT_SYNC_ACTIVITY_EVENT_MAX);setActivityEventsMemoryCache(arr);return arr;}}catch(_){}}
const arr=readJsonLocal(LOCAL_ACTIVITY_EVENTS_KEY,[]);const out=Array.isArray(arr)?arr.filter((x)=>x&&typeof x==="object").slice(0,ACCOUNT_SYNC_ACTIVITY_EVENT_MAX):[];if(out.length)setActivityEventsMemoryCache(out);return out;}
function writeLocalActivityEvents(arr,options){const accountContext=captureSocialAccountContext();if(!socialAccountContextIsCurrent(accountContext))return false;const workspaces=window.MkAccountWorkspaces;if(workspaces&&typeof workspaces.ownerForAccount==="function"&&workspaces.ownerForAccount(accountContext.accountKey)!==accountContext.owner)return false;const clean=(Array.isArray(arr)?arr:[]).slice(0,ACCOUNT_SYNC_ACTIVITY_EVENT_MAX).map(compactActivityEventForStorage);setActivityEventsMemoryCache(clean);if(!(options&&options.skipIdbMirror))writeActivityEventsToIdb(clean).catch(()=>{});const text=JSON.stringify(clean);const chunks=[];for(let i=0;i<text.length;i+=LOCAL_ACTIVITY_EVENTS_CHUNK_SIZE)chunks.push(text.slice(i,i+LOCAL_ACTIVITY_EVENTS_CHUNK_SIZE));const writeChunksAtomically=()=>{const prefix=`${LOCAL_ACTIVITY_EVENTS_CHUNK_PREFIX}${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}:`;try{for(let i=0;i<chunks.length;i+=1){if(!safeSetLocalStorageItem(`${prefix}${i}`,chunks[i],"activity-events-chunk"))throw new Error("activity chunk write failed");}
const meta={version:3,prefix,cap:ACCOUNT_SYNC_ACTIVITY_EVENT_CAP_VERSION,count:chunks.length,total:clean.length,bytes:text.length,updatedAt:Date.now(),fallback:"indexeddb"};if(!safeSetLocalStorageItem(LOCAL_ACTIVITY_EVENTS_CHUNK_META_KEY,JSON.stringify(meta),"activity-events-meta"))throw new Error("activity meta write failed");try{localStorage.removeItem(LOCAL_ACTIVITY_EVENTS_KEY);}catch(_){}
removeLocalActivityEventChunksExcept(prefix);return readLocalActivityEvents().length===clean.length;}catch(err){removeActivityEventChunksWithPrefix(prefix);throw err;}};try{if(writeChunksAtomically())return true;throw new Error("activity chunk verification failed");}catch(_){try{accountSyncClearDisposableLocalStorage("activity-events-large-write");}catch(_){}
try{if(writeChunksAtomically())return true;}catch(_){}
return false;}}
function mergeActivityEvents(localArr,cloudArr){const m=new Map();const timeOf=(x)=>Number(x&&(x.ts||x.createdAt||x.created_at)||0);const keyOf=(x)=>{const d=x&&x.details&&typeof x.details==="object"?x.details:{};const strong=String(d.resultId||d.result_id||d.sessionId||d.session_id||x.id||"").trim();if(strong)return`${String(x.metric || "")}:${String(x.path || "")}:${strong}`;return`${String(x.metric || "")}:${String(x.path || "")}:${timeOf(x)}:${String(x.title || "")}`;};for(const item of[].concat(localArr||[],cloudArr||[])){if(!item||typeof item!=="object")continue;const k=keyOf(item);if(!k||k==="::0:")continue;const rec=Object.assign({},item,{ts:timeOf(item)||Date.now()});const old=m.get(k);if(!old||timeOf(rec)>=timeOf(old))m.set(k,rec);}
return Array.from(m.values()).sort((a,b)=>timeOf(b)-timeOf(a)).slice(0,ACCOUNT_SYNC_ACTIVITY_EVENT_MAX);}
function applyCloudActivity(data,options){if(!data||!data.ok)return false;try{const visits=mergeByPathTime(getLocalVisitsForSync(),data.visits||[],{key:"path",timeKeys:["ts","lastVisited","last_visited"],max:1000});writeLocalArray(LOCAL_VISITS_KEY,visits,1000);}catch(_){}
try{const actions=mergeActions(getLocalPageActions(),data.actions||[]);writeLocalArray(LOCAL_PAGE_ACTIONS_KEY,actions,1200);}catch(_){}
try{const comments=mergeByPathTime(getLocalComments(),data.comments||[],{key:"id",timeKeys:["ts","editedAt","deletedAt"],max:300});writeLocalArray(LOCAL_COMMENTS_KEY,comments,300);}catch(_){}
try{const readiness=mergeByPathTime(getLocalReadinessList(),data.readiness||[],{key:"path",timeKeys:["updatedAt","ts"],max:2000});writeLocalArray(LOCAL_READINESS_KEY,readiness,2000);}catch(_){}
try{const events=mergeActivityEvents(readLocalActivityEvents(),data.events||[]);writeLocalActivityEvents(events,options);}catch(_){}
let quizSessionsChanged=false;try{quizSessionsChanged=mergeCloudAiQuizSessionsIntoLocal(data.quizSessions||data.aiQuizSessions||data.ai_quiz_sessions||[]);}catch(_){quizSessionsChanged=false;}
let masteryChanged=false;try{const all=readLocalMasteryMap();for(const item of data.mastery||[]){const path=String(item&&item.path||"");if(!path)continue;const rec=item.data&&typeof item.data==="object"?item.data:{};const cloudMasteryAt=Math.max(Number(item&&item.updatedAt||0),masteryUpdatedAt(rec));const cloudActivityAt=Math.max(Number(item&&item.cloudUpdatedAt||0),cloudMasteryAt,masteryActivityAt(rec));if(cloudMasteryAt&&!rec.updatedAt)rec.updatedAt=cloudMasteryAt;const old=all[path];const next=mergeMasteryRecordForLocal(old,rec,item&&(item.cloudUpdatedAt||item.updatedAt));if(JSON.stringify(all[path]||null)!==JSON.stringify(next||null)){all[path]=next;masteryChanged=true;}}
if(masteryChanged)writeLocalMasteryMap(all);}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-local-activity-change",{detail:{type:masteryChanged||quizSessionsChanged?"cloud-sync-mastery":"cloud-sync",quizSessionsChanged}}));}catch(_){}
return true;}
async function fetchCloudActivity(){return apiGet(`/identity/activity?visitorId=${encodeURIComponent(getVisitorId())}`);}
function readActivityDownloadCursor(totalEvents){try{const raw=localStorage.getItem(LOCAL_ACTIVITY_EVENTS_DOWNLOAD_CURSOR_KEY)||"";if(!raw)return null;const data=JSON.parse(raw);const total=Math.max(0,Number(totalEvents||0)||0);if(!data||typeof data!=="object")return null;if(total&&Number(data.totalEvents||0)&&Math.abs(Number(data.totalEvents||0)-total)>250)return null;const cursor=data.cursor&&typeof data.cursor==="object"?data.cursor:null;if(!cursor||!Number(cursor.ts))return null;return{cursor:{ts:Number(cursor.ts||0),id:String(cursor.id||"")},scanned:Math.max(0,Number(data.scanned||0)||0),totalEvents:Math.max(total,Number(data.totalEvents||0)||0),updatedAt:Number(data.updatedAt||0)||0};}catch(_){return null;}}
function writeActivityDownloadCursor(state){try{if(!state||!state.cursor||!Number(state.cursor.ts))return false;const payload={cursor:{ts:Number(state.cursor.ts||0),id:String(state.cursor.id||"")},scanned:Math.max(0,Number(state.scanned||0)||0),totalEvents:Math.max(0,Number(state.totalEvents||0)||0),updatedAt:Date.now()};return safeSetLocalStorageItem(LOCAL_ACTIVITY_EVENTS_DOWNLOAD_CURSOR_KEY,JSON.stringify(payload),"activity-events-download-cursor");}catch(_){return false;}}
function clearActivityDownloadCursor(){try{localStorage.removeItem(LOCAL_ACTIVITY_EVENTS_DOWNLOAD_CURSOR_KEY);}catch(_){}
try{localStorage.setItem(LOCAL_ACTIVITY_EVENTS_DOWNLOAD_DONE_KEY,JSON.stringify({at:Date.now()}));}catch(_){}}
function resetActivityDownloadCursor(){try{localStorage.removeItem(LOCAL_ACTIVITY_EVENTS_DOWNLOAD_CURSOR_KEY);}catch(_){}}
async function fetchAndApplyCloudActivityPaged(opts){const accountContext=captureSocialAccountContext();const workspaces=window.MkAccountWorkspaces;if(!workspaces||typeof workspaces.withActiveWorkspace!=="function")return{ok:false,error:"Account storage is not ready."};const commitLocal=(action)=>workspaces.withActiveWorkspace(async()=>{if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();return action();},{expectedOwner:accountContext.owner});const options=opts&&typeof opts==="object"?opts:{};const onProgress=typeof options.onProgress==="function"?options.onProgress:null;await ensureLocalActivityEventsHydrated();if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const visitorId=encodeURIComponent(getVisitorId());const startedStats=accountJsonSyncStats(localAccountJsonSnapshotPayload());let cloudStats=null;const light=await apiGet(`/identity/activity?visitorId=${visitorId}&light=1&t=${Date.now()}`);if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!light||light.ok===false)return Object.assign({ok:false,error:light&&light.error||"Could not load cloud activity."},light||{});cloudStats=light.stats||null;const totalEvents=Math.max(0,Number(options.expectedTotal||light.eventTotal||light.eventsTotal||light.totalEvents||(light.stats&&light.stats.stores&&light.stats.stores.activityEvents)||0)||0);const targetEvents=Math.min(ACCOUNT_SYNC_ACTIVITY_EVENT_MAX,totalEvents);const appliedLight=await commitLocal(()=>{applyCloudActivity(Object.assign({},light,{events:[]}),{skipIdbMirror:true});if(!targetEvents)resetActivityDownloadCursor();return true;});if(!appliedLight||!appliedLight.ok)return appliedLight||{ok:false,error:"Activity history could not be applied."};if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!targetEvents){return{ok:true,pagedActivity:true,eventTotal:totalEvents,eventReceived:0,stats:cloudStats||{total:0,stores:{activityEvents:0}},applied:{changed:false,before:startedStats,after:accountJsonSyncStats(localAccountJsonSnapshotPayload()),downloaded:{total:0,stores:{}}},localApplyMissing:{total:0,stores:{}},partialLocalApply:false};}
const stored=readActivityDownloadCursor(targetEvents);let cursor=stored&&stored.cursor?stored.cursor:null;let scanned=stored?Math.max(0,Number(stored.scanned||0)||0):0;let mergedEvents=readLocalActivityEvents();let received=0;let newUnique=0;let guard=0;let pageFailure=null;let persisted=false;const pageLimit=isMobilePowerSensitiveViewport()?100:220;const estimatedRemaining=Math.max(1,targetEvents-scanned);const maxPages=Math.max(80,Math.ceil(estimatedRemaining/pageLimit)+20);while(guard<maxPages){if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();guard+=1;const from=Math.min(scanned+1,targetEvents);const to=Math.min(scanned+pageLimit,targetEvents);if(onProgress)onProgress({phase:"download",label:`Downloading learning history ${from}-${to}/${targetEvents}`,chunkIndex:guard,chunkCount:Math.max(1,Math.ceil(targetEvents/pageLimit))});let part=null;try{part=await apiGet(`/identity/activity?visitorId=${visitorId}&eventsOnly=1&compact=1&cursor=1${activityCursorQuery(cursor)}&limit=${pageLimit}&t=${Date.now()}`);}
catch(err){pageFailure=err&&err.message||"learning_history_page_fetch_failed";break;}
if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();if(!part||part.ok===false){pageFailure=part&&part.error||"Could not load learning history page.";break;}
const events=Array.isArray(part.events)?part.events:[];if(!events.length){const cleared=await commitLocal(()=>{clearActivityDownloadCursor();return true;});if(!cleared||!cleared.ok)pageFailure=cleared&&cleared.error||"History checkpoint could not be cleared.";break;}
const beforeLen=mergedEvents.length;mergedEvents=mergeActivityEvents(mergedEvents,events);const afterLen=mergedEvents.length;if(afterLen>beforeLen)newUnique+=afterLen-beforeLen;received+=events.length;scanned+=events.length;const nextCursor=part.nextCursor&&typeof part.nextCursor==="object"?part.nextCursor:null;if(nextCursor&&Number(nextCursor.ts))cursor={ts:Number(nextCursor.ts||0),id:String(nextCursor.id||"")};else{const last=events[events.length-1]||null;cursor=last?{ts:Number(last.ts||last.createdAt||0),id:String(last.id||"")}:cursor;}
const done=part.done||scanned>=targetEvents||events.length<pageLimit;const pageSaved=await commitLocal(async()=>{await writeActivityEventsToIdbUnlocked(mergedEvents,accountContext);if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();writeLocalActivityEvents(mergedEvents,{skipIdbMirror:true});if(done)clearActivityDownloadCursor();else if(!writeActivityDownloadCursor({cursor,scanned,totalEvents:targetEvents}))return{ok:false,error:"History checkpoint could not be saved."};return true;});if(!pageSaved||!pageSaved.ok){pageFailure=pageSaved&&pageSaved.error||"Activity history could not be saved.";break;}
persisted=true;if(done)break;await new Promise((resolve)=>window.setTimeout(resolve,isMobilePowerSensitiveViewport()?45:8));}
if(!pageFailure&&guard>=maxPages&&scanned<targetEvents){pageFailure=`Learning history paused after ${scanned}/${targetEvents} cloud rows. Run sync again to continue from this point.`;}
if(!socialAccountContextIsCurrent(accountContext))return socialAccountChangedResult();const afterStats=accountJsonSyncStats(localAccountJsonSnapshotPayload());const afterEvents=Number(afterStats.stores&&afterStats.stores.activityEvents||0);const downloaded=accountJsonSyncPositiveDelta(startedStats,afterStats);if(pageFailure){return{ok:false,pagedActivity:true,partialDownload:true,eventTotal:totalEvents,eventReceived:received,eventScanned:scanned,eventUniqueAdded:newUnique,stats:cloudStats||{total:totalEvents,stores:{activityEvents:totalEvents}},applied:{changed:downloaded.total>0||newUnique>0,before:startedStats,after:afterStats,downloaded},error:`Learning history download stopped at ${afterEvents}/${targetEvents}: ${pageFailure}`};}
if(targetEvents>0&&afterEvents<=0){return{ok:false,pagedActivity:true,eventTotal:totalEvents,eventReceived:received,eventScanned:scanned,stats:cloudStats||{total:totalEvents,stores:{activityEvents:totalEvents}},applied:{changed:false,before:startedStats,after:afterStats,downloaded},error:"Learning history was downloaded but could not be written to this browser."};}
return{ok:true,pagedActivity:true,eventTotal:totalEvents,eventReceived:received,eventScanned:scanned,eventUniqueAdded:newUnique,persisted:!!persisted,partialLocalApply:targetEvents>afterEvents,localApplyMissing:targetEvents>afterEvents?{total:targetEvents-afterEvents,stores:{activityEvents:targetEvents-afterEvents}}:{total:0,stores:{}},stats:cloudStats||{total:totalEvents,stores:{activityEvents:totalEvents}},applied:{changed:downloaded.total>0||newUnique>0,before:startedStats,after:afterStats,downloaded}};}
let __cloudSyncPromise=null;let __cloudSyncQueuedForce=false;async function runCloudSync(opts){const options=opts&&typeof opts==="object"?opts:{};if(!window.MkAccountData||typeof window.MkAccountData.syncNow!=="function")return null;const profile=readLocalProfile();if(!profile||!profile.accountKey)return null;if(!options.force&&shouldSkipMobileBackgroundWork(options.reason||"cloud-sync"))return{ok:true,skipped:true,lowHeat:true,reason:options.reason||"cloud-sync"};if(pageIsHiddenForAccountSync()&&!options.force)return null;if(!options.force){const reason=options.reason||"cloud-sync";const learningReason=isLearningCloudSyncReason(reason);try{if(learningReason&&typeof window.MkAccountData.scheduleAutoSync==="function"){const scheduled=window.MkAccountData.scheduleAutoSync(reason);return{ok:true,scheduled:!!scheduled,background:true,deferred:true,reason};}}catch(_){}
return{ok:true,skipped:true,skippedFullSync:true,metadataOnly:false,reason};}
return syncAllAccountDataNow({force:true,background:false,reason:options.reason||"cloud-sync",timeoutMs:ACCOUNT_SYNC_MANUAL_TIMEOUT_MS,});}
function scheduleCloudSync(reason,opts){const delay=Number(opts&&opts.delay||0);const force=!!(opts&&opts.force);const learningReason=isLearningCloudSyncReason(reason);if(!force&&shouldSkipMobileBackgroundWork(reason||"cloud-sync-schedule"))return false;if(!force&&!learningReason)return false;const job=()=>{try{if(window.MkAccountData&&typeof window.MkAccountData.scheduleAutoSync==="function"&&!force&&learningReason){window.MkAccountData.scheduleAutoSync(reason||"scheduled");return;}}catch(_){}
runCloudSync({reason:reason||"scheduled",force}).catch(()=>{});};window.setTimeout(job,Math.max(0,delay));return true;}
function readAdminToken(){try{return localStorage.getItem(ADMIN_TOKEN_KEY)||localStorage.getItem("mk_hot_admin_token_v1")||"";}catch(_){return"";}}
function writeAdminToken(token){try{if(token)localStorage.setItem(ADMIN_TOKEN_KEY,String(token||"").trim());else localStorage.removeItem(ADMIN_TOKEN_KEY);}catch(_){}}
function promptForAdminToken(){const existing=readAdminToken();const token=window.prompt("Admin key for comment moderation:",existing||"");if(token==null)return"";const cleaned=String(token||"").trim();if(cleaned)writeAdminToken(cleaned);return cleaned;}
function maybeActivateAdminFromUrl(){if(wantsAdminModeFromUrl()&&!readAdminToken())promptForAdminToken();}
function markCommentUiBusyNoPreload(ms){const until=Date.now()+Math.max(1200,Number(ms||5000)||5000);try{window.__mkCommentNoPreloadUntil=until;}catch(_){}
try{document.documentElement.classList.add("rk-ready");document.documentElement.classList.remove("rk-preload","rk-loading");}catch(_){}
try{document.body&&document.body.classList&&document.body.classList.add("mk-comment-live-update");}catch(_){}
try{window.clearTimeout(window.__mkCommentLiveUpdateTimer||0);}catch(_){}
try{window.__mkCommentLiveUpdateTimer=window.setTimeout(()=>{try{document.body&&document.body.classList&&document.body.classList.remove("mk-comment-live-update");}catch(_){}},Math.max(800,Number(ms||5000)||5000));}catch(_){}
try{if(window.__rkRevealWhenReady)window.__rkRevealWhenReady();}catch(_){}}
async function deleteComment(commentId,opts){const options=opts&&typeof opts==="object"?opts:{};const isOwn=!!options.own;let token=readAdminToken();if(!isOwn&&!token)token=promptForAdminToken();if(!isOwn&&!token)return false;const ok=window.confirm(isOwn?"Delete your comment from this page? If it has replies, they will be hidden too.":"Delete this comment? If it has replies, they will be hidden too.");if(!ok)return false;if(typeof options.onConfirmed==="function"){try{options.onConfirmed();}catch(_){}}
markCommentUiBusyNoPreload(6000);const body={path:options.path||currentPath(),commentId,visitorId:getVisitorId()};if(!isOwn&&token)body.adminKey=token;if(isOwn&&token)body.adminKey=token;const res=await apiPost("/comments/delete",body);if(res&&res.ok){markLocalCommentDeleted(commentId);return true;}
if(res&&/unauthorized/i.test(String(res.error||""))){if(!isOwn){writeAdminToken("");window.alert("Admin key was rejected. Please enter it again.");}else{window.alert("Only comments linked to your current account or browser can be deleted here.");}}else{window.alert((res&&res.error)||"Could not delete this comment.");}
return false;}
async function deleteCommentByAdmin(commentId,path,extraOpts){return deleteComment(commentId,Object.assign({own:false,path:path||currentPath()},extraOpts||{}));}
async function deleteOwnComment(commentId,path,extraOpts){return deleteComment(commentId,Object.assign({own:true,path},extraOpts||{}));}
async function editComment(commentId,text,opts){const options=opts&&typeof opts==="object"?opts:{};const isOwn=!!options.own;let token=readAdminToken();if(!isOwn&&!token)token=promptForAdminToken();if(!isOwn&&!token)return false;const tx=String(text||"").trim();if(!tx)return false;const body={path:options.path||currentPath(),commentId,visitorId:getVisitorId(),text:tx};if(!isOwn&&token)body.adminKey=token;if(isOwn&&token)body.adminKey=token;const res=await apiPost("/comments/edit",body);if(res&&res.ok){const editedAt=Number(res.comment&&res.comment.editedAt||Date.now());updateLocalComment(commentId,{text:tx,editedAt,deleted:false});return true;}
if(res&&/unauthorized/i.test(String(res.error||""))){if(!isOwn){writeAdminToken("");window.alert("Admin key was rejected. Please enter it again.");}else{window.alert("Only comments linked to your current account or browser can be edited here.");}}else{window.alert((res&&res.error)||"Could not edit this comment.");}
return false;}
async function editCommentByAdmin(commentId,text,path){return editComment(commentId,text,{own:false,path:path||currentPath()});}
async function editOwnComment(commentId,path,text){return editComment(commentId,text,{own:true,path});}
async function reportComment(c,reload){if(!c||!c.id)return false;const recent=getLocalCommentReports().find((r)=>r&&r.commentId===c.id&&Date.now()-Number(r.ts||0)<12*60*60*1000);if(recent){window.alert("You have already reported this comment from this profile recently.");return false;}
const reasonRaw=window.prompt("Report this comment to the maintainer. Optional: briefly describe the problem.","");if(reasonRaw==null)return false;const reason=String(reasonRaw||"").trim();const res=await apiPost("/comments/report",{path:c.path||currentPath(),commentId:c.id,visitorId:getVisitorId(),reason});if(res&&res.ok){saveLocalCommentReport({reportId:res.report&&res.report.id||"",commentId:c.id,path:c.path||currentPath(),title:title(),reason,text:c.text||"",name:c.name||"",ts:Date.now(),duplicate:!!res.duplicate});window.alert(res.duplicate?"This comment has already been reported from this profile recently.":"Thanks. This comment has been reported to the maintainer.");if(typeof reload==="function")reload();return true;}
window.alert((res&&res.error)||"Could not report this comment.");return false;}
function adminFetchWithToken(view,status,token){const t=String(token||"").trim();if(!t)return Promise.resolve(null);const qs=new URLSearchParams({view:view||"comments",limit:"120",key:t});if(status)qs.set("status",status);return apiGet(`/comments/admin?${qs.toString()}`);}
function adminFetch(view,status){const token=readAdminToken()||promptForAdminToken();return adminFetchWithToken(view,status,token);}
async function requireCommentAdminData(view,status){let token=readAdminToken();if(!token)token=promptForAdminToken();if(!token)return null;const data=await adminFetchWithToken(view||"comments",status,token);if(!data||!data.ok){if(data&&/unauthorized/i.test(String(data.error||""))){writeAdminToken("");window.alert("Admin key was rejected. Returning to the previous view.");}else{window.alert((data&&data.error)?`Could not load admin data: ${data.error}`:"Could not load admin data.");}
return null;}
writeAdminToken(token);return data;}
async function setReportStatus(reportId,status,options){const token=readAdminToken()||promptForAdminToken();if(!token)return false;const opts=options&&typeof options==="object"?options:{};const res=await apiPost("/comments/report-status",{adminKey:token,reportId,status,rewardReporter:!!opts.rewardReporter});if(res&&res.ok){if(res.voucher&&res.voucher.ok)window.alert("Reporter reward voucher has been sent.");else if(opts.rewardReporter&&res.voucherSkipped&&!res.rewardedAccountKey)window.alert("Report confirmed. No reward notification was sent because the first reporter is not connected to an account.");else if(opts.rewardReporter&&(res.duplicate||res.firstAlreadyRewarded))window.alert(res.notificationSkipped?"This report was confirmed as a duplicate. No reporter notification was sent because this report is not connected to an account.":"This report was confirmed, but another reporter submitted it first. This reporter has been notified.");else if(status==="dismissed")window.alert(res.notificationSkipped?"Report ignored. No notification was sent because the reporter is not connected to an account.":"Report ignored. The reporter has been notified.");return true;}
if(res&&/unauthorized/i.test(String(res.error||""))){writeAdminToken("");window.alert("Admin key was rejected. Please enter it again.");}else{window.alert((res&&res.error)||"Could not update this report.");}
return false;}
function renderAdminComments(host,rows,refresh){host.innerHTML="";const arr=(Array.isArray(rows)?rows.slice():[]).sort((a,b)=>{const reportDelta=Number(b.reportCount||0)-Number(a.reportCount||0);if(reportDelta)return reportDelta;const deletedDelta=Number(a.deletedAt||0)-Number(b.deletedAt||0);if(deletedDelta)return deletedDelta;return Number(b.ts||0)-Number(a.ts||0);});if(!arr.length){host.appendChild(el("div","mk-local-activity-empty","No comments found."));return;}
arr.forEach((c)=>{const reportCount=Number(c.reportCount||0);const card=el("article","mk-comment-admin-view-card mk-comment-admin-comment-card"+(Number(c.deletedAt||0)?" is-deleted":"")+(reportCount?" is-flagged":""));const top=el("div","mk-comment-admin-view-top");const left=el("div","mk-comment-admin-view-main");if(reportCount)left.appendChild(el("span","mk-comment-admin-state is-open",`${reportCount} report${reportCount === 1 ? "" : "s"}`));const a=el("a","mk-local-activity-link",cleanPageTitleText(c.title||c.path||"Untitled page"));a.href=`${pageHref(c.path || "")}#comments`;left.appendChild(a);left.appendChild(adminCardMeta([c.name||"Anonymous",formatTime(c.ts),Number(c.editedAt||0)?"edited":"",Number(c.deletedAt||0)?`deleted${c.deletedBy ? " by " + c.deletedBy : ""}`:""]));top.appendChild(left);const actions=el("div","mk-comment-admin-view-actions");const jump=el("a","mk-comment-admin-action is-secondary","Open page");jump.href=`${pageHref(c.path || "")}#comments`;actions.appendChild(jump);if(!Number(c.deletedAt||0)){const edit=el("button","mk-comment-admin-action is-secondary","Edit");edit.type="button";edit.addEventListener("click",async()=>{const next=window.prompt("Edit this comment:",c.text||"");if(next==null)return;const tx=String(next||"").trim();if(!tx)return;edit.disabled=true;const done=await editCommentByAdmin(c.id,tx,c.path||currentPath());edit.disabled=false;if(done)refresh();});actions.appendChild(edit);const del=el("button","mk-comment-admin-action is-danger","Delete");del.type="button";del.addEventListener("click",async()=>{del.disabled=true;const done=await deleteCommentByAdmin(c.id,c.path||currentPath());del.disabled=false;if(done)refresh();});actions.appendChild(del);}
top.appendChild(actions);card.appendChild(top);const quote=el("div","mk-comment-admin-view-text",c.text||"");quote.setAttribute("aria-label","Comment text");card.appendChild(quote);host.appendChild(card);});}
function renderAdminReports(host,reports,refresh){host.innerHTML="";const arr=Array.isArray(reports)?reports:[];if(!arr.length){host.appendChild(el("div","mk-local-activity-empty","No reports found."));return;}
arr.forEach((r)=>{const reportStatus=String(r.status||"open").toLowerCase();const stateLabel=reportStatus==="reviewed"?"Confirmed":reportStatus==="dismissed"?"Dismissed":"Needs review";const card=el("article",`mk-comment-admin-view-card mk-comment-admin-report-card is-${reportStatus}`+(Number(r.commentDeletedAt||0)?" is-deleted":""));const top=el("div","mk-comment-admin-view-top");const left=el("div","mk-comment-admin-view-main");left.appendChild(el("span",`mk-comment-admin-state is-${reportStatus}`,stateLabel));const a=el("a","mk-local-activity-link",cleanPageTitleText(r.title||r.path||"Untitled page"));a.href=`${pageHref(r.path || "")}#comments`;left.appendChild(a);left.appendChild(adminCardMeta([formatTime(r.createdAt),r.commentDeletedAt?"comment deleted":"",r.commentEditedAt?"comment edited":""]));top.appendChild(left);const actions=el("div","mk-comment-admin-view-actions");const jump=el("a","mk-comment-admin-action is-secondary","Open comment");jump.href=`${pageHref(r.path || "")}#comments`;actions.appendChild(jump);if(reportStatus==="open"){const reward=el("button","mk-comment-admin-action is-primary","Confirm + reward");reward.type="button";reward.title="Confirm the report and reward the first connected reporter.";reward.addEventListener("click",async()=>{reward.disabled=true;if(await setReportStatus(r.id,"reviewed",{rewardReporter:true}))refresh();else reward.disabled=false;});actions.appendChild(reward);}
if(!Number(r.commentDeletedAt||0)){const del=el("button","mk-comment-admin-action is-danger","Delete comment");del.type="button";del.addEventListener("click",async()=>{del.disabled=true;const done=await deleteCommentByAdmin(r.commentId,r.path||currentPath());del.disabled=false;if(done)refresh();});actions.appendChild(del);}
if(reportStatus==="open"){const ignore=el("button","mk-comment-admin-action is-quiet","Dismiss");ignore.type="button";ignore.title="Dismiss this report and notify the reporter.";ignore.addEventListener("click",async()=>{ignore.disabled=true;if(await setReportStatus(r.id,"dismissed"))refresh();else ignore.disabled=false;});actions.appendChild(ignore);}else{const reopen=el("button","mk-comment-admin-action is-quiet","Reopen");reopen.type="button";reopen.addEventListener("click",async()=>{reopen.disabled=true;if(await setReportStatus(r.id,"open"))refresh();else reopen.disabled=false;});actions.appendChild(reopen);}
top.appendChild(actions);card.appendChild(top);const people=el("div","mk-comment-admin-people");people.appendChild(el("div","",`Reporter: ${r.reporterName || "Anonymous"}`));people.appendChild(el("div","",`Comment author: ${r.currentName || r.snapshotName || "Anonymous"}`));card.appendChild(people);if(r.reason){const reason=el("div","mk-comment-admin-view-reason");reason.appendChild(el("strong","","Report note"));reason.appendChild(el("span","",r.reason));card.appendChild(reason);}
const quoteLabel=el("div","mk-comment-admin-view-meta","Reported content");card.appendChild(quoteLabel);const quote=el("div","mk-comment-admin-view-text",r.snapshotText||r.currentText||"");quote.setAttribute("aria-label","Reported comment text");card.appendChild(quote);host.appendChild(card);});}
async function openCommentsAdmin(initialView){ensureStylesOnce();const initial=initialView==="reports"?"reports":"comments";let reportStatus=initial==="reports"?"open":"";const firstData=await requireCommentAdminData(initial,reportStatus);if(!firstData)return false;const existing=document.querySelector(".mk-comment-admin-view-modal");if(existing)existing.remove();const modal=document.createElement("div");modal.className="mk-comment-admin-view-modal";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.innerHTML=`
      <div class="mk-comment-admin-view-panel" role="document">
        <div class="mk-comment-admin-view-head">
          <div>
            <div class="mk-comment-admin-view-kicker">Moderation workspace</div>
            <div class="mk-comment-admin-view-title">Comment admin</div>
            <div class="mk-comment-admin-view-sub">Review reports, inspect context and take action without losing your current queue.</div>
          </div>
          <button type="button" class="mk-comment-admin-view-close mk-comment-icon-btn" ${iconButtonAttrs("Close")}>${iconButtonHtml("x", "Close")}</button>
        </div>
        <div class="mk-comment-admin-view-toolbar">
          <div class="mk-comment-admin-view-nav" role="tablist" aria-label="Comment moderation views">
            <button type="button" class="mk-comment-admin-view-tab" role="tab" data-view="reports">${iconButtonHtml("report", "Reports")}<span>Reports</span></button>
            <button type="button" class="mk-comment-admin-view-tab" role="tab" data-view="comments">${iconButtonHtml("comments", "All comments")}<span>All comments</span></button>
          </div>
          <div class="mk-comment-admin-view-tools">
            <label class="mk-comment-admin-search"><span class="mk-comment-sr">Search current view</span><input type="search" placeholder="Search current view" autocomplete="off"></label>
            <button type="button" class="mk-comment-admin-tool" data-action="refresh">${iconButtonHtml("refresh", "Refresh")}<span>Refresh</span></button>
            <button type="button" class="mk-comment-admin-tool" data-action="clear-key">${iconButtonHtml("key", "Clear admin key")}<span>Clear key</span></button>
          </div>
        </div>
        <div class="mk-comment-admin-view-filters" aria-label="Report status filters" hidden>
          <button type="button" data-report-status="open">Needs review</button>
          <button type="button" data-report-status="">All reports</button>
          <button type="button" data-report-status="reviewed">Confirmed</button>
          <button type="button" data-report-status="dismissed">Dismissed</button>
        </div>
        <div class="mk-comment-admin-view-status">Loading…</div>
        <div class="mk-comment-admin-view-body" aria-live="polite"></div>
      </div>`;document.body.appendChild(modal);const body=modal.querySelector(".mk-comment-admin-view-body");const status=modal.querySelector(".mk-comment-admin-view-status");const filterBar=modal.querySelector(".mk-comment-admin-view-filters");const filterButtons=Array.from(filterBar.querySelectorAll("button[data-report-status]"));const searchInput=modal.querySelector(".mk-comment-admin-search input");const tabs=Array.from(modal.querySelectorAll(".mk-comment-admin-view-tab"));let view=initial;let currentData=firstData;let requestSequence=0;let onKey=null;const close=()=>{try{if(onKey)document.removeEventListener("keydown",onKey,true);}catch(_){}try{modal.remove();}catch(_){}try{if(!document.querySelector(".mk-local-activity-modal")){document.documentElement.classList.remove("mk-local-activity-open");document.body.classList.remove("mk-local-activity-open");unlockPageBehindModal();mkLocalUnbindViewportMetrics();}}catch(_){}};const matchesSearch=(row,query)=>{if(!query)return true;const haystack=view==="reports"?[row.title,row.path,row.reason,row.reporterName,row.snapshotName,row.currentName,row.snapshotText,row.currentText,row.status]:[row.title,row.path,row.name,row.text,row.deletedBy];return haystack.some((value)=>String(value||"").toLowerCase().includes(query));};const renderLoaded=(data)=>{tabs.forEach((b)=>{const active=b.dataset.view===view;b.classList.toggle("is-active",active);b.setAttribute("aria-selected",active?"true":"false");});filterBar.hidden=view!=="reports";filterButtons.forEach((b)=>{const active=b.dataset.reportStatus===reportStatus;b.classList.toggle("is-active",active);b.setAttribute("aria-pressed",active?"true":"false");});body.innerHTML="";body.setAttribute("aria-busy","false");const query=String(searchInput.value||"").trim().toLowerCase();if(view==="reports"){const allRows=data.reports||[];const rows=allRows.filter((row)=>matchesSearch(row,query));const queueLabel=reportStatus==="open"?"needs review":reportStatus==="reviewed"?"confirmed":reportStatus==="dismissed"?"dismissed":"in report history";status.innerHTML=`<strong>${rows.length}</strong> ${rows.length === 1 ? "report" : "reports"} ${queueLabel}${query ? `· filtered from ${allRows.length}` : ""}${typeof data.total === "number" ? `· ${data.total}total` : ""}`;renderAdminReports(body,rows,refresh);}else{const allRows=data.comments||[];const rows=allRows.filter((row)=>matchesSearch(row,query));const flagged=rows.filter((row)=>Number(row.reportCount||0)>0).length;status.innerHTML=`<strong>${rows.length}</strong> ${rows.length === 1 ? "comment" : "comments"}${flagged ? `·<strong>${flagged}</strong>flagged` : ""}${query ? `· filtered from ${allRows.length}` : ""}${typeof data.total === "number" ? `· ${data.total}total` : ""}`;renderAdminComments(body,rows,refresh);}};const refresh=async()=>{const requestedView=view;const requestedStatus=view==="reports"?reportStatus:"";const requestId=++requestSequence;tabs.forEach((b)=>b.classList.toggle("is-active",b.dataset.view===requestedView));status.textContent="Loading moderation data…";body.innerHTML="";body.setAttribute("aria-busy","true");const data=await adminFetch(requestedView,requestedStatus);if(requestId!==requestSequence||requestedView!==view||requestedStatus!==(view==="reports"?reportStatus:""))return;if(!data||!data.ok){body.setAttribute("aria-busy","false");if(data&&/unauthorized/i.test(String(data.error||""))){writeAdminToken("");window.alert("Admin key was rejected. Returning to the previous view.");close();return;}
status.textContent=(data&&data.error)?`Could not load: ${data.error}`:"Could not load admin data.";return;}
currentData=data;renderLoaded(data);};tabs.forEach((b)=>b.addEventListener("click",async()=>{const nextView=b.dataset.view||"comments";if(nextView===view)return;view=nextView;if(view==="reports"&&!reportStatus)reportStatus="open";await refresh();}));filterButtons.forEach((button)=>button.addEventListener("click",async()=>{const nextStatus=button.dataset.reportStatus||"";if(view!=="reports"||nextStatus===reportStatus)return;reportStatus=nextStatus;await refresh();}));searchInput.addEventListener("input",()=>renderLoaded(currentData));modal.addEventListener("click",(ev)=>{if(ev.target===modal){close();return;}
const btn=ev.target&&ev.target.closest?ev.target.closest("button[data-action]"):null;if(!btn)return;const action=btn.getAttribute("data-action")||"";if(action==="refresh")refresh();if(action==="clear-key"){writeAdminToken("");close();}});modal.querySelector(".mk-comment-admin-view-close").addEventListener("click",close);onKey=(ev)=>{if(!ev.isComposing&&ev.keyCode!==229&&ev.key==="Escape")close();};document.addEventListener("keydown",onKey,true);renderLoaded(currentData);return true;}
function ensureStylesOnce(){const id="mk-engagement-comments-style-v7-clean-profile-assets";if(document.getElementById(id))return;try{["mk-engagement-comments-style-v2","mk-engagement-comments-style-v3","mk-engagement-comments-style-v4-profile-cascade","mk-engagement-comments-style-v5-profile-assets","mk-engagement-comments-style-v6-flame-split"].forEach((oldId)=>{const old=document.getElementById(oldId);if(old&&old.parentNode)old.parentNode.removeChild(old);});}catch(_){}
const st=document.createElement("style");st.id=id;st.textContent=`
.mk-fav-h1-btn{
  appearance:none; box-sizing:border-box; width:40px; height:40px; min-width:40px; min-height:40px;
  border-radius:12px; border:1px solid var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 18%, transparent));
  background:var(--mk-theme-comment-card-bg, color-mix(in srgb, var(--md-default-bg-color) 92%, var(--md-primary-fg-color) 8%));
  color:var(--md-default-fg-color); display:inline-flex; align-items:center; justify-content:center;
  padding:0; margin:0; cursor:pointer; line-height:1; vertical-align:middle; opacity:.92;
  box-shadow:var(--mk-theme-surface-shadow, none);
}
.mk-fav-h1-btn:hover{ border-color:color-mix(in srgb, var(--md-accent-fg-color) 42%, var(--mk-theme-comment-border, transparent)); background:var(--mk-theme-comment-field-bg, color-mix(in srgb, var(--md-default-bg-color) 88%, var(--md-accent-fg-color) 12%)); opacity:1; }
.mk-fav-h1-btn.is-favorited{ color:#d97706; border-color:var(--mk-theme-comment-border, rgba(217,119,6,.45)); background:var(--mk-theme-comment-card-bg, rgba(217,119,6,.10)); }
.mk-fav-h1-btn svg{ width:21px; height:21px; display:block; fill:none !important; stroke:currentColor !important; stroke-width:2; color:currentColor !important; filter:none !important; opacity:1 !important; }
.mk-fav-h1-btn svg *{ color:currentColor !important; stroke:currentColor !important; filter:none !important; opacity:1 !important; }
.mk-fav-h1-btn svg [fill="none"]{ fill:none !important; }
.mk-fav-h1-btn svg [fill]:not([fill="none"]){ fill:currentColor !important; }
html[data-md-color-scheme="slate"] .mk-fav-h1-btn,
body[data-md-color-scheme="slate"] .mk-fav-h1-btn{
  color:rgba(255,255,255,.96) !important;
}
html[data-md-color-scheme="slate"] .mk-fav-h1-btn svg,
body[data-md-color-scheme="slate"] .mk-fav-h1-btn svg,
[data-md-color-scheme="slate"] .mk-fav-h1-btn svg,
html[data-md-color-scheme="slate"] .mk-fav-h1-btn svg *,
body[data-md-color-scheme="slate"] .mk-fav-h1-btn svg *,
[data-md-color-scheme="slate"] .mk-fav-h1-btn svg *{
  color:rgba(255,255,255,.96) !important;
  stroke:currentColor !important;
  filter:none !important;
  opacity:1 !important;
}
html[data-md-color-scheme="slate"] .mk-fav-h1-btn svg [fill="none"],
body[data-md-color-scheme="slate"] .mk-fav-h1-btn svg [fill="none"],
[data-md-color-scheme="slate"] .mk-fav-h1-btn svg [fill="none"]{
  fill:none !important;
}
.mk-fav-h1-btn.is-favorited svg{ fill:none; }
.mk-page-comments{ margin-top:3.2rem; padding-top:1.2rem; border-top:1px solid color-mix(in srgb, var(--md-default-fg-color) 13%, transparent); }
.mk-comments-head{ display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:.65rem; }
.mk-comments-head .mk-comment-actions{ margin-top:0; justify-content:flex-end; }
.mk-comment-leave-row{ display:flex; justify-content:center; align-items:center; margin:.35rem 0 .95rem; }
.mk-comments-head h2{ margin:0 !important; }
.mk-comment-primary-btn,.mk-comment-small-btn,.mk-comment-reaction{ appearance:none; border:1px solid color-mix(in srgb, var(--md-default-fg-color) 16%, transparent); background:color-mix(in srgb, var(--md-default-fg-color) 5%, transparent); color:var(--md-default-fg-color); border-radius:999px; cursor:pointer; font:inherit; }
.mk-comment-icon-btn{ display:inline-flex !important; align-items:center !important; justify-content:center !important; width:2.05rem !important; min-width:2.05rem !important; height:2.05rem !important; padding:0 !important; line-height:1 !important; position:relative; overflow:visible; gap:0 !important; }
.mk-comment-primary-btn.mk-comment-icon-btn{ width:2.25rem !important; min-width:2.25rem !important; height:2.25rem !important; }
.mk-comment-admin-view-tab.mk-comment-icon-btn,.mk-local-activity-tab.mk-comment-icon-btn{ width:2.15rem !important; min-width:2.15rem !important; height:2.15rem !important; padding:0 !important; }
.mk-comment-admin-view-close.mk-comment-icon-btn,.mk-local-activity-close.mk-comment-icon-btn{ display:inline-flex !important; align-items:center !important; justify-content:center !important; padding:0 !important; font-size:0 !important; }
.mk-comment-icon-btn svg{ width:1rem; height:1rem; display:block; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; pointer-events:none; }
.mk-comment-primary-btn.mk-comment-icon-btn svg{ width:1.05rem; height:1.05rem; }
html[data-md-color-scheme="slate"] .mk-page-comments .mk-comment-icon-btn,
body[data-md-color-scheme="slate"] .mk-page-comments .mk-comment-icon-btn,
[data-md-color-scheme="slate"] .mk-page-comments .mk-comment-icon-btn{
  color:rgba(255,255,255,.96) !important;
}
html[data-md-color-scheme="slate"] .mk-page-comments .mk-comment-icon-btn svg,
body[data-md-color-scheme="slate"] .mk-page-comments .mk-comment-icon-btn svg,
[data-md-color-scheme="slate"] .mk-page-comments .mk-comment-icon-btn svg,
html[data-md-color-scheme="slate"] .mk-page-comments .mk-comment-icon-btn svg *,
body[data-md-color-scheme="slate"] .mk-page-comments .mk-comment-icon-btn svg *,
[data-md-color-scheme="slate"] .mk-page-comments .mk-comment-icon-btn svg *{
  color:rgba(255,255,255,.96) !important;
  stroke:currentColor !important;
  fill:none !important;
  opacity:1 !important;
  filter:none !important;
}
.mk-comment-sr{ position:absolute !important; width:1px !important; height:1px !important; padding:0 !important; margin:-1px !important; overflow:hidden !important; clip:rect(0,0,0,0) !important; white-space:nowrap !important; border:0 !important; }
@media (hover:hover) and (pointer:fine){
  .mk-comment-icon-btn[data-tip]::after,
  .mk-fav-h1-btn[data-tip]::after{
    content:attr(data-tip);
    position:absolute;
    left:50%;
    bottom:calc(100% + 7px);
    transform:translateX(-50%) translateY(2px);
    z-index:2147483600;
    max-width:13rem;
    padding:4px 7px;
    border-radius:8px;
    background:color-mix(in srgb, var(--md-default-fg-color) 92%, transparent);
    color:var(--md-default-bg-color);
    font-size:.60rem;
    font-weight:650;
    line-height:1.15;
    white-space:nowrap;
    pointer-events:none;
    opacity:0;
    visibility:hidden;
    transition:opacity .10s ease, transform .10s ease, visibility .10s ease;
    box-shadow:0 8px 20px rgba(0,0,0,.16);
  }
  .mk-comment-icon-btn[data-tip]::before,
  .mk-fav-h1-btn[data-tip]::before{
    content:"";
    position:absolute;
    left:50%;
    bottom:calc(100% + 3px);
    transform:translateX(-50%);
    border:4px solid transparent;
    border-top-color:color-mix(in srgb, var(--md-default-fg-color) 92%, transparent);
    opacity:0;
    visibility:hidden;
    pointer-events:none;
    transition:opacity .10s ease, visibility .10s ease;
    z-index:2147483600;
  }
  .mk-comment-icon-btn[data-tip]:hover::after,
  .mk-comment-icon-btn[data-tip]:focus-visible::after,
  .mk-fav-h1-btn[data-tip]:hover::after,
  .mk-fav-h1-btn[data-tip]:focus-visible::after{
    opacity:1;
    visibility:visible;
    transform:translateX(-50%) translateY(0);
  }
  .mk-comment-icon-btn[data-tip]:hover::before,
  .mk-comment-icon-btn[data-tip]:focus-visible::before,
  .mk-fav-h1-btn[data-tip]:hover::before,
  .mk-fav-h1-btn[data-tip]:focus-visible::before{
    opacity:1;
    visibility:visible;
  }
}
  .mk-local-activity-modal .mk-comment-icon-btn[data-tip]::after,
  .mk-local-mini-modal .mk-comment-icon-btn[data-tip]::after{
    bottom:auto;
    top:calc(100% + 7px);
    max-width:9.5rem;
    white-space:normal;
    text-align:center;
  }
  .mk-local-activity-modal .mk-comment-icon-btn[data-tip]::before,
  .mk-local-mini-modal .mk-comment-icon-btn[data-tip]::before{
    bottom:auto;
    top:calc(100% + 3px);
    border-top-color:transparent;
    border-bottom-color:color-mix(in srgb, var(--md-default-fg-color) 92%, transparent);
  }
  .mk-local-activity-modal .mk-comment-icon-btn.mk-tip-right[data-tip]::after,
  .mk-local-mini-modal .mk-comment-icon-btn.mk-tip-right[data-tip]::after{ left:auto; right:0; transform:translateY(2px); }
  .mk-local-activity-modal .mk-comment-icon-btn.mk-tip-right[data-tip]:hover::after,
  .mk-local-activity-modal .mk-comment-icon-btn.mk-tip-right[data-tip]:focus-visible::after,
  .mk-local-mini-modal .mk-comment-icon-btn.mk-tip-right[data-tip]:hover::after,
  .mk-local-mini-modal .mk-comment-icon-btn.mk-tip-right[data-tip]:focus-visible::after{ transform:translateY(0); }
  .mk-local-activity-modal .mk-comment-icon-btn.mk-tip-right[data-tip]::before,
  .mk-local-mini-modal .mk-comment-icon-btn.mk-tip-right[data-tip]::before{ left:auto; right:13px; transform:none; }
  .mk-local-activity-modal .mk-comment-icon-btn.mk-tip-left[data-tip]::after,
  .mk-local-mini-modal .mk-comment-icon-btn.mk-tip-left[data-tip]::after{ left:0; right:auto; transform:translateY(2px); }
  .mk-local-activity-modal .mk-comment-icon-btn.mk-tip-left[data-tip]:hover::after,
  .mk-local-activity-modal .mk-comment-icon-btn.mk-tip-left[data-tip]:focus-visible::after,
  .mk-local-mini-modal .mk-comment-icon-btn.mk-tip-left[data-tip]:hover::after,
  .mk-local-mini-modal .mk-comment-icon-btn.mk-tip-left[data-tip]:focus-visible::after{ transform:translateY(0); }
  .mk-local-activity-modal .mk-comment-icon-btn.mk-tip-left[data-tip]::before,
  .mk-local-mini-modal .mk-comment-icon-btn.mk-tip-left[data-tip]::before{ left:13px; right:auto; transform:none; }

.mk-comment-primary-btn{ padding:.45rem .8rem; font-weight:650; }
.mk-comment-small-btn{ padding:.28rem .58rem; font-size:.78rem; }
.mk-comment-reaction{ padding:.18rem .42rem; font-size:.75rem; }
.mk-comment-primary-btn:hover,.mk-comment-small-btn:hover,.mk-comment-reaction:hover{ background:color-mix(in srgb, var(--md-default-fg-color) 5%, transparent) !important; border-color:color-mix(in srgb, var(--md-default-fg-color) 16%, transparent) !important; box-shadow:none !important; transform:none !important; }
.mk-comment-icon-btn:hover,.mk-comment-icon-btn:focus-visible{ background:color-mix(in srgb, var(--md-default-fg-color) 5%, transparent) !important; border-color:color-mix(in srgb, var(--md-default-fg-color) 16%, transparent) !important; box-shadow:none !important; transform:none !important; }
.mk-comment-reaction.is-owner-view{ cursor:pointer; }
.mk-comment-danger-btn{ color:#b91c1c; border-color:rgba(185,28,28,.25); }
.mk-comment-danger-btn:hover{ background:color-mix(in srgb, var(--md-default-fg-color) 5%, transparent) !important; color:#b91c1c !important; border-color:rgba(185,28,28,.25) !important; }
.mk-comment-admin-btn{ opacity:.82; }
.mk-comment-admin-btn.is-on{ border-color:rgba(22,163,74,.35); background:rgba(34,197,94,.10); opacity:1; }
.mk-comment-owner-btn{ color:#9f5800; border-color:rgba(217,119,6,.28); }
.mk-comment-owner-btn:hover{ background:color-mix(in srgb, var(--md-default-fg-color) 5%, transparent) !important; color:#9f5800 !important; border-color:rgba(217,119,6,.28) !important; }
.mk-comment-report-btn{ color:#7c3aed; border-color:rgba(124,58,237,.26); }
.mk-comment-report-btn:hover{ background:color-mix(in srgb, var(--md-default-fg-color) 5%, transparent) !important; color:#7c3aed !important; border-color:rgba(124,58,237,.26) !important; }

/* Body-level tooltips prevent clipping at modal edges. */
.mk-comment-icon-btn[data-tip]::after,
.mk-fav-h1-btn[data-tip]::after,
.mk-comment-icon-btn[data-tip]::before,
.mk-fav-h1-btn[data-tip]::before{ display:none !important; content:none !important; }
.mk-floating-tip{ position:fixed; z-index:2147483600; max-width:min(260px, calc(100vw - 24px)); padding:5px 8px; border-radius:8px; background:rgba(20,20,24,.92); color:#fff; font-size:.64rem; font-weight:650; line-height:1.15; pointer-events:none; opacity:0; transform:translateY(2px); transition:opacity .08s ease, transform .08s ease; box-shadow:0 8px 22px rgba(0,0,0,.20); white-space:normal; text-align:center; }
.mk-floating-tip.is-visible{ opacity:1; transform:translateY(0); }
.mk-notif-badge{ position:absolute; right:-3px; top:-3px; min-width:16px; height:16px; padding:0 4px; border-radius:999px; background:#e11d48; color:#fff; border:2px solid var(--md-default-bg-color); font-size:10px; font-weight:800; line-height:12px; display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; }
.mk-notif-badge[hidden],.mk-notif-badge.is-empty{ display:none !important; }
.mk-local-activity-tab{ position:relative; }
.mk-local-activity-tab .mk-notif-badge{ right:1px; top:1px; }

.mk-reaction-view-modal{ position:fixed; inset:0; z-index:2147483240; display:flex; align-items:center; justify-content:center; padding:18px; background:rgba(12,16,24,.42); -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px); box-sizing:border-box; }
.mk-reaction-view-panel{ width:min(420px,100%); max-height:calc(100vh - 36px); overflow:hidden; display:flex; flex-direction:column; border-radius:20px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 14%,transparent); background:var(--md-default-bg-color); color:var(--md-default-fg-color); box-shadow:0 20px 60px rgba(0,0,0,.24); }
.mk-reaction-view-head{ display:flex; justify-content:space-between; align-items:flex-start; gap:12px; padding:15px 16px 10px; border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); }
.mk-reaction-view-title{ font-weight:800; font-size:.92rem; line-height:1.2; }
.mk-reaction-view-sub{ margin-top:3px; font-size:.70rem; opacity:.66; line-height:1.35; }
.mk-reaction-view-close{ width:32px !important; min-width:32px !important; height:32px !important; }
.mk-reaction-view-body{ padding:12px 16px 16px; overflow:auto; display:grid; gap:8px; }
.mk-reaction-user{ display:flex; align-items:center; gap:9px; min-height:34px; font-size:.78rem; }
.mk-reaction-user .mk-comment-avatar{ width:1.65rem; height:1.65rem; min-width:1.65rem; font-size:.68rem; }
.mk-reaction-user-name{ font-weight:650; }
.mk-reaction-empty{ font-size:.78rem; opacity:.68; line-height:1.4; padding:4px 0; }
.mk-comment-admin-view-modal{ position:fixed; inset:0; z-index:2147483250; display:flex; align-items:center; justify-content:center; padding:14px; background:rgba(12,16,24,.50); -webkit-backdrop-filter:blur(9px); backdrop-filter:blur(9px); box-sizing:border-box; }
.mk-comment-admin-view-panel{ width:min(1040px,100%); max-height:calc(100dvh - 28px); overflow:hidden; display:flex; flex-direction:column; border-radius:18px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 14%,transparent); background:var(--md-default-bg-color); color:var(--md-default-fg-color); box-shadow:0 24px 72px rgba(0,0,0,.28); }
.mk-comment-admin-view-head{ display:flex; justify-content:space-between; align-items:flex-start; gap:14px; padding:13px 16px 11px; border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); background:color-mix(in srgb,var(--md-default-bg-color) 96%,var(--md-primary-fg-color) 4%); }
.mk-comment-admin-view-kicker{ margin-bottom:2px; color:var(--md-accent-fg-color); font-size:.54rem; font-weight:850; letter-spacing:.10em; line-height:1.2; text-transform:uppercase; }
.mk-comment-admin-view-title{ font-weight:850; font-size:1.02rem; line-height:1.15; }
.mk-comment-admin-view-sub{ margin-top:3px; max-width:680px; font-size:.66rem; opacity:.66; line-height:1.35; }
.mk-comment-admin-view-close{ width:30px !important; min-width:30px !important; height:30px !important; border-radius:9px !important; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 14%,transparent) !important; background:transparent !important; color:inherit; cursor:pointer; }
.mk-comment-admin-view-toolbar{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:9px 16px; border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 9%,transparent); }
.mk-comment-admin-view-nav,.mk-comment-admin-view-tools{ display:flex; align-items:center; gap:6px; min-width:0; }
.mk-comment-admin-view-tab,.mk-comment-admin-tool{ appearance:none; display:inline-flex; align-items:center; justify-content:center; gap:6px; min-height:32px; box-sizing:border-box; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 13%,transparent); background:transparent; color:inherit; border-radius:9px; padding:5px 9px; cursor:pointer; font:inherit; font-size:.66rem; font-weight:700; white-space:nowrap; }
.mk-comment-admin-view-tab svg,.mk-comment-admin-tool svg{ width:15px !important; height:15px !important; flex:0 0 auto; }
.mk-comment-admin-view-tab:hover,.mk-comment-admin-tool:hover{ background:color-mix(in srgb,var(--md-default-fg-color) 5%,transparent); }
.mk-comment-admin-view-tab.is-active{ color:var(--md-accent-fg-color); border-color:color-mix(in srgb,var(--md-accent-fg-color) 42%,transparent); background:color-mix(in srgb,var(--md-accent-fg-color) 10%,transparent); box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--md-accent-fg-color) 8%,transparent); }
.mk-comment-admin-search input{ width:min(210px,24vw); height:32px; box-sizing:border-box; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 13%,transparent); border-radius:9px; padding:5px 9px; background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); color:inherit; font:inherit; font-size:.66rem; outline:none; }
.mk-comment-admin-search input:focus{ border-color:color-mix(in srgb,var(--md-accent-fg-color) 55%,transparent); box-shadow:0 0 0 3px color-mix(in srgb,var(--md-accent-fg-color) 11%,transparent); }
.mk-comment-admin-view-filters{ display:flex; align-items:center; gap:5px; padding:7px 16px 0; overflow-x:auto; }
.mk-comment-admin-view-filters[hidden]{ display:none !important; }
.mk-comment-admin-view-filters button{ appearance:none; flex:0 0 auto; border:0; border-radius:7px; padding:5px 8px; background:transparent; color:inherit; cursor:pointer; font:inherit; font-size:.61rem; font-weight:680; opacity:.62; }
.mk-comment-admin-view-filters button:hover{ opacity:1; background:color-mix(in srgb,var(--md-default-fg-color) 5%,transparent); }
.mk-comment-admin-view-filters button.is-active{ opacity:1; color:var(--md-accent-fg-color); background:color-mix(in srgb,var(--md-accent-fg-color) 10%,transparent); }
.mk-comment-admin-view-status{ margin:8px 16px 0; padding:7px 10px; border-radius:9px; background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); font-size:.65rem; line-height:1.3; opacity:.82; }
.mk-comment-admin-view-status strong{ font-weight:850; }
.mk-comment-admin-view-body{ min-height:0; padding:9px 16px 16px; overflow:auto; display:grid; gap:8px; overscroll-behavior:contain; }
.mk-comment-admin-view-card{ position:relative; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 11%,transparent); border-radius:11px; padding:9px 10px; display:grid; gap:7px; background:color-mix(in srgb,var(--md-default-fg-color) 2.5%,transparent); }
.mk-comment-admin-report-card.is-open,.mk-comment-admin-comment-card.is-flagged{ border-left:3px solid #f59e0b; }
.mk-comment-admin-report-card.is-reviewed{ border-left:3px solid #22c55e; }
.mk-comment-admin-report-card.is-dismissed{ border-left:3px solid color-mix(in srgb,var(--md-default-fg-color) 28%,transparent); }
.mk-comment-admin-view-card.is-deleted{ opacity:.66; }
.mk-comment-admin-view-top{ display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; align-items:start; }
.mk-comment-admin-view-main{ min-width:0; display:grid; grid-template-columns:auto minmax(0,1fr); align-items:center; gap:4px 7px; }
.mk-comment-admin-view-main > .mk-local-activity-link{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:.72rem; font-weight:760; }
.mk-comment-admin-view-main > .mk-comment-admin-view-meta{ grid-column:1 / -1; }
.mk-comment-admin-state{ display:inline-flex; align-items:center; width:max-content; border-radius:6px; padding:3px 6px; font-size:.54rem; font-weight:820; line-height:1.1; white-space:nowrap; }
.mk-comment-admin-state.is-open{ color:#92400e; background:#f59e0b1f; }
.mk-comment-admin-state.is-reviewed{ color:#15803d; background:#22c55e1c; }
.mk-comment-admin-state.is-dismissed{ color:inherit; background:color-mix(in srgb,var(--md-default-fg-color) 7%,transparent); opacity:.68; }
.mk-comment-admin-view-actions{ display:flex; justify-content:flex-end; align-items:center; gap:5px; flex-wrap:wrap; }
.mk-comment-admin-action{ appearance:none; display:inline-flex; align-items:center; justify-content:center; min-height:28px; box-sizing:border-box; border:1px solid transparent; border-radius:8px; padding:4px 8px; color:inherit; background:transparent; cursor:pointer; font:inherit; font-size:.60rem; font-weight:730; line-height:1.15; text-decoration:none !important; white-space:nowrap; }
.mk-comment-admin-action:hover{ filter:brightness(.98); }
.mk-comment-admin-action.is-primary{ color:#fff; background:var(--md-accent-fg-color); box-shadow:0 3px 10px color-mix(in srgb,var(--md-accent-fg-color) 24%,transparent); }
.mk-comment-admin-action.is-secondary{ border-color:color-mix(in srgb,var(--md-default-fg-color) 13%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); }
.mk-comment-admin-action.is-danger{ color:#b91c1c; border-color:#dc262633; background:#dc26260c; }
.mk-comment-admin-action.is-quiet{ opacity:.64; }
.mk-comment-admin-action:disabled{ opacity:.42; cursor:wait; }
.mk-comment-admin-view-meta{ font-size:.60rem; opacity:.58; display:flex; gap:6px; flex-wrap:wrap; }
.mk-comment-admin-people{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; font-size:.63rem; }
.mk-comment-admin-people > div{ padding:5px 7px; border-radius:7px; background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.mk-comment-admin-view-text{ max-height:7.2em; overflow:auto; padding:7px 8px; border-radius:8px; background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); font-size:.68rem; line-height:1.42; white-space:pre-wrap; overflow-wrap:anywhere; }
.mk-comment-admin-view-reason{ display:grid; grid-template-columns:auto minmax(0,1fr); gap:7px; align-items:start; padding:7px 8px; border-radius:8px; color:#854d0e; background:#f59e0b14; font-size:.65rem; line-height:1.38; }
.mk-comment-admin-view-reason strong{ font-weight:820; white-space:nowrap; }
.mk-comment-admin-view-body > .mk-local-activity-empty{ padding:26px 14px; border:1px dashed color-mix(in srgb,var(--md-default-fg-color) 16%,transparent); border-radius:11px; text-align:center; }
@media (max-width:780px){ .mk-comment-admin-view-toolbar{ align-items:stretch; flex-direction:column; }.mk-comment-admin-view-nav,.mk-comment-admin-view-tools{ width:100%; }.mk-comment-admin-view-nav > *{ flex:1 1 0; }.mk-comment-admin-search{ flex:1 1 auto; }.mk-comment-admin-search input{ width:100%; }.mk-comment-admin-tool span{ display:none; }.mk-comment-admin-view-top{ grid-template-columns:1fr; }.mk-comment-admin-view-actions{ justify-content:flex-start; }.mk-comment-admin-view-main > .mk-local-activity-link{ white-space:normal; }.mk-comment-admin-people{ grid-template-columns:1fr; } }
@media (max-width:520px){ .mk-comment-admin-view-modal{ padding:0; align-items:flex-end; }.mk-comment-admin-view-panel{ width:100%; max-height:96dvh; border-radius:16px 16px 0 0; }.mk-comment-admin-view-head,.mk-comment-admin-view-toolbar{ padding-left:12px; padding-right:12px; }.mk-comment-admin-view-sub{ display:none; }.mk-comment-admin-view-filters{ padding-left:12px; padding-right:12px; }.mk-comment-admin-view-status{ margin-left:12px; margin-right:12px; }.mk-comment-admin-view-body{ padding-left:12px; padding-right:12px; padding-bottom:max(14px,env(safe-area-inset-bottom,0px)); }.mk-comment-admin-action{ flex:1 1 auto; }.mk-comment-admin-view-card{ padding:9px; } }

.mk-local-activity-modal{ position:fixed; inset:0; z-index:2147483200; display:flex; align-items:center; justify-content:center; padding:18px; background:rgba(12,16,24,.46); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); box-sizing:border-box; overflow:hidden; touch-action:none; }
.mk-local-activity-modal.mk-local-activity-modal--account{ align-items:flex-start; justify-content:center; }
.mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-panel{ transform-origin:top center; }
.mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-head,
.mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-tabs{ flex:0 0 auto; }
.mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-body{ flex:0 1 auto; }
.mk-local-activity-panel{ width:min(760px,calc(100vw - 36px)); max-width:calc(100vw - 36px); max-height:calc(100vh - 36px); overflow:hidden; display:flex; flex-direction:column; min-height:0; border-radius:22px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 14%,transparent); background:var(--md-default-bg-color); color:var(--md-default-fg-color); box-shadow:0 24px 80px rgba(0,0,0,.28); box-sizing:border-box; }
.mk-local-activity-modal--account .mk-local-activity-panel{ width:min(940px,calc(100vw - 36px)); height:auto !important; min-height:0 !important; }
.mk-local-activity-head{ display:flex; justify-content:space-between; align-items:flex-start; gap:12px; padding:16px 18px 10px; border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); }
.mk-local-activity-title{ font-weight:800; font-size:.96rem; }
.mk-local-activity-sub{ margin-top:3px; font-size:.70rem; opacity:.68; line-height:1.35; }
.mk-local-activity-close{ width:34px; height:34px; border-radius:999px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 16%,transparent); background:transparent; color:inherit; cursor:pointer; font-size:20px; }
.mk-local-activity-tabs{ display:flex; gap:9px; flex-wrap:wrap; padding:14px 18px 16px; overflow:visible; max-height:none; min-height:64px; overscroll-behavior:contain; border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); }
.mk-local-activity-tab{ appearance:none; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 15%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 5%,transparent); color:inherit; border-radius:999px; padding:6px 11px; cursor:pointer; font:inherit; font-size:.73rem; }
.mk-local-activity-tab.is-active{ border-color:var(--md-accent-fg-color); background:rgba(99,102,241,.10); font-weight:700; }
.mk-local-activity-body{ padding:12px 18px 18px; overflow:auto; overflow-x:hidden; display:grid; align-content:start; gap:10px; box-sizing:border-box; min-height:0; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; touch-action:pan-y; }
/* Desktop activity modal: give the panel and nested activity sections real scroll containers. */
.mk-local-activity-modal:not(.mk-local-activity-modal--account) .mk-local-activity-panel{ height:min(820px, calc(100vh - 36px)); }
.mk-local-activity-modal:not(.mk-local-activity-modal--account) .mk-local-activity-body{ flex:1 1 auto; min-height:0; overflow-y:auto !important; overflow-x:hidden !important; }
.mk-local-activity-modal:not(.mk-local-activity-modal--account) .mk-local-activity-body[data-type="activity"] .mk-local-fold-section{ min-height:0; }
.mk-local-activity-modal:not(.mk-local-activity-modal--account) .mk-local-activity-body[data-type="activity"] .mk-local-fold-body{ max-height:min(38vh, 330px); overflow-y:auto !important; overflow-x:hidden !important; -webkit-overflow-scrolling:touch; overscroll-behavior:contain; touch-action:pan-y; padding-right:6px; scrollbar-gutter:stable; }
/* Desktop Account Activity tab: the account modal uses the --account class,
   so the non-account scroll rule above does not apply there. Match the
   mobile behaviour explicitly when the Activity tab is active. */
@media (min-width:721px){
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="activity"] .mk-local-activity-panel{
    height:min(820px, calc(100vh - 36px)) !important;
    max-height:min(88dvh, calc(100vh - 36px)) !important;
    min-height:0 !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="activity"] .mk-local-activity-body{
    flex:1 1 auto !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="activity"] .mk-local-fold-section{
    min-height:0 !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="activity"] .mk-local-fold-body{
    max-height:min(34vh, 280px) !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    padding-right:6px !important;
    scrollbar-gutter:stable !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] .mk-local-activity-panel{
    height:min(820px, calc(100vh - 36px)) !important;
    max-height:calc(100vh - 36px) !important;
    min-height:0 !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] .mk-local-activity-body{
    flex:1 1 auto !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] .mk-local-fold-section{
    min-height:0 !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] .mk-local-fold-body{
    max-height:min(30vh, 240px) !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    padding-right:6px !important;
    scrollbar-gutter:stable !important;
  }
}
.mk-local-profile-card{ display:grid; gap:14px; min-width:0; }
.mk-local-profile-preview{ display:flex; align-items:center; gap:10px; padding:12px; border:1px solid color-mix(in srgb, var(--md-default-fg-color) 10%, transparent); border-radius:16px; background:color-mix(in srgb, var(--md-default-fg-color) 4%, transparent); min-width:0; }
.mk-local-profile-preview .mk-comment-avatar{ width:2.25rem; height:2.25rem; font-size:.9rem; }
.mk-local-avatar-preview{ justify-content:center; }
.mk-local-avatar-preview .mk-local-profile-avatarbox{ display:flex; justify-content:center; width:100%; min-width:0; }
.mk-local-avatar-preview > .mk-local-profile-avatarbox > .mk-comment-avatar{ width:3.2rem; height:3.2rem; font-size:1.25rem; }
.mk-local-profile-preview--editable{ display:grid; grid-template-columns:auto minmax(0,1fr) auto auto; align-items:center; }
.mk-local-profile-preview-text{ min-width:0; }
.mk-local-avatar-change{ flex:0 0 auto; }
.mk-local-profile-name{ font-weight:800; font-size:1.02rem; line-height:1.18; overflow-wrap:anywhere; }
.mk-local-profile-form{ display:grid; gap:10px; }
.mk-local-profile-form input{ width:100%; box-sizing:border-box; border:1px solid color-mix(in srgb, var(--md-default-fg-color) 18%, transparent); border-radius:10px; padding:.55rem .65rem; background:var(--md-default-bg-color); color:var(--md-default-fg-color); font:inherit; }
.mk-local-profile-form input[type="file"]{ padding:.48rem .58rem; }
.mk-local-avatar-modal .mk-local-mini-head{ position:sticky; top:-16px; z-index:36; margin:-16px -16px 0; padding:16px 16px 10px; border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); background:color-mix(in srgb,var(--md-default-bg-color) 96%,var(--md-default-fg-color) 4%); box-shadow:0 8px 18px rgba(0,0,0,.10); }
.mk-local-avatar-sticky{ position:sticky; top:42px; z-index:35; display:grid; gap:10px; margin:0 -16px; padding:0 16px 12px; background:color-mix(in srgb,var(--md-default-bg-color) 96%,var(--md-default-fg-color) 4%); border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); box-shadow:0 10px 22px rgba(0,0,0,.12); }
.mk-local-avatar-editor{ border:1px solid color-mix(in srgb, var(--md-default-fg-color) 11%, transparent); border-radius:15px; padding:10px; background:color-mix(in srgb, var(--md-default-fg-color) 3%, transparent); }
.mk-local-avatar-tabs{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:7px; margin-bottom:0; }
.mk-local-avatar-tab{ appearance:none; border:1px solid color-mix(in srgb, var(--md-default-fg-color) 15%, transparent); border-radius:999px; background:color-mix(in srgb, var(--md-default-fg-color) 4%, transparent); color:inherit; min-height:34px; font:inherit; font-size:.72rem; cursor:pointer; }
.mk-local-avatar-tab.is-active{ border-color:var(--md-accent-fg-color); background:rgba(99,102,241,.10); font-weight:750; }
.mk-local-avatar-note{ font-size:.70rem; opacity:.72; line-height:1.35; padding:8px 0; }
.mk-local-avatar-paywall{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin:7px 0 9px; }
.mk-local-avatar-card{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 13%,transparent); border-radius:14px; padding:8px; background:color-mix(in srgb,var(--md-default-bg-color) 92%,var(--md-default-fg-color) 8%); display:grid; gap:6px; justify-items:center; text-align:center; min-width:0; }
.mk-local-avatar-card.is-active{ border-color:var(--md-accent-fg-color); box-shadow:0 0 0 2px color-mix(in srgb,var(--md-accent-fg-color) 18%,transparent); }
.mk-local-avatar-paywall--preview{ width:100%; max-width:390px; margin:0; }
.mk-local-avatar-paywall--preview .mk-local-avatar-card{ grid-template-rows:auto 76px auto; align-items:center; border-color:transparent; box-shadow:none; background:transparent; padding:3px 4px 4px; gap:3px; overflow:visible; }
.mk-local-avatar-paywall--preview .mk-local-avatar-card.is-selected{ border-color:transparent; box-shadow:none; background:transparent; }
.mk-local-avatar-card-title{ font-weight:800; font-size:.72rem; }
.mk-local-avatar-card-preview{ min-height:72px; display:flex; align-items:center; justify-content:center; overflow:visible; }
.mk-local-avatar-card-preview .mk-comment-avatar{ width:3rem; height:3rem; min-width:3rem; font-size:1.18rem; }
.mk-local-avatar-card-preview .mk-comment-avatar.is-emoji-avatar .mk-avatar-core{ font-size:1.16em; }
.mk-local-avatar-price-btn{ appearance:none; display:inline-flex; align-items:center; justify-content:center; gap:4px; border:1px solid color-mix(in srgb,var(--mk-eorbit-color) 55%,transparent); border-radius:999px; background:color-mix(in srgb,var(--mk-eorbit-color) 12%,transparent); color:inherit; font:inherit; font-size:.64rem; font-weight:850; padding:5px 9px; min-width:66px; cursor:pointer; }
.mk-local-avatar-price-btn.is-owned{ border-color:rgba(34,197,94,.55); background:rgba(34,197,94,.14); cursor:pointer; }
.mk-local-initial-editor{ display:grid; gap:9px; }
.mk-local-initial-group{ display:grid; gap:5px; }
.mk-local-initial-options{ display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:5px; }
.mk-local-initial-option{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 13%,transparent); border-radius:12px; background:color-mix(in srgb,var(--md-default-bg-color) 93%,var(--md-default-fg-color) 7%); color:inherit; padding:5px; display:grid; gap:4px; min-width:0; text-align:center; }
.mk-local-initial-option.is-active{ border-color:var(--md-accent-fg-color); background:color-mix(in srgb,var(--md-accent-fg-color) 12%,transparent); }
.mk-local-initial-select{ appearance:none; border:0; background:transparent; color:inherit; font:inherit; cursor:pointer; padding:0; min-width:0; }
.mk-local-initial-select strong{ display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:.62rem; line-height:1.1; }
.mk-local-initial-option .mk-local-avatar-price-btn{ width:auto; min-width:auto; justify-self:center; padding:4px 10px; font-size:.54rem; }
.mk-local-initial-color-sample{ display:inline-flex; align-items:center; justify-content:center; width:1.54rem; height:1.54rem; margin:.22rem auto 0; border-radius:999px; border:1px solid rgba(255,255,255,.28); background:#111827; color:#e5e7eb; font-weight:900; font-size:.72rem; line-height:1; box-shadow:inset 0 0 0 1px rgba(0,0,0,.20); }
.mk-local-initial-scale-group{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 13%,transparent); border-radius:12px; padding:9px 10px; background:color-mix(in srgb,var(--md-default-bg-color) 93%,var(--md-default-fg-color) 7%); }
.mk-local-initial-scale-slider{ width:100%; accent-color:var(--md-accent-fg-color); }
.mk-local-initial-total{ border:1px dashed color-mix(in srgb,var(--md-accent-fg-color) 45%,transparent); border-radius:12px; padding:8px 10px; font-size:.70rem; font-weight:750; background:color-mix(in srgb,var(--md-accent-fg-color) 8%,transparent); }
.mk-local-avatar-emoji-tabs{ flex-wrap:wrap; overflow:visible; row-gap:5px; }
.mk-local-emoji-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(34px,1fr)); gap:4px; max-height:214px; width:100%; min-width:0; box-sizing:border-box; overflow-y:auto; overflow-x:hidden; -webkit-overflow-scrolling:touch; overscroll-behavior:contain; touch-action:pan-y; padding-right:2px; }
.mk-local-emoji-choice{ appearance:none; width:100%; min-width:0; min-height:0; aspect-ratio:1/1; box-sizing:border-box; padding:0; border:1px solid color-mix(in srgb, var(--md-default-fg-color) 12%, transparent); background:color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:.98rem; line-height:1; cursor:pointer; position:relative; }
.mk-local-emoji-choice .mk-comment-emoji-choice-img{ width:1.55rem; height:1.55rem; }
.mk-local-emoji-choice.is-active{ border-color:var(--md-accent-fg-color); background:rgba(99,102,241,.12); }
.mk-local-emoji-choice.is-locked,.mk-comment-emoji-choice.is-locked{ position:relative; opacity:.62; }
.mk-local-emoji-choice.is-locked::after{ content:"🔒"; position:absolute; right:0; bottom:0; font-size:.54rem; line-height:1; filter:drop-shadow(0 1px 1px rgba(0,0,0,.35)); }
.mk-comment-emoji-choice.is-locked::after{ content:"🔒"; position:absolute; right:-3px; bottom:-5px; font-size:.58rem; filter:drop-shadow(0 1px 1px rgba(0,0,0,.35)); }
.mk-local-emoji-choice.is-dynamic{ box-shadow:0 0 0 2px color-mix(in srgb,var(--md-accent-fg-color) 18%,transparent); }
.mk-local-profile-file-note{ font-size:.70rem; opacity:.72; line-height:1.35; }
@media (max-width:520px){
  .mk-local-avatar-sticky{ top:40px; gap:8px; padding-bottom:10px; }
  .mk-local-avatar-paywall--preview{ max-width:340px; }
  .mk-local-avatar-paywall--preview .mk-local-avatar-card{ grid-template-rows:auto 68px auto; padding:2px 3px 3px; }
  .mk-local-avatar-card-preview{ min-height:64px; }
  .mk-local-avatar-card-preview .mk-comment-avatar{ width:2.72rem; height:2.72rem; min-width:2.72rem; font-size:1.05rem; }
  .mk-local-avatar-card-preview .mk-comment-avatar.is-emoji-avatar .mk-avatar-core{ font-size:1.12em; }
  .mk-local-avatar-card-title{ font-size:.66rem; line-height:1.12; }
}
.mk-local-profile-actions{ display:flex; justify-content:flex-end; align-items:center; }
.mk-local-activity-row{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 11%,transparent); border-radius:14px; padding:10px 11px; display:grid; gap:5px; background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); }
.mk-local-activity-row.is-deleted{ opacity:.55; }
.mk-local-activity-main{ display:flex; justify-content:space-between; gap:10px; align-items:flex-start; }
.mk-local-activity-link{ font-weight:400 !important; font-size:.82rem; line-height:1.22; overflow-wrap:anywhere; color:var(--md-typeset-a-color, var(--md-accent-fg-color)) !important; text-decoration:underline; text-underline-offset:2px; }
.mk-local-activity-link--math mjx-container{ display:inline-block; margin:0 .04em; vertical-align:-.12em; }
.mk-local-activity-body[data-type="visits"] .mk-local-activity-link{ font-size:.76rem !important; font-weight:400 !important; }
.mk-local-activity-body[data-type="activity"] .mk-local-activity-link{ font-size:.76rem !important; font-weight:400 !important; }
.mk-local-activity-meta{ font-size:.62rem; line-height:1.25; opacity:.64; display:flex; gap:8px; flex-wrap:wrap; }
.mk-local-fold-section{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:16px; background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); overflow:hidden; }
.mk-local-fold-section + .mk-local-fold-section{ margin-top:10px; }
.mk-local-fold-summary{ cursor:pointer; list-style:none; padding:10px 12px; display:flex; align-items:center; justify-content:space-between; gap:12px; font-weight:750; font-size:.80rem; }
.mk-local-fold-summary::-webkit-details-marker{ display:none; }
.mk-local-fold-summary::after{ content:""; width:.32rem; height:.32rem; border-right:1.5px solid currentColor; border-bottom:1.5px solid currentColor; transform:rotate(45deg); opacity:.52; transition:transform 140ms ease; flex:0 0 auto; margin-right:2px; }
.mk-local-fold-section[open] .mk-local-fold-summary::after{ transform:rotate(-135deg); }
.mk-local-fold-count{ font-size:.62rem; font-weight:550; opacity:.55; margin-left:auto; }
.mk-local-fold-body{ padding:0 12px 12px; display:grid; gap:8px; }
.mk-local-fold-body .mk-local-activity-empty{ padding:4px 0; font-size:.72rem; }
.mk-local-activity-text{ font-size:.76rem; line-height:1.45; white-space:pre-wrap; opacity:.86; }
.mk-notification-row{ gap:8px; }
.mk-notification-left{ min-width:0; }
.mk-notification-line{ display:grid; grid-template-columns:auto minmax(0,1fr); align-items:center; column-gap:.82rem; row-gap:2px; font-size:.78rem; line-height:1.35; }
.mk-notification-line > span:not(.mk-notification-actor){ min-width:0; }
.mk-notification-actor{ display:inline-flex; align-items:center; gap:.48rem; font-weight:750; min-width:0; }
.mk-notification-actor .mk-comment-avatar{ width:2.05rem; height:2.05rem; min-width:2.05rem; font-size:.86rem; margin-right:.28rem; }
.mk-notification-actor .mk-comment-avatar.is-emoji-avatar{ font-size:1.08rem; }
.mk-notification-actor .mk-comment-avatar.is-emoji-avatar .mk-avatar-core{ font-size:1.08em; }
.mk-notification-left > .mk-local-activity-meta,
.mk-notification-left > .mk-local-activity-link,
.mk-notification-left > .mk-comment-small-btn{ margin-left:3.18rem; }
.mk-connection-request-form{ display:grid; grid-template-columns:minmax(0,1fr) auto; gap:8px; align-items:center; margin:8px 0 12px; }
.mk-connection-request-form input{ width:100%; box-sizing:border-box; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); border-radius:10px; padding:.55rem .65rem; background:var(--md-default-bg-color); color:var(--md-default-fg-color); font:inherit; }
.mk-connection-search-results{ display:grid; gap:6px; margin:-4px 0 14px; }
.mk-connection-search-row{ display:flex; align-items:center; gap:10px; padding:.5rem .58rem; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); border-radius:11px; background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); }
.mk-connection-search-profile{ min-width:0; flex:1; border:0; padding:0; background:transparent; color:inherit; text-align:left; cursor:pointer; font:inherit; }
.mk-connection-search-profile .mk-connection-person{ max-width:100%; gap:10px; }
.mk-connection-search-profile .mk-connection-person > .mk-comment-avatar{ width:1.7rem; height:1.7rem; min-width:1.7rem; flex-basis:1.7rem; font-size:.72rem; }
.mk-connection-search-profile .mk-connection-person-name{ font-size:.76rem; }
.mk-connection-search-status{ font-size:.72rem; opacity:.68; white-space:nowrap; }
.mk-connection-search-empty{ margin:-4px 0 12px; }
.mk-connections-card{ width:100%; min-width:0; }
.mk-connection-row{
  grid-template-columns:minmax(0,1fr) auto;
  align-items:center;
  column-gap:12px;
  row-gap:0;
  min-height:0;
  padding:9px 12px;
}
.mk-connection-row > .mk-local-activity-main{
  min-width:0;
  align-items:center;
  justify-content:flex-start;
}
.mk-connection-row .mk-local-activity-actions{
  align-self:center;
  justify-content:flex-end;
  flex-wrap:nowrap;
  white-space:nowrap;
}
.mk-connection-person{ display:flex; align-items:center; gap:10px; min-width:0; width:100%; }
.mk-connection-person > .mk-comment-avatar{ width:1.85rem; height:1.85rem; min-width:1.85rem; font-size:.78rem; flex:0 0 1.85rem; }
.mk-connection-person-copy{ display:grid; gap:3px; min-width:0; }
.mk-connection-person-name{ font-size:.80rem; line-height:1.18; font-weight:850; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.mk-connection-person-stats{ display:flex; align-items:center; gap:6px; flex-wrap:wrap; font-size:.64rem; line-height:1.25; font-weight:720; }
.mk-connection-person-stats span{ display:inline-flex; align-items:center; }
.mk-connection-person-stats span + span::before{ content:"·"; margin-right:6px; opacity:.42; }
.mk-connection-person-time{ font-size:.59rem; line-height:1.3; opacity:.66; }
.mk-connection-remove-btn{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  gap:6px !important;
  width:auto !important;
  min-width:0 !important;
  height:auto !important;
  min-height:30px !important;
  padding:.34rem .62rem !important;
  line-height:1 !important;
  white-space:nowrap;
}
.mk-connection-remove-btn svg{ width:.92rem; height:.92rem; display:block; flex:0 0 .92rem; fill:none; stroke:currentColor; }
.mk-notification-context{ opacity:.62; }
.mk-notification-row.is-xp-voucher .mk-local-activity-main,
.mk-notification-row.is-anonymous-claim .mk-local-activity-main{ display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:start; gap:12px; }
.mk-notification-action{ display:flex; align-items:flex-start; justify-content:flex-end; padding-top:2px; }
.mk-notification-action .mk-comment-small-btn{ white-space:nowrap; }
.mk-comment-reveal-name{
  border-color:color-mix(in srgb,var(--md-accent-fg-color) 42%,transparent) !important;
  background:color-mix(in srgb,var(--md-accent-fg-color) 11%,transparent) !important;
  font-weight:750 !important;
  padding:.38rem .68rem !important;
}
.mk-comment-reveal-name:hover,.mk-comment-reveal-name:focus-visible{ background:color-mix(in srgb,var(--md-accent-fg-color) 17%,transparent) !important; }
.mk-local-comment-activity-row.is-anonymous-comment{ border-style:dashed; }
@media (max-width:720px){
  .mk-notification-row.is-xp-voucher .mk-local-activity-main,
  .mk-notification-row.is-anonymous-claim .mk-local-activity-main{ grid-template-columns:minmax(0,1fr); }
  .mk-notification-action{ justify-content:flex-start; margin-left:3.18rem; padding-top:0; }
  .mk-connection-row{ column-gap:8px; padding:8px 9px; }
  .mk-connection-person{ gap:8px; }
  .mk-connection-person > .mk-comment-avatar{ width:1.65rem; height:1.65rem; min-width:1.65rem; font-size:.70rem; flex-basis:1.65rem; }
  .mk-connection-person-name{ font-size:.76rem; }
  .mk-connection-person-stats{ font-size:.60rem; gap:5px; }
  .mk-connection-person-stats span + span::before{ margin-right:5px; }
  .mk-connection-person-time{ font-size:.58rem; }
  .mk-connection-remove-btn{ width:2.15rem !important; min-width:2.15rem !important; height:2.15rem !important; min-height:2.15rem !important; padding:0 !important; justify-content:center; }
  .mk-connection-remove-btn span{ display:none; }
}

.mk-local-activity-actions{ display:flex; justify-content:flex-end; gap:7px; flex-wrap:wrap; }
.mk-local-comment-activity-row{ grid-template-columns:minmax(0,1fr) auto; grid-template-rows:auto auto; align-items:center; column-gap:12px; row-gap:8px; }
.mk-local-comment-activity-row .mk-local-activity-main{ grid-column:1 / -1; min-width:0; }
.mk-local-comment-activity-row > .mk-local-activity-text{ grid-column:1; grid-row:2; min-width:0; align-self:center; padding:8px 10px; border-left:3px solid color-mix(in srgb,var(--md-accent-fg-color) 55%,transparent); border-radius:10px; background:color-mix(in srgb,var(--md-default-bg-color) 88%,var(--md-default-fg-color) 12%); box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); }
.mk-local-comment-activity-row > .mk-local-activity-actions{ grid-column:2; grid-row:2; align-self:center; justify-self:end; flex-wrap:nowrap; white-space:nowrap; }
.mk-local-comment-activity-row > .mk-local-activity-actions .mk-comment-small-btn{ flex:0 0 auto; }
.mk-local-activity-empty{ opacity:.66; padding:10px 0; }
.mk-privacy-card{ display:grid; align-content:start; gap:10px; }
.mk-privacy-list{ display:grid; gap:8px; }
.mk-privacy-row{ display:grid; grid-template-columns:auto minmax(0,1fr); gap:10px; align-items:flex-start; padding:10px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:14px; background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); }
.mk-privacy-row input{ margin-top:.22rem; }
.mk-privacy-select{ min-width:8.8rem; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); border-radius:10px; padding:.42rem .48rem; background:var(--md-default-bg-color); color:var(--md-default-fg-color); font:inherit; font-size:.72rem; }
.mk-privacy-text{ display:grid; gap:2px; font-size:.76rem; line-height:1.35; }
.mk-privacy-text small{ opacity:.68; font-size:.70rem; line-height:1.35; }
.mk-privacy-actions{ gap:8px; flex-wrap:wrap; align-items:center; justify-content:flex-end; }
.mk-readiness-share{ margin:1.2rem 0; padding:12px 14px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:16px; background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); display:grid; gap:8px; }
.mk-readiness-share-title{ font-weight:800; font-size:.86rem; }
.mk-readiness-share-grid{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
.mk-readiness-share-box{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:13px; padding:9px; background:var(--md-default-bg-color); }
.mk-readiness-share-num{ font-weight:850; font-size:1.05rem; }
.mk-readiness-share-lab{ font-size:.68rem; opacity:.68; }
.mk-readiness-share-note{ font-size:.70rem; opacity:.70; line-height:1.35; }
@media (max-width:720px){ .mk-readiness-share-grid{ grid-template-columns:1fr; } }
html.mk-local-activity-open,body.mk-local-activity-open{ overflow:hidden !important; }
@media (max-width:720px){
  .mk-local-activity-modal{ padding:0 10px calc(env(safe-area-inset-bottom,0px) + 10px); align-items:flex-end; justify-content:center; background:rgba(12,16,24,.34); -webkit-backdrop-filter:none !important; backdrop-filter:none !important; overflow:hidden; touch-action:none; }
  .mk-local-activity-modal.mk-local-activity-modal--account{
    padding:10px 10px calc(env(safe-area-inset-bottom,0px) + 10px) !important;
    align-items:flex-start !important;
    justify-content:center !important;
  }
  .mk-local-activity-panel{ width:calc(100vw - 20px); max-width:calc(100vw - 20px); max-height:min(86dvh, calc(100vh - 58px)); border-radius:20px; transform:translateZ(0); will-change:transform; contain:layout paint style; box-shadow:0 16px 46px rgba(0,0,0,.24); }
  .mk-local-activity-modal.mk-local-activity-modal--account{ left:0 !important; right:0 !important; width:100dvw !important; max-width:100dvw !important; padding-left:0 !important; padding-right:0 !important; }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-panel{ width:100dvw !important; max-width:100dvw !important; margin-left:0 !important; margin-right:0 !important; border-left:0 !important; border-right:0 !important; border-radius:0 !important; }
  .mk-local-activity-head,.mk-local-activity-tabs,.mk-local-activity-body{ padding-left:14px; padding-right:14px; }
  .mk-local-activity-tabs{ overflow:visible; max-height:none; min-height:60px; }
  .mk-local-activity-body{ overflow-y:auto; -webkit-overflow-scrolling:touch; overscroll-behavior:contain; touch-action:pan-y; }
  .mk-local-activity-main{ flex-direction:column; }
  .mk-local-comment-activity-row{ grid-template-columns:minmax(0,1fr) auto !important; column-gap:8px !important; }
  .mk-local-comment-activity-row > .mk-local-activity-text{ white-space:normal; }
  .mk-local-comment-activity-row > .mk-local-activity-actions{ gap:5px !important; }
  .mk-local-avatar-emoji-tabs{ flex-wrap:wrap; overflow:visible; row-gap:5px; }
  .mk-local-emoji-grid{ grid-template-columns:repeat(auto-fill,minmax(30px,1fr)); gap:3px; max-height:min(42vh,260px); padding-right:0; overflow-x:hidden; }
  .mk-local-initial-options{ grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
  .mk-local-initial-option{ padding:8px; text-align:left; }
  .mk-local-emoji-choice{ border-radius:8px; font-size:.96rem; }
  .mk-local-emoji-choice.is-locked::after{ font-size:.46rem; }
  .mk-local-avatar-tabs{ gap:6px; }
  .mk-local-profile-main-row{ grid-template-columns:1fr; gap:10px; }
  .mk-local-profile-avatar-cell,.mk-local-profile-name-cell{ width:100%; }
}

/* Mobile account panel fixes: stable top tabs, cleaner privacy rows, and scrollable activity sections */
@media (max-width:720px){
  .mk-local-activity-panel{
    display:flex !important;
    flex-direction:column !important;
    overflow:hidden !important;
  }
  .mk-local-activity-head,
  .mk-local-activity-tabs{
    flex:0 0 auto !important;
  }
  .mk-local-activity-tabs{
    display:flex !important;
    flex-wrap:nowrap !important;
    align-items:center !important;
    justify-content:flex-start !important;
    gap:6px !important;
    padding:12px 14px !important;
    min-height:76px !important;
    max-height:none !important;
    overflow:visible !important;
    border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent) !important;
    box-sizing:border-box !important;
  }
  .mk-local-activity-tab.mk-comment-icon-btn{
    width:44px !important;
    min-width:44px !important;
    height:44px !important;
    min-height:44px !important;
    padding:0 !important;
    flex:0 0 44px !important;
  }
  .mk-local-activity-tab.mk-comment-icon-btn svg{
    width:20px !important;
    height:20px !important;
  }
  .mk-local-activity-tab .mk-notif-badge{
    right:-2px !important;
    top:-2px !important;
  }
  .mk-local-activity-body{
    flex:0 1 auto !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
  }
  .mk-privacy-row{
    grid-template-columns:minmax(0,1fr) !important;
    gap:7px !important;
    align-items:stretch !important;
    padding:10px !important;
  }
  .mk-privacy-select{
    width:100% !important;
    min-width:0 !important;
    max-width:none !important;
    grid-row:1 !important;
  }
  .mk-privacy-text{
    grid-row:2 !important;
    font-size:.72rem !important;
    line-height:1.28 !important;
  }
  .mk-privacy-text small{
    font-size:.66rem !important;
    line-height:1.3 !important;
  }
  .mk-local-activity-body[data-type="activity"] .mk-local-fold-section{
    min-height:0 !important;
  }
  .mk-local-activity-body[data-type="activity"] .mk-local-fold-body{
    max-height:min(34dvh,260px) !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    padding-right:6px !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] .mk-local-activity-body{
    flex:1 1 auto !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
  }
  .mk-local-activity-body[data-type="saved"] .mk-local-fold-section{
    min-height:0 !important;
  }
  .mk-local-activity-body[data-type="saved"] .mk-local-fold-body{
    max-height:min(30dvh,220px) !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    padding-right:6px !important;
    scrollbar-gutter:stable !important;
  }
}


/* Saved pages scroll fix v17:
   Keep each saved-list body as the actual clipping and scrolling box.  The
   previous build left the fold body as a grid/content-box scroll area, so the
   computed scroll bottom could sit below the visible rounded container. */
.mk-local-activity-body[data-type="saved"]{
  display:block !important;
  padding-bottom:18px !important;
}
.mk-local-activity-body[data-type="saved"] .mk-local-fold-section{
  display:block !important;
  overflow:hidden !important;
  min-height:0 !important;
}
.mk-local-activity-body[data-type="saved"] .mk-local-fold-body{
  box-sizing:border-box !important;
  display:block !important;
  min-height:0 !important;
  max-height:min(28dvh,220px) !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  touch-action:pan-y !important;
  padding:0 12px 14px 12px !important;
  margin:0 !important;
  scrollbar-gutter:stable both-edges !important;
}
@supports not (height: 1dvh){
  .mk-local-activity-body[data-type="saved"] .mk-local-fold-body{
    max-height:min(28vh,220px) !important;
  }
}
.mk-local-activity-body[data-type="saved"] .mk-local-fold-body > .mk-local-activity-row,
.mk-local-activity-body[data-type="saved"] .mk-local-fold-body > .mk-local-activity-empty{
  margin:0 !important;
}
.mk-local-activity-body[data-type="saved"] .mk-local-fold-body > .mk-local-activity-row + .mk-local-activity-row,
.mk-local-activity-body[data-type="saved"] .mk-local-fold-body > .mk-local-activity-empty + .mk-local-activity-row,
.mk-local-activity-body[data-type="saved"] .mk-local-fold-body > .mk-local-activity-row + .mk-local-activity-empty{
  margin-top:8px !important;
}
.mk-local-activity-body[data-type="saved"] .mk-local-fold-body::after{
  content:"";
  display:block;
  height:2px;
}
@media (max-width:720px){
  .mk-local-activity-body[data-type="saved"] .mk-local-fold-body{
    max-height:min(26dvh,190px) !important;
  }
  @supports not (height: 1dvh){
    .mk-local-activity-body[data-type="saved"] .mk-local-fold-body{
      max-height:min(26vh,190px) !important;
    }
  }
}

/* Mobile Account safe-area surface v33:
   Mirror the AI quiz modal: draw the blur as a real backdrop layer that reaches
   into the iOS hidden toolbar/safe-area strip, and make the Account panel fill
   down to the upper edge of that safe area instead of leaving a solid block. */
@media (max-width:720px), (pointer:coarse){
  html.mk-local-activity-open,
  body.mk-local-activity-open{
    overflow:hidden !important;
    touch-action:none !important;
  }
  .mk-local-activity-modal{
    position:absolute !important;
    inset:auto !important;
    left:var(--mk-local-doc-left, 0px) !important;
    top:var(--mk-local-doc-top, 0px) !important;
    width:var(--mk-local-doc-width, 100vw) !important;
    height:var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) !important;
    min-height:var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) !important;
    max-height:none !important;
    display:flex !important;
    align-items:flex-end !important;
    justify-content:center !important;
    padding:10px 10px calc(var(--mk-local-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 10px) !important;
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
  .mk-local-activity-modal::before{
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
  .mk-local-activity-modal.mk-local-activity-modal--account{
    align-items:flex-start !important;
    justify-content:center !important;
    padding:10px 10px calc(var(--mk-local-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 10px) !important;
  }
  .mk-local-activity-panel{
    position:relative !important;
    z-index:1 !important;
    display:flex !important;
    flex-direction:column !important;
    width:100% !important;
    max-width:720px !important;
    min-height:0 !important;
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100dvh)) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 20px) !important;
    margin:0 auto !important;
    overflow:hidden !important;
    border-radius:20px !important;
    background:var(--md-default-bg-color,#fff) !important;
    -webkit-transform:translateZ(0) !important;
    transform:translateZ(0) !important;
    contain:layout paint style !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-panel{
    height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100dvh)) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 20px) !important;
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100dvh)) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 20px) !important;
    border-bottom-left-radius:20px !important;
    border-bottom-right-radius:20px !important;
  }
  .mk-local-activity-head,
  .mk-local-activity-tabs{
    flex:0 0 auto !important;
  }
  .mk-local-activity-body{
    flex:1 1 auto !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    padding-bottom:calc(env(safe-area-inset-bottom, 0px) + 18px) !important;
  }
}


/* Mobile Account safe-area surface v35:
   Copy the Course diagnostics document-layer layout.  The account modal itself
   becomes a document-height surface, and the account panel/body continue behind
   the iOS Safari bottom toolbar area, so the toolbar samples real panel content
   instead of a plain grey/white safe-area colour. */
@media (max-width:720px), (pointer:coarse){
  .mk-local-activity-modal.mk-local-activity-modal--account{
    position:absolute !important;
    inset:auto !important;
    left:var(--mk-local-doc-left, 0px) !important;
    top:var(--mk-local-doc-top, 0px) !important;
    width:var(--mk-local-doc-width, 100vw) !important;
    height:var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) !important;
    min-height:var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) !important;
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
  .mk-local-activity-modal.mk-local-activity-modal--account::before{
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
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-panel{
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
    height:calc(var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) - env(safe-area-inset-top, 0px)) !important;
    min-height:calc(var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) - env(safe-area-inset-top, 0px)) !important;
    max-height:none !important;
    margin:0 !important;
    padding:0 !important;
    border-radius:0 !important;
    border-left:0 !important;
    border-right:0 !important;
    overflow:hidden !important;
    box-shadow:none !important;
    background:var(--md-default-bg-color,#fff) !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    -webkit-transform:translateZ(0) !important;
    transform:translateZ(0) !important;
    contain:layout paint style !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-head,
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-tabs{
    flex:0 0 auto !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-body{
    flex:1 1 auto !important;
    width:100% !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    padding-bottom:calc(var(--mk-local-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 24px) !important;
    background:var(--md-default-bg-color,#fff) !important;
  }
  [data-md-color-scheme="slate"] .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-panel,
  [data-md-color-scheme="slate"] .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-body,
  body[data-md-color-scheme="slate"] .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-panel,
  body[data-md-color-scheme="slate"] .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-body{
    background:var(--md-default-bg-color,#1f2430) !important;
  }
}




/* Mobile Account safe-area surface v36:
   This is the missing part from Course diagnostics: on mobile the account
   surface must be document-layer only, with no fixed-body colour strip.  Keep
   the blur as a pseudo-layer, hide any separate solid backdrop, and make the
   actual account panel fill the hidden iOS toolbar tail. */
@media (max-width:720px), (pointer:coarse){
  html.mk-local-activity-open,
  body.mk-local-activity-open{
    overflow:hidden !important;
    touch-action:none !important;
  }
  body.mk-local-activity-open[data-mk-modal-locked="1"] .mk-local-activity-modal.mk-local-activity-modal--account{
    /* Defensive: the JS now avoids fixed-body locking for Account on touch,
       but if a stale lock is present, keep this modal independent of the
       body's solid background layer. */
    transform:translateZ(0) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account{
    position:absolute !important;
    inset:auto !important;
    left:var(--mk-local-doc-left, 0px) !important;
    top:var(--mk-local-doc-top, 0px) !important;
    width:var(--mk-local-doc-width, 100vw) !important;
    height:var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) !important;
    min-height:var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) !important;
    max-height:none !important;
    padding:0 !important;
    margin:0 !important;
    display:block !important;
    align-items:stretch !important;
    justify-content:stretch !important;
    overflow:hidden !important;
    background:transparent !important;
    -webkit-backdrop-filter:none !important;
    backdrop-filter:none !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    -webkit-transform:translateZ(0) !important;
    transform:translateZ(0) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account::before{
    content:"" !important;
    position:absolute !important;
    inset:0 !important;
    width:100% !important;
    height:100% !important;
    min-height:100% !important;
    z-index:0 !important;
    pointer-events:none !important;
    background:rgba(12,16,24,.38) !important;
    -webkit-backdrop-filter:blur(10px) saturate(1.04) !important;
    backdrop-filter:blur(10px) saturate(1.04) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account::after{
    content:none !important;
    display:none !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account > .mk-local-activity-panel{
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
    height:calc(var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) - env(safe-area-inset-top, 0px)) !important;
    min-height:calc(var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) - env(safe-area-inset-top, 0px)) !important;
    max-height:none !important;
    margin:0 !important;
    padding:0 !important;
    border-radius:0 !important;
    border-left:0 !important;
    border-right:0 !important;
    overflow:hidden !important;
    box-shadow:none !important;
    background:var(--md-default-bg-color,#fff) !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    -webkit-transform:translateZ(0) !important;
    transform:translateZ(0) !important;
    contain:layout paint style !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-head,
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-tabs{
    flex:0 0 auto !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-body{
    flex:1 1 auto !important;
    width:100% !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    /* Keep the Account content surface, not the page/body colour, behind the
       iOS toolbar.  The extra bottom area belongs to the scroll container. */
    padding-bottom:calc(var(--mk-local-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 24px) !important;
    background:var(--md-default-bg-color,#fff) !important;
  }
  [data-md-color-scheme="slate"] .mk-local-activity-modal.mk-local-activity-modal--account > .mk-local-activity-panel,
  [data-md-color-scheme="slate"] .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-body,
  body[data-md-color-scheme="slate"] .mk-local-activity-modal.mk-local-activity-modal--account > .mk-local-activity-panel,
  body[data-md-color-scheme="slate"] .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-body{
    background:var(--md-default-bg-color,#1f2430) !important;
  }
}

.mk-comment-form{ border:1px solid color-mix(in srgb, var(--md-default-fg-color) 13%, transparent); border-radius:16px; padding:.8rem; margin:.7rem 0 1rem; background:color-mix(in srgb, var(--md-default-bg-color) 96%, var(--md-primary-fg-color) 4%); }
.mk-page-comments .mk-comment-composer .mk-comment-form.mk-comment-composer-form{
  display:grid;
  grid-template-columns:2.85rem minmax(0,1fr);
  align-items:start;
  gap:.78rem;
  padding:.15rem 0 !important;
  border:0 !important;
  border-radius:0 !important;
  background:transparent !important;
  box-shadow:none !important;
}
.mk-comment-form-avatar{ display:flex; justify-content:center; padding-top:.42rem; }
.mk-comment-form-avatar .mk-comment-avatar{ width:2.55rem !important; height:2.55rem !important; min-width:2.55rem !important; font-size:.96rem !important; }
.mk-comment-form-content{
  min-width:0;
  overflow:visible;
  border:1px solid var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 15%, transparent));
  border-radius:18px;
  background:var(--mk-theme-comment-field-bg, color-mix(in srgb, var(--md-default-bg-color) 97%, var(--md-primary-fg-color) 3%));
  box-shadow:0 8px 24px color-mix(in srgb, var(--md-default-fg-color) 6%, transparent);
  transition:border-color .16s ease, box-shadow .16s ease;
}
.mk-comment-form-content:focus-within{
  border-color:color-mix(in srgb, var(--md-accent-fg-color) 50%, var(--mk-theme-comment-border, transparent));
  box-shadow:0 10px 28px color-mix(in srgb, var(--md-accent-fg-color) 10%, transparent);
}
.mk-comment-form-profile{ display:flex; align-items:center; gap:.55rem; padding:.55rem .65rem; margin:.32rem 0 .55rem; border:1px solid color-mix(in srgb, var(--md-default-fg-color) 11%, transparent); border-radius:13px; background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); }
/* Keep the composer avatar identical to the Account header avatar. */
.mk-comment-form-profile .mk-comment-avatar{ width:2.35rem !important; height:2.35rem !important; min-width:2.35rem !important; font-size:.92rem !important; }
.mk-comment-form-profile .mk-avatar-frame-svg{ filter:drop-shadow(0 1px 1px rgba(0,0,0,.20)); }
.mk-comment-form-profile-main{ min-width:0; line-height:1.25; }
.mk-comment-form-profile-name{ font-weight:800; font-size:.82rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.mk-comment-form-profile-sub{ display:none; }
.mk-comment-form-footer{ display:flex; align-items:center; justify-content:space-between; gap:.75rem; margin-top:.35rem; }
.mk-comment-composer-form .mk-comment-form-footer{
  min-height:2.15rem;
  margin:.05rem .32rem .28rem .62rem;
  padding:.36rem 0 0;
  border-top:1px solid color-mix(in srgb, var(--md-default-fg-color) 9%, transparent);
}
.mk-comment-guest-identity{ display:flex; align-items:center; gap:.42rem; min-width:0; flex:1 1 auto; }
.mk-page-comments .mk-comment-composer-form .mk-comment-form-content .mk-comment-guest-identity .mk-comment-name-input{
  width:min(13rem,42vw) !important;
  min-width:6.5rem;
  margin:0 !important;
  padding:.22rem 0 !important;
  border:0 !important;
  border-radius:0 !important;
  outline:0 !important;
  background:transparent !important;
  box-shadow:none !important;
  font-size:.70rem;
  font-weight:650;
}
.mk-comment-guest-identity-note{ font-size:.64rem; line-height:1.25; opacity:.58; white-space:nowrap; }
.mk-comment-anon-wrap{ position:relative; display:flex; align-items:center; gap:.35rem; min-width:0; flex:1 1 auto; }
.mk-comment-anon-row{ display:flex; align-items:center; gap:.45rem; margin:0; font-size:.70rem; line-height:1.3; opacity:.82; min-width:0; cursor:pointer; }
.mk-comment-anon-row input{ width:auto !important; margin:0 !important; padding:0 !important; flex:0 0 auto; }
.mk-comment-anon-row span{ min-width:0; white-space:nowrap; }
.mk-comment-anon-info{ appearance:none; display:inline-flex; align-items:center; justify-content:center; width:1.05rem; height:1.05rem; min-width:1.05rem; border-radius:999px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 24%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); color:var(--md-default-fg-color); font:inherit; font-size:.58rem; font-weight:800; line-height:1; cursor:pointer; opacity:.78; }
.mk-comment-anon-info:hover,.mk-comment-anon-info:focus-visible{ opacity:1; border-color:var(--md-accent-fg-color); background:rgba(99,102,241,.10); }
.mk-comment-anon-note{ position:absolute; left:0; top:calc(100% + 7px); z-index:20; width:min(310px, calc(100vw - 44px)); padding:.55rem .65rem; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 16%,transparent); border-radius:12px; background:var(--md-default-bg-color); color:var(--md-default-fg-color); box-shadow:0 12px 32px rgba(0,0,0,.16); font-size:.68rem; line-height:1.35; opacity:.92; }
.mk-comment-form-hint{ font-size:.70rem; opacity:.68; line-height:1.35; margin:.15rem 0 .35rem; }
.mk-comment-form input,.mk-comment-form textarea{ width:100%; box-sizing:border-box; border:1px solid color-mix(in srgb, var(--md-default-fg-color) 18%, transparent); border-radius:10px; padding:.55rem .65rem; margin:.32rem 0; background:var(--md-default-bg-color); color:var(--md-default-fg-color); font:inherit; }
.mk-comment-form textarea{ min-height:86px; resize:vertical; }
.mk-comment-text-wrap{ position:relative; margin:.32rem 0; }
.mk-comment-text-wrap textarea{ margin:0 !important; padding-right:2.45rem !important; }
.mk-comment-composer-form .mk-comment-text-wrap{ margin:0; }
.mk-page-comments .mk-comment-composer-form .mk-comment-form-content .mk-comment-text-wrap textarea{
  min-height:94px;
  margin:0 !important;
  padding:.72rem 2.6rem .52rem .72rem !important;
  border:0 !important;
  border-radius:18px 18px 0 0 !important;
  outline:0 !important;
  background:transparent !important;
  box-shadow:none !important;
}
.mk-comment-emoji-btn{ position:absolute; right:.50rem; bottom:.50rem; z-index:2; width:1.52rem !important; min-width:1.52rem !important; height:1.52rem !important; min-height:1.52rem !important; padding:0 !important; border-radius:999px !important; background:color-mix(in srgb,var(--md-default-bg-color) 96%,var(--md-accent-fg-color) 4%) !important; }
.mk-comment-emoji-btn svg{ width:.78rem !important; height:.78rem !important; }
.mk-comment-emoji-menu{ position:fixed; right:1rem; bottom:1rem; z-index:10050; width:min(390px, calc(100vw - 64px)); max-height:min(360px, 58vh); overflow:hidden; overscroll-behavior:contain; display:flex; flex-direction:column; gap:.42rem; padding:.55rem; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 16%,transparent); border-radius:14px; background:var(--md-default-bg-color); color:var(--md-default-fg-color); box-shadow:0 16px 42px rgba(0,0,0,.18); -webkit-overflow-scrolling:touch; }
.mk-comment-emoji-menu[hidden]{ display:none !important; }
.mk-comment-emoji-tabs{ display:flex; gap:.28rem; overflow:auto; scrollbar-width:none; -ms-overflow-style:none; padding-bottom:.08rem; flex:0 0 auto; }
.mk-comment-emoji-tabs::-webkit-scrollbar{ display:none; }
.mk-comment-emoji-tab{ appearance:none; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 13%,transparent); border-radius:999px; background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); color:inherit; padding:.22rem .48rem; font:inherit; font-size:.64rem; line-height:1.1; white-space:nowrap; cursor:pointer; }
.mk-comment-emoji-tab.is-active{ border-color:color-mix(in srgb,var(--md-accent-fg-color) 48%,transparent); background:color-mix(in srgb,var(--md-accent-fg-color) 13%,transparent); font-weight:750; }
.mk-comment-emoji-grid{ display:grid; grid-template-columns:repeat(8, minmax(0,1fr)); gap:.12rem; overflow:auto; padding-right:.08rem; min-height:0; flex:1 1 auto; -webkit-overflow-scrolling:touch; }
.mk-comment-emoji-choice{ appearance:none; display:inline-flex; align-items:center; justify-content:center; width:100%; aspect-ratio:1/1; border:0; border-radius:10px; background:transparent; font-size:1.18rem; line-height:1; cursor:pointer; position:relative; }
.mk-comment-emoji-choice-img{ width:1.72rem; height:1.72rem; display:block; object-fit:contain; filter:none !important; opacity:1 !important; mix-blend-mode:normal !important; color:initial !important; }
/* Lazily-loaded Noto thumbnail overlays the instant native-glyph fallback. */
.mk-comment-emoji-choice.mk-emoji-thumb-pending>.mk-comment-emoji-choice-img,.mk-local-emoji-choice.mk-emoji-thumb-pending>.mk-comment-emoji-choice-img,.mk-comment-emoji-choice.has-thumb>.mk-comment-emoji-choice-img,.mk-local-emoji-choice.has-thumb>.mk-comment-emoji-choice-img{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); }
.mk-comment-emoji-choice.has-thumb,.mk-local-emoji-choice.has-thumb{ font-size:0 !important; }
/* Emoji that collapse skin-tone variants get a small corner marker. */
.mk-comment-emoji-choice.has-tone-variants::before,.mk-local-emoji-choice.has-tone-variants::before{ content:""; position:absolute; right:3px; bottom:3px; width:5px; height:5px; border-radius:50%; background:linear-gradient(135deg,#f9d9a8,#7a4a26); box-shadow:0 0 0 1px var(--md-default-bg-color); pointer-events:none; }
/* Per-emoji skin-tone strip shown above the grid. */
.mk-comment-emoji-tonestrip{ display:flex; flex-direction:column; gap:.18rem; padding:.3rem .15rem .35rem; border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); margin-bottom:.18rem; }
.mk-comment-emoji-tonestrip-label{ font-size:.7rem; opacity:.7; padding-left:.15rem; }
.mk-comment-emoji-tonestrip-row{ display:flex; gap:.12rem; flex-wrap:nowrap; }
.mk-comment-emoji-tonestrip-row>.mk-comment-emoji-choice,.mk-comment-emoji-tonestrip-row>.mk-local-emoji-choice{ flex:0 0 auto; width:2rem; height:2rem; aspect-ratio:auto; }
.mk-comment-emoji-tonestrip-row>.mk-local-emoji-choice.is-active{ border-color:var(--md-accent-fg-color); }
.mk-comment-emoji-choice:hover,.mk-comment-emoji-choice:focus-visible{ background:color-mix(in srgb,var(--md-accent-fg-color) 12%,transparent); outline:none; }
.mk-comment-emoji-loading{ font-size:.70rem; opacity:.68; padding:.25rem .15rem; }
.mk-noto-comment-emoji{ width:1.35em; height:1.35em; display:inline-block; vertical-align:-.32em; object-fit:contain; margin:0 .03em; filter:none !important; opacity:1 !important; mix-blend-mode:normal !important; color:initial !important; }
.mk-comment-edit-form{ margin:.55rem 0 .15rem; }
.mk-comment-edit-form textarea{ width:100%; box-sizing:border-box; min-height:82px; resize:vertical; border:1px solid color-mix(in srgb, var(--md-default-fg-color) 18%, transparent); border-radius:10px; padding:.55rem .65rem; background:var(--md-default-bg-color); color:var(--md-default-fg-color); font:inherit; }
.mk-comment-form-actions{ display:flex; justify-content:flex-end; align-items:center; gap:.5rem; margin-top:0; flex:0 0 auto; }
.mk-comment-form-actions .mk-comment-primary-btn.mk-comment-icon-btn{ width:1.86rem !important; min-width:1.86rem !important; height:1.86rem !important; }
.mk-comment-form-actions .mk-comment-primary-btn.mk-comment-icon-btn svg{ width:.86rem !important; height:.86rem !important; }
.mk-comment-primary-btn:disabled,.mk-comment-small-btn:disabled,.mk-comment-icon-btn:disabled{ opacity:.42 !important; cursor:not-allowed !important; filter:grayscale(.35); pointer-events:none; }

[data-md-color-scheme="slate"] .mk-comment-admin-btn.is-on,
body[data-md-color-scheme="slate"] .mk-comment-admin-btn.is-on,
[data-md-color-scheme="slate"] .mk-comment-emoji-btn,
body[data-md-color-scheme="slate"] .mk-comment-emoji-btn,
[data-md-color-scheme="slate"] .mk-comment-form-actions .mk-comment-primary-btn.mk-comment-icon-btn,
body[data-md-color-scheme="slate"] .mk-comment-form-actions .mk-comment-primary-btn.mk-comment-icon-btn{
  color:rgba(255,255,255,.92) !important;
  border-color:rgba(255,255,255,.28) !important;
  background:rgba(255,255,255,.08) !important;
}
[data-md-color-scheme="slate"] .mk-comment-admin-btn.is-on:hover,
body[data-md-color-scheme="slate"] .mk-comment-admin-btn.is-on:hover,
[data-md-color-scheme="slate"] .mk-comment-emoji-btn:hover,
body[data-md-color-scheme="slate"] .mk-comment-emoji-btn:hover,
[data-md-color-scheme="slate"] .mk-comment-form-actions .mk-comment-primary-btn.mk-comment-icon-btn:hover,
body[data-md-color-scheme="slate"] .mk-comment-form-actions .mk-comment-primary-btn.mk-comment-icon-btn:hover{
  color:#fff !important;
  border-color:rgba(255,255,255,.38) !important;
  background:rgba(255,255,255,.12) !important;
}
[data-md-color-scheme="slate"] .mk-comment-emoji-menu,
body[data-md-color-scheme="slate"] .mk-comment-emoji-menu{
  color:rgba(255,255,255,.92) !important;
  border-color:rgba(255,255,255,.18) !important;
  background:color-mix(in srgb,var(--md-default-bg-color) 92%,#fff 8%) !important;
}

@media (max-width:520px){
  .mk-page-comments .mk-comment-composer .mk-comment-form.mk-comment-composer-form{ grid-template-columns:2.5rem minmax(0,1fr); gap:.58rem; }
  .mk-comment-form-avatar .mk-comment-avatar{ width:2.2rem !important; height:2.2rem !important; min-width:2.2rem !important; font-size:.82rem !important; }
  .mk-comment-form-footer{ align-items:flex-end; gap:.5rem; }
  .mk-comment-composer-form .mk-comment-form-footer{ align-items:center; margin-left:.55rem; }
  .mk-comment-guest-identity{ align-items:flex-start; flex-direction:column; gap:0; }
  .mk-page-comments .mk-comment-composer-form .mk-comment-form-content .mk-comment-guest-identity .mk-comment-name-input{ width:min(10rem,42vw) !important; }
  .mk-comment-guest-identity-note{ white-space:normal; }
  .mk-comment-anon-row span{ white-space:normal; }
  .mk-comment-emoji-menu{ width:min(340px, calc(100vw - 46px)); max-height:min(320px, 54vh); }
  .mk-comment-emoji-grid{ grid-template-columns:repeat(7, minmax(0,1fr)); }
  .mk-comment-emoji-choice{ font-size:1.12rem; }
}
.mk-comment-leave-btn{ min-width:min(360px,100%); border-radius:16px !important; padding:.72rem 1.05rem !important; justify-content:center !important; font-size:.86rem !important; font-weight:500 !important; gap:.45rem !important; }
.mk-comment-leave-btn .mk-comment-sr{ position:static !important; width:auto !important; height:auto !important; margin:0 !important; overflow:visible !important; clip:auto !important; white-space:normal !important; }
.mk-comment-leave-btn svg{ display:none !important; }
.mk-comment-list{ display:flex; flex-direction:column; gap:.75rem; }
.mk-comment-card{ border:1px solid color-mix(in srgb, var(--md-default-fg-color) 11%, transparent); border-radius:16px; padding:.78rem .85rem; background:color-mix(in srgb, var(--md-default-bg-color) 98%, var(--md-primary-fg-color) 2%); }
.mk-comments-sort{ --mk-comments-sort-radius:.72rem; --mk-comments-sort-surface:#fff; --mk-comments-sort-hover:#fff; position:relative; display:inline-block; box-sizing:border-box; width:7.75rem; color:var(--md-default-fg-color); font-family:inherit; font-size:.64rem; font-weight:750; line-height:1.15; isolation:isolate; }
html[data-md-color-scheme="slate"] .mk-comments-sort,body[data-md-color-scheme="slate"] .mk-comments-sort{ --mk-comments-sort-surface:#1f242c; --mk-comments-sort-hover:#1f242c; }
@supports(color:color-mix(in srgb,#fff,#000)){
  .mk-comments-sort{ --mk-comments-sort-hover:color-mix(in srgb,#fff 93%,var(--md-accent-fg-color) 7%); }
  html[data-md-color-scheme="slate"] .mk-comments-sort,body[data-md-color-scheme="slate"] .mk-comments-sort{ --mk-comments-sort-hover:color-mix(in srgb,#1f242c 91%,var(--md-accent-fg-color) 9%); }
}
.mk-comments-sort-trigger{ all:unset; position:relative !important; display:block !important; box-sizing:border-box !important; width:100% !important; min-height:1.95rem !important; padding:.42rem 2rem .42rem .68rem !important; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 17%,transparent) !important; border-radius:var(--mk-comments-sort-radius) !important; color:inherit !important; background:var(--mk-comments-sort-surface) !important; font:inherit !important; line-height:1.15 !important; text-align:left !important; white-space:nowrap !important; cursor:pointer !important; transition:border-color 140ms ease,background-color 140ms ease,box-shadow 140ms ease !important; }
.mk-comments-sort-trigger::before,.mk-comments-sort-trigger::after{ content:none !important; display:none !important; }
.mk-comments-sort-label{ all:unset; display:block !important; min-width:0 !important; overflow:hidden !important; color:inherit !important; font:inherit !important; line-height:1.15 !important; text-align:left !important; text-overflow:ellipsis !important; white-space:nowrap !important; }
.mk-comments-sort-caret{ all:unset; position:absolute !important; inset-inline-end:.68rem !important; top:50% !important; display:block !important; box-sizing:border-box !important; width:.72rem !important; height:.72rem !important; color:inherit !important; opacity:.72 !important; pointer-events:none !important; transform:translateY(-50%) rotate(0deg) !important; transform-origin:center !important; transition:transform 160ms ease,opacity 140ms ease !important; }
.mk-comments-sort-caret svg{ all:unset; display:block !important; width:100% !important; height:100% !important; overflow:visible !important; }
.mk-comments-sort-caret path{ fill:none !important; stroke:currentColor !important; stroke-width:2.2 !important; stroke-linecap:round !important; stroke-linejoin:round !important; }
.mk-comments-sort-trigger:hover{ border-color:color-mix(in srgb,var(--md-accent-fg-color) 42%,transparent) !important; background:var(--mk-comments-sort-hover) !important; }
.mk-comments-sort.is-open .mk-comments-sort-trigger{ border-color:color-mix(in srgb,var(--md-accent-fg-color) 58%,transparent) !important; box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--md-accent-fg-color) 13%,transparent) !important; }
.mk-comments-sort.is-open .mk-comments-sort-caret{ opacity:.92 !important; transform:translateY(-50%) rotate(180deg) !important; }
.mk-comments-sort-trigger:focus-visible{ outline:2px solid color-mix(in srgb,var(--md-accent-fg-color) 64%,transparent) !important; outline-offset:2px !important; }
.mk-comments-sort-menu{ all:unset; position:absolute !important; z-index:30 !important; top:calc(100% + .28rem) !important; inset-inline:0 !important; display:block !important; box-sizing:border-box !important; width:auto !important; padding:.28rem !important; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 17%,transparent) !important; border-radius:var(--mk-comments-sort-radius) !important; color:inherit !important; background:var(--mk-comments-sort-surface) !important; box-shadow:0 .55rem 1.35rem color-mix(in srgb,#000 18%,transparent) !important; font:inherit !important; overflow:hidden !important; }
.mk-comments-sort-menu[hidden]{ display:none !important; }
.mk-comments-sort-option{ all:unset; display:flex !important; align-items:center !important; box-sizing:border-box !important; width:100% !important; min-height:1.85rem !important; padding:.46rem .56rem !important; border:0 !important; border-radius:.52rem !important; color:inherit !important; background:transparent !important; font:inherit !important; line-height:1.15 !important; text-align:left !important; white-space:nowrap !important; cursor:pointer !important; }
.mk-comments-sort-option:hover,.mk-comments-sort-option:focus-visible{ outline:none !important; background:color-mix(in srgb,var(--md-accent-fg-color) 12%,transparent) !important; }
.mk-comments-sort-option[aria-selected="true"]{ color:var(--md-primary-bg-color,#fff) !important; background:var(--md-accent-fg-color) !important; }
.mk-comment-card.is-reply{ margin-top:.55rem; margin-left:1.15rem; border-radius:14px; }
.mk-comment-replies-toggle{ appearance:none; display:inline-flex; align-items:center; gap:.32rem; margin:.55rem 0 .05rem; padding:.32rem .58rem; border-radius:999px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 15%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); color:var(--md-default-fg-color); font:inherit; font-size:.70rem; line-height:1.2; cursor:pointer; opacity:.88; }
.mk-comment-replies-toggle:hover,.mk-comment-replies-toggle:focus-visible{ opacity:1; border-color:color-mix(in srgb,var(--md-accent-fg-color) 46%,transparent); background:color-mix(in srgb,var(--md-accent-fg-color) 10%,transparent); outline:none; }
.mk-comment-replies-toggle::before{ content:"▸"; font-size:.72rem; line-height:1; opacity:.72; transform:translateY(-.01rem); }
.mk-comment-replies-toggle.is-open::before{ content:"▾"; }
.mk-comment-replies[hidden]{ display:none !important; }
.mk-comment-meta{ display:flex; gap:.5rem; align-items:center; flex-wrap:wrap; margin-bottom:.35rem; }
.mk-comment-name{ font-weight:700; }
.mk-comment-avatar{ width:1.55rem; height:1.55rem; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; flex:0 0 auto; position:relative; border:0; background:transparent; font-size:.74rem; font-weight:800; line-height:1; overflow:visible; isolation:isolate; }
.mk-comment-avatar .mk-avatar-core{ position:relative; z-index:1; width:100%; height:100%; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; overflow:hidden; box-sizing:border-box; border:1px solid color-mix(in srgb, var(--md-default-fg-color) 14%, transparent); background:color-mix(in srgb, var(--md-primary-fg-color) 13%, var(--md-default-bg-color)); }
.mk-comment-avatar.has-image .mk-avatar-core{ background:transparent; }
.mk-comment-avatar img{ width:100%; height:100%; object-fit:cover; display:block; border-radius:inherit; }
.mk-avatar-frame-svg{ position:absolute; z-index:2; left:50%; top:50%; width:152%; height:152%; max-width:none !important; max-height:none !important; transform:translate(-50%,-50%); pointer-events:none; overflow:visible; filter:drop-shadow(0 1px 1px rgba(0,0,0,.20)); }
.mk-avatar-frame-level-1 .mk-avatar-frame-svg{ width:134%; height:134%; opacity:.92; filter:none; }
.mk-avatar-frame-level-2 .mk-avatar-frame-svg{ width:142%; height:142%; }
.mk-avatar-frame-level-3 .mk-avatar-frame-svg{ width:148%; height:148%; }
.mk-avatar-frame-level-4 .mk-avatar-frame-svg{ width:154%; height:154%; }
.mk-avatar-frame-level-5 .mk-avatar-frame-svg{ width:162%; height:162%; }
.mk-avatar-frame-level-6 .mk-avatar-frame-svg{ width:166%; height:166%; }
.mk-avatar-frame-level-7 .mk-avatar-frame-svg{ width:170%; height:170%; filter:drop-shadow(0 0 4px rgba(168,85,247,.38)); }
.mk-avatar-frame-level-8 .mk-avatar-frame-svg{ width:174%; height:174%; filter:drop-shadow(0 0 4px rgba(244,63,94,.38)); }
.mk-avatar-frame-level-9 .mk-avatar-frame-svg{ width:180%; height:180%; filter:drop-shadow(0 0 5px rgba(14,165,233,.32)); }
.mk-avatar-frame-level-10 .mk-avatar-frame-svg{ width:188%; height:188%; filter:drop-shadow(0 0 5px rgba(250,204,21,.42)); }


.mk-comment-person > .mk-comment-avatar.mk-avatar-frame-level-7,
.mk-comment-person > .mk-comment-avatar.mk-avatar-frame-level-8,
.mk-comment-person > .mk-comment-avatar.mk-avatar-frame-level-9,
.mk-comment-person > .mk-comment-avatar.mk-avatar-frame-level-10{ margin-right:.34rem; }
.mk-notification-actor > .mk-comment-avatar.mk-avatar-frame-level-7,
.mk-notification-actor > .mk-comment-avatar.mk-avatar-frame-level-8,
.mk-notification-actor > .mk-comment-avatar.mk-avatar-frame-level-9,
.mk-notification-actor > .mk-comment-avatar.mk-avatar-frame-level-10{ margin-right:.42rem; }

/* The comment section sits inside .md-typeset, whose global svg rules can cap
   inline SVGs at max-width:100%. That was the reason the frame looked smaller
   only in comments. Force the frame SVG to keep the same geometry as Account,
   and give comment avatars the same container size as the Account header. */
.md-typeset .mk-comment-avatar .mk-avatar-frame-svg,
.mk-comment-avatar .mk-avatar-frame-svg{
  max-width:none !important;
  max-height:none !important;
  overflow:visible !important;
}
.mk-comment-form-profile .mk-comment-avatar,
.mk-comment-card .mk-comment-person > .mk-comment-avatar{
  width:2.35rem !important;
  height:2.35rem !important;
  min-width:2.35rem !important;
  font-size:.92rem !important;
}
.mk-comment-form-profile .mk-avatar-frame-svg,
.mk-comment-card .mk-comment-person > .mk-comment-avatar .mk-avatar-frame-svg{
  transform:translate(-50%,-50%) !important;
  transform-origin:center center !important;
}
.mk-avatar-frame-modal .mk-local-mini-panel{ width:min(880px,calc(100vw - 36px)); }
.mk-avatar-frame-body{ gap:12px; }
.mk-avatar-frame-grid{ display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:11px; margin:10px 0 12px; }
.mk-avatar-frame-choice{ appearance:none; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 14%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); color:inherit; border-radius:14px; padding:10px 7px 9px; display:grid; grid-template-rows:66px minmax(2.35em,auto); align-content:start; justify-items:center; gap:6px; font:inherit; cursor:pointer; min-height:114px; overflow:visible; }
.mk-avatar-frame-choice.is-active{ border-color:var(--md-accent-fg-color); background:rgba(99,102,241,.10); box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--md-accent-fg-color) 34%,transparent); }
.mk-avatar-frame-choice.is-locked{ opacity:.42; cursor:not-allowed; filter:grayscale(.45); }
.mk-avatar-frame-choice .mk-comment-avatar{ width:2rem; height:2rem; min-width:2rem; align-self:center; justify-self:center; font-size:.76rem; }
.mk-avatar-frame-choice .mk-avatar-frame-svg{ transform:translate(-50%,-50%) scale(.92) !important; transform-origin:center center !important; }
.mk-avatar-frame-choice small{ display:block; align-self:start; max-width:100%; min-height:2.35em; font-size:.60rem; line-height:1.08; text-align:center; overflow-wrap:anywhere; }
.mk-levelup-card{ display:grid; justify-items:center; text-align:center; gap:10px; padding:6px 4px 2px; }
.mk-levelup-avatar .mk-comment-avatar{ width:3.2rem; height:3.2rem; min-width:3.2rem; font-size:1.15rem; }
.mk-levelup-title{ font-size:1.05rem; font-weight:850; }
.mk-levelup-sub{ font-size:.74rem; opacity:.76; line-height:1.4; max-width:30rem; }
.mk-xp-cap-card{ display:grid; justify-items:center; text-align:center; gap:10px; padding:8px 6px 2px; }
.mk-xp-cap-emoji{ width:3rem; height:3rem; border-radius:999px; display:flex; align-items:center; justify-content:center; font-size:1.45rem; background:color-mix(in srgb,var(--md-accent-fg-color) 13%,transparent); border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 28%,transparent); box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--md-default-bg-color) 65%,transparent); }
.mk-xp-cap-title{ font-size:1.02rem; font-weight:850; line-height:1.18; }
.mk-xp-cap-sub{ font-size:.74rem; opacity:.78; line-height:1.42; max-width:31rem; }
.mk-xp-cap-meter{ width:100%; display:grid; gap:5px; margin-top:2px; }
.mk-xp-cap-meter-line{ height:9px; border-radius:999px; background:color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); overflow:hidden; }
.mk-xp-cap-meter-line span{ display:block; width:100%; height:100%; border-radius:inherit; background:var(--md-accent-fg-color); }
.mk-xp-cap-meter-text{ font-size:.64rem; line-height:1.2; opacity:.68; }
@media (max-width:720px){ .mk-avatar-frame-modal .mk-local-mini-panel{ width:calc(100vw - 20px); max-height:min(88dvh,calc(100vh - 24px)); } .mk-avatar-frame-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; } .mk-avatar-frame-choice{ min-height:108px; grid-template-rows:60px minmax(2.25em,auto); padding:9px 7px 8px; } .mk-avatar-frame-choice .mk-comment-avatar{ width:1.86rem; height:1.86rem; min-width:1.86rem; } }
.mk-comment-person.is-public-profile{ cursor:pointer; }
.mk-comment-person{ overflow:visible; }
.mk-comment-card .mk-comment-meta{ overflow:visible; }
.mk-page-action-wrap{ position:relative; display:inline-flex; align-items:center; }
article.md-content__inner h1:has(> .mk-page-action-wrap),
.md-content h1:has(> .mk-page-action-wrap){
  display:flex;
  align-items:flex-start;
  gap:.75rem;
}
article.md-content__inner h1 > .mk-page-action-wrap,
.md-content h1 > .mk-page-action-wrap{
  flex:0 0 auto;
  align-self:flex-start;
  margin-left:auto;
}
.mk-page-action-shield{ position:fixed; inset:0; z-index:2147482099; background:transparent; pointer-events:auto; touch-action:none; }
.mk-page-action-menu{ position:absolute; right:0; top:calc(100% + 8px); z-index:2147482100; width:max-content; min-width:0; max-width:calc(100vw - 24px); padding:6px; border-radius:14px; border:1px solid color-mix(in srgb, var(--md-default-fg-color) 14%, transparent); background:var(--md-default-bg-color); box-shadow:0 16px 40px rgba(0,0,0,.16); box-sizing:border-box; pointer-events:auto; touch-action:manipulation; isolation:isolate; }
html.mk-page-action-menu-open #mk-random-tabs-shadow .mk-rt-trigger,
html.mk-page-action-menu-open #mk-random-tabs-shadow .mk-rt-link,
html.mk-page-action-menu-open .md-tabs .mk-rt-trigger,
html.mk-page-action-menu-open .md-tabs .mk-rt-link,
html.mk-page-action-menu-open .mk-random-tabs-menu button,
html.mk-page-action-menu-open .mk-random-tabs-menu a,
html.mk-page-action-menu-open .mk-rt-panel,
html.mk-page-action-menu-open .md-tab-dropdown-panel.md-random-dropdown-panel{ pointer-events:none !important; }
html.mk-page-action-menu-open .mk-rt-panel.mk-rt-open,
html.mk-page-action-menu-open .md-tab-dropdown-panel.md-random-dropdown-panel{ display:none !important; }
.mk-page-action-item{ width:auto; min-width:0; border:0; background:transparent; color:var(--md-default-fg-color); display:grid; grid-template-columns:18px max-content 16px; gap:7px; align-items:center; padding:7px 8px; border-radius:10px; font:inherit; font-size:.64rem; font-weight:400; line-height:1.15; text-align:left; cursor:pointer; box-sizing:border-box; }
.mk-page-action-item span{ white-space:nowrap; min-width:0; }
.mk-page-action-item:hover{ background:color-mix(in srgb, var(--md-default-fg-color) 7%, transparent); }
.mk-page-action-item.is-active{ font-weight:400; }
.mk-page-action-separator{ height:1px; margin:5px 6px; background:color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); }
.mk-page-edit-modal{ overscroll-behavior:contain; touch-action:none; }
.mk-page-edit-modal .mk-local-mini-panel{ width:min(1080px,calc(100vw - 36px)); max-height:min(88dvh,calc(100vh - 28px)); touch-action:auto; overscroll-behavior:contain; }
.mk-page-edit-body{ display:grid; grid-template-rows:auto minmax(280px,1fr) auto; gap:10px; min-height:min(620px,62vh); }
.mk-page-edit-meta{ display:grid; gap:6px; font-size:.68rem; line-height:1.35; color:var(--md-default-fg-color--light); }
.mk-page-edit-meta code{ font-size:.64rem; padding:.12rem .32rem; border-radius:999px; background:color-mix(in srgb,var(--md-default-fg-color) 7%,transparent); }
.mk-page-edit-source-error{ border:1px solid color-mix(in srgb,#f59e0b 62%,var(--md-default-fg-color) 16%); border-radius:14px; padding:10px 12px; background:color-mix(in srgb,#f59e0b 12%,var(--md-default-bg-color) 88%); color:var(--md-default-fg-color); font-size:.68rem; line-height:1.42; display:grid; gap:6px; overflow-wrap:anywhere; }
.mk-page-edit-source-error strong{ font-size:.74rem; }
.mk-page-edit-source-error dl{ display:grid; grid-template-columns:max-content minmax(0,1fr); column-gap:10px; row-gap:4px; margin:0; }
.mk-page-edit-source-error dt{ color:var(--md-default-fg-color--light); font-weight:800; }
.mk-page-edit-source-error dd{ margin:0; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.63rem; white-space:pre-wrap; }
.mk-page-edit-source-error .mk-page-edit-source-hint{ color:var(--md-default-fg-color--light); }
.mk-page-edit-textarea{ width:100%; height:100%; min-height:280px; resize:none; box-sizing:border-box; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 16%,transparent); border-radius:14px; background:color-mix(in srgb,var(--md-default-bg-color) 96%,var(--md-primary-fg-color) 4%); color:var(--md-default-fg-color); padding:12px 13px; font:500 .72rem/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; tab-size:2; }
.mk-page-edit-note{ width:100%; min-height:56px; resize:vertical; box-sizing:border-box; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 14%,transparent); border-radius:12px; background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); color:inherit; padding:9px 10px; font:inherit; font-size:.70rem; line-height:1.35; }
.mk-page-edit-actions{ display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
.mk-page-edit-status{ font-size:.68rem; color:var(--md-default-fg-color--light); margin-right:auto; align-self:center; }
.mk-page-edit-admin-list{ display:grid; gap:10px; max-height:min(62dvh,620px); overflow:auto; padding-right:4px; }
.mk-page-edit-admin-card{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 13%,transparent); border-radius:16px; padding:11px 12px; background:color-mix(in srgb,var(--md-default-bg-color) 94%,var(--md-primary-fg-color) 6%); display:grid; gap:8px; }
.mk-page-edit-admin-title{ display:flex; align-items:baseline; justify-content:space-between; gap:10px; flex-wrap:wrap; font-weight:850; }
.mk-page-edit-admin-meta{ font-size:.65rem; color:var(--md-default-fg-color--light); line-height:1.35; overflow-wrap:anywhere; }
.mk-page-edit-admin-note{ font-size:.68rem; line-height:1.4; padding:8px 9px; border-radius:12px; background:color-mix(in srgb,var(--md-default-fg-color) 5%,transparent); }
.mk-page-edit-admin-preview{ width:100%; min-height:130px; max-height:240px; overflow:auto; box-sizing:border-box; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); border-radius:12px; background:color-mix(in srgb,var(--md-default-bg-color) 98%,black 2%); padding:9px 10px; font:500 .62rem/1.42 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; white-space:pre; }
.mk-page-edit-admin-actions{ display:flex; gap:7px; flex-wrap:wrap; justify-content:flex-end; }
@media (max-width:720px){ .mk-page-edit-modal .mk-local-mini-panel{ width:calc(100vw - 20px); max-height:min(91dvh,calc(100vh - 20px)); } .mk-page-edit-body{ min-height:min(620px,68dvh); grid-template-rows:auto minmax(240px,1fr) auto; } .mk-page-edit-actions{ justify-content:stretch; } .mk-page-edit-actions .mk-comment-small-btn{ flex:1 1 auto; } }
.mk-fav-h1-btn.has-actions{ color:var(--md-accent-fg-color,#d97706); border-color:var(--mk-theme-comment-border, rgba(217,119,6,.45)); background:var(--mk-theme-comment-card-bg, rgba(217,119,6,.10)); }
html[data-md-color-scheme="slate"] .mk-fav-h1-btn.has-actions,
body[data-md-color-scheme="slate"] .mk-fav-h1-btn.has-actions,
[data-md-color-scheme="slate"] .mk-fav-h1-btn.has-actions{
  color:rgba(255,255,255,.96) !important;
}
html[data-md-color-scheme="slate"] .mk-fav-h1-btn.has-actions svg,
body[data-md-color-scheme="slate"] .mk-fav-h1-btn.has-actions svg,
[data-md-color-scheme="slate"] .mk-fav-h1-btn.has-actions svg,
html[data-md-color-scheme="slate"] .mk-fav-h1-btn.has-actions svg *,
body[data-md-color-scheme="slate"] .mk-fav-h1-btn.has-actions svg *,
[data-md-color-scheme="slate"] .mk-fav-h1-btn.has-actions svg *{
  color:rgba(255,255,255,.96) !important;
  stroke:currentColor !important;
  filter:none !important;
  opacity:1 !important;
}
.mk-fav-h1-btn.is-slate-scheme,
.mk-fav-h1-btn.is-slate-scheme.has-actions{
  color:rgba(255,255,255,.96) !important;
}
.mk-fav-h1-btn.is-slate-scheme svg,
.mk-fav-h1-btn.is-slate-scheme svg *{
  color:rgba(255,255,255,.96) !important;
  stroke:currentColor !important;
  filter:none !important;
  opacity:1 !important;
}
.mk-local-profile-public{ display:flex; align-items:flex-start; gap:8px; font-size:.74rem; line-height:1.35; opacity:.9; margin:4px 0; }
.mk-local-profile-sync{ margin-top:12px; padding-top:12px; border-top:1px solid color-mix(in srgb, var(--md-default-fg-color) 12%, transparent); }

.mk-public-profile-section{ border:1px solid color-mix(in srgb, var(--md-default-fg-color) 12%, transparent); border-radius:14px; margin:.6rem 0; background:color-mix(in srgb, var(--md-default-fg-color) 3%, transparent); overflow:hidden; }
.mk-public-profile-section summary{ cursor:pointer; list-style:none; padding:.65rem .85rem; font-size:.88rem; font-weight:700; display:flex; align-items:center; justify-content:space-between; gap:.8rem; }
.mk-public-profile-section summary::-webkit-details-marker{ display:none; }
.mk-public-profile-section summary::after{ content:"›"; font-size:.78rem; line-height:1; opacity:.58; transform:rotate(0deg); transition:transform .14s ease; flex:0 0 auto; }
.mk-public-profile-section[open] summary::after{ transform:rotate(90deg); }
.mk-public-profile-section-body{ padding:0 .75rem .75rem; }
.mk-public-profile-section-body .mk-local-activity-row{ margin:.45rem 0; }

/* Public profile modal: lock the background.  A section only becomes an
   inner scroll card when it actually has enough content to need one. */
.mk-public-profile-modal{
  overflow:hidden !important;
  touch-action:none !important;
}
.mk-public-profile-modal .mk-local-activity-panel{
  overflow:hidden !important;
  height:auto !important;
  max-height:min(88dvh, calc(100vh - 36px)) !important;
}
.mk-public-profile-modal .mk-local-activity-body{
  flex:0 1 auto !important;
  min-height:0 !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  touch-action:pan-y !important;
  padding-bottom:18px !important;
  display:block !important;
}
.mk-public-profile-modal .mk-public-profile-section[open]{
  display:block !important;
  height:auto !important;
  min-height:0 !important;
  max-height:none !important;
  overflow:hidden !important;
}
.mk-public-profile-modal .mk-public-profile-section[open] > .mk-public-profile-section-body{
  display:block !important;
  height:auto !important;
  min-height:0 !important;
  max-height:none !important;
  overflow:visible !important;
  padding:.55rem .75rem .9rem !important;
}
.mk-public-profile-modal .mk-public-profile-section.mk-public-profile-section--scroll[open] > .mk-public-profile-section-body{
  max-height:min(56vh, 560px) !important;
  overflow-y:scroll !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  touch-action:pan-y !important;
  scrollbar-gutter:stable;
  scrollbar-width:thin;
}
.mk-public-profile-modal .mk-public-profile-section-body::-webkit-scrollbar{
  width:8px;
}
.mk-public-profile-modal .mk-public-profile-section-body::-webkit-scrollbar-thumb{
  border-radius:999px;
  background:color-mix(in srgb, var(--md-default-fg-color) 28%, transparent);
}
@media (min-width:721px){
  .mk-public-profile-modal .mk-local-activity-panel{
    width:min(860px, calc(100vw - 36px)) !important;
    max-height:calc(100vh - 36px) !important;
  }
}
/* Anchor the public profile modal to the top of the visual viewport. The
   default bottom-anchored layout tracks the document bottom, so the panel
   sinks when the iOS address bar collapses; a fixed top keeps it stable. */
@media (max-width:720px), (pointer:coarse){
  .mk-local-activity-modal.mk-public-profile-modal{
    align-items:flex-start !important;
    /* Header row + tabs row are ~102px tall; sit the panel just below them. */
    padding-top:calc(env(safe-area-inset-top, 0px) + 110px) !important;
  }
}
@media (max-width:720px){
  .mk-public-profile-modal .mk-local-activity-panel{
    max-height:calc(100vh - env(safe-area-inset-top, 0px) - 124px) !important;
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100dvh)) - env(safe-area-inset-top, 0px) - 124px) !important;
  }
  .mk-public-profile-modal .mk-public-profile-section[open] > .mk-public-profile-section-body{
    padding:.45rem .65rem .85rem !important;
  }
  .mk-public-profile-modal .mk-public-profile-section.mk-public-profile-section--scroll[open] > .mk-public-profile-section-body{
    max-height:min(48svh, 430px) !important;
  }
}
.mk-local-profile-sync h3,.mk-public-profile-modal h3{ margin:.45rem 0 .35rem; font-size:.82rem; }
.mk-local-profile-sync-out{ margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; align-items:center; font-size:.78rem; }
.mk-local-profile-main-row{ display:grid; grid-template-columns:auto minmax(170px,max-content) minmax(300px,1fr); gap:18px; align-items:center; padding:12px 16px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:16px; background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); min-width:0; overflow:hidden; }
.mk-local-profile-avatar-cell{ display:flex; align-items:center; justify-content:center; min-width:0; }
.mk-local-profile-content-cell{ display:grid; gap:10px; min-width:0; align-content:center; }
.mk-local-profile-identity-cell{ display:flex; align-items:center; min-width:0; }
.mk-local-profile-topline{ display:grid; grid-template-columns:minmax(0,max-content) minmax(180px,1fr); gap:16px; align-items:center; min-width:0; }
.mk-local-profile-action-row{ display:flex; align-items:center; gap:8px; min-width:0; flex-wrap:wrap; padding:0 4px; margin-top:-4px; }
.mk-local-inline-change.mk-account-scan-inline-btn{ display:none !important; }
.mk-account-scan-inline-btn{ display:none !important; }
.mk-account-qr-modal-box{ display:flex; align-items:center; justify-content:center; min-height:280px; padding:4px; box-sizing:border-box; }
.mk-account-qr-modal-img{ width:min(260px,76vw); height:min(260px,76vw); border-radius:18px; background:#fff; padding:12px; box-sizing:border-box; display:block; box-shadow:0 16px 44px rgba(0,0,0,.16); }
.mk-account-qr-modal-loading{ font-size:.78rem; opacity:.72; }
.mk-account-qr-link{ display:block; max-width:160px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:.70; font-size:.56rem; color:inherit !important; text-decoration:none !important; }
.mk-account-qr-scan-box{ display:grid; gap:10px; }
.mk-account-qr-status{ font-size:.72rem; line-height:1.35; opacity:.78; }
.mk-account-qr-status.is-error{ color:#dc2626; opacity:1; font-weight:760; }
.mk-account-qr-video{ width:100%; max-height:320px; object-fit:cover; border-radius:14px; background:#111827; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 14%,transparent); }
.mk-account-qr-manual{ width:100%; box-sizing:border-box; min-height:74px; resize:vertical; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); border-radius:12px; padding:.58rem .65rem; background:var(--md-default-bg-color); color:var(--md-default-fg-color); font:inherit; font-size:.72rem; line-height:1.35; }

.mk-local-profile-name-cell{ display:flex; align-items:center; gap:8px; min-width:0; justify-content:flex-start; flex-wrap:wrap; }
.mk-local-profile-bio-cell{ display:flex; align-items:center; justify-content:flex-end; min-width:0; justify-self:stretch; }
.mk-local-profile-bio{ min-width:0; width:100%; max-width:none; font-size:.70rem; line-height:1.34; opacity:.78; overflow-wrap:anywhere; text-align:right; }
.mk-local-profile-bio.is-empty{ opacity:.48; font-style:italic; }
.mk-local-profile-bio-input{ width:100%; box-sizing:border-box; min-height:82px; resize:vertical; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); border-radius:12px; padding:.62rem .7rem; background:var(--md-default-bg-color); color:var(--md-default-fg-color); font:inherit; line-height:1.35; }
.mk-public-profile-preview{ display:grid; grid-template-columns:auto minmax(0,.9fr) minmax(180px,1.4fr) auto; align-items:center; gap:12px; }
.mk-public-profile-main{ min-width:0; }
.mk-public-profile-bio{ min-width:0; font-size:.73rem; line-height:1.35; opacity:.76; overflow-wrap:anywhere; }
.mk-public-profile-bio.is-empty{ opacity:.42; font-style:italic; }
.mk-public-profile-modal[data-public-profile-theme] .mk-local-activity-head{
  position:relative;
  overflow:hidden;
  isolation:isolate;
  color:rgba(255,255,255,.96) !important;
}
.mk-public-profile-modal[data-public-profile-theme] .mk-local-activity-head::before{
  content:"";
  position:absolute;
  inset:0;
  background-image:var(--mk-public-profile-theme-header-image);
  background-size:cover;
  background-position:var(--mk-public-profile-theme-header-position, center);
  background-repeat:no-repeat;
  filter:blur(var(--mk-public-profile-theme-header-blur, 0px)) saturate(1.08);
  transform:none;
  z-index:-2;
}
.mk-public-profile-modal[data-public-profile-theme] .mk-local-activity-head::after{
  content:"";
  position:absolute;
  inset:0;
  background:var(--mk-public-profile-theme-header-overlay, rgba(7,30,19,.30));
  pointer-events:none;
  z-index:-1;
}
.mk-public-profile-modal[data-public-profile-theme] .mk-local-activity-head :is(.mk-local-activity-title,.mk-local-activity-sub,.mk-comment-icon-btn){
  color:rgba(255,255,255,.96) !important;
  text-shadow:0 1px 2px rgba(0,0,0,.32);
}
.mk-public-profile-modal[data-public-profile-theme] .mk-local-activity-body{
  position:relative;
  isolation:isolate;
  background:color-mix(in srgb, var(--md-default-bg-color) 62%, transparent) !important;
}
.mk-public-profile-modal[data-public-profile-theme] .mk-local-activity-body::before{
  content:"";
  position:absolute;
  inset:-24px;
  pointer-events:none;
  background-image:var(--mk-public-profile-theme-bg-image);
  background-size:cover;
  background-position:var(--mk-public-profile-theme-bg-position, center);
  background-repeat:no-repeat;
  filter:blur(var(--mk-public-profile-theme-bg-blur, 4px)) saturate(1.08);
  opacity:var(--mk-public-profile-theme-bg-opacity, .42);
  transform:scale(1.025);
  z-index:0;
}
.mk-public-profile-modal[data-public-profile-theme] .mk-local-activity-body > *{
  position:relative;
  z-index:1;
}
.mk-public-profile-modal[data-public-profile-theme] :is(.mk-local-profile-card,.mk-public-profile-section){
  background:color-mix(in srgb, var(--md-default-bg-color) 74%, transparent) !important;
  border-color:color-mix(in srgb, var(--md-accent-fg-color) 24%, transparent) !important;
  box-shadow:0 14px 34px rgba(8,33,22,.10);
}
.mk-public-profile-modal[data-public-profile-palette-theme] .mk-local-activity-head{
  background:var(--mk-public-profile-palette-header) !important;
  color:var(--mk-public-profile-palette-header-fg,rgba(255,255,255,.97)) !important;
}
.mk-public-profile-modal[data-public-profile-palette-theme] .mk-local-activity-head :is(.mk-local-activity-title,.mk-local-activity-sub,.mk-comment-icon-btn){
  color:var(--mk-public-profile-palette-header-fg,rgba(255,255,255,.97)) !important;
  text-shadow:0 1px 2px rgba(0,0,0,.28);
}
.mk-public-profile-modal[data-public-profile-palette-theme] .mk-local-activity-body{
  background:var(--mk-public-profile-palette-body) !important;
  color:var(--mk-public-profile-palette-body-fg,var(--md-default-fg-color)) !important;
}
.mk-public-profile-modal[data-public-profile-palette-theme] :is(.mk-local-profile-card,.mk-public-profile-section){
  background:var(--mk-public-profile-palette-card) !important;
  border-color:var(--mk-public-profile-palette-border) !important;
  color:var(--mk-public-profile-palette-body-fg,var(--md-default-fg-color)) !important;
  box-shadow:0 14px 34px color-mix(in srgb,var(--mk-public-profile-palette-accent) 12%,transparent);
}
.mk-public-profile-modal[data-public-profile-palette-theme] :is(a,.mk-public-profile-section > summary){
  color:var(--mk-public-profile-palette-accent) !important;
}
.mk-public-profile-modal[data-public-profile-palette-mode="slate"] :is(input,textarea,select){
  background:rgba(5,10,18,.58) !important;
  color:var(--mk-public-profile-palette-body-fg,#fff) !important;
  border-color:var(--mk-public-profile-palette-border,rgba(255,255,255,.20)) !important;
}
.mk-public-profile-modal[data-public-profile-palette-mode="slate"] :is(.mk-comment-small-btn,.mk-comment-primary-btn){
  background:color-mix(in srgb,var(--mk-public-profile-palette-accent) 18%,rgba(5,10,18,.82)) !important;
  color:var(--mk-public-profile-palette-body-fg,#fff) !important;
  border-color:var(--mk-public-profile-palette-border,rgba(255,255,255,.20)) !important;
}
.mk-public-profile-theme-shortcut{
  background:transparent !important;
  border:0 !important;
  box-shadow:none !important;
  padding:0 !important;
  width:1.35rem !important;
  height:1.35rem !important;
  min-width:1.35rem !important;
  border-radius:0 !important;
  opacity:.94;
}
.mk-public-profile-theme-shortcut[hidden]{ display:none !important; }
.mk-public-profile-theme-shortcut:hover,
.mk-public-profile-theme-shortcut:focus-visible{
  opacity:1;
  background:transparent !important;
}
.mk-public-profile-theme-shortcut .mk-exact-clothes-icon,
.mk-public-profile-theme-shortcut svg{
  width:1.05rem !important;
  height:1.05rem !important;
}
@media (max-width: 680px){ .mk-public-profile-preview{ grid-template-columns:auto minmax(0,1fr) auto; } .mk-public-profile-bio{ grid-column:2 / -1; } }
.mk-local-level-badge{ appearance:none; position:relative; overflow:hidden; border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 48%,transparent); background:color-mix(in srgb,var(--md-accent-fg-color) 10%,transparent); color:var(--md-default-fg-color); border-radius:999px; padding:.30rem .62rem; display:inline-flex; align-items:center; gap:5px; font:inherit; line-height:1; cursor:pointer; white-space:nowrap; isolation:isolate; }
.mk-local-level-badge-fill{ position:absolute; inset:0 auto 0 0; width:0%; max-width:100%; border-radius:inherit; background:linear-gradient(90deg, color-mix(in srgb,var(--md-accent-fg-color) 24%,transparent), color-mix(in srgb,var(--md-accent-fg-color) 14%,transparent)); z-index:-1; pointer-events:none; transition:width .18s ease; }
.mk-local-level-badge strong{ font-size:.68rem; font-weight:850; letter-spacing:.01em; }
.mk-local-level-badge .mk-local-level-badge-xp{ font-size:.58rem; opacity:.72; }
.mk-local-level-badge:hover{ border-color:var(--md-accent-fg-color); background:color-mix(in srgb,var(--md-accent-fg-color) 16%,transparent); }
.mk-local-inline-change{ appearance:none; display:inline-flex; align-items:center; justify-content:center; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 15%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); color:inherit; border-radius:999px; padding:.38rem .72rem; font:inherit; font-size:.68rem; line-height:1.05; cursor:pointer; white-space:nowrap; }
.mk-local-inline-change svg{ display:none !important; }
.mk-local-inline-change:hover{ background:color-mix(in srgb,var(--md-default-fg-color) 7%,transparent); }
.mk-local-profile-main-row .mk-comment-avatar{ width:2.35rem; height:2.35rem; min-width:2.35rem; font-size:.92rem; }
.mk-local-profile-change-btn{ width:2rem !important; min-width:2rem !important; height:2rem !important; }
.mk-local-sync-card{ display:grid; gap:10px; border-top:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); padding-top:14px; }
.mk-local-sync-card h3{ font-size:1.02rem; line-height:1.2; margin:.15rem 0 .2rem; font-weight:800; }
.mk-local-sync-row{ display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; gap:12px; padding:10px 0; }
.mk-local-sync-row + .mk-local-sync-row{ border-top:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); }
.mk-local-sync-title{ font-weight:400; font-size:.74rem; line-height:1.3; opacity:.76; }
/* Compact account sync panel. Keep these selectors specific so older profile-sync styles cannot enlarge this card. */
.mk-account-sync-card{ gap:9px; }
.mk-account-sync-card h3{ font-size:18px; line-height:1.25; margin:.1rem 0 .15rem; font-weight:800; }
.mk-account-sync-hero{ display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; gap:12px; padding:10px 12px; border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 25%,transparent); border-radius:14px; background:linear-gradient(135deg,color-mix(in srgb,var(--md-accent-fg-color) 9%,transparent),color-mix(in srgb,var(--md-default-fg-color) 3%,transparent)); }
.mk-account-sync-hero-text{ display:grid; gap:2px; min-width:0; }
.mk-account-sync-hero-text strong{ font-size:15px !important; line-height:1.2 !important; font-weight:760 !important; letter-spacing:0 !important; padding:0 !important; background:none !important; }
.mk-account-sync-hero-text small{ font-size:13px; line-height:1.32; opacity:.68; max-width:760px; }
.mk-account-sync-main-btn{ appearance:none !important; border:0 !important; background:var(--md-accent-fg-color) !important; color:var(--md-accent-bg-color) !important; border-radius:999px !important; padding:7px 13px !important; min-height:32px !important; height:32px !important; min-width:86px !important; width:auto !important; max-width:max-content !important; font:inherit !important; font-size:var(--mk-local-body-size) !important; font-weight:760 !important; line-height:1 !important; cursor:pointer !important; box-shadow:0 6px 16px color-mix(in srgb,var(--md-accent-fg-color) 14%,transparent) !important; display:inline-flex !important; align-items:center !important; justify-content:center !important; justify-self:end !important; align-self:center !important; white-space:nowrap !important; }
.mk-account-sync-main-btn:hover{ filter:brightness(1.04); transform:translateY(-1px); }
.mk-account-sync-main-btn:disabled{ opacity:.62; cursor:progress; transform:none; }
.mk-account-sync-main-btn.is-loading{ gap:7px !important; min-width:104px !important; }
.mk-account-sync-main-btn.is-loading svg{ animation:mk-account-sync-spin .8s linear infinite; }
@keyframes mk-account-sync-spin{ to{ transform:rotate(360deg); } }
.mk-account-sync-progress{ display:grid; gap:5px; padding:0 2px; }
.mk-account-sync-progress-bar{ height:5px; overflow:hidden; border-radius:999px; background:color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); }
.mk-account-sync-progress-bar span{ display:block; height:100%; width:0%; border-radius:999px; background:var(--md-accent-fg-color); transition:width .20s ease; }
.mk-account-sync-progress-label{ font-size:12px; line-height:1.3; opacity:.68; }
.mk-account-sync-progress-detail{ margin-top:3px; font-size:.72rem; line-height:1.35; opacity:.72; word-break:break-word; }
.mk-account-sync-progress.is-error .mk-account-sync-progress-bar span{ background:var(--md-code-hl-number-color); }
.mk-account-sync-top{ display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; align-items:stretch; }
.mk-account-sync-output{ margin-top:0; display:block; font-size:13px; line-height:1.35; min-width:0; }
.mk-account-sync-steps-card{ display:grid; gap:7px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:14px; padding:9px 10px; background:color-mix(in srgb,var(--md-default-fg-color) 2.5%,transparent); }
.mk-account-sync-steps{ display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:6px; margin:0; padding:0; list-style:none; }
.mk-account-sync-step{ display:grid; justify-items:center; gap:4px; color:color-mix(in srgb,var(--md-default-fg-color) 46%,transparent); font-size:.61rem; line-height:1.05; min-width:0; text-align:center; }
.mk-account-sync-step-icon{ width:21px; height:21px; border-radius:999px; display:inline-grid; place-items:center; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 22%,transparent); font-size:.68rem; font-weight:850; color:inherit; background:color-mix(in srgb,var(--md-default-bg-color) 88%,transparent); }
.mk-account-sync-step-copy{ display:block; min-width:0; width:100%; }
.mk-account-sync-step strong{ display:block; font-size:.56rem; line-height:1.05; color:inherit; font-weight:760; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.mk-account-sync-step small{ display:none !important; }
.mk-account-sync-step.is-active{ color:var(--md-accent-fg-color); }
.mk-account-sync-step.is-active .mk-account-sync-step-icon{ border-color:var(--md-accent-fg-color); box-shadow:0 0 0 3px color-mix(in srgb,var(--md-accent-fg-color) 12%,transparent); }
.mk-account-sync-step.is-done{ color:var(--md-accent-fg-color); }
.mk-account-sync-step.is-done .mk-account-sync-step-icon{ background:var(--md-accent-fg-color); border-color:var(--md-accent-fg-color); color:var(--md-accent-bg-color); }
.mk-account-sync-step.is-error{ color:var(--md-code-hl-number-color); }
.mk-account-sync-step.is-error .mk-account-sync-step-icon{ background:var(--md-code-hl-number-color); border-color:var(--md-code-hl-number-color); color:var(--md-default-bg-color); }
.mk-account-sync-step-detail{ min-height:18px; font-size:12px; line-height:1.35; opacity:.72; overflow-wrap:anywhere; }
.mk-account-sync-step-detail.is-error{ color:var(--md-code-hl-number-color); opacity:1; font-weight:720; }
.mk-account-sync-output strong{ letter-spacing:0 !important; padding:0 !important; background:none !important; border-radius:0 !important; }
.mk-account-sync-run-meta{ font-size:12px; line-height:1.35; opacity:.72; padding:0 1px; overflow-wrap:anywhere; }
.mk-account-sync-advanced{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); border-radius:12px; background:color-mix(in srgb,var(--md-default-fg-color) 2%,transparent); overflow:hidden; }
.mk-account-sync-advanced > summary{ cursor:pointer; padding:8px 10px; font-size:12px; line-height:1.25; font-weight:760; opacity:.72; list-style:none; }
.mk-account-sync-advanced > summary::-webkit-details-marker{ display:none; }
.mk-account-sync-advanced > summary::after{ content:"⌄"; float:right; opacity:.58; }
.mk-account-sync-advanced[open] > summary::after{ content:"⌃"; }
.mk-account-sync-advanced .mk-account-sync-interval-card{ border:0 !important; border-top:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent) !important; border-radius:0 !important; background:transparent !important; }
.mk-account-sync-interval-card{
  display:grid !important;
  gap:7px !important;
  border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent) !important;
  border-radius:14px !important;
  padding:10px 12px 11px !important;
  background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent) !important;
  min-width:0 !important;
}
.mk-account-sync-interval-card.is-off{
  border-color:color-mix(in srgb,var(--md-default-fg-color) 14%,transparent) !important;
  background:color-mix(in srgb,var(--md-default-fg-color) 2%,transparent) !important;
}
.mk-account-sync-interval-card--inline{
  padding:8px 10px 9px !important;
  gap:5px !important;
}
.mk-account-sync-interval-card--inline .mk-account-sync-interval-hint{
  display:none !important;
}
.mk-account-sync-interval-head{
  display:grid !important;
  grid-template-columns:minmax(0,1fr) auto !important;
  align-items:start !important;
  gap:10px !important;
  min-width:0 !important;
}
.mk-account-sync-interval-copy{ display:grid !important; gap:2px !important; min-width:0 !important; }
.mk-account-sync-interval-copy strong{
  font-size:13px !important;
  line-height:1.25 !important;
  font-weight:760 !important;
  letter-spacing:0 !important;
  padding:0 !important;
  background:none !important;
  border-radius:0 !important;
}
.mk-account-sync-interval-copy small{
  font-size:12px !important;
  line-height:1.32 !important;
  opacity:.62 !important;
}
.mk-account-sync-interval-value{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 30%,transparent) !important;
  background:color-mix(in srgb,var(--md-accent-fg-color) 10%,transparent) !important;
  color:var(--md-default-fg-color) !important;
  border-radius:999px !important;
  padding:4px 8px !important;
  min-width:54px !important;
  font-size:11px !important;
  font-weight:760 !important;
  line-height:1 !important;
  white-space:nowrap !important;
}
.mk-account-sync-interval-card.is-off .mk-account-sync-interval-value{
  border-color:color-mix(in srgb,var(--md-default-fg-color) 16%,transparent) !important;
  background:color-mix(in srgb,var(--md-default-fg-color) 5%,transparent) !important;
}
.mk-account-sync-interval-slider{
  width:100% !important;
  min-width:0 !important;
  height:26px !important;
  accent-color:var(--md-accent-fg-color) !important;
  cursor:pointer !important;
}
.mk-account-sync-interval-ticks{
  position:relative !important;
  display:block !important;
  height:18px !important;
  font-size:10px !important;
  line-height:1.15 !important;
  opacity:.58 !important;
  user-select:none !important;
}
.mk-account-sync-interval-ticks span{
  position:absolute !important;
  top:0 !important;
  transform:translateX(-50%) !important;
  white-space:nowrap !important;
  text-align:center !important;
}
.mk-account-sync-interval-ticks span:first-child{ transform:translateX(0) !important; text-align:left !important; }
.mk-account-sync-interval-ticks span:nth-last-child(2){ transform:translateX(-72%) !important; text-align:right !important; }
.mk-account-sync-interval-ticks span:last-child{ transform:translateX(-100%) !important; text-align:right !important; font-weight:760 !important; }
.mk-account-sync-interval-hint{
  font-size:12px !important;
  line-height:1.35 !important;
  opacity:.66 !important;
  overflow-wrap:anywhere !important;
}
.mk-account-sync-interval-card--compact{
  display:grid !important;
  grid-template-columns:minmax(135px,.42fr) minmax(180px,1fr) auto !important;
  align-items:center !important;
  gap:10px !important;
  padding:8px 10px !important;
}
.mk-account-sync-interval-card--compact .mk-account-sync-interval-head{ display:block !important; min-width:0 !important; }
.mk-account-sync-interval-card--compact .mk-account-sync-interval-copy strong{ font-size:12px !important; }
.mk-account-sync-interval-card--compact .mk-account-sync-interval-copy small{ display:none !important; }
.mk-account-sync-interval-card--compact .mk-account-sync-interval-slider{ height:22px !important; }
.mk-account-sync-interval-card--compact .mk-account-sync-interval-ticks,
.mk-account-sync-interval-card--compact .mk-account-sync-interval-hint{ display:none !important; }
.mk-account-sync-interval-card--compact .mk-account-sync-interval-value{ justify-self:end !important; min-width:48px !important; }
@media (max-width:720px), (pointer:coarse){
  .mk-account-sync-interval-card{ padding:9px 10px 10px !important; }
  .mk-account-sync-interval-head{ grid-template-columns:1fr auto !important; gap:8px !important; }
  .mk-account-sync-interval-hint{ font-size:11px !important; }
}
.mk-account-sync-status-card{ display:grid; gap:9px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:14px; padding:11px 12px; background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); }
.mk-account-sync-top .mk-account-sync-status-card{ height:100%; box-sizing:border-box; }
.mk-account-sync-top .mk-account-sync-main-btn{ align-self:center !important; justify-self:end !important; min-height:42px !important; height:42px !important; padding:0 18px !important; }
.mk-account-sync-status-head{ display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; align-items:start; }
.mk-account-sync-status-head.is-single{ grid-template-columns:1fr; }
.mk-account-sync-status-copy{ display:grid; gap:3px; min-width:0; }
.mk-account-sync-eyebrow{ display:block; font-size:10px; line-height:1; opacity:.48; text-transform:uppercase; letter-spacing:.055em; font-weight:760; }
.mk-account-sync-status-copy strong{ display:block; font-size:14px !important; line-height:1.25 !important; font-weight:760 !important; overflow-wrap:anywhere; }
.mk-account-sync-status-copy small{ display:block; font-size:12px; line-height:1.35; opacity:.58; overflow-wrap:anywhere; }
.mk-account-sync-status-copy em{ display:block; margin-top:2px; font-style:normal; font-size:11.5px; line-height:1.3; opacity:.62; overflow-wrap:anywhere; }
.mk-account-sync-status-card.is-error .mk-account-sync-state-pill{ border-color:color-mix(in srgb,var(--md-code-hl-number-color) 42%,transparent); background:color-mix(in srgb,var(--md-code-hl-number-color) 12%,transparent); }
.mk-account-sync-state-pill{ display:inline-flex; align-items:center; justify-content:center; border-radius:999px; border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 30%,transparent); background:color-mix(in srgb,var(--md-accent-fg-color) 10%,transparent); padding:4px 8px; font-size:11px; font-weight:720; line-height:1; white-space:nowrap; color:var(--md-default-fg-color); }
.mk-account-sync-status-card.is-empty .mk-account-sync-state-pill{ border-color:color-mix(in srgb,var(--md-default-fg-color) 14%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 5%,transparent); opacity:.75; }
.mk-account-sync-status-grid{ display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:6px; }
.mk-account-sync-status-grid div{ min-width:0; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); border-radius:10px; padding:6px 7px; background:color-mix(in srgb,var(--md-default-fg-color) 2%,transparent); }
.mk-account-sync-status-grid span{ display:block; font-size:10.5px; line-height:1.15; opacity:.50; text-transform:uppercase; letter-spacing:.035em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mk-account-sync-status-grid strong{ display:block; margin-top:2px; font-size:14px !important; line-height:1.15 !important; font-weight:720 !important; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; letter-spacing:0 !important; }
.mk-account-sync-device-setup{ border-top:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); padding-top:6px; }
.mk-account-sync-device-setup > summary{ cursor:pointer; font-size:13px; font-weight:700; opacity:.70; padding:5px 0; }
.mk-account-sync-device-body{ display:grid; gap:0; padding-top:3px; }
@media (max-width:720px){ .mk-account-sync-hero{ grid-template-columns:1fr; align-items:start; padding:10px; } .mk-account-sync-main-btn{ width:100%; } .mk-account-sync-status-head{ grid-template-columns:1fr; } .mk-account-sync-state-pill{ justify-self:start; } .mk-account-sync-status-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
.mk-local-mini-modal{ position:fixed; inset:0; z-index:2147483400; display:flex; align-items:center; justify-content:center; padding:18px; background:rgba(12,16,24,.42); box-sizing:border-box; }
.mk-local-mini-panel{ width:min(440px,100%); max-height:calc(100vh - 36px); overflow:auto; overflow-x:hidden; border-radius:20px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 14%,transparent); background:var(--md-default-bg-color); color:var(--md-default-fg-color); box-shadow:0 24px 70px rgba(0,0,0,.26); padding:16px; display:grid; gap:12px; box-sizing:border-box; }
.mk-level-modal{ z-index:2147483450; align-items:flex-start; padding-top:18px; padding-bottom:18px; }
.mk-level-panel{ width:min(940px,calc(100vw - 36px)); max-height:calc(100vh - 36px); padding:0 !important; overflow:hidden !important; display:flex !important; flex-direction:column; gap:0 !important; }
.mk-level-panel > .mk-local-mini-head{ flex:0 0 auto; position:relative; z-index:40; margin:0; padding:16px 16px 14px; border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); background:color-mix(in srgb,var(--md-default-bg-color) 96%,var(--md-default-fg-color) 4%); box-shadow:0 8px 18px rgba(0,0,0,.10); }
.mk-level-panel > .mk-local-mini-body{ flex:1 1 auto; min-height:0; overflow-y:auto !important; overflow-x:hidden !important; -webkit-overflow-scrolling:touch; overscroll-behavior:contain; padding:14px 16px 16px; box-sizing:border-box; }
.mk-level-modal-body{ gap:14px; }
.mk-level-loading-card{ min-height:260px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; text-align:center; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:18px; background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); padding:22px; }
.mk-level-loading-card strong{ font-size:.9rem; line-height:1.25; }
.mk-level-loading-card span{ font-size:.70rem; line-height:1.35; opacity:.68; max-width:28rem; }
.mk-level-summary-card{ display:grid; grid-template-columns:minmax(0,1fr) max-content; gap:12px; align-items:stretch; border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 26%,transparent); border-radius:18px; padding:12px; background:color-mix(in srgb,var(--md-accent-fg-color) 8%,transparent); }
.mk-level-summary-block{ min-width:0; display:grid; align-content:start; gap:7px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); border-radius:15px; padding:10px 12px; background:color-mix(in srgb,var(--md-default-bg-color) 70%,transparent); }
.mk-level-summary-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; min-width:0; }
.mk-level-kicker{ font-size:.68rem; opacity:.70; line-height:1.2; margin-bottom:3px; font-weight:650; }
.mk-level-current{ font-size:1.28rem; line-height:1.08; font-weight:900; }
.mk-level-total{ display:grid; gap:3px; text-align:right; white-space:nowrap; }
.mk-level-total strong{ font-size:.92rem; line-height:1.1; }
.mk-level-total span{ font-size:.64rem; opacity:.72; }
.mk-level-progress{ position:relative; height:12px; border-radius:999px; background:color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); overflow:hidden; box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); }
.mk-level-progress-seg{ position:absolute; top:0; bottom:0; left:0; border-radius:0; transition:width .18s ease,left .18s ease; }
.mk-level-progress-before{ background:color-mix(in srgb,#2563eb 76%,transparent); border-radius:999px 0 0 999px; }
.mk-level-progress-today{ background:linear-gradient(90deg, #10b981, #22c55e); border-radius:0 999px 999px 0; box-shadow:none; }
.mk-level-progress.is-no-today .mk-level-progress-before,.mk-level-progress.is-no-before .mk-level-progress-today{ border-radius:999px; }
.mk-level-progress-today::after{ content:""; position:absolute; inset:0; background:repeating-linear-gradient(45deg, rgba(255,255,255,.18) 0 5px, transparent 5px 10px); opacity:.55; }
.mk-level-progress-meta{ display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; font-size:.66rem; color:color-mix(in srgb,var(--md-default-fg-color) 70%,transparent); }
.mk-level-progress-info-row{ display:grid; grid-template-columns:minmax(0,1fr) auto minmax(0,1fr); align-items:center; column-gap:12px; row-gap:4px; font-size:.64rem; color:color-mix(in srgb,var(--md-default-fg-color) 70%,transparent); }
.mk-level-progress-info-row > span{ min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mk-level-progress-info-row > span:last-child{ text-align:right; }
.mk-level-progress-legend{ display:flex; align-items:center; justify-content:center; gap:9px; flex-wrap:nowrap; font-size:.58rem; line-height:1.2; opacity:.78; white-space:nowrap; }
.mk-level-legend-item{ display:inline-flex; align-items:center; gap:4px; white-space:nowrap; }
.mk-level-legend-dot{ width:9px; height:9px; border-radius:999px; display:inline-block; background:var(--md-accent-fg-color); opacity:.72; }
.mk-level-legend-dot.is-today{ background:#22c55e; opacity:1; }
.mk-level-daily-block{ align-content:center; width:max-content; min-width:210px; max-width:260px; }
.mk-level-daily-meter{ display:inline-flex; align-items:center; gap:7px; flex:0 0 auto; min-width:0; max-width:100%; border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 30%,transparent); border-radius:999px; padding:4px 7px 4px 8px; background:color-mix(in srgb,var(--md-default-bg-color) 88%,var(--md-accent-fg-color) 12%); color:color-mix(in srgb,var(--md-default-fg-color) 78%,transparent); font-size:.62rem; line-height:1; white-space:nowrap; }
.mk-level-daily-meter-label{ font-weight:650; color:var(--md-default-fg-color); }
.mk-level-daily-meter-track{ position:relative; display:inline-flex; width:42px; height:14px; border:1.5px solid color-mix(in srgb,var(--md-default-fg-color) 26%,transparent); border-radius:4px; background:color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); overflow:visible; box-sizing:border-box; }
.mk-level-daily-meter-track::after{ content:""; position:absolute; right:-4px; top:3px; width:3px; height:6px; border-radius:0 2px 2px 0; background:color-mix(in srgb,var(--md-default-fg-color) 26%,transparent); }
.mk-level-daily-meter-fill{ display:block; height:100%; width:0%; max-width:100%; border-radius:2px; background:linear-gradient(90deg, #10b981, #22c55e); transition:width .18s ease; }
.mk-level-daily-meter-value{ font-weight:500; color:color-mix(in srgb,var(--md-default-fg-color) 76%,transparent); }
.mk-level-daily-meter.is-full{ border-color:color-mix(in srgb,#16a34a 42%,transparent); background:color-mix(in srgb,var(--md-default-bg-color) 82%,#16a34a 18%); }
.mk-level-daily-meter.is-full .mk-level-daily-meter-fill{ background:linear-gradient(90deg, #059669, #16a34a); }
.mk-level-daily-main{ display:flex; align-items:center; justify-content:flex-start; gap:8px; }
.mk-level-daily-note{ font-size:.60rem; line-height:1.25; opacity:.72; white-space:nowrap; }
.mk-level-cap-reached{ color:#16a34a; font-weight:750; }
.mk-level-cap-today{ opacity:.68; }
.mk-local-fold-summary:focus,.mk-local-fold-summary:focus-visible,.mk-local-fold-section:focus,.mk-local-fold-section:focus-visible,.mk-level-break-card:focus,.mk-level-break-card:focus-visible,.mk-level-break-card > .mk-level-break-summary:focus,.mk-level-break-card > .mk-level-break-summary:focus-visible{ outline:none !important; box-shadow:none !important; }
@media (max-width: 760px){
  .mk-level-summary-card{ grid-template-columns:1fr; padding:10px; gap:10px; }
  .mk-level-summary-block{ padding:10px 12px; gap:7px; }
  .mk-level-daily-block{ width:auto; min-width:0; max-width:none; }
  .mk-level-progress-info-row{ grid-template-columns:1fr; row-gap:0; }
  .mk-level-progress-info-row > span:first-child,.mk-level-progress-info-row > span:last-child{ display:none !important; }
  .mk-level-progress-legend{ justify-content:flex-start; flex-wrap:wrap; font-size:.60rem; }
  .mk-level-daily-block .mk-level-summary-head{ align-items:center; }
  .mk-level-daily-block .mk-level-summary-head > div{ width:100%; display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .mk-level-daily-block .mk-level-kicker{ margin:0; font-size:.72rem; }
  .mk-level-daily-main{ justify-content:flex-end; flex-wrap:nowrap; min-width:0; }
  .mk-level-daily-note{ display:none !important; }
  .mk-level-daily-meter{ position:relative; gap:0; padding:0 6px 0 0; border:0; background:transparent; font-size:.56rem; }
  .mk-level-daily-meter-label{ display:none !important; }
  .mk-level-daily-meter-track{ width:126px; height:24px; border-width:1.5px; border-radius:7px; overflow:hidden; background:color-mix(in srgb,var(--md-default-fg-color) 9%,transparent); }
  .mk-level-daily-meter-track::after{ right:-5px; top:6px; width:4px; height:10px; border-radius:0 3px 3px 0; }
  .mk-level-daily-meter-fill{ border-radius:5px; }
  .mk-level-daily-meter-value{ position:absolute; left:0; right:6px; top:0; bottom:0; z-index:2; display:flex; align-items:center; justify-content:center; font-size:.56rem; font-weight:800; color:var(--md-default-fg-color); text-shadow:0 1px 0 color-mix(in srgb,var(--md-default-bg-color) 55%,transparent); pointer-events:none; }
}
@media (min-width: 761px){
  .mk-level-current-block{ min-height:0; }
}

.mk-level-section{ display:grid; gap:8px; }
.mk-level-section h3{ margin:.15rem 0 0; font-size:.88rem; line-height:1.2; }
.mk-level-table{ display:grid; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:15px; overflow:hidden; }
.mk-level-table-row{ display:grid; grid-template-columns:minmax(0,1.5fr) minmax(70px,.45fr) minmax(0,.8fr); gap:10px; align-items:center; padding:9px 10px; font-size:.72rem; line-height:1.3; background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); }
.mk-level-rules .mk-level-table-row{ grid-template-columns:minmax(0,1fr) minmax(180px,.58fr); gap:12px; align-items:center; padding:10px 12px; }
.mk-level-rule-main{ min-width:0; }
.mk-level-rule-main small{ max-width:100%; white-space:normal; overflow-wrap:anywhere; }
.mk-level-rule-meta{ display:grid; gap:5px; justify-items:end; min-width:0; text-align:right; }
.mk-level-rule-reward{ display:flex; flex-wrap:wrap; justify-content:flex-end; align-items:center; gap:5px 8px; font-weight:900; }
.mk-level-rule-reward strong{ font-size:.78rem; line-height:1.1; }
.mk-level-rule-coin{ display:inline-flex; align-items:center; gap:3px; color:var(--md-accent-fg-color); font-size:.66rem; line-height:1.1; font-weight:900; }
.mk-level-rule-coin svg{ width:.82rem; height:.82rem; flex:0 0 auto; }
.mk-level-rule-limit{ display:flex; flex-wrap:wrap; justify-content:flex-end; align-items:center; gap:4px 7px; max-width:100%; font-size:.61rem; line-height:1.15; font-weight:750; opacity:.76; }
.mk-level-rule-limit > span{ white-space:nowrap; }
.mk-level-rule-repeat-placeholder{ display:none; }
.mk-level-today-pill{ display:inline-flex !important; align-items:center; justify-content:center; width:max-content; justify-self:end; border-radius:999px; padding:3px 7px; margin-top:0 !important; font-size:.60rem !important; line-height:1 !important; font-weight:850 !important; letter-spacing:.01em; white-space:normal; max-width:100%; opacity:1 !important; }
.mk-level-today-pill.is-reached{ color:#15803d; background:color-mix(in srgb,#22c55e 18%,transparent); border:1px solid color-mix(in srgb,#16a34a 34%,transparent); box-shadow:inset 0 0 0 1px color-mix(in srgb,#ffffff 18%,transparent); }
.mk-level-today-pill.is-progress{ color:color-mix(in srgb,var(--md-default-fg-color) 72%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 5%,transparent); border:1px solid color-mix(in srgb,var(--md-default-fg-color) 9%,transparent); }
.mk-level-table-row + .mk-level-table-row{ border-top:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); }
.mk-level-table-row small{ display:block; margin-top:2px; opacity:.68; font-size:.65rem; line-height:1.25; }
.mk-level-table-row.is-current{ background:color-mix(in srgb,var(--md-accent-fg-color) 10%,transparent); }
.mk-level-table-num{ display:grid; gap:2px; font-weight:850; text-align:right; white-space:nowrap; }
.mk-level-table-num small{ font-weight:650; opacity:.62; font-size:.62rem; }
.mk-level-cap-note{ padding:8px 10px; font-size:.66rem; line-height:1.35; opacity:.78; background:color-mix(in srgb,var(--md-accent-fg-color) 7%,transparent); border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); }
.mk-level-requirement-level{ display:flex; align-items:center; gap:6px; min-width:0; }
.mk-level-requirement-level strong{ white-space:nowrap; }
.mk-level-current-pill{ display:inline-flex; align-items:center; border-radius:999px; padding:2px 6px; font-size:.58rem; line-height:1; font-weight:850; color:var(--md-accent-fg-color); background:color-mix(in srgb,var(--md-accent-fg-color) 12%,transparent); border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 28%,transparent); white-space:nowrap; }
.mk-level-requirement-delta{ white-space:nowrap; }
.mk-level-breakdown-grid{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
.mk-level-break-card{ display:block; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:14px; padding:10px 12px; background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); min-width:0; box-sizing:border-box; }
.mk-level-break-card > .mk-level-break-summary{ appearance:none; -webkit-appearance:none; width:100%; border:0; padding:0; margin:0; background:transparent; color:inherit; font:inherit; text-align:left; display:grid; grid-template-columns:minmax(0,1fr) auto auto; align-items:center; column-gap:10px; cursor:pointer; user-select:none; }
.mk-level-break-card > summary::-webkit-details-marker{ display:none; }
.mk-level-break-card > .mk-level-break-detail-wrap[hidden]{ display:none !important; }
.mk-level-break-card strong{ display:block; font-size:.70rem; line-height:1.2; font-weight:650; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mk-level-break-main{ min-width:0; overflow:hidden; }
.mk-level-break-card .mk-level-break-score{ justify-self:end; text-align:right; white-space:nowrap; font-weight:700; }
.mk-level-break-card b{ white-space:nowrap; font-size:.74rem; line-height:1.1; font-weight:700; }
.mk-level-break-toggle{ justify-self:end; display:inline-flex; align-items:center; justify-content:center; min-height:24px; padding:4px 8px; border-radius:999px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 16%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); color:var(--md-default-fg-color); font-size:.56rem; font-weight:650; line-height:1; white-space:nowrap; }
.mk-level-break-toggle::after{ content:"▾"; margin-left:4px; font-size:.46rem; line-height:1; opacity:.62; }
.mk-level-break-card.is-open .mk-level-break-toggle::after{ content:"▴"; }
.mk-level-break-detail-panel{ margin-top:9px; width:100%; min-width:0; max-width:none; box-sizing:border-box; max-height:190px; overflow-y:auto; overflow-x:hidden; overscroll-behavior:contain; padding:7px; border-radius:12px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 9%,transparent); background:color-mix(in srgb,var(--md-default-bg-color) 92%,var(--md-default-fg-color) 8%); isolation:isolate; position:relative; }
.mk-level-break-days{ display:grid; gap:5px; width:100%; min-width:0; isolation:isolate; }
.mk-level-break-day{ display:grid; grid-template-columns:minmax(92px,1fr) minmax(48px,.35fr) minmax(62px,.45fr) minmax(76px,.5fr); align-items:center; gap:6px; padding:6px 7px; border-radius:9px; background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); font-size:.58rem; line-height:1.2; min-width:0; position:relative; z-index:0; }
.mk-level-break-day.is-head{ position:sticky; top:-7px; z-index:20; margin-top:-7px; padding-top:13px; background:linear-gradient(var(--md-default-bg-color),var(--md-default-bg-color)),color-mix(in srgb,var(--md-default-bg-color) 88%,var(--md-default-fg-color) 12%); font-weight:650; opacity:1; box-shadow:0 0 0 1px color-mix(in srgb,var(--md-default-fg-color) 7%,transparent),0 8px 0 color-mix(in srgb,var(--md-default-bg-color) 92%,var(--md-default-fg-color) 8%); isolation:isolate; }
.mk-level-break-day.is-head::before{ content:""; position:absolute; inset:-10px -10px -6px -10px; z-index:-1; background:linear-gradient(var(--md-default-bg-color),var(--md-default-bg-color)),color-mix(in srgb,var(--md-default-bg-color) 92%,var(--md-default-fg-color) 8%); border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); }
.mk-level-break-day span{ min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mk-level-break-day span:not(:first-child){ text-align:right; }
/* Unified smaller disclosure arrows across account/public-profile/level panels. */
.mk-local-fold-summary::after{ width:.32rem !important; height:.32rem !important; border-right-width:1.5px !important; border-bottom-width:1.5px !important; opacity:.52 !important; }
.mk-public-profile-section summary::after{ font-size:.78rem !important; line-height:1 !important; opacity:.58 !important; }
.mk-level-break-toggle::after{ font-size:.46rem !important; margin-left:4px !important; line-height:1 !important; opacity:.62 !important; }

/* Remove native browser focus ring on disclosure headers; keep visual state clean after click. */
.mk-local-fold-summary:focus,
.mk-local-fold-summary:focus-visible,
.mk-public-profile-section summary:focus,
.mk-public-profile-section summary:focus-visible,
.mk-level-break-card > .mk-level-break-summary:focus,
.mk-level-break-card > .mk-level-break-summary:focus-visible{ outline:0 !important; box-shadow:none !important; }
.mk-level-panel .mk-local-fold-summary{ font-size:.82rem !important; line-height:1.22 !important; font-weight:800 !important; }
.mk-level-panel .mk-level-cap-note{ font-size:.66rem !important; line-height:1.35 !important; }

.mk-level-break-empty{ padding:8px; font-size:.63rem; opacity:.68; line-height:1.35; }
.mk-level-source-section{ margin-top:10px; }
.mk-level-fold-section{ margin-top:0; }

/* Level & XP: let the modal body own the vertical scroll.
   The three main sections can be opened together without each section trapping
   wheel/touch events or clipping its final rows.  Per-metric detail panels keep
   their own small scroll area because those are genuinely nested lists. */
.mk-level-panel > .mk-local-mini-body{
  scroll-padding-bottom:56px;
  padding-bottom:56px !important;
}
.mk-level-panel .mk-level-fold-section[open] > .mk-local-fold-body{
  max-height:none !important;
  overflow:visible !important;
  padding-right:12px;
}
.mk-level-panel .mk-level-fold-section[open] > .mk-local-fold-body > .mk-level-table,
.mk-level-panel .mk-level-fold-section[open] > .mk-local-fold-body > .mk-level-breakdown-grid{
  min-height:0;
}
.mk-level-panel .mk-level-break-detail-panel{
  -webkit-overflow-scrolling:touch;
  touch-action:pan-y;
  scrollbar-gutter:stable;
}
@media (max-width:720px){
  .mk-level-panel > .mk-local-mini-body{
    scroll-padding-bottom:max(64px, env(safe-area-inset-bottom,0px) + 48px);
    padding-bottom:max(64px, env(safe-area-inset-bottom,0px) + 48px) !important;
  }
  .mk-level-panel .mk-level-fold-section[open] > .mk-local-fold-body{
    padding-right:6px;
  }
  .mk-level-panel .mk-level-break-detail-panel{
    max-height:min(34svh,260px);
  }
}
.mk-level-source-list{ display:grid; gap:8px; }
.mk-level-source-row{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 9%,transparent); border-radius:12px; padding:8px 9px; background:var(--md-default-bg-color); }
.mk-level-note{ font-size:.67rem; line-height:1.35; opacity:.68; }
.mk-level-sync-row{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:9px 10px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:14px; background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent); }
.mk-level-sync-row > div{ display:grid; gap:2px; min-width:0; font-size:.66rem; line-height:1.25; }
.mk-level-sync-row strong{ font-size:.72rem; }
.mk-level-sync-row span{ opacity:.72; }

.mk-level-sync-status{ color:var(--md-accent-fg-color); opacity:1 !important; }
.mk-level-sync-btn{ display:inline-flex !important; align-items:center; gap:6px; white-space:nowrap; }
.mk-level-sync-spinner{ display:none; width:.78rem; height:.78rem; border-radius:999px; border:2px solid color-mix(in srgb,currentColor 24%,transparent); border-top-color:currentColor; animation:mk-level-spin .8s linear infinite; }
.mk-level-sync-btn.is-loading .mk-level-sync-spinner{ display:inline-block; }
.mk-level-modal .mk-local-mini-head{ align-items:center; }
.mk-level-modal .mk-local-mini-title{ flex:1 1 auto; min-width:0; }
.mk-level-title-sync-wrap{ flex:0 1 auto; min-width:0; margin-left:auto; display:flex; align-items:center; justify-content:flex-end; }
.mk-level-title-sync{ display:flex; align-items:center; justify-content:flex-end; gap:8px; min-width:0; }
.mk-level-title-sync-text{ display:block; font-size:.68rem; line-height:1.2; opacity:.70; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:min(38vw,260px); }
.mk-level-title-sync-btn{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 16%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); color:inherit; border-radius:999px; }
.mk-level-title-sync-btn:hover{ background:color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); }
.mk-level-title-sync-btn.is-loading svg{ animation:mk-level-spin .8s linear infinite; }
@keyframes mk-level-spin{ to{ transform:rotate(360deg); } }

@media (max-width:720px){
  .mk-level-modal .mk-local-mini-head{ gap:7px; }
  .mk-level-modal .mk-local-mini-title{ font-size:.86rem; }
  .mk-level-title-sync{ gap:6px; }
  .mk-level-title-sync-text{ max-width:34vw; font-size:.58rem; }
  .mk-level-title-sync-btn.mk-comment-icon-btn{ width:1.85rem !important; min-width:1.85rem !important; height:1.85rem !important; }
}
.mk-xp-repeat-percent{ appearance:none; border:0; background:transparent; color:var(--md-accent-fg-color); padding:0; margin:0; font:inherit; font-weight:750; cursor:help; text-decoration:underline; text-decoration-style:dotted; text-underline-offset:2px; }
@media (max-width:720px){ .mk-level-modal{ align-items:flex-start; padding:10px 10px max(10px, env(safe-area-inset-bottom,0px)); } .mk-level-panel{ width:calc(100vw - 20px); max-height:min(92dvh,calc(100svh - 20px)); padding:0 !important; } .mk-level-panel > .mk-local-mini-head{ padding:12px 12px 11px; } .mk-level-panel > .mk-local-mini-body{ padding:12px; } .mk-level-summary-card{ grid-template-columns:1fr; align-items:start; } .mk-level-summary-head{ align-items:flex-start; } .mk-level-total{ text-align:right; } .mk-level-daily-main{ justify-content:flex-start; flex-wrap:wrap; } .mk-level-table-row{ grid-template-columns:1fr; gap:3px; } .mk-level-table-num{ text-align:left; } .mk-level-rules .mk-level-table-row{ grid-template-columns:minmax(0,1fr); gap:7px; align-items:start; padding:9px 10px; } .mk-level-rule-meta{ justify-items:start; text-align:left; } .mk-level-rule-reward{ justify-content:flex-start; } .mk-level-rule-limit{ justify-content:flex-start; font-size:.58rem; } .mk-level-rule-reward strong{ font-size:.70rem; } .mk-level-requirements .mk-level-table-row{ grid-template-columns:minmax(0,1fr) auto auto; gap:8px; padding:8px 10px; align-items:center; } .mk-level-requirements .mk-level-table-num{ text-align:right; } .mk-level-requirements .mk-level-requirement-delta{ text-align:right; font-size:.68rem; opacity:.78; } .mk-level-current-pill{ padding:2px 5px; font-size:.55rem; } .mk-level-breakdown-grid{ grid-template-columns:1fr; } }
@media (max-width:720px){ .mk-level-daily-block .mk-level-summary-head > div{ width:100%; display:flex; align-items:center; justify-content:space-between; gap:10px; } .mk-level-daily-main{ justify-content:flex-end !important; flex-wrap:nowrap !important; } .mk-level-daily-note{ display:none !important; } .mk-level-progress-info-row > span:first-child,.mk-level-progress-info-row > span:last-child{ display:none !important; } .mk-level-daily-meter-track{ width:126px; height:24px; } .mk-level-daily-meter-value{ position:absolute; left:0; right:6px; top:0; bottom:0; z-index:2; display:flex; align-items:center; justify-content:center; } }
.mk-local-mini-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
.mk-local-mini-title{ font-weight:800; font-size:.92rem; }
.mk-local-mini-body{ display:grid; gap:10px; min-width:0; }
.mk-local-mini-body input[type="text"]{ width:100%; box-sizing:border-box; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); border-radius:10px; padding:.55rem .65rem; background:var(--md-default-bg-color); color:var(--md-default-fg-color); font:inherit; }
.mk-local-mini-actions{ display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
.mk-privacy-action-btn{ appearance:none; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 16%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 5%,transparent); color:inherit; border-radius:999px !important; padding:.38rem .68rem !important; font:inherit; font-size:.70rem; line-height:1.15; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px; width:auto !important; min-width:0 !important; height:auto !important; min-height:34px !important; flex:0 0 auto; white-space:nowrap; }
.mk-privacy-action-btn:hover{ background:color-mix(in srgb,var(--md-default-fg-color) 7%,transparent); }
.mk-local-profile-sync-out strong{ font-size:1.1rem; letter-spacing:.08em; padding:4px 8px; border-radius:10px; background:color-mix(in srgb, var(--md-primary-fg-color) 12%, transparent); }

@media (max-width:720px){
  .mk-local-profile-main-row{ grid-template-columns:auto minmax(0,1fr) !important; gap:10px !important; padding:10px !important; align-items:center !important; }
  .mk-local-profile-avatar-cell,.mk-local-profile-name-cell{ width:auto; min-width:0; }
  .mk-local-profile-identity-cell{ min-width:0; }
  .mk-local-profile-topline{ grid-template-columns:1fr !important; gap:6px !important; align-items:start !important; }
  .mk-local-profile-bio-cell{ grid-column:1 / -1; justify-self:stretch; justify-content:flex-start; }
  .mk-local-profile-bio{ max-width:none; font-size:.68rem; text-align:left; }
  .mk-local-profile-name-cell{ flex-wrap:wrap; }
  .mk-local-profile-name{ font-size:.92rem; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .mk-local-level-badge{ height:2rem; min-width:2.8rem; padding:0 .52rem; justify-content:center; gap:0; }
  .mk-local-level-badge .mk-local-level-badge-xp{ display:none !important; }
  .mk-local-profile-action-row{ gap:6px; padding:0; }
  .mk-local-inline-change{ width:auto; min-width:0; height:auto; padding:.36rem .58rem; justify-content:center; }
  .mk-local-inline-change span{ display:inline !important; }
  .mk-local-inline-change svg{ display:none !important; }
}


/* Unified typography for the My / Activity account panels.
   Keep each hierarchy visually distinct, but use the same scale on
   Privacy, Notifications, Study connections, Saved pages and Activity. */
.mk-local-activity-modal{
  --mk-local-title-size:.98rem;
  --mk-local-section-size:.80rem;
  --mk-local-row-title-size:.76rem;
  --mk-local-body-size:.70rem;
  --mk-local-meta-size:.62rem;
}
.mk-local-activity-title{
  font-size:var(--mk-local-title-size) !important;
  line-height:1.18 !important;
  font-weight:850 !important;
  letter-spacing:-.01em !important;
}
.mk-local-activity-body{
  font-size:var(--mk-local-body-size) !important;
  line-height:1.38 !important;
}
.mk-local-activity-empty,
.mk-privacy-card > .mk-local-activity-meta,
.mk-connections-card > .mk-local-activity-empty,
.mk-notification-context{
  font-size:var(--mk-local-body-size) !important;
  line-height:1.38 !important;
  opacity:.70 !important;
}
.mk-connections-card h3,
.mk-local-profile-sync h3,
.mk-local-devices-card h3,
.mk-local-account-actions h3,
.mk-readiness-share-title{
  margin:12px 0 6px !important;
  font-size:var(--mk-local-section-size) !important;
  line-height:1.22 !important;
  font-weight:800 !important;
  letter-spacing:-.005em !important;
}
.mk-local-fold-summary{
  font-size:var(--mk-local-section-size) !important;
  line-height:1.22 !important;
  font-weight:800 !important;
}
.mk-local-activity-row{
  font-size:var(--mk-local-body-size) !important;
  line-height:1.35 !important;
}
.mk-local-activity-link,
.mk-local-activity-body[data-type="visits"] .mk-local-activity-link,
.mk-local-activity-body[data-type="activity"] .mk-local-activity-link{
  font-size:var(--mk-local-row-title-size) !important;
  line-height:1.22 !important;
  font-weight:400 !important;
}
.mk-local-activity-meta,
.mk-local-fold-count,
.mk-local-device-text small,
.mk-local-account-action-title small,
.mk-local-profile-file-note,
.mk-local-avatar-note{
  font-size:var(--mk-local-meta-size) !important;
  line-height:1.32 !important;
}
.mk-local-activity-text,
.mk-local-account-action-title,
.mk-local-sync-title,
.mk-local-device-text strong{
  font-size:var(--mk-local-row-title-size) !important;
  line-height:1.35 !important;
}
.mk-connection-request-form input,
.mk-privacy-select,
.mk-local-profile-form input,
.mk-local-mini-body input[type="text"]{
  font-size:var(--mk-local-body-size) !important;
  line-height:1.25 !important;
}
.mk-privacy-row{
  align-items:center !important;
  gap:10px !important;
  padding:9px 10px !important;
}
.mk-privacy-text{
  font-size:var(--mk-local-body-size) !important;
  line-height:1.35 !important;
}
.mk-privacy-text strong{
  display:block !important;
  font-size:var(--mk-local-row-title-size) !important;
  line-height:1.24 !important;
  font-weight:800 !important;
  margin-bottom:2px !important;
}
.mk-privacy-text small{
  display:block !important;
  font-size:var(--mk-local-body-size) !important;
  line-height:1.34 !important;
  opacity:.68 !important;
}
.mk-notification-line{
  font-size:var(--mk-local-row-title-size) !important;
  line-height:1.35 !important;
}
.mk-notification-actor-name{
  font-size:var(--mk-local-row-title-size) !important;
  line-height:1.2 !important;
  font-weight:800 !important;
}
.mk-privacy-action-btn,
.mk-comment-small-btn,
.mk-comment-primary-btn,
.mk-local-inline-change,
.mk-local-avatar-tab{
  font-size:var(--mk-local-body-size) !important;
}
@media (max-width:720px){
  .mk-local-activity-modal{
    --mk-local-title-size:.94rem;
    --mk-local-section-size:.78rem;
    --mk-local-row-title-size:.74rem;
    --mk-local-body-size:.68rem;
    --mk-local-meta-size:.60rem;
  }
  .mk-local-activity-body{
    line-height:1.36 !important;
  }
  .mk-connections-card h3,
  .mk-local-profile-sync h3,
  .mk-local-devices-card h3,
  .mk-local-account-actions h3{
    margin:10px 0 5px !important;
  }
}


/* Connected-device and account-access rows. These are intentionally defined late
   because the profile panel has several older generic row styles above. */
.mk-local-devices-card,
.mk-local-account-actions{
  display:grid !important;
  gap:8px !important;
  min-width:0 !important;
}
.mk-local-devices-card .mk-local-sync-row{
  display:grid !important;
  grid-template-columns:minmax(0,1fr) auto !important;
  align-items:center !important;
  gap:10px !important;
  padding:6px 0 8px !important;
  border-top:0 !important;
}
.mk-local-devices-card .mk-local-sync-title{
  font-size:var(--mk-local-body-size) !important;
  line-height:1.35 !important;
  opacity:.68 !important;
  min-width:0 !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
}
.mk-local-device-list{
  display:grid !important;
  gap:6px !important;
  min-width:0 !important;
}
.mk-local-device-row,
.mk-local-account-action-row{
  display:grid !important;
  grid-template-columns:minmax(0,1fr) auto !important;
  align-items:center !important;
  gap:10px !important;
  min-width:0 !important;
  padding:8px 10px !important;
  border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent) !important;
  border-radius:12px !important;
  background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent) !important;
}
.mk-local-device-row.is-revoked{ opacity:.55 !important; }
.mk-local-device-text,
.mk-local-account-action-title{
  display:grid !important;
  gap:2px !important;
  min-width:0 !important;
}
.mk-local-device-text strong,
.mk-local-account-action-title strong{
  display:block !important;
  min-width:0 !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
  font-weight:800 !important;
  letter-spacing:0 !important;
}
.mk-local-device-text small,
.mk-local-account-action-title small{
  display:block !important;
  min-width:0 !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
  opacity:.62 !important;
}
.mk-local-device-row .mk-comment-small-btn,
.mk-local-account-action-row .mk-comment-small-btn{
  width:2rem !important;
  min-width:2rem !important;
  height:2rem !important;
  min-height:2rem !important;
  padding:0 !important;
  justify-self:end !important;
}
.mk-local-device-row .mk-comment-small-btn svg,
.mk-local-account-action-row .mk-comment-small-btn svg{
  width:1rem !important;
  height:1rem !important;
}
.mk-local-account-actions{
  border-top:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent) !important;
  padding-top:8px !important;
}
@media (max-width:720px){
  .mk-local-device-row,
  .mk-local-account-action-row{
    padding:8px 9px !important;
    border-radius:11px !important;
  }
  .mk-local-device-text small,
  .mk-local-account-action-title small{
    white-space:normal !important;
  }
}

/* Account profile layout and collapsible management sections. */
.mk-account-profile-stack{
  display:grid !important;
  gap:12px !important;
  min-width:0 !important;
}
.mk-account-profile-card{
  display:grid !important;
  gap:10px !important;
  min-width:0 !important;
  padding:12px 14px !important;
  border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent) !important;
  border-radius:16px !important;
  background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent) !important;
}
.mk-account-profile-card .mk-local-profile-main-row{
  padding:0 !important;
  border:0 !important;
  border-radius:0 !important;
  background:transparent !important;
  grid-template-columns:auto minmax(140px,max-content) minmax(220px,1fr) !important;
  gap:14px !important;
  overflow:visible !important;
}
.mk-account-profile-card .mk-local-profile-action-row{
  margin:0 !important;
  padding:0 !important;
  gap:7px !important;
}
.mk-account-profile-card .mk-local-profile-bio{
  font-size:var(--mk-local-row-title-size) !important;
  line-height:1.35 !important;
  opacity:.70 !important;
  /* On wide screens the intro otherwise stretches into one long line across the
     whole row. Cap it to a comfortable reading width so it wraps to a tidy block
     on the right; mobile (below) keeps full width. */
  max-width:34ch !important;
  white-space:normal !important;
}
.mk-account-profile-card .mk-local-profile-name{
  font-size:var(--mk-local-section-size) !important;
  line-height:1.18 !important;
  font-weight:850 !important;
}
.mk-account-section{
  display:block !important;
  min-width:0 !important;
  border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent) !important;
  border-radius:15px !important;
  background:color-mix(in srgb,var(--md-default-fg-color) 3%,transparent) !important;
  overflow:hidden !important;
}
.mk-account-section-summary{
  list-style:none !important;
  cursor:pointer !important;
  display:grid !important;
  grid-template-columns:minmax(0,1fr) auto !important;
  align-items:center !important;
  gap:12px !important;
  padding:11px 13px !important;
  user-select:none !important;
}
.mk-account-section-summary::-webkit-details-marker{ display:none !important; }

/* Remove native focus rectangles from clicked disclosure containers. */
.mk-local-activity-modal details.mk-account-section,
.mk-local-activity-modal details.mk-account-section:focus,
.mk-local-activity-modal details.mk-account-section:focus-visible,
.mk-local-activity-modal details.mk-account-section:focus-within,
.mk-local-activity-modal .mk-account-section-summary,
.mk-local-activity-modal .mk-account-section-summary:focus,
.mk-local-activity-modal .mk-account-section-summary:focus-visible,
.mk-account-shop-section,
.mk-account-shop-section:focus,
.mk-account-shop-section:focus-visible,
.mk-account-shop-section > summary,
.mk-account-shop-section > summary:focus,
.mk-account-shop-section > summary:focus-visible,
.mk-account-shop-info,
.mk-account-shop-info:focus,
.mk-account-shop-info:focus-visible,
.mk-account-shop-info > summary,
.mk-account-shop-info > summary:focus,
.mk-account-shop-info > summary:focus-visible{
  outline:none !important;
  box-shadow:none !important;
  -webkit-tap-highlight-color:transparent !important;
}
.mk-account-section-summary-copy{
  display:grid !important;
  gap:2px !important;
  min-width:0 !important;
}
.mk-account-section-summary-copy strong{
  display:block !important;
  font-size:var(--mk-local-section-size) !important;
  line-height:1.2 !important;
  font-weight:820 !important;
  letter-spacing:-.005em !important;
  min-width:0 !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
}
.mk-account-section-summary-copy small{
  display:block !important;
  font-size:var(--mk-local-meta-size) !important;
  line-height:1.28 !important;
  opacity:.62 !important;
  min-width:0 !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
}
.mk-account-section-arrow{
  width:.42rem !important;
  height:.42rem !important;
  border-right:1.6px solid currentColor !important;
  border-bottom:1.6px solid currentColor !important;
  transform:rotate(45deg) !important;
  opacity:.58 !important;
  transition:transform 140ms ease, opacity 140ms ease !important;
}
.mk-account-section[open] .mk-account-section-arrow{
  transform:rotate(-135deg) !important;
  opacity:.82 !important;
}
.mk-account-section-body{
  border-top:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent) !important;
  padding:10px 12px 12px !important;
  max-height:min(46vh, 420px) !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  touch-action:pan-y !important;
  scrollbar-gutter:stable !important;
}
.mk-account-section-content{
  display:grid !important;
  gap:9px !important;
  min-width:0 !important;
}
.mk-account-section-toolbar{
  display:grid !important;
  grid-template-columns:minmax(0,1fr) auto !important;
  align-items:center !important;
  gap:8px !important;
}
.mk-account-section-note{
  font-size:var(--mk-local-body-size) !important;
  line-height:1.35 !important;
  opacity:.68 !important;
  min-width:0 !important;
}
.mk-account-sync-status-grid--top{ grid-template-columns:repeat(4,minmax(0,1fr)) !important; }
.mk-account-sync-breakdown{
  display:grid !important;
  gap:6px !important;
  margin-top:8px !important;
}
.mk-account-sync-breakdown-row{
  display:grid !important;
  grid-template-columns:minmax(0,1fr) auto !important;
  gap:10px !important;
  align-items:center !important;
  padding:7px 9px !important;
  border:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent) !important;
  border-radius:11px !important;
  background:color-mix(in srgb,var(--md-default-fg-color) 2%,transparent) !important;
}
.mk-account-sync-breakdown-row > span:first-child{
  display:grid !important;
  gap:1px !important;
  min-width:0 !important;
}
.mk-account-sync-breakdown-row strong{
  font-size:var(--mk-local-row-title-size) !important;
  line-height:1.18 !important;
  font-weight:780 !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
}
.mk-account-sync-breakdown-row small{
  font-size:var(--mk-local-meta-size) !important;
  line-height:1.25 !important;
  opacity:.58 !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
}
.mk-account-sync-breakdown-values{
  display:flex !important;
  align-items:center !important;
  justify-content:flex-end !important;
  gap:5px !important;
  white-space:nowrap !important;
  font-size:var(--mk-local-row-title-size) !important;
}
.mk-account-sync-breakdown-values b{ font-weight:850 !important; }
.mk-account-sync-breakdown-values em{ font-style:normal !important; opacity:.42 !important; }
.mk-account-sync-breakdown-values i{ font-style:normal !important; color:var(--md-accent-fg-color) !important; font-size:var(--mk-local-meta-size) !important; font-weight:750 !important; }
.mk-account-sync-breakdown-values i.is-local-extra{ opacity:.9 !important; }
.mk-local-account-action-row .mk-privacy-action-btn{
  justify-self:end !important;
  min-height:32px !important;
}
.mk-account-code-output{
  display:flex !important;
  align-items:center !important;
  gap:8px !important;
  flex-wrap:wrap !important;
  padding:8px 10px !important;
  border:1px solid color-mix(in srgb,var(--md-accent-fg-color) 22%,transparent) !important;
  border-radius:12px !important;
  background:color-mix(in srgb,var(--md-accent-fg-color) 8%,transparent) !important;
  font-size:var(--mk-local-body-size) !important;
  line-height:1.35 !important;
}
.mk-account-code-output[hidden]{ display:none !important; }
.mk-account-code-output strong{
  font-size:var(--mk-local-section-size) !important;
  font-weight:850 !important;
  letter-spacing:.04em !important;
  padding:0 !important;
  background:none !important;
}
.mk-account-code-output span{
  opacity:.70 !important;
}
.mk-account-section .mk-local-devices-card,
.mk-account-section .mk-local-account-actions{
  border-top:0 !important;
  padding-top:0 !important;
}
.mk-account-section .mk-local-sync-row{
  padding:8px 0 !important;
}
.mk-account-section .mk-local-sync-row + .mk-local-sync-row{
  border-top:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent) !important;
}
@media (max-width:720px){
  .mk-account-sync-top{ grid-template-columns:1fr !important; }
  .mk-account-sync-top .mk-account-sync-main-btn{ justify-self:stretch !important; max-width:none !important; width:100% !important; }
  .mk-account-sync-interval-card--compact{ grid-template-columns:1fr auto !important; }
  .mk-account-sync-interval-card--compact .mk-account-sync-interval-slider{ grid-column:1 / -1 !important; }
  .mk-account-sync-steps{ gap:4px; }
  .mk-account-sync-step strong{ display:none !important; }
  .mk-account-sync-step-icon{ width:20px; height:20px; }
}
.mk-account-section .mk-local-device-list{
  padding-bottom:2px !important;
}
.mk-account-section .mk-local-device-list:empty{ display:none !important; }
@media (max-width:720px){
  .mk-account-profile-card{ padding:11px 12px !important; }
  .mk-account-profile-card .mk-local-profile-main-row{
    grid-template-columns:auto minmax(0,1fr) !important;
    gap:10px !important;
  }
  .mk-account-profile-card .mk-local-profile-bio-cell{
    grid-column:1 / -1 !important;
    justify-content:flex-start !important;
  }
  .mk-account-profile-card .mk-local-profile-bio{ text-align:left !important; max-width:none !important; }
  .mk-account-profile-card .mk-local-profile-action-row{ gap:6px !important; }
  .mk-local-inline-change.mk-account-scan-inline-btn{ display:inline-flex !important; }
  .mk-account-scan-inline-btn{ display:inline-flex !important; }
  .mk-account-qr-link{ max-width:calc(100vw - 180px); }

  .mk-account-profile-card .mk-local-inline-change{ padding:.36rem .62rem !important; }
  .mk-account-section-summary{ padding:10px 11px !important; }
  .mk-account-section-summary-copy small{ white-space:normal !important; }
  .mk-account-section-body{ max-height:min(52svh, 390px) !important; padding:9px 10px 11px !important; }
  .mk-account-section-toolbar{ grid-template-columns:1fr !important; }
  .mk-account-sync-status-grid--top{ grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
  .mk-account-sync-breakdown-row{ grid-template-columns:1fr !important; align-items:start !important; }
  .mk-account-sync-breakdown-values{ justify-content:flex-start !important; }
  .mk-account-sync-main-btn{ width:auto !important; max-width:max-content !important; justify-self:start !important; }
}

@media (max-width:720px), (pointer:coarse){
  .mk-account-section--sync[open]{
    display:flex !important;
    flex-direction:column !important;
    min-height:0 !important;
    max-height:min(68svh, calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 148px)) !important;
    margin-bottom:calc(env(safe-area-inset-bottom, 0px) + 12px) !important;
  }
  .mk-account-section--sync[open] .mk-account-section-summary{
    flex:0 0 auto !important;
  }
  .mk-account-section--sync[open] .mk-account-section-body{
    flex:1 1 auto !important;
    min-height:0 !important;
    max-height:none !important;
    padding-bottom:14px !important;
    scroll-padding-bottom:18px !important;
  }
}


/* Sync panel visual polish v12: balanced status card, tighter auto-sync row, compact process rail. */
.mk-account-sync-card{ gap:12px !important; }
.mk-account-sync-top{
  display:grid !important;
  grid-template-columns:minmax(0,1fr) auto !important;
  gap:14px !important;
  align-items:stretch !important;
}
.mk-account-sync-top .mk-account-sync-status-card{
  min-height:74px !important;
  height:auto !important;
  padding:12px 14px !important;
}
.mk-account-sync-status-card{
  border-radius:16px !important;
  background:linear-gradient(135deg,color-mix(in srgb,var(--md-default-fg-color) 4%,transparent),color-mix(in srgb,var(--md-accent-fg-color) 3%,transparent)) !important;
}
.mk-account-sync-status-layout{
  display:grid !important;
  grid-template-columns:minmax(0,1.25fr) minmax(190px,.72fr) auto !important;
  gap:12px !important;
  align-items:center !important;
  min-width:0 !important;
}
.mk-account-sync-status-copy{ gap:4px !important; }
.mk-account-sync-status-copy strong{
  font-size:16px !important;
  line-height:1.18 !important;
  max-width:100% !important;
}
.mk-account-sync-status-copy small{
  font-size:12px !important;
  line-height:1.3 !important;
  opacity:.62 !important;
}
.mk-account-sync-status-metrics{
  display:grid !important;
  grid-template-columns:repeat(2,minmax(78px,1fr)) !important;
  gap:7px !important;
  align-items:stretch !important;
  min-width:0 !important;
}
.mk-account-sync-status-metrics div{
  display:grid !important;
  gap:1px !important;
  min-width:0 !important;
  padding:7px 9px !important;
  border:1px solid color-mix(in srgb,var(--md-default-fg-color) 8%,transparent) !important;
  border-radius:12px !important;
  background:color-mix(in srgb,var(--md-default-bg-color) 62%,transparent) !important;
}
.mk-account-sync-status-metrics span{
  display:block !important;
  font-size:9.5px !important;
  line-height:1.1 !important;
  opacity:.50 !important;
  text-transform:uppercase !important;
  letter-spacing:.045em !important;
}
.mk-account-sync-status-metrics strong{
  display:block !important;
  font-size:15px !important;
  line-height:1.05 !important;
  font-weight:820 !important;
  letter-spacing:0 !important;
  padding:0 !important;
  background:none !important;
  border-radius:0 !important;
}
.mk-account-sync-status-metrics em{
  grid-column:1 / -1 !important;
  display:block !important;
  margin-top:0 !important;
  padding:0 2px !important;
  font-style:normal !important;
  font-size:11px !important;
  line-height:1.2 !important;
  opacity:.66 !important;
  text-align:center !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
}
.mk-account-sync-state-pill{
  justify-self:end !important;
  align-self:center !important;
  min-width:62px !important;
  padding:5px 10px !important;
}
.mk-account-sync-top .mk-account-sync-main-btn{
  align-self:center !important;
  justify-self:end !important;
  min-height:52px !important;
  height:52px !important;
  min-width:112px !important;
  padding:0 20px !important;
  border-radius:999px !important;
  font-size:13px !important;
}
.mk-account-sync-interval-card--compact{
  grid-template-columns:max-content minmax(170px,1fr) auto !important;
  gap:12px !important;
  align-items:center !important;
  padding:9px 12px !important;
  border-radius:16px !important;
}
.mk-account-sync-interval-card--compact .mk-account-sync-interval-head{
  width:max-content !important;
  max-width:190px !important;
}
.mk-account-sync-interval-card--compact .mk-account-sync-interval-copy strong{
  font-size:13px !important;
  white-space:nowrap !important;
}
.mk-account-sync-interval-card--compact .mk-account-sync-interval-slider{
  height:18px !important;
  align-self:center !important;
}
.mk-account-sync-interval-card--compact .mk-account-sync-interval-value{
  justify-self:end !important;
  min-width:54px !important;
}
.mk-account-sync-steps-card{
  border-radius:16px !important;
  padding:10px 12px !important;
  gap:8px !important;
}
.mk-account-sync-steps{ gap:8px !important; }
.mk-account-sync-step-icon{
  width:24px !important;
  height:24px !important;
  font-size:.72rem !important;
}
.mk-account-sync-step strong{ font-size:.60rem !important; }
.mk-account-sync-step-detail{
  min-height:18px !important;
  padding-top:2px !important;
  text-align:left !important;
  font-size:12px !important;
}
@media (max-width:860px){
  .mk-account-sync-status-layout{ grid-template-columns:minmax(0,1fr) auto !important; }
  .mk-account-sync-status-metrics{ grid-column:1 / -1 !important; grid-row:2 !important; }
  .mk-account-sync-state-pill{ grid-column:2 !important; grid-row:1 !important; }
}
@media (max-width:720px){
  .mk-account-sync-top{ grid-template-columns:1fr !important; gap:10px !important; }
  .mk-account-sync-top .mk-account-sync-main-btn{ width:100% !important; max-width:none !important; justify-self:stretch !important; }
  .mk-account-sync-status-layout{ grid-template-columns:minmax(0,1fr) auto !important; gap:9px !important; }
  .mk-account-sync-status-metrics{ grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
  .mk-account-sync-interval-card--compact{ grid-template-columns:1fr auto !important; gap:8px !important; }
  .mk-account-sync-interval-card--compact .mk-account-sync-interval-slider{ grid-column:1 / -1 !important; }
  .mk-account-sync-step strong{ display:none !important; }
}

/* Account section scroll repair v8:
   The Account surface itself scrolls, but each opened small container must also
   be a real nested scroll container, especially on iOS Safari. */
.mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open]{
  display:flex !important;
  flex-direction:column !important;
  min-height:0 !important;
}
.mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open] > .mk-account-section-summary{
  flex:0 0 auto !important;
}
.mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open] > .mk-account-section-body{
  flex:1 1 auto !important;
  min-height:0 !important;
  max-height:min(46vh,420px) !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  touch-action:pan-y !important;
  scrollbar-gutter:stable !important;
}
@media (max-width:720px), (pointer:coarse){
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open]{
    max-height:min(52svh, calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - var(--mk-account-open-section-reserve, 250px))) !important;
    margin-bottom:10px !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section--sync[open]{
    max-height:min(48svh, calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - var(--mk-account-open-section-reserve, 270px))) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open] > .mk-account-section-body{
    max-height:none !important;
    overflow-y:auto !important;
    -webkit-overflow-scrolling:touch !important;
    padding-bottom:calc(env(safe-area-inset-bottom, 0px) + 18px) !important;
    scroll-padding-bottom:calc(env(safe-area-inset-bottom, 0px) + 22px) !important;
  }
}

/* Account opened cards: force native nested scrolling even when the outer account
   panel can also scroll. */
.mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open] > .mk-account-section-body{
  position:relative !important;
  contain:layout paint !important;
}

/* Account nested scroll repair v10: keep the outer Account page still, while the
   opened card body is the only vertical scroll target. */
.mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open]{
  overflow:hidden !important;
}
.mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open] > .mk-account-section-body{
  display:block !important;
  overflow-y:scroll !important;
  overscroll-behavior-y:contain !important;
  -webkit-overflow-scrolling:touch !important;
  min-height:140px !important;
}
@media (max-width:720px), (pointer:coarse){
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open]{
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 310px) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section--sync[open]{
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 300px) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open] > .mk-account-section-body{
    max-height:none !important;
    height:auto !important;
    min-height:180px !important;
    padding-bottom:calc(env(safe-area-inset-bottom, 0px) + 26px) !important;
  }
}


/* Unified nested-scroll repair v11:
   Account tab sections and the Level & XP sections must each be real scroll
   islands.  The outer modal can still scroll as a fallback, but when a small
   container is open its body now owns vertical scrolling and keeps a visible
   bottom padding, even if several containers are open at once. */
.mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] .mk-local-activity-panel{
  height:min(820px, calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - 36px)) !important;
  max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - 36px) !important;
  min-height:0 !important;
}
.mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] .mk-local-activity-body{
  flex:1 1 auto !important;
  min-height:0 !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  touch-action:pan-y !important;
  padding-bottom:18px !important;
}
.mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open]{
  display:flex !important;
  flex-direction:column !important;
  min-height:0 !important;
  max-height:min(56dvh, 520px) !important;
  overflow:hidden !important;
  contain:none !important;
}
.mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open] > .mk-account-section-summary{
  flex:0 0 auto !important;
}
.mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open] > .mk-account-section-body{
  flex:1 1 auto !important;
  display:block !important;
  min-height:150px !important;
  height:auto !important;
  max-height:min(42dvh, 420px) !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  touch-action:pan-y !important;
  box-sizing:border-box !important;
  padding-bottom:22px !important;
  scroll-padding-bottom:24px !important;
  scrollbar-gutter:stable !important;
  contain:none !important;
}
@supports not (height: 1dvh){
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open]{ max-height:min(56vh, 520px) !important; }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open] > .mk-account-section-body{ max-height:min(42vh, 420px) !important; }
}
@media (max-width:720px), (pointer:coarse){
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] .mk-local-activity-panel{
    height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 20px) !important;
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 20px) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open]{
    max-height:min(52dvh, calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 260px)) !important;
    margin-bottom:10px !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-section[open] > .mk-account-section-body{
    min-height:170px !important;
    max-height:min(38dvh, calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 340px)) !important;
    padding-bottom:calc(env(safe-area-inset-bottom,0px) + 24px) !important;
    scroll-padding-bottom:calc(env(safe-area-inset-bottom,0px) + 28px) !important;
  }
}

.mk-level-panel{
  height:min(900px, calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - 36px)) !important;
  max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - 36px) !important;
  min-height:0 !important;
}
.mk-level-panel > .mk-local-mini-body{
  flex:1 1 auto !important;
  min-height:0 !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  touch-action:pan-y !important;
  padding-bottom:20px !important;
}
.mk-level-fold-section[open]{
  display:flex !important;
  flex-direction:column !important;
  min-height:0 !important;
  max-height:min(42dvh, 390px) !important;
  overflow:hidden !important;
}
.mk-level-fold-section[open] > .mk-local-fold-summary{
  flex:0 0 auto !important;
}
.mk-level-fold-section[open] > .mk-local-fold-body{
  flex:1 1 auto !important;
  display:block !important;
  min-height:120px !important;
  max-height:none !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  touch-action:pan-y !important;
  box-sizing:border-box !important;
  padding:0 12px 16px !important;
  scroll-padding-bottom:18px !important;
  scrollbar-gutter:stable !important;
}
.mk-level-fold-section[open] > .mk-local-fold-body > *:last-child{
  margin-bottom:0 !important;
}
@supports not (height: 1dvh){
  .mk-level-fold-section[open]{ max-height:min(42vh, 390px) !important; }
}
@media (max-width:720px), (pointer:coarse){
  .mk-level-modal{ padding:10px !important; }
  .mk-level-panel{
    width:calc(100vw - 20px) !important;
    height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 20px) !important;
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 20px) !important;
  }
  .mk-level-fold-section[open]{
    max-height:min(40dvh, 360px) !important;
  }
  .mk-level-fold-section[open] > .mk-local-fold-body{
    min-height:132px !important;
    padding-bottom:calc(env(safe-area-inset-bottom,0px) + 18px) !important;
  }
}



/* Final nested-scroll correction v12:
   Do not give collapsed <details> cards any artificial height.  Only the opened
   body becomes a bounded scroll area.  This fixes the blank oversized Level & XP
   cards and keeps Account subsections scrollable without trapping the whole
   modal. */
.mk-level-panel details.mk-level-fold-section,
.mk-local-activity-modal.mk-local-activity-modal--account details.mk-account-section{
  height:auto !important;
  min-height:0 !important;
  max-height:none !important;
  contain:none !important;
}
.mk-level-panel details.mk-level-fold-section:not([open]),
.mk-local-activity-modal.mk-local-activity-modal--account details.mk-account-section:not([open]){
  display:block !important;
  overflow:hidden !important;
  height:auto !important;
  min-height:0 !important;
  max-height:none !important;
}
.mk-level-panel details.mk-level-fold-section:not([open]) > .mk-local-fold-body,
.mk-local-activity-modal.mk-local-activity-modal--account details.mk-account-section:not([open]) > .mk-account-section-body{
  display:none !important;
  height:0 !important;
  min-height:0 !important;
  max-height:0 !important;
  padding-top:0 !important;
  padding-bottom:0 !important;
  overflow:hidden !important;
}
.mk-level-panel details.mk-level-fold-section[open],
.mk-local-activity-modal.mk-local-activity-modal--account details.mk-account-section[open]{
  display:block !important;
  overflow:hidden !important;
  height:auto !important;
  min-height:0 !important;
  max-height:none !important;
}
.mk-level-panel details.mk-level-fold-section[open] > .mk-local-fold-summary,
.mk-local-activity-modal.mk-local-activity-modal--account details.mk-account-section[open] > .mk-account-section-summary{
  position:relative !important;
  z-index:1 !important;
}
.mk-level-panel details.mk-level-fold-section[open] > .mk-local-fold-body{
  display:block !important;
  box-sizing:border-box !important;
  height:auto !important;
  min-height:0 !important;
  max-height:clamp(180px, 32dvh, 340px) !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior-y:contain !important;
  touch-action:pan-y !important;
  padding:0 12px 14px !important;
  scroll-padding-bottom:18px !important;
  scrollbar-gutter:stable !important;
  contain:none !important;
}
.mk-local-activity-modal.mk-local-activity-modal--account details.mk-account-section[open] > .mk-account-section-body{
  display:block !important;
  box-sizing:border-box !important;
  height:auto !important;
  min-height:0 !important;
  max-height:clamp(180px, 40dvh, 420px) !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior-y:contain !important;
  touch-action:pan-y !important;
  padding-bottom:16px !important;
  scroll-padding-bottom:20px !important;
  scrollbar-gutter:stable !important;
  contain:none !important;
}
.mk-local-activity-modal.mk-local-activity-modal--account details.mk-account-section--sync[open] > .mk-account-section-body{
  max-height:clamp(220px, 48dvh, 500px) !important;
}
@media (max-width:720px), (pointer:coarse){
  .mk-level-panel details.mk-level-fold-section[open] > .mk-local-fold-body{
    max-height:clamp(160px, 34svh, 300px) !important;
    padding:0 10px calc(env(safe-area-inset-bottom,0px) + 14px) !important;
    scroll-padding-bottom:calc(env(safe-area-inset-bottom,0px) + 18px) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account details.mk-account-section[open] > .mk-account-section-body{
    max-height:clamp(160px, 38svh, 360px) !important;
    padding-bottom:calc(env(safe-area-inset-bottom,0px) + 16px) !important;
    scroll-padding-bottom:calc(env(safe-area-inset-bottom,0px) + 20px) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account details.mk-account-section--sync[open] > .mk-account-section-body{
    max-height:clamp(190px, 44svh, 420px) !important;
  }
}



/* Final Level & XP layout correction v13.
   The Level modal body must not be a CSS grid, because grid rows stretch to fill
   the panel height and make collapsed <details> cards look huge.  Use a normal
   vertical flex stack; only opened inner bodies scroll. */
.mk-level-panel > .mk-local-mini-body.mk-level-modal-body{
  display:flex !important;
  flex-direction:column !important;
  align-items:stretch !important;
  justify-content:flex-start !important;
  align-content:normal !important;
  grid-auto-rows:auto !important;
  gap:14px !important;
}
.mk-level-panel > .mk-local-mini-body.mk-level-modal-body > .mk-level-summary-card,
.mk-level-panel > .mk-local-mini-body.mk-level-modal-body > details.mk-level-fold-section{
  flex:0 0 auto !important;
}
.mk-level-panel details.mk-level-fold-section:not([open]){
  display:block !important;
  height:auto !important;
  min-height:0 !important;
  max-height:none !important;
  overflow:hidden !important;
}
.mk-level-panel details.mk-level-fold-section:not([open]) > .mk-local-fold-summary{
  min-height:0 !important;
  height:auto !important;
  padding:10px 12px !important;
}
.mk-level-panel details.mk-level-fold-section[open] > .mk-local-fold-body{
  max-height:clamp(170px, 32dvh, 340px) !important;
}
.mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] .mk-local-activity-body{
  align-content:start !important;
  grid-auto-rows:max-content !important;
}


/* Compact adaptive Account/Saved modal sizing v19.
   Desktop should open only as tall as its real content.  Expanding a child
   section can grow the panel up to the available viewport; after that the
   modal body or the opened child body becomes the scroll container. */
@media (min-width:721px){
  .mk-local-activity-modal.mk-local-activity-modal--account{
    align-items:flex-start !important;
    justify-content:center !important;
    padding:18px !important;
    overflow:hidden !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] > .mk-local-activity-panel,
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] > .mk-local-activity-panel{
    height:auto !important;
    min-height:0 !important;
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100vh)) - 36px) !important;
    overflow:hidden !important;
    display:flex !important;
    flex-direction:column !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] .mk-local-activity-body,
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] .mk-local-activity-body{
    flex:0 1 auto !important;
    height:auto !important;
    min-height:0 !important;
    max-height:none !important;
    overflow:visible !important;
    align-content:start !important;
    padding-bottom:18px !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"]:has(details.mk-account-section[open]) .mk-local-activity-body,
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"]:has(details.mk-local-fold-section[open]) .mk-local-activity-body{
    flex:1 1 auto !important;
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100vh)) - 164px) !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior:contain !important;
    touch-action:pan-y !important;
    scrollbar-gutter:stable !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"]:not(:has(details.mk-account-section[open])) > .mk-local-activity-panel,
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"]:not(:has(details.mk-local-fold-section[open])) > .mk-local-activity-panel{
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100vh)) - 36px) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] details.mk-account-section:not([open]) > .mk-account-section-summary,
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] details.mk-local-fold-section:not([open]) > .mk-local-fold-summary{
    min-height:0 !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] details.mk-local-fold-section[open]{
    display:block !important;
    overflow:hidden !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] details.mk-local-fold-section[open] > .mk-local-fold-body{
    max-height:clamp(180px, 38dvh, 420px) !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior-y:contain !important;
    touch-action:pan-y !important;
    scrollbar-gutter:stable both-edges !important;
  }
}

/* Scan QR is phone-only.  Do not expose it on desktop-sized windows even if the
   device reports a coarse pointer or touch support. */
.mk-account-scan-inline-btn,
.mk-local-inline-change.mk-account-scan-inline-btn{
  display:none !important;
}
@media (max-width:720px){
  .mk-account-scan-inline-btn,
  .mk-local-inline-change.mk-account-scan-inline-btn{
    display:inline-flex !important;
  }
}

/* Login QR sits beside the XP badge.  There is no visible Scan QR button on
   either desktop or mobile. */
.mk-account-profile-card .mk-local-profile-name-cell{
  align-items:center !important;
  gap:8px !important;
}
.mk-account-qr-beside-xp{
  flex:0 0 auto !important;
  white-space:nowrap !important;
}
.mk-account-scan-inline-btn,
.mk-local-inline-change.mk-account-scan-inline-btn,
.mk-guest-account-actions .mk-comment-small-btn[aria-label="Scan QR"],
.mk-local-account-action-row .mk-comment-small-btn[aria-label="Scan QR"]{
  display:none !important;
}
@media (max-width:720px){
  .mk-account-profile-card .mk-local-profile-name-cell{
    flex-wrap:wrap !important;
    gap:7px !important;
  }
  .mk-account-profile-card .mk-local-profile-name{
    flex:1 1 100% !important;
  }
  .mk-account-profile-card .mk-local-level-badge{
    width:5.95rem !important;
    min-width:5.95rem !important;
    max-width:5.95rem !important;
    height:1.42rem !important;
    min-height:1.42rem !important;
    max-height:1.42rem !important;
    gap:4px !important;
    padding:0 .34rem !important;
    justify-content:center !important;
  }
  .mk-account-profile-card .mk-local-level-badge .mk-local-level-badge-xp{
    display:inline !important;
    font-size:.44rem !important;
    opacity:.72 !important;
  }
  .mk-account-profile-card .mk-account-qr-beside-xp{
    width:5.95rem !important;
    min-width:5.95rem !important;
    max-width:5.95rem !important;
    min-height:1.42rem !important;
    height:1.42rem !important;
    max-height:1.42rem !important;
    padding:0 .34rem !important;
  }
}

/* Mobile account tabs: show the eight account tabs as a stable 4 × 2 grid. */
@media (max-width:720px){
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-tabs{
    display:grid !important;
    grid-template-columns:repeat(4, minmax(0,1fr)) !important;
    grid-auto-rows:44px !important;
    align-items:center !important;
    justify-items:center !important;
    justify-content:stretch !important;
    gap:10px 12px !important;
    padding:12px max(18px, env(safe-area-inset-left, 0px) + 18px) 12px max(18px, env(safe-area-inset-right, 0px) + 18px) !important;
    min-height:122px !important;
    max-height:122px !important;
    overflow:visible !important;
    box-sizing:border-box !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-tab.mk-comment-icon-btn{
    width:44px !important;
    min-width:44px !important;
    max-width:44px !important;
    height:44px !important;
    min-height:44px !important;
    max-height:44px !important;
    flex:0 0 44px !important;
    justify-self:center !important;
    margin:0 !important;
    padding:0 !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-tab.mk-comment-icon-btn svg{
    width:19px !important;
    height:19px !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-qr-tab{
    margin-left:0 !important;
  }
}

/* Match the Account info tab's mobile bottom safe-area treatment to Privacy and
   Notifications: the panel extends into the hidden iOS toolbar tail and the
   scroll body carries the extra bottom padding. */
@media (max-width:720px){
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] > .mk-local-activity-panel{
    height:calc(var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) - env(safe-area-inset-top, 0px)) !important;
    min-height:calc(var(--mk-local-doc-height, var(--mk-local-vh, 100dvh)) - env(safe-area-inset-top, 0px)) !important;
    max-height:none !important;
    bottom:0 !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] .mk-local-activity-body{
    flex:1 1 auto !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    padding-bottom:calc(var(--mk-local-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 24px) !important;
    scroll-padding-bottom:calc(var(--mk-local-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 28px) !important;
    background:var(--md-default-bg-color,#fff) !important;
  }
}

/* Legacy text guard: all account QR launch buttons should use the new label. */
.mk-account-qr-open-btn::before{
  content:"";
}


/* Final Level & XP adaptive height correction v23.
   The Level panel must not keep a fixed full-height body when all inner
   sections are collapsed.  Collapsed state is content-sized; opening any
   Level section allows the panel/body to grow up to the visible viewport,
   and then the modal body becomes the outer scrollport. */
.mk-level-panel{
  height:auto !important;
  min-height:0 !important;
  max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - 36px) !important;
  display:flex !important;
  flex-direction:column !important;
  overflow:hidden !important;
}
.mk-level-panel > .mk-local-mini-body.mk-level-modal-body{
  flex:0 1 auto !important;
  height:auto !important;
  min-height:0 !important;
  max-height:none !important;
  overflow:visible !important;
  padding-bottom:16px !important;
}
.mk-level-panel.mk-level-has-open > .mk-local-mini-body.mk-level-modal-body,
.mk-level-panel:has(details.mk-level-fold-section[open]) > .mk-local-mini-body.mk-level-modal-body{
  flex:1 1 auto !important;
  max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - 116px) !important;
  overflow-y:auto !important;
  overflow-x:hidden !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  touch-action:pan-y !important;
  scrollbar-gutter:stable !important;
  padding-bottom:28px !important;
  scroll-padding-bottom:32px !important;
}
.mk-level-panel:not(.mk-level-has-open):not(:has(details.mk-level-fold-section[open])) > .mk-local-mini-body.mk-level-modal-body{
  overflow:visible !important;
}
@media (max-width:720px){
  .mk-level-panel{
    width:calc(100vw - 20px) !important;
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 20px) !important;
  }
  .mk-level-panel.mk-level-has-open > .mk-local-mini-body.mk-level-modal-body,
  .mk-level-panel:has(details.mk-level-fold-section[open]) > .mk-local-mini-body.mk-level-modal-body{
    max-height:calc(var(--mk-local-visible-height, var(--mk-local-vh, 100svh)) - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 104px) !important;
    padding-bottom:calc(env(safe-area-inset-bottom,0px) + 20px) !important;
    scroll-padding-bottom:calc(env(safe-area-inset-bottom,0px) + 24px) !important;
  }
}

/* Mobile Account opened-section safe-area correction v24.
   Each opened Account sub-container is capped by JS using its real viewport
   position, so its bottom stays above the safe area.  The inner body remains the
   scrollport, which prevents the lower content from becoming unreachable. */
@media (max-width:720px), (pointer:coarse){
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] details.mk-account-section[open]{
    max-height:var(--mk-account-section-max-safe, min(44svh, 360px)) !important;
    min-height:0 !important;
    overflow:hidden !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] details.mk-account-section[open] > .mk-account-section-body{
    max-height:var(--mk-account-section-body-max-safe, min(30svh, 280px)) !important;
    min-height:0 !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    -webkit-overflow-scrolling:touch !important;
    overscroll-behavior-y:contain !important;
    touch-action:pan-y !important;
    padding-bottom:var(--mk-account-section-safe-pad, calc(env(safe-area-inset-bottom,0px) + 20px)) !important;
    scroll-padding-bottom:var(--mk-account-section-safe-pad, calc(env(safe-area-inset-bottom,0px) + 24px)) !important;
  }
  .mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] .mk-account-section-content{
    padding-bottom:2px !important;
  }
}


/* v14 width stability for opened/collapsed Level and Account cards.
   Opening a nested details body must not make the whole list narrower.  Keep the
   modal scrollports present in both collapsed and opened states and reserve
   their scrollbar gutter up front. */
.mk-level-panel,
.mk-local-activity-modal.mk-local-activity-modal--account > .mk-local-activity-panel{
  width:min(940px, calc(100vw - 36px)) !important;
  max-width:calc(100vw - 36px) !important;
  box-sizing:border-box !important;
}
.mk-level-panel > .mk-local-mini-body.mk-level-modal-body,
.mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] .mk-local-activity-body,
.mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] .mk-local-activity-body{
  overflow-y:auto !important;
  overflow-x:hidden !important;
  scrollbar-gutter:stable both-edges !important;
  box-sizing:border-box !important;
}
.mk-level-panel > .mk-local-mini-body.mk-level-modal-body > .mk-level-summary-card,
.mk-level-panel > .mk-local-mini-body.mk-level-modal-body > details.mk-level-fold-section,
.mk-local-activity-modal.mk-local-activity-modal--account[data-type="info"] details.mk-account-section,
.mk-local-activity-modal.mk-local-activity-modal--account[data-type="saved"] details.mk-local-fold-section{
  width:100% !important;
  max-width:100% !important;
  box-sizing:border-box !important;
}
.mk-level-panel details.mk-level-fold-section > .mk-local-fold-body,
.mk-local-activity-modal.mk-local-activity-modal--account details.mk-account-section > .mk-account-section-body,
.mk-local-activity-modal.mk-local-activity-modal--account details.mk-local-fold-section > .mk-local-fold-body{
  scrollbar-gutter:stable both-edges !important;
  box-sizing:border-box !important;
}
@media (max-width:720px){
  .mk-level-panel,
  .mk-local-activity-modal.mk-local-activity-modal--account > .mk-local-activity-panel{
    width:calc(100vw - 20px) !important;
    max-width:calc(100vw - 20px) !important;
  }
}

/* v30 mobile account sheet: the account modal must fill the full visual width. */
@media (max-width:720px){
  .mk-local-activity-modal.mk-local-activity-modal--account > .mk-local-activity-panel{
    width:100dvw !important;
    max-width:100dvw !important;
    left:0 !important;
    right:0 !important;
    margin-left:0 !important;
    margin-right:0 !important;
    border-left:0 !important;
    border-right:0 !important;
  }
}

.mk-comment-person{ display:inline-flex; align-items:center; gap:.82rem; }
.mk-comment-avatar.is-emoji-avatar .mk-avatar-core{ font-size:1.16em; }
.mk-comment-time{ opacity:.62; font-size:.78rem; line-height:1; display:inline-flex; align-items:center; }
.mk-comment-text{ white-space:pre-wrap; line-height:1.55; }
.mk-comment-actions{ display:flex; gap:.38rem; align-items:center; flex-wrap:wrap; margin-top:.55rem; }
.mk-comments-empty{
  display:grid;
  grid-template-columns:auto minmax(0,1fr);
  gap:.78rem;
  align-items:center;
  margin:.9rem 0 0;
  padding:1rem 1.08rem;
  border:1px solid var(--mk-theme-comment-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent));
  border-radius:18px;
  background:
    radial-gradient(circle at 0 0, color-mix(in srgb, var(--md-accent-fg-color) 13%, transparent), transparent 42%),
    var(--mk-theme-comment-card-bg, color-mix(in srgb, var(--md-default-bg-color) 97%, var(--md-primary-fg-color) 3%));
  box-shadow:0 8px 24px color-mix(in srgb, var(--md-default-fg-color) 5%, transparent);
  opacity:1;
}
.mk-comments-empty-mark{ color:var(--md-accent-fg-color); font-size:1.35rem; line-height:1; transform:translateY(-.06rem); }
.mk-comments-empty-title{ font-size:.82rem; font-weight:800; line-height:1.25; }
.mk-comments-empty-note{ margin-top:.16rem; font-size:.70rem; line-height:1.42; opacity:.66; }
.mk-comments-loading{ opacity:.68; padding:.8rem 0; }


/* Sync panel layout v13: narrower status card plus next auto-sync countdown under the action button. */
.mk-account-sync-top{
  grid-template-columns:minmax(0,min(980px,calc(100% - 192px))) minmax(168px,max-content) !important;
  justify-content:start !important;
  align-items:center !important;
}
.mk-account-sync-action-wrap{
  display:grid !important;
  gap:7px !important;
  align-content:center !important;
  justify-items:center !important;
  min-width:168px !important;
}
.mk-account-sync-action-wrap .mk-account-sync-main-btn{
  justify-self:center !important;
  min-height:44px !important;
  height:44px !important;
  min-width:104px !important;
  padding:0 16px !important;
}
.mk-account-sync-countdown{
  font-size:11.5px !important;
  line-height:1.25 !important;
  opacity:.66 !important;
  text-align:center !important;
  white-space:normal !important;
  max-width:220px !important;
  overflow:visible !important;
  text-overflow:clip !important;
  overflow-wrap:anywhere !important;
  color:color-mix(in srgb,var(--md-default-fg-color) 72%,transparent) !important;
}
@media (max-width:1080px){
  .mk-account-sync-top{ grid-template-columns:minmax(0,1fr) minmax(168px,max-content) !important; }
}
@media (max-width:720px){
  .mk-account-sync-top{ grid-template-columns:1fr !important; justify-content:stretch !important; }
  .mk-account-sync-action-wrap{ justify-items:stretch !important; min-width:0 !important; width:100% !important; }
  .mk-account-sync-action-wrap .mk-account-sync-main-btn{ width:100% !important; max-width:none !important; justify-self:stretch !important; }
  .mk-account-sync-countdown{ justify-self:center !important; max-width:100% !important; }
}

@media (max-width:768px){ .mk-comments-head{ align-items:center; flex-direction:row; } .mk-comment-card.is-reply{ margin-left:.55rem; } }


    `.trim();document.head.appendChild(st);updateNotificationBadgesSoon(1200);}
let __mkNotificationBadgeTimer=0;let __mkNotificationBadgePromise=null;let __mkFloatingTipBound=false;let __mkModalScrollY=0;let __mkLocalViewportCleanup=null;let __mkLocalViewportRaf=0;function lockPageBehindModal(){try{if(document.body.dataset.mkModalLocked==="1")return;__mkModalScrollY=window.scrollY||document.documentElement.scrollTop||0;document.body.dataset.mkModalLocked="1";document.body.style.position="fixed";document.body.style.top=`-${__mkModalScrollY}px`;document.body.style.left="0";document.body.style.right="0";document.body.style.width="100%";}catch(_){}}
function unlockPageBehindModal(){try{if(document.querySelector(".mk-local-activity-modal"))return;if(document.body.dataset.mkModalLocked!=="1")return;const y=__mkModalScrollY||Math.abs(parseInt(document.body.style.top||"0",10))||0;document.body.dataset.mkModalLocked="";document.body.style.position="";document.body.style.top="";document.body.style.left="";document.body.style.right="";document.body.style.width="";window.scrollTo(0,y);}catch(_){}}
function mkLocalUpdateViewportMetrics(){const modals=Array.from(document.querySelectorAll(".mk-local-activity-modal"));if(!modals.length)return;try{const vv=window.visualViewport;const layoutW=Math.max(1,Number(window.innerWidth)||Number(document.documentElement&&document.documentElement.clientWidth)||1);const layoutH=Math.max(1,Number(window.innerHeight)||Number(document.documentElement&&document.documentElement.clientHeight)||1);const vvLeft=vv?(Number(vv.offsetLeft)||0):0;const vvTop=vv?(Number(vv.offsetTop)||0):0;const vvW=vv&&Number(vv.width)?Number(vv.width):layoutW;const vvH=vv&&Number(vv.height)?Number(vv.height):layoutH;const vvBottom=vvTop+vvH;modals.forEach((modal)=>{if(vvH>0)modal.style.setProperty("--mk-local-vh",mkLocalPx(vvH));if(!mkLocalIsTouchLikeViewport()){modal.style.removeProperty("--mk-local-doc-left");modal.style.removeProperty("--mk-local-doc-top");modal.style.removeProperty("--mk-local-doc-width");modal.style.removeProperty("--mk-local-doc-height");modal.style.removeProperty("--mk-local-visible-height");modal.style.removeProperty("--mk-local-ios-hidden-tail");const panel=modal.querySelector(".mk-local-activity-panel");if(panel)panel.classList.remove("mk-local-ios-bottom-continued");return;}
const safeStrip=Math.max(mkLocalReadSafeAreaBottomInsetPx(),vv?Math.max(0,Math.round(layoutH-vvBottom)):0,mkLocalIOSCompleteToolbarOcclusionPx());const visibleBottom=vv?Math.max(0,vvBottom):layoutH;const layoutBottom=Math.max(layoutH,visibleBottom)+Math.max(0,safeStrip);const docLeft=mkLocalPageScrollXNow()+vvLeft;const docTop=mkLocalPageScrollYNow()+vvTop;const docHeight=Math.max(80,Math.ceil(layoutBottom-vvTop));const visibleHeight=Math.max(80,Math.ceil((vv&&vvH)?vvH:layoutH));const hiddenTail=Math.max(0,Math.ceil(docHeight-visibleHeight));modal.style.setProperty("--mk-local-doc-left",mkLocalPx(docLeft));modal.style.setProperty("--mk-local-doc-top",mkLocalPx(docTop));modal.style.setProperty("--mk-local-doc-width",mkLocalPx(vvW||layoutW));modal.style.setProperty("--mk-local-doc-height",mkLocalPx(docHeight));modal.style.setProperty("--mk-local-visible-height",mkLocalPx(visibleHeight));modal.style.setProperty("--mk-local-ios-hidden-tail",mkLocalPx(hiddenTail));const panel=modal.querySelector(".mk-local-activity-panel");if(panel)panel.classList.toggle("mk-local-ios-bottom-continued",hiddenTail>12||safeStrip>12);});}catch(_){}}
function mkLocalScheduleViewportMetrics(){if(__mkLocalViewportRaf)return;const run=()=>{__mkLocalViewportRaf=0;mkLocalUpdateViewportMetrics();mkLocalUpdateAccountSectionSafeScroll();};try{__mkLocalViewportRaf=window.requestAnimationFrame?window.requestAnimationFrame(run):window.setTimeout(run,16);}catch(_){try{__mkLocalViewportRaf=window.setTimeout(run,16);}catch(__){}}}
let __mkAccountSectionSafeRaf=0;function mkLocalUpdateAccountSectionSafeScroll(){try{const touchLike=mkLocalIsTouchLikeViewport()||(Number(window.innerWidth)||9999)<=720;if(!touchLike)return;const visibleBottom=mkLocalVisibleViewportBottomPx();const guard=mkLocalAccountSafeBottomGuardPx();const usableBottom=Math.max(120,visibleBottom-guard);document.querySelectorAll(".mk-local-activity-modal.mk-local-activity-modal--account[data-type='info']").forEach((modal)=>{const outerBody=modal.querySelector(".mk-local-activity-body");const sections=Array.from(modal.querySelectorAll("details.mk-account-section[open]"));sections.forEach((section)=>{const body=section.querySelector(":scope > .mk-account-section-body");const summary=section.querySelector(":scope > .mk-account-section-summary");if(!body||!summary)return;try{if(outerBody&&outerBody.scrollHeight>outerBody.clientHeight+2){const rect=section.getBoundingClientRect();const minSection=Math.min(300,Math.max(190,visibleBottom*0.34));const overflow=(rect.top+minSection)-usableBottom;if(overflow>8){outerBody.scrollTop+=Math.ceil(overflow+12);window.setTimeout(mkLocalScheduleAccountSectionSafeScroll,45);}}}catch(_){}
const rect=section.getBoundingClientRect();const summaryRect=summary.getBoundingClientRect();const sectionTop=Math.max(0,Number(rect.top)||0);const summaryHeight=Math.max(46,Math.ceil(Number(summaryRect.height)||0));const availableForSection=Math.floor(usableBottom-sectionTop);const sectionMax=Math.max(summaryHeight+88,Math.min(420,availableForSection));const bodyMax=Math.max(86,sectionMax-summaryHeight-2);section.style.setProperty("--mk-account-section-max-safe",mkLocalPx(sectionMax));body.style.setProperty("--mk-account-section-body-max-safe",mkLocalPx(bodyMax));body.style.setProperty("--mk-account-section-safe-pad",mkLocalPx(Math.max(18,guard+4)));});});}catch(_){}}
function mkLocalScheduleAccountSectionSafeScroll(){if(__mkAccountSectionSafeRaf)return;const run=()=>{__mkAccountSectionSafeRaf=0;mkLocalUpdateAccountSectionSafeScroll();};try{__mkAccountSectionSafeRaf=window.requestAnimationFrame?window.requestAnimationFrame(run):window.setTimeout(run,16);}
catch(_){try{__mkAccountSectionSafeRaf=window.setTimeout(run,16);}catch(__){}}}
function mkLocalUnbindViewportMetrics(){try{__mkLocalViewportCleanup&&__mkLocalViewportCleanup();}catch(_){}
__mkLocalViewportCleanup=null;if(__mkLocalViewportRaf){try{if(window.cancelAnimationFrame)window.cancelAnimationFrame(__mkLocalViewportRaf);else window.clearTimeout(__mkLocalViewportRaf);}catch(_){try{window.clearTimeout(__mkLocalViewportRaf);}catch(__){}}
__mkLocalViewportRaf=0;}}
function mkLocalBindViewportMetricsOnce(){if(__mkLocalViewportCleanup)return;const update=()=>{if(!document.querySelector(".mk-local-activity-modal")){mkLocalUnbindViewportMetrics();return;}
mkLocalScheduleViewportMetrics();};const updateLater=()=>window.setTimeout(update,80);const cleanups=[];const add=(target,type,fn)=>{if(!target||!target.addEventListener)return;try{target.addEventListener(type,fn,{passive:true});}
catch(_){try{target.addEventListener(type,fn);}catch(__){return;}}
cleanups.push(()=>{try{target.removeEventListener(type,fn,{passive:true});}
catch(_){try{target.removeEventListener(type,fn);}catch(__){}}});};add(window,"resize",update);add(window,"orientationchange",updateLater);try{if(window.visualViewport){add(window.visualViewport,"resize",update);add(window.visualViewport,"scroll",update);}}catch(_){}
__mkLocalViewportCleanup=()=>{cleanups.forEach((fn)=>{try{fn();}catch(_){}});cleanups.length=0;};}
function getNotificationSeenAt(){try{return Number(localStorage.getItem(NOTIFICATION_SEEN_KEY)||"0")||0;}catch(_){return 0;}}
function setNotificationSeenAt(ts){const n=Math.max(0,Number(ts)||0);try{localStorage.setItem(NOTIFICATION_SEEN_KEY,String(n));}catch(_){}}
function getConnectionNotificationSeenAt(){try{const profile=readLocalProfile()||{};const accountKey=String(profile.accountKey||"").trim().toLowerCase();const storageKey=accountKey?`${CONNECTION_NOTIFICATION_SEEN_KEY}:${accountKey}`:CONNECTION_NOTIFICATION_SEEN_KEY;const raw=localStorage.getItem(storageKey);return raw==null?getNotificationSeenAt():(Number(raw||"0")||0);}catch(_){return getNotificationSeenAt();}}
function setConnectionNotificationSeenAt(ts){const n=Math.max(0,Number(ts)||0);try{const profile=readLocalProfile()||{};const accountKey=String(profile.accountKey||"").trim().toLowerCase();const storageKey=accountKey?`${CONNECTION_NOTIFICATION_SEEN_KEY}:${accountKey}`:CONNECTION_NOTIFICATION_SEEN_KEY;localStorage.setItem(storageKey,String(n));}catch(_){}}
function markConnectionsSeen(){setConnectionNotificationSeenAt(Date.now());setConnectionBadgeCount(0);}
function markNotificationsSeen(){const ts=Date.now();setNotificationSeenAt(ts);setNotificationBadgeCount(0);try{trackActivity("notification_read",{source:"notifications-tab",seenAt:ts},{scope:`notification_read:${new Date(ts).toISOString().slice(0,10)}`,throttleMs:0});}catch(_){}
const prof=readLocalProfile();if(prof&&prof.accountKey){apiPost("/notifications/seen",{visitorId:getVisitorId(),seenAt:ts}).then((res)=>{if(res&&res.ok&&res.seenAt){setNotificationSeenAt(Math.max(ts,Number(res.seenAt)||0));setNotificationBadgeCount(0);if(res.xpAwarded)refreshAccountXpSoon("notifications-seen",120);}}).catch(()=>{});}}
function setNotificationBadgeCount(n){const count=Math.max(0,Math.min(99,Number(n)||0));const hasBadge=count>=1;const text=count>=99?"99+":String(count);document.querySelectorAll('[data-mk-notification-badge]').forEach((el)=>{if(!el)return;el.hidden=!hasBadge;el.classList.toggle("is-empty",!hasBadge);el.setAttribute("aria-hidden",hasBadge?"false":"true");el.textContent=hasBadge?text:"";});try{if(window.MkRandomTabs&&typeof window.MkRandomTabs.setNotificationBadge==="function")window.MkRandomTabs.setNotificationBadge(count);}catch(_){}}
function setConnectionBadgeCount(n){const count=Math.max(0,Math.min(99,Number(n)||0));const hasBadge=count>=1;const text=count>=99?"99+":String(count);document.querySelectorAll('[data-mk-connection-badge]').forEach((el)=>{if(!el)return;el.hidden=!hasBadge;el.classList.toggle("is-empty",!hasBadge);el.setAttribute("aria-hidden",hasBadge?"false":"true");el.textContent=hasBadge?text:"";});try{if(window.MkRandomTabs&&typeof window.MkRandomTabs.setConnectionBadge==="function")window.MkRandomTabs.setConnectionBadge(count);}catch(_){}}
async function refreshNotificationBadgeCount(opts){const options=opts&&typeof opts==="object"?opts:{};const force=!!options.force;if(pageIsHiddenForAccountSync()&&!force)return;const prof=readLocalProfile();if(!prof||!prof.accountKey){setNotificationBadgeCount(0);setConnectionBadgeCount(0);return;}
const mobilePowerMode=isMobilePowerSensitiveViewport();const last=readLastNotificationBadgeAt();if(!force&&mobilePowerMode&&last&&Date.now()-last<MOBILE_NOTIFICATION_MIN_MS)return;if(__mkNotificationBadgePromise&&!force)return __mkNotificationBadgePromise;const load=(async()=>{const qs=new URLSearchParams();qs.set("visitorId",getVisitorId());qs.set("limit","80");const data=await apiGet(`/notifications?${qs.toString()}`);if(!data||!data.ok||!Array.isArray(data.notifications))return;touchNotificationBadgeRefresh();const serverSeen=Number(data.seenAt||0)||0;if(serverSeen>getNotificationSeenAt())setNotificationSeenAt(serverSeen);const seen=Math.max(getNotificationSeenAt(),serverSeen);const count=data.notifications.filter((x)=>!isConnectionNotificationType(x&&x.type)&&(!!(x&&x.forceUnread)||Number(x&&x.createdAt||0)>seen)).length;const connectionSeen=getConnectionNotificationSeenAt();const connectionCount=data.notifications.filter((x)=>isConnectionNotificationType(x&&x.type)&&Number(x&&x.createdAt||0)>connectionSeen).length;setNotificationBadgeCount(count);setConnectionBadgeCount(connectionCount);})();__mkNotificationBadgePromise=load;try{return await load;}finally{if(__mkNotificationBadgePromise===load)__mkNotificationBadgePromise=null;}}
function updateNotificationBadgesSoon(delay,opts){const options=opts&&typeof opts==="object"?opts:{};if(!options.force&&shouldSkipMobileBackgroundWork(options.reason||"notification-badge"))return false;try{window.clearTimeout(__mkNotificationBadgeTimer||0);}catch(_){}
__mkNotificationBadgeTimer=window.setTimeout(()=>{refreshNotificationBadgeCount(options).catch(()=>{});},Math.max(0,Number(delay)||0));return true;}
let __mkModalTooltipAlignBound=false;function iconButton(cls,icon,label){const b=el("button",`${cls || ""} mk-comment-icon-btn`.trim());b.innerHTML=`${commentSvgIcon(icon, 16)}${iconLabel(label)}`;b.setAttribute("aria-label",label||"Action");b.setAttribute("title",label||"Action");return b;}
function iconButtonAttrs(label){const safe=escapeAttr(label||"Action");return`aria-label="${safe}" title="${safe}"`;}
function readPageEditAdminKey(){try{return String(localStorage.getItem(ADMIN_TOKEN_KEY)||localStorage.getItem("mk_hot_admin_token_v1")||"").trim();}catch(_){return"";}}
function writePageEditAdminKey(key){const k=String(key||"").trim();if(!k)return;try{localStorage.setItem(ADMIN_TOKEN_KEY,k);}catch(_){}}
function renderActionMenu(menu,btn,actions,onToggle,extras){const labels=pageActionLabels();const extra=extras&&typeof extras==="object"?extras:{};menu.innerHTML="";Object.keys(labels).forEach((action)=>{const row=document.createElement("button");row.type="button";row.className="mk-page-action-item"+(actions&&actions[action]?" is-active":"");row.dataset.action=action;row.innerHTML=`${commentSvgIcon(actionIconName(action), 16)}<span>${escapeHtml(labels[action])}</span>${actions && actions[action] ? commentSvgIcon("check", 15) : ""}`;row.addEventListener("click",async(ev)=>{ev.preventDefault();ev.stopPropagation();if(!row.isConnected||!menu.contains(row)||row.disabled)return;row.disabled=true;try{await onToggle(action);}finally{row.disabled=false;}});menu.appendChild(row);});const sep=document.createElement("div");sep.className="mk-page-action-separator";menu.appendChild(sep);if(typeof extra.onEditPage==="function")menu.appendChild(pageEditRow("fileEdit","Edit page",extra.onEditPage));if(typeof extra.onAdminEdits==="function")menu.appendChild(pageEditRow("admin","Review edits",extra.onAdminEdits));}
async function fetchMarkdownThroughWorker(editHref,path){const qs=new URLSearchParams();if(editHref)qs.set("editUrl",editHref);if(path)qs.set("path",path);qs.set("debug","1");qs.set("_",String(Date.now()));try{const resp=await fetch(`${API_BASE}/page-edit/source?${qs.toString()}`,{method:"GET",cache:"no-store",headers:{"Accept":"application/json"}});const data=resp?await resp.json().catch(()=>null):null;if(data&&data.ok!==false&&typeof data.text==="string")return data;return{ok:false,status:resp?resp.status:0,error:data&&data.error?String(data.error):`Worker source request failed${resp ? `with HTTP ${resp.status}` : ""}.`,sourceOwner:data&&data.sourceOwner||"",sourceRepo:data&&data.sourceRepo||"",branch:data&&data.branch||"",sourceRoot:data&&data.sourceRoot||"",hasToken:data&&Object.prototype.hasOwnProperty.call(data,"hasToken")?!!data.hasToken:null,triedSourcePaths:data&&data.triedSourcePaths||[],githubStatuses:data&&data.githubStatuses||[],diagnostics:data&&data.diagnostics||null,debug:data&&data.debug||null,};}catch(err){return{ok:false,status:0,error:String(err&&err.message?err.message:err||"Network error while calling Worker source endpoint.")};}}
function articleFallbackMarkdown(path,reason){const heading=title()||pageEditTitleFromPath(path||currentPath());const r=reason&&typeof reason==="object"?reason:{};const lines=[];lines.push("Exact source Markdown could not be loaded by the Worker.");if(r.error)lines.push(`Reason: ${String(r.error)}`);if(r.status)lines.push(`Worker HTTP status: ${String(r.status)}`);if(r.sourceOwner||r.sourceRepo)lines.push(`Worker source repo: ${String(r.sourceOwner || "?")}/${String(r.sourceRepo || "?")} branch ${String(r.branch || "?")} root ${String(r.sourceRoot || "?")}`);if(r.hasToken!==null&&typeof r.hasToken!=="undefined")lines.push(`Worker has GitHub token: ${r.hasToken ? "yes" : "no"}`);if(Array.isArray(r.githubStatuses)&&r.githubStatuses.length)lines.push(`GitHub content status: ${r.githubStatuses.join(", ")}`);if(Array.isArray(r.triedSourcePaths)&&r.triedSourcePaths.length)lines.push(`Tried source paths: ${r.triedSourcePaths.join("; ")}`);if(r.diagnostics){const d=r.diagnostics;if(d.repoCheck)lines.push(`Repo check: HTTP ${d.repoCheck.status || 0} ${d.repoCheck.message || ""}`);if(d.branchCheck)lines.push(`Branch check: HTTP ${d.branchCheck.status || 0} ${d.branchCheck.message || ""}`);if(Array.isArray(d.directoryChecks)&&d.directoryChecks.length){lines.push(`Directory checks: ${d.directoryChecks.map((x) => `${x.path}=>HTTP ${x.status||0}`).join("; ")}`);}
if(d.likelyCause)lines.push(`Likely cause: ${d.likelyCause}`);}
lines.push("Edit this draft or replace it with the intended Markdown change.");let text="";try{const art=document.querySelector("article.md-content__inner")||document.querySelector(".md-content");const clone=art?art.cloneNode(true):null;if(clone){clone.querySelectorAll("script,style,.mk-page-comments,.mk-page-action-wrap,.mw-title-menu,#mw-mastery,#mw-mastery-compact").forEach((n)=>{try{n.remove();}catch(_){}});text=String(clone.textContent||"").replace(/\n{3,}/g,"\n\n").trim();}}catch(_){}
return`# ${heading}\n\n<!--\n${lines.join("\n")}\n-->\n\n${text}\n`;}
async function loadCurrentPageMarkdown(path){const mapped=await fetchMarkdownThroughWorker("",path);if(mapped&&mapped.ok!==false){return{ok:true,text:mapped.text,sourceUrl:mapped.sourceUrl||"",sourcePath:mapped.sourcePath||sourceMdPathFromConceptPath(path),method:mapped.method||"worker-source-map"};}
const mdPath=sourceMdPathFromConceptPath(path);return{ok:false,text:articleFallbackMarkdown(path,mapped),sourceUrl:"",sourcePath:mdPath||path,method:"worker-source-failed",sourceError:mapped||null,};}
function openPageEditModal(path){ensureStylesOnce();const p=String(path||currentPath());const panel=openLocalMiniModal("Suggest page edit");try{panel.modal.classList.add("mk-page-edit-modal");}catch(_){}
try{const unlockPageEdit=lockPageBehindPageEditModal(panel.modal);if(panel&&typeof panel.onClose==="function")panel.onClose(unlockPageEdit);}catch(_){}
const body=panel.body;body.innerHTML=`<div class="mk-local-activity-meta">Loading the Markdown source for this page…</div>`;loadCurrentPageMarkdown(p).then((loaded)=>{const original=String(loaded&&loaded.text||"");body.innerHTML="";const wrap=el("div","mk-page-edit-body");const meta=el("div","mk-page-edit-meta");const sourceNote=loaded&&loaded.ok?(/^private-source/.test(String(loaded.method||""))?" · loaded through protected source proxy":""):" · exact source not available, using a generated draft";meta.innerHTML=`<div><strong>${escapeHtml(title() || p)}</strong></div><div>Source: <code>${escapeHtml((loaded && loaded.sourcePath) || sourceMdPathFromConceptPath(p) || p)}</code>${sourceNote}</div><div>Edit the Markdown below, then submit it as a suggested typo / bug / improvement fix.</div>`;const sourceError=(!loaded||!loaded.ok)?el("div",""):null;if(sourceError)sourceError.innerHTML=pageEditSourceErrorHtml(loaded&&loaded.sourceError);const ta=document.createElement("textarea");ta.className="mk-page-edit-textarea";ta.spellcheck=false;ta.value=original;const note=document.createElement("textarea");note.className="mk-page-edit-note";note.placeholder="Optional note for the admin, for example: typo fix, bug in explanation, improved wording…";const actions=el("div","mk-page-edit-actions");const status=el("span","mk-page-edit-status","");const cancel=iconButton("mk-comment-small-btn","x","Cancel");const submit=iconButton("mk-comment-small-btn","send","Submit suggestion");const updateSubmit=()=>{submit.disabled=String(ta.value||"")===original||!String(ta.value||"").trim();};updateSubmit();ta.addEventListener("input",updateSubmit);cancel.addEventListener("click",()=>{try{panel.close();}catch(_){}});submit.addEventListener("click",async()=>{const proposed=String(ta.value||"");if(!proposed.trim()||proposed===original)return;submit.disabled=true;status.textContent="Submitting…";try{const prof=readLocalProfile();const res=await apiPost("/page-edit/submit",{path:p,title:title()||p,visitorId:getVisitorId(),accountKey:prof.accountKey||"",name:prof.name||getStoredName(),sourcePath:(loaded&&loaded.sourcePath)||sourceMdPathFromConceptPath(p)||p,sourceUrl:(loaded&&loaded.sourceUrl)||"",originalMd:original,proposedMd:proposed,note:note.value||""});if(!res||res.ok===false)throw new Error(res&&res.error||"Submit failed");status.textContent="Submitted. Thank you.";window.setTimeout(()=>{try{panel.close();}catch(_){}},650);}catch(err){status.textContent=String(err&&err.message||err||"Submit failed");submit.disabled=false;}});actions.appendChild(status);actions.appendChild(cancel);actions.appendChild(submit);wrap.appendChild(meta);if(sourceError&&String(sourceError.innerHTML||"").trim())wrap.appendChild(sourceError);wrap.appendChild(ta);wrap.appendChild(note);wrap.appendChild(actions);body.appendChild(wrap);try{ta.scrollTop=0;ta.selectionStart=0;ta.selectionEnd=0;}catch(_){}
try{ta.focus();}catch(_){}}).catch((err)=>{body.innerHTML=`<div class="mk-local-activity-empty">Could not load this page for editing: ${escapeHtml(err && err.message || err || "unknown error")}</div>`;});}
async function setPageEditSubmissionStatus(id,status,key){return apiPost("/page-edit/status",{id,status,adminKey:key||readPageEditAdminKey()});}
function openPageEditAdminManager(){ensureStylesOnce();let key=readPageEditAdminKey();if(!key){key=window.prompt("Admin key for page edit submissions:","")||"";if(!key.trim())return;writePageEditAdminKey(key);}
const panel=openLocalMiniModal("Page edit submissions");try{panel.modal.classList.add("mk-page-edit-modal");}catch(_){}
const body=panel.body;const state={status:"open",path:"",limit:80};const render=async()=>{body.innerHTML="";const top=el("div","mk-page-edit-actions");const statusSel=document.createElement("select");statusSel.className="mk-select";[["open","Open"],["reviewed","Reviewed"],["accepted","Accepted"],["rejected","Rejected"],["all","All"]].forEach(([v,l])=>{const o=document.createElement("option");o.value=v;o.textContent=l;if(v===state.status)o.selected=true;statusSel.appendChild(o);});const refresh=iconButton("mk-comment-small-btn","refresh","Refresh");const downloadAll=iconButton("mk-comment-small-btn","download","Download all as ZIP");const info=el("span","mk-page-edit-status","Loading…");top.appendChild(info);top.appendChild(statusSel);top.appendChild(refresh);top.appendChild(downloadAll);const list=el("div","mk-page-edit-admin-list");body.appendChild(top);body.appendChild(list);const qs=new URLSearchParams({key,status:state.status,limit:String(state.limit)});const data=await apiGet(`/page-edit/admin?${qs.toString()}`).catch((err)=>({ok:false,error:String(err&&err.message||err)}));if(!data||data.ok===false){info.textContent=data&&data.error?data.error:"Could not load submissions.";return;}
const items=Array.isArray(data.submissions)?data.submissions:[];info.textContent=`${items.length} shown${Number(data.total || 0) ? `· ${data.total}total` : ""}`;if(!items.length)list.appendChild(el("div","mk-local-activity-empty","No submissions found."));items.forEach((it)=>{const card=el("article","mk-page-edit-admin-card");const created=it.createdAt?new Date(Number(it.createdAt)).toLocaleString():"";card.innerHTML=`<div class="mk-page-edit-admin-title"><span>${escapeHtml(it.title || it.path || "Untitled page")}</span><span class="mk-local-pill">${escapeHtml(pageEditStatusLabel(it.status))}</span></div><div class="mk-page-edit-admin-meta">${escapeHtml(it.path || "")} · ${escapeHtml(it.sourcePath || "")} · by ${escapeHtml(it.submitterName || "Anonymous")} · ${escapeHtml(created)}</div>${it.note ? `<div class="mk-page-edit-admin-note">${escapeHtml(it.note)}</div>` : ""}<pre class="mk-page-edit-admin-preview"></pre>`;const pre=card.querySelector("pre");if(pre)pre.textContent=String(it.proposedMd||"").slice(0,9000);const actions=el("div","mk-page-edit-admin-actions");const dl=iconButton("mk-comment-small-btn","download","Download MD");const reviewed=iconButton("mk-comment-small-btn","check","Mark reviewed");const accepted=iconButton("mk-comment-small-btn","check","Accept");const rejected=iconButton("mk-comment-small-btn","x","Reject");dl.addEventListener("click",()=>downloadTextFile((it.sourcePath||it.path||it.id||"submission").replace(/[\\/:*?\"<>|]+/g,"_").replace(/\.html$/i,".md"),it.proposedMd||"","text/markdown;charset=utf-8"));reviewed.addEventListener("click",async()=>{await setPageEditSubmissionStatus(it.id,"reviewed",key);await render();});accepted.addEventListener("click",async()=>{await setPageEditSubmissionStatus(it.id,"accepted",key);await render();});rejected.addEventListener("click",async()=>{await setPageEditSubmissionStatus(it.id,"rejected",key);await render();});actions.appendChild(dl);actions.appendChild(reviewed);actions.appendChild(accepted);actions.appendChild(rejected);card.appendChild(actions);list.appendChild(card);});statusSel.addEventListener("change",()=>{state.status=statusSel.value;render().catch(()=>{});});refresh.addEventListener("click",()=>render().catch(()=>{}));downloadAll.addEventListener("click",()=>{try{const q=new URLSearchParams({key,status:state.status});window.open(`${API_BASE}/page-edit/admin-download?${q.toString()}`,"_blank","noopener");}catch(_){}});};render().catch((err)=>{body.innerHTML=`<div class="mk-local-activity-empty">${escapeHtml(err && err.message || err || "Could not load submissions.")}</div>`;});}
async function mountFavorite(){const path=currentPath();const pageTitle=title();if(!isConceptPath(path))return;const h1=document.querySelector("article.md-content__inner h1")||document.querySelector(".md-content h1")||document.querySelector("h1");if(!h1||h1.querySelector(".mk-fav-h1-btn"))return;ensureStylesOnce();const wrap=document.createElement("span");wrap.className="mk-page-action-wrap";const btn=document.createElement("button");btn.className="mk-fav-h1-btn";btn.type="button";btn.title="Page actions";btn.setAttribute("aria-label","Page actions");btn.innerHTML=actionHubSvg();const syncButtonScheme=()=>{try{const scheme=String((document.documentElement&&document.documentElement.getAttribute("data-md-color-scheme"))||(document.body&&document.body.getAttribute("data-md-color-scheme"))||"").toLowerCase();btn.classList.toggle("is-slate-scheme",scheme==="slate");}catch(_){}};syncButtonScheme();try{const obs=new MutationObserver(syncButtonScheme);obs.observe(document.documentElement,{attributes:true,attributeFilter:["data-md-color-scheme"]});if(document.body)obs.observe(document.body,{attributes:true,attributeFilter:["data-md-color-scheme"]});}catch(_){}
const menu=document.createElement("div");menu.className="mk-page-action-menu";menu.hidden=true;menu.setAttribute("data-mk-body-menu","1");menu.setAttribute("data-mk-title-ui","1");const shield=document.createElement("div");shield.className="mk-page-action-shield";shield.hidden=true;shield.setAttribute("data-mk-page-action-shield","1");try{document.querySelectorAll('.mk-page-action-menu[data-mk-body-menu="1"]').forEach((old)=>{if(old!==menu)old.remove();});document.querySelectorAll('.mk-page-action-shield[data-mk-page-action-shield="1"]').forEach((old)=>{if(old!==shield)old.remove();});}catch(_){}
document.body.appendChild(shield);document.body.appendChild(menu);wrap.appendChild(btn);h1.appendChild(wrap);let actions={};const updateButton=()=>{const active=Object.keys(actions||{}).filter((k)=>actions[k]);btn.classList.remove("is-favorited");btn.classList.toggle("has-actions",active.length>0);btn.title=active.length?`Saved to: ${active.map((a) => pageActionLabels()[a] || a).join(", ")}`:"Page actions";};const positionMenu=()=>{if(menu.hidden)return;try{const rect=btn.getBoundingClientRect();const gap=8;const vw=Math.max(document.documentElement.clientWidth||0,window.innerWidth||0);const vh=Math.max(document.documentElement.clientHeight||0,window.innerHeight||0);const mw=Math.max(1,Math.ceil(menu.offsetWidth||menu.scrollWidth||0));const mh=Math.max(menu.offsetHeight||0,0);const left=Math.max(8,Math.min(vw-mw-8,rect.right-mw));const top=Math.max(8,Math.min(vh-mh-8,rect.bottom+gap));menu.style.position="fixed";menu.style.left=`${left}px`;menu.style.top=`${top}px`;menu.style.right="auto";}catch(_){}};const closeTopNavMenusForPageAction=()=>{try{document.documentElement.classList.add("mk-page-action-menu-open");if(document.body)document.body.classList.add("mk-page-action-menu-open");}catch(_){}
try{document.querySelectorAll(".mk-rt-panel.mk-rt-open,.md-tab-dropdown-panel.md-random-dropdown-panel").forEach((node)=>{try{node.classList.remove("mk-rt-open","md-random-dropdown-open","is-open");}catch(_){}
try{node.setAttribute("aria-hidden","true");}catch(_){}});}catch(_){}
try{document.querySelectorAll(".mk-rt-trigger[aria-expanded='true'],.mk-random-tabs-menu button[aria-expanded='true']").forEach((node)=>{try{node.setAttribute("aria-expanded","false");}catch(_){}});}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-page-action-menu-toggle",{detail:{open:true,source:"page-actions"}}));}catch(_){}};const releaseTopNavMenusForPageAction=()=>{try{document.documentElement.classList.remove("mk-page-action-menu-open");if(document.body)document.body.classList.remove("mk-page-action-menu-open");}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-page-action-menu-toggle",{detail:{open:false,source:"page-actions"}}));}catch(_){}};const markMenuGuard=()=>{try{window.__mkPageActionMenuOpen=!menu.hidden;}catch(_){}
try{window.__mkPageActionMenuGuardUntil=Date.now()+900;}catch(_){}};const stopPageActionMenuEvent=(ev,opts)=>{markMenuGuard();const prevent=!!(opts&&opts.prevent);try{if(prevent&&ev&&ev.cancelable!==false)ev.preventDefault();}catch(_){}
try{ev&&ev.stopPropagation&&ev.stopPropagation();}catch(_){}
try{ev&&ev.stopImmediatePropagation&&ev.stopImmediatePropagation();}catch(_){}};const closeMenu=()=>{menu.hidden=true;shield.hidden=true;menu.innerHTML="";releaseTopNavMenusForPageAction();try{window.__mkPageActionMenuOpen=false;}catch(_){}
try{window.__mkPageActionMenuGuardUntil=Date.now()+900;}catch(_){}};const openMenu=()=>{if(!btn.isConnected||currentPath()!==path||window.__mkAccountWorkspaceSwitching){closeMenu();return;}
loadState();const context=captureSocialAccountContext();closeTopNavMenusForPageAction();renderActionMenu(menu,btn,actions,(action)=>toggleAction(action,context),{onEditPage:async()=>{closeMenu();openPageEditModal(path);},onAdminEdits:async()=>{closeMenu();openPageEditAdminManager();}});menu.hidden=false;shield.hidden=false;markMenuGuard();positionMenu();try{requestAnimationFrame(positionMenu);}catch(_){}};const loadState=()=>{const localActions=Object.assign({},pageActionMapForPathFromLocal(path));try{if(window.MkAccountData&&typeof window.MkAccountData.getStateForPage==="function"){const state=window.MkAccountData.getStateForPage(path)||{};actions=Object.assign({},state.actions||{},localActions);}else{actions=localActions;}}catch(_){actions=localActions;}
Object.keys(actions).forEach((k)=>{if(!actions[k])delete actions[k];});updateButton();};const toggleAction=async(action,context)=>{if(!btn.isConnected||currentPath()!==path||!socialAccountContextIsCurrent(context)){closeMenu();return;}
loadState();const nextActive=!actions[action];if(nextActive&&!ecConsumeGuestAction("save_page",{source:"page-actions",path,title:pageTitle,action}))return;actions=Object.assign({},actions,{[action]:nextActive});if(!nextActive)delete actions[action];saveLocalPageAction(path,pageTitle,action,nextActive);try{if(window.MkAccountData&&typeof window.MkAccountData.scheduleAutoSync==="function")window.MkAccountData.scheduleAutoSync("page-action-toggle");}catch(_){}
updateButton();if(!menu.hidden)openMenu();else menu.innerHTML="";};btn.addEventListener("click",(ev)=>{ev.preventDefault();ev.stopPropagation();if(menu.hidden)openMenu();else closeMenu();});["pointerdown","pointerup","mousedown","mouseup","touchstart","touchend","click","dblclick"].forEach((type)=>{try{menu.addEventListener(type,(ev)=>stopPageActionMenuEvent(ev,{prevent:false}));}catch(_){}
try{wrap.addEventListener(type,(ev)=>{if(type==="click")return;stopPageActionMenuEvent(ev,{prevent:false});});}catch(_){}
try{shield.addEventListener(type,(ev)=>{stopPageActionMenuEvent(ev,{prevent:true});if(type==="click"||type==="touchend")closeMenu();});}catch(_){}});document.addEventListener("click",(ev)=>{if(!wrap.contains(ev.target)&&!menu.contains(ev.target))closeMenu();},true);window.addEventListener("resize",positionMenu,{passive:true});window.addEventListener("scroll",positionMenu,{passive:true,capture:true});document.addEventListener("keydown",(ev)=>{if(ev&&ev.key==="Escape")closeMenu();});await loadState();}
let MK_COMMENT_EMOJI_RE=null;function commentEmojiRegex(){if(MK_COMMENT_EMOJI_RE!==null)return MK_COMMENT_EMOJI_RE;try{MK_COMMENT_EMOJI_RE=new RegExp("(\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*|[\\u{1F1E6}-\\u{1F1FF}]{2})","gu");}catch(_){MK_COMMENT_EMOJI_RE=/([\uD800-\uDBFF][\uDC00-\uDFFF](?:\uFE0F|\uFE0E)?(?:\u200D[\uD800-\uDBFF][\uDC00-\uDFFF](?:\uFE0F|\uFE0E)?)*)/g;}
return MK_COMMENT_EMOJI_RE;}
function syncCommentEmojiEffectClass(){try{document.body.classList.remove("mk-comment-effect-emoji-sparkle");}catch(_){}}
function commentEmojiShouldRenderAnimated(item){const cp=String(item&&item.codepoint||"").replace(/[^0-9a-f_]/gi,"").toLowerCase();const ent=window.MkAccountData&&typeof window.MkAccountData.getEmojiEntitlements==="function"?window.MkAccountData.getEmojiEntitlements():null;return!!(cp&&ent&&emojiFamilyOwns(ent.stickerDynamic,cp));}
function applyEmojiThumb(cell){if(!cell||cell.__thumbApplied)return;cell.__thumbApplied=true;cell.classList.remove("mk-emoji-thumb-pending");const src=cell.getAttribute("data-thumb-src");if(!src)return;const img=document.createElement("img");img.className="mk-comment-emoji-choice-img";img.alt=cell.getAttribute("data-thumb-alt")||"";img.loading="lazy";img.decoding="async";img.addEventListener("load",()=>{try{cell.classList.add("has-thumb");}catch(_){}});img.src=src;cell.appendChild(img);}
function markEmojiThumbPending(cell,src,alt){if(!cell||!src){if(cell)cell.textContent=alt||"";return;}
cell.textContent="";cell.classList.add("mk-emoji-thumb-pending");cell.setAttribute("data-thumb-src",src);cell.setAttribute("data-thumb-alt",alt||"");}
function lazyLoadEmojiThumbs(grid){if(!grid)return;const cells=Array.prototype.filter.call(grid.querySelectorAll(".mk-emoji-thumb-pending"),(cell)=>!cell.__thumbObserved);if(!cells.length)return;if(typeof IntersectionObserver!=="function"){cells.forEach((cell)=>applyEmojiThumb(cell));return;}
const obs=new IntersectionObserver((entries,o)=>{entries.forEach((entry)=>{if(!entry.isIntersecting)return;o.unobserve(entry.target);applyEmojiThumb(entry.target);});},{root:null,rootMargin:"240px 0px",threshold:0});cells.forEach((cell)=>{cell.__thumbObserved=true;obs.observe(cell);});}
function renderEmojiCells(grid,items,makeCell){if(!grid)return;const list=Array.isArray(items)?items:[];const frag=document.createDocumentFragment();for(let i=0;i<list.length;i++){const cell=makeCell(list[i],i);if(cell)frag.appendChild(cell);}
grid.appendChild(frag);lazyLoadEmojiThumbs(grid);}
async function buyEmojiUnlock(item,kind,tier,source){const cp=String(item&&item.codepoint||"").replace(/[^0-9a-f_]/gi,"").toLowerCase();if(!cp)return{ok:false,error:"missing_emoji"};const api=window.MkAccountData||null;if(!api||typeof api.buyOffCatalogItem!=="function")return{ok:false,error:"shop_unavailable"};const ent=emojiEntitlements();const price=emojiUnlockPrice(kind,tier,ent,cp);const itemId=emojiUnlockItemId(kind,tier,cp);const unlockKind=`${kind}${tier === "dynamic" ? "Dynamic" : "Static"}`;return api.buyOffCatalogItem({id:itemId,title:`${tier === "dynamic" ? "Dynamic" : "Static"} emoji ${kind}: ${item.emoji || ""}`,category:"Emoji unlocks",price,consumable:false},{source:source||"emoji-unlock",extraDetails:{emojiCodepoint:cp,emoji:item.emoji||"",emojiLabel:item.label||"",emojiUnlocks:[{kind:unlockKind,codepoint:cp}]}});}
async function ensureCommentEmojiUnlocked(item){const cp=String(item&&item.codepoint||"").replace(/[^0-9a-f_]/gi,"").toLowerCase();if(!cp)return false;let ent=emojiEntitlements();if(emojiFamilyOwns(ent.stickerDynamic,cp))return true;if(emojiFamilyOwns(ent.stickerStatic,cp)){if(!window.confirm(`Use this emoji as a static sticker, or unlock its animated sticker for 50 EORbits?

OK = unlock animated
Cancel = use static`))return true;const up=await buyEmojiUnlock(item,"sticker","dynamic","comment-emoji-upgrade");if(!up||up.ok===false){window.alert((up&&up.error==="insufficient_funds")?`Not enough EORbits. You need ${up.price || 50}.`:"Could not unlock the animated emoji.");return false;}
return true;}
const raw=window.prompt(`Unlock ${item.emoji || "this emoji"} for comments? Enter 10 for static or 60 for animated:`,"10");if(raw==null)return false;const wantsDynamic=Number(raw)>=60||/^dynamic|animated$/i.test(String(raw).trim());const res=await buyEmojiUnlock(item,"sticker",wantsDynamic?"dynamic":"static",wantsDynamic?"comment-emoji-dynamic":"comment-emoji-static");if(!res||res.ok===false){window.alert((res&&res.error==="insufficient_funds")?`Not enough EORbits. You need ${res.price || (wantsDynamic ? 60 : 10)}.`:"Could not unlock this emoji.");return false;}
return true;}
function avatarEmojiUnlockState(item,entitlements){const cp=String(item&&item.codepoint||"").replace(/[^0-9a-f_]/gi,"").toLowerCase();const baseCp=emojiBaseCodepoint(cp);const ent=entitlements||emojiEntitlements();return{cp,ent,hasStatic:!!(cp&&emojiFamilyOwns(ent.avatarStatic,cp)),hasDynamic:!!(cp&&emojiFamilyOwns(ent.avatarDynamic,cp)),staticPrice:emojiUnlockPrice("avatar","static",ent,baseCp),dynamicPrice:emojiUnlockPrice("avatar","dynamic",ent,baseCp)};}
async function ensureAvatarEmojiUnlocked(item,tier){const st=avatarEmojiUnlockState(item);if(!st.cp)return false;const wantsDynamic=tier==="dynamic";if(wantsDynamic&&st.hasDynamic)return true;if(!wantsDynamic&&st.hasStatic)return true;const price=wantsDynamic?st.dynamicPrice:st.staticPrice;if(!window.confirm(`Unlock ${wantsDynamic ? "animated" : "static"} emoji avatar ${item.emoji || ""} for ${price} EORbits?`))return false;const res=await buyEmojiUnlock(item,"avatar",wantsDynamic?"dynamic":"static",wantsDynamic?"avatar-emoji-dynamic":"avatar-emoji-static");if(!res||res.ok===false){window.alert((res&&res.error==="insufficient_funds")?`Not enough EORbits. You need ${res.price || price}.`:"Could not unlock this emoji avatar.");return false;}
return true;}
async function buyCustomAvatarUpload(){const price=100;const api=window.MkAccountData||null;if(!api||typeof api.buyOffCatalogItem!=="function")return{ok:false,error:"shop_unavailable",price};return api.buyOffCatalogItem({id:"custom_avatar_upload",title:"Custom image avatar upload",category:"Avatar",price,consumable:true},{source:"custom-avatar-upload",extraDetails:{avatarUpload:true,customAvatar:true}});}
function renderCommentEmojiHtml(emoji){const key=normaliseNotoEmojiText(emoji);const item=__commentEmojiByText.get(key);if(!item)return escapeHtml(emoji);const animated=commentEmojiShouldRenderAnimated(item);const src=animated?item.animatedUrl:item.staticUrl;const fallback=animated?item.staticUrl:"";const attrs=[`class="mk-noto-comment-emoji${animated ? " is-animated" : " is-static"}"`,`src="${escapeAttr(src)}"`,fallback?`data-static-src="${escapeAttr(fallback)}"`:"",`alt="${escapeAttr(item.emoji || emoji)}"`,`title="${escapeAttr(item.label || item.emoji || emoji)}"`,`loading="lazy"`,`decoding="async"`].filter(Boolean).join(" ");return`<img ${attrs}>`;}
function renderCommentTextHtml(text){const s=String(text||"");if(!s)return"";if(!__commentEmojiDataReady){loadCommentEmojiData();return escapeHtml(s);}
const re=__commentEmojiExactRe||commentEmojiRegex();try{re.lastIndex=0;}catch(_){}
let out="";let last=0;try{for(const m of s.matchAll(re)){const idx=Number(m.index||0);const emoji=String(m[0]||"");if(!emoji)continue;out+=escapeHtml(s.slice(last,idx));out+=renderCommentEmojiHtml(emoji);last=idx+emoji.length;}}catch(_){return escapeHtml(s);}
out+=escapeHtml(s.slice(last));return out;}
function insertCommentEmoji(textarea,emoji){if(!textarea||!emoji)return;const value=String(textarea.value||"");const max=Number(textarea.maxLength||0);const start=Number.isFinite(textarea.selectionStart)?textarea.selectionStart:value.length;const end=Number.isFinite(textarea.selectionEnd)?textarea.selectionEnd:value.length;const next=value.slice(0,start)+emoji+value.slice(end);if(max>0&&next.length>max)return;textarea.value=next;const pos=start+emoji.length;try{textarea.setSelectionRange(pos,pos);}catch(_){}
try{textarea.dispatchEvent(new Event("input",{bubbles:true}));}catch(_){}
try{textarea.focus();}catch(_){}}
function commentTextareaWithEmoji(textarea){syncCommentEmojiEffectClass();const wrap=el("div","mk-comment-text-wrap");const btn=iconButton("mk-comment-small-btn mk-comment-emoji-btn","emoji","Add emoji");btn.type="button";btn.setAttribute("aria-expanded","false");const menu=el("div","mk-comment-emoji-menu");menu.hidden=true;let selectedCategory="";let selectedToneBase="";const fallbackItems=()=>profileEmojiChoices().map((emoji)=>({emoji,label:emoji,category:"Emoji",staticUrl:"",animatedUrl:""}));const insertEmojiFromItem=async(baseItem,emojiToInsert)=>{if(!(await ensureCommentEmojiUnlocked(baseItem)))return false;insertCommentEmoji(textarea,emojiToInsert);rememberCommentEmojiUse(baseItem);return true;};const makeChoiceCell=(item)=>{const emoji=item.emoji||"";const variantWord=(item.variantLabel||"variant").toLowerCase();const choice=el("button","mk-comment-emoji-choice"+(item.hasVariants?" has-tone-variants":""),"");choice.type="button";choice.setAttribute("aria-label",item.hasVariants?`Choose ${variantWord} for ${item.label || emoji}`:`Insert ${item.label || emoji}`);if(item.animatedUrl||item.staticUrl){const src=commentEmojiShouldRenderAnimated(item)?item.animatedUrl:item.staticUrl;markEmojiThumbPending(choice,src||item.staticUrl,emoji);}else{choice.textContent=emoji;}
const ent=emojiEntitlements();const cp=String(item.codepoint||normaliseNotoEmojiText(emoji)).replace(/[^0-9a-f_]/gi,"").toLowerCase();const baseCp=emojiFamilyBase(cp);const unlocked=emojiFamilyOwns(ent.stickerStatic,cp)||emojiFamilyOwns(ent.stickerDynamic,cp);if(!unlocked)choice.classList.add("is-locked");choice.title=item.hasVariants?`Pick a ${variantWord}`:(unlocked?(item.label||emoji):"Unlock this emoji to use it in comments");choice.addEventListener("click",async(ev)=>{ev.preventDefault();ev.stopPropagation();if(item.hasVariants){selectedToneBase=(selectedToneBase===baseCp)?"":baseCp;renderMenu();positionMenu();return;}
if(await insertEmojiFromItem(item,emoji)){renderMenu();positionMenu();}});return choice;};const buildVariantStrip=(baseItem)=>{const strip=el("div","mk-comment-emoji-tonestrip");strip.appendChild(el("span","mk-comment-emoji-tonestrip-label",`${baseItem.variantLabel || "Variant"} · ${baseItem.label || baseItem.emoji || ""}`));const row=el("div","mk-comment-emoji-tonestrip-row");(baseItem.variantItems||[baseItem]).forEach((variant)=>{const vEmoji=variant.emoji||"";const b=el("button","mk-comment-emoji-choice","");b.type="button";b.setAttribute("aria-label",`Insert ${variant.label || vEmoji}`);if(variant.animatedUrl||variant.staticUrl){const src=commentEmojiShouldRenderAnimated(variant)?variant.animatedUrl:variant.staticUrl;markEmojiThumbPending(b,src||variant.staticUrl,vEmoji);}else{b.textContent=vEmoji;}
b.addEventListener("click",async(ev)=>{ev.preventDefault();ev.stopPropagation();if(await insertEmojiFromItem(baseItem,vEmoji)){selectedToneBase="";renderMenu();positionMenu();}});row.appendChild(b);});strip.appendChild(row);lazyLoadEmojiThumbs(row);return strip;};const renderMenu=()=>{const byCat=commentEmojiChoicesByCategory();const cats=byCat.size?Array.from(byCat.keys()):["Emoji"];if(!selectedCategory||!cats.includes(selectedCategory))selectedCategory=cats[0]||"Emoji";const items=(byCat.get(selectedCategory)||(byCat.size?[]:fallbackItems())).slice(0,500);menu.innerHTML="";const tabs=el("div","mk-comment-emoji-tabs");cats.forEach((cat)=>{const tab=el("button","mk-comment-emoji-tab"+(cat===selectedCategory?" is-active":""),commentEmojiCategoryLabel(cat));tab.type="button";tab.addEventListener("click",(ev)=>{ev.preventDefault();ev.stopPropagation();selectedCategory=cat;selectedToneBase="";renderMenu();positionMenu();});tabs.appendChild(tab);});menu.appendChild(tabs);const toneBaseItem=selectedToneBase?emojiVariantFamilyRep(selectedToneBase):null;if(toneBaseItem&&toneBaseItem.hasVariants)menu.appendChild(buildVariantStrip(toneBaseItem));const grid=el("div","mk-comment-emoji-grid");menu.appendChild(grid);if(!items.length)menu.appendChild(el("div","mk-comment-emoji-loading","Loading emoji..."));renderEmojiCells(grid,items,makeChoiceCell);};const dataReadyAtFirstRender=__commentEmojiDataReady;renderMenu();if(!dataReadyAtFirstRender){loadCommentEmojiData().then(()=>{renderMenu();positionMenu();}).catch(()=>{});}
let emojiMenuOpenRect=null;const viewportBounds=()=>{const vv=window.visualViewport||null;const vw=Math.max(240,Number(vv&&vv.width||document.documentElement.clientWidth||window.innerWidth||360));const vh=Math.max(240,Number(vv&&vv.height||document.documentElement.clientHeight||window.innerHeight||640));const leftEdge=Number(vv&&vv.offsetLeft||0);const topEdge=Number(vv&&vv.offsetTop||0);return{vw,vh,leftEdge,topEdge,rightEdge:leftEdge+vw,bottomEdge:topEdge+vh};};const shouldCloseEmojiMenuAfterScroll=()=>{if(!emojiMenuOpenRect)return false;try{const b=viewportBounds();const rect=btn.getBoundingClientRect();const movedTooFar=Math.abs(rect.top-Number(emojiMenuOpenRect.top||0))>170;const offScreen=rect.bottom<b.topEdge+8||rect.top>b.bottomEdge-8||rect.right<b.leftEdge+8||rect.left>b.rightEdge-8;return movedTooFar||offScreen;}catch(_){return false;}};const closeMenu=()=>{menu.hidden=true;emojiMenuOpenRect=null;btn.setAttribute("aria-expanded","false");};const positionMenu=()=>{if(!menu||menu.hidden)return;if(shouldCloseEmojiMenuAfterScroll()){closeMenu();return;}
try{const b=viewportBounds();const margin=10;const gap=8;const rect=btn.getBoundingClientRect();const maxAvailable=Math.max(132,Math.max(rect.top-b.topEdge,b.bottomEdge-rect.bottom)-margin-gap);const maxHeight=Math.min(window.matchMedia&&window.matchMedia("(max-width: 700px)").matches?210:230,maxAvailable);menu.style.maxHeight=`${Math.max(132, Math.floor(maxHeight))}px`;const mw=Math.max(menu.offsetWidth||280,Math.min(340,b.vw-margin*2));const mh=Math.min(menu.scrollHeight||menu.offsetHeight||180,Math.max(132,Math.floor(maxHeight)));const spaceBelow=b.bottomEdge-rect.bottom-margin;const spaceAbove=rect.top-b.topEdge-margin;const openAbove=spaceBelow<Math.min(180,mh+gap)&&spaceAbove>spaceBelow;let top=openAbove?rect.top-mh-gap:rect.bottom+gap;top=Math.max(b.topEdge+margin,Math.min(b.bottomEdge-mh-margin,top));let left=rect.right-mw;left=Math.max(b.leftEdge+margin,Math.min(b.rightEdge-mw-margin,left));menu.style.left=`${Math.round(left)}px`;menu.style.top=`${Math.round(top)}px`;menu.style.right="auto";menu.style.bottom="auto";}catch(_){}};const openMenu=()=>{try{emojiMenuOpenRect=btn.getBoundingClientRect();}catch(_){emojiMenuOpenRect=null;}
menu.hidden=false;btn.setAttribute("aria-expanded","true");positionMenu();try{requestAnimationFrame(positionMenu);}catch(_){}};btn.addEventListener("click",(ev)=>{ev.preventDefault();ev.stopPropagation();if(menu.hidden)openMenu();else closeMenu();});menu.addEventListener("click",(ev)=>ev.stopPropagation());document.addEventListener("click",(ev)=>{if(!wrap.contains(ev.target))closeMenu();},true);document.addEventListener("keydown",(ev)=>{if(ev&&ev.key==="Escape")closeMenu();});window.addEventListener("resize",positionMenu,{passive:true});window.addEventListener("scroll",positionMenu,{passive:true,capture:true});try{if(window.visualViewport)window.visualViewport.addEventListener("resize",positionMenu,{passive:true});}catch(_){}
wrap.appendChild(textarea);wrap.appendChild(btn);wrap.appendChild(menu);return wrap;}
function getStoredName(){try{return localStorage.getItem("mk_comment_name_v1")||"";}catch(_){return"";}}
function setStoredName(name){try{localStorage.setItem("mk_comment_name_v1",String(name||"").trim());}catch(_){}}
function formNode(parentId,onDone){const f=el("form","mk-comment-form mk-comment-composer-form");const formPath=currentPath();const formPageTitle=title();let formAccountContext=captureSocialAccountContext();const formIsCurrent=()=>f.isConnected&&currentPath()===formPath&&socialAccountContextIsCurrent(formAccountContext);let pendingReplyRefresh=false;const profile=readLocalProfile();const hasCloudAccount=!!String(profile.accountKey||"").trim();const hasProfile=!!(profile.name&&hasCloudAccount);const formAvatar=el("div","mk-comment-form-avatar");formAvatar.innerHTML=hasProfile?avatarHtml(profile.name,profile.avatar||"",profile.avatarFrame||"level-1"):avatarHtml("Guest","👤","level-1");formAvatar.title=hasProfile?profile.name:"Guest";const formContent=el("div","mk-comment-form-content");f.appendChild(formAvatar);f.appendChild(formContent);let nameInput=null;if(!hasProfile){nameInput=document.createElement("input");nameInput.className="mk-comment-name-input";nameInput.name="name";nameInput.placeholder="Name (optional)";nameInput.setAttribute("aria-label","Name, optional");nameInput.value=cleanProfileNameLocal(profile.name||getStoredName()||"");nameInput.maxLength=40;const updateGuestAvatar=()=>{const guestName=cleanProfileNameLocal(nameInput.value||"");formAvatar.innerHTML=guestName?avatarHtml(guestName,"","level-1"):avatarHtml("Guest","👤","level-1");formAvatar.title=guestName||"Guest";};nameInput.addEventListener("input",updateGuestAvatar);updateGuestAvatar();}
const text=document.createElement("textarea");text.name="text";const composerPageTitle=title().slice(0,72);text.placeholder=parentId?"Write a reply...":`Share a thought${composerPageTitle ? `about ${composerPageTitle}` : ""}...`;text.maxLength=1200;let anonBox=null;let identityControls=null;if(hasProfile){const anonWrap=el("div","mk-comment-anon-wrap");const anonRow=el("label","mk-comment-anon-row");anonBox=document.createElement("input");anonBox.type="checkbox";anonBox.name="anonymous";anonBox.checked=false;anonRow.appendChild(anonBox);anonRow.appendChild(el("span","","Post anonymously"));const anonInfo=el("button","mk-comment-anon-info","i");anonInfo.type="button";anonInfo.setAttribute("aria-label","About anonymous comments");anonInfo.setAttribute("aria-expanded","false");const anonNote=el("div","mk-comment-anon-note","Anonymous comments stay hidden from your public identity and do not earn XP when posted.");anonNote.hidden=true;anonInfo.addEventListener("click",(ev)=>{ev.preventDefault();ev.stopPropagation();anonNote.hidden=!anonNote.hidden;anonInfo.setAttribute("aria-expanded",anonNote.hidden?"false":"true");});anonWrap.appendChild(anonRow);anonWrap.appendChild(anonInfo);anonWrap.appendChild(anonNote);identityControls=anonWrap;}else{const guestIdentity=el("div","mk-comment-guest-identity");guestIdentity.appendChild(nameInput);guestIdentity.appendChild(el("span","mk-comment-guest-identity-note","Leave blank to post anonymously"));identityControls=guestIdentity;}
const actions=el("div","mk-comment-form-actions");const submit=iconButton("mk-comment-primary-btn",parentId?"reply":"send",parentId?"Reply":"Post");submit.type="button";if(parentId){const cancel=iconButton("mk-comment-small-btn","x","Cancel");cancel.type="button";actions.appendChild(cancel);cancel.addEventListener("click",()=>{const refresh=pendingReplyRefresh&&formIsCurrent();pendingReplyRefresh=false;f.remove();if(refresh&&typeof onDone==="function")onDone({ok:true,reconcileOnly:true});});}
actions.appendChild(submit);const updateSubmitState=()=>{const hasText=!!String(text.value||"").trim();submit.disabled=!hasText;submit.setAttribute("aria-disabled",submit.disabled?"true":"false");};text.addEventListener("input",updateSubmitState);if(nameInput)nameInput.addEventListener("input",updateSubmitState);if(anonBox)anonBox.addEventListener("change",updateSubmitState);const footer=el("div","mk-comment-form-footer");footer.appendChild(identityControls);footer.appendChild(actions);formContent.appendChild(commentTextareaWithEmoji(text));formContent.appendChild(footer);updateSubmitState();let submittingComment=false;const handleCommentSubmit=async(ev)=>{if(ev&&typeof ev.preventDefault==="function")ev.preventDefault();if(ev&&typeof ev.stopPropagation==="function")ev.stopPropagation();if(submittingComment)return;if(!formIsCurrent()){window.alert("This comment form belongs to a previous page or account. Refresh the page before posting; your draft has not been sent.");return;}
const profileBefore=readLocalProfile();const guestName=cleanProfileNameLocal(nameInput&&nameInput.value||"");const sendAnonymous=hasProfile?!!(anonBox&&anonBox.checked):!guestName;const nm=sendAnonymous?"Anonymous":(hasProfile?cleanProfileNameLocal(profileBefore.name||profile.name):cleanProfileNameLocal(nameInput&&nameInput.value||""));const av=sendAnonymous?"":(hasProfile?cleanAvatarLocal(profileBefore.avatar||profile.avatar||""):"");const tx=String(text.value||"").trim();if(!tx){text.focus();return;}
if(sendAnonymous&&hasUsedAnonymousCommentToday()){window.alert(anonymousCommentDailyLimitMessage());return;}
if(!ecConsumeGuestAction("comment",{source:parentId?"comment-reply":"comment-post",path:currentPath(),title:title(),dedupeMs:2500}))return;if(submit.disabled)return;submittingComment=true;submit.disabled=true;const optimisticId=!parentId?`local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`:"";let optimisticSent=false;let textClearedEarly=false;const clearSubmittedTextEarly=()=>{if(parentId||textClearedEarly)return;textClearedEarly=true;text.value="";try{text.dispatchEvent(new Event("input",{bubbles:true}));}catch(_){}
updateSubmitState();};const restoreSubmittedText=()=>{if(!textClearedEarly)return;textClearedEarly=false;const newerDraft=String(text.value||"");text.value=newerDraft.trim()&&newerDraft.trim()!==tx?`${tx}\n\n${newerDraft}`:tx;try{text.dispatchEvent(new Event("input",{bubbles:true}));}catch(_){}
updateSubmitState();};const keepNewReplyDraft=(message)=>{const draft=String(text.value||"").trim();if(!parentId||!draft||draft===tx)return false;pendingReplyRefresh=true;let status=f.querySelector(".mk-comment-draft-status");if(!status){status=el("div","mk-comment-draft-status");status.setAttribute("role","status");formContent.appendChild(status);}
status.textContent=message;updateSubmitState();return true;};const emitOptimisticComment=()=>{if(!optimisticId||optimisticSent||typeof onDone!=="function")return;optimisticSent=true;onDone({ok:true,optimistic:true,comment:{id:optimisticId,path:currentPath(),title:title(),parentId:"",name:nm,avatar:av,avatarFrame:profileBefore.avatarFrame||"level-1",text:tx,ts:Date.now(),editedAt:0,deleted:false,pending:true,reactions:{},isOwner:true},profile:{name:nm,avatar:av,avatarFrame:profileBefore.avatarFrame||"level-1"}});};const removeOptimisticComment=()=>{if(optimisticSent&&optimisticId&&typeof onDone==="function")onDone({ok:false,removeOptimisticId:optimisticId});};emitOptimisticComment();if(optimisticSent)clearSubmittedTextEarly();const hadAccountBefore=!!String(profileBefore.accountKey||"").trim();let createdAccountFromName=false;let profileNow={name:nm,avatar:av,avatarFrame:profileBefore.avatarFrame||"level-1",accountKey:profileBefore.accountKey||""};if(!sendAnonymous&&!hadAccountBefore){const privacyChoice=defaultNewAccountPrivacy();const identity=await saveOnlineProfile(nm,av,{keepAvatar:false,privacy:privacyChoice,isPublic:false,askPrivacy:false,bio:profileBefore.bio||""});if(!identity.ok){if(isLikelyLostPostResponse(identity)){profileNow=writeLocalProfile(Object.assign({},profileBefore,{name:nm,avatar:av,avatarFrame:profileBefore.avatarFrame||"level-1"}));}else{submittingComment=false;submit.disabled=false;restoreSubmittedText();removeOptimisticComment();alertCooldown(identity);if(nameInput)nameInput.focus();return;}}else{profileNow=identity.profile||{name:nm,avatar:av,avatarFrame:"level-1",accountKey:""};createdAccountFromName=true;const nextContext=captureSocialAccountContext();if(nextContext.visitorId===formAccountContext.visitorId&&nextContext.accountKey===String(profileNow.accountKey||"").trim().toLowerCase()&&nextContext.accountKey)formAccountContext=nextContext;}}else if(!sendAnonymous){profileNow=Object.assign({},profileBefore,{name:nm,avatar:av||profileBefore.avatar||"",avatarFrame:profileBefore.avatarFrame||"level-1",accountKey:profileBefore.accountKey||""});}
if(!formIsCurrent()){submittingComment=false;restoreSubmittedText();updateSubmitState();return;}
const res=await apiPost("/comments",{path:formPath,title:formPageTitle,visitorId:getVisitorId(),parentId:parentId||"",name:profileNow.name,avatar:profileNow.avatar||av,avatarFrame:profileNow.avatarFrame||"level-1",keepAvatar:!sendAnonymous&&isImageAvatar(profileNow.avatar||av),text:tx,anonymous:sendAnonymous});submittingComment=false;submit.disabled=false;if(!socialAccountContextIsCurrent(formAccountContext)){restoreSubmittedText();return;}
if(!res||!res.ok){if(!formIsCurrent()){restoreSubmittedText();return;}
if(isLikelyLostPostResponse(res)){if(sendAnonymous)markAnonymousCommentUsedToday();if(parentId){if(keepNewReplyDraft("The reply may have been sent. Your new draft is still here; the list will refresh when you finish or cancel it."))return;f.remove();}else if(sendAnonymous||hasProfile||profileNow.name){if(!textClearedEarly)text.value="";try{text.dispatchEvent(new Event("input",{bubbles:true}));}catch(_){}
updateSubmitState();}
if(typeof onDone==="function")onDone({ok:true,reconcileOnly:true,keepOptimistic:true});return;}
restoreSubmittedText();removeOptimisticComment();const msg=res&&(res.code==="anonymous_daily_limit"||res.code==="anon_daily_limit")?anonymousCommentDailyLimitMessage():((res&&res.error)||"Could not post this comment.");window.alert(msg);return;}
if(sendAnonymous)markAnonymousCommentUsedToday();let finalProfile=profileNow;if(!sendAnonymous){finalProfile=writeLocalProfile(Object.assign({},profileNow,res.profile||{},{accountKey:(res.profile&&res.profile.accountKey)||profileNow.accountKey||"",avatarFrame:(res.profile&&res.profile.avatarFrame)||profileNow.avatarFrame||"level-1",}));}
if(!sendAnonymous&&res.comment&&res.comment.id){saveLocalComment({id:res.comment.id,path:formPath,title:formPageTitle,parentId:parentId||"",name:(res.profile&&res.profile.name)||finalProfile.name||profileNow.name,avatar:(res.profile&&res.profile.avatar)||finalProfile.avatar||profileNow.avatar||"",avatarFrame:(res.profile&&res.profile.avatarFrame)||finalProfile.avatarFrame||profileNow.avatarFrame||"level-1",text:tx,ts:Number(res.comment.ts||Date.now()),editedAt:0,deleted:false});}else if(sendAnonymous&&hasProfile&&res.comment&&res.comment.id){const anonymousComments=getLocalComments().filter((x)=>x&&x.id!==res.comment.id);anonymousComments.unshift({id:res.comment.id,path:formPath,title:formPageTitle,parentId:parentId||"",name:"Anonymous",avatar:"",avatarFrame:"level-1",text:tx,ts:Number(res.comment.ts||Date.now()),editedAt:0,deleted:false,anonymous:true,});writeLocalArray(LOCAL_COMMENTS_KEY,anonymousComments,300);activityChanged("anonymous-comment",{id:res.comment.id,path:formPath});}
if(createdAccountFromName)scheduleLocalProgressSyncForNamedGuest("comment-name-created-account");if(!formIsCurrent())return;if(parentId){if(keepNewReplyDraft("Reply published. Your new draft is still here; the list will refresh when you finish or cancel it."))return;pendingReplyRefresh=false;f.remove();}else if(sendAnonymous||hasProfile||profileNow.name||textClearedEarly){if(!textClearedEarly)text.value="";try{text.dispatchEvent(new Event("input",{bubbles:true}));}catch(_){}
updateSubmitState();}
if(typeof onDone==="function"){if(optimisticSent&&optimisticId&&!parentId)onDone(Object.assign({},res,{replaceOptimisticId:optimisticId}));else onDone(res);}};f.addEventListener("submit",handleCommentSubmit,true);submit.addEventListener("click",handleCommentSubmit);text.addEventListener("keydown",function(ev){if(ev.key==="Enter"&&(ev.ctrlKey||ev.metaKey)){ev.preventDefault();handleCommentSubmit(ev);}});if(parentId){setTimeout(()=>{try{const target=hasProfile?text:nameInput;if(target&&typeof target.focus==="function")target.focus({preventScroll:true});}catch(_){try{(hasProfile?text:nameInput).focus();}catch(_){}}},0);}
return f;}
async function openReactionViewer(c,key,icon){ensureStylesOnce();const existing=document.querySelector(".mk-reaction-view-modal");if(existing){if(typeof existing.__mkReactionClose==="function")existing.__mkReactionClose();else existing.remove();}
const accountContext=captureSocialAccountContext();const page=currentPath();const modal=el("div","mk-reaction-view-modal");modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.innerHTML=`<div class="mk-reaction-view-panel" role="document">
      <div class="mk-reaction-view-head">
        <div><div class="mk-reaction-view-title">${escapeHtml(ownerReactionViewerText(key))}</div></div>
        <button type="button" class="mk-reaction-view-close mk-comment-small-btn mk-comment-icon-btn" ${iconButtonAttrs("Close")}>${iconButtonHtml("x", "Close")}</button>
      </div>
      <div class="mk-reaction-view-body"><div class="mk-reaction-empty">Loading…</div></div>
    </div>`;document.body.appendChild(modal);const body=modal.querySelector(".mk-reaction-view-body");let closed=false;let loading=false;const isCurrent=()=>!closed&&modal.isConnected&&currentPath()===page&&socialAccountContextIsCurrent(accountContext);const close=()=>{if(closed)return;closed=true;document.removeEventListener("keydown",onKey,true);document.removeEventListener("DOMContentSwitch",close);document.removeEventListener("navigation:load",close);window.removeEventListener("pagehide",close);window.removeEventListener("mk-account-workspace-changed",close);try{closeQuickShopMenu();}catch(_){}
try{modal.remove();}catch(_){}
try{if(!document.querySelector(".mk-local-activity-modal")){document.documentElement.classList.remove("mk-local-activity-open");document.body.classList.remove("mk-local-activity-open");unlockPageBehindModal();mkLocalUnbindViewportMetrics();}}catch(_){}};modal.__mkReactionClose=close;modal.addEventListener("click",(ev)=>{if(ev.target===modal)close();});const closeBtn=modal.querySelector(".mk-reaction-view-close");if(closeBtn)closeBtn.addEventListener("click",close);const onKey=(ev)=>{if(ev.key==="Escape")close();};document.addEventListener("keydown",onKey,true);document.addEventListener("DOMContentSwitch",close);document.addEventListener("navigation:load",close);window.addEventListener("pagehide",close);window.addEventListener("mk-account-workspace-changed",close);const load=async()=>{if(loading||!isCurrent())return;loading=true;body.replaceChildren(el("div","mk-reaction-empty","Loading…"));let data=null;try{data=await apiGet(`/comment-reactions?path=${encodeURIComponent(c.path || page)}&commentId=${encodeURIComponent(c.id)}&reaction=${encodeURIComponent(key)}&visitorId=${encodeURIComponent(accountContext.visitorId)}`);}catch(_){}finally{loading=false;}
if(!isCurrent())return;body.innerHTML="";if(!data||!data.ok||!Array.isArray(data.users)||!data.users.every(u=>u&&typeof u==="object"&&!Array.isArray(u))){body.appendChild(el("div","mk-reaction-empty","Could not load reactions."));const retry=el("button","mk-comment-small-btn","Retry");retry.type="button";retry.addEventListener("click",()=>load());body.appendChild(retry);return;}
if(!data.users.length){body.appendChild(el("div","mk-reaction-empty","No reactions of this type yet."));return;}
data.users.forEach((u)=>{const row=el("div","mk-reaction-user");row.innerHTML=avatarHtml(u.name||"Anonymous",u.avatar||"",u.avatarFrame||"level-1");row.appendChild(el("span","mk-reaction-user-name",u.name||"Anonymous"));body.appendChild(row);});};await load();}
function renderComment(c,replies,reload,isReply){try{const local=readLocalProfile()||{};const localKey=String(local.accountKey||"").trim().toLowerCase();const commentKey=String(c&&(c.accountKey||c.account_key)||"").trim().toLowerCase();if(c&&!c.anonymous&&localKey&&commentKey&&localKey===commentKey)c.isOwner=true;}catch(_){}
const card=el("div","mk-comment-card"+(isReply?" is-reply":""));try{if(c&&c.id)card.setAttribute("data-comment-id",String(c.id));if(c&&c.isOwner&&!c.anonymous)card.setAttribute("data-comment-owner","1");const commentEffect=String(c&&(c.commentEffect||c.comment_effect)||"").trim();if(commentEffect&&!(c&&c.isOwner))card.setAttribute("data-comment-effect",commentEffect);const nameplateStyle=String(c&&(c.nameplateStyle||c.nameplate_style)||"").trim();if(nameplateStyle&&!(c&&c.isOwner))card.setAttribute("data-nameplate-style",nameplateStyle);const reactionEffect=String(c&&(c.reactionEffect||c.reaction_effect)||"").trim();if(reactionEffect&&!(c&&c.isOwner))card.setAttribute("data-reaction-effect",reactionEffect);if(c&&(c.pending||c.optimistic))card.setAttribute("data-comment-pending","1");if(c&&(c.pending||c.optimistic)){card.setAttribute("data-comment-text-key",String(c.text||"").trim().slice(0,240));card.setAttribute("data-comment-name-key",String(c.name||"Anonymous").trim().toLowerCase().slice(0,80));}}catch(_){}
const meta=el("div","mk-comment-meta");const person=el("span","mk-comment-person");person.innerHTML=avatarHtml(c.name||"Anonymous",c.avatar||"",c.avatarFrame||"level-1");if(c.profilePublic){person.classList.add("is-public-profile");person.title="View public profile";person.addEventListener("click",()=>openPublicProfile(c.name||""));}
person.appendChild(el("span","mk-comment-name",c.name||"Anonymous"));meta.appendChild(person);meta.appendChild(el("span","mk-comment-time",formatTime(c.ts)));if(Number(c.editedAt||0)>Number(c.ts||0))meta.appendChild(el("span","mk-comment-time","edited"));const text=el("div","mk-comment-text","");text.innerHTML=renderCommentTextHtml(c.text||"");const actions=el("div","mk-comment-actions");const reactionDefs=[["like","👍"],["heart","❤️"],["laugh","😂"],];reactionDefs.forEach(([key,icon])=>{const count=Number(c.reactions&&c.reactions[key]||0);const b=el("button","mk-comment-reaction"+(c.isOwner?" is-owner-view":""),`${icon} ${count}`);b.type="button";b.setAttribute("aria-label",c.isOwner?`View ${reactionLabel(key)} reactions`:`${reactionLabel(key)} reaction`);b.addEventListener("click",async()=>{if(c.isOwner){await openReactionViewer(c,key,icon);return;}
b.disabled=true;const res=await apiPost("/comment-reaction",{path:currentPath(),visitorId:getVisitorId(),commentId:c.id,reaction:key});b.disabled=false;if(res&&res.ownComment){await openReactionViewer(c,key,icon);return;}
try{trackActivity("reaction_given",{path:currentPath(),commentId:c.id,reaction:key,source:"comment-reaction"},{scope:`reaction:${c.id}:${key}`,throttleMs:0});}catch(_){}
reload();});actions.appendChild(b);});if(!isReply){const reply=iconButton("mk-comment-small-btn","reply","Reply");reply.type="button";reply.addEventListener("click",()=>{if(card.querySelector(":scope > .mk-comment-form"))return;const replyForm=formNode(c.id,reload);actions.after(replyForm);});actions.appendChild(reply);}
if(!c.isOwner){const report=iconButton("mk-comment-small-btn mk-comment-report-btn","report","Report");report.type="button";report.title="Report this comment to the maintainer. If confirmed as malicious, the reporter may receive a voucher that doubles today's XP caps when activated.";report.addEventListener("click",async()=>{report.disabled=true;await reportComment(c,reload);report.disabled=false;});actions.appendChild(report);}
const canEdit=!!(c.isOwner||readAdminToken());if(canEdit){const edit=iconButton("mk-comment-small-btn mk-comment-owner-btn","edit","Edit");edit.type="button";edit.addEventListener("click",()=>{if(card.querySelector(":scope > .mk-comment-edit-form"))return;const editBox=el("form","mk-comment-form mk-comment-edit-form");const area=document.createElement("textarea");area.name="text";area.maxLength=1200;area.placeholder="Edit your comment...";area.value=c.text||"";const editActions=el("div","mk-comment-form-actions");const cancelEdit=iconButton("mk-comment-small-btn","x","Cancel edit");cancelEdit.type="button";const saveEdit=iconButton("mk-comment-primary-btn","check","Save edit");saveEdit.type="submit";editActions.appendChild(cancelEdit);editActions.appendChild(saveEdit);const updateEditSaveState=()=>{saveEdit.disabled=!String(area.value||"").trim();saveEdit.setAttribute("aria-disabled",saveEdit.disabled?"true":"false");};area.addEventListener("input",updateEditSaveState);editBox.appendChild(commentTextareaWithEmoji(area));editBox.appendChild(editActions);updateEditSaveState();text.hidden=true;actions.hidden=true;cancelEdit.addEventListener("click",()=>{editBox.remove();text.hidden=false;actions.hidden=false;});editBox.addEventListener("submit",async(ev)=>{ev.preventDefault();const tx=String(area.value||"").trim();if(!tx||saveEdit.disabled){area.focus();return;}
saveEdit.disabled=true;const done=c.isOwner?await editOwnComment(c.id,currentPath(),tx):await editCommentByAdmin(c.id,tx,c.path||currentPath());saveEdit.disabled=false;if(done)reload();});actions.after(editBox);window.setTimeout(()=>{try{area.focus({preventScroll:true});}catch(_){try{area.focus();}catch(__){}}},0);});actions.appendChild(edit);}
if(c.isOwner){const ownDel=iconButton("mk-comment-small-btn mk-comment-owner-btn","trash","Delete my comment");ownDel.type="button";ownDel.addEventListener("click",async()=>{ownDel.disabled=true;let removed=false;const done=await deleteOwnComment(c.id,currentPath(),{onConfirmed:function(){removed=true;removeRenderedCommentCardImmediately(card);removeRenderedCommentByIdEverywhere(c.id);}});ownDel.disabled=false;if(!done&&removed){try{reload();}catch(_){}}});actions.appendChild(ownDel);}else if(readAdminToken()){const del=iconButton("mk-comment-small-btn mk-comment-danger-btn","trash","Delete");del.type="button";del.addEventListener("click",async()=>{del.disabled=true;let removed=false;const done=await deleteCommentByAdmin(c.id,c.path||currentPath(),{onConfirmed:function(){removed=true;removeRenderedCommentCardImmediately(card);removeRenderedCommentByIdEverywhere(c.id);}});del.disabled=false;if(!done&&removed){try{reload();}catch(_){}}});actions.appendChild(del);}
card.appendChild(meta);card.appendChild(text);card.appendChild(actions);const childReplies=Array.isArray(replies)?replies:[];if(!isReply&&childReplies.length){const replyCount=childReplies.length;const toggle=el("button","mk-comment-replies-toggle",`Replies (${replyCount})`);toggle.type="button";toggle.setAttribute("aria-expanded","false");const replyWrap=el("div","mk-comment-replies");replyWrap.hidden=true;childReplies.forEach(r=>replyWrap.appendChild(renderComment(r,[],reload,true)));toggle.addEventListener("click",()=>{const open=!!replyWrap.hidden;replyWrap.hidden=!open;toggle.classList.toggle("is-open",open);toggle.setAttribute("aria-expanded",open?"true":"false");toggle.textContent=open?`Hide replies (${replyCount})`:`Replies (${replyCount})`;});card.appendChild(toggle);card.appendChild(replyWrap);}
return card;}
const commentEmptyMessageByPath=new Map();function commentEmptyNode(){const pageTitle=title();const choices=[{title:"Be the first to leave a note.",note:"A question, shortcut, or useful example is enough to get the discussion started."},{title:pageTitle?`What helped ${pageTitle} click for you?`:"What helped this idea click for you?",note:"Share the explanation you wish you had when you first opened this page."},{title:"Start the study conversation.",note:"Leave a question, a small insight, or the part you are still working through."},{title:pageTitle?`Still thinking about ${pageTitle}?`:"Still thinking about this topic?",note:"Write down what felt tricky—or what turned out to be surprisingly simple."}];const path=currentPath()||"__comments__";let picked=commentEmptyMessageByPath.get(path);if(!picked){picked=choices[Math.floor(Math.random()*choices.length)]||choices[0];commentEmptyMessageByPath.set(path,picked);}
const node=el("div","mk-comments-empty");node.innerHTML=`<span class="mk-comments-empty-mark" aria-hidden="true">✦</span><div><div class="mk-comments-empty-title">${escapeHtml(picked.title)}</div><div class="mk-comments-empty-note">${escapeHtml(picked.note)}</div></div>`;return node;}
const commentListData=new WeakMap();function commentsResponseIsValid(data){return!!data&&data.ok!==false&&Array.isArray(data.comments)&&data.comments.every(c=>c&&typeof c==="object"&&!Array.isArray(c)&&(typeof c.id==="string"||typeof c.id==="number")&&String(c.id).trim()&&(c.text==null||typeof c.text==="string"));}
async function loadCommentsInto(list,opts){const options=opts&&typeof opts==="object"?opts:{};const path=currentPath();const accountContext=captureSocialAccountContext();if(!options.silent&&!list.children.length){list.appendChild(el("div","mk-comments-loading","Loading comments..."));}
const key=`${path}:${accountContext.visitorId}:${accountContext.accountKey}:${accountContext.owner}`;let cached=commentListData.get(list);if(!cached||cached.key!==key||cached.epoch!==commentsMemoEpoch){cached={key,epoch:commentsMemoEpoch,data:null,pending:null};commentListData.set(list,cached);}
let data=options.reuseData?cached.data:null;if(!data){if(!cached.pending)cached.pending=fetchCommentsForPath(path,{fresh:true}).finally(()=>{cached.pending=null;});try{data=await cached.pending;}catch(_){data=null;}
if(commentsResponseIsValid(data))cached.data=data;}
if(!list.isConnected||!socialAccountContextIsCurrent(accountContext)||path!==currentPath()||commentListData.get(list)!==cached||cached.epoch!==commentsMemoEpoch)return;if(!commentsResponseIsValid(data)){const oldError=list.querySelector(".mk-comments-load-error");if(oldError)oldError.remove();const error=el("div","mk-comments-empty mk-comments-load-error");error.appendChild(el("div","","Could not load comments."));const retry=el("button","mk-comment-small-btn","Retry");retry.type="button";retry.addEventListener("click",()=>{if(!list.isConnected||path!==currentPath()||!socialAccountContextIsCurrent(accountContext))return;return loadCommentsInto(list,{keepExistingOnError:true});});error.appendChild(retry);if(list.querySelector(".mk-comment-card"))list.appendChild(error);else list.replaceChildren(error);return;}
const comments=data.comments;const frag=document.createDocumentFragment();if(!comments.length){frag.appendChild(commentEmptyNode());list.replaceChildren(frag);return;}
const byParent=new Map();for(const c of comments){const pid=c.parentId||"";if(!byParent.has(pid))byParent.set(pid,[]);byParent.get(pid).push(c);}
const top=byParent.get("")||[];const sortMode=String(list.dataset.commentSort||"newest");const popularScore=(comment)=>{const reactions=comment&&comment.reactions||{};const reactionScore=Number(reactions.like||0)+Number(reactions.heart||0)*1.25+Number(reactions.laugh||0);const replyScore=(byParent.get(comment&&comment.id||"")||[]).length*2;return reactionScore+replyScore;};if(sortMode==="oldest")top.sort((a,b)=>Number(a.ts||0)-Number(b.ts||0));else if(sortMode==="popular")top.sort((a,b)=>popularScore(b)-popularScore(a)||Number(b.ts||0)-Number(a.ts||0));else top.sort((a,b)=>Number(b.ts||0)-Number(a.ts||0));top.forEach(c=>{const replies=byParent.get(c.id)||[];replies.sort((a,b)=>Number(a.ts||0)-Number(b.ts||0));frag.appendChild(renderComment(c,replies,()=>loadCommentsInto(list,{silent:true,keepExistingOnError:true}),false));});if(options.silent&&list.children.length){const oldMinHeight=list.style.minHeight;try{list.style.minHeight=`${Math.max(0, Math.ceil(list.getBoundingClientRect().height || 0))}px`;}catch(_){}
list.replaceChildren(frag);requestAnimationFrame(()=>{try{list.style.minHeight=oldMinHeight||"";}catch(_){}});}else{list.replaceChildren(frag);}}
function saveLocalReadiness(path,pageTitle,readiness){const p=String(path||"");const r=normaliseReadinessNumber(readiness);if(!p||r==null)return;const arr=readLocalArray(LOCAL_READINESS_KEY).filter((x)=>x&&x.path!==p);arr.unshift({path:p,title:cleanPageTitleText(pageTitle||p),readiness:r,ts:Date.now()});writeLocalArray(LOCAL_READINESS_KEY,arr,300);activityChanged("readiness",{path:p,readiness:r});}
function getLocalReadinessList(){return readLocalArray(LOCAL_READINESS_KEY);}
function searchObjectForReadiness(obj,variants,depth,seen){if(!obj||typeof obj!=="object"||depth>5)return null;if(seen&&seen.has(obj))return null;if(seen)seen.add(obj);for(const v of variants){if(Object.prototype.hasOwnProperty.call(obj,v)){const n=readinessFromCandidate(obj[v]);if(n!=null)return n;}}
const loc=String(obj.path||obj.location||obj.concept||obj.conceptId||obj.id||"");if(loc&&variants.some((v)=>loc===v||loc.endsWith(v))){const n=readinessFromCandidate(obj);if(n!=null)return n;}
for(const val of Object.values(obj)){const n=searchObjectForReadiness(val,variants,depth+1,seen);if(n!=null)return n;}
return null;}
function findLocalReadiness(path){const p=String(path||currentPath());const stored=getLocalReadinessList().find((x)=>x&&x.path===p);if(stored)return normaliseReadinessNumber(stored.readiness);const variants=pathVariantsForReadiness(p);try{const globals=[window.CourseDiagnosis,window.CourseReadiness,window.MkCourseDiagnosis,window.MkReadiness,window.PrerequisiteReadiness].filter(Boolean);for(const g of globals){for(const fn of["getReadiness","readinessFor","getConceptReadiness","get"]){if(g&&typeof g[fn]==="function"){const n=normaliseReadinessNumber(g[fn](p));if(n!=null)return n;}}
const n=searchObjectForReadiness(g,variants,0,new WeakSet());if(n!=null)return n;}}catch(_){}
try{const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||"";if(/readiness|diagnosis|course/i.test(k))keys.push(k);}
for(const k of keys.slice(0,40)){const raw=localStorage.getItem(k)||"";if(!raw||raw.length>600000)continue;let parsed=null;try{parsed=JSON.parse(raw);}catch(_){continue;}
const n=searchObjectForReadiness(parsed,variants,0,new WeakSet());if(n!=null)return n;}}catch(_){}
return null;}
async function submitReadiness(path,readiness,pageTitle){const p=String(path||currentPath());const r=normaliseReadinessNumber(readiness);if(!p||r==null)return null;saveLocalReadiness(p,pageTitle||title(),r);return apiPost("/readiness",{visitorId:getVisitorId(),path:p,title:pageTitle||title(),readiness:r});}
async function fetchReadinessAverage(path){return apiGet(`/readiness?path=${encodeURIComponent(path || currentPath())}&visitorId=${encodeURIComponent(getVisitorId())}`);}
function mountReadinessCard(){try{document.querySelectorAll(".mk-readiness-share").forEach((x)=>x.remove());}catch(_){}}
function refreshReadinessCardSoon(delay){window.setTimeout(()=>{try{document.querySelectorAll(".mk-readiness-share").forEach((x)=>x.remove());}catch(_){}},Math.max(0,Number(delay)||0));}
function findRenderedCommentCard(list,commentId){const id=String(commentId||"");if(!list||!id)return null;try{return Array.from(list.querySelectorAll(".mk-comment-card[data-comment-id]")).find((x)=>String(x.getAttribute("data-comment-id")||"")===id)||null;}catch(_){return null;}}
function removeRenderedCommentCardImmediately(card){try{if(!card)return;const list=card.closest&&card.closest(".mk-comment-list");card.remove();if(list){const loading=list.querySelector(".mk-comments-loading");if(loading)loading.remove();if(!list.querySelector(".mk-comment-card")&&!list.querySelector(".mk-comments-empty")){list.appendChild(commentEmptyNode());}}}catch(_){}}
function removeRenderedCommentByIdEverywhere(commentId){const id=String(commentId||"");if(!id)return;try{document.querySelectorAll(".mk-comment-card[data-comment-id]").forEach((card)=>{if(String(card.getAttribute("data-comment-id")||"")===id)removeRenderedCommentCardImmediately(card);});}catch(_){}}
async function reconcilePendingCommentCards(list){try{if(!list)return;const pending=Array.from(list.querySelectorAll('.mk-comment-card[data-comment-pending="1"][data-comment-id]'));if(!pending.length)return;const data=await fetchCommentsForPath(currentPath());const comments=data&&Array.isArray(data.comments)?data.comments:[];if(!comments.length)return;const byParent=new Map();comments.forEach((c)=>{const pid=c&&c.parentId||"";if(!byParent.has(pid))byParent.set(pid,[]);byParent.get(pid).push(c);});const top=(byParent.get("")||[]).slice().sort((a,b)=>Number(b.ts||0)-Number(a.ts||0));pending.forEach((card)=>{const textKey=String(card.getAttribute("data-comment-text-key")||"").trim();const nameKey=String(card.getAttribute("data-comment-name-key")||"").trim().toLowerCase();if(!textKey)return;const match=top.find((c)=>{if(!c||findRenderedCommentCard(list,c.id))return false;const sameText=String(c.text||"").trim().slice(0,240)===textKey;const sameName=!nameKey||String(c.name||"Anonymous").trim().toLowerCase().slice(0,80)===nameKey;return sameText&&sameName;});if(!match)return;const replies=byParent.get(match.id)||[];replies.sort((a,b)=>Number(a.ts||0)-Number(b.ts||0));card.replaceWith(renderComment(match,replies,()=>loadCommentsInto(list,{silent:true,keepExistingOnError:true}),false));});}catch(_){}}
function prependCommentOptimistically(list,res,fallbackReload){try{if(!list){if(typeof fallbackReload==="function")fallbackReload();return;}
if(res&&res.reconcileOnly){window.setTimeout(()=>{reconcilePendingCommentCards(list).catch(()=>{});},2400);return;}
if(res&&res.removeOptimisticId){const old=findRenderedCommentCard(list,res.removeOptimisticId);if(old)old.remove();return;}
if(!res||!res.comment||!res.comment.id){if(typeof fallbackReload==="function")fallbackReload();return;}
const replaceId=res.replaceOptimisticId||"";const c=Object.assign({},res.comment);const prof=res.profile||readLocalProfile()||{};c.name=c.name||prof.name||"Anonymous";c.avatar=c.avatar||prof.avatar||"";c.avatarFrame=c.avatarFrame||prof.avatarFrame||"level-1";c.path=c.path||currentPath();c.ts=Number(c.ts||Date.now());c.reactions=c.reactions||{};c.isOwner=true;c.profilePublic=!!(prof.isPublic||(prof.privacy&&prof.privacy.profilePublic));const empty=list.querySelector(".mk-comments-empty,.mk-comments-loading");if(empty)empty.remove();const rendered=renderComment(c,[],()=>loadCommentsInto(list,{silent:true,keepExistingOnError:true}),false);const existing=replaceId?findRenderedCommentCard(list,replaceId):findRenderedCommentCard(list,c.id);if(existing)existing.replaceWith(rendered);else if(!findRenderedCommentCard(list,c.id))list.prepend(rendered);if(String(list.dataset.commentSort||"newest")!=="newest"){window.setTimeout(()=>loadCommentsInto(list,{silent:true,keepExistingOnError:true}),80);}}catch(_){if(typeof fallbackReload==="function")fallbackReload();}}
function mountComments(){syncCommentEmojiEffectClass();const path=currentPath();if(!isConceptPath(path))return;const article=document.querySelector("article.md-content__inner")||document.querySelector(".md-content__inner")||document.querySelector("main");if(!article||article.querySelector(".mk-page-comments"))return;ensureStylesOnce();const section=el("section","mk-page-comments");section.id="comments";const head=el("div","mk-comments-head");head.appendChild(el("h2","","Comments"));const headActions=el("div","mk-comment-actions");const sort=el("div","mk-comments-sort");const sortTrigger=el("button","mk-comments-sort-trigger");sortTrigger.type="button";const sortLabel=el("span","mk-comments-sort-label","Newest first");const sortCaret=el("span","mk-comments-sort-caret");sortCaret.setAttribute("aria-hidden","true");sortCaret.innerHTML='<svg viewBox="0 0 16 16" focusable="false"><path d="M3 6l5 5 5-5"></path></svg>';sortTrigger.appendChild(sortLabel);sortTrigger.appendChild(sortCaret);sortTrigger.setAttribute("aria-label","Sort comments");sortTrigger.setAttribute("aria-haspopup","listbox");sortTrigger.setAttribute("aria-expanded","false");const sortMenu=el("div","mk-comments-sort-menu");sortMenu.hidden=true;sortMenu.setAttribute("role","listbox");sortMenu.setAttribute("aria-label","Sort comments");const sortOptions=[["newest","Newest first"],["oldest","Oldest first"],["popular","Most popular"]];let sortValue="newest";sortOptions.forEach(([value,label])=>{const option=el("button","mk-comments-sort-option",label);option.type="button";option.dataset.value=value;option.setAttribute("role","option");option.setAttribute("aria-selected",value===sortValue?"true":"false");sortMenu.appendChild(option);});sort.appendChild(sortTrigger);sort.appendChild(sortMenu);const admin=iconButton("mk-comment-small-btn mk-comment-admin-btn"+(readAdminToken()?" is-on":""),"admin","Open comment admin");admin.type="button";admin.addEventListener("click",async()=>{const opened=await openCommentsAdmin("reports");admin.classList.toggle("is-on",!!readAdminToken());if(opened)loadCommentsInto(list,{silent:true});});headActions.appendChild(admin);headActions.appendChild(sort);head.appendChild(headActions);const composer=el("div","mk-comment-composer");const list=el("div","mk-comment-list");list.dataset.commentSort="newest";let sortOutsideCloseArmed=false;function setSortOpen(open,focusValue){const nextOpen=!!open;sort.classList.toggle("is-open",nextOpen);sortMenu.hidden=!nextOpen;sortTrigger.setAttribute("aria-expanded",nextOpen?"true":"false");if(!nextOpen||!focusValue)return;const target=sortMenu.querySelector(`.mk-comments-sort-option[data-value="${focusValue}"]`);if(target)target.focus();}
function armSortOutsideClose(){if(sortOutsideCloseArmed)return;sortOutsideCloseArmed=true;document.addEventListener("pointerdown",function closeSortFromOutside(event){sortOutsideCloseArmed=false;if(!sort.isConnected||!sort.classList.contains("is-open"))return;if(!sort.contains(event.target)){setSortOpen(false);return;}
window.setTimeout(()=>{if(sort.isConnected&&sort.classList.contains("is-open"))armSortOutsideClose();},0);},{capture:true,once:true});}
sortTrigger.addEventListener("click",()=>{const nextOpen=!sort.classList.contains("is-open");setSortOpen(nextOpen);if(nextOpen)window.setTimeout(armSortOutsideClose,0);});sortTrigger.addEventListener("keydown",(event)=>{if(event.key!=="ArrowDown"&&event.key!=="ArrowUp")return;event.preventDefault();event.stopPropagation();const focusValue=event.key==="ArrowUp"?sortOptions[sortOptions.length-1][0]:sortValue;setSortOpen(true,focusValue);window.setTimeout(armSortOutsideClose,0);});sortMenu.addEventListener("click",(event)=>{const option=event.target.closest(".mk-comments-sort-option");if(!option)return;sortValue=option.dataset.value||"newest";sortLabel.textContent=option.textContent||"Newest first";sortMenu.querySelectorAll(".mk-comments-sort-option").forEach((item)=>{item.setAttribute("aria-selected",item===option?"true":"false");});setSortOpen(false);list.dataset.commentSort=sortValue;loadCommentsInto(list,{silent:true,keepExistingOnError:true});});sort.addEventListener("keydown",(event)=>{if(event.key==="Escape"&&sort.classList.contains("is-open")){event.preventDefault();setSortOpen(false);sortTrigger.focus();return;}
if(!["ArrowDown","ArrowUp","Home","End"].includes(event.key)||sortMenu.hidden)return;const options=Array.from(sortMenu.querySelectorAll(".mk-comments-sort-option"));if(!options.length)return;event.preventDefault();const currentIndex=options.indexOf(document.activeElement);let nextIndex=currentIndex;if(event.key==="Home")nextIndex=0;else if(event.key==="End")nextIndex=options.length-1;else if(event.key==="ArrowDown")nextIndex=currentIndex<0?0:(currentIndex+1)%options.length;else nextIndex=currentIndex<0?options.length-1:(currentIndex-1+options.length)%options.length;options[nextIndex].focus();});sort.addEventListener("focusout",()=>{window.setTimeout(()=>{if(!sort.contains(document.activeElement))setSortOpen(false);},0);});section.appendChild(head);function showMainComposer(){const previousText=composer.querySelector("textarea");const draft=previousText?String(previousText.value||""):"";const restoreFocus=previousText&&document.activeElement===previousText;const selectionStart=previousText&&previousText.selectionStart;const selectionEnd=previousText&&previousText.selectionEnd;composer.innerHTML="";composer.appendChild(formNode("",(res)=>{prependCommentOptimistically(list,res,()=>loadCommentsInto(list,{silent:true,keepExistingOnError:true}));if(readLocalProfile().name&&composer.querySelector(".mk-comment-name-input"))showMainComposer();}));if(draft){const nextText=composer.querySelector("textarea");if(nextText){nextText.value=draft;try{nextText.dispatchEvent(new Event("input",{bubbles:true}));}catch(_){}
if(restoreFocus){try{nextText.focus({preventScroll:true});}catch(_){}
try{nextText.setSelectionRange(selectionStart,selectionEnd);}catch(_){}}}}}
showMainComposer();section.appendChild(composer);section.appendChild(list);article.appendChild(section);loadCommentsInto(list);}
function activityTitle(item){const rawTitle=cleanPageTitleText((item&&item.title)||"");if(rawTitle&&!titleLooksLikePath(rawTitle))return rawTitle;const p=String((item&&item.path)||"");const file=(p.split("/").pop()||"").replace(/\.html$/i,"");const fallback=cleanPageTitleText(file.replace(/[-_]+/g," ").replace(/\b\w/g,(m)=>m.toUpperCase()));return fallback||"Untitled page";}
function publicProfileLocalVisitRow(item){const p=normActivityTitlePath(item&&item.path||"");if(!p)return null;const last=publicProfileRowTime(item,["last_visited","lastVisited","updatedAt","updated_at","ts","createdAt"])||Date.now();const first=masteryTimestampValue(item&&(item.first_visited||item.firstVisited||item.createdAt||item.ts))||last;return{path:p,title:cleanPageTitleText(item&&item.title||p),visit_count:Math.max(1,Number(item&&(item.visit_count||item.visitCount||item.count)||1)||1),first_visited:first,last_visited:last,};}
function publicProfileLocalActionRow(item){const p=normActivityTitlePath(item&&item.path||"");const action=String(item&&item.action||"").toLowerCase().trim();if(!p||!isActiveSavedPageAction(action)||(item&&(item.active===false||item.deleted===true)))return null;const updated=publicProfileRowTime(item,["updated_at","updatedAt","ts","created_at","createdAt"])||Date.now();const created=masteryTimestampValue(item&&(item.created_at||item.createdAt||item.ts))||updated;return{path:p,title:cleanPageTitleText(item&&item.title||p),action,created_at:created,updated_at:updated};}
function publicProfileLocalCommentRow(item){const id=String(item&&(item.id||item.commentId||item.comment_id)||"").trim();const p=normActivityTitlePath(item&&item.path||"");if(!id||!p||(item&&item.deleted))return null;const text=String(item&&item.text||"").trim();if(!text)return null;return{id,path:p,parent_id:String(item&&(item.parent_id||item.parentId)||"").trim(),title:cleanPageTitleText(item&&item.title||p),text,ts:masteryTimestampValue(item&&(item.ts||item.createdAt||item.created_at))||Date.now(),edited_at:masteryTimestampValue(item&&(item.edited_at||item.editedAt))||0,};}
function publicProfileLocalReadinessRow(item){const p=normActivityTitlePath(item&&item.path||"");if(!p)return null;const r=normaliseReadinessNumber(item&&(item.readiness!=null?item.readiness:(item.percent!=null?item.percent:item.score)));if(r==null)return null;return{path:p,title:cleanPageTitleText(item&&item.title||p),readiness:r,updated_at:publicProfileRowTime(item,["updated_at","updatedAt","ts"])||Date.now()};}
function isPublicProfileSelfTarget(prof,requestedName,requestedAccountKey,opts){const local=readLocalProfile()||{};const localKey=String(local.accountKey||local.account_key||"").replace(/^user:/i,"").trim().toLowerCase();const profileKey=String(prof&&(prof.accountKey||prof.account_key||prof.account)||"").replace(/^user:/i,"").trim().toLowerCase();const requestedKey=String(requestedAccountKey||"").replace(/^user:/i,"").trim().toLowerCase();if(opts&&(opts.selfPreview||opts.source==="shop-preview"))return true;if(localKey&&(localKey===profileKey||localKey===requestedKey))return true;const localName=cleanProfileNameLocal(local.name||local.displayName||local.username||"").toLowerCase();const profileName=cleanProfileNameLocal((prof&&prof.name)||requestedName||"").toLowerCase();return!!(localName&&profileName&&localName===profileName);}
function mergePublicProfileWithLocalSelfRows(data,prof,requestedName,requestedAccountKey,opts){if(!isPublicProfileSelfTarget(prof,requestedName,requestedAccountKey,opts))return data;const next=data&&typeof data==="object"?Object.assign({},data):{};const localVisits=getLocalVisitsForSync().map(publicProfileLocalVisitRow).filter(Boolean);const localActions=getLocalPageActions().map(publicProfileLocalActionRow).filter(Boolean);const localComments=getLocalComments().map(publicProfileLocalCommentRow).filter(Boolean);const localReadiness=getLocalReadinessList().map(publicProfileLocalReadinessRow).filter(Boolean);next.visits=publicProfileMergeRows(next.visits||[],localVisits,{key:"path",timeKeys:["last_visited","updated_at","ts"],max:30});next.actions=publicProfileMergeRows(next.actions||[],localActions,{keyFn:(x)=>`${x && x.path || ""}::${x && x.action || ""}`,timeKeys:["updated_at","ts","created_at"],max:40});next.comments=publicProfileMergeRows(next.comments||[],localComments,{key:"id",timeKeys:["edited_at","ts","created_at"],max:30});next.readiness=publicProfileMergeRows(next.readiness||[],localReadiness,{key:"path",timeKeys:["updated_at","ts"],max:40});return next;}
function renderPublicProfileRows(items,type){let arr=Array.isArray(items)?items:[];if(type==="actions")arr=arr.filter((item)=>item&&isActiveSavedPageAction(item.action));if(!arr.length){if(type==="readiness"){return`<div class="mk-local-activity-empty">No public readiness yet. The user needs to set My → Privacy → Readiness to Public and open concept pages after course diagnosis has loaded.</div>`;}
const label=type==="actions"?"saved pages":type==="visits"?"visits":type==="comments"?"comments":type;return`<div class="mk-local-activity-empty">No public ${escapeHtml(label)} yet.</div>`;}
return arr.slice(0,30).map((item)=>{const p=item.path||"";const label=activityTitle(item);const extra=type==="actions"?(pageActionLabels()[item.action]||"Saved page"):type==="visits"?`${Number(item.visit_count || 0)} visit${Number(item.visit_count || 0) === 1 ? "" : "s"}`:type==="readiness"?`${Math.round(Number(item.readiness || 0) * 10) / 10}% readiness`:previewText(item.text||"",120);return`<div class="mk-local-activity-row"><div class="mk-local-activity-main"><div><a class="mk-local-activity-link" data-path="${escapeAttr(normActivityTitlePath(p))}" href="${escapeAttr(pageHref(p))}">${escapeHtml(label)}</a><div class="mk-local-activity-meta"><span>${escapeHtml(extra)}</span></div></div></div></div>`;}).join("");}
function renderPublicProfileSection(titleText,html){return`<details class="mk-public-profile-section"><summary>${escapeHtml(titleText)}</summary><div class="mk-public-profile-section-body">${html}</div></details>`;}
function updatePublicProfileSectionScrollState(root){if(!root)return;root.querySelectorAll(".mk-public-profile-section").forEach((sec)=>{const body=sec.querySelector(".mk-public-profile-section-body");if(!body)return;const rows=body.querySelectorAll(".mk-local-activity-row").length;const isEmpty=rows===0&&!!body.querySelector(".mk-local-activity-empty");const textLen=String(body.textContent||"").replace(/\s+/g," ").trim().length;const shouldScroll=!isEmpty&&(rows>=5||textLen>900);sec.classList.toggle("mk-public-profile-section--scroll",shouldScroll);if(!shouldScroll){try{body.scrollTop=0;}catch(_){}}});}
function applyPublicProfileImageTheme(modal,itemId){try{if(!modal)return;let cfg=null;try{if(window.MkAccountData&&typeof window.MkAccountData.publicProfileThemeConfig==="function"){cfg=window.MkAccountData.publicProfileThemeConfig(String(itemId||"").trim());}}catch(_){}
if(!cfg){const themeId=publicProfileImageThemeIdFromItem(itemId);cfg=publicProfileImageThemeConfig(themeId);if(cfg)cfg.type="image";}
const imageVars=["--mk-public-profile-theme-header-image","--mk-public-profile-theme-bg-image","--mk-public-profile-theme-header-position","--mk-public-profile-theme-bg-position","--mk-public-profile-theme-header-blur","--mk-public-profile-theme-bg-blur","--mk-public-profile-theme-header-overlay","--mk-public-profile-theme-bg-opacity"];const paletteVars=["--mk-public-profile-palette-header","--mk-public-profile-palette-body","--mk-public-profile-palette-card","--mk-public-profile-palette-accent","--mk-public-profile-palette-border","--mk-public-profile-palette-header-fg","--mk-public-profile-palette-body-fg"];if(!cfg){modal.removeAttribute("data-public-profile-theme");modal.removeAttribute("data-public-profile-palette-theme");modal.removeAttribute("data-public-profile-palette-mode");imageVars.concat(paletteVars).forEach((name)=>modal.style.removeProperty(name));return;}
const t=cfg.publicProfileTheme||{};if(cfg.type==="palette"){modal.removeAttribute("data-public-profile-theme");imageVars.forEach((name)=>modal.style.removeProperty(name));modal.setAttribute("data-public-profile-palette-theme",cfg.id||"");modal.setAttribute("data-public-profile-palette-mode",cfg.themeBase==="slate"?"slate":"default");modal.style.setProperty("--mk-public-profile-palette-header",t.headerBackground||"#2f74c0");modal.style.setProperty("--mk-public-profile-palette-body",t.bodyBackground||"var(--md-default-bg-color)");modal.style.setProperty("--mk-public-profile-palette-card",t.cardBackground||"color-mix(in srgb,var(--md-default-bg-color) 88%,transparent)");modal.style.setProperty("--mk-public-profile-palette-accent",t.accent||"var(--md-accent-fg-color)");modal.style.setProperty("--mk-public-profile-palette-border",t.border||"color-mix(in srgb,var(--md-accent-fg-color) 24%,transparent)");modal.style.setProperty("--mk-public-profile-palette-header-fg",t.headerForeground||"rgba(255,255,255,.97)");modal.style.setProperty("--mk-public-profile-palette-body-fg",t.bodyForeground||"var(--md-default-fg-color)");return;}
modal.removeAttribute("data-public-profile-palette-theme");modal.removeAttribute("data-public-profile-palette-mode");paletteVars.forEach((name)=>modal.style.removeProperty(name));modal.setAttribute("data-public-profile-theme",cfg.id||"");modal.style.setProperty("--mk-public-profile-theme-header-image",`url("${cfg.assets && cfg.assets.header || ""}")`);modal.style.setProperty("--mk-public-profile-theme-bg-image",`url("${cfg.assets && cfg.assets.background || ""}")`);modal.style.setProperty("--mk-public-profile-theme-header-position",t.headerPosition||"center");modal.style.setProperty("--mk-public-profile-theme-bg-position",t.backgroundPosition||"center");modal.style.setProperty("--mk-public-profile-theme-header-blur",t.headerBlur||"0px");modal.style.setProperty("--mk-public-profile-theme-bg-blur",t.backgroundBlur||"4px");modal.style.setProperty("--mk-public-profile-theme-header-overlay",t.headerOverlay||"rgba(7,30,19,.24)");modal.style.setProperty("--mk-public-profile-theme-bg-opacity",t.backgroundOpacity||".42");}catch(_){}}
async function openPublicProfile(name,options){const opts=options&&typeof options==="object"?options:{};const nm=cleanProfileNameLocal(name||"");const requestedAccountKey=String(opts.accountKey||opts.account_key||opts.account||"").replace(/^user:/i,"").trim();if(!nm&&!requestedAccountKey)return;ensureStylesOnce();const existing=document.querySelector(".mk-public-profile-modal");if(existing)existing.remove();const modal=document.createElement("div");modal.className="mk-local-activity-modal mk-public-profile-modal";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.innerHTML=`<div class="mk-local-activity-panel" role="document"><div class="mk-local-activity-head"><div><div class="mk-local-activity-title">Public profile</div><div class="mk-local-activity-sub">Loading…</div></div><div class="mk-local-activity-head-actions"><button type="button" class="mk-public-profile-theme-shortcut mk-comment-icon-btn" hidden ${iconButtonAttrs("Public profile themes")}>${iconButtonHtml("clothes", "Public profile themes")}</button><button type="button" class="mk-local-activity-close mk-comment-icon-btn" ${iconButtonAttrs("Close")}>${iconButtonHtml("x", "Close")}</button></div></div><div class="mk-local-activity-body"></div></div>`;document.body.appendChild(modal);try{document.documentElement.classList.add("mk-local-activity-open");document.body.classList.add("mk-local-activity-open");if(!mkLocalIsTouchLikeViewport())lockPageBehindModal();}catch(_){}
try{mkLocalBindViewportMetricsOnce();mkLocalUpdateViewportMetrics();window.setTimeout(mkLocalScheduleViewportMetrics,60);window.setTimeout(mkLocalScheduleViewportMetrics,220);}catch(_){}
try{const scrollSelector=".mk-public-profile-section-body,.mk-local-activity-body";const canScroll=(node)=>!!node&&node.scrollHeight>node.clientHeight+1;const scrollHostFrom=(target)=>{const first=target&&target.closest?target.closest(scrollSelector):null;if(canScroll(first))return first;const bodyHost=modal.querySelector(".mk-local-activity-body");return canScroll(bodyHost)?bodyHost:first;};modal.addEventListener("wheel",(ev)=>{const host=scrollHostFrom(ev.target);if(!host){ev.preventDefault();return;}
if(!canScroll(host)){ev.preventDefault();return;}
const delta=Number(ev.deltaY||0);const atTop=host.scrollTop<=0;const atBottom=host.scrollTop+host.clientHeight>=host.scrollHeight-1;if((delta<0&&atTop)||(delta>0&&atBottom))ev.preventDefault();},{passive:false});let lastTouchY=0;modal.addEventListener("touchstart",(ev)=>{lastTouchY=ev.touches&&ev.touches[0]?ev.touches[0].clientY:0;},{passive:true});modal.addEventListener("touchmove",(ev)=>{const host=scrollHostFrom(ev.target);if(!host){ev.preventDefault();return;}
const y=ev.touches&&ev.touches[0]?ev.touches[0].clientY:lastTouchY;const delta=y-lastTouchY;lastTouchY=y;if(!canScroll(host)){ev.preventDefault();return;}
const atTop=host.scrollTop<=0;const atBottom=host.scrollTop+host.clientHeight>=host.scrollHeight-1;if((delta>0&&atTop)||(delta<0&&atBottom))ev.preventDefault();},{passive:false});}catch(_){}
const body=modal.querySelector(".mk-local-activity-body");const sub=modal.querySelector(".mk-local-activity-sub");const refreshOnCloudSync=(ev)=>{if(!ev||!ev.detail||ev.detail.type!=="cloud-sync")return;if(body)refreshActivityLinkTitles(body);};window.addEventListener("mk-local-activity-change",refreshOnCloudSync);const close=()=>{try{closeQuickShopMenu();}catch(_){}try{window.removeEventListener("mk-local-activity-change",refreshOnCloudSync);}catch(_){}try{modal.remove();}catch(_){}try{if(!document.querySelector(".mk-local-activity-modal")){document.documentElement.classList.remove("mk-local-activity-open");document.body.classList.remove("mk-local-activity-open");unlockPageBehindModal();mkLocalUnbindViewportMetrics();}}catch(_){}};modal.addEventListener("click",(ev)=>{if(ev.target===modal)close();});modal.querySelector(".mk-local-activity-close").addEventListener("click",close);const profileThemeBtn=modal.querySelector(".mk-public-profile-theme-shortcut");if(profileThemeBtn){profileThemeBtn.addEventListener("click",(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}
try{openQuickShopMenu(profileThemeBtn,{categories:["Public Profile themes"],title:"Profile themes"});}catch(_){}});}
let data=await fetchPublicProfile(nm,opts);const localForSelfPreview=readLocalProfile()||{};const isRequestedSelf=!!(requestedAccountKey&&localForSelfPreview.accountKey&&requestedAccountKey.toLowerCase()===String(localForSelfPreview.accountKey||"").toLowerCase());if((!data||!data.ok)&&(opts.selfPreview||isRequestedSelf)){const local=localForSelfPreview;const root=document.documentElement;data={ok:true,profile:Object.assign({},local,{name:local.name||nm||requestedAccountKey}),comments:[],actions:[],visits:[],level:1,totalScore:0,viewerIsConnection:false,equippedCosmetics:{profile_frame:root&&root.getAttribute?root.getAttribute("data-mk-profile-frame")||"":"",profile_background:root&&root.getAttribute?root.getAttribute("data-mk-profile-background")||"":"",public_profile_theme:root&&root.getAttribute?root.getAttribute("data-mk-public-profile-theme-item")||"":""}};}
if((!data||!data.ok)&&opts.source==="rankings"&&opts.rankingProfile&&typeof opts.rankingProfile==="object"){const rp=opts.rankingProfile;data={ok:true,profile:{accountKey:requestedAccountKey||rp.accountKey||"",name:rp.name||nm||requestedAccountKey||"Public user",avatar:rp.avatar||"",avatarFrame:rp.avatarFrame||"level-1",bio:rp.bio||rp.intro||""},comments:[],actions:[],visits:[],level:opts.rankingXp&&opts.rankingXp.level||1,totalScore:opts.rankingXp&&opts.rankingXp.totalXp||0,viewerIsConnection:false,equippedCosmetics:rp.equippedCosmetics||{}};}
if(!data||!data.ok){sub.textContent="This profile is private or unavailable.";return;}
const prof=data.profile||{};if(profileThemeBtn){profileThemeBtn.hidden=!isPublicProfileSelfTarget(prof,nm,requestedAccountKey,opts);}
try{const fx=(data.equippedCosmetics||prof.equippedCosmetics||{});const localForCosmetics=readLocalProfile()||{};const localAccountKey=String(localForCosmetics.accountKey||localForCosmetics.account_key||"").replace(/^user:/i,"").trim().toLowerCase();const profileAccountKey=String(prof.accountKey||prof.account_key||prof.account||"").replace(/^user:/i,"").trim().toLowerCase();const requestedKey=String(requestedAccountKey||"").replace(/^user:/i,"").trim().toLowerCase();const isSelfCosmeticPreview=!!(opts.selfPreview||opts.source==="shop-preview"||(localAccountKey&&profileAccountKey&&localAccountKey===profileAccountKey)||(localAccountKey&&requestedKey&&localAccountKey===requestedKey));const applyModalCosmetics=()=>{try{modal.removeAttribute("data-profile-frame");modal.removeAttribute("data-profile-background");const rootThemeItem=document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-mk-public-profile-theme-item")||"":"";const itemId=isSelfCosmeticPreview?(rootThemeItem||fx.public_profile_theme||""):(fx.public_profile_theme||"");applyPublicProfileImageTheme(modal,itemId);}catch(_){}};applyModalCosmetics();if(isSelfCosmeticPreview){const onCosmeticChange=()=>{try{if(window.MkAccountData&&typeof window.MkAccountData.applyEquippedCosmetics==="function")window.MkAccountData.applyEquippedCosmetics();}catch(_){}
[0,80,220].forEach((delay)=>{try{window.setTimeout(applyModalCosmetics,delay);}catch(_){}});};try{window.addEventListener("mk-shop-trial-change",onCosmeticChange);}catch(_){}
try{window.addEventListener("mk-shop-inventory-change",onCosmeticChange);}catch(_){}
cleanupPublicProfileCosmeticListeners=()=>{try{window.removeEventListener("mk-shop-trial-change",onCosmeticChange);}catch(_){}
try{window.removeEventListener("mk-shop-inventory-change",onCosmeticChange);}catch(_){}};}}catch(_){}
if(sub){sub.textContent="";sub.hidden=true;}
data=mergePublicProfileWithLocalSelfRows(data,prof,nm,requestedAccountKey,opts);const bio=cleanProfileBioLocal(prof.bio||prof.description||prof.intro||"");const xpOverride=opts&&opts.rankingXp&&typeof opts.rankingXp==="object"?opts.rankingXp:null;const displayLevel=xpOverride&&xpOverride.level!=null?xpOverride.level:(data.level||1);const displayTotalScore=xpOverride&&xpOverride.totalXp!=null?xpOverride.totalXp:(data.totalScore||0);const displayXpSource=xpOverride&&xpOverride.totalXp!=null?"":"";body.innerHTML=`<div class="mk-local-profile-card"><div class="mk-local-profile-preview mk-public-profile-preview">${avatarHtml(prof.name || nm, prof.avatar || "", prof.avatarFrame || "level-1")}<div class="mk-public-profile-main"><div class="mk-local-profile-name">${escapeHtml(prof.name || nm)}</div><div class="mk-local-activity-meta">Level ${escapeHtml(displayLevel)} · ${escapeHtml(displayTotalScore)} XP${displayXpSource}${data.viewerIsConnection ? " · study connection" : ""}</div></div><div class="mk-public-profile-bio${bio ? "" : " is-empty"}">${escapeHtml(bio || "No profile intro yet.")}</div><button type="button" class="mk-comment-small-btn mk-public-profile-connect" title="Add study connection" aria-label="Add study connection">${iconButtonHtml("link", "Add study connection")}</button></div></div>${renderPublicProfileSection("Recent comments", renderPublicProfileRows(data.comments, "comments"))}${renderPublicProfileSection("Saved pages", renderPublicProfileRows(data.actions, "actions"))}${renderPublicProfileSection("Recent visits", renderPublicProfileRows(data.visits, "visits"))}${renderPublicProfileSection("Course readiness", renderPublicProfileRows(data.readiness, "readiness"))}`;updatePublicProfileSectionScrollState(body);body.querySelectorAll(".mk-public-profile-section").forEach((sec)=>{sec.addEventListener("toggle",()=>{const inner=sec.querySelector(".mk-public-profile-section-body");updatePublicProfileSectionScrollState(body);if(sec.open){body.querySelectorAll(".mk-public-profile-section[open]").forEach((other)=>{if(other!==sec)other.open=false;});if(inner)inner.scrollTop=0;try{void sec.offsetHeight;void(inner&&inner.offsetHeight);}catch(_){}
window.setTimeout(()=>{try{sec.scrollIntoView({block:"nearest",inline:"nearest"});}catch(_){}},0);}});});refreshActivityLinkTitles(body);const connectBtn=body.querySelector(".mk-public-profile-connect");if(connectBtn){const localProfile=readLocalProfile()||{};const localKey=String(localProfile.accountKey||"").replace(/^user:/i,"").trim().toLowerCase();const profileKey=String(prof.accountKey||requestedAccountKey||"").replace(/^user:/i,"").trim();let connectionStatus=String(data.connectionStatus||(data.viewerIsConnection?"accepted":"none")).toLowerCase();if(localKey&&profileKey&&localKey===profileKey.toLowerCase())connectionStatus="self";const paintConnectButton=(status)=>{const s=String(status||"none").toLowerCase();connectBtn.hidden=s==="accepted"||s==="self";connectBtn.disabled=s==="outgoing";const label=s==="incoming"?"Accept study connection":s==="outgoing"?"Connection request sent":"Add study connection";connectBtn.title=label;connectBtn.setAttribute("aria-label",label);connectBtn.innerHTML=iconButtonHtml(s==="incoming"?"check":"link",label);};paintConnectButton(connectionStatus);connectBtn.addEventListener("click",async()=>{connectBtn.disabled=true;const res=connectionStatus==="incoming"?await respondConnection(profileKey,"accept"):await requestConnection(prof.name||nm);connectBtn.disabled=false;if(!res||!res.ok){window.alert((res&&res.error)||(connectionStatus==="incoming"?"Could not accept connection request.":"Could not send connection request."));return;}
connectionStatus=res.status==="accepted"?"accepted":"outgoing";paintConnectButton(connectionStatus);window.alert(connectionStatus==="accepted"?"You are now connected.":(res.alreadyPending?"Connection request was already sent.":"Connection request sent."));});}}
function alertCooldown(result){const cd=result&&result.cooldown;if(cd&&cd.until){window.alert(`${result.error || "This profile change is still cooling down."}\n\nAvailable again: ${formatCooldownDate(cd.until)}`);return;}
window.alert((result&&result.error)||"This profile change is still cooling down.");}
let __mkPageEditModalLockCount=0;let __mkPageEditModalLockSnapshot=null;function mkPageEditScrollableFrom(target,modal){try{let el=target&&target.nodeType===1?target:(target&&target.parentElement);const panel=modal&&modal.querySelector?modal.querySelector(".mk-local-mini-panel"):null;while(el&&el!==modal){const cs=window.getComputedStyle?window.getComputedStyle(el):null;const oy=String((cs&&cs.overflowY)||"");const canScroll=/(auto|scroll|overlay)/i.test(oy)&&el.scrollHeight>el.clientHeight+1;if(canScroll)return el;el=el.parentElement;}
if(panel&&panel.scrollHeight>panel.clientHeight+1)return panel;}catch(_){}
return null;}
function lockPageBehindPageEditModal(modal){if(!modal)return function(){};__mkPageEditModalLockCount+=1;const root=document.documentElement;const body=document.body;if(!__mkPageEditModalLockSnapshot){__mkPageEditModalLockSnapshot={scrollX:window.scrollX||window.pageXOffset||0,scrollY:window.scrollY||window.pageYOffset||0,rootOverflow:root&&root.style?root.style.overflow:"",rootOverscroll:root&&root.style?root.style.overscrollBehavior:"",bodyOverflow:body&&body.style?body.style.overflow:"",bodyOverscroll:body&&body.style?body.style.overscrollBehavior:"",};try{if(root&&root.style){root.style.overflow="hidden";root.style.overscrollBehavior="contain";}}catch(_){}
try{if(body&&body.style){body.style.overflow="hidden";body.style.overscrollBehavior="contain";}}catch(_){}
try{root&&root.classList&&root.classList.add("mk-page-edit-open");}catch(_){}
try{body&&body.classList&&body.classList.add("mk-page-edit-open");}catch(_){}}
const canScroll=(el)=>!!(el&&el.scrollHeight>el.clientHeight+1);const onWheel=(ev)=>{try{if(!modal.contains(ev.target)){ev.preventDefault();ev.stopPropagation();return;}
const host=mkPageEditScrollableFrom(ev.target,modal);if(!canScroll(host)){ev.preventDefault();return;}
const dy=Number(ev.deltaY||0);const atTop=host.scrollTop<=0;const atBottom=host.scrollTop+host.clientHeight>=host.scrollHeight-1;if((dy<0&&atTop)||(dy>0&&atBottom))ev.preventDefault();}catch(_){}};let lastTouchY=0;const onTouchStart=(ev)=>{try{lastTouchY=ev.touches&&ev.touches[0]?ev.touches[0].clientY:0;}catch(_){}};const onTouchMove=(ev)=>{try{if(!modal.contains(ev.target)){ev.preventDefault();ev.stopPropagation();return;}
const host=mkPageEditScrollableFrom(ev.target,modal);const y=ev.touches&&ev.touches[0]?ev.touches[0].clientY:lastTouchY;const dy=y-lastTouchY;lastTouchY=y;if(!canScroll(host)){ev.preventDefault();return;}
const atTop=host.scrollTop<=0;const atBottom=host.scrollTop+host.clientHeight>=host.scrollHeight-1;if((dy>0&&atTop)||(dy<0&&atBottom))ev.preventDefault();}catch(_){}};const onPointerDown=(ev)=>{try{if(!modal.contains(ev.target)){ev.preventDefault();ev.stopPropagation();if(typeof ev.stopImmediatePropagation==="function")ev.stopImmediatePropagation();}}catch(_){}};try{window.addEventListener("wheel",onWheel,{capture:true,passive:false});}catch(_){try{window.addEventListener("wheel",onWheel,true);}catch(_){}}
try{window.addEventListener("touchstart",onTouchStart,{capture:true,passive:true});}catch(_){try{window.addEventListener("touchstart",onTouchStart,true);}catch(_){}}
try{window.addEventListener("touchmove",onTouchMove,{capture:true,passive:false});}catch(_){try{window.addEventListener("touchmove",onTouchMove,true);}catch(_){}}
try{window.addEventListener("pointerdown",onPointerDown,true);}catch(_){}
let unlocked=false;return function unlockPageEditModal(){if(unlocked)return;unlocked=true;try{window.removeEventListener("wheel",onWheel,true);}catch(_){}
try{window.removeEventListener("touchstart",onTouchStart,true);}catch(_){}
try{window.removeEventListener("touchmove",onTouchMove,true);}catch(_){}
try{window.removeEventListener("pointerdown",onPointerDown,true);}catch(_){}
__mkPageEditModalLockCount=Math.max(0,__mkPageEditModalLockCount-1);if(__mkPageEditModalLockCount>0)return;const snap=__mkPageEditModalLockSnapshot;__mkPageEditModalLockSnapshot=null;try{root&&root.classList&&root.classList.remove("mk-page-edit-open");}catch(_){}
try{body&&body.classList&&body.classList.remove("mk-page-edit-open");}catch(_){}
if(snap){try{if(root&&root.style){root.style.overflow=snap.rootOverflow||"";root.style.overscrollBehavior=snap.rootOverscroll||"";}}catch(_){}
try{if(body&&body.style){body.style.overflow=snap.bodyOverflow||"";body.style.overscrollBehavior=snap.bodyOverscroll||"";}}catch(_){}
try{window.scrollTo(snap.scrollX||0,snap.scrollY||0);}catch(_){}}};}
let accountDialogSequence=0;function bindAccountDialogFocus(modal,close,titleSelector){const previous=document.activeElement;const previousId=previous&&previous.id;const title=modal.querySelector(titleSelector);const id=`mk-account-dialog-${++accountDialogSequence}`;if(title){title.id=`${id}-title`;modal.setAttribute("aria-labelledby",title.id);}
modal.tabIndex=-1;const isTop=()=>{const dialogs=Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]'));return dialogs[dialogs.length-1]===modal;};const focusable=()=>Array.from(modal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter((node)=>node.getClientRects().length&&!node.closest('[hidden]'));const onKey=(event)=>{if(event.isComposing||event.keyCode===229)return;if(!isTop())return;if(event.key==="Escape"){event.preventDefault();event.stopPropagation();close();return;}
if(event.key!=="Tab")return;const items=focusable();const first=items[0]||modal,last=items[items.length-1]||modal;if(!modal.contains(document.activeElement)||(event.shiftKey?document.activeElement===first:document.activeElement===last)||!items.length){event.preventDefault();(event.shiftKey?last:first).focus();}};const onFocus=(event)=>{if(isTop()&&!modal.contains(event.target))(focusable()[0]||modal).focus();};document.addEventListener("keydown",onKey,true);document.addEventListener("focusin",onFocus,true);window.requestAnimationFrame(()=>{if(modal.isConnected&&isTop()&&!modal.contains(document.activeElement))(focusable()[0]||modal).focus();});return()=>{document.removeEventListener("keydown",onKey,true);document.removeEventListener("focusin",onFocus,true);const canRestore=(node)=>node&&node.isConnected&&!node.disabled&&typeof node.focus==="function"&&node.getClientRects().length&&!node.closest('[hidden],[inert]')&&(typeof window.getComputedStyle!=="function"||window.getComputedStyle(node).visibility==="visible");const target=canRestore(previous)?previous:(previousId?document.getElementById(previousId):null);if(canRestore(target))target.focus();};}
function openLocalMiniModal(titleText){ensureStylesOnce();const modal=document.createElement("div");modal.className="mk-local-mini-modal";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.innerHTML=`
      <div class="mk-local-mini-panel" role="document">
        <div class="mk-local-mini-head">
          <div class="mk-local-mini-title">${escapeHtml(titleText || "Edit")}</div>
          <button type="button" class="mk-local-activity-close mk-comment-icon-btn" ${iconButtonAttrs("Close")}>${iconButtonHtml("x", "Close")}</button>
        </div>
        <div class="mk-local-mini-body"></div>
      </div>`;document.body.appendChild(modal);const closeCallbacks=[];let releaseFocus=()=>{};let didClose=false;const close=()=>{if(didClose)return;didClose=true;try{closeCallbacks.splice(0).forEach((fn)=>{try{if(typeof fn==="function")fn();}catch(_){}});}catch(_){}
try{modal.remove();}catch(_){}
releaseFocus();};releaseFocus=bindAccountDialogFocus(modal,close,".mk-local-mini-title");modal.addEventListener("click",(ev)=>{if(ev.target===modal)close();});const closeBtn=modal.querySelector(".mk-local-activity-close");if(closeBtn)closeBtn.addEventListener("click",close);return{modal,body:modal.querySelector(".mk-local-mini-body"),close,onClose:(fn)=>{if(typeof fn==="function")closeCallbacks.push(fn);}};}
function accountCurrencySummary(score){const s=score&&typeof score==="object"?score:{};const hasCurrencyFields=s.totalCurrencyEarned!=null||s.currencyEarned!=null||s.currencyBalance!=null||s.eorbits!=null||s.currencySpent!=null||s.currencyCredited!=null;const earned=Number(hasCurrencyFields?(s.totalCurrencyEarned!=null?s.totalCurrencyEarned:(s.currencyEarned!=null?s.currencyEarned:0)):(s.totalScore!=null?s.totalScore:(s.totalXp!=null?s.totalXp:0)));const credited=Number(s.currencyCredited||0);const spent=Number(s.currencySpent||0);let balance=Number(s.currencyBalance!=null?s.currencyBalance:(s.eorbits!=null?s.eorbits:NaN));if(!Number.isFinite(balance))balance=Math.max(0,(Number.isFinite(earned)?earned:0)+(Number.isFinite(credited)?credited:0)-(Number.isFinite(spent)?spent:0));try{const profile=readLocalProfile();if(profile&&profile.accountKey){const sc=JSON.parse(localStorage.getItem("mk_account_synced_cloud_fp_v1")||"null");if(sc&&Number(sc.at||0)>0&&sc.currencyBalance!=null&&Number.isFinite(Number(sc.currencyBalance))){balance=Math.max(0,Number(sc.currencyBalance));}}}catch(_){}
return{name:s.currencyName||LEARNING_CURRENCY_NAME,singular:s.currencySingular||LEARNING_CURRENCY_SINGULAR,earned:Math.max(0,Number.isFinite(earned)?earned:0),credited:Math.max(0,Number.isFinite(credited)?credited:0),spent:Math.max(0,Number.isFinite(spent)?spent:0),balance:Math.max(0,Number.isFinite(balance)?balance:0)};}
const ACCOUNT_LEVEL_THRESHOLDS_FALLBACK=[0,50,140,300,600,1100,1900,3200,5200,8000];function normaliseThresholds(input){const arr=Array.isArray(input)?input:[];const out=arr.map((item,idx)=>{if(typeof item==="number"){const total=Math.max(0,Number(item)||0);return{level:idx+1,total,delta:idx===0?0:total-Math.max(0,Number(arr[idx-1])||0)};}
const level=Math.max(1,Math.floor(Number(item&&item.level)||idx+1));const total=Math.max(0,Number(item&&(item.total!=null?item.total:item.xp))||0);const prev=idx>0?Math.max(0,Number((arr[idx-1]&&(arr[idx-1].total!=null?arr[idx-1].total:arr[idx-1].xp))||arr[idx-1]||0)):0;return{level,total,delta:idx===0?0:Math.max(0,total-prev)};}).filter((x)=>Number.isFinite(Number(x.total)));if(out.length)return out;return ACCOUNT_LEVEL_THRESHOLDS_FALLBACK.map((total,idx)=>({level:idx+1,total,delta:idx===0?0:total-ACCOUNT_LEVEL_THRESHOLDS_FALLBACK[idx-1]}));}
function xpForLevelStart(level,thresholds){const rows=normaliseThresholds(thresholds);const l=Math.max(1,Math.floor(Number(level)||1));const row=rows.find((x)=>Number(x.level)===l)||rows[l-1];if(row)return Math.max(0,Number(row.total)||0);return Math.max(0,Number(rows[rows.length-1]&&rows[rows.length-1].total)||0);}
function accountLevelFromXp(totalXp,thresholds){const xp=Math.max(0,Number(totalXp)||0);const rows=normaliseThresholds(thresholds);let level=1;rows.forEach((row)=>{if(xp>=Number(row.total||0))level=Math.max(level,Number(row.level||1));});return level;}
function normaliseAccountScoreData(data,sourceLabel){if(!data||typeof data!=="object")return null;const total=data.totalScore!=null?Number(data.totalScore):(data.totalXp!=null?Number(data.totalXp):Number(data.score!=null?data.score:data.count));if(!Number.isFinite(total))return null;const thresholds=normaliseThresholds(data.levelThresholds||data.thresholds||data.levels||[]);const levelRaw=Number(data.level||0);const level=Number.isFinite(levelRaw)&&levelRaw>0?Math.floor(levelRaw):accountLevelFromXp(total,thresholds);const scoreRaw=data.periodScore!=null?Number(data.periodScore):(data.score!=null?Number(data.score):null);return{level,totalScore:Math.max(0,total),periodScore:Number.isFinite(scoreRaw)?scoreRaw:null,accountKey:String(data.accountKey||data.account_key||""),name:String(data.name||data.title||data.username||data.displayName||""),avatarFrame:cleanAvatarFrameLocal(data.avatarFrame||data.selectedAvatarFrame||"level-1"),unlockedAvatarFrames:normaliseUnlockedAvatarFramesLocal(data.unlockedAvatarFrames||data.unlockedFrames,Math.max(level,Number(data.highestLevelSeen||data.highest_level_seen||0))),highestLevelSeen:data.highestLevelSeen==null?(data.highest_level_seen==null?null:Number(data.highest_level_seen)):Number(data.highestLevelSeen),lastLevelUpAt:data.lastLevelUpAt==null?null:Number(data.lastLevelUpAt),source:sourceLabel||data.source||"server",sourceDetail:data.sourceDetail||data.consistency||"",thresholds,maxLevel:Number(data.maxLevel||(thresholds[thresholds.length-1]&&thresholds[thresholds.length-1].level)||10),nextLevel:data.nextLevel==null?null:Number(data.nextLevel),levelStart:data.levelStart==null?null:Number(data.levelStart),nextLevelStart:data.nextLevelStart==null?null:Number(data.nextLevelStart),intoLevel:data.intoLevel==null?null:Number(data.intoLevel),levelSpan:data.levelSpan==null?null:Number(data.levelSpan),toNext:data.toNext==null?null:Number(data.toNext),progressPct:data.progressPct==null?null:Number(data.progressPct),rules:normaliseAccountXpRules(data.rules),weights:data.weights&&typeof data.weights==="object"?data.weights:{},dailyCap:data.dailyCap==null?null:Number(data.dailyCap),rawScore:data.rawScore==null?null:Number(data.rawScore),scoreBeforeDailyCap:data.scoreBeforeDailyCap==null?null:Number(data.scoreBeforeDailyCap),metricCapApplied:!!data.metricCapApplied,dailyCapApplied:!!data.dailyCapApplied,legacyUncapped:!!data.legacyUncapped,totalsReconciled:!!data.totalsReconciled,sourceEvents:!!data.sourceEvents,repeatDiscountApplied:!!data.repeatDiscountApplied,totalRepeatAdjustedScore:data.totalRepeatAdjustedScore==null?null:Number(data.totalRepeatAdjustedScore),lastSyncedAt:data.lastSyncedAt==null?null:Number(data.lastSyncedAt),cachedAt:data.cachedAt==null?null:Number(data.cachedAt),isCompleteXp:!!data.isCompleteXp,todayDay:data.todayDay?String(data.todayDay):"",todayXp:data.todayXp&&typeof data.todayXp==="object"?data.todayXp:null,dailySummary:Array.isArray(data.dailySummary)?data.dailySummary:[],breakdown:Array.isArray(data.breakdown)?data.breakdown:[],currencyName:data.currencyName||LEARNING_CURRENCY_NAME,currencySingular:data.currencySingular||LEARNING_CURRENCY_SINGULAR,totalCurrencyEarned:data.totalCurrencyEarned==null?(data.currencyEarned==null?null:Number(data.currencyEarned)):Number(data.totalCurrencyEarned),currencyEarned:data.currencyEarned==null?(data.totalCurrencyEarned==null?null:Number(data.totalCurrencyEarned)):Number(data.currencyEarned),currencyCredited:data.currencyCredited==null?0:Number(data.currencyCredited),currencySpent:data.currencySpent==null?0:Number(data.currencySpent),currencyBalance:data.currencyBalance==null?(data.eorbits==null?null:Number(data.eorbits)):Number(data.currencyBalance),eorbits:data.eorbits==null?(data.currencyBalance==null?null:Number(data.currencyBalance)):Number(data.eorbits),events:Array.isArray(data.events)?data.events:[],};}
function readLiveAccountEventXpScore(opts){const options=opts&&typeof opts==="object"?opts:{};try{const api=window.MkAccountData||null;if(!api)return null;let xp=null;if(!options.fresh&&typeof api.xpSnapshot==="function")xp=api.xpSnapshot();if(!xp&&!options.fresh&&typeof api.xpCachedNoCompute==="function")xp=api.xpCachedNoCompute();if(!xp&&options.fresh&&typeof api.xpFresh==="function")xp=api.xpFresh();if(!xp||typeof xp!=="object")return null;const profile=readLocalProfile();const score=normaliseAccountScoreData(Object.assign({},xp,{name:profile.name||xp.name||"",accountKey:profile.accountKey||xp.accountKey||"",avatarFrame:profile.avatarFrame||xp.avatarFrame||xp.selectedAvatarFrame||"level-1",lastSyncedAt:Number(xp.lastSyncedAt||xp.cachedAt||Date.now())||Date.now(),cachedAt:Number(xp.cachedAt||Date.now())||Date.now(),isCompleteXp:true,sourceEvents:true,source:"Local account XP snapshot",sourceDetail:"precomputed local account XP snapshot",canonicalSnapshotVersion:xp.canonicalSnapshotVersion||xp.calculationVersion||"local-account-event-xp-snapshot"}),"Local account XP snapshot");return score&&isCompleteAccountXpScore(score)&&accountXpCacheMatchesCurrentProfile(score)?score:null;}catch(_){return null;}}
function accountXpNeedsPanelRefresh(score){try{if(!score||!isCompleteAccountXpScore(score))return true;if(!accountXpHasUsefulHistory(score)&&Number(score.totalScore||0)>0.000001)return true;const today=todayUtcDayLocal();const hasTodayBucket=Array.isArray(score.dailySummary)&&score.dailySummary.some((d)=>String(d&&d.day||"")===today&&(Math.abs(Number(d&&(d.score!=null?d.score:d.countedScore)||0))+Math.abs(Number(d&&(d.currencyEarned!=null?d.currencyEarned:d.currency)||0))+Math.abs(Number(d&&d.count||0))>0.000001));if(!hasTodayBucket&&accountXpHasUsefulHistory(score))return true;return false;}catch(_){return false;}}
function accountXpCacheIdentity(score){const profile=readLocalProfile();return String((score&&score.accountKey)||profile.accountKey||profile.name||"local").trim().toLowerCase()||"local";}
function accountXpCacheStorageKey(score){return ACCOUNT_XP_CACHE_KEY_PREFIX+accountXpCacheIdentity(score);}
function accountXpCacheMatchesCurrentProfile(score){if(!score||typeof score!=="object")return false;const profile=readLocalProfile();const currentKey=String(profile.accountKey||"").trim().toLowerCase();const currentName=cleanProfileNameLocal(profile.name||"").toLowerCase();const scoreKey=String(score.accountKey||score.account_key||"").trim().toLowerCase();const scoreName=cleanProfileNameLocal(score.name||score.title||score.username||"").toLowerCase();if(currentKey&&scoreKey&&scoreKey===currentKey)return true;if(currentName&&scoreName&&scoreName===currentName)return true;if(!currentKey&&currentName&&(!scoreKey||scoreKey===currentName)&&(!scoreName||scoreName===currentName))return true;return false;}
function writeCachedAccountXp(score){if(!isCompleteAccountXpScore(score)||!accountXpCacheMatchesCurrentProfile(score))return false;const profile=readLocalProfile();const now=Date.now();const clean=Object.assign({},score,{accountKey:String(score.accountKey||profile.accountKey||""),name:String(score.name||profile.name||""),cachedAt:now,lastSyncedAt:Number(score.lastSyncedAt||now),isCompleteXp:true,cacheSchemaVersion:ACCOUNT_XP_CACHE_SCHEMA_VERSION,cacheSource:"identity-xp-canonical"});const payload=JSON.stringify({cachedAt:now,schemaVersion:ACCOUNT_XP_CACHE_SCHEMA_VERSION,accountKey:clean.accountKey||"",name:clean.name||"",score:clean});let ok=false;const keys=new Set([ACCOUNT_XP_CACHE_LATEST_KEY,accountXpCacheStorageKey(clean)]);const byKey=String(clean.accountKey||profile.accountKey||"").trim().toLowerCase();const byName=cleanProfileNameLocal(clean.name||profile.name||"").toLowerCase();if(byKey)keys.add(ACCOUNT_XP_CACHE_KEY_PREFIX+byKey);if(byName)keys.add(ACCOUNT_XP_CACHE_KEY_PREFIX+byName);try{keys.forEach((key)=>{if(key){localStorage.setItem(key,payload);ok=true;}});try{const light=JSON.stringify({cachedAt:now,schemaVersion:ACCOUNT_XP_CACHE_SCHEMA_VERSION,accountKey:clean.accountKey||"",name:clean.name||"",score:{totalScore:Number(clean.totalScore||0)||0,totalXp:Number(clean.totalScore||clean.totalXp||0)||0,level:Number(clean.level||1)||1,thresholds:clean.thresholds||clean.levelThresholds||[],progressPct:clean.progressPct==null?null:Number(clean.progressPct),intoLevel:clean.intoLevel==null?null:Number(clean.intoLevel),levelSpan:clean.levelSpan==null?null:Number(clean.levelSpan),nextLevel:clean.nextLevel==null?null:Number(clean.nextLevel),dailyCap:clean.dailyCap==null?null:Number(clean.dailyCap),totalCurrencyEarned:clean.totalCurrencyEarned==null?null:Number(clean.totalCurrencyEarned),currencyEarned:clean.currencyEarned==null?null:Number(clean.currencyEarned),currencyCredited:Number(clean.currencyCredited||0)||0,currencySpent:Number(clean.currencySpent||0)||0,currencyBalance:clean.currencyBalance==null?(clean.eorbits==null?null:Number(clean.eorbits)):Number(clean.currencyBalance),eorbits:clean.eorbits==null?(clean.currencyBalance==null?null:Number(clean.currencyBalance)):Number(clean.eorbits),avatarFrame:clean.avatarFrame||clean.selectedAvatarFrame||"level-1",accountKey:clean.accountKey||"",name:clean.name||"",cachedAt:now,lastSyncedAt:Number(clean.lastSyncedAt||now),isCompleteXp:true,sourceEvents:true,lightCache:true}});const lightKeys=new Set([ACCOUNT_XP_LIGHT_CACHE_LATEST_KEY]);if(byKey)lightKeys.add(ACCOUNT_XP_LIGHT_CACHE_KEY_PREFIX+byKey);if(byName)lightKeys.add(ACCOUNT_XP_LIGHT_CACHE_KEY_PREFIX+byName);lightKeys.forEach((key)=>{if(key)localStorage.setItem(key,light);});}catch(_){}
return ok;}catch(_){return ok;}}
function parseQuickLightAccountXpFromRaw(raw){try{if(!raw||String(raw).indexOf('"schemaVersion":'+ACCOUNT_XP_CACHE_SCHEMA_VERSION)<0)return null;const total=cachedRawNumber(raw,["totalScore","totalXp"]);if(!Number.isFinite(Number(total)))return null;const profile=readLocalProfile();const accountKeyRaw=cachedRawString(raw,"accountKey");const nameRaw=cachedRawString(raw,"name");const scoreRaw={totalScore:Number(total),totalXp:Number(total),level:cachedRawNumber(raw,"level"),progressPct:cachedRawNumber(raw,"progressPct"),intoLevel:cachedRawNumber(raw,"intoLevel"),levelSpan:cachedRawNumber(raw,"levelSpan"),nextLevel:cachedRawNumber(raw,"nextLevel"),dailyCap:cachedRawNumber(raw,"dailyCap"),totalCurrencyEarned:cachedRawNumber(raw,"totalCurrencyEarned"),currencyEarned:cachedRawNumber(raw,"currencyEarned"),currencyCredited:cachedRawNumber(raw,"currencyCredited")||0,currencySpent:cachedRawNumber(raw,"currencySpent")||0,currencyBalance:cachedRawNumber(raw,["currencyBalance","eorbits"]),eorbits:cachedRawNumber(raw,["eorbits","currencyBalance"]),avatarFrame:cachedRawString(raw,["avatarFrame","selectedAvatarFrame"])||"level-1",accountKey:accountKeyRaw||profile.accountKey||"",name:nameRaw||profile.name||"",cachedAt:cachedRawNumber(raw,"cachedAt")||0,lastSyncedAt:cachedRawNumber(raw,"lastSyncedAt")||0,rules:[],breakdown:[],dailySummary:[],isCompleteXp:true,sourceEvents:true,lightCache:true};const score=normaliseAccountScoreData(scoreRaw,"Local XP quick cache");if(!score)return null;score.cachedAt=Number(scoreRaw.cachedAt||scoreRaw.lastSyncedAt||0)||0;score.lastSyncedAt=Number(scoreRaw.lastSyncedAt||score.cachedAt||0)||0;score.isCompleteXp=true;score.sourceEvents=true;score.lightCache=true;if(!isCompleteAccountXpScore(score)||!accountXpCacheMatchesCurrentProfile(score))return null;return score;}catch(_){return null;}}
function parseLightCachedAccountXpRecord(raw){try{if(!raw)return null;const parsed=JSON.parse(raw);if(Number(parsed&&parsed.schemaVersion||0)!==ACCOUNT_XP_CACHE_SCHEMA_VERSION)return null;const scoreRaw=parsed&&parsed.score?Object.assign({},parsed.score):Object.assign({},parsed||{});if(!scoreRaw.accountKey&&parsed&&parsed.accountKey)scoreRaw.accountKey=parsed.accountKey;if(!scoreRaw.name&&parsed&&parsed.name)scoreRaw.name=parsed.name;const profile=readLocalProfile();if(!scoreRaw.name&&profile&&profile.name)scoreRaw.name=profile.name;scoreRaw.rules=Array.isArray(scoreRaw.rules)?scoreRaw.rules:[];scoreRaw.breakdown=Array.isArray(scoreRaw.breakdown)?scoreRaw.breakdown:[];scoreRaw.dailySummary=Array.isArray(scoreRaw.dailySummary)?scoreRaw.dailySummary:[];scoreRaw.isCompleteXp=true;scoreRaw.sourceEvents=true;const score=normaliseAccountScoreData(scoreRaw,"Local XP light cache");if(!score)return null;score.cachedAt=Number((parsed&&parsed.cachedAt)||scoreRaw.cachedAt||scoreRaw.lastSyncedAt||0)||0;score.lastSyncedAt=Number(scoreRaw.lastSyncedAt||score.cachedAt||0)||0;score.isCompleteXp=true;score.sourceEvents=true;score.lightCache=true;score.cacheSchemaVersion=ACCOUNT_XP_CACHE_SCHEMA_VERSION;if(!isCompleteAccountXpScore(score)||!accountXpCacheMatchesCurrentProfile(score))return null;return score;}catch(_){return null;}}
function parseCachedAccountXpRecord(raw){try{if(!raw)return null;const parsed=JSON.parse(raw);if(Number(parsed&&parsed.schemaVersion||0)!==ACCOUNT_XP_CACHE_SCHEMA_VERSION)return null;const scoreRaw=parsed&&parsed.score?Object.assign({},parsed.score):Object.assign({},parsed||{});if(!scoreRaw.accountKey&&parsed&&parsed.accountKey)scoreRaw.accountKey=parsed.accountKey;if(!scoreRaw.name&&parsed&&parsed.name)scoreRaw.name=parsed.name;const profile=readLocalProfile();if(!scoreRaw.name&&profile&&profile.name)scoreRaw.name=profile.name;const score=normaliseAccountScoreData(scoreRaw,scoreRaw&&scoreRaw.source||"Local XP cache");if(!score)return null;score.cachedAt=Number((parsed&&parsed.cachedAt)||scoreRaw.cachedAt||scoreRaw.lastSyncedAt||0)||0;score.lastSyncedAt=Number(scoreRaw.lastSyncedAt||score.cachedAt||0)||0;score.isCompleteXp=!!(scoreRaw.isCompleteXp||scoreRaw.sourceEvents||scoreRaw.breakdown);score.cacheSchemaVersion=ACCOUNT_XP_CACHE_SCHEMA_VERSION;if(!isCompleteAccountXpScore(score)||!accountXpCacheMatchesCurrentProfile(score))return null;return score;}catch(_){return null;}}
function readCachedAccountXp(options){try{const opts=options&&typeof options==="object"?options:{};const allowLive=!!opts.allowLive;const requireFull=!!opts.full;if(allowLive){const live=readLiveAccountEventXpScore();if(live)return live;}
const profile=readLocalProfile();const currentKey=String(profile.accountKey||"").trim().toLowerCase();const currentName=cleanProfileNameLocal(profile.name||"").toLowerCase();const candidates=[];const seenRaw=new Set();const addRaw=(raw)=>{if(!raw||seenRaw.has(raw))return;seenRaw.add(raw);const score=parseCachedAccountXpRecord(raw);if(score)candidates.push(score);};const keys=new Set([ACCOUNT_XP_CACHE_LATEST_KEY,accountXpCacheStorageKey(null)]);if(currentKey)keys.add(ACCOUNT_XP_CACHE_KEY_PREFIX+currentKey);if(currentName)keys.add(ACCOUNT_XP_CACHE_KEY_PREFIX+currentName);keys.forEach((key)=>{try{addRaw(localStorage.getItem(key)||"");}catch(_){}});if(!requireFull){const lightCandidates=[];const lightSeenRaw=new Set();const addLight=(raw)=>{if(!raw||lightSeenRaw.has(raw))return;lightSeenRaw.add(raw);const score=parseLightCachedAccountXpRecord(raw);if(score)lightCandidates.push(score);};const lightKeys=new Set([ACCOUNT_XP_LIGHT_CACHE_LATEST_KEY]);if(currentKey)lightKeys.add(ACCOUNT_XP_LIGHT_CACHE_KEY_PREFIX+currentKey);if(currentName)lightKeys.add(ACCOUNT_XP_LIGHT_CACHE_KEY_PREFIX+currentName);lightKeys.forEach((key)=>{try{addLight(localStorage.getItem(key)||"");}catch(_){}});const quickCandidates=[];const quickSeenRaw=new Set();const addQuick=(raw)=>{if(!raw||quickSeenRaw.has(raw))return;quickSeenRaw.add(raw);const score=parseQuickLightAccountXpFromRaw(raw);if(score)quickCandidates.push(score);};keys.forEach((key)=>{try{addQuick(localStorage.getItem(key)||"");}catch(_){}});const all=candidates.concat(lightCandidates,quickCandidates);return all.reduce((best,row)=>betterAccountXpScore(best,row),null);}
return candidates.reduce((best,row)=>betterAccountXpScore(best,row),null);}catch(_){return null;}}
let __accountXpCache=null;let __accountXpPromise=null;let __accountXpRefreshTimer=0;let __accountXpRequestSeq=0;function accountLevelSeenStorageKey(score){const profile=readLocalProfile();const key=String((score&&score.accountKey)||profile.accountKey||profile.name||"local").trim().toLowerCase();return ACCOUNT_LEVEL_SEEN_KEY_PREFIX+key;}
function clearLocalProfileCooldownsAfterLevelUp(){const p=readLocalProfile();if(!p||!p.name)return;const next=Object.assign({},p,{nameChangedAt:0,avatarChangedAt:0,nameCooldownUntil:0,avatarCooldownUntil:0,updatedAt:Date.now()});try{localStorage.setItem(LOCAL_PROFILE_KEY,JSON.stringify(next));}catch(_){}
writeLocalProfile(next);}
function showLevelUpPopup(prevLevel,nextLevel,score){try{clearLocalProfileCooldownsAfterLevelUp();applyLevelUpRewardsOnline(nextLevel).catch(()=>{});const mini=openLocalMiniModal("Level up!");mini.modal.classList.add("mk-levelup-modal");const profile=readLocalProfile();const frame=avatarFrameForLevelLocal(nextLevel);mini.body.innerHTML=`
        <div class="mk-levelup-card">
          <div class="mk-levelup-avatar">${avatarHtml(profile.name || "You", profile.avatar || "", frame)}</div>
          <div class="mk-levelup-title">Congratulations, you reached Level ${escapeHtml(nextLevel)}!</div>
          <div class="mk-levelup-sub">Username and avatar cooldowns have been cleared. You also unlocked the ${escapeHtml(avatarFrameLabelLocal(frame))} avatar frame.</div>
          <div class="mk-local-mini-actions">
            <button type="button" class="mk-comment-small-btn mk-levelup-close">Close</button>
            <button type="button" class="mk-comment-primary-btn mk-levelup-frame">Choose avatar frame</button>
          </div>
        </div>`;const close=mini.body.querySelector(".mk-levelup-close");const choose=mini.body.querySelector(".mk-levelup-frame");if(close)close.addEventListener("click",mini.close);if(choose)choose.addEventListener("click",()=>{mini.close();openAvatarFramePicker(score);});}catch(_){}}
function maybeShowLevelUp(score){if(!score)return;const summary=accountScoreSummary(score);const level=Math.max(1,Math.floor(Number(summary.level||score.level||1)));const key=accountLevelSeenStorageKey(score);let prev=0;try{prev=Number(localStorage.getItem(key)||0);}catch(_){prev=0;}
if(!prev){try{localStorage.setItem(key,String(level));}catch(_){}return;}
if(level>prev){try{localStorage.setItem(key,String(level));}catch(_){}
window.setTimeout(()=>showLevelUpPopup(prev,level,score),100);}else if(level!==prev){try{localStorage.setItem(key,String(level));}catch(_){}}}
const XP_DAILY_CAP_NOTICE_KEY_PREFIX="mk_xp_daily_cap_notice_v1:";let __dailyXpCapNoticeTimer=0;let __dailyXpCapPendingKey="";function dailyXpCapNoticeStorageKey(score,day){const profile=readLocalProfile();const key=String((score&&score.accountKey)||profile.accountKey||profile.name||"local").trim().toLowerCase()||"local";return`${XP_DAILY_CAP_NOTICE_KEY_PREFIX}${key}:${day || todayUtcDayLocal()}`;}
function todayDailyXpState(score){if(!score||score.legacyUncapped)return null;const today=todayUtcDayLocal();const cap=Number(score.dailyCap||(score.todayXp&&score.todayXp.dailyCap)||80);if(!today||!Number.isFinite(cap)||cap<=0)return null;const candidates=[];const pushRow=(row,source)=>{const r=normaliseDailySummaryRow(row);if(!r||r.day!==today)return;const counted=Math.max(0,Number(r.score||0));const before=Math.max(0,Number(r.scoreBeforeDailyCap||r.rawScore||counted||0));const rowCap=Number(r.dailyCap||cap);candidates.push({day:today,cap:rowCap,counted,before,reached:dailyXpCapActuallyReached(counted,rowCap),source});};pushRow(score.todayXp,"todayXp");(Array.isArray(score.dailySummary)?score.dailySummary:[]).forEach((row)=>pushRow(row,"dailySummary"));let detailCounted=0;let detailBefore=0;(Array.isArray(score.breakdown)?score.breakdown:[]).forEach((r)=>{(Array.isArray(r&&r.dailyDetails)?r.dailyDetails:[]).forEach((d)=>{if(String(d&&d.day||"")!==today)return;detailCounted+=Number(d.score||0);detailBefore+=Number(d.scoreBeforeDailyCap||d.rawScore||d.score||0);});});if(detailCounted||detailBefore)candidates.push({day:today,cap,counted:detailCounted,before:detailBefore,reached:dailyXpCapActuallyReached(detailCounted,cap),source:"breakdown"});let eventCounted=0;let eventBefore=0;(Array.isArray(score.events)?score.events:[]).forEach((ev)=>{if(utcDayFromLocalTs(ev&&(ev.createdAt||ev.ts||ev.updatedAt))!==today)return;const counted=Number(ev&&ev.score||0);const before=Number(ev&&(ev.scoreBeforeDailyCap||ev.repeatAdjustedScore||ev.rawScore||ev.score)||0);eventCounted+=Number.isFinite(counted)?counted:0;eventBefore+=Number.isFinite(before)?before:0;});if(eventCounted||eventBefore)candidates.push({day:today,cap,counted:eventCounted,before:eventBefore,reached:dailyXpCapActuallyReached(eventCounted,cap),source:"events"});if(!candidates.length)return null;candidates.sort((a,b)=>(Number(b.counted||0)+Number(b.before||0)*0.001)-(Number(a.counted||0)+Number(a.before||0)*0.001));const best=candidates[0];if(!best||(!best.counted&&!best.before))return null;return best;}
function showDailyXpCapPopup(score,state,storageKey){try{if(document.querySelector(".mk-local-mini-modal")){if(__dailyXpCapNoticeTimer)window.clearTimeout(__dailyXpCapNoticeTimer);__dailyXpCapNoticeTimer=window.setTimeout(()=>showDailyXpCapPopup(score,state,storageKey),1200);return;}
try{localStorage.setItem(storageKey,"1");}catch(_){}
const mini=openLocalMiniModal("Daily XP cap reached");mini.modal.classList.add("mk-xp-cap-modal");const cap=Number(state&&state.cap||score.dailyCap||0);const counted=Math.min(cap||0,Math.max(0,Number(state&&state.counted||0)));mini.body.innerHTML=`
        <div class="mk-xp-cap-card">
          <div class="mk-xp-cap-emoji" aria-hidden="true">☕</div>
          <div class="mk-xp-cap-title">You’ve maxed out today’s XP.</div>
          <div class="mk-xp-cap-sub">${escapeHtml(pickDailyCapMessage())}</div>
          <div class="mk-xp-cap-meter" aria-label="Daily XP cap">
            <div class="mk-xp-cap-meter-line"><span></span></div>
            <div class="mk-xp-cap-meter-text">${escapeHtml(formatAccountXp(counted || cap))} / ${escapeHtml(formatAccountXp(cap))} XP counted today</div>
          </div>
          <div class="mk-local-mini-actions">
            <button type="button" class="mk-comment-primary-btn mk-xp-cap-close">Got it</button>
          </div>
        </div>`;const close=mini.body.querySelector(".mk-xp-cap-close");if(close)close.addEventListener("click",mini.close);}catch(_){}}
function maybeShowDailyXpCap(score){const state=todayDailyXpState(score);if(!state||!state.reached)return;const key=dailyXpCapNoticeStorageKey(score,state.day);try{if(localStorage.getItem(key)==="1")return;}catch(_){}
if(__dailyXpCapPendingKey===key)return;__dailyXpCapPendingKey=key;if(__dailyXpCapNoticeTimer){try{window.clearTimeout(__dailyXpCapNoticeTimer);}catch(_){}}
__dailyXpCapNoticeTimer=window.setTimeout(()=>{__dailyXpCapNoticeTimer=0;__dailyXpCapPendingKey="";showDailyXpCapPopup(score,state,key);},650);}
function publishAccountXp(score){if(!score)return;const complete=isCompleteAccountXpScore(score);if(!complete&&__accountXpCache&&isCompleteAccountXpScore(__accountXpCache))return;const chosen=complete&&__accountXpCache?betterAccountXpScore(__accountXpCache,score):score;if(chosen!==score&&accountXpScoreRichness(chosen)>accountXpScoreRichness(score)+12)return;__accountXpCache=chosen;if(complete)writeCachedAccountXp(chosen);maybeShowLevelUp(chosen);maybeShowDailyXpCap(chosen);try{window.dispatchEvent(new CustomEvent("mk-account-xp-change",{detail:{score:__accountXpCache||chosen||score}}));window.dispatchEvent(new CustomEvent("mk-local-activity-change",{detail:{type:"account-xp",score:__accountXpCache||chosen||score}}));}catch(_){}}
function invalidateAccountXpCache(){__accountXpCache=null;}
function readWarmAccountXpSnapshot(){let best=null;try{if(__accountXpCache&&isCompleteAccountXpScore(__accountXpCache)&&accountXpCacheMatchesCurrentProfile(__accountXpCache))best=betterAccountXpScore(best,__accountXpCache);}catch(_){}
try{const full=readCachedAccountXp({allowLive:false,full:true});if(full&&isCompleteAccountXpScore(full)&&accountXpCacheMatchesCurrentProfile(full))best=betterAccountXpScore(best,full);}catch(_){}
try{const cached=readCachedAccountXp({allowLive:false});if(cached&&isCompleteAccountXpScore(cached)&&accountXpCacheMatchesCurrentProfile(cached))best=betterAccountXpScore(best,cached);}catch(_){}
return best;}
function runWhenUiIsIdle(fn,timeout){const task=typeof fn==="function"?fn:(()=>{});try{if(typeof window.requestIdleCallback==="function"){window.requestIdleCallback(()=>{try{task();}catch(_){}},{timeout:Math.max(250,Number(timeout||1200)||1200)});return;}}catch(_){}
try{window.setTimeout(()=>{try{task();}catch(_){}},0);}catch(_){try{task();}catch(__){}}}
function refreshAccountXpSoon(reason,delay){try{if(__accountXpRefreshTimer)window.clearTimeout(__accountXpRefreshTimer);const why=String(reason||"refresh");const minDelay=/mastery|ai-quiz|local-account-data-change/i.test(why)?1400:0;const wait=Math.max(minDelay,Math.max(0,Number(delay||0)));__accountXpRefreshTimer=window.setTimeout(()=>{__accountXpRefreshTimer=0;invalidateAccountXpCache();runWhenUiIsIdle(()=>{fetchAccountScore({force:false,reason:why}).catch(()=>null);},/mastery|ai-quiz/i.test(why)?2200:1200);},wait);}catch(_){}}
async function fetchAccountXpDetails(opts){const profile=readLocalProfile();if(!profile||!profile.name)return null;const allowHeavy=!!(opts&&(opts.allowHeavy||opts.force));try{const score=readLiveAccountEventXpScore({fresh:allowHeavy});if(score&&isCompleteAccountXpScore(score)){__accountXpRequestSeq+=1;publishAccountXp(score);return score;}}catch(_){}
return null;}
async function fetchAccountScore(opts){const profile=readLocalProfile();if(!profile||!profile.name)return null;const force=!!(opts&&opts.force);const xp=await fetchAccountXpDetails({force}).catch(()=>null);if(xp)return xp;const cached=readCachedAccountXp();if(cached){__accountXpCache=cached;return cached;}
return null;}
function accountScoreSummary(score){const thresholds=normaliseThresholds(score&&score.thresholds);const totalScore=score&&Number.isFinite(Number(score.totalScore))?Number(score.totalScore):0;const level=score&&Number(score.level)?Math.max(1,Math.floor(Number(score.level))):accountLevelFromXp(totalScore,thresholds);const levelStart=score&&score.levelStart!=null?Number(score.levelStart):xpForLevelStart(level,thresholds);const maxLevel=score&&score.maxLevel?Number(score.maxLevel):Number(thresholds[thresholds.length-1]&&thresholds[thresholds.length-1].level||10);const nextLevel=score&&score.nextLevel!==undefined?(score.nextLevel==null?null:Number(score.nextLevel)):(level<maxLevel?level+1:null);const nextLevelStart=score&&score.nextLevelStart!=null?Number(score.nextLevelStart):(nextLevel?xpForLevelStart(nextLevel,thresholds):null);const intoLevel=score&&score.intoLevel!=null?Number(score.intoLevel):Math.max(0,totalScore-levelStart);const levelSpan=score&&score.levelSpan!=null?Number(score.levelSpan):(nextLevelStart==null?0:Math.max(1,nextLevelStart-levelStart));const toNext=score&&score.toNext!=null?Number(score.toNext):(nextLevelStart==null?0:Math.max(0,nextLevelStart-totalScore));const progressPct=score&&score.progressPct!=null?Number(score.progressPct):(nextLevelStart==null?100:Math.max(0,Math.min(100,Math.round((intoLevel/Math.max(1,levelSpan))*1000)/10)));return{totalScore,level,maxLevel,nextLevel,levelStart,nextLevelStart,intoLevel,levelSpan,toNext,progressPct,thresholds};}
function todayCapStatusForMetric(score,rule){if(!score||!rule)return null;const today=todayUtcDayLocal();const dailyCap=rule.dailyCap==null?null:Number(rule.dailyCap);if(!today)return null;let rows=Array.isArray(score.breakdown)?score.breakdown:[];let row=rows.find((r)=>ruleMatchesMetric(rule,r));if(!row)return null;let details=Array.isArray(row.dailyDetails)?row.dailyDetails.slice():[];if(!details.length){details=(Array.isArray(score.events)?score.events:[]).filter((ev)=>ruleMatchesMetric(rule,ev)&&String(utcDayFromLocalTs(ev&&(ev.createdAt||ev.ts)))===today).map((ev)=>({day:today,count:1,rawScore:Number(ev&&(ev.rawScore!=null?ev.rawScore:ev.score)||0),scoreBeforeDailyCap:Number(ev&&(ev.scoreBeforeDailyCap!=null?ev.scoreBeforeDailyCap:ev.score)||0),score:Number(ev&&ev.score||0),currencyEarned:Number(ev&&(ev.currencyEarned!=null?ev.currencyEarned:ev.currency)||0),metricCapApplied:!!(ev&&ev.metricCapApplied),dayFactor:ev&&ev.dailyCapApplied?0:1,}));}
let count=0;let rawScore=0;let beforeDaily=0;let counted=0;let currencyEarned=0;let metricCapApplied=false;let globalCapApplied=false;details.forEach((d)=>{if(String(d&&d.day||"")!==today)return;count+=Number(d&&d.count||0);rawScore+=Number(d&&d.rawScore||0);beforeDaily+=Number(d&&(d.scoreBeforeDailyCap!=null?d.scoreBeforeDailyCap:d.rawScore)||0);counted+=Number(d&&(d.score!=null?d.score:d.countedScore)||0);currencyEarned+=Number(d&&(d.currencyEarned!=null?d.currencyEarned:d.currency)||0);metricCapApplied=!!(metricCapApplied||(d&&d.metricCapApplied));const factor=Number(d&&(d.dayFactor==null?1:d.dayFactor));if(Number.isFinite(factor)&&factor<0.999999)globalCapApplied=true;});const cap=Number.isFinite(dailyCap)&&dailyCap>0?dailyCap:null;const countedBeforeGlobal=cap?Math.min(cap,beforeDaily||rawScore):(beforeDaily||rawScore);if(!count&&!rawScore&&!beforeDaily&&!counted)return null;return{count,rawScore,countedBeforeGlobal,counted,currencyEarned,currency:currencyEarned,dailyCap:cap,metricCapApplied,globalCapApplied,reached:!!(cap&&(countedBeforeGlobal>=cap-0.05||beforeDaily>=cap-0.05)),};}
function renderXpSourceRows(score){const rules=score&&Array.isArray(score.rules)&&score.rules.length?score.rules:[];const currency=accountCurrencySummary(score||null);const totalDailyCap=score&&score.dailyCap!=null?Number(score.dailyCap):(rules[0]&&rules[0].globalDailyCap!=null?Number(rules[0].globalDailyCap):null);const boost=score&&score.activeCapBoost&&Number(score.activeCapBoost.multiplier||1)>1?score.activeCapBoost:null;const boostText=boost?` Cap boost active: daily XP caps are ×${escapeHtml(formatAccountXp(boost.multiplier || 2))} until 23:59:59 UTC.`:"";const resetNote=` ${escapeHtml(accountDayResetNote())}`;const capNote=Number.isFinite(totalDailyCap)?`<div class="mk-level-cap-note"><strong>Same actions, two rewards.</strong> XP has a level-based daily cap: Level 1 starts at 50 XP/day, and each level adds +5. Your current cap is ${escapeHtml(formatAccountXp(totalDailyCap))}/day; EORbits keep accumulating.${boostText}${resetNote}</div>`:"";if(rules.length){const rows=rules.map((rule)=>{const xp=Number(rule.xpPerCount||rule.weight||0);const oneTime=!!rule.oneTime;const dailyCap=rule.dailyCap==null?null:Number(rule.dailyCap);const capText=oneTime?"One-time XP":(Number.isFinite(dailyCap)?`XP cap ${formatAccountXp(dailyCap)}/day`:"No XP cap");const oneTimeStatus=oneTime?oneTimeStatusForMetric(score,rule):null;const todayCap=oneTime?null:todayCapStatusForMetric(score,rule);const todayCounted=todayCap?Math.max(0,Number(todayCap.counted||0)):0;const todayCoins=todayCap?Math.max(0,Number(todayCap.currencyEarned!=null?todayCap.currencyEarned:todayCap.currency||0)):0;const todayHasVisibleProgress=!!(todayCap&&(todayCounted>0.0001||todayCoins>0.0001||todayCap.globalCapApplied||todayCap.reached||todayCap.metricCapApplied));const capReason=todayCap&&todayCap.globalCapApplied?" · XP daily cap":(todayCap&&(todayCap.reached||todayCap.metricCapApplied)?" · source cap":"");const todayText=oneTime?(oneTimeStatus&&oneTimeStatus.earned?"Earned":"Not earned yet"):(todayHasVisibleProgress?`Today +${formatAccountXp(todayCounted)} XP · +${formatEorbits(todayCoins)} coins${capReason}`:"");const todayClass=oneTime?(oneTimeStatus&&oneTimeStatus.earned?"is-reached":"is-progress"):(todayCap&&(todayCap.reached||todayCap.globalCapApplied||todayCap.metricCapApplied)?"is-reached":"is-progress");const todayLabel=oneTime?(oneTimeStatus&&oneTimeStatus.earned?"✓ Earned":"Not earned yet"):todayText;const compactToday=todayLabel?todayLabel.replace(/\s+·\s*$/g,""):"";const todayLine=compactToday?`<small class="mk-level-today-pill ${todayClass}">${escapeHtml(compactToday)}</small>`:"";const cat=rule.category?`${rule.category} · `:"";const repeatPct=rule.repeatPercent==null?null:Number(rule.repeatPercent);const repeatHelp=Number.isFinite(repeatPct)&&repeatPct>0&&repeatPct<100?`Repeated on the same concept gives ${formatAccountXp(repeatPct)}% of the base XP and ${currency.name} for this action.`:"";const repeatHtml=repeatHelp?`<button type="button" class="mk-xp-repeat-percent" title="${escapeAttr(repeatHelp)}" data-help="${escapeAttr(repeatHelp)}">Repeat ${escapeHtml(formatAccountXp(repeatPct))}%</button>`:`<span class="mk-level-rule-repeat-placeholder">Repeat</span>`;const desc=shortXpRuleDescription(rule);const coinIcon=commentSvgIcon("eorbit",12);return`<div class="mk-level-table-row"><div class="mk-level-rule-main"><strong>${escapeHtml(rule.label || rule.metric || "Activity")}</strong><small>${escapeHtml(cat + desc)}</small></div><div class="mk-level-rule-meta"><div class="mk-level-rule-reward"><strong>+${escapeHtml(formatAccountXp(xp))} XP</strong><span class="mk-level-rule-coin">${coinIcon}+${escapeHtml(formatEorbits(xp))}</span></div><div class="mk-level-rule-limit"><span>${escapeHtml(capText)}</span>${repeatHtml}${todayLine}</div></div></div>`;}).join("");return capNote+rows;}
const rows=[["Visit and revise concepts",`Concept visits, saved pages, mastery changes and AI checks earn XP and ${currency.name}.`],["Use study tools",`Guided study, maps, searches, random revision and filters also earn both rewards.`],["Use community tools",`Comments, replies, reactions, mentions and reports are counted when linked to your account.`],["Spend later",`${currency.name} are synced with your account file and can later be spent in the store or gifted to study connections.`],];return rows.map(([label,detail])=>`<div class="mk-level-table-row"><div class="mk-level-rule-main"><strong>${escapeHtml(label)}</strong><small>${escapeHtml(detail)}</small></div><div class="mk-level-rule-meta"><div class="mk-level-rule-reward"><strong>XP</strong><span class="mk-level-rule-coin">${commentSvgIcon("eorbit", 12)}${escapeHtml(currency.name)}</span></div><div class="mk-level-rule-limit"><span>Synced with account</span></div></div></div>`).join("");}
function renderLevelRequirementRows(currentLevel,thresholds){const rows=normaliseThresholds(thresholds);const maxShown=Math.max(10,Math.min(rows.length,Number(currentLevel||1)+6));return rows.slice(0,maxShown).map((row,idx)=>{const total=Number(row.total||0);const delta=idx===0?0:(row.delta!=null?Number(row.delta):total-Number(rows[idx-1].total||0));const lvl=Number(row.level||idx+1);const current=lvl===currentLevel;const currentPill=current?`<span class="mk-level-current-pill">Current</span>`:"";return`<div class="mk-level-table-row${current ? " is-current" : ""}"><div class="mk-level-requirement-level"><strong>Level ${escapeHtml(lvl)}</strong>${currentPill}</div><div class="mk-level-table-num">${escapeHtml(formatAccountXp(total))} XP</div><div class="mk-level-requirement-delta">${idx === 0 ? "Start" : "+" + escapeHtml(formatAccountXp(delta)) + " XP"}</div></div>`;}).join("");}
function renderExactXpBreakdown(score){const rows=score&&Array.isArray(score.breakdown)?score.breakdown:[];function normaliseDailyRows(r){const metric=String(r&&r.metric||"");const byDay=new Map();const addDailyRow=(d)=>{const day=String(d&&d.day||"unknown day");if(!day)return;const prev=byDay.get(day)||{day,count:0,rawScore:0,score:0,currencyEarned:0};prev.count+=Number(d&&d.count||0);const raw=d&&d.rawScore!=null?d.rawScore:(d&&d.scoreBeforeDailyCap!=null?d.scoreBeforeDailyCap:d&&d.score);prev.rawScore+=Number(raw||0);prev.score+=Number(d&&d.score||0);prev.currencyEarned+=Number(d&&(d.currencyEarned!=null?d.currencyEarned:d.currency)||0);byDay.set(day,prev);};(Array.isArray(r&&r.dailyDetails)?r.dailyDetails:[]).forEach(addDailyRow);if(metric&&Array.isArray(score&&score.dailySummary)){score.dailySummary.forEach((dayRow)=>{const day=String(dayRow&&dayRow.day||"");if(!day||byDay.has(day))return;const metrics=dayRow&&dayRow.metrics&&typeof dayRow.metrics==="object"?dayRow.metrics:{};const currencyMetrics=dayRow&&dayRow.currencyMetrics&&typeof dayRow.currencyMetrics==="object"?dayRow.currencyMetrics:{};const counted=Number(metrics[metric]||0)||0;const coins=Number(currencyMetrics[metric]||0)||0;if(!counted&&!coins)return;addDailyRow({day,count:0,rawScore:counted,scoreBeforeDailyCap:counted,score:counted,currencyEarned:coins,currency:coins});});}
return Array.from(byDay.values()).map((d)=>({day:d.day,count:Math.round(Number(d.count||0)*10)/10,rawScore:Math.round(Number(d.rawScore||0)*10)/10,score:Math.round(Number(d.score||0)*10)/10,currencyEarned:Math.round(Number(d.currencyEarned||0)*10)/10,})).sort((a,b)=>String(b.day||"").localeCompare(String(a.day||"")));}
function renderDailyBreakdownPanel(r,finalScore){const dailyRows=normaliseDailyRows(r);if(!dailyRows.length){const msg=r&&r.legacyUncapped?`This is legacy XP without daily history. Counted total: ${formatAccountXp(finalScore)} XP.`:"No daily breakdown is available for this activity yet.";return`<div class="mk-level-break-detail-panel"><div class="mk-level-break-empty">${escapeHtml(msg)}</div></div>`;}
const head=`<div class="mk-level-break-day is-head"><span>Day</span><span>Actions</span><span>Raw XP</span><span>Counted XP</span><span>EORbits</span></div>`;const body=dailyRows.map((d)=>`<div class="mk-level-break-day"><span>${escapeHtml(d.day)}</span><span>${escapeHtml(formatAccountXp(d.count))}</span><span>${escapeHtml(formatAccountXp(d.rawScore))} XP</span><span>${escapeHtml(formatAccountXp(d.score))} XP</span><span>${escapeHtml(formatEorbits(d.currencyEarned))}</span></div>`).join("");return`<div class="mk-level-break-detail-panel"><div class="mk-level-break-days">${head}${body}</div></div>`;}
const cards=rows.map((r)=>{const finalScore=Number(r.score||0);const coins=Number(r.currencyEarned!=null?r.currencyEarned:r.currency||0);const label=r.label||r.metric||"Activity";const key=String(r.metric||label||"activity").replace(/[^a-z0-9_-]+/gi,"_").slice(0,80)||"activity";return`<div class="mk-level-break-card" data-break-key="${escapeAttr(key)}"><button type="button" class="mk-level-break-summary" aria-expanded="false"><span class="mk-level-break-main"><strong>${escapeHtml(label)}</strong></span><span class="mk-level-break-score"><b>${escapeHtml(formatAccountXp(finalScore))} XP</b><small>+${escapeHtml(formatEorbits(coins))} EORbits</small></span><span class="mk-level-break-toggle">Details</span></button><div class="mk-level-break-detail-wrap" hidden>${renderDailyBreakdownPanel(r, finalScore)}</div></div>`;}).join("");return cards?`<div class="mk-level-breakdown-grid">${cards}</div>`:`<div class="mk-local-activity-empty">No scored XP activity has been recorded on the server yet.</div>`;}
function levelFoldSection(titleText,innerHtml,countText){const count=countText==null||countText===""?"":`<span class="mk-local-fold-count">${escapeHtml(countText)}</span>`;return`<details class="mk-local-fold-section mk-level-fold-section"><summary class="mk-local-fold-summary"><span>${escapeHtml(titleText)}</span>${count}</summary><div class="mk-local-fold-body">${innerHtml}</div></details>`;}
function renderAccountLevelLoading(body){if(!body)return;body.innerHTML=`<div class="mk-level-loading-card"><strong>Loading XP and EORbits…</strong><span>Saved XP and EORbits stay visible from the local account file.</span></div>`;}
function renderTodayXpMeter(score,opts){if(!score||score.legacyUncapped)return"";const state=todayDailyXpState(score)||null;const cap=Math.max(0,Number((state&&state.cap)||score.dailyCap||0));if(!Number.isFinite(cap)||cap<=0)return"";const countedRaw=Math.max(0,Number(state&&state.counted||0));const counted=Math.min(cap,countedRaw);const pct=cap>0?Math.max(0,Math.min(100,(counted/cap)*100)):0;const remaining=Math.max(0,cap-counted);const full=remaining<=0.05||(state&&state.reached);const titleText=full?"Today’s XP cap reached":`${formatAccountXp(remaining)} XP still available today`;const label=opts&&opts.shortLabel?"Today":"Today";return`<span class="mk-level-daily-meter${full ? " is-full" : ""}" title="${escapeAttr(titleText)}" aria-label="Today’s counted XP: ${escapeAttr(formatAccountXp(counted))} out of ${escapeAttr(formatAccountXp(cap))}">
      <span class="mk-level-daily-meter-label">${escapeHtml(label)}</span>
      <span class="mk-level-daily-meter-track" role="meter" aria-valuemin="0" aria-valuemax="${escapeAttr(cap)}" aria-valuenow="${escapeAttr(Math.round(counted * 10) / 10)}"><span class="mk-level-daily-meter-fill" style="width:${escapeAttr(pct)}%"></span></span>
      <span class="mk-level-daily-meter-value">${escapeHtml(formatAccountXp(counted))}/${escapeHtml(formatAccountXp(cap))} XP</span>
    </span>`;}
function renderCurrentLevelProgressBlock(summary,score){const today=todayDailyXpState(score||null);const todayCounted=Math.max(0,Number(today&&today.counted||0));const todayCoins=todayCurrencyEarned(score||null);const currency=accountCurrencySummary(score||null);const span=Math.max(1,Number(summary.levelSpan||1));const into=Math.max(0,Number(summary.intoLevel||0));const todayInThisLevel=Math.max(0,Math.min(todayCounted,into));const previousInThisLevel=Math.max(0,into-todayInThisLevel);const previousPct=Math.max(0,Math.min(100,previousInThisLevel/span*100));const todayPct=Math.max(0,Math.min(100-previousPct,todayInThisLevel/span*100));const pctText=`${formatAccountXp(summary.progressPct)}%`;const progressText=`${formatAccountXp(into)} / ${formatAccountXp(span)} XP`;const todayLabel=todayInThisLevel>0?`${formatAccountXp(todayInThisLevel)} XP today`:"no XP today yet";return`<div class="mk-level-summary-block mk-level-current-block">
      <div class="mk-level-summary-head">
        <div>
          <div class="mk-level-kicker">Level progress</div>
          <div class="mk-level-current">Level ${escapeHtml(summary.level)}</div>
        </div>
        <div class="mk-level-total"><strong>${escapeHtml(progressText)}</strong><span>${escapeHtml(pctText)} complete</span></div>
      </div>
      <div class="mk-level-progress${previousPct <= 0.05 ? " is-no-before" : ""}${todayPct <= 0.05 ? " is-no-today" : ""}" aria-label="Level ${escapeAttr(summary.level)} progress">
        <span class="mk-level-progress-seg mk-level-progress-before" style="width:${escapeAttr(previousPct)}%"></span>
        <span class="mk-level-progress-seg mk-level-progress-today" style="left:${escapeAttr(previousPct)}%;width:${escapeAttr(todayPct)}%"></span>
      </div>
      <div class="mk-level-progress-info-row">
        <span>${escapeHtml(formatAccountXp(summary.totalScore))} XP total</span>
        <span class="mk-level-progress-legend"><span class="mk-level-legend-item"><i class="mk-level-legend-dot"></i>Before today</span><span class="mk-level-legend-item"><i class="mk-level-legend-dot is-today"></i>Today</span></span>
        <span>${escapeHtml(todayLabel)}</span>
      </div>
      <div class="mk-level-currency-mini"><strong>${escapeHtml(formatEorbits(currency.balance))}</strong> ${escapeHtml(currency.name)} available${todayCoins > 0 ? `·+${escapeHtml(formatEorbits(todayCoins))}today` : ""}</div>
    </div>`;}
function renderTodayXpBlock(score){const state=todayDailyXpState(score||null);const cap=Math.max(0,Number((state&&state.cap)||(score&&score.dailyCap)||0));const counted=Math.min(cap||0,Math.max(0,Number(state&&state.counted||0)));const coinsToday=todayCurrencyEarned(score||null);const currency=accountCurrencySummary(score||null);const remaining=Math.max(0,cap-counted);const note=cap>0?(remaining<=0.05?`XP cap reached. ${currency.name} still keep earning after the cap.`:`${formatAccountXp(remaining)} XP left before today’s XP cap`):`${currency.name} have no daily cap.`;return`<div class="mk-level-summary-block mk-level-daily-block">
      <div class="mk-level-summary-head">
        <div>
          <div class="mk-level-kicker">Today (UTC)</div>
          <div class="mk-level-daily-main">${renderTodayXpMeter(score, { shortLabel: true })}</div>
        </div>
      </div>
      <div class="mk-level-currency-today"><strong>+${escapeHtml(formatEorbits(coinsToday))}</strong> ${escapeHtml(currency.name)} today</div>
      <div class="mk-level-daily-note">${escapeHtml(note)}. ${escapeHtml(accountDayResetNote())}</div>
    </div>`;}
function renderLevelSyncBar(score,opts){const health=accountProgressSyncHealth();const message=health.error?"Not synced. New changes are saved on this device; retry in Account → Sync & learning data.":health.syncing?"Syncing account history…":health.pending?"New changes are waiting to sync.":"";return message?`<div class="mk-level-sync-status" role="status">${escapeHtml(message)}</div>`:"";}
function accountProgressSyncHealth(){try{return window.MkAccountData&&typeof window.MkAccountData.getSyncHealth==="function"?window.MkAccountData.getSyncHealth():{};}catch(_){return{};}}
function accountDayResetNote(){const now=new Date();const reset=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+1));return`Daily totals reset at 00:00 UTC (${reset.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })} in your timezone).`;}
function bindXpDiscountHelp(body){if(!body)return;const coarse=(()=>{try{return window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse)").matches;}catch(_){return false;}})();body.querySelectorAll(".mk-xp-repeat-percent").forEach((node)=>{if(node.__mkXpRepeatHelpBound)return;node.__mkXpRepeatHelpBound=true;node.addEventListener("click",(ev)=>{if(!coarse)return;ev.preventDefault();ev.stopPropagation();const msg=node.getAttribute("data-help")||node.getAttribute("title")||"Repeated actions on the same concept receive a smaller XP value.";window.alert(msg);});});}
function setLevelBreakCardOpen(card,open){try{if(!card||!card.classList||!card.classList.contains("mk-level-break-card"))return;const yes=!!open;card.classList.toggle("is-open",yes);const summary=card.querySelector(":scope > .mk-level-break-summary");const wrap=card.querySelector(":scope > .mk-level-break-detail-wrap");if(summary)summary.setAttribute("aria-expanded",yes?"true":"false");if(wrap)wrap.hidden=!yes;}catch(_){}}
function captureAccountLevelOpenState(body){const out=new Set();if(!body)return out;try{if(body.__mkLevelOpenState&&body.__mkLevelOpenState.forEach){body.__mkLevelOpenState.forEach((key)=>{if(key)out.add(key);});}
body.querySelectorAll("details.mk-level-fold-section, .mk-level-break-card").forEach((detail)=>{const key=accountLevelDetailKey(detail);if(!key)return;const isBreak=detail.classList&&detail.classList.contains("mk-level-break-card");const isOpen=isBreak?levelBreakCardIsOpen(detail):!!detail.open;if(isOpen)out.add(key);else if(body.__mkLevelOpenState&&body.__mkLevelOpenState.delete)body.__mkLevelOpenState.delete(key);});}catch(_){}
return out;}
function restoreAccountLevelOpenState(body,openState){if(!body)return;try{if(!body.__mkLevelOpenState)body.__mkLevelOpenState=new Set();if(openState&&openState.forEach)openState.forEach((key)=>{if(key)body.__mkLevelOpenState.add(key);});const remembered=body.__mkLevelOpenState;body.querySelectorAll("details.mk-level-fold-section, .mk-level-break-card").forEach((detail)=>{const key=accountLevelDetailKey(detail);if(!key||!remembered.has(key))return;if(detail.classList&&detail.classList.contains("mk-level-break-card"))setLevelBreakCardOpen(detail,true);else detail.open=true;});}catch(_){}}
function bindAccountLevelOpenState(body){try{if(!body)return;if(!body.__mkLevelOpenState)body.__mkLevelOpenState=new Set();if(body.__mkLevelOpenStateBound)return;body.__mkLevelOpenStateBound=true;const markBreakdownInteraction=(ev)=>{try{const target=ev&&ev.target;if(!target||!target.closest)return;const card=target.closest(".mk-level-break-card");if(!card||!body.contains(card))return;body.__mkLevelSuppressRerenderUntil=Date.now()+1600;}catch(_){}};body.addEventListener("pointerdown",markBreakdownInteraction,true);body.addEventListener("click",markBreakdownInteraction,true);body.addEventListener("click",(ev)=>{try{const btn=ev&&ev.target&&ev.target.closest?ev.target.closest(".mk-level-break-summary"):null;if(!btn||!body.contains(btn))return;const card=btn.closest(".mk-level-break-card");if(!card)return;ev.preventDefault();ev.stopPropagation();body.__mkLevelSuppressRerenderUntil=Date.now()+1600;const nextOpen=!levelBreakCardIsOpen(card);setLevelBreakCardOpen(card,nextOpen);const key=accountLevelDetailKey(card);if(key){if(nextOpen)body.__mkLevelOpenState.add(key);else body.__mkLevelOpenState.delete(key);}
if(!nextOpen&&typeof body.__mkLevelFlushDeferredRender==="function"){window.setTimeout(()=>{try{body.__mkLevelFlushDeferredRender();}catch(_){}},180);}}catch(_){}},true);body.addEventListener("toggle",(ev)=>{try{const detail=ev&&ev.target;if(!detail||!detail.matches||!detail.matches("details.mk-level-fold-section"))return;const key=accountLevelDetailKey(detail);if(!key)return;if(detail.open)body.__mkLevelOpenState.add(key);else body.__mkLevelOpenState.delete(key);}catch(_){}},true);}catch(_){}}
function syncLevelPanelAdaptiveHeight(body){try{const b=body||null;if(!b||!b.closest)return;const panel=b.closest(".mk-level-panel");if(!panel)return;const hasOpen=!!b.querySelector("details.mk-level-fold-section[open]");panel.classList.toggle("mk-level-has-open",hasOpen);b.classList.toggle("mk-level-has-open",hasOpen);}catch(_){}}
function bindLevelPanelAdaptiveHeight(body){try{if(!body||body.__mkLevelAdaptiveHeightBound){syncLevelPanelAdaptiveHeight(body);return;}
body.__mkLevelAdaptiveHeightBound=true;body.addEventListener("toggle",(ev)=>{try{const d=ev&&ev.target;if(!d||!d.matches||!d.matches("details.mk-level-fold-section"))return;requestAnimationFrame(()=>syncLevelPanelAdaptiveHeight(body));}catch(_){}},true);syncLevelPanelAdaptiveHeight(body);}catch(_){}}
function fillLevelLazySection(detail,score){try{if(!detail||detail.dataset.levelLazyDone==="1")return;const kind=String(detail.dataset.levelLazy||"");const box=detail.querySelector(".mk-local-fold-body");if(!box)return;const modalBody=(detail.closest&&detail.closest(".mk-level-modal-body"))||null;const openState=modalBody?captureAccountLevelOpenState(modalBody):null;if(kind==="rules"){let rulesScore=score;if(!rulesScore||rulesScore.lightCache||!(Array.isArray(rulesScore.breakdown)&&rulesScore.breakdown.length)){rulesScore=betterAccountXpScore(rulesScore,readCachedAccountXp({full:true}))||rulesScore;}
box.innerHTML=`<div class="mk-level-table mk-level-rules">${renderXpSourceRows(rulesScore)}</div>`;}else if(kind==="breakdown"){let detailScore=score;if(!detailScore||detailScore.lightCache||!(Array.isArray(detailScore.breakdown)&&detailScore.breakdown.length)){detailScore=betterAccountXpScore(detailScore,readCachedAccountXp({full:true}))||detailScore;}
const hasExactBreakdown=!!(detailScore&&Array.isArray(detailScore.breakdown)&&detailScore.breakdown.length);box.innerHTML=hasExactBreakdown?renderExactXpBreakdown(detailScore):`<div class="mk-local-activity-empty">Detailed XP breakdown is loading. If this device only has a light XP cache, it will be rebuilt in the background.</div>`;if(!hasExactBreakdown&&modalBody&&typeof modalBody.__mkLevelRequestFreshScore==="function"){try{modalBody.__mkLevelRequestFreshScore("breakdown-open");}catch(_){}}}else{return;}
detail.dataset.levelLazyDone="1";if(modalBody&&openState)restoreAccountLevelOpenState(modalBody,openState);refreshActivityLinkTitles(box);bindXpDiscountHelp(box);syncLevelPanelAdaptiveHeight(modalBody||box);}catch(_){}}
function bindLevelLazySections(body,score){try{if(!body)return;body.__mkLevelLazyScore=score||null;body.querySelectorAll("details.mk-level-fold-section[data-level-lazy]").forEach((detail)=>{if(detail.open)fillLevelLazySection(detail,body.__mkLevelLazyScore);});if(body.__mkLevelLazyBound)return;body.__mkLevelLazyBound=true;body.addEventListener("toggle",(ev)=>{try{const detail=ev&&ev.target;if(!detail||!detail.matches||!detail.matches("details.mk-level-fold-section[data-level-lazy]"))return;if(detail.open)fillLevelLazySection(detail,body.__mkLevelLazyScore||score);}catch(_){}},true);}catch(_){}}
function renderAccountLevelModalBody(body,score,loading,opts){if(!body)return;bindAccountLevelOpenState(body);const openState=captureAccountLevelOpenState(body);const health=accountProgressSyncHealth();if(health.initialPending){body.innerHTML=`<div class="mk-level-loading-card" role="status"><strong>${health.error ? "Account history has not synced." : "Loading your account history…"}</strong><span>Your level and XP will appear after this device downloads the account history. This device's partial total is hidden until sync completes. ${health.error ? "Retry in Account → Sync & learning data." : ""}</span></div>`;bindLevelPanelAdaptiveHeight(body);return;}
if(loading){renderAccountLevelLoading(body);bindLevelPanelAdaptiveHeight(body);return;}
if(!score){body.innerHTML=`<div class="mk-level-loading-card"><strong>No complete local XP snapshot yet.</strong><span>Use Account > Sync & learning data to load the full event-based XP calculation. If the server is temporarily unavailable, this panel will keep the previous complete snapshot once one exists.</span></div>`;bindXpDiscountHelp(body);bindLevelPanelAdaptiveHeight(body);return;}
const summary=accountScoreSummary(score||null);const hasExactBreakdown=!!(score&&Array.isArray(score.breakdown)&&score.breakdown.length);body.innerHTML=`
      ${renderLevelSyncBar(score, opts)}
      <div class="mk-level-summary-card">
        ${renderCurrentLevelProgressBlock(summary, score)}
        ${renderTodayXpBlock(score)}
      </div>
      ${levelFoldSection("Level requirements", `<div class="mk-level-table mk-level-requirements">${renderLevelRequirementRows(summary.level,summary.thresholds)}</div>`, "")}
      ${levelFoldSection("How XP and EORbits are earned", `<div class="mk-level-lazy-placeholder">Open this section to load the XP rules.</div>`, "").replace('class="mk-local-fold-section mk-level-fold-section"', 'class="mk-local-fold-section mk-level-fold-section" data-level-lazy="rules"')}
      ${levelFoldSection("XP & EORbits breakdown", `<div class="mk-level-lazy-placeholder">Open this section to load the detailed breakdown.</div>`, hasExactBreakdown ? (score.breakdown || []).length : "").replace('class="mk-local-fold-section mk-level-fold-section"', 'class="mk-local-fold-section mk-level-fold-section" data-level-lazy="breakdown"')}`;restoreAccountLevelOpenState(body,openState);bindLevelLazySections(body,score);refreshActivityLinkTitles(body);bindXpDiscountHelp(body);bindLevelPanelAdaptiveHeight(body);}
function openAccountLevelModal(){const mini=openLocalMiniModal("Level, XP & EORbits");mini.modal.classList.add("mk-level-modal");const panel=mini.modal.querySelector(".mk-local-mini-panel");if(panel)panel.classList.add("mk-level-panel");if(mini.body)mini.body.classList.add("mk-level-modal-body");const headSync=null;let currentScore=null;try{if(__accountXpCache&&accountXpCacheMatchesCurrentProfile(__accountXpCache))currentScore=__accountXpCache;}catch(_){currentScore=null;}
let modalClosed=false;let deferredLevelRender=null;let deferredLevelRenderTimer=0;let levelFreshRefreshStarted=false;let levelFreshRefreshTimer=0;const hasOpenBreakdownCard=()=>{try{return!!(mini.body&&mini.body.querySelector&&mini.body.querySelector(".mk-level-break-card.is-open"));}catch(_){return false;}};const requestFreshLevelSnapshot=(reason)=>{try{if(modalClosed||levelFreshRefreshStarted)return;levelFreshRefreshStarted=true;const run=()=>{levelFreshRefreshTimer=0;if(modalClosed)return;try{const warm=readWarmAccountXpSnapshot();const warmNext=betterAccountXpScore(currentScore,warm);if(warmNext&&(!currentScore||warmNext!==currentScore||accountXpScoresDiffer(currentScore,warmNext))){currentScore=warmNext;render("Updated snapshot",false);}}catch(_){}
if(modalClosed||!accountXpNeedsPanelRefresh(currentScore))return;const heavyRun=()=>{if(modalClosed||hasOpenBreakdownCard()){levelFreshRefreshStarted=false;requestFreshLevelSnapshot(reason||"deferred-open-card");return;}
try{const fresh=readLiveAccountEventXpScore({fresh:true});if(fresh&&isCompleteAccountXpScore(fresh)){const next=betterAccountXpScore(currentScore,fresh);currentScore=next||fresh;publishAccountXp(currentScore);render("Updated XP history",false);}}catch(_){}};try{if(typeof window.requestIdleCallback==="function")window.requestIdleCallback(heavyRun,{timeout:1800});else window.setTimeout(heavyRun,450);}catch(_){window.setTimeout(heavyRun,450);}};levelFreshRefreshTimer=window.setTimeout(run,/breakdown-open/i.test(String(reason||""))?120:700);}catch(_){}};const shouldDeferLevelRerender=()=>{try{if(!mini.body)return false;if(hasOpenBreakdownCard())return true;return Number(mini.body.__mkLevelSuppressRerenderUntil||0)>Date.now();}catch(_){return false;}};const flushDeferredLevelRender=()=>{if(modalClosed||!deferredLevelRender)return;if(shouldDeferLevelRerender()){if(!deferredLevelRenderTimer){deferredLevelRenderTimer=window.setTimeout(()=>{deferredLevelRenderTimer=0;flushDeferredLevelRender();},450);}
return;}
const next=deferredLevelRender;deferredLevelRender=null;if(deferredLevelRenderTimer){window.clearTimeout(deferredLevelRenderTimer);deferredLevelRenderTimer=0;}
render(next.status||"Updated snapshot",!!next.syncLoading,{force:true});};const requestDeferredLevelRender=(status,syncLoading)=>{deferredLevelRender={status:status||"Updated snapshot",syncLoading:!!syncLoading};if(mini.body)mini.body.__mkLevelFlushDeferredRender=flushDeferredLevelRender;if(!deferredLevelRenderTimer){deferredLevelRenderTimer=window.setTimeout(()=>{deferredLevelRenderTimer=0;flushDeferredLevelRender();},1700);}};const render=(status,syncLoading,renderOpts)=>{if(modalClosed)return;if(!(renderOpts&&renderOpts.force)&&shouldDeferLevelRerender()){requestDeferredLevelRender(status,syncLoading);return;}
if(headSync)headSync.innerHTML=renderLevelSyncBar(currentScore,{syncStatus:status||"",syncLoading:!!syncLoading});renderAccountLevelModalBody(mini.body,currentScore,!currentScore&&!!syncLoading,{syncStatus:status||"",syncLoading:!!syncLoading});if(mini.body){mini.body.__mkLevelFlushDeferredRender=flushDeferredLevelRender;mini.body.__mkLevelRequestFreshScore=requestFreshLevelSnapshot;}};render(currentScore?"":"Loading saved XP…",!currentScore);if(currentScore&&accountXpNeedsPanelRefresh(currentScore))requestFreshLevelSnapshot("initial-light-or-stale-score");const loadSavedSnapshot=()=>{if(modalClosed)return;try{const snap=readWarmAccountXpSnapshot()||readLiveAccountEventXpScore({fresh:false})||readCachedAccountXp({full:true});if(snap){const next=betterAccountXpScore(currentScore,snap);if(next&&(!currentScore||next!==currentScore||accountXpScoresDiffer(currentScore,next))){currentScore=next;render("Saved snapshot",false);if(accountXpNeedsPanelRefresh(currentScore))requestFreshLevelSnapshot("saved-snapshot-light-or-stale");}else if(!currentScore){render("",false);}}else if(!currentScore){render("",false);requestFreshLevelSnapshot("no-saved-snapshot");}else if(accountXpNeedsPanelRefresh(currentScore)){requestFreshLevelSnapshot("saved-snapshot-needs-history");}}catch(_){if(!currentScore)render("",false);}};try{if(typeof window.requestAnimationFrame==="function")window.requestAnimationFrame(()=>window.setTimeout(loadSavedSnapshot,0));else window.setTimeout(loadSavedSnapshot,0);}catch(_){window.setTimeout(loadSavedSnapshot,0);}
try{const onXp=(ev)=>{if(modalClosed)return;const fresh=ev&&ev.detail&&ev.detail.score;if(fresh&&isCompleteAccountXpScore(fresh)){const next=betterAccountXpScore(currentScore,fresh);if(next!==currentScore||accountXpScoresDiffer(currentScore,next)){currentScore=next;if(shouldDeferLevelRerender())requestDeferredLevelRender("Updated snapshot",false);else render("Updated snapshot",false);if(accountXpNeedsPanelRefresh(currentScore))requestFreshLevelSnapshot("xp-change-light-or-stale");}}};window.addEventListener("mk-account-xp-change",onXp);const onSyncHealth=()=>{if(!modalClosed)render("",false);};window.addEventListener("mk-account-sync-health",onSyncHealth);if(mini&&typeof mini.onClose==="function")mini.onClose(()=>{modalClosed=true;if(deferredLevelRenderTimer){window.clearTimeout(deferredLevelRenderTimer);deferredLevelRenderTimer=0;}
if(levelFreshRefreshTimer){window.clearTimeout(levelFreshRefreshTimer);levelFreshRefreshTimer=0;}
try{if(mini.body)mini.body.__mkLevelRequestFreshScore=null;}catch(_){}
window.removeEventListener("mk-account-xp-change",onXp);window.removeEventListener("mk-account-sync-health",onSyncHealth);});}catch(_){}}
async function openAvatarFramePicker(scoreHint,onSaved){let curr=readLocalProfile();if(!curr.name){window.alert("Please choose a username before changing the avatar frame.");return;}
const mini=openLocalMiniModal("Choose avatar frame");if(mini.modal)mini.modal.classList.add("mk-avatar-frame-modal");const framePanel=mini.modal&&mini.modal.querySelector(".mk-local-mini-panel");if(framePanel)framePanel.classList.add("mk-avatar-frame-panel");if(mini.body)mini.body.classList.add("mk-avatar-frame-body");if(mini.body)mini.body.innerHTML=`<div class="mk-local-avatar-note">Checking your current level and unlocked frames…</div>`;let score=null;try{if(scoreHint&&accountXpCacheMatchesCurrentProfile(scoreHint))score=scoreHint;}catch(_){score=scoreHint||null;}
try{score=betterAccountXpScore(score,readWarmAccountXpSnapshot());}catch(_){}
try{const live=readLiveAccountEventXpScore({fresh:false});if(live&&isCompleteAccountXpScore(live)&&accountXpCacheMatchesCurrentProfile(live))score=betterAccountXpScore(score,live);}catch(_){}
let summary=accountScoreSummary(score||{totalScore:0});let level=Math.max(1,Math.min(10,Math.floor(Number(summary.level||curr.level||1)||1)));let acquiredLevel=Math.max(level,Number(score&&score.highestLevelSeen||0),Number(curr.highestLevelSeen||0),Number(curr.level||0),avatarFrameLevelLocal(curr.avatarFrame||"level-1"));if(acquiredLevel>Math.max(Number(curr.highestLevelSeen||0),Number(curr.level||0))){curr=writeLocalProfile(Object.assign({},curr,{level:Math.max(Number(curr.level||1),level),highestLevelSeen:acquiredLevel,unlockedAvatarFrames:avatarFramesForLevelLocal(acquiredLevel)}));acquiredLevel=Math.max(acquiredLevel,Number(curr.highestLevelSeen||0),Number(curr.level||0));}
const scoreFrames=normaliseUnlockedAvatarFramesLocal(score&&(score.unlockedAvatarFrames||score.unlockedFrames),Math.max(acquiredLevel,Number(score&&score.highestLevelSeen||0),level));const profileFrames=normaliseUnlockedAvatarFramesLocal(curr.unlockedAvatarFrames||curr.unlockedFrames,Math.max(acquiredLevel,Number(curr.highestLevelSeen||0),Number(curr.level||0)));const byId=new Map();scoreFrames.concat(profileFrames).forEach((f)=>{if(f&&f.id)byId.set(cleanAvatarFrameLocal(f.id),f);});const unlockedFromServer=AVATAR_FRAME_DEFS_LOCAL.map((def)=>{const row=byId.get(def.id)||{};return Object.assign({},def,row,{unlocked:row.unlocked===true||Number(def.level||1)<=acquiredLevel});});let selected=cleanAvatarFrameLocal(curr.avatarFrame||(score&&score.avatarFrame)||avatarFrameForLevelLocal(level));const render=()=>{const cards=unlockedFromServer.map((f)=>{const id=cleanAvatarFrameLocal(f.id);const unlocked=!!f.unlocked||Number(f.level||avatarFrameLevelLocal(id))<=acquiredLevel;const active=id===selected;const avatar=avatarHtml(curr.name||"You",curr.avatar||"",id);const label=f.label||avatarFrameLabelLocal(id);const lock=unlocked?"":` · Lv ${escapeHtml(f.level || avatarFrameLevelLocal(id))}`;return`<button type="button" class="mk-avatar-frame-choice${active ? " is-active" : ""}${unlocked ? "" : " is-locked"}" data-frame="${escapeAttr(id)}" ${unlocked ? "" : "disabled"}>${avatar}<small>${escapeHtml(label)}${lock}</small></button>`;}).join("");mini.body.innerHTML=`<div class="mk-local-avatar-note">Unlocked frames stay available permanently. Higher-level accounts can use any frame they have already unlocked.</div><div class="mk-avatar-frame-grid">${cards}</div><div class="mk-local-mini-actions"><button type="button" class="mk-comment-small-btn mk-frame-cancel">Cancel</button><button type="button" class="mk-comment-primary-btn mk-frame-save">Save frame</button></div>`;mini.body.querySelectorAll(".mk-avatar-frame-choice:not(.is-locked)").forEach((btn)=>{btn.addEventListener("click",()=>{selected=cleanAvatarFrameLocal(btn.dataset.frame||selected);render();});});const cancel=mini.body.querySelector(".mk-frame-cancel");const save=mini.body.querySelector(".mk-frame-save");if(cancel)cancel.addEventListener("click",mini.close);if(save)save.addEventListener("click",async()=>{save.disabled=true;const res=await saveAvatarFrameOnline(selected);save.disabled=false;if(!res||!res.ok){window.alert((res&&res.error)||"Could not save this avatar frame.");return;}
const savedProfile=writeLocalProfile(res.profile||Object.assign({},curr,{avatarFrame:selected,highestLevelSeen:acquiredLevel,unlockedAvatarFrames:unlockedFromServer}));try{if(__accountXpCache)__accountXpCache=Object.assign({},__accountXpCache,{avatarFrame:selected,selectedAvatarFrame:selected,highestLevelSeen:Math.max(Number(__accountXpCache.highestLevelSeen||0),Number(savedProfile.highestLevelSeen||0),acquiredLevel),unlockedAvatarFrames:unlockedFromServer});}catch(_){}
mini.close();if(typeof onSaved==="function"){try{onSaved(savedProfile||res.profile||null);}catch(_){}}
try{window.dispatchEvent(new CustomEvent("mk-account-xp-change",{detail:{score:__accountXpCache}}));}catch(_){}});};render();}
function ensureGuestAccountOnboardingStyles(){if(document.getElementById("mk-guest-account-onboarding-style"))return;const st=document.createElement("style");st.id="mk-guest-account-onboarding-style";st.textContent=`
      .mk-guest-account-card{border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent);border-radius:22px;padding:18px;background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(14,165,233,.07));display:grid;gap:15px;}
      .mk-guest-account-hero{display:grid;gap:6px;}
      .mk-guest-account-kicker{font-size:.68rem;font-weight:860;letter-spacing:.08em;text-transform:uppercase;color:var(--md-accent-fg-color);}
      .mk-guest-account-title{font-size:1.12rem;font-weight:880;line-height:1.18;}
      .mk-guest-account-copy{font-size:.82rem;line-height:1.55;opacity:.78;max-width:62ch;}
      .mk-guest-account-form{display:grid;gap:12px;border-radius:18px;border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent);background:color-mix(in srgb,var(--md-default-bg-color) 82%,transparent);padding:14px;}
      .mk-guest-account-label{font-size:.72rem;font-weight:820;opacity:.78;}
      .mk-guest-account-input{width:100%;box-sizing:border-box;border-radius:14px;border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent);background:var(--md-default-bg-color);color:inherit;padding:10px 12px;font:inherit;font-size:.86rem;outline:none;}
      .mk-guest-account-input:focus{border-color:var(--md-accent-fg-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-accent-fg-color) 16%,transparent);}
      .mk-guest-account-avatar-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
      .mk-guest-account-avatar-preview{width:54px;height:54px;display:flex;align-items:center;justify-content:center;}
      .mk-guest-account-emoji-grid{display:flex;gap:7px;flex-wrap:wrap;}
      .mk-guest-account-emoji{appearance:none;border:1px solid color-mix(in srgb,var(--md-default-fg-color) 15%,transparent);background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent);border-radius:999px;width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.05rem;}
      .mk-guest-account-emoji.is-active{border-color:var(--md-accent-fg-color);background:color-mix(in srgb,var(--md-accent-fg-color) 14%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-accent-fg-color) 10%,transparent);}
      .mk-guest-account-benefits{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0;padding:0;list-style:none;}
      .mk-guest-account-benefits li{position:relative;border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent);border-radius:14px;background:color-mix(in srgb,var(--md-default-bg-color) 78%,transparent);padding:9px 10px 9px 28px;font-size:.76rem;line-height:1.38;}
      .mk-guest-account-benefits li::before{content:"✓";position:absolute;left:10px;top:9px;color:var(--md-accent-fg-color);font-weight:900;}
      .mk-guest-account-actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end;align-items:center;}
      .mk-guest-account-actions .mk-comment-icon-btn{width:auto!important;min-width:0!important;height:auto!important;min-height:2.25rem!important;padding:.45rem .72rem!important;gap:.38rem!important;line-height:1.15!important;}
      .mk-guest-account-actions .mk-comment-icon-btn svg{flex:0 0 auto;}
      .mk-guest-account-actions .mk-comment-icon-btn .mk-comment-sr{position:static!important;width:auto!important;height:auto!important;padding:0!important;margin:0!important;overflow:visible!important;clip:auto!important;white-space:nowrap!important;border:0!important;}
      .mk-guest-account-note{font-size:.70rem;opacity:.62;line-height:1.4;margin-right:auto;}
      .mk-guest-account-status{font-size:.75rem;line-height:1.4;min-height:1.1em;}
      .mk-guest-account-status.is-error{color:#dc2626;font-weight:760;}
      @media(max-width:720px){.mk-guest-account-benefits{grid-template-columns:1fr}.mk-guest-account-card{padding:15px}.mk-guest-account-actions{justify-content:stretch}.mk-guest-account-actions button{flex:1 1 auto}.mk-guest-account-note{flex-basis:100%;}}
    `.trim();document.head.appendChild(st);}
function renderGuestAccountOnboarding(host,profile,refreshInfo){if(!host)return;ensureGuestAccountOnboardingStyles();const curr=profile&&typeof profile==="object"?profile:readLocalProfile();let selectedAvatar="";const card=el("div","mk-guest-account-card");const hero=el("div","mk-guest-account-hero");hero.appendChild(el("div","mk-guest-account-kicker","Account reminder"));hero.appendChild(el("div","mk-guest-account-title","What should we call you?"));hero.appendChild(el("div","mk-guest-account-copy","Guest mode is for a quick look. Create an account to keep progress, saved pages, maps, quizzes, and sync across devices."));card.appendChild(hero);const form=el("div","mk-guest-account-form");const nameLabel=el("label","mk-guest-account-label","Your display name");form.appendChild(nameLabel);const input=document.createElement("input");input.type="text";input.maxLength=40;input.autocomplete="nickname";input.placeholder="For example: Alex";input.value=curr.name||"";input.className="mk-guest-account-input";input.id=`mk-guest-display-name-${++accountDialogSequence}`;nameLabel.htmlFor=input.id;form.appendChild(input);form.appendChild(el("div","mk-guest-account-label","Default avatar"));const avatarRow=el("div","mk-guest-account-avatar-row");const preview=el("div","mk-guest-account-avatar-preview");const paintPreview=()=>{preview.innerHTML=avatarHtml(input.value||"You","",curr.avatarFrame||"level-1");};input.addEventListener("input",paintPreview);avatarRow.appendChild(preview);avatarRow.appendChild(el("div","mk-local-avatar-note","New accounts start with initials. Emoji avatars can be unlocked later with EORbits."));form.appendChild(avatarRow);paintPreview();const status=el("div","mk-guest-account-status","");form.appendChild(status);card.appendChild(form);const benefits=document.createElement("ul");benefits.className="mk-guest-account-benefits";["No email or password is needed.","Sync mastery, saved pages, visits, and AI quiz history.","Use study tools without guest caps.","Add another device with a short code."].forEach((txt)=>benefits.appendChild(el("li","",txt)));card.appendChild(benefits);const actions=el("div","mk-guest-account-actions");actions.appendChild(el("div","mk-guest-account-note","Local progress is imported after creation."));const connect=iconButton("mk-comment-small-btn","key","Connect account");connect.type="button";const scanConnect=iconButton("mk-comment-small-btn","scan","Scan QR");scanConnect.type="button";const save=iconButton("mk-comment-primary-btn","check","Create account");save.type="button";actions.appendChild(connect);actions.appendChild(save);card.appendChild(actions);connect.addEventListener("click",async()=>{const nm=window.prompt("Username on the existing account:",curr.name||input.value||"");if(!nm)return;const code=window.prompt("Access code:","");if(!code)return;connect.disabled=true;scanConnect.disabled=true;status.textContent="Connecting…";status.classList.remove("is-error");const res=await claimAccountAccessCode(nm,code,"guest-onboarding-access-code");connect.disabled=false;scanConnect.disabled=false;if(!res||!res.ok){status.textContent=(res&&res.error)||"Could not connect to this account.";status.classList.add("is-error");return;}
try{window.MkGuestAccess&&window.MkGuestAccess.refreshBadges&&window.MkGuestAccess.refreshBadges();}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-guest-account-change",{detail:{hasAccount:true}}));}catch(_){}
if(typeof refreshInfo==="function")refreshInfo();});save.addEventListener("click",async()=>{const nm=cleanProfileNameLocal(input.value||"");if(!nm){status.textContent="Please choose a display name first.";status.classList.add("is-error");try{input.focus();}catch(_){}
return;}
save.disabled=true;connect.disabled=true;scanConnect.disabled=true;status.textContent="Creating account and importing progress...";status.classList.remove("is-error");const privacy=defaultNewAccountPrivacy();const res=await saveOnlineProfile(nm,"",{askPrivacy:false,privacy,isPublic:false,bio:curr.bio||""});if(!res||!res.ok){save.disabled=false;connect.disabled=false;scanConnect.disabled=false;status.textContent=(res&&res.error)||"Could not create the account.";status.classList.add("is-error");return;}
try{writeLocalProfile(res.profile||{});}catch(_){}
try{await syncAllAccountDataNow({force:true,reason:"guest-onboarding-create",timeoutMs:ACCOUNT_SYNC_MANUAL_TIMEOUT_MS});}catch(_){}
try{window.MkGuestAccess&&window.MkGuestAccess.refreshBadges&&window.MkGuestAccess.refreshBadges();}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-guest-account-change",{detail:{hasAccount:true}}));}catch(_){}
save.disabled=false;connect.disabled=false;scanConnect.disabled=false;if(typeof refreshInfo==="function")refreshInfo();});host.appendChild(card);setTimeout(()=>{try{input.focus();if(!input.value)input.select();}catch(_){}},80);}
function ensureAccountShopStylesOnce(){const id="mk-account-shop-style-v1";if(document.getElementById(id))return;const st=document.createElement("style");st.id=id;st.textContent=`
      :root{ --mk-eorbit-color:#b67800; --mk-eorbit-color-soft:rgba(182,120,0,.15); }
      [data-md-color-scheme="slate"]{ --mk-eorbit-color:#f5c84b; --mk-eorbit-color-soft:rgba(245,200,75,.16); }
      .mk-local-activity-tabs .mk-account-qr-tab{ margin-left:auto !important; }
      .mk-local-activity-tabs .mk-account-shop-tab.is-active{ color:var(--mk-eorbit-color); border-color:color-mix(in srgb,var(--mk-eorbit-color) 70%,transparent); }
      .mk-account-profile-card .mk-local-level-badge,
      .mk-account-profile-card .mk-account-currency-btn{
        display:inline-flex !important;
        align-items:center !important;
        justify-content:center !important;
        gap:4px !important;
        height:1.42rem !important;
        min-height:1.42rem !important;
        max-height:1.42rem !important;
        width:5.95rem !important;
        min-width:5.95rem !important;
        max-width:5.95rem !important;
        padding:0 .34rem !important;
        line-height:1 !important;
        border-radius:999px !important;
        box-sizing:border-box !important;
        white-space:nowrap !important;
      }
      .mk-account-currency-btn{ display:inline-flex; align-items:center; justify-content:center; gap:5px; border-color:color-mix(in srgb,var(--mk-eorbit-color) 62%,transparent) !important; background:color-mix(in srgb,var(--mk-eorbit-color) 16%,var(--md-default-bg-color)) !important; color:var(--md-default-fg-color) !important; font-weight:850; }
      .mk-account-currency-btn svg{ display:block !important; width:.68rem; height:.68rem; color:var(--mk-eorbit-color) !important; }
      .mk-account-currency-btn .mk-account-currency-amount{ font-size:.54rem; font-weight:850; letter-spacing:.01em; line-height:1; }
      .mk-account-profile-card .mk-local-level-badge strong{ font-size:.54rem !important; }
      .mk-account-profile-card .mk-local-level-badge .mk-local-level-badge-xp{ display:inline !important; font-size:.44rem !important; opacity:.72 !important; }
      @media(max-width:520px){ .mk-account-profile-card .mk-local-level-badge, .mk-account-profile-card .mk-account-currency-btn{ width:5.75rem !important; min-width:5.75rem !important; max-width:5.75rem !important; padding:0 .3rem !important; } }
      .mk-account-currency-btn .mk-account-currency-name{ display:none !important; }
      .mk-account-currency-btn .mk-account-currency-icon{ display:inline-flex; color:var(--mk-eorbit-color); }
      @media(max-width:720px){
        .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-tabs{
          display:grid !important;
          grid-template-columns:repeat(4,minmax(0,1fr)) !important;
          grid-auto-rows:44px !important;
          justify-items:center !important;
          align-items:center !important;
          gap:10px 12px !important;
          padding:12px max(18px, env(safe-area-inset-left,0px) + 18px) 12px max(18px, env(safe-area-inset-right,0px) + 18px) !important;
          min-height:122px !important;
          max-height:122px !important;
          overflow:visible !important;
        }
        .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-tab.mk-comment-icon-btn{
          width:44px !important; min-width:44px !important; max-width:44px !important;
          height:44px !important; min-height:44px !important; max-height:44px !important;
          flex:0 0 44px !important; justify-self:center !important; margin:0 !important; padding:0 !important;
        }
        .mk-local-activity-modal.mk-local-activity-modal--account .mk-local-activity-tab.mk-comment-icon-btn svg{ width:19px !important; height:19px !important; }
        .mk-local-activity-modal.mk-local-activity-modal--account .mk-account-qr-tab{ margin-left:0 !important; }
      }
      .mk-account-currency-btn .mk-account-currency-icon svg{ display:block !important; width:.64rem; height:.64rem; }
      .mk-account-shop-card{ display:grid; gap:14px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); border-radius:22px; padding:18px; background:linear-gradient(135deg,color-mix(in srgb,var(--mk-eorbit-color) 9%,transparent),color-mix(in srgb,var(--md-default-bg-color) 86%,transparent)); }
      .mk-account-shop-hero{ display:grid; grid-template-columns:minmax(0,1fr) auto; gap:14px; align-items:center; }
      .mk-account-shop-heading{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
      .mk-account-shop-kicker{ font-size:1.18rem; font-weight:900; letter-spacing:.01em; text-transform:none; color:var(--md-default-fg-color); opacity:1; line-height:1.15; }
      .mk-account-shop-title-row{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:3px; }
      .mk-account-shop-title{ font-size:.82rem; font-weight:600; line-height:1.3; opacity:.72; }
      .mk-account-shop-info{ position:relative; display:inline-flex; align-items:center; flex:0 0 auto; outline:none !important; }
      .mk-account-shop-info > summary{ list-style:none; display:inline-flex; align-items:center; justify-content:center; width:1.05rem; height:1.05rem; border-radius:999px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 26%,transparent); color:var(--md-default-fg-color); background:color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); font-size:.66rem; font-weight:900; line-height:1; cursor:pointer; user-select:none; outline:none !important; box-shadow:none !important; }
      .mk-account-shop-info > summary::-webkit-details-marker{ display:none; }
      .mk-account-shop-info > summary:hover{ background:color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); }
      .mk-account-shop-info-panel{ position:absolute; left:0; top:calc(100% + 8px); z-index:20; width:min(520px, calc(100vw - 64px)); border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); border-radius:14px; padding:10px 12px; background:color-mix(in srgb,var(--md-default-bg-color) 96%,transparent); box-shadow:0 16px 42px rgba(0,0,0,.18); color:var(--md-default-fg-color); font-size:.70rem; line-height:1.38; opacity:.96; }
      .mk-account-shop-info:not([open]) .mk-account-shop-info-panel{ display:none; }
      .mk-account-shop-copy{ display:none; }
      .mk-account-shop-balance{ min-width:128px; justify-self:end; text-align:right; border:1px solid color-mix(in srgb,var(--mk-eorbit-color) 45%,transparent); border-radius:18px; padding:10px 12px; background:color-mix(in srgb,var(--mk-eorbit-color) 8%,color-mix(in srgb,var(--md-default-bg-color) 82%,transparent)); }
      .mk-account-shop-balance strong{ display:flex; justify-content:flex-end; align-items:center; gap:6px; font-size:1.18rem; line-height:1.05; color:var(--mk-eorbit-color); }
      .mk-account-shop-balance svg{ width:1.05rem; height:1.05rem; }
      .mk-account-shop-balance span{ display:block; margin-top:3px; font-size:.64rem; opacity:.72; }
      .mk-account-shop-section{ display:grid; gap:8px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 14%,transparent); border-radius:16px; background:color-mix(in srgb,var(--md-default-bg-color) 72%,transparent); overflow:hidden; }
      .mk-account-shop-section > summary{ list-style:none; display:flex; align-items:center; gap:8px; cursor:pointer; padding:10px 12px; user-select:none; }
      .mk-account-shop-section > summary::-webkit-details-marker{ display:none; }
      .mk-account-shop-section-title{ display:flex; align-items:center; gap:8px; font-size:.72rem; font-weight:900; letter-spacing:.06em; text-transform:uppercase; color:var(--md-default-fg-color); flex:1; min-width:0; }
      .mk-account-shop-section-title::after{ content:""; height:1px; flex:1; background:color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); }
      .mk-account-shop-section-chevron{ opacity:.58; font-weight:900; transition:transform .16s ease; }
      .mk-account-shop-section[open] .mk-account-shop-section-chevron{ transform:rotate(180deg); }
      .mk-account-shop-grid{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; padding:0 12px 12px; }
      .mk-account-shop-section:not([open]) .mk-account-shop-grid{ display:none; }
      .mk-account-shop-tile{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); border-radius:16px; padding:11px; background:color-mix(in srgb,var(--md-default-bg-color) 82%,transparent); display:grid; gap:4px; min-width:0; }
      .mk-account-shop-tile strong{ font-size:.76rem; line-height:1.16; }
      .mk-account-shop-tile small{ font-size:.62rem; line-height:1.30; opacity:.72; }
      .mk-account-shop-item{ border-color:color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); background:color-mix(in srgb,var(--md-default-bg-color) 88%,transparent); }
      .mk-account-shop-item.is-owned{ border-color:color-mix(in srgb,var(--md-accent-fg-color) 35%,transparent); }
      .mk-account-shop-item.is-active-boost{ border-color:color-mix(in srgb,var(--mk-eorbit-color) 62%,transparent); box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mk-eorbit-color) 18%,transparent); }
      .mk-account-shop-active-note{ display:inline-flex; align-items:center; align-self:start; width:max-content; max-width:100%; margin-top:3px; border-radius:999px; padding:.12rem .36rem; border:1px solid color-mix(in srgb,#2dd4bf 42%,transparent); background:color-mix(in srgb,#2dd4bf 12%,transparent); color:color-mix(in srgb,#2dd4bf 84%,var(--md-default-fg-color)); font-size:.50rem !important; line-height:1.12; font-weight:900; opacity:1 !important; white-space:nowrap; }
      .mk-account-shop-item-head{ display:flex; justify-content:space-between; gap:8px; align-items:start; }
      .mk-account-shop-price{ display:inline-flex; align-items:center; gap:4px; font-weight:900; color:var(--mk-eorbit-color); white-space:nowrap; }
      .mk-account-shop-price svg{ width:.82rem; height:.82rem; }
      .mk-account-shop-item-actions{ display:flex; justify-content:flex-end; gap:6px; margin-top:auto; padding-top:7px; flex-wrap:wrap; align-items:center; }
      .mk-account-shop-item-actions--discounted{ justify-content:space-between; flex-wrap:nowrap; width:100%; }
      .mk-account-shop-item-actions--discounted .mk-account-shop-try-btn{ margin-right:auto; }
      .mk-account-shop-item-actions--discounted .mk-account-shop-discount-buy{ margin-left:auto; }
      .mk-account-shop-item-actions .mk-comment-primary-btn,.mk-account-shop-item-actions .mk-comment-small-btn{ min-height:1.12rem !important; height:1.16rem !important; padding:.08rem .36rem !important; font-size:.50rem !important; line-height:1 !important; border-radius:999px !important; display:inline-flex; align-items:center; justify-content:center; gap:4px; }
      .mk-account-shop-item-actions .mk-account-shop-discount-buy{ min-height:1.18rem !important; height:1.18rem !important; padding:0 !important; border-radius:999px !important; overflow:hidden; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent) !important; box-shadow:none !important; background:color-mix(in srgb,var(--md-default-fg-color) 6%,var(--md-default-bg-color)) !important; color:var(--md-default-fg-color) !important; }
      .mk-account-shop-item-actions .mk-account-shop-discount-buy:hover:not(:disabled){ background:color-mix(in srgb,var(--md-default-fg-color) 9%,var(--md-default-bg-color)) !important; }
      .mk-account-shop-item-actions .mk-account-shop-discount-buy:disabled{ opacity:.58; }
      .mk-account-shop-btn-price{ display:inline-flex; align-items:center; gap:3px; color:var(--mk-eorbit-color); font-weight:900; }
      .mk-account-shop-btn-price svg{ width:.66rem; height:.66rem; }
      .mk-account-shop-actions{ display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
      .mk-account-shop-trial-note{ font-size:.60rem; opacity:.66; margin-top:2px; }
      .mk-account-shop-trial-remaining{ display:inline-flex !important; align-items:center; font-weight:900; color:color-mix(in srgb,var(--mk-eorbit-color) 92%,var(--md-default-fg-color)); white-space:nowrap; }
      .mk-account-shop-inline-remaining{ display:inline !important; font-weight:900; color:color-mix(in srgb,var(--mk-eorbit-color) 92%,var(--md-default-fg-color)); white-space:nowrap; }
      .mk-account-shop-try-btn{ opacity:.88; }
      .mk-account-shop-unlocked-note{ display:inline-flex; align-items:center; border-radius:999px; padding:.08rem .34rem; min-height:1.12rem; font-size:.49rem; font-weight:850; color:var(--md-default-fg-color); background:color-mix(in srgb,var(--md-default-fg-color) 8%,transparent); border:1px solid color-mix(in srgb,var(--md-default-fg-color) 16%,transparent); }
      .mk-account-shop-toggle{ display:inline-flex; align-items:center; gap:5px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); border-radius:999px; background:color-mix(in srgb,var(--md-default-bg-color) 86%,transparent); padding:.08rem .32rem .08rem .36rem; font-size:.50rem; font-weight:850; cursor:pointer; min-height:1.16rem; height:1.16rem; line-height:1; color:var(--md-default-fg-color); }
      .mk-account-shop-toggle.is-on{ border-color:color-mix(in srgb,var(--md-default-fg-color) 24%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 10%,var(--md-default-bg-color)); color:var(--md-default-fg-color); }
      .mk-account-shop-toggle.is-disabled{ opacity:.55; cursor:not-allowed; }
      .mk-account-shop-toggle-knob{ display:inline-block !important; width:.86rem; height:.46rem; border-radius:999px; background:color-mix(in srgb,var(--md-default-fg-color) 20%,transparent); position:relative; flex:0 0 auto; transition:background .16s ease; }
      .mk-account-shop-toggle-knob::after{ content:""; position:absolute; width:.34rem; height:.34rem; border-radius:50%; top:.06rem; left:.07rem; background:var(--md-default-bg-color); box-shadow:0 1px 2px rgba(0,0,0,.22); transition:transform .16s ease; }
      .mk-account-shop-toggle.is-on .mk-account-shop-toggle-knob{ display:inline-block !important; background:color-mix(in srgb,var(--md-default-fg-color) 58%,transparent); }
      .mk-account-shop-toggle.is-on .mk-account-shop-toggle-knob::after{ transform:translateX(.38rem); }
      .mk-account-shop-card :is(.mk-account-shop-kicker,.mk-account-shop-title,.mk-account-shop-section-title,.mk-account-shop-section-chevron,.mk-account-shop-info > summary,.mk-account-shop-active-note,.mk-account-shop-unlocked-note){ color:var(--md-default-fg-color) !important; }
      .mk-account-shop-card :is(.mk-account-shop-balance strong,.mk-account-shop-price,.mk-account-shop-btn-price,.mk-account-shop-inline-remaining){ color:var(--mk-eorbit-color) !important; }

      .mk-level-currency-mini{ margin-top:8px; font-size:.68rem; opacity:.82; }
      .mk-level-currency-mini strong,.mk-level-currency-today strong{ color:var(--mk-eorbit-color); }
      .mk-level-currency-today{ margin-top:7px; font-size:.74rem; font-weight:820; }
      .mk-level-rule-coin,.mk-account-shop-price,.mk-account-currency-icon{ color:var(--mk-eorbit-color) !important; }
      .mk-level-break-day{ grid-template-columns:minmax(82px,1fr) minmax(42px,.32fr) minmax(58px,.43fr) minmax(68px,.48fr) minmax(68px,.48fr) !important; }
      @media(max-width:900px){ .mk-account-shop-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media(max-width:720px){ .mk-account-shop-card{ padding:14px; border-radius:18px; } .mk-account-shop-hero{ grid-template-columns:minmax(0,1fr) minmax(92px,auto); gap:8px; align-items:center; } .mk-account-shop-kicker{ font-size:1.08rem; line-height:1.05; } .mk-account-shop-heading{ gap:6px; flex-wrap:nowrap; min-width:0; } .mk-account-shop-info > summary{ width:.98rem; height:.98rem; font-size:.62rem; } .mk-account-shop-balance{ justify-self:end; text-align:right; min-width:0; max-width:42vw; padding:7px 9px; border-radius:14px; } .mk-account-shop-balance strong{ justify-content:flex-end; font-size:.90rem; gap:4px; white-space:nowrap; } .mk-account-shop-balance svg{ width:.86rem; height:.86rem; } .mk-account-shop-balance span{ font-size:.52rem; line-height:1.12; } .mk-account-shop-grid{ grid-template-columns:1fr; } .mk-account-shop-info-panel{ left:auto; right:0; width:min(420px, calc(100vw - 42px)); } }

      /* Daily discounts (promotion) */
      .mk-account-shop-section--discounts > summary .mk-account-shop-section-title{ color:var(--mk-eorbit-color) !important; }
      .mk-account-shop-section--discounts{ border:1px solid color-mix(in srgb,var(--mk-eorbit-color) 38%,transparent); border-radius:16px; padding:2px 10px 4px; background:color-mix(in srgb,var(--mk-eorbit-color) 7%,transparent); }
      .mk-account-shop-section-count{ display:inline-flex; align-items:center; justify-content:center; min-width:1.05rem; height:1.05rem; padding:0 .3rem; margin-left:6px; border-radius:999px; font-size:.58rem; font-weight:900; color:var(--md-default-bg-color); background:var(--mk-eorbit-color); }
      .mk-account-shop-discount-price{ display:inline-flex; align-items:stretch; justify-self:start; width:max-content; max-width:100%; height:100%; border-radius:inherit; overflow:hidden; box-shadow:none; background:transparent; }
      .mk-account-shop-discount-pct{ display:flex; align-items:center; justify-content:center; min-width:2.05rem; padding:.08rem .28rem; background:#4c6b22; color:#b8ff21; font-size:.55rem; line-height:1; font-weight:950; letter-spacing:.01em; white-space:nowrap; }
      .mk-account-shop-discount-values{ display:grid; align-content:center; min-width:2.20rem; padding:.06rem .30rem .07rem .24rem; background:transparent; color:var(--mk-eorbit-color); }
      .mk-account-shop-discount-old{ display:inline-flex; align-items:center; gap:2px; color:color-mix(in srgb,var(--md-default-fg-color) 48%,transparent); text-decoration:line-through; font-size:.40rem; line-height:1.02; font-weight:720; }
      .mk-account-shop-discount-old svg{ width:.42rem; height:.42rem; opacity:.72; }
      .mk-account-shop-discount-now{ display:inline-flex; align-items:center; gap:2px; color:var(--mk-eorbit-color); font-size:.58rem; line-height:1.02; font-weight:930; }
      .mk-account-shop-discount-now svg{ width:.53rem; height:.53rem; }
      .mk-account-shop-item.is-discounted{ border-color:color-mix(in srgb,var(--mk-eorbit-color) 50%,transparent); }
      /* Red "1" badge on the Store tab when today's discounts are unseen */
      .mk-shop-discount-badge{ position:absolute; top:-3px; right:-3px; min-width:14px; height:14px; padding:0 3px; border-radius:999px; background:#e23b3b; color:#fff; font-size:9px; font-weight:900; line-height:14px; text-align:center; box-shadow:0 0 0 2px var(--md-default-bg-color); pointer-events:none; }
      .mk-account-shop-tab{ position:relative; }

      /* Store v2: Steam-like category tabs with one product shelf below. */
      .mk-account-shop-card{ gap:16px; background:radial-gradient(circle at 0% 0%,color-mix(in srgb,var(--mk-eorbit-color) 15%,transparent),transparent 36%),linear-gradient(135deg,color-mix(in srgb,var(--md-default-bg-color) 92%,transparent),color-mix(in srgb,var(--md-default-fg-color) 5%,var(--md-default-bg-color))); }
      .mk-account-shop-tabs{ display:flex; gap:8px; flex-wrap:wrap; padding:7px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); border-radius:20px; background:color-mix(in srgb,var(--md-default-fg-color) 5%,transparent); box-shadow:inset 0 1px 0 color-mix(in srgb,#fff 5%,transparent); }
      .mk-account-shop-category-tab{ appearance:none; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); border-radius:999px; background:color-mix(in srgb,var(--md-default-bg-color) 78%,transparent); color:color-mix(in srgb,var(--md-default-fg-color) 78%,transparent); display:inline-flex; align-items:center; gap:7px; min-height:1.78rem; padding:.32rem .56rem; font-size:.62rem; font-weight:850; letter-spacing:.01em; text-transform:none; cursor:pointer; transition:transform .16s ease, background .16s ease, border-color .16s ease, box-shadow .16s ease, color .16s ease; }
      .mk-account-shop-category-tab:hover{ transform:translateY(-1px); border-color:color-mix(in srgb,var(--mk-eorbit-color) 38%,transparent); color:var(--md-default-fg-color); background:color-mix(in srgb,var(--mk-eorbit-color) 9%,var(--md-default-bg-color)); }
      .mk-account-shop-category-tab.is-active{ color:#0b1218; border-color:color-mix(in srgb,var(--mk-eorbit-color) 76%,transparent); background:linear-gradient(135deg,#ffe18a,var(--mk-eorbit-color)); box-shadow:0 8px 22px color-mix(in srgb,var(--mk-eorbit-color) 26%,transparent), inset 0 1px 0 rgba(255,255,255,.45); }
      [data-md-color-scheme="slate"] .mk-account-shop-category-tab.is-active{ color:#111827; }
      .mk-account-shop-category-count{ display:inline-flex; align-items:center; justify-content:center; min-width:1.02rem; height:1.02rem; padding:0 .26rem; border-radius:999px; font-size:.50rem; line-height:1; font-weight:950; background:color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); color:inherit; }
      .mk-account-shop-category-tab.is-active .mk-account-shop-category-count{ background:rgba(0,0,0,.18); color:inherit; }
      .mk-account-shop-panel{ display:grid; gap:13px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); border-radius:22px; padding:14px; background:linear-gradient(180deg,color-mix(in srgb,var(--md-default-bg-color) 92%,transparent),color-mix(in srgb,var(--md-default-fg-color) 4%,var(--md-default-bg-color))); }
      .mk-account-shop-panel-head{ display:flex; justify-content:space-between; align-items:end; gap:12px; flex-wrap:wrap; padding:0 2px; }
      .mk-account-shop-panel-title{ display:flex; align-items:baseline; gap:.55rem; flex-wrap:wrap; font-size:.98rem; font-weight:940; line-height:1.12; letter-spacing:.01em; text-transform:none; }
      .mk-account-shop-panel-hint{ font-size:.55rem; line-height:1.25; font-weight:720; opacity:.58; }
      .mk-account-shop-panel-subtitle{ margin-top:3px; font-size:.62rem; line-height:1.35; opacity:.66; }
      .mk-account-shop-panel-meta{ display:inline-flex; align-items:center; gap:5px; min-height:1.35rem; border-radius:999px; padding:.16rem .46rem; font-size:.55rem; font-weight:850; color:var(--mk-eorbit-color); background:color-mix(in srgb,var(--mk-eorbit-color) 11%,transparent); border:1px solid color-mix(in srgb,var(--mk-eorbit-color) 23%,transparent); }

      /* Store v6 cleanup: no category counts, no explanatory copy, compact wrapped mobile tabs. */
      .mk-account-shop-category-count,.mk-account-shop-panel-subtitle,.mk-account-shop-panel-meta,.mk-account-shop-title-row,.mk-account-shop-title{ display:none !important; }
      .mk-account-shop-category-tab{ padding-inline:.68rem; }
      @media(max-width:720px){ .mk-account-shop-category-tab{ padding-inline:.46rem; } }

      .mk-account-shop-panel .mk-account-shop-grid{ padding:0; align-items:start; grid-auto-rows:auto; gap:9px; }
      .mk-account-shop-item{ position:relative; overflow:hidden; min-height:0; align-content:start; padding:12px; border-radius:18px; background:linear-gradient(145deg,color-mix(in srgb,var(--md-default-bg-color) 92%,transparent),color-mix(in srgb,var(--md-default-fg-color) 4%,var(--md-default-bg-color))); transition:transform .16s ease, border-color .16s ease, box-shadow .16s ease, background .16s ease; display:flex; flex-direction:column; gap:5px; }
      .mk-account-shop-item:hover{ transform:translateY(-2px); border-color:color-mix(in srgb,var(--mk-eorbit-color) 38%,transparent); box-shadow:0 12px 28px rgba(0,0,0,.13); }
      .mk-account-shop-item.is-owned{ border-color:color-mix(in srgb,#35d07f 48%,transparent); background:radial-gradient(circle at 100% 0%,rgba(53,208,127,.14),transparent 42%),linear-gradient(145deg,color-mix(in srgb,var(--md-default-bg-color) 92%,transparent),color-mix(in srgb,var(--md-default-fg-color) 4%,var(--md-default-bg-color))); }
      .mk-account-shop-item.is-active-boost,.mk-account-shop-item.is-equipped{ border-color:color-mix(in srgb,#2dd4bf 62%,transparent); box-shadow:0 0 0 1px color-mix(in srgb,#2dd4bf 28%,transparent),0 14px 30px color-mix(in srgb,#2dd4bf 12%,transparent); }
      .mk-account-shop-item.is-discounted:not(.is-owned){ border-color:color-mix(in srgb,var(--mk-eorbit-color) 52%,transparent); }
      .mk-account-shop-item-head{ align-items:flex-start; }
      .mk-account-shop-item-title{ display:grid; gap:4px; min-width:0; }
      .mk-account-shop-item-title strong{ font-size:.76rem; line-height:1.12; }
      .mk-account-shop-item > small:not(.mk-account-shop-active-note){ font-size:.60rem; line-height:1.25; opacity:.68; }
      .mk-account-shop-meta{ font-size:.50rem; font-weight:800; opacity:.54; line-height:1; }
      .mk-account-shop-card-badges{ display:flex; justify-content:flex-end; flex-wrap:wrap; gap:4px; max-width:48%; }
      .mk-account-shop-card-badges:empty{ display:none; }
      .mk-account-shop-pill{ display:inline-flex; align-items:center; justify-content:center; min-height:1.02rem; padding:.10rem .32rem; border-radius:999px; font-size:.48rem; font-weight:900; line-height:1; white-space:nowrap; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); background:color-mix(in srgb,var(--md-default-fg-color) 7%,transparent); }
      .mk-account-shop-pill--owned{ color:#0b5f36; background:rgba(53,208,127,.18); border-color:rgba(53,208,127,.38); }
      [data-md-color-scheme="slate"] .mk-account-shop-pill--owned{ color:#8af0b6; }
      .mk-account-shop-pill--active{ color:#07545b; background:rgba(45,212,191,.20); border-color:rgba(45,212,191,.42); }
      [data-md-color-scheme="slate"] .mk-account-shop-pill--active{ color:#8ff8eb; }
      .mk-account-shop-pill--discount{ color:#7c3b00; background:rgba(245,200,75,.20); border-color:rgba(245,200,75,.45); }
      [data-md-color-scheme="slate"] .mk-account-shop-pill--discount{ color:#ffe18a; }
      .mk-account-shop-empty{ border:1px dashed color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); border-radius:18px; padding:22px; text-align:center; font-size:.70rem; opacity:.68; background:color-mix(in srgb,var(--md-default-fg-color) 4%,transparent); }
      .mk-account-shop-toggle.is-on{ border-color:rgba(34,197,94,.68) !important; background:linear-gradient(135deg,#22c55e,#06b6d4) !important; color:#04120a !important; box-shadow:0 6px 16px rgba(34,197,94,.24); }
      .mk-account-shop-toggle.is-on .mk-account-shop-toggle-knob{ background:rgba(255,255,255,.38) !important; }
      .mk-account-shop-toggle.is-on .mk-account-shop-toggle-knob::after{ background:#fff !important; }
      .mk-account-shop-toggle.mk-account-shop-toggle--switch{ position:relative; width:2.08rem !important; min-width:2.08rem !important; height:1.08rem !important; min-height:1.08rem !important; padding:0 !important; gap:0 !important; overflow:hidden; font-size:0 !important; color:transparent !important; justify-content:flex-start !important; border-color:rgba(148,163,184,.62) !important; background:linear-gradient(180deg,#eef0f2,#dadde1) !important; box-shadow:inset 0 0 0 1px rgba(255,255,255,.50),0 1px 5px rgba(15,23,42,.20) !important; }
      .mk-account-shop-toggle.mk-account-shop-toggle--switch::after{ content:""; position:absolute; top:50%; left:.10rem; width:.86rem; height:.86rem; border-radius:999px; transform:translateY(-50%); background:#fff; box-shadow:0 1px 5px rgba(15,23,42,.28); transition:left .16s ease,box-shadow .16s ease; }
      .mk-account-shop-toggle.mk-account-shop-toggle--switch.is-on{ border-color:rgba(34,197,94,.70) !important; background:linear-gradient(180deg,#43db67,#22c55e) !important; color:transparent !important; box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),0 1px 5px rgba(15,23,42,.18) !important; }
      .mk-account-shop-toggle.mk-account-shop-toggle--switch.is-on::after{ left:calc(100% - .96rem); }
      .mk-account-shop-toggle.mk-account-shop-toggle--switch .mk-account-shop-toggle-knob{ display:none !important; }
      .mk-account-shop-unlocked-note{ background:rgba(53,208,127,.13); border-color:rgba(53,208,127,.34); }
      .mk-account-shop-active-note{ color:color-mix(in srgb,#2dd4bf 84%,var(--md-default-fg-color)) !important; }
      .mk-account-shop-item.has-theme-preview{
        min-height:7.4rem;
        color:#fff !important;
        background-color:#172033 !important;
        background-image:
          linear-gradient(90deg,rgba(5,10,18,.88) 0%,rgba(5,10,18,.72) 42%,rgba(5,10,18,.34) 78%,rgba(5,10,18,.18) 100%),
          linear-gradient(0deg,rgba(5,10,18,.76) 0%,rgba(5,10,18,.12) 58%,rgba(5,10,18,.20) 100%),
          var(--mk-shop-theme-preview-image) !important;
        background-size:cover,cover,cover !important;
        background-position:center,center,var(--mk-shop-theme-preview-position,center) !important;
        background-repeat:no-repeat !important;
        border-color:rgba(255,255,255,.24);
      }
      .mk-account-shop-item.has-theme-preview:hover{
        border-color:rgba(255,255,255,.48);
        box-shadow:0 14px 32px rgba(0,0,0,.24);
      }
      .mk-account-shop-item.has-theme-preview :is(.mk-account-shop-item-title strong,.mk-account-shop-meta),
      .mk-account-shop-item.has-theme-preview > small:not(.mk-account-shop-active-note){
        color:#fff !important;
        text-shadow:0 1px 4px rgba(0,0,0,.88);
      }
      .mk-account-shop-item.has-theme-preview .mk-account-shop-meta{ opacity:.80; }
      .mk-account-shop-item.has-theme-preview > small:not(.mk-account-shop-active-note){ opacity:.88; }
      .mk-account-shop-item.has-theme-preview :is(.mk-account-shop-try-btn,.mk-comment-primary-btn,.mk-comment-small-btn){
        border-color:rgba(255,255,255,.32) !important;
        background:rgba(8,15,25,.72) !important;
        color:#fff !important;
        box-shadow:0 5px 14px rgba(0,0,0,.20);
        backdrop-filter:blur(7px) saturate(1.08);
        -webkit-backdrop-filter:blur(7px) saturate(1.08);
      }
      .mk-account-shop-item.has-theme-preview.is-owned,
      .mk-account-shop-item.has-theme-preview.is-active-boost,
      .mk-account-shop-item.has-theme-preview.is-equipped{
        background-image:
          linear-gradient(90deg,rgba(5,10,18,.88) 0%,rgba(5,10,18,.72) 42%,rgba(5,10,18,.34) 78%,rgba(5,10,18,.18) 100%),
          linear-gradient(0deg,rgba(5,10,18,.76) 0%,rgba(5,10,18,.12) 58%,rgba(5,10,18,.20) 100%),
          var(--mk-shop-theme-preview-image) !important;
      }
      .mk-account-shop-item.has-palette-preview{
        min-height:7.4rem;
        color:var(--mk-shop-palette-preview-fg,var(--md-default-fg-color)) !important;
        background:var(--mk-shop-palette-preview-bg) !important;
        border-color:var(--mk-shop-palette-preview-border,color-mix(in srgb,var(--md-default-fg-color) 18%,transparent));
      }
      .mk-account-shop-item.has-palette-preview:hover{
        border-color:color-mix(in srgb,var(--mk-shop-palette-preview-border,var(--md-accent-fg-color)) 72%,#fff 28%);
        box-shadow:0 14px 30px rgba(15,23,42,.16);
      }
      .mk-account-shop-item.has-palette-preview :is(.mk-account-shop-item-title strong,.mk-account-shop-meta),
      .mk-account-shop-item.has-palette-preview > small:not(.mk-account-shop-active-note){
        color:var(--mk-shop-palette-preview-fg,var(--md-default-fg-color)) !important;
        text-shadow:none;
      }
      .mk-account-shop-item.has-palette-preview .mk-account-shop-meta{ color:var(--mk-shop-palette-preview-muted,currentColor) !important; opacity:1; }
      .mk-account-shop-item.has-palette-preview > small:not(.mk-account-shop-active-note){ color:var(--mk-shop-palette-preview-muted,currentColor) !important; opacity:1; }
      .mk-account-shop-item.has-palette-preview :is(.mk-account-shop-try-btn,.mk-comment-primary-btn,.mk-comment-small-btn){
        border-color:var(--mk-shop-palette-preview-border,rgba(255,255,255,.32)) !important;
        background:var(--mk-shop-palette-preview-control-bg,rgba(255,255,255,.80)) !important;
        color:var(--mk-shop-palette-preview-control-fg,var(--mk-shop-palette-preview-fg)) !important;
        box-shadow:0 5px 14px rgba(15,23,42,.12);
        backdrop-filter:blur(7px) saturate(1.08);
        -webkit-backdrop-filter:blur(7px) saturate(1.08);
      }
      .mk-account-shop-item.has-font-preview,
      .mk-account-shop-item.has-font-preview *{
        font-family:var(--mk-shop-font-preview) !important;
      }
      .mk-account-shop-ranking-preview{
        display:grid !important;
        grid-template-columns:auto minmax(0,1fr) auto !important;
        align-items:center !important;
        gap:.45rem !important;
        width:100% !important;
        min-width:0 !important;
        min-height:2.35rem !important;
        margin:.22rem 0 .08rem !important;
        padding:.38rem .50rem .38rem .66rem !important;
        box-sizing:border-box !important;
        border-radius:14px !important;
        color:var(--md-default-fg-color) !important;
        pointer-events:none !important;
        cursor:default !important;
        user-select:none !important;
      }
      .mk-account-shop-ranking-preview .trending-rank{
        font-size:.56rem !important;
        font-weight:950 !important;
        opacity:.70 !important;
      }
      .mk-account-shop-ranking-preview .trending-user-name{
        min-width:0 !important;
        overflow:hidden !important;
        text-overflow:ellipsis !important;
        white-space:nowrap !important;
        font-size:.60rem !important;
        font-weight:900 !important;
      }
      .mk-account-shop-ranking-preview .trending-score{
        font-size:.52rem !important;
        font-weight:850 !important;
        white-space:nowrap !important;
        opacity:.76 !important;
      }
      .mk-account-shop-comment-preview{
        display:grid !important;
        gap:.24rem !important;
        width:100% !important;
        min-width:0 !important;
        min-height:3.45rem !important;
        margin:.24rem 0 .08rem !important;
        padding:.46rem .56rem .42rem .66rem !important;
        box-sizing:border-box !important;
        border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent);
        border-radius:14px !important;
        color:var(--md-default-fg-color) !important;
        background:color-mix(in srgb,var(--md-default-bg-color) 94%,transparent);
        pointer-events:none !important;
        cursor:default !important;
        user-select:none !important;
      }
      .mk-account-shop-comment-preview-meta{
        display:grid;
        grid-template-columns:auto minmax(0,1fr) auto;
        align-items:center;
        gap:.34rem;
        min-width:0;
      }
      .mk-account-shop-comment-preview-avatar{
        display:grid;
        place-items:center;
        width:1.02rem;
        height:1.02rem;
        border-radius:50%;
        color:#fff;
        background:linear-gradient(135deg,#3b82f6,#8b5cf6);
        box-shadow:0 2px 7px rgba(59,130,246,.24);
        font-size:.46rem;
        font-weight:950;
      }
      .mk-account-shop-comment-preview-name{
        min-width:0;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.53rem;
        font-weight:900;
      }
      .mk-account-shop-comment-preview-time{ font-size:.42rem; opacity:.50; }
      .mk-account-shop-comment-preview-text{
        min-width:0;
        padding-right:1rem;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.52rem;
        line-height:1.22;
        opacity:.82;
      }
      .mk-account-shop-comment-preview-reactions{
        display:flex;
        gap:.24rem;
        font-size:.43rem;
        line-height:1;
        opacity:.62;
      }
      .mk-account-shop-cursor-preview{
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:.38rem;
        width:100%;
        min-width:0;
        margin:.24rem 0 .08rem;
        padding:.38rem;
        box-sizing:border-box;
        border:1px solid color-mix(in srgb,var(--md-default-fg-color) 11%,transparent);
        border-radius:14px;
        background:color-mix(in srgb,var(--md-default-fg-color) 3%,var(--md-default-bg-color));
      }
      .mk-account-shop-cursor-swatch{
        display:grid;
        grid-template-columns:auto minmax(0,1fr);
        align-items:center;
        gap:.36rem;
        min-width:0;
        min-height:2.25rem;
        padding:.30rem .38rem;
        border:1px solid color-mix(in srgb,var(--md-default-fg-color) 11%,transparent);
        border-radius:11px;
        background:color-mix(in srgb,var(--md-default-bg-color) 88%,transparent);
        transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease;
      }
      .mk-account-shop-cursor-swatch:hover{
        transform:translateY(-1px);
        border-color:color-mix(in srgb,var(--md-accent-fg-color) 42%,transparent);
        box-shadow:0 6px 14px color-mix(in srgb,var(--md-default-fg-color) 10%,transparent);
      }
      .mk-account-shop-cursor-swatch img{
        display:block;
        width:1.48rem;
        height:1.48rem;
        object-fit:contain;
        filter:drop-shadow(0 2px 4px rgba(15,23,42,.18));
      }
      .mk-account-shop-cursor-swatch span{
        min-width:0;
        font-size:.48rem;
        line-height:1.1;
        font-weight:850;
        opacity:.68;
      }
      @media(max-width:720px){ .mk-account-shop-tabs{ overflow:visible; flex-wrap:wrap; padding:6px; gap:6px; scroll-snap-type:none; } .mk-account-shop-category-tab{ flex:0 1 auto; scroll-snap-align:none; min-height:1.48rem; padding:.24rem .46rem; font-size:.55rem; gap:4px; } .mk-account-shop-panel{ padding:12px; border-radius:18px; } .mk-account-shop-card-badges{ max-width:54%; } }

      /* Store browse collections: scoped structure, inherited theme colors. */
      .mk-account-shop-card .mk-account-shop-tabs.mk-account-shop-browse-tabs{
        display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px;
      }
      .mk-account-shop-card .mk-account-shop-tabs.mk-account-shop-browse-tabs .mk-account-shop-category-tab{
        display:flex; flex-direction:column; align-items:flex-start; justify-content:center;
        min-width:0; min-height:2.65rem; width:100%; padding:.45rem .6rem;
        text-align:left; white-space:normal; line-height:1.3; gap:3px;
        font-size:.65rem; font-weight:700; border-radius:12px;
      }
      .mk-account-shop-browse-tabs .mk-account-shop-browse-count{
        display:block; font-size:.55rem; line-height:1.3; font-weight:500; opacity:.72;
      }
      .mk-account-shop-card .mk-account-shop-browse-description{
        margin:.3rem 0 0; font-size:.65rem; line-height:1.5; color:var(--md-default-fg-color--light);
      }
      .mk-account-shop-card .mk-account-shop-browse-filter{
        display:flex; align-items:center; flex-wrap:wrap; gap:8px 12px;
        font-size:.65rem; font-weight:650; color:var(--md-default-fg-color--light);
      }
      .mk-account-shop-card .mk-account-shop-browse-select{
        max-width:100%; min-width:0; min-height:40px; padding:.38rem 2rem .38rem .65rem;
        border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent);
        border-radius:9px; background:var(--md-default-bg-color); color:var(--md-default-fg-color);
        font:inherit; cursor:pointer;
      }
      .mk-account-shop-card :is(.mk-account-shop-browse-deals,.mk-account-shop-browse-page){
        appearance:none; min-height:40px; padding:.35rem .65rem; border-radius:9px;
        border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent);
        background:var(--md-default-bg-color); color:var(--md-default-fg-color);
        font:inherit; font-size:.63rem; font-weight:650; cursor:pointer;
      }
      .mk-account-shop-card .mk-account-shop-browse-deals.is-active{
        border-color:var(--md-accent-fg-color); background:color-mix(in srgb,var(--md-accent-fg-color) 10%,var(--md-default-bg-color));
      }
      .mk-account-shop-card :is(.mk-account-shop-browse-deals,.mk-account-shop-browse-page):hover:not(:disabled){
        border-color:var(--md-accent-fg-color);
      }
      .mk-account-shop-card .mk-account-shop-browse-page:disabled{ opacity:.45; cursor:default; }
      .mk-account-shop-card .mk-account-shop-browse-pager{
        display:flex; align-items:center; justify-content:flex-end; flex-wrap:wrap; gap:8px;
        border-top:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent); padding-top:12px;
      }
      .mk-account-shop-card .mk-account-shop-browse-status{
        margin-right:auto; font-size:.61rem; line-height:1.5; color:var(--md-default-fg-color--light);
      }
      .mk-account-shop-card :is(.mk-account-shop-browse-select,.mk-account-shop-browse-deals,.mk-account-shop-browse-page):focus-visible{
        outline:2px solid var(--md-accent-fg-color); outline-offset:3px;
      }
      @media(max-width:720px){
        .mk-account-shop-card .mk-account-shop-tabs.mk-account-shop-browse-tabs{ grid-template-columns:repeat(2,minmax(0,1fr)); }
        .mk-account-shop-card .mk-account-shop-browse-select{ flex:1 1 180px; }
        .mk-account-shop-card .mk-account-shop-browse-status{ flex-basis:100%; }
      }
      @media(pointer:coarse){
        .mk-account-shop-card :is(.mk-account-shop-browse-select,.mk-account-shop-browse-deals,.mk-account-shop-browse-page){ min-height:44px; }
      }
    `.trim();document.head.appendChild(st);}
function openShopCategories(host){const set=new Set();try{const selected=readShopBrowseState(host).selectedCategory;if(selected){set.add(selected);return set;}}catch(_){}
try{(host||document).querySelectorAll(".mk-account-shop-category-tab[data-shop-category].is-active").forEach((node)=>{const cat=String(node.getAttribute("data-shop-category")||"");if(cat)set.add(cat);});if(set.size)return set;}catch(_){}
try{(host||document).querySelectorAll(".mk-account-shop-section[data-shop-category]").forEach((node)=>{if(node&&node.open)set.add(String(node.getAttribute("data-shop-category")||""));});}catch(_){}
return set;}
function accountShopClosePanel(host){try{const modal=host&&host.closest?host.closest(".mk-local-activity-modal"):document.querySelector(".mk-local-activity-modal--account");const btn=modal&&modal.querySelector?modal.querySelector(".mk-local-activity-close"):null;if(btn)btn.click();else if(modal)modal.remove();}catch(_){}}
function accountShopOpenProfilePreview(host){try{const prof=readLocalProfile()||{};const nm=cleanProfileNameLocal(prof.name||prof.displayName||prof.username||"");accountShopClosePanel(host);window.setTimeout(()=>{try{if(nm&&typeof openPublicProfile==="function"){openPublicProfile(nm,{source:"shop-preview",selfPreview:true});return;}
window.alert("Create a public username first, then use Try again to preview public profile styles.");}catch(_){}},120);}catch(_){}}
function stopShopTrialCountdowns(){try{if(window.__mkShopTrialCountdownTimer)window.clearInterval(window.__mkShopTrialCountdownTimer);}catch(_){}
window.__mkShopTrialCountdownTimer=0;}
function updateShopTrialCountdowns(host){let liveCount=0;try{const root=host||document;root.querySelectorAll(".mk-account-shop-trial-remaining[data-expires-at], .mk-account-shop-inline-remaining[data-expires-at]").forEach((node)=>{const expiresAt=Number(node.getAttribute("data-expires-at")||0)||0;const left=expiresAt-Date.now();node.textContent=left>0?formatShopTrialRemaining(left):"Expired";if(left<=0)node.classList.add("is-expired");else liveCount+=1;});}catch(_){}
return liveCount;}
function scheduleShopTrialCountdowns(host){const live=updateShopTrialCountdowns(host);if(!live||document.hidden){stopShopTrialCountdowns();return;}
try{if(window.__mkShopTrialCountdownTimer)return;window.__mkShopTrialCountdownTimer=window.setInterval(()=>{try{const stillLive=updateShopTrialCountdowns(document);if(!stillLive||document.hidden)stopShopTrialCountdowns();}catch(_){}},1000);}catch(_){}}
function bindShopTrialDelegatedFallbackOnce(){if(window.__mkShopTrialDelegatedFallbackBound)return;window.__mkShopTrialDelegatedFallbackBound=true;try{document.addEventListener("click",(ev)=>{try{const t=ev&&ev.target;const btn=t&&t.closest?t.closest('.mk-account-shop-toggle[data-shop-action="trial-toggle"]'):null;if(!btn)return;const handledAt=Number(btn.getAttribute("data-mk-shop-handled-at")||0)||0;if(Date.now()-handledAt<420)return;const itemId=String(btn.getAttribute("data-shop-item-id")||"").trim();if(!itemId)return;const api=window.MkAccountData||null;if(!api)return;const inv=typeof api.getShopInventory==="function"?api.getShopInventory():{activeTrials:[]};const row=inv&&Array.isArray(inv.activeTrials)?inv.activeTrials.find((x)=>String(x&&x.itemId||"")===itemId):null;const host=btn.closest('.mk-local-activity-body')||btn.closest('.mk-local-mini-body')||btn.closest('.mk-account-shop-card')?.parentElement||null;const openCats=host?openShopCategories(host):new Set();if(row&&Number(row.expiresAt||0)>Date.now()){if(typeof api.setShopTrialMuted==="function")api.setShopTrialMuted(itemId,!row.muted);}else if(typeof api.startShopTrial==="function"){const res=api.startShopTrial(itemId,{source:"shop-try-delegated"});if(!res||res.ok===false){if(res&&res.error==="trial_used_today")window.alert("Preview already used today. Try again tomorrow or unlock it.");else window.alert("This item cannot be previewed.");}}
try{if(api&&typeof api.applyEquippedCosmetics==="function")api.applyEquippedCosmetics();}catch(_){}
if(host)renderAccountShop(host,{openCategories:openCats});}catch(_){}},false);}catch(_){}}
const SHOP_DISCOUNT_SEEN_KEY="mk_shop_discount_seen_day_v1";function dailyDiscountsUnseen(){try{return localStorage.getItem(SHOP_DISCOUNT_SEEN_KEY)!==currentDiscountDay();}catch(_){return false;}}
function paintShopDiscountBadges(){try{const unseen=dailyDiscountsUnseen();document.querySelectorAll("[data-mk-shop-discount-badge]").forEach((b)=>{b.hidden=!unseen;});}catch(_){}}
function markDailyDiscountsSeen(){try{localStorage.setItem(SHOP_DISCOUNT_SEEN_KEY,currentDiscountDay());}catch(_){}
paintShopDiscountBadges();try{window.dispatchEvent(new CustomEvent("mk-shop-discounts-seen"));}catch(_){}}
const SHOP_DYNAMIC_PRICE_CACHE_KEY="mk_shop_dynamic_prices_v1";const SHOP_DYNAMIC_PRICE_TTL_MS=15*60*1000;let __shopDynamicPriceFetchInFlight=false;function shopDynamicPricesCacheAge(){try{const raw=localStorage.getItem(SHOP_DYNAMIC_PRICE_CACHE_KEY);if(!raw)return Infinity;const ts=Number((JSON.parse(raw)||{}).ts||0);return ts?Date.now()-ts:Infinity;}catch(_){return Infinity;}}
function maybeRefreshShopDynamicPrices(onChanged){try{if(__shopDynamicPriceFetchInFlight)return;if(shopDynamicPricesCacheAge()<SHOP_DYNAMIC_PRICE_TTL_MS)return;if(!(window.MkAccountData&&typeof window.MkAccountData.setShopDynamicMultipliers==="function"))return;__shopDynamicPriceFetchInFlight=true;let beforeMap="{}";try{beforeMap=JSON.stringify((JSON.parse(localStorage.getItem(SHOP_DYNAMIC_PRICE_CACHE_KEY)||"{}")||{}).map||{});}catch(_){}
fetchJsonWithRetry(API_BASE+"/shop/dynamic-prices",{cache:"no-store",timeoutMs:8000},2).then((res)=>{if(!res||res.ok===false||!res.multipliers)return;window.MkAccountData.setShopDynamicMultipliers(res.multipliers);try{if(typeof onChanged==="function"&&JSON.stringify(res.multipliers||{})!==beforeMap)onChanged();}catch(_){}}).catch(()=>{}).then(()=>{__shopDynamicPriceFetchInFlight=false;});}catch(_){__shopDynamicPriceFetchInFlight=false;}}
let __shopCloudBalanceFetchAt=0;let __shopCloudBalanceInFlight=false;function readCloudConfirmedBalance(){try{const sc=JSON.parse(localStorage.getItem("mk_account_synced_cloud_fp_v1")||"null");return sc&&sc.currencyBalance!=null&&Number.isFinite(Number(sc.currencyBalance))?Math.max(0,Number(sc.currencyBalance)):null;}catch(_){return null;}}
function maybeRefreshShopCloudBalance(onChanged){try{const api=window.MkAccountData||null;if(!api||typeof api.syncShopStateNow!=="function")return;const profile=readLocalProfile();if(!profile||!profile.accountKey)return;if(__shopCloudBalanceInFlight||Date.now()-__shopCloudBalanceFetchAt<15000)return;__shopCloudBalanceInFlight=true;const before=readCloudConfirmedBalance();api.syncShopStateNow({reason:"store-open"}).then(()=>{__shopCloudBalanceFetchAt=Date.now();const after=readCloudConfirmedBalance();try{if(typeof onChanged==="function"&&after!=null&&after!==before)onChanged();}catch(_){}}).catch(()=>{}).then(()=>{__shopCloudBalanceInFlight=false;});}catch(_){__shopCloudBalanceInFlight=false;}}
function randomLockedEmojiBundleCandidate(){const ent=emojiEntitlements();const pool=(__commentEmojiIcons||[]).filter((item)=>{const cp=String(item&&item.codepoint||"").replace(/[^0-9a-f_]/gi,"").toLowerCase();return cp&&!(ent.any&&ent.any[cp]);});if(!pool.length)return null;return pool[Math.floor(Math.random()*pool.length)]||null;}
function applyShopThemePreview(tile,item,api){try{if(!tile||!item)return false;const liveApi=api||window.MkAccountData||null;if(item.imageThemeId&&liveApi&&typeof liveApi.imageThemeConfig==="function"){const theme=liveApi.imageThemeConfig(String(item.imageThemeId||"").trim());const previewUrl=theme&&theme.assets&&(theme.assets.preview||theme.assets.header);if(!previewUrl)return false;const role=String(item.imageThemeRole||"")==="public_profile"?"public_profile":"interface";const roleConfig=role==="public_profile"?(theme.publicProfileTheme||theme.interfaceTheme||{}):(theme.interfaceTheme||{});tile.classList.add("has-theme-preview");tile.setAttribute("data-shop-theme-preview",String(theme.id||item.imageThemeId||""));tile.setAttribute("data-shop-theme-preview-role",role);tile.style.setProperty("--mk-shop-theme-preview-image",`url(${JSON.stringify(String(previewUrl))})`);tile.style.setProperty("--mk-shop-theme-preview-position",String(roleConfig.headerPosition||"center"));return true;}
if(item.paletteThemeId&&liveApi&&typeof liveApi.paletteThemeConfig==="function"){const theme=liveApi.paletteThemeConfig(String(item.paletteThemeId||"").trim());const preview=theme&&theme.preview||null;if(!preview||!preview.background)return false;tile.classList.add("has-palette-preview");tile.setAttribute("data-shop-palette-preview",String(theme.id||item.paletteThemeId||""));tile.setAttribute("data-shop-theme-preview-role",String(item.paletteThemeRole||"")==="public_profile"?"public_profile":"interface");tile.style.setProperty("--mk-shop-palette-preview-bg",String(preview.background));tile.style.setProperty("--mk-shop-palette-preview-fg",String(preview.foreground||"var(--md-default-fg-color)"));tile.style.setProperty("--mk-shop-palette-preview-muted",String(preview.muted||preview.foreground||"var(--md-default-fg-color)"));tile.style.setProperty("--mk-shop-palette-preview-control-bg",String(preview.controlBackground||"rgba(255,255,255,.80)"));tile.style.setProperty("--mk-shop-palette-preview-control-fg",String(preview.controlForeground||preview.foreground||"var(--md-default-fg-color)"));tile.style.setProperty("--mk-shop-palette-preview-border",String(preview.border||"color-mix(in srgb,var(--md-default-fg-color) 18%,transparent)"));return true;}
return false;}catch(_){return false;}}
function applyShopFontPreview(tile,item,api){try{if(!tile||!item||(item.category!=="Header fonts"&&item.category!=="Body fonts"))return false;const stack=shopFontPreviewStack(item.id,api);if(!stack)return false;tile.classList.add("has-font-preview");tile.setAttribute("data-shop-font-preview",String(item.id||""));tile.style.setProperty("--mk-shop-font-preview",stack);return true;}catch(_){return false;}}
function appendShopRankingPreview(host,item,compact){try{if(!host||!item||item.category!=="Ranking effects")return null;const row=el("div","mk-account-shop-ranking-preview trending-user-item","");row.setAttribute("data-ranking-effect",String(item.id||""));row.setAttribute("aria-label",`${item.title || "Ranking"} effect preview`);row.innerHTML=`<span class="trending-rank">#1</span><span class="trending-user-name">Your ranking row</span><span class="trending-score">${compact ? "1,280" : "1,280 XP"}</span>`;host.appendChild(row);return row;}catch(_){return null;}}
function appendShopCommentPreview(host,item,compact){try{if(!host||!item||item.category!=="Comment effects")return null;const previewText={comment_highlight_soft:"A bright idea, saved at golden hour.",comment_mint_margin:"This insight deserves a little magic.",comment_blueprint_grid:"Model locked. Variables aligned.",comment_aurora_ribbon:"The intuition connects everything.",comment_starlit_ink:"Every result belongs to a larger constellation.",comment_scholar_seal:"A theorem worth preserving in the archive.",comment_frosted_window:"A clear thought on a quiet winter morning.",comment_manga_burst:"That result changes the whole problem!",comment_lofi_tape:"One useful note for the next study session.",comment_ocean_depth:"The deeper structure is finally visible.",comment_terminal_green:"solution_status: verified"};const row=el("div","mk-account-shop-comment-preview mk-comment-card","");row.setAttribute("data-comment-effect",String(item.id||""));row.setAttribute("aria-label",`${item.title || "Comment"} effect preview`);row.innerHTML=`
        <div class="mk-account-shop-comment-preview-meta">
          <span class="mk-account-shop-comment-preview-avatar">E</span>
          <span class="mk-account-shop-comment-preview-name">Study partner</span>
          <span class="mk-account-shop-comment-preview-time">now</span>
        </div>
        <div class="mk-account-shop-comment-preview-text">${escapeHtml(previewText[item.id] || "A useful note belongs here.")}</div>
        <div class="mk-account-shop-comment-preview-reactions"><span>👍 ${compact ? "3" : "4"}</span><span>❤️ 2</span></div>`;host.appendChild(row);return row;}catch(_){return null;}}
function appendShopCursorPreview(host,item,compact){try{if(!host||!item||item.category!=="Mouse cursors")return null;const normalUrl=String(item.cursorDefaultUrl||item.cursorDefault||"").trim();const pointerUrl=String(item.cursorPointerUrl||item.cursorPointer||normalUrl).trim();if(!normalUrl)return null;const preview=el("div","mk-account-shop-cursor-preview","");preview.setAttribute("aria-label",`${item.title || "Mouse cursor"} preview`);const normal=el("div","mk-account-shop-cursor-swatch","");normal.innerHTML=`<img src="${escapeHtml(normalUrl)}" alt=""><span>${compact ? "Move" : "Normal pointer"}</span>`;normal.style.cursor=`url("${normalUrl}") 3 3, auto`;const link=el("div","mk-account-shop-cursor-swatch","");link.innerHTML=`<img src="${escapeHtml(pointerUrl)}" alt=""><span>${compact ? "Link" : "Link hover"}</span>`;link.style.cursor=`url("${pointerUrl}") 3 3, pointer`;preview.appendChild(normal);preview.appendChild(link);host.appendChild(preview);return preview;}catch(_){return null;}}
function appendShopSeriesPreview(host,item){try{const kind=String(item&&item.previewKind||"").trim();if(!host||!kind)return null;const variant=String(item.previewVariant||"");const ownName=String((readLocalProfile()||{}).name||"Your name").trim()||"Your name";const variantCopy={"coin-burst":"🪙 ✦","heart-rain":"❤️ ♡","thunder-hit":"⚡ ✦","petal-pop":"🌸 ✿","galaxy-pulse":"🪐 ✦","prism-pop":"🔷 ✦","bubble-beat":"🫧 ○","flame-charge":"🔥 ✦","snow-spark":"❄️ ✧","lucky-clover":"🍀 ✦","lightsaber":"CYAN SABER","liquid-rainbow":"RAINBOW FLOW","racing-meter":"TURBO 68%","star-trail":"STAR TRAIL","crystal-charge":"CRYSTAL 68%","victory-fireworks":"🎆","pixel-victory":"👾","crown-drop":"👑","meteor-shower":"☄️","confetti-cannon":"🎉","disco-finish":"🪩","sakura-shower":"🌸","lightning-rank":"⚡","ocean-splash":"🌊","aurora-crown":"👑","arcade":"♪ 8-BIT","crystal":"◇ CHIME","cyber":"⌁ SYNTH","magic":"✦ SPARKLE","minimal":"• CLICK"};const preview=el("div","mk-shop-series-preview","");preview.setAttribute("data-preview-kind",kind);preview.setAttribute("data-preview-variant",variant);preview.setAttribute("aria-label",`${item.title || "Store item"} preview`);if(kind==="nameplate"){preview.innerHTML=`<div class="mk-shop-preview-comment-line"><i>${escapeHtml(ownName.slice(0, 1).toUpperCase())}</i><strong>${escapeHtml(ownName)}</strong></div>`;}else if(kind==="reaction"){preview.innerHTML=`<div class="mk-shop-preview-reaction-row"><button type="button">👍 4</button><button type="button">❤️ 2</button><span>${escapeHtml(variantCopy[variant] || "✦")}</span></div>`;}else if(kind==="reading"){preview.innerHTML=`<div class="mk-shop-preview-reading"><i></i><strong>${escapeHtml(item.title || "Reading bar")}</strong><small>below the site header · 68% read</small></div>`;}else if(kind==="mastery_button"||kind==="mastery_background"||kind==="mastery_border"||kind==="mastery_rating"){preview.innerHTML=`<div class="mk-shop-preview-mastery"><strong>Mastery for this concept</strong><div><button type="button" class="is-mastered">✓ Mastered</button><button type="button" class="is-clear">○ Clear</button><button type="button" class="is-manage">⚙</button></div></div>`;}else if(kind==="connection_panel"||kind==="connection_sections"||kind==="connection_links"){preview.innerHTML=`<div class="mk-shop-preview-connections"><strong>Concept connections</strong><div class="mk-conn-prev-section is-dependent"><b>Dependents</b><span>Homogeneous systems</span></div><div class="mk-conn-prev-section is-prerequisite"><b>Prerequisites</b><span>Linear equations</span></div><div class="mk-conn-prev-section is-related"><b>Related concepts</b><span>Augmented matrix</span></div></div>`;}else if(kind==="finder_builder_panel"||kind==="finder_builder_buttons"||kind==="finder_builder_tokens"){preview.innerHTML=`<div class="mk-shop-preview-finder-builder"><strong>Finder Builder</strong><div class="mk-fb-prev-chips"><span class="is-term">limit</span><span class="is-op">AND</span><span class="is-term">infinity</span></div><div class="mk-fb-prev-actions"><button type="button">Undo</button><button type="button">OR</button><button type="button" class="is-run">Run search</button></div></div>`;}else if(kind==="sidepanel_surface"||kind==="sidepanel_cards"||kind==="sidepanel_links"){preview.innerHTML=`<div class="mk-shop-preview-sidepanel"><div class="mk-sp-prev-top"><strong>Math I · Calculus</strong><button type="button">Sort</button></div><section><b>Lecture 2</b><span class="is-active">Real numbers</span><span>Intervals</span><span>Absolute value</span></section></div>`;}else if(kind==="concept_card"){preview.innerHTML=`<div class="mk-shop-preview-concept-card"><strong>Derivative rules</strong><small>Definition · intuition · examples</small><em>Open concept →</em></div>`;}else if(kind==="notification"){preview.innerHTML=`<div class="mk-shop-preview-notification"><i>🔔</i><span><strong>New reply</strong><small>Study partner replied · now</small></span></div>`;}else if(kind==="sound"){preview.innerHTML=`<button type="button" class="mk-shop-sound-sample">▶ Play sample</button>`;}else if(kind==="bgm"){preview.innerHTML=`<button type="button" class="mk-shop-bgm-sample" data-bgm-item-id="${escapeAttr(item.id || "")}"><span>▶</span><strong>${escapeHtml(item.title || "Background music")}</strong><small>${escapeHtml(item.bgmCulture || "Instrumental")}</small></button>`;}else{preview.innerHTML=`<span>${escapeHtml(variantCopy[variant] || "🏆")}</span>`;}
host.appendChild(preview);return preview;}catch(_){return null;}}
function shopItemsOwnedFirst(rows,isOwned){const owns=typeof isOwned==="function"?isOwned:()=>false;return(Array.isArray(rows)?rows:[]).map((item,index)=>({item,index,owned:!!owns(item)})).sort((a,b)=>Number(b.owned)-Number(a.owned)||a.index-b.index).map((row)=>row.item);}
function shopDisplayCollections(){return[{key:"__mk_collection_reading__",label:"Reading & appearance",description:"Make your everyday reading space your own.",categories:["Interface themes","Header fonts","Body fonts","Mouse cursors","Top reading progress bars","Sidebar effects","Course index card skins"]},{key:"__mk_collection_study__",label:"Maps & study",description:"Optional visuals, celebrations and XP boosts. Core study tools stay free.",categories:["Concept connection effects","Finder builder effects","Finder effects","Map effects","Mastery effects","Quiz celebrations","Progress boosts"]},{key:"__mk_collection_community__",label:"Identity & community",description:"Personal touches for your profile and conversations.",categories:["Public Profile themes","Personal name labels","Comment reaction buttons","Account notification skins","Ranking effects","Comment effects","Emoji bundles"]},{key:"__mk_collection_audio__",label:"Audio & extras",description:"Optional music and interface sounds, on your terms.",categories:["Background music","Interface sound packs"]}];}
function buildShopDisplayModel(items,isOwned,discountMap){const rows=Array.isArray(items)?items:[];const owns=typeof isOwned==="function"?isOwned:()=>false;const discounts=discountMap||{};const byCat=new Map();rows.forEach((item)=>{const cat=String(item&&item.category||"Other").trim()||"Other";if(!byCat.has(cat))byCat.set(cat,[]);byCat.get(cat).push(item);});const categories=Array.from(byCat.keys());byCat.forEach((entries,cat)=>byCat.set(cat,shopItemsOwnedFirst(entries,owns)));const groups=shopDisplayCollections();const parentByCategory=new Map();groups.forEach((group)=>{group.categories.forEach((cat)=>parentByCategory.set(cat,group.key));byCat.set(group.key,shopItemsOwnedFirst(group.categories.flatMap((cat)=>byCat.get(cat)||[]),owns));});byCat.set("__mk_all__",shopItemsOwnedFirst(rows,owns));byCat.set("__mk_owned__",rows.filter(owns).sort((a,b)=>String(a.category||"").localeCompare(String(b.category||""))||String(a.title||a.id||"").localeCompare(String(b.title||b.id||""))));byCat.set("__mk_daily_discounts__",shopItemsOwnedFirst(rows.filter((item)=>Number(discounts[String(item.id||"")]||0)>0).sort((a,b)=>Number(discounts[b.id]||0)-Number(discounts[a.id]||0)),owns));return{byCat,groups,categories,parentByCategory};}
function readShopBrowseState(host){try{const card=(host||document).querySelector(".mk-account-shop-card[data-shop-selected]");if(card)return{selectedCategory:String(card.getAttribute("data-shop-selected")||""),page:Math.max(1,Number(card.getAttribute("data-shop-page")||1)||1)};}catch(_){}
return{selectedCategory:"",page:1};}
function shopBrowsePage(rows,page){const items=Array.isArray(rows)?rows:[];const pageSize=24;const pageCount=Math.max(1,Math.ceil(items.length/pageSize));const current=Math.max(1,Math.min(pageCount,Math.floor(Number(page)||1)));const start=(current-1)*pageSize;return{page:current,pageCount,total:items.length,start,items:items.slice(start,start+pageSize)};}
function scrollShopBrowseResults(host,pager){try{const scroller=host&&(host.closest(".mk-local-activity-body")||host.closest(".mk-local-mini-body"));if(!scroller||!pager||!pager.isConnected)return;const containerRect=scroller.getBoundingClientRect();const pagerRect=pager.getBoundingClientRect();const top=(Number(scroller.scrollTop)||0)+pagerRect.top-containerRect.top-12;if(Number.isFinite(top))scroller.scrollTop=Math.max(0,top);}catch(_){}}
const SHOP_BROWSE_REFRESH_PENDING=new WeakMap();function cancelPendingShopBrowseRefresh(host){const pending=SHOP_BROWSE_REFRESH_PENDING.get(host);if(!pending)return;SHOP_BROWSE_REFRESH_PENDING.delete(host);try{pending.control.removeEventListener("blur",pending.flush);}catch(_){}
try{document.removeEventListener("pointerdown",pending.pointerDown,true);}catch(_){}
try{document.removeEventListener("pointerup",pending.pointerUp,true);}catch(_){}
try{document.removeEventListener("pointercancel",pending.pointerUp,true);}catch(_){}
try{document.removeEventListener("focusin",pending.focusChanged,true);}catch(_){}
try{if(pending.timer!=null)window.clearTimeout(pending.timer);}catch(_){}}
function refreshAccountShop(host){if(!host||host.isConnected===false||!host.querySelector(".mk-account-shop-card"))return;const pending=SHOP_BROWSE_REFRESH_PENDING.get(host);if(pending&&(pending.scheduled||document.activeElement===pending.control))return;if(pending)cancelPendingShopBrowseRefresh(host);const active=document.activeElement;if(active&&host.contains(active)&&active.classList.contains("mk-account-shop-browse-select")){const deferred={control:active,scheduled:false,flush:null,pointers:new Set(),timer:null};const finish=()=>{deferred.timer=null;if(SHOP_BROWSE_REFRESH_PENDING.get(host)!==deferred||deferred.pointers.size)return;cancelPendingShopBrowseRefresh(host);refreshAccountShop(host);};deferred.flush=()=>{if(deferred.scheduled)return;deferred.scheduled=true;if(!deferred.pointers.size)Promise.resolve().then(finish);};deferred.pointerDown=(event)=>{if(host.isConnected===false||active.isConnected===false){cancelPendingShopBrowseRefresh(host);return;}
deferred.pointers.add(event.pointerId);};deferred.pointerUp=(event)=>{deferred.pointers.delete(event.pointerId);if(deferred.scheduled&&!deferred.pointers.size&&deferred.timer==null)deferred.timer=window.setTimeout(finish,0);};deferred.focusChanged=(event)=>{if(event.target!==active)deferred.flush();};SHOP_BROWSE_REFRESH_PENDING.set(host,deferred);active.addEventListener("blur",deferred.flush,{once:true});document.addEventListener("pointerdown",deferred.pointerDown,true);document.addEventListener("pointerup",deferred.pointerUp,true);document.addEventListener("pointercancel",deferred.pointerUp,true);document.addEventListener("focusin",deferred.focusChanged,true);return;}
renderAccountShop(host,{openCategories:openShopCategories(host)});}
const SHOP_BROWSE_EMOJI_PENDING=new WeakSet();function ensureShopBrowseEmojiData(host){if(__commentEmojiDataReady||SHOP_BROWSE_EMOJI_PENDING.has(host))return;SHOP_BROWSE_EMOJI_PENDING.add(host);Promise.resolve().then(()=>loadCommentEmojiData()).then(()=>{SHOP_BROWSE_EMOJI_PENDING.delete(host);if(__commentEmojiDataReady)refreshAccountShop(host);}).catch(()=>{SHOP_BROWSE_EMOJI_PENDING.delete(host);});}
function renderAccountShop(host,opts){if(!host)return;cancelPendingShopBrowseRefresh(host);ensureAccountShopStylesOnce();bindShopTrialDelegatedFallbackOnce();try{markDailyDiscountsSeen();}catch(_){}
try{maybeRefreshShopDynamicPrices(()=>{try{refreshAccountShop(host);}catch(_){}});}catch(_){}
try{maybeRefreshShopCloudBalance(()=>{try{refreshAccountShop(host);}catch(_){}});}catch(_){}
const options=opts&&typeof opts==="object"?opts:{};const previousBrowse=options.preserveOpen===false?{selectedCategory:"",page:1}:readShopBrowseState(host);const preservedOpen=options.preserveOpen===false?new Set():(options.openCategories instanceof Set?options.openCategories:openShopCategories(host));let focusKey=String(options.focusKey||"");if(!focusKey)try{const active=document.activeElement;if(active&&host.contains(active))focusKey=String(active.getAttribute("data-shop-browse-focus")||"");}catch(_){}
host.innerHTML="";const score=readWarmAccountXpSnapshot()||{};const currency=accountCurrencySummary(score);const profile=readLocalProfile()||{};const hasAccount=!!profile.accountKey;const card=el("div","mk-account-shop-card");const hero=el("div","mk-account-shop-hero");const copy=el("div","mk-account-shop-main");copy.innerHTML=`<div class="mk-account-shop-heading"><div class="mk-account-shop-kicker">${escapeHtml(currency.name)} store</div><details class="mk-account-shop-info"><summary aria-label="About the store" title="About the store">i</summary><div class="mk-account-shop-info-panel">${escapeHtml(currency.name)} come from study activity and sync with your account. Core study tools stay free. Store items are optional visuals or boosts. Items using the same slot replace each other. Try starts a 2-minute preview, once per item per day.</div></details></div>`;const balance=el("div","mk-account-shop-balance");balance.innerHTML=`<strong>${commentSvgIcon("eorbit", 18)}${escapeHtml(formatEorbits(currency.balance))}</strong><span>${escapeHtml(currency.name)} available</span>`;hero.appendChild(copy);hero.appendChild(balance);card.appendChild(hero);const api=window.MkAccountData||null;const catalog=api&&typeof api.shopCatalog==="function"?api.shopCatalog():[];const inventory=api&&typeof api.getShopInventory==="function"?api.getShopInventory():{owned:{},equipped:{},activeBoosts:{active:[]},activeTrials:[]};try{if(api&&typeof api.getActiveShopTrials==="function")inventory.activeTrials=api.getActiveShopTrials();}catch(_){}
const items=(catalog&&catalog.length?catalog:[{id:"local_map_3d",title:"3D View",price:500,category:"Map effects",description:"Adds a rotatable 3D view to concept maps."}]).filter((item)=>item&&!item.free&&Number(item.price||0)>0);if(items.some((item)=>item&&item.randomEmojiBundle)&&!__commentEmojiDataReady)ensureShopBrowseEmojiData(host);const activeBoostForItem=(itemId)=>inventory&&inventory.activeBoosts&&Array.isArray(inventory.activeBoosts.active)?inventory.activeBoosts.active.find((b)=>String(b.itemId||"")===String(itemId||"")):null;const itemById=new Map(items.map((it)=>[String(it&&it.id||""),it]).filter((pair)=>pair[0]));const activeTrialForSlot=(slot)=>{const wanted=String(slot||"").trim();if(!wanted||!(inventory&&Array.isArray(inventory.activeTrials)))return null;return inventory.activeTrials.find((row)=>{if(!row||row.muted||Number(row.expiresAt||0)<=Date.now())return false;const it=itemById.get(String(row.itemId||""));return it&&String(it.slot||"").trim()===wanted;})||null;};const isOwnedItem=(item)=>{const itemId=String(item&&item.id||"").trim();if(!itemId)return false;if(item&&item.consumable)return!!activeBoostForItem(itemId);return!!(inventory&&inventory.owned&&inventory.owned[itemId]);};const DISCOUNT_CAT="__mk_daily_discounts__";const OWNED_CAT="__mk_owned__";const discountInfo=(api&&typeof api.dailyDiscounts==="function")?api.dailyDiscounts():null;const discountMap=discountInfo&&typeof discountInfo==="object"?(discountInfo.map||{}):{};const model=buildShopDisplayModel(items,isOwnedItem,discountMap);const byCat=model.byCat;const discountedItems=byCat.get(DISCOUNT_CAT);const cats=[...model.groups.map((group)=>group.key),"__mk_all__",OWNED_CAT];const catLabel=(cat)=>{const group=model.groups.find((entry)=>entry.key===cat);return group?group.label:cat==="__mk_all__"?"All items":shopCategoryDisplayLabel(cat);};const selectedFromSet=(()=>{if(typeof options.selectedCategory==="string"&&byCat.has(options.selectedCategory))return options.selectedCategory;for(const c of preservedOpen||[])if(byCat.has(c))return c;return"";})();const selectedCat=selectedFromSet||cats.find((cat)=>(byCat.get(cat)||[]).length)||cats[0];const selectedTop=cats.includes(selectedCat)?selectedCat:model.parentByCategory.get(selectedCat)||"__mk_all__";const pageState=shopBrowsePage(byCat.get(selectedCat),options.page!=null?options.page:previousBrowse.selectedCategory===selectedCat?previousBrowse.page:1);card.setAttribute("data-shop-selected",selectedCat);card.setAttribute("data-shop-page",String(pageState.page));const tabs=el("div","mk-account-shop-tabs mk-account-shop-browse-tabs");tabs.setAttribute("role","group");tabs.setAttribute("aria-label","Store collections");cats.forEach((cat)=>{const active=selectedCat!==DISCOUNT_CAT&&cat===selectedTop;const tab=el("button","mk-account-shop-category-tab"+(active?" is-active":""),"");tab.type="button";tab.setAttribute("data-shop-category",cat);tab.setAttribute("data-shop-browse-focus",`collection:${cat}`);tab.setAttribute("aria-pressed",active?"true":"false");tab.innerHTML=`<span>${escapeHtml(catLabel(cat))}</span><small class="mk-account-shop-browse-count">${(byCat.get(cat) || []).length} items</small>`;tab.addEventListener("click",(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}
renderAccountShop(host,{selectedCategory:cat,page:1,focusKey:`collection:${cat}`});});tabs.appendChild(tab);});card.appendChild(tabs);const panel=el("div","mk-account-shop-panel");const panelHead=el("div","mk-account-shop-panel-head");const panelCopy=el("div","");const selectedHint=(()=>{const group=model.groups.find((entry)=>entry.key===selectedCat);if(group)return group.description;if(selectedCat==="__mk_all__")return"Browse every available item. Your unlocked items appear first.";if(selectedCat===OWNED_CAT)return"Your unlocked visuals and currently active boosts.";if(selectedCat===DISCOUNT_CAT)return"Today's offers, with the same prices shown throughout the store.";const rows=byCat.get(selectedCat)||[];const hit=rows.find((row)=>String(row&&row.categoryHint||"").trim());return hit?String(hit.categoryHint||"").trim():"";})();panelCopy.innerHTML=`<div class="mk-account-shop-panel-title"><span>${escapeHtml(catLabel(selectedCat))}</span></div>${selectedHint ? `<p class="mk-account-shop-browse-description">${escapeHtml(selectedHint)}</p>` : ""}`;panelHead.appendChild(panelCopy);if(discountedItems.length){const deals=el("button","mk-account-shop-browse-deals"+(selectedCat===DISCOUNT_CAT?" is-active":""),"Today's discounts");deals.type="button";deals.setAttribute("aria-pressed",selectedCat===DISCOUNT_CAT?"true":"false");deals.setAttribute("data-shop-browse-focus","discounts");deals.addEventListener("click",()=>renderAccountShop(host,{selectedCategory:DISCOUNT_CAT,page:1,focusKey:"discounts"}));panelHead.appendChild(deals);}
panel.appendChild(panelHead);if(selectedCat!==OWNED_CAT&&selectedCat!==DISCOUNT_CAT){const group=model.groups.find((entry)=>entry.key===selectedTop);const filterCategories=(group?group.categories:model.categories).filter((cat)=>byCat.has(cat));const filterLabel=el("label","mk-account-shop-browse-filter");filterLabel.appendChild(el("span","","Item type"));const filter=el("select","mk-account-shop-browse-select");filter.setAttribute("data-shop-browse-focus","filter");const all=el("option","",group?"All in this collection":"All item types");all.value=selectedTop;filter.appendChild(all);filterCategories.forEach((cat)=>{const option=el("option","",`${shopCategoryDisplayLabel(cat)} (${byCat.get(cat).length})`);option.value=cat;filter.appendChild(option);});filter.value=byCat.has(selectedCat)&&filterCategories.includes(selectedCat)?selectedCat:selectedTop;filter.addEventListener("change",()=>renderAccountShop(host,{selectedCategory:filter.value,page:1,focusKey:"filter"}));filterLabel.appendChild(filter);panel.appendChild(filterLabel);}
const grid=el("div","mk-account-shop-grid");const renderShopItem=(item)=>{const itemId=String(item.id||"").trim();if(!itemId)return;const isConsumable=!!item.consumable;const activeBoost=isConsumable?activeBoostForItem(itemId):null;const owned=!isConsumable&&!!(inventory&&inventory.owned&&inventory.owned[itemId]);const activeTrial=!isConsumable&&inventory&&Array.isArray(inventory.activeTrials)?inventory.activeTrials.find((row)=>String(row.itemId||"")===itemId&&Number(row.expiresAt||0)>Date.now()):null;const activeSlotTrial=!isConsumable&&item.slot?activeTrialForSlot(item.slot):null;const activeSlotTrialId=activeSlotTrial?String(activeSlotTrial.itemId||""):"";const rawEquipped=inventory&&inventory.equipped&&item.slot&&String(inventory.equipped[item.slot]||"")===itemId;const equipped=!!(rawEquipped&&!(activeSlotTrialId&&activeSlotTrialId!==itemId));const basePrice=Math.max(0,Number(item.basePrice!=null?item.basePrice:item.price||0)||0);const originalPrice=Math.max(0,Number(item.dynamicPrice!=null?item.dynamicPrice:basePrice)||0);const price=Math.max(0,Number(item.effectivePrice!=null?item.effectivePrice:item.price||0)||0);const discountPercent=Math.max(0,Number(item.discountPercent||0)||0);const discountPriceMarkup=accountShopDiscountPriceMarkup(discountPercent,originalPrice,price);const canAfford=Number(currency.balance||0)+1e-9>=price;const canAttemptPurchase=canAfford||hasAccount;const isRandomEmojiBundle=!!item.randomEmojiBundle;const randomEmojiCandidate=isRandomEmojiBundle?randomLockedEmojiBundleCandidate():null;const tile=el("div","mk-account-shop-tile mk-account-shop-item"+(owned?" is-owned":"")+(activeBoost||activeTrial?" is-active-boost":"")+(equipped?" is-equipped":"")+(discountPercent>0?" is-discounted":""));try{tile.setAttribute("data-shop-item-id",itemId);tile.setAttribute("data-shop-slot",String(item.slot||""));}catch(_){}
applyShopThemePreview(tile,item,api);applyShopFontPreview(tile,item,api);const activeText=activeBoost&&activeBoost.expiresAt?`Active until ${new Date(Number(activeBoost.expiresAt)).toLocaleString("en-US")}`:"";const badges=[];if(activeTrial)badges.push(`<span class="mk-account-shop-pill mk-account-shop-pill--active">Preview · <span class="mk-account-shop-inline-remaining" data-expires-at="${escapeAttr(String(activeTrial.expiresAt || 0))}"></span></span>`);const categoryLine=shopCategoryDisplayLabel(item.category||"Store item");tile.innerHTML=`<div class="mk-account-shop-item-head"><div class="mk-account-shop-item-title"><strong>${escapeHtml(item.title || itemId)}</strong><span class="mk-account-shop-meta">${escapeHtml(categoryLine)}</span></div><div class="mk-account-shop-card-badges">${badges.join("")}</div></div><small>${escapeHtml(item.description || "Unlock this account item.")}</small>${activeText ? `<small class="mk-account-shop-active-note">${escapeHtml(activeText)}</small>` : ""}`;appendShopRankingPreview(tile,item,false);appendShopCommentPreview(tile,item,false);appendShopCursorPreview(tile,item,false);appendShopSeriesPreview(tile,item);const actions=el("div","mk-account-shop-item-actions");const addToggle=(label,isOn,onClick,disabled,title)=>{const switchOnly=label==="On"||label==="Off";const toggle=el("button","mk-account-shop-toggle"+(switchOnly?" mk-account-shop-toggle--switch":"")+(isOn?" is-on":"")+(disabled?" is-disabled":""),"");toggle.type="button";toggle.disabled=!!disabled;toggle.title=title||"";if(switchOnly){toggle.setAttribute("aria-label",title||(isOn?"Turn this item off.":"Turn this item on."));toggle.setAttribute("aria-pressed",isOn?"true":"false");toggle.innerHTML="";}else{toggle.innerHTML=`<span>${escapeHtml(label)}</span><i class="mk-account-shop-toggle-knob" aria-hidden="true"></i>`;}
if(!disabled&&typeof onClick==="function")toggle.addEventListener("click",(ev)=>{try{if(ev&&typeof ev.preventDefault==="function")ev.preventDefault();}catch(_){}
try{if(ev&&typeof ev.stopPropagation==="function")ev.stopPropagation();}catch(_){}
try{if(ev&&typeof ev.stopImmediatePropagation==="function")ev.stopImmediatePropagation();}catch(_){}
try{toggle.setAttribute("data-mk-shop-handled-at",String(Date.now()));}catch(_){}
return onClick(ev);});actions.appendChild(toggle);return toggle;};const afterPurchase=(verb)=>(res)=>{if(!res||res.ok===false){const err=(res&&res.error)||"";let msg;if(err==="price_changed"){msg=`The price has changed to ${formatEorbits(Number(res.price))} ${currency.name}.\nYour account has not been charged. Review the updated price and choose ${verb || "Unlock"} again.`;refreshAccountShop(host);}else if(err==="insufficient_funds"){const bal=Number((res&&res.balance)||0);const price=Number((res&&res.price)||0);const need=Math.max(0,Number((res&&res.missing)||(price-bal)||0));msg=`Not enough ${currency.name}.\nYou have ${formatEorbits(bal)}, this costs ${formatEorbits(price)}${need ? `-${formatEorbits(need)}short` : ""}.`;}else if(err==="cloud_purchase_failed"){msg=`The purchase response could not be confirmed. Run Sync and check your Store and Activity before trying again.${res && res.message ? `\n\n${String(res.message).slice(0,1200)}` : ""}`;}else if(err==="purchase_recovery_not_ready"){msg=res.message||"The purchase request could not be saved for recovery. No new purchase was sent.";}else if(err==="already_owned"){msg=`You already own this item.`;}else if(err==="unknown_item"){msg=`This item is unavailable.`;}else if(err==="cloud_shop_state_not_ready"){msg=`Store balance is still syncing, so your ${currency.name} was not charged.\nRun Sync once, reopen the Store, and try again.${res && res.message ? `\n\nDetails:${String(res.message).slice(0,500)}` : ""}`;}else{msg=`${verb || "Unlock"} could not be confirmed: ${err || (res && res.message) || "unknown error"}.\nRun Sync and check your Store and Activity before trying again.`;}
window.alert(msg);return;}
try{window.dispatchEvent(new CustomEvent("mk-shop-inventory-change",{detail:{itemId,source:"shop"}}));}catch(_){}
refreshAccountShop(host);if(res.resumedPurchase&&res.cloud&&res.cloud.v2Accepted===false)window.alert("Your earlier purchase has been confirmed. You have not been charged again.");};const purchaseTitle=canAfford?`Costs ${formatEorbits(price)} ${currency.name}.`:(hasAccount?`Your cloud balance will be checked before purchase.`:`Missing ${formatEorbits(Math.max(0, price - Number(currency.balance || 0)))} ${currency.name}.`);if(!isConsumable&&owned){if(item.bgmTrack){const play=el("button","mk-comment-small-btn mk-shop-owned-bgm-play","Play");play.type="button";play.title=`Play ${item.title || "this track"} in the music player.`;play.addEventListener("click",()=>{try{window.dispatchEvent(new CustomEvent("mk:bgm-select",{detail:{itemId,autoplay:true}}));}catch(_){}});actions.appendChild(play);}else if(item.slot){addToggle(equipped?"On":"Off",!!equipped,()=>{if(!api)return;const fn=equipped?api.clearShopSlot:api.equipShopItem;if(equipped){if(typeof fn!=="function")return;fn.call(api,item.slot,{source:"shop"}).then((res)=>{if(!res||res.ok===false){window.alert("Could not turn this item off.");return;}
refreshAccountShop(host);}).catch((err)=>window.alert(String(err&&err.message||err||"Could not turn this item off.")));}else{if(typeof fn!=="function")return;fn.call(api,itemId,{source:"shop",slot:item.slot}).then((res)=>{if(!res||res.ok===false){window.alert("Could not turn this item on.");return;}
refreshAccountShop(host);}).catch((err)=>window.alert(String(err&&err.message||err||"Could not turn this item on.")));}},!(api&&typeof api.equipShopItem==="function"&&typeof api.clearShopSlot==="function"),equipped?"Turn this unlocked item off.":"Turn this unlocked item on.");}}else if(!isConsumable&&item.cosmetic){const canTrial=true;const active=!!activeTrial;const muted=!!(activeTrial&&activeTrial.muted);const label=active?(muted?"Off":"On"):"Try";const trialToggle=addToggle(label,active&&!muted,()=>{const liveApi=window.MkAccountData||api;if(!liveApi){window.setTimeout(()=>{try{const api2=window.MkAccountData||null;if(api2&&typeof api2.startShopTrial==="function"){const res2=api2.startShopTrial(itemId,{source:"shop-try-delayed"});if(!res2||res2.ok===false){if(res2&&res2.error==="trial_used_today")window.alert("Preview already used today. Try again tomorrow or unlock it.");else window.alert("This item cannot be previewed.");}
try{if(api2&&typeof api2.applyEquippedCosmetics==="function")api2.applyEquippedCosmetics();}catch(_){}}
refreshAccountShop(host);}catch(_){try{refreshAccountShop(host);}catch(__){}}},260);return;}
if(active){if(typeof liveApi.setShopTrialMuted!=="function")return;const res=liveApi.setShopTrialMuted(itemId,!muted);if(!res||res.ok===false){window.alert(muted?"Could not activate this preview.":"Could not turn this preview off.");return;}
try{if(liveApi&&typeof liveApi.applyEquippedCosmetics==="function")liveApi.applyEquippedCosmetics();}catch(_){}
refreshAccountShop(host);return;}
if(typeof liveApi.startShopTrial!=="function"){window.setTimeout(()=>{try{refreshAccountShop(host);}catch(_){}},260);return;}
const res=liveApi.startShopTrial(itemId,{source:"shop-try"});if(!res||res.ok===false){if(res&&res.error==="trial_used_today")window.alert("Preview already used today. Try again tomorrow or unlock it.");else window.alert("This item cannot be previewed.");return;}
try{if(liveApi&&typeof liveApi.applyEquippedCosmetics==="function")liveApi.applyEquippedCosmetics();}catch(_){}
if(String(item.slot||"")==="public_profile_theme"){accountShopOpenProfilePreview(host);return;}
refreshAccountShop(host);},!canTrial,active?(muted?"Resume this preview. The timer keeps running.":"Pause this preview. The timer keeps running."):(String(item.slot||"")==="public_profile_theme"?"Preview for 2 minutes and open your public profile.":"Preview here for 2 minutes."));if(trialToggle){try{trialToggle.setAttribute("data-shop-action","trial-toggle");trialToggle.setAttribute("data-shop-item-id",itemId);if(!active){trialToggle.classList.add("mk-account-shop-try-btn");const knob=trialToggle.querySelector(".mk-account-shop-toggle-knob");if(knob)knob.remove();}}catch(_){}}
if(discountPriceMarkup)actions.classList.add("mk-account-shop-item-actions--discounted");const unlockBtn=el("button","mk-comment-primary-btn"+(discountPriceMarkup?" mk-account-shop-discount-buy":""),"");unlockBtn.type="button";unlockBtn.innerHTML=discountPriceMarkup||`<span class="mk-account-shop-btn-price">${commentSvgIcon("eorbit", 12)}${escapeHtml(formatEorbits(price))}</span>`;unlockBtn.title=purchaseTitle;unlockBtn.disabled=!canAttemptPurchase||!(api&&typeof api.buyShopItem==="function");unlockBtn.addEventListener("click",()=>{if(!(api&&typeof api.buyShopItem==="function"))return;const livePricing=typeof api.shopItemPricing==="function"?api.shopItemPricing(itemId):null;const chargePrice=livePricing&&Number.isFinite(Number(livePricing.final))?Math.max(0,Number(livePricing.final)):price;const ok=window.confirm(`Unlock ${item.title || itemId} for ${formatEorbits(chargePrice)} ${currency.name}?`);if(!ok)return;api.buyShopItem(itemId,{source:"shop"}).then(afterPurchase("Unlock")).catch((err)=>window.alert(String(err&&err.message||err||"Unlock failed.")));});actions.appendChild(unlockBtn);}else if(activeBoost){}else{const verb=isConsumable?"Activate":"Unlock";const btn=el("button",(owned||activeBoost?"mk-comment-small-btn":"mk-comment-primary-btn")+(discountPriceMarkup?" mk-account-shop-discount-buy":""),"");btn.type="button";btn.innerHTML=discountPriceMarkup||`<span class="mk-account-shop-btn-price">${commentSvgIcon("eorbit", 12)}${escapeHtml(formatEorbits(price))}</span>`;btn.title=purchaseTitle;btn.disabled=!canAttemptPurchase||!(api&&typeof api.buyShopItem==="function")||(isRandomEmojiBundle&&!randomEmojiCandidate);btn.addEventListener("click",()=>{if(!(api&&typeof api.buyShopItem==="function"))return;const candidate=isRandomEmojiBundle?randomLockedEmojiBundleCandidate():null;if(isRandomEmojiBundle&&!candidate){window.alert("You have already started unlocking every emoji in the current emoji set.");return;}
const livePricing=typeof api.shopItemPricing==="function"?api.shopItemPricing(itemId):null;const chargePrice=livePricing&&Number.isFinite(Number(livePricing.final))?Math.max(0,Number(livePricing.final)):price;const ok=window.confirm(`${verb} ${item.title || itemId} for ${formatEorbits(chargePrice)} ${currency.name}?`);if(!ok)return;const extraDetails=candidate?{emojiBundleCodepoint:candidate.codepoint,emoji:candidate.emoji,emojiLabel:candidate.label||"",emojiUnlocks:[{kind:"stickerDynamic",codepoint:candidate.codepoint},{kind:"avatarDynamic",codepoint:candidate.codepoint}]}:null;api.buyShopItem(itemId,{source:"shop",extraDetails}).then(afterPurchase(verb)).catch((err)=>window.alert(String(err&&err.message||err||`${verb} failed.`)));});actions.appendChild(btn);}
if(actions.childNodes&&actions.childNodes.length)tile.appendChild(actions);tile.querySelectorAll("button").forEach((button,index)=>{button.setAttribute("data-shop-browse-focus",`item:${itemId}:${index}`);});grid.appendChild(tile);};let browsePager=null;if(!pageState.total){const empty=el("div","mk-account-shop-empty",selectedCat===OWNED_CAT?"Nothing unlocked yet.":"No items here right now.");panel.appendChild(empty);}else{pageState.items.forEach(renderShopItem);const pager=el("div","mk-account-shop-browse-pager");browsePager=pager;pager.setAttribute("role","group");pager.setAttribute("aria-label","Store pages");const status=el("span","mk-account-shop-browse-status",`${pageState.start + 1}–${Math.min(pageState.total, pageState.start + pageState.items.length)} of ${pageState.total} items · Page ${pageState.page} of ${pageState.pageCount}`);status.setAttribute("role","status");status.setAttribute("aria-live","polite");pager.appendChild(status);if(pageState.pageCount>1){[["previous","Previous",-1],["next","Next",1]].forEach(([key,label,offset])=>{const button=el("button","mk-account-shop-browse-page",label);button.type="button";button.disabled=offset<0?pageState.page===1:pageState.page===pageState.pageCount;button.setAttribute("data-shop-browse-focus",`page:${key}`);button.addEventListener("click",()=>renderAccountShop(host,{selectedCategory:selectedCat,page:pageState.page+offset,focusKey:`page:${key}`,scrollToResults:true}));pager.appendChild(button);});}
panel.appendChild(pager);panel.appendChild(grid);}
card.appendChild(panel);host.appendChild(card);scheduleShopTrialCountdowns(host);if(focusKey)try{const controls=Array.from(card.querySelectorAll("[data-shop-browse-focus]")).filter((node)=>!node.disabled);const target=controls.find((node)=>node.getAttribute("data-shop-browse-focus")===focusKey)||(focusKey.startsWith("page:")&&controls.find((node)=>String(node.getAttribute("data-shop-browse-focus")||"").startsWith("page:")))||controls.find((node)=>node.getAttribute("aria-pressed")==="true")||controls[0];if(target)try{target.focus({preventScroll:true});}catch(_){target.focus();}}catch(_){}
if(options.scrollToResults)scrollShopBrowseResults(host,browsePager);}
function accountShopDiscountPriceMarkup(discountPercent,originalPrice,price){const percent=Math.max(0,Number(discountPercent||0)||0);const original=Math.max(0,Number(originalPrice||0)||0);const current=Math.max(0,Number(price||0)||0);if(!(percent>0&&original>current))return"";return`<span class="mk-account-shop-discount-price" aria-label="${escapeAttr(formatAccountXp(percent))}% off"><span class="mk-account-shop-discount-pct">−${escapeHtml(formatAccountXp(percent))}%</span><span class="mk-account-shop-discount-values"><span class="mk-account-shop-discount-old">${commentSvgIcon("eorbit", 11)}${escapeHtml(formatEorbits(original))}</span><span class="mk-account-shop-discount-now">${commentSvgIcon("eorbit", 12)}${escapeHtml(formatEorbits(current))}</span></span></span>`;}
const QUICK_SHOP_MENU_ID="mk-quick-shop-menu";const QUICK_SHOP_STYLE_ID="mk-quick-shop-style-v3";function ensureQuickShopStylesOnce(){if(document.getElementById(QUICK_SHOP_STYLE_ID))return;const st=document.createElement("style");st.id=QUICK_SHOP_STYLE_ID;st.textContent=`
.mk-local-activity-head-actions{ display:flex; align-items:center; gap:8px; margin-left:auto; }
.mk-quick-shop-trigger,
.mk-quick-shop-h1-btn{
  appearance:none;
  border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent);
  background:color-mix(in srgb,var(--md-default-bg-color) 82%,transparent);
  color:var(--md-default-fg-color);
  border-radius:14px;
  width:2.1rem;
  min-width:2.1rem;
  height:2.1rem;
  min-height:2.1rem;
  padding:0;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  box-shadow:0 10px 22px rgba(15,23,42,.08);
  backdrop-filter:blur(10px) saturate(1.05);
  -webkit-backdrop-filter:blur(10px) saturate(1.05);
}
.mk-quick-shop-trigger:hover,
.mk-quick-shop-trigger:focus-visible,
.mk-quick-shop-h1-btn:hover,
.mk-quick-shop-h1-btn:focus-visible{
  border-color:color-mix(in srgb,var(--md-accent-fg-color) 36%,transparent);
  background:color-mix(in srgb,var(--md-accent-fg-color) 10%,var(--md-default-bg-color));
  outline:none;
}
.mk-quick-shop-trigger svg,
.mk-quick-shop-h1-btn svg{ width:1.02rem; height:1.02rem; pointer-events:none; }
.mk-h1-has-quick-shop{ display:flex !important; align-items:center !important; gap:.55rem !important; }
.mk-h1-has-quick-shop .mk-quick-shop-h1-btn{ margin-left:auto; flex:0 0 auto; }
#${QUICK_SHOP_MENU_ID}{
  position:fixed;
  z-index:2147483400;
  width:min(430px, calc(100vw - 28px));
  max-height:min(620px, calc(100dvh - 28px));
  overflow:auto;
  overscroll-behavior:contain;
  border:1px solid color-mix(in srgb,var(--md-default-fg-color) 14%,transparent);
  border-radius:16px;
  padding:10px;
  background:color-mix(in srgb,var(--md-default-bg-color) 94%,transparent);
  color:var(--md-default-fg-color);
  box-shadow:0 24px 70px rgba(15,23,42,.24);
  backdrop-filter:blur(18px) saturate(1.08);
  -webkit-backdrop-filter:blur(18px) saturate(1.08);
}
.mk-quick-shop-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:2px 2px 9px; }
.mk-quick-shop-title{ font-size:.78rem; font-weight:900; line-height:1.15; }
.mk-quick-shop-balance{ display:inline-flex; align-items:center; gap:4px; color:var(--mk-eorbit-color); font-size:.62rem; font-weight:900; white-space:nowrap; }
.mk-quick-shop-tabs{ display:flex; gap:6px; flex-wrap:wrap; padding:4px; margin-bottom:8px; border-radius:14px; background:color-mix(in srgb,var(--md-default-fg-color) 5%,transparent); }
.mk-quick-shop-tab{ appearance:none; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); border-radius:999px; background:color-mix(in srgb,var(--md-default-bg-color) 78%,transparent); color:var(--md-default-fg-color); min-height:1.42rem; padding:.18rem .48rem; font-size:.55rem; line-height:1; font-weight:850; cursor:pointer; }
.mk-quick-shop-tab.is-active{ background:linear-gradient(135deg,#ffe18a,var(--mk-eorbit-color)); border-color:color-mix(in srgb,var(--mk-eorbit-color) 74%,transparent); color:#101418; }
.mk-quick-shop-grid{ display:grid; grid-template-columns:1fr; gap:8px; }
.mk-quick-shop-item{ display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; gap:10px; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 12%,transparent); border-radius:14px; padding:9px; background:linear-gradient(145deg,color-mix(in srgb,var(--md-default-bg-color) 92%,transparent),color-mix(in srgb,var(--md-default-fg-color) 4%,var(--md-default-bg-color))); }
.mk-quick-shop-item.has-theme-preview{ min-height:5.2rem; color:#fff; background-color:#172033; background-image:linear-gradient(90deg,rgba(5,10,18,.90) 0%,rgba(5,10,18,.68) 58%,rgba(5,10,18,.24) 100%),linear-gradient(0deg,rgba(5,10,18,.62),rgba(5,10,18,.08) 62%),var(--mk-shop-theme-preview-image); background-size:cover,cover,cover; background-position:center,center,var(--mk-shop-theme-preview-position,center); background-repeat:no-repeat; border-color:rgba(255,255,255,.24); }
.mk-quick-shop-item.has-theme-preview :is(.mk-quick-shop-item-title strong,.mk-quick-shop-item-title small,.mk-quick-shop-desc){ color:#fff; text-shadow:0 1px 4px rgba(0,0,0,.90); }
.mk-quick-shop-item.has-theme-preview .mk-quick-shop-item-title small{ opacity:.82; }
.mk-quick-shop-item.has-theme-preview .mk-quick-shop-desc{ opacity:.88; }
.mk-quick-shop-item.has-theme-preview :is(.mk-account-shop-try-btn,.mk-comment-primary-btn,.mk-comment-small-btn){ border-color:rgba(255,255,255,.32) !important; background:rgba(8,15,25,.74) !important; color:#fff !important; box-shadow:0 4px 12px rgba(0,0,0,.20); backdrop-filter:blur(7px) saturate(1.08); -webkit-backdrop-filter:blur(7px) saturate(1.08); }
.mk-quick-shop-item.has-palette-preview{ min-height:5.2rem; color:var(--mk-shop-palette-preview-fg,var(--md-default-fg-color)); background:var(--mk-shop-palette-preview-bg); border-color:var(--mk-shop-palette-preview-border,color-mix(in srgb,var(--md-default-fg-color) 18%,transparent)); }
.mk-quick-shop-item.has-palette-preview :is(.mk-quick-shop-item-title strong,.mk-quick-shop-item-title small,.mk-quick-shop-desc){ color:var(--mk-shop-palette-preview-fg,var(--md-default-fg-color)); }
.mk-quick-shop-item.has-palette-preview .mk-quick-shop-item-title small,.mk-quick-shop-item.has-palette-preview .mk-quick-shop-desc{ color:var(--mk-shop-palette-preview-muted,currentColor); opacity:1; }
.mk-quick-shop-item.has-palette-preview :is(.mk-account-shop-try-btn,.mk-comment-primary-btn,.mk-comment-small-btn){ border-color:var(--mk-shop-palette-preview-border,rgba(255,255,255,.32)) !important; background:var(--mk-shop-palette-preview-control-bg,rgba(255,255,255,.80)) !important; color:var(--mk-shop-palette-preview-control-fg,var(--mk-shop-palette-preview-fg)) !important; }
.mk-quick-shop-item.has-font-preview,.mk-quick-shop-item.has-font-preview *{ font-family:var(--mk-shop-font-preview) !important; }
.mk-quick-shop-item .mk-account-shop-ranking-preview{ min-height:1.82rem !important; margin:.12rem 0 0 !important; padding:.26rem .38rem .26rem .52rem !important; border-radius:11px !important; gap:.32rem !important; }
.mk-quick-shop-item .mk-account-shop-ranking-preview .trending-user-name{ font-size:.52rem !important; }
.mk-quick-shop-item .mk-account-shop-ranking-preview .trending-rank,.mk-quick-shop-item .mk-account-shop-ranking-preview .trending-score{ font-size:.46rem !important; }
.mk-quick-shop-item .mk-account-shop-comment-preview{ min-height:3rem !important; margin:.14rem 0 0 !important; padding:.38rem .46rem .34rem .54rem !important; border-radius:11px !important; gap:.18rem !important; }
.mk-quick-shop-item .mk-account-shop-comment-preview-avatar{ width:.88rem; height:.88rem; font-size:.40rem; }
.mk-quick-shop-item .mk-account-shop-comment-preview-name,.mk-quick-shop-item .mk-account-shop-comment-preview-text{ font-size:.47rem; }
.mk-quick-shop-item .mk-account-shop-comment-preview-time,.mk-quick-shop-item .mk-account-shop-comment-preview-reactions{ font-size:.39rem; }
.mk-quick-shop-item .mk-account-shop-cursor-preview{ margin:.14rem 0 0; padding:.28rem; gap:.28rem; border-radius:11px; }
.mk-quick-shop-item .mk-account-shop-cursor-swatch{ min-height:1.84rem; padding:.22rem .28rem; gap:.26rem; border-radius:9px; }
.mk-quick-shop-item .mk-account-shop-cursor-swatch img{ width:1.18rem; height:1.18rem; }
.mk-quick-shop-item .mk-account-shop-cursor-swatch span{ font-size:.42rem; }
.mk-quick-shop-item.is-discounted:not(.is-owned):not(.is-active){ border-color:color-mix(in srgb,var(--mk-eorbit-color) 52%,transparent); }
.mk-quick-shop-item.is-owned{ border-color:color-mix(in srgb,#35d07f 46%,transparent); }
.mk-quick-shop-item.is-active{ border-color:color-mix(in srgb,#2dd4bf 62%,transparent); box-shadow:0 0 0 1px color-mix(in srgb,#2dd4bf 22%,transparent); }
.mk-quick-shop-item-main{ display:grid; gap:4px; min-width:0; }
.mk-quick-shop-item-title{ display:grid; gap:2px; min-width:0; }
.mk-quick-shop-item-title strong{ font-size:.68rem; line-height:1.12; overflow-wrap:anywhere; }
.mk-quick-shop-item-title small{ font-size:.52rem; line-height:1.18; opacity:.58; }
.mk-quick-shop-desc{ font-size:.56rem; line-height:1.25; opacity:.68; margin:0; }
.mk-quick-shop-actions{ display:flex; flex-direction:column; gap:6px; justify-content:center; align-items:stretch; }
.mk-quick-shop-actions .mk-comment-small-btn,
.mk-quick-shop-actions .mk-comment-primary-btn,
.mk-quick-shop-toggle{ min-height:1.18rem !important; height:1.18rem !important; border-radius:999px !important; padding:.08rem .42rem !important; font-size:.50rem !important; line-height:1 !important; display:inline-flex; align-items:center; justify-content:center; gap:4px; }
.mk-quick-shop-item.is-discounted .mk-quick-shop-actions .mk-account-shop-try-btn{ align-self:flex-end; width:3rem !important; min-width:3rem !important; }
.mk-quick-shop-actions .mk-account-shop-discount-buy{ min-height:1.18rem !important; height:1.18rem !important; padding:0 !important; border-radius:999px !important; overflow:hidden; border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent) !important; box-shadow:none !important; background:color-mix(in srgb,var(--md-default-fg-color) 6%,var(--md-default-bg-color)) !important; color:var(--md-default-fg-color) !important; }
.mk-quick-shop-actions .mk-account-shop-discount-buy:hover:not(:disabled){ background:color-mix(in srgb,var(--md-default-fg-color) 9%,var(--md-default-bg-color)) !important; }
.mk-quick-shop-actions .mk-account-shop-discount-buy:disabled{ opacity:.58; }
.mk-quick-shop-toggle{ border:1px solid color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); background:color-mix(in srgb,var(--md-default-bg-color) 86%,transparent); color:var(--md-default-fg-color); font-weight:850; cursor:pointer; }
.mk-quick-shop-toggle.is-on{ border-color:rgba(34,197,94,.68); background:linear-gradient(135deg,#22c55e,#06b6d4); color:#04120a; }
.mk-quick-shop-toggle.mk-quick-shop-owned-switch,
.mk-quick-shop-toggle.mk-quick-shop-preview-switch{ position:relative; width:2.08rem !important; min-width:2.08rem !important; height:1.08rem !important; min-height:1.08rem !important; padding:0 !important; justify-content:flex-start !important; overflow:hidden; font-size:0 !important; border-color:rgba(148,163,184,.62) !important; background:linear-gradient(180deg,#eef0f2,#dadde1) !important; color:transparent !important; box-shadow:inset 0 0 0 1px rgba(255,255,255,.50),0 1px 5px rgba(15,23,42,.20) !important; }
.mk-quick-shop-toggle.mk-quick-shop-owned-switch::after,
.mk-quick-shop-toggle.mk-quick-shop-preview-switch::after{ content:""; position:absolute; top:50%; left:.10rem; width:.86rem; height:.86rem; border-radius:999px; transform:translateY(-50%); background:#fff; box-shadow:0 1px 5px rgba(15,23,42,.28); transition:left .16s ease,box-shadow .16s ease; }
.mk-quick-shop-toggle.mk-quick-shop-owned-switch.is-on,
.mk-quick-shop-toggle.mk-quick-shop-preview-switch.is-on{ padding:0 !important; justify-content:flex-start !important; border-color:rgba(34,197,94,.70) !important; background:linear-gradient(180deg,#43db67,#22c55e) !important; color:transparent !important; box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),0 1px 5px rgba(15,23,42,.18) !important; }
.mk-quick-shop-toggle.mk-quick-shop-owned-switch.is-on::after,
.mk-quick-shop-toggle.mk-quick-shop-preview-switch.is-on::after{ left:calc(100% - .96rem); }
.mk-quick-shop-toggle.mk-quick-shop-preview-switch .mk-account-shop-toggle-knob{ display:none !important; }
.mk-quick-shop-toggle .mk-account-shop-inline-remaining{ color:var(--mk-eorbit-color) !important; font-weight:900; white-space:nowrap; }
.mk-quick-shop-empty{ border:1px dashed color-mix(in srgb,var(--md-default-fg-color) 18%,transparent); border-radius:14px; padding:14px; font-size:.62rem; text-align:center; opacity:.68; }
@media(max-width:560px){ #${QUICK_SHOP_MENU_ID}{ width:calc(100vw - 18px); max-height:min(560px, calc(100dvh - 18px)); padding:9px; } }
/* iOS Safari smears backdrop-filter over the full scrollHeight of a scrollable
   element, painting a translucent veil from the menu down into the bottom
   safe area. Use an opaque background with no blur on touch viewports. */
@media (max-width:720px), (pointer:coarse){
  #${QUICK_SHOP_MENU_ID}{
    background:var(--md-default-bg-color);
    -webkit-backdrop-filter:none;
    backdrop-filter:none;
    box-shadow:none;
  }
}
    `.trim();(document.head||document.documentElement).appendChild(st);}
function currentQuickShopPaletteScheme(){try{const checked=document.querySelector('input[name="__palette"]:checked');return String(checked&&checked.getAttribute("data-md-color-scheme")||"");}catch(_){return"";}}
function switchQuickShopPaletteScheme(wanted){try{const inputs=Array.prototype.slice.call(document.querySelectorAll('input[name="__palette"]'));const input=inputs.find((candidate)=>String(candidate.getAttribute("data-md-color-scheme")||"")===wanted);if(!input)return false;input.checked=true;input.dispatchEvent(new Event("change",{bubbles:true}));try{if(typeof window.__md_set==="function"){window.__md_set("__palette",{index:inputs.indexOf(input),color:{media:input.getAttribute("data-md-color-media")||"",scheme:input.getAttribute("data-md-color-scheme")||wanted,primary:input.getAttribute("data-md-color-primary")||"",accent:input.getAttribute("data-md-color-accent")||""}});}}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-quick-shop-palette-change",{detail:{scheme:wanted}}));}catch(_){}
return true;}catch(_){return false;}}
let __quickShopMenuCleanup=null;function closeQuickShopMenu(options){const menu=document.getElementById(QUICK_SHOP_MENU_ID);const anchor=menu&&menu.__mkQuickShopAnchor;const returnFocus=!!(options&&options.returnFocus&&menu&&(menu.contains(document.activeElement)||document.activeElement===anchor||options.lostMenuFocus));try{if(typeof __quickShopMenuCleanup==="function"){const cleanup=__quickShopMenuCleanup;__quickShopMenuCleanup=null;cleanup();}}catch(_){}
try{document.getElementById(QUICK_SHOP_MENU_ID)?.remove();}catch(_){}
if(returnFocus&&anchor&&anchor.isConnected){try{if(anchor.getClientRects().length)anchor.focus({preventScroll:true});}catch(_){}}}
function positionQuickShopMenu(menu,anchor){if(!menu)return;try{const rect=anchor&&anchor.getBoundingClientRect?anchor.getBoundingClientRect():null;const pad=10;const vv=window.visualViewport;const viewH=Math.round((vv&&vv.height)||window.innerHeight||0);const bottomGap=12;const heightCap=window.innerWidth<=560?560:620;const minH=220;const w=Math.min(430,Math.max(280,window.innerWidth-28));let top=rect?rect.bottom+8:72;if(viewH-bottomGap-top<minH)top=viewH-bottomGap-minH;top=Math.max(pad,top);const maxH=Math.max(160,Math.min(heightCap,viewH-bottomGap-top));let left=rect?rect.right-w:window.innerWidth-w-pad;left=Math.max(pad,Math.min(left,window.innerWidth-w-pad));menu.style.left=`${Math.round(left)}px`;menu.style.top=`${Math.round(top)}px`;menu.style.maxHeight=`${Math.round(maxH)}px`;}catch(_){}}
function openQuickShopMenu(anchor,opts){ensureQuickShopStylesOnce();ensureAccountShopStylesOnce();bindShopTrialDelegatedFallbackOnce();const existing=document.getElementById(QUICK_SHOP_MENU_ID);if(existing&&anchor&&existing.__mkQuickShopAnchor===anchor){closeQuickShopMenu();return;}
closeQuickShopMenu();const options=opts&&typeof opts==="object"?opts:{};let keyboardOpen=false;try{keyboardOpen=!!(anchor&&anchor.isConnected&&document.activeElement===anchor&&(options.focusOnOpen===true||(options.focusOnOpen!==false&&anchor.matches(":focus-visible"))));}catch(_){}
const categories=(Array.isArray(options.categories)?options.categories:[options.category||"Profile styles"]).map((x)=>String(x||"").trim()).filter(Boolean);const menu=el("div","","");menu.id=QUICK_SHOP_MENU_ID;menu.setAttribute("role","menu");menu.tabIndex=-1;try{menu.__mkQuickShopAnchor=anchor||null;}catch(_){}
document.body.appendChild(menu);let closed=false;let focusVersion=0;let pendingActionFocus=null;const onFocusChange=()=>{focusVersion+=1;pendingActionFocus=null;};const focusMenuControl=(key)=>{if(closed||!menu.isConnected)return;const controls=Array.from(menu.querySelectorAll("button, a[href], input, select, textarea, [tabindex]")).filter(node=>!node.disabled&&node.getAttribute("tabindex")!=="-1"&&node.getClientRects().length);const target=controls.find(node=>key&&node.getAttribute("data-mk-quick-focus")===key)||controls[0]||menu;try{target.focus({preventScroll:true});}catch(_){}};const render=(selectedCategory,actionFocus)=>{if(closed||!menu.isConnected)return;const focusInside=menu.contains(document.activeElement);const restoreActionFocus=actionFocus&&actionFocus.version===focusVersion&&document.activeElement===document.body;const restoreFocus=focusInside||restoreActionFocus;const focusKey=focusInside?document.activeElement.getAttribute("data-mk-quick-focus"):restoreActionFocus&&actionFocus.key;if(actionFocus===pendingActionFocus)pendingActionFocus=null;const api=window.MkAccountData||null;const score=readWarmAccountXpSnapshot()||{};const currency=accountCurrencySummary(score);const catalog=api&&typeof api.shopCatalog==="function"?api.shopCatalog():[];const inventory=api&&typeof api.getShopInventory==="function"?api.getShopInventory():{owned:{},equipped:{},activeBoosts:{active:[]},activeTrials:[]};const allowed=new Set(categories);const items=(catalog||[]).filter((item)=>item&&!item.free&&Number(item.price||0)>0&&allowed.has(String(item.category||"")));const cats=categories.filter((cat)=>items.some((item)=>String(item.category||"")===cat));const selected=cats.includes(selectedCategory)?selectedCategory:(cats[0]||categories[0]||"");const itemById=new Map(items.map((it)=>[String(it.id||""),it]).filter((row)=>row[0]));const activeTrialForSlot=(slot)=>{const wanted=String(slot||"").trim();if(!wanted||!(inventory&&Array.isArray(inventory.activeTrials)))return null;return inventory.activeTrials.find((row)=>{if(!row||row.muted)return false;const it=itemById.get(String(row.itemId||""));return it&&String(it.slot||"").trim()===wanted;})||null;};const activeBoostForItem=(itemId)=>inventory&&inventory.activeBoosts&&Array.isArray(inventory.activeBoosts.active)?inventory.activeBoosts.active.find((b)=>String(b.itemId||"")===String(itemId||"")):null;const deactivateInterfaceThemes=()=>{const liveApi=window.MkAccountData||api;if(!liveApi)return Promise.resolve();const tasks=[];const settle=(value)=>value&&typeof value.then==="function"?value.catch(()=>null):Promise.resolve(value);if(typeof liveApi.clearShopSlot==="function"){["interface_theme","interface_theme_light","interface_theme_dark"].forEach((slot)=>{if(inventory&&inventory.equipped&&inventory.equipped[slot]){tasks.push(settle(liveApi.clearShopSlot(slot,{source:"quick-shop-base-theme"})));}});}
if(typeof liveApi.setShopTrialMuted==="function"&&inventory&&Array.isArray(inventory.activeTrials)){inventory.activeTrials.forEach((row)=>{if(!row||row.muted)return;const item=itemById.get(String(row.itemId||""));const slot=String(item&&item.slot||"");if(slot==="interface_theme"||slot==="interface_theme_light"||slot==="interface_theme_dark"){tasks.push(settle(liveApi.setShopTrialMuted(String(row.itemId||""),true)));}});}
return tasks.length?Promise.all(tasks).then(()=>undefined):Promise.resolve();};menu.innerHTML="";const head=el("div","mk-quick-shop-head","");head.innerHTML=`<div class="mk-quick-shop-title">${escapeHtml(options.title || quickShopDefaultTitle(categories))}</div><div class="mk-quick-shop-balance">${commentSvgIcon("eorbit", 13)}${escapeHtml(formatEorbits(currency.balance))}</div>`;menu.appendChild(head);if(cats.length>1){const tabs=el("div","mk-quick-shop-tabs","");cats.forEach((cat)=>{const tab=el("button","mk-quick-shop-tab"+(cat===selected?" is-active":""),shopCategoryDisplayLabel(cat));tab.type="button";tab.setAttribute("data-mk-quick-focus",`category:${cat}`);tab.addEventListener("click",(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}render(cat);});tabs.appendChild(tab);});menu.appendChild(tabs);}
const grid=el("div","mk-quick-shop-grid","");const selectedItems=shopItemsOwnedFirst(items.filter((item)=>String(item.category||"")===selected),(item)=>{const itemId=String(item&&item.id||"").trim();if(!itemId)return false;if(item&&item.consumable)return!!activeBoostForItem(itemId);return!!(inventory&&inventory.owned&&inventory.owned[itemId]);});if(options.includeBaseThemes&&selected==="Interface themes"){const activeScheme=currentQuickShopPaletteScheme();[{scheme:"default",label:"Light mode",description:"Applies the built-in light interface theme."},{scheme:"slate",label:"Dark mode",description:"Applies the built-in dark interface theme."}].forEach((entry)=>{const active=activeScheme===entry.scheme;const tile=el("div","mk-quick-shop-item is-owned"+(active?" is-active":""),"");tile.innerHTML=`<div class="mk-quick-shop-item-main"><div class="mk-quick-shop-item-title"><strong>${escapeHtml(entry.label)}</strong><small>Built-in theme · Free</small></div><p class="mk-quick-shop-desc">${escapeHtml(entry.description)}</p></div>`;const actions=el("div","mk-quick-shop-actions","");const toggle=el("button","mk-quick-shop-toggle mk-quick-shop-owned-switch"+(active?" is-on":""),"");toggle.type="button";toggle.setAttribute("data-mk-quick-focus",`palette:${entry.scheme}`);toggle.setAttribute("aria-pressed",active?"true":"false");toggle.setAttribute("aria-label",active?`${entry.label} is on.`:`Turn ${entry.label} on.`);toggle.addEventListener("click",(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}
if(active)return;const focusedKey=document.activeElement===toggle&&toggle.getAttribute("data-mk-quick-focus");toggle.disabled=true;const actionFocus=focusedKey?{key:focusedKey,version:focusVersion}:null;pendingActionFocus=actionFocus;deactivateInterfaceThemes().finally(()=>{if(!switchQuickShopPaletteScheme(entry.scheme)){toggle.disabled=false;return;}
window.setTimeout(()=>render(selected,actionFocus),0);});});actions.appendChild(toggle);tile.appendChild(actions);grid.appendChild(tile);});}
if(!selectedItems.length&&!(options.includeBaseThemes&&selected==="Interface themes")){grid.appendChild(el("div","mk-quick-shop-empty","No shortcut items in this category right now."));}
selectedItems.forEach((item)=>{const itemId=String(item.id||"").trim();if(!itemId)return;const isConsumable=!!item.consumable;const activeBoost=isConsumable?activeBoostForItem(itemId):null;const owned=!isConsumable&&!!(inventory&&inventory.owned&&inventory.owned[itemId]);const activeTrial=!isConsumable&&inventory&&Array.isArray(inventory.activeTrials)?inventory.activeTrials.find((row)=>String(row.itemId||"")===itemId):null;const activeSlotTrial=!isConsumable&&item.slot?activeTrialForSlot(item.slot):null;const activeSlotTrialId=activeSlotTrial?String(activeSlotTrial.itemId||""):"";const rawEquipped=inventory&&inventory.equipped&&item.slot&&String(inventory.equipped[item.slot]||"")===itemId;const equipped=!!(rawEquipped&&!(activeSlotTrialId&&activeSlotTrialId!==itemId));const basePrice=Math.max(0,Number(item.basePrice!=null?item.basePrice:item.price||0)||0);const originalPrice=Math.max(0,Number(item.dynamicPrice!=null?item.dynamicPrice:basePrice)||0);const price=Math.max(0,Number(item.effectivePrice!=null?item.effectivePrice:item.price||0)||0);const discountPercent=Math.max(0,Number(item.discountPercent||0)||0);const discountPriceMarkup=accountShopDiscountPriceMarkup(discountPercent,originalPrice,price);const tile=el("div","mk-quick-shop-item"+(owned?" is-owned":"")+(activeTrial||equipped||activeBoost?" is-active":"")+(discountPriceMarkup?" is-discounted":""),"");applyShopThemePreview(tile,item,api);applyShopFontPreview(tile,item,api);tile.innerHTML=`<div class="mk-quick-shop-item-main"><div class="mk-quick-shop-item-title"><strong>${escapeHtml(item.title || itemId)}</strong><small>${escapeHtml(item.shortTitle || shopCategoryDisplayLabel(item.category || "Store item"))}</small></div><p class="mk-quick-shop-desc">${escapeHtml(item.description || "Unlock this visual item.")}</p></div>`;appendShopRankingPreview(tile.querySelector(".mk-quick-shop-item-main"),item,true);appendShopCommentPreview(tile.querySelector(".mk-quick-shop-item-main"),item,true);appendShopCursorPreview(tile.querySelector(".mk-quick-shop-item-main"),item,true);const actions=el("div","mk-quick-shop-actions","");const rerender=()=>{try{if(window.MkAccountData&&typeof window.MkAccountData.applyEquippedCosmetics==="function")window.MkAccountData.applyEquippedCosmetics();}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-quick-shop-change",{detail:{itemId,category:selected}}));}catch(_){}
render(selected);};if(!isConsumable&&owned&&item.slot){const toggle=el("button","mk-quick-shop-toggle mk-quick-shop-owned-switch"+(equipped?" is-on":""),"");toggle.type="button";toggle.setAttribute("data-mk-quick-focus",`item:${itemId}:toggle`);toggle.setAttribute("aria-pressed",equipped?"true":"false");toggle.setAttribute("aria-label",equipped?"Turn this unlocked item off.":"Turn this unlocked item on.");toggle.title=equipped?"Turn this unlocked item off.":"Turn this unlocked item on.";toggle.addEventListener("click",()=>{const liveApi=window.MkAccountData||api;if(!liveApi)return;const p=equipped?(typeof liveApi.clearShopSlot==="function"?liveApi.clearShopSlot(item.slot,{source:"quick-shop"}):null):(typeof liveApi.equipShopItem==="function"?liveApi.equipShopItem(itemId,{source:"quick-shop",slot:item.slot}):null);if(p&&typeof p.then==="function")p.then((res)=>{if(!res||res.ok===false)window.alert("Could not update this item.");else rerender();}).catch((err)=>window.alert(String(err&&err.message||err||"Could not update this item.")));});actions.appendChild(toggle);}else if(!isConsumable&&item.cosmetic){const muted=!!(activeTrial&&activeTrial.muted);const tryBtn=el("button","mk-account-shop-toggle mk-quick-shop-toggle"+(activeTrial&&!muted?" is-on":"")+(!activeTrial?" mk-account-shop-try-btn":""),"");tryBtn.setAttribute("data-mk-quick-focus",`item:${itemId}:trial`);tryBtn.type="button";tryBtn.title=activeTrial?(muted?"Resume this preview. The timer keeps running.":"Pause this preview. The timer keeps running."):"Preview here for 2 minutes.";if(activeTrial){tryBtn.classList.add("mk-quick-shop-preview-switch");tryBtn.setAttribute("aria-label",muted?"Resume this preview. The timer keeps running.":"Pause this preview. The timer keeps running.");tryBtn.setAttribute("aria-pressed",muted?"false":"true");tryBtn.innerHTML="";}else{tryBtn.innerHTML=`<span>Try</span>`;}
tryBtn.addEventListener("click",()=>{const liveApi=window.MkAccountData||api;if(!liveApi)return;let res=null;if(activeTrial&&typeof liveApi.setShopTrialMuted==="function")res=liveApi.setShopTrialMuted(itemId,!muted);else if(typeof liveApi.startShopTrial==="function")res=liveApi.startShopTrial(itemId,{source:"quick-shop"});if(!res||res.ok===false){if(res&&res.error==="trial_used_today")window.alert("Preview already used today. Try again tomorrow or unlock it.");else window.alert("This item cannot be previewed.");return;}
rerender();});actions.appendChild(tryBtn);const buy=el("button","mk-comment-primary-btn"+(discountPriceMarkup?" mk-account-shop-discount-buy":""),"");buy.type="button";buy.setAttribute("data-mk-quick-focus",`item:${itemId}:buy`);buy.innerHTML=discountPriceMarkup||`<span class="mk-account-shop-btn-price">${commentSvgIcon("eorbit", 12)}${escapeHtml(formatEorbits(price))}</span>`;buy.addEventListener("click",()=>{const liveApi=window.MkAccountData||api;if(!(liveApi&&typeof liveApi.buyShopItem==="function"))return;const livePricing=typeof liveApi.shopItemPricing==="function"?liveApi.shopItemPricing(itemId):null;const chargePrice=livePricing&&Number.isFinite(Number(livePricing.final))?Math.max(0,Number(livePricing.final)):price;if(!window.confirm(`Unlock ${item.title || itemId} for ${formatEorbits(chargePrice)} ${currency.name}?`))return;liveApi.buyShopItem(itemId,{source:"quick-shop"}).then((res)=>{if(!res||res.ok===false){window.alert(res&&res.error==="insufficient_funds"?`Not enough ${currency.name}.`:"Unlock failed.");return;}
rerender();}).catch((err)=>window.alert(String(err&&err.message||err||"Unlock failed.")));});actions.appendChild(buy);}
if(actions.childNodes&&actions.childNodes.length)tile.appendChild(actions);grid.appendChild(tile);});menu.appendChild(grid);scheduleShopTrialCountdowns(menu);positionQuickShopMenu(menu,anchor);if(restoreFocus)focusMenuControl(focusKey);};render(options.selectedCategory||"");let listenersBound=false;const cleanup=()=>{closed=true;pendingActionFocus=null;if(listenersBound){try{document.removeEventListener("click",onDoc,true);}catch(_){}
try{document.removeEventListener("keydown",onKey,true);}catch(_){}
try{document.removeEventListener("focusin",onFocusChange,true);}catch(_){}
listenersBound=false;}
if(__quickShopMenuCleanup===cleanup)__quickShopMenuCleanup=null;};const onDoc=(ev)=>{focusVersion+=1;pendingActionFocus=null;const t=ev&&ev.target;if(t&&menu.contains(t))return;if(anchor&&anchor.contains&&anchor.contains(t))return;closeQuickShopMenu();};const onKey=(ev)=>{if(ev&&ev.key==="Tab"){focusVersion+=1;pendingActionFocus=null;}
if(!ev||ev.key!=="Escape"||ev.defaultPrevented)return;const focused=document.activeElement;if(focused&&!menu.contains(focused)&&focused.closest('[role="dialog"][aria-modal="true"]'))return;ev.preventDefault();ev.stopPropagation();closeQuickShopMenu({returnFocus:true,lostMenuFocus:!!(focused===document.body&&pendingActionFocus&&pendingActionFocus.version===focusVersion)});};__quickShopMenuCleanup=cleanup;if(keyboardOpen)focusMenuControl();setTimeout(()=>{if(closed||!menu.isConnected)return;document.addEventListener("click",onDoc,true);document.addEventListener("keydown",onKey,true);document.addEventListener("focusin",onFocusChange,true);listenersBound=true;},0);window.setTimeout(()=>{if(!closed&&menu.isConnected)positionQuickShopMenu(menu,anchor);},80);}
function openQuickShopFromEvent(ev){const detail=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:{};const anchor=detail.anchor&&detail.anchor.nodeType===1?detail.anchor:(ev&&ev.target&&ev.target.nodeType===1?ev.target:null);openQuickShopMenu(anchor,{categories:detail.categories||[detail.category||"Profile styles"],title:detail.title||"",includeBaseThemes:detail.includeBaseThemes===true});}
function mountAccountHistoryRecovery(host,section,options={}){if(!document.getElementById("mk-account-history-recovery-style")){const style=el("style");style.id="mk-account-history-recovery-style";style.textContent=`
.mk-account-sync-card .mk-account-history-recovery{min-width:0;padding:1rem;border:1px solid var(--md-default-fg-color--lighter);border-left:3px solid var(--mk-theme-link-color,var(--md-accent-fg-color));border-radius:12px;background:var(--md-default-bg-color);color:var(--md-default-fg-color);font-size:var(--mk-local-body-size,.72rem);line-height:1.55}
.mk-account-history-recovery[hidden],.mk-account-history-recovery [hidden]{display:none!important}
.mk-account-sync-card [data-sync-history-review][hidden]{display:none!important}
.mk-account-history-recovery .mk-history-recovery-title{margin:0 0 .45rem;font-size:1.08em;font-weight:750;line-height:1.35}
.mk-account-history-recovery .mk-history-recovery-copy{margin:.5rem 0;overflow-wrap:anywhere}
.mk-account-history-recovery .mk-history-recovery-list{margin:.65rem 0;padding-left:1.1rem}
.mk-account-history-recovery .mk-history-recovery-list li{margin:.45rem 0;overflow-wrap:anywhere}
.mk-account-history-recovery .mk-history-recovery-archive{padding:.65rem .75rem;border-radius:8px;background:var(--md-code-bg-color);overflow-wrap:anywhere}
.mk-account-history-recovery .mk-history-recovery-actions{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.75rem}
.mk-account-history-recovery .mk-history-recovery-button{max-width:100%;min-height:36px;padding:.5rem .7rem;border:1px solid var(--md-default-fg-color--lighter);border-radius:8px;background:var(--md-default-bg-color);color:var(--md-default-fg-color);font:inherit;font-weight:650;line-height:1.4;text-align:left;white-space:normal;cursor:pointer}
.mk-account-history-recovery .mk-history-recovery-button:hover:not(:disabled){border-color:var(--mk-theme-link-color,var(--md-accent-fg-color));color:var(--mk-theme-link-color,var(--md-accent-fg-color))}
.mk-account-history-recovery .mk-history-recovery-button:focus-visible{outline:2px solid var(--mk-theme-link-color,var(--md-accent-fg-color));outline-offset:3px}
.mk-account-history-recovery .mk-history-recovery-button:disabled{opacity:.55;cursor:wait}
.mk-account-history-recovery .mk-history-recovery-button--primary{border-color:var(--mk-theme-link-color,var(--md-accent-fg-color));font-weight:750}
.mk-account-history-recovery .mk-history-recovery-status{margin:.6rem 0 0;overflow-wrap:anywhere}
@media(pointer:coarse){.mk-account-history-recovery .mk-history-recovery-button{min-height:44px}}
`;document.head.appendChild(style);}
const box=el("div","mk-account-history-recovery");box.hidden=true;box.setAttribute("role","region");box.setAttribute("aria-label","Local history recovery");const heading=el("h3","mk-history-recovery-title","Local history needs review");const guide=el("p","mk-history-recovery-copy","This browser has quiz or mastery history that cannot be fully read. Close quizzes in other tabs, then choose a recovery action below. The original is saved and verified in this browser before readable records are repaired. You can download a separate copy first.");const list=el("ul","mk-history-recovery-list");const archive=el("p","mk-history-recovery-archive");const privacy=el("p","mk-history-recovery-copy","Downloads contain your personal learning history and stay on your device. Unreadable parts are kept only in this browser's recovery archive; download it before clearing browser data or moving devices. A later Sync now syncs readable records, not the unreadable parts.");const actions=el("div","mk-history-recovery-actions");const button=(name,action)=>{const node=el("button","mk-history-recovery-button",name);node.type="button";node.setAttribute("data-history-recovery-action",action);actions.appendChild(node);return node;};const repairAndSync=button("Preserve original, repair & retry sync","repair-sync");repairAndSync.classList.add("mk-history-recovery-button--primary");const download=button("Download original history","original");const repair=button("Preserve original & repair readable history","repair");const downloadArchive=button("Download recovery archive","archive");const review=button("Review again","review");const status=el("p","mk-history-recovery-status");status.setAttribute("role","status");status.setAttribute("aria-live","polite");status.setAttribute("aria-atomic","true");[heading,guide,list,archive,privacy,actions,status].forEach(node=>box.appendChild(node));host.appendChild(box);const context=captureSocialAccountContext();const page=currentPath();const listeners=[];let snapshot=null,issueCount=0,archiveCount=0,busy=false,destroyed=false,generation=0;const listen=(target,type,fn)=>{target.addEventListener(type,fn);listeners.push(()=>target.removeEventListener(type,fn));};const destroy=()=>{if(destroyed)return;destroyed=true;generation++;snapshot=null;listeners.splice(0).forEach(remove=>remove());box.innerHTML="";box.hidden=true;};const current=()=>{if(destroyed)return false;if(!box.isConnected||!socialAccountContextIsCurrent(context)||currentPath()!==page){destroy();return false;}
return true;};const controls=()=>{box.setAttribute("aria-busy",String(busy));download.hidden=repair.hidden=issueCount===0;download.disabled=repair.disabled=busy||!snapshot;repairAndSync.hidden=issueCount===0||typeof options.onRetrySync!=="function";repairAndSync.disabled=busy||!snapshot;downloadArchive.hidden=archiveCount===0;downloadArchive.disabled=review.disabled=busy;};const messageFor=(result,fallback)=>String(result&&result.error||fallback);const invalidate=(message)=>{generation++;busy=false;snapshot=null;status.textContent=message;controls();};const inspect=async(reviewOptions={})=>{if(!current()||busy)return;const token=++generation;busy=true;snapshot=null;if(reviewOptions.reveal)box.hidden=false;status.textContent="Reviewing local history…";controls();try{const api=window.MkAccountData;if(!api||typeof api.inspectLegacyHistoryRecovery!=="function")throw new Error("History review is not available yet. Reload this page, then try again.");const result=await api.inspectLegacyHistoryRecovery();if(!current()||token!==generation)return;if(!result||!result.ok)throw new Error(messageFor(result,"Could not review local history. Nothing was repaired."));const issues=Array.isArray(result.issues)?result.issues:[];snapshot=result.snapshot;issueCount=issues.length;archiveCount=Math.max(0,Number(result.archiveCount)||0);list.innerHTML="";issues.forEach(issue=>{const readable=Math.max(0,Number(issue.validRecords)||0);const unreadable=issue.unreadableRecords==null?"unreadable count cannot be determined":`${Math.max(0, Number(issue.unreadableRecords) || 0)} unreadable records`;list.appendChild(el("li","",`${issue.label || issue.key || "Local history"}: ${readable} readable records; ${unreadable}. ${issue.reason || "This history could not be fully read."}`));});heading.textContent=issueCount?"Local history needs review":"Original history is preserved locally";guide.hidden=list.hidden=issueCount===0;privacy.hidden=issueCount===0&&archiveCount===0;archive.hidden=archiveCount===0;archive.textContent=`${archiveCount} original history ${archiveCount === 1 ? "copy is" : "copies are"} preserved in this browser. This archive is not uploaded by Sync. Its unreadable records still need recovery.`;box.hidden=issueCount===0&&archiveCount===0&&!reviewOptions.reveal;status.textContent=reviewOptions.message||(issueCount?"Nothing has been repaired. Choose an action after reviewing the records above.":archiveCount?"Keep a downloaded archive for any further recovery.":"No unreadable local history was found.");if(!issueCount&&!archiveCount)heading.textContent="Local history review";}catch(error){if(!current()||token!==generation)return;box.hidden=false;status.textContent=`${error && error.message || error} Select Review again to retry.`;}finally{if(current()&&token===generation){busy=false;controls();if(reviewOptions.focus&&!box.hidden){try{section.open=true;box.tabIndex=-1;box.focus({preventScroll:true});box.scrollIntoView({block:"nearest",behavior:"instant"});}catch(_){}}}}};const exportHistory=async(original)=>{if(!current()||busy||original&&!snapshot)return;const token=++generation,reviewed=snapshot;busy=true;status.textContent="Preparing your local history download…";controls();try{const api=window.MkAccountData;if(!api||typeof api.exportLegacyHistoryRecovery!=="function")throw new Error("History download is not available yet.");const result=await api.exportLegacyHistoryRecovery(original?reviewed:undefined);if(!current()||token!==generation)return;if(!result||!result.ok||typeof result.text!=="string")throw new Error(messageFor(result,"Could not prepare the history download."));const url=URL.createObjectURL(new Blob([result.text],{type:"application/json;charset=utf-8"}));const link=el("a");link.href=url;link.download=original?"eor-original-history.json":"eor-history-recovery-archive.json";document.body.appendChild(link);try{link.click();}finally{link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);}
status.textContent="Download requested. Check your browser's downloads and keep this personal history file safely. No data was uploaded.";}catch(error){if(!current()||token!==generation)return;snapshot=null;status.textContent=`${error && error.message || error} Select Review again before another attempt.`;}finally{if(current()&&token===generation){busy=false;controls();}}};listen(download,"click",()=>exportHistory(true));listen(downloadArchive,"click",()=>exportHistory(false));listen(review,"click",()=>inspect({reveal:true}));const repairHistory=async(retrySync)=>{if(!current()||busy||!snapshot||!issueCount)return;const token=++generation,reviewed=snapshot;busy=true;status.textContent="Preserving the original history before repairing readable records…";controls();try{const api=window.MkAccountData;if(!api||typeof api.recoverLegacyHistory!=="function")throw new Error("History repair is not available yet.");const result=await api.recoverLegacyHistory(reviewed);if(!current()||token!==generation)return;if(!result||!result.ok)throw new Error(messageFor(result,"History repair could not finish."));snapshot=null;busy=false;await inspect({reveal:true,message:`Preserved ${Math.max(0, Number(result.archived) || 0)} original history copies and checked ${Math.max(0, Number(result.recoveredRecords) || 0)} readable records. No sync was started. Download the recovery archive, then use Sync now for readable records. Unreadable parts have not been recovered.`});if(current()&&retrySync&&typeof options.onRetrySync==="function"){if(!snapshot||issueCount){status.textContent+=" Sync was not retried because the history review is not clear yet.";}else{const started=options.onRetrySync();status.textContent=started&&started.ok===false?`The original was preserved and readable history repaired. ${started.error || "Use Sync now when the current operation finishes."}`:"The original was preserved and readable history repaired. Sync retry started; follow the progress above. Unreadable parts remain in the recovery archive and are not uploaded.";}}
if(current()&&(document.activeElement===repair||document.activeElement===repairAndSync)){status.tabIndex=-1;status.focus();}}catch(error){if(!current()||token!==generation)return;snapshot=null;status.textContent=`${error && error.message || error} Select Review again before another repair attempt.`;}finally{if(current()&&token===generation){busy=false;controls();}}};listen(repair,"click",()=>repairHistory(false));listen(repairAndSync,"click",()=>repairHistory(true));const contextChanged=()=>{if(!current())return;};const historyChanged=()=>{if(!current()||busy||box.hidden)return;invalidate("Local history changed after this review. Select Review again before downloading originals or repairing.");};listen(section,"toggle",()=>{if(section.open)inspect();});["mk-account-workspace-changed","mk-account-login-change"].forEach(type=>listen(window,type,contextChanged));["mk-ai-quiz-sessions-changed","mk:mastery-submitted","mk-account-data-changed","mk-account-history-repaired"].forEach(type=>listen(window,type,historyChanged));listen(window,"storage",event=>{if(!current())return;if(!event.key||["concept_mastery_v1","concept_quiz_sessions_v1","mk_account_data_file_v1","mk_account_pending_events_v1","mk_account_history_recovery_v1"].includes(event.key))historyChanged();});listen(window,"pagehide",destroy);controls();return{refresh:inspect,destroy};}
function disposeAccountHistoryRecovery(host){if(host&&typeof host.__mkAccountHistoryRecoveryCleanup==="function"){host.__mkAccountHistoryRecoveryCleanup();delete host.__mkAccountHistoryRecoveryCleanup;}}
function renderProfileInfo(host){if(!host)return;disposeAccountHistoryRecovery(host);ensureAccountShopStylesOnce();bindShopTrialDelegatedFallbackOnce();try{host.querySelectorAll(".mk-local-level-badge").forEach((btn)=>{if(btn&&typeof btn.__mkAccountXpCleanup==="function")btn.__mkAccountXpCleanup();});}catch(_){}
host.innerHTML="";const profile=readLocalProfile();const refreshInfo=()=>renderProfileInfo(host);if(!profile.accountKey){renderGuestAccountOnboarding(host,profile,refreshInfo);return;}
const wrap=el("div","mk-local-profile-card mk-account-profile-stack");const profileBlock=el("div","mk-account-profile-card");const row=el("div","mk-local-profile-main-row");const avatarCell=el("div","mk-local-profile-avatar-cell");const avatarBox=el("div","mk-local-profile-avatarbox");avatarBox.innerHTML=avatarHtml(profile.name||"You",profile.avatar||"",profile.avatarFrame||"level-1");avatarCell.appendChild(avatarBox);const identityCell=el("div","mk-local-profile-identity-cell");const nameCell=el("div","mk-local-profile-name-cell");const nameBox=el("div","mk-local-profile-name",profile.name||"No username yet");const levelBtn=el("button","mk-local-level-badge");levelBtn.type="button";levelBtn.setAttribute("aria-label","Open level, XP and EORbits details");levelBtn.innerHTML=`<span class="mk-local-level-badge-fill" style="width:0%"></span><strong>Lv. …</strong><span class="mk-local-level-badge-xp">XP</span>`;levelBtn.addEventListener("click",(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}openAccountLevelModal();});const currencyBtn=el("button","mk-local-inline-change mk-account-currency-btn mk-account-qr-beside-xp","…");currencyBtn.type="button";currencyBtn.setAttribute("aria-label","Open EORbits store");currencyBtn.title="Open EORbits store";const paintCurrencyButton=(score)=>{const c=accountCurrencySummary(score||null);currencyBtn.innerHTML=`<span class="mk-account-currency-icon">${commentSvgIcon("eorbit", 16)}</span><span class="mk-account-currency-amount">${escapeHtml(formatEorbits(c.balance))}</span>`;currencyBtn.title=`${formatEorbits(c.balance)} ${c.name} available. Open store.`;};const paintLevelBadge=(score)=>{if(!score)return;if(accountProgressSyncHealth().initialPending){levelBtn.innerHTML=`<strong>Lv. —</strong><span class="mk-local-level-badge-xp">History syncing</span>`;levelBtn.title="Your level will appear after account history has synced.";paintCurrencyButton(score);return;}
const s=accountScoreSummary(score);const pct=Math.max(0,Math.min(100,Number(s.progressPct||0)));levelBtn.title=s.nextLevel?`${formatAccountXp(s.intoLevel)} / ${formatAccountXp(s.levelSpan)} XP in Level ${s.level}`:`${formatAccountXp(s.totalScore)} XP total`;levelBtn.innerHTML=`<span class="mk-local-level-badge-fill" style="width:${escapeAttr(pct)}%"></span><strong>Lv. ${escapeHtml(s.level)}</strong><span class="mk-local-level-badge-xp">${escapeHtml(formatAccountXp(s.totalScore))} XP</span>`;paintCurrencyButton(score);};if(profile.name){let initialScore=null;try{initialScore=readWarmAccountXpSnapshot()||readLiveAccountEventXpScore({fresh:false});}catch(_){initialScore=null;}
if(!initialScore){try{initialScore=readCachedAccountXp({full:true});}catch(_){initialScore=null;}}
if(initialScore){paintLevelBadge(initialScore);}else{levelBtn.innerHTML=`<span class="mk-local-level-badge-fill" style="width:0%"></span><strong>Lv. —</strong><span class="mk-local-level-badge-xp">Sync to load</span>`;levelBtn.title="Sync this device to load your XP and EORbits.";currencyBtn.innerHTML=`<span class="mk-account-currency-icon">${commentSvgIcon("eorbit", 16)}</span><span class="mk-account-currency-amount">—</span>`;currencyBtn.title="Sync this device to load your EORbits.";try{fetchAccountScore({force:false,reason:"account-panel-badge"}).then((sc)=>{if(sc)paintLevelBadge(sc);}).catch(()=>{});}catch(_){}}
try{if(window.MkAccountData&&typeof window.MkAccountData.syncShopStateNow==="function"){window.MkAccountData.syncShopStateNow({reason:"account-panel-open"}).then(()=>{try{const sc=readLiveAccountEventXpScore({fresh:true})||readWarmAccountXpSnapshot();if(sc){publishAccountXp(sc);paintLevelBadge(sc);}}catch(_){}}).catch(()=>{});}}catch(_){}
const onXp=(ev)=>{const score=ev&&ev.detail&&ev.detail.score;if(score)paintLevelBadge(score);};window.addEventListener("mk-account-xp-change",onXp);levelBtn.__mkAccountXpCleanup=()=>window.removeEventListener("mk-account-xp-change",onXp);}else{levelBtn.disabled=true;}
nameCell.appendChild(nameBox);nameCell.appendChild(levelBtn);nameCell.appendChild(currencyBtn);identityCell.appendChild(nameCell);const bioCell=el("div","mk-local-profile-bio-cell");const bioText=el("div","mk-local-profile-bio",profile.bio||"Add a short profile intro");bioText.classList.toggle("is-empty",!profile.bio);bioCell.appendChild(bioText);row.appendChild(avatarCell);row.appendChild(identityCell);row.appendChild(bioCell);profileBlock.appendChild(row);const actionRow=el("div","mk-local-profile-action-row");const avatarChange=el("button","mk-local-inline-change mk-local-avatar-change-btn","Update avatar");avatarChange.type="button";avatarChange.setAttribute("aria-label","Update avatar");const frameChange=el("button","mk-local-inline-change mk-local-frame-change-btn","Choose avatar frame");frameChange.type="button";frameChange.setAttribute("aria-label","Choose avatar frame");const nameChange=el("button","mk-local-inline-change mk-local-name-change-btn","Change username");nameChange.type="button";nameChange.setAttribute("aria-label","Change username");const bioChange=el("button","mk-local-inline-change mk-local-bio-change-btn",profile.bio?"Edit intro":"Add intro");bioChange.type="button";bioChange.setAttribute("aria-label",profile.bio?"Edit profile intro":"Add profile intro");actionRow.appendChild(avatarChange);actionRow.appendChild(frameChange);actionRow.appendChild(nameChange);actionRow.appendChild(bioChange);currencyBtn.addEventListener("click",()=>{try{openLocalActivity("shop");}catch(_){}});profileBlock.appendChild(actionRow);wrap.appendChild(profileBlock);frameChange.addEventListener("click",()=>{openAvatarFramePicker(__accountXpCache,refreshInfo).then(()=>{}).catch(()=>{});});bioChange.addEventListener("click",()=>{const accountContext=captureSocialAccountContext();const curr=readLocalProfile();if(!curr.name){window.alert("Please choose a username before adding a profile intro.");return;}
const mini=openLocalMiniModal("Profile intro");const input=document.createElement("textarea");input.maxLength=140;input.rows=3;input.value=curr.bio||"";input.placeholder="A short sentence about yourself";input.className="mk-local-profile-bio-input";input.setAttribute("aria-label","Profile intro");const note=el("div","mk-local-avatar-note","140 characters max. Appears on rankings when both Profile and User rankings are Public in Privacy settings.");const actions=el("div","mk-local-mini-actions");const cancel=iconButton("mk-comment-small-btn","x","Cancel");const save=iconButton("mk-comment-primary-btn","check","Save intro");cancel.type=save.type="button";actions.appendChild(cancel);actions.appendChild(save);mini.body.appendChild(input);mini.body.appendChild(note);mini.body.appendChild(actions);cancel.addEventListener("click",mini.close);save.addEventListener("click",async()=>{if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
const bio=cleanProfileBioLocal(input.value||"");if(bio===cleanProfileBioLocal(curr.bio||"")){mini.close();return;}
save.disabled=true;const res=await saveOnlineProfile(curr.name,"",{keepAvatar:true,privacy:curr.privacy,isPublic:curr.isPublic,bio});save.disabled=false;if(!res||!res.ok){alertCooldown(res);return;}
mini.close();refreshInfo();});setTimeout(()=>{try{input.focus();input.select();}catch(_){}},0);});nameChange.addEventListener("click",async()=>{const accountContext=captureSocialAccountContext();let curr=readLocalProfile();if(isCooldownActive(curr.nameCooldownUntil))curr=await refreshProfileIfCooldownActive("name");if(!socialAccountContextIsCurrent(accountContext)){refreshInfo();return;}
if(isCooldownActive(curr.nameCooldownUntil)){window.alert(`Username is locked until ${formatCooldownDate(curr.nameCooldownUntil)}.`);return;}
const mini=openLocalMiniModal("Change username");const input=document.createElement("input");input.type="text";input.maxLength=40;input.autocomplete="nickname";input.value=curr.name||"";input.placeholder="Username";input.setAttribute("aria-label","New username");const actions=el("div","mk-local-mini-actions");const cancel=iconButton("mk-comment-small-btn","x","Cancel");const save=iconButton("mk-comment-primary-btn","check","Save username");cancel.type=save.type="button";actions.appendChild(cancel);actions.appendChild(save);mini.body.appendChild(input);mini.body.appendChild(actions);cancel.addEventListener("click",mini.close);save.addEventListener("click",async()=>{if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
const nm=cleanProfileNameLocal(input.value||"");if(!nm){input.focus();return;}
if(nm===cleanProfileNameLocal(curr.name||"")){mini.close();return;}
if(!window.confirm(profileChangeWarningText(true,false,!curr.name)))return;if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
save.disabled=true;const res=await saveOnlineProfile(nm,"",{keepAvatar:true,privacy:curr.privacy,isPublic:curr.isPublic,bio:curr.bio||""});save.disabled=false;if(!res||!res.ok){alertCooldown(res);return;}
try{await syncAllAccountDataNow({force:true,reason:"profile-name-save",timeoutMs:ACCOUNT_SYNC_MANUAL_TIMEOUT_MS});}catch(_){}
mini.close();refreshInfo();});setTimeout(()=>{try{input.focus();input.select();}catch(_){}},0);});avatarChange.addEventListener("click",async()=>{const accountContext=captureSocialAccountContext();let curr=readLocalProfile();if(!curr.name){window.alert("Please choose a username before setting an avatar.");return;}
const mini=openLocalMiniModal("Change avatar");let avatarMode=avatarModeFromValue(curr.avatar||"");let avatarValue=(isImageAvatar(curr.avatar)||isInitialAvatarStyleValue(curr.avatar))?"":cleanAvatarLocal(curr.avatar||"");let selectedInitialStyle=parseInitialAvatarStyle(curr.avatar||"");let selectedInitialFont=selectedInitialStyle.font.id;let selectedInitialColor=selectedInitialStyle.color.id;let selectedInitialText=selectedInitialStyle.text.id;let selectedInitialScale=selectedInitialStyle.scale.id;let selectedAvatarEmojiItem=null;let selectedAvatarEmojiTier="";let selectedFile=null;let uploadPreviewUrl="";let selectedAvatarEmojiCategory="";let selectedAvatarToneBase="";if(mini.modal)mini.modal.classList.add("mk-local-avatar-modal");const sticky=el("div","mk-local-avatar-sticky");const preview=el("div","mk-local-profile-preview mk-local-avatar-preview");const previewAvatar=el("div","mk-local-profile-avatarbox");preview.appendChild(previewAvatar);const tabs=el("div","mk-local-avatar-tabs");const modeInitials=el("button","mk-local-avatar-tab","Initials");const modeEmoji=el("button","mk-local-avatar-tab","Emoji");const modeUpload=el("button","mk-local-avatar-tab","Upload");[modeInitials,modeEmoji,modeUpload].forEach((b)=>{b.type="button";tabs.appendChild(b);});sticky.appendChild(preview);sticky.appendChild(tabs);const body=el("div","mk-local-avatar-body");const file=document.createElement("input");file.type="file";file.accept="image/jpeg,image/png,image/webp,image/gif";const actions=el("div","mk-local-mini-actions");const cancel=iconButton("mk-comment-small-btn","x","Cancel");const save=iconButton("mk-comment-primary-btn","check","Save avatar");cancel.type=save.type="button";actions.appendChild(cancel);actions.appendChild(save);mini.body.appendChild(sticky);mini.body.appendChild(body);mini.body.appendChild(actions);const revokeUploadPreview=()=>{if(!uploadPreviewUrl)return;try{URL.revokeObjectURL(uploadPreviewUrl);}catch(_){}
uploadPreviewUrl="";};mini.onClose(revokeUploadPreview);const currentAvatar=()=>{if(avatarMode==="initials")return encodeInitialAvatarStyle(selectedInitialFont,selectedInitialColor,selectedInitialText,selectedInitialScale);if(avatarMode==="emoji")return cleanAvatarLocal(avatarValue||"");if(avatarMode==="upload")return selectedFile?uploadPreviewUrl:(isImageAvatar(curr.avatar)?curr.avatar:"");return"";};const rememberSelectedAvatarEmojiItem=(item,cp)=>{if(!item)return null;const codepoint=String(cp||item.codepoint||normaliseNotoEmojiText(item.emoji||"")).replace(/[^0-9a-f_]/gi,"").toLowerCase();selectedAvatarEmojiItem=Object.assign({},item,{codepoint});if(!avatarValue)avatarValue=selectedAvatarEmojiItem.emoji||"";const state=avatarEmojiUnlockState(selectedAvatarEmojiItem);if(!selectedAvatarEmojiTier)selectedAvatarEmojiTier=state.hasDynamic?"dynamic":"static";return selectedAvatarEmojiItem;};const refreshPreview=()=>{previewAvatar.innerHTML="";if(avatarMode==="emoji"&&selectedAvatarEmojiItem){const state=avatarEmojiUnlockState(selectedAvatarEmojiItem);const cards=el("div","mk-local-avatar-paywall mk-local-avatar-paywall--preview");const addCard=(tier)=>{const wantsDynamic=tier==="dynamic";const owned=wantsDynamic?state.hasDynamic:state.hasStatic;const includedStaticPreview=!wantsDynamic&&state.hasDynamic;const price=wantsDynamic?state.dynamicPrice:state.staticPrice;const src=wantsDynamic?selectedAvatarEmojiItem.animatedUrl:selectedAvatarEmojiItem.staticUrl;const card=el("div","mk-local-avatar-card"+(selectedAvatarEmojiTier===tier?" is-selected":""));card.appendChild(el("div","mk-local-avatar-card-title",wantsDynamic?"Dynamic avatar":(includedStaticPreview?"Static preview":"Static avatar")));const pv=el("div","mk-local-avatar-card-preview");const instantSrc=wantsDynamic?(selectedAvatarEmojiItem.staticUrl||src):src;pv.innerHTML=avatarHtml(curr.name||"You",instantSrc||selectedAvatarEmojiItem.emoji||"",curr.avatarFrame||"level-1");if(wantsDynamic&&selectedAvatarEmojiItem.animatedUrl&&instantSrc!==selectedAvatarEmojiItem.animatedUrl){const liveImg=pv.querySelector("img");if(liveImg){const pre=new Image();pre.decoding="async";pre.addEventListener("load",()=>{try{liveImg.src=selectedAvatarEmojiItem.animatedUrl;}catch(_){}});pre.src=selectedAvatarEmojiItem.animatedUrl;}}
card.appendChild(pv);const btn=el("button","mk-local-avatar-price-btn"+(owned?" is-owned":""),"");btn.innerHTML=includedStaticPreview?"Included":(owned?"Use emoji":`<span class="mk-account-shop-btn-price">${commentSvgIcon("eorbit", 12)}${escapeHtml(formatEorbits(price))}</span>`);btn.type="button";btn.disabled=includedStaticPreview;btn.title=includedStaticPreview?"Static preview is included with your animated avatar unlock.":(owned?"Use this unlocked emoji avatar.":`Unlock for ${price} EORbits.`);if(!includedStaticPreview)btn.addEventListener("click",async()=>{if(!owned){if(!window.confirm(`Unlock ${wantsDynamic ? "dynamic" : "static"} emoji avatar ${selectedAvatarEmojiItem.emoji || ""} for ${price} EORbits?`))return;const paid=await buyEmojiUnlock(selectedAvatarEmojiItem,"avatar",tier,wantsDynamic?"avatar-emoji-dynamic-preview":"avatar-emoji-static-preview");if(!paid||paid.ok===false){window.alert((paid&&paid.error==="insufficient_funds")?`Not enough EORbits. You need ${paid.price || price}.`:"Could not unlock this emoji avatar.");return;}
try{await syncAllAccountDataNow({force:true,reason:"avatar-emoji-unlock",timeoutMs:ACCOUNT_SYNC_MANUAL_TIMEOUT_MS});}catch(_){}}
avatarValue=selectedAvatarEmojiItem.emoji||avatarValue;selectedAvatarEmojiTier=tier;selectedFile=null;renderBody();});card.appendChild(btn);cards.appendChild(card);};addCard("static");addCard("dynamic");previewAvatar.appendChild(cards);}else{previewAvatar.innerHTML=avatarHtml(curr.name||"You",currentAvatar(),curr.avatarFrame||"level-1");}
[modeInitials,modeEmoji,modeUpload].forEach((b)=>b.classList.remove("is-active"));if(avatarMode==="initials")modeInitials.classList.add("is-active");if(avatarMode==="emoji")modeEmoji.classList.add("is-active");if(avatarMode==="upload")modeUpload.classList.add("is-active");};const renderBody=()=>{body.innerHTML="";if(avatarMode==="initials"){body.appendChild(el("div","mk-local-avatar-note","Initials are free. Optional font, text color, and background styles cost 20 EORbits each and apply only to initials, not emoji or uploaded images. Scale is free."));const editor=el("div","mk-local-initial-editor");const makePriceHtml=(price)=>`<span class="mk-account-shop-btn-price">${commentSvgIcon("eorbit", 12)}${escapeHtml(formatEorbits(price))}</span>`;const setInitialChoice=(type,id)=>{if(type==="font")selectedInitialFont=id;else if(type==="text")selectedInitialText=id;else if(type==="scale")selectedInitialScale=id;else selectedInitialColor=id;};const initialStylesInventory=initialAvatarStyleInventory();const makeGroup=(title,items,selectedId,type)=>{const wrap=el("div","mk-local-initial-group");wrap.appendChild(el("div","mk-local-avatar-card-title",title));const opts=el("div","mk-local-initial-options");items.forEach((item)=>{const owned=initialAvatarStyleOwned(type,item.id,initialStylesInventory);const card=el("div","mk-local-initial-option"+(item.id===selectedId?" is-active":"")+(owned?" is-owned":""),"");const select=el("button","mk-local-initial-select","");select.type="button";if(type==="text"){const textDef=initialAvatarTextColorDef(item.id);const fg=textDef.fg||"#e5e7eb";const sampleBg=item.id==="ink"?"#f8fafc":"#111827";const sampleLetter=displayInitials(curr.name||"You").slice(0,1)||"A";select.innerHTML=`<strong>${escapeHtml(item.label)}</strong><span class="mk-local-initial-color-sample" style="color:${escapeAttr(fg)};background:${escapeAttr(sampleBg)};">${escapeHtml(sampleLetter)}</span>`;}else{select.innerHTML=`<strong>${escapeHtml(item.label)}</strong>`;}
select.addEventListener("click",()=>{setInitialChoice(type,item.id);renderBody();refreshPreview();});card.appendChild(select);const pay=el("button","mk-local-avatar-price-btn"+(owned?" is-owned":""),"");pay.type="button";pay.innerHTML=owned?"Owned":makePriceHtml(item.price);pay.title=owned?"Already unlocked.":`Unlock for ${item.price} EORbits.`;pay.addEventListener("click",async(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}
setInitialChoice(type,item.id);if(!owned){if(!window.confirm(`Unlock ${title.toLowerCase()} ${item.label} for ${item.price} EORbits?`)){renderBody();refreshPreview();return;}
const paid=await buyInitialAvatarStyle(type,item.id);if(!paid||paid.ok===false){window.alert((paid&&paid.error==="insufficient_funds")?`Not enough EORbits. You need ${paid.price || item.price}.`:"Could not unlock this initials style.");renderBody();refreshPreview();return;}
try{window.dispatchEvent(new CustomEvent("mk-shop-inventory-change",{detail:{source:"initial-avatar-style"}}));}catch(_){}}
renderBody();refreshPreview();});card.appendChild(pay);opts.appendChild(card);});wrap.appendChild(opts);return wrap;};const makeScaleSlider=()=>{const wrap=el("div","mk-local-initial-group mk-local-initial-scale-group");const title=el("div","mk-local-avatar-card-title");const value=initialAvatarScaleDef(selectedInitialScale);title.textContent=`Initial scale · ${value.label}`;const input=document.createElement("input");input.type="range";input.min="100";input.max="200";input.step="1";input.value=value.id;input.className="mk-local-initial-scale-slider";input.addEventListener("input",()=>{selectedInitialScale=String(Math.round(Number(input.value)||100));title.textContent=`Initial scale · ${initialAvatarScaleDef(selectedInitialScale).label}`;refreshPreview();});wrap.appendChild(title);wrap.appendChild(input);return wrap;};editor.appendChild(makeGroup("Initials font",INITIAL_AVATAR_FONTS,selectedInitialFont,"font"));editor.appendChild(makeGroup("Initials text color",INITIAL_AVATAR_TEXT_COLORS,selectedInitialText,"text"));editor.appendChild(makeGroup("Initials background",INITIAL_AVATAR_BG_COLORS,selectedInitialColor,"color"));editor.appendChild(makeScaleSlider());const selectedFont=initialAvatarFontDef(selectedInitialFont);const selectedColor=initialAvatarColorDef(selectedInitialColor);const selectedText=initialAvatarTextColorDef(selectedInitialText);const selectedScale=initialAvatarScaleDef(selectedInitialScale);const total=[["font",selectedFont],["color",selectedColor],["text",selectedText],["scale",selectedScale]].reduce((sum,row)=>sum+(initialAvatarStyleOwned(row[0],row[1].id,initialStylesInventory)?0:Number(row[1].price||0)),0);editor.appendChild(el("div","mk-local-initial-total",total?`These changes cost ${formatEorbits(total)} EORbits to unlock.`:"These changes are already unlocked."));body.appendChild(editor);}else if(avatarMode==="emoji"){const byCat=__commentEmojiDataReady?commentEmojiChoicesByCategory({avatarUnlocked:true,noRecent:true}):new Map([["Emoji",profileEmojiChoices().map((emo)=>({emoji:emo,codepoint:normaliseNotoEmojiText(emo),label:emo,staticUrl:"",animatedUrl:""}))]]);if(!__commentEmojiDataReady){loadCommentEmojiData().then(()=>{if(avatarMode==="emoji"){renderBody();refreshPreview();}}).catch(()=>{});}
const cats=Array.from(byCat.keys()).filter((cat)=>(byCat.get(cat)||[]).length);if(!selectedAvatarEmojiCategory||!cats.includes(selectedAvatarEmojiCategory)){selectedAvatarEmojiCategory=cats.find((cat)=>(byCat.get(cat)||[]).some((item)=>item&&item.emoji===avatarValue))||cats[0]||"Emoji";}
const catTabs=el("div","mk-comment-emoji-tabs mk-local-avatar-emoji-tabs");cats.forEach((cat)=>{const tab=el("button","mk-comment-emoji-tab"+(cat===selectedAvatarEmojiCategory?" is-active":""),commentEmojiCategoryLabel(cat));tab.type="button";tab.addEventListener("click",(ev)=>{try{ev.preventDefault();ev.stopPropagation();}catch(_){}
selectedAvatarEmojiCategory=cat;renderBody();});catTabs.appendChild(tab);});body.appendChild(catTabs);const grid=el("div","mk-local-emoji-grid");const allEmojiChoices=[];byCat.forEach((items)=>{(items||[]).forEach((item)=>{if(item&&item.emoji)allEmojiChoices.push(item);});});if(!avatarValue&&allEmojiChoices.length)avatarValue=allEmojiChoices[0].emoji||"😀";const avatarValueItem=avatarValue?(__commentEmojiByText.get(normaliseNotoEmojiText(avatarValue))||null):null;if(avatarValue&&allEmojiChoices.length&&!avatarValueItem&&!allEmojiChoices.some((item)=>item&&item.emoji===avatarValue))avatarValue=allEmojiChoices[0].emoji||avatarValue;const activeEmojiItem=avatarValueItem||allEmojiChoices.find((item)=>item&&item.emoji===avatarValue)||allEmojiChoices[0]||null;const activeBaseCp=activeEmojiItem?emojiFamilyBase(activeEmojiItem.codepoint||normaliseNotoEmojiText(activeEmojiItem.emoji||"")):"";if(activeEmojiItem&&(!selectedAvatarEmojiItem||selectedAvatarEmojiItem.emoji!==activeEmojiItem.emoji)){rememberSelectedAvatarEmojiItem(activeEmojiItem,activeBaseCp);}
const applyAvatarSelection=(displayItem)=>{const emo=displayItem.emoji||"";const baseCp=emojiFamilyBase(displayItem.codepoint||normaliseNotoEmojiText(emo));const st=avatarEmojiUnlockState(Object.assign({},displayItem,{codepoint:baseCp}));avatarValue=emo;selectedAvatarToneBase="";selectedAvatarEmojiTier=st.hasDynamic?"dynamic":"static";selectedFile=null;rememberSelectedAvatarEmojiItem(displayItem,baseCp);renderBody();refreshPreview();};const avatarGridEntitlements=emojiEntitlements();const makeAvatarCell=(item)=>{const emo=item.emoji||"";const cp=emojiFamilyBase(item.codepoint||normaliseNotoEmojiText(emo));const state=avatarEmojiUnlockState(Object.assign({},item,{codepoint:cp}),avatarGridEntitlements);const hasStatic=state.hasStatic;const hasDynamic=state.hasDynamic;const b=el("button","mk-local-emoji-choice"+(!hasStatic&&!hasDynamic?" is-locked":"")+(hasDynamic?" is-dynamic":"")+(item.hasVariants?" has-tone-variants":""),"");b.type="button";if(item.staticUrl||item.animatedUrl){const thumbSrc=(hasDynamic&&item.animatedUrl)?item.animatedUrl:(item.staticUrl||item.animatedUrl);markEmojiThumbPending(b,thumbSrc,emo);}else{b.textContent=emo;}
const variantWord=(item.variantLabel||"variant").toLowerCase();b.title=item.hasVariants?`Pick a ${variantWord}`:(hasDynamic?"Animated emoji avatar unlocked; click to preview":(hasStatic?`Static emoji avatar unlocked; dynamic costs ${state.dynamicPrice} EORbits`:`Preview locked emoji avatar; static ${state.staticPrice} EORbits, dynamic ${state.dynamicPrice} EORbits`));b.classList.toggle("is-active",avatarValue===emo||(item.hasVariants&&activeBaseCp&&activeBaseCp===cp));b.addEventListener("click",()=>{if(item.hasVariants){selectedAvatarToneBase=(selectedAvatarToneBase===cp)?"":cp;renderBody();return;}
applyAvatarSelection(item);});return b;};const toneBaseItem=selectedAvatarToneBase?emojiVariantFamilyRep(selectedAvatarToneBase):null;if(toneBaseItem&&toneBaseItem.hasVariants){const strip=el("div","mk-comment-emoji-tonestrip mk-local-emoji-tonestrip");strip.appendChild(el("span","mk-comment-emoji-tonestrip-label",`${toneBaseItem.variantLabel || "Variant"} · ${toneBaseItem.label || toneBaseItem.emoji || ""}`));const row=el("div","mk-comment-emoji-tonestrip-row");(toneBaseItem.variantItems||[toneBaseItem]).forEach((variant)=>{const vEmo=variant.emoji||"";const vb=el("button","mk-local-emoji-choice","");vb.type="button";if(variant.staticUrl||variant.animatedUrl){markEmojiThumbPending(vb,variant.staticUrl||variant.animatedUrl,vEmo);}else{vb.textContent=vEmo;}
vb.title=`Use ${variant.label || vEmo}`;vb.classList.toggle("is-active",avatarValue===vEmo);vb.addEventListener("click",()=>{applyAvatarSelection(variant);});row.appendChild(vb);});strip.appendChild(row);body.appendChild(strip);lazyLoadEmojiThumbs(row);}
const choices=(byCat.get(selectedAvatarEmojiCategory)||[]).slice(0,500);body.appendChild(grid);renderEmojiCells(grid,choices,makeAvatarCell);if(!choices.length)body.appendChild(el("div","mk-local-avatar-note",__commentEmojiDataReady?"No emoji in this category.":"Loading the full emoji library…"));}else{body.appendChild(el("div","mk-local-avatar-note",isImageAvatar(curr.avatar)&&!selectedFile?"Current upload stays unless you choose a new image. New uploads cost 100 EORbits and keep the 7-day cooldown.":"Choose JPG, PNG, WebP, or GIF up to 1 MB. Custom uploads cost 100 EORbits and keep the 7-day cooldown."));body.appendChild(file);if(selectedFile)body.appendChild(el("div","mk-local-avatar-note",`Selected: ${selectedFile.name}`));}
refreshPreview();};const setMode=(mode)=>{avatarMode=mode;if(mode==="initials"){avatarValue="";selectedAvatarEmojiItem=null;selectedAvatarEmojiTier="";selectedFile=null;}
if(mode==="emoji"){if(!avatarValue||isImageAvatar(avatarValue))avatarValue=(profileEmojiChoices()[0]||"😀");selectedFile=null;}
if(mode==="upload"){avatarValue="";selectedAvatarEmojiItem=null;selectedAvatarEmojiTier="";}
renderBody();};modeInitials.addEventListener("click",()=>setMode("initials"));modeEmoji.addEventListener("click",()=>setMode("emoji"));modeUpload.addEventListener("click",()=>setMode("upload"));file.addEventListener("change",()=>{selectedFile=file.files&&file.files[0]?file.files[0]:null;revokeUploadPreview();if(selectedFile&&typeof URL!=="undefined"&&typeof URL.createObjectURL==="function"){try{uploadPreviewUrl=URL.createObjectURL(selectedFile);}catch(_){uploadPreviewUrl="";}}
avatarMode="upload";renderBody();});cancel.addEventListener("click",mini.close);save.addEventListener("click",async()=>{if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
if(selectedFile&&selectedFile.size>1024*1024){window.alert("Avatar image must be 1 MB or smaller.");file.focus();return;}
if(selectedFile&&!/^(image\/jpeg|image\/png|image\/webp|image\/gif)$/i.test(selectedFile.type||"")){window.alert("Avatar must be a JPG, PNG, WebP, or GIF image.");file.focus();return;}
if(selectedFile){if(isCooldownActive(curr.avatarCooldownUntil))curr=await refreshProfileIfCooldownActive("avatar");if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
if(isCooldownActive(curr.avatarCooldownUntil)){window.alert(`Custom image avatars are locked until ${formatCooldownDate(curr.avatarCooldownUntil)}.`);return;}}
if(avatarMode==="emoji"&&avatarValue&&!selectedAvatarEmojiItem){const fallbackItem=__commentEmojiByText&&__commentEmojiByText.get(normaliseNotoEmojiText(avatarValue));if(fallbackItem){selectedAvatarEmojiItem=fallbackItem;const st=avatarEmojiUnlockState(fallbackItem);selectedAvatarEmojiTier=st.hasDynamic?"dynamic":"static";}}
const oldAvatar=cleanAvatarLocal(curr.avatar||"");const initialAvatarValue=encodeInitialAvatarStyle(selectedInitialFont,selectedInitialColor,selectedInitialText,selectedInitialScale);const newComparable=(avatarMode==="upload"&&!selectedFile&&isImageAvatar(curr.avatar))?oldAvatar:(selectedFile?"__upload__":cleanAvatarLocal(avatarMode==="emoji"?avatarValue:initialAvatarValue));const pendingEmojiUnlock=avatarMode==="emoji"&&selectedAvatarEmojiItem&&selectedAvatarEmojiTier&&(()=>{const st=avatarEmojiUnlockState(selectedAvatarEmojiItem);return!(selectedAvatarEmojiTier==="dynamic"?st.hasDynamic:st.hasStatic);})();const pendingInitialUnlocks=avatarMode==="initials"?[["font",initialAvatarFontDef(selectedInitialFont)],["color",initialAvatarColorDef(selectedInitialColor)],["text",initialAvatarTextColorDef(selectedInitialText)],["scale",initialAvatarScaleDef(selectedInitialScale)]].filter((row)=>row[1]&&row[1].price&&!initialAvatarStyleOwned(row[0],row[1].id)):[];if(oldAvatar===newComparable&&!pendingEmojiUnlock&&!pendingInitialUnlocks.length){mini.close();return;}
if(!window.confirm(profileChangeWarningText(false,true,!oldAvatar)))return;if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
save.disabled=true;try{if(avatarMode==="emoji"&&selectedAvatarEmojiItem&&selectedAvatarEmojiTier){if(!(await ensureAvatarEmojiUnlocked(selectedAvatarEmojiItem,selectedAvatarEmojiTier))){save.disabled=false;return;}
if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}}
if(pendingInitialUnlocks.length){const total=pendingInitialUnlocks.reduce((sum,row)=>sum+Number(row[1].price||0),0);if(!window.confirm(`Unlock this initials style for ${total} EORbits?`)){save.disabled=false;return;}
if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
for(const row of pendingInitialUnlocks){const paid=await buyInitialAvatarStyle(row[0],row[1].id);if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
if(!paid||paid.ok===false){save.disabled=false;window.alert((paid&&paid.error==="insufficient_funds")?`Not enough EORbits. You need ${paid.price || row[1].price}.`:"Could not unlock this initials style.");return;}}
try{window.dispatchEvent(new CustomEvent("mk-shop-inventory-change",{detail:{source:"initial-avatar-style"}}));}catch(_){}}
if(selectedFile){if(!window.confirm("Custom image avatars cost 100 EORbits per upload and can only be changed once every 7 days. Continue to payment?")){save.disabled=false;return;}
if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
const paid=await buyCustomAvatarUpload();if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
if(!paid||paid.ok===false){save.disabled=false;window.alert((paid&&paid.error==="insufficient_funds")?`Not enough EORbits. You need ${paid.price || 100}.`:"Could not process the 100 EORbits custom avatar payment.");return;}}
let res=await saveOnlineProfile(curr.name,avatarMode==="emoji"?cleanAvatarLocal(avatarValue||""):(avatarMode==="initials"?initialAvatarValue:""),{keepAvatar:avatarMode==="upload"&&(selectedFile||(!selectedFile&&isImageAvatar(curr.avatar))),privacy:curr.privacy,isPublic:curr.isPublic,bio:curr.bio||""});if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
if(!res||!res.ok){save.disabled=false;alertCooldown(res);return;}
if(selectedFile){const uploaded=await apiUploadAvatar(selectedFile,curr.name);if(!socialAccountContextIsCurrent(accountContext)){mini.close();refreshInfo();return;}
if(!uploaded||!uploaded.ok||!uploaded.profile){save.disabled=false;alertCooldown(uploaded||{error:"Could not upload this avatar. Check the R2 binding on the hot Worker."});return;}
try{writeLocalProfile(uploaded.profile,{requirePersistence:true});}
catch(_){alertCooldown(identityProfileFailure("The avatar was saved in the cloud, but this browser could not save it locally. Free browser storage and reload.",accountContext,true));return;}
setIdentityRecoveryStatus("",accountContext);}
try{await syncAllAccountDataNow({force:true,reason:"profile-avatar-save",timeoutMs:ACCOUNT_SYNC_MANUAL_TIMEOUT_MS});}catch(_){}
save.disabled=false;mini.close();refreshInfo();}finally{save.disabled=false;}});renderBody();});const makeAccountSection=(title,subtitle,className)=>{const section=el("details",`mk-account-section ${className || ""}`.trim());const summary=el("summary","mk-account-section-summary");const copy=el("span","mk-account-section-summary-copy");copy.innerHTML=`<strong>${escapeHtml(title)}</strong><small>${escapeHtml(subtitle || "")}</small>`;const arrow=el("span","mk-account-section-arrow");summary.appendChild(copy);summary.appendChild(arrow);const body=el("div","mk-account-section-body");section.appendChild(summary);section.appendChild(body);try{section.addEventListener("toggle",()=>{mkLocalScheduleAccountSectionSafeScroll();window.setTimeout(mkLocalScheduleAccountSectionSafeScroll,90);window.setTimeout(mkLocalScheduleAccountSectionSafeScroll,260);});}catch(_){}
return{section,body};};const AUTO_SYNC_INTERVAL_KEY_UI="mk_account_auto_sync_interval_ms_v1";const AUTO_SYNC_MIN_MS_UI=10*60*1000;const AUTO_SYNC_DEFAULT_MS_UI=15*60*1000;const AUTO_SYNC_MAX_MS_UI=60*60*1000;const AUTO_SYNC_SLIDER_MAX_UI=120;const AUTO_SYNC_SLIDER_OFF_START_UI=110;const AUTO_SYNC_SLIDER_OFF_UI=120;const normaliseAutoSyncIntervalUi=(value)=>{if(value===Infinity||value==="Infinity"||value==="off"||value==="disabled"||value==="never")return Infinity;const n=Number(value);if(!Number.isFinite(n)||n<=0)return AUTO_SYNC_DEFAULT_MS_UI;return Math.max(AUTO_SYNC_MIN_MS_UI,Math.min(AUTO_SYNC_MAX_MS_UI,Math.round(n)));};const readAutoSyncIntervalUi=()=>{try{const api=window.MkAccountData;if(api&&typeof api.getAutoSyncIntervalMs==="function")return normaliseAutoSyncIntervalUi(api.getAutoSyncIntervalMs());}catch(_){}
try{const raw=localStorage.getItem(AUTO_SYNC_INTERVAL_KEY_UI);if(raw==null||raw==="")return AUTO_SYNC_DEFAULT_MS_UI;return normaliseAutoSyncIntervalUi(raw);}catch(_){return AUTO_SYNC_DEFAULT_MS_UI;}};const writeAutoSyncIntervalUi=(value)=>{const next=normaliseAutoSyncIntervalUi(value);try{const api=window.MkAccountData;if(api&&typeof api.setAutoSyncIntervalMs==="function")return api.setAutoSyncIntervalMs(next);}catch(_){}
try{if(next===Infinity)localStorage.setItem(AUTO_SYNC_INTERVAL_KEY_UI,"off");else localStorage.setItem(AUTO_SYNC_INTERVAL_KEY_UI,String(next));}catch(_){}
try{window.dispatchEvent(new CustomEvent("mk-account-auto-sync-interval-change",{detail:{intervalMs:next,disabled:next===Infinity}}));}catch(_){}
return next;};const autoSyncIntervalLabelUi=(value)=>{const ms=normaliseAutoSyncIntervalUi(value);if(ms===Infinity)return"Off";const minutes=Math.max(1,Math.round(ms/60000));if(minutes<60)return`${minutes} min`;return"1 hour";};const autoSyncNoteTextUi=(value)=>{const ms=normaliseAutoSyncIntervalUi(value);if(ms===Infinity)return"Automatic sync is off on this device. Manual sync still works.";return`Automatic sync: every ${autoSyncIntervalLabelUi(ms)} on this device.`;};const autoSyncCountdownTextUi=(remainingMs)=>{const ms=Math.max(0,Number(remainingMs||0)||0);if(ms<1000)return"now";const total=Math.ceil(ms/1000);const hours=Math.floor(total/3600);const minutes=Math.floor((total%3600)/60);const seconds=total%60;if(hours>0)return`${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;return`${minutes}:${String(seconds).padStart(2, "0")}`;};const autoSyncIntervalToSliderUi=(value)=>{const ms=normaliseAutoSyncIntervalUi(value);if(ms===Infinity)return AUTO_SYNC_SLIDER_OFF_UI;const ratio=Math.log(ms/AUTO_SYNC_MIN_MS_UI)/Math.log(AUTO_SYNC_MAX_MS_UI/AUTO_SYNC_MIN_MS_UI);return Math.max(0,Math.min(100,Math.round(ratio*100)));};const autoSyncSliderToIntervalUi=(value)=>{const v=Number(value);if(!Number.isFinite(v)||v>=AUTO_SYNC_SLIDER_OFF_START_UI)return Infinity;const t=Math.max(0,Math.min(100,v))/100;const raw=AUTO_SYNC_MIN_MS_UI*Math.pow(AUTO_SYNC_MAX_MS_UI/AUTO_SYNC_MIN_MS_UI,t);return normaliseAutoSyncIntervalUi(Math.round(raw/60000)*60000);};const syncSection=makeAccountSection("Sync & learning data","Keep this device and your cloud account aligned.","mk-account-section--sync");const syncBox=el("div","mk-account-section-content mk-account-sync-card");const syncOut=el("div","mk-account-sync-output");const renderSyncStatus=(summary,statusText)=>{syncOut.innerHTML=accountSyncSummaryHtml(summary||readAccountSyncSummary(),statusText||"");};try{if(window.__mkSyncStatusLiveRefresh){["mk-local-activity-change","mk-account-data-changed","mk-account-xp-change"].forEach((t)=>{try{window.removeEventListener(t,window.__mkSyncStatusLiveRefresh);}catch(_){}});}
let liveRefreshTimer=0;const liveRefresh=()=>{if(liveRefreshTimer)return;liveRefreshTimer=window.setTimeout(()=>{liveRefreshTimer=0;try{if(!syncOut.isConnected)return;if(syncOut.querySelector(".is-syncing"))return;renderSyncStatus();}catch(_){}},900);};window.__mkSyncStatusLiveRefresh=liveRefresh;["mk-local-activity-change","mk-account-data-changed","mk-account-xp-change"].forEach((t)=>window.addEventListener(t,liveRefresh));}catch(_){}
const syncTop=el("div","mk-account-sync-top");const syncAll=el("button","mk-account-sync-main-btn","Sync now");syncAll.type="button";const syncActionWrap=el("div","mk-account-sync-action-wrap");const syncAutoCountdown=el("div","mk-account-sync-countdown","Next auto-sync: —");syncActionWrap.appendChild(syncAll);syncActionWrap.appendChild(syncAutoCountdown);syncTop.appendChild(syncOut);syncTop.appendChild(syncActionWrap);syncBox.appendChild(syncTop);const syncIntervalCard=el("div","mk-account-sync-interval-card mk-account-sync-interval-card--compact");const syncIntervalHead=el("div","mk-account-sync-interval-head");const syncIntervalCopy=el("div","mk-account-sync-interval-copy");syncIntervalCopy.innerHTML=`<strong>Auto-sync interval</strong><small>This-device setting.</small>`;const syncIntervalValue=el("div","mk-account-sync-interval-value",autoSyncIntervalLabelUi(readAutoSyncIntervalUi()));syncIntervalHead.appendChild(syncIntervalCopy);const syncIntervalSlider=document.createElement("input");syncIntervalSlider.type="range";syncIntervalSlider.min="0";syncIntervalSlider.max=String(AUTO_SYNC_SLIDER_MAX_UI);syncIntervalSlider.step="1";syncIntervalSlider.className="mk-account-sync-interval-slider";syncIntervalSlider.setAttribute("aria-label","Auto-sync interval");syncIntervalSlider.value=String(autoSyncIntervalToSliderUi(readAutoSyncIntervalUi()));const syncIntervalTicks=el("div","mk-account-sync-interval-ticks");const syncTickPositionUi=(interval)=>{const v=autoSyncIntervalToSliderUi(interval);return Math.max(0,Math.min(100,(Number(v)||0)/AUTO_SYNC_SLIDER_MAX_UI*100));};syncIntervalTicks.innerHTML=[[AUTO_SYNC_MIN_MS_UI,"10 min"],[15*60*1000,"15 min"],[AUTO_SYNC_MAX_MS_UI,"1 hour"],[Infinity,"Off"],].map(([value,label])=>`<span style="left:${syncTickPositionUi(value)}%">${label}</span>`).join("");const syncIntervalHint=el("div","mk-account-sync-interval-hint","Runs after learning actions. Minimum interval: 10 minutes.");const updateAutoSyncCountdownUi=()=>{try{const profile=readLocalProfile();const interval=readAutoSyncIntervalUi();let text="Next auto-sync: —";let title=autoSyncNoteTextUi(interval);if(!profile||!profile.accountKey){text="Auto-sync: connect account first";title="Automatic sync starts after this browser is connected to an account.";}else if(interval===Infinity){text="Auto-sync off";}else{let status=null;try{if(window.MkAccountData&&typeof window.MkAccountData.getAutoSyncStatus==="function")status=window.MkAccountData.getAutoSyncStatus();}catch(_){status=null;}
const dueAt=Number(status&&status.dueAt||0);if(dueAt>Date.now())text=`Next auto-sync in ${autoSyncCountdownTextUi(dueAt - Date.now())}`;else if(status&&status.scheduled)text="Next auto-sync: now";else text=`Next auto-sync waits for learning action (${autoSyncIntervalLabelUi(interval)} interval)`;}
syncAutoCountdown.textContent=text;syncAutoCountdown.title=title;}catch(_){}};const updateSyncIntervalUi=(value,persist)=>{const next=autoSyncSliderToIntervalUi(value==null?syncIntervalSlider.value:value);syncIntervalValue.textContent=autoSyncIntervalLabelUi(next);syncIntervalSlider.setAttribute("aria-valuetext",autoSyncIntervalLabelUi(next));syncIntervalCard.classList.toggle("is-off",next===Infinity);syncIntervalCard.title=autoSyncNoteTextUi(next);if(persist)writeAutoSyncIntervalUi(next);updateAutoSyncCountdownUi();};syncIntervalSlider.addEventListener("input",()=>updateSyncIntervalUi(syncIntervalSlider.value,false));syncIntervalSlider.addEventListener("change",()=>updateSyncIntervalUi(syncIntervalSlider.value,true));window.addEventListener("mk-account-auto-sync-interval-change",(ev)=>{const ms=ev&&ev.detail?ev.detail.intervalMs:readAutoSyncIntervalUi();syncIntervalSlider.value=String(autoSyncIntervalToSliderUi(ms));updateSyncIntervalUi(syncIntervalSlider.value,false);});const startCountdownTicker=()=>{try{if(window.__mkAccountSyncCountdownTimer)window.clearInterval(window.__mkAccountSyncCountdownTimer);}catch(_){}
window.__mkAccountSyncCountdownTimer=0;updateAutoSyncCountdownUi();let live=false;try{live=!!(readLocalProfile().accountKey)&&readAutoSyncIntervalUi()!==Infinity&&!document.hidden;}catch(_){live=false;}
if(live){try{window.__mkAccountSyncCountdownTimer=window.setInterval(updateAutoSyncCountdownUi,1000);}catch(_){}}};const onCountdownVisibility=()=>startCountdownTicker();window.addEventListener("mk-account-auto-sync-timer-change",startCountdownTicker);window.addEventListener("mk-account-sync-complete",startCountdownTicker);window.addEventListener("mk-account-auto-sync-interval-change",startCountdownTicker);document.addEventListener("visibilitychange",onCountdownVisibility,{passive:true});startCountdownTicker();updateSyncIntervalUi(syncIntervalSlider.value,false);syncIntervalCard.appendChild(syncIntervalHead);syncIntervalCard.appendChild(syncIntervalSlider);syncIntervalCard.appendChild(syncIntervalValue);syncIntervalCard.appendChild(syncIntervalTicks);syncIntervalCard.appendChild(syncIntervalHint);syncBox.appendChild(syncIntervalCard);const progressWrap=el("div","mk-account-sync-steps-card");const syncStepDetail=el("div","mk-account-sync-step-detail","No sync running.");const syncStepDefs=[[1,"Prepare","Prepare local data."],[2,"Download","Download cloud data."],[3,"Merge","Merge both records."],[4,"Upload","Save merged data to the cloud."],[5,"Verify","Check the cloud copy."],[6,"Repair","Fix any mismatch."],[7,"Finish","Refresh account totals."],];const syncStepList=el("ol","mk-account-sync-steps");const syncStepNodes={};syncStepDefs.forEach(([num,title,help])=>{const row=el("li","mk-account-sync-step");row.dataset.step=String(num);const icon=el("span","mk-account-sync-step-icon",String(num));const copy=el("span","mk-account-sync-step-copy");copy.innerHTML=`<strong title="${escapeAttr(help)}">${escapeHtml(title)}</strong><small>${escapeHtml(help)}</small>`;row.appendChild(icon);row.appendChild(copy);syncStepList.appendChild(row);syncStepNodes[num]={row,icon,copy};});const setSyncStepState=(step,state)=>{const node=syncStepNodes[step];if(!node)return;node.row.classList.remove("is-active","is-done","is-error");if(state)node.row.classList.add(`is-${state}`);node.icon.textContent=state==="done"?"✓":(state==="error"?"!":String(step));};const resetSyncSteps=()=>{syncStepDefs.forEach(([num])=>setSyncStepState(num,""));syncStepDetail.classList.remove("is-error");syncStepDetail.textContent="No sync running.";};const updateSyncSteps=(currentStep,mode,detail)=>{const step=Math.max(1,Math.min(syncStepDefs.length,Number(currentStep||1)));const def=syncStepDefs[step-1]||[step,`Step ${step}`,"Syncing…"];syncStepDetail.classList.toggle("is-error",mode==="error");syncStepDefs.forEach(([num])=>{if(mode==="success")setSyncStepState(num,"done");else if(mode==="error"){if(num<step)setSyncStepState(num,"done");else if(num===step)setSyncStepState(num,"error");else setSyncStepState(num,"");}else{if(num<step)setSyncStepState(num,"done");else if(num===step)setSyncStepState(num,"active");else setSyncStepState(num,"");}});if(mode==="success")syncStepDetail.textContent=detail||"All 7 steps completed. Local and cloud fingerprints matched.";else if(mode==="error")syncStepDetail.textContent=`Step ${step}/7 failed: ${detail || def[2] || "Stopped here."}`;else syncStepDetail.textContent=`Step ${step}/7: ${detail || def[2] || "Running now…"}`;};resetSyncSteps();progressWrap.appendChild(syncStepList);progressWrap.appendChild(syncStepDetail);const reviewSyncHistory=el("button","mk-comment-small-btn","Review and recover local history");reviewSyncHistory.type="button";reviewSyncHistory.hidden=true;reviewSyncHistory.setAttribute("data-sync-history-review","");progressWrap.appendChild(reviewSyncHistory);syncBox.appendChild(progressWrap);const historyRecovery=mountAccountHistoryRecovery(syncBox,syncSection.section,{onRetrySync:()=>{if(!syncAll.isConnected||syncAll.disabled)return{ok:false,error:"Wait for the current sync to finish, then use Sync now."};syncAll.click();return{ok:true};}});host.__mkAccountHistoryRecoveryCleanup=historyRecovery.destroy;reviewSyncHistory.addEventListener("click",()=>historyRecovery.refresh({reveal:true,focus:true}));renderSyncStatus();try{const initialSummary=readAccountSyncSummary();if(readLocalProfile().accountKey){const CLOUD_STATUS_TTL_MS=60000;const summaryAge=Date.now()-Number(initialSummary&&(initialSummary.updatedAt||initialSummary.finishedAt)||0);if(initialSummary&&summaryAge>=0&&summaryAge<CLOUD_STATUS_TTL_MS){renderSyncStatus(initialSummary);}else{renderSyncStatus(initialSummary,"Refreshing cloud status…");refreshAccountCloudStatusForDisplay().then((fresh)=>{const current=readAccountSyncSummary();if(shouldRenderCloudStatusSummary(fresh,current))renderSyncStatus(fresh);else renderSyncStatus(current);}).catch(()=>renderSyncStatus(readAccountSyncSummary()));}}}catch(_){}
syncSection.body.appendChild(syncBox);wrap.appendChild(syncSection.section);const devicesSection=makeAccountSection("Connected devices","Manage this browser and other connected devices.","mk-account-section--devices");const deviceBox=el("div","mk-account-section-content mk-local-devices-card");const currentDeviceRow=el("div","mk-local-account-action-row mk-current-device-row");const currentDeviceText=el("div","mk-local-account-action-title");currentDeviceText.innerHTML=`<strong>This device</strong><small>${escapeHtml(getDeviceName())}</small>`;const renameDevice=iconButton("mk-comment-small-btn","edit","Rename this device");renameDevice.type="button";currentDeviceRow.appendChild(currentDeviceText);currentDeviceRow.appendChild(renameDevice);const deviceList=el("div","mk-local-device-list");const fromRow=el("div","mk-local-account-action-row");fromRow.appendChild(el("div","mk-local-account-action-title",profile.accountKey?"Switch to another account.":"Connect this browser to an existing account."));const connect=iconButton("mk-comment-small-btn","link",profile.accountKey?"Switch account":"Enter access code");connect.type="button";const scanAccountQr=iconButton("mk-comment-small-btn","scan","Scan QR");scanAccountQr.type="button";fromRow.appendChild(connect);const toRow=el("div","mk-local-account-action-row");toRow.appendChild(el("div","mk-local-account-action-title","Create a one-time code for another device."));const gen=iconButton("mk-comment-small-btn","link","Generate one-time code");gen.type="button";toRow.appendChild(gen);const deviceCodeOut=el("div","mk-account-code-output");deviceCodeOut.hidden=true;deviceBox.appendChild(currentDeviceRow);deviceBox.appendChild(deviceList);deviceBox.appendChild(toRow);deviceBox.appendChild(deviceCodeOut);devicesSection.body.appendChild(deviceBox);wrap.appendChild(devicesSection.section);const accountSection=makeAccountSection("Account access","Sign out here or manage access codes.","mk-account-section--access");const accountBox=el("div","mk-account-section-content mk-local-account-actions");const recoveryRow=el("div","mk-local-account-action-row");recoveryRow.appendChild(el("div","mk-local-account-action-title","Create or change your permanent recovery code."));const recoveryGen=iconButton("mk-comment-small-btn","key","Create or change permanent code");recoveryGen.type="button";recoveryRow.appendChild(recoveryGen);const recoverRow=el("div","mk-local-account-action-row");recoverRow.appendChild(el("div","mk-local-account-action-title","Use a saved permanent code."));const recover=iconButton("mk-comment-small-btn","key","Use saved code");recover.type="button";recoverRow.appendChild(recover);const accessCodeOut=el("div","mk-account-code-output");accessCodeOut.hidden=true;const unlinkRow=el("div","mk-local-account-action-row");const unlinkText=el("div","mk-local-account-action-title");unlinkText.innerHTML=`<strong>Remove from this browser</strong><small>Signs out here only. Cloud data and public comments stay unchanged.</small>`;const unlinkBtn=iconButton("mk-comment-small-btn","logout","Remove account from this browser");unlinkBtn.type="button";unlinkBtn.disabled=!profile.accountKey;unlinkRow.appendChild(unlinkText);unlinkRow.appendChild(unlinkBtn);const deleteRow=el("div","mk-local-account-action-row");const deleteText=el("div","mk-local-account-action-title");deleteText.innerHTML=`<strong>Delete account</strong><small>Deletes the cloud profile and synced learning data permanently.</small>`;const deleteBtn=iconButton("mk-comment-small-btn mk-comment-danger-btn","trash","Delete account permanently");deleteBtn.type="button";deleteBtn.disabled=!profile.accountKey;deleteRow.appendChild(deleteText);deleteRow.appendChild(deleteBtn);accountBox.appendChild(fromRow);accountBox.appendChild(recoveryRow);if(!profile.accountKey)accountBox.appendChild(recoverRow);accountBox.appendChild(accessCodeOut);accountBox.appendChild(unlinkRow);accountBox.appendChild(deleteRow);accountSection.body.appendChild(accountBox);wrap.appendChild(accountSection.section);connect.addEventListener("click",async()=>{const curr=readLocalProfile();const nm=window.prompt(curr.accountKey?"Username on the account you want to switch to:":"Username on the existing account:",curr.accountKey?"":(curr.name||""));if(!nm)return;const code=window.prompt("Access code:","");if(!code)return;connect.disabled=true;scanAccountQr.disabled=true;const res=await claimAccountAccessCode(nm,code,"manual-access-code");connect.disabled=false;scanAccountQr.disabled=false;if(!res||!res.ok){window.alert((res&&res.error)||"Could not connect to this account. Use a fresh one-time code or the saved permanent access code for that username.");return;}
window.alert(curr.accountKey?"This browser has switched to the selected account.":"This browser is now connected to your account.");refreshInfo();});gen.addEventListener("click",async()=>{gen.disabled=true;deviceCodeOut.hidden=true;const res=await createSyncCode();gen.disabled=false;deviceCodeOut.hidden=false;if(!res||!res.ok){deviceCodeOut.textContent=(res&&res.error)||"Could not create an access code.";return;}
const loginUrl=accountLoginUrlFromCode(res);deviceCodeOut.innerHTML=`<strong>${escapeHtml(res.code)}</strong><span>one-time access code, expires in 10 minutes</span>${loginUrl ? `<a class="mk-account-qr-link"href="${escapeAttr(loginUrl)}"target="_blank"rel="noreferrer">Open QR login link</a>` : ""}`;});recoveryGen.addEventListener("click",async()=>{const custom=window.prompt("Enter a custom permanent access code, or leave this blank to generate one automatically. Use at least 8 letters or numbers.","");if(custom==null)return;if(String(custom||"").trim()&&String(custom||"").replace(/[^a-zA-Z0-9]/g,"").length<8){window.alert("Permanent access code must contain at least 8 letters or numbers.");return;}
if(!window.confirm("Save this as the permanent access code for this account? This replaces any old saved code."))return;recoveryGen.disabled=true;accessCodeOut.hidden=true;const res=await createRecoveryCode(custom);recoveryGen.disabled=false;accessCodeOut.hidden=false;if(!res||!res.ok){accessCodeOut.textContent=(res&&res.error)||"Could not save the permanent access code.";return;}
accessCodeOut.innerHTML=`<strong>${escapeHtml(res.code)}</strong><span>save this permanent access code now. It replaces the previous saved code.</span>`;});recover.addEventListener("click",async()=>{const curr=readLocalProfile();const nm=window.prompt("Username on the account:",curr.name||"");if(!nm)return;const code=window.prompt("Permanent access code:","");if(!code)return;recover.disabled=true;const res=await claimAccountAccessCode(nm,code,"saved-access-code");recover.disabled=false;if(!res||!res.ok){window.alert((res&&res.error)||"Could not connect to this account.");return;}
window.alert("This browser is now connected to your account.");refreshInfo();});const setSyncButtonLoading=(loading)=>{syncAll.disabled=!!loading;syncAll.classList.toggle("is-loading",!!loading);syncAll.innerHTML=loading?`${commentSvgIcon("sync", 18)}<span>Syncing</span>`:"Sync now";updateAutoSyncCountdownUi();};syncAll.addEventListener("click",async()=>{if(syncAll.disabled)return;reviewSyncHistory.hidden=true;setSyncButtonLoading(true);const started=Date.now();let lastPct=6;let lastProgressInfo=null;progressWrap.classList.remove("is-error");resetSyncSteps();updateSyncSteps(1,"active","Starting sync.");const showProgress=(info)=>{const p=info&&typeof info==="object"?info:{};lastProgressInfo=p;const step=Math.max(1,Number(p.step||1));const total=Math.max(step,Number(p.total||7));const chunkIndex=Number(p.chunkIndex||0);const chunkCount=Number(p.chunkCount||0);const chunkBonus=chunkCount>0?Math.min(0.85,Math.max(0,chunkIndex/Math.max(1,chunkCount))*(100/total)*0.72):0;const rawPct=Math.max(6,Math.min(96,Math.round(((step-1)/total)*100+5+chunkBonus)));lastPct=Math.max(lastPct,rawPct);const text=p.text||accountSyncProgressText(step,total,p.label||"Syncing account data",p.extra||"");const elapsed=((Date.now()-started)/1000).toFixed(1);updateSyncSteps(step,"active",`${p.label || "Running"}${p.extra ? `· ${p.extra}` : ""}`);const detailBits=[];if(chunkCount)detailBits.push(`chunk ${chunkIndex || 0}/${chunkCount}`);if(p.eventCount!=null)detailBits.push(`${p.eventCount} events`);if(p.bytes!=null)detailBits.push(`${Math.round(Number(p.bytes || 0) / 1024)} KB`);if(p.difference)detailBits.push(`local-only ${p.difference.localOnly || 0}, cloud-only ${p.difference.cloudOnly || 0}`);syncStepDetail.textContent=`Step ${step}/7: ${text} · ${elapsed}s${detailBits.length ? `· ${detailBits.join(" · ")}` : ""}`;renderSyncStatus(readAccountSyncSummary(),`Syncing: ${text}`);};showProgress({step:1,total:7,label:"Starting account sync"});const res=await syncAllAccountDataNow({force:true,reason:"account-panel-manual",timeoutMs:ACCOUNT_SYNC_MANUAL_TIMEOUT_MS,onProgress:showProgress,}).catch((err)=>({ok:false,error:err&&err.message||"Sync failed",lastProgress:lastProgressInfo}));setSyncButtonLoading(false);nameBox.textContent=readLocalProfile().name||"No username yet";if(!res||res.ok===false||res.importedOk===false||res.accountJsonOk===false){progressWrap.classList.add("is-error");const failureSummary=(res&&(res.accountJsonSummary||res.accountDataSummary))||res||readAccountSyncSummary();const fp=res&&(res.failureStep||res.lastProgress)||lastProgressInfo||failureSummary&&(failureSummary.failureStep||failureSummary.lastProgress);const atStep=fp?` at Step ${fp.step || "?"}/${fp.total || "?"} (${fp.label || "syncing"}${fp.extra ? `,${fp.extra}` : ""})`:"";const msg=(res&&res.error)||(failureSummary&&failureSummary.error)||"Sync failed. Nothing was cleared. Please try again after checking the connection.";const failedStepNum=fp&&fp.step?fp.step:7;updateSyncSteps(failedStepNum,"error",msg);syncStepDetail.textContent=`Sync failed${atStep}: ${msg}`;renderSyncStatus(failureSummary,`Sync failed${atStep}: ${msg}`);if(res&&res.code==="local_history_unreadable"||failureSummary&&failureSummary.code==="local_history_unreadable"||/Local history.*could not be safely read/i.test(String(msg))){reviewSyncHistory.hidden=false;historyRecovery.refresh({reveal:true,focus:true});}
return;}
const successSummary=(res&&(res.accountJsonSummary||res.accountDataSummary))||res||readAccountSyncSummary();const localAfter=accountSyncLiveLocalStatsNow();const cloudAfter=accountSyncSummaryCloudTargetStats(successSummary,localAfter)||(successSummary&&successSummary.server&&successSummary.server.after)||null;const missingAfter=accountJsonStatsMissing(localAfter,cloudAfter);const extraAfter=accountJsonStatsExtraLocal(localAfter,cloudAfter);const exactFlag=!!(successSummary&&successSummary.server&&(successSummary.server.localCloudExact===true||successSummary.server.cloudCanonicalExact===true));if(!exactFlag){progressWrap.classList.add("is-error");const msg=`Sync ended, but the final panel check is still not aligned. Missing from this device: ${missingAfter.total}; extra on this device: ${extraAfter.total}.`;const failure=Object.assign({},successSummary||{},{ok:false,error:msg,failureStep:{step:7,total:7,label:"Final panel verification failed",extra:`missing ${missingAfter.total}, extra ${extraAfter.total}`},lastProgress:{step:7,total:7,label:"Final panel verification failed",extra:`missing ${missingAfter.total}, extra ${extraAfter.total}`},afterLocal:localAfter,server:Object.assign({},successSummary&&successSummary.server||{},{after:cloudAfter,localCloudExact:false,difference:{localOnly:extraAfter.total,cloudOnly:missingAfter.total}}),updatedAt:Date.now(),finishedAt:0,completed:false,});writeAccountSyncSummary(failure);updateSyncSteps(7,"error",msg);syncStepDetail.textContent=`Sync failed at Step 7/7: ${msg}`;renderSyncStatus(failure,`Sync failed at Step 7/7: ${msg}`);return;}
progressWrap.classList.remove("is-error");try{writeAccountSyncSummary(successSummary);}catch(_){}
const serverInfo=successSummary&&successSummary.server||{};const eventCount=serverInfo.canonicalFingerprint&&serverInfo.canonicalFingerprint.eventCount||serverInfo.cloudFingerprint&&serverInfo.cloudFingerprint.eventCount||serverInfo.localFingerprint&&serverInfo.localFingerprint.eventCount;const compactNote=successSummary&&successSummary.localCompactedCache||serverInfo.localCompactedCache?" Cloud is complete; this device keeps a local cache.":"";updateSyncSteps(7,"success",eventCount?`Final check passed: ${eventCount} events in the cloud.${compactNote}`:`Final fingerprints matched.${compactNote}`);syncStepDetail.textContent=eventCount?`All 7 steps completed · ${eventCount} events verified in the cloud.${compactNote}`:`All 7 steps completed · cloud account file verified.${compactNote}`;renderSyncStatus(successSummary);try{refreshDevices();}catch(_){}
try{fetchAccountScore({force:true,reason:"post-account-sync"}).catch(()=>null);}catch(_){}});async function refreshDevices(){deviceList.innerHTML="";const curr=readLocalProfile();if(!curr.accountKey){deviceList.appendChild(el("div","mk-local-activity-meta","Connect an account to see synced devices."));return;}
const res=await fetchAccountDevices();if(!res||!res.ok){deviceList.appendChild(el("div","mk-local-activity-meta",(res&&res.error)?`Could not load devices: ${res.error}`:"Could not load devices."));return;}
const devices=(res.devices||[]).filter((d)=>d&&!d.revokedAt);const others=devices.filter((d)=>!d.current);if(!others.length){deviceList.appendChild(el("div","mk-local-activity-meta","No other connected devices."));return;}
others.forEach((d)=>{const row=el("div","mk-local-device-row"+(d.revokedAt?" is-revoked":""));const text=el("div","mk-local-device-text");text.innerHTML=`<strong>${escapeHtml(d.deviceName || "This device")}${d.revokedAt ? " · disconnected" : ""}</strong><small>Last seen: ${escapeHtml(localActivityTime(d.lastSeen || d.linkedAt || 0))}</small>`;row.appendChild(text);if(!d.revokedAt){const off=iconButton("mk-comment-small-btn mk-comment-danger-btn","x","Disconnect this device");off.type="button";off.addEventListener("click",async()=>{if(!window.confirm("Disconnect this device from your account?"))return;off.disabled=true;const out=await disconnectAccountDevice(d.visitorHash);if(!out||!out.ok)window.alert((out&&out.error)||"Could not disconnect this device.");refreshDevices();});row.appendChild(off);}
deviceList.appendChild(row);});}
renameDevice.addEventListener("click",async()=>{const nm=window.prompt("Name this device:",getDeviceName());if(nm==null)return;const clean=setDeviceNameLocal(nm);if(readLocalProfile().accountKey)await saveCurrentDeviceName(clean).catch(()=>null);refreshInfo();});refreshDevices();unlinkBtn.addEventListener("click",async()=>{if(!profile.accountKey)return;const accountContext=captureSocialAccountContext();if(!socialAccountContextIsCurrent(accountContext)||String(profile.accountKey).trim().toLowerCase()!==accountContext.accountKey){refreshInfo();return;}
if(!window.confirm("Remove this account from this browser? Your cloud account will not be deleted."))return;const deleteLocal=window.confirm("Also delete this account's local data from this browser?\n\nPress Cancel to keep its protected offline cache for the next login.");if(!socialAccountContextIsCurrent(accountContext)){refreshInfo();return;}
unlinkBtn.disabled=true;try{let res=null;try{res=await unlinkThisBrowserAccount();}catch(_){}
if(!socialAccountContextIsCurrent(accountContext)||(res&&res.error==="account_workspace_changed")){refreshInfo();return;}
const cleared=await clearLocalAccountState({clearActivity:deleteLocal});if(!cleared||!cleared.ok){window.alert(cleared&&cleared.error||"This browser could not remove the local account. Please retry.");return;}
window.alert(deleteLocal?"This browser is no longer connected, and its local account data was removed.":"This browser is no longer connected. Its local account data remains protected for the next login.");try{window.location.reload();}catch(_){refreshInfo();}}finally{unlinkBtn.disabled=!readLocalProfile().accountKey;}});deleteBtn.addEventListener("click",async()=>{if(!profile.accountKey)return;const accountContext=captureSocialAccountContext();if(!socialAccountContextIsCurrent(accountContext)||String(profile.accountKey).trim().toLowerCase()!==accountContext.accountKey){refreshInfo();return;}
if(!window.confirm("Delete this account permanently? Existing comments will remain visible as ‘Deleted account’."))return;const typed=window.prompt("Type DELETE to confirm permanent account deletion:","");if(String(typed||"").trim().toUpperCase()!=="DELETE")return;if(!socialAccountContextIsCurrent(accountContext)){refreshInfo();return;}
deleteBtn.disabled=true;try{const res=await deleteCurrentCloudAccount();if(!socialAccountContextIsCurrent(accountContext)){refreshInfo();return;}
if(!res||!res.ok){window.alert((res&&res.error)||"Could not delete this account.");return;}
const cleared=await clearLocalAccountState({clearActivity:true});if(!cleared||!cleared.ok){window.alert("The cloud account was deleted, but this browser could not finish clearing its local account. "+String(cleared&&cleared.error||"Please retry."));return;}
window.alert("The account has been deleted. Existing comments now show as Deleted account.");try{window.location.reload();}catch(_){refreshInfo();}}finally{deleteBtn.disabled=!readLocalProfile().accountKey;}});host.appendChild(wrap);historyRecovery.refresh();}
function privacyToggle(label,desc,key,privacy){const row=el("label","mk-privacy-row");const select=document.createElement("select");select.dataset.privacyKey=key;select.className="mk-privacy-select";[["private","Private"],["connections","Connections only"],["public","Public"],].forEach(([value,text])=>{const opt=document.createElement("option");opt.value=value;opt.textContent=text;select.appendChild(opt);});const p=normalisePrivacy(privacy,false);select.value=visibilityValue(p[key.replace(/Public$/,"Visibility")]||(p[key]?"public":"private"));const text=el("span","mk-privacy-text");text.innerHTML=`<strong>${escapeHtml(label)}</strong><small>${escapeHtml(desc)}</small>`;row.appendChild(select);row.appendChild(text);return row;}
function readPrivacyForm(host){const curr=normalisePrivacy(readLocalProfile().privacy,false);host.querySelectorAll("select[data-privacy-key]").forEach((input)=>{const boolKey=input.dataset.privacyKey;const visKey=boolKey.replace(/Public$/,"Visibility");curr[visKey]=visibilityValue(input.value);curr[boolKey]=curr[visKey]==="public";});return curr;}
function applyPrivacyToForm(host,privacy){const p=normalisePrivacy(privacy,false);host.querySelectorAll("select[data-privacy-key]").forEach((input)=>{const boolKey=input.dataset.privacyKey;const visKey=boolKey.replace(/Public$/,"Visibility");input.value=visibilityValue(p[visKey]||(p[boolKey]?"public":"private"));});}
function renderPrivacySettings(host){if(!host)return;host.innerHTML="";const profile=readLocalProfile();const accountContext=captureSocialAccountContext();const wrap=el("div","mk-privacy-card");wrap.appendChild(el("div","mk-local-activity-meta",profile.accountKey?"Saved to your cloud profile. Connections only means accepted study connections can see it.":"Save or connect a username first. Until then, activity stays private and local."));const p=normalisePrivacy(profile.privacy,profile.isPublic);const list=el("div","mk-privacy-list");list.appendChild(privacyToggle("Profile name & avatar, including intro","Who can open your profile card. Your avatar and intro appear on public rankings only when this is Public.","profilePublic",p));list.appendChild(privacyToggle("User rankings","Public lists your username, XP, quiz results, lifetime shop spending and mastered-concept count. Avatar and intro also require the Profile setting to be Public.","rankingPublic",p));list.appendChild(privacyToggle("Visit history","Who can see recently visited concepts.","visitsPublic",p));list.appendChild(privacyToggle("Saved pages","Who can see Favourites, Study later, and Review later.","actionsPublic",p));list.appendChild(privacyToggle("Comments","Who can see recent comments on your profile.","commentsPublic",p));list.appendChild(privacyToggle("Readiness","Whether readiness contributes to public averages and your profile.","readinessPublic",p));wrap.appendChild(list);const quick=el("div","mk-local-profile-actions mk-privacy-actions");const allPub=el("button","mk-privacy-action-btn","All public");const allConn=el("button","mk-privacy-action-btn","Connections only");const allPriv=el("button","mk-privacy-action-btn","All private");const save=el("button","mk-privacy-action-btn","Save settings");allPub.type=allConn.type=allPriv.type=save.type="button";allPub.addEventListener("click",()=>applyPrivacyToForm(wrap,defaultPrivacy(true)));allConn.addEventListener("click",()=>applyPrivacyToForm(wrap,defaultPrivacy("connections")));allPriv.addEventListener("click",()=>applyPrivacyToForm(wrap,defaultPrivacy(false)));save.addEventListener("click",async()=>{if(!socialAccountContextIsCurrent(accountContext)){renderPrivacySettings(host);return;}
const next=readPrivacyForm(wrap);save.disabled=true;const res=await savePrivacySettings(next);save.disabled=false;if(!socialAccountContextIsCurrent(accountContext)){renderPrivacySettings(host);return;}
if(!res||!res.ok){window.alert((res&&res.error)||"Could not save privacy settings. Save or connect a username first.");return;}
window.alert("Privacy settings saved.");renderPrivacySettings(host);try{refreshReadinessCardSoon(100);}catch(_){}});quick.appendChild(allPub);quick.appendChild(allConn);quick.appendChild(allPriv);quick.appendChild(save);wrap.appendChild(quick);host.appendChild(wrap);fetchPrivacySettings().then((res)=>{if(!socialAccountContextIsCurrent(accountContext))return;if(res&&res.ok&&res.privacy)applyPrivacyToForm(wrap,res.privacy);}).catch(()=>{});}
function connectionPersonHtml(item,kind){const nm=String(item&&item.otherName||"Unknown user").trim()||"Unknown user";const av=String(item&&item.otherAvatar||"").trim();const mode=String(kind||item&&item.direction||"").toLowerCase();const level=Math.max(1,Number(item&&item.level||1)||1);const totalXp=formatAccountXp(item&&item.totalXp||0);const statsHtml=mode==="accepted"?`<span class="mk-connection-person-stats"><span>Level ${escapeHtml(level)}</span><span>${escapeHtml(totalXp)} XP</span></span>`:"";const ts=mode==="accepted"?Number(item&&(item.updatedAt||item.createdAt)||0):Number(item&&item.createdAt||0);const date=connectionDateText(ts);let timeText="";if(mode==="accepted")timeText=[connectionDurationText(ts),date?`since ${date}`:""].filter(Boolean).join(" · ");else if(mode==="incoming")timeText=date?`Request received ${date}`:"";else if(mode==="outgoing")timeText=date?`Request sent ${date}`:"";return`<span class="mk-connection-person">${avatarHtml(nm, av, item && (item.avatarFrame || item.actorAvatarFrame) || "level-1")}<span class="mk-connection-person-copy"><span class="mk-connection-person-name">${escapeHtml(nm)}</span>${statsHtml}${timeText ? `<span class="mk-connection-person-time">${escapeHtml(timeText)}</span>` : ""}</span></span>`;}
async function renderConnections(host){if(!host)return;host.innerHTML="";const profile=readLocalProfile();const wrap=el("div","mk-connections-card");wrap.appendChild(el("div","mk-local-activity-empty",profile.accountKey?"Study connections can see profile sections set to Connections only.":"Save or connect a username before using study connections."));const form=el("form","mk-connection-request-form");const input=document.createElement("input");input.placeholder="Username to connect with";input.autocomplete="off";const send=iconButton("mk-comment-primary-btn","link","Send connection request");send.type="submit";form.appendChild(input);form.appendChild(send);const searchResults=el("div","mk-connection-search-results");let searchTimer=0;let searchSerial=0;const renderSearchResults=(users,query)=>{searchResults.innerHTML="";const arr=Array.isArray(users)?users:[];if(!query)return;if(!arr.length){searchResults.appendChild(el("div","mk-local-activity-empty mk-connection-search-empty","No matching usernames."));return;}
arr.forEach((user)=>{const row=el("div","mk-connection-search-row");const profileBtn=el("button","mk-connection-search-profile");profileBtn.type="button";profileBtn.innerHTML=connectionPersonHtml({otherName:user.name,otherAvatar:user.avatar,avatarFrame:user.avatarFrame},"search");profileBtn.addEventListener("click",()=>openPublicProfile(user.name||"",{accountKey:user.accountKey||"",source:"connections-search"}));row.appendChild(profileBtn);const status=connectionStatusText(user.connectionStatus);if(status)row.appendChild(el("span","mk-connection-search-status",status));const action=iconButton("mk-comment-small-btn"+(user.connectionStatus==="accepted"||user.connectionStatus==="outgoing"?" is-disabled":""),user.connectionStatus==="incoming"?"check":"link",user.connectionStatus==="incoming"?"Accept":user.connectionStatus==="accepted"?"Connected":user.connectionStatus==="outgoing"?"Request sent":"Add connection");action.type="button";action.disabled=user.connectionStatus==="accepted"||user.connectionStatus==="outgoing";action.addEventListener("click",async()=>{action.disabled=true;const res=user.connectionStatus==="incoming"?await respondConnection(user.accountKey,"accept"):await requestConnection(user.name||user.accountKey);if(!res||!res.ok){action.disabled=false;window.alert((res&&res.error)||"Could not update this connection.");return;}
window.alert(res.status==="accepted"?"You are now connected.":(res.alreadyPending?"Connection request was already sent.":"Connection request sent."));renderConnections(host);});row.appendChild(action);searchResults.appendChild(row);});};const runSearch=async()=>{const query=cleanProfileNameLocal(input.value||"");const serial=++searchSerial;if(!query){renderSearchResults([],"");return;}
searchResults.innerHTML="";searchResults.appendChild(el("div","mk-local-activity-empty mk-connection-search-empty","Searching usernames…"));const res=await searchConnections(query);if(serial!==searchSerial)return;if(!res||!res.ok){searchResults.innerHTML="";searchResults.appendChild(el("div","mk-local-activity-empty mk-connection-search-empty",(res&&res.error)||"Could not search usernames."));return;}
renderSearchResults(res.users||[],query);};input.addEventListener("input",()=>{window.clearTimeout(searchTimer);searchTimer=window.setTimeout(runSearch,220);});form.addEventListener("submit",async(ev)=>{ev.preventDefault();const target=cleanProfileNameLocal(input.value||"");if(!target){input.focus();return;}
send.disabled=true;const res=await requestConnection(target);send.disabled=false;if(!res||!res.ok){window.alert((res&&res.error)||"Could not send connection request.");return;}
input.value="";searchResults.innerHTML="";window.alert(res.status==="accepted"?"You are now connected.":(res.alreadyPending?"Connection request was already sent.":"Connection request sent."));renderConnections(host);});wrap.appendChild(form);wrap.appendChild(searchResults);const status=el("div","mk-local-activity-empty","Loading connections…");wrap.appendChild(status);host.appendChild(wrap);const data=await fetchConnections();status.remove();if(!data||!data.ok){wrap.appendChild(el("div","mk-local-activity-empty",(data&&data.error)||"Could not load connections."));return;}
const section=(title,arr,kind)=>{const h=document.createElement("h3");h.textContent=title;wrap.appendChild(h);if(!arr||!arr.length){wrap.appendChild(el("div","mk-local-activity-empty","None yet."));return;}
arr.forEach((item)=>{const row=el("div","mk-local-activity-row mk-connection-row");const main=el("div","mk-local-activity-main");main.innerHTML=connectionPersonHtml(item,kind);row.appendChild(main);const actions=el("div","mk-local-activity-actions");if(kind==="incoming"){const accept=iconButton("mk-comment-small-btn","check","Accept");const decline=iconButton("mk-comment-small-btn mk-comment-danger-btn","dismiss","Decline");accept.type=decline.type="button";accept.addEventListener("click",async()=>{accept.disabled=true;const r=await respondConnection(item.requesterKey,"accept");if(!r||!r.ok)window.alert((r&&r.error)||"Could not accept request.");else{markConnectionsSeen();window.alert("Connection request accepted.");}renderConnections(host);});decline.addEventListener("click",async()=>{decline.disabled=true;const r=await respondConnection(item.requesterKey,"decline");if(!r||!r.ok)window.alert((r&&r.error)||"Could not decline request.");else{markConnectionsSeen();window.alert("Connection request declined.");}renderConnections(host);});actions.appendChild(accept);actions.appendChild(decline);}else if(kind==="accepted"){const remove=el("button","mk-comment-small-btn mk-comment-danger-btn mk-connection-remove-btn");remove.type="button";remove.innerHTML=`${commentSvgIcon("trash", 16)}<span>Remove</span>`;remove.setAttribute("aria-label","Remove connection");remove.setAttribute("title","Remove connection");remove.addEventListener("click",async()=>{if(!window.confirm("Remove this study connection?"))return;remove.disabled=true;const r=await removeConnection(item.otherAccountKey);if(!r||!r.ok)window.alert((r&&r.error)||"Could not remove connection.");else window.alert("Connection removed. You can send a new request later.");renderConnections(host);});actions.appendChild(remove);}else{actions.appendChild(el("span","mk-local-activity-meta","pending"));}
row.appendChild(actions);wrap.appendChild(row);});};section("Study connections",data.connections||[],"accepted");section("Incoming requests",data.incoming||[],"incoming");section("Sent requests",data.outgoing||[],"outgoing");}
function notificationActorHtml(item){const keeper=isSystemKeeperNotification(item);const nm=keeper?"Wiki Keeper":(String(item&&item.actorName||"Anonymous").trim()||"Anonymous");const av=keeper?"🤖":String(item&&item.actorAvatar||"").trim();const frame=keeper?"level-10":(item&&(item.avatarFrame||item.actorAvatarFrame)||"level-1");return`<span class="mk-notification-actor">${avatarHtml(nm, av, frame)}<span class="mk-notification-actor-name">${escapeHtml(nm)}</span></span>`;}
async function activateXpCapBoostVoucher(voucherId){const id=String(voucherId||"").trim();if(!id)return false;const res=await apiPost("/xp-voucher/activate",{visitorId:getVisitorId(),voucherId:id});if(res&&res.ok){refreshAccountXpSoon("cap-boost-voucher",80);updateNotificationBadgesSoon(120);return true;}
window.alert((res&&res.error)||"Could not activate this voucher.");return false;}
async function openAnonymousCommentClaims(item){const res=await apiPost("/comments/claim-notice/seen",{visitorId:getVisitorId()});if(!res||!res.ok){window.alert((res&&res.error)||"Could not open the anonymous comment review.");return;}
setNotificationBadgeCount(0);try{const activity=await fetchCloudActivity();if(activity&&activity.ok)applyCloudActivity(activity);}catch(_){}
saveLocalFoldOpen(localFoldStateKey("activity","visits"),false);saveLocalFoldOpen(localFoldStateKey("activity","comments"),true);openLocalActivity("activity");window.setTimeout(()=>{try{const fold=document.querySelector('.mk-local-activity-modal details[data-fold-key="activity:comments"]');if(fold){fold.open=true;fold.scrollIntoView({block:"start",behavior:"smooth"});}}catch(_){}},80);updateNotificationBadgesSoon(120,{force:true,reason:"anonymous-comment-claim-open"});}
async function renderNotifications(host){if(!host)return;host.innerHTML="";host.appendChild(el("div","mk-local-activity-empty","Loading notifications…"));const qs=new URLSearchParams({visitorId:getVisitorId(),limit:"80"});const data=await apiGet(`/notifications?${qs.toString()}`);if(data&&data.ok)touchNotificationBadgeRefresh();host.innerHTML="";if(!data||!data.ok){host.appendChild(el("div","mk-local-activity-empty","Could not load notifications right now."));return;}
const arr=Array.isArray(data.notifications)?data.notifications:[];if(!arr.length){host.appendChild(el("div","mk-local-activity-empty","No notifications yet. Replies, emoji reactions, anonymous comment claims, connection updates, report reviews, and reward vouchers will appear here."));return;}
const intro=el("div","mk-local-activity-empty","Replies, emoji reactions, anonymous comment claims, connection updates, report reviews, and reward vouchers. Private users are shown as Anonymous.");host.appendChild(intro);arr.forEach((item)=>{const row=el("div","mk-local-activity-row mk-notification-row"+(item.type==="xp_cap_boost_voucher"?" is-xp-voucher":"")+(item.type==="anonymous_comment_claim"?" is-anonymous-claim":""));const main=el("div","mk-local-activity-main");const left=el("div","mk-notification-left");const line=el("div","mk-notification-line");let messageHtml="";if(item.type==="reply")messageHtml=`<span>replied to your comment</span>`;else if(item.type==="reaction")messageHtml=`<span>reacted ${escapeHtml(reactionSymbol(item.reaction))} to your comment</span>`;else if(item.type==="mention")messageHtml=`<span>mentioned you in a comment</span>`;else if(item.type==="connection_request")messageHtml=`<span>sent you a study connection request</span>`;else if(item.type==="connection_accepted")messageHtml=`<span>accepted your study connection request</span>`;else if(item.type==="connection_declined")messageHtml=`<span>declined your study connection request</span>`;else if(item.type==="connection_removed")messageHtml=`<span>removed your study connection</span>`;else if(item.type==="xp_cap_boost_voucher")messageHtml=`<span>sent you a Daily XP Cap Boost voucher</span>`;else if(item.type==="anonymous_comment_claim")messageHtml=`<span>${escapeHtml(item.notificationTitle || "found anonymous comments from this device")}</span>`;else if(item.notificationTitle||item.notificationMessage)messageHtml=`<span>${escapeHtml(item.notificationTitle || "sent you a notification")}</span>`;else messageHtml=`<span>sent you a notification</span>`;line.innerHTML=notificationActorHtml(item)+messageHtml;left.appendChild(line);if(item.path){const a=el("a","mk-local-activity-link",activityTitle(item));a.href=pageHref(item.path||"");a.setAttribute("data-path",normActivityTitlePath(item.path||""));left.appendChild(a);}
const meta=el("div","mk-local-activity-meta");meta.appendChild(el("span","",localActivityTime(item.createdAt)));if(item.type==="reaction"&&item.reaction)meta.appendChild(el("span","",reactionSymbol(item.reaction)));if(item.type==="reply")meta.appendChild(el("span","","reply"));if(item.type==="mention")meta.appendChild(el("span","","mention"));if(item.type==="connection_request")meta.appendChild(el("span","","connection request"));if(item.type==="connection_accepted")meta.appendChild(el("span","","connection accepted"));if(item.type==="connection_declined")meta.appendChild(el("span","","connection declined"));if(item.type==="connection_removed")meta.appendChild(el("span","","connection removed"));if(item.type==="xp_cap_boost_voucher")meta.appendChild(el("span","",voucherStateText(item)));if(item.type==="anonymous_comment_claim")meta.appendChild(el("span","",`${Math.max(1, Number(item.claimableCount || 1))} available`));const sourceLabel=notificationSourceLabel(item.notificationSource||item.voucherSource||"");if(sourceLabel)meta.appendChild(el("span","",sourceLabel));left.appendChild(meta);main.appendChild(left);if(item.type==="connection_request"&&item.actorAccountKey){const action=el("div","mk-notification-action");const accept=el("button","mk-comment-small-btn","Accept");const decline=el("button","mk-comment-small-btn mk-comment-danger-btn","Decline");accept.type=decline.type="button";accept.addEventListener("click",async()=>{accept.disabled=decline.disabled=true;const res=await respondConnection(item.actorAccountKey,"accept");if(!res||!res.ok){accept.disabled=decline.disabled=false;window.alert((res&&res.error)||"Could not accept connection request.");return;}
markConnectionsSeen();window.alert("Connection request accepted.");updateNotificationBadgesSoon(0,{force:true,reason:"connection-response"});renderNotifications(host);});decline.addEventListener("click",async()=>{accept.disabled=decline.disabled=true;const res=await respondConnection(item.actorAccountKey,"decline");if(!res||!res.ok){accept.disabled=decline.disabled=false;window.alert((res&&res.error)||"Could not decline connection request.");return;}
markConnectionsSeen();window.alert("Connection request declined.");updateNotificationBadgesSoon(0,{force:true,reason:"connection-response"});renderNotifications(host);});action.appendChild(accept);action.appendChild(decline);main.appendChild(action);}
if(item.type==="xp_cap_boost_voucher"&&!item.voucherUsed&&item.voucherId){const action=el("div","mk-notification-action");const act=el("button","mk-comment-small-btn","Activate");act.type="button";act.title="Activate this voucher to double today's total XP cap and each action daily cap until 23:59:59 UTC.";act.addEventListener("click",async()=>{act.disabled=true;if(await activateXpCapBoostVoucher(item.voucherId))renderNotifications(host);else act.disabled=false;});action.appendChild(act);main.appendChild(action);}
if(item.type==="anonymous_comment_claim"){const action=el("div","mk-notification-action");const review=el("button","mk-comment-small-btn mk-comment-reveal-name",`Review ${Math.max(1, Number(item.claimableCount || 1))}`);review.type="button";review.addEventListener("click",async()=>{review.disabled=true;await openAnonymousCommentClaims(item);review.disabled=false;});action.appendChild(review);main.appendChild(action);}
row.appendChild(main);if(item.notificationMessage){row.appendChild(el("div","mk-local-activity-text",previewText(item.notificationMessage,420)));}
if(item.replyText){row.appendChild(el("div","mk-local-activity-text",`Reply: ${previewText(item.replyText, 260)}`));}
if(item.commentText){const label=isReportReviewNotification(item)?"Reported item: ":"Your comment: ";row.appendChild(el("div","mk-local-activity-text mk-notification-context",`${label}${previewText(item.commentText, 260)}`));}
host.appendChild(row);});}
async function revealAnonymousCommentFromActivity(item){if(!item||!item.id)return false;const profile=readLocalProfile();const displayName=cleanProfileNameLocal(profile&&profile.name||"");const ok=window.confirm(`Show ${displayName || "your account name"} on this comment? This cannot be undone. The comment reward will be added once.`);if(!ok)return false;const res=await apiPost("/comments/reveal",{visitorId:getVisitorId(),commentId:item.id});if(!res||!res.ok){window.alert((res&&res.error)||"Could not reveal your name on this comment.");return false;}
const comments=getLocalComments().map((x)=>x&&x.id===item.id?Object.assign({},x,{anonymous:false,name:(res.profile&&res.profile.name)||displayName||x.name||""}):x).filter(Boolean);writeLocalArray(LOCAL_COMMENTS_KEY,comments,300);activityChanged("comment-revealed",{id:item.id,path:item.path||""});try{document.querySelectorAll(".mk-comment-list").forEach((list)=>{loadCommentsInto(list,{silent:true,keepExistingOnError:true}).catch(()=>{});});}catch(_){}
invalidateAccountXpCache();refreshAccountXpSoon("anonymous-comment-revealed",80);updateNotificationBadgesSoon(120,{force:true,reason:"anonymous-comment-revealed"});return true;}
function makeLocalActivityRow(item,type,rootHost,rootType){const row=el("div","mk-local-activity-row"+(type==="comments"?" mk-local-comment-activity-row":"")+(item.deleted?" is-deleted":"")+(type==="comments"&&item.anonymous&&!item.deleted?" is-anonymous-comment":""));const main=el("div","mk-local-activity-main");const left=el("div","");const a=el("a","mk-local-activity-link",activityTitle(item));a.href=pageHref(item.path||"");a.setAttribute("data-path",normActivityTitlePath(item.path||""));left.appendChild(a);const meta=el("div","mk-local-activity-meta");if(type==="saved"){meta.appendChild(el("span","",pageActionLabels()[item.action]||"Saved"));const when=localActivityTime(item.ts||item.deletedAt);if(when)meta.appendChild(el("span","",when));}else{meta.appendChild(el("span","",localActivityTime(item.ts||item.deletedAt)));}
if(item.deleted)meta.appendChild(el("span","","deleted"));if(type==="comments"&&item.editedAt&&!item.deleted)meta.appendChild(el("span","","edited"));if(type==="comments"&&item.parentId)meta.appendChild(el("span","","reply"));if(type==="comments"&&item.anonymous&&!item.deleted)meta.appendChild(el("span","","anonymous · no reward yet"));left.appendChild(meta);main.appendChild(left);row.appendChild(main);if(type==="comments"){row.appendChild(el("div","mk-local-activity-text",previewText(item.text,260)));if(!item.deleted&&item.id){const actions=el("div","mk-local-activity-actions");if(item.anonymous){const reveal=el("button","mk-comment-small-btn mk-comment-reveal-name","Show my name");reveal.type="button";reveal.title="Reveal your account name on this comment and receive its XP/EORbits reward once.";reveal.addEventListener("click",async()=>{reveal.disabled=true;const done=await revealAnonymousCommentFromActivity(item);reveal.disabled=false;if(done)renderLocalActivityList(rootHost,rootType||type);});actions.appendChild(reveal);}
const edit=iconButton("mk-comment-small-btn mk-comment-owner-btn","edit","Edit");edit.type="button";edit.addEventListener("click",async()=>{const next=window.prompt("Edit your comment:",item.text||"");if(next==null)return;const tx=String(next||"").trim();if(!tx)return;edit.disabled=true;const done=await editOwnComment(item.id,item.path||currentPath(),tx);edit.disabled=false;if(done)renderLocalActivityList(rootHost,rootType||type);});actions.appendChild(edit);const del=iconButton("mk-comment-small-btn mk-comment-owner-btn","trash","Delete from page");del.type="button";del.addEventListener("click",async()=>{del.disabled=true;const done=await deleteOwnComment(item.id,item.path||currentPath());del.disabled=false;if(done)renderLocalActivityList(rootHost,rootType||type);});actions.appendChild(del);row.appendChild(actions);}}
return row;}
function appendRowsTo(host,arr,type,rootHost,rootType,limit){const list=(arr||[]).slice(0,Number(limit)||80);if(!list.length){host.appendChild(el("div","mk-local-activity-empty",type==="comments"?"No comments yet.":type==="saved"?"No saved pages yet.":"No visit history yet."));return;}
list.forEach((item)=>host.appendChild(makeLocalActivityRow(item,type,rootHost,rootType)));}
const LOCAL_FOLD_OPEN_STATE=new Map();function localFoldStateKey(scope,title){return String(scope||"local")+":"+String(title||"section").toLowerCase().replace(/\s+/g,"-");}
function readLocalFoldOpen(key,defaultOpen){const k=String(key||"");if(!k)return!!defaultOpen;if(LOCAL_FOLD_OPEN_STATE.has(k))return LOCAL_FOLD_OPEN_STATE.get(k)===true;try{const raw=sessionStorage.getItem("mk_local_fold_open_v1:"+k);if(raw==="1"||raw==="0"){const value=raw==="1";LOCAL_FOLD_OPEN_STATE.set(k,value);return value;}}catch(_){}
return!!defaultOpen;}
function saveLocalFoldOpen(key,open){const k=String(key||"");if(!k)return;const value=!!open;LOCAL_FOLD_OPEN_STATE.set(k,value);try{sessionStorage.setItem("mk_local_fold_open_v1:"+k,value?"1":"0");}catch(_){}}
function makeFoldSection(title,count,open,key){const details=document.createElement("details");details.className="mk-local-fold-section";const foldKey=key||localFoldStateKey("local",title);details.dataset.foldKey=foldKey;if(readLocalFoldOpen(foldKey,open))details.open=true;const summary=document.createElement("summary");summary.className="mk-local-fold-summary";summary.innerHTML=`<span>${escapeHtml(title)}</span><span class="mk-local-fold-count">${Number(count) || 0}</span>`;const body=el("div","mk-local-fold-body");details.appendChild(summary);details.appendChild(body);details.addEventListener("toggle",()=>saveLocalFoldOpen(foldKey,details.open));return{details,body};}
function renderSavedPagesGrouped(host,pageActions,rootHost,rootType){const actions=(pageActions||[]).filter((x)=>x&&isActiveSavedPageAction(x.action));if(!actions.length){host.appendChild(el("div","mk-local-activity-empty","No saved pages yet."));return;}
const groups=[["favorite","Favourites"],["study_later","Study later"],["review_later","Review later"],];groups.forEach(([action,label])=>{const arr=actions.filter((x)=>x.action===action);const sec=makeFoldSection(label,arr.length,false,localFoldStateKey("saved-v19",action));if(arr.length){const context=captureSocialAccountContext();let shown=0;const more=el("button","mk-comment-small-btn mk-local-saved-more","Show more");more.type="button";more.setAttribute("aria-label",`Show more ${label.toLowerCase()}`);const appendBatch=()=>{const batch=arr.slice(shown,shown+80);more.remove();appendRowsTo(sec.body,batch,"saved",rootHost||host,rootType||"saved",80);shown+=batch.length;if(shown<arr.length)sec.body.appendChild(more);};more.addEventListener("click",()=>{if(!more.isConnected||!socialAccountContextIsCurrent(context))return;const restoreFocus=document.activeElement===more;const firstNewIndex=shown;appendBatch();refreshActivityLinkTitles(sec.body);if(restoreFocus){const target=more.isConnected?more:sec.body.querySelectorAll(".mk-local-activity-link")[firstNewIndex];try{target&&target.focus();}catch(_){}}});appendBatch();}
else sec.body.appendChild(el("div","mk-local-activity-empty","None yet."));host.appendChild(sec.details);});}
function renderCombinedActivity(host,visits,comments,pageActions){const visitSec=makeFoldSection("Visit history",(visits||[]).length,true,localFoldStateKey("activity","visits"));appendRowsTo(visitSec.body,visits,"visits",host,"activity",40);host.appendChild(visitSec.details);const commentSec=makeFoldSection("Comments and replies",(comments||[]).length,true,localFoldStateKey("activity","comments"));appendRowsTo(commentSec.body,comments,"comments",host,"activity",40);host.appendChild(commentSec.details);}
async function renderLocalActivityList(host,type){if(!host)return;disposeAccountHistoryRecovery(host);if(type==="info"){renderProfileInfo(host);return;}
if(type==="privacy"){renderPrivacySettings(host);return;}
if(type==="connections"){renderConnections(host);return;}
if(type==="notifications"){renderNotifications(host);return;}
if(type==="shop"){renderAccountShop(host);return;}
const visits=getLocalVisitsForSync();const comments=getLocalComments();const pageActions=getLocalPageActions().filter((x)=>x&&isActiveSavedPageAction(x.action));host.innerHTML="";if(type==="activity"){renderCombinedActivity(host,visits,comments,pageActions);refreshActivityLinkTitles(host);return;}
if(type==="saved"){renderSavedPagesGrouped(host,pageActions,host,"saved");refreshActivityLinkTitles(host);return;}
const arr=type==="comments"?comments:visits;if(!arr.length){const emptyText=type==="comments"?"No comments yet.":"No visit history yet.";host.appendChild(el("div","mk-local-activity-empty",emptyText));return;}
appendRowsTo(host,arr,type==="comments"?"comments":"visits",host,type,80);refreshActivityLinkTitles(host);}
const LOCAL_ACCOUNT_PANEL_HEIGHT_KEY="mk_local_account_panel_height_v1";function applyStoredAccountPanelHeight(panel){try{localStorage.removeItem(LOCAL_ACCOUNT_PANEL_HEIGHT_KEY);}catch(_){}
if(panel&&panel.style){try{panel.style.minHeight="";panel.style.height="";}catch(_){}}}
function rememberAccountPanelHeight(panel,type){try{localStorage.removeItem(LOCAL_ACCOUNT_PANEL_HEIGHT_KEY);}catch(_){}
if(panel&&panel.style){try{panel.style.minHeight="";panel.style.height="";}catch(_){}}}
function openLocalActivity(type){ensureStylesOnce();const initial=["info","privacy","notifications","connections","saved","activity","shop","visits","comments"].includes(type)?type:"info";const existing=document.querySelector(".mk-local-activity-modal");if(existing){if(typeof existing.__mkCloseDialog==="function")existing.__mkCloseDialog();else existing.remove();}
const modal=document.createElement("div");modal.className="mk-local-activity-modal mk-local-activity-modal--account";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");modal.innerHTML=`
      <div class="mk-local-activity-panel" role="document">
        <div class="mk-local-activity-head">
          <div>
            <div class="mk-local-activity-title">Account</div>
          </div>
          <button type="button" class="mk-local-activity-close mk-comment-icon-btn" ${iconButtonAttrs("Close")}>${iconButtonHtml("x", "Close")}</button>
        </div>
        <div class="mk-local-activity-tabs" role="tablist" aria-label="Account sections">
          <button type="button" class="mk-local-activity-tab mk-comment-icon-btn" data-type="info" ${iconButtonAttrs("Account")}>${iconButtonHtml("info", "Account")}</button>
          <button type="button" class="mk-local-activity-tab mk-comment-icon-btn" data-type="privacy" ${iconButtonAttrs("Privacy")}>${iconButtonHtml("shield", "Privacy")}</button>
          <button type="button" class="mk-local-activity-tab mk-comment-icon-btn" data-type="notifications" ${iconButtonAttrs("Notifications")}>${iconButtonHtml("bell", "Notifications")}<span class="mk-notif-badge" data-mk-notification-badge hidden>0</span></button>
          <button type="button" class="mk-local-activity-tab mk-comment-icon-btn" data-type="connections" ${iconButtonAttrs("Connections")}>${iconButtonHtml("link", "Connections")}<span class="mk-notif-badge" data-mk-connection-badge hidden>0</span></button>
          <button type="button" class="mk-local-activity-tab mk-comment-icon-btn" data-type="saved" ${iconButtonAttrs("Saved pages")}>${iconButtonHtml("bookmark", "Saved pages")}</button>
          <button type="button" class="mk-local-activity-tab mk-comment-icon-btn" data-type="activity" ${iconButtonAttrs("Activity")}>${iconButtonHtml("clock", "Activity")}</button>
          <button type="button" class="mk-local-activity-tab mk-comment-icon-btn mk-account-shop-tab" data-type="shop" ${iconButtonAttrs("Store")}>${iconButtonHtml("shop", "Store")}<span class="mk-shop-discount-badge" data-mk-shop-discount-badge hidden>1</span></button>
          <button type="button" class="mk-local-activity-tab mk-comment-icon-btn mk-account-qr-tab" data-action="login-qr" ${iconButtonAttrs("Login QR")}>${iconButtonHtml("qrcode", "Login QR")}</button>
        </div>
        <div class="mk-local-activity-body"></div>
      </div>`;document.body.appendChild(modal);try{document.documentElement.classList.add("mk-local-activity-open");document.body.classList.add("mk-local-activity-open");if(!mkLocalIsTouchLikeViewport())lockPageBehindModal();else unlockPageBehindModal();}catch(_){}
try{mkLocalBindViewportMetricsOnce();mkLocalUpdateViewportMetrics();window.setTimeout(mkLocalScheduleViewportMetrics,60);window.setTimeout(mkLocalScheduleViewportMetrics,220);}catch(_){}
try{modal.addEventListener("wheel",(ev)=>{if(!ev.target.closest(".mk-local-activity-body,.mk-local-fold-body,.mk-account-section-body,.mk-local-emoji-grid,.mk-local-avatar-emoji-tabs"))ev.preventDefault();},{passive:false});modal.addEventListener("touchmove",(ev)=>{if(!ev.target.closest(".mk-local-activity-body,.mk-local-fold-body,.mk-account-section-body,.mk-local-emoji-grid,.mk-local-avatar-emoji-tabs"))ev.preventDefault();},{passive:false});modal.addEventListener("click",(ev)=>{if(ev&&ev.target&&ev.target.closest&&ev.target.closest(".mk-account-section-summary")){window.setTimeout(mkLocalScheduleAccountSectionSafeScroll,40);window.setTimeout(mkLocalScheduleAccountSectionSafeScroll,180);}},true);}catch(_){}
const panel=modal.querySelector(".mk-local-activity-panel");const body=modal.querySelector(".mk-local-activity-body");const titleEl=modal.querySelector(".mk-local-activity-title");const tabs=Array.from(modal.querySelectorAll(".mk-local-activity-tab"));const panelId=`mk-account-tabpanel-${++accountDialogSequence}`;body.id=panelId;body.setAttribute("role","tabpanel");body.tabIndex=0;tabs.filter((button)=>button.dataset.type).forEach((button)=>{button.id=`${panelId}-${button.dataset.type}`;button.setAttribute("role","tab");button.setAttribute("aria-controls",panelId);});const qrAction=tabs.find((button)=>button.dataset.action==="login-qr");if(qrAction)modal.querySelector(".mk-local-activity-head").appendChild(qrAction);modal.querySelector(".mk-local-activity-tabs").addEventListener("keydown",(event)=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;const sectionTabs=tabs.filter((button)=>button.dataset.type);const current=sectionTabs.indexOf(document.activeElement);if(current<0)return;const index=event.key==="Home"?0:event.key==="End"?sectionTabs.length-1:(current+(event.key==="ArrowRight"?1:-1)+sectionTabs.length)%sectionTabs.length;event.preventDefault();sectionTabs[index].click();sectionTabs[index].focus();});applyStoredAccountPanelHeight(panel);try{paintShopDiscountBadges();}catch(_){}
const setType=(next)=>{tabs.forEach((b)=>{const active=b.dataset.type===next;b.classList.toggle("is-active",active);if(b.dataset.type){b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1;if(active)body.setAttribute("aria-labelledby",b.id);}});if(titleEl)titleEl.textContent=localActivityTitleFor(next);if(body)body.dataset.type=next;if(modal){modal.dataset.type=next||"";modal.classList.toggle("mk-local-activity-modal--activity",next==="activity");}
if(panel)panel.dataset.type=next||"";if(next==="notifications"){markNotificationsSeen();}
if(next==="connections"){markConnectionsSeen();}
renderLocalActivityList(body,next);try{mkLocalUpdateViewportMetrics();window.setTimeout(mkLocalScheduleViewportMetrics,80);}catch(_){}
try{mkLocalScheduleAccountSectionSafeScroll();window.setTimeout(mkLocalScheduleAccountSectionSafeScroll,120);}catch(_){}
rememberAccountPanelHeight(panel,next);updateNotificationBadgesSoon(next==="notifications"?250:0);};tabs.forEach((b)=>b.addEventListener("click",()=>{if(b.dataset.action==="login-qr"){openAccountLoginQrModal().catch(()=>{});return;}
setType(b.dataset.type||"visits");}));let cloudSyncRenderTimer=0;const refreshOnCloudSync=(ev)=>{if(!ev||!ev.detail)return;const kind=ev.detail.type||"";if(kind!=="cloud-sync"&&kind!=="cloud-sync-mastery"&&kind!=="cloud-sync-json"&&kind!=="account-xp")return;try{if(cloudSyncRenderTimer)clearTimeout(cloudSyncRenderTimer);}catch(_){}
cloudSyncRenderTimer=window.setTimeout(()=>{cloudSyncRenderTimer=0;const active=(tabs.find((b)=>b.classList.contains("is-active"))||{}).dataset;const t=active&&active.type||body.dataset.type||initial;if(t!=="info"&&t!=="privacy"&&t!=="connections"&&t!=="notifications")renderLocalActivityList(body,t);},350);};window.addEventListener("mk-local-activity-change",refreshOnCloudSync);let releaseFocus=()=>{};let didClose=false;const close=()=>{if(didClose)return;didClose=true;disposeAccountHistoryRecovery(body);try{if(window.__mkAccountSyncCountdownTimer)window.clearInterval(window.__mkAccountSyncCountdownTimer);window.__mkAccountSyncCountdownTimer=0;}catch(_){}
try{window.removeEventListener("mk-account-auto-sync-timer-change",startCountdownTicker);}catch(_){}
try{window.removeEventListener("mk-account-sync-complete",startCountdownTicker);}catch(_){}
try{window.removeEventListener("mk-account-auto-sync-interval-change",startCountdownTicker);}catch(_){}
try{document.removeEventListener("visibilitychange",onCountdownVisibility);}catch(_){}
try{if(cloudSyncRenderTimer)clearTimeout(cloudSyncRenderTimer);}catch(_){}
try{window.removeEventListener("mk-local-activity-change",refreshOnCloudSync);}catch(_){}
try{modal.remove();}catch(_){}
try{if(!document.querySelector(".mk-local-activity-modal")){document.documentElement.classList.remove("mk-local-activity-open");document.body.classList.remove("mk-local-activity-open");unlockPageBehindModal();mkLocalUnbindViewportMetrics();}}catch(_){}
releaseFocus();};modal.addEventListener("click",(ev)=>{if(ev.target===modal)close();});modal.querySelector(".mk-local-activity-close").addEventListener("click",close);releaseFocus=bindAccountDialogFocus(modal,close,".mk-local-activity-title");modal.__mkCloseDialog=close;setType(initial);}
function installLocalActivityApi(){window.MkUserReadiness=Object.assign(window.MkUserReadiness||{},{getLocal:(path)=>findLocalReadiness(path||currentPath()),submit:(path,percent,pageTitle)=>submitReadiness(path||currentPath(),percent,pageTitle||title()),average:(path)=>fetchReadinessAverage(path||currentPath()),refresh:()=>refreshReadinessCardSoon(0),});window.MkLocalActivity=Object.assign(window.MkLocalActivity||{},{open:openLocalActivity,openPublicProfile,openQuickShop:openQuickShopMenu,getVisits:()=>(window.MkHotTrack&&typeof window.MkHotTrack.getLocalVisits==="function"?window.MkHotTrack.getLocalVisits():[]),getComments:getLocalComments,getFavorites:getLocalFavorites,getCommentReports:getLocalCommentReports,openCommentAdmin:openCommentsAdmin,openProfile:()=>openLocalActivity("info"),openPrivacy:()=>openLocalActivity("privacy"),openNotifications:()=>openLocalActivity("notifications"),openShop:()=>openLocalActivity("shop"),getProfile:readLocalProfile,saveProfile:saveOnlineProfile,getReadiness:(path)=>findLocalReadiness(path||currentPath()),submitReadiness,fetchReadinessAverage,savePrivacy:savePrivacySettings,syncNow:(opts)=>syncAllAccountDataNow(Object.assign({force:true,reason:"manual"},opts||{})),flushLocalSyncQueue,localSyncQueueSize,unlinkThisBrowserAccount,deleteCurrentCloudAccount,clearLocalAccountState,fetchCloudActivity,syncCloudMastery:async(opts)=>syncAllAccountDataNow(Object.assign({force:true,reason:"mastery-manager"},opts||{})),fetchCloudMastery:fetchAndApplyAccountJsonSnapshot,syncMasteryJsonSnapshot,syncAccountData:syncAllAccountDataNow,syncAccountJsonSnapshot,fetchAccountJsonSnapshot:fetchAndApplyAccountJsonSnapshot,fetchDevices:fetchAccountDevices,saveDeviceName:saveCurrentDeviceName,disconnectDevice:disconnectAccountDevice,});const consumePendingLocalActivityOpen=()=>{try{const pending=window.__mkPendingLocalActivityOpen;if(!pending||typeof pending!=="object")return false;const age=Date.now()-Number(pending.ts||0);if(age>12000){try{delete window.__mkPendingLocalActivityOpen;}catch(_){window.__mkPendingLocalActivityOpen=null;}
return false;}
const type=pending.type||"visits";openLocalActivity(type);if(window.__mkPendingLocalActivityOpen===pending){try{delete window.__mkPendingLocalActivityOpen;}catch(_){window.__mkPendingLocalActivityOpen=null;}}
return true;}catch(_){return false;}};if(!window.__mkLocalActivityEventBoundV1){window.__mkLocalActivityEventBoundV1=true;window.addEventListener("mk-open-local-activity",(ev)=>{const type=ev&&ev.detail&&ev.detail.type||"visits";try{if(window.__mkPendingLocalActivityOpen)delete window.__mkPendingLocalActivityOpen;}catch(_){window.__mkPendingLocalActivityOpen=null;}
openLocalActivity(type);});window.addEventListener("mk-open-quick-shop",openQuickShopFromEvent);}
ensureQuickShopStylesOnce();window.setTimeout(consumePendingLocalActivityOpen,0);window.setTimeout(consumePendingLocalActivityOpen,180);}
function installAutoEventListenersOnce(){if(window.__mkEngagementAutoListenersV1)return;window.__mkEngagementAutoListenersV1=true;const recentXpEvents=new Map();const trackScoredActivity=(metric,details,opts)=>{const m=metric==="ai_quiz_attempt"?"ai_quiz":metric;const scope=String((opts&&opts.scope)||`${m}:${currentPath() || "site"}`);const throttleMs=Number(opts&&opts.throttleMs||1200);const now=Date.now();const last=Number(recentXpEvents.get(scope)||0);if(last&&now-last<throttleMs)return Promise.resolve({ok:true,ignored:true,reason:"local_throttle",metric:m});recentXpEvents.set(scope,now);return trackActivity(m,Object.assign({source:"auto-listener"},details||{}),Object.assign({},opts||{},{scope,throttleMs:0}));};const XP_ACTION_STATE_KEY_PREFIX="mk_xp_action_state_v7:";const XP_PENDING_SEARCH_SUGGESTION_KEY="mk_xp_pending_search_suggestion_v7";const XP_PENDING_CONCEPT_FINDER_KEY="mk_xp_pending_concept_finder_v7";let pendingLearningMapIntent=null;const xpStateDay=()=>{try{return new Date().toISOString().slice(0,10);}catch(_){return"today";}};const normaliseXpStatePart=(value,fallback)=>{const src=String(value||fallback||"").trim().toLowerCase();const out=src.replace(/^https?:\/\/[^/]+/i,"").split("#")[0].split("?")[0].replace(/[^a-z0-9._/-]+/g,"-").replace(/-+/g,"-").replace(/^[-/]+|[-/]+$/g,"");return(out||String(fallback||"global")).slice(0,180);};const simpleXpHash=(value)=>{const src=String(value||"").slice(0,500);let h=2166136261;for(let i=0;i<src.length;i+=1){h^=src.charCodeAt(i);h=Math.imul(h,16777619);}
return(h>>>0).toString(36);};const xpStateStorageKey=(metric,stateKey,day)=>{let visitor="anon";try{visitor=String(getVisitorId&&getVisitorId()||"anon").slice(0,80);}catch(_){}
return`${XP_ACTION_STATE_KEY_PREFIX}${visitor}:${normaliseXpStatePart(metric, "metric")}:${normaliseXpStatePart(stateKey, "global")}:${day || xpStateDay()}`;};const readXpActionState=(metric,stateKey,day)=>{try{const raw=localStorage.getItem(xpStateStorageKey(metric,stateKey,day));const data=raw?JSON.parse(raw):null;return data&&typeof data==="object"?data:{};}catch(_){return{};}};const writeXpActionState=(metric,stateKey,day,patch)=>{try{const prev=readXpActionState(metric,stateKey,day);const data=Object.assign({},prev,patch||{},{metric,stateKey,day:day||xpStateDay(),updatedAt:Date.now()});localStorage.setItem(xpStateStorageKey(metric,stateKey,day),JSON.stringify(data));return data;}catch(_){return{};}};const stateKeyForCurrentConcept=(prefix)=>`${prefix || "action"}:${normaliseXpStatePart(currentPath() || location.pathname || "site", "site")}`;const stateKeyForHref=(prefix,href,fallback)=>{const raw=String(href||"").trim();if(raw){try{const u=new URL(raw,document.baseURI);return`${prefix || "link"}:${normaliseXpStatePart(u.pathname || raw, "target")}`;}catch(_){return`${prefix || "link"}:${normaliseXpStatePart(raw, "target")}`;}}
return`${prefix || "link"}:hash-${simpleXpHash(fallback || Date.now())}`;};const activateXpActionState=(metric,stateKey,details,opts)=>{const m=metric==="ai_quiz_attempt"?"ai_quiz":metric;const day=xpStateDay();const key=normaliseXpStatePart(stateKey,`${m}:global`);const now=Date.now();const previous=readXpActionState(m,key,day);const localDedupeMs=Math.max(250,Math.min(1800,Number(opts&&opts.localDedupeMs||opts&&opts.throttleMs||700)||700));if(previous&&previous.pendingAt&&now-Number(previous.pendingAt||0)<localDedupeMs){return Promise.resolve({ok:true,metric:m,ignored:true,reason:"local_state_short_dedupe",stateKey:key,day});}
const repeatToday=!!(previous&&previous.recordedAt);writeXpActionState(m,key,day,{observed:true,observedAt:previous.observedAt||now,pendingAt:now,lastAttemptAt:now,repeatToday,source:details&&details.source||opts&&opts.source||"state-activation",});const enriched=Object.assign({actionStateVersion:8,actionStateMetric:m,actionStateKey:key,actionStateDay:day,actionStatePreviousToday:!!(previous&&previous.observed),actionStateTransition:!(previous&&previous.observed),actionStateRepeatToday:repeatToday,actionStateObservedAt:previous.observedAt||now,},details||{});return trackScoredActivity(m,enriched,Object.assign({},opts||{},{scope:`${m}:${key}:${day}`})).then((res)=>{const reason=String(res&&res.reason||"");const accepted=!!(res&&res.ok&&!res.error&&(res.stateActivated===true||!res.ignored||reason==="action_state_already_active_today"));if(accepted){writeXpActionState(m,key,day,{recordedAt:Date.now(),pendingAt:0,serverIgnored:!!res.ignored,serverReason:reason});}else if(res&&res.ok&&res.ignored){writeXpActionState(m,key,day,{pendingAt:0,serverIgnoredAt:Date.now(),serverReason:reason||"ignored"});}
return res;}).catch((err)=>{writeXpActionState(m,key,day,{failedAt:Date.now(),lastError:String(err&&err.message||err||"network")});return null;});};const saveSessionJson=(key,value)=>{try{sessionStorage.setItem(key,JSON.stringify(value||{}));}catch(_){}};const readSessionJson=(key)=>{try{const raw=sessionStorage.getItem(key);return raw?JSON.parse(raw):null;}catch(_){return null;}};const clearSessionJson=(key)=>{try{sessionStorage.removeItem(key);}catch(_){}};const hashAiQuizResultSignature=(value)=>{const src=String(value||"").slice(0,500);let h=2166136261;for(let i=0;i<src.length;i++){h^=src.charCodeAt(i);h=Math.imul(h,16777619);}
return(h>>>0).toString(36);};const AI_QUIZ_XP_SEEN_KEY="mk_ai_quiz_xp_seen_v3";const aiQuizXpDay=()=>{try{return new Date().toISOString().slice(0,10);}catch(_){return"today";}};const readAiQuizXpSeen=()=>{try{const raw=sessionStorage.getItem(AI_QUIZ_XP_SEEN_KEY)||localStorage.getItem(AI_QUIZ_XP_SEEN_KEY);const data=raw?JSON.parse(raw):null;return data&&typeof data==="object"?data:{};}catch(_){return{};}};const writeAiQuizXpSeen=(data)=>{try{const entries=Object.entries(data||{}).sort((a,b)=>Number(b[1]||0)-Number(a[1]||0)).slice(0,80);const compact=Object.fromEntries(entries);sessionStorage.setItem(AI_QUIZ_XP_SEEN_KEY,JSON.stringify(compact));localStorage.setItem(AI_QUIZ_XP_SEEN_KEY,JSON.stringify(compact));}catch(_){}};const aiQuizPayloadForTracking=(extra)=>{const outer=extra&&typeof extra==="object"?extra:{};const nested=outer.detail&&typeof outer.detail==="object"?outer.detail:{};return Object.assign({},nested,outer,nested?{nestedEventDetail:undefined}:{});};const aiQuizSeenKey=(source,extra)=>{const payload=aiQuizPayloadForTracking(extra);const sigBase=payload.resultId||payload.result_id||payload.sessionId||payload.session_id||payload.quizSessionId||payload.id||payload.questionId||payload.signature||payload.textSignature||source||"completed";return`${aiQuizXpDay()}:${currentPath() || "site"}:${hashAiQuizResultSignature(sigBase)}`;};const hasSeenAiQuizXp=(key)=>!!(key&&readAiQuizXpSeen()[key]);const markSeenAiQuizXp=(key)=>{if(!key)return;const seen=readAiQuizXpSeen();seen[key]=Date.now();writeAiQuizXpSeen(seen);};const trackAiQuizCompleted=(source,extra,opts)=>{const payload=aiQuizPayloadForTracking(extra);const src=String(source||payload.source||"").trim().toLowerCase();if((src==="ai-quiz-result-visible"||src==="ai-quiz-result-action-visible")&&!aiQuizVisibleTextLooksLikeRealResult(payload.textSignature||payload.text_signature||payload.resultText||payload.result_text||"")){return Promise.resolve({ok:true,ignored:true,reason:"ignored_false_visible_ai_quiz_detector"});}
const seenKey=aiQuizSeenKey(source,payload);if(hasSeenAiQuizXp(seenKey))return Promise.resolve({ok:true,ignored:true,reason:"ai_quiz_result_already_recorded"});markSeenAiQuizXp(seenKey);return trackScoredActivity("ai_quiz",Object.assign({source:source||"ai-quiz-completed",completed:true,resultProduced:true,clientDedupeKey:seenKey},payload||{}),{scope:`ai_quiz:${seenKey}`,throttleMs:Number(opts&&opts.throttleMs||60000),});};window.MkXpActivity=Object.assign(window.MkXpActivity||{},{recordAiQuizCompleted:(detail)=>{const res=trackAiQuizCompleted("explicit-api",Object.assign({eventName:"explicit-api"},detail||{}),{throttleMs:12000});try{syncStoredAiQuizSessionsAsXp("ai-quiz-completed");}catch(_){}
return res;}});const syncStoredAiQuizSessionsAsXp=(reason)=>{let fp="";try{fp=sampledStorageFingerprintPart(LOCAL_AI_QUIZ_SESSIONS_KEY);}catch(_){fp=String(Date.now());}
try{const last=localStorage.getItem(AI_QUIZ_SESSION_SYNC_FINGERPRINT_KEY)||"";if(fp&&last===fp)return;}catch(_){}
try{markCloudSyncDirty(reason||"ai-quiz-session-sync");}catch(_){}
try{window.clearTimeout(window.__mkAiQuizSessionSyncTimer||0);}catch(_){}
window.__mkAiQuizSessionSyncTimer=window.setTimeout(()=>{try{runCloudSync({force:false,reason:reason||"ai-quiz-session-sync"}).then((res)=>{if(res&&res.ok!==false){try{localStorage.setItem(AI_QUIZ_SESSION_SYNC_FINGERPRINT_KEY,fp);}catch(_){}}}).catch(()=>{});}catch(_){}},900);};const aiQuizDetailLooksCompleted=(eventName,detail)=>{const name=String(eventName||"").toLowerCase();const source=detail&&typeof detail==="object"?String(detail.source||"").toLowerCase():"";const payload=(()=>{try{return JSON.stringify(detail||{});}catch(_){return String(detail||"");}})();const hay=`${name} ${source} ${payload}`.toLowerCase();if(/(accept|accepted|reject|rejected|cancel|cancelled|canceled|attempt-start|start|started|open|opened|begin|launch|request|loading|pending)/i.test(`${name} ${source}`))return false;if(detail&&typeof detail==="object"){if(detail.result||detail.results||detail.score!=null||detail.feedback||detail.recommendation||detail.resultProduced===true||detail.completed===true||detail.finished===true)return true;}
if(/(submit|submitted)/i.test(`${name} ${source}`)&&!/(complete|completed|result|results|graded|evaluated|feedback|finished|done|checked|score|mastery\s*level)/i.test(hay))return false;if(/(complete|completed|result|results|graded|evaluated|feedback|finished|done|checked|score ready|result ready|result-ready|mastery\s*level)/i.test(hay))return true;return false;};const isElementVisibleForXp=(el)=>{try{if(!el||!el.isConnected)return false;if(el.hidden||el.getAttribute("aria-hidden")==="true")return false;const st=window.getComputedStyle?window.getComputedStyle(el):null;if(st&&(st.display==="none"||st.visibility==="hidden"||Number(st.opacity||1)===0))return false;const rect=el.getBoundingClientRect?el.getBoundingClientRect():null;if(rect&&rect.width<2&&rect.height<2)return false;return true;}catch(_){return true;}};const aiQuizAreaSelectors=["[data-ai]","[data-quiz]","[data-aiq]","[data-ai-test]","[data-ai-quiz]","[id*='ai' i]","[class*='ai' i]","[id*='quiz' i]","[class*='quiz' i]","[id*='aiq' i]","[class*='aiq' i]","[role='dialog']",".modal",".dialog",".md-dialog",".mk-modal",".mk-local-mini-modal",".card","section","article"].join(",");const findAiQuizArea=(node)=>{try{const el=node&&node.nodeType===1?node:(node&&node.parentElement?node.parentElement:null);if(!el||!el.closest)return null;const direct=el.closest("[data-ai], [data-quiz], [data-aiq], [data-ai-test], [data-ai-quiz], [id*='ai' i], [class*='ai' i], [id*='quiz' i], [class*='quiz' i], [id*='aiq' i], [class*='aiq' i]");if(direct)return direct;return el.closest("[role='dialog'], .modal, .dialog, .md-dialog, .mk-modal, .mk-local-mini-modal, .card, section, article");}catch(_){return null;}};const nodeMatchesAiQuizResult=(node)=>{if(!node||node.nodeType!==1||!node.matches)return false;const el=node;if(el.dataset&&el.dataset.mkAiQuizXpRecorded==="1")return false;const explicit=el.matches("[data-ai-quiz-result], [data-ai-test-result], [data-aiq-result], [data-ai-result], [data-quiz-result], .ai-quiz-result, .ai-test-result, .aiq-result, .ai-result, .mk-ai-quiz-result, .mk-ai-test-result, .mk-ai-result, .ai-feedback, .ai-evaluation")||!!el.querySelector("[data-ai-quiz-result], [data-ai-test-result], [data-aiq-result], [data-ai-result], [data-quiz-result], .ai-quiz-result, .ai-test-result, .aiq-result, .ai-result, .mk-ai-quiz-result, .mk-ai-test-result, .mk-ai-result, .ai-feedback, .ai-evaluation");if(explicit&&isElementVisibleForXp(el))return true;const area=findAiQuizArea(el);if(!area||!isElementVisibleForXp(area))return false;const text=String(area.textContent||"").replace(/\s+/g," ").trim().toLowerCase().slice(0,1600);if(!text)return false;if(/(start|begin|open|launch)\s+(an?\s+)?(ai\s+)?(quiz|test)|generating|loading|please wait|choose a topic|number of questions/.test(text)&&!/(result|feedback|score|accept|completed|finished|mastery\s*level|recommended\s+mastery)/.test(text))return false;return aiQuizVisibleTextLooksLikeRealResult(text);};const installAiQuizResultObserver=()=>{if(isMobilePowerSensitiveViewport())return;if(window.__mkAiQuizExplicitResultObserverV2||!window.MutationObserver)return;const root=document.body||document.documentElement;if(!root)return;window.__mkAiQuizExplicitResultObserverV2=true;const explicitSelector=".aiq-result-card[data-ai-quiz-result='1'][data-aiq-result-id], [data-ai-quiz-result='1'][data-aiq-result-id]";const checkExplicitResult=(node)=>{try{const el=node&&node.nodeType===1?node:(node&&node.parentElement?node.parentElement:null);if(!el||!el.closest)return false;const card=el.matches&&el.matches(explicitSelector)?el:el.closest(explicitSelector);if(!card||!isElementVisibleForXp(card))return false;if(card.dataset&&card.dataset.mkAiQuizXpRecorded==="1")return true;const resultId=String(card.getAttribute("data-aiq-result-id")||card.getAttribute("data-result-id")||"").trim();if(!resultId)return false;const seenKey=aiQuizSeenKey("ai-mcq-explicit-result-card",{resultId});if(!hasSeenAiQuizXp(seenKey)){trackAiQuizCompleted("ai-mcq-explicit-result-card",{resultId,detectionVersion:4},{throttleMs:60000});}
try{if(card.dataset)card.dataset.mkAiQuizXpRecorded="1";}catch(_){}
return true;}catch(_){return false;}};const scanExplicitResults=()=>{try{const cards=Array.from(document.querySelectorAll(explicitSelector));for(const card of cards.slice(-12)){if(checkExplicitResult(card))return true;}}catch(_){}
return false;};const obs=new MutationObserver((mutations)=>{for(const m of mutations){if(checkExplicitResult(m.target))return;for(const node of Array.from(m.addedNodes||[])){if(checkExplicitResult(node))return;}}});try{obs.observe(root,{childList:true,subtree:true});}catch(_){}
window.setTimeout(scanExplicitResults,800);};const syncMasteryXp=(reason)=>{try{markCloudSyncDirty(reason||"mastery-change");}catch(_){}
refreshAccountXpSoon(reason||"mastery-change",1500);};const normaliseMasteryChangeDetailForXp=(detail)=>{const d=detail&&typeof detail==="object"?detail:{};if(d.source==="cloud-sync")return null;const levelRaw=d.level!=null?d.level:d.mastery!=null?d.mastery:d.m;const level=Number(levelRaw);if(![0,1,2,3].includes(level))return null;if(d.xpEligible===false||d.ratingChanged===false||d.changeKind==="same")return null;const rawPath=d.path||d.conceptId||d.concept_id||currentPath();const path=normaliseLocalConceptPathForXp(rawPath);if(!isConceptPath(path))return null;const oldRaw=d.oldLevel!=null?d.oldLevel:d.oldMastery!=null?d.oldMastery:d.previousLevel!=null?d.previousLevel:d.previousMastery;const oldLevel=Number(oldRaw);const hadRating=d.hadRating===true||[0,1,2,3].includes(oldLevel)||d.changeKind==="change";const ts=Number(d.ts||d.createdAt||d.created_at||Date.now())||Date.now();return{path,title:String(d.title||title()||""),mastery:level,m:level,level,oldMastery:[0,1,2,3].includes(oldLevel)?oldLevel:null,oldLevel:[0,1,2,3].includes(oldLevel)?oldLevel:null,forceRepeat:!!(d.forceRepeat||d.repeatOnly||hadRating),repeatOnly:!!(d.forceRepeat||d.repeatOnly||hadRating),changeKind:d.changeKind||(hadRating?"change":"create"),source:d.source||d.via||"mastery-change",ts,};};const trackMasteryChangeXp=(detail,reason)=>{const d=normaliseMasteryChangeDetailForXp(detail);if(!d)return;try{trackActivity("mastery",{path:d.path,title:d.title,mastery:d.mastery,m:d.m,level:d.level,oldMastery:d.oldMastery,oldLevel:d.oldLevel,forceRepeat:d.forceRepeat,repeatOnly:d.repeatOnly,changeKind:d.changeKind,source:d.source||reason||"mastery-change",ts:d.ts,},{path:d.path,title:d.title,ts:d.ts,scope:`mastery:${d.path}:${d.ts}:${d.level}`,throttleMs:0,});}catch(_){}};document.addEventListener("mk:mastery-submitted",(ev)=>{trackMasteryChangeXp(ev&&ev.detail,"mastery-submit");syncMasteryXp("mastery-submit");});window.addEventListener("conceptMasteryChanged",(ev)=>{if(ev&&ev.detail&&ev.detail.source==="cloud-sync")return;trackMasteryChangeXp(ev&&ev.detail,"mastery-change");window.clearTimeout(window.__mkCloudMasterySyncTimer||0);window.__mkCloudMasterySyncTimer=window.setTimeout(()=>syncMasteryXp("mastery-change"),120);});window.addEventListener("mk-ai-quiz-sessions-changed",(ev)=>{if(ev&&ev.detail&&ev.detail.source==="cloud-sync")return;try{markCloudSyncDirty("ai-quiz-sessions-changed");}catch(_){}
refreshAccountXpSoon("ai-quiz-sessions-changed",1600);});["mk:ai-quiz-completed","mk:ai-test-completed","mk:ai-quiz-result","mk:ai-test-result","mk:ai-result-ready","mk:ai-feedback-ready","mk:ai-check-result","aiQuizCompleted","aiTestCompleted","aiQuizResult","aiTestResult","aiq:completed","aiq:result","aiq:feedback"].forEach((eventName)=>{const handler=(ev)=>{const detail=ev&&ev.detail||null;if(!aiQuizDetailLooksCompleted(eventName,detail))return;trackAiQuizCompleted("ai-quiz-completion-event",{eventName,detail},{throttleMs:12000});};document.addEventListener(eventName,handler);window.addEventListener(eventName,handler);});installAiQuizResultObserver();const contextTextForXp=(el)=>{try{return String(el&&el.textContent||"").replace(/\s+/g," ").trim().toLowerCase();}catch(_){return"";}};const elementForXp=(node)=>{try{if(!node)return null;if(node.nodeType===1)return node;return node.parentElement||null;}catch(_){return null;}};const eventPathForXp=(ev,target)=>{try{const path=ev&&typeof ev.composedPath==="function"?ev.composedPath():[];if(path&&path.length)return path.filter((x)=>x&&x.nodeType===1);}catch(_){}
const out=[];let node=elementForXp(target);for(let i=0;node&&node!==document&&i<24;i+=1,node=node.parentElement)out.push(node);return out;};const rectContainsPointForXp=(rect,x,y,pad)=>{try{const p=Number(pad||0);return!!rect&&Number.isFinite(x)&&Number.isFinite(y)&&x>=rect.left-p&&x<=rect.right+p&&y>=rect.top-p&&y<=rect.bottom+p;}catch(_){return false;}};const controlLooksLikeSwitch=(control)=>{try{if(!control)return false;const txt=[control.getAttribute&&control.getAttribute("role"),control.getAttribute&&control.getAttribute("aria-label"),control.getAttribute&&control.getAttribute("title"),control.textContent].filter(Boolean).join(" ").toLowerCase();if(control.matches&&control.matches("input[type='checkbox'], input[type='radio'], [role='switch'], [aria-checked]"))return true;if(control.closest&&control.closest("[role='switch'], .md-switch, .switch, [class*='toggle' i]"))return true;return/knowledge\s+masking|toggle|switch|blur/.test(txt);}catch(_){return false;}};const controlLooksLikeIconButton=(control)=>{try{if(!control)return false;const txt=contextTextForXp(control);const hasIcon=!!(control.querySelector&&control.querySelector("svg, img, .twemoji, [class*='icon' i], [class*='map' i]"));const rect=control.getBoundingClientRect?control.getBoundingClientRect():null;const compact=!rect||(rect.width<=82&&rect.height<=82);return hasIcon||(compact&&txt.length<=18);}catch(_){return false;}};const localMapCopyPattern=/local\s+concept\s+map|open\s+a\s+zoomable\s+map\s+of\s+the\s+nearby\s+concepts/i;const localMapCardInfoFromEvent=(target,ev)=>{try{const el=elementForXp(target);if(!el||!el.closest||el.closest(".mk-local-activity-modal, .mk-local-mini-modal, .mk-comments-root, .mk-level-panel"))return null;const switchLike=el.closest("input, select, textarea, label, [role='switch'], [aria-checked], .md-switch, .switch, [class*='mask' i]");if(switchLike&&/knowledge\s+masking|masking|privacy|toggle|switch/.test(contextTextForXp(switchLike).slice(0,500)))return null;const rawPath=eventPathForXp(ev,el);for(const node of rawPath.slice(0,18)){if(!node||node===document.body||node===document.documentElement||!isElementVisibleForXp(node))continue;const text=contextTextForXp(node);if(!localMapCopyPattern.test(text))continue;if(/account|profile|level|comment|notification|connection|privacy/.test(text)&&!/learning\s+path|local\s+concept\s+map/.test(text))return null;const rect=node.getBoundingClientRect?node.getBoundingClientRect():null;const compactCard=!rect||(rect.height<=460&&rect.width<=900);const clickInside=!ev||rectContainsPointForXp(rect,Number(ev.clientX),Number(ev.clientY),24)||node.contains(el);if(compactCard&&clickInside){return{triggerKind:"learning-path-local-map-card",triggerText:text.slice(0,220),localMapCardConfirmed:true,mapSignalVersion:4,};}}
const x=Number(ev&&ev.clientX);const y=Number(ev&&ev.clientY);if(!Number.isFinite(x)||!Number.isFinite(y))return null;const labels=Array.from(document.querySelectorAll("h1,h2,h3,h4,strong,b,p,span,div")).filter((node)=>{try{return isElementVisibleForXp(node)&&localMapCopyPattern.test(contextTextForXp(node));}catch(_){return false;}});for(const label of labels.slice(-120)){let card=label;for(let depth=0;card&&card!==document.body&&card!==document.documentElement&&depth<8;depth+=1,card=card.parentElement){const rect=card.getBoundingClientRect?card.getBoundingClientRect():null;if(!rectContainsPointForXp(rect,x,y,28))continue;if(rect.height>460||rect.width>900)continue;const text=contextTextForXp(card);if(!localMapCopyPattern.test(text))continue;if(/account|profile|level|comment|notification|connection|privacy/.test(text)&&!/learning\s+path|local\s+concept\s+map/.test(text))continue;return{triggerKind:"learning-path-local-map-card-near-click",triggerText:text.slice(0,220),localMapCardConfirmed:true,mapSignalVersion:4,};}}
return null;}catch(_){return null;}};const findLearningPathLocalMapContext=(control)=>{try{if(!control||!control.parentElement)return null;if(controlLooksLikeSwitch(control))return null;const controlText=contextTextForXp(control);if(/close|dismiss|back|collapse|expand|account|profile|privacy|notification|comment/.test(controlText))return null;let node=control;for(let depth=0;node&&node!==document.body&&node!==document.documentElement&&depth<16;depth+=1,node=node.parentElement){if(!isElementVisibleForXp(node))continue;const text=contextTextForXp(node);if(!text)continue;if(/knowledge\s+masking/.test(text)&&!/local\s+concept\s+map|open\s+a\s+zoomable\s+map\s+of\s+the\s+nearby\s+concepts/.test(text))return null;const hasLocalMapCopy=/local\s+concept\s+map|open\s+a\s+zoomable\s+map\s+of\s+the\s+nearby\s+concepts/.test(text);if(!hasLocalMapCopy)continue;const rect=node.getBoundingClientRect?node.getBoundingClientRect():null;const compactEnoughToBeTheActionCard=!rect||rect.height<=560;const heading=node.querySelector?contextTextForXp(node.querySelector("h1,h2,h3,h4,strong,b,[class*='title' i],[class*='heading' i]")):"";const headingSaysLocalMap=/local\s+concept\s+map/.test(heading);const iconButton=controlLooksLikeIconButton(control);const learningPathHost=/learning\s+path|local\s+concept\s+map|knowledge\s+masking/.test(text);if(!compactEnoughToBeTheActionCard&&!headingSaysLocalMap&&!(iconButton&&learningPathHost))continue;return{triggerKind:"learning-path-local-map-button",triggerText:text.slice(0,220),};}
if(controlLooksLikeIconButton(control)){const hosts=Array.from(document.querySelectorAll("aside, nav, section, article, [class*='learning' i], [id*='learning' i], [class*='path' i], [data-panel*='learning' i]")).filter(isElementVisibleForXp);for(const host of hosts.slice(-60)){const text=contextTextForXp(host).slice(0,3000);if(!/local\s+concept\s+map/.test(text))continue;if(!/learning\s+path|knowledge\s+masking|open\s+a\s+zoomable\s+map/.test(text))continue;if(!host.contains(control))continue;return{triggerKind:"learning-path-local-map-icon-near-label",triggerText:text.slice(0,220),};}}
return null;}catch(_){return null;}};const learningMapTriggerInfo=(target,ev)=>{try{const localCardInfo=localMapCardInfoFromEvent(target,ev);if(localCardInfo)return localCardInfo;if(!target||!target.closest)return null;if(target.closest(".mk-local-activity-modal, .mk-local-mini-modal, .mk-comments-root, .mk-level-panel"))return null;const switchLike=target.closest("input, select, textarea, label, [role='switch'], [aria-checked], .md-switch, .switch, [class*='mask' i]");if(switchLike&&/knowledge\s+masking|masking|privacy/.test(contextTextForXp(switchLike).slice(0,500)))return null;const direct=target.closest("[data-open-concept-map], [data-action*='map' i], [data-target*='map' i], [aria-label*='map' i], [title*='map' i], .concept-map-open, .mk-concept-map-open, .learning-map-open, .lp-open-map, [class*='map-open' i]");const btn=target.closest("button, a, [role='button'], summary, [tabindex], [onclick], [data-action], [data-target], [data-panel], [data-view]")||(direct&&direct.matches&&direct.matches("button, a, [role='button'], summary, [tabindex], [onclick], [data-action], [data-target], [data-panel], [data-view]")?direct:null);const control=direct||btn||target;if(!control||!isElementVisibleForXp(control))return null;const txt=[control.getAttribute&&control.getAttribute("aria-label"),control.getAttribute&&control.getAttribute("title"),control.getAttribute&&control.getAttribute("data-tooltip"),control.getAttribute&&control.getAttribute("data-md-tooltip"),control.dataset&&(control.dataset.action||control.dataset.target||control.dataset.panel||control.dataset.view||control.dataset.lpH1OpenMap||control.dataset.openConceptMap),control.textContent,].filter(Boolean).join(" ").replace(/\s+/g," ").trim().toLowerCase();const hasExplicitAttr=!!(control.matches&&control.matches("[data-open-concept-map], [data-action*='map' i], [data-target*='map' i]"));const hasExplicitClass=!!(control.matches&&control.matches(".concept-map-open, .mk-concept-map-open, .learning-map-open, .lp-open-map, [class*='map-open' i]"));const exactText=/\b(learning|concept|local)\s+map\b|\bmap\s+(learning|concept|local)\b|local\s+concept\s+map/.test(txt);const localMapContext=findLearningPathLocalMapContext(control)||(btn?findLearningPathLocalMapContext(btn):null);if(/sitemap|roadmap|site map|navigation map|account|profile|level|comment|notification|privacy/.test(txt))return null;if(hasExplicitAttr||hasExplicitClass||exactText||localMapContext){return localMapContext||{triggerKind:hasExplicitAttr?"explicit-data-attribute":(hasExplicitClass?"explicit-map-class":"labelled-map-button"),triggerText:txt.slice(0,120),};}
return null;}catch(_){return null;}};const trackMapOpened=(source,extra)=>{const details=Object.assign({source:source||"map-open-state",mapConfirmed:true,learningMapConfirmed:true,mapSignalVersion:7},extra||{});return activateXpActionState("map_open",stateKeyForCurrentConcept("learning-map"),details,{throttleMs:2500,keepalive:true});};const armLearningMapOpenState=(source,extra)=>{try{pendingLearningMapIntent=Object.assign({armedAt:Date.now(),source:source||"map-open-intent",path:currentPath()||location.pathname||"",},extra||{});scheduleLearningMapStateCheck(80);scheduleLearningMapStateCheck(350);scheduleLearningMapStateCheck(900);scheduleLearningMapStateCheck(1800);}catch(_){}};const visibleLearningMapStateInfo=()=>{try{const selectors=["[data-concept-map]","[data-learning-map]","[data-local-concept-map]",".concept-map-modal",".learning-map-modal",".local-concept-map-modal",".mk-concept-map",".mk-learning-map",".lp-map-modal",".lp-map-overlay",".local-concept-map","[class*='concept-map' i]","[class*='learning-map' i]","[class*='local-map' i]","[id*='concept-map' i]","[id*='learning-map' i]","[id*='local-map' i]","[class*='knowledge-graph' i]","[id*='knowledge-graph' i]","[class*='concept-graph' i]","[id*='concept-graph' i]","[class*='network' i]","[id*='network' i]","[class*='graph' i]","[id*='graph' i]","canvas","svg"].join(",");const candidates=Array.from(document.querySelectorAll(selectors));for(const node of candidates.slice(-120)){if(!node||!isElementVisibleForXp(node))continue;if(node.closest&&node.closest(".mk-local-activity-modal, .mk-local-mini-modal, .mk-comments-root, .mk-level-panel"))continue;const rect=node.getBoundingClientRect?node.getBoundingClientRect():null;if(rect&&(rect.width<120||rect.height<100))continue;const text=contextTextForXp(node).slice(0,1000);const cls=String(node.className||"").toLowerCase();const attrs=["aria-label","title","data-view","data-panel","data-action"].map((a)=>node.getAttribute&&node.getAttribute(a)||"").join(" ").toLowerCase();const hay=`${text} ${cls} ${attrs}`;if(/button|icon|local\s+concept\s+map\s+open\s+a\s+zoomable/.test(hay)&&rect&&rect.width<260&&rect.height<220)continue;if(/concept\s+map|learning\s+map|local\s+map|local\s+concept\s+map|zoomable\s+map|cytoscape|sigma|network|knowledge\s+graph|concept\s+graph/.test(hay)){return{triggerKind:"visible-learning-map-state",triggerText:text.slice(0,180),mapElementClass:cls.slice(0,120)};}
const tag=String(node.tagName||"").toLowerCase();const largeGraphSurface=rect&&rect.width>=260&&rect.height>=180&&/^(canvas|svg)$/.test(tag);if(largeGraphSurface&&pendingLearningMapIntent){const circleLike=tag==="svg"&&node.querySelectorAll&&node.querySelectorAll("circle,line,path,g").length>=6;if(tag==="canvas"||circleLike)return{triggerKind:"large-graph-surface-after-map-intent",triggerText:text.slice(0,180),mapElementClass:cls.slice(0,120)};}}}catch(_){}
return null;};const scheduleLearningMapStateCheck=(delay)=>{window.setTimeout(()=>{try{if(!pendingLearningMapIntent||Date.now()-Number(pendingLearningMapIntent.armedAt||0)>9000)return;const visible=visibleLearningMapStateInfo();if(!visible)return;const intent=pendingLearningMapIntent;pendingLearningMapIntent=null;trackMapOpened("map-visible-state",Object.assign({eventName:"map-visible-state"},intent||{},visible||{}));}catch(_){}},Number(delay||0));};const installLearningMapStateObserver=()=>{if(window.__mkLearningMapStateObserverV7||!window.MutationObserver)return;window.__mkLearningMapStateObserverV7=true;const root=document.body||document.documentElement;if(!root)return;let timer=0;const obs=new MutationObserver(()=>{if(!pendingLearningMapIntent||timer)return;timer=window.setTimeout(()=>{timer=0;scheduleLearningMapStateCheck(0);},120);});try{obs.observe(root,{childList:true,subtree:true});}catch(_){}};const isConceptFinderHref=(href,text)=>{const h=String(href||"").toLowerCase();const t=String(text||"").toLowerCase();const hay=`${h} ${t}`;if(/search_index/.test(hay))return false;if(/concept[\s_-]*finder|finder\.html|\/find\/|find\.html|custom-random\.html/.test(hay))return true;if(/(^|\/)random\.html(?:[#?].*)?$/.test(h)&&/concept|finder|random/.test(t||document.title||""))return true;return false;};const isConceptFinderPage=()=>{try{const p=String(currentPath()||location.pathname||"").toLowerCase();const h1=titleFromH1?titleFromH1():"";const hay=`${p} ${document.title || ""} ${h1 || ""}`.toLowerCase();if(/search_index/.test(hay))return false;return/concept\s+finder|concept-finder|concept_finder|finder\.html|\/find\/|find\.html|custom-random\.html|(^|\/)random\.html/.test(hay);}catch(_){return false;}};const topSearchHostFor=(el)=>{try{return el&&el.closest&&el.closest(".md-search, [role='search'], .md-search-result, .md-search__output, .md-search__scrollwrap, [data-md-component='search'], [data-md-component='search-result'], form[action*='search' i], [class*='search-result' i], [class*='suggest' i]");}catch(_){return null;}};let lastTopSearchQueryValue="";let lastTopSearchQueryTs=0;const rememberTopSearchQuery=(value)=>{try{const q=String(value||"").trim();if(!q)return;lastTopSearchQueryValue=q;lastTopSearchQueryTs=Date.now();}catch(_){}};const topSearchInputFor=(el)=>{try{const host=topSearchHostFor(el)||document;return(host.querySelector&&host.querySelector(".md-search__input, input[type='search'], input[name='q'], input[name='query']"))||document.querySelector(".md-search__input, input[type='search'], input[name='q'], input[name='query']");}catch(_){return null;}};const topSearchQueryFor=(el)=>{try{const input=topSearchInputFor(el);const live=String(input&&input.value||"").trim();if(live){rememberTopSearchQuery(live);return live;}
if(lastTopSearchQueryValue&&Date.now()-lastTopSearchQueryTs<120000)return lastTopSearchQueryValue;return"";}catch(_){return"";}};const searchSuggestionHostFor=(el)=>{try{if(!el||!el.closest)return null;return el.closest(".md-search-result, .md-search__output, .md-search__scrollwrap, [data-md-component='search-result'], [data-md-component='search'], [class*='search-result' i], [class*='search-results' i], [class*='suggestion' i], [class*='suggestions' i], [role='listbox'], .autocomplete, .typeahead");}catch(_){return null;}};const searchSuggestionTriggerInfo=(target)=>{try{const el=elementForXp(target);if(!el||!el.closest)return null;if(el.closest(".md-search__input, input[type='search'], input[name='q'], input[name='query'], .md-search__icon, button[type='submit']"))return null;const control=el.closest("a[href], [role='option'], [data-href], [data-url], .md-search-result__link, .search-result, .suggestion");if(!control)return null;const host=searchSuggestionHostFor(control);if(!host)return null;const q=topSearchQueryFor(control);if(!q)return null;const href=(control.getAttribute&&(control.getAttribute("href")||control.getAttribute("data-href")||control.getAttribute("data-url")))||control.href||"";const text=[control.textContent,control.getAttribute&&control.getAttribute("aria-label"),control.getAttribute&&control.getAttribute("title")].filter(Boolean).join(" ").replace(/\s+/g," ").trim();return{href:String(href||""),queryLength:q.length,querySample:q.slice(0,80),triggerText:text.slice(0,160),suggestionSignalVersion:4};}catch(_){return null;}};const trackCourseSearchUsed=(source,extra)=>{const detail=extra&&typeof extra==="object"?extra:{};const qRaw=detail.query||detail.querySample||detail.queryLength||detail.href||detail.triggerText||currentPath()||"course-search";const q=String(qRaw||"").trim().replace(/\s+/g," ").slice(0,160)||"course-search";const course=String(detail.course||detail.courseKey||currentPath()||"course").trim().slice(0,160);const explicitKey=detail.actionStateKey||detail.eventId||detail.clientEventId||"";const stateKey=explicitKey?String(explicitKey):`course-search-submit-v10:${simpleXpHash(`${course}:${q}:${Date.now()}:${Math.random().toString(36).slice(2,8)}`)}`;return activateXpActionState("course_search",stateKey,Object.assign({source:source||"course-search-submit",searchSignalVersion:10,courseSearchExplicitVersion:10,query:q,querySample:q.slice(0,80),queryLength:q.length,course,actionStateVersion:8,actionStateKey:stateKey,},detail||{}),{throttleMs:0,keepalive:true});};const trackConceptFinderOpened=(source,extra)=>{return activateXpActionState("concept_finder_open","concept-finder:page-open",Object.assign({source:source||"concept-finder-open",searchSignalVersion:7},extra||{}),{throttleMs:4000});};const armConceptFinderOpenState=(source,extra)=>{saveSessionJson(XP_PENDING_CONCEPT_FINDER_KEY,Object.assign({armedAt:Date.now(),source:source||"concept-finder-intent"},extra||{}));};const trackSearchSuggestionUsed=(source,extra)=>{const key=stateKeyForHref("search-suggestion",extra&&extra.href,`${extra && extra.querySample || ""}:${extra && extra.triggerText || ""}`);return activateXpActionState("search_suggestion",key,Object.assign({source:source||"top-search-suggestion-used",searchSignalVersion:7},extra||{}),{throttleMs:8000,keepalive:true});};const sortFilterControlKey=(info)=>{const page=normaliseXpStatePart(currentPath()||location.pathname||"site","site");const kind=normaliseXpStatePart(info&&(info.controlKind||info.source||"control"),"control");const value=normaliseXpStatePart(info&&(info.value||info.metric||info.period||info.triggerText||info.controlText||"used"),"used");return`sort-filter:${page}:${kind}:${value}`;};const trackSortFilteringUsed=(source,extra)=>{const detail=Object.assign({source:source||"sort-filter-used",sortFilterSignalVersion:8},extra||{});const key=detail.actionStateKey||sortFilterControlKey(detail);return activateXpActionState("sort_use",key,detail,{throttleMs:3000,keepalive:true});};const sortingFilteringTriggerInfo=(target,ev)=>{try{const el=elementForXp(target);if(!el||!el.closest)return null;if(el.closest(".mk-local-activity-modal, .mk-local-mini-modal, .mk-comments-root, .mk-level-panel, .md-search, .md-search-result, .md-search__output, [data-md-component='search']"))return null;const control=el.closest(".trending-metric-btn, .trending-tab, [data-sort], [data-filter], [data-period], [data-metric], select, button, a, [role='button'], [role='tab'], [role='option']");if(!control||!isElementVisibleForXp(control)||controlLooksLikeSwitch(control))return null;const inTrending=!!(control.closest&&control.closest("#trending-app, .trending-unified, .trending-block, .trending-metric-switch"));const ds=control.dataset||{};const value=String(ds.sort||ds.filter||ds.period||ds.metric||(control.value!=null?control.value:"")||"").trim();const attrText=[control.getAttribute&&control.getAttribute("aria-label"),control.getAttribute&&control.getAttribute("title"),control.getAttribute&&control.getAttribute("name"),control.id,control.className,value,control.textContent,].filter(Boolean).join(" ").replace(/\s+/g," ").trim();const hostText=contextTextForXp(control.closest("#trending-app, .trending-unified, .trending-block, [class*='filter' i], [class*='sort' i], [class*='ranking' i], [class*='finder' i], section, article")||control).slice(0,700);const hay=`${attrText} ${hostText}`.toLowerCase();const explicit=!!(control.matches&&control.matches(".trending-metric-btn, .trending-tab, [data-sort], [data-filter], [data-period], [data-metric]"));const selectLooksRelevant=control.matches&&control.matches("select")&&/sort|filter|rank|ranking|period|metric|view|popular|comment|active|today|week|month|all\s*time/.test(hay);const textLooksRelevant=/sort|filter|ranking|rankings|most\s+views|most\s+popular|most\s+comments|most\s+active\s+users|top\s+10\s+today|top\s+10\s+this\s+week|top\s+10\s+this\s+month|top\s+100\s+all\s*time|this\s+week|this\s+month|all\s*time/.test(hay);if(!inTrending&&!explicit&&!selectLooksRelevant&&!textLooksRelevant)return null;if(/account|profile|level|notification|privacy|connection|knowledge\s+masking|local\s+concept\s+map|search\s+suggestion/.test(hay)&&!inTrending)return null;let kind="filter";if(/metric|most\s+views|most\s+popular|most\s+comments|most\s+active|sort|ranking/.test(hay)||ds.metric)kind="sort";else if(/period|today|week|month|all\s*time|filter/.test(hay)||ds.period||ds.filter)kind="filter";const finalValue=value||attrText.slice(0,80)||kind;return{source:"sort-filter-control",eventName:ev&&ev.type||"sort-filter",controlKind:kind,controlKey:`${kind}:${finalValue}`,value:finalValue.slice(0,120),metric:ds.metric||"",period:ds.period||"",triggerText:attrText.slice(0,160),inTrending,};}catch(_){return null;}};const armSearchSuggestionState=(source,info)=>{try{const href=String(info&&info.href||"");const stateKey=stateKeyForHref("search-suggestion",href,`${info && info.querySample || ""}:${info && info.triggerText || ""}`);saveSessionJson(XP_PENDING_SEARCH_SUGGESTION_KEY,Object.assign({armedAt:Date.now(),source:source||"search-suggestion-intent",stateKey,},info||{}));}catch(_){}};const hrefPathForXpState=(value)=>String(value||"").split("#")[0].split("?")[0].replace(/^\/+/,"").replace(/\/$/,"").replace(/index\.html$/i,"");const currentLocationMatchesHref=(href)=>{try{const target=new URL(String(href||""),document.baseURI);const here=new URL(location.href);return hrefPathForXpState(target.pathname||"")===hrefPathForXpState(here.pathname||currentPath()||"");}catch(_){return false;}};const consumePendingSearchSuggestionState=(source)=>{try{const pending=readSessionJson(XP_PENDING_SEARCH_SUGGESTION_KEY);if(!pending||Date.now()-Number(pending.armedAt||0)>120000){clearSessionJson(XP_PENDING_SEARCH_SUGGESTION_KEY);return;}
const href=String(pending.href||"");if(href&&!currentLocationMatchesHref(href)&&source!=="same-page-delayed-check")return;clearSessionJson(XP_PENDING_SEARCH_SUGGESTION_KEY);trackSearchSuggestionUsed("search-suggestion-navigation-state",Object.assign({eventName:source||"search-suggestion-navigation-state",landedPath:currentPath()||location.pathname||""},pending));}catch(_){}};const trackRandomBrowseStarted=(source,extra)=>{return activateXpActionState("random_browse_start",stateKeyForCurrentConcept("random-browse"),Object.assign({source:source||"concept-finder-random",randomSignalVersion:7},extra||{}),{throttleMs:15000});};const trackGuidedStudyStarted=(source,extra)=>{return activateXpActionState("guided_study_start",stateKeyForCurrentConcept("guided-study"),Object.assign({source:source||"guided-study-start",guidedStudySignalVersion:9},extra||{}),{throttleMs:12000,keepalive:true});};const trackCourseDiagnosticsViewed=(source,extra)=>{return activateXpActionState("course_diagnostics_open",stateKeyForCurrentConcept("course-diagnostics"),Object.assign({source:source||"course-diagnostics-open",diagnosticsSignalVersion:9},extra||{}),{throttleMs:15000,keepalive:true});};const trackPrerequisiteReadinessViewed=(source,extra)=>{return activateXpActionState("prerequisite_readiness_open",stateKeyForCurrentConcept("prerequisite-readiness"),Object.assign({source:source||"prerequisite-readiness-open",readinessSignalVersion:9},extra||{}),{throttleMs:12000,keepalive:true});};window.MkXpActivity=Object.assign(window.MkXpActivity||{},{recordCourseSearchUsed:(detail)=>{const res=trackCourseSearchUsed("explicit-api",Object.assign({eventName:"explicit-api",courseSearchExplicitVersion:10},detail||{}));try{window.setTimeout(()=>flushLocalSyncQueue({force:false}).catch(()=>{}),80);}catch(_){}
try{window.setTimeout(()=>{if(window.MkHotTrack&&typeof window.MkHotTrack.flushLocalSyncQueue==="function")window.MkHotTrack.flushLocalSyncQueue({force:false});},120);}catch(_){}
try{window.setTimeout(()=>refreshAccountXpSoon("course-search-xp",0),900);}catch(_){}
try{window.setTimeout(()=>refreshAccountXpSoon("course-search-xp-late",0),2400);}catch(_){}
return res;},recordGuidedStudyStarted:(detail)=>trackGuidedStudyStarted("explicit-api",Object.assign({eventName:"explicit-api"},detail||{})),recordMapOpened:(detail)=>trackMapOpened("explicit-api",Object.assign({eventName:"explicit-api"},detail||{})),recordConceptFinderOpened:(detail)=>trackConceptFinderOpened("explicit-api",Object.assign({eventName:"explicit-api"},detail||{})),recordRandomBrowseStarted:(detail)=>trackRandomBrowseStarted("explicit-api",Object.assign({eventName:"explicit-api"},detail||{})),recordSearchSuggestionUsed:(detail)=>trackSearchSuggestionUsed("explicit-api",Object.assign({eventName:"explicit-api"},detail||{})),recordSortFilteringUsed:(detail)=>trackSortFilteringUsed("explicit-api",Object.assign({eventName:"explicit-api"},detail||{})),recordPanelOpened:(detail)=>trackScoredActivity("panel_open",Object.assign({source:"explicit-api",eventName:"explicit-api"},detail||{}),{scope:`panel_open:${normaliseXpStatePart(detail && (detail.panel || detail.source || detail.eventName) || "panel", "panel")}`,throttleMs:30000,keepalive:true}),recordCourseDiagnosticsOpened:(detail)=>trackCourseDiagnosticsViewed("explicit-api",Object.assign({eventName:"explicit-api"},detail||{})),recordPrerequisiteReadinessOpened:(detail)=>trackPrerequisiteReadinessViewed("explicit-api",Object.assign({eventName:"explicit-api"},detail||{})),record:(metric,detail,opts)=>{const m=String(metric||"").trim();if(!m)return Promise.resolve({ok:false,error:"missing_metric"});if(m==="map_open")return trackMapOpened("explicit-api-generic",Object.assign({eventName:"explicit-api-generic"},detail||{}));if(m==="guided_study_start")return trackGuidedStudyStarted("explicit-api-generic",Object.assign({eventName:"explicit-api-generic"},detail||{}));if(m==="random_browse_start")return trackRandomBrowseStarted("explicit-api-generic",Object.assign({eventName:"explicit-api-generic"},detail||{}));if(m==="concept_finder_open")return trackConceptFinderOpened("explicit-api-generic",Object.assign({eventName:"explicit-api-generic"},detail||{}));if(m==="course_search")return trackCourseSearchUsed("explicit-api-generic",Object.assign({eventName:"explicit-api-generic"},detail||{}));if(m==="search_suggestion")return trackSearchSuggestionUsed("explicit-api-generic",Object.assign({eventName:"explicit-api-generic"},detail||{}));if(m==="sort_use")return trackSortFilteringUsed("explicit-api-generic",Object.assign({eventName:"explicit-api-generic"},detail||{}));if(m==="course_diagnostics_open")return trackCourseDiagnosticsViewed("explicit-api-generic",Object.assign({eventName:"explicit-api-generic"},detail||{}));if(m==="prerequisite_readiness_open")return trackPrerequisiteReadinessViewed("explicit-api-generic",Object.assign({eventName:"explicit-api-generic"},detail||{}));const d=detail&&typeof detail==="object"?detail:{};return trackScoredActivity(m,Object.assign({source:"explicit-api-generic",eventName:"explicit-api-generic"},d),Object.assign({scope:`${m}:${stateKeyForCurrentConcept(m)}`,throttleMs:8000,keepalive:true},opts||{}));}});const controlTextForXp=(control)=>{try{return[control&&control.getAttribute&&control.getAttribute("aria-label"),control&&control.getAttribute&&control.getAttribute("title"),control&&control.getAttribute&&control.getAttribute("data-tooltip"),control&&control.getAttribute&&control.getAttribute("data-md-tooltip"),control&&control.dataset&&(control.dataset.action||control.dataset.target||control.dataset.panel||control.dataset.view||control.dataset.route||control.dataset.mode),control&&control.textContent,].filter(Boolean).join(" ").replace(/\s+/g," ").trim();}catch(_){return"";}};const genericLearningControlInfo=(target,ev,kind)=>{try{if(!target||!target.closest)return null;if(target.closest(".mk-local-activity-modal, .mk-local-mini-modal, .mk-comments-root, .mk-level-panel, .md-search, .md-search-result, .md-search__output, [data-md-component='search']"))return null;const control=target.closest("button, a, [role='button'], summary, details, [tabindex], [onclick], [data-action], [data-target], [data-panel], [data-view], [data-route], [data-mode]");if(!control||!isElementVisibleForXp(control)||controlLooksLikeSwitch(control))return null;const text=controlTextForXp(control).toLowerCase();const host=control.closest("section, aside, nav, details, [class*='learning' i], [class*='path' i], [class*='map' i], [class*='diagnos' i], [class*='readiness' i], [class*='route' i], [class*='tab' i]")||control;const hostText=contextTextForXp(host).slice(0,1400).toLowerCase();const focusedHost=control.closest("details, summary, [class*='diagnos' i], [id*='diagnos' i], [class*='readiness' i], [id*='readiness' i], [data-action], [data-target], [data-panel], [data-view]")||control;const focusedText=`${text} ${contextTextForXp(focusedHost).slice(0, 700).toLowerCase()}`;const hay=`${text} ${hostText}`;if(/account|profile|level|comment|notification|privacy|connection/.test(hay))return null;if(kind==="guided"){const looksGuided=/start\s+guided\s+study|guided\s+study|random\s+route|start\s+route|study\s+route/.test(hay);const goodContext=/tab|navigation|nav|route|map|concept\s+map|learning\s+map|guided\s+study/.test(hay);if(!looksGuided||!goodContext)return null;return{eventName:ev&&ev.type||"guided-study",triggerText:text.slice(0,160),hostText:hostText.slice(0,220),route:/random\s+route/.test(hay)?"random-route":"guided-study"};}
if(kind==="diagnostics"){if(!/course\s+diagnostics|course\s+diagnosis|diagnostics/.test(focusedText))return null;return{eventName:ev&&ev.type||"course-diagnostics",triggerText:text.slice(0,160),hostText:focusedText.slice(0,220)};}
if(kind==="readiness"){if(!/prerequisite\s+readiness|prereq\s+readiness/.test(focusedText))return null;return{eventName:ev&&ev.type||"prerequisite-readiness",triggerText:text.slice(0,160),hostText:focusedText.slice(0,220)};}}catch(_){}
return null;};const learningPathPanelTriggerInfo=(target)=>{try{if(!target||!target.closest)return null;const vw=Math.min(window.innerWidth||9999,document.documentElement&&document.documentElement.clientWidth||9999);if(vw>900)return null;if(target.closest(".mk-local-activity-modal, .mk-local-mini-modal, .mk-comments-root, .mk-level-panel"))return null;const control=target.closest("button, a, [role='button'], summary, [data-panel], [data-action]");if(!control||!isElementVisibleForXp(control)||controlLooksLikeSwitch(control))return null;const txt=[control.getAttribute("aria-label"),control.getAttribute("title"),control.dataset&&(control.dataset.panel||control.dataset.action||control.dataset.target||control.dataset.view),control.textContent,].filter(Boolean).join(" ").replace(/\s+/g," ").trim().toLowerCase();const host=control.closest("[class*='learning' i], [id*='learning' i], [class*='path' i], aside, nav, section, details")||control;const hostText=contextTextForXp(host).slice(0,1200);const hay=`${txt} ${hostText}`;if(/account|profile|level|comment|notification|privacy|connection/.test(hay))return null;if(/learning\s+path|learningpath|path\s+panel|open\s+path|study\s+path/.test(hay)){return{panel:"learning_path",mobile:true,viewportWidth:vw,eventName:"mobile-learning-path-open",triggerText:hay.slice(0,160)};}
return null;}catch(_){return null;}};const consumePendingConceptFinderState=(source)=>{try{const pending=readSessionJson(XP_PENDING_CONCEPT_FINDER_KEY)||{};if(pending.armedAt&&Date.now()-Number(pending.armedAt||0)>120000)clearSessionJson(XP_PENDING_CONCEPT_FINDER_KEY);if(pending.armedAt)clearSessionJson(XP_PENDING_CONCEPT_FINDER_KEY);return pending;}catch(_){return{};}};const checkConceptFinderPageOpen=(source)=>{try{if(!isConceptFinderPage())return;const pending=consumePendingConceptFinderState(source||"concept-finder-page-open")||{};trackConceptFinderOpened(source||"concept-finder-page-open",Object.assign({eventName:"concept-finder-page-state-open",path:currentPath()||location.pathname||"",title:document.title||"",conceptFinderStateConfirmed:true,},pending||{}));}catch(_){}};installLearningMapStateObserver();window.setTimeout(()=>checkConceptFinderPageOpen("concept-finder-page-open"),250);window.setTimeout(()=>consumePendingSearchSuggestionState("initial-page-load"),300);document.addEventListener("navigation:load",()=>window.setTimeout(()=>{checkConceptFinderPageOpen("concept-finder-navigation-load");consumePendingSearchSuggestionState("navigation-load");},250));window.addEventListener("popstate",()=>window.setTimeout(()=>{checkConceptFinderPageOpen("concept-finder-popstate");consumePendingSearchSuggestionState("popstate");},250));document.addEventListener("mk:map-opened",()=>trackMapOpened("mk:map-opened",{eventName:"mk:map-opened"}));document.addEventListener("mk:learning-map-opened",()=>trackMapOpened("mk:learning-map-opened",{eventName:"mk:learning-map-opened"}));document.addEventListener("mk:concept-map-opened",()=>trackMapOpened("mk:concept-map-opened",{eventName:"mk:concept-map-opened"}));document.addEventListener("mk:sort-filter-used",(ev)=>{const detail=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:{};trackSortFilteringUsed("explicit-sort-filter-event",Object.assign({eventName:"mk:sort-filter-used"},detail));});["mk:guided-study-started","mk:guided-study-start","mk:random-route-started","mk:random-route-start"].forEach((name)=>{document.addEventListener(name,(ev)=>{const detail=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:{};trackGuidedStudyStarted("explicit-guided-study-event",Object.assign({eventName:name},detail));});});["mk:course-diagnostics-opened","mk:course-diagnostics-open","mk:diagnostics-opened"].forEach((name)=>{document.addEventListener(name,(ev)=>{const detail=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:{};trackCourseDiagnosticsViewed("explicit-course-diagnostics-event",Object.assign({eventName:name},detail));});});["mk:prerequisite-readiness-opened","mk:prerequisite-readiness-open","mk:readiness-opened"].forEach((name)=>{document.addEventListener(name,(ev)=>{const detail=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:{};trackPrerequisiteReadinessViewed("explicit-prerequisite-readiness-event",Object.assign({eventName:name},detail));});});["mk:concept-finder-opened","mk:concept-finder-open","mk:finder-opened"].forEach((name)=>{document.addEventListener(name,(ev)=>{const detail=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:{};trackConceptFinderOpened("explicit-concept-finder-event",Object.assign({eventName:name},detail));});});["mk:random-browse-started","mk:random-browse-start","mk:random-concept-started"].forEach((name)=>{document.addEventListener(name,(ev)=>{const detail=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:{};trackRandomBrowseStarted("explicit-random-browse-event",Object.assign({eventName:name},detail));});});["mk:course-search-used","mk:search-used","mk:course-search-submitted"].forEach((name)=>{document.addEventListener(name,(ev)=>{const detail=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:{};trackCourseSearchUsed("explicit-course-search-event",Object.assign({eventName:name},detail));});});["mk:xp-activity","mk:record-xp-activity"].forEach((name)=>{document.addEventListener(name,(ev)=>{try{const detail=ev&&ev.detail&&typeof ev.detail==="object"?ev.detail:{};const metric=String(detail.metric||detail.type||"").trim();if(!metric||!window.MkXpActivity||typeof window.MkXpActivity.record!=="function")return;window.MkXpActivity.record(metric,Object.assign({eventName:name},detail));}catch(_){}});});document.addEventListener("toggle",(ev)=>{try{const t=ev.target;if(!t||!t.open)return;const diagInfo=genericLearningControlInfo(t,ev,"diagnostics");if(diagInfo)trackCourseDiagnosticsViewed("course-diagnostics-toggle-open",diagInfo);const readyInfo=genericLearningControlInfo(t,ev,"readiness");if(readyInfo)trackPrerequisiteReadinessViewed("prerequisite-readiness-toggle-open",readyInfo);}catch(_){}},true);document.addEventListener("change",(ev)=>{try{const info=sortingFilteringTriggerInfo(ev.target,ev);if(info)trackSortFilteringUsed("sort-filter-change",info);}catch(_){}},true);document.addEventListener("input",(ev)=>{try{const input=ev.target&&ev.target.closest&&ev.target.closest(".md-search__input, input[type='search'], input[name='q'], input[name='query']");if(input&&topSearchHostFor(input))rememberTopSearchQuery(input.value||"");}catch(_){}},true);document.addEventListener("keyup",(ev)=>{try{const input=ev.target&&ev.target.closest&&ev.target.closest(".md-search__input, input[type='search'], input[name='q'], input[name='query']");if(input&&topSearchHostFor(input))rememberTopSearchQuery(input.value||"");}catch(_){}},true);const earlyXpPointerHandler=(ev)=>{try{const t=ev.target;if(!t||!t.closest)return;const mapInfo=learningMapTriggerInfo(t,ev);if(mapInfo){const detail=Object.assign({eventName:"map-pointerdown-state"},mapInfo);trackMapOpened("learning-map-control-pointerdown",detail);armLearningMapOpenState("map-pointerdown-intent",detail);}
const suggestionInfo=searchSuggestionTriggerInfo(t);if(suggestionInfo)armSearchSuggestionState("top-search-suggestion-pointerdown-intent",suggestionInfo);}catch(_){}};document.addEventListener("pointerdown",earlyXpPointerHandler,true);if(!window.PointerEvent)document.addEventListener("mousedown",earlyXpPointerHandler,true);document.addEventListener("click",(ev)=>{const t=ev.target;if(!t||!t.closest)return;const aiBtn=t.closest("button, a, [role='button']");if(aiBtn){const aiTxt=[aiBtn.getAttribute("aria-label"),aiBtn.getAttribute("title"),aiBtn.dataset&&(aiBtn.dataset.action||aiBtn.dataset.status),aiBtn.textContent].filter(Boolean).join(" ").toLowerCase();if(/\b(accept|reject)\b/.test(aiTxt)){const area=findAiQuizArea(aiBtn);if(area&&nodeMatchesAiQuizResult(area)){const text=String((area.textContent||"")).replace(/\s+/g," ").trim().slice(0,520);trackAiQuizCompleted("ai-quiz-result-action-visible",{textSignature:text,action:aiTxt.slice(0,60),detectionVersion:2},{throttleMs:15000});}}}
const mapInfo=learningMapTriggerInfo(t,ev);if(mapInfo){const detail=Object.assign({eventName:"map-click-state"},mapInfo);trackMapOpened("learning-map-control-click",detail);armLearningMapOpenState("map-click-intent",detail);}
const panelInfo=learningPathPanelTriggerInfo(t);if(panelInfo)trackScoredActivity("panel_open",Object.assign({source:"mobile-learning-path-panel-click"},panelInfo),{scope:"panel_open:learning_path:mobile",throttleMs:45000});const sortFilterInfo=sortingFilteringTriggerInfo(t,ev);if(sortFilterInfo)trackSortFilteringUsed("sort-filter-click",sortFilterInfo);const suggestionInfo=searchSuggestionTriggerInfo(t);if(suggestionInfo){armSearchSuggestionState("top-search-suggestion-click-intent",suggestionInfo);window.setTimeout(()=>consumePendingSearchSuggestionState("same-page-delayed-check"),650);if(isConceptFinderHref(suggestionInfo.href,suggestionInfo.triggerText)){armConceptFinderOpenState("top-search-concept-finder-click-intent",{href:suggestionInfo.href,queryLength:suggestionInfo.queryLength||0,triggerText:suggestionInfo.triggerText||""});}}else{const link=t.closest("a[href]");if(link&&topSearchHostFor(link)){const href=link.getAttribute("href")||link.href||"";const ltxt=[link.textContent,link.getAttribute("aria-label"),link.getAttribute("title")].filter(Boolean).join(" ");const q=topSearchQueryFor(link);if(q.length>0){armSearchSuggestionState("top-search-suggestion-link-intent",{href,queryLength:q.length,querySample:q.slice(0,80),triggerText:ltxt.slice(0,160),suggestionSignalVersion:7});window.setTimeout(()=>consumePendingSearchSuggestionState("same-page-delayed-check"),650);}else if(!isConceptFinderHref(href,ltxt)){trackCourseSearchUsed("top-search-result-click",{href,triggerText:ltxt.slice(0,160)});}
if(isConceptFinderHref(href,ltxt)){armConceptFinderOpenState("top-search-concept-finder-click-intent",{href,queryLength:q.length||0,triggerText:ltxt.slice(0,160)});}}}
const randomControl=t.closest("button, a, [role='button']");if(randomControl){const rtxt=[randomControl.getAttribute("aria-label"),randomControl.getAttribute("title"),randomControl.dataset&&(randomControl.dataset.action||randomControl.dataset.target),randomControl.textContent].filter(Boolean).join(" ").replace(/\s+/g," ").trim().toLowerCase();const pageContext=`${currentPath()} ${document.title || ""} ${contextTextForXp(randomControl.closest("main, article, section, .md-content") || randomControl).slice(0, 900)}`.toLowerCase();if(/\b(start\s+random|random\s+brows(e|ing)|random\s+concept|surprise\s+me)\b/.test(rtxt)&&/concept\s+finder|random|finder/.test(pageContext)){trackRandomBrowseStarted("concept-finder-start-random-click",{triggerText:rtxt.slice(0,120)});}}
const guidedInfo=genericLearningControlInfo(t,ev,"guided");if(guidedInfo)trackGuidedStudyStarted("guided-study-control-click",guidedInfo);const diagnosticsInfo=genericLearningControlInfo(t,ev,"diagnostics");if(diagnosticsInfo)trackCourseDiagnosticsViewed("course-diagnostics-control-click",diagnosticsInfo);const readinessInfo=genericLearningControlInfo(t,ev,"readiness");if(readinessInfo)trackPrerequisiteReadinessViewed("prerequisite-readiness-control-click",readinessInfo);if(t.closest("[data-mastery-submit], .mastery-submit, .mk-mastery-submit, button[data-action='mastery-submit']")){try{markCloudSyncDirty("mastery-click");}catch(_){}}},true);document.addEventListener("keydown",(ev)=>{try{if(ev.key!=="Enter")return;const input=ev.target&&ev.target.closest&&ev.target.closest(".md-search__input, input[type='search'], input[name='q'], input[name='query']");if(!input||!topSearchHostFor(input))return;const q=String(input.value||"").trim();if(q.length>=2){rememberTopSearchQuery(q);armConceptFinderOpenState("top-search-enter-intent",{queryLength:q.length,querySample:q.slice(0,80)});trackCourseSearchUsed("top-search-enter",{queryLength:q.length,querySample:q.slice(0,80)});}}catch(_){}},true);document.addEventListener("submit",(ev)=>{try{const form=ev.target;if(!form||!form.querySelector)return;const input=form.querySelector(".md-search__input, input[type='search'], input[name='q'], input[name='query']");if(!input||!topSearchHostFor(input))return;const q=String(input.value||"").trim();if(q.length>=2){rememberTopSearchQuery(q);armConceptFinderOpenState("top-search-submit-intent",{queryLength:q.length,querySample:q.slice(0,80)});trackCourseSearchUsed("top-search-submit",{queryLength:q.length,querySample:q.slice(0,80)});}}catch(_){}},true);window.addEventListener("focus",()=>{if(!shouldSkipMobileBackgroundWork("window-focus")){flushLocalSyncQueue({force:false,reason:"window-focus"}).catch(()=>{});scheduleCloudSync("window-focus",{delay:1800});updateNotificationBadgesSoon(1800,{reason:"window-focus"});}},{passive:true});window.addEventListener("online",()=>{if(!shouldSkipMobileBackgroundWork("online"))flushLocalSyncQueue({force:false,reason:"online"}).catch(()=>{});},{passive:true});document.addEventListener("visibilitychange",()=>{if(!document.hidden&&!shouldSkipMobileBackgroundWork("visible")){flushLocalSyncQueue({force:false,reason:"visible"}).catch(()=>{});scheduleCloudSync("visible",{delay:1800});updateNotificationBadgesSoon(1800,{reason:"visible"});}},{passive:true});window.addEventListener("mk-local-activity-change",(ev)=>{try{const typ=ev&&ev.detail&&ev.detail.type;if(!/^cloud-sync/i.test(String(typ||"")))markCloudSyncDirty(typ||"external-change");if(String(typ||"")==="account-data")refreshAccountXpSoon("local-account-data-change",1200);}catch(_){}
updateNotificationBadgesSoon(isMobilePowerSensitiveViewport()?3000:500,{reason:"local-activity-change"});});const scheduleAccountMaintenance=(delay)=>{const d=Math.max(LOCAL_SYNC_QUEUE_INTERVAL_MS,Number(delay||0)||0);window.setTimeout(()=>{try{if(!pageIsHiddenForAccountSync()){const mobilePowerMode=isMobilePowerSensitiveViewport();const queueSize=localSyncQueueSize();const dirty=!!cloudSyncDirtyAt();const profile=readLocalProfile();const hasAccount=!!(profile&&profile.accountKey);if(!shouldSkipMobileBackgroundWork("periodic")){if(queueSize>0)flushLocalSyncQueue({force:false,reason:"periodic"}).catch(()=>{});if(hasAccount)scheduleCloudSync("periodic",{delay:mobilePowerMode?4500:1500,force:false});if(hasAccount)updateNotificationBadgesSoon(mobilePowerMode?6500:2500,{reason:"periodic"});}
scheduleAccountMaintenance(shouldSkipMobileBackgroundWork("periodic")?30*60*1000:LOCAL_SYNC_QUEUE_INTERVAL_MS);return;}}catch(_){}
scheduleAccountMaintenance(2*LOCAL_SYNC_QUEUE_INTERVAL_MS);},d);};scheduleAccountMaintenance(LOCAL_SYNC_QUEUE_INTERVAL_MS);}
let __commentEmojiDataRefreshBound=false;function bindCommentEmojiDataRefresh(){if(__commentEmojiDataRefreshBound)return;__commentEmojiDataRefreshBound=true;try{window.addEventListener("mk-comment-emoji-data-ready",()=>{document.querySelectorAll(".mk-comment-list").forEach((list)=>{if(list&&list.querySelector&&list.querySelector('[data-comment-pending="1"]'))return;loadCommentsInto(list,{silent:true,keepExistingOnError:true,reuseData:true}).catch(()=>{});});});}catch(_){}}
function boot(){installAccountLocalStorageMirrorMetadata();installLocalActivityApi();installAutoEventListenersOnce();try{flushPendingXpActivityQueue("boot");}catch(_){}
maybeActivateAdminFromUrl();maybeHandleAccountLoginFromUrl();const resumedWorkspaceSync=resumeAccountWorkspaceSyncIfNeeded();const lowHeatBoot=shouldSkipMobileBackgroundWork("boot");if(!lowHeatBoot){loadOnlineProfile().then(async()=>{if(!isMobilePowerSensitiveViewport())await ensureLocalActivityEventsHydrated().catch(()=>[]);const mobilePowerMode=isMobilePowerSensitiveViewport();const last=readLastCloudSyncAt();const dirty=!!cloudSyncDirtyAt();const recentCleanMobile=mobilePowerMode&&!dirty&&last&&Date.now()-last<MOBILE_CLOUD_SYNC_CLEAN_MIN_MS;const bootProfile=readLocalProfile();if(bootProfile&&bootProfile.accountKey&&!resumedWorkspaceSync){scheduleCloudSync("boot-initial",{delay:mobilePowerMode?4000:1500,force:false});}else{scheduleCloudSync("boot",{delay:mobilePowerMode?400:100,force:!mobilePowerMode&&!recentCleanMobile});}
updateNotificationBadgesSoon(mobilePowerMode?3500:900,{reason:"boot-online-profile"});}).catch(()=>{});updateNotificationBadgesSoon(isMobilePowerSensitiveViewport()?6500:1600,{reason:"boot"});scheduleLocalSyncQueueFlush(LOCAL_SYNC_QUEUE_INTERVAL_MS,{reason:"boot"});}
syncCommentEmojiEffectClass();try{window.addEventListener("mk-shop-trial-change",syncCommentEmojiEffectClass);window.addEventListener("mk-shop-inventory-change",syncCommentEmojiEffectClass);}catch(_){}
mountFavorite();mountReadinessCard();bootDeferHeavy(function(){try{bindCommentEmojiDataRefresh();}catch(_){}
try{loadCommentEmojiData().catch(()=>{});}catch(_){}
try{mountComments();}catch(_){}});}
function bootDeferHeavy(fn){let done=false;const run=function(){if(done)return;done=true;try{fn();}catch(_){}};const idle=function(){if(typeof window.requestIdleCallback==="function")window.requestIdleCallback(run,{timeout:1200});else window.setTimeout(run,200);};if(document.readyState==="complete")idle();else window.addEventListener("load",idle,{once:true});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();document.addEventListener("DOMContentSwitch",boot);document.addEventListener("navigation:load",boot);})();