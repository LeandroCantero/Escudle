# ⚽ Escudle

**Escudle** es un juego web de adivinanza de escudos de fútbol, inspirado en Wordle. Poné a prueba tus conocimientos futbolísticos identificando equipos por su escudo en 6 intentos.

## 🎮 Demo

[**Jugá ahora →**](https://escudle.netlify.app) *(si está deployado)*

## ✨ Características

- 🎯 **Dos modos de juego**
  - **Modo Fácil**: Escudos actuales completamente visibles
  - **Modo Difícil**: Escudos históricos oscurecidos y borrosos
  
- 🔍 **Búsqueda inteligente**
  - Fuzzy search con Fuse.js para tolerar typos
  - Sugerencias en tiempo real con vista previa de logos
  - Búsqueda case-insensitive
  
- 🎨 **Diseño Neobrutalism**
  - Estética vibrante con colores bold
  - Animaciones fluidas con Framer Motion
  - Bordes gruesos y sombras hard
  
- 📊 **Base de datos masiva**
  - ~3200 logos de equipos de todo el mundo
  - Logos históricos desde 1900+
  - Metadata completa (país, período, URLs)

## 🚀 Instalación

### Requisitos
- Node.js 18+ y npm

### Setup

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/escudle.git
cd escudle

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El juego estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo con HMR

# Producción
npm run build        # Compila TypeScript + build de Vite
npm run preview      # Preview del build de producción

# Scraping (opcional)
npm run download-logos  # Re-scrapea logos desde football-logos.cc
```

## 🏗️ Stack Tecnológico

### Core
- **React 18** - UI library con hooks
- **TypeScript 5** - Type safety estricta
- **Vite 5** - Build tool ultra-rápido

### Styling & Animaciones
- **TailwindCSS 3** - Utility-first CSS framework
- **Framer Motion 11** - Animaciones declarativas
- **Custom Neobrutalism Design System** - Paleta y componentes propios

### Búsqueda & Datos
- **Fuse.js 7** - Fuzzy search algorithm
- **3200+ logos** - Dataset local pre-scraped

### Utilidades
- **clsx + tailwind-merge** - Composición de clases
- **Lucide React** - Iconos modernos

## 📁 Estructura del Proyecto

```
Escudle/
├── src/
│   ├── app.tsx              # Componente principal (Orquestador)
│   ├── main.tsx             # Entry point
│   ├── index.css            # Design system + estilos globales
│   ├── components/          # Componentes modulares
│   ├── hooks/
│   │   ├── use-game-logic.ts   # Lógica central del juego
│   │   └── use-logo-search.ts  # Hook de búsqueda con Fuse.js
│   └── utils/
│       └── cn.ts               # Utilidad de Tailwind merge
├── public/
│   └── logos/               # 1976 logos descargados localmente
├── docs/                    # 📚 Documentación técnica
│   ├── arquitectura.md      # Arquitectura y stack
│   ├── busqueda-logos.md    # Sistema de búsqueda
│   ├── sistema-diseno.md    # Design system neobrutalism
│   └── scraper-sistema.md   # Sistema de scraping
├── scraper-download.js      # Script de scraping
├── sanitize-logos.js        # Validación de datos
└── debug-logos.js           # Debugging utilities
```

## 📚 Documentación Técnica

La documentación completa del proyecto está en [`/docs`](./docs):

- **[Arquitectura](./docs/arquitectura.md)** - Stack, estructura, flujos de datos, decisiones técnicas
- **[Sistema de Búsqueda](./docs/busqueda-logos.md)** - Hook `useLogoSearch`, configuración de Fuse.js, casos edge
- **[Sistema de Diseño](./docs/sistema-diseno.md)** - Paleta neo, componentes, tokens, animaciones
- **[Scraper](./docs/scraper-sistema.md)** - Proceso de descarga, estructura del JSON, mantenimiento

## 🎲 Cómo Jugar

1. **Elegí un modo**: Fácil (logos actuales) o Difícil (logos históricos)
2. **Observá el escudo**: En modo fácil está visible, en difícil está oscurecido
3. **Escribí el nombre del equipo**: Usa el buscador con sugerencias
4. **Tenés 6 intentos**: Cada intento incorrecto se marca en rojo
5. **¡Adiviná el equipo!**: Gana descubriendo el escudo correcto

### Ejemplo de Búsqueda

```
Escribís: "real"
Sugerencias:
  → Real Madrid
  → Real Sociedad
  → Real Betis
  → ...
```

## 🛠️ Desarrollo

### Agregar Nuevos Logos

Si querés actualizar la base de datos con logos nuevos:

```bash
# 1. Ejecutar el scraper
npm run download-logos

# 2. Sanitizar y validar
node sanitize-logos.js

# 3. Debuggear (opcional)
node debug-logos.js

# 4. Testear el juego
npm run dev
```

### Modificar el Design System

Todos los tokens de diseño están en:
- **Colores**: `tailwind.config.js` → `theme.extend.colors.neo`
- **Sombras**: `tailwind.config.js` → `theme.extend.boxShadow`
- **Componentes**: `src/index.css` → `.neo-card`, `.neo-btn`, `.neo-input`

Ver [`docs/sistema-diseno.md`](./docs/sistema-diseno.md) para detalles completos.

## 🤝 Contribuir

Las contribuciones son bienvenidas! Para cambios mayores:

1. Fork el proyecto
2. Creá un branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrí un Pull Request

### Estándares de Código

- **TypeScript estricto**: NO usar `any`
- **DRY**: Extraer lógica repetida a hooks/utils
- **SRP**: Una responsabilidad por componente/función
- **Nombrado**: kebab-case para archivos, PascalCase para componentes

Ver [`MEMORY[user_global]`](./docs/arquitectura.md#global-engineering-standards) para estándares completos.

## 📄 Licencia

Este proyecto es de código abierto bajo licencia MIT.

**Nota sobre logos**: Los logos de equipos son propiedad de sus respectivos clubes. Este proyecto usa logos de [football-logos.cc](https://football-logos.cc) únicamente con fines educativos y de entretenimiento no comercial.

## 🙏 Créditos

- **Logos**: [football-logos.cc](https://football-logos.cc)
- **Tipografía**: [Outfit](https://fonts.google.com/specimen/Outfit) por Google Fonts
- **Inspiración de diseño**: [Pan y Queso](https://panyqueso.com), Brutalist Web Design
- **Concepto de juego**: Wordle por Josh Wardle

---

**Hecho con ⚽ y ❤️ por [Dopartis](https://dopartis.com)**

© 2026 Escudle
