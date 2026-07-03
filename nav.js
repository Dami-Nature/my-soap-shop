// Shared header and footer — injected into every page

const MAX_LINK = 'https://max.ru/u/f9LHodD0cOJED4Pjd_kQjh36VllBLFJ6e9O1iuunwgQ6yELzlDR-bTbPFfg';
const WA_LINK = 'https://wa.me/79646418016';

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
        <div class="nav-item">
          <a href="soap.html" class="nav-link ${catalogActive}">Каталог</a>
          <div class="dropdown">
            <a href="soap.html" class="dropdown-link">Мыло</a>
            <a href="cosmetics.html" class="dropdown-link">Косметика</a>
            <a href="teas.html" class="dropdown-link">Чаи</a>
            <a href="sets.html" class="dropdown-link">Наборы</a>
          </div>
        </div>
        <div class="contact-menu">
          <button class="nav-link nav-contact-btn" onclick="toggleContactMenu(this)">Контакты</button>
          <div class="contact-dropdown">
            <a href="https://t.me/EmiliyaT" target="_blank">Telegram</a>
            <a href="${WA_LINK}" target="_blank">WhatsApp</a>
            <a href="${MAX_LINK}" target="_blank">MAX</a>
          </div>
        </div>
        <a href="index.html#about" class="nav-link">Обо мне</a>
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
      <div class="footer-links">
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
      <div class="footer-copy">© 2026 Дами</div>
    </footer>
  `;

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);
})();
