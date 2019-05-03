#!/usr/bin/env node

const argparse = require('argparse');
const path = require('path');
const repos = require('./lib/yaml-repo');
const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

main();

async function main() {
  const cli = new argparse.ArgumentParser({
    version: '0.0.0',
    addHelp: true,
    description: 'A rewards system that helps you reinforce your good habits!'
  });

  const subparsers = cli.addSubparsers({ dest: 'cliCommand', help: 'sub-commands' });

  const commands = {
    earn: require('./lib/commands/earn')(subparsers),
    redeem: require('./lib/commands/redeem')(subparsers),
    view: require('./lib/commands/view')(subparsers)
  };

  const args = cli.parseArgs();

  let action;
  try {
    action = require(path.resolve('lib', 'actions', args.cliCommand));
  }
  catch (e) {
    cli.error('could not find an action for the sub-command');
  }

  await action(args, commands[args.cliCommand]);

  repos.saveAll();
}
