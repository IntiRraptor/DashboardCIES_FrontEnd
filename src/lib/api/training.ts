import axios from 'axios';
import { TrainingSession, TrainingSessionFormData, Attendee } from '../../types/training';

// const BASE_URL = 'http://localhost:4000/api/training-sessions';
const BASE_URL = "https://dashboardciesbackend-production-fee2.up.railway.app/api/training-sessions";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Training Sessions API
export const getAllSessions = async (): Promise<TrainingSession[]> => {
  const { data } = await api.get('/');
  console.log('getAllSessions: ', data);
  return data.data;
};

export const getSession = async (id: string): Promise<TrainingSession> => {
  const { data } = await api.get(`/${id}`);
  console.log('getSession: ', data);
  return data.data;
};

export const createSession = async (session: TrainingSessionFormData): Promise<TrainingSession> => {
  const { data } = await api.post('/', session);
  console.log('createSession: ', data);
  return data;
};

export const updateSession = async (id: string, session: TrainingSessionFormData): Promise<TrainingSession> => {
  const { data } = await api.put(`/${id}`, session);
  console.log('updateSession: ', data);
  return data;
};

export const deleteSession = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
  console.log('deleteSession: ', id);
};

// Attendance API
interface AttendanceRequest {
  trainingSessionId: string;  // ID de la sesión de capacitación
  fullName: string;          // Nombre completo del asistente
  role: string;             // Rol del asistente
  phone: string;            // Teléfono
  email: string;            // Correo electrónico
}

export const submitAttendance = async (attendance: AttendanceRequest): Promise<Attendee> => {
  const { data } = await api.post('/attendance', attendance);
  console.log('submitAttendance: ', data);
  return data;
};

export const getSessionAttendance = async (sessionId: string): Promise<Attendee[]> => {
  const { data } = await api.get(`/${sessionId}/attendees`);
  return data.data;
};

export const exportAttendance = async (sessionId: string): Promise<Blob> => {
  const { data } = await api.get(`/attendance/${sessionId}/export`, {
    responseType: 'blob',
  });
  return data;
}; 