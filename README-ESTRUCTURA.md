# Urbaniza2 - Estructura del Proyecto

## 📁 Estructura Reorganizada

```
Urbaniza2peru-main/
├── public/                     # Sitio web público
│   ├── assets/
│   │   ├── css/               # Estilos del sitio web
│   │   ├── js/                # Scripts del sitio web
│   │   └── img/               # Imágenes del sitio web
│   ├── index.html             # Página principal
│   ├── nosotros.html          # Página nosotros
│   ├── servicios.html         # Página servicios
│   ├── terrenos.html          # Página terrenos
│   ├── blog.html              # Página blog
│   └── contacto.html          # Página contacto
├── Admin/                      # Panel administrativo
│   ├── api/                   # APIs del admin
│   ├── config/                # Configuraciones
│   ├── database/              # Scripts de base de datos
│   ├── uploads/               # Archivos subidos
│   ├── index.php              # Login del admin
│   ├── dashboard.php          # Dashboard principal
│   ├── terrenos.php           # Gestión de terrenos
│   ├── consultas.php          # Gestión de consultas
│   └── install.php            # Instalador
└── docs/                       # Documentación (opcional)
```

## 🚀 Cómo Ejecutar

### Sitio Web Público
```bash
# Desde la carpeta raíz del proyecto
php -S localhost:3000 -t public
```
**URL**: http://localhost:3000

### Panel Administrativo
```bash
# Desde la carpeta raíz del proyecto
php -S localhost:8080 -t Admin
```
**URL**: http://localhost:8080

## 📋 Ventajas de esta Estructura

### ✅ Separación Clara
- **public/**: Todo lo relacionado con el sitio web público
- **Admin/**: Todo lo relacionado con el panel administrativo
- **assets/**: Recursos organizados por tipo (css, js, img)

### ✅ Facilidad de Mantenimiento
- Archivos organizados por funcionalidad
- Rutas claras y predecibles
- Fácil localización de recursos

### ✅ Escalabilidad
- Estructura preparada para crecimiento
- Separación de responsabilidades
- Fácil adición de nuevas funcionalidades

### ✅ Seguridad
- Panel admin separado del sitio público
- Configuraciones aisladas
- Control de acceso independiente

## 🔧 Configuración de Servidores

### Desarrollo Local
- **Sitio Web**: Puerto 3000
- **Admin Panel**: Puerto 8080
- **Base de Datos**: MySQL (XAMPP)

### Producción (Recomendado)
- **Sitio Web**: Dominio principal (ej: urbaniza2.com)
- **Admin Panel**: Subdominio (ej: admin.urbaniza2.com)
- **SSL**: Certificados para ambos dominios

## 📝 Notas Importantes

1. **Rutas de Assets**: Los archivos HTML en `public/` usan rutas relativas a `assets/`
2. **Base de Datos**: El panel admin requiere configuración de MySQL
3. **Uploads**: Los archivos subidos se almacenan en `Admin/uploads/`
4. **Backups**: Respaldar tanto `public/` como `Admin/` regularmente

## 🔄 Migración desde Estructura Anterior

Si tienes la estructura anterior:
1. Los archivos HTML principales están ahora en `public/`
2. CSS, JS e imágenes están en `public/assets/`
3. El panel admin permanece en `Admin/`
4. Actualizar rutas en archivos HTML si es necesario

---

**Desarrollado para Urbaniza2 Inmobiliaria** 🏢