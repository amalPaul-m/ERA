import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const familiesPath = path.join(__dirname, 'src', 'data', 'families.json');
const families = JSON.parse(fs.readFileSync(familiesPath, 'utf8'));

const normalizeString = (val) => val === null || val === undefined ? "" : val;
const normalizeArray = (val) => Array.isArray(val) ? val : [];

const normalizedFamilies = families.map(f => {
    // Normalize Primary Member
    if (f.primary_member) {
        f.primary_member.blood_group = normalizeString(f.primary_member.blood_group);
        f.primary_member.phone = normalizeArray(f.primary_member.phone);

        // Ensure name object exists
        if (!f.primary_member.name) f.primary_member.name = { en: "", ml: "" };
        f.primary_member.name.en = normalizeString(f.primary_member.name.en);
        f.primary_member.name.ml = normalizeString(f.primary_member.name.ml);
    }

    // Normalize Address
    if (f.address) {
        if (!f.address.house_name) f.address.house_name = { en: "", ml: "" };
        f.address.house_name.en = normalizeString(f.address.house_name.en);
        f.address.house_name.ml = normalizeString(f.address.house_name.ml);
    }

    // Normalize Family Members
    f.family_members = normalizeArray(f.family_members).map(m => {
        m.blood_group = normalizeString(m.blood_group);
        if (!m.name) m.name = { en: "", ml: "" };
        m.name.en = normalizeString(m.name.en);
        m.name.ml = normalizeString(m.name.ml);
        return m;
    });

    return f;
});

fs.writeFileSync(familiesPath, JSON.stringify(normalizedFamilies, null, 4), 'utf8');
console.log(`Successfully normalized ${normalizedFamilies.length} records.`);
