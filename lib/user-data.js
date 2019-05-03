const repo = require('./yaml-repo')('data');

class UserData {
  constructor() {
  }

  get(key, defaultValue) {
    return repo.get(key, defaultValue);
  }

  set(key, value) {
    return repo.set(key, value);
  }

  addTransaction(transaction) {
    const _transaction = {};
    _transaction.type = transaction.type;
    _transaction.date = transaction.date;
    _transaction.gold = transaction.gold;
    _transaction.description = transaction.description;

    let transactions = repo.get('transactions');
    if (!transactions) {
      transactions = [];
      repo.set('transactions', transactions);
    }

    if (_transaction.type === 'earn') {
      repo.set('gold', repo.get('gold') + _transaction.gold);
    }
    else if (_transaction.type === 'redeem') {
      repo.set('gold', repo.get('gold') - _transaction.gold);
    }
    else {
      throw new Error(`unknown transaction type "${transaction.type}"`);
    }

    transactions.push(_transaction);

    return this;
  }
}

module.exports = new UserData();
