import * as nodemailer from "nodemailer";

export default (req, res, next) => {
  // let account = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS // generated ethereal password
    }
  });
  req.smtp = transporter;
  next();

  // // send mail with defined transport object
  // let info = await transporter.sendMail({
  //   from: "rehirer@gmail.com", // sender address
  //   to: "danixoon@gmail.com", // list of receivers
  //   subject: "Добро пожаловать на Rehirer!", // Subject line
  //   // text: "Hello world?", // plain text body
  //   html: `<p><b>Ваш код</b></p><span>${Math.random() * 10000}</span>`
  // });

  // console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoo
};
