import React from 'react';
import UserInputForm
from '../components/userInputForm.js';
import '../components/messageBoard/messageBoard.js'
import MessageBoard from '../components/messageBoard/messageBoard.js';
import { useState } from 'react';
import Comment from '../components/messageBoard/comment.js';
import '../components/cssFiles/nestedComments.css'
import useNode from '../hooks/useNode.js';

const comments = {
  id: 1,
  items: [] // Empty by default. Will include list of nested comments when added
};

function FeedPage() {
  const [commentsData, setCommentsData] = useState(comments);

  const {insertNode} = useNode();

  const handleInsertNode = (folderId, item) => {
    const finalStructure = insertNode(commentsData,folderId, item);
    setCommentsData(finalStructure);
  };

  return (
    <div>
      <main>
        <UserInputForm/>
        <div className='Feed'>
          <Comment handleInsertNode={handleInsertNode} comment={commentsData}/>
        </div>
      </main>
    </div>
  );
}

export default FeedPage;