---
last_update: 14-01-2026
context: Sistema de Diseño Neobrutalism
purpose: Documentación del design system, paleta de colores, componentes reutilizables y tokens de diseño
---

# Sistema de Diseño - Neobrutalism

## Rationale (El "Por qué")

**Escudle** usa un design system basado en **Neobrutalism**. Para ver la lista de features de interfaz implementados, consultar [features.md](./features.md). Este estilo se caracteriza por:
- Colores vibrantes y alto contraste
- Bordes gruesos (3-4px) en negro
- Sombras "hard" sin blur (offset sólido)
- Tipografía bold y sans-serif
- Estética "cruda" y energética

**Decisión de diseño:**
- **Objetivo**: Diferenciarse visualmente de clones genéricos de Wordle
- **Audiencia**: Público joven (18-35 años), fan del fútbol, familiarizado con estética digital contemporánea
- **Inspiración**: Pan y Queso, Gumroad, Brutalist Web Design

**Trade-off:**
- **Accesibilidad vs Estética**: Los bordes gruesos reducen espacio útil, pero mejoran legibilidad y affordance
- **Profesionalismo vs Diversión**: Neobrutalism es menos "corporativo" pero más memorable y divertido

## Paleta de Colores

### Neo Colors (Primarios)

```css
--neo-green:  #00A676  /* Verde vibrante - Color primario, background */
--neo-yellow: #FFD23F  /* Amarillo brillante - Highlights, modo fácil */
--neo-purple: #A663CC  /* Púrpura - Modo difícil */
--neo-blue:   #5496FF  /* Azul - CTAs importantes */
--neo-orange: #FF784F  /* Naranja - Estados de error/pérdida */
--neo-white:  #FFFFFF  /* Blanco - Cards, inputs */
--neo-black:  #000000  /* Negro - Borders, texto */
```

### Colores Semánticos

```css
--neo-success: #00A676  /* Usa neo-green para victoria */
```

### Background Pattern

```css
body {
  background-color: #15803d;  /* Verde oscuro de campo de fútbol */
  background-image: radial-gradient(#000000 1px, transparent 1px);
  background-size: 20px 20px;
}
```

Este patrón de puntos simula la textura de un campo de fútbol de forma abstracta.

## Tokens de Diseño

### Borders

```css
border: 3px solid #000  /* Standard border */
border: 4px solid #000  /* Emphasis border (logo card) */
```

**Regla**: SIEMPRE usar bordes negros, nunca grises ni transparentes.

### Shadows (Box Shadow)

```css
/* shadow-neo (default) */
box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);

/* shadow-neo-sm (subtle) */
box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);

/* shadow-neo-lg (dramatic) */
box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
```

**Características:**
- Sin blur (`0px` en el 3er valor)
- Offset uniforme en X y Y
- Color negro sólido
- Simula un "3D paper cut" effect

### Border Radius

```css
rounded-lg:  8px   /* Inputs */
rounded-xl:  12px  /* Cards, botones */
rounded-3xl: 24px  /* Modal, logo card */
rounded-full: 50%  /* Badges, avatares */
```

**Regla**: Evitar radius muy pequeños (<4px), prefiere esquinas marcadas o muy redondeadas.

### Tipografía

#### Font Family

```css
font-family: 'Outfit', sans-serif;  /* Primary font */
font-family: 'Permanent Marker', cursive;  /* Accent font (no usada actualmente) */
```

**Outfit** fue elegida por:
- ✅ Geometric sans-serif moderna
- ✅ Variable font (weights 100-900)
- ✅ Excelente legibilidad en negritas
- ✅ Gratis en Google Fonts

#### Font Weights

```css
font-medium: 500   /* Body text, párrafos */
font-bold: 700     /* Botones, labels */
font-black: 900    /* Títulos, énfasis máximo */
```

**Regla**: NO usar weights menores a 500. Neobrutalism requiere tipografía bold.

#### Font Sizes

```css
text-xs:   0.75rem  /* 12px - Badges */
text-sm:   0.875rem /* 14px - Secondary text */
text-base: 1rem     /* 16px - Body */
text-lg:   1.125rem /* 18px - Subheadings */
text-xl:   1.25rem  /* 20px - Input text */
text-2xl:  1.5rem   /* 24px - Card titles */
text-3xl:  1.875rem /* 30px - Modal headers */
```

## Componentes Reutilizables

### 1. Neo Card (.neo-card)

```css
.neo-card {
  @apply bg-neo-white 
         border-[3px] 
         border-neo-black 
         shadow-neo;
}
```

**Uso**: Contenedores principales (logo display, stats footer).

**Ejemplo:**
```html
<div class="neo-card rounded-3xl p-8">
  <!-- Contenido -->
</div>
```

### 2. Neo Input (.neo-input)

```css
.neo-input {
  @apply bg-neo-white 
         border-[3px] 
         border-neo-black 
         rounded-lg 
         focus:outline-none 
         focus:shadow-neo 
         transition-all;
}
```

**Comportamiento de focus**: Sombra aparece al hacer focus (sin outline).

**Ejemplo:**
```html
<input type="text" 
       class="neo-input w-full h-16 px-4 text-xl font-bold" 
       placeholder="ESCRIBÍ EL EQUIPO..." />
```

### 3. Neo Button (.neo-btn)

```css
.neo-btn {
  @apply border-[3px] 
         border-neo-black 
         shadow-neo 
         hover:translate-x-[2px] 
         hover:translate-y-[2px] 
         hover:shadow-neo-sm 
         active:translate-x-[4px] 
         active:translate-y-[4px] 
         active:shadow-none 
         transition-all;
}
```

**Efecto "press"**:
- Hover: Se mueve 2px, sombra se reduce
- Active: Se mueve 4px, sombra desaparece (simula presión)

**Ejemplo:**
```html
<button class="neo-btn bg-neo-blue text-white font-black px-6 py-3 rounded-xl">
  SIGUIENTE ESCUDO
</button>
```

### 4. Badges (Neo Style)

```html
<span class="bg-neo-purple text-white text-xs font-bold px-2 py-0.5 rounded-full border border-neo-black uppercase">
  1930-1936
</span>
```

**Características:**
- Rounded-full
- Border fino (1-2px)
- Uppercase text
- Padding compacto

## Animaciones

### Framer Motion Variants (Inline)

#### Fade + Slide In
```typescript
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
```

#### Scale In
```typescript
initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
animate={{ scale: 1, opacity: 1, rotate: 0 }}
transition={{ type: "spring", damping: 12, stiffness: 100 }}
```

#### Press Effect (Buttons)
```typescript
whileHover={{ scale: 1.05 }}
whileTap={{ x: 2, y: 2 }}
```

### CSS Animations (Tailwind Custom)

```css
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px) }
  100% { opacity: 1; transform: translateY(0) }
}

@keyframes scaleIn {
  0% { opacity: 0; scale: 0.9 }
  100% { opacity: 1; scale: 1 }
}
```

**Uso:** Cargando inicial, transiciones de entrada.

## Estados Visuales

### Estados de Intento (Attempts List)

```typescript
// Sin usar (pending)
"bg-white/50 border-neo-black/20 text-gray-400 border-dashed"

// Intento incorrecto
"bg-neo-white border-neo-black text-neo-black"

// Intento correcto
"bg-neo-success border-neo-black text-neo-black shadow-neo-sm"
```

**Iconos:**
- ✅ Correcto: `<CheckCircle2 className="fill-neo-success" />`
- ❌ Incorrecto: `<XCircle className="fill-neo-orange" />`

### Estados del Logo (Modos)

```typescript
// Modo Fácil (visible)
"brightness-100 blur-0 grayscale-0"

// Modo Difícil (oculto)
"brightness-0 opacity-10 blur-md grayscale"
```

**Overlay**: Signo de interrogación gigante (`text-9xl`) en modo difícil.

## Boundary Rules

**El design system debe:**
- Usarse consistentemente en TODOS los componentes
- Definirse en `index.css` y `tailwind.config.js`
- Preferir utility classes sobre CSS custom

**NO se debe:**
- ❌ Hardcodear colores hex fuera de la paleta neo
- ❌ Usar shadows con blur (box-shadow con 3er valor != 0)
- ❌ Usar borders de color diferente a negro
- ❌ Usar font-weights < 500

## Decision Log

### 14-01-2026: Paleta Neo Custom
**Decisión**: Definir colores custom como `neo-*` en lugar de usar nombres genéricos.

**Razón**: 
- Evita confusión con colores de Tailwind (`blue-500` vs `neo-blue`)
- Permite cambiar toda la paleta desde un solo lugar
- Semántica clara: "neo" = neobrutalism

### 13-01-2026: Background Pattern de Fútbol
**Decisión**: Usar `radial-gradient` con puntos negros sobre verde.

**Alternativas consideradas:**
- ❌ Imagen de césped real (muy pesado, no escalable)
- ❌ Verde sólido (muy plano, aburrido)
- ✅ Patrón de puntos (ligero, abstracto, temático)

**Inspiración**: Pan y Queso usa un patrón similar.

### Enero 2026: Framer Motion vs CSS Animations
**Decisión**: Usar mayormente Framer Motion para animaciones complejas.

**Razón**:
- ✅ Declarativo y fácil de leer
- ✅ Gestos (drag, hover, tap) out of the box
- ✅ AnimatePresence para exit animations
- ⚠️ Bundle size impact mínimo (~50KB gzipped)

**Casos para CSS puro**: Animaciones de carga, spinners, efectos simples.

## Known Pitfalls

### 1. Active State Position
**Advertencia**: El efecto "press" de `.neo-btn` usa `transform: translate()`, lo cual puede causar layout shift si el botón está dentro de un grid/flex rígido.

**Solución**: Asegurar que el contenedor padre tenga espacio suficiente (4px de margen extra).

### 2. Shadow Overlap
**Problema**: Dos elementos con `shadow-neo` uno al lado del otro pueden crear un efecto visual extraño.

**Solución**: Agregar espacio entre elementos adyacentes (`gap` en flex/grid).

### 3. Border Width y Sizing
**Advertencia**: `border-[3px]` aumenta el tamaño total del elemento en 6px (3px × 2 lados).

**Solución**: Usar `box-sizing: border-box` (default en Tailwind) y ajustar padding/width en consecuencia.

### 4. Color Contrast
**Accesibilidad**: Algunos combos pueden fallar WCAG AA:
- ⚠️ `text-neo-yellow` sobre `bg-white` (contrast ratio ~1.8:1)
- ✅ `text-neo-black` sobre cualquier color de fondo (siempre >4.5:1)

**Regla**: Usar texto negro siempre que sea posible.

## Referencias

- [Neobrutalism Web Design](https://hype4.academy/articles/design/neobrutalism-design)
- [Outfit Font - Google Fonts](https://fonts.google.com/specimen/Outfit)
- [Arquitectura General](./arquitectura.md)
