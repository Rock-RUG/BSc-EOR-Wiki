(function(){"use strict";const KATEX_CSS_ID="mk-katex-css";const KATEX_SCRIPT_ID="mk-katex-script";const AUTO_SCRIPT_ID="mk-katex-auto-render-script";const RUNTIME_STYLE_ID="mk-katex-runtime-style";function externalFallbackAllowed(){try{return window.__mkExamMode!==true;}catch(_){return false;}}
const CDN_BASE="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/";const KATEX_CSS_FALLBACK=CDN_BASE+"katex.min.css";const KATEX_JS_FALLBACK=CDN_BASE+"katex.min.js";const AUTO_JS_FALLBACK=CDN_BASE+"contrib/auto-render.min.js";function siteRootUrl(){try{const el=document.querySelector('link[href*="assets/stylesheets"]')||document.querySelector('script[src*="assets/javascripts"]');const href=el?el.getAttribute("href")||el.getAttribute("src")||"":"";const u=href?new URL(href,document.baseURI):new URL(document.baseURI);const idx=u.pathname.indexOf("/assets/");if(idx>=0)return new URL(u.pathname.slice(0,idx+1),u.origin).toString();return new URL("./",document.baseURI).toString();}catch(_){return"";}}
function localAsset(rel){try{const root=siteRootUrl();return root?new URL(rel,root).toString():"";}catch(_){return"";}}
const KATEX_CSS=localAsset("stylesheets/katex-vendor.css")||(externalFallbackAllowed()?KATEX_CSS_FALLBACK:"");const KATEX_JS=localAsset("javascripts/vendor/katex.min.js")||(externalFallbackAllowed()?KATEX_JS_FALLBACK:"");const AUTO_JS=localAsset("javascripts/vendor/katex-auto-render.min.js")||(externalFallbackAllowed()?AUTO_JS_FALLBACK:"");const MACROS_JS=localAsset("javascripts/vendor/katex-macros.js");const MACROS_SCRIPT_ID="mk-katex-macros";const DYNAMIC_ROOT_SELECTOR=[".md-search__output",".md-search-result",".md-search-result__list",".mk-search-suggest",".mk-search-suggest__panel",".mk-search-suggest__list",".csr-courseassist-dropdown","#course-search-results",".csr-wrap",".md-sidebar--primary",".md-sidebar--secondary","#lp-side-panel","#lp-mobile-sheet","#lp-map-modal","#lp-h1sg-modal",".lp-node",".lp-node-title",".lp-name",".lp-h1-route-target-text","#mw-mastery","#mw-mastery-compact",".mw-ready-popover","#mw-recap-popover","#search-results","#find-results",".fb-results"].join(",");let katexReadyPromise=null;let observerInstalled=false;let scheduled=false;const pendingRoots=new Set();function asArray(x){if(!x)return[];if(Array.isArray(x))return x.filter(Boolean);if(typeof NodeList!=="undefined"&&x instanceof NodeList)return Array.from(x).filter(Boolean);if(typeof HTMLCollection!=="undefined"&&x instanceof HTMLCollection)return Array.from(x).filter(Boolean);return[x].filter(Boolean);}
function ensureRuntimeStyle(){if(document.getElementById(RUNTIME_STYLE_ID))return;const st=document.createElement("style");st.id=RUNTIME_STYLE_ID;st.textContent=`
      .mk-search-suggest .katex,
      .md-search-result .katex,
      .csr-wrap .katex,
      .csr-courseassist-dropdown .katex,
      #search-results .katex,
      #course-search-results .katex,
      #lp-side-panel .katex,
      #lp-mobile-sheet .katex,
      #lp-map-modal .katex,
      #lp-h1sg-modal .katex,
      #mw-mastery .katex,
      #mw-mastery-compact .katex{
        display:inline-block !important;
        vertical-align:baseline !important;
        max-width:none !important;
        overflow:visible !important;
        line-height:1 !important;
      }
      .mk-search-suggest .katex-display,
      .md-search-result .katex-display,
      .csr-wrap .katex-display,
      #search-results .katex-display,
      #course-search-results .katex-display,
      #lp-side-panel .katex-display,
      #lp-map-modal .katex-display{
        display:inline-block !important;
        margin:0 .12em !important;
        text-align:left !important;
      }
      .mk-search-suggest .katex-html,
      .md-search-result .katex-html,
      .csr-wrap .katex-html,
      #lp-side-panel .katex-html,
      #lp-map-modal .katex-html{
        overflow:visible !important;
      }
      .mk-search-suggest .katex .base,
      .md-search-result .katex .base,
      .csr-wrap .katex .base,
      #lp-side-panel .katex .base,
      #lp-map-modal .katex .base{
        white-space:nowrap !important;
      }
    `;(document.head||document.documentElement).appendChild(st);}
function ensureCss(){try{if(!KATEX_CSS)return;if(document.getElementById(KATEX_CSS_ID))return;if(document.querySelector('link[rel="stylesheet"][href*="katex.min.css"],link[rel="stylesheet"][href*="katex-vendor.css"]'))return;const link=document.createElement("link");link.id=KATEX_CSS_ID;link.rel="stylesheet";link.href=KATEX_CSS;if(externalFallbackAllowed()&&KATEX_CSS!==KATEX_CSS_FALLBACK){link.addEventListener("error",()=>{link.href=KATEX_CSS_FALLBACK;},{once:true});}
(document.head||document.documentElement).appendChild(link);}catch(_){}}
function loadScriptOnce(id,src,testFn){return new Promise((resolve)=>{try{if(typeof testFn==="function"&&testFn())return resolve(true);let script=document.getElementById(id);if(script){if(typeof testFn==="function"&&testFn())return resolve(true);script.addEventListener("load",()=>resolve(true),{once:true});script.addEventListener("error",()=>resolve(false),{once:true});return;}
script=document.createElement("script");script.id=id;script.async=true;script.defer=true;script.src=src;script.onload=()=>resolve(true);script.onerror=()=>resolve(false);(document.head||document.documentElement).appendChild(script);}catch(_){resolve(false);}});}
function ensureKatex(){if(katexReadyPromise)return katexReadyPromise;ensureCss();ensureRuntimeStyle();katexReadyPromise=(async()=>{const haveKatex=()=>!!window.katex;const haveAuto=()=>typeof window.renderMathInElement==="function";if(KATEX_JS&&!(await loadScriptOnce(KATEX_SCRIPT_ID,KATEX_JS,haveKatex))&&externalFallbackAllowed()&&KATEX_JS!==KATEX_JS_FALLBACK){await loadScriptOnce(KATEX_SCRIPT_ID+"-cdn",KATEX_JS_FALLBACK,haveKatex);}
if(AUTO_JS&&!(await loadScriptOnce(AUTO_SCRIPT_ID,AUTO_JS,haveAuto))&&externalFallbackAllowed()&&AUTO_JS!==AUTO_JS_FALLBACK){await loadScriptOnce(AUTO_SCRIPT_ID+"-cdn",AUTO_JS_FALLBACK,haveAuto);}
if(MACROS_JS){await loadScriptOnce(MACROS_SCRIPT_ID,MACROS_JS,()=>!!window.MK_KATEX_MACROS);}
return!!(window.katex&&haveAuto());})();return katexReadyPromise;}
function hasMathText(root){try{if(!root)return false;const math=/\\\(|\\\)|\\\[|\\\]|\$\$|(^|[^\\])\$|\\begin\{|\\end\{|\\(?:frac|sum|prod|int|lim|infty|mathbb|mathcal|mathbf|boldsymbol|mathrm|operatorname|displaystyle|to|mapsto|colon|subseteq|geq|leq|alpha|beta|gamma|delta|epsilon|lambda|mu|sigma|theta|omega)\b/;const walker=document.createTreeWalker(root,4);let node;while((node=walker.nextNode())){const parent=node.parentElement;if(parent&&parent.closest('script,style,textarea,pre,code,option,.katex,.arithmatex-prerendered,.no-katex,.mk-no-runtime-math'))continue;if(math.test(node.nodeValue||''))return true;}
return false;}catch(_){return false;}}
function badRoot(root){try{return!!(!root||!root.querySelectorAll||(root.nodeType===1&&root.matches&&root.matches("script,style,textarea,pre,code,.katex,.katex *,.no-katex,.mk-no-runtime-math")));}catch(_){return true;}}
function renderRootNow(root){if(badRoot(root))return Promise.resolve();if(!hasMathText(root))return Promise.resolve();return ensureKatex().then((ok)=>{if(!ok||typeof window.renderMathInElement!=="function")return;try{window.renderMathInElement(root,{delimiters:[{left:"$$",right:"$$",display:true},{left:"\\[",right:"\\]",display:true},{left:"\\(",right:"\\)",display:false},{left:"$",right:"$",display:false}],throwOnError:false,strict:"ignore",trust:false,macros:Object.assign({},window.MK_KATEX_MACROS||{}),ignoredTags:["script","noscript","style","textarea","pre","code","option"],ignoredClasses:["katex","katex-display","katex-html","katex-mathml","arithmatex-prerendered","no-katex","mk-no-runtime-math","MathJax_Preview","MJX_LiveRegion","mjx-assistive-mml"]});try{root.classList&&root.classList.add("mk-katex-runtime-rendered");}catch(_){}}catch(_){}});}
function typesetPromise(elements){const roots=asArray(elements&&elements.length!==0?elements:document.body);return Promise.all(roots.map(renderRootNow)).then(()=>{roots.forEach(updateMathScrollAccess);});}
function updateMathScrollAccess(root){if(!root||!root.querySelectorAll)return;const blocks=Array.from(root.querySelectorAll('.arithmatex > .katex-display,.arithmatex-prerendered > .katex-display,.katex-display'));for(const block of blocks){const host=block.closest('.arithmatex')||block.closest('.arithmatex-prerendered')||block;const scrollable=host.scrollWidth>host.clientWidth+1;if(scrollable){if(!host.hasAttribute('tabindex')){host.tabIndex=0;host.setAttribute('data-mk-math-scroll','1');host.setAttribute('role','region');host.setAttribute('aria-label','Scrollable equation');}}else if(host.getAttribute('data-mk-math-scroll')==='1'){for(const attr of['tabindex','data-mk-math-scroll','role','aria-label'])host.removeAttribute(attr);}}}
let mathScrollFrame=0;function scheduleMathScrollAccess(){if(mathScrollFrame)return;mathScrollFrame=requestAnimationFrame(()=>{mathScrollFrame=0;updateMathScrollAccess(document);});}
window.addEventListener('resize',scheduleMathScrollAccess,{passive:true});window.addEventListener('hashchange',scheduleMathScrollAccess);window.addEventListener('DOMContentSwitch',scheduleMathScrollAccess);document.addEventListener('click',event=>{if(event.target&&event.target.closest&&event.target.closest('.rf-toggle,summary'))scheduleMathScrollAccess();});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleMathScrollAccess,{once:true});else scheduleMathScrollAccess();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(scheduleMathScrollAccess);function pickRenderRoot(node){try{if(!node||node.nodeType!==1)return null;if(node.matches&&node.matches(DYNAMIC_ROOT_SELECTOR))return node;if(node.closest){const close=node.closest(DYNAMIC_ROOT_SELECTOR);if(close)return close;}
return node;}catch(_){return node;}}
function flushScheduled(){scheduled=false;const roots=Array.from(pendingRoots).filter(Boolean);pendingRoots.clear();const seen=new Set();const unique=roots.filter((el)=>{if(!el||seen.has(el))return false;seen.add(el);return true;});if(unique.length)typesetPromise(unique).catch(()=>{});}
function scheduleRender(root){const arr=asArray(root||document.body);for(const r of arr){const target=pickRenderRoot(r&&r.querySelectorAll?r:document.body);if(target)pendingRoots.add(target);}
if(scheduled)return;scheduled=true;const cb=window.requestAnimationFrame||((fn)=>window.setTimeout(fn,16));cb(()=>window.setTimeout(flushScheduled,0));}
function installObserver(){if(observerInstalled)return;observerInstalled=true;try{const obs=new MutationObserver((mutations)=>{for(const m of mutations||[]){if(m.type==="childList"){for(const n of Array.from(m.addedNodes||[])){if(!n||n.nodeType!==1)continue;if(n.matches&&n.matches(".katex,.katex *,.katex-html,.katex-mathml"))continue;const relevant=!!((n.matches&&n.matches(DYNAMIC_ROOT_SELECTOR))||(n.querySelector&&n.querySelector(DYNAMIC_ROOT_SELECTOR))||(n.closest&&n.closest(DYNAMIC_ROOT_SELECTOR)));if(relevant){scheduleRender(n);return;}}}else if(m.type==="characterData"){const parent=m.target&&m.target.parentElement;if(parent&&parent.closest&&parent.closest(DYNAMIC_ROOT_SELECTOR)){scheduleRender(parent);return;}}}});const start=()=>{if(!document.body)return window.setTimeout(start,30);obs.observe(document.body,{subtree:true,childList:true,characterData:true});};start();}catch(_){}}
const startupPromise=Promise.resolve(true);window.__MATH_PRERENDERED__=true;window.__mkRuntimeMathTypeset=typesetPromise;window.__mkRenderDynamicMathAsync=typesetPromise;window.__mkRenderDynamicMath=function(root){return typesetPromise(asArray(root||document.body));};window.__mkRenderDynamicMathSoon=scheduleRender;window.__mkWarmMathRuntime=function(){try{return ensureKatex();}catch(_){return Promise.resolve(false);}};window.MathJax={startup:{promise:startupPromise},typesetPromise,typesetClear:function(){},tex:{inlineMath:[["$","$"],["\\(","\\)"]],displayMath:[["$$","$$"],["\\[","\\]"]],processEscapes:true}};installObserver();try{window.dispatchEvent(new CustomEvent("mk:math-runtime-ready"));}catch(_){}})();