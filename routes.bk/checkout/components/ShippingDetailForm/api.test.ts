import { describe, it, expect } from 'vitest';

import { fetchAddressOptionsByPostal } from './api.server';

describe('fetch address option api ', () => {
  it('fetch address options via postal code', async () => {
    const options = await fetchAddressOptionsByPostal({ postal: 'ne1 5ue' });
    expect(options.length).toBeGreaterThan(0);
  })
})