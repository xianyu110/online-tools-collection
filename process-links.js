const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const categorizedLinksFile = 'categorized-links.json';
const sourceUrl = 'http://guozhivip.com/mvs.html';

// A more robust function to find the category of a link
function findCategory($, linkElement) {
    // The structure seems to be a `div.row` containing multiple `div.col-xs-12`.
    // Each `div.col-xs-12` that is a "header" contains an `h5` or `h6`.
    // The links for that category are in the subsequent `div.col-xs-12` siblings.
    
    // Find the container for the link
    const linkContainer = $(linkElement).closest('.col-xs-12');

    // Find the preceding header element
    let headerElement = linkContainer.prevAll('.col-xs-12:has(h5, h6)').first();
    
    // If not found, it might be inside the same container for single-line headers
    if (headerElement.length === 0) {
       headerElement = linkContainer.find('h5, h6').first().closest('.col-xs-12');
       // If it's still not found, or if the link is part of the header itself, search differently
       if(headerElement.length === 0) {
            headerElement = $(linkElement).closest('.row').find('.col-xs-12:has(h5, h6)').first();
       }
    }

    const titleElement = headerElement.find('h5, h6').first();

    if (titleElement.length > 0) {
        // Clean up the text, take the first part as the category name
        return titleElement.text().trim().replace(/[\s\n]+/g, ' ').split(' ')[0];
    }

    return '未分类'; // Default fallback
}


async function processAndCategorizeLinks() {
    try {
        const { data: html } = await axios.get(sourceUrl, {
             headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(html);

        const categorizedData = {};

        $('a').each((index, element) => {
            const link = $(element).attr('href');
            const text = $(element).text().trim();

            if (link && text && !link.startsWith('javascript:') && text.length > 0) {
                 const category = findCategory($, element);
                 
                 if (!categorizedData[category]) {
                     categorizedData[category] = {
                         category: category,
                         icon: getIconForCategory(category),
                         tools: []
                     };
                 }
                 
                 const absoluteUrl = new URL(link, sourceUrl).href;
                 if (!categorizedData[category].tools.some(t => t.url === absoluteUrl)) {
                     categorizedData[category].tools.push({ name: text, url: absoluteUrl });
                 }
            }
        });
        
        // Remove unwanted categories and convert to array
        delete categorizedData['未分类'];
        delete categorizedData['更多'];
        const finalCategorizedArray = Object.values(categorizedData).filter(cat => cat.tools.length > 0 && cat.category.length < 15);


        fs.writeFileSync(categorizedLinksFile, JSON.stringify(finalCategorizedArray, null, 2));
        console.log(`Successfully categorized links and saved to ${categorizedLinksFile}`);

    } catch (error) {
        console.error('Error processing links:', error);
    }
}

function getIconForCategory(category) {
    if (category.includes('观看')) return 'fas fa-play-circle';
    if (category.includes('官方免费')) return 'fas fa-check-circle';
    if (category.includes('下载')) return 'fas fa-download';
    if (category.includes('海外')) return 'fas fa-globe-americas';
    if (category.includes('动漫')) return 'fas fa-dragon';
    if (category.includes('直播')) return 'fas fa-broadcast-tower';
    if (category.includes('纪录片')) return 'fas fa-film';
    if (category.includes('短视频')) return 'fas fa-video';
    return 'fas fa-tv'; // Default icon
}


processAndCategorizeLinks(); 