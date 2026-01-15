import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to logos.json
const jsonPath = path.join(__dirname, '../public/data/logos.json');

// Read the JSON file
console.log('Reading logos.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Clean logo names
let cleanedCount = 0;
const cleanedData = data.map(logo => {
    const originalName = logo.name;
    const cleanedName = logo.name.replace(/\s+(PNG|SVG|JPEG|JPG)$/i, '').trim();

    if (originalName !== cleanedName) {
        console.log(`  "${originalName}" -> "${cleanedName}"`);
        cleanedCount++;
    }

    return {
        ...logo,
        name: cleanedName
    };
});

console.log(`\nCleaned ${cleanedCount} logo names.`);

// Write back to file
console.log('Writing updated logos.json...');
fs.writeFileSync(jsonPath, JSON.stringify(cleanedData, null, 2), 'utf8');

console.log('✓ Done!');
