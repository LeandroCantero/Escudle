---
last_update: 14-01-2026
context: Sistema de Scraping de Logos
purpose: Documentación del proceso de descarga, sanitización y estructuración de logos desde football-logos.cc
---

# Sistema de Scraping - Football Logos

## Rationale (El "Por qué")

**Escudle** requiere una base de datos de logos de fútbol actualizada y completa. En lugar de buscar manualmente o usar APIs de terceros (costosas, con rate limits), se desarrolló un scraper custom que:

1. **Extrae datos del sitemap oficial** de football-logos.cc
2. **Descarga logos localmente** para eliminar dependencias externas en runtime
3. **Genera metadata estructurada** (país, nombre, período histórico)
4. **Soporta logos históricos** para el modo difícil del juego

**Trade-offs:**
- **Legalidad**: football-logos.cc permite scraping según su robots.txt, pero NO redistribución comercial de logos (Escudle es gratuito = OK)
- **Mantenimiento**: Requiere re-scraping periódico para logos nuevos
- **Tamaño del proyecto**: ~1976 archivos de logos ocupan espacio, pero mejora performance del juego

## Flujo del Scraper

### 1. Descarga del Sitemap XML
```
scraper-download.js → GET https://football-logos.cc/sitemap.xml
  → Parsea XML con xml2js
  → Extrae todas las URLs (<loc> tags)
```

### 2. Extracción de Metadata
```
URL: https://football-logos.cc/england/arsenal/1930-1936/
  → Parsing:
    - country: "england"
    - team: "arsenal"
    - period: "1930-1936" (opcional)
    - isHistorical: true/false (basado en presencia de período)
```

### 3. Generación de URLs de Assets
```
pageUrl → Construye:
  - svgUrl:  https://assets.football-logos.cc/logos/england/arsenal-1930-1936.{hash}.svg
  - pngUrl:  https://assets.football-logos.cc/logos/england/3000x3000/arsenal-1930-1936.{hash}.png
```

**NOTA**: Los {hash} son detectados dinámicamente scrapeando la página HTML.

### 4. Descarga Local
```
Para cada logo:
  → Descarga PNG (3000x3000 alta resolución)
  → Guarda en /public/logos/{id}.png
  → Agrega localPath al JSON: "/logos/england-arsenal-1930-1936.png"
```

### 5. Generación del JSON Final
```
logos.json (933KB):
[
  {
    "id": "england-arsenal-1930-1936",
    "name": "Arsenal",
    "country": "england",
    "isHistorical": true,
    "period": "1930-1936",
    "startYear": 1930,
    "endYear": 1936,
    "svgUrl": "https://...",
    "pngUrl": "https://...",
    "localPath": "/logos/england-arsenal-1930-1936.png",
    "pageUrl": "https://football-logos.cc/england/arsenal/1930-1936/"
  },
  ...
]
```

## Data Shapes

### Logo JSON Schema

```typescript
interface ScrapedLogo {
  id: string;              // Unique: "{country}-{team}[-{period}]"
  name: string;            // Team name: "Arsenal"
  country: string;         // Country/league slug: "england"
  isHistorical: boolean;   // true si tiene período, false si es actual
  period: string | null;   // "1930-1936" o null
  startYear: number | null; // 1930 o null
  endYear: number | null;   // 1936 o null
  svgUrl: string;          // URL remota del SVG
  pngUrl: string;          // URL remota del PNG (3000x3000)
  localPath: string;       // Path local: "/logos/{id}.png"
  pageUrl: string;         // URL de referencia en football-logos.cc
}
```

## Scripts Disponibles

### 1. scraper-download.js

**Comando:**
```bash
npm run download-logos
```

**Responsabilidades:**
- Descargar sitemap XML
- Parsear URLs
- Extraer metadata
- Descargar PNGs
- Generar `logos.json`

**Dependencias:**
- `axios` - HTTP requests
- `xml2js` - Parsear sitemap XML
- `fs` - Guardar archivos
- `path` - Manejo de rutas

**Output:**
- `/public/logos/*.png` (~1976 archivos)
- `/public/data/logos.json` (933KB)

### 2. sanitize-logos.js

**Propósito**: Limpiar y validar el JSON de logos.

**Funciones:**
- Remover duplicados por ID
- Validar que todos los campos requeridos existan
- Verificar que `localPath` apunte a archivos existentes
- Normalizar nombres (capitalize, trim spaces)

**Comando:**
```bash
node sanitize-logos.js
```

### 3. debug_logos.js

**Propósito**: Debugging rápido del dataset.

**Funciones:**
- Contar logos totales/históricos/actuales
- Listar países únicos
- Encontrar logos sin `localPath`
- Validar formato de IDs

**Comando:**
```bash
node debug_logos.js
```

## Boundary Rules

**El scraper debe:**
- Ejecutarse offline (NO en runtime del juego)
- Guardar logos localmente en `/public/logos/`
- Generar JSON válido con todos los campos requeridos
- Respetar rate limits (delay entre requests)

**El scraper NO debe:**
- ❌ Ejecutarse en el navegador (es un script Node.js)
- ❌ Modificar archivos fuera de `/public` y `/src/data`
- ❌ Hacer requests durante el juego (logos ya están descargados)

## Decision Log

### 14-01-2026: Logos Locales vs URLs Remotas
**Decisión**: Descargar todos los logos localmente.

**Razón**:
- ✅ Elimina dependencia de football-logos.cc (si cae, el juego sigue funcionando)
- ✅ Mejora performance (sin latencia de red)
- ✅ Permite offline-first PWA en el futuro
- ⚠️ Aumenta bundle size (~50MB de imágenes)

**Alternativa rechazada**: Usar URLs remotas (pngUrl). Problemas: CORS, latencia, dependencia externa.

### 13-01-2026: PNG vs SVG
**Decisión**: Usar PNGs (3000x3000) en lugar de SVGs.

**Razón**:
- ✅ Compatibilidad universal (todos los navegadores)
- ✅ Tamaño predecible (PNG comprimido ~20-50KB cada uno)
- ⚠️ SVGs tienen problemas de rendering en algunos logos (colores faltantes)

**TODO futuro**: Re-evaluar SVGs cuando football-logos.cc mejore su calidad.

### Enero 2026: Detección de Logos Históricos
**Decisión**: Usar el patrón de URL para detectar historicidad.

**Regla:**
```
https://football-logos.cc/england/arsenal/           → isHistorical: false
https://football-logos.cc/england/arsenal/1930-1936/ → isHistorical: true
```

**Edge case conocido**: Algunos equipos tienen un solo logo marcado como "1900-2025" (cubre toda su historia). Se trata como histórico aunque técnicamente incluye el presente.

### 14-01-2026: Normalización de Nombres
**Problema**: El sitemap tiene capitalización inconsistente:
- "Arsenal FC"
- "arsenal"
- "ARSENAL"

**Solución**: Sanitize script normaliza a Title Case: "Arsenal FC"

## Known Pitfalls

### 1. Hashes Dinámicos en URLs
**Problema**: Las URLs de assets incluyen hashes que cambian:
```
arsenal.abc123.svg → arsenal.def456.svg (después de un rebuild)
```

**Solución actual**: El scraper scrapea la página HTML para extraer el hash real.

**Riesgo**: Si football-logos.cc cambia su estructura HTML, el scraper se rompe.

### 2. Rate Limiting
**Advertencia**: Descargar 3200+ logos sin delay puede resultar en ban temporal.

**Recomendación**: Agregar delay de 100-200ms entre requests:
```javascript
await new Promise(resolve => setTimeout(resolve, 100));
```

### 3. Logos Faltantes o Rotos
**Edge case**: Algunas URLs del sitemap apuntan a páginas 404.

**Handle actual**: El scraper loggea el error y continúa con el siguiente logo. Ver mejoras planeadas en [features.md](./features.md).

### 4. Tamaño del Proyecto
**Problema**: Con 1976 logos × ~30KB promedio = ~60MB de assets.

**Impacto**:
- ⚠️ Git clone lento
- ⚠️ Build inicial pesado
- ⚠️ Deploy a Vercel/Netlify puede tardar

**Mitigación**: La migración a Git LFS está contemplada en el roadmap de [features.md](./features.md).

### 5. Duplicados por Naming
**Edge case conocido**:
```
// Mismo equipo, diferentes nombres:
{ id: "spain-barcelona", name: "Barcelona" }
{ id: "spain-fc-barcelona", name: "FC Barcelona" }
```

**Estado actual**: Se mantienen ambos (no es técnicamente un duplicado). El sistema de alias se describe en [features.md](./features.md).

## Mantenimiento

### Cuándo Re-scrapear?

**Triggers para ejecutar `npm run download-logos` nuevamente:**
- ✅ Nueva temporada de fútbol (equipos nuevos)
- ✅ Rebrandings importantes (ej: "Juventus new logo 2026")
- ✅ Detección de logos faltantes en el juego

**Frecuencia recomendada**: Cada 3-6 meses.

### Validación Post-Scraping

**Checklist:**
1. ✅ Verificar que `logos.json` tenga >3000 entradas
2. ✅ Ejecutar `node sanitize-logos.js`
3. ✅ Ejecutar `node debug_logos.js` y revisar stats
4. ✅ Testear el juego localmente (`npm run dev`)
5. ✅ Verificar que logos se vean correctamente en ambos modos

## Referencias

- [football-logos.cc](https://football-logos.cc)
- [Axios Documentation](https://axios-http.com/)
- [xml2js NPM Package](https://www.npmjs.com/package/xml2js)
- [Arquitectura General](./arquitectura.md)
