import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Add JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Departments
export const getDepartments = () => API.get('/departments');
export const createDepartment = (data) => API.post('/departments', data);
export const updateDepartment = (id, data) => API.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => API.delete(`/departments/${id}`);

// Doctors
export const getDoctors = () => API.get('/doctors');
export const getDoctorById = (id) => API.get(`/doctors/${id}`);
export const searchDoctors = (keyword) => API.get(`/doctors/search?keyword=${keyword}`);
export const getDoctorsByDepartment = (deptId) => API.get(`/doctors/department/${deptId}`);
export const createDoctor = (data) => API.post('/doctors', data);
export const updateDoctor = (id, data) => API.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);

// Availability
export const getDoctorAvailability = (doctorId) => API.get(`/availability/doctor/${doctorId}`);
export const getAvailableSlots = (doctorId, date) => API.get(`/availability/doctor/${doctorId}/slots?date=${date}`);
export const createAvailability = (doctorId, data) => API.post(`/availability/doctor/${doctorId}`, data);
export const updateAvailability = (slotId, data) => API.put(`/availability/${slotId}`, data);
export const deleteAvailability = (slotId) => API.delete(`/availability/${slotId}`);

// Appointments
export const bookAppointment = (data) => API.post('/appointments', data);
export const getPatientAppointments = () => API.get('/appointments/patient');
export const getDoctorAppointments = (doctorId) => API.get(`/appointments/doctor/${doctorId}`);
export const getDoctorPendingAppointments = (doctorId) => API.get(`/appointments/doctor/${doctorId}/pending`);
export const getDoctorSchedule = (doctorId, date) => API.get(`/appointments/doctor/${doctorId}/schedule?date=${date}`);
export const confirmAppointment = (id) => API.put(`/appointments/${id}/confirm`);
export const rejectAppointment = (id) => API.put(`/appointments/${id}/reject`);
export const completeAppointment = (id) => API.put(`/appointments/${id}/complete`);
export const cancelAppointment = (id) => API.put(`/appointments/${id}/cancel`);
export const getAllAppointments = () => API.get('/appointments/all');

// Reviews
export const createReview = (data) => API.post('/reviews', data);
export const getDoctorReviews = (doctorId) => API.get(`/reviews/doctor/${doctorId}`);

// Reports
export const getSystemOverview = () => API.get('/reports/overview');
export const getAppointmentsPerDoctor = () => API.get('/reports/appointments-per-doctor');
export const getRevenuePerDepartment = () => API.get('/reports/revenue-per-department');
export const getDailyStats = (start, end) => API.get(`/reports/daily?startDate=${start}&endDate=${end}`);
export const getMonthlyStats = () => API.get('/reports/monthly');

export default API;
