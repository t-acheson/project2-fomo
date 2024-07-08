import React, { useState } from 'react';
import '../cssFiles/likeButton.css'
// import socket from '../../webSocket';
import { sendMessage } from '../../webSocket';

const LikeButton = ({messageId, updateLikeCount}) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
  
    const handleLike = () => {
      setLiked(!liked);
      const newLikesCount = liked ? likesCount - 1 : likesCount + 1;
      setLikesCount(newLikesCount);
      updateLikeCount(messageId, newLikesCount);
  
      // Send the likesCount to WebSocket server
      sendMessage({ messageId, likesCount: newLikesCount });
    };
    
    return (
      <div className="likeButton" onClick={handleLike}>
        <div className="heartBg">
          <div className={`heartIcon ${liked ? 'liked' : ''}`}></div>
        </div>
        <span className="likesStatus">{likesCount}</span>
      </div>
    );
  };
  
  export default LikeButton;
  