import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { supabase } from '@/lib/supabase'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  /**
   * Direct handling of auth session state changes to prevent stale sessions
   */
  const handleAuthStateChange = useCallback(async (event, session) => {
    /**
     * Add session validation check
     */
    const validateSession = (session) => {
      if (!session) return false
      const expiresAt = new Date(session.expires_at * 1000)
      return expiresAt > new Date()
    }

    if (event === 'INITIAL_SESSION') {
      setLoading(true)
    }

    const isValid = validateSession(session)
    setSession(isValid ? session : null)

    // Force token refresh check
    if (session && !isValid) {
      await supabase.auth.signOut()
    }

    setLoading(false)
  }, [])

  // Signup Use
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    })

    if (error) {
      console.error('issue with user signup:', error)
      return { success: false, error: error.message }
    }

    // console.log(data)
    return { success: true, data }
  }

  // listen for initial auth session
  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session)
  //   })

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //   })
  // }, [])

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('INITIAL_SESSION', session)
    })

    // Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    // Auto-logout timer
    let expirationTimer
    const setupExpirationCheck = () => {
      if (session?.expires_at) {
        const expiresIn = session.expires_at * 1000 - Date.now()
        expirationTimer = setTimeout(
          () => {
            supabase.auth.signOut()
          },
          Math.max(expiresIn, 0)
        )
      }
    }

    setupExpirationCheck()

    return () => {
      subscription?.unsubscribe()
      clearTimeout(expirationTimer)
    }
  }, [handleAuthStateChange, session?.expires_at])

  /**
   * Sign in existing user
   */
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      })

      if (error) {
        console.error('sign in error:', error)
        return { success: false, error: error.message }
      }

      // console.log('sign in success:', data)
      return { success: true, data }
    } catch (error) {
      console.error('error occurred signing in user:', error)
    }
  }

  // Sign Out user
  const signOutUser = () => {
    setLoading(true)
    const { error } = supabase.auth.signOut()
    setSession(null)
    setLoading(false)
    if (error) {
      console.error('error in signout:', error)
    }
  }

  const value = {
    session,
    loading,
    signUpNewUser,
    signInUser,
    signOutUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => useContext(AuthContext)
