import type { LinksFunction } from 'react-router';

import PicsCarousel, { links as PicsCarouselLinks } from '~/components/Carousel';
import type { CarouselImage } from '~/components/Carousel/types';
import AboutThisProduct from '../AboutThisProduct';
import type { ProductImg, } from '../../types';

export const links: LinksFunction = () => {
  return [
    ...PicsCarouselLinks(),
  ];
}

interface ProductDetailSectionProps {
  title?: string;
  description?: string;

  // Image carousel will scroll to the variation image based on the
  // selected variation. Thus, we'll need to know corresponding variation UUID
  // to find the DOM to scroll to.
  selectedVariationUUID?: string;
  sharedPics: ProductImg[];
  variationPics: ProductImg[];
  mainPicUrl?: string;
  previewImage?: ProductImg | null;
}

function ProductDetailSection({
  title = '',
  description = '',
  selectedVariationUUID = '',
  sharedPics = [],
  mainPicUrl,
  previewImage = null,
}: ProductDetailSectionProps) {
  const combinedImages: CarouselImage[] = [];

  // Push shared pics to combined images.
  if (mainPicUrl) {
    combinedImages.push({
      url: mainPicUrl,
      variation_uuid: '',
    });
  }
  combinedImages.push(...sharedPics);

  return (
    <div className="w-full mb-4">
      {/* Image container */}
      <div className="w-full">
        <PicsCarousel
          title={title}
          sharedImages={combinedImages}
          selectedVariationUUID={selectedVariationUUID}
          previewImage={previewImage || undefined}
        />
      </div>

      <div className="mt-10 mx-0 md:mx-2 hidden md:block">
        <AboutThisProduct descriptionHtml={description} />
      </div>
    </div>
  );
};

export default ProductDetailSection
