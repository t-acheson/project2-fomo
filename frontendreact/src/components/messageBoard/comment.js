import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import LikeDislikeButton from './likeAndDislikeButton';

const Comment = ({ comment }) => {
    return (
        <ListGroup.Item key={comment.id}>
            <Card>
                <Card.Body>
                    <Card.Text>{comment.text}</Card.Text>
                    <LikeDislikeButton 
                        commentId={comment.id} 
                        likesCounts={comment.likes} 
                        dislikesCounts={comment.dislikes} />
                    <Card.Subtitle className="mb-2 text-muted">
                        Received at: {comment.timestamp}
                        <br/>
                        test - id:{comment.id} parent:{comment.parentid}
                    </Card.Subtitle>
                </Card.Body>
                {comment.replies.length > 0 && (
                    <ListGroup>
                        {comment.replies.map(reply => (
                            <Comment key={reply.id} comment={reply} />
                        ))}
                    </ListGroup>
                )}
            </Card>
        </ListGroup.Item>
    );
};

export default Comment;
