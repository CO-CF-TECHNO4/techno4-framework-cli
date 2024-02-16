/* eslint no-param-reassign: ["off"] */
const inquirer = require('inquirer');

const questions = [
  {
    type: 'checkbox',
    name: 'type',
    message: 'Techno4 може згенерувати стартовий проєкт у наступних форматах:',
    choices: [
      {
        name: 'Простий вебзастосунок',
        value: 'web',
        checked: true,
      },
      {
        name: 'PWA (Progressive Web App)',
        value: 'pwa',
      },
      {
        name: 'Cordova застосунок (цільові платформи iOS, Android, Electron для MacOS, Linux та Windows.)',
        value: 'cordova',
      },
      {
        name: 'Capacitor застосунок (цільові платформи iOS, Android, Electron для MacOS, Linux та Windows.)',
        value: 'capacitor',
      },
    ],
    validate(input) {
      return new Promise((resolve, reject) => {
        if (!input || !input.length) reject(new Error('Формат застосунку обовʼязковий!'));
        else resolve(true);
      });
    },
  },
  {
    type: 'input',
    name: 'name',
    message: 'Назва застосунку (проєкт):',
    default: 'My App',
    validate(input) {
      return new Promise((resolve, reject) => {
        if (!input) reject(new Error('Назва застосунку обовʼязкова!'));
        else resolve(true);
      });
    },
  },

  // Cordova Questions
  {
    type: 'input',
    name: 'pkg',
    message: 'Ідентифікатор пакунку (Bundle ID):',
    default: 'io.techno4.myapp',
    when: (opts) => opts.type.indexOf('cordova') >= 0 || opts.type.indexOf('capacitor') >= 0,
    validate(input) {
      return new Promise((resolve, reject) => {
        if (!input) reject(new Error('Ідентифікатор пакунку (Bundle ID) обовʼязковий для Cordova застосунку!'));
        else resolve(true);
      });
    },
  },
  {
    type: 'checkbox',
    name: 'cordovaPlatforms',
    message: 'Цільові Cordova платформи:',
    when: (opts) => opts.type.indexOf('cordova') >= 0,
    choices: [
      {
        name: 'iOS',
        value: 'ios',
        checked: true,
      },
      {
        name: 'Android',
        value: 'android',
        checked: true,
      },
      {
        name: 'Electron (настільний застосунок)',
        value: 'electron',
        checked: false,
      },
      {
        name: 'macOS (настільний MacOS застосунок)',
        value: 'osx',
        checked: false,
      },
    ],
    validate(input) {
      return new Promise((resolve, reject) => {
        if (!input || !input.length)
          reject(new Error('Цільова платформа обовʼязкова для Cordova застосунку!'));
        else resolve(true);
      });
    },
  },
  {
    type: 'checkbox',
    name: 'capacitorPlatforms',
    message: 'Цільові Capacitor платформи:',
    when: (opts) => opts.type.indexOf('capacitor') >= 0,
    choices: [
      {
        name: 'iOS',
        value: 'ios',
        checked: true,
      },
      {
        name: 'Android',
        value: 'android',
        checked: true,
      },
    ],
    validate(input) {
      return new Promise((resolve, reject) => {
        if (!input || !input.length)
          reject(new Error('Цільова платформа обовʼязкова для Capacitor застосунку!'));
        else resolve(true);
      });
    },
  },

  // Framework
  {
    type: 'list',
    name: 'framework',
    message: 'Який тип Techno4 фреймворку обрати?',
    choices: [
      {
        name: 'Techno4 Core',
        value: 'core',
      },
      {
        name: 'Techno4 з Vue.js',
        value: 'vue',
      },
      {
        name: 'Techno4 з React',
        value: 'react',
      },
      {
        name: 'Techno4 з Svelte',
        value: 'svelte',
      },
    ],
  },

  // Template
  {
    type: 'list',
    name: 'template',
    message: 'Який стартовий шаблон обрати?',
    choices: [
      {
        name: 'Пустий',
        value: 'blank',
      },
      {
        name: 'Один Перегляд (View)',
        value: 'single-view',
      },
      {
        name: 'Перегляд з вкладками (Tabs)',
        value: 'tabs',
      },
      {
        name: 'Двопанельний перегляд (Split Panel)',
        value: 'split-view',
      },
    ],
  },

  // Bundler
  {
    type: 'list',
    name: 'bundler',
    message: 'Налаштувати проєкт з компілятором (Bundler)?',
    when: (opts) => opts.framework === 'core',
    default(opts) {
      if (opts.framework === 'core') return false;
      return 'vite';
    },
    choices(opts) {
      const choices = [
        {
          name: 'Компілятор Vite (рекомендовано)',
          value: 'vite',
        },
      ];
      if (opts.framework === 'core') {
        choices.unshift({
          name: 'Без компілятора',
          value: false,
        });
      }
      return choices;
    },
  },
  {
    type: 'list',
    name: 'cssPreProcessor',
    message: 'Бажаєте налаштувати препроцесор CSS Pre-Processor?',
    when: (opts) => opts.bundler === 'vite' || opts.framework !== 'core',
    default: false,
    choices: [
      {
        name: 'Ні, все чудово з CSS',
        value: false,
      },
      {
        name: 'Less',
        value: 'less',
      },
      {
        name: 'Stylus',
        value: 'stylus',
      },
      {
        name: 'SCSS (SASS)',
        value: 'scss',
      },
    ],
  },

  // Color
  {
    type: 'list',
    name: 'themingCustomColor',
    message: 'Хочете визначити власний колір теми?',
    choices: [
      {
        name: 'Ні, Залиште стандартні кольори теми.',
        value: false,
      },
      {
        name: 'Так, я хочу визначити власний колір теми.',
        value: true,
      },
    ],
  },
  {
    type: 'input',
    name: 'themingColor',
    message: 'Введіть значення кольору у шістнадцятковому форматі HEX (наприклад: ff0000)',
    when: (opts) => opts.themingCustomColor === true,
    validate(input) {
      return new Promise((resolve, reject) => {
        const num = input.replace(/#/g, '');
        if (num.length === 3 || num.length === 6) resolve(true);
        else reject(new Error("Це не схоже на шістнадцятковий номер HEX."));
      });
    },
    filter(input) {
      return input.replace(/#/g, '');
    },
  },
  // Bundler
  {
    type: 'list',
    name: 'themingIconFonts',
    message: 'Ви хочете включити Techno4 Icons та Material Icons шрифт?',
    default: true,
    choices: [
      {
        name: 'Так.',
        value: true,
      },
      {
        name: 'Ні.',
        value: false,
      },
    ],
  },
];

module.exports = function getOptions() {
  return inquirer.prompt(questions).then((options) => {
    if (options.framework !== 'core' && !options.bundler) {
      options.bundler = 'vite'; // eslint-disable-line
    }
    if (options.type.indexOf('cordova') >= 0) {
      options.cordova = {
        folder: 'cordova',
        platforms: options.cordovaPlatforms,
      };
      if (
        options.cordovaPlatforms.indexOf('ios') >= 0 ||
        options.cordovaPlatforms.indexOf('android') >= 0
      ) {
        options.cordova.plugins = [
          'cordova-plugin-statusbar',
          'cordova-plugin-keyboard',
          'cordova-plugin-splashscreen',
        ];
      }
      delete options.cordovaPlatforms;
    }
    if (options.type.indexOf('capacitor') >= 0) {
      options.capacitor = {
        platforms: options.capacitorPlatforms,
      };
      delete options.capacitorPlatforms;
    }
    options.theming = {
      customColor: options.themingCustomColor,
      color:
        options.themingCustomColor && options.themingColor ? `#${options.themingColor}` : '#007aff',
      darkTheme: false,
      iconFonts: options.themingIconFonts,
      fillBars: false,
    };
    options.customBuild = false;
    delete options.themingCustomColor;
    delete options.themingColor;
    delete options.themingIconFonts;

    if (options.type.indexOf('pwa') >= 0 && options.type.indexOf('web') < 0) {
      options.type.push('web');
    }
    return Promise.resolve(options);
  });
};
