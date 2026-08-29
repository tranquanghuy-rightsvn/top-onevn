/* ============================================================
   Top One VN – js/main.js
   Nội dung động (dịch vụ, lý do, quy trình) + tương tác cơ bản
   ============================================================ */

const SERVICES = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon-svg"><path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/></svg>',
    title: "Vệ sinh nhà ở",
    desc: "Dọn dẹp, lau chùi, sắp xếp gọn gàng",
    slug: "ve-sinh-nha-o",
    photo: "assets/images/svc-nha-o.webp",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M4 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17h-2v-3h-2v3H9v-3H7v3H4zM7 6h2v2H7V6zm4 0h2v2h-2V6zM7 10h2v2H7v-2zm4 0h2v2h-2v-2zM7 14h2v2H7v-2zm4 0h2v2h-2v-2zM16 9h4a1 1 0 0 1 1 1v11h-5V9zm2 3v2h1v-2h-1zm0 4v2h1v-2h-1z"/></svg>',
    title: "Vệ sinh văn phòng",
    desc: "Sạch sẽ, chuyên nghiệp, hiệu quả",
    slug: "ve-sinh-van-phong",
    photo: "assets/images/svc-van-phong.webp",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M4 3h16v18H4V3zm2 2v14h5V5H6zm7 0v14h5V5h-5z"/></svg>',
    title: "Vệ sinh sau xây dựng",
    desc: "Làm sạch công trình, trả lại diện mạo mới",
    slug: "ve-sinh-sau-xay-dung",
    photo: "assets/images/svc-sau-xay-dung.webp",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon-svg"><path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/></svg>',
    title: "Giúp việc gia đình",
    desc: "Nấu ăn, dọn dẹp, chăm sóc gia đình",
    slug: "giup-viec-gia-dinh",
    photo: "assets/images/svc-giup-viec.webp",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a2 2 0 0 1 2 2v4.5a1 1 0 0 1-1 1h-1V19h-2v-1.5H7V19H5v-1.5H4a1 1 0 0 1-1-1V13a2 2 0 0 1 2-2zm2 0h10V8H7v3zM3 13v2.5h18V13a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z"/></svg>',
    title: "Giặt nệm sofa",
    desc: "Giặt sạch nệm, sofa, khử mùi và diệt khuẩn chuyên sâu",
    slug: "giat-nem-sofa",
    photo: "assets/images/svc-nem-sofa.webp",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-svg"><path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><rect x="3" y="18" width="18" height="3" rx="1"/></svg>',
    title: "Làm mới sàn & mặt đá tự nhiên",
    desc: "Đánh bóng sàn, mặt đá tự nhiên sảnh khách sạn, quầy bar",
    slug: "lam-moi-san-da",
    photo: "assets/images/svc-san-da.webp",
  },
];

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

/* ---------- Render ---------- */
function renderServices() {
  const host = document.getElementById("serviceGrid");
  if (!host) return;
  host.innerHTML = SERVICES.map(function (s) {
    const media = s.photo
      ? '<img src="' + s.photo + '" alt="' + s.title + '" width="1200" height="800" loading="lazy" decoding="async" />'
      : "ảnh " + s.title.toLowerCase();
    return (
      '<a class="service-card reveal" href="/dich-vu/' + s.slug + '/">' +
      '<div class="service-photo">' +
      media +
      "</div>" +
      '<div class="service-body">' +
      '<span class="service-icon">' +
      s.icon +
      "</span>" +
      '<div class="service-text"><h3>' +
      s.title +
      "</h3><p>" +
      s.desc +
      "</p></div>" +
      '<span class="service-more">›</span>' +
      "</div>" +
      "</a>"
    );
  }).join("");
}

function renderReasons() {
  const host = document.getElementById("whyGrid");
  if (!host) return;
  host.innerHTML = REASONS.map(function (r) {
    return (
      '<div class="why-item reveal">' +
      '<span class="why-icon">' +
      r.icon +
      "</span>" +
      "<h3>" +
      r.title +
      "</h3><p>" +
      r.desc +
      "</p>" +
      "</div>"
    );
  }).join("");
}

const STEP_ARROW =
  '<span class="step-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" class="icon-svg"><path d="M4 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

function renderSteps() {
  const host = document.getElementById("processGrid");
  if (!host) return;
  host.innerHTML = STEPS.map(function (st, i) {
    const arrow = i > 0 ? STEP_ARROW : "";
    return (
      arrow +
      '<div class="step reveal">' +
      '<span class="step-num">' +
      (i + 1) +
      "</span>" +
      '<span class="step-icon">' +
      st.icon +
      "</span>" +
      "<h3>" +
      st.title +
      "</h3><p>" +
      st.desc +
      "</p>" +
      "</div>"
    );
  }).join("");
}

/* ---------- Interactions ---------- */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initServiceCarousel() {
  const track = document.getElementById("serviceGrid");
  const prev = document.querySelector(".carousel-nav--prev");
  const next = document.querySelector(".carousel-nav--next");
  if (!track || !prev || !next) return;

  let index = 0;

  function visibleCount() {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 1080) return 2;
    return 4;
  }

  function maxIndex() {
    return Math.max(0, track.children.length - visibleCount());
  }

  function render() {
    index = Math.min(index, maxIndex());
    const card = track.querySelector(".service-card");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    const step = card ? card.getBoundingClientRect().width + gap : 0;
    track.style.transform = "translateX(" + -index * step + "px)";
    prev.disabled = index <= 0;
    next.disabled = index >= maxIndex();
  }

  prev.addEventListener("click", function () {
    index = Math.max(0, index - 1);
    render();
  });
  next.addEventListener("click", function () {
    index = Math.min(maxIndex(), index + 1);
    render();
  });
  window.addEventListener("resize", render);
  render();
}

function initStickyHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = function () {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const showAll = function () {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
  };
  if (
    !("IntersectionObserver" in window) ||
    document.visibilityState === "hidden"
  ) {
    showAll();
    return;
  }
  document.documentElement.classList.add("js-reveal");
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  items.forEach(function (el) {
    io.observe(el);
  });
  setTimeout(showAll, 1200);
}

/* ---------- Dropdown "Dịch vụ": accordion trên mobile ---------- */
function initNavDropdown() {
  document.querySelectorAll(".nav-drop").forEach(function (drop) {
    const btn = drop.querySelector(".nav-drop-toggle");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const open = drop.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
}

/* ---------- Form liên hệ ----------
   Trang tĩnh không có backend, nên form soạn sẵn email rồi mở ứng dụng mail.
   Muốn nhận trực tiếp vào hộp thư thì cần gắn Formspree/Web3Forms hoặc
   một Worker endpoint - xem ghi chú trong README. */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const note = document.getElementById("cfNote");

  function setNote(msg, kind) {
    if (!note) return;
    note.textContent = msg;
    note.className = "form-note" + (kind ? " is-" + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();

    form.querySelectorAll(".has-error").forEach(function (el) {
      el.classList.remove("has-error");
    });

    if (!name) {
      form.name.classList.add("has-error");
      form.name.focus();
      setNote("Vui lòng nhập họ và tên.", "error");
      return;
    }
    if (!/^[0-9+\s().-]{9,15}$/.test(phone)) {
      form.phone.classList.add("has-error");
      form.phone.focus();
      setNote("Số điện thoại chưa hợp lệ.", "error");
      return;
    }

    const lines = [
      "Họ tên: " + name,
      "Điện thoại: " + phone,
      email ? "Email: " + email : "",
      service ? "Dịch vụ quan tâm: " + service : "",
      "",
      message || "(không có nội dung thêm)",
    ].filter(Boolean);

    const subject = "Yêu cầu báo giá từ " + name;
    window.location.href =
      "mailto:cskhtoponevn@gmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(lines.join("\n"));

    setNote(
      "Đang mở ứng dụng email của bạn. Nếu không tự mở, vui lòng gọi 0979 726 873.",
      "ok"
    );
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderServices();
  renderReasons();
  renderSteps();
  initServiceCarousel();
  initNav();
  initNavDropdown();
  initContactForm();
  initStickyHeader();
  initReveal();
});
