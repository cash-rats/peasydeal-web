export enum MimeType {
  JPG = 'image/jpg',
  SVG = "image/svg+xml",
  JPEG = "image/jpeg",
  PNG = "image/png",
  GIF = "image/gif",
  WEBP = "image/webp",
  BMP = "image/bmp",
  TIFF = "image/tiff",
  AVIF = "image/avif"
};

export const fileExtensionResolver = new Map(Object.entries(
  {
    [MimeType.JPG]: '.jpg',
    [MimeType.SVG]: '.svg',
    [MimeType.WEBP]: '.webp',
    [MimeType.JPEG]: '.jpeg',
    [MimeType.PNG]: '.png',
    [MimeType.GIF]: '.gif',
    [MimeType.BMP]: '.bmp',
    [MimeType.TIFF]: '.tiff',
    [MimeType.AVIF]: '.avif',
  }
));
