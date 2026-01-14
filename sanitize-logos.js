
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join('d:', 'Study', 'Real Projects', 'Escudle', 'public', 'data', 'logos.json');

try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    let logos = JSON.parse(rawData);
    let modifiedCount = 0;

    console.log(`Processing ${logos.length} logos...`);

    logos = logos.map(logo => {
        let newName = logo.name;

        // 1. Remove (High-Res PNG) variants
        newName = newName.replace(/\(High-Res PNG\)/gi, '');
        newName = newName.replace(/- High-Res PNG/gi, '');
        newName = newName.replace(/High-Res PNG/gi, '');

        // 2. Remove "Logo" word (stand-alone)
        // \b matches word boundary, so "Logo" but not "Logos" (though unlikely) or inside another word
        newName = newName.replace(/\bLogo\b/gi, '');

        // 3. Remove redundant date patterns like (1930-1936) or 1930-1936
        // Only if isHistorical is true, to be safe, or just generally if it matches the period
        if (logo.isHistorical) {
            // Pattern: (YYYY-YYYY) or YYYY-YYYY
            // We want to be careful not to remove dates if they are part of the club name (e.g. 1860 Munich), 
            // but usually these are ranges.
            newName = newName.replace(/\(\d{4}-\d{4}\)/g, '');
            newName = newName.replace(/\d{4}-\d{4}/g, '');
        }

        // 4. Clean up
        // Remove "Old" if it precedes the name? The user example was "Old Arsenal". 
        // User didn't explicitly ask to remove "Old", just "Logo" and dates. 
        // "Old Arsenal" might be a valid descriptor if there are multiple historicals.
        // I will keep "Old" for now as it distinguishes from current.

        // Remove extra dashes that might remain: "Old Arsenal - "
        newName = newName.replace(/\s+-\s*$/, ''); // Dash at end
        newName = newName.replace(/^\s*-\s+/, ''); // Dash at start
        newName = newName.replace(/\s+/g, ' ').trim(); // Collapse multiple spaces

        if (newName !== logo.name) {
            modifiedCount++;
            // Log first 5 changes for verification
            if (modifiedCount <= 5) {
                console.log(`Changed: "${logo.name}" -> "${newName}"`);
            }
            return { ...logo, name: newName };
        }
        return logo;
    });

    console.log(`Total modified: ${modifiedCount}`);

    fs.writeFileSync(dataPath, JSON.stringify(logos, null, 2), 'utf8');
    console.log('Successfully saved to logos.json');

} catch (e) {
    console.error('Error processing logos:', e);
}
