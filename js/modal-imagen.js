(function () {

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".img-container img").forEach(img => {

            img.style.cursor = "zoom-in";

            img.addEventListener("click", () => {
                const modal = document.createElement("div");
                modal.className = "modal-imagen";

                const imagen = document.createElement("img");
                imagen.src = img.src;

                modal.appendChild(imagen);
                document.body.appendChild(modal);

                // activar animación
                setTimeout(() => modal.classList.add("activo"), 10);

                // cerrar
                modal.addEventListener("click", () => {
                    modal.classList.remove("activo");
                    setTimeout(() => modal.remove(), 300);
                });
            });

        });
    });

})();