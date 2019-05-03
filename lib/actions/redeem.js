const inquirer = require('inquirer');
const data = require('../user-data');
const config = require('../yaml-repo')('config');
const Fuse = require('fuse.js');

const goldNamePattern = /^\(([0-9]+) G\) (.*)$/;

module.exports = async (args, cli) => {
  const userGold = data.get('gold');
  const searcher = new Fuse(config.get('prizes', []), {
    tokenize: true,
    keys: ['name']
  });

  const questions = [];

  if (args.prizeWords.length === 0) {
    questions.push({
      type: 'autocomplete',
      name: 'prizeChoice',
      message: `You have ${userGold} Gold. Select a prize:`,
      source: async (_answers, value) => {
        const format = (gold, name) => `(${gold} G) ${name}`;
        if (value)
          return searcher.search(value)
            .map(it => format(it.gold, it.name));
        return config.get('prizes').map(it => format(it.gold, it.name));
      }
    });
  }

  let prizeName;
  const responses = await inquirer.prompt(questions);
  if (responses.prizeChoice) {
    const matches = responses.prizeChoice.match(goldNamePattern);
    if (matches)
      prizeName = matches[2];
  }
  else {
    prizeName = args.prizeWords.join(' ');
  }

  const prize = config.get('prizes').find(p => p.name === prizeName);
  if (!prize) {
    console.log(`Could not find a prize with the name "${prizeName}".`);
    return;
  }
  if (prize.gold > userGold) {
    console.log(`You do not have enough Gold to purchase "${prizeName}".`);
    return;
  }

  const { confirmed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmed',
    message: `Buy "${prize.name}" for ${prize.gold} Gold?`,
    default: false
  }]);

  if (confirmed) {
    data.addTransaction({
      type: 'redeem',
      date: new Date().toISOString(),
      gold: prize.gold,
      description: prize.name
    });
    console.log(`You bought "${prize.name}". Enjoy!`);
    return;
  }
  else {
    console.log('Just looking around?');
    return;
  }
};
