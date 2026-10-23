/**
 * Matrix theme — browser half.
 *
 * A flat near-black canvas with a Codex-Matrix accent, a flush sidebar, a flat
 * session header and two frosted panes (sidebar and composer). The Windows
 * caption row is absorbed into the canvas so the window buttons sit directly on
 * the page. Typography stays with DSH's own font settings.
 *
 * Everything lives in one ctx.effect: the style sheet, the token layer, the
 * <html> marker and the dark pin are removed together when the plugin is
 * disabled or unloaded.
 */

/** Marker attribute gating every rule in the stylesheet. */
const ROOT_ATTRIBUTE = 'data-dsh-matrix';

/** Identity of the token override layer (visible in theme inspection). */
const OVERRIDE_SOURCE = 'dsh-matrix-theme';

/** The stylesheet, inlined by scripts/build.mjs. */
const CSS = __MATRIX_CSS__;

/** Scheme-invariant token value. */
const both = (value) => ({ light: value, dark: value });

/**
 * Flat Matrix palette. Neutral ink carries the text; the mint accent belongs to
 * icons and active controls, and the pale foreground ink is used for hairlines
 * and layout strokes. Fonts and font sizes are deliberately absent.
 */
const TOKENS = {
  // ---------- Ground ----------
  '--dsw-alias-bg-base': both('#040405'),
  '--dsw-alias-bg-layer-1': both('#080808'),
  '--dsw-alias-bg-layer-2': both('#0b0b0b'),
  '--dsw-alias-bg-layer-3': both('#0f0f0f'),
  '--dsw-alias-bg-overlay': both('#0d0d0d'),
  '--dsw-alias-bg-module-platform': both('#080808'),
  '--dsw-alias-bg-multi-select': both('#0b0b0b'),
  '--dsw-alias-bg-skeleton': both('rgba(255, 255, 255, 0.06)'),
  '--dsw-alias-bg-mask-1': both('rgba(0, 0, 0, 0.62)'),
  '--dsw-alias-bg-mask-2': both('rgba(0, 0, 0, 0.32)'),
  '--dsw-alias-bg-mask-3': both('rgba(0, 0, 0, 0.56)'),
  '--dsw-alias-bg-mask-drop': both('rgba(4, 4, 5, 0.76)'),
  '--dsw-alias-bg-mask-photo': both('rgba(0, 0, 0, 0.86)'),
  '--dsw-alias-bg-document-preview': both('#040405'),
  '--dsw-alias-bg-document-selection': both('rgba(198, 255, 213, 0.28)'),
  '--dsw-alias-label-document-preview': both('#a6a6a6'),

  // ---------- Hairlines: foreground ink as the layout stroke ----------
  '--dsw-alias-border-l1': both('rgba(217, 255, 226, 0.10)'),
  '--dsw-alias-border-l2': both('rgba(217, 255, 226, 0.16)'),
  '--dsw-alias-border-l2-darkmode-thin': both('rgba(217, 255, 226, 0.12)'),
  '--dsw-alias-border-l3': both('rgba(217, 255, 226, 0.24)'),
  '--dsw-alias-border-l4': both('rgba(217, 255, 226, 0.34)'),
  '--dsw-alias-border-inverted': both('rgba(217, 255, 226, 0.07)'),
  '--dsw-alias-border-inverted2': both('rgba(217, 255, 226, 0.10)'),

  // ---------- Ink: neutral text, mint reserved for icons ----------
  '--dsw-alias-label-primary': both('#ededed'),
  '--dsw-alias-label-secondary': both('#a6a6a6'),
  '--dsw-alias-label-tertiary': both('#7a7a7a'),
  '--dsw-alias-label-caption': both('#5c5c5c'),
  '--dsw-alias-label-dimmed': both('#3a3a3a'),
  '--dsw-alias-label-primary-bluish': both('#ededed'),
  '--dsw-alias-label-primary-dimmed': both('#d6d6d6'),
  '--dsw-alias-label-primary-inverted': both('#080808'),
  '--dsw-alias-label-primary-foreground': both('#080808'),
  '--dsw-alias-label-shimmer': both('rgba(237, 237, 237, 0.30)'),
  '--dsw-alias-label-deep-diving': both('#c6ffd5'),
  '--dsw-alias-label-deep-diving-shimmer': both('#d9ffe2'),
  '--dsw-alias-menu-icon': both('#c6ffd5'),
  '--dsw-alias-link': both('#c6ffd5'),

  // ---------- Brand ----------
  '--dsw-alias-brand-primary': both('#ededed'),
  '--dsw-alias-brand-text': both('#ededed'),
  '--dsw-alias-brand-primary-invert': both('#080808'),
  '--dsw-alias-brand-primary-new-colorprimary-new-color': both('#c6ffd5'),

  // ---------- Semantic states ----------
  '--dsw-alias-state-business-primary': both('#c6ffd5'),
  '--dsw-alias-state-business-tertiary': both('rgba(198, 255, 213, 0.10)'),
  '--dsw-alias-state-success-primary': both('#4ed17e'),
  '--dsw-alias-state-success-secondary': both('#7be39f'),
  '--dsw-alias-state-success-tertiary': both('rgba(78, 209, 126, 0.12)'),
  '--dsw-alias-state-warn-primary': both('#f7ad31'),
  '--dsw-alias-state-warn-secondary': both('#f7ad31'),
  '--dsw-alias-state-warn-label': both('#f7ad31'),
  '--dsw-alias-state-warn-tertiary': both('rgba(247, 173, 49, 0.12)'),
  '--dsw-alias-state-error-primary': both('#f25a5a'),
  '--dsw-alias-state-error-secondary': both('#f25a5a'),
  '--dsw-alias-state-idle-primary': both('#5a5a5a'),

  // ---------- Buttons ----------
  '--dsw-alias-button-primary-fill': both('#c6ffd5'),
  '--dsw-alias-button-primary-hover': both('#d9ffe2'),
  '--dsw-alias-button-primary-dimmed': both('rgba(198, 255, 213, 0.12)'),
  '--dsw-alias-button-info-fill': both('#c6ffd5'),
  '--dsw-alias-button-info-hover': both('#d9ffe2'),
  '--dsw-alias-button-elevated-fill': both('#0e0e0e'),
  '--dsw-alias-button-floating-fill': both('#0c0c0c'),
  '--dsw-alias-button-floating-hover': both('#141414'),
  '--dsw-alias-button-contrast-fill': both('#ededed'),
  '--dsw-alias-button-ghost-active-fill': both('rgba(217, 255, 226, 0.08)'),
  '--dsw-alias-button-ghost-active-hover': both('rgba(217, 255, 226, 0.12)'),
  '--dsw-alias-button-ghost-active-border': both('rgba(217, 255, 226, 0.28)'),
  '--dsw-alias-button-tool-bar-fill': both('rgba(217, 255, 226, 0.08)'),
  '--dsw-alias-button-tool-bar-hover': both('rgba(217, 255, 226, 0.14)'),
  '--dsw-alias-button-tool-bar-fill-invisible': both('rgba(4, 4, 5, 0.42)'),

  // ---------- Interaction fills ----------
  '--dsw-alias-interactive-bg-hover': both('rgba(217, 255, 226, 0.06)'),
  '--dsw-alias-interactive-bg-hover-accent': both('rgba(198, 255, 213, 0.12)'),
  '--dsw-alias-interactive-bg-active': both('rgba(217, 255, 226, 0.10)'),
  '--dsw-alias-interactive-bg-hover-danger': both('rgba(242, 90, 90, 0.14)'),
  '--dsw-alias-interactive-bg-hover-solid': both('rgba(217, 255, 226, 0.08)'),

  // ---------- Markdown / code ----------
  '--dsw-alias-markdown-code-block': both('#070707'),
  '--dsw-alias-markdown-code-block-banner': both('#0a0a0a'),
  '--dsw-alias-markdown-inline-code': both('#101010'),
  '--dsw-alias-markdown-citation': both('#0a0a0a'),
  '--dsw-alias-markdown-tag': both('#0c0c0c'),
  '--dsw-alias-markdown-placeholder': both('#080808'),
  '--dsw-alias-markdown-code-segment-selected': both('#111111'),
  '--dsw-alias-markdown-code-segment-unselected': both('#080808'),

  // ---------- Scrollbars ----------
  '--dsw-alias-scrollbar-bg-l1': both('rgba(217, 255, 226, 0.18)'),
  '--dsw-alias-scrollbar-bg-l2': both('rgba(217, 255, 226, 0.26)'),
  '--dsw-alias-scrollbar-hover-l1': both('rgba(217, 255, 226, 0.32)'),
  '--dsw-alias-scrollbar-hover-l2': both('rgba(217, 255, 226, 0.40)'),

  // ---------- Specific surfaces ----------
  // Solid black here on purpose: the Electron Windows caption bar samples this
  // token for its own fill, so the native strip stays flush with the canvas.
  '--dsw-specific-sidebar-fill': both('#040405'),
  '--dsw-specific-sidebar-nav-item-active': both('rgba(198, 255, 213, 0.08)'),
  '--dsw-specific-sidebar-nav-item-hover': both('rgba(217, 255, 226, 0.04)'),
  '--dsw-specific-sidebar-nav-item-active-accent': both('#c6ffd5'),
  '--dsw-specific-input-major': both('rgba(8, 8, 8, 0.62)'),
  '--dsw-specific-login-input': both('rgba(8, 8, 8, 0.62)'),
  '--dsw-specific-menu': both('#0a0a0a'),
  '--dsw-specific-selector': both('rgba(217, 255, 226, 0.06)'),
  '--dsw-specific-bubble': both('rgba(255, 255, 255, 0.045)'),
  '--dsw-specific-bubble-highlight': both('rgba(198, 255, 213, 0.08)'),
  '--dsw-specific-tip': both('rgba(255, 255, 255, 0.04)'),
  '--dsw-menu-surface-fill': both('#0a0a0a'),
  '--dsw-alias-menu-group-header-fill': both('#0d0d0d'),
  '--dsw-alias-toast-bg': both('#0d0d0d'),
  '--dsw-alias-toast-label': both('#ededed'),
  '--dsw-alias-tooltip-bg': both('#0c0c0c'),
  '--dsw-alias-tooltip-key-bg': both('rgba(217, 255, 226, 0.10)'),
  '--dsw-alias-switch-thumb': both('#c6ffd5'),
  '--dsw-alias-turn-trigger-bg': both('rgba(217, 255, 226, 0.05)'),
  '--dsw-alias-turn-trigger-bg-hover': both('rgba(217, 255, 226, 0.09)'),

  // ---------- Depth ----------
  '--dsw-shadow-lv1': both('0 1px 2px rgba(0, 0, 0, 0.60)'),
  '--dsw-shadow-lv1-blur': both('0 2px 8px rgba(0, 0, 0, 0.50)'),
  '--dsw-shadow-lv2': both('0 4px 12px rgba(0, 0, 0, 0.55)'),
  '--dsw-shadow-lv3': both('0 8px 24px rgba(0, 0, 0, 0.65)'),
  '--dsw-elevation-stroke-color': both('rgba(217, 255, 226, 0.14)'),
  '--dsw-menu-backdrop-filter': both('blur(18px) saturate(120%)'),

  // ---------- Static accents consumed by shared components ----------
  '--dsw-static-deepseek-400': both('#c6ffd5'),
  '--dsw-static-deepseek-450': both('#b4f2c6'),
  '--dsw-static-deepseek-500': both('#8fd3a5'),
  '--dsw-static-deepseek-600': both('#5e9e74'),
  '--dsw-static-deepseek-800': both('#173322'),
  '--dsw-static-deepseek-900': both('#0e2116'),
};

/**
 * Force the built-in dark palette. Matrix is a dark theme: a light preference
 * would leave the bright-specific component rules fighting this token layer,
 * so the preference is pinned while the plugin is applied.
 */
function pinDark(ctx) {
  let pinning = false;
  const pin = () => {
    if (pinning) return;
    try {
      const snapshot = ctx.theme.getTheme();
      if (snapshot.preference === 'dark' && snapshot.active.colorScheme === 'dark') return;
      pinning = true;
      ctx.theme.setTheme('dark');
    } catch {
      // A host without the modern theme service keeps its own palette; the
      // stylesheet still supplies the canvas and the glass.
    } finally {
      pinning = false;
    }
  };
  pin();
  return ctx.on('theme/change', pin);
}

/** Required client services. */
const inject = ['theme'];

/**
 * Client plugin body.
 * @param ctx - client cordis context.
 */
function apply(ctx) {
  ctx.effect(() => {
    const root = document.documentElement;
    root.setAttribute(ROOT_ATTRIBUTE, '');

    const style = document.createElement('style');
    style.dataset.plugin = 'dsh-matrix-theme';
    style.dataset.pluginCss = 'dsh-matrix-theme/matrix.css';
    style.textContent = CSS;
    document.head.append(style);

    let disposeTokens = () => {};
    try {
      disposeTokens = ctx.theme.overrideTokens(OVERRIDE_SOURCE, TOKENS);
    } catch (error) {
      // An older theme service may reject a layer; keep the stylesheet alive.
      console.warn('[matrix] token layer rejected:', error);
    }

    const offTheme = pinDark(ctx);

    return () => {
      offTheme();
      disposeTokens();
      style.remove();
      root.removeAttribute(ROOT_ATTRIBUTE);
    };
  }, 'dsh-matrix: theme layer');
}

// The bundle wrapper installed by scripts/build.mjs exposes `inject`, `apply`
// and the token table on module.exports.
