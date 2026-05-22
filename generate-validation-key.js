import fs from 'fs';
import path from 'path';

const key = process.env.PI_VALIDATION_KEY;
if (key) {
  const trimmedKey = key.trim();
  
  // 1. Write to public/validation-key.txt (for Vite build propagation)
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'validation-key.txt'), trimmedKey);
  console.log('Successfully wrote PI_VALIDATION_KEY to public/validation-key.txt');

  // 2. Write to dist/validation-key.txt (directly into built assets)
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(path.join(distDir, 'validation-key.txt'), trimmedKey);
  console.log('Successfully wrote PI_VALIDATION_KEY to dist/validation-key.txt');
} else {
  console.warn('WARNING: PI_VALIDATION_KEY not found in process.env during build. Static verification file was not generated.');
}
