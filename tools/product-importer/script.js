// ======================================================
// ⚙️ LOGIC XỬ LÝ IMPORTER
// ======================================================

const state = {
    product: {
        id: "",
        featured: false,
        name: "",
        image: "",
        price: 0,
        oldPrice: null,
        discount: 0,
        rating: 0,
        reviews: 0,
        category: "",
        badge: "",
        description: "",
        tags: [],
        affiliateUrl: ""
    }
};

// DOM Elements
const inputs = {
    name: document.getElementById('f-name'),
    image: document.getElementById('f-image'),
    price: document.getElementById('f-price'),
    oldPrice: document.getElementById('f-oldPrice'),
    rating: document.getElementById('f-rating'),
    reviews: document.getElementById('f-reviews'),
    category: document.getElementById('f-category'),
    badge: document.getElementById('f-badge'),
    featured: document.getElementById('f-featured'),
    tags: document.getElementById('f-tags'),
    affiliate: document.getElementById('f-affiliate'),
    desc: document.getElementById('f-desc')
};

// Khởi tạo Select Category từ config
function initCategories() {
    const catSelect = document.getElementById('f-category');
    if(catSelect && IMPORTER_CONFIG.CATEGORIES) {
        catSelect.innerHTML = IMPORTER_CONFIG.CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
}

// Format Tiền tệ
function formatCurrency(num) {
    if (!num) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}

// Generate ID tự động
function generateId() {
    return 'prod-' + Math.random().toString(36).substring(2, 8);
}

// Cập nhật State từ Form
function syncStateFromForm() {
    const priceVal = parseInt(inputs.price.value) || 0;
    const oldPriceVal = parseInt(inputs.oldPrice.value) || null;
    
    // Tự động tính phần trăm giảm giá
    let discountVal = 0;
    if (oldPriceVal && priceVal && oldPriceVal > priceVal) {
        discountVal = Math.round(((oldPriceVal - priceVal) / oldPriceVal) * 100);
    }

    // Tách tags
    let tagsArr = [];
    if(inputs.tags.value.trim() !== "") {
        tagsArr = inputs.tags.value.split(',').map(t => t.trim()).filter(t => t !== "");
    }

    state.product = {
        id: state.product.id || generateId(),
        featured: inputs.featured.checked,
        name: inputs.name.value.trim(),
        image: inputs.image.value.trim(),
        price: priceVal,
        oldPrice: oldPriceVal,
        discount: discountVal,
        rating: parseFloat(inputs.rating.value) || 0,
        reviews: parseInt(inputs.reviews.value) || 0,
        category: inputs.category.value,
        badge: inputs.badge.value.trim(),
        description: inputs.desc.value.trim(),
        tags: tagsArr,
        affiliateUrl: inputs.affiliate.value.trim()
    };

    updatePreviewCard();
    generateCodeOutput();
}

// Cập nhật Preview Card UI
function updatePreviewCard() {
    const p = state.product;
    
    // Image
    const imgEl = document.getElementById('p-img');
    imgEl.src = p.image || "https://placehold.co/500x500/171717/a1a1aa?text=Image";

    // Text
    document.getElementById('p-name').textContent = p.name || "Tên sản phẩm";
    document.getElementById('p-desc').textContent = p.description || "Mô tả sẽ hiển thị ở đây...";
    document.getElementById('p-rating-review').textContent = `${p.rating} (${p.reviews} đánh giá)`;
    document.getElementById('p-price').textContent = p.price ? formatCurrency(p.price) : "0 ₫";
    
    // Badge
    const badgeEl = document.getElementById('p-badge');
    if (p.badge) {
        badgeEl.textContent = p.badge;
        badgeEl.classList.remove('hidden');
        badgeEl.style.background = p.badge.includes('HOT') ? 'var(--danger)' : 'rgba(0,0,0,0.7)';
    } else {
        badgeEl.classList.add('hidden');
    }

    // Featured Label
    document.getElementById('p-featured-label').classList.toggle('hidden', !p.featured);

    // Old Price & Discount
    const oldPriceEl = document.getElementById('p-old-price');
    const discountEl = document.getElementById('p-discount');
    
    if (p.oldPrice) {
        oldPriceEl.textContent = formatCurrency(p.oldPrice);
        oldPriceEl.classList.remove('hidden');
        if(p.discount > 0) {
            discountEl.textContent = `-${p.discount}%`;
            discountEl.classList.remove('hidden');
        } else {
            discountEl.classList.add('hidden');
        }
    } else {
        oldPriceEl.classList.add('hidden');
        discountEl.classList.add('hidden');
    }
}

// Khởi tạo chuỗi Code JavaScript
function generateCodeOutput() {
    const codeBlock = document.getElementById('code-output');
    // Format JSON với thụt lề 4 space
    const jsonString = JSON.stringify(state.product, null, 4);
    
    // Đổi format thành Object JS chuẩn để copy vào mảng
    const jsString = jsonString
        .replace(/"id":/g, 'id:')
        .replace(/"featured":/g, 'featured:')
        .replace(/"name":/g, 'name:')
        .replace(/"image":/g, 'image:')
        .replace(/"price":/g, 'price:')
        .replace(/"oldPrice":/g, 'oldPrice:')
        .replace(/"discount":/g, 'discount:')
        .replace(/"rating":/g, 'rating:')
        .replace(/"reviews":/g, 'reviews:')
        .replace(/"category":/g, 'category:')
        .replace(/"badge":/g, 'badge:')
        .replace(/"description":/g, 'description:')
        .replace(/"tags":/g, 'tags:')
        .replace(/"affiliateUrl":/g, 'affiliateUrl:');

    codeBlock.textContent = `{\n${jsString.slice(2, -2)}\n},`;
}

// Xử lý nút Fetch API
document.getElementById('btn-fetch').addEventListener('click', () => {
    const statusEl = document.getElementById('fetch-status');
    const link = document.getElementById('shopee-link').value.trim();

    statusEl.classList.remove('hidden', 'success', 'error');

    if (!link) {
        statusEl.classList.add('error');
        statusEl.innerHTML = "<i class='bx bx-error-circle'></i> Vui lòng nhập link sản phẩm Shopee.";
        return;
    }

    if (!IMPORTER_CONFIG.SHOPEE_API_ENDPOINT || !IMPORTER_CONFIG.SHOPEE_API_KEY) {
        statusEl.classList.add('error');
        statusEl.innerHTML = "<b><i class='bx bx-error'></i> Chưa cấu hình Shopee API.</b><br>Do chính sách bảo mật CORS của trình duyệt, bạn không thể cào dữ liệu trực tiếp từ Shopee. Vui lòng nhập dữ liệu thủ công ở biểu mẫu bên dưới hoặc cấu hình Backend API trong file <code>config.js</code>.";
        return;
    }

    // Logic gọi API thật sẽ nằm ở đây
    statusEl.classList.add('success');
    statusEl.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Đang tải dữ liệu qua API...";
});

// Gắn sự kiện "input" cho tất cả các trường form để live update
Object.values(inputs).forEach(input => {
    if(input) {
        input.addEventListener('input', syncStateFromForm);
        input.addEventListener('change', syncStateFromForm);
    }
});

// Nút Copy
document.getElementById('btn-copy').addEventListener('click', function() {
    const textToCopy = document.getElementById('code-output').textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = this.innerHTML;
        this.innerHTML = "<i class='bx bx-check'></i> Đã Copy";
        this.style.background = "#10b981";
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = "";
        }, 2000);
    });
});

// Nút Download
document.getElementById('btn-download').addEventListener('click', () => {
    const jsonString = JSON.stringify(state.product, null, 4);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mt-product-${state.product.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Nút Xóa form
document.getElementById('btn-clear').addEventListener('click', () => {
    document.getElementById('product-form').reset();
    state.product.id = ""; // Reset ID để tạo ID mới cho sản phẩm tiếp theo
    syncStateFromForm();
});

// Khởi chạy
document.addEventListener('DOMContentLoaded', () => {
    initCategories();
    syncStateFromForm(); // Render trạng thái ban đầu
});
