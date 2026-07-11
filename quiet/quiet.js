const hdr=document.getElementById('hdr');
if(hdr)addEventListener('scroll',()=>hdr.classList.toggle('s',scrollY>40),{passive:true});
const bg=document.getElementById('bg');
if(bg)bg.addEventListener('click',()=>document.getElementById('nl').classList.toggle('show'));
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const lb=document.getElementById('lb');
if(lb){const li=lb.querySelector('img');const g=document.querySelector('[data-gal]');
  if(g)g.addEventListener('click',e=>{const i=e.target.closest('img');if(i){li.src=i.src;lb.classList.add('open')}});
  lb.addEventListener('click',()=>lb.classList.remove('open'));
  addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open')});}
