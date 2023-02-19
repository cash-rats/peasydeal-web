import ImageHalf from './images/latest_new_deal@half.png';
import Image1x from './images/latest_new_deal.png';
import Image2x from './images/latest_new_deal@2x.png';
import Image3x from './images/latest_new_deal@3x.png';

interface IImageBanner {
  name: string;
};

const ImageBanner = ({ name }: IImageBanner ) => {
  return (
    <>
      <picture>
        <source
          srcSet={`
            ${Image2x} 2x,
          `}
          media="(min-width: 1200px)"
        />
        <source
          srcSet={`
            ${Image1x} 1x,
          `}
          media="(min-width: 640px)"
        />
        <source
          srcSet={`
            ${ImageHalf},
          `}
          media="(min-width: 320px)"
        />
        <img
          srcSet={`${Image1x} 1x, ${Image2x} 2x, ${Image3x} 3x`}
          src={Image1x}
          className="w-full"
          alt={name}
        />
      </picture>
    </>
  );
}

export default ImageBanner;
