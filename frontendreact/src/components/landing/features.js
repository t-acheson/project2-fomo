import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ballImage from '../../assets/discoBall.gif';
import '../cssFiles/features.css';

function Features() {
  return (
    <section id="features" className="featuresBlock" data-testid="features-section">
      <Container fluid>
        <div className="titleHolder">
          <h1>Say Goodbye to FOMO!</h1>
          <h2>with our app:</h2>
          {/* <h1>Unleash the best of NYC nightlife with our cutting-edge app!</h1>
          <h2>With features such as</h2> */}
        </div>
        <Row className="mb-4">
          <Col xs={12} md={4} className="holder">
            <h3>Social Scenes!</h3>
            <p>Find THE hottest place to be within the next hour, just check out our map!</p>
            {/* <h3>Real-Time Busyness Predictions:</h3>
            <p>Get live updates on how busy different areas are, so you can plan your night out effectively.</p> */}
          </Col>
          <Col xs={12} md={4} className="imageHolder text-center">
            <Image src={ballImage} alt="a rolling disco ball image" fluid />
          </Col>
          <Col xs={12} md={4} className="holder">
          <h3>Get Chit-Chatting!</h3>
            <p>See what socialites near you have to say! They're only 2km or a comment away!</p>
            {/* <h3>Radius-Based Anonymous Chat</h3>
            <p>Engage with other night owls within a 2 km radius! Comment, reply, like, and dislike posts to share your experiences and discover new spots nearby.</p> */}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4} className="holder">
          <h3>Map Your Mood!</h3>
            <p>Looking for great buzz or chill vibes? Find a colour-coded location to match your mood.</p>
            {/* <h3>Interactive Map</h3>
            <p>Visualize hot spots and quieter zones with our easy-to-use map interface.</p> */}
          </Col>
          <Col xs={12} md={4} className="holder">
          <h3>Hottest Takes!</h3>
            <p>Discover trending comments with a single *click* of our map. Top comments on Tap!</p>
            {/* <h3>Top Zone Comments</h3>
            <p>See the top comment from each zone on the map page, giving you a quick overview of what's happening across the city.</p> */}
          </Col>
          <Col xs={12} md={4} className="holder">
          <h3>Tag it!</h3>
            <p>Looking for something specific? Sort comments by hot topics using our tag feature!</p>
            {/* <h3>Community-Driven Insights</h3>
            <p>Benefit from real-time experiences and tips shared by fellow users to make the most of your night out.</p> */}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Features;
