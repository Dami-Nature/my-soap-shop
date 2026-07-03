// Shared header and footer — injected into every page

const MAX_LINK = 'https://max.ru/u/f9LHodD0cOJED4Pjd_kQjh36VllBLFJ6e9O1iuunwgQ6yELzlDR-bTbPFfg';
const WA_LINK = 'https://wa.me/79646418016';

// Toggle catalog dropdown and navigate to catalog page
window.toggleCatalogMenu = function (btn) {
  const menu = btn.nextElementSibling;
  const wasOpen = menu.classList.contains('open');
  document.querySelectorAll('.contact-dropdown.open').forEach(m => m.classList.remove('open'));
  if (!wasOpen) {
    menu.classList.add('open');
    location.href = 'index.html#catalog';
  }
};

// Toggle the Telegram/MAX dropdown under a "Написать"/"Заказать" button
window.toggleContactMenu = function (btn) {
  const menu = btn.nextElementSibling;
  const wasOpen = menu.classList.contains('open');
  document.querySelectorAll('.contact-dropdown.open').forEach(m => m.classList.remove('open'));
  if (!wasOpen) menu.classList.add('open');
};
document.addEventListener('click', (e) => {
  if (!e.target.closest('.contact-menu')) {
    document.querySelectorAll('.contact-dropdown.open').forEach(m => m.classList.remove('open'));
  }
});

(function () {
  const page = location.pathname.split('/').pop() || 'index.html';

  const isActive = (p) => page === p ? 'active' : '';

  const catalogPages = ['soap.html','cosmetics.html','teas.html','sets.html'];
  const catalogActive = catalogPages.includes(page) ? 'active' : '';

  const header = `
    <header>
      <a href="index.html" class="logo">
        <span class="logo-title">Дами</span>
        <span class="logo-sub">Натуральная косметика</span>
      </a>
      <nav class="main-nav">
        <a href="index.html" class="nav-link ${isActive('index.html')}">Главная</a>
        <div class="contact-menu catalog-menu">
          <button class="nav-link nav-contact-btn ${catalogActive}" onclick="toggleCatalogMenu(this)">Каталог ▾</button>
          <div class="contact-dropdown">
            <a href="index.html#catalog" style="font-weight:600;border-bottom:1px solid var(--border);margin-bottom:4px;padding-bottom:12px;">Весь каталог →</a>
            <a href="soap.html">Мыло</a>
            <a href="cosmetics.html">Косметика</a>
            <a href="teas.html">Чаи</a>
            <a href="sets.html">Наборы</a>
          </div>
        </div>
        <a href="index.html#contacts" class="nav-link">Контакты</a>
        <a href="index.html#about" class="nav-link">Обо мне</a>
        <a href="cart.html" class="nav-cart ${isActive('cart.html')}" id="nav-cart-link" title="Корзина">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="cart-badge" id="nav-cart-count" style="display:none">0</span>
        </a>
        <div class="contact-menu">
          <button class="btn-tg" onclick="toggleContactMenu(this)">Написать</button>
          <div class="contact-dropdown">
            <a href="https://t.me/EmiliyaT" target="_blank">Telegram</a>
            <a href="${WA_LINK}" target="_blank">WhatsApp</a>
            <a href="${MAX_LINK}" target="_blank">MAX</a>
          </div>
        </div>
      </nav>
    </header>
  `;

  const footer = `
    <footer>
      <div class="footer-logo">Дами</div>
      <div class="footer-sub">Натуральная косметика ручной работы</div>
      <div class="contact-menu footer-cta-wrap">
        <button class="footer-cta" onclick="toggleContactMenu(this)">Написать</button>
        <div class="contact-dropdown">
          <a href="https://t.me/EmiliyaT" target="_blank">Telegram</a>
          <a href="${WA_LINK}" target="_blank">WhatsApp</a>
          <a href="${MAX_LINK}" target="_blank">MAX</a>
        </div>
      </div>
      <div class="footer-sub" style="margin-bottom: 12px;">Социальные сети</div>
      <div id="contacts" class="footer-links">
        <a href="https://t.me/DamiNature" target="_blank" class="footer-icon">
          <img src="https://cdn.simpleicons.org/telegram/4a7c59" alt="Telegram" onerror="this.outerHTML='Telegram'">
          <span>Telegram<br>канал</span>
        </a>
        <a href="https://instagram.com/dami.nature" target="_blank" class="footer-icon">
          <img src="https://cdn.simpleicons.org/instagram/4a7c59" alt="Instagram" onerror="this.outerHTML='Instagram'">
          <span>Instagram</span>
        </a>
        <a href="https://vk.ru/daminature" target="_blank" class="footer-icon">
          <img src="https://cdn.simpleicons.org/vk/4a7c59" alt="VK" onerror="this.outerHTML='VK'">
          <span>VK</span>
        </a>
      </div>
      <div class="footer-sub" style="margin-top: 16px; margin-bottom: 12px;">Москва</div>
      <div class="footer-copy">© 2026 Дами</div>
    </footer>
  `;

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);

  window.updateCartCount = function () {
    const cart  = JSON.parse(localStorage.getItem('dami_cart') || '[]');
    const badge = document.getElementById('nav-cart-count');
    if (!badge) return;
    if (cart.length) {
      badge.textContent = cart.length;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  };
  window.updateCartCount();
})();
