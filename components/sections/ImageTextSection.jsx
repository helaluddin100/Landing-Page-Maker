import { Container, Row, Col, Button } from 'react-bootstrap'
import EditableText from '../EditableText'

const ImageTextSection = ({ data, onUpdate, isViewMode = false }) => {
  const isImageLeft = data.imagePosition !== 'right'

  return (
    <section className="py-5">
      <Container>
        <Row className="align-items-center">
          {isImageLeft && (
            <Col lg={6} className="mb-4 mb-lg-0">
              <img 
                src={data.image || "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600"}
                alt="Section"
                className="img-fluid rounded shadow"
              />
            </Col>
          )}
          
          <Col lg={6}>
            <EditableText
              tag="h2"
              className="display-5 fw-bold mb-3"
              value={data.title}
              onChange={(title) => onUpdate({ title })}
              placeholder="About Our Company"
              isViewMode={isViewMode}
            />
            
            <EditableText
              tag="p"
              className="lead mb-4"
              value={data.content}
              onChange={(content) => onUpdate({ content })}
              placeholder="Tell your story here. Explain what makes your company unique and why customers should choose you."
              isViewMode={isViewMode}
            />
            
            <Button variant="primary" size="lg">
              <EditableText
                tag="span"
                value={data.buttonText}
                onChange={(buttonText) => onUpdate({ buttonText })}
                placeholder="Learn More"
                isViewMode={isViewMode}
              />
            </Button>
          </Col>
          
          {!isImageLeft && (
            <Col lg={6} className="mb-4 mb-lg-0">
              <img 
                src={data.image || "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600"}
                alt="Section"
                className="img-fluid rounded shadow"
              />
            </Col>
          )}
        </Row>
      </Container>
    </section>
  )
}

export default ImageTextSection