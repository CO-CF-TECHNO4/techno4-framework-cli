const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');
const stylesExtension = require('../../utils/styles-extension');

module.exports = (options) => {
  const { cssPreProcessor, theming, customBuild } = options;

  let scripts = '';

  scripts += indent(
    0,
    `
    // Import React and ReactDOM
    import React from 'react';
    import { createRoot } from 'react-dom/client';

    // Import Techno4
    import Techno4 from '${customBuild ? './techno4-custom.js' : 'techno4/lite-bundle'}';

    // Import Techno4-React Plugin
    import Techno4React from 'techno4-react';

    // Import Techno4 Styles
    ${templateIf(
      customBuild,
      () => `
    import '../css/techno4-custom.less';
    `,
      () => `
    import 'techno4/css/bundle';
    `,
    )}

    // Import Icons and App Custom Styles
    ${templateIf(
      theming.iconFonts,
      () => `
    import '../css/icons.css';
    `,
    )}
    import '../css/app.${stylesExtension(cssPreProcessor)}';

    // Import App Component
    import App from '../components/app.jsx';

    // Init T4 React Plugin
    Techno4.use(Techno4React)

    // Mount React App
    const root = createRoot(document.getElementById('app'));
    root.render(React.createElement(App));
  `,
  );

  return scripts.trim();
};
