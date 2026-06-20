function renderSiteFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount || typeof SITE === 'undefined') return;

  mount.innerHTML = `
<footer class="footer footer-simple">
  <div class="container footer-simple-inner">
    <p class="footer-address">${SITE.address}</p>
    <p class="footer-contact">
      <a href="tel:${SITE.whatsapp}">${SITE.whatsappDisplay}</a>
      <span class="footer-sep">|</span>
      <a href="mailto:${SITE.email}">${SITE.email}</a>
    </p>
    <div class="footer-divider"></div>
    <p class="footer-copy">© ${SITE.name}, All Right Reserved | Designed &amp; developed By ${SITE.name}</p>
  </div>
</footer>
<div class="whatsapp-float">
  <span class="whatsapp-tooltip">Message us</span>
  <a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" class="whatsapp-btn" aria-label="Message us on WhatsApp">
    <i class="fab fa-whatsapp"></i>
  </a>
</div>`;
}

document.addEventListener('DOMContentLoaded', renderSiteFooter);
