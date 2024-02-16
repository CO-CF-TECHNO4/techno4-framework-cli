const indent = require('../../utils/indent');

module.exports = (options) => {
  const {
    name,
    template,
  } = options;

  let description = '';
  if (template === 'single-view' || template === 'blank') {
    description = `
          <p>Here is your blank Techno4 app. Let's see what we have here.</p>
    `;
  }
  if (template === 'split-view') {
    description = `
          <p>This is an example of split view application layout, commonly used on tablets. The main approach of such kind of layout is that you can see different views at the same time.</p>

          <p>Each view may have different layout, different navbar type (dynamic, fixed or static) or without navbar.</p>

          <p>The fun thing is that you can easily control one view from another without any line of JavaScript just using "data-view" attribute on links.</p>
    `;
  }
  if (template === 'tabs') {
    description = `
          <p>This is an example of tabs-layout application. The main point of such tabbed layout is that each tab contains independent view with its own routing and navigation.</p>

          <p>Each tab/view may have different layout, different navbar type (dynamic, fixed or static) or without navbar like this tab.</p>
    `;
  }

  return indent(0, `
    <template>
      <t4-page name="home">
        <!-- Top Navbar -->
        ${template === 'blank' ? `
        <t4-navbar large>
          <t4-nav-title>${name}</t4-nav-title>
          <t4-nav-title-large>${name}</t4-nav-title-large>
        </t4-navbar>
        `.trim() : `
        <t4-navbar large :sliding="false">
          <t4-nav-left>
            <t4-link icon-ios="t4:menu" icon-aurora="t4:menu" icon-md="material:menu" panel-open="left"></t4-link>
          </t4-nav-left>
          <t4-nav-title sliding>${name}</t4-nav-title>
          <t4-nav-right>
            <t4-link icon-ios="t4:menu" icon-aurora="t4:menu" icon-md="material:menu" panel-open="right"></t4-link>
          </t4-nav-right>
          <t4-nav-title-large>${name}</t4-nav-title-large>
        </t4-navbar>
        `.trim()}
        ${template !== 'tabs' ? `
        <!-- Toolbar-->
        <t4-toolbar bottom>
          <t4-link>Left Link</t4-link>
          <t4-link>Right Link</t4-link>
        </t4-toolbar>

        `.trim() : ''}
        <!-- Page content-->
        <t4-block strong>
          ${description.trim()}
        </t4-block>
        ${template !== 'blank' ? `
        <t4-block-title>Navigation</t4-block-title>
        <t4-list>
          <t4-list-item link="/about/" title="About"></t4-list-item>
          <t4-list-item link="/form/" title="Form"></t4-list-item>
        </t4-list>

        <t4-block-title>Modals</t4-block-title>
        <t4-block strong>
          <t4-row>
            <t4-col width="50">
              <t4-button fill raised popup-open="#my-popup">Popup</t4-button>
            </t4-col>
            <t4-col width="50">
              <t4-button fill raised login-screen-open="#my-login-screen">Login Screen</t4-button>
            </t4-col>
          </t4-row>
        </t4-block>

        <t4-block-title>Panels</t4-block-title>
        <t4-block strong>
          <t4-row>
            <t4-col width="50">
              <t4-button fill raised panel-open="left">Left Panel</t4-button>
            </t4-col>
            <t4-col width="50">
              <t4-button fill raised panel-open="right">Right Panel</t4-button>
            </t4-col>
          </t4-row>
        </t4-block>

        <t4-list>
          <t4-list-item
            title="Dynamic (Component) Route"
            link="/dynamic-route/blog/45/post/125/?foo=bar#about"
          ></t4-list-item>
          <t4-list-item
            title="Default Route (404)"
            link="/load-something-that-doesnt-exist/"
          ></t4-list-item>
          <t4-list-item
            title="Request Data & Load"
            link="/request-and-load/user/123456/"
          ></t4-list-item>
        </t4-list>
        `.trim() : ''}
      </t4-page>
    </template>
  `).trim();
};
