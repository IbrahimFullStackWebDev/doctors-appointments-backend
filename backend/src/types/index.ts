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
  userId?: number;
  doctorId: number;
  slotDate: string;
  slotTime: string;
  amount: number;
  status?: string;
  payment?: boolean;
}
