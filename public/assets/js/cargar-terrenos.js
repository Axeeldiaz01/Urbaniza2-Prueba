// Cargar terrenos dinámicamente desde la API
document.addEventListener('DOMContentLoaded', function() {
    cargarTerrenos();
});

function cargarTerrenos() {
    // Datos estáticos de terrenos basados en las imágenes disponibles
    const terrenosEstaticos = [
        {
            id: 1,
            nombre: "Terreno Residencial Chorrillos",
            ubicacion: "Chorrillos",
            area: "120",
            descripcion: "Excelente terreno en zona residencial con todos los servicios básicos.",
            precio: 85000,
            imagen: "terreno_1755107010_4599.jpeg"
        },
        {
            id: 2,
            nombre: "Terreno Comercial Lima Sur",
            ubicacion: "Lima Sur",
            area: "200",
            descripcion: "Ideal para proyectos comerciales, ubicación estratégica.",
            precio: 120000,
            imagen: "terreno_1755107427_7780.jpeg"
        },
        {
            id: 3,
            nombre: "Terreno Familiar Pachacamac",
            ubicacion: "Pachacamac",
            area: "150",
            descripcion: "Perfecto para construcción de vivienda familiar, ambiente tranquilo.",
            precio: 95000,
            imagen: "terreno_1755108076_3637.jpg"
        },
        {
            id: 4,
            nombre: "Terreno Urbano Villa El Salvador",
            ubicacion: "Villa El Salvador",
            area: "100",
            descripcion: "Terreno en zona urbana consolidada con fácil acceso.",
            precio: 75000,
            imagen: "terreno_1755186449_9749.jpeg"
        },
        {
            id: 5,
            nombre: "Terreno Industrial Lurín",
            ubicacion: "Lurín",
            area: "300",
            descripcion: "Amplio terreno ideal para uso industrial o comercial.",
            precio: 180000,
            imagen: "terreno_1755186619_4538.png"
        },
        {
            id: 6,
            nombre: "Terreno Residencial San Juan",
            ubicacion: "San Juan de Miraflores",
            area: "110",
            descripcion: "Terreno en zona residencial consolidada, cerca de centros comerciales.",
            precio: 88000,
            imagen: "terreno_1755189317_2691.png"
        }
    ];
    
    // Simular carga exitosa
    mostrarTerrenos(terrenosEstaticos);
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