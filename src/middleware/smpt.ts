import * as nodemailer from "nodemailer";

export default (req, res, next) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  req.smtp = transporter;
  next();
};
