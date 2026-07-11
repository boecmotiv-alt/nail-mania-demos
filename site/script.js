// header background on scroll
const hdr = document.getElementById('hdr');
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 40), { passive: true });

// burger menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => navLinks.classList.toggle('show'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('show')));
}

// reveal on scroll
const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .14 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// lightbox for galleries
const lb = document.getElementById('lb');
const lbImg = document.getElementById('lbImg');
if (lb) {
  document.querySelectorAll('[data-lightbox]').forEach(grid => {
    grid.addEventListener('click', e => {
      const img = e.target.closest('img');
      if (!img) return;
      lbImg.src = img.src;
      lb.classList.add('open');
    });
  });
  const gallery = document.getElementById('gallery');
  if (gallery && !gallery.hasAttribute('data-lightbox')) {
    gallery.addEventListener('click', e => {
      const img = e.target.closest('img');
      if (!img) return;
      lbImg.src = img.src;
      lb.classList.add('open');
    });
  }
  lb.addEventListener('click', () => lb.classList.remove('open'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
}
