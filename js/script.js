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

// Navegación suave entre secciones
document.addEventListener('DOMContentLoaded', function() {
  const navButtons = document.querySelectorAll('.nav-btn');
  
  navButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Ajuste para header fijo
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Agregar efecto visual al botón clickeado
        navButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Remover la clase active después de un tiempo
        setTimeout(() => {
          this.classList.remove('active');
        }, 1000);
      }
    });
  });
  
  // Resaltar botón activo basado en la sección visible
  function updateActiveNavButton() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navButtons.forEach(btn => btn.classList.remove('current'));
        const activeBtn = document.querySelector(`.nav-btn[href="#${sectionId}"]`);
        if (activeBtn) {
          activeBtn.classList.add('current');
        }
      }
    });
  }
  
  // Actualizar botón activo al hacer scroll
  window.addEventListener('scroll', updateActiveNavButton);
  updateActiveNavButton(); // Ejecutar al cargar la página
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
  // Cambiar Imagen (solo si existen elementos)
let imagenes = document.querySelectorAll(".slider-img");
let index = 0;

if (imagenes.length > 0) {
  function cambiarImagen() {
    imagenes.forEach((img, i) => {
      if (img && img.classList) {
        img.classList.remove("active");
      }
    });
    index = (index + 1) % imagenes.length;
    if (imagenes[index] && imagenes[index].classList) {
      imagenes[index].classList.add("active");
    }
  }
  setInterval(cambiarImagen, 4000); // cada 4 segundos cambia
}

//Contraer scroll
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});

/*carrusel */
document.addEventListener("DOMContentLoaded", function () {
  let indice = 0;
  const carruselSlides = document.querySelectorAll('.carrusel-terrenos .slide');
  const total = carruselSlides.length;
  const carrusel = document.querySelector('.carrusel-imagenes');

  if (carrusel && carruselSlides.length > 0) {
    function mostrarSlide(index) {
      if (index < 0) indice = total - 1;
      else if (index >= total) indice = 0;
      else indice = index;

      carrusel.style.transform = `translateX(-${indice * 100}%)`;
    }

    const anteriorBtn = document.querySelector('.anterior');
    const siguienteBtn = document.querySelector('.siguiente');

    if (anteriorBtn) {
      anteriorBtn.addEventListener('click', () => {
        mostrarSlide(indice - 1);
      });
    }

    if (siguienteBtn) {
      siguienteBtn.addEventListener('click', () => {
        mostrarSlide(indice + 1);
      });
    }

    mostrarSlide(indice); // Mostrar el primer slide
  }
});

//formulario
const abrirFormulario = document.getElementById('abrir-formulario');
const cerrarModalBtn = document.getElementById('cerrar-modal');
const modalContacto = document.getElementById('modal-contacto');

if (abrirFormulario && modalContacto) {
  abrirFormulario.onclick = function() {
    modalContacto.classList.remove('oculto');
  };
}

if (cerrarModalBtn && modalContacto) {
  cerrarModalBtn.onclick = function() {
    modalContacto.classList.add('oculto');
  };
}

if (modalContacto) {
  modalContacto.onclick = function(e) {
    if (e.target === this) this.classList.add('oculto');
  };
}

// Hero Slider
document.addEventListener('DOMContentLoaded', function() {
  const heroSlider = document.querySelector('.hero-slider');
  
  if (heroSlider) {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const indicators = document.querySelectorAll('.hero-slider .indicator');
    const prevBtn = document.querySelector('.hero-slider .prev-btn');
    const nextBtn = document.querySelector('.hero-slider .next-btn');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    if (slides.length > 0) {
      // Función para mostrar slide específico
      function showSlide(index) {
        // Validar que el índice esté en rango
        if (index < 0 || index >= totalSlides) return;
        
        // Remover clase active de todos los slides e indicadores
        slides.forEach(slide => {
          if (slide && slide.classList) {
            slide.classList.remove('active');
          }
        });
        
        indicators.forEach(indicator => {
          if (indicator && indicator.classList) {
            indicator.classList.remove('active');
          }
        });
        
        // Agregar clase active al slide e indicador actual
        if (slides[index] && slides[index].classList) {
          slides[index].classList.add('active');
        }
        
        if (indicators[index] && indicators[index].classList) {
          indicators[index].classList.add('active');
        }
        
        currentSlide = index;
      }
      
      // Función para ir al siguiente slide
      function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
      }
      
      // Función para ir al slide anterior
      function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
      }
      

      
      // Auto-play del slider - cambio automático continuo
      let autoPlayInterval = setInterval(nextSlide, 3000); // Cambia cada 3 segundos
      
      // Reiniciar el intervalo cuando el usuario interactúa manualmente
      function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 3000);
      }
      
      // Reiniciar auto-play cuando se hace clic en botones o indicadores
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          resetAutoPlay();
        });
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          resetAutoPlay();
        });
      }
      
      // Reiniciar auto-play cuando se hace clic en indicadores
      indicators.forEach((indicator, index) => {
        if (indicator) {
          indicator.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
          });
        }
      });
      
      // Mostrar el primer slide al cargar
      showSlide(0);
    }
  }
});



