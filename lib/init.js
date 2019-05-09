const os = require('os');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const defaultAppHome = path.join(os.homedir(), '.goldtask');
const configFilename = 'config.yml';
const dataFilename = 'data.yml';

const configContents = `prizes: []
tasks: []
`;
const dataContents = `gold: 0
transactions: []
`;

const initConfig = {};

module.exports = rcPath => {
  if (!rcPath) return initConfig;

  let rcFile;
  try {
    rcFile = fs.readFileSync(rcPath, 'utf8');
  }
  catch (e) {
    console.log(`No .goldrc exists at "${rcPath}". Creating one.`);
    try {
      createGoldrc(rcPath);
    }
    catch (e) {
      console.error(`error: Could not create .goldrc at "${rcPath}": ${e.message}`);
      process.exit(1);
    }
  }

  let rc;
  try {
    rc = yaml.safeLoad(rcFile);
  }
  catch (e) {
    console.error(`error: Invalid YAML in .goldrc.`);
    process.exit(1);
  }

  initConfig.home = rc.home;
  if (!initConfig.home)
    initConfig.home = defaultAppHome;

  let appHomeDirContents;
  try {
    appHomeDirContents = new Set(fs.readdirSync(initConfig.home));
  }
  catch (e) {
    console.log(`No goldtask home exists at "${initConfig.home}". Creating one.`);
    try {
      fs.mkdirSync(initConfig.home);
      appHomeDirContents = new Set(fs.readdirSync(initConfig.home));
    }
    catch (e) {
      console.error(`error: Could not create directory: ${e.message}`);
      process.exit(1);
    }
  }

  if (!appHomeDirContents.has(configFilename))
    createYamlOrDie(path.join(initConfig.home, configFilename), configContents);
  if (!appHomeDirContents.has(dataFilename))
    createYamlOrDie(path.join(initConfig.home, dataFilename), dataContents);

  return initConfig;
};

function createGoldrc(rcPath) {
  fs.writeFileSync(rcPath, `home: ${defaultAppHome}` + os.EOL);
}

function createYamlOrDie(yamlPath, contents) {
  console.log(`No ${path.basename(yamlPath)} exists in gold home. Creating one.`);
  try {
    fs.writeFileSync(yamlPath, contents);
  }
  catch (e) {
    console.error(`error: Could not create ${path.basename(yamlPath)}: ${e.message}`);
    process.exit(1);
  }
}
