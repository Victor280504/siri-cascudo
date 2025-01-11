export interface User {
  name: string;
  email: string;
  password: string;
  address: string;
  login: string;
  roles: string[];
}

export interface Login {
  email: string;
  password: string;
}
