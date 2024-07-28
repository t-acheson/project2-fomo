import React from 'react';
import CommentDisplay from './commentDisplay';

const SortedComments = ({ comments, sortCriteria,selectedTags }) => {
  // Filter comments based on selected tags
  const filteredComments = selectedTags.length > 0
    ? comments.filter(comment => selectedTags.every(tag => Object.values(comment.tags || {}).includes(tag)))
    : comments;
  
  // Sort comments based on sortCriteria
  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortCriteria === 'most_recent') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else if (sortCriteria === 'most_likes') {
      return b.likes - a.likes;
    }
    return 0;
  });

  return <CommentDisplay comments={sortedComments} />;
};
export default SortedComments;
