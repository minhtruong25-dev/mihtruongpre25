// ======================================================
// ⚙️ IMPORTER CONFIGURATION
// ======================================================
// ⚠️ CẢNH BÁO BẢO MẬT QUAN TRỌNG:
// Tuyệt đối KHÔNG đưa API Key, Secret Key thật của bạn lên GitHub.
// Nếu bạn public repository, kẻ gian có thể đánh cắp API Key của bạn.
// Tốt nhất chỉ chạy file này trên Localhost (máy tính cá nhân) 
// hoặc dùng biến môi trường (Environment Variables) qua Backend.
// ======================================================

const IMPORTER_CONFIG = {
    // Nếu bạn có một server trung gian (Backend) để fetch Shopee API tránh CORS
    SHOPEE_API_ENDPOINT: "", 
    
    // ĐỂ TRỐNG NẾU ĐƯA LÊN GITHUB PUBLIC
    SHOPEE_API_KEY: "",
    SHOPEE_API_SECRET: "",
    AFFILIATE_ID: "",

    // Danh mục mặc định để hiển thị trong form chọn
    CATEGORIES: [
        { id: "cong-nghe", name: "💻 Công nghệ" },
        { id: "gaming", name: "🎮 Gaming" },
        { id: "hoc-tap", name: "📚 Học tập" },
        { id: "gia-dung", name: "🏠 Gia dụng" },
        { id: "thoi-trang", name: "👕 Thời trang" }
    ]
};
