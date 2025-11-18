const toggle = document.querySelector('.menu-toggle'); 
  const menu = document.querySelector('nav');

  // Abrir o cerrar menú con el botón ☰
  toggle.addEventListener('click', () => {
    menu.classList.toggle('show');
    toggle.classList.toggle('active'); // <- Esto activa la animación de la X
    document.body.classList.toggle('menu-abierto');

    // Guardamos en el historial para poder retroceder
    if (menu.classList.contains('show')) {
      history.pushState({ menuOpen: true }, '', '');
    }
  });

  // Cerrar menú al hacer clic fuera del nav (solo si está abierto)
  document.addEventListener('click', (e) => {
    if (
      menu.classList.contains('show') &&
      !menu.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      menu.classList.remove('show');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
      history.back(); // para "limpiar" el pushState anterior
    }
  });

  // Cerrar menú si se presiona el botón de retroceso del navegador
  window.addEventListener('popstate', (e) => {
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
    }
  });
//Contraer scroll
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});

// Scroll to top functionality
const scrollToHomeBtn = document.querySelector('.scrollToHome');
if (scrollToHomeBtn) {
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      scrollToHomeBtn.style.display = 'block';
      scrollToHomeBtn.style.opacity = '1';
    } else {
      scrollToHomeBtn.style.opacity = '0';
      setTimeout(() => {
        if (window.scrollY <= 100) {
          scrollToHomeBtn.style.display = 'none';
        }
      }, 300);
    }
  });

  scrollToHomeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    return false;
  });
}

// Acordeón de FAQ
const faqButtons = document.querySelectorAll('.faq-item');
faqButtons.forEach(btn => {
  // Si no es un botón o enlace, añade rol y tabIndex
  if (!['BUTTON','A'].includes(btn.tagName)) {
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
  }

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const panel = btn.nextElementSibling;
    btn.setAttribute('aria-expanded', String(!expanded));
    panel.style.maxHeight = !expanded ? panel.scrollHeight + 'px' : '0';
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// Revelado al hacer scroll
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// Brillo secuencial en "Proceso de trabajo"
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

  // Inicia cuando el bloque es visible en el viewport
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) start();
      else stop();
    });
  }, { threshold: 0.2 });

  io.observe(stepsContainer);

  // Limpieza
  window.addEventListener('beforeunload', stop);
})();
