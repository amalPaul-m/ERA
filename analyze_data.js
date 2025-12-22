import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const familiesPath = path.join(__dirname, 'src', 'data', 'families.json');
const families = JSON.parse(fs.readFileSync(familiesPath, 'utf8'));

let issues = {
    nullBloodGroup: 0,
    missingPhone: 0,
    nullPhone: 0,
    missingFamilyMembers: 0,
    nullFamilyMembers: 0,
    nullMemberBloodGroup: 0
};

families.forEach(f => {
    const pm = f.primary_member;
    if (pm.blood_group === null) issues.nullBloodGroup++;
    if (pm.phone === undefined) issues.missingPhone++;
    if (pm.phone === null) issues.nullPhone++;

    if (f.family_members === undefined) issues.missingFamilyMembers++;
    if (f.family_members === null) issues.nullFamilyMembers++;

    if (Array.isArray(f.family_members)) {
        f.family_members.forEach(m => {
            if (m.blood_group === null) issues.nullMemberBloodGroup++;
        });
    }
});

console.log("Data Analysis Report:");
console.log(JSON.stringify(issues, null, 2));
