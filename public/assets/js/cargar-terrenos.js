// Cargar terrenos dinámicamente desde la API
document.addEventListener('DOMContentLoaded', function() {
    cargarTerrenos();
});

function cargarTerrenos() {
    // URL de la API (ajustar según el entorno)
    const apiUrl = 'http://localhost:8080/api/terrenos.php?action=list';
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data) {
                mostrarTerrenos(data.data);
            } else {
                console.error('Error al cargar terrenos:', data.message);
                mostrarMensajeError();
            }
        })
        .catch(error => {
            console.error('Error de conexión:', error);
            mostrarMensajeError();
        });
}

function mostrarTerrenos(terrenos) {
    const galeria = document.querySelector('.galeria');
    if (!galeria) {
        console.error('No se encontró el contenedor .galeria');
        return;
    }
    
    // Remover solo los terrenos dinámicos previos (que tienen la clase 'terreno-dinamico')
    const terrenosDinamicos = galeria.querySelectorAll('.terreno-dinamico');
    terrenosDinamicos.forEach(terreno => terreno.remove());
    
    // Crear las tarjetas dinámicamente
    terrenos.forEach(terreno => {
        const card = crearTarjetaTerreno(terreno);
        galeria.appendChild(card);
    });
    
    // Inicializar botones de comprar para los nuevos terrenos
    if (typeof initializeComprarButtons === 'function') {
        initializeComprarButtons();
    }
    
    // Notificar que los terrenos han sido cargados para el buscador
    const event = new CustomEvent('terrenosCargados');
    document.dispatchEvent(event);
}

function crearTarjetaTerreno(terreno) {
    const card = document.createElement('div');
    card.className = 'card terreno-dinamico';
    card.setAttribute('data-tipo', 'Terreno');
    // Incluir tanto ubicación como nombre para búsqueda más amplia
    const textoCompleto = `${terreno.ubicacion} ${terreno.nombre}`.toLowerCase();
    card.setAttribute('data-ubicacion', textoCompleto);
    card.setAttribute('data-precio', terreno.precio);
    card.setAttribute('data-moneda', 'S/'); // Asumiendo soles peruanos
    
    // Construir la ruta de la imagen
    const imagenSrc = terreno.imagen ? `uploads/${terreno.imagen}` : 'assets/img/default-terreno.svg';
    
    card.innerHTML = `
        <img src="${imagenSrc}" alt="${terreno.nombre}" onclick="ampliarImagen(this)" onerror="this.src='assets/img/default-terreno.svg'">
        <div class="linea-decorativa"></div>
        <h3>${terreno.nombre}</h3>
        <p>${terreno.area} m²</p>
        <p>${terreno.descripcion}</p>
        <p class="precio">S/ ${formatearPrecio(terreno.precio)}</p>
        <div class="card-actions">
            <button class="btn-comprar" data-precio="${terreno.precio}" data-ubicacion="${terreno.ubicacion}" data-area="${terreno.area} m²" data-terreno-id="${terreno.id}">
                <i class="fas fa-shopping-cart"></i> Comprar
            </button>
        </div>
    `;
    
    return card;
}

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-PE').format(precio);
}

function mostrarMensajeError() {
    const galeria = document.querySelector('.galeria');
    if (galeria) {
        const mensajeError = document.createElement('div');
        mensajeError.className = 'mensaje-error';
        mensajeError.innerHTML = `
            <p>No se pudieron cargar los terrenos en este momento.</p>
            <p>Por favor, intente más tarde.</p>
        `;
        galeria.appendChild(mensajeError);
    }
}