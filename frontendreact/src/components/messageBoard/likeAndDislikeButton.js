import React, { useState } from 'react';
import '../cssFiles/likeAndDislikeButton.css';
import { sendMessage } from '../../hooks/webSocket';

const LikeDislikeButton = ({ commentId, likesCounts, dislikesCounts}) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(likesCounts);
    const [disliked, setDisliked] = useState(false);
    const [dislikeCount, setDislikeCount] = useState(dislikesCounts);

    const handleLike = () => {
        const newLikedState = !liked;
        const newLikesCount = liked ? likesCount - 1 : likesCount + 1;
        
        setLiked(newLikedState);
        setLikesCount(newLikesCount);
        
        if (disliked) {
            setDisliked(false);
            setDislikeCount(dislikeCount - 1);
        }
        
        sendMessage({ type: 'like', commentId, likesCount: newLikesCount, dislikeCount });
    };

    const handleDislike = () => {
        const newDislikedState = !disliked;
        const newDislikeCount = disliked ? dislikeCount - 1 : dislikeCount + 1;
        
        setDisliked(newDislikedState);
        setDislikeCount(newDislikeCount);
        
        if (liked) {
            setLiked(false);
            setLikesCount(likesCount - 1);
        }
        
        sendMessage({ type: 'dislike', commentId, likesCount, dislikeCount: newDislikeCount });
    };

    return (
        <div className="likeDislikeContainer">
            <div className="likeContainer" onClick={handleLike}>
                <div className="heartBg">
                    <div className={`heartIcon ${liked ? 'liked' : ''}`}></div>
                </div>
                <span className="likesStatus">{likesCount}</span>
            </div>
            <div className="dislikeContainer" onClick={handleDislike}>
                <div className="btnContainer">
                    <button className={`dislikeBtn ${disliked ? 'dislikeActive' : ''}`}>
                        <span className="material-symbols-outlined">heart_broken</span>
                        {dislikeCount}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LikeDislikeButton;
