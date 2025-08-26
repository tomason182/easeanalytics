import bcrypt from "bcrypt";
import { CreateUserDTO, UserDTO } from "../../dto/UserDTO";

export class User {
  public id: number | null;
  public email: string;
  public name: string;
  public createdAt: Date | null;
  public updatedAt: Date | null;
  private passwordHash: string;
  private isValidEmail: boolean;
  private lastResendEmail: number;
  private waitingPeriod: number = 5 * 60 * 1000;

  constructor(
    id: number | null,
    email: string,
    name: string,
    passwordHash: string,
    isValidEmail: boolean,
    lastResendEmail: number,
    createdAt: Date | null,
    updatedAt: Date | null
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.passwordHash = passwordHash;
    this.isValidEmail = isValidEmail;
    this.lastResendEmail = lastResendEmail;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Métodos de clase
  static async passwordHash(
    password: string,
    saltRounds = 10
  ): Promise<string> {
    try {
      return await bcrypt.hash(password, saltRounds);
    } catch (err) {
      throw new Error("Error hashing password");
    }
  }

  static async fromDTO(
    data: UserDTO,
    options = { hashPassword: false }
  ): Promise<User> {
    const passwordHash = options.hashPassword
      ? await User.passwordHash(data.password)
      : data.password;

    return new User(
      data.id || null,
      data.email,
      data.name,
      passwordHash,
      data.isValidEmail,
      data.lastResendEmail,
      data.createdAt,
      data.updatedAt
    );
  }

  // Métodos de instancia
  async comparePasswords(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.passwordHash);
    } catch (err) {
      return false;
    }
  }

  checkPassword(newPass: string, repeatPass: string): boolean {
    if (newPass !== repeatPass) {
      return false;
    }

    return true;
  }

  canResendEmail(): boolean {
    const now = Date.now();
    return now - this.lastResendEmail > this.waitingPeriod;
  }

  checkValidAccount(): boolean {
    return this.isValidEmail == true;
  }

  // Getters and Setters
  getId(): number {
    const id = this.id;
    if (!id) {
      throw new Error("User id is not set");
    }
    return id;
  }
  getLastResendEmail(): number {
    return this.lastResendEmail;
  }
  setLastResendEmail(): void {
    this.lastResendEmail = Date.now();
  }

  setIsValidEmail(): void {
    this.isValidEmail = true;
  }
  getIsValidEmail(): boolean {
    return this.isValidEmail;
  }
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }
}
