import React, { useState, useEffect } from 'react';
import { getSystemOverview, getAllAppointments, cancelAppointment } from '../../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiCalendar, FiActivity, FiLayers } from 'react-icons/fi';
import '../Dashboard.css';

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [ovRes, appRes] = await Promise.all([getSystemOverview(), getAllAppointments()]);
      setOverview(ovRes.data);
      setAppointments(appRes.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      toast.success('Appointment cancelled');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div><h1>Admin Dashboard</h1><p>System overview and management</p></div>
      </div>

      <div className="stats-grid four">
        <div className="stat-card blue">
          <div className="stat-icon"><FiUsers /></div>
          <div className="stat-info"><h3>{overview.totalDoctors || 0}</h3><p>Doctors</p></div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><FiUsers /></div>
          <div className="stat-info"><h3>{overview.totalPatients || 0}</h3><p>Patients</p></div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon"><FiCalendar /></div>
          <div className="stat-info"><h3>{overview.totalAppointments || 0}</h3><p>Appointments</p></div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon"><FiLayers /></div>
          <div className="stat-info"><h3>{overview.totalDepartments || 0}</h3><p>Departments</p></div>
        </div>
      </div>

      <div className="stats-grid three">
        <div className="stat-card-small pending">
          <h4>{overview.pendingAppointments || 0}</h4><p>Pending</p>
        </div>
        <div className="stat-card-small completed">
          <h4>{overview.completedAppointments || 0}</h4><p>Completed</p>
        </div>
        <div className="stat-card-small cancelled">
          <h4>{overview.cancelledAppointments || 0}</h4><p>Cancelled</p>
        </div>
      </div>

      <div className="section">
        <h2>Recent Appointments</h2>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Patient</th><th>Doctor</th><th>Dept</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {appointments.slice(0, 20).map(a => (
                  <tr key={a.id}>
                    <td>{a.patientName}</td>
                    <td>Dr. {a.doctorName}</td>
                    <td>{a.departmentName}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.startTime}</td>
                    <td><span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span></td>
                    <td>
                      {!['COMPLETED', 'CANCELLED'].includes(a.status) && (
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
    </div>
  );
};

export default AdminDashboard;
