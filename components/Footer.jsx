import { Container, Row, Col, Button } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-palette me-2"></i>
              PageBuilder Pro
            </h5>
            <p className="text-muted mb-3">
              Create stunning landing pages with our intuitive drag-and-drop builder. 
              No coding required - just drag, drop, and publish!
            </p>
            <div className="d-flex gap-3">
              <Button variant="outline-light" size="sm">
                <i className="bi bi-facebook"></i>
              </Button>
              <Button variant="outline-light" size="sm">
                <i className="bi bi-twitter"></i>
              </Button>
              <Button variant="outline-light" size="sm">
                <i className="bi bi-instagram"></i>
              </Button>
              <Button variant="outline-light" size="sm">
                <i className="bi bi-linkedin"></i>
              </Button>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h6 className="fw-bold mb-3">Product</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Features
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Templates
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Integrations
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Pricing
                </a>
              </li>
            </ul>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Documentation
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Status
                </a>
              </li>
            </ul>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h6 className="fw-bold mb-3">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Blog
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Careers
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Press
                </a>
              </li>
            </ul>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h6 className="fw-bold mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Privacy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Terms
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Security
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Cookies
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4 border-secondary" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted mb-0">
              © 2024 PageBuilder Pro. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted mb-0">
              Made with <i className="bi bi-heart-fill text-danger"></i> for creators
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer