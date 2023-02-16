import type { LinksFunction } from '@remix-run/node';

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

import PicsCarousel, { links as PicsCarouselLinks } from '~/components/Carousel';

import styles from './styles/ProductDetailSection.css';

export const links: LinksFunction = () => {
	return [
		...PicsCarouselLinks(),
		{ rel: 'stylesheet', href: styles },
	];
}

interface ProductDetailSectionProps {
	description?: string;
	pics: string[],
	title?: string,
}

function ProductDetailSection({
	title = '',
	description = '',
	pics = [],
}: ProductDetailSectionProps) {
	return (
		<div className="product-detail">
			{/* Image container */}
			<div className="product-detail-img-container">
				<PicsCarousel
					title={title}
					images={pics}
				/>
			</div>

			<div className="peasydeal-v1 mt-10 mx-0 md:mx-2 flex flex-col w-full">
				{/* <Accordion className='flex md:hidden' allowMultiple>
					<AccordionItem className="
						w-full max-w-[calc(100vw-2rem)] mx-4
						 border-[#efefef]
					">
						<AccordionButton >
							<h3 className='text-xl my-3 mr-auto'>About this product</h3>
							<AccordionIcon />
						</AccordionButton>

						<AccordionPanel pb={4} display="flex">
							<div className='w-full overflow-scroll'>
								<div dangerouslySetInnerHTML={{ __html: description || '' }} />
							</div>
						</AccordionPanel>
					</AccordionItem>
				</Accordion> */}

				<div className='hidden md:flex md:flex-col mr-4'>
					<h3 className='text-3xl mb-4 md:mb-6'>About this product</h3>
					{/* TODO dangerous render html */}
					<div dangerouslySetInnerHTML={{ __html: description || '' }} />
				</div>
			</div>
		</div>
	);
};

export default ProductDetailSection
