// src/scripts/main.js
// Semua logic JavaScript: navbar, hamburger, cart, tabs, chips, scroll

const WA = '6282261401619';

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loaded');

/* ════════════════════════════════════════
   NAVBAR — hide saat scroll naik, tampil saat scroll turun
════════════════════════════════════════════════ */
let lastScrollY = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < lastScrollY && y > 80) {
    navbar.classList.add('hide');
  } else {
    navbar.classList.remove('hide');
  }
  lastScrollY = y;
}, { passive: true });


/* ════════════════════════════════════════
   HAMBURGER — mobile nav toggle
════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
});

// Tutup mobile nav saat link diklik
mobileNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-label', 'Buka menu');
  });
});


/* ════════════════════════════════════════
   LOGO — klik smooth scroll ke atas
════════════════════════════════════════════════ */
document.getElementById('logo-top').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ════════════════════════════════════════
   ACTIVE NAV LINK — IntersectionObserver
════════════════════════════════════════════════ */
const navLinks    = document.querySelectorAll('.nav-link');
const sectionIds  = ['beranda', 'tentang', 'produk', 'layanan', 'kontak'];

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { threshold: 0.35 });

sectionIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});


/* ════════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════════════ */
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ════════════════════════════════════════
   WEIGHT CHIPS
════════════════════════════════════════════════ */
const selectedWeights = {};

document.querySelectorAll('.chips').forEach(group => {
  const iid   = group.dataset.iid;
  const chips = group.querySelectorAll('.chip');

  // Ambil default yang sudah diberi class .sel di HTML
  chips.forEach(chip => {
    if (chip.classList.contains('sel')) {
      selectedWeights[iid] = chip.dataset.w;
    }
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('sel'));
      chip.classList.add('sel');
      selectedWeights[iid] = chip.dataset.w;
    });
  });

  // Fallback: jika tidak ada default, pakai index 1
  if (!selectedWeights[iid] && chips.length > 1) {
    selectedWeights[iid] = chips[1].dataset.w;
    chips[1].classList.add('sel');
  }
});


/* ════════════════════════════════════════
   CATEGORY TABS
════════════════════════════════════════════════ */
document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const cat = tab.dataset.cat;
    document.querySelectorAll('.menu-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  });
});

// Initialize active tab on page load
const activeTab = document.querySelector('.cat-tab.active');
if (activeTab) {
  const cat = activeTab.dataset.cat;
  document.querySelectorAll('.menu-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
}


/* ════════════════════════════════════════
   CART — state, render, open/close
════════════════════════════════════════════════ */
let cart = [];

const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');

// ADD TO CART
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id    = btn.dataset.id;
    const name  = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const img   = btn.dataset.img;
    const w     = selectedWeights[id] || '1kg';
    const key   = `${id}-${w}`;

    const existing = cart.find(c => c.key === key);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ key, id, name, img, price, w, qty: 1 });
    }

    btn.textContent = '✓ Ditambah';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = '+ Tambah';
      btn.classList.remove('added');
    }, 1200);

    renderCart();
    openCart();
  });
});

// RENDER CART
function renderCart() {
  const body      = document.getElementById('cart-items');
  const countEl   = document.getElementById('cart-count');
  const totalEl   = document.getElementById('cart-total');
  const waBtn     = document.getElementById('checkout-btn');

  const totalQty  = cart.reduce((s, c) => s + c.qty, 0);
  countEl.textContent = totalQty;

  if (!cart.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <span>Keranjang masih kosong</span>
      </div>`;
    totalEl.textContent = 'Rp 0';
    waBtn.disabled = true;
    return;
  }

  waBtn.disabled = false;
  const total = cart.reduce((s, c) => s + c.price * (parseFloat(c.w) || 1) * c.qty, 0);
  totalEl.textContent = fmt(total);

  body.innerHTML = cart.map(c => {
    const line = c.price * (parseFloat(c.w) || 1) * c.qty;
    return `
      <div class="cart-row">
        <div>
          <img src="${c.img}" alt="${c.name}" class="cart-img"/>
  ${c.name}
          <div class="cart-row-detail">${c.w} × ${fmt(c.price)}/kg</div>
        </div>
        <div class="qty-ctrl">
  <button class="qb minus" data-key="${c.key}" data-a="m">−</button>
  <span class="qv">${c.qty}</span>
  <button class="qb plus" data-key="${c.key}" data-a="p">+</button>
</div>
        <div class="cart-price">${fmt(line)}</div>
      </div>`;
  }).join('');

  // Qty buttons
  body.querySelectorAll('.qb').forEach(b => {
    b.addEventListener('click', () => {
      const k = b.dataset.key;
      const a = b.dataset.a;
      const i = cart.findIndex(c => c.key === k);
      if (i < 0) return;
      if (a === 'p') {
        cart[i].qty++;
      } else {
        cart[i].qty--;
        if (cart[i].qty <= 0) cart.splice(i, 1);
      }
      renderCart();
    });
  });
}

// OPEN / CLOSE
function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cart-open-btn').addEventListener('click', openCart);
document.getElementById('cart-close-btn').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);

// CHECKOUT — kirim ke WhatsApp
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (!cart.length) return;

  const total = cart.reduce((s, c) => s + c.price * (parseFloat(c.w) || 1) * c.qty, 0);
  const lines = cart.map(c =>
  `• ${c.name} — ${c.w} × ${c.qty} = ${fmt(c.price * (parseFloat(c.w) || 1) * c.qty)}`
);

  const msg = [
    '🥩 *Pesanan dari Lembu Lemu*',
    '',
    ...lines,
    '',
    `*TOTAL: ${fmt(total)}*`,
    '',
    'Mohon konfirmasi stok & pengiriman. Terima kasih! 🙏',
  ].join('\n');

  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
});


/* ════════════════════════════════════════
   SUBSCRIBE FORM
════════════════════════════════════════════════ */
const subscribeBtn = document.getElementById('subscribe-btn');
if (subscribeBtn) {
  subscribeBtn.addEventListener('click', () => {
    const input = document.getElementById('subscribe-email');
    if (!input || !input.value) { input?.focus(); return; }
    alert(`Terima kasih! Email ${input.value} berhasil didaftarkan.`);
    input.value = '';
  });
}


/* ════════════════════════════════════════
   COMMENT FORM
════════════════════════════════════════════════ */
const commentForm = document.getElementById('comment-form');
if (commentForm) {
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('comment-name')?.value    || '';
    const email   = document.getElementById('comment-email')?.value   || '';
    const message = document.getElementById('comment-message')?.value || '';
    if (!name || !email || !message) {
      alert('Mohon isi semua kolom terlebih dahulu.');
      return;
    }
    alert(`Terima kasih, ${name}! Pesan Anda sudah kami terima.`);
    commentForm.reset();
  });
}

});