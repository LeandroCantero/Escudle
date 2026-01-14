import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'public', 'data', 'logos.json');

try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const historical = data.filter(d => d.isHistorical).slice(0, 5);
    console.log(JSON.stringify(historical, null, 2));
} catch (e) {
    console.error(e);
}
