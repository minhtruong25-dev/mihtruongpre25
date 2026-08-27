// ======================================================
// ⚙️ MT DEALS IMPORTER V2 - MANUAL LOGIC
// ======================================================

const state = {
    product: {
        id: "", featured: false, name: "", image: "", price: 0, oldPrice: null,
        discount: 0, rating: 0, reviews: 0, category: "all", badge: "", description: "",
        tags: [], affiliateUrl: ""
    },
    isValid: false
};

const UI = {
    form: document.getElementById('product-form'),
    
    // Inputs
    id: document.getElementById('f-id'),
    featured: document.getElementById('f-featured'),
    name: document.getElementById('f-name'),
    image: document.getElementById('f-image'),
    price: document.getElementById('f-price'),
    oldPrice: document.getElementById('f-oldPrice'),
    discount: document.getElementById('f-discount'),
    rating: document.getElementById('f-rating'),
    reviews: document.getElementById('f-reviews'),
    category: document.getElementById('f-category'),
    badge: document.getElementById('f-badge'),
    tags: document.getElementById('f-tags'),
    affiliate: document.getElementById('f-affiliate'),
    desc: document.getElementById('f-desc'),
    
    // Previews
    pImg: document.getElementById('p-img'),
    pName: document.getElementById('p-name'),
    pDesc: document.getElementById('p-desc'),
    pRating: document.getElementById('p-rating-reviews'),
    pPrice: document.getElementById('p-price'),
    pOldPrice: document.getElementById('p-old-price'),
    pDiscount: document.getElementById('p-discount'),
    pBadge: document.getElementById('p-badge'),
    pFeatured: document.getElementById('p-featured'),
    
    // Output & Status
    codeOutput: document.getElementById('code-output'),
    valStatus: document.getElementById('validation-status'),
    draftStatus: document.getElementById('draft-status'),
    
    // Buttons & Modal
    btnCopy: document.getElementById('btn-copy'),
    btnDownload: document.getElementById('btn-download'),
    btnReset: document.getElementById('btn-reset'),
    btnNewId: document.getElementById('btn-new-id'),
    btnSample: document.getElementById('btn-sample'),
    modal: document.getElementById('custom-modal'),
    modalCloseBg: document.getElementById('modal-close-bg'),
    modalCancel: document.getElementById('modal-cancel'),
    modalConfirm: document.getElementById('modal-confirm')
};

// 1. UTILS
const generateId = () => 'prod-' + Math.random().toString(36).substring(2, 8);
const formatCurrency = (num) => num ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num) : '';
const isValidUrl = (string) => {
    try { new URL(string); return true; } catch (_) { return false; }
};

// 2. INIT APP
function initApp() {
    // Render Category Options
    if(UI.category && IMPORTER_CONFIG.CATEGORIES) {
        UI.category.innerHTML = IMPORTER_CONFIG.CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    // Load Draft from LocalStorage or Create New
    const draft = localStorage.getItem('mt_importer_draft');
    if (draft) {
        try {
            const parsed = JSON.parse(draft);
            populateForm(parsed);
        } catch(e) { createNewProduct(); }
    } else {
        createNewProduct();
    }

    attachEvents();
    syncState();
}

function createNewProduct() {
    UI.form.reset();
    UI.id.value = generateId();
    syncState();
}

function populateForm(data) {
    UI.id.value = data.id || generateId();
    UI.featured.checked = data.featured || false;
    UI.name.value = data.name || '';
    UI.image.value = data.image || '';
    UI.price.value = data.price || '';
    UI.oldPrice.value = data.oldPrice || '';
    UI.rating.value = data.rating || '';
    UI.reviews.value = data.reviews || '';
    UI.category.value = data.category || 'all';
    UI.badge.value = data.badge || '';
    UI.tags.value = data.tags ? data.tags.join(', ') : '';
    UI.affiliate.value = data.affiliateUrl || '';
    UI.desc.value = data.description || '';
}

// 3. CORE LOGIC: SYNC & VALIDATE
function syncState() {
    const priceVal = parseInt(UI.price.value) || 0;
    const oldPriceVal = parseInt(UI.oldPrice.value) || null;
    
    // Tự động tính Discount
    let discountVal = 0;
    if (oldPriceVal && priceVal && oldPriceVal > priceVal) {
        discountVal = Math.round(((oldPriceVal - priceVal) / oldPriceVal) * 100);
    }
    UI.discount.value = discountVal > 0 ? `-${discountVal}%` : '0%';

    // Xử lý Tags thành Array sạch
    let tagsArr = [];
    if(UI.tags.value.trim() !== "") {
        tagsArr = [...new Set(UI.tags.value.split(',').map(t => t.trim()).filter(Boolean))];
    }

    // Update State
    state.product = {
        id: UI.id.value || generateId(),
        featured: UI.featured.checked,
        name: UI.name.value.trim(),
        image: UI.image.value.trim(),
        price: priceVal,
        oldPrice: oldPriceVal,
        discount: discountVal,
        rating: parseFloat(UI.rating.value) || 0,
        reviews: parseInt(UI.reviews.value) || 0,
        category: UI.category.value,
        badge: UI.badge.value.trim(),
        description: UI.desc.value.trim(),
        tags: tagsArr,
        affiliateUrl: UI.affiliate.value.trim()
    };

    validateForm();
    updatePreview();
    updateCodeOutput();
    saveDraft();
}

function validateForm() {
    const p = state.product;
    const isNameValid = p.name.length > 0;
    const isImageValid = isValidUrl(p.image);
    const isPriceValid = p.price > 0;
    
    state.isValid = isNameValid && isImageValid && isPriceValid;

    if (state.isValid) {
        UI.valStatus.className = 'status-badge success';
        UI.valStatus.innerHTML = "<i class='bx bx-check-circle'></i> Dữ liệu hợp lệ";
        UI.btnCopy.disabled = false;
    } else {
        UI.valStatus.className = 'status-badge error';
        UI.valStatus.innerHTML = "<i class='bx bx-error'></i> Thiếu thông tin bắt buộc (*)";
        UI.btnCopy.disabled = true;
    }
}

// 4. PREVIEW & OUTPUT
function updatePreview() {
    const p = state.product;
    
    // Ảnh có fallback error handling
    UI.pImg.src = p.image || "https://placehold.co/500x500/171717/3f3f46?text=No+Image";
    UI.pImg.onerror = () => { UI.pImg.src = "https://placehold.co/500x500/171717/ef4444?text=Image+Error"; };

    UI.pName.textContent = p.name || "Tên sản phẩm";
    UI.pDesc.textContent = p.description || "Mô tả sản phẩm sẽ hiển thị ở đây...";
    UI.pRating.textContent = `${p.rating} (${p.reviews} đánh giá)`;
    UI.pPrice.textContent = p.price ? formatCurrency(p.price) : "0 ₫";
    
    if (p.badge) { 
        UI.pBadge.textContent = p.badge; 
        UI.pBadge.classList.remove('hidden'); 
        UI.pBadge.style.background = p.badge.toUpperCase() === 'HOT' ? 'var(--danger)' : 'rgba(0,0,0,0.7)'; 
    } else { UI.pBadge.classList.add('hidden'); }

    UI.pFeatured.classList.toggle('hidden', !p.featured);

    if (p.oldPrice) {
        UI.pOldPrice.textContent = formatCurrency(p.oldPrice); 
        UI.pOldPrice.classList.remove('hidden');
        if(p.discount > 0) { 
            UI.pDiscount.textContent = `-${p.discount}%`; 
            UI.pDiscount.classList.remove('hidden'); 
        } else { UI.pDiscount.classList.add('hidden'); }
    } else {
        UI.pOldPrice.classList.add('hidden'); 
        UI.pDiscount.classList.add('hidden');
    }
}

function updateCodeOutput() {
    const jsonStr = JSON.stringify(state.product, null, 4);
    // Xóa dấu ngoặc kép ở Key để thành Object JS thuần
    const jsObjStr = jsonStr.replace(/"(\w+)":/g, '$1:');
    UI.codeOutput.textContent = `{\n${jsObjStr.slice(2, -2)}\n},`;
}

// 5. LOCAL STORAGE AUTOSAVE (Debounced)
let saveTimeout;
function saveDraft() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('mt_importer_draft', JSON.stringify(state.product));
        UI.draftStatus.classList.add('visible');
        setTimeout(() => UI.draftStatus.classList.remove('visible'), 2000);
    }, 1000);
}

// 6. EVENT LISTENERS
function attachEvents() {
    // Lắng nghe mọi thay đổi trên Form
    const inputElements = UI.form.querySelectorAll('input, select, textarea');
    inputElements.forEach(el => {
        el.addEventListener('input', syncState);
        el.addEventListener('change', syncState);
    });

    // Nút Tạo ID mới
    UI.btnNewId.addEventListener('click', () => {
        UI.id.value = generateId();
        syncState();
    });

    // Điền dữ liệu mẫu (Sample Data)
    UI.btnSample.addEventListener('click', () => {
        populateForm({
            id: generateId(),
            featured: true,
            name: "Tai nghe Bluetooth Sony WH-1000XM5 Chống ồn chủ động",
            image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500",
            price: 6990000,
            oldPrice: 8490000,
            rating: 4.9,
            reviews: 1250,
            category: "cong-nghe",
            badge: "HOT",
            tags: ["tai nghe", "chong on", "sony"],
            affiliateUrl: "https://shopee.vn/...",
            description: "Tai nghe chống ồn tốt nhất hiện nay, pin 30h, sạc nhanh. Âm thanh Hi-Res tuyệt hảo."
        });
        syncState();
    });

    // Copy Product Data
    UI.btnCopy.addEventListener('click', () => {
        if (!state.isValid) return;
        const text = UI.codeOutput.textContent;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(showCopySuccess).catch(() => fallbackCopy(text));
        } else { fallbackCopy(text); }
    });

    function showCopySuccess() {
        const ogText = UI.btnCopy.innerHTML;
        UI.btnCopy.innerHTML = "<i class='bx bx-check'></i> Đã Copy";
        UI.btnCopy.style.background = "var(--success)";
        setTimeout(() => { UI.btnCopy.innerHTML = ogText; UI.btnCopy.style.background = ""; }, 2000);
    }

    function fallbackCopy(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try { document.execCommand('copy'); showCopySuccess(); } catch (e) { alert("Trình duyệt không hỗ trợ copy."); }
        document.body.removeChild(textArea);
    }

    // Download JSON
    UI.btnDownload.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(state.product, null, 4)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `mt-product-${state.product.id}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
    });

    // Modal Xóa Form
    UI.btnReset.addEventListener('click', () => UI.modal.classList.remove('hidden'));
    
    const closeModal = () => UI.modal.classList.add('hidden');
    UI.modalCancel.addEventListener('click', closeModal);
    UI.modalCloseBg.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !UI.modal.classList.contains('hidden')) closeModal();
    });

    UI.modalConfirm.addEventListener('click', () => {
        createNewProduct();
        localStorage.removeItem('mt_importer_draft');
        closeModal();
    });
}

// INIT
document.addEventListener('DOMContentLoaded', initApp);
