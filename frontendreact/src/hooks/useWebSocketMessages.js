import { useEffect } from 'react';
import { listenForMessages, sendMessage } from './webSocket';
import moment from 'moment-timezone';

const useWebSocketMessages = (setComments) => {
  useEffect(() => {
    const handleMessage = (message) => {
      console.log('New message received:', message);

      // Get the current time in New York
      // const currentTimeNY = moment().tz('America/New_York');

      if (message.type === 'ping') {
        // If the message type is 'ping', send back 'pong'
        sendMessage({ type: 'pong' });
        return;
      }

      // Assume messages that are simple comment objects
      if (message.id && message.text) {
        const { id, parentid, text, likes, dislikes, timestamp } = message;

        // const commentTime = moment(timestamp);

        // if (commentTime.isAfter(currentTimeNY)) {
        //   // If the comment time is in the future, do not display it
        //   console.warn('Received comment with future timestamp:', message);
        //   return;
        // }



        setComments((prevComments) => {
          // Update the comments state with the new comment
          const updatedComments = [...prevComments];
          const newComment = { id, parentid, text, likes, dislikes, timestamp, replies: [] };

          if (parentid) {
            // If it is a reply, find the parent comment and add it to the replies
            const parentComment = updatedComments.find(comment => comment.id === parentid);
            if (parentComment) {
              parentComment.replies.push(newComment);
            } else {
              console.warn(`Parent comment with ID ${parentid} not found`);
            }
          } else {
            // If it is a top-level comment, add it to the list
            updatedComments.push(newComment);
          }

          return updatedComments;
        });
        return;
      }

      const { type, comment, commentid, likes, dislikes } = message;

      if (!type) {
        console.warn('Received malformed message:', message);
        return;
      }

      setComments((prevComments) => {
        let updatedComments = [...prevComments];
        
        switch (type) {
          case 'new_comment':
            updatedComments = [...prevComments, comment];
            break;
          case 'reply_update':
            updatedComments = [...prevComments, comment]; // Add reply directly without nesting
            break;
          case 'like_update':
            updatedComments = prevComments.map((c) =>
              c.id === commentid ? { ...c, likes } : c
            );
            break;
          case 'dislike_update':
            updatedComments = prevComments.map((c) =>
              c.id === commentid ? { ...c, dislikes } : c
            );
            break;
          default:
            console.warn('Unknown message type:', type);
        }
        
        return updatedComments;
      });
    };

    const cleanup = listenForMessages(handleMessage);

    // Cleanup function to close WebSocket connection on component unmount
    return () => {
      if (cleanup) cleanup();
    };
  }, [setComments]);
};

export default useWebSocketMessages;
