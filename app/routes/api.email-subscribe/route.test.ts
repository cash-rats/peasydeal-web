import { describe, expect, it, vi } from 'vitest';

import { action } from './route';

const createFormRequest = (email: string | null) => {
  const formData = new FormData();
  if (email !== null) formData.set('email', email);

  return new Request('http://localhost/api/email-subscribe', {
    method: 'POST',
    body: formData,
  });
};

describe('/api/email-subscribe action', () => {
  it('returns 400 when email is missing', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const response = (await action({
      request: createFormRequest(null),
    } as any)) as Response;

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      code: 'email_subscribe_failed',
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns 400 when email is invalid', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const response = (await action({
      request: createFormRequest('not-an-email'),
    } as any)) as Response;

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      code: 'invalid_email',
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns ok:true on backend success', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

    const response = (await action({
      request: createFormRequest('test@example.com'),
    } as any)) as Response;

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0]?.[0]?.toString()).toContain('/v2/subscribe');
  });

  it('returns ok:false on backend error and preserves status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'Email already subscribed' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const response = (await action({
      request: createFormRequest('test@example.com'),
    } as any)) as Response;

    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: 'Email already subscribed',
    });
  });
});

