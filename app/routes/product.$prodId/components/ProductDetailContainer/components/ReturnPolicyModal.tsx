import { Link } from 'react-router';
import SimpleModal from '~/components/SimpleModal';
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
    <SimpleModal
      open={isOpen}
      title="Return policy"
    >
      <p className='text-sm text-slate-600'>
        We make returns simple so you can shop with confidence.
      </p>

      <div className='space-y-6 text-sm text-slate-600 mt-4'>
        <section className='space-y-2'>
          <p className='font-semibold text-slate-900'>
            14-day refund window
          </p>
          <p>
            Items that remain in their original condition can be returned
            within 14 days of delivery for a full refund of the purchase
            price.
          </p>
        </section>

        <section className='space-y-2'>
          <p className='font-semibold text-slate-900'>Free first return</p>
          <p>
            We cover the shipping label for the first return on every order.
            Additional returns on the same order may have shipping or handling
            fees deducted from the refund.
          </p>
        </section>

        <section className='space-y-2'>
          <p className='font-semibold text-slate-900'>Need more details?</p>
          <p>
            Review the full policy for packaging tips, refund timelines, and
            localized instructions.
          </p>
        </section>
      </div>

      <div className='mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <Button
          variant='ghost'
          className='w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </SimpleModal>
  );
}

export default ReturnPolicyModal;
