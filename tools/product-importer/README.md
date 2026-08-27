# MT Deals - Product Importer

Đây là công cụ nội bộ giúp bạn tạo nhanh mã Data cho sản phẩm để dán vào file `data/products.js` của website MT Deals.

## 🚀 Tính năng
* **Live Preview:** Giao diện thẻ Card giống 100% website gốc để bạn xem trước.
* **Tự động tính toán:** Tự tính phần trăm (%) giảm giá khi nhập Giá gốc và Giá mới.
* **Tạo Code Format chuẩn:** Chuẩn hóa Object JavaScript theo đúng Schema của dự án.
* **Xuất dữ liệu:** Copy Clipboard hoặc tải xuống dưới dạng `.json`.

## ⚠️ Tại sao nút "Lấy dữ liệu tự động" báo lỗi?
Các trang thương mại điện tử (Shopee, Lazada) có cơ chế **CORS** và Anti-Bot rất mạnh. 
Bạn không thể dùng JavaScript thuần từ Frontend (trình duyệt) để quét dữ liệu từ các trang này. Nếu làm vậy, trình duyệt sẽ tự động chặn kết nối.

### Cách cấu hình để sử dụng tự động:
1. Bạn cần xây dựng một Backend/Serverless Function (VD: Node.js, Vercel Functions).
2. Backend này sẽ nhận Link Shopee, dùng Shopee Affiliate API (hoặc thư viện Scraping như Puppeteer) để lấy dữ liệu.
3. Mở file `tools/product-importer/config.js` điền URL Backend của bạn vào biến `SHOPEE_API_ENDPOINT`.

**Tuyệt đối không hard-code Secret Key vào config.js nếu bạn đang push public lên GitHub!**

## 📝 Cách sử dụng nhập thủ công (Fallback)
Trong thời gian chưa có Backend API, tính năng **Nhập liệu thủ công** là giải pháp an toàn và nhanh chóng nhất:
1. Mở tool lên.
2. Dán link ảnh, nhập tên, giá,...
3. Nhìn thẻ Preview xem đã đẹp chưa.
4. Bấm **Copy Product Data**.
5. Mở file `data/products.js` của website chính, tìm đến mảng `PRODUCTS` và dán ngay dưới sản phẩm cuối cùng.
6. 
