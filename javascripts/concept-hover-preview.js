(function(){"use strict";const BUILD="mk-concept-hover-preview-v23";if(window.__mkConceptHoverPreviewBuild===BUILD){try{window.MkConceptHoverPreview&&window.MkConceptHoverPreview.refresh&&window.MkConceptHoverPreview.refresh();}catch(_){}
return;}
window.__mkConceptHoverPreviewBuild=BUILD;const STYLE_ID="mk-concept-hover-preview-style-v19";const POPUP_ID="mk-concept-hover-preview";const ENTER_DELAY_MS=70;const LEAVE_DELAY_MS=84;const LOADING_SWAP_DELAY_MS=45;const MAX_WIDTH=332;const MAX_BODY_BLOCKS=4;const MIN_WIDTH=280;const VIEWPORT_PAD=12;const POPUP_GAP=12;const PIN_SIZE=0;const MATH_RUNTIME_WAIT_MS=1600;const MATH_RETRY_DELAY_MS=120;const MATH_MAX_ATTEMPTS=3;const MOBILE_QUERY="(hover: hover) and (pointer: fine)";const MAX_SPECULATIVE_INFLIGHT=2;const SPECULATIVE_QUEUE_MAX=6;const PREVIEW_CACHE_MAX=60;const SCROLL_QUIET_MS=220;const DEMAND_FETCH_TIMEOUT_MS=8000;const SPECULATIVE_FETCH_TIMEOUT_MS=15000;const FEATURE_DEFER_MS=600;const EXCLUDE_BASE=new Set(["index","about","find","random","custom-random","trending","contributors","search","tags"]);const ACCENT_COLOR="rgba(92, 132, 255, .96)";const KEYWORD_ORDER=["definition","theorem","proposition","lemma","corollary","axiom","remark","example"];const state={activeAnchor:null,popup:null,enterTimer:0,leaveTimer:0,moveRaf:0,scrollRaf:0,currentAbsUrl:"",currentRelUrl:"",currentTitle:"",currentKind:"",currentAnchorRect:null,currentPlacement:"right",hoverAnchor:null,hoverAbsUrl:"",hoverPopup:false,pendingAnchor:null,pendingAbsUrl:"",requestSeq:0,loadingDelayTimer:0,bound:false,mouseDown:false,mo:null,animationSeq:0,lastPointerX:NaN,lastPointerY:NaN,lastScrollAt:-1e9,scrollBurstActive:false,scrollSettleTimer:0,deferredIntent:null,demandEntry:null,mathWarmed:false};const previewCache=new Map();const speculativeQueue=[];let inflightCount=0;function nowMs(){try{return(window.performance&&typeof performance.now==="function")?performance.now():Date.now();}catch(_){return Date.now();}}
function scrollIsActive(){return(nowMs()-state.lastScrollAt)<SCROLL_QUIET_MS;}
function pointerActuallyMoved(ev){const x=ev&&Number.isFinite(ev.clientX)?ev.clientX:NaN;const y=ev&&Number.isFinite(ev.clientY)?ev.clientY:NaN;if(!Number.isFinite(x)||!Number.isFinite(y))return true;const known=Number.isFinite(state.lastPointerX)&&Number.isFinite(state.lastPointerY);const moved=!known||x!==state.lastPointerX||y!==state.lastPointerY;state.lastPointerX=x;state.lastPointerY=y;return moved;}
function eventReportsPhysicalMovement(ev){const dx=ev&&Number.isFinite(ev.movementX)?ev.movementX:0;const dy=ev&&Number.isFinite(ev.movementY)?ev.movementY:0;return dx!==0||dy!==0;}
function warmMathRuntime(immediate){if(state.mathWarmed)return;state.mathWarmed=true;const warm=window.__mkWarmMathRuntime;if(typeof warm!=="function")return;const run=()=>{try{warm();}catch(_){}};if(immediate){run();return;}
try{if(typeof window.requestIdleCallback==="function")window.requestIdleCallback(run,{timeout:600});else window.setTimeout(run,0);}catch(_){run();}}
function deferFeatureLoads(){const mark=window.__mkMarkInteractionBusy;if(typeof mark!=="function")return;try{mark(FEATURE_DEFER_MS);}catch(_){}}
function clearDeferredIntent(){state.deferredIntent=null;}
function rememberDeferredIntent(info){if(!info||!info.anchor||!info.absUrl)return;state.deferredIntent={anchor:info.anchor,absUrl:info.absUrl,relUrl:info.relUrl};deferFeatureLoads();}
function resumeDeferredIntent(){const info=state.deferredIntent;clearDeferredIntent();if(!info||state.mouseDown||!canUseHoverPreview())return;if(!document.contains(info.anchor))return;if(!Number.isFinite(state.lastPointerX)||!Number.isFinite(state.lastPointerY))return;let target=null;try{target=document.elementFromPoint(state.lastPointerX,state.lastPointerY);}catch(_){}
const current=qualifyAnchor(target);if(!current||current.anchor!==info.anchor||current.absUrl!==info.absUrl)return;state.hoverAnchor=current.anchor;state.hoverAbsUrl=current.absUrl;deferFeatureLoads();prefetch(current.absUrl);schedulePreview(current,{switchOnly:false});}
function onScrollActivity(ev){if(ev&&isInsidePopup(ev.target))return;if(ev&&ev.type==="wheel"&&Number.isFinite(ev.clientX)&&Number.isFinite(ev.clientY)){state.lastPointerX=ev.clientX;state.lastPointerY=ev.clientY;}
state.lastScrollAt=nowMs();if(!state.scrollBurstActive){state.scrollBurstActive=true;clearDeferredIntent();if(state.activeAnchor)hidePopupNow();}
cancelPendingPreview();cancelActiveDemand();abortSpeculative();clearTimeout(state.scrollSettleTimer);const tick=()=>{state.scrollSettleTimer=0;const remaining=SCROLL_QUIET_MS-(nowMs()-state.lastScrollAt);if(remaining>0){state.scrollSettleTimer=window.setTimeout(tick,remaining+1);return;}
state.scrollBurstActive=false;resumeDeferredIntent();pumpSpeculative();};state.scrollSettleTimer=window.setTimeout(tick,SCROLL_QUIET_MS+1);}
function canUseHoverPreview(){try{return!!(window.matchMedia&&window.matchMedia(MOBILE_QUERY).matches);}catch(_){return false;}}
let siteRootCache="";let siteRootCacheBase="";function computeSiteRootUrl(){const script=document.querySelector('script[src*="assets/javascripts/bundle"]');const link=document.querySelector('link[href*="assets/stylesheets/main"]')||document.querySelector('link[href*="assets/stylesheets"]')||document.querySelector('script[src*="assets/javascripts"]');const attr=script?script.getAttribute("src"):(link?(link.getAttribute("href")||link.getAttribute("src")):null);const assetUrl=attr?new URL(attr,document.baseURI):new URL(document.baseURI);const p=assetUrl.pathname||"/";const idx=p.indexOf("/assets/");if(idx>=0)return assetUrl.origin+p.slice(0,idx+1);const base=new URL(document.baseURI);if(!base.pathname.endsWith("/"))base.pathname+="/";return base.origin+base.pathname;}
function getSiteRootUrl(){const base=document.baseURI||"";if(siteRootCache&&siteRootCacheBase===base)return siteRootCache;siteRootCache=computeSiteRootUrl();siteRootCacheBase=base;return siteRootCache;}
let siteRootPathCache="";let siteRootPathCacheFor="";function siteRootPath(){const root=getSiteRootUrl();if(siteRootPathCacheFor===root&&siteRootPathCache)return siteRootPathCache;const parsed=new URL(root);siteRootPathCache=parsed.pathname.endsWith("/")?parsed.pathname:parsed.pathname+"/";siteRootPathCacheFor=root;return siteRootPathCache;}
function relPathFromSiteRoot(absPathname){const rootPath=siteRootPath();let p=String(absPathname||"");if(p.startsWith(rootPath))p=p.slice(rootPath.length);return p.replace(/^\/+/,"").replace(/\/+$/,"");}
let currentRelPathCache="";let currentRelPathCacheFor="";function currentRelPath(){const path=window.location.pathname||"";if(currentRelPathCacheFor===path)return currentRelPathCache;currentRelPathCache=relPathFromSiteRoot(path);currentRelPathCacheFor=path;return currentRelPathCache;}
function resetPathCaches(){siteRootCache="";siteRootCacheBase="";siteRootPathCache="";siteRootPathCacheFor="";currentRelPathCache="";currentRelPathCacheFor="";}
function cleanTitle(s){return String(s||"").replace(/\s*¶\s*$/u,"").replace(/\u00B6/g,"").replace(/\s+/g," ").trim();}
function normalizeText(s){return String(s||"").replace(/\s+/g," ").trim();}
function clamp(n,min,max){if(!Number.isFinite(min))min=0;if(!Number.isFinite(max))max=min;if(max<min)return min;return Math.min(Math.max(n,min),max);}
function firstKeywordInText(s){const t=normalizeText(String(s||"").toLowerCase());if(!t)return"";for(const key of KEYWORD_ORDER){const re=new RegExp("(?:^|[^a-z])"+key+"(?:[^a-z]|$)","i");if(re.test(t))return key;}
return"";}
function firstKeywordNearStart(s){const t=normalizeText(String(s||"").toLowerCase()).replace(/^[\s\-–—:;,.()\[\]{}]+/g,"").slice(0,64);if(!t)return"";for(const key of KEYWORD_ORDER){if(t===key||t.startsWith(key+" ")||t.startsWith(key+":")||t.startsWith(key+".")||t.startsWith(key+"-")){return key;}}
return"";}
function normalizeKind(kind){const k=String(kind||"").toLowerCase();return KEYWORD_ORDER.includes(k)?k:"";}
function accentForKind(kind){return ACCENT_COLOR;}
function motionEnabled(){try{if(window.MkSiteMotion&&typeof window.MkSiteMotion.isEnabled==="function"){return!!window.MkSiteMotion.isEnabled();}}catch(_){}
try{return document.documentElement.getAttribute("data-mk-site-motion")!=="off";}catch(_){}
return true;}
function isSameOriginHref(a){if(!a||!a.href)return false;try{const u=new URL(a.href,document.baseURI);return u.origin===window.location.origin;}catch(_){return false;}}
function isConceptRelPath(rel){const p=String(rel||"").toLowerCase();if(!p||!p.endsWith(".html"))return false;if(p==="index.html"||p.endsWith("/index.html"))return false;const segs=p.split("/").filter(Boolean);if(segs.length<3)return false;const base=(segs[segs.length-1]||"").replace(/\.html$/i,"");if(!base||EXCLUDE_BASE.has(base))return false;return true;}
function qualifyAnchor(rawAnchor){const a=rawAnchor&&rawAnchor.closest?rawAnchor.closest("a[href]"):null;if(!a)return null;if(a.matches&&a.matches('[data-mk-no-hover-preview="1"]'))return null;if(a.closest&&a.closest('[data-mk-no-hover-preview="1"], .md-search, .mk-search-suggest, .mk-search-history, .mw-title-menu, .mw-title-menu-section, .mw-ready-calc, .mw-ready-link, #lp-map-modal, #mw-ready-popover, #mw-recap-popover'))return null;if(!isSameOriginHref(a))return null;if(a.hasAttribute("download"))return null;if(a.closest(`#${POPUP_ID}`))return null;const href=a.getAttribute("href")||"";if(!href||href.startsWith("#")||/^(mailto|tel|javascript):/i.test(href))return null;let abs="";let rel="";try{const u=new URL(href,document.baseURI);if(u.origin!==window.location.origin)return null;u.hash="";abs=u.toString();rel=relPathFromSiteRoot(u.pathname||"");}catch(_){return null;}
if(!isConceptRelPath(rel))return null;if(rel===currentRelPath())return null;return{anchor:a,absUrl:abs,relUrl:rel};}
function meaningfulChildren(container){if(!container)return[];const out=[];const kids=Array.from(container.children||[]);for(const el of kids){if(!el||el.tagName==="SCRIPT"||el.tagName==="STYLE")continue;const txt=normalizeText(el.textContent||"");if(!txt&&!el.querySelector("math,mjx-container,.MathJax,.arithmatex,.katex,.katex-display,script[type^='math/tex'],script[type^='math/asciimath']"))continue;out.push(el);}
return out;}
function isHeadingNode(el){if(!el)return false;const tag=(el.tagName||"").toLowerCase();return/^h[1-6]$/.test(tag);}
function headingLevel(el){if(!isHeadingNode(el))return 7;return Number((el.tagName||"H7").slice(1))||7;}
function isPureKeywordHeading(el){if(!isHeadingNode(el))return false;const txt=normalizeText(el.textContent||"").toLowerCase().replace(/[\s:]+$/g,"");return KEYWORD_ORDER.some((k)=>txt===k||txt===`${k}.`||txt.startsWith(k+" "));}
function isSkippablePreviewNode(el){if(!el)return true;const tag=(el.tagName||"").toLowerCase();if(["script","style","noscript","nav","aside","button","form","input","select","textarea","svg","img","video","canvas","iframe"].includes(tag))return true;const classText=[el.className||"",(el.getAttribute&&el.getAttribute("role"))||"",(el.getAttribute&&el.getAttribute("data-md-component"))||""].join(" ").toLowerCase();if(/\b(md-header|md-tabs|md-search|md-sidebar|md-nav|md-footer|md-source-file|md-tag|search|trending|random|learning-path|mastery|widget|banner|course-bar|lp-|mw-|sidebar|toc|navigation)\b/.test(classText))return true;const txt=normalizeText(el.textContent||"");if(!txt&&!el.querySelector?.("math,mjx-container,.MathJax,.arithmatex,.katex,.katex-display,script[type^='math/tex'],script[type^='math/asciimath'],p,ul,ol,blockquote,table,pre"))return true;return false;}
function looksLikeStatementNode(el){if(!el||!el.textContent||isSkippablePreviewNode(el))return"";if(isPureKeywordHeading(el))return"";const classText=[el.className||"",(el.getAttribute&&el.getAttribute("data-type"))||"",(el.getAttribute&&el.getAttribute("role"))||""].join(" ");const byClass=firstKeywordInText(classText);if(byClass&&!isHeadingNode(el))return byClass;const titleBits=[];const titleSel=[".admonition-title",":scope > summary",":scope > h2",":scope > h3",":scope > h4",":scope > p > strong:first-child",":scope > p > b:first-child"];for(const sel of titleSel){try{const node=el.querySelector(sel);if(node)titleBits.push(node.textContent||"");}catch(_){}}
const byTitle=firstKeywordInText(titleBits.join(" "));if(byTitle)return byTitle;const txt=normalizeText(el.textContent||"").slice(0,220);const byText=firstKeywordNearStart(txt);return byText||"";}
function escapeHtml(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function stripMathDelimiters(raw){let t=String(raw||"").trim();if(!t)return t;if(t.startsWith("\\(")&&t.endsWith("\\)"))return t.slice(2,-2).trim();if(t.startsWith("\\[")&&t.endsWith("\\]"))return t.slice(2,-2).trim();if(t.startsWith("$$")&&t.endsWith("$$"))return t.slice(2,-2).trim();if(t.startsWith("$")&&t.endsWith("$")&&t.length>=2)return t.slice(1,-1).trim();return t;}
function detectMathDisplay(node){if(!node)return false;const type=String((node.getAttribute&&node.getAttribute("type"))||"").toLowerCase();if(/mode=display/.test(type))return true;const text=normalizeText(node.textContent||"");if(text.startsWith("\\[")&&text.endsWith("\\]"))return true;if(text.startsWith("$$")&&text.endsWith("$$"))return true;try{return!!node.closest(".MathJax_Display,.katex-display,[data-math-display='block'],.display-math");}catch(_){return false;}}
function createMathWrapper(doc,raw,isDisplay){const wrapper=doc.createElement(isDisplay?"div":"span");wrapper.className="arithmatex";wrapper.setAttribute("data-math-display",isDisplay?"block":"inline");wrapper.textContent=isDisplay?`\\[${stripMathDelimiters(raw)}\\]`:`\\(${stripMathDelimiters(raw)}\\)`;return wrapper;}
function extractTexFromKatexNode(node){if(!node||!node.querySelector)return"";try{const ann=node.querySelector('annotation[encoding="application/x-tex"], annotation[encoding="Application/X-TeX"]');const raw=ann?String(ann.textContent||"").trim():"";return raw?stripMathDelimiters(raw):"";}catch(_){return"";}}
function replaceWithRawMathWrapper(node,raw,isDisplay){if(!node||!node.parentNode||!raw)return false;try{const wrapper=createMathWrapper(node.ownerDocument,raw,!!isDisplay);node.replaceWith(wrapper);return true;}catch(_){return false;}}
function normalizeMathMarkup(root,opts){if(!root||!root.querySelectorAll)return;const preserveRendered=!!(opts&&opts.preserveRendered);try{root.querySelectorAll(".MathJax_Preview").forEach((n)=>n.remove());}catch(_){}
if(!preserveRendered){try{root.querySelectorAll(".katex-display").forEach((node)=>{const raw=extractTexFromKatexNode(node);if(raw)replaceWithRawMathWrapper(node,raw,true);});}catch(_){}
try{root.querySelectorAll(".katex").forEach((node)=>{if(!node||!node.parentNode)return;if(node.closest&&node.closest(".katex-display"))return;const raw=extractTexFromKatexNode(node);if(raw)replaceWithRawMathWrapper(node,raw,false);});}catch(_){}}
try{root.querySelectorAll(".arithmatex").forEach((node)=>{if(preserveRendered&&node.querySelector(".katex,.katex-display,mjx-container,.MathJax,math"))return;const script=node.querySelector("script[type^='math/tex'], script[type^='math/asciimath']");const annRaw=extractTexFromKatexNode(node);const isDisplay=detectMathDisplay(script||node)||node.getAttribute("data-math-display")==="block";let raw=annRaw||(script?String(script.textContent||"").trim():String(node.textContent||"").trim());raw=stripMathDelimiters(raw);if(!raw)return;while(node.firstChild)node.removeChild(node.firstChild);node.appendChild(node.ownerDocument.createTextNode(isDisplay?`\\[${raw}\\]`:`\\(${raw}\\)`));node.className="arithmatex";node.setAttribute("data-math-display",isDisplay?"block":"inline");});}catch(_){}
try{root.querySelectorAll("script[type^='math/tex'], script[type^='math/asciimath']").forEach((script)=>{if(script.closest(".arithmatex"))return;const raw=String(script.textContent||"").trim();if(!raw){script.remove();return;}
const wrapper=createMathWrapper(script.ownerDocument,raw,detectMathDisplay(script));script.replaceWith(wrapper);});}catch(_){}}
function splitRawTexSegments(text){const src=String(text||"");if(!src)return null;const parts=[];let i=0;while(i<src.length){const openInline=src.indexOf("\\(",i);const openBlock=src.indexOf("\\[",i);let start=-1;let closeDelim="";let display=false;if(openInline>=0&&(openBlock<0||openInline<openBlock)){start=openInline;closeDelim="\\)";display=false;}else if(openBlock>=0){start=openBlock;closeDelim="\\]";display=true;}
if(start<0){parts.push({type:"text",value:src.slice(i)});break;}
if(start>i)parts.push({type:"text",value:src.slice(i,start)});const bodyStart=start+2;const end=src.indexOf(closeDelim,bodyStart);if(end<0){parts.push({type:"text",value:src.slice(start)});break;}
const raw=src.slice(bodyStart,end);parts.push({type:"math",value:raw,display});i=end+2;}
if(!parts.some((p)=>p.type==="math"))return null;return parts;}
function wrapRawTexInTextNodes(root){if(!root||!root.ownerDocument||!root.querySelectorAll)return;const doc=root.ownerDocument;const walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){if(!node||!node.nodeValue||!String(node.nodeValue).trim())return NodeFilter.FILTER_REJECT;const parent=node.parentElement;if(!parent)return NodeFilter.FILTER_REJECT;if(parent.closest("script,style,noscript,pre,code,kbd,samp,textarea,mjx-container,.MathJax,.katex,.arithmatex")){return NodeFilter.FILTER_REJECT;}
return/\\\(|\\\[/.test(node.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});const textNodes=[];let n;while((n=walker.nextNode()))textNodes.push(n);for(const textNode of textNodes){const parts=splitRawTexSegments(textNode.nodeValue||"");if(!parts)continue;const frag=doc.createDocumentFragment();for(const part of parts){if(part.type==="text"){if(part.value)frag.appendChild(doc.createTextNode(part.value));}else if(part.type==="math"){frag.appendChild(createMathWrapper(doc,part.value,!!part.display));}}
textNode.parentNode&&textNode.parentNode.replaceChild(frag,textNode);}}
function cloneNodeClean(el){if(!el)return null;const clone=el.cloneNode(true);try{normalizeMathMarkup(clone,{preserveRendered:true});wrapRawTexInTextNodes(clone);}catch(_){}
try{clone.querySelectorAll(["script:not([type^='math/tex']):not([type^='math/asciimath'])","style","noscript",".headerlink",".md-source-file",".md-tags",".md-tag",".mw-title-badge",".mw-h1-manage",".lp-local","#lp-side-panel","#lp-map-modal","#custom-random-banner","#current-course-bar",".admonition-title","summary","nav","aside","button","form","input","select","textarea","video","iframe","canvas","img","svg",".md-icon",".twemoji","[class*='icon']"].join(",")).forEach((n)=>{if(n.matches&&n.matches("svg")&&n.closest&&n.closest(".katex,.katex-display,mjx-container,.MathJax,math"))return;n.remove();});}catch(_){}
try{clone.querySelectorAll("a[href]").forEach((a)=>{a.removeAttribute("href");a.removeAttribute("target");a.removeAttribute("rel");a.classList.add("mk-chp-dead-link");});}catch(_){}
const safeClass=/^(arithmatex|MathJax|MathJax_Display|katex|katex-display|highlight|codehilite|language-[\w-]+)$/;try{[clone,...clone.querySelectorAll("*")].forEach((n)=>{if(!n||!n.removeAttribute)return;try{if(n.matches&&n.matches(".katex,.katex-display,mjx-container,.MathJax,math"))return;if(n.closest&&n.closest(".katex,.katex-display,mjx-container,.MathJax,math"))return;}catch(_){}
n.removeAttribute("id");n.removeAttribute("style");const raw=n.getAttribute("class")||"";if(!raw){n.removeAttribute("class");return;}
const kept=raw.split(/\s+/).filter(Boolean).filter((token)=>safeClass.test(token));if(kept.length)n.setAttribute("class",kept.join(" "));else n.removeAttribute("class");});}catch(_){}
normalizeMathMarkup(clone,{preserveRendered:true});wrapRawTexInTextNodes(clone);return clone;}
function isTitleLikeNode(el){if(!el)return false;const tag=(el.tagName||"").toLowerCase();if(!tag)return false;if(tag==="summary")return true;if(/^h[1-6]$/.test(tag))return true;const classText=[el.className||"",(el.getAttribute&&el.getAttribute("role"))||"",(el.getAttribute&&el.getAttribute("data-type"))||""].join(" ").toLowerCase();return/\badmonition-title\b|\bheaderlink\b|\bmd-source-file\b|\bmd-tags?\b|\btabbed-labels?\b|\bannotation\b|\bannotation__index\b/.test(classText);}
function nodeHasMeaning(el){if(!el)return false;const txt=normalizeText(el.textContent||"");if(txt)return true;try{return!!el.querySelector("math,mjx-container,.MathJax,.arithmatex,.katex,.katex-display,script[type^='math/tex'],script[type^='math/asciimath'],table,ul,ol,pre,blockquote,p");}catch(_){return false;}}
function nodeHasPreviewBody(el){if(!el)return false;const txt=normalizeText(el.textContent||"");if(txt.length>=18)return true;try{return!!el.querySelector("math,mjx-container,.MathJax,.arithmatex,.katex,.katex-display,script[type^='math/tex'],script[type^='math/asciimath'],table,ul,ol,pre,blockquote,p");}catch(_){return false;}}
function nodeHasDirectPreviewPayload(el){if(!el)return false;const tag=(el.tagName||"").toLowerCase();if(/^(math|mjx-container)$/.test(tag))return true;const classText=String(el.className||"").toLowerCase();if(/\barithmatex\b|\bmathjax\b|\bkatex\b/.test(classText))return true;const children=Array.from(el.children||[]).filter((child)=>!isTitleLikeNode(child)&&!isSkippablePreviewNode(child));if(!children.length&&nodeHasMeaning(el))return true;try{return children.some((child)=>{const childTag=(child.tagName||"").toLowerCase();const childClass=String(child.className||"").toLowerCase();if(/^(math|mjx-container)$/.test(childTag))return true;if(/\barithmatex\b|\bmathjax\b|\bkatex\b/.test(childClass))return true;const type=String((child.getAttribute&&child.getAttribute("type"))||"").toLowerCase();return/^math\//.test(type);});}catch(_){return false;}}
function firstBodyBlockClone(root){if(!root)return null;const queue=meaningfulChildren(root).filter((child)=>!isTitleLikeNode(child)&&!isSkippablePreviewNode(child));while(queue.length){const node=queue.shift();if(!node||isTitleLikeNode(node)||isSkippablePreviewNode(node)||!nodeHasPreviewBody(node))continue;const tag=(node.tagName||"").toLowerCase();const children=meaningfulChildren(node).filter((child)=>!isTitleLikeNode(child)&&!isSkippablePreviewNode(child));const isContainer=tag==="div"||tag==="section"||tag==="article"||tag==="details"||tag==="main"||tag==="body"||tag==="blockquote";if(isContainer&&children.length&&!nodeHasDirectPreviewPayload(node)){queue.unshift(...children);continue;}
const clone=cloneNodeClean(node);if(clone&&nodeHasPreviewBody(clone))return clone;}
const clone=cloneNodeClean(root);if(clone&&nodeHasPreviewBody(clone)&&(nodeHasDirectPreviewPayload(root)||nodeHasMeaning(root))){return clone;}
return null;}
function previewBlockFromNode(node){if(!node||isTitleLikeNode(node)||isSkippablePreviewNode(node)||!nodeHasPreviewBody(node))return null;const tag=(node.tagName||"").toLowerCase();if(["div","section","article","details","blockquote","main","body"].includes(tag)){if(nodeHasDirectPreviewPayload(node)){const directClone=cloneNodeClean(node);return directClone&&nodeHasPreviewBody(directClone)?directClone:null;}
return firstBodyBlockClone(node);}
const clone=cloneNodeClean(node);return clone&&nodeHasPreviewBody(clone)?clone:null;}
function buildPrimaryStatementFragment(statementNode,doc){const wrap=doc.createElement("div");const blocks=meaningfulChildren(statementNode).filter((child)=>!isTitleLikeNode(child)&&!isSkippablePreviewNode(child)&&nodeHasPreviewBody(child));for(const child of blocks){const clone=previewBlockFromNode(child);if(clone)wrap.appendChild(clone);if(wrap.childNodes.length>=MAX_BODY_BLOCKS)break;}
if(wrap.childNodes.length)return wrap;const primary=previewBlockFromNode(statementNode);if(primary)wrap.appendChild(primary);return wrap;}
function extractFromHeadingSequence(articleClone,doc){const headings=Array.from(articleClone.querySelectorAll("h2,h3,h4,h5,h6")).slice(0,18);for(const heading of headings){const kind=firstKeywordInText(heading.textContent||"");if(!kind)continue;const wrap=doc.createElement("div");const level=headingLevel(heading);let sib=heading.nextElementSibling;while(sib&&wrap.childNodes.length<MAX_BODY_BLOCKS){if(isHeadingNode(sib)&&headingLevel(sib)<=level)break;const block=previewBlockFromNode(sib);if(block)wrap.appendChild(block);sib=sib.nextElementSibling;}
if(wrap.childNodes.length)return{kind:normalizeKind(kind),fragment:wrap};}
return null;}
function buildFallbackFragment(articleClone,doc){const wrap=doc.createElement("div");const blocks=meaningfulChildren(articleClone).filter((child)=>!isTitleLikeNode(child)&&!isSkippablePreviewNode(child)&&nodeHasPreviewBody(child)).slice(0,12);for(const block of blocks){const c=previewBlockFromNode(block);if(c)wrap.appendChild(c);if(wrap.childNodes.length>=MAX_BODY_BLOCKS)break;}
return wrap;}
function buildTitleHtml(node,fallbackText){const fallback=escapeHtml(cleanTitle(fallbackText||"Preview"));if(!node)return fallback;const clone=cloneNodeClean(node);if(!clone)return fallback;normalizeMathMarkup(clone,{preserveRendered:true});wrapRawTexInTextNodes(clone);const html=String(clone.innerHTML||"").trim();if(html)return html;return escapeHtml(cleanTitle(clone.textContent||fallbackText||"Preview"));}
function compactPreviewDocumentHtml(htmlText){const raw=String(htmlText||"");if(!raw)return raw;const lower=raw.toLowerCase();let start=lower.indexOf("<article");while(start>=0){const tagEnd=lower.indexOf(">",start);if(tagEnd<0)break;const opening=lower.slice(start,tagEnd+1);if(/\bmd-content__inner\b/.test(opening)){const end=lower.indexOf("</article>",tagEnd+1);if(end>tagEnd){const titleMatch=raw.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);const title=titleMatch?titleMatch[1]:"";return`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body>${raw.slice(start, end + 10)}</body></html>`;}}
start=lower.indexOf("<article",tagEnd+1);}
return raw;}
function extractPreviewFromHtml(htmlText,absUrl){const parser=new DOMParser();const doc=parser.parseFromString(compactPreviewDocumentHtml(htmlText),"text/html");const article=doc.querySelector("article.md-content__inner")||doc.querySelector(".md-content__inner article")||doc.querySelector(".md-content__inner")||doc.body;const articleClone=article?article.cloneNode(true):doc.createElement("div");try{articleClone.querySelectorAll(["script:not([type^='math/tex']):not([type^='math/asciimath'])","style","noscript",".md-source-file",".md-tags",".md-tag",".headerlink",".mw-title-badge",".mw-h1-manage","#lp-side-panel","#lp-map-modal","#current-course-bar","#custom-random-banner","nav","aside","button","form","img","svg","video","canvas","iframe"].join(",")).forEach((n)=>{if(n.matches&&n.matches("svg")&&n.closest&&n.closest(".katex,.katex-display,mjx-container,.MathJax,math"))return;n.remove();});}catch(_){}
const h1=articleClone.querySelector("h1");const fallbackTitle=doc.title||relPathFromSiteRoot(new URL(absUrl,document.baseURI).pathname||"");const title=cleanTitle((h1&&h1.textContent)||fallbackTitle);const titleHtml=buildTitleHtml(h1,title||fallbackTitle);if(h1)h1.remove();const topBlocks=meaningfulChildren(articleClone).filter((el)=>!isSkippablePreviewNode(el));let picked=null;let kind="";const host=doc.createElement("div");const headingSequence=extractFromHeadingSequence(articleClone,doc);if(headingSequence&&headingSequence.fragment&&headingSequence.fragment.childNodes.length){kind=kind||headingSequence.kind;host.appendChild(headingSequence.fragment);}
if(!host.childNodes.length){for(const el of topBlocks.slice(0,12)){const found=looksLikeStatementNode(el);if(found){picked=el;kind=found;break;}}}
if(!host.childNodes.length&&picked){const primary=buildPrimaryStatementFragment(picked,doc);if(primary&&primary.childNodes.length)host.appendChild(primary);}
if(!host.childNodes.length){const deepCandidates=Array.from(articleClone.querySelectorAll(".admonition, details, blockquote, section, div, p")).filter((el)=>!isSkippablePreviewNode(el));for(const el of deepCandidates){const found=looksLikeStatementNode(el);if(!found)continue;const primary=buildPrimaryStatementFragment(el,doc);if(primary&&primary.childNodes.length){kind=kind||found;host.appendChild(primary);break;}}}
if(!host.childNodes.length){const fallback=buildFallbackFragment(articleClone,doc);if(fallback&&fallback.childNodes.length)host.appendChild(fallback);}
normalizeMathMarkup(host,{preserveRendered:true});const html=normalizeText(host.innerHTML||"")?host.innerHTML:`<div class="mk-chp-empty">Preview unavailable.</div>`;return{title:title||"Preview",titleHtml,kind:normalizeKind(kind),html};}
function unavailablePayload(){return{title:"Preview",kind:"",html:`<div class="mk-chp-empty">Preview unavailable.</div>`};}
function getPayload(entry){if(!entry)return null;if(entry.data)return entry.data;if(entry.status==="error"){entry.data=unavailablePayload();return entry.data;}
if(entry.status!=="loaded")return null;try{entry.data=extractPreviewFromHtml(entry.text,entry.url);}catch(_){entry.data=unavailablePayload();}
entry.text="";entry.status="resolved";return entry.data;}
function entryIsSettled(entry){return!!entry&&(entry.status==="loaded"||entry.status==="resolved"||entry.status==="error");}
function touchEntry(absUrl,entry){previewCache.delete(absUrl);previewCache.set(absUrl,entry);if(previewCache.size<=PREVIEW_CACHE_MAX)return;for(const[key,value]of previewCache){if(previewCache.size<=PREVIEW_CACHE_MAX)break;if(key===absUrl)continue;if(value&&value.started&&!entryIsSettled(value))continue;if(value&&speculativeQueue.indexOf(value)>=0)continue;previewCache.delete(key);}}
function deleteEntryIfCurrent(entry){if(!entry||previewCache.get(entry.url)!==entry)return;previewCache.delete(entry.url);}
function releaseInflight(){inflightCount=Math.max(0,inflightCount-1);pumpSpeculative();}
function previewCompanionUrl(absUrl){try{const u=new URL(absUrl,document.baseURI);if(u.origin!==window.location.origin||!/\.html$/i.test(u.pathname||""))return"";u.pathname=u.pathname.replace(/\.html$/i,".preview.html");u.search="";u.hash="";return u.toString();}catch(_){return"";}}
function fetchPreviewText(entry,init){const companion=previewCompanionUrl(entry&&entry.url);const fetchFullPage=()=>fetch(entry.url,init).then((res)=>{if(!res||!res.ok)throw new Error("HTTP "+(res?res.status:"fetch failed"));return res.text().then((text)=>({text,source:"full"}));});if(!companion)return fetchFullPage();return fetch(companion,init).then((res)=>{if(!res||!res.ok)return null;return res.text().then((text)=>{const value=String(text||"");const valid=/<meta\b[^>]*name=["']mk-hover-preview["'][^>]*content=["']1["'][^>]*>/i.test(value)&&/<article\b/i.test(value)&&/\bmd-content__inner\b/i.test(value);return valid?{text:value,source:"companion"}:null;});}).catch((err)=>{if(err&&err.name==="AbortError")throw err;return null;}).then((result)=>result||fetchFullPage());}
function clearEntryDeadline(entry){if(!entry||!entry.timeoutId)return;clearTimeout(entry.timeoutId);entry.timeoutId=0;}
function armEntryDeadline(entry){if(!entry)return;clearEntryDeadline(entry);const timeout=entry.demanded?DEMAND_FETCH_TIMEOUT_MS:SPECULATIVE_FETCH_TIMEOUT_MS;entry.timeoutId=window.setTimeout(()=>{entry.timeoutId=0;if(!entry.started||entryIsSettled(entry))return;entry.abortReason="timeout";try{entry.controller&&entry.controller.abort();}catch(_){}},timeout);}
function startEntryFetch(entry){if(!entry||entry.started||entryIsSettled(entry))return;entry.started=true;entry.aborted=false;entry.abortReason="";inflightCount+=1;let controller=null;try{controller=new AbortController();}catch(_){}
entry.controller=controller;const init={credentials:"same-origin"};if(controller)init.signal=controller.signal;armEntryDeadline(entry);try{init.priority=entry.demanded?"high":"low";}catch(_){}
fetchPreviewText(entry,init).then((result)=>{clearEntryDeadline(entry);entry.controller=null;entry.abortReason="";entry.status="loaded";entry.text=String((result&&result.text)||"");entry.source=(result&&result.source)||"full";releaseInflight();entry.resolve(entry);}).catch((err)=>{clearEntryDeadline(entry);entry.controller=null;const timedOut=entry.abortReason==="timeout";entry.abortReason="";if(timedOut){entry.started=false;entry.status="error";entry.text="";entry.aborted=false;entry.dropAfterAbort=false;releaseInflight();deleteEntryIfCurrent(entry);entry.resolve(entry);return;}
const aborted=entry.aborted||!!(err&&err.name==="AbortError");if(aborted){entry.started=false;entry.status="pending";entry.aborted=false;releaseInflight();if(entry.dropAfterAbort&&!entry.demanded){entry.dropAfterAbort=false;deleteEntryIfCurrent(entry);return;}
entry.dropAfterAbort=false;if(entry.demanded)startEntryFetch(entry);return;}
entry.status="error";entry.text="";releaseInflight();deleteEntryIfCurrent(entry);entry.resolve(entry);});}
function pumpSpeculative(){while(speculativeQueue.length){if(inflightCount>=MAX_SPECULATIVE_INFLIGHT)return;if(scrollIsActive())return;const next=speculativeQueue.shift();if(!next||next.started||entryIsSettled(next))continue;startEntryFetch(next);}}
function enqueueSpeculative(entry){if(!entry||entry.started||entryIsSettled(entry))return;if(speculativeQueue.indexOf(entry)>=0)return;speculativeQueue.push(entry);while(speculativeQueue.length>SPECULATIVE_QUEUE_MAX){const dropped=speculativeQueue.shift();if(dropped&&!dropped.started&&!entryIsSettled(dropped)&&!dropped.demanded){deleteEntryIfCurrent(dropped);}}
pumpSpeculative();}
function abortSpeculative(){speculativeQueue.length=0;previewCache.forEach((entry)=>{if(!entry||entry.demanded||!entry.started||entryIsSettled(entry))return;clearEntryDeadline(entry);entry.aborted=true;entry.abortReason="cancel";try{entry.controller&&entry.controller.abort();}catch(_){}});}
function cancelDemandEntry(entry){if(!entry)return;entry.demanded=false;const at=speculativeQueue.indexOf(entry);if(at>=0)speculativeQueue.splice(at,1);if(entryIsSettled(entry))return;if(entry.started){clearEntryDeadline(entry);entry.dropAfterAbort=true;entry.aborted=true;entry.abortReason="cancel";try{entry.controller&&entry.controller.abort();}catch(_){}
return;}
deleteEntryIfCurrent(entry);}
function cancelActiveDemand(){const entry=state.demandEntry;state.demandEntry=null;cancelDemandEntry(entry);}
function getCacheEntry(absUrl,opts){const demanded=!!(opts&&opts.demanded);const existing=previewCache.get(absUrl);if(existing){if(demanded&&!existing.demanded){existing.demanded=true;const at=speculativeQueue.indexOf(existing);if(at>=0)speculativeQueue.splice(at,1);if(!existing.started)startEntryFetch(existing);else if(!entryIsSettled(existing))armEntryDeadline(existing);}else if(demanded&&!existing.started&&!entryIsSettled(existing)){startEntryFetch(existing);}else if(!demanded&&!existing.started&&!entryIsSettled(existing)){enqueueSpeculative(existing);}
touchEntry(absUrl,existing);return existing;}
const entry={url:absUrl,status:"pending",demanded,started:false,aborted:false,abortReason:"",dropAfterAbort:false,controller:null,timeoutId:0,text:"",source:"",data:null,promise:null,resolve:null};entry.promise=new Promise((resolve)=>{entry.resolve=resolve;});previewCache.set(absUrl,entry);touchEntry(absUrl,entry);if(demanded)startEntryFetch(entry);else enqueueSpeculative(entry);return entry;}
function prefetch(absUrl,opts){try{if(!absUrl)return null;if(!(opts&&opts.demanded)&&scrollIsActive())return previewCache.get(absUrl)||null;return getCacheEntry(absUrl,opts);}catch(_){return null;}}
function getPopup(){let popup=document.getElementById(POPUP_ID);if(popup)return popup;popup=document.createElement("div");popup.id=POPUP_ID;popup.setAttribute("aria-hidden","true");popup.setAttribute("data-kind","preview");popup.setAttribute("data-placement","right");popup.innerHTML=`
      <div class="mk-chp-pin" aria-hidden="true"></div>
      <div class="mk-chp-card" role="presentation">
        <div class="mk-chp-head">
          <div class="mk-chp-headline">
            <span class="mk-chp-head-title"></span>
          </div>
        </div>
        <div class="mk-chp-body">
          <div class="mk-chp-scroll">
            <div class="mk-chp-content"></div>
          </div>
          <div class="mk-chp-fade" aria-hidden="true"></div>
        </div>
      </div>
    `;document.body.appendChild(popup);state.popup=popup;popup.classList.toggle("is-motion-on",motionEnabled());popup.addEventListener("mouseenter",onPopupMouseEnter,true);popup.addEventListener("mouseleave",onPopupMouseLeave,true);const scrollEl=popup.querySelector(".mk-chp-scroll");if(scrollEl){scrollEl.addEventListener("wheel",onPopupWheel,{passive:false});}
return popup;}
function syncMotionMode(){const popup=getPopup();popup.classList.toggle("is-motion-on",motionEnabled());}
function ensureStyles(){if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=`
      #${POPUP_ID}{
        --mk-chp-accent:${ACCENT_COLOR};
        position:fixed;
        left:0;
        top:0;
        width:${MAX_WIDTH}px;
        max-width:calc(100vw - ${VIEWPORT_PAD * 2}px);
        --mk-chp-pin-size:${PIN_SIZE}px;
        --mk-chp-pin-left:26px;
        --mk-chp-pin-top:26px;
        z-index:9998;
        opacity:0;
        visibility:hidden;
        transform:translate3d(0, 6px, 0) scale(.982);
        transform-origin:top left;
        transition:
          opacity .15s cubic-bezier(.2,.8,.2,1),
          transform .18s cubic-bezier(.2,.8,.2,1),
          visibility 0s linear .18s;
        pointer-events:none;
        contain:layout style paint;
        will-change:transform, opacity;
        isolation:isolate;
      }
      #${POPUP_ID}::before{
        content:none !important;
        display:none !important;
      }
      html[data-md-color-scheme="slate"] #${POPUP_ID}::before,
      body[data-md-color-scheme="slate"] #${POPUP_ID}::before{
        background:rgba(4,8,16,.64);
        backdrop-filter:blur(30px) saturate(1.18) brightness(.82);
        -webkit-backdrop-filter:blur(30px) saturate(1.18) brightness(.82);
        box-shadow:0 24px 72px rgba(0,0,0,.34);
      }
      #${POPUP_ID}.is-open{
        opacity:1;
        visibility:visible;
        transform:translate3d(0, 0, 0) scale(1);
        pointer-events:auto;
        transition:
          opacity .15s cubic-bezier(.2,.8,.2,1),
          transform .18s cubic-bezier(.2,.8,.2,1);
      }
      #${POPUP_ID}.is-motion-on{
        transform:translate3d(0, 0, 0) scale(1);
        transition:opacity .15s cubic-bezier(.2,.8,.2,1), visibility 0s linear .18s;
      }
      #${POPUP_ID}.is-motion-on.is-open{
        /* The closed state delays visibility so the fade-out can finish.  Once
           open, visibility must flip immediately; otherwise the entire short
           entrance animation runs behind visibility:hidden. */
        transition:visibility 0s linear 0s;
        animation:mk-chp-shell-in .16s cubic-bezier(.2,.84,.18,1) both;
      }
      #${POPUP_ID}.is-motion-on .mk-chp-head{
        opacity:0;
        transform:translateY(-3px);
      }
      #${POPUP_ID}.is-motion-on .mk-chp-body{
        opacity:0;
        transform:translateY(-2px);
        transform-origin:top center;
      }
      #${POPUP_ID}.is-motion-on .mk-chp-content{
        opacity:0;
      }
      #${POPUP_ID}.is-motion-on.is-open .mk-chp-head{
        animation:mk-chp-head-in .14s ease both;
      }
      #${POPUP_ID}.is-motion-on.is-open .mk-chp-body{
        animation:mk-chp-body-unroll .18s cubic-bezier(.18,.86,.22,1) .03s both;
      }
      #${POPUP_ID}.is-motion-on.is-open .mk-chp-content{
        animation:mk-chp-content-in .14s linear .04s both;
      }
      #${POPUP_ID}.is-swapping .mk-chp-content,
      #${POPUP_ID}.is-loading .mk-chp-content{
        /* Filter is independent of the entrance animation's opacity, so a
           loading→ready state change cannot restart or override that animation. */
        filter:opacity(.84);
      }
      @keyframes mk-chp-shell-in{
        from{ opacity:0; }
        to{ opacity:1; }
      }
      @keyframes mk-chp-head-in{
        0%{ opacity:0; transform:translateY(-3px); }
        100%{ opacity:1; transform:translateY(0); }
      }
      @keyframes mk-chp-body-unroll{
        0%{ opacity:0; transform:translateY(-2px); }
        100%{ opacity:1; transform:translateY(0); }
      }
      @keyframes mk-chp-content-in{
        0%{ opacity:0; }
        100%{ opacity:1; }
      }
      #${POPUP_ID}[data-placement="left"]{ transform-origin:top right; }
      #${POPUP_ID}[data-placement="bottom"]{ transform-origin:top center; }
      #${POPUP_ID}[data-placement="top"]{ transform-origin:bottom center; }

      #${POPUP_ID} .mk-chp-pin{
        display:none !important;
        position:absolute;
        width:var(--mk-chp-pin-size);
        height:var(--mk-chp-pin-size);
        border-radius:4px;
        background:rgba(255,255,255,.72);
        border:1px solid rgba(255,255,255,.16);
        box-shadow:
          0 10px 28px rgba(15, 23, 42, .12),
          inset 0 1px 0 rgba(255,255,255,.28);
        backdrop-filter:blur(36px) saturate(1.36);
        -webkit-backdrop-filter:blur(36px) saturate(1.36);
        transform:rotate(45deg);
        opacity:.98;
        pointer-events:none;
        z-index:0;
      }
      html[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-pin,
      body[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-pin{
        background:rgba(11, 18, 30, .78);
        border-color:rgba(255,255,255,.12);
        box-shadow:
          0 10px 30px rgba(0,0,0,.26),
          inset 0 1px 0 rgba(255,255,255,.10);
      }
      #${POPUP_ID}[data-placement="right"] .mk-chp-pin{
        left:calc(var(--mk-chp-pin-size) / -2);
        top:var(--mk-chp-pin-top);
      }
      #${POPUP_ID}[data-placement="left"] .mk-chp-pin{
        right:calc(var(--mk-chp-pin-size) / -2);
        top:var(--mk-chp-pin-top);
      }
      #${POPUP_ID}[data-placement="bottom"] .mk-chp-pin{
        top:calc(var(--mk-chp-pin-size) / -2);
        left:var(--mk-chp-pin-left);
      }
      #${POPUP_ID}[data-placement="top"] .mk-chp-pin{
        bottom:calc(var(--mk-chp-pin-size) / -2);
        left:var(--mk-chp-pin-left);
      }
      #${POPUP_ID} .mk-chp-card{
        position:relative;
        z-index:1;
        overflow:hidden;
        border-radius:22px;
        color:var(--md-default-fg-color, #1c1f26);
        border:1px solid rgba(255,255,255,.24);
        border-top:1px solid color-mix(in srgb, var(--mk-chp-accent) 65%, rgba(255,255,255,.45));
        background:rgba(248,250,255,.975);
        box-shadow:
          0 24px 68px rgba(15, 23, 42, .22),
          0 8px 24px rgba(15, 23, 42, .12),
          inset 0 1px 0 rgba(255,255,255,.58);
        backdrop-filter:blur(14px) saturate(1.12);
        -webkit-backdrop-filter:blur(14px) saturate(1.12);
      }
      html[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-card,
      body[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-card{
        color:rgba(244,247,255,.96);
        border-color:rgba(255,255,255,.12);
        border-top-color:color-mix(in srgb, var(--mk-chp-accent) 72%, rgba(255,255,255,.12));
        background:linear-gradient(180deg, rgba(5, 9, 17, .992), rgba(7, 11, 20, .982));
        box-shadow:
          0 30px 82px rgba(0,0,0,.44),
          0 12px 30px rgba(0,0,0,.24),
          inset 0 1px 0 rgba(255,255,255,.13);
        backdrop-filter:blur(16px) saturate(1.12) brightness(.82);
        -webkit-backdrop-filter:blur(16px) saturate(1.12) brightness(.82);
      }
      #${POPUP_ID} .mk-chp-card::before{
        content:"";
        position:absolute;
        inset:0 0 auto 0;
        height:2px;
        z-index:3;
        background:linear-gradient(90deg, color-mix(in srgb, var(--mk-chp-accent) 92%, white 8%), color-mix(in srgb, var(--mk-chp-accent) 60%, transparent 40%));
        opacity:.95;
        pointer-events:none;
      }
      #${POPUP_ID} .mk-chp-card::after{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:1;
        background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.04) 24%, rgba(255,255,255,.02));
        opacity:.72;
      }
      html[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-card::after,
      body[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-card::after{
        background:linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.042) 26%, rgba(255,255,255,.02));
      }
      #${POPUP_ID} .mk-chp-head{
        position:relative;
        z-index:2;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:12px 14px 11px;
        border-bottom:1px solid rgba(15, 23, 42, .08);
        background:linear-gradient(180deg, rgba(255,255,255,.17), rgba(255,255,255,.06));
      }
      html[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-head,
      body[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-head{
        border-bottom-color:rgba(255,255,255,.08);
        background:linear-gradient(180deg, rgba(255,255,255,.11), rgba(255,255,255,.035));
      }
      #${POPUP_ID} .mk-chp-headline{
        display:flex;
        justify-content:center;
        align-items:center;
        width:100%;
        min-width:0;
      }
      #${POPUP_ID} .mk-chp-head-title{
        display:block;
        width:100%;
        min-width:0;
        margin:0 auto;
        text-align:center;
        text-wrap:balance;
        font-size:14.5px;
        line-height:1.28;
        font-weight:780;
        display:-webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
        overflow:hidden;
      }
      #${POPUP_ID} .mk-chp-body{
        position:relative;
        z-index:2;
        padding:12px 14px 14px;
      }
      #${POPUP_ID} .mk-chp-scroll{
        max-height:min(30vh, 248px);
        overflow:auto;
        padding-right:2px;
        scrollbar-width:thin;
        scrollbar-color:rgba(120,130,150,.28) transparent;
      }
      #${POPUP_ID} .mk-chp-scroll::-webkit-scrollbar{
        width:8px;
        height:8px;
      }
      #${POPUP_ID} .mk-chp-scroll::-webkit-scrollbar-thumb{
        background:rgba(120,130,150,.26);
        border-radius:999px;
        border:2px solid transparent;
        background-clip:padding-box;
      }
      #${POPUP_ID} .mk-chp-scroll::-webkit-scrollbar-track{
        background:transparent;
      }
      #${POPUP_ID} .mk-chp-content{
        font-size:13.2px;
        line-height:1.58;
        padding-bottom:30px;
        filter:opacity(1);
        transition:filter .12s ease;
      }
      #${POPUP_ID} .mk-chp-content > :first-child{ margin-top:0 !important; }
      #${POPUP_ID} .mk-chp-content > :last-child{ margin-bottom:0 !important; }
#${POPUP_ID} .mk-chp-content > *::before,
      #${POPUP_ID} .mk-chp-content > *::after{
        content:none !important;
        background:none !important;
        box-shadow:none !important;
        mask:none !important;
        -webkit-mask:none !important;
      }
      #${POPUP_ID} .mk-chp-content *{
        max-width:100%;
      }
      #${POPUP_ID} .mk-chp-content [style*="position:absolute"],
      #${POPUP_ID} .mk-chp-content [style*="position:fixed"]{
        position:static !important;
        inset:auto !important;
      }
            #${POPUP_ID} .mk-chp-content h1,
      #${POPUP_ID} .mk-chp-content h2,
      #${POPUP_ID} .mk-chp-content h3,
      #${POPUP_ID} .mk-chp-content h4,
      #${POPUP_ID} .mk-chp-content h5,
      #${POPUP_ID} .mk-chp-content h6{
        margin:.15rem 0 .55rem;
        font-size:1em;
        line-height:1.34;
      }
      #${POPUP_ID} .mk-chp-content p,
      #${POPUP_ID} .mk-chp-content ul,
      #${POPUP_ID} .mk-chp-content ol,
      #${POPUP_ID} .mk-chp-content blockquote,
      #${POPUP_ID} .mk-chp-content details,
      #${POPUP_ID} .mk-chp-content .admonition,
      #${POPUP_ID} .mk-chp-content table{
        margin:.48rem 0;
      }
      #${POPUP_ID} .mk-chp-content .admonition,
      #${POPUP_ID} .mk-chp-content details,
      #${POPUP_ID} .mk-chp-content blockquote{
        border-radius:15px;
        border:1px solid rgba(15,23,42,.10);
        background:rgba(255,255,255,.16);
        overflow:hidden;
      }
      html[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-content .admonition,
      html[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-content details,
      html[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-content blockquote,
      body[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-content .admonition,
      body[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-content details,
      body[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-content blockquote{
        border-color:rgba(255,255,255,.10);
        background:rgba(255,255,255,.04);
      }
      #${POPUP_ID} .mk-chp-content .admonition-title,
      #${POPUP_ID} .mk-chp-content summary{
        font-size:.95em;
      }
      #${POPUP_ID} .mk-chp-content a,
      #${POPUP_ID} .mk-chp-content a:visited,
      #${POPUP_ID} .mk-chp-content a:hover,
      #${POPUP_ID} .mk-chp-content a:focus{
        color:inherit !important;
        text-decoration:none !important;
        pointer-events:none !important;
        cursor:default !important;
        opacity:inherit !important;
      }
      #${POPUP_ID} .mk-chp-content code{
        white-space:break-spaces;
      }
      #${POPUP_ID} .mk-chp-content img,
      #${POPUP_ID} .mk-chp-content video,
      #${POPUP_ID} .mk-chp-content iframe,
      #${POPUP_ID} .mk-chp-content canvas,
      #${POPUP_ID} .mk-chp-content button,
      #${POPUP_ID} .mk-chp-content form,
      #${POPUP_ID} .mk-chp-content input,
      #${POPUP_ID} .mk-chp-content select,
      #${POPUP_ID} .mk-chp-content textarea,
      #${POPUP_ID} .mk-chp-content .lp-local,
      #${POPUP_ID} .mk-chp-content #lp-side-panel,
      #${POPUP_ID} .mk-chp-content #custom-random-banner,
      #${POPUP_ID} .mk-chp-content #current-course-bar{
        display:none !important;
      }
      #${POPUP_ID} .mk-chp-content .headerlink,
      #${POPUP_ID} .mk-chp-content .md-source-file,
      #${POPUP_ID} .mk-chp-content .md-tags,
      #${POPUP_ID} .mk-chp-content .md-tag,
      #${POPUP_ID} .mk-chp-content .mw-title-badge,
      #${POPUP_ID} .mk-chp-content .mw-h1-manage{
        display:none !important;
      }
      #${POPUP_ID} .mk-chp-head-title .arithmatex,
      #${POPUP_ID} .mk-chp-head-title mjx-container,
      #${POPUP_ID} .mk-chp-head-title .MathJax,
      #${POPUP_ID} .mk-chp-head-title .katex{
        display:inline;
        line-height:1.2;
        margin:0;
        padding:0;
      }
      #${POPUP_ID} .mk-chp-content .arithmatex[data-math-display="block"],
      #${POPUP_ID} .mk-chp-head-title .arithmatex,
      #${POPUP_ID} .mk-chp-head-title mjx-container,
      #${POPUP_ID} .mk-chp-head-title .MathJax,
      #${POPUP_ID} .mk-chp-head-title .katex{
        display:inline;
        line-height:1.2;
        margin:0;
        padding:0;
      }
      #${POPUP_ID} .mk-chp-content .arithmatex[data-math-display="block"],
      #${POPUP_ID} .mk-chp-content mjx-container[display="true"],
      #${POPUP_ID} .mk-chp-content .MathJax_Display,
      #${POPUP_ID} .mk-chp-content .katex-display{
        display:block;
        max-width:100%;
        overflow-x:auto;
        overflow-y:hidden;
        padding:.2rem 0 .28rem;
        margin:.55rem 0;
        -webkit-overflow-scrolling:touch;
      }
      #${POPUP_ID} .mk-chp-content .arithmatex:not([data-math-display="block"]),
      #${POPUP_ID} .mk-chp-content mjx-container:not([display="true"]),
      #${POPUP_ID} .mk-chp-content .MathJax:not(.MathJax_Display),
      #${POPUP_ID} .mk-chp-content .katex:not(.katex-display){
        display:inline;
        line-height:1.72;
        margin:0;
        padding:0;
      }
      #${POPUP_ID} .mk-chp-content mjx-container,
      #${POPUP_ID} .mk-chp-content .arithmatex,
      #${POPUP_ID} .mk-chp-content .MathJax,
      #${POPUP_ID} .mk-chp-content .katex{
        line-height:1.72;
      }
      #${POPUP_ID} .mk-chp-content mjx-container[jax="CHTML"]{
        font-size:1.01em;
      }
      #${POPUP_ID} .mk-chp-fade{
        position:absolute;
        left:0;
        right:0;
        bottom:0;
        height:108px;
        pointer-events:none;
        opacity:.28;
        transition:opacity .16s ease;
        background:linear-gradient(180deg, rgba(255,255,255,0), rgba(244,248,255,.60) 30%, rgba(244,248,255,.88) 58%, rgba(244,248,255,.98) 78%, rgba(244,248,255,1));
      }
      html[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-fade,
      body[data-md-color-scheme="slate"] #${POPUP_ID} .mk-chp-fade{
        background:linear-gradient(180deg, rgba(6,10,18,0), rgba(6,10,18,.70) 28%, rgba(6,10,18,.90) 56%, rgba(6,10,18,.97) 76%, rgba(6,10,18,1));
      }
      #${POPUP_ID}.has-overflow .mk-chp-fade{ opacity:.96; }
      #${POPUP_ID}.is-scrolled-near-end .mk-chp-fade{ opacity:.52; }
      #${POPUP_ID} .mk-chp-empty,
      #${POPUP_ID} .mk-chp-loading{
        opacity:.74;
      }
      #${POPUP_ID} .mk-chp-loading::after{
        content:"";
        display:block;
        height:2px;
        margin-top:.75rem;
        border-radius:999px;
        background:linear-gradient(90deg, color-mix(in srgb, var(--mk-chp-accent) 72%, transparent 28%), rgba(255,255,255,0));
        opacity:.72;
      }
    `;(document.head||document.documentElement).appendChild(st);}
function updateFadeVisibility(){const popup=getPopup();const scroll=popup.querySelector(".mk-chp-scroll");if(!scroll)return;const over=scroll.scrollHeight-scroll.clientHeight>8;const nearEnd=scroll.scrollTop+scroll.clientHeight>=scroll.scrollHeight-12;popup.classList.toggle("has-overflow",over);popup.classList.toggle("is-scrolled-near-end",over&&nearEnd);}
function bindScrollForFade(){const popup=getPopup();const scroll=popup.querySelector(".mk-chp-scroll");if(!scroll||scroll.__mkChpScrollBound)return;scroll.__mkChpScrollBound=true;scroll.addEventListener("scroll",updateFadeVisibility,{passive:true});}
function setPopupMeta(meta){const popup=getPopup();const headTitle=popup.querySelector(".mk-chp-head-title");const kind=normalizeKind(meta&&meta.kind)||"preview";const title=cleanTitle((meta&&meta.title)||"Preview");const titleHtml=String((meta&&meta.titleHtml)||"").trim();popup.setAttribute("data-kind",kind);popup.style.setProperty("--mk-chp-accent",accentForKind(kind));if(headTitle){headTitle.innerHTML=titleHtml||escapeHtml(title);normalizeMathMarkup(headTitle,{preserveRendered:true});wrapRawTexInTextNodes(headTitle);}}
function textHasRawMath(text){return/\\\(|\\\)|\\\[|\\\]|\$\$|(^|[^\\$])\$(?!\$)|\\begin\{/.test(String(text||""));}
function rootHasRawMath(root){if(!root)return false;try{const wrappers=[];if(root.matches&&root.matches(".arithmatex"))wrappers.push(root);if(root.querySelectorAll)wrappers.push(...root.querySelectorAll(".arithmatex"));if(wrappers.some((el)=>{const rendered=el.querySelector&&el.querySelector("mjx-container, .MathJax, .katex, math");return!rendered&&textHasRawMath(el.textContent||"");}))return true;}catch(_){}
try{const doc=root.ownerDocument||document;const walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){if(!node||!textHasRawMath(node.nodeValue||""))return NodeFilter.FILTER_REJECT;const parent=node.parentElement;if(!parent)return NodeFilter.FILTER_REJECT;if(parent.closest("script,style,noscript,pre,code,kbd,samp,textarea,mjx-container,.MathJax,.katex,math")){return NodeFilter.FILTER_REJECT;}
return NodeFilter.FILTER_ACCEPT;}});return!!walker.nextNode();}catch(_){return textHasRawMath(root.textContent||"");}}
function mathRuntimeReady(){return!!((window.__mkRenderDynamicMath&&typeof window.__mkRenderDynamicMath==="function")||(window.MathJax&&typeof window.MathJax.typesetPromise==="function")||typeof window.renderMathInElement==="function");}
function waitForMathRuntime(timeoutMs){if(mathRuntimeReady())return Promise.resolve(true);return new Promise((resolve)=>{let settled=false;let timer=0;const finish=(ready)=>{if(settled)return;settled=true;clearTimeout(timer);window.removeEventListener("mk:math-runtime-ready",onReady);resolve(!!ready);};const onReady=()=>finish(mathRuntimeReady());window.addEventListener("mk:math-runtime-ready",onReady,{once:true});timer=window.setTimeout(()=>finish(mathRuntimeReady()),Math.max(0,timeoutMs||0));});}
async function typesetMathTargets(targets,attempt){const els=(targets||[]).filter(Boolean);if(!els.length)return;const pass=Number.isFinite(attempt)?attempt:0;try{if(els.some((el)=>rootHasRawMath(el))&&!mathRuntimeReady()){warmMathRuntime(true);await waitForMathRuntime(MATH_RUNTIME_WAIT_MS);}
if(window.__mkRenderDynamicMath&&typeof window.__mkRenderDynamicMath==="function"){try{await Promise.resolve(window.__mkRenderDynamicMath(els));updateFadeVisibility();if(!els.some((el)=>rootHasRawMath(el)))return;}catch(_){}}
if(window.MathJax&&typeof window.MathJax.typesetPromise==="function"){const sp=window.MathJax.startup&&window.MathJax.startup.promise;if(sp&&typeof sp.then==="function"){try{await sp;}catch(_){}}
if(typeof window.MathJax.typesetClear==="function"){try{window.MathJax.typesetClear(els);}catch(_){}}
try{await window.MathJax.typesetPromise(els);}catch(_){}}
const needFallback=els.some((el)=>rootHasRawMath(el));if(needFallback&&window.renderMathInElement){for(const el of els){try{window.renderMathInElement(el,{delimiters:[{left:"$$",right:"$$",display:true},{left:"$",right:"$",display:false},{left:"\\(",right:"\\)",display:false},{left:"\\[",right:"\\]",display:true}],throwOnError:false});}catch(_){}}}
if(els.some((el)=>rootHasRawMath(el))&&pass+1<MATH_MAX_ATTEMPTS){await new Promise((resolve)=>window.setTimeout(resolve,MATH_RETRY_DELAY_MS));return typesetMathTargets(els,pass+1);}}catch(_){}
updateFadeVisibility();}
function setPopupContent(payload){const popup=getPopup();const content=popup.querySelector(".mk-chp-content");const scroll=popup.querySelector(".mk-chp-scroll");const headTitle=popup.querySelector(".mk-chp-head-title");if(!content||!scroll)return;const kind=normalizeKind(payload&&payload.kind)||"preview";setPopupMeta({kind,title:(payload&&payload.title)||"Preview",titleHtml:(payload&&payload.titleHtml)||""});content.innerHTML=(payload&&payload.html)||`<div class="mk-chp-empty">Preview unavailable.</div>`;normalizeMathMarkup(content,{preserveRendered:true});wrapRawTexInTextNodes(content);if(headTitle)normalizeMathMarkup(headTitle,{preserveRendered:true});scroll.scrollTop=0;updateFadeVisibility();const mathTargets=[content];if(headTitle)mathTargets.push(headTitle);requestAnimationFrame(()=>{requestAnimationFrame(()=>{typesetMathTargets(mathTargets).catch(()=>{});});});}
function setLoadingMeta(meta){setPopupMeta({kind:meta&&meta.kind,title:(meta&&meta.title)||state.currentTitle||"Preview"});}
function showLoading(meta){const popup=getPopup();const content=popup.querySelector(".mk-chp-content");const scroll=popup.querySelector(".mk-chp-scroll");if(!content||!scroll)return;setLoadingMeta(meta);content.innerHTML=`<div class="mk-chp-loading">Loading preview…</div>`;scroll.scrollTop=0;popup.classList.add("is-loading");updateFadeVisibility();}
function openPopup(){const popup=getPopup();const motionOn=motionEnabled();const alreadyOpen=popup.classList.contains("is-open");popup.classList.toggle("is-motion-on",motionOn);if(motionOn&&!alreadyOpen){state.animationSeq+=1;}
popup.classList.add("is-open");popup.setAttribute("aria-hidden","false");}
function closePopup(){const popup=getPopup();popup.classList.remove("is-open","is-swapping","is-loading","has-overflow","is-scrolled-near-end");popup.classList.toggle("is-motion-on",motionEnabled());popup.setAttribute("aria-hidden","true");}
function schedulePosition(){if(state.moveRaf)cancelAnimationFrame(state.moveRaf);state.moveRaf=requestAnimationFrame(positionPopup);}
function computePlacement(anchorRect,width,height){const vw=window.innerWidth;const vh=window.innerHeight;const spaceRight=vw-anchorRect.right-VIEWPORT_PAD-POPUP_GAP;const spaceLeft=anchorRect.left-VIEWPORT_PAD-POPUP_GAP;const spaceBottom=vh-anchorRect.bottom-VIEWPORT_PAD-POPUP_GAP;const spaceTop=anchorRect.top-VIEWPORT_PAD-POPUP_GAP;let placement="right";if(spaceRight>=Math.min(260,width)){placement="right";}else if(spaceLeft>=Math.min(260,width)){placement="left";}else if(spaceBottom>=Math.min(160,height)){placement="bottom";}else if(spaceTop>=Math.min(160,height)){placement="top";}else{const options=[["right",spaceRight],["left",spaceLeft],["bottom",spaceBottom],["top",spaceTop]].sort((a,b)=>b[1]-a[1]);placement=options[0][0];}
let left=0;let top=0;const anchorMidY=anchorRect.top+anchorRect.height/2;if(placement==="right"){left=anchorRect.right+POPUP_GAP;top=anchorMidY-Math.min(height*0.28,64);}else if(placement==="left"){left=anchorRect.left-width-POPUP_GAP;top=anchorMidY-Math.min(height*0.28,64);}else if(placement==="bottom"){left=anchorRect.left+anchorRect.width/2-width/2;top=anchorRect.bottom+POPUP_GAP;}else{left=anchorRect.left+anchorRect.width/2-width/2;top=anchorRect.top-height-POPUP_GAP;}
left=clamp(left,VIEWPORT_PAD,vw-width-VIEWPORT_PAD);top=clamp(top,VIEWPORT_PAD,vh-height-VIEWPORT_PAD);return{left:Math.round(left),top:Math.round(top),placement};}
function rectFromAnchorContents(anchor){if(!anchor||!anchor.ownerDocument)return null;try{const doc=anchor.ownerDocument;const range=doc.createRange();range.selectNodeContents(anchor);const rects=Array.from(range.getClientRects?range.getClientRects():[]).filter((r)=>r&&r.width>1&&r.height>1);range.detach&&range.detach();if(!rects.length)return null;let left=Infinity;let top=Infinity;let right=-Infinity;let bottom=-Infinity;for(const r of rects){left=Math.min(left,r.left);top=Math.min(top,r.top);right=Math.max(right,r.right);bottom=Math.max(bottom,r.bottom);}
if(!Number.isFinite(left)||!Number.isFinite(right)||right<=left||bottom<=top)return null;return{left,top,right,bottom,width:right-left,height:bottom-top,x:left,y:top};}catch(_){return null;}}
function previewAnchorRect(anchor){if(!anchor||!anchor.getBoundingClientRect)return null;const box=anchor.getBoundingClientRect();const content=rectFromAnchorContents(anchor);if(!content)return box;const boxW=Number(box.width)||0;const contentW=Number(content.width)||0;const stretched=boxW>contentW+48;const searchTitle=!!(anchor.classList&&anchor.classList.contains("csr-link"));if(searchTitle||stretched)return content;return box;}
function updatePinGeometry(pos,anchorRect,width,height){const popup=getPopup();const half=PIN_SIZE/2;if(pos.placement==="right"||pos.placement==="left"){const pinTop=clamp(anchorRect.top+anchorRect.height/2-pos.top-half,20,Math.max(20,height-PIN_SIZE-20));popup.style.setProperty("--mk-chp-pin-top",Math.round(pinTop)+"px");}else{const pinLeft=clamp(anchorRect.left+anchorRect.width/2-pos.left-half,26,Math.max(26,width-PIN_SIZE-26));popup.style.setProperty("--mk-chp-pin-left",Math.round(pinLeft)+"px");}}
function positionPopup(){state.moveRaf=0;const popup=getPopup();if(!popup||!state.activeAnchor)return;const anchorRect=state.currentAnchorRect||previewAnchorRect(state.activeAnchor);if(!anchorRect)return;state.currentAnchorRect=anchorRect;const desiredWidth=clamp(window.innerWidth*0.255,MIN_WIDTH,MAX_WIDTH);popup.style.width=Math.round(Math.min(desiredWidth,window.innerWidth-VIEWPORT_PAD*2))+"px";const popupRect=popup.getBoundingClientRect();const width=popupRect.width||Math.min(MAX_WIDTH,window.innerWidth-VIEWPORT_PAD*2);const height=Math.min(popupRect.height||220,window.innerHeight-VIEWPORT_PAD*2);const pos=computePlacement(anchorRect,width,height);state.currentPlacement=pos.placement;popup.setAttribute("data-placement",pos.placement);popup.style.left=pos.left+"px";popup.style.top=pos.top+"px";updatePinGeometry(pos,anchorRect,width,height);}
function clearTimers(){clearTimeout(state.enterTimer);clearTimeout(state.leaveTimer);clearTimeout(state.loadingDelayTimer);state.enterTimer=0;state.leaveTimer=0;state.loadingDelayTimer=0;}
function cancelPendingPreview(anchor,absUrl){const anchorMatches=!anchor||state.pendingAnchor===anchor;const urlMatches=!absUrl||state.pendingAbsUrl===absUrl;if(anchorMatches&&urlMatches){clearTimeout(state.enterTimer);state.enterTimer=0;state.pendingAnchor=null;state.pendingAbsUrl="";}}
function hidePopupNow(){clearTimers();clearDeferredIntent();cancelActiveDemand();const popup=getPopup();popup.style.left=VIEWPORT_PAD+"px";popup.style.top=VIEWPORT_PAD+"px";closePopup();state.activeAnchor=null;state.currentAbsUrl="";state.currentRelUrl="";state.currentTitle="";state.currentKind="";state.currentAnchorRect=null;state.currentPlacement="right";state.hoverAnchor=null;state.hoverAbsUrl="";state.hoverPopup=false;state.pendingAnchor=null;state.pendingAbsUrl="";}
function scheduleHide(){clearTimeout(state.leaveTimer);state.leaveTimer=window.setTimeout(()=>{state.leaveTimer=0;const popup=getPopup();if(state.hoverPopup)return;if(popup&&popup.matches&&popup.matches(":hover"))return;if(state.activeAnchor&&state.hoverAnchor&&sameAnchor(state.activeAnchor,state.hoverAnchor)&&state.currentAbsUrl===state.hoverAbsUrl)return;hidePopupNow();},LEAVE_DELAY_MS);}
function beginPreview(info,opts){if(!canUseHoverPreview())return;if(state.pendingAnchor&&(state.pendingAnchor!==info.anchor||state.pendingAbsUrl!==info.absUrl))return;if(!state.hoverAnchor||state.hoverAnchor!==info.anchor||state.hoverAbsUrl!==info.absUrl)return;if(scrollIsActive()){rememberDeferredIntent(info);return;}
state.pendingAnchor=null;state.pendingAbsUrl="";const switchOnly=!!(opts&&opts.switchOnly);const sameTarget=info.absUrl===state.currentAbsUrl;clearTimeout(state.leaveTimer);state.leaveTimer=0;if(state.demandEntry&&state.demandEntry.url!==info.absUrl)cancelActiveDemand();const entry=prefetch(info.absUrl,{demanded:true});state.demandEntry=entry;deferFeatureLoads();state.activeAnchor=info.anchor;state.currentAbsUrl=info.absUrl;state.currentRelUrl=info.relUrl;state.currentTitle=info.anchor.getAttribute("title")||cleanTitle(info.anchor.textContent||"")||info.relUrl;state.currentKind="";state.currentAnchorRect=previewAnchorRect(info.anchor);const seq=++state.requestSeq;const applyResolvedPayload=(payload)=>{if(seq!==state.requestSeq)return;if(!state.activeAnchor||state.currentAbsUrl!==info.absUrl)return;const normalizedPayload={title:(payload&&payload.title)||state.currentTitle||"Preview",titleHtml:(payload&&payload.titleHtml)||"",kind:normalizeKind(payload&&payload.kind),html:(payload&&payload.html)||`<div class="mk-chp-empty">Preview unavailable.</div>`};state.currentKind=normalizedPayload.kind;if(state.demandEntry===entry)state.demandEntry=null;if(entry)entry.demanded=false;const popup=getPopup();popup.classList.remove("is-loading","is-swapping");openPopup();setPopupContent(normalizedPayload);schedulePosition();updateFadeVisibility();};if(!entry){applyResolvedPayload(unavailablePayload());return;}
if(entryIsSettled(entry)){applyResolvedPayload(getPayload(entry));return;}
if(!switchOnly){showLoading({title:state.currentTitle,kind:""});openPopup();schedulePosition();}else{const popup=getPopup();popup.classList.add("is-swapping");setLoadingMeta({title:state.currentTitle,kind:""});schedulePosition();clearTimeout(state.loadingDelayTimer);state.loadingDelayTimer=window.setTimeout(()=>{state.loadingDelayTimer=0;if(seq!==state.requestSeq)return;if(!state.activeAnchor||state.currentAbsUrl!==info.absUrl)return;if(entryIsSettled(entry))return;showLoading({title:state.currentTitle,kind:""});openPopup();schedulePosition();},LOADING_SWAP_DELAY_MS);}
if(entry&&entry.promise){entry.promise.then(()=>{if(seq!==state.requestSeq)return;if(!state.activeAnchor||state.currentAbsUrl!==info.absUrl)return;deferFeatureLoads();applyResolvedPayload(getPayload(entry));});}}
function schedulePreview(info,opts){if(!canUseHoverPreview())return;clearDeferredIntent();deferFeatureLoads();state.pendingAnchor=info.anchor;state.pendingAbsUrl=info.absUrl;clearTimeout(state.enterTimer);clearTimeout(state.leaveTimer);state.leaveTimer=0;state.enterTimer=window.setTimeout(()=>{state.enterTimer=0;beginPreview(info,opts);},ENTER_DELAY_MS);}
function sameAnchor(a,b){return!!a&&!!b&&a===b;}
function isInsidePopup(node){const popup=state.popup||document.getElementById(POPUP_ID);return!!(node&&popup&&popup.contains(node));}
function onPopupMouseEnter(){state.hoverPopup=true;clearTimeout(state.leaveTimer);state.leaveTimer=0;}
function onPopupMouseLeave(ev){state.hoverPopup=false;const related=ev&&ev.relatedTarget;if(related&&isInsidePopup(related))return;const toInfo=qualifyAnchor(related);if(toInfo){state.hoverAnchor=toInfo.anchor;state.hoverAbsUrl=toInfo.absUrl;clearTimeout(state.leaveTimer);state.leaveTimer=0;if(state.activeAnchor&&sameAnchor(toInfo.anchor,state.activeAnchor))return;}
scheduleHide();}
function onPopupWheel(ev){const popup=getPopup();if(!popup.classList.contains("is-open"))return;const scroll=popup.querySelector(".mk-chp-scroll");if(!scroll)return;const maxScroll=Math.max(0,scroll.scrollHeight-scroll.clientHeight);if(maxScroll<=0){ev.preventDefault();ev.stopPropagation();return;}
const delta=Number.isFinite(ev.deltaY)?ev.deltaY:0;scroll.scrollTop=clamp(scroll.scrollTop+delta,0,maxScroll);updateFadeVisibility();ev.preventDefault();ev.stopPropagation();}
function onMouseOver(ev){if(!canUseHoverPreview())return;if(state.mouseDown)return;if(isInsidePopup(ev.target)){state.hoverPopup=true;clearTimeout(state.leaveTimer);state.leaveTimer=0;return;}
const info=qualifyAnchor(ev.target);if(!info)return;const related=ev.relatedTarget;if(related&&info.anchor.contains&&info.anchor.contains(related))return;const pointerWasKnown=Number.isFinite(state.lastPointerX)&&Number.isFinite(state.lastPointerY);const moved=pointerActuallyMoved(ev);const genuineMovement=moved&&(pointerWasKnown||eventReportsPhysicalMovement(ev));state.hoverAnchor=info.anchor;state.hoverAbsUrl=info.absUrl;if(!moved)return;if(scrollIsActive()){if(genuineMovement)rememberDeferredIntent(info);return;}
clearDeferredIntent();deferFeatureLoads();prefetch(info.absUrl);if(sameAnchor(state.activeAnchor,info.anchor)&&state.currentAbsUrl===info.absUrl){state.currentAnchorRect=previewAnchorRect(info.anchor);clearTimeout(state.leaveTimer);state.leaveTimer=0;openPopup();schedulePosition();return;}
const popupAlreadyOpen=!!(state.popup&&state.popup.classList.contains("is-open"));const switching=popupAlreadyOpen&&!!state.activeAnchor&&state.currentAbsUrl!==info.absUrl;schedulePreview(info,{switchOnly:switching});}
function onMouseMove(ev){if(!canUseHoverPreview())return;pointerActuallyMoved(ev);if(isInsidePopup(ev.target)){state.hoverPopup=true;clearTimeout(state.leaveTimer);state.leaveTimer=0;return;}
if(!state.activeAnchor&&!state.pendingAnchor&&!state.hoverAnchor){state.hoverPopup=false;let nearestLink=null;try{nearestLink=ev.target&&ev.target.closest&&ev.target.closest("a[href]");}catch(_){}
if(!nearestLink)return;}
state.hoverPopup=false;const info=qualifyAnchor(ev.target);if(info){state.hoverAnchor=info.anchor;state.hoverAbsUrl=info.absUrl;if(sameAnchor(info.anchor,state.activeAnchor)&&state.currentAbsUrl===info.absUrl){state.currentAnchorRect=previewAnchorRect(info.anchor);schedulePosition();return;}
if(scrollIsActive()){rememberDeferredIntent(info);return;}
if(sameAnchor(info.anchor,state.pendingAnchor))return;clearDeferredIntent();deferFeatureLoads();prefetch(info.absUrl);const popupOpen=!!(state.popup&&state.popup.classList.contains("is-open"));schedulePreview(info,{switchOnly:popupOpen&&!!state.activeAnchor&&state.currentAbsUrl!==info.absUrl});return;}
state.hoverAnchor=null;state.hoverAbsUrl="";clearDeferredIntent();cancelPendingPreview();if(!state.activeAnchor)return;state.currentAnchorRect=previewAnchorRect(state.activeAnchor);schedulePosition();scheduleHide();}
function onMouseOut(ev){const fromInfo=qualifyAnchor(ev.target);const from=fromInfo?fromInfo.anchor:null;if(!from)return;const related=ev.relatedTarget;if(related&&from.contains&&from.contains(related))return;if(state.deferredIntent&&state.deferredIntent.anchor===from)clearDeferredIntent();if(related&&isInsidePopup(related)){state.hoverPopup=true;clearTimeout(state.leaveTimer);state.leaveTimer=0;cancelPendingPreview(from,fromInfo.absUrl);return;}
const toInfo=qualifyAnchor(related);if(toInfo){state.hoverAnchor=toInfo.anchor;state.hoverAbsUrl=toInfo.absUrl;clearTimeout(state.leaveTimer);state.leaveTimer=0;if(!sameAnchor(toInfo.anchor,from)){cancelPendingPreview(from,fromInfo.absUrl);if(!scrollIsActive())prefetch(toInfo.absUrl);}
return;}
if(sameAnchor(state.hoverAnchor,from)){state.hoverAnchor=null;state.hoverAbsUrl="";}
cancelPendingPreview(from,fromInfo.absUrl);if(state.activeAnchor&&sameAnchor(state.activeAnchor,from)){scheduleHide();}}
function onPointerDown(ev){if(ev&&isInsidePopup(ev.target))return;state.mouseDown=true;hidePopupNow();}
function onPointerUp(){state.mouseDown=false;}
function onScrollOrResize(){if(!state.activeAnchor)return;if(state.scrollRaf)cancelAnimationFrame(state.scrollRaf);state.scrollRaf=requestAnimationFrame(()=>{state.scrollRaf=0;if(!state.activeAnchor)return;if(!document.contains(state.activeAnchor)){hidePopupNow();return;}
state.currentAnchorRect=previewAnchorRect(state.activeAnchor);schedulePosition();updateFadeVisibility();});}
function observeDom(){if(state.mo){try{state.mo.disconnect();}catch(_){}
state.mo=null;}
try{state.mo=new MutationObserver(()=>{if(!state.activeAnchor)return;if(!document.contains(state.activeAnchor))hidePopupNow();});state.mo.observe(document.body||document.documentElement,{childList:true,subtree:true});}catch(_){}}
function bindOnce(){if(state.bound)return;if(!canUseHoverPreview())return;state.bound=true;ensureStyles();getPopup();bindScrollForFade();observeDom();document.addEventListener("mouseover",onMouseOver,true);document.addEventListener("mousemove",onMouseMove,true);document.addEventListener("mouseout",onMouseOut,true);document.addEventListener("pointerdown",onPointerDown,true);document.addEventListener("pointerup",onPointerUp,true);window.addEventListener("scroll",onScrollActivity,{passive:true,capture:true});window.addEventListener("wheel",onScrollActivity,{passive:true});window.addEventListener("touchmove",onScrollActivity,{passive:true});window.addEventListener("scroll",onScrollOrResize,true);window.addEventListener("resize",onScrollOrResize,{passive:true});window.addEventListener("pageshow",hidePopupNow);window.addEventListener("mk:site-motion-change",()=>{syncMotionMode();hidePopupNow();});document.addEventListener("DOMContentSwitch",()=>{resetPathCaches();abortSpeculative();hidePopupNow();observeDom();});}
function refresh(){resetPathCaches();ensureStyles();getPopup();syncMotionMode();bindScrollForFade();observeDom();hidePopupNow();}
window.MkConceptHoverPreview={refresh,canUse:canUseHoverPreview,clearCache(){hidePopupNow();speculativeQueue.length=0;previewCache.forEach((entry)=>{if(!entry||!entry.started||entryIsSettled(entry))return;clearEntryDeadline(entry);entry.demanded=false;entry.dropAfterAbort=true;entry.aborted=true;entry.abortReason="cancel";try{entry.controller&&entry.controller.abort();}catch(_){}});previewCache.clear();},prefetch,stats(){return{cached:previewCache.size,queued:speculativeQueue.length,inflight:inflightCount,scrolling:scrollIsActive()};}};if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",bindOnce,{once:true});}else{bindOnce();}})();