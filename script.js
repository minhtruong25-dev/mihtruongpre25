// ======================================================
// ⚙️ MT DEALS V3.2 — LOGIC & BỔ SUNG CLASS BADGE
// ======================================================

const AppState = {
    searchQuery: '',
    category: 'all',
    sort: 'featured'
};

let globalRevealObserver = null;

const formatCurrency = (num) => {
    if (!num) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "";
};

function initApp() {
    document.title = SITE_CONFIG.seoTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", SITE_CONFIG.seoDescription);

    setElText('hero-author', SITE_CONFIG.authorName);
    setElText('hero-username', SITE_CONFIG.username);
    setElText('hero-bio', SITE_CONFIG.bio);
    setElText('current-year', new Date().getFullYear());

    const avatarEl = document.getElementById('hero-avatar');
    if (avatarEl && SITE_CONFIG.avatar) {
        avatarEl.src = SITE_CONFIG.avatar;
        avatarEl.onerror = () => {
            avatarEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23111'/%3E%3Cpath d='M50 55c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm0 5c15 0 30 7.5 30 22.5V90H20v-7.5C20 67.5 35 60 50 60z' fill='%2352525b'/%3E%3C/svg%3E";
        };
    }

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

    renderCategories();
    renderProducts();
    setupEventListeners();
    initTheme();
    setupBackToTopObserver();
}

function renderCategories() {
    const container = document.getElementById('category-container');
    if (!container || typeof CATEGORIES === 'undefined') return;
    container.innerHTML = CATEGORIES.map(c => `
        <button class="cat-btn js-cat-btn ${c.id === AppState.category ? 'active' : ''}" data-id="${c.id}" aria-label="Lọc ${c.name}">${c.name}</button>
    `).join('');
}

function renderProducts() {
    const grid = document.getElementById('product-container');
    const featuredContainer = document.getElementById('featured-container');
    const emptyState = document.getElementById('empty-state');
    if (!grid || !featuredContainer || !emptyState || typeof PRODUCTS === 'undefined') return;

    if (globalRevealObserver) globalRevealObserver.disconnect();

    const term = AppState.searchQuery.toLowerCase();
    
    let filtered = PRODUCTS.filter(p => {
        const matchCat = AppState.category === 'all' || p.category === AppState.category;
        const matchSearch = p.name.toLowerCase().includes(term) || 
                           (p.description && p.description.toLowerCase().includes(term)) ||
                           (p.tags && p.tags.some(tag => tag.toLowerCase().includes(term)));
        return matchCat && matchSearch;
    });

    filtered.sort((a, b) => {
        if (AppState.sort === 'price-asc') return a.price - b.price;
        if (AppState.sort === 'price-desc') return b.price - a.price;
        if (AppState.sort === 'discount-desc') return (b.discount || 0) - (a.discount || 0);
        if (AppState.sort === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        return 0; 
    });

    if (filtered.length === 0) {
        grid.innerHTML = ''; featuredContainer.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    const featuredProduct = filtered.find(p => p.featured === true && AppState.sort === 'featured' && AppState.category === 'all' && term === '');
    const normalProducts = featuredProduct ? filtered.filter(p => p.id !== featuredProduct.id) : filtered;

    featuredContainer.innerHTML = featuredProduct ? generateCardHTML(featuredProduct, true) : '';
    
    window.requestAnimationFrame(() => {
        grid.innerHTML = normalProducts.map(p => generateCardHTML(p, false)).join('');
        window.requestAnimationFrame(() => {
            initScrollAnimations();
        });
    });
}

function generateCardHTML(p, isFeatured) {
    // 💡 TẠO CLASS TỰ ĐỘNG THEO CHỮ (hot, top, sale) ĐỂ CSS ĐỔI MÀU
    const badgeClass = p.badge ? p.badge.toLowerCase().trim() : '';
    const badgeStr = p.badge ? `<span class="card-badge ${badgeClass}">${p.badge}</span>` : '';
    
    const discountStr = p.discount ? `<div class="card-discount">-${p.discount}%</div>` : '';
    const oldPrice = p.oldPrice ? `<span class="card-old-price">${formatCurrency(p.oldPrice)}</span>` : '';
    const price = p.price ? formatCurrency(p.price) : 'Cập nhật sau';
    
    const fallback = `this.onerror=null; this.src='https://placehold.co/500x500/27272a/52525b?text=No+Image'`;
    const labelFeatured = isFeatured ? `<div class="featured-label">FEATURED DEAL</div>` : '';
    const descHTML = p.description ? `<p class="card-desc ${isFeatured ? '' : 'desktop-only'}">${p.description}</p>` : '';

    return `
        <article class="product-card js-product-card card-reveal ${isFeatured ? 'featured-card' : ''}" data-id="${p.id}" tabindex="0">
            <div class="card-img-wrap">
                <div class="card-badges">${badgeStr}</div>
                <img src="${p.image}" alt="${p.name}" class="card-img" loading="lazy" decoding="async" onerror="${fallback}">
                ${discountStr}
            </div>
            <div class="card-info">
                ${labelFeatured}
                <h3 class="card-title">${p.name}</h3>
                ${descHTML}
                <div class="card-rating">
                    <i class='bx bxs-star'></i> <span>${p.rating || 0}</span>
                </div>
                <div class="card-price-wrap">
                    <span class="card-price">${price}</span>
                    <div class="price-old-wrap">${oldPrice}</div>
                </div>
                <button class="card-cta">Xem deal <i class='bx bx-right-arrow-alt'></i></button>
            </div>
        </article>
    `;
}

function openModal(id) {
    if (typeof PRODUCTS === 'undefined') return;
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    const body = document.getElementById('modal-body');
    const price = p.price ? formatCurrency(p.price) : 'Cập nhật sau';
    const oldPrice = p.oldPrice ? `<span class="card-old-price">${formatCurrency(p.oldPrice)}</span>` : '';
    
    // 💡 ÉP MÀU ĐỎ NỔI BẬT CHO % GIẢM GIÁ TRONG MODAL
    const discount = p.discount ? `<span style="font-size:0.85rem; color:#fff; font-weight:700; padding:4px 8px; background:var(--danger); border-radius:6px;">-${p.discount}%</span>` : '';

    body.innerHTML = `
        <div class="modal-grid">
            <img src="${p.image}" class="modal-img" alt="${p.name}">
            <div class="modal-info">
                <h2 class="modal-title">${p.name}</h2>
                <div class="card-rating" style="margin-bottom: 16px; font-size: 0.9rem; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
                    <i class='bx bxs-star' style="color: var(--accent);"></i> <span>${p.rating || 0} (${p.reviews || 0} đánh giá)</span>
                </div>
                <div class="card-price-wrap" style="margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
                    <span class="card-price" style="font-size: 1.6rem; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif;">${price}</span>
                    ${oldPrice} ${discount}
                </div>
                <p class="modal-desc">${p.description}</p>
                <button class="modal-affiliate-btn js-affiliate-btn" data-link="${p.affiliateUrl}" data-id="${p.id}">
                    Đến nơi bán <i class='bx bx-link-external'></i>
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
        alert("Link mua hàng chưa được cập nhật.");
        return;
    }
    window.open(link, '_blank', 'noopener,noreferrer,nofollow,sponsored');
}

function setupEventListeners() {
    let searchTimeout;
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            AppState.searchQuery = e.target.value;
            renderProducts();
        }, 250);
    });

    document.getElementById('sort-select')?.addEventListener('change', (e) => {
        AppState.sort = e.target.value;
        renderProducts();
    });

    document.body.addEventListener('click', (e) => {
        const catBtn = e.target.closest('.js-cat-btn');
        if (catBtn) {
            document.querySelectorAll('.js-cat-btn').forEach(b => b.classList.remove('active'));
            catBtn.classList.add('active');
            AppState.category = catBtn.dataset.id;
            renderProducts();
            return;
        }

        const card = e.target.closest('.js-product-card');
        if (card) {
            e.preventDefault();
            openModal(card.dataset.id);
            return;
        }

        const affBtn = e.target.closest('.js-affiliate-btn');
        if (affBtn) {
            handleAffiliateClick(affBtn.dataset.link, affBtn.dataset.id);
            return;
        }

        if (e.target.closest('#close-modal') || e.target.id === 'product-modal' || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !document.getElementById('product-modal').classList.contains('hidden')) {
            closeModal();
        }
    });
}

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

function setupBackToTopObserver() {
    const btt = document.getElementById('back-to-top');
    const heroSection = document.querySelector('.hero-section');
    if (btt && heroSection) {
        const bttObserver = new IntersectionObserver((entries) => {
            window.requestAnimationFrame(() => {
                btt.classList.toggle('hidden', entries[0].isIntersecting);
            });
        }, { rootMargin: '0px', threshold: 0 });
        
        bttObserver.observe(heroSection);
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

function initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.js-product-card, .trust-section').forEach(el => el.classList.add('is-visible'));
        return;
    }

    if (!globalRevealObserver) {
        globalRevealObserver = new IntersectionObserver((entries, obs) => {
            window.requestAnimationFrame(() => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target); 
                    }
                });
            });
        }, { 
            rootMargin: '600px 0px 600px 0px', 
            threshold: 0 
        });
    }

    document.querySelectorAll('.trust-section:not(.is-visible)').forEach(sec => {
        sec.classList.add('reveal-section');
        globalRevealObserver.observe(sec);
    });

    document.querySelectorAll('.js-product-card:not(.is-visible)').forEach((card) => {
        globalRevealObserver.observe(card);
    });
}

document.addEventListener('DOMContentLoaded', initApp);
