import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDoctorAppointments, getDoctorPendingAppointments, confirmAppointment, rejectAppointment, completeAppointment } from '../../services/api';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import '../Dashboard.css';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctorId = user?.doctorId;

  const fetchData = async () => {
    if (!doctorId) return setLoading(false);
    try {
      const [allRes, pendRes] = await Promise.all([
        getDoctorAppointments(doctorId),
        getDoctorPendingAppointments(doctorId)
      ]);
      setAppointments(allRes.data);
      setPending(pendRes.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [doctorId]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'confirm') await confirmAppointment(id);
      if (action === 'reject') await rejectAppointment(id);
      if (action === 'complete') await completeAppointment(id);
      toast.success(`Appointment ${action}ed!`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action}`);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingAppts = appointments.filter(
    a => a.appointmentDate >= today && ['CONFIRMED', 'PENDING'].includes(a.status)
  ).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate) || a.startTime.localeCompare(b.startTime));
  
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;

  if (!doctorId) return (
    <div className="dashboard">
      <div className="empty-state">
        <h2>Doctor profile not yet set up</h2>
        <p>Please contact the administrator to link your account to a doctor profile.</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Doctor Dashboard</h1>
          <p>Welcome back, Dr. {user?.name}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><FiCalendar /></div>
          <div className="stat-info"><h3>{upcomingAppts.length}</h3><p>Upcoming</p></div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon"><FiClock /></div>
          <div className="stat-info"><h3>{pending.length}</h3><p>Pending</p></div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><FiCheckCircle /></div>
          <div className="stat-info"><h3>{completed}</h3><p>Completed</p></div>
        </div>
      </div>

      <div className="section">
        <h2>Pending Appointment Requests</h2>
        {loading ? <div className="loading">Loading...</div> : pending.length === 0 ? (
          <div className="empty-state"><p>No pending requests</p></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Patient</th><th>Date</th><th>Time</th><th>Notes</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {pending.map(a => (
                  <tr key={a.id}>
                    <td>{a.patientName}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.startTime} - {a.endTime}</td>
                    <td>{a.notes || '—'}</td>
                    <td className="action-btns">
                      <button className="action-btn success" onClick={() => handleAction(a.id, 'confirm')}><FiCheckCircle /> Accept</button>
                      <button className="action-btn danger" onClick={() => handleAction(a.id, 'reject')}><FiXCircle /> Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Upcoming Schedule</h2>
        {upcomingAppts.length === 0 ? (
          <div className="empty-state"><p>No upcoming appointments</p></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {upcomingAppts.map(a => (
                  <tr key={a.id}>
                    <td>{a.patientName}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.startTime} - {a.endTime}</td>
                    <td><span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span></td>
                    <td>
                      {a.status === 'CONFIRMED' && (
                        <button className="action-btn success" onClick={() => handleAction(a.id, 'complete')}><FiCheckCircle /> Complete</button>
                      )}
                    </td>
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

export default DoctorDashboard;
