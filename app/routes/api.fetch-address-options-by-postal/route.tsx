import { ActionFunctionArgs } from 'react-router';
import { fetchAddressOptionsByPostalViaSupabase } from './api';

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formEntries = Object.fromEntries(form.entries());
  const postal = formEntries.postal as string;
  if (!postal) return null;

  try {
    const options = await fetchAddressOptionsByPostalViaSupabase({ postal });
    return Response.json(options);
  } catch (err) {
    return Response.json([]);
  }
}
