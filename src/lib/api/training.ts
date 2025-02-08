import axios from 'axios';
import { TrainingSession, Attendance, TrainingSessionFormData } from '@/types/training';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const trainingApi = {
  // Training Sessions
  async getAllSessions(): Promise<TrainingSession[]> {
    const { data } = await api.get('/training-sessions');
    return data;
  },

  async getSession(id: string): Promise<TrainingSession> {
    const { data } = await api.get(`/training-sessions/${id}`);
    return data;
  },

  async createSession(session: TrainingSessionFormData): Promise<TrainingSession> {
    const { data } = await api.post('/training-sessions', session);
    return data;
  },

  async updateSession(id: string, session: TrainingSessionFormData): Promise<TrainingSession> {
    const { data } = await api.put(`/training-sessions/${id}`, session);
    return data;
  },

  async deleteSession(id: string): Promise<void> {
    await api.delete(`/training-sessions/${id}`);
  },

  // Attendance
  async submitAttendance(sessionId: string, attendance: Omit<Attendance, 'id' | 'trainingSession' | 'createdAt' | 'updatedAt'>): Promise<Attendance> {
    const { data } = await api.post(`/attendance`, {
      ...attendance,
      trainingSession: sessionId,
    });
    return data;
  },

  async getSessionAttendance(sessionId: string): Promise<Attendance[]> {
    const { data } = await api.get(`/attendance/${sessionId}`);
    return data;
  },

  async exportAttendance(sessionId: string): Promise<Blob> {
    const { data } = await api.get(`/attendance/${sessionId}/export`, {
      responseType: 'blob',
    });
    return data;
  },
}; 