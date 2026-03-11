import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDoctors, getDepartments, searchDoctors, getDoctorsByDepartment } from '../../services/api';
import { FiSearch, FiStar, FiMapPin } from 'react-icons/fi';
import '../Dashboard.css';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [docRes, deptRes] = await Promise.all([getDoctors(), getDepartments()]);
        setDoctors(docRes.data);
        setDepartments(deptRes.data);
      } catch { }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (keyword.trim()) {
        const res = await searchDoctors(keyword);
        setDoctors(res.data);
      } else {
        const res = await getDoctors();
        setDoctors(res.data);
      }
    } catch { }
    setLoading(false);
  };

  const handleDeptFilter = async (deptId) => {
    setSelectedDept(deptId);
    setLoading(true);
    try {
      if (deptId) {
        const res = await getDoctorsByDepartment(deptId);
        setDoctors(res.data);
      } else {
        const res = await getDoctors();
        setDoctors(res.data);
      }
    } catch { }
    setLoading(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Find a Doctor</h1>
          <p>Search by name, specialization, or department</p>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <select
          value={selectedDept}
          onChange={(e) => handleDeptFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="empty-state">
          <p>No doctors found</p>
        </div>
      ) : (
        <div className="doctor-grid">
          {doctors.map(doc => (
            <div key={doc.id} className="doctor-card">
              <div className="doctor-avatar">
                {doc.name?.charAt(0).toUpperCase()}
              </div>
              <div className="doctor-info">
                <h3>Dr. {doc.name}</h3>
                <p className="specialization">{doc.specialization}</p>
                <p className="department"><FiMapPin /> {doc.departmentName}</p>
                <div className="doctor-meta">
                  <span className="rating"><FiStar /> {doc.averageRating?.toFixed(1) || 'N/A'}</span>
                  <span className="experience">{doc.experienceYears} yrs exp.</span>
                  <span className="fee">₹{doc.consultationFee}</span>
                </div>
              </div>
              <Link to={`/doctor/${doc.id}`} className="primary-btn small">View Profile</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;
