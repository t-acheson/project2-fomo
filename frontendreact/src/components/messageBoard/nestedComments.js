// Function checks comments for their parent id. 
// If present then add comment into the replies array of the map.
// Else Add to comment to nestedComments. 
const nestComments = (comments) => {
    const commentMap = {};
    comments.forEach(comment => commentMap[comment.id] = { ...comment, replies: [] });
    
    //stores the comments which do not have a parent
    const nestedComments = [];

    comments.forEach(comment => {
        if (comment.parentid) {
            commentMap[comment.parentid].replies.push(commentMap[comment.id]);
        } else {
            nestedComments.push(commentMap[comment.id]);
        }
    });
    
    return nestedComments;
};
// Returns the nestedComments array, which now contains top-level comments. 
// Each of these comments may have nested replies in their replies array.
export {nestComments};