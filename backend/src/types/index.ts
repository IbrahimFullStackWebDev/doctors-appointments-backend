export interface Doctor {
  id: string;
  name: string;
  email: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: string;
  image: string;
  date: number;
  slots_booked: Record<string, any>;
}
export interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}
