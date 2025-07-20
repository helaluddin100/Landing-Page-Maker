import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from 'react-bootstrap'
import SectionRenderer from './SectionRenderer'

const Canvas = ({ sections, onUpdateSection, onRemoveSection }) => {
  return (
    <div className="canvas-container">
      <div className="canvas">
        <Droppable droppableId="canvas">
          {(provided, snapshot) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`p-4 ${snapshot.isDraggingOver ? 'bg-light' : ''}`}
              style={{ minHeight: '100vh' }}
            >
              {sections.length === 0 && (
                <div className="drop-zone">
                  <div className="text-center">
                    <i className="bi bi-plus-circle fs-1 mb-3"></i>
                    <h5>Drag sections here to build your page</h5>
                    <p className="text-muted">Start by dragging a section from the sidebar</p>
                  </div>
                </div>
              )}
              
              {sections.map((section, index) => (
                <Draggable 
                  key={section.id} 
                  draggableId={section.id} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`section-wrapper ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    >
                      <div 
                        {...provided.dragHandleProps}
                        className="section-controls"
                      >
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => onRemoveSection(section.id)}
                          className="me-2"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          style={{ cursor: 'grab' }}
                        >
                          <i className="bi bi-grip-vertical"></i>
                        </Button>
                      </div>
                      
                      <SectionRenderer 
                        section={section}
                        onUpdate={(data) => onUpdateSection(section.id, data)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export default Canvas