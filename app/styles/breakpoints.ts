// For example: if screen size is more than 1440px, display corresponding style for labtopL accordingly


const phoneTop = 599

const tabletPortraitBottom = 600;
const tabletPortraitTop = 767;

const largeTabletBottom = 991;

const normalScreenBottom = 768;
const normalScreenTop = 1199;

const desktopBottom = 1200;


export const breakPoints = {
  phoneTop,

  tabletPortraitTop,
  tabletPortraitBottom,
  largeTabletBottom,

  normalScreenTop,
  normalScreenBottom,

  desktopBottom,
};

export const devices = {
  phoneOnly: '(max-width:599px)',
  tabletPortraitUp: '(min-width:600px)',
  tabletLandscapeUp: '(min-width:900px)',
  normalScreen: '(min-width:768px)',
  desktopUp: '(min-width:1200px)',
  bigDesktopUp: '(min-width:1800px)',
};

export const ranges = {
  headerRwd: `(max-width: ${largeTabletBottom}px)`,
  phoneOnly: `(max-width:${phoneTop}px)`,
  tabletPortrait: `(min-width:600px) and (max-width:767px)`,
  normalScreen: `(min-width:${normalScreenBottom}px) and (max-width:${normalScreenTop}px)`,
  desktopUp: `(min-width:${desktopBottom}px)`,
};

