const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');
const stylesExtension = require('../../utils/styles-extension');

module.exports = (options) => {
  const {
    cssPreProcessor,
    theming,
    customBuild,
  } = options;

  let scripts = '';

  scripts += indent(0, `
    // Import Techno4
    import Techno4 from '${customBuild ? './techno4-custom.js' : 'techno4/lite-bundle'}';

    // Import Techno4-Svelte Plugin
    import Techno4Svelte from 'techno4-svelte';

    // Import Techno4 Styles
    ${templateIf(customBuild, () => `
    import '../css/techno4-custom.less';
    `, () => `
    import 'techno4/css/bundle';
    `)}

    // Import Icons and App Custom Styles
    ${templateIf(theming.iconFonts, () => `
    import '../css/icons.css';
    `)}
    import '../css/app.${stylesExtension(cssPreProcessor)}';

    // Import App Component
    import App from '../components/app.svelte';

    // Init T4 Svelte Plugin
    Techno4.use(Techno4Svelte)

    // Mount Svelte App
    const app = new App({
      target: document.getElementById('app'),
    });
  `);

  return scripts.trim();
};
