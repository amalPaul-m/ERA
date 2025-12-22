import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FAMILIES_FILE = path.join(__dirname, 'src', 'data', 'families.json');
const CREDENTIALS_FILE = path.join(__dirname, 'src', 'data', 'credentials.json');

function generateRandomPassword(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function main() {
    try {
        console.log('Reading families data...');
        const familiesData = JSON.parse(fs.readFileSync(FAMILIES_FILE, 'utf8'));

        const credentials = {};
        let count = 0;

        familiesData.forEach(family => {
            const phones = family.primary_member?.phone || [];
            if (phones.length > 0) {
                const phone = phones[0];
                // Only generate if not already exists (though phones should be unique per family in this context)
                if (!credentials[phone]) {
                    credentials[phone] = {
                        password: generateRandomPassword(),
                        familyId: family.id,
                        name: family.primary_member.name.en
                    };
                    count++;
                }
            }
        });

        console.log(`Generated ${count} credentials.`);
        fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 4));
        console.log(`Saved to ${CREDENTIALS_FILE} `);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
