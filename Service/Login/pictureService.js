// const sharp = require("sharp");
// const fs = require("fs").promises;

//  exports.compressImage = async(imagePath) =>{
//   let quality = 60; // Start with 60% quality
//   let width = 800; // Resize width
//   let fileSize = Infinity;
//   let compressedBuffer;
//   const originalSize = (await fs.stat(imagePath)).size;
//   console.log(`🖼️ Original Size: ${(originalSize / 1024).toFixed(2)} KB`);

//   const imageBuffer = await fs.readFile(imagePath); // Read original file

//   // Loop to reduce file size below 50KB
//   while (fileSize > 50 * 1024 && quality > 10) {
//     compressedBuffer = await sharp(imageBuffer)
//       .resize({ width }) // Resize to reduce size
//       .png({ quality }) // Adjust quality
//       .toBuffer();

//     fileSize = compressedBuffer.length; // Check file size
//     quality -= 5; // Reduce quality if still above 50KB
//   }
//   // Overwrite the original image with the compressed one
//   await fs.writeFile(imagePath, compressedBuffer);
//   const newSize = (await fs.stat(imagePath)).size;
//   console.log(`✅ Compressed Size: ${(newSize / 1024).toFixed(2)} KB`);
//   return imagePath;

// }
const sharp = require("sharp");
const fs = require("fs").promises;

async function compressImage(imagePath) {
  let quality = 60;
  let width = 800;
  let fileSize = (await fs.stat(imagePath)).size;
  const maxSize = 50 * 1024; // 50KB
  let compressedBuffer;

  console.log(`🖼️ Original Size: ${(fileSize / 1024).toFixed(2)} KB`);

  if (fileSize <= maxSize) {
    console.log(`✅ No compression needed (Already below 50KB)`);
    return imagePath;
  }

  const imageBuffer = await fs.readFile(imagePath);
  const metadata = await sharp(imageBuffer).metadata();
  
  let format = metadata.format; // Keep the original format
  if (format === "png") format = "jpeg"; // Convert PNG to JPEG for better compression

  while (fileSize > maxSize && quality > 10) {
    compressedBuffer = await sharp(imageBuffer)
      .resize({ width, withoutEnlargement: true }) // Resize to reduce size
      [format]({ quality, progressive: true }) // Ensure efficient compression
      .toBuffer();

    fileSize = compressedBuffer.length;
    quality -= 5; // Reduce quality if still above 50KB
  }

  // Overwrite original image with compressed one
  await fs.writeFile(imagePath, compressedBuffer);

  const newSize = (await fs.stat(imagePath)).size;
  console.log(`✅ Compressed Size: ${(newSize / 1024).toFixed(2)} KB`);

  return imagePath;
}

module.exports = { compressImage };




