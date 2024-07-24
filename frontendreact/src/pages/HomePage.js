import React from 'react';
import HomeHero from '../components/homeHero.js';
// import About from '../components/aboutUs.js';
import Features from '../components/landing/features.js';
import Try from '../components/tryIt.js';

function HomePage() {
  return (
    <div>
      <main>
        <HomeHero />
        <Features />
        <Try />
        {/* <About /> */}
      </main>
    </div>
  );
}

export default HomePage;