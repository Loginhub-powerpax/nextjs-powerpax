const fs = require('fs');
const path = require('path');

// This script copies the .next/static directory to public/_next/static.
// Hostinger's LiteSpeed/Apache web server intercepts static asset requests 
// BEFORE they reach Next.js. By copying them here, Hostinger can serve them natively,
// instantly fixing the 404 errors.

const src = path.join(__dirname, '../.next/static');
const dest = path.join(__dirname, '../public/_next/static');

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(src)) {
  console.log('Creating Hostinger proxy bridge for Next.js static assets...');
  copyRecursive(src, dest);
  console.log('Done! Hostinger will now successfully serve JS/CSS chunks.');
} else {
  console.log('Warning: .next/static directory not found.');
}
