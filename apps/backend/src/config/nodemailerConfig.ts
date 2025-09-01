import "dotenv/config.js";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const config: SMTPTransport.Options = {
  host: process.env.EMAIL_HOST,
  port: process.env.NODE_ENV === "production" ? 465 : 587,
  secure: process.env.NODE_ENV === "production",
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_ACCOUNT_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
};
