import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const familiesPath = path.join(__dirname, 'src', 'data', 'families.json');
const families = JSON.parse(fs.readFileSync(familiesPath, 'utf8'));

let missingLocation = 0;
let missingLocationEn = 0;

families.forEach(f => {
    if (!f.address) {
        console.log(`${f.id}: Missing Address`);
        return;
    }
    if (!f.address.location) {
        console.log(`${f.id}: Missing address.location`);
        missingLocation++;
    } else {
        if (!f.address.location.en) {
            console.log(`${f.id}: Missing address.location.en`);
            missingLocationEn++;
        }
    }
});

console.log(`Total missing location: ${missingLocation}`);
console.log(`Total missing location.en: ${missingLocationEn}`);
