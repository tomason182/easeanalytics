import { jwtTokenValidation } from "../../../utils/jwtTokenGenerator";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

// Extendemos Request para agregar la propiedad auth
declare module "express-serve-static-core" {
  interface Request {
    auth?: string | JwtPayload;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const token = req.signedCookies["jwt"];

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const payload = jwtTokenValidation(token);

    if (typeof payload === "object" && "sub" in payload) {
      req.auth = payload.sub;
      return next();
    } else {
      throw new Error("Invalid token payload");
    }
  } catch (err) {
    return res
      .cookie("jwt", "", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        domain:
          process.env.NODE_ENV === "production"
            ? process.env.COOKIE_DOMAIN
            : undefined,
        maxAge: 0,
      })
      .cookie("isAuth", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/",
        maxAge: 0,
        domain:
          process.env.NODE_ENV === "production"
            ? process.env.COOKIE_DOMAIN
            : undefined,
      })
      .status(401)
      .json({ msg: "Unauthorized" });
  }
}
