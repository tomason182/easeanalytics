import express, { Request, Response, NextFunction } from "express";
import {
  changePassSchema,
  resetPasswordSchema,
  userLoginSchema,
  userSchema,
} from "../schemas/userSchema";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import rateLimit from "express-rate-limit";
import { body, param, checkSchema } from "express-validator";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message:
    "Too many registration attempts from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Register a new user.
router.post(
  "/register/",
  registerLimiter,
  checkSchema(userSchema),
  body("acceptTerms")
    .notEmpty()
    .isBoolean()
    .withMessage("Accept terms must be boolean."),
  body("captchaToken")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("captcha token must be provided"),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const userController = res.locals.container.getUserController();
    return userController.register(req, res, next);
  }
);

// Validate user emails
router.get(
  "/confirm-email/:token",
  param("token").isJWT().withMessage("Invalid JWT token"),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const userController = res.locals.getUserController();
    return userController.validateEmail(req, res, next);
  }
);

// Resend email
router.get(
  "/resend-validation-email/:email",
  param("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Not a valid email address"),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const userController = res.locals.container.getUserController();
    return userController.resendEmail(req, res, next);
  }
);

// Authenticate a user. Login
router.post(
  "/auth/",
  loginLimiter,
  checkSchema(userLoginSchema),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const userController = res.locals.container.getUserController();
    return userController.authUser(req, res, next);
  }
);

// Log out user
router.get("/logout/", (req: Request, res: Response, next: NextFunction) => {
  const userController = res.locals.container.getUserController();
  return userController.logOut(req, res, next);
});

// Change password
router.put(
  "/profile/change-password",
  checkSchema(changePassSchema),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const userController = res.locals.container.getUserController();
    return userController.changePassword(req, res, next);
  }
);

// Reset password (2 steps)
router.post(
  "/reset-password/request-new-password/",
  param("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Not a valid email address"),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const userController = res.locals.container.getUserController();
    return userController.resetPassword(req, res, next);
  }
);

router.post(
  "/reset-password/finish-change-pass/:token",
  checkSchema(resetPasswordSchema),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const userController = res.locals.container.getUserController();
    return userController.resetPasswordLastStep(req, res, next);
  }
);
