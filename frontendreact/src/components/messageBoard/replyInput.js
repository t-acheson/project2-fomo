import React, { useState } from 'react';
import { sendMessage } from '../../hooks/webSocket';  

const ReplyInput = ({  parentId, onSubmitReply, onCancelReply }) => {
  const [replyText, setReplyText] = useState('');

  const handleReplyInputChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleReplySubmit = () => {
    if (replyText.trim() === '') {
        alert('Reply cannot be empty');
        return;
      }
      sendMessage({ type: 'reply_update', parentid: parentId, text: replyText,});
      setReplyText('');
      onCancelReply(); 
    };

  const handleCancelClick = () => {
    onCancelReply();
    setReplyText('');
  };

  return (
    <div className="reply-input">
      <input
        type="text"
        value={replyText}
        onChange={handleReplyInputChange}
        placeholder="Enter your reply"
      />
      <button onClick={handleReplySubmit}>Submit Reply</button>
      <button onClick={handleCancelClick}>Cancel</button>
    </div>
  );
};

export default ReplyInput;