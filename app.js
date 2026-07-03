// Rendering and filtering logic

// Emoji placeholders when no image
const CATEGORY_EMOJI = {
  soap: '✦', face: '❋', body: '✾', hair: '❧', tea: '🤖', set: '❦'
};

const SKIN_RE = /^(всех|сухой|жирной|комбинированной|нормальной|чувствительной)/i;

function splitProductName(name) {
  const idx = name.indexOf(' для ');
  if (idx === -1) return { main: name, sub: '' };
  if (!SKIN_RE.test(name.slice(idx + 5))) return { main: name, sub: '' };
  return { main: name.slice(0, idx), sub: name.slice(idx + 1) };
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
  if (btn) {
    btn.textContent = '✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'В корзину'; btn.disabled = false; }, 1400);
  }
}

function productCard(p) {
  const price = p.price
    ? `<span class="product-price">${p.price.toLocaleString('ru')} ₽</span>`
    : `<span></span>`;
  const weight = p.weight
    ? `<span class="product-weight">от ${p.weight}</span>`
    : `<span></span>`;
  const emoji = CATEGORY_EMOJI[p.category] || '🌿';
  const { main, sub } = splitProductName(p.name);
  const safeName = p.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  return `
    <div class="product-card" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer">
      <img
        class="product-img"
        src="${p.image}"
        alt="${p.name}"
        onerror="this.outerHTML='<div class=\\'product-img-placeholder\\'>${emoji}</div>'"
      />
      <div class="product-info">
        <div class="product-name">${main}</div>
        ${sub ? `<div class="product-skin">${sub}</div>` : ''}
        <div class="product-meta">${weight}${price}</div>
        <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${p.id}, '${safeName}', this)">В корзину</button>
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

  const labels = { household: 'Хозяйственное мыло', children: 'Детское мыло', archive: 'Прошлые коллекции' };
  labelEl.style.display = 'block';
  labelEl.textContent = sub ? (labels[sub] || '') : 'Всё мыло';

  const items = PRODUCTS.filter(p => {
    if (p.category !== 'soap') return false;
    if (!sub) return p.subcategory === 'all' || !p.subcategory;
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
