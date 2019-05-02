module.exports = subparsers => {
  const parser = subparsers.addParser('earn', {
    help: 'Add gold to the bank',
    description: 'Add gold to the bank.'
  });

  parser.addArgument('gold', {
    type: Number,
    nargs: '?',
    help: 'The amount of gold to add to the bank'
  });
  parser.addArgument('reasons', {
    nargs: '*',
    help: 'The reason for earning the gold. You can write it out without the quotes, and it will be separated by spaces.',
    metavar: 'reason'
  });

  return parser;
};
