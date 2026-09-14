import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import ProtectedRoute from './ProtectedRoute'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Home from '../pages/public/Home'

// Everything except Home is lazy-loaded: each page becomes its own chunk that
// only downloads when the user actually navigates there, instead of all
// pages (customer/vendor/admin dashboards included) being bundled into the
// single large main.js that triggered Vite's >500kB chunk-size warning.
const Login = lazy(() => import('../pages/public/Login'))
const Register = lazy(() => import('../pages/public/Register'))
const Venue = lazy(() => import('../pages/public/Venue'))
const Caterers = lazy(() => import('../pages/public/Caterers'))
const VenueDetails = lazy(() => import('../pages/public/VenueDetails'))
const CatererDetails = lazy(() => import('../pages/public/CatererDetails'))

const CreateEvent = lazy(() => import('../pages/customer/CreateEvent'))
const MyBookings = lazy(() => import('../pages/customer/MyBookings'))
const CustomerDashboard = lazy(() => import('../pages/customer/CustomerDashboard'))
const CustomerProfile = lazy(() => import('../pages/customer/CustomerProfile'))

const VendorDashboard = lazy(() => import('../pages/vendor/VendorDashboard'))
const ManageServices = lazy(() => import('../pages/vendor/ManageServices'))
const ManageAvailability = lazy(() => import('../pages/vendor/ManageAvailability'))
const VendorEditProfile = lazy(() => import('../pages/vendor/VendorEditProfile'))

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'))
const ManageUsers = lazy(() => import('../pages/admin/ManageUsers'))
const ManageVendors = lazy(() => import('../pages/admin/ManageVendors'))
const ManageVenues = lazy(() => import('../pages/admin/ManageVenues'))
const ManageCaterers = lazy(() => import('../pages/admin/ManageCaterers'))
const ManageBookings = lazy(() => import('../pages/admin/ManageBookings'))

// Routes that render their own full-bleed layout (auth split-screen, dashboard sidebar)
// and therefore should not also get the marketing-site top Navbar.
const NAVBAR_HIDDEN_PREFIXES = ['/login', '/register', '/customer', '/vendor', '/admin', '/events/create']

export default function AppRoutes() {
  const location = useLocation()
  const hideNavbar = NAVBAR_HIDDEN_PREFIXES.some((prefix) => location.pathname.startsWith(prefix))

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/venues" element={<Venue />} />
          <Route path="/caterers" element={<Caterers />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/caterers/:id" element={<CatererDetails />} />

          <Route path="/customer/dashboard" element={
            <ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>
          } />
          <Route path="/events/create" element={
            <ProtectedRoute allowedRoles={['customer']}><CreateEvent /></ProtectedRoute>
          } />
          <Route path="/customer/bookings" element={
            <ProtectedRoute allowedRoles={['customer']}><MyBookings /></ProtectedRoute>
          } />
          <Route path="/customer/profile" element={
            <ProtectedRoute allowedRoles={['customer']}><CustomerProfile /></ProtectedRoute>
          } />

          <Route path="/vendor/dashboard" element={
            <ProtectedRoute allowedRoles={['vendor']}><VendorDashboard /></ProtectedRoute>
          } />
          <Route path="/vendor/services" element={
            <ProtectedRoute allowedRoles={['vendor']}><ManageServices /></ProtectedRoute>
          } />
          <Route path="/vendor/availability" element={
            <ProtectedRoute allowedRoles={['vendor']}><ManageAvailability /></ProtectedRoute>
          } />
          <Route path="/vendor/profile" element={
            <ProtectedRoute allowedRoles={['vendor']}><VendorEditProfile /></ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>
          } />
          <Route path="/admin/vendors" element={
            <ProtectedRoute allowedRoles={['admin']}><ManageVendors /></ProtectedRoute>
          } />
          <Route path="/admin/venues" element={
            <ProtectedRoute allowedRoles={['admin']}><ManageVenues /></ProtectedRoute>
          } />
          <Route path="/admin/caterers" element={
            <ProtectedRoute allowedRoles={['admin']}><ManageCaterers /></ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute allowedRoles={['admin']}><ManageBookings /></ProtectedRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </>
  )
}
