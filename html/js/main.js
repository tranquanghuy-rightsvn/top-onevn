/* ============================================================
   Top One VN – js/main.js

   LUU Y: 3 khoi dich vu / ly do / quy trinh trong trang chu TRUOC DAY
   duoc dung bang JS o day. Nay chung duoc sinh san ra HTML tinh boi
   tools/build.js, nen file nay chi con lo phan TUONG TAC.
   Sua noi dung 3 khoi do tai tools/content-home.js roi chay lai build.
   Nội dung động (dịch vụ, lý do, quy trình) + tương tác cơ bản
   ============================================================ */

/* ---------- Render ---------- */
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
  initServiceCarousel();
  initNav();
  initNavDropdown();
  initContactForm();
  initStickyHeader();
  initReveal();
});
