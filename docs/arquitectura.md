---
last_update: 14-01-2026
context: Arquitectura del Proyecto Escudle
purpose: Documento maestro que define la arquitectura, stack tecnológico, estructura y decisiones de diseño del proyecto
---

# Arquitectura - Escudle

## Rationale (El "Por qué")

**Escudle** es un juego web de adivinanza de escudos de fútbol. Para ver el detalle de las mecánicas implementadas, consultar [features.md](./features.md). El proyecto se diseñó bajo estos pilares:

1. **Simplicidad técnica**: SPA (Single Page Application) sin backend, toda la lógica en el cliente.
2. **Performance**: Uso de logos locales precargados para evitar requests HTTP durante el juego.
3. **Experiencia premium**: Diseño neobrutalism con animaciones fluidas (Framer Motion).
4. **Escalabilidad de datos**: Sistema de scraping independiente para mantenimiento del dataset.

**Trade-offs clave:**
- **Performance vs Tamaño**: Todos los logos se sirven localmente (~932KB JSON + assets), esto aumenta el bundle inicial pero elimina latencia durante el juego
- **Flexibilidad vs Complejidad**: No hay backend/DB, el juego es completamente estático, ideal para hosting gratuito (Vercel/Netlify) pero limita features como leaderboards globales
- **Historicidad**: Soporte dual de logos actuales (modo fácil) e históricos (modo difícil) requiere metadata robusta en el JSON

## Stack Tecnológico

### Core
- **React 18** - UI library con hooks modernos
- **TypeScript 5** - Type safety estricta (NO `any` permitidos)
- **Vite 5** - Build tool ultra-rápido, HMR instantáneo

### Styling & Animaciones
- **TailwindCSS 3** - Utility-first CSS con design system custom
- **Framer Motion 11** - Animaciones declarativas y gestos
- **Neobrutalism Design** - Paleta custom, sombras hard, bordes gruesos

### Búsqueda & Datos
- **Fuse.js 7** - Fuzzy search algorithm para matching de nombres
- **Axios + xml2js** - Para el scraper de logos (no usado en runtime del juego)

### Utilidades
- **clsx + tailwind-merge** - Composición de clases CSS condicionales
- **Lucide React** - Iconos modernos y ligeros

## Estructura del Proyecto

```
Escudle/
├── src/
│   ├── App.tsx              # Componente principal del juego (413 líneas)
│   ├── main.tsx             # Entry point de React
│   ├── index.css            # Estilos globales + design tokens
│   ├── hooks/
│   │   └── useLogoSearch.ts # Hook de búsqueda con Fuse.js
│   └── data/
│       └── logos.json       # Base de datos de ~3200 logos (933KB)
├── public/
│   └── logos/               # ~1976 archivos de logos locales
├── scraper-download.js      # Script para descargar logos desde football-logos.cc
├── sanitize-logos.js        # Script para limpiar y validar logos
├── debug_logos.js           # Utilidad de debugging
└── docs/                    # Documentación técnica
```

## Flujo de Datos

### 1. Inicialización del Juego
```
App mount → startNewGame() → filtrar logos por modo → seleccionar random → setState
```

### 2. Búsqueda de Usuario
```
Input onChange → setInputValue → useLogoSearch (Fuse.js) → suggestions → render dropdown
```

### 3. Guess Submission
```
handleGuess(name) → agregar a guesses[] → comparar con targetLogo.name → 
  → si match: gameState='won' 
  → si >= 6 intentos: gameState='lost'
  → else: continuar
```

### 4. Scraping (Offline, no en runtime)
```
npm run download-logos → scraper-download.js → fetch sitemap XML → 
  → parsear URLs → extraer metadata → download PNGs → 
  → generar logos.json + guardar en /public/logos/
```

## Componentes Principales

### `App.tsx` (God Component - 413 líneas)
**Responsabilidades:**
- Estado del juego (mode, targetLogo, guesses, gameState)
- Lógica de adivinanza
- UI completa (header, logo display, input, attempts list, modals)

> **NOTA DE REFACTOR**: Este componente viola SRP (Single Responsibility Principle). Triggers para refactor:
> - Actualmente 413 líneas → umbral de 300 líneas superado
> - Candidatos para extracción:
>   1. `GameBoard` component (logo display + attempts)
>   2. `SearchInput` component (input + suggestions dropdown)
>   3. `GameModal` component (help + win/lose overlays)
>   4. `useGameState` hook (lógica de estado del juego)

### `useLogoSearch.ts`
Hook puro que encapsula la lógica de búsqueda fuzzy. Ver [busqueda-logos.md](./busqueda-logos.md) para detalles.

## Data Shapes

### Logo Interface
```typescript
interface Logo {
  id: string;              // "england-arsenal-1930-1936"
  name: string;            // "Arsenal"
  country: string;         // "england"
  isHistorical: boolean;   // true/false
  period: string | null;   // "1930-1936" o null
  svgUrl?: string | null;  // URL remota (no usada en runtime)
  pngUrl?: string | null;  // URL remota (no usada en runtime)
  localPath?: string;      // "/logos/england-arsenal-1930-1936.png"
  pageUrl: string;         // URL de referencia
}
```

## Boundary Rules

**App.tsx debe:**
- Manejar el estado global del juego
- Orquestar la interacción entre búsqueda y lógica de guess
- Renderizar la UI completa

**App.tsx NO debe:**
- ❌ Implementar lógica de búsqueda (está en useLogoSearch)
- ❌ Hacer fetch de datos (logos.json se importa estáticamente)
- ❌ Mutar directamente el DOM (usar React state)

**useLogoSearch debe:**
- Encapsular Fuse.js configuration
- Retornar resultados filtrados y ordenados

**useLogoSearch NO debe:**
- ❌ Conocer el estado del juego (guesses, gameState)
- ❌ Renderizar UI

## Decision Log

### 14-01-2026: Arquitectura Inicial
- Decidido: SPA sin backend para simplicidad y hosting gratuito
- Decidido: Logos locales en /public para eliminar latencia
- Decidido: JSON estático vs base de datos para evitar complejidad de backend

### 13-01-2026: Sistema de Búsqueda
- **Cambio**: De búsqueda exacta (string.includes) a fuzzy search (Fuse.js)
- **Razón**: Mejorar UX cuando usuarios escriben nombres parciales o con typos
- **Configuración**: threshold 0.3 (balance entre precisión y flexibilidad)
- Ver [busqueda-logos.md](./busqueda-logos.md) para análisis completo

### Enero 2026: Design System
- **Cambio**: De diseño minimalista a Neobrutalism
- **Razón**: Diferenciación visual, energía juvenil que conecta con audiencia futbolística
- **Inspiración**: Pan y Queso, brutalist web design
- Ver [sistema-diseno.md](./sistema-diseno.md)

## Known Pitfalls

### 1. Case Sensitivity en Matching
**Problema**: `targetLogo.name` viene del JSON que puede tener capitalización inconsistente.

**Solución**: Siempre usar `.toLowerCase()` en comparaciones:
```typescript
name.toLowerCase() === targetLogo?.name.toLowerCase()
```

### 2. Logos sin localPath
**Edge case**: Algunos logos en logos.json pueden no tener `localPath` si el scraper falló.

**Fallback**: Se usa `localPath || svgUrl || pngUrl` en renders.

### 3. Re-renders en cada keystroke
**Advertencia**: `useLogoSearch` se ejecuta en cada cambio de input. Con 3200+ logos, esto puede ser pesado.

**Mitigación**: `useMemo` en el hook + threshold mínimo de 2 caracteres antes de buscar.

### 4. Modos de juego y pool de logos
**IMPORTANTE**: Al cambiar de modo, `startNewGame()` debe recalcular el pool:
```typescript
const pool = allLogos.filter(l => activeMode === 'easy' ? !l.isHistorical : l.isHistorical)
```
NO usar `filteredLogos` useMemo porque se actualiza DESPUÉS del state change.

## Referencias

- [Sistema de Búsqueda](./busqueda-logos.md)
- [Sistema de Diseño](./sistema-diseno.md)
- [Scraper de Logos](./scraper-sistema.md)
