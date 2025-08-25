export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
}

export interface UserDTO {
  id: number;
  email: string;
  name: string;
  password: string;
  isValidEmail: boolean;
  lastResendEmail: number;
  createdAt: Date;
  updatedAt: Date;
}
