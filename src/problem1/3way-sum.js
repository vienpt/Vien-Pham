let sum_to_n_a = function(n) {
  let sum = 0
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum
};

let sum_to_n_b = function(n) {
  // base condition to stop
  if (n === 1) {
    return 1;
  }

  return n + sum_to_n_b(n - 1)
};

/**
 * apply the Mathematical solution
 * @param n
 * @return {number}
 * Write the sequence forward:  1  2  3  4  5
 * Write it backward:          5  4  3  2  1
 * Add vertically:            6  6  6  6  6
 */
let sum_to_n_c = function(n) {
  return (n * (n + 1)) / 2;
};