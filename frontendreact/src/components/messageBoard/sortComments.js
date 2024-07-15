import React, { useEffect, useState } from 'react';
import CommentDisplay from './commentDisplay';

const SortedComments = ({ comments, sortCriteria }) => {
    const [sortedComments, setSortedComments] = useState([]);
  
    useEffect(() => {
      const sortComments = () => {
        const sorted = [...comments].sort((a, b) => {
          if (sortCriteria === 'most_recent') {
            return new Date(b.timestamp) - new Date(a.timestamp);
          } else if (sortCriteria === 'most_likes') {
            return b.likes - a.likes;
          }
          return 0;
        });
        setSortedComments(sorted);
      };
  
      sortComments();
    }, [comments, sortCriteria]);
  
    return <CommentDisplay comments={sortedComments} />;
  };
  
  export default SortedComments;