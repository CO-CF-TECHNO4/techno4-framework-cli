export default function (log) {
  log = log.map((l) => {
    return l
      .replace(/(\[[0-9]?[0-9][m])/g, '')
      .replace(/↵/g, '\n')
      .replace(/[\x1b]/g, '')
      .trim()
  })

  const indexesToRemove = [];
  log.forEach((line, index) => {
    if (line.indexOf('✔') < 0) return
    const text = line.replace(/✔/g, '').trim()
    const sameTextItem = log.filter((line) => line.indexOf(text) === 0)[0]
    if (!sameTextItem) return
    indexesToRemove.push(log.indexOf(sameTextItem))
  })
  for (let i = log.length - 1; i >= 0; i -= 1) {
    if (indexesToRemove.indexOf(i) >= 0) {
      log.splice(i, 1)
    }
  }
  return log
    .join('\n')
    .replace(/✔/g, '<span class="text-color-green">✔</span>')
    .replace(/ℹ/g, '<span class="text-color-yellow">ℹ</span>')
    .replace(
      'https://techno4.online/%D1%80%D0%B5%D1%94%D1%81%D1%82%D1%80%D0%B0%D1%82%D1%83%D1%80%D0%B0/%D0%B7%D1%80%D0%BE%D0%B1%D0%B8%D1%82%D0%B8-%D0%B1%D0%BB%D0%B0%D0%B3%D0%BE%D0%B4%D1%96%D0%B9%D0%BD%D0%B8%D0%B9-%D0%B2%D0%BD%D0%B5%D1%81%D0%BE%D0%BA',
      '<a href="https://techno4.online/%D1%80%D0%B5%D1%94%D1%81%D1%82%D1%80%D0%B0%D1%82%D1%83%D1%80%D0%B0/%D0%B7%D1%80%D0%BE%D0%B1%D0%B8%D1%82%D0%B8-%D0%B1%D0%BB%D0%B0%D0%B3%D0%BE%D0%B4%D1%96%D0%B9%D0%BD%D0%B8%D0%B9-%D0%B2%D0%BD%D0%B5%D1%81%D0%BE%D0%BA" class="external color-blue" target="_blank">Зробити благодійний внесок</a>',
    )
}
