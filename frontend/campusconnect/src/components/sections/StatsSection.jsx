import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: 5000, suffix: '+', label: 'Students Connected', icon: '👥' },
  { value: 200, suffix: '+', label: 'Colleges Onboard', icon: '🏫' },
  { value: 15000, suffix: '+', label: 'Posts Shared', icon: '📝' },
  { value: 1000000, suffix: '+', label: 'Messages Sent', icon: '💬' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    college: 'IIT Delhi',
    avatar: 'PS',
    color: '#6366F1',
    text: 'Campus Connect helped me find my hackathon team in minutes. The college-specific feed makes it so easy to stay updated with what matters!',
    role: 'Computer Science, 3rd Year'
  },
  {
    name: 'Rahul Verma',
    college: 'NIT Trichy',
    avatar: 'RV',
    color: '#EC4899',
    text: 'Finally a platform where I know everyone is a real student. The verification system gives me confidence to network genuinely.',
    role: 'Mechanical Engineering, 4th Year'
  },
  {
    name: 'Ananya Roy',
    college: 'BITS Pilani',
    avatar: 'AR',
    color: '#F59E0B',
    text: 'The events feature is a game-changer. I discovered 3 workshops last month that I would have missed otherwise. Love the RSVP system!',
    role: 'Electronics, 2nd Year'
  },
  {
    name: 'Karthik Rajan',
    college: 'VIT Vellore',
    avatar: 'KR',
    color: '#22C55E',
    text: 'Real-time messaging with typing indicators feels so premium. It\'s like having WhatsApp but exclusively for my campus community.',
    role: 'AI & Data Science, 3rd Year'
  },
];

// ─── Animated Counter ─────────────────────────────────────────
const AnimatedCounter = ({ target, suffix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <span ref={ref}>
      {formatNumber(count)}{suffix}
    </span>
  );
};

// ─── Stats Section ────────────────────────────────────────────
const StatsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '100px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(151,25,253,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24, marginBottom: 80
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              style={{
                textAlign: 'center', padding: '36px 20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20, backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{
                fontSize: 40, fontWeight: 800,
                background: 'linear-gradient(135deg, #9719fd, #c77dff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 6
              }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <h2 style={{
            textAlign: 'center', fontSize: 32, fontWeight: 800,
            marginBottom: 12, color: '#fff'
          }}>
            Loved by <span style={{ color: '#9d4edd' }}>Students</span> Everywhere
          </h2>
          <p style={{
            textAlign: 'center', color: 'rgba(255,255,255,0.5)',
            fontSize: 15, marginBottom: 48, maxWidth: 500, marginInline: 'auto'
          }}>
            See what students from top colleges are saying about Campus Connect
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20
          }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.12, duration: 0.5 }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(151,25,253,0.15)' }}
                style={{
                  padding: 24, borderRadius: 20,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
              >
                {/* Quote */}
                <p style={{
                  fontSize: 14, lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.75)',
                  marginBottom: 20, fontStyle: 'italic'
                }}>
                  "{t.text}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: t.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, flexShrink: 0
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                      {t.role} · {t.college}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
