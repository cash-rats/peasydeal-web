import { useLayoutEffect, useRef } from 'react';
import {
  ScrollRestoration,
  useNavigation,
} from '@remix-run/react';

export default function ConditionalScrollRestoration() {
  const navigation = useNavigation();
  const scrollToTop = useRef<boolean>(false);

  useLayoutEffect(() => {
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
        scrollToTop.current = true;
      }
    }

    if (
      navigation.state === 'idle' &&
      scrollToTop.current === true
    ) {
      typeof window !== 'undefined' && window.scrollTo(0, 0);
      scrollToTop.current = false;
    }

  }, [navigation.state])

  return <ScrollRestoration />;
};