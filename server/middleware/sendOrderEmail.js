import nodemailer from "nodemailer";
// vnch hliv npcv divl
// benstechlines1@gmail.com
export const sendVerificationEmail = (token, email, name) => {
  const html = `
    <html>
        <body>
            <h3>Kính gửi ${name}</h3>
            <p>Cảm ơn bạn đã đặt hàng sản phẩm của chúng tôi!</p>
            <p>Dưới dây là thông tin đơn hàng của bạn</p>
            
        </body>
    </html>
    `;

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
    subject: "Thông tin đơn hàng của bạn",
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
