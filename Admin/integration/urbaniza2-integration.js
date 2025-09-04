/**
 * Urbaniza2 Integration Library
 * Biblioteca para integrar urbaniza2peru.com con el panel administrativo
 * 
 * Uso:
 * 1. Incluir este archivo en tu sitio web
 * 2. Configurar la URL de tu panel administrativo
 * 3. Usar las funciones disponibles
 */

class Urbaniza2Integration {
    constructor(config = {}) {
        // Configuración por defecto
        this.config = {
            apiBaseUrl: config.apiBaseUrl || 'https://admin.urbaniza2peru.com/api', // Cambiar por tu dominio
            apiKey: config.apiKey || 'urbaniza2_secret_2025', // Tu clave secreta
            timeout: config.timeout || 10000,
            debug: config.debug || false
        };
        
        this.log('Urbaniza2 Integration inicializada', this.config);
    }
    
    /**
     * Función de logging para debug
     */
    log(message, data = null) {
        if (this.config.debug) {
            console.log('[Urbaniza2]', message, data);
        }
    }
    
    /**
     * Función para hacer peticiones HTTP con manejo de errores
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.config.apiBaseUrl}/${endpoint}`;
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.config.apiKey
            },
            timeout: this.config.timeout
        };
        
        const requestOptions = { ...defaultOptions, ...options };
        
        this.log(`Haciendo petición a: ${url}`, requestOptions);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            
            const response = await fetch(url, {
                ...requestOptions,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.log('Respuesta recibida:', data);
            
            return data;
        } catch (error) {
            this.log('Error en petición:', error);
            throw error;
        }
    }
    
    /**
     * Obtener todos los terrenos disponibles
     */
    async getTerrenos(filters = {}) {
        try {
            const params = new URLSearchParams(filters);
            const endpoint = `terrenos.php?${params.toString()}`;
            return await this.makeRequest(endpoint);
        } catch (error) {
            console.error('Error al obtener terrenos:', error);
            return { success: false, message: 'Error al cargar terrenos', data: [] };
        }
    }
    
    /**
     * Obtener terrenos destacados
     */
    async getFeaturedTerrenos() {
        return await this.getTerrenos({ action: 'featured' });
    }
    
    /**
     * Obtener un terreno específico por ID
     */
    async getTerreno(id) {
        try {
            return await this.makeRequest(`terrenos.php?action=get&id=${id}`);
        } catch (error) {
            console.error('Error al obtener terreno:', error);
            return { success: false, message: 'Error al cargar terreno' };
        }
    }
    
    /**
     * Buscar terrenos por criterios
     */
    async searchTerrenos(criteria) {
        const filters = {
            action: 'search',
            ...criteria
        };
        return await this.getTerrenos(filters);
    }
    
    /**
     * Enviar consulta de contacto
     */
    async sendConsulta(consultaData) {
        try {
            const response = await this.makeRequest('consultas.php', {
                method: 'POST',
                body: JSON.stringify({
                    ...consultaData,
                    fecha: new Date().toISOString(),
                    origen: 'website'
                })
            });
            
            return response;
        } catch (error) {
            console.error('Error al enviar consulta:', error);
            return { 
                success: false, 
                message: 'Error al enviar consulta. Por favor intenta nuevamente.' 
            };
        }
    }
    
    /**
     * Renderizar lista de terrenos en un contenedor
     */
    renderTerrenos(terrenos, containerId, template = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor ${containerId} no encontrado`);
            return;
        }
        
        if (!terrenos || terrenos.length === 0) {
            container.innerHTML = '<p class="no-terrenos">No hay terrenos disponibles en este momento.</p>';
            return;
        }
        
        let html = '';
        
        terrenos.forEach(terreno => {
            if (template && typeof template === 'function') {
                html += template(terreno);
            } else {
                html += this.defaultTerrenoTemplate(terreno);
            }
        });
        
        container.innerHTML = html;
    }
    
    /**
     * Template por defecto para mostrar terrenos
     */
    defaultTerrenoTemplate(terreno) {
        return `
            <div class="terreno-item" data-id="${terreno.id}">
                <div class="terreno-image">
                    ${terreno.imagen ? 
                        `<img src="${this.config.apiBaseUrl}/../uploads/${terreno.imagen}" alt="${terreno.nombre}" loading="lazy">` : 
                        '<div class="no-image">Sin imagen</div>'
                    }
                </div>
                <div class="terreno-info">
                    <h3 class="terreno-title">${terreno.nombre}</h3>
                    <p class="terreno-price">S/ ${parseFloat(terreno.precio).toLocaleString()}</p>
                    <p class="terreno-location">📍 ${terreno.ubicacion}</p>
                    <p class="terreno-area">📐 ${terreno.area} m²</p>
                    <p class="terreno-description">${terreno.descripcion}</p>
                    <span class="terreno-status status-${terreno.estado.toLowerCase()}">${terreno.estado}</span>
                    <button class="btn-contact" onclick="urbaniza2.showContactForm(${terreno.id})">
                        Más información
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Mostrar formulario de contacto para un terreno específico
     */
    showContactForm(terrenoId = null) {
        // Esta función puede ser personalizada según tu diseño
        const modal = document.createElement('div');
        modal.className = 'urbaniza2-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3>Solicitar información</h3>
                <form id="urbaniza2-contact-form">
                    <input type="hidden" id="terreno_id" value="${terrenoId || ''}">
                    <div class="form-group">
                        <label for="nombre">Nombre completo *</label>
                        <input type="text" id="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono</label>
                        <input type="tel" id="telefono">
                    </div>
                    <div class="form-group">
                        <label for="mensaje">Mensaje *</label>
                        <textarea id="mensaje" required placeholder="Estoy interesado en este terreno..."></textarea>
                    </div>
                    <button type="submit">Enviar consulta</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Manejar envío del formulario
        document.getElementById('urbaniza2-contact-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                terreno_id: document.getElementById('terreno_id').value,
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                mensaje: document.getElementById('mensaje').value
            };
            
            const result = await this.sendConsulta(formData);
            
            if (result.success) {
                alert('✅ Consulta enviada correctamente. Te contactaremos pronto.');
                modal.remove();
            } else {
                alert('❌ ' + result.message);
            }
        });
    }
    
    /**
     * Inicializar widgets automáticamente
     */
    initWidgets() {
        // Widget de terrenos destacados
        const featuredContainer = document.querySelector('[data-urbaniza2="featured"]');
        if (featuredContainer) {
            this.loadFeaturedTerrenos(featuredContainer.id);
        }
        
        // Widget de búsqueda
        const searchForms = document.querySelectorAll('[data-urbaniza2="search"]');
        searchForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const criteria = Object.fromEntries(formData);
                const results = await this.searchTerrenos(criteria);
                
                const resultsContainer = form.dataset.results;
                if (resultsContainer && results.success) {
                    this.renderTerrenos(results.data, resultsContainer);
                }
            });
        });
        
        // Formularios de contacto
        const contactForms = document.querySelectorAll('[data-urbaniza2="contact"]');
        contactForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const consultaData = Object.fromEntries(formData);
                
                const result = await this.sendConsulta(consultaData);
                
                if (result.success) {
                    form.reset();
                    // Mostrar mensaje de éxito
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message';
                    successMsg.textContent = 'Consulta enviada correctamente';
                    form.appendChild(successMsg);
                    
                    setTimeout(() => successMsg.remove(), 5000);
                } else {
                    // Mostrar mensaje de error
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = result.message;
                    form.appendChild(errorMsg);
                    
                    setTimeout(() => errorMsg.remove(), 5000);
                }
            });
        });
    }
    
    /**
     * Cargar terrenos destacados en un contenedor específico
     */
    async loadFeaturedTerrenos(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Mostrar loading
        container.innerHTML = '<div class="loading">Cargando terrenos...</div>';
        
        try {
            const response = await this.getFeaturedTerrenos();
            if (response.success) {
                this.renderTerrenos(response.data, containerId);
            } else {
                container.innerHTML = '<div class="error">Error al cargar terrenos</div>';
            }
        } catch (error) {
            container.innerHTML = '<div class="error">Error de conexión</div>';
        }
    }
}

// Crear instancia global
window.urbaniza2 = new Urbaniza2Integration({
    debug: true // Cambiar a false en producción
});

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.urbaniza2.initWidgets();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Urbaniza2Integration;
}