const userData = require('../user-data');
const config = require('../yaml-repo')('config');
const { text } = require('../utils');

const today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);

module.exports = async (args, cli) => {
  console.log(text.yellow(`\nYou have ${userData.get('gold', 0)} Gold.`));

  printTodaysActivity();

  const sortedPrizes = config.get('prizes').sort((a,b) => a.gold < b.gold);
  const possiblePrizes = getPossiblePurchases(sortedPrizes, 3);
  const futurePrizes = getFuturePurchases(sortedPrizes, 3);

  printSuggestions(possiblePrizes.concat(futurePrizes));
};

function printSuggestions(suggestedPrizes) {
  const suggStrings = [];
  for (prize of suggestedPrizes)
    suggStrings.push(formatSuggestion(prize));
  if (suggStrings.length > 0) {
    console.log(text.bold('\nSuggestions\n------------\n'));
    console.log(suggStrings.join('\n'));
  }
}

function printTodaysActivity() {
  const txnStrings = [];
  for (let t of userData.get('transactions')) {
    if (new Date(t.date) >= today)
      txnStrings.push(formatTransaction(t));
  }
  if (txnStrings.length > 0) {
    console.log(text.bold('\nToday\'s Activity\n----------------\n'));
    console.log(txnStrings.join('\n'));
  }
}

function formatTransaction(transaction) {
  if (transaction.type === 'earn')
    return `  [${new Date(transaction.date)}] You earned ${transaction.gold} Gold from "${transaction.description}".`;
  else if (transaction.type === 'redeem')
    return `  [${new Date(transaction.date)}] You spent ${transaction.gold} Gold on "${transaction.description}".`;
}

function formatSuggestion(prize) {
  const userGold = userData.get('gold');
  if (prize.gold <= userGold)
    return `  For ${prize.gold} Gold, you could buy "${prize.name}"!`;
  else
    return `  Earn ${prize.gold-userGold} more Gold to buy a "${prize.name}"!`;
}

// sortedPrizes - sorted least to greatest
function getPossiblePurchases(sortedPrizes, max=3) {
  const userGold = userData.get('gold');
  const possible = [];
  for (let i = sortedPrizes.length - 1; i >= 0; i--) {
    if (possible.length === max) break;
    if (sortedPrizes[i].gold <= userGold)
      possible.push(sortedPrizes[i]);
  }
  return possible;
}

// sortedPrizes - sorted least to greatest
function getFuturePurchases(sortedPrizes, max=3) {
  const userGold = userData.get('gold');
  const future = [];
  for (let i = 0; i < sortedPrizes.length; i++) {
    if (future.length === max) break;
    if (sortedPrizes[i].gold > userGold)
      future.push(sortedPrizes[i]);
  }
  return future;
}
