import React, { useState } from 'react';
import '../cssFiles/likeAndDislikeButton.css';

const LikeDislikeButton = () => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [disliked, setDisliked] = useState(false);
    const [dislikeCount, setDislikeCount] = useState(0);

    const handleLike = () => {
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        if (disliked) {
            setDisliked(false);
            setDislikeCount(dislikeCount - 1);
        }
    };

    const handleDislike = () => {
        setDisliked(!disliked);
        setDislikeCount(disliked ? dislikeCount - 1 : dislikeCount + 1);
        if (liked) {
            setLiked(false);
            setLikesCount(likesCount - 1);
        }
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
