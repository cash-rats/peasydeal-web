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
    <div className='w-full px-5 py-5'>
      <div className='mx-auto flex w-full max-w-3xl flex-wrap items-stretch gap-3'>
        <div className='relative flex-1 min-w-[220px]'>
          <Input
            className='h-12 rounded-3xl border border-[#d9d9d9] bg-white pr-10 text-base text-[#333]'
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
          variant='ghost'
          type='submit'
          className='h-12 rounded-3xl !bg-[#d02e7d] px-10 text-base font-semibold !text-white hover:!bg-[#b71b67]'
          onClick={(evt) => onSearch(orderID, evt)}
        >
          search
        </Button>
      </div>
    </div>
  );
};

export default TrackingSearchBar;
