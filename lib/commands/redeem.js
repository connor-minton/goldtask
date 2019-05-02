module.exports = subparsers => {
  const parser = subparsers.addParser('redeem', {
    help: 'Redeem gold for prizes',
    description: 'Redeem gold for prizes.'
  });

  return parser;
};
