import React from 'react';
import Header from '../components/header.js'
import Footer from '../components/footer.js';

function MapPage() {
  return (
    <div className="Landing">
      <header id='Header'>
        <Header />
      </header>
      <main>
        <h1>map Page</h1>
        <p>This is the map page</p>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default MapPage;