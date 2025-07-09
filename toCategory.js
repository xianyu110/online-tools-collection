const fs = require('fs');

const linksFile = 'all-links.json';
const output = 'categorized-tools.json';

try {
  const links = JSON.parse(fs.readFileSync(linksFile, 'utf-8'));
  const categorized = [
    {
      category: '全部链接',
      icon: 'fas fa-link',
      tools: links
    }
  ];
  fs.writeFileSync(output, JSON.stringify(categorized, null, 2));
  console.log(`Written ${links.length} links into ${output}`);
} catch (e) {
  console.error('Failed:', e.message);
} 