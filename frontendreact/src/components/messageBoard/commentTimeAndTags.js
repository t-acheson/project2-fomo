import React from 'react';

const TimeAndTag = ({ comments }) => {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className="comment-header">
          Received at: {formatDate(comments.timestamp)}
          <br />
          test - id:{comments.id} parent:{comments.parentid}
      </div>
    );
};
export default TimeAndTag;