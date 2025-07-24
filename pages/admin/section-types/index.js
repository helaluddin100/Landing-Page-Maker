import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Dropdown } from 'react-bootstrap'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

export default function AdminSectionTypesManagement() {
  const [sectionTypes, setSectionTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingSectionType, setEditingSectionType] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    icon: '',
    thumbnail: '',
    default_data: {},
    is_active: true,
    sort_order: 0
  })

  useEffect(() => {
    loadSectionTypes()
  }, [])

  const loadSectionTypes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/section-types')
      const result = await response.json()

      if (result.success) {
        setSectionTypes(result.data.data || result.data)
      }
    } catch (error) {
      console.error('Error loading section types:', error)
      setMessage({ type: 'danger', text: 'Failed to load section types' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const url = editingSectionType
        ? `/api/admin/section-types/${editingSectionType.id}`
        : '/api/admin/section-types'

      const method = editingSectionType ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setMessage({
          type: 'success',
          text: editingSectionType ? 'Section type updated successfully!' : 'Section type created successfully!'
        })
        setShowModal(false)
        setEditingSectionType(null)
        resetForm()
        loadSectionTypes()
      } else {
        throw new Error(result.message || 'Failed to save section type')
      }
    } catch (error) {
      console.error('Error saving section type:', error)
      setMessage({ type: 'danger', text: error.message || 'Failed to save section type' })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (sectionType) => {
    setEditingSectionType(sectionType)
    setFormData({
      type: sectionType.type,
      name: sectionType.name,
      description: sectionType.description,
      icon: sectionType.icon,
      thumbnail: sectionType.thumbnail || '',
      default_data: sectionType.default_data,
      is_active: sectionType.is_active,
      sort_order: sectionType.sort_order
    })
    setShowModal(true)
  }

  const handleDelete = async (sectionTypeId) => {
    if (confirm('Are you sure you want to delete this section type?')) {
      try {
        const response = await fetch(`/api/admin/section-types/${sectionTypeId}`, {
          method: 'DELETE'
        })

        const result = await response.json()

        if (result.success) {
          setMessage({ type: 'success', text: 'Section type deleted successfully!' })
          loadSectionTypes()
        } else {
          throw new Error(result.message || 'Failed to delete section type')
        }
      } catch (error) {
        console.error('Error deleting section type:', error)
        setMessage({ type: 'danger', text: error.message || 'Failed to delete section type' })
      }
    }
  }

  const toggleSectionTypeStatus = async (sectionType) => {
    try {
      const response = await fetch(`/api/admin/section-types/${sectionType.id}/toggle-status`, {
        method: 'POST'
      })

      const result = await response.json()

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Section type ${!sectionType.is_active ? 'activated' : 'deactivated'} successfully!`
        })
        loadSectionTypes()
      } else {
        throw new Error(result.message || 'Failed to update section type status')
      }
    } catch (error) {
      console.error('Error updating section type status:', error)
      setMessage({ type: 'danger', text: error.message || 'Failed to update section type status' })
    }
  }

  const resetForm = () => {
    setFormData({
      type: '',
      name: '',
      description: '',
      icon: '',
      thumbnail: '',
      default_data: {},
      is_active: true,
      sort_order: 0
    })
  }

  const getStatusBadge = (isActive) => {
    return (
      <Badge bg={isActive ? 'success' : 'secondary'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    )
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
                  <i className="bi bi-collection me-3"></i>
                  Admin - Section Types
                </h1>
                <p className="text-muted">Manage available section types for the page builder</p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                size="lg"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Section Type
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
                  All Section Types ({sectionTypes.length})
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : sectionTypes.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-collection display-1 text-muted mb-3"></i>
                    <h5>No section types found</h5>
                    <p className="text-muted">Create your first section type to get started</p>
                  </div>
                ) : (
                  <Table responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Section Type</th>
                        <th>Description</th>
                        <th>Icon</th>
                        <th>Order</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectionTypes.map((sectionType) => (
                        <tr key={sectionType.id}>
                          <td>
                            <div>
                              <strong>{sectionType.name}</strong>
                              <br />
                              <small className="text-muted">
                                Type: {sectionType.type}
                              </small>
                            </div>
                          </td>
                          <td>
                            <small>{sectionType.description}</small>
                          </td>
                          <td>
                            <i className={`bi ${sectionType.icon} fs-4 text-primary`}></i>
                          </td>
                          <td>
                            <Badge bg="secondary">
                              {sectionType.sort_order}
                            </Badge>
                          </td>
                          <td>
                            <div
                              style={{ cursor: 'pointer' }}
                              onClick={() => toggleSectionTypeStatus(sectionType)}
                            >
                              {getStatusBadge(sectionType.is_active)}
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(sectionType.created_at).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="bi bi-three-dots"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(sectionType)}>
                                  <i className="bi bi-pencil me-2"></i>
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => toggleSectionTypeStatus(sectionType)}>
                                  <i className={`bi ${sectionType.is_active ? 'bi-eye-slash' : 'bi-eye'} me-2`}></i>
                                  {sectionType.is_active ? 'Deactivate' : 'Activate'}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                  onClick={() => handleDelete(sectionType.id)}
                                  className="text-danger"
                                >
                                  <i className="bi bi-trash me-2"></i>
                                  Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
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

      {/* Add/Edit Section Type Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-collection me-2"></i>
            {editingSectionType ? 'Edit Section Type' : 'Add New Section Type'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type Key *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="hero, product_showcase, etc."
                    required
                  />
                  <Form.Text className="text-muted">
                    Unique identifier for this section type
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Display Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Hero Section"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this section type"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bootstrap Icon *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="bi-star"
                    required
                  />
                  <Form.Text className="text-muted">
                    Bootstrap icon class (without 'bi ')
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sort Order</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Thumbnail URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Default Data (JSON) *</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={JSON.stringify(formData.default_data, null, 2)}
                onChange={(e) => {
                  try {
                    const data = JSON.parse(e.target.value)
                    setFormData({ ...formData, default_data: data })
                  } catch (error) {
                    // Invalid JSON, keep the text for user to fix
                  }
                }}
                placeholder='{"title": "Default Title", "subtitle": "Default Subtitle"}'
                required
              />
              <Form.Text className="text-muted">
                Default data structure for new sections of this type
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active Section Type"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
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
                  {editingSectionType ? 'Update Section Type' : 'Create Section Type'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}