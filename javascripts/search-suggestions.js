(function(){"use strict";function __mkFetchSearchIndex(url,init){const shared=window.__mkFetchJsonShared;if(typeof shared==="function")return shared(url,init);return fetch(url,init).then(function(r){return r&&r.ok?r.json():null;});}
if(window.__mkCustomSearchSuggestV11)return;window.__mkCustomSearchSuggestV11=true;window.__mkCustomSearchSuggestV10=true;window.__mkCustomSearchSuggestV9=true;window.__mkCustomSearchSuggestV8=true;window.__mkCustomSearchSuggestV7=true;window.__mkCustomSearchSuggestV6=true;window.__mkCustomSearchSuggestV5=true;window.__mkCustomSearchSuggestV4=true;const INPUT_SELECTOR='input[data-md-component="search-query"]';const MAX_RESULTS=64;const FUZZY_SCOPE_KEY="mk-search-suggest-pages-v1";const EXCLUDED_BASES=new Set(["about","about-this-wiki","contributors","custom-random","find","home","index","random","search","tags","trending"]);const COURSE_MAP={i2da:"Introduction to Data Analytics",m1c:"Math I: Calculus",orm:"OR Modelling",m2la:"Math II: Linear Algebra",pt:"Probability Theory for EOR",prog:"Programming for EOR",fin:"Finance for EOR",m3a:"Math III: Analysis",micro:"Microeconomics for EOR",m4mc:"Math IV: Multivariate Calculus",pd:"Probability Distributions",sm1:"Statistical Modelling for EOR",macro:"Macroeconomics for EOR",m5ala:"Math V: Advanced Linear Algebra",si:"Statistical Inference",lms:"Linear Models in Statistics",m6co:"Math VI: Convexity and Optimization",sor:"Stochastic Operations Research",dor:"Discrete Operations Research",i2e:"Introduction to Econometrics",li:"Life Insurance",gt:"Game Theory",ri:"Risk Insurance"};const STATE={bound:false,docs:null,docsPromise:null,renderTimer:0,renderSeq:0,typesetSeq:0,styleReady:false,searchIndexUrl:"",siteBasePath:"",activeInput:null,activeIndex:-1,activeQuery:""};function isHeaderSearchRoot(root){return!!(root&&root.closest&&root.closest('.md-header'));}
function isHeaderSearchInput(input){return!!(input&&input.matches&&input.matches(INPUT_SELECTOR)&&isHeaderSearchRoot(input.closest('.md-search')));}
function getHeaderSearchRoot(input){const i=input&&isHeaderSearchInput(input)?input:null;return(i&&i.closest('.md-search'))||document.querySelector('.md-header .md-search.md-search--active')||document.querySelector('.md-header .md-search')||null;}
function isMobileSearchLayout(){try{return!!(window.matchMedia&&window.matchMedia("(max-width: 900px), (pointer: coarse), (hover: none)").matches);}catch(_){return false;}}
function escapeHtml(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");}
function escapeRegex(s){return String(s||"").replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}
function stripHtml(s){if(!s)return"";const text=String(s);if(!/[<&]/.test(text))return text;const div=document.createElement("div");div.innerHTML=text;return div.textContent||div.innerText||"";}
function stripMarkdownLinkTargets(s){let out=String(s||"");if(!out)return"";out=out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,"$1").replace(/\[([^\]]+)\]\(([^)\s]+(?:\.md|\.html)(?:#[^)]+)?)\)/gi,"$1").replace(/\((?:[^()\s]+\/)?[^()\s]+(?:\.md|\.html)(?:#[^)]+)?\)/gi," ");return out;}
function normaliseText(s){return String(s||"").replace(/\s+/g," ").trim();}
function normaliseForSearch(s){const spelled=typeof window.__mkSymbolsToWords==="function"?window.__mkSymbolsToWords(s):s;return String(spelled||"").normalize("NFC").toLowerCase().replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim();}
function tokeniseQuery(q){return normaliseForSearch(q).split(" ").filter(Boolean);}
function isIgnoredSearchAnchor(anchorRaw){const anchor=String(anchorRaw||"").toLowerCase();if(!anchor)return false;return(anchor==="prerequisite"||anchor==="prerequisites"||anchor.startsWith("prerequisite-")||anchor.startsWith("prerequisites-")||anchor==="related"||anchor.startsWith("related-")||anchor==="related-content"||anchor.startsWith("related-content-")||anchor==="related-concept"||anchor==="related-concepts"||anchor.startsWith("related-concept-")||anchor.startsWith("related-concepts-"));}
function cleanSearchBodyText(raw){let s=normaliseText(stripMarkdownLinkTargets(stripHtml(raw)));if(!s)return"";s=s.replace(/\bLast\s+(?:updated|modified)\s*:\s*\d{1,2}\s+[A-Za-z]+\s+\d{4}(?:\s+\d{1,2}:\d{2})?/gi," ").replace(/\bLast\s+(?:updated|modified)\s*:\s*[^\n|]+/gi," ").replace(/\bAliases?\s*:\s*[^\n|]+/gi," ").replace(/\bMath\s+[IVX]+\s*:\s*[^·|]+·\s*(?:Lecture|Week)\s*\d+\b/gi," ").replace(/\bCourse\s*·\s*(?:Lecture|Week)\b/gi," ").replace(/\s+/g," ").trim();return s;}
function safePath(loc){return String(loc||"").split("#")[0].replace(/^\/+/,"");}
function siteBasePathFromIndexUrl(urlLike){try{const u=new URL(String(urlLike||""),window.location.href);const p=String(u.pathname||"");return p.replace(/(?:^|\/)search\/search_index\.json$/i,"/").replace(/(?:^|\/)search_index\.json$/i,"/").replace(/\/+/g,"/")||"/";}catch(_){return"/";}}
function getSiteBasePath(){if(STATE.siteBasePath)return STATE.siteBasePath;try{if(window.__md_scope&&window.__md_scope.pathname){const p=String(window.__md_scope.pathname||"").replace(/\/+/g,"/");if(p){STATE.siteBasePath=p.endsWith("/")?p:(p+"/");return STATE.siteBasePath;}}}catch(_){}
try{const baseHref=document.querySelector("base[href]")?.getAttribute("href")||"";if(baseHref){const u=new URL(baseHref,window.location.href);const p=String(u.pathname||"/").replace(/\/+/g,"/");STATE.siteBasePath=p.endsWith("/")?p:(p+"/");return STATE.siteBasePath;}}catch(_){}
STATE.siteBasePath="/";return STATE.siteBasePath;}
function toAbsoluteUrl(loc){const raw=String(loc||"").trim();if(!raw)return"";try{if(/^[a-z]+:\/\//i.test(raw))return new URL(raw).toString();}catch(_){}
try{const siteBase=getSiteBasePath();let path=raw.replace(/^\.\//,"");if(path.startsWith("/")){return new URL(path,window.location.origin).toString();}
const siteBaseTrim=siteBase.replace(/^\/|\/$/g,"");if(siteBaseTrim&&path.startsWith(siteBaseTrim+"/")){path=path.slice(siteBaseTrim.length+1);}
return new URL(path,window.location.origin+siteBase).toString();}catch(_){try{return new URL(raw,document.baseURI).toString();}catch(_){return raw;}}}
function fileBaseFromLocation(location){const loc=safePath(location);const file=(loc.split("/").pop()||"").replace(/\.html$/i,"");return file;}
function asStringList(x){if(!x)return[];if(Array.isArray(x))return x.map(String).filter(Boolean);if(typeof x==="string")return[x];return[];}
function getTagsFromDoc(d){const out=[];out.push(...asStringList(d&&d.tags));out.push(...asStringList(d&&d.tag));out.push(...asStringList(d&&d.meta&&d.meta.tags));out.push(...asStringList(d&&d.meta&&d.meta.tag));out.push(...asStringList(d&&d.meta&&d.meta["tags"]));return out.map((s)=>String(s).trim()).filter(Boolean);}
function splitAliasPieces(raw){const src=normaliseText(stripMarkdownLinkTargets(stripHtml(String(raw||"")))).replace(/\u00a0/g," ");if(!src)return[];return src.split(/\s*(?:,|;|•|·|\|)\s*/).map((s)=>String(s||"").trim()).filter(Boolean);}
function extractAliasesFromText(raw){const htmlish=String(raw||"");if(!htmlish)return[];const withBreaks=htmlish.replace(/<br\s*\/?>/gi,"\n").replace(/<\/(?:p|div|li|tr|td|th|h[1-6])>/gi,"\n");const plain=stripMarkdownLinkTargets(stripHtml(withBreaks)).replace(/\u00a0/g," ");if(!plain)return[];const out=[];const re=/(?:^|\n|\|)\s*aliases?\s*:\s*([^\n|]+)/ig;let m;while((m=re.exec(plain))){out.push(...splitAliasPieces(m[1]||""));}
return out;}
function getAliasesFromDoc(d){const raw=[];raw.push(...asStringList(d&&d.aliases));raw.push(...asStringList(d&&d.alias));raw.push(...asStringList(d&&d.meta&&d.meta.aliases));raw.push(...asStringList(d&&d.meta&&d.meta.alias));raw.push(...asStringList(d&&d.meta&&d.meta["aliases"]));const out=[];for(const item of raw)out.push(...splitAliasPieces(item));out.push(...extractAliasesFromText(d&&d.text));const seen=new Set();const deduped=[];for(const item of out){const s=String(item||"").trim();if(!s)continue;const key=s.toLowerCase();if(seen.has(key))continue;seen.add(key);deduped.push(s);}
return deduped;}
function isIndexPage(loc){const path=safePath(loc);if(!path)return true;if(path.endsWith("/"))return true;const base=(path.split("/").pop()||"").toLowerCase();return base==="index.html"||base==="index.md";}
function isRandomPage(loc){const path=safePath(loc);if(!path)return false;const base=(path.split("/").pop()||"").toLowerCase().replace(/\.html$/i,"");return base==="random"||/^random-\d/.test(base);}
function isUtilityPage(loc){const base=fileBaseFromLocation(loc).toLowerCase();return EXCLUDED_BASES.has(base);}
function isConceptPageLocation(loc){const path=safePath(loc);if(!path||path.endsWith("/"))return false;const segs=path.split("/").filter(Boolean);if(segs.length<3)return false;if(isIndexPage(path))return false;if(isRandomPage(path))return false;if(isUtilityPage(path))return false;return true;}
function stripPluralS(tok){tok=String(tok||"");if(tok.length<=3)return tok;if(!tok.endsWith("s"))return tok;if(tok.endsWith("ss")||tok.endsWith("us")||tok.endsWith("is")||tok.endsWith("as"))return tok;return tok.slice(0,-1);}
function pluralS(tok){tok=String(tok||"");if(tok.length<=2)return"";if(tok.endsWith("s"))return"";return tok+"s";}
function titleHitRatio(qToks,titleChars){const t=String(titleChars||"");if(!t)return 0;const toks=Array.isArray(qToks)?qToks:[];if(!toks.length)return 0;const marks=new Uint8Array(t.length);for(const raw of toks){const base=String(raw||"");if(!base)continue;const vars=new Set([base,stripPluralS(base)]);const p=pluralS(base);if(p)vars.add(p);for(const v0 of vars){const v=String(v0||"");if(v.length<1)continue;let idx=t.indexOf(v);while(idx!==-1){const end=Math.min(t.length,idx+v.length);for(let i=idx;i<end;i+=1)marks[i]=1;idx=t.indexOf(v,idx+1);}}}
let matched=0;for(let i=0;i<marks.length;i+=1)matched+=marks[i];return matched/Math.max(1,t.length);}
function latexMathToPlain(raw){let s=String(raw||"");if(!s)return"";s=s.replace(/\\begin\{[^}]+\}/g," ").replace(/\\end\{[^}]+\}/g," ").replace(/\\text\{([^}]*)\}/g," $1 ").replace(/\\mathrm\{([^}]*)\}/g," $1 ").replace(/\\operatorname\{([^}]*)\}/g," $1 ").replace(/\\left|\\right/g," ").replace(/\\[()\[\]]/g," ").replace(/\$\$([\s\S]*?)\$\$/g," $1 ").replace(/\$([^$]+)\$/g," $1 ").replace(/\\(?:displaystyle|textstyle|scriptstyle|scriptscriptstyle)\b/g," ").replace(/\\(?:qquad|quad|enspace|thinspace|medspace|thickspace)\b/g," ").replace(/\\([a-zA-Z]+)/g," $1 ").replace(/[{}_^]/g," ").replace(/[-–—]+/g," - ").replace(/\s+/g," ").trim();return s;}
function buildAliasVariants(raw){const out=new Set();const addNorm=(s)=>{const n=normaliseForSearch(s);if(!n)return;out.add(n);out.add(n.replace(/\s+/g,""));out.add(n.replace(/\s+/g,"-"));};const src=String(raw||"");if(!src)return Array.from(out);addNorm(src);addNorm(stripHtml(src));addNorm(latexMathToPlain(src));const re=/\\\((.*?)\\\)|\\\[(.*?)\\\]|\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g;let m;while((m=re.exec(src))){const piece=m[1]||m[2]||m[3]||m[4]||"";if(piece)addNorm(latexMathToPlain(piece));}
const plainNorm=normaliseForSearch(latexMathToPlain(src));if(plainNorm){const toks=plainNorm.split(" ").filter(Boolean);if(toks.length>=2){addNorm(toks.join(" "));addNorm(toks.join("-"));}}
return Array.from(out).filter(Boolean);}
function normalisePeriodType(raw){const t=String(raw||"").trim().toLowerCase();if(t==="week"||t==="weeks"||t==="wk"||t==="w")return"week";if(t==="lecture"||t==="lectures"||t==="lect"||t==="lec"||t==="l")return"lecture";return"";}
function courseCodeFromLocation(loc){const yc=yearCourseFromLocation(loc);const folder=String((yc&&yc.course)||"").toLowerCase();if(!folder)return"";const codes=Object.keys(COURSE_MAP).sort((a,b)=>b.length-a.length);for(const code of codes){const re=new RegExp(`(^|[-_\\s])${escapeRegex(code)}($|[-_\\s])`,"i");if(re.test(folder))return code;}
return"";}
function courseCodeFromTagsOrLocation(tags,loc){const list=Array.isArray(tags)?tags:(tags&&typeof tags.forEach==="function")?Array.from(tags):[];for(const raw of list){const t=String(raw||"").trim().toLowerCase();if(COURSE_MAP[t])return t;}
const codes=Object.keys(COURSE_MAP).sort((a,b)=>b.length-a.length);for(const raw of list){const t=String(raw||"").trim().toLowerCase();for(const code of codes){const re=new RegExp(`(^|[-_\\s])${escapeRegex(code)}($|[-_\\s])`,"i");if(re.test(t))return code;}}
return courseCodeFromLocation(loc);}
function teachingPeriodInfoFromTags(tagSetOrArr,loc){const tags=Array.isArray(tagSetOrArr)?tagSetOrArr:(tagSetOrArr&&typeof tagSetOrArr.forEach==="function")?Array.from(tagSetOrArr):[];const fullRe=/^([a-z0-9]+)[-_\s]?(lecture|lectures|lect|lec|l|week|weeks|wk|w)[-_\s]?0*(\d+)$/i;for(const raw of tags){const t=String(raw||"").trim().toLowerCase();const m=t.match(fullRe);if(!m)continue;const courseCode=m[1];const periodType=normalisePeriodType(m[2]);const periodNum=parseInt(m[3],10);const courseName=COURSE_MAP[courseCode];if(!courseName||!periodType||!(periodNum>0))continue;const label=periodType==="week"?"Week":"Lecture";return{courseCode,courseName,periodType,periodNum,periodLabel:label};}
const shortRe=/^(lecture|lectures|lect|lec|l|week|weeks|wk|w)[-_\s]?0*(\d+)$/i;const courseCode=courseCodeFromTagsOrLocation(tags,loc);const courseName=COURSE_MAP[courseCode]||"";if(!courseName)return null;for(const raw of tags){const t=String(raw||"").trim().toLowerCase();const m=t.match(shortRe);if(!m)continue;const periodType=normalisePeriodType(m[1]);const periodNum=parseInt(m[2],10);if(!periodType||!(periodNum>0))continue;const label=periodType==="week"?"Week":"Lecture";return{courseCode,courseName,periodType,periodNum,periodLabel:label};}
return null;}
function yearCourseFromLocation(loc){const s=String(loc||"").replace(/^\/+/,"");const segs=s.split("/").filter(Boolean);return{year:segs[0]||"",course:segs[1]||""};}
function yearOrderFromFolder(yearFolder){const m=String(yearFolder||"").match(/year-(\d+)/i);return m?parseInt(m[1],10):Number.MAX_SAFE_INTEGER;}
function courseOrderFromFolder(folder){const m=String(folder||"").match(/^(\d+)([a-z])-/i);if(!m)return Number.MAX_SAFE_INTEGER;const num=parseInt(m[1],10);const letter=(m[2]||"z").toLowerCase();const letterIndex=Math.max(0,letter.charCodeAt(0)-97);return num*100+letterIndex;}
function aggregateDocsToPages(docs){const pageMap=new Map();for(const d of docs||[]){const locFull=String((d&&d.location)||"");if(!locFull)continue;const pageLoc=safePath(locFull);if(!pageLoc)continue;if(!isConceptPageLocation(pageLoc))continue;let entry=pageMap.get(pageLoc);if(!entry){entry={location:pageLoc,title:"",text:"",tags:new Set(),aliases:new Set(),rawAliases:new Set()};pageMap.set(pageLoc,entry);}
const isPageLevel=!String(locFull).includes("#");if(isPageLevel&&d.title)entry.title=String(d.title);else if(!entry.title&&d.title)entry.title=String(d.title);for(const tg of getTagsFromDoc(d)){if(entry.tags.has(tg))continue;entry.tags.add(tg);for(const v of buildAliasVariants(tg))entry.aliases.add(v);}
for(const al of getAliasesFromDoc(d)){const rawAlias=String(al||"").trim();if(entry.rawAliases.has(rawAlias))continue;if(rawAlias)entry.rawAliases.add(rawAlias);entry.aliases.add(al);for(const v of buildAliasVariants(al))entry.aliases.add(v);}
const anchor=locFull.includes("#")?(locFull.split("#")[1]||"").toLowerCase():"";if(!isIgnoredSearchAnchor(anchor)&&d.text){const cleaned=cleanSearchBodyText(d.text);if(cleaned)entry.text+=" "+cleaned;}}
const out=[];for(const e of pageMap.values()){if(!e.title){const file=e.location.split("/").pop()||"Untitled";e.title=file.replace(/\.html$/i,"").replace(/-/g," ");}
for(const v of buildAliasVariants(e.title))e.aliases.add(v);out.push({location:e.location,title:e.title,text:e.text,tags:Array.from(e.tags),aliases:Array.from(e.aliases),rawAliases:Array.from(e.rawAliases||[])});}
return out;}
function createScoreFn(){const SCORE_FN_VERSION="alias-max-v4";if(window.__mkScoreDocKeyword&&typeof window.__mkScoreDocKeyword==="function"&&window.__mkScoreDocKeyword.__version===SCORE_FN_VERSION){return window.__mkScoreDocKeyword;}
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
const scoreDocKeyword=createScoreFn();function createSingleCharacterScorer(query){const raw=String(query||"").trim().normalize("NFC");const variants={"ϵ":"ε","ϑ":"θ","µ":"μ","ς":"σ","ϕ":"φ"};const q=variants[raw]||raw;if(Array.from(q).length!==1||!/[\p{L}\p{N}\p{Sm}]/u.test(q))return null;const literal=/^[a-z0-9]$/i.test(q)?new RegExp("(^|[^\\p{L}\\p{N}])"+escapeRegex(q)+"(?=$|[^\\p{L}\\p{N}])","iu"):new RegExp([q].concat(Object.keys(variants).filter(key=>variants[key]===q)).map(escapeRegex).join("|"),"u");const commands={"α":"alpha","β":"beta","γ":"gamma","δ":"delta","ε":"epsilon|varepsilon","ζ":"zeta","η":"eta","θ":"theta|vartheta","ι":"iota","κ":"kappa","λ":"lambda","μ":"mu","ν":"nu","ξ":"xi","π":"pi|varpi","ρ":"rho|varrho","σ":"sigma|varsigma","τ":"tau","υ":"upsilon","φ":"phi|varphi","χ":"chi","ψ":"psi","ω":"omega","Γ":"Gamma","Δ":"Delta","Θ":"Theta","Λ":"Lambda","Ξ":"Xi","Π":"Pi","Σ":"Sigma","Υ":"Upsilon","Φ":"Phi","Ψ":"Psi","Ω":"Omega","∞":"infty","∑":"sum","∏":"prod","∫":"int|iint|iiint|oint","∂":"partial","∇":"nabla","∈":"in","∉":"notin","∅":"emptyset|varnothing","≤":"le|leq","≥":"ge|geq","≠":"ne|neq","≈":"approx","±":"pm","×":"times","·":"cdot","∪":"cup","∩":"cap","⊂":"subset","⊆":"subseteq"};const command=commands[q]?new RegExp("\\\\(?:"+commands[q]+")(?![A-Za-z])"):null;const blackboard={"ℝ":"R","ℕ":"N","ℤ":"Z","ℚ":"Q","ℂ":"C"};const blackboardCommand=blackboard[q]?new RegExp("\\\\mathbb\\s*(?:\\{\\s*"+blackboard[q]+"\\s*\\}|"+blackboard[q]+"(?![A-Za-z]))"):null;const matches=value=>{const text=String(value||"").normalize("NFC");return literal.test(text)||!!(command&&command.test(text))||!!(blackboardCommand&&blackboardCommand.test(text));};return doc=>{if(!doc)return 0;if(matches(doc.title))return 1000;if([].concat(doc.rawAliases||[],doc.aliases||[],doc.tags||[]).some(matches))return 700;return matches(doc.text)?80:0;};}
function getSortedHits(query,docs){const out=[];let i=0;const singleCharacterScore=createSingleCharacterScorer(query);for(const doc of docs||[]){const score=singleCharacterScore?singleCharacterScore(doc):scoreDocKeyword(query,doc);if(!(score>0))continue;const cov=scoreDocKeyword.coverage?scoreDocKeyword.coverage(query,doc):0;out.push({doc,score,cov,__i:i+=1});}
out.sort((a,b)=>{const sa=Number(a.score)||0;const sb=Number(b.score)||0;if(sb!==sa)return sb-sa;const ca=Number(a.cov)||0;const cb=Number(b.cov)||0;if(cb!==ca)return cb-ca;const pa=yearCourseFromLocation(a.doc&&a.doc.location);const pb=yearCourseFromLocation(b.doc&&b.doc.location);const ya=yearOrderFromFolder(pa.year);const yb=yearOrderFromFolder(pb.year);if(ya!==yb)return ya-yb;const oa=courseOrderFromFolder(pa.course);const ob=courseOrderFromFolder(pb.course);if(oa!==ob)return oa-ob;const la=teachingPeriodInfoFromTags(a.doc&&a.doc.tags,a.doc&&a.doc.location);const lb=teachingPeriodInfoFromTags(b.doc&&b.doc.tags,b.doc&&b.doc.location);const lan=la?la.periodNum:0;const lbn=lb?lb.periodNum:0;if(lan!==lbn)return lan-lbn;const lat=la?la.periodType:"";const lbt=lb?lb.periodType:"";if(lat!==lbt)return lat.localeCompare(lbt,undefined,{sensitivity:"base"});const ta=String(a.doc&&a.doc.title||"");const tb=String(b.doc&&b.doc.title||"");const c=ta.localeCompare(tb,undefined,{sensitivity:"base"});if(c!==0)return c;const loa=String(a.doc&&a.doc.location||"");const lob=String(b.doc&&b.doc.location||"");const c2=loa.localeCompare(lob,undefined,{sensitivity:"base"});if(c2!==0)return c2;return(a.__i||0)-(b.__i||0);});return out;}
function getSearchIndexCandidates(){try{const asset=document.querySelector('script[src*="/javascripts/search-suggestions.js"], script[src*="javascripts/search-suggestions.js"]')||document.querySelector('link[href*="/stylesheets/main."], link[href*="stylesheets/main."]');const raw=asset&&(asset.getAttribute("src")||asset.getAttribute("href"));if(raw){const url=new URL(raw,document.baseURI);const marker=url.pathname.includes("/javascripts/")?"/javascripts/":"/stylesheets/";const index=url.pathname.lastIndexOf(marker);if(index>=0){url.pathname=url.pathname.slice(0,index+1);url.search="";url.hash="";return[new URL("search/search_index.json",url).toString()];}}}catch(_){}
try{const root=window.__md_scope&&window.__md_scope.pathname?new URL(String(window.__md_scope.pathname),window.location.origin):new URL("/",window.location.origin);return[new URL("search/search_index.json",root).toString()];}catch(_){return[new URL("/search/search_index.json",window.location.origin).toString()];}}
async function loadIndex(){const candidates=getSearchIndexCandidates();for(const u of candidates){try{const j=await __mkFetchSearchIndex(u,{cache:"no-cache"});if(j&&Array.isArray(j.docs)&&j.docs.length){STATE.searchIndexUrl=String(u||"");STATE.siteBasePath=siteBasePathFromIndexUrl(u);return j;}}catch(_){}}
return{docs:[]};}
function fallbackDocsFromMaterialDom(){const items=Array.from(document.querySelectorAll(".md-search-result__item"));if(!items.length)return[];const pageMap=new Map();for(const item of items){const link=item.querySelector("a.md-search-result__link")||item.querySelector("a[href]");const href=link?String(link.getAttribute("href")||""):"";if(!href)continue;const pageLoc=safePath(href);if(!pageLoc||!isConceptPageLocation(pageLoc))continue;const titleEl=item.querySelector(".md-search-result__title")||link;const title=normaliseText(stripHtml(titleEl?titleEl.innerHTML:link.textContent||""));const text=normaliseText(item.textContent||"");if(!pageMap.has(pageLoc)){pageMap.set(pageLoc,{location:pageLoc,title:title||fileBaseFromLocation(pageLoc).replace(/-/g," "),text,tags:[],aliases:buildAliasVariants(title||fileBaseFromLocation(pageLoc)),rawAliases:[]});}else{const e=pageMap.get(pageLoc);if(!e.title&&title)e.title=title;e.text+=" "+text;}}
return Array.from(pageMap.values());}
async function ensureDocs(){if(STATE.docs)return STATE.docs;if(STATE.docsPromise)return STATE.docsPromise;STATE.docsPromise=(async()=>{const indexJson=await loadIndex();const docs=indexJson&&Array.isArray(indexJson.docs)?indexJson.docs:[];let pages=aggregateDocsToPages(docs);if(!pages.length)pages=fallbackDocsFromMaterialDom();STATE.docs=pages;return pages;})();return STATE.docsPromise;}
function hasExplicitMathDelimiters(s){const t=String(s||"");return/\\\(|\\\[|\$\$|\$[^$]|\\begin\{[^}]+\}|\\end\{[^}]+\}/.test(t);}
function looksLikeBareLatexMath(s){const t=String(s||"");if(!t)return false;return/\\(?:displaystyle|textstyle|scriptstyle|scriptscriptstyle|frac|lim|limits|sum|prod|int|sqrt|left|right|to|infty|color|text|mathrm|operatorname|mathbb|mathcal|cdot|times|leq|geq|neq|approx|alpha|beta|gamma|delta|epsilon|theta|lambda|mu|sigma|phi|pi)\b|[_^]\{|\\[,;:!%]/.test(t);}
function containsMathMarkup(s){return hasExplicitMathDelimiters(s)||looksLikeBareLatexMath(s);}
function queryHighlightTokens(query){const seen=new Set();const out=[];for(const raw of tokeniseQuery(query)){const base=String(raw||"").trim();if(!base)continue;const sing=stripPluralS(base);const plural=pluralS(sing||base);for(const v of[base,sing,plural]){const tok=String(v||"").trim();if(!tok||seen.has(tok))continue;seen.add(tok);out.push(tok);}}
return out.sort((a,b)=>b.length-a.length);}
function queryHighlightPieces(query){const src=String(query||"");if(!src)return[];const seen=new Set();const out=[];const re=/[A-Za-z0-9]+|[-–—]+/g;let m;while((m=re.exec(src))){const piece=String(m[0]||"").trim();if(!piece)continue;if(/^[-–—]+$/.test(piece)){if(!seen.has("-")){seen.add("-");out.push("-");}
continue;}
for(const v of tokenVariants(piece.toLowerCase())){const tok=String(v||"").trim();if(!tok||seen.has(tok))continue;seen.add(tok);out.push(tok);}}
return out.sort((a,b)=>b.length-a.length);}
function buildLooseHighlightRegex(query,flags){const pieces=queryHighlightPieces(query);if(!pieces.length)return null;const pats=pieces.map((p)=>{if(p==="-")return"[-–—]";return escapeRegex(p);});return new RegExp(`(${pats.join("|")})`,flags||"ig");}
function highlightPlainTextLoose(raw,query){const src=String(raw||"");const escaped=escapeHtml(src);const re=buildLooseHighlightRegex(query,"ig");if(!escaped||!re)return escaped;return escaped.replace(re,'<mark class="mk-search-suggest__hl">$1</mark>');}
function fieldHasAnyQueryPiece(raw,query){const plain=normaliseText(stripMarkdownLinkTargets(latexMathToPlain(stripHtml(raw))));const pieces=queryHighlightPieces(query);if(!plain||!pieces.length)return false;const low=plain.toLowerCase();for(const p of pieces){if(p==="-"){if(/[-–—]/.test(String(raw||""))||/[-–—]/.test(plain))return true;continue;}
if(low.includes(String(p).toLowerCase()))return true;}
return false;}
function buildWholeWordRegex(query,flags){const toks=queryHighlightTokens(query);if(!toks.length)return null;return new RegExp(`(^|[^a-z0-9])(${toks.map(escapeRegex).join("|")})(?=[^a-z0-9]|$)`,flags||"ig");}
function highlightPlainTextWholeWord(raw,query){const src=String(raw||"");const re=buildWholeWordRegex(query,"ig");if(!src||!re)return escapeHtml(src);let out="";let last=0;let m;while((m=re.exec(src))){const prefix=String(m[1]||"");const token=String(m[2]||"");const start=m.index;const tokenStart=start+prefix.length;const tokenEnd=tokenStart+token.length;out+=escapeHtml(src.slice(last,start));out+=escapeHtml(prefix);out+=`<mark class="mk-search-suggest__hl">${escapeHtml(src.slice(tokenStart, tokenEnd))}</mark>`;last=tokenEnd;if(re.lastIndex<=start)re.lastIndex=tokenEnd;}
out+=escapeHtml(src.slice(last));return out;}
function firstWholeWordMatchIndex(raw,query){const src=String(raw||"");const re=buildWholeWordRegex(query,"i");if(!src||!re)return-1;const m=re.exec(src);return m?(m.index+String(m[1]||"").length):-1;}
function fieldHasAnyQueryTokenWholeWord(raw,query){const src=normaliseText(stripMarkdownLinkTargets(latexMathToPlain(stripHtml(raw))));const re=buildWholeWordRegex(src&&query?query:"","i");if(!src||!re)return false;return re.test(src);}
function highlightPlainText(raw,query){const src=String(raw||"");const escaped=escapeHtml(src);const toks=queryHighlightTokens(query);if(!escaped||!toks.length)return escaped;const re=new RegExp(`(${toks.map(escapeRegex).join("|")})`,"ig");return escaped.replace(re,'<mark class="mk-search-suggest__hl">$1</mark>');}
function getMathSegmentRegex(){return/(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\$[^$]+\$|\\begin\{[a-zA-Z*]+\}[\s\S]*?\\end\{[a-zA-Z*]+\})/g;}
const MATH_HIGHLIGHT_COLOR="#00bda4";const SAFE_MATH_OPERATOR_COMMANDS=new Set(["lim","max","min","sup","inf","sin","cos","tan","cot","sec","csc","sinh","cosh","tanh","arcsin","arccos","arctan","log","ln","exp","det","dim","gcd","lcm","ker","arg","deg","hom","Pr","mod","pmod"].map((x)=>String(x).toLowerCase()));function hasDashHighlightPiece(query){return queryHighlightPieces(query).includes("-");}
function buildMathPieceRegex(query,flags){const pieces=queryHighlightPieces(query).filter((p)=>p&&p!=="-");if(!pieces.length)return null;return new RegExp(`(${pieces.map(escapeRegex).join("|")})`,flags||"ig");}
const MATH_LIMIT_INNER_COLOR="black";function mathCommandName(commandToken){return String(commandToken||"").replace(/^\\+/,"").replace(/\*+$/,"").toLowerCase();}
function mathCommandMatchesQuery(name,query){const n=String(name||"").toLowerCase();if(!n)return false;const re=buildMathPieceRegex(query,"i");return!!(re&&re.test(n));}
function skipTexSpaces(src,pos){let i=Math.max(0,Number(pos)||0);const s=String(src||"");while(i<s.length&&/\s/.test(s[i]))i+=1;return i;}
function readTexGroup(src,pos){const s=String(src||"");const start=Number(pos)||0;if(s[start]!=="{")return null;let depth=0;for(let i=start;i<s.length;i+=1){const ch=s[i];if(ch==="\\"){i+=1;continue;}
if(ch==="{")depth+=1;else if(ch==="}"){depth-=1;if(depth===0){return{raw:s.slice(start,i+1),body:s.slice(start+1,i),end:i+1};}}}
return null;}
function readTexArgument(src,pos){const s=String(src||"");let i=skipTexSpaces(s,pos);if(i>=s.length)return null;if(s[i]==="{"){const g=readTexGroup(s,i);if(!g)return null;return{body:g.body,end:g.end};}
if(s[i]==="\\"){let j=i+1;if(/[A-Za-z]/.test(s[j]||"")){while(j<s.length&&/[A-Za-z*]/.test(s[j]))j+=1;}else{j=Math.min(s.length,i+2);}
return{body:s.slice(i,j),end:j};}
return{body:s[i],end:i+1};}
function readLimAdornments(src,pos){const s=String(src||"");let i=skipTexSpaces(s,pos);let latex="";let found=false;if(s.slice(i,i+7)==="\\limits"){latex+="\\limits";i+=7;found=true;}
for(let guard=0;guard<2;guard+=1){i=skipTexSpaces(s,i);const marker=s[i];if(marker!=="_"&&marker!=="^")break;const arg=readTexArgument(s,i+1);if(!arg)break;latex+=`${marker}{\\color{${MATH_LIMIT_INNER_COLOR}}{${arg.body}}}`;i=arg.end;found=true;}
return found?{latex,end:i}:null;}
function maybeHighlightLimWithAdornments(src,cmd,cmdEnd,query){if(mathCommandName(cmd)!=="lim")return null;if(!mathCommandMatchesQuery("lim",query))return null;const adorn=readLimAdornments(src,cmdEnd);if(!adorn)return null;return{end:adorn.end,latex:`{\\color{${MATH_HIGHLIGHT_COLOR}}{${cmd}${adorn.latex}}}`};}
function highlightMathIdentifierRun(run,query){const src=String(run||"");const re=buildMathPieceRegex(query,"ig");if(!src||!re)return src;return src.replace(re,(m)=>`{\\color{${MATH_HIGHLIGHT_COLOR}}{${m}}}`);}
function maybeHighlightMathCommand(commandToken,query){const raw=String(commandToken||"");if(!raw)return raw;const name=mathCommandName(raw);if(!SAFE_MATH_OPERATOR_COMMANDS.has(name))return raw;const re=buildMathPieceRegex(query,"i");if(!re||!re.test(name))return raw;return`{\\color{${MATH_HIGHLIGHT_COLOR}}{${raw}}}`;}
function highlightMathSource(raw,query){const src=String(raw||"");if(!src)return src;const pieceRe=buildMathPieceRegex(query,"ig");const wantDash=hasDashHighlightPiece(query);if(!pieceRe&&!wantDash)return src;let out="";let i=0;while(i<src.length){const ch=src[i];if(ch==="\\"){const next=src[i+1]||"";if(/[A-Za-z]/.test(next)){let j=i+1;while(j<src.length&&/[A-Za-z*]/.test(src[j]))j+=1;const cmd=src.slice(i,j);const cmdName=mathCommandName(cmd);if((cmdName==="begin"||cmdName==="end")&&src[j]==="{"){let k=j+1;while(k<src.length&&src[k]!=="}")k+=1;out+=src.slice(i,Math.min(src.length,k+1));i=Math.min(src.length,k+1);continue;}
const limBlock=maybeHighlightLimWithAdornments(src,cmd,j,query);if(limBlock){out+=limBlock.latex;i=limBlock.end;continue;}
out+=maybeHighlightMathCommand(cmd,query);i=j;continue;}
out+=src.slice(i,Math.min(src.length,i+2));i+=Math.min(2,src.length-i);continue;}
if(/[A-Za-z0-9]/.test(ch)){let j=i+1;while(j<src.length&&/[A-Za-z0-9]/.test(src[j]))j+=1;out+=highlightMathIdentifierRun(src.slice(i,j),query);i=j;continue;}
if(wantDash&&/[-–—]/.test(ch)){out+=`{\\color{${MATH_HIGHLIGHT_COLOR}}{${ch}}}`;i+=1;continue;}
out+=ch;i+=1;}
return out;}
function hasBalancedInlineMathDelimiters(s){const src=String(s||"");if(!src)return true;const count=(re)=>{const m=src.match(re);return m?m.length:0;};if(count(/\\\(/g)!==count(/\\\)/g))return false;if(count(/\\\[/g)!==count(/\\\]/g))return false;if(count(/\$\$/g)%2!==0)return false;const singleDollarCount=count(/(^|[^\\$])\$(?!\$)/g);if(singleDollarCount%2!==0)return false;const beginNames=Array.from(src.matchAll(/\\begin\{([^}]+)\}/g)).map((x)=>x[1]);const endNames=Array.from(src.matchAll(/\\end\{([^}]+)\}/g)).map((x)=>x[1]);if(beginNames.length!==endNames.length)return false;for(let i=0;i<beginNames.length;i+=1){if(beginNames[i]!==endNames[i])return false;}
return true;}
function snippetSafeForMathRender(snippet){const src=String(snippet||"");if(!src)return true;if(!containsMathMarkup(src))return true;return hasBalancedInlineMathDelimiters(src);}
function normaliseMathSegmentForRender(raw){const src=String(raw||"").trim();if(!src)return"";if(/^\\begin\{[a-zA-Z*]+\}[\s\S]*\\end\{[a-zA-Z*]+\}$/.test(src)){return`\\[${src}\\]`;}
return src;}
function renderBareLatexMathSegment(segment,query){let math=String(segment||"").trim();if(!math)return"";math=normaliseMathSegmentForRender(math);if(!hasExplicitMathDelimiters(math)){math=`\\(${math}\\)`;}
const plain=normaliseText(stripMarkdownLinkTargets(latexMathToPlain(math)));if(!fieldHasAnyQueryPiece(plain,query)&&!fieldHasAnyQueryPiece(math,query)){return escapeHtml(math);}
return escapeHtml(highlightMathSource(math,query));}
function renderBareLatexSnippetHtml(snippet,query){const src=String(snippet||"");if(!src||hasExplicitMathDelimiters(src)||!looksLikeBareLatexMath(src))return"";const startRe=/\\(?:displaystyle|frac|lim|sum|prod|int|sqrt|left|right|color|mathbb|mathcal|mathrm|operatorname)\b/g;const boundaryRe=/\s+(?=(?:Then|Hence|Thus|Therefore|So|If|Since|This|It|We|A|An|The)\b)/g;let out="";let last=0;let found=false;let m;while((m=startRe.exec(src))){const start=m.index;if(start<last)continue;let end=src.length;const tail=src.slice(start);boundaryRe.lastIndex=0;const b=boundaryRe.exec(tail);if(b&&b.index>8)end=start+b.index;while(end>start&&/\s/.test(src[end-1]))end-=1;if(src.slice(Math.max(start,end-1),end)==="…")end-=1;out+=highlightPlainTextLoose(src.slice(last,start),query);out+=renderBareLatexMathSegment(src.slice(start,end),query);last=end;startRe.lastIndex=end;found=true;}
if(!found)return"";out+=highlightPlainTextLoose(src.slice(last),query);return out;}
function renderSnippetHtml(snippet,query){const src=String(snippet||"").trim();if(!src)return"";if(!hasExplicitMathDelimiters(src)&&looksLikeBareLatexMath(src)){const bare=renderBareLatexSnippetHtml(src,query);if(bare)return bare;}
if(snippetSafeForMathRender(src)){return highlightPreservingMath(src,query);}
const fallback=normaliseText(stripMarkdownLinkTargets(latexMathToPlain(src)));return fallback?highlightPlainTextWholeWord(fallback,query):"";}
function highlightPreservingMath(raw,query){const src=String(raw||"");if(!src)return"";if(!containsMathMarkup(src))return highlightPlainText(src,query);const parts=src.split(getMathSegmentRegex());return parts.map((part)=>{if(!part)return"";const isMath=/^(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\$[^$]+\$|\\begin\{[a-zA-Z*]+\}[\s\S]*?\\end\{[a-zA-Z*]+\})$/.test(part);if(!isMath)return highlightPlainTextLoose(part,query);const mathRaw=String(part||"");const mathPlain=normaliseText(stripMarkdownLinkTargets(latexMathToPlain(mathRaw)));const mathRenderRaw=normaliseMathSegmentForRender(mathRaw);if(!mathPlain)return escapeHtml(mathRenderRaw);if(!fieldHasAnyQueryPiece(mathPlain,query)&&!fieldHasAnyQueryPiece(mathRaw,query)){return escapeHtml(mathRenderRaw);}
return escapeHtml(highlightMathSource(mathRenderRaw,query));}).join("");}
function formatCoursePeriodMeta(doc){const info=teachingPeriodInfoFromTags(doc&&doc.tags,doc&&doc.location);if(!info)return"";return`${info.courseName} · ${info.periodLabel} ${info.periodNum}`;}
function tokenVariants(tok){const base=String(tok||"").trim();if(!base)return[];const out=new Set();out.add(base);const sing=stripPluralS(base);if(sing)out.add(sing);const plural=pluralS(sing||base);if(plural)out.add(plural);return Array.from(out).filter(Boolean);}
function firstMatchIndex(raw,query){const src=String(raw||"");const toks=queryHighlightTokens(query);if(!src||!toks.length)return-1;const re=new RegExp(`(${toks.map(escapeRegex).join("|")})`,"i");const m=re.exec(src);return m?m.index:-1;}
function expandRangeToAvoidMathCutting(src,start,end){const text=String(src||"");let s=Math.max(0,Math.min(text.length,Number(start)||0));let e=Math.max(s,Math.min(text.length,Number(end)||0));const re=getMathSegmentRegex();let changed=true;while(changed){changed=false;re.lastIndex=0;let m;while((m=re.exec(text))){const ms=m.index;const me=ms+m[0].length;if(s>ms&&s<me){s=ms;changed=true;}
if(e>ms&&e<me){e=me;changed=true;}}}
return{start:s,end:e};}
function buildSnippetWindow(src,query,maxLen,opts){const text=normaliseText(src);if(!text)return null;const idx=opts&&opts.wholeWord?firstWholeWordMatchIndex(text,query):firstMatchIndex(text,query);if(idx<0)return null;const limit=Math.max(64,Number(maxLen)||96);const beforeRatio=Math.max(0.08,Math.min(0.35,Number(opts&&opts.beforeRatio)||0.18));let start=Math.max(0,idx-Math.floor(limit*beforeRatio));let end=Math.min(text.length,start+limit);if(end-start<limit)start=Math.max(0,end-limit);if(start>0){const nextSpace=text.indexOf(" ",start);if(nextSpace!==-1&&nextSpace-start<=14)start=nextSpace+1;}
if(end<text.length){const prevSpace=text.lastIndexOf(" ",end);if(prevSpace>start+Math.floor(limit*0.45))end=prevSpace;}
if(opts&&opts.avoidMathCutting){({start,end}=expandRangeToAvoidMathCutting(text,start,end));}
let snippet=text.slice(start,end).trim();if(!snippet)return null;if(start>0)snippet="… "+snippet;if(end<text.length)snippet=snippet+" …";return{snippet,start,end,limit};}
function buildSnippetHtml(raw,query,maxLen){const src=normaliseText(stripMarkdownLinkTargets(stripHtml(raw)));if(!src)return"";const rawWholeWindow=buildSnippetWindow(src,query,maxLen,{beforeRatio:0.16,avoidMathCutting:true,wholeWord:true});if(rawWholeWindow&&snippetSafeForMathRender(rawWholeWindow.snippet)){return renderSnippetHtml(rawWholeWindow.snippet,query);}
const rawLooseWindow=buildSnippetWindow(src,query,maxLen,{beforeRatio:0.16,avoidMathCutting:true,wholeWord:false});if(rawLooseWindow&&snippetSafeForMathRender(rawLooseWindow.snippet)){return renderSnippetHtml(rawLooseWindow.snippet,query);}
const plainSrc=normaliseText(stripMarkdownLinkTargets(latexMathToPlain(src)));if(!plainSrc)return"";const plainLimit=Math.min(108,Math.max(76,Number(maxLen)||96));const plainWholeWindow=buildSnippetWindow(plainSrc,query,plainLimit,{beforeRatio:0.14,avoidMathCutting:false,wholeWord:true});if(plainWholeWindow)return highlightPlainTextWholeWord(plainWholeWindow.snippet,query);const plainLooseWindow=buildSnippetWindow(plainSrc,query,plainLimit,{beforeRatio:0.14,avoidMathCutting:false,wholeWord:false});if(!plainLooseWindow)return"";return highlightPlainTextLoose(plainLooseWindow.snippet,query);}
function getMatchingAliasHtml(doc,query){const rawAliases=Array.isArray(doc&&doc.rawAliases)?doc.rawAliases:[];if(!rawAliases.length)return"";let bestAlias="";let bestScore=-1;for(const rawAlias of rawAliases){const src=String(rawAlias||"").trim();if(!src)continue;const variants=buildAliasVariants(src);const toks=tokeniseQuery(query);if(!toks.length)continue;let matched=0;for(const tok of toks){const tVars=tokenVariants(tok);let tokMatched=false;for(const av of variants){for(const v of tVars){if(v&&String(av||"").includes(v)){tokMatched=true;break;}}
if(tokMatched)break;}
if(tokMatched)matched+=1;}
if(!matched)continue;const score=matched*100-src.length;if(score>bestScore){bestScore=score;bestAlias=src;}}
if(!bestAlias)return"";const highlighted=highlightPreservingMath(bestAlias,query);if(highlighted.includes("mk-search-suggest__hl"))return highlighted;return`<span class="mk-search-suggest__hl">${highlighted}</span>`;}
function renderDetailHtml(doc,query){const parts=[];const aliasHtml=getMatchingAliasHtml(doc,query);if(aliasHtml){parts.push(`
        <div class="mk-search-suggest__detail mk-search-suggest__detail--alias">
          <span class="mk-search-suggest__detail-label">alias:</span>
          <span class="mk-search-suggest__alias-value">${aliasHtml}</span>
        </div>
      `);}
const bodyText=cleanSearchBodyText(String((doc&&doc.text)||""));if(fieldHasAnyQueryPiece(bodyText,query)||fieldHasAnyQueryTokenWholeWord(bodyText,query)){const snippetHtml=buildSnippetHtml(bodyText,query,104);if(snippetHtml){const detailClass=containsMathMarkup(snippetHtml)?"mk-search-suggest__detail mk-search-suggest__detail--math":"mk-search-suggest__detail";parts.push(`<div class="${detailClass}">${snippetHtml}</div>`);}}
return parts.join("");}
function addQueryToHistory(query){const q=String(query||"").trim();if(!q)return;const STORAGE_KEY="mk_search_history_v1";const MAX_ITEMS=12;try{const raw=localStorage.getItem(STORAGE_KEY);const arr=raw?JSON.parse(raw):[];const list=Array.isArray(arr)?arr.filter(Boolean).map(String):[];const next=[q,...list.filter((x)=>String(x||"").trim().toLowerCase()!==q.toLowerCase())].slice(0,MAX_ITEMS);localStorage.setItem(STORAGE_KEY,JSON.stringify(next));}catch(_){}}
function getVisibleSuggestionItems(input){const box=ensureCustomContainer(input);if(!box||box.hidden)return[];return Array.from(box.querySelectorAll(".mk-search-suggest__item"));}
function clearActiveSuggestion(input){const items=getVisibleSuggestionItems(input);items.forEach((el)=>{el.classList.remove("is-active");try{el.setAttribute("aria-selected","false");}catch(_){}});STATE.activeInput=input||null;STATE.activeIndex=-1;STATE.activeQuery=input?String(input.value||"").trim():"";return null;}
function setActiveSuggestionIndex(input,idx,opts){const items=getVisibleSuggestionItems(input);if(!items.length)return clearActiveSuggestion(input);let nextIdx=Number(idx);if(!Number.isFinite(nextIdx))nextIdx=-1;nextIdx=Math.max(-1,Math.min(items.length-1,nextIdx));const allowScroll=!(opts&&opts.scroll===false);items.forEach((el,i)=>{const active=i===nextIdx;el.classList.toggle("is-active",active);try{el.setAttribute("aria-selected",active?"true":"false");}catch(_){}
if(active&&allowScroll){try{el.scrollIntoView({block:"nearest",inline:"nearest"});}catch(_){}}});STATE.activeInput=input||null;STATE.activeIndex=nextIdx;STATE.activeQuery=input?String(input.value||"").trim():"";return nextIdx>=0?items[nextIdx]:null;}
function getActiveSuggestionItem(input){const items=getVisibleSuggestionItems(input);if(!items.length)return null;const q=input?String(input.value||"").trim():"";if(STATE.activeInput!==input||STATE.activeQuery!==q){return null;}
const idx=Number(STATE.activeIndex);if(Number.isFinite(idx)&&idx>=0&&idx<items.length)return items[idx];return items.find((el)=>el.classList.contains("is-active"))||null;}
function moveActiveSuggestion(input,delta){const items=getVisibleSuggestionItems(input);if(!items.length)return null;const q=input?String(input.value||"").trim():"";let idx=-1;if(STATE.activeInput===input&&STATE.activeQuery===q&&Number.isFinite(STATE.activeIndex)){idx=Number(STATE.activeIndex);}
if(delta>0)idx=idx<0?0:Math.min(items.length-1,idx+1);else if(delta<0)idx=idx<0?items.length-1:Math.max(0,idx-1);return setActiveSuggestionIndex(input,idx);}
async function typesetMath(rootEl){try{if(!rootEl)return;if(window.MathJax&&typeof window.MathJax.typesetPromise==="function"){if(typeof window.MathJax.typesetClear==="function"){try{window.MathJax.typesetClear([rootEl]);}catch(_){}}
await window.MathJax.typesetPromise([rootEl]).catch(()=>{});return;}
if(window.renderMathInElement){window.renderMathInElement(rootEl,{delimiters:[{left:"$$",right:"$$",display:true},{left:"$",right:"$",display:false},{left:"\\(",right:"\\)",display:false},{left:"\\[",right:"\\]",display:true}],throwOnError:false});}}catch(_){}}
function ensureStyles(){if(STATE.styleReady&&document.getElementById("mk-custom-search-suggest-style"))return;const style=document.createElement("style");style.id="mk-custom-search-suggest-style";style.textContent=`
      /* Keep custom search suggestions above shadow tabs / tab overlays. */
      .md-header {
        z-index: 2147482500 !important;
      }

      .md-header .md-search,
      .md-header .md-search.md-search--active {
        position: relative;
        z-index: 2147482600 !important;
      }

      .md-header .md-search__output,
      .md-header .md-search__output.mk-custom-search-ready {
        position: absolute;
        z-index: 2147482700 !important;
      }

      .md-header .md-search__output.mk-custom-search-ready .md-search-result,
      .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest,
      .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__panel,
      .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__scroll,
      .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__list {
        position: relative;
        z-index: 2147482701 !important;
      }

      .md-search__output.mk-custom-search-ready .md-search-result__meta,
      .md-search__output.mk-custom-search-ready .md-search-result__list,
      .md-search__output.mk-custom-search-ready .md-search-result__more {
        display: none !important;
      }

      .md-search__output.mk-custom-search-ready .md-search-result {
        max-height: none !important;
        overflow: visible !important;
        padding: 0 !important;
        background: transparent !important;
      }

      .md-search__output.mk-custom-search-ready {
        overflow: visible !important;
      }

      .md-header .md-search__output.mk-custom-search-ready {
        background: #121418 !important;
        color: rgba(255,255,255,.92) !important;
        background-clip: padding-box !important;
      }

      html[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready,
      body[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready {
        background: #f4f5f7 !important;
        color: #1f2937 !important;
      }

      html[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready,
      body[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready {
        background: #121418 !important;
        color: rgba(255,255,255,.92) !important;
      }

      .mk-search-suggest {
        display: block;
        pointer-events: auto;
        touch-action: pan-y;
      }

      .mk-search-suggest[hidden] {
        display: none !important;
      }

      .mk-search-suggest__panel {
        margin: 0;
        touch-action: pan-y;
        border-radius: 0 0 1rem 1rem;
        background: #121418;
        background: color-mix(in srgb, var(--md-default-bg-color) 96%, black);
        box-shadow: 0 .65rem 1.8rem rgba(0, 0, 0, .18);
        overflow: hidden;
        border: .05rem solid rgba(255,255,255,.08);
        border: .05rem solid color-mix(in srgb, var(--md-default-fg-color--lightest) 82%, transparent);
        border-top: 0;
        background-clip: padding-box;
      }

      html[data-md-color-scheme="default"] .md-header .md-search__output .mk-search-suggest__panel,
      body[data-md-color-scheme="default"] .md-header .md-search__output .mk-search-suggest__panel {
        background: #f4f5f7 !important;
        color: #1f2937 !important;
      }

      html[data-md-color-scheme="slate"] .md-header .md-search__output .mk-search-suggest__panel,
      body[data-md-color-scheme="slate"] .md-header .md-search__output .mk-search-suggest__panel {
        background: #121418 !important;
        color: rgba(255,255,255,.92) !important;
      }

      .mk-search-suggest__notice {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: .18rem .36rem;
        padding: .72rem 1rem .68rem;
        color: var(--md-default-fg-color--light);
        font-size: .76rem;
        line-height: 1.45;
        border-bottom: .05rem solid rgba(255,255,255,.08);
        border-bottom: .05rem solid color-mix(in srgb, var(--md-default-fg-color--lightest) 88%, transparent);
        background: rgba(34, 197, 94, .06);
        background: color-mix(in srgb, var(--md-accent-fg-color, #00c853) 5%, var(--md-default-bg-color));
      }

      .mk-search-suggest__notice-label,
      .mk-search-suggest__notice-sep {
        color: var(--md-default-fg-color--light);
      }

      .mk-search-suggest__notice-query {
        font-weight: 700;
        color: var(--md-default-fg-color);
      }

      .mk-search-suggest__notice-query--accent {
        color: var(--md-accent-fg-color, #00c853);
      }

      .mk-search-suggest__empty,
      .mk-search-suggest__loading {
        padding: 1rem 1.1rem 1.05rem;
        color: var(--md-default-fg-color--light);
        font-size: .92rem;
        line-height: 1.45;
      }

      .mk-search-suggest__scroll {
        max-height: min(72vh, calc(100dvh - 5.75rem));
        overflow-y: auto;
        touch-action: pan-y;
        overflow-x: hidden;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: color-mix(in srgb, var(--md-accent-fg-color, #00c853) 78%, transparent) transparent;
        scrollbar-gutter: auto;
      }

      .mk-search-suggest__scroll::-webkit-scrollbar {
        width: 11px;
      }

      .mk-search-suggest__scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      .mk-search-suggest__scroll::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--md-accent-fg-color, #00c853) 78%, transparent);
        border-radius: 999px;
        border: 2px solid transparent;
        background-clip: padding-box;
      }

      .mk-search-suggest__list {
        margin: 0;
        padding: 0;
      }

      .mk-search-suggest__item {
        display: block;
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: .72rem 1rem .74rem;
        border-top: .05rem solid color-mix(in srgb, var(--md-default-fg-color--lightest) 88%, transparent);
        color: inherit;
        text-decoration: none !important;
        background: transparent;
        cursor: pointer;
        transition: background-color 130ms ease, box-shadow 130ms ease, color 130ms ease;
        -webkit-tap-highlight-color: transparent;
      }

      .mk-search-suggest__item,
      .mk-search-suggest__item:hover,
      .mk-search-suggest__item:focus-visible,
      .mk-search-suggest__item:visited {
        text-decoration: none !important;
      }

      .mk-search-suggest__item:first-child {
        border-top: 0;
      }

      .mk-search-suggest__item:hover,
      .mk-search-suggest__item:focus-visible,
      .mk-search-suggest__item.is-active {
        background: color-mix(in srgb, var(--md-accent-fg-color, #00c853) 18%, transparent);
        outline: 0;
        box-shadow: none;
      }

      .mk-search-suggest__head {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: baseline;
        gap: .35rem .9rem;
      }

      .mk-search-suggest__title {
        min-width: 0;
        margin: 0;
        color: var(--md-default-fg-color);
        font-size: .88rem;
        font-weight: 700;
        line-height: 1.35;
        letter-spacing: -.005em;
        word-break: break-word;
      }

      .mk-search-suggest__title .MathJax,
      .mk-search-suggest__title mjx-container,
      .mk-search-suggest__detail .MathJax,
      .mk-search-suggest__detail mjx-container {
        font-size: 1em !important;
      }

      .mk-search-suggest__meta {
        justify-self: end;
        margin: 0;
        color: var(--md-default-fg-color--light);
        font-size: .78rem;
        line-height: 1.35;
        font-weight: 500;
        text-align: right;
        white-space: nowrap;
      }

      .mk-search-suggest__detail {
        margin-top: .22rem;
        color: var(--md-default-fg-color--light);
        font-size: .77rem;
        line-height: 1.45;
        word-break: break-word;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        max-height: calc(1em * 1.45 * 2);
      }

      .mk-search-suggest__detail--math {
        display: block;
        overflow: visible;
        -webkit-line-clamp: unset;
        line-clamp: unset;
        max-height: none;
      }

      .mk-search-suggest__detail--math .MathJax,
      .mk-search-suggest__detail--math mjx-container {
        max-width: 100%;
      }

      .mk-search-suggest__detail--math mjx-container[display="true"],
      .mk-search-suggest__detail--math mjx-container[display="block"] {
        display: block;
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: .06rem;
      }

      .mk-search-suggest__detail--alias {
        font-size: .72rem;
      }

      .mk-search-suggest__detail-label {
        margin-right: .28rem;
        color: var(--md-default-fg-color--lighter, var(--md-default-fg-color--light));
        font-weight: 500;
      }

      .mk-search-suggest__alias-value {
        color: inherit;
      }

      .mk-search-suggest__hl {
        padding: 0;
        background: transparent;
        color: var(--md-accent-fg-color, #00c853);
        font-weight: 800;
        text-decoration: none !important;
        border-bottom: 0 !important;
        box-shadow: none !important;
      }

      .mk-search-suggest__hl--math,
      .mk-search-suggest__hl--math .MathJax,
      .mk-search-suggest__hl--math mjx-container,
      .mk-search-suggest__hl--math mjx-container *,
      .mk-search-suggest__hl--math .katex,
      .mk-search-suggest__hl--math .katex *,
      .mk-search-suggest__hl--math svg,
      .mk-search-suggest__hl--math svg *,
      .mk-search-suggest__hl--math path {
        color: var(--md-accent-fg-color, #00c853) !important;
        fill: currentColor !important;
        stroke: currentColor !important;
      }

      @supports not (color: color-mix(in srgb, white 50%, black)) {
        .mk-search-suggest__item:hover,
        .mk-search-suggest__item:focus-visible,
        .mk-search-suggest__item.is-active {
          background: rgba(34, 197, 94, .14);
          box-shadow: none;
        }

        .mk-search-suggest__scroll::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, .82);
        }
      }

      @media screen and (max-width: 76.234375em), (pointer: coarse) {
        .md-header .md-search__output.mk-custom-search-ready,
        .md-header .md-search__output.mk-custom-search-ready .md-search-result,
        .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest,
        .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__panel,
        .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__scroll,
        .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__list {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          background-clip: padding-box !important;
        }

        html[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready,
        html[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready .md-search-result,
        html[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest,
        html[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__panel,
        html[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__scroll,
        html[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__list,
        body[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready,
        body[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready .md-search-result,
        body[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest,
        body[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__panel,
        body[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__scroll,
        body[data-md-color-scheme="default"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__list {
          background: #f4f5f7 !important;
          color: #1f2937 !important;
        }

        html[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready,
        html[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready .md-search-result,
        html[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest,
        html[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__panel,
        html[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__scroll,
        html[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__list,
        body[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready,
        body[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready .md-search-result,
        body[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest,
        body[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__panel,
        body[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__scroll,
        body[data-md-color-scheme="slate"] .md-header .md-search__output.mk-custom-search-ready .mk-search-suggest__list {
          background: #121418 !important;
          color: rgba(255,255,255,.92) !important;
        }

        .mk-search-suggest__scroll {
          max-height: calc(100dvh - 6.85rem);
        }

        .mk-search-suggest__item {
          padding: .7rem .92rem .72rem;
        }

        .mk-search-suggest__head {
          grid-template-columns: minmax(0, 1fr);
          align-items: start;
          gap: .28rem .65rem;
        }

        .mk-search-suggest__title {
          font-size: .86rem;
        }

        .mk-search-suggest__meta {
          justify-self: start;
          margin-top: .14rem;
          font-size: .75rem;
          text-align: left;
          max-width: none;
          white-space: normal;
        }

        .mk-search-suggest__detail {
          font-size: .73rem;
        }

        .mk-search-suggest__notice {
          font-size: .72rem;
          padding: .68rem .92rem .64rem;
        }
      }

      @media screen and (max-width: 34em), (pointer: coarse) {
        .mk-search-suggest__head {
          grid-template-columns: minmax(0, 1fr);
        }

        .mk-search-suggest__meta {
          justify-self: start;
          text-align: left;
          max-width: none;
        }
      }
    `;document.head.appendChild(style);STATE.styleReady=true;}
function getActiveInput(){const active=document.activeElement;if(isHeaderSearchInput(active))return active;const inputs=Array.from(document.querySelectorAll('.md-header '+INPUT_SELECTOR)).filter(isHeaderSearchInput);if(!inputs.length)return null;const activeSearch=document.querySelector('.md-header .md-search.md-search--active')||document.querySelector('.md-header .md-search');if(activeSearch){const inActive=inputs.find((i)=>activeSearch.contains(i)&&i.offsetParent!==null);if(inActive)return inActive;}
return inputs.find((i)=>i.offsetParent!==null)||inputs[0];}
function getSearchRoot(input){const i=input||getActiveInput();return getHeaderSearchRoot(i)||null;}
function getOutputRoot(input){const root=getSearchRoot(input);return root?root.querySelector(".md-search__output"):null;}
function getMaterialResultRoot(input){const out=getOutputRoot(input);if(!out)return null;return out.querySelector(".md-search-result")||out;}
function forceRevealSearchOutput(input){const root=getSearchRoot(input);const q=input?String(input.value||"").trim():"";let searchOpen=!!q;try{const ae=document.activeElement;if(input&&ae===input)searchOpen=true;else if(root&&ae&&root.contains&&root.contains(ae))searchOpen=true;const toggle=document.querySelector('input.md-toggle[data-md-toggle="search"]')||document.querySelector("#__search");if(toggle&&toggle.checked)searchOpen=true;}catch(_){}
try{if(root&&root.classList&&searchOpen){root.classList.add("md-search--active");}
if(q&&isMobileSearchLayout()&&root&&root.classList){root.classList.add("mk-search-result-open");root.classList.remove("mk-search-history-open");}
const inner=input&&input.closest?input.closest(".md-search__inner"):null;if(q&&isMobileSearchLayout()&&inner&&inner.classList){inner.classList.add("mk-search-result-open");inner.classList.remove("mk-search-history-open");}}catch(_){}
const out=root?root.querySelector(".md-search__output"):null;if(!out)return;try{if(q&&isMobileSearchLayout())out.classList.remove("mk-hsf-history-open");}catch(_){}
const nodes=[out];try{nodes.push(...Array.from(out.querySelectorAll(".md-search-result, .md-search-result__list, .mk-search-suggest, .mk-search-suggest__panel, .mk-search-suggest__scroll, .mk-search-suggest__list")));}catch(_){}
for(const el of nodes){if(!el||!el.style)continue;try{el.style.removeProperty("display");}catch(_){}
try{el.style.removeProperty("pointer-events");}catch(_){}
try{el.style.removeProperty("visibility");}catch(_){}
try{el.style.removeProperty("opacity");}catch(_){}
try{el.removeAttribute("aria-hidden");}catch(_){}
try{delete el.dataset.mkHistorySuppressed;}catch(_){}
try{delete el.dataset.mkFindResidueHidden;}catch(_){}}
try{out.classList.add("mk-custom-search-ready");}catch(_){}}
function ensureCustomContainer(input){const out=getOutputRoot(input);const host=getMaterialResultRoot(input);if(!out||!host)return null;forceRevealSearchOutput(input);out.classList.add("mk-custom-search-ready");let box=host.querySelector(".mk-search-suggest");if(!box){box=document.createElement("div");box.className="mk-search-suggest";host.appendChild(box);}
return box;}
function clearCustomResults(input){window.clearTimeout(STATE.renderTimer);++STATE.renderSeq;const box=ensureCustomContainer(input);if(!box)return;clearActiveSuggestion(input);try{delete box.dataset.mkQuery;}catch(_){}
box.hidden=true;box.innerHTML="";}
function hideSearchHistoryDropdowns(input,activateResults){try{document.querySelectorAll(".mk-search-history").forEach((root)=>{try{root.style.display="none";}catch(_){}
try{root.querySelectorAll(".mk-search-history__item.is-active").forEach((el)=>el.classList.remove("is-active"));}catch(_){}});}catch(_){}
if(activateResults&&isMobileSearchLayout()){try{const activeInput=input||getActiveInput();const root=getSearchRoot(activeInput);const inner=activeInput&&activeInput.closest?activeInput.closest(".md-search__inner"):null;if(root&&root.classList){root.classList.remove("mk-search-history-open");root.classList.add("mk-search-result-open","md-search--active");}
if(inner&&inner.classList){inner.classList.remove("mk-search-history-open");inner.classList.add("mk-search-result-open");}
if(root&&root.querySelectorAll){root.querySelectorAll(".md-search__output.mk-hsf-history-open").forEach((out)=>{try{out.classList.remove("mk-hsf-history-open");}catch(_){}});}}catch(_){}}
try{document.querySelectorAll(".md-search__output").forEach((out)=>{if(!out||!out.style)return;if(out.dataset&&out.dataset.mkHistorySuppressed==="1"){try{out.style.removeProperty("display");}catch(_){}
try{out.style.removeProperty("pointer-events");}catch(_){}
try{out.style.removeProperty("visibility");}catch(_){}
try{out.style.removeProperty("opacity");}catch(_){}
try{out.removeAttribute("aria-hidden");}catch(_){}
try{delete out.dataset.mkHistorySuppressed;}catch(_){}}});}catch(_){}}
function closeSearchUi(input){const activeInput=input||getActiveInput();const root=getSearchRoot(activeInput);const toggle=document.querySelector('input.md-toggle[data-md-toggle="search"]')||document.querySelector("input#__search")||document.querySelector("#__search");clearCustomResults(activeInput);hideSearchHistoryDropdowns();try{if(activeInput&&typeof activeInput.blur==="function")activeInput.blur();}catch(_){}
try{const ae=document.activeElement;if(ae&&root&&root.contains(ae)&&typeof ae.blur==="function")ae.blur();}catch(_){}
try{if(toggle){toggle.checked=false;try{toggle.dispatchEvent(new Event("change",{bubbles:true}));}catch(_){}}}catch(_){}
try{if(root)root.classList.remove("md-search--active");}catch(_){}
try{document.documentElement.classList.remove("md-search--active");}catch(_){}
try{if(document.body)document.body.classList.remove("md-search--active");}catch(_){}}
function renderTitleHtml(doc,query){return highlightPreservingMath(String((doc&&doc.title)||"Untitled"),query);}
function renderMetaHtml(doc,query){const meta=formatCoursePeriodMeta(doc);return meta?highlightPlainText(meta,query):"";}
function getFuzzyCore(){const core=window.__mkFuzzyCore;return core&&typeof core.suggestPhrase==="function"?core:null;}
async function getCorrectedQuery(rawQuery,docs){const q=String(rawQuery||"").trim();if(!q)return null;const core=getFuzzyCore();if(!core)return null;try{const res=await core.suggestPhrase(FUZZY_SCOPE_KEY,q,{pageDocs:Array.isArray(docs)?docs:[],includeBody:false,minFreq:1,maxVocab:16000});const suggested=String(res&&res.suggested||"").trim();if(!suggested)return null;if(normaliseForSearch(suggested)===normaliseForSearch(q))return null;return{raw:q,suggested,changes:Array.isArray(res&&res.changes)?res.changes:[]};}catch(_){return null;}}
function renderCorrectionNoticeHtml(rawQuery,suggestedQuery){const raw=String(rawQuery||"").trim();const suggested=String(suggestedQuery||"").trim();if(!raw||!suggested)return"";return`
      <div class="mk-search-suggest__notice" role="status" aria-live="polite">
        <span class="mk-search-suggest__notice-label">No exact matches for</span>
        <strong class="mk-search-suggest__notice-query">${escapeHtml(raw)}</strong>
        <span class="mk-search-suggest__notice-sep">.</span>
        <span class="mk-search-suggest__notice-label">Showing suggestions for</span>
        <strong class="mk-search-suggest__notice-query mk-search-suggest__notice-query--accent">${escapeHtml(suggested)}</strong>
      </div>
    `;}
async function renderCustomResults(input,hits,query,seq,opts){const box=ensureCustomContainer(input);if(!box)return;const o=opts||{};const q=String(query||"").trim();const rawQuery=String(o.rawQuery||q).trim();const noticeHtml=String(o.noticeHtml||"");if(!q){clearCustomResults(input);return;}
const list=Array.isArray(hits)?hits.slice(0,MAX_RESULTS):[];box.hidden=false;if(!list.length){box.innerHTML=`
        <div class="mk-search-suggest__panel">
          ${noticeHtml}
          <div class="mk-search-suggest__empty">No matching pages</div>
        </div>
      `;return;}
const html=list.map((hit)=>{const d=hit.doc||{};const href=toAbsoluteUrl(d.location);const titleHtml=renderTitleHtml(d,q);const metaHtml=renderMetaHtml(d,q);const detailHtml=renderDetailHtml(d,q);return`
        <a class="mk-search-suggest__item" href="${escapeHtml(href)}" role="option" aria-selected="false" data-index="${hit.__i || 0}">
          <div class="mk-search-suggest__head">
            <div class="mk-search-suggest__title">${titleHtml}</div>
            ${metaHtml ? `<div class="mk-search-suggest__meta">${metaHtml}</div>` : ""}
          </div>
          ${detailHtml}
        </a>
      `;}).join("");try{box.dataset.mkQuery=rawQuery;}catch(_){}
try{box.dataset.mkEffectiveQuery=q;}catch(_){}
box.innerHTML=`
      <div class="mk-search-suggest__panel">
        ${noticeHtml}
        <div class="mk-search-suggest__scroll">
          <div class="mk-search-suggest__list" role="listbox">${html}</div>
        </div>
      </div>
    `;const panel=box.querySelector(".mk-search-suggest__panel");if(panel)panel.style.visibility="hidden";const thisTypesetSeq=++STATE.typesetSeq;await typesetMath(box);if(seq!==STATE.renderSeq||thisTypesetSeq!==STATE.typesetSeq)return;clearActiveSuggestion(input);if(panel)panel.style.visibility="";}
async function updateResultsNow(input){const i=input||getActiveInput();if(!i||i.__mkSearchComposing||i.isConnected===false)return;const rawQuery=String(i.value||"").trim();const seq=++STATE.renderSeq;if(rawQuery){hideSearchHistoryDropdowns(i,true);forceRevealSearchOutput(i);}
const box=ensureCustomContainer(i);if(!box)return;if(!rawQuery){clearCustomResults(i);return;}
box.hidden=false;box.innerHTML='<div class="mk-search-suggest__panel"><div class="mk-search-suggest__loading">Loading…</div></div>';const docs=await ensureDocs().catch(()=>[]);if(seq!==STATE.renderSeq)return;let effectiveQuery=rawQuery;let effectiveHits=getSortedHits(rawQuery,docs||[]);let noticeHtml="";if(!effectiveHits.length){const correction=await getCorrectedQuery(rawQuery,docs||[]);if(seq!==STATE.renderSeq)return;if(correction&&correction.suggested){const correctedHits=getSortedHits(correction.suggested,docs||[]);if(correctedHits.length){effectiveQuery=correction.suggested;effectiveHits=correctedHits;noticeHtml=renderCorrectionNoticeHtml(rawQuery,correction.suggested);}}}
await renderCustomResults(i,effectiveHits,effectiveQuery,seq,{rawQuery,noticeHtml}).catch(()=>{if(seq!==STATE.renderSeq)return;box.innerHTML='<div class="mk-search-suggest__panel"><div class="mk-search-suggest__empty">No matching pages</div></div>';});}
function scheduleUpdate(input){const i=input||getActiveInput();if(i&&i.__mkSearchComposing)return;if(i&&!String(i.value||"").trim()){clearCustomResults(i);return;}
++STATE.renderSeq;if(i&&String(i.value||"").trim()){hideSearchHistoryDropdowns(i,true);forceRevealSearchOutput(i);}
window.clearTimeout(STATE.renderTimer);STATE.renderTimer=window.setTimeout(()=>{updateResultsNow(i||input).catch(()=>{});},20);}
function bindEventsOnce(){if(STATE.bound)return;STATE.bound=true;let historyPointerPickAt=0;let historyPointerApplied=false;document.addEventListener("pointerdown",(e)=>{const target=e&&e.target;const row=target&&target.closest?target.closest(".mk-search-history__item"):null;const remove=target&&target.closest?target.closest(".mk-search-history__del"):null;historyPointerPickAt=row&&!remove&&(e.button==null||e.button===0)?Date.now():0;historyPointerApplied=false;},true);document.addEventListener("pointercancel",()=>{historyPointerPickAt=0;historyPointerApplied=false;},true);document.addEventListener("compositionstart",(e)=>{const t=e&&e.target;if(!isHeaderSearchInput(t))return;t.__mkSearchComposing=true;clearCustomResults(t);},true);document.addEventListener("compositionend",(e)=>{const t=e&&e.target;if(!isHeaderSearchInput(t))return;t.__mkSearchComposing=false;scheduleUpdate(t);},true);document.addEventListener("input",(e)=>{const t=e&&e.target;if(isHeaderSearchInput(t)){if(historyPointerPickAt&&Date.now()<Number(window.__mkSearchHistoryApplyingUntil||0)){historyPointerApplied=true;}
if(e.isComposing||t.__mkSearchComposing)return;if(String(t.value||"").trim()){hideSearchHistoryDropdowns(t,true);forceRevealSearchOutput(t);}
scheduleUpdate(t);}},true);document.addEventListener("focusin",(e)=>{const t=e&&e.target;if(isHeaderSearchInput(t)){if(String(t.value||"").trim())forceRevealSearchOutput(t);scheduleUpdate(t);}},true);document.addEventListener("keydown",(e)=>{const t=e&&e.target;if(!isHeaderSearchInput(t))return;if(e.isComposing||e.keyCode===229||t.__mkSearchComposing)return;const key=String(e.key||"");const q=String(t.value||"").trim();if(key==="Escape"){e.preventDefault();closeSearchUi(t);return;}
if((key==="ArrowDown"||key==="ArrowUp")&&q){const moved=moveActiveSuggestion(t,key==="ArrowDown"?1:-1);if(moved){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();return;}}
if(key==="Enter"&&q){if(Date.now()<Number(window.__mkSearchSuggestClickBlockUntil||0)){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();return;}
const active=getActiveSuggestionItem(t);const href=active?String(active.getAttribute("href")||"").trim():"";if(href){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();addQueryToHistory(q);window.location.assign(href);return;}
return;}
if(key==="Tab"){clearActiveSuggestion(t);return;}
scheduleUpdate(t);},true);document.addEventListener("click",(e)=>{if(Date.now()<Number(window.__mkSearchSuggestClickBlockUntil||0))return;const link=e.target&&e.target.closest?e.target.closest(".mk-search-suggest__item"):null;if(!link)return;if(Date.now()<Number(window.__mkSearchSuggestClickBlockUntil||0)){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();return;}
const href=String(link.getAttribute("href")||"").trim();if(!href)return;const box=link.closest(".mk-search-suggest");const q=(box&&box.dataset&&box.dataset.mkQuery)?String(box.dataset.mkQuery||""):"";if(q)addQueryToHistory(q);e.preventDefault();e.stopPropagation();window.location.assign(href);},true);document.addEventListener("mouseover",(e)=>{if(Date.now()<Number(window.__mkSearchSuggestHoverBlockUntil||0))return;if(Date.now()<Number(window.__mkSearchHistoryApplyUntil||0))return;const link=e.target&&e.target.closest?e.target.closest(".mk-search-suggest__item"):null;if(!link)return;const input=getActiveInput();if(!isHeaderSearchInput(input))return;const items=getVisibleSuggestionItems(input);const idx=items.indexOf(link);if(idx>=0)setActiveSuggestionIndex(input,idx,{scroll:false});},true);document.addEventListener("click",(e)=>{const historyPickAt=historyPointerPickAt;const historyApplied=historyPointerApplied;historyPointerPickAt=0;historyPointerApplied=false;if(historyPickAt&&historyApplied&&Date.now()-historyPickAt<1200){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();return;}
const target=e.target;if(!target||!target.closest)return;const opener=target.closest('label[for="__search"], [for="__search"], input#__search, input.md-toggle[data-md-toggle="search"]');if(opener)return;const input=getActiveInput();const root=document.querySelector('.md-header .md-search.md-search--active')||getSearchRoot(input);const toggle=document.querySelector('input.md-toggle[data-md-toggle="search"]')||document.querySelector("input#__search")||document.querySelector("#__search");const isOpen=!!((root&&root.classList&&root.classList.contains("md-search--active"))||(toggle&&toggle.checked));if(!root||!isOpen)return;const overlay=target.closest(".md-search__overlay");if(overlay&&root.contains(overlay)){window.setTimeout(()=>closeSearchUi(input),0);return;}
if(root.contains(target))return;window.setTimeout(()=>closeSearchUi(input),0);},true);}
function init(){ensureStyles();bindEventsOnce();ensureCustomContainer(getActiveInput());scheduleUpdate(getActiveInput());}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init,{once:true});}else{init();}
document.addEventListener("DOMContentSwitch",init);window.addEventListener("pageshow",init);if(window.document$&&typeof window.document$.subscribe==="function"){try{window.document$.subscribe(init);}catch(_){}}
function __mkFindResidueCleanupV8(){try{var path=String(location.pathname||'').toLowerCase().replace(/\/index\.html$/,'/');var isFind=path.endsWith('/find/')||path.endsWith('/find.html')||path.endsWith('/find');if(!isFind)return;var ae=document.activeElement;var toggle=document.querySelector('input.md-toggle[data-md-toggle="search"], input#__search, #__search');var shell=document.querySelector('.md-header .md-search');var html=document.documentElement;var body=document.body;var active=!!((toggle&&toggle.checked)||(ae&&ae.closest&&ae.closest('.md-header .md-search'))||(shell&&shell.classList&&shell.classList.contains('md-search--active'))||(shell&&shell.getAttribute&&shell.getAttribute('data-mk-search-force-active')==='1')||(html&&html.classList&&(html.classList.contains('md-search--active')||html.classList.contains('mk-hsf-open')))||(body&&body.classList&&body.classList.contains('md-search--active')));if(active)return;if(toggle)toggle.checked=false;document.querySelectorAll('.md-header .md-search.md-search--active').forEach(function(el){el.classList.remove('md-search--active');});document.documentElement.classList.remove('md-search--active');if(document.body)document.body.classList.remove('md-search--active');document.querySelectorAll('.md-header .md-search__output,.md-header .md-search__overlay,.md-header .mk-search-history,.md-header .mk-search-suggest').forEach(function(el){try{el.dataset.mkFindResidueHidden='1';el.style.display='none';el.style.opacity='0';el.style.pointerEvents='none';el.setAttribute('aria-hidden','true');}catch(_){}});var bd=document.getElementById('mk-mobile-search-backdrop');if(bd){bd.style.display='none';bd.style.opacity='0';bd.style.backdropFilter='none';bd.style.webkitBackdropFilter='none';}
try{if(window.__mkFindNoBlurCleanupV8)window.__mkFindNoBlurCleanupV8();}catch(_){}}catch(_){}}
try{[0,40,120,280,700,1200,1800].forEach(function(ms){setTimeout(__mkFindResidueCleanupV8,ms);});document.addEventListener('DOMContentSwitch',function(){[0,40,120,280,700,1200].forEach(function(ms){setTimeout(__mkFindResidueCleanupV8,ms);});});window.addEventListener('pageshow',function(){[0,40,120,280,700,1200].forEach(function(ms){setTimeout(__mkFindResidueCleanupV8,ms);});},{passive:true});}catch(_){}})();