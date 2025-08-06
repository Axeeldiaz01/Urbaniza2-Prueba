document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.menu-toggle'); 
  const menu = document.querySelector('nav');

  // Abrir o cerrar menú con el botón ☰
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('show');
      toggle.classList.toggle('active'); // <- Esto activa la animación de la X
      document.body.classList.toggle('menu-abierto');

      // Guardamos en el historial para poder retroceder
      if (menu.classList.contains('show')) {
        history.pushState({ menuOpen: true }, '', '');
      }
    });
  }

  // Cerrar menú al hacer clic fuera del nav (solo si está abierto)
  document.addEventListener('click', (e) => {
    if (
      menu && menu.classList.contains('show') &&
      !menu.contains(e.target) &&
      toggle && !toggle.contains(e.target)
    ) {
      menu.classList.remove('show');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
      history.back(); // para "limpiar" el pushState anterior
    }
  });

  // Cerrar menú si se presiona el botón de retroceso del navegador
  window.addEventListener('popstate', (e) => {
    if (menu && menu.classList.contains('show')) {
      menu.classList.remove('show');
      toggle && toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
    }
  });

  // Ampliar imagen al hacer click
  window.ampliarImagen = function(img) {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("img-ampliada");
    const captionText = document.getElementById("caption");

    if (modal && modalImg && captionText) {
      modal.style.display = "block";
      modalImg.src = img.src;
      captionText.textContent = img.alt;
    }
  }

  // Cerrar modal al hacer click en la "x"
  const cerrarBtn = document.querySelector(".cerrar");
  if (cerrarBtn) {
    cerrarBtn.onclick = function () {
      const modal = document.getElementById("modal");
      if (modal) {
        modal.style.display = "none";
      }
    };
  }

  // Reducir header al hacer scroll
  window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    }
  });

  /*funconalidad de buscardor*/
  const formBuscador = document.getElementById('form-buscador');
  if (formBuscador) {
    formBuscador.addEventListener('submit', function(e) {
      e.preventDefault();

      const tipoElement = document.getElementById('tipo-inmueble');
      const textoElement = document.getElementById('texto-busqueda');
      const monedaElement = document.getElementById('moneda');
      const desdeElement = document.getElementById('precio-desde');
      const hastaElement = document.getElementById('precio-hasta');
      const retirarPrecioElement = document.getElementById('retirar-precio');

      if (!tipoElement || !textoElement || !monedaElement || !desdeElement || !hastaElement || !retirarPrecioElement) {
        return;
      }

      const tipo = tipoElement.value.toLowerCase();
      const texto = textoElement.value.toLowerCase();
      const moneda = monedaElement.value;
      const desde = parseFloat(desdeElement.value) || 0;
      const hasta = parseFloat(hastaElement.value) || Infinity;
      const retirarPrecio = retirarPrecioElement.checked;

      let firstVisible = null;

      document.querySelectorAll('.galeria .card').forEach(card => {
        const cardTipo = (card.getAttribute('data-tipo') || '').toLowerCase();
        const cardUbicacion = (card.getAttribute('data-ubicacion') || '').toLowerCase();
        const cardPrecio = parseFloat(card.getAttribute('data-precio')) || 0;
        const cardMoneda = card.getAttribute('data-moneda') || '';

        let visible = true;

        if (tipo && cardTipo !== tipo) visible = false;
        if (texto && !cardUbicacion.includes(texto)) visible = false;
        if (!retirarPrecio && cardMoneda === moneda) {
          if (cardPrecio < desde || cardPrecio > hasta) visible = false;
        }

        card.style.display = visible ? '' : 'none';

        if (visible && !firstVisible) {
          firstVisible = card;
        }
        // Quitar resaltado anterior
        card.classList.remove('resaltado-busqueda');
      });

      // Hacer scroll y resaltar la primera tarjeta visible
      if (firstVisible) {
        firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstVisible.classList.add('resaltado-busqueda');
        setTimeout(() => {
          firstVisible.classList.remove('resaltado-busqueda');
        }, 2000);
      }
    });
  }

  // Funcionalidad del carrusel de Chorrillos
  let slideActualIndex = 0;
  const slides = document.querySelectorAll('.carrusel-slide');
  const indicadores = document.querySelectorAll('.indicador');

  function mostrarSlide(index) {
    // Ocultar todos los slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicadores.forEach(indicador => indicador.classList.remove('active'));
    
    // Mostrar el slide actual
    if (slides[index]) {
      slides[index].classList.add('active');
      if (indicadores[index]) {
        indicadores[index].classList.add('active');
      }
    }
  }

  window.cambiarSlide = function(direccion) {
    slideActualIndex += direccion;
    
    if (slideActualIndex >= slides.length) {
      slideActualIndex = 0;
    } else if (slideActualIndex < 0) {
      slideActualIndex = slides.length - 1;
    }
    
    mostrarSlide(slideActualIndex);
  }

  window.slideActual = function(index) {
    slideActualIndex = index - 1;
    mostrarSlide(slideActualIndex);
  }

  // Auto-play del carrusel (solo si hay slides)
  if (slides.length > 0) {
    setInterval(() => {
      window.cambiarSlide(1);
    }, 5000); // Cambia cada 5 segundos
  }

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
});