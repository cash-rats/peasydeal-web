
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Link, useLoaderData } from 'react-router';
import { activateEmailSubscribe } from '~/api/activate-email.server';
import { FiCopy } from 'react-icons/fi';
import { IoCheckmarkCircle, IoRocketSharp, IoWarningOutline } from 'react-icons/io5';

import UtilityLayout from '~/components/layouts/UtilityLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export const meta: MetaFunction = () => {
  return [
    { title: 'Email Verified - Your Coupon is Ready!' },
    { name: 'description', content: 'Your email is verified and coupon is ready to use' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const uuid = url.searchParams.get('uuid') as string;
  const { coupon } = await activateEmailSubscribe(uuid);
  return Response.json({ coupon });
};

export const ErrorBoundary = () => {
  return (
    <UtilityLayout mainClassName="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <IoWarningOutline className="h-12 w-12 text-destructive text-error-msg-red" />
            </div>
          </div>
          <CardTitle className="text-2xl text-destructive">Email Verification Failed</CardTitle>
          <CardDescription className="mt-2 text-base">We couldn't validate your email address</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg bg-destructive/10 p-4">
            <p className="text-sm text-destructive">This might have happened because:</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• The verification link has expired</li>
              <li>• The link was already used</li>
              <li>• The verification code is invalid</li>
            </ul>
          </div>

          <div className="text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              Return to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </UtilityLayout>
  );
};

function ConfirmSubscription() {
  const { coupon } = useLoaderData<typeof loader>();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coupon);
  };

  return (
    <UtilityLayout mainClassName="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <IoCheckmarkCircle className="h-16 w-16 text-green-500" />
              <div className="absolute -right-1 -top-1 rounded-full bg-bright-blue p-1">
                <IoRocketSharp className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl">Email Verified!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/50">
            <p className="text-green-800 dark:text-green-300">
              Your exclusive discount is ready to use
            </p>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">Your coupon code:</p>
            <div className="relative">
              <div className="flex items-center justify-center gap-2 rounded-lg bg-bright-blue/10 p-4">
                <code className="text-2xl font-bold tracking-wider text-bright-blue">
                  {coupon}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="rounded-md p-1.5 hover:bg-bright-blue/20"
                  title="Copy to clipboard"
                >
                  <FiCopy className="h-4 w-4 text-bright-blue" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-bright-blue/5 p-4">
              <h3 className="mb-2 font-semibold text-bright-blue">How to use your coupon:</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bright-blue/10 text-xs text-bright-blue">
                    1
                  </span>
                  <span>Copy the code above</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bright-blue/10 text-xs text-bright-blue">
                    2
                  </span>
                  <span>Paste it at checkout</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bright-blue/10 text-xs text-bright-blue">
                    3
                  </span>
                  <span>Enjoy your discount!</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-bright-blue px-4 py-2 text-sm font-medium text-white hover:bg-bright-blue/90"
            >
              <IoRocketSharp className="h-4 w-4" />
              Start Shopping
            </Link>
          </div>
        </CardContent>
      </Card>
    </UtilityLayout>
  );
}

export default ConfirmSubscription;
