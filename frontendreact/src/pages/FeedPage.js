import React from 'react';
import Header from '../components/header.js'
import Footer from '../components/footer.js';
import UserInputForm
from '../components/userInputForm.js';
import '../components/messageBoard/messageBoard.js'
import MessageBoard from '../components/messageBoard/messageBoard.js';

function FeedPage() {
  return (
    <div>
      <main>
        <UserInputForm/>
        <MessageBoard />
      </main>
    </div>
  );
}

export default FeedPage;