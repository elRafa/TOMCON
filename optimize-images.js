const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const inputDir = './assets/images';
const outputDir = './assets/images';
const quality = 80; // WebP quality
const maxWidth = 1200; // Maximum width for large images
const maxHeight = 1200; // Maximum height for large images

// Image optimization function
async function optimizeImage(inputPath, outputPath, options = {}) {
    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        // Resize if image is too large
        if (metadata.width > maxWidth || metadata.height > maxHeight) {
            image.resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }
        
        // Convert to WebP with specified quality
        await image
            .webp({ 
                quality: options.quality || quality,
                effort: 6 // Higher effort for better compression
            })
            .toFile(outputPath);
            
        console.log(`✅ Optimized: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
        
        // Get file sizes for comparison
        const originalSize = fs.statSync(inputPath).size;
        const optimizedSize = fs.statSync(outputPath).size;
        const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        
        console.log(`   Size: ${(originalSize / 1024).toFixed(1)}KB -> ${(optimizedSize / 1024).toFixed(1)}KB (${savings}% smaller)`);
        
    } catch (error) {
        console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    }
}

// Process all images in directory
async function processImages() {
    console.log('🔄 Starting image optimization...\n');
    
    if (!fs.existsSync(inputDir)) {
        console.error(`❌ Input directory ${inputDir} does not exist`);
        return;
    }
    
    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png)$/i.test(file) && 
        !file.includes('.webp') && 
        !file.includes('favicon') &&
        !file.includes('manifest') &&
        !file.includes('apple-touch-icon')
    );
    
    if (imageFiles.length === 0) {
        console.log('ℹ️  No images found to optimize');
        return;
    }
    
    console.log(`📁 Found ${imageFiles.length} images to optimize\n`);
    
    let processed = 0;
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    
    for (const file of imageFiles) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
        
        // Skip if WebP already exists and is newer
        if (fs.existsSync(outputPath)) {
            const inputStats = fs.statSync(inputPath);
            const outputStats = fs.statSync(outputPath);
            
            if (outputStats.mtime > inputStats.mtime) {
                console.log(`⏭️  Skipping ${file} (WebP already exists and is newer)`);
                continue;
            }
        }
        
        const originalSize = fs.statSync(inputPath).size;
        totalOriginalSize += originalSize;
        
        await optimizeImage(inputPath, outputPath);
        processed++;
        
        if (fs.existsSync(outputPath)) {
            totalOptimizedSize += fs.statSync(outputPath).size;
        }
    }
    
    console.log('\n📊 Optimization Summary:');
    console.log(`   Processed: ${processed} images`);
    console.log(`   Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
    
    if (totalOriginalSize > 0) {
        const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
        console.log(`   Total savings: ${totalSavings}%`);
    }
    
    console.log('\n✅ Image optimization complete!');
}

// Run the optimization
processImages().catch(console.error);
