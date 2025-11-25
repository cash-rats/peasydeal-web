import { Link } from 'react-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion';

interface IProductPolicyProps {
  productDetail: any;
}

const ProductPolicy = ({
  productDetail
}: IProductPolicyProps ) => {
	return (
		<div className="
      flex flex-col justify-start gap-2
      my-4
      w-full max-w-[100%] md:max-w-[100%] lg:max-w-[100%]
    ">
      <Accordion
        type="single"
        collapsible
        className="rounded-lg border border-border divide-y divide-border bg-white"
      >
        <AccordionItem value="about" className="lg:hidden">
          <AccordionTrigger className="px-4 py-3">
            <span className="font-poppins text-xl font-medium">
              <b>About this product</b>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <div className="pd-product-detail">
              <div className="w-full overflow-scroll">
                <div dangerouslySetInnerHTML={{ __html: productDetail?.description || '' }} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shipping">
          <AccordionTrigger className="px-4 py-3">
            <span className='font-poppins text-xl font-medium'>
              Shipping Cost
            </span>
          </AccordionTrigger>
          <AccordionContent className='text-xl px-6'>
            Shipping costs are based on the weight of your order and the delivery method. Once at the checkout screen, shipping charges will be displayed. FREE Shipping on order £19.99+
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery">
          <AccordionTrigger className="px-4 py-3">
            <span className='font-poppins text-xl font-medium'>
              Delivery Location
            </span>
          </AccordionTrigger>
          <AccordionContent className='text-xl px-6'>
          Items offered on peasydeal.com website are available for delivery to addresses in the following Islands: <b>UK Mainland, Scottish Highlands and Islands, Isle of Man Northern Ireland islands</b> in United Kingdom.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="returns">
          <AccordionTrigger className="px-4 py-3">
            <span className='font-poppins text-xl font-medium'>
              Free Return & Refund
            </span>
          </AccordionTrigger>
          <AccordionContent className='text-xl px-6'>
            You have our 100% money back guarantee. If you're not fully satisfied, you may return your unused item in its original condition and packaging within 14 days of receipt for a full refund. Please see our <Link to='/return-policy' className='text-blue-500'>Return &amp; Policy</Link> for more details.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="deliveryTime">
          <AccordionTrigger className="px-4 py-3">
            <span className='font-poppins text-xl font-medium'>
              How long will it take to get my order?
            </span>
          </AccordionTrigger>
          <AccordionContent className='text-xl px-6'>
            Unless there are exceptional circumstances, we make every effort to fulfill your order within 12 business days of the date of your order. Business day mean Monday to Friday, except holidays. Please note we do not ship on <b>Weekend & Public Holidays</b>. Date of delivery may vary due to carrier shipping practices, delivery location, method of delivery and the items ordered. Products may also be delivered in separate shipments.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
		</div>
	);
};

export default ProductPolicy
