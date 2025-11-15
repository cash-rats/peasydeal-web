import { Link } from 'react-router';
import SimpleModal from '~/components/SimpleModal';
import { Button } from '~/components/ui/button';
import { BsCalendar2Check } from 'react-icons/bs';
import { TbTruckReturn } from 'react-icons/tb';
import { HiOutlineInformationCircle } from 'react-icons/hi';

interface ReturnPolicyModalParams {
  isOpen: boolean;
  onClose?: () => void;
}

function ReturnPolicyModal({
  isOpen,
  onClose = undefined,
}: ReturnPolicyModalParams) {
  return (
    <SimpleModal
      open={isOpen}
      title="Return policy"
      onClose={onClose}
      showCloseButton={false}
    >
      <p className='text-sm text-slate-600'>
        We make returns simple so you can shop with confidence.
      </p>

      <div className='space-y-6 text-sm text-slate-600 mt-4'>
        <section className='space-y-2'>
          <div className='flex items-center gap-2 text-slate-900 font-semibold'>
            <BsCalendar2Check className='text-primary' />
            <p>14-day refund window</p>
          </div>
          <p>
            Items that remain in their original condition can be returned
            within 14 days of delivery for a full refund of the purchase
            price.
          </p>
        </section>

        <section className='space-y-2'>
          <div className='flex items-center gap-2 text-slate-900 font-semibold'>
            <TbTruckReturn className='text-primary' />
            <p>Free first return</p>
          </div>
          <p>
            We cover the shipping label for the first return on every order.
            Additional returns on the same order may have shipping or handling
            fees deducted from the refund.
          </p>
        </section>

        <section className='space-y-2'>
          <div className='flex items-center gap-2 text-slate-900 font-semibold'>
            <HiOutlineInformationCircle className='text-primary' />
            <p>Need more details?</p>
          </div>
          <p>
            Review the full policy for packaging tips, refund timelines, and
            localized instructions.
          </p>
        </section>
      </div>

      <div className='mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <Link to='/return-policy' onClick={onClose} className='w-full sm:w-auto'>
          <Button className='w-full text-white'>View full policy</Button>
        </Link>
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
