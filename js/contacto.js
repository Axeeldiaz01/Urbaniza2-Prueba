// Mostrar/ocultar menú en móviles
  const toggle = document.querySelector('.menu-toggle'); 
  const menu = document.querySelector('nav');

  // Abrir o cerrar menú con el botón ☰
  toggle.addEventListener('click', () => {
    menu.classList.toggle('show');
    toggle.classList.toggle('active'); // <- Esto activa la animación de la X
    document.body.classList.toggle('menu-abierto');

    // Guardamos en el historial para poder retroceder
    if (menu.classList.contains('show')) {
      history.pushState({ menuOpen: true }, '', '');
    }
  });

  // Cerrar menú al hacer clic fuera del nav (solo si está abierto)
  document.addEventListener('click', (e) => {
    if (
      menu.classList.contains('show') &&
      !menu.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      menu.classList.remove('show');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
      history.back(); // para "limpiar" el pushState anterior
    }
  });

  // Cerrar menú si se presiona el botón de retroceso del navegador
  window.addEventListener('popstate', (e) => {
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
    }
  });

  // Reducir header al hacer scroll
  window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  });
  /*modal*/
  const modal = document.getElementById("modalFormulario");
  const abrir = document.getElementById("abrirModal");
  const cerrar = document.getElementById("cerrarModal");

  if (abrir) {
    abrir.addEventListener("click", function (e) {
      e.preventDefault(); // evitar redirección
      if (modal) {
        modal.style.display = "flex";
      }
    });
  }

  if (cerrar) {
    cerrar.addEventListener("click", function () {
      if (modal) {
        modal.style.display = "none";
      }
    });
  }

  window.addEventListener("click", function (e) {
    if (modal && e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Manejo mejorado de enlaces de WhatsApp
  document.addEventListener('DOMContentLoaded', function() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('href');
        
        // Intentar abrir en una nueva ventana/pestaña
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        
        // Si no se puede abrir (bloqueado por popup), usar location
        if (!newWindow) {
          window.location.href = url;
        }
      });
    });
    
    // Inicializar formulario mejorado
    initializeEnhancedForm();
  });

// Mejorar el enlace de WhatsApp
function mejorarWhatsApp() {
  const enlacesWhatsApp = document.querySelectorAll('a[href*="wa.me"]');
  enlacesWhatsApp.forEach(enlace => {
    enlace.addEventListener('click', function(e) {
      // Agregar analytics o tracking aquí si es necesario
      console.log('Usuario hizo clic en WhatsApp');
    });
  });
}

// FUNCIONALIDAD DEL FORMULARIO MEJORADO
let currentStep = 1;
const totalSteps = 3;
let captchaAnswer = 0;

// Función para copiar al portapapeles
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.textContent = '¡Copiado al portapapeles!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  });
}

// Inicializar formulario mejorado
function initializeEnhancedForm() {
  const abrirFormulario = document.getElementById('abrir-formulario');
  const modalFormulario = document.getElementById('modal-formulario-mejorado');
  const cerrarFormulario = document.getElementById('cerrar-formulario-mejorado');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSiguiente = document.getElementById('btn-siguiente');
  const btnEnviar = document.getElementById('btn-enviar');
  const formulario = document.getElementById('formulario-contacto-mejorado');

  // Abrir modal
  if (abrirFormulario) {
    abrirFormulario.addEventListener('click', function() {
      modalFormulario.style.display = 'block';
      generateCaptcha();
    });
  }

  // Cerrar modal
  if (cerrarFormulario) {
    cerrarFormulario.addEventListener('click', function() {
      modalFormulario.style.display = 'none';
      resetForm();
    });
  }

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', function(event) {
    if (event.target === modalFormulario) {
      modalFormulario.style.display = 'none';
      resetForm();
    }
  });

  // Navegación del formulario
  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', nextStep);
  }
  
  if (btnAnterior) {
    btnAnterior.addEventListener('click', prevStep);
  }

  // Validación en tiempo real
  setupRealTimeValidation();

  // Contador de caracteres para mensaje
  const mensajeTextarea = document.getElementById('mensaje');
  const mensajeCounter = document.getElementById('mensaje-counter');
  
  if (mensajeTextarea && mensajeCounter) {
    mensajeTextarea.addEventListener('input', function() {
      const length = this.value.length;
      mensajeCounter.textContent = length;
      
      if (length > 500) {
        this.value = this.value.substring(0, 500);
        mensajeCounter.textContent = 500;
      }
    });
  }

  // Formateo de teléfono
  const telefonoInput = document.getElementById('telefono');
  if (telefonoInput) {
    telefonoInput.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 9) {
        value = value.substring(0, 9);
      }
      this.value = value;
    });
  }

  // Modal de política de privacidad
  const verPolitica = document.getElementById('ver-politica-privacidad');
  const modalPolitica = document.getElementById('modal-politica-privacidad');
  const cerrarPolitica = document.getElementById('cerrar-politica-privacidad');

  if (verPolitica) {
    verPolitica.addEventListener('click', function(e) {
      e.preventDefault();
      modalPolitica.style.display = 'block';
    });
  }

  if (cerrarPolitica) {
    cerrarPolitica.addEventListener('click', function() {
      modalPolitica.style.display = 'none';
    });
  }

  // Envío del formulario
  if (formulario) {
    formulario.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateStep(3)) {
        // Simular envío exitoso
        showSuccessMessage();
        setTimeout(() => {
          modalFormulario.style.display = 'none';
          resetForm();
        }, 3000);
      }
    });
  }
}

// Navegación entre pasos
function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepDisplay();
      
      if (currentStep === 3) {
        updateSummary();
      }
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepDisplay();
  }
}

// Actualizar visualización del paso
function updateStepDisplay() {
  // Actualizar indicador de progreso
  document.querySelectorAll('.step').forEach((step, index) => {
    if (index + 1 <= currentStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  // Mostrar/ocultar pasos del formulario
  document.querySelectorAll('.form-step').forEach((step, index) => {
    if (index + 1 === currentStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  // Actualizar botones de navegación
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSiguiente = document.getElementById('btn-siguiente');
  const btnEnviar = document.getElementById('btn-enviar');

  if (currentStep === 1) {
    btnAnterior.style.display = 'none';
  } else {
    btnAnterior.style.display = 'inline-flex';
  }

  if (currentStep === totalSteps) {
    btnSiguiente.style.display = 'none';
    btnEnviar.style.display = 'inline-flex';
  } else {
    btnSiguiente.style.display = 'inline-flex';
    btnEnviar.style.display = 'none';
  }
}

// Validación en tiempo real
function setupRealTimeValidation() {
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const telefono = document.getElementById('telefono');
  const mensaje = document.getElementById('mensaje');

  if (nombre) {
    nombre.addEventListener('blur', () => validateField('nombre'));
    nombre.addEventListener('input', () => clearValidation('nombre'));
  }

  if (email) {
    email.addEventListener('blur', () => validateField('email'));
    email.addEventListener('input', () => clearValidation('email'));
  }

  if (telefono) {
    telefono.addEventListener('blur', () => validateField('telefono'));
    telefono.addEventListener('input', () => clearValidation('telefono'));
  }

  if (mensaje) {
    mensaje.addEventListener('blur', () => validateField('mensaje'));
    mensaje.addEventListener('input', () => clearValidation('mensaje'));
  }
}

// Validar campo individual
function validateField(fieldName) {
  const field = document.getElementById(fieldName);
  const validation = document.getElementById(fieldName + '-validation');
  
  if (!field || !validation) return true;

  let isValid = true;
  let message = '';

  switch (fieldName) {
    case 'nombre':
      if (field.value.trim().length < 2) {
        isValid = false;
        message = 'El nombre debe tener al menos 2 caracteres';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(field.value.trim())) {
        isValid = false;
        message = 'El nombre solo puede contener letras y espacios';
      } else {
        message = '✓ Nombre válido';
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        isValid = false;
        message = 'Por favor ingresa un email válido';
      } else {
        message = '✓ Email válido';
      }
      break;

    case 'telefono':
      if (field.value.trim().length < 9) {
        isValid = false;
        message = 'El teléfono debe tener 9 dígitos';
      } else if (!/^9\d{8}$/.test(field.value.trim())) {
        isValid = false;
        message = 'El teléfono debe comenzar con 9 y tener 9 dígitos';
      } else {
        message = '✓ Teléfono válido';
      }
      break;

    case 'mensaje':
      if (field.value.trim().length < 10) {
        isValid = false;
        message = 'El mensaje debe tener al menos 10 caracteres';
      } else {
        message = '✓ Mensaje válido';
      }
      break;
  }

  // Aplicar estilos y mostrar mensaje
  field.classList.remove('valid', 'invalid');
  field.classList.add(isValid ? 'valid' : 'invalid');
  
  validation.textContent = message;
  validation.classList.remove('success', 'error');
  validation.classList.add(isValid ? 'success' : 'error');

  return isValid;
}

// Limpiar validación
function clearValidation(fieldName) {
  const field = document.getElementById(fieldName);
  const validation = document.getElementById(fieldName + '-validation');
  
  if (field && validation) {
    field.classList.remove('valid', 'invalid');
    validation.textContent = '';
    validation.classList.remove('success', 'error');
  }
}

// Validar paso completo
function validateStep(step) {
  let isValid = true;

  switch (step) {
    case 1:
      isValid = validateField('nombre') && 
                validateField('email') && 
                validateField('telefono');
      break;

    case 2:
      const tipoConsulta = document.getElementById('tipo-consulta');
      if (!tipoConsulta.value) {
        isValid = false;
        alert('Por favor selecciona un tipo de consulta');
      }
      isValid = isValid && validateField('mensaje');
      break;

    case 3:
      const captchaInput = document.getElementById('captcha-answer');
      const captchaValidation = document.getElementById('captcha-validation');
      const privacidadCheck = document.getElementById('acepto-privacidad');

      // Validar CAPTCHA
      if (parseInt(captchaInput.value) !== captchaAnswer) {
        isValid = false;
        captchaValidation.textContent = 'Respuesta incorrecta';
        captchaValidation.classList.add('error');
      } else {
        captchaValidation.textContent = '✓ Verificación correcta';
        captchaValidation.classList.remove('error');
        captchaValidation.classList.add('success');
      }

      // Validar aceptación de privacidad
      if (!privacidadCheck.checked) {
        isValid = false;
        alert('Debes aceptar la política de privacidad para continuar');
      }
      break;
  }

  return isValid;
}

// Generar CAPTCHA simple
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  captchaAnswer = num1 + num2;
  
  const captchaQuestion = document.getElementById('captcha-question');
  if (captchaQuestion) {
    captchaQuestion.textContent = `¿Cuánto es ${num1} + ${num2}?`;
  }
}

// Actualizar resumen
function updateSummary() {
  const resumenContenido = document.getElementById('resumen-contenido');
  if (!resumenContenido) return;

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const telefono = document.getElementById('telefono').value;
  const tipoConsulta = document.getElementById('tipo-consulta');
  const presupuesto = document.getElementById('presupuesto');
  const ubicacion = document.getElementById('ubicacion-interes').value;
  const mensaje = document.getElementById('mensaje').value;

  const tipoTexto = tipoConsulta.options[tipoConsulta.selectedIndex].text;
  const presupuestoTexto = presupuesto.value ? presupuesto.options[presupuesto.selectedIndex].text : 'No especificado';

  resumenContenido.innerHTML = `
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Teléfono:</strong> ${telefono}</p>
    <p><strong>Tipo de consulta:</strong> ${tipoTexto}</p>
    <p><strong>Presupuesto:</strong> ${presupuestoTexto}</p>
    <p><strong>Ubicación de interés:</strong> ${ubicacion || 'No especificada'}</p>
    <p><strong>Mensaje:</strong> ${mensaje.substring(0, 100)}${mensaje.length > 100 ? '...' : ''}</p>
  `;
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
  const formulario = document.getElementById('formulario-contacto-mejorado');
  formulario.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <div style="font-size: 4rem; color: #27ae60; margin-bottom: 20px;">
        <i class="fas fa-check-circle"></i>
      </div>
      <h3 style="color: #27ae60; margin-bottom: 15px;">¡Consulta Enviada Exitosamente!</h3>
      <p style="color: #6c757d; margin-bottom: 20px;">
        Gracias por contactarnos. Hemos recibido tu consulta y te responderemos en menos de 24 horas.
      </p>
      <p style="color: #2c3e50;">
        <strong>¿Necesitas una respuesta más rápida?</strong><br>
        Contáctanos por WhatsApp: <a href="https://wa.me/51982664102" target="_blank" style="color: #25d366;">982 664 102</a>
      </p>
    </div>
  `;
}

// Resetear formulario
function resetForm() {
  currentStep = 1;
  updateStepDisplay();
  
  const formulario = document.getElementById('formulario-contacto-mejorado');
  if (formulario && formulario.reset) {
    formulario.reset();
  }
  
  // Limpiar validaciones
  ['nombre', 'email', 'telefono', 'mensaje'].forEach(field => {
    clearValidation(field);
  });
  
  // Resetear contador de caracteres
  const mensajeCounter = document.getElementById('mensaje-counter');
  if (mensajeCounter) {
    mensajeCounter.textContent = '0';
  }
  
  // Limpiar CAPTCHA
  const captchaValidation = document.getElementById('captcha-validation');
  if (captchaValidation) {
    captchaValidation.textContent = '';
    captchaValidation.classList.remove('success', 'error');
  }
  
  generateCaptcha();
}
