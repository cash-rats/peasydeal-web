import type { ComponentStory, ComponentMeta } from '@storybook/react';

import MobileSearchDialog from './index';
import type { SuggestItem } from './index';

const handleSearchItems = (query: string): Promise<SuggestItem[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          title: 'iphon 10',
          data: {
            title: 'iphon 10',
            image: '',
            discount: 1,
            productID: 'someid',
          },
        },
        {
          title: 'iphon 14',
          data: {
            title: 'iphon 14',
            image: '',
            discount: 2,
            productID: 'someidgood',
          },
        }

      ]);
    }, 1000);
  });
}

export default {
  title: 'Mobile Search Dialog',
  component: MobileSearchDialog,
} as ComponentMeta<typeof MobileSearchDialog>;

const Template = ({ open, items }) => {
  return (
    <MobileSearchDialog
      open={open}
      items={items}
      onSearchRequest={handleSearchItems}
    />
  )
}

export const Basic = Template.bind({});
Basic.args = {
  open: true,
  items: [
    {
      title: 'Item A',
      data: {
        title: 'Item A',
        productID: 'A',
      }
    },

    {
      title: 'Item B',
      data: {
        title: 'Item B',
        productID: 'B',
      }
    },
  ],
} as { open: boolean, items: SuggestItem[] };

const NotFoundTemplate = ({ open, items }) => {
  const searchItems = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([]);
      }, 700);
    });
  }

  return (
    <MobileSearchDialog
      open={open}
      items={items}
      onSearchRequest={searchItems}
    />
  )
}
export const NotFound = NotFoundTemplate.bind({});
NotFound.args = {
  open: true,
  items: [
    {
      title: 'Item A',
      data: {
        title: 'Item A',
        productID: 'A',
      }
    },

    {
      title: 'Item B',
      data: {
        title: 'Item B',
        productID: 'B',
      }
    },
  ],
} as { open: boolean, items: SuggestItem[] };