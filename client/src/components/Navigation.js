import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const Navigation = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeNavbar = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      bg="primary" 
      variant="dark" 
      expand="lg" 
      fixed="top"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={closeNavbar}>
          🛣️ Road Safety Portal
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={isActive('/')}
              onClick={closeNavbar}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/apply" 
              active={isActive('/apply')}
              onClick={closeNavbar}
            >
              Join Us
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/report-hazard" 
              active={isActive('/report-hazard')}
              onClick={closeNavbar}
            >
              Report Hazard
            </Nav.Link>
          </Nav>
          
          <Nav className="ms-auto">
            <Button 
              as={Link} 
              to="/apply" 
              variant="outline-light" 
              className="me-2"
              onClick={closeNavbar}
            >
              Volunteer Now
            </Button>
            <Button 
              as={Link} 
              to="/report-hazard" 
              variant="warning" 
              className="text-dark"
              onClick={closeNavbar}
            >
              Report Issue
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 