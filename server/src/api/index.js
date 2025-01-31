const { Router } = require('express')
const apiRouter = Router()

const profilesRouter = require('./routes/profiles')
const contactsRouter = require('./routes/contacts')

// GET /api/v1
// router.get('/', (req, res) => {
//   res.json({ message: 'hi from api/v1' })
// })

apiRouter.use('/profiles', profilesRouter)
apiRouter.use('/contacts', contactsRouter)

module.exports = apiRouter
