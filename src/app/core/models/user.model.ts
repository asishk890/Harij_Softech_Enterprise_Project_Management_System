
export type UserRole = 'Admin' | 'Project Manager' | 'Developer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;

  token?: string;
  password?: string;
}