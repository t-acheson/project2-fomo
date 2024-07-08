const useNode = () => {
    const insertNode = function (tree, commentId, item) {
      if (tree.id === commentId) {
        tree.items.push({
          id: new Date().getTime(),
          name: item,
          items: [],
          likesCount: 0
        });
  
        return tree;
      }
  
      let latestNode = [];
      latestNode = tree.items.map((ob) => {
        return insertNode(ob, commentId, item);
      });
  
      return { ...tree, items: latestNode };
    };

    const updateLikeCount = (tree, itemId, likesCount) => {
      if (tree.id === itemId) {
        tree.likesCount = likesCount;
        return tree;
      }
  
      let latestNode = [];
      latestNode = tree.items.map((ob) => {
        return updateLikeCount(ob, itemId, likesCount);
      });
  
      return { ...tree, items: latestNode };
    };
  
    return { insertNode, updateLikeCount };
  };
  
  export default useNode;