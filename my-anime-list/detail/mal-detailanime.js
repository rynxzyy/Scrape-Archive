const axios = require("axios");
const cheerio = require("cheerio");

async function animeInfo(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        const title = $("h1.title-name").text().trim();
        const imageUrl = $(".leftside img").attr("data-src");
        const synopsis = $(".js-scrollfix-bottom-rel").find("p").first().text().trim();
        const background = $('td.pb24:contains("Background")').contents().map(function() {
            if (this.type === 'text') {
                return $(this).text();
            } else if (this.name === 'i') {
                return $(this).text();
            }
        }).get().join('').trim();

        const alternativeTitles = {
            synonyms: $('.spaceit_pad:contains("Synonyms")').contents().not('span').text().trim(),
            japanese: $('.spaceit_pad:contains("Japanese")').contents().not('span').text().trim(),
            english: $('.spaceit_pad:contains("English")').contents().not('span').text().trim(),
        };

        const information = {
            type: $('.spaceit_pad:contains("Type") a').text().trim(),
            episodes: $('.spaceit_pad:contains("Episodes")').contents().not('span').text().trim(),
            status: $('.spaceit_pad:contains("Status")').contents().not('span').text().trim(),
            aired: $('.spaceit_pad:contains("Aired")').contents().not('span').text().trim(),
            premiered: $('.spaceit_pad:contains("Premiered")').contents().not('span').text().trim(),
            broadcast: $('.spaceit_pad:contains("Broadcast")').contents().not('span').text().trim(),
            producers: $("span:contains('Producers:')").nextAll("a").map((i, el) => $(el).text().trim()).get().join(', ') || 'Unknown',
            licensors: $("span:contains('Licensors:')").nextAll("a").map((i, el) => $(el).text().trim()).get().join(', ') || 'Unknown',
            studios: $("span:contains('Studios:')").nextAll("a").map((i, el) => $(el).text().trim()).get().join(', ') || 'Unknown',
            source: $('.spaceit_pad:contains("Source")').contents().not('span').text().trim(),
            genres: $("span:contains('Genres:')").nextAll("a").map((i, el) => $(el).text().trim()).get().join(', ') || 'None',
            themes: $("span:contains('Themes:')").nextAll("a").map((i, el) => $(el).text().trim()).get().join(', ') || 'None',
            demographic: $("span:contains('Demographic:')").nextAll("a").map((i, el) => $(el).text().trim()).get().join(', ') || 'None',
            duration: $('.spaceit_pad:contains("Duration")').contents().not('span').text().trim(),
            rating: $('.spaceit_pad:contains("Rating")').contents().not('span').text().trim(),
        };
        
        const element = $('.spaceit_pad').filter((_, el) => {
            return $(el).find('span.dark_text').text().trim() === 'Ranked:';
        });
        const rankedText = element.contents().filter((_, el) => el.type === 'text').text().trim();
        
        const statistics = {
            score: $('span[itemprop="ratingValue"]').text().trim(),
            ranked: rankedText,
            popularity: $('.spaceit_pad:contains("Popularity")').contents().not('span').text().trim(),
            members: $('.spaceit_pad:contains("Members")').contents().not('span').text().trim(),
            favorites: $('.spaceit_pad:contains("Favorites")').contents().not('span').text().trim(),
        };
        
        const externalLinks = $(".external_links a").map((i, el) => {
            const name = $(el).find(".caption").text().trim();
            const url = $(el).attr("href");
            if (name && url) {
                return { name, url };
            }
        }).get()
        
        return {
            title,
            synopsis,
            background,
            alternativeTitles,
            information,
            statistics,
            externalLinks,
            imageUrl,
            link: url
        };
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        return error.message;
    }
}

animeInfo('https://myanimelist.net/anime/52034/Oshi_no_Ko').then((data) => {
    console.log(data);
});
