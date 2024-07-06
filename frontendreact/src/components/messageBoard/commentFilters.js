import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const CommentFilters = () => {
    return (
        <ButtonGroup aria-label="Basic example">
            <Button variant="secondary">All</Button>
            <Button variant="secondary">Hang-out</Button>
            <Button variant="secondary">Event</Button>
            <Button variant="secondary">Chit Chat</Button>
        </ButtonGroup>
    );
};

export default CommentFilters;
