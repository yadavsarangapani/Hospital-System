import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById, getDoctorReviews, getAvailableSlots, bookAppointment, createReview } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiStar, FiMapPin, FiClock, FiCalendar, FiDollarSign } from 'react-icons/fi';
import '../Dashboard.css';

const DoctorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [tab, setTab] = useState('booking');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [docRes, revRes] = await Promise.all([
          getDoctorById(id),
          getDoctorReviews(id)
        ]);
        setDoctor(docRes.data);
        setReviews(revRes.data);
      } catch { }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    try {
      const res = await getAvailableSlots(id, date);
      setSlots(res.data);
    } catch { }
  };

  const handleBook = async () => {
    if (!selectedSlot) return toast.error('Select a time slot');
    if (!user) return navigate('/login');
    setBooking(true);
    try {
      await bookAppointment({
        doctorId: parseInt(id),
        appointmentDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes
      });
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({ doctorId: parseInt(id), ...reviewForm });
      toast.success('Review submitted!');
      const revRes = await getDoctorReviews(id);
      setReviews(revRes.data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="dashboard"><div className="loading">Loading...</div></div>;
  if (!doctor) return <div className="dashboard"><div className="empty-state">Doctor not found</div></div>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="dashboard">
      <div className="profile-header">
        <div className="profile-avatar">{doctor.name?.charAt(0)}</div>
        <div className="profile-info">
          <h1>Dr. {doctor.name}</h1>
          <p className="specialization">{doctor.specialization}</p>
          <div className="profile-meta">
            <span><FiMapPin /> {doctor.departmentName}</span>
            <span><FiStar /> {doctor.averageRating?.toFixed(1) || 'N/A'}</span>
            <span><FiClock /> {doctor.experienceYears} years</span>
            <span><FiDollarSign /> ₹{doctor.consultationFee}</span>
          </div>
          {doctor.qualification && <p className="qualification">{doctor.qualification}</p>}
        </div>
      </div>

      <div className="tab-bar">
        <button className={tab === 'booking' ? 'active' : ''} onClick={() => setTab('booking')}>
          <FiCalendar /> Book Appointment
        </button>
        <button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>
          <FiStar /> Reviews ({reviews.length})
        </button>
      </div>

      {tab === 'booking' && user?.role === 'PATIENT' && (
        <div className="booking-section">
          <h2>Select Date & Time</h2>
          <div className="form-group">
            <label>Choose Date</label>
            <input type="date" min={today} value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} />
          </div>

          {selectedDate && (
            <div className="slots-grid">
              {slots.length === 0 ? (
                <p className="empty-state">No slots available for this date</p>
              ) : (
                slots.map((slot, idx) => (
                  <button
                    key={idx}
                    className={`slot-btn ${!slot.available ? 'unavailable' : ''} ${selectedSlot === slot ? 'selected' : ''}`}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.startTime} - {slot.endTime}
                    {!slot.available && <span className="booked-text">Booked</span>}
                  </button>
                ))
              )}
            </div>
          )}

          {selectedSlot && (
            <div className="booking-confirm">
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  placeholder="Add any notes for the doctor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <button className="primary-btn" onClick={handleBook} disabled={booking}>
                {booking ? 'Booking...' : `Book for ${selectedDate} at ${selectedSlot.startTime}`}
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="reviews-section">
          {user?.role === 'PATIENT' && (
            <form className="review-form" onSubmit={handleReview}>
              <h3>Write a Review</h3>
              <div className="rating-select">
                {[1, 2, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`star-btn ${reviewForm.rating >= r ? 'active' : ''}`}
                    onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                  >★</button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={3}
              />
              <button type="submit" className="primary-btn small">Submit Review</button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="empty-state">No reviews yet</p>
            ) : (
              reviews.map(r => (
                <div key={r.id} className="review-card">
                  <div className="review-header">
                    <strong>{r.patientName}</strong>
                    <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p>{r.comment}</p>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
