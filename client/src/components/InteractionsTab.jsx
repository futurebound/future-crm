import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { UserAuth } from '@/context/AuthContext'

export default function InteractionsTab({ contactId }) {
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { session } = UserAuth()

  const fetchInteractions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contacts/${contactId}/interactions`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )
      if (!response.ok) throw new Error('Failed to fetch interactions')
      const data = await response.json()
      setInteractions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInteractions()
  }, [contactId, session?.access_token])

  const handleAddInteraction = async (formData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contacts/${contactId}/interactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(formData),
        }
      )
      if (!response.ok) throw new Error('Failed to add interaction')
      fetchInteractions()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddInteractionDialog onSubmit={handleAddInteraction} />
      </div>

      <div className='space-y-4'>
        {interactions.map((interaction) => (
          <Card key={interaction.id} className='p-4'>
            <div className='flex justify-between'>
              <div className='font-semibold'>
                {interaction.type.charAt(0) +
                  interaction.type.slice(1).toLowerCase()}
              </div>
              <div className='text-sm text-muted-foreground'>
                {/* {new Date(interaction.date).toLocaleDateString()} */}
                {new Date(interaction.createdAt).toLocaleDateString()}
              </div>
            </div>
            <p className='mt-2'>{interaction.notes}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AddInteractionDialog({ onSubmit }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setOpen(false)
    setFormData({
      type: '',
      notes: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Interaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Interaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='CALL'>Call</SelectItem>
              <SelectItem value='EMAIL'>Email</SelectItem>
              <SelectItem value='MEETING'>Meeting</SelectItem>
              <SelectItem value='NOTE'>Note</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <Textarea
            placeholder='Notes'
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          <Button type='submit'>Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
