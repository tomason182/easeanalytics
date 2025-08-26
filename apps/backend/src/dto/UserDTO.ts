export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
}

export interface UserDTO {
  id: number | null;
  email: string;
  name: string;
  password: string;
  isValidEmail: boolean;
  lastResendEmail: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
