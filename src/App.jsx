import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetail from './pages/CarDetail'
import Agencies from './pages/Agencies'
import AgencyDetail from './pages/AgencyDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import UserDashboard from './pages/dashboard/UserDashboard'
import AgencyDashboard from './pages/dashboard/AgencyDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/:id" element={<CarDetail />} />
        <Route path="agencies" element={<Agencies />} />
        <Route path="agencies/:id" element={<AgencyDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="account"
          element={
            <ProtectedRoute roles={['customer', 'agency', 'admin']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="agency"
          element={
            <ProtectedRoute roles={['agency']}>
              <AgencyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
