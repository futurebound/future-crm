const express = require('express')
// const helmet = require('helmet')
const app = express()
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const authenticateUser = require('./middlewares/supabaseAuth')
const prisma = require('./utils/prismaClient')
// const apiRouter = require('./api/index')

// app.use(helmet())
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://future-crm-client.vercel.app',
      /\.vercel\.app$/, // Allow all Vercel subdomains during development
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 *  ---------------- ROUTES ---------------
 */
app.get('/', (req, res) => {
  res.json({ message: 'get /', env: process.env.NODE_ENV })
})

app.get('/api/v1/profiles', authenticateUser, async (req, res) => {
  console.log('attempting to get user profile')
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    })
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile ' })
  }
})

app.get('/api/v1/contacts', authenticateUser, async (req, res) => {
  console.log('attempting to get all contacts')
  try {
    const contacts = await prisma.contact.findMany({
      where: { ownerId: req.userId },
    })
    res.json(contacts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts ' })
  }
})

app.post('/api/v1/contacts', authenticateUser, async (req, res) => {
  console.log('attempting to create new contact')
  try {
    const { name, email, phone, notes, companyId } = req.body

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Contact name is required',
      })
    }

    // Create the contact
    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        notes,
        ownerId: req.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        notes: true,
      },
    })

    res.status(201).json(newContact)
  } catch (error) {
    console.error('Contact creation error:', error)

    // Handle Prisma errors
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Contact with this email already exists',
      })
    }

    res.status(500).json({
      error: 'Failed to create contact',
    })
  }
})

app.put('/api/v1/contacts/:contactId', authenticateUser, async (req, res) => {
  try {
    const { contactId } = req.params
    const { name, email, phone, notes } = req.body

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Contact name is required',
      })
    }

    const updatedContact = await prisma.contact.update({
      where: {
        id: contactId,
        ownerId: req.userId, // Ensure user owns this contact
      },
      data: {
        name,
        email,
        phone,
        notes,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        notes: true,
      },
    })

    res.json(updatedContact)
  } catch (error) {
    console.error('Contact update error:', error)
    res.status(500).json({ error: 'Failed to update contact' })
  }
})

app.delete(
  '/api/v1/contacts/:contactId',
  authenticateUser,
  async (req, res) => {
    try {
      const { contactId } = req.params

      // Verify contact exists and belongs to user
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
      })

      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' })
      }

      if (contact.ownerId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' })
      }

      // Delete the contact
      await prisma.contact.delete({
        where: { id: contactId },
      })

      res.status(204).send()
    } catch (error) {
      console.error('Contact deletion error:', error)
      res.status(500).json({ error: 'Failed to delete contact' })
    }
  },
)

/**
 *  ---------------- SERVER ---------------
 */
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`)
  })
}

module.exports = app
