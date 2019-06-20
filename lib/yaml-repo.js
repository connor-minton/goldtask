const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const _ = {
  get: require('lodash/get'),
  set: require('lodash/set')
};

let appHome;

const repos = new Map();

class YamlRepo {
  constructor(name) {
    this._name = String(name);
    this._data = {};
    this._dirty = true;
    this._loaded = false;
  }

  load() {
    if (!this._loaded)
      this.forceLoad();
  }

  forceLoad() {
    const filepath = path.join(appHome, this._name + '.yml');
    const data = fs.readFileSync(filepath);
    this._data = yaml.safeLoad(data) || {};
    this._dirty = false;
    this._loaded = true;
    return this;
  }

  async save() {
    if (this._loaded)
      this.forceSave();
    return this;
  }

  forceSave() {
    const filepath = path.join(appHome, this._name + '.yml');
    const data = yaml.safeDump(this._data);
    fs.writeFileSync(filepath, data);
    this._dirty = false;
    return this;
  }

  get(key, defaultValue) {
    this.load();
    return _.get(this._data, key, defaultValue);
  }

  set(key, value) {
    _.set(this._data, key, value);
    this._dirty = true;
  }
}

module.exports = name => {
  if (!appHome)
    appHome = require('./init')().home;
  let repo = repos.get(name);
  if (!repo) {
    repo = new YamlRepo(name);
    repos.set(name, repo);
  }
  return repo;
};

module.exports.saveAll = async function saveAll() {
  const promises = [];
  for ([_name, repo] of repos) {
    promises.push(repo.save());
  }
  return Promise.all(promises);
};
