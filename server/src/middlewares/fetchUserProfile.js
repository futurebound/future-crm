import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function fetchUserProfile(req, res, next) {
  const authId = req.user?.id // From Supabase JWT
  if (!authId) return next()

  const user = await prisma.user.findUnique({
    where: { authId },
    select: { id: true, email: true, role: true },
  })

  if (user) {
    req.user = { ...req.user, ...user } // Merge auth and profile data
  }

  next()
}

// Use in your routes
app.use(fetchUserProfile)
