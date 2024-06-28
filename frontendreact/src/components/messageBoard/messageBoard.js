//imports of required components 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import LikeButton from './likeButton';


const postData = [
    {
        id: 1,
        post: "simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      },
      {
        id: 2,
        post: 'Tips for UI Design',
      },
      {
        id: 3,
        post: 'Beautiful Day',
      },
      {
        id: 4,
        post: 'Beautiful Day',
      },
      {
        id: 5,
        post: 'Beautiful Day',
      },
      {
        id: 6,
        post: 'Beautiful Day',
      }
]

//TODO: 
//Start Recommendation function
//creates a componet that combines the LocationIDCard, Rating componets with a heart componet to display recommendations. 

function MessageBoard() {
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
                <Row>
                    {postData.map(post => {
                        return (
                            <Col sm={10} key={post.id}>
                                <div className='holder'>
                                    <Card>
                                        <Card.Body>
                                            <Card.Body>{post.post}</Card.Body>
                                            <Container fluid>
                                            <Row>
                                                <Col><LikeButton /></Col>
                                            </Row>
                                            </Container>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        );     
                    })}
                </Row>
            </Container>
        </section>
    );
}

export default MessageBoard;

//End of Ratings function.
//Returns the componet with 5 stars for rating