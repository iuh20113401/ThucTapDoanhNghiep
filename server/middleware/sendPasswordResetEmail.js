import nodemailer from "nodemailer";

export const sendPasswordResetEmail = (token, email, name) => {
  const html = `
    <html>
        <body>
          <h3>Dear ${name}</h3>
             <p>Please click on the link below to reset your password.</p>
             <a href=\`${process.env.CLIENT_URI}/password-reset/${token}\`>Click here!</a>
        </body>
    </html>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "benstechlines1@gmail.com",
      pass: "vnch hliv npcv divl",
    },
  });

  const mailOptions = {
    from: "benstechlines1@gmail.com",
    to: email,
    subject: "Tech lines: Cài lại mật khẩu.",
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email send to ${email}`);
      console.log(info.response);
    }
  });
};
