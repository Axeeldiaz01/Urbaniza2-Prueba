// CALCULADORA DE FINANCIAMIENTO
document.addEventListener('DOMContentLoaded', function() {
    // Elementos de la calculadora
    const precioInput = document.getElementById('precio-terreno');
    const cuotaInicialSlider = document.getElementById('cuota-inicial');
    const cuotaInicialValor = document.getElementById('cuota-inicial-valor');
    const plazoSelect = document.getElementById('plazo-pago');
    const tasaSelect = document.getElementById('tasa-interes');
    const btnCalcular = document.getElementById('btn-calcular');

    // Función para actualizar valor de cuota inicial
    function actualizarCuotaInicial() {
        const precio = parseFloat(precioInput?.value) || 150000; // Valor por defecto
        const porcentaje = parseFloat(cuotaInicialSlider?.value) || 20;
        const valor = (precio * porcentaje / 100).toLocaleString('es-PE', {
            style: 'currency',
            currency: 'PEN'
        });
        if (cuotaInicialValor) {
            cuotaInicialValor.textContent = valor;
        }
    }

    // Actualizar valor de cuota inicial cuando cambie el slider o el precio
    if (cuotaInicialSlider) {
        cuotaInicialSlider.addEventListener('input', actualizarCuotaInicial);
    }
    
    if (precioInput) {
        precioInput.addEventListener('input', actualizarCuotaInicial);
    }

    // Inicializar valor de cuota inicial
    actualizarCuotaInicial();

    // Calcular financiamiento
    if (btnCalcular) {
        btnCalcular.addEventListener('click', function() {
            const precio = parseFloat(precioInput.value) || 0;
            const cuotaInicialPorcentaje = parseFloat(cuotaInicialSlider.value);
            const plazo = parseInt(plazoSelect.value);
            const tasaAnual = parseFloat(tasaSelect.value);

            if (precio <= 0) {
                alert('Por favor ingrese un precio válido');
                return;
            }

            const cuotaInicial = precio * cuotaInicialPorcentaje / 100;
            const montoFinanciar = precio - cuotaInicial;
            const tasaMensual = tasaAnual / 100 / 12;
            const numeroPagos = plazo * 12;

            let cuotaMensual = 0;
            if (tasaMensual > 0) {
                cuotaMensual = montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, numeroPagos)) / 
                              (Math.pow(1 + tasaMensual, numeroPagos) - 1);
            } else {
                cuotaMensual = montoFinanciar / numeroPagos;
            }

            const totalPagar = cuotaMensual * numeroPagos + cuotaInicial;
            const interesTotal = totalPagar - precio;

            // Mostrar resultados
            document.getElementById('cuota-inicial-resultado').textContent = 
                cuotaInicial.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
            document.getElementById('monto-financiar').textContent = 
                montoFinanciar.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
            document.getElementById('cuota-mensual').textContent = 
                cuotaMensual.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
            document.getElementById('interes-total').textContent = 
                interesTotal.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
            document.getElementById('total-pagar').textContent = 
                totalPagar.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
        });
    }

    // SISTEMA DE FAVORITOS
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    let comparacion = JSON.parse(localStorage.getItem('comparacion')) || [];

    // Función para actualizar contador de favoritos
    function actualizarContadorFavoritos() {
        const contador = document.querySelector('.btn-favoritos');
        if (contador) {
            contador.textContent = `❤️ Favoritos (${favoritos.length})`;
        }
    }

    // Función para actualizar botón de comparar
    function actualizarBotonComparar() {
        const btnComparar = document.querySelector('.btn-comparar');
        if (btnComparar) {
            btnComparar.textContent = `⚖️ Comparar (${comparacion.length})`;
            btnComparar.disabled = comparacion.length < 2;
        }
    }

    // Agregar/quitar de favoritos
    function toggleFavorito(id) {
        const index = favoritos.indexOf(id);
        if (index > -1) {
            favoritos.splice(index, 1);
        } else {
            favoritos.push(id);
        }
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        actualizarContadorFavoritos();
        actualizarBotonesFavoritos();
    }

    // Agregar/quitar de comparación
    function toggleComparacion(id) {
        const index = comparacion.indexOf(id);
        if (index > -1) {
            comparacion.splice(index, 1);
        } else {
            if (comparacion.length < 3) {
                comparacion.push(id);
            } else {
                alert('Solo puedes comparar hasta 3 terrenos');
                return;
            }
        }
        localStorage.setItem('comparacion', JSON.stringify(comparacion));
        actualizarBotonComparar();
        actualizarBotonesComparacion();
    }

    // Actualizar estado de botones de favoritos
    function actualizarBotonesFavoritos() {
        document.querySelectorAll('.btn-favorito').forEach(btn => {
            const id = btn.dataset.id;
            if (favoritos.includes(id)) {
                btn.classList.add('active');
                btn.textContent = '❤️';
            } else {
                btn.classList.remove('active');
                btn.textContent = '🤍';
            }
        });
    }

    // Actualizar estado de botones de comparación
    function actualizarBotonesComparacion() {
        document.querySelectorAll('.btn-comparar-item').forEach(btn => {
            const id = btn.dataset.id;
            if (comparacion.includes(id)) {
                btn.classList.add('active');
                btn.textContent = '✓ Comparar';
            } else {
                btn.classList.remove('active');
                btn.textContent = '⚖️ Comparar';
            }
        });
    }

    // Event listeners para favoritos y comparación
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-favorito')) {
            e.preventDefault();
            toggleFavorito(e.target.dataset.id);
        }
        
        if (e.target.classList.contains('btn-comparar-item')) {
            e.preventDefault();
            toggleComparacion(e.target.dataset.id);
        }
    });

    // Ver favoritos
    document.querySelector('.btn-favoritos')?.addEventListener('click', function() {
        if (favoritos.length === 0) {
            alert('No tienes terrenos favoritos guardados');
            return;
        }
        // Aquí podrías abrir un modal o redirigir a una página de favoritos
        alert(`Tienes ${favoritos.length} terrenos en favoritos`);
    });

    // Comparar terrenos
    document.querySelector('.btn-comparar')?.addEventListener('click', function() {
        if (comparacion.length < 2) {
            alert('Selecciona al menos 2 terrenos para comparar');
            return;
        }
        // Aquí podrías abrir un modal de comparación
        alert(`Comparando ${comparacion.length} terrenos`);
    });





    // Inicializar contadores y estados
    actualizarContadorFavoritos();
    actualizarBotonComparar();
    actualizarBotonesFavoritos();
    actualizarBotonesComparacion();


});