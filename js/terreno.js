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
/*
  window.ampliarImagen = function(img) {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("img-ampliada");
    const captionText = document.getElementById("caption");

    if (modal && modalImg && captionText) {
      modal.classList.add('modal-visible');
      modalImg.src = img.src;
      captionText.textContent = img.alt;
    }
  };
*/

  // Cerrar modal al hacer click en la "x"
  const cerrarBtn = document.querySelector(".cerrar");
  if (cerrarBtn) {
    cerrarBtn.onclick = function () {
      const modal = document.getElementById("modal");
      if (modal) {
        modal.classList.remove('modal-visible');
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
        <div class="search-no-results">
          <i class="fas fa-search search-icon"></i>
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
      // Clampear índice para evitar estados inválidos
      if (index < 0 || index >= slides.length) {
        index = 0;
      }
      // Activar primero el slide objetivo para evitar un frame en blanco
      if (slides[index]) {
        slides[index].classList.add('active');
      }

      // Desactivar el resto de slides
      slides.forEach((slide, i) => {
        if (i !== index) slide.classList.remove('active');
      });

      // Actualizar indicadores
      indicadores.forEach((indicador, i) => {
        if (i === index) {
          indicador.classList.add('active');
        } else {
          indicador.classList.remove('active');
        }
      });
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
        if (index >= 0 && index < slides.length) {
          slideActualIndex = index;
          mostrarSlide(slideActualIndex);
        }
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

  // Funcionalidades de compra
  function initializeComprarButtons() {
    const botonesComprar = document.querySelectorAll('.btn-comprar');
    
    botonesComprar.forEach(boton => {
      // Evitar adjuntar múltiples listeners al mismo botón
      if (boton.dataset.compraInit) return;
      
      boton.addEventListener('click', function() {
        const precio = this.getAttribute('data-precio');
        const ubicacion = this.getAttribute('data-ubicacion');
        const area = this.getAttribute('data-area');
        
        mostrarModalCompra(precio, ubicacion, area);
      });
      
      boton.dataset.compraInit = 'terreno';
    });
  }

  function mostrarModalCompra(precio, ubicacion, area) {
    const precioFormateado = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
    
    let areaFormateada;
    if (area >= 10000) {
      areaFormateada = (area / 10000).toFixed(1) + ' Hectáreas';
    } else {
      areaFormateada = area + ' m²';
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-compra';
    modal.innerHTML = `
      <div class="modal-compra-content">
        <div class="modal-compra-header">
          <h2>Solicitud de Compra</h2>
          <span class="close-compra">&times;</span>
        </div>
        <div class="modal-compra-body">
          <div class="terreno-seleccionado">
            <h3>Detalles del Terreno</h3>
            <div class="terreno-info">
              <p><strong>Ubicación:</strong> ${ubicacion}</p>
              <p><strong>Precio:</strong> ${precioFormateado}</p>
              <p><strong>Área:</strong> ${areaFormateada}</p>
            </div>
          </div>
          
          <div class="datos-contacto-titulo">
            <h3>Datos de Contacto</h3>
          </div>
          
          <div class="form-compra">
            <form id="form-compra">
              <div class="form-grid">
                <div class="form-group">
                  <label for="nombre">Nombre completo *</label>
                  <input type="text" id="nombre" name="nombre" placeholder="Ingrese su nombre completo" required>
                </div>
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" required>
                </div>
                <div class="form-group">
                  <label for="telefono">Teléfono *</label>
                  <input type="tel" id="telefono" name="telefono" placeholder="+51 9XX XXX XXX" required>
                </div>
                <div class="form-group">
                  <label for="tipo_pago">Tipo de pago preferido</label>
                  <select id="tipo_pago" name="tipo_pago">
                    <option value="">Seleccione una opción</option>
                    <option value="contado">Al contado</option>
                    <option value="financiado">Financiado</option>
                    <option value="consultar">Consultar opciones</option>
                  </select>
                </div>
                <div class="form-group full-width">
                  <label for="mensaje">Mensaje adicional</label>
                  <textarea id="mensaje" name="mensaje" rows="4" placeholder="Comentarios adicionales, consultas específicas..."></textarea>
                </div>
              </div>
            </form>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-cancelar" onclick="document.querySelector('.modal-compra').remove()">Cancelar</button>
            <button type="button" class="btn-enviar-compra" onclick="procesarSolicitudCompra('${precio}', '${ubicacion}', '${area}')">Enviar y Contactar por WhatsApp</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal
    modal.querySelector('.close-compra').addEventListener('click', function() {
      modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  function procesarSolicitudCompra(precio, ubicacion, area) {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const tipoPago = document.getElementById('tipo_pago').value;
    const mensaje = document.getElementById('mensaje').value;
    
    if (!nombre || !email || !telefono) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }
    
    const precioFormateado = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
    
    let areaFormateada;
    if (area >= 10000) {
      areaFormateada = (area / 10000).toFixed(1) + ' Hectáreas';
    } else {
      areaFormateada = area + ' m²';
    }
    
    let mensajeWhatsApp = `🏞️ *SOLICITUD DE COMPRA DE TERRENO*\n\n`;
    mensajeWhatsApp += `📍 *Ubicación:* ${ubicacion}\n`;
    mensajeWhatsApp += `💰 *Precio:* ${precioFormateado}\n`;
    mensajeWhatsApp += `📐 *Área:* ${areaFormateada}\n\n`;
    mensajeWhatsApp += `👤 *Datos del interesado:*\n`;
    mensajeWhatsApp += `• Nombre: ${nombre}\n`;
    mensajeWhatsApp += `• Email: ${email}\n`;
    mensajeWhatsApp += `• Teléfono: ${telefono}\n`;
    
    if (tipoPago) {
      mensajeWhatsApp += `• Tipo de pago: ${tipoPago}\n`;
    }
    
    if (mensaje) {
      mensajeWhatsApp += `\n💬 *Mensaje adicional:*\n${mensaje}\n`;
    }
    
    mensajeWhatsApp += `\n¡Gracias por su interés! 🙏`;
    
    const numeroWhatsApp = '51987654321';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;
    
    window.open(urlWhatsApp, '_blank');
    document.querySelector('.modal-compra').remove();
  }

  // Inicializar botones de compra
  initializeComprarButtons();
  
  // Reinicializar cuando se cargan terrenos dinámicos
  document.addEventListener('terrenosCargados', function() {
    initializeComprarButtons();
  });

  // Hacer funciones globales para compatibilidad
  window.iniciarCompra = function(precio, ubicacion, area) {
    mostrarModalCompra(precio, ubicacion, area);
  };
  
  window.procesarSolicitudCompra = procesarSolicitudCompra;
});

