import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import HeroSection from './components/HeroSection';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500); // 2.5s splash
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? <SplashScreen /> : <HeroSection />}
    </>
  );
}

export default App; 