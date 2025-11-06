import { Storage } from '@google-cloud/storage';
import type { Bucket } from '@google-cloud/storage';

import { envs } from '~/utils/env';
import { getGCSKeyPath } from '~/lib/gcs';

let storage: Storage | null | undefined = undefined;
let bucket: Bucket | null | undefined = undefined;

if (
  envs.NODE_ENV === 'production' ||
  envs.NODE_ENV === 'staging' ||
  envs.NODE_ENV === 'development'
) {
  storage = new Storage({
    keyFilename: getGCSKeyPath(),
  });

  bucket = storage.bucket(envs.GCS_BUCKET_NAME);
} else {
  /* Ignore gcs auth on development env */
}

export { storage, bucket };