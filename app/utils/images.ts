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
  if (mainImg) return mainImg;

  if (sharedImgs.length > 0) {
    return sharedImgs[0];
  }

  if (variationImgs.length > 0) {
    return variationImgs[0];
  }

  return null;
};

export { pickMainImage };
