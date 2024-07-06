import React from 'react';
import { Container } from 'react-bootstrap';
// import CSS but not adjusted so it might not work
import '../components/cssFiles/nestedComments.css'

import CommentInput from '../components/messageBoard/commentInput';
import CommentDisplay from '../components/messageBoard/commentDisplay';
import CommentFilters from '../components/messageBoard/commentFilters';


const FeedPage = () => {
    return (
        <Container>
            <CommentInput />
            <CommentFilters />
            <CommentDisplay comments={[]} />
        </Container>
    );
};

export default FeedPage;
