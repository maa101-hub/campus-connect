import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import girl2Img from '../../assets/image2.png';

// ─── Floating particles (same as HeroSection) ─────────────────────────────────
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: `${(i * 11 + 5) % 95}%`,
  y: `${(i * 10 + 10) % 85}%`,
  size: (i % 3) + 2,
  duration: (i % 4) + 6,
  delay: (i % 5) * 1,
  color: i % 3 === 0 ? '#9d4edd' : i % 3 === 1 ? '#ff6a00' : '#00c973',
}));

// ─── Campus post cards data ───────────────────────────────────────────────────
const posts = [
  {
    id: 1,
    text: 'Anyone from CSE 3rd year?',
    meta: <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', marginRight: '4px' }}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> 24 replies</>,
    top: '20%',
    right: '5%',
    delay: 0.3,
  },
  {
    id: 2,
    text: 'Hackathon 2026 registration open',
    meta: <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', marginRight: '4px' }}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> 200 likes</>,
    top: '45%',
    right: '8%',
    delay: 0.55,
  },
  {
    id: 3,
    text: 'Today Is Trending',
    meta: <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', marginRight: '4px' }}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> 1.2k views</>,
    top: '68%',
    right: '12%',
    delay: 0.8,
  },
];

// ─── Floating card ────────────────────────────────────────────────────────────
const PostCard = ({ post }) => (
  <motion.div
    initial={{ opacity: 0, x: 60 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.65, delay: post.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ scale: 1.04, y: -6, boxShadow: '0 12px 40px rgba(151,25,253,0.25)' }}
    style={{
      position: 'absolute',
      top: post.top,
      right: post.right,
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '18px 26px',
      borderRadius: '18px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      minWidth: '270px',
      maxWidth: '360px',
      zIndex: 4,
      cursor: 'default',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: `card-float-${post.id} ${3.5 + post.id * 0.7}s ease-in-out infinite`,
    }}
  >
    <div style={{ flex: 1 }}>
      <p style={{
        margin: 0,
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 600,
        fontSize: '15px',
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 1.4,
      }}>
        {post.text}
      </p>
      {post.meta && (
        <p style={{
          margin: '5px 0 0',
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 400,
          fontSize: '13px',
          color: 'rgba(255,255,255,0.45)',
        }}>
          {post.meta}
        </p>
      )}
    </div>
    {/* Pulsing red dot */}
    <motion.div
      animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: post.delay }}
      style={{
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #ff4d4d 0%, #cc0000 100%)',
        boxShadow: '0 0 14px rgba(255,77,77,0.9)',
        flexShrink: 0,
      }}
    />
  </motion.div>
);

// ─── Section ──────────────────────────────────────────────────────────────────
const CommunitySection = () => {
  const sectionRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      id="community"
      ref={sectionRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        sectionRef.current.style.setProperty('--mx', x);
        sectionRef.current.style.setProperty('--my', y);
      }}
      aria-label="Campus community activity"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#0a0010', /* ← exact same as hero */
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <style>{`
        @media (max-width: 991px) {
          .community-main-grid { 
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
          .community-spacer { display: none !important; }
          .community-girl-img {
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            opacity: 0.15 !important;
            z-index: 1 !important;
            object-fit: cover !important;
          }
          .community-text-wrapper {
            align-items: center !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* ── Seamless top bridge from HeroSection ── */}
      <div className="section-bridge-top" aria-hidden="true" />
      {/* ── Floating particles (same as hero) ── */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden="true"
          animate={{
            y: ['0px', '-28px', '0px'],
            opacity: [0.25, 1, 0.25],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ))}

      {/* ── Ambient orb LEFT (breathing) — mirrors hero's right orb ── */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '-5%',
          width: 'clamp(500px, 55vw, 900px)',
          height: 'clamp(500px, 55vw, 900px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(151,25,253,0.35) 0%, rgba(157,78,221,0.15) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Secondary orb bottom-right ── */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: 'clamp(300px, 30vw, 500px)',
          height: 'clamp(300px, 30vw, 500px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(157,78,221,0.2) 0%, transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── CHARACTER IMAGE — exact same technique as hero but mirrored to left ── */}
      <motion.img
        src={girl2Img}
        className="community-girl-img"
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        animate={{ 
          y: [0, -10, 0],
          rotateX: 'calc(var(--my) * -8deg)',
          rotateY: 'calc(var(--mx) * 12deg)',
        }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, 
          opacity: { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] },
          rotateX: { type: 'spring', damping: 25, stiffness: 120 },
          rotateY: { type: 'spring', damping: 25, stiffness: 120 },
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: '-8%',
          right: '25%',
          width: '80%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          opacity: 0.95,
          pointerEvents: 'none',
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 65%, transparent 100%)',
          filter: 'drop-shadow(0 0 60px rgba(151,25,253,0.3))',
          transformStyle: 'preserve-3d',
          zIndex: 2,
        }}
      />



      {/* ── Main content grid ── */}
      <div
        className="community-main-grid"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: 'clamp(100px, 10vh, 140px) clamp(24px, 8vw, 120px) clamp(60px, 8vh, 100px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        {/* LEFT: spacer — character is absolute bg */}
        <div className="community-spacer" />

        {/* RIGHT: text + cards */}
        <motion.div
          className="community-text-wrapper"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}
        >
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '30px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', width: 'fit-content' }}
          >
            <motion.span
              animate={{ scale: [1, 1.7, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9d4edd', display: 'inline-block', boxShadow: '0 0 10px #9d4edd', flexShrink: 0 }}
            />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: '15px', color: 'rgba(255,255,255,0.7)' }}>
              Live Campus Activity
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ margin: 0, lineHeight: 1.05 }}
          >
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: 'clamp(32px, 4vw, 56px)', color: '#ffffff', display: 'block' }}>
              Your campus,
            </span>
            <motion.span
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                fontFamily: "var(--font-baloo)",
                fontSize: 'clamp(46px, 5.5vw, 80px)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #7C3AED, #9719fd, #ff6a00, #7C3AED)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
                marginTop: '4px',
              }}
            >
              alive.
            </motion.span>
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300, fontSize: 'clamp(14px, 1.4vw, 18px)', color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '420px', lineHeight: 1.65 }}
          >
            See what's happening right now across your college — real posts, real people, real campus life.
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#get-started"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 36px rgba(151,25,253,0.65)' }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 30px', borderRadius: '50px', background: 'linear-gradient(135deg, #9719fd 0%, #7b2ff7 100%)', color: '#ffffff', fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: '17px', textDecoration: 'none', boxShadow: '0 4px 24px rgba(151,25,253,0.35)', width: 'fit-content' }}
          >
            Join Community
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'flex' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </motion.span>
          </motion.a>
        </motion.div>
      </div>

      {/* ── Floating post cards (absolutely positioned over the section) ── */}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default CommunitySection;
