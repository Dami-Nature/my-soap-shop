# Галерея товаров + расширенная админка — План реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Карусель фото на странице товара, два таба в admin.html (Товары/Сайт), мульти-фото у товаров, редактирование контента главной страницы через админку.

**Architecture:** Новый `config.js` хранит настройки главной (hero/about/cards). `index.html` подгружает его и рендерит динамически. `product.html` строит карусель из `p.image + p.images[]`. `admin.html` получает два таба, полосу миниатюр в редакторе товара, и таб «Сайт» с bottom-sheet для каждого раздела.

**Tech Stack:** Vanilla JS, HTML/CSS, GitHub Contents API (без фреймворков)

**Spec:** `docs/superpowers/specs/2026-06-05-gallery-and-admin-design.md`

---

### Task 1: Создать config.js

**Files:**
- Create: `D:\Claude\Soap\config.js`

- [ ] **Шаг 1: Создать файл**

```js
// Настройки сайта ДАМИ — редактировать через admin.html
const CONFIG = {
  hero: {
    image: 'images/hero.jpg'
  },
  about: {
    image: 'images/about.jpg',
    text: 'Приветствую Вас!\n\nМеня зовут Эмилия ❤️\n\nНемного обо мне)\nЯ родилась в Сибири, в Иркутске, в 60 км от озера Байкал. Часто время проводила на природе. Поэтому Лес для меня совершенно понятное и родное место, особенно хвойный.\n\nВ 20 лет уехала учиться в Москву. И получила Медицинское и Психологическое образование, а дальше — Ароматерапия, Фитотерапия, Аюрведа, Нутрициология…\n\nВся моя учеба всегда была и есть про здоровье 💚\n\nЯ рада, когда могу минимизировать синтетические продукты в своей жизни и быть ближе к природе.\n\nБуду делиться с Вами тем, что у меня есть ❤️'
  },
  categoryCards: {
    cosmetics: 'images/cosmetics-card.jpg',
    teas: 'images/teas-card.jpg',
    sets: null
  }
};
```

- [ ] **Шаг 2: Коммит**

```bash
cd D:/Claude/Soap
git add config.js
git commit -m "feat: add config.js for site settings"
```

---

### Task 2: Обновить index.html — динамический рендер из config.js

**Files:**
- Modify: `D:\Claude\Soap\index.html`

- [ ] **Шаг 1: Полностью заменить index.html**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Дами — Натуральная косметика</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Hero -->
  <section class="hero" id="hero-section">
    <div class="hero-title">Дами</div>
    <div class="hero-sub">Натуральная косметика ручной работы</div>
    <div class="hero-btns">
      <a href="cosmetics.html" class="btn-primary">Смотреть каталог</a>
      <a href="https://t.me/EmiliyaT" class="btn-outline" target="_blank">Написать в Telegram</a>
    </div>
  </section>

  <!-- Categories -->
  <section class="section" style="background: #4a7c59;">
    <div class="section-title">Каталог</div>
    <div class="cat-grid">
      <a href="cosmetics.html" class="cat-card">
        <img id="card-cosmetics-img" src="images/cosmetics-card.jpg" alt="Косметика" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;margin-bottom:14px;">
        <div class="cat-name">Косметика</div>
        <div class="cat-desc">мыло · кремы · масла</div>
      </a>
      <a href="teas.html" class="cat-card">
        <img id="card-teas-img" src="images/teas-card.jpg" alt="Чаи" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;margin-bottom:14px;">
        <div class="cat-name">Чаи</div>
        <div class="cat-desc">травяные сборы</div>
      </a>
      <a href="sets.html" class="cat-card">
        <div id="card-sets-area"><div class="cat-icon">❦</div></div>
        <div class="cat-name">Наборы</div>
        <div class="cat-desc">подарочные наборы</div>
      </a>
    </div>
  </section>

  <!-- About -->
  <section class="section section-alt" style="background: #f9d8cc; padding: 64px 0;">
    <div style="width: 100%; display: flex; gap: 16px; align-items: center; padding: 0 60px 0 60px;">
      <div id="about-text" style="flex: 1; font-size: 21px; line-height: 1.5; color: var(--text); text-align: left;"></div>
      <div style="flex-shrink: 0; margin-left: auto;">
        <img id="about-img" src="images/about.jpg" alt="Эмилия" style="width: 380px; height: 480px; object-fit: cover; border-radius: 20px 0 0 20px; box-shadow: 0 8px 28px rgba(0,0,0,0.12);">
      </div>
    </div>
  </section>

  <script src="config.js"></script>
  <script src="products.js"></script>
  <script src="nav.js"></script>
  <script src="app.js"></script>
  <script>
    (function() {
      if (typeof CONFIG === 'undefined') return;
      if (CONFIG.hero && CONFIG.hero.image)
        document.getElementById('hero-section').style.backgroundImage = "url('" + CONFIG.hero.image + "')";
      if (CONFIG.about && CONFIG.about.image)
        document.getElementById('about-img').src = CONFIG.about.image;
      if (CONFIG.about && CONFIG.about.text)
        document.getElementById('about-text').innerHTML = CONFIG.about.text.replace(/\n/g, '<br>');
      if (CONFIG.categoryCards) {
        if (CONFIG.categoryCards.cosmetics)
          document.getElementById('card-cosmetics-img').src = CONFIG.categoryCards.cosmetics;
        if (CONFIG.categoryCards.teas)
          document.getElementById('card-teas-img').src = CONFIG.categoryCards.teas;
        if (CONFIG.categoryCards.sets)
          document.getElementById('card-sets-area').innerHTML =
            '<img src="' + CONFIG.categoryCards.sets + '" alt="Наборы" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;margin-bottom:14px;">';
      }
    })();
  </script>
</body>
</html>
```

- [ ] **Шаг 2: Проверить**

Запустить локальный сервер: `python -m http.server 8080` в `D:\Claude\Soap`, открыть `http://localhost:8080`. Главная страница должна выглядеть идентично прежней — текст «О себе» с переносами, фото на месте.

- [ ] **Шаг 3: Коммит**

```bash
git add index.html
git commit -m "feat: index.html renders from config.js dynamically"
```

---

### Task 3: Карусель на странице товара

**Files:**
- Modify: `D:\Claude\Soap\product.html`

- [ ] **Шаг 1: Добавить CSS карусели в блок `<style>`**

После `.product-page-placeholder { ... }` добавить:

```css
.carousel-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #dff0e6, #ede5d5);
  aspect-ratio: 1;
}
.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.3s ease;
}
.carousel-slide {
  min-width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}
.carousel-slide-ph {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  flex-shrink: 0;
}
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.35);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.carousel-btn:hover { background: rgba(0,0,0,0.55); }
.carousel-prev { left: 8px; }
.carousel-next { right: 8px; }
.carousel-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
}
.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background 0.2s;
}
.carousel-dot.active { background: #fff; }
```

- [ ] **Шаг 2: Заменить весь `<script>` блок**

Убрать старый `<script>` после `<script src="nav.js"></script>` и вставить:

```html
<script>
  const CATEGORY_EMOJI = {
    soap: '🧼', face: '✨', body: '🌿', hair: '💧', tea: '🍵', set: '🎁'
  };
  const CAT_LABEL = {
    soap: 'Мыло', face: 'Для лица', body: 'Для тела', hair: 'Для волос', tea: 'Чаи', set: 'Наборы'
  };
  const CAT_PAGE = {
    soap: 'cosmetics.html?cat=soap', face: 'cosmetics.html?cat=face',
    body: 'cosmetics.html?cat=body', hair: 'cosmetics.html?cat=hair',
    tea: 'teas.html', set: 'sets.html'
  };

  const id = parseInt(new URLSearchParams(location.search).get('id'));
  const p  = PRODUCTS.find(x => x.id === id);
  const container = document.getElementById('product-page');

  if (!p) {
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:80px;color:var(--muted)">Товар не найден</div>';
  } else {
    document.title = `${p.name} — Дами`;
    const emoji    = CATEGORY_EMOJI[p.category] || '🌿';
    const backHref = CAT_PAGE[p.category]  || 'cosmetics.html';
    const backLabel= CAT_LABEL[p.category] || 'Каталог';
    const priceHtml  = p.price  ? `<span class="product-page-price">${p.price.toLocaleString('ru')} ₽</span>` : '';
    const weightHtml = p.weight ? `<span class="product-page-weight">от ${p.weight}</span>` : '';

    const allImages = [p.image, ...(p.images || [])].filter(Boolean);

    container.innerHTML = `
      <div id="carousel-container"></div>
      <div class="product-page-info">
        <a href="${backHref}" class="product-page-back">← ${backLabel}</a>
        <div class="product-page-name">${p.name}</div>
        <div class="product-page-desc">${p.description.replace(/\n/g, '<br>')}</div>
        <div class="product-page-meta">${weightHtml}${priceHtml}</div>
        <a href="https://t.me/EmiliyaT?text=${encodeURIComponent('Хочу заказать: ' + p.name)}"
           class="btn-tg-big" target="_blank">✈ Заказать в Telegram</a>
      </div>`;

    buildCarousel(document.getElementById('carousel-container'), allImages, emoji);
  }

  function buildCarousel(el, images, emoji) {
    if (images.length === 0) {
      el.innerHTML = `<div class="product-page-placeholder">${emoji}</div>`;
      return;
    }
    if (images.length === 1) {
      el.innerHTML = `<div class="carousel-wrap"><div class="carousel-track">
        <img class="carousel-slide" src="${images[0]}"
          onerror="this.outerHTML='<div class=\\'carousel-slide-ph\\'>${emoji}</div>'">
      </div></div>`;
      return;
    }

    const slides = images.map(src =>
      `<img class="carousel-slide" src="${src}"
         onerror="this.outerHTML='<div class=\\'carousel-slide-ph\\'>${emoji}</div>'">`
    ).join('');
    const dots = images.map((_, i) =>
      `<div class="carousel-dot${i === 0 ? ' active' : ''}" onclick="carouselGo(${i})"></div>`
    ).join('');

    el.innerHTML = `
      <div class="carousel-wrap" id="cw">
        <div class="carousel-track" id="ct">${slides}</div>
        <button class="carousel-btn carousel-prev" onclick="carouselGo(carouselIdx-1)">‹</button>
        <button class="carousel-btn carousel-next" onclick="carouselGo(carouselIdx+1)">›</button>
        <div class="carousel-dots" id="cdots">${dots}</div>
      </div>`;

    let carouselIdx = 0;
    const track  = document.getElementById('ct');
    const dotEls = Array.from(document.querySelectorAll('.carousel-dot'));
    const total  = images.length;
    let touchX   = 0;

    window.carouselGo = function(idx) {
      carouselIdx = ((idx % total) + total) % total;
      track.style.transform = `translateX(-${carouselIdx * 100}%)`;
      dotEls.forEach((d, i) => d.classList.toggle('active', i === carouselIdx));
    };

    const wrap = document.getElementById('cw');
    wrap.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) carouselGo(carouselIdx + (dx < 0 ? 1 : -1));
    });
  }
</script>
```

- [ ] **Шаг 3: Проверить**

Открыть `http://localhost:8080/product.html?id=1` — одно фото, без стрелок.

Временно добавить `images: ['images/soap-chocolate.jpg']` к товару id=1 в products.js, обновить страницу — должна появиться карусель со стрелками и свайпом. Убрать после проверки.

- [ ] **Шаг 4: Коммит**

```bash
git add product.html
git commit -m "feat: image carousel with swipe on product page"
```

---

### Task 4: Admin — два таба (структура + CSS)

**Files:**
- Modify: `D:\Claude\Soap\admin.html`

- [ ] **Шаг 1: Добавить CSS в блок `<style>`**

После `/* ── Загрузка фото ── */` добавить:

```css
/* ── Таб-бар ─────────────────────────────── */
.tab-bar {
  display: flex;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 57px;
  z-index: 9;
}
.tab-btn {
  flex: 1; padding: 10px;
  background: none; border: none;
  border-bottom: 2px solid transparent;
  color: var(--text2); font-size: 14px;
  cursor: pointer; font-family: inherit;
}
.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

/* ── Полоса миниатюр ─────────────────────── */
.photo-strip { display: flex; flex-wrap: wrap; gap: 8px; }
.photo-thumb-wrap { position: relative; }
.photo-thumb-img { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; display: block; }
.photo-thumb-del {
  position: absolute; top: -6px; right: -6px;
  background: var(--danger); color: #fff; border: none;
  border-radius: 50%; width: 20px; height: 20px;
  font-size: 13px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.photo-add {
  width: 72px; height: 72px; border-radius: 10px;
  border: 2px dashed var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; color: var(--text2); cursor: pointer;
}
.photo-add:active { border-color: var(--accent); color: var(--accent); }
```

- [ ] **Шаг 2: Обновить HTML главного экрана**

Кнопке «+ Добавить» добавить `id="add-btn"`.

Заменить `<div class="main-content" id="products-list"></div>` на:

```html
<div class="tab-bar">
  <button class="tab-btn active" id="tab-btn-products" onclick="switchTab('products')">Товары</button>
  <button class="tab-btn" id="tab-btn-site" onclick="switchTab('site')">Сайт</button>
</div>

<div class="main-content" id="products-tab">
  <div id="products-list"></div>
</div>

<div class="main-content hidden" id="site-tab">
  <div class="category-header">🏠 Главная страница</div>
  <div class="product-item" onclick="openSiteEdit('hero-image')">
    <div class="product-placeholder">🌿</div>
    <div class="product-info"><div class="product-name">Фото баннера</div><div class="product-meta" id="se-hero-path"></div></div>
    <div style="color:#444;font-size:22px">›</div>
  </div>

  <div class="category-header">👤 Блок «О себе»</div>
  <div class="product-item" onclick="openSiteEdit('about-image')">
    <div class="product-placeholder">🤳</div>
    <div class="product-info"><div class="product-name">Фото Эмилии</div><div class="product-meta" id="se-about-img"></div></div>
    <div style="color:#444;font-size:22px">›</div>
  </div>
  <div class="product-item" onclick="openSiteEdit('about-text')">
    <div class="product-placeholder">✏️</div>
    <div class="product-info"><div class="product-name">Текст биографии</div><div class="product-meta" id="se-about-text-preview" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div></div>
    <div style="color:#444;font-size:22px">›</div>
  </div>

  <div class="category-header">🗂 Карточки каталога</div>
  <div class="product-item" onclick="openSiteEdit('card-cosmetics')">
    <div class="product-placeholder">🌸</div>
    <div class="product-info"><div class="product-name">Косметика — фото</div><div class="product-meta" id="se-card-cosmetics"></div></div>
    <div style="color:#444;font-size:22px">›</div>
  </div>
  <div class="product-item" onclick="openSiteEdit('card-teas')">
    <div class="product-placeholder">🍵</div>
    <div class="product-info"><div class="product-name">Чаи — фото</div><div class="product-meta" id="se-card-teas"></div></div>
    <div style="color:#444;font-size:22px">›</div>
  </div>
  <div class="product-item" onclick="openSiteEdit('card-sets')">
    <div class="product-placeholder">🎁</div>
    <div class="product-info"><div class="product-name">Наборы — фото</div><div class="product-meta" id="se-card-sets"></div></div>
    <div style="color:#444;font-size:22px">›</div>
  </div>
</div>
```

Также добавить после `<!-- ══════ ДИАЛОГ ПОДТВЕРЖДЕНИЯ ══════ -->`:

```html
<!-- ══════ МОДАЛ: РЕДАКТИРОВАНИЕ САЙТА ══════ -->
<div class="modal-overlay hidden" id="site-edit-modal" onclick="onSiteModalBgClick(event)">
  <div class="modal-sheet" id="site-edit-sheet">
    <div class="modal-handle"></div>
    <div class="modal-title" id="site-edit-title">Редактировать</div>
    <div class="modal-form" id="site-edit-form"></div>
  </div>
</div>
```

- [ ] **Шаг 3: Добавить JS в блок `<script>`**

После `let newImages = {};` добавить:

```js
let currentTab   = 'products';
let configSHA    = null;
let configData   = {
  hero: { image: 'images/hero.jpg' },
  about: { image: 'images/about.jpg', text: '' },
  categoryCards: { cosmetics: 'images/cosmetics-card.jpg', teas: 'images/teas-card.jpg', sets: null }
};
let newConfigImages = {};
let editPhotos   = [];
let siteEditKey  = null;

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-btn-products').classList.toggle('active', tab === 'products');
  document.getElementById('tab-btn-site').classList.toggle('active', tab === 'site');
  document.getElementById('products-tab').classList.toggle('hidden', tab !== 'products');
  document.getElementById('site-tab').classList.toggle('hidden', tab !== 'site');
  document.getElementById('add-btn').classList.toggle('hidden', tab !== 'products');
}
```

- [ ] **Шаг 4: Коммит**

```bash
git add admin.html
git commit -m "feat: admin two-tab layout skeleton"
```

---

### Task 5: Admin — мульти-фото в редакторе товара

**Files:**
- Modify: `D:\Claude\Soap\admin.html`

- [ ] **Шаг 1: Заменить блок загрузки фото в модальном окне**

Найти блок `<div class="field-group">` с `photo-zone` и заменить целиком на:

```html
      <div class="field-group">
        <div class="field-label">Фото</div>
        <div class="photo-strip" id="photo-strip"></div>
        <input type="file" id="f-file-add" accept="image/*" style="display:none" onchange="onPhotoAdd(event)">
        <div style="font-size:11px;color:var(--text2);margin-top:4px">Первое фото — главное (в каталоге)</div>
      </div>
```

- [ ] **Шаг 2: Добавить функции работы с полосой фото**

В `<script>` после `function switchTab` добавить:

```js
function renderPhotoStrip() {
  const strip = document.getElementById('photo-strip');
  if (!strip) return;
  let html = editPhotos.map((ph, i) => {
    const src = ph.b64
      ? `data:image/jpeg;base64,${ph.b64}`
      : `https://raw.githubusercontent.com/${REPO.owner}/${REPO.name}/${REPO.branch}/${ph.path}`;
    return `<div class="photo-thumb-wrap">
      <img class="photo-thumb-img" src="${src}" onerror="this.style.opacity=0.3">
      <button class="photo-thumb-del" onclick="removePhoto(${i})">×</button>
    </div>`;
  }).join('');
  html += `<div class="photo-add" onclick="document.getElementById('f-file-add').click()">＋</div>`;
  strip.innerHTML = html;
}

function removePhoto(i) {
  editPhotos.splice(i, 1);
  renderPhotoStrip();
}

function onPhotoAdd(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const b64  = ev.target.result.split(',')[1];
    const path = 'images/' + sanitize(file.name);
    editPhotos.push({ path, b64, isNew: true });
    renderPhotoStrip();
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}
```

- [ ] **Шаг 3: Обновить openEdit, openAdd, closeEdit**

Заменить `openEdit`:

```js
function openEdit(idx) {
  editIdx = idx;
  const p = products[idx];
  document.getElementById('edit-title').textContent = 'Редактировать';
  document.getElementById('f-name').value    = p.name        || '';
  document.getElementById('f-cat').value     = p.category    || 'soap';
  document.getElementById('f-subcat').value  = p.subcategory || 'all';
  document.getElementById('f-desc').value    = p.description || '';
  document.getElementById('f-weight').value  = p.weight      || '';
  document.getElementById('f-price').value   = p.price       || '';
  document.getElementById('f-featured').checked = !!p.featured;
  document.getElementById('del-btn').classList.remove('hidden');
  onCatChange();
  editPhotos = [];
  if (p.image) editPhotos.push({ path: p.image, b64: newImages[p.image] || null, isNew: false });
  (p.images || []).forEach(img => editPhotos.push({ path: img, b64: newImages[img] || null, isNew: false }));
  renderPhotoStrip();
  showModal();
}
```

Заменить `openAdd`:

```js
function openAdd() {
  editIdx = null;
  document.getElementById('edit-title').textContent = 'Новый товар';
  document.getElementById('f-name').value    = '';
  document.getElementById('f-cat').value     = 'soap';
  document.getElementById('f-subcat').value  = 'all';
  document.getElementById('f-desc').value    = '';
  document.getElementById('f-weight').value  = '';
  document.getElementById('f-price').value   = '';
  document.getElementById('f-featured').checked = false;
  document.getElementById('del-btn').classList.add('hidden');
  onCatChange();
  editPhotos = [];
  renderPhotoStrip();
  showModal();
}
```

В `closeEdit()` удалить строку `document.getElementById('f-file')._pending = null;` (этого поля больше нет).

Удалить функции `resetPhoto` и `onFileChange` — они заменены.

- [ ] **Шаг 4: Обновить saveProduct**

```js
function saveProduct() {
  const name = document.getElementById('f-name').value.trim();
  if (!name) { toast('Введите название'); return; }

  const cat      = document.getElementById('f-cat').value;
  const subcat   = cat === 'soap' ? document.getElementById('f-subcat').value : null;
  const desc     = document.getElementById('f-desc').value.trim();
  const weight   = document.getElementById('f-weight').value.trim() || null;
  const priceRaw = document.getElementById('f-price').value.trim();
  const price    = priceRaw ? Number(priceRaw) : null;
  const featured = document.getElementById('f-featured').checked;

  editPhotos.forEach(ph => { if (ph.isNew) newImages[ph.path] = ph.b64; });
  const paths  = editPhotos.map(ph => ph.path);
  const image  = paths[0] || null;
  const images = paths.slice(1);

  if (editIdx !== null) {
    products[editIdx] = {
      ...products[editIdx],
      name, category: cat, subcategory: subcat,
      description: desc, weight, price, image,
      images: images.length ? images : undefined,
      featured
    };
  } else {
    const maxId = products.reduce((m, p) => Math.max(m, p.id || 0), 0);
    products.push({
      id: maxId + 1, name, category: cat, subcategory: subcat,
      description: desc, weight, price, image,
      images: images.length ? images : undefined,
      featured
    });
  }

  closeEdit();
  render();
  toast('Сохранено — нажми «Опубликовать» чтобы выложить');
}
```

- [ ] **Шаг 5: Обновить makeProductsJs — добавить поле images**

```js
function makeProductsJs(arr) {
  const ts = new Date().toLocaleString('ru-RU');
  const lines = arr.map(p => {
    const imagesStr = (p.images && p.images.length)
      ? `, images: [${p.images.map(jss).join(', ')}]`
      : '';
    return `  { id: ${p.id}, name: ${jss(p.name)}, category: ${jss(p.category)}, subcategory: ${p.subcategory === null ? 'null' : jss(p.subcategory)},\n    description: ${jss(p.description || '')},\n    weight: ${p.weight == null ? 'null' : jss(p.weight)}, price: ${p.price == null ? 'null' : p.price}, image: ${p.image == null ? 'null' : jss(p.image)}${imagesStr}, featured: ${!!p.featured} }`;
  });
  return `// Обновлено через панель управления ДАМИ: ${ts}\n\nconst PRODUCTS = [\n\n${lines.join(',\n\n')}\n\n];\n`;
}
```

- [ ] **Шаг 6: Проверить**

Открыть admin.html локально. Отредактировать товар: добавить 2 фото через «＋», оба видны в полосе. Удалить одно — исчезает. Сохранить.

- [ ] **Шаг 7: Коммит**

```bash
git add admin.html
git commit -m "feat: multi-photo strip in product editor"
```

---

### Task 6: Admin — загрузка config.js + таб «Сайт» + публикация

**Files:**
- Modify: `D:\Claude\Soap\admin.html`

- [ ] **Шаг 1: Обновить loadMain — загружать config.js**

```js
async function loadMain() {
  try {
    const data = await ghGet(`contents/${REPO.file}`);
    fileSHA = data.sha;
    const js = b64decode(data.content);
    products = new Function(js + '\n;return typeof PRODUCTS!=="undefined"?PRODUCTS:[];')();

    try {
      const cfgData = await ghGet('contents/config.js');
      configSHA = cfgData.sha;
      const cfgJs = b64decode(cfgData.content);
      configData = new Function(cfgJs + '\n;return typeof CONFIG!=="undefined"?CONFIG:{};')();
    } catch(_) {
      configSHA = null;
    }

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
    render();
    renderSiteTab();
  } catch(e) {
    throw e;
  }
}
```

- [ ] **Шаг 2: Добавить renderSiteTab**

```js
function renderSiteTab() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
  set('se-hero-path',         configData.hero && configData.hero.image);
  set('se-about-img',         configData.about && configData.about.image);
  const t = (configData.about && configData.about.text) || '';
  set('se-about-text-preview', t.slice(0, 50) + (t.length > 50 ? '…' : ''));
  set('se-card-cosmetics',    configData.categoryCards && configData.categoryCards.cosmetics);
  set('se-card-teas',         configData.categoryCards && configData.categoryCards.teas);
  set('se-card-sets',         configData.categoryCards && configData.categoryCards.sets);
}
```

- [ ] **Шаг 3: Добавить функции редактирования таба «Сайт»**

```js
const SITE_TITLES = {
  'hero-image': 'Фото баннера', 'about-image': 'Фото Эмилии',
  'about-text': 'Текст биографии', 'card-cosmetics': 'Косметика — фото',
  'card-teas': 'Чаи — фото', 'card-sets': 'Наборы — фото',
};

function getSiteImagePath(key) {
  const c = configData;
  if (key === 'hero-image')     return c.hero && c.hero.image;
  if (key === 'about-image')    return c.about && c.about.image;
  if (key === 'card-cosmetics') return c.categoryCards && c.categoryCards.cosmetics;
  if (key === 'card-teas')      return c.categoryCards && c.categoryCards.teas;
  if (key === 'card-sets')      return c.categoryCards && c.categoryCards.sets;
  return null;
}

function setSiteImagePath(key, path) {
  const c = configData;
  if (key === 'hero-image')     c.hero = { ...c.hero, image: path };
  if (key === 'about-image')    c.about = { ...c.about, image: path };
  if (key === 'card-cosmetics') c.categoryCards = { ...c.categoryCards, cosmetics: path };
  if (key === 'card-teas')      c.categoryCards = { ...c.categoryCards, teas: path };
  if (key === 'card-sets')      c.categoryCards = { ...c.categoryCards, sets: path };
}

function openSiteEdit(key) {
  siteEditKey = key;
  document.getElementById('site-edit-title').textContent = SITE_TITLES[key] || key;
  const form = document.getElementById('site-edit-form');

  if (key === 'about-text') {
    const txt = (configData.about && configData.about.text) || '';
    form.innerHTML = `
      <div class="field-group">
        <div class="field-label">Текст (Enter = новая строка)</div>
        <textarea id="se-textarea" class="field-input" rows="12">${esc(txt)}</textarea>
      </div>
      <div class="row-2">
        <button class="btn" onclick="closeSiteEdit()">Отмена</button>
        <button class="btn btn-accent" style="flex:2" onclick="saveSiteText()">Сохранить</button>
      </div>`;
  } else {
    const curPath = getSiteImagePath(key);
    const pendB64 = curPath && newConfigImages[curPath];
    const prevSrc = pendB64
      ? `data:image/jpeg;base64,${pendB64}`
      : curPath ? `https://raw.githubusercontent.com/${REPO.owner}/${REPO.name}/${REPO.branch}/${curPath}` : null;
    form.innerHTML = `
      <div class="field-group">
        <div class="field-label">Фото</div>
        <div class="photo-zone" onclick="document.getElementById('se-file').click()">
          ${prevSrc
            ? `<img src="${prevSrc}" style="width:100%;max-height:220px;object-fit:contain">`
            : `<div style="text-align:center"><div style="font-size:34px">📷</div><div class="photo-hint">Нажмите чтобы выбрать фото</div></div>`}
        </div>
        <input type="file" id="se-file" accept="image/*" style="display:none" onchange="onSiteFileChange(event)">
        ${curPath ? `<div style="font-size:11px;color:var(--text2);margin-top:4px">📁 ${curPath}</div>` : ''}
      </div>
      <div class="row-2"><button class="btn" style="flex:1" onclick="closeSiteEdit()">Закрыть</button></div>`;
  }

  document.getElementById('site-edit-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('site-edit-sheet').scrollTop = 0;
}

function closeSiteEdit() {
  document.getElementById('site-edit-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function onSiteModalBgClick(e) {
  if (e.target === document.getElementById('site-edit-modal')) closeSiteEdit();
}

function onSiteFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const b64  = ev.target.result.split(',')[1];
    const path = 'images/' + sanitize(file.name);
    newConfigImages[path] = b64;
    setSiteImagePath(siteEditKey, path);
    closeSiteEdit();
    renderSiteTab();
    toast('Фото выбрано — нажми «Опубликовать»');
  };
  reader.readAsDataURL(file);
}

function saveSiteText() {
  configData.about = { ...configData.about, text: document.getElementById('se-textarea').value };
  closeSiteEdit();
  renderSiteTab();
  toast('Текст сохранён — нажми «Опубликовать»');
}
```

- [ ] **Шаг 4: Добавить makeConfigJs и обновить doPublish**

```js
function makeConfigJs(cfg) {
  const ts = new Date().toLocaleString('ru-RU');
  const q  = v => v == null ? 'null' : jss(v);
  return `// Настройки сайта ДАМИ. Обновлено: ${ts}\n\nconst CONFIG = {\n  hero: {\n    image: ${q(cfg.hero && cfg.hero.image)}\n  },\n  about: {\n    image: ${q(cfg.about && cfg.about.image)},\n    text: ${jss((cfg.about && cfg.about.text) || '')}\n  },\n  categoryCards: {\n    cosmetics: ${q(cfg.categoryCards && cfg.categoryCards.cosmetics)},\n    teas: ${q(cfg.categoryCards && cfg.categoryCards.teas)},\n    sets: ${q(cfg.categoryCards && cfg.categoryCards.sets)}\n  }\n};\n`;
}
```

Заменить `doPublish`:

```js
async function doPublish() {
  const btn = document.getElementById('pub-btn');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="margin:0 auto"></div>';
  try {
    for (const [path, b64] of Object.entries(newImages)) {
      let sha = null;
      try { const ex = await ghGet(`contents/${path}`); sha = ex.sha; } catch(_) {}
      await ghPutRaw(path, b64, sha, `Admin: фото ${path.split('/').pop()}`);
    }
    newImages = {};

    for (const [path, b64] of Object.entries(newConfigImages)) {
      let sha = null;
      try { const ex = await ghGet(`contents/${path}`); sha = ex.sha; } catch(_) {}
      await ghPutRaw(path, b64, sha, `Admin: фото сайта ${path.split('/').pop()}`);
    }
    newConfigImages = {};

    const jsRes = await ghPut(REPO.file, makeProductsJs(products), fileSHA, 'Admin: обновление каталога');
    fileSHA = jsRes.content.sha;

    const cfgRes = await ghPut('config.js', makeConfigJs(configData), configSHA, 'Admin: настройки сайта');
    configSHA = cfgRes.content.sha;

    toast('✅ Опубликовано! Обновление через ~1 мин.');
  } catch(e) {
    toast('❌ Ошибка: ' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Опубликовать на сайте';
  }
}
```

- [ ] **Шаг 5: Обновить openPublishConfirm — считать оба типа фото**

```js
function openPublishConfirm() {
  const imgN = Object.keys(newImages).length + Object.keys(newConfigImages).length;
  let text = 'Изменения сохранятся на GitHub.\nСайт обновится примерно через 1 минуту.';
  if (imgN) text += `\n\nНовых фото для загрузки: ${imgN}`;
  openConfirm('Опубликовать на сайте?', text, doPublish);
}
```

- [ ] **Шаг 6: Полная проверка**

1. Открыть admin.html, войти
2. Таб «Сайт» → «Текст биографии» → изменить → сохранить
3. Таб «Сайт» → «Наборы — фото» → загрузить фото
4. Таб «Товары» → любой товар → добавить 2 фото
5. Нажать «Опубликовать» — успешно
6. Проверить на GitHub: `config.js` обновился, `products.js` обновился
7. Через ~1 мин проверить dami-nature.ru — текст «О себе» изменился

- [ ] **Шаг 7: Финальный коммит**

```bash
git add admin.html
git commit -m "feat: site tab fully functional, publish config.js"
```

---

### Task 7: Деплой

- [ ] **Шаг 1: Проверить .gitignore**

```bash
type D:\Claude\Soap\.gitignore
```

Убедиться что `config.js` не в списке исключений.

- [ ] **Шаг 2: Запушить**

```bash
cd D:/Claude/Soap
git push origin main
```

- [ ] **Шаг 3: Проверить продакшн через ~1 мин**

- https://dami-nature.ru — главная как прежде
- https://dami-nature.ru/product.html?id=1 — фото без стрелок (одно фото)
- https://damirnine.github.io/my-soap-shop/admin.html — два таба работают
