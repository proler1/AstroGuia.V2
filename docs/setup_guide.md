# Guía de Configuración y Ejecución de AstroGuía

Esta guía te ayudará a configurar y ejecutar la aplicación AstroGuía después de descargar el código fuente en formato ZIP e importarlo a Visual Studio Code.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** - Versión 16.x o superior
   - [Descarga Node.js](https://nodejs.org/es/download/)
   - Verifica la instalación: `node --version`

2. **npm** (viene con Node.js) o **pnpm** (recomendado)
   - Para instalar pnpm: `npm install -g pnpm`
   - Verifica la instalación: `pnpm --version`

3. **Expo CLI**
   - Instala globalmente: `npm install -g expo-cli`
   - Verifica la instalación: `expo --version`

4. **Git** (opcional, pero recomendado)
   - [Descarga Git](https://git-scm.com/downloads)
   - Verifica la instalación: `git --version`

5. **Expo Go** en tu dispositivo móvil
   - [iOS App Store](https://apps.apple.com/es/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Configuración del Proyecto

### Paso 1: Extraer e Importar el ZIP

1. Extrae el archivo ZIP que has descargado en una ubicación de tu elección.
2. Abre Visual Studio Code.
3. Selecciona `File > Open Folder` (o `Archivo > Abrir Carpeta`) y navega hasta la carpeta extraída `AstroGuia`.

### Paso 2: Instalar Dependencias

1. Abre una terminal en VS Code:
   - Menú `Terminal > New Terminal` (o `Terminal > Nuevo Terminal`)
   - O presiona `Ctrl+` ` (backtick)

2. Ejecuta uno de los siguientes comandos para instalar todas las dependencias:
   
   ```bash
   # Si usas npm
   npm install

   # Si usas pnpm (recomendado por ser más rápido)
   pnpm install
   ```

   ![Instalación de dependencias](https://mockups.metadl.com/astroguia/setup/install_deps.png)

   > ⚠️ **Nota:** La instalación puede tardar varios minutos dependiendo de tu conexión a Internet.

### Paso 3: Configuración de Variables de Entorno

1. En la raíz del proyecto, busca el archivo `.env.example`.
2. Crea una copia de este archivo y renómbrala a `.env`:

   ```bash
   # En sistemas Unix (macOS/Linux)
   cp .env.example .env

   # En Windows
   copy .env.example .env
   ```

3. Abre el archivo `.env` y completa las variables requeridas (si hay alguna).
   - Por defecto, la app puede funcionar con los valores predeterminados para pruebas.

## Ejecución de la Aplicación

### Opción 1: Ejecutar con Expo (Recomendado)

1. En la terminal de VS Code, ejecuta:

   ```bash
   # Con npm
   npx expo start

   # Con pnpm
   pnpm expo start
   ```

2. Se abrirá una ventana del navegador con el panel de control de Expo y aparecerá un código QR en la terminal:

   ![Código QR de /images/QRCode.jpg)

3. **Para dispositivos iOS:**
   - Abre la cámara de tu iPhone y apunta al código QR.
   - Toca la notificación para abrir en Expo Go.

4. **Para dispositivos Android:**
   - Abre la aplicación Expo Go.
   - Presiona "Scan QR Code" y apunta al código QR.

> ⚠️ **Importante:** Tu ordenador y tu dispositivo móvil deben estar en la misma red WiFi para que funcione correctamente.

### Opción 2: Ejecutar en el Navegador Web

Si no tienes un dispositivo móvil a mano, puedes ejecutar una versión web:

1. En la terminal, ejecuta:

   ```bash
   # Con npm
   npx expo start --web

   # Con pnpm
   pnpm expo start --web
   ```

2. Expo abrirá automáticamente una pestaña en tu navegador con la versión web de la aplicación.

   > ⚠️ **Nota:** Algunas funcionalidades específicas de dispositivos móviles pueden no estar disponibles en la versión web.

## Solución de Problemas Comunes

### Error: "Unable to find Expo"

```
Si ves este error:
Error: Unable to find Expo in this project - have you run "npm install"?
```

**Solución:**
```bash
npm install expo
# O
pnpm install expo
```

### Error de Metro Bundler (Puerto en uso)

```
Error: Cannot start server.
Error: Metro is already running on port 8081
```

**Solución:**
```bash
# Mata el proceso que usa el puerto 8081
npx kill-port 8081
# Y vuelve a iniciar expo
npx expo start
```

### Errores de conexión al escanear el código QR

1. **Verifica que ambos dispositivos estén en la misma red WiFi.**

2. **Usa la conexión por túnel:**
   ```bash
   npx expo start --tunnel
   ```
   Esto utiliza ngrok para establecer una conexión túnel.

3. **Usa una dirección IP específica:**
   ```bash
   npx expo start --host [tu-dirección-IP]
   ```
   Puedes encontrar tu dirección IP con `ipconfig` (Windows) o `ifconfig` (Mac/Linux).

### Errores específicos por sistema operativo

#### Windows

- **PowerShell restricciones de ejecución:**
  Si PowerShell no te permite ejecutar scripts, abre PowerShell como administrador y ejecuta:
  ```powershell
  Set-ExecutionPolicy RemoteSigned
  ```

#### macOS

- **Problemas de permisos:**
  ```bash
  sudo chown -R $USER ~/.npm
  sudo chown -R $USER ~/Library/Caches/npm
  ```

#### Linux

- **Permisos para acceso a puertos:**
  ```bash
  sudo apt-get install -y libvips
  ```

## Ejecución en diferentes entornos

### Desarrollo (con recarga en vivo)

```bash
# Modo desarrollo estándar
npx expo start

# Con depuración
npx expo start --debug
```

### Previsualización de producción

```bash
npx expo start --no-dev --minify
```

### Ejecutar en un simulador/emulador

```bash
# iOS Simulator (solo macOS)
npx expo start --ios

# Android Emulator
npx expo start --android
```

## Acceso a la Aplicación una vez Iniciada

Una vez que la aplicación está cargada en tu dispositivo mediante Expo Go, verás:

1. La pantalla de bienvenida de AstroGuía
2. Opciones para iniciar sesión o registrarte
3. Para fines de demostración, puedes usar:
   - Email: `demo@astroguia.app`
   - Contraseña: `demo1234`

## Consejos Adicionales

- **Modo offline de Expo:** Si has ejecutado la aplicación anteriormente, Expo Go puede cargar una versión en caché incluso sin conexión.

- **Depuración remota:** Agita el dispositivo o presiona `Cmd+D` (iOS) o `Ctrl+M` (Android) para abrir el menú de desarrollador.

- **Inspector de Elementos:** Dentro del menú de desarrollador, puedes activar el inspector de elementos para examinar componentes.

- **Conexión por cable (alternativa al WiFi):**
  - Para Android: Activa la depuración USB y conecta el dispositivo.
  - Para iOS: Es más complicado y requiere XCode.

## Recursos Adicionales

- **Documentación oficial de Expo**: [docs.expo.dev](https://docs.expo.dev/)
- **Foro de ayuda de Expo**: [forums.expo.dev](https://forums.expo.dev/)
- **React Native en Discord**: [reactnative.dev/discord](https://reactnative.dev/discord)
- **Reportar problemas con AstroGuía**: [issues@astroguia.app](mailto:issues@astroguia.app)

---

Si sigues estos pasos, deberías poder ejecutar AstroGuía en tu dispositivo móvil. Si encuentras algún problema no cubierto en esta guía, no dudes en contactar con nuestro equipo de soporte.