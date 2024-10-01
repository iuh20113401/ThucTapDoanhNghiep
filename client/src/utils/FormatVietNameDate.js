// Định dạng ngày theo tiếng Việt
export default function formatVietNameDate(date) {
  console.log(date);
  const currentDate = new Date(date);
  console.log(currentDate);
  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric", // Năm
    month: "long", // Tháng (long: đầy đủ)
    day: "numeric", // Ngày
  }).format(currentDate);
  return formattedDate;
}
