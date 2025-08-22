const toggle = document.querySelector('.menu-toggle'); 
const menu = document.querySelector('nav');

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
  toggle.classList.toggle('active');
  
  // Cambiar el ícono
  const icon = toggle.querySelector('i');
  if (toggle.classList.contains('active')) {
    icon.className = 'fas fa-times';
  } else {
    icon.className = 'fas fa-bars';
  }
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    
    // Restaurar ícono
    const icon = toggle.querySelector('i');
    icon.className = 'fas fa-bars';
  }
});

// Manejar navegación del historial
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.page) {
    // Aquí puedes manejar la navegación hacia atrás
    console.log('Navegando a:', e.state.page);
  }
});

window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const blogCards = document.querySelectorAll(".blog-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remover clase activa de todos los botones
      filterButtons.forEach(btn => btn.classList.remove("active"));
      // Agregar clase activa al botón clickeado
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      blogCards.forEach(card => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});

// Funcionalidad para modales de artículos
function openArticleModal(articleId) {
  const modal = document.getElementById('articleModal');
  const modalContent = document.getElementById('modalContent');
  
  // Contenido de los artículos
  const articles = {
    article1: {
      title: "Guía Completa: Tu Primer Terreno en Chancay",
      content: `
        <img src="assets/img/chancay.jpg" alt="Chancay" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p><strong>Chancay</strong> se ha convertido en una de las zonas más atractivas para la inversión inmobiliaria en Lima Norte. Con el desarrollo del Puerto de Chancay y su conexión estratégica, esta zona ofrece oportunidades únicas para quienes buscan su primer terreno.</p>
        
        <h3>🏗️ ¿Por qué elegir Chancay?</h3>
        <ul>
          <li><strong>Ubicación estratégica:</strong> A solo 78 km de Lima</li>
          <li><strong>Desarrollo portuario:</strong> El Puerto de Chancay impulsará la economía local</li>
          <li><strong>Precios accesibles:</strong> Aún en fase de crecimiento con precios competitivos</li>
          <li><strong>Conectividad:</strong> Excelente acceso por la Panamericana Norte</li>
        </ul>
        
        <h3>📋 Aspectos clave antes de comprar:</h3>
        <ol>
          <li><strong>Verificar la zonificación:</strong> Asegúrate de que el terreno permita el uso que planeas</li>
          <li><strong>Servicios básicos:</strong> Confirma la disponibilidad de agua, luz y desagüe</li>
          <li><strong>Documentación legal:</strong> Revisa que todos los papeles están en orden</li>
          <li><strong>Accesibilidad:</strong> Evalúa las vías de acceso y transporte público</li>
          <li><strong>Proyección de crecimiento:</strong> Investiga los planes de desarrollo de la zona</li>
        </ol>
        
        <h3>💰 Financiamiento disponible:</h3>
        <p>En Urbaniza2 ofrecemos:</p>
        <ul>
          <li>Financiamiento directo sin intereses hasta 24 meses</li>
          <li>Cuotas iniciales desde S/ 5,000</li>
          <li>Planes de pago personalizados</li>
          <li>Asesoría legal incluida</li>
        </ul>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>🎯 ¿Listo para dar el primer paso?</h4>
          <p>Nuestro equipo de expertos te acompañará en todo el proceso. Agenda una visita gratuita y conoce las mejores opciones en Chancay.</p>
          <a href="https://wa.me/51982664102?text=Hola, me interesa información sobre terrenos en Chancay" 
             style="display: inline-block; background-color: #25D366; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            📱 Contactar por WhatsApp
          </a>
        </div>
      `
    },
    article2: {
      title: "Crecimiento Territorial: Oportunidades de Expansión",
      content: `
        <img src="assets/img/expansion.jpg" alt="Expansión Territorial" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p>El <strong>crecimiento territorial</strong> en el Perú presenta oportunidades únicas para inversionistas visionarios. Las nuevas zonas de expansión urbana ofrecen el potencial de alta valorización a mediano y largo plazo.</p>
        
        <h3>📈 Tendencias de Crecimiento</h3>
        <ul>
          <li><strong>Lima Norte:</strong> Expansión hacia Ancón y Santa Rosa</li>
          <li><strong>Lima Este:</strong> Desarrollo en Ate y Chaclacayo</li>
          <li><strong>Lima Sur:</strong> Crecimiento en Lurín y Pachacámac</li>
          <li><strong>Provincias:</strong> Oportunidades en ciudades intermedias</li>
        </ul>
        
        <h3>🎯 Factores Clave de Valorización</h3>
        <ol>
          <li><strong>Infraestructura:</strong> Nuevas vías de acceso y transporte</li>
          <li><strong>Servicios:</strong> Disponibilidad de agua, luz y saneamiento</li>
          <li><strong>Zonificación:</strong> Planes de desarrollo urbano aprobados</li>
          <li><strong>Demanda:</strong> Crecimiento poblacional y migración interna</li>
        </ol>
        
        <h3>💡 Estrategias de Inversión</h3>
        <p>Para maximizar el retorno de inversión:</p>
        <ul>
          <li>Investigar planes de desarrollo municipal</li>
          <li>Evaluar proyectos de infraestructura cercanos</li>
          <li>Considerar la accesibilidad y conectividad</li>
          <li>Analizar el crecimiento demográfico de la zona</li>
        </ul>
        
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>🌟 ¿Quieres identificar las mejores oportunidades?</h4>
          <p>Nuestros analistas especializados te ayudan a identificar las zonas con mayor potencial de crecimiento.</p>
          <a href="https://wa.me/51982664102?text=Hola, quiero información sobre oportunidades de expansión territorial" 
             style="display: inline-block; background-color: #28a745; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            📊 Consultar Análisis
          </a>
        </div>
      `
    },
    article3: {
      title: "Inversión Inteligente: Mejores Prácticas",
      content: `
        <img src="assets/img/inversion.jpg" alt="Inversión Inteligente" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p>La <strong>inversión inmobiliaria inteligente</strong> requiere estrategia, conocimiento del mercado y timing adecuado. Aquí te compartimos las mejores prácticas para maximizar tu inversión.</p>
        
        <h3>🧠 Principios de Inversión Inteligente</h3>
        <ul>
          <li><strong>Investigación exhaustiva:</strong> Conoce el mercado antes de invertir</li>
          <li><strong>Diversificación:</strong> No pongas todos los huevos en una canasta</li>
          <li><strong>Visión a largo plazo:</strong> La paciencia es clave en bienes raíces</li>
          <li><strong>Ubicación, ubicación, ubicación:</strong> El factor más importante</li>
        </ul>
        
        <h3>📊 Análisis de Mercado</h3>
        <p>Antes de invertir, evalúa:</p>
        <ol>
          <li><strong>Precios históricos:</strong> Tendencia de valorización en los últimos 5 años</li>
          <li><strong>Oferta y demanda:</strong> Balance del mercado local</li>
          <li><strong>Proyectos futuros:</strong> Desarrollos que impactarán la zona</li>
          <li><strong>Indicadores económicos:</strong> Crecimiento del PBI regional</li>
        </ol>
        
        <h3>⚠️ Errores Comunes a Evitar</h3>
        <ul>
          <li>Comprar sin verificar la documentación legal</li>
          <li>No considerar los costos adicionales (impuestos, notariales)</li>
          <li>Dejarse llevar por emociones en lugar de datos</li>
          <li>No tener un plan de salida definido</li>
        </ul>
        
        <h3>🎯 Estrategias Recomendadas</h3>
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>Para Principiantes:</h4>
          <ul>
            <li>Comenzar con terrenos en zonas consolidadas</li>
            <li>Buscar asesoría profesional</li>
            <li>Invertir montos que no comprometan tu estabilidad financiera</li>
          </ul>
        </div>
        
        <div style="background-color: #fff8e1; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>Para Inversionistas Experimentados:</h4>
          <ul>
            <li>Explorar zonas emergentes con alto potencial</li>
            <li>Considerar desarrollos comerciales o mixtos</li>
            <li>Evaluar oportunidades de compra en preventa</li>
          </ul>
        </div>
        
        <div style="background-color: #f3e5f5; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>💼 ¿Necesitas asesoría personalizada?</h4>
          <p>Nuestros expertos en inversión inmobiliaria te ayudan a desarrollar una estrategia personalizada según tus objetivos y presupuesto.</p>
          <a href="https://wa.me/51982664102?text=Hola, necesito asesoría para inversión inmobiliaria" 
             style="display: inline-block; background-color: #9c27b0; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            🎯 Solicitar Asesoría
          </a>
        </div>
      `
    }
  };
  
  if (articles[articleId]) {
    modalContent.innerHTML = `
      <h2>${articles[articleId].title}</h2>
      ${articles[articleId].content}
    `;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeArticleModal() {
  const modal = document.getElementById('articleModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer clic fuera del contenido
document.getElementById('articleModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeArticleModal();
  }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeArticleModal();
  }
});

// Funcionalidad del FAQ
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Cerrar todos los items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
                otherItem.querySelector('i').style.transform = 'rotate(0deg)';
            });
            
            // Si no estaba abierto, abrirlo
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
});

