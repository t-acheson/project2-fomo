const useNode = () => {
    const insertNode = function (tree, commentId, item) {
      if (tree.id === commentId) {
        tree.items.push({
          id: new Date().getTime(),
          name: item,
          items: [],
        });
  
        return tree;
      }
  
      let latestNode = [];
      latestNode = tree.items.map((ob) => {
        return insertNode(ob, commentId, item);
      });
  
      return { ...tree, items: latestNode };
    };

    return { insertNode};
  };
  
  export default useNode;