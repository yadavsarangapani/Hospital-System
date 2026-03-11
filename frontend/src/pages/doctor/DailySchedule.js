import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDoctorSchedule } from '../../services/api';
import { FiCalendar } from 'react-icons/fi';
import '../Dashboard.css';

const DailySchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const doctorId = user?.doctorId;

  const fetchSchedule = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await getDoctorSchedule(doctorId, date);
      setSchedule(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchSchedule(); }, [date, doctorId]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1><FiCalendar /> Daily Schedule</h1>
          <p>View your appointments for a specific day</p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-picker"
        />
      </div>

      {loading ? <div className="loading">Loading...</div> : schedule.length === 0 ? (
        <div className="empty-state"><p>No appointments on {date}</p></div>
      ) : (
        <div className="schedule-list">
          {schedule.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(a => (
            <div key={a.id} className="schedule-card">
              <div className="schedule-time">
                <span className="time">{a.startTime}</span>
                <span className="dash">—</span>
                <span className="time">{a.endTime}</span>
              </div>
              <div className="schedule-info">
                <h3>{a.patientName}</h3>
                <p>{a.notes || 'No notes'}</p>
                <span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailySchedule;
