import { Mail, MapPin, Phone, User } from 'lucide-react';

import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';

interface OrderInformationProps {
  email: string;
  phone: string;
  firstname: string;
  lastname: string
  address: string;
  address2: string;
  city: string;
  postal: string;
  country: string;
}

function DetailRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}

function OrderInformation({
  email,
  phone,
  firstname,
  lastname,
  address,
  address2,
  city,
  postal,
  country,
}: OrderInformationProps) {
  const hasPhone = phone?.trim();
  const hasAddress2 = address2?.trim();

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 border-b bg-muted/40 px-6 py-4">
        <User className="h-4 w-4 text-emerald-600" aria-hidden />
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Customer Information
        </h2>
      </div>

      <CardContent className="space-y-6 p-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Contact</h3>
          <DetailRow icon={<Mail className="h-4 w-4" aria-hidden />}>
            {email}
          </DetailRow>
          <DetailRow icon={<User className="h-4 w-4" aria-hidden />}>
            {firstname} {lastname}
          </DetailRow>
          {hasPhone ? (
            <DetailRow icon={<Phone className="h-4 w-4" aria-hidden />}>
              {phone}
            </DetailRow>
          ) : null}
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Billing Address</h3>
          <DetailRow icon={<MapPin className="h-4 w-4" aria-hidden />}>
            <div className="space-y-1">
              <div>{address}</div>
              {hasAddress2 ? <div>{address2}</div> : null}
              <div>
                {city}, {postal}
              </div>
              <div>{country}</div>
            </div>
          </DetailRow>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Shipping Address</h3>
          <p className="text-sm text-muted-foreground">
            Same as billing address
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderInformation;
