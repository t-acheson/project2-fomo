import React, { useState, useEffect } from 'react';
import '../cssFiles/dislikeButton.css';

const DislikeButton = () => {
    const [disliked, setDisliked] = useState(false);
    const [dislikeCount, setDislikeCount] = useState(0);

  const handleDislike = () => {
    setDisliked(!disliked);
    setDislikeCount(disliked ? dislikeCount -1 : dislikeCount + 1);
  };

  return (
    <div className='dislikeContainer' onClick={handleDislike}>
    <div className="btnContainer">
        <button className= {'dislikeBtn ${activeBtn === "dislike" ? "dislikeActive" : ""}'}>
        <span class="material-symbols-outlined">
            heart_broken
        </span>
        {dislikeCount}
        </button>
    </div>
    </div>
  );
};

export default DislikeButton;