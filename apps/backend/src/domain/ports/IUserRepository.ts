import { User } from "../entities/User";

export interface IUserRepository {
  save(user: User): Promise<void>;

  findByEmail(email: string): Promise<User>;

  findById(id: number): Promise<User>;

  validateEmail(id: number): Promise<void>;

  updateLastResendEmail(user: User): Promise<void>;
}
