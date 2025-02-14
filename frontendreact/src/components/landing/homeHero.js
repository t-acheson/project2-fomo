//Import bootstrap components
import Carousel from 'react-bootstrap/Carousel';
import '../../assets/testHeroImage.png';
import '../cssFiles/hero.css'

// Data used for the dynamic carousel component for the hero
var heroData = [
    {
        id: 1,
        image: require('../../assets/road.jpg'),
        title: 'Find The Fun!',
        description: "Tap into NYC's social hotspots with our colour-coded map. Find locations predicted to be buzzing tonight so you can pick the perfect hangout spot to match your vibe!",
        link: '/map',
        buttonText: 'Map your Mood',
      },
      {
        id: 2,
        image: require('../../assets/bridge.jpg'),
        title: 'The Buzz About Town!',
        description: "Discover what's hot with users within 2km! Chat anonymously, and filter comments by tags or popularity. Discover what’s trending!",
        link: '/feed',
        buttonText: 'Get Chatting',
      },
      {
        id: 3,
        image: require('../../assets/busyStreet.jpg'),
        title: 'Feel FOMO No More!',
        description: "Stuck in work and afraid you're missing out? Our app's for the party people and nightowls! The fun won't start til 6pm!",
        link: '/map',
        buttonText: 'Map your Mood',
      }

]

//Start  Hero function
//Creates a hero componet that displays a slider of 3 images that slides automaticlly with short paragraphs for each
//Takes heroData as input
function HomeHero() {
    return (
        <section id='home' className='heroBlock' data-testid="home-hero">
        <Carousel>
            {
                heroData.map(hero => {
                    return (
                        <Carousel.Item key={hero.id}>
                            <img
                                className="d-block w-100"
                                src={hero.image}
                                alt={"Slide" + hero.id}
                            />
                            <Carousel.Caption>
                                <h3>{hero.title}</h3>
                                <p>{hero.description}</p>
                                <a className="btn btn-primary custom-btn" href={hero.link}>{hero.buttonText} <i className="fas fa-chevron-right"></i></a>
                                {/* <a className="btn btn-primary" href="/map">Get Started <i className="fas fa-chevron-right"></i></a> */}
                            </Carousel.Caption>
                        </Carousel.Item>
                    )
                })
            }
            </Carousel>
        </section>
    );
}

export default HomeHero; 

//End of LandingHero function
//Returns a hero componet that displays a slider of 3 images that slides automaticlly with short paragraphs for each. 
//When button is clicked page is  routed to maps page 
//currently returning the same tester image and random text in slider which will be replaced.