const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

// header bg on scroll
const hdr = document.getElementById('hdr');
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 40), { passive: true });

// burger
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => navLinks.classList.toggle('show'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('show')));
}

// split text (hero headline) -> words rise with stagger
document.querySelectorAll('[data-split]').forEach(el => {
  const words = el.textContent.trim().split(' ');
  el.innerHTML = words.map((w, i) =>
    `<span class="word"><i style="animation-delay:${0.15 + i * 0.09}s">${w}</i></span>`
  ).join(' ');
});

// scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .14 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// hero parallax
const heroBg = document.querySelector('.hero-bg');
if (heroBg && !reduce) addEventListener('scroll', () => {
  const y = scrollY; if (y < 1000) heroBg.style.transform = `translateY(${y * 0.3}px)`;
}, { passive: true });

// magnetic buttons
if (!reduce && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.32}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
}

// custom cursor
if (!reduce && matchMedia('(pointer:fine)').matches) {
  const dot = document.createElement('div'); dot.className = 'cursor';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  const hoverSel = 'a, button, .cell, .hslide, .serv-card, input';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) ring.classList.remove('hover');
  });
}

// horizontal drag scroll (interior)
document.querySelectorAll('.hscroll').forEach(track => {
  let down = false, startX, sl;
  track.addEventListener('pointerdown', e => { down = true; track.classList.add('drag'); startX = e.clientX; sl = track.scrollLeft; });
  addEventListener('pointerup', () => { down = false; track.classList.remove('drag'); });
  track.addEventListener('pointermove', e => { if (down) track.scrollLeft = sl - (e.clientX - startX); });
  track.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { track.scrollLeft += e.deltaY; e.preventDefault(); }
  }, { passive: false });
});

// auto-rotating works box (medium pace)
document.querySelectorAll('[data-rotate]').forEach(box => {
  const imgs = [...box.querySelectorAll('img')];
  if (imgs.length < 2 || reduce) return;
  let i = 0;
  setInterval(() => {
    imgs[i].classList.remove('active');
    i = (i + 1) % imgs.length;
    imgs[i].classList.add('active');
  }, 2800);
});

// lightbox with prev/next — supports multiple galleries (rotator + main grid)
const lb = document.getElementById('lb');
if (lb) {
  const lbImg = lb.querySelector('img');
  let group = [], idx = 0;
  const show = i => { idx = (i + group.length) % group.length; lbImg.src = group[idx].src; };
  const open = (imgs, start) => { group = imgs; show(start); lb.classList.add('open'); };
  document.querySelectorAll('[data-gallery]').forEach(g => {
    const imgs = [...g.querySelectorAll('img')];
    g.addEventListener('click', e => {
      const clicked = e.target.closest('img');
      let start = 0;
      if (clicked && imgs.includes(clicked)) start = imgs.indexOf(clicked);
      else { const a = g.querySelector('img.active'); if (a) start = imgs.indexOf(a); }
      open(imgs, start);
    });
  });
  lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
  lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
  lb.querySelector('.lb-close').addEventListener('click', () => lb.classList.remove('open'));
  lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
}
