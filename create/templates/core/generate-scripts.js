const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');
const appParameters = require('../app-parameters');
const stylesExtension = require('../../utils/styles-extension');

module.exports = (options) => {
  const { bundler, type, cssPreProcessor, theming, customBuild, template } = options;

  let scripts = '';

  if (bundler) {
    // prettier-ignore
    scripts += indent(0, `
      import $ from 'dom64';
      ${templateIf(type.indexOf('cordova') >= 0 || type.indexOf('capacitor') >= 0, () => `
      ${templateIf(customBuild, () => `
      import Techno4, { getDevice } from './techno4-custom.js';
      `, () => `
      import Techno4, { getDevice } from 'techno4/bundle';
      `)}
      `, () => `
      ${templateIf(customBuild, () => `
      import Techno4 from './techno4-custom.js';
      `, () => `
      import Techno4 from 'techno4/bundle';
      `)}
      `)}

      // Import T4 Styles
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
      ${templateIf(type.indexOf('cordova') >= 0, () => `
      // Import Cordova APIs
      import cordovaApp from './cordova-app.js';
      `)}
      ${templateIf(type.indexOf('capacitor') >= 0, () => `
      // Import Capacitor APIs
      import capacitorApp from './capacitor-app.js';
      `)}
      // Import Routes
      import routes from './routes.js';
      // Import Store
      import store from './store.js';

      // Import main app component
      import App from '../app.t4';
    `);
  } else {
    // prettier-ignore
    scripts += indent(0, `
      var $ = Dom64;
    `);
  }

  // prettier-ignore
  scripts += indent(0, `
    ${templateIf(type.indexOf('cordova') >= 0 || type.indexOf('capacitor') >= 0, () => `
    ${templateIf(bundler, () => `
    var device = getDevice();
    `, () => `
    var device = Techno4.getDevice();
    `)}
    `)}
    var app = new Techno4({
      ${indent(6, appParameters(options)).trim()}
    });
    ${templateIf(!bundler && template !== 'blank', () => `
    // Login Screen Demo
    $('#my-login-screen .login-button').on('click', function () {
      var username = $('#my-login-screen [name="username"]').val();
      var password = $('#my-login-screen [name="password"]').val();

      // Close login screen
      app.loginScreen.close('#my-login-screen');

      // Alert username and password
      app.dialog.alert('Username: ' + username + '<br/>Password: ' + password);
    });
    `)}
  `);

  return scripts.trim();
};
