/* Rehave "Mix": Classic base + Journey "The secret is inside" hero + Petal Store podium, tabbed rail and flash deal.
   Cart lives in shop.js (window.Rehave); this file writes the same 'rehave-cart' key and asks shop.js to re-render. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const Z = 'assets/img/z/', S = 'assets/img/shop/', PH = S + 'studio/';
  const LE = (n) => 'LE ' + Math.round(n).toLocaleString('en-US');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mob = matchMedia('(max-width: 809px)').matches;
  const hasFlip = typeof Flip !== 'undefined';
  gsap.registerPlugin(ScrollTrigger); if (hasFlip) gsap.registerPlugin(Flip);
  const VW = innerWidth, VH = innerHeight;

  /* ================= HERO: the secret is inside (from journey.js chapter 3) ================= */
  const splitWords = (el) => {
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(w)); return; }
          const s = document.createElement('span'); s.className = 'ch'; s.textContent = w; f.appendChild(s);
        });
        n.replaceWith(f);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') n.classList.add('ch');
    });
    return $$('.ch', el);
  };
  const hero = $('#j-secret');
  if (hero) {
    if ('scrollRestoration' in history && !location.hash) { history.scrollRestoration = 'manual'; scrollTo(0, 0); }
    const sw = splitWords($('#j-secret-t'));
    const ings = $$('.j-ing', hero);
    const RX = mob ? VW * 0.24 : Math.min(VW * 0.3, 460), RY = Math.max(VH, 620) * 0.2;
    const cnt = $('[data-jcount]', hero), co = { v: 0 };
    const N = +cnt.dataset.jcount;
    const pos = (el, k = 1) => ({ x: +el.dataset.x * RX * k, y: +el.dataset.y * RY * k });
    // idle loop once the intro has landed: jar floats, pills drift, splash turns slowly
    const idle = () => {
      gsap.to('#j-core img', { y: -12, rotation: -3, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('#j-splash', { rotation: '+=360', duration: 90, ease: 'none', repeat: -1 });
      ings.forEach((el, i) => gsap.to(el, { y: pos(el).y + (i % 2 ? 8 : -8), duration: 2.4 + i * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    };
    // hide everything before the first paint so nothing flashes, then play the whole scene on load (no scroll needed)
    gsap.set(sw, { yPercent: 110, opacity: 0, rotation: 6 });
    gsap.set('#j-core', { scale: 0.4, opacity: 0 });
    gsap.set(ings, { x: 0, y: 0, scale: 0.2, opacity: 0 });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('#j-k3', { opacity: 0.8 }); gsap.set(sw, { yPercent: 0, opacity: 1, rotation: 0 }); gsap.set('#j-core', { scale: 1, opacity: 1 });
      gsap.set('#j-splash', { scale: 0.92, opacity: 1, rotation: 10 }); ings.forEach((el) => gsap.set(el, { ...pos(el), scale: mob ? 0.92 : 1, opacity: 1 }));
      gsap.set(['#j-stat', '.j-hint'], { opacity: 1 }); cnt.textContent = N;
    } else {
      const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: idle })
        .fromTo('#j-k3', { opacity: 0, y: 12 }, { opacity: 0.8, y: 0, duration: 0.6 })
        .to(sw, { yPercent: 0, opacity: 1, rotation: 0, stagger: 0.08, duration: 0.9 }, 0.1)
        .to('#j-core', { scale: 1, opacity: 1, duration: 1.1, ease: 'back.out(1.6)' }, 0.45)
        .fromTo('#j-splash', { scale: 0.2, opacity: 0, rotation: -20 }, { scale: 0.92, opacity: 1, rotation: 10, duration: 1.4, ease: 'expo.out' }, 1.1)
        .to(ings, { x: (i, el) => pos(el).x, y: (i, el) => pos(el).y, scale: mob ? 0.92 : 1, opacity: 1, duration: 0.9, ease: 'back.out(1.5)', stagger: 0.14 }, 1.45)
        .fromTo('#j-stat', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 2.2)
        .to(co, { v: N, duration: 1.3, ease: 'power2.out', onUpdate: () => (cnt.textContent = Math.round(co.v)) }, 2.2)
        .fromTo('.j-hint', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.8);
      const go = () => intro.play();
      if (document.readyState === 'complete') requestAnimationFrame(go);
      else addEventListener('load', go, { once: true });
      setTimeout(go, 2500); // slow images must not hold the hero back
    }
  }

  /* ================= SHOP: petal cards, podium, rail, flash deal (from store.js) ================= */
  const R = window.Rehave;
  if (!R || !$('#s-rail')) return;
  const P = R.P, PRODUCTS = Object.values(P);
  const off = (p) => Math.round((1 - p.price / p.old) * 100);
  const cut = (p) => p.img || p.imgs[1] || p.imgs[0];
  const ALT = { cream: 'cream-open-b' };
  const ING = {
    cream: ['Avocado oil', 'Shea butter', 'Vitamin E'], 'cream-xl': ['Avocado oil', 'Shea butter', 'Vitamin E'],
    mask: ['Keratin', 'Shea butter', 'Argan oil'], lotion: ['Caffeine', 'Saw palmetto', '0% alcohol'],
    shampoo: ['Keratin', 'Vitamin B5', 'Sulfate free'], conditioner: ['Keratin', 'Argan oil', 'Silicone free'],
    duo: ['Cream', 'Mask', 'Free gift'], wash: ['Shampoo', 'Lotion', 'Conditioner'], set: ['5 pieces', 'Full routine'],
  };
  const DESC = { mask: 'A weekly deep treatment with keratin, shea butter and argan oil to strengthen and smooth from root to tip.' };
  const G = { soft: 'linear-gradient(160deg,#f4ecfa,#d9c1ec)', repair: 'linear-gradient(160deg,#f8eef4,#e3c2d9)', scalp: 'linear-gradient(160deg,#eef0fa,#c6c8ee)', wash: 'linear-gradient(160deg,#f1ebfb,#cbb8ef)', ritual: 'linear-gradient(160deg,#ecdff7,#b896d0)', fresh: 'linear-gradient(160deg,#fbeff5,#e7c9e0)' };
  const GRAD = { cream: G.soft, 'cream-xl': G.soft, mask: G.repair, lotion: G.scalp, shampoo: G.wash, conditioner: G.fresh, duo: G.repair, wash: G.wash, set: G.ritual };
  const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>';
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/></svg>';
  const BAG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11a1.5 1.5 0 0 1-1.5 1.3H7.7A1.5 1.5 0 0 1 6.2 19z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/></svg>';

  /* ---------- cart: same key as shop.js, which owns the drawer, count and gift meter ---------- */
  const getCart = () => store.get('rehave-cart', []);
  const qtyOf = (id) => (getCart().find((l) => l.k === id) || {}).q || 0;
  function write(cart, bump) { store.set('rehave-cart', cart); R.sync(bump); }
  let tT;
  function toast(l) {
    const t = $('#toast'); t.innerHTML = `<img src="${l.img}" alt="">Added to your bag <span style="color:#d9bfea">${LE(l.p)}</span>`;
    t.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('on'), 2200);
  }
  function fly(src) {
    const a = src.getBoundingClientRect(), b = $('#cart-btn').getBoundingClientRect();
    if (!a.width || !b.width) return;
    const im = document.createElement('img'); im.src = src.currentSrc || src.src; im.className = 'fly';
    Object.assign(im.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', borderRadius: '24px', objectFit: 'cover' });
    document.body.appendChild(im);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    gsap.timeline({ onComplete: () => im.remove() })
      .to(im, { x: dx, duration: 0.8, ease: 'power2.inOut' }, 0)
      .to(im, { y: dy, duration: 0.8, ease: 'back.in(1.4)' }, 0)
      .to(im, { scale: 0.08, rotation: 25, borderRadius: '50%', duration: 0.8, ease: 'power2.in' }, 0)
      .to(im, { opacity: 0, duration: 0.15 }, 0.65);
  }
  function addProduct(id, src) {
    const p = P[id], cart = getCart(), ex = cart.find((l) => l.k === id);
    const line = { k: id, n: p.name, s: p.size, img: cut(p), p: p.price };
    ex ? ex.q++ : cart.push({ ...line, q: 1 });
    write(cart, true); if (src) fly(src); toast(line);
  }
  function stepQty(id, d, src) {
    if (d > 0) return addProduct(id, src);
    let cart = getCart(); const l = cart.find((x) => x.k === id); if (!l) return;
    l.q += d; if (l.q <= 0) cart = cart.filter((x) => x !== l);
    write(cart);
  }

  /* ---------- wishlist ---------- */
  const wish = new Set(store.get('rehave-wish', []));
  function burst(btn) {
    const r = btn.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const cols = ['#b48ad6', '#e3c2d9', '#7d5a9b', '#d9bfea'];
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('i'); s.className = 'petal'; s.style.left = cx + 'px'; s.style.top = cy + 'px'; s.style.background = cols[i % 4];
      document.body.appendChild(s);
      const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.4, rr = 34 + Math.random() * 30;
      gsap.fromTo(s, { scale: 0.4, rotation: Math.random() * 180 }, { x: Math.cos(a) * rr, y: Math.sin(a) * rr - 10, rotation: '+=' + (120 + Math.random() * 200), scale: 1, opacity: 0, duration: 0.9, ease: 'power3.out', onComplete: () => s.remove() });
    }
    gsap.fromTo(btn, { scale: 0.6 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1,0.35)', clearProps: 'transform' });
  }
  function toggleWish(id, btn) {
    const on = !wish.has(id); on ? wish.add(id) : wish.delete(id);
    store.set('rehave-wish', [...wish]);
    $$(`[data-wish="${id}"]`).forEach((b) => b.setAttribute('aria-pressed', String(on)));
    if (on) burst(btn);
    updateSavedTab();
    if (listKey === 'saved') applyList('saved', true);
  }

  /* ---------- card markup ---------- */
  const ctaInner = (id) => {
    const q = qtyOf(id);
    return q ? `<div class="pc-step"><button type="button" data-step="-1" aria-label="Remove one">−</button><span>${q}</span><button type="button" data-step="1" aria-label="Add one">+</button></div>`
      : `<button type="button" class="pc-add" data-addp="${id}">${BAG}<span>Add</span></button>`;
  };
  const cta = (id) => `<div class="pc-cta" data-cta="${id}">${ctaInner(id)}</div>`;
  function syncCTAs(silent) {
    $$('[data-cta]').forEach((el) => {
      const q = qtyOf(el.dataset.cta); if (el._q === q) return;
      const was = el._q; el._q = q; el.innerHTML = ctaInner(el.dataset.cta);
      if (!silent && was !== undefined && (!was || !q)) gsap.from(el.firstElementChild, { scale: 0.7, opacity: 0, duration: 0.45, ease: 'back.out(2.2)', clearProps: 'all' });
    });
  }
  document.addEventListener('rehave:cart', () => syncCTAs());
  addEventListener('storage', (e) => { if (e.key === 'rehave-cart') R.sync(); });
  const card = (p) => `
    <article class="pc" data-id="${p.id}" data-flip-id="${p.id}">
      ${p.badges[0] ? `<span class="pc-tag">${p.badges[0]}</span>` : ''}
      <button type="button" class="pc-heart" data-wish="${p.id}" aria-pressed="${wish.has(p.id)}" aria-label="Save ${p.name}">${HEART}</button>
      <div class="pc-media" data-qv="${p.id}" role="button" tabindex="0" aria-label="Quick view ${p.name}">
        <img class="pc-a" src="${PH}${p.id}-a.webp" alt="${p.name}" loading="lazy" draggable="false">
        <img class="pc-b" src="${PH}${ALT[p.id] || p.id + '-b'}.webp" alt="" loading="lazy" draggable="false">
        <span class="pc-sheen"></span>
        <div class="pc-ings">${ING[p.id].map((x) => `<span>${x}</span>`).join('')}</div>
        <span class="pc-dots" data-flipimg aria-hidden="true"><i></i><i></i></span>
      </div>
      <div class="pc-body">
        <div class="pc-top"><span class="pc-rate">${STAR}${p.rating.toFixed(1)} <em>(${p.reviews})</em></span><span>${p.size}</span></div>
        <h3 class="pc-name">${p.name}</h3>
        ${p.stock <= 10 ? `<p class="pc-stock"><span class="pc-sbar"><i style="width:${Math.max(8, (p.stock / p.cap) * 100)}%"></i></span>Only ${p.stock} left</p>` : ''}
        <div class="pc-foot">
          <div class="pc-price"><b>${LE(p.price)}</b><span><s>${LE(p.old)}</s><em>-${off(p)}%</em></span></div>
          ${cta(p.id)}
        </div>
      </div>
    </article>`;

  /* ---------- podium ---------- */
  const top3 = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 3);
  const maxSold = top3[0].sold;
  $('#s-podium').innerHTML = top3.map((p, i) => `
    <article class="s-step r${i + 1}" data-id="${p.id}">
      <span class="s-rank"><small>№</small>${i + 1}</span>
      ${i ? '' : `<span class="s-loved">${HEART.replace('<svg', '<svg width="13"')} Most loved</span>`}
      <div class="s-step-media" data-qv="${p.id}" role="button" tabindex="0" aria-label="Quick view ${p.name}"><span class="s-blob" style="--g:${GRAD[p.id]}"></span><img src="${cut(p)}" alt="${p.name}" loading="lazy"></div>
      <h3>${p.name}</h3>
      <div class="pc-top"><span class="pc-rate">${STAR}${p.rating.toFixed(1)} <em>(${p.reviews} reviews)</em></span><span>${p.size}</span></div>
      <div class="s-wk"><div class="s-wk-top"><span>Sold this month</span><b data-pcount="${p.sold}">${p.sold.toLocaleString('en-US')}</b></div><div class="s-wk-bar"><i style="--w:${(p.sold / maxSold).toFixed(3)}"></i></div></div>
      <div class="s-step-foot"><div class="pc-price"><b>${LE(p.price)}</b><span><s>${LE(p.old)}</s><em>-${off(p)}%</em></span></div>${cta(p.id)}</div>
    </article>`).join('');

  /* ---------- tabbed rail (Flip) ---------- */
  const TABS = [{ k: 'best', t: 'Best sellers' }, { k: 'new', t: 'New in' }, { k: 'bundles', t: 'Bundles' }, { k: 'u300', t: 'Under LE 300' }, { k: 'saved', t: 'Saved' }];
  const LIST = {
    best: () => [...PRODUCTS].sort((a, b) => b.sold - a.sold).map((p) => p.id),
    new: () => [...PRODUCTS.filter((p) => p.isNew), P['cream-xl'], P.duo].map((p) => p.id),
    bundles: () => PRODUCTS.filter((p) => p.bundle).map((p) => p.id),
    u300: () => PRODUCTS.filter((p) => p.price < 300).sort((a, b) => a.price - b.price).map((p) => p.id),
    saved: () => PRODUCTS.filter((p) => wish.has(p.id)).map((p) => p.id),
  };
  const tabs = $('#s-tabs'), ind = $('.s-tab-ind', tabs), rail = $('#s-rail'), fchip = $('#s-filter');
  tabs.insertAdjacentHTML('beforeend', TABS.map((t, i) => `<button type="button" class="s-tab" role="tab" data-tab="${t.k}" aria-selected="${!i}">${t.t}${t.k === 'saved' ? '<sup id="s-saved-n"></sup>' : ''}</button>`).join(''));
  rail.innerHTML = PRODUCTS.map(card).join('');
  const cardEl = Object.fromEntries($$('.pc', rail).map((c) => [c.dataset.id, c]));
  let listKey = 'best', goalIds = null;
  function updateSavedTab() { const n = $('#s-saved-n'); if (n) n.textContent = wish.size || ''; }
  const moveInd = () => {
    const b = $('[aria-selected="true"]', tabs);
    tabs.classList.toggle('dim', !b); if (!b) return;
    ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft}px)`;
  };
  function applyList(key, animate) {
    listKey = key;
    const ids = key === 'goal' ? goalIds : LIST[key]();
    const state = animate && hasFlip ? Flip.getState($$('.pc', rail)) : null;
    if (state) rail.style.minHeight = rail.offsetHeight + 'px'; // absolute Flip would collapse the rail
    PRODUCTS.forEach((p) => { cardEl[p.id].style.display = ids.includes(p.id) ? '' : 'none'; });
    ids.forEach((id) => rail.appendChild(cardEl[id]));
    rail.scrollLeft = 0;
    $('#s-empty').hidden = ids.length > 0;
    if (state) {
      Flip.from(state, { duration: 0.7, ease: 'power3.inOut', absolute: true, scale: false, nested: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05, delay: 0.15, ease: 'back.out(1.5)', clearProps: 'transform,opacity' }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.88, duration: 0.35, ease: 'power2.in' }),
        onComplete: () => { rail.style.minHeight = ''; railProg(); } });
    } else if (animate) {
      gsap.from($$('.pc', rail).filter((c) => c.style.display !== 'none'), { y: 40, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'back.out(1.4)', clearProps: 'transform,opacity' });
    }
    railProg();
  }
  function setTab(k) {
    if (!LIST[k]) k = 'best';
    $$('[data-tab]', tabs).forEach((x) => x.setAttribute('aria-selected', String(x.dataset.tab === k)));
    fchip.hidden = true; moveInd(); applyList(k, true);
  }
  // "What does your hair need?" goal cards (shop.js) filter this rail
  document.addEventListener('rehave:goal', (e) => {
    const g = e.detail; goalIds = g.ids;
    $$('[data-tab]', tabs).forEach((x) => x.setAttribute('aria-selected', 'false')); moveInd();
    $('b', fchip).textContent = g.t; fchip.hidden = false;
    const y = $('.s-rail-head').getBoundingClientRect().top + scrollY - ($('#nav') ? $('#nav').offsetHeight : 0) - 20;
    scrollTo({ top: y, behavior: 'smooth' });
    setTimeout(() => applyList('goal', true), 450);
  });
  document.addEventListener('rehave:tab', (e) => setTab(e.detail === 'top' ? 'best' : e.detail));
  tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); b && setTab(b.dataset.tab); });
  $('button', fchip).addEventListener('click', () => setTab('best'));
  addEventListener('resize', moveInd);

  const prog = $('#s-prog');
  function railProg() {
    const max = rail.scrollWidth - rail.clientWidth, vis = Math.min(1, rail.clientWidth / rail.scrollWidth);
    prog.style.width = vis * 100 + '%';
    prog.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * (1 / vis - 1) * 100 : 0}%)`;
    prog.parentElement.style.opacity = vis >= 0.999 ? 0 : 1;
  }
  rail.addEventListener('scroll', railProg, { passive: true }); addEventListener('resize', railProg);
  $$('[data-srail]').forEach((b) => b.addEventListener('click', () => rail.scrollBy({ left: +b.dataset.srail * (rail.clientWidth * 0.8), behavior: 'smooth' })));
  let dx0 = null, sl0 = 0, moved = false;
  rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.target.closest('button')) return; dx0 = e.clientX; sl0 = rail.scrollLeft; moved = false; });
  addEventListener('pointermove', (e) => { if (dx0 === null) return; const d = e.clientX - dx0; if (Math.abs(d) > 5) { moved = true; rail.classList.add('drag'); } if (moved) rail.scrollLeft = sl0 - d; });
  addEventListener('pointerup', () => { if (dx0 === null) return; dx0 = null; if (moved) { const x = rail.scrollLeft; rail.classList.remove('drag'); rail.scrollLeft = x; } });
  rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  /* ---------- card micro-interactions ---------- */
  if (fine) {
    let cur = null;
    document.addEventListener('pointermove', (e) => {
      const m = e.target.closest && e.target.closest('.pc-media');
      if (cur && cur !== m) { cur.classList.remove('tilt'); cur.style.removeProperty('--rx'); cur.style.removeProperty('--ry'); cur = null; }
      if (!m || rail.classList.contains('drag')) return;
      cur = m; m.classList.add('tilt');
      const r = m.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      m.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg'); m.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
      m.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); m.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    }, { passive: true });
  } else {
    const seen = new Set();
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting && e.intersectionRatio > 0.6 ? seen.add(e.target) : seen.delete(e.target))), { threshold: [0, 0.6, 1] });
    $$('.pc').forEach((c) => io.observe(c));
    setInterval(() => seen.forEach((c) => c.classList.toggle('flip')), 3200);
  }

  /* ---------- clicks (quick view [data-qv] and [data-add] stay with shop.js) ---------- */
  const hostImg = (el) => { const h = el.closest('.pc, .s-step, .s-deal'); return h && $('.pc-a, .s-step-media img, .s-deal-art img', h); };
  document.addEventListener('click', (e) => {
    const t = e.target; let b;
    if ((b = t.closest('[data-flipimg]'))) { e.stopPropagation(); b.closest('.pc').classList.toggle('flip'); return; }
    if ((b = t.closest('[data-wish]'))) return toggleWish(b.dataset.wish, b);
    if ((b = t.closest('[data-addp]'))) return addProduct(b.dataset.addp, hostImg(b));
    if ((b = t.closest('[data-step]'))) return stepQty(b.closest('[data-cta]').dataset.cta, +b.dataset.step, +b.dataset.step > 0 ? hostImg(b) : null);
  }, true);

  /* ---------- flash deal ---------- */
  const DEAL = P.mask;
  $('#s-deal').innerHTML = `
    <div class="s-deal-art" data-qv="${DEAL.id}"><span class="s-blob"></span><img src="${cut(DEAL)}" alt="${DEAL.name}" loading="lazy"><span class="s-sticker"><span><small>SAVE</small>${off(DEAL)}%</span></span></div>
    <div class="s-deal-body">
      <span class="s-deal-k"><span class="s-dot" style="background:#fff"></span>Flash deal · today only</span>
      <h3>${DEAL.name}</h3>
      <p>${DESC.mask}</p>
      <div class="s-deal-price"><b>${LE(DEAL.price)}</b><s>${LE(DEAL.old)}</s></div>
      <div class="s-cd" id="s-cd"></div>
      <div class="s-claim"><div class="s-claim-top"><span>${DEAL.cap - DEAL.stock} claimed</span><span>${DEAL.stock} left at this price</span></div><div class="s-claim-bar"><i style="width:${((DEAL.cap - DEAL.stock) / DEAL.cap) * 100}%"></i></div></div>
      <div>${cta(DEAL.id)}</div>
    </div>`;
  const cd = $('#s-cd');
  cd.innerHTML = ['Hours', 'Mins', 'Secs'].map((l, i) => `${i ? '<span class="s-cd-sep">:</span>' : ''}<div><span class="s-cd-box"><span class="s-cd-d"><span>0</span></span><span class="s-cd-d"><span>0</span></span></span><small>${l}</small></div>`).join('');
  const dEls = $$('.s-cd-d', cd); let last = '';
  function tick() {
    const n = new Date(), end = new Date(n); end.setHours(24, 0, 0, 0);
    const s = Math.max(0, Math.floor((end - n) / 1000));
    const str = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((v) => String(v).padStart(2, '0')).join('');
    [...str].forEach((d, i) => {
      if (d === last[i]) return;
      const box = dEls[i], old = box.lastElementChild, nu = document.createElement('span'); nu.textContent = d; box.appendChild(nu);
      if (!last) { old.remove(); return; }
      gsap.fromTo(nu, { yPercent: -100 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' });
      gsap.to(old, { yPercent: 100, opacity: 0, duration: 0.45, ease: 'power3.out', onComplete: () => old.remove() });
    });
    last = str;
  }
  tick(); setInterval(tick, 1000);

  /* ---------- initial render + motion ---------- */
  updateSavedTab(); syncCTAs(true); moveInd(); applyList('best', false);
  const rv = (sel, trig, vars = {}) => gsap.from(sel, { y: 50, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity', ...vars, scrollTrigger: { trigger: trig, start: 'top 85%', once: true } });
  $$('.s-sh').forEach((h) => rv(h.children, h));
  rv('.s-step', '#s-podium', { y: 80, stagger: 0.12 });
  ScrollTrigger.create({ trigger: '#s-podium', start: 'top 75%', once: true, onEnter: () => {
    gsap.from('.s-wk-bar i', { scaleX: 0, duration: 1.6, stagger: 0.15, ease: 'power3.out' });
    $$('[data-pcount]').forEach((el) => { const o = { v: 0 }; gsap.to(o, { v: +el.dataset.pcount, duration: 1.6, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('en-US')) }); });
  } });
  rv('#s-rail .pc', '#s-rail', { x: 60, y: 0 });
  rv('.s-deal', '#deal', { y: 60, scale: 0.97 });
  ScrollTrigger.create({ trigger: '#deal', start: 'top 70%', once: true, onEnter: () => gsap.from('.s-claim-bar i', { scaleX: 0, duration: 1.4, ease: 'power3.out' }) });
  gsap.fromTo('.s-deal-art img', { yPercent: 8, rotation: -4 }, { yPercent: -8, rotation: 3, ease: 'none', scrollTrigger: { trigger: '#deal', start: 'top bottom', end: 'bottom top', scrub: true } });
  ScrollTrigger.refresh();
  document.fonts && document.fonts.ready.then(() => { ScrollTrigger.refresh(); moveInd(); railProg(); });
  addEventListener('load', () => ScrollTrigger.refresh());
})();
