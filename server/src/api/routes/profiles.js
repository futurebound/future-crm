const { Router } = require('express')
const profilesRouter = Router()
const authenticateUser = require('../../middlewares/supabaseAuth')

const prisma = require('../../utils/prismaClient')

profilesRouter.get('/api/v1/profiles', authenticateUser, async (req, res) => {
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

module.exports = profilesRouter
