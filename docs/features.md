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
- **Responsive Design**: Optimizado para dispositivos móviles y desktop.

### Datos y Backend (Offline)
- **Scraper Custom**: Sistema para extraer logos y metadata de football-logos.cc.
- **Almacenamiento Local**: Logos servidos desde `/public` para evitar latencia de red.
- **Dataset Masivo**: ~3200 logos procesados.

---

## 🚀 Ideas y Futuro (Backlog)

### Alta Prioridad
3. **Compartido de Resultados**: Botón para copiar el "grid" de intentos al clipboard (estilo Wordle) para redes sociales.

### Contenido y Datos
4. **Filtros por Liga/País**: Permitir jugar solo con equipos de una liga específica (ej: Premier League, Liga Argentina).
5. **Detección de Colores Dominantes**: Usar los colores del escudo para cambiar dinámicamente el background del modo fácil.
6. **Alias de Equipos**: Mapear nombres alternativos (ej: "Man Utd" -> "Manchester United") para mejorar el matching.

### UX y Gamificación
7. **Streaks y Estadísticas**: Guardar en `localStorage` la racha de victorias y estadísticas históricas del usuario.
8. **Modo Contrarreloj**: Adivinar la mayor cantidad de escudos en X segundos.
9. **Modo Multijugador**: "Daily Escudle" donde todos los usuarios juegan el mismo escudo cada día.

### Técnica / DevOps
10. **PWA (Progressive Web App)**: Permitir instalación en el móvil y juego offline completo usando cache de assets.
11. **Git LFS**: Migrar los logos de `/public` a Git LFS para mantener el repo ligero.
12. **Tests de Integración**: Agregar tests para el flujo principal del juego y el hook de búsqueda.

---

## Decision Log (Feature Level)
- **14-01-2026**: Centralización de features y roadmap en este documento para seguir el principio DRY en la documentación técnica.
