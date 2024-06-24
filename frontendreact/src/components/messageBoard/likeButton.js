import React, { useState } from 'react';
import '../cssFiles/likeButton.css'

const LikeButton = () => {
    const [liked, setLiked] = useState(false);
  
    const handleLike = () => {
      setLiked(!liked);
    };
  
    return (
      <div className="likeButton" onClick={handleLike}>
        <div className="heartBg">
          <div className={`heartIcon ${liked ? 'liked' : ''}`}></div>
        </div>
        <span className="likesStatus">{liked ? 1 : 0}</span>
      </div>
    );
  };
  
  export default LikeButton;
  