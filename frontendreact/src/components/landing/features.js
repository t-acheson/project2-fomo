import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ballImage from '../../assets/discoBall.gif'
import '../cssFiles/features.css'

function Features() {
    return (
      <section id="features" className="featuresBlock">
        <Container fluid>
          <div className="titleHolder">
            <h1>Unleash the best of NYC nightlife with our cutting-edge app!</h1>
            <h2>With features such as</h2>
          </div>
          <Row>
            <Col md={4} className="holder">
              <h3>Real-Time Busyness Predictions:</h3>
              <p>Get live updates on how busy different areas are, so you can plan your night out effectively.</p>
            </Col>
            <Col md={4} className="imageHolder">
              <Image src={ballImage} />
            </Col>
            <Col md={4} className="holder">
              <h3>Radius-Based Anonymous Chat</h3>
              <p>Engage with other night owls within a 2 km radius! Comment, reply, like, and dislike posts to share your experiences and discover new spots nearby.</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="holder">
              <h3>Interactive Map</h3>
              <p>Visualize hot spots and quieter zones with our easy-to-use map interface.</p>
            </Col>
            <Col md={4} className="holder">
              <h3>Top Zone Comments</h3>
              <p>See the top comment from each zone on the map page, giving you a quick overview of what's happening across the city.</p>
            </Col>
            <Col md={4} className="holder">
              <h3>Community-Driven Insights</h3>
              <p>Benefit from real-time experiences and tips shared by fellow users to make the most of your night out.</p>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
  
  export default Features;