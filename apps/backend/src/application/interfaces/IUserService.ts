import { UserDTO } from "../../dto/UserDTO";
import { User } from "../../domain/entities/User";

export interface IUserService {
  authUser(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }>;

  register(userDTO: UserDTO): Promise<{ status: string; msg: string }>;

  validateEmail(token: string): Promise<{ status: string; msg: string }>;

  resendEmail(email: string): Promise<{ status: string; msg: string }>;
}
