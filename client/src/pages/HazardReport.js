import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const HazardMap = ({ setLocation, location }) => {
  useMapEvents({
    click(e) {
      setLocation({
        ...location,
        coordinates: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        }
      });
    }
  });
  return location?.coordinates ? (
    <Marker position={[location.coordinates.latitude, location.coordinates.longitude]} />
  ) : null;
};

const HazardReport = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [location, setLocation] = useState({ address: '', coordinates: null });
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  // Geolocation
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation((prev) => ({
            ...prev,
            coordinates: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }
          }));
        },
        (err) => {
          setApiError('Unable to get your location.');
        }
      );
    } else {
      setApiError('Geolocation is not supported by your browser.');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      const formData = new FormData();
      formData.append('reporterName', data.reporterName);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('hazardType', data.hazardType);
      formData.append('description', data.description);
      formData.append('location[address]', location.address);
      if (location.coordinates) {
        formData.append('location[coordinates][latitude]', location.coordinates.latitude);
        formData.append('location[coordinates][longitude]', location.coordinates.longitude);
      }
      if (photo) {
        formData.append('photo', photo);
      }
      const response = await axios.post('/api/hazards/report-hazard', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        navigate('/thank-you', { state: { type: 'hazard' } });
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
        <Col md={10} lg={8}>
          <Card className="shadow-lg">
            <Card.Header className="text-center">
              <h2 className="mb-0">Report a Road Hazard</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data">
                <Form.Group className="mb-3">
                  <Form.Label>Reporter Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    {...register('reporterName', { required: 'Name is required', minLength: 2, maxLength: 100 })}
                    isInvalid={!!errors.reporterName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.reporterName?.message}
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
                  <Form.Label>Hazard Type</Form.Label>
                  <Form.Select
                    {...register('hazardType', { required: 'Please select a hazard type' })}
                    isInvalid={!!errors.hazardType}
                  >
                    <option value="">Select...</option>
                    <option value="Pothole">Pothole</option>
                    <option value="Broken Signal">Broken Signal</option>
                    <option value="Accident">Accident</option>
                    <option value="Obstruction">Obstruction</option>
                    <option value="Others">Others</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.hazardType?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe the hazard..."
                    {...register('description', { required: 'Description is required', minLength: 10, maxLength: 1000 })}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location (Address)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address or landmark"
                    value={location.address}
                    onChange={e => setLocation({ ...location, address: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location (Map/GPS)</Form.Label>
                  <div className="mb-2">
                    <Button variant="outline-primary" size="sm" onClick={handleGetLocation}>
                      Use My Current Location
                    </Button>
                  </div>
                  <div className="map-container mb-2" style={{ height: '300px' }}>
                    <MapContainer
                      center={location.coordinates ? [location.coordinates.latitude, location.coordinates.longitude] : [20.5937, 78.9629]}
                      zoom={location.coordinates ? 16 : 5}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      <HazardMap setLocation={setLocation} location={location} />
                    </MapContainer>
                  </div>
                  <small className="text-muted">
                    Click on the map to set the hazard location, or use your current GPS location.
                  </small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Photo (optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={e => setPhoto(e.target.files[0])}
                  />
                </Form.Group>

                {apiError && <Alert variant="danger">{apiError}</Alert>}

                <div className="d-grid">
                  <Button type="submit" variant="warning" size="lg" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Submit Hazard Report'}
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

export default HazardReport; 