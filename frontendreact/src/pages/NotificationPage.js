import React from 'react';
import Header from '../components/header.js'
import Footer from '../components/footer.js';

function NotificationPage() {
  return (
    <div>  
      <header id='Header'>
              <Header />
      </header>
      <main>      
        <h1>Notification Page</h1>
        <p>This is the notification page</p>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default NotificationPage;