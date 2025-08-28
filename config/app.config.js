// Configuración centralizada de la aplicación Urbaniza2
const AppConfig = {
  // URLs de la aplicación
  urls: {
    main: 'http://localhost:3000',
    admin: 'http://localhost:8080',
    api: 'http://localhost:8080/api'
  },

  // Rutas de assets
  assets: {
    css: 'assets/css/',
    js: 'assets/js/',
    img: 'assets/img/',
    uploads: 'uploads/'
  },

  // Configuración de la base de datos (para referencia)
  database: {
    host: 'localhost',
    name: 'urbaniza2_admin',
    charset: 'utf8mb4'
  },

  // Configuración de WhatsApp
  whatsapp: {
    number: '+51987654321',
    message: 'Hola, estoy interesado en sus terrenos'
  },

  // Configuración de email
  email: {
    from: 'info@urbaniza2.com',
    subject: 'Consulta desde Urbaniza2'
  },

  // Configuración de la aplicación
  app: {
    name: 'Urbaniza2',
    version: '1.0.0',
    description: 'Sistema de gestión inmobiliaria'
  }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppConfig;
} else {
  window.AppConfig = AppConfig;
}