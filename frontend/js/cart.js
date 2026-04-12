// ============================================================
//  Sahu Store — Cart Manager (localStorage)
// ============================================================

const CartManager = (() => {
  const KEY = 'shopzen_cart';

  const getCart = () => JSON.parse(localStorage.getItem(KEY) || '[]');

  const saveCart = (cart) => {
    localStorage.setItem(KEY, JSON.stringify(cart));
    updateCartUI();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const addItem = (product, qty = 1) => {
    const cart = getCart();
    const idx = cart.findIndex(i => i._id === product._id);
    if (idx > -1) {
      cart[idx].quantity = Math.min(cart[idx].quantity + qty, product.stock);
    } else {
      cart.push({ ...product, quantity: qty });
    }
    saveCart(cart);
    showToast(`${product.name} added to cart! 🛒`, 'success');
  };

  const removeItem = (productId) => {
    const cart = getCart().filter(i => i._id !== productId);
    saveCart(cart);
  };

  const updateQty = (productId, qty) => {
    const cart = getCart();
    const idx = cart.findIndex(i => i._id === productId);
    if (idx > -1) {
      if (qty <= 0) { cart.splice(idx, 1); }
      else { cart[idx].quantity = qty; }
    }
    saveCart(cart);
  };

  const clear = () => {
    saveCart([]);
  };

  const getCount = () => getCart().reduce((s, i) => s + i.quantity, 0);
  const getTotal = () => getCart().reduce((s, i) => s + i.price * i.quantity, 0);

  const updateCartUI = () => {
    const count = getCount();
    document.querySelectorAll('.cart-count-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  };

  return { getCart, addItem, removeItem, updateQty, clear, getCount, getTotal, updateCartUI };
})();
