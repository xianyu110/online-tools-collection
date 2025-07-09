const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'http://guozhivip.com/mvs.html';

async function scrapeLinks() {
    try {
        // Fetch HTML of the page
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Load HTML into cheerio
        const $ = cheerio.load(data);

        const links = [];
        const baseUrl = new URL(url).origin;

        // Find all anchor tags
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            const text = $(element).text().trim();

            if (link && text) {
                // Resolve relative URLs
                const absoluteUrl = new URL(link, baseUrl).href;
                links.push({
                    text: text,
                    url: absoluteUrl
                });
            }
        });

        // Save the links to a JSON file
        fs.writeFileSync('scraped-links.json', JSON.stringify(links, null, 2));
        console.log(`Successfully scraped ${links.length} links and saved to scraped-links.json`);

    } catch (error) {
        console.error('Error scraping the website:', error.message);
    }
}

scrapeLinks(); 