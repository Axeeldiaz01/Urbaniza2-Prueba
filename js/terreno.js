document.addEventListener('DOMContentLoaded', function () {

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('nav');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('show');
      toggle.classList.toggle('active');
      document.body.classList.toggle('menu-abierto');

      if (menu.classList.contains('show')) {
        history.pushState({ menuOpen: true }, '', '');
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (
      menu && menu.classList.contains('show') &&
      !menu.contains(e.target) &&
      toggle && !toggle.contains(e.target)
    ) {
      menu.classList.remove('show');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
      history.back();
    }
  });

  window.addEventListener('popstate', () => {
    if (menu && menu.classList.contains('show')) {
      menu.classList.remove('show');
      toggle && toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
    }
  });

  /* ============================= */
  /* BUSCADOR CORREGIDO */
  /* ============================= */

  function realizarBusqueda() {

    const tipoElement = document.getElementById('tipo-inmueble');
    const textoElement = document.getElementById('texto-busqueda');

    if (!tipoElement || !textoElement) return;

    const tipo = tipoElement.value.toLowerCase();
    const texto = textoElement.value.toLowerCase().trim();

    let totalVisible = 0;
    let firstVisible = null;

    // BUSCAR TODAS LAS TARJETAS
    const cards = document.querySelectorAll('.card, .cardd');

    cards.forEach(card => {

      const cardTipo =
        (card.getAttribute('data-tipo') || '').toLowerCase();

      const cardUbicacion =
        (card.getAttribute('data-ubicacion') || '').toLowerCase();

      let visible = true;

      /* FILTRO POR TIPO */

      if (tipo && cardTipo !== tipo) {
        visible = false;
      }

      /* FILTRO POR TEXTO */

      if (texto) {

        const palabras = texto.split(" ");

        const titulo =
          card.querySelector("h2")?.textContent.toLowerCase() ||
          card.querySelector("h3")?.textContent.toLowerCase() ||
          "";

        const coincide = palabras.some(palabra =>
          cardUbicacion.includes(palabra) ||
          titulo.includes(palabra)
        );

        if (!coincide) {
          visible = false;
        }
      }

      /* MOSTRAR / OCULTAR */

      if (visible) {

        card.style.display = '';

        /* MOSTRAR TAMBIÉN LA SECTION SI EXISTE */
        const section = card.closest('.section');
        if (section) {
          section.style.display = '';
        }

        totalVisible++;

        if (!firstVisible) {
          firstVisible = card;
        }

      } else {

        card.style.display = 'none';

        /* OCULTAR TAMBIÉN LA SECTION */
        const section = card.closest('.section');
        if (section) {
          section.style.display = 'none';
        }

      }

    });

    mostrarResultadosBusqueda(totalVisible);

    if (firstVisible) {
      firstVisible.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }

  }


  function mostrarResultadosBusqueda(total) {

    const mensajeAnterior =
      document.querySelector('.mensaje-busqueda');

    if (mensajeAnterior) {
      mensajeAnterior.remove();
    }

    const galeria =
      document.querySelector('.terrenos-wrapper');

    if (galeria && total === 0) {

      const mensaje = document.createElement('div');

      mensaje.className = 'mensaje-busqueda';

      mensaje.innerHTML = `
        <div class="search-no-results" style="
          text-align:center;
          margin-top:20px;
          width:100%;
        ">
          <h3>No se encontraron terrenos</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      `;

      galeria.appendChild(mensaje);

    }

  }

  const formBuscador =
    document.getElementById('form-buscador');

  if (formBuscador) {

    formBuscador.addEventListener('submit', function (e) {

      e.preventDefault();

      realizarBusqueda();

    });

  }

  const inputBusqueda =
    document.getElementById('texto-busqueda');

  if (inputBusqueda) {

    let timeoutBusqueda;

    inputBusqueda.addEventListener('input', function () {

      clearTimeout(timeoutBusqueda);

      timeoutBusqueda = setTimeout(() => {

        if (
          this.value.length >= 2 ||
          this.value.length === 0
        ) {
          realizarBusqueda();
        }

      }, 500);

    });

  }
  document.querySelectorAll(".carrusel-chorrillos").forEach((carrusel) => {
  const slides = carrusel.querySelectorAll(".carrusel-slide");
  const indicadores = carrusel.querySelectorAll(".indicador");

  let index = 0;
  let intervalo;

  function mostrarSlide(i) {
    slides.forEach((slide) => slide.classList.remove("active"));
    indicadores.forEach((ind) => ind.classList.remove("active"));

    slides[i].classList.add("active");
    indicadores[i].classList.add("active");

    index = i;
  }

  function siguienteSlide() {
    index++;

    if (index >= slides.length) {
      index = 0;
    }

    mostrarSlide(index);
  }

  function iniciarCarrusel() {
    intervalo = setInterval(siguienteSlide, 3000);
  }

  function reiniciarCarrusel() {
    clearInterval(intervalo);
    iniciarCarrusel();
  }

  /* CLICK EN INDICADORES */

  indicadores.forEach((indicador, i) => {
    indicador.addEventListener("click", () => {
      mostrarSlide(i);
      reiniciarCarrusel();
    });
  });

  iniciarCarrusel();
});


});

