import type { StarType } from './types';

/*
> 4.5 && <= 5 ---> 5 stars
r >= 4.3 && r <= 4.5 ---> 4.5 stars
>= 4 && < 4.3 ---> 4 stars

- When modulo > 0.5 ---> + 1 star
- When modulo >= 0.3 && <= 0.5 ---> + 0.5 star
- When modulo >= 0 && < 0.3 ---> + 0 star
*/

export function calcStars(num: number): StarType[] {
  // take number to the 2th decimal places
  num = Math.floor(num * 100)
  const mod = num % 100;
  const fullstarcount = Math.floor(num / 100);
  let trailingstar = 'no_star';

  if (mod > 50) {
    trailingstar = 'full_star';
  } else if (mod >= 30 && mod <= 50) {
    trailingstar = 'half_star';
  } else if (mod >= 0 && mod < 30) {
    trailingstar = 'no_star';
  }

  const stararr = new Array(5).fill('no_star');
  let placeCount = 0
  for (let i = 0; i < fullstarcount; i++) {
    stararr[i] = 'full_star';
    placeCount++;
  }

  stararr[placeCount] = trailingstar;
  for (let j = placeCount + 1; j < stararr.length; j++) {
    stararr[j] = 'no_star';
  }
  return stararr;
}