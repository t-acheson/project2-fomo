import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import Comment from './comment';
import { nestComments } from './nestedComments';

const CommentDisplay = ({ comments }) => {
    console.log('Comments received in CommentDisplay:', comments);
    const nestedComments = nestComments(comments);
    console.log('Nested comments to be displayed:', nestedComments);
    

    return (
        <div className="comment-container">
            {nestedComments.length === 0 ? (
                <div className="loading-message">No Comments Available</div>
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