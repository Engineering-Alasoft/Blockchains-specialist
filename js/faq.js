function wrapFaqAnswers() {
  document.querySelectorAll('.faq-answer').forEach((answer) => {
    if (answer.querySelector('.faq-answer-inner')) return;
    const inner = document.createElement('div');
    inner.className = 'faq-answer-inner';
    while (answer.firstChild) inner.appendChild(answer.firstChild);
    answer.appendChild(inner);
  });
}

function setFaqOpen(item, open) {
  const button = item.querySelector('.faq-question');
  item.classList.toggle('open', open);
  if (button) button.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function toggleFaq(button) {
  const item = button.closest('.faq-item');
  if (!item) return;

  const willOpen = !item.classList.contains('open');

  document.querySelectorAll('.faq-item.open').forEach((openItem) => {
    if (openItem !== item) setFaqOpen(openItem, false);
  });

  setFaqOpen(item, willOpen);
}

document.addEventListener('DOMContentLoaded', () => {
  wrapFaqAnswers();

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => toggleFaq(button));
  });

  const first = document.querySelector('.faq-item');
  if (first) setFaqOpen(first, true);
});
