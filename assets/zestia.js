/* Zestia landing clone: motion. Values taken from the Framer project's animation config. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- content ---------- */
  const REVIEWS = [
    { name: 'Ava Miller', img: 'review-1', text: 'Zestia is the little reset I reach for after long days. It melts in so softly, and the lemon note feels like opening a window.' },
    { name: 'Harper Davis', img: 'review-2', text: 'Zestia completely transformed my skin. Within a few weeks, my skin felt smoother, brighter and healthier.Zestia completely transformed my skin. Within a few weeks, my skin felt smoother, brighter and healthier.' },
    { name: 'Chloe Wilson', img: 'review-3', text: 'I have super sensitive skin and finding something clean and soothing is hard. Zestia has become an absolute staple in my daily routine.I have super sensitive skin and finding something clean and soothing is hard.' },
  ];
  const star = '<svg width="19" height="19" viewBox="0 0 24 24" fill="#121212"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>';

  // testimonial slides
  const slides = $('#slides');
  slides.innerHTML = REVIEWS.map((r, i) => `
    <div class="slide ${i ? '' : 'on'} flex flex-col gap-4 p-[10px] tab:h-[450px] tab:flex-row tab:gap-[16px]">
      <img src="assets/img/z/${r.img}.webp" alt="${r.name}" class="h-[300px] w-full shrink-0 rounded-[12px] object-cover tab:h-[430px] tab:w-[490px]">
      <div class="flex flex-1 flex-col px-[11px] pb-3 tab:w-[474px] tab:flex-none tab:p-[20px]">
        <div class="flex items-start justify-between tab:h-[40px] tab:pb-[18px]"><p class="text-[18px] font-bold leading-[21.6px] text-[#121212]">${r.name}</p><p class="tag !text-[#121212]">Verified buyer</p></div>
        <div class="mt-[20px] flex">${star.repeat(4)}</div>
        <p class="p-body mt-[18px] max-h-[130px] overflow-hidden">${r.text}</p>
      </div>
    </div>`).join('');
  const nav = document.createElement('div');
  nav.className = 'absolute bottom-[30px] right-[20px] hidden w-[434px] items-center justify-between tab:flex';
  nav.innerHTML = `<button data-dir="-1" class="tag flex items-center gap-2 transition-opacity">← <span>Prev</span></button>
    <div class="flex gap-[9px]">${REVIEWS.map((_, i) => `<button data-dot="${i}" class="h-2 w-2 rounded-full transition" aria-label="Slide ${i + 1}"></button>`).join('')}</div>
    <button data-dir="1" class="tag flex items-center gap-2 transition-opacity"><span>Next</span> →</button>`;
  slides.appendChild(nav);
  let cur = 0;
  const show = (n) => {
    cur = (n + REVIEWS.length) % REVIEWS.length;
    $$('.slide', slides).forEach((s, i) => s.classList.toggle('on', i === cur));
    $$('[data-dot]', nav).forEach((d, i) => { d.style.background = i === cur ? '#121212' : '#4f4f4f'; d.style.opacity = i === cur ? 1 : 0.31; });
    $('[data-dir="-1"]', nav).style.opacity = cur === 0 ? 0.47 : 1;
  };
  nav.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; b.dataset.dot ? show(+b.dataset.dot) : show(cur + +b.dataset.dir); });
  show(0);
  setInterval(() => { if (!document.hidden) show(cur + 1); }, 6000);

  // ticker: repeat the set so each half is wider than the viewport, then duplicate for a seamless -50% loop
  const tk = $('#ticker'); const base = tk.innerHTML; tk.innerHTML = base.repeat(2) + base.repeat(2);
  $$('video', tk).forEach((v) => { v.muted = true; v.play().catch(() => {}); });

  // tablet: scale the 1000–1073px desktop compositions to fit
  const fit = () => {
    const w = innerWidth;
    $$('[data-fit]').forEach((el) => { el.style.zoom = w >= 810 && w < 1200 ? Math.min(1, (w - 48) / 1073).toFixed(3) : ''; });
  };
  fit(); addEventListener('resize', fit);

  /* ---------- hero shader: port of Framer's "Wave Gradient" with the project's uniforms ---------- */
  function shader(cv, COL) {
    const gl = cv && cv.getContext('webgl2', { premultipliedAlpha: false, antialias: false });
    if (!gl) return;
    const vs = `#version 300 es
in vec2 p; out vec2 v_uv; void main(){ v_uv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
    const fs = `#version 300 es
precision highp float;
in vec2 v_uv; out vec4 fragColor;
uniform vec2 u_resolution; uniform float u_time;
uniform vec4 u_colors[4]; uniform int u_colors_length;
const float u_blendAmount = .7, u_maskSoftness = 1., u_seed = 29., u_waveAmplitude = 2., u_waveAngle = 105., u_waveFreqX = 1.2, u_waveFreqY = 6., u_waveSpeed = 1.;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){ float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }
vec2 hash(vec2 p){ float s = u_seed; vec2 k1 = vec2(2127.1 + s * 13.37, 81.17 + s * 7.31); vec2 k2 = vec2(1269.5 + s * 11.13, 283.37 + s * 5.79);
  p = vec2(dot(p, k1), dot(p, k2)); return fract(sin(p) * (43758.5453 + s * 1.618)); }
float noise(in vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3. - 2. * f);
  float n = mix(mix(dot(-1. + 2. * hash(i), f), dot(-1. + 2. * hash(i + vec2(1., 0.)), f - vec2(1., 0.)), u.x),
                mix(dot(-1. + 2. * hash(i + vec2(0., 1.)), f - vec2(0., 1.)), dot(-1. + 2. * hash(i + vec2(1., 1.)), f - vec2(1., 1.)), u.x), u.y);
  return .5 + .5 * n; }
vec3 getColor(int idx){ int s = clamp(idx, 0, u_colors_length - 1); return u_colors[s].rgb; }
float seedF(float base){ return base * (1. + .5 * sin(u_seed * 3.17 + base)); }
vec2 warpUV(vec2 uv){
  float t = u_time * u_waveSpeed; float angleOffset = sin(u_seed * 2.73) * 30.;
  mat2 dirRot = Rot(radians(u_waveAngle + angleOffset)); vec2 ruv = dirRot * uv;
  float fxMod = seedF(u_waveFreqX); float fyMod = seedF(u_waveFreqY);
  float phaseX = fract(sin(u_seed * 7.19) * 437.58) * 6.2832; float phaseY = fract(cos(u_seed * 3.41) * 291.37) * 6.2832;
  float harmonic = sin(u_seed * 1.23) * .5;
  float a = fyMod * ruv.y - sin(ruv.x * fxMod + ruv.y - t + phaseX);
  a += harmonic * sin(ruv.x * fxMod * 2. + ruv.y * .5 + t * .7 + phaseY);
  a = smoothstep(cos(a) * u_maskSoftness, sin(a) * u_maskSoftness + 3., cos(a - fyMod * ruv.y) - sin(a - fxMod * ruv.x));
  a *= u_waveAmplitude; uv = cos(a) * uv + sin(a) * vec2(-uv.y, uv.x); return uv; }
void main(){
  vec2 fragCoord = v_uv * u_resolution; vec2 uv = fragCoord / u_resolution.xy; float ratio = u_resolution.x / u_resolution.y;
  float t = u_time * u_waveSpeed; vec2 tuv = uv - .5;
  vec2 seedShift = vec2(sin(u_seed * 4.37), cos(u_seed * 5.91)) * 100.;
  float degree = noise(vec2(t * .1, tuv.x * tuv.y) + seedShift);
  tuv.y *= 1. / ratio; tuv *= Rot(radians((degree - .5) * 720. + 180.)); tuv.y *= ratio;
  vec2 uv2 = (fragCoord * 2. - u_resolution.xy) / (u_resolution.x + u_resolution.y) * 2.;
  float preRotAngle = fract(sin(u_seed * 5.63) * 173.29) * 6.2832; uv2 *= Rot(preRotAngle);
  vec2 warped = warpUV(uv2) * .5 + .5; vec2 blendUV = mix(tuv, warped - .5, u_blendAmount);
  float layerRot1 = -5. + sin(u_seed * 1.83) * 20.; float layerRot2 = 10. + cos(u_seed * 2.47) * 20.;
  vec3 c0 = getColor(0), c1 = getColor(1), c2 = getColor(2), c3 = getColor(3);
  vec3 layer1 = mix(c0, c2, S(-.3, .3, (blendUV * Rot(radians(layerRot1))).x));
  vec3 layer2 = mix(c3, c1, S(-.3, .3, (blendUV * Rot(radians(layerRot2))).x));
  vec3 col = mix(layer1, layer2, S(.3, -.3, blendUV.y));
  col = mix(col, col * col + .5 * sqrt(col), .3);
  fragColor = vec4(col, 1.); }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    let prog;
    try { prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); } catch (e) { console.warn('[zestia] shader', e); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'u_resolution'), uTime = gl.getUniformLocation(prog, 'u_time');
    gl.uniform4fv(gl.getUniformLocation(prog, 'u_colors[0]'), [...COL.flatMap((c) => [c[0] / 255, c[1] / 255, c[2] / 255, 1]), 0, 0, 0, 1]);
    gl.uniform1i(gl.getUniformLocation(prog, 'u_colors_length'), 3);
    const size = () => { const s = Math.min(devicePixelRatio, 1) * 0.5; cv.width = Math.max(1, cv.clientWidth * s | 0); cv.height = Math.max(1, cv.clientHeight * s | 0); gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(uRes, cv.width, cv.height); };
    size(); addEventListener('resize', size);
    let visible = true; new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(cv);
    const t0 = performance.now();
    const frame = (now) => { if (visible) { gl.uniform1f(uTime, reduce ? 0 : (now - t0) / 1000); gl.drawArrays(gl.TRIANGLES, 0, 3); } if (!reduce) requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
  }
  shader($('#shader'), [[255, 255, 255], [150, 112, 180], [217, 191, 234]]);            // hero
  shader($('#foot-shader'), [[217, 191, 234], [236, 226, 244], [255, 255, 255]]);       // footer

  if (!window.gsap || reduce) { document.documentElement.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  const E_IN = CustomEase.create('zIn', 'M0,0 C0.12,0.23 0.5,1 1,1');       // Framer appear [.12,.23,.5,1]
  const E_LOOP = CustomEase.create('zLoop', 'M0,0 C0.44,0 0.56,1 1,1');    // loop [.44,0,.56,1]
  const E_CARD = CustomEase.create('zCard', 'M0,0 C0.35,0 0,1 1,1');       // scroll appear [.35,0,0,1]

  /* ---------- nav fade-in (spring, 2s, no bounce) ---------- */
  gsap.from('#nav', { opacity: 0, duration: 2, ease: 'power3.out' });

  /* ---------- hero: Fix Content ---------- */
  // load appear: BG from y -100 (delay .7), product from y -100 rotate -15 (delay .2), 1s each
  gsap.from('#splash-in', { y: -100, opacity: 0, duration: 1, delay: 0.7, ease: E_IN });
  gsap.from('#product-app', { y: -100, rotation: -15, opacity: 0, duration: 1, delay: 0.2, ease: E_IN });
  // loop: rotate 0 ↔ -5, y 0 ↔ -15, 4s mirror
  gsap.to('#product-in', { rotation: -5, y: -15, duration: 4, ease: E_LOOP, yoyo: true, repeat: -1 });
  // scroll targets: start → Section 1 (BG opacity 0, product rotate -3) → Section 2 (product scale .8, opacity 0)
  const s1 = $('#clouds'), s2 = $('#moments');
  const pA = () => s1.offsetTop - innerHeight * 0.34;   // splash gone (measured: scrollY 600 @911)
  const pA2 = () => s1.offsetTop - innerHeight * 0.2;   // product: rotate -3 done (measured ~729)
  const pB = () => s2.offsetTop + innerHeight * 1.3;    // product: scale .8, opacity 0 (measured ~2690)
  gsap.to('#splash', { opacity: 0, ease: 'none', scrollTrigger: { start: 0, end: pA, scrub: 0.4, invalidateOnRefresh: true } });
  gsap.to('#product', { rotation: -3, ease: 'none', scrollTrigger: { start: 0, end: pA2, scrub: 0.4, invalidateOnRefresh: true } });
  gsap.fromTo('#product', { scale: 1, opacity: 1 }, { rotation: 0, scale: 0.8, opacity: 0, ease: 'none', immediateRender: false,
    scrollTrigger: { start: pA2, end: pB, scrub: 0.4, invalidateOnRefresh: true } });

  /* ---------- Section 1 clouds: appear from x, then parallax (Framer speed %) ---------- */
  $$('.cloud').forEach((c) => {
    gsap.from(c, { x: +c.dataset.from, opacity: 0, duration: 0.8, delay: +c.dataset.delay, ease: E_IN });
    const k = (+c.dataset.speed - 100) / 100; // measured: speed 105 → -5px per 100px scrolled, 120 → -20px
    gsap.to(c, { y: () => -k * innerHeight * 3, ease: 'none', scrollTrigger: { start: 0, end: () => innerHeight * 3, scrub: true, invalidateOnRefresh: true } });
  });

  /* ---------- appear (opacity 0, y 30 → in; .6s, delay .2) ---------- */
  ScrollTrigger.batch('[data-appear]', {
    start: 'top bottom', once: true,
    onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: E_CARD, overwrite: true }),
  });

  /* ---------- stacked cards: wrapper rotated +-3deg, scale 1.05 -> 1 triggered (spring, slight overshoot) ---------- */
  const desk = matchMedia('(min-width: 810px)');
  $$('.stack').forEach((c) => {
    gsap.set(c, { rotation: +c.dataset.rot, scale: desk.matches ? 1.05 : 1 });
    if (!desk.matches) return;
    const tw = gsap.to(c, { scale: 1, duration: 0.8, ease: 'back.out(1.6)', paused: true });
    ScrollTrigger.create({ trigger: c, start: 'top 65%', onEnter: () => tw.play(), onLeaveBack: () => tw.reverse() });
  });

  /* ---------- testimonial card: scale 1.05 -> 1 scrubbed (measured: starts at top = vh, done at top = vh/2) ---------- */
  if (desk.matches) gsap.fromTo('#reviews .card', { scale: 1.05 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#reviews .card', start: 'top bottom', end: 'top 50%', scrub: true } });

  /* ---------- count-ups (spring 2s) ---------- */
  $$('[data-count]').forEach((el) => {
    const o = { v: 0 }, end = +el.dataset.count; el.textContent = '0';
    gsap.to(o, { v: end, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top bottom', once: true }, onUpdate: () => (el.textContent = Math.round(o.v)) });
  });

  /* ---------- footer (Framer: Main appear y24 .6s [.22,1,.36,1] @15%; Image appear op.2/y157 → 1/0 spring, loop rotate -5 / y -15) ---------- */
  const E_FOOT = CustomEase.create('zFoot', 'M0,0 C0.22,1 0.36,1 1,1');
  gsap.fromTo('#foot-main', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: E_FOOT, scrollTrigger: { trigger: '#footer', start: 'top 85%', toggleActions: 'play none none reverse' } });
  gsap.fromTo('#foot-img', { y: 157, opacity: 0.2 }, { y: 0, opacity: 1, duration: 1.4, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: '#footer', start: 'top bottom', toggleActions: 'play none none reverse' } });
  gsap.to('#foot-img-in', { rotation: -5, y: -15, duration: 4, ease: E_LOOP, yoyo: true, repeat: -1 });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
