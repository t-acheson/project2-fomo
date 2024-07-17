import React, { useState, useEffect } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import LikeDislikeButton from './likeAndDislikeButton';
import ReplyInput from './replyInput';
import '../cssFiles/commentDisplay.css';
import upArrow from '../../assets/up-arrow.svg'; // Adjust the path as needed
import downArrow from '../../assets/down-arrow.svg';

const Comment = ({ comment }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  useEffect(() => {
    setReplies(comment.replies || []);
  }, [comment.replies]);

  const handleReplyClick = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleReplySubmit = (reply) => {
    setReplies([...replies, reply]);
    setShowReplyInput(false);
  };

  const handleCancelReply = () => {
    setShowReplyInput(false);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className="comment">
      <ListGroup.Item key={comment.id}>
        <Card>
          <Card.Body className="card-body">
            <div className="comment-header">
              <Card.Subtitle className="mb-2 text-muted">
                Received at: {comment.timestamp}
                <br />
                test - id:{comment.id} parent:{comment.parentid}
              </Card.Subtitle>
            </div>
            <Card.Text className="comment-text">
              <h4>{comment.text}</h4>
            </Card.Text>
            <div className="comment-actions">
              <div className="left-actions">
                {replies.length > 0 && (
                  <button className="toggle-replies-button" onClick={toggleReplies}>
                    <img
                      src={showReplies ? upArrow : downArrow}
                      alt={showReplies ? 'Collapse' : 'Expand'}
                      className="arrow-icon"
                    />
                  </button>
                )}
              </div>
              <div className="right-actions">
                <LikeDislikeButton
                  commentId={comment.id}
                  likesCounts={comment.likes}
                  dislikesCounts={comment.dislikes}
                />
                <button className="reply-button" onClick={handleReplyClick}>
                  Reply
                </button>
              </div>
            </div>
            {showReplyInput && (
              <ReplyInput parentId={comment.id} onSubmitReply={handleReplySubmit} onCancelReply={handleCancelReply} />
            )}
          </Card.Body>
        </Card>
      </ListGroup.Item>
      {showReplies && replies.length > 0 && (
        <div className="nested-comments">
          {replies.map((reply) => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};
  
  export default Comment;