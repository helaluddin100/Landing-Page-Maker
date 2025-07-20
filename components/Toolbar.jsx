import { Navbar, Nav, Button, Spinner } from 'react-bootstrap'

const Toolbar = ({ onSave, onLoad, onClear, loading }) => {
  return (
    <Navbar bg="white" className="toolbar px-3 py-2">
      <Navbar.Brand>
        <i className="bi bi-palette me-2"></i>
        Landing Page Builder
      </Navbar.Brand>
      
      <Nav className="ms-auto">
        <Button 
          variant="outline-secondary" 
          className="me-2"
          onClick={onLoad}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Load
        </Button>
        
        <Button 
          variant="outline-danger" 
          className="me-2"
          onClick={onClear}
          disabled={loading}
        >
          <i className="bi bi-trash me-1"></i>
          Clear
        </Button>
        
        <Button 
          variant="primary"
          onClick={onSave}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-1" />
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-save me-1"></i>
              Save Page
            </>
          )}
        </Button>
      </Nav>
    </Navbar>
  )
}

export default Toolbar