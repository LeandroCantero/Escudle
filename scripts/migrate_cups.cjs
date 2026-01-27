const fs = require('fs');
const path = require('path');

const logosPath = 'public/data/logos.json';
const publicDir = 'public';

// Backup logos.json
fs.copyFileSync(logosPath, logosPath + '.bak');

const rawData = fs.readFileSync(logosPath);
const logos = JSON.parse(rawData);

// Identifying candidates again to be precise
const exactTerms = ['cup', 'copa', 'pokal', 'trophy', 'shield', 'coppa', 'coupe', 'taça', 'taca'];

const candidates = logos.filter(logo => {
    if (logo.type === 'tournament' || logo.country === 'tournaments') return false;

    const nameLower = logo.name.toLowerCase();
    return exactTerms.some(term => nameLower.includes(term));
});

console.log(`Found ${candidates.length} candidates to migrate.`);

let movedCount = 0;
let errors = [];

candidates.forEach(logo => {
    const oldLocalPath = logo.localPath;
    const filename = path.basename(oldLocalPath);

    // Construct absolute paths
    const oldFullPath = path.join(publicDir, oldLocalPath);
    const newLocalPath = `/logos/tournaments/${filename}`;
    const newFullPath = path.join(publicDir, 'logos', 'tournaments', filename);

    // Ensure target directory exists (it should, but good to be safe)
    const targetDir = path.dirname(newFullPath);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Move file
    try {
        if (fs.existsSync(oldFullPath)) {
            // If strict move is needed, use rename. 
            // If we want to be safe, copy then unlink, or just rename.
            fs.renameSync(oldFullPath, newFullPath);
            console.log(`Moved: ${filename}`);
        } else {
            console.error(`File not found: ${oldFullPath}`);
            // We might still want to update the JSON if the file is missing but the entry exists?
            // Let's assume we update JSON anyway to match intended state, 
            // but log the error.
            errors.push(`File missing: ${oldLocalPath}`);
        }
    } catch (err) {
        console.error(`Error moving ${oldFullPath}:`, err);
        errors.push(`Error moving ${filename}: ${err.message}`);
        return; // Skip JSON update if file move failed significantly
    }

    // Update JSON object
    logo.country = 'tournaments';
    logo.type = 'tournament';
    logo.localPath = newLocalPath;

    movedCount++;
});

// Update logos.json
fs.writeFileSync(logosPath, JSON.stringify(logos, null, 2));

console.log(`Migration complete.`);
console.log(`Updated ${movedCount} entries.`);
if (errors.length > 0) {
    console.log('Errors encountered:', errors);
}
