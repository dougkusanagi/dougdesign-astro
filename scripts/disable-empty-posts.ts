import fs from 'fs';
import path from 'path';

const blogDir = path.join(process.cwd(), 'src/content/blog');
const WORD_COUNT_THRESHOLD = 150;

function disableEmptyPosts() {
  if (!fs.existsSync(blogDir)) {
    console.error('Blog directory not found: ' + blogDir);
    return;
  }

  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  console.log(`Scanning ${files.length} posts for low content...`);

  let disabledCount = 0;

  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Split frontmatter and body
    const match = fileContent.match(/^---\r?\n([\s\S]+?)\r?\n---([\s\S]*)$/);
    if (!match) {
      console.warn(`⚠️ No frontmatter found in ${file}`);
      continue;
    }

    const frontmatterContent = match[1];
    const bodyContent = match[2] || '';

    // Simple word count
    const words = bodyContent.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    if (wordCount < WORD_COUNT_THRESHOLD) {
      // Check if it's already a draft
      const lines = frontmatterContent.split(/\r?\n/);
      let draftLineFound = false;
      let alreadyDraft = false;

      const newLines = lines.map(line => {
        if (line.trim().startsWith('draft:')) {
          draftLineFound = true;
          const val = line.split(':')[1].trim();
          if (val === 'true') {
            alreadyDraft = true;
          }
          return 'draft: true';
        }
        return line;
      });

      if (!draftLineFound) {
        newLines.push('draft: true');
      }

      if (!alreadyDraft) {
        const newFrontmatter = `---\n${newLines.join('\n')}\n---`;
        const newFileContent = `${newFrontmatter}${bodyContent}`;
        fs.writeFileSync(filePath, newFileContent, 'utf-8');
        console.log(`🚫 DISABLED: "${file}" (${wordCount} words)`);
        disabledCount++;
      }
    }
  }

  console.log(`\nScan completed!`);
  console.log(`Successfully disabled ${disabledCount} new low-content posts.`);
}

disableEmptyPosts();
