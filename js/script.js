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
  // Cambiar Imagen
let imagenes = document.querySelectorAll(".slider-img");
let index = 0;
function cambiarImagen() {
  imagenes.forEach((img, i) => {
    img.classList.remove("active");
  });
  index = (index + 1) % imagenes.length;
  imagenes[index].classList.add("active");
}
setInterval(cambiarImagen, 4000); // cada 3 segundos cambia

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
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  const carrusel = document.querySelector('.carrusel-imagenes');

  function mostrarSlide(index) {
    if (index < 0) indice = total - 1;
    else if (index >= total) indice = 0;
    else indice = index;

    carrusel.style.transform = `translateX(-${indice * 100}%)`;
  }

  document.querySelector('.anterior').addEventListener('click', () => {
    mostrarSlide(indice - 1);
  });

  document.querySelector('.siguiente').addEventListener('click', () => {
    mostrarSlide(indice + 1);
  });

  mostrarSlide(indice); // Mostrar el primer slide
});

//formulario
document.getElementById('abrir-formulario').onclick = function() {
  document.getElementById('modal-contacto').classList.remove('oculto');
};
document.getElementById('cerrar-modal').onclick = function() {
  document.getElementById('modal-contacto').classList.add('oculto');
};
document.getElementById('modal-contacto').onclick = function(e) {
  if (e.target === this) this.classList.add('oculto');
};



