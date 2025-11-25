import stream from 'stream';
import { Storage } from '@google-cloud/storage';
import type { Bucket } from '@google-cloud/storage';
import path from 'path';

import { envs } from '~/utils/env';

const GCS_KEY_NAME = 'peasydeal-master-key.json';
const GCS_BUCKET_NAME = 'peasydeal2';

let storage: Storage | null | undefined = undefined;
let bucket: Bucket | null | undefined = undefined;

if (
  envs.NODE_ENV === 'production' ||
  envs.NODE_ENV === 'staging'
) {
  storage = new Storage({ keyFilename: path.resolve(__dirname, '../', GCS_KEY_NAME) });
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
