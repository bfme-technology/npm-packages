#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper to run shell commands safely
function execCmd(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', ...options }).trim();
  } catch (err) {
    return null;
  }
}

// Helper to print debug info
function logDebug(message) {
  console.log(`[CI-HELPER] ${message}`);
}

// Find all packages under @bfme-technology/ that have a package.json
function getPackages() {
  const scopeDir = path.join(process.cwd(), '@bfme-technology');
  if (!fs.existsSync(scopeDir)) {
    logDebug(`Scope directory @bfme-technology not found at ${scopeDir}`);
    return [];
  }

  return fs.readdirSync(scopeDir)
    .map(dir => {
      const dirPath = path.join(scopeDir, dir);
      const pkgJsonPath = path.join(dirPath, 'package.json');
      if (fs.statSync(dirPath).isDirectory() && fs.existsSync(pkgJsonPath)) {
        try {
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          return {
            name: pkgJson.name,
            version: pkgJson.version,
            directory: path.relative(process.cwd(), dirPath),
            packageJson: path.relative(process.cwd(), pkgJsonPath)
          };
        } catch (e) {
          console.error(`Error parsing package.json in ${dirPath}:`, e);
        }
      }
      return null;
    })
    .filter(Boolean);
}

// Detect changed packages
function detectChanges(base, head) {
  logDebug(`Detecting package changes between base: ${base} and head: ${head}`);
  const packages = getPackages();
  const changedPackages = [];
  const reportLines = [];

  reportLines.push('| Package Name | Base Version | Head Version | npm Latest | Status |');
  reportLines.push('|---|---|---|---|---|');

  for (const pkg of packages) {
    const baseVersion = getVersionAtRef(base, pkg.packageJson);
    const headVersion = getVersionAtRef(head, pkg.packageJson) || pkg.version;
    const npmLatestVersion = getNpmLatestVersion(pkg.name);

    const versionChanged = Boolean(headVersion) && headVersion !== baseVersion;
    const filesChanged = hasFilesChanged(base, head, pkg.directory);
    const npmVersionChanged = Boolean(headVersion) && (npmLatestVersion === null || headVersion !== npmLatestVersion);
    const isChanged = versionChanged || filesChanged || npmVersionChanged;

    let status = 'No Changes';
    if (isChanged) {
      changedPackages.push(pkg.name);
      const changes = [];
      if (versionChanged) changes.push('Version Bumped');
      if (filesChanged) changes.push('Files Modified');
      if (npmVersionChanged) changes.push('npm Version Differs');
      status = `⚠️ Changed (${changes.join(', ')})`;
    } else {
      status = '✅ Up to date';
    }

    reportLines.push(`| \`${pkg.name}\` | ${baseVersion || 'N/A'} | ${headVersion || 'N/A'} | ${npmLatestVersion || 'N/A'} | ${status} |`);
    logDebug(`${pkg.name}: base=${baseVersion}, head=${headVersion}, npm=${npmLatestVersion} -> status: ${status}`);
  }

  // Write outputs
  const changedStr = changedPackages.join(',');
  const hasChangesStr = String(changedPackages.length > 0);

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changedStr}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_changes=${hasChangesStr}\n`);
    logDebug(`Set GITHUB_OUTPUT: changed="${changedStr}", has_changes="${hasChangesStr}"`);
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    const summary = [
      '## Package Change Detection Report',
      '',
      ...reportLines,
      '',
      `**Total packages with changes:** ${changedPackages.length}`,
      `**Changed packages:** ${changedStr || 'None'}`
    ].join('\n');
    fs.writeFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  }
}

// Get package.json version at a specific git ref
function getVersionAtRef(ref, pkgJsonPath) {
  const content = execCmd(`git show ${ref}:${pkgJsonPath}`);
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    return parsed.version || null;
  } catch {
    return null;
  }
}

// Get latest published version on npm
function getNpmLatestVersion(packageName) {
  return execCmd(`npm view "${packageName}" version`, { stdio: ['ignore', 'pipe', 'ignore'] });
}

// Check if files in directory changed between refs
function hasFilesChanged(base, head, dirPath) {
  // Add trailing slash to directory path to prevent matching other directories with same prefix
  const formattedDir = dirPath.endsWith('/') ? dirPath : `${dirPath}/`;
  const diff = execCmd(`git diff --name-only ${base} ${head} -- ${formattedDir}`);
  return !!diff && diff.length > 0;
}

// Build and publish changed packages
function publishPackages(changedArg) {
  if (!changedArg) {
    console.log('No packages specified for publishing.');
    return;
  }

  const changedList = changedArg.split(',').map(s => s.trim()).filter(Boolean);
  if (changedList.length === 0) {
    console.log('No packages specified for publishing.');
    return;
  }

  const allPackages = getPackages();
  const targetPackages = allPackages.filter(pkg => changedList.includes(pkg.name));

  console.log(`Target packages for publishing: ${targetPackages.map(p => p.name).join(', ')}`);

  for (const pkg of targetPackages) {
    console.log(`\n========================================`);
    console.log(`Processing package: ${pkg.name}`);
    console.log(`========================================`);

    const dirPath = path.join(process.cwd(), pkg.directory);
    const version = pkg.version;

    // 1. Check if the exact version already exists on npm
    const exists = execCmd(`npm view "${pkg.name}@${version}" version`, { stdio: ['ignore', 'pipe', 'ignore'] });
    if (exists) {
      console.log(`[SKIP] ${pkg.name}@${version} already exists on npm.`);
      continue;
    }

    // 2. Check if the packed content matches the latest version on npm
    const localSha = getLocalPackSha(dirPath);
    const remoteLatestSha = execCmd(`npm view "${pkg.name}@latest" dist.shasum`, { stdio: ['ignore', 'pipe', 'ignore'] });

    if (localSha && remoteLatestSha && localSha === remoteLatestSha) {
      console.log(`[SKIP] Local pack shasum matches npm @latest shasum (${localSha}).`);
      continue;
    }

    // 3. Install dependencies in the package directory
    console.log(`Installing dependencies for ${pkg.name}...`);
    // Check if package-lock.json exists in package directory
    const hasLock = fs.existsSync(path.join(dirPath, 'package-lock.json'));
    const installCmd = hasLock ? 'npm ci' : 'npm install';
    
    try {
      execSync(installCmd, { cwd: dirPath, stdio: 'inherit' });
    } catch (err) {
      console.error(`[ERROR] Failed to install dependencies for ${pkg.name}`);
      process.exit(1);
    }

    // 4. Build the package if build script exists
    const pkgJson = JSON.parse(fs.readFileSync(path.join(dirPath, 'package.json'), 'utf8'));
    if (pkgJson.scripts && pkgJson.scripts.build) {
      console.log(`Building ${pkg.name}...`);
      try {
        execSync('npm run build', { cwd: dirPath, stdio: 'inherit' });
      } catch (err) {
        console.error(`[ERROR] Build failed for ${pkg.name}`);
        process.exit(1);
      }
    } else {
      console.log(`No build script found for ${pkg.name}. Skipping build.`);
    }

    // 5. Publish to npm
    console.log(`Publishing ${pkg.name}@${version} to npm...`);
    try {
      execSync('npm publish --access public', { cwd: dirPath, stdio: 'inherit' });
      console.log(`[SUCCESS] Published ${pkg.name}@${version}`);
    } catch (err) {
      console.error(`[ERROR] Publish failed for ${pkg.name}`);
      process.exit(1);
    }
  }
}

// Pack package locally to get its shasum
function getLocalPackSha(dirPath) {
  try {
    const packOutput = execSync('npm pack --json --silent', { cwd: dirPath, encoding: 'utf8' }).trim();
    if (!packOutput) return null;
    const parsed = JSON.parse(packOutput);
    const shasum = parsed[0]?.shasum;
    
    // Clean up the generated .tgz file so we don't pollute the git workspace
    const filename = parsed[0]?.filename;
    if (filename) {
      const filePath = path.join(dirPath, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    return shasum || null;
  } catch (err) {
    logDebug(`Error packing package at ${dirPath}: ${err.message}`);
    return null;
  }
}

// CLI Routing
const args = process.argv.slice(2);
const command = args[0];

if (command === 'detect') {
  let baseIndex = args.indexOf('--base');
  let headIndex = args.indexOf('--head');
  if (baseIndex === -1 || headIndex === -1 || !args[baseIndex + 1] || !args[headIndex + 1]) {
    console.error('Usage: node ci-helper.js detect --base <base-sha> --head <head-sha>');
    process.exit(1);
  }
  const base = args[baseIndex + 1];
  const head = args[headIndex + 1];
  detectChanges(base, head);
} else if (command === 'publish') {
  let changedIndex = args.indexOf('--changed');
  if (changedIndex === -1 || !args[changedIndex + 1]) {
    console.error('Usage: node ci-helper.js publish --changed <comma-separated-packages>');
    process.exit(1);
  }
  const changedArg = args[changedIndex + 1];
  publishPackages(changedArg);
} else {
  console.error('Unknown command. Use "detect" or "publish".');
  process.exit(1);
}
