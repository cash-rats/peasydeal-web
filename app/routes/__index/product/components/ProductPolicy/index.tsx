import { Link } from '@remix-run/react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box
} from '@chakra-ui/react';

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
        allowToggle
        variant="custom"
      >
        <AccordionItem className='lg:hidden'>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' py='3' px='2' textAlign='left'>
                <span className='font-poppins text-xl font-medium'>
                  <b>About this product</b>
                </span>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className='px-6'>
            <div className='pd-product-detail'>
              <div className='w-full overflow-scroll'>
                <div dangerouslySetInnerHTML={{ __html: productDetail?.description || '' }} />
              </div>
            </div>
          </AccordionPanel>
        </AccordionItem>


        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' py='3' px='2' textAlign='left'>
                <span className='font-poppins text-xl font-medium'>
                  Shipping Cost
                </span>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className='text-xl px-6'>
            Shipping costs are based on the weight of your order and the delivery method. Once at the checkout screen, shipping charges will be displayed. FREE Shipping on order £19.99+
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' py='3' px='2' textAlign='left'>
                <span className='font-poppins text-xl font-medium'>
                  Delivery Location
                </span>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className='text-xl px-6'>
          Items offered on peasydeal.com website are available for delivery to addresses in the following Islands: <b>UK Mainland, Scottish Highlands and Islands, Isle of Man Northern Ireland islands</b> in United Kingdom.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' py='3' px='2' textAlign='left'>
                <span className='font-poppins text-xl font-medium'>
                  Free Return & Refund
                </span>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className='text-xl px-6'>
            You have our 100% money back guarantee. If you're not fully satisfied, you may return your unused item in its original condition and packaging within 14 days of receipt for a full refund. Please see our <Link to='/return-policy' className='text-blue-500'>Return &amp; Policy</Link> for more details.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' py='3' px='2' textAlign='left'>
                <span className='font-poppins text-xl font-medium'>
                  How long will it take to get my order?
                </span>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className='text-xl px-6'>
            Unless there are exceptional circumstances, we make every effort to fulfill your order within 12 business days of the date of your order. Business day mean Monday to Friday, except holidays. Please note we do not ship on <b>Weekend & Public Holidays</b>. Date of delivery may vary due to carrier shipping practices, delivery location, method of delivery and the items ordered. Products may also be delivered in separate shipments.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
		</div>
	);
};

export default ProductPolicy
