import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Dropdown } from 'react-bootstrap'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { mockApiService } from '../../services/mockApiService'

export default function SectionsManagement() {
  const [sections, setSections] = useState([])
  const [pages, setPages] = useState([])
  const [sectionTypes, setSectionTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [filters, setFilters] = useState({
    page_id: '',
    type: '',
    active: ''
  })
  const [formData, setFormData] = useState({
    landing_page_id: '',
    section_id: '',
    type: '',
    data: {},
    sort_order: 0,
    is_active: true
  })

  useEffect(() => {
    loadSections()
    loadPages()
    loadSectionTypes()
  }, [])

  useEffect(() => {
    loadSections()
  }, [filters])

  const loadSections = async () => {
    try {
      setLoading(true)
      const data = await mockApiService.getSections(filters)
      setSections(data.data || data)
    } catch (error) {
      console.error('Error loading sections:', error)
      setMessage({ type: 'danger', text: 'Failed to load sections' })
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

  const loadSectionTypes = async () => {
    try {
      const data = await mockApiService.getSectionTypes()
      setSectionTypes(data)
    } catch (error) {
      console.error('Error loading section types:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (editingSection) {
        await mockApiService.updateSection(editingSection.id, formData)
        setMessage({ type: 'success', text: 'Section updated successfully!' })
      } else {
        await mockApiService.createSection(formData)
        setMessage({ type: 'success', text: 'Section created successfully!' })
      }
      
      setShowModal(false)
      setEditingSection(null)
      resetForm()
      loadSections()
    } catch (error) {
      console.error('Error saving section:', error)
      setMessage({ type: 'danger', text: 'Failed to save section' })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (section) => {
    setEditingSection(section)
    setFormData({
      landing_page_id: section.landing_page_id,
      section_id: section.section_id,
      type: section.type,
      data: section.data,
      sort_order: section.sort_order,
      is_active: section.is_active
    })
    setShowModal(true)
  }

  const handleDelete = async (sectionId) => {
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        await mockApiService.deleteSection(sectionId)
        setMessage({ type: 'success', text: 'Section deleted successfully!' })
        loadSections()
      } catch (error) {
        console.error('Error deleting section:', error)
        setMessage({ type: 'danger', text: 'Failed to delete section' })
      }
    }
  }

  const handleDuplicate = async (sectionId) => {
    try {
      await mockApiService.duplicateSection(sectionId)
      setMessage({ type: 'success', text: 'Section duplicated successfully!' })
      loadSections()
    } catch (error) {
      console.error('Error duplicating section:', error)
      setMessage({ type: 'danger', text: 'Failed to duplicate section' })
    }
  }

  const toggleSectionStatus = async (section) => {
    try {
      await mockApiService.toggleSectionStatus(section.id)
      setMessage({ 
        type: 'success', 
        text: `Section ${!section.is_active ? 'activated' : 'deactivated'} successfully!` 
      })
      loadSections()
    } catch (error) {
      console.error('Error updating section status:', error)
      setMessage({ type: 'danger', text: 'Failed to update section status' })
    }
  }

  const resetForm = () => {
    setFormData({
      landing_page_id: '',
      section_id: '',
      type: '',
      data: {},
      sort_order: 0,
      is_active: true
    })
  }

  const getPageTitle = (pageId) => {
    const page = pages.find(p => p.id === pageId)
    return page ? page.title : 'Unknown Page'
  }

  const getSectionTypeName = (type) => {
    const sectionType = sectionTypes.find(st => st.type === type)
    return sectionType ? sectionType.name : type
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
                  <i className="bi bi-puzzle me-3"></i>
                  Section Management
                </h1>
                <p className="text-muted">Create, edit, and manage sections for your landing pages</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => setShowModal(true)}
                size="lg"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Section
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

            {/* Filters */}
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Filter by Page</Form.Label>
                      <Form.Select
                        value={filters.page_id}
                        onChange={(e) => setFilters({...filters, page_id: e.target.value})}
                      >
                        <option value="">All Pages</option>
                        {pages.map((page) => (
                          <option key={page.id} value={page.id}>
                            {page.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Filter by Type</Form.Label>
                      <Form.Select
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                      >
                        <option value="">All Types</option>
                        {sectionTypes.map((type) => (
                          <option key={type.type} value={type.type}>
                            {type.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Filter by Status</Form.Label>
                      <Form.Select
                        value={filters.active}
                        onChange={(e) => setFilters({...filters, active: e.target.value})}
                      >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  All Sections ({sections.length})
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : sections.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-puzzle display-1 text-muted mb-3"></i>
                    <h5>No sections found</h5>
                    <p className="text-muted">Create your first section to get started</p>
                  </div>
                ) : (
                  <Table responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Section</th>
                        <th>Page</th>
                        <th>Type</th>
                        <th>Order</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sections.map((section) => (
                        <tr key={section.id}>
                          <td>
                            <div>
                              <strong>{section.section_id}</strong>
                              <br />
                              <small className="text-muted">
                                ID: {section.id}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{getPageTitle(section.landing_page_id)}</strong>
                              <br />
                              <small className="text-muted">
                                Page ID: {section.landing_page_id}
                              </small>
                            </div>
                          </td>
                          <td>
                            <Badge bg="info" className="me-1">
                              {getSectionTypeName(section.type)}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg="secondary">
                              {section.sort_order}
                            </Badge>
                          </td>
                          <td>
                            <div 
                              style={{ cursor: 'pointer' }}
                              onClick={() => toggleSectionStatus(section)}
                            >
                              {getStatusBadge(section.is_active)}
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(section.created_at).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm">
                                <i className="bi bi-three-dots"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(section)}>
                                  <i className="bi bi-pencil me-2"></i>
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDuplicate(section.id)}>
                                  <i className="bi bi-files me-2"></i>
                                  Duplicate
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => toggleSectionStatus(section)}>
                                  <i className={`bi ${section.is_active ? 'bi-eye-slash' : 'bi-eye'} me-2`}></i>
                                  {section.is_active ? 'Deactivate' : 'Activate'}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  onClick={() => handleDelete(section.id)}
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

      {/* Add/Edit Section Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-puzzle me-2"></i>
            {editingSection ? 'Edit Section' : 'Add New Section'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Landing Page *</Form.Label>
                  <Form.Select
                    value={formData.landing_page_id}
                    onChange={(e) => setFormData({...formData, landing_page_id: e.target.value})}
                    required
                  >
                    <option value="">Select a page</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Section Type *</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="">Select a type</option>
                    {sectionTypes.map((type) => (
                      <option key={type.type} value={type.type}>
                        {type.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Section ID *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.section_id}
                    onChange={(e) => setFormData({...formData, section_id: e.target.value})}
                    placeholder="unique-section-id"
                    required
                  />
                  <Form.Text className="text-muted">
                    Must be unique across all sections
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Sort Order</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Section Data (JSON)</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={JSON.stringify(formData.data, null, 2)}
                onChange={(e) => {
                  try {
                    const data = JSON.parse(e.target.value)
                    setFormData({...formData, data})
                  } catch (error) {
                    // Invalid JSON, keep the text for user to fix
                  }
                }}
                placeholder='{"title": "Section Title", "content": "Section content..."}'
              />
              <Form.Text className="text-muted">
                Enter section data as valid JSON
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active Section"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
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
                  {editingSection ? 'Update Section' : 'Create Section'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}