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
    const RX = mob ? VW * 0.27 : Math.min(VW * 0.3, 460), RY = Math.max(VH, 620) * (!mob && VH < 1000 ? 0.16 : 0.2);
    const IS = mob ? (VW < 380 ? 0.8 : 0.88) : 1; // pill scale: smaller on narrow phones so the top pair never touch
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
    gsap.set(ings, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.2, opacity: 0 }); // explicit centring: GSAP could read the first pill's CSS translate as 0%
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('#j-k3', { opacity: 0.8 }); gsap.set(sw, { yPercent: 0, opacity: 1, rotation: 0 }); gsap.set('#j-core', { scale: 1, opacity: 1 });
      gsap.set('#j-splash', { scale: 0.92, opacity: 1, rotation: 10 }); ings.forEach((el) => gsap.set(el, { ...pos(el), scale: IS, opacity: 1 }));
      gsap.set(['#j-stat', '.j-hint'], { opacity: 1 }); cnt.textContent = N;
    } else {
      const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: idle })
        .fromTo('#j-k3', { opacity: 0, y: 12 }, { opacity: 0.8, y: 0, duration: 0.6 })
        .to(sw, { yPercent: 0, opacity: 1, rotation: 0, stagger: 0.08, duration: 0.9 }, 0.1)
        .to('#j-core', { scale: 1, opacity: 1, duration: 1.1, ease: 'back.out(1.6)' }, 0.45)
        .fromTo('#j-splash', { scale: 0.2, opacity: 0, rotation: -20 }, { scale: 0.92, opacity: 1, rotation: 10, duration: 1.4, ease: 'expo.out' }, 1.1)
        .to(ings, { x: (i, el) => pos(el).x, y: (i, el) => pos(el).y, scale: IS, opacity: 1, duration: 0.9, ease: 'back.out(1.5)', stagger: 0.14 }, 1.45)
        .fromTo('#j-stat', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 2.2)
        .to(co, { v: N, duration: 1.3, ease: 'power2.out', onUpdate: () => (cnt.textContent = Math.round(co.v)) }, 2.2)
        .fromTo('.j-hint', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.8);
      // start as soon as the hero's own images (jar + splash) are ready, not after every image on the page
      let started = false;
      const go = () => { if (started) return; started = true; requestAnimationFrame(() => intro.play()); };
      const heroImgs = $$('#j-splash, #j-core img', hero);
      Promise.all(heroImgs.map((im) => (im.decode ? im.decode() : Promise.resolve()).catch(() => {}))).then(go);
      setTimeout(go, 1200); // a slow network must not hold the hero back
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
  }

  /* ---------- card markup ---------- */
  const ctaInner = (id) => {
    const q = qtyOf(id);
    return q ? `<div class="pc-step"><button type="button" data-step="-1" aria-label="Remove one">−</button><span>${q}</span><button type="button" data-step="1" aria-label="Add one">+</button></div>`
      : `<button type="button" class="pc-add" data-addp="${id}">${BAG}<span>Add</span></button>`;
  };
  const cta = (id) => `<div class="pc-cta" data-cta="${id}">${ctaInner(id)}</div>`;
  /* shared card corners: heart top-left, -% + tags top-right (same on every card) */
  const heartBtn = (p) => `<button type="button" class="c-heart" data-wish="${p.id}" aria-pressed="${wish.has(p.id)}" aria-label="Save ${p.name}">${HEART}</button>`;
  const corner = (p) => `${heartBtn(p)}<div class="c-tags"><span class="c-off">-${off(p)}%</span></div>`;
  /* ingredient tags in the card body (bundles: the main ingredients of their items) */
  const ings = (p) => `<div class="c-ings">${(p.bundle ? [...new Set(BITEMS[p.id].flatMap((i) => ING[i].filter((x) => !/free|alcohol/i.test(x))))].slice(0, 4) : ING[p.id]).map((x) => `<span>${x}</span>`).join('')}</div>`;
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

  /* ---------- rail card option 2: cards.html New in style 2, "Flip to see inside" (compare with Flair) ---------- */
  const FDESC = { cream: 'Whipped avocado oil, shea butter and vitamin E. Melts in for soft, frizz-free hair all day.', 'cream-xl': 'Our best seller in a value size.', mask: 'A weekly deep treatment that strengthens and smooths from root to tip.', lotion: 'A light scalp lotion. Zero alcohol, silicone and parabens.', shampoo: 'A sulfate and silicone free cleanse for fuller-looking hair.', conditioner: 'Detangles and seals in moisture. Silicone and paraben free.', duo: 'The cream and the mask together, with a free gift.', wash: 'Your full wash day: shampoo, lotion and conditioner.', set: 'All five pieces for the complete Rehave ritual.' };
  const flipCard = (p) => `
    <article class="pc pc-fl" data-id="${p.id}" data-flip-id="${p.id}"><div class="fl-inner">
      <div class="fl-face fl-front">${corner(p)}
        <div class="fl-media"><img class="pc-a" src="${PH}${p.id}-sq.webp" alt="${p.name}" loading="lazy" draggable="false"><button type="button" class="fl-info" data-fl aria-label="Show what is inside">i</button></div>
        <div class="fl-pad"><h3 class="fl-name">${p.name}</h3><div class="fl-price"><span class="fl-now">${LE(p.price)}</span><s class="fl-was">${LE(p.old)}</s></div></div></div>
      <div class="fl-face fl-back"><h4>What's inside</h4>${ings(p)}<p>${FDESC[p.id]}</p>
        <div class="fl-price"><span class="fl-now">${LE(p.price)}</span><s class="fl-was">${LE(p.old)}</s></div>
        <button type="button" class="fl-btn" data-addp="${p.id}">${BAG}<span>Add To Cart</span></button></div>
    </div></article>`;

  /* ---------- bundle card: cards.html Ready-made Style 2 body + Bundles Style 1 fan animation ---------- */
  const BITEMS = { duo: ['cream', 'mask'], wash: ['shampoo', 'lotion', 'conditioner'], set: ['cream', 'mask', 'lotion', 'shampoo', 'conditioner'] };
  const bunCard = (p) => { const it = BITEMS[p.id]; return `
    <article class="hd-card bn-card" data-id="${p.id}">${corner(p)}
      <div class="bn-media" style="--g:${GRAD[p.id]}" data-qv="${p.id}" role="button" tabindex="0" aria-label="Quick view ${p.name}"><span class="bn-count">${it.length} items</span>
        <div class="bn-fan">${it.slice(0, 3).map((i) => `<img src="${cut(P[i])}" alt="" loading="lazy" draggable="false">`).join('')}</div></div>
      <div class="bn-pad"><h3 class="bn-name">${p.name}</h3><span class="bn-sz">${p.size}</span>${ings(p)}
        <div class="bn-price"><span class="bn-now">${LE(p.price)}</span><s class="bn-was">${LE(p.old)}</s></div>
        <details class="bn-inside"><summary>What's inside (${it.length})</summary><ul>${it.map((i) => `<li><img src="${PH}${i}-sq.webp" alt="" loading="lazy"><span>${P[i].name.replace('Caffiplus ', '')}</span><em>${LE(P[i].price)}</em></li>`).join('')}</ul></details>
        <button type="button" class="bn-btn" data-addp="${p.id}">${BAG}<span>Add bundle</span></button></div>
    </article>`; };

  /* ---------- equation card: cards.html Bundles style 3 ("A + B = price") ---------- */
  const eqCard = (p) => { const it = BITEMS[p.id]; return `
    <article class="hd-card eq-card" data-id="${p.id}">${corner(p)}
      <div class="eq-row" style="--g:${GRAD[p.id]}" data-qv="${p.id}" role="button" tabindex="0" aria-label="Quick view ${p.name}">${it.slice(0, 3).map((i, n) => `${n ? '<i>+</i>' : ''}<img src="${cut(P[i])}" alt="${P[i].name}" loading="lazy">`).join('')}${it.length > 3 ? `<i>+${it.length - 3}</i>` : ''}</div>
      <div class="eq-res"><div class="eq-circle"><div><small>ONLY</small><b>${LE(p.price)}</b></div></div>
        <div class="eq-txt"><h3>${p.name}</h3>${ings(p)}<div><s>${LE(p.old)}</s> <span class="eq-save">&#9825; You save ${LE(p.old - p.price)}</span></div></div></div>
      <button type="button" class="bn-btn" data-addp="${p.id}">${BAG}<span>Add bundle</span></button>
    </article>`; };

  /* ---------- Best sellers row card: cards.html Best sellers style 1, "Flair classic" ---------- */
  const classicCard = (p) => `
    <article class="pc pc-cl" data-id="${p.id}" data-flip-id="${p.id}">${corner(p)}
      <div class="cl-media" data-qv="${p.id}" role="button" tabindex="0" aria-label="Quick view ${p.name}"><img class="cl-img" src="${PH}${p.id}-sq.webp" alt="${p.name}" loading="lazy" draggable="false"></div>
      <div class="cl-pad"><h3 class="cl-name">${p.name}</h3>${ings(p)}
        <div class="cl-price"><span class="cl-now">${LE(p.price)}</span><s class="cl-was">${LE(p.old)}</s></div>
        <span class="cl-save">&#9825; You save ${LE(p.old - p.price)}</span>
        <button type="button" class="cl-btn" data-addp="${p.id}">${BAG}<span>Add To Cart</span></button></div>
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

  /* ---------- row 1: Best sellers (Flair cards). The goal cards (shop.js) filter it. ---------- */
  const SINGLES = PRODUCTS.filter((p) => !p.bundle);
  const LIST = { best: () => [...SINGLES].sort((a, b) => b.sold - a.sold).map((p) => p.id) };
  const rail = $('#s-rail'), fchip = $('#s-filter');
  rail.innerHTML = SINGLES.map(classicCard).join('');
  let cardEl = Object.fromEntries($$('.pc', rail).map((c) => [c.dataset.id, c])), watchCards = () => {};
  /* row 2: Look inside (cards.html New in style 2, flip cards) */
  const rail2 = $('#s-rail2');
  if (rail2) rail2.innerHTML = [...SINGLES.filter((p) => p.isNew), ...SINGLES.filter((p) => !p.isNew)].map(flipCard).join('');
  let goalIds = null;
  function updateSavedTab() {}
  const moveInd = () => {};
  function applyList(key, animate) {
    const ids = key === 'goal' ? goalIds : LIST.best();
    const state = animate && hasFlip ? Flip.getState($$('.pc', rail)) : null;
    if (state) rail.style.minHeight = rail.offsetHeight + 'px'; // absolute Flip would collapse the rail
    SINGLES.forEach((p) => { cardEl[p.id].style.display = ids.includes(p.id) ? '' : 'none'; });
    ids.forEach((id) => cardEl[id] && rail.appendChild(cardEl[id]));
    rail.scrollLeft = 0;
    $('#s-empty').hidden = ids.some((id) => cardEl[id]);
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
  const setTab = () => { fchip.hidden = true; applyList('best', true); };
  // "What does your hair need?" goal cards (shop.js) filter the Best sellers row
  document.addEventListener('rehave:goal', (e) => {
    const g = e.detail; goalIds = g.ids;
    $('b', fchip).textContent = g.t; fchip.hidden = false;
    const y = $('#bestsellers .s-rail-head').getBoundingClientRect().top + scrollY - ($('#nav') ? $('#nav').offsetHeight : 0) - 20;
    scrollTo({ top: y, behavior: 'smooth' });
    setTimeout(() => applyList('goal', true), 450);
  });
  document.addEventListener('rehave:tab', setTab);
  $('button', fchip).addEventListener('click', setTab);

  const progOf = (r, bar) => () => {
    if (!r || !bar) return;
    const max = r.scrollWidth - r.clientWidth, vis = Math.min(1, r.clientWidth / r.scrollWidth);
    bar.style.width = vis * 100 + '%';
    bar.style.transform = `translateX(${max > 0 ? (r.scrollLeft / max) * (1 / vis - 1) * 100 : 0}%)`;
    bar.parentElement.style.opacity = vis >= 0.999 ? 0 : 1;
  };
  const railProg = progOf(rail, $('#s-prog')), railProg2 = progOf(rail2, $('#s-prog2'));
  rail.addEventListener('scroll', railProg, { passive: true }); rail2 && rail2.addEventListener('scroll', railProg2, { passive: true });
  addEventListener('resize', () => { railProg(); railProg2(); });
  $$('[data-srail]').forEach((b) => b.addEventListener('click', () => { const r = $('.s-rail', b.closest('.wrap')); r.scrollBy({ left: +b.dataset.srail * (r.clientWidth * 0.8), behavior: 'smooth' }); }));
  // mouse drag-to-scroll on both rails
  const dragRail = (r) => {
    let dx0 = null, sl0 = 0, moved = false;
    r.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.target.closest('button')) return; dx0 = e.clientX; sl0 = r.scrollLeft; moved = false; });
    addEventListener('pointermove', (e) => { if (dx0 === null) return; const d = e.clientX - dx0; if (Math.abs(d) > 5) { moved = true; r.classList.add('drag'); } if (moved) r.scrollLeft = sl0 - d; });
    addEventListener('pointerup', () => { if (dx0 === null) return; dx0 = null; if (moved) { const x = r.scrollLeft; r.classList.remove('drag'); r.scrollLeft = x; } });
    r.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  };
  dragRail(rail); rail2 && dragRail(rail2);

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
    watchCards = () => { io.disconnect(); seen.clear(); $$('.pc:not(.pc-fl):not(.pc-cl)').forEach((c) => io.observe(c)); };
    watchCards();
    setInterval(() => seen.forEach((c) => c.classList.toggle('flip')), 3200);
  }

  /* ---------- clicks (quick view [data-qv] and [data-add] stay with shop.js) ---------- */
  const hostImg = (el) => { const h = el.closest('.pc, .s-step, .s-deal, .hd-card, .qv-prow'); return h && $('.pc-a, .cl-img, .bn-fan img, .eq-row img, .s-step-media img, .s-deal-art img, .hd-media img, .qv-prow img', h); };

  document.addEventListener('click', (e) => {
    const t = e.target; let b;
    if ((b = t.closest('[data-fl]'))) { e.stopPropagation(); b.closest('.pc-fl').classList.toggle('flipped'); return; }
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
  /* more flash items (cards.html Hot deals style 2) and the Hot deals row (style 5, low stock) */
  const SQ = (id) => `assets/img/shop/studio/${id}-sq.webp`;
  const hdPrice = (p) => `<div class="hd-price"><span class="hd-now">${LE(p.price)}</span><s class="hd-was">${LE(p.old)}</s></div>`;
  const hdBtn = (id) => `<button type="button" class="hd-btn" data-addp="${id}">${BAG}<span>Add To Cart</span></button>`;
  const D = '<span class="s-cd-d"><span>0</span></span>';
  const mini = `<div class="hd-cd" aria-label="Ends at midnight">${[0, 1, 2].map((i) => `${i ? '<i>:</i>' : ''}${D}${D}`).join('')}</div>`;
  const d2 = (id) => { const p = P[id], cl = p.cap - p.stock; return `<article class="hd-card hd-d2">${corner(p)}
    <div class="hd-media" data-qv="${id}"><img src="${SQ(id)}" alt="${p.name}" loading="lazy">${mini}</div>
    <div class="hd-pad"><h3 class="hd-name">${p.name}</h3>${ings(p)}${hdPrice(p)}<div class="hd-claim"><div><span>${cl} claimed</span><span>${p.stock} left</span></div><span class="hd-bar"><i style="width:${cl / p.cap * 100}%"></i></span></div>${hdBtn(id)}</div></article>`; };
  const d4 = (id) => { const p = P[id]; return `<article class="hd-card hd-d4">${corner(p)}
    <div class="hd-media" data-qv="${id}"><img src="${SQ(id)}" alt="${p.name}" loading="lazy"></div>
    <div class="hd-pad"><span class="hd-urg"><i></i>Only ${p.stock} left</span><span class="hd-bar"><i style="width:${Math.max(10, p.stock / p.cap * 100)}%"></i></span><h3 class="hd-name">${p.name}</h3>${ings(p)}${hdPrice(p)}${hdBtn(id)}</div></article>`; };
  const FLASH = ['cream', 'lotion', 'shampoo'], HOT = ['cream', 'cream-xl', 'mask', 'lotion'];
  $('#s-deal-more').innerHTML = FLASH.map(d2).join('');
  $('#s-hot').innerHTML = HOT.map(d4).join('');
  /* Bundles row (Ready-made style 2 card + fan stack image) and Pair & save row (equation) */
  const SETS = ['duo', 'wash', 'set'];
  $('#s-sets').innerHTML = SETS.map((id) => bunCard(P[id])).join('');
  $('#s-eq').innerHTML = SETS.map((id) => eqCard(P[id])).join('');
  if (!matchMedia('(hover: hover)').matches) {
    const fanIO = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-fan', e.isIntersecting && e.intersectionRatio > 0.6)), { threshold: [0, 0.6, 1] });
    $$('.bn-card').forEach((c) => fanIO.observe(c));
  }

  const cd = $('#s-cd');
  cd.innerHTML = ['Hours', 'Mins', 'Secs'].map((l, i) => `${i ? '<span class="s-cd-sep">:</span>' : ''}<div><span class="s-cd-box"><span class="s-cd-d"><span>0</span></span><span class="s-cd-d"><span>0</span></span></span><small>${l}</small></div>`).join('');
  const groups = [cd, ...$$('.hd-cd')].map((t) => $$('.s-cd-d', t)); let last = '';
  function tick() {
    const n = new Date(), end = new Date(n); end.setHours(24, 0, 0, 0);
    const s = Math.max(0, Math.floor((end - n) / 1000));
    const str = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((v) => String(v).padStart(2, '0')).join('');
    [...str].forEach((d, i) => {
      if (d === last[i]) return;
      groups.forEach((dEls) => {
        const box = dEls[i], old = box.lastElementChild, nu = document.createElement('span'); nu.textContent = d; box.appendChild(nu);
        if (!last) { old.remove(); return; }
        gsap.fromTo(nu, { yPercent: -100 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' });
        gsap.to(old, { yPercent: 100, opacity: 0, duration: 0.45, ease: 'power3.out', onComplete: () => old.remove() });
      });
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
  rv('#s-deal-more .hd-card', '#s-deal-more');
  rv('#s-hot .hd-card', '#s-hot'); rv('#s-sets .hd-card', '#s-sets'); rv('#s-eq .hd-card', '#s-eq');
  ['#s-deal-more', '#s-hot'].forEach((g) => ScrollTrigger.create({ trigger: g, start: 'top 80%', once: true, onEnter: () => gsap.from(`${g} .hd-bar i`, { scaleX: 0, transformOrigin: 'left', duration: 1.4, stagger: 0.12, ease: 'power3.out' }) }));
  /* testimonials: cards.html Most loved style 3 (customer quote), endless loop */
  const QUOTES = [
    ['cream', 'Melts in, smells like a spa, and my curls finally behave.', 'Nour, Cairo', 1],
    ['mask', 'Ten minutes and my hair feels brand new. My weekly treat.', 'Salma, Alexandria', 2],
    ['lotion', 'Less hair in the shower after a month. I am a believer.', 'Mariam, Giza', 3],
    ['shampoo', 'Gentle, no squeaky feeling, and my roots stay fresh for days.', 'Yara, Mansoura', 1],
    ['conditioner', 'Detangles in seconds. My brush glides now, no more tears.', 'Hana, Tanta', 2],
    ['cream-xl', 'The big jar lasts forever and the softness is the same. Worth it.', 'Laila, Cairo', 3],
  ];
  const PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const qCard = ([id, q, who, av]) => { const p = P[id]; return `<article class="qv-card"><div class="qv-stars">${STAR.repeat(5)}</div><blockquote>"${q}"</blockquote>
    <div class="qv-who"><img src="assets/img/z/review-${av}.webp" alt="" loading="lazy"><div><b>${who}</b>Verified buyer</div></div>
    <div class="qv-prow"><img src="${SQ(id)}" alt="${p.name}" loading="lazy" data-qv="${id}"><div><h3 class="qv-name">${p.name}</h3><span class="qv-now">${LE(p.price)}</span> <s class="qv-was">${LE(p.old)}</s></div><button type="button" class="qv-rnd" data-addp="${id}" aria-label="Add ${p.name}">${PLUS}</button></div></article>`; };
  const qHtml = QUOTES.map(qCard).join('');
  $('#q-track').innerHTML = qHtml + qHtml.replace(/<article class="qv-card">/g, '<article class="qv-card" aria-hidden="true">');

  /* coupon ticket: the small WELCOME15 code copies too */
  $$('.tkt-mini').forEach((b) => b.addEventListener('click', () => {
    (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.code) : Promise.reject()).catch(() => {});
    b.classList.add('ok'); b.textContent = 'Copied'; setTimeout(() => { b.classList.remove('ok'); b.textContent = b.dataset.code; }, 1600);
  }));
  ScrollTrigger.refresh();
  document.fonts && document.fonts.ready.then(() => { ScrollTrigger.refresh(); railProg(); railProg2(); });
  addEventListener('load', () => ScrollTrigger.refresh());
})();
