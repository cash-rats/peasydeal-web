import { useEffect, useState } from 'react';

const useCheckScrolled = (offset: number = 0): [boolean, number] => {
  // Track if scroll > offset
  const [scrolled, setScrolled] = useState<boolean>(false);
  // Track the entire scrolling offset
  const [_offset, setOffset] = useState<number>(0);

  const handleScroll = (evt: Event) => {
    setScrolled(window.scrollY > offset);
    setOffset(window.scrollY);
  }

  useEffect(() => {
    if (!window) return;
    window.addEventListener('scroll', handleScroll);
    return () => window.addEventListener('scroll', handleScroll);
  });

  return [scrolled, _offset];
}

export default useCheckScrolled