# Solución de Problemas con Expo CLI

## El problema que estás experimentando

Has recibido el siguiente mensaje al intentar ejecutar la aplicación:

```
WARNING: The legacy expo-cli does not support Node +17. Migrate to the new local Expo CLI: https://blog.expo.dev/the-new-expo-cli-f4250d8e3421.

The global expo-cli package has been deprecated.
The new Expo CLI is now bundled in your project in the expo package.
Learn more: https://blog.expo.dev/the-new-expo-cli-f4250d8e3421.

To use the local CLI instead (recommended in SDK 46 and higher), run:
› npx expo <command>
```

## Explicación del problema

Este mensaje indica que estás utilizando una versión antigua (legacy) del CLI de Expo que ya está **obsoleta** y no es compatible con Node.js versión 17 o superior.

Expo ha migrado desde una herramienta de línea de comandos global (`expo-cli`) a una versión local que viene incluida en cada proyecto dentro del paquete `expo`. Esta es una mejora porque:

1. Evita conflictos entre versiones de CLI y SDK
2. Permite que cada proyecto use la versión de CLI compatible con su SDK
3. Simplifica la instalación de dependencias

## Solución rápida

Para solucionar este problema inmediatamente, utiliza el siguiente comando en lugar del que has intentado:

```bash
npx expo start
```

En lugar de:

```bash
npx expo-cli start
# o
expo start
```

## Solución detallada por pasos

### 1. Desinstala la versión global obsoleta de Expo CLI

Es recomendable eliminar la versión global antigua para evitar confusiones:

**Windows (PowerShell o CMD)**
```powershell
npm uninstall -g expo-cli
```

**macOS/Linux**
```bash
npm uninstall -g expo-cli
# Si instalaste con permisos de superusuario anteriormente:
sudo npm uninstall -g expo-cli
```

### 2. Asegúrate de que tu proyecto tiene la versión correcta de Expo

Navega a la carpeta raíz del proyecto (`AstroGuia`) y ejecuta:

```bash
npm install expo@latest
# o si usas pnpm
pnpm install expo@latest
```

### 3. Verifica la versión de Node.js

La nueva CLI de Expo funciona bien con Node.js 16.x o superior, pero es importante verificar:

```bash
node --version
```

#### Si tu versión de Node.js es inferior a 16.x:

**Windows**:
1. Descarga e instala la última versión LTS desde [nodejs.org](https://nodejs.org/)
2. O utiliza NVM para Windows:
```powershell
nvm install 18.18.0
nvm use 18.18.0
```

**macOS/Linux**:
```bash
# Con NVM (Node Version Manager)
nvm install 18
nvm use 18

# O con Homebrew en macOS
brew update
brew install node@18
```

### 4. Inicia correctamente el proyecto

Una vez que todo esté actualizado, inicia el proyecto con:

```bash
npx expo start
```

## Diferencias entre CLI Global y Local

| Característica | CLI Global (Antiguo) | CLI Local (Nuevo) |
|----------------|---------------------|-------------------|
| Comando | `expo start` | `npx expo start` |
| Instalación | `npm install -g expo-cli` | Incluido en el paquete `expo` del proyecto |
| Compatibilidad con Node.js | Limitada (problemas con Node 17+) | Completa |
| Actualizaciones | Requiere actualización manual global | Se actualiza con el paquete `expo` del proyecto |
| Coherencia | Puede haber conflictos entre proyectos | Cada proyecto tiene su propia versión compatible |

## Soluciones para problemas específicos

### Error: "Command not found: expo"

Este error indica que no tienes instalada la CLI de Expo o que no está en el PATH:

**Solución**:
```bash
# No es necesario instalarla globalmente, mejor usa:
npx expo start
```

### Error: "Unable to find expo in this project"

Este error sugiere que el paquete `expo` no está instalado en tu proyecto:

**Solución**:
```bash
npm install expo
# o
pnpm install expo
```

### Error: "Failed to resolve hostname"

Si tienes problemas de conexión entre tu dispositivo y el servidor de desarrollo:

**Solución**:
```bash
npx expo start --tunnel
```

Esto utilizará ngrok para crear un túnel seguro entre tu ordenador y el dispositivo.

## Instrucciones específicas por sistema operativo

### Windows

Si estás usando Windows y experimentas problemas adicionales:

1. Verifica que no haya conflictos con software de seguridad o VPN
2. Asegúrate de ejecutar PowerShell o CMD como administrador si es necesario
3. Si tienes problemas con la ejecución de scripts:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```

### macOS

Para usuarios de macOS:

1. Si tienes problemas de permisos:
   ```bash
   sudo chown -R $USER ~/.npm
   sudo chown -R $USER ~/Library/Caches/npm
   ```
2. Verifica que no hay conflictos con Gatekeeper:
   ```bash
   xattr -d com.apple.quarantine /path/to/downloaded/files
   ```

### Linux

Para usuarios de Linux:

1. Asegúrate de tener las bibliotecas necesarias:
   ```bash
   sudo apt update
   sudo apt install -y libvips-dev
   ```
2. Si tienes problemas de permisos:
   ```bash
   mkdir -p ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
   source ~/.profile
   ```

## Verificación de la configuración

Para asegurarte de que tu entorno está correctamente configurado, puedes ejecutar:

```bash
npx expo diagnostics
```

Esto mostrará información detallada sobre tu entorno, incluyendo:
- Versiones de Node.js, npm, y Expo
- Configuración del proyecto
- Problemas detectados

## Recursos adicionales

- [Blog oficial sobre la nueva Expo CLI](https://blog.expo.dev/the-new-expo-cli-f4250d8e3421)
- [Documentación de Expo sobre la migración](https://docs.expo.dev/more/expo-cli/)
- [Foro de ayuda de Expo](https://forums.expo.dev/)

Si sigues experimentando problemas después de intentar estas soluciones, por favor proporciona detalles adicionales sobre tu entorno (sistema operativo, versiones de Node.js y npm, etc.) para poder ofrecerte una asistencia más específica.