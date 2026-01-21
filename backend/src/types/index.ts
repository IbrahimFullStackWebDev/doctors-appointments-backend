interface Address {
  line1: string;
  line2: string;
}
export interface DoctorDataType {
  id: number;
  name: string;
  email?: string;
  password?: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  available: boolean;
  fees: number;
  address: Address;
}
export interface DecodedToken {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}
export interface BookAppointmentsType {
  id: number;
  userId?: number;
  doctorId: number;
  slotDate: string;
  slotTime: string;
  amount: number;
  status?: string;
  payment?: boolean;
}

export interface UserAppointmentInfo {
  AppointmentsInfo: BookAppointmentsType;
  doctorInfo: {
    image: string;
    name: string;
    speciality: string;
    address: Address;
  };
}

export interface AppointmentsType {
  AppointmentInfo: {
    id: number;
    payment: boolean;
    slotDate: string;
    slotTime: string;
    status: string;
    amount: number;
  };

  patientInfo: {
    name: string;
    image: string;
  };
  doctorInfo: {
    name: string;
    image: string;
  };
}
