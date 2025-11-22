import { AiOutlineClose } from 'react-icons/ai';
import { Button } from '~/components/ui/button';

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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Close announcement banner"
                  className="text-white hover:bg-white/10"
                  onClick={handleClose}
                >
                  <AiOutlineClose className="h-5 w-5" aria-hidden />
                </Button>
              </div>
            )
          }
        </div>
      )
      : null
  );
}

export default AnnouncementBanner;
