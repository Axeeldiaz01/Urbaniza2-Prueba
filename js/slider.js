/**
 * URBANIZA2 - Hero Slider (slider.js)
 * Archivo separado para no afectar main.js
 */

function initHeaderSlider() {
    const slides = document.querySelectorAll(".slide");
    const indicators = document.querySelectorAll(".indicator");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (!slides.length) return;

    let currentSlide = 0;
    let autoplayInterval = null;

    function goToSlide(index) {
        // Quitar activo del slide y indicador actual
        slides[currentSlide].classList.remove("active");
        if (indicators[currentSlide]) indicators[currentSlide].classList.remove("active");

        // Calcular nuevo índice con wrap
        currentSlide = (index + slides.length) % slides.length;

        // Activar nuevo slide e indicador
        slides[currentSlide].classList.add("active");
        if (indicators[currentSlide]) indicators[currentSlide].classList.add("active");
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Botón siguiente
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            stopAutoplay();
            startAutoplay(); // reinicia el timer
        });
    }

    // Botón anterior
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        });
    }

    // Indicadores de puntos
    indicators.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            goToSlide(i);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Pausa al pasar el mouse sobre el slider
    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
        sliderContainer.addEventListener("mouseenter", stopAutoplay);
        sliderContainer.addEventListener("mouseleave", startAutoplay);
    }

    // Soporte para swipe en móvil
    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderContainer) {
        sliderContainer.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        sliderContainer.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                stopAutoplay();
                startAutoplay();
            }
        }, { passive: true });
    }

    // Arrancar autoplay
    startAutoplay();
}

// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initHeaderSlider);