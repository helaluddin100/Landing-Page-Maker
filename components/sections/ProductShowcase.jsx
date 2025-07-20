import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import EditableText from '../EditableText'

const ProductShowcase = ({ data, onUpdate }) => {
  const products = data.products || [
    {
      id: 1,
      name: 'Premium Product',
      price: '$99.99',
      image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'High-quality product description'
    },
    {
      id: 2,
      name: 'Best Seller',
      price: '$149.99',
      image: 'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Popular choice among customers'
    },
    {
      id: 3,
      name: 'New Arrival',
      price: '$79.99',
      image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Latest addition to our collection'
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
              placeholder="Featured Products"
            />
            
            <EditableText
              tag="p"
              className="lead text-muted"
              value={data.subtitle}
              onChange={(subtitle) => onUpdate({ subtitle })}
              placeholder="Discover our amazing product collection"
            />
          </Col>
        </Row>
        
        <Row>
          {products.map((product, index) => (
            <Col lg={4} md={6} key={product.id} className="mb-4">
              <Card className="product-card h-100">
                <Card.Img 
                  variant="top" 
                  src={product.image}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    {product.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="text-primary mb-0">{product.price}</h5>
                    <Button variant="primary">Add to Cart</Button>
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

export default ProductShowcase