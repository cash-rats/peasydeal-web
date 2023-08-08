import { Storage } from '@google-cloud/storage';
import type { Bucket } from '@google-cloud/storage';
import path from 'path';

import { envs } from '~/utils/get_env_source';

const GCS_KEY_NAME = 'peasydeal-master-key.json';
const GCS_BUCKET_NAME = 'peasydeal';

let storage: Storage | null;
let bucket: Bucket | null;

if (
  envs.NODE_ENV === 'production' ||
  envs.NODE_ENV === 'staging'
) {
  storage = new Storage({
    keyFilename: path.resolve(__dirname, '../', GCS_KEY_NAME),
  });

  bucket = storage.bucket(GCS_BUCKET_NAME);
} else {
  /* Ignore gcs auth on development env */
}

export { storage, bucket };