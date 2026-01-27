const fs = require('fs');

const logosPath = 'public/data/logos.json';
const rawData = fs.readFileSync(logosPath);
const logos = JSON.parse(rawData);

let fixedCount = 0;

logos.forEach(logo => {
    // Check if the file is in the tournaments folder
    if (logo.localPath && logo.localPath.includes('/logos/tournaments/')) {
        let changed = false;

        // Enforce country
        if (logo.country !== 'tournaments') {
            logo.country = 'tournaments';
            changed = true;
        }

        // Enforce type
        if (logo.type !== 'tournament') {
            logo.type = 'tournament';
            changed = true;
        }

        if (changed) {
            fixedCount++;
            // console.log(`Fixed metadata for: ${logo.name}`);
        }
    }
});

fs.writeFileSync(logosPath, JSON.stringify(logos, null, 2));

console.log(`Fixed metadata for ${fixedCount} entries.`);
