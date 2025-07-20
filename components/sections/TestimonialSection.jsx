import { Container, Row, Col, Card } from 'react-bootstrap'
import EditableText from '../EditableText'

const TestimonialSection = ({ data, onUpdate, isViewMode = false }) => {
  const testimonials = data.testimonials || [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Happy Customer',
      content: 'Amazing product quality and excellent customer service. Highly recommended!',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Verified Buyer',
      content: 'Fast shipping and exactly as described. Will definitely order again.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Regular Customer',
      content: 'Outstanding value for money. The quality exceeded my expectations.',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ]

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <EditableText
              tag="h2"
              className="display-5 fw-bold mb-3"
              value={data.title}
              onChange={(title) => onUpdate({ title })}
              placeholder="What Our Customers Say"
              isViewMode={isViewMode}
            />
            
            <EditableText
              tag="p"
              className="lead text-muted"
              value={data.subtitle}
              onChange={(subtitle) => onUpdate({ subtitle })}
              placeholder="Real reviews from real customers"
              isViewMode={isViewMode}
            />
          </Col>
        </Row>
        
        <Row>
          {testimonials.map((testimonial) => (
            <Col lg={4} md={6} key={testimonial.id} className="mb-4">
              <Card className="testimonial-card h-100">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning"></i>
                    ))}
                  </div>
                  
                  <Card.Text className="mb-4">
                    "{testimonial.content}"
                  </Card.Text>
                  
                  <div className="d-flex align-items-center justify-content-center">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-0">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default TestimonialSection