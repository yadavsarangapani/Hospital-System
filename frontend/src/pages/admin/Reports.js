import React, { useState, useEffect } from 'react';
import { getAppointmentsPerDoctor, getRevenuePerDepartment, getDailyStats } from '../../services/api';
import { FiFileText } from 'react-icons/fi';
import '../Dashboard.css';

const Reports = () => {
  const [perDoctor, setPerDoctor] = useState([]);
  const [perDept, setPerDept] = useState([]);
  const [daily, setDaily] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [d, dept, daily] = await Promise.all([
        getAppointmentsPerDoctor(),
        getRevenuePerDepartment(),
        getDailyStats(dateRange.start, dateRange.end)
      ]);
      setPerDoctor(d.data);
      setPerDept(dept.data);
      setDaily(daily.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [dateRange]);

  const totalRevenue = perDept.reduce((sum, d) => sum + (d.revenue || 0), 0);
  const totalAppts = perDoctor.reduce((sum, d) => sum + (d.totalAppointments || 0), 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div><h1><FiFileText /> Reports</h1><p>Detailed appointment and revenue reports</p></div>
        <div className="date-range">
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
          <span>to</span>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue"><div className="stat-info"><h3>{totalAppts}</h3><p>Total Appointments</p></div></div>
        <div className="stat-card green"><div className="stat-info"><h3>₹{totalRevenue.toLocaleString()}</h3><p>Total Revenue</p></div></div>
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <>
          <div className="section">
            <h2>Appointments per Doctor</h2>
            <div className="table-container">
              <table>
                <thead><tr><th>Doctor</th><th>Total Appointments</th></tr></thead>
                <tbody>
                  {perDoctor.map((d, i) => (
                    <tr key={i}><td>Dr. {d.doctorName}</td><td>{d.totalAppointments}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="section">
            <h2>Revenue per Department</h2>
            <div className="table-container">
              <table>
                <thead><tr><th>Department</th><th>Revenue (₹)</th></tr></thead>
                <tbody>
                  {perDept.map((d, i) => (
                    <tr key={i}><td>{d.department}</td><td>₹{(d.revenue || 0).toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="section">
            <h2>Daily Appointment Statistics</h2>
            <div className="table-container">
              <table>
                <thead><tr><th>Date</th><th>Appointments</th></tr></thead>
                <tbody>
                  {daily.map((d, i) => (
                    <tr key={i}><td>{d.date}</td><td>{d.count}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
