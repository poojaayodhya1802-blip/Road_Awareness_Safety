import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="hero-content">
              <h1 className="display-4 fw-bold mb-4">
                Making Roads Safer for Everyone
              </h1>
              <p className="lead mb-4">
                Join our community of road safety advocates. Report hazards, volunteer for events, 
                and help create safer roads for all.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button 
                  as={Link} 
                  to="/apply" 
                  size="lg" 
                  variant="light"
                  className="fw-semibold"
                >
                  🚗 Join as Volunteer
                </Button>
                <Button 
                  as={Link} 
                  to="/report-hazard" 
                  size="lg" 
                  variant="warning"
                  className="fw-semibold text-dark"
                >
                  ⚠️ Report Hazard
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image">
                <div className="feature-icon mx-auto" style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                  🛣️
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <Row className="text-center">
            <Col md={3} className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Volunteers</div>
            </Col>
            <Col md={3} className="stat-card">
              <div className="stat-number">1,200+</div>
              <div className="stat-label">Hazards Reported</div>
            </Col>
            <Col md={3} className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Events Organized</div>
            </Col>
            <Col md={3} className="stat-card">
              <div className="stat-number">25+</div>
              <div className="stat-label">Cities Covered</div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Why Road Safety Matters</h2>
              <p className="lead text-muted">
                Every year, thousands of lives are lost due to road accidents. 
                Together, we can make a difference.
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 text-center">
                <Card.Body className="p-4">
                  <div className="feature-icon mx-auto">
                    🚨
                  </div>
                  <Card.Title className="fw-bold mb-3">Report Hazards</Card.Title>
                  <Card.Text>
                    Help identify and report road hazards like potholes, broken signals, 
                    and dangerous conditions to keep everyone safe.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100 text-center">
                <Card.Body className="p-4">
                  <div className="feature-icon mx-auto">
                    🤝
                  </div>
                  <Card.Title className="fw-bold mb-3">Volunteer</Card.Title>
                  <Card.Text>
                    Join our community of volunteers to organize safety events, 
                    conduct awareness campaigns, and make roads safer.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100 text-center">
                <Card.Body className="p-4">
                  <div className="feature-icon mx-auto">
                    📊
                  </div>
                  <Card.Title className="fw-bold mb-3">Track Progress</Card.Title>
                  <Card.Text>
                    Monitor the status of reported hazards and see how your 
                    contributions are making a real impact in your community.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Road Safety Tips */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Road Safety Tips</h2>
              <p className="lead text-muted">
                Simple tips that can save lives on the road
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">🚗 For Drivers</h5>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-2">✅ Always wear your seatbelt</li>
                    <li className="mb-2">✅ Follow speed limits</li>
                    <li className="mb-2">✅ Avoid distracted driving</li>
                    <li className="mb-2">✅ Never drive under the influence</li>
                    <li className="mb-2">✅ Maintain safe following distance</li>
                    <li className="mb-2">✅ Use turn signals properly</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">🚶 For Pedestrians</h5>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-2">✅ Use designated crosswalks</li>
                    <li className="mb-2">✅ Look both ways before crossing</li>
                    <li className="mb-2">✅ Make eye contact with drivers</li>
                    <li className="mb-2">✅ Stay visible at night</li>
                    <li className="mb-2">✅ Avoid walking while distracted</li>
                    <li className="mb-2">✅ Follow traffic signals</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-5 fw-bold mb-4">Ready to Make a Difference?</h2>
              <p className="lead mb-4">
                Join thousands of volunteers and citizens working together to create safer roads. 
                Every report, every volunteer hour, every safety tip shared makes a difference.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button 
                  as={Link} 
                  to="/apply" 
                  size="lg" 
                  variant="primary"
                  className="fw-semibold"
                >
                  Become a Volunteer
                </Button>
                <Button 
                  as={Link} 
                  to="/report-hazard" 
                  size="lg" 
                  variant="outline-primary"
                  className="fw-semibold"
                >
                  Report a Hazard
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Recent News/Updates */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Latest Updates</h2>
              <p className="lead text-muted">
                Stay informed about road safety initiatives and community events
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Badge bg="success" className="mb-2">Event</Badge>
                  <Card.Title>Safety Awareness Week</Card.Title>
                  <Card.Text>
                    Join us for a week-long campaign promoting road safety awareness 
                    in your community. Free workshops and demonstrations.
                  </Card.Text>
                  <small className="text-muted">March 15-21, 2024</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Badge bg="info" className="mb-2">Update</Badge>
                  <Card.Title>New Mobile App</Card.Title>
                  <Card.Text>
                    Our new mobile app makes it even easier to report hazards and 
                    stay connected with the road safety community.
                  </Card.Text>
                  <small className="text-muted">Coming Soon</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Badge bg="warning" className="mb-2">Alert</Badge>
                  <Card.Title>Weather Advisory</Card.Title>
                  <Card.Text>
                    Heavy rains expected this week. Please drive carefully and report 
                    any flooding or road damage you encounter.
                  </Card.Text>
                  <small className="text-muted">Active Now</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage; 