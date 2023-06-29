import stream from 'stream';
import type { Bucket } from '@google-cloud/storage';
import path from 'path';

import { GCS_KEY_NAME } from '~/utils/get_env_source';

interface IStreamFileUpload {
  (
    bucket: Bucket,
    { filename, buffer }: { buffer: Buffer, filename: string },
  ): Promise<boolean | any>
}

const getGCSKeyPath = () => path.resolve(__dirname, '../', GCS_KEY_NAME);

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

export { streamFileUpload, getGCSKeyPath };