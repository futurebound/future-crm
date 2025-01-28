const { Router } = require('express')
const bcrypt = require('bcrypt')
const prisma = require('../../utils/prismaClient')

const authRouter = Router()

authRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'SALES',
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = authRouter
