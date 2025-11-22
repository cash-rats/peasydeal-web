import { expect } from 'vitest';

import { maskName } from './utils';

describe('track order util functions', () => {
  test.only('mask name into desired pattern', () => {
    const name1 = 'Chi Han Huang';
    const masked1 = maskName(name1);
    console.log('masked1', masked1);
  })
});