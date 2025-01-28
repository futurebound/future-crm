const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

const cors = require('cors')
const allowedOrigins = ['https://future-crm-client.vercel.app']

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true, // Allow cookies and credentials (if needed)
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
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`)
})
