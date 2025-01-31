import App from './App'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import ContactsPage from './pages/ContactsPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
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
      // {
      //   path: '/contacts',
      //   element: (
      //     <ProtectedRoute>
      //       <ContactsPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/contacts',
      //   element: (
      //     <ProtectedRoute>
      //       <ContactsPage />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]

export default routes
