// ==========================================================================
// 🚀 QUICK EDIT - CẤU HÌNH WEBSITE
// Chào bạn, đây là nơi duy nhất bạn cần quan tâm để sửa nội dung website.
// ==========================================================================

// ✏️ EDIT HERE 1: THÔNG TIN WEBSITE & HERO SECTION
const SITE_CONFIG = {
    siteName: "MT Deals",
    authorName: "Minh Trường",
    username: "@minhtruong",
    // Link ảnh Avatar của bạn
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300", 
    bio: "Tổng hợp các sản phẩm công nghệ nổi bật, deal hấp dẫn và những lựa chọn được đánh giá cao trên Shopee.",
    
    // Phần chữ to đùng trên cùng
    heroTitle: "Khám phá sản phẩm đáng mua",
    heroDesc: "Những sản phẩm hữu ích cho học tập, làm việc, giải trí và cuộc sống.",
    heroButton: "🔥 Xem deal hôm nay",

    // Link mạng xã hội (Để trống "" nếu không dùng)
    socials: {
        tiktok: "https://tiktok.com",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        youtube: "" 
    }
};

// ✏️ EDIT HERE 2: DANH MỤC
// Bạn có thể thêm bớt danh mục ở đây. ID dùng để lọc sản phẩm bên dưới.
const CATEGORIES = [
    { id: "all", name: "🔥 Tất cả" },
    { id: "cong-nghe", name: "💻 Công nghệ" },
    { id: "gaming", name: "🎮 Gaming" },
    { id: "gia-dung", name: "🏠 Gia dụng" },
    { id: "thoi-trang", name: "👕 Thời trang" },
    { id: "hoc-tap", name: "📚 Học tập" }
];

// ✏️ EDIT HERE 3: DỮ LIỆU SẢN PHẨM
// Copy 1 object {...} để thêm 1 sản phẩm.
// Chú ý dán link Shopee của bạn vào chỗ "affiliateUrl".
const PRODUCTS = [
    {
        id: "p1",
        featured: true, // Đổi thành true để làm sản phẩm nổi bật (Nên chọn 1 cái)
        name: "[DEMO] Bàn phím cơ Custom Trục Đỏ - Gõ siêu êm, layout 75%",
        description: "Bàn phím cơ custom gõ cực êm, có LED RGB, kết nối 3 mode (Bluetooth, 2.4G, Type C). Phù hợp cho dân văn phòng và coder đêm không sợ ồn.",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
        price: "450.000đ",
        oldPrice: "600.000đ",
        discount: "-25%",
        badge: ["🔥 HOT", "NEW"],
        rating: 4.9,
        reviews: 1250,
        category: "cong-nghe",
        // 👇 Dán link affiliate Shopee thật vào đây
        affiliateUrl: "YOUR_AFFILIATE_LINK_HERE" 
    },
    {
        id: "p2",
        featured: false,
        name: "[DEMO] Chuột Gaming Không Dây Siêu Nhẹ",
        description: "Độ trễ thấp, click không tiếng ồn, pin sạc Type-C dùng cả tháng.",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
        price: "150.000đ",
        oldPrice: "250.000đ",
        discount: "-40%",
        badge: ["BEST"],
        rating: 4.8,
        reviews: 840,
        category: "gaming",
        affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
    },
    {
        id: "p3",
        featured: false,
        name: "[DEMO] Tai nghe Bluetooth Chống Ồn Chủ Động ANC",
        description: "Pin 24h, đệm tai bọc da êm ái, âm bass cực căng.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        price: "299.000đ",
        oldPrice: "499.000đ",
        discount: "-40%",
        badge: [],
        rating: 4.7,
        reviews: 412,
        category: "cong-nghe",
        affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
    },
    {
        id: "p4",
        featured: false,
        name: "[DEMO] Giá Đỡ Điện Thoại/Tablet Hợp Kim Nhôm",
        description: "Gấp gọn dễ dàng bỏ balo, chất liệu nhôm nguyên khối chắc chắn.",
        image: "https://images.unsplash.com/photo-1586521995568-39abaa0c2311?w=500",
        price: "55.000đ",
        oldPrice: "100.000đ",
        discount: "-45%",
        badge: ["SALE"],
        rating: 5.0,
        reviews: 1890,
        category: "hoc-tap",
        affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
    }
];

// ==========================================================================
// 🛑 LOGIC WEBSITE - KHÔNG CẦN CHỈNH SỬA BÊN DƯỚI NÀY
// Kiến trúc Service Layer đảm bảo code an toàn, không lỗi.
// ==========================================================================

class AffiliateApp {
    constructor() {
        this.products = PRODUCTS;
        this.categories = CATEGORIES;
        this.config = SITE_CONFIG;
        
        this.state = {
            category: 'all',
            search: '',
            sort: 'featured'
        };

        this.init();
    }

    // 1. Khởi tạo Website
    init() {
        this.applyConfig();
        this.renderCategories();
        this.renderProducts();
        this.setupEventListeners();
        this.initTheme();
    }

    // 2. Gán dữ liệu vào HTML an toàn
    applyConfig() {
        document.title = `${this.config.siteName} — Khám phá sản phẩm đáng mua`;
        
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setText('nav-brand-name', this.config.logoText || this.config.siteName);
        setText('profile-name', this.config.siteName);
        setText('profile-username', this.config.username);
        setText('profile-bio', this.config.bio);
        setText('hero-title', this.config.heroTitle);
        setText('hero-desc', this.config.heroDesc);
        setText('hero-cta-btn', this.config.heroButton);
        setText('hero-badge-text', `Curated by ${this.config.authorName}`);
        setText('footer-brand-name', this.config.siteName);
        setText('footer-bio', this.config.bio);
        setText('copyright-name', this.config.siteName);
        setText('current-year', new Date().getFullYear());

        const avatarEl = document.getElementById('profile-avatar');
        const heroAvatarEl = document.getElementById('hero-avatar');
        if (avatarEl) avatarEl.src = this.config.avatar;
        if (heroAvatarEl) heroAvatarEl.src = this.config.avatar;

        // Render Socials
        const socialContainer = document.getElementById('social-container');
        if (socialContainer) {
            let html = '';
            const s = this.config.socials;
            if (s.tiktok) html += `<a href="${s.tiktok}" target="_blank" rel="noopener"><i class='bx bxl-tiktok'></i></a>`;
            if (s.facebook) html += `<a href="${s.facebook}" target="_blank" rel="noopener"><i class='bx bxl-facebook-circle'></i></a>`;
            if (s.instagram) html += `<a href="${s.instagram}" target="_blank" rel="noopener"><i class='bx bxl-instagram'></i></a>`;
            if (s.youtube) html += `<a href="${s.youtube}" target="_blank" rel="noopener"><i class='bx bxl-youtube'></i></a>`;
            socialContainer.innerHTML = html;
        }
    }

    // 3. Render Component
    renderCategories() {
        const container = document.getElementById('category-container');
        if (!container) return;
        
        container.innerHTML = this.categories.map(c => `
            <button class="cat-btn js-cat-btn ${c.id === this.state.category ? 'active' : ''}" data-id="${c.id}">
                ${c.name}
            </button>
        `).join('');
    }

    renderProducts() {
        const grid = document.getElementById('product-grid');
        const featuredContainer = document.getElementById('featured-container');
        const emptyState = document.getElementById('empty-state');
        if (!grid || !featuredContainer || !emptyState) return;

        // Lọc dữ liệu
        let filtered = this.products.filter(p => {
            const matchCat = this.state.category === 'all' || p.category === this.state.category;
            const searchTerm = this.state.search.toLowerCase();
            const matchSearch = p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm);
            return matchCat && matchSearch;
        });

        // Sắp xếp
        filtered.sort((a, b) => {
            const getPrice = (str) => parseInt(str.replace(/\D/g, '')) || 0;
            if (this.state.sort === 'price-asc') return getPrice(a.price) - getPrice(b.price);
            if (this.state.sort === 'price-desc') return getPrice(b.price) - getPrice(a.price);
            return 0; // featured default
        });

        // Xử lý Empty State
        if (filtered.length === 0) {
            grid.innerHTML = ''; featuredContainer.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }
        emptyState.classList.add('hidden');

        // Tách Featured
        const featuredProduct = filtered.find(p => p.featured === true);
        const normalProducts = filtered.filter(p => p !== featuredProduct);

        featuredContainer.innerHTML = featuredProduct ? this.getCardHTML(featuredProduct, true) : '';
        grid.innerHTML = normalProducts.map(p => this.getCardHTML(p, false)).join('');
    }

    getCardHTML(p, isFeatured) {
        const badges = p.badge && p.badge.length ? p.badge.map(b => `<span class="badge ${b.includes('HOT') ? 'hot' : ''}">${b}</span>`).join('') : '';
        const oldPrice = p.oldPrice ? `<span class="old-price">${p.oldPrice}</span>` : '';
        const discount = p.discount ? `<span class="discount">${p.discount}</span>` : '';
        const fallbackImg = `this.onerror=null; this.src='https://placehold.co/500x500/18181b/a1a1aa?text=No+Image'`;

        return `
            <article class="product-card js-product-card ${isFeatured ? 'featured-card' : ''}" data-id="${p.id}">
                <div class="card-img-wrap">
                    <div class="card-badges">${badges}</div>
                    <img src="${p.image}" alt="${p.name}" class="card-img" loading="lazy" onerror="${fallbackImg}">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${p.name}</h3>
                    <p class="card-desc">${p.description}</p>
                    <div class="card-meta">
                        <i class='bx bxs-star'></i>
                        <span>${p.rating} (${p.reviews} đánh giá)</span>
                    </div>
                    <div class="card-price-wrap">
                        <span class="current-price">${p.price}</span>
                        ${oldPrice} ${discount}
                    </div>
                    <button class="card-cta js-open-modal" aria-label="Xem chi tiết">Xem chi tiết</button>
                </div>
            </article>
        `;
    }

    // 4. Quản lý Modal & Affiliate Link
    openModal(id) {
        const p = this.products.find(x => x.id === id);
        if (!p) return;

        const content = document.getElementById('modal-content');
        const oldPrice = p.oldPrice ? `<span class="old-price">${p.oldPrice}</span>` : '';
        const discount = p.discount ? `<span class="discount">${p.discount}</span>` : '';

        content.innerHTML = `
            <div class="modal-grid">
                <img src="${p.image}" class="modal-image" alt="${p.name}">
                <div class="modal-details">
                    <h2 class="modal-title">${p.name}</h2>
                    <div class="card-meta" style="margin-bottom: 16px;">
                        <i class='bx bxs-star'></i> <span>${p.rating} (${p.reviews} đánh giá)</span>
                    </div>
                    <div class="card-price-wrap" style="margin-bottom: 24px;">
                        <span class="current-price" style="font-size: 1.5rem;">${p.price}</span>
                        ${oldPrice} ${discount}
                    </div>
                    <p class="modal-desc">${p.description}</p>
                    <button class="btn btn-primary modal-cta js-affiliate-click" data-id="${p.id}" data-link="${p.affiliateUrl}">
                        Đến nơi bán (Shopee) <i class='bx bx-link-external'></i>
                    </button>
                </div>
            </div>
        `;

        document.getElementById('product-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Ngăn scroll
    }

    closeModal() {
        document.getElementById('product-modal').classList.add('hidden');
        document.body.style.overflow = '';
    }

    handleAffiliateClick(link, id) {
        if (!link || link === "YOUR_AFFILIATE_LINK_HERE" || link.trim() === "") {
            alert("Xin lỗi, link sản phẩm này đang được cập nhật!");
            return;
        }
        
        // Tracking Local (Chỉ tính trên thiết bị của user)
        try {
            let clicks = JSON.parse(localStorage.getItem('mt_clicks') || '{}');
            clicks[id] = (clicks[id] || 0) + 1;
            localStorage.setItem('mt_clicks', JSON.stringify(clicks));
        } catch(e) {}

        window.open(link, '_blank', 'noopener,noreferrer,nofollow,sponsored');
    }

    // 5. Khởi tạo Sự kiện (Event Delegation duy nhất)
    setupEventListeners() {
        // Search (Debounce)
        let searchTimeout;
        const handleSearch = (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.state.search = e.target.value;
                this.renderProducts();
            }, 300);
        };
        document.getElementById('desktop-search')?.addEventListener('input', handleSearch);
        document.getElementById('mobile-search')?.addEventListener('input', handleSearch);

        // Sort
        document.getElementById('sort-select')?.addEventListener('change', (e) => {
            this.state.sort = e.target.value;
            this.renderProducts();
        });

        // Global Click Handler (Event Delegation)
        document.body.addEventListener('click', (e) => {
            
            // Category Click
            const catBtn = e.target.closest('.js-cat-btn');
            if (catBtn) {
                document.querySelectorAll('.js-cat-btn').forEach(b => b.classList.remove('active'));
                catBtn.classList.add('active');
                this.state.category = catBtn.dataset.id;
                this.renderProducts();
                return;
            }

            // Mở Modal khi click card
            const cardCta = e.target.closest('.js-open-modal');
            const card = e.target.closest('.js-product-card');
            if (cardCta || (card && !e.target.closest('.js-affiliate-click'))) {
                e.preventDefault();
                this.openModal(card.dataset.id);
                return;
            }

            // Nút Click Affiliate trong Modal
            const affBtn = e.target.closest('.js-affiliate-click');
            if (affBtn) {
                this.handleAffiliateClick(affBtn.dataset.link, affBtn.dataset.id);
                return;
            }

            // Nút Close Modal
            if (e.target.closest('#close-modal-btn') || e.target.id === 'product-modal') {
                this.closeModal();
                return;
            }

            // Hero CTA Button
            if (e.target.closest('#hero-cta-btn')) {
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            // Nút Clear Filter
            if (e.target.closest('#clear-filter-btn')) {
                document.getElementById('desktop-search').value = '';
                document.getElementById('mobile-search').value = '';
                this.state.search = '';
                this.state.category = 'all';
                this.renderCategories();
                this.renderProducts();
                return;
            }
        });

        // Scroll (Back to top)
        const btt = document.getElementById('back-to-top');
        if (btt) {
            window.addEventListener('scroll', () => {
                btt.classList.toggle('hidden', window.scrollY < 300);
            });
            btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    }

    // 6. Theme (Sáng / Tối)
    initTheme() {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;
        
        // Mặc định load Dark Theme, check LocalStorage
        const savedTheme = localStorage.getItem('mt_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            btn.innerHTML = "<i class='bx bx-moon'></i>";
        }

        btn.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            document.body.classList.toggle('dark-theme', !isLight);
            localStorage.setItem('mt_theme', isLight ? 'light' : 'dark');
            btn.innerHTML = isLight ? "<i class='bx bx-moon'></i>" : "<i class='bx bx-sun'></i>";
        });
    }
}

// Khởi chạy duy nhất 1 lần khi DOM tải xong
document.addEventListener('DOMContentLoaded', () => new AffiliateApp());
