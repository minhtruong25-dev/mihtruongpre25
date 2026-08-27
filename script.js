// ======================================================
// ⚙️ MT DEALS — APP LOGIC (ĐÃ HOÀN THIỆN)
// Xử lý Render, Search, Filter, Sort, Modal và Tracking
// ======================================================

const AppState = {
    searchQuery: '',
    category: 'all',
    sort: 'featured'
};

// --- UTILITIES ---
const formatCurrency = (num) => {
    if (!num) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "";
};

// --- INITIALIZATION ---
function initApp() {
    // 1. Setup SEO & Meta
    document.title = SITE_CONFIG.seoTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", SITE_CONFIG.seoDescription);

    // 2. Profile & Hero
    setElText('nav-brand-name', SITE_CONFIG.siteName);
    setElText('hero-author', SITE_CONFIG.authorName);
    setElText('hero-username', SITE_CONFIG.username);
    setElText('hero-bio', SITE_CONFIG.bio);
    setElText('footer-author', SITE_CONFIG.authorName);
    setElText('current-year', new Date().getFullYear());

    const avatarEl = document.getElementById('hero-avatar');
    if (avatarEl && SITE_CONFIG.avatar) {
        avatarEl.src = SITE_CONFIG.avatar;
        avatarEl.onerror = () => {
            avatarEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2327272a'/%3E%3Cpath d='M50 55c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm0 5c15 0 30 7.5 30 22.5V90H20v-7.5C20 67.5 35 60 50 60z' fill='%23a1a1aa'/%3E%3C/svg%3E";
        };
    }

    // 3. Social Links
    const socialContainer = document.getElementById('social-container');
    if (socialContainer) {
        let html = '';
        const s = SITE_CONFIG.social;
        if (s.facebook) html += `<a href="${s.facebook}" aria-label="Facebook" target="_blank" rel="noopener"><i class='bx bxl-facebook-circle'></i></a>`;
        if (s.tiktok) html += `<a href="${s.tiktok}" aria-label="TikTok" target="_blank" rel="noopener"><i class='bx bxl-tiktok'></i></a>`;
        if (s.instagram) html += `<a href="${s.instagram}" aria-label="Instagram" target="_blank" rel="noopener"><i class='bx bxl-instagram'></i></a>`;
        if (s.youtube) html += `<a href="${s.youtube}" aria-label="YouTube" target="_blank" rel="noopener"><i class='bx bxl-youtube'></i></a>`;
        if (s.github) html += `<a href="${s.github}" aria-label="GitHub" target="_blank" rel="noopener"><i class='bx bxl-github'></i></a>`;
        socialContainer.innerHTML = html;
    }

    // 4. Render & Events
    renderCategories();
    renderProducts();
    setupEventListeners();
    initTheme();
}

// --- RENDER CATEGORIES ---
function renderCategories() {
    const container = document.getElementById('category-container');
    if (!container) return;
    container.innerHTML = CATEGORIES.map(c => `
        <button class="cat-btn js-cat-btn ${c.id === AppState.category ? 'active' : ''}" data-id="${c.id}" aria-label="Lọc mục ${c.name}">${c.name}</button>
    `).join('');
}

// --- RENDER PRODUCTS ---
function renderProducts() {
    const grid = document.getElementById('product-container');
    const featuredContainer = document.getElementById('featured-container');
    const emptyState = document.getElementById('empty-state');
    if (!grid || !featuredContainer || !emptyState) return;

    const term = AppState.searchQuery.toLowerCase();

    // 1. Filter: Category + Search (Name, Desc, Tags)
    let filtered = PRODUCTS.filter(p => {
        const matchCat = AppState.category === 'all' || p.category === AppState.category;
        const matchSearch = p.name.toLowerCase().includes(term) || 
                           (p.description && p.description.toLowerCase().includes(term)) ||
                           (p.tags && p.tags.some(tag => tag.toLowerCase().includes(term)));
        return matchCat && matchSearch;
    });

    // 2. Sort
    filtered.sort((a, b) => {
        if (AppState.sort === 'price-asc') return a.price - b.price;
        if (AppState.sort === 'price-desc') return b.price - a.price;
        if (AppState.sort === 'discount-desc') return b.discount - a.discount;
        if (AppState.sort === 'rating-desc') return b.rating - a.rating;
        return 0; // Default / Featured giữ nguyên thứ tự gốc
    });

    // 3. Empty State
    if (filtered.length === 0) {
        grid.innerHTML = ''; featuredContainer.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    // 4. Split Featured
    const featuredProduct = filtered.find(p => p.featured === true && AppState.sort === 'featured' && AppState.category === 'all' && term === '');
    const normalProducts = featuredProduct ? filtered.filter(p => p.id !== featuredProduct.id) : filtered;

    featuredContainer.innerHTML = featuredProduct ? generateCardHTML(featuredProduct, true) : '';
    grid.innerHTML = normalProducts.map(p => generateCardHTML(p, false)).join('');

    // 5. GỌI HIỆU ỨNG LƯỚT LÊN KHI RENDER XONG
    initScrollAnimations();
}

// --- HTML GENERATOR ---
function generateCardHTML(p, isFeatured) {
    const badgeStr = p.badge ? `<span class="card-badge ${p.badge.includes('HOT') ? 'hot' : ''}">${p.badge}</span>` : '';
    const oldPrice = p.oldPrice ? `<span class="card-old-price">${formatCurrency(p.oldPrice)}</span>` : '';
    const price = p.price ? formatCurrency(p.price) : 'Cập nhật sau';
    const fallback = `this.onerror=null; this.src='https://placehold.co/500x500/27272a/a1a1aa?text=No+Image'`;
    const labelFeatured = isFeatured ? `<div class="featured-label"><i class='bx bxs-flame'></i> SẢN PHẨM NỔI BẬT</div>` : '';
    
    const descHTML = p.description ? `<p class="card-desc ${isFeatured ? '' : 'desktop-only'}">${p.description}</p>` : '';

    return `
        <article class="product-card js-product-card ${isFeatured ? 'featured-card' : ''}" data-id="${p.id}" tabindex="0">
            <div class="card-img-wrap">
                ${badgeStr}
                <img src="${p.image}" alt="${p.name}" class="card-img" loading="lazy" onerror="${fallback}">
            </div>
            <div class="card-info">
                ${labelFeatured}
                <h3 class="card-title">${p.name}</h3>
                ${descHTML}
                <div class="card-rating">
                    <i class='bx bxs-star'></i> <span>${p.rating} (${p.reviews})</span>
                </div>
                <div class="card-price-wrap">
                    <span class="card-price">${price}</span>
                    <div style="display:flex; gap:8px; align-items:center;">${oldPrice}</div>
                </div>
                <button class="card-cta">Xem chi tiết</button>
            </div>
        </article>
    `;
}

// --- MODAL & AFFILIATE ---
function openModal(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    const body = document.getElementById('modal-body');
    const price = p.price ? formatCurrency(p.price) : 'Cập nhật sau';
    const oldPrice = p.oldPrice ? `<span class="card-old-price">${formatCurrency(p.oldPrice)}</span>` : '';
    const discount = p.discount ? `<span style="font-size:0.85rem; color:var(--danger); font-weight:700; padding:2px 6px; background:rgba(239,68,68,0.1); border-radius:4px; border: 1px solid rgba(239,68,68,0.2);">-${p.discount}%</span>` : '';

    body.innerHTML = `
        <div class="modal-grid">
            <img src="${p.image}" class="modal-img" alt="${p.name}">
            <div class="modal-info">
                <h2 class="modal-title">${p.name}</h2>
                <div class="card-rating" style="margin-bottom: 16px;">
                    <i class='bx bxs-star'></i> <span>${p.rating} (${p.reviews} đánh giá)</span>
                </div>
                <div class="card-price-wrap" style="margin-bottom: 24px;">
                    <span class="card-price" style="font-size: 1.5rem;">${price}</span>
                    <div style="display:flex; gap:8px; align-items:center;">${oldPrice} ${discount}</div>
                </div>
                <p class="modal-desc">${p.description}</p>
                <button class="btn-primary modal-affiliate-btn js-affiliate-btn" data-link="${p.affiliateUrl}" data-id="${p.id}">
                    Xem trên Shopee <i class='bx bx-link-external'></i>
                </button>
            </div>
        </div>
    `;

    const modal = document.getElementById('product-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Tính năng .focus() đã được loại bỏ để tránh iOS/Android tự động zoom lệch trang
}

function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

function handleAffiliateClick(link, id) {
    if (!SITE_CONFIG.affiliateEnabled || !link || link.trim() === "") {
        alert("Link mua hàng chưa được cập nhật. Bạn vui lòng quay lại sau nhé!");
        return;
    }
    // Track click locally
    try {
        let clicks = JSON.parse(localStorage.getItem('mt_clicks') || '{}');
        clicks[id] = (clicks[id] || 0) + 1;
        localStorage.setItem('mt_clicks', JSON.stringify(clicks));
    } catch(e) {}

    window.open(link, '_blank', 'noopener,noreferrer,nofollow,sponsored');
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Search (Debounce)
    let searchTimeout;
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            AppState.searchQuery = e.target.value;
            renderProducts();
        }, 300);
    });

    // Sort
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
        AppState.sort = e.target.value;
        renderProducts();
    });

    // Hero CTA
    document.getElementById('hero-cta')?.addEventListener('click', () => {
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Global Event Delegation
    document.body.addEventListener('click', (e) => {
        // 1. Click Category
        const catBtn = e.target.closest('.js-cat-btn');
        if (catBtn) {
            document.querySelectorAll('.js-cat-btn').forEach(b => b.classList.remove('active'));
            catBtn.classList.add('active');
            AppState.category = catBtn.dataset.id;
            renderProducts();
            return;
        }

        // 2. Click Product Card -> Open Modal
        const card = e.target.closest('.js-product-card');
        if (card) {
            e.preventDefault();
            openModal(card.dataset.id);
            return;
        }

        // 3. Click Affiliate CTA (trong Modal)
        const affBtn = e.target.closest('.js-affiliate-btn');
        if (affBtn) {
            handleAffiliateClick(affBtn.dataset.link, affBtn.dataset.id);
            return;
        }

        // 4. Đóng Modal
        if (e.target.closest('#close-modal') || e.target.id === 'product-modal' || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    // Bấm ESC để đóng modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !document.getElementById('product-modal').classList.contains('hidden')) {
            closeModal();
        }
    });

    // Back to top
    const btt = document.getElementById('back-to-top');
    if (btt) {
        window.addEventListener('scroll', () => {
            btt.classList.toggle('hidden', window.scrollY < 400);
        });
        btt.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
    }
}

// --- THEME MANAGEMENT ---
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    
    if (localStorage.getItem('mt_theme') === 'light') {
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

// =====================================================
// SCROLL ANIMATIONS (Intersection Observer - FLUID V2.1)
// =====================================================
function initScrollAnimations() {
    // 1. Tắt animation nếu user đang bật chế độ giảm hiệu ứng trên HĐH
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.js-product-card, .fade-up').forEach(el => el.classList.add('is-visible'));
        return;
    }

    const cards = document.querySelectorAll('.js-product-card');
    
    // Observer cho Product Cards
    const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Sau khi thẻ đã hiện lên xong (800ms), gỡ bỏ transition-delay.
                // Điều này giúp hiệu ứng HOVER sau này không bị delay giật lag.
                setTimeout(() => {
                    if(entry.target) entry.target.style.transitionDelay = '0ms';
                }, 800);
                
                obs.unobserve(entry.target); 
            }
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

    // Gắn Class và tính toán Delay lệch nhịp (Staggered Delay: 0, 60, 120...)
    cards.forEach((card, index) => {
        if (!card.classList.contains('card-reveal')) {
            card.classList.add('card-reveal');
        }
        // Giới hạn max delay là 600ms để người dùng cuộn nhanh không phải chờ quá lâu
        const delay = Math.min((index % 15) * 60, 600);
        card.style.transitionDelay = `${delay}ms`;
        cardObserver.observe(card);
    });

    // Observer cho các Section khác (About, Trust, Footer...)
    const sections = document.querySelectorAll('.fade-up:not(.is-visible)');
    const sectionObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    sections.forEach(sec => sectionObserver.observe(sec));
}


// KHỞI CHẠY DUY NHẤT 1 LẦN KHI LOAD TRANG
document.addEventListener('DOMContentLoaded', initApp);
