const inquirer = require('inquirer');
const data = require('../user-data');
const config = require('../yaml-store')('config');
const { validateGold,
        validateNewPrizeName
      } = require('../validators');
const Fuse = require('fuse.js');

const NEW_PRIZE = '<new prize>';
const ANON_PRIZE = '<anonymous prize>';

const phonyPrizes = [
  { name: NEW_PRIZE },
  { name: ANON_PRIZE }
];

const goldNamePattern = /^\(([0-9]+) G\) (.*)$/;

module.exports = async (args, cli) => {
  const prizes = config.get('prizes', []);
  if (prizes.length === 0)
    config.set('prizes', prizes);
  const searchPrizes = phonyPrizes.concat(prizes);
  const userGold = data.get('gold');
  const searcher = new Fuse(searchPrizes, {
    tokenize: true,
    keys: ['name']
  });

  const questions = [
    {
      type: 'autocomplete',
      name: 'prizeName',
      message: `You have ${userGold} Gold. Select a prize:`,
      source: async (_answers, value) => {
        if (value)
          return searcher.search(value)
            .map(p => formatPrize(p));
        return searchPrizes.map(p => formatPrize(p));
      }
    },
    {
      when: ans => ans.prizeName === NEW_PRIZE,
      type: 'input',
      name: 'newPrizeName',
      message: 'What should be the name of the new prize?',
      validate: input => validateNewPrizeName(searchPrizes, input)
    },
    {
      when: ans => ans.newPrizeName,
      type: 'number',
      name: 'newPrizeGold',
      message: 'How much Gold should the new prize be worth?',
      validate: validateGold
    },
    {
      when: ans => ans.prizeName === ANON_PRIZE,
      type: 'input',
      name: 'anonPrizeName',
      message: 'What kind of prize are you getting?',
      default: '<no description>'
    },
    {
      when: ans => ans.anonPrizeName,
      type: 'number',
      name: 'anonPrizeGold',
      message: 'How much Gold do you think that\'s worth?',
      validate: validateGold
    }
  ];

  const ans = await inquirer.prompt(questions);

  const finalPrize = {};
  if (ans.prizeName === NEW_PRIZE) {
    finalPrize.name = ans.newPrizeName;
    finalPrize.gold = ans.newPrizeGold;
    createPrize(finalPrize);
    console.log(`Created a new prize worth ${finalPrize.gold} Gold: "${finalPrize.name}"`);
  }
  else if (ans.prizeName === ANON_PRIZE) {
    finalPrize.name = ans.anonPrizeName;
    finalPrize.gold = ans.anonPrizeGold;
  }
  else {
    finalPrize.name = unformatPrize(ans.prizeName);
    const prize = prizes.find(p => p.name === finalPrize.name);
    finalPrize.gold = prize.gold;
  }

  if (finalPrize.gold > userGold) {
    console.log(`You do not have enough Gold to purchase "${finalPrize.name}".`);
    return;
  }

  const { confirmed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmed',
    message: `Buy "${finalPrize.name}" for ${finalPrize.gold} Gold?`,
    default: true
  }]);

  if (confirmed) {
    data.addTransaction({
      type: 'redeem',
      date: new Date().toISOString(),
      gold: finalPrize.gold,
      description: finalPrize.name
    });
    console.log(`You bought "${finalPrize.name}". Enjoy!`);
    return;
  }
  else {
    console.log('Just looking around?');
    return;
  }
};

function createPrize(prize) {
  const prizes = config.get('prizes', []);
  if (prizes.length === 0)
    config.set('prizes', prizes);
  prizes.push({
    name: prize.name,
    gold: prize.gold
  });
}

function formatPrize(prize) {
  if (phonyPrizes.some(p => p.name === prize.name))
    return prize.name;
  return `(${prize.gold} G) ${prize.name}`;
}

function unformatPrize(prizeGoldName) {
  const matches = prizeGoldName.match(goldNamePattern);
  if (matches)
    return matches[2];
  return prizeGoldName;
}
