// =============================
// MENU RESPONSIVE
// =============================
const toggle = document.querySelector('.menu-toggle'); 
const menu = document.querySelector('nav');

// Abrir o cerrar menú
toggle.addEventListener('click', () => {
  menu.classList.toggle('show');
  toggle.classList.toggle('active');
  document.body.classList.toggle('menu-abierto');

  if (menu.classList.contains('show')) {
    history.pushState({ menuOpen: true }, '', '');
  }
});

// Cerrar menú si se hace clic fuera
document.addEventListener('click', (e) => {
  if (
    menu.classList.contains('show') &&
    !menu.contains(e.target) &&
    !toggle.contains(e.target)
  ) {
    menu.classList.remove('show');
    toggle.classList.remove('active');
    document.body.classList.remove('menu-abierto');
    history.back();
  }
});

// Cerrar menú con botón atrás del navegador
window.addEventListener('popstate', () => {
  if (menu.classList.contains('show')) {
    menu.classList.remove('show');
    toggle.classList.remove('active');
    document.body.classList.remove('menu-abierto');
  }
});


// =============================
// HEADER QUE SE CONTRAE AL SCROLL
// =============================
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});


// =============================
// FAQ ACORDEON
// =============================
document.addEventListener("DOMContentLoaded", () => {

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      item.classList.toggle("active");

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
        }
      });
    });
  });

});


// =============================
// ANIMACIONES AL HACER SCROLL
// =============================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }

  });

}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));


// =============================
// BRILLO SECUENCIAL EN PROCESO
// =============================
(() => {

  const stepsContainer = document.querySelector('.process-steps');
  if (!stepsContainer) return;

  const steps = Array.from(stepsContainer.querySelectorAll('li'));
  if (!steps.length) return;

  let index = -1;
  let timer = null;

  const tick = () => {
    index = (index + 1) % steps.length;
    steps.forEach((li, i) => li.classList.toggle('highlight', i === index));
  };

  const start = () => {
    if (timer) return;
    tick();
    timer = setInterval(tick, 1800);
  };

  const stop = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    steps.forEach(li => li.classList.remove('highlight'));
  };

  const io = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) start();
      else stop();

    });

  }, { threshold: 0.2 });

  io.observe(stepsContainer);

  window.addEventListener('beforeunload', stop);

})();

