const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const envExample = path.join(__dirname, '..', '.env.example');
const env = path.join(__dirname, '..', '.env');
if (fs.existsSync(envExample) && !fs.existsSync(env)) {
  fs.copyFileSync(envExample, env);
}
