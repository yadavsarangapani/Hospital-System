import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Patient
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorSearch from './pages/patient/DoctorSearch';
import DoctorProfile from './pages/patient/DoctorProfile';
import AppointmentHistory from './pages/patient/AppointmentHistory';

// Doctor
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ManageSlots from './pages/doctor/ManageSlots';
import DailySchedule from './pages/doctor/DailySchedule';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageDoctors from './pages/admin/ManageDoctors';
import Analytics from './pages/admin/Analytics';
import Reports from './pages/admin/Reports';

function App() {
  const { user } = useAuth();

  const getHomePath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'DOCTOR': return '/doctor/dashboard';
      default: return '/patient/dashboard';
    }
  };

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to={getHomePath()} replace />} />

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute roles={['PATIENT']}><PatientDashboard /></ProtectedRoute>
        } />
        <Route path="/doctors" element={
          <ProtectedRoute roles={['PATIENT']}><DoctorSearch /></ProtectedRoute>
        } />
        <Route path="/doctor/:id" element={
          <ProtectedRoute roles={['PATIENT']}><DoctorProfile /></ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute roles={['PATIENT']}><AppointmentHistory /></ProtectedRoute>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute roles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>
        } />
        <Route path="/doctor/slots" element={
          <ProtectedRoute roles={['DOCTOR']}><ManageSlots /></ProtectedRoute>
        } />
        <Route path="/doctor/appointments" element={
          <ProtectedRoute roles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>
        } />
        <Route path="/doctor/schedule" element={
          <ProtectedRoute roles={['DOCTOR']}><DailySchedule /></ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/departments" element={
          <ProtectedRoute roles={['ADMIN']}><ManageDepartments /></ProtectedRoute>
        } />
        <Route path="/admin/doctors" element={
          <ProtectedRoute roles={['ADMIN']}><ManageDoctors /></ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute roles={['ADMIN']}><Analytics /></ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute roles={['ADMIN']}><Reports /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={getHomePath()} replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default App;
