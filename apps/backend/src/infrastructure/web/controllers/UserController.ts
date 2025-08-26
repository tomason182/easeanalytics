import { matchedData } from "express-validator";
import { verifyCaptcha } from "../middleware/verifyCaptcha";
import { Request, Response, NextFunction } from "express";
import { IUserService } from "../../../application/interfaces/IUserService";
import { UserDTO } from "../../../dto/UserDTO";

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
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
      next(err);
    }
  }
}
