if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 500,
    once: true,
    offset: 40,
    easing: 'ease-out',
    disable: () => window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches
  });
}

const SITE_MODAL_ICONS = {
  error: 'fa-circle-exclamation',
  warning: 'fa-triangle-exclamation'
};

const SITE_MODAL_TITLES = {
  error: 'Something went wrong',
  warning: 'Please check'
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

function hideLoaderAndStartHome() {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
  if (typeof startCounters === 'function') startCounters();
  if (typeof startTyped === 'function') startTyped();
}

if (document.readyState === 'complete') {
  requestAnimationFrame(hideLoaderAndStartHome);
} else {
  window.addEventListener('load', () => {
    setTimeout(hideLoaderAndStartHome, 180);
  });
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
