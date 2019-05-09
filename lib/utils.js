/**
 * @param {Array} array
 */
function permutation(array) {
  const n = array.length;
  const perm = array.slice();
  for (let i = 0; i < n - 1; i++) {
    const j = Math.floor(Math.random() * (n-i)) + i;
    const tmp = perm[i];
    perm[i] = perm[j];
    perm[j] = tmp;
  }
  return perm;
}

function range(supremum) {
  const out = [];
  for (let i = 0; i < supremum; i++)
    out.push(i);
  return out;
}

const text = {};

text.yellow = function (str) {
  return '\x1b[1;33m' + str + '\x1b[0m';
};

text.bold = function (str) {
  return '\x1b[1m' + str + '\x1b[0m';
};

module.exports = {
  permutation,
  range,
  text
};
