import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const ThankYou = () => {
  const location = useLocation();
  const type = location.state?.type;

  return (
    <Container className="py-5" style={{ minHeight: '70vh' }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg text-center">
            <Card.Body>
              <div className="feature-icon mx-auto mb-3" style={{ fontSize: '2.5rem' }}>🎉</div>
              <h2 className="mb-3">Thank You!</h2>
              {type === 'application' ? (
                <>
                  <p className="lead mb-4">
                    Your application has been received. We appreciate your interest in joining our road safety community!<br />
                    Our team will contact you soon with further details.
                  </p>
                  <Button as={Link} to="/" variant="primary">
                    Back to Home
                  </Button>
                </>
              ) : type === 'hazard' ? (
                <>
                  <p className="lead mb-4">
                    Thank you for reporting a road hazard!<br />
                    Your report helps make our roads safer for everyone.
                  </p>
                  <Button as={Link} to="/" variant="primary">
                    Back to Home
                  </Button>
                </>
              ) : (
                <>
                  <p className="lead mb-4">
                    Thank you for your submission!
                  </p>
                  <Button as={Link} to="/" variant="primary">
                    Back to Home
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ThankYou; 