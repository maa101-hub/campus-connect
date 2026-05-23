import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

/**
 * ScrollProgressBar
 * ─────────────────
 * A premium fixed scroll progress indicator with glowing dot.
 * Sits at the very top of the viewport.
 */
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        transformOrigin: '0%',
        scaleX,
        background: 'linear-gradient(90deg, #7C3AED, #9719fd, #ff6a00, #c77dff)',
        boxShadow: '0 0 12px rgba(151, 25, 253, 0.8), 0 0 30px rgba(151, 25, 253, 0.4)',
      }}
    />
  );
};

/**
 * ParallaxLayer
 * ─────────────
 * Wraps children in a parallax container that moves at a different
 * rate than the scroll. speed < 1 = slower (background), > 1 = faster.
 */
export const ParallaxLayer = ({ children, speed = 0.5, className = '', style = {} }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -200]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, y: smoothY }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScrollReveal
 * ────────────
 * Reveals children with a cinematic fade + slide when they enter viewport.
 * direction: 'up' | 'down' | 'left' | 'right'
 */
export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 60,
  once = true,
  className = '',
  style = {},
}) => {
  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * SectionIndicator
 * ────────────────
 * Fixed side dots showing which section is active.
 */
export const SectionIndicator = ({ sections = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observers = [];
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sections.findIndex((s) => s === entry.target.id);
          if (idx !== -1) setActiveIndex(idx);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observers.push(el);
      }
    });

    return () => observers.forEach((el) => observer.unobserve(el));
  }, [sections]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        right: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
      }}
    >
      {sections.map((id, i) => (
        <motion.a
          key={id}
          href={`#${id}`}
          animate={{
            scale: activeIndex === i ? 1.4 : 1,
            opacity: activeIndex === i ? 1 : 0.4,
          }}
          whileHover={{ scale: 1.6, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: activeIndex === i
              ? 'linear-gradient(135deg, #9719fd, #c77dff)'
              : 'rgba(255, 255, 255, 0.4)',
            boxShadow: activeIndex === i ? '0 0 12px rgba(151, 25, 253, 0.8)' : 'none',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        />
      ))}
    </div>
  );
};

/**
 * FloatingElement
 * ───────────────
 * Makes any element float with scroll-linked parallax + gentle rotation.
 * Used to make the girl images feel "alive" as user scrolls.
 */
export const FloatingElement = ({
  children,
  scrollSpeed = 0.3,
  rotateRange = 3,
  scaleRange = [0.97, 1.03],
  className = '',
  style = {},
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30 * scrollSpeed]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-rotateRange, 0, rotateRange]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleRange[0], scaleRange[1], scaleRange[0]]);

  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });
  const smoothRotate = useSpring(rotate, { stiffness: 80, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 80, damping: 20 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        y: smoothY,
        rotate: smoothRotate,
        scale: smoothScale,
      }}
    >
      {children}
    </motion.div>
  );
};
