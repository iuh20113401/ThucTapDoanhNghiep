import nodemailer from "nodemailer";
// vnch hliv npcv divl
// benstechlines1@gmail.com
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
function formatVietNameDate(date) {
  const currentDate = new Date(date);
  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric", // Năm
    month: "long", // Tháng (long: đầy đủ)
    day: "numeric", // Ngày
  }).format(currentDate);
  return formattedDate;
}

export const sendVerificationEmail = (order, email, name) => {
  const html = `
    <html>
        <body>
            <h3>Kính gửi ${name}</h3>
            <p>Cảm ơn bạn đã đặt hàng sản phẩm của chúng tôi!</p>
            <p>Dưới dây là thông tin đơn hàng của bạn</p>
            <p>Mã đơn hàng: <strong>${order._id}</strong></p>
            <p>Ngày tạo đơn: <strong>${formatVietNameDate(
              order.createdAt
            )}</strong></p>
            <p>Địa chỉ giao hàng: <strong>${order.shippingAddress.address} / ${
    order.shippingAddress.district
  } /${order.shippingAddress.city} </strong></p>
            <p>Tình trạng thanh toán: <strong>${
              order.paymentStatus
            }</strong></p>
            <p>Sản phẩm:${order.orderItems.map(
              (item) =>
                `<ul>
                <li>
                  ${item.qty} x ${item.name} (${formatPrice(
                  item.price
                )} mỗi cái)
                </li>
              </ul>`
            )}</p>
          <p>Phí ship:  <strong>${formatPrice(order.shippingPrice)}</strong></p>
          <p>Tổng tiền: <strong>${formatPrice(order.totalPrice)}</strong></p>

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
