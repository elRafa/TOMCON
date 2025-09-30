#!/usr/bin/env node

/**
 * Build Verification Script
 * Verifies critical data is correctly included in the build before deployment
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

// Load source guests.js
const guestsPath = path.join(__dirname, 'guests.js');
const guestsSource = fs.readFileSync(guestsPath, 'utf8');

// Extract guest names with visibility: 1 from source
const visibleGuestsRegex = /{\s*name:\s*"([^"]+)"[^}]*?visibility:\s*1/g;
const hiddenGuestsRegex = /{\s*name:\s*"([^"]+)"[^}]*?visibility:\s*0/g;

const expectedVisible = [];
const expectedHidden = [];

let match;
while ((match = visibleGuestsRegex.exec(guestsSource)) !== null) {
    expectedVisible.push(match[1]);
}

while ((match = hiddenGuestsRegex.exec(guestsSource)) !== null) {
    expectedHidden.push(match[1]);
}

// Find built guests file
const assetsDir = path.join(__dirname, 'dist', 'assets');
if (!fs.existsSync(assetsDir)) {
    logError('Build directory not found! Run "npm run build" first.');
    process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const guestsFile = files.find(f => f.startsWith('guests-') && f.endsWith('.js'));

if (!guestsFile) {
    logError('Built guests file not found in dist/assets/');
    process.exit(1);
}

const builtGuestsPath = path.join(assetsDir, guestsFile);
const builtContent = fs.readFileSync(builtGuestsPath, 'utf8');

logInfo(`Verifying build: ${guestsFile}`);
console.log('');

// Verification checks
let hasErrors = false;
let hasWarnings = false;

// Check 1: Verify visible guests are present
logInfo('Checking visible guests (visibility: 1)...');
const missingVisible = [];
expectedVisible.forEach(name => {
    const namePattern = `name:"${name}"`;
    if (!builtContent.includes(namePattern)) {
        missingVisible.push(name);
        hasErrors = true;
    }
});

if (missingVisible.length > 0) {
    logError(`Missing ${missingVisible.length} visible guests in build:`);
    missingVisible.forEach(name => console.log(`  - ${name}`));
} else {
    logSuccess(`All ${expectedVisible.length} visible guests found in build`);
}
console.log('');

// Check 2: Verify hidden guests are marked correctly
logInfo('Checking hidden guests (visibility: 0)...');
const incorrectlyVisible = [];
expectedHidden.forEach(name => {
    // Use a more precise pattern that doesn't cross guest boundaries
    const guestEntryPattern = `name:"${name}"[^{]*?visibility:(0|1)`;
    const match = builtContent.match(new RegExp(guestEntryPattern));
    
    if (match && match[1] === '1') {
        incorrectlyVisible.push(name);
        hasErrors = true;
    }
});

if (incorrectlyVisible.length > 0) {
    logError(`${incorrectlyVisible.length} guests incorrectly visible (should be hidden):`);
    incorrectlyVisible.forEach(name => console.log(`  - ${name}`));
} else {
    logSuccess(`All ${expectedHidden.length} hidden guests correctly marked`);
}
console.log('');

// Check 3: Verify recent changes are included
logInfo('Checking for recent critical data...');
const criticalGuests = [
    { name: 'Deanna Moody', shouldBeVisible: true },
    { name: 'Josh Kemble', shouldBeVisible: false },
    { name: 'Kevin Chen', shouldBeVisible: true }
];

criticalGuests.forEach(({ name, shouldBeVisible }) => {
    const nameExists = builtContent.includes(`name:"${name}"`);
    if (!nameExists) {
        logWarning(`${name} not found in build`);
        hasWarnings = true;
    } else {
        const guestEntryPattern = `name:"${name}"[^{]*?visibility:(0|1)`;
        const match = builtContent.match(new RegExp(guestEntryPattern));
        
        if (!match) {
            logWarning(`${name} found but visibility status unclear`);
            hasWarnings = true;
        } else {
            const isVisible = match[1] === '1';
            if (shouldBeVisible && isVisible) {
                logSuccess(`${name} correctly visible in build`);
            } else if (!shouldBeVisible && !isVisible) {
                logSuccess(`${name} correctly hidden in build`);
            } else {
                logError(`${name} visibility is incorrect! Expected: ${shouldBeVisible ? 'visible' : 'hidden'}, Got: ${isVisible ? 'visible' : 'hidden'}`);
                hasErrors = true;
            }
        }
    }
});
console.log('');

// Check 4: Verify build is recent
const buildStats = fs.statSync(builtGuestsPath);
const buildAge = Date.now() - buildStats.mtimeMs;
const buildAgeMinutes = Math.round(buildAge / 60000);

if (buildAge < 60000) {
    logSuccess(`Build is fresh (${Math.round(buildAge / 1000)}s old)`);
} else if (buildAge < 300000) {
    logInfo(`Build is ${buildAgeMinutes} minutes old`);
} else {
    logWarning(`Build is ${buildAgeMinutes} minutes old - consider rebuilding`);
    hasWarnings = true;
}
console.log('');

// Summary
log('═══════════════════════════════════════', 'blue');
if (hasErrors) {
    logError('BUILD VERIFICATION FAILED!');
    log('Please fix the errors above before deploying.', 'red');
    process.exit(1);
} else if (hasWarnings) {
    logWarning('BUILD VERIFICATION PASSED WITH WARNINGS');
    log('Review warnings above before deploying.', 'yellow');
    process.exit(0);
} else {
    logSuccess('BUILD VERIFICATION PASSED!');
    log('Build is ready for deployment.', 'green');
    process.exit(0);
}
