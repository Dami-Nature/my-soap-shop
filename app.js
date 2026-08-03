// Rendering and filtering logic

const SKIN_RE = /^(всех|сухой|жирной|комбинированной|нормальной|чувствительной)/i;

function splitProductName(name) {
  const idx = name.indexOf(' для ');
  if (idx !== -1 && SKIN_RE.test(name.slice(idx + 5))) {
    return { main: name.slice(0, idx), sub: name.slice(idx + 1) };
  }
  if (name.endsWith(' Очищающее')) {
    return { main: name.slice(0, -' Очищающее'.length), sub: 'Очищающее' };
  }
  return { main: name, sub: '' };
}

function addToCart(id, name, btn) {
  const cart = JSON.parse(localStorage.getItem('dami_cart') || '[]');
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty = (existing.qty || 1) + 1;
  else cart.push({ id, name, qty: 1 });
  localStorage.setItem('dami_cart', JSON.stringify(cart));
  if (window.updateCartCount) window.updateCartCount();
  const toast = document.getElementById('cart-toast');
  if (toast) { toast.style.display = 'block'; setTimeout(() => { toast.style.display = 'none'; }, 2000); }
  refreshCardQtyCtrl(id, name);
}

function cardChangeQty(id, name, delta) {
  const cart = JSON.parse(localStorage.getItem('dami_cart') || '[]');
  const existing = cart.find(i => i.id === id);
  if (!existing) return;
  existing.qty = (existing.qty || 1) + delta;
  if (existing.qty <= 0) localStorage.setItem('dami_cart', JSON.stringify(cart.filter(i => i.id !== id)));
  else localStorage.setItem('dami_cart', JSON.stringify(cart));
  if (window.updateCartCount) window.updateCartCount();
  refreshCardQtyCtrl(id, name);
}

function refreshCardQtyCtrl(id, name) {
  const el = document.getElementById('card-qty-' + id);
  if (!el) return;
  const cart = JSON.parse(localStorage.getItem('dami_cart') || '[]');
  const cartItem = cart.find(i => i.id === id);
  const qty = cartItem ? (cartItem.qty || 1) : 0;
  const safe = name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  if (qty > 0) {
    el.outerHTML = `<div class="card-qty-ctrl" id="card-qty-${id}">
      <div class="card-in-cart-label">Уже в корзине</div>
      <div class="card-qty-row">
        <button class="qty-btn" onclick="event.stopPropagation(); cardChangeQty(${id}, '${safe}', -1)">−</button>
        <span class="qty-val">${qty}</span>
        <button class="qty-btn" onclick="event.stopPropagation(); cardChangeQty(${id}, '${safe}', 1)">+</button>
      </div>
    </div>`;
  } else {
    el.outerHTML = `<button class="btn-add-cart" id="card-qty-${id}" onclick="event.stopPropagation(); addToCart(${id}, '${safe}', this)">В корзину</button>`;
  }
}

function productCard(p) {
  const price = p.price
    ? `<span class="product-price">${p.price.toLocaleString('ru')} ₽</span>`
    : `<span></span>`;
  const weight = p.weight
    ? `<span class="product-weight">от ${p.weight}</span>`
    : `<span></span>`;
  const { main, sub } = splitProductName(p.name);
  const safeName = p.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const _cartNow = JSON.parse(localStorage.getItem('dami_cart') || '[]');
  const _cartItem = _cartNow.find(i => i.id === p.id);
  const _cartQty  = _cartItem ? (_cartItem.qty || 1) : 0;
  const cartCtrl  = _cartQty > 0
    ? `<div class="card-qty-ctrl" id="card-qty-${p.id}">
         <div class="card-in-cart-label">Уже в корзине</div>
         <div class="card-qty-row">
           <button class="qty-btn" onclick="event.stopPropagation(); cardChangeQty(${p.id}, '${safeName}', -1)">−</button>
           <span class="qty-val">${_cartQty}</span>
           <button class="qty-btn" onclick="event.stopPropagation(); cardChangeQty(${p.id}, '${safeName}', 1)">+</button>
         </div>
       </div>`
    : `<button class="btn-add-cart" id="card-qty-${p.id}" onclick="event.stopPropagation(); addToCart(${p.id}, '${safeName}', this)">В корзину</button>`;

  return `
    <div class="product-card" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer">
      <img
        class="product-img"
        src="${p.image}"
        alt="${p.name}"
        onerror="this.outerHTML=leafPlaceholderHTML('product-img-placeholder')"
      />
      <div class="product-info">
        ${p.category === 'soap' ? '<div class="product-cat-label">Мыло</div>' : ''}
        ${p.category === 'tea' ? '<div class="product-cat-label">Чай</div>' : ''}
        <div class="product-name">${main.replace('«7 трав»', '<br>«7 трав»')}</div>
        ${sub ? `<div class="product-skin">${sub}</div>` : ''}
        <div class="product-meta">${weight}${price}</div>
        ${cartCtrl}
      </div>
    </div>
  `;
}

function renderGrid(container, items) {
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Товары скоро появятся</div>';
    return;
  }
  container.innerHTML = items.map(productCard).join('');
}

// ─── MAIN PAGE ───────────────────────────────────────
function initIndex() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.featured);
  renderGrid(grid, featured);
}

// ─── COSMETICS PAGE (лицо/тело/волосы — без мыла) ─────
let _cosmeticsCat = 'face';

function initCosmetics() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  _cosmeticsCat = params.get('cat') || 'face';

  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _cosmeticsCat = tab.dataset.cat;
      history.replaceState(null, '', `?cat=${_cosmeticsCat}`);
      updateCosmetics();
    });
  });

  updateCosmetics();
}

function updateCosmetics() {
  const grid = document.getElementById('products-grid');
  const cat = _cosmeticsCat;

  document.querySelectorAll('.filter-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.cat === cat));

  renderGrid(grid, PRODUCTS.filter(p => p.category === cat));
}

// ─── SOAP PAGE (своя страница, без лица/тела/волос) ───
let _soapSub = null;

function selectSoapFolder(el) {
  _soapSub = el.dataset.sub || null;
  history.replaceState(null, '', _soapSub ? `?sub=${_soapSub}` : location.pathname);
  updateSoap();
}

function initSoap() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  _soapSub = params.get('sub') || null;

  updateSoap();
}

function updateSoap() {
  const grid = document.getElementById('products-grid');
  const labelEl = document.getElementById('grid-label');
  const sub = _soapSub;

  document.querySelectorAll('.filter-tab').forEach(f =>
    f.classList.toggle('active', (f.dataset.sub || null) === sub));

  const labels = {
    all: 'Для всех типов кожи',
    dry: 'Для сухой кожи',
    cleansing: 'Очищающее',
    children: 'Детское мыло',
    household: 'Хозяйственное мыло',
    archive: 'Прошлые коллекции'
  };
  labelEl.style.display = 'block';
  labelEl.textContent = sub ? (labels[sub] || '') : 'Всё мыло';

  const items = PRODUCTS.filter(p => {
    if (p.category !== 'soap') return false;
    if (!sub) return true;
    return p.subcategory === sub;
  });

  renderGrid(grid, items);
}

// ─── TEAS PAGE ─────────────────────────────────────
function initTeas() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  renderGrid(grid, PRODUCTS.filter(p => p.category === 'tea'));
}

// ─── SETS PAGE ─────────────────────────────────────
function renderSetsGallery() {
  const wrap = document.getElementById('sets-gallery');
  if (!wrap) return;
  const photos = (typeof CONFIG !== 'undefined' && CONFIG.setsGallery) || [];
  if (!photos.length) {
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = 'grid';
  wrap.innerHTML = photos.map(src =>
    `<img class="sets-gallery-img" src="${src}" alt="" onerror="this.outerHTML='<div class=\\'sets-gallery-ph\\'>🎁</div>'">`
  ).join('');
}

function initSets() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  renderSetsGallery();
  renderGrid(grid, PRODUCTS.filter(p => p.category === 'set'));
}

// ─── BOOT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop() || 'index.html';
  if (page === 'index.html' || page === '') initIndex();
  else if (page === 'cosmetics.html') initCosmetics();
  else if (page === 'soap.html') initSoap();
  else if (page === 'teas.html') initTeas();
  else if (page === 'sets.html') initSets();
});
