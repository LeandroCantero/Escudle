const fs = require('fs');

const logosPath = 'public/data/logos.json';
const rawData = fs.readFileSync(logosPath);
const logos = JSON.parse(rawData);

const candidates = logos.filter(logo => {
    const name = logo.name;
    const id = logo.id;

    // Criteria for "white variant"
    // It usually ends with " White" or " No Text White"
    const endsWithWhite = name.endsWith(" White");
    const containsNoTextWhite = name.includes(" No Text White");

    // Specific exclusions to be safe (Teams that might end in White)
    // Check if it's a "White" team vs a "White" variant
    // Usually variants have a corresponding "Normal" or "No Text" version.

    // Let's filter first and then we can manually review the list printed.
    if (endsWithWhite || containsNoTextWhite) {
        return true;
    }
    return false;
});

console.log(`Found ${candidates.length} candidates.`);
candidates.forEach(c => {
    console.log(`[${c.id}] ${c.name} (${c.country})`);
});
