import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import path from "path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import mjml2html from "mjml";
import Handlebars from "handlebars";
import { convert } from "html-to-text";

export class EmailServiceSMTP {
  private transporter: Transporter;

  constructor(config: SMTPTransport.Options) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>
  ): Promise<void> {
    try {
      // 1. Cargar la plantilla de mjml correspondinte
      const mjmlTemplatePath = path.join(
        __dirname,
        "./templates/",
        `${templateName}.mjml`
      );
      const mjmlTemplate = await fs.readFile(mjmlTemplatePath, "utf-8");

      // 2. Compilar datos con handlerbars.
      const compiledTemplate = Handlebars.compile(mjmlTemplate);
      const mjmlWithData = compiledTemplate(data);

      const { html } = mjml2html(mjmlWithData, { minify: false });

      // 3. Configurar opciones de correro
      const mailOptions: SendMailOptions = {
        from: `"easeanalytics" <${process.env.EMAIL_ACCOUNT}>`,
        to: to,
        subject: subject,
        html: html,
        text: convert(html),
        replyTo: "support@easeanalytics.com",
        headers: {
          "List-Unsubscribe": `<mailto:support@easeanalytics.com?subject=Unsubscribe, <https://easeanalytics.com/unsubscribe-info>`,
          "X-Mailer": "easeanalytics Mailer",
        },
        messageId: `<${crypto.randomUUID()}@easeanalytics.com>`,
      };

      // 4. Enviar correo
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Fail to send email: ${err.message}`);
      } else {
        throw new Error("Fail to send email. Unknown error");
      }
    }
  }
}
