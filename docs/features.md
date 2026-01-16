---
last_update: 15-01-2026
context: Registro de Features e Ideas (Backlog)
purpose: Listado centralizado de funcionalidades implementadas e ideas para desarrollo futuro (DRY alignment)
---

# Features e Ideas - Escudle

Este documento centraliza todas las funcionalidades del proyecto, separando lo que ya está en producción de lo que está en el horizonte de desarrollo.

## ✅ Features Implementados

### Mecánica de Juego
- **Refactor de Arquitectura**: `App.tsx` dividido en componentes modulares siguiendo SRP.
- **Modo Dual**: Selección entre Modo Fácil (logos actuales) y Modo Difícil (logos históricos).
- **Sistema de Intentos**: Máximo de 6 intentos por escudo con feedback visual inmediato.
- **Validación Case-Insensitive**: Los nombres se comparan ignorando mayúsculas/minúsculas.
- **Reinicio Automático**: Botón de "Siguiente Escudo" funcional tras ganar o perder.

### Interface & UX
- **Design System Neobrutalist**: Paleta de colores vibrantes, bordes gruesos y sombras sólidas.
- **Búsqueda Fuzzy (Fuzzy Search)**: Sugerencias inteligentes mientras el usuario escribe, tolerando typos.
- **Normalización de Nombres**: Comparación insensible a acentos y tildes (ej: "São" match con "sao").
- **Feedback Visual**: 
  - Overlays de victoria y derrota.
  - Lista de intentos con iconos de check/error.
- **Modales Informativos**: Guía de "Cómo Jugar" integrada.
- **Filtro por País (Multi-selección)**: Modal con buscador y checkboxes para filtrar escudos por uno o múltiples países.
- **Responsive Design**: Optimizado para dispositivos móviles y desktop.

### Modos de Juego
- **Modo Diario (Daily Challenge)**: Un escudo único por día. (Base implementada, falta ranking global).
- **Modo Infinito**: Juego continuo sin límites.
- **Modo Práctica**: Jugar sin afectar estadísticas.
- **Dificultad**: Fácil, Medio, Difícil.

### Stats & Social
- **Estadísticas**: Win rate, Rachas (Streaks), Distribución de intentos.
- **Compartir Resultados**: Copiar al portapapeles con emojis (estilo Wordle).
- **Cuenta Regresiva**: Timer para el próximo escudo diario.

### Datos y Backend (Offline)
- **Scraper Custom**: Sistema para extraer logos y metadata de football-logos.cc.
- **Almacenamiento Local**: Logos servidos desde `/public` para evitar latencia de red.
- **Dataset Masivo**: ~3200 logos procesados.
- **Colección (Dataset)**: Actuales, Históricos (Retros), o Todos.

---

## 🚀 Ideas y Futuro (Backlog)

### 💻 Frontend / Client-side
(Funcionalidades que se resuelven en el cliente sin desarrollo de backend propio)

#### 🟢 Dificultad: Baja
- **🎮 Nuevos Modos de Juego**
  - **Modo Contra Reloj (Time Attack)**: Adivinar la mayor cantidad de escudos en 60/90/120 segundos.
  - **[🚫 Data] Modo Liga Específica**: Requiere popular campo `league`.
  - **[🚫 Data] Modo Escudos Raros**: Requiere campo `tier` o `league`.
- **👥 Social & Desafíos (Local)**
  - **Compartir Imagen**: Generar imagen con resultados para redes sociales (Canvas local).
  - **Desafíos a Amigos**: Generar link con parámetros (ej: `?logo=123`) para desafiar a amigos.
  - **Donaciones**: Links a Patreon/Ko-fi en el menú.
- **📅 Contenido Histórico**
  - **Historial de Puzzles Diarios**: Lista de escudos de días anteriores (Lógica basada en semilla).
- **🌍 Internacionalización**
  - **Sistema Multi-idioma**: JSONs locales para traducción (Español, Inglés, Portugués).
  - **Nombres Localizados**: Mapeo de nombres en frontend.

#### 🟡 Dificultad: Media
- **🏆 Gamificación y Progresión (Local)**
  - **Sistema de Niveles**: XP calculado localmente basado en historial.
  - **Logros/Achievements**: Badges guardadas en LocalStorage.
  - **Misiones Diarias**: Objetivos generados por semilla diaria (ej: "Adivina 3 de España").
  - **Sistema de Estrellas**: 1-3 estrellas por escudo según intentos usados.
  - **Colección de Escudos**: Galería visual de todos los escudos adivinados (tipo Pokédex).
- **🎮 Nuevos Modos de Juego**
  - **Modo Solo Continentes**: Requiere map de `country` a `continent` (Hardcodeable).
  - **Modo Pixelado**: El escudo aparece pixelado y se aclara progresivamente.
  - **Modo Zoom Extremo**: Mostrar solo un fragmento del escudo que se amplía.
- **🎨 Personalización y UX**
  - **Temas Visuales**: Dark/Light, Temas de equipos, Temporales (Halloween, etc.).
  - **Sonidos y Música**: SFX al acertar/fallar, música de fondo, himno de victoria.
  - **Animaciones Mejoradas**: Confetti, Shake animation, Reveal dramático.
  - **Accesibilidad**: Screen reader, Alto contraste, Fuentes ajustables, Navegación teclado.
- **📝 Contenido Educativo**
  - **[🚫 Data] Evolución de Escudos**: Requiere `period`/`startYear` poblados.
- **🔍 Mejoras de Búsqueda y Filtros**
  - **[🚫 Data] Filtros Combinados**: Requiere `league` y `period`.
  - **[🚫 Data] Filtro por Color/Símbolos**: Requiere tagging manual de assets.

#### 🔴 Dificultad: Alta
- **🎮 Nuevos Modos de Juego**
  - **Modo Mashup**: Mezclar dos escudos y adivinar ambos equipos (procesamiento de imagen).
- **🛠️ Mejoras Técnicas (Client-side)**
  - **Lazy Loading Inteligente**: Precargar escudos de forma predictiva.
  - **PWA Avanzada**: Offline Mode robusto, Instalable, Splash Screen, App Shortcuts, Share Target.


### ☁️ Backend / Cloud
(Funcionalidades que requieren desarrollo de servidor propio, base de datos o lógica server-side)

#### 🟢 Dificultad: Baja
- **(Sección vacía por ahora)**

#### 🟡 Dificultad: Media
- **🎮 Nuevos Modos de Juego**
  - **Ranking Global Diario**: Competencia contra otros usuarios en el modo diario.
- **🏆 Gamificación y Progresión Cloud**
  - **Sincronización de Rachas**: Persistencia en la nube para no perder progreso.
  - **Perfil de Usuario Cloud**: Estadísticas, favoritos, avatar sincronizados.
- **📊 Estadísticas y Analytics**
  - **Dashboard Avanzado**: Métricas comparativas globales.
  - **Historial Completo**: Log remoto de todas las partidas históricas.
- **🛠️ Mejoras Técnicas**
  - **CDN Global**: Distribución eficiente de assets.
  - **Monitoring**: Sentry/LogRocket para tracking de errores.
  - **Testing E2E**: Pipeline de tests automáticos.

#### 🔴 Dificultad: Alta
- **🎮 Nuevos Modos de Juego (Realtime/Complex)**
  - **Modo Multijugador 1v1**: Competencia sincrónica.
  - **Modo Infinito (Streaming)**: Carga dinámica desde DB masiva (millones de escudos).
- **👥 Social Avanzado**
  - **Batalla por Turnos**: Async multiplayer state machine.
  - **Salas Privadas & Torneos Comunitarios**: Gestión de lobbies y eventos.
  - **Sistema de Comentarios**: Moderación y community management.
- **🏆 Gamificación Global**
  - **Ranking por Categorías**: Leaderboards complejos y segmentados.
  - **Temporadas (Seasons)**: Reset masivo y versionado de datos.
- **🔍 Búsqueda Avanzada**
  - **Búsqueda Inversa**: Reconocimiento de imágenes (ML/AI).
  - **Favoritos Cloud**: Sincronización multi-dispositivo.
- **🛠️ Arquitectura & Backend**
  - **API Propia / GraphQL**: Desarrollo de backend dedicado.
  - **Server-Side Rendering (SSR)**: Migración de infraestructura.
  - **Background Sync / Push Notifications**: Servicios worker avanzados.
- **💰 Monetización y Economía**
  - **Versión Premium / Battle Pass**: Pasarelas de pago y gestión de suscripciones.
- **🎯 Engagement Global**
  - **Contador de Comunidad**: Métricas atómicas globales.
  - **Sistema de Referidos**: Attribution tracking.

---

## Decision Log (Feature Level)
- **14-01-2026**: Centralización de features y roadmap en este documento para seguir el principio DRY en la documentación técnica.
