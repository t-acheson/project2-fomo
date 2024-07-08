import React from 'react';
import HomeHero from '../components/homeHero.js';
import About from '../components/aboutUs.js';

function HomePage() {
  return (
    <div>
      <main>
        <HomeHero />
        <About />
      </main>
    </div>
  );
}

export default HomePage;