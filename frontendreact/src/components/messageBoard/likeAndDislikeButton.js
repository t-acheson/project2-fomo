import React, { useState, useEffect } from 'react';
import '../cssFiles/likeAndDislikeButton.css';
import { sendMessage } from '../../hooks/webSocket';

const LikeDislikeButton = ({ commentId, likesCounts, dislikesCounts, liked: initialLiked, disliked: initialDisliked }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(likesCounts);
    const [disliked, setDisliked] = useState(initialDisliked);
    const [dislikeCount, setDislikeCount] = useState(dislikesCounts);

    useEffect(() => {
        setLikesCount(likesCounts);
    }, [likesCounts]);

    useEffect(() => {
        setDislikeCount(dislikesCounts);
    }, [dislikesCounts]);

    useEffect(() => {
        setLiked(initialLiked);
    }, [initialLiked]);

    useEffect(() => {
        setDisliked(initialDisliked);
    }, [initialDisliked]);

    const handleLike = () => {
        if (!liked) {
            setLiked(true);
            if (disliked) {
                setDisliked(false);
            }
            sendMessage({ type: 'like_update', commentid: commentId, like: true });
        } else {
            setLiked(false);
            sendMessage({ type: 'like_update', commentid: commentId, like: false });
        }
    };

    const handleDislike = () => {
        if (!disliked) {
            setDisliked(true);
            if (liked) {
                setLiked(false);
            }
            sendMessage({ type: 'dislike_update', commentid: commentId, dislike: true });
        } else {
            setDisliked(false);
            sendMessage({ type: 'dislike_update', commentid: commentId, dislike: false });
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
                <div className="heartBrokenBg">
                    <button className={`dislikeBtn ${disliked ? 'dislikeActive' : ''}`}>
                        <span className="material-symbols-outlined">heart_broken</span>
                    </button>
                </div>
                <span className="dislikesStatus">{dislikeCount}</span>
            </div>
        </div>
    );
};

export default LikeDislikeButton;
