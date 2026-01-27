const fs = require('fs');
const path = require('path');

const logosPath = 'public/data/logos.json';
const tournamentsDir = 'public/logos/tournaments';

const rawData = fs.readFileSync(logosPath);
const logos = JSON.parse(rawData);

// Get all files in tournaments folder
const files = fs.readdirSync(tournamentsDir).filter(f => f.endsWith('.svg') || f.endsWith('.png'));
console.log(`Files in ${tournamentsDir}: ${files.length}`);

// Get all JSON entries with type 'tournament'
const tournamentEntries = logos.filter(l => l.type === 'tournament');
console.log(`JSON entries with type 'tournament': ${tournamentEntries.length}`);

// Check 1: Which JSON entry doesn't have a corresponding file?
console.log('\n--- Checking for missing files ---');
const missingFiles = [];
tournamentEntries.forEach(l => {
    const filename = path.basename(l.localPath);
    if (!files.includes(filename)) {
        console.log(`[MISSING FILE] JSON Entry: ${l.name} (${l.id}) points to ${filename} which is NOT in folder.`);
        missingFiles.push(l);
    }
});

if (missingFiles.length === 0) {
    console.log("All JSON tournament entries have files in the folder.");
}

// Check 2: Which file is not in JSON?
console.log('\n--- Checking for untracked files ---');
const untrackedFiles = [];
files.forEach(f => {
    // Check if any tracked tournament entry points to this file
    const match = tournamentEntries.find(l => path.basename(l.localPath) === f);
    if (!match) {
        // Double check if ANY logo points to it (maybe wrong type?)
        const anyMatch = logos.find(l => path.basename(l.localPath) === f);
        if (anyMatch) {
            console.log(`[WRONG TYPE] File ${f} exists but is type '${anyMatch.type}' instead of 'tournament'.`);
        } else {
            console.log(`[UNTRACKED] File ${f} exists but is NOT in JSON.`);
        }
        untrackedFiles.push(f);
    }
});

if (untrackedFiles.length === 0) {
    console.log("All files in folder are tracked as tournaments in JSON.");
}
