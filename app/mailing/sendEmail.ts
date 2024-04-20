// Use at least Nodemailer v4.1.0
import nodemailer from "nodemailer";
import { cfg } from "@/cfg";

export function sendEmail(
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string
) {
  // Generate SMTP service account from ethereal.email
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account. " + err.message);
      return process.exit(1);
    }

    console.log("Credentials obtained, sending message...");

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    // Message object
    let message = {
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        return process.exit(1);
      }

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  });
}
export function sendConfirmationEmail(email: string, link: string) {
  //we'll setup link and other data
  //and will call sendEmail function
  //later we'll use env var to link to propper link
  const from = "ash database handler";
  const to = email;
  const subject = "Nodemailer is unicode friendly ✔";
  const text = `Please confirm your email by visiting ${cfg.API.HOST}/email-confirmation/${link}`;
  const html = `<p>Please confirm your email by clicking this link: <a href='${cfg.API.HOST}/email-confirmation/${link}'>${cfg.API.HOST}/confirm-email/${link}</a></p>`;

  sendEmail(from, to, subject, text, html);
}
