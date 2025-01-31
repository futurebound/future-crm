const { Router } = require('express')
const contactsRouter = Router()
const authenticateUser = require('../../middlewares/supabaseAuth')

const prisma = require('../../utils/prismaClient')

contactsRouter.get('/contacts', authenticateUser, async (req, res) => {
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

contactsRouter.post('/contacts', authenticateUser, async (req, res) => {
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

module.exports = contactsRouter
