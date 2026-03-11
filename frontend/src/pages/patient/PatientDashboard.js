import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatientAppointments } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiCalendar, FiClock, FiSearch, FiActivity } from 'react-icons/fi';
import '../Dashboard.css';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPatientAppointments();
        setAppointments(res.data);
      } catch { }
      setLoading(false);
    };
    fetch();
  }, []);

  const upcoming = appointments.filter(
    a => ['PENDING', 'CONFIRMED'].includes(a.status) && new Date(a.appointmentDate) >= new Date(new Date().toDateString())
  );
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Manage your health appointments</p>
        </div>
        <Link to="/doctors" className="primary-btn"><FiSearch /> Find a Doctor</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><FiCalendar /></div>
          <div className="stat-info">
            <h3>{upcoming.length}</h3>
            <p>Upcoming</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><FiActivity /></div>
          <div className="stat-info">
            <h3>{completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon"><FiClock /></div>
          <div className="stat-info">
            <h3>{appointments.length}</h3>
            <p>Total</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Upcoming Appointments</h2>
          <Link to="/appointments" className="see-all">View All →</Link>
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : upcoming.length === 0 ? (
          <div className="empty-state">
            <p>No upcoming appointments</p>
            <Link to="/doctors" className="primary-btn">Book Now</Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.slice(0, 5).map(a => (
                  <tr key={a.id}>
                    <td>{a.doctorName}</td>
                    <td>{a.specialization}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.startTime} - {a.endTime}</td>
                    <td><span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
