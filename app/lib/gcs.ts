import stream from 'stream';
import type { Bucket } from '@google-cloud/storage';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

import { envs } from '~/utils/env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface IStreamFileUpload {
  (
    bucket: Bucket,
    { filename, buffer }: { buffer: Buffer, filename: string },
  ): Promise<boolean | any>
}

const getGCSKeyPath = () => resolve(__dirname, '../', envs.GCS_KEY_NAME);

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
