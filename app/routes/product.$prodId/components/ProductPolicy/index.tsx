import { Link } from 'react-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion';

import { productRichTextClass } from '../productRichTextClass';

interface IProductPolicyProps {
  productDetail: any;
}

const ProductPolicy = ({
  productDetail
}: IProductPolicyProps ) => {
  return (
    <section className="w-full my-6">
      <div className="bg-[#F7F8FA] rounded-2xl p-6 md:p-8">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Frequently Asked Questions
        </h2>

        <Accordion
          type="single"
          collapsible
          className="space-y-3"
        >
          <AccordionItem
            value="about"
            className="lg:hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 text-base md:text-lg font-medium text-gray-800">
              <b>About this product</b>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-0 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-200">
              <div className={productRichTextClass}>
                <div className='w-full overflow-scroll'>
                  <div dangerouslySetInnerHTML={{ __html: productDetail?.description || '' }} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="shipping"
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 text-base md:text-lg font-medium text-gray-800">
              Shipping Cost
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-0 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-200">
              Shipping costs are based on the weight of your order and the delivery method. Once at the checkout screen, shipping charges will be displayed. FREE Shipping on order £19.99+
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="delivery"
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 text-base md:text-lg font-medium text-gray-800">
              Delivery Location
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-0 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-200">
              Items offered on peasydeal.com website are available for delivery to addresses in the following Islands: <b>UK Mainland, Scottish Highlands and Islands, Isle of Man Northern Ireland islands</b> in United Kingdom.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="returns"
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 text-base md:text-lg font-medium text-gray-800">
              Free Return & Refund
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-0 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-200">
              You have our 100% money back guarantee. If you're not fully satisfied, you may return your unused item in its original condition and packaging within 14 days of receipt for a full refund. Please see our <Link to='/return-policy' className='text-blue-500'>Return &amp; Policy</Link> for more details.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="deliveryTime"
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 text-base md:text-lg font-medium text-gray-800">
              How long will it take to get my order?
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-0 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-200">
              Unless there are exceptional circumstances, we make every effort to fulfill your order within 12 business days of the date of your order. Business day mean Monday to Friday, except holidays. Please note we do not ship on <b>Weekend & Public Holidays</b>. Date of delivery may vary due to carrier shipping practices, delivery location, method of delivery and the items ordered. Products may also be delivered in separate shipments.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default ProductPolicy
