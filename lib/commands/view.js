module.exports = subparsers => {
  const parser = subparsers.addParser('view', {
    help: 'View a summary of your gold',
    description: 'View a summary of your gold.'
  });

  return parser;
};
