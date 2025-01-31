const supabase = require('../utils/supabaseClient')

const authenticateUser = async (req, res, next) => {
  console.log('attempting to authenticate user token')
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  console.log('auth header present, extracting token')
  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Verify the JWT using Supabase
    console.log('attempting supabase auth with token:', token)
    const { data, error } = await supabase.auth.getUser(token)
    if (error) {
      throw error
    }

    req.userId = data.user.id
    next()
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}

module.exports = authenticateUser
