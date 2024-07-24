import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const CommentFilter = ({ setSortCriteria }) => {
  return (
    <DropdownButton
      id="dropdown-basic-button"
      title="Sort Comments"
      variant="warning"
      className="ml-auto"
    >
      <Dropdown.Item onClick={() => setSortCriteria('most_recent')}>Most Recent</Dropdown.Item>
      <Dropdown.Item onClick={() => setSortCriteria('most_likes')}>Most Likes</Dropdown.Item>
    </DropdownButton>
  );
};

export default CommentFilter;