import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Logout from '../Login/Logout';
// import { useContext } from "react";
// import { AuthContext } from '../Auxiliary/AuthContext';

function MyNavbar() {
  // const { token } = useContext(AuthContext); 
  const token = localStorage.getItem("access_token"); // to check if the user is logged in.
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/home">Trust Me Bro!</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            {/* Show Profile, Search, and Logout if the user is logged in */}
            {token && (
              <>
                <Nav.Link href="/profile">Profile</Nav.Link>
                <Nav.Link href="/search">Search</Nav.Link>
                <Logout />
              </>
            )}

            {/* Show About only if the user is logged out */}
            {!token && (
              <>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">signup</Nav.Link>
              </>
          )}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;