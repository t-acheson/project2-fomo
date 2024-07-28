import { nestComments } from '../components/messageBoard/nestedComments'; 

describe('nestComments', () => {
    it('should correctly nest comments based on parentid', () => {
      // Test data
      const comments = [
        { id: '1', text: 'Comment 1', parentid: null },
        { id: '2', text: 'Comment 2', parentid: '1' },
        { id: '3', text: 'Comment 3', parentid: '1' },
        { id: '4', text: 'Comment 4', parentid: '2' },
        { id: '5', text: 'Comment 5', parentid: null }
      ];
  
      const expectedOutput = [
        {
          id: '1',
          text: 'Comment 1',
          parentid: null,
          replies: [
            {
              id: '2',
              text: 'Comment 2',
              parentid: '1',
              replies: [
                {
                  id: '4',
                  text: 'Comment 4',
                  parentid: '2',
                  replies: []
                }
              ]
            },
            {
              id: '3',
              text: 'Comment 3',
              parentid: '1',
              replies: []
            }
          ]
        },
        {
          id: '5',
          text: 'Comment 5',
          parentid: null,
          replies: []
        }
      ];
  
      // Call the function
      const result = nestComments(comments);
      expect(result).toEqual(expectedOutput);
    });
  });