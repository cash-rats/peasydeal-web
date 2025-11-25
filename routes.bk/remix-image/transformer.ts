import sharp from 'sharp';
import type { TransformOptions } from '~/lib/react-router-image';

import { uploadToR2 } from './r2';
import { MimeType, fileExtensionResolver } from './mimes';
import { envs } from '~/utils/env';

//  https://github.com/remix-run/remix/discussions/2905
export const supportedInputs = new Set([
  MimeType.JPEG,
  MimeType.JPG,
  MimeType.PNG,
  MimeType.GIF,
  MimeType.WEBP,
  MimeType.TIFF,
]);

export const supportedOutputs = new Set([
  MimeType.JPEG,
  MimeType.JPG,
  MimeType.PNG,
  MimeType.GIF,
  MimeType.WEBP,
  MimeType.TIFF,
]);

type CustomTransformer = {
  name: string;
  supportedInputs: Set<MimeType>;
  supportedOutputs: Set<MimeType>;
  fallbackOutput: MimeType;
  transform: (input: {
    url: string;
    data: Uint8Array;
    contentType: MimeType;
  }, output: Required<TransformOptions>) => Promise<Uint8Array>;
}

const getFilenameFromPath = (url: string) => {
  return url.substring(url.lastIndexOf('/') + 1, url.length);
};

const composeObjectName = ({ width, height, filename, extension }: { width: number, height: number, filename: string, extension: string }) => {
  return `${extension}/w${width}_h${height}/${filename}`;
};

const transformer: CustomTransformer = {
  name: 'customTransformer',
  supportedInputs: supportedInputs,
  supportedOutputs: supportedOutputs,
  fallbackOutput: MimeType.PNG,
  transform: async (
    {
      url,
      data,
    },
    {
      contentType: outputContentType,
      width,
      height,
      fit,
      position,
      background,
      quality,
      compressionLevel,
      loop,
      delay,
      blurRadius,
      rotate,
      flip,
      crop,
    }
  ) => {
    const fixedBackground = {
      r: background[0],
      g: background[1],
      b: background[2],
      alpha: background[3],
    };

    const image = sharp(data, {
      animated: true,
    });

    image.ensureAlpha(1);

    if (crop) {
      image.extract({
        left: crop.x,
        top: crop.y,
        width: crop.width,
        height: crop.height,
      });
    }

    if (width != null || height != null) {
      image.resize(width, height, {
        fit,
        position,
        background: fixedBackground,
      });
    }

    if (flip) {
      if (flip === "horizontal" || flip === "both") {
        image.flop();
      }
      if (flip === "vertical" || flip === "both") {
        image.flip();
      }
    }

    if (rotate && rotate != 0) {
      image.rotate(rotate, {
        background: fixedBackground,
      });
    }

    if (blurRadius && blurRadius > 0) {
      image.blur(blurRadius);
    }

    const transformedImageBuffer = await image
      .jpeg({
        quality,
        progressive: true,
        force: outputContentType === MimeType.JPEG,
      })
      .png({
        progressive: true,
        compressionLevel,
        force: outputContentType === MimeType.PNG,
      })
      .gif({
        loop,
        delay,
        force: outputContentType === MimeType.GIF,
      })
      .webp({
        quality,
        force: outputContentType === MimeType.WEBP,
      })
      .tiff({
        quality,
        force: outputContentType === MimeType.TIFF,
      })
      .avif({
        quality,
        force: outputContentType === MimeType.AVIF,
      })
      .toBuffer();

    const outputExt = fileExtensionResolver.get(outputContentType);

    if (width && height && outputExt) {
      const filename = getFilenameFromPath(url);
      const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
      const objectName = composeObjectName({
        extension: outputExt,
        filename: `${filenameWithoutExt}${outputExt}`,
        width,
        height,
      });

      /* Ignore r2 auth on development env */
      if (envs.NODE_ENV === 'production' || envs.NODE_ENV === 'staging') {
        try {
          await uploadToR2({
            buffer: transformedImageBuffer,
            filename: objectName,
            contentType: outputContentType,
          });
        } catch (error) {
          console.error('Error uploading to R2:', error);
        }
      }
    }

    return new Uint8Array(transformedImageBuffer);
  },
};

export default transformer;
