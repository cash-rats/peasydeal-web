import { Link } from 'react-router';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';

interface ReturnPolicyModalParams {
  isOpen: boolean;
  onClose?: () => void;
}

function ReturnPolicyModal({
  isOpen,
  onClose = () => { },
}: ReturnPolicyModalParams) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Return policy</DialogTitle>
          <DialogDescription>
            We make returns simple so you can shop with confidence.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 text-sm text-muted-foreground'>
          <section className='space-y-2'>
            <p className='font-semibold text-foreground'>
              14-day refund window
            </p>
            <p>
              Items that remain in their original condition can be returned
              within 14 days of delivery for a full refund of the purchase
              price.
            </p>
          </section>

          <section className='space-y-2'>
            <p className='font-semibold text-foreground'>Free first return</p>
            <p>
              We cover the shipping label for the first return on every order.
              Additional returns on the same order may have shipping or handling
              fees deducted from the refund.
            </p>
          </section>

          <section className='space-y-2'>
            <p className='font-semibold text-foreground'>Need more details?</p>
            <p>
              Review the full policy for packaging tips, refund timelines, and
              localized instructions.
            </p>
          </section>
        </div>

        <DialogFooter className='flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <Link to='/return-policy' onClick={onClose} className='w-full sm:w-auto'>
            <Button className='w-full'>View full policy</Button>
          </Link>
          <DialogClose asChild>
            <Button variant='ghost' className='w-full sm:w-auto'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReturnPolicyModal;
