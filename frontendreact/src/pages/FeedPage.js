import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import CommentInput from '../components/messageBoard/commentInput';
import CommentDisplay from '../components/messageBoard/commentDisplay';
import CommentTag from '../components/messageBoard/commentTag';
import { listenForMessages } from '../hooks/webSocket'; // Import the listenForMessages function from the websocket file

const FeedPage = () => {
    const [comments, setComments] = useState([]);  // State to hold the comments

    useEffect(() => {
        // Function to handle incoming messages
        const handleMessage = (message) => {
            console.log('New message received:', message);
            // Check if the message has the necessary properties
            if (message && message.id && message.text) {
                setComments(prevComments => [...prevComments, message]);  // Update state with new comment
            } else {
                console.warn('Received malformed message:', message);
            }
        };

        // Start listening for messages
        const cleanup = listenForMessages(handleMessage);
        
        return () => {
            // Call the cleanup function to close the WebSocket connection
            if (cleanup) cleanup();
        };
    }, []); // Only run once when the component mounts
    
    return (
        <Container>
            <CommentInput />
            <CommentTag />
            <CommentDisplay comments={comments}  />
        </Container>
    );
};

export default FeedPage;
