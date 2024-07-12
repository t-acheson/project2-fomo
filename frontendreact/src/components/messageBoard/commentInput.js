import React, { useState, useContext } from 'react';
import { Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { LocationContext } from '../../App'; 
import { sendMessage } from '../../hooks/webSocket';  
import '../cssFiles/commentInput.css';


const CommentInput = () => {
    const [text, setText] = useState('');
    const location = useContext(LocationContext); 
    const { lat, lng } = location || { lat: 40.7128, lng: -74.0060 };
    const maxLength = 280; // Maximum length for the input

    const handleInputChange = (event) => { 
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
        }
    };

    const handleSubmit = () => { 
        sendMessage({type: 'new_comment', text: text, lat:lat, lng:lng });
        setText('');
    };

    return (
        <InputGroup className="input-group">
            <FormControl
                className="input-box" 
                placeholder="Enter your message(280 characters max)"
                value={text}
                onChange={handleInputChange}
                maxLength={maxLength}  // limit the maximum length
            />
            <Button variant="primary" onClick={handleSubmit} className="button">
                Submit
            </Button>
            <Form.Text className="text-muted">
                {text.length}/{maxLength} characters
            </Form.Text>
        </InputGroup>
    );
};

export default CommentInput;
