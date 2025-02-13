export interface TrainingSession {
  _id: string;
  id: string;
  title: string;
  date: string;
  regional: string;
  serviceType: string;
  medicalEquipment: {
    code: string;
    brand: string;
    model: string;
    series: string;
  };
  status: "scheduled" | "completed";
  attendeeCount?: number;
  trainingSessionId: string;
}

export interface Session {
  _id: string;
  status: "scheduled" | "completed";
  qrCodeUrl: string;
  medicalEquipment: {
    code: string;
    brand: string;
    model: string;
    series: string;
  };
  title: string;
  date: string;
  regional: string;
  serviceType: string;
}

export interface Attendee {
  id?: string;
  fullName: string;
  role: string;
  phone: string;
  email: string;
  submissionDateTime?: string;
  trainingSessionId: string;
}

export interface TrainingSessionFormData
  extends Omit<
    TrainingSession,
    "id" | "createdAt" | "updatedAt" | "qrCodeUrl"
  > {
  id?: string;
}
