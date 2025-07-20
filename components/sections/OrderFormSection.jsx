import { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap'
import EditableText from '../EditableText'

const OrderFormSection = ({ data, onUpdate, isViewMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Mock API call - replace with actual Laravel endpoint
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          total_price: 199.99 // Mock total price
        })
      })

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Order submitted successfully! We will contact you soon.' 
        })
        setFormData({ name: '', email: '', address: '', phone: '' })
      } else {
        throw new Error('Failed to submit order')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      setMessage({ 
        type: 'danger', 
        text: 'Failed to submit order. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <EditableText
                    tag="h2"
                    className="display-6 fw-bold mb-3"
                    value={data.title}
                    onChange={(title) => onUpdate({ title })}
                    placeholder="Place Your Order"
                    isViewMode={isViewMode}
                  />
                  
                  <EditableText
                    tag="p"
                    className="lead text-muted"
                    value={data.subtitle}
                    onChange={(subtitle) => onUpdate({ subtitle })}
                    placeholder="Fill out the form below to complete your purchase"
                    isViewMode={isViewMode}
                  />
                </div>

                {message.text && (
                  <Alert variant={message.type} className="mb-4">
                    <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                    {message.text}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-person me-2"></i>
                          Full Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          size="lg"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-envelope me-2"></i>
                          Email Address *
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                          size="lg"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-telephone me-2"></i>
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      size="lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <i className="bi bi-geo-alt me-2"></i>
                      Shipping Address *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete shipping address"
                      required
                      size="lg"
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      type="submit"
                      disabled={loading}
                      className="py-3"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-credit-card me-2"></i>
                          <EditableText
                            tag="span"
                            value={data.buttonText}
                            onChange={(buttonText) => onUpdate({ buttonText })}
                            placeholder="Submit Order"
                            isViewMode={isViewMode}
                          />
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      <i className="bi bi-shield-check me-1"></i>
                      Your information is secure and protected
                    </small>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default OrderFormSection