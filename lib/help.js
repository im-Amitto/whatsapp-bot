var fs = require("fs");

function help() {
    return `
┏ ❣ *BOT - Parle-G* ❣
┠❥ *Github: https://github.com/im-Amitto/whatsapp-bot* 
┠❥ Please do not share sensitive information
┷┯ ☾ Group Commands ☽
   ╽
   ┠❥ *!add 62858xxxxx*
   ╰╼❥  *!add 9876543210*
   ┠❥ *!kick @tagmember*
   ┠❥ *!promote @tagmember*
   ┠❥ *!demote @tagadmin*
   ┠❥ *!mentionAll*
   ┠❥ *!adminList*
   ┠❥ *!ownerGroup*
   ┠❥ *!leave*
   ┠❥ *!linkGroup*
   ┠❥ *!delete [replyChatBot]*
   ╰╼❥  *Deletes bot message*
   ┠❥ *!kickAll*
   ┠❥ *!NSFW [enable|disable]*
   ╰╼❥  *!nsfw enable*
   ┠❥ *!restrictMember [enable|disable]*
   ┠❥ *!welcome [enable|disable]*
   ╿
┯┷ ☾ Downloader Commands ☽
╽
┠❥ *!ytmp3 [linkYt]*
╰╼❥  *!ytmp3 https://www.youtube.com/watch?v=668nUCeBHyY*
┠❥ *!ytmp4 [linkYt]*
╰╼❥  *!ytmp4 https://www.youtube.com/watch?v=668nUCeBHyY*
┠❥ *!fb [linkFb]*
╰╼❥  *!fb https://fb.watch/6566Rh248I/*
╿
┷┯ ☾ Others Commands ☽
   ╽
   ┠❥ *!instagram [username]*
   ┠❥ *!sticker*
   ╰╼❥  *Send this with image or reply with this*
   ┠❥ *!sgif*
   ╰╼❥  *Send this with gif/video or reply with this*
   ┠❥ *!neko*
   ┠❥ *!inu*
   ┠❥ *!tts [langcode] [text]*
   ╰╼❥  *!readme has examples*
   ┠❥ *!anime [query]*
   ┠❥ *!husbu*
   ┠❥ *!waifu*
   ┠❥ *!randomTrap*
   ┠❥ *!randomAnime*
   ┠❥ *!randomDva*
   ┠❥ *!randomHug*
   ┠❥ *!randomNeko*
   ┠❥ *!randomBaguette*
   ┠❥ *!meme*
   ┠❥ *!quotemaker [?text?author]*
   ┠❥ *!join [linkGroup]*
   ╰╼❥  *Share the bot*
   ┠❥ *!wait*
   ╰╼❥  *Reply anime pic with this and it will give info*
   ┠❥ *!lyrics [optional]*
   ╿
   ╿
   ╰╼❥ Send the command *!readme* to find out the function and how to use the command above, MUST READ!!.
   ╰╼❥ Need a new feature or facing an issue? Star the repo and create an issue @ https://github.com/im-Amitto/whatsapp-bot .`
}
exports.help = help()

function readme() {
    return `
*!tts [lang code] [message]* Lang is an optional
    Example: *!tts Hello* // Will say hello
    *!tts hi hi* // Will say Namaste (hi = Hindi)
    *!tts ja hi* // Will say Sayōnara (ja = Japanese)
    Use *!lang* to see complete list of lang codes

*!join <Group Link>* Adds bot to group chat.
    Example: *!join https://chat.whatsapp.com/Bhhw77d5t2gjao8*
    `
}
exports.readme = readme()

function langCode() {
    return `
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-CN': 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'ht': 'Haitian Creole',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
    `
}
exports.langCode = langCode()
module.exports.getlangCodes = function getlangCodes() {
    return ['af',
        'sq',
        'am',
        'ar',
        'hy',
        'az',
        'eu',
        'be',
        'bn',
        'bs',
        'bg',
        'ca',
        'ceb',
        'ny',
        'zh-CN',
        'zh-TW',
        'co',
        'hr',
        'cs',
        'da',
        'nl',
        'en',
        'eo',
        'et',
        'tl',
        'fi',
        'fr',
        'fy',
        'gl',
        'ka',
        'de',
        'el',
        'ht',
        'haw',
        'iw',
        'hi',
        'hmn',
        'hu',
        'is',
        'ig',
        'id',
        'ga',
        'it',
        'ja',
        'jw',
        'kn',
        'kk',
        'km',
        'ko',
        'ku',
        'ky',
        'lo',
        'la',
        'lv',
        'lt',
        'lb',
        'mk',
        'mg',
        'ms',
        'ml',
        'mt',
        'mi',
        'mn',
        'my',
        'ne',
        'no',
        'ps',
        'fa',
        'pl',
        'pt',
        'pa',
        'ro',
        'ru',
        'sm',
        'gd',
        'sr',
        'st',
        'sn',
        'sd',
        'si',
        'sk',
        'sl',
        'so',
        'es',
        'su',
        'sw',
        'sv',
        'tg',
        'ta',
        'te',
        'th',
        'tr',
        'uk',
        'ur',
        'uz',
        'vi',
        'cy',
        'xh',
        'yi',
        'yo',
        'zu'
    ];
}
module.exports.youtube_parser = function youtube_parser(url) {
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[1].length == 11) ? match[1] : false;
}

module.exports.getFileSize = function getFilesize(filename) {
    var stats = fs.statSync(filename);
    var fileSize = Math.round(stats.size / (1024 * 1024));
    return fileSize;
}