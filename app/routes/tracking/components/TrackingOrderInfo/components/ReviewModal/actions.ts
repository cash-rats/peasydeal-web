import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node';

import { streamFileUpload } from '~/lib/gcs';

import { bucket } from './gcs';
import { retrieveDataToUint8Array } from './utils';

// 1. Upload review images
//     - allow only jpeg & png image upload
// 2. Submit review info
const reviewProduct = async (request: Request) => {
  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      if (name !== 'images') {
        return undefined;
      }

      const uint8Arr = await retrieveDataToUint8Array(data);
      const buffer = Buffer.from(uint8Arr);

      console.log('debug uploadHandler 1', contentType);

      // `review_images/{ IMAGE_NAME }.{EXT}`
      if (bucket) {
        await streamFileUpload(bucket, {
          buffer,
          filename: `review_images/testing.jpeg`,
        });
      }
      return 'hello baby';
    },
    unstable_createMemoryUploadHandler(),
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  console.log('debug formData', formData);
};

export { reviewProduct };