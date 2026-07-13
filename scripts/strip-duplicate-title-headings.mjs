import fs from 'node:fs';
import path from 'node:path';

const blogDir = path.resolve('src/content/blog');
let changed = 0;

for (const file of fs.readdirSync(blogDir).filter((name) => /\.(md|mdx)$/.test(name))) {
  const filePath = path.join(blogDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) continue;

  const bodyLines = match[2].split(/\r?\n/);
  const headingIndex = bodyLines.findIndex((line) => /^#\s+/.test(line.trim()));
  if (headingIndex < 0) continue;

  bodyLines.splice(headingIndex, 1);
  if (bodyLines[headingIndex] === '') bodyLines.splice(headingIndex, 1);
  fs.writeFileSync(filePath, `${raw.slice(0, raw.indexOf(match[2]))}${bodyLines.join('\n')}`, 'utf8');
  changed += 1;
}

console.log(JSON.stringify({ changed }));
