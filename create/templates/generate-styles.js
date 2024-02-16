const indent = require('../utils/indent');
const { colorThemeCSSProperties } = require('../utils/colors');

module.exports = (options) => {
  const {
    template,
    type,
    theming,
  } = options;
  const {
    customColor,
    color,
    fillBars,
  } = theming;

  let styles = '';

  if (type.indexOf('cordova') >= 0) {
    styles += indent(0, `
      /* iOS Cordova Tweak */
      .device-cordova.device-ios {
        height: 100vh;
      }
    `);
  }
  let themeRgb = [0, 122, 255];
  if (customColor && color) {
    const customProps = colorThemeCSSProperties(`${color}`);
    themeRgb = customProps['--t4-theme-color-rgb'].split(',').map((n) => n.trim());
    styles += indent(0, `
      /* Custom color theme properties */
      :root {
        ${Object.keys(customProps).map((prop) => `${prop}: ${customProps[prop]};`).join('\n        ')}
      }
    `);
  }
  if (fillBars) {
    styles += indent(0, `
      /* Invert navigation bars to fill style */
      :root,
      :root.dark,
      :root .dark {
        --t4-bars-bg-color: var(--t4-theme-color);
        --t4-bars-bg-color-rgb: var(--t4-theme-color-rgb);
        --t4-bars-translucent-opacity: 0.9;
        --t4-bars-text-color: #fff;
        --t4-bars-link-color: #fff;
        --t4-navbar-subtitle-text-color: rgba(255,255,255,0.85);
        --t4-bars-border-color: transparent;
        --t4-tabbar-link-active-color: #fff;
        --t4-tabbar-link-inactive-color: rgba(255,255,255,0.54);
        --t4-sheet-border-color: transparent;
        --t4-tabbar-link-active-border-color: #fff;
      }
      .appbar,
      .navbar,
      .toolbar,
      .subnavbar,
      .calendar-header,
      .calendar-footer {
        --t4-touch-ripple-color: var(--t4-touch-ripple-white);
        --t4-link-highlight-color: var(--t4-link-highlight-white);
        --t4-link-touch-ripple-color: var(--t4-touch-ripple-white);
        --t4-button-text-color: #fff;
        --t4-button-pressed-bg-color: rgba(255,255,255,0.1);
      }
      .navbar-large-transparent,
      .navbar-large.navbar-transparent {
        --t4-navbar-large-title-text-color: #000;

        --r: ${themeRgb[0]};
        --g: ${themeRgb[1]};
        --b: ${themeRgb[2]};
        --progress: var(--t4-navbar-large-collapse-progress);
        --t4-bars-link-color: rgb(
          calc(var(--r) + (255 - var(--r)) * var(--progress)),
          calc(var(--g) + (255 - var(--g)) * var(--progress)),
          calc(var(--b) + (255 - var(--b)) * var(--progress))
        );
      }
      .dark .navbar-large-transparent,
      .dark .navbar-large.navbar-transparent {
        --t4-navbar-large-title-text-color: #fff;
      }
    `);
  }

  if (template === 'split-view') {
    styles += indent(0, `
      /* Left Panel right border when it is visible by breakpoint */
      .panel-left.panel-in-breakpoint:before {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 1px;
        background: rgba(0,0,0,0.1);
        content: '';
        z-index: 6000;
      }

      /* Hide navbar link which opens left panel when it is visible by breakpoint */
      .panel-left.panel-in-breakpoint ~ .view .navbar .panel-open[data-panel="left"] {
        display: none;
      }

      /*
        Extra borders for main view and left panel for iOS theme when it behaves as panel (before breakpoint size)
      */
      .ios .panel-left:not(.panel-in-breakpoint).panel-in ~ .view-main:before,
      .ios .panel-left:not(.panel-in-breakpoint).panel-closing ~ .view-main:before {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 1px;
        background: rgba(0,0,0,0.1);
        content: '';
        z-index: 6000;
      }
    `);
  } else {
    styles += indent(0, `
      /* Your app custom styles here */
    `);
  }

  return styles.trim();
};
