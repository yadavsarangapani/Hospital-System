import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDoctorAvailability, createAvailability, deleteAvailability } from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiClock } from 'react-icons/fi';
import '../Dashboard.css';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const ManageSlots = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isActive: true
  });
  const doctorId = user?.doctorId;

  const fetchSlots = async () => {
    if (!doctorId) return;
    try {
      const res = await getDoctorAvailability(doctorId);
      setSlots(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchSlots(); }, [doctorId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAvailability(doctorId, form);
      toast.success('Slot created!');
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create slot');
    }
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await deleteAvailability(slotId);
      toast.success('Slot deleted');
      fetchSlots();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (!doctorId) return <div className="dashboard"><div className="empty-state"><p>Doctor profile not set up</p></div></div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1><FiClock /> Manage Availability</h1>
          <p>Set your weekly availability schedule</p>
        </div>
      </div>

      <div className="section">
        <h2><FiPlus /> Add New Slot</h2>
        <form className="slot-form" onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group">
              <label>Day</label>
              <select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Slot Duration (min)</label>
              <input type="number" value={form.slotDurationMinutes} onChange={(e) => setForm({ ...form, slotDurationMinutes: parseInt(e.target.value) })} min={10} max={120} />
            </div>
            <button type="submit" className="primary-btn">Add Slot</button>
          </div>
        </form>
      </div>

      <div className="section">
        <h2>Current Slots</h2>
        {loading ? <div className="loading">Loading...</div> : slots.length === 0 ? (
          <div className="empty-state"><p>No availability slots set</p></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Day</th><th>Start</th><th>End</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {slots.map(s => (
                  <tr key={s.id}>
                    <td>{s.dayOfWeek}</td>
                    <td>{s.startTime}</td>
                    <td>{s.endTime}</td>
                    <td>{s.slotDurationMinutes} min</td>
                    <td><span className={`badge ${s.isActive ? 'confirmed' : 'cancelled'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td><button className="action-btn danger" onClick={() => handleDelete(s.id)}><FiTrash2 /> Delete</button></td>
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

export default ManageSlots;
