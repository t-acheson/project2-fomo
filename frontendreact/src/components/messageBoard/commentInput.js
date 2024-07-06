import React, { useState, useContext } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { LocationContext } from '../../App'; 
// import sendMessage function to send the message to the server
import { sendMessage } from '../../hooks/webSocket';  

const CommentInput = () => {
    const [text, setText] = useState(''); //text is the message that the user types in the input field
    const location = useContext(LocationContext); 
    // location is an object with `lat` and `lng` properties looks like : {lat: 53.2643606, lng: -6.157174}
    const { lat, lng } = location || { lat: 40.7128, lng: -74.0060 };
    
    //handleInputChange function to update the text state
    const handleInputChange = (event) => { 
        setText(event.target.value);
    };

    //handleSubmit function to generate message's attributes 
    const handleSubmit = () => { 
        const message = {text, lat, lng };
        console.log('Formating message:', message);
        sendMessage(message);
        setText('');
    };

    return (
        //InputGroup component for the input field 
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
