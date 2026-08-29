#!/usr/bin/env node
/* Sinh toàn bộ trang con trong html/.  Chạy: node tools/build.js
   Header/footer/nav lấy từ tools/layout.js nên chỉ sửa một chỗ là đồng bộ hết. */

const fs = require("fs");
const path = require("path");
const { SITE, SERVICES, esc, layout, crumbLd } = require("./layout");

const ROOT = path.join(__dirname, "..", "html");
const ALL_SERVICES = [
  ...require("./content-services"),
  ...require("./content-services2"),
];
const NEWS = require("./content-news");

const img = (n) => `/assets/images/${n}.webp`;

function write(rel, html) {
  const file = path.join(ROOT, rel, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return { file: path.relative(ROOT, file), words };
}

/* Đếm chữ của phần nội dung bài (không tính header/footer) */
function countBody(s) {
  const t = [
    s.lead,
    ...s.sections.flatMap((x) => [x.h2, ...(x.p || []), ...(x.ul || []), x.after || ""]),
    ...s.faq.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  return t.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

/* ---------------- Khối FAQ dùng chung ---------------- */
function faqBlock(faq) {
  const items = faq
    .map(
      (f) => `          <details class="faq-item">
            <summary>${f.q}</summary>
            <div class="faq-answer"><p>${f.a}</p></div>
          </details>`
    )
    .join("\n");
  return `        <section class="prose-faq">
          <h2>Câu hỏi thường gặp</h2>
${items}
        </section>`;
}

function faqLd(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/* ---------------- CTA cuối bài ---------------- */
const ctaBox = `        <aside class="cta-box">
          <h2>Cần tư vấn hoặc báo giá?</h2>
          <p>Gọi hotline để được khảo sát miễn phí trong khu vực Nha Trang. Chúng tôi báo giá trước khi làm, không phát sinh giữa chừng.</p>
          <div class="cta-actions">
            <a class="btn-solid" href="tel:${SITE.phone}">Gọi ${SITE.phoneText}</a>
            <a class="btn-ghost" href="/lien-he/">Gửi yêu cầu</a>
          </div>
        </aside>`;

/* ---------------- Trang chi tiết dịch vụ ---------------- */
function servicePage(s) {
  const body = s.sections
    .map((sec) => {
      const ps = (sec.p || []).map((x) => `          <p>${x}</p>`).join("\n");
      const ul = sec.ul
        ? `          <ul>\n${sec.ul.map((x) => `            <li>${x}</li>`).join("\n")}\n          </ul>`
        : "";
      const after = sec.after ? `          <p>${sec.after}</p>` : "";
      return `          <h2>${sec.h2}</h2>\n${[ps, ul, after].filter(Boolean).join("\n")}`;
    })
    .join("\n\n");

  const others = ALL_SERVICES.filter((x) => x.slug !== s.slug)
    .slice(0, 3)
    .map(
      (x) => `            <a class="mini-card" href="/dich-vu/${x.slug}/">
              <img src="${img(x.img)}" alt="${esc(x.title)}" width="700" height="352" loading="lazy" decoding="async" />
              <span>${x.title}</span>
            </a>`
    )
    .join("\n");

  const trail = [
    { name: "Trang chủ", url: "/" },
    { name: "Dịch vụ", url: "/dich-vu/" },
    { name: s.title, url: `/dich-vu/${s.slug}/` },
  ];

  return layout({
    title: `${s.h1} | Top One VN`,
    description: s.description,
    path: `/dich-vu/${s.slug}/`,
    image: img(s.img),
    preload: img(s.img),
    active: "dich-vu",
    crumbs: trail,
    ogType: "article",
    jsonld: [
      crumbLd(trail),
      faqLd(s.faq),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: s.title,
        serviceType: s.title,
        description: s.description,
        provider: {
          "@type": "LocalBusiness",
          name: SITE.name,
          telephone: SITE.phoneText,
          email: SITE.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: "151/11 Dương Vân Nga",
            addressLocality: "Bắc Nha Trang",
            addressRegion: "Khánh Hoà",
            addressCountry: "VN",
          },
        },
        areaServed: { "@type": "City", name: "Nha Trang" },
      },
    ],
    body: `      <article class="prose-page">
        <header class="prose-head">
          <h1>${s.h1}</h1>
          <p class="prose-lead">${s.lead}</p>
        </header>

        <figure class="prose-figure">
          <img src="${img(s.img)}" alt="${esc(s.h1)}" width="1400" height="744"
            fetchpriority="high" decoding="async" />
          <figcaption>${s.title} — Top One VN, Nha Trang</figcaption>
        </figure>

        <div class="prose">
${body}
        </div>

${faqBlock(s.faq)}

${ctaBox}

        <section class="related">
          <h2>Dịch vụ khác</h2>
          <div class="mini-grid">
${others}
          </div>
        </section>
      </article>`,
  });
}

/* ---------------- Trang danh sách dịch vụ ---------------- */
function servicesIndex() {
  const cards = ALL_SERVICES.map(
    (s) => `          <a class="svc-card" href="/dich-vu/${s.slug}/">
            <div class="svc-card-img">
              <img src="${img(s.img)}" alt="${esc(s.title)}" width="700" height="352"
                loading="lazy" decoding="async" />
            </div>
            <div class="svc-card-body">
              <h2>${s.title}</h2>
              <p>${s.short}</p>
              <span class="svc-more">Xem chi tiết ›</span>
            </div>
          </a>`
  ).join("\n");

  const trail = [
    { name: "Trang chủ", url: "/" },
    { name: "Dịch vụ", url: "/dich-vu/" },
  ];

  return layout({
    title: "Dịch vụ giúp việc & vệ sinh tại Nha Trang | Top One VN",
    description:
      "Sáu dịch vụ chính của Top One VN tại Nha Trang, Khánh Hoà: vệ sinh nhà ở, văn phòng, sau xây dựng, giúp việc gia đình, giặt nệm sofa và làm mới sàn đá.",
    path: "/dich-vu/",
    active: "dich-vu",
    crumbs: trail,
    jsonld: [crumbLd(trail)],
    body: `      <section class="page-head">
        <h1>Dịch vụ của Top One VN</h1>
        <p>Chúng tôi phục vụ khách hàng cá nhân và doanh nghiệp tại TP. Nha Trang và khu vực lân cận trong tỉnh Khánh Hoà. Mọi dịch vụ đều được khảo sát và báo giá trước khi triển khai.</p>
      </section>

      <section class="section section--white">
        <div class="svc-grid">
${cards}
        </div>
      </section>

${ctaBox}`,
  });
}

/* ---------------- Trang tin tức ---------------- */
const calIcon = `<svg class="meta-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zM5 10v9h14v-9H5z"/></svg>`;

function newsIndex() {
  const cards = NEWS.map(
    (n) => `          <article class="news-card">
            <a class="news-thumb" href="/tin-tuc/${n.slug}/">
              <img src="${img(n.img)}" alt="${esc(n.title)}" width="700" height="352"
                loading="lazy" decoding="async" />
            </a>
            <div class="news-body">
              <h2><a href="/tin-tuc/${n.slug}/">${n.title}</a></h2>
              <p class="news-excerpt">${n.excerpt}</p>
              <p class="news-meta">
                ${calIcon}
                <time datetime="${n.date}">${n.dateText}</time>
              </p>
            </div>
          </article>`
  ).join("\n");

  const trail = [
    { name: "Trang chủ", url: "/" },
    { name: "Tin tức", url: "/tin-tuc/" },
  ];

  return layout({
    title: "Tin tức & kinh nghiệm vệ sinh nhà cửa | Top One VN",
    description:
      "Kinh nghiệm vệ sinh nhà cửa, chống ẩm mốc mùa mưa Nha Trang, chọn dịch vụ uy tín và bảo dưỡng nệm sofa định kỳ — chia sẻ từ đội ngũ Top One VN.",
    path: "/tin-tuc/",
    active: "tin-tuc",
    crumbs: trail,
    jsonld: [crumbLd(trail)],
    body: `      <section class="page-head">
        <h1>Tin tức &amp; kinh nghiệm</h1>
        <p>Những bài viết ngắn từ kinh nghiệm thực tế của đội ngũ Top One VN, giúp bạn giữ nhà cửa sạch sẽ và chọn được dịch vụ phù hợp.</p>
      </section>

      <section class="section section--white">
        <div class="news-grid">
${cards}
        </div>
      </section>`,
  });
}

function newsPage(n) {
  const body = n.body
    .map((b) => (b.h2 ? `          <h2>${b.h2}</h2>` : `          <p>${b.p}</p>`))
    .join("\n");

  const more = NEWS.filter((x) => x.slug !== n.slug)
    .slice(0, 3)
    .map(
      (x) => `            <a class="mini-card" href="/tin-tuc/${x.slug}/">
              <img src="${img(x.img)}" alt="${esc(x.title)}" width="700" height="352" loading="lazy" decoding="async" />
              <span>${x.title}</span>
            </a>`
    )
    .join("\n");

  const trail = [
    { name: "Trang chủ", url: "/" },
    { name: "Tin tức", url: "/tin-tuc/" },
    { name: n.title, url: `/tin-tuc/${n.slug}/` },
  ];

  return layout({
    title: `${n.title} | Top One VN`,
    description: n.excerpt,
    path: `/tin-tuc/${n.slug}/`,
    image: img(n.img),
    preload: img(n.img),
    active: "tin-tuc",
    crumbs: trail,
    ogType: "article",
    jsonld: [
      crumbLd(trail),
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: n.title,
        description: n.excerpt,
        image: SITE.origin + img(n.img),
        datePublished: n.date,
        dateModified: n.date,
        author: { "@type": "Organization", name: SITE.name },
        publisher: {
          "@type": "Organization",
          name: SITE.name,
          logo: { "@type": "ImageObject", url: SITE.origin + "/assets/images/logo.webp" },
        },
        mainEntityOfPage: SITE.origin + `/tin-tuc/${n.slug}/`,
      },
    ],
    body: `      <article class="prose-page">
        <figure class="prose-figure prose-figure--top">
          <img src="${img(n.img)}" alt="${esc(n.title)}" width="1400" height="744"
            fetchpriority="high" decoding="async" />
        </figure>

        <header class="prose-head">
          <h1>${n.title}</h1>
          <p class="news-meta news-meta--lg">
            ${calIcon}
            <time datetime="${n.date}">${n.dateText}</time>
          </p>
          <p class="prose-lead">${n.excerpt}</p>
        </header>

        <div class="prose">
${body}
        </div>

${ctaBox}

        <section class="related">
          <h2>Bài viết khác</h2>
          <div class="mini-grid">
${more}
          </div>
        </section>
      </article>`,
  });
}

/* ---------------- Trang tĩnh ---------------- */
function aboutPage() {
  const trail = [
    { name: "Trang chủ", url: "/" },
    { name: "Giới thiệu", url: "/gioi-thieu/" },
  ];
  return layout({
    title: "Giới thiệu Top One VN – Dịch vụ giúp việc & vệ sinh tại Nha Trang",
    description:
      "Top One VN Clean & Care cung cấp dịch vụ giúp việc và vệ sinh chuyên nghiệp tại Nha Trang, Khánh Hoà. Nhân sự được đào tạo, quy trình rõ ràng, báo giá minh bạch.",
    path: "/gioi-thieu/",
    active: "gioi-thieu",
    crumbs: trail,
    jsonld: [
      crumbLd(trail),
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: SITE.name,
        description:
          "Dịch vụ giúp việc và vệ sinh chuyên nghiệp tại Nha Trang, Khánh Hoà.",
        telephone: SITE.phoneText,
        email: SITE.email,
        url: SITE.origin,
        image: SITE.origin + "/assets/images/logo.webp",
        address: {
          "@type": "PostalAddress",
          streetAddress: "151/11 Dương Vân Nga",
          addressLocality: "Bắc Nha Trang",
          addressRegion: "Khánh Hoà",
          addressCountry: "VN",
        },
        areaServed: { "@type": "City", name: "Nha Trang" },
      },
    ],
    body: `      <article class="prose-page">
        <header class="prose-head">
          <h1>Về Top One VN Clean &amp; Care</h1>
          <p class="prose-lead">Chúng tôi làm một việc duy nhất và cố gắng làm cho tốt: giữ cho không gian sống và làm việc của khách hàng tại Nha Trang luôn sạch sẽ, an toàn.</p>
        </header>

        <figure class="prose-figure">
          <img src="/assets/images/why-staff.webp" alt="Đội ngũ Top One VN"
            width="500" height="500" decoding="async" />
        </figure>

        <div class="prose">
          <h2>Chúng tôi là ai</h2>
          <p>Top One VN Clean &amp; Care là đơn vị cung cấp dịch vụ giúp việc gia đình và vệ sinh công nghiệp tại TP. Nha Trang, tỉnh Khánh Hoà. Chúng tôi phục vụ cả khách hàng cá nhân — các gia đình cần người dọn dẹp định kỳ — lẫn khách hàng doanh nghiệp như văn phòng, showroom, khách sạn và homestay.</p>
          <p>Điều khiến khách hàng quay lại với chúng tôi không phải là giá rẻ nhất thị trường, mà là sự ổn định: cùng một nhân viên quen việc, cùng một chất lượng, và một mức giá đã chốt là không thay đổi.</p>

          <h2>Giá trị chúng tôi theo đuổi</h2>
          <p><strong>Minh bạch về giá.</strong> Chúng tôi khảo sát trước khi báo giá và cam kết không phát sinh giữa chừng. Nếu trong quá trình làm phát hiện hạng mục nằm ngoài thoả thuận, chúng tôi hỏi ý bạn trước chứ không tự ý làm rồi tính tiền.</p>
          <p><strong>Chịu trách nhiệm về nhân sự.</strong> Mọi nhân viên đều có hồ sơ lý lịch rõ ràng, được đào tạo trước khi nhận việc và được công ty bảo lãnh. Bạn làm việc với công ty, không phải với một cá nhân tự do — nghĩa là khi có vấn đề, có nơi để chịu trách nhiệm.</p>
          <p><strong>An toàn cho gia đình bạn.</strong> Hoá chất chúng tôi dùng đều có nguồn gốc rõ ràng và được pha đúng nồng độ khuyến cáo. Với nhà có trẻ nhỏ, người già hoặc thú cưng, chúng tôi chuyển sang nhóm dung dịch dịu hơn khi được báo trước.</p>
          <p><strong>Làm lại nếu chưa đạt.</strong> Buổi nghiệm thu là lúc bạn kiểm tra và nêu ý kiến. Chỗ nào chưa vừa ý, chúng tôi xử lý ngay trong buổi mà không tính thêm phí.</p>

          <h2>Đội ngũ</h2>
          <p>Nhân sự của chúng tôi được tuyển chọn qua bốn vòng: xác minh nhân thân, kiểm tra sức khoẻ, đào tạo nghiệp vụ và thử việc có giám sát. Nội dung đào tạo bao gồm cách sử dụng thiết bị, phân loại hoá chất, an toàn điện nước, và cả kỹ năng giao tiếp — bởi làm việc trong nhà người khác đòi hỏi sự tế nhị không kém gì tay nghề.</p>
          <p>Chúng tôi cũng duy trì đội ngũ dự phòng để khi nhân viên phụ trách nghỉ đột xuất, công việc của bạn không bị gián đoạn.</p>

          <h2>Khu vực phục vụ</h2>
          <p>Trụ sở của chúng tôi đặt tại 151/11 Dương Vân Nga, Bắc Nha Trang, Khánh Hoà. Chúng tôi nhận việc trên toàn địa bàn TP. Nha Trang và các khu vực lân cận trong tỉnh. Với công trình lớn ngoài phạm vi này, vui lòng liên hệ để chúng tôi sắp xếp.</p>
        </div>

${ctaBox}
      </article>`,
  });
}

function jobsPage() {
  const trail = [
    { name: "Trang chủ", url: "/" },
    { name: "Tuyển cộng tác viên", url: "/cong-tac-vien/" },
  ];
  return layout({
    title: "Tuyển cộng tác viên vệ sinh & giúp việc tại Nha Trang | Top One VN",
    description:
      "Top One VN tuyển cộng tác viên vệ sinh, giúp việc tại Nha Trang. Thu nhập 6–12 triệu/tháng, thời gian linh hoạt, được đào tạo miễn phí. Hotline 0979 726 873.",
    path: "/cong-tac-vien/",
    active: "cong-tac-vien",
    crumbs: trail,
    jsonld: [crumbLd(trail)],
    body: `      <article class="prose-page">
        <figure class="prose-figure prose-figure--top">
          <img src="/assets/images/jobs-staff.webp" alt="Cộng tác viên Top One VN"
            width="600" height="600" fetchpriority="high" decoding="async" />
        </figure>

        <header class="prose-head">
          <h1>Tuyển cộng tác viên</h1>
          <p class="prose-lead">Gia nhập đội ngũ Top One VN — thu nhập ổn định, thời gian linh hoạt, được đào tạo bài bản và luôn có người hỗ trợ khi gặp khó khăn trong công việc.</p>
        </header>

        <div class="prose">
          <h2>Vị trí đang tuyển</h2>
          <ul>
            <li><strong>Nhân viên vệ sinh nhà ở, văn phòng</strong> — làm theo ca, 4–8 giờ/ngày</li>
            <li><strong>Người giúp việc gia đình</strong> — theo giờ, theo ngày hoặc ở lại</li>
            <li><strong>Nhân viên vệ sinh công nghiệp</strong> — vệ sinh sau xây dựng, giặt nệm sofa, đánh bóng sàn đá</li>
          </ul>

          <h2>Thu nhập</h2>
          <ul>
            <li>Làm theo giờ: 45.000–60.000đ/giờ tuỳ loại công việc</li>
            <li>Làm toàn thời gian: 6.000.000–9.000.000đ/tháng</li>
            <li>Vệ sinh công nghiệp có kỹ thuật: 8.000.000–12.000.000đ/tháng</li>
            <li>Thưởng theo đánh giá của khách hàng và thưởng chuyên cần hằng tháng</li>
          </ul>

          <h2>Quyền lợi</h2>
          <ul>
            <li>Được đào tạo miễn phí trước khi nhận việc, kể cả khi chưa có kinh nghiệm</li>
            <li>Cung cấp đồng phục, dụng cụ và hoá chất — bạn không phải tự bỏ tiền mua</li>
            <li>Chủ động đăng ký lịch làm phù hợp với hoàn cảnh gia đình</li>
            <li>Được công ty đứng ra làm việc với khách hàng khi có phát sinh, không phải tự xoay xở</li>
            <li>Thanh toán đúng hạn, rõ ràng theo bảng công</li>
            <li>Hỗ trợ tham gia bảo hiểm với cộng tác viên gắn bó lâu dài</li>
          </ul>

          <h2>Yêu cầu</h2>
          <ul>
            <li>Nam/nữ từ 20 đến 55 tuổi, sức khoẻ tốt</li>
            <li>Có căn cước công dân và giấy tờ tuỳ thân hợp lệ</li>
            <li>Trung thực, chăm chỉ, đúng giờ — đây là yêu cầu quan trọng nhất</li>
            <li>Ưu tiên người có kinh nghiệm, nhưng chưa có kinh nghiệm vẫn được đào tạo</li>
            <li>Đang sinh sống tại Nha Trang hoặc khu vực lân cận</li>
          </ul>

          <h2>Cách ứng tuyển</h2>
          <p>Bạn có thể gọi trực tiếp hotline <a href="tel:${SITE.phone}">${SITE.phoneText}</a> trong giờ hành chính, hoặc gửi thông tin qua email <a href="mailto:${SITE.email}">${SITE.email}</a>. Nếu thuận tiện hơn, hãy tới trực tiếp văn phòng tại 151/11 Dương Vân Nga, Bắc Nha Trang.</p>
          <p>Khi liên hệ, vui lòng cho chúng tôi biết: họ tên, năm sinh, khu vực bạn đang ở, kinh nghiệm nếu có, và khung thời gian bạn có thể làm việc. Chúng tôi sẽ phản hồi trong vòng 1–2 ngày làm việc và hẹn bạn tới phỏng vấn.</p>

          <h2>Quy trình tiếp nhận</h2>
          <ul>
            <li><strong>Bước 1:</strong> Liên hệ và gửi thông tin cơ bản</li>
            <li><strong>Bước 2:</strong> Phỏng vấn trực tiếp tại văn phòng, mang theo giấy tờ tuỳ thân</li>
            <li><strong>Bước 3:</strong> Tham gia buổi đào tạo nghiệp vụ</li>
            <li><strong>Bước 4:</strong> Nhận việc, tuần đầu có người hướng dẫn kèm</li>
          </ul>
        </div>

        <aside class="cta-box">
          <h2>Sẵn sàng bắt đầu?</h2>
          <p>Gọi ngay để được tư vấn về công việc phù hợp với bạn.</p>
          <div class="cta-actions">
            <a class="btn-solid" href="tel:${SITE.phone}">Gọi ${SITE.phoneText}</a>
            <a class="btn-ghost" href="mailto:${SITE.email}">Gửi email ứng tuyển</a>
          </div>
        </aside>
      </article>`,
  });
}

function contactPage() {
  const trail = [
    { name: "Trang chủ", url: "/" },
    { name: "Liên hệ", url: "/lien-he/" },
  ];
  return layout({
    title: "Liên hệ Top One VN – Dịch vụ vệ sinh tại Nha Trang",
    description:
      "Liên hệ Top One VN: 151/11 Dương Vân Nga, Bắc Nha Trang, Khánh Hoà. Hotline 0979 726 873, email cskhtoponevn@gmail.com. Gửi yêu cầu báo giá miễn phí.",
    path: "/lien-he/",
    active: "lien-he",
    crumbs: trail,
    jsonld: [crumbLd(trail)],
    body: `      <section class="page-head">
        <h1>Liên hệ với chúng tôi</h1>
        <p>Gọi hotline để được tư vấn nhanh nhất, hoặc để lại yêu cầu bên dưới. Chúng tôi phản hồi trong giờ hành chính.</p>
      </section>

      <section class="section section--white">
        <div class="contact-layout">
          <div class="contact-info">
            <h2>Thông tin liên hệ</h2>
            <ul class="contact-list">
              <li>
                <svg viewBox="0 0 24 24" class="foot-ic"><path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1l-2.1 2.1z"/></svg>
                <div><small>Hotline</small><a href="tel:${SITE.phone}">${SITE.phoneText}</a></div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" class="foot-ic"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13zm2.2.5 7.3 6 7.3-6H4.2zM20 7.9l-7.4 6.1a1 1 0 0 1-1.2 0L4 7.9v10.1h16V7.9z"/></svg>
                <div><small>Email</small><a href="mailto:${SITE.email}">${SITE.email}</a></div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" class="foot-ic"><path d="M12 22s7-6.8 7-12.5A7 7 0 1 0 5 9.5C5 15.2 12 22 12 22z"/><circle cx="12" cy="9.5" r="2.6" fill="#0a2f77"/></svg>
                <div><small>Địa chỉ</small><span>151/11 Dương Vân Nga,<br />Bắc Nha Trang, Khánh Hoà</span></div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" class="foot-ic"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v5.6l4 2.4-1 1.7-5-3V7h2z"/></svg>
                <div><small>Giờ làm việc</small><span>Thứ 2 – Chủ nhật: 7:00 – 19:00</span></div>
              </li>
            </ul>
          </div>

          <form class="contact-form" id="contactForm" novalidate>
            <h2>Gửi yêu cầu báo giá</h2>
            <div class="field">
              <label for="cf-name">Họ và tên <span aria-hidden="true">*</span></label>
              <input id="cf-name" name="name" type="text" required autocomplete="name" placeholder="Nguyễn Văn A" />
            </div>
            <div class="field-row">
              <div class="field">
                <label for="cf-phone">Số điện thoại <span aria-hidden="true">*</span></label>
                <input id="cf-phone" name="phone" type="tel" required autocomplete="tel" placeholder="09xx xxx xxx" />
              </div>
              <div class="field">
                <label for="cf-email">Email</label>
                <input id="cf-email" name="email" type="email" autocomplete="email" placeholder="email@example.com" />
              </div>
            </div>
            <div class="field">
              <label for="cf-service">Dịch vụ quan tâm</label>
              <select id="cf-service" name="service">
                <option value="">— Chọn dịch vụ —</option>
${ALL_SERVICES.map((s) => `                <option value="${esc(s.title)}">${s.title}</option>`).join("\n")}
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div class="field">
              <label for="cf-msg">Nội dung yêu cầu</label>
              <textarea id="cf-msg" name="message" rows="5" placeholder="Diện tích, địa chỉ, thời gian mong muốn..."></textarea>
            </div>
            <p class="form-note" id="cfNote" role="status"></p>
            <button class="btn-solid" type="submit">Gửi yêu cầu</button>
          </form>
        </div>
      </section>

      <section class="map-section">
        <h2 class="map-title">Bản đồ tới văn phòng</h2>
        <div class="map-wrap">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.6009188496914!2d109.19052927466376!3d12.275263729763083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317067f6c64b25b7%3A0x829a9f76f186cbf1!2zMTUxIETGsMahbmcgVsOibiBOZ2EsIELhuq9jIE5oYSBUcmFuZywgS2jDoW5oIEjDsmEgNTcwMDAsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1788018436019!5m2!1sen!2s"
            title="Bản đồ tới văn phòng Top One VN"
            style="border:0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
      </section>`,
  });
}

/* ---------------- Chạy ---------------- */
const out = [];
out.push(write("dich-vu", servicesIndex()));
ALL_SERVICES.forEach((s) => out.push(write(`dich-vu/${s.slug}`, servicePage(s))));
out.push(write("gioi-thieu", aboutPage()));
out.push(write("tin-tuc", newsIndex()));
NEWS.forEach((n) => out.push(write(`tin-tuc/${n.slug}`, newsPage(n))));
out.push(write("cong-tac-vien", jobsPage()));
out.push(write("lien-he", contactPage()));

/* sitemap.xml */
const urls = [
  "/",
  "/gioi-thieu/",
  "/dich-vu/",
  ...ALL_SERVICES.map((s) => `/dich-vu/${s.slug}/`),
  "/tin-tuc/",
  ...NEWS.map((n) => `/tin-tuc/${n.slug}/`),
  "/cong-tac-vien/",
  "/lien-he/",
];
fs.writeFileSync(
  path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE.origin}${u}</loc></url>`).join("\n")}
</urlset>
`
);
fs.writeFileSync(
  path.join(ROOT, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`
);

console.log("Đã sinh " + out.length + " trang:\n");
out.forEach((o) => console.log("  " + o.file.padEnd(46) + o.words + " từ (cả trang)"));

console.log("\nSố từ phần NỘI DUNG bài dịch vụ (yêu cầu >= 1000):");
let fail = 0;
ALL_SERVICES.forEach((s) => {
  const w = countBody(s);
  if (w < 1000) fail++;
  console.log("  " + s.slug.padEnd(24) + String(w).padStart(5) + " từ  " + (w >= 1000 ? "OK" : "!!! THIEU"));
});
console.log("\nsitemap.xml + robots.txt: đã ghi (" + urls.length + " URL)");
if (fail) {
  console.error("\nCÓ " + fail + " BÀI CHƯA ĐỦ 1000 TỪ");
  process.exit(1);
}

/* ---------------- Đồng bộ nav + footer của trang chủ ----------------
   index.html là trang viết tay, nhưng nav và footer phải khớp với các
   trang con, nên build.js thay thẳng hai khối đó. */
const { headerNav, footerHtml } = require("./layout");
const idxPath = path.join(ROOT, "index.html");
let idx = fs.readFileSync(idxPath, "utf8");

const navRe = /<nav class="main-nav" id="mainNav">[\s\S]*?<\/nav>/;
const footRe = /<footer class="site-footer">[\s\S]*?<\/footer>/;
if (!navRe.test(idx)) throw new Error("index.html: không tìm thấy khối nav");
if (!footRe.test(idx)) throw new Error("index.html: không tìm thấy khối footer");

idx = idx.replace(navRe, headerNav("home").trim());
idx = idx.replace(footRe, footerHtml().trim());
fs.writeFileSync(idxPath, idx);
console.log("\nindex.html: đã đồng bộ nav + footer");
