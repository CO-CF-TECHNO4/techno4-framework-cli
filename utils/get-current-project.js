const path = require('path');

module.exports = (cwd) => {
  let currentProject;
  try {
    // eslint-disable-next-line
    currentProject = require(path.resolve(cwd, 'techno4.json'));
  } catch (err) {
    // all good
  }
  if (!currentProject) {
    try {
      // eslint-disable-next-line
      currentProject = require(path.resolve(cwd, 'package.json')).techno4;
    } catch (err) {
      // all good
    }
  }
  if (!currentProject) return undefined;
  return {
    cwd,
    ...(currentProject || {}),
  };
};
