//Import bootstrap components
import Carousel from 'react-bootstrap/Carousel';
import '../assets/testHeroImage.png';
import './cssFiles/hero.css'

// Data used for the dynamic carousel component for the hero
var heroData = [
    {
        id: 1,
        image: require('../assets/testHeroImage.png'),
        title: 'The perfect Location for your pop-up',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
      },
      {
        id: 2,
        image: require('../assets/testHeroImage.png'),
        title: 'Start Comparing loctions',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
      },
      {
        id: 3,
        image: require('../assets/testHeroImage.png'),
        title: 'Enjoy the Difference',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
      }

]

//Start  Hero function
//Creates a hero componet that displays a slider of 3 images that slides automaticlly with short paragraphs for each
//Takes heroData as input
function HomeHero() {
    return (
        <section id='home' className='heroBlock'>
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
                                <a className="btn btn-primary" href="/map">Get Started <i className="fas fa-chevron-right"></i></a>
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