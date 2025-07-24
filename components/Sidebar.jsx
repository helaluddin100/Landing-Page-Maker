import { Card, ListGroup } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { Droppable, Draggable } from 'react-beautiful-dnd'

const Sidebar = ({ sections, onClose }) => {
  return (
    <div className="sidebar">
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            <i className="bi bi-puzzle me-2"></i>
            Page Sections
          </h5>
          <Button
            variant="outline-secondary"
            size="sm"
            className="d-lg-none"
            onClick={onClose}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>

        <Droppable droppableId="sidebar" isDropDisabled={true}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      className={`section-item mb-3 ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <i className={`bi ${section.icon} fs-4 text-primary`}></i>
                          </div>
                          <div>
                            <h6 className="mb-1">{section.name}</h6>
                            <small className="text-muted">{section.description}</small>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
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

export default Sidebar