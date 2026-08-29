/* Khung HTML dùng chung cho mọi trang con.
   Chạy `node tools/build.js` để sinh lại toàn bộ trang trong html/. */

const SITE = {
  name: "Top One VN",
  origin: "https://toponevn.vn",
  phone: "0979726873",
  phoneText: "0979 726 873",
  email: "cskhtoponevn@gmail.com",
  addr: "151/11 Dương Vân Nga, Bắc Nha Trang, Khánh Hoà",
};

/* Danh sách dịch vụ – dùng chung cho dropdown, trang /dich-vu/ và sitemap */
const SERVICES = [
  { slug: "ve-sinh-nha-o", title: "Vệ sinh nhà ở", short: "Dọn dẹp, lau chùi, sắp xếp gọn gàng", img: "hero-1" },
  { slug: "ve-sinh-van-phong", title: "Vệ sinh văn phòng", short: "Sạch sẽ, chuyên nghiệp, hiệu quả", img: "hero-2" },
  { slug: "ve-sinh-sau-xay-dung", title: "Vệ sinh sau xây dựng", short: "Làm sạch công trình, trả lại diện mạo mới", img: "hero-3" },
  { slug: "giup-viec-gia-dinh", title: "Giúp việc gia đình", short: "Nấu ăn, dọn dẹp, chăm sóc gia đình", img: "hero-4" },
  { slug: "giat-nem-sofa", title: "Giặt nệm sofa", short: "Giặt sạch, khử mùi và diệt khuẩn chuyên sâu", img: "hero" },
  { slug: "lam-moi-san-da", title: "Làm mới sàn & mặt đá tự nhiên", short: "Đánh bóng sàn, mặt đá sảnh khách sạn, quầy bar", img: "hero-1" },
];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------------- Header + nav (dropdown Dịch vụ) ---------------- */
function headerNav(active) {
  const on = (k) => (active === k ? ' class="is-active"' : "");
  const items = SERVICES.map(
    (s) => `              <li><a href="/dich-vu/${s.slug}/">${s.title}</a></li>`
  ).join("\n");

  return `        <nav class="main-nav" id="mainNav">
          <a href="/"${on("home")}>Trang chủ</a>
          <a href="/gioi-thieu/"${on("gioi-thieu")}>Giới thiệu</a>
          <div class="nav-drop${active === "dich-vu" ? " is-active" : ""}">
            <a class="nav-drop-btn" href="/dich-vu/">
              Dịch vụ
              <svg class="nav-caret" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4"
                  fill="none" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
            <button class="nav-drop-toggle" type="button" aria-label="Mở danh sách dịch vụ"
              aria-expanded="false">
              <svg class="nav-caret" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4"
                  fill="none" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <ul class="nav-drop-menu">
${items}
            </ul>
          </div>
          <a href="/tin-tuc/"${on("tin-tuc")}>Tin tức</a>
          <a href="/cong-tac-vien/"${on("cong-tac-vien")}>Tuyển cộng tác viên</a>
          <a href="/lien-he/"${on("lien-he")}>Liên hệ</a>
        </nav>`;
}

function header(active) {
  return `    <header class="site-header" id="siteHeader">
      <div class="header-inner">
        <a class="brand" href="/">
          <img class="brand-mark" src="/assets/images/logo.webp" alt="Top One VN"
            width="260" height="167" fetchpriority="high" />
          <span class="brand-text">
            <span class="brand-name">Top One <em>VN</em></span>
            <span class="brand-tag">— Dịch vụ giúp việc &amp; vệ sinh —</span>
          </span>
        </a>

        <button class="nav-toggle" id="navToggle" aria-label="Mở menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

${headerNav(active)}

        <a class="hotline-pill" href="tel:${SITE.phone}">
          <span class="hotline-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 2C13.5 2 15.8335 2.21213 18.8033 5.18198C21.7731 8.15183 21.9853 10.4853 21.9853 10.4853"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <path d="M14.207 5.53564C14.207 5.53564 15.2685 5.83125 16.8503 7.41314C18.4322 8.99502 18.7278 10.0565 18.7278 10.0565"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <path d="M10.0376 5.31617L10.6866 6.4791C11.2723 7.52858 11.0372 8.90532 10.1147 9.8278C10.1147 9.8278 8.99578 10.9468 11.0245 12.9755C13.0525 15.0035 14.1722 13.8853 14.1722 13.8853C15.0947 12.9628 16.4714 12.7277 17.5209 13.3134L18.6838 13.9624C20.2686 14.8468 20.4557 17.0692 19.0628 18.4622C18.2258 19.2992 17.2004 19.9505 16.0669 19.9934C14.1588 20.0658 10.9183 19.5829 7.66795 16.3325C4.41758 13.0821 3.93472 9.84171 4.00714 7.93359C4.05002 6.80014 4.7013 5.77477 5.53835 4.93772C6.93129 3.54478 9.15367 3.73186 10.0376 5.31617Z"
                stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="hotline-text">
            <small class="hotline-label">Hotline</small>
            <strong class="hotline-number">${SITE.phoneText}</strong>
          </span>
        </a>
      </div>
    </header>`;
}

/* ---------------- Footer ---------------- */
function footer() {
  const links = SERVICES.slice(0, 4)
    .map((s) => `              <li><a href="/dich-vu/${s.slug}/">${s.title}</a></li>`)
    .join("\n");

  return `      <footer class="site-footer">
        <div class="footer-inner">
          <div class="foot-brand">
            <img src="/assets/images/logo.webp" alt="Top One VN" width="260" height="167"
              loading="lazy" decoding="async" />
            <span class="brand-name brand-name--light">Top One <em>VN</em></span>
            <span class="brand-tag brand-tag--light">— Dịch vụ giúp việc &amp; vệ sinh —</span>
          </div>
          <div class="foot-col foot-col--divided">
            <h3>Liên hệ</h3>
            <p>
              <svg viewBox="0 0 24 24" class="foot-ic">
                <path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1l-2.1 2.1z" />
              </svg>
              <a href="tel:${SITE.phone}">${SITE.phoneText}</a>
            </p>
            <p>
              <svg viewBox="0 0 24 24" class="foot-ic">
                <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13zm2.2.5 7.3 6 7.3-6H4.2zM20 7.9l-7.4 6.1a1 1 0 0 1-1.2 0L4 7.9v10.1h16V7.9z" />
              </svg>
              <a href="mailto:${SITE.email}">${SITE.email}</a>
            </p>
            <p>
              <svg viewBox="0 0 24 24" class="foot-ic">
                <path d="M12 22s7-6.8 7-12.5A7 7 0 1 0 5 9.5C5 15.2 12 22 12 22z" />
                <circle cx="12" cy="9.5" r="2.6" fill="#0a2f77" />
              </svg>
              <span>151/11 Dương Vân Nga,<br />Bắc Nha Trang, Khánh Hoà</span>
            </p>
          </div>
          <div class="foot-col foot-col--divided">
            <h3>Dịch vụ</h3>
            <ul class="foot-links">
${links}
              <li><a href="/dich-vu/">Xem tất cả dịch vụ</a></li>
            </ul>
          </div>
          <div class="foot-col foot-col--divided">
            <h3>Về Top One VN</h3>
            <ul class="foot-links">
              <li><a href="/gioi-thieu/">Giới thiệu</a></li>
              <li><a href="/tin-tuc/">Tin tức</a></li>
              <li><a href="/cong-tac-vien/">Tuyển cộng tác viên</a></li>
              <li><a href="/lien-he/">Liên hệ</a></li>
            </ul>
          </div>
          <div class="seal">
            <span class="seal-stars">★★★</span>
            <span class="seal-text">Cam kết<br />chất lượng<br />dịch vụ</span>
            <span class="seal-stars">★★★</span>
          </div>
        </div>
      </footer>

      <div class="copyright">
        © 2026 Top One VN Clean &amp; Care. All rights reserved.
      </div>`;
}

/* ---------------- Breadcrumb ---------------- */
function crumbs(trail) {
  const items = trail
    .map((c, i) =>
      i === trail.length - 1
        ? `<span aria-current="page">${c.name}</span>`
        : `<a href="${c.url}">${c.name}</a><span class="crumb-sep">›</span>`
    )
    .join("\n          ");
  return `      <nav class="breadcrumb" aria-label="Đường dẫn">
        <div class="breadcrumb-inner">
          ${items}
        </div>
      </nav>`;
}

function crumbLd(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: SITE.origin + c.url,
    })),
  };
}

/* ---------------- Khung trang ---------------- */
function layout(o) {
  const url = SITE.origin + o.path;
  const ogImg = SITE.origin + (o.image || "/assets/images/hero.webp");
  const ld = (o.jsonld || []).filter(Boolean);
  const ldTags = ld
    .map((x) => `    <script type="application/ld+json">\n${JSON.stringify(x, null, 2)}\n    </script>`)
    .join("\n");

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(o.title)}</title>
    <meta name="description" content="${esc(o.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${o.ogType || "website"}" />
    <meta property="og:locale" content="vi_VN" />
    <meta property="og:site_name" content="Top One VN" />
    <meta property="og:title" content="${esc(o.title)}" />
    <meta property="og:description" content="${esc(o.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${ogImg}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/assets/images/logo.webp" />
${o.preload ? `    <link rel="preload" as="image" href="${o.preload}" fetchpriority="high" />\n` : ""}    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/styles/style.css" />
${ldTags}
  </head>
  <body>
${header(o.active)}

    <main class="page">
${o.crumbs ? crumbs(o.crumbs) + "\n" : ""}${o.body}

${footer()}
    </main>

    <a class="fab-call" href="tel:${SITE.phone}" aria-label="Gọi hotline">✆</a>

    <script src="/js/main.js"></script>
  </body>
</html>
`;
}

module.exports = { SITE, SERVICES, esc, layout, crumbLd, headerNav, footerHtml: footer };
