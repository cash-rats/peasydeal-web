import { TrackOrder } from './types';

/*
Name masking:
  Huang Chi Han ---> H***** C** H**
*/
const maskName = (name: string) => {
  const segments = name.split(" ");
  const maskedSegments = segments.map(segment => {
    const firstChar = segment.charAt(0);
    const restOfChars = segment.slice(1);
    const maskedChars = restOfChars.replace(/./g, "*");
    return firstChar + maskedChars;
  });

  return maskedSegments.join(" ");
}

/*
Address masking:

Keep 3 chars at the front and 3 chars at the end.
However, we'll output the same length of address regardless
of the length of the real address.

27b Low Friar Street NEWCASTLE UPON TYNE NE1 5UE
27b **** **** **** ***** 5UE
*/
const maskAddress = (address: string) => {
  // Only the first and last segment remains the same legnth
  let firstSeg = address.substring(0, address.indexOf(' '));
  let lastSeg = address.substring(address.lastIndexOf(' ') + 1, address.length);

  if (firstSeg.length > 3) {
    const origSeg = firstSeg.slice(0, 3);
    const restOfChars = firstSeg.slice(3);
    const maskedChars = restOfChars.replace(/./g, '*');
    firstSeg = `${origSeg}${maskedChars}`;
  }

  if (lastSeg.length > 3) {
    const maskedChars = lastSeg
      .slice(
        0,
        lastSeg.length - 3,
      ).replace(/./g, '*');

    // abcdef --> len = 6
    const origSeg = lastSeg.slice(lastSeg.length - 3);
    lastSeg = `${maskedChars}${origSeg}`
  }


  const fakeSegments = [];
  for (let i = 0; i < 4; i++) {
    fakeSegments.push('*****');
  }

  const fakeMiddlePart = fakeSegments.join(' ');

  return `${firstSeg} ${fakeMiddlePart} ${lastSeg}`;
};

const normalizeTrackingOrder = (trackOrder: TrackOrder): TrackOrder => {
  const address = `${trackOrder.address} ${trackOrder.address2} ${trackOrder.city} ${trackOrder.postalcode} ${trackOrder.country}`;

  return {
    ...trackOrder,
    display_name: maskName(trackOrder.contact_name),
    display_address: maskAddress(address.trim()),

    // Hide the confidential data.
    address: '',
    address2: '',
    city: '',
    postalcode: '',
    country: '',
    contact_name: ''
  };
}

export { maskName, maskAddress, normalizeTrackingOrder }