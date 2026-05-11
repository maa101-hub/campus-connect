import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, X, Navigation, Star, Zap } from 'lucide-react';

const HOTSPOTS = [
  { id: 1, x: '25%', y: '35%', name: 'Central Library', tip: '3rd floor is the quietest spot for exam prep.', activity: 'High', color: '#EF4444' },
  { id: 2, x: '65%', y: '25%', name: 'Main Canteen', tip: 'The filter coffee is 50% off after 4 PM!', activity: 'Busy', color: '#F59E0B' },
  { id: 3, x: '45%', y: '65%', name: 'Tech Park', tip: 'Best Wi-Fi signal is near the Lab-B entrance.', activity: 'Live', color: '#22C55E' },
  { id: 4, x: '80%', y: '70%', name: 'Sports Ground', tip: 'Matches every Tuesday at 5 PM.', activity: 'Moderate', color: '#6366F1' },
];

const CampusMap = () => {
  const [selectedSpot, setSelectedSpot] = useState(null);

  return (
    <motion.div 
      className="dash-feed"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ padding: '0 0 40px 0', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Navigation size={28} className="icon-pulse" style={{ color: 'var(--accent)' }} />
          Campus Treasure Map
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
          Discover hidden gems and live student activity across your campus.
        </p>
      </div>

      {/* Map Container */}
      <div style={{ 
        position: 'relative', 
        flex: 1, 
        minHeight: 500, 
        background: 'var(--bg-tertiary)', 
        borderRadius: 32,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05)'
      }}>
        {/* Abstract Architectural SVG Map Background */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }} viewBox="0 0 800 600">
          <rect x="100" y="100" width="150" height="100" rx="20" fill="currentColor" />
          <rect x="300" y="150" width="200" height="80" rx="20" fill="currentColor" />
          <rect x="550" y="100" width="120" height="180" rx="20" fill="currentColor" />
          <circle cx="400" cy="400" r="80" fill="currentColor" />
          <path d="M50,300 Q400,250 750,300" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M100,50 L100,550" stroke="currentColor" strokeDasharray="10 10" opacity="0.5" />
        </svg>

        {/* Hotspot Pins */}
        {HOTSPOTS.map(spot => (
          <motion.div
            key={spot.id}
            style={{ position: 'absolute', left: spot.x, top: spot.y, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 10 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => setSelectedSpot(spot)}
          >
            {/* Pulsing Aura */}
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: 'absolute', inset: -10, borderRadius: '50%',
                background: spot.color, zIndex: 0
              }}
            />
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              background: spot.color, border: '3px solid #fff',
              boxShadow: '0 0 15px rgba(0,0,0,0.2)', position: 'relative', zIndex: 1
            }} />
          </motion.div>
        ))}

        {/* Selected Spot Details (Overlay Card) */}
        <AnimatePresence>
          {selectedSpot && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              style={{
                position: 'absolute', top: 20, right: 20, bottom: 20,
                width: 320, background: 'var(--bg-primary)',
                borderRadius: 24, boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border)', zIndex: 100,
                padding: 24, display: 'flex', flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ 
                  fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 8,
                  background: selectedSpot.color, color: '#fff'
                }}>
                  {selectedSpot.activity.toUpperCase()}
                </span>
                <button onClick={() => setSelectedSpot(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <h3 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 900 }}>{selectedSpot.name}</h3>
              
              <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= 4 ? "#fbbf24" : "none"} color="#fbbf24" />)}
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>4.2/5 rating</span>
              </div>

              <div style={{ 
                background: 'var(--bg-tertiary)', padding: 20, borderRadius: 20,
                flex: 1, position: 'relative', border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', marginBottom: 12 }}>
                  <Zap size={16} fill="currentColor" />
                  <span style={{ fontWeight: 800, fontSize: 14 }}>Student Tip</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{selectedSpot.tip}"
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  marginTop: 20, width: '100%', padding: '14px', borderRadius: 14,
                  background: 'var(--accent)', color: '#fff', border: 'none',
                  fontWeight: 800, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                }}
              >
                Navigate There <Navigation size={14} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div style={{ 
          position: 'absolute', bottom: 20, left: 20, 
          background: 'rgba(var(--bg-primary-rgb), 0.8)', backdropFilter: 'blur(10px)',
          padding: '12px 20px', borderRadius: 16, border: '1px solid var(--border)',
          display: 'flex', gap: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} /> High Activity
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} /> Live Tip
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CampusMap;
