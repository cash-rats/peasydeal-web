
import Box from '@mui/material/Box';
import type { LinksFunction } from '@remix-run/node';
import { AiOutlineCheckCircle } from 'react-icons/ai';

import styles from './styles/ItemAddedModal.css';
import GeneralModal from './index';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface ItemAddedModalProps {
  open?: boolean;
  onClose?: () => void;
}

const ItemAddedModal = ({ open = false, onClose }: ItemAddedModalProps) => {
  return (
    <GeneralModal open={open} onClose={onClose}>
      <div className="ItemAddedModal__wrapper">
        <span><AiOutlineCheckCircle color='#009378' fontSize={60} /></span>
        <p className="ItemAddedModal__message">
          Item added to cart
        </p>
      </div>
    </GeneralModal>
  );
}

export default ItemAddedModal;

