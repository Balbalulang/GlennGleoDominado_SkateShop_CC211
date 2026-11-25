const track = document.getElementById('categoryTrack');
const left = document.getElementById('scrollLeft');
const right = document.getElementById('scrollRight');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const toast = document.getElementById('toastMessage');
let cartCount = 0;
let toastTimer;

document.getElementById('year').textContent = new Date().getFullYear();

left.addEventListener('click', () => track.scrollBy({left: -350, behavior: 'smooth'}));
right.addEventListener('click', () => track.scrollBy({left: 350, behavior: 'smooth'}));

// Pointer-based drag makes the category rail work with a mouse, touch, or stylus.
let isDown = false, startX = 0, scrollStart = 0, moved = false;
track.addEventListener('pointerdown', (event) => {
  if (event.target.closest('a')) event.preventDefault();
  isDown = true; moved = false; startX = event.clientX; scrollStart = track.scrollLeft;
  track.classList.add('dragging'); track.setPointerCapture(event.pointerId);
});
track.addEventListener('pointermove', (event) => {
  if (!isDown) return;
  const delta = event.clientX - startX;
  if (Math.abs(delta) > 4) moved = true;
  track.scrollLeft = scrollStart - delta;
});
['pointerup','pointercancel','lostpointercapture'].forEach(type => track.addEventListener(type, () => {
  isDown = false; track.classList.remove('dragging');
}));
track.addEventListener('click', event => {
  if (moved) { event.preventDefault(); event.stopPropagation(); }
}, true);

navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false');
}));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
document.querySelectorAll('.add-cart').forEach(button => button.addEventListener('click', () => {
  cartCount++;
  document.getElementById('cartCount').textContent = cartCount;
  showToast(`${button.dataset.product} added to your cart.`);
}));
document.getElementById('cartButton').addEventListener('click', () => {
  showToast(cartCount ? `You have ${cartCount} item(s) in your cart.` : 'Your cart is currently empty.');
});

document.getElementById('searchForm').addEventListener('submit', event => {
  event.preventDefault();
  const term = document.getElementById('searchInput').value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('.product-column').forEach(card => {
    const match = !term || `${card.dataset.name} ${card.dataset.category}`.toLowerCase().includes(term);
    card.hidden = !match;
    if (match) visible++;
  });
  document.getElementById('searchEmpty').hidden = visible !== 0;
  document.getElementById('products').scrollIntoView({behavior:'smooth'});
});
document.getElementById('searchInput').addEventListener('input', event => {
  if (!event.target.value.trim()) {
    document.querySelectorAll('.product-column').forEach(card => card.hidden = false);
    document.getElementById('searchEmpty').hidden = true;
  }
});

document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const subject = encodeURIComponent(`Skate Shop website message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}\n\nContact number: 09062686011`);
  window.location.href = `mailto:hello@skateshop.com?subject=${subject}&body=${body}`;
  document.getElementById('formNote').textContent = 'Your email app should open with the message prepared. Replace hello@skateshop.com with your real shop email before publishing.';
});
