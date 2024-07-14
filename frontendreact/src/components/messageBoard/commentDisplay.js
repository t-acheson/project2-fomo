import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
<<<<<<< HEAD
import LikeDislikeButton from './likeAndDislikeButton';
=======
import '../cssFiles/commentDisplay.css';
>>>>>>> parent of 437eaf1 (comment display works.)

const CommentDisplay = ({ comments }) => {
    return (
        <div className="comment-container">
            {comments.length === 0 ? (
                <div className="loading-message">Loading...</div>
            ) : (
                <ListGroup>
                    {comments.map((comment, index) => (
                        <ListGroup.Item key={index}>
                            <Card>
                                <Card.Body>
                                    <Card.Text>{comment.text}</Card.Text>
                                    <LikeDislikeButton commentId={comment.id}/>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Received at: {comment.timestamp}
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default CommentDisplay;
