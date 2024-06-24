//Imports
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './cssFiles/header.css'

//Start  Header function
//creates a header componet that contains a nav bar and logo. 
function Header() {
    return (
        <Navbar expand="lg" className="header">
            <Container>
                <Navbar.Brand href="#home">FOMO</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                    <Nav.Link href="#MapPage">Map</Nav.Link>
                    <Nav.Link href="#feeds">Feeds</Nav.Link>
                    <Nav.Link href="#Notifications">Notifications</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;
//End of Header function.
//Returns a header componet that contains a nav bar and logo. 