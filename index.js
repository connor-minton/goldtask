#!/usr/bin/env node

const argparse = require('argparse');
const path = require('path');
const repos = require('./lib/yaml-repo');
const init = require('./lib/init');
const inquirer = require('inquirer');
const appConfig = require('./lib/app-config');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const RC_PATH = appConfig.rcPath;

main()
  .catch(e => {
    console.error('error: There was an unhandled exception:', e);
    process.exit(1);
  });

async function main() {
  await init(RC_PATH);

  const cli = new argparse.ArgumentParser({
    version: '0.0.2',
    addHelp: true,
    description: 'A rewards system that helps you reinforce your good habits!'
  });

  const subparsers = cli.addSubparsers({ dest: 'cliCommand', help: 'sub-commands' });

  // hack to make `status` the default sub-command
  if (process.argv.length === 2) {
    process.argv.push('status');
    console.log('(For help, run `gold -h`)');
  }

  const commands = {
    earn: require('./lib/commands/earn')(subparsers),
    redeem: require('./lib/commands/redeem')(subparsers),
    status: require('./lib/commands/status')(subparsers)
  };

  const args = cli.parseArgs();

  let action;
  try {
    action = require(path.join(__dirname, 'lib', 'actions', args.cliCommand));
  }
  catch (e) {
    cli.error('could not find an action for the sub-command');
  }

  await action(args, commands[args.cliCommand]);

  repos.saveAll();
}
