import { RowDataPacket } from "mysql2/promise";

export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
}

export interface UserDTO extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  password: string;
  isValidEmail: boolean;
  lastResendEmail: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
