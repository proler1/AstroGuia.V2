# Componentes UI de AstroGuía

## AspectComponent

Este componente visualiza los aspectos astrológicos entre planetas, con soporte para:

- Diferentes tipos de aspectos (conjunción, oposición, trígono, cuadratura, etc.)
- Visualización de símbolos y nombres
- Tamaños personalizables (pequeño, mediano, grande)
- Esquema de colores astrológicos tradicionales

```typescript
// Ejemplo de uso:
<AspectComponent 
  type="trine" 
  size="medium" 
  showName={true} 
  showSymbol={true} 
/>
```

## CosmicEventCard

Tarjeta para mostrar eventos cósmicos importantes como fases lunares, retrogradaciones y eclipses:

- Soporte para diferentes tipos de eventos cósmicos
- Modo compacto y expandido
- Visualización de imágenes relacionadas con el evento
- Estilización adaptable al tema claro/oscuro

```typescript
// Ejemplo de uso:
<CosmicEventCard
  event={{
    id: '1',
    title: 'Luna Llena en Tauro',
    date: '19 de noviembre, 2023',
    type: 'moon_phase',
    description: 'La luna llena en Tauro trae estabilidad y materialización de proyectos.',
    imageUrl: '/images/full-moon.jpg'
  }}
  onPress={() => showEventDetails('1')}
/>
```

## ElementDistribution

Visualiza la distribución de elementos (fuego, tierra, aire, agua) en una carta natal:

- Barras de progreso con colores específicos para cada elemento
- Modo compacto para espacios reducidos
- Porcentajes y visualización de iconos
- Ordenamiento automático por predominancia

```typescript
// Ejemplo de uso:
<ElementDistribution
  elements={[
    { element: 'fire', percentage: 40 },
    { element: 'earth', percentage: 15 },
    { element: 'air', percentage: 25 },
    { element: 'water', percentage: 20 }
  ]}
/>
```

## NatalChartWheel (Representación conceptual)

Visualización interactiva de la carta natal completa:

- Representación gráfica de las casas astrológicas
- Posiciones planetarias precisas
- Visualización de aspectos entre planetas
- Zoom y navegación interactiva
- Modo interpretativo con información detallada

## PlanetComponent (Representación conceptual)

Muestra información sobre planetas en la carta natal:

- Símbolos planetarios
- Posiciones en signos y casas
- Estado (directo, retrógrado, estacionario)
- Dignidades y debilidades esenciales
- Aspectos principales con otros planetas

## ZodiacSign (Representación conceptual)

Visualiza los signos zodiacales:

- Símbolos tradicionales para cada signo
- Esquema de colores por elemento
- Información sobre regentes y cualidades
- Compatibilidad con vista compacta o expandida