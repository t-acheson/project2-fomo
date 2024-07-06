import React, { useState, useContext } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { LocationContext } from '../../App';  

const CommentInput = ({ onSend }) => {
    const [text, setText] = useState('');
    const location = useContext(LocationContext);
    // location is an object with `lat` and `lng` properties looks like : {lat: 53.2643606, lng: -6.157174}
    const { lat, lng } = location || { lat: 40.7128, lng: -74.0060 };
    
    const handleInputChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = () => {
        const timestamp = new Date().toISOString();
        const message = { timestamp, text, lat, lng };
        onSend(message);
        setText('');
    };

    return (
        <InputGroup className="mb-3">
            <Form.Control
                placeholder="Enter your message"
                value={text}
                onChange={handleInputChange}
            />
            <Button variant="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </InputGroup>
    );
};

export default CommentInput;
