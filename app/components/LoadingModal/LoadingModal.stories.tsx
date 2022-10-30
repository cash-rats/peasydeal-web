import type { ComponentMeta } from '@storybook/react';

import LoadingModal from './index';

export default {
  title: 'Loading Modal',
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

const Basic = Template.bind({});
export { Basic };