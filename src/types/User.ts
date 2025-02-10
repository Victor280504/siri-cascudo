export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  roles: string[];
}
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  roles: string[];
}
export interface UserById {
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface Login {
  email: string;
  password: string;
}