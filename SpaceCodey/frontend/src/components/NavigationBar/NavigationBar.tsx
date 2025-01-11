import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NavigationBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/">SpaceCodey</Navbar.Brand>

        {/* Responsive Toggler */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {/* Left-aligned Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/nasa-apod">NASA APOD</Nav.Link>
            <Nav.Link as={Link} to="/ISS-tracker">ISS Tracker</Nav.Link>
            <Nav.Link as={Link} to="/weather">Weather</Nav.Link>
            <Nav.Link as={Link} to="/events/optimal-times-form">Optimal Shoot Times</Nav.Link>
            <Nav.Link as={Link} to="/events/body-info">Astronomy Tracker</Nav.Link>
            <Nav.Link as={Link} to="/tips">Tips & Articles</Nav.Link>
            <Nav.Link as={Link} to="/contact-us">Contact Us</Nav.Link>
            <Nav.Link as={Link} to="/support">Support Us</Nav.Link>
          </Nav>

          {/* Right-aligned Links */}
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link as={Link} to="/sessions">Sessions</Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
