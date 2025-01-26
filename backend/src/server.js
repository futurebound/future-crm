const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

/**
 *  ---------------- SERVER ---------------
 */
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`)
})
