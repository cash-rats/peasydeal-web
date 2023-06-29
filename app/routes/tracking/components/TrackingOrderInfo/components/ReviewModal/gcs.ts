import { Storage } from '@google-cloud/storage';
import type { Bucket } from '@google-cloud/storage';

import { NODE_ENV, GCS_BUCKET_NAME } from '~/utils/get_env_source';
import { getGCSKeyPath } from '~/lib/gcs';

const GCS_KEY_NAME = 'peasydeal-master-key.json';
// const GCS_BUCKET_NAME = 'peasydeal';

let storage: Storage | null | undefined = undefined;
let bucket: Bucket | null | undefined = undefined;

if (
  NODE_ENV === 'production' ||
  NODE_ENV === 'staging' ||
  NODE_ENV === 'development'
) {
  console.log('debug *&^@#$', GCS_BUCKET_NAME, getGCSKeyPath());
  storage = new Storage({
    keyFilename: getGCSKeyPath(),
  });

  bucket = storage.bucket(GCS_BUCKET_NAME);
} else {
  /* Ignore gcs auth on development env */
}

export { storage, bucket };