import { ActionFunctionArgs } from 'react-router';
import { fetchAddressOptionsByPostal, } from '~/routes/checkout/api.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formEntries = Object.fromEntries(form.entries());
  const postal = formEntries.postal as string;
  if (!postal) return null;
  try {
    const options = await fetchAddressOptionsByPostal({ postal });
    return Response.json(options);
  } catch (err) {
    return Response.json([]);
  }
}
