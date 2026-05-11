import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that uses IntersectionObserver to detect when an element
 * enters the viewport. Perfect for infinite scroll triggers.
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Margin around the root
 * @returns {{ ref, isIntersecting }} - Ref to attach + visibility state
 */
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '100px', ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return { ref, isIntersecting };
};

export default useIntersectionObserver;
