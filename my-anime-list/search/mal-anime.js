const axios = require('axios');
const cheerio = require('cheerio');

async function animeSearch(query) {
    try {
        const url = `https://myanimelist.net/anime.php?q=${query}&cat=anime`;
        const { data } = await axios.get(url)
        const $ = cheerio.load(data);
        let animeList = [];

        $('table tbody tr').each((_, element) => {
            const imageUrl = $(element).find('td:nth-child(1) img').attr('data-src') || $(element).find('td:nth-child(1) img').attr('src');
            const title = $(element).find('td:nth-child(2) strong').text().trim();
            const link = $(element).find('td:nth-child(2) a').attr('href');
            const type = $(element).find('td:nth-child(3)').text().trim();
            const episodes = $(element).find('td:nth-child(4)').text().trim();
            const score = $(element).find('td:nth-child(5)').text().trim();
            const description = $(element).find('td:nth-child(2) .pt4').text().replace('read more.', '').trim()  || 'No Desc'
            
            if (title && link) {
                animeList.push({
                    title,
                    description,
                    type,
                    episodes,
                    score,
                    imageUrl,
                    link
                });
            }
        });
        
        return animeList;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        return error.message;
    }
}

animeSearch('oshi no ko').then((data) => {
    console.log(data);
});
