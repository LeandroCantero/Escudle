const fs = require('fs');
const path = require('path');

const logosPath = 'public/data/logos.json';
const publicDir = 'public';

// Backup logos.json
fs.copyFileSync(logosPath, logosPath + '.bak_white_removal');

const rawData = fs.readFileSync(logosPath);
let logos = JSON.parse(rawData);

const initialCount = logos.length;

// Filter criteria logic again to be exact
const toRemove = logos.filter(logo => {
    const name = logo.name;
    return name.endsWith(" White") || name.includes(" No Text White");
});

console.log(`Found ${toRemove.length} items to remove.`);

let removedCount = 0;
let fileErrors = [];

toRemove.forEach(logo => {
    const localPath = logo.localPath;
    const fullPath = path.join(publicDir, localPath);

    // Delete file
    try {
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted file: ${localPath}`);
        } else {
            console.warn(`File not found (skip delete): ${localPath}`);
        }
    } catch (err) {
        console.error(`Error deleting ${fullPath}:`, err);
        fileErrors.push(`Error deleting ${localPath}: ${err.message}`);
    }
});

// Update logos array by excluding the removed items
logos = logos.filter(logo => {
    const name = logo.name;
    const shouldRemove = name.endsWith(" White") || name.includes(" No Text White");
    return !shouldRemove;
});

const finalCount = logos.length;
removedCount = initialCount - finalCount;

// Write updated logos.json
fs.writeFileSync(logosPath, JSON.stringify(logos, null, 2));

console.log(`Removal complete.`);
console.log(`Removed ${removedCount} entries from JSON.`);
if (fileErrors.length > 0) {
    console.log('File errors encountered:', fileErrors);
}
