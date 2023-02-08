import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import { AiOutlineClose } from 'react-icons/ai';

interface AnnouncementBannerProps {
  onClose: () => void,
}

function AnnouncementBanner({ onClose = () => { } }: AnnouncementBannerProps) {
  const [open, setOpen] = useState<boolean>(true);
  const handleClose = () => {
    setOpen(false);
    onClose();
  }

  return (
    open
      ? (
        <div className="
        flex justify-center items-center
        h-[48px] bg-[#D02E7D] z-10
        relative
      "
        >
          <span className="text-white font-bold text-xl">
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