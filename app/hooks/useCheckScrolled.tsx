import { useEffect, useState } from 'react';

const useCheckScrolled = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const handleScroll = (evt: Event) => setScrolled(window.scrollY > 0)

  useEffect(() => {
    if (!window) return;
    window.addEventListener('scroll', handleScroll);
  });

  return [scrolled];
}

export default useCheckScrolled