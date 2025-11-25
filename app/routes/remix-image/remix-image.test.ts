import { expect, test } from 'vitest';
import sharp from 'sharp';

test.skip('fetch image buffer from peasydeal cdn', async () => {
  const imgsrc = 'https://storage.googleapis.com/peasydeal/product-images/d6752c690c8642208c7f32777f8217.png';
  const image = await fetch(imgsrc);
  const imageBuffer = Buffer.from(await image.arrayBuffer());

  const resizedImage = await sharp(imageBuffer)
    .resize(320, 320, {
      fit: 'fill',
    })
    .webp({
      lossless: true,
      quality: 80,
    })
    .toBuffer();

  expect(resizedImage.length).toBeGreaterThan(0);
});
