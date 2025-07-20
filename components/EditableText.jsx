import { useState, useRef, useEffect } from 'react'

const EditableText = ({ 
  tag: Tag = 'div', 
  value, 
  onChange, 
  placeholder = 'Click to edit...', 
  className = '',
  ...props 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value || '')
  const inputRef = useRef(null)

  useEffect(() => {
    setEditValue(value || '')
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (onChange && editValue !== value) {
      onChange(editValue)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && Tag !== 'textarea') {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === 'Escape') {
      setEditValue(value || '')
      setIsEditing(false)
    }
  }

  const displayValue = value || placeholder

  if (isEditing) {
    const InputTag = Tag === 'textarea' || editValue.length > 50 ? 'textarea' : 'input'
    
    return (
      <InputTag
        ref={inputRef}
        type={InputTag === 'input' ? 'text' : undefined}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`editable-text ${className}`}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          width: '100%',
          resize: InputTag === 'textarea' ? 'vertical' : 'none',
          minHeight: InputTag === 'textarea' ? '100px' : 'auto'
        }}
        {...props}
      />
    )
  }

  return (
    <Tag 
      className={`editable-text ${className} ${!value ? 'text-muted' : ''}`}
      onClick={handleClick}
      style={{ cursor: 'text' }}
      {...props}
    >
      {displayValue}
    </Tag>
  )
}

export default EditableText