# Urbaniza2 Inmobiliaria

Bienvenido al repositorio de la página web de Urbaniza2. Si vas a modificar o actualizar la web, sigue estas recomendaciones para mantener el orden y facilitar la revisión y publicación de los cambios.

## ¿Cómo subir tus cambios al repositorio?

1. **Descarga el proyecto**  
   Si no tienes acceso al repositorio privado, puedes descargar el proyecto como ZIP desde la página de GitHub:
   - Ve a https://github.com/vaya-valla-publicidad/Urbaniza2
   - Haz clic en el botón "Code" y luego en "Download ZIP".
   - Descomprime el archivo en tu computadora.

   Si tienes acceso al repositorio, puedes usar:
   ```
   git clone https://github.com/vaya-valla-publicidad/Urbaniza2.git
   ```

2. **Asegúrate de tener los últimos cambios**  
   Antes de modificar cualquier archivo, ejecuta:
   ```
   git pull
   ```
   Esto descargará la versión más reciente del proyecto.

3. **Haz tus modificaciones**  
   Mantén el orden de los archivos y carpetas. Si agregas nuevos archivos, colócalos en la carpeta correspondiente (`css`, `img`, `js`, etc.).

## Flujo de trabajo colaborativo (Pull Request)

Para que tus cambios sean revisados antes de ser publicados en la web, sigue este proceso:

1. **Crea una rama nueva para tus cambios**
   ```
   git checkout -b nombre-de-tu-rama
   ```

2. **Haz tus modificaciones y sigue los pasos anteriores para agregar y commitear tus cambios.**

3. **Sube tu rama al repositorio**
   ```
   git push origin nombre-de-tu-rama
   ```

4. **Crea una Pull Request en GitHub**
   - Ve al repositorio en GitHub.
   - Haz clic en "Compare & pull request" o en "New pull request".
   - Describe los cambios realizados y solicita la revisión.

5. **Revisión y aprobación**
   - El administrador revisará tu Pull Request y, si todo está correcto, lo integrará a la rama principal.

## Recomendaciones

- **No borres ni renombres archivos importantes sin consultar.**
- **Describe claramente tus cambios en el mensaje del commit.**
- **Si tienes dudas, consulta antes de subir cambios grandes.**
- **Usa `git pull` antes de empezar a trabajar para evitar conflictos.**
