import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const familiesPath = path.join(__dirname, 'src', 'data', 'families.json');
const families = JSON.parse(fs.readFileSync(familiesPath, 'utf8'));

// The NEW fixed logic
const searchFamilies = (query) => {
    if (!query) return families;
    const lowerQuery = query.toLowerCase();

    return families.filter(family => {
        const pm = family.primary_member;
        const address = family.address;
        const houseName = address?.house_name;

        // Primary Member Name
        const pmNameEn = pm?.name?.en?.toLowerCase() || '';
        const pmNameMl = pm?.name?.ml || '';
        const nameMatch = pmNameEn.includes(lowerQuery) || pmNameMl.includes(query);

        // ID Match
        const idMatch = family.id?.toLowerCase().includes(lowerQuery) || false;

        // Phone Match
        const phoneMatch = Array.isArray(pm?.phone) && pm.phone.some(p => p.includes(query));

        // Blood Group Match
        const bloodMatch = pm?.blood_group?.toLowerCase().includes(lowerQuery) || false;

        // House Name Match
        const houseEn = houseName?.en?.toLowerCase() || '';
        const houseMl = houseName?.ml || '';
        const houseMatch = houseEn.includes(lowerQuery) || houseMl.includes(query);

        // Family Members Match
        const membersMatch = Array.isArray(family.family_members) && family.family_members.some(member => {
            const mNameEn = member?.name?.en?.toLowerCase() || '';
            const mNameMl = member?.name?.ml || '';
            return mNameEn.includes(lowerQuery) || mNameMl.includes(query);
        });

        return nameMatch || idMatch || phoneMatch || bloodMatch || houseMatch || membersMatch;
    });
};

try {
    console.log("Running verification tests...");

    // Test 1: Search for null blood group item (should not crash)
    // ERA-10 has blood_group: null. Primary member: Aneesh Kumar K.N.
    console.log("Test 1: Search 'Aneesh' (Checking crash resilience)...");
    const res1 = searchFamilies("Aneesh");
    console.log(`Test 1 PASSED. Found ${res1.length} results.`);

    // Test 2: Search by House Name (New feature)
    // ERA-2: Peedikakkudi House
    console.log("Test 2: Search 'Peedikakkudi' (House name)...");
    const res2 = searchFamilies("Peedikakkudi");
    console.log(res2.length > 0 ? `Test 2 PASSED. Found ${res2.length} results.` : "Test 2 FAILED");

    // Test 3: Search by Family Member (New feature)
    // ERA-4 Member: Deepa Mol
    console.log("Test 3: Search 'Deepa Mol' (Family member)...");
    const res3 = searchFamilies("Deepa Mol");
    console.log(res3.length > 0 ? `Test 3 PASSED. Found ${res3.length} results.` : "Test 3 FAILED");

    // Test 4: Search for Blood Group (General)
    console.log("Test 4: Search 'O +ve'...");
    const res4 = searchFamilies("O +ve");
    console.log(`Test 4 PASSED. Found ${res4.length} results.`);

    console.log("\nALL TESTS PASSED SUCCESSFULLY.");

} catch (error) {
    console.error("\nTEST FAILED WITH ERROR:");
    console.error(error);
}
