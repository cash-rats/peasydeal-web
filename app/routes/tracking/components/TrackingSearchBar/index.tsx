import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

interface ITrackingSearchBar {
  query?: string;
  onSearch?: (orderID: string, evt: MouseEvent<HTMLButtonElement>) => void;
  onClear?: () => void;
}

function TrackingSearchBar({
  query = '',
  onSearch = () => { },
  onClear = () => { },
}: ITrackingSearchBar) {
  const [orderID, setOrderID] = useState(query);
  useEffect(() => {
    setOrderID(query);
  }, [query]);

  const handleClear = () => {
    setOrderID('');
    onClear();
  };

  return (
    <div className='w-full bg-gray-50 px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-3xl flex-wrap items-center gap-3 rounded-full bg-white p-2 shadow-sm ring-1 ring-gray-200'>
        <div className='relative flex-1 min-w-[220px]'>
          <Input
            className='h-11 rounded-full border border-transparent bg-transparent px-4 pr-12 text-base text-gray-800 shadow-none focus-visible:ring-0'
            placeholder='Search order by id.'
            name='query'
            value={orderID}
            onChange={(evt) => {
              setOrderID(evt.target.value);
            }}
          />
          <button
            type='button'
            aria-label='Clear search input'
            onClick={handleClear}
            className='absolute inset-y-0 right-3 flex items-center text-gray-400 transition hover:text-gray-600'
          >
            <IoMdClose className='h-5 w-5' />
          </button>
        </div>

        <Button
          type='submit'
          className='h-11 rounded-full bg-[#d02e7d] px-8 text-base font-semibold text-white transition hover:bg-[#b71b67]'
          onClick={(evt) => onSearch(orderID, evt)}
        >
          search
        </Button>
      </div>
    </div>
  );
};

export default TrackingSearchBar;
