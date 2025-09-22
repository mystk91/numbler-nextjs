// Descrambles a hidden number
export function descramble(hidden: string) {
  let binaryNum = ``;
  let isOne = true;
  for (let i = 0; i < hidden.length; i++) {
    let n = Number(hidden.charAt(i));
    if (!n) {
      n = Number(hidden.substring(i + 1, i + 3));
      i += 2;
    }
    let numberAdded = isOne ? 1 : 0;
    for (let i = 0; i < n; i++) {
      binaryNum += numberAdded;
    }
    isOne = !isOne;
  }
  let number = 0;
  for (let i = 0; i < binaryNum.length; i++) {
    if (binaryNum.charAt(i) === `1`) {
      number += Math.pow(2, binaryNum.length - i - 1);
    }
  }
  let string = number.toString();
  const result = string.substring(1, string.length);
  return result;
}
