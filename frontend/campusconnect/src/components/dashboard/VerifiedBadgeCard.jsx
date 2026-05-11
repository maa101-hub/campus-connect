import { useState } from 'react';
import { motion } from 'framer-motion';

const PRESET_COLORS = [
  '#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', 
  '#22C55E', '#06B6D4', '#EF4444', '#8B5CF6', 
  '#10B981', '#F43F5E'
];

const VerifiedBadgeCard = ({ user }) => {
  const [currentColor, setCurrentColor] = useState(PRESET_COLORS[0]);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SC';

  const handleAvatarClick = () => {
    // Pick a random color that is different from the current one
    const availableColors = PRESET_COLORS.filter(c => c !== currentColor);
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    setCurrentColor(randomColor);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '16px 0',
      marginBottom: 24
    }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAvatarClick}
        style={{
          width: 90, 
          height: 90, 
          borderRadius: '50%', 
          background: currentColor,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: 32, 
          fontWeight: 800, 
          color: '#fff',
          cursor: 'pointer',
          boxShadow: `0 8px 24px ${currentColor}66`, // Adds a dynamic glow matching the color
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          marginBottom: 16
        }}
      >
        {initials}
      </motion.div>
      
      <h3 style={{ 
        margin: 0, 
        fontSize: 18, 
        fontWeight: 700, 
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em'
      }}>
        {user?.name || 'Student Name'}
      </h3>
      {user?.username && (
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          @{user.username}
        </p>
      )}
    </div>
  );
};

export default VerifiedBadgeCard;
