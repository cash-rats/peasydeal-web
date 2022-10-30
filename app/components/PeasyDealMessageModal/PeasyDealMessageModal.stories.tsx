
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
    <ItemAddedModal />
  );
}
