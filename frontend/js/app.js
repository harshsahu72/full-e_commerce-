// ============================================================
//  Sahu Store — Main App Controller
// ============================================================

// ─── Toast Notifications ────────────────────────────────────
function showToast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-msg">${msg}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 4000);
}

// ─── Star Rating Helper ─────────────────────────────────────
function renderStars(rating, max = 5) {
  let html = '';
  for (let i = 1; i <= max; i++) {
    if (rating >= i) html += '★';
    else if (rating >= i - 0.5) html += '½';
    else html += '☆';
  }
  return `<span class="stars">${html}</span>`;
}

// ─── Format Currency ────────────────────────────────────────
function formatPrice(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

// ─── Format Date ────────────────────────────────────────────
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Routing / Page Navigation ──────────────────────────────
function navigateTo(page, data = null) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.nav-link[data-page]').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  // page-specific loaders
  if (page === 'home') loadHomePage();
  if (page === 'products') loadProductsPage();
  if (page === 'cart') loadCartPage();
  if (page === 'orders') loadOrdersPage();
  if (page === 'product-detail' && data) loadProductDetail(data);
}

// ─── Cart Sidebar ────────────────────────────────────────────
function openCartSidebar() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  renderCartSidebar();
}
function closeCartSidebar() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

function renderCartSidebar() {
  const cart = CartManager.getCart();
  const itemsEl = document.getElementById('cart-sidebar-items');
  const footerEl = document.getElementById('cart-sidebar-footer');

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h4>Your cart is empty</h4>
        <p style="color:var(--text-muted);font-size:14px;">Discover products and add them here</p>
        <button class="btn btn-primary btn-sm" onclick="closeCartSidebar(); navigateTo('products')">Shop Now</button>
      </div>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" id="cart-item-${item._id}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'">
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${formatPrice(item.price * item.quantity)}</p>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeCartQty('${item._id}', ${item.quantity - 1}, ${item.stock})">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn" onclick="changeCartQty('${item._id}', ${item.quantity + 1}, ${item.stock})">+</button>
          <button class="remove-item-btn" onclick="removeCartItem('${item._id}')" title="Remove">🗑</button>
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = CartManager.getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  document.getElementById('cart-tax').textContent = formatPrice(tax);
  document.getElementById('cart-grand-total').textContent = formatPrice(total);
}

function changeCartQty(id, qty, stock) {
  CartManager.updateQty(id, Math.min(qty, stock));
  renderCartSidebar();
}
function removeCartItem(id) {
  CartManager.removeItem(id);
  renderCartSidebar();
}

// ─── Auth Modal ──────────────────────────────────────────────
function openAuthModal(tab = 'login') {
  document.getElementById('auth-modal').classList.add('open');
  switchAuthTab(tab);
}
function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('open');
}
function switchAuthTab(tab) {
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('login-form-wrap').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form-wrap').style.display = tab === 'register' ? 'block' : 'none';
}

// ─── Home Page ───────────────────────────────────────────────
async function loadHomePage() {
  // Featured products
  const el = document.getElementById('featured-products-grid');
  el.innerHTML = `<div class="loading-state"><div class="spinner"></div><p style="color:var(--text-muted)">Loading products...</p></div>`;

  try {
    const featured = await ProductsAPI.getFeatured();
    el.innerHTML = featured.length
      ? featured.map(p => renderProductCard(p)).join('')
      : `<p style="color:var(--text-muted);text-align:center;padding:40px 0;grid-column:1/-1">No featured products yet.</p>`;
  } catch (e) {
    el.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px 0;color:var(--text-muted)">${renderDemoProducts()}</div>`;
  }
}

function renderDemoProducts() {
  // Render placeholder cards when backend offline
  const demo = [
    { _id: 'demo1', name: 'Sony WH-1000XM5', price: 24990, originalPrice: 34990, category: 'Electronics', rating: 4.9, numReviews: 312,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', stock: 10, featured: true },
    { _id: 'demo2', name: 'Nike Air Max 270', price: 8995, originalPrice: 11995, category: 'Clothing', rating: 4.5, numReviews: 210,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', stock: 50, featured: true },
    { _id: 'demo3', name: 'Apple AirPods Pro', price: 18999, originalPrice: 24999, category: 'Electronics', rating: 4.8, numReviews: 124,
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80', stock: 25, featured: true },
    { _id: 'demo4', name: 'The Psychology of Money', price: 349, originalPrice: 499, category: 'Books', rating: 4.8, numReviews: 445,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80', stock: 100, featured: true },
  ];
  const el = document.getElementById('featured-products-grid');
  el.innerHTML = demo.map(p => renderProductCard(p)).join('');
  return '';
}

// ─── Product Card Renderer ───────────────────────────────────
function renderProductCard(p) {
  const discount = p.originalPrice > p.price
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;
  return `
  <div class="product-card" onclick="navigateTo('product-detail', '${p._id}')">
    <div class="product-card-image">
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
      ${discount > 0 ? `<span class="product-card-badge sale">${discount}% OFF</span>` : ''}
      ${p.stock === 0 ? '<div class="out-of-stock-overlay">OUT OF STOCK</div>' : ''}
      <div class="product-card-actions">
        <button class="product-action-btn" onclick="event.stopPropagation(); navigateTo('product-detail', '${p._id}')" title="Quick View">👁</button>
        <button class="product-action-btn" onclick="event.stopPropagation(); addToCartFromCard(${JSON.stringify(p).replace(/"/g, '&quot;')})" title="Add to Cart">🛒</button>
      </div>
    </div>
    <div class="product-card-body">
      <div class="product-category">${p.category}</div>
      <h3 class="product-name">${p.name}</h3>
      <div class="product-rating">
        ${renderStars(p.rating)}
        <span class="rating-count">(${p.numReviews})</span>
      </div>
      <div class="product-price-row">
        <div>
          <span class="product-price">${formatPrice(p.price)}</span>
          ${p.originalPrice > p.price ? `<span class="product-original-price">${formatPrice(p.originalPrice)}</span>` : ''}
        </div>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCartFromCard(${JSON.stringify(p).replace(/"/g, '&quot;')})" ${p.stock === 0 ? 'disabled' : ''}>+</button>
      </div>
    </div>
  </div>`;
}

function addToCartFromCard(product) {
  CartManager.addItem(product, 1);
}

// ─── Products Page ───────────────────────────────────────────
let currentFilters = { keyword: '', category: 'All', sort: 'newest', page: 1 };

async function loadProductsPage() {
  renderProductsGrid();
}

async function renderProductsGrid() {
  const gridEl = document.getElementById('products-grid');
  gridEl.innerHTML = `<div class="loading-state" style="grid-column:1/-1"><div class="spinner"></div><p style="color:var(--text-muted)">Loading...</p></div>`;

  try {
    const params = { page: currentFilters.page, limit: 12, sort: currentFilters.sort };
    if (currentFilters.keyword) params.keyword = currentFilters.keyword;
    if (currentFilters.category !== 'All') params.category = currentFilters.category;

    const { products, total, pages } = await ProductsAPI.getAll(params);
    document.getElementById('products-count').textContent = `${total} products found`;
    gridEl.innerHTML = products.length
      ? products.map(p => renderProductCard(p)).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:80px 0;color:var(--text-muted)"><p style="font-size:48px">🔍</p><h3 style="margin:12px 0 6px">No products found</h3><p>Try adjusting your filters</p></div>`;
    renderPagination(pages);
  } catch (err) {
    // Show demo products if backend offline
    const demoProducts = getDemoProducts();
    gridEl.innerHTML = demoProducts.map(p => renderProductCard(p)).join('');
    document.getElementById('products-count').textContent = `${demoProducts.length} products (demo mode)`;
  }
}

function getDemoProducts() {
  return [
    { _id: 'd1', name: 'Apple AirPods Pro 2nd Gen', price: 18999, originalPrice: 24999, category: 'Electronics', rating: 4.8, numReviews: 124, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80', stock: 25, description: 'Active Noise Cancellation, Transparency Mode.' },
    { _id: 'd2', name: 'Samsung Galaxy S24 Ultra', price: 89999, originalPrice: 99999, category: 'Electronics', rating: 4.7, numReviews: 89, image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600&q=80', stock: 12, description: '200MP camera, S-Pen included.' },
    { _id: 'd3', name: 'Nike Air Max 270', price: 8995, originalPrice: 11995, category: 'Clothing', rating: 4.5, numReviews: 210, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', stock: 50, description: 'Lightweight cushioning.' },
    { _id: 'd4', name: 'Sony WH-1000XM5', price: 24990, originalPrice: 34990, category: 'Electronics', rating: 4.9, numReviews: 312, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', stock: 18, description: 'Industry-leading noise cancellation.' },
    { _id: 'd5', name: "Levi's 501 Original Jeans", price: 3999, originalPrice: 5999, category: 'Clothing', rating: 4.4, numReviews: 98, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', stock: 75, description: 'Classic straight fit.' },
    { _id: 'd6', name: 'The Psychology of Money', price: 349, originalPrice: 499, category: 'Books', rating: 4.8, numReviews: 445, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80', stock: 100, description: 'Timeless lessons on wealth.' },
    { _id: 'd7', name: 'Dyson V15 Detect Vacuum', price: 44900, originalPrice: 54900, category: 'Home & Garden', rating: 4.7, numReviews: 67, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', stock: 8, description: 'Laser detects dust.' },
    { _id: 'd8', name: 'Yoga Mat Premium', price: 1299, originalPrice: 1999, category: 'Sports', rating: 4.3, numReviews: 155, image: 'https://images.unsplash.com/photo-1601925228088-c50b4d61a8e3?w=600&q=80', stock: 60, description: 'Extra thick 6mm eco-friendly.' },
  ];
}

function renderPagination(pages) {
  const el = document.getElementById('products-pagination');
  if (!el || pages <= 1) { if (el) el.innerHTML = ''; return; }
  let html = `<button class="page-btn" onclick="changePage(${currentFilters.page - 1})" ${currentFilters.page === 1 ? 'disabled' : ''}>‹</button>`;
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn ${i === currentFilters.page ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" onclick="changePage(${currentFilters.page + 1})" ${currentFilters.page === pages ? 'disabled' : ''}>›</button>`;
  el.innerHTML = html;
}

function changePage(p) {
  currentFilters.page = p;
  renderProductsGrid();
  document.getElementById('page-products').scrollIntoView({ behavior: 'smooth' });
}

function filterByCategory(cat) {
  currentFilters.category = cat;
  currentFilters.page = 1;
  document.querySelectorAll('.filter-chip[data-cat]').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
  renderProductsGrid();
}

function setSort(val) { currentFilters.sort = val; currentFilters.page = 1; renderProductsGrid(); }

function searchProducts(kw) {
  currentFilters.keyword = kw;
  currentFilters.page = 1;
  renderProductsGrid();
}

// ─── Product Detail Page ─────────────────────────────────────
async function loadProductDetail(productId) {
  const page = document.getElementById('page-product-detail');
  page.innerHTML = `<div class="container section"><div class="loading-state"><div class="spinner"></div><p style="color:var(--text-muted)">Loading product...</p></div></div>`;

  try {
    let product;
    try {
      product = await ProductsAPI.getById(productId);
    } catch {
      // Fallback to demo data
      product = getDemoProducts().find(p => p._id === productId) || getDemoProducts()[0];
    }

    const discount = product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    page.innerHTML = `
      <div class="container section">
        <nav style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted);margin-bottom:32px;flex-wrap:wrap">
          <a href="#" onclick="navigateTo('home')" style="color:var(--accent-light)">Home</a> /
          <a href="#" onclick="navigateTo('products')" style="color:var(--accent-light)">Products</a> /
          <span>${product.name}</span>
        </nav>

        <div class="product-detail-grid">
          <div class="product-detail-imgs">
            <div class="product-main-img">
              <img id="main-product-img" src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'">
            </div>
          </div>

          <div class="product-detail-info">
            <span class="product-detail-badge">✦ ${product.category}</span>
            <h1 class="product-detail-name">${product.name}</h1>

            <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
              ${renderStars(product.rating)}
              <span style="font-size:14px;color:var(--text-muted)">${product.rating?.toFixed(1)} · ${product.numReviews} reviews</span>
            </div>

            <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px">
              <span class="product-detail-price">${formatPrice(product.price)}</span>
              ${product.originalPrice > product.price ? `<span class="product-detail-original">${formatPrice(product.originalPrice)}</span><span class="product-detail-discount">${discount}% OFF</span>` : ''}
            </div>
            ${product.originalPrice > product.price ? `<p style="font-size:13px;color:var(--success);margin-bottom:16px">You save ${formatPrice(product.originalPrice - product.price)} 🎉</p>` : ''}

            <p class="product-detail-desc">${product.description || 'Premium quality product with exceptional features and performance.'}</p>

            <div class="product-detail-meta">
              <div class="product-meta-row">
                <span class="product-meta-label">Brand:</span>
                <span class="product-meta-val">${product.brand || 'Sahu Store'}</span>
              </div>
              <div class="product-meta-row">
                <span class="product-meta-label">Status:</span>
                <div class="stock-indicator">
                  <div class="stock-dot ${product.stock > 0 ? 'in' : 'out'}"></div>
                  <span class="product-meta-val" style="color:${product.stock > 0 ? 'var(--success)' : 'var(--error)'}">
                    ${product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                  </span>
                </div>
              </div>
              ${product.tags?.length ? `<div class="product-meta-row"><span class="product-meta-label">Tags:</span><div style="display:flex;gap:6px;flex-wrap:wrap">${product.tags.map(t => `<span style="background:var(--bg-glass);border:1px solid var(--border);border-radius:50px;padding:2px 10px;font-size:12px;color:var(--text-secondary)">${t}</span>`).join('')}</div></div>` : ''}
            </div>

            <div class="qty-selector">
              <span class="qty-selector-label">Quantity:</span>
              <div class="qty-control">
                <button class="qty-control-btn" onclick="changeDetailQty(-1)">−</button>
                <span class="qty-display" id="detail-qty">1</span>
                <button class="qty-control-btn" onclick="changeDetailQty(1, ${product.stock})">+</button>
              </div>
            </div>

            <div class="detail-actions">
              <button class="btn btn-primary btn-lg" style="flex:1" onclick="addDetailToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" ${product.stock === 0 ? 'disabled' : ''}>
                🛒 Add to Cart
              </button>
              <button class="btn btn-outline btn-lg" onclick="buyNow(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                ⚡ Buy Now
              </button>
            </div>

            <div class="detail-features">
              <div class="feature-chip">🚚 Free delivery over ₹999</div>
              <div class="feature-chip">↩️ 7 day returns</div>
              <div class="feature-chip">🔒 Secure checkout</div>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div style="margin-top:64px">
          <h2 style="font-family:var(--font-display);font-size:28px;font-weight:800;margin-bottom:32px">Customer Reviews</h2>
          <div id="reviews-section">
            ${renderReviews(product.reviews || [])}
          </div>

          ${AuthManager.isLoggedIn() ? `
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px;margin-top:24px">
            <h3 style="font-size:18px;font-weight:700;margin-bottom:20px">Write a Review</h3>
            <div class="modal-form">
              <div class="form-group">
                <label class="form-label">Rating</label>
                <div class="star-rating" id="review-stars">
                  ${[1,2,3,4,5].map(i => `<span class="star" data-val="${i}" onclick="setReviewStar(${i})" onmouseover="hoverStar(${i})" onmouseout="resetStars()">☆</span>`).join('')}
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Comment</label>
                <textarea id="review-comment" class="form-input" rows="4" placeholder="Share your experience with this product..."></textarea>
              </div>
              <button class="btn btn-primary" onclick="submitReview('${product._id}')">Submit Review</button>
            </div>
          </div>` : `
          <div style="background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-md);padding:20px;text-align:center;margin-top:24px">
            <p style="color:var(--text-secondary)">Please <button onclick="openAuthModal('login')" style="background:none;border:none;color:var(--accent-light);font-weight:600;cursor:pointer">login</button> to write a review.</p>
          </div>`}
        </div>
      </div>`;

    window._currentDetailQty = 1;
    window._currentDetailMaxQty = product.stock;
  } catch (err) {
    page.innerHTML = `<div class="container section" style="text-align:center;padding:80px 0"><p style="font-size:48px">⚠️</p><h2 style="margin:16px 0 8px">Product not found</h2><button class="btn btn-primary" onclick="navigateTo('products')">Browse Products</button></div>`;
  }
}

function renderReviews(reviews) {
  if (!reviews.length) return `<p style="color:var(--text-muted);padding:20px 0">No reviews yet. Be the first to review!</p>`;
  return reviews.map(r => `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:20px;margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-light));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px">
          ${r.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style="font-weight:600;font-size:14px">${r.name}</p>
          <p style="font-size:12px;color:var(--text-muted)">${formatDate(r.createdAt)}</p>
        </div>
        <div style="margin-left:auto">${renderStars(r.rating)}</div>
      </div>
      <p style="font-size:14px;color:var(--text-secondary)">${r.comment}</p>
    </div>
  `).join('');
}

let selectedReviewRating = 0;
function setReviewStar(val) { selectedReviewRating = val; updateStarUI(); }
function hoverStar(val) { document.querySelectorAll('#review-stars .star').forEach((s, i) => s.textContent = i < val ? '★' : '☆'); }
function resetStars() { updateStarUI(); }
function updateStarUI() { document.querySelectorAll('#review-stars .star').forEach((s, i) => { s.textContent = i < selectedReviewRating ? '★' : '☆'; s.classList.toggle('lit', i < selectedReviewRating); }); }

async function submitReview(productId) {
  if (!selectedReviewRating) return showToast('Please select a star rating!', 'error');
  const comment = document.getElementById('review-comment').value.trim();
  if (!comment) return showToast('Please write a comment!', 'error');
  try {
    await ProductsAPI.addReview(productId, { rating: selectedReviewRating, comment });
    showToast('Review submitted! ⭐', 'success');
    loadProductDetail(productId);
  } catch (e) { showToast(e.message, 'error'); }
}

function changeDetailQty(delta, max = 99) {
  window._currentDetailQty = Math.max(1, Math.min((window._currentDetailQty || 1) + delta, max));
  document.getElementById('detail-qty').textContent = window._currentDetailQty;
}

function addDetailToCart(product) {
  CartManager.addItem(product, window._currentDetailQty || 1);
  openCartSidebar();
}

function buyNow(product) {
  CartManager.addItem(product, window._currentDetailQty || 1);
  closeCartSidebar();
  navigateTo('cart');
}

// ─── Cart Page ───────────────────────────────────────────────
function loadCartPage() {
  const cart = CartManager.getCart();
  const container = document.getElementById('cart-page-items');

  if (cart.length === 0) {
    document.getElementById('cart-page-content').innerHTML = `
      <div style="text-align:center;padding:80px 0">
        <p style="font-size:64px;margin-bottom:16px">🛒</p>
        <h2 style="font-size:28px;font-weight:800;margin-bottom:8px">Your cart is empty</h2>
        <p style="color:var(--text-muted);margin-bottom:24px">Add some amazing products first!</p>
        <button class="btn btn-primary btn-lg" onclick="navigateTo('products')">Start Shopping</button>
      </div>`;
    return;
  }

  const subtotal = CartManager.getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  document.getElementById('cart-page-content').innerHTML = `
    <div class="cart-page-grid">
      <div id="cart-page-items">
        ${cart.map(item => `
          <div class="order-list-item" style="margin-bottom:12px">
            <img src="${item.image}" alt="${item.name}" style="width:90px;height:90px;border-radius:10px;object-fit:cover">
            <div>
              <h4 style="font-size:15px;font-weight:700;margin-bottom:4px">${item.name}</h4>
              <p style="font-size:13px;color:var(--text-muted);margin-bottom:10px">${item.category}</p>
              <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeCartPageQty('${item._id}', ${item.quantity - 1}, ${item.stock})">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" onclick="changeCartPageQty('${item._id}', ${item.quantity + 1}, ${item.stock})">+</button>
                <button class="remove-item-btn" onclick="removeCartPageItem('${item._id}')">🗑</button>
              </div>
            </div>
            <div style="text-align:right">
              <p style="font-size:18px;font-weight:800;color:var(--accent-light)">${formatPrice(item.price * item.quantity)}</p>
              <p style="font-size:13px;color:var(--text-muted)">${formatPrice(item.price)} each</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="order-card">
        <h3 style="font-family:var(--font-display);font-size:20px;font-weight:700;margin-bottom:20px">Order Summary</h3>
        <div class="cart-summary">
          <div class="cart-total-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
          <div class="cart-total-row"><span>Shipping</span><span style="color:${shipping === 0 ? 'var(--success)' : ''}">${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
          <div class="cart-total-row"><span>GST (18%)</span><span>${formatPrice(tax)}</span></div>
          <div class="cart-total-row grand"><span>Total</span><span style="color:var(--accent-light)">${formatPrice(total)}</span></div>
        </div>
        ${shipping > 0 ? `<p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">Add ${formatPrice(999 - subtotal)} more for free shipping!</p>` : ''}
        <button class="btn btn-primary btn-full btn-lg" onclick="proceedToCheckout()">Proceed to Checkout →</button>
        <button class="btn btn-ghost btn-full" style="margin-top:10px" onclick="navigateTo('products')">Continue Shopping</button>
      </div>
    </div>`;
}

function changeCartPageQty(id, qty, stock) { CartManager.updateQty(id, Math.min(qty, stock)); loadCartPage(); }
function removeCartPageItem(id) { CartManager.removeItem(id); loadCartPage(); }

function proceedToCheckout() {
  if (!AuthManager.isLoggedIn()) { openAuthModal('login'); showToast('Please login to checkout!', 'info'); return; }
  showCheckoutModal();
}

function showCheckoutModal() {
  const cart = CartManager.getCart();
  const subtotal = CartManager.getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  document.getElementById('checkout-modal').classList.add('open');
  document.getElementById('checkout-total-display').textContent = formatPrice(total);
}

async function placeOrder() {
  const cart = CartManager.getCart();
  if (!cart.length) return;

  const street = document.getElementById('co-street').value.trim();
  const city = document.getElementById('co-city').value.trim();
  const state = document.getElementById('co-state').value.trim();
  const zipCode = document.getElementById('co-zip').value.trim();
  const country = document.getElementById('co-country').value.trim() || 'India';
  const paymentMethod = document.getElementById('co-payment').value;

  if (!street || !city || !state || !zipCode) return showToast('Please fill all shipping fields!', 'error');

  const subtotal = CartManager.getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const orderData = {
    orderItems: cart.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
    shippingAddress: { street, city, state, zipCode, country },
    paymentMethod,
    itemsPrice: subtotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total
  };

  try {
    const btn = document.getElementById('place-order-btn');
    btn.disabled = true; btn.textContent = 'Placing Order...';
    await OrdersAPI.create(orderData);
    CartManager.clear();
    document.getElementById('checkout-modal').classList.remove('open');
    showToast('🎉 Order placed successfully!', 'success');
    navigateTo('orders');
  } catch (e) {
    showToast(e.message, 'error');
    document.getElementById('place-order-btn').disabled = false;
    document.getElementById('place-order-btn').textContent = 'Place Order';
  }
}

// ─── Orders Page ─────────────────────────────────────────────
async function loadOrdersPage() {
  const el = document.getElementById('orders-list');
  if (!AuthManager.isLoggedIn()) {
    el.innerHTML = `<div style="text-align:center;padding:60px 0"><p style="font-size:48px">🔒</p><h3 style="margin:12px 0 6px">Login to view orders</h3><button class="btn btn-primary" onclick="openAuthModal('login')">Login</button></div>`;
    return;
  }
  el.innerHTML = `<div class="loading-state"><div class="spinner"></div><p style="color:var(--text-muted)">Loading orders...</p></div>`;
  try {
    const orders = await OrdersAPI.getMyOrders();
    if (!orders.length) { el.innerHTML = `<div style="text-align:center;padding:60px 0"><p style="font-size:48px">📦</p><h3 style="margin:12px 0 6px">No orders yet</h3><button class="btn btn-primary" onclick="navigateTo('products')">Start Shopping</button></div>`; return; }
    el.innerHTML = orders.map(o => `
      <div class="order-list-item">
        <div>
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:4px">Order ID</p>
          <p style="font-family:monospace;font-size:13px;font-weight:600">#${o._id.slice(-8).toUpperCase()}</p>
        </div>
        <div>
          <p style="font-weight:700;margin-bottom:4px">${o.orderItems.length} item(s) · ${formatPrice(o.totalPrice)}</p>
          <p style="font-size:13px;color:var(--text-muted)">Placed on ${formatDate(o.createdAt)}</p>
        </div>
        <span class="order-status-badge status-${o.status.toLowerCase()}">${o.status}</span>
      </div>
    `).join('');
  } catch (e) {
    el.innerHTML = `<p style="color:var(--error);text-align:center;padding:40px">Failed to load orders. Make sure you're connected.</p>`;
  }
}

// ─── Auth Forms ──────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');
  btn.disabled = true; btn.textContent = 'Logging in...';
  try {
    const data = await AuthAPI.login({ email, password });
    AuthManager.saveSession(data);
    closeAuthModal();
    showToast(`Welcome back, ${data.name}! 👋`, 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally { btn.disabled = false; btn.textContent = 'Login'; }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const btn = document.getElementById('register-btn');
  btn.disabled = true; btn.textContent = 'Creating account...';
  try {
    const data = await AuthAPI.register({ name, email, password });
    AuthManager.saveSession(data);
    closeAuthModal();
    showToast(`Welcome, ${data.name}! 🎉`, 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally { btn.disabled = false; btn.textContent = 'Create Account'; }
}

// ─── Navbar search ───────────────────────────────────────────
document.getElementById('nav-search-input')?.addEventListener('input', debounce((e) => {
  const kw = e.target.value.trim();
  if (kw) { navigateTo('products'); searchProducts(kw); }
}, 400));

function debounce(fn, delay) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ─── Navbar scroll effect ────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// ─── Nav user dropdown ────────────────────────────────────────
document.getElementById('nav-user-section')?.addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('nav-dropdown').classList.toggle('open');
});
document.addEventListener('click', () => {
  document.getElementById('nav-dropdown')?.classList.remove('open');
});

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  AuthManager.updateNavUI();
  CartManager.updateCartUI();
  navigateTo('home');
});
