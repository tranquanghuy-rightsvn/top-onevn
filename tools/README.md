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

| Muốn sửa | Sửa file |
|---|---|
| Menu, header, footer, thẻ SEO | `tools/layout.js` |
| 3 bài dịch vụ đầu | `tools/content-services.js` |
| 3 bài dịch vụ sau | `tools/content-services2.js` |
| 4 bài tin tức | `tools/content-news.js` |
| Trang giới thiệu / cộng tác viên / liên hệ | `tools/build.js` (cuối file) |

Thêm một dịch vụ mới: thêm mục vào mảng `SERVICES` trong `tools/layout.js`
(cho dropdown) **và** thêm bài viết tương ứng vào một trong hai file
`content-services*.js`. Hai nơi phải trùng `slug`.

Sau khi sửa, chạy lại `node tools/build.js` rồi commit cả `tools/` lẫn `html/`.

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

Thay ảnh: đặt file mới vào `html/assets/images/` rồi đổi trường `img`
trong `tools/layout.js` (mảng `SERVICES`) và file nội dung tương ứng.
Nhớ **đổi tên file** thay vì ghi đè — `/assets/*` đang cache 1 năm.

Riêng `hero.webp` (ảnh lớn trang chủ) giữ tỉ lệ khác vì nằm trong bố cục
hero, không dùng khung 3:2.

## Google Analytics

Mã GA4 (`G-EP93RGYSQR`) đặt trong `headHtml()` ở `tools/layout.js` nên
mọi trang đều có, kể cả `index.html` (build tự đồng bộ phần `<head>`).
Đổi mã đo hoặc gỡ bỏ thì sửa đúng một chỗ đó rồi chạy lại build.
