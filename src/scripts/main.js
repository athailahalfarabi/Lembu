const WA = '6285174440515';
const FORM_SUBMIT_EMAIL = 'akbaralfarizi886@gmail.com';

const sendFormSubmit = async (payload) => {
  const response = await fetch(`https://formsubmit.co/ajax/${FORM_SUBMIT_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      _subject: payload._subject || 'Pesan dari Lembu Lemu',
      _captcha: 'false',
    }),
  });

  if (!response.ok) {
    throw new Error('Gagal mengirim pesan.');
  }

  return response.json();
};

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash-screen');

  if (splash) {
    window.setTimeout(() => {
      splash.classList.add('hidden');
      document.body.classList.remove('splash-active');
      document.body.classList.add('page-loaded');
    }, 2000);
  } else {
    document.body.classList.add('page-loaded');
  }

  
  let lastScrollY = window.scrollY;
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (y > lastScrollY && y > 80) {
      navbar.classList.remove('hide');
    } 

    else if (y < lastScrollY || y <= 80) {
      navbar.classList.add('hide');
    }
    
    lastScrollY = y;
  }, { passive: true });



const hamburger = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
});

mobileNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-label', 'Buka menu');
  });
});



document.getElementById('logo-top').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});



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



const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});



const selectedWeights = {};

const formatPrice = (value) => {
  return 'Rp ' + value.toLocaleString('id-ID');
};

document.querySelectorAll('.chips').forEach(group => {
  const iid    = group.dataset.iid;
  const chips  = group.querySelectorAll('.chip');
  const card   = group.closest('.menu-card');
  const addBtn = card?.querySelector('.add-btn');
  const priceTag = card?.querySelector('.price-tag');
  const basePrice = addBtn ? parseInt(addBtn.dataset.price, 10) : 0;

  const updatePriceTag = (chip) => {
    if (!priceTag || !basePrice) return;
    const weight = parseFloat(chip.dataset.w) || 1;
    const total  = basePrice * weight;
    priceTag.textContent = `${formatPrice(total)} / ${chip.dataset.w}`;
  };

  const setDefaultAddText = () => {
    if (!addBtn || !priceTag || !basePrice) return;
    const selected = group.querySelector('.chip.sel') || chips[1];
    if (selected) updatePriceTag(selected);
  };

  chips.forEach(chip => {
    if (chip.classList.contains('sel')) {
      selectedWeights[iid] = chip.dataset.w;
      updatePriceTag(chip);
    }
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('sel'));
      chip.classList.add('sel');
      selectedWeights[iid] = chip.dataset.w;
      updatePriceTag(chip);
    });
  });

  if (!selectedWeights[iid] && chips.length > 1) {
    selectedWeights[iid] = chips[1].dataset.w;
    chips[1].classList.add('sel');
    updatePriceTag(chips[1]);
  }

  setDefaultAddText();
});



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

document.addEventListener('DOMContentLoaded', () => {
  const activeTab = document.querySelector('.cat-tab.active');
  if (activeTab) {
    const cat = activeTab.dataset.cat;
    document.querySelectorAll('.menu-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  }
});

const galleryTrack = document.querySelector('.gallery-mobile-track');
if (galleryTrack) {
  const dots = document.querySelectorAll('.gallery-dot');

  galleryTrack.addEventListener('scroll', () => {
    const idx = Math.round(galleryTrack.scrollLeft / galleryTrack.offsetWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }, { passive: true });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      galleryTrack.scrollLeft = idx * galleryTrack.offsetWidth;
    });
  });
}


let cart = [];

const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');

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
        <div class="cart-row-item">
          <img src="${c.img}" alt="${c.name}" class="cart-img"/>
          <div class="cart-row-meta">
            <div class="cart-row-name">${c.name}</div>
            <div class="cart-row-detail">${c.w} × ${fmt(c.price)}/kg</div>
          </div>
        </div>
        <div class="qty-ctrl">
  <button class="qb minus" data-key="${c.key}" data-a="m">−</button>
  <span class="qv">${c.qty}</span>
  <button class="qb plus" data-key="${c.key}" data-a="p">+</button>
</div>
        <div class="cart-price">${fmt(line)}</div>
      </div>`;
  }).join('');

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



const subscribeForm = document.getElementById('subscribe-form');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('subscribe-email');
    if (!input || !input.value.trim()) {
      input?.focus();
      return;
    }

    try {
      await sendFormSubmit({
        email: input.value.trim(),
        message: 'Permintaan langganan promo / update dari website Lembu Lemu.',
        _subject: 'Langganan Lembu Lemu',
      });
      alert(`Terima kasih! Email ${input.value.trim()} berhasil didaftarkan.`);
      subscribeForm.reset();
    } catch (error) {
      alert('Maaf, pengiriman email gagal. Silakan coba lagi.');
    }
  });
}



const commentForm = document.getElementById('comment-form');
if (commentForm) {
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = document.getElementById('comment-name')?.value    || '';
    const email   = document.getElementById('comment-email')?.value   || '';
    const message = document.getElementById('comment-message')?.value || '';
    if (!name || !email || !message) {
      alert('Mohon isi semua kolom terlebih dahulu.');
      return;
    }

    try {
      await sendFormSubmit({
        name,
        email,
        message,
        _subject: `Pesan dari ${name}`,
      });
      alert(`Terima kasih, ${name}! Pesan Anda sudah kami terima.`);
      commentForm.reset();
    } catch (error) {
      alert('Maaf, pengiriman pesan gagal. Silakan coba lagi.');
    }
  });
}

});

const initYouTubeLite = () => {
  const items = document.querySelectorAll('.youtube-lite');
  if (!items || !items.length) return;

  items.forEach(el => {
    const id = el.dataset.id || el.getAttribute('data-id');
    if (!id) return;

    const thumb = document.createElement('img');
    thumb.decoding = 'async';
    thumb.loading = 'lazy';
    thumb.className = 'youtube-thumb';
    thumb.alt = 'YouTube thumbnail';
    thumb.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'youtube-play';
    play.setAttribute('aria-label', 'Putar video');
    play.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>';

    el.innerHTML = '';
    el.appendChild(thumb);
    el.appendChild(play);

    const renderIframe = () => {
      if (el.dataset.rendered) return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure');
      iframe.setAttribute('allowfullscreen', '');
      iframe.width = '100%';
      iframe.height = '100%';
      el.innerHTML = '';
      el.appendChild(iframe);
      el.dataset.rendered = '1';
    };

    el.addEventListener('click', (e) => {
      e.preventDefault();
      renderIframe();
    }, { once: true });

    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        renderIframe();
      }
    });
  });
};

initYouTubeLite();