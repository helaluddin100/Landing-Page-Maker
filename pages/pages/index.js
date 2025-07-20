import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { mockApiService } from '../../services/mockApiService'
import { useRouter } from 'next/router'

export default function PagesManagement() {
  const router = useRouter()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingPage, setEditingPage] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'draft',
    meta_description: '',
    meta_keywords: ''
  })

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      const data = await mockApiService.getPages()
      setPages(data.data || data)
    } catch (error) {
      console.error('Error loading pages:', error)
      setMessage({ type: 'danger', text: 'Failed to load pages' })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (page) => {
    setEditingPage(page)
    setFormData({
      title: page.title,
      slug: page.slug,
      status: page.status,
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (editingPage) {
        await mockApiService.updatePageMeta(editingPage.id, formData)
        setMessage({ type: 'success', text: 'Page updated successfully!' })
      }
      
      setShowModal(false)
      setEditingPage(null)
      setFormData({ title: '', slug: '', status: 'draft', meta_description: '', meta_keywords: '' })
      loadPages()
    } catch (error) {
      console.error('Error saving page:', error)
      setMessage({ type: 'danger', text: 'Failed to save page' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pageId) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        await mockApiService.deletePage(pageId)
        setMessage({ type: 'success', text: 'Page deleted successfully!' })
        loadPages()
      } catch (error) {
        console.error('Error deleting page:', error)
        setMessage({ type: 'danger', text: 'Failed to delete page' })
      }
    }
  }

  const handleDuplicate = async (pageId) => {
    try {
      await mockApiService.duplicatePage(pageId)
      setMessage({ type: 'success', text: 'Page duplicated successfully!' })
      loadPages()
    } catch (error) {
      console.error('Error duplicating page:', error)
      setMessage({ type: 'danger', text: 'Failed to duplicate page' })
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      draft: 'secondary',
      published: 'success',
      archived: 'warning'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
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
                  <i className="bi bi-file-earmark-text me-3"></i>
                  Landing Pages
                </h1>
                <p className="text-muted">Manage your landing pages and view analytics</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => router.push('/')}
                size="lg"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create New Page
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
                  All Pages
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : pages.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-file-earmark-text display-1 text-muted mb-3"></i>
                    <h5>No pages created yet</h5>
                    <p className="text-muted">Create your first landing page to get started</p>
                    <Button variant="primary" onClick={() => router.push('/')}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Page
                    </Button>
                  </div>
                ) : (
                  <Table responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Page</th>
                        <th>URL</th>
                        <th>Status</th>
                        <th>Last Modified</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pages.map((page) => (
                        <tr key={page.id}>
                          <td>
                            <div>
                              <strong>{page.title}</strong>
                              <br />
                              <small className="text-muted">
                                {page.sections?.length || 0} sections
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <code>/view/{page.slug}</code>
                              <br />
                              <small>
                                <a 
                                  href={`/view/${page.slug}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-decoration-none"
                                >
                                  Preview <i className="bi bi-box-arrow-up-right"></i>
                                </a>
                              </small>
                            </div>
                          </td>
                          <td>{getStatusBadge(page.status)}</td>
                          <td>
                            <small className="text-muted">
                              {new Date(page.updated_at).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => router.push(`/?page=${page.id}`)}
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleEdit(page)}
                                title="Settings"
                              >
                                <i className="bi bi-gear"></i>
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleDuplicate(page.id)}
                                title="Duplicate"
                              >
                                <i className="bi bi-files"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(page.id)}
                                title="Delete"
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

      {/* Edit Page Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-gear me-2"></i>
            Page Settings
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Page Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL Slug *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                  />
                  <Form.Text className="text-muted">
                    URL: /view/{formData.slug}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.meta_description}
                onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                placeholder="Brief description for search engines..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meta Keywords</Form.Label>
              <Form.Control
                type="text"
                value={formData.meta_keywords}
                onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                placeholder="keyword1, keyword2, keyword3"
              />
            </Form.Group>
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
                  Save Changes
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}