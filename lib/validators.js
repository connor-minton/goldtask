const config = require('./yaml-store')('config');

function validateGold(value) {
  if (value != null && (!Number.isFinite(value) || value < 0)) {
    return 'Gold must be a finite number greater than or equal to 0.';
  }
  return true;
}

function validatePrize(value) {
  if (value != null && !config.get('prizes', []).some(p => p.name === value)) {
    return `No prize found with the name "${value}".`;
  }
  return true;
}

function validateNewTaskName(tasks, name) {
  if (!name)
    return `Name must be non-empty.`;
  if (tasks.some(t => t.name === name))
    return `A task with the name "${name}" already exists.`;
  return true;
}

function validateNewPrizeName(prizes, name) {
  if (!name)
    return `Name must be non-empty.`;
  if (prizes.some(p => p.name === name))
    return `A prize with the name "${name}" already exists.`;
  return true;
}

module.exports = {
  validateGold,
  validatePrize,
  validateNewTaskName,
  validateNewPrizeName
};
