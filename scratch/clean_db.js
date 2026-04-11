
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'submissions.json');

try {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  const submissions = JSON.parse(data);
  console.log(`Original count: ${submissions.length}`);

  const uniqueMap = new Map();

  // Process from oldest to newest to ensure latest one wins
  // Submissions are unshifted (newest at top), so we reverse to process oldest first
  const reversed = [...submissions].reverse();

  reversed.forEach(sub => {
    // Normalization key: Account (username or company) + Form
    const accountKey = (sub.username || sub.auth_company_name || sub.company_name || 'Unknown').trim().toLowerCase();
    const formKey = sub.form_id || 'N/A';
    const key = `${accountKey}_${formKey}`;
    
    uniqueMap.set(key, sub);
  });

  const cleaned = Array.from(uniqueMap.values()).reverse(); // Back to newest at top
  console.log(`Cleaned count: ${cleaned.length}`);

  fs.writeFileSync(DB_PATH, JSON.stringify(cleaned, null, 2));
  console.log('Successfully cleaned submissions.json');
} catch (err) {
  console.error('Error cleaning database:', err);
}
