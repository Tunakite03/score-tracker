import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const publicDir = join(__dirname, '..', 'public');

async function generateIcons() {
   try {
      // Read the source SVG
      const svgPath = join(publicDir, 'icon.svg');
      const svgBuffer = await fs.readFile(svgPath);

      console.log('🎨 Generating PWA icons...\n');

      // Generate regular icons
      for (const size of sizes) {
         const outputPath = join(publicDir, `pwa-${size}x${size}.png`);
         await sharp(svgBuffer).resize(size, size).png().toFile(outputPath);
         console.log(`✅ Generated pwa-${size}x${size}.png`);
      }

      // Generate maskable icons (with padding for safe area)
      for (const size of sizes) {
         const padding = Math.floor(size * 0.1); // 10% padding
         const iconSize = size - padding * 2;

         const outputPath = join(publicDir, `pwa-maskable-${size}x${size}.png`);

         // Create a white background
         const background = await sharp({
            create: {
               width: size,
               height: size,
               channels: 4,
               background: { r: 255, g: 255, b: 255, alpha: 1 },
            },
         })
            .png()
            .toBuffer();

         // Resize icon and composite on background
         const icon = await sharp(svgBuffer).resize(iconSize, iconSize).png().toBuffer();

         await sharp(background)
            .composite([
               {
                  input: icon,
                  top: padding,
                  left: padding,
               },
            ])
            .toFile(outputPath);

         console.log(`✅ Generated pwa-maskable-${size}x${size}.png`);
      }

      console.log('\n✨ All PWA icons generated successfully!');
   } catch (error) {
      console.error('❌ Error generating icons:', error);
      process.exit(1);
   }
}

generateIcons();
