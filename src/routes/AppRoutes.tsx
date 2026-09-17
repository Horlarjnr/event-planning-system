import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import ProtectedRoute from './ProtectedRoute'
import Venue from '../pages/public/Venue'
import Caterers from '../pages/public/Caterers'
import Home from '../pages/public/Home'
import VenueDetails from '../pages/public/VenueDetails'
import CatererDetails from '../pages/public/CatererDetails'
import About from '../pages/public/About'
import Contact from '../pages/public/Contact'
import HelpCenter from '../pages/public/HelpCenter'
import TermsOfService from '../pages/public/TermsOfService'
import PrivacyPolicy from '../pages/public/PrivacyPolicy'
import CreateEvent from '../pages/customer/CreateEvent'
import MyBookings from '../pages/customer/MyBookings'
import CustomerDashboard from '../pages/customer/CustomerDashboard'
import CustomerProfile from '../pages/customer/CustomerProfile'
import VendorDashboard from '../pages/vendor/VendorDashboard'
import ManageServices from '../pages/vendor/ManageServices'
import ManageAvailability from '../pages/vendor/ManageAvailability'
import VendorEditProfile from '../pages/vendor/VendorEditProfile'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminProfile from '../pages/admin/AdminProfile'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageVendors from '../pages/admin/ManageVendors'
import ManageVenues from '../pages/admin/ManageVenues'
import ManageCaterers from '../pages/admin/ManageCaterers'
import ManageBookings from '../pages/admin/ManageBookings'
// Routes that render their own full-bleed layout (auth split-screen, dashboard sidebar)
// and therefore should not also get the marketing-site top Navbar.
const NAVBAR_HIDDEN_PREFIXES = ['/login', '/register', '/customer', '/vendor', '/admin', '/events/create']

export default function AppRoutes() {
  const location = useLocation()
  const hideNavbar = NAVBAR_HIDDEN_PREFIXES.some((prefix) => location.pathname.startsWith(prefix))

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/venues" element={<Venue />} />
        <Route path="/caterers" element={<Caterers />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route path="/caterers/:id" element={<CatererDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

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
    </>
  )
}
