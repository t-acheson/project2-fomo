import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Dropdown, DropdownButton} from 'react-bootstrap';
import CommentInput from '../components/messageBoard/commentInput';
import CommentDisplay from '../components/messageBoard/commentDisplay';
import TagFilter from '../components/messageBoard/commentTag';
import CommentFilter from '../components/messageBoard/commentFilters';
import SortedComments from '../components/messageBoard/sortComments';
import { sendMessage } from '../hooks/webSocket';
import { listenForMessages } from '../hooks/webSocket'; // Import the listenForMessages function from the websocket file


const FeedPage = () => {
  const [comments, setComments] = useState([]); // State to hold the comments
  const [sortCriteria, setSortCriteria] = useState('most_recent'); // State for sorting criteria
  const [selectedTags, setSelectedTags] = useState([]); // State for selected tags

  useEffect(() => {
    const handleMessage = (message) => {
      console.log('New message received:', message);
  
      if (message.type === 'ping') {
        sendMessage({ type: 'pong' });
        return;
      }
  
      let type, comment, commentid, likes, dislikes;
  
      if (message.type && message.comment) {
        type = message.type;
        comment = message.comment;
      } else if (message.id && message.text) {
        type = 'new_comment';
        comment = message;
      } else if (message.type && message.commentid) {
        type = message.type;
        commentid = message.commentid;
        likes = message.likes;
        dislikes = message.dislikes;
      } else {
        console.warn('Received malformed message:', message);
        return;
      }
  
      if (type === 'new_comment') {
        setComments((prevComments) => {
          const updatedComments = [...prevComments, comment];
          console.log('Updated comments state (new_comment):', updatedComments);
          return updatedComments;
        });
      } else if (type === 'reply_update') {
        setComments((prevComments) => {
          const updatedComments = [...prevComments, comment]; // Add reply directly without nesting
          console.log('Updated comments state (reply_update):', updatedComments);
          return updatedComments;
        });
      } else if (type === 'like_update') {
        setComments((prevComments) => {
          const updatedComments = prevComments.map((c) =>
            c.id === commentid ? { ...c, likes } : c
          );
          console.log('Updated comments state (like_update):', updatedComments);
          return updatedComments;
        });
      } else if (type === 'dislike_update') {
        setComments((prevComments) => {
          const updatedComments = prevComments.map((c) =>
            c.id === commentid ? { ...c, dislikes } : c
          );
          console.log('Updated comments state (dislike_update):', updatedComments);
          return updatedComments;
        });
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

  useEffect(() => {
    console.log('Comments received in FeedPage:', comments);
  }, [comments]);

  return (
    <Container>
      <CommentInput />
      <Row className="mt-3">
        <Col className="feedpage-tag-filter-container">
          <TagFilter className="feedpage-tag-select" setSelectedTags={setSelectedTags} />
          <CommentFilter className="feedpage-sort-dropdown" setSortCriteria={setSortCriteria} />
        </Col>
      </Row>
      <SortedComments comments={comments} sortCriteria={sortCriteria} selectedTags={selectedTags || []} />
    </Container>
  );
};

export default FeedPage;