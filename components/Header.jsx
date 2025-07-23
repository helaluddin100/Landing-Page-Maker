import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap'
import { useState } from 'react'

const Header = ({ onToggleSidebar, sidebarVisible }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false)

  const handleClose = () => setShowOffcanvas(false)
  const handleShow = () => setShowOffcanvas(true)

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm border-bottom sticky-top">
        <Container fluid>
          <div className="d-flex align-items-center">
            <Button
              variant="outline-primary"
              className="d-lg-none me-3"
              onClick={onToggleSidebar}
            >
              <i className="bi bi-list"></i>
            </Button>
            
            <Navbar.Brand className="fw-bold text-primary">
              <i className="bi bi-palette me-2"></i>
              PageBuilder Pro
            </Navbar.Brand>
          </div>

          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={handleShow}
          />
          
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-block">
            <Nav className="ms-auto align-items-center">
              <Nav.Link href="/pages" className="mx-2">
                <i className="bi bi-file-earmark-text me-1"></i>
                Pages
              </Nav.Link>
              <Nav.Link href="/domains" className="mx-2">
                <i className="bi bi-globe me-1"></i>
                Domains
              </Nav.Link>
              <Nav.Link href="/sections" className="mx-2">
                <i className="bi bi-puzzle me-1"></i>
                Sections
              </Nav.Link>
              <Nav.Link href="/admin/sections" className="mx-2">
                <i className="bi bi-gear me-1"></i>
                Admin
              </Nav.Link>
              <Nav.Link href="#features" className="mx-2">
                <i className="bi bi-grid-3x3 me-1"></i>
                Features
              </Nav.Link>
              <Nav.Link href="#templates" className="mx-2">
                <i className="bi bi-collection me-1"></i>
                Templates
              </Nav.Link>
              <Nav.Link href="#pricing" className="mx-2">
                <i className="bi bi-tag me-1"></i>
                Pricing
              </Nav.Link>
              <Button variant="outline-primary" className="mx-2">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Login
              </Button>
              <Button variant="primary" className="mx-2">
                <i className="bi bi-person-plus me-1"></i>
                Sign Up
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className="bi bi-palette me-2"></i>
            PageBuilder Pro
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="/pages" className="py-3 border-bottom">
              <i className="bi bi-file-earmark-text me-2"></i>
              Pages
            </Nav.Link>
            <Nav.Link href="/domains" className="py-3 border-bottom">
              <i className="bi bi-globe me-2"></i>
              Domains
            </Nav.Link>
            <Nav.Link href="/sections" className="py-3 border-bottom">
              <i className="bi bi-puzzle me-2"></i>
              Sections
            </Nav.Link>
            <Nav.Link href="/admin/sections" className="py-3 border-bottom">
              <i className="bi bi-gear me-2"></i>
              Admin
            </Nav.Link>
            <Nav.Link href="#features" className="py-3 border-bottom">
              <i className="bi bi-grid-3x3 me-2"></i>
              Features
            </Nav.Link>
            <Nav.Link href="#templates" className="py-3 border-bottom">
              <i className="bi bi-collection me-2"></i>
              Templates
            </Nav.Link>
            <Nav.Link href="#pricing" className="py-3 border-bottom">
              <i className="bi bi-tag me-2"></i>
              Pricing
            </Nav.Link>
            <div className="mt-4">
              <Button variant="outline-primary" className="w-100 mb-3">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Login
              </Button>
              <Button variant="primary" className="w-100">
                <i className="bi bi-person-plus me-1"></i>
                Sign Up
              </Button>
            </div>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Header