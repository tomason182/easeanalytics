import { UserDTO, CreateUserDTO } from "../../dto/UserDTO";
import { ChangePassDTO } from "../../dto/ChangePassDTO";
import { User } from "../../domain/entities/User";

export interface IUserService {
  authUser(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }>;

  register(userDTO: CreateUserDTO): Promise<{ status: string; msg: string }>;

  validateEmail(token: string): Promise<{ status: string; msg: string }>;

  resendEmail(email: string): Promise<{ status: string; msg: string }>;

  updateProfile(
    userId: number,
    name: string
  ): Promise<{ status: string; msg: string }>;

  changePassword(
    changePassDTO: ChangePassDTO
  ): Promise<{ status: string; msg: string }>;

  requestNewPassword(email: string): Promise<{ status: string; msg: string }>;

  resetPassword(
    token: string,
    newPassword: string,
    repeatNewPassword: string
  ): Promise<{ status: string; msg: string }>;
}
