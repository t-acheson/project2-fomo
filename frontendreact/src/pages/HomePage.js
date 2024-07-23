import React from 'react';
import HomeHero from '../components/landing/homeHero.js';
import Features from '../components/landing/features.js';

function HomePage() {
  return (
    <div>
      <main>
        <HomeHero />
        <Features />
      </main>
    </div>
  );
}

export default HomePage;