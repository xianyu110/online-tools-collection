const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'http://guozhivip.com/tool/';
const output = 'all-links.json';

(async () => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(html);
    const set = new Set();
    const links = [];

    $('a').each((_, a) => {
      const href = $(a).attr('href');
      const text = $(a).text().trim();
      if (!href || href.startsWith('javascript:')) return;
      const abs = new URL(href, url).href;
      if (!set.has(abs)) {
        set.add(abs);
        links.push({ text, url: abs });
      }
    });

    fs.writeFileSync(output, JSON.stringify(links, null, 2));
    console.log(`Saved ${links.length} unique links to ${output}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
})(); 