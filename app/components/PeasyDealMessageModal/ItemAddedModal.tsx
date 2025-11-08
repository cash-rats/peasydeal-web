
import type { LinksFunction } from '@remix-run/node';
import { AiFillCheckCircle } from 'react-icons/ai';

import styles from './styles/ItemAddedModal.css?url';
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
        <span><AiFillCheckCircle color='white' fontSize={60} /></span>
        <p className="ItemAddedModal__message">
          Item added to cart
        </p>
      </div>
    </GeneralModal>
  );
}

export default ItemAddedModal;

