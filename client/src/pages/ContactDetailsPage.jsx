import { ArrowLeft, Mail, Notebook, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import DetailItem from '@/components/DetailItem'
// import InteractionsTab from '@/components/InteractionsTab'
import { Alert, AlertDescription } from '@/components/ui/alert'
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

  if (loading) return <DetailSkeleton />
  if (error) return <ErrorAlert error={error} />
  if (!contact) return <NotFound />

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <div className='flex items-center gap-4'>
        <Button asChild variant='ghost' size='icon'>
          <Link to='/contacts'>
            <ArrowLeft className='h-4 w-4' />
          </Link>
        </Button>
        <h1 className='text-3xl font-bold'>{contact.name}</h1>
      </div>

      <Tabs defaultValue='details' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='details'>Details</TabsTrigger>
          <TabsTrigger value='interactions'>Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value='details'>
          <Card className='p-6'>
            <div className='space-y-4'>
              <DetailItem icon={Mail} label='Email' value={contact.email} />
              <DetailItem icon={Phone} label='Phone' value={contact.phone} />
              <DetailItem
                icon={Notebook}
                label='Notes'
                value={contact.notes}
                multiline
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

const NotFound = () => (
  <div className='container mx-auto p-6'>
    <div className='flex items-center gap-4'>
      <Button variant='ghost' size='icon' onClick={() => navigate(-1)}>
        <ArrowLeft className='h-4 w-4' />
      </Button>
      <h1 className='text-3xl font-bold'>Contact not found</h1>
    </div>
  </div>
)
