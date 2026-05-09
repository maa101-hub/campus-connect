import { motion } from 'framer-motion';

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
            {['IG', 'TW', 'LI'].map(s => (
              <motion.a 
                key={s} href="#"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(157,78,221,0.2)' }}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '12px', fontWeight: 700, textDecoration: 'none'
                }}
              >
                {s}
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
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
          &copy; {currentYear} CampusConnect. Built with ❤️ for students.
        </p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: 'none', border: 'none', color: '#9d4edd', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          Back to Top 
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
