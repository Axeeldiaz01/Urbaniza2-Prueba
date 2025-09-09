// FUNCIONALIDADES ESPECÍFICAS DE LA PÁGINA DE INICIO

// MENÚ MÓVIL
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

// SLIDER DEL HERO
let imagenes = document.querySelectorAll(".hero-slider .slide");
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

// HEADER SHRINK AL HACER SCROLL
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});

// MODAL DE CONTACTO
const abrirFormulario = document.getElementById('abrir-formulario');
const cerrarModalBtn = document.getElementById('cerrar-modal');
const modalContacto = document.getElementById('modal-contacto');

if (abrirFormulario && modalContacto) {
  abrirFormulario.onclick = function() {
    modalContacto.style.display = 'block';
  };
}

if (cerrarModalBtn && modalContacto) {
  cerrarModalBtn.onclick = function() {
    modalContacto.style.display = 'none';
  };
}

if (modalContacto) {
  modalContacto.onclick = function(e) {
    if (e.target === modalContacto) modalContacto.style.display = 'none';
  };
}

// CALCULADORA DE FINANCIAMIENTO
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel de terrenos
    initializeCarousel();
    
    // Inicializar carrusel de guía para compradores
    initializeGuideCarousel();
    
    // Elementos de la calculadora
    const precioInput = document.getElementById('precio-terreno');
    const cuotaInicialSlider = document.getElementById('cuota-inicial');
    const cuotaInicialValor = document.getElementById('cuota-inicial-valor');
    const plazoSelect = document.getElementById('plazo-pago');
    const tasaSelect = document.getElementById('tasa-interes');
    const btnCalcular = document.getElementById('btn-calcular');

    // Función para actualizar valor de cuota inicial
    function actualizarCuotaInicial() {
        const precio = parseFloat(precioInput?.value) || 150000; // Valor por defecto
        const porcentaje = parseFloat(cuotaInicialSlider?.value) || 20;
        const valor = (precio * porcentaje / 100).toLocaleString('es-PE', {
            style: 'currency',
            currency: 'PEN'
        });
        if (cuotaInicialValor) {
            cuotaInicialValor.textContent = valor;
        }
    }

    // Actualizar valor de cuota inicial cuando cambie el slider o el precio
    if (cuotaInicialSlider) {
        cuotaInicialSlider.addEventListener('input', actualizarCuotaInicial);
    }
    
    if (precioInput) {
        precioInput.addEventListener('input', actualizarCuotaInicial);
    }

    // Inicializar valor de cuota inicial
    actualizarCuotaInicial();

    // Calcular financiamiento
    if (btnCalcular) {
        btnCalcular.addEventListener('click', function() {
            const precio = parseFloat(precioInput.value) || 0;
            const cuotaInicialPorcentaje = parseFloat(cuotaInicialSlider.value);
            const plazo = parseInt(plazoSelect.value);
            const tasaAnual = parseFloat(tasaSelect.value);

            if (precio <= 0) {
                alert('Por favor ingrese un precio válido');
                return;
            }

            const cuotaInicial = precio * cuotaInicialPorcentaje / 100;
            const montoFinanciar = precio - cuotaInicial;
            const tasaMensual = tasaAnual / 100 / 12;
            const numeroMeses = plazo * 12;

            let cuotaMensual = 0;
            if (tasaMensual > 0) {
                cuotaMensual = montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, numeroMeses)) / 
                              (Math.pow(1 + tasaMensual, numeroMeses) - 1);
            } else {
                cuotaMensual = montoFinanciar / numeroMeses;
            }

            const totalPagar = cuotaInicial + (cuotaMensual * numeroMeses);
            const interesTotal = totalPagar - precio;

            // Mostrar resultados
            document.getElementById('resultado-precio').textContent = 
                precio.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
            document.getElementById('resultado-cuota-inicial').textContent = 
                cuotaInicial.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
            document.getElementById('resultado-monto-financiar').textContent = 
                montoFinanciar.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
            document.getElementById('resultado-cuota-mensual').textContent = 
                cuotaMensual.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
            document.getElementById('resultado-total').textContent = 
                totalPagar.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
        });
    }
});

// CARRUSEL DE TERRENOS
let currentSlide = 0;
let slideInterval;

function initializeCarousel() {
    const carousel = document.querySelector('.carrusel-terrenos');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.slide-terreno');
    const prevBtn = carousel.querySelector('.carrusel-btn.anterior');
    const nextBtn = carousel.querySelector('.carrusel-btn.siguiente');
    
    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }

    // Pausar en hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Inicializar
    showSlide(0);
    startAutoSlide();
}

// CARRUSEL DE GUÍA PARA COMPRADORES
function initializeGuideCarousel() {
    const carousel = document.querySelector('.carrusel-imagenes');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.slide-terreno');
    
    if (slides.length === 0) return;

    let currentSlideGuide = 0;
    let slideIntervalGuide;

    function showSlideGuide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('activo', i === index);
        });
    }

    function nextSlideGuide() {
        currentSlideGuide = (currentSlideGuide + 1) % slides.length;
        showSlideGuide(currentSlideGuide);
    }

    function startAutoSlideGuide() {
        slideIntervalGuide = setInterval(nextSlideGuide, 4000);
    }

    function stopAutoSlideGuide() {
        clearInterval(slideIntervalGuide);
    }

    // Pausar en hover
    carousel.addEventListener('mouseenter', stopAutoSlideGuide);
    carousel.addEventListener('mouseleave', startAutoSlideGuide);

    // Inicializar
    showSlideGuide(0);
    startAutoSlideGuide();
}

// FUNCIONES DE UTILIDAD

function abrirWhatsApp() {
    const numero = '51982664102';
    const mensaje = encodeURIComponent('Hola, me interesa obtener más información sobre los terrenos disponibles.');
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, '_blank');
}

function abrirModalContacto() {
    const modal = document.getElementById('modal-contacto');
    if (modal) {
        modal.style.display = 'block';
    }
}

function cerrarModal(modal) {
    if (modal) modal.style.display = 'none';
}

// INICIALIZACIÓN AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades específicas de la página de inicio
    console.log('Página de inicio cargada correctamente');
});