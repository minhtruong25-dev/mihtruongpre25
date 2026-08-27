# MT Deals Product Importer V2 (Manual Edition)

Đây là công cụ nội bộ hỗ trợ bạn nhập liệu và tạo mã dữ liệu sản phẩm (Product Object) siêu nhanh, chuẩn format để dán vào website MT Deals.

## 🌟 Chức năng hiện tại
Vì lý do bảo mật và giới hạn CORS của trình duyệt, tính năng tự động lấy dữ liệu từ Shopee đã bị loại bỏ. Hiện tại, công cụ hoạt động theo cơ chế **Nhập liệu thủ công (Manual Input)** cực kỳ mạnh mẽ:

1. **Nhập thủ công:** Điền Tên, URL Ảnh, Giá, Đánh giá,...
2. **Tự động tính toán:** Chỉ cần nhập Giá Bán và Giá Cũ, hệ thống tự động tính ra số `% Giảm giá`.
3. **Live Preview Realtime:** Hiển thị thẻ Card mẫu giống hệt với giao diện trang chủ MT Deals.
4. **Validation An toàn:** Tự động kiểm tra dữ liệu bắt buộc (Tên, Ảnh, Giá). Chỉ cho phép Copy nếu dữ liệu đã hợp lệ.
5. **Autosave (Lưu nháp):** Dữ liệu đang gõ sẽ được tự động lưu vào bộ nhớ trình duyệt (LocalStorage). Không sợ mất dữ liệu khi lỡ F5 trang.
6. **Code Export:** Xuất thẳng ra Object JavaScript chuẩn (không có ngoặc kép ở key). Nhấn Copy và dán thẳng vào mảng `PRODUCTS` trong file `data/products.js` của website chính.
7. **Tải JSON:** Hỗ trợ lưu trữ sản phẩm thành file `.json` về máy tính.

## 🛠 Cách sử dụng
1. Truy cập trang Importer trên GitHub Pages của bạn.
2. Nhập thông tin vào Form.
3. Kiểm tra thẻ Preview bên cột phải xem đã ưng ý chưa.
4. Khi chữ "Dữ liệu hợp lệ" màu xanh hiện lên, bấm **Copy Product Data**.
5. Mở file `data/products.js` của website MT Deals.
6. Dán đoạn code vừa copy vào bên trong mảng `const PRODUCTS = [ ... ];`
7. Commit lên GitHub là xong!

## ⚠️ Lưu ý
* **Không sửa đổi Cấu trúc:** Cấu trúc Output đã được thiết kế đồng bộ 100% với Frontend của trang MT Deals.
* Công cụ này hoạt động hoàn toàn bằng HTML/CSS/Vanilla JS thuần túy, không cần cài đặt Node.js hay bất kỳ Framework nào để chạy.
* 
