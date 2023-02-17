import path from 'path';
import { Storage } from '@google-cloud/storage';
import stream from 'stream';
import sharp from 'sharp';
import type { TransformOptions } from 'remix-image';

/*
  https://github.com/remix-run/remix/discussions/2905
*/

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

const storage = new Storage({
  keyFilename: path.resolve(__dirname, '../', 'peasydeal-master-key.json')
});


const bucketName = 'peasydeal';

const W_247_H247 = 'webp/w274_h274';

const bucket = storage.bucket(bucketName);


const getFilenameFromPath = (url: string) => {
  return url.substring(url.lastIndexOf('/') + 1, url.length);
}

const streamFileUpload = ({ filename, buffer }: { buffer: Buffer, filename: string }) => {
  const passthroughStream = new stream.PassThrough();
  passthroughStream.write(buffer);
  passthroughStream.end();
  const gcsFile = bucket.file(`${W_247_H247}/${filename}`);

  return new Promise((resolve, reject) => {
    passthroughStream
      .pipe(gcsFile.createWriteStream())
      .on('finish', () => {
        resolve(true);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

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
    // image does not exists in CDN, we'll have to perform image transformation.
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

    const filename = getFilenameFromPath(url);
    const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));

    // TODO: catch/throw error when streaming failed.
    // Do not wait for file streaming to finish.
    streamFileUpload({
      buffer: result,
      filename: `${filenameWithoutExt}.webp`,
    });

    return new Uint8Array(result);
  },
};

export default transformer;