import IconButton from '@mui/material/IconButton';
import { AiOutlineClose } from 'react-icons/ai';

interface AnnouncementBannerProps {
  open?: boolean;
  onClose?: () => void;
  hideCloseButton?: boolean;
}

function AnnouncementBanner({ open = true, onClose = () => {}, hideCloseButton = false }: AnnouncementBannerProps) {
  const handleClose = () => onClose();

  return (
    open
      ? (
        <div className={`
          flex justify-center items-center
          py-3 w-full
          relative
          z-40
        `}
          style={{
            background: 'linear-gradient(90deg, rgba(35,0,40,1) 0%, rgba(161,25,152,1) 35%, rgba(21,145,171,1) 100%)',
          }}
        >
          <span className={`
            text-xs 499:text-base text-white font-bold md:text-lg
          `}>
            FREE Shipping on order £19.99+
          </span>
          {
            hideCloseButton ? null : (
              <div className="absolute right-1">
                <IconButton onClick={handleClose}>
                  <AiOutlineClose fontSize={20} color='#fff' />
                </IconButton>
              </div>
            )
          }
        </div>
      )
      : null
  );
}

export default AnnouncementBanner;
