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
  //  initHeaderSlider();
    initCalculadora();
    console.log("Urbaniza2: Scripts cargados correctamente.");

});

// =============================
// 5. CALCULADORA
// =============================
function initCalculadora() {

    const precioInput = document.getElementById("precio-terreno");
    const cuotaRange = document.getElementById("cuota-inicial");
    const cuotaValor = document.getElementById("cuota-inicial-valor");
    const plazo = document.getElementById("plazo-pago");
    const interes = document.getElementById("tasa-interes");

    const cuotaInicialRes = document.getElementById("cuota-inicial-resultado");
    const montoFinanciar = document.getElementById("monto-financiar");
    const cuotaMensual = document.getElementById("cuota-mensual");
    const interesTotal = document.getElementById("interes-total");
    const totalPagar = document.getElementById("total-pagar");

    if (!precioInput) return;

    const formato = (num) =>
        "S/ " + num.toLocaleString("es-PE", { minimumFractionDigits: 2 });

    function calcular() {

        const precio = parseFloat(precioInput.value) || 0;
        const porcentaje = cuotaRange.value;
        const años = plazo.value;
        const tasa = interes.value;

        if (precio <= 0) return;

        // CUOTA INICIAL
        const inicial = (precio * porcentaje) / 100;

        //  COSTOS EXTRA (más realista)
        const gastos = precio * 0.02; // 2%
        const seguro = precio * 0.01; // 1%

        //  MONTO TOTAL REAL
        const monto = precio - inicial + gastos + seguro;

        const meses = años * 12;
        const tasaMensual = tasa / 100 / 12;

        const cuota =
            (monto * tasaMensual) /
            (1 - Math.pow(1 + tasaMensual, -meses));

        const total = cuota * meses;
        const interesPagado = total - monto;

        //  MOSTRAR
        cuotaValor.textContent = formato(inicial);
        cuotaInicialRes.textContent = formato(inicial);
        montoFinanciar.textContent = formato(monto);
        cuotaMensual.textContent = formato(cuota);
        interesTotal.textContent = formato(interesPagado);
        totalPagar.textContent = formato(total);
    }

    // AUTO UPDATE
    precioInput.addEventListener("input", calcular);
    cuotaRange.addEventListener("input", calcular);
    plazo.addEventListener("change", calcular);
    interes.addEventListener("change", calcular);

    calcular();
}