import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CheckCircledIcon, CopyIcon, RocketIcon } from "@radix-ui/react-icons";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Email Verified - Your Coupon is Ready!" },
    { name: "description", content: "Your email is verified and coupon is ready to use" },
  ];
};

function ConfirmSubscription() {
 // Example coupon code - in a real app, this would come from your backend
  const couponCode = "WELCOME25";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <CheckCircledIcon className="h-16 w-16 text-green-500" />
              <div className="absolute -right-1 -top-1 rounded-full bg-bright-blue p-1">
                <RocketIcon className="h-4 w-4 text-white" />
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
                  {couponCode}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="rounded-md p-1.5 hover:bg-bright-blue/20"
                  title="Copy to clipboard"
                >
                  <CopyIcon className="h-4 w-4 text-bright-blue" />
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
              <RocketIcon className="h-4 w-4" />
              Start Shopping
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfirmSubscription;