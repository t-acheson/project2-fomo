import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const CommentDisplay = ({ comments }) => {
    return (
        <ListGroup>
            {comments.map((comment, index) => (
                <ListGroup.Item key={index}>
                    <Card>
                        <Card.Body>
                            <Card.Text>{comment.text}</Card.Text>
                            <Card.Subtitle className="mb-2 text-muted">
                                Received at: {comment.timestamp}
                            </Card.Subtitle>
                        </Card.Body>
                    </Card>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default CommentDisplay;
