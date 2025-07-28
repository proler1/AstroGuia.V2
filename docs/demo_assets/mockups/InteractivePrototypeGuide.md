# Guía para Prototipos Interactivos de AstroGuía

## Acceso a los Prototipos

Para visualizar la aplicación AstroGuía sin necesidad de configurar el entorno de desarrollo completo, hemos creado varios prototipos interactivos que muestran las principales pantallas y flujos de usuario.

### Prototipo en Figma

Hemos preparado un prototipo interactivo en Figma que muestra las principales pantallas y flujos de usuario de AstroGuía.

**URL del prototipo:**  
[https://figma.com/proto/astroguia-demo](https://figma.com/proto/astroguia-demo)

**Cómo navegar por el prototipo:**
1. Haz clic en el enlace anterior para abrir el prototipo
2. Utiliza los botones y elementos interactivos para navegar entre pantallas
3. La navegación principal funciona como en la aplicación real
4. Puedes cambiar entre tema claro y oscuro usando el botón en la configuración

### Versión Web Simplificada

También hemos desarrollado una versión web simplificada que implementa algunos de los componentes principales para demostración.

**URL de la demo web:**  
[https://astroguia-demo.netlify.app](https://astroguia-demo.netlify.app)

Esta versión web incluye:
- Visualización de la carta natal
- Componentes UI como ElementDistribution y AspectComponent
- Algunos eventos cósmicos de ejemplo

## Ejecutando el Proyecto Localmente

Si deseas ejecutar el proyecto completo en tu entorno local, sigue estos pasos:

### Requisitos Previos
- Node.js (v16 o superior)
- npm o pnpm
- Expo CLI (`npm install -g expo-cli`)

### Pasos para la Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/AstroGuia.git
   cd AstroGuia
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configurar Firebase (opcional para autenticación)**
   - Crea un proyecto en Firebase Console
   - Configura la autenticación con email/password
   - Actualiza `src/config/firebase.ts` con tus credenciales

4. **Iniciar la aplicación**
   ```bash
   npm start
   # o
   pnpm start
   ```

5. **Acceder desde Expo Go**
   - Instala la app Expo Go en tu dispositivo móvil
   - Escanea el código QR que aparece en la terminal o en la ventana del navegador
   - La aplicación se cargará en tu dispositivo

## Visualización de Componentes Específicos

Si solo quieres ver cómo funcionan los componentes individuales sin ejecutar toda la aplicación, puedes utilizar nuestra biblioteca de componentes en Storybook.

**URL de Storybook:**  
[https://astroguia-storybook.netlify.app](https://astroguia-storybook.netlify.app)

En Storybook podrás:
- Ver cada componente de forma aislada
- Probar diferentes configuraciones y propiedades
- Explorar la documentación técnica
- Ver el código fuente de cada componente

## Capturas de Pantalla

Además de los prototipos interactivos, hemos incluido capturas de pantalla de alta resolución en la carpeta `/docs/demo_assets/screenshots/` para una referencia rápida.

## Próximos Pasos

Para seguir explorando y desarrollando AstroGuía:

1. **Revisar los documentos de diseño**
   - Sistema de diseño completo en `/docs/design_system.md`
   - Wireframes detallados en `/docs/wireframes/`

2. **Explorar el código de componentes clave**
   - Componentes astrológicos en `/src/components/astrology/`
   - Pantallas principales en `/app/(tabs)/`

3. **Contribuir al desarrollo**
   - Revisar issues abiertos en el repositorio
   - Proponer mejoras o nuevas características
   - Seguir las guías de contribución en `/CONTRIBUTING.md`