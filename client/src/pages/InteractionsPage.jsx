import { Calendar, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

import { UserAuth } from '@/context/AuthContext'

export default function InteractionsPage() {
  const { session } = UserAuth()
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredInteractions = interactions.filter((interaction) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      interaction.contact.name?.toLowerCase().includes(searchLower) ||
      interaction.notes?.toLowerCase().includes(searchLower)
    )
  })

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/interactions`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch interactions')
        }

        const data = await response.json()
        setInteractions(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (session?.access_token) {
      fetchInteractions()
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
    <div className='container mx-auto mb-16 space-y-6 p-6'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Interactions</h1>
      </div>

      {/* Search Field */}
      <div className='flex items-center gap-4'>
        <Input
          placeholder='Search interactions...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-[300px]'
        />
      </div>

      <ScrollArea className='h-[calc(100vh-200px)]'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredInteractions.length === 0 ? (
            <p className='col-span-full py-8 text-center text-muted-foreground'>
              {interactions.length === 0
                ? 'No interactions found.'
                : `No matches for "${searchTerm}"`}
            </p>
          ) : (
            [...filteredInteractions]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((interaction) => (
                <Card key={interaction.id} className='p-4'>
                  <div className='flex justify-between'>
                    <div className='font-semibold'>
                      {`${interaction.contact.name} - ${interaction.type.charAt(0)}${interaction.type.slice(1).toLowerCase()}`}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {/* {new Date(interaction.date).toLocaleDateString()} */}
                      {new Date(interaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className='mt-2'>{interaction.notes}</p>
                </Card>
              ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
