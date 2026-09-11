const generateNpmScripts = require('./generate-npm-scripts');

module.exports = function generatePackageJson(options) {
  const { type, name, framework, bundler, cssPreProcessor, cordova, capacitor } = options;

  // Dependencies
  const dependencies = [
    'techno4',
    'dom64',
    'swiper@8',
    'skeleton-elements',
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

  if (framework === 'core' && !bundler) {
    devDependencies.push('cpy-cli');
  }

  // Scripts
  const scripts = {};
  generateNpmScripts(options).forEach((s) => {
    scripts[s.name] = s.script;
  });

  const postInstall = [];

  if (framework === 'core' && !bundler) {
    postInstall.push(
      ...[
        `cpy --flat ./node_modules/techno4/dist/*.js ./www/techno4`,
        `cpy --flat ./node_modules/techno4/dist/*.css ./www/techno4`,
        `cpy --flat ./node_modules/techno4/dist/*.map ./www/techno4`,
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
  ${bundler === 'vite' ? '"type": "module",' : ''}
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
