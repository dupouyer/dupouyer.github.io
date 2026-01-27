import fs from 'fs';
import path from 'path';

const blogDir = './Site/Astro/src/content/blog';

function getMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function convertFrontmatter(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already properly formatted
  if (content.match(/categories:\n  - /)) {
    return false;
  }

  // Convert single-line categories to proper YAML array
  content = content.replace(
    /categories:\s*([^\n]+)/g,
    (_, value) => {
      const trimmed = value.trim();
      if (trimmed.startsWith('[')) return `categories: ${trimmed}`; // Keep JSON array
      return `categories:\n  - ${trimmed}`;
    }
  );

  // Convert single-line tags to proper YAML array
  content = content.replace(
    /tags:\s*([^\n]+)/g,
    (_, value) => {
      const trimmed = value.trim();
      if (trimmed.startsWith('[')) return `tags: ${trimmed}`; // Keep JSON array
      return `tags:\n  - ${trimmed}`;
    }
  );

  // Ensure title exists
  if (!content.match(/title:\s*\S+/)) {
    const fileName = path.basename(filePath, '.md');
    content = content.replace(/^---/, `---\ntitle: ${fileName}`);
  }

  // Ensure date exists
  if (!content.match(/date:\s*\S+/)) {
    const now = new Date().toISOString().split('T')[0];
    content = content.replace(/^---/, `---\ndate: ${now}`);
  }

  fs.writeFileSync(filePath, content);
  return true;
}

console.log('Converting frontmatter...\n');
const files = getMarkdownFiles(blogDir);
let converted = 0;

for (const file of files) {
  if (convertFrontmatter(file)) {
    console.log(`✓ Converted: ${path.relative(blogDir, file)}`);
    converted++;
  }
}

console.log(`\n✅ Converted ${converted} files`);
console.log(`📄 Total files: ${files.length}`);
