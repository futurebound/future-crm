import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function DetailItem({
  icon: Icon,
  label,
  value,
  multiline = false,
  onSave,
  disabled = false,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(value)
      setIsEditing(false)
    }
  }

  return (
    <div className='flex gap-4'>
      <Icon className='mt-1 h-5 w-5 text-muted-foreground' />
      <div className='flex-1'>
        <p className='text-sm font-medium text-muted-foreground'>{label}</p>
        {isEditing ? (
          multiline ? (
            <Textarea
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className='mt-1'
              autoFocus
            />
          ) : (
            <Input
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className='mt-1'
              autoFocus
            />
          )
        ) : (
          <p
            className={`${!value ? 'text-muted-foreground' : ''} ${!disabled ? '-ml-1 cursor-pointer rounded px-1 hover:bg-accent/50' : ''}`}
            onClick={() => !disabled && setIsEditing(true)}
          >
            {value || 'Not provided'}
          </p>
        )}
      </div>
    </div>
  )
}
