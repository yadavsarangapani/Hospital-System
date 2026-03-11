import React, { useState, useEffect } from 'react';
import { getPatientAppointments, cancelAppointment } from '../../services/api';
import { toast } from 'react-toastify';
import { FiCalendar } from 'react-icons/fi';
import '../Dashboard.css';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await getPatientAppointments();
      setAppointments(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      toast.success('Appointment cancelled');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1><FiCalendar /> My Appointments</h1>
          <p>View and manage your appointment history</p>
        </div>
      </div>

      <div className="filter-bar">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>No appointments found</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>Dr. {a.doctorName}</td>
                  <td>{a.departmentName}</td>
                  <td>{a.appointmentDate}</td>
                  <td>{a.startTime} - {a.endTime}</td>
                  <td>₹{a.consultationFee}</td>
                  <td><span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span></td>
                  <td>
                    {(a.status === 'PENDING') && (
                      <button className="action-btn danger" onClick={() => handleCancel(a.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;
