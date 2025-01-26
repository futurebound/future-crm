const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 *  ---------------- ROUTES ---------------
 */
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
