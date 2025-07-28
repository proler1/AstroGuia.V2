# Implementación Técnica de AstroGuía

Este documento proporciona detalles técnicos sobre la implementación de AstroGuía, explicando la arquitectura, las tecnologías utilizadas y cómo los componentes interactúan entre sí.

## Arquitectura General

AstroGuía está construido con una arquitectura moderna de aplicaciones móviles:

```
AstroGuía/
├── app/                # Directorio principal de pantallas (Expo Router)
│   ├── (auth)/         # Rutas de autenticación
│   ├── (tabs)/         # Navegación por pestañas
│   ├── onboarding/     # Flujo de onboarding
│   └── _layout.tsx     # Configuración de navegación
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── contexts/       # Contextos de React
│   ├── hooks/          # Hooks personalizados
│   ├── i18n/           # Internacionalización
│   ├── models/         # Modelos de datos
│   └── services/       # Servicios de backend
```

## Stack Tecnológico

- **Framework**: React Native con Expo
- **Navegación**: Expo Router
- **UI Components**: React Native Paper
- **Estilos**: StyleSheet y Tailwind React Native Classnames
- **Gestión de Estado**: Context API y React Query
- **Backend**: Firebase (Auth, Firestore)
- **Internacionalización**: i18next
- **Animaciones**: React Native Reanimated

## Componentes Astrológicos Clave

### 1. NatalChartWheel

Este componente renderiza una carta natal interactiva con las posiciones planetarias. Utiliza SVG para dibujar:

- Un círculo exterior para los signos zodiacales
- Círculos interiores para las casas
- Símbolos para los planetas en sus posiciones exactas
- Líneas para representar aspectos entre planetas

La implementación se basa en cálculos precisos de coordenadas polares convertidas a coordenadas cartesianas para el posicionamiento exacto.

```tsx
// Cálculo simplificado para posicionamiento de planetas
const getCoordinates = (degree: number, distance: number) => {
  const radian = (degree - 90) * Math.PI / 180;
  const x = Math.cos(radian) * distance + centerX;
  const y = Math.sin(radian) * distance + centerY;
  return { x, y };
};
```

### 2. ElementDistribution

Este componente visualiza la distribución de los cuatro elementos astrológicos:

```tsx
<ElementDistribution
  elements={[
    { element: 'fire', percentage: 35 },
    { element: 'earth', percentage: 20 },
    { element: 'air', percentage: 25 },
    { element: 'water', percentage: 20 }
  ]}
/>
```

Internamente, utiliza barras de progreso con colores específicos para cada elemento y permite una visualización compacta para espacios reducidos.

### 3. AspectComponent

Este componente muestra aspectos astrológicos con sus símbolos tradicionales:

```tsx
<AspectComponent
  type="trine"
  size="medium"
  showName={true}
  showSymbol={true}
/>
```

Incluye funciones auxiliares para obtener colores, símbolos y nombres de cada tipo de aspecto, siguiendo las convenciones astrológicas.

### 4. CosmicEventCard

Este componente muestra eventos cósmicos como fases lunares y eclipses:

```tsx
<CosmicEventCard
  event={cosmicEvent}
  onPress={() => showEventDetails(cosmicEvent.id)}
  compact={false}
/>
```

Adapta su estilo según el tema actual (claro/oscuro) y proporciona una versión compacta para listados.

## Sistema de Autenticación

El sistema de autenticación utiliza Firebase Auth con Context API:

```tsx
// Fragmento de AuthContext.tsx
export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  loading: true,
  error: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  // Implementación de los métodos de autenticación...
}
```

## Sistema de Tema

El tema de la aplicación se gestiona a través de ThemeContext:

```tsx
// Fragmento de ThemeContext.tsx
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: DefaultTheme,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? DarkTheme : DefaultTheme;
  
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};
```

## Internacionalización

La aplicación utiliza i18next para soporte multilingüe:

```tsx
// Configuración básica de i18n
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import es from './locales/es';
import pt from './locales/pt';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    pt: { translation: pt },
  },
  lng: 'es',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

## Servicios de Backend

Los servicios se comunican con Firebase para almacenar y recuperar datos:

```tsx
// Ejemplo de HoroscopeService.ts
export const getHoroscope = async (sign: string, date: string): Promise<Horoscope> => {
  try {
    const docRef = doc(db, 'horoscopes', `${sign}_${date}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Horoscope;
    } else {
      // Fallback a la API de horóscopo
      return fetchHoroscopeFromApi(sign, date);
    }
  } catch (error) {
    console.error('Error getting horoscope:', error);
    throw error;
  }
};
```

## Desafíos Técnicos

### Cálculo de Cartas Natales

El cálculo preciso de cartas natales es computacionalmente intensivo. Utilizamos cálculos del lado del servidor almacenados en caché para evitar ralentizar la aplicación.

### Renderizado SVG para Cartas Astrológicas

El renderizado de cartas natales como SVG requirió optimizaciones para mantener un buen rendimiento, especialmente en dispositivos de gama baja.

### Interfaz Multilingüe

La traducción de términos astrológicos especializados requirió atención especial para mantener su significado técnico preciso en todos los idiomas.

## Próximas Mejoras Técnicas

1. **Optimización de Rendimiento**
   - Implementación de virtualizaciones para listas largas
   - Memoización de cálculos complejos

2. **Implementación Offline**
   - Almacenamiento en caché de datos astrológicos
   - Sincronización en segundo plano

3. **Integración con APIs Astronómicas**
   - Datos de efemérides más precisos
   - Información astronómica en tiempo real