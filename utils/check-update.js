const axios = require('axios');
const pkg = require('../package.json');
const spinner = require('./spinner');
const log = require('./log');

async function checkUpdate() {
  spinner.start('Перевірка оновлень...');

  const hasUpdate = await new Promise((resolve, reject) => {
    axios
      .get('https://registry.npmjs.org/techno4-cli/latest')
      .then((res) => {
        const latestVersion = res.data.version.split('.').map((n) => parseInt(n, 10));
        const currentVersion = pkg.version.split('.').map((n) => parseInt(n, 10));
        let hasUpdateVersion = false;
        let currentIsHigher = false;
        latestVersion.forEach((n, index) => {
          if (currentIsHigher) return;
          if (latestVersion[index] > currentVersion[index]) hasUpdateVersion = true;
          else if (latestVersion[index] < currentVersion[index]) currentIsHigher = true;
        });
        resolve(hasUpdateVersion);
      })
      .catch((err) => {
        reject(err);
        spinner.error('Помилка перевірки оновлень.');
        if (err) log.error(err.stderr || err);
        process.exit(1);
      });
  });

  if (hasUpdate) {
    spinner.error('Доступні оновлення');
    log.text(
      `\nБудь-ласка оновіть techno4-cli до останньої версії перед продовженням.\nДля оновлення techno4-cli, використовуйте коменду:`,
    );
    log.text('\n> npm install techno4-cli -g', true);
    log.text('\nЩоб пропустити оновлення використовуйте --skipUpdate аргумент\n', false, 'gray');
    process.exit(1);
  } else {
    spinner.done('Чудово, techno4-cli оновлено до найновішої версії.');
  }
}

module.exports = checkUpdate;
