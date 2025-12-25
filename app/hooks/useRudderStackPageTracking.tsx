import { useEffect } from 'react';
import { useLocation } from 'react-router';

type Params = {
  enabled?: boolean;
};

const useRudderStackPageTracking = ({ enabled }: Params) => {
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    const rudderanalytics = (window as any).rudderanalytics;
    if (!rudderanalytics) return;

    if (Array.isArray(rudderanalytics)) {
      rudderanalytics.push(['page']);
      return;
    }

    if (typeof rudderanalytics.page === 'function') {
      rudderanalytics.page();
    }
  }, [enabled, location.pathname, location.search]);
};

export default useRudderStackPageTracking;
