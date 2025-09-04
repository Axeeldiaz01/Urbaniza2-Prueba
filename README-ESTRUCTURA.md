# Estructura del Proyecto Urbaniza2

## Descripción General
Este proyecto contiene un sistema inmobiliario con frontend público y panel administrativo.

## Estructura de Directorios

```
Urbaniza2peru-main/
├── config/                     # Configuraciones centralizadas
│   ├── app.config.js          # Configuración JavaScript
│   └── app.config.php         # Configuración PHP
├── public/                     # Frontend público (Puerto 3000)
│   ├── assets/                 # Recursos estáticos
│   │   ├── css/               # Hojas de estilo
│   │   ├── js/                # Scripts JavaScript
│   │   └── img/               # Imágenes
│   ├── uploads/               # Imágenes de terrenos (público)
│   ├── index.html             # Página principal
│   ├── nosotros.html          # Página nosotros
│   ├── servicios.html         # Página servicios
│   ├── terrenos.html          # Página terrenos
│   ├── blog.html              # Página blog
│   └── contacto.html          # Página contacto
├── Admin/                      # Panel administrativo (Puerto 8080)
│   ├── views/                 # Vistas del admin
│   │   ├── dashboard.php      # Panel principal
│   │   ├── terrenos.php       # Gestión de terrenos
│   │   ├── consultas.php      # Gestión de consultas
│   │   └── solicitudes_compra.php # Gestión de compras
│   ├── controllers/           # Controladores (vacío por ahora)
│   ├── models/                # Modelos (vacío por ahora)
│   ├── assets/                # Assets del admin (vacío por ahora)
│   ├── api/                   # APIs REST
│   │   ├── terrenos.php       # API de terrenos
│   │   ├── consultas.php      # API de consultas
│   │   └── compras.php        # API de compras
│   ├── config/                # Configuraciones del admin
│   │   ├── database.php       # Conexión a BD
│   │   └── integration.php    # Integración
│   ├── database/              # Scripts de BD
│   ├── uploads/               # Imágenes de terrenos (admin)
│   ├── index.php              # Login del admin
│   ├── install.php            # Instalador
│   └── logout.php             # Cerrar sesión
└── .vscode/                    # Configuración de VS Code

```

## Servidores

### Frontend Público (Puerto 3000)
- **URL**: http://localhost:3000
- **Comando**: `npx http-server public -p 3000`
- **Descripción**: Sitio web público para clientes

### Panel Administrativo (Puerto 8080)
- **URL**: http://localhost:8080
- **Comando**: `C:\xampp\php\php.exe -S localhost:8080 -t Admin`
- **Descripción**: Panel de administración para gestionar terrenos y consultas

## Características de la Nueva Estructura

### ✅ Mejoras Implementadas
1. **Eliminación de duplicados**: Se removieron archivos HTML, CSS, JS e imágenes duplicados
2. **Centralización de assets**: Todos los recursos están en `public/assets/`
3. **Configuración centralizada**: Archivos de configuración en carpeta `config/`
4. **Mejor organización del Admin**: Separación en views, controllers, models
5. **Estructura escalable**: Preparada para futuras mejoras

### 🔧 Beneficios
- **Mantenimiento más fácil**: Un solo lugar para cada tipo de archivo
- **Menos bugs**: Eliminación de inconsistencias entre duplicados
- **Escalabilidad**: Estructura preparada para crecimiento
- **Claridad**: Separación clara entre frontend y backend

## Próximos Pasos Recomendados

1. **Implementar MVC completo**: Mover lógica a controllers y models
2. **Optimizar assets**: Minificar CSS y JS para producción
3. **Implementar cache**: Para mejorar rendimiento
4. **Añadir tests**: Para garantizar calidad del código
5. **Documentar APIs**: Para facilitar integraciones futuras

## Comandos Útiles

```bash
# Iniciar ambos servidores
.\start-servers.ps1

# Solo frontend
npx http-server public -p 3000

# Solo admin
C:\xampp\php\php.exe -S localhost:8080 -t Admin
```

## Notas Importantes

- Los archivos de configuración están centralizados en `/config/`
- Las imágenes de terrenos se sincronizan entre `Admin/uploads/` y `public/uploads/`
- La estructura está preparada para implementar un patrón MVC completo
- Todos los assets están organizados por tipo en `public/assets/`