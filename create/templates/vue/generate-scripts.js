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
    // Import Vue
    import { createApp } from 'vue';

    // Import Techno4
    import Techno4 from '${customBuild ? './techno4-custom.js' : 'techno4/lite-bundle'}';

    // Import Techno4-Vue Plugin
    import Techno4Vue, { registerComponents } from 'techno4-vue/bundle';

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
    import App from '../components/app.vue';

    // Init Techno4-Vue Plugin
    Techno4.use(Techno4Vue);

    // Init App
    const app = createApp(App);

    // Register Techno4 Vue components
    registerComponents(app);

    // Mount the app
    app.mount('#app');
  `);

  return scripts.trim();
};
