# Urbaniza2 - Panel Administrativo

Sistema de administración web para la gestión de terrenos, consultas y ventas de Urbaniza2 Inmobiliaria.

## 🚀 Características

- **Sistema de Login Seguro**: Autenticación con contraseñas encriptadas
- **Gestión de Terrenos**: CRUD completo para administrar propiedades
- **Gestión de Consultas**: Sistema de seguimiento de clientes interesados
- **Dashboard Interactivo**: Estadísticas y métricas en tiempo real
- **Diseño Responsive**: Compatible con dispositivos móviles y desktop
- **Base de Datos MySQL**: Estructura optimizada con relaciones

## 📋 Requisitos

- XAMPP (Apache + MySQL + PHP 7.4+)
- Navegador web moderno
- 50MB de espacio en disco

## 🛠️ Instalación

### 1. Configurar XAMPP

1. Descargar e instalar XAMPP desde [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Iniciar Apache y MySQL desde el panel de control de XAMPP

### 2. Configurar la Base de Datos

1. Abrir phpMyAdmin en: `http://localhost/phpmyadmin`
2. Ejecutar el script SQL ubicado en: `database/urbaniza2_admin.sql`
3. Esto creará la base de datos `urbaniza2_admin` con todas las tablas necesarias

### 3. Configurar el Proyecto

1. Copiar todos los archivos del proyecto a: `C:\xampp\htdocs\urbaniza2-admin\`
2. Verificar que el archivo `config/database.php` tenga la configuración correcta:
   ```php
   $host = 'localhost';
   $dbname = 'urbaniza2_admin';
   $username = 'root';
   $password = '';
   ```

### 4. Acceder al Sistema

1. Abrir el navegador y ir a: `http://localhost/urbaniza2-admin/`
2. Usar las credenciales por defecto:
   - **Usuario**: `admin`
   - **Contraseña**: `password`

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **admins**: Usuarios administradores del sistema
- **terrenos**: Información de propiedades disponibles
- **consultas**: Consultas de clientes interesados
- **ventas**: Registro de ventas realizadas
- **configuraciones**: Configuraciones del sistema

### Datos de Ejemplo

El sistema incluye datos de ejemplo basados en el sitio web original:
- 3 terrenos destacados (Chorrillos, Chancay, Végueta)
- Usuario administrador por defecto
- Configuraciones básicas del sistema

## 🎯 Funcionalidades

### Dashboard
- Estadísticas generales del negocio
- Últimas consultas recibidas
- Terrenos más consultados
- Métricas de ventas del mes

### Gestión de Terrenos
- Agregar nuevos terrenos
- Editar información existente
- Marcar como destacados
- Control de estados (disponible, reservado, vendido)
- Filtros y búsqueda avanzada

### Gestión de Consultas
- Ver todas las consultas de clientes
- Sistema de seguimiento por estados
- Notas del administrador
- Priorización de consultas
- Filtros por tipo y estado

### Sistema de Usuarios
- Login seguro con sesiones
- Diferentes roles de usuario
- Registro de actividad

## 🔧 Configuración Avanzada

### Cambiar Credenciales por Defecto

1. Ir a phpMyAdmin
2. Seleccionar la base de datos `urbaniza2_admin`
3. Ir a la tabla `admins`
4. Editar el registro del administrador
5. Para cambiar la contraseña, usar:
   ```php
   password_hash('nueva_contraseña', PASSWORD_DEFAULT)
   ```

### Personalizar Configuraciones

Las configuraciones del sistema se pueden modificar desde la tabla `configuraciones`:
- Nombre de la empresa
- Información de contacto
- Tasas de interés por defecto
- Configuraciones de financiamiento

## 🎨 Personalización

### Colores y Estilos
Los estilos están definidos en cada archivo PHP usando Bootstrap 5 y CSS personalizado. Para cambiar los colores principales, modificar las variables CSS en la sección `<style>` de cada archivo.

### Logo y Branding
- Cambiar el nombre "Urbaniza2" en el sidebar de cada página
- Agregar logo personalizado en la carpeta `assets/images/`
- Modificar los colores del gradiente en el CSS

## 📱 Responsive Design

El sistema está optimizado para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Seguridad

- Contraseñas encriptadas con `password_hash()`
- Protección contra SQL Injection con PDO
- Validación y sanitización de datos
- Control de sesiones seguras
- Verificación de permisos en cada página

## 🚀 Próximas Mejoras

- [ ] Sistema de reportes avanzados
- [ ] Integración con WhatsApp API
- [ ] Calculadora de financiamiento
- [ ] Gestión de documentos
- [ ] Sistema de notificaciones
- [ ] API REST para integración

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema, contactar al desarrollador.

## 📄 Licencia

Este proyecto está desarrollado específicamente para Urbaniza2 Inmobiliaria.

---

**Desarrollado con ❤️ para Urbaniza2 Inmobiliaria**