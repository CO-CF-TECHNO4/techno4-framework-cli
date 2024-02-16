#!/usr/bin/env node
/* eslint no-console: off */
const exec = require('exec-sh');
const path = require('path');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const fse = require('../utils/fs-extra');
const generatePackageJson = require('./utils/generate-package-json');

const createFolders = require('./templates/create-folders');
const copyAssets = require('./templates/copy-assets');
const createCordova = require('./templates/create-cordova');
const createCapacitor = require('./templates/create-capacitor');
const generateReadme = require('./utils/generate-readme');
const generateGitignore = require('./utils/generate-gitignore');
const log = require('../utils/log');

const waitText = chalk.gray('(Очікуйте, це може зайняти деякий час.)');

module.exports = async (options = {}, logger, { exitOnError = true, iconFile = null } = {}) => {
  const cwd = options.cwd || process.cwd();
  const isRunningInCwd = cwd === process.cwd();
  function errorExit(err) {
    log.error(err.stderr || err);
    if (exitOnError) process.exit(1);
  }
  if (options.bundler) {
    log.error('Attention!');
    log.error('For Vite it is recommended to have modern and latest Node.js and NPM.');
    log.error('Make sure you have at least Node.js v14 and NPM v7 installed on your system.');
  }

  if (!logger) {
    // eslint-disable-next-line
    logger = {
      statusStart() {},
      statusDone() {},
      statusError() {},
      text() {},
      error() {},
    };
  }

  // Options
  const { type } = options;

  // Package
  logger.statusStart('Генерація package.json.');
  const packageJson = generatePackageJson(options);

  // Write Package.json and project json
  fse.writeFileSync(path.join(cwd, 'package.json'), packageJson.content);
  fse.writeFileSync(path.join(cwd, 'techno4.json'), JSON.stringify(options, '', 2));

  logger.statusDone('Генерація package.json.');

  // Create Folders
  logger.statusStart('Генерація структури файлів.');
  try {
    createFolders(options);
  } catch (err) {
    logger.statusError('Помилка під час генерація структури файлів.');
    if (err) logger.error(err.stderr);
    errorExit(err);
  }
  logger.statusDone('Генерація структури файлів.');

  // Install NPM depenencies
  logger.statusStart(`${'Генерація NPM залежностей.'} ${waitText}`);
  try {
    if (!isRunningInCwd) {
      await exec.promise(
        `cd ${cwd.replace(/ /g, '\\ ')} && npm install ${packageJson.dependencies.join(
          ' ',
        )} --save --package-lock-only --no-package-lock --ignore-scripts`,
        true,
      );
    } else {
      await exec.promise(
        `npm install ${packageJson.dependencies.join(
          ' ',
        )} --save --package-lock-only --no-package-lock --ignore-scripts`,
        true,
      );
    }
  } catch (err) {
    logger.statusError('Помилка під час генерації NPM залежностей.');
    if (err) logger.error(err.stderr);
    errorExit(err);
    return;
  }
  logger.statusDone('Генерація NPM залежностей.');

  // Install NPM dev depenencies
  logger.statusStart(`${'Генерація NPM залежностей розробника.'} ${waitText}`);
  try {
    if (!isRunningInCwd) {
      await exec.promise(
        `cd ${cwd.replace(/ /g, '\\ ')} && npm install ${packageJson.devDependencies.join(
          ' ',
        )} --save-dev --package-lock-only --no-package-lock --ignore-scripts`,
        true,
      );
    } else {
      await exec.promise(
        `npm install ${packageJson.devDependencies.join(
          ' ',
        )} --save-dev --package-lock-only --no-package-lock --ignore-scripts`,
        true,
      );
    }
  } catch (err) {
    logger.statusError('Помилка під час додавання NPM залежностей розробника.');
    if (err) logger.error(err.stderr);
    errorExit(err);
    return;
  }
  logger.statusDone('Додавання NPM залежностей розробника.');

  // Create Cordova project
  if (type.indexOf('cordova') >= 0) {
    logger.statusStart(`${'Генерація Cordova проекту.'} ${waitText}.`);
    try {
      await createCordova(options);
    } catch (err) {
      logger.statusError('Помилка під час створення Cordova проекту.');
      if (err) logger.error(err.stderr);
      errorExit(err);
      return;
    }
    logger.statusDone('Генерація Cordova проекту.');
  }

  // Create Capacitor project
  if (type.indexOf('capacitor') >= 0) {
    logger.statusStart(`${'Генерація Capacitor проекту.'} ${waitText}`);
    try {
      await createCapacitor(options);
    } catch (err) {
      logger.statusError('Помилка під час генерації Capacitor проекту.');
      if (err) logger.error(err.stderr);
      errorExit(err);
      return;
    }
    logger.statusDone('Генерація Capacitor проекту.');
  }

  // Create Project Files
  logger.statusStart('Генерація файлів проекту.');
  const filesToCopy = copyAssets(options, iconFile);
  try {
    // eslint-disable-next-line
    await Promise.all(
      filesToCopy.map((f) => {
        if (f.from) {
          return fse.copyFileAsync(f.from, f.to);
        }
        if (f.content) {
          return fse.writeFileAsync(f.to, f.content);
        }
        return Promise.resolve();
      }),
    );
  } catch (err) {
    logger.statusError('Помилка під час генерації файлів проекту.');
    if (err) logger.error(err.stderr || err);
    errorExit(err);
    return;
  }

  // Generate Readme
  const readMeContent = generateReadme(options);
  try {
    fse.writeFileSync(path.join(cwd, 'README.md'), readMeContent);
  } catch (err) {
    logger.statusError('Помилка під час генерації файлів проекту.');
    if (err) logger.error(err.stderr || err);
    errorExit(err);
    return;
  }

  // Generate .gitignore
  const gitignoreContent = generateGitignore(options);
  try {
    fse.writeFileSync(path.join(cwd, '.gitignore'), gitignoreContent);
  } catch (err) {
    logger.statusError('Помилка під час генерації файлів проекту.');
    if (err) logger.error(err.stderr || err);
    errorExit(err);
    return;
  }

  logger.statusDone('Генерація файлів проекту.');

  // Final Text
  const finalText = `
${chalk.bold(logSymbols.success)} ${chalk.bold('Виконано!')} 💪

${chalk.bold(logSymbols.info)} ${chalk.bold('Подальші кроки:')}
  - 😎😉 Запустіть команду "npm install" для встановлення пакетів залежностей.
  - ✔✔ Запустіть команду "npm start" для запуску сервера розробки.
  - ✨✨ Офіційний сайт проєкту ${chalk.bold('https://techno4.online')}.
  - 📖📖 Шукайте документацію за посиланням ${chalk.bold('https://techno4.online/надбання/фреймворк')}.
  - 📖📖 Читайте ${chalk.bold('README.md')} в файлах проекту для отримання інструкцій.

${chalk.bold('Подобається Techno4? Підтримайте проект: ${chalk.bold("https://techno4.online/реєстратура/зробити-благодійний-внесок")}')}
    `;

  logger.text(finalText);
};
