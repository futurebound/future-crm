import { Mail, Notebook, Phone } from 'lucide-react'
import { ArrowDownUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AddContactButton from '@/components/AddContactButton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

import { UserAuth } from '@/context/AuthContext'

export default function ContactsPage() {
  const navigate = useNavigate()
  const { session } = UserAuth()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')

  const sortOptions = [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc', label: 'Oldest First' },
  ]

  // Add fuzzy search filtering
  const filteredContacts = contacts.filter((contact) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return contact.name?.toLowerCase().includes(searchLower)
  })

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
        const sortedData = sortContacts(data, sortOrder)
        setContacts(sortedData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (session?.access_token) {
      fetchContacts()
    }
  }, [session?.access_token, sortOrder])

  const handleContactAdded = (newContact) => {
    setContacts((prevContacts) => {
      const newContacts = [...prevContacts, newContact]
      return sortContacts(newContacts, sortOrder)
    })
  }

  const sortContacts = (contactsArray, order) => {
    return [...contactsArray].sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return order === 'asc' ? dateA - dateB : dateB - dateA
    })
  }

  const handleSortUpdate = (sortOption) => {
    setSortOrder(sortOption)
    setContacts((prevContacts) => sortContacts(prevContacts, sortOption))
  }

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
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Contacts</h1>
        </div>

        {/* Sorting Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='gap-2'>
              <ArrowDownUp className='h-4 w-4' />
              {sortOptions.find((opt) => opt.value === sortOrder)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSortUpdate(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='flex items-center gap-4'>
        {/* New Search Input */}
        <Input
          placeholder='Search contacts...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-[300px]'
        />
      </div>

      <ScrollArea className='h-[calc(100vh-200px)]'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredContacts.length === 0 ? (
            <p className='col-span-full py-8 text-center text-muted-foreground'>
              {contacts.length === 0
                ? 'No contacts found. Add your first contact to get started.'
                : `No matches for "${searchTerm}"`}
            </p>
          ) : (
            [...filteredContacts].map((contact) => (
              <Card
                key={contact.id}
                className='cursor-pointer transition-colors hover:bg-accent/50'
                onClick={() =>
                  navigate(`/contacts/${contact.id}`, {
                    state: { contact }, // Pass contact data via state
                  })
                }
              >
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
      <AddContactButton onContactAdded={handleContactAdded} />
    </div>
  )
}
