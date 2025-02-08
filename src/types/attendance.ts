export interface AttendanceSubmission {
  id: string;
  fullName: string;
  role: string;
  phone: string;
  email: string;
  submissionDateTime: string;
  trainingSessionId: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  date: string;
  regional: string;
  serviceType: string;
  medicalEquipment: string;
  brand: string;
  model: string;
  series: string;
  qrCodeUrl: string;
  attendanceCount: number;
  submissions: AttendanceSubmission[];
  status: 'scheduled' | 'completed' | 'cancelled';
} 