import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to an element and its current content width in pixels.
 * Updates reactively via ResizeObserver.
 *
 * `width` initializes as `undefined` (not `0`) to avoid flash of incorrect
 * layout state on first render.
 */
export function useContainerWidth<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial width synchronously
    setWidth(el.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
