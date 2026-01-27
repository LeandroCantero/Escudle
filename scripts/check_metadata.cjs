const fs = require('fs');

const logosPath = 'public/data/logos.json';
const rawData = fs.readFileSync(logosPath);
const logos = JSON.parse(rawData);

console.log('Total logos:', logos.length);

const inconsistencies = logos.filter(l => {
    const inTournamentFolder = l.localPath.includes('/tournaments/');
    const isTournamentType = l.type === 'tournament';
    const isTournamentCountry = l.country === 'tournaments';

    if (inTournamentFolder) {
        if (!isTournamentType || !isTournamentCountry) {
            return true;
        }
    }
    return false;
});

console.log('Inconsistencies found:', inconsistencies.length);
inconsistencies.forEach(l => {
    console.log(`[${l.id}] Path: ${l.localPath} | Country: ${l.country} | Type: ${l.type}`);
});

const movedCandidatesCheck = [
    "germany-dfb-pokal-logo-high-res-png",
    "england-emirates-fa-cup-logo-high-res-png",
    "spain-copa-del-rey-logo-high-res-png"
];

console.log('\nChecking specific migrated items:');
movedCandidatesCheck.forEach(id => {
    const l = logos.find(x => x.id === id);
    if (l) {
        console.log(`[${l.id}] Path: ${l.localPath} | Country: ${l.country} | Type: ${l.type}`);
    } else {
        console.log(`[${id}] NOT FOUND`);
    }
});
