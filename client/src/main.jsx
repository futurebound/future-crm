import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import './index.css'
import routes from './routes'
import { AuthContextProvider } from '@/context/AuthContext'

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes until data becomes stale
      cacheTime: 30 * 60 * 1000, // 30 minutes cache retention
      refetchOnWindowFocus: false, // Customize based on needs
      retry: 2, // Retry failed requests twice
    },
  },
})

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>
)
