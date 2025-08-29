import { IUserRepository } from "../../domain/ports/IUserRepository";
import { User } from "../../domain/entities/User";
import { UnitOfWork } from "../transactions/UnitOfWork";
import { UserDTO } from "../../dto/UserDTO";
import { ResultSetHeader } from "mysql2/promise";

export class UserRepositoryMySQL implements IUserRepository {
  private uow: UnitOfWork;

  constructor(uow: UnitOfWork) {
    this.uow = uow;
  }

  async save(user: User): Promise<void> {
    const conn = await this.uow.getConnection();
    const query =
      "INSERT INTO users (email, password_hash, name) VALUES (?,?,?)";
    const params = [user.getEmail(), user.getPasswordHash(), user.getName()];

    const [result] = await conn.execute<ResultSetHeader>(query, params);

    user.setId(result.insertId);
  }

  async findByEmail(email: string): Promise<User | null> {
    const conn = await this.uow.getConnection();
    const query = "SELECT * FROM users WHERE email = ? LIMIT 1";

    const [result] = await conn.execute<UserDTO[]>(query, [email]);

    if (result.length === 0) {
      return null;
    }

    const user = User.fromDTO(result[0]);

    return user;
  }

  async findById(id: number): Promise<User | null> {
    const conn = await this.uow.getConnection();
    const query = "SELECT * FROM users WHERE id = ? LIMIT 1";

    const [result] = await conn.execute<UserDTO[]>(query, [id]);

    if (result.length === 0) {
      return null;
    }

    const user = User.fromDTO(result[0]);

    return user;
  }

  async validateEmail(id: number): Promise<void> {
    const conn = await this.uow.getConnection();
    const query = "UPDATE users SET is_valid_email = true WHERE id = ?";

    await conn.execute(query, [id]);
  }

  async updateLastResendEmail(user: User): Promise<void> {
    const conn = await this.uow.getConnection();
    const query = "UPDATE users SET last_resend_email = ? WHERE id = ?";
    const params = [user.getLastResendEmail(), user.getId()];

    await conn.execute(query, params);
  }

  async updateProfile(user: User): Promise<void> {
    const conn = await this.uow.getConnection();
    const query = "UPDATE users SET name = ? WHERE id = ?";
    const params = [user.getName(), user.getId()];

    const [result] = await conn.execute(query, params);
  }

  async updatePasswordHash(user: User): Promise<void> {
    const conn = await this.uow.getConnection();
    const query = "UPDATE users SET password_hash = ? WHERE id = ?";
    const params = [user.getPasswordHash(), user.getId()];

    await conn.execute(query, params);
  }
}
