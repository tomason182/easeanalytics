import { User } from "../entities/User";

export interface IUserRepository {
  save(user: User): Promise<void>;

  findByEmail(email: string): Promise<User | null>;

  findById(id: number): Promise<User | null>;

  validateEmail(id: number): Promise<void>;

  updateLastResendEmail(user: User): Promise<void>;

  updateProfile(user: User): Promise<void>;

  updatePasswordHash(user: User): Promise<void>;
}
