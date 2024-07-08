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

    const updateLikeCount = (tree, itemId, newLikesCount) => {
      const updateNode = (nodes) => {
        return nodes.map((node) => {
          if (node.id === itemId) {
            return { ...node, likesCount: newLikesCount };
          } else if (node.items) {
            return { ...node, items: updateNode(node.items) };
          }
          return node;
        });
      };
      return { ...tree, items: updateNode(tree.items) };
    };
  
    return { insertNode, updateLikeCount };
  };
  
  export default useNode;