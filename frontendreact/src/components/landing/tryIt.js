//Import bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
// import testImg from '../assets/feeds.png';
import mapImg from '../../assets/newMap.png';
import '../cssFiles/aboutUs.css'


//Start  About function
//Creates a componet that displays a heading with an image and content blow that splits the page 50:50.
function tryIt(){
    return (
        <section id="about" className='aboutUsBlock' data-testid="about-us">
        <Container fluid>
            <div className='titleHolder'>
                <h2>Try Our Map</h2>
                <p>Party People Only: 6pm to 6am</p>
                <a href="/map">
                        <Image src={mapImg} alt="Map feature demo screenshot" />
                    </a>
            </div>
        </Container>
        </section>
    )
}

export default tryIt;

//End of About function
//Returns a componet that displays a heading with an image and content blow that splits the page 50:50.
//currently returning the same tester image and random text which will be replaced.