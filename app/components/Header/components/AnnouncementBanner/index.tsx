import IconButton from '@mui/material/IconButton';
import { AiOutlineClose } from 'react-icons/ai';

interface AnnouncementBannerProps {
  open?: boolean;
  onClose?: () => void,
}

function AnnouncementBanner({ open = true, onClose = () => { } }: AnnouncementBannerProps) {
  const handleClose = () => onClose();

  return (
    open
      ? (
        <div className={`
          flex justify-center items-center
          py-3 w-full bg-[#D02E7D]
        `}>
          <span className={`
            text-xs 499:text-base text-white font-bold md:text-lg
          `}>
            Grand Launch Sale: FREE Shipping on order £9.99+
          </span>
          <div className="absolute right-1">
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
