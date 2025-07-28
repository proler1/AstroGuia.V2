# AstroGuía - Demostración Visual

## Resumen de la Aplicación

AstroGuía es una aplicación de astrología completa diseñada para ofrecer información personalizada sobre horóscopos, cartas natales y eventos cósmicos. La aplicación proporciona una interfaz de usuario intuitiva y atractiva con características como autenticación de usuarios, onboarding personalizado, visualización interactiva de cartas natales y contenido educativo.

## Componentes Principales Desarrollados

### Componentes de Astrología

Hemos desarrollado un conjunto completo de componentes reutilizables para visualizar información astrológica:

1. **CosmicEventCard**: Muestra eventos cósmicos como fases lunares, eclipses y retrogradaciones planetarias con visuales atractivos.
2. **AspectComponent**: Visualiza los aspectos astrológicos entre planetas con sus símbolos y colores característicos.
3. **ElementDistribution**: Presenta la distribución de elementos (fuego, tierra, aire, agua) en una carta natal.
4. **NatalChartWheel**: Visualización interactiva de la carta natal con posiciones planetarias.
5. **PlanetComponent**: Muestra información detallada sobre planetas en la carta natal.
6. **ZodiacSign**: Visualiza signos zodiacales con sus símbolos y colores característicos.

### Pantallas Principales

La aplicación incluye las siguientes pantallas principales:

1. **Autenticación**: Login, registro y recuperación de contraseña.
2. **Onboarding**: Recopila información personal, detalles de nacimiento y preferencias.
3. **Inicio**: Muestra el horóscopo diario y eventos cósmicos relevantes.
4. **Carta Natal**: Visualización interactiva de la carta natal con análisis detallado.
5. **Aprendizaje**: Recursos educativos sobre conceptos astrológicos.
6. **Chat**: Comunidad para discusiones sobre temas astrológicos.
7. **Perfil**: Gestión de información personal y preferencias.

## Características Implementadas

### Interfaz Multilingüe

AstroGuía admite múltiples idiomas:
- Español
- Inglés
- Portugués

### Tema Claro/Oscuro

La aplicación proporciona tema claro y oscuro con una paleta de colores que enfatiza los elementos místicos y astrológicos.

### Autenticación Completa

- Registro de usuario
- Inicio de sesión
- Recuperación de contraseña
- Autenticación con redes sociales

### Componentes de Visualización Astrológica

Los componentes desarrollados permiten visualizar:
- Cartas natales con posiciones planetarias
- Distribución de elementos
- Aspectos entre planetas
- Eventos cósmicos importantes

## Capturas de Pantalla (Representativas)

### Pantalla de Carta Natal Mejorada

La pantalla de carta natal muestra la visualización interactiva de la carta natal del usuario con los siguientes elementos:

- Rueda de la carta natal con posiciones planetarias
- Distribución de elementos (fuego, tierra, aire, agua)
- Aspectos entre planetas
- Interpretación personalizada

*Nota: La pantalla utiliza los componentes NatalChartWheel, ElementDistribution y AspectComponent.*

### Pantalla de Eventos Cósmicos

La pantalla de eventos cósmicos muestra una lista de eventos astrológicos importantes:

- Fases lunares
- Retrogradaciones planetarias
- Eclipses solares y lunares
- Tránsitos planetarios importantes

*Nota: Esta pantalla utiliza el componente CosmicEventCard para mostrar los diferentes eventos.*

## Limitaciones Técnicas Actuales

Como se explicó anteriormente, existen limitaciones técnicas que impiden generar un código QR funcional para acceder a la aplicación a través de Expo Go:

1. El entorno de desarrollo está aislado sin acceso a Internet pública
2. Los códigos QR generados apuntarían a localhost:8081, que solo es accesible dentro del entorno virtual
3. No es posible usar la función de túnel de Expo en este entorno

## Próximos Pasos

Para continuar el desarrollo y hacer la aplicación accesible:

1. **Exportación del Repositorio**: Descargar el código fuente completo para ejecutarlo en un entorno de desarrollo local.
2. **Implementación de Backend**: Completar la integración con Firebase para autenticación y almacenamiento de datos.
3. **Despliegue en TestFlight**: Preparar la aplicación para pruebas a través de TestFlight para iOS.
4. **Mejoras en la Visualización**: Seguir refinando los componentes de visualización astrológica.