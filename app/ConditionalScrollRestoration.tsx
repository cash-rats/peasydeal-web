import { useLayoutEffect, useRef } from 'react';
import {
  ScrollRestoration,
  useNavigation,
} from '@remix-run/react';

export default function ConditionalScrollRestoration() {
  const navigation = useNavigation();
  const scrollToTop = useRef<boolean>(false);

  useLayoutEffect(() => {
    console.log('debug redirect 1', navigation.location);
    console.log('debug redirect 2', navigation.location?.state);

    if (
      navigation.location !== undefined &&
      navigation.location.state != undefined &&
      typeof navigation.location.state === "object" &&
      (navigation.location.state as { scrollToTop: boolean }).scrollToTop === true
    ) {
      if (
        navigation.state === 'loading' ||
        navigation.state === 'submitting'
      ) {

        console.log('debug redirect 3');
        scrollToTop.current = true;
      }
    }

    if (
      navigation.state === 'idle' &&
      scrollToTop.current === true
    ) {
      console.log('debug redirect 4');
      typeof window !== 'undefined' && window.scrollTo(0, 0);
      scrollToTop.current = false;
    }


    // console.log('debug redirect 3');
  }, [navigation.state])

  return <ScrollRestoration />;
};