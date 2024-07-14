import React, { useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import LikeDislikeButton from './likeAndDislikeButton';
import '../cssFiles/commentDisplay.css';

const Comment = ({ comment }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplyClick = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleReplyInputChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleReplySubmit = () => {
    // *To add reply submission logic here
    setShowReplyInput(false);
    setReplyText('');
  };

  return (
    <ListGroup.Item key={comment.id}>
      <Card>
        <Card.Body>
          <Card.Text><h4>{comment.text}</h4></Card.Text>
          <div className="button-group-right">
            <LikeDislikeButton 
              commentId={comment.id} 
              likesCounts={comment.likes} 
              dislikesCounts={comment.dislikes} 
            />
            <button className="reply-button" onClick={handleReplyClick}>Reply</button>
          </div>
          <Card.Subtitle className="mb-2 text-muted">
            Received at: {comment.timestamp}
            <br/>
            test - id:{comment.id} parent:{comment.parentid}
          </Card.Subtitle>
          {showReplyInput && (
            <div className="reply-input">
              <input
                type="text"
                value={replyText}
                onChange={handleReplyInputChange}
                placeholder="Enter your reply"
              />
              <button onClick={handleReplySubmit}>Submit Reply</button>
            </div>
          )}
        </Card.Body>
        {comment.replies.length > 0 && (
          <Card.Body>
            <ListGroup>
              {comment.replies.map(reply => (
                <Comment key={reply.id} comment={reply} />
              ))}
            </ListGroup>
          </Card.Body>
        )}
      </Card>
    </ListGroup.Item>
  );
};

export default Comment;