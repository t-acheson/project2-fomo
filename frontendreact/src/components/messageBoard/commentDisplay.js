import React from 'react';
import { ListGroup } from 'react-bootstrap';
import Comment from './comment';
import { nestComments } from './nestedComments';
import moment from 'moment-timezone';

const CommentDisplay = ({ comments }) => {
    console.log('Comments received in CommentDisplay:', comments);

    // Get the current time in New York
    const currentTimeNY = moment().tz('America/New_York');

    // Filter out comments with a timestamp in the future
    const filteredComments = comments.filter(comment => {
        const commentTime = moment(comment.timestamp);
        return commentTime.isSameOrBefore(currentTimeNY);
    }).map(comment => ({
        ...comment,
        timestamp: moment(comment.timestamp).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss') // Format timestamp to New York time
    }));

    const nestedComments = nestComments(filteredComments);
    console.log('Nested comments to be displayed:', nestedComments);

    const noCommentsStyle = {
        color: 'white', 
        fontSize: '16px' 
    };

    return (
        <div className="comment-container">
            {nestedComments.length === 0 ? (
                <div className="loading-message" style={noCommentsStyle}>
                    No Comments Available
                </div>
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
