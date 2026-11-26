const fs = require('fs');
const path = require('path');

const mobileDir = 'd:/ess card/you-are-mine-mobile';
const files = [
  'services/auth.service.js',
  'services/media.service.js',
  'services/payments/payment.service.js',
  'store/auth.store.js',
  'store/favorites.store.js'
];

files.forEach(rel => {
  const full = path.join(mobileDir, rel);
  if (!fs.existsSync(full)) {
    console.error('File not found:', full);
    return;
  }
  let content = fs.readFileSync(full, 'utf8');
  const depth = rel.split('/').length - 1;
  const importRel = (depth === 1 ? './storage.service' : '../services/storage.service');

  content = content.replace(/import\s+\*\s+as\s+SecureStore\s+from\s+['"]expo-secure-store['"];?/g, `import { Storage } from '${importRel}';`);
  content = content.replace(/SecureStore\./g, 'Storage.');
  fs.writeFileSync(full, content, 'utf8');
  console.log('Processed:', rel);
});
