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

### Datos y Backend (Offline)
- **Scraper Custom**: Sistema para extraer logos y metadata de football-logos.cc.
- **Almacenamiento Local**: Logos servidos desde `/public` para evitar latencia de red.
- **Dataset Masivo**: ~3200 logos procesados.

---

## 🚀 Ideas y Futuro (Backlog)

### 🎮 Nuevos Modos de Juego
- **Modo Contra Reloj (Time Attack)**: Adivinar la mayor cantidad de escudos en 60/90/120 segundos.
- **Modo Supervivencia**: Sin límite de escudos, pero pierdes al primer error. ¿Cuántos puedes acertar seguidos?
- **Modo Torneo**: Competir en una estructura de eliminación directa (8vos, 4tos, semis, final).
- **Modo Diario (Daily Challenge)**: Un escudo único por día con ranking global compartido.
- **Modo Década**: Escudos filtrados por décadas (60s, 70s, 80s, 90s, 2000s, 2010s, 2020s).
- **Modo Solo Continentes**: Filtro por confederación (UEFA, CONMEBOL, CONCACAF, AFC, CAF, OFC).
- **Modo Liga Específica**: Solo escudos de una liga (ej: Premier League, La Liga, Serie A).
- **Modo Escudos Raros**: Solo equipos de divisiones inferiores o ligas poco conocidas.
- **Modo Pixelado**: El escudo aparece pixelado y se aclara progresivamente con cada intento fallido.
- **Modo Zoom Extremo**: Mostrar solo un fragmento del escudo que se amplía con cada intento.
- **Modo Silueta**: Mostrar solo el contorno/silueta del escudo en negro.
- **Modo Blanco y Negro**: Escudos en escala de grises para mayor dificultad.
- **Modo Equipos Extintos**: Solo clubes que ya no existen o se fusionaron.
- **Modo Colaborativo**: Dos jugadores se turnan para adivinar escudos (local o online).

### 🏆 Gamificación y Progresión
- **Sistema de Niveles**: XP por aciertos, subir de nivel desbloquea modos y badges.
- **Logros/Achievements**: Badges por hitos (ej: "100 escudos acertados", "5 rachas perfectas", "Maestro de América del Sur").
- **Rachas (Streaks)**: Contador de días consecutivos jugando con recompensas.
- **Sistema de Estrellas**: 1-3 estrellas por escudo según intentos usados (1 intento = 3 estrellas).
- **Ranking por Categorías**: Leaderboards separados por modo, país, liga, etc.
- **Temporadas (Seasons)**: Resets trimestrales con recompensas exclusivas.
- **Misiones Diarias/Semanales**: "Adivina 5 escudos italianos" o "Juega 3 partidas en modo difícil".
- **Colección de Escudos**: Galería visual de todos los escudos adivinados (tipo Pokédex).
- **Perfil de Usuario**: Estadísticas detalladas, escudos favoritos, porcentajes de acierto por país.

### 📊 Estadísticas y Analytics
- **Dashboard Personal**: 
  - Win rate global y por modo
  - Países/ligas más dominadas
  - Promedio de intentos por acierto
  - Escudos más difíciles enfrentados
  - Tiempo total jugado
  - Gráficos de progresión temporal
- **Comparación con Amigos**: Ver quién tiene mejor win rate o más escudos adivinados.
- **Heatmap de Conocimiento**: Mapa mundial mostrando qué regiones dominas mejor.
- **Historial de Partidas**: Log completo de escudos jugados con fecha y resultado.

### 👥 Social y Multijugador
- **Modo Multijugador 1v1**: Mismo escudo, quien adivina primero gana el punto (mejor de 5).
- **Batalla por Turnos**: Se turnan para adivinar escudos, el primero en 10 puntos gana.
- **Compartir Resultados**: Botón para compartir tu racha en redes sociales (Twitter, WhatsApp, Instagram Stories).
- **Desafíos a Amigos**: Enviar un link con un escudo específico: "¿Puedes adivinar este escudo?".
- **Salas Privadas**: Crear rooms con código para jugar con amigos específicos.
- **Torneos Comunitarios**: Eventos semanales con premios (badges exclusivos, lugares en Hall of Fame).
- **Sistema de Comentarios**: Permitir comentar en escudos difíciles o controversiales.

### 📱 PWA (Progressive Web App)
- **Instalable**: Agregar a pantalla de inicio como app nativa.
- **Offline Mode**: Cachear escudos para jugar sin conexión.
- **Notificaciones Push**: 
  - Recordatorio diario para jugar
  - Alertas de nuevos torneos/eventos
  - Notificar cuando un amigo te supera en el ranking
- **Background Sync**: Sincronizar resultados cuando vuelva la conexión.
- **Splash Screen Personalizada**: Con branding de Escudle.
- **App Shortcuts**: Accesos directos a modos favoritos desde el ícono de la app.
- **Share Target API**: Recibir escudos compartidos desde otras apps.

### 🌍 Internacionalización
- **Multi-idioma**: Español, Inglés, Portugués, Francés, Italiano, Alemán.
- **Nombres Localizados**: Adaptar nombres de equipos al idioma del usuario.
- **Contenido Regional**: Priorizar ligas locales según la ubicación del usuario.

### 🎨 Personalización y UX
- **Temas Visuales**: 
  - Dark Mode / Light Mode
  - Temas de equipos (colores del Barça, Real Madrid, etc.)
  - Temporal (Halloween, Navidad, Mundial)
- **Avatares Personalizados**: Elegir o crear avatar con editor simple.
- **Sonidos y Música**: 
  - SFX al acertar/fallar
  - Música de fondo toggleable
  - Himno de victoria personalizable
- **Animaciones Mejoradas**:
  - Confetti al ganar racha
  - Shake animation al fallar
  - Reveal dramático del escudo correcto
- **Accesibilidad**:
  - Screen reader support
  - Modo de alto contraste
  - Tamaños de fuente ajustables
  - Navegación por teclado completa

### 🧠 Ayudas y Hints
- **Sistema de Pistas**: Gastar puntos/monedas para obtener hints:
  - Revelar primera letra
  - Mostrar país/liga
  - Eliminar 2 opciones incorrectas (en modo multiple choice)
  - Mostrar fundación del club
- **Modo Tutorial Interactivo**: Guía paso a paso para nuevos usuarios.
- **Banco de Pistas Ganadas**: Acumular pistas gratuitas por rachas o logros.

### 🔍 Mejoras de Búsqueda y Filtros
- **Filtros Combinados**: País + Liga + Década simultáneos.
- **Filtro por Color de Escudo**: Buscar escudos predominantemente rojos, azules, etc.
- **Filtro por Símbolos**: Escudos con águilas, leones, estrellas, etc.
- **Búsqueda Inversa**: Subir una imagen de escudo y encontrar a qué equipo pertenece.
- **Favoritos**: Marcar equipos favoritos para estadísticas dedicadas.

### 🛠️ Mejoras Técnicas
- **API Propia**: Migrar de archivos estáticos a API para:
  - Actualizaciones dinámicas de escudos
  - Analytics en tiempo real
  - Moderación de contenido
- **CDN para Assets**: Distribuir logos globalmente para menor latencia.
- **Lazy Loading Inteligente**: Precargar escudos de forma predictiva.
- **Compresión Avanzada**: WebP/AVIF para escudos, reducir bundle size.
- **Server-Side Rendering (SSR)**: Mejor SEO y performance inicial.
- **GraphQL**: Para queries más eficientes de datos.
- **Testing E2E**: Implementar Playwright/Cypress para tests automáticos.
- **Monitoring y Error Tracking**: Sentry o similar para detectar bugs en producción.

### 📝 Contenido Educativo
- **Modo Aprendizaje**: Mostrar información del club al revelar (fundación, estadio, títulos).
- **Curiosidades**: Facts históricos o anécdotas sobre escudos.
- **Evolución de Escudos**: Ver cómo cambió el logo a través de los años (timeline).
- **Quiz de Cultura Futbolística**: Mezclar adivinanza de escudos con preguntas de trivia.

### 💰 Monetización (Opcional y Ética)
- **Versión Premium**: Sin ads, modos exclusivos, pistas ilimitadas.
- **Donaciones**: Patreon o Ko-fi para supporters.
- **Cosmetics**: Avatares, marcos de perfil, efectos de partículas premium (solo estéticos).
- **Battle Pass**: Sistema de temporada con track gratuito y premium.

### 🎯 Engagement y Retención
- **Escudo del Día**: Featured badge diario con contexto histórico.
- **Eventos Especiales**: Durante Mundiales, Copas, etc., enfocarse en esos equipos.
- **Contador de Comunidad**: "La comunidad ha adivinado X millones de escudos".
- **Replays y Highlights**: Ver tus mejores partidas o las de top players.
- **Sistema de Referidos**: Invita amigos y gana recompensas.

### 🎲 Modos Experimentales
- **Modo Infinito**: Stream continuo de escudos sin parar (para streamers).
- **Modo Aleatorio Puro**: Sin filtros, cualquier escudo del mundo en cualquier momento.
- **Modo "Guess the Country"**: Te muestran 4 escudos, adivina de qué país son todos.
- **Modo Audio**: Escuchar el himno del club y adivinar (para ligas principales).
- **Modo Mashup**: Mezclar dos escudos y adivinar ambos equipos.

---

## Decision Log (Feature Level)
- **14-01-2026**: Centralización de features y roadmap en este documento para seguir el principio DRY en la documentación técnica.
