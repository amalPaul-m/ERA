import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load families data
const familiesPath = path.join(__dirname, 'src', 'data', 'families.json');
const families = JSON.parse(fs.readFileSync(familiesPath, 'utf8'));

console.log(`Loaded ${families.length} families.`);

// The buggy search function logic copied from src/context/FamilyContext.jsx
const searchFamilies = (query) => {
    if (!query) return families;
    const lowerQuery = query.toLowerCase();

    return families.filter(family => {
        const pm = family.primary_member;

        // Logic from FamilyContext.jsx lines 67-73
        // This relies on name.en and name.ml existing
        const nameMatch = pm.name.en.toLowerCase().includes(lowerQuery) ||
            pm.name.ml.includes(query);

        const idMatch = family.id.toLowerCase().includes(lowerQuery);

        // This is expected to crash if phone is undefined/null
        // In the actual code: pm.phone.some(...)
        let phoneMatch = false;
        // Simulating the exact code:
        phoneMatch = pm.phone.some(p => p.includes(query));

        // This is expected to crash if blood_group is null
        // In the actual code: pm.blood_group.toLowerCase()...
        const bloodMatch = pm.blood_group.toLowerCase().includes(lowerQuery);

        return nameMatch || idMatch || phoneMatch || bloodMatch;
    });
};

try {
    console.log("Attempting search for 'O +ve'...");
    const results = searchFamilies("O +ve");
    console.log(`Search completed successfully. Found ${results.length} matches.`);
} catch (error) {
    console.error("\nCRASH GENERATED AS EXPECTED!");
    console.error("Error:", error.message);
}
