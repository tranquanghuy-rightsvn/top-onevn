# Guideline GAS CMS — toponevn (Top One VN)

Nguồn chốt cho mọi quyết định nghiệp vụ của CMS dự án này. Đọc TOÀN BỘ file này trước khi sửa bất
kỳ file nào trong `gas/`. Theo playbook chung ở skill `free-cms-static-site-pipeline` (không lặp
lại kiến thức chung ở đây, chỉ chốt quyết định riêng của toponevn).

```
I. Đối với tính năng đăng nhập:
  1. Luồng: gửi OTP -> xác nhận -> vào trang Admin (không mật khẩu, không dựa session Google).
  2. Chỉ email đã ĐĂNG KÝ (có trong sheet Users) mới được gửi OTP.
  3. Account chủ của GAS (người deploy) LUÔN hợp lệ/luôn có quyền cao nhất — KHÔNG lưu vào sheet
     Users, KHÔNG hiện trong UI quản lý người dùng. `requestOtp` phải tự cho phép ngoại lệ với
     chính account này (song song với tra sheet Users, không chỉ dựa vào sheet — xem
     gas-backend-patterns.md mục 2, bẫy đã ghi rõ).
  4. Phân quyền 3 cấp: `root` (chủ script, ẩn, ngầm định) > `admin` > `editor`.
     - `root`: toàn quyền, không quản lý được qua CMS (sửa tay Sheet nếu cần đổi ngoại lệ).
     - `admin`: làm mọi việc `editor` làm được, CỘNG THÊM tự thêm/sửa/xoá user cấp `admin` và
       `editor` khác qua CMS (không được đụng dòng `root`), CỘNG THÊM xem/quản lý tab "Quản lý
       liên hệ" (mục VII).
     - `editor`: CRUD tin tức + danh mục tin tức + sửa nội dung dịch vụ. KHÔNG thấy tab "Quản lý
       người dùng" và "Quản lý liên hệ" trong CMS (ẩn ở UI) và server cũng tự chặn nếu gọi thẳng
       hàm quản lý user/liên hệ.
  5. OTP 6 số, sống 10 phút (CacheService), cooldown 60 giây giữa 2 lần xin liên tiếp cùng 1 email,
     tối đa 5 lần nhập sai rồi phải xin mã mới (đếm bằng CacheService, huỷ mã khi vượt ngưỡng — vá
     gotcha "chưa giới hạn số lần nhập sai" nêu ở gas-backend-patterns.md mục 1). Token phiên đăng
     nhập sống 30 ngày, lưu localStorage.
  6. Server luôn tự kiểm tra quyền ở MỌI hành động (`requireRole_`) — không tin việc ẩn nút/tab
     trên giao diện là đủ để bảo mật.

II. Đối với "dịch vụ" (6 trang /dich-vu/<slug>/ có sẵn, KHÔNG thêm/xoá qua CMS lần này):
  1. Các field CÓ ô nhập trên giao diện:
     - Tiêu đề (`title`) — hiện ở menu dropdown, thẻ dịch vụ, breadcrumb.
     - Tiêu đề H1 trang chi tiết (`h1`) — có thể khác `title` (vd thêm "tại Nha Trang").
     - Mô tả ngắn (`short`) — hiện ở thẻ dịch vụ trang chủ/trang danh sách/dropdown menu.
     - Mô tả SEO (`description`) — dùng cho thẻ meta description + JSON-LD, KHÔNG hiện trên trang.
     - Đoạn mở đầu (`lead`) — 1 ô text thường (không TinyMCE, không cần định dạng rich-text), hiện
       nổi bật ngay dưới H1 (class `.prose-lead`), tách riêng khỏi `content`.
     - Ảnh cover (`img`) — upload thay thế, KHÔNG sửa tay filename.
     - Nội dung chính (`content`) — 1 ô TinyMCE duy nhất, xuất HTML (h2/p/ul/strong...), in thẳng
       vào khung `.prose` của trang chi tiết (KHÔNG bao gồm `lead` — 2 field riêng, giữ đúng cách
       hiển thị hiện tại: `lead` nổi bật, `content` là phần thân bài). KHÔNG có ô nhập FAQ — mục II.3.
       Có nút "Chèn ảnh" trên toolbar (chèn nhanh, không qua dialog mặc định của TinyMCE — xem
       gas-backend-patterns.md mục 4): mở thẳng file picker, chèn ảnh tạm ngay (xem được liền),
       upload chạy ngầm rồi tự đổi `src` sang URL thật `/assets/images/<file>` (đường dẫn TUYỆT
       ĐỐI — build.js không viết lại `src` trong content, xem gas-backend-patterns.md mục 11).
       Dùng lại đúng hàm `uploadServiceImage`/`uploadPostImage` (không có hàm upload ảnh nội
       dung riêng). **Không có** figure/caption/alt tự động như dự án xevip (ngoài phạm vi yêu
       cầu ban đầu — `alt` ảnh chèn nhanh để trống, sửa tay trong HTML nếu cần). **Không hỗ trợ
       dán/kéo-thả ảnh trực tiếp** (`paste_data_images` cố ý để mặc định `false`) — chỉ chèn qua
       nút "Chèn ảnh", tránh lưu nhầm base64 khổng lồ vào `data/*.json` nếu dán ảnh ngoài luồng
       upload. `saveService`/`savePost` tự đợi mọi ảnh chèn nhanh upload xong trước khi đọc
       `getContent()` để lưu (tránh lưu nhầm `data:` URL tạm nếu bấm Lưu ngay sau khi vừa chèn).
     - Slug: HIỂN THỊ nhưng khoá cứng (disabled), không có cách nào đổi qua CMS ở dự án này (khác
       các dự án khác trong playbook: ở đây server còn từ chối cả thao tác thêm-mới/xoá — chỉ có
       đúng 1 hàm `saveService` update-only trên 1 trong 6 slug đã tồn tại sẵn).
  2. Field KHÔNG có ô nhập — server tự giữ nguyên lúc Lưu: `slug`, `faq` (không đụng tới, xem
     mục II.3), `updatedAt` (server tự set = giờ hiện tại).
  3. FAQ: giữ nguyên trong dữ liệu, KHÔNG đưa vào CMS lần này (khách xác nhận "không cần quan
     tâm"). `saveService` tuyệt đối không ghi đè field `faq` bằng bất kỳ giá trị nào từ client, dù
     client có gửi lên hay không.
  4. Danh sách trong Admin: GAS đọc thẳng `data/services.json` qua GitHub Contents API mỗi lần mở
     (luôn mới nhất — chỉ 6 bản ghi, tốn quota API không đáng kể).
  5. Ảnh: nén phía client (canvas) trước khi upload — cạnh dài tối đa 1600px, xuất `image/webp`
     chất lượng ~0.85 qua `canvas.toDataURL('image/webp', 0.85)`. Trình duyệt không hỗ trợ encode
     webp sẽ tự rơi về `image/png` (hành vi chuẩn của `toDataURL`, không phải logic tự viết) —
     server đọc đúng mime thật trong chuỗi `data:` để đặt đuôi file khớp nội dung thật (mục III).
     Ảnh RIÊNG 1-1 theo từng dịch vụ (đặt tên tất định theo slug). Không chặn thao tác khi đang
     upload — hiện ảnh tạm ngay bằng `URL.createObjectURL`, upload chạy ngầm.

III. Đối với sửa dịch vụ:
   - Slug bất biến TUYỆT ĐỐI (không chỉ "sau khi lưu lần đầu" như các dự án khác — ở đây LUÔN luôn
     bất biến vì slug đã tồn tại sẵn trước khi có CMS). Input slug luôn hiển thị disabled, không có
     trạng thái "bật lại khi tạo mới" vì dự án này không có tính năng "tạo dịch vụ mới".
   - Ảnh hiển thị lúc sửa dùng URL TUYỆT ĐỐI (`raw.githubusercontent.com/tranquanghuy-rightsvn/
     top-onevn/master/html/assets/images/<file>`), KHÔNG dùng domain thật `toponevn.vn` (site có
     thể chưa deploy bản mới nhất — xem gas-backend-patterns.md mục 11).
   - Đổi ảnh: tên file mới có hậu tố version (`svc-<slug>-<timestamp36>.<đuôi thật>`) để cache-bust
     đúng quy ước hiện tại của site (`/assets/*` cache 1 năm — xem `tools/README.md`). File ảnh cũ
     KHÔNG bị xoá qua API (đỡ 1 API call, ảnh cũ mồ côi vô hại, dung lượng nhỏ) — chỉ field `img`
     trong `data/services.json` trỏ sang file mới.
   - **Đuôi file lấy từ mime THẬT của ảnh đã nén** (đọc từ `data:image/<mime>;base64,...` do
     `canvas.toDataURL('image/webp', ...)` trả về — trình duyệt cũ có thể tự rơi về `png` nếu
     không hỗ trợ encode webp, không suy đoán trước là `.webp`). Vì vậy field `img` của ảnh CMS
     upload luôn lưu **tên file ĐẦY ĐỦ có đuôi** (khác dữ liệu migrate ban đầu, vốn lưu tên
     KHÔNG đuôi vì lúc đó luôn là `.webp`) — `tools/build.js` hàm `img()` đã tự nhận biết cả 2
     dạng (tên có dấu `.` thì dùng nguyên, không có thì tự thêm `.webp`).

IV. Đối với "tin tức" (bài viết) — full CRUD:
  1. Các field CÓ ô nhập:
     - Tiêu đề (`title`).
     - Slug (`slug`) — tự sinh từ tiêu đề (bỏ dấu + gạch ngang), bất biến sau khi đã lưu lần đầu
       (chặn cả server lẫn client — xem gas-backend-patterns.md mục 10). Bài MỚI (chưa từng lưu)
       vẫn sửa slug tự do.
     - Danh mục (`cat`) — dropdown chọn từ `data/news/categories.json` (bắt buộc phải có ít nhất
       1 danh mục trước khi tạo bài; nếu danh sách danh mục rỗng, CMS nhắc tạo danh mục trước).
     - Tiêu đề SEO (`seoTitle`, tuỳ chọn — rơi về `title` nếu để trống).
     - Ngày đăng (`date`) — mặc định hôm nay lúc tạo mới, sửa được tự do (không bất biến).
     - Ảnh cover (`img`) — upload, cơ chế giống mục II.5/III.
     - Mô tả ngắn/excerpt (`excerpt`) — hiện ở thẻ tin tức, trang danh sách, `<meta description>`.
     - Nội dung (`content`) — 1 ô TinyMCE, xuất HTML, in thẳng vào `.prose`. Có nút "Chèn ảnh"
       nhanh giống mục II.1 (dùng `uploadPostImage`).
  2. Field KHÔNG có ô nhập — server tự suy: `dateText` (build script tự format từ `date` lúc
     render, không lưu riêng trong `data/`), `catName` (build script tự tra từ `categories.json`
     theo `cat`, KHÔNG lưu trùng lặp trong post — tránh lệch khi đổi tên danh mục).
  3. Danh sách trong Admin tải từ `data/news/posts.json` (index nhẹ) qua GitHub Contents API mỗi
     lần mở boot; mở 1 bài để sửa mới tải `data/news/<slug>/post.json` đầy đủ.
  4. Ảnh: như mục II.5, tên file `news-<slug>-<timestamp36>.webp`. Ảnh 1-1 theo bài viết.

V. Đối với "danh mục tin tức" — full CRUD, tách hẳn khỏi bài viết (không suy ra từ posts nữa):
  1. Field: Tên danh mục (`name`), Slug (`slug`, tự sinh từ tên, bất biến sau khi lưu lần đầu —
     quyết định giống mục IV.1, vì slug quyết định URL công khai `/tin-tuc/danh-muc/<slug>/`).
  2. Không field nào khác (không mô tả riêng, không ảnh riêng — trang danh mục dùng chung layout
     `categoryPage()` hiện có).
  3. Danh sách tải từ `data/news/categories.json` qua GitHub Contents API mỗi lần mở.

VI. Đối với sửa/xoá tin tức & danh mục:
   - Sửa bài/danh mục: slug bất biến (mục IV.1/V.1) — disable input khi mở bản ghi ĐÃ TỒN TẠI,
     bật lại khi mở form "tạo mới" (form tái sử dụng DOM — nhớ reset trạng thái disabled).
   - Xoá bài viết: xoá `data/news/<slug>/post.json` + gỡ khỏi `data/news/posts.json` + ảnh cover
     (ảnh riêng 1-1, an toàn xoá kèm). Xác nhận trước khi xoá (mục VIII bên dưới).
   - Xoá danh mục: CHẶN nếu còn bài viết nào có `cat` = danh mục đó (server trả lỗi rõ ràng "còn
     N bài viết đang dùng danh mục này, đổi danh mục hoặc xoá bài trước") — không tự động gán lại
     "Chưa phân loại" hay xoá cascade bài viết.

VII. Đối với form liên hệ công khai (`/lien-he/`) — chốt lại 11/09/2026, đổi từ quyết định
   ban đầu ("vẫn dùng mailto:, ngoài phạm vi CMS"):
   - Form `#contactForm` trong `html/lien-he/index.html` (build bởi `tools/build.js`) gọi thẳng
     `doPost` của web app GAS qua `fetch()` (`html/js/main.js`, hằng số `CMS_EXEC_URL`) — KHÔNG
     còn dùng `mailto:`. `Content-Type: text/plain;charset=utf-8` là cố ý (né CORS preflight,
     GAS không xử lý được OPTIONS — xem gas-backend-patterns.md mục 6).
   - Field: `name`, `phone` (bắt buộc), `email`, `service`, `message` (tuỳ chọn) + `_hp`
     (honeypot, input ẩn bằng `style` inline ngay trên thẻ — CỐ Ý không dùng class CSS ở file
     riêng, tránh đúng bẫy "rule CSS ẩn honeypot bị mất khi merge" — gotcha #27).
   - `_hp` có giá trị → server âm thầm trả `{ok:true}`, KHÔNG lưu, KHÔNG gửi mail, không báo lỗi.
   - Rate-limit: 20 giây/lần theo số điện thoại (`CacheService`).
   - **CÓ lưu vào Sheet `Contacts`** — chốt lại LẦN 2 (11/09/2026, cùng ngày, đổi tiếp quyết định
     "KHÔNG lưu Sheet" ở trên vì phát sinh yêu cầu tab "Quản lý liên hệ") — cột:
     `id, createdAt, name, phone, email, service, message, status` (`status`: `"Mới"` |
     `"Đã xử lý"`, mặc định `"Mới"`). Sheet tự tạo LƯỜI (lazy, lúc lần đầu có người submit hoặc
     mở tab quản lý — không tạo sẵn lúc bootstrap Spreadsheet như `Users`, vì tính năng thêm sau
     khi Spreadsheet nhiều dự án đã tồn tại).
   - **Ghi Sheet LÀ NGUỒN CHÍNH, gửi mail là BEST-EFFORT sau đó** (khác quyết định lần 1 ở trên —
     giờ đã có nơi lưu dự phòng nên không cần trả lỗi thật cho khách nữa): ghi Sheet xong luôn
     trả `{ok:true}`; `MailApp.sendEmail` lỗi (chưa cấu hình `NOTIFY_EMAIL`, quota Gmail...) chỉ
     `Logger.log`, KHÔNG throw — khớp đúng cách xevip làm.
   - **Quản lý trong Admin** (tab "Quản lý liên hệ", xem thanh điều hướng ở mục VIII) — CHỈ
     `admin`/`root` (giống mục I.4 quản lý người dùng): xem danh sách (mới nhất lên đầu), đổi
     trạng thái Mới ⇄ Đã xử lý, xoá. `editor` không thấy tab này (ẩn client + chặn server).
     Danh sách KHÔNG nằm trong `boot()` (giống `users`, xem mục IX) — tải riêng lúc mở tab.
   - **Email thông báo dùng template HTML riêng** (`gas/email.html`, render qua
     `HtmlService.createTemplateFromFile` + scriptlet `<?= ?>` — BẮT BUỘC dùng bản escaped `<?=
     ?>`, không dùng `<?!= ?>`, vì mọi field đều là dữ liệu công khai chưa xác thực, tránh HTML/
     script injection vào email nếu ai đó cố tình điền thẻ HTML vào form): logo Top One VN
     (`https://toponevn.vn/assets/images/logo-email.png`, URL tuyệt đối — ảnh email luôn cần
     domain thật). **Dùng bản `.png` riêng cho email, KHÔNG dùng `logo.webp` của site** (chốt lại
     11/09/2026, sau khi logo hiện xấu/vỡ) — nhiều ứng dụng mail (Outlook desktop cũ...) không
     hiển thị được webp; ảnh nằm ở `html/assets/images/logo-email.png` (nén từ
     `source-images/logo.png` bằng `sips`, 200×128px, ~30KB), có `width`/`height` cố định trên
     thẻ `<img>` (không chỉ CSS) để hiển thị đúng kể cả khi ứng dụng mail cắt bớt `<style>`. Khối
     logo trình bày ĐÚNG như header thật của site (`tools/layout.js`/`html/styles/style.css`
     `.brand`/`.brand-name`/`.brand-tag`: icon + chữ "Top One VN" navy `#06276b`/cam `#ef4a13`
     trên nền trắng, dùng `<table>` cho hàng logo+chữ để tương thích Outlook) — không tự bịa bố
     cục/màu khác cho email. Các trường liên hệ trình bày dạng thẻ/card có CSS (inline + `<style>`
     trong head, Gmail hỗ trợ tốt — đây là kênh nhận mail chính), nút "Gọi lại cho khách" (`tel:`).
     Tiêu đề cố định: `[ToponeVN] Liên hệ mới`. `MailApp.sendEmail` truyền cả `body` (thuần văn,
     fallback cho ứng dụng mail không đọc được HTML) lẫn `htmlBody`.
   - Thông báo: gửi email qua `MailApp` tới Script Property `NOTIFY_EMAIL` — **bắt buộc để CÓ
     thông báo** (không có mail nếu thiếu, nhưng liên hệ vẫn lưu Sheet bình thường — xem trên),
     không có địa chỉ mặc định hard-code trong code (xem mục XI). Dùng CHUNG quota Gmail 100
     mail/ngày với OTP đăng nhập — nếu lượng liên hệ tăng cao chạm mốc đó, cân nhắc tách account
     Gmail riêng cho OTP (xem hosting-and-quotas.md).
   - Không có form đặt hàng/đặt lịch (mục VI của template gốc — không áp dụng cho dự án này).

VIII. Một số lưu ý UX chung (áp dụng cho MỌI thao tác Lưu/Xoá/Đổi trạng thái trong Admin):
   - 2 loại pop-up riêng biệt: XÁC NHẬN (Huỷ/Xoá, hỏi trước khi xử lý) và THÔNG BÁO kết quả (1 nút
     Đóng, không tự ẩn) — không `alert()`/`confirm()` native, không toast.
   - Mọi nút async: disable + spinner trong lúc chờ, tự phục hồi kể cả khi lỗi (`finally`).
   - Sau Lưu/Xoá thành công: danh sách trong Admin tự cập nhật ngay, không đợi F5; quay lại đúng
     màn danh sách của entity đó (danh sách bài viết / danh sách danh mục / danh sách dịch vụ /
     danh sách user).
   - Chuyển tab trong Admin chỉ là hiệu ứng giao diện — không tải lại toàn trang.
   - Đăng nhập lần đầu: 1 lượt `boot(token)` duy nhất lấy hết dữ liệu cần. Lần vào Admin sau: hiện
     ngay từ cache localStorage (stale-while-revalidate), rồi âm thầm làm mới.
   - Mọi key localStorage (TRỪ token đăng nhập) mang hậu tố `CLIENT_BUILD` (hằng số phiên bản
     client, bump mỗi lần sửa `app.html`/`js.html`), kèm hàm tự dọn key khác phiên bản lúc tải
     script.

IX. Kiến trúc lưu trữ (nơi gì nằm ở đâu, ai đọc/ghi):
   - Google Sheet `TopOneVN CMS Data` (tự tạo lần đầu chạy, ID lưu vào Script Property
     `SPREADSHEET_ID`) — 2 sheet:
     - `Users` — cột: `email`, `role` (`admin` | `editor`).
     - `Contacts` — cột: `id`, `createdAt`, `name`, `phone`, `email`, `service`, `message`,
       `status` (`"Mới"` | `"Đã xử lý"`). Tự tạo LƯỜI (lazy) lúc lần đầu cần tới (form submit
       hoặc mở tab quản lý), không tạo sẵn lúc bootstrap Spreadsheet như `Users` — xem mục VII.
   - GitHub (qua Contents API, repo `tranquanghuy-rightsvn/top-onevn`, nhánh `master`) — đường dẫn
     cố định:
     - `data/services.json` — mảng 6 bản ghi dịch vụ (field liệt kê ở mục II.1-3).
     - `data/news/posts.json` — index nhẹ mọi bài viết (field: `slug`, `title`, `cat`, `date`,
       `img`, `excerpt`, `updatedAt`).
     - `data/news/<slug>/post.json` — nội dung đầy đủ 1 bài (thêm `seoTitle`, `content`).
     - `data/news/categories.json` — mảng `{slug, name}`.
     - `html/assets/images/<file>.webp` — ảnh cover dịch vụ/tin tức, ghi thẳng vào vị trí site
       thật (KHÔNG qua `data/`, tránh duplicate — xem architecture.md).
   - File "danh sách tổng" (`data/services.json`, `data/news/posts.json`,
     `data/news/categories.json`) LUÔN ghi SAU CÙNG trong 1 thao tác Lưu/Xoá — đây là 3 file
     trigger CI build (xem `.github/workflows/build.yml`).
   - Độ trễ thực tế từ lúc Lưu tới lúc thấy trên site thật: ~1-2 phút (GitHub Actions build +
     commit `html/` + Cloudflare Pages tự deploy commit mới).

X. Checklist bug đã thực sự gặp ở dự án này (cập nhật dần trong lúc code):
   - **`tools/build.js` hàm `img()` hard-code đuôi `.webp`** — phát hiện lúc thiết kế
     `uploadServiceImage`/`uploadPostImage`: `canvas.toDataURL('image/webp', ...)` có thể tự
     rơi về `image/png` trên trình duyệt không hỗ trợ encode webp (hành vi chuẩn của Canvas
     API), nhưng `img()` cũ luôn ghép `.webp` bất kể đuôi thật — ảnh CMS upload trong trường
     hợp đó sẽ 404 trên site thật dù đã lưu đúng. Vá: `img()` nhận biết tên có đuôi (CMS
     upload, dùng nguyên) hay không có đuôi (dữ liệu migrate ban đầu, tự thêm `.webp`); `Code.js`
     đọc đúng mime thật từ chuỗi `data:` để đặt tên file khớp nội dung thật (mục II.5/III).
     Đã test bằng `tools/build.js` chạy 2 lần liên tiếp + hand-trace `saveService`/`savePost`
     qua harness giả lập GitHub API — không phát sinh lệch.
   - **`savePost` xác định "đang sửa bài nào" bằng cách tra `index` theo `slug` (giá trị MỚI
     gửi lên) thay vì theo `origSlug`** — nếu client gửi `slug` khác `origSlug` (bypass UI,
     input `slug` bình thường bị disable khi sửa bài đã có), tra theo `slug` mới sẽ không thấy
     bản ghi cũ → `isNew` sai thành `true` → toàn bộ check "chặn đổi URL sau khi lưu" (mục
     IV.1) bị bỏ qua, tạo ra bài trùng nội dung ở slug mới thay vì bị chặn, bài cũ ở `origSlug`
     bị bỏ mồ côi. Vá: tra `existingIdx` theo `origSlug || slug`, rồi mới so `slug !==
     lookupSlug` để chặn. Không tái hiện được qua UI bình thường (client luôn giữ `slug ===
     origSlug` khi sửa) nhưng vi phạm đúng nguyên tắc "server không được tin việc ẩn/khoá input
     ở client là đủ" — sửa ở `Code.js` hàm `savePost`.
   - **`html/admin/index.html` treo mãi ở "Đang mở trang quản trị..." (bộ đếm 12s không thấy
     kích hoạt)** — báo lỗi thật 11/09/2026 khi Đại ca test (tài khoản Google Workspace tổ chức
     `mynavitechtus.com`). Lúc debug, em (Claude) từng nghi do 1 spurious `load` event của
     `<iframe>` rỗng (không có `src`) và đổi sang tự tạo iframe bằng `document.createElement` —
     **RÚT LẠI thay đổi đó**: không có bằng chứng chắc chắn (công cụ trình duyệt tự động dùng
     để test bị chặn đọc nội dung trang do Google, kết quả không đáng tin cậy), và quan trọng
     hơn là đã tự ý lệch khỏi cấu trúc/logic gốc đã kiểm chứng chạy thật ở dự án xevip
     (`xevip/html/admin/index.html`) mà không xin phép. Quyết định đúng (chốt bởi Đại ca
     11/09/2026): **`html/admin/index.html` phải giống HỆT cấu trúc + logic file tương ứng của
     xevip, chỉ khác giá trị riêng của dự án** (`CMS_URL`, tiêu đề, icon, màu thương hiệu) — copy
     nguyên file xevip rồi chỉ đổi đúng các giá trị đó, không "cải tiến" thêm gì khi chưa có bằng
     chứng cụ thể là cần thiết. Nếu `/admin/` vẫn treo sau khi đã giống hệt xevip: đó là giới hạn
     thật của việc nhúng Apps Script qua iframe (khác nhau tuỳ trạng thái đăng nhập Google/chặn
     cookie bên thứ 3 của từng trình duyệt) — dùng `/admin-gas/` (mở thẳng, không nhúng) làm
     đường vào chính, không cố vá thêm `/admin/` nếu không có bằng chứng rõ nguyên nhân.

XI. Script Properties (Project Settings > Script Properties trên script.google.com):
   - `GITHUB_TOKEN` — Fine-grained PAT, chỉ quyền Contents: Read and write, giới hạn đúng repo
     `top-onevn`. Bắt buộc, không tự tạo được.
   - `GITHUB_OWNER` = `tranquanghuy-rightsvn`.
   - `GITHUB_REPO` = `top-onevn`.
   - `GITHUB_BRANCH` = `master`.
   - `SPREADSHEET_ID` — KHÔNG tự điền, code tự tạo Sheet lần đầu chạy và tự lưu lại giá trị này.
   - `NOTIFY_EMAIL` — bắt buộc nếu muốn form liên hệ gửi được mail (xem mục VII); không có giá
     trị mặc định hard-code trong code — chủ dự án tự khai (chốt 11/09/2026).
```

## Ghi chú triển khai riêng của toponevn (khác mặc định playbook)

- **Build script dùng Node.js (`tools/build.js`), không phải Python** — đây là quy ước sẵn có của
  repo trước khi có CMS (không dependency ngoài), giữ nguyên thay vì viết lại bằng
  `scripts/build.py` như 2 dự án mẫu trong skill.
- **Ảnh KHÔNG nằm trong thư mục con theo slug** (`html/<loại>/<slug>/images/`) như 2 dự án mẫu —
  giữ đúng convention phẳng sẵn có của toponevn: mọi ảnh nằm chung `html/assets/images/`, phân
  biệt nhau bằng tiền tố (`svc-`/`news-`) + slug + hậu tố version trong tên file.
- **Deploy site: Cloudflare Pages nối Git qua dashboard** (không phải Workers Static Assets qua
  `wrangler.toml` như 2 dự án mẫu) — CI chỉ cần build + commit + push `html/`, không cần bước
  deploy riêng, không cần `wrangler.toml`.
- **TinyMCE tự host tại `https://toponevn.vn/vendor/tinymce/`, KHÔNG dùng CDN** — chốt
  11/09/2026 sau khi CDN (`cdn.jsdelivr.net`) không tải được lúc trang admin bị nhúng iframe
  trong `/admin/` (chặn ở tầng sandbox của `script.google.com` khi nhúng cross-origin; tham
  khảo cách vá đã dùng ở dự án xevip, `xevip/GAS.md` mục II.1). File nằm trong repo site
  (`html/vendor/tinymce/`, bản 6.8.5, copy nguyên từ xevip — theme silver, model dom, icon
  default, skin oxide, plugin lists/link/autolink/table/code), cache dài ở `html/_headers`.
  Nhân tiện phát hiện + vá thêm 1 bug: `tinymce.init` khai `toolbar` có `bullist`/`numlist`
  nhưng thiếu hẳn plugin `lists` trong `plugins` — 2 nút đó sẽ không hoạt động dù không báo
  lỗi gì; đã thêm `lists` vào cả 2 chỗ init (`gas/js.html`).
  ⚠️ **Thứ tự triển khai bắt buộc**: deploy site (để `/vendor/tinymce/` sống) TRƯỚC, rồi mới
  `clasp push` CMS — làm ngược là admin mất hẳn trình soạn thảo.
- **URL web app đã deploy**: `https://script.google.com/macros/s/AKfycbxPCSXahsjvkQ3sYYXDNWpk2MEGhiONTq2WPJstFrIYf7-PzZgPhDvxCt3ytll7hZeMZA/exec`
  — đã dán vào `html/admin/index.html`, `html/admin-gas/index.html` (nhúng CMS) và
  `html/js/main.js` (hằng số `CMS_EXEC_URL`, form liên hệ gọi `doPost`). Đổi deployment
  (New deployment, không phải New version) sẽ sinh URL khác — phải cập nhật lại CẢ 3 nơi này.
