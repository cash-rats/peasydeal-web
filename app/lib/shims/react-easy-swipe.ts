import * as ReactEasySwipe from 'react-easy-swipe';

type ReactEasySwipeComponent = typeof ReactEasySwipe extends { default: infer D }
  ? D
  : never;

const moduleRef = ReactEasySwipe as typeof ReactEasySwipe & {
  default?: ReactEasySwipeComponent;
};

const SwipeComponent =
  moduleRef.default ??
  ((moduleRef as unknown) as ReactEasySwipeComponent);

export default SwipeComponent;
