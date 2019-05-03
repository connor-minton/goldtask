const config = require('./yaml-repo')('config');

function validateGold(value) {
  if (value != null && (!Number.isFinite(value) || value < 0)) {
    return 'gold must be a finite number greater than or equal to 0';
  }
  return true;
}

function validatePrize(value) {
  if (value != null && !config.get('prizes', []).some(p => p.name === value)) {
    return `no prize found with the name ${value}`;
  }
  return true;
}

module.exports = {
  validateGold,
  validatePrize
};
