import axios from 'axios';
import { parseString } from 'xml2js';
import { promises as fs } from 'fs';

const SITEMAP_URL = 'https://football-logos.cc/image-sitemap.xml';
const OUTPUT_FILE = 'football-logos.json';

/**
 * Extrae el país/liga desde la URL de la página
 * Ejemplo: "https://football-logos.cc/england/arsenal/" → "england"
 */
function extractCountry(pageUrl) {
  const match = pageUrl.match(/football-logos\.cc\/([^\/]+)\//);
  return match ? match[1] : 'unknown';
}

/**
 * Detecta si es histórico y extrae el período
 * Ejemplo: "/arsenal-1930-1936/" → { isHistorical: true, period: "1930-1936" }
 */
function detectHistoricalInfo(url) {
  const periodMatch = url.match(/\/(\d{4})-(\d{4})\//);
  
  if (periodMatch) {
    return {
      isHistorical: true,
      period: periodMatch[0].replace(/\//g, ''), // "1930-1936"
      startYear: parseInt(periodMatch[1]),
      endYear: parseInt(periodMatch[2])
    };
  }
  
  return {
    isHistorical: false,
    period: null,
    startYear: null,
    endYear: null
  };
}

/**
 * Genera un ID único para el logo
 * Ejemplo: "arsenal-1930-1936" o "arsenal"
 */
function generateId(name, country, period) {
  const baseName = name.toLowerCase().replace(/\s+/g, '-');
  const countryPrefix = country !== 'unknown' ? `${country}-` : '';
  
  if (period) {
    return `${countryPrefix}${baseName}-${period}`;
  }
  
  return `${countryPrefix}${baseName}`;
}

/**
 * Parsea el XML del sitemap y extrae todos los logos
 */
async function parseSitemap() {
  try {
    console.log('📥 Descargando sitemap XML...');
    const response = await axios.get(SITEMAP_URL);
    const xmlData = response.data;
    
    console.log('🔍 Parseando XML...');
    return new Promise((resolve, reject) => {
      parseString(xmlData, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        
        const urls = result.urlset.url || [];
        const logos = [];
        
        console.log(`📊 Procesando ${urls.length} entradas...`);
        
        for (const urlEntry of urls) {
          try {
            const pageUrl = urlEntry.loc[0];
            const images = urlEntry['image:image'] || [];
            
            // Algunas entradas pueden tener múltiples imágenes (SVG, PNG)
            if (images.length === 0) continue;
            
            const imageData = images[0];
            const title = imageData['image:title'] ? imageData['image:title'][0] : 'Unknown';
            const imageLocs = images.map(img => img['image:loc'][0]);
            
            // Separar SVG y PNG
            const svgUrl = imageLocs.find(url => url.endsWith('.svg'));
            const pngUrl = imageLocs.find(url => url.endsWith('.png'));
            
            const country = extractCountry(pageUrl);
            const historicalInfo = detectHistoricalInfo(pageUrl);
            
            const logo = {
              id: generateId(title, country, historicalInfo.period),
              name: title,
              country: country,
              isHistorical: historicalInfo.isHistorical,
              period: historicalInfo.period,
              startYear: historicalInfo.startYear,
              endYear: historicalInfo.endYear,
              svgUrl: svgUrl || null,
              pngUrl: pngUrl || null,
              pageUrl: pageUrl
            };
            
            logos.push(logo);
          } catch (error) {
            console.error(`⚠️  Error procesando entrada: ${error.message}`);
          }
        }
        
        resolve(logos);
      });
    });
  } catch (error) {
    console.error('❌ Error descargando o parseando sitemap:', error.message);
    throw error;
  }
}

/**
 * Guarda los logos en un archivo JSON
 */
async function saveToFile(logos) {
  try {
    console.log(`💾 Guardando ${logos.length} logos en ${OUTPUT_FILE}...`);
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(logos, null, 2), 'utf-8');
    console.log('✅ Archivo guardado exitosamente!');
    
    // Estadísticas
    const historical = logos.filter(l => l.isHistorical).length;
    const current = logos.filter(l => !l.isHistorical).length;
    const countries = new Set(logos.map(l => l.country)).size;
    
    console.log('\n📈 Estadísticas:');
    console.log(`   Total de logos: ${logos.length}`);
    console.log(`   Logos actuales: ${current}`);
    console.log(`   Logos históricos: ${historical}`);
    console.log(`   Países/Ligas: ${countries}`);
  } catch (error) {
    console.error('❌ Error guardando archivo:', error.message);
    throw error;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando scraper de football-logos.cc\n');
  
  try {
    const logos = await parseSitemap();
    await saveToFile(logos);
    
    console.log('\n✨ Proceso completado exitosamente!');
    console.log(`📁 Archivo generado: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('\n❌ Error fatal:', error.message);
    process.exit(1);
  }
}

// Ejecutar
main();
