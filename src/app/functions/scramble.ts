// Scrambles a number so its hidden
export function scramble(number: string) {
  let quotient = Number(1 + number);
  let binary = ``;
  if (quotient === 0) {
    binary = `0`;
  }
  while (quotient > 0) {
    binary = (quotient % 2) + binary;
    quotient = Math.floor(quotient / 2);
  }
  let result = ``;
  let counter = 1;
  for (let i = 1; i < binary.length; i++) {
    if (binary.charAt(i) === binary.charAt(i - 1)) {
      counter++;
    } else {
      result += counter > 9 ? `a${counter}` : counter;
      counter = 1;
    }
    if (i === binary.length - 1) {
      result += counter > 9 ? `a${counter}` : counter;
    }
  }
  return result;
}
