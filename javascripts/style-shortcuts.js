(function(){if(window.__mkMotionToggleInstalledV22){try{if(window.MkSiteMotion&&typeof window.MkSiteMotion.refresh==='function'){window.MkSiteMotion.refresh();}}catch(_){}
return;}
window.__mkMotionToggleInstalledV22=true;const KEY='mk_site_motion_enabled_v1';const EVENT_NAMES=['mk:site-motion-change','mk:motionchange'];const STYLE_ID='mk-motion-toggle-style-v22';const WRAP_ID='mk-site-motion-toggle';const BTN_CLASS='mk-motion-btn';const TOOLTIP_ID='mk-site-motion-tooltip';const TOOLTIP_MEASURE_ID='mk-site-motion-tooltip-measure';const TOOLTIP_PROBE_ID='mk-site-motion-tooltip-probe';const TOOLTIP_GAP=6;const TOOLTIP_VIEWPORT_PAD=8;const USE_NATIVE_HEADER_TOOLTIP=true;let tooltipSnapshotCache=null;let tooltipSnapshotScheme="";const MAX_RETRIES=12;let retryTimer=null;let retryCount=0;let viewportTimer=null;let tapTipTimer=null;let tooltipRaf=0;let tooltipHideTimer=null;let tooltipAnchor=null;let tooltipMode='';let isPointerInside=false;let isFocusInside=false;cleanupLegacyArtifacts();function cleanupLegacyArtifacts(){const oldStyleIds=['mk-motion-toggle-style-v10','mk-motion-toggle-style-v11','mk-motion-toggle-style-v12','mk-motion-toggle-style-v13','mk-motion-toggle-style-v14','mk-motion-toggle-style-v15','mk-motion-toggle-style-v16','mk-motion-toggle-style-v17','mk-motion-toggle-style-v18','mk-motion-toggle-style-v20','mk-motion-toggle-style-v21','mk-site-motion-style-v1'];const oldNodeIds=['mk-site-motion-tooltip','mk-site-motion-tooltip-measure','mk-site-motion-tooltip-probe'];for(const id of oldStyleIds){const node=document.getElementById(id);if(node&&node.parentNode)node.parentNode.removeChild(node);}
for(const id of oldNodeIds){const node=document.getElementById(id);if(node&&node.parentNode)node.parentNode.removeChild(node);}}
function readUserEnabled(){try{const v=localStorage.getItem(KEY);return v!=='0';}catch(_){return true;}}
function writeUserEnabled(v){try{localStorage.setItem(KEY,v?'1':'0');}catch(_){}}
function systemReducedMotion(){try{return!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(_){return false;}}
function isEnabled(){return readUserEnabled()&&!systemReducedMotion();}
function isReduced(){return!isEnabled();}
function shouldUseTapFeedback(){try{if(!window.matchMedia)return false;return window.matchMedia('(hover: none), (pointer: coarse)').matches;}catch(_){return false;}}
function shouldUseHoverTooltip(){return!USE_NATIVE_HEADER_TOOLTIP;}
function accountFeatureEnabled(){try{return document.documentElement.getAttribute('data-mk-startup-account')!=='off'&&!document.documentElement.classList.contains('mk-startup-account-off');}catch(_){return true;}}
function selectMaterialPalette(input,inputs){if(!input)return;const scheme=input.getAttribute('data-md-color-scheme')||'default';const primary=input.getAttribute('data-md-color-primary')||'';const accent=input.getAttribute('data-md-color-accent')||'';try{if(!input.checked){input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));}}catch(_){}
try{if(typeof window.__md_set==='function'){window.__md_set('__palette',{index:inputs.indexOf(input),color:{media:input.getAttribute('data-md-color-media')||'',scheme,primary,accent}});}}catch(_){}
try{document.documentElement.setAttribute('data-mk-color-scheme',scheme);if(document.body){document.body.setAttribute('data-md-color-scheme',scheme);if(primary)document.body.setAttribute('data-md-color-primary',primary);if(accent)document.body.setAttribute('data-md-color-accent',accent);}}catch(_){}}
function clearAccountThemeState(){const root=document.documentElement;const attrs=['data-mk-theme-mode','data-mk-interface-theme','data-mk-image-interface-theme','data-mk-img-hdr-clip','data-mk-interface-theme-light','data-mk-interface-theme-dark'];const vars=['--mk-image-theme-header-image','--mk-image-theme-bg-image','--mk-theme-page-bg','--mk-theme-sidebar-bg','--mk-theme-sticky-floor','--mk-theme-sidebar-card-bg','--mk-theme-sidebar-card-bg-hover','--mk-theme-sidebar-border','--md-primary-fg-color','--md-accent-fg-color'];try{attrs.forEach((attr)=>root.removeAttribute(attr));}catch(_){}
try{vars.forEach((name)=>root.style.removeProperty(name));}catch(_){}}
function syncAccountOffPalette(){if(accountFeatureEnabled())return;try{clearAccountThemeState();const form=document.querySelector('form[data-md-component="palette"]');if(!form)return;const inputs=Array.from(form.querySelectorAll('input[name="__palette"]'));const light=inputs.find((input)=>input.getAttribute('data-md-color-scheme')==='default');const dark=inputs.find((input)=>input.getAttribute('data-md-color-scheme')==='slate');const custom=inputs.find((input)=>input.getAttribute('data-md-color-scheme')==='custom');if(!light||!dark)return;if(custom&&custom.checked)selectMaterialPalette(light,inputs);const selected=dark.checked?dark:light;selectMaterialPalette(selected,inputs);const darkLabel=dark.nextElementSibling;const customLabel=custom&&custom.nextElementSibling;if(darkLabel&&darkLabel.tagName==='LABEL'){darkLabel.htmlFor=light.id;darkLabel.setAttribute('title','Switch to light mode');darkLabel.setAttribute('aria-label','Switch to light mode');if(customLabel&&customLabel.tagName==='LABEL')darkLabel.innerHTML=customLabel.innerHTML;}
if(!form.dataset.mkAccountPaletteBound){form.dataset.mkAccountPaletteBound='1';form.addEventListener('change',(event)=>{if(accountFeatureEnabled())return;const input=event.target;if(!input||input.name!=='__palette')return;if(input.getAttribute('data-md-color-scheme')==='custom'){selectMaterialPalette(light,inputs);return;}
clearAccountThemeState();selectMaterialPalette(input,inputs);});}}catch(_){}}
function applyHtmlClass(){const html=document.documentElement;if(!html)return;const enabled=isEnabled();const userEnabled=readUserEnabled();const systemReduced=systemReducedMotion();html.classList.toggle('mk-site-motion-on',enabled);html.classList.toggle('mk-site-motion-off',!enabled);html.classList.toggle('mk-motion-on',enabled);html.classList.toggle('mk-motion-off',!enabled);try{html.setAttribute('data-mk-site-motion',enabled?'on':'off');html.setAttribute('data-mk-site-motion-user',userEnabled?'on':'off');html.setAttribute('data-mk-site-motion-system',systemReduced?'reduce':'no-preference');}catch(_){}}
function emitChange(){const detail={enabled:isEnabled(),userEnabled:readUserEnabled(),systemReduced:systemReducedMotion()};for(const name of EVENT_NAMES){try{window.dispatchEvent(new CustomEvent(name,{detail}));}catch(_){}}}
function clothesIcon(){return'<svg class="mk-exact-clothes-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/><path d="M6 14.5c2.2 0 2.8-1.5 6-1.5s3.8 1.5 6 1.5"/><path d="M6 18c2.2 0 2.8-1.5 6-1.5s3.8 1.5 6 1.5"/></svg>';}
function ensureStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
      html:not(.mk-startup-account-off) form[data-md-component="palette"]{
        display:none !important;
      }
      html.mk-startup-account-off #${WRAP_ID}{
        display:none !important;
      }
      #${WRAP_ID}.md-header__option {
        display:flex;
        align-items:center;
        justify-content:center;
        margin-left:0;
        margin-right:0.3rem;
        transform:none;
        flex:0 0 auto;
        position:relative;
        visibility:hidden;
      }
      #${WRAP_ID}.md-header__option.is-ready{
        visibility:visible;
      }
      #${WRAP_ID} .${BTN_CLASS}{
        position:relative;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:2.2rem;
        height:2.2rem;
        min-width:2.2rem;
        min-height:2.2rem;
        margin:0;
        padding:0;
        border:0;
        border-radius:0 !important;
        background:transparent !important;
        color:#ffffff;
        cursor:pointer;
        opacity:1;
        font:inherit;
        font-family:var(--md-text-font-family, inherit);
        line-height:1;
        box-shadow:none !important;
        outline:none !important;
        -webkit-tap-highlight-color:transparent;
        transition:color 120ms ease, opacity 120ms ease;
      }
      #${WRAP_ID}.is-off .${BTN_CLASS}{
        color:rgba(255,255,255,.88);
        opacity:1;
      }
      #${WRAP_ID}.is-system-off .${BTN_CLASS}{
        color:rgba(255,255,255,.74);
        opacity:1;
      }
      #${WRAP_ID} .${BTN_CLASS}:hover,
      #${WRAP_ID} .${BTN_CLASS}:focus,
      #${WRAP_ID} .${BTN_CLASS}:focus-visible,
      #${WRAP_ID} .${BTN_CLASS}:active{
        background:transparent !important;
        border:0 !important;
        border-radius:0 !important;
        box-shadow:none !important;
        outline:none !important;
        color:rgba(255,255,255,.72);
      }
      #${WRAP_ID} .${BTN_CLASS}::-moz-focus-inner{
        border:0;
      }
      #${WRAP_ID} .${BTN_CLASS} svg{
        display:block;
        width:1.05rem;
        height:1.05rem;
        pointer-events:none;
      }

      #${TOOLTIP_ID},
      #${TOOLTIP_MEASURE_ID},
      #${TOOLTIP_PROBE_ID}{
        box-sizing:border-box;
        display:block;
        width:max-content;
        max-width:calc(100vw - 16px);
        margin:0;
        white-space:nowrap;
        pointer-events:none;
        -webkit-font-smoothing:antialiased;
        text-rendering:optimizeLegibility;
        font-family:var(--md-text-font-family, inherit);
        font-size:11px;
        font-weight:600;
        line-height:1.2;
        letter-spacing:0;
        text-transform:none;
        text-align:center;
        padding:5px 10px;
        border-radius:4px;
        min-height:0;
      }

      html[data-md-color-scheme="default"] #${TOOLTIP_ID},
      html[data-md-color-scheme="default"] #${TOOLTIP_MEASURE_ID},
      body[data-md-color-scheme="default"] #${TOOLTIP_ID},
      body[data-md-color-scheme="default"] #${TOOLTIP_MEASURE_ID}{
        background:#ffffff;
        color:rgba(0,0,0,.92);
        border:1px solid rgba(0,0,0,.12);
        box-shadow:0 3px 12px rgba(0,0,0,.18);
      }
      html[data-md-color-scheme="slate"] #${TOOLTIP_ID},
      html[data-md-color-scheme="slate"] #${TOOLTIP_MEASURE_ID},
      body[data-md-color-scheme="slate"] #${TOOLTIP_ID},
      body[data-md-color-scheme="slate"] #${TOOLTIP_MEASURE_ID}{
        background:#121418;
        color:rgba(255,255,255,.96);
        border:1px solid rgba(255,255,255,.10);
        box-shadow:0 3px 14px rgba(0,0,0,.42);
      }

      #${TOOLTIP_ID}{
        position:fixed;
        left:-9999px;
        top:-9999px;
        opacity:0;
        visibility:hidden;
        transform:translate(-50%, -2px);
        transition:opacity 90ms ease, transform 90ms ease, visibility 0s linear 90ms;
        z-index:10001;
      }
      #${TOOLTIP_ID}.is-visible{
        opacity:1;
        visibility:visible;
        transform:translate(-50%, 0);
        transition:opacity 90ms ease, transform 90ms ease, visibility 0s linear 0s;
      }
      #${TOOLTIP_MEASURE_ID},
      #${TOOLTIP_PROBE_ID}{
        position:fixed !important;
        left:-10000px !important;
        top:-10000px !important;
        opacity:0 !important;
        visibility:hidden !important;
        z-index:-1 !important;
      }
      #${TOOLTIP_PROBE_ID}.mk-tooltip-probe-live::before,
      #${TOOLTIP_PROBE_ID}.mk-tooltip-probe-live::after{
        opacity:1 !important;
        visibility:visible !important;
        transform:none !important;
      }

      @media screen and (max-width: 76.1875em) {
        #${WRAP_ID}.md-header__option {
          margin-right:0.22rem;
        }
        #${WRAP_ID} .${BTN_CLASS}{
          width:2rem;
          min-width:2rem;
          height:2rem;
          min-height:2rem;
        }
      }
    `;(document.head||document.documentElement).appendChild(st);}
function getHeaderOptions(){return document.querySelector('.md-header .md-header__options')||null;}
function getPaletteAnchor(){const selectors=['.md-header label[for="__palette"]','.md-header .md-header__button[for="__palette"]','.md-header [data-md-component="palette"]'];for(const selector of selectors){const el=document.querySelector(selector);if(!el)continue;const opt=el.closest&&el.closest('.md-header__option');if(opt)return opt;return el;}
return null;}
function getSearchAnchor(){const selectors=['.md-header label[for="__search"]','.md-header .md-header__button[for="__search"]','.md-header [data-md-component="search"] label[for="__search"]','.md-header [data-md-component="search"]','.md-header .md-search'];for(const selector of selectors){const el=document.querySelector(selector);if(!el)continue;const opt=el.closest&&el.closest('.md-header__option');if(opt)return opt;return el;}
return null;}
function getPlacement(){const wrap=document.getElementById(WRAP_ID);const headerOptions=getHeaderOptions();const paletteAnchor=getPaletteAnchor();const searchAnchor=getSearchAnchor();const headerInner=document.querySelector('.md-header__inner')||document.querySelector('.md-header');if(headerOptions){if(searchAnchor&&searchAnchor!==wrap&&searchAnchor.parentNode===headerOptions){return{parent:headerOptions,before:searchAnchor};}
if(paletteAnchor&&paletteAnchor!==wrap&&paletteAnchor.parentNode===headerOptions){return{parent:headerOptions,before:paletteAnchor.nextSibling};}
return{parent:headerOptions,before:null};}
if(searchAnchor&&searchAnchor.parentNode){return{parent:searchAnchor.parentNode,before:searchAnchor};}
if(paletteAnchor&&paletteAnchor.parentNode){return{parent:paletteAnchor.parentNode,before:paletteAnchor.nextSibling};}
if(headerInner){return{parent:headerInner,before:null};}
return null;}
function placeWrap(wrap){const placement=getPlacement();if(!placement||!placement.parent||!wrap)return false;const parent=placement.parent;const before=placement.before&&placement.before!==wrap?placement.before:null;if(wrap.parentNode!==parent){parent.insertBefore(wrap,before);return true;}
if(before&&wrap.nextSibling!==before){parent.insertBefore(wrap,before);return true;}
if(!before&&wrap!==parent.lastChild){parent.appendChild(wrap);return true;}
return true;}
function getTitle(enabled){return'Style shortcuts';}
function getShortTitle(enabled){return'Styles';}
function ensureTooltipNodes(){let tip=document.getElementById(TOOLTIP_ID);if(!tip){tip=document.createElement('div');tip.id=TOOLTIP_ID;tip.setAttribute('aria-hidden','true');document.body.appendChild(tip);}
let measure=document.getElementById(TOOLTIP_MEASURE_ID);if(!measure){measure=document.createElement('div');measure.id=TOOLTIP_MEASURE_ID;measure.setAttribute('aria-hidden','true');document.body.appendChild(measure);}
let probe=document.getElementById(TOOLTIP_PROBE_ID);if(!probe){probe=document.createElement('div');probe.id=TOOLTIP_PROBE_ID;probe.setAttribute('aria-hidden','true');document.body.appendChild(probe);}
return{tip,measure,probe};}
function parseRgbColor(v){const m=String(v||'').match(/rgba?\(([^)]+)\)/i);if(!m)return null;const parts=m[1].split(',').map(function(x){return parseFloat(x.trim());});if(parts.length<3||parts.slice(0,3).some(function(n){return!Number.isFinite(n);}))return null;return{r:parts[0],g:parts[1],b:parts[2],a:Number.isFinite(parts[3])?parts[3]:1};}
function relativeLuminance(rgb){if(!rgb)return null;function channel(v){const c=Math.max(0,Math.min(255,v))/255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
return 0.2126*channel(rgb.r)+0.7152*channel(rgb.g)+0.0722*channel(rgb.b);}
function isDarkThemeActive(){const html=document.documentElement;const body=document.body;const explicit=[html&&html.getAttribute('data-md-color-scheme'),body&&body.getAttribute('data-md-color-scheme')].filter(Boolean).map(function(v){return String(v).toLowerCase();});if(explicit.includes('slate'))return true;if(explicit.includes('default'))return false;const refs=[html,body,document.querySelector('.md-header'),document.querySelector('.md-container')].filter(Boolean);for(const ref of refs){try{const cs=window.getComputedStyle(ref);const scheme=String(cs.colorScheme||'').toLowerCase();if(scheme.includes('dark'))return true;if(scheme.includes('light'))return false;}catch(_){}}
for(const ref of refs){try{const cs=window.getComputedStyle(ref);const rgb=parseRgbColor(cs.backgroundColor);if(!rgb||rgb.a<0.55)continue;const lum=relativeLuminance(rgb);if(lum==null)continue;return lum<0.42;}catch(_){}}
try{if(window.matchMedia)return!!window.matchMedia('(prefers-color-scheme: dark)').matches;}catch(_){}
return false;}
function getSchemeKey(){return isDarkThemeActive()?'slate':'default';}
function captureTooltipSnapshot(){const scheme=getSchemeKey();tooltipSnapshotCache=null;tooltipSnapshotScheme=scheme;return null;}
function applyFallbackTooltipTheme(el){if(!el)return;const dark=isDarkThemeActive();el.style.backgroundImage='none';el.style.backgroundColor=dark?'#121418':'#ffffff';el.style.color=dark?'rgba(255,255,255,.72)':'rgba(0,0,0,.94)';el.style.boxShadow=dark?'0 3px 14px rgba(0,0,0,.42)':'0 3px 12px rgba(0,0,0,.18)';el.style.border=dark?'1px solid rgba(255,255,255,.10)':'1px solid rgba(0,0,0,.12)';el.style.borderRadius='4px';el.style.padding='5px 9px';el.style.fontFamily='var(--md-text-font-family, inherit)';el.style.fontSize='11px';el.style.fontWeight='600';el.style.fontStyle='normal';el.style.lineHeight='1.2';el.style.letterSpacing='0';el.style.textTransform='none';el.style.textAlign='center';el.style.minHeight='0';el.style.whiteSpace='nowrap';}
function applyTooltipSnapshot(el,snapshot){if(!el)return;el.style.display='block';applyFallbackTooltipTheme(el);}
function getTooltipText(anchor,mode,explicitText){if(explicitText)return explicitText;if(!anchor)return'';if(mode==='tap')return anchor.getAttribute('data-motion-tip-short')||anchor.getAttribute('data-motion-tip')||'';return anchor.getAttribute('data-motion-tip')||'';}
function syncTooltipPosition(anchor,text){const{tip,measure}=ensureTooltipNodes();const snapshot=captureTooltipSnapshot();applyTooltipSnapshot(tip,snapshot);applyTooltipSnapshot(measure,snapshot);tip.textContent=text||'';measure.textContent=text||'';const rect=anchor&&anchor.getBoundingClientRect?anchor.getBoundingClientRect():null;if(!rect)return;const measureRect=measure.getBoundingClientRect();const width=Math.ceil(measureRect.width||0);const height=Math.ceil(measureRect.height||0);const minX=TOOLTIP_VIEWPORT_PAD+width/2;const maxX=window.innerWidth-TOOLTIP_VIEWPORT_PAD-width/2;let x=rect.left+rect.width/2;if(Number.isFinite(minX)&&Number.isFinite(maxX)){if(minX<=maxX)x=Math.max(minX,Math.min(maxX,x));else x=window.innerWidth/2;}
let y=rect.bottom+TOOLTIP_GAP;if(y+height+TOOLTIP_VIEWPORT_PAD>window.innerHeight){y=Math.max(TOOLTIP_VIEWPORT_PAD,rect.top-TOOLTIP_GAP-height);}
tip.style.left=`${Math.round(x)}px`;tip.style.top=`${Math.round(y)}px`;}
function requestTooltipSync(anchor,text){if(tooltipRaf)cancelAnimationFrame(tooltipRaf);tooltipRaf=requestAnimationFrame(function(){tooltipRaf=0;syncTooltipPosition(anchor,text);});}
function hideTooltip(immediate){const tip=document.getElementById(TOOLTIP_ID);tooltipAnchor=null;tooltipMode='';if(tooltipHideTimer){clearTimeout(tooltipHideTimer);tooltipHideTimer=null;}
if(tooltipRaf){cancelAnimationFrame(tooltipRaf);tooltipRaf=0;}
if(!tip)return;tip.classList.remove('is-visible');if(immediate){tip.style.left='-9999px';tip.style.top='-9999px';}}
function hideTooltipSoon(){if(tooltipHideTimer)clearTimeout(tooltipHideTimer);tooltipHideTimer=setTimeout(function(){tooltipHideTimer=null;if(!isPointerInside&&!isFocusInside)hideTooltip(false);},40);}
function showTooltip(anchor,mode,explicitText){if(!anchor)return;const text=getTooltipText(anchor,mode,explicitText);if(!text)return;ensureTooltipNodes();if(tooltipHideTimer){clearTimeout(tooltipHideTimer);tooltipHideTimer=null;}
tooltipAnchor=anchor;tooltipMode=mode||'hover';requestTooltipSync(anchor,text);const tip=document.getElementById(TOOLTIP_ID);if(!tip)return;tip.classList.add('is-visible');}
function getSharedTooltipText(anchor){if(!anchor||!anchor.getAttribute)return'';return anchor.getAttribute('data-mk-header-tooltip')||anchor.getAttribute('aria-label')||'';}
function ensureSharedHeaderTooltipEvents(){if(window.__mkSharedHeaderTooltipEventsV1)return;window.__mkSharedHeaderTooltipEventsV1=true;document.addEventListener('pointerover',function(event){const target=event.target&&event.target.closest?event.target.closest('[data-mk-header-tooltip]'):null;if(event.pointerType==='touch')return;if(!target)return;const text=getSharedTooltipText(target);if(!text)return;isPointerInside=true;showTooltip(target,'hover',text);},true);document.addEventListener('pointerout',function(event){const target=event.target&&event.target.closest?event.target.closest('[data-mk-header-tooltip]'):null;if(!target)return;if(event.relatedTarget&&target.contains&&target.contains(event.relatedTarget))return;isPointerInside=false;hideTooltipSoon();},true);document.addEventListener('focusin',function(event){const target=event.target&&event.target.closest?event.target.closest('[data-mk-header-tooltip]'):null;if(!target)return;const text=getSharedTooltipText(target);if(!text)return;isFocusInside=true;showTooltip(target,'focus',text);},true);document.addEventListener('focusout',function(event){const target=event.target&&event.target.closest?event.target.closest('[data-mk-header-tooltip]'):null;if(!target)return;isFocusInside=false;hideTooltipSoon();},true);}
function refreshVisibleTooltip(){if(!tooltipAnchor)return;const text=getTooltipText(tooltipAnchor,tooltipMode);if(!text){hideTooltip(true);return;}
requestTooltipSync(tooltipAnchor,text);}
function clearTapTip(){if(tapTipTimer){clearTimeout(tapTipTimer);tapTipTimer=null;}
const wrap=document.getElementById(WRAP_ID);if(wrap)wrap.classList.remove('show-tip');if(tooltipMode==='tap')hideTooltip(true);}
function showTapTip(){if(USE_NATIVE_HEADER_TOOLTIP)return;const wrap=document.getElementById(WRAP_ID);const btn=wrap?wrap.querySelector('button'):null;if(!wrap||!btn||!shouldUseTapFeedback())return;wrap.classList.add('show-tip');showTooltip(btn,'tap');if(tapTipTimer)clearTimeout(tapTipTimer);tapTipTimer=setTimeout(function(){const currentWrap=document.getElementById(WRAP_ID);if(currentWrap)currentWrap.classList.remove('show-tip');tapTipTimer=null;if(tooltipMode==='tap')hideTooltip(false);},1150);}
function onToggleClick(event){const btn=event&&event.currentTarget;const keyboardActivation=!!(event&&event.detail===0);try{if(event&&typeof event.preventDefault==='function')event.preventDefault();if(event&&typeof event.stopPropagation==='function')event.stopPropagation();}catch(_){}
try{if(window.MkLocalActivity&&typeof window.MkLocalActivity.openQuickShop==='function'){window.MkLocalActivity.openQuickShop(btn,{categories:['Interface themes','Header fonts','Body fonts'],title:'Style shortcuts',includeBaseThemes:true,focusOnOpen:keyboardActivation});}else{window.dispatchEvent(new CustomEvent('mk-open-quick-shop',{detail:{anchor:btn,categories:['Interface themes','Header fonts','Body fonts'],title:'Style shortcuts',includeBaseThemes:true,focusOnOpen:keyboardActivation}}));}}catch(_){}
updateButton();showTapTip();if(!keyboardActivation&&btn&&typeof btn.blur==='function'){setTimeout(function(){btn.blur();},0);}
setTimeout(function(){updateButton();},0);}
function bindButtonInteractions(btn){if(!btn||btn.dataset.mkMotionBound==='1')return;btn.dataset.mkMotionBound='1';btn.addEventListener('click',onToggleClick);btn.addEventListener('mouseenter',function(){if(!shouldUseHoverTooltip())return;isPointerInside=true;showTooltip(btn,'hover');});btn.addEventListener('mouseleave',function(){isPointerInside=false;hideTooltipSoon();});btn.addEventListener('focus',function(){isFocusInside=true;if(USE_NATIVE_HEADER_TOOLTIP)return;showTooltip(btn,'focus');});btn.addEventListener('blur',function(){isFocusInside=false;hideTooltipSoon();});}
function ensureButton(){ensureStyles();if(!USE_NATIVE_HEADER_TOOLTIP)ensureTooltipNodes();let wrap=document.getElementById(WRAP_ID);if(!wrap){wrap=document.createElement('div');wrap.id=WRAP_ID;wrap.className='md-header__option';}
if(!placeWrap(wrap))return false;let btn=wrap.querySelector('button');if(!btn){btn=document.createElement('button');btn.type='button';btn.className=`md-header__button md-icon ${BTN_CLASS}`;btn.setAttribute('aria-controls','mk-quick-shop-menu');btn.setAttribute('aria-expanded','false');wrap.appendChild(btn);}
bindButtonInteractions(btn);updateButton();return true;}
window.MkStyleClothesIcon=clothesIcon;function updateButton(){const wrap=document.getElementById(WRAP_ID);if(!wrap)return;const btn=wrap.querySelector('button');if(!btn)return;const enabled=isEnabled();const sysReduced=systemReducedMotion();const title=getTitle(enabled);const shortTitle=getShortTitle(enabled);const nextState='styles';if(btn.getAttribute('data-motion-state')!==nextState){btn.innerHTML=clothesIcon();btn.setAttribute('data-motion-state',nextState);}
btn.setAttribute('aria-label',title);btn.setAttribute('data-motion-tip',title);btn.setAttribute('data-motion-tip-short',shortTitle);btn.setAttribute('title',title);wrap.classList.remove('is-off','is-system-off');wrap.classList.add('is-ready');if(tooltipAnchor===btn)refreshVisibleTooltip();}
function clearRetry(){if(retryTimer){clearTimeout(retryTimer);retryTimer=null;}}
function scheduleRetry(){clearRetry();if(retryCount>=MAX_RETRIES)return;retryCount+=1;retryTimer=setTimeout(function(){retryTimer=null;mount(false);},250);}
function mount(resetRetries){if(resetRetries!==false)retryCount=0;applyHtmlClass();const ok=ensureButton();syncAccountOffPalette();if(!ok)scheduleRetry();else clearRetry();refreshVisibleTooltip();}
function refresh(){tooltipSnapshotCache=null;tooltipSnapshotScheme='';clearTapTip();applyHtmlClass();ensureButton();syncAccountOffPalette();updateButton();emitChange();}
function scheduleViewportRefresh(){tooltipSnapshotCache=null;tooltipSnapshotScheme='';if(viewportTimer)clearTimeout(viewportTimer);viewportTimer=setTimeout(function(){viewportTimer=null;refreshVisibleTooltip();mount(false);},60);}
window.MkSiteMotion={isEnabled,isReduced,readUserEnabled,getState(){return{enabled:isEnabled(),userEnabled:readUserEnabled(),systemReduced:systemReducedMotion()};},setEnabled(v){writeUserEnabled(!!v);refresh();},mount,refresh};window.MkHeaderTooltip={show(anchor,text){if(anchor)showTooltip(anchor,'hover',text);},hide(immediate){hideTooltip(immediate!==false);},refresh:refreshVisibleTooltip};ensureSharedHeaderTooltipEvents();try{const mq=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;if(mq){const handler=function(){refresh();};if(typeof mq.addEventListener==='function')mq.addEventListener('change',handler);else if(typeof mq.addListener==='function')mq.addListener(handler);}}catch(_){}
function init(){mount(true);requestAnimationFrame(function(){mount(false);});}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init,{once:true});}else{init();}
window.addEventListener('load',function(){mount(true);},{passive:true});window.addEventListener('pageshow',function(){mount(true);},{passive:true});window.addEventListener('resize',function(){clearTapTip();scheduleViewportRefresh();},{passive:true});window.addEventListener('orientationchange',function(){clearTapTip();scheduleViewportRefresh();},{passive:true});window.addEventListener('scroll',function(){if(tooltipAnchor)refreshVisibleTooltip();},{passive:true,capture:true});document.addEventListener('visibilitychange',function(){if(document.hidden)hideTooltip(true);});document.addEventListener('DOMContentSwitch',function(){hideTooltip(true);mount(true);});})();