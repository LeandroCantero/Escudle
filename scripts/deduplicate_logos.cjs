const fs = require('fs');
const path = require('path');

const logosPath = 'public/data/logos.json';
const publicDir = 'public';

// Backup logos.json
fs.copyFileSync(logosPath, logosPath + '.bak_dedup');

const rawData = fs.readFileSync(logosPath);
let logos = JSON.parse(rawData);

const initialCount = logos.length;

// Logic:
// 1. Group by "base name". 
// A "No Text" version usually looks like "Name No Text".
// The "Normal" version usually looks like "Name".
// We want to find pairs (A, B) where A.name === B.name + " No Text" (fuzzy match)
// Actually better: Iterate all logos. If a logo name contains " No Text", check if there is a corresponding logo WITHOUT " No Text".
// Example: "UEFA Europa League No Text" vs "UEFA Europa League".
// If both exist, marked "UEFA Europa League" for deletion.

const noTextLogos = logos.filter(l => l.name.endsWith(" No Text") || l.name.includes(" No Text"));
const idsToRemove = new Set();

noTextLogos.forEach(noTextLogo => {
    // Construct expected normal name
    // Assuming " No Text" is at the end mostly, or we replace " No Text" with empty string.
    // Case 1: "Name No Text" -> "Name"
    const normalName1 = noTextLogo.name.replace(" No Text", "").trim();
    // Case 2: "Name (No Text)" -> "Name" -- looking at data, parens aren't used for No Text usually

    // Find candidate
    const normalCandidate = logos.find(l => {
        // Must match name
        if (l.name === normalName1) return true;
        // Maybe "Name (Abbr)" vs "Name (Abbr) No Text"
        return false;
    });

    if (normalCandidate) {
        // We found a pair!
        // Constraint: "The preference is 'No Text' version".
        // So we delete 'normalCandidate'.
        idsToRemove.add(normalCandidate.id);
        console.log(`Found pair: KEEP "${noTextLogo.name}" (${noTextLogo.id}) | DELETE "${normalCandidate.name}" (${normalCandidate.id})`);
    }
});

console.log(`Found ${idsToRemove.size} duplicates to remove.`);

// Execution
let removedCount = 0;
let fileErrors = [];

logos = logos.filter(logo => {
    if (idsToRemove.has(logo.id)) {
        // Delete file
        const localPath = logo.localPath;
        const fullPath = path.join(publicDir, localPath);
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
        removedCount++;
        return false;
    }
    return true;
});

// Update logos.json
fs.writeFileSync(logosPath, JSON.stringify(logos, null, 2));

console.log(`Deduplication complete.`);
console.log(`Removed ${removedCount} entries.`);
if (fileErrors.length > 0) {
    console.log('File errors encountered:', fileErrors);
}
