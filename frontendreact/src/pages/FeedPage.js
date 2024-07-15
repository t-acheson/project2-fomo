import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import CommentInput from '../components/messageBoard/commentInput';
import CommentDisplay from '../components/messageBoard/commentDisplay';
import CommentTag from '../components/messageBoard/commentTag';
import { listenForMessages } from '../hooks/webSocket'; // Import the listenForMessages function from the websocket file

const FeedPage = () => {
    const [comments, setComments] = useState([]);  // State to hold the comments

    useEffect(() => {
        const handleMessage = (message) => {
          console.log('New message received:', message);
    
          let type, comment;
          if (message.type && message.comment) {
            type = message.type;
            comment = message.comment;
          } else if (message.id && message.text) {
            type = 'new_comment';
            comment = message;
          } else {
            console.warn('Received malformed message:', message);
            return;
          }

          if (type === 'new_comment') {
            setComments((prevComments) => [...prevComments, comment]);
          } else if (type === 'reply_update') {
            setComments((prevComments) =>
              prevComments.map((comm) =>
                comm.id === comment.parentid
                  ? { ...comm, replies: [...(comm.replies || []), comment] }
                  : comm
              )
            );
          } else {
            console.warn('Unknown message type:', type);
          }
        };
    
        const cleanup = listenForMessages(handleMessage);
    
        // Cleanup function to close WebSocket connection on component unmount
        return () => {
          if (cleanup) cleanup();
        };
      }, []);
    
    
    return (
        <Container>
            <CommentInput />
            <CommentTag />
            <CommentDisplay comments={comments}  />
        </Container>
    );
};

export default FeedPage;
