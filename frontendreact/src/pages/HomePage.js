import React from 'react';
import HomeHero from '../components/landing/homeHero.js';
import Features from '../components/landing/features.js';
import Try from '../components/landing/tryIt.js';

function HomePage() {
  return (
    <div>
      <main>
        <HomeHero />
        <Features />
        <Try />
      </main>
    </div>
  );
}

export default HomePage;