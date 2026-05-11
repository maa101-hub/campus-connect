import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, ChevronRight, CheckCircle2 } from 'lucide-react';

const PollWidget = () => {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const poll = {
    question: "Next College Fest Theme?",
    options: [
      { id: 1, text: "Cyberpunk Night", votes: 45 },
      { id: 2, text: "Retro 80s", votes: 25 },
      { id: 3, text: "Garden of Eden", votes: 30 }
    ]
  };

  const handleVote = (id) => {
    setSelectedOption(id);
    setVoted(true);
    // In a real app, you'd call an API here
  };

  const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="right-card poll-card" style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)' }}>
          <Vote size={18} />
          <span style={{ fontWeight: 700, fontSize: 14 }}>Campus Voice</span>
        </div>
        <span style={{ fontSize: 10, background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>LIVE</span>
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px 0', lineHeight: 1.4 }}>
        {poll.question}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {poll.options.map((option) => {
          const percentage = voted ? Math.round((option.votes + (selectedOption === option.id ? 1 : 0)) / (totalVotes + 1) * 100) : 0;
          
          return (
            <motion.div
              key={option.id}
              whileHover={!voted ? { x: 4 } : {}}
              onClick={() => !voted && handleVote(option.id)}
              style={{
                position: 'relative',
                padding: '12px 16px',
                borderRadius: 12,
                background: voted && selectedOption === option.id ? 'rgba(var(--accent-rgb), 0.05)' : 'var(--bg-tertiary)',
                border: `1px solid ${voted && selectedOption === option.id ? 'var(--accent)' : 'var(--border)'}`,
                cursor: voted ? 'default' : 'pointer',
                overflow: 'hidden'
              }}
            >
              {/* Progress Bar Background */}
              <AnimatePresence>
                {voted && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: selectedOption === option.id ? 'rgba(var(--accent-rgb), 0.1)' : 'rgba(0,0,0,0.03)',
                      zIndex: 0
                    }}
                  />
                )}
              </AnimatePresence>

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: voted && selectedOption === option.id ? 'var(--accent)' : 'var(--text-primary)' }}>
                  {option.text}
                </span>
                {voted ? (
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>{percentage}%</span>
                ) : (
                  <ChevronRight size={14} className="poll-arrow" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {voted && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 11, justifyContent: 'center' }}
        >
          <CheckCircle2 size={12} />
          <span>Thank you for voting! {totalVotes + 1} students participated.</span>
        </motion.div>
      )}
    </div>
  );
};

export default PollWidget;
