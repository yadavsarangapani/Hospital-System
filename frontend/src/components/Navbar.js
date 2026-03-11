import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { FaHospitalAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'DOCTOR': return '/doctor/dashboard';
      case 'PATIENT': return '/patient/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={getDashboardPath()} className="navbar-brand">
          <FaHospitalAlt className="brand-icon" />
          <span>MediCare<span className="brand-highlight">Hub</span></span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'active' : ''}`}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)}>Dashboard</Link>
              {user.role === 'PATIENT' && (
                <>
                  <Link to="/doctors" onClick={() => setMobileOpen(false)}>Find Doctors</Link>
                  <Link to="/appointments" onClick={() => setMobileOpen(false)}>My Appointments</Link>
                </>
              )}
              {user.role === 'DOCTOR' && (
                <>
                  <Link to="/doctor/slots" onClick={() => setMobileOpen(false)}>Manage Slots</Link>
                  <Link to="/doctor/appointments" onClick={() => setMobileOpen(false)}>Appointments</Link>
                  <Link to="/doctor/schedule" onClick={() => setMobileOpen(false)}>Schedule</Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <Link to="/admin/departments" onClick={() => setMobileOpen(false)}>Departments</Link>
                  <Link to="/admin/doctors" onClick={() => setMobileOpen(false)}>Doctors</Link>
                  <Link to="/admin/analytics" onClick={() => setMobileOpen(false)}>Analytics</Link>
                  <Link to="/admin/reports" onClick={() => setMobileOpen(false)}>Reports</Link>
                </>
              )}
              <div className="navbar-user">
                <FiUser /> <span>{user.name}</span>
                <span className="role-badge">{user.role}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          )}
        </div>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
