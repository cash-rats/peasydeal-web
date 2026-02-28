import type { ActionFunctionArgs } from 'react-router';
import { fetchAddressOptionsByPostal } from './api';

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formEntries = Object.fromEntries(form.entries());
  const postal = formEntries.postal as string;
  if (!postal) return null;

  try {
    const options = await fetchAddressOptionsByPostal({ postal });
    return Response.json(options);
  } catch (err) {
    console.error('[checkout][address-lookup] failed to fetch options', {
      postal,
      error: err instanceof Error ? err.message : String(err),
    });
    return Response.json([]);
  }
}
