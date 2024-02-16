const templateIf = require('./template-if');
const generateNpmScripts = require('./generate-npm-scripts');

module.exports = (options) => {
  const { framework, bundler, type, name, cordova, capacitor } = options;

  const npmScripts = generateNpmScripts(options).map((s) => {
    return `* ${s.icon} \`${s.name}\` - ${s.description}`;
  });

  // prettier-ignore
  return `

# ${name}

## Techno4 CLI Опції

Techno4 застосунок згенеровано з наступними опціями:

\`\`\`
${JSON.stringify(options, null, 2)}
\`\`\`

## Встановіть залежності
\`\`\`
npm install
\`\`\`

## Доступні наступні NPM скрипти

${npmScripts.join('\n')}

${templateIf(bundler, () => `
## Vite

Проєкт використовує [Vite](https://vitejs.dev) генератор пакунків. Ви маєте працювати лише з файлами з каталогу \`/src\`. Конфігураційний файл Vite знайдете тут: \`vite.config.js\`.
`)}

${templateIf(type.indexOf('pwa') >= 0, () => `
## PWA

This is a PWA. Don't forget to check what is inside of your \`service-worker.js\`. It is also recommended that you disable service worker (or enable "Update on reload") in browser dev tools during development.
`)}

${templateIf(type.indexOf('cordova') >= 0, () => `
## Cordova

Cordova project located in \`${cordova.folder}\` folder. You shouldn't modify content of \`${cordova.folder}/www\` folder. Its content will be correctly generated when you call \`npm run cordova-build-prod\`.
`)}

${templateIf(type.indexOf('capacitor') >= 0, () => `
## Capacitor

This project created with Capacitor support. And first thing required before start is to add capacitor platforms, run in terminal:

\`\`\`
${capacitor.platforms.map((platform) => `npx cap add ${platform}`).join(' && ')}
\`\`\`

Check out [official Capacitor documentation](https://capacitorjs.com) for more examples and usage examples.
`)}

${templateIf(type.indexOf('cordova') >= 0 && cordova.platforms.indexOf('electron') >= 0, () => `
## Cordova Electron

There is also cordova Electron platform installed. To learn more about it and Electron check this guides:

* [Cordova Electron Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/electron/index.html)
* [Official Electron Documentation](https://electronjs.org/docs)
`)}

## Assets

Assets (icons, splash screens) source images located in \`assets-src\` folder. To generate your own icons and splash screen images, you will need to replace all assets in this directory with your own images (pay attention to image size and format), and run the following command in the project directory:

\`\`\`
techno4 assets
\`\`\`

Or launch UI where you will be able to change icons and splash screens:

\`\`\`
techno4 assets --ui
\`\`\`

${templateIf(type.indexOf('capacitor') >= 0, () => `
## Capacitor Assets

Capacitor assets are located in \`resources\` folder which is intended to be used with \`cordova-res\` tool. To generate  mobile apps assets run in terminal:
\`\`\`
npx cordova-res
\`\`\`

Check out [official cordova-res documentation](https://github.com/ionic-team/cordova-res) for more usage examples.
`)}

## Documentation & Resources

* [Techno4 Core Documentation](https://techno4.online/надбання/фреймворк)
${templateIf(framework === 'vue', () => `
* [Techno4 Vue Documentation](https://techno4.online/надбання/фреймворк)
`)}
${templateIf(framework === 'react', () => `
* [Techno4 React Documentation](https://techno4.online/надбання/фреймворк)
`)}
${templateIf(framework === 'svelte', () => `
* [Techno4 Svelte Documentation](https://techno4.online/надбання/фреймворк)
`)}
* [Techno4 Icons Reference](https://techno4.online/надбання/фреймворк)

  `.trim().replace(/[\n]{3,}/, '\n');
};
