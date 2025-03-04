const axios = require('axios');
const cheerio = require('cheerio');

async function charaSearch(query) {
    try {
        const url = `https://myanimelist.net/character.php?q=${query}&cat=character`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const characterData = [];

        $('table tbody tr').each((_, element) => {
            const imageUrl = $(element).find('td .picSurround img').attr('data-src') || $(element).find('td .picSurround img').attr('src');
            const nameElement = $(element).find('td:nth-child(2) a');
            const name = nameElement.text().trim();
            const link = nameElement.attr('href') || '';

            const animeList = [];
            const mangaList = [];

            $(element).find('td small a[href*="/anime/"]').each((_, anime) => {
                animeList.push({
                    title: $(anime).text().trim(),
                    link: `https://myanimelist.net${$(anime).attr('href')}`
                });
            });

            $(element).find('td small a[href*="/manga/"]').each((_, manga) => {
                mangaList.push({
                    title: $(manga).text().trim(),
                    link: `https://myanimelist.net${$(manga).attr('href')}`
                });
            });

            if (name && link) {
                characterData.push({
                    name,
                    anime: animeList,
                    manga: mangaList,
                    imageUrl,
                    link
                });
            }
        });

        return characterData;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        return error.message;
    }
}

charaSearch('hoshino').then((data) => {
    console.log(data);
});
