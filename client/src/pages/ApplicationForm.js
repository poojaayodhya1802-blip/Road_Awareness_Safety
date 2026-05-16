import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';

const ApplicationForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      const response = await axios.post('/api/applications/submit-application', data);
      if (response.data.success) {
        navigate('/thank-you', { state: { type: 'application' } });
      } else {
        setApiError(response.data.message || 'Submission failed.');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg">
            <Card.Header className="text-center">
              <h2 className="mb-0">Join Us – Road Safety Volunteer or Event Participant</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    {...register('fullName', { required: 'Full name is required', minLength: 2, maxLength: 100 })}
                    isInvalid={!!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="e.g. +1234567890"
                    {...register('phoneNumber', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[+]?\d{10,15}$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    isInvalid={!!errors.phoneNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>City/Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your city or location"
                    {...register('city', { required: 'City/Location is required', minLength: 2, maxLength: 100 })}
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Interest</Form.Label>
                  <Form.Select
                    {...register('interest', { required: 'Please select your interest' })}
                    isInvalid={!!errors.interest}
                  >
                    <option value="">Select...</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Event Participation">Event Participation</option>
                    <option value="Feedback">Feedback</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.interest?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Tell us why you want to join or any feedback..."
                    {...register('message', { required: 'Message is required', minLength: 10, maxLength: 1000 })}
                    isInvalid={!!errors.message}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.message?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {apiError && <Alert variant="danger">{apiError}</Alert>}

                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Submit Application'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplicationForm; 