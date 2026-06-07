(function () {
  const LINK_SEL = '.md-typeset p a, .md-typeset li a, .md-typeset td a';
  const MATH_SEL = 'mjx-container, .MathJax, .katex';
  const IGNORE_SEL = 'script, style, mjx-assistive-mml, .MJX_Assistive_MathML';
  const TEXT_WRAP = 'mk-link-text-seg';
  const MATH_WRAP = 'mk-link-math-seg';

  function isMathEl(node) {
    return !!(
      node &&
      node.nodeType === 1 &&
      node.matches &&
      node.matches(MATH_SEL)
    );
  }

  function hasMath(a) {
    return !!(a && a.querySelector && a.querySelector(MATH_SEL));
  }

  function hasVisibleNonMath(node) {
    if (!node) return false;

    if (node.nodeType === Node.TEXT_NODE) {
      return /\S/.test(node.textContent || '');
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return false;

    const el = node;

    if (el.matches && el.matches(`${MATH_SEL}, ${IGNORE_SEL}`)) {
      return false;
    }

    if (
      el.getAttribute &&
      el.getAttribute('aria-hidden') === 'true' &&
      /assistive/i.test(el.className || '')
    ) {
      return false;
    }

    for (const child of el.childNodes || []) {
      if (hasVisibleNonMath(child)) return true;
    }

    return false;
  }

  function unwrapOld(a) {
    if (!a || !a.querySelectorAll) return;

    a.querySelectorAll(`.${TEXT_WRAP}, .${MATH_WRAP}`).forEach((wrap) => {
      const parent = wrap.parentNode;
      if (!parent) return;
      while (wrap.firstChild) parent.insertBefore(wrap.firstChild, wrap);
      parent.removeChild(wrap);
    });
  }

  function wrapNode(node, className) {
    if (!node || !node.parentNode) return null;
    const span = document.createElement('span');
    span.className = className;
    node.parentNode.insertBefore(span, node);
    span.appendChild(node);
    return span;
  }

  function classifyLink(a) {
    a.classList.remove('mk-link-math-only', 'mk-link-math-mixed');
    unwrapOld(a);

    if (!hasMath(a)) return;

    let hasNonMath = false;
    for (const node of a.childNodes) {
      if (hasVisibleNonMath(node)) {
        hasNonMath = true;
        break;
      }
    }

    if (!hasNonMath) {
      a.classList.add('mk-link-math-only');
      return;
    }

    a.classList.add('mk-link-math-mixed');

    const children = Array.from(a.childNodes);

    children.forEach((node) => {
      if (!node || !node.parentNode) return;

      if (node.nodeType === Node.TEXT_NODE) {
        if (/\S/.test(node.textContent || '')) {
          wrapNode(node, TEXT_WRAP);
        }
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const el = node;

      if (el.classList && (el.classList.contains(TEXT_WRAP) || el.classList.contains(MATH_WRAP))) {
        return;
      }

      if (isMathEl(el)) {
        wrapNode(el, MATH_WRAP);
      }
    });
  }

  function run(root) {
    (root || document).querySelectorAll(LINK_SEL).forEach(classifyLink);
  }

  let timer = 0;
  function queueRun() {
    clearTimeout(timer);
    timer = setTimeout(() => run(document), 40);
  }

  let observerStarted = false;
  function startObserver() {
    if (observerStarted) return;
    observerStarted = true;

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue;

          if (
            (n.matches && (n.matches(MATH_SEL) || n.matches(LINK_SEL))) ||
            (n.querySelector && (n.querySelector(MATH_SEL) || n.querySelector(LINK_SEL)))
          ) {
            queueRun();
            return;
          }
        }
      }
    });

    mo.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    queueRun();
    startObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  document.addEventListener('DOMContentSwitch', queueRun);
  window.addEventListener('load', queueRun);
})();