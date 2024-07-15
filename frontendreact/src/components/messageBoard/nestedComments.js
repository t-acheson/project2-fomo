// Function checks comments for their parent id. 
// If present then add comment into the replies array of the map.
// Else Add to comment to nestedComments. 
// Then go through replies array and add each child to parent replies array.
const nestComments = (comments) => {
    const commentMap = {};
    const nestedComments = [];
    const replies = [];
  
    console.log('hhhhhhhhhhhhhhhhhhhhhhhhhh:', comments);
    // Step 1: Populate the commentMap with each comment and separate replies
    comments.forEach(comment => {
      if (comment.parentid) {
        console.log('Found reply:', comment);
        replies.push(comment);
      } else {
        commentMap[comment.id] = { ...comment, replies: [] };
        nestedComments.push(commentMap[comment.id]);
      }
    });
  
    console.log('Comment map after initial population:', commentMap);
    console.log('Replies separated:', replies);
  
    // Add replies to their respective parent comments
    replies.forEach(reply => {
      const parentComment = commentMap[reply.parentid];
      if (parentComment) {
        console.log(`Adding reply to parent comment with ID ${reply.parentid}:`, reply);
        parentComment.replies.push(reply);
      } else {
        console.warn(`Parent comment with ID ${reply.parentid} not found`);
      }
    });
  
    console.log('Nested comments after adding replies:', nestedComments);
    return nestedComments;
  };
  
  export { nestComments };
  