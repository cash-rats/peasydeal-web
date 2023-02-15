import { assert, expect, test } from 'vitest';
import sharp from 'sharp';

describe('on the fly image resize', () => {
  test.only('fetch image buffer from peasydeal cdn', async () => {
    const imgsrc = 'https://cdn.peasydeal.com/product-images/b8a806e604cc430f84599ccc1280ec.jpg';
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