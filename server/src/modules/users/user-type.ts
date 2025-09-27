export interface IUser {
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  dob?: Date;
  height?: number;
  gender?: string;
  isActive?: boolean;
}
