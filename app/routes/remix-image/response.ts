export const imageResponse = (
  file: Uint8Array,
  status: number,
  contentType: string,
  cacheControl: string
): Response =>
  new Response(file, {
    status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
    },
  });