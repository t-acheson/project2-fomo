//Imports
import Container from 'react-bootstrap/Container';
import './cssFiles/footer.css'

//Start  Footer function
//creates a footer component that contains copyright info.
function Footer() {
    return (
        <footer className="footer">
            <Container fluid>
                <div className='copyright'>
                    &copy; 2024 Copyright. All Rights Reserved.
                </div>
            </Container>
        </footer>
    )
}

export default Footer;
//End of Footer function.
//Returns a footer component that contains copyright info.