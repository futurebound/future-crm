const jwt = require('jsonwebtoken')
const prisma = require('../utils/prismaClient')

export const authenticate = async (req, res, next) => {
  try {
    // const token = req.head('Authorization')?.split(' ')[1]

    const token = req.cookies.token
    if (!token) throw new Error('Authentication required')

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    })

    if (!user) throw new Error('User not found')
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}
