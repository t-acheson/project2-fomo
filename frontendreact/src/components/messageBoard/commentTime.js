import React from 'react';

const Time = ({ comments }) => {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className="comment-metadata">
            Received at: {formatDate(comments.timestamp)}
            <br />
            Test - ID: {comments.id} Parent: {comments.parentid}
        </div>
    );
};

export default Time;
