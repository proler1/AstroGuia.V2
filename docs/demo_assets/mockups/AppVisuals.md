# Visuales de la Aplicación AstroGuía

Este documento contiene representaciones visuales y mockups de las pantallas principales de la aplicación AstroGuía para dar una idea clara de la interfaz de usuario sin necesidad de ejecutar la aplicación.

## Pantalla Principal de Carta Natal

![Carta /images/natalchart.jpg)

### Descripción

La pantalla de carta natal contiene:
- Una rueda interactiva que muestra las posiciones planetarias
- Pestañas para navegar entre Vista General, Planetas, Casas y Aspectos
- Distribución de elementos (fuego, tierra, aire, agua) con porcentajes
- Información sobre el ascendente
- Interpretación personalizada de la carta

## Pantalla de Eventos Cósmicos

![Eventos Cósmicos](https://mockups.metadl.com/astroguia/cosmic_events.png)

### Descripción

La pantalla de eventos cósmicos muestra:
- Tarjetas para diferentes tipos de eventos (fases lunares, eclipses, retrogradaciones)
- Cada tarjeta incluye imagen, título, fecha y descripción breve
- Los eventos están codificados por color según su tipo
- Vista en modo compacto y expandido

## Pantalla de Inicio de Sesión

![Inicio de Sesión](https://mockups.metadl.com/astroguia/login_screen.png)

### Descripción

La pantalla de inicio de sesión incluye:
- Campos para email y contraseña
- Opción "Olvidé mi contraseña"
- Inicio de sesión con redes sociales
- Enlace para registrarse como nuevo usuario
- Animaciones suaves de transición

## Pantalla de Onboarding - Detalles de Nacimiento

![Detalles de Nacimiento](https://mockups.metadl.com/astroguia/birth_details.png)

### Descripción

La pantalla de detalles de nacimiento permite:
- Seleccionar fecha y hora exacta de nacimiento
- Buscar lugar de nacimiento con asistencia de geolocalización
- La información se utiliza para calcular la carta natal con precisión
- Interfaz intuitiva con selectores de tiempo y calendario

## Pantalla de Aprendizaje

/images/Learning.jpg)

### Descripción

La sección de aprendizaje ofrece:
- Categorías de contenido educativo sobre astrología
- Artículos y tutoriales con imágenes explicativas
- Glosario de términos astrológicos
- Videos introductorios a conceptos clave

## Pantalla de Chat Comunitario

![Chat Comunitario](https://mockups.metadl.com/astroguia/community_chat.png)

### Descripción

La pantalla de chat comunitario incluye:
- Canales temáticos por signos zodiacales
- Conversaciones grupales sobre eventos astrológicos
- Acceso a preguntas y respuestas con astrólogos
- Notificaciones de nuevos mensajes

---

## Componentes Clave

### Tarjeta de Evento Cósmico

Los eventos cósmicos se muestran en tarjetas elegantes:

```jsx
<CosmicEventCard
  event={{
    id: '1',
    title: 'Luna Llena en Escorpio',
    date: '27 de abril, 2025',
    type: 'moon_phase',
    description: 'Esta luna llena trae transformaciones emocionales profundas.',
    imageUrl: '/images/full-moon-scorpio.jpg'
  }}
/>
```

### Componente de Aspectos

Los aspectos entre planetas se visualizan con símbolos astrológicos tradicionales:

```jsx
<AspectComponent 
  type="trine" 
  size="medium" 
  showName={true} 
  showSymbol={true}
/>
```

### Distribución de Elementos

La distribución de elementos en la carta natal se muestra con barras de progreso coloridas:

```jsx
<ElementDistribution
  elements={[
    { element: 'fire', percentage: 40 },
    { element: 'earth', percentage: 15 },
    { element: 'air', percentage: 25 },
    { element: 'water', percentage: 20 }
  ]}
/>
```

## Guía de Colores

La aplicación utiliza una paleta de colores cuidadosamente seleccionada:

- **Tema Oscuro**: 
  - Fondo: #0f111a
  - Tarjetas: #191c2d
  - Acentos: #9b95ff, #6055c5
  - Texto: #ffffff, #e0e0e0

- **Tema Claro**:
  - Fondo: #ffffff
  - Tarjetas: #f5f8ff
  - Acentos: #6055c5, #9b95ff
  - Texto: #1a1a2c, #3a3a3c

- **Elementos**:
  - Fuego: #ff7043
  - Tierra: #8d6e63
  - Aire: #90caf9
  - Agua: #4fc3f7

- **Aspectos**:
  - Conjunción: #8860d0
  - Oposición: #d80000
  - Trígono: #009933
  - Cuadratura: #d86300
  - Sextil: #00aacc