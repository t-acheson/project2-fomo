import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const CommentTag = ({ onSelectTag }) => {
    const [tag, setTag] = useState('');

    const handleTagChange = (event) => {
        setTag(event.target.value);
        onSelectTag(event.target.value);
    };

    return (
        <Form.Select aria-label="Select tag" value={tag} onChange={handleTagChange}>
            <option value="">Choose a tag...</option>
            <option value="Important">Important</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
        </Form.Select>
    );
};

export default CommentTag;
