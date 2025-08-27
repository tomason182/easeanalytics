import { User } from "../domain/entities/User";
import { EmailServiceSMTP } from "../infrastructure/email/EmailServiceSMTP";
import {
  jwtTokenGenerator,
  jwtTokenValidation,
} from "../utils/jwtTokenGenerator";
import { JwtPayload } from "jsonwebtoken";
import { IUserService } from "./interfaces/IUserService";
import { IUserRepository } from "../domain/ports/IUserRepository";
import { UserDTO } from "../dto/UserDTO";
import { ChangePassDTO } from "../dto/ChangePassDTO";

export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private emailService: EmailServiceSMTP;

  constructor(userRepository: IUserRepository, emailService: EmailServiceSMTP) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async register(userDTO: UserDTO): Promise<{ status: string; msg: string }> {
    // 1. Check if user exists.
    const userExist = await this.userRepository.findByEmail(userDTO.email);

    if (userExist !== null) {
      return {
        status: "error",
        msg: "USER_EXIST",
      };
    }

    // 2. Create user entity
    const user = await User.fromDTO(userDTO, { hashPassword: true });

    // 3. Save the user in the database.
    await this.userRepository.save(user);

    // 4. Send confirmation email.
    await this.sendConfirmationEmail(user);

    return {
      status: "ok",
      msg: "USER_REGISTRATION_SUCCESS",
    };
  }

  async validateEmail(token: string): Promise<{ status: string; msg: string }> {
    // 1. validate token
    const decoded = jwtTokenValidation(token) as
      | (JwtPayload & { sub: { id: string; email: string } })
      | false;

    if (decoded == false || !decoded.sub) {
      return {
        status: "error",
        msg: "INVALID_OR_EXPIRED_TOKEN",
      };
    }

    // 2. get userId from token sub =  { id:id, email:email}
    const id = parseInt(decoded.sub.id);

    // 3. Search the user by id.
    const user = await this.userRepository.findById(id);

    if (!user) return { status: "error", msg: "USER_NOT_FOUND" };

    // 4. Check if account was already validated.
    const isValidAccount = user.checkValidAccount();
    if (isValidAccount == true)
      return { status: "error", msg: "ACCOUNT_ALREADY_VALIDATED" };

    // 5. Update isValidEmail.
    await this.userRepository.validateEmail(user.getId());

    // 6. Auto send email to notice the user registration
    const to = process.env.SUPPORT_EMAIL || "support@conectahostel.com";
    const subject = "New user registration";
    const templateName = "new_register";
    const data = {
      logoUrl: process.env.LOGO_URL || "",
      name: user.getName(),
      email: user.getEmail(),
    };

    await this.emailService.sendEmail(to, subject, templateName, data);

    return {
      status: "ok",
      msg: "ACCOUNT_VALIDATED",
    };
  }

  async resendEmail(email: string): Promise<{ status: string; msg: string }> {
    // 1. Search user by email
    const user = await this.userRepository.findByEmail(email);

    if (user == null) {
      return {
        status: "error",
        msg: "USER_NOT_FOUND",
      };
    }

    // 2. Check the email is not validated.
    const isValidAccount = user.checkValidAccount();
    if (isValidAccount == true)
      return { status: "error", msg: "ACCOUNT_ALREADY_VALIDATED" };

    // 3. Check waiting period.
    const canResendEmail = user.canResendEmail();

    if (canResendEmail == false)
      return { status: "error", msg: "WAITING_PERIOD" };

    // 4. Update last resend email.
    user.setLastResendEmail();
    await this.userRepository.updateLastResendEmail(user);

    // 5. Send confirmation email.
    await this.sendConfirmationEmail(user);

    return { status: "ok", msg: "EMAIL_RESEND" };
  }

  async authUser(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // 1. Search for the user.
    const user = await this.userRepository.findByEmail(email);

    if (user === null) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // 2. Check valid account
    const isValidAccount = user.checkValidAccount();
    if (isValidAccount == false) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // 3. Check password.
    const isValidPassword = await user.comparePasswords(password);
    if (isValidPassword == false) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // 4. Generate token
    const userData = {
      name: user.getName(),
    };
    const token = jwtTokenGenerator(userData, "8h");

    return { user, token };
  }

  async updateProfile(
    userDTO: UserDTO
  ): Promise<{ status: string; msg: string }> {
    if (!userDTO.id || !userDTO.name) {
      throw new Error("User id and user name must be provided");
    }

    // 1. Find user by id
    const user = await this.userRepository.findById(userDTO.id);

    if (user == null) throw new Error("USER_NOT_FOUND");

    user.setName(userDTO.name);

    await this.userRepository.updateProfile(user);

    return {
      status: "ok",
      msg: "USER_UPDATED",
    };
  }

  async changePassword(
    changePassDTO: ChangePassDTO
  ): Promise<{ status: string; msg: string }> {
    const user = await this.userRepository.findById(changePassDTO.id);

    if (!user) return { status: "error", msg: "USER_NOT_FOUND" };

    const passwordMatch = user.checkPassword(
      changePassDTO.newPassword,
      changePassDTO.repeatNewPassword
    );

    if (passwordMatch == false)
      return { status: "error", msg: "PASSWORD_NOT_MATCH" };

    const isOldPasswordValid = await user.comparePasswords(
      changePassDTO.currentPassword
    );

    if (isOldPasswordValid == false)
      return { status: "error", msg: "INVALID_PASSWORD" };

    const passwordHash = await User.passwordHash(changePassDTO.newPassword);

    user.setPasswordHash(passwordHash);

    await this.userRepository.updatePasswordHash(user);

    return { status: "ok", msg: "USER_UPDATED" };
  }

  async requestNewPassword(
    email: string
  ): Promise<{ status: string; msg: string }> {
    // 1. Search user by email
    const user = await this.userRepository.findByEmail(email);

    if (!user) return { status: "error", msg: "USER_NOT_FOUND" };

    // 2. Check if valid account
    const isValidAccount = user.checkValidAccount();

    if (isValidAccount == false)
      return { status: "error", msg: "ACCOUNT_NOT_VALIDATED" };

    // 3. Check waiting period
    user.setLastResendEmail();

    const canResendEmail = user.canResendEmail();

    if (canResendEmail == false)
      return { status: "error", msg: "WAITING_PERIOD" };

    // 4. Update last resend email time.
    user.setLastResendEmail();
    await this.userRepository.updateLastResendEmail(user);

    // 6. Send email
    await this.sendResetPasswordEmail(user);

    return { status: "ok", msg: "REQUEST_PASS_SUCCESS" };
  }

  async resetPassword(
    token: string,
    newPassword: string,
    repeatNewPassword: string
  ): Promise<{ status: string; msg: string }> {
    // 1. Validate token
    const decoded = jwtTokenValidation(token) as
      | (JwtPayload & { sub: { id: string; email: string } })
      | false;

    if (decoded == false || !decoded.sub) {
      return {
        status: "error",
        msg: "INVALID_OR_EXPIRED_TOKEN",
      };
    }

    // 2. Get user by id;
    const userId = parseInt(decoded.sub.id);
    const user = await this.userRepository.findById(userId);

    if (!user) return { status: "error", msg: "USER_NOT_FOUND" };

    // 3. Verify password match
    const passwordMatch = user.checkPassword(newPassword, repeatNewPassword);

    if (passwordMatch == false)
      return { status: "error", msg: "PASSWORD_NOT_MATCH" };

    // 3. Update password
    const passwordHash = await User.passwordHash(newPassword);
    user.setPasswordHash(passwordHash);

    await this.userRepository.updatePasswordHash(user);

    return { status: "ok", msg: "PASSWORD_UPDATED" };
  }

  private async sendConfirmationEmail(user: User): Promise<void> {
    const tokenData = {
      id: user.getId(),
      email: user.getEmail(),
    };

    const token = jwtTokenGenerator(tokenData, 900); // token expires in 15 minutes.

    const confirmationLink =
      process.env.API_URL + "/accounts/email-validation/" + token;
    const to = user.getEmail();
    const subject = "Confirm your email address";
    const templateName = "email_confirmation";
    const data = {
      logoUrl: process.env.LOGO_URL,
      appName: process.env.APP_NAME,
      websiteUrl: process.env.WEBSITE_URL,
      name: user.getName(),
      confirmationLink: confirmationLink,
      year: new Date().getFullYear.toString(),
      companyName: process.env.COMPANY_NAME,
      supportEmail: process.env.SUPPORT_EMAIL,
    };

    await this.emailService.sendEmail(to, subject, templateName, data);
  }

  private async sendResetPasswordEmail(user: User): Promise<void> {
    const tokenData = {
      id: user.getId(),
      email: user.getEmail(),
    };
    const expiredTime = 900;
    const token = jwtTokenGenerator(tokenData, expiredTime);

    const resetLink =
      process.env.API_URL + "/accounts/new-password-request/" + token;
    const to = user.getEmail();
    const subject = "Password reset request";
    const templateName = "password_reset";
    const data = {
      logoUrl: process.env.LOGO_URL || "",
      appName: process.env.APP_NAME,
      websiteUrl: process.env.WEBSITE_URL,
      name: user.getName(),
      resetLink: resetLink,
      expiryTime: `${expiredTime / 60} minutes`,
      year: new Date().getFullYear().toString(),
      companyName: process.env.COMPANY_NAME,
      supportEmail: process.env.SUPPORT_EMAIL,
    };

    await this.emailService.sendEmail(to, subject, templateName, data);
  }
}
