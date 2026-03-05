// Envolver todo el código en DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  // Mostrar/ocultar menú en móviles
  const toggle = document.querySelector('.menu-toggle'); 
  const menu = document.querySelector('nav');

  // Abrir o cerrar menú con el botón ☰
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('show');
      toggle.classList.toggle('active'); // <- Esto activa la animación de la X
      document.body.classList.toggle('menu-abierto');

      // Guardamos en el historial para poder retroceder
      if (menu.classList.contains('show')) {
        history.pushState({ menuOpen: true }, '', '');
      }
    });
  }

  // Cerrar menú al hacer clic fuera del nav (solo si está abierto)
  document.addEventListener('click', (e) => {
    if (
      menu && menu.classList.contains('show') &&
      !menu.contains(e.target) &&
      toggle && !toggle.contains(e.target)
    ) {
      menu.classList.remove('show');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
      history.back(); // para "limpiar" el pushState anterior
    }
  });

  // Cerrar menú si se presiona el botón de retroceso del navegador
  window.addEventListener('popstate', (e) => {
    if (menu && menu.classList.contains('show')) {
      menu.classList.remove('show');
      toggle && toggle.classList.remove('active');
      document.body.classList.remove('menu-abierto');
    }
  });

  // Reducir header al hacer scroll
  window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    }
  });

  // Código de modal eliminado - elementos no existen en HTML

  // Manejo mejorado de enlaces de WhatsApp
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

  // Función para copiar al portapapeles (disponible globalmente)
  window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(function() {
      // Crear notificación temporal
      const notification = document.createElement('div');
      notification.textContent = 'Copiado al portapapeles!';
      notification.className = 'notification-success';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    });
  }

  // Elementos del formulario mejorado
  const abrirFormulario = document.getElementById('abrir-formulario');
  const modalFormulario = document.getElementById('modal-formulario-mejorado');
  const cerrarFormulario = document.getElementById('cerrar-formulario-mejorado');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSiguiente = document.getElementById('btn-siguiente');
  const btnEnviar = document.getElementById('btn-enviar');
  const formulario = document.getElementById('formulario-contacto-mejorado');

  // Verificar que los elementos principales existen
  if (!abrirFormulario || !modalFormulario || !formulario) {
    console.warn('Elementos principales del formulario no encontrados');
    return;
  }

  // Abrir modal
  if (abrirFormulario) {
    abrirFormulario.addEventListener('click', function() {
      if (modalFormulario) {
        modalFormulario.classList.remove('oculto');
        currentStep = 1;
        updateStepDisplay();
        generateCaptcha();
        
        // Ocultar botón scroll to top
        if (scrollToHomeBtn) {
          scrollToHomeBtn.style.display = 'none';
          scrollToHomeBtn.style.visibility = 'hidden';
          scrollToHomeBtn.style.opacity = '0';
        }
      }
    });
  }

  // Cerrar modal
  if (cerrarFormulario) {
    cerrarFormulario.addEventListener('click', function() {
      if (modalFormulario) {
        modalFormulario.classList.add('oculto');
        resetForm();
        
        // Mostrar botón scroll to top si corresponde
        if (scrollToHomeBtn && window.scrollY > 100) {
          scrollToHomeBtn.style.display = 'block';
          scrollToHomeBtn.style.visibility = 'visible';
          scrollToHomeBtn.style.opacity = '1';
        }
      }
    });
  }

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', function(event) {
    if (event.target === modalFormulario && modalFormulario) {
      modalFormulario.classList.add('oculto');
      resetForm();
      
      // Mostrar botón scroll to top si corresponde
        if (scrollToHomeBtn && window.scrollY > 100) {
          scrollToHomeBtn.style.display = 'block';
          scrollToHomeBtn.style.visibility = 'visible';
          scrollToHomeBtn.style.opacity = '1';
        }
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
      modalPolitica.classList.remove('oculto');
    });
  }

  if (cerrarPolitica) {
    cerrarPolitica.addEventListener('click', function() {
      modalPolitica.classList.add('oculto');
    });
  }

  // Cerrar modal al hacer clic fuera de él
  if (modalPolitica) {
    modalPolitica.addEventListener('click', function(e) {
      if (e.target === modalPolitica) {
        modalPolitica.classList.add('oculto');
      }
    });
  }

  // Envío del formulario
  if (formulario) {
    formulario.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (validateStep(2)) {
        await submitForm();
      }
    });
  }

  // Navegación entre pasos
  function nextStep() {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepDisplay();
        
        // Si llegamos al paso 3 (resumen), mostrar los datos
        if (currentStep === 3) {
          mostrarResumenDatos();
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
      btnAnterior.classList.add('btn-nav-hidden');
    } else {
      btnAnterior.style.display = 'inline-flex';
      btnAnterior.classList.remove('btn-nav-hidden');
    }

    if (currentStep === totalSteps) {
      btnSiguiente.style.display = 'none';
      btnSiguiente.classList.add('btn-nav-hidden');
      btnEnviar.style.display = 'inline-flex';
      btnEnviar.classList.remove('btn-nav-hidden');
    } else {
      btnSiguiente.style.display = 'inline-flex';
      btnSiguiente.classList.remove('btn-nav-hidden');
      btnEnviar.style.display = 'none';
      btnEnviar.classList.add('btn-nav-hidden');
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

  // Verificaciones adicionales para elementos críticos
  const tipoConsulta = document.getElementById('tipo-consulta');
  const presupuesto = document.getElementById('presupuesto');
  const ubicacionInteres = document.getElementById('ubicacion-interes');
  const captchaInput = document.getElementById('captcha-input');
  
  if (tipoConsulta) {
    tipoConsulta.addEventListener('change', () => validateField('tipo-consulta'));
  }
  
  if (presupuesto) {
    presupuesto.addEventListener('change', () => validateField('presupuesto'));
  }
  
  if (ubicacionInteres) {
    ubicacionInteres.addEventListener('blur', () => validateField('ubicacion-interes'));
    ubicacionInteres.addEventListener('input', () => clearValidation('ubicacion-interes'));
  }
  
  if (captchaInput) {
    captchaInput.addEventListener('blur', () => validateField('captcha-input'));
    captchaInput.addEventListener('input', () => clearValidation('captcha-input'));
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
          message = 'Nombre válido';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          isValid = false;
          message = 'Por favor ingresa un email válido';
        } else {
          message = 'Email válido';
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
          message = 'Teléfono válido';
        }
        break;

      case 'mensaje':
        if (field.value.trim().length < 10) {
          isValid = false;
          message = 'El mensaje debe tener al menos 10 caracteres';
        } else {
          message = 'Mensaje válido';
        }
        break;

      case 'captcha-input':
        const userInput = field.value.trim();
        const captchaValue = parseInt(userInput);
        
        // Verificar que sea un número válido y coincida con la respuesta
        if (userInput === '' || isNaN(captchaValue)) {
          isValid = false;
          message = 'Por favor ingresa un número';
        } else if (captchaValue === captchaAnswer) {
          isValid = true;
          message = 'Respuesta correcta ✓';
        } else {
          isValid = false;
          message = 'Respuesta incorrecta. Inténtalo de nuevo';
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
        // Validar tipo de consulta
        const tipoConsulta = document.getElementById('tipo-consulta');
        if (!tipoConsulta.value) {
          isValid = false;
          alert('Por favor selecciona un tipo de consulta');
          return false;
        }
        
        // Validar mensaje
        if (!validateField('mensaje')) {
          isValid = false;
          alert('Por favor completa el mensaje de tu consulta');
          return false;
        }
        
        // Validar CAPTCHA
        const captchaField = document.getElementById('captcha-input');
        const captchaValue = parseInt(captchaField.value.trim());
        
        if (!captchaField.value.trim() || isNaN(captchaValue) || captchaValue !== captchaAnswer) {
          isValid = false;
          
          // Mostrar mensaje específico según el error
          if (!captchaField.value.trim()) {
            alert('Por favor responde la pregunta de seguridad');
          } else if (isNaN(captchaValue)) {
            alert('Por favor ingresa un número válido');
          } else {
            alert('Respuesta incorrecta. La respuesta correcta es ' + captchaAnswer + '. Se generará una nueva pregunta.');
            generateCaptcha(); // Generar nueva pregunta
          }
          
          captchaField.focus();
          return false;
        }
        
        // Validar política de privacidad
        const politicaCheckbox = document.getElementById('politica-privacidad');
        if (!politicaCheckbox.checked) {
          isValid = false;
          alert('Debes aceptar la política de privacidad para continuar');
          return false;
        }
        break;

      case 3:
        // En el paso 3 solo mostramos el resumen, no hay validaciones adicionales
        updateSummary();
        break;
    }

    return isValid;
  }

  // Generar CAPTCHA simple
  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
    captchaAnswer = num1 + num2;
    
    const captchaQuestion = document.getElementById('captcha-question');
    if (captchaQuestion) {
      captchaQuestion.textContent = `¿Cuánto es ${num1} + ${num2}?`;
    }
    
    // Limpiar el campo de entrada
    const captchaInput = document.getElementById('captcha-input');
    if (captchaInput) {
      captchaInput.value = '';
      captchaInput.classList.remove('valid', 'invalid');
    }
    
    // Limpiar mensaje de validación
    const captchaValidation = document.getElementById('captcha-validation');
    if (captchaValidation) {
      captchaValidation.textContent = '';
      captchaValidation.classList.remove('success', 'error');
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
    <div class="resumen-header">
      <h4><i class="fas fa-clipboard-list"></i> Resumen de tu consulta</h4>
      <p class="resumen-subtitle">Revisa que todos los datos sean correctos antes de enviar</p>
    </div>
    
    <div class="resumen-datos">
      <div class="dato-item">
        <span class="dato-label"><i class="fas fa-user"></i> Nombre:</span>
        <span class="dato-valor">${nombre}</span>
      </div>
      <div class="dato-item">
        <span class="dato-label"><i class="fas fa-envelope"></i> Email:</span>
        <span class="dato-valor">${email}</span>
      </div>
      <div class="dato-item">
        <span class="dato-label"><i class="fas fa-phone"></i> Teléfono:</span>
        <span class="dato-valor">${telefono}</span>
      </div>
      <div class="dato-item">
        <span class="dato-label"><i class="fas fa-question-circle"></i> Tipo de consulta:</span>
        <span class="dato-valor">${tipoTexto}</span>
      </div>
      <div class="dato-item">
        <span class="dato-label"><i class="fas fa-dollar-sign"></i> Presupuesto:</span>
        <span class="dato-valor">${presupuestoTexto}</span>
      </div>
      <div class="dato-item">
        <span class="dato-label"><i class="fas fa-map-marker-alt"></i> Ubicación de interés:</span>
        <span class="dato-valor">${ubicacion || 'No especificada'}</span>
      </div>
      <div class="dato-item mensaje-item">
        <span class="dato-label"><i class="fas fa-comment"></i> Mensaje:</span>
        <span class="dato-valor mensaje-completo">${mensaje}</span>
      </div>
    </div>
    
    <div class="resumen-footer">
      <div class="info-envio">
        <i class="fas fa-info-circle"></i>
        <span>Al enviar, serás redirigido a WhatsApp para completar tu consulta</span>
      </div>
    </div>
  `;
}

// Enviar formulario a WhatsApp en vez de PHP
async function submitForm() {
  const modalFormulario = document.getElementById('modal-formulario-mejorado');
  const btnEnviar = document.getElementById('btn-enviar');
  
  // Mostrar estado de carga
  btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btnEnviar.disabled = true;
  
  try {
    const formData = {
      nombre: document.getElementById('nombre').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      tipoConsulta: document.getElementById('tipo-consulta').value,
      presupuesto: document.getElementById('presupuesto').value,
      ubicacionInteres: document.getElementById('ubicacion-interes').value,
      mensaje: document.getElementById('mensaje').value
    };

    // Formatear mensaje para WhatsApp
    const tipoConsulta = document.getElementById('tipo-consulta');
    const tipoConsultaTexto = tipoConsulta.selectedOptions[0]?.text || 'No especificado';
    const presupuesto = document.getElementById('presupuesto');
    const presupuestoTexto = presupuesto.selectedOptions[0]?.text || 'No especificado';

    const mensajeWhatsApp = 
      `Hola! Quiero hacer una consulta desde la web Urbaniza2:\n\n` +
      `Nombre: ${formData.nombre}\n` +
      `Email: ${formData.email}\n` +
      `Teléfono: ${formData.telefono}\n` +
      `Tipo de consulta: ${tipoConsultaTexto}\n` +
      `Presupuesto: ${presupuestoTexto}\n` +
      `Ubicación de interés: ${formData.ubicacionInteres || 'No especificado'}\n` +
      `Mensaje: ${formData.mensaje || 'Sin mensaje adicional'}\n`;

    // Número de WhatsApp destino (cámbialo si lo deseas)
    const numeroWhatsApp = '51982664102';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    // Cerrar el formulario modal
    modalFormulario.classList.add('oculto');
    
    // Mostrar mensaje de éxito fuera del modal
    showSuccessNotificationOutside();
    
    // Resetear el formulario
    resetForm();
    
    // Esperar un momento antes de abrir WhatsApp
    setTimeout(() => {
      window.open(url, '_blank');
    }, 2000);
    
    // Mostrar botón scroll to top si corresponde
    const scrollToHomeBtn = document.querySelector('.scrollToHome');
    if (scrollToHomeBtn && window.scrollY > 100) {
      scrollToHomeBtn.style.display = 'block';
      scrollToHomeBtn.style.visibility = 'visible';
      scrollToHomeBtn.style.opacity = '1';
    }
    
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage('No se pudo abrir WhatsApp. Por favor, intenta nuevamente.');
  } finally {
    btnEnviar.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Consulta';
    btnEnviar.disabled = false;
    }
  }

  // Mostrar notificación de éxito fuera del modal
  function showSuccessNotification() {
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification-success';
    
    notification.innerHTML = `
      <div class="notification-header">
        <i class="fas fa-check-circle"></i>
        <strong>Consulta Enviada!</strong>
      </div>
      <p class="notification-text">
        Tu consulta fue enviada exitosamente. Te responderemos en menos de 24 horas.
      </p>
      <div class="notification-footer">
        <i class="fab fa-whatsapp"></i> ¿Urgente? WhatsApp: 982 664 102
      </div>
    `;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
    
    // Permitir cerrar manualmente
    notification.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });
  }

  // Mostrar notificación de éxito fuera del modal (nueva función)
  function showSuccessNotificationOutside() {
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'success-notification-outside';
    
    notification.innerHTML = `
      <div class="notification-container">
        <div class="notification-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="notification-content">
          <h3>¡Formulario Enviado Exitosamente!</h3>
          <p>Tu consulta ha sido procesada correctamente y será redirigida a WhatsApp.</p>
          <div class="notification-details">
            <div class="detail-item">
              <i class="fas fa-clock"></i>
              <span>Tiempo de respuesta: Menos de 24 horas</span>
            </div>
            <div class="detail-item">
              <i class="fab fa-whatsapp"></i>
              <span>¿Urgente? WhatsApp: <a href="https://wa.me/51982664102" target="_blank">982 664 102</a></span>
            </div>
          </div>
        </div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Agregar estilos CSS inline para la notificación
    const style = document.createElement('style');
    style.textContent = `
      .success-notification-outside {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: slideInRight 0.5s ease-out;
        font-family: 'Poppins', sans-serif;
      }
      
      .notification-container {
        padding: 20px;
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 15px;
      }
      
      .notification-icon {
        font-size: 2.5rem;
        color: #fff;
        flex-shrink: 0;
      }
      
      .notification-content h3 {
        margin: 0 0 8px 0;
        font-size: 1.2rem;
        font-weight: 600;
      }
      
      .notification-content p {
        margin: 0 0 15px 0;
        font-size: 0.95rem;
        opacity: 0.9;
        line-height: 1.4;
      }
      
      .notification-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
      }
      
      .detail-item i {
        width: 16px;
        text-align: center;
      }
      
      .detail-item a {
        color: #fff;
        text-decoration: underline;
        font-weight: 500;
      }
      
      .notification-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
      }
      
      .notification-close:hover {
        background: rgba(255,255,255,0.3);
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 768px) {
        .success-notification-outside {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;
    
    // Agregar estilos al head si no existen
    if (!document.querySelector('#success-notification-styles')) {
      style.id = 'success-notification-styles';
      document.head.appendChild(style);
    }
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Auto-remover después de 8 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => {
          notification.remove();
        }, 500);
      }
    }, 8000);
  }

  // Mostrar mensaje de confirmación en el paso 3
  function showConfirmationMessage() {
    const resumenContenido = document.getElementById('resumen-contenido');
    if (!resumenContenido) return;
    
    resumenContenido.innerHTML = `
      <div class="confirmacion-envio">
        <div class="confirmacion-header">
          <div class="check-animation">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>¡Formulario Enviado Correctamente!</h3>
          <p class="confirmacion-subtitle">Tu consulta ha sido procesada exitosamente</p>
        </div>
        
        <div class="confirmacion-body">
          <div class="mensaje-principal">
            <i class="fas fa-paper-plane"></i>
            <p>Tu consulta será redirigida a WhatsApp para completar el proceso de contacto.</p>
          </div>
          
          <div class="tiempo-respuesta">
            <i class="fas fa-clock"></i>
            <p><strong>Tiempo de respuesta:</strong> Menos de 24 horas</p>
          </div>
          
          <div class="contacto-directo">
            <i class="fab fa-whatsapp"></i>
            <p><strong>¿Consulta urgente?</strong><br>
            WhatsApp directo: <a href="https://wa.me/51982664102" target="_blank">982 664 102</a></p>
          </div>
        </div>
        
        <div class="confirmacion-footer">
          <div class="loading-whatsapp">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Abriendo WhatsApp...</span>
          </div>
        </div>
      </div>
    `;
  }

  // Mostrar mensaje de éxito (función original mantenida para compatibilidad)
  function showSuccessMessage() {
    const formulario = document.getElementById('formulario-contacto-mejorado');
    formulario.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 4rem; color: #27ae60; margin-bottom: 20px;">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: #27ae60; margin-bottom: 15px;">Consulta Enviada Exitosamente!</h3>
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

  // Mostrar mensaje de error
  function showErrorMessage(message) {
    const formulario = document.getElementById('formulario-contacto-mejorado');
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      background: #e74c3c;
      color: white;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      text-align: center;
    `;
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i> ${message}
    `;
    
    formulario.insertBefore(errorDiv, formulario.firstChild);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // Función para mostrar el resumen de datos
  function mostrarResumenDatos() {
    // Recopilar datos del formulario usando los IDs correctos
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const tipoConsulta = document.getElementById('tipo-consulta').value;
    const presupuesto = document.getElementById('presupuesto').value;
    const ubicacionInteres = document.getElementById('ubicacion-interes').value;
    const mensaje = document.getElementById('mensaje').value;

    // Obtener textos legibles para los selects
    const tipoConsultaTexto = document.getElementById('tipo-consulta').selectedOptions[0]?.text || 'No especificado';
    const presupuestoTexto = document.getElementById('presupuesto').selectedOptions[0]?.text || 'No especificado';

    // Actualizar elementos del resumen
    document.getElementById('resumen-nombre').textContent = nombre || '-';
    document.getElementById('resumen-email').textContent = email || '-';
    document.getElementById('resumen-telefono').textContent = telefono || '-';
    document.getElementById('resumen-ubicacion').textContent = ubicacionInteres || '-';
    document.getElementById('resumen-presupuesto').textContent = presupuestoTexto || '-';
    document.getElementById('resumen-tiempo').textContent = tipoConsultaTexto || '-';
    document.getElementById('resumen-mensaje').textContent = mensaje || 'Sin mensaje adicional';
  }

  // Función para mostrar confirmación de envío
  function mostrarConfirmacionEnvio() {
    // Ocultar el resumen de datos
    document.getElementById('resumen-datos').style.display = 'none';
    
    // Mostrar mensaje de confirmación
    document.getElementById('confirmacion-envio').style.display = 'block';
    
    // Ocultar la nota de revisión
    document.querySelector('.resumen-note').style.display = 'none';
    
    // Ocultar botón de enviar
    document.getElementById('btn-enviar').style.display = 'none';
    
    // Simular preparación de WhatsApp (opcional)
    setTimeout(() => {
      const loadingWhatsapp = document.querySelector('.loading-whatsapp');
      if (loadingWhatsapp) {
        loadingWhatsapp.innerHTML = `
          <i class="fab fa-whatsapp"></i>
          <span>¡Listo! Puedes contactarnos por WhatsApp cuando gustes.</span>
        `;
      }
    }, 3000);
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

}); // Cierre del DOMContentLoaded
