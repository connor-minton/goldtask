module.exports = subparsers => {
  const parser = subparsers.addParser('redeem', {
    help: 'Redeem gold for prizes',
    description: 'Redeem gold for prizes.'
  });

  parser.addArgument('prizeWords', {
    nargs: '*',
    help: 'The prize to buy. You can write it out without the quotes, and it will be separated by spaces.',
    metavar: 'prize'
  });

  return parser;
};
