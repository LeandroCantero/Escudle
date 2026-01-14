---
last_update: 14-01-2026
context: Sistema de Búsqueda de Logos
purpose: Documentación del hook useLogoSearch y el algoritmo de fuzzy matching con Fuse.js
---

# Sistema de Búsqueda - useLogoSearch

## Rationale (El "Por qué")

Durante el juego, el usuario necesita escribir el nombre de un equipo de fútbol entre miles de opciones (~3200 logos). Una búsqueda exacta (`string.includes`) genera mala UX:

**Problemas de búsqueda exacta:**
- ❌ No encuentra "Real Madrid" si el usuario escribe "real madrid" (case sensitive)
- ❌ No tolera typos comunes: "Arsenl" no matchea "Arsenal"
- ❌ No entiende nombres parciales: "Barca" no matchea "Barcelona"
- ❌ No soporta alternativas: "Barça" vs "Barcelona"

**Solución: Fuzzy Search con Fuse.js**
- ✅ Matching aproximado basado en Levenshtein distance
- ✅ Case-insensitive por defecto
- ✅ Configurable con threshold de similaridad
- ✅ Performance optimizada para búsquedas en tiempo real

**Trade-off:**
- **Precisión vs Velocidad**: threshold muy bajo (0.0-0.2) = matches exactos pero frustrante; threshold alto (0.5-1.0) = demasiados resultados irrelevantes
- **Configuración actual: 0.3** - Balance óptimo encontrado empíricamente

## Data Shapes

### Input: Logo Interface
```typescript
interface Logo {
  id: string;              // Unique identifier
  name: string;            // Searchable field (ej: "Arsenal")
  country: string;         // Metadata para filtros futuros
  isHistorical: boolean;   // Usado para filtrar por modo de juego
  period: string | null;   
  localPath?: string;      
  pageUrl: string;
}
```

### Configuration Options
```typescript
interface UseLogoSearchOptions {
  threshold?: number;  // 0.0 (exacto) a 1.0 (cualquier cosa)
  limit?: number;      // Máximo de resultados retornados
}
```

### Output: Logo[]
Array de logos ordenados por score de similaridad (mejor match primero), limitados al `limit` especificado.

## Implementación

### Hook: useLogoSearch
```typescript
export function useLogoSearch(
  items: Logo[],
  searchTerm: string,
  options: UseLogoSearchOptions = {}
): Logo[]
```

**Características:**
1. **Memoización de Fuse instance**: Se recrea solo si cambian `items` o `threshold`
2. **Búsqueda memoizada**: Resultados se cachean por `searchTerm`
3. **Threshold mínimo**: No busca si `searchTerm < 2 caracteres` (evita resultados basura)
4. **Keys configuradas**: Solo busca en campo `name` (no en country, id, etc.)

### Configuración de Fuse.js

```typescript
new Fuse(items, {
  keys: ['name'],           // Solo buscar en nombre del equipo
  threshold: 0.3,           // Sweet spot entre precisión y flexibilidad
  ignoreLocation: true,     // Match en cualquier parte del string
  includeScore: true        // Permite ordenar por relevancia
})
```

**Parámetros clave:**
- `keys: ['name']` - Si en el futuro se quiere buscar por país, agregar `'country'`
- `ignoreLocation: true` - "Real" matchea "Real Madrid" aunque esté al inicio
- `includeScore: true` - Necesario para ordenar resultados por relevancia

## Boundary Rules

**useLogoSearch debe:**
- Encapsular toda la lógica de Fuse.js
- Retornar array de logos filtrados y ordenados
- Ser un pure hook (sin side effects)
- Ser performance-efficient (memoization)

**useLogoSearch NO debe:**
- ❌ Conocer el estado del juego (guesses, gameState, targetLogo)
- ❌ Renderizar UI
- ❌ Filtrar por modos de juego (eso es responsabilidad del componente padre)
- ❌ Hacer fetch de datos

## Decision Log

### 13-01-2026: Migración de Búsqueda Exacta a Fuzzy
**Antes:**
```typescript
const suggestions = allLogos.filter(logo => 
  logo.name.toLowerCase().includes(inputValue.toLowerCase())
);
```

**Después:**
```typescript
const suggestions = useLogoSearch(filteredLogos, inputValue, {
  limit: 10,
  threshold: 0.3
});
```

**Razón del cambio:**
- Usuarios reportaban frustración al no encontrar "Man Utd", "Barca", etc.
- Testing manual reveló que threshold 0.3 era óptimo:
  - 0.2: Demasiado estricto, "Arsenl" no matchea
  - 0.4: Demasiado laxo, "Real" trae 50+ resultados irrelevantes
  - 0.3: Perfecto balance

### 14-01-2026: Límite de 2 Caracteres
**Problema**: Con 1 carácter ("a"), Fuse retornaba 100+ matches.

**Solución**: Early return si `searchTerm.trim().length < 2`

**Impacto en UX**: 
- ✅ Dropdown no aparece hasta escribir 2 letras
- ✅ Reduce carga computacional innecesaria
- ⚠️ Equipos con 1 letra requieren espacio: "A " (edge case extremo)

## Known Pitfalls

### 1. Re-renders en cada keystroke
**Advertencia**: Este hook se ejecuta cada vez que `searchTerm` cambia (cada tecla presionada).

**Mitigación:**
- `useMemo` tanto para Fuse instance como para results
- Threshold de 2 caracteres reduce ejecuciones innecesarias
- Con 3200 logos, aún es fast (~10-20ms en hardware moderno)

**Métrica de performance**: Planes para optimizar el dataset si crece (debounce, workers) se detallan en el roadmap de [features.md](./features.md).

### 2. Resultados Ambiguos
**Caso edge**: "Manchester" matchea:
- Manchester United
- Manchester City  
- Manchester United (histórico 1960)
- ... y más

**Comportamiento actual**: Muestra TODOS (hasta el `limit`), ordenados por score.

**Alternativa considerada pero NO implementada**: Autocomplete agresivo (auto-seleccionar el primero). Rechazado porque limita exploración del usuario.

### 3. Acentos y Caracteres Especiales
**Estado actual**: El JSON de logos usa nombres oficiales tal cual vienen del scraper. La normalización de acentos está contemplada como feature futuro en [features.md](./features.md).

### 4. Dependencia de filteredLogos
**IMPORTANTE**: En app.tsx, el hook recibe `filteredLogos` (ya filtrado por modo):

```typescript
const filteredLogos = useMemo(() => {
  return allLogos.filter(l => mode === 'easy' ? !l.isHistorical : l.isHistorical);
}, [mode]);

const suggestions = useLogoSearch(filteredLogos, inputValue, {...});
```

Esto es correcto porque:
- ✅ Evita mostrar logos históricos en modo fácil
- ✅ Reduce el espacio de búsqueda (mejora performance)
- ⚠️ Si se pasa `allLogos` por error, el usuario verá sugerencias de logos que no están en el juego actual

## Testing Manual

### Casos de prueba validados:
1. ✅ "real" → Encuentra "Real Madrid", "Real Sociedad", etc.
2. ✅ "barca" → Encuentra "Barcelona"
3. ✅ "arsenl" (typo) → Encuentra "Arsenal"
4. ✅ "man" → Muestra Manchester United, Manchester City ordenados
5. ✅ "a" (1 char) → No busca, retorna []
6. ✅ "xyz123" (nonsense) → Retorna []

### Casos edge pendientes de validación:
- [ ] Nombres con acentos: "São Paulo", "Atlético"
- [ ] Nombres muy cortos: "AC Milan" → "ac" debería matchear
- [ ] Nombres con números: "1860 München"

## Referencias

- [Fuse.js Documentation](https://fusejs.io/)
- [Arquitectura General](./arquitectura.md)
