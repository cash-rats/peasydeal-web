import { OptimizedImage as Image } from '~/components/OptimizedImage';

import { envs } from '~/utils/env';

interface HitThumbnailImage {
  url: string;
};

function HitThumbnail({ url }: HitThumbnailImage) {
  return (
    <Image
      blurDataURL={`${envs.DOMAIN}/images/placeholder.svg`}
      placeholder='blur'
      placeholderAspectRatio={1}
      options={{
        contentType: 'image/webp',
        fit: 'contain',
      }}
      src={url}
      responsive={[{
        size: {
          width: 30,
          height: 30,
        }
      }]}
    />
  )
}

export default HitThumbnail;