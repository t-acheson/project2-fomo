import React, { useState } from 'react';
import '../cssFiles/likeButton.css'

const LikeButton = () => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
  
    const handleLike = () => {
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    };
      // to send likesCount to WebSocket server
      socket.send(JSON.stringify({ likesCount }));
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
  