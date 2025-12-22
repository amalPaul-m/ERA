import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const familiesPath = path.join(__dirname, 'src', 'data', 'families.json');
const families = JSON.parse(fs.readFileSync(familiesPath, 'utf8'));

console.log(`Checking ${families.length} families for render crashes...`);

let errors = 0;

families.forEach(family => {
    try {
        // access lines from FamilyDetails.jsx
        // destructure
        const { primary_member, address, family_members } = family;
        const id = family.id;

        // Line 44: primary_member.name.en
        const nameEn = primary_member.name.en;
        // Line 45: primary_member.name.ml
        const nameMl = primary_member.name.ml;

        // Line 53/55: primary_member.phone[0]
        const phone = primary_member.phone && primary_member.phone[0];

        // Line 59: blood_group
        const bg = primary_member.blood_group;

        // Line 61: address.google_maps_url (check existence)
        const mapUrl = address.google_maps_url;

        // Line 86: address.house_name.en
        const hNameEn = address.house_name.en;
        // Line 87: address.house_name.ml
        const hNameMl = address.house_name.ml;

        // Line 88: address.location.en
        const locEn = address.location.en;
        // Line 89: address.location.ml
        const locMl = address.location.ml;

        // Line 100: family_members.map
        if (family_members) {
            family_members.forEach(member => {
                // Line 103
                const mNameEn = member.name.en;
                // Line 104
                const mNameMl = member.name.ml;
                // Line 108
                const mBg = member.blood_group;
                // Line 111
                const mAge = member.age;
            });
        }

        // Line 130: address.geo.lat/lng
        if (address.geo) {
            const lat = address.geo.lat;
            const lng = address.geo.lng;
        } else {
            // If geo is missing but code accesses it inside iframe src...
            // src={`...${address.geo.lat}...`}
            // If address.geo is undefined, undefined.lat throws error
            const lat = address.geo.lat;
        }

    } catch (e) {
        console.error(`CRASH on Family ${family.id}: ${e.message}`);
        errors++;
    }
});

if (errors === 0) {
    console.log("No render crashes detected in simulation.");
} else {
    console.log(`Detected ${errors} crashes.`);
}
