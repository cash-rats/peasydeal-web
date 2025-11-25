export const maskName = (name: string) => {
  const segments = name.split(' ');
  const maskedSegments = segments.map((segment) => {
    const firstChar = segment.charAt(0);
    const restOfChars = segment.slice(1);
    const maskedChars = restOfChars.replace(/./g, '*');
    return firstChar + maskedChars;
  });

  return maskedSegments.join(' ');
};
