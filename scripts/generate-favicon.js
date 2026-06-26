import fs from 'fs';
import sharp from 'sharp';

async function generateFavicon() {
  const sourcePath = 'public/logo-doug-design-icone-puro.png';
  const outputPath = 'public/favicon.ico';

  try {
    // 1. Resize to 48x48 PNG buffer
    const pngBuffer = await sharp(sourcePath)
      .resize(48, 48)
      .png()
      .toBuffer();

    // 2. Create ICO Header (6 bytes)
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);     // Reserved (0)
    header.writeUInt16LE(1, 2);     // Type (1 = Icon)
    header.writeUInt16LE(1, 4);     // Number of images (1)

    // 3. Create ICO Directory (16 bytes)
    const directory = Buffer.alloc(16);
    directory.writeUInt8(48, 0);    // Width (48)
    directory.writeUInt8(48, 1);    // Height (48)
    directory.writeUInt8(0, 2);     // Color palette (0 = no palette)
    directory.writeUInt8(0, 3);     // Reserved (0)
    directory.writeUInt16LE(1, 4);  // Color planes (1)
    directory.writeUInt16LE(32, 6); // Bits per pixel (32)
    directory.writeUInt32LE(pngBuffer.length, 8); // Image size in bytes
    directory.writeUInt32LE(22, 12); // Offset to image data (6 + 16 = 22)

    // 4. Combine and write to file
    const icoBuffer = Buffer.concat([header, directory, pngBuffer]);
    fs.writeFileSync(outputPath, icoBuffer);
    console.log(`Successfully generated favicon.ico at ${outputPath} (size: ${icoBuffer.length} bytes)`);
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();
