import nodemailer from "nodemailer";
import ejs from "ejs";

export class MailService {
  static config = {
    service: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
    from: process.env.MAIL_AUTH_USER,
    port: 465,
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
  };

  static transport = nodemailer.createTransport(MailService.config);

  async sendMail(email: string, confirm_url: string) {
    const data = await ejs.renderFile(__dirname + "/templates/welcome.ejs", { confirm_url });
    return new Promise((resolve, reject) => {
      MailService.transport.sendMail(
        {
          from: process.env.MAIL_AUTH_USER,
          to: email,
          subject: "Welcome to APP! Confirm your Email",
          html: data,
        },
        (err: any, res: any) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
}
