import { Schema } from "express-validator";

const PASS_MIN_LENGTH = 8;
const PASS_MIN_LOWERCASE = 1;
const PASS_MIN_UPPERCASE = 1;
const PASS_MIN_NUMBERS = 1;
const PASS_MIN_SYMBOLS = 1;

export const userSchema: Schema = {
  email: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "Email must be provided",
    },
    isEmail: {
      bail: true,
      errorMessage: "Email must be a valid email address",
    },
    normalizeEmail: true,
    isLength: {
      options: {
        max: 255,
      },
      errorMessage: "Email max length is 255 characters",
    },
  },
  password: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: PASS_MIN_LENGTH,
        minLowercase: PASS_MIN_LOWERCASE,
        minUppercase: PASS_MIN_UPPERCASE,
        minNumbers: PASS_MIN_NUMBERS,
        minSymbols: PASS_MIN_SYMBOLS,
      },
    },
    custom: {
      options: (value: string) => {
        if (/\s/.test(value)) {
          throw new Error("Password must not contain white spaces");
        }
        return true;
      },
    },
    errorMessage: `Password must contain ${PASS_MIN_LENGTH} characters, ${PASS_MIN_LOWERCASE} lowercase, ${PASS_MIN_UPPERCASE} uppercase, ${PASS_MIN_NUMBERS} numbers and ${PASS_MIN_SYMBOLS} symbols.`,
  },
  name: {
    in: ["body"],
    trim: true,
    exists: {
      bail: true,
      errorMessage: "Name must be provided",
    },
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "Name is required and max length is 100 characters",
    },
  },
};

export const userLoginSchema: Schema = {
  email: {
    in: ["body"],
    trim: true,
    isEmail: {
      bail: true,
      errorMessage: "Email is not a valid email address",
    },
    normalizeEmail: true,
  },
  password: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "Password is required",
    },
  },
};

export const changePassSchema: Schema = {
  currentPassword: {
    in: ["body"],
    notEmpty: {
      bail: true,
      errorMessage: "Password is required",
    },
  },
  newPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: PASS_MIN_LENGTH,
        minLowercase: PASS_MIN_LOWERCASE,
        minUppercase: PASS_MIN_UPPERCASE,
        minNumbers: PASS_MIN_NUMBERS,
        minSymbols: PASS_MIN_SYMBOLS,
      },
    },
    custom: {
      options: (value: string) => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage: `Password must contain ${PASS_MIN_LENGTH} characters, ${PASS_MIN_LOWERCASE} lowercase, ${PASS_MIN_UPPERCASE} uppercase, ${PASS_MIN_NUMBERS} numbers and ${PASS_MIN_SYMBOLS} symbols.`,
  },
  repeatNewPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: PASS_MIN_LENGTH,
        minLowercase: PASS_MIN_LOWERCASE,
        minUppercase: PASS_MIN_UPPERCASE,
        minNumbers: PASS_MIN_NUMBERS,
        minSymbols: PASS_MIN_SYMBOLS,
      },
    },
    custom: {
      options: (value: string) => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage: `Password must contain ${PASS_MIN_LENGTH} characters, ${PASS_MIN_LOWERCASE} lowercase, ${PASS_MIN_UPPERCASE} uppercase, ${PASS_MIN_NUMBERS} numbers and ${PASS_MIN_SYMBOLS} symbols.`,
  },
};

export const resetPasswordSchema: Schema = {
  token: {
    in: ["params"],
    isJWT: true,
    errorMessage: "Invalid JWT token",
  },
  newPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: PASS_MIN_LENGTH,
        minLowercase: PASS_MIN_LOWERCASE,
        minUppercase: PASS_MIN_UPPERCASE,
        minNumbers: PASS_MIN_NUMBERS,
        minSymbols: PASS_MIN_SYMBOLS,
      },
    },
    custom: {
      options: (value: string) => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage: `Password must contain ${PASS_MIN_LENGTH} characters, ${PASS_MIN_LOWERCASE} lowercase, ${PASS_MIN_UPPERCASE} uppercase, ${PASS_MIN_NUMBERS} numbers and ${PASS_MIN_SYMBOLS} symbols.`,
  },
};
