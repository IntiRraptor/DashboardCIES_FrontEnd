export interface TrainingSession {
  id: string;
  title: string;
  date: Date;
  regional: string;
  serviceType: string;
  medicalEquipment: string;
  brand: string;
  model: string;
  series: string;
  qrCodeUrl?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  trainingSession: string | TrainingSession;
  fullName: string;
  role: string;
  phone: string;
  email: string;
  submissionDateTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingSessionFormData extends Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt' | 'qrCodeUrl'> {
  id?: string;
}

export interface AttendanceFormData extends Omit<Attendance, 'id' | 'createdAt' | 'updatedAt' | 'submissionDateTime' | 'trainingSession'> {} 