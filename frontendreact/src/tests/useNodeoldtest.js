import useNode from '../hooks/useNode'; 

describe('useNode', () => {
  const { insertNode } = useNode();

  test('inserts node into the correct position in the tree', () => {
    const tree = {
      id: 1,
      name: 'root',
      items: [
        {
          id: 2,
          name: 'child1',
          items: []
        },
        {
          id: 3,
          name: 'child2',
          items: []
        }
      ]
    };

    const commentId = 2;
    const newItem = 'new child';

    const updatedTree = insertNode(tree, commentId, newItem);

    expect(updatedTree.items[0].items).toHaveLength(1);
    expect(updatedTree.items[0].items[0].name).toBe(newItem);
  });

  test('returns the tree unmodified if the commentId is not found', () => {
    const tree = {
      id: 1,
      name: 'root',
      items: [
        {
          id: 2,
          name: 'child1',
          items: []
        }
      ]
    };

    const commentId = 999; // An ID that does not exist in the tree
    const newItem = 'new child';

    const updatedTree = insertNode(tree, commentId, newItem);

    expect(updatedTree).toEqual(tree);
  });

  test('creates a new node with unique id', () => {
    const tree = {
      id: 1,
      name: 'root',
      items: []
    };

    const commentId = 1;
    const newItem = 'new child';

    const updatedTree = insertNode(tree, commentId, newItem);

    expect(updatedTree.items).toHaveLength(1);
    expect(updatedTree.items[0].id).not.toBeUndefined();
    expect(updatedTree.items[0].name).toBe(newItem);
  });
});
