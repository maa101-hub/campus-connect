import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import image4 from '../../assets/image4.png';

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: `${(i * 6.8 + 4) % 100}%`,
  y: `${(i * 7.5 + 6) % 90}%`,
  size: (i % 3) + 2,
  duration: (i % 4) + 5,
  delay: (i % 5) * 0.8,
  color: i % 3 === 0 ? '#9d4edd' : i % 3 === 1 ? '#ff6a00' : '#00c973',
}));

const INFO = [
  {
    id: 1,
    emoji: '✉️',
    label: 'Email',
    value: 'hello@campusconnect.in',
    color: '#c77dff',
  },
  {
    id: 2,
    emoji: '📍',
    label: 'Location',
    value: 'Bangalore, India',
    color: '#ff6a00',
  },
  {
    id: 3,
    emoji: '📞',
    label: 'Phone',
    value: '+91 98765 43210',
    color: '#00c973',
  },
];

const SOCIALS = [
  { id: 'ig',  label: 'Instagram', handle: '@campusconnect',  color: '#e1306c' },
  { id: 'tw',  label: 'Twitter',   handle: '@campusconnect',  color: '#1da1f2' },
  { id: 'li',  label: 'LinkedIn',  handle: 'CampusConnect',  color: '#0a66c2' },
];

const ContactSection = () => {
  const sectionRef = useRef(null);

  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1400);
  };

  /* ─── shared input style ─── */
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '14px',
    fontFamily: "'Manrope', sans-serif",
    transition: 'border-color 0.25s ease',
    boxSizing: 'border-box',
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        sectionRef.current.style.setProperty('--mx', x);
        sectionRef.current.style.setProperty('--my', y);
      }}
      aria-labelledby="contact-heading"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#0a0010',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <style>{`
        @media (max-width: 991px) {
          .contact-main-grid { 
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .contact-girl-img {
            left: 0 !important;
            width: 100% !important;
            opacity: 0.1 !important;
            z-index: 1 !important;
          }
          .contact-spacer { display: none !important; }
        }
      `}</style>

      {/* bridges */}
      <div className="section-bridge-top"    aria-hidden="true" />
      <div className="section-bridge-bottom" aria-hidden="true" />

      {/* particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden="true"
          animate={{ y: ['0px','-26px','0px'], opacity:[0.2,0.9,0.2], scale:[1,1.4,1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease:'easeInOut' }}
          style={{
            position:'absolute', left:p.x, top:p.y,
            width:p.size, height:p.size, borderRadius:'50%',
            background:p.color, boxShadow:`0 0 ${p.size*3}px ${p.color}`,
            pointerEvents:'none', zIndex:1,
          }}
        />
      ))}

      {/* ambient orb — top right */}
      <motion.div
        aria-hidden="true"
        animate={{ scale:[1,1.09,1], opacity:[0.7,1,0.7] }}
        transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
        style={{
          position:'absolute', top:'-10%', right:'-8%',
          width:'clamp(420px,45vw,720px)', height:'clamp(420px,45vw,720px)',
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(151,25,253,0.3) 0%, rgba(157,78,221,0.1) 55%, transparent 70%)',
          filter:'blur(70px)', pointerEvents:'none',
        }}
      />
      {/* ambient orb — bottom left */}
      <motion.div
        aria-hidden="true"
        animate={{ scale:[1,1.1,1], opacity:[0.5,0.9,0.5] }}
        transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:3 }}
        style={{
          position:'absolute', bottom:'-15%', left:'-5%',
          width:'clamp(280px,28vw,440px)', height:'clamp(280px,28vw,440px)',
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(157,78,221,0.2) 0%, transparent 65%)',
          filter:'blur(55px)', pointerEvents:'none',
        }}
      />

      {/* ── GIRL IMAGE — absolute center (same technique as HeroSection) ── */}
      <motion.img
        src={image4}
        className="contact-girl-img"
        alt=""
        aria-hidden="true"
        initial={{ opacity:0, x:30 }}
        whileInView={{ opacity:1, x:0 }}
        viewport={{ once:true, amount:0.2 }}
        animate={{ 
          y:[0,-10,0],
          rotateX: 'calc(var(--my) * -8deg)',
          rotateY: 'calc(var(--mx) * 12deg)',
        }}
        transition={{ 
          y:{ duration:4, repeat:Infinity, ease:'easeInOut' }, 
          opacity:{ duration:1.1, ease:[0.25,0.46,0.45,0.94] },
          rotateX: { type: 'spring', damping: 25, stiffness: 120 },
          rotateY: { type: 'spring', damping: 25, stiffness: 120 },
        }}
        style={{
          position:'absolute',
          top:0,
          bottom:0,
          left:'30%',
          width:'38%',
          height:'100%',
          objectFit:'contain',
          objectPosition:'center center',
          pointerEvents:'none',
          filter:'drop-shadow(0 0 60px rgba(151,25,253,0.5))',
          maskImage:'linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0.3) 92%, transparent 100%)',
          WebkitMaskImage:'linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0.3) 92%, transparent 100%)',
          transformStyle: 'preserve-3d',
          zIndex:3,
        }}
      />

      {/* ════════════════════════════════════════════════════
          MAIN LAYOUT — [Form] [Girl spacer] [Info panel]
          ════════════════════════════════════════════════════ */}
      <div
        className="contact-main-grid"
        style={{
          position:'relative', zIndex:10,
          width:'100%', maxWidth:'1440px',
          margin:'0 auto',
          padding:'clamp(110px,11vh,150px) clamp(24px,6vw,100px) clamp(70px,8vh,110px)',
          display:'grid',
          gridTemplateColumns:'1fr 0.6fr 0.9fr',
          gap:'32px',
          alignItems:'center',
          minHeight:'100vh',
        }}
      >

        {/* ── COL 1: Badge + Heading + Form ───────────────────── */}
        <motion.div
          initial={{ opacity:0, x:-50 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true, amount:0.25 }}
          transition={{ duration:0.8, ease:[0.25,0.46,0.45,0.94] }}
          style={{ display:'flex', flexDirection:'column', gap:'24px' }}
        >
          {/* badge */}
          <motion.div
            initial={{ opacity:0, y:-10 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.5, delay:0.1 }}
            style={{
              display:'inline-flex', alignItems:'center', gap:'8px',
              padding:'7px 15px', borderRadius:'30px',
              background:'rgba(255,255,255,0.06)',
              border:'1px solid rgba(255,255,255,0.18)',
              backdropFilter:'blur(8px)', width:'fit-content',
            }}
          >
            <motion.span
              animate={{ scale:[1,1.7,1], opacity:[1,0.3,1] }}
              transition={{ duration:1.8, repeat:Infinity }}
              style={{ width:8, height:8, borderRadius:'50%', background:'#9d4edd', flexShrink:0, boxShadow:'0 0 10px #9d4edd' }}
            />
            <span style={{ fontFamily:"'Manrope',sans-serif", fontWeight:600, fontSize:14, color:'rgba(255,255,255,0.7)' }}>
              We'd love to hear from you
            </span>
          </motion.div>

          {/* heading */}
          <motion.h2
            id="contact-heading"
            initial={{ opacity:0, y:18 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.7, delay:0.15 }}
            style={{ margin:0, lineHeight:1.05 }}
          >
            <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:400, fontSize:'clamp(28px,3.2vw,48px)', color:'#fff', display:'block' }}>
              Get in
            </span>
            <motion.span
              animate={{ backgroundPosition:['0% 50%','100% 50%','0% 50%'] }}
              transition={{ duration:4, repeat:Infinity, ease:'linear' }}
              style={{
                fontFamily:"'Sail',cursive",
                fontSize:'clamp(42px,5vw,72px)',
                background:'linear-gradient(135deg,#9719fd,#c77dff,#ff6a00,#9719fd)',
                backgroundSize:'300% 300%',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                display:'block', marginTop:4,
              }}
            >
              Touch.
            </motion.span>
          </motion.h2>

          {/* subtitle */}
          <motion.p
            initial={{ opacity:0, y:12 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.25 }}
            style={{
              fontFamily:"'Manrope',sans-serif", fontWeight:300,
              fontSize:'clamp(13px,1.3vw,17px)', color:'rgba(255,255,255,0.55)',
              margin:0, maxWidth:380, lineHeight:1.7,
            }}
          >
            Have a question or idea? Our team is always happy to connect with fellow campus explorers.
          </motion.p>

          {/* ── Form ── */}
          {!sent ? (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity:0, y:16 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.6, delay:0.35 }}
              style={{ display:'flex', flexDirection:'column', gap:12 }}
            >
              {/* row */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({...form, name:e.target.value})}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#9d4edd'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
                />
                <input
                  id="contact-email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#9d4edd'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
                />
              </div>

              <textarea
                id="contact-message"
                placeholder="Your message…"
                rows={5}
                value={form.message}
                onChange={e => setForm({...form, message:e.target.value})}
                style={{ ...inputStyle, resize:'none' }}
                onFocus={e => e.target.style.borderColor='#9d4edd'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
              />

              <motion.button
                id="contact-submit"
                type="submit"
                whileHover={{ scale:1.04, boxShadow:'0 0 36px rgba(151,25,253,0.65)' }}
                whileTap={{ scale:0.97 }}
                style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  gap:10, padding:'13px 28px', borderRadius:'50px',
                  background:'linear-gradient(135deg,#9719fd 0%,#7b2ff7 100%)',
                  color:'#fff', fontFamily:"'Manrope',sans-serif",
                  fontWeight:600, fontSize:16, cursor:'pointer',
                  boxShadow:'0 4px 24px rgba(151,25,253,0.35)',
                  width:'fit-content', opacity:sending ? 0.7 : 1, border:'none',
                }}
              >
                {sending ? (
                  <>
                    <motion.span
                      animate={{ rotate:360 }}
                      transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
                      style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%' }}
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <motion.span
                      animate={{ x:[0,5,0] }}
                      transition={{ duration:1.4, repeat:Infinity, ease:'easeInOut' }}
                      style={{ display:'flex' }}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </motion.span>
                  </>
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity:0, scale:0.9 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:0.5 }}
              style={{
                display:'flex', flexDirection:'column', gap:12,
                padding:'24px 28px', borderRadius:18,
                background:'rgba(0,201,115,0.07)',
                border:'1px solid rgba(0,201,115,0.28)',
                backdropFilter:'blur(14px)',
              }}
            >
              <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(0,201,115,0.15)', border:'1.5px solid rgba(0,201,115,0.45)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00c973" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ margin:0, fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:19, color:'#fff' }}>Message sent! 🎉</p>
              <p style={{ margin:0, fontFamily:"'Manrope',sans-serif", fontWeight:400, fontSize:14, color:'rgba(255,255,255,0.5)' }}>
                We'll get back to you soon. Stay connected on campus!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* MIDDLE: empty spacer — girl floats here as absolute */}
        <div />

        {/* RIGHT: info panel */}
        <motion.div
          initial={{ opacity:0, x:50 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true, amount:0.25 }}
          transition={{ duration:0.8, delay:0.15, ease:[0.25,0.46,0.45,0.94] }}
          style={{ display:'flex', flexDirection:'column', gap:20 }}
        >
          {/* section label */}
          <p style={{ margin:0, fontFamily:"'Manrope',sans-serif", fontWeight:500, fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:'0.15em', textTransform:'uppercase' }}>
            Contact Info
          </p>

          {/* info cards */}
          {INFO.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity:0, x:30 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.5, delay:0.1 + i*0.12 }}
              whileHover={{ x:5, boxShadow:`0 8px 28px rgba(151,25,253,0.18)` }}
              style={{
                display:'flex', alignItems:'center', gap:14,
                padding:'14px 18px', borderRadius:14,
                background:'rgba(255,255,255,0.04)',
                border:`1px solid ${item.color}28`,
                backdropFilter:'blur(10px)',
                transition:'box-shadow 0.3s ease',
              }}
            >
              <div style={{
                width:40, height:40, borderRadius:11, flexShrink:0,
                background:`${item.color}18`,
                border:`1px solid ${item.color}40`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18,
              }}>
                {item.emoji}
              </div>
              <div>
                <p style={{ margin:0, fontFamily:"'Manrope',sans-serif", fontWeight:400, fontSize:11, color:'rgba(255,255,255,0.38)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                  {item.label}
                </p>
                <p style={{ margin:'3px 0 0', fontFamily:"'Manrope',sans-serif", fontWeight:600, fontSize:14, color:'rgba(255,255,255,0.85)' }}>
                  {item.value}
                </p>
              </div>
            </motion.div>
          ))}

          {/* divider */}
          <div style={{ height:1, background:'rgba(255,255,255,0.07)', borderRadius:2 }} />

          {/* social label */}
          <p style={{ margin:0, fontFamily:"'Manrope',sans-serif", fontWeight:500, fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:'0.15em', textTransform:'uppercase' }}>
            Find Us Online
          </p>

          {/* socials */}
          {SOCIALS.map((s, i) => (
            <motion.a
              key={s.id}
              href="#"
              initial={{ opacity:0, x:30 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.5, delay:0.45 + i*0.1 }}
              whileHover={{ x:6, color: s.color }}
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'12px 18px', borderRadius:12,
                background:'rgba(255,255,255,0.03)',
                border:'1px solid rgba(255,255,255,0.08)',
                textDecoration:'none', cursor:'pointer',
                transition:'color 0.25s ease',
              }}
            >
              <span style={{ fontFamily:"'Manrope',sans-serif", fontWeight:600, fontSize:14, color:'rgba(255,255,255,0.75)' }}>
                {s.label}
              </span>
              <span style={{ fontFamily:"'Manrope',sans-serif", fontWeight:400, fontSize:13, color:'rgba(255,255,255,0.38)' }}>
                {s.handle}
              </span>
            </motion.a>
          ))}

          {/* response time badge */}
          <motion.div
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ delay:0.8 }}
            style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'12px 18px', borderRadius:12,
              background:'rgba(0,201,115,0.07)',
              border:'1px solid rgba(0,201,115,0.22)',
            }}
          >
            <motion.div
              animate={{ scale:[1,1.5,1], opacity:[1,0.4,1] }}
              transition={{ duration:2, repeat:Infinity }}
              style={{ width:8, height:8, borderRadius:'50%', background:'#00c973', boxShadow:'0 0 8px #00c973', flexShrink:0 }}
            />
            <span style={{ fontFamily:"'Manrope',sans-serif", fontWeight:500, fontSize:13, color:'rgba(255,255,255,0.6)' }}>
              Avg. response time: <strong style={{ color:'#00c973' }}>2 hours</strong>
            </span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactSection;
