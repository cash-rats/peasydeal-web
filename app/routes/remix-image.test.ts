import { assert, expect, test } from 'vitest';
import sharp from 'sharp';

describe('on the fly image resize', () => {
  test.only('fetch image buffer from peasydeal cdn', async () => {
    const imgsrc = 'https://storage.googleapis.com/peasydeal/product-images/d6752c690c8642208c7f32777f8217.png';
    const image = await fetch(imgsrc);
    const imageBuffer = Buffer.from(await image.arrayBuffer())
    console.log('deubg __dirname', __dirname);
    try {
      const resizedImage = await sharp(imageBuffer)
        .resize(320, 320, {
          fit: 'fill',
        })
        .webp({
          lossless: true,
          quality: 80,
        })
        .toBuffer()

      console.log('resized image', resizedImage)
      // .jpeg()
      // .toFile(`./output.jpeg`);
      // .toBuffer();
    } catch (err) {
      console.log('debug err', err)
    }
  })
})