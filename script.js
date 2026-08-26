// ======================================================
// ⚙️ LOGIC WEBSITE — KHÔNG CẦN SỬA PHẦN NÀY
// Script xử lý UI, Render, Search, Filter, Sort và Theme.
// ======================================================

const AppState = {
    searchQuery: '',
    category: 'all',
    sort: 'featured'
};

// --- UTILS ---
const formatCurrency = (num) => {
    if (!num) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "";
};

// --- INIT APP ---
function initApp() {
    // 1. Setup SEO & Metadata
    document.title = SITE_CONFIG.seoTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", SITE_CONFIG.seoDescription);

    // 2. Setup Profile / Hero
    setElText('nav-brand-name', SITE_CONFIG.siteName);
    setElText('profile-name', SITE_CONFIG.authorName);
    setElText('profile-username', SITE_CONFIG.username);
    setElText('profile-bio', SITE_CONFIG.bio);
    setElText('footer-brand', SITE_CONFIG.siteName);
    setElText('current-year', new Date().getFullYear());

    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl && SITE_CONFIG.avatar) {
        avatarEl.src = SITE_CONFIG.avatar;
        avatarEl.onerror = () => avatarEl.src = "https://placehold.co/150x150/171717/a1a1aa?text=Avatar";
    }

    // 3. Setup Socials
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

    // 4. Render Categories & Products
    renderCategories();
    renderProducts();
    setupEventListeners();
    initTheme();
}

// --- RENDER ---
function renderCategories() {
    const container = document.getElementById('category-container');
    if (!container) return;
    container.innerHTML = CATEGORIES.map(c => `
        <button class="cat-btn js-cat-btn ${c.id === AppState.category ? 'active' : ''}" data-id="${c.id}">${c.name}</button>
    `).join('');
}

function renderProducts() {
    const container = document.getElementById('product-container');
    const emptyState = document.getElementById('empty-state');
    if (!container || !emptyState) return;

    const term = AppState.searchQuery.toLowerCase();

    // Lọc
    let filtered = PRODUCTS.filter(p => {
        const matchCat = AppState.category === 'all' || p.category === AppState.category;
        const matchSearch = p.name.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term));
        return matchCat && matchSearch;
    });

    // Sắp xếp
    filtered.sort((a, b) => {
        if (AppState.sort === 'price-asc') return a.price - b.price;
        if (AppState.sort === 'price-desc') return b.price - a.price;
        if (AppState.sort === 'discount') return b.discount - a.discount;
        return (b.featured === true) - (a.featured === true); // Featured mặc định
    });

    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = filtered.map(p => {
        const badge = p.badge ? `<span class="card-badge">${p.badge}</span>` : '';
        const oldPrice = p.oldPrice ? `<span class="card-old-price">${formatCurrency(p.oldPrice)}</span>` : '';
        const price = p.price ? formatCurrency(p.price) : 'Cập nhật';
        const fallback = `this.onerror=null; this.src='https://placehold.co/500x500/171717/a1a1aa?text=No+Image'`;

        return `
            <article class="product-card js-product-card" data-id="${p.id}">
                <div class="card-img-wrap">
                    ${badge}
                    <img src="${p.image}" alt="${p.name}" class="card-img" loading="lazy" onerror="${fallback}">
                </div>
                <div class="card-info">
                    <h3 class="card-title">${p.name}</h3>
                    <div class="card-rating">
                        <i class='bx bxs-star'></i>
                        <span>${p.rating} (${p.reviews})</span>
                    </div>
                    <div class="card-price-wrap">
                        <span class="card-price">${price}</span>
                        ${oldPrice}
                    </div>
                    <button class="card-cta">Xem chi tiết</button>
                </div>
            </article>
        `;
    }).join('');
}

// --- MODAL & AFFILIATE ---
function openModal(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    const body = document.getElementById('modal-body');
    const price = p.price ? formatCurrency(p.price) : 'Đang cập nhật';
    const oldPrice = p.oldPrice ? `<span class="card-old-price">${formatCurrency(p.oldPrice)}</span>` : '';

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
                    ${oldPrice}
                </div>
                <p class="modal-desc">${p.description}</p>
                <button class="btn-primary modal-affiliate-btn js-affiliate-btn" data-link="${p.affiliateUrl}" data-id="${p.id}">
                    Đến nơi bán (Shopee) <i class='bx bx-link-external'></i>
                </button>
            </div>
        </div>
    `;

    document.getElementById('product-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

function handleAffiliateClick(link, id) {
    if (!SITE_CONFIG.affiliateEnabled || !link || link.trim() === "") {
        alert("Link mua hàng đang được cập nhật. Bạn vui lòng quay lại sau nhé!");
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

// --- EVENTS ---
function setupEventListeners() {
    // Search
    let debounceTimer;
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
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

    // Event Delegation cho toàn bộ Body
    document.body.addEventListener('click', (e) => {
        // Category Click
        const catBtn = e.target.closest('.js-cat-btn');
        if (catBtn) {
            document.querySelectorAll('.js-cat-btn').forEach(b => b.classList.remove('active'));
            catBtn.classList.add('active');
            AppState.category = catBtn.dataset.id;
            renderProducts();
            return;
        }

        // Card Click -> Mở Modal
        const card = e.target.closest('.js-product-card');
        if (card) {
            e.preventDefault();
            openModal(card.dataset.id);
            return;
        }

        // Nút Click Affiliate trong Modal
        const affBtn = e.target.closest('.js-affiliate-btn');
        if (affBtn) {
            handleAffiliateClick(affBtn.dataset.link, affBtn.dataset.id);
            return;
        }

        // Đóng Modal
        if (e.target.closest('#close-modal') || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    // Back to top
    const btt = document.getElementById('back-to-top');
    if (btt) {
        window.addEventListener('scroll', () => {
            btt.classList.toggle('hidden', window.scrollY < 300);
        });
        btt.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
    }
}

// --- THEME ---
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    
    if (localStorage.getItem('mt_theme') === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        btn.innerHTML = "<i class='bx bx-sun'></i>";
    }

    btn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme', !isLight);
        localStorage.setItem('mt_theme', isLight ? 'light' : 'dark');
        btn.innerHTML = isLight ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
    });
}

// RUN APP
document.addEventListener('DOMContentLoaded', initApp);
