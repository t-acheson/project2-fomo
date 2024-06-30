import React from 'react';
import Header from '../components/header.js'
import Footer from '../components/footer.js';
import HomeHero from '../components/homeHero.js';

function HomePage() {
  return (
    <div>
      <main>
        <h1>Home Page</h1>
        <p>This is the home page</p>
        <HomeHero />
      
      </main>
    </div>
  );
}

export default HomePage;