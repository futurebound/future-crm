import { Mail, Notebook, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

import { UserAuth } from '@/context/AuthContext'

export default function ContactsPage() {
  const { session } = UserAuth()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/contacts`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch contacts')
        }

        const data = await response.json()
        setContacts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (session?.access_token) {
      fetchContacts()
    }
  }, [session?.access_token])

  if (loading)
    return (
      <div className='space-y-4 p-4'>
        <Skeleton className='h-12 w-[250px]' />
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className='h-[200px]' />
          ))}
        </div>
      </div>
    )

  if (error)
    return (
      <Alert variant='destructive' className='m-4'>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <h1>Contacts Page</h1>
      <h2>Welcome, {session?.user?.email}</h2>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Contacts</h1>
        <p className='text-muted-foreground'>
          Manage your contacts and their information
        </p>
      </div>

      <ScrollArea className='h-[calc(100vh-200px)]'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {contacts.length === 0 ? (
            <p className='col-span-full py-8 text-center text-muted-foreground'>
              No contacts found. Add your first contact to get started.
            </p>
          ) : (
            contacts.map((contact) => (
              <Card key={contact.id}>
                <CardHeader>
                  <h3 className='text-lg font-semibold'>{contact.name}</h3>
                </CardHeader>
                <CardContent className='space-y-2'>
                  {contact.email && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Mail className='h-4 w-4' />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Phone className='h-4 w-4' />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.notes && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Notebook className='h-4 w-4' />
                      <span className='line-clamp-2'>{contact.notes}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
