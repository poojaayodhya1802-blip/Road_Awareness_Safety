import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer mt-auto py-4">
    <Container>
      <Row className="align-items-center">
        <Col md={6} className="text-md-start text-center mb-2 mb-md-0">
          <span>&copy; {new Date().getFullYear()} Road Safety Awareness Portal. All rights reserved.</span>
        </Col>
        <Col md={6} className="text-md-end text-center">
          <Link to="/" className="text-white me-3 text-decoration-none">Home</Link>
          <Link to="/apply" className="text-white me-3 text-decoration-none">Join Us</Link>
          <Link to="/report-hazard" className="text-white text-decoration-none">Report Hazard</Link>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer; 