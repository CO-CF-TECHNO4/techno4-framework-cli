const indent = require('../../utils/indent');
const templateIf = require('../../utils/template-if');
const appParameters = require('../app-parameters');

module.exports = (options) => {
  const {
    template,
    type,
    theming,
    customBuild,
  } = options;

  // Panels
  const leftPanelPlain = indent(6, `
    <!-- Left panel with cover effect-->
    <t4-panel left cover dark>
      <t4-view>
        <t4-page>
          <t4-navbar title="Left Panel"></t4-navbar>
          <t4-block>Left panel content goes here</t4-block>
        </t4-page>
      </t4-view>
    </t4-panel>
  `);

  const leftPanelWithView = indent(6, `
    <!-- Left panel with cover effect when hidden -->
    <t4-panel left cover dark :visible-breakpoint="960">
      <t4-view>
        <t4-page>
          <t4-navbar title="Left Panel"></t4-navbar>
          <t4-block-title>Left View Navigation</t4-block-title>
          <t4-list>
            <t4-list-item link="/left-page-1/" title="Left Page 1"></t4-list-item>
            <t4-list-item link="/left-page-2/" title="Left Page 2"></t4-list-item>
          </t4-list>
          <t4-block-title>Control Main View</t4-block-title>
          <t4-list>
            <t4-list-item link="/about/" view=".view-main" panel-close title="About"></t4-list-item>
            <t4-list-item link="/form/" view=".view-main" panel-close title="Form"></t4-list-item>
            <t4-list-item link="#" view=".view-main" back panel-close title="Back in history"></t4-list-item>
          </t4-list>
        </t4-page>
      </t4-view>
    </t4-panel>
  `);
  const leftPanel = template === 'split-view' ? leftPanelWithView : leftPanelPlain;
  const rightPanel = indent(6, `
    <!-- Right panel with reveal effect-->
    <t4-panel right reveal dark>
      <t4-view>
        <t4-page>
          <t4-navbar title="Right Panel"></t4-navbar>
          <t4-block>Right panel content goes here</t4-block>
        </t4-page>
      </t4-view>
    </t4-panel>
  `);

  // Views
  let views = '';
  if (template === 'single-view' || template === 'split-view' || template === 'blank') {
    views = indent(6, `
      <!-- Your main view, should have "view-main" class -->
      <t4-view main class="safe-areas" url="/"></t4-view>
    `);
  }
  if (template === 'tabs') {
    views = indent(6, `
      <!-- Views/Tabs container -->
      <t4-views tabs class="safe-areas">
        <!-- Tabbar for switching views-tabs -->
        <t4-toolbar tabbar labels bottom>
          <t4-link tab-link="#view-home" tab-link-active icon-ios="t4:house_fill" icon-aurora="t4:house_fill" icon-md="material:home" text="Home"></t4-link>
          <t4-link tab-link="#view-catalog" icon-ios="t4:square_list_fill" icon-aurora="t4:square_list_fill" icon-md="material:view_list" text="Catalog"></t4-link>
          <t4-link tab-link="#view-settings" icon-ios="t4:gear" icon-aurora="t4:gear" icon-md="material:settings" text="Settings"></t4-link>
        </t4-toolbar>

        <!-- Your main view/tab, should have "view-main" class. It also has "tab-active" class -->
        <t4-view id="view-home" main tab tab-active url="/"></t4-view>

        <!-- Catalog View -->
        <t4-view id="view-catalog" name="catalog" tab url="/catalog/"></t4-view>

        <!-- Settings View -->
        <t4-view id="view-settings" name="settings" tab url="/settings/"></t4-view>

      </t4-views>
    `);
  }


  return indent(0, `
    <template>
      ${template === 'blank' ? `
      <t4-app v-bind="t4params" ${theming.darkTheme ? 'dark' : ''}>
        ${views}
      </t4-app>
      `.trim() : `
      <t4-app v-bind="t4params" ${theming.darkTheme ? 'dark' : ''}>
        ${leftPanel}
        ${rightPanel}
        ${views}

        <!-- Popup -->
        <t4-popup id="my-popup">
          <t4-view>
            <t4-page>
              <t4-navbar title="Popup">
                <t4-nav-right>
                  <t4-link popup-close>Close</t4-link>
                </t4-nav-right>
              </t4-navbar>
              <t4-block>
                <p>Popup content goes here.</p>
              </t4-block>
            </t4-page>
          </t4-view>
        </t4-popup>

        <t4-login-screen id="my-login-screen">
          <t4-view>
            <t4-page login-screen>
              <t4-login-screen-title>Login</t4-login-screen-title>
              <t4-list form>
                <t4-list-input
                  type="text"
                  name="username"
                  placeholder="Your username"
                  v-model:value="username"
                ></t4-list-input>
                <t4-list-input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  v-model:value="password"
                ></t4-list-input>
              </t4-list>
              <t4-list>
                <t4-list-button title="Sign In" @click="alertLoginData"></t4-list-button>
                <t4-block-footer>
                  Some text about login information.<br>Click "Sign In" to close Login Screen
                </t4-block-footer>
              </t4-list>
            </t4-page>
          </t4-view>
        </t4-login-screen>
      </t4-app>
      `.trim()}
    </template>
    <script>
      import { ref, onMounted } from 'vue';
      import { t4, t4ready } from 'techno4-vue';
      ${templateIf(type.indexOf('cordova') >= 0, () => `
      import { getDevice }  from '${customBuild ? '../js/techno4-custom.js' : 'techno4/lite-bundle'}';
      import cordovaApp from '../js/cordova-app.js';
      `)}
      ${templateIf(type.indexOf('capacitor') >= 0, () => `
      import { getDevice }  from '${customBuild ? '../js/techno4-custom.js' : 'techno4/lite-bundle'}';
      import capacitorApp from '../js/capacitor-app.js';
      `)}
      import routes from '../js/routes.js';
      import store from '../js/store';

      export default {
        setup() {
          ${templateIf(type.indexOf('cordova') >= 0 || type.indexOf('capacitor') >= 0, () => `
          const device = getDevice();
          `)}
          // Techno4 Parameters
          const t4params = {
            ${indent(12, appParameters(options)).trim()}
          };
          ${templateIf(template !== 'blank', () => `
          // Login screen data
          const username = ref('');
          const password = ref('');

          const alertLoginData = () => {
            t4.dialog.alert('Username: ' + username.value + '<br>Password: ' + password.value, () => {
              t4.loginScreen.close();
            });
          }
          `)}
          onMounted(() => {
            t4ready(() => {
              ${templateIf(type.indexOf('cordova') >= 0, () => `
              // Init cordova APIs (see cordova-app.js)
              if (device.cordova) {
                cordovaApp.init(t4);
              }
              `)}
              ${templateIf(type.indexOf('capacitor') >= 0, () => `
              // Init capacitor APIs (see capacitor-app.js)
              if (device.capacitor) {
                capacitorApp.init(t4);
              }
              `)}
              // Call T4 APIs here
            });
          });

          return {
            t4params,
            ${templateIf(template !== 'blank', () => `
            username,
            password,
            alertLoginData
            `)}
          }
        }
      }
    </script>
  `).trim();
};
