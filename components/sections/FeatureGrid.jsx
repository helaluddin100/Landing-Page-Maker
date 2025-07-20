import { Container, Row, Col } from 'react-bootstrap'
import EditableText from '../EditableText'

const FeatureGrid = ({ data, onUpdate }) => {
  const features = data.features || [
    {
      id: 1,
      icon: 'bi-lightning-charge',
      title: 'Fast Performance',
      description: 'Lightning-fast loading times and smooth user experience'
    },
    {
      id: 2,
      icon: 'bi-shield-check',
      title: 'Secure & Safe',
      description: 'Enterprise-grade security to protect your data'
    },
    {
      id: 3,
      icon: 'bi-people',
      title: '24/7 Support',
      description: 'Round-the-clock customer support when you need it'
    },
    {
      id: 4,
      icon: 'bi-graph-up',
      title: 'Analytics',
      description: 'Detailed insights and analytics to track your progress'
    },
    {
      id: 5,
      icon: 'bi-phone',
      title: 'Mobile Ready',
      description: 'Fully responsive design that works on all devices'
    },
    {
      id: 6,
      icon: 'bi-cloud',
      title: 'Cloud Storage',
      description: 'Secure cloud storage with automatic backups'
    }
  ]

  return (
    <section className="py-5">
      <Container>
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <EditableText
              tag="h2"
              className="display-5 fw-bold mb-3"
              value={data.title}
              onChange={(title) => onUpdate({ title })}
              placeholder="Why Choose Us"
            />
            
            <EditableText
              tag="p"
              className="lead text-muted"
              value={data.subtitle}
              onChange={(subtitle) => onUpdate({ subtitle })}
              placeholder="Discover the features that make us stand out"
            />
          </Col>
        </Row>
        
        <Row>
          {features.map((feature) => (
            <Col lg={4} md={6} key={feature.id} className="mb-4">
              <div className="text-center">
                <div className="feature-icon">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                
                <h5 className="mb-3">{feature.title}</h5>
                <p className="text-muted">{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default FeatureGrid