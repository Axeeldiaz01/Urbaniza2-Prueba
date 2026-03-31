/**

 * Maneja: Animaciones de Scroll, Modal de Imágenes y Menú Responsive
 */

// =============================
// 1. SCROLL ANIMACIONES (REVEAL)
// =============================
function initScrollAnimaciones() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    elements.forEach(el => observer.observe(el));
}


// =============================
// 2. MODAL IMAGEN (ZOOM)
// =============================
function initModalImagen() {
    const images = document.querySelectorAll(".img-container img, .galeria img");
    if (!images.length) return;

    images.forEach(img => {
        img.style.cursor = "zoom-in";

        img.addEventListener("click", () => {
            const modal = document.createElement("div");
            modal.className = "modal-imagen";

            const imagen = document.createElement("img");
            imagen.src = img.src;

            modal.appendChild(imagen);
            document.body.appendChild(modal);

            setTimeout(() => modal.classList.add("activo"), 10);

            modal.addEventListener("click", () => {
                modal.classList.remove("activo");
                setTimeout(() => modal.remove(), 300);
            });
        });
    });
}


// =============================
// 3. MENU HAMBURGUESA (RESPONSIVE)
// =============================
function initMenuHamburguesa() {

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.querySelector("nav");
    const navMenu = document.querySelector("nav ul");
    const body = document.body;

    if (!menuToggle || !nav || !navMenu) return;

    let menuAbierto = false;

    function abrirMenu() {
        menuToggle.classList.add("active");
        navMenu.classList.add("active");
        nav.classList.add("show");
        body.classList.add("menu-abierto");
        menuAbierto = true;
    }

    function cerrarMenu() {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        nav.classList.remove("show");
        body.classList.remove("menu-abierto");
        menuAbierto = false;
    }

    function toggleMenu(e) {
        e.stopPropagation();

        if (menuAbierto) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    }

    // Click botón hamburguesa
    menuToggle.addEventListener("click", toggleMenu);

    // Click en enlaces
    const links = document.querySelectorAll("nav ul li a");

    links.forEach(link => {
        link.addEventListener("click", () => {
            cerrarMenu();
        });
    });

    // Click fuera del menú
    document.addEventListener("click", (e) => {

        if (
            menuAbierto &&
            !nav.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            cerrarMenu();
        }

    });

}


// =============================
// 4. HEADER SHRINK
// =============================
function initHeaderScroll() {
    const header = document.querySelector("header");
    if (!header) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {
            header.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
        }

    });
}


// =============================
// INIT GLOBAL
// =============================
document.addEventListener("DOMContentLoaded", () => {

    initScrollAnimaciones();
    initModalImagen();
    initMenuHamburguesa();
    initHeaderScroll();
    initHeaderSlider();
    console.log("Urbaniza2: Scripts cargados correctamente.");

});