import type { FileUpload } from '@remix-run/form-data-parser';

import type { MimeType } from '~/utils/mimes';
import { streamFileUpload } from '~/lib/gcs';

import { retrieveDataToUint8Array } from './utils';
import { supportedContentType } from './content_types';
import { bucket } from './gcs';

const uploadHandler = async (fileUpload: FileUpload) => {
  if (fileUpload.fieldName !== 'images') {
    return undefined;
  }

  const uint8Arr = await retrieveDataToUint8Array(fileUpload.stream());
  const buffer = Buffer.from(uint8Arr);
  const ct = fileUpload.type as MimeType;

  if (!supportedContentType.has(ct)) {
    throw new Error(`unsupported file content type ${fileUpload.type}`);
  }

  const objectPath = `review_images/${fileUpload.name}`;

  if (bucket) {
    // do not wait for the file to upload.
    streamFileUpload(bucket, {
      buffer,
      filename: objectPath,
    });
  }

  return objectPath;
};

export { uploadHandler };