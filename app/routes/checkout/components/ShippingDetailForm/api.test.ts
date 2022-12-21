import { describe, it, expect } from 'vitest';

import { fetchAddressOptionsByPostal } from './api.server';

describe('fetch address option api ', () => {
  it('fetch address options via postal code', async () => {
    const options = await fetchAddressOptionsByPostal({ postal: 'ne1 5ue' });
    expect(options.line1s.length).toBeGreaterThan(0);
    expect(options.line2s.length).toBeGreaterThan(0);
    expect(options.cities.length).toBeGreaterThan(0);
    expect(options.counties.length).toBeGreaterThan(0);
    expect(options.countries.length).toBe(1);
  })
})