import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
  'Gestures': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🦾'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '💌', '💋', '😻'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦅', '🦉', '🐝', '🦋', '🐌', '🐛'],
  'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍔', '🍕', '🌮', '🍜', '🍣', '🍰', '☕', '🧋'],
  'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🎯', '🎮', '🎲', '🧩', '🎭', '🎨', '🎬', '🎤', '🎧', '🎵', '🎶', '🎹'],
  'Objects': ['💡', '🔥', '⭐', '🌟', '✨', '💫', '🎉', '🎊', '🏆', '🥇', '📱', '💻', '⌨️', '🖥️', '📷', '📚', '✏️', '📌', '🔑', '🛠️', '⚙️', '🧲', '🎓', '💼'],
};

const EmojiPicker = ({ onSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('Smileys');
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState('');
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
  const filteredEmojis = search
    ? allEmojis.filter(() => true) // Can't search emojis by name without a mapping, show all
    : EMOJI_CATEGORIES[activeCategory];

  return (
    <motion.div
      ref={pickerRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'absolute', bottom: '100%', right: 0, marginBottom: 8,
        width: 320, borderRadius: 16,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        overflow: 'hidden', zIndex: 1000,
      }}
    >
      {/* Category Tabs */}
      <div style={{
        display: 'flex', gap: 2, padding: '8px 8px 0',
        borderBottom: '1px solid var(--border-color)',
        overflowX: 'auto',
      }}>
        {Object.keys(EMOJI_CATEGORIES).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 10px', borderRadius: 8, border: 'none',
              background: activeCategory === cat ? 'var(--accent-light)' : 'transparent',
              color: activeCategory === cat ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)',
        gap: 2, padding: 8, maxHeight: 200, overflowY: 'auto',
      }}>
        {(filteredEmojis || []).map((emoji, i) => (
          <button
            key={`${emoji}-${i}`}
            onClick={() => { onSelect(emoji); onClose(); }}
            style={{
              width: 36, height: 36, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 20, border: 'none', background: 'transparent',
              borderRadius: 8, cursor: 'pointer', transition: 'all 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default EmojiPicker;
