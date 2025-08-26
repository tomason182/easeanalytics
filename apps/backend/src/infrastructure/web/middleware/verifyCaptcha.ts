import { verify } from "hcaptcha";

export async function verifyCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.CAPTCHA_PRIVATE_KEY;

  if (!secretKey) {
    throw new Error(
      "Captcha private key is not defined in environment variables"
    );
  }

  try {
    const data = await verify(secretKey, token);
    if (data.success) {
      return true;
    } else {
      console.error("hcaptcha verification failed");
      return false;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("Hcaptcha verification error: ", err.message);
    }
    return false;
  }
}
