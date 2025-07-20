import { Container, Row, Col, Button } from 'react-bootstrap'
import EditableText from '../EditableText'

const CTASection = ({ data, onUpdate, isViewMode = false }) => {
  return (
    <section className="cta-section py-5">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <EditableText
              tag="h2"
              className="display-4 fw-bold mb-3"
              value={data.title}
              onChange={(title) => onUpdate({ title })}
              placeholder="Ready to Get Started?"
              isViewMode={isViewMode}
            />
            
            <EditableText
              tag="p"
              className="lead mb-4"
              value={data.subtitle}
              onChange={(subtitle) => onUpdate({ subtitle })}
              placeholder="Join thousands of satisfied customers and start your journey today"
              isViewMode={isViewMode}
            />
            
            <div className="d-flex gap-3 justify-content-center">
              <Button variant="light" size="lg" className="px-4">
                <EditableText
                  tag="span"
                  value={data.primaryButtonText}
                  onChange={(primaryButtonText) => onUpdate({ primaryButtonText })}
                  placeholder="Get Started"
                  isViewMode={isViewMode}
                />
              </Button>
              
              <Button variant="outline-light" size="lg" className="px-4">
                <EditableText
                  tag="span"
                  value={data.secondaryButtonText}
                  onChange={(secondaryButtonText) => onUpdate({ secondaryButtonText })}
                  placeholder="Learn More"
                  isViewMode={isViewMode}
                />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default CTASection