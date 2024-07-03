import React from 'react';
import '../components/messageBoard/messageBoard.js'
import MessageBoard from '../components/messageBoard/messageBoard.js';
import '../components/cssFiles/nestedComments.css'



function FeedPage() {
  return (
    <div>
      <main>
        <MessageBoard />
      </main>
    </div>
  );
}

export default FeedPage;