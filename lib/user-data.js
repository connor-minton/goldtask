const store = require('./yaml-store')('data');

class UserData {
  constructor() {
  }

  get(key, defaultValue) {
    return store.get(key, defaultValue);
  }

  set(key, value) {
    return store.set(key, value);
  }

  addTransaction(transaction) {
    const _transaction = {};
    _transaction.type = transaction.type;
    _transaction.date = transaction.date;
    _transaction.gold = transaction.gold;
    _transaction.description = transaction.description;

    let transactions = store.get('transactions');
    if (!transactions) {
      transactions = [];
      store.set('transactions', transactions);
    }

    if (_transaction.type === 'earn') {
      store.set('gold', store.get('gold') + _transaction.gold);
    }
    else if (_transaction.type === 'redeem') {
      store.set('gold', store.get('gold') - _transaction.gold);
    }
    else {
      throw new Error(`unknown transaction type "${transaction.type}"`);
    }

    transactions.push(_transaction);

    return this;
  }
}

module.exports = new UserData();
