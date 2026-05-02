import { useState } from 'react';
import Navbar from './layout/Navbar';
import HeroSection from './sections/HeroSection';
import CommunitySection from './sections/CommunitySection';
import SignupSection from './sections/SignupSection';

/**
 * CampusConnectHero
 * ─────────────────
 * Top-level page shell. Controls the signup overlay state.
 *  • Navbar  (fixed, scroll-aware)
 *  • HeroSection — "Get Started" opens signup overlay
 *  • CommunitySection — scrollable second section
 *  • SignupSection — full-screen overlay, only shown on demand
 */
const CampusConnectHero = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div
      style={{
        background: '#0a0010',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Navbar onOpenSignup={() => setShowSignup(true)} />
      <HeroSection onOpenSignup={() => setShowSignup(true)} />
      <CommunitySection />

      {/* Signup modal — only mounts when triggered */}
      {showSignup && (
        <SignupSection onClose={() => setShowSignup(false)} />
      )}
    </div>
  );
};

export default CampusConnectHero;
