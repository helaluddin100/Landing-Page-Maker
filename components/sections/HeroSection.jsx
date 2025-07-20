import { Container, Row, Col, Button } from 'react-bootstrap'
import EditableText from '../EditableText'

const HeroSection = ({ data, onUpdate }) => {
  return (
    <section className="hero-section">
      <Container>
        <Row className="align-items-center min-vh-50">
          <Col lg={6}>
            <EditableText
              tag="h1"
              className="display-4 fw-bold mb-4"
              value={data.title}
              onChange={(title) => onUpdate({ title })}
              placeholder="Enter hero title..."
            />
            
            <EditableText
              tag="p"
              className="lead mb-4"
              value={data.subtitle}
              onChange={(subtitle) => onUpdate({ subtitle })}
              placeholder="Enter hero subtitle..."
            />
            
            <div className="d-flex gap-3">
              <Button 
                variant="light" 
                size="lg"
                className="px-4"
              >
                <EditableText
                  tag="span"
                  value={data.primaryButtonText}
                  onChange={(primaryButtonText) => onUpdate({ primaryButtonText })}
                  placeholder="Primary Button"
                />
              </Button>
              
              <Button 
                variant="outline-light" 
                size="lg"
                className="px-4"
              >
                <EditableText
                  tag="span"
                  value={data.secondaryButtonText}
                  onChange={(secondaryButtonText) => onUpdate({ secondaryButtonText })}
                  placeholder="Secondary Button"
                />
              </Button>
            </div>
          </Col>
          
          <Col lg={6} className="text-center">
            <img 
              src={data.image || "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"}
              alt="Hero"
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default HeroSection