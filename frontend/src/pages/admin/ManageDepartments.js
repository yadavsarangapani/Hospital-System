import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiLayers } from 'react-icons/fi';
import '../Dashboard.css';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateDepartment(editing, form);
        toast.success('Department updated');
      } else {
        await createDepartment(form);
        toast.success('Department created');
      }
      setForm({ name: '', description: '' });
      setEditing(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleEdit = (dept) => {
    setForm({ name: dept.name, description: dept.description || '' });
    setEditing(dept.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await deleteDepartment(id);
      toast.success('Department deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div><h1><FiLayers /> Manage Departments</h1><p>Add, edit, and remove departments</p></div>
      </div>

      <div className="section">
        <h2>{editing ? 'Edit Department' : 'Add Department'}</h2>
        <form className="slot-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Department name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" placeholder="Description" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" className="primary-btn">
              {editing ? 'Update' : <><FiPlus /> Add</>}
            </button>
            {editing && <button type="button" className="secondary-btn" onClick={() => { setEditing(null); setForm({ name: '', description: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="section">
        <h2>All Departments</h2>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {departments.map(d => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.description || '—'}</td>
                    <td className="action-btns">
                      <button className="action-btn primary" onClick={() => handleEdit(d)}><FiEdit /></button>
                      <button className="action-btn danger" onClick={() => handleDelete(d.id)}><FiTrash2 /></button>
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

export default ManageDepartments;
