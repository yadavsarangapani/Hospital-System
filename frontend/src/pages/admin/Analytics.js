import React, { useState, useEffect } from 'react';
import { getAppointmentsPerDoctor, getRevenuePerDepartment, getMonthlyStats } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { FiBarChart2 } from 'react-icons/fi';
import '../Dashboard.css';

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fb923c', '#f87171', '#a78bfa', '#fbbf24', '#22d3ee'];

const Analytics = () => {
  const [perDoctor, setPerDoctor] = useState([]);
  const [perDept, setPerDept] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [d, dept, m] = await Promise.all([
          getAppointmentsPerDoctor(),
          getRevenuePerDepartment(),
          getMonthlyStats()
        ]);
        setPerDoctor(d.data);
        setPerDept(dept.data);
        setMonthly(m.data.map(item => ({
          ...item,
          label: `${item.month}/${item.year}`
        })));
      } catch { }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="dashboard"><div className="loading">Loading analytics...</div></div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div><h1><FiBarChart2 /> Analytics</h1><p>Visual reports and insights</p></div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Appointments per Doctor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={perDoctor}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="doctorName" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
              <Bar dataKey="totalAppointments" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Revenue per Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={perDept} dataKey="revenue" nameKey="department" cx="50%" cy="50%" outerRadius={100} label>
                {perDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full">
          <h3>Monthly Appointment Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
              <Line type="monotone" dataKey="count" stroke="#818cf8" strokeWidth={3} dot={{ fill: '#818cf8' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
