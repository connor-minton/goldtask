const userData = require('../user-data');

module.exports = async (args, cli) => {
  console.log(`You have ${userData.get('gold', 0)} Gold.`);
};
