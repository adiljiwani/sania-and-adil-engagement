import fs from 'fs';
import path from 'path';

export function getImages() {
  // Get the absolute path to the public/images directory
  const imagesDir = path.join(process.cwd(), 'public/images');
  
  // Read all files in the directory
  const files = fs.readdirSync(imagesDir);
  
  // Filter for image files and create the image objects
  const images = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    })
    .map(file => ({
      src: `/images/${file}`,
      alt: `Engagement photo ${file.split('.')[0]}`,
    }));
  
  return images;
} 