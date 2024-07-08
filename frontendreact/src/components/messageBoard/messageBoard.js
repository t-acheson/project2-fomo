//imports of required components 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import LikeButton from './likeButton';
import useNode from '../../hooks/useNode.js';
import Comment from './comment.js';
import { useState } from 'react';


//For storing comments
const comments = {
    id: 1,
    items: [], // Empty by default. Will include list of nested comments when added
    likesCount: 0, // Default likes count
  };
 
//Start MessageBoard function
//creates a componet that combines the comments componets with the filters and check box components. 
function MessageBoard() {
    const [commentsData, setCommentsData] = useState(comments);
    const { insertNode, updateLikeCount } = useNode();
  
    const handleInsertNode = (folderId, item) => {
        const finalStructure = insertNode(commentsData, folderId, item);
        console.log("Updated Structure:", finalStructure);
        setCommentsData(finalStructure);
      };
    
    const handleUpdateLikeCount = (itemId, newLikesCount) => {
        const finalStructure = updateLikeCount(commentsData, itemId, newLikesCount);
        console.log("Updated Structure with Like Count:", finalStructure);
        setCommentsData(finalStructure);
      };

    return (
    <section id='post' className='recommendBlock'>
      <Container fluid>
        <div className='titleHolder'>
          <h2>Feeds</h2>
        </div>
        <Form>
          {['checkbox'].map((type) => (
            <div key={`inline-${type}`} className="mb-3">
              <Form.Check
                inline
                label="Latest"
                name="group1"
                type={type}
                id={`inline-${type}-1`}
              />
              <Form.Check
                inline
                label="Hottest"
                name="group1"
                type={type}
                id={`inline-${type}-2`}
              />
            </div>
          ))}
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>State</Form.Label>
            <Form.Select defaultValue="Choose...">
              <option>Choose...</option>
              <option>...</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Container>
      <div className='Feed'>
        <Comment
          handleInsertNode={handleInsertNode}
          comment={commentsData}
          updateLikeCount={handleUpdateLikeCount}
        />
      </div>
    </section>
  );
}

export default MessageBoard;
//End of MessageBoard function.
//Returns the componet with a title of feed, 2 check boxes, a filter componts and a comment box. comments will display when added