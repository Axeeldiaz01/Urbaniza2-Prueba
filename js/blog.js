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
  //Contraer scroll
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});
// Script para animar FAQ como acordeón
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      item.classList.toggle("active");

      // Cierra los otros
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
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
      title: "Consejos para Comprar tu Primer Terreno en Chancay",
      content: `
        <h2>Consejos para Comprar tu Primer Terreno en Chancay</h2>
        <img src="img/chancay.jpg" alt="Chancay" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
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
          <li><strong>Documentación legal:</strong> Revisa que todos los papeles estén en orden</li>
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
        <h2>Crecimiento Territorial: Oportunidades de Expansión</h2>
        <img src="img/crecimientoter.jpeg" alt="Crecimiento Territorial" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p>El <strong>crecimiento territorial</strong> en Lima y provincias está creando nuevas oportunidades de inversión inmobiliaria. Conoce las zonas con mayor potencial de expansión urbana.</p>
        
        <h3>🏙️ Zonas de mayor crecimiento:</h3>
        <ul>
          <li><strong>Lima Norte:</strong> Chancay, Ancón, Santa Rosa</li>
          <li><strong>Lima Sur:</strong> Chorrillos, Villa El Salvador, Lurín</li>
          <li><strong>Provincias:</strong> Huacho, Barranca, Cañete</li>
          <li><strong>Corredores viales:</strong> Panamericana Norte y Sur</li>
        </ul>
        
        <h3>📊 Factores de expansión territorial:</h3>
        <ol>
          <li><strong>Desarrollo de infraestructura:</strong> Nuevas carreteras y servicios</li>
          <li><strong>Proyectos portuarios:</strong> Puerto de Chancay y otros</li>
          <li><strong>Migración urbana:</strong> Búsqueda de espacios más amplios</li>
          <li><strong>Políticas de vivienda:</strong> Programas gubernamentales</li>
        </ol>
        
        <h3>💡 Oportunidades de inversión:</h3>
        <ul>
          <li>Terrenos en zonas de expansión urbana</li>
          <li>Proyectos residenciales de mediana densidad</li>
          <li>Desarrollos comerciales en nuevos centros poblados</li>
          <li>Inversión en terrenos agrícolas con potencial urbano</li>
        </ul>
        
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>🎯 Estrategia de inversión</h4>
          <p>El momento ideal para invertir es antes de que se concrete el desarrollo. Identifica las zonas con proyectos de infraestructura aprobados pero aún no ejecutados.</p>
          <a href="https://wa.me/51982664102?text=Hola, me interesa información sobre crecimiento territorial" 
             style="display: inline-block; background-color: #2196F3; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            📈 Consultar oportunidades
          </a>
        </div>
      `
    },
    article3: {
      title: "Documentos Esenciales para Comprar un Terreno",
      content: `
        <h2>Documentos Esenciales para Comprar un Terreno</h2>
        <img src="img/crecimientoneg.jpeg" alt="Documentos legales" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p>Una compra segura requiere verificar cuidadosamente toda la documentación. Aquí te explicamos qué documentos son indispensables.</p>
        
        <h3>📄 Documentos del terreno que debes revisar:</h3>
        
        <h4>1. Título de Propiedad</h4>
        <ul>
          <li>Inscrito en Registros Públicos</li>
          <li>Sin cargas ni gravámenes</li>
          <li>Datos coincidentes con la realidad</li>
        </ul>
        
        <h4>2. Certificado de Parámetros Urbanísticos</h4>
        <ul>
          <li>Zonificación del terreno</li>
          <li>Usos permitidos</li>
          <li>Restricciones de construcción</li>
        </ul>
        
        <h4>3. Certificado de Búsqueda Catastral</h4>
        <ul>
          <li>Ubicación exacta</li>
          <li>Medidas y colindancias</li>
          <li>Código de predio</li>
        </ul>
        
        <h3>📋 Documentos que tú debes presentar:</h3>
        <ul>
          <li><strong>DNI vigente</strong> (original y copia)</li>
          <li><strong>Constancia de ingresos</strong> o declaración jurada</li>
          <li><strong>Recibo de servicios</strong> (domicilio actual)</li>
          <li><strong>Referencias comerciales</strong> (opcional)</li>
        </ul>
        
        <h3>⚖️ Proceso legal que manejamos:</h3>
        <ol>
          <li><strong>Verificación de documentos:</strong> Revisamos toda la documentación</li>
          <li><strong>Elaboración de contrato:</strong> Preparamos el contrato de compraventa</li>
          <li><strong>Firma ante notario:</strong> Formalizamos la transacción</li>
          <li><strong>Inscripción registral:</strong> Registramos la propiedad a tu nombre</li>
        </ol>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-top: 20px; border-left: 4px solid #ffc107;">
          <h4>⚠️ Importante</h4>
          <p><strong>En Urbaniza2 nos encargamos de toda la gestión legal.</strong> Nuestro equipo jurídico verifica cada documento y te acompaña en todo el proceso hasta que tengas tu título de propiedad en mano.</p>
          <a href="https://wa.me/51982664102?text=Necesito asesoría legal para compra de terreno" 
             style="display: inline-block; background-color: #f97109; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            🏛️ Consulta legal gratuita
          </a>
        </div>
      `
    },
    article4: {
      title: "Opciones de Financiamiento para tu Terreno",
      content: `
        <h2>Opciones de Financiamiento para tu Terreno</h2>
        <img src="img/crecimientoecore.jpeg" alt="Financiamiento" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p>Sabemos que comprar un terreno es una gran decisión. Por eso ofrecemos múltiples opciones de financiamiento para que puedas hacer realidad tu sueño.</p>
        
        <h3>💰 Modalidades de pago disponibles:</h3>
        
        <h4>1. Pago al Contado</h4>
        <ul>
          <li><strong>Descuento especial:</strong> Hasta 15% de descuento</li>
          <li><strong>Proceso rápido:</strong> Escrituración inmediata</li>
          <li><strong>Sin intereses:</strong> Precio final sin recargos</li>
        </ul>
        
        <h4>2. Financiamiento Directo</h4>
        <ul>
          <li><strong>Sin intereses:</strong> Hasta 24 meses</li>
          <li><strong>Cuota inicial:</strong> Desde S/ 5,000</li>
          <li><strong>Cuotas fijas:</strong> Sin variaciones</li>
          <li><strong>Sin penalidades:</strong> Por pago adelantado</li>
        </ul>
        
        <h4>3. Plan Personalizado</h4>
        <ul>
          <li><strong>Evaluación individual:</strong> Según tu capacidad de pago</li>
          <li><strong>Flexibilidad:</strong> Cuotas adaptadas a tus ingresos</li>
          <li><strong>Plazos extendidos:</strong> Hasta 36 meses en casos especiales</li>
        </ul>
        
        <h3>📊 Ejemplo de financiamiento:</h3>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>Terreno de S/ 50,000</h4>
          <ul>
            <li><strong>Cuota inicial:</strong> S/ 10,000 (20%)</li>
            <li><strong>Saldo a financiar:</strong> S/ 40,000</li>
            <li><strong>Plazo:</strong> 24 meses</li>
            <li><strong>Cuota mensual:</strong> S/ 1,667</li>
            <li><strong>Sin intereses ni comisiones</strong></li>
          </ul>
        </div>
        
        <h3>✅ Requisitos mínimos:</h3>
        <ul>
          <li>Ser mayor de edad</li>
          <li>Tener ingresos demostrables</li>
          <li>Presentar DNI vigente</li>
          <li>Constancia de domicilio</li>
        </ul>
        
        <h3>🎁 Beneficios adicionales:</h3>
        <ul>
          <li><strong>Asesoría legal gratuita</strong></li>
          <li><strong>Gestión de documentos incluida</strong></li>
          <li><strong>Visitas guiadas sin costo</strong></li>
          <li><strong>Seguimiento personalizado</strong></li>
        </ul>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>🚀 ¡Empieza hoy mismo!</h4>
          <p>No esperes más para hacer realidad tu sueño. Nuestros asesores están listos para diseñar el plan de financiamiento perfecto para ti.</p>
          <a href="https://wa.me/51982664102?text=Quiero información sobre financiamiento de terrenos" 
             style="display: inline-block; background-color: #25D366; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            💬 Consultar financiamiento
          </a>
        </div>
      `
    },
    
    article5: {
      title: "Crecimiento de Negocios: Inversión Inmobiliaria Comercial",
      content: `
        <h2>Crecimiento de Negocios: Inversión Inmobiliaria Comercial</h2>
        <img src="img/desarrollopor.jpeg" alt="Crecimiento de Negocios" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p>La <strong>inversión inmobiliaria comercial</strong> es una excelente estrategia para hacer crecer tu negocio y generar ingresos pasivos a largo plazo.</p>
        
        <h3>🏢 Tipos de inversión comercial:</h3>
        <ul>
          <li><strong>Locales comerciales:</strong> Tiendas, restaurantes, oficinas</li>
          <li><strong>Centros comerciales:</strong> Espacios en galerías y malls</li>
          <li><strong>Terrenos comerciales:</strong> Para desarrollo futuro</li>
          <li><strong>Edificios de oficinas:</strong> Espacios corporativos</li>
        </ul>
        
        <h3>💰 Ventajas de la inversión comercial:</h3>
        <ol>
          <li><strong>Rentabilidad superior:</strong> Mayor retorno que propiedades residenciales</li>
          <li><strong>Contratos a largo plazo:</strong> Estabilidad de ingresos</li>
          <li><strong>Valorización constante:</strong> Ubicaciones estratégicas</li>
          <li><strong>Beneficios tributarios:</strong> Depreciación y deducciones</li>
        </ol>
        
        <h3>📍 Ubicaciones estratégicas:</h3>
        <ul>
          <li>Avenidas principales con alto tráfico</li>
          <li>Centros comerciales establecidos</li>
          <li>Zonas de desarrollo empresarial</li>
          <li>Cerca de estaciones de transporte público</li>
        </ul>
        
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>🎯 Estrategia de crecimiento</h4>
          <p>Comienza con una propiedad comercial pequeña y reinvierte las ganancias para expandir tu portafolio. La clave está en la ubicación y el tipo de inquilino.</p>
          <a href="https://wa.me/51982664102?text=Quiero información sobre inversión comercial" 
             style="display: inline-block; background-color: #FF9800; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            🏢 Explorar oportunidades
          </a>
        </div>
      `
    },
    
    article6: {
      title: "Crecimiento Económico: Sectores en Expansión",
      content: `
        <h2>Crecimiento Económico: Sectores en Expansión</h2>
        <img src="img/crecimientoecore.jpeg" alt="Crecimiento Económico" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p>El <strong>crecimiento económico</strong> del país está impulsando nuevos sectores que generan oportunidades inmobiliarias únicas para inversionistas visionarios.</p>
        
        <h3>📈 Sectores en crecimiento:</h3>
        <ul>
          <li><strong>Tecnología:</strong> Centros de datos, oficinas tech</li>
          <li><strong>Logística:</strong> Almacenes, centros de distribución</li>
          <li><strong>Turismo:</strong> Hoteles, hostales, apartamentos turísticos</li>
          <li><strong>Salud:</strong> Clínicas, centros médicos especializados</li>
        </ul>
        
        <h3>🌟 Oportunidades emergentes:</h3>
        <ol>
          <li><strong>E-commerce:</strong> Centros de fulfillment y última milla</li>
          <li><strong>Energías renovables:</strong> Parques solares y eólicos</li>
          <li><strong>Educación:</strong> Institutos técnicos y universidades</li>
          <li><strong>Entretenimiento:</strong> Centros recreativos y deportivos</li>
        </ol>
        
        <h3>💡 Factores de crecimiento:</h3>
        <ul>
          <li>Digitalización de la economía</li>
          <li>Crecimiento de la clase media</li>
          <li>Inversión extranjera directa</li>
          <li>Mejoras en infraestructura</li>
        </ul>
        
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>💰 Maximiza tu inversión</h4>
          <p>Identifica sectores con alta demanda y poca oferta inmobiliaria. El timing es crucial para obtener la máxima rentabilidad.</p>
          <a href="https://wa.me/51982664102?text=Me interesa invertir en sectores de crecimiento" 
             style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            📊 Analizar sectores
          </a>
        </div>
      `
    },
    
    article7: {
      title: "Desarrollo Portuario: El Futuro de Chancay",
      content: `
        <h2>Desarrollo Portuario: El Futuro de Chancay</h2>
        <img src="img/ubicaciones.jpeg" alt="Desarrollo Portuario" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p>El <strong>Puerto de Chancay</strong> será el proyecto de infraestructura más importante del Perú, transformando completamente la zona norte de Lima y creando oportunidades de inversión históricas.</p>
        
        <h3>🚢 Impacto del Puerto de Chancay:</h3>
        <ul>
          <li><strong>Megapuerto:</strong> El más grande de Sudamérica</li>
          <li><strong>Conexión con Asia:</strong> Ruta directa a China</li>
          <li><strong>Generación de empleo:</strong> Miles de puestos de trabajo</li>
          <li><strong>Desarrollo urbano:</strong> Nueva ciudad portuaria</li>
        </ul>
        
        <h3>🏗️ Proyectos complementarios:</h3>
        <ol>
          <li><strong>Autopista Chancay-Huaral:</strong> Conexión rápida con Lima</li>
          <li><strong>Zona económica especial:</strong> Incentivos para empresas</li>
          <li><strong>Centro logístico:</strong> Almacenes y distribución</li>
          <li><strong>Desarrollo residencial:</strong> Viviendas para trabajadores</li>
        </ol>
        
        <h3>📍 Zonas de inversión prioritarias:</h3>
        <ul>
          <li>Chancay centro: Comercio y servicios</li>
          <li>Huaral: Desarrollo residencial</li>
          <li>Aucallama: Proyectos industriales</li>
          <li>Corredor vial: Servicios de transporte</li>
        </ul>
        
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>⚡ Oportunidad única</h4>
          <p>El Puerto de Chancay estará operativo en 2024. Los precios de terrenos en la zona aún están en niveles pre-desarrollo. Es el momento de invertir.</p>
          <a href="https://wa.me/51982664102?text=Quiero información sobre terrenos en Chancay" 
             style="display: inline-block; background-color: #2196F3; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            🚢 Invertir en Chancay
          </a>
        </div>
      `
    },
    
    article8: {
      title: "Crecimiento Eco-responsable: Inversión Sostenible",
      content: `
        <h2>Crecimiento Eco-responsable: Inversión Sostenible</h2>
        <img src="img/consultas.jpeg" alt="Crecimiento Eco-responsable" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p>La <strong>inversión inmobiliaria sostenible</strong> no solo protege el medio ambiente, sino que también genera mayor rentabilidad y valor a largo plazo.</p>
        
        <h3>🌱 Características eco-responsables:</h3>
        <ul>
          <li><strong>Eficiencia energética:</strong> Paneles solares, LED</li>
          <li><strong>Gestión del agua:</strong> Sistemas de reciclaje</li>
          <li><strong>Materiales sostenibles:</strong> Construcción verde</li>
          <li><strong>Espacios verdes:</strong> Áreas de conservación</li>
        </ul>
        
        <h3>💚 Beneficios de la inversión verde:</h3>
        <ol>
          <li><strong>Mayor valorización:</strong> Propiedades más cotizadas</li>
          <li><strong>Menores costos operativos:</strong> Ahorro en servicios</li>
          <li><strong>Incentivos fiscales:</strong> Beneficios tributarios</li>
          <li><strong>Responsabilidad social:</strong> Impacto positivo</li>
        </ol>
        
        <h3>🏡 Proyectos eco-responsables:</h3>
        <ul>
          <li>Condominios con certificación LEED</li>
          <li>Desarrollos con energía renovable</li>
          <li>Proyectos de agricultura urbana</li>
          <li>Ecoaldeas y comunidades sostenibles</li>
        </ul>
        
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>🌍 Invierte en el futuro</h4>
          <p>Las propiedades sostenibles tienen una demanda creciente y mejor performance financiero. Es una inversión inteligente para el planeta y tu bolsillo.</p>
          <a href="https://wa.me/51982664102?text=Me interesa la inversión eco-responsable" 
             style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            🌱 Explorar proyectos verdes
          </a>
        </div>
      `
    },
    
    article9: {
      title: "Mejores Ubicaciones: Guía de Inversión Inmobiliaria",
      content: `
        <h2>Mejores Ubicaciones: Guía de Inversión Inmobiliaria</h2>
        <img src="img/finanzas.jpeg" alt="Mejores Ubicaciones" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
        
        <p>La <strong>ubicación</strong> es el factor más importante en inversión inmobiliaria. Conoce las mejores zonas para invertir en Lima y provincias.</p>
        
        <h3>🏆 Top ubicaciones Lima:</h3>
        <ul>
          <li><strong>Chorrillos:</strong> Desarrollo costero y urbano</li>
          <li><strong>Villa El Salvador:</strong> Crecimiento acelerado</li>
          <li><strong>Lurín:</strong> Expansión industrial y residencial</li>
          <li><strong>Ancón:</strong> Turismo y segunda residencia</li>
        </ul>
        
        <h3>🌟 Provincias con potencial:</h3>
        <ol>
          <li><strong>Huacho:</strong> Capital regional en crecimiento</li>
          <li><strong>Chancay:</strong> Futuro puerto megapuerto</li>
          <li><strong>Barranca:</strong> Desarrollo agroindustrial</li>
          <li><strong>Cañete:</strong> Corredor sur en expansión</li>
        </ol>
        
        <h3>📊 Criterios de evaluación:</h3>
        <ul>
          <li>Proyectos de infraestructura planificados</li>
          <li>Crecimiento poblacional sostenido</li>
          <li>Desarrollo comercial e industrial</li>
          <li>Conectividad y transporte</li>
          <li>Servicios básicos disponibles</li>
        </ul>
        
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>🎯 Estrategia de ubicación</h4>
          <p>Invierte donde otros aún no han llegado pero donde el desarrollo es inevitable. Anticípate a las tendencias del mercado.</p>
          <a href="https://wa.me/51982664102?text=Quiero asesoría sobre las mejores ubicaciones" 
             style="display: inline-block; background-color: #FF9800; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            📍 Consultar ubicaciones
          </a>
        </div>
      `
    }
  };
  
  if (articles[articleId]) {
    modalContent.innerHTML = articles[articleId].content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del fondo
  }
}

// Cerrar modal
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('articleModal');
  const closeBtn = document.querySelector('.close-modal');
  
  // Cerrar con el botón X
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  // Cerrar al hacer clic fuera del modal
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  // Cerrar con la tecla Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});
