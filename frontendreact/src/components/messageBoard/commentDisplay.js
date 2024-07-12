import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import Comment from './comment';
import { nestComments } from './nestedComments';

const CommentDisplay = ({ comments }) => {
    const nestedComments = nestComments(comments);

    return (
        <div className="comment-container">
            {nestedComments.length === 0 ? (
                <div className="loading-message">Loading...</div>
            ) : (
                <ListGroup className='commentBox'>
                    {nestedComments.map(comment => (
                        <Comment key={comment.id} comment={comment} />
                    ))}
                </ListGroup>
            )}
        </div>
    );
};
export default CommentDisplay;