const { permutation, range } = require('../lib/utils');
const ELEMENTS = 6;
const ITERATIONS = 100000;

const source = range(ELEMENTS);
const counts = [];
for (let i = 0; i < ELEMENTS; i++) {
  counts.push(new Array(ELEMENTS).fill(0));
}

for (let i = 0; i < ITERATIONS; i++) {
  const perm = permutation(source);
  for (let orig = 0; orig < ELEMENTS; orig++) {
    const result = perm[orig];
    counts[orig][result]++;
  }
}

// interpret results

for (let orig = 0; orig < ELEMENTS; orig++) {
  const sumOrigCounts = counts[orig].reduce((acc, cur) => acc + cur, 0);
  for (let result = 0; result < ELEMENTS; result++) {
    console.log(`Map ${orig} to ${result}`);
    console.log(`Expected: ${1/ELEMENTS}`);
    console.log(`Actual:   ${counts[orig][result]/sumOrigCounts}`);
    console.log('--------');
  }
}
