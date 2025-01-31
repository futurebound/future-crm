import App from './App'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import CompaniesPage from './pages/CompaniesPage'
import ContactsPage from './pages/ContactsPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import InteractionsPage from './pages/InteractionsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/contacts',
        element: (
          <ProtectedRoute>
            <ContactsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/companies',
        element: (
          <ProtectedRoute>
            <CompaniesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/interactions',
        element: (
          <ProtectedRoute>
            <InteractionsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]

export default routes
