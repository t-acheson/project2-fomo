import React from 'react';
import Header from '../components/header.js'
import Footer from '../components/footer.js';

function FeedPage() {
  return (
    <div>
      <header id='Header'>
        <Header />
      </header>
      <main>
        <h1>Feed Page</h1>
        <p>This is the feed page</p>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default FeedPage;