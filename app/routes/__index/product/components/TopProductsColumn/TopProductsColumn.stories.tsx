
import { RemixStub as RemixMockSetup } from '~/components/RemixStub';
// import { BrowserRouter } from 'react-router-dom';
import { RemixBrowser } from '@remix-run/react';
import type { Meta, ComponentMeta, StoryFn } from '@storybook/react';

import { createRemixStub } from '~/packages/remix-stubs';
import { useArgs } from '@storybook/client-api';

import TopProductsColumn from './index';
import BannerProduct from './BannerProduct';

let story: Meta<typeof TopProductsColumn> = {
  title: 'Top Products Column',
  component: TopProductsColumn,
  decorators: [
    (Story) => {
      const [args, updateArgs] = useArgs();
      const RemixStub = createRemixStub([
        {
          element: (
            <RemixMockSetup>
              <Story />
            </RemixMockSetup>
          ),
          path: 'product/1234',
          loader: () => { return null },
          action: async ({ request }) => {
            return { top_products: [], super_deal_products: [] };
          },
        }
      ]);

      return (<RemixStub initialEntries={["/post/1234"]} />);
    }
  ],
};

export default story;

const Template: StoryFn<typeof TopProductsColumn> = (args) => {
  return (<TopProductsColumn {...args} />)
};
export const Basic = Template.bind({});

// export default {
//   title: 'Top Products Column',
//   component: TopProductsColumn,
// } as ComponentMeta<typeof TopProductsColumn>;

// const BasicStub = createRemixStub([
//   {
//     element: <TopProductsColumn />,
//     path: '/product/components/TopProductsColumn?index',
//     action: async ({ request }) => {
//       return { top_products: [], super_deal_products: [] };
//     },
//   }
// ]);

// export const Basic = () => {
//   return (
//     <BasicStub
//       initialEntries={['/product/1234']}
//     />
//     // <TopProductsColumn />
//   )
// }


// export const BannerProductBasic = () => (
//   <BannerProduct
//     title='Personalised Auto-Rotating Cordless Hair Curler'
//     image='https://cdn.shopify.com/s/files/1/0583/6590/2907/products/746984.jpg?v=1658301371'
//   />
// );

// export const BannerProductLoading = () => (
//   <BannerProduct
//     loading
//     title='Personalised Auto-Rotating Cordless Hair Curler'
//     image='https://cdn.shopify.com/s/files/1/0583/6590/2907/products/746984.jpg?v=1658301371'
//   />
// );