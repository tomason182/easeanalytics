import { matchedData } from "express-validator";
import { verifyCaptcha } from "../middleware/verifyCaptcha";
import { Request, Response, NextFunction, CookieOptions } from "express";
import { IUserService } from "../../../application/interfaces/IUserService";
import { UserDTO } from "../../../dto/UserDTO";

const COOKIES_EXPIRATION_TIME_MS = 3600 * 8 * 1000;
const SHARED_COOKIES_OPTIONS = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  signed: true,
  sameSite: (process.env.NODE_ENV === "production"
    ? "strict"
    : "lax") as CookieOptions["sameSite"],
  domain:
    process.env.NODE_ENV === "production" ? ".easeanalytics.com" : undefined,
  maxAge: COOKIES_EXPIRATION_TIME_MS,
};

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, name, password, acceptTerms, captchaToken } =
        matchedData(req);

      if (!acceptTerms) {
        return res.status(400).json({ msg: "ACCEPT_TERMS" });
      }

      const isValidCaptcha = await verifyCaptcha(captchaToken);

      if (!isValidCaptcha) {
        return res.status(400).json({ msg: "INVALID_CAPTCHA" });
      }

      const userDTO: UserDTO = {
        id: null,
        email,
        name,
        password,
        isValidEmail: false,
        lastResendEmail: Date.now(),
        createdAt: null,
        updatedAt: null,
      };

      const result = await this.userService.register(userDTO);

      if (result.status === "error") {
        return res.status(400).json({
          status: "error",
          msg: result.msg || "UNKNOWN_ERROR",
        });
      }

      return res.status(200).json(result);
    } catch (err) {
      let errorMessage = "UNKNOWN_ERROR";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      return res.status(400).json({ msg: errorMessage });
    }
  }

  async validateEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = matchedData(req);

      const result = await this.userService.validateEmail(token);

      return res.status(200).json({ msg: result.msg });
    } catch (err) {
      let errorMessage = "UNKNOWN_ERROR";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      return res.status(400).json({ msg: errorMessage });
    }
  }

  async resendEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = matchedData(req);

      const result = await this.userService.resendEmail(email);

      return res.status(200).json({ msg: result.msg });
    } catch (err) {
      let errorMessage = "UNKNOWN_ERROR";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      return res.status(400).json({ msg: errorMessage });
    }
  }

  async authUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = matchedData(req);

      const result = await this.userService.authUser(email, password);

      const timeNow = Date.now().toString();

      return res
        .cookie("jwt", result.token, {
          ...SHARED_COOKIES_OPTIONS,
          httpOnly: true,
        })
        .cookie("isAuth", timeNow, {
          ...SHARED_COOKIES_OPTIONS,
          httpOnly: false,
        })
        .status(200)
        .json({
          email: result.user.getEmail(),
          name: result.user.getName(),
        });
    } catch (err) {
      let errorMessage = "UNKNOWN_ERROR";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      return res.status(400).json({ msg: errorMessage });
    }
  }

  logOut(req: Request, res: Response) {
    return res
      .cookie("jwt", "", {
        ...SHARED_COOKIES_OPTIONS,
        httpOnly: true,
        maxAge: 0,
      })
      .cookie("isAuth", "", {
        ...SHARED_COOKIES_OPTIONS,
        httpOnly: false,
        maxAge: 0,
      });
  }

  async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const { name } = matchedData(req);

      const payload = req.auth;
      let userId = null;
      if (payload && typeof payload !== "string") {
        userId = parseInt(payload.id);
      }

      if (!userId) throw new Error("USER_ID_NOT_DEFINED");

      const result = await this.userService.updateProfile(userId, name);

      return res.status(200).json({ msg: result.msg });
    } catch (err) {
      let errorMessage = "UNKNOWN_ERROR";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      return res.status(400).json({ msg: errorMessage });
    }
  }
}
