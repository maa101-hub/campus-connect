import { motion } from 'framer-motion';
import { Heart, ArrowUp } from 'lucide-react';

const socialLinks = [
  { 
    label: 'Instagram', 
    href: 'https://instagram.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  { 
    label: 'Twitter', 
    href: 'https://twitter.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  { 
    label: 'LinkedIn', 
    href: 'https://linkedin.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      position: 'relative',
      background: '#0a0010',
      borderTop: '1px solid rgba(157,78,221,0.15)',
      padding: '80px 24px 40px',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'clamp(400px, 40vw, 800px)',
        height: '300px',
        background: 'radial-gradient(circle, rgba(151,25,253,0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '48px',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7C3AED, #9719fd)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 15px rgba(124,58,237,0.5)',
            }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>C</span>
            </div>
            <span style={{ 
              fontFamily: "var(--font-baloo)", 
              fontWeight: 800, fontSize: '24px', color: '#fff',
              letterSpacing: '-0.02em' 
            }}>
              CampusConnect<span style={{ color: '#7C3AED' }}>.</span>
            </span>
          </div>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '14px', color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.6, maxWidth: '280px'
          }}>
            The verified, vibrant network for the modern Indian student. Share, connect, and explore your campus like never before.
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Platform</h4>
            {['Home', 'Community', 'About', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} style={{
                color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px',
                transition: 'color 0.2s ease',
              }} onMouseOver={e => e.target.style.color = '#9d4edd'} onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
                {link}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Legal</h4>
            {['Privacy', 'Terms', 'Safety', 'Guidelines'].map(link => (
              <a key={link} href="#" style={{
                color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px',
                transition: 'color 0.2s ease',
              }} onMouseOver={e => e.target.style.color = '#9d4edd'} onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Social & Newsletter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h4 style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stay Connected</h4>
          <div style={{ display: 'flex', gap: '12px' }}>
            {socialLinks.map(({ icon, label, href }) => (
              <motion.a 
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${label}`}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(157,78,221,0.2)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                  transition: 'border-color 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(157,78,221,0.5)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                {icon}
              </motion.a>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            Join 50k+ students getting campus updates.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '60px auto 0',
        paddingTop: '24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          &copy; {currentYear} CampusConnect. Built with <Heart size={12} fill="#9d4edd" color="#9d4edd" /> for students.
        </p>
        <motion.button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ y: -2, color: '#c77dff' }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'none', border: 'none', color: '#9d4edd', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: "'Manrope', sans-serif",
          }}
          aria-label="Scroll back to top"
        >
          Back to Top 
          <ArrowUp size={14} />
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;
