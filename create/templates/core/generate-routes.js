const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');

module.exports = (options) => {
  const { bundler, template } = options;

  let routes;
  // prettier-ignore
  if (template === 'blank') {
    if (bundler === 'vite') {
      routes = indent(0, `
        import HomePage from '../pages/home.t4';

        var routes = [
          {
            path: '/',
            component: HomePage,
          },
        ];
      `);
    } else {
      routes = indent(0, `
        var routes = [
          {
            path: '/',
            url: './index.html',
          },
        ];
      `);
    }
  } else if (bundler === 'vite') {
    routes = indent(0, `
      import HomePage from '../pages/home.t4';
      import AboutPage from '../pages/about.t4';
      import FormPage from '../pages/form.t4';
      ${templateIf(template === 'tabs', () => `
      import CatalogPage from '../pages/catalog.t4';
      import ProductPage from '../pages/product.t4';
      import SettingsPage from '../pages/settings.t4';
      `)}
      ${templateIf(template === 'split-view', () => `
      import LeftPage1 from '../pages/left-page-1.t4';
      import LeftPage2 from '../pages/left-page-2.t4';
      `)}
      ${templateIf(template !== 'blank', () => `
      import DynamicRoutePage from '../pages/dynamic-route.t4';
      import RequestAndLoad from '../pages/request-and-load.t4';
      import NotFoundPage from '../pages/404.t4';
      `)}

      var routes = [
        {
          path: '/',
          component: HomePage,
        },
        {
          path: '/about/',
          component: AboutPage,
        },
        {
          path: '/form/',
          component: FormPage,
        },
        ${templateIf(template === 'tabs', () => `
        {
          path: '/catalog/',
          component: CatalogPage,
        },
        {
          path: '/product/:id/',
          component: ProductPage,
        },
        {
          path: '/settings/',
          component: SettingsPage,
        },
        `)}
        ${templateIf(template === 'split-view', () => `
        {
          path: '/left-page-1/',
          component: LeftPage1,
        },
        {
          path: '/left-page-2/',
          component: LeftPage2,
        },
        `)}
        {
          path: '/dynamic-route/blog/:blogId/post/:postId/',
          component: DynamicRoutePage,
        },
        {
          path: '/request-and-load/user/:userId/',
          async: function ({ router, to, resolve }) {
            // App instance
            var app = router.app;

            // Show Preloader
            app.preloader.show();

            // User ID from request
            var userId = to.params.userId;

            // Simulate Ajax Request
            setTimeout(function () {
              // We got user data from request
              var user = {
                firstName: 'Vladimir',
                lastName: 'Kharlampidi',
                about: 'Hello, i am creator of Techno4! Hope you like it!',
                links: [
                  {
                    title: 'Techno4 Website',
                    url: 'http://techno4.io',
                  },
                  {
                    title: 'Techno4 Forum',
                    url: 'http://forum.techno4.io',
                  },
                ]
              };
              // Hide Preloader
              app.preloader.hide();

              // Resolve route to load page
              resolve(
                {
                  component: RequestAndLoad,
                },
                {
                  props: {
                    user: user,
                  }
                }
              );
            }, 1000);
          },
        },
        {
          path: '(.*)',
          component: NotFoundPage,
        },
      ];
    `);
  } else {
    routes = indent(0, `
      var routes = [
        {
          path: '/',
          url: './index.html',
        },
        {
          path: '/about/',
          url: './pages/about.html',
        },
        {
          path: '/form/',
          url: './pages/form.html',
        },
        ${templateIf(template === 'tabs', () => `
        {
          path: '/catalog/',
          componentUrl: './pages/catalog.html',
        },
        {
          path: '/product/:id/',
          componentUrl: './pages/product.html',
        },
        {
          path: '/settings/',
          url: './pages/settings.html',
        },
        `)}
        ${templateIf(template === 'split-view', () => `
        {
          path: '/left-page-1/',
          url: './pages/left-page-1.html',
        },
        {
          path: '/left-page-2/',
          url: './pages/left-page-2.html',
        },
        `)}
        {
          path: '/dynamic-route/blog/:blogId/post/:postId/',
          componentUrl: './pages/dynamic-route.html',
        },
        {
          path: '/request-and-load/user/:userId/',
          async: function ({ router, to, resolve }) {
            // App instance
            var app = router.app;

            // Show Preloader
            app.preloader.show();

            // User ID from request
            var userId = to.params.userId;

            // Simulate Ajax Request
            setTimeout(function () {
              // We got user data from request
              var user = {
                firstName: 'Vladimir',
                lastName: 'Kharlampidi',
                about: 'Hello, i am creator of Techno4! Hope you like it!',
                links: [
                  {
                    title: 'Techno4 Website',
                    url: 'http://techno4.io',
                  },
                  {
                    title: 'Techno4 Forum',
                    url: 'http://forum.techno4.io',
                  },
                ]
              };
              // Hide Preloader
              app.preloader.hide();

              // Resolve route to load page
              resolve(
                {
                  componentUrl: './pages/request-and-load.html',
                },
                {
                  props: {
                    user: user,
                  }
                }
              );
            }, 1000);
          },
        },
        // Default route (404 page). MUST BE THE LAST
        {
          path: '(.*)',
          url: './pages/404.html',
        },
      ];
    `);
  }

  if (bundler) {
    routes += '\nexport default routes;';
  }

  return routes;
};
