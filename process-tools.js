const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const sourceUrl = 'http://guozhivip.com/tool/';
const outputFile = 'categorized-tools.json';

async function scrapeAndCategorize() {
    try {
        const { data: html } = await axios.get(sourceUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(html);

        const result = [];

        $('h5, h6').each((idx, header) => {
            const headerText = $(header).text().trim();
            if (!headerText) return;
            const catName = headerText.split(' ')[0];
            const catObj = {
                category: catName,
                icon: getIcon(catName),
                tools: []
            };

            let row = $(header).parent().next();
            while (row.length && row.find('h5, h6').length === 0) {
                row.find('a').each((i, a) => {
                    const url = $(a).attr('href');
                    const text = $(a).text().trim();
                    if (url && text && !url.startsWith('javascript:')) {
                        const abs = new URL(url, sourceUrl).href;
                        if (!catObj.tools.some(t => t.url === abs)) {
                            catObj.tools.push({ name: text, url: abs });
                        }
                    }
                });
                row = row.next();
            }

            if (catObj.tools.length) result.push(catObj);
        });

        fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
        console.log(`Saved ${result.length} categories to ${outputFile}`);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

function getIcon(cat) {
    if (cat.includes('便民')) return 'fas fa-city';
    if (cat.includes('图片')) return 'fas fa-image';
    if (cat.includes('格式')) return 'fas fa-file-export';
    if (cat.includes('文字')) return 'fas fa-font';
    if (cat.includes('计算')) return 'fas fa-calculator';
    if (cat.includes('在线生成')) return 'fas fa-qrcode';
    if (cat.includes('设计')) return 'fas fa-pencil-ruler';
    if (cat.includes('开发')) return 'fas fa-code';
    if (cat.includes('站长')) return 'fas fa-server';
    return 'fas fa-toolbox';
}

scrapeAndCategorize(); 