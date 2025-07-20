import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { mockApiService } from '../../services/mockApiService'

export default function DomainsPage() {
  const [domains, setDomains] = useState([])
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingDomain, setEditingDomain] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    domain: '',
    page_id: '',
    is_active: true
  })

  useEffect(() => {
    loadDomains()
    loadPages()
  }, [])

  const loadDomains = async () => {
    try {
      setLoading(true)
      const data = await mockApiService.getDomains()
      setDomains(data)
    } catch (error) {
      console.error('Error loading domains:', error)
      setMessage({ type: 'danger', text: 'Failed to load domains' })
    } finally {
      setLoading(false)
    }
  }

  const loadPages = async () => {
    try {
      const data = await mockApiService.getPages()
      setPages(data.data || data)
    } catch (error) {
      console.error('Error loading pages:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (editingDomain) {
        await mockApiService.updateDomain(editingDomain.id, formData)
        setMessage({ type: 'success', text: 'Domain updated successfully!' })
      } else {
        await mockApiService.createDomain(formData)
        setMessage({ type: 'success', text: 'Domain created successfully!' })
      }
      
      setShowModal(false)
      setEditingDomain(null)
      setFormData({ domain: '', page_id: '', is_active: true })
      loadDomains()
    } catch (error) {
      console.error('Error saving domain:', error)
      setMessage({ type: 'danger', text: 'Failed to save domain' })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (domain) => {
    setEditingDomain(domain)
    setFormData({
      domain: domain.domain,
      page_id: domain.page_id,
      is_active: domain.is_active
    })
    setShowModal(true)
  }

  const handleDelete = async (domainId) => {
    if (confirm('Are you sure you want to delete this domain?')) {
      try {
        await mockApiService.deleteDomain(domainId)
        setMessage({ type: 'success', text: 'Domain deleted successfully!' })
        loadDomains()
      } catch (error) {
        console.error('Error deleting domain:', error)
        setMessage({ type: 'danger', text: 'Failed to delete domain' })
      }
    }
  }

  const toggleDomainStatus = async (domain) => {
    try {
      await mockApiService.updateDomain(domain.id, {
        ...domain,
        is_active: !domain.is_active
      })
      setMessage({ 
        type: 'success', 
        text: `Domain ${!domain.is_active ? 'activated' : 'deactivated'} successfully!` 
      })
      loadDomains()
    } catch (error) {
      console.error('Error updating domain status:', error)
      setMessage({ type: 'danger', text: 'Failed to update domain status' })
    }
  }

  const getPageTitle = (pageId) => {
    const page = pages.find(p => p.id === pageId)
    return page ? page.title : 'Unknown Page'
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      
      <Container className="flex-grow-1 py-5">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-6 fw-bold">
                  <i className="bi bi-globe me-3"></i>
                  Custom Domains
                </h1>
                <p className="text-muted">Manage custom domains for your landing pages</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => setShowModal(true)}
                size="lg"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Domain
              </Button>
            </div>

            {message.text && (
              <Alert 
                variant={message.type} 
                dismissible 
                onClose={() => setMessage({ type: '', text: '' })}
                className="mb-4"
              >
                {message.text}
              </Alert>
            )}

            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  Domain List
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : domains.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-globe display-1 text-muted mb-3"></i>
                    <h5>No domains configured</h5>
                    <p className="text-muted">Add your first custom domain to get started</p>
                  </div>
                ) : (
                  <Table responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Domain</th>
                        <th>Landing Page</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains.map((domain) => (
                        <tr key={domain.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-globe text-primary me-2"></i>
                              <div>
                                <strong>{domain.domain}</strong>
                                <br />
                                <small className="text-muted">
                                  <a 
                                    href={`https://${domain.domain}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-decoration-none"
                                  >
                                    Visit <i className="bi bi-box-arrow-up-right"></i>
                                  </a>
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{getPageTitle(domain.page_id)}</strong>
                              <br />
                              <small className="text-muted">ID: {domain.page_id}</small>
                            </div>
                          </td>
                          <td>
                            <Badge 
                              bg={domain.is_active ? 'success' : 'secondary'}
                              className="cursor-pointer"
                              onClick={() => toggleDomainStatus(domain)}
                            >
                              {domain.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(domain.created_at).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEdit(domain)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(domain.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />

      {/* Add/Edit Domain Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-globe me-2"></i>
            {editingDomain ? 'Edit Domain' : 'Add New Domain'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-globe me-2"></i>
                    Domain Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="example.com"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    required
                  />
                  <Form.Text className="text-muted">
                    Enter domain without http:// or https://
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-file-earmark me-2"></i>
                    Landing Page *
                  </Form.Label>
                  <Form.Select
                    value={formData.page_id}
                    onChange={(e) => setFormData({...formData, page_id: e.target.value})}
                    required
                  >
                    <option value="">Select a landing page</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title} (/{page.slug})
                        )
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active Domain"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
              <Form.Text className="text-muted">
                Inactive domains will show a "Coming Soon" page
              </Form.Text>
            </Form.Group>

            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              <strong>DNS Setup Required:</strong> Point your domain's DNS to your server IP address using an A record or CNAME.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  {editingDomain ? 'Update Domain' : 'Add Domain'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}