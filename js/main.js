// SCROLL ANIMACIONES
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
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
}

// MODAL IMAGEN
function initModalImagen() {
    const images = document.querySelectorAll(".img-container img");
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

// INIT GLOBAL
document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimaciones();
    initModalImagen();
});