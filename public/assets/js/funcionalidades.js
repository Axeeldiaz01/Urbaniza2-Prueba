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
            contador.innerHTML = `<i class="fas fa-heart"></i> Ver Favoritos (<span id="contador-favoritos">${favoritos.length}</span>)`;
        }
    }

    // Función para actualizar botón de comparar
    function actualizarBotonComparar() {
        const btnComparar = document.querySelector('.btn-comparar');
        if (btnComparar) {
            btnComparar.innerHTML = `<i class="fas fa-balance-scale"></i> Comparar (<span id="contador-comparar">${comparacion.length}</span>)`;
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

    // Agregar/quitar de comparaciÃ³n
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
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }

    // Actualizar estado de botones de comparación
    function actualizarBotonesComparacion() {
        document.querySelectorAll('.btn-comparar-item').forEach(btn => {
            const id = btn.dataset.id;
            if (comparacion.includes(id)) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-check"></i>';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="fas fa-balance-scale"></i>';
            }
        });
    }

    // Event listeners para favoritos y comparaciÃ³n
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

    // Inicializar formulario mejorado
    initializeEnhancedForm();
    
    // Inicializar botones de comprar
    initializeComprarButtons();
});

// ===== FUNCIONALIDAD DEL FORMULARIO DE CONTACTO MEJORADO =====

// Variables globales para el formulario
let currentStep = 1;
const totalSteps = 3;
let formData = {};

function initializeEnhancedForm() {
    // Event listeners para abrir modales
    const abrirFormularioBtn = document.getElementById('abrirFormulario');
    const abrirPrivacidadBtn = document.getElementById('abrirPrivacidad');
    
    if (abrirFormularioBtn) {
        abrirFormularioBtn.addEventListener('click', abrirModalContacto);
    }
    
    if (abrirPrivacidadBtn) {
        abrirPrivacidadBtn.addEventListener('click', abrirModalPrivacidad);
    }

    // Event listeners para cerrar modales
    const cerrarBtns = document.querySelectorAll('.cerrar-modal');
    cerrarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-contacto');
            if (modal) cerrarModal(modal);
        });
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-contacto')) {
            cerrarModal(event.target);
        }
    });

    // Inicializar validaciÃ³n en tiempo real
    initializeRealTimeValidation();
    
    // Inicializar navegaciÃ³n del formulario
    initializeFormNavigation();
    
    // Generar captcha inicial
    generateCaptcha();
}

// FunciÃ³n para abrir WhatsApp
function abrirWhatsApp() {
    const numero = "51987654321"; // Reemplaza con tu nÃºmero real
    const mensaje = "Hola, estoy interesado en sus terrenos. Â¿PodrÃ­an brindarme mÃ¡s informaciÃ³n?";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Funciones para manejar modales
function abrirModalContacto() {
    const modal = document.getElementById('modalContacto');
    if (modal) {
        modal.style.display = 'block';
        resetForm();
        showStep(1);
    }
}

function abrirModalPrivacidad() {
    const modal = document.getElementById('modalPrivacidad');
    if (modal) {
        modal.style.display = 'block';
    }
}

function cerrarModal(modal) {
    modal.style.display = 'none';
}

// Funciones de navegaciÃ³n del formulario
function initializeFormNavigation() {
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const submitBtn = document.getElementById('submitForm');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateCurrentStep() && currentStep < totalSteps) {
                saveCurrentStepData();
                currentStep++;
                showStep(currentStep);
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', submitForm);
    }
}

function showStep(step) {
    // Ocultar todos los pasos
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(s => s.classList.remove('active'));

    // Mostrar paso actual
    const currentStepElement = document.getElementById(`step${step}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    // Actualizar indicador de progreso
    updateProgressIndicator(step);

    // Actualizar botones de navegaciÃ³n
    updateNavigationButtons(step);

    // Si es el Ãºltimo paso, mostrar resumen
    if (step === totalSteps) {
        updateFormSummary();
    }
}

function updateProgressIndicator(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach((progressStep, index) => {
        const stepNumber = index + 1;
        progressStep.classList.remove('active', 'completed');
        
        if (stepNumber < step) {
            progressStep.classList.add('completed');
        } else if (stepNumber === step) {
            progressStep.classList.add('active');
        }
    });
}

function updateNavigationButtons(step) {
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const submitBtn = document.getElementById('submitForm');

    if (prevBtn) {
        prevBtn.style.display = step === 1 ? 'none' : 'flex';
    }

    if (nextBtn) {
        nextBtn.style.display = step === totalSteps ? 'none' : 'flex';
    }

    if (submitBtn) {
        submitBtn.style.display = step === totalSteps ? 'flex' : 'none';
    }
}

// ValidaciÃ³n en tiempo real
function initializeRealTimeValidation() {
    const inputs = document.querySelectorAll('.enhanced-form input, .enhanced-form select, .enhanced-form textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.type === 'tel') {
                formatPhoneNumber(input);
            }
            if (input.tagName === 'TEXTAREA') {
                updateCharCounter(input);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type || field.tagName.toLowerCase();
    let isValid = true;
    let message = '';

    // Validaciones específicas por tipo de campo
    switch (fieldType) {
        case 'text':
            if (field.name === 'nombre') {
                isValid = value.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
                message = isValid ? '✓ Nombre válido' : 'Ingrese un nombre válido (mínimo 2 caracteres, solo letras)';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            message = isValid ? '✓ Email válido' : 'Ingrese un email válido';
            break;
            
        case 'tel':
            const phoneRegex = /^\+?51\s?9\d{8}$/;
            isValid = phoneRegex.test(value.replace(/\s/g, ''));
            message = isValid ? '✓ Teléfono válido' : 'Ingrese un número peruano válido (+51 9XXXXXXXX)';
            break;
            
        case 'select':
            isValid = value !== '';
            message = isValid ? '✓ Selección válida' : 'Seleccione una opción';
            break;
            
        case 'textarea':
            isValid = value.length >= 10;
            message = isValid ? '✓ Mensaje válido' : 'Ingrese al menos 10 caracteres';
            break;
    }

    // Aplicar estilos de validación
    field.classList.remove('valid', 'invalid');
    field.classList.add(isValid ? 'valid' : 'invalid');

    // Mostrar mensaje de validaciÃ³n
    const messageElement = field.parentNode.querySelector('.validation-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `validation-message ${isValid ? 'success' : 'error'}`;
    }

    return isValid;
}

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('51')) {
        value = '+' + value;
    } else if (value.startsWith('9') && value.length === 9) {
        value = '+51 ' + value;
    }
    
    // Formatear con espacios
    if (value.startsWith('+51')) {
        value = value.replace(/(\+51)\s?(\d{1})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    }
    
    input.value = value;
}

function updateCharCounter(textarea) {
    const maxLength = 500;
    const currentLength = textarea.value.length;
    const counter = textarea.parentNode.querySelector('.char-counter');
    
    if (counter) {
        counter.textContent = `${currentLength}/${maxLength}`;
        counter.style.color = currentLength > maxLength * 0.9 ? '#e74c3c' : '#6c757d';
    }
}

// ValidaciÃ³n de pasos
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (!currentStepElement) return false;

    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isStepValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isStepValid = false;
        }
    });

    // ValidaciÃ³n especÃ­fica para el paso 3 (captcha y consentimientos)
    if (currentStep === 3) {
        const captchaValid = validateCaptcha();
        const consentValid = validateConsents();
        isStepValid = isStepValid && captchaValid && consentValid;
    }

    return isStepValid;
}

function saveCurrentStepData() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (!currentStepElement) return;

    const inputs = currentStepElement.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type !== 'checkbox') {
            formData[input.name] = input.value;
        } else {
            formData[input.name] = input.checked;
        }
    });
}

// Captcha
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';
    
    let question, answer;
    if (operation === '+') {
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
    } else {
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        question = `${larger} - ${smaller} = ?`;
        answer = larger - smaller;
    }
    
    const questionElement = document.querySelector('.captcha-question');
    if (questionElement) {
        questionElement.textContent = question;
        questionElement.dataset.answer = answer;
    }
}

function validateCaptcha() {
    const questionElement = document.querySelector('.captcha-question');
    const answerInput = document.getElementById('captchaAnswer');
    
    if (!questionElement || !answerInput) return false;
    
    const correctAnswer = parseInt(questionElement.dataset.answer);
    const userAnswer = parseInt(answerInput.value);
    
    const isValid = correctAnswer === userAnswer;
    
    answerInput.classList.remove('valid', 'invalid');
    answerInput.classList.add(isValid ? 'valid' : 'invalid');
    
    if (!isValid) {
        generateCaptcha(); // Generar nuevo captcha si es incorrecto
    }
    
    return isValid;
}

function validateConsents() {
    const privacyConsent = document.getElementById('privacyConsent');
    const dataConsent = document.getElementById('dataConsent');
    
    const privacyValid = privacyConsent ? privacyConsent.checked : false;
    const dataValid = dataConsent ? dataConsent.checked : false;
    
    return privacyValid && dataValid;
}

// Resumen del formulario
function updateFormSummary() {
    const summaryElement = document.querySelector('.form-summary');
    if (!summaryElement) return;

    // Combinar datos actuales con datos guardados
    saveCurrentStepData();
    
    const summaryHTML = `
        <h4><i class="fas fa-clipboard-list"></i> Resumen de su consulta</h4>
        <p><strong>Nombre:</strong> ${formData.nombre || 'No especificado'}</p>
        <p><strong>Email:</strong> ${formData.email || 'No especificado'}</p>
        <p><strong>TelÃ©fono:</strong> ${formData.telefono || 'No especificado'}</p>
        <p><strong>Tipo de consulta:</strong> ${formData.tipoConsulta || 'No especificado'}</p>
        <p><strong>Presupuesto estimado:</strong> ${formData.presupuesto || 'No especificado'}</p>
        <p><strong>UbicaciÃ³n de interÃ©s:</strong> ${formData.ubicacion || 'No especificado'}</p>
        <p><strong>Mensaje:</strong> ${formData.mensaje ? formData.mensaje.substring(0, 100) + '...' : 'No especificado'}</p>
    `;
    
    summaryElement.innerHTML = summaryHTML;
}

// EnvÃ­o del formulario
function submitForm() {
    if (!validateCurrentStep()) {
        alert('Por favor, complete todos los campos requeridos correctamente.');
        return;
    }

    // Guardar datos del Ãºltimo paso
    saveCurrentStepData();
    
    // Simular envÃ­o (aquÃ­ integrarÃ­as con tu backend)
    const submitBtn = document.getElementById('submitForm');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular delay de envÃ­o
    setTimeout(() => {
        alert('Â¡Gracias por contactarnos! Hemos recibido su consulta y nos pondremos en contacto con usted pronto.');
        
        // Cerrar modal
        const modal = document.getElementById('modalContacto');
        if (modal) {
            cerrarModal(modal);
        }
        
        // Resetear formulario
        resetForm();
        
        // Restaurar botÃ³n
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

function resetForm() {
    currentStep = 1;
    formData = {};
    
    // Limpiar todos los campos
    const form = document.querySelector('.enhanced-form');
    if (form) {
        form.reset();
    }
    
    // Limpiar clases de validaciÃ³n
    const fields = document.querySelectorAll('.enhanced-form input, .enhanced-form select, .enhanced-form textarea');
    fields.forEach(field => {
        field.classList.remove('valid', 'invalid');
    });
    
    // Limpiar mensajes de validaciÃ³n
    const messages = document.querySelectorAll('.validation-message');
    messages.forEach(message => {
        message.textContent = '';
    });
    
    // Generar nuevo captcha
    generateCaptcha();
    
    // Mostrar primer paso
    showStep(1);
}

// FUNCIONALIDAD DE COMPRA
function iniciarCompra(ubicacion, precio, area, terrenoId = 1) {
    mostrarModalCompra(precio, ubicacion, area, terrenoId);
}

function mostrarModalCompra(precio, ubicacion, area, terrenoId = 1) {
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal-compra';
    
    // Formatear precio
    const precioFormateado = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(precio);
    
    // Formatear área
    let areaFormateada;
    if (typeof area === 'string' && area.includes('Hectáreas')) {
        areaFormateada = area;
    } else if (typeof area === 'string' && area.includes('m²')) {
        areaFormateada = area;
    } else {
        const areaNum = parseFloat(area);
        if (areaNum >= 10000) {
            areaFormateada = (areaNum / 10000).toFixed(1) + ' Hectáreas';
        } else {
            areaFormateada = areaNum + ' m²';
        }
    }
    
    modal.innerHTML = `
        <div class="modal-compra-content">
            <div class="modal-compra-header">
                <h2>Solicitud de Compra</h2>
                <span class="close-compra">&times;</span>
            </div>
            <div class="modal-compra-body">
                <div class="terreno-seleccionado">
                    <h3>Detalles del Terreno</h3>
                    <div class="terreno-info">
                        <p><strong>Ubicación:</strong> ${ubicacion}</p>
                        <p><strong>Precio:</strong> ${precioFormateado}</p>
                        <p><strong>Área:</strong> ${areaFormateada}</p>
                    </div>
                </div>
                
                <div class="datos-contacto-titulo">
                    <h3>Datos de Contacto</h3>
                </div>
                
                <div class="form-compra">
                    <form id="form-compra">
                        <div class="form-grid">
                            <div class="form-group" data-field="nombre">
                                <label for="nombre">Nombre completo *</label>
                                <input type="text" id="nombre" name="nombre" placeholder="Ingrese su nombre completo" required>
                            </div>
                            <div class="form-group" data-field="email">
                                <label for="email">Email *</label>
                                <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" required>
                            </div>
                            <div class="form-group" data-field="telefono">
                                <label for="telefono">Teléfono *</label>
                                <input type="tel" id="telefono" name="telefono" placeholder="+51 9XX XXX XXX" required>
                            </div>
                            <div class="form-group" data-field="tipo_pago">
                                <label for="tipo_pago">Tipo de pago preferido</label>
                                <select id="tipo_pago" name="tipo_pago">
                                    <option value="">Seleccione una opción</option>
                                    <option value="contado">Al contado</option>
                                    <option value="financiado">Financiado</option>
                                    <option value="consultar">Consultar opciones</option>
                                </select>
                            </div>
                            <div class="form-group full-width" data-field="mensaje">
                                <label for="mensaje">Mensaje adicional</label>
                                <textarea id="mensaje" name="mensaje" rows="4" placeholder="Comentarios adicionales, consultas específicas, horarios de contacto preferidos..."></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancelar" onclick="document.querySelector('.modal-compra').remove()">
                        Cancelar
                    </button>
                    <button type="button" class="btn-enviar-compra" onclick="procesarSolicitudCompra(${precio}, '${ubicacion}', '${area}', 'whatsapp', ${terrenoId})">
                        Enviar y Contactar por WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al body
    document.body.appendChild(modal);
    
    // Agregar event listeners
    const closeBtn = modal.querySelector('.close-compra');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Función para procesar la solicitud de compra
function procesarSolicitudCompra(precio, ubicacion, area, accion, terrenoId = 1) {
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const tipoPago = document.getElementById('tipo_pago').value;
    const mensaje = document.getElementById('mensaje').value.trim();
    
    // Validar campos requeridos
    if (!nombre || !email || !telefono) {
        alert('Por favor complete todos los campos obligatorios.');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingrese un email válido.');
        return;
    }
    
    // Preparar datos para enviar al servidor
    const datosCompra = {
        terreno_id: terrenoId,
        nombre: nombre,
        email: email,
        telefono: telefono,
        tipo_pago: tipoPago,
        mensaje: mensaje,
        precio: precio,
        ubicacion: ubicacion,
        area: area
    };
    
    // Mostrar indicador de carga
    const btnWhatsApp = document.querySelector('.btn-enviar-compra');
    const textoOriginal = btnWhatsApp.innerHTML;
    btnWhatsApp.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnWhatsApp.disabled = true;
    
    // Enviar datos al servidor
    fetch('../Admin/api/compras.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosCompra)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Éxito: mostrar mensaje y proceder según la acción
            alert('¡Solicitud enviada correctamente! Nos pondremos en contacto contigo pronto.');
            
            if (accion === 'whatsapp') {
                // Crear mensaje para WhatsApp
                const precioFormateado = new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN'
                }).format(precio);
                
                let areaFormateada;
                if (typeof area === 'string' && area.includes('Hectáreas')) {
                    areaFormateada = area;
                } else if (typeof area === 'string' && area.includes('m²')) {
                    areaFormateada = area;
                } else {
                    const areaNum = parseFloat(area);
                    if (areaNum >= 10000) {
                        areaFormateada = (areaNum / 10000).toFixed(1) + ' Hectáreas';
                    } else {
                        areaFormateada = areaNum + ' m²';
                    }
                }
                
                const mensajeWhatsApp = `¡Hola! He enviado una solicitud de compra para el terreno en ${ubicacion}.\n\n` +
                                       `📍 Ubicación: ${ubicacion}\n` +
                                       `💰 Precio: ${precioFormateado}\n` +
                                       `📐 Área: ${areaFormateada}\n` +
                                       `👤 Nombre: ${nombre}\n` +
                                       `📧 Email: ${email}\n` +
                                       `📱 Teléfono: ${telefono}\n` +
                                       `💳 Tipo de pago: ${tipoPago}\n\n` +
                                       `${mensaje ? 'Mensaje: ' + mensaje + '\n\n' : ''}` +
                                       `ID de solicitud: ${data.solicitud_id}\n\n` +
                                       `¿Podrían brindarme más información sobre este terreno?`;
                
                contactarWhatsAppCompra(encodeURIComponent(mensajeWhatsApp));
            }
            
            // Cerrar modal
            const modal = document.querySelector('.modal-compra');
            if (modal) {
                document.body.removeChild(modal);
            }
        } else {
            // Error del servidor
            alert('Error al enviar la solicitud: ' + (data.error || 'Error desconocido'));
            btnWhatsApp.innerHTML = textoOriginal;
            btnWhatsApp.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión. Por favor intente nuevamente.');
        btnWhatsApp.innerHTML = textoOriginal;
        btnWhatsApp.disabled = false;
    });
}

function contactarWhatsAppCompra(mensaje) {
    const numeroWhatsApp = '51982664102';
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(url, '_blank');
}

function irACalculadora() {
    // Cerrar modal
    const modal = document.querySelector('.modal-compra');
    if (modal) {
        document.body.removeChild(modal);
    }
    
    // Ir a la sección de calculadora
    const calculadoraSection = document.querySelector('.calculadora-section');
    if (calculadoraSection) {
        calculadoraSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Función para inicializar botones de comprar
function initializeComprarButtons() {
    const botonesComprar = document.querySelectorAll('.btn-comprar');
    
    botonesComprar.forEach(boton => {
        boton.addEventListener('click', function() {
            const precio = this.getAttribute('data-precio');
            const ubicacion = this.getAttribute('data-ubicacion');
            const area = this.getAttribute('data-area');
            const terrenoId = this.getAttribute('data-terreno-id') || 1;
            
            iniciarCompra(ubicacion, precio, area, terrenoId);
        });
    });
}
