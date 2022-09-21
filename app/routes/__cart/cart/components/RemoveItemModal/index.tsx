import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

interface RemoveItemModalProps {
  open: boolean;

  itemName: string;

  onClose: () => void;

  onResult: (res: boolean) => void;
}

export default function RemoveItemModal({
  open = false,
  itemName,
  onClose,
  onResult,
}: RemoveItemModalProps) {
  const handleClickYes = () => onResult(true);
  const handleClickCancel = () => {
    onClose();
    onResult(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Remove this item from cart?
        </Typography>

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {itemName}
        </Typography>

        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '1rem',
          justifyContent: 'flex-end',
        }}>
          <Button
            variant='contained'
            onClick={handleClickYes}
          >
            yes
          </Button>

          <Button
            onClick={handleClickCancel}
          >
            cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
