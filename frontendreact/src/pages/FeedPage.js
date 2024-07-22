import React from 'react';
import { Container } from 'react-bootstrap';
import CommentInput from '../components/messageBoard/commentInput';
import CommentDisplay from '../components/messageBoard/commentDisplay';
import CommentTag from '../components/messageBoard/commentTag';


const FeedPage = () => {
    return (
        <Container>
            <CommentInput />
            <CommentTag />
            <CommentDisplay comments={[]} />
        </Container>
    );
};

export default FeedPage;
