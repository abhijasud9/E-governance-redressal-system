import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import CitizenLogin from './pages/CitizenLogin';
import AdminLogin from './pages/AdminLogin';
import SystemAdminLogin from './pages/SystemAdminLogin';
import Register from './pages/Register';

// Citizen Pages
import CitizenDashboard from './pages/CitizenDashboard';
import CreateComplaint from './pages/CreateComplaint';
import MyComplaints from './pages/MyComplaints';
import Profile from './pages/Profile';
import DashboardSelector from './pages/DashboardSelector';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminMapView from './pages/AdminMapView';

// Sys Admin Pages
import CreateAdmin from './pages/CreateAdmin';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login-citizen" element={<CitizenLogin />} />
            <Route path="/login-admin" element={<AdminLogin />} />
            <Route path="/login-sysadmin" element={<SystemAdminLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Citizen Routes */}
              <Route index element={<DashboardSelector />} />
              <Route path="new-complaint" element={<CreateComplaint />} />
              <Route path="my-complaints" element={<MyComplaints />} />
              <Route path="profile" element={<Profile />} />

              {/* Admin Routes — accessible by ADMIN and SYSTEM_ADMIN */}
              <Route path="admin/complaints" element={
                <ProtectedRoute role={['ADMIN', 'SYSTEM_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin/users" element={
                <ProtectedRoute role={['ADMIN', 'SYSTEM_ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="admin/analytics" element={
                <ProtectedRoute role={['ADMIN', 'SYSTEM_ADMIN']}>
                  <AdminAnalytics />
                </ProtectedRoute>
              } />
              <Route path="admin/map" element={
                <ProtectedRoute role={['ADMIN', 'SYSTEM_ADMIN']}>
                  <AdminMapView />
                </ProtectedRoute>
              } />

              {/* System Admin Only Routes */}
              <Route path="sysadmin/create-admin" element={
                <ProtectedRoute role="SYSTEM_ADMIN">
                  <CreateAdmin />
                </ProtectedRoute>
              } />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
