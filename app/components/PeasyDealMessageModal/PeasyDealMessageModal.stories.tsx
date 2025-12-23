
import type { ComponentMeta } from '@storybook/react';

import LoadingModal from './LoadingModal';
import ItemAddedModal from './ItemAddedModal';

export default {
  title: 'Modal',
  component: LoadingModal,
} as ComponentMeta<typeof LoadingModal>

const Template = (args) => {
  return (
    <div style={{
      height: '100vh'
    }}>
      <LoadingModal />
    </div>
  )
}

export const Loading = Template.bind({});

export const ItemAdded = () => {
  return (
    <ItemAddedModal
      open
      onClose={() => {}}
      onViewCart={() => {}}
      cartCount={3}
      item={{
        productUUID: 'demo-product',
        variationUUID: 'demo-variation',
        tagComboTags: '',
        image: 'https://via.placeholder.com/160',
        quantity: '1',
        title: 'Nike Air Max 270',
        specName: 'Size: 10.5 | Color: Red',
        salePrice: '129.00',
        retailPrice: '199.00',
        purchaseLimit: '10',
        added_time: Date.now().toString(),
      }}
    />
  );
}
