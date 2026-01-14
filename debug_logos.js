
import fs from 'fs';
import path from 'path';

const dataPath = path.join('d:', 'Study', 'Real Projects', 'Escudle', 'src', 'data', 'logos.json');

try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const historical = data.filter(d => d.isHistorical).slice(0, 5);
    console.log(JSON.stringify(historical, null, 2));
} catch (e) {
    console.error(e);
}
