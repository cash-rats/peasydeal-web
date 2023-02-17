import sharp from 'sharp';
import type { TransformOptions } from 'remix-image';
import type { LoaderFunction } from "@remix-run/server-runtime";
import { imageLoader, MemoryCache } from 'remix-image/server';

// Add support for image/jpg
enum MimeType {
  JPG = 'image/jpg',
  SVG = "image/svg+xml",
  JPEG = "image/jpeg",
  PNG = "image/png",
  GIF = "image/gif",
  WEBP = "image/webp",
  BMP = "image/bmp",
  TIFF = "image/tiff",
  AVIF = "image/avif"
};

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

const customTransformer: CustomTransformer = {
  name: 'customTransformer',
  supportedInputs: supportedInputs,
  supportedOutputs: supportedOutputs,
  fallbackOutput: MimeType.PNG,
  transform: async (
    { data },
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

    const result = await image
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

    return new Uint8Array(result);
  },
};

const config = {
  selfUrl: "http://localhost:3000",
  cache: new MemoryCache(),
  transformer: customTransformer,
};

export const loader: LoaderFunction = ({ request }) => {
  return imageLoader(config, request);
};