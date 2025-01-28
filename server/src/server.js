const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

const cors = require('cors')
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://future-crm.vercel.app',
      /\.vercel\.app$/, // Allow all Vercel subdomains during development
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 *  ---------------- ROUTES ---------------
 */
app.get('/', (req, res) => {
  res.json({ message: 'get /' })
})

app.get('/api', (req, res) => {
  res.json({ message: 'get /api/' })
})

/**
 *  ---------------- SERVER ---------------
 */
// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}!`)
// })

module.exports = app
