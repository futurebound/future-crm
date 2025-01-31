import { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '@/utils/supabase'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  // const [user, setUser] = useState()
  const [session, setSession] = useState(undefined)
  // const [loading, setLoading] = useState(true)

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
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

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
    const { error } = supabase.auth.signOut()
    if (error) {
      console.error('error in signout:', error)
    }
  }

  // useEffect(() => {
  //   // Fetch initial session
  //   const setData = async () => {
  //     const {
  //       data: { session },
  //       error,
  //     } = await supabase.auth.getSession()
  //     if (error) throw error
  //     setSession(session)
  //     setUser(session?.user)
  //     setLoading(false)
  //   }

  //   // Listen for auth state changes
  //   const { data: listener } = supabase.auth.onAuthStateChange(
  //     (_event, session) => {
  //       setSession(session)
  //       setUser(session?.user)
  //       setLoading(false)
  //     }
  //   )

  //   setData()

  //   return () => listener?.subscription.unsubscribe()
  // }, [])

  const value = {
    session,
    signUpNewUser,
    signInUser,
    signOutUser,
    // user,
    // loading,
    // signIn: (email, password) =>
    //   supabase.auth.signInWithPassword({ email, password }),
    // signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const UserAuth = () => useContext(AuthContext)
