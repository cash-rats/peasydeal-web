import {
  ScrollRestoration,
  useTransition,
} from '@remix-run/react';

export default function ConditionalScrollRestoration() {
  const transition = useTransition();

  if (
    transition.location !== undefined &&
    transition.location.state != undefined &&
    typeof transition.location.state === "object" &&
    (transition.location.state as { scrollToTop: boolean }).scrollToTop === true
  ) {
    typeof window !== 'undefined' && window.scrollTo(0, 0);

    return null;
  }

  return <ScrollRestoration />;
};