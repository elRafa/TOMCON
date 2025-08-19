const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_DIR = './images';
const OUTPUT_DIR = './images';
const QUALITY = 85; // WebP quality (0-100)
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function convertToWebP(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .webp({ quality: QUALITY })
            .toFile(outputPath);
        
        // Get file sizes for comparison
        const originalSize = fs.statSync(inputPath).size;
        const webpSize = fs.statSync(outputPath).size;
        const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% smaller)`);
        return { success: true, savings };
    } catch (error) {
        console.error(`❌ Error converting ${inputPath}:`, error.message);
        return { success: false, error: error.message };
    }
}

async function optimizeImages() {
    console.log('🎨 Starting image optimization...\n');
    
    const files = fs.readdirSync(INPUT_DIR);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_FORMATS.includes(ext);
    });
    
    console.log(`Found ${imageFiles.length} images to convert\n`);
    
    let totalOriginalSize = 0;
    let totalWebpSize = 0;
    let successCount = 0;
    
    for (const file of imageFiles) {
        const inputPath = path.join(INPUT_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
        
        const originalSize = fs.statSync(inputPath).size;
        totalOriginalSize += originalSize;
        
        const result = await convertToWebP(inputPath, outputPath);
        
        if (result.success) {
            successCount++;
            const webpSize = fs.statSync(outputPath).size;
            totalWebpSize += webpSize;
        }
    }
    
    console.log('\n📊 Optimization Summary:');
    console.log(`✅ Successfully converted: ${successCount}/${imageFiles.length} images`);
    console.log(`📁 Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📁 WebP size: ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Total savings: ${((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100).toFixed(1)}%`);
    console.log(`📂 WebP files saved to: ${OUTPUT_DIR}/`);
    
    // Create a manifest file for easy reference
    const manifest = {
        generated: new Date().toISOString(),
        totalImages: successCount,
        originalSizeMB: (totalOriginalSize / 1024 / 1024).toFixed(2),
        webpSizeMB: (totalWebpSize / 1024 / 1024).toFixed(2),
        savingsPercent: ((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100).toFixed(1),
        quality: QUALITY
    };
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log(`📄 Manifest saved to: ${OUTPUT_DIR}/manifest.json`);
}

// Run the optimization
optimizeImages().catch(console.error);
