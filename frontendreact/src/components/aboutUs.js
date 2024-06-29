//Import bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import testImg from '../Assets/testImg.jpg'
import './cssFiles/aboutUs.css'


//Start  About function
//Creates a componet that displays a heading with an image and content blow that splits the page 50:50.
function About(){
    return (
        <section id="about" className='aboutUsBlock'>
        <Container fluid>
            <div className='titleHolder'>
                <h2>About US</h2>
            </div>
            <Row>
                <Col sm={6}>
                    <Image src={testImg} />
                </Col>
                <Col sm={6}>
                    Content
                    <p>yhdsgfgfjksdghjkfhskdjhfjdshjfksdhjkfsd</p>
                </Col>

            </Row>
        </Container>
        </section>
    )
}

export default About;

//End of About function
//Returns a componet that displays a heading with an image and content blow that splits the page 50:50.
//currently returning the same tester image and random text which will be replaced.