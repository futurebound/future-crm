import { ArrowLeft, Mail, Notebook, Phone } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import DetailItem from '@/components/DetailItem'
// import InteractionsTab from '@/components/InteractionsTab'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { UserAuth } from '@/context/AuthContext'

export default function ContactDetailsPage() {
  const { contactId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { session } = UserAuth()
  const [contact, setContact] = useState(location.state?.contact)
  const [loading, setLoading] = useState(!location.state?.contact)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const fetchContact = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/contacts/${contactId}`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        )

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setContact(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
          navigate('/contacts', { replace: true })
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    if (!location.state?.contact) fetchContact()

    return () => controller.abort()
  }, [contactId, session?.access_token, navigate, location.state])

  const handleUpdate = async (field, value) => {
    setUpdating(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contacts/${contactId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            ...contact,
            [field]: value,
          }),
        }
      )

      if (!response.ok) throw new Error('Failed to update contact')

      const updatedContact = await response.json()
      setContact(updatedContact)
    } catch (err) {
      console.error('Update error:', err)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contacts/${contactId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete contact')
      }

      navigate('/contacts', { replace: true })
    } catch (err) {
      console.error('Delete error:', err)
      setError(err.message)
    }
  }

  if (loading) return <DetailSkeleton />
  if (error) return <ErrorAlert error={error} />
  if (!contact) return <NotFound navigate={navigate} />

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button asChild variant='ghost' size='icon'>
            <Link to='/contacts'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <h1 className='text-3xl font-bold'>{contact.name}</h1>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive' size='icon' className='shrink-0'>
              <Trash2 className='h-4 w-4' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Contact</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {contact.name}? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tabs defaultValue='details' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='details'>Details</TabsTrigger>
          <TabsTrigger value='interactions'>Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value='details'>
          <Card className='p-6'>
            <div className='space-y-4'>
              <DetailItem
                icon={Mail}
                label='Email'
                value={contact.email}
                onSave={(value) => handleUpdate('email', value)}
                disabled={updating}
              />
              <DetailItem
                icon={Phone}
                label='Phone'
                value={contact.phone}
                onSave={(value) => handleUpdate('phone', value)}
                disabled={updating}
              />
              <DetailItem
                icon={Notebook}
                label='Notes'
                value={contact.notes}
                multiline
                onSave={(value) => handleUpdate('notes', value)}
                disabled={updating}
              />
            </div>
          </Card>
        </TabsContent>

        {/* <TabsContent value='interactions'>
          <InteractionsTab contactId={contactId} />
        </TabsContent> */}
      </Tabs>
    </div>
  )
}

const DetailSkeleton = () => (
  <div className='container mx-auto space-y-6 p-6'>
    <Skeleton className='h-9 w-[200px]' />
    <div className='space-y-4'>
      <Skeleton className='h-[118px] w-full' />
    </div>
  </div>
)

const ErrorAlert = ({ error }) => (
  <Alert variant='destructive' className='m-4'>
    <AlertDescription>Error loading contact: {error}</AlertDescription>
  </Alert>
)

const NotFound = ({ navigate }) => (
  <div className='container mx-auto p-6'>
    <div className='flex items-center gap-4'>
      <Button variant='ghost' size='icon' onClick={() => navigate(-1)}>
        <ArrowLeft className='h-4 w-4' />
      </Button>
      <h1 className='text-3xl font-bold'>Contact not found</h1>
    </div>
  </div>
)
