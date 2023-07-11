import stream from 'stream';
import { Storage } from '@google-cloud/storage';
import type { Bucket } from '@google-cloud/storage';
import path from 'path';

import { NODE_ENV } from '~/utils/get_env_source';

const GCS_KEY_NAME = 'peasydeal-master-key.json';
const GCS_BUCKET_NAME = 'peasydeal';

let storage: Storage | null | undefined = undefined;
let bucket: Bucket | null | undefined = undefined;

if (
  NODE_ENV === 'production' ||
  NODE_ENV === 'staging' ||
  NODE_ENV === 'development'
) {
  storage = new Storage({
    keyFilename: path.resolve(__dirname, '../', GCS_KEY_NAME),
  });

  bucket = storage.bucket(GCS_BUCKET_NAME);
} else {
  /* Ignore gcs auth on development env */
}


interface IStreamFileUpload {
  (
    bucket: Bucket,
    { filename, buffer }: { buffer: Buffer, filename: string },
  ): Promise<boolean | any>
}

const streamFileUpload: IStreamFileUpload = (bucket, { filename, buffer }) => {
  const passthroughStream = new stream.PassThrough();
  passthroughStream.write(buffer);
  passthroughStream.end();
  const gcsFile = bucket.file(filename);

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

export { storage, bucket, streamFileUpload };