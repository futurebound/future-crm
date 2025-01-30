const express = require('express')
// const helmet = require('helmet')
const app = express()
const cors = require('cors')
const api = require('./api/index')

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

app.get('/api/v1/user/profile', async (req, res) => {
  const authId = req.user?.id
  if (!authId) return res.status(401).json({ error: 'Unauthorized' })

  const user = await prisma.user.findUnique({
    where: { authId },
    select: { id: true, email: true, role: true }, // Add other fields as needed
  })

  if (!user) return res.status(404).json({ error: 'User not found' })

  res.json(user)
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
