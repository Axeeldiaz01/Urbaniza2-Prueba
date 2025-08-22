<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation - Urbaniza2</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .endpoint { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .method { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .get { background: #28a745; color: white; }
        .post { background: #007bff; color: white; }
        code { background: #e9ecef; padding: 2px 4px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container mt-4">
        <h1>API Documentation - Urbaniza2</h1>
        <p class="lead">Documentación de la API para integrar el sitio web con el panel administrativo</p>
        
        <h2>Base URL</h2>
        <code>http://localhost:8080/api/</code>
        
        <h2>Endpoints Disponibles</h2>
        
        <div class="endpoint">
            <h3><span class="method get">GET</span> /terrenos.php</h3>
            <p><strong>Descripción:</strong> Obtiene la lista de terrenos disponibles</p>
            <p><strong>Parámetros:</strong></p>
            <ul>
                <li><code>action</code> (opcional): 
                    <ul>
                        <li><code>list</code> - Todos los terrenos disponibles (default)</li>
                        <li><code>featured</code> - Terrenos destacados (últimos 6)</li>
                        <li><code>detail</code> - Detalle de un terreno específico (requiere <code>id</code>)</li>
                    </ul>
                </li>
                <li><code>id</code> (requerido para action=detail): ID del terreno</li>
            </ul>
            <p><strong>Ejemplo:</strong></p>
            <code>GET /api/terrenos.php?action=featured</code>
            <p><strong>Respuesta:</strong></p>
            <pre><code>{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Terreno en Chorrillos",
      "ubicacion": "Chorrillos, Lima",
      "area": "200.00",
      "precio": "120000.00",
      "descripcion": "Excelente terreno...",
      "estado": "disponible",
      "imagen": "terreno-chorrillos.jpg"
    }
  ]
}</code></pre>
        </div>
        
        <div class="endpoint">
            <h3><span class="method post">POST</span> /consultas.php</h3>
            <p><strong>Descripción:</strong> Recibe consultas desde el sitio web</p>
            <p><strong>Body (JSON):</strong></p>
            <pre><code>{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "999999999",
  "mensaje": "Estoy interesado en el terreno..."
}</code></pre>
            <p><strong>Respuesta:</strong></p>
            <pre><code>{
  "success": true,
  "message": "Consulta enviada exitosamente. Te contactaremos pronto."
}</code></pre>
        </div>
        
        <h2>Código JavaScript para el Sitio Web</h2>
        <p>Ejemplo de cómo usar la API desde tu sitio web:</p>
        
        <h3>Obtener terrenos destacados:</h3>
        <pre><code>// Obtener terrenos destacados
async function loadFeaturedTerrenos() {
    try {
        const response = await fetch('http://localhost:8080/api/terrenos.php?action=featured');
        const data = await response.json();
        
        if (data.success) {
            displayTerrenos(data.data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Mostrar terrenos en el HTML
function displayTerrenos(terrenos) {
    const container = document.getElementById('terrenos-container');
    container.innerHTML = '';
    
    terrenos.forEach(terreno => {
        const terrenoHTML = `
            &lt;div class="terreno-card"&gt;
                &lt;h3&gt;${terreno.nombre}&lt;/h3&gt;
                &lt;p&gt;S/ ${parseFloat(terreno.precio).toLocaleString()}&lt;/p&gt;
                &lt;p&gt;${terreno.ubicacion}&lt;/p&gt;
                &lt;p&gt;${terreno.area} m²&lt;/p&gt;
            &lt;/div&gt;
        `;
        container.innerHTML += terrenoHTML;
    });
}</code></pre>
        
        <h3>Enviar consulta:</h3>
        <pre><code>// Enviar consulta
async function sendConsulta(formData) {
    try {
        const response = await fetch('http://localhost:8080/api/consultas.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(data.message);
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar la consulta');
    }
}

// Ejemplo de uso con un formulario
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        mensaje: document.getElementById('mensaje').value
    };
    
    sendConsulta(formData);
});</code></pre>
        
        <h2>Configuración CORS</h2>
        <p>La API está configurada para permitir solicitudes desde:</p>
        <ul>
            <li><code>https://www.urbaniza2peru.com</code></li>
            <li><code>http://localhost:3000</code> (para desarrollo)</li>
        </ul>
        
        <h2>Notas Importantes</h2>
        <ul>
            <li>Todas las respuestas están en formato JSON</li>
            <li>Los errores se devuelven con <code>success: false</code></li>
            <li>Las consultas se guardan automáticamente en el panel administrativo</li>
            <li>Cambiar la URL base cuando muevas el panel a producción</li>
        </ul>
    </div>
</body>
</html>