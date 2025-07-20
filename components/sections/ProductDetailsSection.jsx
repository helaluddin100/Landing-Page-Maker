import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import EditableText from '../EditableText'

const ProductDetailsSection = ({ data, onUpdate }) => {
  const product = data.product || {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: '$199.99',
    originalPrice: '$249.99',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Experience crystal-clear audio with our premium wireless headphones. Features noise cancellation, 30-hour battery life, and premium comfort padding.',
    features: [
      'Active Noise Cancellation',
      '30-Hour Battery Life',
      'Premium Comfort Padding',
      'Bluetooth 5.0 Connectivity',
      'Quick Charge Technology'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 1247
  }

  return (
    <section className="py-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="position-relative">
              <img 
                src={product.image}
                alt={product.name}
                className="img-fluid rounded shadow-lg"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
              {product.originalPrice && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-0 m-3 fs-6"
                >
                  Sale
                </Badge>
              )}
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="ps-lg-4">
              <EditableText
                tag="h1"
                className="display-5 fw-bold mb-3"
                value={data.title || product.name}
                onChange={(title) => onUpdate({ title })}
                placeholder="Product Name"
              />
              
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`bi ${i < Math.floor(product.rating) ? 'bi-star-fill' : 'bi-star'} text-warning`}
                    ></i>
                  ))}
                  <span className="ms-2 text-muted">({product.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="h2 text-primary fw-bold me-3">
                  <EditableText
                    tag="span"
                    value={data.price || product.price}
                    onChange={(price) => onUpdate({ price })}
                    placeholder="$199.99"
                  />
                </span>
                {product.originalPrice && (
                  <span className="h5 text-muted text-decoration-line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
              
              <EditableText
                tag="p"
                className="lead mb-4"
                value={data.description || product.description}
                onChange={(description) => onUpdate({ description })}
                placeholder="Product description..."
              />
              
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Key Features:</h6>
                <ul className="list-unstyled">
                  {product.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="d-flex gap-3 mb-3">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="flex-grow-1"
                  disabled={!product.inStock}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  <EditableText
                    tag="span"
                    value={data.buttonText || (product.inStock ? 'Add to Cart' : 'Out of Stock')}
                    onChange={(buttonText) => onUpdate({ buttonText })}
                    placeholder="Add to Cart"
                  />
                </Button>
                
                <Button variant="outline-primary" size="lg">
                  <i className="bi bi-heart"></i>
                </Button>
              </div>
              
              <div className="d-flex align-items-center text-muted">
                <i className="bi bi-truck me-2"></i>
                <small>Free shipping on orders over $100</small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default ProductDetailsSection