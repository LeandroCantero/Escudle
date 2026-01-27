---
last_update: 19-01-2026
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
- **Iconografía Moderna**: Reemplazo de emojis por iconos de Lucide React para una estética más profesional y coherente.
- **Auto-Open Stats**: El modal de estadísticas se abre automáticamente tras finalizar una partida diaria.
- **Silhouette Rendering Fix**: Mejora en el renderizado de siluetas (dificultad media y difícil) usando filtros CSS para eliminar líneas internas.

### Modos de Juego
- **Modo Diario (Daily Challenge)**: Un escudo único por día con persistencia total de intentos y estado, incluso al cambiar de dificultad o recargar la página.
- **Modo Infinito**: Juego continuo sin límites. **[NUEVO]** Sistema de Puntos y High Score persistente.
- **Modo Práctica**: Jugar sin afectar estadísticas.
- **Dificultad**: Fácil, Medio, Difícil.

### Stats & Social
- **Estadísticas**: Win rate, Rachas (Streaks), Distribución de intentos.
- **Stats Modo Infinito**: Score de sesión y Récord Personal (High Score) guardado localmente.
- **Compartir Resultados**: Copiar al portapapeles con emojis (estilo Wordle).
- **Cuenta Regresiva**: Timer para el próximo escudo diario.

### Datos y Backend (Offline)
- **Scraper Custom**: Sistema para extraer logos y metadata de football-logos.cc.
- **Almacenamiento Local**: Logos servidos desde `/public` para evitar latencia de red.
- **Dataset Masivo**: ~3200 logos procesados.
- **Colección (Dataset)**: Actuales, Históricos (Retros), o Todos.

---


## Decision Log (Feature Level)
- **19-01-2026**: Implementación de sistema de puntaje y persistencia para Modo Infinito. Feedback inmediato y modal de estadísticas. Se corrigió la persistencia del Modo Diario al cambiar dificultad y se automatizó la apertura de estadísticas.
- **19-01-2026**: Reemplazo global de emojis por iconos de Lucide y mejora en el renderizado de siluetas de escudos.
- **14-01-2026**: Centralización de features y roadmap en este documento para seguir el principio DRY en la documentación técnica.
