document.querySelectorAll('.btn-ubicacion').forEach(boton => {
    boton.addEventListener('click', function (e) {
        e.preventDefault();

        if (this.classList.contains('disabled')) {
            alert("Ubicación aún no disponible");
            return;
        }

        const destino = this.getAttribute('data-destino');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destino}`;

                window.open(url, "_blank");
            });
        } else {
            alert("Tu navegador no soporta geolocalización");
        }
    });
});