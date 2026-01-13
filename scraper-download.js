import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseString } from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_URL = 'https://football-logos.cc/image-sitemap.xml';
const OUTPUT_FILE = 'football-logos.json';
const LOGOS_DIR = path.join(__dirname, 'public', 'logos');

// Limitar a cuántos logos descargar (puedes aumentar después)
const MAX_LOGOS = 10000; // Suficiente para cubrir los ~2400 del sitemap

/**
 * Crea el directorio de logos si no existe
 */
async function ensureLogosDirectory() {
    try {
        await fs.mkdir(LOGOS_DIR, { recursive: true });
        console.log(`📁 Directorio creado: ${LOGOS_DIR}`);
    } catch (error) {
        console.error('Error creando directorio:', error.message);
    }
}

/**
 * Descarga una imagen y la guarda localmente
 */
async function downloadImage(url, filename) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://football-logos.cc/'
            },
            timeout: 10000
        });

        const filepath = path.join(LOGOS_DIR, filename);
        await fs.writeFile(filepath, response.data);
        return true;
    } catch (error) {
        console.error(`   ❌ Error descargando ${filename}: ${error.message}`);
        return false;
    }
}

/**
 * Extrae el país/liga desde la URL de la página
 */
function extractCountry(pageUrl) {
    const match = pageUrl.match(/football-logos\.cc\/([^\/]+)\//);
    return match ? match[1] : 'unknown';
}

/**
 * Detecta si es histórico y extrae el período
 */
function detectHistoricalInfo(url) {
    const periodMatch = url.match(/\/(\d{4})-(\d{4})\//);

    if (periodMatch) {
        return {
            isHistorical: true,
            period: periodMatch[0].replace(/\//g, ''),
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
 */
function generateId(name, country, period) {
    const baseName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const countryPrefix = country !== 'unknown' ? `${country}-` : '';

    if (period) {
        return `${countryPrefix}${baseName}-${period}`;
    }

    return `${countryPrefix}${baseName}`;
}

/**
 * Genera un filename seguro para el archivo
 */
function generateFilename(id, url) {
    const extension = url.endsWith('.svg') ? 'svg' : 'png';
    return `${id}.${extension}`;
}

/**
 * Parsea el XML del sitemap y descarga los logos
 */
async function parseSitemapAndDownload() {
    try {
        console.log('📥 Descargando sitemap XML...');
        const response = await axios.get(SITEMAP_URL);
        const xmlData = response.data;

        console.log('🔍 Parseando XML...');
        return new Promise((resolve, reject) => {
            parseString(xmlData, async (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                const urls = result.urlset.url || [];
                const logos = [];

                console.log(`📊 Procesando primeros ${MAX_LOGOS} escudos de ${urls.length} totales...`);
                console.log('⏳ Esto tomará varios minutos...\n');

                await ensureLogosDirectory();

                let processed = 0;

                for (const urlEntry of urls.slice(0, MAX_LOGOS)) {
                    try {
                        const pageUrl = urlEntry.loc[0];
                        const images = urlEntry['image:image'] || [];

                        if (images.length === 0) continue;

                        const imageData = images[0];
                        const title = imageData['image:title'] ? imageData['image:title'][0] : 'Unknown';
                        const imageLocs = images.map(img => img['image:loc'][0]);

                        const svgUrl = imageLocs.find(url => url.endsWith('.svg'));
                        const pngUrl = imageLocs.find(url => url.endsWith('.png'));

                        const country = extractCountry(pageUrl);
                        const historicalInfo = detectHistoricalInfo(pageUrl);
                        const id = generateId(title, country, historicalInfo.period);

                        // Descargar SVG (preferido)
                        const imageUrl = svgUrl || pngUrl;
                        if (!imageUrl) continue;

                        const filename = generateFilename(id, imageUrl);

                        console.log(`[${processed + 1}/${MAX_LOGOS}] Descargando: ${title} (${country})...`);
                        const success = await downloadImage(imageUrl, filename);

                        if (success) {
                            const logo = {
                                id: id,
                                name: title,
                                country: country,
                                isHistorical: historicalInfo.isHistorical,
                                period: historicalInfo.period,
                                startYear: historicalInfo.startYear,
                                endYear: historicalInfo.endYear,
                                localPath: `/logos/${filename}`,
                                pageUrl: pageUrl
                            };

                            logos.push(logo);
                        }

                        processed++;

                        // Rate limiting para no sobrecargar el servidor
                        await new Promise(resolve => setTimeout(resolve, 100));

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
        console.log(`\n💾 Guardando ${logos.length} logos en ${OUTPUT_FILE}...`);
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
    console.log('🚀 Iniciando scraper de football-logos.cc con descarga local\n');

    try {
        const logos = await parseSitemapAndDownload();
        await saveToFile(logos);

        console.log('\n✨ Proceso completado exitosamente!');
        console.log(`📁 Archivo generado: ${OUTPUT_FILE}`);
        console.log(`📁 Logos guardados en: ${LOGOS_DIR}`);
    } catch (error) {
        console.error('\n❌ Error fatal:', error.message);
        process.exit(1);
    }
}

// Ejecutar
main();
