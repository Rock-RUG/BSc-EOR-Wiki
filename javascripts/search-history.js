(function(){"use strict";if(window.__mkSearchHistoryInstalledV5)return;window.__mkSearchHistoryInstalledV5=true;try{window.__mkSearchHistoryVersion="v5.2.2-separate-rounded-surfaces";}catch(_){}
const STORAGE_KEY="mk_search_history_v1";const MAX_ITEMS=12;const ROOT_CLASS="mk-search-history";const LIST_CLASS="mk-search-history__list";const ITEM_CLASS="mk-search-history__item";const ACTIVE_CLASS="is-active";const INPUT_SELECTOR='input[data-md-component="search-query"]';function isHeaderSearchRoot(root){return!!(root&&root.closest&&root.closest('.md-header'));}
function isHeaderSearchInput(input){return!!(input&&input.matches&&input.matches(INPUT_SELECTOR)&&isHeaderSearchRoot(input.closest('.md-search')));}
function getHeaderSearchRoot(input){const i=input&&isHeaderSearchInput(input)?input:null;return(i&&i.closest('.md-search'))||document.querySelector('.md-header .md-search.md-search--active')||document.querySelector('.md-header .md-search')||null;}
function getSearchToggle(){return(document.querySelector('input.md-toggle[data-md-toggle="search"]')||document.querySelector("input#__search")||document.querySelector("#__search")||null);}
function ensureSearchUiPatchStyle(){const STYLE_ID="mk-search-history-patch-style-v7";if(document.getElementById(STYLE_ID))return;["mk-search-history-patch-style-v6","mk-search-history-patch-style-v5","mk-search-history-patch-style-v4","mk-search-history-patch-style-v3","mk-search-history-patch-style-v2","mk-search-history-patch-style-v1"].forEach((id)=>{try{const oldStyle=document.getElementById(id);if(oldStyle&&oldStyle.parentNode)oldStyle.parentNode.removeChild(oldStyle);}catch(_){}});const style=document.createElement("style");style.id=STYLE_ID;style.textContent=`
      /*
       * Search history surface model v5.2.2
       *
       * Keep the search input and the dropdown as two separate rounded surfaces.
       * Do not flatten the search bar. Do not let Material's .md-search__output
       * draw a square/pointed outer container behind the real dropdown surface.
       */

      :root{
        --mk-header-search-radius: 16px;
        --mk-header-search-mobile-radius: 18px;
        --mk-header-search-gap: 4px;
      }

      /* Closed top search: remove the inactive output layer that causes the stray PC line. */
      #__search:not(:checked) ~ .md-header .md-search__output,
      #__search:not(:checked) ~ .md-header .md-search__scrollwrap{
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        border: 0 !important;
        border-bottom: 0 !important;
        box-shadow: none !important;
        outline: 0 !important;
        background: transparent !important;
        filter: none !important;
      }

      #__search:not(:checked) ~ .md-header .md-search__output::before,
      #__search:not(:checked) ~ .md-header .md-search__output::after,
      #__search:not(:checked) ~ .md-header .md-search__scrollwrap::before,
      #__search:not(:checked) ~ .md-header .md-search__scrollwrap::after{
        display: none !important;
        content: none !important;
        border: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
      }

      /* The search bar itself stays rounded even when search/history/results are open. */
      #__search:checked ~ .md-header .md-search__form,
      .md-header .md-search__inner.mk-search-history-open > .md-search__form,
      .md-header .md-search__inner.mk-search-result-open > .md-search__form{
        border-radius: var(--mk-header-search-radius) !important;
        overflow: hidden !important;
        margin-bottom: 0 !important;
      }

      .md-header .md-search__inner{
        overflow: visible !important;
      }

      /* Material output is only a positioning shell. It must not paint a square surface. */
      #__search:checked ~ .md-header .md-search__output,
      .md-header .md-search__inner.mk-search-result-open > .md-search__output{
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        filter: none !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
        -webkit-mask-image: none !important;
        mask-image: none !important;
      }

      #__search:checked ~ .md-header .md-search__output::before,
      #__search:checked ~ .md-header .md-search__output::after,
      .md-header .md-search__inner.mk-search-result-open > .md-search__output::before,
      .md-header .md-search__inner.mk-search-result-open > .md-search__output::after{
        display: none !important;
        content: none !important;
        border: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
        -webkit-mask: none !important;
        mask: none !important;
      }

      /* The real Material result surface is the scrollwrap, not the output shell. */
      #__search:checked ~ .md-header .md-search__scrollwrap,
      .md-header .md-search__inner.mk-search-result-open > .md-search__output .md-search__scrollwrap{
        border-radius: var(--mk-header-search-radius) !important;
        overflow: hidden !important;
        box-shadow: var(--md-shadow-z3) !important;
        -webkit-mask-image: -webkit-radial-gradient(white, black) !important;
        mask-image: radial-gradient(white, black) !important;
      }

      #__search:checked ~ .md-header .md-search-result,
      #__search:checked ~ .md-header .md-search-result__list,
      .md-header .md-search__inner.mk-search-result-open .md-search-result,
      .md-header .md-search__inner.mk-search-result-open .md-search-result__list{
        border-radius: inherit !important;
        overflow: hidden !important;
      }

      /* When custom history is open, Material's output is a sibling, not the parent.
         Hide the sibling output completely so it cannot draw a second square surface. */
      .md-header .md-search__inner.mk-search-history-open > .md-search__output{
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        border: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
        filter: none !important;
        -webkit-mask-image: none !important;
        mask-image: none !important;
      }

      .md-header .md-search__inner.mk-search-history-open > .md-search__output::before,
      .md-header .md-search__inner.mk-search-history-open > .md-search__output::after{
        display: none !important;
        content: none !important;
        border: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
        -webkit-mask: none !important;
        mask: none !important;
      }

      .md-header .md-search__inner:not(.mk-search-history-open) > .mk-search-history{
        display: none !important;
      }

      /* The real history dropdown is an independent rounded surface. */
      .md-header .md-search__inner > .mk-search-history{
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        bottom: auto !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
        overflow: hidden !important;
        border-radius: var(--mk-header-search-radius) !important;
        background-clip: padding-box !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        transform: translateZ(0) !important;
        -webkit-mask-image: -webkit-radial-gradient(white, black) !important;
        mask-image: radial-gradient(white, black) !important;
        box-shadow: var(--md-shadow-z3) !important;
        z-index: 10040 !important;
      }

      .md-header .md-search__inner > .mk-search-history,
      .md-header .md-search__inner > .mk-search-history .mk-search-history__list,
      .md-header .md-search__inner > .mk-search-history .mk-search-history__footer,
      #__search:checked ~ .md-header .md-search__scrollwrap,
      #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result,
      #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result__list,
      #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest,
      #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__panel,
      #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__scroll,
      #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__list{
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        opacity: 1 !important;
        background-clip: padding-box !important;
      }

      .md-header .md-search__inner > .mk-search-history,
      .md-header .md-search__inner > .mk-search-history .mk-search-history__list{
        touch-action: pan-y !important;
      }

      .md-header .md-search__inner > .mk-search-history .mk-search-history__list{
        overscroll-behavior: contain !important;
        -webkit-overflow-scrolling: touch !important;
      }

      @media screen and (min-width: 60em){
        #__search:checked ~ .md-header .md-search__output,
        .md-header .md-search__inner.mk-search-result-open > .md-search__output{
          top: calc(100% + var(--mk-header-search-gap)) !important;
        }

        .md-header .md-search__inner.mk-search-history-open > .mk-search-history{
          top: calc(100% + var(--mk-header-search-gap)) !important;
          max-height: min(70vh, 24rem) !important;
        }
      }

      @media screen and (max-width: 59.984375em){
        :root{
          --mk-header-search-radius: var(--mk-header-search-mobile-radius);
          --mk-header-search-gap: 4px;
        }

        .md-header,
        .md-header__inner,
        .md-header .md-search,
        .md-header .md-search__inner,
        .md-header .md-search__form{
          overflow: visible !important;
        }

        #__search:checked ~ .md-header .md-search__form,
        .md-header .md-search__inner.mk-search-history-open > .md-search__form,
        .md-header .md-search__inner.mk-search-result-open > .md-search__form{
          border-radius: var(--mk-header-search-mobile-radius) !important;
        }

        #__search:checked ~ .md-header .md-search__output{
          top: calc(2.4rem + var(--mk-header-search-gap)) !important;
          bottom: auto !important;
          border-radius: 0 !important;
        }

        #__search:checked ~ .md-header .md-search__scrollwrap{
          border-radius: var(--mk-header-search-mobile-radius) !important;
          max-height: calc(100dvh - 2.4rem - 12px) !important;
          box-shadow: 0 .25rem .7rem rgba(0,0,0,.18) !important;
        }

        .md-header .md-search__inner.mk-search-history-open > .mk-search-history{
          top: calc(2.4rem + var(--mk-header-search-gap)) !important;
          border-radius: var(--mk-header-search-mobile-radius) !important;
          max-height: calc(100dvh - 2.4rem - 12px) !important;
          box-shadow: 0 .25rem .7rem rgba(0,0,0,.18) !important;
        }
      }

      html[data-md-color-scheme="default"] .md-header .md-search__inner > .mk-search-history,
      body[data-md-color-scheme="default"] .md-header .md-search__inner > .mk-search-history,
      html[data-md-color-scheme="default"] .md-header .md-search__inner > .mk-search-history .mk-search-history__list,
      body[data-md-color-scheme="default"] .md-header .md-search__inner > .mk-search-history .mk-search-history__list,
      html[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap,
      body[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap,
      html[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result,
      body[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result,
      html[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result__list,
      body[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result__list,
      html[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest,
      body[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest,
      html[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__panel,
      body[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__panel,
      html[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__scroll,
      body[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__scroll,
      html[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__list,
      body[data-md-color-scheme="default"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__list{
        background: #f4f5f7 !important;
        color: #1f2937 !important;
      }

      html[data-md-color-scheme="default"] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer,
      body[data-md-color-scheme="default"] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer{
        background: #e2e5e9 !important;
        border-top: 1px solid rgba(0,0,0,.10) !important;
      }

      html[data-md-color-scheme="slate"] .md-header .md-search__inner > .mk-search-history,
      body[data-md-color-scheme="slate"] .md-header .md-search__inner > .mk-search-history,
      html[data-md-color-scheme="slate"] .md-header .md-search__inner > .mk-search-history .mk-search-history__list,
      body[data-md-color-scheme="slate"] .md-header .md-search__inner > .mk-search-history .mk-search-history__list,
      html[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap,
      body[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap,
      html[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result,
      body[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result,
      html[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result__list,
      body[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result__list,
      html[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest,
      body[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest,
      html[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__panel,
      body[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__panel,
      html[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__scroll,
      body[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__scroll,
      html[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__list,
      body[data-md-color-scheme="slate"] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__list{
        background: #121418 !important;
        color: rgba(255,255,255,.92) !important;
      }

      html[data-md-color-scheme="slate"] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer,
      body[data-md-color-scheme="slate"] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer{
        background: #0e1014 !important;
        border-top: 1px solid rgba(255,255,255,.08) !important;
      }

      /* Unified top-search history interactions */
      .md-header .md-search__inner .mk-search-history__item:hover,
      .md-header .md-search__inner .mk-search-history__item.is-active{
        background: transparent !important;
      }
      .md-header .md-search__inner .mk-search-history__text{
        transition: color 140ms ease, opacity 140ms ease !important;
      }
      .md-header .md-search__inner .mk-search-history__item:hover .mk-search-history__text,
      .md-header .md-search__inner .mk-search-history__item.is-active .mk-search-history__text{
        color: var(--md-accent-fg-color) !important;
        opacity: 1 !important;
      }
      @supports selector(:has(*)){
        .md-header .md-search__inner .mk-search-history__item:has(.mk-search-history__del:hover) .mk-search-history__text,
        .md-header .md-search__inner .mk-search-history__item:has(.mk-search-history__del:focus-visible) .mk-search-history__text{
          color: inherit !important;
        }
      }

      .md-header .md-search__inner .mk-search-history__del{
        appearance: none !important;
        -webkit-appearance: none !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 1.9rem !important;
        height: 1.9rem !important;
        min-width: 1.9rem !important;
        min-height: 1.9rem !important;
        margin: 0 0 0 2px !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        outline: none !important;
        color: var(--md-default-fg-color--light) !important;
        line-height: 1 !important;
        font-size: 1rem !important;
        text-decoration: none !important;
        -webkit-tap-highlight-color: transparent !important;
        transition: color 140ms ease, opacity 140ms ease, transform 140ms ease !important;
      }
      .md-header .md-search__inner .mk-search-history__del:hover,
      .md-header .md-search__inner .mk-search-history__del:focus,
      .md-header .md-search__inner .mk-search-history__del:focus-visible{
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        outline: none !important;
        color: var(--md-accent-fg-color) !important;
      }
      .md-header .md-search__inner .mk-search-history__del::before,
      .md-header .md-search__inner .mk-search-history__del::after{
        display: none !important;
        content: none !important;
      }

      .md-header .md-search__inner .mk-search-history__clear{
        appearance: none !important;
        -webkit-appearance: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        outline: none !important;
        color: var(--md-default-fg-color--light) !important;
        font-size: .74rem !important;
        font-weight: 550 !important;
        line-height: 1.1 !important;
        text-decoration: none !important;
        -webkit-tap-highlight-color: transparent !important;
        transition: color 140ms ease, opacity 140ms ease !important;
      }
      .md-header .md-search__inner .mk-search-history__clear:hover,
      .md-header .md-search__inner .mk-search-history__clear:focus,
      .md-header .md-search__inner .mk-search-history__clear:focus-visible{
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        outline: none !important;
        color: var(--md-accent-fg-color) !important;
      }
      .md-header .md-search__inner .mk-search-history__clear::before,
      .md-header .md-search__inner .mk-search-history__clear::after{
        display: none !important;
        content: none !important;
      }
      .md-header .md-search__inner .mk-search-history__hint{
        display: none !important;
      }
      .md-header .md-search__inner .mk-search-history__footer{
        justify-content: flex-end !important;
        gap: 0 !important;
      }

      /* v61 cosmetic search skins: only recolour the real rounded surfaces.
         Do not paint .md-search__output, because on mobile it is only a
         positioning shell and painting it breaks the custom layout. */
      html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search-result{
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
        filter:none !important;
        padding:0 !important;
        margin:0 !important;
        overflow:visible !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output,
      html[data-mk-search-box-effect] .md-header .md-search__output{ position:absolute !important; }
      html[data-mk-search-box-effect] .md-header .md-search__output::before,
      html[data-mk-search-box-effect] .md-header .md-search__output::after,
      html[data-mk-search-box-effect] .md-header .md-search-result::before,
      html[data-mk-search-box-effect] .md-header .md-search-result::after{
        display:none !important;
        content:none !important;
        background:transparent !important;
        border:0 !important;
        box-shadow:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap,
      html[data-mk-search-box-effect] .md-header .md-search__inner.mk-search-result-open > .md-search__output .md-search__scrollwrap{
        position:relative !important;
        overflow:hidden !important;
        border-radius:var(--mk-header-search-radius,18px) !important;
        background:var(--mk-search-effect-surface, var(--md-default-bg-color)) !important;
        border:1px solid var(--mk-search-effect-border, rgba(148,163,184,.18)) !important;
        box-shadow:var(--mk-search-effect-shadow, var(--md-shadow-z3)) !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        -webkit-mask-image:-webkit-radial-gradient(white, black) !important;
        mask-image:radial-gradient(white, black) !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__list,
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .md-search-result__list,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__panel,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__scroll,
      html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap .mk-search-suggest__list{
        background:transparent !important;
        border-color:color-mix(in srgb,var(--mk-search-effect-border, rgba(148,163,184,.18)) 55%, transparent) !important;
        box-shadow:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }
      html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history .mk-search-history__footer{ background:var(--mk-search-effect-footer, rgba(255,255,255,.05)) !important; }
      html[data-mk-search-box-effect="header_search_sparkle"]{ --mk-search-effect-surface:linear-gradient(135deg,rgba(255,251,235,.98),rgba(254,243,199,.94)); --mk-search-effect-border:rgba(250,204,21,.46); --mk-search-effect-shadow:0 14px 42px rgba(250,204,21,.16),0 16px 44px rgba(15,23,42,.16); --mk-search-effect-footer:rgba(250,204,21,.10); }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_sparkle"]{ --mk-search-effect-surface:linear-gradient(135deg,rgba(24,24,27,.98),rgba(67,56,18,.92)); --mk-search-effect-footer:rgba(250,204,21,.08); }
      html[data-mk-search-box-effect="header_search_flower"]{ --mk-search-effect-surface:linear-gradient(135deg,rgba(253,242,248,.98),rgba(255,228,230,.94)); --mk-search-effect-border:rgba(244,114,182,.38); --mk-search-effect-shadow:0 14px 42px rgba(244,114,182,.14),0 16px 44px rgba(15,23,42,.14); --mk-search-effect-footer:rgba(244,114,182,.10); }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_flower"]{ --mk-search-effect-surface:linear-gradient(135deg,rgba(30,41,59,.98),rgba(76,29,149,.90)); --mk-search-effect-footer:rgba(244,114,182,.08); }
      html[data-mk-search-box-effect="header_search_dragon"]{ --mk-search-effect-surface:linear-gradient(135deg,rgba(255,237,213,.98),rgba(254,243,199,.94)); --mk-search-effect-border:rgba(249,115,22,.40); --mk-search-effect-shadow:0 14px 42px rgba(249,115,22,.15),0 16px 44px rgba(15,23,42,.15); --mk-search-effect-footer:rgba(249,115,22,.10); }
      html[data-md-color-scheme="slate"][data-mk-search-box-effect="header_search_dragon"]{ --mk-search-effect-surface:linear-gradient(135deg,rgba(30,41,59,.98),rgba(67,20,7,.92)); --mk-search-effect-footer:rgba(249,115,22,.08); }
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect] .md-header .mk-search-history::before,
      html[data-mk-search-box-effect] .md-header .mk-search-history::after{ position:absolute !important; z-index:0 !important; pointer-events:none !important; }
      html[data-mk-search-box-effect] .md-header .md-search__scrollwrap > *,
      html[data-mk-search-box-effect] .md-header .mk-search-history > *{ position:relative !important; z-index:1 !important; }
      html[data-mk-search-box-effect="header_search_sparkle"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_sparkle"] .md-header .mk-search-history::after{ content:"✦   ✧   ✨" !important; right:16px !important; bottom:12px !important; color:#facc15 !important; font-size:18px !important; text-shadow:0 0 12px rgba(250,204,21,.78),0 0 26px rgba(250,204,21,.38) !important; animation:mk-sparkle-row-v58 1.1s ease-in-out infinite !important; }
      html[data-mk-search-box-effect="header_search_flower"] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect="header_search_flower"] .md-header .mk-search-history::before{ content:"🌸" !important; right:16px !important; top:12px !important; font-size:22px !important; filter:drop-shadow(0 0 9px rgba(244,114,182,.42)) !important; animation:mk-blossom-float-v58 2.6s ease-in-out infinite !important; }
      html[data-mk-search-box-effect="header_search_flower"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_flower"] .md-header .mk-search-history::after{ content:"❀   ✿" !important; left:18px !important; bottom:12px !important; color:#f472b6 !important; font-size:17px !important; opacity:.78 !important; }
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .md-search__scrollwrap::before,
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .mk-search-history::before{ content:"🐉" !important; right:18px !important; top:12px !important; font-size:25px !important; opacity:.78 !important; filter:drop-shadow(0 0 9px rgba(34,197,94,.35)) !important; animation:mk-dragon-float-v58 3.1s ease-in-out infinite !important; }
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .md-search__scrollwrap::after,
      html[data-mk-search-box-effect="header_search_dragon"] .md-header .mk-search-history::after{ content:"★★★" !important; right:18px !important; bottom:14px !important; width:27px !important; height:27px !important; border-radius:999px !important; display:grid !important; place-items:center !important; font-size:7px !important; color:#dc2626 !important; background:radial-gradient(circle at 34% 26%,#fde68a 0 15%,#fbbf24 34%,#f97316 72%,#ea580c 100%) !important; box-shadow:0 0 18px rgba(249,115,22,.55) !important; }
      @media screen and (max-width:59.984375em){
        html[data-mk-search-box-effect] .md-header .md-search__inner > .md-search__output{ top:calc(2.4rem + var(--mk-header-search-gap,4px)) !important; left:0 !important; right:0 !important; width:auto !important; transform:none !important; }
        html[data-mk-search-box-effect] .md-header .md-search__inner > .mk-search-history,
        html[data-mk-search-box-effect] #__search:checked ~ .md-header .md-search__scrollwrap{ max-height:calc(100dvh - 2.4rem - 12px) !important; border-radius:var(--mk-header-search-mobile-radius,18px) !important; }
      }

    `;(document.head||document.documentElement).appendChild(style);}
let suppressBlurHideUntil=0;let searchUiGraceUntil=0;let explicitCloseUntil=0;let historyApplyUntil=0;let historyActionLockUntil=0;let emptyClearUntil=0;let headerSearchUserOpened=false;function markHeaderSearchUserOpened(){headerSearchUserOpened=true;try{window.__mkSearchHistoryUserOpened="1";}catch(_){}}
function clearHeaderSearchUserOpened(){headerSearchUserOpened=false;try{window.__mkSearchHistoryUserOpened="0";}catch(_){}}
function hasHeaderSearchUserOpened(){try{return headerSearchUserOpened||window.__mkSearchHistoryUserOpened==="1";}catch(_){return headerSearchUserOpened;}}
function markHistoryApply(ms){historyApplyUntil=Date.now()+Math.max(420,Number(ms)||0);try{window.__mkSearchHistoryApplyingUntil=historyApplyUntil;}catch(_){}}
function hasHistoryApply(){try{const shared=Number(window.__mkSearchHistoryApplyingUntil||0);return Date.now()<Math.max(historyApplyUntil,shared);}catch(_){return Date.now()<historyApplyUntil;}}
function clearHistoryApply(){historyApplyUntil=0;try{window.__mkSearchHistoryApplyingUntil=0;}catch(_){}}
function markEmptyClear(ms){emptyClearUntil=Date.now()+Math.max(260,Number(ms)||0);try{window.__mkSearchHistoryEmptyClearUntil=emptyClearUntil;}catch(_){}}
function hasEmptyClear(){try{const shared=Number(window.__mkSearchHistoryEmptyClearUntil||0);return Date.now()<Math.max(emptyClearUntil,shared);}catch(_){return Date.now()<emptyClearUntil;}}
function clearEmptyClear(){emptyClearUntil=0;try{window.__mkSearchHistoryEmptyClearUntil=0;}catch(_){}}
function lockHistoryAction(ms){historyActionLockUntil=Date.now()+Math.max(220,Number(ms)||0);}
function isHistoryActionLocked(){return Date.now()<historyActionLockUntil;}
function markSearchUiGrace(ms){const extra=Math.max(320,Number(ms)||0);const until=Date.now()+extra;if(until>searchUiGraceUntil)searchUiGraceUntil=until;try{const prev=Number(window.__mkFindHeaderSearchGraceUntil||0);if(until>prev)window.__mkFindHeaderSearchGraceUntil=until;}catch(_){}}
function markHeaderSearchInteraction(ms){markHeaderSearchUserOpened();try{window.__mkHeaderSearchUserTouchTs=Date.now();}catch(_){}
markSearchUiGrace(ms);}
function clearSearchUiGrace(){searchUiGraceUntil=0;clearHeaderSearchUserOpened();try{window.__mkFindHeaderSearchGraceUntil=0;}catch(_){}}
function markExplicitClose(ms){const until=Date.now()+Math.max(1800,Number(ms)||0);if(until>explicitCloseUntil)explicitCloseUntil=until;try{window.__mkSearchHistoryExplicitCloseUntil=until;}catch(_){}}
function clearExplicitClose(){explicitCloseUntil=0;try{window.__mkSearchHistoryExplicitCloseUntil=0;}catch(_){}}
function hasExplicitClose(){try{const shared=Number(window.__mkSearchHistoryExplicitCloseUntil||0);return Date.now()<Math.max(explicitCloseUntil,shared);}catch(_){return Date.now()<explicitCloseUntil;}}
function isSearchClearControl(el){const ctrl=el&&el.closest?el.closest('button, label, [role="button"], .md-search__icon, .md-icon'):null;if(!ctrl)return false;try{const title=String((ctrl.getAttribute&&ctrl.getAttribute('title'))||'').trim().toLowerCase();const aria=String((ctrl.getAttribute&&ctrl.getAttribute('aria-label'))||'').trim().toLowerCase();const cls=String(ctrl.className||'').toLowerCase();if(title==='clear'||aria==='clear')return true;if(cls.includes('clear'))return true;}catch(_){}
return false;}
function collapseHeaderSearchUi(reason){try{const root=document.querySelector('.md-header .md-search.md-search--active')||document.querySelector('.md-header .md-search');const toggle=getSearchToggle();const input=resolveLiveInput(root&&root.querySelector?root.querySelector(INPUT_SELECTOR):getLikelyInput(),root||document);if(root&&root.classList)root.classList.remove('md-search--active');if(toggle)toggle.checked=false;if(input){try{input.blur();}catch(_){}}
if(reason==='outside'){clearSearchUiGrace();clearHistoryApply();markExplicitClose(640);}
hideAllDropdowns();if(input)setMaterialOutputSuppressed(input,false);return true;}catch(_){return false;}}
function hasSearchUiGrace(input){try{if(!input||!input.isConnected)return false;const sharedUntil=Number(window.__mkFindHeaderSearchGraceUntil||0);const until=Math.max(searchUiGraceUntil,sharedUntil);if(Date.now()>=until)return false;const shell=getHeaderSearchRoot(input);const toggle=getSearchToggle();const ae=document.activeElement;if(ae===input)return true;if(shell&&ae&&shell.contains&&shell.contains(ae))return true;if(shell&&shell.classList&&shell.classList.contains('md-search--active'))return true;if(toggle&&toggle.checked)return true;return false;}catch(_){return false;}}
function markDropdownInteraction(){suppressBlurHideUntil=Date.now()+260;markSearchUiGrace(640);}
function stopEvent(e){if(!e)return;try{e.preventDefault();}catch(_){}
try{e.stopPropagation();}catch(_){}
try{if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_){}}
function bindTouchActivation(el,handler,capture){if(!el||!handler)return;let lastTouchTs=0;const useCapture=!!capture;el.addEventListener("touchend",(e)=>{lastTouchTs=Date.now();handler(e);},{capture:useCapture,passive:false});el.addEventListener("click",(e)=>{if(Date.now()-lastTouchTs<420){stopEvent(e);return;}
handler(e);},useCapture);}
function blockSuggestionClicks(ms){try{window.__mkSearchSuggestClickBlockUntil=Date.now()+Math.max(180,Number(ms)||420);}catch(_){}}
let lastFocusedInput=null;function readHistory(){try{const raw=localStorage.getItem(STORAGE_KEY);const arr=raw?JSON.parse(raw):[];return Array.isArray(arr)?arr.filter(Boolean).map(String):[];}catch(_){return[];}}
function writeHistory(arr){try{localStorage.setItem(STORAGE_KEY,JSON.stringify((arr||[]).slice(0,MAX_ITEMS)));}catch(_){}}
function addToHistory(q){const s=String(q||"").trim();if(!s)return;const arr=readHistory();const next=[s,...arr.filter((x)=>x.toLowerCase()!==s.toLowerCase())];writeHistory(next);}
function removeFromHistory(q){const s=String(q||"").trim();if(!s)return;writeHistory(readHistory().filter((x)=>x.toLowerCase()!==s.toLowerCase()));}
function clearHistory(){writeHistory([]);}
function getAllInputs(){return Array.from(document.querySelectorAll('.md-header '+INPUT_SELECTOR)).filter(isHeaderSearchInput);}
function isVisible(el){try{if(!el)return false;if(el.offsetParent===null)return false;const cs=window.getComputedStyle(el);return cs.visibility!=="hidden"&&cs.display!=="none";}catch(_){return false;}}
function getLikelyInput(){const ae=document.activeElement;if(isHeaderSearchInput(ae))return ae;if(lastFocusedInput&&lastFocusedInput.isConnected&&lastFocusedInput.matches(INPUT_SELECTOR)){return lastFocusedInput;}
const inputs=getAllInputs();if(!inputs.length)return null;const activeSearch=document.querySelector('.md-header .md-search.md-search--active')||document.querySelector('.md-header .md-search');if(activeSearch){const inActive=inputs.find((i)=>activeSearch.contains(i)&&isVisible(i));if(inActive)return inActive;}
const visible=inputs.find(isVisible);return visible||inputs[0];}
function getSearchRoot(input){const i=input||getLikelyInput();return getHeaderSearchRoot(i)||document;}
function scheduleRefresh(input,delays){const live=input||getLikelyInput();if(!live)return;const seq=Array.isArray(delays)&&delays.length?delays:[0,20,80,160];seq.forEach((ms)=>{window.setTimeout(()=>{try{const current=resolveLiveInput(live,getSearchRoot(live))||live;if(!isHeaderSearchInput(current))return;if(!current||!current.isConnected)return;if(hasExplicitClose()){hideDropdown(current);setMaterialOutputSuppressed(current,false);return;}
updateModeForInput(current);}catch(_){}},ms);});}
function getOverlayContainer(input){const i=input||getLikelyInput();if(!i)return null;return i.closest(".md-search__inner")||i.parentElement;}
function getSearchInner(input){try{const i=input||getLikelyInput();if(i&&i.closest)return i.closest(".md-search__inner");}catch(_){}
return null;}
function setHistorySurfaceOpen(input,open){try{const inner=getSearchInner(input);if(inner&&inner.classList)inner.classList.toggle("mk-search-history-open",!!open);const search=inner&&inner.closest?inner.closest(".md-search"):getHeaderSearchRoot(input);if(search&&search.classList)search.classList.toggle("mk-search-history-open",!!open);}catch(_){}}
function setResultSurfaceOpen(input,open){try{const inner=getSearchInner(input);if(inner&&inner.classList)inner.classList.toggle("mk-search-result-open",!!open);const search=inner&&inner.closest?inner.closest(".md-search"):getHeaderSearchRoot(input);if(search&&search.classList)search.classList.toggle("mk-search-result-open",!!open);}catch(_){}}
function resolveLiveInput(input,root){if(input&&input.isConnected&&input.matches&&input.matches(INPUT_SELECTOR))return input;try{const host=root&&root.parentElement;if(host){const local=host.querySelector(INPUT_SELECTOR);if(local)return local;}}catch(_){}
try{const searchRoot=root&&root.__mkSearchRoot;if(searchRoot&&searchRoot.isConnected){const inside=Array.from(searchRoot.querySelectorAll(INPUT_SELECTOR)).find(isVisible);if(inside)return inside;}}catch(_){}
try{const fallback=getLikelyInput();if(fallback)return fallback;}catch(_){}
return null;}
function getMaterialOutput(input){const root=getSearchRoot(input);return root?root.querySelector(".md-search__output"):null;}
function setMaterialOutputSuppressed(input,suppressed){const out=getMaterialOutput(input);if(!out||!out.style)return;if(suppressed){out.dataset.mkHistorySuppressed="1";out.style.setProperty("display","none","important");out.style.setProperty("pointer-events","none","important");}else{try{out.style.removeProperty("display");}catch(_){}
try{out.style.removeProperty("pointer-events");}catch(_){}
try{out.style.removeProperty("visibility");}catch(_){}
try{out.style.removeProperty("opacity");}catch(_){}
try{out.removeAttribute("aria-hidden");}catch(_){}
try{delete out.dataset.mkHistorySuppressed;}catch(_){}}}
function hideAllDropdowns(){try{document.querySelectorAll(`.${ROOT_CLASS}`).forEach((root)=>{try{root.style.display="none";}catch(_){}
try{root.setAttribute("aria-hidden","true");}catch(_){}
try{const inner=root.closest&&root.closest(".md-search__inner");if(inner&&inner.classList){inner.classList.remove("mk-search-history-open");inner.classList.remove("mk-search-result-open");}
const search=root.closest&&root.closest(".md-search");if(search&&search.classList){search.classList.remove("mk-search-history-open");search.classList.remove("mk-search-result-open");}}catch(_){}
try{root.querySelectorAll(`.${ITEM_CLASS}.${ACTIVE_CLASS}`).forEach((el)=>el.classList.remove(ACTIVE_CLASS));}catch(_){}});}catch(_){}
try{document.querySelectorAll(".md-search__output").forEach((out)=>{if(!out||!out.style)return;if(out.dataset&&out.dataset.mkHistorySuppressed==="1"){try{out.style.removeProperty("display");}catch(_){}
try{out.style.removeProperty("pointer-events");}catch(_){}
try{delete out.dataset.mkHistorySuppressed;}catch(_){}}});}catch(_){}}
function ensureDropdown(input){const host=getOverlayContainer(input);if(!host)return null;let root=host.querySelector(`.${ROOT_CLASS}`);if(root){try{root.__mkOwnerInput=input||root.__mkOwnerInput||null;root.__mkSearchRoot=getSearchRoot(input)||root.__mkSearchRoot||null;}catch(_){}
return root;}
try{const cs=window.getComputedStyle(host);if(cs.position==="static")host.style.position="relative";}catch(_){}
root=document.createElement("div");root.className=ROOT_CLASS;root.setAttribute("role","listbox");root.style.display="none";const list=document.createElement("div");list.className=LIST_CLASS;root.appendChild(list);const footer=document.createElement("div");footer.className="mk-search-history__footer";const clearBtn=document.createElement("button");clearBtn.type="button";clearBtn.className="mk-search-history__clear";clearBtn.textContent="Clear history";clearBtn.addEventListener("pointerdown",(e)=>{markDropdownInteraction();e.stopPropagation();},true);clearBtn.addEventListener("mousedown",(e)=>{markDropdownInteraction();e.stopPropagation();},true);clearBtn.addEventListener("touchstart",(e)=>{markDropdownInteraction();e.stopPropagation();},{capture:true,passive:true});const handleClear=(e)=>{stopEvent(e);const liveInput=resolveLiveInput(input,root)||input;clearHistory();blockSuggestionClicks(520);hideDropdown(liveInput);hideAllDropdowns();try{liveInput.focus({preventScroll:true});}catch(_){try{liveInput.focus();}catch(_){}}};bindTouchActivation(clearBtn,handleClear,true);footer.appendChild(clearBtn);root.appendChild(footer);root.addEventListener("pointerdown",()=>{markDropdownInteraction();},true);root.addEventListener("mousedown",()=>{markDropdownInteraction();},true);root.addEventListener("touchstart",()=>{markDropdownInteraction();},{capture:true,passive:true});try{root.__mkOwnerInput=input||null;root.__mkSearchRoot=getSearchRoot(input)||null;}catch(_){}
host.appendChild(root);return root;}
function filteredHistory(query){const q=String(query||"").trim().toLowerCase();const arr=readHistory();if(!q)return arr;return arr.filter((x)=>x.toLowerCase().includes(q));}
function setActiveIndex(root,idx){const items=Array.from(root.querySelectorAll(`.${ITEM_CLASS}`));items.forEach((el)=>el.classList.remove(ACTIVE_CLASS));if(idx<0||idx>=items.length)return-1;items[idx].classList.add(ACTIVE_CLASS);try{items[idx].scrollIntoView({block:"nearest"});}catch(_){}
return idx;}
function applyHistoryToInput(input,text,root){const liveInput=resolveLiveInput(input,root);if(!liveInput)return;liveInput.value=text;lastFocusedInput=liveInput;clearExplicitClose();markHeaderSearchInteraction(1200);markHistoryApply(900);lockHistoryAction(520);blockSuggestionClicks(520);hideAllDropdowns();setMaterialOutputSuppressed(liveInput,false);const searchRoot=getSearchRoot(liveInput);try{if(searchRoot&&searchRoot.classList)searchRoot.classList.add("md-search--active");}catch(_){}
try{liveInput.focus({preventScroll:true});}catch(_){try{liveInput.focus();}catch(_){}}
try{const n=String(text||"").length;if(typeof liveInput.setSelectionRange==="function")liveInput.setSelectionRange(n,n);}catch(_){}
const dispatchSignals=()=>{try{let iev=null;try{iev=new InputEvent("input",{bubbles:true,data:null,inputType:"insertReplacementText"});}catch(_){iev=new Event("input",{bubbles:true});}
liveInput.dispatchEvent(iev);}catch(_){}
try{liveInput.dispatchEvent(new Event("change",{bubbles:true}));}catch(_){}
try{liveInput.dispatchEvent(new Event("search",{bubbles:true}));}catch(_){}
try{liveInput.dispatchEvent(new KeyboardEvent("keyup",{bubbles:true,cancelable:true,key:"End",code:"End"}));}catch(_){}};dispatchSignals();window.setTimeout(dispatchSignals,0);window.setTimeout(dispatchSignals,28);window.setTimeout(dispatchSignals,96);window.setTimeout(()=>{try{const current=resolveLiveInput(liveInput,root)||liveInput;if(!current||!current.isConnected)return;if((current.value||'').trim()){hideDropdown(current);setMaterialOutputSuppressed(current,false);}}catch(_){}
clearHistoryApply();},420);}
function renderDropdown(input){const root=ensureDropdown(input);if(!input||!root)return;const list=root.querySelector(`.${LIST_CLASS}`);if(!list)return;const items=filteredHistory(input.value);list.innerHTML="";if(!items.length){const empty=document.createElement("div");empty.className="mk-search-history__empty";empty.textContent="No recent searches";list.appendChild(empty);return;}
for(const text of items){const row=document.createElement("div");row.className=ITEM_CLASS;row.setAttribute("role","option");row.tabIndex=-1;row.dataset.mkHistoryText=text;const left=document.createElement("div");left.className="mk-search-history__text";left.textContent=text;const del=document.createElement("button");del.type="button";del.className="mk-search-history__del";del.setAttribute("aria-label","Remove");del.textContent="×";del.addEventListener("pointerdown",(e)=>{markDropdownInteraction();e.stopPropagation();},true);del.addEventListener("mousedown",(e)=>{markDropdownInteraction();e.stopPropagation();},true);del.addEventListener("touchstart",(e)=>{markDropdownInteraction();e.stopPropagation();},{capture:true,passive:true});const handleDelete=(e)=>{if(isHistoryActionLocked()){stopEvent(e);return;}
lockHistoryAction(320);stopEvent(e);const liveInput=resolveLiveInput(input,root)||input;removeFromHistory(text);blockSuggestionClicks(420);if(!readHistory().length){hideDropdown(liveInput);hideAllDropdowns();}else{renderDropdown(liveInput);root.style.display="block";}
try{liveInput.focus({preventScroll:true});}catch(_){try{liveInput.focus();}catch(_){}}};bindTouchActivation(del,handleDelete,true);row.appendChild(left);row.appendChild(del);const pick=(e)=>{if(e&&e.target&&e.target.closest&&e.target.closest(".mk-search-history__del"))return;if(e&&typeof e.button==="number"&&e.button!==0)return;if(isHistoryActionLocked()){stopEvent(e);return;}
lockHistoryAction(520);markDropdownInteraction();if(e){e.preventDefault();e.stopPropagation();}
const liveInput=resolveLiveInput(input,root)||input;blockSuggestionClicks(520);applyHistoryToInput(liveInput,text,root);requestAnimationFrame(()=>updateModeForInput(resolveLiveInput(liveInput,root)||liveInput));};row.addEventListener("pointerdown",pick,true);row.addEventListener("mousedown",pick,true);bindTouchActivation(row,pick,true);list.appendChild(row);}}
function showDropdown(input){const root=ensureDropdown(input);if(!input||!root)return;hideAllDropdowns();renderDropdown(input);root.style.display="block";try{root.setAttribute("aria-hidden","false");}catch(_){}
setHistorySurfaceOpen(input,true);setResultSurfaceOpen(input,false);setMaterialOutputSuppressed(input,true);}
function hideDropdown(input){const root=ensureDropdown(input);if(root){root.style.display="none";try{root.setAttribute("aria-hidden","true");}catch(_){}}
setHistorySurfaceOpen(input,false);try{if(!input||!(input.value||"").trim())setResultSurfaceOpen(input,false);}catch(_){}
if(input)setMaterialOutputSuppressed(input,false);if(root){try{root.querySelectorAll(`.${ITEM_CLASS}.${ACTIVE_CLASS}`).forEach((el)=>el.classList.remove(ACTIVE_CLASS));}catch(_){}}}
function isSearchUiActive(input){if(!hasHeaderSearchUserOpened())return false;const toggle=getSearchToggle();if(toggle&&toggle.checked)return true;const ae=document.activeElement;if(input&&ae===input)return true;if(ae&&ae.closest&&ae.closest(".md-header .md-search"))return true;const activeSearch=document.querySelector(".md-header .md-search.md-search--active");if(activeSearch)return true;return false;}
function updateModeForInput(input){if(!input||!input.isConnected)return;const root=ensureDropdown(input);if(!root)return;if(hasExplicitClose()){const ae=document.activeElement;const inside=!!(root&&ae&&(ae===input||root.contains(ae)||(ae.closest&&ae.closest('.md-header .md-search'))));if(!inside){hideDropdown(input);setMaterialOutputSuppressed(input,false);return;}}
const q=(input.value||"").trim();const hasHistory=readHistory().length>0;if(hasHistoryApply()){hideDropdown(input);setMaterialOutputSuppressed(input,false);return;}
if(!isSearchUiActive(input)){hideDropdown(input);setResultSurfaceOpen(input,false);setMaterialOutputSuppressed(input,false);return;}
if(q){hideDropdown(input);setResultSurfaceOpen(input,true);return;}
if(hasEmptyClear()){hideDropdown(input);setResultSurfaceOpen(input,false);setMaterialOutputSuppressed(input,false);return;}
if(hasHistory){showDropdown(input);}else{hideDropdown(input);}}
function bindPerInput(input){if(!input||!input.matches||!input.matches(INPUT_SELECTOR))return;if(input.dataset.mkHistoryBound==="1")return;input.dataset.mkHistoryBound="1";input.addEventListener("focus",(ev)=>{lastFocusedInput=input;try{input.dataset.mkHistoryPrevValue=String(input.value||"");}catch(_){}
clearExplicitClose();if((input.value||'').trim())clearEmptyClear();if(!ev||ev.isTrusted)markHeaderSearchInteraction(1200);updateModeForInput(input);scheduleRefresh(input,[0,30,90,180,320,520,900]);},{passive:true});input.addEventListener("input",()=>{lastFocusedInput=input;const nextValue=String(input.value||'');const nextTrim=nextValue.trim();const prevValue=String((input.dataset&&input.dataset.mkHistoryPrevValue)||'');const prevTrim=prevValue.trim();try{input.dataset.mkHistoryPrevValue=nextValue;}catch(_){}
clearExplicitClose();if(nextTrim){clearHistoryApply();clearEmptyClear();}else if(prevTrim){markEmptyClear(360);}
markSearchUiGrace(nextTrim?240:1200);updateModeForInput(input);},{passive:true});input.addEventListener("search",()=>{lastFocusedInput=input;try{input.dataset.mkHistoryPrevValue=String(input.value||'');}catch(_){}
clearExplicitClose();if((input.value||'').trim()){clearEmptyClear();markSearchUiGrace(640);scheduleRefresh(input);return;}
markEmptyClear(620);hideDropdown(input);setMaterialOutputSuppressed(input,false);},{passive:true});input.addEventListener("change",()=>{lastFocusedInput=input;try{input.dataset.mkHistoryPrevValue=String(input.value||'');}catch(_){}
clearExplicitClose();if((input.value||'').trim()){clearEmptyClear();markSearchUiGrace(640);scheduleRefresh(input);return;}
if(hasEmptyClear()){hideDropdown(input);setMaterialOutputSuppressed(input,false);return;}
markSearchUiGrace(640);scheduleRefresh(input);},{passive:true});input.addEventListener("blur",()=>{window.setTimeout(()=>{const now=Date.now();const root=ensureDropdown(input);const ae=document.activeElement;const inside=root&&ae&&(ae===root||root.contains(ae));if(inside||now<suppressBlurHideUntil){const qv=(input.value||"").trim();if(qv){hideDropdown(input);return;}
if(root)root.style.display="block";try{input.focus({preventScroll:true});}catch(_){try{input.focus();}catch(_){}}
return;}
const qv=(input.value||"").trim();if(!qv&&hasEmptyClear()){hideDropdown(input);setMaterialOutputSuppressed(input,false);return;}
if(hasExplicitClose()){hideDropdown(input);setMaterialOutputSuppressed(input,false);return;}
if(hasHistoryApply()){hideDropdown(input);setMaterialOutputSuppressed(input,false);return;}
if(!isSearchUiActive(input)){hideDropdown(input);setMaterialOutputSuppressed(input,false);return;}
if(!qv&&hasSearchUiGrace(input)){showDropdown(input);return;}
hideDropdown(input);},80);});input.addEventListener("keydown",(ev)=>{if(ev.isComposing||ev.keyCode===229||input.__mkSearchComposing)return;const root=ensureDropdown(input);const dropdownVisible=root&&root.style.display!=="none";if(!dropdownVisible){if(ev.key==="Escape")hideDropdown(input);return;}
const items=Array.from(root.querySelectorAll(`.${ITEM_CLASS}`));const active=root.querySelector(`.${ITEM_CLASS}.${ACTIVE_CLASS}`);let idx=active?items.indexOf(active):-1;if(ev.key==="ArrowDown"){ev.preventDefault();ev.stopPropagation();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();idx=Math.min(items.length-1,idx+1);setActiveIndex(root,idx);}else if(ev.key==="ArrowUp"){ev.preventDefault();ev.stopPropagation();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();idx=Math.max(0,idx-1);setActiveIndex(root,idx);}else if(ev.key==="Enter"){if(active){ev.preventDefault();ev.stopPropagation();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();const text=String(active.dataset.mkHistoryText||active.querySelector(".mk-search-history__text")?.textContent||"").trim();if(text){const liveInput=resolveLiveInput(input,root)||input;applyHistoryToInput(liveInput,text,root);requestAnimationFrame(()=>updateModeForInput(resolveLiveInput(liveInput,root)||liveInput));}
return;}}else if(ev.key==="Escape"){ev.preventDefault();ev.stopPropagation();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();hideDropdown(input);}},true);hideDropdown(input);}
function bindGlobalOnce(){if(window.__mkSearchHistoryGlobalBoundV5)return;window.__mkSearchHistoryGlobalBoundV5=true;document.addEventListener("pointerdown",(ev)=>{const t=ev&&ev.target;if(!t||!t.closest)return;if(t.closest(`.${ROOT_CLASS}`)){markSearchUiGrace(640);return;}
if(t.closest('.md-header .md-search, label[for="__search"], [for="__search"], input#__search, input.md-toggle[data-md-toggle="search"]')){markHeaderSearchInteraction(1200);return;}
clearSearchUiGrace();clearHistoryApply();clearEmptyClear();markExplicitClose(640);collapseHeaderSearchUi('outside');hideAllDropdowns();},true);document.addEventListener("click",(ev)=>{const t=ev.target;if(!t||!t.closest)return;const root=t.closest(".md-search");if(!root)return;const ctrl=t.closest("button, label, [role=button], .md-search__icon, .md-icon");if(!ctrl)return;if(Date.now()<suppressBlurHideUntil)return;if(hasExplicitClose())return;if(t.closest(`.${ROOT_CLASS}`)||t.closest('.mk-search-suggest'))return;const input=resolveLiveInput(root.querySelector(INPUT_SELECTOR)||getLikelyInput(),root);if(!isHeaderSearchInput(input))return;if(!input)return;lastFocusedInput=input;if(isSearchClearControl(ctrl)){markEmptyClear(620);hideDropdown(input);setMaterialOutputSuppressed(input,false);return;}
clearEmptyClear();markSearchUiGrace(640);scheduleRefresh(input,[0,30,90,180,320,520,900]);},true);document.addEventListener("change",(ev)=>{const t=ev&&ev.target;if(!t||!t.matches)return;if(!(t.matches('input.md-toggle[data-md-toggle="search"]')||t.matches('input#__search')||t.matches('#__search')))return;if(t.checked){clearExplicitClose();clearEmptyClear();markHeaderSearchInteraction(1200);const input=getLikelyInput();if(input)scheduleRefresh(input,[0,30,90,180,320,520,900]);return;}
clearSearchUiGrace();clearHistoryApply();clearEmptyClear();markExplicitClose(640);hideAllDropdowns();},true);document.addEventListener("keydown",(ev)=>{const t=ev.target;if(!isHeaderSearchInput(t))return;if(ev.isComposing||ev.keyCode===229||t.__mkSearchComposing)return;if(ev.key!=="Enter")return;addToHistory(t.value);},true);document.addEventListener("click",(ev)=>{const a=ev.target&&ev.target.closest?ev.target.closest("a.md-search-result__link"):null;if(!a)return;const input=getLikelyInput();const q=input?(input.value||"").trim():"";if(q)addToHistory(q);},true);}
function bindAllInputs(){getAllInputs().forEach(bindPerInput);}
function bindInputsFromAddedNodes(records){for(const record of records||[]){const added=record&&record.addedNodes;if(!added||!added.length)continue;for(const node of added){if(!node||node.nodeType!==1)continue;try{if(node.matches&&node.matches(INPUT_SELECTOR)&&isHeaderSearchInput(node)){bindPerInput(node);}
if(node.querySelectorAll){node.querySelectorAll(INPUT_SELECTOR).forEach((input)=>{if(isHeaderSearchInput(input))bindPerInput(input);});}}catch(_){}}}}
function init(){ensureSearchUiPatchStyle();bindGlobalOnce();bindAllInputs();clearExplicitClose();clearHistoryApply();clearEmptyClear();clearSearchUiGrace();hideAllDropdowns();const active=getLikelyInput();if(active){updateModeForInput(active);scheduleRefresh(active,[0,30,90,180,320,520,900]);}}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
document.addEventListener("DOMContentSwitch",init);const mo=new MutationObserver(bindInputsFromAddedNodes);try{mo.observe(document.documentElement,{childList:true,subtree:true});}catch(_){}
function __mkFindResidueCleanupV8(){try{var path=String(location.pathname||'').toLowerCase().replace(/\/index\.html$/,'/');var isFind=path.endsWith('/find/')||path.endsWith('/find.html')||path.endsWith('/find');if(!isFind)return;var ae=document.activeElement;var toggle=document.querySelector('input.md-toggle[data-md-toggle="search"], input#__search, #__search');var shell=document.querySelector('.md-header .md-search');var html=document.documentElement;var body=document.body;var active=!!((toggle&&toggle.checked)||(ae&&ae.closest&&ae.closest('.md-header .md-search'))||(shell&&shell.classList&&shell.classList.contains('md-search--active'))||(shell&&shell.getAttribute&&shell.getAttribute('data-mk-search-force-active')==='1')||(html&&html.classList&&(html.classList.contains('md-search--active')||html.classList.contains('mk-hsf-open')))||(body&&body.classList&&body.classList.contains('md-search--active')));if(active)return;if(toggle)toggle.checked=false;document.querySelectorAll('.md-header .md-search.md-search--active').forEach(function(el){el.classList.remove('md-search--active');});document.documentElement.classList.remove('md-search--active');if(document.body)document.body.classList.remove('md-search--active');document.querySelectorAll('.md-header .md-search__output,.md-header .md-search__overlay,.md-header .mk-search-history,.md-header .mk-search-suggest').forEach(function(el){try{el.style.display='none';el.style.opacity='0';el.style.pointerEvents='none';el.setAttribute('aria-hidden','true');}catch(_){}});document.querySelectorAll('.md-search__inner.mk-search-history-open,.md-search.mk-search-history-open,.md-search__inner.mk-search-result-open,.md-search.mk-search-result-open').forEach(function(el){try{el.classList.remove('mk-search-history-open');el.classList.remove('mk-search-result-open');}catch(_){}});var bd=document.getElementById('mk-mobile-search-backdrop');if(bd){bd.style.display='none';bd.style.opacity='0';bd.style.backdropFilter='none';bd.style.webkitBackdropFilter='none';}
try{if(window.__mkFindNoBlurCleanupV8)window.__mkFindNoBlurCleanupV8();}catch(_){}}catch(_){}}
try{[0,40,120,280,700,1200,1800].forEach(function(ms){setTimeout(__mkFindResidueCleanupV8,ms);});document.addEventListener('DOMContentSwitch',function(){[0,40,120,280,700,1200].forEach(function(ms){setTimeout(__mkFindResidueCleanupV8,ms);});});window.addEventListener('pageshow',function(){[0,40,120,280,700,1200].forEach(function(ms){setTimeout(__mkFindResidueCleanupV8,ms);});},{passive:true});}catch(_){}})();