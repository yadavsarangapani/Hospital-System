import React, { useState, useEffect } from 'react';
import { getDoctors, getDepartments, createDoctor, deleteDoctor } from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiUserPlus } from 'react-icons/fi';
import '../Dashboard.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', departmentId: '', specialization: '',
    qualification: '', experienceYears: '', consultationFee: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([getDoctors(), getDepartments()]);
      setDoctors(docRes.data);
      setDepartments(deptRes.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDoctor({
        ...form,
        departmentId: parseInt(form.departmentId),
        experienceYears: parseInt(form.experienceYears),
        consultationFee: parseFloat(form.consultationFee)
      });
      toast.success('Doctor added!');
      setForm({ name: '', email: '', phone: '', departmentId: '', specialization: '', qualification: '', experienceYears: '', consultationFee: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this doctor?')) return;
    try {
      await deleteDoctor(id);
      toast.success('Doctor removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div><h1><FiUserPlus /> Manage Doctors</h1><p>Add and manage doctor accounts</p></div>
        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> {showForm ? 'Hide Form' : 'Add Doctor'}
        </button>
      </div>

      {showForm && (
        <div className="section">
          <h2>Add New Doctor</h2>
          <form className="doctor-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group"><label>Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="form-group">
                <label>Department</label>
                <select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} required>
                  <option value="">Select</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Specialization</label><input type="text" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required /></div>
              <div className="form-group"><label>Qualification</label><input type="text" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} /></div>
              <div className="form-group"><label>Experience (years)</label><input type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} /></div>
              <div className="form-group"><label>Fee (₹)</label><input type="number" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} /></div>
            </div>
            <button type="submit" className="primary-btn">Add Doctor</button>
          </form>
        </div>
      )}

      <div className="section">
        <h2>All Doctors</h2>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Dept</th><th>Specialization</th><th>Exp</th><th>Fee</th><th>Rating</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {doctors.map(d => (
                  <tr key={d.id}>
                    <td>Dr. {d.name}</td>
                    <td>{d.email}</td>
                    <td>{d.departmentName}</td>
                    <td>{d.specialization}</td>
                    <td>{d.experienceYears} yrs</td>
                    <td>₹{d.consultationFee}</td>
                    <td>{d.averageRating?.toFixed(1) || '—'}</td>
                    <td><button className="action-btn danger" onClick={() => handleDelete(d.id)}><FiTrash2 /></button></td>
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

export default ManageDoctors;
