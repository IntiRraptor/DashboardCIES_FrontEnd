import axios from 'axios';
import { TrainingSession, TrainingSessionFormData, Attendee } from '../../types/training';

// const BASE_URL = 'http://localhost:4000/api';
const BASE_URL = "https://dashboardciesbackend-production-fee2.up.railway.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Training Sessions API
export const getAllSessions = async (): Promise<TrainingSession[]> => {
  const { data } = await api.get('/training-sessions');
  console.log(data)
  return data.data;
};

export const getSession = async (id: string): Promise<TrainingSession> => {
  const { data } = await api.get(`/training-sessions/${id}`);
  return data.data;
};

export const createSession = async (formData: TrainingSessionFormData): Promise<TrainingSession> => {
  const trainingData = {
    title: formData.title,
    date: formData.date,
    regional: formData.regional,
    serviceType: formData.serviceType,
    medicalEquipment: {
      code: formData.medicalEquipment,
      brand: formData.brand,
      model: formData.model,
      series: formData.series,
    },
    status: "scheduled" as const
  };

  const { data } = await api.post('/training-sessions', trainingData);
  return data;
};

export const updateSession = async (id: string, session: TrainingSessionFormData): Promise<TrainingSession> => {
  const { data } = await api.put(`/training-sessions/${id}`, session);
  return data;
};

export const deleteSession = async (id: string): Promise<void> => {
  await api.delete(`/training-sessions/${id}`);
};

// Attendance API
interface AttendanceRequest {
  trainingSessionId: string;
  fullName: string;
  role: string;
  phone: string;
  email: string;
}

export const submitAttendance = async (attendance: AttendanceRequest): Promise<Attendee> => {
  console.log('submitAtt: ', attendance)
  const { data } = await api.post('/training-sessions/attendance', attendance);
  return data;
};

export const getSessionAttendance = async (sessionId: string): Promise<Attendee[]> => {
  const { data } = await api.get(`/training-sessions/${sessionId}/attendees`);
  return data.data;
};

export const exportAttendance = async (sessionId: string): Promise<Blob> => {
  const { data } = await api.get(`/training-sessions/attendance/${sessionId}/export`, {
    responseType: 'blob',
  });
  return data;
}; 