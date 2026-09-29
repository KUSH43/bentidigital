document.documentElement.classList.add('js');
// Menu mobile
const nav = document.querySelector('.nav');
const burger = document.querySelector('.nav__burger');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
document.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', false);
}));

// Vidéos : chargement et lecture seulement quand elles sont visibles
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const videos = document.querySelectorAll('video[data-src]');
const load = v => { if (!v.src) { v.src = v.dataset.src; } };
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        load(v);
        if (!reduce) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0.15 });
  videos.forEach(v => io.observe(v));
} else {
  videos.forEach(v => { load(v); v.autoplay = true; });
}

document.getElementById('year').textContent = new Date().getFullYear();

// Boîte à outils : apparition gauche → droite / droite → gauche
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const ro = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); }
  }), { threshold: 0.25 });
  reveals.forEach(r => ro.observe(r));
} else {
  reveals.forEach(r => r.classList.add('is-in'));
}

// Son : un seul téléphone avec le son à la fois
const soundBtns = document.querySelectorAll('.sound');
soundBtns.forEach(btn => btn.addEventListener('click', e => {
  e.preventDefault(); e.stopPropagation();
  const v = btn.parentElement.querySelector('video');
  const turnOn = v.muted;
  soundBtns.forEach(b => {
    const o = b.parentElement.querySelector('video');
    o.muted = true; b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', 'Activer le son');
  });
  if (turnOn) {
    load(v); v.muted = false; v.play().catch(() => {});
    btn.setAttribute('aria-pressed', 'true'); btn.setAttribute('aria-label', 'Couper le son');
  }
}));

// Pois des services : on n'affiche que des pois entiers, jamais coupés par le titre ou les cartes
(function(){
  const sec=document.querySelector('.services'); const svg=sec&&sec.querySelector('.services__dots');
  if(!svg) return;
  function draw(){
    const small=window.innerWidth<=520, step=small?54:70, r=small?6:7.5;
    const starts=small?[[35,35],[8,8]]:[[45,45],[10,10]];
    const R=sec.getBoundingClientRect(), W=R.width, H=R.height, gap=r+3;
    const blocks=[...sec.querySelectorAll('.services__head, .card')].map(e=>{const b=e.getBoundingClientRect();return [b.left-R.left-gap,b.top-R.top-gap,b.right-R.left+gap,b.bottom-R.top+gap]});
    let out='';
    for(const [sx,sy] of starts){
      for(let y=sy;y<H+r;y+=step) for(let x=sx;x<W+r;x+=step){
        if(blocks.some(b=>x>b[0]&&x<b[2]&&y>b[1]&&y<b[3])) continue;
        out+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'"/>';
      }
    }
    svg.setAttribute('viewBox','0 0 '+W+' '+H);
    svg.innerHTML='<g fill="currentColor">'+out+'</g>';
    sec.classList.add('has-dots');
  }
  draw(); addEventListener('resize',()=>{clearTimeout(draw.t);draw.t=setTimeout(draw,120)});
  if(document.fonts) document.fonts.ready.then(draw);
  addEventListener('load',draw);
})();
