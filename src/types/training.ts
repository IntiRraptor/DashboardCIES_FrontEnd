export interface TrainingSessionShow {
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

export interface MedicalEquipment {
  code: string;
  brand: string;
  model: string;
  series: string;
}

export interface TrainingSession {
  id?: string;
  title: string;
  date: string;
  regional: string;
  serviceType: string;
  medicalEquipment: MedicalEquipment;
  status: "scheduled" | "completed";
  attendeeCount?: number;
}

export interface TSS {
  _id?: string;
  title: string;
  date: string;
  regional: string;
  serviceType: string;
  medicalEquipment: MedicalEquipment;
  status: "scheduled" | "completed";
  attendeeCount?: number;
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
  trainingSessionId: string;
  submissionDateTime?: string;
}

export interface TrainingSessionFormData {
  title: string;
  date: string;
  regional: string;
  serviceType: string;
  medicalEquipment: string;
  brand: string;
  model: string;
  series: string;
}
