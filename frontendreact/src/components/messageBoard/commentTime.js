import React from 'react';

const Time = ({ comments }) => {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        // Format the date in 'America/New_York' time zone
        return date.toLocaleString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
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
