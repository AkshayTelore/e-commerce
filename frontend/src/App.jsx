import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import LoginPage from './pages/LoginPage'
import ResisterPage from './pages/ResisterPage'
import { SignIn, SignedIn, SignedOut } from '@clerk/clerk-react'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resister" element={<ResisterPage />} />
      </Routes>
    </Router>
  )
}

function AdminRoutes() {
  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
          </Routes>
        </AdminLayout>
      </SignedIn>
    </>
  )
}

export default App
