interface Address {
  line1: string;
  line2: string;
}
export interface DoctorDataType {
  id?: string;
  name: string;
  email: string;
  password?: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: string;
  address: Address;
  image: string;
  date?: number;
}
export interface DecodedToken {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}
