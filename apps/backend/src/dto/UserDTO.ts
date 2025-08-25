export interface CreateUserDTO {
  email: string;
  firstname: string;
  password: string;
}

export interface UserDTO {
  id: number;
  email: string;
  firstname: string;
  password: string;
  isValidEmail: boolean;
  lastResendEmail: number;
  createdAt: Date;
  updatedAt: Date;
}
