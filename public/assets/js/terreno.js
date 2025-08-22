// ===== FUNCIONES GLOBALES DEL MODAL DE COMPRA =====

// Función para iniciar el proceso de compra (función global)
function iniciarCompra(nombre, precio, area) {
  // Crear y mostrar modal de compra
  mostrarModalCompra(nombre, precio, area);
}

// Función para mostrar el modal de compra
function mostrarModalCompra(nombre, precio, area) {
  // Crear el modal si no existe
  let modal = document.getElementById('modal-compra');
  if (!modal) {
    modal = crearModalCompra();
    document.body.appendChild(modal);
  }
  
  // Actualizar información del terreno
  document.getElementById('compra-nombre').textContent = nombre;
  document.getElementById('compra-precio').textContent = `S/ ${formatearPrecio(precio)}`;
  document.getElementById('compra-area').textContent = area;
  
  // Mostrar el modal
  modal.style.display = 'block';
}

// Función para crear el modal de compra
function crearModalCompra() {
  const modal = document.createElement('div');
  modal.id = 'modal-compra';
  modal.className = 'modal-compra';
  
  modal.innerHTML = `
    <div class="modal-compra-content">
      <div class="modal-compra-header">
        <h2><i class="fas fa-shopping-cart"></i> Solicitar Compra de Terreno</h2>
        <span class="close-compra" onclick="cerrarModalCompra()">&times;</span>
      </div>
      <div class="modal-compra-body">
        <div class="terreno-seleccionado">
          <h3>Terreno Seleccionado:</h3>
          <div class="terreno-info">
            <p><strong>Ubicación:</strong> <span id="compra-nombre"></span></p>
            <p><strong>Precio:</strong> <span id="compra-precio"></span></p>
            <p><strong>Área:</strong> <span id="compra-area"></span></p>
          </div>
        </div>
        
        <form id="form-compra" class="form-compra">
          <div class="form-group">
            <label for="compra-cliente-nombre">Nombre Completo *</label>
            <input type="text" id="compra-cliente-nombre" name="nombre" required>
          </div>
          
          <div class="form-group">
            <label for="compra-cliente-email">Correo Electrónico *</label>
            <input type="email" id="compra-cliente-email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="compra-cliente-telefono">Teléfono *</label>
            <input type="tel" id="compra-cliente-telefono" name="telefono" required>
          </div>
          
          <div class="form-group">
            <label for="compra-tipo-pago">Tipo de Pago *</label>
            <select id="compra-tipo-pago" name="tipo_pago" required>
              <option value="">Seleccionar...</option>
              <option value="contado">Al Contado</option>
              <option value="financiado">Financiado</option>
              <option value="credito">Crédito Hipotecario</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="compra-mensaje">Mensaje Adicional</label>
            <textarea id="compra-mensaje" name="mensaje" rows="4" placeholder="Comentarios adicionales sobre su interés en el terreno..."></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-cancelar" onclick="cerrarModalCompra()">Cancelar</button>
            <button type="submit" class="btn-enviar-compra">
              <i class="fas fa-paper-plane"></i> Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Agregar event listener para el formulario
  const form = modal.querySelector('#form-compra');
  if (form) {
    form.addEventListener('submit', enviarSolicitudCompra);
  }
  
  // Cerrar modal al hacer clic fuera
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      cerrarModalCompra();
    }
  });
  
  return modal;
}

// Función para cerrar el modal de compra
function cerrarModalCompra() {
  const modal = document.getElementById('modal-compra');
  if (modal) {
    modal.style.display = 'none';
    // Limpiar formulario
    const form = modal.querySelector('#form-compra');
    if (form) {
      form.reset();
    }
  }
}

// Función para enviar solicitud de compra
function enviarSolicitudCompra(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const datos = {
    terreno_id: 1, // Por ahora usamos un ID fijo, luego se puede mejorar
    nombre: formData.get('nombre'),
    email: formData.get('email'),
    telefono: formData.get('telefono'),
    tipo_pago: formData.get('tipo_pago'),
    mensaje: formData.get('mensaje')
  };
  
  // Mostrar mensaje de carga
  mostrarMensajeCarga();
  
  // Enviar datos al servidor
  fetch('http://localhost:8080/api/compras.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos)
  })
  .then(response => response.json())
  .then(data => {
    ocultarMensajeCarga();
    if (data.success) {
      mostrarMensajeExito('¡Solicitud enviada exitosamente! Nos pondremos en contacto contigo pronto.');
      cerrarModalCompra();
    } else {
      mostrarMensajeError(data.error || 'Error al enviar la solicitud. Por favor, intente nuevamente.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    ocultarMensajeCarga();
    mostrarMensajeError('Error de conexión. Por favor, intente nuevamente.');
  });
}

// Funciones auxiliares para mensajes
function mostrarMensajeCarga() {
  const btn = document.querySelector('.btn-enviar-compra');
  if (btn) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;
  }
}

function ocultarMensajeCarga() {
  const btn = document.querySelector('.btn-enviar-compra');
  if (btn) {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
    btn.disabled = false;
  }
}

function mostrarMensajeExito(mensaje) {
  alert(mensaje);
}

function mostrarMensajeError(mensaje) {
  alert(mensaje);
}

// Función para formatear precio
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-PE').format(precio);
}

// ===== EVENT LISTENERS Y FUNCIONALIDADES GENERALES =====

document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.menu-toggle'); 
  const menu = document.querySelector('nav');

  // Abrir o cerrar menú con el botón ☰
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('show');
      toggle.classList.toggle('active');
      document.body.classList.toggle('menu-abierto');

      // Guardamos en el historial para poder retroceder
      if (menu.classList.contains('show')) {
        history.pushState({ menuOpen: true }, '', '');
      }
    });
  }

  // Cerrar menú al hacer clic fuera del nav
  document.addEventListener('click', (e) => {
    if (
      menu && menu.classList.contains('show') &&
      !menu.contains(e.target) &&
      toggle && !toggle.contains(e.target)
    ) {
      menu.classList.remove('show');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
    }
  });

  // Manejar el botón "atrás" del navegador
  window.addEventListener('popstate', (e) => {
    if (menu && menu.classList.contains('show')) {
      menu.classList.remove('show');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
    }
  });

  // Funcionalidad del buscador
  const formBuscador = document.getElementById('form-buscador');
  if (formBuscador) {
    formBuscador.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const tipoInmueble = document.getElementById('tipo-inmueble').value;
      const textoBusqueda = document.getElementById('texto-busqueda').value.toLowerCase();
      const moneda = document.getElementById('moneda').value;
      const precioDesde = parseFloat(document.getElementById('precio-desde').value) || 0;
      const precioHasta = parseFloat(document.getElementById('precio-hasta').value) || Infinity;
      const retirarPrecio = document.getElementById('retirar-precio').checked;
      
      filtrarTerrenos(tipoInmueble, textoBusqueda, moneda, precioDesde, precioHasta, retirarPrecio);
    });
  }

  // Funcionalidad para ampliar imágenes
  window.ampliarImagen = function(img) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      cursor: pointer;
    `;
    
    const imgAmpliada = document.createElement('img');
    imgAmpliada.src = img.src;
    imgAmpliada.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
    `;
    
    modal.appendChild(imgAmpliada);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  };

  // Carrusel de imágenes
  const slides = document.querySelectorAll('.slide');
  const indicadores = document.querySelectorAll('.indicador');
  let slideActualIndex = 0;

  function mostrarSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicadores.forEach(indicador => indicador.classList.remove('active'));
    
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

  // Auto-play del carrusel
  if (slides.length > 0) {
    setInterval(() => {
      window.cambiarSlide(1);
    }, 5000);
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

// Función para filtrar terrenos
function filtrarTerrenos(tipo, texto, moneda, precioDesde, precioHasta, retirarPrecio) {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    const tipoCard = card.getAttribute('data-tipo');
    const ubicacionCard = card.getAttribute('data-ubicacion').toLowerCase();
    const precioCard = parseFloat(card.getAttribute('data-precio'));
    const monedaCard = card.getAttribute('data-moneda');
    
    let mostrar = true;
    
    // Filtrar por tipo
    if (tipo && tipoCard !== tipo) {
      mostrar = false;
    }
    
    // Filtrar por texto
    if (texto && !ubicacionCard.includes(texto)) {
      mostrar = false;
    }
    
    // Filtrar por precio
    if (!retirarPrecio && monedaCard === moneda) {
      if (precioCard < precioDesde || precioCard > precioHasta) {
        mostrar = false;
      }
    }
    
    card.style.display = mostrar ? 'block' : 'none';
  });
}
