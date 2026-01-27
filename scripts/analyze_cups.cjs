
const fs = require('fs');
const path = require('path');

const logosPath = 'public/data/logos.json';
const rawData = fs.readFileSync(logosPath);
const logos = JSON.parse(rawData);

const terms = ['cup', 'copa', 'pokal', 'trophy', 'shield']; // Adding more terms just in case, but will focus on cup/copa
const exactTerms = ['cup', 'copa', 'pokal', 'trophy', 'shield', 'coppa', 'coupe', 'taça', 'taca'];

const candidates = logos.filter(logo => {
    if (logo.type === 'tournament' || logo.country === 'tournaments') return false;

    const nameLower = logo.name.toLowerCase();
    // Check if name contains key terms
    return exactTerms.some(term => nameLower.includes(term));
});

console.log(`Found ${candidates.length} candidates.`);

// Group by country to see distribution
const byCountry = {};
candidates.forEach(c => {
    byCountry[c.country] = (byCountry[c.country] || 0) + 1;
});

console.log('Candidates by country:', JSON.stringify(byCountry, null, 2));

// Log first 10 candidates to check
console.log('First 10 candidates:', JSON.stringify(candidates.slice(0, 10), null, 2));

// Write candidates to a file for deeper inspection
fs.writeFileSync('candidates.json', JSON.stringify(candidates, null, 2));
