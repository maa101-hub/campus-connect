import { useState } from 'react';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import HeroSection from './sections/HeroSection';
import CommunitySection from './sections/CommunitySection';
import ContactSection from './sections/ContactSection';
import AboutSection from './sections/AboutSection';
import StatsSection from './sections/StatsSection';
import SignupSection from './sections/SignupSection';
import { ScrollProgressBar, SectionIndicator } from './ScrollAnimations';

const SECTIONS = ['hero', 'about', 'community', 'contact'];

/**
 * CampusConnectHero
 * ─────────────────
 * Top-level page shell. Controls the signup overlay state.
 */
const CampusConnectHero = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div
      style={{
        background: '#0a0010',
        minHeight: '100dvh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <ScrollProgressBar />
      <SectionIndicator sections={SECTIONS} />
      <Navbar onOpenSignup={() => setShowSignup(true)} />
      
      <HeroSection onOpenSignup={() => setShowSignup(true)} />
      <AboutSection />
      <StatsSection />
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
