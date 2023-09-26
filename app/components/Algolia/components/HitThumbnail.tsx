import Image, { MimeType } from 'remix-image';

import { envs } from '~/utils/get_env_source';

interface HitThumbnailImage {
  url: string;
};

function HitThumbnail({ url }: HitThumbnailImage) {
  return (
    <Image
      blurDataURL={`${envs.DOMAIN}/images/placeholder.svg`}
      placeholder='blur'
      placeholderAspectRatio={1}
      loaderUrl='/remix-image'
      options={{
        contentType: MimeType.WEBP,
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