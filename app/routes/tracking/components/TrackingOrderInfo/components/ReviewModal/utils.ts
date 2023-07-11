
async function retrieveDataToUint8Array(asyncIterable: AsyncIterable<Uint8Array>) {
  const dataArray = [];

  for await (const uint8Array of asyncIterable) {
    dataArray.push(uint8Array);
  }

  const totalLength = dataArray.reduce((length, arr) => length + arr.length, 0);
  const mergedArray = new Uint8Array(totalLength);

  let offset = 0;
  for (const uint8Array of dataArray) {
    mergedArray.set(uint8Array, offset);
    offset += uint8Array.length;
  }

  return mergedArray;
}


export { retrieveDataToUint8Array };