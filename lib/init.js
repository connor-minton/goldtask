const path = require('path');
const os = require('os');
const fs = require('fs');
const yaml = require('js-yaml');
const appConfig = require('./app-config');
const inquirer = require('inquirer');

const configFilename = 'config.yml';
const dataFilename = 'data.yml';

const configContents = {
  prizes: [],
  tasks: []
};

const dataContents = {
  gold: 0,
  transactions: []
};

module.exports = async () => {
  const { rcPath } = appConfig;

  let rcFile;
  try {
    rcFile = fs.readFileSync(rcPath, 'utf8');
  }
  catch (e) {
    console.log(`No .goldrc exists at "${rcPath}". Creating one.`);
    try {
      await createGoldrc(rcPath);
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

  if (rc.home)
    appConfig.home = rc.home;

  let appHomeDirContents;
  try {
    appHomeDirContents = new Set(fs.readdirSync(appConfig.home));
  }
  catch (e) {
    console.log(`No goldtask home exists at "${appConfig.home}". Creating one.`);
    try {
      fs.mkdirSync(appConfig.home);
      appHomeDirContents = new Set(fs.readdirSync(appConfig.home));
    }
    catch (e) {
      console.error(`error: Could not create directory: ${e.message}`);
      process.exit(1);
    }
  }

  if (!appHomeDirContents.has(configFilename))
    createYamlOrDie(path.join(appConfig.home, configFilename), configContents);
  if (!appHomeDirContents.has(dataFilename))
    createYamlOrDie(path.join(appConfig.home, dataFilename), dataContents);

  return appConfig;
};

async function createGoldrc(rcPath) {
  let shouldUseDropbox = false;
  const detectedDropboxDir = detectDropboxDir();
  if (detectedDropboxDir) {
    shouldUseDropbox = await promptUseDropbox();
  }
  if (shouldUseDropbox) {
    appConfig.home = path.join(detectedDropboxDir, 'goldtask');
    console.log(`Okay, Goldtask will store its data in "${appConfig.home}".`);
  }

  const goldrc = { home: appConfig.home };
  const goldrcContents = yaml.safeDump(goldrc);
  fs.writeFileSync(rcPath, goldrcContents);
}

async function promptUseDropbox() {
  const { shouldUseDropbox } = await inquirer.prompt([{
    type: 'confirm',
    name: 'shouldUseDropbox',
    message: 'It looks like you have Dropbox installed. Do you want Goldtask to use Dropbox to store your Gold?',
    default: true
  }]);

  return shouldUseDropbox;
}

function detectDropboxDir() {
  const dropboxDir = path.join(os.homedir(), 'Dropbox');
  try {
    const stat = fs.statSync(dropboxDir);
    if (!stat.isDirectory())
      return false;
  }
  catch (e) {
    return false;
  }

  return dropboxDir;
}

function createYamlOrDie(yamlPath, obj) {
  console.log(`No ${path.basename(yamlPath)} exists in gold home. Creating one.`);
  try {
    fs.writeFileSync(yamlPath, yaml.safeDump(obj));
  }
  catch (e) {
    console.error(`error: Could not create ${path.basename(yamlPath)}: ${e.message}`);
    process.exit(1);
  }
}
