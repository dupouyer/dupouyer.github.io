import fs from 'fs';
import path from 'path';

const sourceDir = './PublishNote';
const blogDir = './Site/Astro/src/content/blog';

/**
 * Recursively get all markdown files from a directory
 */
function getMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      // Skip image/asset directories (they'll be copied separately)
      if (item.name === 'Images' || item.name === 'img' || item.name === '.git') continue;
      files.push(...getMarkdownFiles(fullPath));
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Get image directories associated with markdown files
 */
function getImageDirs(dir) {
  const dirs = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory() && item.name !== '.git') {
      const fullPath = path.join(dir, item.name);
      // Check if this directory contains image files (png, jpg, gif, etc.)
      try {
        const children = fs.readdirSync(fullPath);
        const hasImages = children.some(f =>
          /\.(png|jpg|jpeg|gif|svg|webp|bmp)$/i.test(f)
        );
        if (hasImages) {
          dirs.push({ src: fullPath, name: item.name });
        }
        // Also check child directories (for img/2020-6-3/ style)
        for (const child of children) {
          const childPath = path.join(fullPath, child);
          if (fs.statSync(childPath).isDirectory()) {
            const grandChildren = fs.readdirSync(childPath);
            const childHasImages = grandChildren.some(f =>
              /\.(png|jpg|jpeg|gif|svg|webp|bmp)$/i.test(f)
            );
            if (childHasImages) {
              dirs.push({ src: childPath, name: path.join(item.name, child) });
            }
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }
  return dirs;
}

/**
 * Parse frontmatter from markdown content.
 * Returns { frontmatter: object, body: string } or null if no frontmatter.
 */
function parseFrontmatter(content) {
  // Match the first frontmatter block: starts with --- on line 1, ends with ---
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;

  const fmText = match[1];
  const body = content.slice(match[0].length);
  const fm = {};

  // Parse YAML-like frontmatter manually
  const lines = fmText.split(/\r?\n/);
  let currentKey = null;
  let currentArrayValues = [];

  function flushArray() {
    if (currentKey && currentArrayValues.length > 0) {
      fm[currentKey] = currentArrayValues;
      currentArrayValues = [];
    }
    currentKey = null;
  }

  for (const line of lines) {
    // Array item: "  - value"
    const arrayItemMatch = line.match(/^\s*-\s+(.+)$/);
    if (arrayItemMatch && currentKey) {
      currentArrayValues.push(arrayItemMatch[1].trim());
      continue;
    }

    // New key-value pair
    const kvMatch = line.match(/^(\w[\w\s]*?):\s*(.*)$/);
    if (kvMatch) {
      flushArray();
      const key = kvMatch[1].trim();
      let value = kvMatch[2].trim();

      if (value === '') {
        // Could be followed by array items
        currentKey = key;
        currentArrayValues = [];
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // JSON-style array: [DCC, Blender]
        fm[key] = value.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
      } else {
        fm[key] = value;
      }
    }
  }
  flushArray();

  return { frontmatter: fm, body };
}

/**
 * Check if the body starts with another frontmatter block (duplicate).
 * If so, strip it out.
 */
function stripDuplicateFrontmatter(body) {
  const trimmed = body.replace(/^\s*/, '');
  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (match) {
    // This is a duplicate frontmatter block — remove it
    return trimmed.slice(match[0].length);
  }
  return body;
}

/**
 * Convert a parsed frontmatter object to Astro-compatible YAML string.
 */
function buildFrontmatter(fm) {
  const lines = ['---'];

  // title
  if (fm.title) {
    lines.push(`title: "${fm.title.replace(/"/g, '\\"')}"`);
  }

  // date — parse to Date object, output as YAML date
  if (fm.date) {
    const dateStr = String(fm.date).trim();
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      lines.push(`date: ${d.toISOString().split('T')[0]}`);
    } else {
      lines.push(`date: ${dateStr}`);
    }
  }

  // updated
  if (fm.updated) {
    const dateStr = String(fm.updated).trim();
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      lines.push(`updated: ${d.toISOString().split('T')[0]}`);
    } else {
      lines.push(`updated: ${dateStr}`);
    }
  }

  // description
  if (fm.description) {
    lines.push(`description: "${fm.description.replace(/"/g, '\\"')}"`);
  }

  // categories — always as YAML array
  if (fm.categories) {
    const cats = Array.isArray(fm.categories) ? fm.categories : [fm.categories];
    lines.push('categories:');
    for (const cat of cats) {
      lines.push(`  - ${cat}`);
    }
  }

  // tags — always as YAML array
  if (fm.tags) {
    const tags = Array.isArray(fm.tags) ? fm.tags : [fm.tags];
    lines.push('tags:');
    for (const tag of tags) {
      lines.push(`  - ${tag}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

/**
 * Process a single markdown file: parse frontmatter, rebuild it, strip duplicates.
 */
function processFile(srcPath, destPath) {
  let content = fs.readFileSync(srcPath, 'utf8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    // No frontmatter — generate from filename
    const fileName = path.basename(srcPath, '.md');
    const now = new Date().toISOString().split('T')[0];
    const newFm = buildFrontmatter({ title: fileName, date: now });
    fs.writeFileSync(destPath, `${newFm}\n\n${content}`, 'utf8');
    return { action: 'generated', title: fileName };
  }

  // Strip any duplicate frontmatter in the body
  const cleanBody = stripDuplicateFrontmatter(parsed.body);

  // Rebuild frontmatter with original values
  const newFm = buildFrontmatter(parsed.frontmatter);

  fs.writeFileSync(destPath, `${newFm}\n\n${cleanBody}`, 'utf8');
  return { action: 'converted', title: parsed.frontmatter.title || path.basename(srcPath, '.md') };
}

/**
 * Recursively copy a directory
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const items = fs.readdirSync(src, { withFileTypes: true });
  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);
    if (item.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ========== Main ==========

console.log('🔄 Converting articles from PublishNote to Astro blog...\n');

// Ensure output directory exists
fs.mkdirSync(blogDir, { recursive: true });

// 1. Process markdown files
const files = getMarkdownFiles(sourceDir);
let converted = 0;
let generated = 0;

for (const srcFile of files) {
  const fileName = path.basename(srcFile);
  const destFile = path.join(blogDir, fileName);

  const result = processFile(srcFile, destFile);
  if (result.action === 'converted') {
    console.log(`  ✓ Converted: ${fileName} → "${result.title}"`);
    converted++;
  } else {
    console.log(`  + Generated: ${fileName} → "${result.title}"`);
    generated++;
  }
}

// 2. Copy image directories
const imageDirs = getImageDirs(sourceDir);
let copiedDirs = 0;

for (const dir of imageDirs) {
  const destDir = path.join(blogDir, dir.name);
  copyDirSync(dir.src, destDir);
  console.log(`  📁 Copied images: ${dir.name}/`);
  copiedDirs++;
}

console.log(`\n✅ Converted: ${converted} files`);
console.log(`➕ Generated: ${generated} files`);
console.log(`📁 Copied: ${copiedDirs} image directories`);
console.log(`📄 Total posts: ${files.length}`);
