import { redirect } from 'react-router';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { getItemCount } from '~/sessions/shoppingcart.session.server';
import { ActionTypes } from './index';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return Response.json({ numOfItemsInCart: await getItemCount(request) });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());
  const formAction = formObj['action_type'] as ActionTypes;

  if (formAction === ActionTypes.redirect_to_collection) {
    const catType = formObj['category_type'];
    const catName = formObj['category_name'];

    return redirect(`/${catType}/${catName}`);
  }

  const itemCount = await getItemCount(request);
  return Response.json({ numOfItemsInCart: itemCount });
}
