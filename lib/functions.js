const {
    default: got
} = require('got/dist/source');
const fetch = require('node-fetch')
var axios = require('axios');
const path = require('path');
const {
    getBase64
} = require("./fetcher")
const request = require('request')
const emoji = require('emoji-regex')
const fs = require('fs-extra')
const {
    HentaiClient
} = require("hentai.js");

const hentaiClient = new HentaiClient({
    useragent: "Example/Production/0.0.0" // optional useragent (you'll be given a shitty hentai.js useragent if you don't edit this)
});
const liriklagu = async (lagu) => {
    const response = await fetch(`http://scrap.terhambar.com/lirik?word=${lagu}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    const json = await response.json()
    if (json.status === true) return ` ${lagu}\n\n${json.result.lirik}`
    return `[ Error ] Lyrics ${lagu} not found!`
}


const quotemaker = async (quotes, author = 'EmditorBerkelas', type = 'random') => {
    var q = quotes.replace(/ /g, '%20').replace('\n', '%5Cn')
    const response = await fetch(`https://terhambar.com/aw/qts/?kata=${q}&author=${author}&tipe=${type}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const json = await response.json()
    if (json.status) {
        if (json.result !== '') {
            const base64 = await getBase64(json.result)
            return base64
        }
    }
}

const emojiStrip = (string) => {
    return string.replace(emoji, '')
}
const fb = async (url) => {
    const response = await fetch(`http://scrap.terhambar.com/fb?link=${url}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const json = await response.json()
    if (json.status === true) return {
        'capt': json.result.title,
        'exts': '.mp4',
        'url': json.result.linkVideo.sdQuality
    }
    return {
        'capt': '[ ERROR ] Not found!',
        'exts': '.jpg',
        'url': 'https://c4.wallpaperflare.com/wallpaper/976/117/318/anime-girls-404-not-found-glowing-eyes-girls-frontline-wallpaper-preview.jpg'
    }
}

const randomNimek = async (type) => {
    const downloadFile = (fileUrl) => {
        return new Promise(async (resolve, reject) => {
            const fileName = path.basename(fileUrl);
            const response = await axios({
                method: 'get',
                url: fileUrl,
                headers: {
                    'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                    'sec-ch-ua-mobile': '?0',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36',
                    'Referer': 'https://api.computerfreaker.cf/'
                },
                responseType: 'stream',
            });
            let loc = "./media/temp/" + fileName;
            const w = response.data.pipe(fs.createWriteStream(loc));
            w.on('finish', () => {
                resolve(loc);
            });
        })
    };
    var config = {
        method: 'get',
        url: '',
        headers: {
            'authority': 'api.computerfreaker.cf',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            'sec-ch-ua-mobile': '?0',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'referer': 'https://api.computerfreaker.cf/',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': 'PHPSESSID=meg2erq2f7s5micpi8brue108l'
        }
    };
    switch (type) {
        case 'hentai':
            config.url = "https://api.computerfreaker.cf/v1/hentai";
            break
        case 'anime':
            config.url = "https://api.computerfreaker.cf/v1/anime";
            break
        case 'trap':
            config.url = "https://api.computerfreaker.cf/v1/trap";
            break
        case 'yuri':
            config.url = "https://api.computerfreaker.cf/v1/yuri";
            break
        case 'dva':
            config.url = "https://api.computerfreaker.cf/v1/dva";
            break
        case 'hug':
            config.url = "https://api.computerfreaker.cf/v1/hug";
            break
        case 'neko':
            config.url = "https://api.computerfreaker.cf/v1/neko";
            break
        case 'nsfwneko':
            config.url = "https://api.computerfreaker.cf/v1/nsfwneko";
            break
        case 'baguette':
            config.url = "https://api.computerfreaker.cf/v1/baguette";
            break
    }
    const resp = await axios(config);
    const IMAGE_URL = resp.data["url"];
    return await downloadFile(IMAGE_URL, 'download');
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


exports.liriklagu = liriklagu;
exports.quotemaker = quotemaker;
exports.randomNimek = randomNimek
exports.fb = fb
exports.emojiStrip = emojiStrip
exports.sleep = sleep