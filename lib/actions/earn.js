const inquirer = require('inquirer');
const data = require('../user-data');
const { validateGold } = require('../validators');

module.exports = async (args, cli) => {
  validate(args, cli);
  const questions = [];

  if (args.gold == null) {
    questions.push({
      type: 'input',
      name: 'gold',
      message: 'How much gold?',
      validate: validateGold,
      filter: Number
    });
  }

  if (args.reasons.length === 0) {
    questions.push({
      type: 'input',
      name: 'reason',
      message: 'What task?',
      default: 'Walk the cat'
    });
  }

  const initArgs = {
    gold: args.gold,
    reason: args.reasons.join(' ')
  };
  const finalArgs = Object.assign({}, initArgs, await inquirer.prompt(questions));

  data.addTransaction({
    type: 'earn',
    gold: finalArgs.gold,
    description: finalArgs.reason,
    date: new Date().toISOString()
  });

  console.log(`You earned ${finalArgs.gold} gold for completing "${finalArgs.reason}"!`);
};

function validate(args, cli) {
  const goldResult = validateGold(args.gold);
  if (goldResult !== true)
    cli.error(goldResult);
}
