/* Rehave shop layer: stories, hot deals, best sellers, bundle builder, shoppable videos, extra offers, cart drawer.
   Placeholder catalog. Swap PRODUCTS for the real one (prices in EGP). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = false; // always animate, same as zestia.js
  const Z = 'assets/img/z/', S = 'assets/img/shop/';
  const LE = (n) => 'LE ' + Math.round(n).toLocaleString('en-US');
  const LE2 = (n) => 'LE ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ---------- catalog ---------- */
  const PRODUCTS = [
    { id: 'cream', name: 'Caffiplus Hair Cream', size: '250 g', price: 320, old: 420, img: Z + 'rehave-cream.webp', alt: Z + 'rehave-jar.webp', rating: 4.9, reviews: 412, sold: 2140, stock: 12, cap: 60, badges: ['Best seller'], single: true },
    { id: 'mask', name: 'Caffiplus Hair Mask', size: '500 g', price: 390, old: 480, img: Z + 'rehave-mask.webp', rating: 4.8, reviews: 286, sold: 1630, stock: 18, cap: 60, badges: ['Keratin'], single: true },
    { id: 'lotion', name: 'Anti Hair-Loss Lotion', size: '150 ml', price: 280, old: 350, img: S + 'lotion.webp', rating: 4.7, reviews: 131, sold: 980, stock: 7, cap: 40, badges: ['New'], isNew: true, single: true },
    { id: 'shampoo', name: 'Grow & Glow Shampoo', size: '400 ml', price: 240, old: 300, img: S + 'shampoo.webp', rating: 4.8, reviews: 174, sold: 1210, stock: 22, cap: 60, badges: ['Sulfate free'], isNew: true, single: true },
    { id: 'conditioner', name: 'Grow & Glow Conditioner', size: '400 ml', price: 240, old: 290, img: S + 'conditioner.webp', rating: 4.6, reviews: 98, sold: 760, stock: 25, cap: 60, badges: ['New'], isNew: true, single: true },
    { id: 'cream-xl', name: 'Hair Cream XL', size: '500 g', price: 540, old: 690, img: Z + 'hero-product-cream.webp', alt: Z + 'rehave-jar.webp', rating: 4.9, reviews: 203, sold: 890, stock: 9, cap: 40, badges: ['Value size'], single: true },
    { id: 'duo', name: 'Softness Duo', size: 'Cream + Mask', price: 610, old: 710, imgs: [Z + 'rehave-mask.webp', Z + 'rehave-cream.webp'], rating: 4.9, reviews: 77, sold: 640, stock: 14, cap: 40, badges: ['Free gift'], bundle: true },
    { id: 'wash', name: 'Wash Day Trio', size: 'Shampoo + Lotion + Conditioner', price: 599, old: 760, imgs: [S + 'shampoo.webp', S + 'lotion.webp', S + 'conditioner.webp'], rating: 4.7, reviews: 52, sold: 410, stock: 11, cap: 40, badges: ['Save LE 161'], bundle: true },
    { id: 'set', name: 'The Full Ritual', size: '5 pieces', price: 1190, old: 1470, img: Z + 'hero-set-rehave.webp', rating: 5.0, reviews: 64, sold: 520, stock: 6, cap: 30, badges: ['Best value', 'Free gift'], bundle: true },
  ];
  const P = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const off = (p) => Math.round((1 - p.price / p.old) * 100);
  const pic = (p) => p.img || p.imgs[1] || p.imgs[0];

  const STORIES = [
    { label: 'Hair cream', av: Z + 'rehave-cream.webp', slides: [
      { src: Z + 'rehave-jar.webp', t: 'Melts in. Softness stays.', x: 'Avocado oil, shea butter and vitamin E in one whipped cream.', go: '#bestsellers', tab: 'best' },
      { prod: 'cream', t: 'Our number one jar', x: 'Over 2,000 jars this month. Now 24% off.', go: '#deals' } ] },
    { label: 'Scalp care', av: S + 'lotion.webp', slides: [
      { img: Z + 'review-3.webp', t: 'Start at the root', x: 'A light lotion with caffeine and saw palmetto for a stronger scalp.', go: '#bestsellers', tab: 'new' },
      { prod: 'lotion', t: 'Anti hair-loss lotion', x: 'Zero alcohol, zero silicone, zero parabens.', go: '#deals' } ] },
    { label: 'Wash day', av: S + 'shampoo.webp', slides: [
      { img: Z + 'review-2.webp', t: 'Wash. Condition. Glow.', x: 'The Grow & Glow pair, sulfate and silicone free.', go: '#bundles' },
      { prod: 'wash', t: 'Wash Day Trio', x: 'Three steps for LE 599.', go: '#bundles' } ] },
    { label: 'Masks', av: Z + 'rehave-mask.webp', slides: [
      { prod: 'mask', t: 'Ten minutes for you', x: 'Keratin, shea butter and argan oil. Leave it on, breathe out.', go: '#bestsellers', tab: 'top' } ] },
    { label: 'Bundles', av: Z + 'hero-set-rehave.webp', slides: [
      { prod: 'set', t: 'The full ritual', x: 'Five pieces, one routine. Save LE 280 plus a free gift.', go: '#bundles' } ] },
    { label: 'Offers', av: Z + 'avocado-dewy.webp', slides: [
      { img: Z + 'review-1.webp', t: '15% off your first order', x: 'Use WELCOME15 at checkout. Free delivery over LE 500.', go: '#offers' } ] },
  ];

  const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  /* ---------- markup helpers ---------- */
  const STAR = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>';
  const PLUS = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';
  const CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  const stars = (r) => `<span class="stars">${STAR.repeat(5)}</span><span class="text-[14px] text-[#666]">${r.toFixed(1)}</span>`;
  // Flair-style studio photos (3:4): main + hover shot
  const PH = 'assets/img/shop/studio/';
  const ALT = { cream: 'cream-open-b' };
  const imgsHTML = (p) => `<img class="photo main has-alt" src="${PH}${p.id}-a.webp" alt="${p.name}" loading="lazy"><img class="photo alt" src="${PH}${ALT[p.id] || p.id + '-b'}.webp" alt="" loading="lazy">`;
  const imgsHTML0 = (p) => p.imgs
    ? `<div class="multi">${p.imgs.map((s) => `<img src="${s}" alt="" loading="lazy">`).join('')}</div>`
    : `<img class="main${p.alt ? ' has-alt' : ''}" src="${p.img}" alt="${p.name}" loading="lazy">${p.alt ? `<img class="alt" src="${p.alt}" alt="" loading="lazy">` : ''}`;

  const MAG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 3.5 3.5"/></svg>';
  const DESC = {
    cream: 'Whipped avocado oil, shea butter and vitamin E. Melts into lengths and ends for soft, frizz-free hair all day.',
    mask: 'A weekly deep treatment with keratin, shea butter and argan oil to strengthen and smooth from root to tip.',
    lotion: 'A light scalp lotion with caffeine and saw palmetto. Zero alcohol, silicone and parabens.',
    shampoo: 'Sulfate and silicone free cleanse with keratin and vitamin B5 for fuller-looking hair.',
    conditioner: 'Detangles and seals in moisture with keratin and argan oil. Silicone and paraben free.',
    'cream-xl': 'Our best-selling hair cream in a value size, for the whole family or the long-hair ritual.',
  };
  const desc = (p) => DESC[p.id] || `${p.size}. A Rehave ritual set, curated so every step works together. ${p.badges.includes('Free gift') ? 'Comes with a free gift.' : ''}`;

  // Flair "ff-card": white bordered card, square shot, % pill, sale price, "You save" chip, full-width Add To Cart
  const BAG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.5L21 8H6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>';
  function card(p, o = {}) {
    return `<article class="pcard ffc${o.cls ? ' ' + o.cls : ''}" data-id="${p.id}">
      <div class="ff-media" data-qv="${p.id}" role="button" tabindex="0" aria-label="Quick view ${p.name}"><span class="ff-off">-${off(p)}%</span><img src="${PH}${p.id}-sq.webp" alt="${p.name}" loading="lazy"></div>
      <div class="ff-info">
        <h3 class="ff-name">${p.name}</h3>
        <div class="ff-price"><span class="ff-now">${LE2(p.price)}</span><s class="ff-was">${LE2(p.old)}</s></div>
        <span class="ff-save">&#9825; You save ${LE2(p.old - p.price)}</span>
        <button type="button" class="ff-btn" data-add="${p.id}">${BAG} Add To Cart</button>
      </div>
    </article>`;
  }

  /* ---------- cart ---------- */
  let cart = store.get('rehave-cart', []);
  const GIFT = 750;
  const total = () => cart.reduce((a, l) => a + l.p * l.q, 0);
  const count = () => cart.reduce((a, l) => a + l.q, 0);

  function addLine(line, srcImg) {
    const ex = cart.find((l) => l.k === line.k);
    ex ? ex.q++ : cart.push({ ...line, q: 1 });
    store.set('rehave-cart', cart); renderCart(true);
    if (srcImg) fly(srcImg); toast(line);
  }
  const addProduct = (id, srcImg) => { const p = P[id]; addLine({ k: id, n: p.name, s: p.size, img: pic(p), p: p.price }, srcImg); };

  function renderCart(bump) {
    const c = count(), t = total(), bub = $('#cart-count');
    bub.textContent = c; bub.classList.toggle('on', c > 0);
    if (bump) { bub.classList.remove('bump'); void bub.offsetWidth; bub.classList.add('bump'); }
    $('#d-count').textContent = `(${c})`; $('#d-sub').textContent = LE(t);
    $('#d-lines').innerHTML = cart.length ? cart.map((l) => `
      <li class="flex items-center gap-4 border-b border-black/5 py-4" data-k="${l.k}">
        <img src="${l.img}" alt="" class="h-[76px] w-[76px] shrink-0 rounded-[14px] object-contain p-1" style="background:radial-gradient(circle at 50% 30%,#fff,#f1e6f8)">
        <div class="min-w-0 flex-1"><p class="pname">${l.n}</p><p class="mt-1 truncate text-[15px] text-[#666]">${l.s}</p>
          <div class="mt-2 flex items-center justify-between"><span class="qty"><button type="button" data-q="-1" aria-label="Decrease">−</button><span>${l.q}</span><button type="button" data-q="1" aria-label="Increase">+</button></span>
          <span class="text-[20px] font-bold">${LE(l.p * l.q)}</span></div></div>
      </li>`).join('') : `<li class="flex flex-col items-center gap-3 py-16 text-center"><img src="${Z}rehave-jar.webp" alt="" class="h-[120px] opacity-60"><p class="pname">Your bag is empty</p><p class="text-[17px] text-[#666]">A little softness is one tap away.</p></li>`;
    const rem = Math.max(0, GIFT - t), pct = Math.min(100, (t / GIFT) * 100) + '%';
    const msg = rem ? `Spend ${LE(rem)} more to unlock a free silk scrunchie` : 'Free silk scrunchie unlocked. It is in your bag';
    $('#gift-msg').textContent = msg; $('#d-gift').textContent = msg;
    $('#gift-fill').style.width = pct; $('#d-gift-fill').style.width = pct;
  }
  $('#d-lines').addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    const l = cart.find((x) => x.k === b.closest('[data-k]').dataset.k);
    l.q += +b.dataset.q; if (l.q <= 0) cart = cart.filter((x) => x !== l);
    store.set('rehave-cart', cart); renderCart();
  });

  // drawer open/close
  const drawer = $('#drawer'), scrim = $('#scrim');
  const openCart = () => { drawer.classList.add('on'); scrim.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); };
  const closeCart = () => { drawer.classList.remove('on'); scrim.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); };
  $('#cart-btn').addEventListener('click', openCart);
  $$('.js-open-cart').forEach((b) => b.addEventListener('click', openCart));
  scrim.addEventListener('click', closeCart);
  $('.js-close', drawer).addEventListener('click', closeCart);

  // feedback
  let tT;
  function toast(l) {
    const t = $('#toast'); t.innerHTML = `<img src="${l.img}" alt="">Added to your bag <span class="text-[#d9bfea]">${LE(l.p)}</span>`;
    t.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('on'), 2200);
  }
  function fly(src) {
    if (reduce) return;
    const a = src.getBoundingClientRect(), b = $('#cart-btn').getBoundingClientRect();
    if (!a.width) return;
    const im = document.createElement('img'); im.src = src.currentSrc || src.src; im.className = 'fly';
    Object.assign(im.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
    document.body.appendChild(im);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    gsap.timeline({ onComplete: () => im.remove() })
      .to(im, { x: dx, duration: 0.8, ease: 'power2.inOut' }, 0)
      .to(im, { y: dy, duration: 0.8, ease: 'back.in(1.4)' }, 0)
      .to(im, { scale: 0.08, rotation: 25, duration: 0.8, ease: 'power2.in' }, 0)
      .to(im, { opacity: 0, duration: 0.15 }, 0.65);
  }

  // every add button on the page
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    e.stopPropagation();
    const host = b.closest('.pcard, .vid, #vv-bar, .qv-frame');
    addProduct(b.dataset.add, host && $('img', host));
    if (b.classList.contains('sbtn')) return;
    const orig = b.dataset.orig || (b.dataset.orig = b.innerHTML);
    b.classList.add('ok'); b.innerHTML = b.classList.contains('ff-btn') ? CHECK + ' Added To Cart' : CHECK;
    clearTimeout(b._t); b._t = setTimeout(() => { b.classList.remove('ok'); b.innerHTML = orig; }, 1400);
  });

  /* ---------- 1. stories ---------- */
  const seen = new Set(store.get('rehave-stories', []));
  $('#story-row').innerHTML = STORIES.map((s, i) => `
    <button type="button" class="story${seen.has(i) ? ' seen' : ''}" data-story="${i}" aria-label="Open ${s.label} story">
      <span class="ring"><span><img class="cut" src="${s.av}" alt=""></span></span><span class="lbl2">${s.label}</span>
    </button>`).join('');
  const sv = $('#story-view'); let si = 0, ss = 0, sTw;
  function showSlide() {
    const st = STORIES[si], sl = st.slides[ss];
    $('#sv-bars').innerHTML = st.slides.map((_, i) => `<span><i style="width:${i < ss ? 100 : 0}%"></i></span>`).join('');
    $('#sv-av').src = st.av; $('#sv-name').textContent = st.label;
    const im = $('#sv-img');
    if (sl.prod || sl.src) { im.src = sl.src || pic(P[sl.prod]); im.style.objectFit = 'contain'; im.style.padding = '90px 40px 200px'; im.style.background = 'radial-gradient(120% 80% at 50% 30%,#fff,#f1e6f8 55%,#d9bfea)'; }
    else { im.src = sl.img; im.style.objectFit = 'cover'; im.style.padding = '0'; im.style.background = '#000'; }
    $('#sv-title').textContent = sl.t; $('#sv-text').textContent = sl.x;
    gsap.fromTo(['#sv-title', '#sv-text', '#sv-cta'], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
    sTw && sTw.kill();
    sTw = gsap.to($$('#sv-bars i')[ss], { width: '100%', duration: 5, ease: 'none', onComplete: nextSlide });
  }
  function openStory(i) { si = i; ss = 0; sv.classList.add('on'); sv.setAttribute('aria-hidden', 'false'); markSeen(i); showSlide(); }
  function markSeen(i) { seen.add(i); store.set('rehave-stories', [...seen]); const b = $(`[data-story="${i}"]`); b && b.classList.add('seen'); }
  function nextSlide() {
    if (ss < STORIES[si].slides.length - 1) { ss++; return showSlide(); }
    if (si < STORIES.length - 1) { si++; ss = 0; markSeen(si); return showSlide(); }
    closeStory();
  }
  function prevSlide() {
    if (ss > 0) ss--; else if (si > 0) { si--; ss = 0; } showSlide();
  }
  function closeStory() { sTw && sTw.kill(); sv.classList.remove('on'); sv.setAttribute('aria-hidden', 'true'); }
  $('#story-row').addEventListener('click', (e) => { const b = e.target.closest('[data-story]'); b && openStory(+b.dataset.story); });
  $('#sv-next').addEventListener('click', nextSlide);
  $('#sv-prev').addEventListener('click', prevSlide);
  $('.js-close', sv).addEventListener('click', closeStory);
  sv.addEventListener('click', (e) => { if (e.target === sv) closeStory(); });
  $('#sv-cta').addEventListener('click', () => {
    const sl = STORIES[si].slides[ss]; closeStory();
    if (sl.tab) setTab(sl.tab);
    const el = $(sl.go); el && el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  let sy0 = null;
  sv.addEventListener('pointerdown', (e) => { sy0 = e.clientY; sTw && sTw.pause(); });
  sv.addEventListener('pointerup', (e) => { if (sy0 !== null && e.clientY - sy0 > 90) closeStory(); else sTw && sTw.resume(); sy0 = null; });

  /* ---------- 2. hot deals: countdown + rail ---------- */
  const cd = $('#countdown');
  cd.innerHTML = ['Hours', 'Mins', 'Secs'].map((l, i) => `${i ? '<span class="cd-sep">:</span>' : ''}<div class="cd-unit"><div class="cd-digits"><span class="cd-d"><span>0</span></span><span class="cd-d"><span>0</span></span></div><span class="cd-l">${l}</span></div>`).join('');
  const dEls = $$('.cd-d', cd); let last = '';
  function tick() {
    const n = new Date(), end = new Date(n); end.setHours(24, 0, 0, 0);
    let s = Math.max(0, Math.floor((end - n) / 1000));
    const str = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((v) => String(v).padStart(2, '0')).join('');
    [...str].forEach((d, i) => {
      if (d === last[i]) return;
      const box = dEls[i], old = box.firstElementChild, nu = document.createElement('span'); nu.textContent = d; box.appendChild(nu);
      if (reduce || !last) { old.remove(); return; }
      gsap.fromTo(nu, { yPercent: -100 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' });
      gsap.to(old, { yPercent: 100, opacity: 0, duration: 0.45, ease: 'power3.out', onComplete: () => old.remove() });
    });
    last = str;
  }
  tick(); setInterval(tick, 1000);

  const DEALS = ['cream', 'mask', 'set', 'lotion', 'cream-xl', 'shampoo', 'conditioner', 'duo'];
  $('#deal-track').innerHTML = DEALS.map((id) => card(P[id], { deal: true, cls: 'rv' })).join('');
  const rail = $('#deal-rail'), bar = $('#deal-bar');
  const railProg = () => {
    const max = rail.scrollWidth - rail.clientWidth, vis = rail.clientWidth / rail.scrollWidth;
    bar.style.width = vis * 100 + '%'; bar.style.transform = `translateX(${max ? (rail.scrollLeft / max) * (1 / vis - 1) * 100 : 0}%)`;
  };
  const navEl = $('#nav'); const navSolid = () => navEl && navEl.classList.toggle('solid', scrollY > 40);
  addEventListener('scroll', navSolid, { passive: true }); navSolid();
  rail.addEventListener('scroll', railProg, { passive: true }); addEventListener('resize', railProg); railProg();
  $$('[data-rail]').forEach((b) => b.addEventListener('click', () => rail.scrollBy({ left: +b.dataset.rail * 300, behavior: 'smooth' })));
  // mouse drag (touch scrolls natively)
  let dx0 = null, sl0 = 0, moved = false;
  rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.target.closest('button')) return; dx0 = e.clientX; sl0 = rail.scrollLeft; moved = false; });
  addEventListener('pointermove', (e) => { if (dx0 === null) return; const d = e.clientX - dx0; if (Math.abs(d) > 4) { moved = true; rail.classList.add('drag'); } rail.scrollLeft = sl0 - d; });
  addEventListener('pointerup', () => { if (dx0 === null) return; dx0 = null; rail.classList.remove('drag'); });
  rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  rail.addEventListener('dragstart', (e) => e.preventDefault());

  /* ---------- 3. best sellers: tabs ---------- */
  const LISTS = {
    best: () => [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 6),
    top: () => [...PRODUCTS].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 6),
    new: () => [...PRODUCTS.filter((p) => p.isNew), P['duo'], P['wash'], P['cream-xl']].slice(0, 6),
  };
  const grid = $('#best-grid'), tabs = $('#tabs'), ind = $('.tab-ind', tabs);
  const moveInd = () => { const b = $('[aria-selected="true"]', tabs); ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft}px)`; };
  function renderGrid(animate) {
    const key = $('[aria-selected="true"]', tabs).dataset.tab;
    grid.innerHTML = LISTS[key]().map((p) => card(p)).join('');
    if (animate && !reduce) gsap.from($$('.pcard', grid), { y: 40, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'back.out(1.4)', clearProps: 'transform' });
  }
  function setTab(k) {
    const b = $(`[data-tab="${k}"]`, tabs); if (!b || (b.getAttribute('aria-selected') === 'true' && !goalOn)) return;
    goalOn && clearGoal();
    $$('[data-tab]', tabs).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    moveInd(); renderGrid(true);
  }
  tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); b && setTab(b.dataset.tab); });
  addEventListener('resize', moveInd);
  renderGrid(false); $$('.pcard', grid).forEach((c) => c.classList.add('rv')); moveInd();
  document.fonts && document.fonts.ready.then(moveInd);

  /* ---------- 3b. shop by hair goal (accordion -> filters best sellers) ---------- */
  const GOALS = [
    { id: 'soft', k: 'For curls & frizz', t: 'Softness & definition', ids: ['cream', 'cream-xl'], img: Z + 'rehave-cream.webp', s: .3, g: 'linear-gradient(160deg,#f4ecfa 0%,#d9c1ec 100%)' },
    { id: 'repair', k: 'For dry, tired ends', t: 'Deep repair', ids: ['mask'], img: Z + 'rehave-mask.webp', s: .42, g: 'linear-gradient(160deg,#f8eef4 0%,#e3c2d9 100%)' },
    { id: 'scalp', k: 'For thinning & shedding', t: 'Scalp & growth', ids: ['lotion'], img: S + 'lotion.webp', s: .6, g: 'linear-gradient(160deg,#eef0fa 0%,#c6c8ee 100%)' },
    { id: 'wash', k: 'For a gentle clean', t: 'Wash day', ids: ['shampoo', 'conditioner'], img: S + 'shampoo.webp', s: .6, g: 'linear-gradient(160deg,#f1ebfb 0%,#cbb8ef 100%)' },
    { id: 'ritual', k: 'For the full routine', t: 'Rituals & bundles', ids: ['duo', 'wash', 'set'], img: Z + 'hero-set-rehave.webp', s: .4, g: 'linear-gradient(160deg,#9a78b8 0%,#5b3f78 100%)', dark: true },
  ];
  const goalRow = $('#goal-row'), gf = $('#goal-filter');
  let goalOn = null;
  function clearGoal() { goalOn = null; gf.hidden = true; tabs.classList.remove('dim'); }
  function filterGoal(id) {
    const g = GOALS.find((x) => x.id === id); if (!g) return;
    goalOn = g; $('b', gf).textContent = g.t; gf.hidden = false; tabs.classList.add('dim');
    grid.innerHTML = g.ids.map((x) => card(P[x])).join('');
    $('#bestsellers').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    reduce || gsap.from($$('.pcard', grid), { y: 40, opacity: 0, duration: 0.7, delay: 0.35, stagger: 0.07, ease: 'back.out(1.4)', clearProps: 'transform' });
  }
  $('button', gf).addEventListener('click', () => { clearGoal(); renderGrid(true); });
  if (goalRow) {
    goalRow.innerHTML = GOALS.map((g, i) => {
      const ps = g.ids.map((x) => P[x]), from = Math.min(...ps.map((p) => p.price));
      return `<article class="goal${i ? '' : ' on'}${g.dark ? ' dark' : ''}" style="--g:${g.g};--s:${g.s}" data-goal="${g.id}" tabindex="0" role="button" aria-label="Shop ${g.t}">
        <span class="goal-num" aria-hidden="true">0${i + 1}</span>
        <span class="goal-v" aria-hidden="true">${g.t}</span>
        <img class="goal-img" src="${g.img}" alt="" loading="lazy">
        <div class="goal-body">
          <p class="goal-k">${g.k}</p>
          <h3 class="goal-t">${g.t}</h3>
          <p class="goal-m">${ps.length} product${ps.length > 1 ? 's' : ''} &middot; from ${LE2(from)}</p>
          <span class="goal-cta">Shop now <span aria-hidden="true">&rarr;</span></span>
        </div>
      </article>`;
    }).join('');
    const wide = matchMedia('(min-width: 810px)');
    const openGoal = (el) => { if (!el || el.classList.contains('on')) return; $$('.goal', goalRow).forEach((x) => x.classList.toggle('on', x === el)); };
    goalRow.addEventListener('mouseover', (e) => wide.matches && openGoal(e.target.closest('.goal')));
    goalRow.addEventListener('focusin', (e) => wide.matches && openGoal(e.target.closest('.goal')));
    goalRow.addEventListener('click', (e) => {
      const el = e.target.closest('.goal'); if (!el) return;
      if (wide.matches && !el.classList.contains('on')) { openGoal(el); return; } // touch tablets: first tap opens
      filterGoal(el.dataset.goal);
    });
    goalRow.addEventListener('keydown', (e) => { const el = e.target.closest('.goal'); if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); filterGoal(el.dataset.goal); } });
  }

  /* ---------- 4. bundle builder ---------- */
  const SINGLES = PRODUCTS.filter((p) => p.single && p.id !== 'cream-xl');
  const RATE = { 2: 0.1, 3: 0.2 };
  let pick = [];
  const chips = $('#chips'), tray = $('#tray'), slots = new Map();
  chips.innerHTML = SINGLES.map((p) => `<button type="button" class="chip" data-pick="${p.id}" aria-pressed="false"><img src="${p.img}" alt="">${p.name.replace('Caffiplus ', '').replace('Grow & Glow ', '')}</button>`).join('');
  const POS = { 1: [29], 2: [12, 46], 3: [2, 29, 56] };
  const money = { sub: 0, off: 0, tot: 0 };
  function renderBundle() {
    $$('[data-pick]', chips).forEach((c) => {
      const on = pick.includes(c.dataset.pick);
      c.setAttribute('aria-pressed', String(on)); c.disabled = !on && pick.length >= 3;
    });
    $('#tray-hint').style.opacity = pick.length ? 0 : 1;
    // tray slots
    slots.forEach((el, id) => { if (!pick.includes(id)) { slots.delete(id); gsap.to(el, { y: 160, opacity: 0, rotation: 10, duration: 0.45, ease: 'power3.in', onComplete: () => el.remove() }); } });
    pick.forEach((id, i) => {
      let el = slots.get(id); const left = POS[pick.length][i] + '%';
      if (!el) {
        el = document.createElement('img'); el.src = P[id].img; el.alt = ''; el.className = 'slot'; el.style.left = left; tray.appendChild(el); slots.set(id, el);
        reduce || gsap.from(el, { y: 180, opacity: 0, rotation: -12, scale: 0.7, duration: 0.8, ease: 'back.out(1.5)' });
      } else gsap.to(el, { left, duration: 0.6, ease: 'power3.out' });
      el.style.zIndex = pick.length === 3 && i === 1 ? 2 : 1;
    });
    $$('.b-pip').forEach((p) => p.classList.toggle('on', +p.dataset.pip <= pick.length));
    $('#b-step').textContent = `${pick.length} / 3`;
    $('#b-lines').innerHTML = pick.length ? pick.map((id) => `<li class="flex justify-between"><span>${P[id].name}</span><span>${LE(P[id].price)}</span></li>`).join('')
      : '<li class="text-[#999]">Nothing picked yet. Choose at least two.</li>';
    const sub = pick.reduce((a, id) => a + P[id].price, 0), rate = RATE[pick.length] || 0, offV = Math.round(sub * rate);
    $('#b-off-l').textContent = rate ? `Bundle saving (${rate * 100}%)` : 'Pick 2 to save 10%';
    gsap.to(money, { sub, off: offV, tot: sub - offV, duration: reduce ? 0 : 0.6, ease: 'power2.out', onUpdate: () => {
      $('#b-sub').textContent = LE(money.sub); $('#b-off').textContent = '- ' + LE(money.off); $('#b-total').textContent = LE(money.tot);
    } });
    $('#b-add').disabled = pick.length < 2;
  }
  chips.addEventListener('click', (e) => {
    const c = e.target.closest('[data-pick]'); if (!c) return; const id = c.dataset.pick;
    pick = pick.includes(id) ? pick.filter((x) => x !== id) : pick.length < 3 ? [...pick, id] : pick;
    renderBundle();
  });
  $('#b-add').addEventListener('click', () => {
    const sub = pick.reduce((a, id) => a + P[id].price, 0), tot = sub - Math.round(sub * (RATE[pick.length] || 0));
    const ids = [...pick].sort();
    addLine({ k: 'b:' + ids.join('+'), n: 'My ritual bundle', s: pick.map((id) => P[id].name.replace('Caffiplus ', '')).join(' + '), img: P[pick[0]].img, p: tot }, slots.get(pick[0]));
    pick = []; renderBundle();
  });
  renderBundle();
  $('#bundle-grid').innerHTML = ['duo', 'wash', 'set'].map((id) => card(P[id], { cls: 'rv' })).join('');

  /* ---------- 5. shoppable videos ---------- */
  $$('.vtag').forEach((t) => {
    const p = P[t.dataset.p];
    t.innerHTML = `<img src="${pic(p)}" alt=""><span class="min-w-0"><span class="block truncate text-[15px] font-medium leading-tight">${p.name}</span><span class="text-[15px] text-[#545454]">${LE(p.price)}</span></span><button type="button" class="add" data-add="${p.id}" aria-label="Add ${p.name} to bag">${PLUS}</button>`;
  });
  const vv = $('#video-view'), vvid = $('#vv-video'), snd = $('#vv-sound');
  const SND_ON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
  const SND_OFF = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5m0-5-5 5"/></svg>';
  const sndIcon = () => (snd.innerHTML = vvid.muted ? SND_OFF : SND_ON);
  $('#ticker').addEventListener('click', (e) => {
    const v = e.target.closest('.vid'); if (!v || e.target.closest('[data-add]')) return;
    const p = P[v.dataset.p];
    vvid.src = v.dataset.vid; vvid.muted = false; vvid.currentTime = 0; vvid.play().catch(() => { vvid.muted = true; vvid.play().catch(() => {}); sndIcon(); });
    sndIcon();
    $('#vv-bar').innerHTML = `<img src="${pic(p)}" alt=""><span class="min-w-0"><span class="block truncate text-[16px] font-medium leading-tight">${p.name}</span><span class="text-[15px] text-[#545454]">${LE(p.price)} <s class="text-[#999]">${LE(p.old)}</s></span></span><button type="button" class="add" data-add="${p.id}" aria-label="Add ${p.name} to bag">${PLUS}</button>`;
    vv.classList.add('on'); vv.setAttribute('aria-hidden', 'false');
  });
  snd.addEventListener('click', () => { vvid.muted = !vvid.muted; sndIcon(); });
  const closeVideo = () => { vv.classList.remove('on'); vv.setAttribute('aria-hidden', 'true'); vvid.pause(); };
  $('.js-close', vv).addEventListener('click', closeVideo);
  vv.addEventListener('click', (e) => { if (e.target === vv) closeVideo(); });

  const qv = $('#qv-view');
  function quickView(id) {
    const p = P[id];
    $('#qv-img').src = pic(p); $('#qv-img').alt = p.name;
    $('#qv-badges').innerHTML = `<span class="badge off">-${off(p)}%</span>` + p.badges.map((x) => `<span class="badge lav">${x}</span>`).join('');
    $('#qv-name').textContent = p.name;
    $('#qv-meta').innerHTML = `${p.size} · ${stars(p.rating)} <span>(${p.reviews} reviews)</span>`;
    $('#qv-price').textContent = LE2(p.price); $('#qv-old').textContent = LE2(p.old);
    $('#qv-desc').textContent = desc(p);
    $('#qv-add').dataset.add = id;
    qv.classList.add('on'); qv.setAttribute('aria-hidden', 'false');
  }
  const closeQV = () => { qv.classList.remove('on'); qv.setAttribute('aria-hidden', 'true'); };
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-qv]'); b && quickView(b.dataset.qv); });
  document.addEventListener('keydown', (e) => { if (e.key !== 'Enter' && e.key !== ' ') return; const b = e.target.closest && e.target.closest('.ff-media[data-qv]'); if (b) { e.preventDefault(); quickView(b.dataset.qv); } });
  $('.js-close', qv).addEventListener('click', closeQV);
  qv.addEventListener('click', (e) => { if (e.target === qv) closeQV(); });
  $('#qv-add').addEventListener('click', () => setTimeout(closeQV, 350));

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeStory(); closeVideo(); closeCart(); closeQV(); }
    if (sv.classList.contains('on')) { if (e.key === 'ArrowRight') nextSlide(); if (e.key === 'ArrowLeft') prevSlide(); }
  });

  /* ---------- 6. offers: copy codes + scratch card ---------- */
  $$('.code-pill').forEach((b) => b.addEventListener('click', () => {
    const ic = $('.code-ic', b);
    (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.code) : Promise.reject()).catch(() => {});
    b.classList.add('ok'); ic.textContent = 'Copied';
    reduce || gsap.fromTo(b, { scale: 0.94 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1,0.4)' });
    setTimeout(() => { b.classList.remove('ok'); ic.textContent = 'Copy'; }, 1800);
  }));

  const cv = $('#scratch'), cx = cv.getContext('2d');
  let scratched = false;
  function paintScratch() {
    if (scratched) return;
    const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1;
    if (!r.width) return;
    cv.width = r.width * d; cv.height = r.height * d; cx.setTransform(d, 0, 0, d, 0, 0);
    const g = cx.createLinearGradient(0, 0, r.width, r.height); g.addColorStop(0, '#9670b4'); g.addColorStop(0.55, '#d9bfea'); g.addColorStop(1, '#b896d0');
    cx.globalCompositeOperation = 'source-over'; cx.fillStyle = g; cx.fillRect(0, 0, r.width, r.height);
    cx.fillStyle = 'rgba(255,255,255,.18)';
    for (let i = 0; i < 70; i++) { cx.beginPath(); cx.arc(Math.random() * r.width, Math.random() * r.height, Math.random() * 2.2 + 0.4, 0, 7); cx.fill(); }
    cx.fillStyle = '#fff'; cx.textAlign = 'center';
    cx.font = '700 14px "DM Sans"'; cx.fillText('MYSTERY OFFER', r.width / 2, r.height / 2 - 30);
    cx.font = '700 34px "DM Sans"'; cx.fillText('Scratch me', r.width / 2, r.height / 2 + 14);
    cx.font = '400 14px "DM Sans"'; cx.fillText('Drag your finger or mouse', r.width / 2, r.height / 2 + 42);
  }
  let scr = false, n = 0;
  const scratchAt = (e) => {
    const r = cv.getBoundingClientRect(), z = r.width / cv.offsetWidth || 1;
    cx.globalCompositeOperation = 'destination-out'; cx.beginPath();
    cx.arc((e.clientX - r.left) / z, (e.clientY - r.top) / z, 26, 0, 7); cx.fill();
    if (++n % 12 === 0) {
      const data = cx.getImageData(0, 0, cv.width, cv.height).data; let clear = 0;
      for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clear++;
      if (clear / (data.length / 64) > 0.45) { scratched = true; cv.classList.add('done'); reduce || gsap.fromTo(cv.parentElement, { scale: 0.97 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1,0.4)' }); }
    }
  };
  cv.addEventListener('pointerdown', (e) => { scr = true; cv.setPointerCapture(e.pointerId); scratchAt(e); });
  cv.addEventListener('pointermove', (e) => scr && scratchAt(e));
  cv.addEventListener('pointerup', () => (scr = false));
  paintScratch();
  document.fonts && document.fonts.ready.then(paintScratch);
  addEventListener('resize', paintScratch);

  /* ---------- reveals + refresh ---------- */
  renderCart();
  if (!reduce) {
    gsap.set('.pcard.rv', { opacity: 0, y: 50 });
    ScrollTrigger.batch('.pcard.rv', { start: 'top 92%', once: true,
      onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'back.out(1.3)', overwrite: true, clearProps: 'transform' }) });
    $$('.story').forEach((s, i) => gsap.from(s, { scale: 0.6, opacity: 0, duration: 0.7, delay: i * 0.06, ease: 'back.out(1.8)', scrollTrigger: { trigger: '#story-row', start: 'top 90%', once: true } }));
    gsap.from('.goal', { y: 70, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '#goal-row', start: 'top 88%', once: true } });
    $$('.stock > span').forEach((s) => gsap.from(s, { scaleX: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 95%', once: true } }));
  }
  ScrollTrigger.refresh();
  // web-font swap (DM Sans) changes text heights after first layout: re-measure every trigger
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
