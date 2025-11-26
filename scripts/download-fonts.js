import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Минимальный набор шрифтов для тестирования
const fontUrls = {
  'roboto-regular': 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
  'roboto-bold': 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
};

function downloadFont(name, url, outputDir) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, `${name}.ttf`);
    const file = fs.createWriteStream(filePath);

    console.log(`Downloading ${name}...`);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${name}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ ${name} downloaded successfully`);
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function downloadAllFonts() {
  const googleFontsDir = path.join(__dirname, '..', 'public', 'fonts', 'google-fonts');
  const systemFontsDir = path.join(__dirname, '..', 'public', 'fonts', 'system-fonts');

  // Ensure directories exist
  if (!fs.existsSync(googleFontsDir)) {
    fs.mkdirSync(googleFontsDir, { recursive: true });
  }
  if (!fs.existsSync(systemFontsDir)) {
    fs.mkdirSync(systemFontsDir, { recursive: true });
  }

  const downloads = [];

  for (const [name, url] of Object.entries(fontUrls)) {
    const isSystemFont = name.includes('arial') || name.includes('georgia') || name.includes('times') ||
                        name.includes('verdana') || name.includes('courier') || name.includes('comic') ||
                        name.includes('impact') || name.includes('tahoma');

    const outputDir = isSystemFont ? systemFontsDir : googleFontsDir;
    downloads.push(downloadFont(name, url, outputDir));
  }

  try {
    await Promise.all(downloads);
    console.log('\n🎉 All fonts downloaded successfully!');
  } catch (error) {
    console.error('❌ Error downloading fonts:', error);
    process.exit(1);
  }
}

downloadAllFonts();