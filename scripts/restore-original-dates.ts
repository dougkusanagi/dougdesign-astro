import fs from 'fs';
import path from 'path';

const mirrorIndexPath = 'C:\\Users\\dl_ag\\dev\\dougdesign-seo\\content\\snapshots\\wp-json\\mirror-index.json';
const blogDir = path.join(process.cwd(), 'src/content/blog');

function restoreDates() {
  console.log('Loading mirror-index.json...');
  if (!fs.existsSync(mirrorIndexPath)) {
    console.error('mirror-index.json not found at: ' + mirrorIndexPath);
    return;
  }
  
  const mirrorIndex = JSON.parse(fs.readFileSync(mirrorIndexPath, 'utf-8'));
  const localPosts = mirrorIndex.posts;

  if (!fs.existsSync(blogDir)) {
    console.error('Blog directory not found: ' + blogDir);
    return;
  }

  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  console.log(`Found ${files.length} markdown posts in ${blogDir}.`);

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const slug = path.basename(file, '.md');

    const wpPost = localPosts[slug];
    if (!wpPost) {
      notFoundCount++;
      continue;
    }

    const originalDate = wpPost.date;
    if (!originalDate) {
      continue;
    }

    // Parse frontmatter
    const match = fileContent.match(/^---\r?\n([\s\S]+?)\r?\n---/);
    if (!match) {
      console.warn(`⚠️ No frontmatter found in ${file}`);
      continue;
    }

    const frontmatterContent = match[1];
    const lines = frontmatterContent.split(/\r?\n/);
    let pubDateFound = false;

    const newLines = lines.map(line => {
      if (line.trim().startsWith('pubDate:')) {
        pubDateFound = true;
        // Keep pubDate: format
        return `pubDate: ${originalDate}`;
      }
      return line;
    });

    if (!pubDateFound) {
      newLines.push(`pubDate: ${originalDate}`);
    }

    const newFrontmatter = `---\n${newLines.join('\n')}\n---`;
    // Replace the matched frontmatter section
    const newFileContent = fileContent.replace(/^---\r?\n([\s\S]+?)\r?\n---/, newFrontmatter);

    fs.writeFileSync(filePath, newFileContent, 'utf-8');
    updatedCount++;
  }

  console.log(`\nRestore dates completed!`);
  console.log(`Successfully updated: ${updatedCount} posts.`);
  console.log(`Not found in WordPress index: ${notFoundCount} posts (preserved existing dates).`);
}

restoreDates();
