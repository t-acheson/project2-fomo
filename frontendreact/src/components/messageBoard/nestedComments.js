// Function checks comments for their parent id. 
// If present then add comment into the replies array of the map.
// Else Add to comment to nestedComments. 
// Then go through replies array and add each child to parent replies array.
const nestComments = (comments) => {
    const commentMap = {};
    const nestedComments = [];
    const replies = [];

    // Step 1: Populate the commentMap with each comment and separate replies
    comments.forEach(comment => {
        if (comment.parentid) {
            replies.push(comment);
        } else {
            commentMap[comment.id] = { ...comment, replies: [] };
            nestedComments.push(commentMap[comment.id]);
        }
    });

    // Add replies to their respective parent comments
    replies.forEach(reply => {
        if (commentMap[reply.parentid]) {
            if (!commentMap[reply.parentid].replies) {
                commentMap[reply.parentid].replies = [];
            }
            commentMap[reply.parentid].replies.push({ ...reply, replies: [] });
            commentMap[reply.id] = { ...reply, replies: [] };
        } else {
            console.warn(`Parent comment with ID ${reply.parentid} not found`);
        }
    });

    return nestedComments;
};

// Returns the nestedComments array, which now contains top-level comments. 
// Each of these comments may have nested replies in their replies array.
export {nestComments};