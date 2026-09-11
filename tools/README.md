# tools/ — bộ sinh trang tĩnh

Các trang con (`/dich-vu/`, `/tin-tuc/`, `/gioi-thieu/`, `/cong-tac-vien/`, `/lien-he/`)
**không sửa trực tiếp trong `html/`** — chúng được sinh ra từ đây.

## Chạy

```bash
node tools/build.js
```

Lệnh này ghi lại toàn bộ trang con trong `html/`, sinh `sitemap.xml` + `robots.txt`,
và đồng bộ khối `<nav>` + `<footer>` của `html/index.html`. Nếu một bài dịch vụ
dưới 1000 từ, lệnh sẽ báo lỗi và thoát với mã 1.

## Sửa nội dung ở đâu

Kể từ khi có CMS (xem `GAS.md` ở gốc repo), **nội dung 6 dịch vụ + toàn bộ bài viết/danh mục
tin tức sửa qua trang quản trị `/admin/` (Google Apps Script), không sửa tay JS nữa** — CMS ghi
thẳng vào `data/services.json` + `data/news/*.json` qua GitHub Contents API, GitHub Actions tự
chạy `node tools/build.js` và commit lại `html/`.

| Muốn sửa | Sửa ở đâu |
|---|---|
| Nội dung/ảnh 6 dịch vụ, bài viết + danh mục tin tức, user CMS | Trang quản trị `/admin/` (không sửa tay `data/*.json`) |
| Menu, header, footer, thẻ SEO, **thứ tự/danh sách 6 dịch vụ** | `tools/layout.js` (mảng `SERVICES` — chỉ còn giữ `slug`, không thêm/xoá qua CMS) |
| Trang giới thiệu / cộng tác viên / liên hệ | `tools/build.js` (cuối file) |
| 3 khối trên trang chủ (dịch vụ, lý do, quy trình) | `tools/content-home.js` |

`data/services.json` luôn đúng 6 bản ghi, khớp `slug` với `tools/layout.js` (`build.js` tự kiểm
tra khớp, thoát mã 1 nếu lệch) — **không thêm/xoá dịch vụ qua CMS**, muốn thêm dịch vụ thứ 7 phải
sửa tay cả 2 nơi rồi chạy lại build (ngoài phạm vi CMS hiện tại).

Sau khi sửa qua CMS: đợi ~1-2 phút (GitHub Actions build + Cloudflare Pages tự deploy). Sau khi
sửa tay `tools/layout.js`/`tools/content-home.js`/`tools/build.js`: chạy lại `node tools/build.js`
rồi commit cả `tools/` lẫn `html/` (và `data/` nếu có đổi) như trước.

## Lưu ý về form liên hệ

Đây là site tĩnh, không có backend. Form ở `/lien-he/` hiện **soạn sẵn nội dung
rồi mở ứng dụng email** của khách (`mailto:`). Cách này chạy được ngay nhưng
phụ thuộc vào việc máy khách có cấu hình email — trên điện thoại thì ổn,
trên máy tính dùng webmail có thể không mở được.

Muốn nhận thẳng vào hộp thư, chọn một trong hai:

- **Formspree / Web3Forms** — đăng ký lấy endpoint, đổi `<form>` thành
  `method="post" action="<endpoint>"` và bỏ hàm `initContactForm` trong
  `html/js/main.js`. Không cần đổi hạ tầng.
- **Cloudflare Worker** — viết một route `POST /api/contact` gửi mail qua
  Email Routing hoặc Resend. Cần chuyển project từ static-assets thuần
  sang Worker có script.

## Ảnh

Ảnh cover của dịch vụ (`svc-*.webp`) và tin tức (`news-*.webp`) đều là
**1200×800, tỉ lệ 3:2**, tải từ Unsplash (giấy phép cho dùng thương mại,
không cần ghi nguồn). CSS dùng `aspect-ratio: 3 / 2` nên ảnh mới thay vào
phải giữ đúng tỉ lệ này, nếu không sẽ bị `object-fit: cover` cắt bớt.

Ảnh cover dịch vụ/tin tức giờ đổi qua CMS (`/admin/`) — CMS tự nén, đặt tên file mới có hậu tố
version (không ghi đè, đúng convention cache 1 năm ở trên) và ghi thẳng vào
`html/assets/images/`. Ảnh khác (logo, hero, trang giới thiệu...) vẫn sửa tay: đặt file mới vào
`html/assets/images/` rồi đổi đường dẫn ở nơi dùng (`tools/layout.js`/`tools/build.js`), nhớ
**đổi tên file** thay vì ghi đè.

Riêng `hero.webp` (ảnh lớn trang chủ) giữ tỉ lệ khác vì nằm trong bố cục
hero, không dùng khung 3:2.

## Google Analytics

Mã GA4 (`G-EP93RGYSQR`) đặt trong `headHtml()` ở `tools/layout.js` nên
mọi trang đều có, kể cả `index.html` (build tự đồng bộ phần `<head>`).
Đổi mã đo hoặc gỡ bỏ thì sửa đúng một chỗ đó rồi chạy lại build.

## Vì sao trang chủ không còn render bằng JS

Bản đầu tiên để 3 div rỗng (`#serviceGrid`, `#whyGrid`, `#processGrid`) rồi
nhờ `main.js` đổ nội dung vào lúc chạy. Lý do dễ hiểu: hồi đó dự án chưa có
build step nên nơi duy nhất chạy được vòng lặp là trình duyệt.

Hệ quả là HTML thô thiếu 200 chữ và 6 link nội bộ — bot không chạy JS sẽ
không thấy. Nay `build.js` in sẵn 3 khối đó vào `index.html` giữa cặp marker
`<!--gen:services-->…<!--/gen:services-->`, nên bật hay tắt JS đều cho kết
quả giống nhau.

`main.js` giờ chỉ còn phần TƯƠNG TÁC (menu, carousel, form, reveal).
**Đừng thêm code render nội dung vào đó nữa** — muốn sửa nội dung 3 khối thì
sửa `tools/content-home.js` rồi chạy lại build.
