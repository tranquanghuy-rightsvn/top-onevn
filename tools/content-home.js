/* Dữ liệu 2 khối trên trang chủ. Trước đây nằm trong html/js/main.js và được
   dựng bằng JS phía trình duyệt; nay build.js in thẳng ra HTML tĩnh. */

const REASONS = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg icon-svg--lg"><path d="M8.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM1.5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5v.5h-14V20z"/><path d="M16.8 8.2a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4zM15.2 12c2.9.4 5.3 2.6 5.8 5.6.1.6-.4 1.1-1 1.1h-2.5v-1c0-2-.8-3.8-2.3-5.1v-.6z"/></svg>',
    title: "Đội ngũ chuyên nghiệp",
    desc: "Được đào tạo bài bản, kinh nghiệm thực tế",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg icon-svg--lg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M11 6h2v6.4l4 2.4-1 1.7-5-3V6z"/></svg>',
    title: "Linh hoạt thời gian",
    desc: "Phù hợp với mọi nhu cầu của khách hàng",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg icon-svg--lg"><path d="M12 2l8 3.6v5.4c0 5.5-3.4 9.9-8 11-4.6-1.1-8-5.5-8-11V5.6L12 2z"/><path fill="#fff" d="M9.6 12.1l1.7 1.7 3.5-3.7 1.1 1-4.6 4.9-2.8-2.8z"/></svg>',
    title: "An toàn tuyệt đối",
    desc: "Sử dụng sản phẩm và thiết bị an toàn",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg icon-svg--lg"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7L12 2z"/></svg>',
    title: "Chất lượng cam kết",
    desc: "Luôn đặt sự hài lòng của khách hàng lên hàng đầu",
  },
];
const STEPS = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1l-2.1 2.1z"/></svg>',
    title: "Liên hệ tư vấn",
    desc: "Gọi hotline hoặc để lại thông tin",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M9 2h6a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm0 4H7v14h10V6h-2v1a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V6zm1-2v1h4V4h-4zM8 11h8v1.5H8V11zm0 3.5h8V16H8v-1.5zM8 18h5v1.5H8V18z"/></svg>',
    title: "Khảo sát & báo giá",
    desc: "Tư vấn với phương án phù hợp",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zM5 10v9h14v-9H5zm2 3h4v3H7v-3z"/></svg>',
    title: "Tiến hành dịch vụ",
    desc: "Đội ngũ chuyên nghiệp triển khai công việc",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 14.6-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z"/></svg>',
    title: "Nghiệm thu & hài lòng",
    desc: "Kiểm tra và đảm bảo chất lượng",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M12 21s-7.2-4.5-10-9.3C.4 8.7 1.9 5 5.4 4.2 7.7 3.7 10 4.8 12 7c2-2.2 4.3-3.3 6.6-2.8 3.5.8 5 4.5 3.4 7.5C19.2 16.5 12 21 12 21z"/></svg>',
    title: "Đồng hành lâu dài",
    desc: "Luôn sẵn sàng hỗ trợ",
  },
];

/* Icon SVG của 6 dịch vụ, khoá theo slug. Tiêu đề/mô tả/ảnh vẫn lấy từ
   mảng SERVICES trong layout.js để tránh hai nguồn dữ liệu lệch nhau. */
const SERVICE_ICONS = {
  "ve-sinh-nha-o":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon-svg"><path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/></svg>',
  "ve-sinh-van-phong":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M4 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17h-2v-3h-2v3H9v-3H7v3H4zM7 6h2v2H7V6zm4 0h2v2h-2V6zM7 10h2v2H7v-2zm4 0h2v2h-2v-2zM7 14h2v2H7v-2zm4 0h2v2h-2v-2zM16 9h4a1 1 0 0 1 1 1v11h-5V9zm2 3v2h1v-2h-1zm0 4v2h1v-2h-1z"/></svg>',
  "ve-sinh-sau-xay-dung":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M4 3h16v18H4V3zm2 2v14h5V5H6zm7 0v14h5V5h-5z"/></svg>',
  "giup-viec-gia-dinh":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon-svg"><path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/></svg>',
  "giat-nem-sofa":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a2 2 0 0 1 2 2v4.5a1 1 0 0 1-1 1h-1V19h-2v-1.5H7V19H5v-1.5H4a1 1 0 0 1-1-1V13a2 2 0 0 1 2-2zm2 0h10V8H7v3zM3 13v2.5h18V13a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z"/></svg>',
  "lam-moi-san-da":
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><rect x="3" y="18" width="18" height="3" rx="1"/></svg>',
};

module.exports = { REASONS, STEPS, SERVICE_ICONS };
