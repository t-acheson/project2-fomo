// Function checks comments for their parent id. 
// If present then add comment into the replies array of the map.
// Else Add to comment to nestedComments. 
// Then go through replies array and add each child to parent replies array.
const nestComments = (comments) => {
  const commentMap = {};
  const nestedComments = [];

  // Step 1: Populate the commentMap with each comment
  comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
  });

  // Step 2: Build the nested comment structure
  comments.forEach(comment => {
      if (comment.parentid) {
          const parentComment = commentMap[comment.parentid];
          if (parentComment) {
              parentComment.replies.push(commentMap[comment.id]);
          } else {
              console.warn(`Parent comment with ID ${comment.parentid} not found`);
          }
      } else {
          nestedComments.push(commentMap[comment.id]);
      }
  });

  return nestedComments;
};

export { nestComments };

  