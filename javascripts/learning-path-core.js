(function(){"use strict";const LP_FOG_ENABLED_KEY="lp_map_fog_enabled_v1";function lpReadFogEnabled(){try{const raw=localStorage.getItem(LP_FOG_ENABLED_KEY);return raw!=="0";}catch(_){return true;}}
function lpWriteFogEnabled(v){try{localStorage.setItem(LP_FOG_ENABLED_KEY,v?"1":"0");}catch(_){}}
function lpFogEnabled(){return lpReadFogEnabled();}
function lpSetFogEnabled(v){const enabled=!!v;lpWriteFogEnabled(enabled);try{document.querySelectorAll('[data-lp-fog-switch], [data-lp-ms-fog-switch]').forEach((el)=>{try{el.checked=enabled;}catch(_){}});}catch(_){}
try{window.dispatchEvent(new CustomEvent("lp:fog-change",{detail:{enabled,freeDefault:true}}));}catch(_){}}
const LP_NAV_CTX_KEY="lp_nav_ctx_v2";const LP_NAV_CTX_TTL_MS=10*60*1000;const LP_RELATED_BODY_CACHE_KEY="lp_related_body_cache_v3";const LP_GPS_MODE_KEY="lp_gps_mode_v1";const LP_GPS_ROUTE_KEY="lp_gps_route_v1";const LP_GPS_ROUTE_TTL_MS=8*60*60*1000;const LP_GPS_ROUTE_TICKET_KEY="lp_gps_route_ticket_v1";const LP_GPS_ROUTE_TICKET_TTL_MS=45*1000;const LP_MAP_ZOOM_DEFAULT=1;const LP_MAP_ZOOM_MIN=0.3;const LP_MAP_ZOOM_MAX=2.0;const LP_MAP_ZOOM_MIN_PCT=30;const LP_MAP_ZOOM_MAX_PCT=200;const LP_MAP_MOBILE_VISUAL_SCALE=0.6;const LP_ROUTE_MAP_MOBILE_DISTANCE_SCALE=0.7;const LP_3D_MAP_ENABLED=true;const LP_3D_LOCAL_ROT_X=-18;const LP_3D_LOCAL_ROT_Y=22;const LP_3D_ROUTE_ROT_X=-12;const LP_3D_ROUTE_ROT_Y=0;const LP_3D_ROT_X_MIN=-78;const LP_3D_ROT_X_MAX=78;const LP_3D_ROT_Y_MIN=-180;const LP_3D_ROT_Y_MAX=180;const LP_WEBGL3D_CAMERA=1350;const LP_MAP_VIEW_MODE_KEY="lp_map_view_mode_v1";const LP_3D_LOCAL_MAP_ITEM_ID="local_map_3d";const LP_3D_LOCAL_MAP_PRICE=500;const LP_3D_LOCAL_MAP_NAME="3D Local Map";const LP_LOCAL_MAP_ANIM_ITEM_ID="local_map_animations";const LP_LOCAL_MAP_ANIM_PRICE=220;const LP_LOCAL_MAP_ANIM_NAME="Local Map Animations";const LP_KNOWLEDGE_MASKING_ITEM_ID="knowledge_masking";const LP_KNOWLEDGE_MASKING_PRICE=300;const LP_KNOWLEDGE_MASKING_NAME="Knowledge Masking";const LP_GUIDED_ROUTES_ITEM_ID="guided_routes";const LP_GUIDED_ROUTES_PRICE=100;const LP_GUIDED_ROUTES_NAME="Guided Routes";function lp3dShopApi(){try{return window.MkAccountData||null;}catch(_){return null;}}
function lpShopItemOwned(itemId){try{const api=lp3dShopApi();if(api&&typeof api.hasShopItemAccess==='function')return!!api.hasShopItemAccess(itemId);if(api&&typeof api.hasShopItem==='function'&&api.hasShopItem(itemId))return true;const inv=api&&typeof api.getShopInventory==='function'?api.getShopInventory():null;if(inv&&inv.owned&&inv.owned[itemId])return true;if(inv&&Array.isArray(inv.activeTrials)&&inv.activeTrials.some((row)=>row&&String(row.itemId||'')===String(itemId)))return true;const activeTrials=api&&typeof api.getActiveShopTrials==='function'?api.getActiveShopTrials():[];if(Array.isArray(activeTrials)&&activeTrials.some((row)=>row&&String(row.itemId||'')===String(itemId)))return true;const xp=api&&typeof api.xp==='function'?api.xp():null;const owned=xp&&(xp.ownedShopItems||(xp.shopInventory&&xp.shopInventory.ownedIds));if(Array.isArray(owned)&&owned.indexOf(itemId)>=0)return true;const xpTrials=xp&&xp.shopInventory&&Array.isArray(xp.shopInventory.activeTrials)?xp.shopInventory.activeTrials:[];return Array.isArray(xpTrials)&&xpTrials.some((row)=>row&&String(row.itemId||'')===String(itemId));}catch(_){return false;}}
function lp3dOwnsLocalMapItem(){return lpShopItemOwned(LP_3D_LOCAL_MAP_ITEM_ID);}
function lpLocalMapAnimationsUnlocked(){return lpShopItemOwned(LP_LOCAL_MAP_ANIM_ITEM_ID);}
function lpLocalMapAnimationsEnabled(modal){try{const ok=lpLocalMapAnimationsUnlocked();const root=modal||document.getElementById("lp-map-modal");if(root&&root.classList){root.classList.toggle("lp-local-map-animations-on",!!ok);root.classList.toggle("lp-local-map-animations-off",!ok);root.setAttribute("data-lp-map-animations",ok?"on":"off");}
return!!ok;}catch(_){return false;}}
function lpSyncLocalMapAnimationAccess(modal){return lpLocalMapAnimationsEnabled(modal||document.getElementById("lp-map-modal"));}
function lpGuidedRoutesUnlocked(){return true;}
function lpCurrencyBalance(){try{const api=lp3dShopApi();const xp=api&&typeof api.xp==='function'?api.xp():null;return Number(xp&&(xp.currencyBalance!=null?xp.currencyBalance:xp.eorbits)||0)||0;}catch(_){return 0;}}
function lpShowLockedHint(btn,itemName,price,actionText){try{const balance=lpCurrencyBalance();const missing=Math.max(0,Number(price||0)-balance);const msg=balance>=Number(price||0)?`${itemName} needs ${price} EORbits. Click to unlock ${actionText || 'this feature'}.`:`${itemName} needs ${price} EORbits. You need ${Math.ceil(missing)} more EORbits.`;if(btn)btn.title=msg;return msg;}catch(_){return`${itemName} is locked.`;}}
function lp3dShowLockedHint(btn){return lpShowLockedHint(btn,LP_3D_LOCAL_MAP_NAME,LP_3D_LOCAL_MAP_PRICE,'the 3D map');}
function lpQueueXpActivity(metric,detail){try{const key="mk_xp_pending_activity_queue_v1";const arr=JSON.parse(localStorage.getItem(key)||"[]");arr.push({metric,details:detail||{},opts:{scope:`${metric}:${detail && (detail.actionStateKey || detail.path || detail.eventName || Date.now())}`,throttleMs:0},queuedAt:Date.now(),source:"learning-path-fallback"});localStorage.setItem(key,JSON.stringify(arr.slice(-300)));}catch(_){}}
function lp3dMapViewMode(){try{if(!lp3dOwnsLocalMapItem())return'2d';const raw=String(localStorage.getItem(LP_MAP_VIEW_MODE_KEY)||'').toLowerCase();return raw==='3d'?'3d':'2d';}catch(_){return'2d';}}
function lp3dSetMapViewMode(mode){const next=String(mode||'').toLowerCase()==='2d'?'2d':'3d';try{localStorage.setItem(LP_MAP_VIEW_MODE_KEY,next);}catch(_){}
try{window.dispatchEvent(new CustomEvent('lp:map-view-mode-change',{detail:{mode:next}}));}catch(_){}
return next;}
function lp3dMapEnabled(){try{if(!LP_3D_MAP_ENABLED)return false;if(!lp3dOwnsLocalMapItem())return false;if(lp3dMapViewMode()==='2d')return false;return localStorage.getItem('lp_3d_map_enabled_v1')!=='0';}catch(_){return false;}}
function lp3dClampNumber(v,lo,hi,fallback){const n=Number(v);const x=Number.isFinite(n)?n:fallback;return Math.max(lo,Math.min(hi,x));}
function lp3dEnsureStyles(){if(document.getElementById('lp-3d-map-style-v3'))return;try{['lp-3d-map-style-v1','lp-3d-map-style-v2'].forEach((id)=>{const old=document.getElementById(id);if(old&&old.parentNode)old.parentNode.removeChild(old);});}catch(_){}
const st=document.createElement('style');st.id='lp-3d-map-style-v3';st.textContent=`
      #lp-map-modal.lp-map-3d .lp-mapstage,
      #lp-h1sg-modal.lp-route-3d .lp-mapstage{
        perspective:1200px;
        perspective-origin:50% 48%;
        transform-style:preserve-3d;
      }
      #lp-map-modal.lp-map-3d .lp-mapviewport,
      #lp-h1sg-modal.lp-route-3d [data-lp-h1sg-viewport]{
        transform-style:preserve-3d !important;
        backface-visibility:visible;
        will-change:transform;
      }
      #lp-map-modal.lp-map-3d .lp-mapviewport svg,
      #lp-h1sg-modal.lp-route-3d .lp-h1sg-overlay{
        transform:translateZ(-18px);
        transform-origin:center center;
        filter:drop-shadow(0 18px 30px rgba(0,0,0,.20));
      }
      #lp-map-modal.lp-map-3d a.lp-node,
      #lp-h1sg-modal.lp-route-3d .lp-node{
        backface-visibility:hidden;
        transform-style:preserve-3d;
        will-change:transform, filter;
      }
      #lp-map-modal.lp-map-3d a.lp-node{
        transform:translate(-50%,-50%) translateZ(var(--lp-3d-z, 0px)) scale(var(--lp-3d-node-scale, 1)) !important;
        transition:none !important;
      }
      #lp-map-modal.lp-map-3d a.lp-node:hover,
      #lp-map-modal.lp-map-3d a.lp-node:focus-visible{
        --lp-3d-node-scale:1.16;
        z-index:72 !important;
      }
      #lp-map-modal.lp-map-3d a.lp-node.lp-focus{
        --lp-3d-node-scale:1.20;
        z-index:78 !important;
      }
      #lp-map-modal.lp-map-3d a.lp-node.lp-keep:not(.lp-focus){
        --lp-3d-node-scale:1.06;
      }
      #lp-map-modal.lp-map-3d a.lp-node::after,
      #lp-h1sg-modal.lp-route-3d .lp-node::after{
        box-shadow:
          0 15px 28px rgba(0,0,0,.24),
          0 2px 0 rgba(255,255,255,.06) inset !important;
      }
      #lp-map-modal.lp-map-3d a.lp-node.is-cur::after,
      #lp-h1sg-modal.lp-route-3d .lp-node.is-cur::after{
        box-shadow:
          0 0 0 1px rgba(121,179,255,.42),
          0 0 0 7px rgba(96,165,250,.18),
          0 22px 40px rgba(0,0,0,.30),
          0 0 54px rgba(96,165,250,.20) !important;
      }
      #lp-h1sg-modal.lp-route-3d .lp-node{
        transform:translate(-50%,-50%) translateZ(var(--lp-3d-z, 0px)) scale(var(--lp-3d-node-scale, 1)) !important;
      }
      #lp-h1sg-modal.lp-route-3d .lp-node:hover,
      #lp-h1sg-modal.lp-route-3d .lp-node:focus-visible{
        --lp-3d-node-scale:calc(var(--lp-h1sg-hover-scale, 1) * 1.16);
        z-index:72 !important;
      }
      #lp-h1sg-modal.lp-route-3d .lp-node.lp-route-anim-focus{
        --lp-3d-node-scale:var(--lp-h1sg-node-extra-scale, 1);
      }
      #lp-map-modal.lp-map-3d .lp-node-label,
      #lp-h1sg-modal.lp-route-3d .lp-node-label{
        transform:translateZ(1px);
      }
      #lp-map-modal.lp-map-3d .lp-mbox::after,
      #lp-h1sg-modal.lp-route-3d .lp-mbox::after{
        content:"3D view";
        position:absolute;
        left:14px;
        bottom:calc(env(safe-area-inset-bottom, 0px) + 14px);
        z-index:3;
        padding:5px 10px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(7,12,24,.36);
        color:rgba(255,255,255,.78);
        font-size:.74rem;
        line-height:1;
        font-weight:760;
        letter-spacing:.02em;
        pointer-events:none;
        backdrop-filter:blur(8px);
        -webkit-backdrop-filter:blur(8px);
      }
      html[data-md-color-scheme="default"] #lp-map-modal.lp-map-3d .lp-mbox::after,
      body[data-md-color-scheme="default"] #lp-map-modal.lp-map-3d .lp-mbox::after,
      html[data-md-color-scheme="default"] #lp-h1sg-modal.lp-route-3d .lp-mbox::after,
      body[data-md-color-scheme="default"] #lp-h1sg-modal.lp-route-3d .lp-mbox::after{
        background:rgba(255,255,255,.64);
        color:rgba(15,23,42,.72);
        border-color:rgba(15,23,42,.12);
      }
      #lp-map-modal.lp-map-3d .lp-3d-rotctl,
      #lp-h1sg-modal.lp-route-3d .lp-3d-rotctl{
        position:absolute;
        left:14px;
        bottom:calc(env(safe-area-inset-bottom, 0px) + 58px);
        z-index:6;
        display:flex;
        align-items:center;
        gap:6px;
        padding:7px 8px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(7,12,24,.44);
        color:rgba(255,255,255,.86);
        box-shadow:0 12px 30px rgba(0,0,0,.22);
        backdrop-filter:blur(10px);
        -webkit-backdrop-filter:blur(10px);
        user-select:none;
        -webkit-user-select:none;
        touch-action:none;
      }
      html[data-md-color-scheme="default"] #lp-map-modal.lp-map-3d .lp-3d-rotctl,
      body[data-md-color-scheme="default"] #lp-map-modal.lp-map-3d .lp-3d-rotctl,
      html[data-md-color-scheme="default"] #lp-h1sg-modal.lp-route-3d .lp-3d-rotctl,
      body[data-md-color-scheme="default"] #lp-h1sg-modal.lp-route-3d .lp-3d-rotctl{
        background:rgba(255,255,255,.70);
        color:rgba(15,23,42,.82);
        border-color:rgba(15,23,42,.12);
      }
      #lp-map-modal.lp-map-3d .lp-3d-rot-label,
      #lp-h1sg-modal.lp-route-3d .lp-3d-rot-label{
        font-size:.74rem;
        font-weight:820;
        letter-spacing:.01em;
        padding:0 3px 0 2px;
        cursor:grab;
        white-space:nowrap;
      }
      #lp-map-modal.lp-map-3d .lp-3d-rotctl.is-dragging .lp-3d-rot-label,
      #lp-h1sg-modal.lp-route-3d .lp-3d-rotctl.is-dragging .lp-3d-rot-label{ cursor:grabbing; }
      #lp-map-modal.lp-map-3d .lp-3d-rot-btn,
      #lp-h1sg-modal.lp-route-3d .lp-3d-rot-btn{
        appearance:none;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(255,255,255,.07);
        color:inherit;
        width:25px;
        height:25px;
        border-radius:999px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        font:inherit;
        font-size:.76rem;
        line-height:1;
        font-weight:900;
        cursor:pointer;
        padding:0;
      }
      #lp-map-modal.lp-map-3d .lp-3d-rot-btn:hover,
      #lp-h1sg-modal.lp-route-3d .lp-3d-rot-btn:hover{
        background:rgba(99,102,241,.24);
        border-color:rgba(129,140,248,.42);
      }
      #lp-map-modal.lp-map-3d .lp-3d-rot-reset,
      #lp-h1sg-modal.lp-route-3d .lp-3d-rot-reset{
        width:auto;
        padding:0 8px;
        font-size:.72rem;
      }
      #lp-map-modal.lp-map-3d .lp-mbox::after,
      #lp-h1sg-modal.lp-route-3d .lp-mbox::after{
        content:"3D: drag map to rotate";
        left:118px;
        bottom:calc(env(safe-area-inset-bottom, 0px) + 16px);
      }
      #lp-map-modal .lp-view-toggle,
      #lp-h1sg-modal .lp-view-toggle{
        position:absolute;
        left:14px;
        bottom:calc(env(safe-area-inset-bottom, 0px) + 14px);
        z-index:11;
        display:inline-flex;
        align-items:center;
        gap:3px;
        padding:4px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(7,12,24,.50);
        color:rgba(255,255,255,.88);
        box-shadow:0 12px 30px rgba(0,0,0,.22);
        backdrop-filter:blur(10px);
        -webkit-backdrop-filter:blur(10px);
        user-select:none;
        -webkit-user-select:none;
      }
      html[data-md-color-scheme="default"] #lp-map-modal .lp-view-toggle,
      body[data-md-color-scheme="default"] #lp-map-modal .lp-view-toggle,
      html[data-md-color-scheme="default"] #lp-h1sg-modal .lp-view-toggle,
      body[data-md-color-scheme="default"] #lp-h1sg-modal .lp-view-toggle{
        background:rgba(255,255,255,.74);
        color:rgba(15,23,42,.84);
        border-color:rgba(15,23,42,.12);
      }
      #lp-map-modal .lp-view-toggle button,
      #lp-h1sg-modal .lp-view-toggle button{
        appearance:none;
        border:0;
        border-radius:999px;
        background:transparent;
        color:inherit;
        min-width:36px;
        height:26px;
        padding:0 9px;
        font:inherit;
        font-size:.74rem;
        line-height:1;
        font-weight:860;
        cursor:pointer;
        opacity:.68;
      }
      #lp-map-modal .lp-view-toggle button[aria-pressed="true"],
      #lp-h1sg-modal .lp-view-toggle button[aria-pressed="true"]{
        opacity:1;
        background:linear-gradient(135deg, rgba(96,165,250,.86), rgba(99,102,241,.72));
        color:white;
        box-shadow:0 6px 16px rgba(59,130,246,.24);
      }
      #lp-map-modal .lp-view-toggle button:hover,
      #lp-h1sg-modal .lp-view-toggle button:hover{
        opacity:1;
        background:rgba(129,140,248,.18);
      }
      #lp-map-modal .lp-view-toggle button.is-locked,
      #lp-h1sg-modal .lp-view-toggle button.is-locked{
        position:relative;
        opacity:.86;
      }
      #lp-map-modal .lp-view-toggle button.is-locked::after,
      #lp-h1sg-modal .lp-view-toggle button.is-locked::after{
        content:"🔒";
        font-size:.52rem;
        margin-left:3px;
        vertical-align:middle;
      }
      #lp-map-modal .lp-view-toggle button[aria-pressed="true"]:hover,
      #lp-h1sg-modal .lp-view-toggle button[aria-pressed="true"]:hover{
        background:linear-gradient(135deg, rgba(96,165,250,.92), rgba(99,102,241,.78));
      }
      #lp-map-modal.lp-map-3d .lp-mbox::after,
      #lp-h1sg-modal.lp-route-3d .lp-mbox::after,
      #lp-map-modal.lp-webgl3d .lp-mbox::after,
      #lp-h1sg-modal.lp-webgl3d .lp-mbox::after{
        content:none !important;
        display:none !important;
      }
      #lp-map-modal .lp-3d-rotctl,
      #lp-h1sg-modal .lp-3d-rotctl{
        display:none !important;
      }
      @media (max-width: 900px){
        #lp-map-modal.lp-map-3d .lp-mapstage,
        #lp-h1sg-modal.lp-route-3d .lp-mapstage{ perspective:1050px; }
        #lp-map-modal.lp-map-3d .lp-3d-rotctl,
        #lp-h1sg-modal.lp-route-3d .lp-3d-rotctl{
          left:12px;
          bottom:calc(env(safe-area-inset-bottom, 0px) + 104px);
          max-width:calc(100% - 24px);
          overflow:hidden;
        }
        #lp-map-modal.lp-map-3d .lp-3d-rot-label,
        #lp-h1sg-modal.lp-route-3d .lp-3d-rot-label{
          max-width:78px;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #lp-map-modal.lp-map-3d .lp-mbox::after,
        #lp-h1sg-modal.lp-route-3d .lp-mbox::after{
          display:none;
        }
      }
    `;(document.head||document.documentElement).appendChild(st);}
function lp3dClearModal3D(modal){if(!modal)return;try{modal.classList.remove('lp-map-3d','lp-route-3d','lp-webgl3d','lp-webgl3d-dragging');}catch(_){}
try{const eng=modal.__lpWebgl3dEngine;if(eng&&typeof eng.__disposeLifecycle==='function')eng.__disposeLifecycle();else{if(eng&&eng.__animRaf)cancelAnimationFrame(eng.__animRaf);if(eng&&eng.__mo)eng.__mo.disconnect();}
modal.__lpWebgl3dEngine=null;}catch(_){}
try{Array.from(modal.querySelectorAll('canvas.lp-webgl3d-canvas')).forEach((c)=>c.remove());}catch(_){}
try{Array.from(modal.querySelectorAll('svg.lp-webgl3d-overlay')).forEach((c)=>c.remove());}catch(_){}
try{Array.from(modal.querySelectorAll('.lp-3d-rotctl')).forEach((c)=>c.remove());}catch(_){}
try{Array.from(modal.querySelectorAll('.lp-node[data-lp-loc], a.lp-node[data-lp-loc]')).forEach((el)=>{el.style.removeProperty('--lp-webgl-label-scale');el.style.removeProperty('--lp-webgl-hover-scale');el.style.removeProperty('--lp-3d-z');el.style.removeProperty('--lp-3d-node-scale');el.style.removeProperty('opacity');el.style.removeProperty('z-index');try{el.classList.remove('lp-webgl3d-hover');}catch(_){}
try{delete el.__lpWebglBaseX;delete el.__lpWebglBaseY;delete el.__lpWebglScreenX;delete el.__lpWebglScreenY;delete el.__lpWebglScreenZ;delete el.__lpWebglScreenScale;}catch(_){}});}catch(_){}}
function lp3dUpdateViewToggle(modal){try{const mode=lp3dMapViewMode();const wrap=modal&&modal.querySelector?modal.querySelector('.lp-view-toggle'):null;if(!wrap)return;const owns=lp3dOwnsLocalMapItem();Array.from(wrap.querySelectorAll('[data-lp-view-mode]')).forEach((btn)=>{const m=btn.getAttribute('data-lp-view-mode')==='2d'?'2d':'3d';btn.setAttribute('aria-pressed',m===mode?'true':'false');if(m==='3d'){btn.classList.toggle('is-locked',!owns);if(!owns)lp3dShowLockedHint(btn);else btn.title='Use the rotatable WebGL 3D map';}});}catch(_){}}
function lp3dDefaultRot(kind){const isRoute=kind==='route';return{rx:isRoute?LP_3D_ROUTE_ROT_X:LP_3D_LOCAL_ROT_X,ry:isRoute?LP_3D_ROUTE_ROT_Y:LP_3D_LOCAL_ROT_Y,};}
function lp3dViewportTiltTransform(modal,kind){return'';}
function lp3dViewportTransform(modal,kind,tx,ty,scale,use3dBase){const sc=Number(scale)||1;const base=use3dBase?`translate3d(${Number(tx) || 0}px, ${Number(ty) || 0}px, 0) scale3d(${sc}, ${sc}, 1)`:`translate(${Number(tx) || 0}px, ${Number(ty) || 0}px) scale(${sc})`;return base+lp3dViewportTiltTransform(modal,kind);}
function lpWebgl3dEnabled(){try{if(!lp3dMapEnabled())return false;return localStorage.getItem('lp_webgl3d_map_enabled_v1')!=='0';}catch(_){return lp3dMapEnabled();}}
function lpWebgl3dEnsureStyles(){if(document.getElementById('lp-webgl-3d-style-v3'))return;const st=document.createElement('style');st.id='lp-webgl-3d-style-v3';st.textContent=`
      #lp-map-modal.lp-webgl3d .lp-mapviewport,
      #lp-h1sg-modal.lp-webgl3d [data-lp-h1sg-viewport]{
        transform-style:flat !important;
        perspective:none !important;
      }
      #lp-map-modal.lp-webgl3d .lp-mapviewport svg.lp-map-svg,
      #lp-map-modal.lp-webgl3d .lp-mapviewport svg.lp-map-svg-hi,
      #lp-h1sg-modal.lp-webgl3d .lp-h1sg-overlay{
        opacity:0 !important;
        visibility:hidden !important;
        pointer-events:none !important;
      }
      #lp-map-modal.lp-webgl3d .lp-webgl3d-overlay,
      #lp-h1sg-modal.lp-webgl3d .lp-webgl3d-overlay{
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        z-index:7;
        overflow:visible;
        pointer-events:none;
      }
      #lp-map-modal.lp-webgl3d .lp-webgl3d-edge,
      #lp-h1sg-modal.lp-webgl3d .lp-webgl3d-edge{
        fill:none;
        stroke-linecap:round;
        stroke-linejoin:round;
        vector-effect:non-scaling-stroke;
      }
      #lp-map-modal.lp-webgl3d .lp-webgl3d-edge.is-related{
        stroke-dasharray:6 6;
        animation:none;
      }
      #lp-map-modal.lp-webgl3d .lp-webgl3d-edge.is-related.lp-rel-anim{
        animation:none !important;
      }
      #lp-map-modal.lp-webgl3d .lp-webgl3d-hi-edge{
        filter:drop-shadow(0 0 8px rgba(255,255,255,.20));
      }
      #lp-h1sg-modal.lp-webgl3d .lp-webgl3d-hi-edge{
        /* Route-map highlight means visible/not dimmed, not glowing. */
        filter:none !important;
      }
      #lp-map-modal.lp-webgl3d .lp-webgl3d-flow-arrow{
        filter:drop-shadow(0 0 8px currentColor);
        will-change:transform, opacity;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-webgl3d-flow-arrow{
        filter:none !important;
        will-change:transform, opacity;
      }
      #lp-map-modal.lp-webgl3d .lp-fog-layer{
        opacity:.26 !important;
        filter:blur(20px) saturate(1.08) !important;
        -webkit-filter:blur(20px) saturate(1.08) !important;
      }
      #lp-map-modal .lp-webgl3d-canvas,
      #lp-h1sg-modal .lp-webgl3d-canvas{
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        z-index:5;
        pointer-events:auto;
        touch-action:none;
        user-select:none;
        -webkit-user-select:none;
        outline:none;
      }
      #lp-map-modal.lp-webgl3d a.lp-node,
      #lp-h1sg-modal.lp-webgl3d .lp-node{
        transform:translate(-50%, -50%) scale(calc(var(--lp-webgl-label-scale, 1) * var(--lp-webgl-hover-scale, 1))) !important;
        will-change:left, top, transform, opacity;
      }
      #lp-map-modal.lp-webgl3d a.lp-node{
        transition:none !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node{
        transition:filter .12s ease, opacity .12s ease, transform .12s ease !important;
      }
      #lp-map-modal.lp-webgl3d a.lp-node:hover,
      #lp-map-modal.lp-webgl3d a.lp-node:focus-visible,
      #lp-map-modal.lp-webgl3d a.lp-node.lp-webgl3d-hover,
      #lp-map-modal.lp-webgl3d a.lp-node.lp-focus,
      #lp-map-modal.lp-webgl3d a.lp-node.lp-keep,
      #lp-h1sg-modal.lp-webgl3d .lp-node:hover,
      #lp-h1sg-modal.lp-webgl3d .lp-node:focus-visible,
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-webgl3d-hover,
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-route-anim-focus{
        --lp-webgl-hover-scale:1;
        --lp-route-pulse-scale:1;
      }
      #lp-map-modal.lp-webgl3d a.lp-node:hover,
      #lp-map-modal.lp-webgl3d a.lp-node:focus-visible{
        filter:brightness(1.16) saturate(1.08) drop-shadow(0 0 18px rgba(255,255,255,.18)) !important;
        z-index:999 !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node:hover,
      #lp-h1sg-modal.lp-webgl3d .lp-node:focus-visible{
        filter:none !important;
        z-index:999 !important;
      }
      #lp-map-modal.lp-webgl3d a.lp-node.lp-webgl3d-hover::after,
      #lp-map-modal.lp-webgl3d a.lp-node:hover::after{
        border-color:rgba(255,255,255,.92) !important;
        box-shadow:
          0 0 0 1px rgba(255,255,255,.24),
          0 16px 32px rgba(0,0,0,.30),
          0 0 42px rgba(129,140,248,.22) !important;
      }
      #lp-h1sg-modal.lp-webgl3d .lp-node.lp-webgl3d-hover::after,
      #lp-h1sg-modal.lp-webgl3d .lp-node:hover::after{
        border-color:rgba(255,255,255,.82) !important;
        box-shadow:0 10px 22px rgba(0,0,0,.16) !important;
      }
      html[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node.lp-webgl3d-hover::after,
      html[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node:hover::after,
      body[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node.lp-webgl3d-hover::after,
      body[data-md-color-scheme="default"] #lp-h1sg-modal.lp-webgl3d .lp-node:hover::after{
        border-color:rgba(15,23,42,.16) !important;
        box-shadow:0 10px 22px rgba(15,23,42,.12) !important;
      }
      #lp-map-modal.lp-webgl3d .lp-mbox::after,
      #lp-h1sg-modal.lp-webgl3d .lp-mbox::after,
      #lp-map-modal.lp-webgl3d .lp-3d-rot-label::after,
      #lp-h1sg-modal.lp-webgl3d .lp-3d-rot-label::after{
        content:none !important;
        display:none !important;
      }
    `;(document.head||document.documentElement).appendChild(st);}
function lpWebgl3dNodeColor(el,kind){try{if(el&&el.classList&&el.classList.contains('is-cur'))return[0.42,0.68,1.0,1.0];if(el&&el.classList&&el.classList.contains('lp-route-anim-focus'))return[0.56,0.84,1.0,1.0];const visual=String((el&&el.getAttribute&&el.getAttribute('data-lp-visual'))||'').toLowerCase();if(visual==='mastered'||(el&&el.classList&&el.classList.contains('lp-node-mastered')))return[1.0,0.76,0.22,1.0];if(visual==='know')return[0.78,0.86,0.98,1.0];if(visual==='fuzzy')return[1.0,0.70,0.22,0.96];if(visual==='dont')return[1.0,0.32,0.32,0.92];if(visual==='unvisited'||(el&&el.getAttribute&&el.getAttribute('data-lp-unvisited')==='1'))return[0.78,0.82,0.92,0.62];if(el&&el.getAttribute&&el.getAttribute('data-lp-from-rel')==='1')return[0.66,0.54,1.0,0.82];}catch(_){}
return kind==='route'?[0.62,0.78,1.0,0.96]:[0.90,0.94,1.0,0.92];}
function lpWebgl3dEdgeColor(type,alpha,kind){const t=String(type||'').toLowerCase();const a=Number.isFinite(Number(alpha))?Number(alpha):0.62;if(kind==='route')return[0.45,0.86,1.0,a];if(t==='related')return[0.66,0.54,1.0,Math.min(a,0.54)];if(t==='pre'||t==='prereq')return[0.12,0.80,0.54,a];if(t==='dep'||t==='dependent')return[0.36,0.64,1.0,a];return[0.86,0.90,1.0,a];}
function lpWebgl3dParsePx(v,fallback){const n=Number.parseFloat(String(v||'').replace('px',''));return Number.isFinite(n)?n:(Number(fallback)||0);}
function lpWebgl3dViewportSize(engine){const vp=engine&&engine.viewport;const state=engine&&engine.state;let W=0;let H=0;try{const svg=vp&&vp.querySelector?(vp.querySelector('svg.lp-map-svg')||vp.querySelector('svg.lp-h1sg-overlay')):null;const vb=svg?String(svg.getAttribute('viewBox')||'').trim().split(/\s+/).map(Number):[];W=Math.max(W,Number(vb[2])||0,Number(svg&&svg.getAttribute('width'))||0);H=Math.max(H,Number(vb[3])||0,Number(svg&&svg.getAttribute('height'))||0);}catch(_){}
try{W=Math.max(W,Number(state&&state.view&&state.view.worldW)||0,Number(vp&&vp.offsetWidth)||0,Number(vp&&vp.clientWidth)||0,960);H=Math.max(H,Number(state&&state.view&&state.view.worldH)||0,Number(vp&&vp.offsetHeight)||0,Number(vp&&vp.clientHeight)||0,640);}catch(_){}
return{W:Math.round(W),H:Math.round(H)};}
function lpWebgl3dCompile(gl,type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){const msg=gl.getShaderInfoLog(sh)||'shader compile failed';try{gl.deleteShader(sh);}catch(_){}
throw new Error(msg);}
return sh;}
function lpWebgl3dInitGl(engine){if(engine.gl&&engine.program)return true;const canvas=engine.canvas;const gl=canvas.getContext('webgl',{alpha:true,antialias:true,depth:false,stencil:false,preserveDrawingBuffer:false});if(!gl)return false;const vs=`
      attribute vec3 a_pos;
      attribute vec4 a_color;
      attribute float a_size;
      uniform float u_rx;
      uniform float u_ry;
      uniform float u_cx;
      uniform float u_cy;
      uniform float u_w;
      uniform float u_h;
      uniform float u_camera;
      uniform float u_pointBoost;
      varying vec4 v_color;
      varying float v_size;
      void main(){
        float cx = cos(u_rx);
        float sx = sin(u_rx);
        float cy = cos(u_ry);
        float sy = sin(u_ry);
        vec3 p = a_pos;
        vec3 py = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
        vec3 pr = vec3(py.x, py.y * cx - py.z * sx, py.y * sx + py.z * cx);
        float f = u_camera / max(120.0, u_camera - pr.z);
        vec2 screen = vec2(u_cx + pr.x * f, u_cy - pr.y * f);
        vec2 clip = vec2((screen.x / u_w) * 2.0 - 1.0, 1.0 - (screen.y / u_h) * 2.0);
        gl_Position = vec4(clip, 0.0, 1.0);
        gl_PointSize = max(2.0, a_size * f * u_pointBoost);
        v_color = vec4(a_color.rgb, a_color.a * clamp(f, 0.42, 1.55));
        v_size = a_size;
      }
    `;const fs=`
      precision mediump float;
      uniform int u_isPoint;
      varying vec4 v_color;
      varying float v_size;
      void main(){
        if (u_isPoint == 1) {
          vec2 c = gl_PointCoord * 2.0 - 1.0;
          float r = dot(c, c);
          if (r > 1.0) discard;
          float alpha = smoothstep(1.0, 0.66, r);
          float core = smoothstep(0.72, 0.10, r);
          vec3 col = mix(v_color.rgb, vec3(1.0), core * 0.18);
          gl_FragColor = vec4(col, v_color.a * alpha);
        } else {
          gl_FragColor = v_color;
        }
      }
    `;const prog=gl.createProgram();const shV=lpWebgl3dCompile(gl,gl.VERTEX_SHADER,vs);const shF=lpWebgl3dCompile(gl,gl.FRAGMENT_SHADER,fs);gl.attachShader(prog,shV);gl.attachShader(prog,shF);gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog)||'program link failed');engine.gl=gl;engine.program=prog;engine.attr={pos:gl.getAttribLocation(prog,'a_pos'),color:gl.getAttribLocation(prog,'a_color'),size:gl.getAttribLocation(prog,'a_size'),};engine.uni={rx:gl.getUniformLocation(prog,'u_rx'),ry:gl.getUniformLocation(prog,'u_ry'),cx:gl.getUniformLocation(prog,'u_cx'),cy:gl.getUniformLocation(prog,'u_cy'),w:gl.getUniformLocation(prog,'u_w'),h:gl.getUniformLocation(prog,'u_h'),camera:gl.getUniformLocation(prog,'u_camera'),isPoint:gl.getUniformLocation(prog,'u_isPoint'),pointBoost:gl.getUniformLocation(prog,'u_pointBoost'),};engine.buffers={linePos:gl.createBuffer(),lineCol:gl.createBuffer(),lineSize:gl.createBuffer(),nodePos:gl.createBuffer(),nodeCol:gl.createBuffer(),nodeSize:gl.createBuffer(),};return true;}
function lpWebgl3dRotatePoint(engine,x,y,z){const rx=(Number(engine.rx)||0)*Math.PI/180;const ry=(Number(engine.ry)||0)*Math.PI/180;const cy=Math.cos(ry),sy=Math.sin(ry);const cx=Math.cos(rx),sx=Math.sin(rx);const pyx=x*cy+z*sy;const pyy=y;const pyz=-x*sy+z*cy;return{x:pyx,y:pyy*cx-pyz*sx,z:pyy*sx+pyz*cx};}
function lpWebgl3dProjectBase(engine,node){const W=Number(engine.W)||1;const H=Number(engine.H)||1;const cx=W/2;const cy=H/2;const p=lpWebgl3dRotatePoint(engine,Number(node.x)-cx,cy-Number(node.y),Number(node.z)||0);const cam=Number(engine.camera)||LP_WEBGL3D_CAMERA;const f=cam/Math.max(120,cam-p.z);return{x:cx+p.x*f,y:cy-p.y*f,scale:f,z:p.z};}
function lpWebgl3dProjectWithScreenTransform(engine,point,rollDeg,panX,panY){const W=Number(engine&&engine.W)||1;const H=Number(engine&&engine.H)||1;const cx=W/2;const cy=H/2;const roll=(Number.isFinite(Number(rollDeg))?Number(rollDeg):Number(engine&&engine.roll)||0)*Math.PI/180;const cos=Math.cos(roll);const sin=Math.sin(roll);const dx=(Number(point&&point.x)||0)-cx;const dy=(Number(point&&point.y)||0)-cy;return{x:cx+dx*cos-dy*sin+(Number.isFinite(Number(panX))?Number(panX):Number(engine&&engine.panX)||0),y:cy+dx*sin+dy*cos+(Number.isFinite(Number(panY))?Number(panY):Number(engine&&engine.panY)||0),scale:Number(point&&point.scale)||1,z:Number(point&&point.z)||0};}
function lpWebgl3dProject(engine,node){return lpWebgl3dProjectWithScreenTransform(engine,lpWebgl3dProjectBase(engine,node));}
function lpWebgl3dNodeBaseFromElement(el){if(!el)return{x:0,y:0};if(!Number.isFinite(Number(el.__lpWebglBaseX))||!Number.isFinite(Number(el.__lpWebglBaseY))){el.__lpWebglBaseX=lpWebgl3dParsePx(el.style.left,el.offsetLeft||0);el.__lpWebglBaseY=lpWebgl3dParsePx(el.style.top,el.offsetTop||0);}
return{x:Number(el.__lpWebglBaseX)||0,y:Number(el.__lpWebglBaseY)||0};}
function lpWebgl3dMixAngle(a,b,t){const aa=Number(a)||0;const bb=Number(b)||0;const tt=Math.max(0,Math.min(1,Number(t)||0));return aa+Math.atan2(Math.sin(bb-aa),Math.cos(bb-aa))*tt;}
function lpWebgl3dNodeIsHighlighted(engine,n){try{if(!n||!n.el)return false;if(engine.hoverKey&&n.key===engine.hoverKey)return true;const cl=n.el.classList;return!!(cl&&(cl.contains('lp-focus')||cl.contains('lp-keep')||cl.contains('lp-route-anim-focus')||cl.contains('is-cur')));}catch(_){return false;}}
function lpWebgl3dAnyFocusKey(engine){if(!engine||!Array.isArray(engine.nodes))return'';if(engine.hoverKey)return engine.hoverKey;for(const n of engine.nodes){const cl=n.el&&n.el.classList;if(cl&&(cl.contains('lp-focus')||cl.contains('lp-route-anim-focus')))return n.key;}
return'';}
function lpWebgl3dUploadArray(gl,loc,buffer,data,size,type){gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,type||gl.FLOAT,false,0,0);}
function lpWebgl3dSvgNs(){return"http://www.w3.org/2000/svg";}
function lpWebgl3dHash01(s){let h=2166136261;const str=String(s||"");for(let i=0;i<str.length;i+=1){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}
return(h>>>0)/4294967295;}
function lpWebgl3dEnsureSvgOverlay(engine){if(!engine||!engine.viewport)return null;let svg=engine.viewport.querySelector(':scope > svg.lp-webgl3d-overlay');if(!svg){svg=document.createElementNS(lpWebgl3dSvgNs(),'svg');svg.classList.add('lp-webgl3d-overlay');svg.setAttribute('aria-hidden','true');const canvas=engine.canvas;if(canvas&&canvas.nextSibling)engine.viewport.insertBefore(svg,canvas.nextSibling);else engine.viewport.appendChild(svg);}
const W=Math.max(1,Number(engine.W)||1);const H=Math.max(1,Number(engine.H)||1);svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('width',String(W));svg.setAttribute('height',String(H));svg.style.width=`${W}px`;svg.style.height=`${H}px`;return svg;}
function lpWebgl3dClearSvgOverlay(engine){try{const svg=engine&&engine.viewport&&engine.viewport.querySelector?engine.viewport.querySelector(':scope > svg.lp-webgl3d-overlay'):null;if(svg)svg.innerHTML='';}catch(_){}}
function lpWebgl3dStartRelDash(engine){if(!engine||!engine.viewport||lpMotionReduced())return;if(engine.kind==='local'&&!lpLocalMapAnimationsEnabled(engine.modal))return;if(!Number.isFinite(Number(engine.__relDashT0))){engine.__relDashT0=(performance&&performance.now)?performance.now():Date.now();}
if(engine.__relDashRaf)return;const step=(now0)=>{const now=Number.isFinite(Number(now0))?Number(now0):((performance&&performance.now)?performance.now():Date.now());try{if(!engine||!engine.modal||engine.modal.__lpWebgl3dEngine!==engine||!engine.viewport||!lpWebgl3dEnabled()){if(engine)engine.__relDashRaf=0;return;}}catch(_){if(engine)engine.__relDashRaf=0;return;}
let count=0;try{const paths=engine.viewport.querySelectorAll('svg.lp-webgl3d-overlay path.lp-webgl3d-edge.is-related.lp-rel-anim');const phase=(((now-(Number(engine.__relDashT0)||now))/1200)%1+1)%1;const offset=String(-24*phase);Array.from(paths||[]).forEach((path)=>{if(!path||!path.isConnected)return;count+=1;path.style.strokeDasharray='6 6';path.style.strokeDashoffset=offset;path.style.animation='none';});}catch(_){}
if(!count){engine.__relDashRaf=0;return;}
engine.__relDashRaf=requestAnimationFrame(step);};engine.__relDashRaf=requestAnimationFrame(step);}
function lpWebgl3dCssColor(type,highlighted,alpha,kind){const t=String(type||'').toLowerCase();const a=Math.max(0,Math.min(1,Number(alpha)||0));if(kind==='route')return`rgba(255,255,255,${a})`;if(!highlighted)return'rgb(255,255,255)';if(t==='related')return'rgb(167, 139, 250)';if(t==='dependent'||t==='dep')return'rgb(96, 165, 250)';if(t==='prereq'||t==='pre')return'rgb(16, 185, 129)';return'rgb(255,255,255)';}
function lpWebgl3dMakeArrowMarker(defs,id,color,scale){const ns=lpWebgl3dSvgNs();const marker=document.createElementNS(ns,'marker');const sc=Math.max(0.7,Math.min(1.5,Number(scale)||1));marker.setAttribute('id',id);marker.setAttribute('markerWidth',String(10*sc));marker.setAttribute('markerHeight',String(10*sc));marker.setAttribute('refX',String(9.2*sc));marker.setAttribute('refY',String(3.5*sc));marker.setAttribute('orient','auto');marker.setAttribute('markerUnits','strokeWidth');const path=document.createElementNS(ns,'path');path.setAttribute('d',`M0,0 L${9 * sc},${3.5 * sc} L0,${7 * sc} Z`);path.setAttribute('fill',color);path.setAttribute('fill-opacity','1');path.setAttribute('stroke',color);path.setAttribute('stroke-width',String(0.65*sc));path.setAttribute('stroke-linejoin','round');marker.appendChild(path);defs.appendChild(marker);}
function lpWebgl3dProjectedNodes(engine){const out=new Map();if(!engine||!Array.isArray(engine.nodes))return out;for(const n of engine.nodes){if(!n||!n.el||!n.key)continue;const fallback=lpWebgl3dProject(engine,n);const sx=Number.isFinite(Number(n.el.__lpWebglScreenX))?Number(n.el.__lpWebglScreenX):fallback.x;const sy=Number.isFinite(Number(n.el.__lpWebglScreenY))?Number(n.el.__lpWebglScreenY):fallback.y;const sz=Number.isFinite(Number(n.el.__lpWebglScreenZ))?Number(n.el.__lpWebglScreenZ):fallback.z;const labelScale=Math.max(0.58,Math.min(1.38,Number.isFinite(Number(n.el.__lpWebglScreenScale))?Number(n.el.__lpWebglScreenScale):fallback.scale));let hoverScale=1;let routePulseScale=1;try{const cs=window.getComputedStyle(n.el);const hv=Number(cs.getPropertyValue('--lp-webgl-hover-scale'));if(Number.isFinite(hv)&&hv>0)hoverScale=hv;const pv=Number(cs.getPropertyValue('--lp-route-pulse-scale'));if(Number.isFinite(pv)&&pv>0)routePulseScale=pv;}catch(_){}
const visualScale=Math.max(0.2,Math.min(2.2,hoverScale*routePulseScale));const w=Math.max(52,(Number(n.el.offsetWidth)||120)*labelScale*visualScale);const h=Math.max(24,(Number(n.el.offsetHeight)||36)*labelScale*visualScale);out.set(n.key,{node:n,loc:n.loc,key:n.key,x:sx,y:sy,z:sz,scale:labelScale,visualScale,w,h});}
return out;}
function lpWebgl3dClipPillEdge(a,b,pad){const dx=(Number(b.x)||0)-(Number(a.x)||0);const dy=(Number(b.y)||0)-(Number(a.y)||0);const len=Math.max(1e-6,Math.hypot(dx,dy));const ux=dx/len;const uy=dy/len;const halfW=Math.max(18,(Number(a.w)||80)/2+(Number(pad)||0));const halfH=Math.max(12,(Number(a.h)||32)/2+(Number(pad)||0));const ax=Math.abs(ux);const ay=Math.abs(uy);let reach=Math.min(ax>1e-6?halfW/ax:Infinity,ay>1e-6?halfH/ay:Infinity);if(!Number.isFinite(reach))reach=Math.max(halfW,halfH);reach=Math.max(0,Math.min(len*0.46,reach));return{x:a.x+ux*reach,y:a.y+uy*reach};}
function lpWebgl3dCurvedD(p1,p2,bend){const dx=p2.x-p1.x;const dy=p2.y-p1.y;const len=Math.max(1e-6,Math.hypot(dx,dy));const nx=-dy/len;const ny=dx/len;const b=Number(bend)||0;const c1x=p1.x+dx*0.34+nx*b;const c1y=p1.y+dy*0.34+ny*b;const c2x=p1.x+dx*0.66+nx*(b*0.18);const c2y=p1.y+dy*0.66+ny*(b*0.18);return`M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;}
function lpWebgl3dLocalEdgeType(engine,e,A,B,focusKey){let type=String((e&&e.type)||'prereq').toLowerCase();const related=type==='related';let highlighted=false;if(focusKey&&(A.key===focusKey||B.key===focusKey)){highlighted=true;if(!related){if(B.key===focusKey)type='prereq';else if(A.key===focusKey)type='dependent';}}
const fadedByFocus=!!(focusKey&&!highlighted);const alpha=highlighted?0.96:0.10;return{type,highlighted,related,alpha,fadedByFocus};}
function lpWebgl3dAppendPath(svg,attrs){const ns=lpWebgl3dSvgNs();const p=document.createElementNS(ns,'path');Object.keys(attrs||{}).forEach((k)=>{const v=attrs[k];if(v==null)return;if(k==='class')p.setAttribute('class',v);else if(k==='style')p.setAttribute('style',v);else p.setAttribute(k,String(v));});svg.appendChild(p);return p;}
function lpWebgl3dPointOnPath(path,t){try{const total=path.getTotalLength();const pt=path.getPointAtLength(Math.max(0,Math.min(1,Number(t)||0))*total);const pt2=path.getPointAtLength(Math.max(0,Math.min(1,(Number(t)||0)+0.012))*total);return{x:pt.x,y:pt.y,angle:Math.atan2(pt2.y-pt.y,pt2.x-pt.x)*180/Math.PI};}catch(_){return null;}}
function lpWebgl3dAppendFlowArrow(svg,path,color,t,opacity){const pt=lpWebgl3dPointOnPath(path,t);if(!pt)return;const ns=lpWebgl3dSvgNs();const arrow=document.createElementNS(ns,'path');arrow.classList.add('lp-webgl3d-flow-arrow');arrow.setAttribute('d','M0 0 L11 4.8 L0 9.6 Z');arrow.setAttribute('fill',color);arrow.setAttribute('stroke',color);arrow.setAttribute('stroke-width','0.6');arrow.setAttribute('opacity',String(Math.max(0,Math.min(1,Number(opacity)||0))));arrow.setAttribute('transform',`translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)}) rotate(${pt.angle.toFixed(2)}) translate(-5.5 -4.8)`);svg.appendChild(arrow);}
function lpWebgl3dUpdateLabels(engine){if(!engine||!Array.isArray(engine.nodes))return;const focusKey=lpWebgl3dAnyFocusKey(engine);const projected=[];for(const n of engine.nodes){if(!n||!n.el)continue;const p=lpWebgl3dProject(engine,n);projected.push({n,p});}
projected.sort((a,b)=>a.p.z-b.p.z);projected.forEach((item,idx)=>{const n=item.n;const p=item.p;const el=n.el;const scale=Math.max(0.58,Math.min(1.38,p.scale));const isHi=lpWebgl3dNodeIsHighlighted(engine,n);let isRouteNode=false;let isDimClass=false;try{const cl=el.classList;isRouteNode=!!(engine.kind==='route'&&cl&&(cl.contains('is-route')||cl.contains('is-start')||cl.contains('is-target')||cl.contains('is-cur')));isDimClass=!!(cl&&(cl.contains('lp-dim')||cl.contains('is-filter-faded')));}catch(_){}
try{el.__lpWebglScreenX=p.x;el.__lpWebglScreenY=p.y;el.__lpWebglScreenZ=p.z;el.__lpWebglScreenScale=scale;el.style.left=`${Math.round(p.x)}px`;el.style.top=`${Math.round(p.y)}px`;el.style.setProperty('--lp-webgl-label-scale',String(scale));el.style.zIndex=String(80+idx+(isHi?900:(isRouteNode?140:0)));const backFade=p.z<-360?0.46:(p.z<-210?0.62:1);if(engine.kind==='route'&&focusKey){if(isHi)el.style.opacity='1';else if(isRouteNode)el.style.opacity=String(Math.max(0.72,Math.min(0.94,backFade*0.86)));else el.style.opacity=isDimClass?'0.055':'0.10';}else if(focusKey&&!isHi){el.style.opacity='0.30';}else{el.style.opacity=String(Math.max(0.30,Math.min(1,backFade)));}}catch(_){}});}
function lpWheelDeltaYPixels(e){let dy=Number(e&&e.deltaY)||0;try{const mode=Number(e&&e.deltaMode)||0;if(mode===1)dy*=16;else if(mode===2)dy*=Math.max(1,Number(window.innerHeight)||800);}catch(_){}
return dy;}
function lpIsTrackpadPinchWheel(e){try{return!!(e&&e.ctrlKey&&(Number(e.deltaMode)||0)===0);}catch(_){return false;}}
function lpWheelZoomDecision(e,bucket){const dy=lpWheelDeltaYPixels(e);if(!Number.isFinite(dy)||Math.abs(dy)<1e-6)return{zoom:false,factor:1};if(!lpIsTrackpadPinchWheel(e)){return{zoom:true,factor:dy>0?0.9:1.1,trackpadPinch:false};}
const state=bucket&&typeof bucket==="object"?bucket:{};const s=state.__lpTrackpadPinchWheel||(state.__lpTrackpadPinchWheel={});const now=(typeof performance!=="undefined"&&performance.now)?performance.now():Date.now();const abs=Math.abs(dy);const sign=dy>0?1:-1;const prevAbs=Math.max(0,Number(s.lastAbs)||0);const gap=now-(Number(s.lastTime)||0);let ignore=false;const reset=!s.sign||s.sign!==sign||gap>220;if(reset){s.sign=sign;s.peakAbs=abs;s.peakTime=now;s.decelCount=0;s.tailMode=false;}else{const peak=Math.max(abs,Number(s.peakAbs)||abs);const renewedGesture=abs>Math.max(prevAbs*1.42,peak*0.72,4.0);if(renewedGesture){s.peakAbs=abs;s.peakTime=now;s.decelCount=0;s.tailMode=false;}else{if(prevAbs>0&&abs<prevAbs*0.86)s.decelCount=(Number(s.decelCount)||0)+1;else if(prevAbs>0&&abs>prevAbs*1.08)s.decelCount=Math.max(0,(Number(s.decelCount)||0)-1);const livePeak=Math.max(abs,Number(s.peakAbs)||abs);const sincePeak=now-(Number(s.peakTime)||now);const decelTail=(Number(s.decelCount)||0)>=3&&sincePeak>50&&abs<livePeak*0.70;const smallTail=(Number(s.decelCount)||0)>=2&&sincePeak>95&&abs<Math.max(2.2,livePeak*0.55);const tinyTail=sincePeak>45&&abs<0.60;if(s.tailMode&&!renewedGesture)ignore=true;if(decelTail||smallTail||tinyTail){s.tailMode=true;ignore=true;}}}
s.lastAbs=abs;s.lastTime=now;s.sign=sign;if(ignore)return{zoom:false,factor:1,trackpadPinch:true,inertialTail:true};const rawFactor=Math.exp(-dy*0.0060);const factor=Math.max(0.94,Math.min(1.064,rawFactor));return{zoom:factor!==1,factor,trackpadPinch:true,inertialTail:false};}
function lpMotionReduced(){try{if(window.MkSiteMotion&&typeof window.MkSiteMotion.isReduced==="function"){return!!window.MkSiteMotion.isReduced();}}catch(_){}
try{return!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);}catch(_){}
return false;}
function lpGuestAccess(){try{return(window.MkGuestAccess&&typeof window.MkGuestAccess.consume==="function")?window.MkGuestAccess:null;}catch(_){return null;}}
function lpConsumeGuestAction(action,detail){const guard=lpGuestAccess();if(!guard)return true;try{return guard.consume(action,Object.assign({blocking:true},detail||{}));}catch(_){return true;}}
function lpAnyMapModalOpen(){try{const local=document.getElementById("lp-map-modal");const route=document.getElementById("lp-h1sg-modal");return!!((local&&local.classList&&local.classList.contains("lp-open"))||(route&&route.classList&&route.classList.contains("lp-open")));}catch(_){return false;}}
function lpStripTitleUiArtifacts(root){if(!root||!root.querySelectorAll)return;try{Array.from(root.querySelectorAll([".headerlink",".mw-title-badge",".mw-h1-manage","script:not([type^=\"math/tex\"]):not([type^=\"math/asciimath\"])","style","noscript","button"].join(","))).forEach((node)=>{try{node.remove();}catch(_){}});}catch(_){}}
function lpExtractRenderableTitleHtmlFromHeading(h1){if(!h1)return"";try{const clone=h1.cloneNode(true);lpStripTitleUiArtifacts(clone);const preferred=clone.querySelector&&(clone.querySelector(".mw-h1-title-text"));const host=preferred||clone;lpStripTitleUiArtifacts(host);const html=String((host&&host.innerHTML)||"").trim();return html;}catch(_){return"";}}
function lpMasterySvg(name,size){const s=Number(size||18)||18;if(name==="shield-check-outline"){return`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 1l9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l9-4m0 2.18L5 6v5c0 4.73 3.2 8.94 7 10 3.8-1.06 7-5.27 7-10V6l-7-2.82M10.59 15.59L7.5 12.5l1.41-1.41 1.68 1.68 4.5-4.5 1.41 1.41-5.91 5.91z"/></svg>`;}
if(name==="check-circle-outline"){return`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m-1-5l6-6-1.41-1.41L11 12.17 8.41 9.59 7 11l4 4z"/></svg>`;}
if(name==="help-circle-outline"){return`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m-1-3h2v2h-2v-2m1-13c2.21 0 4 1.79 4 4 0 1.7-1.06 3.15-2.56 3.73-.5.19-.44.36-.44 1.27h-2v-.5c0-.83.04-1.51.93-1.87 1.07-.43 2.07-1.14 2.07-2.63 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4z"/></svg>`;}
if(name==="close-circle-outline"){return`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m3.59-10.59L13.41 12l2.18 2.18-1.41 1.41L12 13.41l-2.18 2.18-1.41-1.41L10.59 12 8.41 9.82l1.41-1.41L12 10.59l2.18-2.18 1.41 1.41z"/></svg>`;}
if(name==="eye-outline"){return`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 9A3 3 0 0 0 9 12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5m0 13C8.24 17.5 4.83 15.36 3.18 12 4.83 8.64 8.24 6.5 12 6.5s7.17 2.14 8.82 5.5c-1.65 3.36-5.06 5.5-8.82 5.5z"/></svg>`;}
if(name==="eye-off-outline"){return`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M2 5.27 4.28 3 21 19.72 19.73 21l-3.08-3.08C15.23 18.62 13.65 19 12 19c-5 0-9.27-3.11-11-7 0 0 1.73-3.9 5.6-6.33L2 5.27M3.18 12C4.83 15.36 8.24 17.5 12 17.5c1.05 0 2.07-.14 3.03-.4l-1.75-1.75c-.41.1-.84.15-1.28.15A3.5 3.5 0 0 1 8.5 12c0-.44.05-.87.15-1.28L5.6 7.67A11.8 11.8 0 0 0 3.18 12M12 5c5 0 9.27 3.11 11 7a12.3 12.3 0 0 1-2.27 3.43L19.3 14c.63-.57 1.15-1.25 1.52-2C19.17 8.64 15.76 6.5 12 6.5c-1.27 0-2.5.22-3.64.62L6.81 5.57C8.39 5.2 10.13 5 12 5m0 4a3 3 0 0 1 3 3c0 .35-.06.69-.17 1L11 9.17c.31-.11.65-.17 1-.17z"/></svg>`;}
return"";}
function lpMasteryIcon(m){if(m===3)return lpMasterySvg("shield-check-outline",18);if(m===2)return lpMasterySvg("check-circle-outline",18);if(m===1)return lpMasterySvg("help-circle-outline",18);if(m===0)return lpMasterySvg("close-circle-outline",18);return"";}
function lpMasteryLevelLabel(m){if(m===3)return"Mastered";if(m===2)return"Clear";if(m===1)return"Unclear";if(m===0)return"Unknown";return"Not rated";}
function lpHasExplicitMastery(rec,fallbackM){const m=(rec&&typeof rec.m==="number")?rec.m:(typeof fallbackM==="number"?fallbackM:null);return m===0||m===1||m===2||m===3;}
function lpMaskUnknownTitle(title){return Array.from(String(title||"")).map((ch)=>(/\s/.test(ch)?ch:"?")).join("");}
function lpShuffleInPlace(arr){const a=Array.isArray(arr)?arr:[];for(let i=a.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));const tmp=a[i];a[i]=a[j];a[j]=tmp;}
return a;}
function lpEnsureRevealSession(){try{const cur=window.__lpMapRevealSession;if(cur&&cur.states instanceof Map)return cur;}catch(_){}
const next={id:`${Date.now()}|${Math.random()}`,states:new Map()};try{window.__lpMapRevealSession=next;}catch(_){}
return next;}
function lpResetRevealSession(){try{const cur=window.__lpMapRevealSession;if(cur&&cur.states instanceof Map){for(const st of cur.states.values())lpRevealStopTimer(st);}}catch(_){}
const next={id:`${Date.now()}|${Math.random()}`,states:new Map()};try{window.__lpMapRevealSession=next;}catch(_){}
return next;}
function lpSharedRevealSet(){try{const cur=window.__lpSharedMapRevealSet;if(cur instanceof Set)return cur;}catch(_){}
const next=new Set();try{window.__lpSharedMapRevealSet=next;}catch(_){}
return next;}
function lpSplitRevealTitle(title){const src=String(title||"");if(!src)return[];const re=/(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g;const parts=[];let last=0;let m;while((m=re.exec(src))){if(m.index>last)parts.push({type:"text",text:src.slice(last,m.index)});parts.push({type:"math",text:m[0]});last=m.index+m[0].length;}
if(last<src.length)parts.push({type:"text",text:src.slice(last)});return parts;}
function lpBuildRevealUnits(parts){const units=[];for(let pIdx=0;pIdx<parts.length;pIdx++){const part=parts[pIdx];if(!part)continue;if(part.type==="math"){units.push({type:"math",pIdx});continue;}
const chars=Array.from(String(part.text||""));for(let cIdx=0;cIdx<chars.length;cIdx++){const ch=chars[cIdx];if(/\s/.test(ch))continue;units.push({type:"char",pIdx,cIdx});}}
return units;}
function lpRevealTextForState(st){if(!st)return"";const parts=Array.isArray(st.parts)?st.parts:[];const units=Array.isArray(st.units)?st.units:[];const revealed=st.revealed instanceof Set?st.revealed:new Set();const unitMap=new Map();for(let i=0;i<units.length;i++){const u=units[i];if(!u)continue;if(u.type==="math")unitMap.set(`m:${u.pIdx}`,i);else unitMap.set(`c:${u.pIdx}:${u.cIdx}`,i);}
let out="";for(let pIdx=0;pIdx<parts.length;pIdx++){const part=parts[pIdx];if(!part)continue;if(part.type==="math"){const uIdx=unitMap.get(`m:${pIdx}`);out+=(uIdx!==undefined&&revealed.has(uIdx))?String(part.text||""):"?";continue;}
const chars=Array.from(String(part.text||""));for(let cIdx=0;cIdx<chars.length;cIdx++){const ch=chars[cIdx];if(/\s/.test(ch)){out+=ch;continue;}
const uIdx=unitMap.get(`c:${pIdx}:${cIdx}`);out+=(uIdx!==undefined&&revealed.has(uIdx))?ch:"?";}}
return out;}
function lpRevealProgressForState(st){if(!st)return 0;const total=Math.max(1,Array.isArray(st.units)?st.units.length:0);const done=st.revealed instanceof Set?st.revealed.size:0;return Math.max(0,Math.min(1,done/total));}
function lpRevealIsComplete(st){if(!st)return false;const total=Array.isArray(st.units)?st.units.length:0;const done=st.revealed instanceof Set?st.revealed.size:0;return done>=total;}
function lpRevealAdvanceOne(st){if(!st||!(st.revealed instanceof Set))return false;const order=Array.isArray(st.order)?st.order:[];for(const idx of order){if(!st.revealed.has(idx)){st.revealed.add(idx);return true;}}
return false;}
function lpRevealStopTimer(st){if(!st)return;try{if(st.timerId)window.clearTimeout(st.timerId);}catch(_){}
try{if(st.navTimerId)window.clearTimeout(st.navTimerId);}catch(_){}
st.timerId=0;st.navTimerId=0;st.running=false;st.navigateOnDone=false;}
function lpShouldMaskNode(visual){const v=visual&&typeof visual==="object"?visual:null;if(!v)return false;return v.key==="unvisited"||v.fog===true||v.hideTitle===true;}
function lpEnsureMapRedesignPatchStyles(){if(document.getElementById("lp-redesign-patch-style-v3"))return;const st=document.createElement("style");st.id="lp-redesign-patch-style-v3";st.textContent=`
      #lp-map-modal .lp-fog-layer{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:15;
        opacity:.56;
        mix-blend-mode:screen;
        filter: blur(14px) saturate(1.01);
        -webkit-filter: blur(14px) saturate(1.01);
      }
      #lp-map-modal a.lp-node.lp-extra{ z-index: 30; }
      #lp-map-modal a.lp-node.lp-extra.lp-focus{ z-index: 40; }
      #lp-map-modal a.lp-node .lp-node-label{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:.42rem;
      }
      #lp-map-modal a.lp-node .lp-node-prefix{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        flex:0 0 auto;
        width:1.02em;
        height:1.02em;
      }
      #lp-map-modal a.lp-node .lp-node-prefix svg{
        width:1.02em;
        height:1.02em;
        display:block;
      }
      #lp-map-modal a.lp-node .lp-node-title{
        min-width:0;
        display:inline-block;
      }
      #lp-map-modal{
        /* LP_MAP_MODAL_Z. All four maps share one layer: above the page and the
           quiz/self-check modals, below the celebration and level-up overlays
           that are meant to play over a map. The old 2147483300 tied with
           #aiq-modal, so whichever was appended to <body> first ended up
           underneath — that is how a quiz could open behind an open map. */
        z-index:2147483400 !important;
      }
      html.lp-modal-open #mw-mastery,
      html.lp-modal-open #mw-mastery *,
      html.lp-modal-open #mw-mastery-compact,
      html.lp-modal-open #mw-mastery-compact *,
      html.lp-modal-open .mw-fly-layer,
      html.lp-modal-open .mw-fly-layer *,
      html.lp-modal-open .mw-title-menu,
      html.lp-modal-open .mw-title-menu *,
      body.lp-modal-open #mw-mastery,
      body.lp-modal-open #mw-mastery *,
      body.lp-modal-open #mw-mastery-compact,
      body.lp-modal-open #mw-mastery-compact *,
      body.lp-modal-open .mw-fly-layer,
      body.lp-modal-open .mw-fly-layer *,
      body.lp-modal-open .mw-title-menu,
      body.lp-modal-open .mw-title-menu *{
        pointer-events:none !important;
      }
      #lp-map-modal a.lp-node .lp-node-label[data-lp-has-mastery-icon="1"] .lp-node-title{
        line-height:1;
        transform: translateY(.055em);
      }
      #lp-map-modal a.lp-node .lp-lite-math,
      #lp-h1sg-modal .lp-node .lp-lite-math{
        display:inline-block;
        font-family: KaTeX_Math, "Times New Roman", serif;
        font-style: italic;
        font-weight: 500;
        line-height: 1;
        white-space: nowrap;
      }
      #lp-map-modal a.lp-node .lp-node-title .katex,
      #lp-h1sg-modal .lp-node .lp-node-title .katex{
        display:inline-block !important;
        vertical-align:baseline !important;
        font-size:1em !important;
        line-height:1 !important;
        max-width:none !important;
        overflow:visible !important;
        color:currentColor !important;
      }
      #lp-map-modal a.lp-node .lp-node-title .katex-html,
      #lp-h1sg-modal .lp-node .lp-node-title .katex-html{
        overflow:visible !important;
      }
      #lp-map-modal a.lp-node .lp-node-title .katex .base,
      #lp-h1sg-modal .lp-node .lp-node-title .katex .base{
        white-space:nowrap !important;
      }
      #lp-map-modal{
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
      html[data-md-color-scheme="default"] #lp-map-modal,
      body[data-md-color-scheme="default"] #lp-map-modal{
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
      html[data-md-color-scheme="slate"] #lp-map-modal,
      body[data-md-color-scheme="slate"] #lp-map-modal{
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
      #lp-map-modal a.lp-node.is-cur{
        padding:.58rem .92rem;
        font-size:1.22em;
        font-weight:820;
      }
      #lp-map-modal a.lp-node.lp-node-mastered::after,
#lp-map-modal a.lp-node[data-lp-visual="mastered"]::after{
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

#lp-map-modal a.lp-node[data-lp-visual="know"]::after{
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
  #lp-map-modal a.lp-node.lp-node-mastered .lp-node-prefix,
#lp-map-modal a.lp-node[data-lp-visual="mastered"] .lp-node-prefix,
#lp-map-modal a.lp-node.lp-node-mastered:hover .lp-node-prefix,
#lp-map-modal a.lp-node.lp-node-mastered.lp-focus .lp-node-prefix,
#lp-map-modal a.lp-node.lp-node-mastered.lp-keep .lp-node-prefix,
#lp-map-modal a.lp-node[data-lp-visual="mastered"]:hover .lp-node-prefix,
#lp-map-modal a.lp-node[data-lp-visual="mastered"].lp-focus .lp-node-prefix,
#lp-map-modal a.lp-node[data-lp-visual="mastered"].lp-keep .lp-node-prefix{
  color: var(--lp-master-gold-border) !important;
  filter:
    drop-shadow(0 0 4px rgba(246, 207, 90, .34))
    drop-shadow(0 0 10px rgba(246, 207, 90, .22));
}

#lp-map-modal a.lp-node[data-lp-visual="know"] .lp-node-prefix,
#lp-map-modal a.lp-node[data-lp-visual="know"]:hover .lp-node-prefix,
#lp-map-modal a.lp-node[data-lp-visual="know"].lp-focus .lp-node-prefix,
#lp-map-modal a.lp-node[data-lp-visual="know"].lp-keep .lp-node-prefix{
  color: var(--lp-know-silver-border) !important;
  filter:
    drop-shadow(0 0 3px rgba(220, 229, 242, .24))
    drop-shadow(0 0 8px rgba(220, 229, 242, .16));
}
#lp-map-modal a.lp-node.lp-node-mastered .lp-node-title,
#lp-map-modal a.lp-node[data-lp-visual="mastered"] .lp-node-title,
#lp-map-modal a.lp-node.lp-node-mastered:hover .lp-node-title,
#lp-map-modal a.lp-node.lp-node-mastered.lp-focus .lp-node-title,
#lp-map-modal a.lp-node.lp-node-mastered.lp-keep .lp-node-title,
#lp-map-modal a.lp-node[data-lp-visual="mastered"]:hover .lp-node-title,
#lp-map-modal a.lp-node[data-lp-visual="mastered"].lp-focus .lp-node-title,
#lp-map-modal a.lp-node[data-lp-visual="mastered"].lp-keep .lp-node-title,
#lp-map-modal a.lp-node.lp-node-mastered .lp-node-title *,
#lp-map-modal a.lp-node[data-lp-visual="mastered"] .lp-node-title *,
#lp-map-modal a.lp-node.lp-node-mastered:hover .lp-node-title *,
#lp-map-modal a.lp-node.lp-node-mastered.lp-focus .lp-node-title *,
#lp-map-modal a.lp-node.lp-node-mastered.lp-keep .lp-node-title *,
#lp-map-modal a.lp-node[data-lp-visual="mastered"]:hover .lp-node-title *,
#lp-map-modal a.lp-node[data-lp-visual="mastered"].lp-focus .lp-node-title *,
#lp-map-modal a.lp-node[data-lp-visual="mastered"].lp-keep .lp-node-title *{
  color: var(--lp-master-gold-border) !important;
}
#lp-map-modal a.lp-node[data-lp-visual="know"] .lp-node-title,
#lp-map-modal a.lp-node[data-lp-visual="know"]:hover .lp-node-title,
#lp-map-modal a.lp-node[data-lp-visual="know"].lp-focus .lp-node-title,
#lp-map-modal a.lp-node[data-lp-visual="know"].lp-keep .lp-node-title,
#lp-map-modal a.lp-node[data-lp-visual="know"] .lp-node-title *,
#lp-map-modal a.lp-node[data-lp-visual="know"]:hover .lp-node-title *,
#lp-map-modal a.lp-node[data-lp-visual="know"].lp-focus .lp-node-title *,
#lp-map-modal a.lp-node[data-lp-visual="know"].lp-keep .lp-node-title *{
  color: var(--lp-know-silver-border) !important;
}
#lp-map-modal a.lp-node.is-cur::after{
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
#lp-map-modal a.lp-node.is-cur .lp-node-title,
#lp-map-modal a.lp-node.is-cur .lp-node-title *{
  color: rgba(255,255,255,.98) !important;
}
#lp-map-modal a.lp-node.is-cur .lp-node-prefix{
  color: rgba(191, 219, 254, .96) !important;
  filter:
    drop-shadow(0 0 4px rgba(96, 165, 250, .28))
    drop-shadow(0 0 10px rgba(59, 130, 246, .18));
}
#lp-map-modal a.lp-node.is-cur[data-lp-visual="mastered"] .lp-node-title,
#lp-map-modal a.lp-node.is-cur[data-lp-visual="mastered"] .lp-node-title *,
#lp-map-modal a.lp-node.is-cur.lp-node-mastered .lp-node-title,
#lp-map-modal a.lp-node.is-cur.lp-node-mastered .lp-node-title *{
  color: var(--lp-master-gold-border) !important;
}
#lp-map-modal a.lp-node.is-cur[data-lp-visual="know"] .lp-node-title,
#lp-map-modal a.lp-node.is-cur[data-lp-visual="know"] .lp-node-title *{
  color: var(--lp-know-silver-border) !important;
}
#lp-map-modal a.lp-node.is-cur[data-lp-visual="mastered"] .lp-node-prefix,
#lp-map-modal a.lp-node.is-cur.lp-node-mastered .lp-node-prefix{
  color: var(--lp-master-gold-border) !important;
  filter:
    drop-shadow(0 0 4px rgba(246, 207, 90, .34))
    drop-shadow(0 0 10px rgba(246, 207, 90, .22));
}
#lp-map-modal a.lp-node.is-cur[data-lp-visual="know"] .lp-node-prefix{
  color: var(--lp-know-silver-border) !important;
  filter:
    drop-shadow(0 0 3px rgba(220, 229, 242, .24))
    drop-shadow(0 0 8px rgba(220, 229, 242, .16));
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
      #lp-map-modal a.lp-node[data-lp-visual="unvisited"] .lp-node-label{
        letter-spacing:.08em;
      }
      #lp-map-modal a.lp-node.lp-revealing{
        transition: filter 120ms linear !important;
      }
    `;document.head.appendChild(st);}
function lpEnsureAuxMapPatchStyles(){if(document.getElementById('lp-aux-map-patch-style-v2'))return;const st=document.createElement('style');st.id='lp-aux-map-patch-style-v2';st.textContent=`
article.md-content__inner h1 mjx-container,
article.md-content__inner h1 .MathJax,
article.md-content__inner h1 .katex,
#lp-side-panel .lp-name mjx-container,
#lp-side-panel .lp-name .MathJax,
#lp-side-panel .lp-name .katex,
#lp-map-modal .lp-node-title mjx-container,
#lp-map-modal .lp-node-title .MathJax,
#lp-map-modal .lp-node-title .katex,
#lp-h1sg-modal .lp-node-title mjx-container,
#lp-h1sg-modal .lp-node-title .MathJax,
#lp-h1sg-modal .lp-node-title .katex,
article.md-content__inner .lp-h1-route-target-text mjx-container,
article.md-content__inner .lp-h1-route-target-text .MathJax,
article.md-content__inner .lp-h1-route-target-text .katex{
  display:inline-block !important;
  vertical-align:baseline !important;
  max-width:100%;
  margin-right:.14em !important;
}
article.md-content__inner h1 mjx-container:not(:first-child),
article.md-content__inner h1 .MathJax:not(:first-child),
article.md-content__inner h1 .katex:not(:first-child),
#lp-side-panel .lp-name mjx-container:not(:first-child),
#lp-side-panel .lp-name .MathJax:not(:first-child),
#lp-side-panel .lp-name .katex:not(:first-child),
#lp-map-modal .lp-node-title mjx-container:not(:first-child),
#lp-map-modal .lp-node-title .MathJax:not(:first-child),
#lp-map-modal .lp-node-title .katex:not(:first-child),
#lp-h1sg-modal .lp-node-title mjx-container:not(:first-child),
#lp-h1sg-modal .lp-node-title .MathJax:not(:first-child),
#lp-h1sg-modal .lp-node-title .katex:not(:first-child),
article.md-content__inner .lp-h1-route-target-text mjx-container:not(:first-child),
article.md-content__inner .lp-h1-route-target-text .MathJax:not(:first-child),
article.md-content__inner .lp-h1-route-target-text .katex:not(:first-child){
  margin-left:.08em !important;
}
#lp-h1sg-modal .lp-h1sg-topbar-row{
  width:100% !important;
  max-width:none !important;
}
#lp-map-modal .lp-mapstage,
#lp-map-modal .lp-mbody,
#lp-map-modal .lp-mapviewport{
  background:transparent !important;
}
#lp-map-modal input.lp-zoomrange,
#lp-h1sg-modal input.lp-zoomrange{
  --lp-zoom-fill: rgb(255, 42, 35);
  --lp-zoom-track: rgba(255,255,255,.20);
  --lp-zoom-active-pct: 41.1765%;
  -webkit-appearance:none !important;
  appearance:none !important;
  background:transparent !important;
  border:none !important;
  box-shadow:none !important;
  outline:none !important;
  padding:0 !important;
  border-radius:999px !important;
}
html[data-md-color-scheme="default"] #lp-map-modal input.lp-zoomrange,
body[data-md-color-scheme="default"] #lp-map-modal input.lp-zoomrange,
html[data-md-color-scheme="default"] #lp-h1sg-modal input.lp-zoomrange,
body[data-md-color-scheme="default"] #lp-h1sg-modal input.lp-zoomrange{
  --lp-zoom-track: rgba(15,23,42,.20);
}
#lp-map-modal input.lp-zoomrange::-webkit-slider-runnable-track,
#lp-h1sg-modal input.lp-zoomrange::-webkit-slider-runnable-track{
  background:linear-gradient(90deg, var(--lp-zoom-fill) 0%, var(--lp-zoom-fill) var(--lp-zoom-active-pct), var(--lp-zoom-track) var(--lp-zoom-active-pct), var(--lp-zoom-track) 100%) !important;
}
#lp-map-modal input.lp-zoomrange::-moz-range-track,
#lp-h1sg-modal input.lp-zoomrange::-moz-range-track{
  background:linear-gradient(90deg, var(--lp-zoom-fill) 0%, var(--lp-zoom-fill) var(--lp-zoom-active-pct), var(--lp-zoom-track) var(--lp-zoom-active-pct), var(--lp-zoom-track) 100%) !important;
}
@media (max-width: 900px){
  #lp-map-modal .lp-mzoom,
  #lp-h1sg-modal .lp-mzoom{
    bottom:calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
    width:calc(100% - 20px) !important;
    max-width:none !important;
  }
  #lp-h1sg-modal .lp-h1sg-helper{
    font-size:.74rem !important;
    line-height:1.18 !important;
    padding:10px 14px !important;
  }
}
@media (max-width: 720px){
  #lp-map-modal .lp-map-helper{
    width:calc(100% - 84px) !important;
    max-width:none !important;
    font-size:.76rem !important;
    line-height:1.16 !important;
    padding:10px 14px !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function lpUpdateZoomRangeVisual(rangeEl,valuePct,minPct,maxPct,displayPct){try{if(!rangeEl)return;const min=Number.isFinite(Number(minPct))?Number(minPct):Number(rangeEl.min||30)||30;const max=Number.isFinite(Number(maxPct))?Number(maxPct):Number(rangeEl.max||200)||200;const raw=Number.isFinite(Number(valuePct))?Number(valuePct):Number(rangeEl.value||min)||min;const displayed=displayPct!==undefined&&Number.isFinite(Number(displayPct))?Number(displayPct):raw;const valueText=`${Math.round(displayed)}%`;if(rangeEl.getAttribute('aria-valuetext')!==valueText)rangeEl.setAttribute('aria-valuetext',valueText);const clamped=Math.max(min,Math.min(max,raw));const pct=((clamped-min)/Math.max(1,max-min))*100;const pctText=`${pct}%`;rangeEl.style.setProperty('--lp-zoom-active-pct',pctText);const bg=`linear-gradient(90deg, var(--lp-zoom-fill, rgb(255, 42, 35)) 0%, var(--lp-zoom-fill, rgb(255, 42, 35)) ${pctText}, var(--lp-zoom-track, rgba(255,255,255,.20)) ${pctText}, var(--lp-zoom-track, rgba(255,255,255,.20)) 100%)`;rangeEl.style.setProperty('background',`${bg} center / 100% 8px no-repeat`,'important');rangeEl.style.setProperty('background-image',bg,'important');rangeEl.style.setProperty('background-position','center','important');rangeEl.style.setProperty('background-size','100% 8px','important');rangeEl.style.setProperty('background-repeat','no-repeat','important');}catch(_){}}
function lpHasMathMarkup(raw){const s=String(raw||"");if(!s)return false;return/\$\$[\s\S]+?\$\$/.test(s)||/(^|[^\\])\$[^$\n]+\$/.test(s)||/\\\([\s\S]+?\\\)/.test(s)||/\\\[[\s\S]+?\\\]/.test(s)||/<(?:mjx-container|math)\b|class=["\'][^"\']*katex/i.test(s);}
function lpEnsureMathDelimiters(raw,display){const s=String(raw||"").trim();if(!s)return"";if(/^\$\$[\s\S]*\$\$$/.test(s)||/^\$[^$\n]+\$$/.test(s)||/^\\\([\s\S]*\\\)$/.test(s)||/^\\\[[\s\S]*\\\]$/.test(s))return s;return display?`\\[${s}\\]`:`\\(${s}\\)`;}
function lpExtractMathTexFromNode(node){try{if(!node)return"";const scriptMath=node.querySelectorAll?Array.from(node.querySelectorAll('script[type^="math/tex"], script[type^="math/asciimath"]')):[];if(scriptMath.length){const body=scriptMath.map((el)=>String(el.textContent||'').trim()).filter(Boolean).join(' ');if(body){const typ=String((scriptMath[0]&&scriptMath[0].getAttribute&&scriptMath[0].getAttribute('type'))||'').toLowerCase();return lpEnsureMathDelimiters(body,typ.indexOf('mode=display')>=0);}}
const rawAttr=node.getAttribute&&(node.getAttribute('data-tex')||node.getAttribute('data-latex')||node.getAttribute('data-math')||node.getAttribute('alttext'));if(rawAttr)return lpEnsureMathDelimiters(rawAttr,false);const texAnn=node.querySelector&&node.querySelector('annotation[encoding="application/x-tex"], annotation');if(texAnn&&String(texAnn.textContent||'').trim())return lpEnsureMathDelimiters(texAnn.textContent,false);const txt=String(node.textContent||'').trim();if(lpHasMathMarkup(txt))return txt;return"";}catch(_){return"";}}
function lpNodeTitleNeedsTypeset(titleEl){if(!titleEl)return false;try{if(titleEl.getAttribute&&titleEl.getAttribute("data-lp-skip-typeset")==="1")return false;}catch(_){}
try{const html=String(titleEl.innerHTML||"");if(/<(?:mjx-container|math)\b|class=["\'][^"\']*katex/i.test(html))return false;if(lpHasMathMarkup(html))return true;}catch(_){}
try{if(lpHasMathMarkup(titleEl.getAttribute&&titleEl.getAttribute("data-lp-raw-title")))return true;}catch(_){}
try{if(lpHasMathMarkup(titleEl.textContent||""))return true;}catch(_){}
return false;}
function lpSetNodeTitleMathPending(nodeEl,pending){try{const titleEl=nodeEl&&nodeEl.querySelector?nodeEl.querySelector('.lp-node-title'):null;if(!titleEl)return;if(pending){try{nodeEl.dataset.lpMathPending='1';}catch(_){}
titleEl.style.visibility='hidden';}else{try{delete nodeEl.dataset.lpMathPending;}catch(_){}
titleEl.style.removeProperty('visibility');}}catch(_){}}
function lpGpsClearRouteState(){try{sessionStorage.removeItem(LP_GPS_ROUTE_KEY);}catch(_){}
try{sessionStorage.removeItem(LP_GPS_ROUTE_TICKET_KEY);}catch(_){}}
function lpGpsNavigationType(){try{const navs=(performance&&typeof performance.getEntriesByType==='function')?performance.getEntriesByType('navigation'):[];const nav=Array.isArray(navs)&&navs.length?navs[0]:null;const kind=String(nav&&nav.type||'').toLowerCase();if(kind)return kind;}catch(_){}
try{if(performance&&performance.navigation){const legacy=Number(performance.navigation.type);if(legacy==1)return'reload';if(legacy==2)return'back_forward';}}catch(_){}
return'navigate';}
const LP_RELATED_KEYS=["relatedOf","related","relations","relatedConcepts","related_concepts","seeAlso","see_also","seealso","similar","similarTo","similar_to","rel"];function lpGpsLectureMapSync(){try{const map=window.__lpSearchIndexLectureMap;if(map instanceof Map)return map;}catch(_){}
return null;}
function lpGpsWeightedChoice(candidates){const arr=Array.isArray(candidates)?candidates.filter(Boolean):[];if(!arr.length)return null;let total=0;for(const item of arr)total+=Math.max(0.001,Number(item.weight)||0.001);let pick=Math.random()*total;for(const item of arr){pick-=Math.max(0.001,Number(item.weight)||0.001);if(pick<=0)return item;}
return arr[arr.length-1]||null;}
function lpGpsEstimateLength(stepCount){const n=Math.max(0,Number(stepCount)||0);if(n<=1)return"Start here";if(n<=3)return"Short";if(n<=6)return"Medium";return"Long";}
function lpGpsNeedsWork(meta){return!meta||meta.m==null||meta.m===0||meta.m===1;}
function lpGpsModeLabel(){return"guided study";}
function lpGpsModeCopy(){return"Follow the line from top to bottom. Each step prepares the one below it.";}
function lpMapButtonSvg(){return`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M15 6l-6 2-6-2v14l6 2 6-2 6 2V8z"></path>
        <path d="M9 8v14"></path>
        <path d="M15 6v14"></path>
      </svg>
    `;}
function lpGpsPlayButtonSvg(){return`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M10 8.75l5.5 3.25L10 15.25z" fill="currentColor" stroke="none"></path>
      </svg>
    `;}
function lpGpsShuffleButtonSvg(){return`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M16 3h5v5"></path>
        <path d="M4 20l7-7"></path>
        <path d="M21 3l-8 8"></path>
        <path d="M4 4l6 6"></path>
        <path d="M14 14l7 7"></path>
        <path d="M16 21h5v-5"></path>
      </svg>
    `;}
function lpCompassButtonSvg(){return`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M14.95 9.05l-1.85 5.05-5.05 1.85 1.85-5.05 5.05-1.85z"></path>
        <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none"></circle>
      </svg>
    `;}
function lpH1RouteTargetPinSvg(){return`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M12 20.25s-5.25-4.9-5.25-9.1a5.25 5.25 0 1 1 10.5 0c0 4.2-5.25 9.1-5.25 9.1Z"></path>
        <circle cx="12" cy="11.1" r="1.9" fill="currentColor" stroke="none"></circle>
      </svg>
    `;}
function lpRenderKnowledgeGpsProgress(graph,currentLoc){return'';}
function lpMountKnowledgeGpsEntryProgress(panel,graph,currentLoc){const root=panel&&panel.querySelector?panel.querySelector('[data-lp-gps-progress]'):null;if(!root)return;root.innerHTML=lpRenderKnowledgeGpsProgress(graph,currentLoc);}
function lpLocalMapSafeInsets(modal,stageW,stageH){const safeStageW=Math.max(0,Number(stageW)||0);const safeStageH=Math.max(0,Number(stageH)||0);const stage=modal&&modal.querySelector?modal.querySelector('.lp-mapstage'):null;const topbar=modal&&modal.querySelector?modal.querySelector('.lp-map-topbar'):null;const zoom=modal&&modal.querySelector?(modal.querySelector('.lp-mzoom')||modal.querySelector('.lp-zoomctrl')):null;const stageRect=stage&&stage.getBoundingClientRect?stage.getBoundingClientRect():null;const topbarRect=topbar&&topbar.getBoundingClientRect?topbar.getBoundingClientRect():null;const zoomRect=zoom&&zoom.getBoundingClientRect?zoom.getBoundingClientRect():null;let top=24;let bottom=24;let topBound=0;let bottomBound=safeStageH;if(stageRect&&topbarRect&&topbarRect.bottom>stageRect.top){topBound=lpMapDocClamp(Math.round(topbarRect.bottom-stageRect.top),0,safeStageH);top=Math.max(top,topBound);}
if(stageRect&&zoomRect&&zoomRect.width>0&&zoomRect.height>0&&zoomRect.top<stageRect.bottom){bottomBound=lpMapDocClamp(Math.round(zoomRect.top-stageRect.top),topBound+80,safeStageH);bottom=Math.max(bottom,Math.round(stageRect.bottom-zoomRect.top));}else if(modal&&modal.style&&modal.style.getPropertyValue){const visibleCss=parseFloat(modal.style.getPropertyValue('--lp-map-visible-height')||'0');if(Number.isFinite(visibleCss)&&visibleCss>0){bottomBound=lpMapDocClamp(Math.round(visibleCss-86),topBound+80,safeStageH);bottom=Math.max(bottom,Math.round(safeStageH-bottomBound));}}
const usableTop=lpMapDocClamp(topBound,0,safeStageH);const usableBottom=lpMapDocClamp(bottomBound,usableTop+80,safeStageH);return{left:28,right:28,top,bottom,centerX:safeStageW/2,centerY:(usableTop+usableBottom)/2,usableTop,usableBottom,};}
function lpLocalMapPreferredTargetPoint(modal,st){const state=st||window.__lpMapState||{};try{const vp=modal&&modal.querySelector?modal.querySelector('[data-map-viewport]'):null;const curNode=vp&&vp.querySelector?vp.querySelector('.lp-node.is-cur[data-lp-loc]'):null;if(curNode){const x=Number.parseFloat(curNode.style.left||'');const y=Number.parseFloat(curNode.style.top||'');if(Number.isFinite(x)&&Number.isFinite(y))return{x,y};}}catch(_){}
const x=Number(state.__lpCurrentX);const y=Number(state.__lpCurrentY);if(Number.isFinite(x)&&Number.isFinite(y))return{x,y};return{x:Number(state.__lpWorldCX)||0,y:Number(state.__lpWorldCY)||0,};}
function lpStripMathDelimiters(rawMath){let body=String(rawMath||"").trim();if(!body)return"";body=body.replace(/^\\\(/,"").replace(/\\\)$/,"").replace(/^\\\[/,"").replace(/\\\]$/,"").replace(/^\$\$/,"").replace(/\$\$$/,"").replace(/^\$/,"").replace(/\$$/,"").trim();return body;}
function lpPrettyInlineMathText(rawMath){const body=lpStripMathDelimiters(rawMath);if(!body)return"";const supers={"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","+":"⁺","-":"⁻","=":"⁼","(":"⁽",")":"⁾","n":"ⁿ","i":"ⁱ"};const subs={"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","+":"₊","-":"₋","=":"₌","(":"₍",")":"₎","i":"ᵢ","j":"ⱼ","k":"ₖ","n":"ₙ"};const mapChars=(txt,table)=>Array.from(String(txt||"")).map((ch)=>table[ch]||ch).join("");const bbMap={R:"ℝ",N:"ℕ",Z:"ℤ",Q:"ℚ",C:"ℂ"};let pretty=body.replace(/\\?mathbb\s*\{\s*([RNZQC])\s*\}/g,(_m,x)=>bbMap[x]||x).replace(/\\?mathbb\s+([RNZQC])(?=\s|\^|_|$)/g,(_m,x)=>bbMap[x]||x).replace(/\\mathbb\{([A-Za-z])\}/g,"$1").replace(/\\mathbb\s+([A-Za-z])(?=\s|\^|_|$)/g,"$1").replace(/\\?mathcal\s*\{\s*([A-Za-z])\s*\}/g,"$1").replace(/\\?mathcal\s+([A-Za-z])(?=\s|\^|_|$)/g,"$1").replace(/\\?mathscr\s*\{\s*([A-Za-z])\s*\}/g,"$1").replace(/\\?mathscr\s+([A-Za-z])(?=\s|\^|_|$)/g,"$1").replace(/\\mathbf\{([^{}]*)\}/g,"$1").replace(/\\mathit\{([^{}]*)\}/g,"$1").replace(/\\mathrm\{([^{}]*)\}/g,"$1").replace(/\\operatorname\{([^{}]*)\}/g,"$1").replace(/\\text\{([^{}]*)\}/g,"$1").replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g,"$1/$2").replace(/\\sqrt\{([^{}]*)\}/g,"√$1").replace(/\\mapsto/g,"↦").replace(/\\to/g,"→").replace(/\\infty/g,"∞").replace(/\\leq?/g,"≤").replace(/\\geq?/g,"≥").replace(/\\neq/g,"≠").replace(/\\subseteq/g,"⊆").replace(/\\subset/g,"⊂").replace(/\\supseteq/g,"⊇").replace(/\\supset/g,"⊃").replace(/\\cup/g,"∪").replace(/\\cap/g,"∩").replace(/\\times/g,"×").replace(/\\cdot/g,"·").replace(/\\pm/g,"±").replace(/\\alpha/g,"α").replace(/\\beta/g,"β").replace(/\\gamma/g,"γ").replace(/\\delta/g,"δ").replace(/\\epsilon/g,"ε").replace(/\\varepsilon/g,"ε").replace(/\\theta/g,"θ").replace(/\\lambda/g,"λ").replace(/\\mu/g,"μ").replace(/\\sigma/g,"σ").replace(/\\omega/g,"ω").replace(/\\colon/g,":").replace(/\\,/g," ");pretty=pretty.replace(/\^\{([^{}]+)\}/g,(_m,x)=>mapChars(x,supers)).replace(/_\{([^{}]+)\}/g,(_m,x)=>mapChars(x,subs)).replace(/\^([A-Za-z0-9+\-=()])/g,(_m,x)=>mapChars(x,supers)).replace(/_([A-Za-z0-9+\-=()])/g,(_m,x)=>mapChars(x,subs)).replace(/\\[a-zA-Z]+\{([^{}]*)\}/g,"$1").replace(/[{}]/g,"").replace(/\\/g,"").replace(/\s+/g," ").trim();return pretty||body;}
function lpKatexAvailable(){try{return!!(window.katex&&typeof window.katex.renderToString==="function");}catch(_){return false;}}
function lpKatexInlineMathHtml(rawMath){const body=lpStripMathDelimiters(rawMath);if(!body||!lpKatexAvailable())return"";try{return window.katex.renderToString(body,{displayMode:false,throwOnError:false,strict:"ignore",trust:false});}catch(_){return"";}}
function lpLocalMapHideDirectionMenu(modal){const root=modal||document.getElementById('lp-map-modal');if(!root)return;const menu=root.querySelector('[data-lp-map-dir-menu]');if(!menu)return;menu.hidden=true;root.__lpDirMenuAnchorLoc='';}
function lpLocalMapShowDirectionMenu(modal,anchorEl){const root=modal||document.getElementById('lp-map-modal');lpLocalMapHideDirectionMenu(root);return;}
function lpEventPoint(e){try{if(e&&Number.isFinite(Number(e.clientX))&&Number.isFinite(Number(e.clientY))){return{x:Number(e.clientX),y:Number(e.clientY)};}
const t=e&&e.changedTouches&&e.changedTouches[0];if(t&&Number.isFinite(Number(t.clientX))&&Number.isFinite(Number(t.clientY))){return{x:Number(t.clientX),y:Number(t.clientY)};}
const tt=e&&e.touches&&e.touches[0];if(tt&&Number.isFinite(Number(tt.clientX))&&Number.isFinite(Number(tt.clientY))){return{x:Number(tt.clientX),y:Number(tt.clientY)};}}catch(_){}
return null;}
function lpFindStrictHitNode(root,x,y,selector){if(!root||!Number.isFinite(Number(x))||!Number.isFinite(Number(y)))return null;const els=Array.from(root.querySelectorAll(selector||'.lp-node[data-lp-loc]'));const hits=[];for(const el of els){if(!el||!el.getBoundingClientRect)continue;const rect=el.getBoundingClientRect();if(!rect||rect.width<=0||rect.height<=0)continue;if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)continue;hits.push({el,area:rect.width*rect.height,z:Number(window.getComputedStyle(el).zIndex)||0});}
if(!hits.length)return null;hits.sort((a,b)=>(b.z-a.z)||(a.area-b.area));return hits[0].el||null;}
function lpNodeFromPoint(root,x,y,selector){try{const el=document.elementFromPoint(Number(x)||0,Number(y)||0);if(!el||!el.closest)return null;const hit=el.closest(selector||'.lp-node[data-lp-loc]');if(!hit)return null;if(root&&root.contains&&!root.contains(hit))return null;return hit;}catch(_){return null;}}
function lpStrictNodeFromEvent(root,e,selector){const pt=lpEventPoint(e);if(!pt)return null;return lpFindStrictHitNode(root,pt.x,pt.y,selector)||lpNodeFromPoint(root,pt.x,pt.y,selector);}
function lpFindRelaxedTapNode(root,x,y,selector,extraPad){if(!root||!Number.isFinite(Number(x))||!Number.isFinite(Number(y)))return null;const padExtra=Math.max(0,Number(extraPad)||0);const els=Array.from(root.querySelectorAll(selector||'.lp-node[data-lp-loc]'));const hits=[];for(const el of els){if(!el||!el.getBoundingClientRect)continue;const rect=el.getBoundingClientRect();if(!rect||rect.width<=0||rect.height<=0)continue;const pad=Math.max(10,Math.min(26,Math.round(Math.max(rect.width,rect.height)*0.18)))+padExtra;const inside=x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom;const near=x>=(rect.left-pad)&&x<=(rect.right+pad)&&y>=(rect.top-pad)&&y<=(rect.bottom+pad);if(!inside&&!near)continue;const cx=rect.left+rect.width/2;const cy=rect.top+rect.height/2;const dx=Number(x)-cx;const dy=Number(y)-cy;hits.push({el,inside:inside?1:0,dist2:dx*dx+dy*dy,area:rect.width*rect.height,z:Number(window.getComputedStyle(el).zIndex)||0,});}
if(!hits.length)return null;hits.sort((a,b)=>(b.inside-a.inside)||(b.z-a.z)||(a.dist2-b.dist2)||(a.area-b.area));return hits[0].el||null;}
function lpBestTapNodeFromEvent(root,e,selector){const pt=lpEventPoint(e);if(!pt)return null;return lpFindStrictHitNode(root,pt.x,pt.y,selector)||lpNodeFromPoint(root,pt.x,pt.y,selector)||lpFindRelaxedTapNode(root,pt.x,pt.y,selector,0)||lpFindRelaxedTapNode(root,pt.x,pt.y,selector,10)||null;}
function lpTapDragThreshold(e,startedOnNode){const pointerType=String(e&&e.pointerType||'').toLowerCase();if(pointerType==='mouse')return 8;if(pointerType==='pen')return startedOnNode?12:10;return startedOnNode?18:10;}
function lpSelectionGuardAllowsTarget(target){try{return!!(target&&target.closest&&target.closest('input, textarea, [contenteditable=""], [contenteditable="true"], [contenteditable=true]'));}catch(_){return false;}}
function lpSelectionGuardInteractiveTarget(target){try{return!!(target&&target.closest&&target.closest(['a.lp-node','button','label','[role="button"]','[data-lp-map-tab]','[data-lp-map-dir]','[data-lp-h1sg-dir]','[data-lp-map-tip-toggle]','.lp-h1sg-filter','.lp-map-dir-menu','.lp-h1sg-dir-menu'].join(',')));}catch(_){return false;}}
function lpInstallBlankLongPressSelectionGuard(root){if(!root||root.__lpBlankLongPressSelectionGuardInstalled)return;root.__lpBlankLongPressSelectionGuardInstalled=true;const shouldBlock=(target)=>!lpSelectionGuardAllowsTarget(target)&&!lpSelectionGuardInteractiveTarget(target);root.addEventListener('selectstart',(e)=>{if(!shouldBlock(e&&e.target))return;if(e&&e.cancelable)e.preventDefault();},true);root.addEventListener('contextmenu',(e)=>{if(!shouldBlock(e&&e.target))return;if(e&&e.cancelable)e.preventDefault();},true);}
function lpMapDocSurfaceIsIOS(){try{const ua=String(navigator.userAgent||"");const platform=String(navigator.platform||"");return/iP(?:hone|ad|od)/i.test(ua)||(/Mac/i.test(platform)&&Number(navigator.maxTouchPoints||0)>1);}catch(_){return false;}}
function lpMapDocPx(n){const x=Number(n);return Number.isFinite(x)?Math.max(0,Math.round(x))+"px":"0px";}
function lpMapDocScrollX(){try{return Math.max(0,Number(window.scrollX)||Number(window.pageXOffset)||Number(document.documentElement&&document.documentElement.scrollLeft)||Number(document.body&&document.body.scrollLeft)||0);}
catch(_){return 0;}}
function lpMapDocScrollY(){try{return Math.max(0,Number(window.scrollY)||Number(window.pageYOffset)||Number(document.documentElement&&document.documentElement.scrollTop)||Number(document.body&&document.body.scrollTop)||0);}
catch(_){return 0;}}
function lpMapDocClamp(value,min,max){return Math.min(max,Math.max(min,value));}
function lpMapDocSafeBottomPx(){try{let probe=document.getElementById("lp-map-doc-safe-probe");if(!probe){probe=document.createElement("div");probe.id="lp-map-doc-safe-probe";probe.style.cssText="position:fixed;left:0;bottom:0;visibility:hidden;pointer-events:none;height:0;padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom,0px);";(document.body||document.documentElement).appendChild(probe);}
const cs=window.getComputedStyle?window.getComputedStyle(probe):null;return Math.max(0,Math.ceil(parseFloat(cs&&cs.paddingBottom)||0));}catch(_){return 0;}}
function lpEnsureMapDocumentSurfaceStyle(){if(document.getElementById("lp-map-document-surface-style-v9"))return;const st=document.createElement("style");st.id="lp-map-document-surface-style-v9";st.textContent=`
@media (pointer: coarse), (max-width: 900px), (hover: none){
  #lp-map-modal.lp-doc-surface,
  #lp-map-modal.lp-doc-surface.lp-open,
  #lp-map-modal.lp-doc-surface.lp-full,
  #lp-h1sg-modal.lp-doc-surface,
  #lp-h1sg-modal.lp-doc-surface.lp-open,
  #lp-h1sg-modal.lp-doc-surface.lp-full{
    position:absolute !important;
    left:var(--lp-map-doc-left, 0px) !important;
    top:var(--lp-map-doc-top, 0px) !important;
    right:auto !important;
    bottom:auto !important;
    width:var(--lp-map-doc-width, 100vw) !important;
    min-width:var(--lp-map-doc-width, 100vw) !important;
    max-width:var(--lp-map-doc-width, 100vw) !important;
    height:var(--lp-map-doc-height, 100vh) !important;
    min-height:var(--lp-map-doc-height, 100vh) !important;
    max-height:none !important;
    margin:0 !important;
    padding:0 !important;
    overflow:hidden !important;
    align-items:stretch !important;
    justify-content:stretch !important;
    background:rgba(0,0,0,.62) !important;
    touch-action:none !important;
    overscroll-behavior:contain !important;
  }
  #lp-map-modal.lp-doc-surface .lp-mbox,
  #lp-map-modal.lp-doc-surface.lp-full .lp-mbox,
  #lp-h1sg-modal.lp-doc-surface .lp-mbox,
  #lp-h1sg-modal.lp-doc-surface.lp-full .lp-mbox{
    position:absolute !important;
    left:0 !important;
    top:0 !important;
    width:var(--lp-map-doc-width, 100vw) !important;
    min-width:var(--lp-map-doc-width, 100vw) !important;
    max-width:var(--lp-map-doc-width, 100vw) !important;
    height:var(--lp-map-doc-height, 100vh) !important;
    min-height:var(--lp-map-doc-height, 100vh) !important;
    max-height:none !important;
    margin:0 !important;
    padding:0 !important;
    border:0 !important;
    border-radius:0 !important;
    box-shadow:none !important;
    overflow:hidden !important;
    background:transparent !important;
  }
  #lp-map-modal.lp-doc-surface .lp-mbody,
  #lp-map-modal.lp-doc-surface .lp-mapstage,
  #lp-map-modal.lp-doc-surface .lp-mapviewport,
  #lp-map-modal.lp-doc-surface.lp-full .lp-mbody,
  #lp-map-modal.lp-doc-surface.lp-full .lp-mapstage,
  #lp-h1sg-modal.lp-doc-surface .lp-mbody,
  #lp-h1sg-modal.lp-doc-surface .lp-mapstage,
  #lp-h1sg-modal.lp-doc-surface .lp-mapviewport,
  #lp-h1sg-modal.lp-doc-surface.lp-full .lp-mbody,
  #lp-h1sg-modal.lp-doc-surface.lp-full .lp-mapstage{
    min-height:100% !important;
  }
  #lp-map-modal.lp-doc-surface .lp-mbody,
  #lp-map-modal.lp-doc-surface .lp-mapstage,
  #lp-h1sg-modal.lp-doc-surface .lp-mbody,
  #lp-h1sg-modal.lp-doc-surface .lp-mapstage{
    height:var(--lp-map-doc-height, 100vh) !important;
  }
  #lp-map-modal.lp-doc-surface .lp-mctrl{
    top:calc(env(safe-area-inset-top, 0px) + 16px) !important;
  }
  #lp-map-modal.lp-doc-surface .lp-close,
  #lp-map-modal.lp-doc-surface .lp-full,
  #lp-h1sg-modal.lp-doc-surface .lp-close,
  #lp-h1sg-modal.lp-doc-surface .lp-full{
    top:calc(env(safe-area-inset-top, 0px) + 16px) !important;
  }
  #lp-map-modal.lp-doc-surface .lp-mbox > .lp-mzoom,
  #lp-map-modal.lp-doc-surface .lp-mbox > .lp-mzoom[data-lp-zoom-dock="outer"],
  #lp-map-modal.lp-doc-surface .lp-mzoom,
  #lp-h1sg-modal.lp-doc-surface .lp-mbox > .lp-mzoom,
  #lp-h1sg-modal.lp-doc-surface .lp-mbox > .lp-mzoom[data-lp-zoom-dock="outer"],
  #lp-h1sg-modal.lp-doc-surface .lp-mzoom{
    /* Keep the zoom dock anchored to the visible viewport, not to the
       over-extended document-layer surface. The map surface may continue
       below iOS Safari's bottom toolbar, but this control must remain above
       the safe/visible area. */
    position:absolute !important;
    left:50% !important;
    right:auto !important;
    top:auto !important;
    transform:translateX(-50%) !important;
    bottom:var(--lp-map-zoom-bottom, calc(env(safe-area-inset-bottom, 0px) + 22px)) !important;
    z-index:2147483405 !important;
    display:flex !important;
    visibility:visible !important;
    opacity:1 !important;
    pointer-events:none !important;
  }
  #lp-map-modal.lp-doc-surface .lp-mzoom [data-ctrl-zoom],
  #lp-h1sg-modal.lp-doc-surface .lp-mzoom .lp-ctrl-group{
    pointer-events:auto !important;
  }
  /* The guided-study CTA sits directly above the dock, so it has to ride the
     same visible-viewport anchor instead of the taller document surface. */
  #lp-h1sg-modal.lp-doc-surface .lp-h1sg-docklaunch{
    /* bottom only: left/transform/hover-lift stay with the existing rules so the
       press and hover transforms are not overwritten. */
    top:auto !important;
    bottom:calc(var(--lp-map-zoom-bottom, calc(env(safe-area-inset-bottom, 0px) + 22px)) + 68px) !important;
    z-index:2147483404 !important;
  }
  #lp-map-modal.lp-touch-compositor .lp-mapviewport,
  #lp-h1sg-modal.lp-touch-compositor .lp-mapviewport{
    -webkit-transform:translate3d(0,0,0);
    transform:translate3d(0,0,0);
    will-change:transform;
    backface-visibility:hidden;
    -webkit-backface-visibility:hidden;
  }
  #lp-map-modal.lp-touch-compositor .lp-fog-layer{
    display:block !important;
    opacity:.56 !important;
    filter:blur(14px) saturate(1.01) !important;
  }
  #lp-map-modal.lp-touch-compositor .lp-mapviewport svg .lp-flow-arrow{
    display:block !important;
  }
  #lp-map-modal.lp-touch-compositor .lp-mapviewport svg path.lp-rel-edge.lp-rel-anim{
    animation:lp-rel-dash 1.2s linear infinite !important;
  }
}
`;(document.head||document.documentElement).appendChild(st);}
function lpExitMapDocumentSurface(modal){try{if(!modal)return;modal.classList.remove("lp-doc-surface");["--lp-map-doc-left","--lp-map-doc-top","--lp-map-doc-width","--lp-map-doc-height","--lp-map-visible-height","--lp-map-ios-hidden-tail","--lp-map-zoom-bottom"].forEach((name)=>{try{modal.style.removeProperty(name);}catch(_){}});try{modal.style.removeProperty("padding");}catch(_){}}catch(_){}}
function lpSetFullscreenIcon(btn,isOn){if(!btn)return;const enterSvg='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+'<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'+"</svg>";const exitSvg='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+'<path d="M9 3v6H3M15 3v6h6M21 15h-6v6M3 15h6v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'+"</svg>";btn.innerHTML=isOn?exitSvg:enterSvg;btn.setAttribute("aria-label",isOn?"Exit fullscreen":"Fullscreen");btn.dataset.lpFsOn=isOn?"1":"0";}
function lpBindTap(el,fn){if(!el||typeof fn!=="function")return;if(el.dataset&&el.dataset.lpTapBound)return;if(el.dataset)el.dataset.lpTapBound="1";let lastPointerUp=0;let lastTouchEnd=0;let activePointerId=null;let activeTouchId=null;const isInside=(point)=>{const rect=el.getBoundingClientRect();return point.clientX>=rect.left&&point.clientX<=rect.right&&point.clientY>=rect.top&&point.clientY<=rect.bottom;};const fire=(e,fromPointer)=>{if(fromPointer)lastPointerUp=Date.now();if(e&&e.cancelable)e.preventDefault();if(e)e.stopPropagation();fn(e);};if(window.PointerEvent){el.addEventListener("pointerdown",(e)=>{if(e.isPrimary===false||(e.button!=null&&e.button!==0))return;activePointerId=e.pointerId;if(e&&e.cancelable)e.preventDefault();if(e)e.stopPropagation();},{passive:false});el.addEventListener("pointerup",(e)=>{if(e.isPrimary===false||(e.button!=null&&e.button!==0))return;if(activePointerId==null||activePointerId!==e.pointerId)return;activePointerId=null;if(!isInside(e))return;fire(e,true);},{passive:false});const cancelPointer=(e)=>{if(activePointerId===e.pointerId)activePointerId=null;};el.addEventListener("pointercancel",cancelPointer);el.addEventListener("pointerleave",cancelPointer);}else{el.addEventListener("touchstart",(e)=>{activeTouchId=e.touches.length===1?e.touches[0].identifier:null;if(e.cancelable)e.preventDefault();e.stopPropagation();},{passive:false});el.addEventListener("touchend",(e)=>{const id=activeTouchId;activeTouchId=null;if(id==null||e.touches.length)return;const touch=Array.from(e.changedTouches).find((item)=>item.identifier===id);if(!touch||!isInside(touch))return;lastTouchEnd=Date.now();fire(e,false);},{passive:false});el.addEventListener("touchcancel",()=>{activeTouchId=null;});el.addEventListener("touchmove",(e)=>{if(e.touches.length!==1||!isInside(e.touches[0]))activeTouchId=null;},{passive:true});}
el.addEventListener("click",(e)=>{const now=Date.now();if(e.detail!==0&&((lastPointerUp&&(now-lastPointerUp)<450)||(lastTouchEnd&&(now-lastTouchEnd)<650))){if(e&&e.cancelable)e.preventDefault();e.stopPropagation();return;}
fire(e,false);},{passive:false});}
function lpReparentZoomGroup(modal){try{if(!modal)return;const box=modal.querySelector(".lp-mbox");if(!box)return;const zoom=box.querySelector("[data-ctrl-zoom]");if(!zoom)return;let dock=null;for(const child of Array.from(box.children||[])){if(child&&child.classList&&child.classList.contains("lp-mzoom")){dock=child;break;}}
if(!dock){dock=document.createElement("div");dock.className="lp-mzoom";box.appendChild(dock);}
try{dock.setAttribute("data-lp-zoom-dock","outer");if(modal.id)dock.setAttribute("data-lp-zoom-owner",modal.id);}catch(_){}
if(zoom.parentElement!==dock)dock.appendChild(zoom);const stage=box.querySelector(".lp-mapstage");if(stage){Array.from(stage.querySelectorAll(":scope > .lp-mzoom")).forEach((ghost)=>{try{ghost.setAttribute("data-lp-zoom-dock","ghost");ghost.remove();}catch(_){}});}}catch(_){}}
const LP_MOBILE_SHEET_STATE_KEY="lp_mobile_sheet_state_v1";const LP_MOBILE_SHEET_NAV_KEY="lp_mobile_sheet_nav_target_v1";const LP_MOBILE_SHEET_LAST_PAGE_KEY="lp_mobile_sheet_last_page_v1";const LP_MOBILE_PANEL_ANIM_MS=1000;const LP_MOBILE_PANEL_CLOSE_ARROW_LEAD_MS=180;function lpGetMobileSheetState(){try{return sessionStorage.getItem(LP_MOBILE_SHEET_STATE_KEY)||"collapsed";}catch(_){return"collapsed";}}
function lpSetMobileSheetState(v){try{sessionStorage.setItem(LP_MOBILE_SHEET_STATE_KEY,v);}catch(_){}}
function lpClearMobileSheetAnimTimer(root){if(!root)return;try{if(root.__lpPanelAnimTimer){clearTimeout(root.__lpPanelAnimTimer);root.__lpPanelAnimTimer=0;}}catch(_){}
try{if(root.__lpPanelCloseStartTimer){clearTimeout(root.__lpPanelCloseStartTimer);root.__lpPanelCloseStartTimer=0;}}catch(_){}
try{if(root.__lpPanelAnimRaf1){cancelAnimationFrame(root.__lpPanelAnimRaf1);root.__lpPanelAnimRaf1=0;}}catch(_){}
try{if(root.__lpPanelAnimRaf2){cancelAnimationFrame(root.__lpPanelAnimRaf2);root.__lpPanelAnimRaf2=0;}}catch(_){}}
function lpMobileSheetPanelSections(root){if(!root||!root.querySelectorAll)return[];return Array.from(root.querySelectorAll("#lp-side-panel details.lp-acc"));}
function lpGetMobileSheetBody(root){return(root&&root.querySelector)?root.querySelector("[data-lp-ms-body]"):null;}
function lpGetMobileSheetHead(root){return(root&&root.querySelector)?root.querySelector(".lp-msheet-head"):null;}
function lpClearMobileSheetPanelInlineStyles(root){const body=lpGetMobileSheetBody(root);if(body){try{body.style.removeProperty("height");body.style.removeProperty("transition");body.style.removeProperty("overflow");body.style.removeProperty("will-change");body.style.removeProperty("padding-bottom");}catch(_){}}
const head=lpGetMobileSheetHead(root);if(head){try{head.style.removeProperty("transition");head.style.removeProperty("will-change");head.style.removeProperty("border-bottom-color");}catch(_){}}
for(const sec of lpMobileSheetPanelSections(root)){try{sec.style.removeProperty("height");sec.style.removeProperty("transition");sec.style.removeProperty("overflow");sec.style.removeProperty("will-change");sec.style.removeProperty("opacity");sec.style.removeProperty("box-sizing");}catch(_){}
const label=sec.querySelector(".lp-sum-left");if(!label)continue;try{label.style.removeProperty("transition");label.style.removeProperty("opacity");label.style.removeProperty("filter");label.style.removeProperty("will-change");}catch(_){}}}
function lpMeasureMobileSheetPanelSections(root){const body=lpGetMobileSheetBody(root);const sections=[];let bodyExpanded=0;if(body){try{bodyExpanded=Math.ceil(body.scrollHeight);}catch(_){}}
for(const sec of lpMobileSheetPanelSections(root)){const label=sec.querySelector(".lp-sum-left");let expanded=0;try{expanded=Math.ceil(sec.scrollHeight);}catch(_){}
expanded=Math.max(0,expanded||0);sections.push({sec,label,expanded});}
bodyExpanded=Math.max(0,bodyExpanded||0);let headBorderColor="";try{const head=lpGetMobileSheetHead(root);headBorderColor=head?(window.getComputedStyle(head).borderBottomColor||""):"";}catch(_){}
return{body,bodyExpanded,sections,headBorderColor};}
function lpPrimeMobileSheetOpenAnimation(root){if(!root)return{body:null,bodyExpanded:0,sections:[]};root.classList.remove("lp-collapsed","lp-panel-rows-hidden");root.classList.add("lp-expanded");lpClearMobileSheetPanelInlineStyles(root);const measures=lpMeasureMobileSheetPanelSections(root);root.classList.add("lp-panel-rows-hidden");if(measures.body){try{measures.body.style.height="0px";measures.body.style.transition="none";measures.body.style.overflow="hidden";measures.body.style.willChange="height, padding-bottom";measures.body.style.paddingBottom="0px";}catch(_){}}
const head=lpGetMobileSheetHead(root);if(head){try{head.style.transition="none";head.style.willChange="border-bottom-color";head.style.borderBottomColor="transparent";}catch(_){}}
for(const item of(measures.sections||[])){const sec=item.sec;const label=item.label;try{sec.style.boxSizing="border-box";sec.style.height="0px";sec.style.transition="none";sec.style.overflow="hidden";sec.style.willChange="height";}catch(_){}
if(!label)continue;try{label.style.opacity="0";label.style.filter="blur(6px)";label.style.transition="none";label.style.willChange="opacity, filter";}catch(_){}}
void root.offsetWidth;return measures;}
function lpPrimeMobileSheetCloseAnimation(root){if(!root)return{body:null,bodyExpanded:0,sections:[]};root.classList.remove("lp-collapsed","lp-panel-rows-hidden");root.classList.add("lp-expanded");lpClearMobileSheetPanelInlineStyles(root);const measures=lpMeasureMobileSheetPanelSections(root);root.classList.add("lp-panel-rows-hidden");if(measures.body){try{measures.body.style.height=`${measures.bodyExpanded}px`;measures.body.style.transition="none";measures.body.style.overflow="hidden";measures.body.style.willChange="height, padding-bottom";measures.body.style.paddingBottom="12px";}catch(_){}}
const head=lpGetMobileSheetHead(root);if(head){try{head.style.transition="none";head.style.willChange="border-bottom-color";head.style.borderBottomColor=measures.headBorderColor||"";}catch(_){}}
for(const item of(measures.sections||[])){const sec=item.sec;const label=item.label;try{sec.style.boxSizing="border-box";sec.style.height=`${item.expanded}px`;sec.style.transition="none";sec.style.overflow="hidden";sec.style.willChange="height";}catch(_){}
if(!label)continue;try{label.style.opacity="1";label.style.filter="blur(0px)";label.style.transition="none";label.style.willChange="opacity, filter";}catch(_){}}
void root.offsetWidth;return measures;}
function lpRunMobileSheetPanelAnimation(root,measures,open){if(!root)return;const body=measures&&measures.body?measures.body:null;const head=lpGetMobileSheetHead(root);const bodyTiming=open?`height ${LP_MOBILE_PANEL_ANIM_MS}ms cubic-bezier(.22,1,.36,1), padding-bottom ${LP_MOBILE_PANEL_ANIM_MS}ms cubic-bezier(.22,1,.36,1)`:`height ${LP_MOBILE_PANEL_ANIM_MS}ms cubic-bezier(.4,0,.2,1), padding-bottom ${LP_MOBILE_PANEL_ANIM_MS}ms cubic-bezier(.4,0,.2,1)`;const headTiming=`border-bottom-color ${LP_MOBILE_PANEL_ANIM_MS}ms linear`;const secTiming=open?`height ${LP_MOBILE_PANEL_ANIM_MS}ms cubic-bezier(.22,1,.36,1)`:`height ${LP_MOBILE_PANEL_ANIM_MS}ms cubic-bezier(.4,0,.2,1)`;const labelTiming=`opacity ${LP_MOBILE_PANEL_ANIM_MS}ms linear, filter ${LP_MOBILE_PANEL_ANIM_MS}ms linear`;root.__lpPanelAnimRaf1=requestAnimationFrame(()=>{root.__lpPanelAnimRaf1=0;root.__lpPanelAnimRaf2=requestAnimationFrame(()=>{root.__lpPanelAnimRaf2=0;if(head){try{head.style.transition=headTiming;head.style.borderBottomColor=open?(measures.headBorderColor||""):"transparent";}catch(_){}}
if(body){try{body.style.transition=bodyTiming;body.style.height=`${open ? Math.max(0, Number(measures.bodyExpanded) || 0) : 0}px`;body.style.paddingBottom=open?"12px":"0px";}catch(_){}}
for(const item of((measures&&measures.sections)||[])){const sec=item.sec;const label=item.label;try{sec.style.transition=secTiming;sec.style.height=`${open ? Math.max(0, Number(item.expanded) || 0) : 0}px`;}catch(_){}
if(!label)continue;try{label.style.transition=labelTiming;label.style.opacity=open?"1":"0";label.style.filter=open?"blur(0px)":"blur(6px)";}catch(_){}}});});}
function lpResetMobileSheetAnimClasses(root){if(!root||!root.classList)return;root.classList.remove("lp-animating","lp-panel-opening","lp-panel-closing","lp-panel-rows-hidden");lpClearMobileSheetPanelInlineStyles(root);}
function lpSetMobileSheetExpandedImmediate(open){const root=document.getElementById("lp-mobile-sheet");const backdrop=document.getElementById("lp-mobile-backdrop");if(!root||!backdrop)return;lpClearMobileSheetAnimTimer(root);lpResetMobileSheetAnimClasses(root);if(open){root.classList.remove("lp-collapsed");root.classList.add("lp-expanded");backdrop.classList.add("lp-open");backdrop.setAttribute("aria-hidden","false");lpSetMobileSheetScrollGuards(true);lpSetMobileSheetState("expanded");}else{root.classList.remove("lp-expanded");root.classList.add("lp-collapsed");backdrop.classList.remove("lp-open");backdrop.setAttribute("aria-hidden","true");lpSetMobileSheetScrollGuards(false);lpSetMobileSheetState("collapsed");}}
function lpSetMobileSheetScrollGuards(on){const root=document.getElementById("lp-mobile-sheet");const sc=root?root.querySelector(".lp-msheet-body"):null;if(!window.__lpSheetGuards)window.__lpSheetGuards={};const G=window.__lpSheetGuards;const isExpanded=()=>{const r=document.getElementById("lp-mobile-sheet");return!!(r&&r.classList&&r.classList.contains("lp-expanded"));};if(!on){if(G.bound&&sc){try{sc.removeEventListener("touchstart",G.onTouchStart,{passive:true});}catch(_){}
try{sc.removeEventListener("touchmove",G.onTouchMoveBody,{passive:false});}catch(_){}}
if(G.bound){try{document.removeEventListener("touchmove",G.onTouchMoveDoc,true);}catch(_){}
try{document.removeEventListener("wheel",G.onWheelDoc,true);}catch(_){}
try{document.removeEventListener("touchstart",G.onDocTouchStart,true);}catch(_){}}
G.bound=false;return;}
if(!root||!sc)return;if(G.bound)return;let startY=0;let startX=0;G.onTouchStart=(e)=>{try{const t=e&&e.touches&&e.touches[0];if(!t)return;startY=t.clientY;startX=t.clientX;}catch(_){}};G.onTouchMoveBody=(e)=>{try{if(!isExpanded())return;const t=e&&e.touches&&e.touches[0];if(!t)return;const dy=t.clientY-startY;const dx=t.clientX-startX;if(Math.abs(dx)>Math.abs(dy))return;const el=sc;const sh=el.scrollHeight;const ch=el.clientHeight;if(sh<=ch+1){if(e.cancelable)e.preventDefault();return;}
const top=el.scrollTop;const atTop=top<=0;const atBottom=(top+ch)>=(sh-1);if((atTop&&dy>0)||(atBottom&&dy<0)){if(e.cancelable)e.preventDefault();}}catch(_){}};G.onTouchMoveDoc=(e)=>{try{if(!isExpanded())return;const tgt=e&&e.target;if(tgt&&tgt.closest){if(tgt.closest("#lp-mobile-sheet .lp-msheet-body"))return;}
if(e.cancelable)e.preventDefault();}catch(_){}};G.onWheelDoc=(e)=>{try{if(!isExpanded())return;const tgt=e&&e.target;if(tgt&&tgt.closest){if(tgt.closest("#lp-mobile-sheet .lp-msheet-body"))return;}
if(e.cancelable)e.preventDefault();}catch(_){}};G.onDocTouchStart=(e)=>{try{if(!isExpanded())return;const t=e&&e.touches&&e.touches[0];if(!t)return;startY=t.clientY;startX=t.clientX;}catch(_){}};sc.addEventListener("touchstart",G.onTouchStart,{passive:true});sc.addEventListener("touchmove",G.onTouchMoveBody,{passive:false});document.addEventListener("touchstart",G.onDocTouchStart,{passive:true,capture:true});document.addEventListener("touchmove",G.onTouchMoveDoc,{passive:false,capture:true});document.addEventListener("wheel",G.onWheelDoc,{passive:false,capture:true});G.bound=true;}
function lpStopMobileTapEvent(e,preventDefault){try{if(preventDefault&&e&&e.cancelable)e.preventDefault();if(e&&typeof e.stopPropagation==="function")e.stopPropagation();if(e&&typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();}catch(_){}}
function lpEventTimeNow(){try{return(performance&&performance.now)?performance.now():Date.now();}catch(_){return Date.now();}}
function lpBindMobileTapAction(el,key,fn,opts){if(!el||!el.addEventListener)return;const bindKey=key||"lpMobileTapBound";try{if(el.dataset&&el.dataset[bindKey]==="1")return;if(el.dataset)el.dataset[bindKey]="1";}catch(_){}
const options=opts&&typeof opts==="object"?opts:{};const MOVE_PX=Math.max(4,Number(options.movePx)||14);const TAP_MS=Math.max(120,Number(options.tapMs)||720);let down=null;let lastFire=0;const run=(e)=>{const now=lpEventTimeNow();if(now-lastFire<360){lpStopMobileTapEvent(e,true);return;}
lastFire=now;lpStopMobileTapEvent(e,true);try{fn(e);}catch(_){}};el.addEventListener("pointerdown",(e)=>{try{if(options.ignore&&options.ignore(e))return;down={id:e.pointerId,x:e.clientX,y:e.clientY,t0:lpEventTimeNow(),moved:false};}catch(_){down=null;}},{passive:true});el.addEventListener("pointermove",(e)=>{if(!down||e.pointerId!==down.id)return;const dx=(Number(e.clientX)||0)-down.x;const dy=(Number(e.clientY)||0)-down.y;if((dx*dx+dy*dy)>MOVE_PX*MOVE_PX)down.moved=true;},{passive:true});el.addEventListener("pointerup",(e)=>{if(options.ignore&&options.ignore(e))return;if(!down||e.pointerId!==down.id){run(e);return;}
const dt=lpEventTimeNow()-down.t0;const ok=!down.moved&&dt<=TAP_MS;down=null;if(ok)run(e);},{passive:false});el.addEventListener("pointercancel",()=>{down=null;},{passive:true});el.addEventListener("touchend",(e)=>{if(options.ignore&&options.ignore(e))return;run(e);},{passive:false});el.addEventListener("click",(e)=>{if(options.ignore&&options.ignore(e))return;run(e);},{passive:false});}
function lpSetAccordionBodyHeight(details,open){try{const body=details&&details.querySelector&&details.querySelector(":scope > .lp-body");if(!body)return;if(open){body.style.maxHeight="0px";body.style.opacity="0";details.open=true;requestAnimationFrame(()=>{body.style.maxHeight=Math.max(1,body.scrollHeight)+"px";body.style.opacity="1";});window.setTimeout(()=>{if(details.open)body.style.maxHeight="none";},270);}else{const h=Math.max(1,body.scrollHeight);body.style.maxHeight=h+"px";body.style.opacity="1";requestAnimationFrame(()=>{body.style.maxHeight="0px";body.style.opacity="0";});window.setTimeout(()=>{if(!details.open)return;details.open=false;body.style.maxHeight="";body.style.opacity="";},250);}}catch(_){try{details.open=!!open;}catch(__){}}}
function lpToggleAccordionDetails(details){if(!details)return;const next=!details.open;lpSetAccordionBodyHeight(details,next);try{const sum=details.querySelector(":scope > summary.lp-sum");if(sum)sum.setAttribute("aria-expanded",next?"true":"false");}catch(_){}}
function lpBindMobileSectionSummaryTaps(scope){const root=scope&&scope.querySelectorAll?scope:document;try{root.querySelectorAll("#lp-side-panel details.lp-acc > summary.lp-sum").forEach((sum)=>{if(sum.dataset.lpAnimatedSummaryBound!=="1"){sum.dataset.lpAnimatedSummaryBound="1";sum.addEventListener("click",(e)=>{e.preventDefault();const details=sum.closest("details.lp-acc");lpToggleAccordionDetails(details);},{passive:false});}
try{const details=sum.closest("details.lp-acc");if(details)sum.setAttribute("aria-expanded",details.open?"true":"false");}catch(_){}});}catch(_){}}
function lpEnsurePanelSectionChevrons(scope){const root=scope&&scope.querySelectorAll?scope:document;const html='<span class="lp-sum-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg></span>';try{root.querySelectorAll("#lp-side-panel details.lp-acc > summary.lp-sum").forEach((sum)=>{if(!sum.querySelector(".lp-sum-chevron"))sum.insertAdjacentHTML("beforeend",html);const details=sum.closest("details.lp-acc");if(details)sum.setAttribute("aria-expanded",details.open?"true":"false");});}catch(_){}}
function lpInstallMobileSheetSelectionShield(){if(window.__lpMobileSheetSelectionShieldInstalled)return;window.__lpMobileSheetSelectionShieldInstalled=true;const isExpanded=()=>{const root=document.getElementById("lp-mobile-sheet");return!!(root&&root.classList&&root.classList.contains("lp-expanded"));};const insideSheet=(target)=>{try{return!!(target&&target.closest&&target.closest("#lp-mobile-sheet"));}catch(_){return false;}};const blockOutside=(e)=>{try{if(!isExpanded())return;if(insideSheet(e&&e.target))return;if(e&&e.cancelable)e.preventDefault();if(e&&typeof e.stopPropagation==="function")e.stopPropagation();if(e&&typeof e.stopImmediatePropagation==="function")e.stopImmediatePropagation();}catch(_){}};document.addEventListener("contextmenu",blockOutside,{passive:false,capture:true});document.addEventListener("selectstart",blockOutside,{passive:false,capture:true});}
function lpSyncMobileSheetMotionPreference(){const root=document.getElementById("lp-mobile-sheet");if(!root||!root.classList||!root.classList.contains("lp-animating"))return;if(!lpMotionReduced())return;if(root.classList.contains("lp-panel-opening")){lpSetMobileSheetExpandedImmediate(true);return;}
if(root.classList.contains("lp-panel-closing")){lpSetMobileSheetExpandedImmediate(false);}}
function lpSyncDesktopPanelShiftNow(){try{if(window.__lpDesktopPanelRightShiftApplyNow&&typeof window.__lpDesktopPanelRightShiftApplyNow==="function"){window.__lpDesktopPanelRightShiftApplyNow();return;}
if(window.__lpDesktopPanelRightShiftSchedule&&typeof window.__lpDesktopPanelRightShiftSchedule==="function"){window.__lpDesktopPanelRightShiftSchedule();}}catch(_){}}
function lpH1RouteMarkerSvg(){return`
      <svg class="lp-h1-route-marker-svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M9.6 20.4L13.35 16 9.6 11.6 22.4 16 9.6 20.4Z" fill="currentColor"></path>
      </svg>
    `;}
function lpSplitInlineMathParts(raw){const src=String(raw||'');if(!src)return[];const re=/(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g;const parts=[];let last=0;let m;while((m=re.exec(src))){if(m.index>last)parts.push({type:'text',text:src.slice(last,m.index)});parts.push({type:'math',text:m[0]});last=m.index+m[0].length;}
if(last<src.length)parts.push({type:'text',text:src.slice(last)});return parts;}
function lpSetPendingRouteTargetTitle(el,rawTitle){if(!el)return;const raw=String(rawTitle||'');if(!raw)return;const parts=lpSplitInlineMathParts(raw);if(!parts.length){el.textContent=raw;return;}
const textHasLeadingSpace=(s)=>/^\s+/.test(String(s||''));const textHasTrailingSpace=(s)=>/\s+$/.test(String(s||''));const trimEdgeSpace=(s)=>String(s||'').replace(/^\s+/,'').replace(/\s+$/,'');while(el.firstChild)el.removeChild(el.firstChild);parts.forEach((part,idx)=>{const prev=idx>0?parts[idx-1]:null;const next=idx<(parts.length-1)?parts[idx+1]:null;if(part.type==='math'){const span=document.createElement('span');span.className='lp-h1-route-math-part';if(prev&&prev.type==='text'&&textHasTrailingSpace(prev.text))span.setAttribute('data-lp-pad-left','1');if(next&&next.type==='text'&&textHasLeadingSpace(next.text))span.setAttribute('data-lp-pad-right','1');span.textContent=String(part.text||'');el.appendChild(span);return;}
const core=trimEdgeSpace(part.text);if(!core)return;const span=document.createElement('span');span.className='lp-h1-route-text-part';span.textContent=core;el.appendChild(span);});}
const LP_ROUTE_MAP_MODE=Object.freeze({TO_HERE:"toHere",FROM_HERE:"fromHere"});const LP_ROUTE_MAP_MAX_DISTANCE=8;const LP_ROUTE_MAP_ANIM_START_FOCUS_HOLD_MS=760;const LP_ROUTE_MAP_ANIM_STEP_FOCUS_HOLD_MS=620;const LP_ROUTE_MAP_ANIM_NODE_READ_MIN_MS=520;const LP_ROUTE_MAP_MASK_REVEAL_SETTLE_MS=420;const LP_ROUTE_MAP_NAV_ANCHOR_Y=0.50;const LP_ROUTE_MAP_NAV_ROTATE_MIN_MS=340;const LP_ROUTE_MAP_NAV_ROTATE_MAX_MS=720;const LP_ROUTE_MAP_NAV_TRAVEL_MIN_MS=760;const LP_ROUTE_MAP_NAV_TRAVEL_MAX_MS=1320;const LP_ROUTE_MAP_OVERVIEW_MS=940;const LP_ROUTE_MAP_OVERVIEW_PAD_X=86;const LP_ROUTE_MAP_OVERVIEW_PAD_TOP=128;const LP_ROUTE_MAP_OVERVIEW_PAD_BOTTOM=148;const LP_ROUTE_MAP_OVERVIEW_MAX_SCALE=1.12;function lpRouteMapMode(rawMode){return String(rawMode||LP_ROUTE_MAP_MODE.TO_HERE)===LP_ROUTE_MAP_MODE.FROM_HERE?LP_ROUTE_MAP_MODE.FROM_HERE:LP_ROUTE_MAP_MODE.TO_HERE;}
function lpH1StudyRouteMaskText(rawTitle){const title=String(rawTitle||"");if(!title)return"?";const masked=lpMaskUnknownTitle(title);return masked&&/\?/.test(masked)?masked:"?";}
function lpMapTipsReposition(root){try{if(!root||!root.querySelector)return;const btn=root.querySelector('[data-lp-map-tip-toggle]');const panel=root.querySelector('[data-lp-map-helper-panel]');const topbar=(panel&&panel.parentElement)||root.querySelector('.lp-map-topbar, .lp-h1sg-topbar');if(!btn||!panel||!topbar||panel.hidden)return;const topRect=topbar.getBoundingClientRect();const btnRect=btn.getBoundingClientRect();const panelRect=panel.getBoundingClientRect();const pad=8;const topW=Math.max(0,Number(topRect.width)||0);const panelW=Math.max(0,Number(panelRect.width)||Number(panel.scrollWidth)||0);const centerX=(Number(btnRect.left)||0)-(Number(topRect.left)||0)+((Number(btnRect.width)||0)/2);let left=centerX-(panelW/2);const maxLeft=Math.max(pad,topW-panelW-pad);if(Number.isFinite(maxLeft))left=Math.min(left,maxLeft);left=Math.max(pad,left);panel.style.left=`${Math.round(left)}px`;panel.style.right='auto';panel.style.transform='none';}catch(_){}}
function lpMapTipsCollapse(root){try{if(!root||!root.querySelector)return;const btn=root.querySelector('[data-lp-map-tip-toggle]');const panel=root.querySelector('[data-lp-map-helper-panel]');if(btn)btn.setAttribute('aria-expanded','false');if(panel){panel.hidden=true;panel.style.left='';panel.style.right='';panel.style.transform='';}}catch(_){}}
function lpMapTipsToggle(root){try{if(!root||!root.querySelector)return;const btn=root.querySelector('[data-lp-map-tip-toggle]');const panel=root.querySelector('[data-lp-map-helper-panel]');if(!btn||!panel)return;const next=panel.hidden!==false;panel.hidden=!next;btn.setAttribute('aria-expanded',next?'true':'false');if(next){requestAnimationFrame(()=>{requestAnimationFrame(()=>{lpMapTipsReposition(root);});});}}catch(_){}}
function lpRouteMapFollowsForward(rawMode){return lpRouteMapMode(rawMode)===LP_ROUTE_MAP_MODE.FROM_HERE;}
function lpRouteMapActiveModal(){return document.getElementById("lp-h1sg-modal");}
function lpH1StudyStartNormQuery(q){return String(q||"").toLowerCase().replace(/\s+/g," ").trim();}
function lpH1StudyStartQueryTokens(query){const q=lpH1StudyStartNormQuery(query);return q?q.split(" ").filter(Boolean):[];}
function lpH1StudyStartEscapeRegex(s){return String(s||"").replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}
function lpH1StudyStartViewport(modal){return modal&&(modal.__lpH1Viewport||modal.querySelector("[data-lp-h1sg-viewport]"));}
function lpH1StudyStartStage(modal){return modal&&modal.querySelector(".lp-mapstage");}
function lpH1StudyStartViewportBounds(modal){const vp=lpH1StudyStartViewport(modal);if(!vp||!vp.querySelectorAll)return null;const nodes=Array.from(vp.querySelectorAll('.lp-node[data-lp-loc]'));if(!nodes.length)return null;let minX=Infinity;let minY=Infinity;let maxX=-Infinity;let maxY=-Infinity;for(const el of nodes){const w=Math.max(0,Number(el.offsetWidth)||0);const h=Math.max(0,Number(el.offsetHeight)||0);const x=Number.parseFloat(el.style.left||'')||0;const y=Number.parseFloat(el.style.top||'')||0;if(!Number.isFinite(x)||!Number.isFinite(y)||!w||!h)continue;minX=Math.min(minX,x-w/2);minY=Math.min(minY,y-h/2);maxX=Math.max(maxX,x+w/2);maxY=Math.max(maxY,y+h/2);}
if(!Number.isFinite(minX)||!Number.isFinite(minY)||!Number.isFinite(maxX)||!Number.isFinite(maxY))return null;return{minX,minY,maxX,maxY,cx:(minX+maxX)/2,cy:(minY+maxY)/2};}
function lpH1StudyRouteAnimEase(t){const x=Math.max(0,Math.min(1,Number(t)||0));return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
function lpWebgl3dRouteViewActive(modal){try{return!!(modal&&modal.classList&&modal.classList.contains('lp-webgl3d')&&modal.classList.contains('lp-route-3d')&&lpWebgl3dEnabled());}catch(_){return false;}}
function lpWebgl3dRouteScreenPoint(engine,node,rollDeg,panX,panY){return lpWebgl3dProjectWithScreenTransform(engine,lpWebgl3dProjectBase(engine,node),rollDeg,panX,panY);}
function lpWebgl3dShortestAngleDelta(fromDeg,toDeg){let d=(Number(toDeg)||0)-(Number(fromDeg)||0);while(d>180)d-=360;while(d<-180)d+=360;return d;}
function lpWebgl3dRouteRotateDuration(modal,toView){try{const engine=modal&&modal.__lpWebgl3dEngine;if(!engine||!toView)return 440;const fromRoll=Number.isFinite(Number(engine.roll))?Number(engine.roll):0;const delta=Math.abs(lpWebgl3dShortestAngleDelta(fromRoll,Number(toView.roll)||0));return Math.round(Math.max(LP_ROUTE_MAP_NAV_ROTATE_MIN_MS,Math.min(LP_ROUTE_MAP_NAV_ROTATE_MAX_MS,300+delta*2.1)));}catch(_){return 440;}}
function lpH1StudyRouteAnimDelay(anim,ms){const waitMs=Math.max(0,Number(ms)||0);return new Promise((resolve)=>{if(!anim||anim.cancelled)return resolve(false);const tid=window.setTimeout(()=>{try{if(anim&&Array.isArray(anim.timers)){const idx=anim.timers.indexOf(tid);if(idx>=0)anim.timers.splice(idx,1);}}catch(_){}
resolve(!(anim&&anim.cancelled));},waitMs);try{anim.timers.push(tid);}catch(_){}});}
function lpH1CoreAnimTrackRaf(anim,slotName,id){try{if(!anim||!Array.isArray(anim.rafs))return;const slots=anim.__rafSlots||(anim.__rafSlots={});const i=slots[slotName];if(i==null){slots[slotName]=anim.rafs.length;anim.rafs.push(id);}else{anim.rafs[i]=id;}}catch(_){}}
function lpH1StudyRouteAnimDrawPath(anim,pathEl,markerId,durationMs){if(!anim||anim.cancelled||!pathEl)return Promise.resolve(false);let total=0;try{total=Math.max(1,Number(pathEl.getTotalLength())||1);}catch(_){total=1;}
const svg=pathEl.ownerSVGElement||(pathEl.parentNode&&pathEl.parentNode.ownerSVGElement)||null;let movingArrow=null;try{if(svg){movingArrow=document.createElementNS('http://www.w3.org/2000/svg','path');movingArrow.classList.add('lp-h1sg-moving-arrow');movingArrow.setAttribute('d','M0 0 L13 5.6 L0 11.2 Z');movingArrow.setAttribute('fill','rgb(255,255,255)');movingArrow.setAttribute('stroke','rgb(255,255,255)');movingArrow.setAttribute('stroke-width','1.1');movingArrow.setAttribute('stroke-linejoin','round');movingArrow.setAttribute('opacity','0');svg.appendChild(movingArrow);}}catch(_){movingArrow=null;}
const removeMovingArrow=()=>{try{if(movingArrow&&movingArrow.parentNode)movingArrow.parentNode.removeChild(movingArrow);}catch(_){}
movingArrow=null;};let movingArrowShown=false;const updateMovingArrow=(t)=>{if(!movingArrow||!pathEl)return;try{const clamped=Math.max(0.035,Math.min(1,Number(t)||0));const at=pathEl.getPointAtLength(total*clamped);const ahead=pathEl.getPointAtLength(Math.min(total,total*clamped+Math.max(3,total*0.012)));const angle=Math.atan2(ahead.y-at.y,ahead.x-at.x)*180/Math.PI;if(!movingArrowShown){movingArrowShown=true;movingArrow.setAttribute('opacity','0.96');}
movingArrow.setAttribute('transform',`translate(${at.x.toFixed(2)} ${at.y.toFixed(2)}) rotate(${angle.toFixed(2)}) translate(-6.5 -5.6)`);}catch(_){}};let savedMask='';try{savedMask=pathEl.getAttribute('mask')||'';}catch(_){}
const restoreMask=()=>{try{if(savedMask)pathEl.setAttribute('mask',savedMask);}catch(_){}};try{pathEl.classList.remove('lp-is-hidden');pathEl.style.opacity='1';pathEl.style.strokeDasharray=`${total} ${total}`;pathEl.style.strokeDashoffset=String(total);pathEl.removeAttribute('marker-end');if(savedMask)pathEl.removeAttribute('mask');}catch(_){}
const duration=Math.max(120,Number(durationMs)||0);return new Promise((resolve)=>{const maxFrameMs=90;let last=performance.now();let elapsed=0;const step=(now)=>{if(!anim||anim.cancelled){removeMovingArrow();restoreMask();return resolve(false);}
elapsed+=Math.min(Math.max(0,now-last),maxFrameMs);last=now;const t=Math.max(0,Math.min(1,elapsed/duration));try{pathEl.style.strokeDashoffset=String(total*(1-t));}catch(_){}
updateMovingArrow(t);if(t>=1){try{pathEl.style.strokeDasharray='';pathEl.style.strokeDashoffset='0';if(markerId)pathEl.setAttribute('marker-end',`url(#${markerId})`);}catch(_){}
removeMovingArrow();restoreMask();return resolve(true);}
lpH1CoreAnimTrackRaf(anim,"draw",requestAnimationFrame(step));};lpH1CoreAnimTrackRaf(anim,"draw",requestAnimationFrame(step));});}
function lpH1StudyRouteAnimEnsureNavArrow(modal){try{const root=modal||lpRouteMapActiveModal();const stage=lpH1StudyStartStage(root);if(!root||!stage)return null;let arrow=root.querySelector('.lp-h1sg-nav-arrow');if(!arrow){arrow=document.createElement('div');arrow.className='lp-h1sg-nav-arrow is-hidden';arrow.setAttribute('aria-hidden','true');arrow.innerHTML=lpH1RouteMarkerSvg();stage.appendChild(arrow);}
arrow.style.left='50%';arrow.style.top='66%';return arrow;}catch(_){return null;}}
function lpH1StudyRouteAnimSetNavArrow(modal,visible){try{const root=modal||lpRouteMapActiveModal();if(lpWebgl3dRouteViewActive(root)){const oldArrow=root&&root.querySelector?root.querySelector('.lp-h1sg-nav-arrow'):null;if(oldArrow){oldArrow.classList.remove('is-visible');oldArrow.classList.add('is-hidden');}
return;}
const arrow=lpH1StudyRouteAnimEnsureNavArrow(root);if(!arrow)return;arrow.classList.toggle('is-visible',!!visible);arrow.classList.toggle('is-hidden',!visible);}catch(_){}}
function lpH1StudyRouteAnimRemoveNavArrow(modal){try{const root=modal||lpRouteMapActiveModal();const arrow=root&&root.querySelector?root.querySelector('.lp-h1sg-nav-arrow'):null;if(arrow&&arrow.parentNode)arrow.parentNode.removeChild(arrow);}catch(_){}}
function lpH1StudyStartLaunchSleep(ms){const waitMs=Math.max(0,Number(ms)||0);return new Promise((resolve)=>{window.setTimeout(resolve,waitMs);});}
function lpH1StudyStartLaunchCleanup(modal){const root=modal||lpRouteMapActiveModal();if(!root)return;const launchFx=root.__lpH1LaunchFx;if(launchFx&&typeof launchFx==='object'){launchFx.cancelled=true;try{if(launchFx.rafId)cancelAnimationFrame(launchFx.rafId);}catch(_){}
try{(Array.isArray(launchFx.timers)?launchFx.timers:[]).forEach((id)=>{try{clearTimeout(id);}catch(_){}});}catch(_){}
try{if(launchFx.overlay&&launchFx.overlay.parentNode)launchFx.overlay.parentNode.removeChild(launchFx.overlay);}catch(_){}}
root.__lpH1LaunchFx=null;root.__lpH1LaunchBusy=false;try{root.classList.remove('lp-h1sg-is-launching');}catch(_){}}
function lpH1StudyStartLaunchEase(t){const x=Math.max(0,Math.min(1,Number(t)||0));return 1-Math.pow(1-x,3);}
function lpH1StudyStartLaunchProjectPoint(point,pose){if(!point||!pose)return{x:0,y:0,scale:1,depth:0,yr:0};const zoom=Number(pose.zoom)||1;const pivotX=Number(pose.pivotX)||0;const pivotY=Number(pose.pivotY)||0;const dx0=(Number(point.x)-pivotX)*zoom;const dy0=(Number(point.y)-pivotY)*zoom;const rot=Number(pose.rot)||0;const cosR=Math.cos(rot);const sinR=Math.sin(rot);const xr=dx0*cosR-dy0*sinR;const yr=dx0*sinR+dy0*cosR;const tilt=Number(pose.tilt)||0;const y2=yr*Math.cos(tilt);const z2=yr*Math.sin(tilt);const persp=Math.max(0.38,Number(pose.perspective)||900);const k=persp/Math.max(120,persp-z2);return{x:(Number(pose.camX)||0)+xr*k,y:(Number(pose.camY)||0)+y2*k,scale:k,depth:z2,yr,};}
function lpH1StudyStartLaunchClipProjected(ax,ay,bx,by,hw,hh){const dx=Number(bx)-Number(ax);const dy=Number(by)-Number(ay);const len=Math.max(1e-6,Math.hypot(dx,dy));const ux=dx/len;const uy=dy/len;const rx=Math.max(8,Number(hw)||0);const ry=Math.max(8,Number(hh)||0);const tx=rx/Math.max(1e-6,Math.abs(ux));const ty=ry/Math.max(1e-6,Math.abs(uy));const reach=Math.min(tx,ty);const pad=2.5;const t=Math.max(0,reach-pad);return{x:Number(ax)+ux*t,y:Number(ay)+uy*t,};}
function lpH1StudyStartLaunchLinePath(p1,p2){if(!p1||!p2)return'';return`M ${Number(p1.x).toFixed(2)} ${Number(p1.y).toFixed(2)} L ${Number(p2.x).toFixed(2)} ${Number(p2.y).toFixed(2)}`;}
function lpH1StudyStartLaunchMakeArrowMarker(defsEl,id,fill){if(!defsEl||!id)return null;const svgNS='http://www.w3.org/2000/svg';const marker=document.createElementNS(svgNS,'marker');marker.setAttribute('id',id);marker.setAttribute('markerWidth','14');marker.setAttribute('markerHeight','14');marker.setAttribute('refX','12.2');marker.setAttribute('refY','7');marker.setAttribute('orient','auto');marker.setAttribute('markerUnits','userSpaceOnUse');const arrow=document.createElementNS(svgNS,'path');arrow.setAttribute('d','M0,1.3 L12.2,7 L0,12.7 Z');arrow.setAttribute('fill',fill||'rgba(255,255,255,.98)');arrow.setAttribute('fill-opacity','1');arrow.setAttribute('stroke',fill||'rgba(255,255,255,.98)');arrow.setAttribute('stroke-width','0.9');arrow.setAttribute('stroke-linejoin','round');marker.appendChild(arrow);defsEl.appendChild(marker);return marker;}
function lpH1StudyStartLaunchCloneNode(nodeEl){if(!nodeEl)return null;const clone=nodeEl.cloneNode(true);clone.classList.add('lp-h1sg-launch-node');clone.classList.remove('lp-route-anim-focus');try{clone.removeAttribute('id');}catch(_){}
try{clone.style.removeProperty('left');}catch(_){}
try{clone.style.removeProperty('top');}catch(_){}
try{clone.style.removeProperty('z-index');}catch(_){}
try{clone.style.removeProperty('--lp-h1sg-node-extra-scale');try{clone.style.removeProperty('--lp-route-pulse-scale');}catch(_){}}catch(_){}
clone.setAttribute('aria-hidden','true');return clone;}
function lpH1StudyStartLaunchMeasureNode(nodeEl){const rect=nodeEl&&nodeEl.getBoundingClientRect?nodeEl.getBoundingClientRect():null;return{width:Math.max(42,Math.round((rect&&rect.width)||Number(nodeEl&&nodeEl.offsetWidth)||0)||42),height:Math.max(24,Math.round((rect&&rect.height)||Number(nodeEl&&nodeEl.offsetHeight)||0)||24),};}
function lpH1StudyStartAngleNorm(a){const TAU=Math.PI*2;let out=Number(a)||0;out%=TAU;if(out<0)out+=TAU;return out;}
function lpH1StudyStartAngleDelta(from,to){let d=lpH1StudyStartAngleNorm(to)-lpH1StudyStartAngleNorm(from);if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;return d;}
function lpH1StudyStartResolveAngles(desiredAngles,minGap){const TAU=Math.PI*2;const desired=(desiredAngles||[]).map((a)=>lpH1StudyStartAngleNorm(a));const n=desired.length;if(!n)return[];if(n===1)return[desired[0]];const items=desired.map((ang,idx)=>({idx,desired:ang,ang})).sort((a,b)=>a.ang-b.ang);const gapMin=Math.max(0.16,Number(minGap)||0);for(let iter=0;iter<24;iter+=1){for(let k=0;k<items.length;k+=1){const cur=items[k];const next=items[(k+1)%items.length];let gap=next.ang-cur.ang;if(k===items.length-1)gap+=TAU;if(gap<gapMin){const push=(gapMin-gap)/2;cur.ang=lpH1StudyStartAngleNorm(cur.ang-push);next.ang=lpH1StudyStartAngleNorm(next.ang+push);}}
items.sort((a,b)=>a.ang-b.ang);for(const item of items){const drift=lpH1StudyStartAngleDelta(item.ang,item.desired);item.ang=lpH1StudyStartAngleNorm(item.ang+drift*0.18);}
items.sort((a,b)=>a.ang-b.ang);}
const out=new Array(n);for(const item of items)out[item.idx]=lpH1StudyStartAngleNorm(item.ang);return out;}
function lpH1StudyStartEstimateHostSize(modal){try{const stage=modal&&modal.querySelector?modal.querySelector('.lp-mapstage'):null;const stageRect=stage?stage.getBoundingClientRect():null;if(stageRect&&stageRect.width>40&&stageRect.height>40){return{hostW:Math.max(320,Math.floor(stageRect.width)),hostH:Math.max(420,Math.floor(stageRect.height)),};}}catch(_){}
const vw=Math.max(360,Number(window.innerWidth)||0);const vh=Math.max(560,Number(window.innerHeight)||0);const boxW=Math.max(320,Math.min(980,vw-32));const boxH=Math.max(520,Math.min(720,vh-32));return{hostW:Math.max(320,Math.floor(boxW-24)),hostH:Math.max(420,Math.floor(boxH-160)),};}
function lpH1StudyStartPrepCacheRoot(){if(!window.__lpH1StudyPrepCache){window.__lpH1StudyPrepCache={data:new Map(),promises:new Map()};}
return window.__lpH1StudyPrepCache;}
function lpH1StudyStartPrepBucket(hostW,hostH){const w=Math.max(320,Math.round((Number(hostW)||0)/80)*80);const h=Math.max(420,Math.round((Number(hostH)||0)/80)*80);return`${w}x${h}`;}
function lpRouteMapHideDirectionMenu(modal){const root=modal||lpRouteMapActiveModal();if(!root)return;const menu=root.querySelector('[data-lp-h1sg-dir-menu]');if(!menu)return;menu.hidden=true;}
function lpIsH1RoutePreSibling(node){if(!node||!node.matches)return false;return!!node.matches('#lp-course-lecture, .lp-course-lecture, .lp-top-why, .mw-anchor, #mw-mastery, #mw-mastery-compact');}
function lpFindH1RouteInsertAfter(inner,h1,bar){if(!inner||!h1)return h1||null;let target=h1;let cursor=h1.nextElementSibling;while(cursor){const next=cursor.nextElementSibling;if(cursor===bar||(cursor.matches&&cursor.matches('.lp-h1-routebar, [data-lp-h1-routebar]'))){cursor=next;continue;}
if(cursor.parentNode!==inner||!lpIsH1RoutePreSibling(cursor))break;target=cursor;cursor=next;}
return target;}
function lpPlaceH1RouteBar(inner,h1,bar){if(!inner||!h1||!bar)return;const insertAfter=lpFindH1RouteInsertAfter(inner,h1,bar);if(insertAfter&&insertAfter.parentNode===inner&&insertAfter.nextElementSibling!==bar){insertAfter.insertAdjacentElement('afterend',bar);}}
window.MkLP=Object.assign(window.MkLP||{},{LP_FOG_ENABLED_KEY,lpReadFogEnabled,lpWriteFogEnabled,lpFogEnabled,lpSetFogEnabled,LP_NAV_CTX_KEY,LP_NAV_CTX_TTL_MS,LP_RELATED_BODY_CACHE_KEY,LP_GPS_MODE_KEY,LP_GPS_ROUTE_KEY,LP_GPS_ROUTE_TTL_MS,LP_GPS_ROUTE_TICKET_KEY,LP_GPS_ROUTE_TICKET_TTL_MS,LP_MAP_ZOOM_DEFAULT,LP_MAP_ZOOM_MIN,LP_MAP_ZOOM_MAX,LP_MAP_ZOOM_MIN_PCT,LP_MAP_ZOOM_MAX_PCT,LP_MAP_MOBILE_VISUAL_SCALE,LP_ROUTE_MAP_MOBILE_DISTANCE_SCALE,LP_3D_MAP_ENABLED,LP_3D_LOCAL_ROT_X,LP_3D_LOCAL_ROT_Y,LP_3D_ROUTE_ROT_X,LP_3D_ROUTE_ROT_Y,LP_3D_ROT_X_MIN,LP_3D_ROT_X_MAX,LP_3D_ROT_Y_MIN,LP_3D_ROT_Y_MAX,LP_WEBGL3D_CAMERA,LP_MAP_VIEW_MODE_KEY,LP_3D_LOCAL_MAP_ITEM_ID,LP_3D_LOCAL_MAP_PRICE,LP_3D_LOCAL_MAP_NAME,LP_LOCAL_MAP_ANIM_ITEM_ID,LP_LOCAL_MAP_ANIM_PRICE,LP_LOCAL_MAP_ANIM_NAME,LP_KNOWLEDGE_MASKING_ITEM_ID,LP_KNOWLEDGE_MASKING_PRICE,LP_KNOWLEDGE_MASKING_NAME,LP_GUIDED_ROUTES_ITEM_ID,LP_GUIDED_ROUTES_PRICE,LP_GUIDED_ROUTES_NAME,lp3dShopApi,lpShopItemOwned,lp3dOwnsLocalMapItem,lpLocalMapAnimationsUnlocked,lpLocalMapAnimationsEnabled,lpSyncLocalMapAnimationAccess,lpGuidedRoutesUnlocked,lpCurrencyBalance,lpShowLockedHint,lp3dShowLockedHint,lpQueueXpActivity,lp3dMapViewMode,lp3dSetMapViewMode,lp3dMapEnabled,lp3dClampNumber,lp3dEnsureStyles,lp3dClearModal3D,lp3dUpdateViewToggle,lp3dDefaultRot,lp3dViewportTiltTransform,lp3dViewportTransform,lpWebgl3dEnabled,lpWebgl3dEnsureStyles,lpWebgl3dNodeColor,lpWebgl3dEdgeColor,lpWebgl3dParsePx,lpWebgl3dViewportSize,lpWebgl3dCompile,lpWebgl3dInitGl,lpWebgl3dRotatePoint,lpWebgl3dProjectBase,lpWebgl3dProjectWithScreenTransform,lpWebgl3dProject,lpWebgl3dNodeBaseFromElement,lpWebgl3dMixAngle,lpWebgl3dNodeIsHighlighted,lpWebgl3dAnyFocusKey,lpWebgl3dUploadArray,lpWebgl3dSvgNs,lpWebgl3dHash01,lpWebgl3dEnsureSvgOverlay,lpWebgl3dClearSvgOverlay,lpWebgl3dStartRelDash,lpWebgl3dCssColor,lpWebgl3dMakeArrowMarker,lpWebgl3dProjectedNodes,lpWebgl3dClipPillEdge,lpWebgl3dCurvedD,lpWebgl3dLocalEdgeType,lpWebgl3dAppendPath,lpWebgl3dPointOnPath,lpWebgl3dAppendFlowArrow,lpWebgl3dUpdateLabels,lpWheelDeltaYPixels,lpIsTrackpadPinchWheel,lpWheelZoomDecision,lpMotionReduced,lpGuestAccess,lpConsumeGuestAction,lpAnyMapModalOpen,lpStripTitleUiArtifacts,lpExtractRenderableTitleHtmlFromHeading,lpMasterySvg,lpMasteryIcon,lpMasteryLevelLabel,lpHasExplicitMastery,lpMaskUnknownTitle,lpShuffleInPlace,lpEnsureRevealSession,lpResetRevealSession,lpSharedRevealSet,lpSplitRevealTitle,lpBuildRevealUnits,lpRevealTextForState,lpRevealProgressForState,lpRevealIsComplete,lpRevealAdvanceOne,lpRevealStopTimer,lpShouldMaskNode,lpEnsureMapRedesignPatchStyles,lpEnsureAuxMapPatchStyles,lpUpdateZoomRangeVisual,lpHasMathMarkup,lpEnsureMathDelimiters,lpExtractMathTexFromNode,lpNodeTitleNeedsTypeset,lpSetNodeTitleMathPending,lpGpsClearRouteState,lpGpsNavigationType,LP_RELATED_KEYS,lpGpsLectureMapSync,lpGpsWeightedChoice,lpGpsEstimateLength,lpGpsNeedsWork,lpGpsModeLabel,lpGpsModeCopy,lpMapButtonSvg,lpGpsPlayButtonSvg,lpGpsShuffleButtonSvg,lpCompassButtonSvg,lpH1RouteTargetPinSvg,lpRenderKnowledgeGpsProgress,lpMountKnowledgeGpsEntryProgress,lpLocalMapSafeInsets,lpLocalMapPreferredTargetPoint,lpStripMathDelimiters,lpPrettyInlineMathText,lpKatexAvailable,lpKatexInlineMathHtml,lpLocalMapHideDirectionMenu,lpLocalMapShowDirectionMenu,lpEventPoint,lpFindStrictHitNode,lpNodeFromPoint,lpStrictNodeFromEvent,lpFindRelaxedTapNode,lpBestTapNodeFromEvent,lpTapDragThreshold,lpSelectionGuardAllowsTarget,lpSelectionGuardInteractiveTarget,lpInstallBlankLongPressSelectionGuard,lpMapDocSurfaceIsIOS,lpMapDocPx,lpMapDocScrollX,lpMapDocScrollY,lpMapDocClamp,lpMapDocSafeBottomPx,lpEnsureMapDocumentSurfaceStyle,lpExitMapDocumentSurface,lpSetFullscreenIcon,lpBindTap,lpReparentZoomGroup,LP_MOBILE_SHEET_STATE_KEY,LP_MOBILE_SHEET_NAV_KEY,LP_MOBILE_SHEET_LAST_PAGE_KEY,LP_MOBILE_PANEL_ANIM_MS,LP_MOBILE_PANEL_CLOSE_ARROW_LEAD_MS,lpGetMobileSheetState,lpSetMobileSheetState,lpClearMobileSheetAnimTimer,lpMobileSheetPanelSections,lpGetMobileSheetBody,lpGetMobileSheetHead,lpClearMobileSheetPanelInlineStyles,lpMeasureMobileSheetPanelSections,lpPrimeMobileSheetOpenAnimation,lpPrimeMobileSheetCloseAnimation,lpRunMobileSheetPanelAnimation,lpResetMobileSheetAnimClasses,lpSetMobileSheetExpandedImmediate,lpSetMobileSheetScrollGuards,lpStopMobileTapEvent,lpEventTimeNow,lpBindMobileTapAction,lpSetAccordionBodyHeight,lpToggleAccordionDetails,lpBindMobileSectionSummaryTaps,lpEnsurePanelSectionChevrons,lpInstallMobileSheetSelectionShield,lpSyncMobileSheetMotionPreference,lpSyncDesktopPanelShiftNow,lpH1RouteMarkerSvg,lpSplitInlineMathParts,lpSetPendingRouteTargetTitle,LP_ROUTE_MAP_MODE,LP_ROUTE_MAP_MAX_DISTANCE,LP_ROUTE_MAP_ANIM_START_FOCUS_HOLD_MS,LP_ROUTE_MAP_ANIM_STEP_FOCUS_HOLD_MS,LP_ROUTE_MAP_ANIM_NODE_READ_MIN_MS,LP_ROUTE_MAP_MASK_REVEAL_SETTLE_MS,LP_ROUTE_MAP_NAV_ANCHOR_Y,LP_ROUTE_MAP_NAV_ROTATE_MIN_MS,LP_ROUTE_MAP_NAV_ROTATE_MAX_MS,LP_ROUTE_MAP_NAV_TRAVEL_MIN_MS,LP_ROUTE_MAP_NAV_TRAVEL_MAX_MS,LP_ROUTE_MAP_OVERVIEW_MS,LP_ROUTE_MAP_OVERVIEW_PAD_X,LP_ROUTE_MAP_OVERVIEW_PAD_TOP,LP_ROUTE_MAP_OVERVIEW_PAD_BOTTOM,LP_ROUTE_MAP_OVERVIEW_MAX_SCALE,lpRouteMapMode,lpH1StudyRouteMaskText,lpMapTipsReposition,lpMapTipsCollapse,lpMapTipsToggle,lpRouteMapFollowsForward,lpRouteMapActiveModal,lpH1StudyStartNormQuery,lpH1StudyStartQueryTokens,lpH1StudyStartEscapeRegex,lpH1StudyStartViewport,lpH1StudyStartStage,lpH1StudyStartViewportBounds,lpH1StudyRouteAnimEase,lpWebgl3dRouteViewActive,lpWebgl3dRouteScreenPoint,lpWebgl3dShortestAngleDelta,lpWebgl3dRouteRotateDuration,lpH1StudyRouteAnimDelay,lpH1StudyRouteAnimDrawPath,lpH1StudyRouteAnimEnsureNavArrow,lpH1StudyRouteAnimSetNavArrow,lpH1StudyRouteAnimRemoveNavArrow,lpH1StudyStartLaunchSleep,lpH1StudyStartLaunchCleanup,lpH1StudyStartLaunchEase,lpH1StudyStartLaunchProjectPoint,lpH1StudyStartLaunchClipProjected,lpH1StudyStartLaunchLinePath,lpH1StudyStartLaunchMakeArrowMarker,lpH1StudyStartLaunchCloneNode,lpH1StudyStartLaunchMeasureNode,lpH1StudyStartAngleNorm,lpH1StudyStartAngleDelta,lpH1StudyStartResolveAngles,lpH1StudyStartEstimateHostSize,lpH1StudyStartPrepCacheRoot,lpH1StudyStartPrepBucket,lpRouteMapHideDirectionMenu,lpIsH1RoutePreSibling,lpFindH1RouteInsertAfter,lpPlaceH1RouteBar});})();