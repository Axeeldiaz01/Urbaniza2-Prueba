document.addEventListener("DOMContentLoaded", function () {

    /* ========================= */
    /* ELEMENTOS */
    /* ========================= */

    const botones = document.querySelectorAll(".btn-comprar");

    const modal =
        document.getElementById("modal-compra");

    const cerrar =
        document.querySelector(".close-compra");

    const cancelar =
        document.querySelector(".btn-cancelar");

    const infoUbicacion =
        document.getElementById("info-ubicacion");

    const infoArea =
        document.getElementById("info-area");

    /* ========================= */
    /* ABRIR FORMULARIO */
    /* ========================= */

    if (botones.length > 0 && modal) {

        botones.forEach(function (boton) {

            boton.addEventListener("click", function () {

                const ubicacion =
                    this.dataset.ubicacion || "No especificado";

                const area =
                    this.dataset.area || "No especificado";

                if (infoUbicacion) {
                    infoUbicacion.textContent =
                        ubicacion;
                }

                if (infoArea) {
                    infoArea.textContent =
                        area;
                }

                modal.style.display = "grid";

            });

        });

    }

    /* ========================= */
    /* CERRAR FORMULARIO */
    /* ========================= */

    function cerrarModal() {

        if (modal) {
            modal.style.display = "none";
        }

    }

    if (cerrar) {
        cerrar.addEventListener("click", cerrarModal);
    }

    if (cancelar) {
        cancelar.addEventListener("click", cerrarModal);
    }

    window.addEventListener("click", function (e) {

        if (modal && e.target === modal) {

            cerrarModal();

        }

    });

    /* ========================= */
    /* ENVIAR FORMULARIO */
    /* ========================= */

    const form =
        document.querySelector(".form-compra");

    if (form) {

        form.addEventListener("submit", function (e) {

            e.preventDefault();

            const nombreInput =
                document.querySelector(
                    '.form-group input[type="text"]'
                );

            const telefonoInput =
                document.querySelector(
                    '.form-group input[type="tel"]'
                );

            const textarea =
                document.querySelector("textarea");

            const nombre =
                nombreInput ? nombreInput.value : "";

            const telefono =
                telefonoInput ? telefonoInput.value : "";

            const mensajeExtra =
                textarea ? textarea.value : "";

            const ubicacion =
                infoUbicacion
                    ? infoUbicacion.textContent
                    : "No especificado";

            const area =
                infoArea
                    ? infoArea.textContent
                    : "No especificado";

            /* MENSAJE */

            const mensaje =
`Hola, quiero información sobre el siguiente inmueble:

📍 Ubicación: ${ubicacion}
📐 Área: ${area}

👤 Nombre: ${nombre}
📱 Teléfono: ${telefono}

📝 Mensaje:
${mensajeExtra}`;

            /* NUMERO */

            const numero = "51982664102";

            const url =
                `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

            window.open(url, "_blank");

            /* CERRAR MODAL */

            cerrarModal();

            form.reset();

        });

    }

});