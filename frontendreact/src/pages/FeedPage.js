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
            setComments(prevComments => [...prevComments, message]);  // 更新状态，添加新评论
        };

        listenForMessages(handleMessage);  // start listening for messages
        return () => {
            // call a websocket close function 
        };
    }, []); // only run once when the component mounts
    return (
        <Container>
            <CommentInput />
            <CommentTag />
            <CommentDisplay comments={comments}  />
        </Container>
    );
};

export default FeedPage;
