import React from 'react';
import '../cssFiles/commentTags.css'; // Ensure to create and link a CSS file for styles

const CommentTags = ({ tags }) => {
    const tagArray = Array.isArray(tags) ? tags : Object.values(tags);

    return (
        <div className="comment-tags">
            {tagArray.map((tag, index) => (
                <span key={index} className="tag">
                    {tag}
                </span>
            ))}
        </div>
    );
};

export default CommentTags;
