# ⚽ Football Logos Scraper

Script para obtener todos los logos de fútbol (actuales + históricos) desde football-logos.cc.

## 🎯 Características

- ✅ Descarga y parsea el sitemap XML completo
- ✅ Extrae metadata completa de cada logo
- ✅ Detecta automáticamente logos históricos
- ✅ Separa URLs de SVG y PNG
- ✅ Identifica país/liga
- ✅ Genera IDs únicos
- ✅ Guarda todo en JSON estructurado

## 📦 Instalación

```bash
npm install
```

## 🚀 Uso

```bash
npm run scrape
```

El script generará un archivo `football-logos.json` con todos los logos.

## 📊 Estructura del JSON

```json
[
  {
    "id": "england-arsenal-1930-1936",
    "name": "Arsenal",
    "country": "england",
    "isHistorical": true,
    "period": "1930-1936",
    "startYear": 1930,
    "endYear": 1936,
    "svgUrl": "https://assets.football-logos.cc/logos/england/arsenal-1930-1936.abc123.svg",
    "pngUrl": "https://assets.football-logos.cc/logos/england/3000x3000/arsenal-1930-1936.abc123.png",
    "pageUrl": "https://football-logos.cc/england/arsenal/1930-1936/"
  },
  {
    "id": "england-arsenal",
    "name": "Arsenal",
    "country": "england",
    "isHistorical": false,
    "period": null,
    "startYear": null,
    "endYear": null,
    "svgUrl": "https://assets.football-logos.cc/logos/england/arsenal.def456.svg",
    "pngUrl": "https://assets.football-logos.cc/logos/england/3000x3000/arsenal.def456.png",
    "pageUrl": "https://football-logos.cc/england/arsenal/"
  }
]
```

## 🎮 Uso para Logodle

### Filtrar por modo de juego

```javascript
import logos from './football-logos.json' assert { type: 'json' };

// Modo Normal: Solo logos actuales
const currentLogos = logos.filter(logo => !logo.isHistorical);

// Modo Difícil: Solo logos históricos
const historicalLogos = logos.filter(logo => logo.isHistorical);

// Modo Experto: Logos anteriores a 1970
const oldLogos = logos.filter(logo => 
  logo.isHistorical && logo.startYear && logo.startYear < 1970
);

// Por liga específica
const premierLeague = logos.filter(logo => logo.country === 'england');
```

### Obtener logo aleatorio

```javascript
function getRandomLogo(logoArray) {
  return logoArray[Math.floor(Math.random() * logoArray.length)];
}

const randomLogo = getRandomLogo(currentLogos);
console.log(randomLogo.name, randomLogo.svgUrl);
```

## 📈 Estadísticas

El script muestra automáticamente:
- Total de logos extraídos
- Logos actuales vs históricos
- Número de países/ligas

## 🛠️ Dependencias

- `axios` - Para descargar el sitemap XML
- `xml2js` - Para parsear el XML

## 📝 Notas

- El scraper respeta la estructura del sitemap oficial
- Los IDs son únicos y válidos para uso en base de datos
- Las URLs de SVG son ideales para web (escalables)
- Las URLs de PNG son de alta resolución (3000x3000)
# Escudle
