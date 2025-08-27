import { JwtPayload, sign, verify, SignOptions } from "jsonwebtoken";

export function jwtTokenGenerator(
  data: object,
  expirationTimeSeg: number | string
): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  const payload = {
    sub: data,
  };

  const token: string = sign(payload, jwtSecret, {
    expiresIn: expirationTimeSeg as SignOptions["expiresIn"],
  });

  return token;
}

export function jwtTokenValidation(token: string): JwtPayload | string | false {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  try {
    const decoded = verify(token, jwtSecret);
    return decoded;
  } catch (err) {
    return false;
  }
}
