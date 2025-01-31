import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { UserAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function AddContactButton({ onContactAdded }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { session } = UserAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create contact')
      }

      const newContact = await response.json()
      onContactAdded(newContact)
      setOpen(false)
      toast({
        title: 'Success',
        description: 'Contact created successfully',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-lg'
          size='icon'
        >
          <Plus className='h-6 w-6' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name'>Name *</Label>
            <Input id='name' name='name' required />
          </div>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' type='email' />
          </div>
          <div>
            <Label htmlFor='phone'>Phone</Label>
            <Input id='phone' name='phone' />
          </div>
          <div>
            <Label htmlFor='notes'>Notes</Label>
            <Textarea id='notes' name='notes' />
          </div>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Creating...' : 'Create Contact'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
