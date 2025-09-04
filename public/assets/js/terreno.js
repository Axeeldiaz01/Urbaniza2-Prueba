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
  };

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

  /*funcionalidad de buscador*/
  // Función para realizar la búsqueda
  function realizarBusqueda() {
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
    const texto = textoElement.value.toLowerCase().trim();
    const moneda = monedaElement.value;
    const desde = parseFloat(desdeElement.value) || 0;
    const hasta = parseFloat(hastaElement.value) || Infinity;
    const retirarPrecio = retirarPrecioElement.checked;

    let firstVisible = null;
    let totalVisible = 0;

    document.querySelectorAll('.galeria .card').forEach(card => {
      const cardTipo = (card.getAttribute('data-tipo') || '').toLowerCase();
      const cardUbicacion = (card.getAttribute('data-ubicacion') || '').toLowerCase();
      const cardPrecio = parseFloat(card.getAttribute('data-precio')) || 0;
      const cardMoneda = card.getAttribute('data-moneda') || '';

      let visible = true;

      // Filtro por tipo
      if (tipo && cardTipo !== tipo) visible = false;
      
      // Filtro por texto (buscar en ubicación y nombre)
      if (texto && !cardUbicacion.includes(texto)) visible = false;
      
      // Filtro por precio
      if (!retirarPrecio && cardMoneda === moneda) {
        if (cardPrecio < desde || cardPrecio > hasta) visible = false;
      }

      card.style.display = visible ? '' : 'none';

      if (visible) {
        totalVisible++;
        if (!firstVisible) {
          firstVisible = card;
        }
      }
      
      // Quitar resaltado anterior
      card.classList.remove('resaltado-busqueda');
    });

    // Mostrar mensaje si no hay resultados
    mostrarResultadosBusqueda(totalVisible);

    // Hacer scroll a la primera tarjeta visible
    if (firstVisible) {
      firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Función para mostrar resultados de búsqueda
  function mostrarResultadosBusqueda(total) {
    // Remover mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-busqueda');
    if (mensajeAnterior) {
      mensajeAnterior.remove();
    }

    const galeria = document.querySelector('.galeria');
    if (galeria && total === 0) {
      const mensaje = document.createElement('div');
      mensaje.className = 'mensaje-busqueda';
      mensaje.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
          <h3>No se encontraron terrenos</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      `;
      galeria.appendChild(mensaje);
    }
  }

  const formBuscador = document.getElementById('form-buscador');
  if (formBuscador) {
    formBuscador.addEventListener('submit', function(e) {
      e.preventDefault();
      realizarBusqueda();
    });
  }

  // Escuchar cuando se cargan los terrenos dinámicos
  document.addEventListener('terrenosCargados', function() {
    console.log('Terrenos dinámicos cargados, buscador listo');
  });

  // Búsqueda en tiempo real (opcional)
  const inputBusqueda = document.getElementById('texto-busqueda');
  if (inputBusqueda) {
    let timeoutBusqueda;
    inputBusqueda.addEventListener('input', function() {
      clearTimeout(timeoutBusqueda);
      timeoutBusqueda = setTimeout(() => {
        if (this.value.length >= 2 || this.value.length === 0) {
          realizarBusqueda();
        }
      }, 500);
    });
  }

  // Funcionalidad del carrusel - Soporte para múltiples carruseles
  const carruseles = document.querySelectorAll('.carrusel-chorrillos');
  
  carruseles.forEach((carrusel, carruselIndex) => {
    let slideActualIndex = 0;
    const slides = carrusel.querySelectorAll('.carrusel-slide');
    const indicadores = carrusel.querySelectorAll('.indicador');

    function mostrarSlide(index) {
      // Ocultar todos los slides de este carrusel
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

    // Función para cambiar slide específica de este carrusel
    function cambiarSlide(direccion) {
      slideActualIndex += direccion;
      
      if (slideActualIndex >= slides.length) {
        slideActualIndex = 0;
      } else if (slideActualIndex < 0) {
        slideActualIndex = slides.length - 1;
      }
      
      mostrarSlide(slideActualIndex);
    }

    // Agregar event listeners a los indicadores de este carrusel
    indicadores.forEach((indicador, index) => {
      indicador.addEventListener('click', () => {
        slideActualIndex = index;
        mostrarSlide(slideActualIndex);
      });
    });

    // Auto-play del carrusel (solo si hay slides)
    if (slides.length > 0) {
      setInterval(() => {
        cambiarSlide(1);
      }, 5000); // Cambia cada 5 segundos
    }
  });

  // Función global para compatibilidad con onclick en HTML
  window.slideActual = function(index) {
    // Esta función ahora es manejada por los event listeners individuales
    console.log('slideActual llamada con index:', index);
  };

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