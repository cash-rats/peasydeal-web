import { Link } from 'react-router';
import { CircleHelp } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

function SupportCard() {
  return (
    <Card className="border-blue-100 bg-blue-50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-blue-700">
            <CircleHelp className="h-4 w-4" aria-hidden />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">Need Help?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Questions about your order? We&apos;re here to assist you.
            </p>

            <Button asChild variant="link" className="mt-2 h-auto p-0 text-blue-700">
              <Link to="/contact-us">Contact support</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SupportCard;

