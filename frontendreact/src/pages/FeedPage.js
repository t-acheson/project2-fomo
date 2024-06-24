import React from 'react';
import Header from '../components/header.js'
import Footer from '../components/footer.js';
import UserInputForm
 from '../components/userInputForm.js';
function FeedPage() {
  return (
    <div>
      <header id='Header'>
        <Header />
      </header>
      <main>
        <UserInputForm/>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default FeedPage;