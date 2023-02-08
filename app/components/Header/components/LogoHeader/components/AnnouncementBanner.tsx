import IconButton from '@mui/material/IconButton';
import { AiOutlineClose } from 'react-icons/ai';

import useCheckScrolled from '~/hooks/useCheckScrolled';

interface AnnouncementBannerProps {
  open?: boolean;
  onClose?: () => void,
}

function AnnouncementBanner({ open = true, onClose = () => { } }: AnnouncementBannerProps) {
  const [scrolled] = useCheckScrolled()
  const handleClose = () => onClose();

  return (
    open
      ? (
        <div className={`
        flex justify-center items-center
        h-[48px] w-full bg-[#D02E7D]
        ${scrolled ? 'fixed' : 'relative'} top-0
      `}
        >
          <span className="text-xs 499:text-base text-white font-bold md:text-xl">
            PEASYDEAL Launch Sale: FREE Shipping on order £9.99+
          </span>
          <div className="absolute right-0">
            <IconButton onClick={handleClose}>
              <AiOutlineClose fontSize={20} color='#fff' />
            </IconButton>
          </div>
        </div>
      )
      : null
  );
}

export default AnnouncementBanner;