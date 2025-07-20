import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import Canvas from '../components/Canvas'
import Toolbar from '../components/Toolbar'
import { mockApiService } from '../services/mockApiService'
import { v4 as uuidv4 } from 'uuid'

// Dynamically import DragDropContext to prevent SSR issues
const DragDropContext = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.DragDropContext),
  { ssr: false }
)

export default function Home() {
  const [sections, setSections] = useState([])
  const [availableSections, setAvailableSections] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageId, setPageId] = useState(1)
  const [sidebarVisible, setSidebarVisible] = useState(false)

  useEffect(() => {
    loadAvailableSections()
    loadPage()
  }, [])

  const loadAvailableSections = async () => {
    try {
      const data = await mockApiService.getSections()
      setAvailableSections(data)
    } catch (error) {
      console.error('Error loading sections:', error)
    }
  }

  const loadPage = async () => {
    try {
      setLoading(true)
      const data = await mockApiService.getPage(pageId)
      setSections(data.sections || [])
    } catch (error) {
      console.error('Error loading page:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePage = async () => {
    try {
      setLoading(true)
      await mockApiService.savePage(pageId, { sections })
      alert('Page saved successfully!')
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Error saving page')
    } finally {
      setLoading(false)
    }
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    // Dragging from sidebar to canvas
    if (source.droppableId === 'sidebar' && destination.droppableId === 'canvas') {
      const sectionType = availableSections.find(s => s.id === draggableId)
      if (sectionType) {
        const newSection = {
          id: uuidv4(),
          type: sectionType.type,
          data: { ...sectionType.defaultData }
        }
        
        const newSections = [...sections]
        newSections.splice(destination.index, 0, newSection)
        setSections(newSections)
      }
    }

    // Reordering within canvas
    if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      const newSections = [...sections]
      const [reorderedSection] = newSections.splice(source.index, 1)
      newSections.splice(destination.index, 0, reorderedSection)
      setSections(newSections)
    }
  }

  const updateSection = (sectionId, newData) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, data: { ...section.data, ...newData } }
        : section
    ))
  }

  const removeSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId))
  }

  const clearCanvas = () => {
    if (confirm('Are you sure you want to clear all sections?')) {
      setSections([])
    }
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <div className="page-builder d-flex flex-column min-vh-100">
      <Header onToggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
      
      <Toolbar 
        onSave={savePage}
        onLoad={loadPage}
        onClear={clearCanvas}
        loading={loading}
      />
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Container fluid className="flex-grow-1">
          <Row className="min-vh-100">
            <Col 
              lg={3} 
              className={`p-0 ${sidebarVisible ? 'd-block' : 'd-none d-lg-block'}`}
            >
              <Sidebar 
                sections={availableSections} 
                onClose={() => setSidebarVisible(false)}
              />
            </Col>
            <Col lg={9} className="p-0">
              <Canvas 
                sections={sections}
                onUpdateSection={updateSection}
                onRemoveSection={removeSection}
              />
            </Col>
          </Row>
        </Container>
      </DragDropContext>
      
      <Footer />
    </div>
  )
}