const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('.search-panel');
searchToggle?.addEventListener('click', () => {
  searchPanel.classList.toggle('open');
  if (searchPanel.classList.contains('open')) searchPanel.querySelector('input').focus();
});
searchPanel?.addEventListener('submit', event => {
  event.preventDefault();
  const term = searchPanel.querySelector('input').value.trim();
  showToast(term ? `Search demo: “${term}”` : 'Type something to search.');
});

const themeToggle = document.querySelector('.theme-toggle');
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  showToast(document.body.classList.contains('dark-mode') ? 'Evening mode enabled' : 'Daylight mode enabled');
});

let bagCount = 0;
document.querySelector('.bag-button')?.addEventListener('click', () => {
  showToast(bagCount ? `Your demo bag has ${bagCount} item${bagCount === 1 ? '' : 's'}.` : 'Your bag is waiting for something lovely.');
});
document.querySelector('.wishlist')?.addEventListener('click', event => {
  event.currentTarget.textContent = event.currentTarget.textContent.trim() === '♥' ? '♡' : '♥';
  showToast(event.currentTarget.textContent.trim() === '♥' ? 'Added to your demo wishlist' : 'Removed from wishlist');
});
document.querySelectorAll('.collection-card').forEach(card => card.addEventListener('click', event => {
  event.preventDefault();
  bagCount += 1;
  document.querySelector('.bag-count').textContent = bagCount;
  showToast(`${card.querySelector('strong').textContent} selected — demo interaction`);
}));

const hero = document.querySelector('.hero');
const heroImages = [
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=2200&q=90',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2200&q=90',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=90'
];
let heroIndex = 0;
function setHero(index) {
  heroIndex = (index + heroImages.length) % heroImages.length;
  hero.style.backgroundImage = `url("${heroImages[heroIndex]}")`;
  document.querySelectorAll('.hero-dots .dot').forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));
}
document.querySelector('.hero-prev')?.addEventListener('click', () => setHero(heroIndex - 1));
document.querySelector('.hero-next')?.addEventListener('click', () => setHero(heroIndex + 1));
document.querySelectorAll('.hero-dots .dot').forEach((dot, i) => dot.addEventListener('click', () => setHero(i)));

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 }) : null;
document.querySelectorAll('.reveal').forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 75}ms`;
  if (revealObserver) revealObserver.observe(item); else item.classList.add('visible');
});

const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm?.addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#email');
  const message = document.querySelector('.form-message');
  if (!email.checkValidity()) { email.reportValidity(); return; }
  message.textContent = 'Thank you for joining the Nooré community!';
  newsletterForm.reset();
});
document.querySelector('#year').textContent = new Date().getFullYear();

let toastTimeout;
function showToast(message) {
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
}


// Expanded product filters, detail popups, and resource reading.
const filterButtons = document.querySelectorAll('.filter-button');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  const filter = button.dataset.filter;
  document.querySelectorAll('.product-card').forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
  });
}));

const detailModal = document.querySelector('.detail-modal');
const modalImage = document.querySelector('.modal-image');
const modalTitle = document.querySelector('#modal-title');
const modalDescription = document.querySelector('.modal-description');
const modalCategory = document.querySelector('.modal-category');
function openDetail({title, image, description, category = 'NOORÉ JOURNAL'}) {
  modalTitle.textContent = title;
  modalImage.src = image || '';
  modalImage.alt = title;
  modalImage.style.display = image ? 'block' : 'none';
  modalDescription.textContent = description;
  modalCategory.textContent = category;
  detailModal.classList.add('open');
  detailModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.querySelector('.modal-close').focus();
}
function closeDetail() {
  detailModal.classList.remove('open');
  detailModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.querySelectorAll('.details-button').forEach(button => button.addEventListener('click', () => {
  openDetail({title: button.dataset.title, image: button.dataset.image, description: button.dataset.description, category: button.dataset.category});
}));
document.querySelectorAll('.resource-button').forEach(button => button.addEventListener('click', () => {
  openDetail({title: button.dataset.title, description: button.dataset.description, category: 'ISLAMIC CORNER'});
}));
document.querySelectorAll('.journal-card h3 a, .journal-card .read-more').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const card = link.closest('.journal-card');
  openDetail({
    title: card.querySelector('h3').textContent,
    image: card.querySelector('img').src,
    description: card.querySelector('p').textContent + ' This is a sample journal preview for the Nooré website concept.',
    category: card.querySelector('.journal-meta span').textContent
  });
}));
detailModal?.querySelectorAll('[data-close-modal]').forEach(item => item.addEventListener('click', closeDetail));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && detailModal?.classList.contains('open')) closeDetail(); });
document.querySelectorAll('.product-heart').forEach(button => button.addEventListener('click', event => {
  event.preventDefault();
  event.stopPropagation();
  button.classList.toggle('saved');
  button.textContent = button.classList.contains('saved') ? '♥' : '♡';
  showToast(button.classList.contains('saved') ? 'Saved to your favourites' : 'Removed from favourites');
}));
