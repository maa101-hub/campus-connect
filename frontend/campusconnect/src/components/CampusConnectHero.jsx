import { useState } from 'react';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import HeroSection from './sections/HeroSection';
import CommunitySection from './sections/CommunitySection';
import ContactSection from './sections/ContactSection';
import AboutSection from './sections/AboutSection';
import SignupSection from './sections/SignupSection';

/**
 * CampusConnectHero
 * ─────────────────
 * Top-level page shell. Controls the signup overlay state.
 *  • Navbar  (fixed, scroll-aware)
 *  • HeroSection — "Get Started" opens signup overlay
 *  • AboutSection — Story and mission
 *  • CommunitySection — Live feed and cards
 *  • ContactSection — Get in touch
 *  • Footer — Site links and credits
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
      <AboutSection />
      <CommunitySection />
      <ContactSection />
      
      <Footer />

      {/* Signup modal — only mounts when triggered */}
      {showSignup && (
        <SignupSection onClose={() => setShowSignup(false)} />
      )}
    </div>
  );
};

export default CampusConnectHero;
