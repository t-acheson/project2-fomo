//Import bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import testImg from '../assets/feeds.png';
import mapImg from '../assets/Map.png';
import './cssFiles/aboutUs.css'


//Start  About function
//Creates a componet that displays a heading with an image and content blow that splits the page 50:50.
function tryIt(){
    return (
        <section id="about" className='aboutUsBlock'>
        <Container fluid>
            <div className='titleHolder'>
                <h2>Try Out Our Map</h2>
                <Image src={mapImg} />
            </div>
            {/* <Row>
                <Col sm={6}>
                    <Image src={mapImg} />
                </Col>
                <Col sm={6} className='aboutContent'>
                    <h3>FOMO</h3>
                    <p>Your ultimate companion for navigating the vibrant nightlife of New York City. Our mission is to enhance your evening adventures by providing real-time insights and a dynamic platform for discovering the best spots in town.</p>

                    <h3>What We Do:</h3>
                    <p>At NYC Nights, we understand that the city’s energy shifts from one moment to the next. That's why our app offers real-time busyness predictions for various zones across NYC, ensuring you always know where the action is – or where it isn’t. Whether you're looking to join a bustling crowd or find a serene spot to unwind, our app helps you make the perfect choice.</p>

                    <h3>Interactive Community:</h3>
                    <p>Our unique radius-based anonymous chat feature allows you to connect with fellow night owls within a 2 km radius. Share your experiences, ask for recommendations, and engage in lively conversations to make the most of your night out. Additionally, our map page highlights the top comment from each zone, giving you a quick overview of what's happening citywide.</p> */}

                    {/* <h3>Why Choose Us?</h3>
                    <ul>
                        <li><strong>Real-Time Updates:</strong> Stay informed with live predictions on how busy different areas are, helping you plan your night more effectively.</li>
                        <li><strong>Local Insights:</strong> Engage with an active community of users to get the latest tips and recommendations from those nearby.</li>
                        <li><strong>User-Friendly Interface:</strong> Navigate our app with ease, thanks to our intuitive design and interactive map features.</li>
                        <li><strong>Community-Driven Content:</strong> Benefit from the experiences and insights shared by fellow users, ensuring you always have the best information at your fingertips.</li>
                    </ul> */}
                {/* </Col>

            </Row> */}
        </Container>
        </section>
    )
}

export default tryIt;

//End of About function
//Returns a componet that displays a heading with an image and content blow that splits the page 50:50.
//currently returning the same tester image and random text which will be replaced.