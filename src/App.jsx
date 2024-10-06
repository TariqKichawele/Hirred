
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import LandingPage from './pages/LandingPage'
import Onboarding from './pages/Onboarding'
import JobListing from './pages/JobListing'
import Job from './pages/Job'
import PostJob from './pages/PostJob'
import SavedJobs from './pages/SavedJobs'
import MyJobs from './pages/MyJobs'

const router = createBrowserRouter([
  { 
    element: <AppLayout />, 
    children: [
      { 
        path: '/', 
        element: <LandingPage /> 
      },
      {
        path: '/onboarding',
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        )
      },
      {
        path: '/jobs',
        element: (
          <ProtectedRoute>
            <JobListing />
          </ProtectedRoute>
        )
      },
      {
        path: '/job/:id',
        element: (
          <ProtectedRoute>
            <Job />
          </ProtectedRoute>
        )
      },
      {
        path: '/post-job',
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        )
      },
      {
        path: '/saved-jobs',
        element: (
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        )
      },
      {
        path: '/my-jobs',
        element: (
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        )
      },

    ] 
  }
])

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
