import { useState } from 'react';

import SimpleModal from '~/components/SimpleModal';

export const links = () => [];

export default function ProductLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-8'>
      <p className='text-sm text-slate-500'>
        Product layout temporarily reduced to a single dialog test.
      </p>
      <p className='text-xs text-slate-500'>
        Modal open state: <span className='font-semibold'>{open ? 'true' : 'false'}</span>
      </p>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50'
      >
        Open test dialog
      </button>

      <SimpleModal open={open} onClose={() => setOpen(false)} title='Pure React modal test'>
        <p className='text-sm text-slate-600'>
          This modal uses the handcrafted component in app/components/SimpleModal to eliminate library side-effects.
        </p>
      </SimpleModal>
    </div>
  );
}
