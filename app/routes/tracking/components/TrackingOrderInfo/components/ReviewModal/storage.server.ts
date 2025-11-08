import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
} from 'react-router';

import type { MimeType } from '~/utils/mimes';
import { streamFileUpload } from '~/lib/gcs';

import { retrieveDataToUint8Array } from './utils';
import { supportedContentType } from './content_types';
import { bucket } from './gcs';

const uploadHandler = unstable_composeUploadHandlers(
  async ({ name, contentType, data, filename }) => {
    if (name !== 'images') {
      return undefined;
    }

    const uint8Arr = await retrieveDataToUint8Array(data);
    const buffer = Buffer.from(uint8Arr);
    const ct = contentType as MimeType;

    if (!supportedContentType.has(ct)) {
      throw new Error(`unsupported file content type ${contentType}`);
    }

    const objectPath = `review_images/${filename}`;

    if (bucket) {
      // do not wait for the file to upload.
      streamFileUpload(bucket, {
        buffer,
        filename: objectPath,
      });
    }

    return objectPath;
  },
  unstable_createMemoryUploadHandler(),
);

export { uploadHandler };