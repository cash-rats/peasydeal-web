import httpStatus from 'http-status-codes';

export const imageResponse = (
  file: Uint8Array,
  status: number,
  contentType: string,
  cacheControl: string
): Response =>
  new Response(file, {
    status,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
    },
  });

export const badImageResponse = () => {
  const buffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  return new Response(buffer, {
    status: httpStatus.BAD_REQUEST,
    headers: {
      'Cache-Control': 'max-age=0',
      'Content-Type': 'image/gif;base64',
      'Content-Length': buffer.length.toFixed(0),
    },
  });
};
