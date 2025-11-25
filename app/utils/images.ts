type ProductImageLike = string | { url?: string | null } | null | undefined;

type PickMainImageParams = {
  mainImg?: ProductImageLike;
  sharedImgs?: ProductImageLike[];
  variationImgs?: ProductImageLike[];
};

const pickMainImage = ({
  mainImg,
  sharedImgs = [],
  variationImgs = [],
}: PickMainImageParams): ProductImageLike => {
  const normalizedSharedImages = Array.isArray(sharedImgs) ? sharedImgs : [];
  const normalizedVariationImages = Array.isArray(variationImgs) ? variationImgs : [];

  if (mainImg) return mainImg;

  if (normalizedSharedImages.length > 0) {
    return normalizedSharedImages[0];
  }

  if (normalizedVariationImages.length > 0) {
    return normalizedVariationImages[0];
  }

  return null;
};

export { pickMainImage };
