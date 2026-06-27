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

  const header = `
    <header>
      <a href="index.html" class="logo">
        <span class="logo-title">Дами</span>
        <span class="logo-sub">Натуральная косметика</span>
      </a>
      <nav class="main-nav">
        <a href="index.html" class="nav-link ${isActive('index.html')}">Главная</a>
        <div class="nav-item">
          <a href="cosmetics.html" class="nav-link ${isActive('cosmetics.html')}">Косметика</a>
          <div class="dropdown">
            <div class="dropdown-section">Мыло</div>
            <a href="cosmetics.html?cat=soap" class="dropdown-link">— Все</a>
            <a href="cosmetics.html?cat=soap&sub=household" class="dropdown-link">— Хозяйственное</a>
            <a href="cosmetics.html?cat=soap&sub=children" class="dropdown-link">— Детское</a>
            <a href="cosmetics.html?cat=soap&sub=medicinal" class="dropdown-link">— Лечебное</a>
            <hr class="dropdown-divider">
            <a href="cosmetics.html?cat=face" class="dropdown-link">Для лица</a>
            <a href="cosmetics.html?cat=body" class="dropdown-link">Для тела</a>
            <a href="cosmetics.html?cat=hair" class="dropdown-link">Для волос</a>
          </div>
        </div>
        <a href="teas.html" class="nav-link ${isActive('teas.html')}">Чаи</a>
        <a href="sets.html" class="nav-link ${isActive('sets.html')}">Наборы</a>
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
      <div class="footer-links">
        <a href="https://t.me/DamiNature" target="_blank">Telegram канал</a>
        <div class="contact-menu">
          <button onclick="toggleContactMenu(this)">Написать</button>
          <div class="contact-dropdown">
            <a href="https://t.me/EmiliyaT" target="_blank">Telegram</a>
            <a href="${WA_LINK}" target="_blank">WhatsApp</a>
            <a href="${MAX_LINK}" target="_blank">MAX</a>
          </div>
        </div>
        <a href="https://instagram.com/dami.nature" target="_blank">Instagram</a>
      </div>
      <div class="footer-copy">© 2026 Дами</div>
    </footer>
  `;

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);
})();
