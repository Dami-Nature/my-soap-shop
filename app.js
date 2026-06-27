// Rendering and filtering logic

const TG_LINK = 'https://t.me/EmiliyaT';
const MAX_LINK = 'https://max.ru/u/f9LHodD0cOJED4Pjd_kQjh36VllBLFJ6e9O1iuunwgQ6yELzlDR-bTbPFfg';

// Emoji placeholders when no image
const CATEGORY_EMOJI = {
  soap: '✦', face: '❋', body: '✾', hair: '❧', tea: '🫖', set: '❦'
};

function productCard(p) {
  const price = p.price
    ? `<span class="product-price">${p.price.toLocaleString('ru')} ₽</span>`
    : `<span></span>`;
  const weight = p.weight
    ? `<span class="product-weight">от ${p.weight}</span>`
    : `<span></span>`;
  const emoji = CATEGORY_EMOJI[p.category] || '🌿';

  return `
    <div class="product-card" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer">
      <img
        class="product-img"
        src="${p.image}"
        alt="${p.name}"
        onerror="this.outerHTML='<div class=\\'product-img-placeholder\\'>${emoji}</div>'"
      />
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-meta">${weight}${price}</div>
        <div class="product-btns">
          <button class="product-btn" onclick="event.stopPropagation();window.open('${TG_LINK}?text=Хочу заказать: ${encodeURIComponent(p.name)}','_blank')">
            Написать в Telegram
          </button>
          <button class="product-btn" onclick="event.stopPropagation();window.open('${MAX_LINK}','_blank')">
            Написать в MAX
          </button>
        </div>
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

// ─── MAIN PAGE ───────────────────────────────────────────────
function initIndex() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.featured);
  renderGrid(grid, featured);
}

// ─── COSMETICS PAGE ──────────────────────────────────────────
let _cosmeticsCat = 'soap';
let _cosmeticsSub = null;

function selectSoapFolder(el) {
  const sub = el.dataset.sub || null;
  _cosmeticsSub = sub;
  history.replaceState(null, '', _cosmeticsSub ? `?cat=soap&sub=${_cosmeticsSub}` : '?cat=soap');
  updateCosmetics();
}

function initCosmetics() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  _cosmeticsCat = params.get('cat') || 'soap';
  _cosmeticsSub = params.get('sub') || null;

  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _cosmeticsCat = tab.dataset.cat;
      _cosmeticsSub = null;
      history.replaceState(null, '', `?cat=${_cosmeticsCat}`);
      updateCosmetics();
    });
  });

  updateCosmetics();
}

function updateCosmetics() {
  const grid = document.getElementById('products-grid');
  const foldersEl = document.getElementById('soap-folders');
  const labelEl = document.getElementById('grid-label');
  const cat = _cosmeticsCat;
  const sub = _cosmeticsSub;

  // Update tab active states
  document.querySelectorAll('.filter-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.cat === cat));

  // Folders: show only on soap tab
  foldersEl.style.display = cat === 'soap' ? 'block' : 'none';

  // Highlight active folder
  document.querySelectorAll('.soap-folder').forEach(f =>
    f.classList.toggle('active', f.dataset.sub === sub));

  // Grid label
  const labels = { household: 'Хозяйственное мыло', children: 'Детское мыло', medicinal: 'Лечебное мыло' };
  if (cat === 'soap' && sub) {
    labelEl.style.display = 'block';
    labelEl.textContent = labels[sub] || '';
  } else if (cat === 'soap') {
    labelEl.style.display = 'block';
    labelEl.textContent = 'Всё мыло';
  } else {
    labelEl.style.display = 'none';
  }

  // Filter products
  let items = PRODUCTS.filter(p => {
    if (cat === 'soap') {
      if (p.category !== 'soap') return false;
      if (!sub) return p.subcategory === 'all' || !p.subcategory;
      return p.subcategory === sub;
    }
    return p.category === cat;
  });

  renderGrid(grid, items);
}

// ─── TEAS PAGE ───────────────────────────────────────────────
function initTeas() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  renderGrid(grid, PRODUCTS.filter(p => p.category === 'tea'));
}

// ─── SETS PAGE ───────────────────────────────────────────────
function initSets() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  renderGrid(grid, PRODUCTS.filter(p => p.category === 'set'));
}

// ─── BOOT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop() || 'index.html';
  if (page === 'index.html' || page === '') initIndex();
  else if (page === 'cosmetics.html') initCosmetics();
  else if (page === 'teas.html') initTeas();
  else if (page === 'sets.html') initSets();
});
