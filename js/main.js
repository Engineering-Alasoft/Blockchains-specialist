AOS.init({ duration: 600, once: true, offset: 60, easing: 'ease-out' });

const SITE_MODAL_ICONS = {
  error: 'fa-circle-exclamation',
  warning: 'fa-triangle-exclamation',
  success: 'fa-circle-check',
  info: 'fa-circle-info'
};

const SITE_MODAL_TITLES = {
  error: 'Something went wrong',
  warning: 'Please check',
  success: 'Success',
  info: 'Notice'
};

function ensureSiteModal() {
  if (document.getElementById('siteModal')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="site-modal" id="siteModal" role="dialog" aria-modal="true" aria-labelledby="siteModalTitle" aria-hidden="true">
      <div class="site-modal__backdrop" onclick="closeSiteModal()"></div>
      <div class="site-modal__card">
        <button type="button" class="site-modal__close" onclick="closeSiteModal()" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
        <div class="site-modal__icon" id="siteModalIcon"><i class="fas fa-circle-exclamation"></i></div>
        <h3 class="site-modal__title" id="siteModalTitle"></h3>
        <p class="site-modal__message" id="siteModalMessage"></p>
        <button type="button" class="btn site-modal__btn" onclick="closeSiteModal()"><span>OK</span></button>
      </div>
    </div>
  `);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSiteModal();
  });
}

function showSiteModal({ title, message, type = 'error' }) {
  ensureSiteModal();

  const modal = document.getElementById('siteModal');
  const iconEl = document.getElementById('siteModalIcon');
  const titleEl = document.getElementById('siteModalTitle');
  const messageEl = document.getElementById('siteModalMessage');
  const icon = SITE_MODAL_ICONS[type] || SITE_MODAL_ICONS.error;

  modal.className = 'site-modal site-modal--' + type + ' open';
  modal.setAttribute('aria-hidden', 'false');
  iconEl.innerHTML = '<i class="fas ' + icon + '"></i>';
  titleEl.textContent = title || SITE_MODAL_TITLES[type] || SITE_MODAL_TITLES.error;
  messageEl.textContent = message || '';
  document.body.style.overflow = 'hidden';
}

function closeSiteModal() {
  const modal = document.getElementById('siteModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showSiteAlert(message, options = {}) {
  showSiteModal({
    title: options.title,
    message,
    type: options.type || 'warning'
  });
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    if (typeof startCounters === 'function') startCounters();
    if (typeof startTyped === 'function') startTyped();
  }, 1200);
});

const navbar = document.getElementById('navbar');
const backTop = document.getElementById('back-top');

if (navbar) {
  const isLight = navbar.classList.contains('navbar--light');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (isLight) {
      if (backTop) backTop.style.display = y > 200 ? 'flex' : 'none';
      return;
    }
    if (y > 80) {
      navbar.classList.add('scrolled');
      if (backTop) backTop.style.display = 'flex';
    } else {
      navbar.classList.remove('scrolled');
      if (backTop) backTop.style.display = 'none';
    }
  }, { passive: true });
  if (backTop) backTop.style.display = 'none';
}

function openMenu() {
  document.getElementById('mobileMenu').classList.add('open');
  document.getElementById('hamburger').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('active');
  document.body.style.overflow = '';
}

function submitForm() {
  const fname = document.getElementById('fname');
  const femail = document.getElementById('femail');
  const fservice = document.getElementById('fservice');
  const fmessage = document.getElementById('fmessage');
  if (!fname?.value.trim() || !femail?.value.trim() || !fservice?.value || !fmessage?.value.trim()) {
    showSiteAlert('Please fill in all required fields.', { title: 'Missing information', type: 'warning' });
    return;
  }
  const budget = document.getElementById('fbudget')?.value || 'Not specified';
  const body = [
    'New inquiry from BlockchainsSpecialist website',
    '',
    'Name: ' + fname.value.trim(),
    'Email: ' + femail.value.trim(),
    'Service: ' + fservice.value,
    'Budget: ' + budget,
    '',
    fmessage.value.trim()
  ].join('\n');

  window.location.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent('Project Inquiry — ' + fservice.value) + '&body=' + encodeURIComponent(body);
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}

function subscribeNL() {
  const el = document.getElementById('nlEmail');
  if (!el?.value.trim()) return;
  el.value = '';
  el.placeholder = 'Subscribed!';
  setTimeout(() => { el.placeholder = 'your@email.com'; }, 3000);
}

function filterPortfolio(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.portfolio-card, .coin-item').forEach(c => {
    const cats = (c.dataset.cat || '').split(' ');
    const show = cat === 'all' || cats.includes(cat);
    c.style.display = show ? 'block' : 'none';
    if (show) {
      c.style.opacity = '0';
      c.style.transform = 'scale(.95)';
      setTimeout(() => {
        c.style.transition = '.35s ease';
        c.style.opacity = '1';
        c.style.transform = 'scale(1)';
      }, 40);
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    }
  });
});
