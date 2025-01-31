const express = require('express')
// const helmet = require('helmet')
const app = express()
const cors = require('cors')
const api = require('./api/index')

const authenticateUser = require('./middlewares/supabaseAuth')
const prisma = require('./utils/prismaClient')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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

app.use('/api/v1', api)

app.get('/api/v1/profile', authenticateUser, async (req, res) => {
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
