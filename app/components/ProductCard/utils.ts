export const capitalizeTagWords = (str: string) => {
  if (!str) return '';

  let words = str.split('_');
  let newStr = '';

  for (let word of words) {
    newStr += word.charAt(0).toUpperCase() + word.substring(1).toLowerCase() + ' ';
  }

  return newStr.trim();
}

export const getColorByTag = (tag: string) => {
  switch (tag) {
    case 'new':
      return '#2D91FF';
    case 'hot_deal':
      return '#D43B33';
    case 'price_off':
      return '#5EA111';
    default:
      return '#2D91FF';
  }
}
