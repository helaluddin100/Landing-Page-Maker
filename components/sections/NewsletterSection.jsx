import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap'
import EditableText from '../EditableText'

const NewsletterSection = ({ data, onUpdate }) => {
  return (
    <section className="newsletter-section py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <EditableText
              tag="h2"
              className="display-5 fw-bold mb-3"
              value={data.title}
              onChange={(title) => onUpdate({ title })}
              placeholder="Stay Updated"
            />
            
            <EditableText
              tag="p"
              className="lead mb-4"
              value={data.subtitle}
              onChange={(subtitle) => onUpdate({ subtitle })}
              placeholder="Subscribe to our newsletter for the latest updates and exclusive offers"
            />
            
            <Row className="justify-content-center">
              <Col lg={6}>
                <InputGroup size="lg">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email address"
                    className="border-0"
                  />
                  <Button variant="light" className="px-4">
                    <EditableText
                      tag="span"
                      value={data.buttonText}
                      onChange={(buttonText) => onUpdate({ buttonText })}
                      placeholder="Subscribe"
                    />
                  </Button>
                </InputGroup>
                
                <small className="text-light mt-2 d-block opacity-75">
                  We respect your privacy. Unsubscribe at any time.
                </small>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default NewsletterSection