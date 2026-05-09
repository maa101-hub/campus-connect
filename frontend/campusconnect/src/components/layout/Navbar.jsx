import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItemsConfig = [
  { label: 'Home',      href: '#hero' },
  { label: 'Community', href: '#community' },
  { label: 'Contact',   href: '#contact' },
  { label: 'About',     href: '#about' },
];

const Navbar = ({ onOpenSignup }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers = [];
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const matchingNavItem = navItemsConfig.find(item => item.href === `#${id}`);
          if (matchingNavItem) {
            setActiveSection(matchingNavItem.label);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItemsConfig.forEach(item => {
      const sectionId = item.href.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
        observers.push(element);
      }
    });

    return () => {
      observers.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
      role="banner"
    >
      {/* ── Scroll progress bar ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0,
          height: '3px',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #9719fd, #c77dff, #ff6a00)',
          boxShadow: '0 0 10px rgba(151,25,253,0.7)',
          transition: 'width 0.1s ease',
          zIndex: 60,
          borderRadius: '0 3px 3px 0',
        }}
      />

      <div
        className="mx-auto transition-all duration-500 ease-in-out"
        style={{
          width: scrolled ? '92%' : '100%',
          maxWidth: scrolled ? '1200px' : '100%',
          marginTop: scrolled ? '12px' : '0',
          borderRadius: scrolled ? '24px' : '0',
          padding: '0 24px',
          background: scrolled
            ? 'rgba(10, 0, 16, 0.7)'
            : 'rgba(0, 0, 0, 0.2)',
          backdropFilter: scrolled ? 'blur(24px)' : 'blur(8px)',
          border: scrolled ? '1px solid rgba(157, 78, 221, 0.2)' : '1px solid transparent',
          boxShadow: scrolled ? '0 12px 40px rgba(0, 0, 0, 0.5)' : 'none',
        }}
      >
        <div className="flex items-center justify-between h-[80px] max-w-[1440px] mx-auto">

          {/* ── Logo ── */}
          <a
            href="#hero"
            id="nav-logo"
            className="flex-shrink-0 cursor-pointer"
            aria-label="CampusConnect home"
            style={{ fontFamily: "var(--font-baloo)", fontSize: '32px', fontWeight: 800, textDecoration: 'none', lineHeight: 1 }}
          >
            <span style={{ color: '#7C3AED' }}>C</span>
            <span style={{ color: '#ffffff' }}>ampus</span>
            <span style={{ color: '#7C3AED' }}>C</span>
            <span style={{ color: '#ffffff' }}>onnect</span>
          </a>

          {/* ── Desktop nav links ── */}
          <nav
            className="hidden md:flex items-center gap-10"
            aria-label="Primary navigation"
          >
            {navItemsConfig.map((item) => {
              const isActive = activeSection === item.label;
              return (
              <motion.a
                key={item.label}
                href={item.href}
                id={`nav-${item.label.toLowerCase()}`}
                aria-current={isActive ? 'page' : undefined}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '17px',
                  color: isActive ? '#7C3AED' : 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      borderRadius: '2px',
                      background: 'linear-gradient(90deg, #9d4edd, #9719fd)',
                    }}
                  />
                )}
              </motion.a>
              );
            })}
          </nav>

          {/* ── Sign Up button ── */}
          <motion.button
            id="nav-signup"
            onClick={onOpenSignup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:inline-flex items-center gap-2"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 500,
              fontSize: '17px',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '50px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(157,78,221,0.15)';
              e.currentTarget.style.borderColor = '#9d4edd';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            aria-label="Sign up for CampusConnect"
          >
            Sign up
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* ── Mobile hamburger ── */}
          <button
            id="nav-menu-toggle"
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                style={{ display: 'block', width: '24px', height: '2px', background: '#ffffff', borderRadius: '2px' }}
                animate={
                  menuOpen
                    ? i === 0 ? { rotate: 45, y: 7 }
                    : i === 1 ? { opacity: 0 }
                    : { rotate: -45, y: -7 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.2 }}
              />
            ))}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-6 flex flex-col gap-4 px-6"
          >
            {navItemsConfig.map(item => {
              const isActive = activeSection === item.label;
              return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '18px',
                  color: isActive ? '#9d4edd' : 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </a>
              );
            })}
            <a
              href="#signup"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
                fontSize: '17px',
                color: '#fff',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: '50px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'inline-block',
                width: 'fit-content',
              }}
            >
              Sign up →
            </a>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
