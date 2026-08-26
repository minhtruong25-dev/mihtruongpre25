// ======================================================
// 🛒 PRODUCT DATA
// ======================================================
// Dán link affiliate Shopee thật của bạn vào thuộc tính "affiliateUrl".
// Nếu chưa có link, hãy để rỗng "".
// ======================================================

const PRODUCTS = [
    {
        id: "prod-001",
        featured: true,
        name: "[DEMO] Bàn phím cơ Custom Không Dây",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
        price: 450000,
        oldPrice: 600000,
        discount: 25,
        rating: 4.9,
        reviews: 120,
        category: "cong-nghe",
        badge: "HOT",
        description: "Gõ siêu êm, có LED RGB, layout 75% gọn gàng. Phù hợp cho coder và học sinh sinh viên làm việc đêm không sợ ồn.",
        tags: ["ban phim", "setup", "cong nghe"],
        affiliateUrl: "" // ✏️ Dán link Affiliate vào đây
    },
    {
        id: "prod-002",
        featured: false,
        name: "[DEMO] Chuột Gaming Silent",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
        price: 150000,
        oldPrice: 250000,
        discount: 40,
        rating: 4.8,
        reviews: 340,
        category: "gaming",
        badge: "TOP",
        description: "Độ trễ cực thấp, click không tiếng ồn, pin sạc Type-C dùng được cả tháng.",
        tags: ["chuot", "gaming", "silent"],
        affiliateUrl: "" 
    },
    {
        id: "prod-003",
        featured: false,
        name: "[DEMO] Giá Đỡ Điện Thoại/Tablet Hợp Kim",
        image: "https://images.unsplash.com/photo-1586521995568-39abaa0c2311?w=500",
        price: 55000,
        oldPrice: 100000,
        discount: 45,
        rating: 5.0,
        reviews: 890,
        category: "hoc-tap",
        badge: "SALE",
        description: "Gấp gọn dễ dàng, chất liệu nhôm nguyên khối chắc chắn, tản nhiệt tốt cho thiết bị.",
        tags: ["gia do", "phu kien", "hoc tap"],
        affiliateUrl: "" 
    },
    {
        id: "prod-004",
        featured: false,
        name: "[DEMO] Đèn LED Bàn Học Chống Cận",
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0188?w=500",
        price: 120000,
        oldPrice: null,
        discount: 0,
        rating: 4.8,
        reviews: 156,
        category: "gia-dung",
        badge: "",
        description: "3 chế độ sáng, bảo vệ mắt. Thích hợp để học tập và làm việc buổi tối.",
        tags: ["den", "hoc tap", "gia dung"],
        affiliateUrl: "" 
    }
];
