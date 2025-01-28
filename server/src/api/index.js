const { Router } = require('express')

const router = Router()

const authRouter = require('./routes/authRouter')

// GET /api/v1
router.get('/', (req, res) => {
  res.json({ message: 'hi from api/v1' })
})

// /api/v1/auth
router.use('/auth', authRouter)

module.exports = router
