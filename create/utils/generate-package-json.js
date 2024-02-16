const generateNpmScripts = require('./generate-npm-scripts');

module.exports = function generatePackageJson(options) {
  const { type, name, framework, bundler, cssPreProcessor, cordova, theming, capacitor } = options;

  // Dependencies
  const dependencies = [
    'techno4',
    'dom64',
    'swiper@8',
    'skeleton-elements',
    ...(theming.iconFonts ? ['framework7-icons', 'material-icons'] : []),
    ...(framework === 'vue' ? ['techno4-vue', 'vue@3'] : []),
    ...(framework === 'react' ? ['techno4-react', 'react', 'react-dom', 'prop-types'] : []),
    ...(framework === 'svelte' ? ['techno4-svelte', 'svelte'] : []),
    ...(type.indexOf('capacitor') >= 0
      ? [
          '@capacitor/core',
          '@capacitor/app',
          '@capacitor/splash-screen',
          '@capacitor/keyboard',
          '@capacitor/status-bar',
          '@capacitor/browser',
          ...(capacitor.platforms || []).map((platform) => `@capacitor/${platform}`),
        ]
      : []),
  ];

  const devDependencies = [];
  if (bundler === 'vite') {
    devDependencies.push(
      ...[
        'vite',
        ...(type.indexOf('cordova') >= 0 && cordova.platforms.indexOf('electron') >= 0
          ? ['concurrently']
          : []),
        ...(type.indexOf('cordova') >= 0 ? ['vite-plugin-html', 'rollup'] : []),
        ...(type.indexOf('capacitor') >= 0 ? ['@capacitor/cli', 'cordova-res'] : []),
        'cross-env',
        'postcss-preset-env',
        ...(cssPreProcessor === 'stylus' ? ['stylus'] : []),
        ...(cssPreProcessor === 'less' ? ['less'] : []),
        ...(cssPreProcessor === 'scss' ? ['sass'] : []),
        ...(type.indexOf('pwa') >= 0 ? ['workbox-cli'] : []),
        ...(framework === 'core' ? ['rollup-plugin-techno4'] : []),
        ...(framework === 'react' ? ['@vitejs/plugin-react-refresh'] : []),
        ...(framework === 'svelte' ? ['@sveltejs/vite-plugin-svelte@1'] : []),
        ...(framework === 'vue' ? ['@vitejs/plugin-vue', '@vue/compiler-sfc'] : []),
      ],
    );
  } else {
    devDependencies.push('http-server');
    if (type.indexOf('capacitor') >= 0) {
      devDependencies.push('@capacitor/cli');
      devDependencies.push('cordova-res');
    }
    if (type.indexOf('cordova') >= 0 || type.indexOf('capacitor') >= 0) {
      devDependencies.push(...['cpy@8', 'rimraf']);
    }
  }

  if (theming.iconFonts || (framework === 'core' && !bundler)) {
    devDependencies.push('cpy-cli');
  }

  // Scripts
  const scripts = {};
  generateNpmScripts(options).forEach((s) => {
    scripts[s.name] = s.script;
  });

  const postInstall = [];

  if (theming.iconFonts) {
    postInstall.push(
      ...[
        `cpy --flat ./node_modules/framework7-icons/fonts/*.* ./${bundler ? 'src' : 'www'}/fonts/`,
        `cpy --flat ./node_modules/material-icons/iconfont/*.* ./${bundler ? 'src' : 'www'}/fonts/`,
      ],
    );
  }
  if (framework === 'core' && !bundler) {
    postInstall.push(
      ...[
        `cpy --flat ./node_modules/techno4/*.js ./www/techno4`,
        `cpy --flat ./node_modules/techno4/*.css ./www/techno4`,
        `cpy --flat ./node_modules/techno4/*.map ./www/techno4`,
      ],
    );
  }
  if (postInstall.length) {
    scripts.postinstall = postInstall.join(' && ');
  }

  // Content
  const content = `
{
  "name": "${name
    .toLowerCase()
    .replace(/[ ]{2,}/, ' ')
    .replace(/ /g, '-')}",
  "private": true,
  "version": "1.0.0",
  "description": "${name}",
  "repository" : "",
  "license" : "UNLICENSED",
  "scripts" : ${JSON.stringify(scripts)},
  "browserslist": [
    "IOS >= 13",
    "Safari >= 13",
    "last 5 Chrome versions",
    "last 5 Firefox versions",
    "Samsung >= 12"
  ],
  "dependencies": {},
  "devDependencies": {}
}
`.trim();

  return {
    content,
    dependencies,
    devDependencies,
  };
};
