const path = require('path');
const os = require('os');

module.exports = {
  isConfigLoaded: false,
  home: path.join(os.homedir(), '.goldtask'),
  rcPath: path.join(os.homedir(), '.goldrc')
};
