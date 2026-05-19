import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import image5 from '../../assets/image5.png';

// ─── Floating particles ────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: `${(i * 12 + 5) % 95}%`,
  y: `${(i * 11 + 8) % 85}%`,
  size: (i % 3) + 2,
  duration: (i % 4) + 6,
  delay: (i % 5) * 1,
  color: i % 3 === 0 ? '#9d4edd' : i % 3 === 1 ? '#ff6a00' : '#00c973',
}));

// ─── Mission pillars ───────────────────────────────────────────────────────────
const PILLARS = [
  {
    id: 1,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    title: 'Built for Students',
    desc: 'Every feature is designed with real campus life in mind — from study groups to exam rants.',
    color: '#7C3AED',
    delay: 0.1,
  },
  {
    id: 2,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title: 'Verified & Safe',
    desc: 'Only students with verified college emails can join. Your campus, your trusted space.',
    color: '#ff6a00',
    delay: 0.22,
  },
  {
    id: 3,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
    title: 'Pan-India Network',
    desc: 'Connect across colleges, cities, and disciplines. One platform for every Indian student.',
    color: '#00c973',
    delay: 0.34,
  },
  {
    id: 4,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    title: 'Real-Time & Live',
    desc: 'Campus events, trending posts, live reactions — everything happening, happening now.',
    color: '#c77dff',
    delay: 0.46,
  },
];

// ─── Animated counter ──────────────────────────────────────────────────────────
const STATS = [
  { label: 'Students', value: 50000, suffix: '+', prefix: '' },
  { label: 'Colleges', value: 200, suffix: '+', prefix: '' },
  { label: 'Messages', value: 1, suffix: 'M+', prefix: '' },
  { label: 'Cities', value: 80, suffix: '+', prefix: '' },
];

const Counter = ({ target, suffix, prefix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const [count, setCount] = useState(0);

  // Start counting once in view
  if (inView && count === 0 && target > 0) {
    const step = Math.ceil(target / 60);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(cur);
      if (cur >= target) clearInterval(timer);
    }, 24);
  }

  return (
    <span ref={ref}>
      {prefix}{inView ? count.toLocaleString() : 0}{suffix}
    </span>
  );
};

// ─── Timeline milestones ───────────────────────────────────────────────────────
const MILESTONES = [
  { year: '2022', event: 'Idea born in a college hostel room 🏠' },
  { year: '2023', event: 'Beta launched at 5 colleges 🚀' },
  { year: '2024', event: 'Crossed 10k verified students 🎉' },
  { year: '2025', event: 'Expanded to 200+ colleges across India 🇮🇳' },
  { year: '2026', event: 'Building the future of campus life ⚡' },
];

const TEAM = [
  { 
    name: 'Sourav Roy', 
    role: 'Founder & CEO', 
    bio: 'Visionary behind CampusConnect. CSE Final Year.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  { 
    name: 'Ananya Das', 
    role: 'Design Head', 
    bio: 'Crafting the premium experience you see here.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3 1.912 5.886H20.1l-4.994 3.635L17.018 18.4 12 14.765 6.982 18.4l1.912-5.879L3.9 8.886h6.188L12 3z"/></svg>
  },
  { 
    name: 'Rohan Gupta', 
    role: 'CTO', 
    bio: 'Making sure the servers never sleep.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  },
  { 
    name: 'Sneha Kapur', 
    role: 'Community', 
    bio: 'Bridging the gap between every campus.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
];

// ─── Section ───────────────────────────────────────────────────────────────────
const AboutSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#0a0010',
        overflow: 'hidden',
      }}
    >
      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 991px) {
          .about-hero-grid { 
            grid-template-columns: 1fr !important;
            padding-top: 100px !important;
          }
          .about-girl-container {
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            opacity: 0.15 !important;
            z-index: 1 !important;
          }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 24px !important;
          }
          .about-mission-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .about-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .about-speech-bubble, .about-50k-badge {
            display: none !important;
          }
        }
      `}</style>
      {/* bridges */}
      <div className="section-bridge-top" aria-hidden="true" />
      <div className="section-bridge-bottom" aria-hidden="true" />

      {/* particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden="true"
          animate={{ y: ['0px', '-26px', '0px'], opacity: [0.2, 0.9, 0.2], scale: [1, 1.4, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: p.x, top: p.y,
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.color, boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            pointerEvents: 'none', zIndex: 1,
          }}
        />
      ))}

      {/* ambient orb right */}
      <motion.div aria-hidden="true"
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-5%', right: '-8%',
          width: 'clamp(440px, 48vw, 760px)', height: 'clamp(440px, 48vw, 760px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(151,25,253,0.3) 0%, rgba(157,78,221,0.1) 55%, transparent 70%)',
          filter: 'blur(70px)', pointerEvents: 'none',
        }}
      />
      {/* ambient orb bottom-left */}
      <motion.div aria-hidden="true"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: 'clamp(300px, 30vw, 500px)', height: 'clamp(300px, 30vw, 500px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(157,78,221,0.22) 0%, transparent 65%)',
          filter: 'blur(55px)', pointerEvents: 'none',
        }}
      />

      {/* ══════════════════════════════════════════════════════
          HERO ROW wrapper — relative so girl stays inside
          ══════════════════════════════════════════════════════ */}
      <div 
        style={{ position: 'relative', width: '100%', minHeight: '100vh' }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          sectionRef.current.style.setProperty('--mx', x);
          sectionRef.current.style.setProperty('--my', y);
        }}
      >

        {/* Girl — absolute, shifted slightly right of center */}
        <motion.div
          className="about-girl-container"
          style={{
            position: 'absolute',
            top: 0,
            right: '-5%',
            left: '32%',
            bottom: 0,
            zIndex: 4,
            pointerEvents: 'none',
          }}
        >
          <motion.img
            src={image5}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            animate={{ 
              y: [0, -14, 0],
              rotateX: 'calc(var(--my) * -8deg)',
              rotateY: 'calc(var(--mx) * 12deg)',
            }}
            transition={{
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] },
              rotateX: { type: 'spring', damping: 25, stiffness: 120 },
              rotateY: { type: 'spring', damping: 25, stiffness: 120 },
              scale: { duration: 0.8 },
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'left center',
              filter: 'drop-shadow(0 0 100px rgba(151,25,253,0.4))',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 98%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 98%)',
              transformStyle: 'preserve-3d',
            }}
          />
        </motion.div>

        {/* Speech bubble — moved with the girl */}
        <motion.div
          className="about-speech-bubble"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          animate={{ 
            y: [0, -7, 0],
            rotateX: 'calc(var(--my) * -4deg)',
            rotateY: 'calc(var(--mx) * 6deg)',
          }}
          style={{
            position: 'absolute',
            top: '12%',
            right: '6%',
            zIndex: 6,
            padding: '12px 18px', borderRadius: 16,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(157,78,221,0.4)',
            backdropFilter: 'blur(16px)',
            maxWidth: 210,
            pointerEvents: 'none',
            transformStyle: 'preserve-3d',
          }}
        >
          <p style={{ margin: 0, fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13, color: '#fff', lineHeight: 1.4 }}>
            "Why isn't there an Instagram for college?" 🤔
          </p>
          <div style={{ position: 'absolute', bottom: -8, right: 24, width: 16, height: 16, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(157,78,221,0.35)', borderTop: 'none', borderRight: 'none', transform: 'rotate(-45deg)' }} />
        </motion.div>

        {/* 50k badge — moved with the girl */}
        <motion.div
          className="about-50k-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.0 }}
          animate={{ 
            y: [0, -8, 0],
            rotateX: 'calc(var(--my) * -6deg)',
            rotateY: 'calc(var(--mx) * 10deg)',
          }}
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            zIndex: 6,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 50,
            background: 'rgba(0,201,115,0.1)',
            border: '1px solid rgba(0,201,115,0.35)',
            backdropFilter: 'blur(12px)',
            pointerEvents: 'none',
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c973', boxShadow: '0 0 8px #00c973', flexShrink: 0 }}
          />
          <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13, color: '#fff', whiteSpace: 'nowrap' }}>
            50k+ students joined!
          </span>
        </motion.div>

        {/* Left content grid */}
        <div 
          className="about-hero-grid"
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: '1440px', margin: '0 auto',
            padding: 'clamp(120px,12vh,160px) clamp(24px,8vw,100px) 0',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '40px',
            alignItems: 'center',
            minHeight: '100vh',
            maxWidth: '640px',
            marginLeft: 0,
          }}
        >

          {/* LEFT: badge + heading + tagline + tab switcher */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {/* badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '7px 15px', borderRadius: 30,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)', width: 'fit-content',
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.7, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: '#9d4edd', boxShadow: '0 0 10px #9d4edd', flexShrink: 0 }}
              />
              <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                Our Story
              </span>
            </motion.div>

            {/* heading */}
            <motion.h2
              id="about-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{ margin: 0, lineHeight: 1.05 }}
            >
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 400, fontSize: 'clamp(30px,3.5vw,52px)', color: '#fff', display: 'block' }}>
                We are
              </span>
              <motion.span
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{
                  fontFamily: "var(--font-baloo)",
                  fontSize: 'clamp(46px,5.5vw,80px)',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg,#7C3AED,#9719fd,#ff6a00,#7C3AED)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  display: 'block', marginTop: 4,
                }}
              >
                CampusConnect.
              </motion.span>
            </motion.h2>

            {/* tagline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{
                fontFamily: "'Manrope',sans-serif", fontWeight: 300,
                fontSize: 'clamp(14px,1.4vw,18px)', color: 'rgba(255,255,255,0.58)',
                margin: 0, maxWidth: 440, lineHeight: 1.7,
              }}
            >
              We started with a simple question: <em style={{ color: 'rgba(199,125,255,0.85)', fontStyle: 'italic' }}>"Why is there no Instagram for college?"</em> — so we built one. A verified, vibrant network for every Indian campus.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
            >
              {['mission', 'timeline', 'team'].map((tab) => (
                <button
                  key={tab}
                  id={`about-tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '9px 22px', borderRadius: 50,
                    fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 14,
                    cursor: 'pointer',
                    background: activeTab === tab
                      ? 'linear-gradient(135deg,#9719fd,#7b2ff7)'
                      : 'rgba(255,255,255,0.05)',
                    border: activeTab === tab
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    boxShadow: activeTab === tab ? '0 4px 20px rgba(151,25,253,0.4)' : 'none',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {tab === 'mission' ? '🎯 Mission' : tab === 'timeline' ? '🕐 Timeline' : '👥 Our Team'}
                </button>
              ))}
            </motion.div>

            {/* tab content */}
            {activeTab === 'mission' ? (
              <motion.div
                key="mission"
                className="about-mission-grid"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
              >
                {PILLARS.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: p.delay }}
                    whileHover={{ y: -4, boxShadow: `0 12px 32px ${p.color}28` }}
                    style={{
                      padding: '16px 18px', borderRadius: 14,
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${p.color}28`,
                      backdropFilter: 'blur(10px)',
                      transition: 'box-shadow 0.3s ease',
                      cursor: 'default',
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{p.icon}</div>
                    <p style={{ margin: 0, fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 6 }}>
                      {p.title}
                    </p>
                    <p style={{ margin: 0, fontFamily: "'Manrope',sans-serif", fontWeight: 400, fontSize: 12.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                      {p.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            ) : activeTab === 'timeline' ? (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                {MILESTONES.map((m, i) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    style={{ display: 'flex', gap: 16, position: 'relative' }}
                  >
                    {/* line + dot */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 20 }}>
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        style={{ width: 10, height: 10, borderRadius: '50%', background: '#9d4edd', boxShadow: '0 0 8px #9d4edd', flexShrink: 0, marginTop: 18 }}
                      />
                      {i < MILESTONES.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: 'rgba(157,78,221,0.25)', minHeight: 28 }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: 16, paddingTop: 10 }}>
                      <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13, color: '#9d4edd', display: 'block' }}>{m.year}</span>
                      <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 400, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{m.event}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
              >
                {TEAM.map((m, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
                    style={{
                      padding: '14px', borderRadius: 20,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', gap: 12, alignItems: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                    }}
                  >
                    <div style={{ 
                      width: 44, height: 44, borderRadius: '50%', 
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(123,47,247,0.1))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#7C3AED', border: '1px solid rgba(124,58,237,0.2)'
                    }}>
                      {m.icon}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, color: '#fff', fontWeight: 700 }}>{m.name}</h4>
                      <p style={{ margin: 0, fontSize: 11, color: '#9d4edd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.role}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

        </div>{/* end inner content grid */}
      </div>{/* end hero-row wrapper */}

      {/* ══════════════════════════════════════════════════════
          STATS ROW
          ══════════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '1440px', margin: '0 auto',
        padding: 'clamp(48px,6vh,80px) clamp(24px,6vw,100px)',
      }}>
        <motion.div
          className="about-stats-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            padding: '36px 48px',
            borderRadius: 24,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(157,78,221,0.18)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ textAlign: 'center', padding: '8px 0' }}
            >
              <p style={{
                margin: 0,
                fontFamily: "var(--font-baloo)",
                fontSize: 'clamp(32px,3.5vw,52px)',
                fontWeight: 800,
                background: 'linear-gradient(135deg,#7C3AED,#9719fd,#ff6a00)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                lineHeight: 1.1,
              }}>
                <Counter target={s.value} suffix={s.suffix} prefix={s.prefix} />
              </p>
              <p style={{ margin: '6px 0 0', fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 14, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════
          TEAM / CLOSING CTA ROW
          ══════════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '1440px', margin: '0 auto',
        padding: '0 clamp(24px,6vw,100px) clamp(80px,10vh,120px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        textAlign: 'center',
      }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 300, fontSize: 'clamp(14px,1.4vw,18px)', color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: 0, lineHeight: 1.7 }}
        >
          Built by students, for students — with ❤️ from Bangalore. We're a small team with a big mission: make every campus feel like home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.a
            href="#community"
            whileHover={{ scale: 1.05, boxShadow: '0 0 36px rgba(151,25,253,0.65)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '13px 28px', borderRadius: 50,
              background: 'linear-gradient(135deg,#9719fd 0%,#7b2ff7 100%)',
              color: '#fff', fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 16,
              textDecoration: 'none', boxShadow: '0 4px 24px rgba(151,25,253,0.35)',
            }}
          >
            Explore Community
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'flex' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </motion.span>
          </motion.a>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04, background: 'rgba(157,78,221,0.12)', borderColor: 'rgba(157,78,221,0.7)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '13px 28px', borderRadius: 50,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 16,
              textDecoration: 'none', backdropFilter: 'blur(8px)',
              transition: 'all 0.25s ease',
            }}
          >
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
