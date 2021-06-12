var fs = require("fs");
function help() {
    return `
┏ ❣ *BOT - Boranbita* ❣
╿
┷┯ ☾ Group Commands ☽
   ╽
   ┠❥ *!add 62858xxxxx*
   ┠❥ *!kick @tagmember*
   ┠❥ *!promote @tagmember*
   ┠❥ *!demote @tagadmin*
   ┠❥ *!mentionAll*
   ┠❥ *!adminList*
   ┠❥ *!ownerGroup*
   ┠❥ *!leave*
   ┠❥ *!linkGroup*
   ┠❥ *!delete [replyChatBot]*
   ┠❥ *!kickAll*
   ┠❥ *!NSFW [enable|disable]*
   ┠❥ *!restrictMember [enable|disable]*
   ┠❥ *!welcome [enable|disable]*
   ╿
┯┷ ☾ Downloader Commands ☽
╽
┠❥ *!ytmp3 [linkYt]*
┠❥ *!ytmp4 [linkYt]*
╿
┷┯ ☾ Others Commands ☽
   ╽
   ┠❥ *!sticker*
   ┠❥ *!stickerGif* *!sgif*
   ┠❥ *!neko*
   ┠❥ *!inu*
   ┠❥ *!tts [jp|en] [text]*
   ┠❥ *!anime [query]*
   ┠❥ *!husbu*
   ┠❥ *!waifu*
   ┠❥ *!randomTrapNime*
   ┠❥ *!randomAnime*
   ┠❥ *!meme*
   ┠❥ *!quotemaker [|teks|author|theme]*
   ┠❥ *!join [linkGroup]*
   ┠❥ *!wait*
   ┠❥ *!lyrics [optional]*
   ╿
   ╿
   ╰╼❥ Send the command *!readme* to find out the function and how to use the command above, MUST READ!!.`
}
exports.help = help()
function readme() {
    return `
    *[linkYt]* Filled with valid YouTube links without “[” and “]” signs
    Example: *!ytmp3 https://youtu.be/Bskehapzke8*
    
    *[linkYt]* Filled with valid YouTube links without “[” and “]” signs
    Example: *!ytmp4 https://youtu.be/Bskehapzke8*
    
    *[linkGroup]* Filled with a valid whatsapp group link, without the "[" and "]" signs.
    Example: *!join https://chat.whatsapp.com/Bhhw77d5t2gjao8*
    `
}
exports.readme = readme()

function langCode (){
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
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
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
    'mr': 'Marathi',
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

module.exports.youtube_parser = function youtube_parser(url){
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].length==11)? match[1] : false;
}

module.exports.getFileSize = function getFilesize(filename) {
    var stats = fs.statSync(filename);
    var fileSize = Math.round(stats.size / (1024*1024));
    return fileSize;
}