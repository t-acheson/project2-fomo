import React, { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import '../cssFiles/commentTag.css';


const CommentTag = () => {
    const [active, setActive] = useState('#Hang-out');

    const handleSelect = (tag) => {
        setActive(tag);
    };

    return (
        <ButtonGroup className="button-group" aria-label="Basic example">
            <Button variant={active === 'Hang-out' ? 'primary' : 'secondary'} onClick={() => handleSelect('Hang-out')}>Hang-out</Button>
            <Button variant={active === 'Event' ? 'primary' : 'secondary'} onClick={() => handleSelect('Event')}>Event</Button>
            <Button variant={active === 'Chit Chat' ? 'primary' : 'secondary'} onClick={() => handleSelect('Chit Chat')}>Chit Chat</Button>
        </ButtonGroup>

    );
};

export default CommentTag;

