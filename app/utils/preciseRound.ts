/**
 * https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Math/round
 *
 * @param type
 * @param value
 * @param exp
 * @returns
 */
function decimalAdjust(type: string, value: number, exp: number) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    // @ts-ignore
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  // @ts-ignore
  value = value.toString().split('e');
  // @ts-ignore
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));

  // Shift back
  // @ts-ignore
  value = value.toString().split('e');
  // @ts-ignore
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

const round10 = function (value: number, exp: number) {
  return decimalAdjust('round', value, exp);
};

const floor10 = function (value: number, exp: number) {
  return decimalAdjust('floor', value, exp);
};

const ceil10 = function (value: number, exp: number) {
  return decimalAdjust('ceil', value, exp);
};

export { round10, floor10, ceil10 };
