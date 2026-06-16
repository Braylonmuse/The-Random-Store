// ---------- Cart helpers ----------
function getCart() {
  return JSON.parse(localStorage.getItem('trs-cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('trs-cart', JSON.stringify(cart));
}
function addToCart(productId, size) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId && i.size === size);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ id: productId, size, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  showToast('Added to cart!');
}
function removeFromCart(productId, size) {
  let cart = getCart().filter(i => !(i.id === productId && i.size === size));
  saveCart(cart);
  renderCart();
  updateCartCount();
}
function changeQty(productId, size, delta) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId && i.size === size);
  if (idx > -1) {
    cart[idx].qty = Math.max(1, cart[idx].qty + delta);
    saveCart(cart);
    renderCart();
    updateCartCount();
  }
}
function updateCartCount() {
  const total = getCart().reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('#cart-count, #cart-count-mobile').forEach(el => {
    el.textContent = total;
  });
}

// ---------- Toast ----------
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ---------- Render product card ----------
function renderProducts(list, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<p class="no-results">No products found.</p>';
    return;
  }
  container.innerHTML = list.map(p => `
    <div class="product-card">
      ${p.tag ? `<span class="product-tag tag-${p.tag}">${p.tag}</span>` : ''}
      <div class="product-emoji">${p.emoji}</div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <p class="product-price">$${p.price.toFixed(2)}</p>
        <div class="product-actions">
          <select class="size-select" id="size-${p.id}">
            ${p.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>
          <button class="btn-primary btn-add" onclick="handleAdd(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

function handleAdd(productId) {
  const sel = document.getElementById(`size-${productId}`);
  const size = sel ? sel.value : 'One Size';
  addToCart(productId, size);
}

// ---------- Render cart page ----------
function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');
  if (!itemsEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="empty-cart">
        <p class="big-emoji">🛒</p>
        <p>Your cart is empty.</p>
        <a href="shop.html" class="btn-primary">Shop Now</a>
      </div>`;
    summaryEl.innerHTML = '';
    return;
  }

  let subtotal = 0;
  itemsEl.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return '';
    const lineTotal = p.price * item.qty;
    subtotal += lineTotal;
    return `
      <div class="cart-item">
        <div class="cart-item-emoji">${p.emoji}</div>
        <div class="cart-item-info">
          <h4>${p.name}</h4>
          <p class="cart-item-size">Size: ${item.size}</p>
          <p class="cart-item-price">$${p.price.toFixed(2)} each</p>
        </div>
        <div class="cart-item-controls">
          <button onclick="changeQty(${item.id},'${item.size}',-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id},'${item.size}',1)">+</button>
        </div>
        <div class="cart-item-total">$${lineTotal.toFixed(2)}</div>
        <button class="cart-remove" onclick="removeFromCart(${item.id},'${item.size}')">✕</button>
      </div>`;
  }).join('');

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  summaryEl.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span class="free-ship">FREE</span>' : '$' + shipping.toFixed(2)}</span></div>
    ${shipping > 0 ? `<p class="ship-notice">Add $${(50 - subtotal).toFixed(2)} more for free shipping!</p>` : ''}
    <div class="summary-row total-row"><span>Total</span><span>$${total.toFixed(2)}</span></div>
    <button class="btn-primary checkout-btn" onclick="handleCheckout()">Checkout</button>
    <a href="shop.html" class="btn-outline">Continue Shopping</a>`;
}

function handleCheckout() {
  showToast('Checkout coming soon! 🚀');
}

// ---------- Mobile nav ----------
document.addEventListener('DOMContentLoaded', () => {
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (ham && menu) {
    ham.addEventListener('click', () => menu.classList.toggle('open'));
  }
});
