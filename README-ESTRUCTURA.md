# Estructura del Proyecto Urbaniza2

## Descripción General
Este proyecto contiene el sitio web estático de Urbaniza2 Inmobiliaria.  
Incluye páginas públicas en HTML, estilos CSS, scripts JS y recursos gráficos.

## Estructura de Directorios

```
Urbaniza2-main/
├── public/
│   ├── assets/
│   │   ├── css/         # Hojas de estilo
│   │   ├── js/          # Scripts JavaScript
│   │   └── img/         # Imágenes
│   ├── uploads/         # Imágenes de terrenos (opcional)
│   ├── index.html       # Página principal
│   ├── nosotros.html    # Página nosotros
│   ├── servicios.html   # Página servicios
│   ├── terrenos.html    # Página terrenos
│   ├── blog.html        # Página blog
│   └── contacto.html    # Página contacto
└── README-ESTRUCTURA.md
```

## Características de la Estructura

- **Sitio 100% estático:** No requiere base de datos ni backend.
- **Centralización de assets:** Todos los recursos están en `public/assets/`.
- **Fácil mantenimiento:** Solo archivos HTML, CSS, JS e imágenes.
- **Escalable:** Puedes agregar nuevas páginas HTML o recursos fácilmente.

## Comandos Útiles

```bash
# Servir el sitio localmente (requiere Node.js y http-server)
npx http-server public -p 3000
```

## Notas Importantes

- Sube únicamente los archivos de la carpeta `public` a tu hosting para publicar la web.
- No se requiere configuración de base de datos ni archivos PHP.
- Todos los cambios se realizan directamente en los archivos HTML,