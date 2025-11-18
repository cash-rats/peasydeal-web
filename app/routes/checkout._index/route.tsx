import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from 'react-router';

// Minimal links/loader/action to help debug 500s on `/checkout`.
export const links: LinksFunction = () => {
  return [];
};

export const loader = async (_args: LoaderFunctionArgs) => {
  // Return a simple, static payload so we know the loader succeeds.
  return Response.json({ ok: true });
};

export const action = async (_args: ActionFunctionArgs) => {
  // No-op action; always responds successfully.
  return Response.json({ ok: true });
};

function CheckoutPageDebug() {
  return (
    <div className="w-full min-h-[35rem] flex items-center justify-center">
      <h1 className="text-xl font-semibold">
        Hello from /checkout (index debug)
      </h1>
    </div>
  );
}

export default CheckoutPageDebug;

